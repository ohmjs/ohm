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
  },

  length: {
    value: function() {
      return this.values.length;
    }
  },

  get: {
    value: function(idx) {
      return this.values[idx];
    }
  },

  indexOf: {
    value: function(value) {
      return this.values.indexOf(value);
    }
  },
  
  isEmpty: {
    value: function() {
      return this.values.length === 0;
    }
  },
  
  first: {
    value: function() {
      if (this.isEmpty()) {
        throw new Error('cannot get first element of empty list node');
      } else {
        return this.values[0];
      }
    }
  },
  
  last: {
    value: function() {
      if (this.isEmpty()) {
        throw new Error('cannot get last element of empty list node');
      } else {
        return this.values[this.values.length - 1];
      }
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

