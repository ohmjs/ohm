// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

require('../dist/ohm-grammar.js');

var Builder = require('./Builder.js');
var Namespace = require('./Namespace.js');
var errors = require('./errors.js');

var awlib = require('awlib');
var unescapeChar = awlib.stringUtils.unescapeChar;

var thisModule = exports;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammarActionDict(optNamespace) {
  var builder;
  return {
    Grammars: function(expr) {
      return expr.value;
    },

    Grammar: function(n, s, rs) {
      builder = new Builder();
      builder.setName(n.value);
      s.value;  // force evaluation
      rs.value;  // force evaluation
      return builder.build(optNamespace);
    },

    SuperGrammar: function(expr) {
      builder.setSuperGrammar(expr.value);
    },
    SuperGrammar_qualified: function(ns, n) {
      return thisModule.namespace(ns.value).getGrammar(n.value);
    },
    SuperGrammar_unqualified: function(n) {
      if (optNamespace) {
        return optNamespace.getGrammar(n.value);
      } else {
        throw new errors.UndeclaredGrammar(n.value);
      }
    },

    Rule: function(expr) {
      return expr.value;
    },
    Rule_define: function(n, d, b) {
      builder.currentRuleName = n.value;
      d.value;  // force evaluation
      return builder.define(n.value, b.value);
    },
    Rule_override: function(n, b) {
      builder.currentRuleName = n.value;
      return builder.override(n.value, b.value);
    },
    Rule_extend: function(n, b) {
      builder.currentRuleName = n.value;
      return builder.extend(n.value, b.value);
    },

    Alt: function(expr) {
      return expr.value;
    },
    Alt_rec: function(x, y) {
      return builder.alt(x.value, y.value);
    },

    Term: function(expr) {
      return expr.value;
    },
    Term_inline: function(x, n) {
      return builder.inline(builder.currentRuleName + '_' + n.value, x.value);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, expr.value);
    },

    Factor: function(expr) {
      return expr.value;
    },
    Factor_bind: function(x, n) {
      return builder.bind(x.value, n.value);
    },

    Iter: function(expr) {
      return expr.value;
    },
    Iter_star: function(x) {
      return builder.many(x.value, 0);
    },
    Iter_plus: function(x) {
      return builder.many(x.value, 1);
    },
    Iter_opt: function(x) {
      return builder.opt(x.value);
    },

    Pred: function(expr) {
      return expr.value;
    },
    Pred_not: function(x) {
      return builder.not(x.value);
    },
    Pred_lookahead: function(x) {
      return builder.la(x.value);
    },

    Base: function(expr) {
      return expr.value;
    },
    Base_application: function(ruleName) {
      return builder.app(ruleName.value);
    },
    Base_prim: function(expr) {
      return builder.prim(expr.value);
    },
    Base_paren: function(x) {
      return x.value;
    },
    Base_listy: function(x) {
      return builder.listy(x.value);
    },
    Base_obj: function(lenient) {
      return builder.obj([], lenient.value);
    },
    Base_objWithProps: function(ps, lenient) {
      return builder.obj(ps.value, lenient.value);
    },

    Props: function(expr) {
      return expr.value;
    },
    Props_rec: function(p, ps) {
      return [p.value].concat(ps.value);
    },
    Props_base: function(p) {
      return [p.value];
    },
    Prop: function(n, p) {
      return {name: n.value, pattern: p.value};
    },

    ruleDescr: function(t) {
      builder.setRuleDescription(t.value);
      return t.value;
    },
    ruleDescrText: function() {
      return this.interval.contents;
    },

    caseName: function(n) {
      return n.value
    },

    name: function() {
      return this.interval.contents;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    ident: function(n) {
      return n.value;
    },

    keyword: function(expr) {
      return expr.value;
    },
    keyword_undefined: function() {
      return undefined;
    },
    keyword_null: function() {
      return null;
    },
    keyword_true: function() {
      return true;
    },
    keyword_false: function() {
      return false;
    },

    string: function(cs) {
      return cs.value.map(function(c) { return unescapeChar(c); }).join('');
    },

    sChar: function() {
      return this.interval.contents;
    },

    regExp: function(e) {
      return new RegExp(e.value);
    },

    reCharClass: function() {
      return this.interval.contents;
    },

    number: function() {
      return parseInt(this.interval.contents);
    },

    space: function(expr) {},
    space_multiLine: function() {},
    space_singleLine: function() {}
  };
}

function compileAndLoad(source, whatItIs, optNamespace) {
  try {
    var thunk = thisModule.ohmGrammar.matchContents(source, whatItIs, true);
    return thunk(makeGrammarActionDict(optNamespace));
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

// Stuff that's only here for bootstrapping, testing, etc.

exports._builder = function() {
  return new Builder();
};

exports._makeGrammarActionDict = makeGrammarActionDict;

var ohmGrammar;
Object.defineProperty(exports, 'ohmGrammar', {
  get: function() {
    if (!ohmGrammar) {
      ohmGrammar = this._ohmGrammarFactory(this);
    }
    return ohmGrammar;
  }
});

