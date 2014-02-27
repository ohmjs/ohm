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

* Throw away the parser written in OMeta.

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
  this.activeRules = {}
  this.memo = {}
}

PosInfo.prototype = {
  isActive: function(ruleName) {
    return this.activeRules[ruleName]
  },

  enter: function(ruleName) {
    this.activeRules[ruleName] = true
  },

  exit: function(ruleName, pos) {
    this.activeRules[ruleName] = false
  },

  getCurrentLeftRecursion: function() {
    return this.leftRecursionStack ? this.leftRecursionStack[this.leftRecursionStack.length - 1] : undefined
  },

  startLeftRecursion: function(ruleName) {
    if (!this.leftRecursionStack)
      this.leftRecursionStack = []
    this.leftRecursionStack.push({name: ruleName, value: fail, pos: -1})
  },

  endLeftRecursion: function(ruleName) {
    this.leftRecursionStack.pop()
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

function RuleThunk(ruleName, source, startIdx, endIdx, value, bindings) {
  this.ruleName = ruleName
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
  this.value = value
  this.bindings = bindings
}

RuleThunk.prototype = {
  force: function(actionDict) {
    var action = this.lookupAction(actionDict)
    var addlInfo = this.createAddlInfo()
    if (this.bindings.length === 0)
      return action.call(addlInfo, this.value.force(actionDict))
    else {
      var argDict = {}
      for (var idx = 0; idx < this.bindings.length; idx += 2)
        argDict[this.bindings[idx]] = this.bindings[idx + 1]
      var formals = objectUtils.formals(action)
      var args = formals.length == 0 ?
        objectUtils.values(argDict).map(function(arg) { return arg.force(actionDict) }) :
        formals.map(function(name) { return argDict[name].force(actionDict) })
      return action.apply(addlInfo, args)
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
  this.thunks = thunks
}

ListThunk.prototype = {
  force: function(actionDict) {
    return this.thunks.map(function(thunk) { return thunk.force(actionDict) })
  }
}

function ValueThunk(value) {
  this.value = value
}

ValueThunk.prototype = {
  force: function(actionDict) {
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
    if (memoRec) {
      inputStream.pos = memoRec.pos
      return memoRec.value
    } else if (origPosInfo.isActive(ruleName)) {
      var currentLeftRecursion = origPosInfo.getCurrentLeftRecursion()
      if (currentLeftRecursion && currentLeftRecursion.name === ruleName) {
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
          origPosInfo.endLeftRecursion(ruleName)
        }
      } else
        // Only memoizing non-left recursive rules for now.
        // TODO: should be ok to memoize the head rule, as long as it can pretend not to be memoized when
        // involved rules are called as heads of new left recursions. Come up with an efficient way to do this.
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
        return thunk.force(actionDict)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9vaG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBvaG0gPSByZXF1aXJlKCcuLi9zcmMvb2htLmpzJylcbm9obS5fb2htR3JhbW1hckZhY3RvcnkgPVxuKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBiID0gb2htLmJ1aWxkZXIoKVxuICBiLnNldE5hbWUoJ09obScpXG4gIGIuZXh0ZW5kKCdzcGFjZScsIGIuYWx0KGIuc2VxKGIuXygnLy8nKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnXFxuJykpLCBiLmFwcCgnXycpKSwgMCksIGIuXygnXFxuJykpLCBiLnNlcShiLl8oJy8qJyksIGIubWFueShiLnNlcShiLm5vdChiLl8oJyovJykpLCBiLmFwcCgnXycpKSwgMCksIGIuXygnKi8nKSkpKVxuICBiLmRlZmluZSgnX25hbWUnLCBiLnNlcShiLmFwcCgnbmFtZUZpcnN0JyksIGIubWFueShiLmFwcCgnbmFtZVJlc3QnKSwgMCkpKVxuICBiLmRlZmluZSgnbmFtZUZpcnN0JywgYi5hbHQoYi5fKCdfJyksIGIuYXBwKCdsZXR0ZXInKSkpXG4gIGIuZGVmaW5lKCduYW1lUmVzdCcsIGIuYWx0KGIuXygnXycpLCBiLmFwcCgnYWxudW0nKSkpXG4gIGIuZGVmaW5lKCduYW1lJywgYi5zZXEoYi5ub3QoYi5hcHAoJ25hbWVkQ29uc3QnKSksIGIuYmluZChiLmFwcCgnX25hbWUnKSwgJ24nKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LXVuZGVmaW5lZCcsIGIuc2VxKGIuXygndW5kZWZpbmVkJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LW51bGwnLCBiLnNlcShiLl8oJ251bGwnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtdHJ1ZScsIGIuc2VxKGIuXygndHJ1ZScpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC1mYWxzZScsIGIuc2VxKGIuXygnZmFsc2UnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5kZWZpbmUoJ25hbWVkQ29uc3QnLCBiLmFsdChiLmFwcCgnbmFtZWRDb25zdC11bmRlZmluZWQnKSwgYi5hcHAoJ25hbWVkQ29uc3QtbnVsbCcpLCBiLmFwcCgnbmFtZWRDb25zdC10cnVlJyksIGIuYXBwKCduYW1lZENvbnN0LWZhbHNlJykpKVxuICBiLmRlZmluZSgnc3RyaW5nJywgYi5zZXEoYi5fKFwiJ1wiKSwgYi5iaW5kKGIubWFueShiLmFwcCgnc0NoYXInKSwgMCksICdjcycpLCBiLl8oXCInXCIpKSlcbiAgYi5kZWZpbmUoJ3NDaGFyJywgYi5hbHQoYi5zZXEoYi5fKCdcXFxceCcpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JykpLCBiLnNlcShiLl8oJ1xcXFx1JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5fKCdcXFxcJyksIGIuYXBwKCdfJykpLCBiLnNlcShiLm5vdChiLl8oXCInXCIpKSwgYi5hcHAoJ18nKSkpKVxuICBiLmRlZmluZSgncmVnZXhwJywgYi5zZXEoYi5fKCcvJyksIGIuYmluZChiLmFwcCgncmVDaGFyQ2xhc3MnKSwgJ2UnKSwgYi5fKCcvJykpKVxuICBiLmRlZmluZSgncmVDaGFyQ2xhc3MnLCBiLnNlcShiLl8oJ1snKSwgYi5tYW55KGIuYWx0KGIuXygnXFxcXF0nKSwgYi5zZXEoYi5ub3QoYi5fKCddJykpLCBiLmFwcCgnXycpKSksIDApLCBiLl8oJ10nKSkpXG4gIGIuZGVmaW5lKCdudW1iZXInLCBiLnNlcShiLm9wdChiLl8oJy0nKSksIGIubWFueShiLmFwcCgnZGlnaXQnKSwgMSkpKVxuICBiLmlubGluZSgnQWx0LXJlYycsIGIuc2VxKGIuYmluZChiLmFwcCgnVGVybScpLCAneCcpLCBiLl8oJ3wnKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3knKSkpXG4gIGIuZGVmaW5lKCdBbHQnLCBiLmFsdChiLmFwcCgnQWx0LXJlYycpLCBiLmFwcCgnVGVybScpKSlcbiAgYi5pbmxpbmUoJ1Rlcm0taW5saW5lJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdTZXEnKSwgJ3gnKSwgYi5fKCd7JyksIGIuYmluZChiLmFwcCgnX25hbWUnKSwgJ24nKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnVGVybScsIGIuYWx0KGIuYXBwKCdUZXJtLWlubGluZScpLCBiLmFwcCgnU2VxJykpKVxuICBiLmRlZmluZSgnU2VxJywgYi5tYW55KGIuYXBwKCdGYWN0b3InKSwgMCkpXG4gIGIuaW5saW5lKCdGYWN0b3ItYmluZCcsIGIuc2VxKGIuYmluZChiLmFwcCgnSXRlcicpLCAneCcpLCBiLl8oJy4nKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKVxuICBiLmRlZmluZSgnRmFjdG9yJywgYi5hbHQoYi5hcHAoJ0ZhY3Rvci1iaW5kJyksIGIuYXBwKCdJdGVyJykpKVxuICBiLmlubGluZSgnSXRlci1zdGFyJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIuXygnKicpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItcGx1cycsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJysnKSkpXG4gIGIuaW5saW5lKCdJdGVyLW9wdCcsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJz8nKSkpXG4gIGIuZGVmaW5lKCdJdGVyJywgYi5hbHQoYi5hcHAoJ0l0ZXItc3RhcicpLCBiLmFwcCgnSXRlci1wbHVzJyksIGIuYXBwKCdJdGVyLW9wdCcpLCBiLmFwcCgnUHJlZCcpKSlcbiAgYi5pbmxpbmUoJ1ByZWQtbm90JywgYi5zZXEoYi5fKCd+JyksIGIuYmluZChiLmFwcCgnQmFzZScpLCAneCcpKSlcbiAgYi5pbmxpbmUoJ1ByZWQtbG9va2FoZWFkJywgYi5zZXEoYi5fKCcmJyksIGIuYmluZChiLmFwcCgnQmFzZScpLCAneCcpKSlcbiAgYi5kZWZpbmUoJ1ByZWQnLCBiLmFsdChiLmFwcCgnUHJlZC1ub3QnKSwgYi5hcHAoJ1ByZWQtbG9va2FoZWFkJyksIGIuYXBwKCdCYXNlJykpKVxuICBiLmlubGluZSgnQmFzZS1hcHBsaWNhdGlvbicsIGIuc2VxKGIuYmluZChiLmFwcCgnbmFtZScpLCAncnVsZU5hbWUnKSwgYi5ub3QoYi5hbHQoYi5fKCc9PScpLCBiLl8oJzo9JyksIGIuXygnKz0nKSkpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtcHJpbScsIGIuYmluZChiLmFsdChiLmFwcCgnbmFtZWRDb25zdCcpLCBiLmFwcCgnc3RyaW5nJyksIGIuYXBwKCdyZWdleHAnKSwgYi5hcHAoJ251bWJlcicpKSwgJ3gnKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtbHN0JywgYi5zZXEoYi5fKCdbJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnXScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utc3RyJywgYi5zZXEoYi5fKCdcIicpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJ1wiJykpKVxuICBiLmlubGluZSgnQmFzZS1wYXJlbicsIGIuc2VxKGIuXygnKCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJyknKSkpXG4gIGIuaW5saW5lKCdCYXNlLW9iaicsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5vcHQoYi5fKCcuLi4nKSksICdsZW5pZW50JyksIGIuXygnfScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utb2JqV2l0aFByb3BzJywgYi5zZXEoYi5fKCd7JyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJyksIGIuYmluZChiLm9wdChiLnNlcShiLl8oJywnKSwgYi5fKCcuLi4nKSkpLCAnbGVuaWVudCcpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdCYXNlJywgYi5hbHQoYi5hcHAoJ0Jhc2UtYXBwbGljYXRpb24nKSwgYi5hcHAoJ0Jhc2UtcHJpbScpLCBiLmFwcCgnQmFzZS1sc3QnKSwgYi5hcHAoJ0Jhc2Utc3RyJyksIGIuYXBwKCdCYXNlLXBhcmVuJyksIGIuYXBwKCdCYXNlLW9iaicpLCBiLmFwcCgnQmFzZS1vYmpXaXRoUHJvcHMnKSkpXG4gIGIuaW5saW5lKCdQcm9wcy1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSwgYi5fKCcsJyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJykpKVxuICBiLmlubGluZSgnUHJvcHMtYmFzZScsIGIuYmluZChiLmFwcCgnUHJvcCcpLCAncCcpKVxuICBiLmRlZmluZSgnUHJvcHMnLCBiLmFsdChiLmFwcCgnUHJvcHMtcmVjJyksIGIuYXBwKCdQcm9wcy1iYXNlJykpKVxuICBiLmRlZmluZSgnUHJvcCcsIGIuc2VxKGIuYmluZChiLmFsdChiLmFwcCgnX25hbWUnKSwgYi5hcHAoJ3N0cmluZycpKSwgJ24nKSwgYi5fKCc6JyksIGIuYmluZChiLmFwcCgnRmFjdG9yJyksICdwJykpKVxuICBiLmlubGluZSgnUnVsZS1kZWZpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1J1bGVOYW1lJyksICduJyksIGIuXygnPT0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuaW5saW5lKCdSdWxlLW92ZXJyaWRlJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdSdWxlTmFtZScpLCAnbicpLCBiLl8oJzo9JyksIGIuYmluZChiLmFwcCgnQWx0JyksICdiJykpKVxuICBiLmlubGluZSgnUnVsZS1leHRlbmQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1J1bGVOYW1lJyksICduJyksIGIuXygnKz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuZGVmaW5lKCdSdWxlJywgYi5hbHQoYi5hcHAoJ1J1bGUtZGVmaW5lJyksIGIuYXBwKCdSdWxlLW92ZXJyaWRlJyksIGIuYXBwKCdSdWxlLWV4dGVuZCcpKSlcbiAgYi5kZWZpbmUoJ1J1bGVOYW1lJywgYi5hcHAoJ25hbWUnKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnLCBiLnNlcShiLl8oJzw6JyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbnMnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKVxuICBiLmRlZmluZSgnU3VwZXJHcmFtbWFyJywgYi5hbHQoYi5hcHAoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnKSwgYi5hcHAoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcpKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ0dyYW1tYXJOYW1lJyksICduJyksIGIuYmluZChiLm9wdChiLmFwcCgnU3VwZXJHcmFtbWFyJykpLCAncycpLCBiLl8oJ3snKSwgYi5iaW5kKGIubWFueShiLmFwcCgnUnVsZScpLCAwKSwgJ3JzJyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXJzJywgYi5tYW55KGIuYXBwKCdHcmFtbWFyJyksIDApKVxuICBiLmRlZmluZSgnR3JhbW1hck5hbWUnLCBiLmFwcCgnbmFtZScpKVxuICByZXR1cm4gYi5idWlsZChvcHROYW1lc3BhY2UpXG59KVxuIiwiZXhwb3J0cy5vYmplY3RVdGlscyA9IHJlcXVpcmUoJy4vb2JqZWN0VXRpbHMuanMnKVxuZXhwb3J0cy5zdHJpbmdVdGlscyA9IHJlcXVpcmUoJy4vc3RyaW5nVXRpbHMuanMnKVxuZXhwb3J0cy5lcXVhbHMgPSByZXF1aXJlKCcuL2VxdWFscy5qcycpXG5leHBvcnRzLmJyb3dzZXIgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKVxuIiwidmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBMb2dnaW5nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgc3Vic2NyaWJlZCA9IHt9XG5cbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oc3ViamVjdCAvKiAsIC4uLiAqLykge1xuICBpZiAoIXN1YnNjcmliZWRbc3ViamVjdF0pXG4gICAgcmV0dXJuXG4gIGFyZ3VtZW50c1swXSA9ICdbJyArIHN1YmplY3QgKyAnXSdcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuXG5leHBvcnRzLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgc3Vic2NyaWJlZFtzdWJqZWN0XSA9IHRydWVcbn1cblxuZXhwb3J0cy51bnN1YnNjcmliZSA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgZGVsZXRlIHNob3dpbmdbc3ViamVjdF1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFzc2VydHMsIGVycm9ycywgZXRjLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5lcnJvciA9IGZ1bmN0aW9uKC8qIGFyZzEsIGFyZzIsIC4uLiAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBhcmdzKVxuICB0aHJvdyAnZXJyb3I6ICcgKyBhcmdzLmpvaW4oJyAnKVxufVxuXG5leHBvcnRzLnNhbml0eUNoZWNrID0gZnVuY3Rpb24obmFtZSwgY29uZGl0aW9uKSB7XG4gIGlmICghY29uZGl0aW9uKVxuICAgIHRoaXNNb2R1bGUuZXJyb3IoJ2ZhaWxlZCBzYW5pdHkgY2hlY2s6JywgbmFtZSlcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIERPTSB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5wcmV0dHlQcmludE5vZGUgPSBmdW5jdGlvbihub2RlLCBlbmROb2RlLCBlbmRPZmZzZXQpIHtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBUZXh0KSB7XG4gICAgaWYgKG5vZGUgPT09IGVuZE5vZGUpXG4gICAgICByZXR1cm4gJ3RleHR7JyArIG5vZGUuZGF0YS5zdWJzdHIoMCwgZW5kT2Zmc2V0KSArICd8JyArIG5vZGUuZGF0YS5zdWJzdHIoZW5kT2Zmc2V0KSArICd9J1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhICsgJ30nXG4gIH1cblxuICB2YXIgcGFydHMgPSBbbm9kZS50YWdOYW1lLCAneyddXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKG5vZGUgPT09IGVuZE5vZGUgJiYgZW5kT2Zmc2V0ID09IGlkeClcbiAgICAgIHBhcnRzLnB1c2goJ3wnKVxuICAgIHBhcnRzLnB1c2godGhpc01vZHVsZS5wcmV0dHlQcmludE5vZGUobm9kZS5jaGlsZE5vZGVzLml0ZW0oaWR4KSwgZW5kTm9kZSwgZW5kT2Zmc2V0KSlcbiAgfVxuICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICBwYXJ0cy5wdXNoKCd8JylcbiAgcGFydHMucHVzaCgnfScpXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuXG4iLCIvLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIGRvdWJsZUVxdWFscyh4LCB5KSB7XG4gIHJldHVybiB4ID09IHlcbn1cblxuZnVuY3Rpb24gdHJpcGxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT09IHlcbn1cblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoeCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB4XG4gIHJldHVybiB0eXBlICE9PSAnb2JqZWN0J1xufVxuXG5mdW5jdGlvbiBlcXVhbHMoeCwgeSwgZGVlcCwgZXFGbikge1xuICBpZiAoaXNQcmltaXRpdmUoeCkpXG4gICAgcmV0dXJuIGVxRm4oeCwgeSlcbiAgZm9yICh2YXIgcCBpbiB4KVxuICAgIGlmIChkZWVwICYmICFlcXVhbHMoeFtwXSwgeVtwXSwgZGVlcCwgZXFGbikgfHxcbiAgICAgICAgIWRlZXAgJiYgIWVxRm4oeFtwXSwgeVtwXSkpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgZm9yICh2YXIgcCBpbiB5KVxuICAgIGlmICh5W3BdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgeFtwXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGhhdmVTYW1lQ29udGVudHNJbkFueU9yZGVyKGFycjEsIGFycjIsIGRlZXAsIGVxRm4pIHtcbiAgaWYgKCFhcnIxIGluc3RhbmNlb2YgQXJyYXkgfHwgIWFycjIgaW5zdGFuY2VvZiBBcnJheSB8fFxuICAgICAgYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnIxLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycjFbaWR4XVxuICAgIHZhciBmb3VuZFggPSBhcnIyLnNvbWUoZnVuY3Rpb24oeSkge1xuICAgICAgcmV0dXJuIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKVxuICAgIH0pXG4gICAgaWYgKCFmb3VuZFgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCBmYWxzZSwgZG91YmxlRXF1YWxzKVxufVxuXG5leHBvcnRzLmRlZXBFcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgdHJ1ZSwgZG91YmxlRXF1YWxzKVxufVxuXG5leHBvcnRzLnN0cmljdEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCBmYWxzZSwgdHJpcGxlRXF1YWxzKVxufVxuXG5leHBvcnRzLnN0cmljdERlZXBFcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgdHJ1ZSwgdHJpcGxlRXF1YWxzKVxufVxuXG5leHBvcnRzLmhhdmVTYW1lQ29udGVudHNJbkFueU9yZGVyID0gZnVuY3Rpb24oYXJyMSwgYXJyMikge1xuICByZXR1cm4gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgdHJ1ZSwgZG91YmxlRXF1YWxzKVxufVxuXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuZXhwb3J0cy5vYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBmdW5jdGlvbihvYmosIG9wdFByb3BlcnRpZXMpIHtcbiAgZnVuY3Rpb24gY29ucygpIHt9XG4gIGNvbnMucHJvdG90eXBlID0gb2JqXG4gIHZhciBhbnMgPSBuZXcgY29ucygpXG4gIGlmIChvcHRQcm9wZXJ0aWVzKVxuICAgIHRoaXNNb2R1bGUua2V5c0FuZFZhbHVlc0RvKG9wdFByb3BlcnRpZXMsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGFuc1trXSA9IHZcbiAgICB9KVxuICByZXR1cm4gYW5zXG59XG5cbmV4cG9ydHMuZm9ybWFscyA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmMuXG4gICAgdG9TdHJpbmcoKS5cbiAgICBtYXRjaCgvXFwoKC4qPylcXCkvKVswXS5cbiAgICByZXBsYWNlKC8gL2csICcnKS5cbiAgICBzbGljZSgxLCAtMSkuXG4gICAgc3BsaXQoJywnKS5cbiAgICBmaWx0ZXIoZnVuY3Rpb24obW9kdWxlTmFtZSkgeyByZXR1cm4gbW9kdWxlTmFtZSAhPSAnJyB9KVxufVxuXG5leHBvcnRzLmtleXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgZm9yICh2YXIgcCBpbiBvYmplY3QpXG4gICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwKSlcbiAgICAgIGZuKHApXG59XG5cbmV4cG9ydHMudmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0FuZFZhbHVlc0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICB0aGlzTW9kdWxlLmtleXNEbyhvYmplY3QsIGZ1bmN0aW9uKHApIHsgZm4ocCwgb2JqZWN0W3BdKSB9KVxufVxuXG5leHBvcnRzLmtleXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlc0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLnZhbHVlc0RvKG9iamVjdCwgZm4pIH1cbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYua2V5c0FuZFZhbHVlc0RvKG9iamVjdCwgZm4pIH1cbn1cblxuZXhwb3J0cy52YWx1ZXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGFucyA9IFtdXG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBhbnMucHVzaChvYmplY3RbcF0pIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZnVuY3Rpb24gU3RyaW5nQnVmZmVyKCkge1xuICB0aGlzLnN0cmluZ3MgPSBbXVxuICB0aGlzLmxlbmd0aFNvRmFyID0gMFxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKylcbiAgICB0aGlzLm5leHRQdXRBbGwoYXJndW1lbnRzW2lkeF0pXG59XG5cblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnN0cmluZ3MucHVzaChzKVxuICAgIHRoaXMubGVuZ3RoU29GYXIgKz0gcy5sZW5ndGhcbiAgfSxcblxuICBjb250ZW50czogZnVuY3Rpb24oKSAge1xuICAgIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJylcbiAgfVxufVxuXG5leHBvcnRzLlN0cmluZ0J1ZmZlciA9IFN0cmluZ0J1ZmZlclxuXG4iLCJ2YXIgb2JqZWN0VXRpbHMgPSByZXF1aXJlKCcuL29iamVjdFV0aWxzLmpzJylcbnZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG4vLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIHBhZChudW1iZXJBc1N0cmluZywgbGVuKSB7XG4gIHZhciB6ZXJvcyA9IFtdXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bWJlckFzU3RyaW5nLmxlbmd0aCAtIGxlbjsgaWR4KyspXG4gICAgemVyb3MucHVzaCgnMCcpXG4gIHJldHVybiB6ZXJvcy5qb2luKCcnKSArIG51bWJlckFzU3RyaW5nXG59XG5cbnZhciBlc2NhcGVTdHJpbmdGb3IgPSB7fVxuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKylcbiAgZXNjYXBlU3RyaW5nRm9yW2NdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjKVxuZXNjYXBlU3RyaW5nRm9yW1wiJ1wiLmNoYXJDb2RlQXQoMCldICA9IFwiXFxcXCdcIlxuZXNjYXBlU3RyaW5nRm9yWydcIicuY2hhckNvZGVBdCgwKV0gID0gJ1xcXFxcIidcbmVzY2FwZVN0cmluZ0ZvclsnXFxcXCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXFxcXFwnXG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcZicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGYnXG5lc2NhcGVTdHJpbmdGb3JbJ1xcbicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXG4nXG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcdCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHQnXG5lc2NhcGVTdHJpbmdGb3JbJ1xcdicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnXG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKGMsIG9wdERlbGltKSB7XG4gIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKVxuICBpZiAoKGMgPT0gJ1wiJyB8fCBjID09IFwiJ1wiKSAmJiBvcHREZWxpbSAmJiBjICE9PSBvcHREZWxpbSlcbiAgICByZXR1cm4gY1xuICBlbHNlIGlmIChjaGFyQ29kZSA8IDEyOClcbiAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXVxuICBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpXG4gICAgcmV0dXJuICdcXFxceCcgKyBwYWQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyKVxuICBlbHNlXG4gICAgcmV0dXJuICdcXFxcdScgKyBwYWQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCA0KVxufVxuXG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKHMpIHtcbiAgaWYgKHMuY2hhckF0KDApID09ICdcXFxcJylcbiAgICBzd2l0Y2ggKHMuY2hhckF0KDEpKSB7XG4gICAgICBjYXNlICdiJzogIHJldHVybiAnXFxiJ1xuICAgICAgY2FzZSAnZic6ICByZXR1cm4gJ1xcZidcbiAgICAgIGNhc2UgJ24nOiAgcmV0dXJuICdcXG4nXG4gICAgICBjYXNlICdyJzogIHJldHVybiAnXFxyJ1xuICAgICAgY2FzZSAndCc6ICByZXR1cm4gJ1xcdCdcbiAgICAgIGNhc2UgJ3YnOiAgcmV0dXJuICdcXHYnXG4gICAgICBjYXNlICd4JzogIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpXG4gICAgICBjYXNlICd1JzogIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDYpLCAxNikpXG4gICAgICBkZWZhdWx0OiAgIHJldHVybiBzLmNoYXJBdCgxKVxuICAgIH1cbiAgZWxzZVxuICAgIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIHByaW50T24oeCwgd3MpIHtcbiAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHdzLm5leHRQdXRBbGwoJ1snKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHgubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHByaW50T24oeFtpZHhdLCB3cylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnXScpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIGhhc1NpbmdsZVF1b3RlcyA9IHguaW5kZXhPZihcIidcIikgPj0gMFxuICAgIHZhciBoYXNEb3VibGVRdW90ZXMgPSB4LmluZGV4T2YoJ1wiJykgPj0gMFxuICAgIHZhciBkZWxpbSA9IGhhc1NpbmdsZVF1b3RlcyAmJiAhaGFzRG91YmxlUXVvdGVzID8gJ1wiJyA6IFwiJ1wiXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspXG4gICAgICB3cy5uZXh0UHV0QWxsKHRoaXNNb2R1bGUuZXNjYXBlQ2hhcih4W2lkeF0sIGRlbGltKSlcbiAgICB3cy5uZXh0UHV0QWxsKGRlbGltKVxuICB9IGVsc2UgaWYgKHggPT09IG51bGwpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdudWxsJylcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgISh4IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgIHdzLm5leHRQdXRBbGwoJ3snKVxuICAgIHZhciBmaXJzdCA9IHRydWVcbiAgICBvYmplY3RVdGlscy5rZXlzQW5kVmFsdWVzRG8oeCwgZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKGZpcnN0KVxuICAgICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHByaW50T24oaywgd3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCc6ICcpXG4gICAgICBwcmludE9uKHYsIHdzKVxuICAgIH0pXG4gICAgd3MubmV4dFB1dEFsbCgnfScpXG4gIH0gZWxzZVxuICAgIHdzLm5leHRQdXRBbGwoJycgKyB4KVxufVxuXG5leHBvcnRzLnByaW50U3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciB3cyA9IG5ldyBvYmplY3RVdGlscy5TdHJpbmdCdWZmZXIoKVxuICBwcmludE9uKG9iaiwgd3MpXG4gIHJldHVybiB3cy5jb250ZW50cygpXG59XG5cbiIsIi8qXG5cblRPRE86XG5cbiogVGhyb3cgYXdheSB0aGUgcGFyc2VyIHdyaXR0ZW4gaW4gT01ldGEuXG5cbiogVGhpbmsgYWJvdXQgaW1wcm92aW5nIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBzeW50YWN0aWMgcnVsZXMnIGF1dG9tYXRpYyBzcGFjZSBza2lwcGluZzpcbiAgLS0gQ291bGQga2VlcCB0cmFjayBvZiB0aGUgY3VycmVudCBydWxlIG5hbWUgYnkgbW9kaWZ5aW5nIHRoZSBjb2RlIChpbiBBcHBseS5ldmFsKSB3aGVyZSBlbnRlciBhbmQgZXhpdCBtZXRob2RzXG4gICAgIGFyZSBjYWxsZWQuIChXb3VsZCBhbHNvIHdhbnQgdG8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIHRoZSBydWxlIGlzIHN5bnRhY3RpYyB0byBhdm9pZCByZS1kb2luZyB0aGF0IHdvcmtcbiAgICAgYXQgZWFjaCBhcHBsaWNhdGlvbi4pXG5cbiogQ29uc2lkZXIgYm9ycm93aW5nIChzb21ldGhpbmcgbGlrZSkgdGhlIHZhcmlhYmxlLW5vdC1vdGhlcndpc2UtbWVudGlvbmVkIGlkZWEgZnJvbSBSb2JieSBGaW5kbGVyJ3MgcmVkZXgsIGFzIGEgd2F5XG4gIHRvIG1ha2UgaXQgZWFzaWVyIGZvciBwcm9ncmFtbWVycyB0byBkZWFsIHdpdGgga2V5d29yZHMgYW5kIGlkZW50aWZpZXJzLlxuXG4qIFRoaW5rIGFib3V0IGEgYmV0dGVyIHdheSB0byBkZWFsIHdpdGggbGlzdHNcbiAgLS0gQnVpbHQtaW4gbGlzdCBvcGVyYXRvcj9cbiAgLS0gUGFyYW1ldGVyaXplZCBydWxlcz9cblxuKiBJbXByb3ZlIHRlc3QgY292ZXJhZ2VcbiAgLS0gQWRkIHRlc3RzIGZvciBzY29waW5nLCBlLmcuLCBcImZvbzphIFtiYXI6YiBiYXo6Y106ZFwiIHNob3VsZCBoYXZlIDQgYmluZGluZ3MuXG4gICAgIChTYW1lIGtpbmQgb2YgdGhpbmcgZm9yIG5lc3RlZCBzdHJpbmcgYW5kIGxvb2thaGVhZCBleHByZXNzaW9ucywgdGhlaXIgYmluZGluZ3Mgc2hvdWxkIGxlYWsgdG8gdGhlIGVuY2xvc2luZyBzZXEuKVxuXG4qIFRoaW5rIGFib3V0IGZvcmVpZ24gcnVsZSBpbnZvY2F0aW9uXG4gIC0tIENhbid0IGp1c3QgYmUgZG9uZSBpbiB0aGUgc2FtZSB3YXkgYXMgaW4gT01ldGEgYi9jIG9mIHRoZSBhY3Rpb25EaWN0XG4gIC0tIFdpbGwgd2FudCB0byBwcmVzZXJ2ZSB0aGUgXCJubyB1bm5lY2Vzc2FyeSBzZW1hbnRpYyBhY3Rpb25zXCIgZ3VhcmFudGVlXG4gIC0tIFRoZSBzb2x1dGlvbiBtaWdodCBiZSB0byBlbmFibGUgdGhlIHByb2dyYW1tZXIgdG8gcHJvdmlkZSBtdWx0aXBsZSBhY3Rpb25EaWN0cyxcbiAgICAgYnV0IEknbGwgaGF2ZSB0byBjb21lIHVwIHdpdGggYSBjb252ZW5pZW50IHdheSB0byBhc3NvY2lhdGUgZWFjaCB3aXRoIGEgcGFydGljdWxhciBncmFtbWFyLlxuXG4qIFRoaW5rIGFib3V0IGluY3JlbWVudGFsIHBhcnNpbmcgKGdvb2QgZm9yIGVkaXRvcnMpXG4gIC0tIEJhc2ljIGlkZWE6IGtlZXAgdHJhY2sgb2YgbWF4IGluZGV4IHNlZW4gdG8gY29tcHV0ZSBhIHJlc3VsdFxuICAgICAoc3RvcmUgdGhpcyBpbiBtZW1vIHJlYyBhcyBhbiBpbnQgcmVsYXRpdmUgdG8gY3VyciBwb3MpXG4gIC0tIE9rIHRvIHJldXNlIG1lbW9pemVkIHZhbHVlIGFzIGxvbmcgYXMgcmFuZ2UgZnJvbSBjdXJyZW50IGluZGV4IHRvIG1heCBpbmRleCBoYXNuJ3QgY2hhbmdlZFxuICAtLSBDb3VsZCBiZSBhIGN1dGUgd29ya3Nob3AgcGFwZXIuLi5cblxuXG5TeW50YXggLyBsYW5ndWFnZSBpZGVhczpcblxuKiBTeW50YXggZm9yIHJ1bGUgZGVjbGFyYXRpb25zOlxuXG4gICAgZm9vID09IGJhciBiYXogICAgIChkZWZpbmUpXG4gICAgZm9vIDo9IGJhciBiYXogICAgIChvdmVycmlkZSAvIHJlcGxhY2UpXG4gICAgZm9vIDw9IGJhciBiYXogICAgIChleHRlbmQpXG5cbiogSW5saW5lIHJ1bGVzLCBlLmcuLFxuXG4gICAgYWRkRXhwciA9IGFkZEV4cHI6eCAnKycgbXVsRXhwcjp5IHtwbHVzfVxuICAgICAgICAgICAgfCBhZGRFeHByOnggJy0nIG11bEV4cHI6eSB7bWludXN9XG4gICAgICAgICAgICB8IG11bEV4cHJcblxuICBpcyBzeW50YWN0aWMgc3VnYXIgZm9yXG5cbiAgICBhZGRFeHByID0gcGx1cyB8IG1pbnVzIHwgbXVsRXhwcixcbiAgICBwbHVzID0gYWRkRXhwcjp4ICcrJyBtdWxFeHByOnksXG4gICAgbWludXMgPSBhZGRFeHByOnggJy0nIG11bEV4cHI6eVxuXG4qIEluIHRoaXMgZXhhbXBsZTpcblxuICAgIGZvbyA9IFwiYmFyXCJcbiAgICBiYXIgPSAnYWJjJ1xuXG4gIFRoZSBmb28gcnVsZSBzYXlzIGl0IHdhbnRzIHRoZSBiYXIgcnVsZSB0byBtYXRjaCB0aGUgY29udGVudHMgb2YgYSBzdHJpbmcgb2JqZWN0LiAoVGhlIFwicyBpcyBhIGtpbmQgb2YgcGFyZW50aGVzaXMuKVxuICBUaGVuIHlvdSBjb3VsZCBlaXRoZXIgc2F5XG5cbiAgICBtLm1hdGNoQWxsKCdhYmMnLCAnYmFyJylcblxuICBvclxuXG4gICAgbS5tYXRjaCgnYWJjJywgJ2ZvbycpXG5cbiAgQm90aCBzaG91bGQgc3VjY2VlZC5cblxuKiBBYm91dCBvYmplY3QgbWF0Y2hpbmdcblxuICBTb21lIGlzc3VlczpcbiAgLS0gU2hvdWxkIGRlZmluaXRlbHkgYWxsb3cgcGF0dGVybiBtYXRjaGluZyBvbiBlYWNoIHByb3BlcnR5J3MgdmFsdWUuIEJ1dCB3aGF0IGFib3V0IHByb3BlcnR5IG5hbWVzP1xuICAtLSBXaGF0IHRvIGRvIGFib3V0IHVuc3BlY2lmaWVkIHByb3BlcnRpZXM/XG4gIC0tIFN5bnRheDogSlNPTiB1c2VzIGNvbG9ucyB0byBzZXBhcmF0ZSBwcm9wZXJ0eSBuYW1lcyBhbmQgdmFsdWVzLiBXaWxsIGxvb2sgYmFkIHcvIGJpbmRpbmdzLCBlLmcuLFxuICAgICB7Zm9vOiBudW1iZXI6bn0gKGV3d3d3KVxuXG4gIEN1cnJlbnQgc3RyYXdtYW46XG4gIC0tIFJlcXVpcmUgcHJvcGVydHkgbmFtZXMgdG8gYmUgc3RyaW5nIGxpdGVyYWxzIChub3QgcGF0dGVybnMpLCBvbmx5IGFsbG93IHBhdHRlcm4gbWF0Y2hpbmcgb24gdGhlaXIgdmFsdWVzLlxuICAtLSBBbGxvdyBhbiBvcHRpb25hbCAnLi4uJyBhcyB0aGUgbGFzdCBwYXR0ZXJuLCB0aGF0IHdvdWxkIG1hdGNoIGFueSB1bnNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICAgICAgIHsnZm9vJzogbnVtYmVyLCAnYmFyJzogc3RyaW5nLCAnYmF6JzogNSwgLi4ufVxuICAgICBNaWdodCBldmVuIGFsbG93IHRoZSAuLi4gdG8gYmUgYm91bmQgdG8gYSB2YXJpYWJsZSB0aGF0IHdvdWxkIGNvbnRhaW4gYWxsIG9mIHRob3NlIHByb3BlcnRpZXMuXG4gIC0tIENvbnNpZGVyIGNoYW5naW5nIGJpbmRpbmcgc3ludGF4IGZyb20gZXhwcjpuYW1lIHRvIGV4cHIubmFtZVxuICAgICAoTW9yZSBKU09OLWZyaWVuZGx5LCBidXQgaXQgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCAuLi4gc3ludGF4LiBCdXQgbWF5YmUgaXQncyBub3Qgc28gaW1wb3J0YW50IHRvIGJlIGFibGUgdG8gYmluZFxuICAgICB0aGUgcmVzdCBvZiB0aGUgcHJvcGVydGllcyBhbmQgdmFsdWVzIGFueXdheSwgc2luY2UgeW91IGNhbiBhbHdheXMgYmluZCB0aGUgZW50aXJlIG9iamVjdC4pXG5cblxuT3B0aW1pemF0aW9uIGlkZWFzOlxuXG4qIE9wdGltaXplICdiaW5kcycgLS0gc2hvdWxkIHByZS1hbGxvY2F0ZSBhbiBhcnJheSBvZiBiaW5kaW5ncyBpbnN0ZWFkIG9mIGRvaW5nIHB1c2hlcywgdGhyb3dpbmcgYXdheSBhcnJheXMgb24gZmFpbFxuICAoc2VlIEFsdCksIGV0Yy5cblxuKiBDb25zaWRlciBhZGRpbmcgYW4gYWRkaXRpb25hbCBjb2RlIGdlbmVyYXRpb24gc3RlcCB0aGF0IGdlbmVyYXRlcyBlZmZpY2llbnQgY29kZSBmcm9tIHRoZSBBU1RzLCBpbnN0ZWFkIG9mXG4gIGludGVycHJldGluZyB0aGVtIGRpcmVjdGx5LlxuXG4qIERvbid0IGJvdGhlciBjcmVhdGluZyB0aHVua3MgLyBsaXN0cyBvZiB0aHVua3Mgd2hlbiB2YWx1ZSBpcyBub3QgbmVlZGVkIChPTWV0YSBkaWQgdGhpcylcbiAgLS0gRS5nLiwgaW4gXCJmb28gPSBzcGFjZSogYmFyXCIgdGhlIHJlc3VsdCBvZiBzcGFjZSogaXMgbm90IG5lZWRlZCwgc28gZG9uJ3QgYm90aGVyIGNyZWF0aW5nIGEgbGlzdCBvZiB0aHVua3MgLyB2YWx1ZXNcbiAgLS0gQ291bGQganVzdCByZXR1cm4gdW5kZWZpbmVkIChhbnl0aGluZyBleGNlcHQgZmFpbClcblxuKiBHZXQgcmlkIG9mIHVubmVjZXNzYXJ5IFNlcXMgYW5kIEFsdHMgKE9NZXRhIGRpZCB0aGlzIHRvbylcblxuKi9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIERlcGVuZGVuY2llc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hci5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBvYmplY3RVdGlscyA9IGF3bGliLm9iamVjdFV0aWxzXG52YXIgc3RyaW5nVXRpbHMgPSBhd2xpYi5zdHJpbmdVdGlsc1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyXG52YXIgZXF1YWxzID0gYXdsaWIuZXF1YWxzXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIZWxwZXJzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxudmFyIGZhaWwgPSB7fVxuXG5mdW5jdGlvbiBnZXREdXBsaWNhdGVzKGFycmF5KSB7XG4gIHZhciBkdXBsaWNhdGVzID0gW11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyYXkubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyYXlbaWR4XVxuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApXG4gICAgICBkdXBsaWNhdGVzLnB1c2goeClcbiAgfVxuICByZXR1cm4gZHVwbGljYXRlc1xufVxuXG5mdW5jdGlvbiBhYnN0cmFjdCgpIHtcbiAgdGhyb3cgJ3RoaXMgbWV0aG9kIGlzIGFic3RyYWN0ISdcbn1cblxuZnVuY3Rpb24gaXNTeW50YWN0aWMocnVsZU5hbWUpIHtcbiAgdmFyIGZpcnN0Q2hhciA9IHJ1bGVOYW1lWzBdXG4gIHJldHVybiAnQScgPD0gZmlyc3RDaGFyICYmIGZpcnN0Q2hhciA8PSAnWidcbn1cblxudmFyIF9hcHBseVNwYWNlc1xuZnVuY3Rpb24gc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pIHtcbiAgKF9hcHBseVNwYWNlcyB8fCAoX2FwcGx5U3BhY2VzID0gbmV3IEFwcGx5KCdzcGFjZXMnKSkpLmV2YWwoZmFsc2UsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgdW5kZWZpbmVkKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW5wdXQgc3RyZWFtc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW5wdXRTdHJlYW0oKSB7XG4gIHRocm93ICdJbnB1dFN0cmVhbSBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuSW5wdXRTdHJlYW0ubmV3Rm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJylcbiAgICByZXR1cm4gbmV3IFN0cmluZ0lucHV0U3RyZWFtKG9iailcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgcmV0dXJuIG5ldyBMaXN0SW5wdXRTdHJlYW0ob2JqKVxuICBlbHNlXG4gICAgdGhyb3cgJ2Nhbm5vdCBtYWtlIGlucHV0IHN0cmVhbSBmb3IgJyArIG9ialxufVxuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlXG4gICAgdGhpcy5wb3MgPSAwXG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdXG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyUG9zID0gdGhpcy5wb3NcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMucG9zSW5mb3NbY3VyclBvc11cbiAgICByZXR1cm4gcG9zSW5mbyB8fCAodGhpcy5wb3NJbmZvc1tjdXJyUG9zXSA9IG5ldyBQb3NJbmZvKGN1cnJQb3MpKVxuICB9LFxuXG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aFxuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmF0RW5kKCkgPyBmYWlsIDogdGhpcy5zb3VyY2VbdGhpcy5wb3MrK11cbiAgfSxcblxuICBtYXRjaEV4YWN0bHk6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXh0KCkgPT09IHggPyB0cnVlIDogZmFpbFxuICB9LFxuXG4gIGludGVydmFsOiBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0SWR4LCBlbmRJZHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gU3RyaW5nSW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpXG59XG5cblN0cmluZ0lucHV0U3RyZWFtLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspXG4gICAgICBpZiAodGhpcy5tYXRjaEV4YWN0bHkoc1tpZHhdKSA9PT0gZmFpbClcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIG1hdGNoUmVnRXhwOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gSU1QT1JUQU5UOiBlIG11c3QgYmUgYSBub24tZ2xvYmFsLCBvbmUtY2hhcmFjdGVyIGV4cHJlc3Npb24sIGUuZy4sIC8uLyBhbmQgL1swLTldL1xuICAgIHZhciBjID0gdGhpcy5uZXh0KClcbiAgICByZXR1cm4gYyAhPT0gZmFpbCAmJiBlLnRlc3QoYykgPyB0cnVlIDogZmFpbFxuICB9XG59KVxuXG5mdW5jdGlvbiBMaXN0SW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpXG59XG5cbkxpc3RJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KHMpXG4gIH0sXG4gICAgXG4gIG1hdGNoUmVnRXhwOiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KGUpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFBvc0luZm8ocG9zKSB7XG4gIHRoaXMucG9zID0gcG9zXG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fVxuICB0aGlzLm1lbW8gPSB7fVxufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdXG4gIH0sXG5cbiAgZW50ZXI6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSB0cnVlXG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24ocnVsZU5hbWUsIHBvcykge1xuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gZmFsc2VcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID8gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV0gOiB1bmRlZmluZWRcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKCF0aGlzLmxlZnRSZWN1cnNpb25TdGFjaylcbiAgICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID0gW11cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtuYW1lOiBydWxlTmFtZSwgdmFsdWU6IGZhaWwsIHBvczogLTF9KVxuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucG9wKClcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW50ZXJ2YWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcnZhbChzb3VyY2UsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4XG59XG5cbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBJbnB1dFN0cmVhbS5uZXdGb3IodGhpcy5zb3VyY2UpLmludGVydmFsKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICB9LFxuXG4gIG9ubHlFbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdGFydElkeCArIDEgIT09IHRoaXMuZW5kSWR4KVxuICAgICAgYnJvd3Nlci5lcnJvcignaW50ZXJ2YWwnLCB0aGlzLCAnd2FzIGV4cGVjdGVkIHRvIGNvbnRhaW4gb25seSBvbmUgZWxlbWVudCcpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMuc3RhcnRJZHhdXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRodW5rc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUnVsZVRodW5rKHJ1bGVOYW1lLCBzb3VyY2UsIHN0YXJ0SWR4LCBlbmRJZHgsIHZhbHVlLCBiaW5kaW5ncykge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWVcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2VcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4XG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxuICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3Ncbn1cblxuUnVsZVRodW5rLnByb3RvdHlwZSA9IHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgYWN0aW9uID0gdGhpcy5sb29rdXBBY3Rpb24oYWN0aW9uRGljdClcbiAgICB2YXIgYWRkbEluZm8gPSB0aGlzLmNyZWF0ZUFkZGxJbmZvKClcbiAgICBpZiAodGhpcy5iaW5kaW5ncy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gYWN0aW9uLmNhbGwoYWRkbEluZm8sIHRoaXMudmFsdWUuZm9yY2UoYWN0aW9uRGljdCkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgYXJnRGljdCA9IHt9XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmJpbmRpbmdzLmxlbmd0aDsgaWR4ICs9IDIpXG4gICAgICAgIGFyZ0RpY3RbdGhpcy5iaW5kaW5nc1tpZHhdXSA9IHRoaXMuYmluZGluZ3NbaWR4ICsgMV1cbiAgICAgIHZhciBmb3JtYWxzID0gb2JqZWN0VXRpbHMuZm9ybWFscyhhY3Rpb24pXG4gICAgICB2YXIgYXJncyA9IGZvcm1hbHMubGVuZ3RoID09IDAgP1xuICAgICAgICBvYmplY3RVdGlscy52YWx1ZXMoYXJnRGljdCkubWFwKGZ1bmN0aW9uKGFyZykgeyByZXR1cm4gYXJnLmZvcmNlKGFjdGlvbkRpY3QpIH0pIDpcbiAgICAgICAgZm9ybWFscy5tYXAoZnVuY3Rpb24obmFtZSkgeyByZXR1cm4gYXJnRGljdFtuYW1lXS5mb3JjZShhY3Rpb25EaWN0KSB9KVxuICAgICAgcmV0dXJuIGFjdGlvbi5hcHBseShhZGRsSW5mbywgYXJncylcbiAgICB9XG4gIH0sXG5cbiAgbG9va3VwQWN0aW9uOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZVxuICAgIHZhciBhY3Rpb24gPSBhY3Rpb25EaWN0W3J1bGVOYW1lXVxuICAgIGlmIChhY3Rpb24gPT09IHVuZGVmaW5lZCAmJiBhY3Rpb25EaWN0Ll9kZWZhdWx0ICE9PSB1bmRlZmluZWQpXG4gICAgICBhY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbkRpY3QuX2RlZmF1bHQuYXBwbHkodGhpcywgW3J1bGVOYW1lXS5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpXG4gICAgICB9XG4gICAgcmV0dXJuIGFjdGlvbiB8fCBicm93c2VyLmVycm9yKCdtaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3InLCBydWxlTmFtZSlcbiAgfSxcblxuICBjcmVhdGVBZGRsSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVydmFsOiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2UsIHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBMaXN0VGh1bmsodGh1bmtzKSB7XG4gIHRoaXMudGh1bmtzID0gdGh1bmtzXG59XG5cbkxpc3RUaHVuay5wcm90b3R5cGUgPSB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgcmV0dXJuIHRoaXMudGh1bmtzLm1hcChmdW5jdGlvbih0aHVuaykgeyByZXR1cm4gdGh1bmsuZm9yY2UoYWN0aW9uRGljdCkgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBWYWx1ZVRodW5rKHZhbHVlKSB7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxufVxuXG5WYWx1ZVRodW5rLnByb3RvdHlwZSA9IHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZVxuICB9XG59XG5cbnZhciB2YWx1ZWxlc3NUaHVuayA9IG5ldyBWYWx1ZVRodW5rKHVuZGVmaW5lZClcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFR5cGVzIG9mIHBhdHRlcm5zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBHZW5lcmFsIHN0dWZmXG5cbmZ1bmN0aW9uIFBhdHRlcm4oKSB7XG4gIHRocm93ICdQYXR0ZXJuIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5QYXR0ZXJuLnByb3RvdHlwZSA9IHtcbiAgc2VtYW50aWNBY3Rpb25BcmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogdGhpbmsgYWJvdXQgdGhpcywgaXQgZG9lc24ndCBzZWVtIHJpZ2h0LlxuICAgIC8vIEUuZy4sIHN1cHBvc2UgeW91IGhhdmU6XG4gICAgLy8gICBydWxlID09IH5mb28gYmFyIHwgfmJheiBxdXhcbiAgICAvLyBCb3RoIGNob2ljZXMgYXJlIHNlcXMsIGFuZCB0aGVyZWZvcmUgaGF2ZSBubyB2YWx1ZS4gQnV0IHRoZSBydWxlJ3Mgc2VtYW50aWMgYWN0aW9uIHdpbGwgcmVxdWlyZSBvbmUuXG4gICAgdmFyIG5hbWVzID0gdGhpcy5nZXRCaW5kaW5nTmFtZXMoKVxuICAgIHJldHVybiBuYW1lcy5sZW5ndGggPiAwID8gbmFtZXMgOiBbJ3ZhbHVlJ11cbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbXVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGFic3RyYWN0LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogYWJzdHJhY3QsXG5cbiAgb3V0cHV0UmVjaXBlOiBhYnN0cmFjdFxufVxuXG4vLyBBbnl0aGluZ1xuXG52YXIgYW55dGhpbmcgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciB2YWx1ZSA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmICh2YWx1ZSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBWYWx1ZVRodW5rKHZhbHVlKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgLy8gbm8tb3BcbiAgfVxufSlcblxuLy8gUHJpbWl0aXZlc1xuXG5mdW5jdGlvbiBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5QcmltLm5ld0ZvciA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmxlbmd0aCAhPT0gMSlcbiAgICByZXR1cm4gbmV3IFN0cmluZ1ByaW0ob2JqKVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgcmV0dXJuIG5ldyBSZWdFeHBQcmltKG9iailcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUHJpbShvYmopXG59XG4gICAgXG5QcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgaWYgKHRoaXMubWF0Y2goaW5wdXRTdHJlYW0pID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFZhbHVlVGh1bmsodGhpcy5vYmopXG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gICAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iailcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuXygnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5vYmopKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG5mdW5jdGlvbiBTdHJpbmdQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5TdHJpbmdQcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSwge1xuICBtYXRjaDogZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFJlZ0V4cFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqXG59XG5cblJlZ0V4cFByaW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFByaW0ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIGlmIChpbnB1dFN0cmVhbS5tYXRjaFJlZ0V4cCh0aGlzLm9iaikgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgVmFsdWVUaHVuayhpbnB1dFN0cmVhbS5zb3VyY2Vbb3JpZ1Bvc10pXG4gIH1cbn0pXG5cbi8vIEFsdGVybmF0aW9uXG5cbmZ1bmN0aW9uIEFsdCh0ZXJtcykge1xuICB0aGlzLnRlcm1zID0gdGVybXNcbn1cblxuQWx0LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciBvcmlnTnVtQmluZGluZ3MgPSBiaW5kaW5ncy5sZW5ndGhcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChzeW50YWN0aWMpXG4gICAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy50ZXJtc1tpZHhdLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgaWYgKHZhbHVlICE9PSBmYWlsKVxuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICAgIC8vIE5vdGU6IHdoaWxlIHRoZSBmb2xsb3dpbmcgYXNzaWdubWVudCBjb3VsZCBiZSBkb25lIHVuY29uZGl0aW9uYWxseSwgb25seSBkb2luZyBpdCB3aGVuIG5lY2Vzc2FyeSBpc1xuICAgICAgICAvLyBiZXR0ZXIgZm9yIHBlcmZvcm1hbmNlLiBUaGlzIGlzIGIvYyBhc3NpZ25pbmcgdG8gYW4gYXJyYXkncyBsZW5ndGggcHJvcGVydHkgaXMgbW9yZSBleHBlbnNpdmUgdGhhbiBhXG4gICAgICAgIC8vIHR5cGljYWwgYXNzaWdubWVudC5cbiAgICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IG9yaWdOdW1CaW5kaW5ncylcbiAgICAgICAgICBiaW5kaW5ncy5sZW5ndGggPSBvcmlnTnVtQmluZGluZ3NcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgb2sgYi9jIGFsbCB0ZXJtcyBtdXN0IGhhdmUgdGhlIHNhbWUgYmluZGluZ3MgLS0gdGhpcyBwcm9wZXJ0eSBpcyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICAgIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IFtdIDogdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKVxuICAgICAgcmV0dXJuXG4gICAgdmFyIG5hbWVzID0gdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2lkeF1cbiAgICAgIHRlcm0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MoKVxuICAgICAgdmFyIG90aGVyTmFtZXMgPSB0ZXJtLmdldEJpbmRpbmdOYW1lcygpXG4gICAgICBpZiAoIWVxdWFscy5lcXVhbHMobmFtZXMsIG90aGVyTmFtZXMpKVxuICAgICAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgYW4gYWx0IHdpdGggaW5jb25zaXN0ZW50IGJpbmRpbmdzOicsIG5hbWVzLCAndnMnLCBvdGhlck5hbWVzKVxuICAgIH1cbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5hbHQoJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICB0aGlzLnRlcm1zW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnNcbn1cblxuU2VxLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKHN5bnRhY3RpYylcbiAgICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF1cbiAgICAgIHZhciB2YWx1ZSA9IGZhY3Rvci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFpbClcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlbGVzc1RodW5rXG4gIH0sXG5cbiAgc2VtYW50aWNBY3Rpb25BcmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgLy8gT3ZlcnJpZGUgUGF0dGVybidzIGltcGxlbWVudGF0aW9uLCB3aGljaCB3b3VsZCByZXR1cm4gWyd2YWx1ZSddIHdoZW4gdGhlcmUgYXJlIG5vIGJpbmRpbmdzLlxuICAgIHJldHVybiB0aGlzLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmFtZXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5mYWN0b3JzW2lkeF0uZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuXG4gICAgdmFyIGR1cGxpY2F0ZXMgPSBnZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3J1bGUnLCBydWxlTmFtZSwgJ2hhcyBkdXBsaWNhdGUgYmluZGluZ3M6JywgZHVwbGljYXRlcylcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLnNlcSgnKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgdGhpcy5mYWN0b3JzW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gQmluZGluZ3NcblxuZnVuY3Rpb24gQmluZChleHByLCBuYW1lKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbiAgdGhpcy5uYW1lID0gbmFtZVxufVxuXG5CaW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgaWYgKHZhbHVlICE9PSBmYWlsKVxuICAgICAgYmluZGluZ3MucHVzaCh0aGlzLm5hbWUsIHZhbHVlKVxuICAgIHJldHVybiB2YWx1ZVxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFt0aGlzLm5hbWVdXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmJpbmQoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykge1xuICB0aGlzLmV4cHIgPSBleHByXG4gIHRoaXMubWluTnVtTWF0Y2hlcyA9IG1pbk51bU1hdGNoZXNcbn1cblxuTWFueS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG1hdGNoZXMgPSBbXVxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgYmFja3RyYWNrUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgICBpZiAodmFsdWUgPT09IGZhaWwpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gYmFja3RyYWNrUG9zXG4gICAgICAgIGJyZWFrXG4gICAgICB9IGVsc2VcbiAgICAgICAgbWF0Y2hlcy5wdXNoKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gbWF0Y2hlcy5sZW5ndGggPCB0aGlzLm1pbk51bU1hdGNoZXMgPyAgZmFpbCA6IG5ldyBMaXN0VGh1bmsobWF0Y2hlcylcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IubWFueSgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHdzLm5leHRQdXRBbGwodGhpcy5taW5OdW1NYXRjaGVzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbk9wdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgaWYgKHZhbHVlID09PSBmYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICByZXR1cm4gdmFsdWVsZXNzVGh1bmtcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBuZXcgTGlzdFRodW5rKFt2YWx1ZV0pXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLm9wdCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFByZWRpY2F0ZXNcblxuZnVuY3Rpb24gTm90KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5Ob3QucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICByZXR1cm4gdmFsdWVsZXNzVGh1bmtcbiAgICB9XG4gIH0sXG5cbiAgc2VtYW50aWNBY3Rpb25BcmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgLy8gT3ZlcnJpZGUgUGF0dGVybidzIGltcGxlbWVudGF0aW9uLCB3aGljaCB3b3VsZCByZXR1cm4gWyd2YWx1ZSddIGluc3RlYWQuXG4gICAgcmV0dXJuIFtdXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLm5vdCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTG9va2FoZWFkLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICBpZiAodmFsdWUgIT09IGZhaWwpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IubGEoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBTdHJpbmcgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBTdHIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cblN0ci5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBzdHJpbmcgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBzdHJpbmdJbnB1dFN0cmVhbSA9IG5ldyBTdHJpbmdJbnB1dFN0cmVhbShzdHJpbmcpXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBzdHJpbmdJbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICByZXR1cm4gdmFsdWUgIT09IGZhaWwgJiYgc3RyaW5nSW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgVmFsdWVUaHVuayhzdHJpbmcpIDogZmFpbFxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iuc3RyKCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gTGlzdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIExpc3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbkxpc3QucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgbGlzdCA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmIChsaXN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHZhciBsaXN0SW5wdXRTdHJlYW0gPSBuZXcgTGlzdElucHV0U3RyZWFtKGxpc3QpXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBsaXN0SW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgcmV0dXJuIHZhbHVlICE9PSBmYWlsICYmIGxpc3RJbnB1dFN0cmVhbS5hdEVuZCgpID8gIG5ldyBWYWx1ZVRodW5rKGxpc3QpIDogZmFpbFxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IubHN0KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gT2JqZWN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gT2JqKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICB2YXIgbmFtZXMgPSBwcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkgeyByZXR1cm4gcHJvcGVydHkubmFtZSB9KVxuICB2YXIgZHVwbGljYXRlcyA9IGdldER1cGxpY2F0ZXMobmFtZXMpXG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgYnJvd3Nlci5lcnJvcignb2JqZWN0IHBhdHRlcm4gaGFzIGR1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lczonLCBkdXBsaWNhdGVzKVxuICBlbHNlIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzXG4gICAgdGhpcy5pc0xlbmllbnQgPSBpc0xlbmllbnRcbiAgfVxufVxuXG5PYmoucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKG9iaiAhPT0gZmFpbCAmJiBvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICB2YXIgbnVtT3duUHJvcGVydGllc01hdGNoZWQgPSAwXG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXNbaWR4XVxuICAgICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV1cbiAgICAgICAgdmFyIHZhbHVlSW5wdXRTdHJlYW0gPSBuZXcgTGlzdElucHV0U3RyZWFtKFt2YWx1ZV0pXG4gICAgICAgIHZhciBtYXRjaGVkID1cbiAgICAgICAgICBwcm9wZXJ0eS5wYXR0ZXJuLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgdmFsdWVJbnB1dFN0cmVhbSwgYmluZGluZ3MpICE9PSBmYWlsICYmIHZhbHVlSW5wdXRTdHJlYW0uYXRFbmQoKVxuICAgICAgICBpZiAoIW1hdGNoZWQpXG4gICAgICAgICAgcmV0dXJuIGZhaWxcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKSlcbiAgICAgICAgICBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCsrXG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5pc0xlbmllbnQgfHwgbnVtT3duUHJvcGVydGllc01hdGNoZWQgPT09IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID9cbiAgICAgICAgbmV3IFZhbHVlVGh1bmsob2JqKSA6XG4gICAgICAgIGZhaWxcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmFtZXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICByZXR1cm4gbmFtZXMuc29ydCgpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcblxuICAgIHZhciBkdXBsaWNhdGVzID0gZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgYW4gb2JqZWN0IHBhdHRlcm4gd2l0aCBkdXBsaWNhdGUgYmluZGluZ3M6JywgZHVwbGljYXRlcylcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIGZ1bmN0aW9uIG91dHB1dFByb3BlcnR5UmVjaXBlKHByb3ApIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJ3tuYW1lOiAnKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyhwcm9wLm5hbWUpKVxuICAgICAgd3MubmV4dFB1dEFsbCgnLCBwYXR0ZXJuOiAnKVxuICAgICAgcHJvcC5wYXR0ZXJuLm91dHB1dFJlY2lwZSh3cylcbiAgICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICAgIH1cblxuICAgIHdzLm5leHRQdXRBbGwoJ2Iub2JqKFsnKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgb3V0cHV0UHJvcGVydHlSZWNpcGUodGhpcy5wcm9wZXJ0aWVzW2lkeF0pXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10sICcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyghIXRoaXMuaXNMZW5pZW50KSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gUnVsZSBhcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBBcHBseShydWxlTmFtZSkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWVcbn1cblxuQXBwbHkucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWVcbiAgICB2YXIgb3JpZ1Bvc0luZm8gPSBpbnB1dFN0cmVhbS5nZXRDdXJyZW50UG9zSW5mbygpXG4gICAgdmFyIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXVxuICAgIGlmIChtZW1vUmVjKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBtZW1vUmVjLnBvc1xuICAgICAgcmV0dXJuIG1lbW9SZWMudmFsdWVcbiAgICB9IGVsc2UgaWYgKG9yaWdQb3NJbmZvLmlzQWN0aXZlKHJ1bGVOYW1lKSkge1xuICAgICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKVxuICAgICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uICYmIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvc1xuICAgICAgICByZXR1cm4gY3VycmVudExlZnRSZWN1cnNpb24udmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yaWdQb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbihydWxlTmFtZSlcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSBydWxlRGljdFtydWxlTmFtZV0gfHwgYnJvd3Nlci5lcnJvcigndW5kZWZpbmVkIHJ1bGUnLCBydWxlTmFtZSlcbiAgICAgIG9yaWdQb3NJbmZvLmVudGVyKHJ1bGVOYW1lKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24pIHtcbiAgICAgICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmhhbmRsZUxlZnRSZWN1cnNpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zSW5mby5wb3MsIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLCB2YWx1ZSlcbiAgICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgICB9XG4gICAgICB9IGVsc2VcbiAgICAgICAgLy8gT25seSBtZW1vaXppbmcgbm9uLWxlZnQgcmVjdXJzaXZlIHJ1bGVzIGZvciBub3cuXG4gICAgICAgIC8vIFRPRE86IHNob3VsZCBiZSBvayB0byBtZW1vaXplIHRoZSBoZWFkIHJ1bGUsIGFzIGxvbmcgYXMgaXQgY2FuIHByZXRlbmQgbm90IHRvIGJlIG1lbW9pemVkIHdoZW5cbiAgICAgICAgLy8gaW52b2x2ZWQgcnVsZXMgYXJlIGNhbGxlZCBhcyBoZWFkcyBvZiBuZXcgbGVmdCByZWN1cnNpb25zLiBDb21lIHVwIHdpdGggYW4gZWZmaWNpZW50IHdheSB0byBkbyB0aGlzLlxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfVxuICAgICAgb3JpZ1Bvc0luZm8uZXhpdChydWxlTmFtZSlcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfSxcblxuICBldmFsT25jZTogZnVuY3Rpb24oZXhwciwgcnVsZURpY3QsIGlucHV0U3RyZWFtKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgYmluZGluZ3MgPSBbXVxuICAgIHZhciB2YWx1ZSA9IGV4cHIuZXZhbChpc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgUnVsZVRodW5rKHRoaXMucnVsZU5hbWUsIGlucHV0U3RyZWFtLnNvdXJjZSwgb3JpZ1BvcywgaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZSwgYmluZGluZ3MpXG4gIH0sXG5cbiAgaGFuZGxlTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zLCBjdXJyZW50TGVmdFJlY3Vyc2lvbiwgc2VlZFZhbHVlKSB7XG4gICAgdmFyIHZhbHVlID0gc2VlZFZhbHVlXG4gICAgaWYgKHNlZWRWYWx1ZSAhPT0gZmFpbCkge1xuICAgICAgY3VycmVudExlZnRSZWN1cnNpb24udmFsdWUgPSBzZWVkVmFsdWVcbiAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgICBpZiAodmFsdWUgIT09IGZhaWwgJiYgaW5wdXRTdHJlYW0ucG9zID4gY3VycmVudExlZnRSZWN1cnNpb24ucG9zKSB7XG4gICAgICAgICAgY3VycmVudExlZnRSZWN1cnNpb24udmFsdWUgPSB2YWx1ZVxuICAgICAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY3VycmVudExlZnRSZWN1cnNpb24udmFsdWVcbiAgICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3NcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5hcHAoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMucnVsZU5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBSdWxlIGV4cGFuc2lvbiAtLSBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gX0V4cGFuZChydWxlTmFtZSwgZ3JhbW1hcikge1xuICBpZiAoZ3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICBicm93c2VyLmVycm9yKCdncmFtbWFyJywgZ3JhbW1hci5uYW1lLCAnZG9lcyBub3QgaGF2ZSBhIHJ1bGUgY2FsbGVkJywgcnVsZU5hbWUpXG4gIGVsc2Uge1xuICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXJcbiAgfVxufVxuXG5fRXhwYW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgfSxcblxuICBleHBhbnNpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV1cbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cGFuc2lvbigpLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgLy8gbm8tb3BcbiAgfVxufSlcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdyYW1tYXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIocnVsZURpY3QpIHtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0XG59XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBydWxlRGljdDogbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuXyA9IGFueXRoaW5nXG4gICAgdGhpcy5lbmQgPSBuZXcgTm90KHRoaXMuXylcbiAgICB0aGlzLnNwYWNlID0gUHJpbS5uZXdGb3IoL1tcXHNdLylcbiAgICB0aGlzLnNwYWNlcyA9IG5ldyBNYW55KG5ldyBBcHBseSgnc3BhY2UnKSwgMClcbiAgICB0aGlzLmFsbnVtID0gUHJpbS5uZXdGb3IoL1swLTlhLXpBLVpdLylcbiAgICB0aGlzLmxldHRlciA9IFByaW0ubmV3Rm9yKC9bYS16QS1aXS8pXG4gICAgdGhpcy5sb3dlciA9IFByaW0ubmV3Rm9yKC9bYS16XS8pXG4gICAgdGhpcy51cHBlciA9IFByaW0ubmV3Rm9yKC9bQS1aXS8pXG4gICAgdGhpcy5kaWdpdCA9IFByaW0ubmV3Rm9yKC9bMC05XS8pXG4gICAgdGhpcy5oZXhEaWdpdCA9IFByaW0ubmV3Rm9yKC9bMC05YS1mQS1GXS8pXG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hDb250ZW50cyhbb2JqXSwgc3RhcnRSdWxlKVxuICB9LFxuXG4gIG1hdGNoQ29udGVudHM6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKG9iailcbiAgICB2YXIgdGh1bmsgPSBuZXcgQXBwbHkoc3RhcnRSdWxlKS5ldmFsKHVuZGVmaW5lZCwgdGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZClcbiAgICBpZiAoaXNTeW50YWN0aWMoc3RhcnRSdWxlKSlcbiAgICAgIHNraXBTcGFjZXModGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaCA9IHRoaXMuYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoLmJpbmQodGhpcylcbiAgICByZXR1cm4gdGh1bmsgPT09IGZhaWwgfHwgIWlucHV0U3RyZWFtLmF0RW5kKCkgP1xuICAgICAgZmFsc2UgOlxuICAgICAgZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgICAgICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2goYWN0aW9uRGljdClcbiAgICAgICAgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QpXG4gICAgICB9XG4gIH0sXG5cbiAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHJ1bGVEaWN0ID0gdGhpcy5ydWxlRGljdFxuICAgIHZhciBvayA9IHRydWVcbiAgICBvYmplY3RVdGlscy5rZXlzQW5kVmFsdWVzRG8ocnVsZURpY3QsIGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgICBpZiAoYWN0aW9uRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuXG4gICAgICB2YXIgYWN0dWFsID0gb2JqZWN0VXRpbHMuZm9ybWFscyhhY3Rpb25EaWN0W3J1bGVOYW1lXSkuc29ydCgpXG4gICAgICB2YXIgZXhwZWN0ZWQgPSBib2R5LnNlbWFudGljQWN0aW9uQXJnTmFtZXMoKVxuICAgICAgaWYgKCFlcXVhbHMuZXF1YWxzKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgICAgIG9rID0gZmFsc2VcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbWFudGljIGFjdGlvbiBmb3IgcnVsZScsIHJ1bGVOYW1lLCAnaGFzIHRoZSB3cm9uZyBhcmd1bWVudCBuYW1lcycpXG4gICAgICAgIGNvbnNvbGUubG9nKCcgIGV4cGVjdGVkJywgZXhwZWN0ZWQpXG4gICAgICAgIGNvbnNvbGUubG9nKCcgICAgYWN0dWFsJywgYWN0dWFsKVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKCFvaylcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ29uZSBvciBtb3JlIHNlbWFudGljIGFjdGlvbnMgaGF2ZSB0aGUgd3JvbmcgYXJndW1lbnQgbmFtZXMgLS0gc2VlIGNvbnNvbGUgZm9yIGRldGFpbHMnKVxuICB9LFxuXG4gIHRvUmVjaXBlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgd3MgPSBuZXcgb2JqZWN0VXRpbHMuU3RyaW5nQnVmZmVyKClcbiAgICB3cy5uZXh0UHV0QWxsKCcoZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJyAgdmFyIGIgPSBvaG0uYnVpbGRlcigpXFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCcgIGIuc2V0TmFtZSgnKTsgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLm5hbWUpKTsgd3MubmV4dFB1dEFsbCgnKVxcbicpXG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUgJiYgdGhpcy5zdXBlckdyYW1tYXIubmFtZXNwYWNlTmFtZSkge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICBiLnNldFN1cGVyR3JhbW1hcihvaG0ubmFtZXNwYWNlKCcpXG4gICAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWVzcGFjZU5hbWUpKVxuICAgICAgd3MubmV4dFB1dEFsbCgnKS5nZXRHcmFtbWFyKCcpXG4gICAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpKVxuICAgICAgd3MubmV4dFB1dEFsbCgnKSlcXG4nKVxuICAgIH1cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnJ1bGVEZWNscy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcgICcpXG4gICAgICB0aGlzLnJ1bGVEZWNsc1tpZHhdLm91dHB1dFJlY2lwZSh3cylcbiAgICAgIHdzLm5leHRQdXRBbGwoJ1xcbicpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJyAgcmV0dXJuIGIuYnVpbGQob3B0TmFtZXNwYWNlKVxcbicpXG4gICAgd3MubmV4dFB1dEFsbCgnfSknKVxuICAgIHJldHVybiB3cy5jb250ZW50cygpXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJ1aWxkZXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFJ1bGVEZWNsKCkge1xuICB0aHJvdyAnUnVsZURlY2wgY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnXG59XG5cblJ1bGVEZWNsLnByb3RvdHlwZSA9IHtcbiAgcGVyZm9ybUNoZWNrczogYWJzdHJhY3QsXG5cbiAgcGVyZm9ybUNvbW1vbkNoZWNrczogZnVuY3Rpb24obmFtZSwgYm9keSkge1xuICAgIGJvZHkuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhuYW1lKVxuICAgIGJvZHkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MobmFtZSlcbiAgfSxcblxuICBpbnN0YWxsOiBmdW5jdGlvbihydWxlRGljdCkge1xuICAgIHJ1bGVEaWN0W3RoaXMubmFtZV0gPSB0aGlzLmJvZHlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi4nKVxuICAgIHdzLm5leHRQdXRBbGwodGhpcy5raW5kKVxuICAgIHdzLm5leHRQdXRBbGwoJygnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgdGhpcy5ib2R5Lm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufVxuXG5mdW5jdGlvbiBEZWZpbmUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5EZWZpbmUucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnZGVmaW5lJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2Nhbm5vdCBkZWZpbmUgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJyxcbiAgICAgICAgICAgICAgICAgICAgJyh0cnkgb3ZlcnJpZGUgb3IgZXh0ZW5kIGluc3RlYWQuKScpXG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5ib2R5KVxuICB9XG59KVxuXG5mdW5jdGlvbiBPdmVycmlkZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbk92ZXJyaWRlLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ292ZXJyaWRlJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3Qgb3ZlcnJpZGUgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJyxcbiAgICAgICAgICAgICAgICAgICAgJyh0cnkgZGVmaW5lIGluc3RlYWQuKScpXG4gICAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIElubGluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbklubGluZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdpbmxpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIHJlbGF4aW5nIHRoaXMgY2hlY2ssIGUuZy4sIG1ha2UgaXQgb2sgdG8gb3ZlcnJpZGUgYW4gaW5saW5lIHJ1bGUgaWYgdGhlIG5lc3RpbmcgcnVsZSBpc1xuICAgIC8vIGFuIG92ZXJyaWRlLiBCdXQgb25seSBpZiB0aGUgaW5saW5lIHJ1bGUgdGhhdCdzIGJlaW5nIG92ZXJyaWRkZW4gaXMgbmVzdGVkIGluc2lkZSB0aGUgbmVzdGluZyBydWxlIHRoYXRcbiAgICAvLyB3ZSdyZSBvdmVycmlkaW5nPyBIb3BlZnVsbHkgdGhlcmUncyBhIG11Y2ggbGVzcyBjb21wbGljYXRlZCB3YXkgdG8gZG8gdGhpcyA6KVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGRlZmluZSBpbmxpbmUgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIEV4dGVuZChuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuZXhwYW5kZWRCb2R5ID0gbmV3IEFsdChbYm9keSwgbmV3IF9FeHBhbmQobmFtZSwgc3VwZXJHcmFtbWFyKV0pXG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbkV4dGVuZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdleHRlbmQnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2Nhbm5vdCBleHRlbmQgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJyxcbiAgICAgICAgICAgICAgICAgICAgJyh0cnkgZGVmaW5lIGluc3RlYWQuKScpXG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5leHBhbmRlZEJvZHkpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5leHBhbmRlZEJvZHlcbiAgfVxufSlcblxuZnVuY3Rpb24gQnVpbGRlcigpIHtcbiAgdGhpcy5pbml0KClcbn1cblxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubmFtZSA9IHVuZGVmaW5lZFxuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gR3JhbW1hci5wcm90b3R5cGVcbiAgICB0aGlzLnJ1bGVEZWNscyA9IFtdXG4gIH0sXG5cbiAgc2V0TmFtZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgfSxcblxuICBzZXRTdXBlckdyYW1tYXI6IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IGdyYW1tYXJcbiAgfSxcblxuICBkZWZpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgRGVmaW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgb3ZlcnJpZGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgT3ZlcnJpZGUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBpbmxpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgSW5saW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gICAgcmV0dXJuIHRoaXMuYXBwKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGV4dGVuZDogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBFeHRlbmQocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBidWlsZDogZnVuY3Rpb24ob3B0TmFtZXNwYWNlKSB7XG4gICAgdmFyIHN1cGVyR3JhbW1hciA9IHRoaXMuc3VwZXJHcmFtbWFyXG4gICAgdmFyIHJ1bGVEaWN0ID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKHN1cGVyR3JhbW1hci5ydWxlRGljdClcbiAgICB0aGlzLnJ1bGVEZWNscy5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVEZWNsKSB7XG4gICAgICBydWxlRGVjbC5wZXJmb3JtQ2hlY2tzKClcbiAgICAgIHJ1bGVEZWNsLmluc3RhbGwocnVsZURpY3QpXG4gICAgfSlcblxuICAgIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIocnVsZURpY3QpXG4gICAgZ3JhbW1hci5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbiAgICBncmFtbWFyLnJ1bGVEZWNscyA9IHRoaXMucnVsZURlY2xzXG4gICAgaWYgKHRoaXMubmFtZSkge1xuICAgICAgZ3JhbW1hci5uYW1lID0gdGhpcy5uYW1lXG4gICAgICBpZiAob3B0TmFtZXNwYWNlKSB7XG4gICAgICAgIGdyYW1tYXIubmFtZXNwYWNlTmFtZSA9IG9wdE5hbWVzcGFjZS5uYW1lXG4gICAgICAgIG9wdE5hbWVzcGFjZS5pbnN0YWxsKHRoaXMubmFtZSwgZ3JhbW1hcilcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pbml0KClcbiAgICByZXR1cm4gZ3JhbW1hclxuICB9LFxuXG4gIF86IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFByaW0ubmV3Rm9yKHgpIH0sXG4gIGFsdDogZnVuY3Rpb24oLyogdGVybTEsIHRlcm0xLCAuLi4gKi8pIHtcbiAgICB2YXIgdGVybXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBBbHQpXG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcylcbiAgICAgIGVsc2VcbiAgICAgICAgdGVybXMucHVzaChhcmcpXG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT0gMSA/IHRlcm1zWzBdIDogbmV3IEFsdCh0ZXJtcylcbiAgfSxcbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFNlcSlcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKVxuICAgICAgZWxzZVxuICAgICAgICBmYWN0b3JzLnB1c2goYXJnKVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgU2VxKGZhY3RvcnMpXG4gIH0sXG4gIGJpbmQ6IGZ1bmN0aW9uKGV4cHIsIG5hbWUpIHsgcmV0dXJuIG5ldyBCaW5kKGV4cHIsIG5hbWUpIH0sXG4gIG1hbnk6IGZ1bmN0aW9uKGV4cHIsIG1pbk51bU1hdGNoZXMpIHsgcmV0dXJuIG5ldyBNYW55KGV4cHIsIG1pbk51bU1hdGNoZXMpIH0sXG4gIG9wdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IE9wdChleHByKSB9LFxuICBub3Q6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBOb3QoZXhwcikgfSxcbiAgbGE6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBMb29rYWhlYWQoZXhwcikgfSxcbiAgc3RyOiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgU3RyKGV4cHIpIH0sXG4gIGxzdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IExpc3QoZXhwcikgfSxcbiAgb2JqOiBmdW5jdGlvbihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHsgcmV0dXJuIG5ldyBPYmoocHJvcGVydGllcywgISFpc0xlbmllbnQpIH0sXG4gIGFwcDogZnVuY3Rpb24ocnVsZU5hbWUpIHsgcmV0dXJuIG5ldyBBcHBseShydWxlTmFtZSkgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTmFtZXNwYWNlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG5hbWVzcGFjZXMgPSB7fVxuXG5mdW5jdGlvbiBOYW1lc3BhY2UobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuZ3JhbW1hcnMgPSB7fVxufVxuXG5OYW1lc3BhY2UucHJvdG90eXBlID0ge1xuICBpbnN0YWxsOiBmdW5jdGlvbihuYW1lLCBncmFtbWFyKSB7XG4gICAgaWYgKHRoaXMuZ3JhbW1hcnNbbmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdkdXBsaWNhdGUgZGVjbGFyYXRpb24gb2YgZ3JhbW1hcicsIG5hbWUsICdpbiBuYW1lc3BhY2UnLCB0aGlzLm5hbWUpXG4gICAgZWxzZVxuICAgICAgdGhpcy5ncmFtbWFyc1tuYW1lXSA9IGdyYW1tYXJcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuXG4gIGdldEdyYW1tYXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFtbWFyc1tuYW1lXSB8fCBicm93c2VyLmVycm9yKCdvaG0gbmFtZXNwYWNlJywgdGhpcy5uYW1lLCAnaGFzIG5vIGdyYW1tYXIgY2FsbGVkJywgbmFtZSlcbiAgfSxcblxuICBsb2FkR3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGJyb3dzZXIuc2FuaXR5Q2hlY2soJ3NjcmlwdCB0YWdcXCdzIHR5cGUgYXR0cmlidXRlIG11c3QgYmUgXCJ0ZXh0L29obS1qc1wiJywgZWxlbWVudC50eXBlID09PSAndGV4dC9vaG0tanMnKVxuICAgIG1ha2VHcmFtbWFycyhlbGVtZW50LmlubmVySFRNTCwgdGhpcylcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBGYWN0b3JpZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyQWN0aW9uRGljdChvcHROYW1lc3BhY2UpIHtcbiAgdmFyIGJ1aWxkZXJcbiAgcmV0dXJuIHtcbiAgICBzcGFjZTogZnVuY3Rpb24odmFsdWUpIHt9LFxuXG4gICAgX25hbWU6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cygpIH0sXG4gICAgbmFtZUZpcnN0OiBmdW5jdGlvbih2YWx1ZSkge30sXG4gICAgbmFtZVJlc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7fSxcblxuICAgIG5hbWU6IGZ1bmN0aW9uKG4pIHsgcmV0dXJuIG4gfSxcblxuICAgIG5hbWVkQ29uc3Q6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICduYW1lZENvbnN0LXVuZGVmaW5lZCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdW5kZWZpbmVkIH0sXG4gICAgJ25hbWVkQ29uc3QtbnVsbCc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbnVsbCB9LFxuICAgICduYW1lZENvbnN0LXRydWUnOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRydWUgfSxcbiAgICAnbmFtZWRDb25zdC1mYWxzZSc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2UgfSxcblxuICAgIHN0cmluZzogZnVuY3Rpb24oY3MpIHsgcmV0dXJuIGNzLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiBzdHJpbmdVdGlscy51bmVzY2FwZUNoYXIoYykgfSkuam9pbignJykgfSxcbiAgICBzQ2hhcjogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHMoKSB9LFxuICAgIHJlZ2V4cDogZnVuY3Rpb24oZSkgeyByZXR1cm4gbmV3IFJlZ0V4cChlKSB9LFxuICAgIHJlQ2hhckNsYXNzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHMoKSB9LFxuICAgIG51bWJlcjogZnVuY3Rpb24oKSB7IHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKCkpIH0sXG5cbiAgICBBbHQ6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdBbHQtcmVjJzogZnVuY3Rpb24oeCwgeSkgeyByZXR1cm4gYnVpbGRlci5hbHQoeCwgeSkgfSxcblxuICAgIFRlcm06IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdUZXJtLWlubGluZSc6IGZ1bmN0aW9uKHgsIG4pIHsgcmV0dXJuIGJ1aWxkZXIuaW5saW5lKGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lICsgJy0nICsgbiwgeCkgfSxcblxuICAgIFNlcTogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIGJ1aWxkZXIuc2VxLmFwcGx5KGJ1aWxkZXIsIHZhbHVlKSB9LFxuXG4gICAgRmFjdG9yOiBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgfSxcbiAgICAnRmFjdG9yLWJpbmQnOiBmdW5jdGlvbih4LCBuKSB7IHJldHVybiBidWlsZGVyLmJpbmQoeCwgbikgfSxcblxuICAgIEl0ZXI6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdJdGVyLXN0YXInOiBmdW5jdGlvbih4KSB7IHJldHVybiBidWlsZGVyLm1hbnkoeCwgMCkgfSxcbiAgICAnSXRlci1wbHVzJzogZnVuY3Rpb24oeCkgeyByZXR1cm4gYnVpbGRlci5tYW55KHgsIDEpIH0sXG4gICAgJ0l0ZXItb3B0JzogZnVuY3Rpb24oeCkgeyByZXR1cm4gYnVpbGRlci5vcHQoeCkgfSxcblxuICAgIFByZWQ6IGZ1bmN0aW9uKHZhbHVlKSB7IHJldHVybiB2YWx1ZSB9LFxuICAgICdQcmVkLW5vdCc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIubm90KHgpIH0sXG4gICAgJ1ByZWQtbG9va2FoZWFkJzogZnVuY3Rpb24oeCkgeyByZXR1cm4gYnVpbGRlci5sYSh4KSB9LFxuXG4gICAgQmFzZTogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlIH0sXG4gICAgJ0Jhc2UtdW5kZWZpbmVkJzogZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8odW5kZWZpbmVkKSB9LFxuICAgICdCYXNlLW51bGwnOiBmdW5jdGlvbigpIHsgcmV0dXJuIGJ1aWxkZXIuXyhudWxsKSB9LFxuICAgICdCYXNlLXRydWUnOiBmdW5jdGlvbigpIHsgcmV0dXJuIGJ1aWxkZXIuXyh0cnVlKSB9LFxuICAgICdCYXNlLWZhbHNlJzogZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8oZmFsc2UpIH0sXG4gICAgJ0Jhc2UtYXBwbGljYXRpb24nOiBmdW5jdGlvbihydWxlTmFtZSkgeyByZXR1cm4gYnVpbGRlci5hcHAocnVsZU5hbWUpIH0sXG4gICAgJ0Jhc2UtcHJpbSc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIuXyh4KSB9LFxuICAgICdCYXNlLWxzdCc6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGJ1aWxkZXIubHN0KHgpIH0sXG4gICAgJ0Jhc2Utc3RyJzogZnVuY3Rpb24oeCkgeyByZXR1cm4gYnVpbGRlci5zdHIoeCkgfSxcbiAgICAnQmFzZS1wYXJlbic6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggfSxcbiAgICAnQmFzZS1vYmonOiBmdW5jdGlvbihsZW5pZW50KSB7IHJldHVybiBidWlsZGVyLm9iaihbXSwgbGVuaWVudCkgfSxcbiAgICAnQmFzZS1vYmpXaXRoUHJvcHMnOiBmdW5jdGlvbihwcywgbGVuaWVudCkgeyByZXR1cm4gYnVpbGRlci5vYmoocHMsIGxlbmllbnQpIH0sXG5cbiAgICBQcm9wczogZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlIH0sXG4gICAgJ1Byb3BzLWJhc2UnOiBmdW5jdGlvbihwKSB7IHJldHVybiBbcF0gfSxcbiAgICAnUHJvcHMtcmVjJzogZnVuY3Rpb24ocCwgcHMpIHsgcmV0dXJuIFtwXS5jb25jYXQocHMpIH0sXG4gICAgUHJvcDogZnVuY3Rpb24obiwgcCkgeyByZXR1cm4ge25hbWU6IG4sIHBhdHRlcm46IHB9IH0sXG5cbiAgICBSdWxlOiBmdW5jdGlvbih2YWx1ZSkge30sXG4gICAgJ1J1bGUtZGVmaW5lJzogZnVuY3Rpb24obiwgYikgeyByZXR1cm4gYnVpbGRlci5kZWZpbmUobiwgYikgfSxcbiAgICAnUnVsZS1vdmVycmlkZSc6IGZ1bmN0aW9uKG4sIGIpIHsgcmV0dXJuIGJ1aWxkZXIub3ZlcnJpZGUobiwgYikgfSxcbiAgICAnUnVsZS1leHRlbmQnOiBmdW5jdGlvbihuLCBiKSB7IHJldHVybiBidWlsZGVyLmV4dGVuZChuLCBiKSB9LFxuICAgIFJ1bGVOYW1lOiBmdW5jdGlvbih2YWx1ZSkgeyBidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSA9IHZhbHVlOyByZXR1cm4gdmFsdWUgfSxcblxuICAgIFN1cGVyR3JhbW1hcjogZnVuY3Rpb24odmFsdWUpIHsgYnVpbGRlci5zZXRTdXBlckdyYW1tYXIodmFsdWUpIH0sXG4gICAgJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnOiBmdW5jdGlvbihucywgbikgeyByZXR1cm4gb2htLm5hbWVzcGFjZShucykuZ2V0R3JhbW1hcihuKSB9LFxuICAgICdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnOiBmdW5jdGlvbihuKSB7IHJldHVybiBvcHROYW1lc3BhY2UuZ2V0R3JhbW1hcihuKSB9LFxuXG4gICAgR3JhbW1hcjogZnVuY3Rpb24obiwgcywgcnMpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLmJ1aWxkKG9wdE5hbWVzcGFjZSlcbiAgICB9LFxuICAgIEdyYW1tYXJzOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSxcbiAgICBHcmFtbWFyTmFtZTogZnVuY3Rpb24odmFsdWUpIHsgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7IGJ1aWxkZXIuc2V0TmFtZSh2YWx1ZSk7IHJldHVybiB2YWx1ZSB9XG4gIH1cbn1cblxudmFyIGZpcnN0ID0gdHJ1ZVxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCB3aGF0SXRJcywgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciB0aHVuayA9IHRoaXNNb2R1bGUuX29obUdyYW1tYXIubWF0Y2hDb250ZW50cyhzb3VyY2UsIHdoYXRJdElzKVxuICBpZiAodGh1bmspXG4gICAgcmV0dXJuIHRodW5rKG1ha2VHcmFtbWFyQWN0aW9uRGljdChvcHROYW1lc3BhY2UpKVxuICBlbHNlXG4gICAgLy8gVE9ETzogaW1wcm92ZSBlcnJvciBtZXNzYWdlIChzaG93IHdoYXQgcGFydCBvZiB0aGUgaW5wdXQgaXMgd3JvbmcsIHdoYXQgd2FzIGV4cGVjdGVkLCBldGMuKVxuICAgIGJyb3dzZXIuZXJyb3IoJ2ludmFsaWQgaW5wdXQgaW46Jywgc291cmNlKVxufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICByZXR1cm4gY29tcGlsZUFuZExvYWQoc291cmNlLCAnR3JhbW1hcicsIG9wdE5hbWVzcGFjZSlcbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFycycsIG9wdE5hbWVzcGFjZSlcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFB1YmxpYyBtZXRob2RzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5cbnRoaXNNb2R1bGUubmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAobmFtZXNwYWNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgIG5hbWVzcGFjZXNbbmFtZV0gPSBuZXcgTmFtZXNwYWNlKG5hbWUpXG4gIHJldHVybiBuYW1lc3BhY2VzW25hbWVdXG59XG5cbnRoaXNNb2R1bGUubWFrZUdyYW1tYXIgPSBtYWtlR3JhbW1hclxudGhpc01vZHVsZS5tYWtlR3JhbW1hcnMgPSBtYWtlR3JhbW1hcnNcblxuLy8gU3R1ZmYgdGhhdCdzIG9ubHkgdXNlZnVsIGZvciBib290c3RyYXBwaW5nLCB0ZXN0aW5nLCBldGMuXG5cbi8vIFRPRE86IHJlbmFtZSB0byBfYnVpbGRlclxudGhpc01vZHVsZS5idWlsZGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQnVpbGRlcigpXG59XG5cbnRoaXNNb2R1bGUuX21ha2VHcmFtbWFyQWN0aW9uRGljdCA9IG1ha2VHcmFtbWFyQWN0aW9uRGljdFxuXG52YXIgb2htR3JhbW1hclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXNNb2R1bGUsICdfb2htR3JhbW1hcicsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW9obUdyYW1tYXIpXG4gICAgICBvaG1HcmFtbWFyID0gdGhpcy5fb2htR3JhbW1hckZhY3RvcnkodGhpcylcbiAgICByZXR1cm4gb2htR3JhbW1hclxuICB9XG59KVxuXG4iXX0=
(7)
});
