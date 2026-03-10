import {abstract} from './common.js';
import * as errors from './errors.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// v18 (boolean, default false) is passed through to getArity().

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = abstract(
  'assertChoicesHaveUniformArity'
);

pexprs.any.assertChoicesHaveUniformArity =
  pexprs.end.assertChoicesHaveUniformArity =
  pexprs.Terminal.prototype.assertChoicesHaveUniformArity =
  pexprs.Range.prototype.assertChoicesHaveUniformArity =
  pexprs.Param.prototype.assertChoicesHaveUniformArity =
  pexprs.Lex.prototype.assertChoicesHaveUniformArity =
  pexprs.UnicodeChar.prototype.assertChoicesHaveUniformArity =
    function (ruleName, v18 = false) {
      // no-op
    };

pexprs.Alt.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  if (this.terms.length === 0) {
    return;
  }
  const arity = this.terms[0].getArity(v18);
  for (let idx = 0; idx < this.terms.length; idx++) {
    const term = this.terms[idx];
    term.assertChoicesHaveUniformArity(ruleName, v18);
    const otherArity = term.getArity(v18);
    if (arity !== otherArity) {
      throw errors.inconsistentArity(ruleName, arity, otherArity, term);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  const actualArity = this.terms[0].getArity(v18);
  const expectedArity = this.terms[1].getArity(v18);
  if (actualArity !== expectedArity) {
    throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformArity(ruleName, v18);
  }
};

pexprs.Iter.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  this.expr.assertChoicesHaveUniformArity(ruleName, v18);
};

pexprs.Not.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  // no-op (not required b/c the nested expr doesn't show up in the CST)
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  this.expr.assertChoicesHaveUniformArity(ruleName, v18);
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function (ruleName, v18 = false) {
  // The arities of the parameter expressions is required to be 1 by
  // `assertAllApplicationsAreValid()`.
};
