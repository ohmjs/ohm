import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// In v18, iteration expressions (*, +, ?) always have arity 1.
// In v17, they have the same arity as their inner expression.

pexprs.PExpr.prototype.getArity = abstract('getArity');

pexprs.any.getArity =
  pexprs.end.getArity =
  pexprs.Terminal.prototype.getArity =
  pexprs.Range.prototype.getArity =
  pexprs.Param.prototype.getArity =
  pexprs.Apply.prototype.getArity =
  pexprs.UnicodeChar.prototype.getArity =
    function (v18 = false) {
      return 1;
    };

pexprs.Alt.prototype.getArity = function (v18 = false) {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity(v18);
};

pexprs.Seq.prototype.getArity = function (v18 = false) {
  let arity = 0;
  for (let idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity(v18);
  }
  return arity;
};

pexprs.Iter.prototype.getArity = function (v18 = false) {
  if (v18) {
    return 1;
  }
  return this.expr.getArity(v18);
};

pexprs.Not.prototype.getArity = function (v18 = false) {
  return 0;
};

pexprs.Lookahead.prototype.getArity = pexprs.Lex.prototype.getArity = function (v18 = false) {
  return this.expr.getArity(v18);
};
