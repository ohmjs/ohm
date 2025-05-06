/* global TextEncoder, WebAssembly */

import * as w from '@wasmgroundup/emit';
import fs from 'node:fs';

const {instr} = w;
import * as pexprs from './pexprs-main.js';

function assert(cond, msg) {
  if (!cond) {
    throw new Error(msg ?? 'assertion failed');
  }
}

function checkNotNull(x, msg = 'unexpected null value') {
  assert(x != null, msg);
  return x;
}

function checkNoUndefined(arr) {
  assert(arr.indexOf(undefined) === -1, `found undefined @ ${arr.indexOf(undefined)}`);
  return arr;
}

function uniqueName(names, str) {
  let name = str;
  outer: if (names.has(str)) {
    for (let i = 0; i < 100; i++) {
      name = `${str}_${i}`;
      if (!names.has(name)) break outer;
    }
    throw new Error(`Unique name generation failed for ${str}`);
  }
  names.add(name);
  return name;
}

/*
  Offers a higher-level interface for generating WebAssembly code and
  constructing a module. Generally shouldn't be responsible for things
  that are specific to Ohm.
 */
export class Assembler {
  constructor() {
    this._globals = new Map();

    this._functionDecls = [];
    this._importDecls = [];

    // State for the current function being generated.
    this._code = [];
    this._locals = undefined;
  }

  addGlobal(name, type) {
    assert(!this._globals.has(name), `Global '${name}' already exists`);
    const idx = this._globals.size;
    this._globals.set(name, idx);
    return idx;
  }

  addLocal(name, type) {
    assert(!this._locals.has(name), `Local '${name}' already exists`);
    assert(type === w.valtype.i32, `invalid local type: ${type}`);
    const idx = this._locals.size;
    this._locals.set(name, idx);
    return idx;
  }

  addFunction(name, paramTypes, resultTypes, bodyFn) {
    // this._funcContext = {name, paramTypes, resultTypes};
    this._locals = new Map();
    bodyFn(this); // TODO: Change to side effecting.
    this._functionDecls.push({
      name,
      paramTypes,
      resultTypes,
      locals: [w.locals(this._locals.size, w.valtype.i32)], // TODO: Support other types?
      body: [...this._code, instr.end]
    });
    this._code = [];
    this._locals = undefined;
  }

  buildModule(importDecls, functionDecls, extraExports = []) {
    const types = [...importDecls, ...functionDecls].map(f =>
      w.functype(f.paramTypes, f.resultTypes)
    );
    const imports = importDecls.map((f, i) =>
      w.import_(f.module, f.name, w.importdesc.func(i))
    );
    const funcs = functionDecls.map((f, i) => w.typeidx(i + importDecls.length));
    const codes = functionDecls.map(f => w.code(w.func(f.locals, f.body)));
    const exports = functionDecls.map((f, i) =>
      w.export_(f.name, w.exportdesc.func(i + importDecls.length))
    );
    exports.push(w.export_('memory', w.exportdesc.mem(0)));
    exports.push(...extraExports);

    const mod = w.module([
      w.typesec(types),
      w.importsec(imports),
      w.funcsec(funcs),
      w.memsec([w.mem(w.memtype(w.limits.min(1)))]),
      w.globalsec([
        // pos
        w.global(w.globaltype(w.valtype.i32, w.mut.var), [
          [instr.i32.const, w.i32(0), instr.end]
        ]),
        // origPosSp
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
    fs.writeFileSync(`/Users/pdubroy/${filename}`, bytes);
    console.log(` wrote  ${filename}`);
    // END DEBUG

    return bytes;
  }

  // Pure codegen helpers (used to generate the function bodies).

  globalidx(name) {
    return checkNotNull(this._globals.get(name), `Unknown global: ${name}`);
  }

  localidx(name) {
    return checkNotNull(this._locals.get(name), `Unknown local: ${name}`);
  }

  emit(...bytes) {
    this._code.push(...checkNoUndefined(bytes.flat(Infinity)));
  }

  emitBlock(bt, bodyThunk) {
    this.emit(w.instr.block, bt);
    bodyThunk();
    this.emit(w.instr.end);
  }

  emitLoop(bt, bodyThunk) {
    this.emit(w.instr.loop, bt);
    bodyThunk();
    this.emit(w.instr.end);
  }

  doLoop(bt, body) {
    return [instr.loop, bt, body, instr.end];
  }

  doStoreI32(offset) {
    return [instr.i32.store, w.memarg(Assembler.ALIGN_4_BYTES, offset)];
  }

  doLoadI32(offset) {
    return [instr.i32.load, w.memarg(Assembler.ALIGN_4_BYTES, offset)];
  }

  // Save the current input position.
  doPushOrigPos(valueFrag) {
    return [
      // origPosSp -= 4
      [instr.global.get, this.globalidx('origPosSp')],
      [instr.i32.const, w.i32(4)],
      instr.i32.sub,
      [instr.global.set, this.globalidx('origPosSp')],

      [instr.global.get, this.globalidx('origPosSp')],
      valueFrag,
      this.doStoreI32(0)
    ];
  }

  doPopOrigPos() {
    return [
      // origPosSp += 4
      [instr.global.get, this.globalidx('origPosSp')],
      [instr.i32.const, w.i32(4)],
      instr.i32.add,
      [instr.global.set, this.globalidx('origPosSp')]
    ];
  }

  // Load the saved input position onto the stack.
  doGetOrigPos() {
    return [[instr.global.get, this.globalidx('origPosSp')], this.doLoadI32(0)];
  }

  // Load the current input position onto the stack.
  // [] -> [i32]
  doGetPos() {
    return [instr.global.get, this.globalidx('pos')];
  }

  // Set the current input position to the TOS value.
  // [i32] -> []
  doSetPos() {
    return [instr.global.set, this.globalidx('pos')];
  }

  // Increment the current input position by 1.
  // [i32, i32] -> [i32]
  doIncPos() {
    return [this.doGetPos(), [instr.i32.const, w.i32(1), instr.i32.add], this.doSetPos()];
  }

  doGetRet() {
    return [instr.local.get, this.localidx('ret')];
  }

  doSetRet(valueFrag = []) {
    return [valueFrag, instr.local.set, this.localidx('ret')];
  }
}
Assembler.ALIGN_1_BYTE = 0;
Assembler.ALIGN_4_BYTES = 2;

export class Compiler {
  constructor(grammar) {
    this.grammar = grammar;
    this.ruleIdxByName = new Map(Object.keys(grammar.rules).map((name, i) => [name, i + 2]));
    this._codegenCtx = [];
    this._labels = new Set();
  }

  _enter(pexpr) {
    const {startIdx} = pexpr.source;
    this._codegenCtx.push(`${pexpr.constructor.name}@${startIdx}`);
  }

  _exit() {
    this._codegenCtx.pop();
  }

  compile() {
    const asm = (this.asm = new Assembler());
    asm.addGlobal('pos', w.valtype.i32);
    asm.addGlobal('origPosSp', w.valtype.i32);
    console.log(asm._globals);

    const importDecls = [
      {
        module: 'env',
        name: 'fillInputBuffer',
        // (offset: i32, maxLen: i32) -> i32
        // Returns the actual number of bytes read.
        paramTypes: [w.valtype.i32, w.valtype.i32],
        resultTypes: [w.valtype.i32]
      }
    ];
    // TODO: Clean this up, move it into Assembler.
    const extraExports = asm._globals
      .keys()
      .map(name => w.export_(name, [0x03, asm.globalidx(name)]));
    return asm.buildModule(importDecls, this.functionDecls(importDecls.length), extraExports);
  }

  compileRule(name, info) {
    this.asm.addFunction(`$${name}`, [], [w.valtype.i32], () => {
      this.asm.addLocal('ret', w.valtype.i32);
      this.emitPExpr(info.body);
      this.asm.emit('xxx', instr.local.get, this.asm.localidx('ret'));
    });
    return this.asm._functionDecls.at(-1);
  }

  // A *brilliant* way to add arbitrary labels to the generated code.
  // Goes through the body of all functions in `decls`, and replaces any
  // strings with a call to a dummy function with the same name.
  // Ensures that there are no duplicate dummy function names, but does not
  // guarantee that there are no collisions with other functions.
  // Returns the list of dummy functions that need to be added to the module.
  rewriteDebugLabels(decls, baseFuncIdx) {
    let nextFuncIdx = baseFuncIdx;
    const debugDecls = [];
    const names = new Set();
    for (let i = 0; i < decls.length; i++) {
      const entry = decls[i];
      entry.body = entry.body.flatMap(x => {
        if (typeof x !== 'string') return x;

        const name = uniqueName(names, x);

        // Create a noop function whose name is the given string…
        debugDecls.push({
          name,
          paramTypes: [],
          resultTypes: [],
          locals: [],
          body: [instr.end]
        });
        // …and replace the string with a call to that function.
        return [instr.call, w.funcidx(nextFuncIdx++)].flat(Infinity);
      });
    }
    return debugDecls;
  }

  functionDecls(startIdx) {
    const setInputLen = () => [instr.local.set, w.localidx(0)];
    const getInputLen = () => [instr.local.get, w.localidx(0)];
    const getCurrPos = () => [instr.global.get, w.globalidx(0)];
    const resetCurrPos = () => [[instr.i32.const, w.i32(0)], instr.global.set, w.globalidx(0)];

    const ruleDecls = Object.entries(this.grammar.rules).map(([name, info]) =>
      this.compileRule(name, info)
    );
    const debugDecls = this.rewriteDebugLabels(ruleDecls, startIdx + ruleDecls.length + 1);
    const startRuleIdx = this.ruleIdxByName.get(this.grammar.defaultStartRule);

    return [
      {
        name: 'match',
        paramTypes: [],
        resultTypes: [w.valtype.i32],
        locals: [w.locals(1, w.valtype.i32)],
        body: [
          resetCurrPos(),
          [instr.i32.const, w.i32(64 * 1024)],
          [instr.global.set, w.globalidx(1)], // Reset ORIG_POS_SP

          [instr.i32.const, w.i32(0)], // offset
          [instr.i32.const, w.i32(64 * 1024)], // maxLen
          [instr.call, /* fillInputBuffer */ w.funcidx(0)],
          setInputLen(),

          [instr.call, w.funcidx(startRuleIdx)],

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
      ...ruleDecls,
      ...debugDecls
    ];
  }

  emitPExpr(exp) {
    const {asm} = this;
    this._enter(exp);
    // Wrap the body in a block, which is useful for two reasons:
    // - it allows early returns.
    // - it makes sure that the generated code doesn't have stack effects.
    asm.emit(`BEGIN ${this._codegenCtx.at(-1)}`);
    asm.emitBlock(w.blocktype.empty, () => {
      // prettier-ignore
      switch (exp.constructor) {
        case pexprs.Terminal: this.emitTerminal(exp); break;
        case pexprs.Apply: this.emitApply(exp); break;
        case pexprs.Alt: this.emitAlt(exp); break;
        case pexprs.Seq: this.emitSeq(exp); break;
        case pexprs.Star: this.emitStar(exp); break;
        case pexprs.Plus: this.emitPlus(exp); break;
        // case pexprs.Opt: this.compileOpt(); break;
        case pexprs.Lookahead: this.emitLookahead(exp); break;
        default:
          throw new Error(`not handled: ${exp.constructor.name}`);
      }
    });
    asm.emit(`END ${this._codegenCtx.at(-1)}`);
    this._exit(this);
  }

  emitAlt(exp) {
    const {asm} = this;
    asm.emit(asm.doPushOrigPos(asm.doGetPos())); // origPos = pos
    for (const term of exp.terms) {
      this.emitPExpr(term);
      asm.emit(
        asm.doGetRet(),
        [instr.br_if, w.labelidx(0)],
        [asm.doGetOrigPos(), asm.doSetPos()] // pos = origPos
      );
    }
    asm.emit(asm.doPopOrigPos());
  }

  emitSeq(exp) {
    const {asm} = this;
    for (const factor of exp.factors) {
      this.emitPExpr(factor);
      asm.emit(asm.doGetRet(), [instr.i32.eqz, instr.br_if, w.labelidx(0)]);
    }
  }

  emitApply(exp) {
    const {asm} = this;
    const idx = checkNotNull(
      this.ruleIdxByName.get(exp.ruleName),
      `Unknown rule: ${exp.ruleName}`
    );
    asm.emit([instr.call, w.funcidx(idx)], asm.doSetRet());
  }

  emitTerminal(exp) {
    // TODO:
    // - proper UTF-8!
    // - handle longer terminals with a loop

    const {asm} = this;
    const ifTrue = body => [[instr.if, w.blocktype.empty], body, instr.end];
    const doBail = depth => [
      asm.doSetRet([instr.i32.const, 0]),
      [instr.br, w.labelidx(depth)]
    ];
    const currCharCodeFrag = [
      asm.doGetPos(),
      [instr.i32.load8_u, w.memarg(Assembler.ALIGN_1_BYTE, 0)]
    ];

    asm.emit(
      // Unrolled loop over all characters.
      ...Array.prototype.flatMap.call(exp.obj, c => [
        // Compare next char
        [instr.i32.const, w.i32(c.charCodeAt(0))],
        currCharCodeFrag,
        [instr.i32.ne, ifTrue(doBail(1))],
        asm.doIncPos()
      ]),
      asm.doSetRet([instr.i32.const, 1])
    );
  }

  emitStar({expr}) {
    const {asm} = this;
    asm.emitBlock(w.blocktype.empty, () => {
      asm.emitLoop(w.blocktype.empty, () => {
        asm.emit(asm.doPushOrigPos(asm.doGetPos()));
        this.emitPExpr(expr);
        asm.emit(
          asm.doGetRet(),
          [instr.i32.eqz, instr.br_if, w.labelidx(1)], // break
          asm.doPopOrigPos(),
          instr.br,
          w.labelidx(0) // continue
        );
      });
    });
    asm.emit(
      [asm.doGetOrigPos(), asm.doSetPos()], // pos = origPos
      asm.doPopOrigPos(),
      asm.doSetRet([instr.i32.const, 1])
    );
  }

  emitPlus(plusExp) {
    const {asm} = this;
    this.emitPExpr(plusExp.expr);
    asm.emit(asm.doGetRet(), [instr.i32.eqz, instr.br_if, w.labelidx(0)]);
    this.emitStar(plusExp);
  }

  emitLookahead({expr}) {
    const {asm} = this;
    asm.emit(asm.doPushOrigPos(asm.doGetPos()));
    this.emitPExpr(expr);
    asm.emit([asm.doGetOrigPos(), asm.doSetPos()], asm.doPopOrigPos());
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
    this._pos = 0; // TODO: Fix this, it should be using the wasm global
    return this._instance.exports.match();
  }

  _fillInputBuffer(offset, maxLen) {
    const encoder = new TextEncoder();
    const {memory} = this._instance.exports;
    const buf = new Uint8Array(memory.buffer, offset);
    const {read, written} = encoder.encodeInto(this._input.substring(this._pos), buf);
    this._pos += read;
    buf[written] = 0xff; // Mark end of input with an invalid UTF-8 character.
    return written;
  }
}
