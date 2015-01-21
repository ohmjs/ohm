// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

require("./Grammar.js");  // required to initialize default namespace w/ Grammar grammar
require("../dist/ohm-grammar.js");

var Builder = require("./Builder.js");
var attributes = require("./attributes.js");
var errors = require("./errors.js");
var namespace = require("./namespaces.js");

var awlib = require("awlib");
var unescapeChar = awlib.stringUtils.unescapeChar;

var UnicodeCategories = require("./unicode.js").UnicodeCategories;

var thisModule = exports;
var ohm = exports;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammarBuilder(optNamespaceName) {
  var builder;
  var decl;
  var currentRuleName;
  var overriding = false;
  var value = exports.ohmGrammar.semanticAction({
    Grammar: function(n, s, _, rs, _) {
      builder = new Builder();
      decl = builder.newGrammar(value(n), optNamespaceName || "default");
      value(s);  // force evaluation
      value(rs);  // force evaluation
      return decl.install();
    },

    SuperGrammar_qualified: function(_, ns, _, n) {
      decl.withSuperGrammar(value(n), value(ns));
    },
    SuperGrammar_unqualified: function(_, n) {
      decl.withSuperGrammar(value(n));
    },

    Rule_define: function(n, d, _, b) {
      currentRuleName = value(n);
      return decl.define(value(n), value(b), value(d));
    },
    Rule_override: function(n, _, b) {
      currentRuleName = value(n);
      overriding = true;
      var ans = decl.override(value(n), value(b));
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, _, b) {
      currentRuleName = value(n);
      return decl.extend(value(n), value(b));
    },

    Alt_rec: function(x, _, y) {
      return builder.alt(value(x), value(y));
    },

    Term_inline: function(x, n) {
      var inlineRuleName = currentRuleName + "_" + value(n);
      if (overriding) {
        decl.override(inlineRuleName, value(x));
      } else {
        decl.define(inlineRuleName, value(x));
      }
      return builder.app(inlineRuleName);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, value(expr));
    },

    Iter_star: function(x, _) {
      return builder.many(value(x), 0);
    },
    Iter_plus: function(x, _) {
      return builder.many(value(x), 1);
    },
    Iter_opt: function(x, _) {
      return builder.opt(value(x));
    },

    Pred_not: function(_, x) {
      return builder.not(value(x));
    },
    Pred_lookahead: function(_, x) {
      return builder.la(value(x));
    },

    Base_application: function(ruleName) {
      return builder.app(value(ruleName));
    },
    Base_prim: function(expr) {
      return builder.prim(value(expr));
    },
    Base_paren: function(_, x, _) {
      return value(x);
    },
    Base_arr: function(_, x, _) {
      return builder.arr(value(x));
    },
    Base_obj: function(_, lenient, _) {
      return builder.obj([], value(lenient));
    },
    Base_objWithProps: function(_, ps, _, lenient, _) {
      return builder.obj(value(ps), value(lenient));
    },

    Props_rec: function(p, _, ps) {
      return [value(p)].concat(value(ps));
    },
    Props_base: function(p) {
      return [value(p)];
    },
    Prop: function(n, _, p) {
      return {name: value(n), pattern: value(p)};
    },

    ruleDescr: function(_, t, _) {
      return value(t);
    },
    ruleDescrText: function(_) {
      return this.interval.contents.trim();
    },

    caseName: function(_, _, n, _, _) {
      return value(n)
    },

    name: function(_, _) {
      return this.interval.contents;
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

    string: function(_, cs, _) {
      return value(cs).map(function(c) { return unescapeChar(c); }).join("");
    },

    singleQuoteStrChar: function(_) {
      return this.interval.contents;
    },

    doubleQuoteStrChar: function(_) {
      return this.interval.contents;
    },

    regExp: function(_, e, _) {
      return value(e);
    },

    reCharClass_unicode: function(_, unicodeClass, _) {
      return UnicodeCategories[value(unicodeClass).join("")];
    },
    reCharClass_ordinary: function(_, _, _) {
      return new RegExp(this.interval.contents);
    },

    number: function(_, _) {
      return parseInt(this.interval.contents);
    },

    space: function(expr) {},
    space_multiLine: function(_, _, _) {},
    space_singleLine: function(_, _, _) {},

    _list: attributes.actions.map,
    _terminal: attributes.actions.getValue,
    _default: attributes.actions.passThrough
  });
  return value;
}

function compileAndLoad(source, whatItIs, optNamespaceName) {
  try {
    var node = thisModule.ohmGrammar.matchContents(source, whatItIs, true);
    return makeGrammarBuilder(optNamespaceName)(node);
  } catch (e) {
    if (e instanceof errors.MatchFailure) {
      console.log("\n" + e.getMessage());
    }
    throw e;
  }
}

function makeGrammar(source, optNamespaceName) {
  return compileAndLoad(source, "Grammar", optNamespaceName);
}

function makeGrammars(source, optNamespaceName) {
  return compileAndLoad(source, "Grammars", optNamespaceName);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

exports.error = errors;

exports.namespace = namespace;

exports.make = function(recipe) {
  return recipe.call(new Builder());
};

exports.makeGrammar = makeGrammar;
exports.makeGrammars = makeGrammars;

exports.actions = attributes.actions;

// Stuff that's only here for bootstrapping, testing, etc.

exports._builder = function() {
  return new Builder();
};

exports._makeGrammarBuilder = makeGrammarBuilder;

var ohmGrammar;
Object.defineProperty(exports, "ohmGrammar", {
  get: function() {
    if (!ohmGrammar) {
      ohmGrammar = this._ohmGrammarRecipe.call(new Builder());
    }
    return ohmGrammar;
  }
});

// Load all grammars in script elements into the appropriate namespaces

if (typeof document !== "undefined") {
  Array.prototype.slice.call(document.getElementsByTagName("script")).
      filter(function(elt) {
        return elt.getAttribute("type") === "text/ohm-js";
      }).
      forEach(function(elt) {
        var ns = elt.getAttribute("namespace") || "default";
        namespace(ns).loadGrammarsFromScriptElement(elt)
      });
}

