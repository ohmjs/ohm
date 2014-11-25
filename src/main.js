// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

require('../dist/ohm-grammar.js');

var Builder = require('./Builder.js');
var Namespace = require('./Namespace.js');
var errors = require('./errors.js');
var attributes = require('./attributes.js');

var awlib = require('awlib');
var unescapeChar = awlib.stringUtils.unescapeChar;

var UnicodeCategories = require("./unicode.js").UnicodeCategories;

var thisModule = exports;
var ohm = exports;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammarBuilder(optNamespace) {
  var builder;
  var value = exports.ohmGrammar.synthesizedAttribute({
    Grammars: function(exprs) {
      return value(exprs);
    },

    Grammar: function(n, s, _, rs, _) {
      builder = new Builder();
      builder.setName(value(n));
      value(s);  // force evaluation
      value(rs);  // force evaluation
      return builder.build(optNamespace);
    },

    SuperGrammar: function(expr) {
      builder.setSuperGrammar(value(expr));
    },
    SuperGrammar_qualified: function(_, ns, _, n) {
      return thisModule.namespace(value(ns)).getGrammar(value(n));
    },
    SuperGrammar_unqualified: function(_, n) {
      if (optNamespace) {
        return optNamespace.getGrammar(value(n));
      } else {
        throw new errors.UndeclaredGrammar(value(n));
      }
    },

    Rule: function(expr) {
      return value(expr);
    },
    Rule_define: function(n, d, _, b) {
      builder.currentRuleName = value(n);
      value(d);  // force evaluation
      return builder.define(value(n), value(b));
    },
    Rule_override: function(n, _, b) {
      builder.currentRuleName = value(n);
      return builder.override(value(n), value(b));
    },
    Rule_extend: function(n, _, b) {
      builder.currentRuleName = value(n);
      return builder.extend(value(n), value(b));
    },

    Alt: function(expr) {
      return value(expr);
    },
    Alt_rec: function(x, _, y) {
      return builder.alt(value(x), value(y));
    },

    Term: function(expr) {
      return value(expr);
    },
    Term_inline: function(x, n) {
      return builder.inline(builder.currentRuleName + '_' + value(n), value(x));
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, value(expr));
    },

    Iter: function(expr) {
      return value(expr);
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

    Pred: function(expr) {
      return value(expr);
    },
    Pred_not: function(_, x) {
      return builder.not(value(x));
    },
    Pred_lookahead: function(_, x) {
      return builder.la(value(x));
    },

    Base: function(expr) {
      return value(expr);
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
    Base_listy: function(_, x, _) {
      return builder.listy(value(x));
    },
    Base_obj: function(_, lenient, _) {
      return builder.obj([], value(lenient));
    },
    Base_objWithProps: function(_, ps, _, lenient, _) {
      return builder.obj(value(ps), value(lenient));
    },

    Props: function(expr) {
      return value(expr);
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
      builder.setRuleDescription(value(t));
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

    ident: function(n) {
      return value(n);
    },

    keyword: function(expr) {
      return value(expr);
    },
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
      return value(cs).map(function(c) { return unescapeChar(c); }).join('');
    },

    sChar: function(_) {
      return this.interval.contents;
    },

    regExp: function(_, e, _) {
      return value(e);
    },

    reCharClass: function(expr) {
      return value(expr);
    },
    reCharClass_unicode: function(_, unicodeClass, _) {
      return UnicodeCategories[value(unicodeClass).join('')];
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

    _list: attributes.defaultActions.map,
    _terminal: attributes.defaultActions.getValue
  });
  return value;
}

function compileAndLoad(source, whatItIs, optNamespace) {
  try {
    var node = thisModule.ohmGrammar.matchContents(source, whatItIs, true);
    return makeGrammarBuilder(optNamespace)(node);
  } catch (e) {
    if (e instanceof errors.MatchFailure) {
      console.log('\n' + e.getMessage());
    }
    throw e;
  }
}

function makeGrammar(source, optNamespace) {
  return compileAndLoad(source, 'Grammar', optNamespace);
}

function makeGrammars(source, optNamespace) {
  return compileAndLoad(source, 'Grammars', optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

exports.error = errors;

var namespaces = {};
exports.namespace = function(name) {
  if (namespaces[name] === undefined) {
    namespaces[name] = new Namespace(name);
  }
  return namespaces[name];
};

exports.make = function(recipe) {
  return recipe(thisModule);
};

exports.makeGrammar = makeGrammar;
exports.makeGrammars = makeGrammars;

exports.defaultActions = attributes.defaultActions;

// Stuff that's only here for bootstrapping, testing, etc.

exports._builder = function() {
  return new Builder();
};

exports._makeGrammarBuilder = makeGrammarBuilder;

var ohmGrammar;
Object.defineProperty(exports, 'ohmGrammar', {
  get: function() {
    if (!ohmGrammar) {
      ohmGrammar = this._ohmGrammarFactory(this);
    }
    return ohmGrammar;
  }
});

// Load all grammars in script elements into the appropriate namespaces

if (typeof document !== 'undefined') {
  Array.prototype.slice.call(document.getElementsByTagName('script')).
      filter(function(elt) { return elt.getAttribute('type') === 'text/ohm-js'; }).
      forEach(function(elt) {
        var ns = elt.getAttribute('namespace') || 'default';
        ohm.namespace(ns).loadGrammarsFromScriptElement(elt)
      });
}

