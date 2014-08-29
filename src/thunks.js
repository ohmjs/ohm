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

function Thunk() {
  throw new Error('Thunk cannot be instantiated -- it\'s abstract');
}

Thunk.prototype = {
  init: function(source, startIdx, endIdx) {
    this._source = source;
    this._startIdx = startIdx;
    this._endIdx = endIdx;
  },

  computeAttribute: common.abstract
};

Object.defineProperty(Thunk.prototype, 'interval', {
  get: function() {
    return this._interval || (this._interval = new Interval(this._source, this._startIdx, this._endIdx));
  }
});

// TODO: change these constructors so that (source, startIdx, endIdx) always come last.
// TODO: rename thunk to node everywhere (including this file name).

// Rule thunks

function RuleThunk(ctorName, source, startIdx, endIdx, args) {
  this.init(source, startIdx, endIdx);
  this.ctorName = ctorName;
  this.args = args;
}

RuleThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
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

// List thunks

function ListThunk(values, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.values = values;
}

ListThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  accept: function(actionDict) {
    return this.values.map(function(thunk) { return thunk.accept(actionDict); });
  },

  toJSON: function() {
    return this.values;
  }
});

// Value thunks

function ValueThunk(value, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.value = value;
}

ValueThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
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

exports.RuleThunk = RuleThunk;
exports.ListThunk = ListThunk;
exports.ValueThunk = ValueThunk;

