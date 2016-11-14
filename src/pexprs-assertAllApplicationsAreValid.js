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

var inLexifiedStackContext = [];

pexprs.PExpr.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  inLexifiedStackContext = [];
  inLexifiedStackContext.push(!common.isSyntactic(ruleName));
  this._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.PExpr.prototype._assertAllApplicationsAreValid = common.abstract(
    '_assertAllApplicationsAreValid'
);

pexprs.any._assertAllApplicationsAreValid =
    pexprs.end._assertAllApplicationsAreValid =
        pexprs.Terminal.prototype._assertAllApplicationsAreValid =
            pexprs.Range.prototype._assertAllApplicationsAreValid =
                pexprs.Param.prototype._assertAllApplicationsAreValid =
                    pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
                      // no-op
                    };

pexprs.Syn.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  inLexifiedStackContext.push(false);
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
  inLexifiedStackContext.pop();
};

pexprs.Lex.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  inLexifiedStackContext.push(true);
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
  inLexifiedStackContext.pop();
};

pexprs.Alt.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    inLexifiedStackContext.push(inLexifiedStackContext[inLexifiedStackContext.length-1]);
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
    inLexifiedStackContext.pop();
  }
};

pexprs.Seq.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    inLexifiedStackContext.push(inLexifiedStackContext[inLexifiedStackContext.length-1]);
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
    inLexifiedStackContext.pop();
  }
};

pexprs.Iter.prototype._assertAllApplicationsAreValid =
    pexprs.Not.prototype._assertAllApplicationsAreValid =
        pexprs.Lookahead.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
          inLexifiedStackContext.push(inLexifiedStackContext[inLexifiedStackContext.length-1]);
          this.expr._assertAllApplicationsAreValid(ruleName, grammar);
          inLexifiedStackContext.pop();
        };

pexprs.Apply.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  var ruleInfo = grammar.rules[this.ruleName];

  // Make sure that the rule exists...
  if (!ruleInfo) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
  }

  var isMeLexifiedContext = inLexifiedStackContext[inLexifiedStackContext.length - 1];
  var isParLexifiedContext = inLexifiedStackContext[inLexifiedStackContext.length - 2];
  // ...and that this application is allowed
  if ((common.isSyntactic(this.ruleName) && isMeLexifiedContext) && (!common.isSyntactic(ruleName) || isParLexifiedContext)) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }

  // ...and that this application has the correct number of arguments
  var actual = this.args.length;
  var expected = ruleInfo.formals.length;
  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
  }

  // ...and that all of the argument expressions only have valid applications and have arity 1.
  var self = this;
  this.args.forEach(function(arg) {
    arg._assertAllApplicationsAreValid(ruleName, grammar);
    if (arg.getArity() !== 1) {
      throw errors.invalidParameter(self.ruleName, arg);
    }
  });
};
