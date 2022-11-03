import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = abstract('getArity');

pexprs.any.getArity =
  pexprs.end.getArity =
  pexprs.Terminal.prototype.getArity =
  pexprs.Range.prototype.getArity =
  pexprs.Param.prototype.getArity =
  pexprs.Apply.prototype.getArity =
  pexprs.UnicodeChar.prototype.getArity =
    function() {
      return 1;
    };

pexprs.Alt.prototype.getArity = function() {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};

pexprs.Seq.prototype.getArity = function() {
  let arity = 0;
  for (let idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }
  return arity;
};

pexprs.Iter.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Not.prototype.getArity = function() {
  return 0;
};

pexprs.Lookahead.prototype.getArity = pexprs.Lex.prototype.getArity = function() {
  return this.expr.getArity();
};
