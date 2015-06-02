'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.addRulesThatNeedSemanticAction = common.abstract;

pexprs.anything.addRulesThatNeedSemanticAction =
pexprs.end.addRulesThatNeedSemanticAction =
pexprs.Prim.prototype.addRulesThatNeedSemanticAction =
pexprs.Param.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return false;
};

pexprs.Alt.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.terms.some(
      function(term) { return term.addRulesThatNeedSemanticAction(dict, valueRequired); });
};

pexprs.Seq.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.factors.some(
      function(factor) { return factor.addRulesThatNeedSemanticAction(dict, valueRequired); });
};

pexprs.Star.prototype.addRulesThatNeedSemanticAction =
pexprs.Plus.prototype.addRulesThatNeedSemanticAction =
pexprs.Opt.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Not.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, false);
};

pexprs.Lookahead.prototype.addRulesThatNeedSemanticAction =
pexprs.Arr.prototype.addRulesThatNeedSemanticAction =
pexprs.Str.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Obj.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.properties.some(
      function(property) {
        return property.pattern.addRulesThatNeedSemanticAction(dict, valueRequired);
      });
};

pexprs.Apply.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  if (!valueRequired || dict[this.ruleName]) {
    return false;
  } else {
    dict[this.ruleName] = true;
    return true;
  }
};

