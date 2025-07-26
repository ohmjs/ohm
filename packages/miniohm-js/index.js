/* global process, TextDecoder, TextEncoder, WebAssembly */

const WASM_PAGE_SIZE = 64 * 1024;
const INPUT_BUFFER_OFFSET = WASM_PAGE_SIZE;

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
      },
    };
    this._ruleIds = new Map();
    this._ruleNames = [];
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

  match() {
    if (process.env.OHM_DEBUG === '1') debugger; // eslint-disable-line no-debugger
    return this._instance.exports.match(0);
  }

  getMemorySizeBytes() {
    return this._instance.exports.memory.buffer.byteLength;
  }

  getCstRoot() {
    const {buffer} = this._instance.exports.memory;
    const addr = this._instance.exports.getCstRoot();
    return new CstNode(this._ruleNames, new DataView(buffer), addr);
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

class CstNode {
  constructor(ruleNames, dataView, offset) {
    this._ruleNames = ruleNames;
    this._view = dataView;
    this._base = offset;
  }

  isNonterminal() {
    return this.type >= 0;
  }

  isTerminal() {
    return this._type === -1;
  }

  isIter() {
    return this._type === -2;
  }

  get ruleName() {
    const id = this._view.getInt32(this._base + 8, true);
    return this._ruleNames[id];
  }

  get count() {
    return this._view.getUint32(this._base, true);
  }

  get matchLength() {
    return this._view.getUint32(this._base + 4, true);
  }

  get _type() {
    const t = this._view.getInt32(this._base + 8, true);
    return t < 0 ? t : 0;
  }

  get children() {
    const children = [];
    for (let i = 0; i < this.count; i++) {
      const slotOffset = this._base + 16 + i * 4;
      children.push(
          new CstNode(this._ruleNames, this._view, this._view.getUint32(slotOffset, true)),
      );
    }
    return children;
  }
}
