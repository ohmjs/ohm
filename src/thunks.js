// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval.js')

var awlib = require('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Thunk() {
  throw 'Thunk cannot be instantiated -- it\'s abstract'
}

var nextThunkId = 0
Thunk.prototype = {
  init: function() {
    this.id = nextThunkId++
  }
}

function RuleThunk(ruleName, source, startIdx, endIdx, value, bindings) {
  this.init()
  this.ruleName = ruleName
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
  this.value = value
  this.bindings = bindings
}

RuleThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    if (!memo.hasOwnProperty(this.id)) {
      var action = this.lookupAction(actionDict)
      var addlInfo = this.createAddlInfo()
      var env = this.makeEnv(actionDict, memo)
      memo[this.id] = action.call(addlInfo, env)
    }
    return memo[this.id]
  },

  lookupAction: function(actionDict) {
    var ruleName = this.ruleName
    var action = actionDict[ruleName]
    if (action === undefined && actionDict._default !== undefined)
      action = function(env) {
        return actionDict._default.call(this, ruleName, env)
      }
    return action || browser.error('missing semantic action for', ruleName)
  },

  createAddlInfo: function() {
    return {
      interval: new Interval(this.source, this.startIdx, this.endIdx)
    }
  },

  makeEnv: function(actionDict, memo) {
    var bindings = this.bindings.length === 0 ? ['value', this.value] : this.bindings
    var env = {}
    for (var idx = 0; idx < bindings.length; idx += 2) {
      var name = bindings[idx]
      var thunk = bindings[idx + 1]
      this.addBinding(env, name, thunk, actionDict, memo)
    }
    return env
  },

  addBinding: function(env, name, value, actionDict, memo) {
    Object.defineProperty(env, name, {
      get: function() {
        if (value instanceof Thunk)
          value = value.force(actionDict, memo)
        return value
      },
      enumerable: true
    })
  }
})

function ListThunk(thunks) {
  this.init()
  this.thunks = thunks
}

ListThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    if (!memo.hasOwnProperty(this.id))
      memo[this.id] = this.thunks.map(function(thunk) { return thunk.force(actionDict, memo) })
    return memo[this.id]
  }
})

function ValueThunk(value) {
  this.value = value
}

ValueThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    return this.value
  }
})

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleThunk = RuleThunk
exports.ListThunk = ListThunk
exports.ValueThunk = ValueThunk
exports.valuelessThunk = new ValueThunk(undefined)

