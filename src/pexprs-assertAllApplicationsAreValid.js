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

pexprs.anything.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.end.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Prim.prototype.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Param.prototype.assertAllApplicationsAreValid = function(grammar) {
  // no-op
};

pexprs.Alt.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Seq.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Many.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Opt.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Not.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Lookahead.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Arr.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Str.prototype.assertAllApplicationsAreValid = function(grammar) {
  this.expr.assertAllApplicationsAreValid(grammar);
};

pexprs.Obj.prototype.assertAllApplicationsAreValid = function(grammar) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertAllApplicationsAreValid(grammar);
  }
};

pexprs.Apply.prototype.assertAllApplicationsAreValid = function(grammar) {
  var body = grammar.ruleDict[this.ruleName];

  // Make sure that the rule exists
  if (!body) {
    throw new errors.UndeclaredRule(this.ruleName, grammar.name);
  }

  // ... and that this application has the correct number of parameters
  var actual = this.params.length;
  var expected = body.formals.length;
  if (actual !== expected) {
    throw new errors.WrongNumberOfParameters(this.ruleName, expected, actual);
  }

  // ... and that all of the parameter expressions have arity 1
  var self = this;
  this.params.forEach(function(param) {
    if (param.getArity() !== 1) {
      throw new errors.InvalidParameter(self.ruleName, param);
    }
  });
};
