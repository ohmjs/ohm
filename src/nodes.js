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
  init: function(interval) {
    this.interval = interval;
  },
  accept: common.abstract,
};

// Rule nodes

function RuleNode(grammar, ctorName, args, interval) {
  this.init(interval);
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

function ListNode(values, interval) {
  this.init(interval);
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

function ValueNode(value, interval) {
  this.init(interval);
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

