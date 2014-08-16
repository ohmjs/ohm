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

function RuleThunk(ruleName, source, startIdx, endIdx, bindings) {
  this.init(source, startIdx, endIdx);
  this.ruleName = ruleName;
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

    var args = this.bindings.map(makeBinding);
    if (!lazy) {
      // Force all bindings before applying this rule's semantic action.
      args.forEach(function(arg) { arg.value; });
    }

    var action = this.lookupAction(actionDict);
    if (!action) {
      if (lazy) {
        browser.error('missing semantic action for', this.ruleName);
      } else {
        return memo[this.id] = undefined;
      }
    }
    
    var addlInfo = this.createAddlInfo();
    return memo[this.id] = action.apply(addlInfo, args);
  },

  lookupAction: function(actionDict) {
    var ruleName = this.ruleName;
    var action = actionDict[ruleName];
    if (action === undefined && actionDict._default !== undefined) {
      action = function() {
        return actionDict._default.call(this, ruleName, Array.prototype.slice.call(arguments));
      };
      action.__isDefault__ = true;
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
console.log('ListThunk.proto', this.__proto__);
console.log('Thunk.proto', Thunk.prototype);
console.log('init', this.init);
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

