/* global XMLHttpRequest */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Builder = require('./Builder');
var Grammar = require('./Grammar');
var Semantics = require('./Semantics');
var common = require('./common');
var errors = require('./errors');

var Namespace = require('./Namespace');
var UnicodeCategories = require('../third_party/unicode').UnicodeCategories;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
var ohmGrammar;

// Check if `obj` is a DOM element.
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0;
}

// TODO: just use the jQuery thing
function load(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error('unable to load url ' + url);
}

// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
function buildGrammar(tree, namespace, optOhmGrammarForTesting) {
  var builder;
  var decl;
  var currentRuleName;
  var currentRuleFormals;
  var overriding = false;
  var metaGrammar = optOhmGrammarForTesting || ohmGrammar;

  // A visitor that produces a Grammar instance from the CST.
  var helpers = metaGrammar.semantics().addOperation('visit', {
    Grammar: function(n, s, open, rs, close) {
      builder = new Builder();
      var grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      var g = decl.build();
      if (grammarName in namespace) {
        throw new errors.DuplicateGrammarDeclaration(grammarName, namespace);
      }
      namespace[grammarName] = g;
      return g;
    },

    SuperGrammar: function(_, n) {
      var superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw new errors.UndeclaredGrammar(superGrammarName, namespace);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define: function(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit() || [];
      var body = b.visit();
      body.definitionInterval = this.node.interval.trimmed();
      var description = d.visit();
      return decl.define(currentRuleName, currentRuleFormals, body, description);
    },
    Rule_override: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit() || [];
      overriding = true;
      var body = b.visit();
      body.definitionInterval = this.node.interval.trimmed();
      var ans = decl.override(currentRuleName, currentRuleFormals, body);
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit() || [];
      var body = b.visit();
      var ans = decl.extend(currentRuleName, currentRuleFormals, body);
      decl.ruleDict[currentRuleName].definitionInterval = this.node.interval.trimmed();
      return ans;
    },

    Formals: function(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params: function(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt: function(term, _, terms) {
      var args = [term.visit()].concat(terms.visit());
      return builder.alt.apply(builder, args).withInterval(this.node.interval);
    },

    Term_inline: function(b, n) {
      var inlineRuleName = currentRuleName + '_' + n.visit();
      var body = b.visit();
      body.definitionInterval = this.node.interval.trimmed();
      if (overriding) {
        decl.override(inlineRuleName, currentRuleFormals, body);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body);
      }
      var params = currentRuleFormals.map(function(formal) { return builder.app(formal); });
      return builder.app(inlineRuleName, params).withInterval(body.interval);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, expr.visit()).withInterval(this.node.interval);
    },

    Iter_star: function(x, _) {
      return builder.many(x.visit(), 0).withInterval(this.node.interval);
    },
    Iter_plus: function(x, _) {
      return builder.many(x.visit(), 1).withInterval(this.node.interval);
    },
    Iter_opt: function(x, _) {
      return builder.opt(x.visit()).withInterval(this.node.interval);
    },

    Pred_not: function(_, x) {
      return builder.not(x.visit()).withInterval(this.node.interval);
    },
    Pred_lookahead: function(_, x) {
      return builder.la(x.visit()).withInterval(this.node.interval);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit() || []).withInterval(this.node.interval);
    },
    Base_prim: function(expr) {
      return builder.prim(expr.visit()).withInterval(this.node.interval);
    },
    Base_paren: function(open, x, close) {
      return x.visit();
    },
    Base_arr: function(open, x, close) {
      return builder.arr(x.visit()).withInterval(this.node.interval);
    },
    Base_str: function(open, x, close) {
      return builder.str(x.visit());
    },
    Base_obj: function(open, lenient, close) {
      return builder.obj([], lenient.visit());
    },

    Base_objWithProps: function(open, ps, _, lenient, close) {
      return builder.obj(ps.visit(), lenient.visit()).withInterval(this.node.interval);
    },

    Props: function(p, _, ps) {
      return [p.visit()].concat(ps.visit());
    },
    Prop: function(n, _, p) {
      return {name: n.visit(), pattern: p.visit()};
    },

    ruleDescr: function(open, t, close) {
      return t.visit();
    },
    ruleDescrText: function(_) {
      return this.node.interval.contents.trim();
    },

    caseName: function(_, space1, n, space2, end) {
      return n.visit();
    },

    name: function(first, rest) {
      return this.node.interval.contents;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    keyword_undefined: function(_) {
      return undefined;
    },
    keyword_null: function(_) {
      return null;
    },
    keyword_true: function(_) {
      return true;
    },
    keyword_false: function(_) {
      return false;
    },

    string: function(open, cs, close) {
      return cs.visit().map(function(c) { return common.unescapeChar(c); }).join('');
    },

    strChar: function(_) {
      return this.node.interval.contents;
    },

    escapeChar: function(_) {
      return this.node.interval.contents;
    },

    regExp: function(open, e, close) {
      return e.visit();
    },

    reCharClass_unicode: function(open, unicodeClass, close) {
      return UnicodeCategories[unicodeClass.visit().join('')];
    },
    reCharClass_ordinary: function(open, _, close) {
      return new RegExp(this.node.interval.contents);
    },

    number: function(_, digits) {
      return parseInt(this.node.interval.contents);
    },

    space: function(expr) {},
    space_multiLine: function(start, _, end) {},
    space_singleLine: function(start, _, end) {},

    ListOf_some: function(x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    ListOf_none: function() {
      return [];
    },

    _many: Semantics.actions.makeArray,
    _terminal: Semantics.actions.getPrimitiveValue,
    _default: Semantics.actions.passThrough
  });
  return helpers(tree).visit();
}

function compileAndLoad(source, whatItIs, namespace) {
  try {
    var node = ohmGrammar.match(source, whatItIs, true);
    return buildGrammar(node, namespace);
  } catch (e) {
    if (e instanceof errors.MatchFailure) {
      console.log('\n' + e.getMessage());  // eslint-disable-line no-console
    }
    throw e;
  }
}

// Return the contents of a script element, fetching it via XHR if necessary.
function getScriptElementContents(el) {
  if (!isElement(el)) {
    throw new TypeError('Expected a DOM Node');
  }
  if (el.type !== 'text/ohm-js') {
    throw new Error("script tag's type attribute must be text/ohm-js");
  }
  return el.getAttribute('src') ? load(el.getAttribute('src')) : el.innerHTML;
}

function makeGrammar(stringOrNode, optNamespace) {
  var ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  var source = typeof stringOrNode === 'string' ? stringOrNode : [stringOrNode];
  make(source, 'Grammar', ns);
  return ns[Object.keys(ns)[0]];  // Return the one and only property.
}

function makeGrammars(stringOrNodeList, optNamespace) {
  var ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  make(stringOrNodeList, 'Grammars', ns);
  return ns;
}

// Makes a grammar or grammars from `source`, which may be a string, NodeList, or Array.
function make(source, whatItIs, namespace) {
  if (!source || isUndefined(source.length)) {
    throw new TypeError('Expected string or NodeList as first argument');
  }
  if (typeof source === 'string') {
    compileAndLoad(source, whatItIs, namespace);
  } else {
    for (var i = 0; i < source.length; ++i) {
      compileAndLoad(getScriptElementContents(source[i]), whatItIs, namespace);
    }
  }
}

function makeRecipe(recipeFn) {
  return recipeFn.call(new Builder());
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

module.exports = {
  actions: Semantics.actions,
  createNamespace: Namespace.createNamespace,
  error: errors,
  makeGrammar: makeGrammar,
  makeGrammars: makeGrammars,
  makeRecipe: makeRecipe
};

// Stuff that's only here for bootstrapping, testing, etc.
Grammar.BuiltInRules = require('../dist/built-in-rules');
ohmGrammar = require('../dist/ohm-grammar');
module.exports._buildGrammar = buildGrammar;
module.exports.ohmGrammar = ohmGrammar;
