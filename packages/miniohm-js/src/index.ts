import {assert, checkNotNull} from './assert.ts';

const WASM_PAGE_SIZE = 64 * 1024;
const INPUT_BUFFER_OFFSET = WASM_PAGE_SIZE;
const CST_NODE_TYPE_MASK = 0b11;

const CstNodeType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  ITER_FLAG: 2,
  OPTIONAL: 3,
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
      abort() {
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
      matchUnicodeChar: (catBitmap: number, pos: number) => {
        const re = regexFromCategoryBitmap(catBitmap);
        return re.test(this._nextCodePoint());
      },
    },
  };
  private _ruleIds = new Map<string, number>();
  private _ruleNames: string[] = [];
  private _input = '';
  private _pos?: number = undefined;

  /**
   * Create a new WasmGrammar object.
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

  private _init(module: WebAssembly.Module, instance: WebAssembly.Instance) {
    this._instance = instance;
    this._extractRuleIds(module);
    this.name = this._getGrammarName(module);
    return this;
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
    const {module, instance} = await WebAssembly.instantiate(source, {
      ...this._imports,
      debug: debugImports,
    });
    return this._init(module, instance);
  }

  async _instantiateStreaming(
    source: Response | Promise<Response>,
    debugImports: any = {}
  ): Promise<WasmGrammar> {
    const {module, instance} = await WebAssembly.instantiateStreaming(source, {
      ...this._imports,
      debug: debugImports,
    });
    return this._init(module, instance);
  }

  // Return a JavaScript string containing the next code point from the input
  // buffer, and advance pos past it.
  private _nextCodePoint(): string {
    const {pos, memory} = (this._instance as any).exports;
    const offset = pos.value;
    const byteArr = new Uint8Array(memory.buffer, INPUT_BUFFER_OFFSET + offset);
    const firstByte = byteArr[0];
    let len: number;
    if ((firstByte & 0b10000000) === 0) {
      len = 1;
    } else if ((firstByte & 0b11100000) === 0b11000000) {
      len = 2;
    } else if ((firstByte & 0b11110000) === 0b11100000) {
      len = 3;
    } else {
      len = 4;
    }
    const str = utf8.decode(byteArr.subarray(0, len));
    pos.value += len;
    return str;
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

  match(input: string, ruleName?: string): MatchResult {
    this._input = input;
    if (process.env.OHM_DEBUG === '1') debugger; // eslint-disable-line no-debugger
    const ruleId = checkNotNull(
      this._ruleIds.get(ruleName || this._ruleNames[0]),
      `unknown rule: '${ruleName}'`
    );
    const succeeded = (this._instance as any).exports.match(ruleId);
    return new MatchResult(
      this,
      this._input,
      ruleName || this._ruleNames[0],
      succeeded ? this.getCstRoot() : null,
      this.getRightmostFailurePosition()
    );
  }

  getMemorySizeBytes(): number {
    return (this._instance as any).exports.memory.buffer.byteLength;
  }

  getCstRoot(): CstNode {
    const {exports} = this._instance as any;
    const {buffer} = exports.memory;
    const firstNode = new CstNode(
      this._ruleNames,
      new DataView(buffer),
      exports.bindingsAt(0),
      0
    );
    if (firstNode.ctorName !== '$spaces') {
      return firstNode;
    }
    assert(exports.getBindingsLength() > 1);
    const nextAddr = exports.bindingsAt(1);
    const root = new CstNode(
      this._ruleNames,
      new DataView(buffer),
      nextAddr,
      firstNode.matchLength
    );
    root.leadingSpaces = firstNode;
    return root;
  }

  private _fillInputBuffer(offset: number, maxLen: number): number {
    const encoder = new TextEncoder();
    const {memory} = (this._instance as any).exports;
    const buf = new Uint8Array(memory.buffer, INPUT_BUFFER_OFFSET + offset);
    const {read, written} = encoder.encodeInto(this._input.substring(this._pos!), buf);
    assert(written < 64 * 1024, 'Input too long');
    this._pos! += read!;
    buf[written!] = 0xff; // Mark end of input with an invalid UTF-8 character.
    return written!;
  }

  getRightmostFailurePosition(): number {
    return (this._instance as any).exports.rightmostFailurePos.value;
  }
}

export class CstNode {
  _ruleNames!: string[];
  _view!: DataView;
  _children?: CstNode[];
  _base: number;
  startIdx: number;
  leadingSpaces: CstNode | undefined;
  source: {startIdx: number; endIdx: number};

  constructor(ruleNames: string[], dataView: DataView, ptr: number, startIdx: number) {
    // Non-enumerable properties
    Object.defineProperties(this, {
      _ruleNames: {value: ruleNames},
      _view: {value: dataView},
      _children: {writable: true},
    });
    this._base = ptr;
    this.startIdx = startIdx;
    this.leadingSpaces = undefined;
    this.source = {
      startIdx,
      endIdx: startIdx + this.sourceString.length,
    };
  }

  get type(): number {
    return this._typeAndDetails & CST_NODE_TYPE_MASK;
  }

  isNonterminal(): boolean {
    return this.type === CstNodeType.NONTERMINAL;
  }

  isTerminal(): boolean {
    return this.type === CstNodeType.TERMINAL;
  }

  isIter(): boolean {
    return (this._typeAndDetails & CstNodeType.ITER_FLAG) !== 0;
  }

  isOptional(): boolean {
    return this.type === CstNodeType.OPTIONAL;
  }

  get ctorName(): string {
    return this.isTerminal() ? '_terminal' : this.isIter() ? '_iter' : this.ruleName;
  }

  get ruleName(): string {
    assert(this.isNonterminal(), 'Not a non-terminal');
    const ruleId = this._view.getInt32(this._base + 8, true) >>> 2;
    return this._ruleNames[ruleId].split('<')[0];
  }

  get count(): number {
    return this._view.getUint32(this._base, true);
  }

  get matchLength(): number {
    return this._view.getUint32(this._base + 4, true);
  }

  get _typeAndDetails(): number {
    return this._view.getInt32(this._base + 8, true);
  }

  get arity(): number {
    return this._typeAndDetails >>> 2;
  }

  get children(): CstNode[] {
    if (!this._children) {
      this._children = this._computeChildren();
    }
    return this._children;
  }

  _computeChildren(): CstNode[] {
    const children: CstNode[] = [];
    let spaces: CstNode | undefined;
    let {startIdx} = this;
    for (let i = 0; i < this.count; i++) {
      const slotOffset = this._base + 16 + i * 4;
      const ptr = this._view.getUint32(slotOffset, true);
      // TODO: Avoid allocating $spaces nodes altogether?
      const node = new CstNode(this._ruleNames, this._view, ptr, startIdx);
      if (node.ctorName === '$spaces') {
        assert(!spaces, 'Multiple $spaces nodes found');
        spaces = node;
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
    const bytes = new Uint8Array(
      this._view.buffer,
      INPUT_BUFFER_OFFSET + this.startIdx,
      this.matchLength
    );
    return utf8.decode(bytes);
  }

  isSyntactic(ruleName?: string): boolean {
    const firstChar = this.ruleName[0];
    return firstChar === firstChar.toUpperCase();
  }

  isLexical(ruleName?: string): boolean {
    return !this.isSyntactic(ruleName);
  }

  toString(): string {
    const ctorName = this.isTerminal() ? '_terminal' : this.isIter() ? '_iter' : this.ruleName;
    const {sourceString, startIdx} = this;
    return `CstNode {ctorName: ${ctorName}, sourceString: ${sourceString}, startIdx: ${startIdx} }`;
  }

  map<T>(callbackFn: (...args: CstNode[]) => T): T[] {
    const {arity, children} = this;
    assert(callbackFn.length === arity, 'bad arity');
    const ans: T[] = [];
    for (let i = 0; i < children.length; i += arity) {
      ans.push(callbackFn(...children.slice(i, i + arity)));
    }
    return ans;
  }
}

export function dumpCstNode(node: CstNode, depth = 0): void {
  const {_base, children, ctorName, matchLength, startIdx} = node;
  const indent = Array.from({length: depth}).join('  ');
  const addr = _base.toString(16);
  // eslint-disable-next-line no-console
  console.log(
    `${indent}${addr} ${ctorName}@${startIdx}, matchLength ${matchLength}, children ${children.length}` // eslint-disable-line max-len
  );
  node.children.forEach(c => dumpCstNode(c, depth + 1));
}

export class MatchResult {
  // Note: This is different from the JS implementation, which has:
  //    matcher: Matcher;
  // …instead.
  grammar: WasmGrammar;
  input: string;
  startExpr: string;
  _cst: CstNode | null;
  _rightmostFailurePosition: number;
  _rightmostFailures: any;
  shortMessage?: string;
  message?: string;

  constructor(
    matcher: WasmGrammar,
    input: string,
    startExpr: string,
    cst: CstNode | null,
    rightmostFailurePosition: number,
    optRecordedFailures?: any
  ) {
    this.grammar = matcher;
    this.input = input;
    this.startExpr = startExpr;
    this._cst = cst;
    this._rightmostFailurePosition = rightmostFailurePosition;
    this._rightmostFailures = optRecordedFailures;

    // TODO: Define these as lazy properties, like in the JS implementation.
    if (this.failed()) {
      this.shortMessage = this.message = `Match failed at pos ${rightmostFailurePosition}`;
    }
  }

  succeeded(): boolean {
    return !!this._cst;
  }

  failed(): boolean {
    return !this.succeeded();
  }

  getRightmostFailurePosition(): number {
    return this._rightmostFailurePosition;
  }

  getRightmostFailures(): any {
    throw new Error('Not implemented yet: getRightmostFailures');
  }

  toString(): string {
    return this.succeeded()
      ? '[match succeeded]'
      : '[match failed at position ' + this.getRightmostFailurePosition() + ']';
  }

  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText(): string {
    if (this.succeeded()) {
      throw new Error('cannot get expected text of a successful MatchResult');
    }
    throw new Error('Not implemented yet: getExpectedText');
  }

  getInterval() {
    throw new Error('Not implemented yet: getInterval');
  }
}

export {AstBuilder} from './AstBuilder.ts';
