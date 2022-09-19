import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns `true` if this parsing expression may accept without consuming any input.
pexprs.PExpr.prototype.isNullable = function (grammar) {
  return this._isNullable(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isNullable = abstract('_isNullable');

pexprs.any._isNullable =
  pexprs.Range.prototype._isNullable =
  pexprs.Param.prototype._isNullable =
  pexprs.Plus.prototype._isNullable =
  pexprs.UnicodeChar.prototype._isNullable =
    function (grammar, memo) {
      return false;
    };

pexprs.end._isNullable = function (grammar, memo) {
  return true;
};

pexprs.Terminal.prototype._isNullable = function (grammar, memo) {
  if (typeof this.obj === 'string') {
    // This is an over-simplification: it's only correct if the input is a string. If it's an array
    // or an object, then the empty string parsing expression is not nullable.
    return this.obj === '';
  } else {
    return false;
  }
};

pexprs.Alt.prototype._isNullable = function (grammar, memo) {
  return this.terms.length === 0 || this.terms.some(term => term._isNullable(grammar, memo));
};

pexprs.Seq.prototype._isNullable = function (grammar, memo) {
  return this.factors.every(factor => factor._isNullable(grammar, memo));
};

pexprs.Star.prototype._isNullable =
  pexprs.Opt.prototype._isNullable =
  pexprs.Not.prototype._isNullable =
  pexprs.Lookahead.prototype._isNullable =
    function (grammar, memo) {
      return true;
    };

pexprs.Lex.prototype._isNullable = function (grammar, memo) {
  return this.expr._isNullable(grammar, memo);
};

pexprs.Apply.prototype._isNullable = function (grammar, memo) {
  const key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    const {body} = grammar.rules[this.ruleName];
    const inlined = body.substituteParams(this.args);
    memo[key] = false; // Prevent infinite recursion for recursive rules.
    memo[key] = inlined._isNullable(grammar, memo);
  }
  return memo[key];
};
