// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');

var awlib = require('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;
var makeStringBuffer = awlib.objectUtils.stringBuffer;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Error() {
  throw 'Error cannot be instantiated -- it\'s abstract';
}

Error.prototype.getMessage = common.abstract;

Error.prototype.printMessage = function() {
  console.log(this.getMessage());
};

Error.prototype.getShortMessage = function() {
  return this.getMessage();
};

Error.prototype.printShortMessage = function() {
  console.log(this.getMessage());
};

Error.prototype.toString = function() {
  return this.getShortMessage();
};

// ----------------- errors about thunks -----------------

function InvalidEvaluationStrategy(name) {
  this.name = name;
}

InvalidEvaluationStrategy.prototype = objectThatDelegatesTo(Error.prototype);

InvalidEvaluationStrategy.prototype.getMessage = function() {
  return ['invalid evaluation strategy "', this.name, '" (try "lazy" or "eager")'];
};

// ----------------- errors about intervals -----------------

function IntervalSourcesDontMatch() {}

IntervalSourcesDontMatch.prototype = objectThatDelegatesTo(Error.prototype);

IntervalSourcesDontMatch.prototype.getMessage = function() {
  return 'interval sources don\'t match';
};

// ----------------- errors about grammars -----------------

// Undeclarated grammar

function UndeclaredGrammar(grammarName, optNamespaceName) {
  this.grammarName = grammarName;
  this.namespaceName = optNamespaceName;
};

UndeclaredGrammar.prototype = objectThatDelegatesTo(Error.prototype);

UndeclaredGrammar.prototype.getMessage = function() {
  return this.namespaceName ?
    ['grammar', this.grammarName, 'is not declared in namespace', this.namespaceName].join(' ') :
    ['undeclared grammar', this.grammarName].join(' ');
};

// Duplicate grammar declaration

function DuplicateGrammarDeclaration(grammarName, namespaceName) {
  this.grammarName = grammarName;
  this.namespaceName = namespaceName;
};

DuplicateGrammarDeclaration.prototype = objectThatDelegatesTo(Error.prototype);

DuplicateGrammarDeclaration.prototype.getMessage = function() {
  return ['grammar', this.grammarName, 'is already declared in namespace', this.namespaceName].join(' ');
};

// ----------------- rules -----------------

// Undeclared rule

function UndeclaredRule(ruleName, optGrammarName) {
  this.ruleName = ruleName;
  this.grammarName = optGrammarName;
};

UndeclaredRule.prototype = objectThatDelegatesTo(Error.prototype);

UndeclaredRule.prototype.getMessage = function() {
  return this.grammarName ?
    ['rule', this.ruleName, 'is not declared in grammar', this.grammarName].join(' ') :
    ['undeclared rule', this.ruleName].join(' ');
};

// Duplicate rule declaration

function DuplicateRuleDeclaration(ruleName, grammarName) {
  this.ruleName = ruleName;
  this.grammarName = grammarName;
};

DuplicateRuleDeclaration.prototype = objectThatDelegatesTo(Error.prototype);

DuplicateRuleDeclaration.prototype.getMessage = function() {
  return ['rule', this.ruleName, 'is already declared in grammar', this.grammarName].join(' ');
};

// Rule must produce value

function RuleMustProduceValue(ruleName, why) {
  this.ruleName = ruleName;
  this.why = why;
};

RuleMustProduceValue.prototype = objectThatDelegatesTo(Error.prototype);

RuleMustProduceValue.prototype.getMessage = function() {
  return [
    'rule', this.ruleName, 'must produce a value',
    'because the rule it is', this.why, 'also produces a value'
  ].join(' ');
};

// ----------------- bindings -----------------

// Inconsistent bindings

function InconsistentBindings(ruleName, expected, actual) {
  this.ruleName = ruleName;
  this.expected = expected;
  this.actual = actual;
};

InconsistentBindings.prototype = objectThatDelegatesTo(Error.prototype);

InconsistentBindings.prototype.getMessage = function() {
  return [
    'rule', this.ruleName, 'has inconsistent bindings.',
    'expected:', this.expected,
    'got:', this.actual
  ].join(' ');
};

// Duplicate bindings

function DuplicateBindings(ruleName, duplicates) {
  this.ruleName = ruleName;
  this.duplicates = duplicates;
};

DuplicateBindings.prototype = objectThatDelegatesTo(Error.prototype);

DuplicateBindings.prototype.getMessage = function() {
  return ['rule', this.ruleName, 'has duplicate bindings:', this.duplicates].join(' ');
};

// Useless bindings

function UselessBindings(ruleName, useless) {
  this.ruleName = ruleName;
  this.useless = useless;
};

UselessBindings.prototype = objectThatDelegatesTo(Error.prototype);

UselessBindings.prototype.getMessage = function() {
  return ['rule', this.ruleName, 'has useless bindings:', this.useless].join(' ');
};

// ----------------- properties -----------------

// Duplicate property names

function DuplicatePropertyNames(duplicates) {
  this.duplicates = duplicates;
};

DuplicatePropertyNames.prototype = objectThatDelegatesTo(Error.prototype);

DuplicatePropertyNames.prototype.getMessage = function() {
  return ['object pattern has duplicate property names:', this.duplicates].join(' ');
};

// ----------------- syntax -----------------

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

function MatchFailure(inputStream, ruleDict) {
  this.inputStream = inputStream;
  this.ruleDict = ruleDict;
}

MatchFailure.prototype = objectThatDelegatesTo(Error.prototype);

MatchFailure.prototype.getPos = function() {
  return this.inputStream.failuresPos;
};

MatchFailure.prototype.getShortMessage = function() {
 if (typeof this.inputStream.source !== 'string') {
    return 'error at position ' + this.getPos();
  } else {
    var text = makeStringBuffer();
    var errorInfo = toErrorInfo(this.getPos(), this.inputStream.source);
    text.nextPutAll(this.getLineAndColText());
    text.nextPutAll(': expected ');
    text.nextPutAll(this.getExpectedText());
    return text.contents();
  }
};

MatchFailure.prototype.getMessage = function() {
 if (typeof this.inputStream.source !== 'string') {
    return 'error at position ' + this.getPos();
  } else {
    var text = makeStringBuffer();
    var errorInfo = toErrorInfo(this.getPos(), this.inputStream.source);
    var lineAndColText = this.getLineAndColText() + ': ';
    text.nextPutAll(lineAndColText);
    text.nextPutAll(errorInfo.line);
    text.nextPutAll('\n');
    for (var idx = 1; idx < lineAndColText.length + errorInfo.colNum; idx++) {
      text.nextPutAll(' ');
    }
    text.nextPutAll('^');
  }
  text.nextPutAll('\nExpected: ');
  text.nextPutAll(this.getExpectedText());
  return text.contents();
};

MatchFailure.prototype.getLineAndColText = function() {
  var errorInfo = toErrorInfo(this.getPos(), this.inputStream.source);
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
  var expected = {};
  for (var failure = this.inputStream.failures; failure !== null; failure = failure.next) {
    expected[failure.expr.toExpected(this.ruleDict)] = true;
  }
  return Object.keys(expected).reverse();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.InvalidEvaluationStrategy = InvalidEvaluationStrategy;
exports.IntervalSourcesDontMatch = IntervalSourcesDontMatch;
exports.UndeclaredGrammar = UndeclaredGrammar;
exports.DuplicateGrammarDeclaration = DuplicateGrammarDeclaration;
exports.UndeclaredRule = UndeclaredRule;
exports.DuplicateRuleDeclaration = DuplicateRuleDeclaration;
exports.RuleMustProduceValue = RuleMustProduceValue;
exports.InconsistentBindings = InconsistentBindings;
exports.DuplicateBindings = DuplicateBindings;
exports.UselessBindings = UselessBindings;
exports.DuplicatePropertyNames = DuplicatePropertyNames;
exports.MatchFailure = MatchFailure;

