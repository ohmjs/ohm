// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval.js');

var common = require('./common.js');
var awlib = require('awlib');
var browser = awlib.browser
var objectUtils = awlib.objectUtils
var objectThatDelegatesTo = objectUtils.objectThatDelegatesTo;

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

  computeAttribute: common.abstract
};

Object.defineProperty(Node.prototype, 'interval', {
  get: function() {
    return this._interval || (this._interval = new Interval(this._source, this._startIdx, this._endIdx));
  }
});

// TODO: change these constructors so that (source, startIdx, endIdx) always come last.

// Rule nodes

function RuleNode(ctorName, source, startIdx, endIdx, args) {
  this.init(source, startIdx, endIdx);
  this.ctorName = ctorName;
  this.args = args;
}

RuleNode.prototype = objectThatDelegatesTo(Node.prototype, {
  accept: function(actionDict) {
    var result;

    if (actionDict._pre) {
      var haveResult = false;
      function resultis(v) {
        haveResult = true;
        result = v;
      }

      actionDict._pre.call(this, resultis);
      if (haveResult) {
        return result;
      }
    }

    if (actionDict[this.ctorName]) {
      result = actionDict[this.ctorName].apply(this, this.args);
    } else if (actionDict._default) {
      result = actionDict._default.call(this);
    } else {
      throw new Error('missing semantic action for ' + this.ctorName);
    }

    if (actionDict._post) {
      return actionDict._post.call(this, result);
    }

    return result;
  },

  toJSON: function() {
    var r = {};
    r[this.ctorName] = this.args;
    return r;
  }
});

// List nodes

function ListNode(values, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.values = values;
}

ListNode.prototype = objectThatDelegatesTo(Node.prototype, {
  accept: function(actionDict) {
    return this.values.map(function(thunk) { return thunk.accept(actionDict); });
  },

  toJSON: function() {
    return this.values;
  }
});

// Value nodes

function ValueNode(value, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.value = value;
}

ValueNode.prototype = objectThatDelegatesTo(Node.prototype, {
  accept: function(actionDict) {
    return this.value;
  },

  toJSON: function() {
    return this.value;
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleNode = RuleNode;
exports.ListNode = ListNode;
exports.ValueNode = ValueNode;

