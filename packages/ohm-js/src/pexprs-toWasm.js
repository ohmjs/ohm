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
  // TMP: w.localidx(0),
  ORIG_POS: w.localidx(0),
  MAX_POS: w.localidx(1) // end of loop value
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
// [] -> []
const savePos = () => [getPos(), [instr.local.set, localidx.ORIG_POS]];

// Restore the input position from a local.
// [] -> []
const restorePos = () => [[instr.local.get, localidx.ORIG_POS], setPos()];

// Restore the input position and return false.
const bail = () => [restorePos(), [instr.i32.const, 0, instr.return]];

const ifTrue = (cond, ...body) => [cond, [instr.if, w.blocktype.empty], body, instr.end];

// // [i32] -> [i32, i32]
// const dupI32 = () => {
//   return [
//     [instr.local.tee, localidx.TMP],
//     [instr.local.get, localidx.TMP],
//   ];
// }

const currCharCode = () => [getPos(), [instr.i32.load8_u, w.memarg(ALIGN_1_BYTE, 0)]];

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toWasm = abstract('toWasm');

pexprs.Seq.prototype.toWasm = function (c) {
  return this.factors.map(e => e.toWasm(c));
};

pexprs.Apply.prototype.toWasm = function (c) {
  const idx = c.ruleIdxByName.get(this.ruleName);
  return [instr.call, w.funcidx(idx)];
};

pexprs.Terminal.prototype.toWasm = function (c) {
  // TODO:
  // - proper UTF-8!
  // - deal with hitting the end of input. Maybe use 0xFF?
  // - handle longer terminals with a loop
  return [
    savePos(),
    // Unrolled loop over all characters.
    ...Array.prototype.flatMap.call(this.obj, c => {
      const charCode = c.charCodeAt(0);
      return [
        // Compare next char
        [instr.i32.const, w.i32(charCode)],
        currCharCode(),
        ifTrue(instr.i32.ne, bail()),
        incPos(),
      ];
    }),
    [instr.i32.const, 1]
  ];
};
