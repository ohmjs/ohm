// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');

var awlib = require('awlib');
var makeStringBuffer = awlib.objectUtils.stringBuffer;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function OhmError() {}
OhmError.prototype = Object.create(Error.prototype);

function makeCustomError(name, initFn) {
  // Make E think it's really called OhmError, so that errors look nicer when they're console.log'ed on Chrome.
  var E = function OhmError() {  
    var e = new Error();
    Object.defineProperty(this, "stack", { get: function() { return e.stack; } });
    initFn.apply(this, arguments);
  }
  E.prototype = Object.create(OhmError.prototype);
  E.prototype.constructor = E;
  E.prototype.name = name;
  return E;
}

// ----------------- errors about intervals -----------------

var IntervalSourcesDontMatch = makeCustomError(
    "ohm.error.IntervalSourcesDontMatch",
    function() {
      this.message = "interval sources don't match";
    }
);

// ----------------- errors about grammars -----------------

// Undeclared grammar

var UndeclaredGrammar = makeCustomError(
    "ohm.error.UndeclaredGrammar",
    function(grammarName, optNamespaceName) {
      this.grammarName = grammarName;
      this.namespaceName = optNamespaceName;
      this.message = this.namespace ?
          "grammar " + this.grammarName + " is not declared in namespace " + this.namespaceName :
          "undeclared grammar " + this.grammarName;
    }
);

// Duplicate grammar declaration

var DuplicateGrammarDeclaration = makeCustomError(
    "ohm.error.DuplicateGrammarDeclaration",
    function(grammarName, namespaceName) {
      this.grammarName = grammarName;
      this.namespaceName = namespaceName;
      this.message = "grammar " + this.grammarName + " is already declared in namespace " + this.namespaceName;
    }
);

// ----------------- rules -----------------

// Undeclared rule

var UndeclaredRule = makeCustomError(
    "ohm.error.UndeclaredRule",
    function(ruleName, optGrammarName) {
      this.ruleName = ruleName;
      this.grammarName = optGrammarName;
      this.message = this.grammarName ?
          "rule " + this.ruleName + " is not declared in grammar " + this.grammarName :
          "undeclared rule " + this.ruleName;
    }
);

// Duplicate rule declaration

var DuplicateRuleDeclaration = makeCustomError(
    "ohm.error.DuplicateRuleDeclaration",
    function(ruleName, grammarName) {
      this.ruleName = ruleName;
      this.grammarName = grammarName;
      this.message = "rule " + this.ruleName + " is already declared in grammar " + this.grammarName;
    }
);

// Rule must produce value

var RefinementMustBeCompatible = makeCustomError(
    "ohm.error.RefinementMustBeCompatible",
    function(ruleName, expectedArity, why) {
      this.ruleName = ruleName;
      this.expectedArity = expectedArity;
      this.why = why;
      this.message =
          "rule " + this.ruleName + " must have arity " + this.expectedArity +
          " because the rule it is " + this.why + " also has arity " + this.expectedArity;
    }
);

// ----------------- arity -----------------

// Inconsistent arity

var InconsistentArity = makeCustomError(
    "ohm.error.InconsistentArity",
    function(ruleName, expected, actual) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message =
          "rule " + this.ruleName + " involves an alternation which has inconsistent arity " +
          "(expected " + this.expected + ", got " + this.actual + ")";
    }
);

// ----------------- properties -----------------

// Duplicate property names

var DuplicatePropertyNames = makeCustomError(
    "ohm.error.DuplicatePropertyNames",
    function(duplicates) {
      this.duplicates = duplicates;
      this.message = "object pattern has duplicate property names: " + this.duplicates.join(", ");
    }
);

// ----------------- syntax -----------------

var MatchFailure = makeCustomError(
    "ohm.error.MatchFailure",
    function(state) {
      this.state = state;
      Object.defineProperty(this, "message", {
          get: function() {
            return this.getMessage();
          }
      });
    }
);

MatchFailure.prototype.getShortMessage = function() {
  if (typeof this.state.inputStream.source !== "string") {
    return "match failed at position " + this.getPos();
  } else {
    var errorInfo = toErrorInfo(this.getPos(), this.state.inputStream.source);
    return "line " + errorInfo.lineNum + ", col " + errorInfo.colNum + ": expected " + this.getExpectedText();
  }
};

MatchFailure.prototype.getMessage = function() {
  if (typeof this.state.inputStream.source !== "string") {
    return "match failed at position " + this.getPos();
  }

  var errorInfo = toErrorInfo(this.getPos(), this.state.inputStream.source);
  var text = makeStringBuffer();
  var lineAndColText = "Line " + errorInfo.lineNum + ", col " + errorInfo.colNum + ": ";
  text.nextPutAll(lineAndColText + errorInfo.line + "\n");
  for (var idx = 1; idx < lineAndColText.length + errorInfo.colNum; idx++) {
    text.nextPutAll(" ");
  }
  text.nextPutAll("^\n");
  text.nextPutAll("Expected " + this.getExpectedText());
  return text.contents();
};

MatchFailure.prototype.getPos = function() {
  return this.state.getFailuresPos();
};

MatchFailure.prototype.getLineAndColText = function() {
  var errorInfo = toErrorInfo(this.getPos(), this.state.inputStream.source);
  return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum;
};

MatchFailure.prototype.getExpectedText = function() {
  var text = makeStringBuffer();
  var expected = this.getExpected();
  for (var idx = 0; idx < expected.length; idx++) {
    if (idx > 0) {
      if (idx === expected.length - 1) {
        text.nextPutAll(expected.length > 2 ? ', or ' : ' or ');
      } else {
        text.nextPutAll(', ');
      }
    }
    text.nextPutAll(expected[idx]);
  }
  return text.contents();
};

MatchFailure.prototype.getExpected = function() {
  var self = this;
  var expected = {};
  this.state.failureDescriptor.exprs.forEach(function(expr) {
    expected[expr.toExpected(self.state.grammar.ruleDict)] = true;
  });
  return Object.keys(expected);
};

function toErrorInfo(pos, str) {
  var lineNum = 1;
  var colNum = 1;

  var currPos = 0;
  var lineStartPos = 0;

  while (currPos < pos) {
    var c = str.charAt(currPos++);
    if (c === '\n') {
      lineNum++;
      colNum = 1;
      lineStartPos = currPos;
    } else if (c !== '\r') {
      colNum++;
    }
  }

  var lineEndPos = str.indexOf('\n', lineStartPos);
  if (lineEndPos < 0) {
    lineEndPos = str.length;
  }

  return {
    lineNum: lineNum,
    colNum: colNum,
    line: str.substr(lineStartPos, lineEndPos - lineStartPos)
  };
}

// ----------------- constructors -----------------

// Type error

var InvalidConstructorCall = makeCustomError(
    "ohm.error.InvalidConstructorCall",
    function(grammar, ctorName, children) {
      this.grammar = grammar;
      this.ctorName = ctorName;
      this.children = children;
      this.message = "Attempt to invoke constructor " + this.ctorName + " with invalid or unexpected arguments";
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.Error = OhmError;
exports.IntervalSourcesDontMatch = IntervalSourcesDontMatch;
exports.UndeclaredGrammar = UndeclaredGrammar;
exports.DuplicateGrammarDeclaration = DuplicateGrammarDeclaration;
exports.UndeclaredRule = UndeclaredRule;
exports.DuplicateRuleDeclaration = DuplicateRuleDeclaration;
exports.RefinementMustBeCompatible = RefinementMustBeCompatible;
exports.InconsistentArity = InconsistentArity;
exports.DuplicatePropertyNames = DuplicatePropertyNames;
exports.MatchFailure = MatchFailure;
exports.InvalidConstructorCall = InvalidConstructorCall;

