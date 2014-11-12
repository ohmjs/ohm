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

  length: {
    value: function() {
      return this.args.length;
    }
  },

  get: {
    value: function(idx) {
      return this.args[idx];
    }
  },

  indexOf: {
    value: function(arg) {
      return this.args.indexOf(arg);
    }
  },
  
  isEmpty: {
    value: function() {
      return this.args.length === 0;
    }
  },
  
  first: {
    value: function() {
      if (this.isEmpty()) {
        throw new Error('cannot get first element of empty rule node');
      } else {
        return this.args[0];
      }
    }
  },
  
  last: {
    value: function() {
      if (this.isEmpty()) {
        throw new Error('cannot get last element of empty rule node');
      } else {
        return this.args[this.args.length - 1];
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
exports.ValueNode = ValueNode;

