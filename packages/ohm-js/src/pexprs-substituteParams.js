import {abstract, checkNotNull} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a PExpr that results from recursively replacing every formal parameter (i.e., instance
  of `Param`) inside this PExpr with its actual value from `actuals` (an Array).

  The receiver must not be modified; a new PExpr must be returned if any replacement is necessary.
*/
// function(actuals) { ... }
pexprs.PExpr.prototype.substituteParams = abstract('substituteParams');

pexprs.any.substituteParams =
  pexprs.end.substituteParams =
  pexprs.Terminal.prototype.substituteParams =
  pexprs.Range.prototype.substituteParams =
  pexprs.UnicodeChar.prototype.substituteParams =
    function (actuals) {
      return this;
    };

pexprs.Param.prototype.substituteParams = function (actuals) {
  return checkNotNull(actuals[this.index]);
};

pexprs.Alt.prototype.substituteParams = function (actuals) {
  return new pexprs.Alt(this.terms.map(term => term.substituteParams(actuals)));
};

pexprs.Seq.prototype.substituteParams = function (actuals) {
  return new pexprs.Seq(this.factors.map(factor => factor.substituteParams(actuals)));
};

pexprs.Iter.prototype.substituteParams =
  pexprs.Not.prototype.substituteParams =
  pexprs.Lookahead.prototype.substituteParams =
  pexprs.Lex.prototype.substituteParams =
    function (actuals) {
      return new this.constructor(this.expr.substituteParams(actuals));
    };

pexprs.Apply.prototype.substituteParams = function (actuals) {
  if (this.args.length === 0) {
    // Avoid making a copy of this application, as an optimization
    return this;
  } else {
    const args = this.args.map(arg => arg.substituteParams(actuals));
    return new pexprs.Apply(this.ruleName, args);
  }
};
