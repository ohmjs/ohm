'use strict';

var inherits = require('inherits');

var Failure = require('../src/Failure');
var Grammar = require('../src/Grammar');
var pexprs = require('../src/pexprs');
var util = require('../src/util');

var globalPredicates = null;

function PExprWithPredicate(name, expr) {
  this.predicateName = name;
  this.expr = expr;
}
inherits(PExprWithPredicate, pexprs.PExpr);

PExprWithPredicate.prototype = {
  // Implementation of the PExpr API

  allowsSkippingPrecedingSpace: function() {
    return false;
  },

  eval: function(state) {
    var actuals = state.currentApplication().args;
    var predicateName = actuals[0].obj;
    var body = actuals[1];

    var origPos = state.inputStream.pos;

    if (state.eval(body)) {
      var node = state._bindings[state._bindings.length - 1];
      var contents = state.inputStream.sourceSlice(origPos, origPos + node.matchLength);
      console.log('evaluating', predicateName, contents);
      var succeeded = globalPredicates[predicateName](contents);
      if (!succeeded) {
        state._bindings.pop();
        state._bindingOffsets.pop();
      }
      return succeeded;
    } else {
      return false;
    }
  },

  generateExample: function(grammar, examples, inSyntacticContext, actuals) {
  },

  getArity: function() {
    return 1;
  },

  substituteParams: function(actuals) {
    /* TODO */
    throw new Error();
    //return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
  },

  toDisplayString: function() {
    return 'withPredicate<' + this.predicateName + ', ' + this.expr.toDisplayString() + '>';
  },

  toFailure: function(grammar) {
    /* TODO
    return new Failure(this, this.obj.toFailure(grammar) + ' (case-insensitive)', 'description');
    */
  },

  _isNullable: function(grammar, memo) {
    return this.expr._isNullable(grammar, memo);
  }
};

exports.matchWithPredicates = function(grammar, input, startApplication, predicates) {
  try {
    globalPredicates = predicates;
    return grammar.match(input, startApplication);
  } finally {
    globalPredicates = null;
  }
};

exports.GrammarWithPredicates = null;

util.awaitBuiltInRules(function(builtInRules) {
  var rules = Object.create(builtInRules.rules);
  rules.withPredicate = {
    body: new PExprWithPredicate(new pexprs.Param(0), new pexprs.Param(1)),
    formals: ['name', 'expr'],
    primitive: true
  };
  exports.GrammarWithPredicates = new Grammar('GrammarWithPredicates', builtInRules, rules);
});
