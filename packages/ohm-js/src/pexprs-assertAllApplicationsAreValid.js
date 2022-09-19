import {abstract, isSyntactic} from './common.js';
import * as errors from './errors.js';
import * as pexprs from './pexprs-main.js';
import * as util from './util.js';

let BuiltInRules;

util.awaitBuiltInRules(g => {
  BuiltInRules = g;
});

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

let lexifyCount;

pexprs.PExpr.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  lexifyCount = 0;
  this._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.PExpr.prototype._assertAllApplicationsAreValid = abstract(
    '_assertAllApplicationsAreValid',
);

pexprs.any._assertAllApplicationsAreValid =
  pexprs.end._assertAllApplicationsAreValid =
  pexprs.Terminal.prototype._assertAllApplicationsAreValid =
  pexprs.Range.prototype._assertAllApplicationsAreValid =
  pexprs.Param.prototype._assertAllApplicationsAreValid =
  pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid =
    function(ruleName, grammar) {
      // no-op
    };

pexprs.Lex.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  lexifyCount++;
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
  lexifyCount--;
};

pexprs.Alt.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (let idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (let idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype._assertAllApplicationsAreValid =
  pexprs.Not.prototype._assertAllApplicationsAreValid =
  pexprs.Lookahead.prototype._assertAllApplicationsAreValid =
    function(ruleName, grammar) {
      this.expr._assertAllApplicationsAreValid(ruleName, grammar);
    };

pexprs.Apply.prototype._assertAllApplicationsAreValid = function(
    ruleName,
    grammar,
    skipSyntacticCheck = false,
) {
  const ruleInfo = grammar.rules[this.ruleName];
  const isContextSyntactic = isSyntactic(ruleName) && lexifyCount === 0;

  // Make sure that the rule exists...
  if (!ruleInfo) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
  }

  // ...and that this application is allowed
  if (!skipSyntacticCheck && isSyntactic(this.ruleName) && !isContextSyntactic) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }

  // ...and that this application has the correct number of arguments.
  const actual = this.args.length;
  const expected = ruleInfo.formals.length;
  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
  }

  const isBuiltInApplySyntactic =
    BuiltInRules && ruleInfo === BuiltInRules.rules.applySyntactic;
  const isBuiltInCaseInsensitive =
    BuiltInRules && ruleInfo === BuiltInRules.rules.caseInsensitive;

  // If it's an application of 'caseInsensitive', ensure that the argument is a Terminal.
  if (isBuiltInCaseInsensitive) {
    if (!(this.args[0] instanceof pexprs.Terminal)) {
      throw errors.incorrectArgumentType('a Terminal (e.g. "abc")', this.args[0]);
    }
  }

  if (isBuiltInApplySyntactic) {
    const arg = this.args[0];
    if (!(arg instanceof pexprs.Apply)) {
      throw errors.incorrectArgumentType('a syntactic rule application', arg);
    }
    if (!isSyntactic(arg.ruleName)) {
      throw errors.applySyntacticWithLexicalRuleApplication(arg);
    }
    if (isContextSyntactic) {
      throw errors.unnecessaryExperimentalApplySyntactic(this);
    }
  }

  // ...and that all of the argument expressions only have valid applications and have arity 1.
  // If `this` is an application of the built-in applySyntactic rule, then its arg is
  // allowed (and expected) to be a syntactic rule, even if we're in a lexical context.
  this.args.forEach(arg => {
    arg._assertAllApplicationsAreValid(ruleName, grammar, isBuiltInApplySyntactic);
    if (arg.getArity() !== 1) {
      throw errors.invalidParameter(this.ruleName, arg);
    }
  });
};
