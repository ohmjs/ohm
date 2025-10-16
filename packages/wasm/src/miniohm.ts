import {assert, checkNotNull} from './assert.ts';

const MATCH_RECORD_TYPE_MASK = 0b11;

// A MatchRecord is the representation of a CstNode in Wasm linear memory.
const MatchRecordType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  ITER_FLAG: 2,
  OPTIONAL: 3,
} as const;

type MatchRecordType = (typeof MatchRecordType)[keyof typeof MatchRecordType];

export const CstNodeType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  SEQ: 2,
  LIST: 3,
} as const;

export type CstNodeType = (typeof CstNodeType)[keyof typeof CstNodeType];

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

  private _resultStack: MatchResult[] = [];
  private _managedResultCount = 0;

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
    this._extractRuleIds(module);
    this.name = this._getGrammarName(module);
    return this;
  }

  _beginUse(result: MatchResult) {
    assert(
      this._resultStack.at(-1) === result,
      `You can only use() the most recent MatchResult`
    );
    result.detach = () => {
      throw new Error("MatchResult shouldn't be detached inside use()");
    };
    this._managedResultCount++;
  }

  _endUse(result: MatchResult) {
    const r = this._resultStack.pop();
    assert(r === result, 'Mismatched _endUse');
    this._managedResultCount--;
    if (this._resultStack.length === 0) {
      (this._instance as any).exports.resetHeap();
    }
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

  private _extractRuleIds(module: WebAssembly.Module): void {
    const sections = WebAssembly.Module.customSections(module, 'ruleNames');
    assert(sections.length === 1, `Expected one ruleNames section, found ${sections.length}`);

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
    for (let i = 0; i < numEntries; i++) {
      const stringLen = parseU32();
      const bytes = data.slice(offset, offset + stringLen);
      offset += stringLen;
      const name = decoder.decode(bytes);
      this._ruleIds.set(name, i);
      this._ruleNames.push(name);
    }
  }

  private _detachMatchResult(result: MatchResult) {
    assert(
      this._resultStack.at(-1) === result,
      `You can only detach() the most recent MatchResult`
    );
    this._beginUse(result);
    this._endUse(result);
  }

  match<T>(input: string, ruleName?: string): MatchResult {
    assert(
      this._resultStack.length === this._managedResultCount,
      'Cannot match while there are unmanaged MatchResults'
    );
    this._input = input;
    if (process.env.OHM_DEBUG === '1') debugger; // eslint-disable-line no-debugger
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
    result.detach = this._detachMatchResult.bind(this, result);
    this._resultStack.push(result);
    return result;
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

export interface MatchContext {
  ruleNames: string[];
  view: DataView;
  input: string;
}

export type CstNode = NonterminalNode | TerminalNode | SeqNode | ListNode;
export type CstNodeChildren = readonly (CstNode | null)[];

export interface CstNodeBase {
  ctorName: string;
  source: {startIdx: number; endIdx: number};
  sourceString: string;
  matchLength: number;

  isNonterminal(): this is NonterminalNode;
  isTerminal(): this is TerminalNode;
  isSeq(): this is SeqNode;
  isList(): this is ListNode;
}

export interface NonterminalNode<TChildren extends CstNodeChildren = CstNodeChildren>
  extends CstNodeBase {
  type: typeof CstNodeType.NONTERMINAL;
  ctorName: string;
  leadingSpaces?: NonterminalNode;
  children: TChildren;

  isSyntactic(ruleName?: string): boolean;
  isLexical(ruleName?: string): boolean;
}

export interface TerminalNode extends CstNodeBase {
  type: typeof CstNodeType.TERMINAL;
  ctorName: '_terminal';
  leadingSpaces?: NonterminalNode;
  value: string;
}

export interface SeqNode<TChildren extends CstNodeChildren = CstNodeChildren>
  extends CstNodeBase {
  type: typeof CstNodeType.SEQ;
  ctorName: '_seq';
  children: TChildren;
  unpack: <R>(cb: (...children: TChildren) => R) => R;
}

export interface ListNode<TNode extends CstNode | null = CstNode | null> extends CstNodeBase {
  type: typeof CstNodeType.LIST;
  ctorName: '_list';
  children: readonly TNode[];
  collect: <R>(cb: (...children: (CstNode | null)[]) => R) => R[];
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

  isSeq(): this is SeqNode {
    return this.type === CstNodeType.SEQ;
  }

  isList(): this is ListNode {
    return this.type === CstNodeType.LIST;
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
      case CstNodeType.SEQ:
        return '_seq';
      case CstNodeType.LIST:
        return '_list';
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
      this._children = this._computeChildren().map((n): CstNode | null => {
        const {matchRecordType} = n;
        if (matchRecordType === MatchRecordType.OPTIONAL) {
          const {length} = n.children;
          return length === 0
            ? null
            : length === 1
              ? n.children[0]
              : new SeqNodeImpl(n.children, n.source, n.sourceString);
        } else if (matchRecordType === MatchRecordType.ITER_FLAG) {
          if (n.arity <= 1) {
            return new ListNodeImpl(n.children, n.source, n.sourceString);
          }
          const arr: CstNode[] = [];
          let startIdx = n.startIdx;
          for (let i = 0; i < n.children.length; i += n.arity) {
            // FIXME: We don't need any of this nonsense if we actually build the SeqNodes at parse time.
            const seqChildren = n.children.slice(i, i + n.arity);
            const realChildren = (seqChildren.filter(c => c !== null) as any[]).flat(
              Infinity
            ) as readonly NonNullable<CstNode>[];
            let endIdx = startIdx;
            if (realChildren.at(-1)) {
              endIdx = realChildren.at(-1)!.source.endIdx;
            }
            const sourceString = n._ctx.input.slice(startIdx, endIdx);
            arr.push(new SeqNodeImpl(seqChildren, {startIdx, endIdx}, sourceString));
            startIdx = endIdx;
          }
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

  isSyntactic(ruleName?: string): boolean {
    assert(this.isNonterminal(), 'Not a nonterminal');
    const firstChar = this.ctorName[0];
    return firstChar === firstChar.toUpperCase();
  }

  isLexical(ruleName?: string): boolean {
    assert(this.isNonterminal(), 'Not a nonterminal');
    return !this.isSyntactic(ruleName);
  }

  toString(): string {
    const ctorName = this.isTerminal() ? '_terminal' : this.isSeq() ? '_iter' : this.ctorName;
    const {sourceString, startIdx} = this;
    return `CstNode {ctorName: ${ctorName}, sourceString: ${sourceString}, startIdx: ${startIdx} }`;
  }
}

export class SeqNodeImpl<TChildren extends CstNodeChildren = CstNodeChildren>
  implements SeqNode<TChildren>
{
  type = CstNodeType.SEQ;
  ctorName = '_seq' as const;
  children: TChildren;
  source: {startIdx: number; endIdx: number};
  sourceString: string;

  get matchLength(): number {
    return this.sourceString.length;
  }

  constructor(
    children: TChildren,
    source: {startIdx: number; endIdx: number},
    sourceString: string
  ) {
    this.children = children;
    this.source = source;
    this.sourceString = sourceString;
  }

  isNonterminal(): this is NonterminalNode {
    return false;
  }
  isTerminal(): this is TerminalNode {
    return false;
  }
  isSeq(): this is SeqNode {
    return true;
  }
  isList(): this is ListNode {
    return false;
  }

  unpack<R>(cb: (...args: TChildren) => R): R {
    assert(
      cb.length === this.children.length,
      `bad arity: expected ${this.children.length}, got ${cb.length}`
    );
    return cb.call(null, ...this.children); // FIXME
  }
}

export class ListNodeImpl<TNode extends CstNode | null = CstNode | null>
  implements ListNode<TNode>
{
  type = CstNodeType.LIST;
  ctorName = '_list' as const;
  children: readonly TNode[];
  source: {startIdx: number; endIdx: number};
  sourceString: string;

  get matchLength(): number {
    return this.sourceString.length;
  }

  constructor(
    children: readonly TNode[],
    source: {startIdx: number; endIdx: number},
    sourceString: string
  ) {
    this.children = children;
    this.source = source;
    this.sourceString = sourceString;
  }

  isNonterminal(): this is NonterminalNode {
    return false;
  }
  isTerminal(): this is TerminalNode {
    return false;
  }
  isSeq(): this is SeqNode {
    return false;
  }
  isList(): this is ListNode {
    return true;
  }

  collect<R>(cb: (...args: (CstNode | null)[]) => R): R[] {
    return this.children.map(c => {
      return c?.isSeq() ? c.unpack(cb) : cb(c);
    });
  }
}

// export function dumpCstNode(node: CstNode, depth = 0): void {
//   const {_base, children, ctorName, matchLength, startIdx} = node;
//   const indent = Array.from({length: depth}).join('  ');
//   const addr = _base.toString(16);
//   // eslint-disable-next-line no-console
//   console.log(
//     `${indent}${addr} ${ctorName}@${startIdx}, matchLength ${matchLength}, children ${children.length}` // eslint-disable-line max-len
//   );
//   node.children.forEach(c => dumpCstNode(c, depth + 1));
// }

export class MatchResult {
  // Note: This is different from the JS implementation, which has:
  //    matcher: Matcher;
  // …instead.
  grammar: WasmGrammar;
  startExpr: string;
  _ctx: MatchContext;
  _succeeded: boolean;

  constructor(grammar: WasmGrammar, startExpr: string, ctx: MatchContext, succeeded: boolean) {
    this.grammar = grammar;
    this.startExpr = startExpr;
    this._ctx = ctx;
    this._succeeded = succeeded;
  }

  [Symbol.dispose]() {
    this.detach();
  }

  detach() {
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

  use<T>(cb: (r: MatchResult) => T): T {
    try {
      this.grammar._beginUse(this);
      return cb(this);
    } finally {
      this.grammar._endUse(this);
    }
  }
}

function createMatchResult(
  grammar: WasmGrammar,
  startExpr: string,
  ctx: MatchContext,
  succeeded: boolean
) {
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

class SucceededMatchResult extends MatchResult {
  _cst: CstNode;

  constructor(grammar: WasmGrammar, startExpr: string, ctx: MatchContext, succeeded: boolean) {
    super(grammar, startExpr, ctx, succeeded);
    this._cst = grammar.getCstRoot();
  }
}

class FailedMatchResult extends MatchResult {
  constructor(
    grammar: WasmGrammar,
    startExpr: string,
    ctx: MatchContext,
    succeeded: boolean,
    rightmostFailurePosition: number,
    optRecordedFailures?: any
  ) {
    super(grammar, startExpr, ctx, succeeded);
    this._rightmostFailurePosition = rightmostFailurePosition;
    this._rightmostFailures = optRecordedFailures;

    // TODO: Define these as lazy properties, like in the JS implementation.
    if (this.failed()) {
      this.shortMessage = this.message = `Match failed at pos ${rightmostFailurePosition}`;
    }
  }

  _rightmostFailurePosition: number;
  _rightmostFailures: any;
  shortMessage?: string;
  message?: string;

  getRightmostFailurePosition(): number {
    return this._rightmostFailurePosition;
  }

  getRightmostFailures(): any {
    throw new Error('Not implemented yet: getRightmostFailures');
  }

  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText(): string {
    assert(!this._succeeded, 'cannot get expected text of a successful MatchResult');
    throw new Error('Not implemented yet: getExpectedText');
  }

  getInterval() {
    throw new Error('Not implemented yet: getInterval');
  }
}
