!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/ohm.js')
ohm._ohmGrammarFactory =
(function(ohm, optNamespace) {
  var b = ohm.builder()
  b.setName('Ohm')
  b.inline('space-singleLine', b.seq(b._('//'), b.many(b.seq(b.not(b._('\n')), b.app('_')), 0), b._('\n')))
  b.inline('space-multiLine', b.seq(b._('/*'), b.many(b.seq(b.not(b._('*/')), b.app('_')), 0), b._('*/')))
  b.extend('space', b.alt(b.app('space-singleLine'), b.app('space-multiLine')))
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
  b.inline('Base-prim', b.alt(b.app('namedConst'), b.app('string'), b.app('regexp'), b.app('number')))
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
  b.inline('Rule-define', b.seq(b.bind(b.app('name'), 'n'), b._('=='), b.bind(b.app('Alt'), 'b')))
  b.inline('Rule-override', b.seq(b.bind(b.app('name'), 'n'), b._(':='), b.bind(b.app('Alt'), 'b')))
  b.inline('Rule-extend', b.seq(b.bind(b.app('name'), 'n'), b._('+='), b.bind(b.app('Alt'), 'b')))
  b.define('Rule', b.alt(b.app('Rule-define'), b.app('Rule-override'), b.app('Rule-extend')))
  b.inline('SuperGrammar-qualified', b.seq(b._('<:'), b.bind(b.app('name'), 'ns'), b._('.'), b.bind(b.app('name'), 'n')))
  b.inline('SuperGrammar-unqualified', b.seq(b._('<:'), b.bind(b.app('name'), 'n')))
  b.define('SuperGrammar', b.alt(b.app('SuperGrammar-qualified'), b.app('SuperGrammar-unqualified')))
  b.define('Grammar', b.seq(b.bind(b.app('name'), 'n'), b.bind(b.opt(b.app('SuperGrammar')), 's'), b._('{'), b.bind(b.many(b.app('Rule'), 0), 'rs'), b._('}')))
  b.define('Grammars', b.many(b.app('Grammar'), 0))
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

function Thunk() {}

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

RuleThunk.prototype = objectUtils.objectThatDelegatesTo(Thunk.prototype, {
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

ListThunk.prototype = objectUtils.objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    if (!memo.hasOwnProperty(this.id))
      memo[this.id] = this.thunks.map(function(thunk) { return thunk.force(actionDict, memo) })
    return memo[this.id]
  }
})

function ValueThunk(value) {
  this.value = value
}

ValueThunk.prototype = objectUtils.objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    return this.value
  }
})

var valuelessThunk = new ValueThunk(undefined)

// --------------------------------------------------------------------
// Types of patterns
// --------------------------------------------------------------------

// General stuff

function Pattern() {
  throw 'Pattern cannot be instantiated -- it\'s abstract'
}

Pattern.prototype = {
  getBindingNames: function() {
    return []
  },

  producesValue: function() {
    return true
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

  producesValue: function() {
    for (var idx = 0; idx < this.terms.length; idx++)
      if (!this.terms[idx].producesValue())
        return false
    return true
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

  getBindingNames: function() {
    var names = []
    for (var idx = 0; idx < this.factors.length; idx++)
      names = names.concat(this.factors[idx].getBindingNames())
    return names.sort()
  },

  producesValue: function() {
    return false
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

  producesValue: function() {
    return false
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

  producesValue: function() {
    return this.expansion().producesValue()
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
    var self = this
    var ruleDict = this.ruleDict
    var ok = true
    objectUtils.keysDo(ruleDict, function(ruleName) {
      if (actionDict[ruleName] === undefined)
        return
      var actual = objectUtils.formals(actionDict[ruleName]).sort()
      var expected = self.semanticActionArgNames(ruleName)
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

  semanticActionArgNames: function(ruleName) {
    if (this.superGrammar && this.superGrammar.ruleDict[ruleName])
      return this.superGrammar.semanticActionArgNames(ruleName)
    else {
      var body = this.ruleDict[ruleName]
      var names = body.getBindingNames()
      return names.length > 0 || body.producesValue() ? ['env'] : []
    }
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
    var overridden = this.superGrammar.ruleDict[this.name]
    if (!overridden)
      browser.error('cannot override rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)')
    if (overridden.getBindingNames().length === 0 && overridden.producesValue() && !this.body.producesValue())
      browser.error('the body of rule', this.name,
                    'must produce a value, because the rule it\'s overriding also produces a value')
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
    var extended = this.superGrammar.ruleDict[this.name]
    if (!extended)
      browser.error('cannot extend rule', this.name, 'because it does not exist in the super-grammar.',
                    '(try define instead.)')
    if (extended.getBindingNames().length === 0 && extended.producesValue() && !this.body.producesValue())
      browser.error('the body of rule', this.name,
                    'must produce a value, because the rule it\'s extending also produces a value')
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
    return terms.length === 1 ? terms[0] : new Alt(terms)
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
    return factors.length === 1 ? factors[0] : new Seq(factors)
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
    space:                      function(env) {},
    'space-multiLine':          function() {},
    'space-singleLine':         function() {},

    _name:                      function() { return this.interval.contents() },
    nameFirst:                  function(env) {},
    nameRest:                   function(env) {},

    name:                       function(env) { return env.n },

    namedConst:                 function(env) { return env.value },
    'namedConst-undefined':     function() { return undefined },
    'namedConst-null':          function() { return null },
    'namedConst-true':          function() { return true },
    'namedConst-false':         function() { return false },

    string:                     function(env) {
                                  return env.cs.map(function(c) { return stringUtils.unescapeChar(c) }).join('')
                                },
    sChar:                      function() { return this.interval.contents() },
    regexp:                     function(env) { return new RegExp(env.e) },
    reCharClass:                function() { return this.interval.contents() },
    number:                     function() { return parseInt(this.interval.contents()) },

    Alt:                        function(env) { return env.value },
    'Alt-rec':                  function(env) { return builder.alt(env.x, env.y) },

    Term:                       function(env) { return env.value },
    'Term-inline':              function(env) { return builder.inline(builder.currentRuleName + '-' + env.n, env.x) },

    Seq:                        function(env) { return builder.seq.apply(builder, env.value) },

    Factor:                     function(env) { return env.value },
    'Factor-bind':              function(env) { return builder.bind(env.x, env.n) },

    Iter:                       function(env) { return env.value },
    'Iter-star':                function(env) { return builder.many(env.x, 0) },
    'Iter-plus':                function(env) { return builder.many(env.x, 1) },
    'Iter-opt':                 function(env) { return builder.opt(env.x) },

    Pred:                       function(env) { return env.value },
    'Pred-not':                 function(env) { return builder.not(env.x) },
    'Pred-lookahead':           function(env) { return builder.la(env.x) },

    Base:                       function(env) { return env.value },
    'Base-undefined':           function() { return builder._(undefined) },
    'Base-null':                function() { return builder._(null) },
    'Base-true':                function() { return builder._(true) },
    'Base-false':               function() { return builder._(false) },
    'Base-application':         function(env) { return builder.app(env.ruleName) },
    'Base-prim':                function(env) { return builder._(env.value) },
    'Base-lst':                 function(env) { return builder.lst(env.x) },
    'Base-str':                 function(env) { return builder.str(env.x) },
    'Base-paren':               function(env) { return env.x },
    'Base-obj':                 function(env) { return builder.obj([], env.lenient) },
    'Base-objWithProps':        function(env) { return builder.obj(env.ps, env.lenient) },

    Props:                      function(env) { return env.value },
    'Props-base':               function(env) { return [env.p] },
    'Props-rec':                function(env) { return [env.p].concat(env.ps) },
    Prop:                       function(env) { return {name: env.n, pattern: env.p} },

    Rule:                       function(env) { return env.value },
    'Rule-define':              function(env) {
                                  builder.currentRuleName = env.n
                                  return builder.define(env.n, env.b)
                                },
    'Rule-override':            function(env) {
                                  builder.currentRuleName = env.n
                                  return builder.override(env.n, env.b)
                                },
    'Rule-extend':              function(env) {
                                  builder.currentRuleName = env.n
                                  return builder.extend(env.n, env.b)
                                },

    SuperGrammar:               function(env) { builder.setSuperGrammar(env.value) },
    'SuperGrammar-qualified':   function(env) { return thisModule.namespace(env.ns).getGrammar(env.n) },
    'SuperGrammar-unqualified': function(env) { return optNamespace.getGrammar(env.n) },

    Grammar:                    function(env) {
                                  builder = new Builder()
                                  builder.setName(env.n)
                                  env.s  // force evaluation
                                  env.rs  // force evaluation
                                  return builder.build(optNamespace)
                                },
    Grammars:                   function(env) { return env.value }
  }
}

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9vaG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uL3NyYy9vaG0uanMnKVxub2htLl9vaG1HcmFtbWFyRmFjdG9yeSA9XG4oZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIGIgPSBvaG0uYnVpbGRlcigpXG4gIGIuc2V0TmFtZSgnT2htJylcbiAgYi5pbmxpbmUoJ3NwYWNlLXNpbmdsZUxpbmUnLCBiLnNlcShiLl8oJy8vJyksIGIubWFueShiLnNlcShiLm5vdChiLl8oJ1xcbicpKSwgYi5hcHAoJ18nKSksIDApLCBiLl8oJ1xcbicpKSlcbiAgYi5pbmxpbmUoJ3NwYWNlLW11bHRpTGluZScsIGIuc2VxKGIuXygnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCcqLycpKSlcbiAgYi5leHRlbmQoJ3NwYWNlJywgYi5hbHQoYi5hcHAoJ3NwYWNlLXNpbmdsZUxpbmUnKSwgYi5hcHAoJ3NwYWNlLW11bHRpTGluZScpKSlcbiAgYi5kZWZpbmUoJ19uYW1lJywgYi5zZXEoYi5hcHAoJ25hbWVGaXJzdCcpLCBiLm1hbnkoYi5hcHAoJ25hbWVSZXN0JyksIDApKSlcbiAgYi5kZWZpbmUoJ25hbWVGaXJzdCcsIGIuYWx0KGIuXygnXycpLCBiLmFwcCgnbGV0dGVyJykpKVxuICBiLmRlZmluZSgnbmFtZVJlc3QnLCBiLmFsdChiLl8oJ18nKSwgYi5hcHAoJ2FsbnVtJykpKVxuICBiLmRlZmluZSgnbmFtZScsIGIuc2VxKGIubm90KGIuYXBwKCduYW1lZENvbnN0JykpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJykpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC11bmRlZmluZWQnLCBiLnNlcShiLl8oJ3VuZGVmaW5lZCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC1udWxsJywgYi5zZXEoYi5fKCdudWxsJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LXRydWUnLCBiLnNlcShiLl8oJ3RydWUnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtZmFsc2UnLCBiLnNlcShiLl8oJ2ZhbHNlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuZGVmaW5lKCduYW1lZENvbnN0JywgYi5hbHQoYi5hcHAoJ25hbWVkQ29uc3QtdW5kZWZpbmVkJyksIGIuYXBwKCduYW1lZENvbnN0LW51bGwnKSwgYi5hcHAoJ25hbWVkQ29uc3QtdHJ1ZScpLCBiLmFwcCgnbmFtZWRDb25zdC1mYWxzZScpKSlcbiAgYi5kZWZpbmUoJ3N0cmluZycsIGIuc2VxKGIuXyhcIidcIiksIGIuYmluZChiLm1hbnkoYi5hcHAoJ3NDaGFyJyksIDApLCAnY3MnKSwgYi5fKFwiJ1wiKSkpXG4gIGIuZGVmaW5lKCdzQ2hhcicsIGIuYWx0KGIuc2VxKGIuXygnXFxcXHgnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5fKCdcXFxcdScpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXCcpLCBiLmFwcCgnXycpKSwgYi5zZXEoYi5ub3QoYi5fKFwiJ1wiKSksIGIuYXBwKCdfJykpKSlcbiAgYi5kZWZpbmUoJ3JlZ2V4cCcsIGIuc2VxKGIuXygnLycpLCBiLmJpbmQoYi5hcHAoJ3JlQ2hhckNsYXNzJyksICdlJyksIGIuXygnLycpKSlcbiAgYi5kZWZpbmUoJ3JlQ2hhckNsYXNzJywgYi5zZXEoYi5fKCdbJyksIGIubWFueShiLmFsdChiLl8oJ1xcXFxdJyksIGIuc2VxKGIubm90KGIuXygnXScpKSwgYi5hcHAoJ18nKSkpLCAwKSwgYi5fKCddJykpKVxuICBiLmRlZmluZSgnbnVtYmVyJywgYi5zZXEoYi5vcHQoYi5fKCctJykpLCBiLm1hbnkoYi5hcHAoJ2RpZ2l0JyksIDEpKSlcbiAgYi5pbmxpbmUoJ0FsdC1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Rlcm0nKSwgJ3gnKSwgYi5fKCd8JyksIGIuYmluZChiLmFwcCgnQWx0JyksICd5JykpKVxuICBiLmRlZmluZSgnQWx0JywgYi5hbHQoYi5hcHAoJ0FsdC1yZWMnKSwgYi5hcHAoJ1Rlcm0nKSkpXG4gIGIuaW5saW5lKCdUZXJtLWlubGluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnU2VxJyksICd4JyksIGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ1Rlcm0nLCBiLmFsdChiLmFwcCgnVGVybS1pbmxpbmUnKSwgYi5hcHAoJ1NlcScpKSlcbiAgYi5kZWZpbmUoJ1NlcScsIGIubWFueShiLmFwcCgnRmFjdG9yJyksIDApKVxuICBiLmlubGluZSgnRmFjdG9yLWJpbmQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ0l0ZXInKSwgJ3gnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5kZWZpbmUoJ0ZhY3RvcicsIGIuYWx0KGIuYXBwKCdGYWN0b3ItYmluZCcpLCBiLmFwcCgnSXRlcicpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItc3RhcicsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJyonKSkpXG4gIGIuaW5saW5lKCdJdGVyLXBsdXMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCcrJykpKVxuICBiLmlubGluZSgnSXRlci1vcHQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCc/JykpKVxuICBiLmRlZmluZSgnSXRlcicsIGIuYWx0KGIuYXBwKCdJdGVyLXN0YXInKSwgYi5hcHAoJ0l0ZXItcGx1cycpLCBiLmFwcCgnSXRlci1vcHQnKSwgYi5hcHAoJ1ByZWQnKSkpXG4gIGIuaW5saW5lKCdQcmVkLW5vdCcsIGIuc2VxKGIuXygnficpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuaW5saW5lKCdQcmVkLWxvb2thaGVhZCcsIGIuc2VxKGIuXygnJicpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuZGVmaW5lKCdQcmVkJywgYi5hbHQoYi5hcHAoJ1ByZWQtbm90JyksIGIuYXBwKCdQcmVkLWxvb2thaGVhZCcpLCBiLmFwcCgnQmFzZScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtYXBwbGljYXRpb24nLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ3J1bGVOYW1lJyksIGIubm90KGIuYWx0KGIuXygnPT0nKSwgYi5fKCc6PScpLCBiLl8oJys9JykpKSkpXG4gIGIuaW5saW5lKCdCYXNlLXByaW0nLCBiLmFsdChiLmFwcCgnbmFtZWRDb25zdCcpLCBiLmFwcCgnc3RyaW5nJyksIGIuYXBwKCdyZWdleHAnKSwgYi5hcHAoJ251bWJlcicpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtbHN0JywgYi5zZXEoYi5fKCdbJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnXScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utc3RyJywgYi5zZXEoYi5fKCdcIicpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJ1wiJykpKVxuICBiLmlubGluZSgnQmFzZS1wYXJlbicsIGIuc2VxKGIuXygnKCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJyknKSkpXG4gIGIuaW5saW5lKCdCYXNlLW9iaicsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5vcHQoYi5fKCcuLi4nKSksICdsZW5pZW50JyksIGIuXygnfScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utb2JqV2l0aFByb3BzJywgYi5zZXEoYi5fKCd7JyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJyksIGIuYmluZChiLm9wdChiLnNlcShiLl8oJywnKSwgYi5fKCcuLi4nKSkpLCAnbGVuaWVudCcpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdCYXNlJywgYi5hbHQoYi5hcHAoJ0Jhc2UtYXBwbGljYXRpb24nKSwgYi5hcHAoJ0Jhc2UtcHJpbScpLCBiLmFwcCgnQmFzZS1sc3QnKSwgYi5hcHAoJ0Jhc2Utc3RyJyksIGIuYXBwKCdCYXNlLXBhcmVuJyksIGIuYXBwKCdCYXNlLW9iaicpLCBiLmFwcCgnQmFzZS1vYmpXaXRoUHJvcHMnKSkpXG4gIGIuaW5saW5lKCdQcm9wcy1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSwgYi5fKCcsJyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJykpKVxuICBiLmlubGluZSgnUHJvcHMtYmFzZScsIGIuYmluZChiLmFwcCgnUHJvcCcpLCAncCcpKVxuICBiLmRlZmluZSgnUHJvcHMnLCBiLmFsdChiLmFwcCgnUHJvcHMtcmVjJyksIGIuYXBwKCdQcm9wcy1iYXNlJykpKVxuICBiLmRlZmluZSgnUHJvcCcsIGIuc2VxKGIuYmluZChiLmFsdChiLmFwcCgnX25hbWUnKSwgYi5hcHAoJ3N0cmluZycpKSwgJ24nKSwgYi5fKCc6JyksIGIuYmluZChiLmFwcCgnRmFjdG9yJyksICdwJykpKVxuICBiLmlubGluZSgnUnVsZS1kZWZpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5fKCc9PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtb3ZlcnJpZGUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5fKCc6PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtZXh0ZW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnKz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuZGVmaW5lKCdSdWxlJywgYi5hbHQoYi5hcHAoJ1J1bGUtZGVmaW5lJyksIGIuYXBwKCdSdWxlLW92ZXJyaWRlJyksIGIuYXBwKCdSdWxlLWV4dGVuZCcpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnLCBiLnNlcShiLl8oJzw6JyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbnMnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKVxuICBiLmRlZmluZSgnU3VwZXJHcmFtbWFyJywgYi5hbHQoYi5hcHAoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnKSwgYi5hcHAoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcpKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5iaW5kKGIub3B0KGIuYXBwKCdTdXBlckdyYW1tYXInKSksICdzJyksIGIuXygneycpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdSdWxlJyksIDApLCAncnMnKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnR3JhbW1hcnMnLCBiLm1hbnkoYi5hcHAoJ0dyYW1tYXInKSwgMCkpXG4gIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcbn0pXG4iLCJleHBvcnRzLm9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG5leHBvcnRzLnN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi9zdHJpbmdVdGlscy5qcycpXG5leHBvcnRzLmVxdWFscyA9IHJlcXVpcmUoJy4vZXF1YWxzLmpzJylcbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvZ2dpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBzdWJzY3JpYmVkID0ge31cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbihzdWJqZWN0IC8qICwgLi4uICovKSB7XG4gIGlmICghc3Vic2NyaWJlZFtzdWJqZWN0XSlcbiAgICByZXR1cm5cbiAgYXJndW1lbnRzWzBdID0gJ1snICsgc3ViamVjdCArICddJ1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmV4cG9ydHMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzdWJzY3JpYmVkW3N1YmplY3RdID0gdHJ1ZVxufVxuXG5leHBvcnRzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBkZWxldGUgc2hvd2luZ1tzdWJqZWN0XVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXNzZXJ0cywgZXJyb3JzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmVycm9yID0gZnVuY3Rpb24oLyogYXJnMSwgYXJnMiwgLi4uICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3MpXG4gIHRocm93ICdlcnJvcjogJyArIGFyZ3Muam9pbignICcpXG59XG5cbmV4cG9ydHMuc2FuaXR5Q2hlY2sgPSBmdW5jdGlvbihuYW1lLCBjb25kaXRpb24pIHtcbiAgaWYgKCFjb25kaXRpb24pXG4gICAgdGhpc01vZHVsZS5lcnJvcignZmFpbGVkIHNhbml0eSBjaGVjazonLCBuYW1lKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRE9NIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnByZXR0eVByaW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGVuZE5vZGUsIGVuZE9mZnNldCkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSlcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhLnN1YnN0cigwLCBlbmRPZmZzZXQpICsgJ3wnICsgbm9kZS5kYXRhLnN1YnN0cihlbmRPZmZzZXQpICsgJ30nXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEgKyAnfSdcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtub2RlLnRhZ05hbWUsICd7J11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gaWR4KVxuICAgICAgcGFydHMucHVzaCgnfCcpXG4gICAgcGFydHMucHVzaCh0aGlzTW9kdWxlLnByZXR0eVByaW50Tm9kZShub2RlLmNoaWxkTm9kZXMuaXRlbShpZHgpLCBlbmROb2RlLCBlbmRPZmZzZXQpKVxuICB9XG4gIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goJ3wnKVxuICBwYXJ0cy5wdXNoKCd9JylcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cbiIsIi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZG91YmxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT0geVxufVxuXG5mdW5jdGlvbiB0cmlwbGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geVxufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHhcbiAgcmV0dXJuIHR5cGUgIT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh4KSlcbiAgICByZXR1cm4gZXFGbih4LCB5KVxuICBmb3IgKHZhciBwIGluIHgpXG4gICAgaWYgKGRlZXAgJiYgIWVxdWFscyh4W3BdLCB5W3BdLCBkZWVwLCBlcUZuKSB8fFxuICAgICAgICAhZGVlcCAmJiAhZXFGbih4W3BdLCB5W3BdKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBwIGluIHkpXG4gICAgaWYgKHlbcF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB4W3BdID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgZGVlcCwgZXFGbikge1xuICBpZiAoIWFycjEgaW5zdGFuY2VvZiBBcnJheSB8fCAhYXJyMiBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICBhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycjEubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyMVtpZHhdXG4gICAgdmFyIGZvdW5kWCA9IGFycjIuc29tZShmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kWClcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuZGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIgPSBmdW5jdGlvbihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG5leHBvcnRzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGZ1bmN0aW9uKG9iaiwgb3B0UHJvcGVydGllcykge1xuICBmdW5jdGlvbiBjb25zKCkge31cbiAgY29ucy5wcm90b3R5cGUgPSBvYmpcbiAgdmFyIGFucyA9IG5ldyBjb25zKClcbiAgaWYgKG9wdFByb3BlcnRpZXMpXG4gICAgdGhpc01vZHVsZS5rZXlzQW5kVmFsdWVzRG8ob3B0UHJvcGVydGllcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgYW5zW2tdID0gdlxuICAgIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZXhwb3J0cy5mb3JtYWxzID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gZnVuYy5cbiAgICB0b1N0cmluZygpLlxuICAgIG1hdGNoKC9cXCgoLio/KVxcKS8pWzBdLlxuICAgIHJlcGxhY2UoLyAvZywgJycpLlxuICAgIHNsaWNlKDEsIC0xKS5cbiAgICBzcGxpdCgnLCcpLlxuICAgIGZpbHRlcihmdW5jdGlvbihtb2R1bGVOYW1lKSB7IHJldHVybiBtb2R1bGVOYW1lICE9ICcnIH0pXG59XG5cbmV4cG9ydHMua2V5c0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICBmb3IgKHZhciBwIGluIG9iamVjdClcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHApKVxuICAgICAgZm4ocClcbn1cblxuZXhwb3J0cy52YWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihwLCBvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYudmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzQW5kVmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgYW5zID0gW11cbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGFucy5wdXNoKG9iamVjdFtwXSkgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdXG4gIHRoaXMubGVuZ3RoU29GYXIgPSAwXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKVxuICAgIHRoaXMubmV4dFB1dEFsbChhcmd1bWVudHNbaWR4XSlcbn1cblxuU3RyaW5nQnVmZmVyLnByb3RvdHlwZSA9IHtcbiAgbmV4dFB1dEFsbDogZnVuY3Rpb24ocykge1xuICAgIHRoaXMuc3RyaW5ncy5wdXNoKHMpXG4gICAgdGhpcy5sZW5ndGhTb0ZhciArPSBzLmxlbmd0aFxuICB9LFxuXG4gIGNvbnRlbnRzOiBmdW5jdGlvbigpICB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKVxuICB9XG59XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gU3RyaW5nQnVmZmVyXG5cbiIsInZhciBvYmplY3RVdGlscyA9IHJlcXVpcmUoJy4vb2JqZWN0VXRpbHMuanMnKVxudmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gcGFkKG51bWJlckFzU3RyaW5nLCBsZW4pIHtcbiAgdmFyIHplcm9zID0gW11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbnVtYmVyQXNTdHJpbmcubGVuZ3RoIC0gbGVuOyBpZHgrKylcbiAgICB6ZXJvcy5wdXNoKCcwJylcbiAgcmV0dXJuIHplcm9zLmpvaW4oJycpICsgbnVtYmVyQXNTdHJpbmdcbn1cblxudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9XG5mb3IgKHZhciBjID0gMDsgYyA8IDEyODsgYysrKVxuICBlc2NhcGVTdHJpbmdGb3JbY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpXG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gID0gXCJcXFxcJ1wiXG5lc2NhcGVTdHJpbmdGb3JbJ1wiJy5jaGFyQ29kZUF0KDApXSAgPSAnXFxcXFwiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCdcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYidcbmVzY2FwZVN0cmluZ0ZvclsnXFxmJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcZidcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbidcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccidcbmVzY2FwZVN0cmluZ0ZvclsnXFx0Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdCdcbmVzY2FwZVN0cmluZ0ZvclsnXFx2Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdidcblxuLy8gUHVibGljIG1ldGhvZHNcblxuZXhwb3J0cy5lc2NhcGVDaGFyID0gZnVuY3Rpb24oYywgb3B0RGVsaW0pIHtcbiAgdmFyIGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApXG4gIGlmICgoYyA9PSAnXCInIHx8IGMgPT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKVxuICAgIHJldHVybiBjXG4gIGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KVxuICAgIHJldHVybiBlc2NhcGVTdHJpbmdGb3JbY2hhckNvZGVdXG4gIGVsc2UgaWYgKDEyOCA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8IDI1NilcbiAgICByZXR1cm4gJ1xcXFx4JyArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDIpXG4gIGVsc2VcbiAgICByZXR1cm4gJ1xcXFx1JyArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDQpXG59XG5cbmV4cG9ydHMudW5lc2NhcGVDaGFyID0gZnVuY3Rpb24ocykge1xuICBpZiAocy5jaGFyQXQoMCkgPT0gJ1xcXFwnKVxuICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgIGNhc2UgJ2InOiAgcmV0dXJuICdcXGInXG4gICAgICBjYXNlICdmJzogIHJldHVybiAnXFxmJ1xuICAgICAgY2FzZSAnbic6ICByZXR1cm4gJ1xcbidcbiAgICAgIGNhc2UgJ3InOiAgcmV0dXJuICdcXHInXG4gICAgICBjYXNlICd0JzogIHJldHVybiAnXFx0J1xuICAgICAgY2FzZSAndic6ICByZXR1cm4gJ1xcdidcbiAgICAgIGNhc2UgJ3gnOiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNCksIDE2KSlcbiAgICAgIGNhc2UgJ3UnOiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSlcbiAgICAgIGRlZmF1bHQ6ICAgcmV0dXJuIHMuY2hhckF0KDEpXG4gICAgfVxuICBlbHNlXG4gICAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gcHJpbnRPbih4LCB3cykge1xuICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgd3MubmV4dFB1dEFsbCgnWycpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgcHJpbnRPbih4W2lkeF0sIHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCddJylcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgaGFzU2luZ2xlUXVvdGVzID0geC5pbmRleE9mKFwiJ1wiKSA+PSAwXG4gICAgdmFyIGhhc0RvdWJsZVF1b3RlcyA9IHguaW5kZXhPZignXCInKSA+PSAwXG4gICAgdmFyIGRlbGltID0gaGFzU2luZ2xlUXVvdGVzICYmICFoYXNEb3VibGVRdW90ZXMgPyAnXCInIDogXCInXCJcbiAgICB3cy5uZXh0UHV0QWxsKGRlbGltKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHgubGVuZ3RoOyBpZHgrKylcbiAgICAgIHdzLm5leHRQdXRBbGwodGhpc01vZHVsZS5lc2NhcGVDaGFyKHhbaWR4XSwgZGVsaW0pKVxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gIH0gZWxzZSBpZiAoeCA9PT0gbnVsbCkge1xuICAgIHdzLm5leHRQdXRBbGwoJ251bGwnKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiAhKHggaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgd3MubmV4dFB1dEFsbCgneycpXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIG9iamVjdFV0aWxzLmtleXNBbmRWYWx1ZXNEbyh4LCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBpZiAoZmlyc3QpXG4gICAgICAgIGZpcnN0ID0gZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgcHJpbnRPbihrLCB3cylcbiAgICAgIHdzLm5leHRQdXRBbGwoJzogJylcbiAgICAgIHByaW50T24odiwgd3MpXG4gICAgfSlcbiAgICB3cy5uZXh0UHV0QWxsKCd9JylcbiAgfSBlbHNlXG4gICAgd3MubmV4dFB1dEFsbCgnJyArIHgpXG59XG5cbmV4cG9ydHMucHJpbnRTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHdzID0gbmV3IG9iamVjdFV0aWxzLlN0cmluZ0J1ZmZlcigpXG4gIHByaW50T24ob2JqLCB3cylcbiAgcmV0dXJuIHdzLmNvbnRlbnRzKClcbn1cblxuIiwiLypcblxuVE9ETzpcblxuKiBUaGluayBhYm91dCBpbXByb3ZpbmcgdGhlIGltcGxlbWVudGF0aW9uIG9mIHN5bnRhY3RpYyBydWxlcycgYXV0b21hdGljIHNwYWNlIHNraXBwaW5nOlxuICAtLSBDb3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBjdXJyZW50IHJ1bGUgbmFtZSBieSBtb2RpZnlpbmcgdGhlIGNvZGUgKGluIEFwcGx5LmV2YWwpIHdoZXJlIGVudGVyIGFuZCBleGl0IG1ldGhvZHNcbiAgICAgYXJlIGNhbGxlZC4gKFdvdWxkIGFsc28gd2FudCB0byBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgdGhlIHJ1bGUgaXMgc3ludGFjdGljIHRvIGF2b2lkIHJlLWRvaW5nIHRoYXQgd29ya1xuICAgICBhdCBlYWNoIGFwcGxpY2F0aW9uLilcblxuKiBDb25zaWRlciBib3Jyb3dpbmcgKHNvbWV0aGluZyBsaWtlKSB0aGUgdmFyaWFibGUtbm90LW90aGVyd2lzZS1tZW50aW9uZWQgaWRlYSBmcm9tIFJvYmJ5IEZpbmRsZXIncyByZWRleCwgYXMgYSB3YXlcbiAgdG8gbWFrZSBpdCBlYXNpZXIgZm9yIHByb2dyYW1tZXJzIHRvIGRlYWwgd2l0aCBrZXl3b3JkcyBhbmQgaWRlbnRpZmllcnMuXG5cbiogVGhpbmsgYWJvdXQgYSBiZXR0ZXIgd2F5IHRvIGRlYWwgd2l0aCBsaXN0c1xuICAtLSBCdWlsdC1pbiBsaXN0IG9wZXJhdG9yP1xuICAtLSBQYXJhbWV0ZXJpemVkIHJ1bGVzP1xuXG4qIEltcHJvdmUgdGVzdCBjb3ZlcmFnZVxuICAtLSBBZGQgdGVzdHMgZm9yIHNjb3BpbmcsIGUuZy4sIFwiZm9vOmEgW2JhcjpiIGJhejpjXTpkXCIgc2hvdWxkIGhhdmUgNCBiaW5kaW5ncy5cbiAgICAgKFNhbWUga2luZCBvZiB0aGluZyBmb3IgbmVzdGVkIHN0cmluZyBhbmQgbG9va2FoZWFkIGV4cHJlc3Npb25zLCB0aGVpciBiaW5kaW5ncyBzaG91bGQgbGVhayB0byB0aGUgZW5jbG9zaW5nIHNlcS4pXG5cbiogVGhpbmsgYWJvdXQgZm9yZWlnbiBydWxlIGludm9jYXRpb25cbiAgLS0gQ2FuJ3QganVzdCBiZSBkb25lIGluIHRoZSBzYW1lIHdheSBhcyBpbiBPTWV0YSBiL2Mgb2YgdGhlIGFjdGlvbkRpY3RcbiAgLS0gV2lsbCB3YW50IHRvIHByZXNlcnZlIHRoZSBcIm5vIHVubmVjZXNzYXJ5IHNlbWFudGljIGFjdGlvbnNcIiBndWFyYW50ZWVcbiAgLS0gVGhlIHNvbHV0aW9uIG1pZ2h0IGJlIHRvIGVuYWJsZSB0aGUgcHJvZ3JhbW1lciB0byBwcm92aWRlIG11bHRpcGxlIGFjdGlvbkRpY3RzLFxuICAgICBidXQgSSdsbCBoYXZlIHRvIGNvbWUgdXAgd2l0aCBhIGNvbnZlbmllbnQgd2F5IHRvIGFzc29jaWF0ZSBlYWNoIHdpdGggYSBwYXJ0aWN1bGFyIGdyYW1tYXIuXG5cbiogVGhpbmsgYWJvdXQgaW5jcmVtZW50YWwgcGFyc2luZyAoZ29vZCBmb3IgZWRpdG9ycylcbiAgLS0gQmFzaWMgaWRlYToga2VlcCB0cmFjayBvZiBtYXggaW5kZXggc2VlbiB0byBjb21wdXRlIGEgcmVzdWx0XG4gICAgIChzdG9yZSB0aGlzIGluIG1lbW8gcmVjIGFzIGFuIGludCByZWxhdGl2ZSB0byBjdXJyIHBvcylcbiAgLS0gT2sgdG8gcmV1c2UgbWVtb2l6ZWQgdmFsdWUgYXMgbG9uZyBhcyByYW5nZSBmcm9tIGN1cnJlbnQgaW5kZXggdG8gbWF4IGluZGV4IGhhc24ndCBjaGFuZ2VkXG4gIC0tIENvdWxkIGJlIGEgY3V0ZSB3b3Jrc2hvcCBwYXBlci4uLlxuXG5cblN5bnRheCAvIGxhbmd1YWdlIGlkZWFzOlxuXG4qIFN5bnRheCBmb3IgcnVsZSBkZWNsYXJhdGlvbnM6XG5cbiAgICBmb28gPT0gYmFyIGJheiAgICAgKGRlZmluZSlcbiAgICBmb28gOj0gYmFyIGJheiAgICAgKG92ZXJyaWRlIC8gcmVwbGFjZSlcbiAgICBmb28gPD0gYmFyIGJheiAgICAgKGV4dGVuZClcblxuKiBJbmxpbmUgcnVsZXMsIGUuZy4sXG5cbiAgICBhZGRFeHByID0gYWRkRXhwcjp4ICcrJyBtdWxFeHByOnkge3BsdXN9XG4gICAgICAgICAgICB8IGFkZEV4cHI6eCAnLScgbXVsRXhwcjp5IHttaW51c31cbiAgICAgICAgICAgIHwgbXVsRXhwclxuXG4gIGlzIHN5bnRhY3RpYyBzdWdhciBmb3JcblxuICAgIGFkZEV4cHIgPSBwbHVzIHwgbWludXMgfCBtdWxFeHByLFxuICAgIHBsdXMgPSBhZGRFeHByOnggJysnIG11bEV4cHI6eSxcbiAgICBtaW51cyA9IGFkZEV4cHI6eCAnLScgbXVsRXhwcjp5XG5cbiogSW4gdGhpcyBleGFtcGxlOlxuXG4gICAgZm9vID0gXCJiYXJcIlxuICAgIGJhciA9ICdhYmMnXG5cbiAgVGhlIGZvbyBydWxlIHNheXMgaXQgd2FudHMgdGhlIGJhciBydWxlIHRvIG1hdGNoIHRoZSBjb250ZW50cyBvZiBhIHN0cmluZyBvYmplY3QuIChUaGUgXCJzIGlzIGEga2luZCBvZiBwYXJlbnRoZXNpcy4pXG4gIFRoZW4geW91IGNvdWxkIGVpdGhlciBzYXlcblxuICAgIG0ubWF0Y2hBbGwoJ2FiYycsICdiYXInKVxuXG4gIG9yXG5cbiAgICBtLm1hdGNoKCdhYmMnLCAnZm9vJylcblxuICBCb3RoIHNob3VsZCBzdWNjZWVkLlxuXG4qIEFib3V0IG9iamVjdCBtYXRjaGluZ1xuXG4gIFNvbWUgaXNzdWVzOlxuICAtLSBTaG91bGQgZGVmaW5pdGVseSBhbGxvdyBwYXR0ZXJuIG1hdGNoaW5nIG9uIGVhY2ggcHJvcGVydHkncyB2YWx1ZS4gQnV0IHdoYXQgYWJvdXQgcHJvcGVydHkgbmFtZXM/XG4gIC0tIFdoYXQgdG8gZG8gYWJvdXQgdW5zcGVjaWZpZWQgcHJvcGVydGllcz9cbiAgLS0gU3ludGF4OiBKU09OIHVzZXMgY29sb25zIHRvIHNlcGFyYXRlIHByb3BlcnR5IG5hbWVzIGFuZCB2YWx1ZXMuIFdpbGwgbG9vayBiYWQgdy8gYmluZGluZ3MsIGUuZy4sXG4gICAgIHtmb286IG51bWJlcjpufSAoZXd3d3cpXG5cbiAgQ3VycmVudCBzdHJhd21hbjpcbiAgLS0gUmVxdWlyZSBwcm9wZXJ0eSBuYW1lcyB0byBiZSBzdHJpbmcgbGl0ZXJhbHMgKG5vdCBwYXR0ZXJucyksIG9ubHkgYWxsb3cgcGF0dGVybiBtYXRjaGluZyBvbiB0aGVpciB2YWx1ZXMuXG4gIC0tIEFsbG93IGFuIG9wdGlvbmFsICcuLi4nIGFzIHRoZSBsYXN0IHBhdHRlcm4sIHRoYXQgd291bGQgbWF0Y2ggYW55IHVuc3BlY2lmaWVkIHByb3BlcnRpZXMuXG4gICAgICAgeydmb28nOiBudW1iZXIsICdiYXInOiBzdHJpbmcsICdiYXonOiA1LCAuLi59XG4gICAgIE1pZ2h0IGV2ZW4gYWxsb3cgdGhlIC4uLiB0byBiZSBib3VuZCB0byBhIHZhcmlhYmxlIHRoYXQgd291bGQgY29udGFpbiBhbGwgb2YgdGhvc2UgcHJvcGVydGllcy5cbiAgLS0gQ29uc2lkZXIgY2hhbmdpbmcgYmluZGluZyBzeW50YXggZnJvbSBleHByOm5hbWUgdG8gZXhwci5uYW1lXG4gICAgIChNb3JlIEpTT04tZnJpZW5kbHksIGJ1dCBpdCBkb2Vzbid0IHdvcmsgd2VsbCB3aXRoIC4uLiBzeW50YXguIEJ1dCBtYXliZSBpdCdzIG5vdCBzbyBpbXBvcnRhbnQgdG8gYmUgYWJsZSB0byBiaW5kXG4gICAgIHRoZSByZXN0IG9mIHRoZSBwcm9wZXJ0aWVzIGFuZCB2YWx1ZXMgYW55d2F5LCBzaW5jZSB5b3UgY2FuIGFsd2F5cyBiaW5kIHRoZSBlbnRpcmUgb2JqZWN0LilcblxuXG5PcHRpbWl6YXRpb24gaWRlYXM6XG5cbiogT3B0aW1pemUgJ2JpbmRzJyAtLSBzaG91bGQgcHJlLWFsbG9jYXRlIGFuIGFycmF5IG9mIGJpbmRpbmdzIGluc3RlYWQgb2YgZG9pbmcgcHVzaGVzLCB0aHJvd2luZyBhd2F5IGFycmF5cyBvbiBmYWlsXG4gIChzZWUgQWx0KSwgZXRjLlxuXG4qIENvbnNpZGVyIGFkZGluZyBhbiBhZGRpdGlvbmFsIGNvZGUgZ2VuZXJhdGlvbiBzdGVwIHRoYXQgZ2VuZXJhdGVzIGVmZmljaWVudCBjb2RlIGZyb20gdGhlIEFTVHMsIGluc3RlYWQgb2ZcbiAgaW50ZXJwcmV0aW5nIHRoZW0gZGlyZWN0bHkuXG5cbiogRG9uJ3QgYm90aGVyIGNyZWF0aW5nIHRodW5rcyAvIGxpc3RzIG9mIHRodW5rcyB3aGVuIHZhbHVlIGlzIG5vdCBuZWVkZWQgKE9NZXRhIGRpZCB0aGlzKVxuICAtLSBFLmcuLCBpbiBcImZvbyA9IHNwYWNlKiBiYXJcIiB0aGUgcmVzdWx0IG9mIHNwYWNlKiBpcyBub3QgbmVlZGVkLCBzbyBkb24ndCBib3RoZXIgY3JlYXRpbmcgYSBsaXN0IG9mIHRodW5rcyAvIHZhbHVlc1xuICAtLSBDb3VsZCBqdXN0IHJldHVybiB1bmRlZmluZWQgKGFueXRoaW5nIGV4Y2VwdCBmYWlsKVxuXG4qIEdldCByaWQgb2YgdW5uZWNlc3NhcnkgU2VxcyBhbmQgQWx0cyAoT01ldGEgZGlkIHRoaXMgdG9vKVxuXG4qL1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRGVwZW5kZW5jaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5yZXF1aXJlKCcuLi9kaXN0L29obS1ncmFtbWFyLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIG9iamVjdFV0aWxzID0gYXdsaWIub2JqZWN0VXRpbHNcbnZhciBzdHJpbmdVdGlscyA9IGF3bGliLnN0cmluZ1V0aWxzXG52YXIgYnJvd3NlciA9IGF3bGliLmJyb3dzZXJcbnZhciBlcXVhbHMgPSBhd2xpYi5lcXVhbHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnMsIGV0Yy5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG52YXIgZmFpbCA9IHt9XG5cbmZ1bmN0aW9uIGdldER1cGxpY2F0ZXMoYXJyYXkpIHtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdXG4gICAgaWYgKGFycmF5Lmxhc3RJbmRleE9mKHgpICE9PSBpZHggJiYgZHVwbGljYXRlcy5pbmRleE9mKHgpIDwgMClcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KVxuICB9XG4gIHJldHVybiBkdXBsaWNhdGVzXG59XG5cbmZ1bmN0aW9uIGFic3RyYWN0KCkge1xuICB0aHJvdyAndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhJ1xufVxuXG5mdW5jdGlvbiBpc1N5bnRhY3RpYyhydWxlTmFtZSkge1xuICB2YXIgZmlyc3RDaGFyID0gcnVsZU5hbWVbMF1cbiAgcmV0dXJuICdBJyA8PSBmaXJzdENoYXIgJiYgZmlyc3RDaGFyIDw9ICdaJ1xufVxuXG52YXIgX2FwcGx5U3BhY2VzXG5mdW5jdGlvbiBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICAoX2FwcGx5U3BhY2VzIHx8IChfYXBwbHlTcGFjZXMgPSBuZXcgQXBwbHkoJ3NwYWNlcycpKSkuZXZhbChmYWxzZSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCB1bmRlZmluZWQpXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnB1dCBzdHJlYW1zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbSgpIHtcbiAgdGhyb3cgJ0lucHV0U3RyZWFtIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5JbnB1dFN0cmVhbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKVxuICAgIHJldHVybiBuZXcgU3RyaW5nSW5wdXRTdHJlYW0ob2JqKVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSlcbiAgICByZXR1cm4gbmV3IExpc3RJbnB1dFN0cmVhbShvYmopXG4gIGVsc2VcbiAgICB0aHJvdyAnY2Fubm90IG1ha2UgaW5wdXQgc3RyZWFtIGZvciAnICsgb2JqXG59XG5cbklucHV0U3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oc291cmNlKSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgICB0aGlzLnBvcyA9IDBcbiAgICB0aGlzLnBvc0luZm9zID0gW11cbiAgfSxcblxuICBnZXRDdXJyZW50UG9zSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJQb3MgPSB0aGlzLnBvc1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5wb3NJbmZvc1tjdXJyUG9zXVxuICAgIHJldHVybiBwb3NJbmZvIHx8ICh0aGlzLnBvc0luZm9zW2N1cnJQb3NdID0gbmV3IFBvc0luZm8oY3VyclBvcykpXG4gIH0sXG5cbiAgYXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoXG4gIH0sXG5cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXRFbmQoKSA/IGZhaWwgOiB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXVxuICB9LFxuXG4gIG1hdGNoRXhhY3RseTogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLm5leHQoKSA9PT0geCA/IHRydWUgOiBmYWlsXG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeClcbiAgfVxufVxuXG5mdW5jdGlvbiBTdHJpbmdJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSlcbn1cblxuU3RyaW5nSW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKylcbiAgICAgIGlmICh0aGlzLm1hdGNoRXhhY3RseShzW2lkeF0pID09PSBmYWlsKVxuICAgICAgICByZXR1cm4gZmFpbFxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBJTVBPUlRBTlQ6IGUgbXVzdCBiZSBhIG5vbi1nbG9iYWwsIG9uZS1jaGFyYWN0ZXIgZXhwcmVzc2lvbiwgZS5nLiwgLy4vIGFuZCAvWzAtOV0vXG4gICAgdmFyIGMgPSB0aGlzLm5leHQoKVxuICAgIHJldHVybiBjICE9PSBmYWlsICYmIGUudGVzdChjKSA/IHRydWUgOiBmYWlsXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExpc3RJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSlcbn1cblxuTGlzdElucHV0U3RyZWFtLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkocylcbiAgfSxcbiAgICBcbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkoZSlcbiAgfVxufSlcblxuZnVuY3Rpb24gUG9zSW5mbyhwb3MpIHtcbiAgdGhpcy5wb3MgPSBwb3NcbiAgdGhpcy5ydWxlU3RhY2sgPSBbXVxuICB0aGlzLmFjdGl2ZVJ1bGVzID0ge30gIC8vIHJlZHVuZGFudCBkYXRhIChjb3VsZCBiZSBnZW5lcmF0ZWQgZnJvbSBydWxlU3RhY2spLCBleGlzdHMgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnNcbiAgdGhpcy5tZW1vID0ge31cbn1cblxuUG9zSW5mby5wcm90b3R5cGUgPSB7XG4gIGlzQWN0aXZlOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXVxuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnB1c2gocnVsZU5hbWUpXG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSB0cnVlXG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLnJ1bGVTdGFjay5wb3AoKVxuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gZmFsc2VcbiAgfSxcblxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gbWVtb1JlYy5pbnZvbHZlZFJ1bGVzXG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gaW52b2x2ZWRSdWxlcylcbiAgICAgIGlmIChpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSAmJiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID8gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV0gOiB1bmRlZmluZWRcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKCF0aGlzLmxlZnRSZWN1cnNpb25TdGFjaylcbiAgICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID0gW11cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtuYW1lOiBydWxlTmFtZSwgdmFsdWU6IGZhaWwsIHBvczogLTEsIGludm9sdmVkUnVsZXM6IHt9fSlcbiAgICB0aGlzLnVwZGF0ZUludm9sdmVkUnVsZXMoKVxuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucG9wKClcbiAgfSxcblxuICB1cGRhdGVJbnZvbHZlZFJ1bGVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICB2YXIgaW52b2x2ZWRSdWxlcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmludm9sdmVkUnVsZXNcbiAgICB2YXIgbHJSdWxlTmFtZSA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWVcbiAgICB2YXIgaWR4ID0gdGhpcy5ydWxlU3RhY2subGVuZ3RoIC0gMVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVTdGFja1tpZHgtLV1cbiAgICAgIGlmIChydWxlTmFtZSA9PT0gbHJSdWxlTmFtZSlcbiAgICAgICAgYnJlYWtcbiAgICAgIGludm9sdmVkUnVsZXNbcnVsZU5hbWVdID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW50ZXJ2YWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcnZhbChzb3VyY2UsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4XG59XG5cbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBJbnB1dFN0cmVhbS5uZXdGb3IodGhpcy5zb3VyY2UpLmludGVydmFsKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICB9LFxuXG4gIG9ubHlFbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGFydElkeCArIDEgIT09IHRoaXMuZW5kSWR4KVxuICAgICAgYnJvd3Nlci5lcnJvcignaW50ZXJ2YWwnLCB0aGlzLCAnd2FzIGV4cGVjdGVkIHRvIGNvbnRhaW4gb25seSBvbmUgZWxlbWVudCcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMuc3RhcnRJZHhdXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRodW5rc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gVGh1bmsoKSB7fVxuXG52YXIgbmV4dFRodW5rSWQgPSAwXG5UaHVuay5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaWQgPSBuZXh0VGh1bmtJZCsrXG4gIH1cbn1cblxuZnVuY3Rpb24gUnVsZVRodW5rKHJ1bGVOYW1lLCBzb3VyY2UsIHN0YXJ0SWR4LCBlbmRJZHgsIHZhbHVlLCBiaW5kaW5ncykge1xuICB0aGlzLmluaXQoKVxuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWVcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4XG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3Ncbn1cblxuUnVsZVRodW5rLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAoIW1lbW8uaGFzT3duUHJvcGVydHkodGhpcy5pZCkpIHtcbiAgICAgIHZhciBhY3Rpb24gPSB0aGlzLmxvb2t1cEFjdGlvbihhY3Rpb25EaWN0KVxuICAgICAgdmFyIGFkZGxJbmZvID0gdGhpcy5jcmVhdGVBZGRsSW5mbygpXG4gICAgICB2YXIgZW52ID0gdGhpcy5tYWtlRW52KGFjdGlvbkRpY3QsIG1lbW8pXG4gICAgICBtZW1vW3RoaXMuaWRdID0gYWN0aW9uLmNhbGwoYWRkbEluZm8sIGVudilcbiAgICB9XG4gICAgcmV0dXJuIG1lbW9bdGhpcy5pZF1cbiAgfSxcblxuICBsb29rdXBBY3Rpb246IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lXG4gICAgdmFyIGFjdGlvbiA9IGFjdGlvbkRpY3RbcnVsZU5hbWVdXG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkICYmIGFjdGlvbkRpY3QuX2RlZmF1bHQgIT09IHVuZGVmaW5lZClcbiAgICAgIGFjdGlvbiA9IGZ1bmN0aW9uKGVudikge1xuICAgICAgICByZXR1cm4gYWN0aW9uRGljdC5fZGVmYXVsdC5jYWxsKHRoaXMsIHJ1bGVOYW1lLCBlbnYpXG4gICAgICB9XG4gICAgcmV0dXJuIGFjdGlvbiB8fCBicm93c2VyLmVycm9yKCdtaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3InLCBydWxlTmFtZSlcbiAgfSxcblxuICBjcmVhdGVBZGRsSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVydmFsOiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2UsIHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICAgIH1cbiAgfSxcblxuICBtYWtlRW52OiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgdmFyIGJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5sZW5ndGggPT09IDAgPyBbJ3ZhbHVlJywgdGhpcy52YWx1ZV0gOiB0aGlzLmJpbmRpbmdzXG4gICAgdmFyIGVudiA9IHt9XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYmluZGluZ3MubGVuZ3RoOyBpZHggKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBiaW5kaW5nc1tpZHhdXG4gICAgICB2YXIgdGh1bmsgPSBiaW5kaW5nc1tpZHggKyAxXVxuICAgICAgdGhpcy5hZGRCaW5kaW5nKGVudiwgbmFtZSwgdGh1bmssIGFjdGlvbkRpY3QsIG1lbW8pXG4gICAgfVxuICAgIHJldHVybiBlbnZcbiAgfSxcblxuICBhZGRCaW5kaW5nOiBmdW5jdGlvbihlbnYsIG5hbWUsIHZhbHVlLCBhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVudiwgbmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgVGh1bmspXG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKVxuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSlcbiAgfVxufSlcblxuZnVuY3Rpb24gTGlzdFRodW5rKHRodW5rcykge1xuICB0aGlzLmluaXQoKVxuICB0aGlzLnRodW5rcyA9IHRodW5rc1xufVxuXG5MaXN0VGh1bmsucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIGlmICghbWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSlcbiAgICAgIG1lbW9bdGhpcy5pZF0gPSB0aGlzLnRodW5rcy5tYXAoZnVuY3Rpb24odGh1bmspIHsgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIG1lbW8pIH0pXG4gICAgcmV0dXJuIG1lbW9bdGhpcy5pZF1cbiAgfVxufSlcblxuZnVuY3Rpb24gVmFsdWVUaHVuayh2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWVcbn1cblxuVmFsdWVUaHVuay5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oVGh1bmsucHJvdG90eXBlLCB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVcbiAgfVxufSlcblxudmFyIHZhbHVlbGVzc1RodW5rID0gbmV3IFZhbHVlVGh1bmsodW5kZWZpbmVkKVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVHlwZXMgb2YgcGF0dGVybnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdlbmVyYWwgc3R1ZmZcblxuZnVuY3Rpb24gUGF0dGVybigpIHtcbiAgdGhyb3cgJ1BhdHRlcm4gY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnXG59XG5cblBhdHRlcm4ucHJvdG90eXBlID0ge1xuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbXVxuICB9LFxuXG4gIHByb2R1Y2VzVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogYWJzdHJhY3QsXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBhYnN0cmFjdCxcblxuICBvdXRwdXRSZWNpcGU6IGFic3RyYWN0XG59XG5cbi8vIEFueXRoaW5nXG5cbnZhciBhbnl0aGluZyA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKHZhbHVlID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFZhbHVlVGh1bmsodmFsdWUpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICAvLyBuby1vcFxuICB9XG59KVxuXG4vLyBQcmltaXRpdmVzXG5cbmZ1bmN0aW9uIFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqXG59XG5cblByaW0ubmV3Rm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJyAmJiBvYmoubGVuZ3RoICE9PSAxKVxuICAgIHJldHVybiBuZXcgU3RyaW5nUHJpbShvYmopXG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFJlZ0V4cClcbiAgICByZXR1cm4gbmV3IFJlZ0V4cFByaW0ob2JqKVxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyBQcmltKG9iailcbn1cbiAgICBcblByaW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICBpZiAodGhpcy5tYXRjaChpbnB1dFN0cmVhbSkgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgVmFsdWVUaHVuayh0aGlzLm9iailcbiAgfSxcblxuICBtYXRjaDogZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hFeGFjdGx5KHRoaXMub2JqKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5fKCcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLm9iaikpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFN0cmluZ1ByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqXG59XG5cblN0cmluZ1ByaW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFByaW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICAgIHJldHVybiBpbnB1dFN0cmVhbS5tYXRjaFN0cmluZyh0aGlzLm9iailcbiAgfVxufSlcblxuZnVuY3Rpb24gUmVnRXhwUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuUmVnRXhwUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgaWYgKGlucHV0U3RyZWFtLm1hdGNoUmVnRXhwKHRoaXMub2JqKSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBWYWx1ZVRodW5rKGlucHV0U3RyZWFtLnNvdXJjZVtvcmlnUG9zXSlcbiAgfVxufSlcblxuLy8gQWx0ZXJuYXRpb25cblxuZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gIHRoaXMudGVybXMgPSB0ZXJtc1xufVxuXG5BbHQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIG9yaWdOdW1CaW5kaW5ncyA9IGJpbmRpbmdzLmxlbmd0aFxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKHN5bnRhY3RpYylcbiAgICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLnRlcm1zW2lkeF0uZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICBpZiAodmFsdWUgIT09IGZhaWwpXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgICAgLy8gTm90ZTogd2hpbGUgdGhlIGZvbGxvd2luZyBhc3NpZ25tZW50IGNvdWxkIGJlIGRvbmUgdW5jb25kaXRpb25hbGx5LCBvbmx5IGRvaW5nIGl0IHdoZW4gbmVjZXNzYXJ5IGlzXG4gICAgICAgIC8vIGJldHRlciBmb3IgcGVyZm9ybWFuY2UuIFRoaXMgaXMgYi9jIGFzc2lnbmluZyB0byBhbiBhcnJheSdzIGxlbmd0aCBwcm9wZXJ0eSBpcyBtb3JlIGV4cGVuc2l2ZSB0aGFuIGFcbiAgICAgICAgLy8gdHlwaWNhbCBhc3NpZ25tZW50LlxuICAgICAgICBpZiAoYmluZGluZ3MubGVuZ3RoID4gb3JpZ051bUJpbmRpbmdzKVxuICAgICAgICAgIGJpbmRpbmdzLmxlbmd0aCA9IG9yaWdOdW1CaW5kaW5nc1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBiaW5kaW5ncyAtLSB0aGlzIHByb3BlcnR5IGlzIGNoZWNrZWQgYnkgdGhlIEdyYW1tYXIgY29uc3RydWN0b3IuXG4gICAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwID8gW10gOiB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgaWYgKCF0aGlzLnRlcm1zW2lkeF0ucHJvZHVjZXNWYWx1ZSgpKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuXG4gICAgdmFyIG5hbWVzID0gdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2lkeF1cbiAgICAgIHRlcm0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MoKVxuICAgICAgdmFyIG90aGVyTmFtZXMgPSB0ZXJtLmdldEJpbmRpbmdOYW1lcygpXG4gICAgICBpZiAoIWVxdWFscy5lcXVhbHMobmFtZXMsIG90aGVyTmFtZXMpKVxuICAgICAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgYW4gYWx0IHdpdGggaW5jb25zaXN0ZW50IGJpbmRpbmdzOicsIG5hbWVzLCAndnMnLCBvdGhlck5hbWVzKVxuICAgIH1cbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5hbHQoJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICB0aGlzLnRlcm1zW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnNcbn1cblxuU2VxLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKHN5bnRhY3RpYylcbiAgICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF1cbiAgICAgIHZhciB2YWx1ZSA9IGZhY3Rvci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFpbClcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlbGVzc1RodW5rXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmFtZXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5mYWN0b3JzW2lkeF0uZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKVxuICB9LFxuXG4gIHByb2R1Y2VzVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuXG4gICAgdmFyIGR1cGxpY2F0ZXMgPSBnZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3J1bGUnLCBydWxlTmFtZSwgJ2hhcyBkdXBsaWNhdGUgYmluZGluZ3M6JywgZHVwbGljYXRlcylcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLnNlcSgnKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgdGhpcy5mYWN0b3JzW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gQmluZGluZ3NcblxuZnVuY3Rpb24gQmluZChleHByLCBuYW1lKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbiAgdGhpcy5uYW1lID0gbmFtZVxufVxuXG5CaW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgaWYgKHZhbHVlICE9PSBmYWlsKVxuICAgICAgYmluZGluZ3MucHVzaCh0aGlzLm5hbWUsIHZhbHVlKVxuICAgIHJldHVybiB2YWx1ZVxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLm5hbWVdXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmJpbmQoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykge1xuICB0aGlzLmV4cHIgPSBleHByXG4gIHRoaXMubWluTnVtTWF0Y2hlcyA9IG1pbk51bU1hdGNoZXNcbn1cblxuTWFueS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG1hdGNoZXMgPSBbXVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgYmFja3RyYWNrUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgICBpZiAodmFsdWUgPT09IGZhaWwpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gYmFja3RyYWNrUG9zXG4gICAgICAgIGJyZWFrXG4gICAgICB9IGVsc2VcbiAgICAgICAgbWF0Y2hlcy5wdXNoKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hlcy5sZW5ndGggPCB0aGlzLm1pbk51bU1hdGNoZXMgPyAgZmFpbCA6IG5ldyBMaXN0VGh1bmsobWF0Y2hlcylcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IubWFueSgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHdzLm5leHRQdXRBbGwodGhpcy5taW5OdW1NYXRjaGVzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbk9wdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgaWYgKHZhbHVlID09PSBmYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICByZXR1cm4gdmFsdWVsZXNzVGh1bmtcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBuZXcgTGlzdFRodW5rKFt2YWx1ZV0pXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLm9wdCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFByZWRpY2F0ZXNcblxuZnVuY3Rpb24gTm90KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5Ob3QucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICByZXR1cm4gdmFsdWVsZXNzVGh1bmtcbiAgICB9XG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLm5vdCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTG9va2FoZWFkLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICBpZiAodmFsdWUgIT09IGZhaWwpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IubGEoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBTdHJpbmcgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBTdHIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cblN0ci5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBzdHJpbmcgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBzdHJpbmdJbnB1dFN0cmVhbSA9IG5ldyBTdHJpbmdJbnB1dFN0cmVhbShzdHJpbmcpXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBzdHJpbmdJbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICByZXR1cm4gdmFsdWUgIT09IGZhaWwgJiYgc3RyaW5nSW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgVmFsdWVUaHVuayhzdHJpbmcpIDogZmFpbFxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iuc3RyKCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gTGlzdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIExpc3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbkxpc3QucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgbGlzdCA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmIChsaXN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHZhciBsaXN0SW5wdXRTdHJlYW0gPSBuZXcgTGlzdElucHV0U3RyZWFtKGxpc3QpXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBsaXN0SW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgcmV0dXJuIHZhbHVlICE9PSBmYWlsICYmIGxpc3RJbnB1dFN0cmVhbS5hdEVuZCgpID8gIG5ldyBWYWx1ZVRodW5rKGxpc3QpIDogZmFpbFxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IubHN0KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gT2JqZWN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gT2JqKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICB2YXIgbmFtZXMgPSBwcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkgeyByZXR1cm4gcHJvcGVydHkubmFtZSB9KVxuICB2YXIgZHVwbGljYXRlcyA9IGdldER1cGxpY2F0ZXMobmFtZXMpXG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgYnJvd3Nlci5lcnJvcignb2JqZWN0IHBhdHRlcm4gaGFzIGR1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lczonLCBkdXBsaWNhdGVzKVxuICBlbHNlIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgdGhpcy5pc0xlbmllbnQgPSBpc0xlbmllbnRcbiAgfVxufVxuXG5PYmoucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKG9iaiAhPT0gZmFpbCAmJiBvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICB2YXIgbnVtT3duUHJvcGVydGllc01hdGNoZWQgPSAwXG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXNbaWR4XVxuICAgICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV1cbiAgICAgICAgdmFyIHZhbHVlSW5wdXRTdHJlYW0gPSBuZXcgTGlzdElucHV0U3RyZWFtKFt2YWx1ZV0pXG4gICAgICAgIHZhciBtYXRjaGVkID1cbiAgICAgICAgICBwcm9wZXJ0eS5wYXR0ZXJuLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgdmFsdWVJbnB1dFN0cmVhbSwgYmluZGluZ3MpICE9PSBmYWlsICYmIHZhbHVlSW5wdXRTdHJlYW0uYXRFbmQoKVxuICAgICAgICBpZiAoIW1hdGNoZWQpXG4gICAgICAgICAgcmV0dXJuIGZhaWxcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKSlcbiAgICAgICAgICBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCsrXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pc0xlbmllbnQgfHwgbnVtT3duUHJvcGVydGllc01hdGNoZWQgPT09IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID9cbiAgICAgICAgbmV3IFZhbHVlVGh1bmsob2JqKSA6XG4gICAgICAgIGZhaWxcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmFtZXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICByZXR1cm4gbmFtZXMuc29ydCgpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcblxuICAgIHZhciBkdXBsaWNhdGVzID0gZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgYW4gb2JqZWN0IHBhdHRlcm4gd2l0aCBkdXBsaWNhdGUgYmluZGluZ3M6JywgZHVwbGljYXRlcylcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIGZ1bmN0aW9uIG91dHB1dFByb3BlcnR5UmVjaXBlKHByb3ApIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJ3tuYW1lOiAnKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyhwcm9wLm5hbWUpKVxuICAgICAgd3MubmV4dFB1dEFsbCgnLCBwYXR0ZXJuOiAnKVxuICAgICAgcHJvcC5wYXR0ZXJuLm91dHB1dFJlY2lwZSh3cylcbiAgICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICAgIH1cblxuICAgIHdzLm5leHRQdXRBbGwoJ2Iub2JqKFsnKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgb3V0cHV0UHJvcGVydHlSZWNpcGUodGhpcy5wcm9wZXJ0aWVzW2lkeF0pXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10sICcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyghIXRoaXMuaXNMZW5pZW50KSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gUnVsZSBhcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBBcHBseShydWxlTmFtZSkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWVcbn1cblxuQXBwbHkucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWVcbiAgICB2YXIgb3JpZ1Bvc0luZm8gPSBpbnB1dFN0cmVhbS5nZXRDdXJyZW50UG9zSW5mbygpXG4gICAgdmFyIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXVxuICAgIGlmIChtZW1vUmVjICYmIG9yaWdQb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBtZW1vUmVjLnBvc1xuICAgICAgcmV0dXJuIG1lbW9SZWMudmFsdWVcbiAgICB9IGVsc2UgaWYgKG9yaWdQb3NJbmZvLmlzQWN0aXZlKHJ1bGVOYW1lKSkge1xuICAgICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKVxuICAgICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uICYmIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgIG9yaWdQb3NJbmZvLnVwZGF0ZUludm9sdmVkUnVsZXMoKVxuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3NcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcmlnUG9zSW5mby5zdGFydExlZnRSZWN1cnNpb24ocnVsZU5hbWUpXG4gICAgICAgIHJldHVybiBmYWlsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBib2R5ID0gcnVsZURpY3RbcnVsZU5hbWVdIHx8IGJyb3dzZXIuZXJyb3IoJ3VuZGVmaW5lZCBydWxlJywgcnVsZU5hbWUpXG4gICAgICBvcmlnUG9zSW5mby5lbnRlcihydWxlTmFtZSlcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKVxuICAgICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbi5uYW1lID09PSBydWxlTmFtZSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5oYW5kbGVMZWZ0UmVjdXJzaW9uKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgb3JpZ1Bvc0luZm8ucG9zLCBjdXJyZW50TGVmdFJlY3Vyc2lvbiwgdmFsdWUpXG4gICAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPVxuICAgICAgICAgICAge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWUsIGludm9sdmVkUnVsZXM6IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmludm9sdmVkUnVsZXN9XG4gICAgICAgICAgb3JpZ1Bvc0luZm8uZW5kTGVmdFJlY3Vyc2lvbihydWxlTmFtZSlcbiAgICAgICAgfSBlbHNlIGlmICghY3VycmVudExlZnRSZWN1cnNpb24uaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0pXG4gICAgICAgICAgLy8gT25seSBtZW1vaXplIGlmIHRoaXMgcnVsZSBpcyBub3QgaW52b2x2ZWQgaW4gdGhlIGN1cnJlbnQgbGVmdCByZWN1cnNpb25cbiAgICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfVxuICAgICAgfSBlbHNlXG4gICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID0ge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWV9XG4gICAgICBvcmlnUG9zSW5mby5leGl0KHJ1bGVOYW1lKVxuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxuICB9LFxuXG4gIGV2YWxPbmNlOiBmdW5jdGlvbihleHByLCBydWxlRGljdCwgaW5wdXRTdHJlYW0pIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciBiaW5kaW5ncyA9IFtdXG4gICAgdmFyIHZhbHVlID0gZXhwci5ldmFsKGlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgIGlmICh2YWx1ZSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBSdWxlVGh1bmsodGhpcy5ydWxlTmFtZSwgaW5wdXRTdHJlYW0uc291cmNlLCBvcmlnUG9zLCBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlLCBiaW5kaW5ncylcbiAgfSxcblxuICBoYW5kbGVMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3MsIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLCBzZWVkVmFsdWUpIHtcbiAgICB2YXIgdmFsdWUgPSBzZWVkVmFsdWVcbiAgICBpZiAoc2VlZFZhbHVlICE9PSBmYWlsKSB7XG4gICAgICBjdXJyZW50TGVmdFJlY3Vyc2lvbi52YWx1ZSA9IHNlZWRWYWx1ZVxuICAgICAgY3VycmVudExlZnRSZWN1cnNpb24ucG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICAgIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gZmFpbCAmJiBpbnB1dFN0cmVhbS5wb3MgPiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3MpIHtcbiAgICAgICAgICBjdXJyZW50TGVmdFJlY3Vyc2lvbi52YWx1ZSA9IHZhbHVlXG4gICAgICAgICAgY3VycmVudExlZnRSZWN1cnNpb24ucG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi52YWx1ZVxuICAgICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvc1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmFwcCgnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5ydWxlTmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFJ1bGUgZXhwYW5zaW9uIC0tIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbCBvZiBydWxlIGV4dGVuc2lvblxuXG5mdW5jdGlvbiBfRXhwYW5kKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGlmIChncmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgIGJyb3dzZXIuZXJyb3IoJ2dyYW1tYXInLCBncmFtbWFyLm5hbWUsICdkb2VzIG5vdCBoYXZlIGEgcnVsZSBjYWxsZWQnLCBydWxlTmFtZSlcbiAgZWxzZSB7XG4gICAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hclxuICB9XG59XG5cbl9FeHBhbmQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICB9LFxuXG4gIGV4cGFuc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hci5ydWxlRGljdFt0aGlzLnJ1bGVOYW1lXVxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uKCkuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5wcm9kdWNlc1ZhbHVlKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwYW5zaW9uKCkuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cGFuc2lvbigpLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICAvLyBuby1vcFxuICB9XG59KVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR3JhbW1hclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gR3JhbW1hcihydWxlRGljdCkge1xuICB0aGlzLnJ1bGVEaWN0ID0gcnVsZURpY3Rcbn1cblxuR3JhbW1hci5wcm90b3R5cGUgPSB7XG4gIHJ1bGVEaWN0OiBuZXcgZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fID0gYW55dGhpbmdcbiAgICB0aGlzLmVuZCA9IG5ldyBOb3QodGhpcy5fKVxuICAgIHRoaXMuc3BhY2UgPSBQcmltLm5ld0ZvcigvW1xcc10vKVxuICAgIHRoaXMuc3BhY2VzID0gbmV3IE1hbnkobmV3IEFwcGx5KCdzcGFjZScpLCAwKVxuICAgIHRoaXMuYWxudW0gPSBQcmltLm5ld0ZvcigvWzAtOWEtekEtWl0vKVxuICAgIHRoaXMubGV0dGVyID0gUHJpbS5uZXdGb3IoL1thLXpBLVpdLylcbiAgICB0aGlzLmxvd2VyID0gUHJpbS5uZXdGb3IoL1thLXpdLylcbiAgICB0aGlzLnVwcGVyID0gUHJpbS5uZXdGb3IoL1tBLVpdLylcbiAgICB0aGlzLmRpZ2l0ID0gUHJpbS5uZXdGb3IoL1swLTldLylcbiAgICB0aGlzLmhleERpZ2l0ID0gUHJpbS5uZXdGb3IoL1swLTlhLWZBLUZdLylcbiAgfSxcblxuICBtYXRjaDogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaENvbnRlbnRzKFtvYmpdLCBzdGFydFJ1bGUpXG4gIH0sXG5cbiAgbWF0Y2hDb250ZW50czogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKVxuICAgIHZhciB0aHVuayA9IG5ldyBBcHBseShzdGFydFJ1bGUpLmV2YWwodW5kZWZpbmVkLCB0aGlzLnJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgdW5kZWZpbmVkKVxuICAgIGlmIChpc1N5bnRhY3RpYyhzdGFydFJ1bGUpKVxuICAgICAgc2tpcFNwYWNlcyh0aGlzLnJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoID0gdGhpcy5hc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2guYmluZCh0aGlzKVxuICAgIHJldHVybiB0aHVuayA9PT0gZmFpbCB8fCAhaW5wdXRTdHJlYW0uYXRFbmQoKSA/XG4gICAgICBmYWxzZSA6XG4gICAgICBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgICAgIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaChhY3Rpb25EaWN0KVxuICAgICAgICByZXR1cm4gdGh1bmsuZm9yY2UoYWN0aW9uRGljdCwge30pXG4gICAgICB9XG4gIH0sXG5cbiAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgdmFyIHJ1bGVEaWN0ID0gdGhpcy5ydWxlRGljdFxuICAgIHZhciBvayA9IHRydWVcbiAgICBvYmplY3RVdGlscy5rZXlzRG8ocnVsZURpY3QsIGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgICBpZiAoYWN0aW9uRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuXG4gICAgICB2YXIgYWN0dWFsID0gb2JqZWN0VXRpbHMuZm9ybWFscyhhY3Rpb25EaWN0W3J1bGVOYW1lXSkuc29ydCgpXG4gICAgICB2YXIgZXhwZWN0ZWQgPSBzZWxmLnNlbWFudGljQWN0aW9uQXJnTmFtZXMocnVsZU5hbWUpXG4gICAgICBpZiAoIWVxdWFscy5lcXVhbHMoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICAgICAgb2sgPSBmYWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnc2VtYW50aWMgYWN0aW9uIGZvciBydWxlJywgcnVsZU5hbWUsICdoYXMgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzJylcbiAgICAgICAgY29uc29sZS5sb2coJyAgZXhwZWN0ZWQnLCBleHBlY3RlZClcbiAgICAgICAgY29uc29sZS5sb2coJyAgICBhY3R1YWwnLCBhY3R1YWwpXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoIW9rKVxuICAgICAgYnJvd3Nlci5lcnJvcignb25lIG9yIG1vcmUgc2VtYW50aWMgYWN0aW9ucyBoYXZlIHRoZSB3cm9uZyBhcmd1bWVudCBuYW1lcyAtLSBzZWUgY29uc29sZSBmb3IgZGV0YWlscycpXG4gIH0sXG5cbiAgc2VtYW50aWNBY3Rpb25BcmdOYW1lczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIgJiYgdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdKVxuICAgICAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyLnNlbWFudGljQWN0aW9uQXJnTmFtZXMocnVsZU5hbWUpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdXG4gICAgICB2YXIgbmFtZXMgPSBib2R5LmdldEJpbmRpbmdOYW1lcygpXG4gICAgICByZXR1cm4gbmFtZXMubGVuZ3RoID4gMCB8fCBib2R5LnByb2R1Y2VzVmFsdWUoKSA/IFsnZW52J10gOiBbXVxuICAgIH1cbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdzID0gbmV3IG9iamVjdFV0aWxzLlN0cmluZ0J1ZmZlcigpXG4gICAgd3MubmV4dFB1dEFsbCgnKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLmJ1aWxkZXIoKVxcbicpXG4gICAgd3MubmV4dFB1dEFsbCgnICBiLnNldE5hbWUoJyk7IHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7IHdzLm5leHRQdXRBbGwoJylcXG4nKVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5uYW1lICYmIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWVzcGFjZU5hbWUpIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgYi5zZXRTdXBlckdyYW1tYXIob2htLm5hbWVzcGFjZSgnKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykuZ2V0R3JhbW1hcignKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykpXFxuJylcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5ydWxlRGVjbHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICAnKVxuICAgICAgdGhpcy5ydWxlRGVjbHNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCdcXG4nKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcgIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJ30pJylcbiAgICByZXR1cm4gd3MuY29udGVudHMoKVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBCdWlsZGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSdWxlRGVjbCgpIHtcbiAgdGhyb3cgJ1J1bGVEZWNsIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5SdWxlRGVjbC5wcm90b3R5cGUgPSB7XG4gIHBlcmZvcm1DaGVja3M6IGFic3RyYWN0LFxuXG4gIHBlcmZvcm1Db21tb25DaGVja3M6IGZ1bmN0aW9uKG5hbWUsIGJvZHkpIHtcbiAgICBib2R5LmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MobmFtZSlcbiAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKG5hbWUpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5XG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuJylcbiAgICB3cy5uZXh0UHV0QWxsKHRoaXMua2luZClcbiAgICB3cy5uZXh0UHV0QWxsKCcoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHRoaXMuYm9keS5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn1cblxuZnVuY3Rpb24gRGVmaW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuRGVmaW5lLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2RlZmluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZGVmaW5lIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IG92ZXJyaWRlIG9yIGV4dGVuZCBpbnN0ZWFkLiknKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gT3ZlcnJpZGUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5PdmVycmlkZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdvdmVycmlkZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG92ZXJyaWRkZW4gPSB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdXG4gICAgaWYgKCFvdmVycmlkZGVuKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IG92ZXJyaWRlIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgIGlmIChvdmVycmlkZGVuLmdldEJpbmRpbmdOYW1lcygpLmxlbmd0aCA9PT0gMCAmJiBvdmVycmlkZGVuLnByb2R1Y2VzVmFsdWUoKSAmJiAhdGhpcy5ib2R5LnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3RoZSBib2R5IG9mIHJ1bGUnLCB0aGlzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdtdXN0IHByb2R1Y2UgYSB2YWx1ZSwgYmVjYXVzZSB0aGUgcnVsZSBpdFxcJ3Mgb3ZlcnJpZGluZyBhbHNvIHByb2R1Y2VzIGEgdmFsdWUnKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gSW5saW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuSW5saW5lLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2lubGluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgcmVsYXhpbmcgdGhpcyBjaGVjaywgZS5nLiwgbWFrZSBpdCBvayB0byBvdmVycmlkZSBhbiBpbmxpbmUgcnVsZSBpZiB0aGUgbmVzdGluZyBydWxlIGlzXG4gICAgLy8gYW4gb3ZlcnJpZGUuIEJ1dCBvbmx5IGlmIHRoZSBpbmxpbmUgcnVsZSB0aGF0J3MgYmVpbmcgb3ZlcnJpZGRlbiBpcyBuZXN0ZWQgaW5zaWRlIHRoZSBuZXN0aW5nIHJ1bGUgdGhhdFxuICAgIC8vIHdlJ3JlIG92ZXJyaWRpbmc/IEhvcGVmdWxseSB0aGVyZSdzIGEgbXVjaCBsZXNzIGNvbXBsaWNhdGVkIHdheSB0byBkbyB0aGlzIDopXG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZGVmaW5lIGlubGluZSBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc3VwZXItZ3JhbW1hci4nKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gRXh0ZW5kKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5leHBhbmRlZEJvZHkgPSBuZXcgQWx0KFtib2R5LCBuZXcgX0V4cGFuZChuYW1lLCBzdXBlckdyYW1tYXIpXSlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuRXh0ZW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2V4dGVuZCcsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGV4dGVuZGVkID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXVxuICAgIGlmICghZXh0ZW5kZWQpXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZXh0ZW5kIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgIGlmIChleHRlbmRlZC5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgZXh0ZW5kZWQucHJvZHVjZXNWYWx1ZSgpICYmICF0aGlzLmJvZHkucHJvZHVjZXNWYWx1ZSgpKVxuICAgICAgYnJvd3Nlci5lcnJvcigndGhlIGJvZHkgb2YgcnVsZScsIHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ211c3QgcHJvZHVjZSBhIHZhbHVlLCBiZWNhdXNlIHRoZSBydWxlIGl0XFwncyBleHRlbmRpbmcgYWxzbyBwcm9kdWNlcyBhIHZhbHVlJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmV4cGFuZGVkQm9keSlcbiAgfSxcblxuICBpbnN0YWxsOiBmdW5jdGlvbihydWxlRGljdCkge1xuICAgIHJ1bGVEaWN0W3RoaXMubmFtZV0gPSB0aGlzLmV4cGFuZGVkQm9keVxuICB9XG59KVxuXG5mdW5jdGlvbiBCdWlsZGVyKCkge1xuICB0aGlzLmluaXQoKVxufVxuXG5CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5uYW1lID0gdW5kZWZpbmVkXG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBHcmFtbWFyLnByb3RvdHlwZVxuICAgIHRoaXMucnVsZURlY2xzID0gW11cbiAgfSxcblxuICBzZXROYW1lOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICB9LFxuXG4gIHNldFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gZ3JhbW1hclxuICB9LFxuXG4gIGRlZmluZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBEZWZpbmUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBvdmVycmlkZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBPdmVycmlkZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICB9LFxuXG4gIGlubGluZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBJbmxpbmUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgICByZXR1cm4gdGhpcy5hcHAocnVsZU5hbWUpXG4gIH0sXG5cbiAgZXh0ZW5kOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IEV4dGVuZChydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICB9LFxuXG4gIGJ1aWxkOiBmdW5jdGlvbihvcHROYW1lc3BhY2UpIHtcbiAgICB2YXIgc3VwZXJHcmFtbWFyID0gdGhpcy5zdXBlckdyYW1tYXJcbiAgICB2YXIgcnVsZURpY3QgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oc3VwZXJHcmFtbWFyLnJ1bGVEaWN0KVxuICAgIHRoaXMucnVsZURlY2xzLmZvckVhY2goZnVuY3Rpb24ocnVsZURlY2wpIHtcbiAgICAgIHJ1bGVEZWNsLnBlcmZvcm1DaGVja3MoKVxuICAgICAgcnVsZURlY2wuaW5zdGFsbChydWxlRGljdClcbiAgICB9KVxuXG4gICAgdmFyIGdyYW1tYXIgPSBuZXcgR3JhbW1hcihydWxlRGljdClcbiAgICBncmFtbWFyLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxuICAgIGdyYW1tYXIucnVsZURlY2xzID0gdGhpcy5ydWxlRGVjbHNcbiAgICBpZiAodGhpcy5uYW1lKSB7XG4gICAgICBncmFtbWFyLm5hbWUgPSB0aGlzLm5hbWVcbiAgICAgIGlmIChvcHROYW1lc3BhY2UpIHtcbiAgICAgICAgZ3JhbW1hci5uYW1lc3BhY2VOYW1lID0gb3B0TmFtZXNwYWNlLm5hbWVcbiAgICAgICAgb3B0TmFtZXNwYWNlLmluc3RhbGwodGhpcy5uYW1lLCBncmFtbWFyKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmluaXQoKVxuICAgIHJldHVybiBncmFtbWFyXG4gIH0sXG5cbiAgXzogZnVuY3Rpb24oeCkgeyByZXR1cm4gUHJpbS5uZXdGb3IoeCkgfSxcbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEFsdClcbiAgICAgICAgdGVybXMgPSB0ZXJtcy5jb25jYXQoYXJnLnRlcm1zKVxuICAgICAgZWxzZVxuICAgICAgICB0ZXJtcy5wdXNoKGFyZylcbiAgICB9XG4gICAgcmV0dXJuIHRlcm1zLmxlbmd0aCA9PT0gMSA/IHRlcm1zWzBdIDogbmV3IEFsdCh0ZXJtcylcbiAgfSxcbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFNlcSlcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKVxuICAgICAgZWxzZVxuICAgICAgICBmYWN0b3JzLnB1c2goYXJnKVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IFNlcShmYWN0b3JzKVxuICB9LFxuICBiaW5kOiBmdW5jdGlvbihleHByLCBuYW1lKSB7IHJldHVybiBuZXcgQmluZChleHByLCBuYW1lKSB9LFxuICBtYW55OiBmdW5jdGlvbihleHByLCBtaW5OdW1NYXRjaGVzKSB7IHJldHVybiBuZXcgTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB9LFxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBPcHQoZXhwcikgfSxcbiAgbm90OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTm90KGV4cHIpIH0sXG4gIGxhOiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTG9va2FoZWFkKGV4cHIpIH0sXG4gIHN0cjogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IFN0cihleHByKSB9LFxuICBsc3Q6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBMaXN0KGV4cHIpIH0sXG4gIG9iajogZnVuY3Rpb24ocHJvcGVydGllcywgaXNMZW5pZW50KSB7IHJldHVybiBuZXcgT2JqKHByb3BlcnRpZXMsICEhaXNMZW5pZW50KSB9LFxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7IHJldHVybiBuZXcgQXBwbHkocnVsZU5hbWUpIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5hbWVzcGFjZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBuYW1lc3BhY2VzID0ge31cblxuZnVuY3Rpb24gTmFtZXNwYWNlKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmdyYW1tYXJzID0ge31cbn1cblxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IHtcbiAgaW5zdGFsbDogZnVuY3Rpb24obmFtZSwgZ3JhbW1hcikge1xuICAgIGlmICh0aGlzLmdyYW1tYXJzW25hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignZHVwbGljYXRlIGRlY2xhcmF0aW9uIG9mIGdyYW1tYXInLCBuYW1lLCAnaW4gbmFtZXNwYWNlJywgdGhpcy5uYW1lKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuZ3JhbW1hcnNbbmFtZV0gPSBncmFtbWFyXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcblxuICBnZXRHcmFtbWFyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hcnNbbmFtZV0gfHwgYnJvd3Nlci5lcnJvcignb2htIG5hbWVzcGFjZScsIHRoaXMubmFtZSwgJ2hhcyBubyBncmFtbWFyIGNhbGxlZCcsIG5hbWUpXG4gIH0sXG5cbiAgbG9hZEdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBicm93c2VyLnNhbml0eUNoZWNrKCdzY3JpcHQgdGFnXFwncyB0eXBlIGF0dHJpYnV0ZSBtdXN0IGJlIFwidGV4dC9vaG0tanNcIicsIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQvb2htLWpzJylcbiAgICBtYWtlR3JhbW1hcnMoZWxlbWVudC5pbm5lckhUTUwsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRmFjdG9yaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSB7XG4gIHZhciBidWlsZGVyXG4gIHJldHVybiB7XG4gICAgc3BhY2U6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge30sXG4gICAgJ3NwYWNlLW11bHRpTGluZSc6ICAgICAgICAgIGZ1bmN0aW9uKCkge30sXG4gICAgJ3NwYWNlLXNpbmdsZUxpbmUnOiAgICAgICAgIGZ1bmN0aW9uKCkge30sXG5cbiAgICBfbmFtZTogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICBuYW1lRmlyc3Q6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcbiAgICBuYW1lUmVzdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcblxuICAgIG5hbWU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi5uIH0sXG5cbiAgICBuYW1lZENvbnN0OiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnbmFtZWRDb25zdC11bmRlZmluZWQnOiAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQgfSxcbiAgICAnbmFtZWRDb25zdC1udWxsJzogICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBudWxsIH0sXG4gICAgJ25hbWVkQ29uc3QtdHJ1ZSc6ICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9LFxuICAgICduYW1lZENvbnN0LWZhbHNlJzogICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlIH0sXG5cbiAgICBzdHJpbmc6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudi5jcy5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gc3RyaW5nVXRpbHMudW5lc2NhcGVDaGFyKGMpIH0pLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgc0NoYXI6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cygpIH0sXG4gICAgcmVnZXhwOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gbmV3IFJlZ0V4cChlbnYuZSkgfSxcbiAgICByZUNoYXJDbGFzczogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICBudW1iZXI6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKCkpIH0sXG5cbiAgICBBbHQ6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnQWx0LXJlYyc6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmFsdChlbnYueCwgZW52LnkpIH0sXG5cbiAgICBUZXJtOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnVGVybS1pbmxpbmUnOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmlubGluZShidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSArICctJyArIGVudi5uLCBlbnYueCkgfSxcblxuICAgIFNlcTogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuc2VxLmFwcGx5KGJ1aWxkZXIsIGVudi52YWx1ZSkgfSxcblxuICAgIEZhY3RvcjogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdGYWN0b3ItYmluZCc6ICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYmluZChlbnYueCwgZW52Lm4pIH0sXG5cbiAgICBJdGVyOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnSXRlci1zdGFyJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm1hbnkoZW52LngsIDApIH0sXG4gICAgJ0l0ZXItcGx1cyc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5tYW55KGVudi54LCAxKSB9LFxuICAgICdJdGVyLW9wdCc6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIub3B0KGVudi54KSB9LFxuXG4gICAgUHJlZDogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH0sXG4gICAgJ1ByZWQtbm90JzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5ub3QoZW52LngpIH0sXG4gICAgJ1ByZWQtbG9va2FoZWFkJzogICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5sYShlbnYueCkgfSxcblxuICAgIEJhc2U6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdCYXNlLXVuZGVmaW5lZCc6ICAgICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGJ1aWxkZXIuXyh1bmRlZmluZWQpIH0sXG4gICAgJ0Jhc2UtbnVsbCc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKG51bGwpIH0sXG4gICAgJ0Jhc2UtdHJ1ZSc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKHRydWUpIH0sXG4gICAgJ0Jhc2UtZmFsc2UnOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKGZhbHNlKSB9LFxuICAgICdCYXNlLWFwcGxpY2F0aW9uJzogICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGVudi5ydWxlTmFtZSkgfSxcbiAgICAnQmFzZS1wcmltJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLl8oZW52LnZhbHVlKSB9LFxuICAgICdCYXNlLWxzdCc6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubHN0KGVudi54KSB9LFxuICAgICdCYXNlLXN0cic6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuc3RyKGVudi54KSB9LFxuICAgICdCYXNlLXBhcmVuJzogICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi54IH0sXG4gICAgJ0Jhc2Utb2JqJzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vYmooW10sIGVudi5sZW5pZW50KSB9LFxuICAgICdCYXNlLW9ialdpdGhQcm9wcyc6ICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIub2JqKGVudi5wcywgZW52LmxlbmllbnQpIH0sXG5cbiAgICBQcm9wczogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnUHJvcHMtYmFzZSc6ICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBbZW52LnBdIH0sXG4gICAgJ1Byb3BzLXJlYyc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gW2Vudi5wXS5jb25jYXQoZW52LnBzKSB9LFxuICAgIFByb3A6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIHtuYW1lOiBlbnYubiwgcGF0dGVybjogZW52LnB9IH0sXG5cbiAgICBSdWxlOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnUnVsZS1kZWZpbmUnOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmRlZmluZShlbnYubiwgZW52LmIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgJ1J1bGUtb3ZlcnJpZGUnOiAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5vdmVycmlkZShlbnYubiwgZW52LmIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgJ1J1bGUtZXh0ZW5kJzogICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5leHRlbmQoZW52Lm4sIGVudi5iKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgU3VwZXJHcmFtbWFyOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyBidWlsZGVyLnNldFN1cGVyR3JhbW1hcihlbnYudmFsdWUpIH0sXG4gICAgJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnOiAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gdGhpc01vZHVsZS5uYW1lc3BhY2UoZW52Lm5zKS5nZXRHcmFtbWFyKGVudi5uKSB9LFxuICAgICdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnOiBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIG9wdE5hbWVzcGFjZS5nZXRHcmFtbWFyKGVudi5uKSB9LFxuXG4gICAgR3JhbW1hcjogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5zZXROYW1lKGVudi5uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5zICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52LnJzICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYnVpbGQob3B0TmFtZXNwYWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIEdyYW1tYXJzOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCB3aGF0SXRJcywgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciB0aHVuayA9IHRoaXNNb2R1bGUuX29obUdyYW1tYXIubWF0Y2hDb250ZW50cyhzb3VyY2UsIHdoYXRJdElzKVxuICBpZiAodGh1bmspXG4gICAgcmV0dXJuIHRodW5rKG1ha2VHcmFtbWFyQWN0aW9uRGljdChvcHROYW1lc3BhY2UpKVxuICBlbHNlXG4gICAgLy8gVE9ETzogaW1wcm92ZSBlcnJvciBtZXNzYWdlIChzaG93IHdoYXQgcGFydCBvZiB0aGUgaW5wdXQgaXMgd3JvbmcsIHdoYXQgd2FzIGV4cGVjdGVkLCBldGMuKVxuICAgIGJyb3dzZXIuZXJyb3IoJ2ludmFsaWQgaW5wdXQgaW46Jywgc291cmNlKVxufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICByZXR1cm4gY29tcGlsZUFuZExvYWQoc291cmNlLCAnR3JhbW1hcicsIG9wdE5hbWVzcGFjZSlcbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFycycsIG9wdE5hbWVzcGFjZSlcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFB1YmxpYyBtZXRob2RzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5cbnRoaXNNb2R1bGUubmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAobmFtZXNwYWNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgIG5hbWVzcGFjZXNbbmFtZV0gPSBuZXcgTmFtZXNwYWNlKG5hbWUpXG4gIHJldHVybiBuYW1lc3BhY2VzW25hbWVdXG59XG5cbnRoaXNNb2R1bGUubWFrZUdyYW1tYXIgPSBtYWtlR3JhbW1hclxudGhpc01vZHVsZS5tYWtlR3JhbW1hcnMgPSBtYWtlR3JhbW1hcnNcblxuLy8gU3R1ZmYgdGhhdCdzIG9ubHkgdXNlZnVsIGZvciBib290c3RyYXBwaW5nLCB0ZXN0aW5nLCBldGMuXG5cbi8vIFRPRE86IHJlbmFtZSB0byBfYnVpbGRlclxudGhpc01vZHVsZS5idWlsZGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQnVpbGRlcigpXG59XG5cbnRoaXNNb2R1bGUuX21ha2VHcmFtbWFyQWN0aW9uRGljdCA9IG1ha2VHcmFtbWFyQWN0aW9uRGljdFxuXG52YXIgb2htR3JhbW1hclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXNNb2R1bGUsICdfb2htR3JhbW1hcicsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW9obUdyYW1tYXIpXG4gICAgICBvaG1HcmFtbWFyID0gdGhpcy5fb2htR3JhbW1hckZhY3RvcnkodGhpcylcbiAgICByZXR1cm4gb2htR3JhbW1hclxuICB9XG59KVxuXG4iXX0=
(7)
});
