/* global TextEncoder, WebAssembly */

import * as w from '@wasmgroundup/emit';
// import wabt from 'wabt';
// import fs from 'node:fs';

const {instr} = w;
import {pexprs} from 'ohm-js';

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
    for (let i = 0; i < 1000; i++) {
      name = `${str}_${i}`;
      if (!names.has(name)) break outer;
    }
    throw new Error(`Unique name generation failed for ${str}`);
  }
  names.add(name);
  return name;
}

function getDebugLabel(exp) {
  const loc = exp.source ? exp.source.startIdx : -1;
  return `${exp.toDisplayString()}@${loc}`;
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

  doEmit(thunk) {
    const oldCode = this._code;
    this._code = [];
    thunk();
    const body = [...this._code, instr.end];
    this._code = oldCode;
    return body;
  }

  addGlobal(name, type, mut, initThunk) {
    assert(!this._globals.has(name), `Global '${name}' already exists`);
    const idx = this._globals.size;
    const initExpr = this.doEmit(initThunk);
    this._globals.set(name, {idx, type, mut, initExpr});
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
      body: [...this._code, instr.end],
    });
    this._code = [];
    this._locals = undefined;
  }

  // Pure codegen helpers (used to generate the function bodies).

  globalidx(name) {
    const {idx} = checkNotNull(this._globals.get(name), `Unknown global: ${name}`);
    return idx;
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
    this.ifElse(bt, bodyThunk);
  }

  ifElse(bt, thenThunk, elseThunk = undefined) {
    this.emit(w.instr.if, bt);
    this._blockStack.push('if');
    thenThunk();
    if (elseThunk) {
      this.emit(w.instr.else);
      elseThunk();
    }
    this._blockStack.pop();
    this.emit(w.instr.end);
  }

  br(depth) {
    this.emit(instr.br, w.labelidx(depth));
  }

  i32Add() {
    this.emit(instr.i32.add);
  }

  i32Const(value) {
    this.emit(instr.i32.const, w.i32(value));
  }

  i32Load(offset = 0) {
    this.emit(instr.i32.load, w.memarg(Assembler.ALIGN_4_BYTES, offset));
  }

  i32Load8u(offset = 0) {
    this.emit(instr.i32.load8_u, w.memarg(Assembler.ALIGN_1_BYTE, offset));
  }

  i32Ne() {
    this.emit(instr.i32.ne);
  }

  // Store [addr:i32, val:i32] -> []
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

  localTee(name) {
    this.emit(instr.local.tee, this.localidx(name));
  }

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

  // "Macros" -- codegen helpers specific to Ohm.

  i32Inc() {
    this.i32Const(1);
    this.i32Add();
  }

  i32Dec() {
    this.i32Const(1);
    this.i32Sub();
  }

  dup() {
    this.localTee('tmp');
    this.localGet('tmp');
  }

  nextCharCode() {
    this.globalGet('pos');
    this.i32Load8u();
    this.incPos();
  }

  setRet(val) {
    this.i32Const(val);
    this.localSet('ret');
  }

  pushStackFrame() {
    // sp -= 4
    this.globalGet('sp');
    this.i32Const(Assembler.STACK_FRAME_SIZE_BYTES);
    this.i32Sub();
    this.globalSet('sp');
  }

  popStackFrame() {
    this.globalGet('sp');
    this.i32Const(Assembler.STACK_FRAME_SIZE_BYTES);
    this.i32Add();
    this.globalSet('sp');
  }

  // Save the current input position.
  savePos() {
    // stack[sp] = pos
    this.globalGet('sp');
    this.globalGet('pos');
    this.i32Store();
  }

  // Load the saved input position onto the stack.
  getSavedPos() {
    this.globalGet('sp');
    this.i32Load();
  }

  restorePos() {
    this.getSavedPos();
    this.globalSet('pos');
  }

  saveCst() {
    this.globalGet('sp');
    this.globalGet('cst');
    this.i32Store(4);
  }

  getSavedCst() {
    this.globalGet('sp');
    this.i32Load(4);
  }

  // Increment the current input position by 1.
  // [i32, i32] -> [i32]
  incPos() {
    this.globalGet('pos');
    this.i32Inc();
    this.globalSet('pos');
  }

  // Allocate a new CST node.
  // [] -> [i32]
  cstNodeAlloc() {
    this.globalGet('cst');
    this.dup();
    this.i32Const(8);
    this.i32Add();
    this.globalSet('cst');
  }

  // [] -> []
  restoreCst() {
    this.getSavedCst();
    this.globalSet('cst');
  }

  incDepth() {
    this.globalGet('depth');
    this.i32Inc();
    this.globalSet('depth');
  }

  decDepth() {
    this.globalGet('depth');
    this.i32Dec();
    this.globalSet('depth');
  }

  // Set the 'depth' field of a given CST node.
  // [val:i32, addr:i32] -> []
  cstNodeSetDepth() {
    this.i32Store(0);
  }

  // Get the 'depth' field of a given CST node.
  // [addr:i32] -> [i32]
  cstNodeGetDepth() {
    this.i32Load(0);
  }

  // Set the 'matchLength' field of a given CST node.
  // [val:i32, addr:i32] -> []
  cstNodeSetMatchLength() {
    this.i32Store(4);
  }
}
Assembler.ALIGN_1_BYTE = 0;
Assembler.ALIGN_4_BYTES = 2;
Assembler.STACK_FRAME_SIZE_BYTES = 8;

export class Compiler {
  constructor(grammar) {
    this.importDecls = [
      {
        module: 'env',
        name: 'fillInputBuffer',
        // (offset: i32, maxLen: i32) -> i32
        // Returns the actual number of bytes read.
        paramTypes: [w.valtype.i32, w.valtype.i32],
        resultTypes: [w.valtype.i32],
      },
    ];
    this.grammar = grammar;
    this.ruleIdxByName = new Map(Object.keys(grammar.rules).map((name, i) => [name, i]));
    this._labels = new Set();
  }

  ruleBody(ruleName, grammar = this.grammar) {
    if (ruleName in grammar.rules) {
      return grammar.rules[ruleName].body;
    }
    if (grammar.superGrammar) {
      return this.ruleBody(ruleName, grammar.superGrammar);
    }
    throw new Error(
        `Rule '${ruleName}' not found in this grammar or any of its supergrammars`,
    );
  }

  ruleEvalFuncIdx(name) {
    // If the rule is not defined in this grammar, but it's defined in a
    // supergrammar, lazily add it to the map.
    if (!this.ruleIdxByName.has(name)) {
      if (name in this.grammar.superGrammar.rules) {
        this.ruleIdxByName.set(name, this.ruleIdxByName.size);
      } else {
        throw new Error(`Unknown rule: ${name}`);
      }
    }
    return w.funcidx(this.ruleIdxByName.get(name) + this.importDecls.length + 1);
  }

  // Return an object implementing all of the debug imports.
  getDebugImports(log) {
    const ans = {};
    for (const decl of this.importDecls.filter(d => d.module === 'debug')) {
      const {name} = decl;
      ans[name] = arg => {
        // eslint-disable-next-line no-console
        log(name, arg);
      };
    }
    return ans;
  }

  compile() {
    const asm = (this.asm = new Assembler());
    asm.addGlobal('pos', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('sp', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('cst', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('depth', w.valtype.i32, w.mut.var, () => asm.i32Const(0));

    // Reserve a fixed number of imports for debug labels.
    const debugBaseFuncIdx = this.importDecls.length;
    for (let i = 0; i < 5000; i++) {
      this.importDecls.push({
        module: 'debug',
        name: `debug${i}`,
        paramTypes: [],
        resultTypes: [],
      });
    }

    const functionDecls = this.functionDecls();
    const debugDecls = this.rewriteDebugLabels(functionDecls, debugBaseFuncIdx);
    return this.buildModule([...functionDecls, ...debugDecls]);
  }

  compileRule(name, ruleBody) {
    this.asm.addFunction(`$${name}`, [], [w.valtype.i32], () => {
      this.asm.addLocal('ret', w.valtype.i32);
      this.asm.addLocal('tmp', w.valtype.i32);
      this.emitPExpr(ruleBody);
      this.asm.emit(instr.local.get, this.asm.localidx('ret'));
    });
    return this.asm._functionDecls.at(-1);
  }

  buildModule(functionDecls) {
    const {importDecls} = this;
    const types = [...importDecls, ...functionDecls].map(f =>
      w.functype(f.paramTypes, f.resultTypes),
    );
    const globals = [];
    const imports = importDecls.map((f, i) =>
      w.import_(f.module, f.name, w.importdesc.func(i)),
    );
    const funcs = functionDecls.map((f, i) => w.typeidx(i + importDecls.length));
    const codes = functionDecls.map(f => w.code(w.func(f.locals, f.body)));
    const exports = functionDecls.map((f, i) =>
      w.export_(f.name, w.exportdesc.func(i + importDecls.length)),
    );
    exports.push(w.export_('memory', w.exportdesc.mem(0)));

    // Process globals.
    for (const [name, {type, mut, initExpr}] of this.asm._globals.entries()) {
      globals.push(w.global(w.globaltype(type, mut), initExpr));

      // Export all of the globals so they get a name for debugging.
      // TODO: Handle this instead via the name section.
      exports.push(w.export_(name, [0x03, this.asm.globalidx(name)]));
    }

    // Memory layout:
    // - First page is for input buffer (growing upwards) and origPos stack
    //   (growing downwards).
    // - Second page is for CST.

    const mod = w.module([
      w.typesec(types),
      w.importsec(imports),
      w.funcsec(funcs),
      w.memsec([w.mem(w.memtype(w.limits.min(8)))]),
      w.globalsec(globals),
      w.exportsec(exports),
      w.codesec(codes),
    ]);
    const bytes = Uint8Array.from(mod.flat(Infinity));

    // (async () => {
    //   const {readWasm} = await wabt();
    //   const m = readWasm(bytes, {check: true});
    //   // console.log(m.toText());
    //   m.validate();
    // })();

    // DEBUG
    // const filename = `out-${new Date().getTime()}.wasm`;
    // fs.writeFileSync(`/Users/pdubroy/${filename}`, bytes);
    // console.log(` wrote  ${filename}`);
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

        // Claim one of the reserved debug functions…
        const decl = this.importDecls[nextFuncIdx];
        assert(decl, 'Too few debug functions!');
        assert(decl.module === 'debug');
        decl.name = uniqueName(names, x);

        let pushArg = [];
        if (x.startsWith('END')) {
          decl.paramTypes = [w.valtype.i32];
          pushArg = [instr.local.get, w.localidx(0)];
        }

        // …and replace the string with a call to that function.
        return [...pushArg, instr.call, w.funcidx(nextFuncIdx++)].flat(Infinity);
      });
    }
    return debugDecls;
  }

  emitMatchBody() {
    const {asm} = this;
    const getInputLen = () => [instr.local.get, w.localidx(0)];
    const getCurrPos = () => [instr.global.get, w.globalidx(0)];

    asm.i32Const(0);
    asm.globalSet('pos');

    asm.i32Const(64 * 1024);
    asm.globalSet('sp');

    asm.i32Const(64 * 1024);
    asm.globalSet('cst');

    asm.i32Const(0); // offset
    asm.i32Const(64 * 1024); // maxLen
    asm.emit(instr.call, w.funcidx(0));

    asm.emit(instr.local.set, w.localidx(0)); // set inputLen
    asm.emit(instr.call, this.ruleEvalFuncIdx(this.grammar.defaultStartRule));
    asm.ifElse(
        w.blocktype.i32,
        () => {
        // match succeeded -- return currPos == inputLen
          asm.emit(getInputLen(), getCurrPos(), instr.i32.eq);
        },
        () => {
          asm.i32Const(0);
        },
    );
  }

  functionDecls() {
    // This is a bit messy. By default, we include all the rules in the
    // grammar itself, but only inherited rules if they are referenced.
    // So, `ruleIdxByName` can grow while we're iterating (as we reference
    // inherited rules for the first time).
    const ruleDecls = [];
    for (let i = 0; i < this.ruleIdxByName.size; i++) {
      const name = [...this.ruleIdxByName.keys()][i];
      ruleDecls.push(this.compileRule(name, this.ruleBody(name)));
    }

    return [
      {
        name: 'match',
        paramTypes: [],
        resultTypes: [w.valtype.i32],
        locals: [w.locals(1, w.valtype.i32)],
        body: this.asm.doEmit(() => this.emitMatchBody()),
      },
      ...ruleDecls,
    ];
  }

  // Contract: emitPExpr always means we're going deeper in the PExpr tree.
  emitPExpr(exp, {skipBacktracking} = {}) {
    const {asm} = this;
    const isLookahead = exp.constructor === pexprs.Lookahead || exp.constructor === pexprs.Not;
    const emitBacktracking = !skipBacktracking && !isLookahead;

    const debugLabel = getDebugLabel(exp);
    asm.emit(`BEGIN ${debugLabel}`);

    // *Always* save the original position, even if we're not backtracking.
    asm.pushStackFrame();
    asm.savePos();

    asm.saveCst();
    asm.cstNodeAlloc();
    asm.globalGet('depth');
    asm.cstNodeSetDepth();
    asm.incDepth();

    // Wrap the body in a block, which is useful for two reasons:
    // - it allows early returns.
    // - it makes sure that the generated code doesn't have stack effects.
    asm.block(w.blocktype.empty, () => {
      // prettier-ignore
      switch (exp.constructor) {
        case pexprs.Alt: this.emitAlt(exp); break;
        case pexprs.Apply: this.emitApply(exp); break;
        case pexprs.Extend: this.emitExtend(exp); break;
        case pexprs.Lookahead: this.emitLookahead(exp, true); break;
        case pexprs.Not: this.emitLookahead(exp, false); break;
        case pexprs.Seq: this.emitSeq(exp); break;
        case pexprs.Star: this.emitStar(exp); break;
        case pexprs.Opt: this.emitOpt(exp); break;
        case pexprs.Range: this.emitRange(exp); break;
        case pexprs.Plus: this.emitPlus(exp); break;
        case pexprs.Terminal: this.emitTerminal(exp); break;
        case pexprs.UnicodeChar: this.emitFail(); break; // TODO: Handle this properly
        default:
          if (exp === pexprs.any) {
            this.emitAny();
          } else if (exp === pexprs.end) {
            this.emitEnd();
          } else {
            throw new Error(`not handled: ${exp.constructor.name}`);
          }
      }
    });
    asm.decDepth();

    // If we succeeded, write the CST entry.
    asm.localGet('ret');
    asm.ifElse(
        w.blocktype.empty,
        () => {
        // Set the match length.
          asm.getSavedCst();
          asm.globalGet('pos');
          asm.getSavedPos();
          asm.i32Sub();
          asm.cstNodeSetMatchLength();
        },
        () => {
          if (emitBacktracking) asm.restorePos();
          asm.restoreCst();
        },
    );
    if (isLookahead) {
      asm.restorePos();

      // TODO: Skip CST work altogether when we're inside a lookahead.
      // (Maybe only for negative lookahead?)
      asm.restoreCst();
    }
    asm.popStackFrame();
    asm.emit(`END ${debugLabel}`);
  }

  emitAlt(exp) {
    const {asm} = this;
    for (const term of exp.terms) {
      this.emitPExpr(term);
      asm.localGet('ret');
      asm.condBreak(0);
    }
  }

  emitAny() {
    const {asm} = this;
    asm.i32Const(0xff);
    asm.nextCharCode();
    asm.i32Ne();
    asm.localSet('ret');
  }

  emitApply(exp) {
    const {asm} = this;
    asm.emit(instr.call, this.ruleEvalFuncIdx(exp.ruleName));
    asm.localSet('ret');
  }

  emitEnd() {
    const {asm} = this;
    asm.i32Const(0xff);
    // Careful! We shouldn't move the pos here. Or does it matter?
    asm.globalGet('pos');
    asm.i32Load8u();
    asm.emit(instr.i32.eq);
    asm.localSet('ret');
  }

  emitExtend(exp) {
    this.emitAlt({
      terms: [exp.body, exp.superGrammar.rules[exp.name].body],
    });
  }

  emitFail() {
    const {asm} = this;
    asm.i32Const(0);
    asm.localSet('ret');
  }

  emitLookahead({expr}, shouldMatch = true) {
    const {asm} = this;
    // TODO: Should positive lookahead record a CST?
    this.emitPExpr(expr, {skipBacktracking: true, skipCst: true});
    if (!shouldMatch) {
      asm.localGet('ret');
      asm.emit(instr.i32.eqz);
      asm.localSet('ret');
    }
  }

  emitOpt({expr}) {
    const {asm} = this;
    this.emitPExpr(expr);
    asm.setRet(1); // Always succeed.
  }

  emitPlus(plusExp) {
    const {asm} = this;
    this.emitPExpr(plusExp.expr);
    asm.localGet('ret');
    asm.emit(instr.i32.eqz);
    asm.condBreak(0);
    this.emitStar(plusExp);
  }

  emitRange({from, to}) {
    assert(from.length === 1 && to.length === 1);

    const lo = from.charCodeAt(0);
    const hi = to.charCodeAt(0);

    // TODO: Do we disallow 0xff in the range?
    const {asm} = this;
    asm.nextCharCode();

    // if (c > hi) return 0;
    asm.dup();
    asm.i32Const(hi);
    asm.emit(instr.i32.gt_u);
    asm.if(w.blocktype.empty, () => {
      asm.setRet(0);
      asm.break(1);
    });

    // return c >= lo;
    asm.i32Const(lo);
    asm.emit(instr.i32.ge_u);
    asm.localSet('ret');
  }

  emitSeq(exp) {
    const {asm} = this;

    // An empty sequence always succeeds.
    if (exp.factors.length === 0) {
      asm.setRet(1);
      return;
    }

    for (const factor of exp.factors) {
      this.emitPExpr(factor);
      asm.localGet('ret');
      asm.emit(instr.i32.eqz);
      asm.condBreak(0);
    }
  }

  emitStar({expr}) {
    const {asm} = this;
    asm.block(w.blocktype.empty, () => {
      asm.loop(w.blocktype.empty, () => {
        this.emitPExpr(expr);
        asm.localGet('ret');
        asm.emit(instr.i32.eqz);
        asm.condBreak(1);
        asm.continue(0);
      });
    });
    asm.setRet(1);
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
}

export class WasmMatcher {
  constructor(grammar) {
    this.grammar = grammar;
    this._instance = undefined;
    this._input = '';
    this._pos = 0;
    this._env = {
      fillInputBuffer: this._fillInputBuffer.bind(this),
    };
  }

  static async forGrammar(grammar) {
    const compiler = new Compiler(grammar);
    const bytes = compiler.compile();
    const matcher = new WasmMatcher(grammar);
    const {instance} = await WebAssembly.instantiate(bytes, {
      env: matcher._env,
      debug: compiler.getDebugImports((label, ret) => {
        // const result = ret === 1 ? 'SUCCESS' : ret === 0 ? 'FAIL' : '';
        // eslint-disable-next-line no-console
        // console.log(`pos: ${instance.exports.pos.value}`, label, result);
      }),
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
