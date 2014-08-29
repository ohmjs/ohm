// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');
var errors = require('./errors.js');

var awlib = require('awlib');
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
  throw new Error('RuleDecl cannot be instantiated -- it\'s abstract');
}

RuleDecl.prototype = {
  performChecks: common.abstract,

  performCommonChecks: function(name, body) {
    body.assertChoicesHaveUniformArity(name);
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

Define.prototype = Object.create(RuleDecl.prototype, {
  kind: {
    value: 'define'
  },

  performChecks: {
    value: function() {
      if (this.superGrammar.ruleDict[this.name]) {
        throw new errors.DuplicateRuleDeclaration(this.name, this.superGrammar.name);
      }
      this.performCommonChecks(this.name, this.body);
    }
  },

  outputRecipe: {
    value: function(ws) {
      ws.nextPutAll('b.setRuleDescription(');
      ws.nextPutAll(printString(this.description));
      ws.nextPutAll('); ');
      outputRecipe(this, ws);
    }
  },

  install: {
    value: function(ruleDict) {
      this.body.description = this.description;
      ruleDict[this.name] = this.body;
    }
  }
});

function Override(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Override.prototype = Object.create(RuleDecl.prototype, {
  kind: {
    value: 'override'
  },

  performChecks: {
    value: function() {
      var overridden = this.superGrammar.ruleDict[this.name];
      if (!overridden) {
        throw new errors.UndeclaredRule(this.name, this.superGrammar.name);
      }
      if (overridden.getArity() !== this.body.getArity()) {
        throw new errors.RefinementMustBeCompatible(this.name, overridden.getArity(), 'overriding');
      }
      this.performCommonChecks(this.name, this.body);
    }
  },

  install: {
    value: function(ruleDict) {
      this.body.description = this.superGrammar.ruleDict[this.name].description;
      ruleDict[this.name] = this.body;
    }
  }
});

function Inline(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Inline.prototype = Object.create(RuleDecl.prototype, {
  kind: {
    value: 'inline'
  },

  performChecks: {
    value: function() {
      // TODO: consider relaxing this check, e.g., make it ok to override an inline rule if the nesting rule is
      // an override. But only if the inline rule that's being overridden is nested inside the nesting rule that
      // we're overriding? Hopefully there's a much less complicated way to do this :)
      if (this.superGrammar.ruleDict[this.name]) {
        throw new errors.DuplicateRuleDeclaration(this.name, this.superGrammar.name);
      }
      this.performCommonChecks(this.name, this.body);
    }
  },

  install: {
    value: function(ruleDict) {
      ruleDict[this.name] = this.body;
    }
  }
});

function Extend(name, body, superGrammar) {
  this.name = name;
  this.base = superGrammar.ruleDict[name];
  if (!this.base) {
    throw new errors.UndeclaredRule(name, superGrammar.name);
  }
  this.body = body;
  this.extendedBody = new pexprs.ExtendAlt(this.body, this.base);
  this.superGrammar = superGrammar;
}

Extend.prototype = Object.create(RuleDecl.prototype, {
  kind: {
    value: 'extend'
  },

  performChecks: {
    value: function() {
      var expectedArity = this.base.getArity();
      if (this.body.getArity() !== expectedArity) {
        throw new errors.RefinementMustBeCompatible(this.name, expectedArity, 'extending');
      }
      this.performCommonChecks(this.name, this.body);
    }
  },

  install: {
    value: function(ruleDict) {
      this.extendedBody.description = this.superGrammar.ruleDict[this.name].description;
      ruleDict[this.name] = this.extendedBody;
    }
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

