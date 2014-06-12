// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval.js');

var awlib = require('awlib');
var browser = awlib.browser
var objectUtils = awlib.objectUtils
var objectThatDelegatesTo = objectUtils.objectThatDelegatesTo;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Thunk() {
  throw 'Thunk cannot be instantiated -- it\'s abstract';
}

var nextThunkId = 0;
Thunk.prototype = {
  init: function(source, startIdx, endIdx) {
    this.id = nextThunkId++;
    this._source = source;
    this._startIdx = startIdx;
    this._endIdx = endIdx;
  }
};

Object.defineProperty(Thunk.prototype, 'interval', {
  get: function() {
    return this._interval || (this._interval = new Interval(this._source, this._startIdx, this._endIdx));
  }
});

function RuleThunk(ruleName, source, startIdx, endIdx, value, bindings) {
  this.init(source, startIdx, endIdx);
  this.ruleName = ruleName;
  this.value = value;
  this.bindings = bindings;
}

RuleThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo, lazy) {
    function makeBinding(thunk) {
      var binding = {interval: thunk.interval};
      Object.defineProperty(binding, 'value', {
        get: function() {
          return thunk.force(actionDict, memo, lazy);
        }
      });
      return binding;
    }

    if (memo.hasOwnProperty(this.id)) {
      return memo[this.id];
    }

    var addlInfo = this.createAddlInfo();
    var action = this.lookupAction(actionDict);
    if (!action) {
      if (lazy) {
        browser.error('missing semantic action for', ruleName);
      } else {
        action = function() {};
      }
    }

    if (this.bindings.length === 0) {
      // This rule may or may not produce a value. If it doesn't, this.value is a value thunk w/ a value of undefined,
      // in which case it's ok to force it unconditionally.
      return memo[this.id] = action.call(addlInfo, makeBinding(this.value));
    } else {
      // The shape of this.bindings is [name1, value1, name2, value2, ...]
      var argDict = {};
      for (var idx = 0; idx < this.bindings.length; idx += 2) {
        argDict[this.bindings[idx]] = this.bindings[idx + 1];
      }
      var formals = objectUtils.formals(action);
      var isDefaultAction = formals.length === 0;
      var args = isDefaultAction ?
        objectUtils.values(argDict).map(function(arg) { return makeBinding(arg); }) :
        formals.map(function(name) { return makeBinding(argDict[name]); });
      if (!lazy) {
        // Force all bindings before applying this rule's semantic action.
        args.map(function(arg) { arg.value; });
      }
      return memo[this.id] = action.apply(addlInfo, args);
    }
  },

  lookupAction: function(actionDict) {
    var ruleName = this.ruleName;
    var action = actionDict[ruleName];
    if (action === undefined && actionDict._default !== undefined) {
      action = function() {
        return actionDict._default.call(this, ruleName, Array.prototype.slice.call(arguments));
      };
    }
    return action;
  },

  createAddlInfo: function() {
    return {
      interval: this.interval
    };
  }
});

function ListThunk(thunks, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.thunks = thunks;
}

ListThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo, lazy) {
    if (!memo.hasOwnProperty(this.id)) {
      memo[this.id] = this.thunks.map(function(thunk) { return thunk.force(actionDict, memo, lazy); });
    }
    return memo[this.id];
  }
});

function ValueThunk(value, source, startIdx, endIdx) {
  this.init(source, startIdx, endIdx);
  this.value = value;
}

ValueThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo, lazy) {
    return this.value;
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleThunk = RuleThunk;
exports.ListThunk = ListThunk;
exports.ValueThunk = ValueThunk;

