'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var MatchResult = require('./MatchResult');
var MatchState = require('./MatchState');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Matcher(grammar) {
  this.grammar = grammar;
  this.memoTable = [];
  this.input = '';
}

Matcher.prototype.getInput = function() {
  return this.input;
};

Matcher.prototype.replaceInput = function(startIdx, endIdx, str) {
  var currentInput = this.input;
  if (startIdx < 0 || startIdx > currentInput.length ||
      endIdx < 0 || endIdx > currentInput.length ||
      startIdx > endIdx) {
    throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx);
  }

  this.input = currentInput.slice(0, startIdx) + str + currentInput.slice(endIdx);

  // Keep the memo table in sync with the edits.
  var newValues = Array.apply(null, new Array(str.length));  // Array of `undefined` (wat)

  // Replace the contents from startIdx:endIdx with `newValues`.
  this.memoTable.splice.apply(
      this.memoTable,
      [startIdx, endIdx - startIdx].concat(newValues));

  // Invalidate memoRecs
  for (var pos = 0; pos < startIdx; pos++) {
    var posInfo = this.memoTable[pos];
    if (posInfo) {
      posInfo.clearObsoleteEntries(pos, startIdx);
    }
  }
};

Matcher.prototype.match = function(optStartApplication) {
  var state = new MatchState(
      this.grammar,
      this.input,
      this.memoTable,
      {
        startApplication: optStartApplication
      });
  state.evalFromStart();
  return MatchResult.newFor(state);  // TODO: MatchResult should have a Matcher, not a MatchState.
};

Matcher.prototype.trace = function(optStartApplication) {
  var state = new MatchState(
      this.grammar,
      this.input,
      this.memoTable,
      {
        startApplication: optStartApplication,
        trace: true
      });
  state.evalFromStart();

  // The trace node for the start rule is always the last entry. If it is a syntactic rule,
  // the first entry is for an application of 'spaces'.
  // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
  // ensure that there is always a single root trace node.
  var rootTrace = state.trace[state.trace.length - 1];
  rootTrace.state = state;
  rootTrace.result = MatchResult.newFor(state);
  return rootTrace;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Matcher;
