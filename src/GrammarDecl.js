// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = require("./Grammar.js");
var errors = require("./errors.js");
var namespace = require("./namespaces.js");
var pexprs = require("./pexprs.js");

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Constructors

function GrammarDecl(name, optNamespaceName) {
  this.name = name;
  this.ns = namespace(optNamespaceName || "default");
}

// Helpers

GrammarDecl.prototype.ensureSuperGrammar = function() {
  if (!this.superGrammar) {
    this.withSuperGrammar("Grammar", "default");
  }
  return this.superGrammar;
};

GrammarDecl.prototype.checkBody = function(ruleName, body) {
  body.assertChoicesHaveUniformArity(ruleName);
};

// Stuff that you should only do once

GrammarDecl.prototype.withSuperGrammar = function(name, optNamespaceName) {
  if (this.superGrammar) {
    throw new Error("the super grammar of a GrammarDecl cannot be set more than once");
  }
  this.superGrammar = (optNamespaceName ? namespace(optNamespaceName) : this.ns).getGrammar(name);
  this.ruleDict = Object.create(this.superGrammar.ruleDict);
  return this;
};

GrammarDecl.prototype.install = function() {
  if (!this.name) {
    throw new Error("cannot install unnamed grammar");
  }
  var grammar = new Grammar(this.name, this.ensureSuperGrammar(), this.ruleDict);
  this.ns.install(grammar);
  return grammar;
};

// Rule declarations

GrammarDecl.prototype.define = function(name, body, optDescr) {
  this.ensureSuperGrammar();
  if (optDescr) {
    body.description = optDescr;
  }
  if (this.superGrammar.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.superGrammar.name);
  } else if (this.ruleDict[name]) {
    throw new errors.DuplicateRuleDeclaration(name, this.name, this.name);
  }
  this.checkBody(name, body);
  this.ruleDict[name] = body;
  return this;
};

GrammarDecl.prototype.override = function(name, body) {
  this.ensureSuperGrammar();
  if (!this.superGrammar.ruleDict[name]) {
    throw new errors.UndeclaredRule(name, this.superGrammar.name);
  }
  this.checkBody(name, body);
  this.ruleDict[name] = body;
  return this;
};

GrammarDecl.prototype.extend = function(name, body) {
  this.ensureSuperGrammar();
  if (!this.superGrammar.ruleDict[name]) {
    throw new errors.UndeclaredRule(name, this.superGrammar.name);
  }
  body = new pexprs.Extend(this.superGrammar, name, body);
  this.checkBody(name, body);
  this.ruleDict[name] = body;
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

