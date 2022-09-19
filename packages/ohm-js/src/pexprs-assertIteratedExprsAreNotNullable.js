import {abstract} from './common.js';
import * as errors from './errors.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = abstract(
  'assertIteratedExprsAreNotNullable'
);

pexprs.any.assertIteratedExprsAreNotNullable =
  pexprs.end.assertIteratedExprsAreNotNullable =
  pexprs.Terminal.prototype.assertIteratedExprsAreNotNullable =
  pexprs.Range.prototype.assertIteratedExprsAreNotNullable =
  pexprs.Param.prototype.assertIteratedExprsAreNotNullable =
  pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable =
    function (grammar) {
      // no-op
    };

pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar);
  }
};

pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar);
  }
};

pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
  // Note: this is the implementation of this method for `Star` and `Plus` expressions.
  // It is overridden for `Opt` below.
  this.expr.assertIteratedExprsAreNotNullable(grammar);
  if (this.expr.isNullable(grammar)) {
    throw errors.kleeneExprHasNullableOperand(this, []);
  }
};

pexprs.Opt.prototype.assertIteratedExprsAreNotNullable =
  pexprs.Not.prototype.assertIteratedExprsAreNotNullable =
  pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable =
  pexprs.Lex.prototype.assertIteratedExprsAreNotNullable =
    function (grammar) {
      this.expr.assertIteratedExprsAreNotNullable(grammar);
    };

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
  this.args.forEach(arg => {
    arg.assertIteratedExprsAreNotNullable(grammar);
  });
};
