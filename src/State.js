// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');
var PosInfo = require('./PosInfo.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function State(grammar, inputStream) {
  this.grammar = grammar;
  this.inputStreamStack = [];
  this.posInfosStack = [];
  this.pushInputStream(inputStream);
  this.ruleStack = [];
  this.bindings = [];
  this.failureDescriptor = this.makeFailureDescriptor();
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

  recordFailure: function(pos, expr) {
    if (pos < this.failureDescriptor.pos) {
      return;
    } else if (pos > this.failureDescriptor.pos) {
      this.failureDescriptor.pos = pos;
      this.failureDescriptor.exprs = [expr];
    } else if (this.failureDescriptor.exprs.indexOf(expr) < 0) {
      this.failureDescriptor.exprs.push(expr);
    }
  },

  recordFailures: function(failureDescriptor) {
    var self = this;
    failureDescriptor.exprs.forEach(function(expr) {
      self.recordFailure(failureDescriptor.pos, expr);
    });
  },

  getFailuresPos: function() {
    return this.failureDescriptor.pos;
  },

  makeFailureDescriptor: function() {
    return {pos: -1, exprs: []};
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;

