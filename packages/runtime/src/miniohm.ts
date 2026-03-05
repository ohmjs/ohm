import {assert, checkNotNull} from './assert.ts';
import {CstNodeImpl} from './cstNodes.ts';
import {createMatchResult, MatchResult} from './matchResult.ts';

export {CstNodeImpl} from './cstNodes.ts';
export {
  createMatchResult,
  FailedMatchResult,
  MatchResult,
  SucceededMatchResult,
} from './matchResult.ts';

export const MATCH_RECORD_TYPE_MASK = 0b11;

// Tagged terminal: (matchLength << 1) | 1. Bit 0 distinguishes from real pointers.
export function isTaggedTerminal(handle: number): boolean {
  return (handle & 1) !== 0;
}

// A MatchRecord is the representation of a CstNode in Wasm linear memory.
export const MatchRecordType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  ITER_FLAG: 2,
  OPTIONAL: 3,
} as const;

export type MatchRecordType = (typeof MatchRecordType)[keyof typeof MatchRecordType];

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
export type CstNodeType = (typeof CstNodeType)[keyof typeof CstNodeType];

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
const utf16le = new TextDecoder('utf-16le');

// Minimal implementation of Interval (for FailedMatchResult)
export class Interval {
  startIdx: number;
  endIdx: number;
  /** @internal */
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
  /** @internal */
  private _description: string;
  /** @internal */
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

  const numEntries = parseU32();
  const ans: string[] = [];
  for (let i = 0; i < numEntries; i++) {
    const stringLen = parseU32();
    const bytes = data.slice(offset, offset + stringLen);
    offset += stringLen;
    const name = utf8.decode(bytes);
    ans.push(name);
  }
  return ans;
}

export class Grammar {
  name = '';

  /** @internal */
  private _instance?: WebAssembly.Instance = undefined;
  /** @internal */
  private _imports = {
    // System-level AssemblyScript imports.
    env: {
      abort: (msgPtr: number, filePtr: number, line: number, column: number) => {
        const msg = this._readASString(msgPtr);
        const file = this._readASString(filePtr);
        throw new Error(`Wasm abort: ${msg} at ${file}:${line}:${column}`);
      },
    },
    // For imports from ohmRuntime.ts.
    ohmRuntime: {
      printI32(val: number) {
        // eslint-disable-next-line no-console
        console.log(val);
      },
      fillInputBuffer: this._fillInputBuffer.bind(this),
      matchUnicodeChar: (catBitmap: number) => {
        const {pos} = (this._instance as any).exports;
        const re = regexFromCategoryBitmap(catBitmap);
        re.lastIndex = pos;
        const arr = re.exec(this._input);
        if (arr) {
          pos.value += arr[0].length;
        }
        return !!arr;
      },
      matchCaseInsensitive: (() => {
        const cache: RegExp[] = [];
        return (stringIdx: number) => {
          const {pos} = (this._instance as any).exports;
          let re = cache[stringIdx];
          if (!re) {
            // The pattern is pre-escaped at compile time.
            re = cache[stringIdx] = new RegExp(this._strings[stringIdx], 'iy');
          }
          re.lastIndex = pos.value;
          const arr = re.exec(this._input);
          if (arr) {
            pos.value += arr[0].length;
          }
          return !!arr;
        };
      })(),
    },
  };
  /** @internal */
  private _ruleIds = new Map<string, number>();
  /** @internal */
  private _ruleNames: string[] = [];
  /** @internal */
  private _input = '';

  /** @internal */
  public _strings: string[] = [];

  /** @internal */
  _beforeParse?: (exports: any, input: string, ruleIds: Map<string, number>) => void;

  /*
   * Wasm heap memory management
   * ===========================
   *
   * The Wasm module uses a bump-pointer allocator (AssemblyScript's "stub"
   * runtime). Each match() call allocates a memo table and CST nodes on
   * the Wasm heap. There is no way to free individual allocations — you
   * can only reset the bump pointer.
   *
   * To allow incremental freeing, we exploit two facts:
   *
   *   1. MatchResult disposal is LIFO — you must dispose the most recent
   *      result first (enforced by an assert in _dispose).
   *
   *   2. Allocations for match N are always contiguous and sit above
   *      match N-1's allocations on the heap.
   *
   * Before each match, we snapshot the bump pointer (`exports.__offset`)
   * as a "watermark" and store it on the MatchResult. On dispose, we
   * reset the bump pointer to that watermark, freeing exactly that
   * match's allocations while keeping earlier results intact.
   *
   * When the last result is disposed, its watermark equals the initial
   * heap offset, so the entire heap is reclaimed — equivalent to the
   * old resetHeap() approach, but without the all-or-nothing limitation.
   */

  /** @internal */
  private _resultStack: MatchResult[] = [];

  /**
   * Create a new Grammar object.
   * If `bytes` is specified, the WebAssembly module will be synchronously
   * compiled and instantiated. Use `instantiate` or `instantiateStreaming`
   * to instantiate asynchronously.
   */
  constructor(bytes?: BufferSource) {
    if (bytes) {
      const mod = new WebAssembly.Module(bytes);
      this._init(mod, new WebAssembly.Instance(mod, this._imports));
    }
  }

  /** @internal */
  private _init(module: WebAssembly.Module, instance: WebAssembly.Instance) {
    this._instance = instance;
    this._extractStrings(module);
    this.name = this._getGrammarName(module);
    return this;
  }

  /** @internal */
  _manage(result: MatchResult): void {
    result._managed = true;
  }

  /** @internal */
  _dispose(result: MatchResult): void {
    assert(
      this._resultStack.at(-1) === result,
      `You can only dispose() the most recent MatchResult`
    );
    this._resultStack.pop();
    // Reset the bump-pointer allocator to the watermark recorded before this
    // match. Because disposal is LIFO, this frees exactly this match's
    // allocations (memo table + CST nodes) while keeping earlier ones intact.
    (this._instance as any).exports.__offset.value = result._heapWatermark;
    result._attached = false;
    result._ctx.view = new DataView(new ArrayBuffer(0));
  }

  static async instantiate(source: BufferSource): Promise<Grammar> {
    return new Grammar()._instantiate(source);
  }

  static async instantiateStreaming(source: Response | Promise<Response>): Promise<Grammar> {
    return new Grammar()._instantiateStreaming(source);
  }

  /** @internal */
  async _instantiate(source: BufferSource, debugImports: any = {}): Promise<Grammar> {
    const {module, instance} = await WebAssembly.instantiate(source, {
      ...this._imports,
      debug: debugImports,
    });
    return this._init(module, instance);
  }

  /** @internal */
  async _instantiateStreaming(
    source: Response | Promise<Response>,
    debugImports: any = {}
  ): Promise<Grammar> {
    const {module, instance} = await WebAssembly.instantiateStreaming(source, {
      ...this._imports,
      debug: debugImports,
    });
    return this._init(module, instance);
  }

  /** @internal */
  private _getGrammarName(module: WebAssembly.Module): string {
    const sections = WebAssembly.Module.customSections(module, 'name');
    assert(sections.length === 1, `Expected one name section, found ${sections.length}`);
    const data = new Uint8Array(sections[0]);
    return utf8.decode(data);
  }

  /** @internal */
  private _extractStrings(module: WebAssembly.Module): void {
    assert(this._ruleNames.length === 0);
    assert(this._ruleIds.size === 0);
    for (const ruleName of parseStringTable(module, 'ruleNames')) {
      this._ruleIds.set(ruleName, this._ruleIds.size);
      this._ruleNames.push(ruleName);
    }
    for (const str of parseStringTable(module, 'strings')) {
      this._strings.push(str);
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
    const exports = (this._instance as any).exports;
    const ruleId = checkNotNull(
      this._ruleIds.get(ruleName || this._ruleNames[0]),
      `unknown rule: '${ruleName}'`
    );
    const heapWatermark = exports.__offset.value;
    let succeeded: boolean;
    if (this._beforeParse) {
      exports.matchSetup(input.length);
      this._beforeParse(exports, input, this._ruleIds);
      succeeded = !!exports.matchEval(ruleId);
    } else {
      succeeded = !!exports.match(input.length, ruleId);
    }
    const buffer = exports.memory.buffer;

    // If the Wasm match triggered memory.grow() (e.g. for the memo table or
    // CST nodes), the old ArrayBuffer is detached. Refresh the DataView in
    // all existing match contexts so that their CstNodes can still read data.
    for (const r of this._resultStack) {
      if (r._ctx.view.buffer !== buffer) {
        r._ctx.view = new DataView(buffer);
      }
    }

    const ctx: MatchContext = {
      ruleNames: this._ruleNames,
      view: new DataView(buffer),
      input,
    };
    const result = createMatchResult(this, ruleName || this._ruleNames[0], ctx, !!succeeded);
    result._heapWatermark = heapWatermark;
    result.dispose = this._dispose.bind(this, result);
    this._resultStack.push(result);
    return result;
  }

  /** @internal */
  recordFailures(): number[] {
    const {exports} = this._instance as any;
    exports.recordFailures(this._input.length, this._ruleIds.get(this._ruleNames[0]));
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
    return this._strings[id];
  }

  getMemorySizeBytes(): number {
    return (this._instance as any).exports.memory.buffer.byteLength;
  }

  /** @internal Read an AssemblyScript string from Wasm linear memory. */
  private _readASString(ptr: number): string {
    if (!ptr || !this._instance) return '(unknown)';
    try {
      const buffer = (this._instance as any).exports.memory.buffer;
      // AS managed object layout: rtSize (byte length) is at ptr - 4.
      const byteLen = new DataView(buffer).getUint32(ptr - 4, true);
      return utf16le.decode(new Uint8Array(buffer, ptr, byteLen));
    } catch {
      return `(ptr=${ptr})`;
    }
  }

  /** @internal */
  _getCstRoot(ctx?: MatchContext): CstNode {
    const {exports} = this._instance as any;
    ctx ??= {
      ruleNames: this._ruleNames,
      view: new DataView(exports.memory.buffer),
      input: this._input,
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

  /** @internal */
  private _fillInputBuffer(ptr: number, length: number): number {
    const {memory} = (this._instance as any).exports;
    const buf = new Uint16Array(memory.buffer, ptr, length);
    for (let i = 0; i < length; i++) {
      buf[i] = this._input.charCodeAt(i);
    }
    return length;
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
