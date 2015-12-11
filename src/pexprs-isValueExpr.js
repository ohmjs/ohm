'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns `true` if this parsing expression matches an entire value, and `false` if it
  matches a string fragment. The result of this method is cached as a property on the node.
*/
pexprs.PExpr.prototype.isValueExpr = function(grammar, optContext) {
  if (!this.hasOwnProperty('_valueExpr')) {
    var context = optContext || {memo: Object.create(null), applicationStack: []};
    Object.defineProperty(this, '_valueExpr', {
      value: this._isValueExprNoMemo(grammar, context)
    });
  }
  return this._valueExpr;
};

/*
  The actual implementation of isValueExpr, with no memoizing logic. These implementations
  should only be invoked directly by the implementation of isValueExpr above.
*/
pexprs.PExpr.prototype._isValueExprNoMemo = common.abstract;  // function(grammar, context) { ... }

pexprs.any._isValueExprNoMemo =
pexprs.end._isValueExprNoMemo =
pexprs.UnicodeChar.prototype._isValueExprNoMemo = function(grammar, context) {
  return false;
};

pexprs.Range.prototype._isValueExprNoMemo = function(grammar, context) {
  return typeof this.from !== 'string' && typeof this.to !== 'string';
};

pexprs.Arr.prototype._isValueExprNoMemo =
pexprs.Obj.prototype._isValueExprNoMemo =
pexprs.TypeCheck.prototype._isValueExprNoMemo =
pexprs.Value.prototype._isValueExprNoMemo = function(grammar, context) {
  return true;
};

pexprs.Prim.prototype._isValueExprNoMemo = function(grammar, context) {
  return typeof this.obj !== 'string';
};

pexprs.Alt.prototype._isValueExprNoMemo = function(grammar, context) {
  return this.terms.every(function(t) { return t.isValueExpr(grammar, context); });
};

pexprs.Seq.prototype._isValueExprNoMemo = function(grammar, context) {
  return this.factors.every(function(t) { return t.isValueExpr(grammar, context); });
};

pexprs.Iter.prototype._isValueExprNoMemo =
pexprs.Not.prototype._isValueExprNoMemo =
pexprs.Lookahead.prototype._isValueExprNoMemo =
pexprs.Lex.prototype._isValueExprNoMemo = function(grammar, context) {
  return this.expr.isValueExpr(grammar, context);
};

pexprs.Param.prototype._isValueExprNoMemo = function(grammar, context) {
  throw new Error('Cannot calculate _isValueExprNoMemo for unbound parameter');
};

pexprs.Apply.prototype._isValueExprNoMemo = function(grammar, context) {
  var caller = context.applicationStack[context.applicationStack.length - 1];
  var app = this.substituteParams(caller ? caller.params : []);

  var memo = context.memo;
  var key = app.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var inlinedBody = grammar.ruleBodies[app.ruleName].substituteParams(app.params);

    // Initialize a memo value to prevent infinite recursion for recursive rules.
    // Use `true` because it is the identity of logical 'and' operator, ensuring that a rule
    // like 'x = x | String' will return `true`.
    memo[key] = true;

    context.applicationStack.push(app);
    memo[key] = inlinedBody.isValueExpr(grammar, context);
    context.applicationStack.pop();
  }
  return memo[key];
};
