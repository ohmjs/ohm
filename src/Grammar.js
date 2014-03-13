// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var InputStream = require('./InputStream.js');
var pexprs = require('./pexprs.js');

var awlib = require('awlib');
var keysDo = awlib.objectUtils.keysDo;
var formals = awlib.objectUtils.formals;
var makeStringBuffer = awlib.objectUtils.stringBuffer;
var makeColumnStringBuffer = awlib.objectUtils.columnStringBuffer;
var printString = awlib.stringUtils.printString;
var equals = awlib.equals.equals;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(ruleDict) {
  this.ruleDict = ruleDict;
}

Grammar.prototype = {
  ruleDict: {
    _: pexprs.anything,
    end: new pexprs.Not(pexprs.anything),
    space: pexprs.makePrim(/[\s]/),
    spaces: new pexprs.Many(new pexprs.Apply('space'), 0),
    alnum: pexprs.makePrim(/[0-9a-zA-Z]/),
    letter: pexprs.makePrim(/[a-zA-Z]/),
    lower: pexprs.makePrim(/[a-z]/),
    upper: pexprs.makePrim(/[A-Z]/),
    digit: pexprs.makePrim(/[0-9]/),
    hexDigit: pexprs.makePrim(/[0-9a-fA-F]/)
  },

  match: function(obj, startRule) {
    return this.matchContents([obj], startRule);
  },

  matchContents: function(obj, startRule) {
    var inputStream = InputStream.newFor(obj);
    var thunk = new pexprs.Apply(startRule).eval(undefined, this.ruleDict, inputStream, undefined);
    if (common.isSyntactic(startRule)) {
      common.skipSpaces(this.ruleDict, inputStream);
    }
    var assertSemanticActionNamesMatch = this.assertSemanticActionNamesMatch.bind(this);
    return thunk === common.fail || !inputStream.atEnd() ?
      false :
      function(actionDict) {
        assertSemanticActionNamesMatch(actionDict);
        return thunk.force(actionDict, {});
      }
  },

  assertSemanticActionNamesMatch: function(actionDict) {
    var self = this;
    var ruleDict = this.ruleDict;
    var ok = true;
    keysDo(ruleDict, function(ruleName) {
      if (actionDict[ruleName] === undefined) {
        return;
      }
      var actual = formals(actionDict[ruleName]).sort();
      var expected = self.semanticActionArgNames(ruleName);
      if (!equals(actual, expected)) {
        ok = false;
        console.log('semantic action for rule', ruleName, 'has the wrong argument names');
        console.log('  expected', expected);
        console.log('    actual', actual);
      }
    });
    if (!ok) {
      browser.error('one or more semantic actions have the wrong argument names -- see console for details');
    }
  },

  semanticActionArgNames: function(ruleName) {
    if (this.superGrammar && this.superGrammar.ruleDict[ruleName]) {
      return this.superGrammar.semanticActionArgNames(ruleName);
    } else {
      var body = this.ruleDict[ruleName];
      var names = body.getBindingNames();
      return names.length > 0 || body.producesValue() ? ['env'] : [];
    }
  },

  toRecipe: function() {
    var ws = makeStringBuffer();
    ws.nextPutAll('(function(ohm, optNamespace) {\n');
    ws.nextPutAll('  var b = ohm._builder();\n');
    ws.nextPutAll('  b.setName('); ws.nextPutAll(printString(this.name)); ws.nextPutAll(');\n');
    if (this.superGrammar.name && this.superGrammar.namespaceName) {
      ws.nextPutAll('  b.setSuperGrammar(ohm.namespace(');
      ws.nextPutAll(printString(this.superGrammar.namespaceName));
      ws.nextPutAll(').getGrammar(');
      ws.nextPutAll(printString(this.superGrammar.name));
      ws.nextPutAll('));\n');
    }
    for (var idx = 0; idx < this.ruleDecls.length; idx++) {
      ws.nextPutAll('  ');
      this.ruleDecls[idx].outputRecipe(ws);
      ws.nextPutAll(';\n');
    }
    ws.nextPutAll('  return b.build(optNamespace);\n');
    ws.nextPutAll('});');
    return ws.contents();
  },

  toSemanticActionTemplate: function(/* entryPoint1, entryPoint2, ... */) {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr-plus should appear next to
    // other cases of Add-Expr.
    // TODO: if the caller supplies entry points, only include templates for rules that are reachable in the call graph.
    var self = this;
    var buffer = makeColumnStringBuffer();
    buffer.nextPutAll('{');

    var first = true;
    for (var ruleName in this.ruleDict) {
      var body = this.ruleDict[ruleName];
      if (first) {
        first = false;
      } else {
        buffer.nextPutAll(',');
      }
      buffer.newLine();
      buffer.nextPutAll('  ');
      buffer.newColumn();
      self.addSemanticActionTemplate(ruleName, body, buffer);
    }

    buffer.newLine();
    buffer.nextPutAll('}');
    return buffer.contents();
  },

  addSemanticActionTemplate: function(ruleName, body, buffer) {
    buffer.nextPutAll(ruleName);
    buffer.nextPutAll(': ');
    buffer.newColumn();
    buffer.nextPutAll('function(');
    buffer.nextPutAll(this.semanticActionArgNames(ruleName).join(', '));
    buffer.nextPutAll(') ');
    buffer.newColumn();
    buffer.nextPutAll('{');

    var bindings = body.getBindingNames();
    if (bindings.length > 0) {
      buffer.nextPutAll(' /* ');
      buffer.nextPutAll(bindings.join(', '));
      buffer.nextPutAll(' */ ');
    }
    buffer.nextPutAll('}');
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;

