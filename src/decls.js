// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');

var awlib = require('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;
var printString = awlib.stringUtils.printString;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function RuleDecl() {
  throw 'RuleDecl cannot be instantiated -- it\'s abstract';
}

RuleDecl.prototype = {
  performChecks: common.abstract,

  performCommonChecks: function(name, body) {
    body.assertNoDuplicateBindings(name);
    body.assertChoicesHaveUniformBindings(name);
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.body;
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.');
    ws.nextPutAll(this.kind);
    ws.nextPutAll('(');
    ws.nextPutAll(printString(this.name));
    ws.nextPutAll(', ');
    this.body.outputRecipe(ws);
    ws.nextPutAll(')');
  }
};

function Define(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Define.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'define',

  performChecks: function() {
    if (this.superGrammar.ruleDict[this.name]) {
      browser.error('cannot define rule', this.name, 'because it already exists in the super-grammar.',
                    '(try override or extend instead.)');
    }
    this.performCommonChecks(this.name, this.body);
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
      browser.error('cannot override rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)');
    }
    if (overridden.getBindingNames().length === 0 && overridden.producesValue() && !this.body.producesValue()) {
      browser.error('the body of rule', this.name,
                    'must produce a value, because the rule it\'s overriding also produces a value');
    }
    this.performCommonChecks(this.name, this.body);
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
      browser.error('cannot define inline rule', this.name, 'because it already exists in the super-grammar.');
    }
    this.performCommonChecks(this.name, this.body);
  }
});

function Extend(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.expandedBody = new pexprs.Alt([body, new pexprs.Expand(name, superGrammar)]);
  this.superGrammar = superGrammar;
}

Extend.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'extend',

  performChecks: function() {
    var extended = this.superGrammar.ruleDict[this.name];
    if (!extended) {
      browser.error('cannot extend rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)');
    }
    if (extended.getBindingNames().length === 0 && extended.producesValue() && !this.body.producesValue()) {
      browser.error('the body of rule', this.name,
                    'must produce a value, because the rule it\'s extending also produces a value');
    }
    this.performCommonChecks(this.name, this.expandedBody);
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.expandedBody;
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

