import * as w from '@wasmgroundup/emit';
import * as ohm from 'ohm-js';
// import wabt from 'wabt';

import * as ir from './ir.ts';
import * as prebuilt from '../build/ohmRuntime.wasm_sections.ts';

const WASM_PAGE_SIZE = 64 * 1024;

// eslint-disable-next-line no-undef
const DEBUG = typeof process !== 'undefined' && process.env.OHM_DEBUG === '1';
const FAST_SAVE_BINDINGS = true;
const FAST_RESTORE_BINDINGS = true;

const IMPLICIT_SPACE_SKIPPING = true;

// When specializing rules, should we emit a generalized version that
// handles the specific cases? If false, code size will be larger.
// This doesn't seem to make a big performance difference either way.
const EMIT_GENERALIZED_RULES = false;

// A sentinel value representing "end of input".
// This could be anything > 0xffff, really.
const CHAR_CODE_END = 0xffffffff;

const {instr} = w;
const {pexprs} = ohm;

// Constants for Wasm 3.0 (stuff not in @wasmgroundup/emit).
const wasm3 = {
  valtype: {externref: 0x6f},
  instr: {ref: {null: 0xd0}},
};

const defaultImports = [
  // func codePointAt(string: externref, index: i32) -> i32
  {
    module: 'wasm:js-string',
    name: 'charCodeAt',
    paramTypes: [wasm3.valtype.externref, w.valtype.i32],
    resultTypes: [w.valtype.i32],
  },
];

const isNonNull = x => x != null;

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

function setdefault(map, key, makeDefaultVal) {
  if (!map.has(key)) map.set(key, makeDefaultVal());
  return map.get(key);
}

const getNotNull = (map, k) => checkNotNull(map.get(k), `not found: '${k}'`);

// Return true if the given expression is an Apply or a Param.
// (When compiling to Wasm, we implement both with a call.)
const isApplyLike = exp => exp instanceof pexprs.Apply || exp instanceof pexprs.Param;

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

function isSyntacticRule(ruleName) {
  assert(ruleName[0] !== '$', ruleName);
  return ruleName[0] === ruleName[0].toUpperCase();
}

const asciiChars = Array.from({length: 128}).map((_, i) => String.fromCharCode(i));

class StringTable {
  constructor() {
    this._map = new Map();
    this._strs = [];
  }

  add(str) {
    if (this._map.has(str)) {
      return this._map.get(str);
    }
    const idx = this._map.size;
    this._map.set(checkNotNull(str), idx);
    this._strs.push(str);
    return idx;
  }

  getStr(idx) {
    return this._strs[idx];
  }

  getIndex(item) {
    return this._map.get(item);
  }

  has(item) {
    return this._map.has(item);
  }

  get size() {
    return this._map.size;
  }

  keys() {
    return [...this._map.keys()];
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
}

function collectParams(exp, seen = new Set()) {
  switch (exp.constructor) {
    case pexprs.Param:
      if (!seen.has(exp.index)) {
        seen.add(exp.index);
        return [exp];
      }
      return [];
    case pexprs.Alt:
      return exp.terms.flatMap(e => collectParams(e, seen));
    case pexprs.Apply:
      return exp.args.flatMap(e => collectParams(e, seen));
    case pexprs.Lookahead:
    case pexprs.Not:
    case pexprs.Opt:
    case pexprs.Plus:
    case pexprs.Seq:
      return exp.factors.flatMap(e => collectParams(e, seen));
    case pexprs.Star:
      return collectParams(exp.expr, seen);
    case pexprs.Range:
    case pexprs.Terminal:
    case pexprs.UnicodeChar:
      return [];
    default:
      throw new Error(`not handled: ${exp.constructor.name}`);
  }
}

const prebuiltFuncidx = nm => checkNotNull(prebuilt.funcidxByName[nm]);

// Produce a section combining `els` with the corresponding prebuilt section.
// This only does a naive merge; no type or function indices are rewritten.
function mergeSections(sectionId, prebuiltSec, els) {
  const count = prebuiltSec.entryCount + els.length;
  return w.section(sectionId, [w.u32(count), prebuiltSec.contents, els]);
}

function functypeToString(paramTypes, resultTypes) {
  const toStr = t => {
    return t === wasm3.valtype.externref
      ? 'externref'
      : checkNotNull(['f64', 'f32', 'i64', 'i32'][t - w.valtype.f64]);
  };
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

  block(bt, bodyThunk, label = '') {
    this._blockOnly(bt, label);
    bodyThunk();
    this._endBlock();
  }

  // Prefer to use `block`, but for some cases it's more convenient to emit
  // the block and the end separately.
  // Note: `label` (if specified) is not unique (e.g., 'pexprEnd').
  _blockOnly(bt, label) {
    this.emit(instr.block, bt);
    this._blockStack.push(label ? `block:${label}` : 'block');
  }

  // This should always be paired with `blockOnly`.
  _endBlock() {
    const what = this._blockStack.pop().split(':')[0];
    assert(what === 'block', 'Invalid endBlock');
    this.emit(instr.end);
  }

  loop(bt, bodyThunk) {
    this.emit(instr.loop, bt);
    this._blockStack.push('loop');
    bodyThunk();
    this._blockStack.pop();
    this.emit(instr.end);
  }

  if(bt, bodyThunk) {
    this.ifElse(bt, bodyThunk);
  }

  ifElse(bt, thenThunk, elseThunk = undefined) {
    this.emit(instr.if, bt);
    this._blockStack.push('if');
    thenThunk();
    if (elseThunk) {
      this.emit(instr.else);
      elseThunk();
    }
    this._blockStack.pop();
    this.emit(instr.end);
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

  i32Eq() {
    this.emit(instr.i32.eq);
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
    const what = this._blockStack.at(-(depth + 1)).split(':')[0];
    assert(what === 'block' || what === 'if', 'Invalid break');
    this.emit(instr.br, w.labelidx(depth));
  }

  // Conditional break -- emits a `br_if` for the given depth.
  condBreak(depth) {
    const what = this._blockStack.at(-(depth + 1)).split(':')[0];
    assert(what === 'block' || what === 'if', 'Invalid condBreak');
    this.emit(instr.br_if, w.labelidx(depth));
  }

  continue(depth) {
    const what = this._blockStack.at(-(depth + 1)).split(':')[0];
    assert(what === 'loop', 'Invalid continue');
    this.emit(instr.br, w.labelidx(depth));
  }

  brTable(labels, defaultLabelidx) {
    this.emit(instr.br_table, w.vec(labels), defaultLabelidx);
  }

  return() {
    this.emit(instr.return);
  }

  // Emit a dense jump table (switch-like) using br_table.
  switch(bt, discrimThunk, numCases, caseCb, defaultThunk) {
    const startStackHeight = this._blockStack.length;

    const labels = [];

    // Emit one block per case…
    for (let i = 0; i < numCases; i++) {
      this._blockOnly(bt);
      labels.push(w.labelidx(i));
    }

    // …and one inner block containing the condition and the br_table.
    this.block(w.blocktype.empty, () => {
      discrimThunk();
      this.brTable(labels, w.labelidx(labels.length));
    });

    for (let i = 0; i < numCases; i++) {
      const depth = labels.length - (i + 1);
      caseCb(i, depth);
      this.break(depth); // Jump to end.
      this._endBlock();
    }
    assert(this._blockStack.length === startStackHeight);
  }

  refNull(valtype) {
    this.emit(wasm3.instr.ref.null, valtype);
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
    this.globalGet('endPos');
    this.emit(instr.i32.lt_u);

    this.ifElse(
      w.blocktype.i32,
      () => {
        this.globalGet('input');
        this.globalGet('pos');
        this.emit(instr.call, w.funcidx(prebuilt.importsec.entryCount));
      },
      () => {
        this.i32Const(CHAR_CODE_END);
      }
    );
  }

  nextCharCode() {
    this.currCharCode();
    this.incPos();
  }

  setRet(val) {
    this.i32Const(val);
    this.localSet('ret');
  }

  pushStackFrame(saveThunk, size = Assembler.STACK_FRAME_SIZE_BYTES) {
    this.globalGet('sp');
    this.i32Const(size);
    this.i32Sub();
    this.globalSet('sp');
    if (saveThunk) {
      saveThunk();
    } else {
      this.savePos();
      this.saveNumBindings();
    }
  }

  popStackFrame(size = Assembler.STACK_FRAME_SIZE_BYTES) {
    this.i32Const(size);
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

  saveFailurePos() {
    this.globalGet('sp');
    this.localGet('failurePos');
    this.i32Store();
  }

  restoreFailurePos() {
    this.globalGet('sp');
    this.i32Load();
    this.localSet('failurePos');
  }

  saveGlobalFailurePos() {
    this.globalGet('sp');
    this.globalGet('rightmostFailurePos');
    this.i32Store(4);
  }

  restoreGlobalFailurePos() {
    this.globalGet('sp');
    this.i32Load(4);
    this.globalSet('rightmostFailurePos');
  }

  updateGlobalFailurePos() {
    // rightmostFailurePos = max(rightmostFailurePos, failurePos)
    this.i32Max(
      () => this.globalGet('rightmostFailurePos'),
      () => this.localGet('failurePos')
    );
    this.globalSet('rightmostFailurePos');
  }

  updateLocalFailurePos(origPosThunk) {
    // failurePos = max(failurePos, origPos)
    this.i32Max(() => this.localGet('failurePos'), origPosThunk);
    this.localSet('failurePos');
  }

  maybeRecordFailure(origPosThunk, failureId) {
    this.globalGet('errorMessagePos');
    this.i32Const(0);
    this.emit(instr.i32.ge_s);
    this.if(w.blocktype.empty, () => {
      this.globalGet('errorMessagePos');
      origPosThunk();
      this.i32Eq();
      this.if(w.blocktype.empty, () => {
        this.emit('failure#' + failureId);
        if (failureId === undefined) throw new Error('bad failureId');
        this.i32Const(failureId);
        this.callPrebuiltFunc('recordFailure');
      });
    });
  }

  // For rules with descriptions: push a 12-byte stack frame and save:
  // - offset 0: pos (startPos)
  // - offset 4: rightmostFailurePos
  // - offset 8: recordedFailures.length
  // Must be called at the start of the rule evaluation function.
  pushDescriptionFrame() {
    this.pushStackFrame(() => {
      this.savePos(); // offset 0
      this.saveGlobalFailurePos(); // offset 4

      // Save recordedFailures.length at offset 8
      this.globalGet('sp');
      this.callPrebuiltFunc('getRecordedFailuresLength');
      this.i32Store(8);
    }, Assembler.DESCRIPTION_FRAME_SIZE_BYTES);
  }

  // For rules with descriptions: handle failure by swallowing internal failures
  // and recording the description at the start position, then pop the frame.
  // Must be called after evaluating the rule body.
  handleDescriptionFailure(descriptionId) {
    this.localGet('ret');
    this.ifFalse(w.blocktype.empty, () => {
      // Restore rightmostFailurePos (swallow internal failures for error position calculation)
      this.restoreGlobalFailurePos();

      // Restore recordedFailures length if the description is at errorMessagePos.
      // This swallows internal failures (including inner descriptions).
      // If the description is NOT at errorMessagePos, keep internal failures
      // (they might be at errorMessagePos and thus relevant for the error message).
      this.globalGet('errorMessagePos');
      this.getSavedPos(); // startPos
      this.i32Eq(); // errorMessagePos == startPos?
      this.if(w.blocktype.empty, () => {
        // Description is at errorMessagePos - swallow internal failures
        // Load saved recordedFailures.length from stack offset 8
        this.globalGet('sp');
        this.i32Load(8);
        this.callPrebuiltFunc('setRecordedFailuresLength');
      });

      // Update rightmostFailurePos to max(old, startPos)
      this.i32Max(
        () => this.globalGet('rightmostFailurePos'),
        () => this.getSavedPos()
      );
      this.globalSet('rightmostFailurePos');

      // Set local failurePos to startPos
      this.getSavedPos();
      this.localSet('failurePos');

      // Record the description at startPos
      this.maybeRecordFailure(() => this.getSavedPos(), descriptionId);
    });
    this.popStackFrame(Assembler.DESCRIPTION_FRAME_SIZE_BYTES);
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

  newIterNodeWithSavedPosAndBindings(arity, isOpt = false) {
    this.getSavedPos();
    this.globalGet('pos');
    this.getSavedNumBindings();
    this.i32Const(arity);
    this.i32Const(isOpt ? 1 : 0);
    this.callPrebuiltFunc('newIterationNode');
  }

  newCaseInsensitiveNode(ruleId) {
    this.getSavedPos();
    this.globalGet('pos');
    this.i32Const(ruleId);

    // Ensure we get exactly one binding.
    this.globalGet('bindings');
    this.i32Load(12); // Array<i32>.length_
    this.i32Const(1);
    this.i32Sub();

    this.i32Const(-1); // By def'n, it cannot have contributed to failurePos.
    this.callPrebuiltFunc('newNonterminalNode');
  }

  // [startIdx: i32] -> [ptr: i32]
  newTerminalNode() {
    this.localGet('postSpacesPos');
    this.globalGet('pos');
    this.callPrebuiltFunc('newTerminalNode');
  }

  i32Max(aThunk, bThunk) {
    aThunk();
    bThunk();
    aThunk();
    bThunk();
    this.emit(instr.i32.gt_s, instr.select);
  }

  // Return the depth of the block with the given label.
  depthOf(label) {
    const i = this._blockStack.findLastIndex(what => what === `block:${label}`);
    assert(i !== -1, `Unknown label: ${label}`);
    return this._blockStack.length - i - 1;
  }

  pushFluffySavePoint() {
    this.callPrebuiltFunc('pushFluffySavePoint');
  }

  popFluffySavePoint(shouldMark) {
    this.i32Const(shouldMark ? 1 : 0);
    this.callPrebuiltFunc('popFluffySavePoint');
  }

  // Pop the fluffy save point, marking failures as fluffy only when
  // pos matches errorMessagePos. This mirrors ohm-js's scoped failure recording.
  popFluffySavePointIfAtErrorPos() {
    this.globalGet('errorMessagePos');
    this.globalGet('pos');
    this.i32Eq();
    this.callPrebuiltFunc('popFluffySavePoint');
  }

  ruleEvalReturn() {
    // Convert the value in `ret` to a single bit in position 0.
    this.localGet('ret');
    this.emit(instr.i32.eqz, instr.i32.eqz);

    // Remaining 32 bits hold the (signed) failurePos.
    this.localGet('failurePos');
    this.i32Const(1);
    this.emit(instr.i32.shl);
    this.emit(instr.i32.or);
  }
}
Assembler.ALIGN_1_BYTE = 0;
Assembler.ALIGN_4_BYTES = 2;
Assembler.CST_NODE_HEADER_SIZE_BYTES = 8;

// A "memo column" holds the info for one input position, i.e. one char.
Assembler.MEMO_COL_SIZE_BYTES = 4 * 256;

Assembler.STACK_FRAME_SIZE_BYTES = 8;
Assembler.DESCRIPTION_FRAME_SIZE_BYTES = 12;

export class Compiler {
  constructor(grammar) {
    assert(grammar && 'superGrammar' in grammar, 'Not a valid grammar: ' + grammar);

    // Detect the so-called "dual package hazard". Since we use the identity
    // of the pexpr constructors when compiling the grammar, it gets confusing
    // if there are multiple copies of Ohm.
    if (!(grammar instanceof ohm.ohmGrammar.constructor)) {
      // If we have the source, recover by instantiating the grammar anew.
      // Fail otherwise.
      assert(
        !!grammar.source,
        'Grammar smells fishy. Do you have multiple instances of ohm-js?'
      );
      grammar = ohm.grammar(grammar.source.contents);
    }

    this.grammar = grammar;

    // For any additional imports outside the prebuilt ones.
    this.importDecls = [...defaultImports];

    // The rule ID is a 0-based index that's mapped to the name.
    // It is *not* the same as the function index of the rule's eval function.
    this.ruleIdByName = new StringTable();
    this._failureDescriptions = new StringTable();

    // Ensure "end of input" is always at index 0, so the runtime can use it
    // for the implicit end check.
    this._endOfInputFailureId = this._failureDescriptions.add('end of input');

    // For non-memoized rules, we defer assigning IDs until all memoized
    // rule names have been assigned.
    this._deferredRuleIds = new Set();
    this._maxMemoizedRuleId = -1;

    // Ensure default start rule has id 0; $term, 1; and spaces, 2.
    this._ensureRuleId(grammar.defaultStartRule);
    this._ensureRuleId('$term');
    this._ensureRuleId('$spaces');

    this.rules = undefined;
    this._nextLiftedId = 0;

    // Keeps track of whether we're in a lexical or syntactic context.
    this._lexContextStack = [];
    this._applySpacesImplicit = ir.apply('$spaces', -1);
  }

  getOrAddFailure(str) {
    return this._failureDescriptions.add(str);
  }

  // Returns a failure description string for the given expression, or null
  // if a description can't be generated. For compound expressions (Alt, Seq,
  // Not, Iter, etc.), this recursively composes descriptions from children —
  // matching the behavior of ohm-js's pexprs-toFailure.js.
  toFailureDescription(exp) {
    switch (exp.type) {
      case 'Any':
        return 'any character';
      case 'Range':
        return `${JSON.stringify(exp.lo)}..${JSON.stringify(exp.hi)}`;
      case 'Terminal':
        return JSON.stringify(exp.value);
      case 'End':
        return 'end of input';
      case 'Apply': {
        if (exp.descriptionId != null && exp.descriptionId >= 0) {
          return this._failureDescriptions.getStr(exp.descriptionId);
        }
        if (exp.ruleName === 'end') return 'end of input';
        if (exp.ruleName === 'any') return 'any character';
        // For lifted rules, expand their body to get a meaningful description.
        if (exp.ruleName.startsWith('$lifted')) {
          const ruleInfo = this.rules.get(exp.ruleName);
          if (ruleInfo) return this.toFailureDescription(ruleInfo.body);
        }
        const article = /^[aeiouAEIOU]/.test(exp.ruleName) ? 'an' : 'a';
        return article + ' ' + exp.ruleName;
      }
      case 'Alt': {
        const strs = exp.children.map(c => this.toFailureDescription(c));
        if (strs.some(s => s == null)) return null;
        return '(' + strs.join(' or ') + ')';
      }
      case 'Seq': {
        const strs = exp.children.map(c => this.toFailureDescription(c));
        if (strs.some(s => s == null)) return null;
        return '(' + strs.join(' ') + ')';
      }
      case 'Not':
        if (exp.child.type === 'Any') return 'nothing';
        return this._prefixNot(this.toFailureDescription(exp.child));
      case 'Lookahead':
      case 'Lex':
        return this.toFailureDescription(exp.child);
      case 'Opt':
      case 'Star':
      case 'Plus': {
        const childStr = this.toFailureDescription(exp.child);
        if (childStr == null) return null;
        const op = exp.type === 'Opt' ? '?' : exp.type === 'Star' ? '*' : '+';
        return '(' + childStr + op + ')';
      }
      case 'UnicodeChar':
        return 'a Unicode [' + exp.categoryOrProp + '] character';
      case 'CaseInsensitive':
        return JSON.stringify(exp.value);
      default:
        return null;
    }
  }

  _prefixNot(str) {
    return str != null ? 'not ' + str : null;
  }

  toFailure(exp) {
    const str = this.toFailureDescription(exp);
    return str != null ? this.getOrAddFailure(str) : -1;
  }

  importCount() {
    return prebuilt.importsec.entryCount + this.importDecls.length;
  }

  ruleId(name) {
    return checkNotNull(this.ruleIdByName.getIndex(name), `Unknown rule: ${name}`);
  }

  // This should be the only place where we assign rule IDs!
  _ensureRuleId(name, {notMemoized} = {}) {
    const idx = this.ruleIdByName.add(name);
    assert(notMemoized || idx < 256, `too many rules: ${idx}`);
    return idx;
  }

  _deferRuleId(name) {
    this._deferredRuleIds.add(name);
  }

  inLexicalContext() {
    return checkNotNull(this._lexContextStack.at(-1));
  }

  liftPExpr(exp, isSyntactic) {
    assert(!(exp instanceof pexprs.Terminal));

    // Note: the same expression might appear in more than one place, and
    // when lifting, we could in theory avoid creating a duplicate function.
    // But, we have to be careful where Params are involved: `"a" | blah`
    // could mean something different depending on context.

    const name = `$lifted${this._nextLiftedId++}`;

    // Replace "free variables" (Params from the outer scope) with Params
    // for the lifted, to-be-defined rule.

    const freeVars = collectParams(exp);

    let body = exp;
    let formals = [];
    const maxIndex = freeVars.reduce((acc, param) => Math.max(acc, param.index), -1);

    if (freeVars.length > 0) {
      // `substituteParams` usually takes an array of _actual params_,
      // [arg0, arg1, ...]. We use it instead to replace Params from the
      // original scope with ones for the new scope. Since the lifted pexpr
      // might only reference a subset of the params, the array can be holey.
      // E.g., in `doc<a, b, c> = a tail<(b|c)>`, when we lift `b|c`.
      const newParams = new Array(maxIndex + 1);
      freeVars.forEach((p, i) => {
        newParams[p.index] = new pexprs.Param(i);
      });
      body = exp.substituteParams(newParams);

      // We make up some names for the parameters; they don't currently matter.
      formals = newParams.filter(isNonNull).map(p => `__${p.index}`);
    }
    const actuals = freeVars.filter(isNonNull);
    const ruleInfo = {body, formals, isSyntactic, source: exp.source};
    return [name, ruleInfo, actuals];
  }

  // Return a funcidx corresponding to the eval function for the given rule.
  ruleEvalFuncIdx(name) {
    const offset = this.importCount() + prebuilt.funcsec.entryCount;
    return w.funcidx(this.ruleId(name) + offset);
  }

  // Return an object implementing all of the debug imports.
  getDebugImports(log) {
    const ans = {};
    for (const decl of this.importDecls.filter(d => d.module === 'debug')) {
      const {name} = decl;
      ans[name] = arg => {
        log(name, arg);
      };
    }
    return ans;
  }

  normalize() {
    assert(!this.rules, 'already normalized');
    this.simplifyApplications();
    this.specializeApplications();
  }

  compile() {
    this.normalize();

    const typeMap = (this.typeMap = new TypeMap(prebuilt.typesec.entryCount));
    const asm = (this.asm = new Assembler(typeMap));
    asm.addBlocktype([w.valtype.i32], []);
    asm.addBlocktype([w.valtype.i32], [w.valtype.i32]);
    asm.addBlocktype([], [w.valtype.i32]); // Rule eval
    // (global $runtime/ohmRuntime/pos (mut i32) (i32.const 0))
    // (global $runtime/ohmRuntime/endPos (mut i32) (i32.const 0))
    // (global $runtime/ohmRuntime/input (mut externref) (ref.null noextern))
    // (global $runtime/ohmRuntime/memoBase (mut i32) (i32.const 0))
    // (global $runtime/ohmRuntime/rightmostFailurePos (mut i32) (i32.const 0))
    // (global $runtime/ohmRuntime/errorMessagePos (mut i32) (i32.const -1))
    // (global $runtime/ohmRuntime/sp (mut i32) (i32.const 0))
    // (global $~lib/shared/runtime/Runtime.Stub i32 (i32.const 0))
    // (global $~lib/shared/runtime/Runtime.Minimal i32 (i32.const 1))
    // (global $~lib/shared/runtime/Runtime.Incremental i32 (i32.const 2))
    // (global $~lib/rt/stub/startOffset (mut i32) (i32.const 0))
    // (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
    // (global $~lib/native/ASC_RUNTIME i32 (i32.const 0))
    // (global $runtime/ohmRuntime/bindings (mut i32) (i32.const 0))
    // (global $runtime/ohmRuntime/recordedFailures (mut i32) (i32.const 0))
    // (global $~lib/memory/__heap_base i32 (i32.const 65900))
    asm.addGlobal('pos', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('endPos', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('input', wasm3.valtype.externref, w.mut.var, () =>
      asm.refNull(wasm3.valtype.externref)
    );
    asm.addGlobal('memoBase', w.valtype.i32, w.mut.var, () =>
      asm.i32Const(2 * WASM_PAGE_SIZE)
    );
    asm.addGlobal('rightmostFailurePos', w.valtype.i32, w.mut.var, () => asm.i32Const(-1));
    asm.addGlobal('errorMessagePos', w.valtype.i32, w.mut.var, () => asm.i32Const(-1));
    asm.addGlobal('sp', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__Runtime.Stub', w.valtype.i32, w.mut.const, () => asm.i32Const(0));
    asm.addGlobal('__Runtime.Minimal', w.valtype.i32, w.mut.const, () => asm.i32Const(1));
    asm.addGlobal('__Runtime.Incremental', w.valtype.i32, w.mut.const, () => asm.i32Const(2));
    asm.addGlobal('__startOffset', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__offset', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__ASC_RUNTIME', w.valtype.i32, w.mut.const, () => asm.i32Const(0));
    asm.addGlobal('bindings', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('recordedFailures', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('fluffySaveStack', w.valtype.i32, w.mut.var, () => asm.i32Const(0));
    asm.addGlobal('__heap_base', w.valtype.i32, w.mut.var, () => asm.i32Const(65948));

    // Reserve a fixed number of imports for debug labels.
    if (DEBUG) {
      for (let i = 0; i < 10000; i++) {
        this.importDecls.push({
          module: 'debug',
          name: `debug${i}`,
          paramTypes: [],
          resultTypes: [],
        });
      }
    }
    const functionDecls = this.functionDecls();
    this.rewriteDebugLabels(functionDecls);
    return this.buildModule(typeMap, functionDecls);
  }

  simplifyApplications() {
    const {grammar} = this;

    const lookUpRule = name => ({
      ...checkNotNull(grammar.rules[name]),
      isSyntactic: isSyntacticRule(name),
    });

    // Begin with all the rules directly defined in the grammar.
    const ownRuleNames = Object.keys(grammar.rules).filter(name =>
      Object.hasOwn(grammar.rules, name)
    );
    const rules = ownRuleNames.map(name => [name, lookUpRule(name)]);

    // Ensure the certain rules are always included. (The default start rule
    // might be inherited from the supergrammar, so not there yet.)
    for (const name of ['spaces', grammar.defaultStartRule]) {
      rules.push([name, lookUpRule(name)]);
    }

    const liftedTerminals = new StringTable();

    const liftTerminal = ({obj}) => {
      const id = liftedTerminals.add(obj);
      assert(id >= 0 && id < 0xffff, 'too many terminals!');
      const failureId = this.getOrAddFailure(JSON.stringify(obj));
      return ir.liftedTerminal(id, failureId);
    };

    // If `exp` is not an Apply or Param, lift it into its own rule and return
    // a new application of that rule.
    const simplifyArg = (exp, isSyntactic) => {
      if (isApplyLike(exp)) {
        return simplify(exp, isSyntactic);
      }
      if (exp instanceof pexprs.Terminal) {
        return liftTerminal(exp);
      }

      const [name, info, env] = this.liftPExpr(exp, isSyntactic);
      const args = env.map(p => {
        assert(p instanceof pexprs.Param, 'Expected Param');
        return ir.param(p.index);
      });
      rules.push([name, info]);

      // We don't care about the failure description here, because the original expression
      // will still be applied inside the body of the new rule.
      return ir.apply(name, -1, args);
    };
    const simplify = (exp, isSyntactic) => {
      if (exp instanceof pexprs.Alt) {
        return ir.alt(exp.terms.map(e => simplify(e, isSyntactic)));
      }
      if (exp === pexprs.any) return ir.any();
      if (exp === pexprs.end) return ir.end();
      switch (exp.constructor) {
        case pexprs.Apply: {
          const ruleInfo = lookUpRule(exp.ruleName);

          // Replace an application of the built-in caseInsensitive rule with
          // an inlined case-insensitive terminal.
          if (ruleInfo.body instanceof pexprs.CaseInsensitiveTerminal) {
            assert(exp.args.length === 1 && exp.args[0] instanceof pexprs.Terminal);
            return ir.caseInsensitive(exp.args[0].obj);
          }
          rules.push([exp.ruleName, ruleInfo]);
          const descId = ruleInfo.description
            ? this._failureDescriptions.add(ruleInfo.description)
            : -1;
          return ir.apply(
            exp.ruleName,
            descId,
            exp.args.map(arg => simplifyArg(arg, isSyntactic))
          );
        }
        case pexprs.Lex:
          return ir.lex(simplify(exp.expr, true));
        case pexprs.Lookahead:
          return ir.lookahead(simplify(exp.expr, isSyntactic));
        case pexprs.Not:
          return ir.not(simplify(exp.expr, isSyntactic));
        case pexprs.Opt:
          return ir.opt(simplify(exp.expr, isSyntactic));
        case pexprs.Plus:
          return ir.plus(simplify(exp.expr, isSyntactic));
        case pexprs.Seq:
          return ir.seq(exp.factors.map(e => simplify(e, isSyntactic)));
        case pexprs.Star:
          return ir.star(simplify(exp.expr, isSyntactic));
        case pexprs.Param:
          return ir.param(exp.index);
        case pexprs.Range:
          return ir.range(exp.from, exp.to);
        case pexprs.Terminal:
          return ir.terminal(exp.obj);
        case pexprs.UnicodeChar:
          // Support older versions of ohm-js (<= 17.2.1).
          // TODO: Remove this eventually.
          return ir.unicodeChar(exp.categoryOrProp ?? exp['category']);
        default:
          throw new Error(`not handled: ${exp.constructor.name}`);
      }
    };
    const newRules = new Map();

    // Go over all the rules and simplify them.
    // Note that `rules` can grow during this process; when we hit the end
    // of the array, there's no more work to be done.
    for (let i = 0; i < rules.length; i++) {
      const [name, info] = rules[i];
      if (!newRules.has(name)) {
        newRules.set(name, {
          ...info,
          body: simplify(info.body, info.isSyntactic),
        });
      }
    }
    this.rules = newRules;
    this.liftedTerminals = liftedTerminals;
  }

  compileTerminalRule(name) {
    const {asm} = this;
    this.beginLexContext(true);
    asm.addFunction(`$${name}`, [w.valtype.i32], [w.valtype.i32], () => {
      asm.addLocal('ret', w.valtype.i32);
      asm.addLocal('tmp', w.valtype.i32);
      asm.addLocal('postSpacesPos', w.valtype.i32);
      asm.addLocal('failurePos', w.valtype.i32);
      asm.i32Const(-1);
      asm.localSet('failurePos');
      const keys = this.liftedTerminals.keys();
      asm.switch(
        w.blocktype.empty,
        () => asm.localGet('__arg0'),
        keys.length,
        i => this.emitTerminal(ir.terminal(keys[i])),
        () => asm.emit(instr.unreachable)
      );
      // Note: unlike a regular rule evaluation, this function just returns
      // the raw result of PExpr evaluation.
      asm.localGet('ret');
    });
    this.endLexContext();
    return this.asm._functionDecls.at(-1);
  }

  beginLexContext(initialVal) {
    assert(this._lexContextStack.length === 0);
    this._lexContextStack.push(initialVal);
  }

  endLexContext() {
    this._lexContextStack.pop();
    assert(this._lexContextStack.length === 0);
  }

  compileRule(name) {
    const {asm} = this;
    const ruleInfo = getNotNull(this.rules, name);
    let paramTypes = [];
    if (ruleInfo.patterns) {
      paramTypes = [w.valtype.i32];
    }
    // const preHook = () => {
    // if (['alnum'].includes(name)) {
    //   this.emitSingleCharFastPath('alnum');
    // }
    // };

    const restoreFailurePos = name === this._applySpacesImplicit.ruleName;

    const descriptionId = ruleInfo.description
      ? this._failureDescriptions.add(ruleInfo.description)
      : -1;
    const hasDescription = descriptionId >= 0;

    this.beginLexContext(!ruleInfo.isSyntactic);
    asm.addFunction(`$${name}`, paramTypes, [w.valtype.i32], () => {
      asm.addLocal('ret', w.valtype.i32);
      asm.addLocal('tmp', w.valtype.i32);
      asm.addLocal('postSpacesPos', w.valtype.i32);

      asm.addLocal('failurePos', w.valtype.i32);
      asm.globalGet('rightmostFailurePos');
      asm.localSet('failurePos');

      // Save the failure count so we can scope fluffy marking to failures
      // recorded during this rule's evaluation only.
      asm.pushFluffySavePoint();

      if (hasDescription) {
        asm.pushDescriptionFrame();
      }

      // TODO: Find a simpler way to do this.
      if (restoreFailurePos) {
        asm.addLocal('origFailurePos', w.valtype.i32);
        asm.globalGet('rightmostFailurePos');
        asm.localSet('origFailurePos');
      }

      asm.emit(`BEGIN eval:${name}`);
      this.emitPExpr(ruleInfo.body);

      // When a rule body succeeds and pos matches errorMessagePos, mark
      // failures recorded DURING this rule eval as fluffy. This mirrors
      // ohm-js's MatchState.eval_, which uses scoped failure recording.
      asm.localGet('ret');
      asm.if(
        w.blocktype.empty,
        () => {
          asm.popFluffySavePointIfAtErrorPos();
        },
        () => {
          asm.popFluffySavePoint(false);
        }
      );

      // Handle rules with descriptions - must come BEFORE restoreFailurePos
      if (hasDescription) asm.handleDescriptionFailure(descriptionId);

      if (restoreFailurePos) {
        asm.localGet('origFailurePos');
        asm.dup();
        asm.globalSet('rightmostFailurePos');
        asm.localSet('failurePos');
      }
      asm.ruleEvalReturn();
      asm.emit(`END eval:${name}`);
    });
    this.endLexContext();
    return this.asm._functionDecls.at(-1);
  }

  // Beginning with the default start rule, recursively visit all reachable
  // parsing expressions. For all parameterized rules, create a specialized
  // version of that rule for every possible set of actual parameters.
  // At the end, there are no more applications with arguments.
  specializeApplications() {
    const newRules = new Map();
    const {rules} = this;
    const patternsByRule = new Map();
    let hasCaseInsensitiveTerminals = false;

    const specialize = exp =>
      ir.rewrite(exp, {
        Apply: app => {
          const {ruleName, children} = app;
          const ruleInfo = getNotNull(rules, ruleName);

          const specializedName = ir.specializedName(app);

          if (
            ['liquidRawTagImpl', 'liquidTagRule', 'anyExceptStar', 'anyExceptPlus'].includes(
              ruleName
            )
          ) {
            this._deferRuleId(specializedName);
          } else {
            this._ensureRuleId(specializedName);
          }

          // If not yet seen, recursively visit the body of the specialized
          // rule. Note that this also applies to non-parameterized rules!
          if (!newRules.has(specializedName)) {
            newRules.set(specializedName, {}); // Prevent infinite recursion.

            // Visit the body with the parameter substituted, to ensure we
            // discover all possible applications that can occur at runtime.
            let body = specialize(ir.substituteParams(ruleInfo.body, children));

            // If there are any args, replace the body with an application of
            // the generalized rule.
            if (children.length > 0) {
              // This is the first time we've seen this pattern; record it.
              const rulePatterns = setdefault(patternsByRule, ruleName, () => new Map());
              rulePatterns.set(specializedName, children);

              if (EMIT_GENERALIZED_RULES) {
                // Note that we deliberately *don't* visit this application yet,
                // so it won't be assigned a rule ID.
                const caseIdx = rulePatterns.size - 1;
                body = ir.applyGeneralized(ruleName, caseIdx);
              }
            }
            newRules.set(specializedName, {...ruleInfo, body, formals: []});
          }
          // Replace with an application of the specialized rule.
          return ir.apply(specializedName, app.descriptionId);
        },
        CaseInsensitive: exp => {
          hasCaseInsensitiveTerminals = true;
          return exp;
        },
      });
    specialize(ir.apply(this.grammar.defaultStartRule, -1));

    this._maxMemoizedRuleId = this.ruleIdByName.size;
    this._deferredRuleIds.forEach(name => this._ensureRuleId(name, {notMemoized: true}));

    // Make a special rule for implicit space skipping, with the same body
    // as the real `spaces` rule.
    const spacesInfo = getNotNull(rules, 'spaces');
    newRules.set('$spaces', {
      ...spacesInfo,
      body: specialize(spacesInfo.body),
    });

    // We inline applications of caseInsensitive, but they still produce a
    // nonterminal node as if they weren't inlined. Because of that, we need
    // to assign a rule ID and ensure that the rule eval function exists.
    if (hasCaseInsensitiveTerminals) {
      assert(!newRules.has('caseInsensitive'));
      this._ensureRuleId('caseInsensitive', {notMemoized: true});
      newRules.set('caseInsensitive', {
        name: 'caseInsensitive',
        body: ir.seq([ir.not(ir.end()), ir.end()]), // ~end end
        formals: [],
        description: '',
      });
    }

    this.rules = newRules;

    if (EMIT_GENERALIZED_RULES) {
      const insertDispatches = (exp, patterns) =>
        ir.rewrite(exp, {
          Apply: app => (app.children.length === 0 ? app : ir.dispatch(app, patterns)),
          Param: p => ir.dispatch(p, patterns),
        });

      // Save the observed patterns of the parameterized rules.
      // All non-parameterized & specialized rules have been discovered and
      // assigned IDs; any rule IDs assigned here won't be memoized.
      for (const [name, patterns] of patternsByRule.entries()) {
        this._ensureRuleId(name, {notMemoized: true});
        const ruleInfo = getNotNull(rules, name);
        const patternsArr = [...patterns.values()];
        newRules.set(name, {
          ...ruleInfo,
          body: insertDispatches(ruleInfo.body, patternsArr),
          patterns: patternsArr,
        });
      }
    }
  }

  buildRuleNamesSection(ruleNames) {
    // A custom section that allows the clients to look up rule IDs by name.
    // They're simply encoded as a vec(name), and the client can turn this
    // into a list/array and use the ruleId as the index.
    return w.custom(w.name('ruleNames'), w.vec(ruleNames.map((n, i) => w.name(n))));
  }

  buildStringTable(sectionName, tableOrArr) {
    const keys = Array.isArray(tableOrArr) ? tableOrArr : tableOrArr.keys();
    return w.custom(w.name(sectionName), w.vec(keys.map(n => w.name(n))));
  }

  buildModule(typeMap, functionDecls) {
    const ruleNames = this.ruleIdByName.keys();
    assert(this.importCount() === prebuilt.destImportCount, 'import count mismatch');

    // Ensure that `ruleNames` is in the correct order.
    ruleNames.forEach((n, i) =>
      assert(i === this.ruleIdByName.getIndex(n), `out of order: ${n}`)
    );

    typeMap.addDecls(this.importDecls);
    typeMap.addDecls(functionDecls);

    const globals = [];
    const imports = this.importDecls.map((f, i) =>
      w.import_(f.module, f.name, w.importdesc.func(typeMap.getIdxForDecl(f)))
    );
    const funcs = functionDecls.map((f, i) => w.typeidx(typeMap.getIdxForDecl(f)));
    const codes = functionDecls.map(f => w.code(w.func(f.locals, f.body)));

    const exportOffset = this.importCount() + prebuilt.funcsec.entryCount;
    const exports = functionDecls.map((f, i) =>
      w.export_(f.name, w.exportdesc.func(i + exportOffset))
    );
    exports.push(w.export_('memory', w.exportdesc.mem(0)));

    // Re-export some prebuilt functions.
    [
      'bindingsAt',
      'getBindingsLength',
      'getRecordedFailuresLength',
      'isFluffy',
      'match',
      'recordedFailuresAt',
      'recordFailures',
      'resetHeap',
    ].forEach(name => {
      exports.push(w.export_(name, w.exportdesc.func(prebuiltFuncidx(name))));
    });

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
      w.tabletype(w.elemtype.funcref, w.limits.minmax(numRules, numRules))
    );
    const tableData = ruleNames.map(name => this.ruleEvalFuncIdx(name));
    assert(numRules === tableData.length, 'Invalid rule count');

    // Determine the index of the start function.
    const indexOfStart = functionDecls.findIndex(f => f.name === 'start');
    assert(indexOfStart !== -1, 'No start function found');
    const startFuncidx = this.importCount() + prebuilt.funcsec.entryCount + indexOfStart;

    // Note: globals are *not* merged; they are assumed to be shared.
    const mod = w.module([
      mergeSections(w.SECTION_ID_TYPE, prebuilt.typesec, typeMap.getTypes()),
      mergeSections(w.SECTION_ID_IMPORT, prebuilt.importsec, imports),
      mergeSections(w.SECTION_ID_FUNCTION, prebuilt.funcsec, funcs),
      w.tablesec([table]),
      w.memsec([w.mem(w.memtype(w.limits.min(1)))]),
      w.globalsec(globals),
      w.exportsec(exports),
      w.startsec(w.start(startFuncidx)),
      w.elemsec([w.elem(w.tableidx(0), [instr.i32.const, w.i32(0), instr.end], tableData)]),
      mergeSections(w.SECTION_ID_CODE, prebuilt.codesec, codes),
      w.customsec(this.buildStringTable('ruleNames', ruleNames)),
      w.customsec(this.buildStringTable('failureDescriptions', this._failureDescriptions)),
      w.namesec(w.namedata(w.modulenamesubsec(this.grammar.name))),
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
  rewriteDebugLabels(decls) {
    // Careful: this.importDecls *doesn't* include the prebuilt imports (we know how many there
    // are, but it's otherwise treated as an opaque blog). But it *does* include `defaultImports`,
    // so we account for those in nextIdx, and for the prebuilt imports in `intoFuncidx`.
    let nextIdx = defaultImports.length;
    const intoFuncidx = i => w.funcidx(prebuilt.importsec.entryCount + i);
    const names = new Set();
    for (let i = 0; i < decls.length; i++) {
      const entry = decls[i];
      entry.body = entry.body.flatMap(x => {
        if (typeof x !== 'string') return x;

        // If debugging is disabled, just drop the string altogether.
        if (!DEBUG) return [];

        // Claim one of the reserved debug functions…
        const idx = nextIdx++;
        const decl = checkNotNull(this.importDecls[idx], 'Too few debug functions!');
        assert(decl.module === 'debug');
        decl.name = uniqueName(names, x);

        let pushArg = [];
        if (x.startsWith('END')) {
          decl.paramTypes = [w.valtype.i32];
          // We want to pass 'ret', but to figure out its index, we need to
          // account for the number of parameters.
          const retIdx = entry.paramTypes.length;
          pushArg = [instr.local.get, w.localidx(retIdx)];
        }

        // …and replace the string with a call to that function.
        return [...pushArg, instr.call, intoFuncidx(idx)].flat(Infinity);
      });
    }
  }

  functionDecls() {
    const ruleDecls = [];
    for (const name of this.ruleIdByName.keys()) {
      if (name === '$term') {
        ruleDecls.push(this.compileTerminalRule(name));
      } else {
        assert(!name.startsWith('$term'));
        ruleDecls.push(this.compileRule(name));
      }
    }
    const {asm} = this;
    asm.addFunction('start', [], [], () => {
      asm.emit(instr.call, w.funcidx(prebuilt.startFuncidx));
    });
    ruleDecls.push(asm._functionDecls.at(-1));
    return ruleDecls;
  }

  // Handle an application-like expression (i.e. an actual Apply, or a Param)
  // in the *body* of the generalized version of a parameterized rule.
  // Generalized rules can behave like a specific specialized version of the
  // rule; they take an i32 `caseIdx` argument that selects the behaviour.
  // Then, for any Param -- or Apply that involves a Param -- we dynamically
  // dispatch to the correct specialized version of the rule.
  emitDispatch({child: exp, patterns}) {
    const {asm} = this;

    const handleCase = i => {
      // Substitute the params to get the concrete expression that
      // needs to be inserted here.
      let newExp = ir.substituteParams(exp, patterns[i]);
      if (newExp.type === 'Apply') {
        // If the application has arguments, we need to dispatch to the
        // correct specialized version of the rule.
        newExp = ir.apply(ir.specializedName(newExp), -1);
      }
      this.emitPExpr(newExp);
    };

    if (patterns.length === 1) {
      handleCase(0); // No need for a switch.
      return;
    }
    assert(patterns.length > 1);
    asm.switch(
      w.blocktype.empty,
      () => asm.localGet('__arg0'),
      patterns.length,
      handleCase,
      () => {
        asm.emit(instr.unreachable);
      }
    );
  }

  // Contract: emitPExpr always means we're going deeper in the PExpr tree.
  emitPExpr(exp, {preHook, postHook} = {}) {
    const {asm} = this;

    const allowFastApply = !preHook && !postHook;

    // Note that after specializeApplications, there are two classes of rule:
    // - specialized rules, which contain no Params, and only have
    //   applications without args
    // - generalized rules, which may contain Params and apps w/ args.
    assert(!(exp.type === 'Apply' && exp.children.length > 0));

    if (exp.type === 'Apply' && allowFastApply) {
      asm.emit(`BEGIN apply:${exp.ruleName}`);
      this.emitApply(exp);
      asm.emit(`END apply:${exp.ruleName}`);
      return;
    }
    if (exp.type === 'ApplyGeneralized') {
      assert(EMIT_GENERALIZED_RULES && allowFastApply);
      asm.emit(`BEGIN applyGeneralized:${exp.ruleName}`);
      this.emitApplyGeneralized(exp);
      asm.emit(`END applyGeneralized:${exp.ruleName}`);
      return;
    }

    const debugLabel = ir.toString(exp);
    asm.emit(`BEGIN ${debugLabel}`);
    asm.pushStackFrame();

    // Wrap the body in a block, which is useful for two reasons:
    // - it allows early returns.
    // - it makes sure that the generated code doesn't have stack effects.
    asm.block(
      w.blocktype.empty,
      () => {
        if (preHook) preHook();

        switch (exp.type) {
          case 'Alt':
            this.emitAlt(exp);
            break;
          case 'Any':
            this.emitAny(exp);
            break;
          case 'CaseInsensitive':
            this.emitCaseInsensitive(exp);
            break;
          case 'Dispatch':
            this.emitDispatch(exp);
            break;
          case 'End':
            this.emitEnd(exp);
            break;
          case 'Lex':
            this.emitLex(exp);
            break;
          case 'LiftedTerminal':
            this.emitApplyTerm(exp);
            break;
          case 'Lookahead':
            this.emitLookahead(exp);
            break;
          case 'Not':
            this.emitNot(exp);
            break;
          case 'Seq':
            this.emitSeq(exp);
            break;
          case 'Star':
            this.emitStar(exp);
            break;
          case 'Opt':
            this.emitOpt(exp);
            break;
          case 'Range':
            this.emitRange(exp);
            break;
          case 'Plus':
            this.emitPlus(exp);
            break;
          case 'Terminal':
            this.emitTerminal(exp);
            break;
          case 'UnicodeChar':
            this.emitUnicodeChar(exp);
            break;
          case 'Param':
          // Fall through (Params should not exist at codegen time).
          default:
            throw new Error(`not handled: ${exp.type}`);
        }
      },
      'pexprEnd'
    );
    if (postHook) postHook();
    asm.popStackFrame();
    asm.emit(`END ${debugLabel}`);
  }

  emitAlt(exp) {
    const {asm} = this;
    asm.block(w.blocktype.empty, () => {
      for (const term of exp.children) {
        this.emitPExpr(term);
        asm.localGet('ret');
        asm.condBreak(asm.depthOf('pexprEnd'));
        asm.restorePos();
        asm.restoreBindingsLength();
      }
    });
  }

  emitAny(exp) {
    const {asm} = this;
    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      // Get current char code and save it for later surrogate check
      asm.currCharCode();
      asm.localTee('tmp');
      asm.incPos();

      // Check if at end of input
      asm.i32Const(CHAR_CODE_END);
      asm.i32Eq();
      asm.condBreak(asm.depthOf('failure'));

      // Check if char code is a high surrogate (0xD800-0xDBFF).
      // If so, skip the low surrogate by incrementing position again.
      asm.localGet('tmp');
      asm.i32Const(0xd800);
      asm.emit(instr.i32.ge_u);
      asm.localGet('tmp');
      asm.i32Const(0xdbff);
      asm.emit(instr.i32.le_u);
      asm.emit(instr.i32.and);
      asm.if(w.blocktype.empty, () => {
        asm.incPos();
      });
    }, failureId);
  }

  emitApplyTerm({terminalId}) {
    const {asm} = this;

    this.maybeEmitSpaceSkipping();

    // Save the original position.
    asm.globalGet('pos');
    asm.localSet('tmp');

    // Call the terminal rule, and use its result as ours.
    asm.i32Const(terminalId);
    asm.emit(instr.call, this.ruleEvalFuncIdx('$term'));
    asm.localTee('ret');

    // Update the failure position if necessary.
    asm.ifFalse(w.blocktype.empty, () => {
      asm.updateLocalFailurePos(() => asm.localGet('tmp'));
    });
  }

  // Emit an application of the generalized version of a parameterized rule.
  // Need to know which case we're applying!
  emitApplyGeneralized(exp) {
    const {asm} = this;
    asm.i32Const(this.ruleId(exp.ruleName));
    asm.i32Const(exp.caseIdx);
    asm.callPrebuiltFunc('evalApplyGeneralized');
    asm.localSet('ret');
  }

  emitApply(exp) {
    assert(exp.children.length === 0);

    // Avoid infinite recursion.
    if (exp !== this._applySpacesImplicit) {
      this.maybeEmitSpaceSkipping();
    }

    const {asm} = this;
    const ruleId = this.ruleId(exp.ruleName);
    asm.i32Const(ruleId);

    // TODO: Should lifted expressions be memoized?
    // TODO: Handle this at grammar parse time, not here.
    if (exp.ruleName.includes('_') || ruleId >= this._maxMemoizedRuleId) {
      asm.callPrebuiltFunc('evalApplyNoMemo0');
    } else {
      asm.callPrebuiltFunc('evalApply0');
    }
    // The application may have updated rightmostFailurePos; if so, we may
    // need to update the local failure position.
    asm.updateLocalFailurePos(() => asm.globalGet('rightmostFailurePos'));
    asm.localSet('ret');
  }

  emitEnd(exp) {
    const {asm} = this;
    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      asm.i32Const(CHAR_CODE_END);
      // Careful! We shouldn't move the pos here. Or does it matter?
      asm.currCharCode();
      asm.i32Ne();
      asm.condBreak(asm.depthOf('failure'));
    }, failureId);
  }

  emitFail() {
    const {asm} = this;
    asm.i32Const(0);
    asm.localSet('ret');
  }

  emitLex({child}) {
    this._lexContextStack.push(true);
    this.emitPExpr(child);
    this._lexContextStack.pop();
  }

  emitLookahead({child}) {
    const {asm} = this;

    // TODO: Should positive lookahead record a CST?
    asm.pushFluffySavePoint();
    this.emitPExpr(child);
    asm.restoreBindingsLength();
    asm.restorePos();

    // When lookahead succeeds, mark inner failures as fluffy (scoped).
    asm.localGet('ret');
    asm.if(
      w.blocktype.empty,
      () => {
        asm.popFluffySavePointIfAtErrorPos();
      },
      () => {
        asm.popFluffySavePoint(false);
      }
    );
  }

  emitNot(exp) {
    const {child} = exp;
    const {asm} = this;
    const failureId = this.toFailure(exp);
    const NOT_FRAME_SIZE = 12;

    // Save failurePos, globalFailurePos, AND recordedFailures.length
    // directly onto the stack frame. We use setRecordedFailuresLength
    // to directly truncate after the child evaluation. This matches
    // JS's pushFailuresInfo/popFailuresInfo for Not expressions.
    asm.pushStackFrame(() => {
      asm.saveFailurePos(); // offset 0
      asm.saveGlobalFailurePos(); // offset 4
      // Save recordedFailures.length at offset 8
      asm.globalGet('sp');
      asm.callPrebuiltFunc('getRecordedFailuresLength');
      asm.i32Store(8);
    }, NOT_FRAME_SIZE);
    this.emitPExpr(child);

    // Invert the result.
    asm.localGet('ret');
    asm.emit(instr.i32.eqz);
    asm.localSet('ret');

    // Restore all global and local state.
    asm.restoreGlobalFailurePos();
    asm.restoreFailurePos();

    // Discard all child failures by restoring recordedFailures.length
    // from the stack frame (offset 8). Only during the recording pass.
    asm.globalGet('errorMessagePos');
    asm.i32Const(0);
    asm.emit(instr.i32.ge_s);
    asm.if(w.blocktype.empty, () => {
      asm.globalGet('sp');
      asm.i32Load(8);
      asm.callPrebuiltFunc('setRecordedFailuresLength');
    });

    asm.popStackFrame(NOT_FRAME_SIZE);
    asm.restoreBindingsLength();
    asm.restorePos();

    asm.localGet('ret');
    asm.ifFalse(w.blocktype.empty, () => {
      // When not fails (child succeeded), update failurePos to origPos.
      // This is equivalent to Ohm.js's processFailure(origPos, this).
      // Note: pos has already been restored by restorePos() above.
      asm.updateLocalFailurePos(() => asm.globalGet('pos'));
      asm.updateGlobalFailurePos();

      if (failureId >= 0) {
        asm.maybeRecordFailure(() => asm.globalGet('pos'), failureId);
      }
    });
  }

  emitOpt({child}) {
    const {asm} = this;
    asm.pushFluffySavePoint();
    this.emitPExpr(child);
    asm.localGet('ret');
    asm.ifFalse(w.blocktype.empty, () => {
      asm.restorePos();
      asm.restoreBindingsLength();
    });
    asm.newIterNodeWithSavedPosAndBindings(ir.outArity(child), true);
    // Opt always succeeds, so mark inner failures as fluffy (scoped).
    asm.popFluffySavePointIfAtErrorPos();
    asm.localSet('ret');
  }

  emitPlus(plusExp) {
    const {asm} = this;
    this.emitPExpr(plusExp.child);
    asm.localGet('ret');
    asm.if(w.blocktype.empty, () => {
      this.emitStar(plusExp);
    });
  }

  emitRange(exp) {
    assert(exp.lo.length === 1 && exp.hi.length === 1);
    const lo = exp.lo.charCodeAt(0);
    const hi = exp.hi.charCodeAt(0);

    // TODO: Do we disallow 0xff in the range?
    const {asm} = this;
    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      // Use currCharCode (not nextCharCode) so failure position is correct.
      asm.currCharCode();

      // if (c > hi) return 0;
      asm.dup();
      asm.i32Const(hi);
      asm.emit(instr.i32.gt_u);
      asm.condBreak(asm.depthOf('failure'));

      // if (c >= lo) return 0;
      asm.i32Const(lo);
      asm.emit(instr.i32.lt_u);
      asm.condBreak(asm.depthOf('failure'));

      // Success - increment position.
      asm.incPos();
    }, failureId);
  }

  emitSeq({children}) {
    const {asm} = this;

    // An empty sequence always succeeds.
    if (children.length === 0) {
      asm.setRet(1);
      return;
    }

    for (const c of children) {
      this.emitPExpr(c);
      asm.localGet('ret');
      asm.emit(instr.i32.eqz);
      asm.condBreak(asm.depthOf('pexprEnd'));
    }
  }

  maybeEmitSpaceSkipping() {
    if (IMPLICIT_SPACE_SKIPPING && !this.inLexicalContext()) {
      this.asm.emit('BEGIN space skipping');
      this.emitApply(this._applySpacesImplicit);
      this.asm.emit('END space skipping');
    }
  }

  emitStar({child}, {reuseStackFrame} = {}) {
    const {asm} = this;

    asm.pushFluffySavePoint();
    // We push another stack frame because we need to save and restore
    // the position just before the last (failed) expression.
    asm.pushStackFrame();
    asm.block(
      w.blocktype.empty,
      () => {
        asm.loop(w.blocktype.empty, () => {
          asm.savePos();
          asm.saveNumBindings();
          this.emitPExpr(child);
          asm.localGet('ret');
          asm.emit(instr.i32.eqz);
          asm.condBreak(asm.depthOf('done'));
          asm.continue(0);
        });
      },
      'done'
    );
    asm.restorePos();
    asm.restoreBindingsLength();
    asm.popStackFrame();
    asm.newIterNodeWithSavedPosAndBindings(ir.outArity(child));
    // Star always succeeds, so mark inner failures as fluffy (scoped).
    asm.popFluffySavePointIfAtErrorPos();
    asm.localSet('ret');
  }

  wrapTerminalLike(thunk, failureId) {
    const {asm} = this;
    this.maybeEmitSpaceSkipping();

    // With space skipping, the startIdx of the terminal node is not
    // necessarily the same as the saved pos. So we save the new pos before
    // actually matching.
    asm.globalGet('pos');
    asm.localSet('postSpacesPos');

    asm.block(
      w.blocktype.empty,
      () => {
        asm.block(
          w.blocktype.empty,
          () => {
            thunk();
            asm.newTerminalNode();
            asm.localSet('ret');
            asm.break(asm.depthOf('_done'));
          },
          'failure'
        );
        // Use the terminal's start position (postSpacesPos) for failure tracking,
        // not the actual failing position (pos). This matches Ohm.js behavior.
        asm.updateLocalFailurePos(() => asm.localGet('postSpacesPos'));
        asm.maybeRecordFailure(() => asm.localGet('postSpacesPos'), failureId);
        asm.setRet(0);
      },
      '_done'
    );
  }

  emitCaseInsensitive(exp) {
    const {asm} = this;
    const {value} = exp;
    assert(
      [...value].every(c => c <= '\x7f'),
      'not supported: case-insensitive Unicode'
    );

    const str = value.toLowerCase();
    const failureId = this.toFailure(exp);
    asm.emit(JSON.stringify(`caseInsensitive:${value}`));
    this.wrapTerminalLike(() => {
      // TODO:
      // - proper UTF-8!
      // - handle longer terminals with a loop
      // - SIMD
      for (const c of [...str]) {
        asm.i32Const(c.charCodeAt(0));
        asm.currCharCode();
        if (('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z')) {
          // Cute trick: the diff between upper and lower case is bit 5.
          asm.i32Const(0x20);
          asm.emit(instr.i32.or);
        }
        asm.emit(instr.i32.ne);
        asm.condBreak(asm.depthOf('failure'));
        asm.incPos();
      }
    }, failureId);

    // Case-insensitive terminals are inlined, but should appear in the CST
    // as if they are actual applications.
    asm.localGet('ret');
    asm.if(w.blocktype.empty, () => {
      asm.newCaseInsensitiveNode(this.ruleId('caseInsensitive'));
      asm.localSet('ret');
    });
  }

  emitTerminal(exp) {
    const {asm} = this;
    asm.emit(JSON.stringify(exp.value));

    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      // TODO:
      // - handle longer terminals with a loop?
      // - SIMD
      for (const c of exp.value) {
        asm.i32Const(c.charCodeAt(0));
        asm.currCharCode();
        asm.emit(instr.i32.ne);
        asm.condBreak(asm.depthOf('failure'));
        asm.incPos();
      }
    }, failureId);
  }

  emitUnicodeChar(exp) {
    const {asm} = this;

    // TODO: Add support for more categories, by calling out to the host.
    assert(['Ll', 'Lu', 'Ltmo'].includes(exp.categoryOrProp));

    const makeLabels = () =>
      asciiChars.map(c => {
        const isLowercase = 'a' <= c && c <= 'z';
        const isUppercase = 'A' <= c && c <= 'Z';
        if (
          (exp.categoryOrProp === 'Lu' && isUppercase) ||
          (exp.categoryOrProp === 'Ll' && isLowercase)
        ) {
          return w.labelidx(asm.depthOf('fastSuccess'));
        }
        return w.labelidx(asm.depthOf('failure'));
      });

    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      asm.block(
        w.blocktype.empty,
        () => {
          asm.block(
            w.blocktype.empty,
            () => {
              // Fast path: a jump table for ASCII characters.
              asm.block(
                w.blocktype.empty,
                () => {
                  asm.currCharCode();
                  asm.brTable(makeLabels(), w.labelidx(asm.depthOf('default')));
                },
                'default'
              );
              // Fall through: not an ASCII character.

              // Push the arg: a bitmap indicating the categories.
              switch (exp.categoryOrProp) {
                case 'Lu':
                  asm.i32Const(1 << 1);
                  break;
                case 'Ll':
                  asm.i32Const(1 << 2);
                  break;
                case 'Ltmo':
                  asm.i32Const((1 << 3) | (1 << 4) | (1 << 5));
                  break;
                default:
                  assert(false, 'not handled');
              }
              asm.callPrebuiltFunc('doMatchUnicodeChar');
              asm.ifElse(
                w.blocktype.empty,
                () => asm.break(asm.depthOf('slowSuccess')),
                () => asm.break(asm.depthOf('failure'))
              );
            },
            'fastSuccess'
          );
          asm.incPos();
        },
        'slowSuccess'
      );
    }, failureId);
  }
}

// Memory layout:
// - First page is for the PExpr stack (origPos, etc.), growing downwards.
// - 2nd page is for input buffer (max 64k for now).
// - Pages 3-18 (incl.) for memo table (4 entries per char, 4 bytes each).
// - Remainder (>18) is for CST (growing upwards).
Compiler.STACK_START_OFFSET = WASM_PAGE_SIZE; // Starting offset of the stack.

export const ConstantsForTesting = {
  CST_NODE_SIZE_BYTES: checkNotNull(Assembler.CST_NODE_HEADER_SIZE_BYTES),
  MEMO_COL_SIZE_BYTES: checkNotNull(Assembler.MEMO_COL_SIZE_BYTES),
};
