// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval.js');

var common = require('./common.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node() {
  throw new Error('Node cannot be instantiated -- it\'s abstract');
}

Node.prototype = {
  init: function(source, startIdx, endIdx) {
    this._source = source;
    this._startIdx = startIdx;
    this._endIdx = endIdx;
  },
  accept: common.abstract
};

Object.defineProperty(Node.prototype, 'interval', {
  get: function() {
    return this._interval || (this._interval = new Interval(this._source, this._startIdx, this._endIdx));
  }
});

// Rule nodes

function RuleNode(grammar, ctorName, args, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.args = args;
}

RuleNode.prototype = Object.create(Node.prototype, {
  accept: {
    value: function(actionDict) {
      if (actionDict[this.ctorName]) {
        return actionDict[this.ctorName].apply(this, this.args);
      } else if (actionDict._default) {
        return actionDict._default.call(this);
      } else {
        throw new Error('missing semantic action for ' + this.ctorName);
      }
    }
  },

  toJSON: {
    value: function() {
      var r = {};
      r[this.ctorName] = this.args;
      return r;
    }
  }
});

// List nodes

function ListNode(values, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.values = values;
}

ListNode.prototype = Object.create(Node.prototype, {
  accept: {
    value: function(actionDict) {
      return this.values.map(function(node) { return node.accept(actionDict); });
    }
  },

  toJSON: {
    value: function() {
      return this.values;
    }
  }
});

// Value nodes

function ValueNode(value, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.value = value;
}

ValueNode.prototype = Object.create(Node.prototype, {
  accept: {
    value: function(actionDict) {
      return this.value;
    }
  },

  toJSON: {
    value: function() {
      return this.value;
    }
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleNode = RuleNode;
exports.ListNode = ListNode;
exports.ValueNode = ValueNode;

