'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertProperAssociativity = common.abstract(
  'assertProperAssociativity'
);

pexprs.any.assertProperAssociativity =
pexprs.end.assertProperAssociativity =
pexprs.Terminal.prototype.assertProperAssociativity =
pexprs.Range.prototype.assertProperAssociativity =
pexprs.Param.prototype.assertProperAssociativity =
pexprs.Lex.prototype.assertProperAssociativity =
pexprs.UnicodeChar.prototype.assertProperAssociativity = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertProperAssociativity = function(ruleName) {
  // no-op
};

pexprs.Seq.prototype.assertProperAssociativity = function(ruleName, trueParentName, src) {
  if (this.factors.length < 2) {
    return;
  }
  if (this.factors[0] instanceof pexprs.Apply &&
      this.factors[this.factors.length - 1] instanceof pexprs.Apply) {
    if (this.factors[0].ruleName === this.factors[this.factors.length - 1].ruleName &&
        this.factors[0].ruleName === trueParentName) {
      throw errors.associativityAmbiguousness(trueParentName, src);
    }
  }
};

pexprs.Iter.prototype.assertProperAssociativity = function(ruleName) {
  this.expr.assertProperAssociativity(ruleName);
};

pexprs.Not.prototype.assertProperAssociativity = function(ruleName) {
  // no-op
};

pexprs.Lookahead.prototype.assertProperAssociativity = function(ruleName) {
  this.expr.assertProperAssociativity(ruleName);
};

pexprs.Apply.prototype.assertProperAssociativity = function(ruleName) {
  // no-op
};
