'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');
var errors = require('./errors');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertAllApplicationsAreValid = common.abstract;

pexprs.anything.assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.end.assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Prim.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Range.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Param.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Alt.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype.assertAllApplicationsAreValid =
pexprs.Not.prototype.assertAllApplicationsAreValid =
pexprs.Lookahead.prototype.assertAllApplicationsAreValid =
pexprs.Arr.prototype.assertAllApplicationsAreValid =
pexprs.Str.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  this.expr.assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.Obj.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Apply.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  var body = grammar.ruleDict[this.ruleName];

  // Make sure that the rule exists
  if (!body) {
    throw new errors.UndeclaredRule(this.ruleName, grammar.name, this);
  }

  // ... and that this application is allowed
  if (!common.isSyntactic(ruleName) && common.isSyntactic(this.ruleName)) {
    throw new errors.ApplicationOfSyntacticRuleFromLexicalRule(ruleName, this.ruleName, this);
  }

  // ... and that this application has the correct number of parameters
  var actual = this.params.length;
  var expected = body.formals.length;
  if (actual !== expected) {
    throw new errors.WrongNumberOfParameters(this.ruleName, expected, actual, this);
  }

  // ... and that all of the parameter expressions only have valid applications and have arity 1
  var self = this;
  this.params.forEach(function(param) {
    param.assertAllApplicationsAreValid(ruleName, grammar);
    if (param.getArity() !== 1) {
      throw new errors.InvalidParameter(self.ruleName, param);
    }
  });
};
