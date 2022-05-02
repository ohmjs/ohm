'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const CaseInsensitiveTerminal = require('./CaseInsensitiveTerminal');
const Matcher = require('./Matcher');
const Semantics = require('./Semantics');
const common = require('./common');
const errors = require('./errors');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

const SPECIAL_ACTION_NAMES = ['_iter', '_terminal', '_nonterminal', '_default'];

function getSortedRuleValues(grammar) {
  return Object.keys(grammar.rules)
      .sort()
      .map(name => grammar.rules[name]);
}

// Until ES2019, JSON was not a valid subset of JavaScript because U+2028 (line separator)
// and U+2029 (paragraph separator) are allowed in JSON string literals, but not in JS.
// This function properly encodes those two characters so that the resulting string is
// represents both valid JSON, and valid JavaScript (for ES2018 and below).
// See https://v8.dev/features/subsume-json for more details.
const jsonToJS = str => str.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function Grammar(name, superGrammar, rules, optDefaultStartRule) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.rules = rules;
  if (optDefaultStartRule) {
    if (!(optDefaultStartRule in rules)) {
      throw new Error(
          "Invalid start rule: '" +
          optDefaultStartRule +
          "' is not a rule in grammar '" +
          name +
          "'"
      );
    }
    this.defaultStartRule = optDefaultStartRule;
  }
}

let ohmGrammar;
let buildGrammar;

// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function(grammar, builderFn) {
  ohmGrammar = grammar;
  buildGrammar = builderFn;
};

Grammar.prototype = {
  matcher() {
    return new Matcher(this);
  },

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  equals(g) {
    if (this === g) {
      return true;
    }
    // Do the cheapest comparisons first.
    if (
      g == null ||
      this.name !== g.name ||
      this.defaultStartRule !== g.defaultStartRule ||
      !(this.superGrammar === g.superGrammar || this.superGrammar.equals(g.superGrammar))
    ) {
      return false;
    }
    const myRules = getSortedRuleValues(this);
    const otherRules = getSortedRuleValues(g);
    return (
      myRules.length === otherRules.length &&
      myRules.every((rule, i) => {
        return (
          rule.description === otherRules[i].description &&
          rule.formals.join(',') === otherRules[i].formals.join(',') &&
          rule.body.toString() === otherRules[i].body.toString()
        );
      })
    );
  },

  match(input, optStartApplication) {
    const m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.match(optStartApplication);
  },

  trace(input, optStartApplication) {
    const m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.trace(optStartApplication);
  },

  createSemantics() {
    return Semantics.createSemantics(this);
  },

  extendSemantics(superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  },

  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict(what, name, actionDict) {
    const problems = [];

    // eslint-disable-next-line guard-for-in
    for (const k in actionDict) {
      const v = actionDict[k];
      const isSpecialAction = SPECIAL_ACTION_NAMES.includes(k);

      if (!isSpecialAction && !(k in this.rules)) {
        problems.push(`'${k}' is not a valid semantic action for '${this.name}'`);
        continue;
      }
      if (typeof v !== 'function') {
        problems.push(`'${k}' must be a function in an action dictionary for '${this.name}'`);
        continue;
      }
      const actual = v.length;
      const expected = this._topDownActionArity(k);
      if (actual !== expected) {
        let details;
        if (k === '_iter' || k === '_nonterminal') {
          details =
            `it should use a rest parameter, e.g. \`${k}(...children) {}\`. ` +
            'NOTE: this is new in Ohm v16 — see https://ohmjs.org/d/ati for details.';
        } else {
          details = `expected ${expected}, got ${actual}`;
        }
        problems.push(`Semantic action '${k}' has the wrong arity: ${details}`);
      }
    }
    if (problems.length > 0) {
      const prettyProblems = problems.map(problem => '- ' + problem);
      const error = new Error(
          [
            `Found errors in the action dictionary of the '${name}' ${what}:`,
            ...prettyProblems,
          ].join('\n')
      );
      error.problems = problems;
      throw error;
    }
  },

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity(actionName) {
    // All special actions have an expected arity of 0, though all but _terminal
    // are expected to use the rest parameter syntax (e.g. `_iter(...children)`).
    // This is considered to have arity 0, i.e. `((...args) => {}).length` is 0.
    return SPECIAL_ACTION_NAMES.includes(actionName) ?
      0 :
      this.rules[actionName].body.getArity();
  },

  _inheritsFrom(grammar) {
    let g = this.superGrammar;
    while (g) {
      if (g.equals(grammar, true)) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  },

  toRecipe(superGrammarExpr = undefined) {
    const metaInfo = {};
    // Include the grammar source if it is available.
    if (this.source) {
      metaInfo.source = this.source.contents;
    }

    let startRule = null;
    if (this.defaultStartRule) {
      startRule = this.defaultStartRule;
    }

    const rules = {};
    Object.keys(this.rules).forEach(ruleName => {
      const ruleInfo = this.rules[ruleName];
      const {body} = ruleInfo;
      const isDefinition = !this.superGrammar || !this.superGrammar.rules[ruleName];

      let operation;
      if (isDefinition) {
        operation = 'define';
      } else {
        operation = body instanceof pexprs.Extend ? 'extend' : 'override';
      }

      const metaInfo = {};
      if (ruleInfo.source && this.source) {
        const adjusted = ruleInfo.source.relativeTo(this.source);
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
      }

      const description = isDefinition ? ruleInfo.description : null;
      const bodyRecipe = body.outputRecipe(ruleInfo.formals, this.source);

      rules[ruleName] = [
        operation, // "define"/"extend"/"override"
        metaInfo,
        description,
        ruleInfo.formals,
        bodyRecipe,
      ];
    });

    // If the caller provided an expression to use for the supergrammar, use that.
    // Otherwise, if the supergrammar is a user grammar, use its recipe inline.
    let superGrammarOutput = 'null';
    if (superGrammarExpr) {
      superGrammarOutput = superGrammarExpr;
    } else if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
      superGrammarOutput = this.superGrammar.toRecipe();
    }

    const recipeElements = [
      ...['grammar', metaInfo, this.name].map(JSON.stringify),
      superGrammarOutput,
      ...[startRule, rules].map(JSON.stringify),
    ];
    return jsonToJS(`[${recipeElements.join(',')}]`);
  },

  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  toAttributeActionDictionaryTemplate() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },

  _toOperationOrAttributeActionDictionaryTemplate() {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.

    const sb = new common.StringBuffer();
    sb.append('{');

    let first = true;
    // eslint-disable-next-line guard-for-in
    for (const ruleName in this.rules) {
      const {body} = this.rules[ruleName];
      if (first) {
        first = false;
      } else {
        sb.append(',');
      }
      sb.append('\n');
      sb.append('  ');
      this.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append('\n}');
    return sb.contents();
  },

  addSemanticActionTemplate(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');
    const arity = this._topDownActionArity(ruleName);
    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  },

  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication(str) {
    let app;
    if (str.indexOf('<') === -1) {
      // simple application
      app = new pexprs.Apply(str);
    } else {
      // parameterized application
      const cst = ohmGrammar.match(str, 'Base_application');
      app = buildGrammar(cst, {});
    }

    // Ensure that the application is valid.
    if (!(app.ruleName in this.rules)) {
      throw errors.undeclaredRule(app.ruleName, this.name);
    }
    const {formals} = this.rules[app.ruleName];
    if (formals.length !== app.args.length) {
      const {source} = this.rules[app.ruleName];
      throw errors.wrongNumberOfParameters(
          app.ruleName,
          formals.length,
          app.args.length,
          source
      );
    }
    return app;
  },
};

// The following grammar contains a few rules that couldn't be written  in "userland".
// At the bottom of src/main.js, we create a sub-grammar of this grammar that's called
// `BuiltInRules`. That grammar contains several convenience rules, e.g., `letter` and
// `digit`, and is implicitly the super-grammar of any grammar whose super-grammar
// isn't specified.
Grammar.ProtoBuiltInRules = new Grammar(
    'ProtoBuiltInRules', // name
    undefined, // supergrammar
    {
      any: {
        body: pexprs.any,
        formals: [],
        description: 'any character',
        primitive: true,
      },
      end: {
        body: pexprs.end,
        formals: [],
        description: 'end of input',
        primitive: true,
      },

      caseInsensitive: {
        body: new CaseInsensitiveTerminal(new pexprs.Param(0)),
        formals: ['str'],
        primitive: true,
      },
      lower: {
        body: new pexprs.UnicodeChar('Ll'),
        formals: [],
        description: 'a lowercase letter',
        primitive: true,
      },
      upper: {
        body: new pexprs.UnicodeChar('Lu'),
        formals: [],
        description: 'an uppercase letter',
        primitive: true,
      },
      // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
      unicodeLtmo: {
        body: new pexprs.UnicodeChar('Ltmo'),
        formals: [],
        description: 'a Unicode character in Lt, Lm, or Lo',
        primitive: true,
      },

      // These rules are not truly primitive (they could be written in userland) but are defined
      // here for bootstrapping purposes.
      spaces: {
        body: new pexprs.Star(new pexprs.Apply('space')),
        formals: [],
      },
      space: {
        body: new pexprs.Range('\x00', ' '),
        formals: [],
        description: 'a space',
      },
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;
