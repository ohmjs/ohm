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
    value: function(visitor) {
      return visitor.visitRule(this);
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
    value: function(visitor) {
      return visitor.visitList(this);
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
    value: function(visitor) {
      return visitor.visitValue(this);
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

