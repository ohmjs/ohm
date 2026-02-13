import {assert, checkNotNull} from './assert.ts';
import {getLineAndColumn, getLineAndColumnMessage} from './extras.ts';

const MATCH_RECORD_TYPE_MASK = 0b11;

// A MatchRecord is the representation of a CstNode in Wasm linear memory.
const MatchRecordType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  ITER_FLAG: 2,
  OPTIONAL: 3,
} as const;

// A _CST node_ is the user-facing representation, built from a match record.
export const CstNodeType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  LIST: 2,
  OPT: 3,
  SEQ: 4,
} as const;

// Define types with the same name as the values above. This gives us roughly the
// same functionality as a TypeScript enum, but works with erasableSyntaxOnly.
type MatchRecordType = (typeof MatchRecordType)[keyof typeof MatchRecordType];
export type CstNodeType = (typeof CstNodeType)[keyof typeof CstNodeType];

const EMPTY_CHILDREN: ReadonlyArray<CstNode> = Object.freeze([]);

const compileOptions = {
  builtins: ['js-string'],
};

// Bit flags for Unicode categories, based on the order that they appear in
// https://www.unicode.org/Public/16.0.0/ucd/extracted/DerivedGeneralCategory.txt

const UnicodeCategoryNames = [
  'Cn', // Unassigned
  'Lu', // Uppercase_Letter
  'Ll', // Lowercase_Letter
  'Lt', // Titlecase_Letter
  'Lm', // Modifier_Letter
  'Lo', // Other_Letter
];

const utf8 = new TextDecoder('utf-8');

// Minimal implementation of Interval (for FailedMatchResult)
export class Interval {
  startIdx: number;
  endIdx: number;
  private _sourceString: string;

  constructor(sourceString: string, startIdx: number, endIdx: number) {
    this._sourceString = sourceString;
    this.startIdx = startIdx;
    this.endIdx = endIdx;
  }

  get sourceString(): string {
    return this._sourceString;
  }

  get contents(): string {
    return this._sourceString.slice(this.startIdx, this.endIdx);
  }
}

export class Failure {
  private _description: string;
  private _fluffy: boolean;

  constructor(description: string, fluffy: boolean) {
    this._description = description;
    this._fluffy = fluffy;
  }

  isFluffy(): boolean {
    return this._fluffy;
  }

  toString(): string {
    return this._description;
  }
}

function regexFromCategoryBitmap(bitmap: number): RegExp {
  const cats: string[] = [];
  for (let i = 0; i < 32; i++) {
    const mask = 1 << i;
    if (bitmap & mask) cats.push(UnicodeCategoryNames[i]);
  }
  return new RegExp(
    cats.map(cat => `\\p{${cat}}`).join('|'),
    'uy' // u: unicode, y: sticky
  );
}

function parseStringTable(module: WebAssembly.Module, sectionName: string): string[] {
  const sections = WebAssembly.Module.customSections(module, sectionName);
  assert(
    sections.length === 1,
    `Expected one ${sectionName} section, found ${sections.length}`
  );

  const data = new Uint8Array(sections[0]);
  const dataView = new DataView(data.buffer);
  let offset = 0;

  const parseU32 = (): number => {
    // Quick 'n dirty ULeb128 parsing, assuming no more than 2 bytes.
    const b1 = dataView.getUint8(offset++);
    let value = b1 & 0x7f;
    if (b1 & 0x80) {
      const b2 = dataView.getUint8(offset++);
      assert((b2 & 0x80) === 0, 'Expected max two bytes');
      value |= (b2 & 0x7f) << 7;
    }
    return value;
  };

  const decoder = new TextDecoder('utf-8');
  const numEntries = parseU32();
  const ans: string[] = [];
  for (let i = 0; i < numEntries; i++) {
    const stringLen = parseU32();
    const bytes = data.slice(offset, offset + stringLen);
    offset += stringLen;
    const name = decoder.decode(bytes);
    ans.push(name);
  }
  return ans;
}

export class WasmGrammar {
  name = '';

  private _instance?: WebAssembly.Instance = undefined;
  private _imports = {
    // System-level AssemblyScript imports.
    env: {
      abort(/* message: usize, fileName: usize, line: u32, column: u32 */) {
        throw new Error('abort');
      },
    },
    // For imports from ohmRuntime.ts.
    ohmRuntime: {
      printI32(val: number) {
        // eslint-disable-next-line no-console
        console.log(val);
      },
      isRuleSyntactic: (ruleId: number) => {
        // TODO: Precompute this for all rules, and encode it in the module?
        const name = this._ruleNames[ruleId];
        assert(!!name);
        return name[0] === name[0].toUpperCase();
      },
      fillInputBuffer: this._fillInputBuffer.bind(this),
      matchUnicodeChar: (catBitmap: number) => {
        const {input, pos} = (this._instance as any).exports;
        const re = regexFromCategoryBitmap(catBitmap);
        re.lastIndex = pos;
        const arr = re.exec(input.value);
        if (arr) {
          pos.value += arr[0].length;
        }
        return !!arr;
      },
    },
    // Include a polyfill for js-string builtins for engines that don't
    // support that feature (e.g., Safari).
    'wasm:js-string': {
      length(str: string): number {
        return str.length;
      },
      charCodeAt(str: string, idx: number): number {
        // NOTE: `index` is interpreted as a signed 32-bit integer when converted to
        // a JS value using standard conversions. Reinterpret as unsigned here.
        idx >>>= 0;
        assert(idx < str.length, 'string index out of bounds');
        return str.charCodeAt(idx);
      },
    },
  };
  private _ruleIds = new Map<string, number>();
  private _ruleNames: string[] = [];
  private _input = '';

  public _failureDescriptions: string[] = []; // Should be treated as package private

  private _resultStack: MatchResult[] = [];

  /**
   * Create a new WasmGrammar object.
   * If `bytes` is specified, the WebAssembly module will be synchronously
   * compiled and instantiated. Use `instantiate` or `instantiateStreaming`
   * to instantiate asynchronously.
   */
  constructor(bytes?: BufferSource) {
    if (bytes) {
      // @ts-expect-error: TS2554: Expected 1 arguments, but got 2.
      const mod = new WebAssembly.Module(bytes, compileOptions);
      this._init(mod, new WebAssembly.Instance(mod, this._imports));
    }
  }

  private _init(module: WebAssembly.Module, instance: WebAssembly.Instance) {
    this._instance = instance;
    this._extractStrings(module);
    this._initMemoConfig(module);
    this.name = this._getGrammarName(module);
    return this;
  }

  private _initMemoConfig(module: WebAssembly.Module) {
    const sections = WebAssembly.Module.customSections(module, 'memoizedRuleCount');
    assert(sections.length === 1, 'Expected one memoizedRuleCount section');
    const view = new DataView(sections[0]);
    const count = view.getUint32(0, true); // little-endian
    (this._instance as any).exports.setNumMemoizedRules(count);
  }

  _manage(result: MatchResult) {
    result._managed = true;
  }

  _dispose(result: MatchResult) {
    assert(
      this._resultStack.at(-1) === result,
      `You can only dispose() the most recent MatchResult`
    );
    this._resultStack.pop();
    if (this._resultStack.length === 0) {
      (this._instance as any).exports.resetHeap();
    }
    result._attached = false;
  }

  static async instantiate(source: BufferSource): Promise<WasmGrammar> {
    return new WasmGrammar()._instantiate(source);
  }

  static async instantiateStreaming(
    source: Response | Promise<Response>
  ): Promise<WasmGrammar> {
    return new WasmGrammar()._instantiateStreaming(source);
  }

  async _instantiate(source: BufferSource, debugImports: any = {}) {
    const {module, instance} = await WebAssembly.instantiate(
      source,
      {
        ...this._imports,
        debug: debugImports,
      },
      // @ts-expect-error: Expected 1-2 arguments, but got 3.
      compileOptions
    );
    return this._init(module, instance);
  }

  async _instantiateStreaming(
    source: Response | Promise<Response>,
    debugImports: any = {}
  ): Promise<WasmGrammar> {
    const {module, instance} = await WebAssembly.instantiateStreaming(
      source,
      {
        ...this._imports,
        debug: debugImports,
      },
      // @ts-expect-error: TS2554: Expected 1-2 arguments, but got 3.
      compileOptions
    );
    return this._init(module, instance);
  }

  private _getGrammarName(module: WebAssembly.Module): string {
    const sections = WebAssembly.Module.customSections(module, 'name');
    assert(sections.length === 1, `Expected one name section, found ${sections.length}`);
    const data = new Uint8Array(sections[0]);
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(data);
  }

  private _extractStrings(module: WebAssembly.Module): void {
    assert(this._ruleNames.length === 0);
    assert(this._ruleIds.size === 0);
    for (const ruleName of parseStringTable(module, 'ruleNames')) {
      this._ruleIds.set(ruleName, this._ruleIds.size);
      this._ruleNames.push(ruleName);
    }
    for (const str of parseStringTable(module, 'failureDescriptions')) {
      this._failureDescriptions.push(str);
    }
  }

  match<T>(input: string, ruleName?: string): MatchResult {
    assert(
      this._resultStack.every(r => r._managed),
      'Cannot match while there are unmanaged MatchResults. ' +
        'Use `using` or `.use()` to manage the MatchResult lifecycle.'
    );
    this._input = input;
    if (typeof process !== 'undefined' && process.env.OHM_DEBUG === '1') debugger; // eslint-disable-line no-debugger
    const ruleId = checkNotNull(
      this._ruleIds.get(ruleName || this._ruleNames[0]),
      `unknown rule: '${ruleName}'`
    );
    const succeeded = (this._instance as any).exports.match(input, ruleId);
    const ctx = {
      ruleNames: this._ruleNames,
      view: new DataView((this._instance as any).exports.memory.buffer),
      input: (this._instance as any).exports.input.value,
    };
    const result = createMatchResult(this, ruleName || this._ruleNames[0], ctx, !!succeeded);
    result.dispose = this._dispose.bind(this, result);
    this._resultStack.push(result);
    return result;
  }

  recordFailures() {
    const {exports} = this._instance as any;
    exports.recordFailures(this._ruleIds.get(this._ruleNames[0]));
    const ans: number[] = [];
    for (let i = 0; i < exports.getRecordedFailuresLength(); i++) {
      if (!exports.isFluffy(i)) {
        // Filter out fluffy failures
        ans.push(exports.recordedFailuresAt(i));
      }
    }
    // Deduplicate
    return [...new Set(ans)];
  }

  getFailureDescription(id: number): string {
    return this._failureDescriptions[id];
  }

  getMemorySizeBytes(): number {
    return (this._instance as any).exports.memory.buffer.byteLength;
  }

  getCstRoot(): CstNode {
    const {exports} = this._instance as any;
    const {buffer} = exports.memory;
    const ctx = {
      ruleNames: this._ruleNames,
      view: new DataView(buffer),
      input: exports.input.value,
    };
    const firstNode = new CstNodeImpl(ctx, exports.bindingsAt(0), 0);
    assert(firstNode.isNonterminal());
    if (firstNode.ctorName !== '$spaces') {
      return firstNode;
    }
    assert(exports.getBindingsLength() > 1 && firstNode.ctorName === '$spaces');
    const nextAddr = exports.bindingsAt(1);
    const root = new CstNodeImpl(ctx, nextAddr, firstNode.matchLength);
    root.leadingSpaces = firstNode;
    return root as CstNode;
  }

  private _fillInputBuffer(ptr: number, length: number): number {
    const encoder = new TextEncoder();
    const {memory} = (this._instance as any).exports;
    const buf = new Uint8Array(memory.buffer, ptr, length);
    const {read, written} = encoder.encodeInto(this._input, buf);
    assert(read === this._input.length, 'Input was not fully read');
    return written;
  }

  getRightmostFailurePosition(): number {
    return (this._instance as any).exports.rightmostFailurePos.value;
  }
}

interface MatchContext {
  ruleNames: string[];
  view: DataView;
  input: string;
}

export type CstNode = NonterminalNode | TerminalNode | ListNode | OptNode | SeqNode;
export type CstNodeChildren = readonly CstNode[];

export interface CstNodeBase {
  ctorName: string;
  source: {startIdx: number; endIdx: number};
  sourceString: string;
  matchLength: number;

  isNonterminal(): this is NonterminalNode;
  isTerminal(): this is TerminalNode;
  isOptional(): this is OptNode;
  isSeq(): this is SeqNode;
  isList(): this is ListNode;
}

export interface NonterminalNode<TChildren extends CstNodeChildren = CstNodeChildren>
  extends CstNodeBase {
  type: typeof CstNodeType.NONTERMINAL;
  ctorName: string;
  leadingSpaces?: NonterminalNode;
  children: TChildren;

  isSyntactic(): boolean;
  isLexical(): boolean;
}

export interface TerminalNode extends CstNodeBase {
  type: typeof CstNodeType.TERMINAL;
  ctorName: '_terminal';
  leadingSpaces?: NonterminalNode;
  children: readonly [];
  value: string;
}

export interface ListNode<TNode extends CstNode = CstNode> extends CstNodeBase {
  type: typeof CstNodeType.LIST;
  ctorName: '_list';
  children: readonly TNode[];
  collect: <R>(cb: (...children: CstNode[]) => R) => R[];
}

export interface OptNode<TChild extends CstNode = CstNode> extends CstNodeBase {
  type: typeof CstNodeType.OPT;
  ctorName: '_opt';
  children: [] | [TChild];

  // If the child is a SeqNode, the `consume` callback receives its unpacked children.
  // Otherwise, it receives the child node itself.
  ifPresent<R>(
    consume: TChild extends SeqNode<infer T> ? (...children: T) => R : (child: TChild) => R,
    orElse?: () => R
  ): R;
  ifPresent<R>(
    consume: TChild extends SeqNode<infer T> ? (...children: T) => R : (child: TChild) => R
  ): R | undefined;
  isPresent(): boolean;
  isEmpty(): boolean;
}

export interface SeqNode<TChildren extends CstNodeChildren = CstNodeChildren>
  extends CstNodeBase {
  type: typeof CstNodeType.SEQ;
  ctorName: '_seq';
  children: TChildren;
  unpack: <R>(cb: (...children: TChildren) => R) => R;
}

export class CstNodeImpl implements CstNodeBase {
  _ctx!: MatchContext;
  _children?: CstNodeChildren = undefined;
  _base: number;
  startIdx: number;
  leadingSpaces?: NonterminalNode = undefined;
  source: {startIdx: number; endIdx: number};

  constructor(ctx: MatchContext, ptr: number, startIdx: number) {
    // Non-enumerable properties
    Object.defineProperties(this, {
      _ctx: {value: ctx},
      _children: {writable: true},
    });
    this._base = ptr;
    this.startIdx = startIdx;
    this.source = {
      startIdx,
      endIdx: startIdx + this.sourceString.length,
    };
    if (this.matchRecordType === MatchRecordType.TERMINAL || this.count === 0) {
      this._children = EMPTY_CHILDREN;
    }
  }

  get type(): CstNodeType {
    switch (this._typeAndDetails & MATCH_RECORD_TYPE_MASK) {
      case MatchRecordType.NONTERMINAL:
        return CstNodeType.NONTERMINAL;
      case MatchRecordType.TERMINAL:
        return CstNodeType.TERMINAL;
      case MatchRecordType.ITER_FLAG:
        return CstNodeType.LIST;
      default:
        throw new Error('unreachable');
    }
  }

  private get matchRecordType(): MatchRecordType {
    return (this._typeAndDetails & MATCH_RECORD_TYPE_MASK) as MatchRecordType;
  }

  isNonterminal(): this is NonterminalNode {
    return this.type === CstNodeType.NONTERMINAL;
  }

  isTerminal(): this is TerminalNode {
    return this.type === CstNodeType.TERMINAL;
  }

  isList(): this is ListNode {
    return this.type === CstNodeType.LIST;
  }

  isOptional(): this is OptNode {
    return this.type === CstNodeType.OPT;
  }

  isSeq(): this is SeqNode {
    return this.type === CstNodeType.SEQ;
  }

  get ctorName(): string {
    switch (this.type) {
      case CstNodeType.NONTERMINAL: {
        const {ruleNames, view} = this._ctx;
        const ruleId = view.getInt32(this._base + 8, true) >>> 2;
        return ruleNames[ruleId].split('<')[0];
      }
      case CstNodeType.TERMINAL:
        return '_terminal';
      case CstNodeType.LIST:
        return '_list';
      case CstNodeType.OPT:
        return '_opt';
      case CstNodeType.SEQ:
        return '_seq';
    }
  }

  get count(): number {
    return this._ctx.view.getUint32(this._base, true);
  }

  get matchLength(): number {
    return this._ctx.view.getUint32(this._base + 4, true);
  }

  get _typeAndDetails(): number {
    return this._ctx.view.getInt32(this._base + 8, true);
  }

  get arity(): number {
    return this._typeAndDetails >>> 2;
  }

  get children(): CstNodeChildren {
    if (!this._children) {
      this._children = this._computeChildren().map((n): CstNode => {
        const {matchRecordType} = n;
        if (matchRecordType === MatchRecordType.OPTIONAL) {
          const child: CstNode | undefined =
            n.children.length <= 1
              ? n.children[0]
              : new SeqNodeImpl(n.children, n.source, n.sourceString);
          return new OptNodeImpl(child, n.source, n.sourceString);
        } else if (matchRecordType === MatchRecordType.ITER_FLAG) {
          if (n.arity <= 1) {
            return new ListNodeImpl(n.children, n.source, n.sourceString);
          }
          const arr: CstNode[] = [];
          let startIdx = n.startIdx;
          for (let i = 0; i < n.children.length; i += n.arity) {
            // FIXME: We don't need any of this nonsense if we actually build the SeqNodes at parse time.
            const seqChildren = n.children.slice(i, i + n.arity);
            const endIdx = checkNotNull(seqChildren.at(-1)).source.endIdx;
            const sourceString = n._ctx.input.slice(startIdx, endIdx);
            arr.push(new SeqNodeImpl(seqChildren, {startIdx, endIdx}, sourceString));
            startIdx = endIdx;
          }
          assert(startIdx === n.source.endIdx);
          return new ListNodeImpl(arr, n.source, n.sourceString);
        }
        return n as CstNode; // FIXME
      });
    }
    return this._children;
  }

  _computeChildren(): CstNodeImpl[] {
    const children: CstNodeImpl[] = [];
    const {ruleNames, view, input} = this._ctx;
    let spaces: NonterminalNode | undefined;
    let {startIdx} = this;
    for (let i = 0; i < this.count; i++) {
      const slotOffset = this._base + 16 + i * 4;
      const ptr = view.getUint32(slotOffset, true);
      // TODO: Avoid allocating $spaces nodes altogether?
      const node = new CstNodeImpl(this._ctx, ptr, startIdx);
      if (
        node.matchRecordType === MatchRecordType.NONTERMINAL &&
        node.ctorName === '$spaces'
      ) {
        assert(!spaces, 'Multiple $spaces nodes found');
        spaces = node as NonterminalNode; // FIXME
      } else {
        if (spaces) {
          node.leadingSpaces = spaces;
          spaces = undefined;
        }
        children.push(node);
      }
      startIdx += node.matchLength;
    }
    assert(spaces === undefined, 'Unclaimed $spaces!');
    return children;
  }

  get sourceString(): string {
    return this._ctx.input.slice(this.startIdx, this.startIdx + this.matchLength);
  }

  isSyntactic(): boolean {
    assert(this.isNonterminal(), 'Not a nonterminal');
    const firstChar = this.ctorName[0];
    return firstChar === firstChar.toUpperCase();
  }

  isLexical(): boolean {
    assert(this.isNonterminal(), 'Not a nonterminal');
    return !this.isSyntactic();
  }

  toString(): string {
    const ctorName = this.isTerminal() ? '_terminal' : this.isSeq() ? '_iter' : this.ctorName;
    const {sourceString, startIdx} = this;
    return `CstNode {ctorName: ${ctorName}, sourceString: ${sourceString}, startIdx: ${startIdx} }`;
  }
}

abstract class WrapperNode implements CstNodeBase {
  abstract ctorName: string;
  source: {startIdx: number; endIdx: number};
  sourceString: string;

  constructor(source: {startIdx: number; endIdx: number}, sourceString: string) {
    this.source = source;
    this.sourceString = sourceString;
  }

  get matchLength(): number {
    return this.sourceString.length;
  }

  isNonterminal(): this is NonterminalNode {
    return false;
  }
  isTerminal(): this is TerminalNode {
    return false;
  }
  isOptional(): this is OptNode {
    return false;
  }
  isSeq(): this is SeqNode {
    return false;
  }
  isList(): this is ListNode {
    return false;
  }
}

export class SeqNodeImpl<TChildren extends CstNodeChildren = CstNodeChildren>
  extends WrapperNode
  implements SeqNode<TChildren>
{
  type = CstNodeType.SEQ;
  ctorName = '_seq' as const;
  children: TChildren;

  constructor(
    children: TChildren,
    source: {startIdx: number; endIdx: number},
    sourceString: string
  ) {
    super(source, sourceString);
    this.children = children;
  }

  override isSeq(): this is SeqNode {
    return true;
  }

  unpack<R>(cb: (...args: TChildren) => R): R {
    assert(
      cb.length === this.children.length,
      `bad arity: expected ${this.children.length}, got ${cb.length}`
    );
    return cb.call(null, ...this.children); // FIXME
  }
}

export class ListNodeImpl<TNode extends CstNode = CstNode>
  extends WrapperNode
  implements ListNode<TNode>
{
  type = CstNodeType.LIST;
  ctorName = '_list' as const;
  children: readonly TNode[];

  constructor(
    children: readonly TNode[],
    source: {startIdx: number; endIdx: number},
    sourceString: string
  ) {
    super(source, sourceString);
    this.children = children;
  }

  override isList(): this is ListNode {
    return true;
  }

  collect<R>(cb: (...args: CstNode[]) => R): R[] {
    return this.children.map(c => {
      return c?.isSeq() ? c.unpack(cb) : cb(c);
    });
  }
}

export class OptNodeImpl<TNode extends CstNode = CstNode>
  extends WrapperNode
  implements OptNode<TNode>
{
  type = CstNodeType.OPT;
  ctorName = '_opt' as const;
  children: [] | [TNode];

  constructor(
    child: TNode | undefined,
    source: {startIdx: number; endIdx: number},
    sourceString: string
  ) {
    super(source, sourceString);
    this.children = child ? [child] : [];
  }

  override isOptional(): this is OptNode {
    return true;
  }

  ifPresent<R>(
    consume: TNode extends SeqNode<infer T> ? (...children: T) => R : (child: TNode) => R,
    orElse?: () => R
  ): R | undefined {
    const child = this.children[0];
    if (child) {
      return child.isSeq()
        ? child.unpack(consume as (...children: any[]) => R)
        : (consume as (child: TNode) => R)(child);
    }
    if (orElse) return orElse();
  }

  isPresent(): boolean {
    return this.children.length > 0;
  }

  isEmpty(): boolean {
    return this.children.length === 0;
  }
}

export class MatchResult {
  // Note: This is different from the JS implementation, which has:
  //    matcher: Matcher;
  // …instead.
  grammar: WasmGrammar;
  startExpr: string;
  _ctx: MatchContext;
  _succeeded: boolean;
  _attached = true;
  _managed = false;

  constructor(grammar: WasmGrammar, startExpr: string, ctx: MatchContext, succeeded: boolean) {
    this.grammar = grammar;
    this.startExpr = startExpr;
    this._ctx = ctx;
    this._succeeded = succeeded;
  }

  get input(): string {
    return (this.grammar as any)._input;
  }

  // `using` accesses [Symbol.dispose] at declaration time to get the
  // disposal method. We use this as the signal that the result is managed.
  get [Symbol.dispose](): () => void {
    this.grammar._manage(this);
    return () => this.dispose();
  }

  dispose() {
    throw new Error('MatchResult is not attached to any grammar');
  }

  succeeded(): this is SucceededMatchResult {
    return this._succeeded;
  }

  failed(): this is FailedMatchResult {
    return !this._succeeded;
  }

  toString(): string {
    return this.failed()
      ? '[match failed at position ' + this.getRightmostFailurePosition() + ']'
      : '[match succeeded]';
  }

  use<T>(cb: (r: this) => T): T {
    this.grammar._manage(this);
    try {
      return cb(this);
    } finally {
      this.dispose();
    }
  }
}

function createMatchResult(
  grammar: WasmGrammar,
  startExpr: string,
  ctx: MatchContext,
  succeeded: boolean
): MatchResult {
  return succeeded
    ? new SucceededMatchResult(grammar, startExpr, ctx, succeeded)
    : new FailedMatchResult(
        grammar,
        startExpr,
        ctx,
        succeeded,
        grammar.getRightmostFailurePosition()
      );
}

export class SucceededMatchResult extends MatchResult {
  _cst: CstNode;

  constructor(grammar: WasmGrammar, startExpr: string, ctx: MatchContext, succeeded: boolean) {
    super(grammar, startExpr, ctx, succeeded);
    this._cst = grammar.getCstRoot();
  }

  getCstRoot(): CstNode {
    return this._cst;
  }
}

export class FailedMatchResult extends MatchResult {
  _rightmostFailurePosition: number;
  private _rightmostFailures: Failure[] | null = null;
  private _failureDescriptions: string[] | null = null;

  constructor(
    grammar: WasmGrammar,
    startExpr: string,
    ctx: MatchContext,
    succeeded: boolean,
    rightmostFailurePosition: number
  ) {
    super(grammar, startExpr, ctx, succeeded);
    this._rightmostFailurePosition = rightmostFailurePosition;
  }

  private _assertAttached(property: string) {
    if (!this._attached) {
      throw new Error(
        `Cannot access '${property}' after MatchResult has been disposed. ` +
          `Access failure information before calling dispose(), or use result.use().`
      );
    }
  }

  getRightmostFailurePosition(): number {
    return this._rightmostFailurePosition;
  }

  getRightmostFailures(): Failure[] {
    if (this._rightmostFailures === null) {
      this._assertAttached('getRightmostFailures()');
      const {exports} = (this.grammar as any)._instance;
      const ruleIds = (this.grammar as any)._ruleIds;
      const ruleNames = (this.grammar as any)._ruleNames;
      exports.recordFailures(ruleIds.get(ruleNames[0]));

      // Use a Map to deduplicate by description while preserving fluffy status.
      // A failure is only fluffy if ALL occurrences are fluffy.
      const failureMap = new Map<string, boolean>();
      const len = exports.getRecordedFailuresLength();
      for (let i = 0; i < len; i++) {
        const id = exports.recordedFailuresAt(i);
        const desc = this.grammar.getFailureDescription(id);
        const fluffy = exports.isFluffy(i);
        if (failureMap.has(desc)) {
          // Only keep fluffy=true if both are fluffy
          failureMap.set(desc, failureMap.get(desc)! && fluffy);
        } else {
          failureMap.set(desc, fluffy);
        }
      }

      this._rightmostFailures = Array.from(failureMap.entries()).map(
        ([desc, fluffy]) => new Failure(desc, fluffy)
      );
    }
    return this._rightmostFailures;
  }

  // Get the non-fluffy failure descriptions.
  private _getFailureDescriptions(): string[] {
    if (this._failureDescriptions === null) {
      this._failureDescriptions = this.getRightmostFailures()
        .filter(f => !f.isFluffy())
        .map(f => f.toString());
    }
    return this._failureDescriptions;
  }

  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText(): string {
    assert(!this._succeeded, 'cannot get expected text of a successful MatchResult');
    const descriptions = this._getFailureDescriptions();
    switch (descriptions.length) {
      case 0:
        return '';
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + ' or ' + descriptions[1];
      default:
        // For 3+ items: "a, b, or c"
        return (
          descriptions.slice(0, -1).join(', ') +
          ', or ' +
          descriptions[descriptions.length - 1]
        );
    }
  }

  getInterval(): Interval {
    const pos = this.getRightmostFailurePosition();
    return new Interval(this.input, pos, pos);
  }

  get message(): string {
    const detail = 'Expected ' + this.getExpectedText();
    return getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
  }

  get shortMessage(): string {
    const detail = 'expected ' + this.getExpectedText();
    const errorInfo = getLineAndColumn(this.input, this.getRightmostFailurePosition());
    return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
  }
}
