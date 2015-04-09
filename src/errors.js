'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var Namespace = require('./Namespace.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function OhmError() {}
OhmError.prototype = Object.create(Error.prototype);

function makeCustomError(name, initFn) {
  // Make E think it's really called OhmError, so that errors look nicer when they're console.log'ed in Chrome.
  var E = function OhmError() {
    initFn.apply(this, arguments);
    var e = new Error();
    Object.defineProperty(this, 'stack', { get: function() { return e.stack; } });
  };
  E.prototype = Object.create(OhmError.prototype);
  E.prototype.constructor = E;
  E.prototype.name = name;
  return E;
}

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

// Create a verbose error message for an error that occurred during matching.
function getMatchErrorMessage(pos, source, detail) {
  var errorInfo = toErrorInfo(pos, source);
  var sb = new common.StringBuffer();
  sb.append('Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ':\n');
  sb.append('> | ' + errorInfo.line + '\n    ');
  for (var idx = 1; idx < errorInfo.colNum; idx++) {
    sb.append(' ');
  }
  sb.append('^\n');
  sb.append(detail);
  return sb.contents();
}

// Create a short error message for an error that occurred during matching.
function getShortMatchErrorMessage(pos, source, detail) {
  var errorInfo = toErrorInfo(pos, source);
  return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
}

function describeRuleStacks(stacks) {
  return stacks.map(function(s) {
    return s.map(function(app) { return app.ruleName; }).join(' > ');
  }).join('; ');
}

// ----------------- runtime errors -----------------

var InfiniteLoop = makeCustomError(
  'ohm.error.InfiniteLoop',
  function(state, expr) {
    var inputStream = state.inputStream;
    var detail = "Infinite loop detected when matching '" + expr.toDisplayString() + "'";
    this.message = getMatchErrorMessage(inputStream.pos, inputStream.source, detail);
  }
);

// ----------------- errors about intervals -----------------

var IntervalSourcesDontMatch = makeCustomError(
    'ohm.error.IntervalSourcesDontMatch',
    function() {
      this.message = "interval sources don't match";
    }
);

// ----------------- errors about grammars -----------------

// Undeclared grammar

var UndeclaredGrammar = makeCustomError(
    'ohm.error.UndeclaredGrammar',
    function(grammarName, namespace) {
      this.grammarName = grammarName;
      this.namespace = namespace;
      if (this.namespace) {
        this.message = 'grammar ' + this.grammarName +
            ' is not declared in namespace ' + Namespace.toString(this.namespace);
      } else {
        this.message = 'undeclared grammar ' + this.grammarName;
      }
    }
);

// Duplicate grammar declaration

var DuplicateGrammarDeclaration = makeCustomError(
    'ohm.error.DuplicateGrammarDeclaration',
    function(grammarName, namespace) {
      this.grammarName = grammarName;
      this.namespace = namespace;
      this.message = 'grammar ' + this.grammarName +
          ' is already declared in namespace ' + Namespace.toString(this.namespace);
    }
);

// ----------------- rules -----------------

// Undeclared rule

var UndeclaredRule = makeCustomError(
    'ohm.error.UndeclaredRule',
    function(ruleName, optGrammarName) {
      this.ruleName = ruleName;
      this.grammarName = optGrammarName;
      this.message = this.grammarName ?
          'rule ' + this.ruleName + ' is not declared in grammar ' + this.grammarName :
          'undeclared rule ' + this.ruleName;
    }
);

// Duplicate rule declaration

var DuplicateRuleDeclaration = makeCustomError(
    'ohm.error.DuplicateRuleDeclaration',
    function(ruleName, offendingGrammarName, declGrammarName) {
      this.ruleName = ruleName;
      this.offendingGrammarName = offendingGrammarName;
      this.declGrammarName = declGrammarName;
      this.message = 'duplicate declaration for rule ' + this.ruleName + ' in grammar ' + this.offendingGrammarName;
      if (this.offendingGrammarName !== declGrammarName) {
        this.message += ' (it was originally declared in grammar ' + this.declGrammarName + ')';
      }
    }
);

// ----------------- arity -----------------

// Inconsistent arity

var InconsistentArity = makeCustomError(
    'ohm.error.InconsistentArity',
    function(ruleName, expected, actual) {
      this.ruleName = ruleName;
      this.expected = expected;
      this.actual = actual;
      this.message =
          'rule ' + this.ruleName + ' involves an alternation which has inconsistent arity ' +
          '(expected ' + this.expected + ', got ' + this.actual + ')';
    }
);

// ----------------- properties -----------------

// Duplicate property names

var DuplicatePropertyNames = makeCustomError(
    'ohm.error.DuplicatePropertyNames',
    function(duplicates) {
      this.duplicates = duplicates;
      this.message = 'object pattern has duplicate property names: ' + this.duplicates.join(', ');
    }
);

// ----------------- syntax -----------------

var MatchFailure = makeCustomError(
    'ohm.error.MatchFailure',
    function(state) {
      this.state = state;
      common.defineLazyProperty(this, 'exprsAndStacks', function() {
        return this.state.getFailures();
      });
      // `displayString` is intended to be shown to users of a grammar.
      common.defineLazyProperty(this, 'displayString', function() {
        return this.getMessage();
      });
      // `message` is intended to be shown to developers of a grammar.
      common.defineLazyProperty(this, 'message', function() {
        return this.getMessage(true);
      });
    }
);

MatchFailure.prototype.getShortMessage = function() {
  if (typeof this.state.inputStream.source !== 'string') {
    return 'match failed at position ' + this.getPos();
  }
  var detail = 'expected' + this.getExpectedText();
  return getShortMatchErrorMessage(this.getPos(), this.state.inputStream.source, detail);
};

MatchFailure.prototype.getMessage = function(optIncludeRules) {
  var source = this.state.inputStream.source;
  if (typeof source !== 'string') {
    return 'match failed at position ' + this.getPos();
  }

  var detail = 'Expected ' + this.getExpectedText(!!optIncludeRules);
  return getMatchErrorMessage(this.getPos(), source, detail);
};

MatchFailure.prototype.getPos = function() {
  return this.state.getFailuresPos();
};

// Return a string summarizing the expected contents of the input stream when
// the match failure occurred. If `includeRules` is true, the string will
// include information about the rule stacks for each terminal or rule.
MatchFailure.prototype.getExpectedText = function(includeRules) {
  var sb = new common.StringBuffer();
  var expected = includeRules ? this.getExpectedWithRules() : this.getExpected();
  for (var idx = 0; idx < expected.length; idx++) {
    if (idx > 0) {
      if (idx === expected.length - 1) {
        sb.append((expected.length > 2 ? ', or ' : ' or '));
      } else {
        sb.append(', ');
      }
    }
    sb.append(expected[idx]);
  }
  return sb.contents();
};

// Return an Array of unique strings representing the terminals or rules that
// were expected to be matched.
MatchFailure.prototype.getExpected = function() {
  var expected = {};
  var ruleDict = this.state.grammar.ruleDict;
  this.exprsAndStacks.forEach(function(obj) {
    expected[obj.expr.toExpected(ruleDict)] = true;
  });
  return Object.keys(expected);
};

// Return an Array of strings representing the terminals or rules that were
// expected to be matched, as well as information about each rule stack.
MatchFailure.prototype.getExpectedWithRules = function() {
  var ans = [];
  var ruleDict = this.state.grammar.ruleDict;
  this.exprsAndStacks.forEach(function(obj) {
    ans.push(obj.expr.toExpected(ruleDict) + ' (' + describeRuleStacks(obj.stacks) + ')');
  }, this);
  return ans;
};

// ----------------- constructors -----------------

// Type error

var InvalidConstructorCall = makeCustomError(
    'ohm.error.InvalidConstructorCall',
    function(grammar, ctorName, children) {
      this.grammar = grammar;
      this.ctorName = ctorName;
      this.children = children;
      this.message = 'Attempt to invoke constructor ' + this.ctorName + ' with invalid or unexpected arguments';
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  Error: OhmError,
  InfiniteLoop: InfiniteLoop,
  IntervalSourcesDontMatch: IntervalSourcesDontMatch,
  UndeclaredGrammar: UndeclaredGrammar,
  DuplicateGrammarDeclaration: DuplicateGrammarDeclaration,
  UndeclaredRule: UndeclaredRule,
  DuplicateRuleDeclaration: DuplicateRuleDeclaration,
  InconsistentArity: InconsistentArity,
  DuplicatePropertyNames: DuplicatePropertyNames,
  MatchFailure: MatchFailure,
  InvalidConstructorCall: InvalidConstructorCall
};
