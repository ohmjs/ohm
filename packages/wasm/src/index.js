import * as w from '@wasmgroundup/emit';
import {pexprs} from 'ohm-js';
// import wabt from 'wabt';

import * as prebuilt from '../build/ohmRuntime.wasm_sections.ts';

const WASM_PAGE_SIZE = 64 * 1024;

const DEBUG = false;
const FAST_SAVE_BINDINGS = true;
const FAST_RESTORE_BINDINGS = true;

const {instr} = w;

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

const prebuiltFuncidx = nm => checkNotNull(prebuilt.funcidxByName[nm]);

// Produce a section combining `els` with the corresponding prebuilt section.
// This only does a naive merge; no type or function indices are rewritten.
function mergeSections(sectionId, prebuilt, els) {
  const count = prebuilt.entryCount + els.length;
  return w.section(sectionId, [w.u32(count), prebuilt.contents, els]);
}

function functypeToString(paramTypes, resultTypes) {
  const toStr = t => checkNotNull(['f64', 'f32', 'i64', 'i32'][t - w.valtype.f64]);
  const params = paramTypes.map(toStr).join(',');
  const results = resultTypes.map(toStr).join(',');
  return '[' + params + '][' + results + ']';
}

class TypeMap {
  constructor(startIdx = 0) {
    this._map = new Map();
    this._startIdx = startIdx;
  }

  add(paramTypes, resultTypes) {
    const key = functypeToString(paramTypes, resultTypes);
    if (this._map.has(key)) {
      return this._map.get(key)[0];
    }
    const idx = this._startIdx + this._map.size;
    this._map.set(key, [idx, w.functype(paramTypes, resultTypes)]);
    return idx;
  }

  addDecls(decls) {
    for (const {paramTypes, resultTypes} of decls) {
      this.add(paramTypes, resultTypes);
    }
  }

  getIdx(paramTypes, resultTypes) {
    const key = functypeToString(paramTypes, resultTypes);
    return checkNotNull(this._map.get(key))[0];
  }

  getIdxForDecl(decl) {
    return this.getIdx(decl.paramTypes, decl.resultTypes);
  }

  getTypes() {
    return [...this._map.values()].map(([_, t]) => t);
  }
}

/*
  Offers a higher-level interface for generating WebAssembly code and
  constructing a module.
 */
class Assembler {
  constructor(typeMap) {
    this._globals = new Map();

    this._functionDecls = [];
    this._importDecls = [];

    // Keep track of loops/blocks to make it easier (and safer) to generate
    // breaks to the correct index.
    this._blockStack = [];

    // State for the current function being generated.
    this._code = [];
    this._locals = undefined;

    this._typeMap = typeMap;
  }

  addBlocktype(paramTypes, resultTypes) {
    this._typeMap.add(paramTypes, resultTypes);
  }

  blocktype(paramTypes, resultTypes) {
    const idx = this._typeMap.getIdx(paramTypes, resultTypes);
    assert(idx !== -1, `Unknown blocktype: '${functypeToString(paramTypes, resultTypes)}'`);

    // From the spec: "The type index in a block type is encoded as a
    // positive signed integer, so that its signed LEB128 bit pattern cannot
    // collide with the encoding of value types or the special code 0x40."
    return w.i32(idx);
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
    paramTypes.forEach((t, i) => {
      this.addLocal(`__arg${i}`, t);
    });
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

  ifFalse(bt, bodyThunk) {
    this.emit(instr.i32.eqz);
    this.if(bt, bodyThunk);
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

  i32Mul() {
    this.emit(instr.i32.mul);
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

  currCharCode() {
    this.globalGet('pos');
    this.i32Load8u(Compiler.INPUT_BUFFER_OFFSET);
  }

  nextCharCode() {
    this.currCharCode();
    this.incPos();
  }

  setRet(val) {
    this.i32Const(val);
    this.localSet('ret');
  }

  pushStackFrame() {
    this.globalGet('sp');
    this.i32Const(Assembler.STACK_FRAME_SIZE_BYTES);
    this.i32Sub();
    this.globalSet('sp');
    this.savePos();
    this.saveNumBindings();
  }

  popStackFrame() {
    this.i32Const(Assembler.STACK_FRAME_SIZE_BYTES);
    this.globalGet('sp');
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

  saveNumBindings() {
    this.globalGet('sp');
    if (FAST_SAVE_BINDINGS) {
      this.globalGet('bindings');
      this.i32Load(12); // Array<i32>.length_
    } else {
      this.callPrebuiltFunc('getBindingsLength');
    }
    this.i32Store(4);
  }

  getSavedNumBindings() {
    this.globalGet('sp');
    this.i32Load(4);
  }

  restoreBindingsLength() {
    if (FAST_RESTORE_BINDINGS) {
      // It's safe to directly set the length as long as it's shrinking.
      this.globalGet('bindings');
      this.getSavedNumBindings();
      this.i32Store(12); // Array<i32>.length_
    } else {
      this.getSavedNumBindings();
      this.callPrebuiltFunc('setBindingsLength');
    }
  }

  // Increment the current input position by 1.
  // [i32, i32] -> [i32]
  incPos() {
    this.globalGet('pos');
    this.i32Inc();
    this.globalSet('pos');
  }

  callPrebuiltFunc(name) {
    this.emit(instr.call, w.funcidx(prebuiltFuncidx(name)));
  }

  newIterNodeWithSavedPosAndBindings() {
    this.getSavedPos();
    this.globalGet('pos');
    this.getSavedNumBindings();
    this.callPrebuiltFunc('newIterationNode');
  }

  newTerminalNodeWithSavedPos() {
    this.getSavedPos();
    this.globalGet('pos');
    this.callPrebuiltFunc('newTerminalNode');
  }

  maybeReturnTerminalNodeWithSavedPos() {
    this.ifElse(
        w.blocktype.i32,
        () => this.newTerminalNodeWithSavedPos(),
        () => this.i32Const(0),
    );
    this.localSet('ret');
  }
}
Assembler.ALIGN_1_BYTE = 0;
Assembler.ALIGN_4_BYTES = 2;
Assembler.CST_NODE_HEADER_SIZE_BYTES = 8;

// A "memo column" holds the info for one input position, i.e. one char.
Assembler.MEMO_COL_SIZE_BYTES = 4 * 256;

Assembler.STACK_FRAME_SIZE_BYTES = 8;

export class Compiler {
  constructor(grammar) {
    this.importDecls = [
      {
        module: 'env',
        name: 'abort',
        // (offset: i32, maxLen: i32) -> i32
        // Returns the actual number of bytes read.
        paramTypes: [w.valtype.i32, w.valtype.i32, w.valtype.i32, w.valtype.i32],
        resultTypes: [],
      },
      {
        module: 'env',
        name: 'fillInputBuffer',
        // (offset: i32, maxLen: i32) -> i32
        // Returns the actual number of bytes read.
        paramTypes: [w.valtype.i32, w.valtype.i32],
        resultTypes: [w.valtype.i32],
      },
      {
        module: 'env',
        name: 'printI32',
        // (val: i32) -> void
        paramTypes: [w.valtype.i32],
        resultTypes: [],
      },
    ];
    this.grammar = grammar;

    // The rule ID is a 0-based index that's mapped to the name.
    // It is *not* the same as the function index the rule's eval function.
    // Ensure that the default start rule always has id 0.
    this.ruleIdByName = new Map([[grammar.defaultStartRule, 0]]);
    for (const name of Object.keys(grammar.rules)) {
      if (name !== grammar.defaultStartRule) {
        this.ruleIdByName.set(name, this.ruleIdByName.size);
      }
    }
  }

  lookUpRule(ruleName, grammar = this.grammar) {
    // TODO: Find a cleaner way to handle terminals as parameters.
    // We should support any kind of single-arity parsing expression as
    // a parameter, not just terminals.
    if (ruleName.startsWith('$term$')) {
      return {
        body: new pexprs.Terminal(ruleName.substring(6)),
        formals: [],
      };
    }
    if (ruleName in grammar.rules) {
      return grammar.rules[ruleName];
    }
    if (grammar.superGrammar) {
      return this.lookUpRule(ruleName, grammar.superGrammar);
    }
    throw new Error(
        `Rule '${ruleName}' not found in this grammar or any of its supergrammars`,
    );
  }

  recordRule(name) {
    // If the rule is not defined in this grammar, but it's defined in a
    // supergrammar, lazily add it to the map.
    if (!this.ruleIdByName.has(name)) {
      if (name in this.grammar.superGrammar.rules) {
        this.ruleIdByName.set(name, this.ruleIdByName.size);
      } else if (name.startsWith('$term$')) {
        this.ruleIdByName.set(name, this.ruleIdByName.size);
      } else {
        throw new Error(`Unknown rule: ${name}`);
      }
    }
  }

  // Return a funcidx corresponding to the eval function for the given rule.
  ruleEvalFuncIdx(name) {
    const offset = this.importDecls.length + prebuilt.funcsec.entryCount;
    return w.funcidx(checkNotNull(this.ruleIdByName.get(name)) + offset);
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
    const typeMap = (this.typeMap = new TypeMap(prebuilt.typesec.entryCount));
    const asm = (this.asm = new Assembler(typeMap));
    asm.addBlocktype([w.valtype.i32], []);
    asm.addBlocktype([w.valtype.i32], [w.valtype.i32]);
    asm.addBlocktype([], [w.valtype.i32]); // Rule eval
    // (global $runtime/ohmRuntime/pos (mut i32) (i32.const 0))
    // (global $runtime/ohmRuntime/sp (mut i32) (i32.const 0))
    // (global $~lib/shared/runtime/Runtime.Stub i32 (i32.const 0))
    // (global $~lib/shared/runtime/Runtime.Minimal i32 (i32.const 1))
    // (global $~lib/shared/runtime/Runtime.Incremental i32 (i32.const 2))
    // (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
    // (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
    // (global $~lib/native/ASC_RUNTIME i32 (i32.const 0))
    // (global $runtime/ohmRuntime/bindings (mut i32) (i32.const 0))
    // (global $~lib/memory/__heap_base i32 (i32.const 1179884))
    asm.addGlobal('pos', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('sp', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__Runtime.Stub', w.valtype.i32, w.mut.const, () => asm.i32Const(0));
    asm.addGlobal('__Runtime.Minimal', w.valtype.i32, w.mut.const, () => asm.i32Const(1));
    asm.addGlobal('__Runtime.Incremental', w.valtype.i32, w.mut.const, () => asm.i32Const(2));
    asm.addGlobal('__startOffset', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__offset', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__ASC_RUNTIME', w.valtype.i32, w.mut.const, () => asm.i32Const(0));
    asm.addGlobal('bindings', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__heap_base', w.valtype.i32, w.mut.var, () => asm.i32Const(67240172));

    // Reserve a fixed number of imports for debug labels.
    const debugBaseFuncIdx = this.importDecls.length + 1;
    if (DEBUG) {
      for (let i = 0; i < 5000; i++) {
        this.importDecls.push({
          module: 'debug',
          name: `debug${i}`,
          paramTypes: [],
          resultTypes: [],
        });
      }
    }

    const functionDecls = this.functionDecls();
    this.rewriteDebugLabels(functionDecls, debugBaseFuncIdx);
    return this.buildModule(typeMap, functionDecls);
  }

  compileRule(name, ruleInfo) {
    const {asm} = this;
    const paramTypes = ruleInfo.formals.map(_ => w.valtype.i32);
    asm.addFunction(`$${name}`, paramTypes, [w.valtype.i32], () => {
      asm.addLocal('ret', w.valtype.i32);
      asm.addLocal('tmp', w.valtype.i32);

      this.emitPExpr(ruleInfo.body);
      asm.localGet('ret');
    });
    return this.asm._functionDecls.at(-1);
  }

  buildRuleNamesSection(ruleNames) {
    // A custom section that allows the clients to look up rule IDs by name.
    // They're simply encoded as a vec(name), and the client can turn this
    // into a list/array and use the ruleId as the index.
    return w.custom(w.name('ruleNames'), w.vec(ruleNames.map((n, i) => w.name(n))));
  }

  buildModule(typeMap, functionDecls) {
    const {importDecls} = this;
    assert(this.importDecls.length === prebuilt.destImportCount, 'import count mismatch');

    const ruleNames = [...this.ruleIdByName.keys()];

    // Ensure that `ruleNames` is in the correct order.
    ruleNames.forEach((n, i) => assert(i === this.ruleIdByName.get(n)));

    typeMap.addDecls(importDecls);
    typeMap.addDecls(functionDecls);

    const globals = [];
    const imports = importDecls.map((f, i) =>
      w.import_(f.module, f.name, w.importdesc.func(typeMap.getIdxForDecl(f))),
    );
    const funcs = functionDecls.map((f, i) => w.typeidx(typeMap.getIdxForDecl(f)));
    const codes = functionDecls.map(f => w.code(w.func(f.locals, f.body)));

    const exportOffset = importDecls.length + prebuilt.funcsec.entryCount;
    const exports = functionDecls.map((f, i) =>
      w.export_(f.name, w.exportdesc.func(i + exportOffset)),
    );
    exports.push(w.export_('memory', w.exportdesc.mem(0)));
    exports.push(w.export_('match', w.exportdesc.func(prebuiltFuncidx('match'))));
    exports.push(w.export_('getCstRoot', w.exportdesc.func(prebuiltFuncidx('getCstRoot'))));

    // Process globals.
    for (const [name, {type, mut, initExpr}] of this.asm._globals.entries()) {
      globals.push(w.global(w.globaltype(type, mut), initExpr));

      // Export all of the globals so they get a name for debugging.
      // TODO: Handle this instead via the name section.
      exports.push(w.export_(name, [0x03, this.asm.globalidx(name)]));
    }
    // The module will have a table containing references to all of the rule eval functions.
    // The table declaration goes in the table section; the data in the element section.
    // Note that the rule ID can be used directly as the table index.
    const numRules = this.ruleIdByName.size;
    const table = w.table(
        w.tabletype(w.elemtype.funcref, w.limits.minmax(numRules, numRules)),
    );
    const tableData = ruleNames.map(name => this.ruleEvalFuncIdx(name));
    assert(numRules === tableData.length, 'Invalid rule count');

    // Determine the index of the start function.
    const indexOfStart = functionDecls.findIndex(f => f.name === 'start');
    assert(indexOfStart !== -1, 'No start function found');
    const startFuncidx = imports.length + prebuilt.funcsec.entryCount + indexOfStart;

    // Note: globals are *not* merged; they are assumed to be shared.
    const mod = w.module([
      mergeSections(w.SECTION_ID_TYPE, prebuilt.typesec, typeMap.getTypes()),
      w.importsec(imports),
      mergeSections(w.SECTION_ID_FUNCTION, prebuilt.funcsec, funcs),
      w.tablesec([table]),
      w.memsec([w.mem(w.memtype(w.limits.min(1024 + 24)))]),
      w.globalsec(globals),
      w.exportsec(exports),
      w.startsec(w.start(startFuncidx)),
      w.elemsec([w.elem(w.tableidx(0), [instr.i32.const, w.i32(0), instr.end], tableData)]),
      mergeSections(w.SECTION_ID_CODE, prebuilt.codesec, codes),
      w.customsec(this.buildRuleNamesSection(ruleNames)),
    ]);
    const bytes = Uint8Array.from(mod.flat(Infinity));

    // (async () => {
    //   const {readWasm} = await wabt();
    //   const m = readWasm(bytes, {check: true});
    //   m.validate();
    // })();

    // DEBUG
    // import('fs').then(fs => {
    //   const filename = `out-${new Date().getTime()}.wasm`;
    //   fs.writeFileSync(`/Users/pdubroy/${filename}`, bytes);
    //   console.log(` wrote  ${filename}`);
    // });
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
    const names = new Set();
    for (let i = 0; i < decls.length; i++) {
      const entry = decls[i];
      entry.body = entry.body.flatMap(x => {
        if (typeof x !== 'string') return x;

        // If debugging is disabled, just drop the string altogether.
        if (!DEBUG) return [];

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
  }

  functionDecls() {
    // This is a bit messy. By default, we include all the rules in the
    // grammar itself, but only inherited rules if they are referenced.
    // So, `ruleIdxByName` can grow while we're iterating (as we reference
    // inherited rules for the first time).
    const ruleDecls = [];
    for (let i = 0; i < this.ruleIdByName.size; i++) {
      const name = [...this.ruleIdByName.keys()][i];
      ruleDecls.push(this.compileRule(name, this.lookUpRule(name)));
    }
    const {asm} = this;
    asm.addFunction('start', [], [], () => {
      asm.emit(instr.call, w.funcidx(prebuilt.startFuncidx));
    });
    ruleDecls.push(asm._functionDecls.at(-1));
    return ruleDecls;
  }

  // Contract: emitPExpr always means we're going deeper in the PExpr tree.
  emitPExpr(exp) {
    const {asm} = this;

    if (exp.constructor === pexprs.Apply) {
      this.emitApply(exp);
      return;
    }

    const debugLabel = getDebugLabel(exp);
    asm.emit(`BEGIN ${debugLabel}`);
    asm.pushStackFrame();

    // Wrap the body in a block, which is useful for two reasons:
    // - it allows early returns.
    // - it makes sure that the generated code doesn't have stack effects.
    asm.block(w.blocktype.empty, () => {
      // prettier-ignore
      switch (exp.constructor) {
        case pexprs.Alt: this.emitAlt(exp); break;
        case pexprs.Extend: this.emitExtend(exp); break;
        case pexprs.Lookahead: this.emitLookahead(exp, true); break;
        case pexprs.Not: this.emitLookahead(exp, false); break;
        case pexprs.Seq: this.emitSeq(exp); break;
        case pexprs.Star: this.emitStar(exp); break;
        case pexprs.Opt: this.emitOpt(exp); break;
        case pexprs.Range: this.emitRange(exp); break;
        case pexprs.Param: this.emitParam(exp); break;
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
    asm.popStackFrame();
    asm.emit(`END ${debugLabel}`);
  }

  emitAlt(exp) {
    const {asm} = this;
    asm.block(w.blocktype.empty, () => {
      for (const term of exp.terms) {
        this.emitPExpr(term);
        asm.localGet('ret');
        asm.condBreak(0); // return if succeeded
        asm.restorePos();
        asm.restoreBindingsLength();
      }
    });
  }

  emitAny() {
    const {asm} = this;
    asm.i32Const(0xff);
    asm.nextCharCode();
    asm.i32Ne();
    asm.maybeReturnTerminalNodeWithSavedPos();
  }

  emitApply(exp) {
    const {asm} = this;
    this.recordRule(exp.ruleName);

    const argCount = exp.args.length;
    assert(argCount <= 3, 'Too many arguments to rule application');

    const pushRuleId = name => {
      this.recordRule(name);
      asm.i32Const(checkNotNull(this.ruleIdByName.get(name), `Unknown rule: ${name}`));
    };

    pushRuleId(exp.ruleName);
    exp.args.forEach((arg, i) => {
      switch (arg.constructor) {
        case pexprs.Apply:
          pushRuleId(arg.ruleName);
          break;
        case pexprs.Param:
          asm.localGet(`__arg${arg.index}`);
          break;
        case pexprs.Terminal: {
          const ruleName = `$term$${arg.obj}`;
          this.recordRule(ruleName);
          pushRuleId(ruleName);
          break;
        }
        default:
          throw new Error(`not supported: ${arg.constructor.name}`);
      }
    });
    // TODO: Handle this at grammar parse time, not here.
    if (exp.ruleName.includes('_')) {
      asm.callPrebuiltFunc(`evalApplyNoMemo${argCount}`);
    } else {
      asm.callPrebuiltFunc(`evalApply${argCount}`);
    }
    asm.localSet('ret');
  }

  emitEnd() {
    const {asm} = this;
    asm.i32Const(0xff);
    // Careful! We shouldn't move the pos here. Or does it matter?
    asm.currCharCode();
    asm.emit(instr.i32.eq);
    asm.maybeReturnTerminalNodeWithSavedPos();
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
    this.emitPExpr(expr);
    if (!shouldMatch) {
      asm.localGet('ret');
      asm.emit(instr.i32.eqz);
      asm.localSet('ret');
    }
    asm.restoreBindingsLength();
    asm.restorePos();
  }

  emitOpt({expr}) {
    const {asm} = this;
    this.emitPExpr(expr);
    asm.localGet('ret');
    asm.ifFalse(w.blocktype.empty, () => {
      asm.restorePos();
      asm.restoreBindingsLength();
    });
    asm.newIterNodeWithSavedPosAndBindings();
    asm.localSet('ret');
  }

  emitParam({index}) {
    const {asm} = this;
    asm.localGet(`__arg${index}`);
    asm.callPrebuiltFunc('evalApply0');
    asm.localSet('ret');
  }

  emitPlus(plusExp) {
    const {asm} = this;
    this.emitPExpr(plusExp.expr);
    asm.localGet('ret');
    asm.if(w.blocktype.empty, () => {
      this.emitStar(plusExp);
    });
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

    // if (c >= lo)
    asm.i32Const(lo);
    asm.emit(instr.i32.ge_u);
    asm.maybeReturnTerminalNodeWithSavedPos();
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

  emitStar({expr}, {reuseStackFrame} = {}) {
    const {asm} = this;

    // We push another stack frame because we need to save and restore
    // the position just before the last (failed) expression.
    asm.pushStackFrame();
    asm.block(w.blocktype.empty, () => {
      asm.loop(w.blocktype.empty, () => {
        asm.savePos();
        asm.saveNumBindings();
        this.emitPExpr(expr);
        asm.localGet('ret');
        asm.emit(instr.i32.eqz);
        asm.condBreak(1);
        asm.continue(0);
      });
    });
    asm.restorePos();
    asm.restoreBindingsLength();
    asm.popStackFrame();

    asm.newIterNodeWithSavedPosAndBindings();
    asm.localSet('ret');
  }

  emitTerminal(exp) {
    // TODO:
    // - proper UTF-8!
    // - handle longer terminals with a loop
    // - SIMD

    const {asm} = this;
    asm.emit('Terminal');
    for (const c of [...exp.obj]) {
      // Compare next char
      asm.i32Const(c.charCodeAt(0));
      asm.currCharCode();
      asm.emit(instr.i32.ne);
      asm.if(w.blocktype.empty, () => {
        asm.setRet(0);
        asm.break(1);
      });
      asm.incPos();
    }
    asm.newTerminalNodeWithSavedPos();
    asm.localSet('ret');
  }
}
// Memory layout:
// - First page is for the PExpr stack (origPos, etc.), growing downards.
// - 2nd page is for input buffer (max 64k for now).
// - Pages 3-18 (incl.) for memo table (4 entries per char, 4 bytes each).
// - Remainder (>18) is for CST (growing upwards).
Compiler.STACK_START_OFFSET = WASM_PAGE_SIZE; // Starting offset of the stack.
Compiler.INPUT_BUFFER_OFFSET = WASM_PAGE_SIZE; // Offset of the input buffer in memory.

// For now, 1k *pages* for the memo table.
// That's 1/64 page per char:
// - 4 bytes per entry
// - 256 entries per column
// - 1 column per char
// - 64k input length.
Compiler.MEMO_START_OFFSET = 2 * WASM_PAGE_SIZE; // Starting offset of memo records.
Compiler.CST_START_OFFSET = (1024 + 2) * WASM_PAGE_SIZE; // Starting offset of CST records.

export const ConstantsForTesting = {
  CST_NODE_SIZE_BYTES: checkNotNull(Assembler.CST_NODE_HEADER_SIZE_BYTES),
  CST_START_OFFSET: checkNotNull(Compiler.CST_START_OFFSET),
  MEMO_COL_SIZE_BYTES: checkNotNull(Assembler.MEMO_COL_SIZE_BYTES),
  MEMO_START_OFFSET: checkNotNull(Compiler.MEMO_START_OFFSET),
};
