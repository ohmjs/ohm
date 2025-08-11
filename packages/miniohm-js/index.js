/* global process, TextDecoder, TextEncoder, WebAssembly */

const WASM_PAGE_SIZE = 64 * 1024;
const INPUT_BUFFER_OFFSET = WASM_PAGE_SIZE;
const CST_NODE_TYPE_MASK = 0b11;

const CstNodeType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  ITER: 2,
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

function regexFromCategoryBitmap(bitmap) {
  const cats = [];
  for (let i = 0; i < 32; i++) {
    const mask = 1 << i;
    if (bitmap & mask) cats.push(UnicodeCategoryNames[i]);
  }
  return new RegExp(
      cats.map(cat => `\\p{${cat}}`).join('|'),
      'uy', // u: unicode, y: sticky
  );
}

function assert(cond, msg) {
  if (!cond) {
    throw new Error(msg ?? 'assertion failed');
  }
}

export class WasmMatcher {
  constructor() {
    this._instance = undefined;
    this._imports = {
      // System-level AssemblyScript imports.
      env: {
        abort() {
          throw new Error('abort');
        },
      },
      // For imports from ohmRuntime.ts.
      ohmRuntime: {
        printI32(val) {
          // eslint-disable-next-line no-console
          console.log(val);
        },
        isRuleSyntactic: ruleId => {
          // TODO: Precompute this for all rules, and encode it in the module?
          const name = this._ruleNames[ruleId];
          assert(!!name);
          return name[0] === name[0].toUpperCase();
        },
        fillInputBuffer: this._fillInputBuffer.bind(this),
        matchUnicodeChar: (catBitmap, pos) => {
          const re = regexFromCategoryBitmap(catBitmap);
          return re.test(this._nextCodePoint());
        },
      },
    };
    this._ruleIds = new Map();
    this._ruleNames = [];
  }

  // Return a JavaScript string containing the next code point from the input
  // buffer, and advance pos past it.
  _nextCodePoint() {
    const {pos, memory} = this._instance.exports;
    const offset = pos.value;
    const byteArr = new Uint8Array(memory.buffer, INPUT_BUFFER_OFFSET + offset);
    const firstByte = byteArr[0];
    let len;
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

  _extractRuleIds(module) {
    const sections = WebAssembly.Module.customSections(module, 'ruleNames');
    if (sections.length === 0) {
      throw new Error('No ruleNames section found in module');
    }

    const data = new Uint8Array(sections[0]);
    const dataView = new DataView(data.buffer);
    let offset = 0;

    const parseU32 = () => {
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

  async _instantiate(source, debugImports = {}) {
    const {module, instance} = await WebAssembly.instantiate(source, {
      ...this._imports,
      debug: debugImports,
    });
    this._instance = instance;
    this._extractRuleIds(module);
    return this;
  }

  static async fromBytes(source) {
    return new WasmMatcher()._instantiate(source);
  }

  getInput() {
    return this._input;
  }

  setInput(str) {
    if (this._input !== str) {
      // this.replaceInputRange(0, this._input.length, str);
      this._input = str;
    }
    return this;
  }

  replaceInputRange(startIdx, endIdx, str) {
    throw new Error('Not implemented');
  }

  match(ruleName = this._ruleNames[0]) {
    if (process.env.OHM_DEBUG === '1') debugger; // eslint-disable-line no-debugger
    const succeeded = this._instance.exports.match(0);
    return new MatchResult(
        this,
        this._input,
        ruleName,
      succeeded ? this.getCstRoot() : null,
      this.getRightmostFailurePosition(),
    );
  }

  getMemorySizeBytes() {
    return this._instance.exports.memory.buffer.byteLength;
  }

  getCstRoot() {
    const {buffer} = this._instance.exports.memory;
    const addr = this._instance.exports.getCstRoot();
    return new CstNode(this._ruleNames, new DataView(buffer), addr, 0);
  }

  _fillInputBuffer(offset, maxLen) {
    const encoder = new TextEncoder();
    const {memory} = this._instance.exports;
    const buf = new Uint8Array(memory.buffer, INPUT_BUFFER_OFFSET + offset);
    const {read, written} = encoder.encodeInto(this._input.substring(this._pos), buf);
    assert(written < 64 * 1024, 'Input too long');
    this._pos += read;
    buf[written] = 0xff; // Mark end of input with an invalid UTF-8 character.
    return written;
  }

  getRightmostFailurePosition() {
    return this._instance.exports.rightmostFailurePos.value;
  }
}

export class CstNode {
  constructor(ruleNames, dataView, ptr, startIdx) {
    // Non-enumerable properties
    Object.defineProperties(this, {
      _ruleNames: {value: ruleNames},
      _view: {value: dataView},
      _children: {writable: true},
    });
    this._base = ptr;
    this.startIdx = startIdx;
    this.leadingSpaces = undefined;
  }

  isNonterminal() {
    return (this._type & CST_NODE_TYPE_MASK) === CstNodeType.NONTERMINAL;
  }

  isTerminal() {
    return (this._type & CST_NODE_TYPE_MASK) === CstNodeType.TERMINAL;
  }

  isIter() {
    return (this._type & CST_NODE_TYPE_MASK) === CstNodeType.ITER;
  }

  isOptional() {
    return false; // TODO
  }

  get ctorName() {
    return this.isTerminal() ? '_terminal' : this.isIter() ? '_iter' : this.ruleName;
  }

  get ruleName() {
    const ruleId = this._view.getInt32(this._base + 8, true) >>> 2;
    return this._ruleNames[ruleId].split('<')[0];
  }

  get count() {
    return this._view.getUint32(this._base, true);
  }

  get matchLength() {
    return this._view.getUint32(this._base + 4, true);
  }

  get _type() {
    return this._view.getInt32(this._base + 8, true);
  }

  get children() {
    if (!this._children) {
      this._children = this._computeChildren();
    }
    return this._children;
  }

  _computeChildren() {
    const children = [];
    let spaces;
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

  get sourceString() {
    const bytes = new Uint8Array(
        this._view.buffer,
        INPUT_BUFFER_OFFSET + this.startIdx,
        this.matchLength,
    );
    return utf8.decode(bytes);
  }

  isSyntactic(ruleName) {
    const firstChar = this.ruleName[0];
    return firstChar === firstChar.toUpperCase();
  }

  isLexical(ruleName) {
    return !this.isSyntactic(ruleName);
  }

  toString() {
    const ctorName = this.isTerminal() ? '_terminal' : this.isIter() ? '_iter' : this.ruleName;
    const {sourceString, startIdx} = this;
    return `CstNode {ctorName: ${ctorName}, sourceString: ${sourceString}, startIdx: ${startIdx} }`;
  }
}

export class MatchResult {
  constructor(matcher, input, startExpr, cst, rightmostFailurePosition, optRecordedFailures) {
    this.matcher = matcher;
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

  succeeded() {
    return !!this._cst;
  }

  failed() {
    return !this.succeeded();
  }

  getRightmostFailurePosition() {
    return this._rightmostFailurePosition;
  }

  getRightmostFailures() {
    throw new Error('Not implemented yet: getRightmostFailures');
  }

  toString() {
    return this.succeeded() ?
      '[match succeeded]' :
      '[match failed at position ' + this.getRightmostFailurePosition() + ']';
  }

  // Return a string summarizing the expected contents of the input stream when
  // the match failure occurred.
  getExpectedText() {
    if (this.succeeded()) {
      throw new Error('cannot get expected text of a successful MatchResult');
    }
    throw new Error('Not implemented yet: getExpectedText');
  }

  getInterval() {
    throw new Error('Not implemented yet: getInterval');
  }
}
