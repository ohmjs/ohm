import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Called at grammar creation time to rewrite a rule body, replacing each reference to a formal
  parameter with a `Param` node. Returns a PExpr -- either a new one, or the original one if
  it was modified in place.
*/
pexprs.PExpr.prototype.introduceParams = abstract('introduceParams');

pexprs.any.introduceParams =
  pexprs.end.introduceParams =
  pexprs.Terminal.prototype.introduceParams =
  pexprs.Range.prototype.introduceParams =
  pexprs.Param.prototype.introduceParams =
  pexprs.UnicodeChar.prototype.introduceParams =
    function(formals) {
      return this;
    };

pexprs.Alt.prototype.introduceParams = function(formals) {
  this.terms.forEach((term, idx, terms) => {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};

pexprs.Seq.prototype.introduceParams = function(formals) {
  this.factors.forEach((factor, idx, factors) => {
    factors[idx] = factor.introduceParams(formals);
  });
  return this;
};

pexprs.Iter.prototype.introduceParams =
  pexprs.Not.prototype.introduceParams =
  pexprs.Lookahead.prototype.introduceParams =
  pexprs.Lex.prototype.introduceParams =
    function(formals) {
      this.expr = this.expr.introduceParams(formals);
      return this;
    };

pexprs.Apply.prototype.introduceParams = function(formals) {
  const index = formals.indexOf(this.ruleName);
  if (index >= 0) {
    if (this.args.length > 0) {
      // TODO: Should this be supported? See issue #64.
      throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
    }
    return new pexprs.Param(index).withSource(this.source);
  } else {
    this.args.forEach((arg, idx, args) => {
      args[idx] = arg.introduceParams(formals);
    });
    return this;
  }
};
