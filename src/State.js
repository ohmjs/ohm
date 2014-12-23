// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');
var PosInfo = require('./PosInfo.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var applySpace = new pexprs.Apply('space');

function State(grammar, inputStream) {
  this.grammar = grammar;
  this.inputStreamStack = [];
  this.posInfosStack = [];
  this.pushInputStream(inputStream);
  this.ruleStack = [];
  this.bindings = [];
  this.failures = [];
  this.failuresPos = -1;
}

State.prototype = {
  pushInputStream: function(inputStream) {
    this.inputStreamStack.push(this.inputStream);
    this.posInfosStack.push(this.posInfos);
    this.inputStream = inputStream;
    this.posInfos = [];
  },

  popInputStream: function() {
    this.inputStream = this.inputStreamStack.pop();
    this.posInfos = this.posInfosStack.pop();
  },

  getCurrentPosInfo: function() {
    return this.getPosInfo(this.inputStream.pos);
  },

  getPosInfo: function(pos) {
    var posInfo = this.posInfos[pos];
    return posInfo || (this.posInfos[pos] = new PosInfo(this.ruleStack));
  },

  skipSpacesIfAppropriate: function() {
    var ruleName = this.ruleStack[this.ruleStack.length - 1] || '';
    if (typeof this.inputStream.source === 'string' && common.isSyntactic(ruleName)) {
      this.skipSpaces();
    }
  },

  skipSpaces: function() {
    while (true) {
      var origPos = this.inputStream.pos;
      var succeeded = applySpace.eval(false, this);
      if (succeeded) {
        this.bindings.pop();  // discard the binding from space
      } else {
        this.inputStream.pos = origPos;
        break;
      }
    }
  },

  atEnd: function() {
    var origPos = this.inputStream.pos;
    this.skipSpacesIfAppropriate();
    var ans = this.inputStream.atEnd();
    this.inputStream.pos = origPos;
    return ans;
  },

  recordFailure: function(pos, expr) {
    if (pos < this.failuresPos) {
      return;
    } else if (pos > this.failuresPos) {
      this.failures = {};
      this.failuresPos = pos;
    }

    var fs = this.failures;
    for (var idx = 0; idx < this.ruleStack.length; idx++) {
      var ruleName = this.ruleStack[idx];
      if (idx === this.ruleStack.length - 1) {
        if (Array.isArray(fs[ruleName])) {
          fs[ruleName].push(expr);
        } else {
          // This failure subsumes others whose paths have this failure's path as a prefix.
          fs[ruleName] = [expr];
        }
      } else if (Array.isArray(fs[ruleName])) {
        // Don't record this failure, it's subsumed by another failure
        // whose path is a prefix of this failure's path.
        break;
      } else {
        if (fs[ruleName] === undefined) {
          fs[ruleName] = {};
        }
        fs = fs[ruleName];
      }
    }
  },

  getFailuresPos: function() {
    return this.failuresPos;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;

