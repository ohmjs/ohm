/* global TextEncoder, WebAssembly */

import * as w from '@wasmgroundup/emit';

const {instr} = w;

async function buildModule(importDecls, functionDecls) {
  const types = [...importDecls, ...functionDecls].map(f =>
    w.functype(f.paramTypes, [f.resultType])
  );
  const imports = importDecls.map((f, i) => w.import_(f.module, f.name, w.importdesc.func(i)));
  const funcs = functionDecls.map((f, i) => w.typeidx(i + importDecls.length));
  const codes = functionDecls.map(f => w.code(w.func(f.locals, f.body)));
  const exports = functionDecls.map((f, i) =>
    w.export_(f.name, w.exportdesc.func(i + importDecls.length))
  );
  exports.push(w.export_('memory', w.exportdesc.mem(0)));

  const mod = w.module([
    w.typesec(types),
    w.importsec(imports),
    w.funcsec(funcs),
    w.memsec([w.mem(w.memtype(w.limits.min(1)))]),
    w.globalsec([
      // pos
      w.global(w.globaltype(w.valtype.i32, w.mut.var), [
        [instr.i32.const, w.i32(0), instr.end]
      ])
    ]),
    w.exportsec(exports),
    w.codesec(codes)
  ]);
  const bytes = Uint8Array.from(mod.flat(Infinity));

  // DEBUG
  const filename = `out-${new Date().getTime()}.wasm`;
  (await import('fs')).writeFileSync(`/Users/pdubroy/${filename}`, bytes);
  console.log(` wrote  ${filename}`);
  // END DEBUG

  return bytes;
}

export class Compiler {
  constructor(grammar) {
    this.grammar = grammar;
    this.ruleIdxByName = new Map(Object.keys(grammar.rules).map((name, i) => [name, i + 2]));
  }

  compile() {
    return buildModule(
      [
        {
          module: 'env',
          name: 'fillInputBuffer',
          // (offset: i32, maxLen: i32) -> i32
          // Returns the actual number of bytes read.
          paramTypes: [w.valtype.i32, w.valtype.i32],
          resultType: w.valtype.i32
        }
      ],
      this.functionDecls()
    );
  }

  compileRule(name, info) {
    return {
      name: `$${name}`,
      paramTypes: [],
      resultType: w.valtype.i32,
      locals: [w.locals(3, w.valtype.i32)],
      body: [info.body.toWasm(this), instr.end]
    };
  }

  functionDecls() {
    const setInputLen = () => [instr.local.set, w.localidx(0)];
    const getInputLen = () => [instr.local.get, w.localidx(0)];
    const getCurrPos = () => [instr.global.get, w.globalidx(0)];
    return [
      {
        name: 'match',
        paramTypes: [],
        resultType: w.valtype.i32,
        locals: [w.locals(1, w.valtype.i32)],
        body: [
          [instr.i32.const, w.i32(0)], // offset
          [instr.i32.const, w.i32(64 * 1024)], // maxLen
          [instr.call, /* fillInputBuffer */ w.funcidx(0)],
          setInputLen(),
          [instr.call, w.funcidx(2)], // Call first rule

          [instr.if, w.blocktype.i32],
          // if match succeeded, return currPos == inputLen
          getInputLen(),
          getCurrPos(),
          instr.i32.eq,
          instr.else,
          [instr.i32.const, w.i32(0)], // match failed
          instr.end, // if

          instr.end
        ]
      },
      ...Object.entries(this.grammar.rules).map(([name, info]) => {
        return this.compileRule(name, info);
      })
    ];
  }
}

export class WasmMatcher {
  constructor(grammar) {
    this.grammar = grammar;
    this._instance = undefined;
    this._input = '';
    this._pos = 0;
    this._env = {
      fillInputBuffer: this._fillInputBuffer.bind(this)
    };
  }

  static async forGrammar(grammar) {
    const bytes = await grammar.toWasm();
    const matcher = new WasmMatcher(grammar);
    const {instance} = await WebAssembly.instantiate(bytes, {
      env: matcher._env
    });
    matcher._instance = instance;
    return matcher;
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
    return this._instance.exports.match();
  }

  _fillInputBuffer(offset, maxLen) {
    const encoder = new TextEncoder();
    const {memory} = this._instance.exports;
    const buf = new Uint8Array(memory.buffer, offset);
    const {read, written} = encoder.encodeInto(this._input.substring(this._pos), buf);
    this._pos += read;
    return written;
  }
}
