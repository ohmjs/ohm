// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');

var awlib = require('awlib');
var browser = awlib.browser;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertNoDuplicateBindings = common.abstract;

pexprs.anything.assertNoDuplicateBindings = function(ruleName) {};

pexprs.Prim.prototype.assertNoDuplicateBindings = function(ruleName) {};

pexprs.Alt.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertNoDuplicateBindings(ruleName);
  }
};

pexprs.Seq.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertNoDuplicateBindings(ruleName);
  }

  var duplicates = common.getDuplicates(this.getBindingNames());
  if (duplicates.length > 0) {
    browser.error('rule', ruleName, 'has duplicate bindings:', duplicates);
  }
};

pexprs.Bind.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Many.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Opt.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Not.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Lookahead.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Str.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.List.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Obj.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertNoDuplicateBindings(ruleName);
  }

  var duplicates = common.getDuplicates(this.getBindingNames());
  if (duplicates.length > 0) {
    browser.error('rule', ruleName, 'has an object pattern with duplicate bindings:', duplicates);
  }
};

pexprs.Apply.prototype.assertNoDuplicateBindings = function(ruleName) {};

pexprs.Expand.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expansion().assertNoDuplicateBindings(ruleName);
};

