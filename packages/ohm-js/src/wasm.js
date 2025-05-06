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
  constructing a module.
 */
export class Assembler {
  constructor() {
    this._globals = new Map();

    this._functionDecls = [];
    this._importDecls = [];

    // Keep track of loops/blocks to make it easier (and safer) to generate
    // breaks to the correct index.
    this._blockStack = [];

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
    this._locals = new Map();
    bodyFn(this);
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

  block(bt, bodyThunk) {
    this.emit(w.instr.block, bt);
    this._blockStack.push('block');
    bodyThunk();
    this._blockStack.pop();
    this.emit(w.instr.end);
  }

  loop(bt, bodyThunk) {
    this.emit(w.instr.loop, bt);
    this._blockStack.push('loop');
    bodyThunk();
    this._blockStack.pop();
    this.emit(w.instr.end);
  }

  if(bt, bodyThunk) {
    this.emit(w.instr.if, bt);
    this._blockStack.push('if');
    bodyThunk();
    this._blockStack.pop();
    this.emit(w.instr.end);
  }

  br(depth) {
    this.emit(instr.br, w.labelidx(depth));
  }

  brIf(depth) {
    this.emit(instr.br_if, w.labelidx(depth));
  }

  i32Add = () => this.emit(instr.i32.add);

  i32Const(value) {
    this.emit(instr.i32.const, w.i32(value));
  }

  i32Load(offset = 0) {
    this.emit(instr.i32.load, w.memarg(Assembler.ALIGN_4_BYTES, offset));
  }

  i32Load8u(offset = 0) {
    this.emit(instr.i32.load8_u, w.memarg(Assembler.ALIGN_1_BYTE, offset));
  }

  i32Ne = () => this.emit(instr.i32.ne);

  i32Store(offset = 0) {
    this.emit(instr.i32.store, w.memarg(Assembler.ALIGN_4_BYTES, offset));
  }

  i32Sub() {
    this.emit(instr.i32.sub);
  }

  globalGet(name) {
    this.emit(instr.global.get, this.globalidx(name));
  }

  globalSet(name) {
    this.emit(instr.global.set, this.globalidx(name));
  }

  localGet(name) {
    this.emit(instr.local.get, this.localidx(name));
  }

  localSet(name) {
    this.emit(instr.local.set, this.localidx(name));
  }

  // "Macros" -- codegen helpers specific to Ohm.

  break(depth) {
    const what = this._blockStack.at(-(depth + 1));
    assert(what === 'block' || what === 'if', 'Invalid break');
    this.emit(instr.br, w.labelidx(depth));
  }

  // Conditional break -- emits a `br_if` for the given depth.
  condBreak(depth) {
    const what = this._blockStack.at(-(depth + 1));
    assert(what === 'block' || what === 'if', 'Invalid condBreak');
    this.emit(instr.br_if, w.labelidx(depth));
  }

  continue(depth) {
    const what = this._blockStack.at(-(depth + 1));
    assert(what === 'loop', 'Invalid continue');
    this.emit(instr.br, w.labelidx(depth));
  }

  // Save the current input position.
  pushOrigPos(valueFrag) {
    // origPosSp -= 4
    this.globalGet('origPosSp');
    this.i32Const(4);
    this.i32Sub();
    this.globalSet('origPosSp');

    // stack[origPosSp] = pos
    this.globalGet('origPosSp');
    this.globalGet('pos');
    this.i32Store();
  }

  popOrigPos() {
    this.globalGet('origPosSp');
    this.i32Const(4);
    this.i32Add();
    this.globalSet('origPosSp');
  }

  // Load the saved input position onto the stack.
  getOrigPos() {
    this.globalGet('origPosSp');
    this.i32Load();
  }

  restoreOrigPos() {
    this.getOrigPos();
    this.globalSet('pos');
    this.popOrigPos();
  }

  // Increment the current input position by 1.
  // [i32, i32] -> [i32]
  incPos() {
    this.globalGet('pos');
    this.i32Const(1);
    this.i32Add();
    this.globalSet('pos');
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
    return this.buildModule(importDecls, this.functionDecls(importDecls.length));
  }

  compileRule(name, info) {
    this.asm.addFunction(`$${name}`, [], [w.valtype.i32], () => {
      this.asm.addLocal('ret', w.valtype.i32);
      this.emitPExpr(info.body);
      this.asm.emit(instr.local.get, this.asm.localidx('ret'));
    });
    return this.asm._functionDecls.at(-1);
  }

  buildModule(importDecls, functionDecls) {
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

    // Export all of the globals so they get a name for debugging.
    // TODO: Handle this instead via the name section.
    for (const name of this.asm._globals.keys()) {
      exports.push(w.export_(name, [0x03, this.asm.globalidx(name)]));
    }

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
    asm.block(w.blocktype.empty, () => {
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
    asm.pushOrigPos();
    for (const term of exp.terms) {
      this.emitPExpr(term);
      asm.localGet('ret');
      asm.condBreak(0);
      asm.getOrigPos();
      asm.globalSet('pos');
    }
    asm.popOrigPos();
  }

  emitSeq(exp) {
    const {asm} = this;
    for (const factor of exp.factors) {
      this.emitPExpr(factor);
      asm.localGet('ret');
      asm.emit(instr.i32.eqz);
      asm.condBreak(0);
    }
  }

  emitApply(exp) {
    const {asm} = this;
    const idx = checkNotNull(
      this.ruleIdxByName.get(exp.ruleName),
      `Unknown rule: ${exp.ruleName}`
    );
    asm.emit(instr.call, w.funcidx(idx));
    asm.localSet('ret');
  }

  emitTerminal(exp) {
    // TODO:
    // - proper UTF-8!
    // - handle longer terminals with a loop

    const {asm} = this;
    const currCharCode = () => {
      asm.globalGet('pos');
      asm.i32Load8u();
    };

    for (const c of [...exp.obj]) {
      // Compare next char
      asm.i32Const(c.charCodeAt(0));
      currCharCode();
      asm.i32Ne();
      asm.if(w.blocktype.empty, () => {
        asm.i32Const(0);
        asm.localSet('ret');
        asm.break(1);
      });
      asm.incPos();
    }
    asm.i32Const(1);
    asm.localSet('ret');
  }

  emitStar({expr}) {
    const {asm} = this;
    asm.block(w.blocktype.empty, () => {
      asm.loop(w.blocktype.empty, () => {
        asm.pushOrigPos();
        this.emitPExpr(expr);
        asm.localGet('ret');
        asm.emit(instr.i32.eqz);
        asm.condBreak(1);
        asm.popOrigPos();
        asm.continue(0);
      });
    });
    // pos = origPos
    asm.getOrigPos();
    asm.globalSet('pos');

    asm.restoreOrigPos(); // XXX is this right?
    asm.i32Const(1);
    asm.localSet('ret');
  }

  emitPlus(plusExp) {
    const {asm} = this;
    this.emitPExpr(plusExp.expr);
    asm.localGet('ret');
    asm.emit(instr.i32.eqz);
    asm.condBreak(0);
    this.emitStar(plusExp);
  }

  emitLookahead({expr}) {
    const {asm} = this;
    asm.pushOrigPos();
    this.emitPExpr(expr);
    asm.restoreOrigPos();
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
