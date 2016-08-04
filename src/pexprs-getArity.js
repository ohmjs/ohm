'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var PExpr = require('./pexprs').PExpr;
var pexprVisitors = require('./pexpr-visitors');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

var actions = {
  Alt: function(terms) {
    // This is ok b/c all terms must have the same arity -- this property is
    // checked by the Grammar constructor.
    return terms.length === 0 ? 0 : terms[0].getArity();
  },
  Apply: function(args) {
    return 1;
  },
  Iter: function(expr) {
    return expr.getArity();
  },
  Not: function(expr) {
    return 0;
  },
  Seq: function(factors) {
    var arity = 0;
    for (var idx = 0; idx < factors.length; idx++) {
      arity += factors[idx].getArity();
    }
    return arity;
  }
};

actions.Extend = actions.Alt;

actions.Lookahead =
actions.Lex =
actions.Opt =
actions.Plus =
actions.Star = function(expr) {
  return expr.getArity();
};

actions.any =
actions.end =
actions.Terminal =
actions.Range =
actions.Param =
actions.UnicodeChar = function() {
  return 1;
};

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprVisitors.addOperation('getArity()', actions);

// For now, install getArity as a regular method on PExpr, so that other code
// does not need to be aware of pexprVisitors.
PExpr.prototype.getArity = function() {
  return pexprVisitors.wrap(this).getArity();
};
