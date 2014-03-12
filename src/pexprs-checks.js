// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js')
var pexprs = require('./pexprs.js')

var awlib = require('awlib')
var equals = awlib.equals.equals

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertNoDuplicateBindings = common.abstract
pexprs.PExpr.prototype.assertChoicesHaveUniformBindings = common.abstract

pexprs.anything.assertNoDuplicateBindings = function(ruleName) {}
pexprs.anything.assertChoicesHaveUniformBindings = function(ruleName) {}

pexprs.Prim.prototype.assertNoDuplicateBindings = function(ruleName) {}
pexprs.Prim.prototype.assertChoicesHaveUniformBindings = function(ruleName) {}

pexprs.Alt.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++)
    this.terms[idx].assertNoDuplicateBindings(ruleName)
}
pexprs.Alt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  if (this.terms.length === 0)
    return
  var names = this.terms[0].getBindingNames()
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx]
    term.assertChoicesHaveUniformBindings()
    var otherNames = term.getBindingNames()
    if (!equals(names, otherNames))
      browser.error('rule', ruleName, 'has an alt with inconsistent bindings:', names, 'vs', otherNames)
  }
}

pexprs.Seq.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++)
    this.factors[idx].assertNoDuplicateBindings(ruleName)

  var duplicates = common.getDuplicates(this.getBindingNames())
  if (duplicates.length > 0)
    browser.error('rule', ruleName, 'has duplicate bindings:', duplicates)
}
pexprs.Seq.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++)
    this.factors[idx].assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Bind.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.Bind.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Many.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.Many.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Opt.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.Opt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Not.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.Not.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Lookahead.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.Lookahead.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Str.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.Str.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.List.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}
pexprs.List.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Obj.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++)
    this.properties[idx].pattern.assertNoDuplicateBindings(ruleName)

  var duplicates = common.getDuplicates(this.getBindingNames())
  if (duplicates.length > 0)
    browser.error('rule', ruleName, 'has an object pattern with duplicate bindings:', duplicates)
}
pexprs.Obj.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++)
    this.properties[idx].pattern.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Apply.prototype.assertNoDuplicateBindings = function(ruleName) {}
pexprs.Apply.prototype.assertChoicesHaveUniformBindings = function(ruleName) {}

pexprs.Expand.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expansion().assertNoDuplicateBindings(ruleName)
}
pexprs.Expand.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expansion().assertChoicesHaveUniformBindings(ruleName)
}

