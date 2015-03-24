// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval.js');
var PosInfo = require('./PosInfo.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function State(grammar, inputStream, tracingEnabled) {
  this.grammar = grammar;
  this.inputStreamStack = [];
  this.posInfosStack = [];
  this.pushInputStream(inputStream);
  this.ruleStack = [];
  this.bindings = [];
  this.failureDescriptor = this.makeFailureDescriptor();
  this.failureDescriptorStack = [];
  if (tracingEnabled) {
    this.trace = [];
  }
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

  recordFailure: function(pos, expr, optStack) {
    // TODO: consider making this code more OO, e.g., add an ExprAndStacks class
    // that supports an addStack(stack) method.
    function addStack(stack, stacks) {
      for (var idx = 0; idx < stacks.length; idx++) {
        var otherStack = stacks[idx];
        if (stack.length !== otherStack.length) {
          continue;
        }
        for (var idx2 = 0; idx2 < stack.length; idx2++) {
          if (stack[idx2] !== otherStack[idx2]) {
            break;
          }
        }
        if (idx2 === stack.length) {
          // found it, no need to add
          return;
        }
      }
      stacks.push(stack);
    }

    if (pos < this.failureDescriptor.pos) {
      // Failure is not at the right-most position -- ignore it.
      return;
    }

    var stack = optStack || [];
    if (pos > this.failureDescriptor.pos) {
      // Drop the old failures -- this is the new right-most position.
      this.failureDescriptor.pos = pos;
      this.failureDescriptor.exprsAndStacks = [{expr: expr, stacks: [stack]}];
    } else {
      // Another failure at right-most position -- record it if it wasn't already.
      var exprsAndStacks = this.failureDescriptor.exprsAndStacks;
      for (var idx = 0; idx < exprsAndStacks.length; idx++) {
        var exprAndStacks = exprsAndStacks[idx];
        if (exprAndStacks.expr === expr) {
          addStack(stack, exprAndStacks.stacks);
          return;
        }
      }
      exprsAndStacks.push({expr: expr, stacks: [stack]});
    }
  },

  recordFailures: function(failureDescriptor, currentApplication) {
    var self = this;
    failureDescriptor.exprsAndStacks.forEach(function(exprAndStacks) {
      var expr = exprAndStacks.expr;
      exprAndStacks.stacks.forEach(function(stack) {
        self.recordFailure(failureDescriptor.pos, expr, [currentApplication].concat(stack));
      });
    });
  },

  getFailuresPos: function() {
    return this.failureDescriptor.pos;
  },

  getFailures: function() {
    return this.failureDescriptor.exprsAndStacks;
  },

  makeFailureDescriptor: function() {
    return {pos: -1, exprsAndStacks: []};
  },

  pushFreshFailureDescriptor: function() {
    this.failureDescriptorStack.push(this.failureDescriptor);
    this.failureDescriptor = this.makeFailureDescriptor();
    return this.failureDescriptor;
  },

  popFailureDescriptor: function() {
    this.failureDescriptor = this.failureDescriptorStack.pop();
    return this.failureDescriptor;
  },

  // Returns the memoized trace entry for `pos` and `expr`, if one exists.
  getMemoizedTraceEntry: function(pos, expr) {
    var posInfo = this.posInfos[pos];
    if (posInfo && expr.ruleName) {
      var memoRec = posInfo.memo[expr.ruleName];
      if (memoRec) {
        return memoRec.traceEntry;
      }
    }
    return null;
  },

  // Make a new trace entry, using the currently active trace array as the
  // new entry's children.
  makeTraceEntry: function(pos, expr, ans) {
    var entry = {
      displayString: expr.toDisplayString(),
      pos: pos,
      expr: expr,
      succeeded: ans,
      children: this.trace
    };
    if (ans) {
      entry.interval = new Interval(this.inputStream, pos, this.inputStream.pos);
    }
    return entry;
  },

  isTracing: function() {
    return !!this.trace;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;

