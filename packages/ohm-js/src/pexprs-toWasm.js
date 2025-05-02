import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

import {Codegen} from './wasm.js';

import * as w from '@wasmgroundup/emit';

const cg = new Codegen();

function dbg(x) {
  console.log(x);
  return x;
}

const {instr} = w;

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
    cg.doPushOrigPos(cg.doGetPos()), // origPos = pos
    ...this.terms.flatMap(term => [
      term.toWasm(c),
      cg.doGetRet(),
      [instr.br_if, w.labelidx(0)],
      [cg.doGetOrigPos(), cg.doSetPos()] // pos = origPos
    ]),
    cg.doPopOrigPos()
  ];
};

pexprs.Seq.prototype._toWasm = function (c) {
  return dbg([
    ...this.factors.flatMap(fac => [
      fac.toWasm(c),
      cg.doGetRet(),
      [instr.i32.eqz, instr.br_if, w.labelidx(0)]
    ])
  ]);
};

pexprs.Apply.prototype._toWasm = function (c) {
  const idx = c.ruleIdxByName.get(this.ruleName);
  return [[instr.call, w.funcidx(idx)], cg.doSetRet()];
};

pexprs.Terminal.prototype._toWasm = function (c) {
  // TODO:
  // - proper UTF-8!
  // - deal with hitting the end of input. Maybe use 0xFF?
  // - handle longer terminals with a loop

  const ifTrue = body => [[instr.if, w.blocktype.empty], body, instr.end];
  const doBail = depth => [cg.doSetRet([instr.i32.const, 0]), [instr.br, w.labelidx(depth)]];
  const currCharCodeFrag = [
    cg.doGetPos(),
    [instr.i32.load8_u, w.memarg(Codegen.ALIGN_1_BYTE, 0)]
  ];

  return [
    // Unrolled loop over all characters.
    ...Array.prototype.flatMap.call(this.obj, c => [
      // Compare next char
      [instr.i32.const, w.i32(c.charCodeAt(0))],
      currCharCodeFrag,
      [instr.i32.ne, ifTrue(doBail(1))],
      cg.doIncPos()
    ]),
    cg.doSetRet([instr.i32.const, 1])
  ];
};
