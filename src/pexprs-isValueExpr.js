'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns `true` if this parsing expression matches an entire value, and `false` if it
// matches a string fragment.
pexprs.PExpr.prototype.isValueExpr = function(grammar) {
  return this._isValueExpr(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isValueExpr = common.abstract;

pexprs.any._isValueExpr =
pexprs.end._isValueExpr =
pexprs.UnicodeChar.prototype._isValueExpr = function(grammar, memo) {
  return false;
};

pexprs.Range.prototype._isValueExpr = function(grammar, memo) {
  return typeof this.from !== 'string' && typeof this.to !== 'string';
};

pexprs.Arr.prototype._isValueExprNoMemo =
pexprs.Obj.prototype._isValueExprNoMemo =
pexprs.Value.prototype._isValueExprNoMemo = function(grammar, context) {
  return true;
};

pexprs.Prim.prototype._isValueExpr = function(grammar, memo) {
  return typeof this.obj !== 'string';
};

pexprs.Alt.prototype._isValueExpr = function(grammar, memo) {
  return this.terms.every(function(t) { return t._isValueExpr(grammar, memo); });
};

pexprs.Seq.prototype._isValueExpr = function(grammar, memo) {
  return this.factors.every(function(t) { return t._isValueExpr(grammar, memo); });
};

pexprs.Iter.prototype._isValueExpr =
pexprs.Not.prototype._isValueExpr =
pexprs.Lookahead.prototype._isValueExpr =
pexprs.Lex.prototype._isValueExpr = function(grammar, memo) {
  return this.expr._isValueExpr(grammar, memo);
};

pexprs.Apply.prototype._isValueExpr = function(grammar, memo) {
  var key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var body = grammar.ruleBodies[this.ruleName];
    var inlined = body.substituteParams(this.params);

    // Initialize a memo value to prevent infinite recursion for recursive rules.
    // Use `true` because it is the identity of logical 'and' operator, ensuring that a rule
    // like 'x = x | String' will return `true`.
    memo[key] = true;

    memo[key] = inlined._isValueExpr(grammar, memo);
  }
  return memo[key];
};
