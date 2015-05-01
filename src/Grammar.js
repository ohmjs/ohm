'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream');
var Interval = require('./Interval');
var Semantics = require('./Semantics');
var State = require('./State');
var attributes = require('./attributes');
var common = require('./common');
var errors = require('./errors');
var nodes = require('./nodes');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(name, superGrammar, ruleDict) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.ruleDict = ruleDict;
  this.constructors = this.ctors = this.createConstructors();
}

Grammar.prototype = {
  construct: function(ruleName, children) {
    var body = this.ruleDict[ruleName];
    if (!body || !body.check(this, children) || children.length !== body.getArity()) {
      throw new errors.InvalidConstructorCall(this, ruleName, children);
    }
    var interval = new Interval(InputStream.newFor(children), 0, children.length);
    return new nodes.Node(this, ruleName, children, interval);
  },

  createConstructors: function() {
    var self = this;
    var constructors = {};

    function makeConstructor(ruleName) {
      return function(/* val1, val2, ... */) {
        return self.construct(ruleName, Array.prototype.slice.call(arguments));
      };
    }

    for (var ruleName in this.ruleDict) {
      // We want *all* properties, not just own properties, because of
      // supergrammars.
      constructors[ruleName] = makeConstructor(ruleName);
    }
    return constructors;
  },

  match: function(obj, startRule, optThrowOnFail) {
    var throwOnFail = !!optThrowOnFail;
    if (!startRule) {
      throw new TypeError("'startRule' argument cannot be null or undefined");
    }
    var state = this._match(obj, startRule, false);
    var succeeded = state.bindings.length === 1;
    if (succeeded) {
      return state.bindings[0];  // Return the root CSTNode.
    } else if (throwOnFail) {
      throw new errors.MatchFailure(state);
    } else {
      return false;
    }
  },

  _match: function(obj, startRule, tracingEnabled) {
    var inputStream = InputStream.newFor(typeof obj === 'string' ? obj : [obj]);
    var state = new State(this, inputStream, startRule, tracingEnabled);
    var succeeded = new pexprs.Apply(startRule).eval(state);
    if (succeeded) {
      // Link every CSTNode to its parent.
      var node = state.bindings[0];
      var stack = [undefined];
      var helpers = this.semantics().addOperation('setParents', {
        _terminal: function() {
          this.node.parent = stack[stack.length - 1];
        },
        _default: function(children) {
          stack.push(this.node);
          children.forEach(function(child) { child.setParents(); });
          stack.pop();
          this.node.parent = stack[stack.length - 1];
        }
      });
      helpers(node).setParents();
    }
    return state;
  },

  trace: function(obj, startRule) {
    return this._match(obj, startRule, true);
  },

  semanticAction: function(actionDict) {
    this._assertTopDownActionNamesAndAritiesMatch(actionDict, true);
    return attributes.makeSemanticAction(this, actionDict);
  },

  semantics: function(optSuperSemantics) {
    return Semantics.createSemantics(this, optSuperSemantics);
  },

  synthesizedAttribute: function(actionDict) {
    this._assertTopDownActionNamesAndAritiesMatch(actionDict, true);
    return attributes.makeSynthesizedAttribute(this, actionDict);
  },

  inheritedAttribute: function(actionDict) {
    // TODO: write an arity-checker for inherited attributes.
    // All of the methods should have arity 1, except for _default, which has
    // arity 2 b/c it also takes an index.
    if (!actionDict._base) {
      throw new Error('inherited attribute missing base case');
    } else if (actionDict._base.length !== 1) {
      throw new Error("inherited attribute's base case must take exactly one argument");
    }
    return attributes.makeInheritedAttribute(this, actionDict);
  },

  // Check that every semantic action in `actionDict` has the correct arity.
  // If not, throw an exception.
  // TODO: Get rid of `tempIgnoreSpecialActions` once everything is moved over
  // to new-style semantic actions.
  _assertTopDownActionNamesAndAritiesMatch: function(actionDict, tempIgnoreSpecialActions) {
    var self = this;
    var ruleDict = this.ruleDict;
    var keysToCheck = [];
    for (var k in ruleDict) {
      keysToCheck.push(k);
    }
    // TODO: Remove this check when everything is converted to new-style semantics.
    if (!tempIgnoreSpecialActions) {
      keysToCheck.push('_many', '_terminal', '_default');
    }
    var ok = keysToCheck.every(function(k) {
      if (k in actionDict) {
        var actual = actionDict[k].length;
        var expected = self._topDownActionArity(k);
        if (actual !== expected) {
          /* eslint-disable no-console */
          console.log("Semantic action '" + k + "' has the wrong arity: " +
                      'expected ' + expected + ', got ' + actual);
          /* eslint-enable no-console */
          return false;
        }
      }
      return true;
    });
    if (!ok) {
      throw new Error(
        'one or more semantic actions have the wrong arity -- see console for details'
      );
    }
  },

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_many' or '_default'.
  _topDownActionArity: function(actionName) {
    if (actionName === '_many' || actionName === '_default') {
      return 1;
    } else if (actionName === '_terminal') {
      return 0;
    }
    return this.ruleDict[actionName].getArity();
  },

  toRecipe: function(optVarName) {
    var sb = new common.StringBuffer();
    if (optVarName) {
      sb.append('var ' + optVarName + ' = ');
    }
    sb.append('(function() {\n');

    var superGrammarDecl = '';
    if (this.superGrammar && this.superGrammar !== Grammar.BuiltInRules) {
      sb.append(this.superGrammar.toRecipe('buildSuperGrammar'));
      superGrammarDecl = '    .withSuperGrammar(buildSuperGrammar.call(this))\n';
    }
    sb.append('  return new this.newGrammar(' + common.toStringLiteral(this.name) + ')\n');
    sb.append(superGrammarDecl);

    var self = this;
    Object.keys(this.ruleDict).forEach(function(ruleName) {
      var body = self.ruleDict[ruleName];
      sb.append('    .');
      if (self.superGrammar && self.superGrammar.ruleDict[ruleName]) {
        sb.append(body instanceof pexprs.Extend ? 'extend' : 'override');
      } else {
        sb.append('define');
      }
      var formals = '[' + body.formals.map(common.toStringLiteral).join(', ') + ']';
      sb.append('(' + common.toStringLiteral(ruleName) + ', ' + formals + ', ');
      body.outputRecipe(sb, body.formals);
      if (body.description) {
        sb.append(', ' + common.toStringLiteral(body.description));
      }
      sb.append(')\n');
    });
    sb.append('    .build();\n});\n');
    return sb.contents();
  },

  // TODO: make sure this is still correct.
  // TODO: the analog of this method for inherited attributes.
  toSemanticActionTemplate: function(/* entryPoint1, entryPoint2, ... */) {
    var entryPoints = arguments.length > 0 ? arguments : Object.keys(this.ruleDict);
    var rulesToBeIncluded = this.rulesThatNeedSemanticAction(entryPoints);

    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.

    var self = this;
    var sb = new common.StringBuffer();
    sb.append('{');

    var first = true;
    for (var ruleName in rulesToBeIncluded) {
      var body = this.ruleDict[ruleName];
      if (first) {
        first = false;
      } else {
        sb.append(',');
      }
      sb.append('\n');
      sb.append('  ');
      self.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append('\n}');
    return sb.contents();
  },

  addSemanticActionTemplate: function(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');
    var arity = this._topDownActionArity(ruleName);
    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  },

  rulesThatNeedSemanticAction: function(entryPoints) {
    var self = this;
    function getBody(ruleName) {
      if (self.ruleDict[ruleName] === undefined) {
        throw new errors.UndeclaredRule(ruleName, self.name);
      } else {
        return self.ruleDict[ruleName];
      }
    }

    var rules = {};
    var ruleName;
    for (var idx = 0; idx < entryPoints.length; idx++) {
      ruleName = entryPoints[idx];
      getBody(ruleName);  // to make sure the rule exists
      rules[ruleName] = true;
    }

    var done = false;
    while (!done) {
      done = true;
      for (ruleName in rules) {
        var addedNewRule = getBody(ruleName).addRulesThatNeedSemanticAction(rules, true);
        done &= !addedNewRule;
      }
    }

    return rules;
  }
};

// The following grammar is a minimal set of built-in rules. At the bottom of
// src/main.js, we replace this grammar with a sub-grammar that contains more
// convenience rules, e.g., letter and digit. (The source of that grammar is
// in src/built-in-rules.ohm.)
Grammar.BuiltInRules = new Grammar('BuiltInRules', null, {
  // The following rules can't be written in "userland" because they reference
  // `anything` and `end` directly.
  _: pexprs.anything.withFormals([]),
  end: pexprs.end.withFormals([]),

  // The following rule is part of the implementation. Its name ends with '_' to prevent it
  // from being overridden or invoked by programmers.
  spaces_: new pexprs.Many(new pexprs.Apply('space'), 0).withFormals([]),

  // The `space` rule must be defined here because it's referenced in the body of `_spaces`.
  // (Otherwise the call to `new Grammar(...)` below will throw an `UndeclaredRule` exception.)
  space: pexprs.makePrim(/[\s]/).withFormals([]).withDescription('a space')
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;
