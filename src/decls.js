// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');
var errors = require('./errors.js');

var awlib = require('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;
var printString = awlib.stringUtils.printString;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function outputRecipe(decl, ws) {
  ws.nextPutAll('b.');
  ws.nextPutAll(decl.kind);
  ws.nextPutAll('(');
  ws.nextPutAll(printString(decl.name));
  ws.nextPutAll(', ');
  decl.body.outputRecipe(ws);
  ws.nextPutAll(')');
}

function RuleDecl() {
  throw 'RuleDecl cannot be instantiated -- it\'s abstract';
}

RuleDecl.prototype = {
  performChecks: common.abstract,

  performCommonChecks: function(name, body) {
    body.assertNoDuplicateBindings(name);
    body.assertNoUselessBindings(name);
    body.assertChoicesHaveUniformBindings(name);
  },

  install: common.abstract,

  outputRecipe: function(ws) { outputRecipe(this, ws); }
};

function Define(name, body, superGrammar, description) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
  this.description = description;
}

Define.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'define',

  performChecks: function() {
    if (this.superGrammar.ruleDict[this.name]) {
      throw new errors.DuplicateRuleDeclarationError(this.name, this.superGrammar.name);
    }
    this.performCommonChecks(this.name, this.body);
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.setRuleDescription(');
    ws.nextPutAll(printString(this.description));
    ws.nextPutAll('); ');
    outputRecipe(this, ws);
  },

  install: function(ruleDict) {
    this.body.description = this.description;
    ruleDict[this.name] = this.body;
  }
});

function Override(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Override.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'override',

  performChecks: function() {
    var overridden = this.superGrammar.ruleDict[this.name];
    if (!overridden) {
      throw new errors.UndeclaredRuleError(this.name, this.superGrammar.name);
    }
    if (overridden.getBindingNames().length === 0 && overridden.producesValue() && !this.body.producesValue()) {
      throw new errors.RuleMustProduceValueError(this.name, 'overriding');
    }
    this.performCommonChecks(this.name, this.body);
  },

  install: function(ruleDict) {
    this.body.description = this.superGrammar.ruleDict[this.name].description;
    ruleDict[this.name] = this.body;
  }
});

function Inline(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Inline.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'inline',

  performChecks: function() {
    // TODO: consider relaxing this check, e.g., make it ok to override an inline rule if the nesting rule is
    // an override. But only if the inline rule that's being overridden is nested inside the nesting rule that
    // we're overriding? Hopefully there's a much less complicated way to do this :)
    if (this.superGrammar.ruleDict[this.name]) {
      throw new errors.DuplicateRuleDeclarationError(this.name, this.superGrammar.name);
    }
    this.performCommonChecks(this.name, this.body);
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.body;
  }
});

function Extend(name, body, superGrammar) {
  this.name = name;
  this.base = superGrammar.ruleDict[name];
  if (!this.base) {
    throw new errors.UndeclaredRuleError(name, superGrammar.name);
  }
  this.body = body;
  this.extendedBody = new pexprs.ExtendAlt(this.body, this.base);
  this.superGrammar = superGrammar;
}

Extend.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'extend',

  performChecks: function() {
    if (this.base.getBindingNames().length === 0 && this.base.producesValue() && !this.body.producesValue()) {
      throw new errors.RuleMustProduceValueError(this.name, 'extending');
    }
    this.performCommonChecks(this.name, this.extendedBody);
  },

  install: function(ruleDict) {
    this.extendedBody.description = this.superGrammar.ruleDict[this.name].description;
    ruleDict[this.name] = this.extendedBody;
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleDecl = RuleDecl;
exports.Define = Define;
exports.Override = Override;
exports.Inline = Inline;
exports.Extend = Extend;

