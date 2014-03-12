// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var thunks = require('./thunks.js')
var common = require('./common.js')
var InputStream = require('./InputStream.js')

var awlib = require('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

function PExpr() {
  throw 'PExpr cannot be instantiated -- it\'s abstract'
}

PExpr.prototype = {
  getBindingNames: function() {
    return []
  },

  producesValue: function() {
    return true
  }
}

// Anything

var anything = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    var value = inputStream.next()
    if (value === common.fail)
      return common.fail
    else
      return new thunks.ValueThunk(value)
  }
})

// Primitives

function Prim(obj) {
  this.obj = obj
}

Prim.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    if (this.match(inputStream) === common.fail)
      return common.fail
    else
      return new thunks.ValueThunk(this.obj)
  },

  match: function(inputStream) {
    return inputStream.matchExactly(this.obj)
  }
})

function StringPrim(obj) {
  this.obj = obj
}

StringPrim.prototype = objectThatDelegatesTo(Prim.prototype, {
  match: function(inputStream) {
    return inputStream.matchString(this.obj)
  }
})

function RegExpPrim(obj) {
  this.obj = obj
}

RegExpPrim.prototype = objectThatDelegatesTo(Prim.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    var origPos = inputStream.pos
    if (inputStream.matchRegExp(this.obj) === common.fail)
      return common.fail
    else
      return new thunks.ValueThunk(inputStream.source[origPos])
  }
})

// Alternation

function Alt(terms) {
  this.terms = terms
}

Alt.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var origNumBindings = bindings.length
    for (var idx = 0; idx < this.terms.length; idx++) {
      if (syntactic)
        common.skipSpaces(ruleDict, inputStream)
      var value = this.terms[idx].eval(syntactic, ruleDict, inputStream, bindings)
      if (value !== common.fail)
        return value
      else {
        inputStream.pos = origPos
        // Note: while the following assignment could be done unconditionally, only doing it when necessary is
        // better for performance. This is b/c assigning to an array's length property is more expensive than a
        // typical assignment.
        if (bindings.length > origNumBindings)
          bindings.length = origNumBindings
      }
    }
    return common.fail
  },

  getBindingNames: function() {
    // This is ok b/c all terms must have the same bindings -- this property is checked by the Grammar constructor.
    return this.terms.length === 0 ? [] : this.terms[0].getBindingNames()
  },

  producesValue: function() {
    for (var idx = 0; idx < this.terms.length; idx++)
      if (!this.terms[idx].producesValue())
        return false
    return true
  }
})

// Sequences

function Seq(factors) {
  this.factors = factors
}

Seq.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    for (var idx = 0; idx < this.factors.length; idx++) {
      if (syntactic)
        common.skipSpaces(ruleDict, inputStream)
      var factor = this.factors[idx]
      var value = factor.eval(syntactic, ruleDict, inputStream, bindings)
      if (value === common.fail)
        return common.fail
    }
    return thunks.valuelessThunk
  },

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.factors.length; idx++)
      names = names.concat(this.factors[idx].getBindingNames())
    return names.sort()
  },

  producesValue: function() {
    return false
  }
})

// Bindings

function Bind(expr, name) {
  this.expr = expr
  this.name = name
}

Bind.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var value = this.expr.eval(syntactic, ruleDict, inputStream, bindings)
    if (value !== common.fail)
      bindings.push(this.name, value)
    return value
  },

  getBindingNames: function() {
    return [this.name]
  }
})

// Iterators and optionals

function Many(expr, minNumMatches) {
  this.expr = expr
  this.minNumMatches = minNumMatches
}

Many.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var matches = []
    while (true) {
      var backtrackPos = inputStream.pos
      var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
      if (value === common.fail) {
        inputStream.pos = backtrackPos
        break
      } else
        matches.push(value)
    }
    return matches.length < this.minNumMatches ?  common.fail : new thunks.ListThunk(matches)
  }
})

function Opt(expr) {
  this.expr = expr
}

Opt.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value === common.fail) {
      inputStream.pos = origPos
      return thunks.valuelessThunk
    } else
      return new thunks.ListThunk([value])
  }
})

// Predicates

function Not(expr) {
  this.expr = expr
}

Not.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value !== common.fail)
      return common.fail
    else {
      inputStream.pos = origPos
      return thunks.valuelessThunk
    }
  },

  producesValue: function() {
    return false
  }
})

function Lookahead(expr) {
  this.expr = expr
}

Lookahead.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value !== common.fail) {
      inputStream.pos = origPos
      return value
    } else
      return common.fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  }
})

// String decomposition

function Str(expr) {
  this.expr = expr
}

Str.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    var string = inputStream.next()
    if (typeof string === 'string') {
      var stringInputStream = InputStream.newFor(string)
      var value = this.expr.eval(syntactic, ruleDict, stringInputStream, bindings)
      return value !== common.fail && stringInputStream.atEnd() ?  new thunks.ValueThunk(string) : common.fail
    } else
      return common.fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  }
})

// List decomposition

function List(expr) {
  this.expr = expr
}

List.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    var list = inputStream.next()
    if (list instanceof Array) {
      var listInputStream = InputStream.newFor(list)
      var value = this.expr.eval(syntactic, ruleDict, listInputStream, bindings)
      return value !== common.fail && listInputStream.atEnd() ?  new thunks.ValueThunk(list) : common.fail
    } else
      return common.fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  }
})

// Object decomposition

function Obj(properties, isLenient) {
  var names = properties.map(function(property) { return property.name })
  var duplicates = common.getDuplicates(names)
  if (duplicates.length > 0)
    browser.error('object pattern has duplicate property names:', duplicates)
  else {
    this.properties = properties
    this.isLenient = isLenient
  }
}

Obj.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    var obj = inputStream.next()
    if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
      var numOwnPropertiesMatched = 0
      for (var idx = 0; idx < this.properties.length; idx++) {
        var property = this.properties[idx]
        var value = obj[property.name]
        var valueInputStream = InputStream.newFor([value])
        var matched = property.pattern.eval(syntactic, ruleDict, valueInputStream, bindings) !== common.fail &&
                      valueInputStream.atEnd()
        if (!matched)
          return common.fail
        if (obj.hasOwnProperty(property.name))
          numOwnPropertiesMatched++
      }
      return this.isLenient || numOwnPropertiesMatched === Object.keys(obj).length ?
        new thunks.ValueThunk(obj) :
        common.fail
    } else
      return common.fail
  },

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.properties.length; idx++)
      names = names.concat(this.properties[idx].pattern.getBindingNames())
    return names.sort()
  }
})

// Rule application

function Apply(ruleName) {
  this.ruleName = ruleName
}

Apply.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var ruleName = this.ruleName
    var origPosInfo = inputStream.getCurrentPosInfo()
    var memoRec = origPosInfo.memo[ruleName]
    if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
      inputStream.pos = memoRec.pos
      return memoRec.value
    } else if (origPosInfo.isActive(ruleName)) {
      var currentLeftRecursion = origPosInfo.getCurrentLeftRecursion()
      if (currentLeftRecursion && currentLeftRecursion.name === ruleName) {
        origPosInfo.updateInvolvedRules()
        inputStream.pos = currentLeftRecursion.pos
        return currentLeftRecursion.value
      } else {
        origPosInfo.startLeftRecursion(ruleName)
        return common.fail
      }
    } else {
      var body = ruleDict[ruleName] || browser.error('undefined rule', ruleName)
      origPosInfo.enter(ruleName)
      var value = this.evalOnce(body, ruleDict, inputStream)
      var currentLeftRecursion = origPosInfo.getCurrentLeftRecursion()
      if (currentLeftRecursion) {
        if (currentLeftRecursion.name === ruleName) {
          value = this.handleLeftRecursion(body, ruleDict, inputStream, origPosInfo.pos, currentLeftRecursion, value)
          origPosInfo.memo[ruleName] =
            {pos: inputStream.pos, value: value, involvedRules: currentLeftRecursion.involvedRules}
          origPosInfo.endLeftRecursion(ruleName)
        } else if (!currentLeftRecursion.involvedRules[ruleName])
          // Only memoize if this rule is not involved in the current left recursion
          origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value}
      } else
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value}
      origPosInfo.exit(ruleName)
      return value
    }
  },

  evalOnce: function(expr, ruleDict, inputStream) {
    var origPos = inputStream.pos
    var bindings = []
    var value = expr.eval(common.isSyntactic(this.ruleName), ruleDict, inputStream, bindings)
    if (value === common.fail)
      return common.fail
    else
      return new thunks.RuleThunk(this.ruleName, inputStream.source, origPos, inputStream.pos, value, bindings)
  },

  handleLeftRecursion: function(body, ruleDict, inputStream, origPos, currentLeftRecursion, seedValue) {
    var value = seedValue
    if (seedValue !== common.fail) {
      currentLeftRecursion.value = seedValue
      currentLeftRecursion.pos = inputStream.pos
      while (true) {
        inputStream.pos = origPos
        value = this.evalOnce(body, ruleDict, inputStream)
        if (value !== common.fail && inputStream.pos > currentLeftRecursion.pos) {
          currentLeftRecursion.value = value
          currentLeftRecursion.pos = inputStream.pos
        } else {
          value = currentLeftRecursion.value
          inputStream.pos = currentLeftRecursion.pos
          break
        }
      }
    }
    return value
  }
})

// Rule expansion -- an implementation detail of rule extension

function Expand(ruleName, grammar) {
  if (grammar.ruleDict[ruleName] === undefined)
    browser.error('grammar', grammar.name, 'does not have a rule called', ruleName)
  else {
    this.ruleName = ruleName
    this.grammar = grammar
  }
}

Expand.prototype = objectThatDelegatesTo(PExpr.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    return this.expansion().eval(syntactic, ruleDict, inputStream, bindings)
  },

  expansion: function() {
    return this.grammar.ruleDict[this.ruleName]
  },

  getBindingNames: function() {
    return this.expansion().getBindingNames()
  },

  producesValue: function() {
    return this.expansion().producesValue()
  }
})

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makePrim = function(obj) {
  if (typeof obj === 'string' && obj.length !== 1)
    return new StringPrim(obj)
  else if (obj instanceof RegExp)
    return new RegExpPrim(obj)
  else
    return new Prim(obj)
}

exports.PExpr = PExpr
exports.anything = anything
exports.Prim = Prim
exports.StringPrim = String.Prim
exports.RegExpPrim = RegExpPrim
exports.Alt = Alt
exports.Seq = Seq
exports.Bind = Bind
exports.Many = Many
exports.Opt = Opt
exports.Not = Not
exports.Lookahead = Lookahead
exports.Str = Str
exports.List = List
exports.Obj = Obj
exports.Apply = Apply
exports.Expand = Expand

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

require('./pexprs-checks.js')
require('./pexprs-outputRecipe.js')

