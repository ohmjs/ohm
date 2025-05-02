import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

import * as w from '@wasmgroundup/emit';

const {instr} = w;

const ALIGN_1_BYTE = 0;
const ALIGN_4_BYTES = 2;

const globalidx = {
  POS: w.globalidx(0)
};

// Define a fixed set of locals that are used in the generated code, almost
// like registers.
const localidx = {
  RET: w.localidx(0),
  ORIG_POS: w.localidx(1),
  MAX_POS: w.localidx(2) // end of loop value
  // IDX: w.localidx(2), // generic loop index var
};

// Load the current input position onto the stack.
// [] -> [i32]
const getPos = () => [instr.global.get, globalidx.POS];

// Set the current input position to the TOS value.
// [i32] -> []
const setPos = () => [instr.global.set, globalidx.POS];

// Increment the current input position by 1.
// [i32, i32] -> [i32]
const incPos = () => [getPos(), [instr.i32.const, w.i32(1), instr.i32.add], setPos()];

// Save the current input position into a local.
const setOrigPos = () => [instr.local.set, localidx.ORIG_POS];

// Load the saved input position onto the stack.
const getOrigPos = () => [instr.local.get, localidx.ORIG_POS];

// Restore the input position from a local.
// [] -> []
const restorePos = () => [[instr.local.get, localidx.ORIG_POS], setPos()];

// Restore the input position and "return" false.
const bail = idx => [
  restorePos(),
  [instr.i32.const, 0],
  setRet(),
  [instr.br, w.labelidx(idx)]
];

const ifTrue = body => [[instr.if, w.blocktype.empty], body, instr.end];

// Save the TOS value into the return value register.
const saveRet = () => [instr.local.tee, localidx.RET];

const getRet = () => [instr.local.get, localidx.RET];

const setRet = (valFrag = []) => [valFrag, instr.local.set, localidx.RET];

const currCharCode = () => [getPos(), [instr.i32.load8_u, w.memarg(ALIGN_1_BYTE, 0)]];

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toWasm = function (compiler) {
  compiler._enter(this);
  // Wrap the body in a block, which is useful for two reasons:
  // - it allows early returns.
  // - it makes sure that the generated code doesn't have stack effects.
  const ans = [
    `BEGIN ${compiler._codegenCtx.at(-1)}`,
    [instr.block, w.blocktype.empty],
    this._toWasm(compiler),
    instr.end,
    `END ${compiler._codegenCtx.at(-1)}`
  ];
  compiler._exit(this);
  return ans;
};

pexprs.PExpr.prototype._toWasm = abstract('_toWasm');

pexprs.Alt.prototype._toWasm = function (c) {
  return [
    [getPos(), setOrigPos()], // origPos = pos
    ...this.terms.flatMap(term => [
      term.toWasm(c),
      getRet(),
      [instr.br_if, w.labelidx(0)],
      [getOrigPos(), setPos()] // pos = origPos
    ])
  ];
};

pexprs.Apply.prototype._toWasm = function (c) {
  const idx = c.ruleIdxByName.get(this.ruleName);
  return [[instr.call, w.funcidx(idx)], setRet()];
};

pexprs.Terminal.prototype._toWasm = function (c) {
  // TODO:
  // - proper UTF-8!
  // - deal with hitting the end of input. Maybe use 0xFF?
  // - handle longer terminals with a loop
  return [
    // Unrolled loop over all characters.
    ...Array.prototype.flatMap.call(this.obj, c => [
      // Compare next char
      [instr.i32.const, w.i32(c.charCodeAt(0))],
      currCharCode(),
      [instr.i32.ne, ifTrue(bail(1))],
      incPos()
    ]),
    setRet([instr.i32.const, 1])
  ];
};
