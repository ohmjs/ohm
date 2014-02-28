!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/ohm.js')
ohm._ohmGrammarFactory =
(function(ohm, optNamespace) {
  var b = ohm.builder()
  b.setName('Ohm')
  b.extend('space', b.alt(b.seq(b._('//'), b.many(b.seq(b.not(b._('\n')), b.app('_')), 0), b._('\n')), b.seq(b._('/*'), b.many(b.seq(b.not(b._('*/')), b.app('_')), 0), b._('*/'))))
  b.define('_name', b.seq(b.app('nameFirst'), b.many(b.app('nameRest'), 0)))
  b.define('nameFirst', b.alt(b._('_'), b.app('letter')))
  b.define('nameRest', b.alt(b._('_'), b.app('alnum')))
  b.define('name', b.seq(b.not(b.app('namedConst')), b.bind(b.app('_name'), 'n')))
  b.inline('namedConst-undefined', b.seq(b._('undefined'), b.not(b.app('nameRest'))))
  b.inline('namedConst-null', b.seq(b._('null'), b.not(b.app('nameRest'))))
  b.inline('namedConst-true', b.seq(b._('true'), b.not(b.app('nameRest'))))
  b.inline('namedConst-false', b.seq(b._('false'), b.not(b.app('nameRest'))))
  b.define('namedConst', b.alt(b.app('namedConst-undefined'), b.app('namedConst-null'), b.app('namedConst-true'), b.app('namedConst-false')))
  b.define('string', b.seq(b._("'"), b.bind(b.many(b.app('sChar'), 0), 'cs'), b._("'")))
  b.define('sChar', b.alt(b.seq(b._('\\x'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b._('\\u'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b._('\\'), b.app('_')), b.seq(b.not(b._("'")), b.app('_'))))
  b.define('regexp', b.seq(b._('/'), b.bind(b.app('reCharClass'), 'e'), b._('/')))
  b.define('reCharClass', b.seq(b._('['), b.many(b.alt(b._('\\]'), b.seq(b.not(b._(']')), b.app('_'))), 0), b._(']')))
  b.define('number', b.seq(b.opt(b._('-')), b.many(b.app('digit'), 1)))
  b.inline('Alt-rec', b.seq(b.bind(b.app('Term'), 'x'), b._('|'), b.bind(b.app('Alt'), 'y')))
  b.define('Alt', b.alt(b.app('Alt-rec'), b.app('Term')))
  b.inline('Term-inline', b.seq(b.bind(b.app('Seq'), 'x'), b._('{'), b.bind(b.app('_name'), 'n'), b._('}')))
  b.define('Term', b.alt(b.app('Term-inline'), b.app('Seq')))
  b.define('Seq', b.many(b.app('Factor'), 0))
  b.inline('Factor-bind', b.seq(b.bind(b.app('Iter'), 'x'), b._('.'), b.bind(b.app('name'), 'n')))
  b.define('Factor', b.alt(b.app('Factor-bind'), b.app('Iter')))
  b.inline('Iter-star', b.seq(b.bind(b.app('Pred'), 'x'), b._('*')))
  b.inline('Iter-plus', b.seq(b.bind(b.app('Pred'), 'x'), b._('+')))
  b.inline('Iter-opt', b.seq(b.bind(b.app('Pred'), 'x'), b._('?')))
  b.define('Iter', b.alt(b.app('Iter-star'), b.app('Iter-plus'), b.app('Iter-opt'), b.app('Pred')))
  b.inline('Pred-not', b.seq(b._('~'), b.bind(b.app('Base'), 'x')))
  b.inline('Pred-lookahead', b.seq(b._('&'), b.bind(b.app('Base'), 'x')))
  b.define('Pred', b.alt(b.app('Pred-not'), b.app('Pred-lookahead'), b.app('Base')))
  b.inline('Base-application', b.seq(b.bind(b.app('name'), 'ruleName'), b.not(b.alt(b._('=='), b._(':='), b._('+=')))))
  b.inline('Base-prim', b.bind(b.alt(b.app('namedConst'), b.app('string'), b.app('regexp'), b.app('number')), 'x'))
  b.inline('Base-lst', b.seq(b._('['), b.bind(b.app('Alt'), 'x'), b._(']')))
  b.inline('Base-str', b.seq(b._('"'), b.bind(b.app('Alt'), 'x'), b._('"')))
  b.inline('Base-paren', b.seq(b._('('), b.bind(b.app('Alt'), 'x'), b._(')')))
  b.inline('Base-obj', b.seq(b._('{'), b.bind(b.opt(b._('...')), 'lenient'), b._('}')))
  b.inline('Base-objWithProps', b.seq(b._('{'), b.bind(b.app('Props'), 'ps'), b.bind(b.opt(b.seq(b._(','), b._('...'))), 'lenient'), b._('}')))
  b.define('Base', b.alt(b.app('Base-application'), b.app('Base-prim'), b.app('Base-lst'), b.app('Base-str'), b.app('Base-paren'), b.app('Base-obj'), b.app('Base-objWithProps')))
  b.inline('Props-rec', b.seq(b.bind(b.app('Prop'), 'p'), b._(','), b.bind(b.app('Props'), 'ps')))
  b.inline('Props-base', b.bind(b.app('Prop'), 'p'))
  b.define('Props', b.alt(b.app('Props-rec'), b.app('Props-base')))
  b.define('Prop', b.seq(b.bind(b.alt(b.app('_name'), b.app('string')), 'n'), b._(':'), b.bind(b.app('Factor'), 'p')))
  b.inline('Rule-define', b.seq(b.bind(b.app('RuleName'), 'n'), b._('=='), b.bind(b.app('Alt'), 'b')))
  b.inline('Rule-override', b.seq(b.bind(b.app('RuleName'), 'n'), b._(':='), b.bind(b.app('Alt'), 'b')))
  b.inline('Rule-extend', b.seq(b.bind(b.app('RuleName'), 'n'), b._('+='), b.bind(b.app('Alt'), 'b')))
  b.define('Rule', b.alt(b.app('Rule-define'), b.app('Rule-override'), b.app('Rule-extend')))
  b.define('RuleName', b.app('name'))
  b.inline('SuperGrammar-qualified', b.seq(b._('<:'), b.bind(b.app('name'), 'ns'), b._('.'), b.bind(b.app('name'), 'n')))
  b.inline('SuperGrammar-unqualified', b.seq(b._('<:'), b.bind(b.app('name'), 'n')))
  b.define('SuperGrammar', b.alt(b.app('SuperGrammar-qualified'), b.app('SuperGrammar-unqualified')))
  b.define('Grammar', b.seq(b.bind(b.app('GrammarName'), 'n'), b.bind(b.opt(b.app('SuperGrammar')), 's'), b._('{'), b.bind(b.many(b.app('Rule'), 0), 'rs'), b._('}')))
  b.define('Grammars', b.many(b.app('Grammar'), 0))
  b.define('GrammarName', b.app('name'))
  return b.build(optNamespace)
})

},{"../src/ohm.js":7}],2:[function(_dereq_,module,exports){
exports.objectUtils = _dereq_('./objectUtils.js')
exports.stringUtils = _dereq_('./stringUtils.js')
exports.equals = _dereq_('./equals.js')
exports.browser = _dereq_('./browser.js')

},{"./browser.js":3,"./equals.js":4,"./objectUtils.js":5,"./stringUtils.js":6}],3:[function(_dereq_,module,exports){
var thisModule = exports

// --------------------------------------------------------------------
// Logging
// --------------------------------------------------------------------

var subscribed = {}

exports.log = function(subject /* , ... */) {
  if (!subscribed[subject])
    return
  arguments[0] = '[' + subject + ']'
  console.log.apply(console, arguments)
}

exports.subscribe = function(subject) {
  subscribed[subject] = true
}

exports.unsubscribe = function(subject) {
  delete showing[subject]
}

// --------------------------------------------------------------------
// Asserts, errors, etc.
// --------------------------------------------------------------------

exports.error = function(/* arg1, arg2, ... */) {
  var args = Array.prototype.slice.call(arguments)
  console.error.apply(console, args)
  throw 'error: ' + args.join(' ')
}

exports.sanityCheck = function(name, condition) {
  if (!condition)
    thisModule.error('failed sanity check:', name)
}

// --------------------------------------------------------------------
// DOM utils
// --------------------------------------------------------------------

exports.prettyPrintNode = function(node, endNode, endOffset) {
  if (node instanceof Text) {
    if (node === endNode)
      return 'text{' + node.data.substr(0, endOffset) + '|' + node.data.substr(endOffset) + '}'
    else
      return 'text{' + node.data + '}'
  }

  var parts = [node.tagName, '{']
  for (var idx = 0; idx < node.childNodes.length; idx++) {
    if (node === endNode && endOffset == idx)
      parts.push('|')
    parts.push(thisModule.prettyPrintNode(node.childNodes.item(idx), endNode, endOffset))
  }
  if (node === endNode && endOffset == node.childNodes.length)
    parts.push('|')
  parts.push('}')
  return parts.join('')
}


},{}],4:[function(_dereq_,module,exports){
// Helpers

function doubleEquals(x, y) {
  return x == y
}

function tripleEquals(x, y) {
  return x === y
}

function isPrimitive(x) {
  var type = typeof x
  return type !== 'object'
}

function equals(x, y, deep, eqFn) {
  if (isPrimitive(x))
    return eqFn(x, y)
  for (var p in x)
    if (deep && !equals(x[p], y[p], deep, eqFn) ||
        !deep && !eqFn(x[p], y[p]))
      return false
  for (var p in y)
    if (y[p] !== undefined &&
        x[p] === undefined)
      return false
  return true
}

function haveSameContentsInAnyOrder(arr1, arr2, deep, eqFn) {
  if (!arr1 instanceof Array || !arr2 instanceof Array ||
      arr1.length !== arr2.length)
    return false
  for (var idx = 0; idx < arr1.length; idx++) {
    var x = arr1[idx]
    var foundX = arr2.some(function(y) {
      return equals(x, y, deep, eqFn)
    })
    if (!foundX)
      return false
  }
  return true
}

// Public methods

exports.equals = function(x, y) {
  return equals(x, y, false, doubleEquals)
}

exports.deepEquals = function(x, y) {
  return equals(x, y, true, doubleEquals)
}

exports.strictEquals = function(x, y) {
  return equals(x, y, false, tripleEquals)
}

exports.strictDeepEquals = function(x, y) {
  return equals(x, y, true, tripleEquals)
}

exports.haveSameContentsInAnyOrder = function(arr1, arr2) {
  return haveSameContentsInAnyOrder(arr1, arr2, true, doubleEquals)
}


},{}],5:[function(_dereq_,module,exports){
var thisModule = exports

exports.objectThatDelegatesTo = function(obj, optProperties) {
  function cons() {}
  cons.prototype = obj
  var ans = new cons()
  if (optProperties)
    thisModule.keysAndValuesDo(optProperties, function(k, v) {
      ans[k] = v
    })
  return ans
}

exports.formals = function(func) {
  return func.
    toString().
    match(/\((.*?)\)/)[0].
    replace(/ /g, '').
    slice(1, -1).
    split(',').
    filter(function(moduleName) { return moduleName != '' })
}

exports.keysDo = function(object, fn) {
  for (var p in object)
    if (object.hasOwnProperty(p))
      fn(p)
}

exports.valuesDo = function(object, fn) {
  thisModule.keysDo(object, function(p) { fn(object[p]) })
}

exports.keysAndValuesDo = function(object, fn) {
  thisModule.keysDo(object, function(p) { fn(p, object[p]) })
}

exports.keysIterator = function(object) {
  return function(fn) { self.keysDo(object, fn) }
}

exports.valuesIterator = function(object) {
  return function(fn) { self.valuesDo(object, fn) }
}

exports.keysAndValuesIterator = function(object) {
  return function(fn) { self.keysAndValuesDo(object, fn) }
}

exports.values = function(object) {
  var ans = []
  thisModule.keysDo(object, function(p) { ans.push(object[p]) })
  return ans
}

function StringBuffer() {
  this.strings = []
  this.lengthSoFar = 0
  for (var idx = 0; idx < arguments.length; idx++)
    this.nextPutAll(arguments[idx])
}

StringBuffer.prototype = {
  nextPutAll: function(s) {
    this.strings.push(s)
    this.lengthSoFar += s.length
  },

  contents: function()  {
    return this.strings.join('')
  }
}

exports.StringBuffer = StringBuffer


},{}],6:[function(_dereq_,module,exports){
var objectUtils = _dereq_('./objectUtils.js')
var thisModule = exports

// Helpers

function pad(numberAsString, len) {
  var zeros = []
  for (var idx = 0; idx < numberAsString.length - len; idx++)
    zeros.push('0')
  return zeros.join('') + numberAsString
}

var escapeStringFor = {}
for (var c = 0; c < 128; c++)
  escapeStringFor[c] = String.fromCharCode(c)
escapeStringFor["'".charCodeAt(0)]  = "\\'"
escapeStringFor['"'.charCodeAt(0)]  = '\\"'
escapeStringFor['\\'.charCodeAt(0)] = '\\\\'
escapeStringFor['\b'.charCodeAt(0)] = '\\b'
escapeStringFor['\f'.charCodeAt(0)] = '\\f'
escapeStringFor['\n'.charCodeAt(0)] = '\\n'
escapeStringFor['\r'.charCodeAt(0)] = '\\r'
escapeStringFor['\t'.charCodeAt(0)] = '\\t'
escapeStringFor['\v'.charCodeAt(0)] = '\\v'

// Public methods

exports.escapeChar = function(c, optDelim) {
  var charCode = c.charCodeAt(0)
  if ((c == '"' || c == "'") && optDelim && c !== optDelim)
    return c
  else if (charCode < 128)
    return escapeStringFor[charCode]
  else if (128 <= charCode && charCode < 256)
    return '\\x' + pad(charCode.toString(16), 2)
  else
    return '\\u' + pad(charCode.toString(16), 4)
}

exports.unescapeChar = function(s) {
  if (s.charAt(0) == '\\')
    switch (s.charAt(1)) {
      case 'b':  return '\b'
      case 'f':  return '\f'
      case 'n':  return '\n'
      case 'r':  return '\r'
      case 't':  return '\t'
      case 'v':  return '\v'
      case 'x':  return String.fromCharCode(parseInt(s.substring(2, 4), 16))
      case 'u':  return String.fromCharCode(parseInt(s.substring(2, 6), 16))
      default:   return s.charAt(1)
    }
  else
    return s
}

function printOn(x, ws) {
  if (x instanceof Array) {
    ws.nextPutAll('[')
    for (var idx = 0; idx < x.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      printOn(x[idx], ws)
    }
    ws.nextPutAll(']')
  } else if (typeof x === 'string') {
    var hasSingleQuotes = x.indexOf("'") >= 0
    var hasDoubleQuotes = x.indexOf('"') >= 0
    var delim = hasSingleQuotes && !hasDoubleQuotes ? '"' : "'"
    ws.nextPutAll(delim)
    for (var idx = 0; idx < x.length; idx++)
      ws.nextPutAll(thisModule.escapeChar(x[idx], delim))
    ws.nextPutAll(delim)
  } else if (x === null) {
    ws.nextPutAll('null')
  } else if (typeof x === 'object' && !(x instanceof RegExp)) {
    ws.nextPutAll('{')
    var first = true
    objectUtils.keysAndValuesDo(x, function(k, v) {
      if (first)
        first = false
      else
        ws.nextPutAll(', ')
      printOn(k, ws)
      ws.nextPutAll(': ')
      printOn(v, ws)
    })
    ws.nextPutAll('}')
  } else
    ws.nextPutAll('' + x)
}

exports.printString = function(obj) {
  var ws = new objectUtils.StringBuffer()
  printOn(obj, ws)
  return ws.contents()
}


},{"./objectUtils.js":5}],7:[function(_dereq_,module,exports){
/*

TODO:

* Think about improving the implementation of syntactic rules' automatic space skipping:
  -- Could keep track of the current rule name by modifying the code (in Apply.eval) where enter and exit methods
     are called. (Would also want to keep track of whether the rule is syntactic to avoid re-doing that work
     at each application.)

* Consider borrowing (something like) the variable-not-otherwise-mentioned idea from Robby Findler's redex, as a way
  to make it easier for programmers to deal with keywords and identifiers.

* Think about a better way to deal with lists
  -- Built-in list operator?
  -- Parameterized rules?

* Improve test coverage
  -- Add tests for scoping, e.g., "foo:a [bar:b baz:c]:d" should have 4 bindings.
     (Same kind of thing for nested string and lookahead expressions, their bindings should leak to the enclosing seq.)

* Think about foreign rule invocation
  -- Can't just be done in the same way as in OMeta b/c of the actionDict
  -- Will want to preserve the "no unnecessary semantic actions" guarantee
  -- The solution might be to enable the programmer to provide multiple actionDicts,
     but I'll have to come up with a convenient way to associate each with a particular grammar.

* Think about incremental parsing (good for editors)
  -- Basic idea: keep track of max index seen to compute a result
     (store this in memo rec as an int relative to curr pos)
  -- Ok to reuse memoized value as long as range from current index to max index hasn't changed
  -- Could be a cute workshop paper...


Syntax / language ideas:

* Syntax for rule declarations:

    foo == bar baz     (define)
    foo := bar baz     (override / replace)
    foo <= bar baz     (extend)

* Inline rules, e.g.,

    addExpr = addExpr:x '+' mulExpr:y {plus}
            | addExpr:x '-' mulExpr:y {minus}
            | mulExpr

  is syntactic sugar for

    addExpr = plus | minus | mulExpr,
    plus = addExpr:x '+' mulExpr:y,
    minus = addExpr:x '-' mulExpr:y

* In this example:

    foo = "bar"
    bar = 'abc'

  The foo rule says it wants the bar rule to match the contents of a string object. (The "s is a kind of parenthesis.)
  Then you could either say

    m.matchAll('abc', 'bar')

  or

    m.match('abc', 'foo')

  Both should succeed.

* About object matching

  Some issues:
  -- Should definitely allow pattern matching on each property's value. But what about property names?
  -- What to do about unspecified properties?
  -- Syntax: JSON uses colons to separate property names and values. Will look bad w/ bindings, e.g.,
     {foo: number:n} (ewwww)

  Current strawman:
  -- Require property names to be string literals (not patterns), only allow pattern matching on their values.
  -- Allow an optional '...' as the last pattern, that would match any unspecified properties.
       {'foo': number, 'bar': string, 'baz': 5, ...}
     Might even allow the ... to be bound to a variable that would contain all of those properties.
  -- Consider changing binding syntax from expr:name to expr.name
     (More JSON-friendly, but it doesn't work well with ... syntax. But maybe it's not so important to be able to bind
     the rest of the properties and values anyway, since you can always bind the entire object.)


Optimization ideas:

* Optimize 'binds' -- should pre-allocate an array of bindings instead of doing pushes, throwing away arrays on fail
  (see Alt), etc.

* Consider adding an additional code generation step that generates efficient code from the ASTs, instead of
  interpreting them directly.

* Don't bother creating thunks / lists of thunks when value is not needed (OMeta did this)
  -- E.g., in "foo = space* bar" the result of space* is not needed, so don't bother creating a list of thunks / values
  -- Could just return undefined (anything except fail)

* Get rid of unnecessary Seqs and Alts (OMeta did this too)

*/

// --------------------------------------------------------------------
// Dependencies
// --------------------------------------------------------------------

_dereq_('../dist/ohm-grammar.js')

var awlib = _dereq_('awlib')
var objectUtils = awlib.objectUtils
var stringUtils = awlib.stringUtils
var browser = awlib.browser
var equals = awlib.equals

// --------------------------------------------------------------------
// Helpers, etc.
// --------------------------------------------------------------------

var thisModule = exports

var fail = {}

function getDuplicates(array) {
  var duplicates = []
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx]
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0)
      duplicates.push(x)
  }
  return duplicates
}

function abstract() {
  throw 'this method is abstract!'
}

function isSyntactic(ruleName) {
  var firstChar = ruleName[0]
  return 'A' <= firstChar && firstChar <= 'Z'
}

var _applySpaces
function skipSpaces(ruleDict, inputStream) {
  (_applySpaces || (_applySpaces = new Apply('spaces'))).eval(false, ruleDict, inputStream, undefined)
}

// --------------------------------------------------------------------
// Input streams
// --------------------------------------------------------------------

function InputStream() {
  throw 'InputStream cannot be instantiated -- it\'s abstract'
}

InputStream.newFor = function(obj) {
  if (typeof obj === 'string')
    return new StringInputStream(obj)
  else if (obj instanceof Array)
    return new ListInputStream(obj)
  else
    throw 'cannot make input stream for ' + obj
}

InputStream.prototype = {
  init: function(source) {
    this.source = source
    this.pos = 0
    this.posInfos = []
  },

  getCurrentPosInfo: function() {
    var currPos = this.pos
    var posInfo = this.posInfos[currPos]
    return posInfo || (this.posInfos[currPos] = new PosInfo(currPos))
  },

  atEnd: function() {
    return this.pos === this.source.length
  },

  next: function() {
    return this.atEnd() ? fail : this.source[this.pos++]
  },

  matchExactly: function(x) {
    return this.next() === x ? true : fail
  },

  interval: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx)
  }
}

function StringInputStream(source) {
  this.init(source)
}

StringInputStream.prototype = objectUtils.objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    for (var idx = 0; idx < s.length; idx++)
      if (this.matchExactly(s[idx]) === fail)
        return fail
    return true
  },

  matchRegExp: function(e) {
    // IMPORTANT: e must be a non-global, one-character expression, e.g., /./ and /[0-9]/
    var c = this.next()
    return c !== fail && e.test(c) ? true : fail
  }
})

function ListInputStream(source) {
  this.init(source)
}

ListInputStream.prototype = objectUtils.objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    return this.matchExactly(s)
  },
    
  matchRegExp: function(e) {
    return this.matchExactly(e)
  }
})

function PosInfo(pos) {
  this.pos = pos
  this.ruleStack = []
  this.activeRules = {}  // redundant data (could be generated from ruleStack), exists for performance reasons
  this.memo = {}
}

PosInfo.prototype = {
  isActive: function(ruleName) {
    return this.activeRules[ruleName]
  },

  enter: function(ruleName) {
    this.ruleStack.push(ruleName)
    this.activeRules[ruleName] = true
  },

  exit: function(ruleName) {
    this.ruleStack.pop()
    this.activeRules[ruleName] = false
  },

  shouldUseMemoizedResult: function(memoRec) {
    var involvedRules = memoRec.involvedRules
    for (var ruleName in involvedRules)
      if (involvedRules[ruleName] && this.activeRules[ruleName])
        return false
    return true
  },

  getCurrentLeftRecursion: function() {
    return this.leftRecursionStack ? this.leftRecursionStack[this.leftRecursionStack.length - 1] : undefined
  },

  startLeftRecursion: function(ruleName) {
    if (!this.leftRecursionStack)
      this.leftRecursionStack = []
    this.leftRecursionStack.push({name: ruleName, value: fail, pos: -1, involvedRules: {}})
    this.updateInvolvedRules()
  },

  endLeftRecursion: function(ruleName) {
    this.leftRecursionStack.pop()
  },

  updateInvolvedRules: function() {
    var currentLeftRecursion = this.getCurrentLeftRecursion()
    var involvedRules = currentLeftRecursion.involvedRules
    var lrRuleName = currentLeftRecursion.name
    var idx = this.ruleStack.length - 1
    while (true) {
      var ruleName = this.ruleStack[idx--]
      if (ruleName === lrRuleName)
        break
      involvedRules[ruleName] = true
    }
  }
}

// --------------------------------------------------------------------
// Intervals
// --------------------------------------------------------------------

function Interval(source, startIdx, endIdx) {
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
}

Interval.prototype = {
  contents: function() {
    return InputStream.newFor(this.source).interval(this.startIdx, this.endIdx)
  },

  onlyElement: function() {
    if (this.startIdx + 1 !== this.endIdx)
      browser.error('interval', this, 'was expected to contain only one element')
    else
      return this.source[this.startIdx]
  }
}

// --------------------------------------------------------------------
// Thunks
// --------------------------------------------------------------------

var nextThunkId = 0

function RuleThunk(ruleName, source, startIdx, endIdx, value, bindings) {
  this.id = nextThunkId++
  this.ruleName = ruleName
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
  this.value = value
  this.bindings = bindings
}

RuleThunk.prototype = {
  force: function(actionDict, memo) {
    if (memo.hasOwnProperty(this.id))
      return memo[this.id]
    var action = this.lookupAction(actionDict)
    var addlInfo = this.createAddlInfo()
    if (this.bindings.length === 0)
      return memo[this.id] = action.call(addlInfo, this.value.force(actionDict, memo))
    else {
      var argDict = {}
      for (var idx = 0; idx < this.bindings.length; idx += 2)
        argDict[this.bindings[idx]] = this.bindings[idx + 1]
      var formals = objectUtils.formals(action)
      var args = formals.length == 0 ?
        objectUtils.values(argDict).map(function(arg) { return arg.force(actionDict, memo) }) :
        formals.map(function(name) { return argDict[name].force(actionDict, memo) })
      return memo[this.id] = action.apply(addlInfo, args)
    }
  },

  lookupAction: function(actionDict) {
    var ruleName = this.ruleName
    var action = actionDict[ruleName]
    if (action === undefined && actionDict._default !== undefined)
      action = function() {
        return actionDict._default.apply(this, [ruleName].concat(Array.prototype.slice.call(arguments)))
      }
    return action || browser.error('missing semantic action for', ruleName)
  },

  createAddlInfo: function() {
    return {
      interval: new Interval(this.source, this.startIdx, this.endIdx)
    }
  }
}

function ListThunk(thunks) {
  this.id = nextThunkId++
  this.thunks = thunks
}

ListThunk.prototype = {
  force: function(actionDict, memo) {
    if (memo.hasOwnProperty(this.id))
      return memo[this.id]
    else
      return memo[this.id] = this.thunks.map(function(thunk) { return thunk.force(actionDict, memo) })
  }
}

function ValueThunk(value) {
  this.value = value
}

ValueThunk.prototype = {
  force: function(actionDict, memo) {
    return this.value
  }
}

var valuelessThunk = new ValueThunk(undefined)

// --------------------------------------------------------------------
// Types of patterns
// --------------------------------------------------------------------

// General stuff

function Pattern() {
  throw 'Pattern cannot be instantiated -- it\'s abstract'
}

Pattern.prototype = {
  semanticActionArgNames: function() {
    // TODO: think about this, it doesn't seem right.
    // E.g., suppose you have:
    //   rule == ~foo bar | ~baz qux
    // Both choices are seqs, and therefore have no value. But the rule's semantic action will require one.
    var names = this.getBindingNames()
    return names.length > 0 ? names : ['value']
  },

  getBindingNames: function() {
    return []
  },

  assertNoDuplicateBindings: abstract,
  assertChoicesHaveUniformBindings: abstract,

  outputRecipe: abstract
}

// Anything

var anything = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var value = inputStream.next()
    if (value === fail)
      return fail
    else
      return new ValueThunk(value)
  },

  assertNoDuplicateBindings: function(ruleName) {},
  assertChoicesHaveUniformBindings: function(ruleName) {},

  outputRecipe: function(ws) {
    // no-op
  }
})

// Primitives

function Prim(obj) {
  this.obj = obj
}

Prim.newFor = function(obj) {
  if (typeof obj === 'string' && obj.length !== 1)
    return new StringPrim(obj)
  else if (obj instanceof RegExp)
    return new RegExpPrim(obj)
  else
    return new Prim(obj)
}
    
Prim.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    if (this.match(inputStream) === fail)
      return fail
    else
      return new ValueThunk(this.obj)
  },

  match: function(inputStream) {
    return inputStream.matchExactly(this.obj)
  },

  assertNoDuplicateBindings: function(ruleName) {},
  assertChoicesHaveUniformBindings: function(ruleName) {},

  outputRecipe: function(ws) {
    ws.nextPutAll('b._(')
    ws.nextPutAll(stringUtils.printString(this.obj))
    ws.nextPutAll(')')
  }
})

function StringPrim(obj) {
  this.obj = obj
}

StringPrim.prototype = objectUtils.objectThatDelegatesTo(Prim.prototype, {
  match: function(inputStream) {
    return inputStream.matchString(this.obj)
  }
})

function RegExpPrim(obj) {
  this.obj = obj
}

RegExpPrim.prototype = objectUtils.objectThatDelegatesTo(Prim.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var origPos = inputStream.pos
    if (inputStream.matchRegExp(this.obj) === fail)
      return fail
    else
      return new ValueThunk(inputStream.source[origPos])
  }
})

// Alternation

function Alt(terms) {
  this.terms = terms
}

Alt.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var origNumBindings = bindings.length
    for (var idx = 0; idx < this.terms.length; idx++) {
      if (syntactic)
        skipSpaces(ruleDict, inputStream)
      var value = this.terms[idx].eval(syntactic, ruleDict, inputStream, bindings)
      if (value !== fail)
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
    return fail
  },

  getBindingNames: function() {
    // This is ok b/c all terms must have the same bindings -- this property is checked by the Grammar constructor.
    return this.terms.length === 0 ? [] : this.terms[0].getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    for (var idx = 0; idx < this.terms.length; idx++)
      this.terms[idx].assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    if (this.terms.length === 0)
      return
    var names = this.terms[0].getBindingNames()
    for (var idx = 0; idx < this.terms.length; idx++) {
      var term = this.terms[idx]
      term.assertChoicesHaveUniformBindings()
      var otherNames = term.getBindingNames()
      if (!equals.equals(names, otherNames))
        browser.error('rule', ruleName, 'has an alt with inconsistent bindings:', names, 'vs', otherNames)
    }
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.alt(')
    for (var idx = 0; idx < this.terms.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      this.terms[idx].outputRecipe(ws)
    }
    ws.nextPutAll(')')
  }
})

// Sequences

function Seq(factors) {
  this.factors = factors
}

Seq.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    for (var idx = 0; idx < this.factors.length; idx++) {
      if (syntactic)
        skipSpaces(ruleDict, inputStream)
      var factor = this.factors[idx]
      var value = factor.eval(syntactic, ruleDict, inputStream, bindings)
      if (value === fail)
        return fail
    }
    return valuelessThunk
  },

  semanticActionArgNames: function() {
    // Override Pattern's implementation, which would return ['value'] when there are no bindings.
    return this.getBindingNames()
  },

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.factors.length; idx++)
      names = names.concat(this.factors[idx].getBindingNames())
    return names.sort()
  },

  assertNoDuplicateBindings: function(ruleName) {
    for (var idx = 0; idx < this.factors.length; idx++)
      this.factors[idx].assertNoDuplicateBindings(ruleName)

    var duplicates = getDuplicates(this.getBindingNames())
    if (duplicates.length > 0)
      browser.error('rule', ruleName, 'has duplicate bindings:', duplicates)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    for (var idx = 0; idx < this.factors.length; idx++)
      this.factors[idx].assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.seq(')
    for (var idx = 0; idx < this.factors.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      this.factors[idx].outputRecipe(ws)
    }
    ws.nextPutAll(')')
  }
})

// Bindings

function Bind(expr, name) {
  this.expr = expr
  this.name = name
}

Bind.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var value = this.expr.eval(syntactic, ruleDict, inputStream, bindings)
    if (value !== fail)
      bindings.push(this.name, value)
    return value
  },

  getBindingNames: function() {
    return [this.name]
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.bind(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(', ')
    ws.nextPutAll(stringUtils.printString(this.name))
    ws.nextPutAll(')')
  }
})

// Iterators and optionals

function Many(expr, minNumMatches) {
  this.expr = expr
  this.minNumMatches = minNumMatches
}

Many.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var matches = []
    while (true) {
      var backtrackPos = inputStream.pos
      var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
      if (value === fail) {
        inputStream.pos = backtrackPos
        break
      } else
        matches.push(value)
    }
    return matches.length < this.minNumMatches ?  fail : new ListThunk(matches)
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.many(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(', ')
    ws.nextPutAll(this.minNumMatches)
    ws.nextPutAll(')')
  }
})

function Opt(expr) {
  this.expr = expr
}

Opt.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value === fail) {
      inputStream.pos = origPos
      return valuelessThunk
    } else
      return new ListThunk([value])
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.opt(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// Predicates

function Not(expr) {
  this.expr = expr
}

Not.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value !== fail)
      return fail
    else {
      inputStream.pos = origPos
      return valuelessThunk
    }
  },

  semanticActionArgNames: function() {
    // Override Pattern's implementation, which would return ['value'] instead.
    return []
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.not(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

function Lookahead(expr) {
  this.expr = expr
}

Lookahead.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    var origPos = inputStream.pos
    var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
    if (value !== fail) {
      inputStream.pos = origPos
      return value
    } else
      return fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.la(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// String decomposition

function Str(expr) {
  this.expr = expr
}

Str.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var string = inputStream.next()
    if (typeof string === 'string') {
      var stringInputStream = new StringInputStream(string)
      var value = this.expr.eval(syntactic, ruleDict, stringInputStream, bindings)
      return value !== fail && stringInputStream.atEnd() ?  new ValueThunk(string) : fail
    } else
      return fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.str(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// List decomposition

function List(expr) {
  this.expr = expr
}

List.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var list = inputStream.next()
    if (list instanceof Array) {
      var listInputStream = new ListInputStream(list)
      var value = this.expr.eval(syntactic, ruleDict, listInputStream, bindings)
      return value !== fail && listInputStream.atEnd() ?  new ValueThunk(list) : fail
    } else
      return fail
  },

  getBindingNames: function() {
    return this.expr.getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expr.assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    return this.expr.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.lst(')
    this.expr.outputRecipe(ws)
    ws.nextPutAll(')')
  }
})

// Object decomposition

function Obj(properties, isLenient) {
  var names = properties.map(function(property) { return property.name })
  var duplicates = getDuplicates(names)
  if (duplicates.length > 0)
    browser.error('object pattern has duplicate property names:', duplicates)
  else {
    this.properties = properties
    this.isLenient = isLenient
  }
}

Obj.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    if (syntactic)
      skipSpaces(ruleDict, inputStream)
    var obj = inputStream.next()
    if (obj !== fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
      var numOwnPropertiesMatched = 0
      for (var idx = 0; idx < this.properties.length; idx++) {
        var property = this.properties[idx]
        var value = obj[property.name]
        var valueInputStream = new ListInputStream([value])
        var matched =
          property.pattern.eval(syntactic, ruleDict, valueInputStream, bindings) !== fail && valueInputStream.atEnd()
        if (!matched)
          return fail
        if (obj.hasOwnProperty(property.name))
          numOwnPropertiesMatched++
      }
      return this.isLenient || numOwnPropertiesMatched === Object.keys(obj).length ?
        new ValueThunk(obj) :
        fail
    } else
      return fail
  },

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.properties.length; idx++)
      names = names.concat(this.properties[idx].pattern.getBindingNames())
    return names.sort()
  },

  assertNoDuplicateBindings: function(ruleName) {
    for (var idx = 0; idx < this.properties.length; idx++)
      this.properties[idx].pattern.assertNoDuplicateBindings(ruleName)

    var duplicates = getDuplicates(this.getBindingNames())
    if (duplicates.length > 0)
      browser.error('rule', ruleName, 'has an object pattern with duplicate bindings:', duplicates)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    for (var idx = 0; idx < this.properties.length; idx++)
      this.properties[idx].pattern.assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    function outputPropertyRecipe(prop) {
      ws.nextPutAll('{name: ')
      ws.nextPutAll(stringUtils.printString(prop.name))
      ws.nextPutAll(', pattern: ')
      prop.pattern.outputRecipe(ws)
      ws.nextPutAll('}')
    }

    ws.nextPutAll('b.obj([')
    for (var idx = 0; idx < this.properties.length; idx++) {
      if (idx > 0)
        ws.nextPutAll(', ')
      outputPropertyRecipe(this.properties[idx])
    }
    ws.nextPutAll('], ')
    ws.nextPutAll(stringUtils.printString(!!this.isLenient))
    ws.nextPutAll(')')
  }
})

// Rule application

function Apply(ruleName) {
  this.ruleName = ruleName
}

Apply.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
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
        return fail
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
    var value = expr.eval(isSyntactic(this.ruleName), ruleDict, inputStream, bindings)
    if (value === fail)
      return fail
    else
      return new RuleThunk(this.ruleName, inputStream.source, origPos, inputStream.pos, value, bindings)
  },

  handleLeftRecursion: function(body, ruleDict, inputStream, origPos, currentLeftRecursion, seedValue) {
    var value = seedValue
    if (seedValue !== fail) {
      currentLeftRecursion.value = seedValue
      currentLeftRecursion.pos = inputStream.pos
      while (true) {
        inputStream.pos = origPos
        value = this.evalOnce(body, ruleDict, inputStream)
        if (value !== fail && inputStream.pos > currentLeftRecursion.pos) {
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
  },

  assertNoDuplicateBindings: function(ruleName) {},
  assertChoicesHaveUniformBindings: function(ruleName) {},

  outputRecipe: function(ws) {
    ws.nextPutAll('b.app(')
    ws.nextPutAll(stringUtils.printString(this.ruleName))
    ws.nextPutAll(')')
  }
})

// Rule expansion -- an implementation detail of rule extension

function _Expand(ruleName, grammar) {
  if (grammar.ruleDict[ruleName] === undefined)
    browser.error('grammar', grammar.name, 'does not have a rule called', ruleName)
  else {
    this.ruleName = ruleName
    this.grammar = grammar
  }
}

_Expand.prototype = objectUtils.objectThatDelegatesTo(Pattern.prototype, {
  eval: function(syntactic, ruleDict, inputStream, bindings) {
    return this.expansion().eval(syntactic, ruleDict, inputStream, bindings)
  },

  expansion: function() {
    return this.grammar.ruleDict[this.ruleName]
  },

  getBindingNames: function() {
    return this.expansion().getBindingNames()
  },

  assertNoDuplicateBindings: function(ruleName) {
    this.expansion().assertNoDuplicateBindings(ruleName)
  },

  assertChoicesHaveUniformBindings: function(ruleName) {
    this.expansion().assertChoicesHaveUniformBindings(ruleName)
  },

  outputRecipe: function(ws) {
    // no-op
  }
})

// --------------------------------------------------------------------
// Grammar
// --------------------------------------------------------------------

function Grammar(ruleDict) {
  this.ruleDict = ruleDict
}

Grammar.prototype = {
  ruleDict: new function() {
    this._ = anything
    this.end = new Not(this._)
    this.space = Prim.newFor(/[\s]/)
    this.spaces = new Many(new Apply('space'), 0)
    this.alnum = Prim.newFor(/[0-9a-zA-Z]/)
    this.letter = Prim.newFor(/[a-zA-Z]/)
    this.lower = Prim.newFor(/[a-z]/)
    this.upper = Prim.newFor(/[A-Z]/)
    this.digit = Prim.newFor(/[0-9]/)
    this.hexDigit = Prim.newFor(/[0-9a-fA-F]/)
  },

  match: function(obj, startRule) {
    return this.matchContents([obj], startRule)
  },

  matchContents: function(obj, startRule) {
    var inputStream = InputStream.newFor(obj)
    var thunk = new Apply(startRule).eval(undefined, this.ruleDict, inputStream, undefined)
    if (isSyntactic(startRule))
      skipSpaces(this.ruleDict, inputStream)
    var assertSemanticActionNamesMatch = this.assertSemanticActionNamesMatch.bind(this)
    return thunk === fail || !inputStream.atEnd() ?
      false :
      function(actionDict) {
        assertSemanticActionNamesMatch(actionDict)
        return thunk.force(actionDict, {})
      }
  },

  assertSemanticActionNamesMatch: function(actionDict) {
    var ruleDict = this.ruleDict
    var ok = true
    objectUtils.keysAndValuesDo(ruleDict, function(ruleName, body) {
      if (actionDict[ruleName] === undefined)
        return
      var actual = objectUtils.formals(actionDict[ruleName]).sort()
      var expected = body.semanticActionArgNames()
      if (!equals.equals(actual, expected)) {
        ok = false
        console.log('semantic action for rule', ruleName, 'has the wrong argument names')
        console.log('  expected', expected)
        console.log('    actual', actual)
      }
    })
    if (!ok)
      browser.error('one or more semantic actions have the wrong argument names -- see console for details')
  },

  toRecipe: function() {
    var ws = new objectUtils.StringBuffer()
    ws.nextPutAll('(function(ohm, optNamespace) {\n')
    ws.nextPutAll('  var b = ohm.builder()\n')
    ws.nextPutAll('  b.setName('); ws.nextPutAll(stringUtils.printString(this.name)); ws.nextPutAll(')\n')
    if (this.superGrammar.name && this.superGrammar.namespaceName) {
      ws.nextPutAll('  b.setSuperGrammar(ohm.namespace(')
      ws.nextPutAll(stringUtils.printString(this.superGrammar.namespaceName))
      ws.nextPutAll(').getGrammar(')
      ws.nextPutAll(stringUtils.printString(this.superGrammar.name))
      ws.nextPutAll('))\n')
    }
    for (var idx = 0; idx < this.ruleDecls.length; idx++) {
      ws.nextPutAll('  ')
      this.ruleDecls[idx].outputRecipe(ws)
      ws.nextPutAll('\n')
    }
    ws.nextPutAll('  return b.build(optNamespace)\n')
    ws.nextPutAll('})')
    return ws.contents()
  }
}

// --------------------------------------------------------------------
// Builder
// --------------------------------------------------------------------

function RuleDecl() {
  throw 'RuleDecl cannot be instantiated -- it\'s abstract'
}

RuleDecl.prototype = {
  performChecks: abstract,

  performCommonChecks: function(name, body) {
    body.assertNoDuplicateBindings(name)
    body.assertChoicesHaveUniformBindings(name)
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.body
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.')
    ws.nextPutAll(this.kind)
    ws.nextPutAll('(')
    ws.nextPutAll(stringUtils.printString(this.name))
    ws.nextPutAll(', ')
    this.body.outputRecipe(ws)
    ws.nextPutAll(')')
  }
}

function Define(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.superGrammar = superGrammar
}

Define.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'define',

  performChecks: function() {
    if (this.superGrammar.ruleDict[this.name])
      browser.error('cannot define rule', this.name, 'because it already exists in the super-grammar.',
                    '(try override or extend instead.)')
    this.performCommonChecks(this.name, this.body)
  }
})

function Override(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.superGrammar = superGrammar
}

Override.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'override',

  performChecks: function() {
    if (!this.superGrammar.ruleDict[this.name])
      browser.error('cannot override rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)')
      this.performCommonChecks(this.name, this.body)
  }
})

function Inline(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.superGrammar = superGrammar
}

Inline.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'inline',

  performChecks: function() {
    // TODO: consider relaxing this check, e.g., make it ok to override an inline rule if the nesting rule is
    // an override. But only if the inline rule that's being overridden is nested inside the nesting rule that
    // we're overriding? Hopefully there's a much less complicated way to do this :)
    if (this.superGrammar.ruleDict[this.name])
      browser.error('cannot define inline rule', this.name, 'because it already exists in the super-grammar.')
    this.performCommonChecks(this.name, this.body)
  }
})

function Extend(name, body, superGrammar) {
  this.name = name
  this.body = body
  this.expandedBody = new Alt([body, new _Expand(name, superGrammar)])
  this.superGrammar = superGrammar
}

Extend.prototype = objectUtils.objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'extend',

  performChecks: function() {
    if (!this.superGrammar.ruleDict[this.name])
      browser.error('cannot extend rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)')
    this.performCommonChecks(this.name, this.expandedBody)
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.expandedBody
  }
})

function Builder() {
  this.init()
}

Builder.prototype = {
  init: function() {
    this.name = undefined
    this.superGrammar = Grammar.prototype
    this.ruleDecls = []
  },

  setName: function(name) {
    this.name = name
  },

  setSuperGrammar: function(grammar) {
    this.superGrammar = grammar
  },

  define: function(ruleName, body) {
    this.ruleDecls.push(new Define(ruleName, body, this.superGrammar))
  },

  override: function(ruleName, body) {
    this.ruleDecls.push(new Override(ruleName, body, this.superGrammar))
  },

  inline: function(ruleName, body) {
    this.ruleDecls.push(new Inline(ruleName, body, this.superGrammar))
    return this.app(ruleName)
  },

  extend: function(ruleName, body) {
    this.ruleDecls.push(new Extend(ruleName, body, this.superGrammar))
  },

  build: function(optNamespace) {
    var superGrammar = this.superGrammar
    var ruleDict = objectUtils.objectThatDelegatesTo(superGrammar.ruleDict)
    this.ruleDecls.forEach(function(ruleDecl) {
      ruleDecl.performChecks()
      ruleDecl.install(ruleDict)
    })

    var grammar = new Grammar(ruleDict)
    grammar.superGrammar = superGrammar
    grammar.ruleDecls = this.ruleDecls
    if (this.name) {
      grammar.name = this.name
      if (optNamespace) {
        grammar.namespaceName = optNamespace.name
        optNamespace.install(this.name, grammar)
      }
    }
    this.init()
    return grammar
  },

  _: function(x) { return Prim.newFor(x) },
  alt: function(/* term1, term1, ... */) {
    var terms = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof Alt)
        terms = terms.concat(arg.terms)
      else
        terms.push(arg)
    }
    return terms.length == 1 ? terms[0] : new Alt(terms)
  },
  seq: function(/* factor1, factor2, ... */) {
    var factors = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof Seq)
        factors = factors.concat(arg.factors)
      else
        factors.push(arg)
    }
    return factors.length == 1 ? factors[0] : new Seq(factors)
  },
  bind: function(expr, name) { return new Bind(expr, name) },
  many: function(expr, minNumMatches) { return new Many(expr, minNumMatches) },
  opt: function(expr) { return new Opt(expr) },
  not: function(expr) { return new Not(expr) },
  la: function(expr) { return new Lookahead(expr) },
  str: function(expr) { return new Str(expr) },
  lst: function(expr) { return new List(expr) },
  obj: function(properties, isLenient) { return new Obj(properties, !!isLenient) },
  app: function(ruleName) { return new Apply(ruleName) }
}

// --------------------------------------------------------------------
// Namespaces
// --------------------------------------------------------------------

var namespaces = {}

function Namespace(name) {
  this.name = name
  this.grammars = {}
}

Namespace.prototype = {
  install: function(name, grammar) {
    if (this.grammars[name])
      browser.error('duplicate declaration of grammar', name, 'in namespace', this.name)
    else
      this.grammars[name] = grammar
    return this
  },

  getGrammar: function(name) {
    return this.grammars[name] || browser.error('ohm namespace', this.name, 'has no grammar called', name)
  },

  loadGrammarsFromScriptElement: function(element) {
    browser.sanityCheck('script tag\'s type attribute must be "text/ohm-js"', element.type === 'text/ohm-js')
    makeGrammars(element.innerHTML, this)
    return this
  }
}

// --------------------------------------------------------------------
// Factories
// --------------------------------------------------------------------

function makeGrammarActionDict(optNamespace) {
  var builder
  return {
    space: function(value) {},

    _name: function() { return this.interval.contents() },
    nameFirst: function(value) {},
    nameRest: function(value) {},

    name: function(n) { return n },

    namedConst: function(value) { return value },
    'namedConst-undefined': function() { return undefined },
    'namedConst-null': function() { return null },
    'namedConst-true': function() { return true },
    'namedConst-false': function() { return false },

    string: function(cs) { return cs.map(function(c) { return stringUtils.unescapeChar(c) }).join('') },
    sChar: function(value) { return this.interval.contents() },
    regexp: function(e) { return new RegExp(e) },
    reCharClass: function() { return this.interval.contents() },
    number: function() { return parseInt(this.interval.contents()) },

    Alt: function(value) { return value },
    'Alt-rec': function(x, y) { return builder.alt(x, y) },

    Term: function(value) { return value },
    'Term-inline': function(x, n) { return builder.inline(builder.currentRuleName + '-' + n, x) },

    Seq: function(value) { return builder.seq.apply(builder, value) },

    Factor: function(value) { return value },
    'Factor-bind': function(x, n) { return builder.bind(x, n) },

    Iter: function(value) { return value },
    'Iter-star': function(x) { return builder.many(x, 0) },
    'Iter-plus': function(x) { return builder.many(x, 1) },
    'Iter-opt': function(x) { return builder.opt(x) },

    Pred: function(value) { return value },
    'Pred-not': function(x) { return builder.not(x) },
    'Pred-lookahead': function(x) { return builder.la(x) },

    Base: function(value) { return value },
    'Base-undefined': function() { return builder._(undefined) },
    'Base-null': function() { return builder._(null) },
    'Base-true': function() { return builder._(true) },
    'Base-false': function() { return builder._(false) },
    'Base-application': function(ruleName) { return builder.app(ruleName) },
    'Base-prim': function(x) { return builder._(x) },
    'Base-lst': function(x) { return builder.lst(x) },
    'Base-str': function(x) { return builder.str(x) },
    'Base-paren': function(x) { return x },
    'Base-obj': function(lenient) { return builder.obj([], lenient) },
    'Base-objWithProps': function(ps, lenient) { return builder.obj(ps, lenient) },

    Props: function(value) { return value },
    'Props-base': function(p) { return [p] },
    'Props-rec': function(p, ps) { return [p].concat(ps) },
    Prop: function(n, p) { return {name: n, pattern: p} },

    Rule: function(value) {},
    'Rule-define': function(n, b) { return builder.define(n, b) },
    'Rule-override': function(n, b) { return builder.override(n, b) },
    'Rule-extend': function(n, b) { return builder.extend(n, b) },
    RuleName: function(value) { builder.currentRuleName = value; return value },

    SuperGrammar: function(value) { builder.setSuperGrammar(value) },
    'SuperGrammar-qualified': function(ns, n) { return ohm.namespace(ns).getGrammar(n) },
    'SuperGrammar-unqualified': function(n) { return optNamespace.getGrammar(n) },

    Grammar: function(n, s, rs) {
      return builder.build(optNamespace)
    },
    Grammars: function(value) {
      return value
    },
    GrammarName: function(value) { builder = new Builder(); builder.setName(value); return value }
  }
}

var first = true
function compileAndLoad(source, whatItIs, optNamespace) {
  var thunk = thisModule._ohmGrammar.matchContents(source, whatItIs)
  if (thunk)
    return thunk(makeGrammarActionDict(optNamespace))
  else
    // TODO: improve error message (show what part of the input is wrong, what was expected, etc.)
    browser.error('invalid input in:', source)
}

function makeGrammar(source, optNamespace) {
  return compileAndLoad(source, 'Grammar', optNamespace)
}

function makeGrammars(source, optNamespace) {
  return compileAndLoad(source, 'Grammars', optNamespace)
}

// --------------------------------------------------------------------
// Public methods
// --------------------------------------------------------------------

// Stuff that users should know about

thisModule.namespace = function(name) {
  if (namespaces[name] === undefined)
    namespaces[name] = new Namespace(name)
  return namespaces[name]
}

thisModule.makeGrammar = makeGrammar
thisModule.makeGrammars = makeGrammars

// Stuff that's only useful for bootstrapping, testing, etc.

// TODO: rename to _builder
thisModule.builder = function() {
  return new Builder()
}

thisModule._makeGrammarActionDict = makeGrammarActionDict

var ohmGrammar
Object.defineProperty(thisModule, '_ohmGrammar', {
  get: function() {
    if (!ohmGrammar)
      ohmGrammar = this._ohmGrammarFactory(this)
    return ohmGrammar
  }
})


},{"../dist/ohm-grammar.js":1,"awlib":2}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9vaG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uL3NyYy9vaG0uanMnKVxub2htLl9vaG1HcmFtbWFyRmFjdG9yeSA9XG4oZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIGIgPSBvaG0uYnVpbGRlcigpXG4gIGIuc2V0TmFtZSgnT2htJylcbiAgYi5leHRlbmQoJ3NwYWNlJywgYi5hbHQoYi5zZXEoYi5fKCcvLycpLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5fKCdcXG4nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCdcXG4nKSksIGIuc2VxKGIuXygnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCcqLycpKSkpXG4gIGIuZGVmaW5lKCdfbmFtZScsIGIuc2VxKGIuYXBwKCduYW1lRmlyc3QnKSwgYi5tYW55KGIuYXBwKCduYW1lUmVzdCcpLCAwKSkpXG4gIGIuZGVmaW5lKCduYW1lRmlyc3QnLCBiLmFsdChiLl8oJ18nKSwgYi5hcHAoJ2xldHRlcicpKSlcbiAgYi5kZWZpbmUoJ25hbWVSZXN0JywgYi5hbHQoYi5fKCdfJyksIGIuYXBwKCdhbG51bScpKSlcbiAgYi5kZWZpbmUoJ25hbWUnLCBiLnNlcShiLm5vdChiLmFwcCgnbmFtZWRDb25zdCcpKSwgYi5iaW5kKGIuYXBwKCdfbmFtZScpLCAnbicpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtdW5kZWZpbmVkJywgYi5zZXEoYi5fKCd1bmRlZmluZWQnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtbnVsbCcsIGIuc2VxKGIuXygnbnVsbCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC10cnVlJywgYi5zZXEoYi5fKCd0cnVlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LWZhbHNlJywgYi5zZXEoYi5fKCdmYWxzZScpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmRlZmluZSgnbmFtZWRDb25zdCcsIGIuYWx0KGIuYXBwKCduYW1lZENvbnN0LXVuZGVmaW5lZCcpLCBiLmFwcCgnbmFtZWRDb25zdC1udWxsJyksIGIuYXBwKCduYW1lZENvbnN0LXRydWUnKSwgYi5hcHAoJ25hbWVkQ29uc3QtZmFsc2UnKSkpXG4gIGIuZGVmaW5lKCdzdHJpbmcnLCBiLnNlcShiLl8oXCInXCIpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdzQ2hhcicpLCAwKSwgJ2NzJyksIGIuXyhcIidcIikpKVxuICBiLmRlZmluZSgnc0NoYXInLCBiLmFsdChiLnNlcShiLl8oJ1xcXFx4JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXHUnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JykpLCBiLnNlcShiLl8oJ1xcXFwnKSwgYi5hcHAoJ18nKSksIGIuc2VxKGIubm90KGIuXyhcIidcIikpLCBiLmFwcCgnXycpKSkpXG4gIGIuZGVmaW5lKCdyZWdleHAnLCBiLnNlcShiLl8oJy8nKSwgYi5iaW5kKGIuYXBwKCdyZUNoYXJDbGFzcycpLCAnZScpLCBiLl8oJy8nKSkpXG4gIGIuZGVmaW5lKCdyZUNoYXJDbGFzcycsIGIuc2VxKGIuXygnWycpLCBiLm1hbnkoYi5hbHQoYi5fKCdcXFxcXScpLCBiLnNlcShiLm5vdChiLl8oJ10nKSksIGIuYXBwKCdfJykpKSwgMCksIGIuXygnXScpKSlcbiAgYi5kZWZpbmUoJ251bWJlcicsIGIuc2VxKGIub3B0KGIuXygnLScpKSwgYi5tYW55KGIuYXBwKCdkaWdpdCcpLCAxKSkpXG4gIGIuaW5saW5lKCdBbHQtcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdUZXJtJyksICd4JyksIGIuXygnfCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneScpKSlcbiAgYi5kZWZpbmUoJ0FsdCcsIGIuYWx0KGIuYXBwKCdBbHQtcmVjJyksIGIuYXBwKCdUZXJtJykpKVxuICBiLmlubGluZSgnVGVybS1pbmxpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1NlcScpLCAneCcpLCBiLl8oJ3snKSwgYi5iaW5kKGIuYXBwKCdfbmFtZScpLCAnbicpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdUZXJtJywgYi5hbHQoYi5hcHAoJ1Rlcm0taW5saW5lJyksIGIuYXBwKCdTZXEnKSkpXG4gIGIuZGVmaW5lKCdTZXEnLCBiLm1hbnkoYi5hcHAoJ0ZhY3RvcicpLCAwKSlcbiAgYi5pbmxpbmUoJ0ZhY3Rvci1iaW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdJdGVyJyksICd4JyksIGIuXygnLicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpXG4gIGIuZGVmaW5lKCdGYWN0b3InLCBiLmFsdChiLmFwcCgnRmFjdG9yLWJpbmQnKSwgYi5hcHAoJ0l0ZXInKSkpXG4gIGIuaW5saW5lKCdJdGVyLXN0YXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCcqJykpKVxuICBiLmlubGluZSgnSXRlci1wbHVzJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIuXygnKycpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItb3B0JywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIuXygnPycpKSlcbiAgYi5kZWZpbmUoJ0l0ZXInLCBiLmFsdChiLmFwcCgnSXRlci1zdGFyJyksIGIuYXBwKCdJdGVyLXBsdXMnKSwgYi5hcHAoJ0l0ZXItb3B0JyksIGIuYXBwKCdQcmVkJykpKVxuICBiLmlubGluZSgnUHJlZC1ub3QnLCBiLnNlcShiLl8oJ34nKSwgYi5iaW5kKGIuYXBwKCdCYXNlJyksICd4JykpKVxuICBiLmlubGluZSgnUHJlZC1sb29rYWhlYWQnLCBiLnNlcShiLl8oJyYnKSwgYi5iaW5kKGIuYXBwKCdCYXNlJyksICd4JykpKVxuICBiLmRlZmluZSgnUHJlZCcsIGIuYWx0KGIuYXBwKCdQcmVkLW5vdCcpLCBiLmFwcCgnUHJlZC1sb29rYWhlYWQnKSwgYi5hcHAoJ0Jhc2UnKSkpXG4gIGIuaW5saW5lKCdCYXNlLWFwcGxpY2F0aW9uJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICdydWxlTmFtZScpLCBiLm5vdChiLmFsdChiLl8oJz09JyksIGIuXygnOj0nKSwgYi5fKCcrPScpKSkpKVxuICBiLmlubGluZSgnQmFzZS1wcmltJywgYi5iaW5kKGIuYWx0KGIuYXBwKCduYW1lZENvbnN0JyksIGIuYXBwKCdzdHJpbmcnKSwgYi5hcHAoJ3JlZ2V4cCcpLCBiLmFwcCgnbnVtYmVyJykpLCAneCcpKVxuICBiLmlubGluZSgnQmFzZS1sc3QnLCBiLnNlcShiLl8oJ1snKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5fKCddJykpKVxuICBiLmlubGluZSgnQmFzZS1zdHInLCBiLnNlcShiLl8oJ1wiJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnXCInKSkpXG4gIGIuaW5saW5lKCdCYXNlLXBhcmVuJywgYi5zZXEoYi5fKCcoJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnKScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utb2JqJywgYi5zZXEoYi5fKCd7JyksIGIuYmluZChiLm9wdChiLl8oJy4uLicpKSwgJ2xlbmllbnQnKSwgYi5fKCd9JykpKVxuICBiLmlubGluZSgnQmFzZS1vYmpXaXRoUHJvcHMnLCBiLnNlcShiLl8oJ3snKSwgYi5iaW5kKGIuYXBwKCdQcm9wcycpLCAncHMnKSwgYi5iaW5kKGIub3B0KGIuc2VxKGIuXygnLCcpLCBiLl8oJy4uLicpKSksICdsZW5pZW50JyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ0Jhc2UnLCBiLmFsdChiLmFwcCgnQmFzZS1hcHBsaWNhdGlvbicpLCBiLmFwcCgnQmFzZS1wcmltJyksIGIuYXBwKCdCYXNlLWxzdCcpLCBiLmFwcCgnQmFzZS1zdHInKSwgYi5hcHAoJ0Jhc2UtcGFyZW4nKSwgYi5hcHAoJ0Jhc2Utb2JqJyksIGIuYXBwKCdCYXNlLW9ialdpdGhQcm9wcycpKSlcbiAgYi5pbmxpbmUoJ1Byb3BzLXJlYycsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJvcCcpLCAncCcpLCBiLl8oJywnKSwgYi5iaW5kKGIuYXBwKCdQcm9wcycpLCAncHMnKSkpXG4gIGIuaW5saW5lKCdQcm9wcy1iYXNlJywgYi5iaW5kKGIuYXBwKCdQcm9wJyksICdwJykpXG4gIGIuZGVmaW5lKCdQcm9wcycsIGIuYWx0KGIuYXBwKCdQcm9wcy1yZWMnKSwgYi5hcHAoJ1Byb3BzLWJhc2UnKSkpXG4gIGIuZGVmaW5lKCdQcm9wJywgYi5zZXEoYi5iaW5kKGIuYWx0KGIuYXBwKCdfbmFtZScpLCBiLmFwcCgnc3RyaW5nJykpLCAnbicpLCBiLl8oJzonKSwgYi5iaW5kKGIuYXBwKCdGYWN0b3InKSwgJ3AnKSkpXG4gIGIuaW5saW5lKCdSdWxlLWRlZmluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnUnVsZU5hbWUnKSwgJ24nKSwgYi5fKCc9PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtb3ZlcnJpZGUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1J1bGVOYW1lJyksICduJyksIGIuXygnOj0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuaW5saW5lKCdSdWxlLWV4dGVuZCcsIGIuc2VxKGIuYmluZChiLmFwcCgnUnVsZU5hbWUnKSwgJ24nKSwgYi5fKCcrPScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5kZWZpbmUoJ1J1bGUnLCBiLmFsdChiLmFwcCgnUnVsZS1kZWZpbmUnKSwgYi5hcHAoJ1J1bGUtb3ZlcnJpZGUnKSwgYi5hcHAoJ1J1bGUtZXh0ZW5kJykpKVxuICBiLmRlZmluZSgnUnVsZU5hbWUnLCBiLmFwcCgnbmFtZScpKVxuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyLXF1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICducycpLCBiLl8oJy4nKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKVxuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyLXVucXVhbGlmaWVkJywgYi5zZXEoYi5fKCc8OicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpXG4gIGIuZGVmaW5lKCdTdXBlckdyYW1tYXInLCBiLmFsdChiLmFwcCgnU3VwZXJHcmFtbWFyLXF1YWxpZmllZCcpLCBiLmFwcCgnU3VwZXJHcmFtbWFyLXVucXVhbGlmaWVkJykpKVxuICBiLmRlZmluZSgnR3JhbW1hcicsIGIuc2VxKGIuYmluZChiLmFwcCgnR3JhbW1hck5hbWUnKSwgJ24nKSwgYi5iaW5kKGIub3B0KGIuYXBwKCdTdXBlckdyYW1tYXInKSksICdzJyksIGIuXygneycpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdSdWxlJyksIDApLCAncnMnKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnR3JhbW1hcnMnLCBiLm1hbnkoYi5hcHAoJ0dyYW1tYXInKSwgMCkpXG4gIGIuZGVmaW5lKCdHcmFtbWFyTmFtZScsIGIuYXBwKCduYW1lJykpXG4gIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcbn0pXG4iLCJleHBvcnRzLm9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG5leHBvcnRzLnN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi9zdHJpbmdVdGlscy5qcycpXG5leHBvcnRzLmVxdWFscyA9IHJlcXVpcmUoJy4vZXF1YWxzLmpzJylcbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvZ2dpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBzdWJzY3JpYmVkID0ge31cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbihzdWJqZWN0IC8qICwgLi4uICovKSB7XG4gIGlmICghc3Vic2NyaWJlZFtzdWJqZWN0XSlcbiAgICByZXR1cm5cbiAgYXJndW1lbnRzWzBdID0gJ1snICsgc3ViamVjdCArICddJ1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmV4cG9ydHMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzdWJzY3JpYmVkW3N1YmplY3RdID0gdHJ1ZVxufVxuXG5leHBvcnRzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBkZWxldGUgc2hvd2luZ1tzdWJqZWN0XVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXNzZXJ0cywgZXJyb3JzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmVycm9yID0gZnVuY3Rpb24oLyogYXJnMSwgYXJnMiwgLi4uICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3MpXG4gIHRocm93ICdlcnJvcjogJyArIGFyZ3Muam9pbignICcpXG59XG5cbmV4cG9ydHMuc2FuaXR5Q2hlY2sgPSBmdW5jdGlvbihuYW1lLCBjb25kaXRpb24pIHtcbiAgaWYgKCFjb25kaXRpb24pXG4gICAgdGhpc01vZHVsZS5lcnJvcignZmFpbGVkIHNhbml0eSBjaGVjazonLCBuYW1lKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRE9NIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnByZXR0eVByaW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGVuZE5vZGUsIGVuZE9mZnNldCkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSlcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhLnN1YnN0cigwLCBlbmRPZmZzZXQpICsgJ3wnICsgbm9kZS5kYXRhLnN1YnN0cihlbmRPZmZzZXQpICsgJ30nXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEgKyAnfSdcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtub2RlLnRhZ05hbWUsICd7J11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gaWR4KVxuICAgICAgcGFydHMucHVzaCgnfCcpXG4gICAgcGFydHMucHVzaCh0aGlzTW9kdWxlLnByZXR0eVByaW50Tm9kZShub2RlLmNoaWxkTm9kZXMuaXRlbShpZHgpLCBlbmROb2RlLCBlbmRPZmZzZXQpKVxuICB9XG4gIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goJ3wnKVxuICBwYXJ0cy5wdXNoKCd9JylcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cbiIsIi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZG91YmxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT0geVxufVxuXG5mdW5jdGlvbiB0cmlwbGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geVxufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHhcbiAgcmV0dXJuIHR5cGUgIT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh4KSlcbiAgICByZXR1cm4gZXFGbih4LCB5KVxuICBmb3IgKHZhciBwIGluIHgpXG4gICAgaWYgKGRlZXAgJiYgIWVxdWFscyh4W3BdLCB5W3BdLCBkZWVwLCBlcUZuKSB8fFxuICAgICAgICAhZGVlcCAmJiAhZXFGbih4W3BdLCB5W3BdKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBwIGluIHkpXG4gICAgaWYgKHlbcF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB4W3BdID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgZGVlcCwgZXFGbikge1xuICBpZiAoIWFycjEgaW5zdGFuY2VvZiBBcnJheSB8fCAhYXJyMiBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICBhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycjEubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyMVtpZHhdXG4gICAgdmFyIGZvdW5kWCA9IGFycjIuc29tZShmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kWClcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuZGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIgPSBmdW5jdGlvbihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG5leHBvcnRzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGZ1bmN0aW9uKG9iaiwgb3B0UHJvcGVydGllcykge1xuICBmdW5jdGlvbiBjb25zKCkge31cbiAgY29ucy5wcm90b3R5cGUgPSBvYmpcbiAgdmFyIGFucyA9IG5ldyBjb25zKClcbiAgaWYgKG9wdFByb3BlcnRpZXMpXG4gICAgdGhpc01vZHVsZS5rZXlzQW5kVmFsdWVzRG8ob3B0UHJvcGVydGllcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgYW5zW2tdID0gdlxuICAgIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZXhwb3J0cy5mb3JtYWxzID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gZnVuYy5cbiAgICB0b1N0cmluZygpLlxuICAgIG1hdGNoKC9cXCgoLio/KVxcKS8pWzBdLlxuICAgIHJlcGxhY2UoLyAvZywgJycpLlxuICAgIHNsaWNlKDEsIC0xKS5cbiAgICBzcGxpdCgnLCcpLlxuICAgIGZpbHRlcihmdW5jdGlvbihtb2R1bGVOYW1lKSB7IHJldHVybiBtb2R1bGVOYW1lICE9ICcnIH0pXG59XG5cbmV4cG9ydHMua2V5c0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICBmb3IgKHZhciBwIGluIG9iamVjdClcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHApKVxuICAgICAgZm4ocClcbn1cblxuZXhwb3J0cy52YWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihwLCBvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYudmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzQW5kVmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgYW5zID0gW11cbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGFucy5wdXNoKG9iamVjdFtwXSkgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdXG4gIHRoaXMubGVuZ3RoU29GYXIgPSAwXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKVxuICAgIHRoaXMubmV4dFB1dEFsbChhcmd1bWVudHNbaWR4XSlcbn1cblxuU3RyaW5nQnVmZmVyLnByb3RvdHlwZSA9IHtcbiAgbmV4dFB1dEFsbDogZnVuY3Rpb24ocykge1xuICAgIHRoaXMuc3RyaW5ncy5wdXNoKHMpXG4gICAgdGhpcy5sZW5ndGhTb0ZhciArPSBzLmxlbmd0aFxuICB9LFxuXG4gIGNvbnRlbnRzOiBmdW5jdGlvbigpICB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKVxuICB9XG59XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gU3RyaW5nQnVmZmVyXG5cbiIsInZhciBvYmplY3RVdGlscyA9IHJlcXVpcmUoJy4vb2JqZWN0VXRpbHMuanMnKVxudmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gcGFkKG51bWJlckFzU3RyaW5nLCBsZW4pIHtcbiAgdmFyIHplcm9zID0gW11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbnVtYmVyQXNTdHJpbmcubGVuZ3RoIC0gbGVuOyBpZHgrKylcbiAgICB6ZXJvcy5wdXNoKCcwJylcbiAgcmV0dXJuIHplcm9zLmpvaW4oJycpICsgbnVtYmVyQXNTdHJpbmdcbn1cblxudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9XG5mb3IgKHZhciBjID0gMDsgYyA8IDEyODsgYysrKVxuICBlc2NhcGVTdHJpbmdGb3JbY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpXG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gID0gXCJcXFxcJ1wiXG5lc2NhcGVTdHJpbmdGb3JbJ1wiJy5jaGFyQ29kZUF0KDApXSAgPSAnXFxcXFwiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCdcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYidcbmVzY2FwZVN0cmluZ0ZvclsnXFxmJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcZidcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbidcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccidcbmVzY2FwZVN0cmluZ0ZvclsnXFx0Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdCdcbmVzY2FwZVN0cmluZ0ZvclsnXFx2Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdidcblxuLy8gUHVibGljIG1ldGhvZHNcblxuZXhwb3J0cy5lc2NhcGVDaGFyID0gZnVuY3Rpb24oYywgb3B0RGVsaW0pIHtcbiAgdmFyIGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApXG4gIGlmICgoYyA9PSAnXCInIHx8IGMgPT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKVxuICAgIHJldHVybiBjXG4gIGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KVxuICAgIHJldHVybiBlc2NhcGVTdHJpbmdGb3JbY2hhckNvZGVdXG4gIGVsc2UgaWYgKDEyOCA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8IDI1NilcbiAgICByZXR1cm4gJ1xcXFx4JyArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDIpXG4gIGVsc2VcbiAgICByZXR1cm4gJ1xcXFx1JyArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDQpXG59XG5cbmV4cG9ydHMudW5lc2NhcGVDaGFyID0gZnVuY3Rpb24ocykge1xuICBpZiAocy5jaGFyQXQoMCkgPT0gJ1xcXFwnKVxuICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgIGNhc2UgJ2InOiAgcmV0dXJuICdcXGInXG4gICAgICBjYXNlICdmJzogIHJldHVybiAnXFxmJ1xuICAgICAgY2FzZSAnbic6ICByZXR1cm4gJ1xcbidcbiAgICAgIGNhc2UgJ3InOiAgcmV0dXJuICdcXHInXG4gICAgICBjYXNlICd0JzogIHJldHVybiAnXFx0J1xuICAgICAgY2FzZSAndic6ICByZXR1cm4gJ1xcdidcbiAgICAgIGNhc2UgJ3gnOiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNCksIDE2KSlcbiAgICAgIGNhc2UgJ3UnOiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSlcbiAgICAgIGRlZmF1bHQ6ICAgcmV0dXJuIHMuY2hhckF0KDEpXG4gICAgfVxuICBlbHNlXG4gICAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gcHJpbnRPbih4LCB3cykge1xuICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgd3MubmV4dFB1dEFsbCgnWycpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgcHJpbnRPbih4W2lkeF0sIHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCddJylcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgaGFzU2luZ2xlUXVvdGVzID0geC5pbmRleE9mKFwiJ1wiKSA+PSAwXG4gICAgdmFyIGhhc0RvdWJsZVF1b3RlcyA9IHguaW5kZXhPZignXCInKSA+PSAwXG4gICAgdmFyIGRlbGltID0gaGFzU2luZ2xlUXVvdGVzICYmICFoYXNEb3VibGVRdW90ZXMgPyAnXCInIDogXCInXCJcbiAgICB3cy5uZXh0UHV0QWxsKGRlbGltKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHgubGVuZ3RoOyBpZHgrKylcbiAgICAgIHdzLm5leHRQdXRBbGwodGhpc01vZHVsZS5lc2NhcGVDaGFyKHhbaWR4XSwgZGVsaW0pKVxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gIH0gZWxzZSBpZiAoeCA9PT0gbnVsbCkge1xuICAgIHdzLm5leHRQdXRBbGwoJ251bGwnKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiAhKHggaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgd3MubmV4dFB1dEFsbCgneycpXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIG9iamVjdFV0aWxzLmtleXNBbmRWYWx1ZXNEbyh4LCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBpZiAoZmlyc3QpXG4gICAgICAgIGZpcnN0ID0gZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgcHJpbnRPbihrLCB3cylcbiAgICAgIHdzLm5leHRQdXRBbGwoJzogJylcbiAgICAgIHByaW50T24odiwgd3MpXG4gICAgfSlcbiAgICB3cy5uZXh0UHV0QWxsKCd9JylcbiAgfSBlbHNlXG4gICAgd3MubmV4dFB1dEFsbCgnJyArIHgpXG59XG5cbmV4cG9ydHMucHJpbnRTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHdzID0gbmV3IG9iamVjdFV0aWxzLlN0cmluZ0J1ZmZlcigpXG4gIHByaW50T24ob2JqLCB3cylcbiAgcmV0dXJuIHdzLmNvbnRlbnRzKClcbn1cblxuIiwiLypcblxuVE9ETzpcblxuKiBUaGluayBhYm91dCBpbXByb3ZpbmcgdGhlIGltcGxlbWVudGF0aW9uIG9mIHN5bnRhY3RpYyBydWxlcycgYXV0b21hdGljIHNwYWNlIHNraXBwaW5nOlxuICAtLSBDb3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBjdXJyZW50IHJ1bGUgbmFtZSBieSBtb2RpZnlpbmcgdGhlIGNvZGUgKGluIEFwcGx5LmV2YWwpIHdoZXJlIGVudGVyIGFuZCBleGl0IG1ldGhvZHNcbiAgICAgYXJlIGNhbGxlZC4gKFdvdWxkIGFsc28gd2FudCB0byBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgdGhlIHJ1bGUgaXMgc3ludGFjdGljIHRvIGF2b2lkIHJlLWRvaW5nIHRoYXQgd29ya1xuICAgICBhdCBlYWNoIGFwcGxpY2F0aW9uLilcblxuKiBDb25zaWRlciBib3Jyb3dpbmcgKHNvbWV0aGluZyBsaWtlKSB0aGUgdmFyaWFibGUtbm90LW90aGVyd2lzZS1tZW50aW9uZWQgaWRlYSBmcm9tIFJvYmJ5IEZpbmRsZXIncyByZWRleCwgYXMgYSB3YXlcbiAgdG8gbWFrZSBpdCBlYXNpZXIgZm9yIHByb2dyYW1tZXJzIHRvIGRlYWwgd2l0aCBrZXl3b3JkcyBhbmQgaWRlbnRpZmllcnMuXG5cbiogVGhpbmsgYWJvdXQgYSBiZXR0ZXIgd2F5IHRvIGRlYWwgd2l0aCBsaXN0c1xuICAtLSBCdWlsdC1pbiBsaXN0IG9wZXJhdG9yP1xuICAtLSBQYXJhbWV0ZXJpemVkIHJ1bGVzP1xuXG4qIEltcHJvdmUgdGVzdCBjb3ZlcmFnZVxuICAtLSBBZGQgdGVzdHMgZm9yIHNjb3BpbmcsIGUuZy4sIFwiZm9vOmEgW2JhcjpiIGJhejpjXTpkXCIgc2hvdWxkIGhhdmUgNCBiaW5kaW5ncy5cbiAgICAgKFNhbWUga2luZCBvZiB0aGluZyBmb3IgbmVzdGVkIHN0cmluZyBhbmQgbG9va2FoZWFkIGV4cHJlc3Npb25zLCB0aGVpciBiaW5kaW5ncyBzaG91bGQgbGVhayB0byB0aGUgZW5jbG9zaW5nIHNlcS4pXG5cbiogVGhpbmsgYWJvdXQgZm9yZWlnbiBydWxlIGludm9jYXRpb25cbiAgLS0gQ2FuJ3QganVzdCBiZSBkb25lIGluIHRoZSBzYW1lIHdheSBhcyBpbiBPTWV0YSBiL2Mgb2YgdGhlIGFjdGlvbkRpY3RcbiAgLS0gV2lsbCB3YW50IHRvIHByZXNlcnZlIHRoZSBcIm5vIHVubmVjZXNzYXJ5IHNlbWFudGljIGFjdGlvbnNcIiBndWFyYW50ZWVcbiAgLS0gVGhlIHNvbHV0aW9uIG1pZ2h0IGJlIHRvIGVuYWJsZSB0aGUgcHJvZ3JhbW1lciB0byBwcm92aWRlIG11bHRpcGxlIGFjdGlvbkRpY3RzLFxuICAgICBidXQgSSdsbCBoYXZlIHRvIGNvbWUgdXAgd2l0aCBhIGNvbnZlbmllbnQgd2F5IHRvIGFzc29jaWF0ZSBlYWNoIHdpdGggYSBwYXJ0aWN1bGFyIGdyYW1tYXIuXG5cbiogVGhpbmsgYWJvdXQgaW5jcmVtZW50YWwgcGFyc2luZyAoZ29vZCBmb3IgZWRpdG9ycylcbiAgLS0gQmFzaWMgaWRlYToga2VlcCB0cmFjayBvZiBtYXggaW5kZXggc2VlbiB0byBjb21wdXRlIGEgcmVzdWx0XG4gICAgIChzdG9yZSB0aGlzIGluIG1lbW8gcmVjIGFzIGFuIGludCByZWxhdGl2ZSB0byBjdXJyIHBvcylcbiAgLS0gT2sgdG8gcmV1c2UgbWVtb2l6ZWQgdmFsdWUgYXMgbG9uZyBhcyByYW5nZSBmcm9tIGN1cnJlbnQgaW5kZXggdG8gbWF4IGluZGV4IGhhc24ndCBjaGFuZ2VkXG4gIC0tIENvdWxkIGJlIGEgY3V0ZSB3b3Jrc2hvcCBwYXBlci4uLlxuXG5cblN5bnRheCAvIGxhbmd1YWdlIGlkZWFzOlxuXG4qIFN5bnRheCBmb3IgcnVsZSBkZWNsYXJhdGlvbnM6XG5cbiAgICBmb28gPT0gYmFyIGJheiAgICAgKGRlZmluZSlcbiAgICBmb28gOj0gYmFyIGJheiAgICAgKG92ZXJyaWRlIC8gcmVwbGFjZSlcbiAgICBmb28gPD0gYmFyIGJheiAgICAgKGV4dGVuZClcblxuKiBJbmxpbmUgcnVsZXMsIGUuZy4sXG5cbiAgICBhZGRFeHByID0gYWRkRXhwcjp4ICcrJyBtdWxFeHByOnkge3BsdXN9XG4gICAgICAgICAgICB8IGFkZEV4cHI6eCAnLScgbXVsRXhwcjp5IHttaW51c31cbiAgICAgICAgICAgIHwgbXVsRXhwclxuXG4gIGlzIHN5bnRhY3RpYyBzdWdhciBmb3JcblxuICAgIGFkZEV4cHIgPSBwbHVzIHwgbWludXMgfCBtdWxFeHByLFxuICAgIHBsdXMgPSBhZGRFeHByOnggJysnIG11bEV4cHI6eSxcbiAgICBtaW51cyA9IGFkZEV4cHI6eCAnLScgbXVsRXhwcjp5XG5cbiogSW4gdGhpcyBleGFtcGxlOlxuXG4gICAgZm9vID0gXCJiYXJcIlxuICAgIGJhciA9ICdhYmMnXG5cbiAgVGhlIGZvbyBydWxlIHNheXMgaXQgd2FudHMgdGhlIGJhciBydWxlIHRvIG1hdGNoIHRoZSBjb250ZW50cyBvZiBhIHN0cmluZyBvYmplY3QuIChUaGUgXCJzIGlzIGEga2luZCBvZiBwYXJlbnRoZXNpcy4pXG4gIFRoZW4geW91IGNvdWxkIGVpdGhlciBzYXlcblxuICAgIG0ubWF0Y2hBbGwoJ2FiYycsICdiYXInKVxuXG4gIG9yXG5cbiAgICBtLm1hdGNoKCdhYmMnLCAnZm9vJylcblxuICBCb3RoIHNob3VsZCBzdWNjZWVkLlxuXG4qIEFib3V0IG9iamVjdCBtYXRjaGluZ1xuXG4gIFNvbWUgaXNzdWVzOlxuICAtLSBTaG91bGQgZGVmaW5pdGVseSBhbGxvdyBwYXR0ZXJuIG1hdGNoaW5nIG9uIGVhY2ggcHJvcGVydHkncyB2YWx1ZS4gQnV0IHdoYXQgYWJvdXQgcHJvcGVydHkgbmFtZXM/XG4gIC0tIFdoYXQgdG8gZG8gYWJvdXQgdW5zcGVjaWZpZWQgcHJvcGVydGllcz9cbiAgLS0gU3ludGF4OiBKU09OIHVzZXMgY29sb25zIHRvIHNlcGFyYXRlIHByb3BlcnR5IG5hbWVzIGFuZCB2YWx1ZXMuIFdpbGwgbG9vayBiYWQgdy8gYmluZGluZ3MsIGUuZy4sXG4gICAgIHtmb286IG51bWJlcjpufSAoZXd3d3cpXG5cbiAgQ3VycmVudCBzdHJhd21hbjpcbiAgLS0gUmVxdWlyZSBwcm9wZXJ0eSBuYW1lcyB0byBiZSBzdHJpbmcgbGl0ZXJhbHMgKG5vdCBwYXR0ZXJucyksIG9ubHkgYWxsb3cgcGF0dGVybiBtYXRjaGluZyBvbiB0aGVpciB2YWx1ZXMuXG4gIC0tIEFsbG93IGFuIG9wdGlvbmFsICcuLi4nIGFzIHRoZSBsYXN0IHBhdHRlcm4sIHRoYXQgd291bGQgbWF0Y2ggYW55IHVuc3BlY2lmaWVkIHByb3BlcnRpZXMuXG4gICAgICAgeydmb28nOiBudW1iZXIsICdiYXInOiBzdHJpbmcsICdiYXonOiA1LCAuLi59XG4gICAgIE1pZ2h0IGV2ZW4gYWxsb3cgdGhlIC4uLiB0byBiZSBib3VuZCB0byBhIHZhcmlhYmxlIHRoYXQgd291bGQgY29udGFpbiBhbGwgb2YgdGhvc2UgcHJvcGVydGllcy5cbiAgLS0gQ29uc2lkZXIgY2hhbmdpbmcgYmluZGluZyBzeW50YXggZnJvbSBleHByOm5hbWUgdG8gZXhwci5uYW1lXG4gICAgIChNb3JlIEpTT04tZnJpZW5kbHksIGJ1dCBpdCBkb2Vzbid0IHdvcmsgd2VsbCB3aXRoIC4uLiBzeW50YXguIEJ1dCBtYXliZSBpdCdzIG5vdCBzbyBpbXBvcnRhbnQgdG8gYmUgYWJsZSB0byBiaW5kXG4gICAgIHRoZSByZXN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgYW55d2F5LCBzaW5jZSB5b3UgY2FuIGFsd2F5cyBiaW5kIHRoZSBlbnRpcmUgb2JqZWN0LilcblxuXG5PcHRpbWl6YXRpb24gaWRlYXM6XG5cbiogT3B0aW1pemUgJ2JpbmRzJyAtLSBzaG91bGQgcHJlLWFsbG9jYXRlIGFuIGFycmF5IG9mIGJpbmRpbmdzIGluc3RlYWQgb2YgZG9pbmcgcHVzaGVzLCB0aHJvd2luZyBhd2F5IGFycmF5cyBvbiBmYWlsXG4gIChzZWUgQWx0KSwgZXRjLlxuXG4qIENvbnNpZGVyIGFkZGluZyBhbiBhZGRpdGlvbmFsIGNvZGUgZ2VuZXJhdGlvbiBzdGVwIHRoYXQgZ2VuZXJhdGVzIGVmZmljaWVudCBjb2RlIGZyb20gdGhlIEFTVHMsIGluc3RlYWQgb2ZcbiAgaW50ZXJwcmV0aW5nIHRoZW0gZGlyZWN0bHkuXG5cbiogRG9uJ3QgYm90aGVyIGNyZWF0aW5nIHRodW5rcyAvIGxpc3RzIG9mIHRodW5rcyB3aGVuIHZhbHVlIGlzIG5vdCBuZWVkZWQgKE9NZXRhIGRpZCB0aGlzKVxuICAtLSBFLmcuLCBpbiBcImZvbyA9IHNwYWNlKiBiYXJcIiB0aGUgcmVzdWx0IG9mIHNwYWNlKiBpcyBub3QgbmVlZGVkLCBzbyBkb24ndCBib3RoZXIgY3JlYXRpbmcgYSBsaXN0IG9mIHRodW5rcyAvIHZhbHVlc1xuICAtLSBDb3VsZCBqdXN0IHJldHVybiB1bmRlZmluZWQgKGFueXRoaW5nIGV4Y2VwdCBmYWlsKVxuXG4qIEdldCByaWQgb2YgdW5uZWNlc3NhcnkgU2VxcyBhbmQgQWx0cyAoT01ldGEgZGlkIHRoaXMgdG9vKVxuXG4qL1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRGVwZW5kZW5jaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5yZXF1aXJlKCcuLi9kaXN0L29obS1ncmFtbWFyLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIG9iamVjdFV0aWxzID0gYXdsaWIub2JqZWN0VXRpbHNcbnZhciBzdHJpbmdVdGlscyA9IGF3bGliLnN0cmluZ1V0aWxzXG52YXIgYnJvd3NlciA9IGF3bGliLmJyb3dzZXJcbnZhciBlcXVhbHMgPSBhd2xpYi5lcXVhbHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnMsIGV0Yy5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG52YXIgZmFpbCA9IHt9XG5cbmZ1bmN0aW9uIGdldER1cGxpY2F0ZXMoYXJyYXkpIHtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdXG4gICAgaWYgKGFycmF5Lmxhc3RJbmRleE9mKHgpICE9PSBpZHggJiYgZHVwbGljYXRlcy5pbmRleE9mKHgpIDwgMClcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KVxuICB9XG4gIHJldHVybiBkdXBsaWNhdGVzXG59XG5cbmZ1bmN0aW9uIGFic3RyYWN0KCkge1xuICB0aHJvdyAndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhJ1xufVxuXG5mdW5jdGlvbiBpc1N5bnRhY3RpYyhydWxlTmFtZSkge1xuICB2YXIgZmlyc3RDaGFyID0gcnVsZU5hbWVbMF1cbiAgcmV0dXJuICdBJyA8PSBmaXJzdENoYXIgJiYgZmlyc3RDaGFyIDw9ICdaJ1xufVxuXG52YXIgX2FwcGx5U3BhY2VzXG5mdW5jdGlvbiBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICAoX2FwcGx5U3BhY2VzIHx8IChfYXBwbHlTcGFjZXMgPSBuZXcgQXBwbHkoJ3NwYWNlcycpKSkuZXZhbChmYWxzZSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCB1bmRlZmluZWQpXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnB1dCBzdHJlYW1zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbSgpIHtcbiAgdGhyb3cgJ0lucHV0U3RyZWFtIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5JbnB1dFN0cmVhbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKVxuICAgIHJldHVybiBuZXcgU3RyaW5nSW5wdXRTdHJlYW0ob2JqKVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSlcbiAgICByZXR1cm4gbmV3IExpc3RJbnB1dFN0cmVhbShvYmopXG4gIGVsc2VcbiAgICB0aHJvdyAnY2Fubm90IG1ha2UgaW5wdXQgc3RyZWFtIGZvciAnICsgb2JqXG59XG5cbklucHV0U3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oc291cmNlKSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgICB0aGlzLnBvcyA9IDBcbiAgICB0aGlzLnBvc0luZm9zID0gW11cbiAgfSxcblxuICBnZXRDdXJyZW50UG9zSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJQb3MgPSB0aGlzLnBvc1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5wb3NJbmZvc1tjdXJyUG9zXVxuICAgIHJldHVybiBwb3NJbmZvIHx8ICh0aGlzLnBvc0luZm9zW2N1cnJQb3NdID0gbmV3IFBvc0luZm8oY3VyclBvcykpXG4gIH0sXG5cbiAgYXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoXG4gIH0sXG5cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXRFbmQoKSA/IGZhaWwgOiB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXVxuICB9LFxuXG4gIG1hdGNoRXhhY3RseTogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLm5leHQoKSA9PT0geCA/IHRydWUgOiBmYWlsXG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeClcbiAgfVxufVxuXG5mdW5jdGlvbiBTdHJpbmdJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSlcbn1cblxuU3RyaW5nSW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKylcbiAgICAgIGlmICh0aGlzLm1hdGNoRXhhY3RseShzW2lkeF0pID09PSBmYWlsKVxuICAgICAgICByZXR1cm4gZmFpbFxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBJTVBPUlRBTlQ6IGUgbXVzdCBiZSBhIG5vbi1nbG9iYWwsIG9uZS1jaGFyYWN0ZXIgZXhwcmVzc2lvbiwgZS5nLiwgLy4vIGFuZCAvWzAtOV0vXG4gICAgdmFyIGMgPSB0aGlzLm5leHQoKVxuICAgIHJldHVybiBjICE9PSBmYWlsICYmIGUudGVzdChjKSA/IHRydWUgOiBmYWlsXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExpc3RJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSlcbn1cblxuTGlzdElucHV0U3RyZWFtLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkocylcbiAgfSxcbiAgICBcbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkoZSlcbiAgfVxufSlcblxuZnVuY3Rpb24gUG9zSW5mbyhwb3MpIHtcbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5ydWxlU3RhY2sgPSBbXVxuICB0aGlzLmFjdGl2ZVJ1bGVzID0ge30gIC8vIHJlZHVuZGFudCBkYXRhIChjb3VsZCBiZSBnZW5lcmF0ZWQgZnJvbSBydWxlU3RhY2spLCBleGlzdHMgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnNcbiAgdGhpcy5tZW1vID0ge31cbn1cblxuUG9zSW5mby5wcm90b3R5cGUgPSB7XG4gIGlzQWN0aXZlOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXVxuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnB1c2gocnVsZU5hbWUpXG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSB0cnVlXG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLnJ1bGVTdGFjay5wb3AoKVxuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gZmFsc2VcbiAgfSxcblxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gbWVtb1JlYy5pbnZvbHZlZFJ1bGVzXG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gaW52b2x2ZWRSdWxlcylcbiAgICAgIGlmIChpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSAmJiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID8gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV0gOiB1bmRlZmluZWRcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKCF0aGlzLmxlZnRSZWN1cnNpb25TdGFjaylcbiAgICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID0gW11cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtuYW1lOiBydWxlTmFtZSwgdmFsdWU6IGZhaWwsIHBvczogLTEsIGludm9sdmVkUnVsZXM6IHt9fSlcbiAgICB0aGlzLnVwZGF0ZUludm9sdmVkUnVsZXMoKVxuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucG9wKClcbiAgfSxcblxuICB1cGRhdGVJbnZvbHZlZFJ1bGVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICB2YXIgaW52b2x2ZWRSdWxlcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmludm9sdmVkUnVsZXNcbiAgICB2YXIgbHJSdWxlTmFtZSA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWVcbiAgICB2YXIgaWR4ID0gdGhpcy5ydWxlU3RhY2subGVuZ3RoIC0gMVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVTdGFja1tpZHgtLV1cbiAgICAgIGlmIChydWxlTmFtZSA9PT0gbHJSdWxlTmFtZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGludm9sdmVkUnVsZXNbcnVsZU5hbWVdID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW50ZXJ2YWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcnZhbChzb3VyY2UsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4XG59XG5cbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBJbnB1dFN0cmVhbS5uZXdGb3IodGhpcy5zb3VyY2UpLmludGVydmFsKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICB9LFxuXG4gIG9ubHlFbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGFydElkeCArIDEgIT09IHRoaXMuZW5kSWR4KVxuICAgICAgYnJvd3Nlci5lcnJvcignaW50ZXJ2YWwnLCB0aGlzLCAnd2FzIGV4cGVjdGVkIHRvIGNvbnRhaW4gb25seSBvbmUgZWxlbWVudCcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMuc3RhcnRJZHhdXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRodW5rc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG5leHRUaHVua0lkID0gMFxuXG5mdW5jdGlvbiBSdWxlVGh1bmsocnVsZU5hbWUsIHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCwgdmFsdWUsIGJpbmRpbmdzKSB7XG4gIHRoaXMuaWQgPSBuZXh0VGh1bmtJZCsrXG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxuICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHhcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHhcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5nc1xufVxuXG5SdWxlVGh1bmsucHJvdG90eXBlID0ge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIGlmIChtZW1vLmhhc093blByb3BlcnR5KHRoaXMuaWQpKVxuICAgICAgcmV0dXJuIG1lbW9bdGhpcy5pZF1cbiAgICB2YXIgYWN0aW9uID0gdGhpcy5sb29rdXBBY3Rpb24oYWN0aW9uRGljdClcbiAgICB2YXIgYWRkbEluZm8gPSB0aGlzLmNyZWF0ZUFkZGxJbmZvKClcbiAgICBpZiAodGhpcy5iaW5kaW5ncy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gbWVtb1t0aGlzLmlkXSA9IGFjdGlvbi5jYWxsKGFkZGxJbmZvLCB0aGlzLnZhbHVlLmZvcmNlKGFjdGlvbkRpY3QsIG1lbW8pKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGFyZ0RpY3QgPSB7fVxuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5iaW5kaW5ncy5sZW5ndGg7IGlkeCArPSAyKVxuICAgICAgICBhcmdEaWN0W3RoaXMuYmluZGluZ3NbaWR4XV0gPSB0aGlzLmJpbmRpbmdzW2lkeCArIDFdXG4gICAgICB2YXIgZm9ybWFscyA9IG9iamVjdFV0aWxzLmZvcm1hbHMoYWN0aW9uKVxuICAgICAgdmFyIGFyZ3MgPSBmb3JtYWxzLmxlbmd0aCA9PSAwID9cbiAgICAgICAgb2JqZWN0VXRpbHMudmFsdWVzKGFyZ0RpY3QpLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKSB9KSA6XG4gICAgICAgIGZvcm1hbHMubWFwKGZ1bmN0aW9uKG5hbWUpIHsgcmV0dXJuIGFyZ0RpY3RbbmFtZV0uZm9yY2UoYWN0aW9uRGljdCwgbWVtbykgfSlcbiAgICAgIHJldHVybiBtZW1vW3RoaXMuaWRdID0gYWN0aW9uLmFwcGx5KGFkZGxJbmZvLCBhcmdzKVxuICAgIH1cbiAgfSxcblxuICBsb29rdXBBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lXG4gICAgdmFyIGFjdGlvbiA9IGFjdGlvbkRpY3RbcnVsZU5hbWVdXG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkICYmIGFjdGlvbkRpY3QuX2RlZmF1bHQgIT09IHVuZGVmaW5lZClcbiAgICAgIGFjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gYWN0aW9uRGljdC5fZGVmYXVsdC5hcHBseSh0aGlzLCBbcnVsZU5hbWVdLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSlcbiAgICAgIH1cbiAgICByZXR1cm4gYWN0aW9uIHx8IGJyb3dzZXIuZXJyb3IoJ21pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvcicsIHJ1bGVOYW1lKVxuICB9LFxuXG4gIGNyZWF0ZUFkZGxJbmZvOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW50ZXJ2YWw6IG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZSwgdGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIExpc3RUaHVuayh0aHVua3MpIHtcbiAgdGhpcy5pZCA9IG5leHRUaHVua0lkKytcbiAgdGhpcy50aHVua3MgPSB0aHVua3Ncbn1cblxuTGlzdFRodW5rLnByb3RvdHlwZSA9IHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAobWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSlcbiAgICAgIHJldHVybiBtZW1vW3RoaXMuaWRdXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG1lbW9bdGhpcy5pZF0gPSB0aGlzLnRodW5rcy5tYXAoZnVuY3Rpb24odGh1bmspIHsgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIG1lbW8pIH0pXG4gIH1cbn1cblxuZnVuY3Rpb24gVmFsdWVUaHVuayh2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWVcbn1cblxuVmFsdWVUaHVuay5wcm90b3R5cGUgPSB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgfVxufVxuXG52YXIgdmFsdWVsZXNzVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh1bmRlZmluZWQpXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUeXBlcyBvZiBwYXR0ZXJuc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG5mdW5jdGlvbiBQYXR0ZXJuKCkge1xuICB0aHJvdyAnUGF0dGVybiBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuUGF0dGVybi5wcm90b3R5cGUgPSB7XG4gIHNlbWFudGljQWN0aW9uQXJnTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IHRoaW5rIGFib3V0IHRoaXMsIGl0IGRvZXNuJ3Qgc2VlbSByaWdodC5cbiAgICAvLyBFLmcuLCBzdXBwb3NlIHlvdSBoYXZlOlxuICAgIC8vICAgcnVsZSA9PSB+Zm9vIGJhciB8IH5iYXogcXV4XG4gICAgLy8gQm90aCBjaG9pY2VzIGFyZSBzZXFzLCBhbmQgdGhlcmVmb3JlIGhhdmUgbm8gdmFsdWUuIEJ1dCB0aGUgcnVsZSdzIHNlbWFudGljIGFjdGlvbiB3aWxsIHJlcXVpcmUgb25lLlxuICAgIHZhciBuYW1lcyA9IHRoaXMuZ2V0QmluZGluZ05hbWVzKClcbiAgICByZXR1cm4gbmFtZXMubGVuZ3RoID4gMCA/IG5hbWVzIDogWyd2YWx1ZSddXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW11cbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBhYnN0cmFjdCxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGFic3RyYWN0LFxuXG4gIG91dHB1dFJlY2lwZTogYWJzdHJhY3Rcbn1cblxuLy8gQW55dGhpbmdcblxudmFyIGFueXRoaW5nID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgdmFsdWUgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgVmFsdWVUaHVuayh2YWx1ZSlcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIC8vIG5vLW9wXG4gIH1cbn0pXG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuUHJpbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnICYmIG9iai5sZW5ndGggIT09IDEpXG4gICAgcmV0dXJuIG5ldyBTdHJpbmdQcmltKG9iailcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgIHJldHVybiBuZXcgUmVnRXhwUHJpbShvYmopXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFByaW0ob2JqKVxufVxuICAgIFxuUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIGlmICh0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBWYWx1ZVRodW5rKHRoaXMub2JqKVxuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICAgIHJldHVybiBpbnB1dFN0cmVhbS5tYXRjaEV4YWN0bHkodGhpcy5vYmopXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLl8oJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMub2JqKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gU3RyaW5nUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2g6IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gICAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKVxuICB9XG59KVxuXG5mdW5jdGlvbiBSZWdFeHBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5SZWdFeHBQcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICBpZiAoaW5wdXRTdHJlYW0ubWF0Y2hSZWdFeHAodGhpcy5vYmopID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFZhbHVlVGh1bmsoaW5wdXRTdHJlYW0uc291cmNlW29yaWdQb3NdKVxuICB9XG59KVxuXG4vLyBBbHRlcm5hdGlvblxuXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgdGhpcy50ZXJtcyA9IHRlcm1zXG59XG5cbkFsdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgb3JpZ051bUJpbmRpbmdzID0gYmluZGluZ3MubGVuZ3RoXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoc3ludGFjdGljKVxuICAgICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMudGVybXNbaWR4XS5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICBlbHNlIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgICAvLyBOb3RlOiB3aGlsZSB0aGUgZm9sbG93aW5nIGFzc2lnbm1lbnQgY291bGQgYmUgZG9uZSB1bmNvbmRpdGlvbmFsbHksIG9ubHkgZG9pbmcgaXQgd2hlbiBuZWNlc3NhcnkgaXNcbiAgICAgICAgLy8gYmV0dGVyIGZvciBwZXJmb3JtYW5jZS4gVGhpcyBpcyBiL2MgYXNzaWduaW5nIHRvIGFuIGFycmF5J3MgbGVuZ3RoIHByb3BlcnR5IGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4gYVxuICAgICAgICAvLyB0eXBpY2FsIGFzc2lnbm1lbnQuXG4gICAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPiBvcmlnTnVtQmluZGluZ3MpXG4gICAgICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGJpbmRpbmdzIC0tIHRoaXMgcHJvcGVydHkgaXMgY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyBbXSA6IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVyblxuICAgIHZhciBuYW1lcyA9IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKClcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdXG4gICAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKClcbiAgICAgIHZhciBvdGhlck5hbWVzID0gdGVybS5nZXRCaW5kaW5nTmFtZXMoKVxuICAgICAgaWYgKCFlcXVhbHMuZXF1YWxzKG5hbWVzLCBvdGhlck5hbWVzKSlcbiAgICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGFuIGFsdCB3aXRoIGluY29uc2lzdGVudCBiaW5kaW5nczonLCBuYW1lcywgJ3ZzJywgb3RoZXJOYW1lcylcbiAgICB9XG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuYWx0KCcpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgdGhpcy50ZXJtc1tpZHhdLm91dHB1dFJlY2lwZSh3cylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFNlcXVlbmNlc1xuXG5mdW5jdGlvbiBTZXEoZmFjdG9ycykge1xuICB0aGlzLmZhY3RvcnMgPSBmYWN0b3JzXG59XG5cblNlcS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChzeW50YWN0aWMpXG4gICAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdXG4gICAgICB2YXIgdmFsdWUgPSBmYWN0b3IuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICAgIHJldHVybiBmYWlsXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZWxlc3NUaHVua1xuICB9LFxuXG4gIHNlbWFudGljQWN0aW9uQXJnTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIE92ZXJyaWRlIFBhdHRlcm4ncyBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggd291bGQgcmV0dXJuIFsndmFsdWUnXSB3aGVuIHRoZXJlIGFyZSBubyBiaW5kaW5ncy5cbiAgICByZXR1cm4gdGhpcy5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5hbWVzID0gW11cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KHRoaXMuZmFjdG9yc1tpZHhdLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIHJldHVybiBuYW1lcy5zb3J0KClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcblxuICAgIHZhciBkdXBsaWNhdGVzID0gZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgZHVwbGljYXRlIGJpbmRpbmdzOicsIGR1cGxpY2F0ZXMpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5zZXEoJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLm91dHB1dFJlY2lwZSh3cylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIEJpbmRpbmdzXG5cbmZ1bmN0aW9uIEJpbmQoZXhwciwgbmFtZSkge1xuICB0aGlzLmV4cHIgPSBleHByXG4gIHRoaXMubmFtZSA9IG5hbWVcbn1cblxuQmluZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgIGJpbmRpbmdzLnB1c2godGhpcy5uYW1lLCB2YWx1ZSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5uYW1lXVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5iaW5kKCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLm5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBJdGVyYXRvcnMgYW5kIG9wdGlvbmFsc1xuXG5mdW5jdGlvbiBNYW55KGV4cHIsIG1pbk51bU1hdGNoZXMpIHtcbiAgdGhpcy5leHByID0gZXhwclxuICB0aGlzLm1pbk51bU1hdGNoZXMgPSBtaW5OdW1NYXRjaGVzXG59XG5cbk1hbnkucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBtYXRjaGVzID0gW11cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGJhY2t0cmFja1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgICAgaWYgKHZhbHVlID09PSBmYWlsKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGJhY2t0cmFja1Bvc1xuICAgICAgICBicmVha1xuICAgICAgfSBlbHNlXG4gICAgICAgIG1hdGNoZXMucHVzaCh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXMubGVuZ3RoIDwgdGhpcy5taW5OdW1NYXRjaGVzID8gIGZhaWwgOiBuZXcgTGlzdFRodW5rKG1hdGNoZXMpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLm1hbnkoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICB3cy5uZXh0UHV0QWxsKHRoaXMubWluTnVtTWF0Y2hlcylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gT3B0KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5PcHQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSA9PT0gZmFpbCkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgcmV0dXJuIHZhbHVlbGVzc1RodW5rXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gbmV3IExpc3RUaHVuayhbdmFsdWVdKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5vcHQoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBQcmVkaWNhdGVzXG5cbmZ1bmN0aW9uIE5vdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTm90LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICBpZiAodmFsdWUgIT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2Uge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgcmV0dXJuIHZhbHVlbGVzc1RodW5rXG4gICAgfVxuICB9LFxuXG4gIHNlbWFudGljQWN0aW9uQXJnTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIE92ZXJyaWRlIFBhdHRlcm4ncyBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggd291bGQgcmV0dXJuIFsndmFsdWUnXSBpbnN0ZWFkLlxuICAgIHJldHVybiBbXVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5ub3QoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG5mdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbkxvb2thaGVhZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgaWYgKHZhbHVlICE9PSBmYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmxhKCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gU3RyaW5nIGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gU3RyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5TdHIucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgc3RyaW5nID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgc3RyaW5nSW5wdXRTdHJlYW0gPSBuZXcgU3RyaW5nSW5wdXRTdHJlYW0oc3RyaW5nKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgc3RyaW5nSW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgcmV0dXJuIHZhbHVlICE9PSBmYWlsICYmIHN0cmluZ0lucHV0U3RyZWFtLmF0RW5kKCkgPyAgbmV3IFZhbHVlVGh1bmsoc3RyaW5nKSA6IGZhaWxcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLnN0cignKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIExpc3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBMaXN0KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5MaXN0LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIGxpc3QgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAobGlzdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB2YXIgbGlzdElucHV0U3RyZWFtID0gbmV3IExpc3RJbnB1dFN0cmVhbShsaXN0KVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgbGlzdElucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIHJldHVybiB2YWx1ZSAhPT0gZmFpbCAmJiBsaXN0SW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgVmFsdWVUaHVuayhsaXN0KSA6IGZhaWxcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmxzdCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWUgfSlcbiAgdmFyIGR1cGxpY2F0ZXMgPSBnZXREdXBsaWNhdGVzKG5hbWVzKVxuICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKVxuICAgIGJyb3dzZXIuZXJyb3IoJ29iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6JywgZHVwbGljYXRlcylcbiAgZWxzZSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIHRoaXMuaXNMZW5pZW50ID0gaXNMZW5pZW50XG4gIH1cbn1cblxuT2JqLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIG9iaiA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmIChvYmogIT09IGZhaWwgJiYgb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgdmFyIG51bU93blByb3BlcnRpZXNNYXRjaGVkID0gMFxuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzW2lkeF1cbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdXG4gICAgICAgIHZhciB2YWx1ZUlucHV0U3RyZWFtID0gbmV3IExpc3RJbnB1dFN0cmVhbShbdmFsdWVdKVxuICAgICAgICB2YXIgbWF0Y2hlZCA9XG4gICAgICAgICAgcHJvcGVydHkucGF0dGVybi5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIHZhbHVlSW5wdXRTdHJlYW0sIGJpbmRpbmdzKSAhPT0gZmFpbCAmJiB2YWx1ZUlucHV0U3RyZWFtLmF0RW5kKClcbiAgICAgICAgaWYgKCFtYXRjaGVkKVxuICAgICAgICAgIHJldHVybiBmYWlsXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkubmFtZSkpXG4gICAgICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrK1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXNMZW5pZW50IHx8IG51bU93blByb3BlcnRpZXNNYXRjaGVkID09PSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA/XG4gICAgICAgIG5ldyBWYWx1ZVRodW5rKG9iaikgOlxuICAgICAgICBmYWlsXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5hbWVzID0gW11cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG5cbiAgICB2YXIgZHVwbGljYXRlcyA9IGdldER1cGxpY2F0ZXModGhpcy5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKVxuICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGFuIG9iamVjdCBwYXR0ZXJuIHdpdGggZHVwbGljYXRlIGJpbmRpbmdzOicsIGR1cGxpY2F0ZXMpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICBmdW5jdGlvbiBvdXRwdXRQcm9wZXJ0eVJlY2lwZShwcm9wKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCd7bmFtZTogJylcbiAgICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcocHJvcC5uYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJywgcGF0dGVybjogJylcbiAgICAgIHByb3AucGF0dGVybi5vdXRwdXRSZWNpcGUod3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCd9JylcbiAgICB9XG5cbiAgICB3cy5uZXh0UHV0QWxsKCdiLm9iaihbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIG91dHB1dFByb3BlcnR5UmVjaXBlKHRoaXMucHJvcGVydGllc1tpZHhdKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCddLCAnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcoISF0aGlzLmlzTGVuaWVudCkpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFJ1bGUgYXBwbGljYXRpb25cblxuZnVuY3Rpb24gQXBwbHkocnVsZU5hbWUpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG59XG5cbkFwcGx5LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lXG4gICAgdmFyIG9yaWdQb3NJbmZvID0gaW5wdXRTdHJlYW0uZ2V0Q3VycmVudFBvc0luZm8oKVxuICAgIHZhciBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV1cbiAgICBpZiAobWVtb1JlYyAmJiBvcmlnUG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gbWVtb1JlYy5wb3NcbiAgICAgIHJldHVybiBtZW1vUmVjLnZhbHVlXG4gICAgfSBlbHNlIGlmIChvcmlnUG9zSW5mby5pc0FjdGl2ZShydWxlTmFtZSkpIHtcbiAgICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbiAmJiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5uYW1lID09PSBydWxlTmFtZSkge1xuICAgICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZFJ1bGVzKClcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gY3VycmVudExlZnRSZWN1cnNpb24ucG9zXG4gICAgICAgIHJldHVybiBjdXJyZW50TGVmdFJlY3Vyc2lvbi52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3JpZ1Bvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgICByZXR1cm4gZmFpbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYm9keSA9IHJ1bGVEaWN0W3J1bGVOYW1lXSB8fCBicm93c2VyLmVycm9yKCd1bmRlZmluZWQgcnVsZScsIHJ1bGVOYW1lKVxuICAgICAgb3JpZ1Bvc0luZm8uZW50ZXIocnVsZU5hbWUpXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbikge1xuICAgICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24ubmFtZSA9PT0gcnVsZU5hbWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuaGFuZGxlTGVmdFJlY3Vyc2lvbihib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3NJbmZvLnBvcywgY3VycmVudExlZnRSZWN1cnNpb24sIHZhbHVlKVxuICAgICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID1cbiAgICAgICAgICAgIHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlLCBpbnZvbHZlZFJ1bGVzOiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzfVxuICAgICAgICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24ocnVsZU5hbWUpXG4gICAgICAgIH0gZWxzZSBpZiAoIWN1cnJlbnRMZWZ0UmVjdXJzaW9uLmludm9sdmVkUnVsZXNbcnVsZU5hbWVdKVxuICAgICAgICAgIC8vIE9ubHkgbWVtb2l6ZSBpZiB0aGlzIHJ1bGUgaXMgbm90IGludm9sdmVkIGluIHRoZSBjdXJyZW50IGxlZnQgcmVjdXJzaW9uXG4gICAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH0gZWxzZVxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfVxuICAgICAgb3JpZ1Bvc0luZm8uZXhpdChydWxlTmFtZSlcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfSxcblxuICBldmFsT25jZTogZnVuY3Rpb24oZXhwciwgcnVsZURpY3QsIGlucHV0U3RyZWFtKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgYmluZGluZ3MgPSBbXVxuICAgIHZhciB2YWx1ZSA9IGV4cHIuZXZhbChpc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgUnVsZVRodW5rKHRoaXMucnVsZU5hbWUsIGlucHV0U3RyZWFtLnNvdXJjZSwgb3JpZ1BvcywgaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZSwgYmluZGluZ3MpXG4gIH0sXG5cbiAgaGFuZGxlTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zLCBjdXJyZW50TGVmdFJlY3Vyc2lvbiwgc2VlZFZhbHVlKSB7XG4gICAgdmFyIHZhbHVlID0gc2VlZFZhbHVlXG4gICAgaWYgKHNlZWRWYWx1ZSAhPT0gZmFpbCkge1xuICAgICAgY3VycmVudExlZnRSZWN1cnNpb24udmFsdWUgPSBzZWVkVmFsdWVcbiAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgICBpZiAodmFsdWUgIT09IGZhaWwgJiYgaW5wdXRTdHJlYW0ucG9zID4gY3VycmVudExlZnRSZWN1cnNpb24ucG9zKSB7XG4gICAgICAgICAgY3VycmVudExlZnRSZWN1cnNpb24udmFsdWUgPSB2YWx1ZVxuICAgICAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY3VycmVudExlZnRSZWN1cnNpb24udmFsdWVcbiAgICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3NcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5hcHAoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMucnVsZU5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBSdWxlIGV4cGFuc2lvbiAtLSBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gX0V4cGFuZChydWxlTmFtZSwgZ3JhbW1hcikge1xuICBpZiAoZ3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICBicm93c2VyLmVycm9yKCdncmFtbWFyJywgZ3JhbW1hci5uYW1lLCAnZG9lcyBub3QgaGF2ZSBhIHJ1bGUgY2FsbGVkJywgcnVsZU5hbWUpXG4gIGVsc2Uge1xuICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXJcbiAgfVxufVxuXG5fRXhwYW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgfSxcblxuICBleHBhbnNpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV1cbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cGFuc2lvbigpLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgLy8gbm8tb3BcbiAgfVxufSlcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdyYW1tYXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIocnVsZURpY3QpIHtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0XG59XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBydWxlRGljdDogbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuXyA9IGFueXRoaW5nXG4gICAgdGhpcy5lbmQgPSBuZXcgTm90KHRoaXMuXylcbiAgICB0aGlzLnNwYWNlID0gUHJpbS5uZXdGb3IoL1tcXHNdLylcbiAgICB0aGlzLnNwYWNlcyA9IG5ldyBNYW55KG5ldyBBcHBseSgnc3BhY2UnKSwgMClcbiAgICB0aGlzLmFsbnVtID0gUHJpbS5uZXdGb3IoL1swLTlhLXpBLVpdLylcbiAgICB0aGlzLmxldHRlciA9IFByaW0ubmV3Rm9yKC9bYS16QS1aXS8pXG4gICAgdGhpcy5sb3dlciA9IFByaW0ubmV3Rm9yKC9bYS16XS8pXG4gICAgdGhpcy51cHBlciA9IFByaW0ubmV3Rm9yKC9bQS1aXS8pXG4gICAgdGhpcy5kaWdpdCA9IFByaW0ubmV3Rm9yKC9bMC05XS8pXG4gICAgdGhpcy5oZXhEaWdpdCA9IFByaW0ubmV3Rm9yKC9bMC05YS1mQS1GXS8pXG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hDb250ZW50cyhbb2JqXSwgc3RhcnRSdWxlKVxuICB9LFxuXG4gIG1hdGNoQ29udGVudHM6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKG9iailcbiAgICB2YXIgdGh1bmsgPSBuZXcgQXBwbHkoc3RhcnRSdWxlKS5ldmFsKHVuZGVmaW5lZCwgdGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZClcbiAgICBpZiAoaXNTeW50YWN0aWMoc3RhcnRSdWxlKSlcbiAgICAgIHNraXBTcGFjZXModGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaCA9IHRoaXMuYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoLmJpbmQodGhpcylcbiAgICByZXR1cm4gdGh1bmsgPT09IGZhaWwgfHwgIWlucHV0U3RyZWFtLmF0RW5kKCkgP1xuICAgICAgZmFsc2UgOlxuICAgICAgZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgICAgICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2goYWN0aW9uRGljdClcbiAgICAgICAgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIHt9KVxuICAgICAgfVxuICB9LFxuXG4gIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaDogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBydWxlRGljdCA9IHRoaXMucnVsZURpY3RcbiAgICB2YXIgb2sgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0FuZFZhbHVlc0RvKHJ1bGVEaWN0LCBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgICAgaWYgKGFjdGlvbkRpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVyblxuICAgICAgdmFyIGFjdHVhbCA9IG9iamVjdFV0aWxzLmZvcm1hbHMoYWN0aW9uRGljdFtydWxlTmFtZV0pLnNvcnQoKVxuICAgICAgdmFyIGV4cGVjdGVkID0gYm9keS5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKClcbiAgICAgIGlmICghZXF1YWxzLmVxdWFscyhhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgICAgICBvayA9IGZhbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW1hbnRpYyBhY3Rpb24gZm9yIHJ1bGUnLCBydWxlTmFtZSwgJ2hhcyB0aGUgd3JvbmcgYXJndW1lbnQgbmFtZXMnKVxuICAgICAgICBjb25zb2xlLmxvZygnICBleHBlY3RlZCcsIGV4cGVjdGVkKVxuICAgICAgICBjb25zb2xlLmxvZygnICAgIGFjdHVhbCcsIGFjdHVhbClcbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICghb2spXG4gICAgICBicm93c2VyLmVycm9yKCdvbmUgb3IgbW9yZSBzZW1hbnRpYyBhY3Rpb25zIGhhdmUgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzIC0tIHNlZSBjb25zb2xlIGZvciBkZXRhaWxzJylcbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdzID0gbmV3IG9iamVjdFV0aWxzLlN0cmluZ0J1ZmZlcigpXG4gICAgd3MubmV4dFB1dEFsbCgnKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLmJ1aWxkZXIoKVxcbicpXG4gICAgd3MubmV4dFB1dEFsbCgnICBiLnNldE5hbWUoJyk7IHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7IHdzLm5leHRQdXRBbGwoJylcXG4nKVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5uYW1lICYmIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWVzcGFjZU5hbWUpIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgYi5zZXRTdXBlckdyYW1tYXIob2htLm5hbWVzcGFjZSgnKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykuZ2V0R3JhbW1hcignKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykpXFxuJylcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5ydWxlRGVjbHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICAnKVxuICAgICAgdGhpcy5ydWxlRGVjbHNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCdcXG4nKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcgIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJ30pJylcbiAgICByZXR1cm4gd3MuY29udGVudHMoKVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBCdWlsZGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSdWxlRGVjbCgpIHtcbiAgdGhyb3cgJ1J1bGVEZWNsIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5SdWxlRGVjbC5wcm90b3R5cGUgPSB7XG4gIHBlcmZvcm1DaGVja3M6IGFic3RyYWN0LFxuXG4gIHBlcmZvcm1Db21tb25DaGVja3M6IGZ1bmN0aW9uKG5hbWUsIGJvZHkpIHtcbiAgICBib2R5LmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MobmFtZSlcbiAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKG5hbWUpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5XG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuJylcbiAgICB3cy5uZXh0UHV0QWxsKHRoaXMua2luZClcbiAgICB3cy5uZXh0UHV0QWxsKCcoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHRoaXMuYm9keS5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn1cblxuZnVuY3Rpb24gRGVmaW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuRGVmaW5lLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2RlZmluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZGVmaW5lIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IG92ZXJyaWRlIG9yIGV4dGVuZCBpbnN0ZWFkLiknKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gT3ZlcnJpZGUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5PdmVycmlkZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdvdmVycmlkZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IG92ZXJyaWRlIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5ib2R5KVxuICB9XG59KVxuXG5mdW5jdGlvbiBJbmxpbmUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5JbmxpbmUucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnaW5saW5lJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciByZWxheGluZyB0aGlzIGNoZWNrLCBlLmcuLCBtYWtlIGl0IG9rIHRvIG92ZXJyaWRlIGFuIGlubGluZSBydWxlIGlmIHRoZSBuZXN0aW5nIHJ1bGUgaXNcbiAgICAvLyBhbiBvdmVycmlkZS4gQnV0IG9ubHkgaWYgdGhlIGlubGluZSBydWxlIHRoYXQncyBiZWluZyBvdmVycmlkZGVuIGlzIG5lc3RlZCBpbnNpZGUgdGhlIG5lc3RpbmcgcnVsZSB0aGF0XG4gICAgLy8gd2UncmUgb3ZlcnJpZGluZz8gSG9wZWZ1bGx5IHRoZXJlJ3MgYSBtdWNoIGxlc3MgY29tcGxpY2F0ZWQgd2F5IHRvIGRvIHRoaXMgOilcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2Nhbm5vdCBkZWZpbmUgaW5saW5lIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBzdXBlci1ncmFtbWFyLicpXG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5ib2R5KVxuICB9XG59KVxuXG5mdW5jdGlvbiBFeHRlbmQobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLmV4cGFuZGVkQm9keSA9IG5ldyBBbHQoW2JvZHksIG5ldyBfRXhwYW5kKG5hbWUsIHN1cGVyR3JhbW1hcildKVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5FeHRlbmQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnZXh0ZW5kJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZXh0ZW5kIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuZXhwYW5kZWRCb2R5KVxuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuZXhwYW5kZWRCb2R5XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIEJ1aWxkZXIoKSB7XG4gIHRoaXMuaW5pdCgpXG59XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm5hbWUgPSB1bmRlZmluZWRcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IEdyYW1tYXIucHJvdG90eXBlXG4gICAgdGhpcy5ydWxlRGVjbHMgPSBbXVxuICB9LFxuXG4gIHNldE5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gIH0sXG5cbiAgc2V0U3VwZXJHcmFtbWFyOiBmdW5jdGlvbihncmFtbWFyKSB7XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBncmFtbWFyXG4gIH0sXG5cbiAgZGVmaW5lOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IERlZmluZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICB9LFxuXG4gIG92ZXJyaWRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IE92ZXJyaWRlKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgaW5saW5lOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IElubGluZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICAgIHJldHVybiB0aGlzLmFwcChydWxlTmFtZSlcbiAgfSxcblxuICBleHRlbmQ6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgRXh0ZW5kKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdE5hbWVzcGFjZSkge1xuICAgIHZhciBzdXBlckdyYW1tYXIgPSB0aGlzLnN1cGVyR3JhbW1hclxuICAgIHZhciBydWxlRGljdCA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhzdXBlckdyYW1tYXIucnVsZURpY3QpXG4gICAgdGhpcy5ydWxlRGVjbHMuZm9yRWFjaChmdW5jdGlvbihydWxlRGVjbCkge1xuICAgICAgcnVsZURlY2wucGVyZm9ybUNoZWNrcygpXG4gICAgICBydWxlRGVjbC5pbnN0YWxsKHJ1bGVEaWN0KVxuICAgIH0pXG5cbiAgICB2YXIgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKHJ1bGVEaWN0KVxuICAgIGdyYW1tYXIuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG4gICAgZ3JhbW1hci5ydWxlRGVjbHMgPSB0aGlzLnJ1bGVEZWNsc1xuICAgIGlmICh0aGlzLm5hbWUpIHtcbiAgICAgIGdyYW1tYXIubmFtZSA9IHRoaXMubmFtZVxuICAgICAgaWYgKG9wdE5hbWVzcGFjZSkge1xuICAgICAgICBncmFtbWFyLm5hbWVzcGFjZU5hbWUgPSBvcHROYW1lc3BhY2UubmFtZVxuICAgICAgICBvcHROYW1lc3BhY2UuaW5zdGFsbCh0aGlzLm5hbWUsIGdyYW1tYXIpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpXG4gICAgcmV0dXJuIGdyYW1tYXJcbiAgfSxcblxuICBfOiBmdW5jdGlvbih4KSB7IHJldHVybiBQcmltLm5ld0Zvcih4KSB9LFxuICBhbHQ6IGZ1bmN0aW9uKC8qIHRlcm0xLCB0ZXJtMSwgLi4uICovKSB7XG4gICAgdmFyIHRlcm1zID0gW11cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdXG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgQWx0KVxuICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpXG4gICAgICBlbHNlXG4gICAgICAgIHRlcm1zLnB1c2goYXJnKVxuICAgIH1cbiAgICByZXR1cm4gdGVybXMubGVuZ3RoID09IDEgPyB0ZXJtc1swXSA6IG5ldyBBbHQodGVybXMpXG4gIH0sXG4gIHNlcTogZnVuY3Rpb24oLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgdmFyIGZhY3RvcnMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBTZXEpXG4gICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycylcbiAgICAgIGVsc2VcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZylcbiAgICB9XG4gICAgcmV0dXJuIGZhY3RvcnMubGVuZ3RoID09IDEgPyBmYWN0b3JzWzBdIDogbmV3IFNlcShmYWN0b3JzKVxuICB9LFxuICBiaW5kOiBmdW5jdGlvbihleHByLCBuYW1lKSB7IHJldHVybiBuZXcgQmluZChleHByLCBuYW1lKSB9LFxuICBtYW55OiBmdW5jdGlvbihleHByLCBtaW5OdW1NYXRjaGVzKSB7IHJldHVybiBuZXcgTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB9LFxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBPcHQoZXhwcikgfSxcbiAgbm90OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTm90KGV4cHIpIH0sXG4gIGxhOiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTG9va2FoZWFkKGV4cHIpIH0sXG4gIHN0cjogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IFN0cihleHByKSB9LFxuICBsc3Q6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBMaXN0KGV4cHIpIH0sXG4gIG9iajogZnVuY3Rpb24ocHJvcGVydGllcywgaXNMZW5pZW50KSB7IHJldHVybiBuZXcgT2JqKHByb3BlcnRpZXMsICEhaXNMZW5pZW50KSB9LFxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7IHJldHVybiBuZXcgQXBwbHkocnVsZU5hbWUpIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5hbWVzcGFjZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBuYW1lc3BhY2VzID0ge31cblxuZnVuY3Rpb24gTmFtZXNwYWNlKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmdyYW1tYXJzID0ge31cbn1cblxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IHtcbiAgaW5zdGFsbDogZnVuY3Rpb24obmFtZSwgZ3JhbW1hcikge1xuICAgIGlmICh0aGlzLmdyYW1tYXJzW25hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignZHVwbGljYXRlIGRlY2xhcmF0aW9uIG9mIGdyYW1tYXInLCBuYW1lLCAnaW4gbmFtZXNwYWNlJywgdGhpcy5uYW1lKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuZ3JhbW1hcnNbbmFtZV0gPSBncmFtbWFyXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcblxuICBnZXRHcmFtbWFyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hcnNbbmFtZV0gfHwgYnJvd3Nlci5lcnJvcignb2htIG5hbWVzcGFjZScsIHRoaXMubmFtZSwgJ2hhcyBubyBncmFtbWFyIGNhbGxlZCcsIG5hbWUpXG4gIH0sXG5cbiAgbG9hZEdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBicm93c2VyLnNhbml0eUNoZWNrKCdzY3JpcHQgdGFnXFwncyB0eXBlIGF0dHJpYnV0ZSBtdXN0IGJlIFwidGV4dC9vaG0tanNcIicsIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQvb2htLWpzJylcbiAgICBtYWtlR3JhbW1hcnMoZWxlbWVudC5pbm5lckhUTUwsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRmFjdG9yaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSB7XG4gIHZhciBidWlsZGVyXG4gIHJldHVybiB7XG4gICAgc3BhY2U6IGZ1bmN0aW9uKHZhbHVlKSB7fSxcblxuICAgIF9uYW1lOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHMoKSB9LFxuICAgIG5hbWVGaXJzdDogZnVuY3Rpb24odmFsdWUpIHt9LFxuICAgIG5hbWVSZXN0OiBmdW5jdGlvbih2YWx1ZSkge30sXG5cbiAgICBuYW1lOiBmdW5jdGlvbihuKSB7IHJldHVybiBuIH0sXG5cbiAgICBuYW1lZENvbnN0OiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnbmFtZWRDb25zdC11bmRlZmluZWQnOiBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZCB9LFxuICAgICduYW1lZENvbnN0LW51bGwnOiBmdW5jdGlvbigpIHsgcmV0dXJuIG51bGwgfSxcbiAgICAnbmFtZWRDb25zdC10cnVlJzogZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0sXG4gICAgJ25hbWVkQ29uc3QtZmFsc2UnOiBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlIH0sXG5cbiAgICBzdHJpbmc6IGZ1bmN0aW9uKGNzKSB7IHJldHVybiBjcy5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gc3RyaW5nVXRpbHMudW5lc2NhcGVDaGFyKGMpIH0pLmpvaW4oJycpIH0sXG4gICAgc0NoYXI6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICByZWdleHA6IGZ1bmN0aW9uKGUpIHsgcmV0dXJuIG5ldyBSZWdFeHAoZSkgfSxcbiAgICByZUNoYXJDbGFzczogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICBudW1iZXI6IGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5pbnRlcnZhbC5jb250ZW50cygpKSB9LFxuXG4gICAgQWx0OiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnQWx0LXJlYyc6IGZ1bmN0aW9uKHgsIHkpIHsgcmV0dXJuIGJ1aWxkZXIuYWx0KHgsIHkpIH0sXG5cbiAgICBUZXJtOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnVGVybS1pbmxpbmUnOiBmdW5jdGlvbih4LCBuKSB7IHJldHVybiBidWlsZGVyLmlubGluZShidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSArICctJyArIG4sIHgpIH0sXG5cbiAgICBTZXE6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCB2YWx1ZSkgfSxcblxuICAgIEZhY3RvcjogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlIH0sXG4gICAgJ0ZhY3Rvci1iaW5kJzogZnVuY3Rpb24oeCwgbikgeyByZXR1cm4gYnVpbGRlci5iaW5kKHgsIG4pIH0sXG5cbiAgICBJdGVyOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnSXRlci1zdGFyJzogZnVuY3Rpb24oeCkgeyByZXR1cm4gYnVpbGRlci5tYW55KHgsIDApIH0sXG4gICAgJ0l0ZXItcGx1cyc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIubWFueSh4LCAxKSB9LFxuICAgICdJdGVyLW9wdCc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIub3B0KHgpIH0sXG5cbiAgICBQcmVkOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnUHJlZC1ub3QnOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLm5vdCh4KSB9LFxuICAgICdQcmVkLWxvb2thaGVhZCc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIubGEoeCkgfSxcblxuICAgIEJhc2U6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdCYXNlLXVuZGVmaW5lZCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKHVuZGVmaW5lZCkgfSxcbiAgICAnQmFzZS1udWxsJzogZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8obnVsbCkgfSxcbiAgICAnQmFzZS10cnVlJzogZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8odHJ1ZSkgfSxcbiAgICAnQmFzZS1mYWxzZSc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKGZhbHNlKSB9LFxuICAgICdCYXNlLWFwcGxpY2F0aW9uJzogZnVuY3Rpb24ocnVsZU5hbWUpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKHJ1bGVOYW1lKSB9LFxuICAgICdCYXNlLXByaW0nOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLl8oeCkgfSxcbiAgICAnQmFzZS1sc3QnOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLmxzdCh4KSB9LFxuICAgICdCYXNlLXN0cic6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIuc3RyKHgpIH0sXG4gICAgJ0Jhc2UtcGFyZW4nOiBmdW5jdGlvbih4KSB7IHJldHVybiB4IH0sXG4gICAgJ0Jhc2Utb2JqJzogZnVuY3Rpb24obGVuaWVudCkgeyByZXR1cm4gYnVpbGRlci5vYmooW10sIGxlbmllbnQpIH0sXG4gICAgJ0Jhc2Utb2JqV2l0aFByb3BzJzogZnVuY3Rpb24ocHMsIGxlbmllbnQpIHsgcmV0dXJuIGJ1aWxkZXIub2JqKHBzLCBsZW5pZW50KSB9LFxuXG4gICAgUHJvcHM6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdQcm9wcy1iYXNlJzogZnVuY3Rpb24ocCkgeyByZXR1cm4gW3BdIH0sXG4gICAgJ1Byb3BzLXJlYyc6IGZ1bmN0aW9uKHAsIHBzKSB7IHJldHVybiBbcF0uY29uY2F0KHBzKSB9LFxuICAgIFByb3A6IGZ1bmN0aW9uKG4sIHApIHsgcmV0dXJuIHtuYW1lOiBuLCBwYXR0ZXJuOiBwfSB9LFxuXG4gICAgUnVsZTogZnVuY3Rpb24odmFsdWUpIHt9LFxuICAgICdSdWxlLWRlZmluZSc6IGZ1bmN0aW9uKG4sIGIpIHsgcmV0dXJuIGJ1aWxkZXIuZGVmaW5lKG4sIGIpIH0sXG4gICAgJ1J1bGUtb3ZlcnJpZGUnOiBmdW5jdGlvbihuLCBiKSB7IHJldHVybiBidWlsZGVyLm92ZXJyaWRlKG4sIGIpIH0sXG4gICAgJ1J1bGUtZXh0ZW5kJzogZnVuY3Rpb24obiwgYikgeyByZXR1cm4gYnVpbGRlci5leHRlbmQobiwgYikgfSxcbiAgICBSdWxlTmFtZTogZnVuY3Rpb24odmFsdWUpIHsgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSB2YWx1ZTsgcmV0dXJuIHZhbHVlIH0sXG5cbiAgICBTdXBlckdyYW1tYXI6IGZ1bmN0aW9uKHZhbHVlKSB7IGJ1aWxkZXIuc2V0U3VwZXJHcmFtbWFyKHZhbHVlKSB9LFxuICAgICdTdXBlckdyYW1tYXItcXVhbGlmaWVkJzogZnVuY3Rpb24obnMsIG4pIHsgcmV0dXJuIG9obS5uYW1lc3BhY2UobnMpLmdldEdyYW1tYXIobikgfSxcbiAgICAnU3VwZXJHcmFtbWFyLXVucXVhbGlmaWVkJzogZnVuY3Rpb24obikgeyByZXR1cm4gb3B0TmFtZXNwYWNlLmdldEdyYW1tYXIobikgfSxcblxuICAgIEdyYW1tYXI6IGZ1bmN0aW9uKG4sIHMsIHJzKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5idWlsZChvcHROYW1lc3BhY2UpXG4gICAgfSxcbiAgICBHcmFtbWFyczogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH0sXG4gICAgR3JhbW1hck5hbWU6IGZ1bmN0aW9uKHZhbHVlKSB7IGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpOyBidWlsZGVyLnNldE5hbWUodmFsdWUpOyByZXR1cm4gdmFsdWUgfVxuICB9XG59XG5cbnZhciBmaXJzdCA9IHRydWVcbmZ1bmN0aW9uIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgd2hhdEl0SXMsIG9wdE5hbWVzcGFjZSkge1xuICB2YXIgdGh1bmsgPSB0aGlzTW9kdWxlLl9vaG1HcmFtbWFyLm1hdGNoQ29udGVudHMoc291cmNlLCB3aGF0SXRJcylcbiAgaWYgKHRodW5rKVxuICAgIHJldHVybiB0aHVuayhtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSlcbiAgZWxzZVxuICAgIC8vIFRPRE86IGltcHJvdmUgZXJyb3IgbWVzc2FnZSAoc2hvdyB3aGF0IHBhcnQgb2YgdGhlIGlucHV0IGlzIHdyb25nLCB3aGF0IHdhcyBleHBlY3RlZCwgZXRjLilcbiAgICBicm93c2VyLmVycm9yKCdpbnZhbGlkIGlucHV0IGluOicsIHNvdXJjZSlcbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXIoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXInLCBvcHROYW1lc3BhY2UpXG59XG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFycyhzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICByZXR1cm4gY29tcGlsZUFuZExvYWQoc291cmNlLCAnR3JhbW1hcnMnLCBvcHROYW1lc3BhY2UpXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQdWJsaWMgbWV0aG9kc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gU3R1ZmYgdGhhdCB1c2VycyBzaG91bGQga25vdyBhYm91dFxuXG50aGlzTW9kdWxlLm5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgaWYgKG5hbWVzcGFjZXNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICBuYW1lc3BhY2VzW25hbWVdID0gbmV3IE5hbWVzcGFjZShuYW1lKVxuICByZXR1cm4gbmFtZXNwYWNlc1tuYW1lXVxufVxuXG50aGlzTW9kdWxlLm1ha2VHcmFtbWFyID0gbWFrZUdyYW1tYXJcbnRoaXNNb2R1bGUubWFrZUdyYW1tYXJzID0gbWFrZUdyYW1tYXJzXG5cbi8vIFN0dWZmIHRoYXQncyBvbmx5IHVzZWZ1bCBmb3IgYm9vdHN0cmFwcGluZywgdGVzdGluZywgZXRjLlxuXG4vLyBUT0RPOiByZW5hbWUgdG8gX2J1aWxkZXJcbnRoaXNNb2R1bGUuYnVpbGRlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEJ1aWxkZXIoKVxufVxuXG50aGlzTW9kdWxlLl9tYWtlR3JhbW1hckFjdGlvbkRpY3QgPSBtYWtlR3JhbW1hckFjdGlvbkRpY3RcblxudmFyIG9obUdyYW1tYXJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzTW9kdWxlLCAnX29obUdyYW1tYXInLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFvaG1HcmFtbWFyKVxuICAgICAgb2htR3JhbW1hciA9IHRoaXMuX29obUdyYW1tYXJGYWN0b3J5KHRoaXMpXG4gICAgcmV0dXJuIG9obUdyYW1tYXJcbiAgfVxufSlcblxuIl19
(7)
});
