import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

import * as w from '@wasmgroundup/emit';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toWasm = abstract('toWasm');

pexprs.Seq.prototype.toWasm = function(c) {
  return this.factors.map(e => e.toWasm(c));
};

pexprs.Apply.prototype.toWasm = function(c) {
  const idx = c.ruleIdxByName.get(this.ruleName);
  return [w.instr.call, w.funcidx(idx)];
};

pexprs.Terminal.prototype.toWasm = function(c) {
  return [];
};
