// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = require('./Grammar.js')
var decls = require('./decls.js')
var pexprs = require('./pexprs.js')

var awlib = require('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {
  this.init()
}

Builder.prototype = {
  init: function() {
    this.name = undefined
    this.superGrammar = Grammar.prototype
    this.ruleDecls = []
  },

  setName: function(name) {
    this.name = name
  },

  setSuperGrammar: function(grammar) {
    this.superGrammar = grammar
  },

  define: function(ruleName, body) {
    this.ruleDecls.push(new decls.Define(ruleName, body, this.superGrammar))
  },

  override: function(ruleName, body) {
    this.ruleDecls.push(new decls.Override(ruleName, body, this.superGrammar))
  },

  inline: function(ruleName, body) {
    this.ruleDecls.push(new decls.Inline(ruleName, body, this.superGrammar))
    return this.app(ruleName)
  },

  extend: function(ruleName, body) {
    this.ruleDecls.push(new decls.Extend(ruleName, body, this.superGrammar))
  },

  build: function(optNamespace) {
    var superGrammar = this.superGrammar
    var ruleDict = objectThatDelegatesTo(superGrammar.ruleDict)
    this.ruleDecls.forEach(function(ruleDecl) {
      ruleDecl.performChecks()
      ruleDecl.install(ruleDict)
    })

    var grammar = new Grammar(ruleDict)
    grammar.superGrammar = superGrammar
    grammar.ruleDecls = this.ruleDecls
    if (this.name) {
      grammar.name = this.name
      if (optNamespace) {
        grammar.namespaceName = optNamespace.name
        optNamespace.install(this.name, grammar)
      }
    }
    this.init()
    return grammar
  },

  _: function(x) { return pexprs.makePrim(x) },
  alt: function(/* term1, term1, ... */) {
    var terms = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof pexprs.Alt)
        terms = terms.concat(arg.terms)
      else
        terms.push(arg)
    }
    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms)
  },
  seq: function(/* factor1, factor2, ... */) {
    var factors = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof pexprs.Seq)
        factors = factors.concat(arg.factors)
      else
        factors.push(arg)
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors)
  },
  bind: function(expr, name) { return new pexprs.Bind(expr, name) },
  many: function(expr, minNumMatches) { return new pexprs.Many(expr, minNumMatches) },
  opt: function(expr) { return new pexprs.Opt(expr) },
  not: function(expr) { return new pexprs.Not(expr) },
  la: function(expr) { return new pexprs.Lookahead(expr) },
  str: function(expr) { return new pexprs.Str(expr) },
  lst: function(expr) { return new pexprs.List(expr) },
  obj: function(properties, isLenient) { return new pexprs.Obj(properties, !!isLenient) },
  app: function(ruleName) { return new pexprs.Apply(ruleName) }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder

