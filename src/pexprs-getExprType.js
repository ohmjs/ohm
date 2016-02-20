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

function typeFromPrimitive(prim) {
  return typeof prim === 'string' ? pexprs.TYPE_STRING : pexprs.TYPE_VALUE;
}

/*
  Returns the type of this PExpr -- one of `TYPE_STRING`, `TYPE_VALUE`, or `TYPE_ANY`.
  String expressions (e.g. `"foo"`) and value expressions (e.g., `null`, `3`) cannot be combined
  with each other, but they may be combined with TYPE_ANY expressions. An exception is thrown if
  an expression with inconsistent types is encountered.

  The result of this method is cached as a property on the node. For rule applications, the
  result is cached in a separate memo table, so that the result can be shared for all `Apply`
  nodes having the same parameters.
*/
pexprs.PExpr.prototype.getExprType = function(grammar, optMemo) {
  if (!this.hasOwnProperty('_exprType')) {
    var memo = optMemo || Object.create(null);
    Object.defineProperty(this, '_exprType', {
      value: this._calculateExprType(grammar, memo)
    });
  }
  return this._exprType;
};

/*
  The actual implementation of getExprType, with no caching logic. These implementations
  should only be invoked directly by the implementation of getExprType above.
*/
pexprs.PExpr.prototype._calculateExprType = common.abstract;

pexprs.any._calculateExprType =
pexprs.UnicodeChar.prototype._calculateExprType = function(grammar, memo) {
  return pexprs.TYPE_STRING;
};

pexprs.end._calculateExprType = function(grammar, memo) {
  return pexprs.TYPE_ANY;
};

pexprs.Range.prototype._calculateExprType = function(grammar, memo) {
  return typeFromPrimitive(this.from) | typeFromPrimitive(this.to);
};

pexprs.Arr.prototype._calculateExprType =
pexprs.Obj.prototype._calculateExprType =
pexprs.TypeCheck.prototype._calculateExprType =
pexprs.Value.prototype._calculateExprType = function(grammar, memo) {
  return pexprs.TYPE_VALUE;
};

pexprs.Prim.prototype._calculateExprType = function(grammar, memo) {
  return typeFromPrimitive(this.obj);
};

pexprs.Alt.prototype._calculateExprType = function(grammar, memo) {
  var ans = this.terms.reduce(function(acc, t) {
    return acc | t.getExprType(grammar, memo);
  }, 0);
  if (ans === pexprs.TYPE_INCONSISTENT) {
    throw errors.exprMixesValueAndStringExpressions(this);
  }
  return ans;
};

pexprs.Seq.prototype._calculateExprType = function(grammar, memo) {
  var ans = this.factors.reduce(function(acc, f) {
    return acc | f.getExprType(grammar, memo);
  }, 0);
  if (ans === pexprs.TYPE_INCONSISTENT) {
    throw errors.exprMixesValueAndStringExpressions(this);
  }
  return ans;
};

pexprs.Iter.prototype._calculateExprType =
pexprs.Not.prototype._calculateExprType =
pexprs.Lookahead.prototype._calculateExprType =
pexprs.Lex.prototype._calculateExprType = function(grammar, memo) {
  return this.expr.getExprType(grammar, memo);
};

pexprs.Param.prototype._calculateExprType = function(grammar, memo) {
  // Throwing an error here ensures that we never calculate and cache the result of an
  // expression containing unbound parameters, because it could be incorrect.
  throw new Error('Cannot calculate _calculateExprType for unbound parameter');
};

pexprs.Apply.prototype._calculateExprType = function(grammar, memo) {
  var key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var inlinedBody = grammar.ruleBodies[this.ruleName].substituteParams(this.args);

    // Initialize a memo value to prevent infinite recursion for recursive rules.
    // Use TYPE_ANY because it is the identity of the bitwise 'or' operator, ensuring that a rule
    // like 'x = x | String' will return `TYPE_STRING`.
    memo[key] = pexprs.TYPE_ANY;

    memo[key] = inlinedBody.getExprType(grammar, memo);
  }
  return memo[key];
};
