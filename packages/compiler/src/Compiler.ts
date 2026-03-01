import * as w from '@wasmgroundup/emit';
import * as pexprs from 'ohm-js-legacy/src/pexprs-build.js';
import {Grammar as ParsedGrammar} from 'ohm-js-legacy/src/Grammar.js';
// import wabt from 'wabt';

import * as ir from './ir.ts';
import type {Expr} from './ir.ts';
import * as prebuilt from '../build/ohmRuntime.wasm_sections.ts';
import {assert, checkNotNull} from './assert.ts';
import {grammar as parseGrammar} from './parseGrammars.ts';

// eslint-disable-next-line no-undef
const DEBUG = typeof process !== 'undefined' && process.env.OHM_DEBUG === '1';
const FAST_SAVE_BINDINGS = true;
const FAST_RESTORE_BINDINGS = true;

const IMPLICIT_SPACE_SKIPPING = true;

// When specializing rules, should we emit a generalized version that
// handles the specific cases? If false, code size will be larger.
// This doesn't seem to make a big performance difference either way.
const EMIT_GENERALIZED_RULES = false;

// When true, emit rule bodies directly at the call site for all single-use
// rules (not just inline rules like AddExpr_plus). This provides a speedup
// on both es5bench and parseLiquid. Inlined rules get a stub (returns 0)
// instead of a full compiled function, since they can't be used as start
// rules via match(). Use the `startRules` compiler option to whitelist
// additional entry points that need full compiled functions.
const INLINE_SINGLE_USE_RULES = true;

// A sentinel value representing "end of input".
// This could be anything > 0xffff, really.
const CHAR_CODE_END = 0xffffffff;

import type {CompileOptions} from './api.ts';

interface CompilerInternalOptions extends CompileOptions {
  preallocNodes?: boolean;
  startRules?: string[]; // TODO: Should probably be public (in CompileOptions).
}

const {instr} = w;

function checkNoUndefined(arr: readonly unknown[]): readonly unknown[] {
  assert(arr.indexOf(undefined) === -1, `found undefined @ ${arr.indexOf(undefined)}`);
  return arr;
}

function setdefault<K, V>(map: Map<K, V>, key: K, makeDefaultVal: () => V): V {
  if (!map.has(key)) map.set(key, makeDefaultVal());
  return map.get(key)!;
}

const getNotNull = <V>(map: Map<string, V>, k: string): V =>
  checkNotNull(map.get(k), `not found: '${k}'`);

function uniqueName(names: Set<string>, str: string): string {
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

function isSyntacticRule(ruleName: string): boolean {
  assert(ruleName[0] !== '$', ruleName);
  // Slightly different behaviour compared to Ohm v17:
  // Find first letter, check if it is uppercase.
  const firstLetter = ruleName.match(/\p{L}/u)?.[0];
  if (!firstLetter) return false;
  return /\p{Lu}/u.test(firstLetter);
}

class StringTable {
  _map: Map<string, number>;
  _strs: string[];

  constructor() {
    this._map = new Map();
    this._strs = [];
  }

  add(str: string): number {
    if (this._map.has(str)) {
      return this._map.get(str)!;
    }
    const idx = this._map.size;
    this._map.set(checkNotNull(str), idx);
    this._strs.push(str);
    return idx;
  }

  getStr(idx: number): string {
    return this._strs[idx];
  }

  getIndex(item: string): number | undefined {
    return this._map.get(item);
  }

  has(item: string): boolean {
    return this._map.has(item);
  }

  get size(): number {
    return this._map.size;
  }

  keys(): string[] {
    return [...this._map.keys()];
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
}

const prebuiltFuncidx = (nm: string): number =>
  checkNotNull((prebuilt.funcidxByName as Record<string, number>)[nm]);
const prebuiltGlobalidx = (nm: string): number =>
  checkNotNull((prebuilt.globalidxByName as Record<string, number>)[nm]);

// Produce a section combining `els` with the corresponding prebuilt section.
// This only does a naive merge; no type or function indices are rewritten.
function mergeSections(
  sectionId: w.SectionId,
  prebuiltSec: {entryCount: number; contents: w.Fragment},
  els: w.Fragment[]
): w.Fragment {
  const count = prebuiltSec.entryCount + els.length;
  return w.section(sectionId, [w.u32(count), prebuiltSec.contents, els]);
}

function functypeToString(
  paramTypes: readonly w.valtype[],
  resultTypes: readonly w.valtype[]
): string {
  const toStr = (t: w.valtype): string => {
    return checkNotNull(
      ['f64', 'f32', 'i64', 'i32'][(t as number) - (w.valtype.f64 as number)]
    );
  };
  const params = paramTypes.map(toStr).join(',');
  const results = resultTypes.map(toStr).join(',');
  return '[' + params + '][' + results + ']';
}

interface FuncDecl {
  name: string;
  module?: string;
  paramTypes: w.valtype[];
  resultTypes: w.valtype[];
  locals?: w.Fragment[];
  body?: (number | w.Fragment | string)[];
}

class TypeMap {
  _map: Map<string, [number, w.Fragment]>;
  _startIdx: number;

  constructor(startIdx = 0) {
    this._map = new Map();
    this._startIdx = startIdx;
  }

  add(paramTypes: readonly w.valtype[], resultTypes: readonly w.valtype[]): number {
    const key = functypeToString(paramTypes, resultTypes);
    if (this._map.has(key)) {
      return this._map.get(key)![0];
    }
    const idx = this._startIdx + this._map.size;
    this._map.set(key, [idx, w.functype(paramTypes, resultTypes)]);
    return idx;
  }

  addDecls(decls: FuncDecl[]): void {
    for (const {paramTypes, resultTypes} of decls) {
      this.add(paramTypes, resultTypes);
    }
  }

  getIdx(paramTypes: readonly w.valtype[], resultTypes: readonly w.valtype[]): number {
    const key = functypeToString(paramTypes, resultTypes);
    return checkNotNull(this._map.get(key))[0];
  }

  getIdxForDecl(decl: FuncDecl): number {
    return this.getIdx(decl.paramTypes, decl.resultTypes);
  }

  getTypes(): w.Fragment[] {
    return [...this._map.values()].map(([_, t]) => t);
  }
}

/*
  Offers a higher-level interface for generating WebAssembly code and
  constructing a module.
 */
class Assembler {
  _functionDecls: FuncDecl[];
  _blockStack: string[];
  _code: (number | w.Fragment | string)[];
  _locals: Map<string, number> | undefined;
  _typeMap: TypeMap;
  _frameDepth: number;

  static ALIGN_1_BYTE = 0;
  static ALIGN_2_BYTES = 1;
  static ALIGN_4_BYTES = 2;
  static CST_NODE_HEADER_SIZE_BYTES = 8;

  constructor(typeMap: TypeMap) {
    this._functionDecls = [];

    // Keep track of loops/blocks to make it easier (and safer) to generate
    // breaks to the correct index.
    this._blockStack = [];

    // State for the current function being generated.
    this._code = [];
    this._locals = undefined;
    this._frameDepth = 0;

    this._typeMap = typeMap;
  }

  addBlocktype(paramTypes: readonly w.valtype[], resultTypes: readonly w.valtype[]): void {
    this._typeMap.add(paramTypes, resultTypes);
  }

  blocktype(paramTypes: readonly w.valtype[], resultTypes: readonly w.valtype[]): w.Fragment {
    const idx = this._typeMap.getIdx(paramTypes, resultTypes);
    assert(idx !== -1, `Unknown blocktype: '${functypeToString(paramTypes, resultTypes)}'`);

    // From the spec: "The type index in a block type is encoded as a
    // positive signed integer, so that its signed LEB128 bit pattern cannot
    // collide with the encoding of value types or the special code 0x40."
    return w.i32(idx);
  }

  addLocal(name: string, type: w.valtype): number {
    assert(this._locals != null);
    assert(!this._locals.has(name), `Local '${name}' already exists`);
    assert(type === w.valtype.i32, `invalid local type: ${type}`);
    const idx = this._locals.size;
    this._locals.set(name, idx);
    return idx;
  }

  // Like addLocal, but does nothing if the local already exists.
  // Used by enterFrame/enterNotFrame because sibling frames at the same
  // depth share locals (e.g., two Alt alternatives both push at the same
  // depth).
  ensureLocal(name: string, type: w.valtype): void {
    if (!this._locals!.has(name)) {
      this.addLocal(name, type);
    }
  }

  addFunction(
    name: string,
    paramTypes: w.valtype[],
    resultTypes: w.valtype[],
    bodyFn: (asm: Assembler) => void
  ): void {
    this._locals = new Map();
    this._frameDepth = 0;
    paramTypes.forEach((t, i) => {
      this.addLocal(`__arg${i}`, t);
    });
    bodyFn(this);
    assert(this._frameDepth === 0, `Unbalanced frames in ${name}: depth=${this._frameDepth}`);
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

  globalidx(name: string): number {
    return prebuiltGlobalidx(name);
  }

  localidx(name: string): number {
    return checkNotNull(this._locals?.get(name), `Unknown local: ${name}`);
  }

  emit(...bytes: (number | w.Fragment | string)[]): void {
    const flat = (bytes as unknown[]).flat(Infinity) as (number | w.Fragment | string)[];
    checkNoUndefined(flat);
    this._code.push(...flat);
  }

  block(bt: number | w.Fragment, bodyThunk: () => void, label = ''): void {
    this._blockOnly(bt, label);
    bodyThunk();
    this._endBlock();
  }

  // Prefer to use `block`, but for some cases it's more convenient to emit
  // the block and the end separately.
  // Note: `label` (if specified) is not unique (e.g., 'pexprEnd').
  _blockOnly(bt: number | w.Fragment, label?: string): void {
    this.emit(instr.block, bt);
    this._blockStack.push(label ? `block:${label}` : 'block');
  }

  // This should always be paired with `blockOnly`.
  _endBlock(): void {
    const what = this._blockStack.pop()!.split(':')[0];
    assert(what === 'block', 'Invalid endBlock');
    this.emit(instr.end);
  }

  loop(bt: number | w.Fragment, bodyThunk: () => void): void {
    this.emit(instr.loop, bt);
    this._blockStack.push('loop');
    bodyThunk();
    this._blockStack.pop();
    this.emit(instr.end);
  }

  if(bt: number | w.Fragment, bodyThunk: () => void): void {
    this.ifElse(bt, bodyThunk);
  }

  ifElse(bt: number | w.Fragment, thenThunk: () => void, elseThunk?: () => void): void {
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

  ifFalse(bt: number | w.Fragment, bodyThunk: () => void): void {
    this.emit(instr.i32.eqz);
    this.if(bt, bodyThunk);
  }

  br(depth: number): void {
    this.emit(instr.br, w.labelidx(depth));
  }

  i32Add(): void {
    this.emit(instr.i32.add);
  }

  i32Const(value: number): void {
    this.emit(instr.i32.const, w.i32(value));
  }

  i32Load(offset = 0): void {
    this.emit(instr.i32.load, w.memarg(Assembler.ALIGN_4_BYTES, offset));
  }

  i32Load8u(offset = 0): void {
    this.emit(instr.i32.load8_u, w.memarg(Assembler.ALIGN_1_BYTE, offset));
  }

  i32Load16u(offset = 0): void {
    this.emit(instr.i32.load16_u, w.memarg(Assembler.ALIGN_2_BYTES, offset));
  }

  i32Mul(): void {
    this.emit(instr.i32.mul);
  }

  i32Eq(): void {
    this.emit(instr.i32.eq);
  }

  i32Ne(): void {
    this.emit(instr.i32.ne);
  }

  // Store [addr:i32, val:i32] -> []
  i32Store(offset = 0): void {
    this.emit(instr.i32.store, w.memarg(Assembler.ALIGN_4_BYTES, offset));
  }

  i32Sub(): void {
    this.emit(instr.i32.sub);
  }

  globalGet(name: string): void {
    this.emit(instr.global.get, this.globalidx(name));
  }

  globalSet(name: string): void {
    this.emit(instr.global.set, this.globalidx(name));
  }

  localGet(name: string): void {
    this.emit(instr.local.get, this.localidx(name));
  }

  localSet(name: string): void {
    this.emit(instr.local.set, this.localidx(name));
  }

  localTee(name: string): void {
    this.emit(instr.local.tee, this.localidx(name));
  }

  break(depth: number): void {
    const what = this._blockStack.at(-(depth + 1))!.split(':')[0];
    assert(what === 'block' || what === 'if', 'Invalid break');
    this.emit(instr.br, w.labelidx(depth));
  }

  // Conditional break -- emits a `br_if` for the given depth.
  condBreak(depth: number): void {
    const what = this._blockStack.at(-(depth + 1))!.split(':')[0];
    assert(what === 'block' || what === 'if', 'Invalid condBreak');
    this.emit(instr.br_if, w.labelidx(depth));
  }

  continue(depth: number): void {
    const what = this._blockStack.at(-(depth + 1))!.split(':')[0];
    assert(what === 'loop', 'Invalid continue');
    this.emit(instr.br, w.labelidx(depth));
  }

  brTable(labels: w.labelidx[], defaultLabelidx: w.labelidx): void {
    this.emit(instr.br_table, w.vec(labels), defaultLabelidx);
  }

  return(): void {
    this.emit(instr.return);
  }

  // Emit a dense jump table (switch-like) using br_table.
  switch(
    bt: number | w.Fragment,
    discrimThunk: () => void,
    numCases: number,
    caseCb: (i: number, depth: number) => void,
    defaultThunk: () => void
  ): void {
    const startStackHeight = this._blockStack.length;

    const labels: w.labelidx[] = [];

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

  // "Macros" -- codegen helpers specific to Ohm.

  i32Inc(): void {
    this.i32Const(1);
    this.i32Add();
  }

  i32Dec(): void {
    this.i32Const(1);
    this.i32Sub();
  }

  dup(): void {
    this.localTee('tmp');
    this.localGet('tmp');
  }

  currCharCode(): void {
    this.globalGet('pos');
    this.globalGet('endPos');
    this.emit(instr.i32.lt_u);

    this.ifElse(
      w.blocktype.i32,
      () => {
        this.globalGet('inputBuf');
        this.globalGet('pos');
        this.i32Const(1);
        this.emit(instr.i32.shl); // pos * 2
        this.i32Add(); // inputBuf + pos * 2
        this.i32Load16u(); // load UTF-16 code unit
      },
      () => {
        this.i32Const(CHAR_CODE_END);
      }
    );
  }

  nextCharCode(): void {
    this.currCharCode();
    this.incPos();
  }

  setRet(val: number): void {
    this.i32Const(val);
    this.localSet('ret');
  }

  // Allocate depth-indexed locals for pos and bindings length, save both,
  // and increment the frame depth.
  enterFrame(): void {
    const d = this._frameDepth;
    this.ensureLocal(`origPos_${d}`, w.valtype.i32);
    this.ensureLocal(`origBindingsLen_${d}`, w.valtype.i32);
    this._frameDepth++;
    this.savePos();
    this.saveNumBindings();
  }

  // Decrement the frame depth. No wasm instructions emitted.
  exitFrame(): void {
    assert(this._frameDepth > 0, 'exitFrame with no matching enterFrame');
    this._frameDepth--;
  }

  // Save the current input position to the current frame's local.
  savePos(): void {
    this.globalGet('pos');
    this.localSet(`origPos_${this._frameDepth - 1}`);
  }

  // Load the saved input position onto the stack.
  getSavedPos(): void {
    this.localGet(`origPos_${this._frameDepth - 1}`);
  }

  restorePos(): void {
    this.getSavedPos();
    this.globalSet('pos');
  }

  saveNumBindings(): void {
    if (FAST_SAVE_BINDINGS) {
      this.globalGet('bindings');
      this.i32Load(12); // Array<i32>.length_
    } else {
      this.callPrebuiltFunc('getBindingsLength');
    }
    this.localSet(`origBindingsLen_${this._frameDepth - 1}`);
  }

  getSavedNumBindings(): void {
    this.localGet(`origBindingsLen_${this._frameDepth - 1}`);
  }

  restoreBindingsLength(): void {
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

  saveFailurePos(): void {
    this.localGet('failurePos');
    this.localSet(`origFailurePos_${this._frameDepth - 1}`);
  }

  restoreFailurePos(): void {
    this.localGet(`origFailurePos_${this._frameDepth - 1}`);
    this.localSet('failurePos');
  }

  saveGlobalFailurePos(): void {
    this.globalGet('rightmostFailurePos');
    this.localSet(`origGlobalFailurePos_${this._frameDepth - 1}`);
  }

  restoreGlobalFailurePos(): void {
    this.localGet(`origGlobalFailurePos_${this._frameDepth - 1}`);
    this.globalSet('rightmostFailurePos');
  }

  saveRecordedFailuresLen(): void {
    this.callPrebuiltFunc('getRecordedFailuresLength');
    this.localSet(`origRecordedFailuresLen_${this._frameDepth - 1}`);
  }

  getSavedRecordedFailuresLen(): void {
    this.localGet(`origRecordedFailuresLen_${this._frameDepth - 1}`);
  }

  updateGlobalFailurePos(): void {
    // rightmostFailurePos = max(rightmostFailurePos, failurePos)
    this.i32Max(
      () => this.globalGet('rightmostFailurePos'),
      () => this.localGet('failurePos')
    );
    this.globalSet('rightmostFailurePos');
  }

  updateLocalFailurePos(origPosThunk: () => void): void {
    // failurePos = max(failurePos, origPos)
    this.i32Max(() => this.localGet('failurePos'), origPosThunk);
    this.localSet('failurePos');
  }

  maybeRecordFailure(origPosThunk: () => void, failureId: number): void {
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


  // For Not expressions: allocate locals for failurePos, globalFailurePos,
  // and recordedFailures.length, then save all three.
  enterNotFrame(): void {
    const d = this._frameDepth;
    this.ensureLocal(`origFailurePos_${d}`, w.valtype.i32);
    this.ensureLocal(`origGlobalFailurePos_${d}`, w.valtype.i32);
    this.ensureLocal(`origRecordedFailuresLen_${d}`, w.valtype.i32);
    this._frameDepth++;
    this.saveFailurePos();
    this.saveGlobalFailurePos();
    this.saveRecordedFailuresLen();
  }

  // For rules with descriptions: handle failure by swallowing internal failures
  // and recording the description at the start position.
  // Must be called after evaluating the rule body.
  handleDescriptionFailure(descriptionId: number): void {
    this.localGet('ret');
    this.ifFalse(w.blocktype.empty, () => {
      // Restore rightmostFailurePos (swallow internal failures for error position calculation)
      this.localGet('descGlobalFailurePos');
      this.globalSet('rightmostFailurePos');

      // Restore recordedFailures length if the description is at errorMessagePos.
      // This swallows internal failures (including inner descriptions).
      // If the description is NOT at errorMessagePos, keep internal failures
      // (they might be at errorMessagePos and thus relevant for the error message).
      this.globalGet('errorMessagePos');
      this.localGet('descStartPos');
      this.i32Eq(); // errorMessagePos == startPos?
      this.if(w.blocktype.empty, () => {
        // Description is at errorMessagePos - swallow internal failures
        this.localGet('descRecordedFailuresLen');
        this.callPrebuiltFunc('setRecordedFailuresLength');
      });

      // Update rightmostFailurePos to max(old, startPos)
      this.i32Max(
        () => this.globalGet('rightmostFailurePos'),
        () => this.localGet('descStartPos')
      );
      this.globalSet('rightmostFailurePos');

      // Set local failurePos to startPos
      this.localGet('descStartPos');
      this.localSet('failurePos');

      // Record the description at startPos
      this.maybeRecordFailure(() => this.localGet('descStartPos'), descriptionId);
    });
  }

  // Increment the current input position by 1.
  // [i32, i32] -> [i32]
  incPos(): void {
    this.globalGet('pos');
    this.i32Inc();
    this.globalSet('pos');
  }

  // Pushes i32 (0 or 1) indicating whether `tmp` is a high surrogate.
  tmpIsHighSurrogate(): void {
    this.localGet('tmp');
    this.i32Const(0xd800);
    this.emit(instr.i32.ge_u);
    this.localGet('tmp');
    this.i32Const(0xdbff);
    this.emit(instr.i32.le_u);
    this.emit(instr.i32.and);
  }

  // Assumes `tmp` holds a high surrogate and pos points at the low surrogate.
  // Reads the low surrogate, advances past it, and pushes the decoded code
  // point (i32) onto the stack.
  decodeSurrogatePair(): void {
    // cp = (tmp - 0xD800) << 10 + (lowSurr - 0xDC00) + 0x10000
    this.localGet('tmp');
    this.i32Const(0xd800);
    this.emit(instr.i32.sub);
    this.i32Const(10);
    this.emit(instr.i32.shl);
    this.currCharCode();
    this.incPos();
    this.i32Const(0xdc00);
    this.emit(instr.i32.sub);
    this.emit(instr.i32.add);
    this.i32Const(0x10000);
    this.emit(instr.i32.add);
  }

  callPrebuiltFunc(name: string): void {
    this.emit(instr.call, w.funcidx(prebuiltFuncidx(name)));
  }

  newIterNodeWithSavedPosAndBindings(arity: number, isOpt = false): void {
    this.getSavedPos();
    this.globalGet('pos');
    this.getSavedNumBindings();
    this.i32Const(arity);
    this.i32Const(isOpt ? 1 : 0);
    this.callPrebuiltFunc('newIterationNode');
  }

  // Wrap the bindings accumulated since the last enterFrame() in a
  // nonterminal node. Uses the saved pos/numBindings from the current frame.
  newNonterminalNodeFromFrame(ruleId: number): void {
    this.getSavedPos();
    this.globalGet('pos');
    this.i32Const(ruleId);
    this.getSavedNumBindings();
    this.i32Const(-1);
    this.callPrebuiltFunc('newNonterminalNode');
  }

  // [startIdx: i32] -> [ptr: i32]
  newTerminalNode(): void {
    this.localGet('postSpacesPos');
    this.globalGet('pos');
    this.callPrebuiltFunc('newTerminalNode');
  }

  i32Max(aThunk: () => void, bThunk: () => void): void {
    aThunk();
    bThunk();
    aThunk();
    bThunk();
    this.emit(instr.i32.gt_s, instr.select);
  }

  // Return the depth of the block with the given label.
  depthOf(label: string): number {
    const i = this._blockStack.findLastIndex(what => what === `block:${label}`);
    assert(i !== -1, `Unknown label: ${label}`);
    return this._blockStack.length - i - 1;
  }

  pushFluffySavePoint(): void {
    this.callPrebuiltFunc('pushFluffySavePoint');
  }

  popFluffySavePoint(shouldMark: boolean): void {
    this.i32Const(shouldMark ? 1 : 0);
    this.callPrebuiltFunc('popFluffySavePoint');
  }

  // Pop the fluffy save point, marking failures as fluffy only when
  // pos matches errorMessagePos. This mirrors ohm-js's scoped failure recording.
  popFluffySavePointIfAtErrorPos(): void {
    this.globalGet('errorMessagePos');
    this.globalGet('pos');
    this.i32Eq();
    this.callPrebuiltFunc('popFluffySavePoint');
  }

  // Pop the fluffy save point based on whether `ret` indicates success.
  // On success, mark failures as fluffy if pos is at errorMessagePos;
  // on failure, discard without marking.
  popFluffySavePointOnResult(): void {
    this.localGet('ret');
    this.ifElse(
      w.blocktype.empty,
      () => this.popFluffySavePointIfAtErrorPos(),
      () => this.popFluffySavePoint(false)
    );
  }

  ruleEvalReturn(): void {
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
interface RuleInfo {
  body: Expr;
  name?: string;
  isSyntactic?: boolean;
  formals?: string[];
  description?: string;
  patterns?: Expr[][];
  _isInlineRule?: boolean;
}

export class Compiler {
  grammar: ParsedGrammar;
  importDecls: FuncDecl[];
  ruleIdByName: StringTable;
  rules: Map<string, RuleInfo> | undefined;
  typeMap!: TypeMap;
  asm!: Assembler;
  _strings: StringTable;
  _endOfInputFailureId: number;
  _maxMemoizedRuleId: number;
  _lexContextStack: boolean[];
  _applySpacesImplicit: ir.Apply;
  _singleUseRules!: Set<string>;
  // Maps preallocatable rule names to the inner child rule name. Direct rules
  // (body matches a single codepoint) use '$term' as a sentinel.
  _preallocRules!: Map<string, string>;

  _options: CompilerInternalOptions;

  constructor(grammar: any, options?: CompilerInternalOptions) {
    assert(grammar && 'superGrammar' in grammar, 'Not a valid grammar: ' + grammar);

    // Detect the so-called "dual package hazard". Since we use the identity
    // of the pexpr constructors when compiling the grammar, it gets confusing
    // if there are multiple copies of Ohm.
    if (!(grammar instanceof ParsedGrammar)) {
      // If we have the source, recover by instantiating the grammar anew.
      // Fail otherwise.
      assert(
        !!grammar.source,
        'Grammar smells fishy. Do you have multiple instances of ohm-js?'
      );
      grammar = parseGrammar(grammar.source.contents);
    }

    this._options = {preallocNodes: true, ...options};
    this.grammar = grammar;

    this.importDecls = [];

    // The rule ID is a 0-based index that's mapped to the name.
    // It is *not* the same as the function index of the rule's eval function.
    this.ruleIdByName = new StringTable();
    this._strings = new StringTable();

    // Ensure "end of input" is always at index 0, so the runtime can use it
    // for the implicit end check.
    this._endOfInputFailureId = this._strings.add('end of input');

    this._maxMemoizedRuleId = -1;

    // Ensure default start rule has id 0; and $spaces, 1.
    this._ensureRuleId(grammar.defaultStartRule);
    this._ensureRuleId('$spaces');

    this.rules = undefined;

    // Keeps track of whether we're in a lexical or syntactic context.
    this._lexContextStack = [];
    this._applySpacesImplicit = ir.apply('$spaces', -1);
  }

  getOrAddFailure(str: string): number {
    return this._strings.add(str);
  }

  // Returns a failure description string for the given expression, or null
  // if a description can't be generated. For compound expressions (Alt, Seq,
  // Not, Iter, etc.), this recursively composes descriptions from children —
  // matching the behavior of ohm-js's pexprs-toFailure.js.
  toFailureDescription(exp: Expr): string | null {
    switch (exp.type) {
      case 'Any':
        return 'any character';
      case 'Range':
        return [exp.lo, exp.hi].map(cp => JSON.stringify(String.fromCodePoint(cp))).join('..');
      case 'Terminal':
        return JSON.stringify(exp.value);
      case 'End':
        return 'end of input';
      case 'Apply': {
        if (exp.descriptionId != null && exp.descriptionId >= 0) {
          return this._strings.getStr(exp.descriptionId);
        }
        if (exp.ruleName === 'end') return 'end of input';
        if (exp.ruleName === 'any') return 'any character';
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
      case 'GuardedIter':
      case 'RangeIter': {
        const childStr = this.toFailureDescription(exp.child);
        if (childStr == null) return null;
        return '(' + childStr + (exp.isPlus ? '+' : '*') + ')';
      }
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

  _prefixNot(str: string | null): string | null {
    return str != null ? 'not ' + str : null;
  }

  toFailure(exp: Expr): number {
    const str = this.toFailureDescription(exp);
    return str != null ? this.getOrAddFailure(str) : -1;
  }

  importCount(): number {
    return prebuilt.importsec.entryCount + this.importDecls.length;
  }

  ruleId(name: string): number {
    return checkNotNull(this.ruleIdByName.getIndex(name), `Unknown rule: ${name}`);
  }

  // This should be the only place where we assign rule IDs!
  _ensureRuleId(name: string): number {
    const idx = this.ruleIdByName.add(name);
    return idx;
  }

  inLexicalContext(): boolean {
    return checkNotNull(this._lexContextStack.at(-1));
  }

  // Return a funcidx corresponding to the eval function for the given rule.
  ruleEvalFuncIdx(name: string): w.funcidx {
    const offset = this.importCount() + prebuilt.funcsec.entryCount;
    return w.funcidx(this.ruleId(name) + offset);
  }

  // Return an object implementing all of the debug imports.
  getDebugImports(
    log: (name: string, arg: number) => void
  ): Record<string, (arg: number) => void> {
    const ans: Record<string, (arg: number) => void> = {};
    for (const decl of this.importDecls.filter(d => d.module === 'debug')) {
      const {name} = decl;
      ans[name] = arg => {
        log(name, arg);
      };
    }
    return ans;
  }

  transform(): void {
    assert(!this.rules, 'already normalized');
    this.lowerToIR();
    this.specializeRules();
    ir.optimize(this.rules!);

    this._singleUseRules = this.findSingleUseRules();
    this._preallocRules = this.findPreallocRules();

    this.assignRuleIds();
  }

  compile(): Uint8Array {
    this.transform();

    const typeMap = (this.typeMap = new TypeMap(prebuilt.typesec.entryCount));
    const asm = (this.asm = new Assembler(typeMap));
    asm.addBlocktype([w.valtype.i32], []);
    asm.addBlocktype([w.valtype.i32], [w.valtype.i32]);
    asm.addBlocktype([], [w.valtype.i32]); // Rule eval

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

  lowerToIR(): void {
    const {grammar} = this;

    const lookUpRule = (name: string) => ({
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PExpr subclass properties aren't visible on the base type
    const lower = (exp: any, isSyntactic: boolean): Expr => {
      if (exp instanceof pexprs.Alt) {
        return ir.alt(exp.terms.map((e: any) => lower(e, isSyntactic)));
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
          const descId = ruleInfo.description ? this._strings.add(ruleInfo.description) : -1;
          return ir.apply(
            exp.ruleName,
            descId,
            exp.args.map((arg: any) => lower(arg, isSyntactic))
          );
        }
        case pexprs.Lex: {
          // Lex is a no-op in a lexical context, so just drop it.
          const child = lower(exp.expr, false);
          return isSyntactic ? ir.lex(child) : child;
        }
        case pexprs.Lookahead:
          return ir.lookahead(lower(exp.expr, isSyntactic));
        case pexprs.Not:
          return ir.not(lower(exp.expr, isSyntactic));
        case pexprs.Opt:
          return ir.opt(lower(exp.expr, isSyntactic));
        case pexprs.Plus:
          return ir.plus(lower(exp.expr, isSyntactic));
        case pexprs.Seq:
          return ir.seq(exp.factors.map((e: any) => lower(e, isSyntactic)));
        case pexprs.Star:
          return ir.star(lower(exp.expr, isSyntactic));
        case pexprs.Param:
          return ir.param(exp.index);
        case pexprs.Range:
          return ir.range(exp.from.codePointAt(0), exp.to.codePointAt(0));
        case pexprs.Terminal:
          return ir.terminal(exp.obj);
        case pexprs.UnicodeChar:
          return ir.unicodeChar(exp.categoryOrProp);
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
          body: lower(info.body, info.isSyntactic),
        });
      }
    }
    this.rules = newRules;
  }

  beginLexContext(initialVal: boolean): void {
    assert(this._lexContextStack.length === 0);
    this._lexContextStack.push(initialVal);
  }

  endLexContext(): void {
    this._lexContextStack.pop();
    assert(this._lexContextStack.length === 0);
  }

  compileRule(name: string): FuncDecl {
    const {asm} = this;
    const ruleInfo = getNotNull(this.rules!, name);
    let paramTypes: w.valtype[] = [];
    if (ruleInfo.patterns) {
      paramTypes = [w.valtype.i32];
    }
    // const preHook = () => {
    // if (['alnum'].includes(name)) {
    //   this.emitSingleCharFastPath('alnum');
    // }
    // };

    const restoreFailurePos = name === this._applySpacesImplicit.ruleName;

    const descriptionId = ruleInfo.description ? this._strings.add(ruleInfo.description) : -1;
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
        asm.addLocal('descStartPos', w.valtype.i32);
        asm.addLocal('descGlobalFailurePos', w.valtype.i32);
        asm.addLocal('descRecordedFailuresLen', w.valtype.i32);
        asm.globalGet('pos');
        asm.localSet('descStartPos');
        asm.globalGet('rightmostFailurePos');
        asm.localSet('descGlobalFailurePos');
        asm.callPrebuiltFunc('getRecordedFailuresLength');
        asm.localSet('descRecordedFailuresLen');
      }

      // TODO: Find a simpler way to do this.
      if (restoreFailurePos) {
        asm.addLocal('origFailurePos', w.valtype.i32);
        asm.globalGet('rightmostFailurePos');
        asm.localSet('origFailurePos');
      }

      asm.emit(`BEGIN eval:${name}`);
      this.emitPExpr(ruleInfo.body);

      asm.popFluffySavePointOnResult();

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
    return checkNotNull(this.asm._functionDecls.at(-1));
  }

  // Beginning with the default start rule, recursively visit all reachable
  // parsing expressions. For all parameterized rules, create a specialized
  // version of that rule for every possible set of actual parameters.
  // At the end, there are no more applications with arguments.
  specializeRules(): void {
    const newRules = new Map<string, RuleInfo>();
    const rules = this.rules!;
    const patternsByRule = new Map<string, Map<string, Expr[]>>();
    const refCounts = new Map();

    const specialize = (exp: Expr): Expr =>
      ir.rewrite(exp, {
        Apply: app => {
          const {ruleName, children} = app;
          const ruleInfo = getNotNull(rules, ruleName);

          const specializedName = ir.specializedName(app);

          // If not yet seen, recursively visit the body of the specialized
          // rule. Note that this also applies to non-parameterized rules!
          if (!newRules.has(specializedName)) {
            newRules.set(specializedName, {} as RuleInfo); // Prevent infinite recursion.

            // Visit the body with the parameter substituted, to ensure we
            // discover all possible applications that can occur at runtime.
            let body = specialize(
              ir.substituteParams(ruleInfo.body, children as Exclude<Expr, ir.Param>[])
            );

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
          // Count references for single-use rule detection.
          refCounts.set(specializedName, (refCounts.get(specializedName) || 0) + 1);

          // Replace with an application of the specialized rule.
          return ir.apply(specializedName, app.descriptionId);
        },
      });
    specialize(ir.apply(this.grammar.defaultStartRule, -1));

    // Make a special rule for implicit space skipping, with the same body
    // as the real `spaces` rule.
    const spacesInfo = getNotNull(rules, 'spaces');
    newRules.set('$spaces', {
      ...spacesInfo,
      body: specialize(spacesInfo.body),
    });

    this.rules = newRules;

    if (EMIT_GENERALIZED_RULES) {
      const insertDispatches = (exp: Expr, patterns: Expr[][]) =>
        ir.rewrite(exp, {
          Apply: app => (app.children.length === 0 ? app : ir.dispatch(app, patterns)),
          Param: p => ir.dispatch(p, patterns),
        });

      // Save the observed patterns of the parameterized rules.
      // All non-parameterized & specialized rules have been discovered and
      // assigned IDs; any rule IDs assigned here won't be memoized.
      for (const [name, patterns] of patternsByRule.entries()) {
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

  // Returns a map of preallocatable rule names to their inner child rule name.
  // Direct rules (body matches a single codepoint) use '$term' as a sentinel;
  // transitive rules (body delegates to another preallocatable rule) map to
  // the inner rule name.
  findPreallocRules(): Map<string, string> {
    const matchesSingleCodepoint = (exp: Expr) => {
      if (['Any', 'UnicodeChar', 'Range'].includes(exp.type)) return true;
      if (exp.type === 'Terminal') return exp.value.length === 1;
    };
    const ans = new Map<string, string>();
    if (this._options.preallocNodes === false) return ans;

    const excludedRules = new Set<string>([this.grammar.defaultStartRule]);
    if (this._options.startRules) {
      for (const name of this._options.startRules) excludedRules.add(name);
    }

    // Phase 1: find direct prealloc rules (body is Range/UnicodeChar/Any/single-char Terminal).
    for (const [name, {body}] of this.rules!) {
      if (matchesSingleCodepoint(body) && !excludedRules.has(name)) {
        ans.set(name, '$term');
      }
    }

    // Phase 2: fixed-point transitive closure.
    // A rule is transitively preallocatable if its body is Apply(innerRule)
    // where innerRule is preallocatable and won't be inlined.
    let changed = true;
    while (changed) {
      changed = false;
      for (const [name, {body}] of this.rules!) {
        if (ans.has(name) || excludedRules.has(name)) continue;
        if (this.shouldInlineRule(name)) continue;
        if (body.type === 'Apply' && body.children.length === 0) {
          const innerName = body.ruleName;
          if (ans.has(innerName) && !this.shouldInlineRule(innerName)) {
            ans.set(name, innerName);
            changed = true;
          }
        }
      }
    }
    return ans;
  }

  findSingleUseRules(): Set<string> {
    const rules = checkNotNull(this.rules);
    const counts = new Map<string, number>();

    for (const [name, ruleInfo] of rules.entries()) {
      ir.visit(ruleInfo.body, {
        Apply(app) {
          counts.set(app.ruleName, (counts.get(app.ruleName) ?? 0) + 1);
        },
      });
    }
    const singleUseRules = new Set<string>();
    counts.forEach((count, name) => {
      if (count === 1 && !getNotNull(rules, name).description) singleUseRules.add(name);
    });
    singleUseRules.delete(this.grammar.defaultStartRule);
    if (this._options.startRules) {
      for (const name of this._options.startRules) {
        singleUseRules.delete(name);
      }
    }
    return singleUseRules;
  }

  shouldInlineRule(name: string): boolean {
    if (!this._singleUseRules.has(name)) return false;
    const isInlineRule = this.rules!.get(name)?._isInlineRule;
    return INLINE_SINGLE_USE_RULES || !!isInlineRule;
  }

  assignRuleIds() {
    // Reassign rule IDs: memoized rules get low IDs, everything else
    // gets high IDs. This shrinks the memo table index.
    const shouldMemoize = (name: string) =>
      !this._singleUseRules.has(name) && !this._preallocRules.has(name);

    for (const name of checkNotNull(this.rules).keys()) {
      if (shouldMemoize(name)) this._ensureRuleId(name);
    }
    this._maxMemoizedRuleId = this.ruleIdByName.size;
    this._preallocRules.forEach((_inner, name) => {
      this._ensureRuleId(name);
    });
    this._singleUseRules.forEach(name => {
      this._ensureRuleId(name);
    });
  }

  buildRuleNamesSection(ruleNames: string[]): w.Fragment {
    // A custom section that allows the clients to look up rule IDs by name.
    // They're simply encoded as a vec(name), and the client can turn this
    // into a list/array and use the ruleId as the index.
    return w.custom(w.name('ruleNames'), w.vec(ruleNames.map((n, i) => w.name(n))));
  }

  buildNameSec(functionDecls: FuncDecl[], compilerFuncOffset: number): w.Fragment {
    const moduleNameSubsec = w.modulenamesubsec(this.grammar.name);
    if (!this._options.debug) {
      return w.namesec(moduleNameSubsec);
    }
    return w.namesec(
      w.namedata(
        moduleNameSubsec,
        w.funcnamesubsec(
          w.namemap(
            functionDecls.map((f, i) => w.nameassoc(w.funcidx(i + compilerFuncOffset), f.name))
          )
        ),
        [] // no local name subsection
      )
    );
  }

  buildStringTable(sectionName: string, tableOrArr: string[] | StringTable): w.Fragment {
    const keys = Array.isArray(tableOrArr) ? tableOrArr : tableOrArr.keys();
    return w.custom(w.name(sectionName), w.vec(keys.map(n => w.name(n))));
  }

  buildModule(typeMap: TypeMap, functionDecls: FuncDecl[]): Uint8Array {
    const ruleNames = this.ruleIdByName.keys();
    assert(this.importCount() === prebuilt.destImportCount, 'import count mismatch');

    // Ensure that `ruleNames` is in the correct order.
    ruleNames.forEach((n, i) =>
      assert(i === this.ruleIdByName.getIndex(n), `out of order: ${n}`)
    );

    typeMap.addDecls(this.importDecls);
    typeMap.addDecls(functionDecls);

    const imports = this.importDecls.map((f, i) =>
      w.import_(f.module!, f.name, w.importdesc.func(w.typeidx(typeMap.getIdxForDecl(f))))
    );
    const funcs = functionDecls.map(f => w.typeidx(typeMap.getIdxForDecl(f)));
    const codes = functionDecls.map(f => w.code(w.func(f.locals!, f.body as w.Fragment)));

    // The funcidx offset for compiler-generated functions (after imports + prebuilt).
    const compilerFuncOffset = this.importCount() + prebuilt.funcsec.entryCount;

    // Rule eval functions are invoked via call_indirect (the table), so they
    // don't need to be exported. Only export memory and the prebuilt functions/globals.
    const exports: w.Fragment[] = [];
    exports.push(w.export_('memory', w.exportdesc.mem(w.memidx(0))));

    // Re-export prebuilt functions used by the Ohm runtime.
    [
      'bindingsAt',
      'getBindingsLength',
      'getRecordedFailuresLength',
      'isFluffy',
      'match',
      'recordedFailuresAt',
      'recordFailures',
    ].forEach(name => {
      exports.push(w.export_(name, w.exportdesc.func(w.funcidx(prebuiltFuncidx(name)))));
    });

    // Export prebuilt globals used by the runtime (miniohm.ts) and internal tools.
    for (const name of [
      '__heap_base',
      '__offset',
      'memoIndexBase',
      'numMemoBlocks',
      'pos',
      'rightmostFailurePos',
    ] as const) {
      exports.push(w.export_(name, [0x03, prebuilt.globalidxByName[name]]));
    }
    // The module will have a table containing references to all of the rule eval functions,
    // plus a compiler-generated $isRuleSyntactic dispatch function at the end.
    // The rule ID can be used directly as the table index; $isRuleSyntactic is at index numRules.
    const numRules = this.ruleIdByName.size;
    const tableSize = numRules + 1; // +1 for $isRuleSyntactic
    const table = w.table(
      w.tabletype(w.elemtype.funcref, w.limits.minmax(tableSize, tableSize))
    );
    const tableData = ruleNames.map(name => this.ruleEvalFuncIdx(name));
    // Add $isRuleSyntactic as the last table entry.
    const isRuleSyntacticIdx = functionDecls.findIndex(f => f.name === '$isRuleSyntactic');
    assert(isRuleSyntacticIdx !== -1, 'No $isRuleSyntactic function found');
    tableData.push(w.funcidx(compilerFuncOffset + isRuleSyntacticIdx));
    assert(tableSize === tableData.length, 'Invalid table size');

    // Determine the index of the start function.
    const indexOfStart = functionDecls.findIndex(f => f.name === 'start');
    assert(indexOfStart !== -1, 'No start function found');
    const startFuncidx = compilerFuncOffset + indexOfStart;

    const mod = w.module([
      mergeSections(w.SECTION_ID_TYPE, prebuilt.typesec, typeMap.getTypes()),
      mergeSections(w.SECTION_ID_IMPORT, prebuilt.importsec, imports),
      mergeSections(w.SECTION_ID_FUNCTION, prebuilt.funcsec, funcs),
      w.tablesec([table]),
      w.memsec([w.mem(w.memtype(w.limits.min(1)))]),
      mergeSections(w.SECTION_ID_GLOBAL, prebuilt.globalsec, []),
      w.exportsec(exports),
      w.startsec(w.start(startFuncidx)),
      w.elemsec([w.elem(w.tableidx(0), [instr.i32.const, w.i32(0), instr.end], tableData)]),
      mergeSections(w.SECTION_ID_CODE, prebuilt.codesec, codes),
      w.customsec(this.buildStringTable('ruleNames', ruleNames)),
      w.customsec(this.buildStringTable('strings', this._strings)),
      this.buildNameSec(functionDecls, compilerFuncOffset),
    ]);
    const bytes = Uint8Array.from((mod as unknown[]).flat(Infinity) as number[]);

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
  rewriteDebugLabels(decls: FuncDecl[]): void {
    // Careful: this.importDecls *doesn't* include the prebuilt imports (we know how many there
    // are, but it's otherwise treated as an opaque blob). But it *does* include any non-debug
    // imports, so we account for those in nextIdx, and for the prebuilt imports in `intoFuncidx`.
    let nextIdx = 0;
    const intoFuncidx = (i: number): w.funcidx => w.funcidx(prebuilt.importsec.entryCount + i);
    const names = new Set<string>();
    for (let i = 0; i < decls.length; i++) {
      const entry = decls[i];
      entry.body = entry.body!.flatMap((x): (number | w.Fragment)[] => {
        if (typeof x !== 'string') return [x];

        // If debugging is disabled, just drop the string altogether.
        if (!DEBUG) return [];

        // Claim one of the reserved debug functions…
        const idx = nextIdx++;
        const decl = checkNotNull(this.importDecls[idx], 'Too few debug functions!');
        assert(decl.module === 'debug');
        decl.name = uniqueName(names, x);

        if (x.startsWith('END')) {
          decl.paramTypes = [w.valtype.i32];
          // We want to pass 'ret', but to figure out its index, we need to
          // account for the number of parameters.
          const retIdx = entry.paramTypes.length;
          return [instr.local.get, w.localidx(retIdx), instr.call, intoFuncidx(idx)];
        }

        // …and replace the string with a call to that function.
        return [instr.call, intoFuncidx(idx)];
      });
    }
  }

  functionDecls(): FuncDecl[] {
    const {asm} = this;
    const ruleDecls: FuncDecl[] = [];
    for (const name of this.ruleIdByName.keys()) {
      if (this.shouldInlineRule(name)) {
        // Inlined rules have their body emitted at the call site. Emit a stub
        // (returns failure) for the standalone function, since it won't be
        // called directly via match().
        asm.addFunction(`$${name}`, [], [w.valtype.i32], () => {
          asm.i32Const(0);
        });
        ruleDecls.push(checkNotNull(asm._functionDecls.at(-1)));
      } else {
        ruleDecls.push(this.compileRule(name));
      }
    }
    asm.addFunction('start', [], [], () => {
      asm.i32Const(this.ruleIdByName.size);
      asm.globalSet('numRules');
      // setNumMemoizedRules also computes numMemoBlocks.
      asm.i32Const(this._maxMemoizedRuleId);
      asm.callPrebuiltFunc('setNumMemoizedRules');
      asm.emit(instr.call, w.funcidx(prebuilt.startFuncidx));
    });
    ruleDecls.push(checkNotNull(asm._functionDecls.at(-1)));

    // Generate a dispatch function for isRuleSyntactic. The runtime calls
    // this via call_indirect at table index numRules. Returns 1 for
    // syntactic rules, 0 for lexical rules.
    asm.addFunction('$isRuleSyntactic', [w.valtype.i32], [w.valtype.i32], () => {
      asm.block(
        w.blocktype.empty,
        () => {
          asm.block(
            w.blocktype.empty,
            () => {
              asm.localGet('__arg0');
              const brLabels = this.ruleIdByName.keys().map(name => {
                const isSyntactic = name[0] === name[0].toUpperCase();
                return w.labelidx(asm.depthOf(isSyntactic ? 'syntactic' : 'lexical'));
              });
              asm.brTable(brLabels, w.labelidx(asm.depthOf('lexical')));
            },
            'syntactic'
          );
          asm.i32Const(1);
          asm.return();
        },
        'lexical'
      );
      asm.i32Const(0);
    });
    ruleDecls.push(checkNotNull(asm._functionDecls.at(-1)));

    return ruleDecls;
  }

  // Handle an application-like expression (i.e. an actual Apply, or a Param)
  // in the *body* of the generalized version of a parameterized rule.
  // Generalized rules can behave like a specific specialized version of the
  // rule; they take an i32 `caseIdx` argument that selects the behaviour.
  // Then, for any Param -- or Apply that involves a Param -- we dynamically
  // dispatch to the correct specialized version of the rule.
  emitDispatch({child: exp, patterns}: ir.Dispatch): void {
    const {asm} = this;

    const handleCase = (i: number) => {
      // Substitute the params to get the concrete expression that
      // needs to be inserted here.
      let newExp = ir.substituteParams(exp, patterns[i] as Exclude<Expr, ir.Param>[]);
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

  emitPExpr(
    exp: Expr,
    {preHook, postHook}: {preHook?: () => void; postHook?: () => void} = {}
  ): void {
    const {asm} = this;

    const allowFastApply = !preHook && !postHook;

    // Note that after specializeRules, there are two classes of rule:
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

    const skipFrame =
      ir.isLeaf(exp) || exp.type === 'Seq' || exp.type === 'Lex' || exp.type === 'Dispatch';
    // Types that use condBreak(depthOf('pexprEnd')) for early exit:
    const needsPExprEnd =
      exp.type === 'Alt' || exp.type === 'Seq' || exp.type === 'GuardedIter';

    const debugLabel = ir.toString(exp);
    asm.emit(`BEGIN ${debugLabel}`);
    if (!skipFrame) asm.enterFrame();

    const emitBody = () => {
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
        case 'GuardedIter':
          this.emitGuardedIter(exp);
          break;
        case 'RangeIter':
          this.emitRangeIter(exp);
          break;
        case 'Lex':
          this.emitLex(exp);
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
    };

    if (needsPExprEnd) {
      asm.block(w.blocktype.empty, emitBody, 'pexprEnd');
    } else {
      emitBody();
    }
    if (postHook) postHook();
    if (!skipFrame) asm.exitFrame();
    asm.emit(`END ${debugLabel}`);
  }

  emitAlt(exp: ir.Alt): void {
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

  // Matches a single code point (BMP or supplementary) and checks it against
  // [lo, hi]. Used by emitRange when hi > 0xFFFF.
  matchCodePointRange(lo: number, hi: number, failureId: number): void {
    const {asm} = this;
    this.wrapTerminalLike(() => {
      asm.currCharCode();
      asm.localTee('tmp');
      asm.incPos();

      asm.i32Const(CHAR_CODE_END);
      asm.i32Eq();
      asm.condBreak(asm.depthOf('failure'));

      asm.tmpIsHighSurrogate();
      asm.ifElse(
        w.blocktype.i32,
        () => {
          // Surrogate: decode full code point and check range.
          asm.decodeSurrogatePair();
          // (cp - lo) <= (hi - lo) is a single unsigned range check.
          asm.i32Const(lo);
          asm.emit(instr.i32.sub);
          asm.i32Const(hi - lo);
          asm.emit(instr.i32.le_u);
        },
        () => {
          // BMP char: can only match if lo is in the BMP.
          if (lo > 0xffff) {
            asm.i32Const(0);
          } else {
            asm.localGet('tmp');
            asm.i32Const(lo);
            asm.emit(instr.i32.ge_u);
          }
        }
      );

      asm.emit(instr.i32.eqz);
      asm.condBreak(asm.depthOf('failure'));
    }, failureId);
  }

  emitAny(exp: ir.Any): void {
    const {asm} = this;
    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      asm.currCharCode();
      asm.localTee('tmp');
      asm.incPos();

      asm.i32Const(CHAR_CODE_END);
      asm.i32Eq();
      asm.condBreak(asm.depthOf('failure'));

      // Skip the low surrogate if tmp is a high surrogate (0 or 1).
      asm.tmpIsHighSurrogate();
      asm.globalGet('pos');
      asm.emit(instr.i32.add);
      asm.globalSet('pos');
    }, failureId);
  }

  // Need to know which case we're applying!
  emitApplyGeneralized(exp: ir.ApplyGeneralized): void {
    const {asm} = this;
    asm.i32Const(this.ruleId(exp.ruleName));
    asm.i32Const(exp.caseIdx);
    asm.callPrebuiltFunc('evalApplyGeneralized');
    asm.localSet('ret');
  }

  emitApply(exp: ir.Apply): void {
    assert(exp.children.length === 0);

    // Avoid infinite recursion.
    if (exp !== this._applySpacesImplicit) {
      this.maybeEmitSpaceSkipping();
    }

    const {asm} = this;

    if (this.shouldInlineRule(exp.ruleName)) {
      this.emitInlinedApply(exp);
      return;
    }

    const ruleId = this.ruleId(exp.ruleName);
    asm.i32Const(ruleId);

    const preallocInner = this._preallocRules.get(exp.ruleName);
    if (preallocInner !== undefined) {
      const innerPreallocIdx =
        preallocInner !== '$term' ? this.ruleId(preallocInner) - this._maxMemoizedRuleId : -1;
      asm.i32Const(innerPreallocIdx);
      asm.callPrebuiltFunc('evalApplyPrealloc');
    } else if (ruleId >= this._maxMemoizedRuleId) {
      asm.callPrebuiltFunc('evalApplyNoMemo0');
    } else {
      asm.callPrebuiltFunc('evalApply0');
    }
    // The application may have updated rightmostFailurePos; if so, we may
    // need to update the local failure position.
    asm.updateLocalFailurePos(() => asm.globalGet('rightmostFailurePos'));
    asm.localSet('ret');
  }

  // Emit the body of a rule directly at the call site, rather than generating
  // a `call` to the rule's eval function. Used for single-use rules (e.g.,
  // inline rules like AddExpr_plus) to avoid the overhead of a function call.
  emitInlinedApply(exp: ir.Apply): void {
    const {asm} = this;
    const ruleId = this.ruleId(exp.ruleName);
    const ruleInfo = getNotNull(this.rules!, exp.ruleName);

    asm.enterFrame();
    this._lexContextStack.push(!ruleInfo.isSyntactic);
    asm.pushFluffySavePoint();
    this.emitPExpr(ruleInfo.body);
    asm.popFluffySavePointOnResult();
    this._lexContextStack.pop();

    // On success, wrap the body's bindings in a nonterminal node.
    asm.localGet('ret');
    asm.if(w.blocktype.empty, () => {
      asm.newNonterminalNodeFromFrame(ruleId);
      asm.localSet('ret');
    });

    asm.exitFrame();
    asm.updateLocalFailurePos(() => asm.globalGet('rightmostFailurePos'));
  }

  emitEnd(exp: ir.End): void {
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

  emitFail(): void {
    const {asm} = this;
    asm.i32Const(0);
    asm.localSet('ret');
  }

  emitLex({child}: ir.Lex): void {
    this._lexContextStack.push(true);
    this.emitPExpr(child);
    this._lexContextStack.pop();
  }

  emitLookahead({child}: ir.Lookahead): void {
    const {asm} = this;

    // TODO: Should positive lookahead record a CST?
    asm.pushFluffySavePoint();
    this.emitPExpr(child);
    asm.restoreBindingsLength();
    asm.restorePos();

    // When lookahead succeeds, mark inner failures as fluffy (scoped).
    asm.localGet('ret');
    asm.ifElse(
      w.blocktype.empty,
      () => {
        asm.popFluffySavePointIfAtErrorPos();
      },
      () => {
        asm.popFluffySavePoint(false);
      }
    );
  }

  emitNot(exp: ir.Not): void {
    const {child} = exp;
    const {asm} = this;
    const failureId = this.toFailure(exp);

    // Save failurePos, globalFailurePos, and recordedFailures.length.
    // We use setRecordedFailuresLength to directly truncate after the
    // child evaluation. This matches JS's pushFailuresInfo/popFailuresInfo
    // for Not expressions.
    asm.enterNotFrame();

    this.emitPExpr(child);

    // Invert the result.
    asm.localGet('ret');
    asm.emit(instr.i32.eqz);
    asm.localSet('ret');

    // Restore all global and local state from the Not frame.
    asm.restoreGlobalFailurePos();
    asm.restoreFailurePos();

    // Discard all child failures by restoring recordedFailures.length.
    // Only during the recording pass.
    asm.globalGet('errorMessagePos');
    asm.i32Const(0);
    asm.emit(instr.i32.ge_s);
    asm.if(w.blocktype.empty, () => {
      asm.getSavedRecordedFailuresLen();
      asm.callPrebuiltFunc('setRecordedFailuresLength');
    });

    // Exit the Not frame; restoreBindingsLength/restorePos now read
    // from the outer frame.
    asm.exitFrame();
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

  emitOpt({child}: ir.Opt): void {
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

  emitPlus(plusExp: ir.Plus): void {
    const {asm} = this;
    this.emitPExpr(plusExp.child);
    asm.localGet('ret');
    asm.if(w.blocktype.empty, () => {
      this.emitStar(plusExp);
    });
  }

  emitRange(exp: ir.Range): void {
    const {lo, hi} = exp;
    const {asm} = this;
    const failureId = this.toFailure(exp);

    if (hi <= 0xffff) {
      // BMP-only path: compare single UTF-16 code unit.
      this.wrapTerminalLike(() => {
        // Use currCharCode (not nextCharCode) so failure position is correct.
        asm.currCharCode();

        // if (c > hi) fail;
        asm.dup();
        asm.i32Const(hi);
        asm.emit(instr.i32.gt_u);
        asm.condBreak(asm.depthOf('failure'));

        // if (c < lo) fail;
        asm.i32Const(lo);
        asm.emit(instr.i32.lt_u);
        asm.condBreak(asm.depthOf('failure'));

        // Success — increment position.
        asm.incPos();
      }, failureId);
    } else {
      this.matchCodePointRange(lo, hi, failureId);
    }
  }

  emitSeq({children}: ir.Seq): void {
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

  maybeEmitSpaceSkipping(): void {
    if (IMPLICIT_SPACE_SKIPPING && !this.inLexicalContext()) {
      this.asm.emit('BEGIN space skipping');
      this.emitApply(this._applySpacesImplicit);
      this.asm.emit('END space skipping');
    }
  }

  // Shared loop skeleton for Star (and the Star part of Plus).
  // The callback `emitLoopBody` is responsible for emitting everything
  // inside the loop after savePos/saveNumBindings — including the
  // break-on-failure and continue logic.
  private emitStarLoop(child: Expr, emitLoopBody: () => void): void {
    const {asm} = this;

    asm.pushFluffySavePoint();
    asm.enterFrame();
    asm.block(
      w.blocktype.empty,
      () => {
        asm.loop(w.blocktype.empty, () => {
          asm.savePos();
          asm.saveNumBindings();
          emitLoopBody();
        });
      },
      'done'
    );
    asm.restorePos();
    asm.restoreBindingsLength();
    asm.exitFrame();
    asm.newIterNodeWithSavedPosAndBindings(ir.outArity(child));
    // Star always succeeds, so mark inner failures as fluffy (scoped).
    asm.popFluffySavePointIfAtErrorPos();
    asm.localSet('ret');
  }

  // Inline the effect of matching `any` without the wrapTerminalLike overhead.
  // Assumes `tmp` already holds the current char code (and is not CHAR_CODE_END).
  // Sets postSpacesPos, advances pos, handles surrogates, creates a terminal node.
  private emitAnyInline(): void {
    const {asm} = this;
    asm.globalGet('pos');
    asm.localSet('postSpacesPos');
    asm.incPos();

    // Skip the low surrogate if tmp is a high surrogate.
    asm.tmpIsHighSurrogate();
    asm.globalGet('pos');
    asm.emit(instr.i32.add);
    asm.globalSet('pos');

    asm.newTerminalNode();
    asm.localSet('ret'); // consume the return value
  }

  // TODO: Emit a tight loop with inline range check and compact iter node,
  // similar to emitGuardedIter. Currently delegates to standard Star/Plus codegen.
  emitRangeIter(exp: ir.RangeIter): void {
    const wrapped = {type: exp.isPlus ? 'Plus' : 'Star', child: exp.child} as
      | ir.Plus
      | ir.Star;
    if (exp.isPlus) {
      this.emitPlus(wrapped as ir.Plus);
    } else {
      this.emitStar(wrapped);
    }
  }

  emitGuardedIter(exp: ir.GuardedIter): void {
    const {asm} = this;
    const {child, guardChars} = exp;

    // child is always Seq([Not(delim), Any]). Extract `delim`.
    assert(child.type === 'Seq' && child.children[0].type === 'Not');
    const delim = child.children[0].child;

    // For Plus, emit the child once before entering the star loop.
    if (exp.isPlus) {
      this.emitPExpr(child);
      asm.localGet('ret');
      asm.emit(instr.i32.eqz);
      asm.condBreak(asm.depthOf('pexprEnd'));
    }

    this.emitStarLoop(child, () => {
      // Load current char code into tmp.
      asm.currCharCode();
      asm.localSet('tmp');

      // If at end of input, break.
      asm.localGet('tmp');
      asm.i32Const(CHAR_CODE_END);
      asm.i32Eq();
      asm.condBreak(asm.depthOf('done'));

      asm.block(
        w.blocktype.empty,
        () => {
          // For each guard char, check if tmp matches — if so, check the delimiter.
          for (const c of guardChars) {
            asm.localGet('tmp');
            asm.i32Const(c);
            asm.i32Eq();
            asm.condBreak(asm.depthOf('checkDelimiter'));
          }

          // FAST PATH: char doesn't match any delimiter first-char.
          this.emitAnyInline();
          asm.continue(1); // continue the loop
        },
        'checkDelimiter'
      );

      // Guard char matched — try to match the delimiter.
      // Not discards all internal failures, so we just need to check
      // whether `delim` matches and branch on the result.
      // emitPExpr enters/exits its own frame, so after it returns,
      // the frame depth is back to the star loop's frame — we can
      // restore directly.
      this.emitPExpr(delim);
      asm.restorePos();
      asm.restoreBindingsLength();

      // If `delim` matched, the delimiter was found — stop iterating.
      asm.localGet('ret');
      asm.condBreak(asm.depthOf('done'));

      // `delim` didn't match — consume one char and continue.
      this.emitAnyInline();
      asm.continue(0);
    });
  }

  emitStar({child}: ir.Star | ir.Plus): void {
    this.emitStarLoop(child, () => {
      this.emitPExpr(child);
      this.asm.localGet('ret');
      this.asm.emit(instr.i32.eqz);
      this.asm.condBreak(this.asm.depthOf('done'));
      this.asm.continue(0);
    });
  }

  wrapTerminalLike(thunk: () => void, failureId: number): void {
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

  emitCaseInsensitive(exp: ir.CaseInsensitive): void {
    const {asm} = this;
    const {value} = exp;
    const isAllAscii = [...value].every(c => c <= '\x7f');

    const failureId = this.toFailure(exp);
    asm.emit(JSON.stringify(`caseInsensitive:${value}`));

    if (isAllAscii) {
      const str = value.toLowerCase();
      this.wrapTerminalLike(() => {
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
    } else {
      // Unicode path: whole-string host callout
      const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const strIdx = this._strings.add(escaped);
      this.wrapTerminalLike(() => {
        asm.i32Const(strIdx);
        asm.callPrebuiltFunc('doMatchCaseInsensitive');
        asm.emit(instr.i32.eqz);
        asm.condBreak(asm.depthOf('failure'));
      }, failureId);
    }
  }

  emitTerminal(exp: ir.Terminal): void {
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

  emitUnicodeChar(exp: ir.UnicodeChar): void {
    const {asm} = this;

    // TODO: Add support for more categories, by calling out to the host.
    assert(['Ll', 'Lu', 'Ltmo'].includes(exp.categoryOrProp));

    const failureId = this.toFailure(exp);
    this.wrapTerminalLike(() => {
      asm.block(
        w.blocktype.empty,
        () => {
          asm.block(
            w.blocktype.empty,
            () => {
              // Fast path: range checks for ASCII characters.
              if (exp.categoryOrProp === 'Lu') {
                // (c - 'A') <= ('Z' - 'A'), unsigned
                asm.currCharCode();
                asm.i32Const(0x41); // 'A'
                asm.emit(instr.i32.sub);
                asm.i32Const(0x5a - 0x41); // 'Z' - 'A'
                asm.emit(instr.i32.le_u);
                asm.condBreak(asm.depthOf('fastSuccess'));
              } else if (exp.categoryOrProp === 'Ll') {
                // (c - 'a') <= ('z' - 'a'), unsigned
                asm.currCharCode();
                asm.i32Const(0x61); // 'a'
                asm.emit(instr.i32.sub);
                asm.i32Const(0x7a - 0x61); // 'z' - 'a'
                asm.emit(instr.i32.le_u);
                asm.condBreak(asm.depthOf('fastSuccess'));
              }
              // No ASCII chars are Ltmo, so skip the range check.

              // If ASCII, it's definitely not a match.
              asm.currCharCode();
              asm.i32Const(128);
              asm.emit(instr.i32.lt_u);
              asm.condBreak(asm.depthOf('failure'));

              // Slow path: non-ASCII character, call out to host.
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
// - All memory is heap-allocated (memo table index + blocks, CST nodes,
//   input buffer). Backtracking state uses wasm locals, not memory.
