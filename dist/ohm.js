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

exports.stringBuffer = function() {
  return new StringBuffer()
}

function ColumnStringBuffer() {
  this.lines = []
  this.newLine()
}

ColumnStringBuffer.prototype = {
  nextPutAll: function(s) {
    this.currentColumn().push(s)
  },

  contents: function() {
    // Convert columns from lists of strings to strings, and record column lengths
    var columnLengths = []
    this.lines.forEach(function(line) {
      for (var colIdx = 0; colIdx < line.length; colIdx++) {
        var column = line[colIdx]
        line[colIdx] = column.join('')
        if (columnLengths[colIdx] === undefined || columnLengths[colIdx] < line[colIdx].length)
          columnLengths[colIdx] = line[colIdx].length
      }
    })

    var sb = thisModule.stringBuffer()
    this.lines.forEach(function(line) {
      for (var colIdx = 0; colIdx < line.length; colIdx++) {
        var column = line[colIdx]
        sb.nextPutAll(column)
        var numSpaces = columnLengths[colIdx] - column.length
        while (numSpaces-- > 0)
          sb.nextPutAll(' ')
      }
      sb.nextPutAll('\n')
    })
    return sb.contents()
  },

  newLine: function() {
    this.lines.push([])
    this.newColumn()
  },

  newColumn: function() {
    this.currentLine().push([])
  },

  currentColumn: function() {
    var line = this.currentLine()
    return line[line.length - 1]
  },

  currentLine: function() {
    return this.lines[this.lines.length - 1]
  }
}

exports.columnStringBuffer = function() {
  return new ColumnStringBuffer()
}


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
  var ws = objectUtils.stringBuffer()
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

Object.defineProperties(Interval.prototype, {
  'contents': {
    get: function() {
      if (this._contents === undefined)
        this._contents = InputStream.newFor(this.source).interval(this.startIdx, this.endIdx)
      return this._contents
    },
    enumerable: true
  }
})

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
    var ws = objectUtils.stringBuffer()
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
  },

  toSemanticActionTemplate: function(/* entryPoint1, entryPoint2, ... */) {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr-plus should appear next to
    // other cases of Add-Expr.
    // TODO: if the caller supplies entry points, only include templates for rules that are reachable in the call graph.
    var self = this
    var buffer = objectUtils.columnStringBuffer()
    buffer.nextPutAll('{')

    var first = true
    for (var ruleName in this.ruleDict) {
      var body = this.ruleDict[ruleName]
      if (first)
        first = false
      else
        buffer.nextPutAll(',')
      buffer.newLine()
      buffer.nextPutAll('  ')
      buffer.newColumn()
      self.addSemanticActionTemplate(ruleName, body, buffer)
    }

    buffer.newLine()
    buffer.nextPutAll('}')
    return buffer.contents()
  },

  addSemanticActionTemplate: function(ruleName, body, buffer) {
    if (ruleName.indexOf('-') >= 0) {
      buffer.nextPutAll("'")
      buffer.nextPutAll(ruleName)
      buffer.nextPutAll("'")
    } else
      buffer.nextPutAll(ruleName)
    buffer.nextPutAll(': ')
    buffer.newColumn()
    buffer.nextPutAll('function(')
    buffer.nextPutAll(this.semanticActionArgNames(ruleName).join(', '))
    buffer.nextPutAll(') ')
    buffer.newColumn()
    buffer.nextPutAll('{')

    var bindings = body.getBindingNames()
    if (bindings.length > 0) {
      buffer.nextPutAll(' /* ')
      buffer.nextPutAll(bindings.join(', '))
      buffer.nextPutAll(' */ ')
    }
    buffer.nextPutAll('}')
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

    _name:                      function() { return this.interval.contents },
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
    sChar:                      function() { return this.interval.contents },
    regexp:                     function(env) { return new RegExp(env.e) },
    reCharClass:                function() { return this.interval.contents },
    number:                     function() { return parseInt(this.interval.contents) },

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9vaG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBvaG0gPSByZXF1aXJlKCcuLi9zcmMvb2htLmpzJylcbm9obS5fb2htR3JhbW1hckZhY3RvcnkgPVxuKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBiID0gb2htLmJ1aWxkZXIoKVxuICBiLnNldE5hbWUoJ09obScpXG4gIGIuaW5saW5lKCdzcGFjZS1zaW5nbGVMaW5lJywgYi5zZXEoYi5fKCcvLycpLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5fKCdcXG4nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCdcXG4nKSkpXG4gIGIuaW5saW5lKCdzcGFjZS1tdWx0aUxpbmUnLCBiLnNlcShiLl8oJy8qJyksIGIubWFueShiLnNlcShiLm5vdChiLl8oJyovJykpLCBiLmFwcCgnXycpKSwgMCksIGIuXygnKi8nKSkpXG4gIGIuZXh0ZW5kKCdzcGFjZScsIGIuYWx0KGIuYXBwKCdzcGFjZS1zaW5nbGVMaW5lJyksIGIuYXBwKCdzcGFjZS1tdWx0aUxpbmUnKSkpXG4gIGIuZGVmaW5lKCdfbmFtZScsIGIuc2VxKGIuYXBwKCduYW1lRmlyc3QnKSwgYi5tYW55KGIuYXBwKCduYW1lUmVzdCcpLCAwKSkpXG4gIGIuZGVmaW5lKCduYW1lRmlyc3QnLCBiLmFsdChiLl8oJ18nKSwgYi5hcHAoJ2xldHRlcicpKSlcbiAgYi5kZWZpbmUoJ25hbWVSZXN0JywgYi5hbHQoYi5fKCdfJyksIGIuYXBwKCdhbG51bScpKSlcbiAgYi5kZWZpbmUoJ25hbWUnLCBiLnNlcShiLm5vdChiLmFwcCgnbmFtZWRDb25zdCcpKSwgYi5iaW5kKGIuYXBwKCdfbmFtZScpLCAnbicpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtdW5kZWZpbmVkJywgYi5zZXEoYi5fKCd1bmRlZmluZWQnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtbnVsbCcsIGIuc2VxKGIuXygnbnVsbCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC10cnVlJywgYi5zZXEoYi5fKCd0cnVlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LWZhbHNlJywgYi5zZXEoYi5fKCdmYWxzZScpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmRlZmluZSgnbmFtZWRDb25zdCcsIGIuYWx0KGIuYXBwKCduYW1lZENvbnN0LXVuZGVmaW5lZCcpLCBiLmFwcCgnbmFtZWRDb25zdC1udWxsJyksIGIuYXBwKCduYW1lZENvbnN0LXRydWUnKSwgYi5hcHAoJ25hbWVkQ29uc3QtZmFsc2UnKSkpXG4gIGIuZGVmaW5lKCdzdHJpbmcnLCBiLnNlcShiLl8oXCInXCIpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdzQ2hhcicpLCAwKSwgJ2NzJyksIGIuXyhcIidcIikpKVxuICBiLmRlZmluZSgnc0NoYXInLCBiLmFsdChiLnNlcShiLl8oJ1xcXFx4JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXHUnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JykpLCBiLnNlcShiLl8oJ1xcXFwnKSwgYi5hcHAoJ18nKSksIGIuc2VxKGIubm90KGIuXyhcIidcIikpLCBiLmFwcCgnXycpKSkpXG4gIGIuZGVmaW5lKCdyZWdleHAnLCBiLnNlcShiLl8oJy8nKSwgYi5iaW5kKGIuYXBwKCdyZUNoYXJDbGFzcycpLCAnZScpLCBiLl8oJy8nKSkpXG4gIGIuZGVmaW5lKCdyZUNoYXJDbGFzcycsIGIuc2VxKGIuXygnWycpLCBiLm1hbnkoYi5hbHQoYi5fKCdcXFxcXScpLCBiLnNlcShiLm5vdChiLl8oJ10nKSksIGIuYXBwKCdfJykpKSwgMCksIGIuXygnXScpKSlcbiAgYi5kZWZpbmUoJ251bWJlcicsIGIuc2VxKGIub3B0KGIuXygnLScpKSwgYi5tYW55KGIuYXBwKCdkaWdpdCcpLCAxKSkpXG4gIGIuaW5saW5lKCdBbHQtcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdUZXJtJyksICd4JyksIGIuXygnfCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneScpKSlcbiAgYi5kZWZpbmUoJ0FsdCcsIGIuYWx0KGIuYXBwKCdBbHQtcmVjJyksIGIuYXBwKCdUZXJtJykpKVxuICBiLmlubGluZSgnVGVybS1pbmxpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1NlcScpLCAneCcpLCBiLl8oJ3snKSwgYi5iaW5kKGIuYXBwKCdfbmFtZScpLCAnbicpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdUZXJtJywgYi5hbHQoYi5hcHAoJ1Rlcm0taW5saW5lJyksIGIuYXBwKCdTZXEnKSkpXG4gIGIuZGVmaW5lKCdTZXEnLCBiLm1hbnkoYi5hcHAoJ0ZhY3RvcicpLCAwKSlcbiAgYi5pbmxpbmUoJ0ZhY3Rvci1iaW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdJdGVyJyksICd4JyksIGIuXygnLicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpXG4gIGIuZGVmaW5lKCdGYWN0b3InLCBiLmFsdChiLmFwcCgnRmFjdG9yLWJpbmQnKSwgYi5hcHAoJ0l0ZXInKSkpXG4gIGIuaW5saW5lKCdJdGVyLXN0YXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCcqJykpKVxuICBiLmlubGluZSgnSXRlci1wbHVzJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIuXygnKycpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItb3B0JywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIuXygnPycpKSlcbiAgYi5kZWZpbmUoJ0l0ZXInLCBiLmFsdChiLmFwcCgnSXRlci1zdGFyJyksIGIuYXBwKCdJdGVyLXBsdXMnKSwgYi5hcHAoJ0l0ZXItb3B0JyksIGIuYXBwKCdQcmVkJykpKVxuICBiLmlubGluZSgnUHJlZC1ub3QnLCBiLnNlcShiLl8oJ34nKSwgYi5iaW5kKGIuYXBwKCdCYXNlJyksICd4JykpKVxuICBiLmlubGluZSgnUHJlZC1sb29rYWhlYWQnLCBiLnNlcShiLl8oJyYnKSwgYi5iaW5kKGIuYXBwKCdCYXNlJyksICd4JykpKVxuICBiLmRlZmluZSgnUHJlZCcsIGIuYWx0KGIuYXBwKCdQcmVkLW5vdCcpLCBiLmFwcCgnUHJlZC1sb29rYWhlYWQnKSwgYi5hcHAoJ0Jhc2UnKSkpXG4gIGIuaW5saW5lKCdCYXNlLWFwcGxpY2F0aW9uJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICdydWxlTmFtZScpLCBiLm5vdChiLmFsdChiLl8oJz09JyksIGIuXygnOj0nKSwgYi5fKCcrPScpKSkpKVxuICBiLmlubGluZSgnQmFzZS1wcmltJywgYi5hbHQoYi5hcHAoJ25hbWVkQ29uc3QnKSwgYi5hcHAoJ3N0cmluZycpLCBiLmFwcCgncmVnZXhwJyksIGIuYXBwKCdudW1iZXInKSkpXG4gIGIuaW5saW5lKCdCYXNlLWxzdCcsIGIuc2VxKGIuXygnWycpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJ10nKSkpXG4gIGIuaW5saW5lKCdCYXNlLXN0cicsIGIuc2VxKGIuXygnXCInKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5fKCdcIicpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtcGFyZW4nLCBiLnNlcShiLl8oJygnKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5fKCcpJykpKVxuICBiLmlubGluZSgnQmFzZS1vYmonLCBiLnNlcShiLl8oJ3snKSwgYi5iaW5kKGIub3B0KGIuXygnLi4uJykpLCAnbGVuaWVudCcpLCBiLl8oJ30nKSkpXG4gIGIuaW5saW5lKCdCYXNlLW9ialdpdGhQcm9wcycsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpLCBiLmJpbmQoYi5vcHQoYi5zZXEoYi5fKCcsJyksIGIuXygnLi4uJykpKSwgJ2xlbmllbnQnKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnQmFzZScsIGIuYWx0KGIuYXBwKCdCYXNlLWFwcGxpY2F0aW9uJyksIGIuYXBwKCdCYXNlLXByaW0nKSwgYi5hcHAoJ0Jhc2UtbHN0JyksIGIuYXBwKCdCYXNlLXN0cicpLCBiLmFwcCgnQmFzZS1wYXJlbicpLCBiLmFwcCgnQmFzZS1vYmonKSwgYi5hcHAoJ0Jhc2Utb2JqV2l0aFByb3BzJykpKVxuICBiLmlubGluZSgnUHJvcHMtcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcm9wJyksICdwJyksIGIuXygnLCcpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpKSlcbiAgYi5pbmxpbmUoJ1Byb3BzLWJhc2UnLCBiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSlcbiAgYi5kZWZpbmUoJ1Byb3BzJywgYi5hbHQoYi5hcHAoJ1Byb3BzLXJlYycpLCBiLmFwcCgnUHJvcHMtYmFzZScpKSlcbiAgYi5kZWZpbmUoJ1Byb3AnLCBiLnNlcShiLmJpbmQoYi5hbHQoYi5hcHAoJ19uYW1lJyksIGIuYXBwKCdzdHJpbmcnKSksICduJyksIGIuXygnOicpLCBiLmJpbmQoYi5hcHAoJ0ZhY3RvcicpLCAncCcpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtZGVmaW5lJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnPT0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuaW5saW5lKCdSdWxlLW92ZXJyaWRlJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnOj0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuaW5saW5lKCdSdWxlLWV4dGVuZCcsIGIuc2VxKGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpLCBiLl8oJys9JyksIGIuYmluZChiLmFwcCgnQWx0JyksICdiJykpKVxuICBiLmRlZmluZSgnUnVsZScsIGIuYWx0KGIuYXBwKCdSdWxlLWRlZmluZScpLCBiLmFwcCgnUnVsZS1vdmVycmlkZScpLCBiLmFwcCgnUnVsZS1leHRlbmQnKSkpXG4gIGIuaW5saW5lKCdTdXBlckdyYW1tYXItcXVhbGlmaWVkJywgYi5zZXEoYi5fKCc8OicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ25zJyksIGIuXygnLicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpXG4gIGIuaW5saW5lKCdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnLCBiLnNlcShiLl8oJzw6JyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5kZWZpbmUoJ1N1cGVyR3JhbW1hcicsIGIuYWx0KGIuYXBwKCdTdXBlckdyYW1tYXItcXVhbGlmaWVkJyksIGIuYXBwKCdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnKSkpXG4gIGIuZGVmaW5lKCdHcmFtbWFyJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuYmluZChiLm9wdChiLmFwcCgnU3VwZXJHcmFtbWFyJykpLCAncycpLCBiLl8oJ3snKSwgYi5iaW5kKGIubWFueShiLmFwcCgnUnVsZScpLCAwKSwgJ3JzJyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXJzJywgYi5tYW55KGIuYXBwKCdHcmFtbWFyJyksIDApKVxuICByZXR1cm4gYi5idWlsZChvcHROYW1lc3BhY2UpXG59KVxuIiwiZXhwb3J0cy5vYmplY3RVdGlscyA9IHJlcXVpcmUoJy4vb2JqZWN0VXRpbHMuanMnKVxuZXhwb3J0cy5zdHJpbmdVdGlscyA9IHJlcXVpcmUoJy4vc3RyaW5nVXRpbHMuanMnKVxuZXhwb3J0cy5lcXVhbHMgPSByZXF1aXJlKCcuL2VxdWFscy5qcycpXG5leHBvcnRzLmJyb3dzZXIgPSByZXF1aXJlKCcuL2Jyb3dzZXIuanMnKVxuIiwidmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBMb2dnaW5nXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgc3Vic2NyaWJlZCA9IHt9XG5cbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oc3ViamVjdCAvKiAsIC4uLiAqLykge1xuICBpZiAoIXN1YnNjcmliZWRbc3ViamVjdF0pXG4gICAgcmV0dXJuXG4gIGFyZ3VtZW50c1swXSA9ICdbJyArIHN1YmplY3QgKyAnXSdcbiAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgYXJndW1lbnRzKVxufVxuXG5leHBvcnRzLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgc3Vic2NyaWJlZFtzdWJqZWN0XSA9IHRydWVcbn1cblxuZXhwb3J0cy51bnN1YnNjcmliZSA9IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgZGVsZXRlIHNob3dpbmdbc3ViamVjdF1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFzc2VydHMsIGVycm9ycywgZXRjLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5lcnJvciA9IGZ1bmN0aW9uKC8qIGFyZzEsIGFyZzIsIC4uLiAqLykge1xuICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cylcbiAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBhcmdzKVxuICB0aHJvdyAnZXJyb3I6ICcgKyBhcmdzLmpvaW4oJyAnKVxufVxuXG5leHBvcnRzLnNhbml0eUNoZWNrID0gZnVuY3Rpb24obmFtZSwgY29uZGl0aW9uKSB7XG4gIGlmICghY29uZGl0aW9uKVxuICAgIHRoaXNNb2R1bGUuZXJyb3IoJ2ZhaWxlZCBzYW5pdHkgY2hlY2s6JywgbmFtZSlcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIERPTSB1dGlsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5wcmV0dHlQcmludE5vZGUgPSBmdW5jdGlvbihub2RlLCBlbmROb2RlLCBlbmRPZmZzZXQpIHtcbiAgaWYgKG5vZGUgaW5zdGFuY2VvZiBUZXh0KSB7XG4gICAgaWYgKG5vZGUgPT09IGVuZE5vZGUpXG4gICAgICByZXR1cm4gJ3RleHR7JyArIG5vZGUuZGF0YS5zdWJzdHIoMCwgZW5kT2Zmc2V0KSArICd8JyArIG5vZGUuZGF0YS5zdWJzdHIoZW5kT2Zmc2V0KSArICd9J1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhICsgJ30nXG4gIH1cblxuICB2YXIgcGFydHMgPSBbbm9kZS50YWdOYW1lLCAneyddXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKG5vZGUgPT09IGVuZE5vZGUgJiYgZW5kT2Zmc2V0ID09IGlkeClcbiAgICAgIHBhcnRzLnB1c2goJ3wnKVxuICAgIHBhcnRzLnB1c2godGhpc01vZHVsZS5wcmV0dHlQcmludE5vZGUobm9kZS5jaGlsZE5vZGVzLml0ZW0oaWR4KSwgZW5kTm9kZSwgZW5kT2Zmc2V0KSlcbiAgfVxuICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICBwYXJ0cy5wdXNoKCd8JylcbiAgcGFydHMucHVzaCgnfScpXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuXG4iLCIvLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIGRvdWJsZUVxdWFscyh4LCB5KSB7XG4gIHJldHVybiB4ID09IHlcbn1cblxuZnVuY3Rpb24gdHJpcGxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT09IHlcbn1cblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoeCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB4XG4gIHJldHVybiB0eXBlICE9PSAnb2JqZWN0J1xufVxuXG5mdW5jdGlvbiBlcXVhbHMoeCwgeSwgZGVlcCwgZXFGbikge1xuICBpZiAoaXNQcmltaXRpdmUoeCkpXG4gICAgcmV0dXJuIGVxRm4oeCwgeSlcbiAgZm9yICh2YXIgcCBpbiB4KVxuICAgIGlmIChkZWVwICYmICFlcXVhbHMoeFtwXSwgeVtwXSwgZGVlcCwgZXFGbikgfHxcbiAgICAgICAgIWRlZXAgJiYgIWVxRm4oeFtwXSwgeVtwXSkpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgZm9yICh2YXIgcCBpbiB5KVxuICAgIGlmICh5W3BdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgeFtwXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGhhdmVTYW1lQ29udGVudHNJbkFueU9yZGVyKGFycjEsIGFycjIsIGRlZXAsIGVxRm4pIHtcbiAgaWYgKCFhcnIxIGluc3RhbmNlb2YgQXJyYXkgfHwgIWFycjIgaW5zdGFuY2VvZiBBcnJheSB8fFxuICAgICAgYXJyMS5sZW5ndGggIT09IGFycjIubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnIxLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycjFbaWR4XVxuICAgIHZhciBmb3VuZFggPSBhcnIyLnNvbWUoZnVuY3Rpb24oeSkge1xuICAgICAgcmV0dXJuIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKVxuICAgIH0pXG4gICAgaWYgKCFmb3VuZFgpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCBmYWxzZSwgZG91YmxlRXF1YWxzKVxufVxuXG5leHBvcnRzLmRlZXBFcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgdHJ1ZSwgZG91YmxlRXF1YWxzKVxufVxuXG5leHBvcnRzLnN0cmljdEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCBmYWxzZSwgdHJpcGxlRXF1YWxzKVxufVxuXG5leHBvcnRzLnN0cmljdERlZXBFcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgdHJ1ZSwgdHJpcGxlRXF1YWxzKVxufVxuXG5leHBvcnRzLmhhdmVTYW1lQ29udGVudHNJbkFueU9yZGVyID0gZnVuY3Rpb24oYXJyMSwgYXJyMikge1xuICByZXR1cm4gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgdHJ1ZSwgZG91YmxlRXF1YWxzKVxufVxuXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuZXhwb3J0cy5vYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBmdW5jdGlvbihvYmosIG9wdFByb3BlcnRpZXMpIHtcbiAgZnVuY3Rpb24gY29ucygpIHt9XG4gIGNvbnMucHJvdG90eXBlID0gb2JqXG4gIHZhciBhbnMgPSBuZXcgY29ucygpXG4gIGlmIChvcHRQcm9wZXJ0aWVzKVxuICAgIHRoaXNNb2R1bGUua2V5c0FuZFZhbHVlc0RvKG9wdFByb3BlcnRpZXMsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGFuc1trXSA9IHZcbiAgICB9KVxuICByZXR1cm4gYW5zXG59XG5cbmV4cG9ydHMuZm9ybWFscyA9IGZ1bmN0aW9uKGZ1bmMpIHtcbiAgcmV0dXJuIGZ1bmMuXG4gICAgdG9TdHJpbmcoKS5cbiAgICBtYXRjaCgvXFwoKC4qPylcXCkvKVswXS5cbiAgICByZXBsYWNlKC8gL2csICcnKS5cbiAgICBzbGljZSgxLCAtMSkuXG4gICAgc3BsaXQoJywnKS5cbiAgICBmaWx0ZXIoZnVuY3Rpb24obW9kdWxlTmFtZSkgeyByZXR1cm4gbW9kdWxlTmFtZSAhPSAnJyB9KVxufVxuXG5leHBvcnRzLmtleXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgZm9yICh2YXIgcCBpbiBvYmplY3QpXG4gICAgaWYgKG9iamVjdC5oYXNPd25Qcm9wZXJ0eShwKSlcbiAgICAgIGZuKHApXG59XG5cbmV4cG9ydHMudmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0FuZFZhbHVlc0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICB0aGlzTW9kdWxlLmtleXNEbyhvYmplY3QsIGZ1bmN0aW9uKHApIHsgZm4ocCwgb2JqZWN0W3BdKSB9KVxufVxuXG5leHBvcnRzLmtleXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlc0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLnZhbHVlc0RvKG9iamVjdCwgZm4pIH1cbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYua2V5c0FuZFZhbHVlc0RvKG9iamVjdCwgZm4pIH1cbn1cblxuZXhwb3J0cy52YWx1ZXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgdmFyIGFucyA9IFtdXG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBhbnMucHVzaChvYmplY3RbcF0pIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZnVuY3Rpb24gU3RyaW5nQnVmZmVyKCkge1xuICB0aGlzLnN0cmluZ3MgPSBbXVxuICB0aGlzLmxlbmd0aFNvRmFyID0gMFxufVxuXG5TdHJpbmdCdWZmZXIucHJvdG90eXBlID0ge1xuICBuZXh0UHV0QWxsOiBmdW5jdGlvbihzKSB7XG4gICAgdGhpcy5zdHJpbmdzLnB1c2gocylcbiAgICB0aGlzLmxlbmd0aFNvRmFyICs9IHMubGVuZ3RoXG4gIH0sXG5cbiAgY29udGVudHM6IGZ1bmN0aW9uKCkgIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmdzLmpvaW4oJycpXG4gIH1cbn1cblxuZXhwb3J0cy5zdHJpbmdCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBTdHJpbmdCdWZmZXIoKVxufVxuXG5mdW5jdGlvbiBDb2x1bW5TdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMubGluZXMgPSBbXVxuICB0aGlzLm5ld0xpbmUoKVxufVxuXG5Db2x1bW5TdHJpbmdCdWZmZXIucHJvdG90eXBlID0ge1xuICBuZXh0UHV0QWxsOiBmdW5jdGlvbihzKSB7XG4gICAgdGhpcy5jdXJyZW50Q29sdW1uKCkucHVzaChzKVxuICB9LFxuXG4gIGNvbnRlbnRzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBDb252ZXJ0IGNvbHVtbnMgZnJvbSBsaXN0cyBvZiBzdHJpbmdzIHRvIHN0cmluZ3MsIGFuZCByZWNvcmQgY29sdW1uIGxlbmd0aHNcbiAgICB2YXIgY29sdW1uTGVuZ3RocyA9IFtdXG4gICAgdGhpcy5saW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIGZvciAodmFyIGNvbElkeCA9IDA7IGNvbElkeCA8IGxpbmUubGVuZ3RoOyBjb2xJZHgrKykge1xuICAgICAgICB2YXIgY29sdW1uID0gbGluZVtjb2xJZHhdXG4gICAgICAgIGxpbmVbY29sSWR4XSA9IGNvbHVtbi5qb2luKCcnKVxuICAgICAgICBpZiAoY29sdW1uTGVuZ3Roc1tjb2xJZHhdID09PSB1bmRlZmluZWQgfHwgY29sdW1uTGVuZ3Roc1tjb2xJZHhdIDwgbGluZVtjb2xJZHhdLmxlbmd0aClcbiAgICAgICAgICBjb2x1bW5MZW5ndGhzW2NvbElkeF0gPSBsaW5lW2NvbElkeF0ubGVuZ3RoXG4gICAgICB9XG4gICAgfSlcblxuICAgIHZhciBzYiA9IHRoaXNNb2R1bGUuc3RyaW5nQnVmZmVyKClcbiAgICB0aGlzLmxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbGluZS5sZW5ndGg7IGNvbElkeCsrKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSBsaW5lW2NvbElkeF1cbiAgICAgICAgc2IubmV4dFB1dEFsbChjb2x1bW4pXG4gICAgICAgIHZhciBudW1TcGFjZXMgPSBjb2x1bW5MZW5ndGhzW2NvbElkeF0gLSBjb2x1bW4ubGVuZ3RoXG4gICAgICAgIHdoaWxlIChudW1TcGFjZXMtLSA+IDApXG4gICAgICAgICAgc2IubmV4dFB1dEFsbCgnICcpXG4gICAgICB9XG4gICAgICBzYi5uZXh0UHV0QWxsKCdcXG4nKVxuICAgIH0pXG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKClcbiAgfSxcblxuICBuZXdMaW5lOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxpbmVzLnB1c2goW10pXG4gICAgdGhpcy5uZXdDb2x1bW4oKVxuICB9LFxuXG4gIG5ld0NvbHVtbjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jdXJyZW50TGluZSgpLnB1c2goW10pXG4gIH0sXG5cbiAgY3VycmVudENvbHVtbjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGxpbmUgPSB0aGlzLmN1cnJlbnRMaW5lKClcbiAgICByZXR1cm4gbGluZVtsaW5lLmxlbmd0aCAtIDFdXG4gIH0sXG5cbiAgY3VycmVudExpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxpbmVzW3RoaXMubGluZXMubGVuZ3RoIC0gMV1cbiAgfVxufVxuXG5leHBvcnRzLmNvbHVtblN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IENvbHVtblN0cmluZ0J1ZmZlcigpXG59XG5cbiIsInZhciBvYmplY3RVdGlscyA9IHJlcXVpcmUoJy4vb2JqZWN0VXRpbHMuanMnKVxudmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gcGFkKG51bWJlckFzU3RyaW5nLCBsZW4pIHtcbiAgdmFyIHplcm9zID0gW11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbnVtYmVyQXNTdHJpbmcubGVuZ3RoIC0gbGVuOyBpZHgrKylcbiAgICB6ZXJvcy5wdXNoKCcwJylcbiAgcmV0dXJuIHplcm9zLmpvaW4oJycpICsgbnVtYmVyQXNTdHJpbmdcbn1cblxudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9XG5mb3IgKHZhciBjID0gMDsgYyA8IDEyODsgYysrKVxuICBlc2NhcGVTdHJpbmdGb3JbY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpXG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gID0gXCJcXFxcJ1wiXG5lc2NhcGVTdHJpbmdGb3JbJ1wiJy5jaGFyQ29kZUF0KDApXSAgPSAnXFxcXFwiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCdcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYidcbmVzY2FwZVN0cmluZ0ZvclsnXFxmJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcZidcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbidcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccidcbmVzY2FwZVN0cmluZ0ZvclsnXFx0Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdCdcbmVzY2FwZVN0cmluZ0ZvclsnXFx2Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdidcblxuLy8gUHVibGljIG1ldGhvZHNcblxuZXhwb3J0cy5lc2NhcGVDaGFyID0gZnVuY3Rpb24oYywgb3B0RGVsaW0pIHtcbiAgdmFyIGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApXG4gIGlmICgoYyA9PSAnXCInIHx8IGMgPT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKVxuICAgIHJldHVybiBjXG4gIGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KVxuICAgIHJldHVybiBlc2NhcGVTdHJpbmdGb3JbY2hhckNvZGVdXG4gIGVsc2UgaWYgKDEyOCA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8IDI1NilcbiAgICByZXR1cm4gJ1xcXFx4JyArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDIpXG4gIGVsc2VcbiAgICByZXR1cm4gJ1xcXFx1JyArIHBhZChjaGFyQ29kZS50b1N0cmluZygxNiksIDQpXG59XG5cbmV4cG9ydHMudW5lc2NhcGVDaGFyID0gZnVuY3Rpb24ocykge1xuICBpZiAocy5jaGFyQXQoMCkgPT0gJ1xcXFwnKVxuICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgIGNhc2UgJ2InOiAgcmV0dXJuICdcXGInXG4gICAgICBjYXNlICdmJzogIHJldHVybiAnXFxmJ1xuICAgICAgY2FzZSAnbic6ICByZXR1cm4gJ1xcbidcbiAgICAgIGNhc2UgJ3InOiAgcmV0dXJuICdcXHInXG4gICAgICBjYXNlICd0JzogIHJldHVybiAnXFx0J1xuICAgICAgY2FzZSAndic6ICByZXR1cm4gJ1xcdidcbiAgICAgIGNhc2UgJ3gnOiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNCksIDE2KSlcbiAgICAgIGNhc2UgJ3UnOiAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSlcbiAgICAgIGRlZmF1bHQ6ICAgcmV0dXJuIHMuY2hhckF0KDEpXG4gICAgfVxuICBlbHNlXG4gICAgcmV0dXJuIHNcbn1cblxuZnVuY3Rpb24gcHJpbnRPbih4LCB3cykge1xuICBpZiAoeCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgd3MubmV4dFB1dEFsbCgnWycpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgcHJpbnRPbih4W2lkeF0sIHdzKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCddJylcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgaGFzU2luZ2xlUXVvdGVzID0geC5pbmRleE9mKFwiJ1wiKSA+PSAwXG4gICAgdmFyIGhhc0RvdWJsZVF1b3RlcyA9IHguaW5kZXhPZignXCInKSA+PSAwXG4gICAgdmFyIGRlbGltID0gaGFzU2luZ2xlUXVvdGVzICYmICFoYXNEb3VibGVRdW90ZXMgPyAnXCInIDogXCInXCJcbiAgICB3cy5uZXh0UHV0QWxsKGRlbGltKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHgubGVuZ3RoOyBpZHgrKylcbiAgICAgIHdzLm5leHRQdXRBbGwodGhpc01vZHVsZS5lc2NhcGVDaGFyKHhbaWR4XSwgZGVsaW0pKVxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gIH0gZWxzZSBpZiAoeCA9PT0gbnVsbCkge1xuICAgIHdzLm5leHRQdXRBbGwoJ251bGwnKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnb2JqZWN0JyAmJiAhKHggaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgd3MubmV4dFB1dEFsbCgneycpXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIG9iamVjdFV0aWxzLmtleXNBbmRWYWx1ZXNEbyh4LCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBpZiAoZmlyc3QpXG4gICAgICAgIGZpcnN0ID0gZmFsc2VcbiAgICAgIGVsc2VcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgcHJpbnRPbihrLCB3cylcbiAgICAgIHdzLm5leHRQdXRBbGwoJzogJylcbiAgICAgIHByaW50T24odiwgd3MpXG4gICAgfSlcbiAgICB3cy5uZXh0UHV0QWxsKCd9JylcbiAgfSBlbHNlXG4gICAgd3MubmV4dFB1dEFsbCgnJyArIHgpXG59XG5cbmV4cG9ydHMucHJpbnRTdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgdmFyIHdzID0gb2JqZWN0VXRpbHMuc3RyaW5nQnVmZmVyKClcbiAgcHJpbnRPbihvYmosIHdzKVxuICByZXR1cm4gd3MuY29udGVudHMoKVxufVxuXG4iLCIvKlxuXG5UT0RPOlxuXG4qIFRoaW5rIGFib3V0IGltcHJvdmluZyB0aGUgaW1wbGVtZW50YXRpb24gb2Ygc3ludGFjdGljIHJ1bGVzJyBhdXRvbWF0aWMgc3BhY2Ugc2tpcHBpbmc6XG4gIC0tIENvdWxkIGtlZXAgdHJhY2sgb2YgdGhlIGN1cnJlbnQgcnVsZSBuYW1lIGJ5IG1vZGlmeWluZyB0aGUgY29kZSAoaW4gQXBwbHkuZXZhbCkgd2hlcmUgZW50ZXIgYW5kIGV4aXQgbWV0aG9kc1xuICAgICBhcmUgY2FsbGVkLiAoV291bGQgYWxzbyB3YW50IHRvIGtlZXAgdHJhY2sgb2Ygd2hldGhlciB0aGUgcnVsZSBpcyBzeW50YWN0aWMgdG8gYXZvaWQgcmUtZG9pbmcgdGhhdCB3b3JrXG4gICAgIGF0IGVhY2ggYXBwbGljYXRpb24uKVxuXG4qIENvbnNpZGVyIGJvcnJvd2luZyAoc29tZXRoaW5nIGxpa2UpIHRoZSB2YXJpYWJsZS1ub3Qtb3RoZXJ3aXNlLW1lbnRpb25lZCBpZGVhIGZyb20gUm9iYnkgRmluZGxlcidzIHJlZGV4LCBhcyBhIHdheVxuICB0byBtYWtlIGl0IGVhc2llciBmb3IgcHJvZ3JhbW1lcnMgdG8gZGVhbCB3aXRoIGtleXdvcmRzIGFuZCBpZGVudGlmaWVycy5cblxuKiBUaGluayBhYm91dCBhIGJldHRlciB3YXkgdG8gZGVhbCB3aXRoIGxpc3RzXG4gIC0tIEJ1aWx0LWluIGxpc3Qgb3BlcmF0b3I/XG4gIC0tIFBhcmFtZXRlcml6ZWQgcnVsZXM/XG5cbiogSW1wcm92ZSB0ZXN0IGNvdmVyYWdlXG4gIC0tIEFkZCB0ZXN0cyBmb3Igc2NvcGluZywgZS5nLiwgXCJmb286YSBbYmFyOmIgYmF6OmNdOmRcIiBzaG91bGQgaGF2ZSA0IGJpbmRpbmdzLlxuICAgICAoU2FtZSBraW5kIG9mIHRoaW5nIGZvciBuZXN0ZWQgc3RyaW5nIGFuZCBsb29rYWhlYWQgZXhwcmVzc2lvbnMsIHRoZWlyIGJpbmRpbmdzIHNob3VsZCBsZWFrIHRvIHRoZSBlbmNsb3Npbmcgc2VxLilcblxuKiBUaGluayBhYm91dCBmb3JlaWduIHJ1bGUgaW52b2NhdGlvblxuICAtLSBDYW4ndCBqdXN0IGJlIGRvbmUgaW4gdGhlIHNhbWUgd2F5IGFzIGluIE9NZXRhIGIvYyBvZiB0aGUgYWN0aW9uRGljdFxuICAtLSBXaWxsIHdhbnQgdG8gcHJlc2VydmUgdGhlIFwibm8gdW5uZWNlc3Nhcnkgc2VtYW50aWMgYWN0aW9uc1wiIGd1YXJhbnRlZVxuICAtLSBUaGUgc29sdXRpb24gbWlnaHQgYmUgdG8gZW5hYmxlIHRoZSBwcm9ncmFtbWVyIHRvIHByb3ZpZGUgbXVsdGlwbGUgYWN0aW9uRGljdHMsXG4gICAgIGJ1dCBJJ2xsIGhhdmUgdG8gY29tZSB1cCB3aXRoIGEgY29udmVuaWVudCB3YXkgdG8gYXNzb2NpYXRlIGVhY2ggd2l0aCBhIHBhcnRpY3VsYXIgZ3JhbW1hci5cblxuKiBUaGluayBhYm91dCBpbmNyZW1lbnRhbCBwYXJzaW5nIChnb29kIGZvciBlZGl0b3JzKVxuICAtLSBCYXNpYyBpZGVhOiBrZWVwIHRyYWNrIG9mIG1heCBpbmRleCBzZWVuIHRvIGNvbXB1dGUgYSByZXN1bHRcbiAgICAgKHN0b3JlIHRoaXMgaW4gbWVtbyByZWMgYXMgYW4gaW50IHJlbGF0aXZlIHRvIGN1cnIgcG9zKVxuICAtLSBPayB0byByZXVzZSBtZW1vaXplZCB2YWx1ZSBhcyBsb25nIGFzIHJhbmdlIGZyb20gY3VycmVudCBpbmRleCB0byBtYXggaW5kZXggaGFzbid0IGNoYW5nZWRcbiAgLS0gQ291bGQgYmUgYSBjdXRlIHdvcmtzaG9wIHBhcGVyLi4uXG5cblxuU3ludGF4IC8gbGFuZ3VhZ2UgaWRlYXM6XG5cbiogU3ludGF4IGZvciBydWxlIGRlY2xhcmF0aW9uczpcblxuICAgIGZvbyA9PSBiYXIgYmF6ICAgICAoZGVmaW5lKVxuICAgIGZvbyA6PSBiYXIgYmF6ICAgICAob3ZlcnJpZGUgLyByZXBsYWNlKVxuICAgIGZvbyA8PSBiYXIgYmF6ICAgICAoZXh0ZW5kKVxuXG4qIElubGluZSBydWxlcywgZS5nLixcblxuICAgIGFkZEV4cHIgPSBhZGRFeHByOnggJysnIG11bEV4cHI6eSB7cGx1c31cbiAgICAgICAgICAgIHwgYWRkRXhwcjp4ICctJyBtdWxFeHByOnkge21pbnVzfVxuICAgICAgICAgICAgfCBtdWxFeHByXG5cbiAgaXMgc3ludGFjdGljIHN1Z2FyIGZvclxuXG4gICAgYWRkRXhwciA9IHBsdXMgfCBtaW51cyB8IG11bEV4cHIsXG4gICAgcGx1cyA9IGFkZEV4cHI6eCAnKycgbXVsRXhwcjp5LFxuICAgIG1pbnVzID0gYWRkRXhwcjp4ICctJyBtdWxFeHByOnlcblxuKiBJbiB0aGlzIGV4YW1wbGU6XG5cbiAgICBmb28gPSBcImJhclwiXG4gICAgYmFyID0gJ2FiYydcblxuICBUaGUgZm9vIHJ1bGUgc2F5cyBpdCB3YW50cyB0aGUgYmFyIHJ1bGUgdG8gbWF0Y2ggdGhlIGNvbnRlbnRzIG9mIGEgc3RyaW5nIG9iamVjdC4gKFRoZSBcInMgaXMgYSBraW5kIG9mIHBhcmVudGhlc2lzLilcbiAgVGhlbiB5b3UgY291bGQgZWl0aGVyIHNheVxuXG4gICAgbS5tYXRjaEFsbCgnYWJjJywgJ2JhcicpXG5cbiAgb3JcblxuICAgIG0ubWF0Y2goJ2FiYycsICdmb28nKVxuXG4gIEJvdGggc2hvdWxkIHN1Y2NlZWQuXG5cbiogQWJvdXQgb2JqZWN0IG1hdGNoaW5nXG5cbiAgU29tZSBpc3N1ZXM6XG4gIC0tIFNob3VsZCBkZWZpbml0ZWx5IGFsbG93IHBhdHRlcm4gbWF0Y2hpbmcgb24gZWFjaCBwcm9wZXJ0eSdzIHZhbHVlLiBCdXQgd2hhdCBhYm91dCBwcm9wZXJ0eSBuYW1lcz9cbiAgLS0gV2hhdCB0byBkbyBhYm91dCB1bnNwZWNpZmllZCBwcm9wZXJ0aWVzP1xuICAtLSBTeW50YXg6IEpTT04gdXNlcyBjb2xvbnMgdG8gc2VwYXJhdGUgcHJvcGVydHkgbmFtZXMgYW5kIHZhbHVlcy4gV2lsbCBsb29rIGJhZCB3LyBiaW5kaW5ncywgZS5nLixcbiAgICAge2ZvbzogbnVtYmVyOm59IChld3d3dylcblxuICBDdXJyZW50IHN0cmF3bWFuOlxuICAtLSBSZXF1aXJlIHByb3BlcnR5IG5hbWVzIHRvIGJlIHN0cmluZyBsaXRlcmFscyAobm90IHBhdHRlcm5zKSwgb25seSBhbGxvdyBwYXR0ZXJuIG1hdGNoaW5nIG9uIHRoZWlyIHZhbHVlcy5cbiAgLS0gQWxsb3cgYW4gb3B0aW9uYWwgJy4uLicgYXMgdGhlIGxhc3QgcGF0dGVybiwgdGhhdCB3b3VsZCBtYXRjaCBhbnkgdW5zcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgICB7J2Zvbyc6IG51bWJlciwgJ2Jhcic6IHN0cmluZywgJ2Jheic6IDUsIC4uLn1cbiAgICAgTWlnaHQgZXZlbiBhbGxvdyB0aGUgLi4uIHRvIGJlIGJvdW5kIHRvIGEgdmFyaWFibGUgdGhhdCB3b3VsZCBjb250YWluIGFsbCBvZiB0aG9zZSBwcm9wZXJ0aWVzLlxuICAtLSBDb25zaWRlciBjaGFuZ2luZyBiaW5kaW5nIHN5bnRheCBmcm9tIGV4cHI6bmFtZSB0byBleHByLm5hbWVcbiAgICAgKE1vcmUgSlNPTi1mcmllbmRseSwgYnV0IGl0IGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggLi4uIHN5bnRheC4gQnV0IG1heWJlIGl0J3Mgbm90IHNvIGltcG9ydGFudCB0byBiZSBhYmxlIHRvIGJpbmRcbiAgICAgdGhlIHJlc3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBhbnl3YXksIHNpbmNlIHlvdSBjYW4gYWx3YXlzIGJpbmQgdGhlIGVudGlyZSBvYmplY3QuKVxuXG5cbk9wdGltaXphdGlvbiBpZGVhczpcblxuKiBPcHRpbWl6ZSAnYmluZHMnIC0tIHNob3VsZCBwcmUtYWxsb2NhdGUgYW4gYXJyYXkgb2YgYmluZGluZ3MgaW5zdGVhZCBvZiBkb2luZyBwdXNoZXMsIHRocm93aW5nIGF3YXkgYXJyYXlzIG9uIGZhaWxcbiAgKHNlZSBBbHQpLCBldGMuXG5cbiogQ29uc2lkZXIgYWRkaW5nIGFuIGFkZGl0aW9uYWwgY29kZSBnZW5lcmF0aW9uIHN0ZXAgdGhhdCBnZW5lcmF0ZXMgZWZmaWNpZW50IGNvZGUgZnJvbSB0aGUgQVNUcywgaW5zdGVhZCBvZlxuICBpbnRlcnByZXRpbmcgdGhlbSBkaXJlY3RseS5cblxuKiBEb24ndCBib3RoZXIgY3JlYXRpbmcgdGh1bmtzIC8gbGlzdHMgb2YgdGh1bmtzIHdoZW4gdmFsdWUgaXMgbm90IG5lZWRlZCAoT01ldGEgZGlkIHRoaXMpXG4gIC0tIEUuZy4sIGluIFwiZm9vID0gc3BhY2UqIGJhclwiIHRoZSByZXN1bHQgb2Ygc3BhY2UqIGlzIG5vdCBuZWVkZWQsIHNvIGRvbid0IGJvdGhlciBjcmVhdGluZyBhIGxpc3Qgb2YgdGh1bmtzIC8gdmFsdWVzXG4gIC0tIENvdWxkIGp1c3QgcmV0dXJuIHVuZGVmaW5lZCAoYW55dGhpbmcgZXhjZXB0IGZhaWwpXG5cbiogR2V0IHJpZCBvZiB1bm5lY2Vzc2FyeSBTZXFzIGFuZCBBbHRzIChPTWV0YSBkaWQgdGhpcyB0b28pXG5cbiovXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBEZXBlbmRlbmNpZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXIuanMnKVxuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpXG52YXIgb2JqZWN0VXRpbHMgPSBhd2xpYi5vYmplY3RVdGlsc1xudmFyIHN0cmluZ1V0aWxzID0gYXdsaWIuc3RyaW5nVXRpbHNcbnZhciBicm93c2VyID0gYXdsaWIuYnJvd3NlclxudmFyIGVxdWFscyA9IGF3bGliLmVxdWFsc1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVycywgZXRjLlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbnZhciBmYWlsID0ge31cblxuZnVuY3Rpb24gZ2V0RHVwbGljYXRlcyhhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycmF5W2lkeF1cbiAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKVxuICAgICAgZHVwbGljYXRlcy5wdXNoKHgpXG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXNcbn1cblxuZnVuY3Rpb24gYWJzdHJhY3QoKSB7XG4gIHRocm93ICd0aGlzIG1ldGhvZCBpcyBhYnN0cmFjdCEnXG59XG5cbmZ1bmN0aW9uIGlzU3ludGFjdGljKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXVxuICByZXR1cm4gJ0EnIDw9IGZpcnN0Q2hhciAmJiBmaXJzdENoYXIgPD0gJ1onXG59XG5cbnZhciBfYXBwbHlTcGFjZXNcbmZ1bmN0aW9uIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKSB7XG4gIChfYXBwbHlTcGFjZXMgfHwgKF9hcHBseVNwYWNlcyA9IG5ldyBBcHBseSgnc3BhY2VzJykpKS5ldmFsKGZhbHNlLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZClcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIElucHV0IHN0cmVhbXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIElucHV0U3RyZWFtKCkge1xuICB0aHJvdyAnSW5wdXRTdHJlYW0gY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnXG59XG5cbklucHV0U3RyZWFtLm5ld0ZvciA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpXG4gICAgcmV0dXJuIG5ldyBTdHJpbmdJbnB1dFN0cmVhbShvYmopXG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KVxuICAgIHJldHVybiBuZXcgTGlzdElucHV0U3RyZWFtKG9iailcbiAgZWxzZVxuICAgIHRocm93ICdjYW5ub3QgbWFrZSBpbnB1dCBzdHJlYW0gZm9yICcgKyBvYmpcbn1cblxuSW5wdXRTdHJlYW0ucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICAgIHRoaXMucG9zID0gMFxuICAgIHRoaXMucG9zSW5mb3MgPSBbXVxuICB9LFxuXG4gIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyclBvcyA9IHRoaXMucG9zXG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW2N1cnJQb3NdXG4gICAgcmV0dXJuIHBvc0luZm8gfHwgKHRoaXMucG9zSW5mb3NbY3VyclBvc10gPSBuZXcgUG9zSW5mbyhjdXJyUG9zKSlcbiAgfSxcblxuICBhdEVuZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zID09PSB0aGlzLnNvdXJjZS5sZW5ndGhcbiAgfSxcblxuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hdEVuZCgpID8gZmFpbCA6IHRoaXMuc291cmNlW3RoaXMucG9zKytdXG4gIH0sXG5cbiAgbWF0Y2hFeGFjdGx5OiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMubmV4dCgpID09PSB4ID8gdHJ1ZSA6IGZhaWxcbiAgfSxcblxuICBpbnRlcnZhbDogZnVuY3Rpb24oc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydElkeCwgZW5kSWR4KVxuICB9XG59XG5cbmZ1bmN0aW9uIFN0cmluZ0lucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKVxufVxuXG5TdHJpbmdJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgaWYgKHRoaXMubWF0Y2hFeGFjdGx5KHNbaWR4XSkgPT09IGZhaWwpXG4gICAgICAgIHJldHVybiBmYWlsXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIC8vIElNUE9SVEFOVDogZSBtdXN0IGJlIGEgbm9uLWdsb2JhbCwgb25lLWNoYXJhY3RlciBleHByZXNzaW9uLCBlLmcuLCAvLi8gYW5kIC9bMC05XS9cbiAgICB2YXIgYyA9IHRoaXMubmV4dCgpXG4gICAgcmV0dXJuIGMgIT09IGZhaWwgJiYgZS50ZXN0KGMpID8gdHJ1ZSA6IGZhaWxcbiAgfVxufSlcblxuZnVuY3Rpb24gTGlzdElucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKVxufVxuXG5MaXN0SW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShzKVxuICB9LFxuICAgIFxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShlKVxuICB9XG59KVxuXG5mdW5jdGlvbiBQb3NJbmZvKHBvcykge1xuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLnJ1bGVTdGFjayA9IFtdXG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fSAgLy8gcmVkdW5kYW50IGRhdGEgKGNvdWxkIGJlIGdlbmVyYXRlZCBmcm9tIHJ1bGVTdGFjayksIGV4aXN0cyBmb3IgcGVyZm9ybWFuY2UgcmVhc29uc1xuICB0aGlzLm1lbW8gPSB7fVxufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdXG4gIH0sXG5cbiAgZW50ZXI6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5ydWxlU3RhY2sucHVzaChydWxlTmFtZSlcbiAgICB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSA9IHRydWVcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnBvcCgpXG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSBmYWxzZVxuICB9LFxuXG4gIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbihtZW1vUmVjKSB7XG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBtZW1vUmVjLmludm9sdmVkUnVsZXNcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBpbnZvbHZlZFJ1bGVzKVxuICAgICAgaWYgKGludm9sdmVkUnVsZXNbcnVsZU5hbWVdICYmIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdKVxuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sgPyB0aGlzLmxlZnRSZWN1cnNpb25TdGFja1t0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZFxuICB9LFxuXG4gIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAoIXRoaXMubGVmdFJlY3Vyc2lvblN0YWNrKVxuICAgICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sgPSBbXVxuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnB1c2goe25hbWU6IHJ1bGVOYW1lLCB2YWx1ZTogZmFpbCwgcG9zOiAtMSwgaW52b2x2ZWRSdWxlczoge319KVxuICAgIHRoaXMudXBkYXRlSW52b2x2ZWRSdWxlcygpXG4gIH0sXG5cbiAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wb3AoKVxuICB9LFxuXG4gIHVwZGF0ZUludm9sdmVkUnVsZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHRoaXMuZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKVxuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gY3VycmVudExlZnRSZWN1cnNpb24uaW52b2x2ZWRSdWxlc1xuICAgIHZhciBsclJ1bGVOYW1lID0gY3VycmVudExlZnRSZWN1cnNpb24ubmFtZVxuICAgIHZhciBpZHggPSB0aGlzLnJ1bGVTdGFjay5sZW5ndGggLSAxXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZVN0YWNrW2lkeC0tXVxuICAgICAgaWYgKHJ1bGVOYW1lID09PSBsclJ1bGVOYW1lKVxuICAgICAgICBicmVha1xuICAgICAgaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbnRlcnZhbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEludGVydmFsKHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCkge1xuICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHhcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHhcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSW50ZXJ2YWwucHJvdG90eXBlLCB7XG4gICdjb250ZW50cyc6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHRoaXMuX2NvbnRlbnRzID0gSW5wdXRTdHJlYW0ubmV3Rm9yKHRoaXMuc291cmNlKS5pbnRlcnZhbCh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeClcbiAgICAgIHJldHVybiB0aGlzLl9jb250ZW50c1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxuICB9XG59KVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGh1bmtzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBUaHVuaygpIHt9XG5cbnZhciBuZXh0VGh1bmtJZCA9IDBcblRodW5rLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pZCA9IG5leHRUaHVua0lkKytcbiAgfVxufVxuXG5mdW5jdGlvbiBSdWxlVGh1bmsocnVsZU5hbWUsIHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCwgdmFsdWUsIGJpbmRpbmdzKSB7XG4gIHRoaXMuaW5pdCgpXG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxuICB0aGlzLnNvdXJjZSA9IHNvdXJjZVxuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHhcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHhcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG4gIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5nc1xufVxuXG5SdWxlVGh1bmsucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIGlmICghbWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSkge1xuICAgICAgdmFyIGFjdGlvbiA9IHRoaXMubG9va3VwQWN0aW9uKGFjdGlvbkRpY3QpXG4gICAgICB2YXIgYWRkbEluZm8gPSB0aGlzLmNyZWF0ZUFkZGxJbmZvKClcbiAgICAgIHZhciBlbnYgPSB0aGlzLm1ha2VFbnYoYWN0aW9uRGljdCwgbWVtbylcbiAgICAgIG1lbW9bdGhpcy5pZF0gPSBhY3Rpb24uY2FsbChhZGRsSW5mbywgZW52KVxuICAgIH1cbiAgICByZXR1cm4gbWVtb1t0aGlzLmlkXVxuICB9LFxuXG4gIGxvb2t1cEFjdGlvbjogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWVcbiAgICB2YXIgYWN0aW9uID0gYWN0aW9uRGljdFtydWxlTmFtZV1cbiAgICBpZiAoYWN0aW9uID09PSB1bmRlZmluZWQgJiYgYWN0aW9uRGljdC5fZGVmYXVsdCAhPT0gdW5kZWZpbmVkKVxuICAgICAgYWN0aW9uID0gZnVuY3Rpb24oZW52KSB7XG4gICAgICAgIHJldHVybiBhY3Rpb25EaWN0Ll9kZWZhdWx0LmNhbGwodGhpcywgcnVsZU5hbWUsIGVudilcbiAgICAgIH1cbiAgICByZXR1cm4gYWN0aW9uIHx8IGJyb3dzZXIuZXJyb3IoJ21pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvcicsIHJ1bGVOYW1lKVxuICB9LFxuXG4gIGNyZWF0ZUFkZGxJbmZvOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaW50ZXJ2YWw6IG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZSwgdGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpXG4gICAgfVxuICB9LFxuXG4gIG1ha2VFbnY6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICB2YXIgYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmxlbmd0aCA9PT0gMCA/IFsndmFsdWUnLCB0aGlzLnZhbHVlXSA6IHRoaXMuYmluZGluZ3NcbiAgICB2YXIgZW52ID0ge31cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBiaW5kaW5ncy5sZW5ndGg7IGlkeCArPSAyKSB7XG4gICAgICB2YXIgbmFtZSA9IGJpbmRpbmdzW2lkeF1cbiAgICAgIHZhciB0aHVuayA9IGJpbmRpbmdzW2lkeCArIDFdXG4gICAgICB0aGlzLmFkZEJpbmRpbmcoZW52LCBuYW1lLCB0aHVuaywgYWN0aW9uRGljdCwgbWVtbylcbiAgICB9XG4gICAgcmV0dXJuIGVudlxuICB9LFxuXG4gIGFkZEJpbmRpbmc6IGZ1bmN0aW9uKGVudiwgbmFtZSwgdmFsdWUsIGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW52LCBuYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBUaHVuaylcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLmZvcmNlKGFjdGlvbkRpY3QsIG1lbW8pXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KVxuICB9XG59KVxuXG5mdW5jdGlvbiBMaXN0VGh1bmsodGh1bmtzKSB7XG4gIHRoaXMuaW5pdCgpXG4gIHRoaXMudGh1bmtzID0gdGh1bmtzXG59XG5cbkxpc3RUaHVuay5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oVGh1bmsucHJvdG90eXBlLCB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgaWYgKCFtZW1vLmhhc093blByb3BlcnR5KHRoaXMuaWQpKVxuICAgICAgbWVtb1t0aGlzLmlkXSA9IHRoaXMudGh1bmtzLm1hcChmdW5jdGlvbih0aHVuaykgeyByZXR1cm4gdGh1bmsuZm9yY2UoYWN0aW9uRGljdCwgbWVtbykgfSlcbiAgICByZXR1cm4gbWVtb1t0aGlzLmlkXVxuICB9XG59KVxuXG5mdW5jdGlvbiBWYWx1ZVRodW5rKHZhbHVlKSB7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZVxufVxuXG5WYWx1ZVRodW5rLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZVxuICB9XG59KVxuXG52YXIgdmFsdWVsZXNzVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh1bmRlZmluZWQpXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUeXBlcyBvZiBwYXR0ZXJuc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG5mdW5jdGlvbiBQYXR0ZXJuKCkge1xuICB0aHJvdyAnUGF0dGVybiBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuUGF0dGVybi5wcm90b3R5cGUgPSB7XG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFtdXG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBhYnN0cmFjdCxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGFic3RyYWN0LFxuXG4gIG91dHB1dFJlY2lwZTogYWJzdHJhY3Rcbn1cblxuLy8gQW55dGhpbmdcblxudmFyIGFueXRoaW5nID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgdmFsdWUgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgVmFsdWVUaHVuayh2YWx1ZSlcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIC8vIG5vLW9wXG4gIH1cbn0pXG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuUHJpbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnICYmIG9iai5sZW5ndGggIT09IDEpXG4gICAgcmV0dXJuIG5ldyBTdHJpbmdQcmltKG9iailcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgIHJldHVybiBuZXcgUmVnRXhwUHJpbShvYmopXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IFByaW0ob2JqKVxufVxuICAgIFxuUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIGlmICh0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBWYWx1ZVRodW5rKHRoaXMub2JqKVxuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICAgIHJldHVybiBpbnB1dFN0cmVhbS5tYXRjaEV4YWN0bHkodGhpcy5vYmopXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHt9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLl8oJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMub2JqKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gU3RyaW5nUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2g6IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gICAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKVxuICB9XG59KVxuXG5mdW5jdGlvbiBSZWdFeHBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5SZWdFeHBQcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICBpZiAoaW5wdXRTdHJlYW0ubWF0Y2hSZWdFeHAodGhpcy5vYmopID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFZhbHVlVGh1bmsoaW5wdXRTdHJlYW0uc291cmNlW29yaWdQb3NdKVxuICB9XG59KVxuXG4vLyBBbHRlcm5hdGlvblxuXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgdGhpcy50ZXJtcyA9IHRlcm1zXG59XG5cbkFsdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgb3JpZ051bUJpbmRpbmdzID0gYmluZGluZ3MubGVuZ3RoXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoc3ludGFjdGljKVxuICAgICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMudGVybXNbaWR4XS5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICBlbHNlIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgICAvLyBOb3RlOiB3aGlsZSB0aGUgZm9sbG93aW5nIGFzc2lnbm1lbnQgY291bGQgYmUgZG9uZSB1bmNvbmRpdGlvbmFsbHksIG9ubHkgZG9pbmcgaXQgd2hlbiBuZWNlc3NhcnkgaXNcbiAgICAgICAgLy8gYmV0dGVyIGZvciBwZXJmb3JtYW5jZS4gVGhpcyBpcyBiL2MgYXNzaWduaW5nIHRvIGFuIGFycmF5J3MgbGVuZ3RoIHByb3BlcnR5IGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4gYVxuICAgICAgICAvLyB0eXBpY2FsIGFzc2lnbm1lbnQuXG4gICAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPiBvcmlnTnVtQmluZGluZ3MpXG4gICAgICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGJpbmRpbmdzIC0tIHRoaXMgcHJvcGVydHkgaXMgY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyBbXSA6IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKClcbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspXG4gICAgICBpZiAoIXRoaXMudGVybXNbaWR4XS5wcm9kdWNlc1ZhbHVlKCkpXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm5cbiAgICB2YXIgbmFtZXMgPSB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XVxuICAgICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncygpXG4gICAgICB2YXIgb3RoZXJOYW1lcyA9IHRlcm0uZ2V0QmluZGluZ05hbWVzKClcbiAgICAgIGlmICghZXF1YWxzLmVxdWFscyhuYW1lcywgb3RoZXJOYW1lcykpXG4gICAgICAgIGJyb3dzZXIuZXJyb3IoJ3J1bGUnLCBydWxlTmFtZSwgJ2hhcyBhbiBhbHQgd2l0aCBpbmNvbnNpc3RlbnQgYmluZGluZ3M6JywgbmFtZXMsICd2cycsIG90aGVyTmFtZXMpXG4gICAgfVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmFsdCgnKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHRoaXMudGVybXNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBTZXF1ZW5jZXNcblxuZnVuY3Rpb24gU2VxKGZhY3RvcnMpIHtcbiAgdGhpcy5mYWN0b3JzID0gZmFjdG9yc1xufVxuXG5TZXEucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoc3ludGFjdGljKVxuICAgICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XVxuICAgICAgdmFyIHZhbHVlID0gZmFjdG9yLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgaWYgKHZhbHVlID09PSBmYWlsKVxuICAgICAgICByZXR1cm4gZmFpbFxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVsZXNzVGh1bmtcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLmZhY3RvcnNbaWR4XS5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICByZXR1cm4gbmFtZXMuc29ydCgpXG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG5cbiAgICB2YXIgZHVwbGljYXRlcyA9IGdldER1cGxpY2F0ZXModGhpcy5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKVxuICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGR1cGxpY2F0ZSBiaW5kaW5nczonLCBkdXBsaWNhdGVzKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iuc2VxKCcpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICB0aGlzLmZhY3RvcnNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBCaW5kaW5nc1xuXG5mdW5jdGlvbiBCaW5kKGV4cHIsIG5hbWUpIHtcbiAgdGhpcy5leHByID0gZXhwclxuICB0aGlzLm5hbWUgPSBuYW1lXG59XG5cbkJpbmQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICBpZiAodmFsdWUgIT09IGZhaWwpXG4gICAgICBiaW5kaW5ncy5wdXNoKHRoaXMubmFtZSwgdmFsdWUpXG4gICAgcmV0dXJuIHZhbHVlXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMubmFtZV1cbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuYmluZCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbiAgdGhpcy5taW5OdW1NYXRjaGVzID0gbWluTnVtTWF0Y2hlc1xufVxuXG5NYW55LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IFtdXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIHZhciBiYWNrdHJhY2tQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICAgIGlmICh2YWx1ZSA9PT0gZmFpbCkge1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBiYWNrdHJhY2tQb3NcbiAgICAgICAgYnJlYWtcbiAgICAgIH0gZWxzZVxuICAgICAgICBtYXRjaGVzLnB1c2godmFsdWUpXG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVzLmxlbmd0aCA8IHRoaXMubWluTnVtTWF0Y2hlcyA/ICBmYWlsIDogbmV3IExpc3RUaHVuayhtYXRjaGVzKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5tYW55KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgd3MubmV4dFB1dEFsbCh0aGlzLm1pbk51bU1hdGNoZXMpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuT3B0LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIHJldHVybiB2YWx1ZWxlc3NUaHVua1xuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIG5ldyBMaXN0VGh1bmsoW3ZhbHVlXSlcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iub3B0KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbk5vdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgaWYgKHZhbHVlICE9PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIHJldHVybiB2YWx1ZWxlc3NUaHVua1xuICAgIH1cbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2Iubm90KCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gTG9va2FoZWFkKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5Mb29rYWhlYWQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSAhPT0gZmFpbCkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5sYSgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuU3RyLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIHN0cmluZyA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmICh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJykge1xuICAgICAgdmFyIHN0cmluZ0lucHV0U3RyZWFtID0gbmV3IFN0cmluZ0lucHV0U3RyZWFtKHN0cmluZylcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIHN0cmluZ0lucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIHJldHVybiB2YWx1ZSAhPT0gZmFpbCAmJiBzdHJpbmdJbnB1dFN0cmVhbS5hdEVuZCgpID8gIG5ldyBWYWx1ZVRodW5rKHN0cmluZykgOiBmYWlsXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5zdHIoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBMaXN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gTGlzdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTGlzdC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBsaXN0ID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKGxpc3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgdmFyIGxpc3RJbnB1dFN0cmVhbSA9IG5ldyBMaXN0SW5wdXRTdHJlYW0obGlzdClcbiAgICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGxpc3RJbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICByZXR1cm4gdmFsdWUgIT09IGZhaWwgJiYgbGlzdElucHV0U3RyZWFtLmF0RW5kKCkgPyAgbmV3IFZhbHVlVGh1bmsobGlzdCkgOiBmYWlsXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5sc3QoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBPYmplY3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBPYmoocHJvcGVydGllcywgaXNMZW5pZW50KSB7XG4gIHZhciBuYW1lcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5KSB7IHJldHVybiBwcm9wZXJ0eS5uYW1lIH0pXG4gIHZhciBkdXBsaWNhdGVzID0gZ2V0RHVwbGljYXRlcyhuYW1lcylcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICBicm93c2VyLmVycm9yKCdvYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOicsIGR1cGxpY2F0ZXMpXG4gIGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICB0aGlzLmlzTGVuaWVudCA9IGlzTGVuaWVudFxuICB9XG59XG5cbk9iai5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBvYmogPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAob2JqICE9PSBmYWlsICYmIG9iaiAmJiAodHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgIHZhciBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9IDBcbiAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1tpZHhdXG4gICAgICAgIHZhciB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXVxuICAgICAgICB2YXIgdmFsdWVJbnB1dFN0cmVhbSA9IG5ldyBMaXN0SW5wdXRTdHJlYW0oW3ZhbHVlXSlcbiAgICAgICAgdmFyIG1hdGNoZWQgPVxuICAgICAgICAgIHByb3BlcnR5LnBhdHRlcm4uZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCB2YWx1ZUlucHV0U3RyZWFtLCBiaW5kaW5ncykgIT09IGZhaWwgJiYgdmFsdWVJbnB1dFN0cmVhbS5hdEVuZCgpXG4gICAgICAgIGlmICghbWF0Y2hlZClcbiAgICAgICAgICByZXR1cm4gZmFpbFxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3BlcnR5Lm5hbWUpKVxuICAgICAgICAgIG51bU93blByb3BlcnRpZXNNYXRjaGVkKytcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmlzTGVuaWVudCB8fCBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9PT0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggP1xuICAgICAgICBuZXcgVmFsdWVUaHVuayhvYmopIDpcbiAgICAgICAgZmFpbFxuICAgIH0gZWxzZVxuICAgICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBuYW1lcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspXG4gICAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIHJldHVybiBuYW1lcy5zb3J0KClcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuXG4gICAgdmFyIGR1cGxpY2F0ZXMgPSBnZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3J1bGUnLCBydWxlTmFtZSwgJ2hhcyBhbiBvYmplY3QgcGF0dGVybiB3aXRoIGR1cGxpY2F0ZSBiaW5kaW5nczonLCBkdXBsaWNhdGVzKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgZnVuY3Rpb24gb3V0cHV0UHJvcGVydHlSZWNpcGUocHJvcCkge1xuICAgICAgd3MubmV4dFB1dEFsbCgne25hbWU6ICcpXG4gICAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHByb3AubmFtZSkpXG4gICAgICB3cy5uZXh0UHV0QWxsKCcsIHBhdHRlcm46ICcpXG4gICAgICBwcm9wLnBhdHRlcm4ub3V0cHV0UmVjaXBlKHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnfScpXG4gICAgfVxuXG4gICAgd3MubmV4dFB1dEFsbCgnYi5vYmooWycpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBvdXRwdXRQcm9wZXJ0eVJlY2lwZSh0aGlzLnByb3BlcnRpZXNbaWR4XSlcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnXSwgJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKCEhdGhpcy5pc0xlbmllbnQpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxufVxuXG5BcHBseS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZVxuICAgIHZhciBvcmlnUG9zSW5mbyA9IGlucHV0U3RyZWFtLmdldEN1cnJlbnRQb3NJbmZvKClcbiAgICB2YXIgbWVtb1JlYyA9IG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdXG4gICAgaWYgKG1lbW9SZWMgJiYgb3JpZ1Bvc0luZm8uc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG1lbW9SZWMucG9zXG4gICAgICByZXR1cm4gbWVtb1JlYy52YWx1ZVxuICAgIH0gZWxzZSBpZiAob3JpZ1Bvc0luZm8uaXNBY3RpdmUocnVsZU5hbWUpKSB7XG4gICAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24gJiYgY3VycmVudExlZnRSZWN1cnNpb24ubmFtZSA9PT0gcnVsZU5hbWUpIHtcbiAgICAgICAgb3JpZ1Bvc0luZm8udXBkYXRlSW52b2x2ZWRSdWxlcygpXG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvc1xuICAgICAgICByZXR1cm4gY3VycmVudExlZnRSZWN1cnNpb24udmFsdWVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9yaWdQb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbihydWxlTmFtZSlcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSBydWxlRGljdFtydWxlTmFtZV0gfHwgYnJvd3Nlci5lcnJvcigndW5kZWZpbmVkIHJ1bGUnLCBydWxlTmFtZSlcbiAgICAgIG9yaWdQb3NJbmZvLmVudGVyKHJ1bGVOYW1lKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24pIHtcbiAgICAgICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmhhbmRsZUxlZnRSZWN1cnNpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zSW5mby5wb3MsIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLCB2YWx1ZSlcbiAgICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9XG4gICAgICAgICAgICB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZSwgaW52b2x2ZWRSdWxlczogY3VycmVudExlZnRSZWN1cnNpb24uaW52b2x2ZWRSdWxlc31cbiAgICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgICB9IGVsc2UgaWYgKCFjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSlcbiAgICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBydWxlIGlzIG5vdCBpbnZvbHZlZCBpbiB0aGUgY3VycmVudCBsZWZ0IHJlY3Vyc2lvblxuICAgICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID0ge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9IGVsc2VcbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIG9yaWdQb3NJbmZvLmV4aXQocnVsZU5hbWUpXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9XG4gIH0sXG5cbiAgZXZhbE9uY2U6IGZ1bmN0aW9uKGV4cHIsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIGJpbmRpbmdzID0gW11cbiAgICB2YXIgdmFsdWUgPSBleHByLmV2YWwoaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgaWYgKHZhbHVlID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFJ1bGVUaHVuayh0aGlzLnJ1bGVOYW1lLCBpbnB1dFN0cmVhbS5zb3VyY2UsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdmFsdWUsIGJpbmRpbmdzKVxuICB9LFxuXG4gIGhhbmRsZUxlZnRSZWN1cnNpb246IGZ1bmN0aW9uKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgb3JpZ1BvcywgY3VycmVudExlZnRSZWN1cnNpb24sIHNlZWRWYWx1ZSkge1xuICAgIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZVxuICAgIGlmIChzZWVkVmFsdWUgIT09IGZhaWwpIHtcbiAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlID0gc2VlZFZhbHVlXG4gICAgICBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgICAgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgICAgaWYgKHZhbHVlICE9PSBmYWlsICYmIGlucHV0U3RyZWFtLnBvcyA+IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcykge1xuICAgICAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlID0gdmFsdWVcbiAgICAgICAgICBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YWx1ZSA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnZhbHVlXG4gICAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gY3VycmVudExlZnRSZWN1cnNpb24ucG9zXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuYXBwKCcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnJ1bGVOYW1lKSlcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gUnVsZSBleHBhbnNpb24gLS0gYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIF9FeHBhbmQocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgaWYgKGdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpXG4gICAgYnJvd3Nlci5lcnJvcignZ3JhbW1hcicsIGdyYW1tYXIubmFtZSwgJ2RvZXMgbm90IGhhdmUgYSBydWxlIGNhbGxlZCcsIHJ1bGVOYW1lKVxuICBlbHNlIHtcbiAgICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWVcbiAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyXG4gIH1cbn1cblxuX0V4cGFuZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uKCkuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gIH0sXG5cbiAgZXhwYW5zaW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFtbWFyLnJ1bGVEaWN0W3RoaXMucnVsZU5hbWVdXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIHByb2R1Y2VzVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLnByb2R1Y2VzVmFsdWUoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwYW5zaW9uKCkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIC8vIG5vLW9wXG4gIH1cbn0pXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHcmFtbWFyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBHcmFtbWFyKHJ1bGVEaWN0KSB7XG4gIHRoaXMucnVsZURpY3QgPSBydWxlRGljdFxufVxuXG5HcmFtbWFyLnByb3RvdHlwZSA9IHtcbiAgcnVsZURpY3Q6IG5ldyBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl8gPSBhbnl0aGluZ1xuICAgIHRoaXMuZW5kID0gbmV3IE5vdCh0aGlzLl8pXG4gICAgdGhpcy5zcGFjZSA9IFByaW0ubmV3Rm9yKC9bXFxzXS8pXG4gICAgdGhpcy5zcGFjZXMgPSBuZXcgTWFueShuZXcgQXBwbHkoJ3NwYWNlJyksIDApXG4gICAgdGhpcy5hbG51bSA9IFByaW0ubmV3Rm9yKC9bMC05YS16QS1aXS8pXG4gICAgdGhpcy5sZXR0ZXIgPSBQcmltLm5ld0ZvcigvW2EtekEtWl0vKVxuICAgIHRoaXMubG93ZXIgPSBQcmltLm5ld0ZvcigvW2Etel0vKVxuICAgIHRoaXMudXBwZXIgPSBQcmltLm5ld0ZvcigvW0EtWl0vKVxuICAgIHRoaXMuZGlnaXQgPSBQcmltLm5ld0ZvcigvWzAtOV0vKVxuICAgIHRoaXMuaGV4RGlnaXQgPSBQcmltLm5ld0ZvcigvWzAtOWEtZkEtRl0vKVxuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoQ29udGVudHMoW29ial0sIHN0YXJ0UnVsZSlcbiAgfSxcblxuICBtYXRjaENvbnRlbnRzOiBmdW5jdGlvbihvYmosIHN0YXJ0UnVsZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihvYmopXG4gICAgdmFyIHRodW5rID0gbmV3IEFwcGx5KHN0YXJ0UnVsZSkuZXZhbCh1bmRlZmluZWQsIHRoaXMucnVsZURpY3QsIGlucHV0U3RyZWFtLCB1bmRlZmluZWQpXG4gICAgaWYgKGlzU3ludGFjdGljKHN0YXJ0UnVsZSkpXG4gICAgICBza2lwU3BhY2VzKHRoaXMucnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2ggPSB0aGlzLmFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaC5iaW5kKHRoaXMpXG4gICAgcmV0dXJuIHRodW5rID09PSBmYWlsIHx8ICFpbnB1dFN0cmVhbS5hdEVuZCgpID9cbiAgICAgIGZhbHNlIDpcbiAgICAgIGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICAgICAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoKGFjdGlvbkRpY3QpXG4gICAgICAgIHJldHVybiB0aHVuay5mb3JjZShhY3Rpb25EaWN0LCB7fSlcbiAgICAgIH1cbiAgfSxcblxuICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2g6IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgcnVsZURpY3QgPSB0aGlzLnJ1bGVEaWN0XG4gICAgdmFyIG9rID0gdHJ1ZVxuICAgIG9iamVjdFV0aWxzLmtleXNEbyhydWxlRGljdCwgZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIGlmIChhY3Rpb25EaWN0W3J1bGVOYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm5cbiAgICAgIHZhciBhY3R1YWwgPSBvYmplY3RVdGlscy5mb3JtYWxzKGFjdGlvbkRpY3RbcnVsZU5hbWVdKS5zb3J0KClcbiAgICAgIHZhciBleHBlY3RlZCA9IHNlbGYuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSlcbiAgICAgIGlmICghZXF1YWxzLmVxdWFscyhhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgICAgICBvayA9IGZhbHNlXG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW1hbnRpYyBhY3Rpb24gZm9yIHJ1bGUnLCBydWxlTmFtZSwgJ2hhcyB0aGUgd3JvbmcgYXJndW1lbnQgbmFtZXMnKVxuICAgICAgICBjb25zb2xlLmxvZygnICBleHBlY3RlZCcsIGV4cGVjdGVkKVxuICAgICAgICBjb25zb2xlLmxvZygnICAgIGFjdHVhbCcsIGFjdHVhbClcbiAgICAgIH1cbiAgICB9KVxuICAgIGlmICghb2spXG4gICAgICBicm93c2VyLmVycm9yKCdvbmUgb3IgbW9yZSBzZW1hbnRpYyBhY3Rpb25zIGhhdmUgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzIC0tIHNlZSBjb25zb2xlIGZvciBkZXRhaWxzJylcbiAgfSxcblxuICBzZW1hbnRpY0FjdGlvbkFyZ05hbWVzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0pXG4gICAgICByZXR1cm4gdGhpcy5zdXBlckdyYW1tYXIuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV1cbiAgICAgIHZhciBuYW1lcyA9IGJvZHkuZ2V0QmluZGluZ05hbWVzKClcbiAgICAgIHJldHVybiBuYW1lcy5sZW5ndGggPiAwIHx8IGJvZHkucHJvZHVjZXNWYWx1ZSgpID8gWydlbnYnXSA6IFtdXG4gICAgfVxuICB9LFxuXG4gIHRvUmVjaXBlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgd3MgPSBvYmplY3RVdGlscy5zdHJpbmdCdWZmZXIoKVxuICAgIHdzLm5leHRQdXRBbGwoJyhmdW5jdGlvbihvaG0sIG9wdE5hbWVzcGFjZSkge1xcbicpXG4gICAgd3MubmV4dFB1dEFsbCgnICB2YXIgYiA9IG9obS5idWlsZGVyKClcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJyAgYi5zZXROYW1lKCcpOyB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpOyB3cy5uZXh0UHV0QWxsKCcpXFxuJylcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIubmFtZSAmJiB0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcgIGIuc2V0U3VwZXJHcmFtbWFyKG9obS5uYW1lc3BhY2UoJylcbiAgICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5zdXBlckdyYW1tYXIubmFtZXNwYWNlTmFtZSkpXG4gICAgICB3cy5uZXh0UHV0QWxsKCcpLmdldEdyYW1tYXIoJylcbiAgICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5zdXBlckdyYW1tYXIubmFtZSkpXG4gICAgICB3cy5uZXh0UHV0QWxsKCcpKVxcbicpXG4gICAgfVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucnVsZURlY2xzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgJylcbiAgICAgIHRoaXMucnVsZURlY2xzW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnXFxuJylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnICByZXR1cm4gYi5idWlsZChvcHROYW1lc3BhY2UpXFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCd9KScpXG4gICAgcmV0dXJuIHdzLmNvbnRlbnRzKClcbiAgfSxcblxuICB0b1NlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uKC8qIGVudHJ5UG9pbnQxLCBlbnRyeVBvaW50MiwgLi4uICovKSB7XG4gICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByLXBsdXMgc2hvdWxkIGFwcGVhciBuZXh0IHRvXG4gICAgLy8gb3RoZXIgY2FzZXMgb2YgQWRkLUV4cHIuXG4gICAgLy8gVE9ETzogaWYgdGhlIGNhbGxlciBzdXBwbGllcyBlbnRyeSBwb2ludHMsIG9ubHkgaW5jbHVkZSB0ZW1wbGF0ZXMgZm9yIHJ1bGVzIHRoYXQgYXJlIHJlYWNoYWJsZSBpbiB0aGUgY2FsbCBncmFwaC5cbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgYnVmZmVyID0gb2JqZWN0VXRpbHMuY29sdW1uU3RyaW5nQnVmZmVyKClcbiAgICBidWZmZXIubmV4dFB1dEFsbCgneycpXG5cbiAgICB2YXIgZmlyc3QgPSB0cnVlXG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gdGhpcy5ydWxlRGljdCkge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXVxuICAgICAgaWYgKGZpcnN0KVxuICAgICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcsJylcbiAgICAgIGJ1ZmZlci5uZXdMaW5lKClcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcgICcpXG4gICAgICBidWZmZXIubmV3Q29sdW1uKClcbiAgICAgIHNlbGYuYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZShydWxlTmFtZSwgYm9keSwgYnVmZmVyKVxuICAgIH1cblxuICAgIGJ1ZmZlci5uZXdMaW5lKClcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnfScpXG4gICAgcmV0dXJuIGJ1ZmZlci5jb250ZW50cygpXG4gIH0sXG5cbiAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHksIGJ1ZmZlcikge1xuICAgIGlmIChydWxlTmFtZS5pbmRleE9mKCctJykgPj0gMCkge1xuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoXCInXCIpXG4gICAgICBidWZmZXIubmV4dFB1dEFsbChydWxlTmFtZSlcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKFwiJ1wiKVxuICAgIH0gZWxzZVxuICAgICAgYnVmZmVyLm5leHRQdXRBbGwocnVsZU5hbWUpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJzogJylcbiAgICBidWZmZXIubmV3Q29sdW1uKClcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnZnVuY3Rpb24oJylcbiAgICBidWZmZXIubmV4dFB1dEFsbCh0aGlzLnNlbWFudGljQWN0aW9uQXJnTmFtZXMocnVsZU5hbWUpLmpvaW4oJywgJykpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJykgJylcbiAgICBidWZmZXIubmV3Q29sdW1uKClcbiAgICBidWZmZXIubmV4dFB1dEFsbCgneycpXG5cbiAgICB2YXIgYmluZGluZ3MgPSBib2R5LmdldEJpbmRpbmdOYW1lcygpXG4gICAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcgLyogJylcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKGJpbmRpbmdzLmpvaW4oJywgJykpXG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnICovICcpXG4gICAgfVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd9JylcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQnVpbGRlclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUnVsZURlY2woKSB7XG4gIHRocm93ICdSdWxlRGVjbCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuUnVsZURlY2wucHJvdG90eXBlID0ge1xuICBwZXJmb3JtQ2hlY2tzOiBhYnN0cmFjdCxcblxuICBwZXJmb3JtQ29tbW9uQ2hlY2tzOiBmdW5jdGlvbihuYW1lLCBib2R5KSB7XG4gICAgYm9keS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKG5hbWUpXG4gICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhuYW1lKVxuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuYm9keVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLicpXG4gICAgd3MubmV4dFB1dEFsbCh0aGlzLmtpbmQpXG4gICAgd3MubmV4dFB1dEFsbCgnKCcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLm5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICB0aGlzLmJvZHkub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59XG5cbmZ1bmN0aW9uIERlZmluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbkRlZmluZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdkZWZpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGRlZmluZSBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc3VwZXItZ3JhbW1hci4nLFxuICAgICAgICAgICAgICAgICAgICAnKHRyeSBvdmVycmlkZSBvciBleHRlbmQgaW5zdGVhZC4pJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIE92ZXJyaWRlKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuT3ZlcnJpZGUucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnb3ZlcnJpZGUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdmVycmlkZGVuID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXVxuICAgIGlmICghb3ZlcnJpZGRlbilcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2Nhbm5vdCBvdmVycmlkZSBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3VwZXItZ3JhbW1hci4nLFxuICAgICAgICAgICAgICAgICAgICAnKHRyeSBkZWZpbmUgaW5zdGVhZC4pJylcbiAgICBpZiAob3ZlcnJpZGRlbi5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgb3ZlcnJpZGRlbi5wcm9kdWNlc1ZhbHVlKCkgJiYgIXRoaXMuYm9keS5wcm9kdWNlc1ZhbHVlKCkpXG4gICAgICBicm93c2VyLmVycm9yKCd0aGUgYm9keSBvZiBydWxlJywgdGhpcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAnbXVzdCBwcm9kdWNlIGEgdmFsdWUsIGJlY2F1c2UgdGhlIHJ1bGUgaXRcXCdzIG92ZXJyaWRpbmcgYWxzbyBwcm9kdWNlcyBhIHZhbHVlJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIElubGluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbklubGluZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdpbmxpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIHJlbGF4aW5nIHRoaXMgY2hlY2ssIGUuZy4sIG1ha2UgaXQgb2sgdG8gb3ZlcnJpZGUgYW4gaW5saW5lIHJ1bGUgaWYgdGhlIG5lc3RpbmcgcnVsZSBpc1xuICAgIC8vIGFuIG92ZXJyaWRlLiBCdXQgb25seSBpZiB0aGUgaW5saW5lIHJ1bGUgdGhhdCdzIGJlaW5nIG92ZXJyaWRkZW4gaXMgbmVzdGVkIGluc2lkZSB0aGUgbmVzdGluZyBydWxlIHRoYXRcbiAgICAvLyB3ZSdyZSBvdmVycmlkaW5nPyBIb3BlZnVsbHkgdGhlcmUncyBhIG11Y2ggbGVzcyBjb21wbGljYXRlZCB3YXkgdG8gZG8gdGhpcyA6KVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGRlZmluZSBpbmxpbmUgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIEV4dGVuZChuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuZXhwYW5kZWRCb2R5ID0gbmV3IEFsdChbYm9keSwgbmV3IF9FeHBhbmQobmFtZSwgc3VwZXJHcmFtbWFyKV0pXG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbkV4dGVuZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdleHRlbmQnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBleHRlbmRlZCA9IHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV1cbiAgICBpZiAoIWV4dGVuZGVkKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGV4dGVuZCBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3VwZXItZ3JhbW1hci4nLFxuICAgICAgICAgICAgICAgICAgICAnKHRyeSBkZWZpbmUgaW5zdGVhZC4pJylcbiAgICBpZiAoZXh0ZW5kZWQuZ2V0QmluZGluZ05hbWVzKCkubGVuZ3RoID09PSAwICYmIGV4dGVuZGVkLnByb2R1Y2VzVmFsdWUoKSAmJiAhdGhpcy5ib2R5LnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3RoZSBib2R5IG9mIHJ1bGUnLCB0aGlzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdtdXN0IHByb2R1Y2UgYSB2YWx1ZSwgYmVjYXVzZSB0aGUgcnVsZSBpdFxcJ3MgZXh0ZW5kaW5nIGFsc28gcHJvZHVjZXMgYSB2YWx1ZScpXG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5leHBhbmRlZEJvZHkpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5leHBhbmRlZEJvZHlcbiAgfVxufSlcblxuZnVuY3Rpb24gQnVpbGRlcigpIHtcbiAgdGhpcy5pbml0KClcbn1cblxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubmFtZSA9IHVuZGVmaW5lZFxuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gR3JhbW1hci5wcm90b3R5cGVcbiAgICB0aGlzLnJ1bGVEZWNscyA9IFtdXG4gIH0sXG5cbiAgc2V0TmFtZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWVcbiAgfSxcblxuICBzZXRTdXBlckdyYW1tYXI6IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IGdyYW1tYXJcbiAgfSxcblxuICBkZWZpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgRGVmaW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgb3ZlcnJpZGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgT3ZlcnJpZGUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBpbmxpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgSW5saW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gICAgcmV0dXJuIHRoaXMuYXBwKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGV4dGVuZDogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBFeHRlbmQocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBidWlsZDogZnVuY3Rpb24ob3B0TmFtZXNwYWNlKSB7XG4gICAgdmFyIHN1cGVyR3JhbW1hciA9IHRoaXMuc3VwZXJHcmFtbWFyXG4gICAgdmFyIHJ1bGVEaWN0ID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKHN1cGVyR3JhbW1hci5ydWxlRGljdClcbiAgICB0aGlzLnJ1bGVEZWNscy5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVEZWNsKSB7XG4gICAgICBydWxlRGVjbC5wZXJmb3JtQ2hlY2tzKClcbiAgICAgIHJ1bGVEZWNsLmluc3RhbGwocnVsZURpY3QpXG4gICAgfSlcblxuICAgIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIocnVsZURpY3QpXG4gICAgZ3JhbW1hci5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbiAgICBncmFtbWFyLnJ1bGVEZWNscyA9IHRoaXMucnVsZURlY2xzXG4gICAgaWYgKHRoaXMubmFtZSkge1xuICAgICAgZ3JhbW1hci5uYW1lID0gdGhpcy5uYW1lXG4gICAgICBpZiAob3B0TmFtZXNwYWNlKSB7XG4gICAgICAgIGdyYW1tYXIubmFtZXNwYWNlTmFtZSA9IG9wdE5hbWVzcGFjZS5uYW1lXG4gICAgICAgIG9wdE5hbWVzcGFjZS5pbnN0YWxsKHRoaXMubmFtZSwgZ3JhbW1hcilcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pbml0KClcbiAgICByZXR1cm4gZ3JhbW1hclxuICB9LFxuXG4gIF86IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIFByaW0ubmV3Rm9yKHgpIH0sXG4gIGFsdDogZnVuY3Rpb24oLyogdGVybTEsIHRlcm0xLCAuLi4gKi8pIHtcbiAgICB2YXIgdGVybXMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBBbHQpXG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcylcbiAgICAgIGVsc2VcbiAgICAgICAgdGVybXMucHVzaChhcmcpXG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBBbHQodGVybXMpXG4gIH0sXG4gIHNlcTogZnVuY3Rpb24oLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgdmFyIGZhY3RvcnMgPSBbXVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBTZXEpXG4gICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycylcbiAgICAgIGVsc2VcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZylcbiAgICB9XG4gICAgcmV0dXJuIGZhY3RvcnMubGVuZ3RoID09PSAxID8gZmFjdG9yc1swXSA6IG5ldyBTZXEoZmFjdG9ycylcbiAgfSxcbiAgYmluZDogZnVuY3Rpb24oZXhwciwgbmFtZSkgeyByZXR1cm4gbmV3IEJpbmQoZXhwciwgbmFtZSkgfSxcbiAgbWFueTogZnVuY3Rpb24oZXhwciwgbWluTnVtTWF0Y2hlcykgeyByZXR1cm4gbmV3IE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykgfSxcbiAgb3B0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgT3B0KGV4cHIpIH0sXG4gIG5vdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IE5vdChleHByKSB9LFxuICBsYTogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IExvb2thaGVhZChleHByKSB9LFxuICBzdHI6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBTdHIoZXhwcikgfSxcbiAgbHN0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTGlzdChleHByKSB9LFxuICBvYmo6IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGlzTGVuaWVudCkgeyByZXR1cm4gbmV3IE9iaihwcm9wZXJ0aWVzLCAhIWlzTGVuaWVudCkgfSxcbiAgYXBwOiBmdW5jdGlvbihydWxlTmFtZSkgeyByZXR1cm4gbmV3IEFwcGx5KHJ1bGVOYW1lKSB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBOYW1lc3BhY2VzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgbmFtZXNwYWNlcyA9IHt9XG5cbmZ1bmN0aW9uIE5hbWVzcGFjZShuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ncmFtbWFycyA9IHt9XG59XG5cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSB7XG4gIGluc3RhbGw6IGZ1bmN0aW9uKG5hbWUsIGdyYW1tYXIpIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyc1tuYW1lXSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2R1cGxpY2F0ZSBkZWNsYXJhdGlvbiBvZiBncmFtbWFyJywgbmFtZSwgJ2luIG5hbWVzcGFjZScsIHRoaXMubmFtZSlcbiAgICBlbHNlXG4gICAgICB0aGlzLmdyYW1tYXJzW25hbWVdID0gZ3JhbW1hclxuICAgIHJldHVybiB0aGlzXG4gIH0sXG5cbiAgZ2V0R3JhbW1hcjogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLmdyYW1tYXJzW25hbWVdIHx8IGJyb3dzZXIuZXJyb3IoJ29obSBuYW1lc3BhY2UnLCB0aGlzLm5hbWUsICdoYXMgbm8gZ3JhbW1hciBjYWxsZWQnLCBuYW1lKVxuICB9LFxuXG4gIGxvYWRHcmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50OiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgYnJvd3Nlci5zYW5pdHlDaGVjaygnc2NyaXB0IHRhZ1xcJ3MgdHlwZSBhdHRyaWJ1dGUgbXVzdCBiZSBcInRleHQvb2htLWpzXCInLCBlbGVtZW50LnR5cGUgPT09ICd0ZXh0L29obS1qcycpXG4gICAgbWFrZUdyYW1tYXJzKGVsZW1lbnQuaW5uZXJIVE1MLCB0aGlzKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZhY3Rvcmllc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkge1xuICB2YXIgYnVpbGRlclxuICByZXR1cm4ge1xuICAgIHNwYWNlOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgICdzcGFjZS1tdWx0aUxpbmUnOiAgICAgICAgICBmdW5jdGlvbigpIHt9LFxuICAgICdzcGFjZS1zaW5nbGVMaW5lJzogICAgICAgICBmdW5jdGlvbigpIHt9LFxuXG4gICAgX25hbWU6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cyB9LFxuICAgIG5hbWVGaXJzdDogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgIG5hbWVSZXN0OiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuXG4gICAgbmFtZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52Lm4gfSxcblxuICAgIG5hbWVkQ29uc3Q6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICduYW1lZENvbnN0LXVuZGVmaW5lZCc6ICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZCB9LFxuICAgICduYW1lZENvbnN0LW51bGwnOiAgICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIG51bGwgfSxcbiAgICAnbmFtZWRDb25zdC10cnVlJzogICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0sXG4gICAgJ25hbWVkQ29uc3QtZmFsc2UnOiAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2UgfSxcblxuICAgIHN0cmluZzogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW52LmNzLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiBzdHJpbmdVdGlscy51bmVzY2FwZUNoYXIoYykgfSkuam9pbignJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBzQ2hhcjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzIH0sXG4gICAgcmVnZXhwOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gbmV3IFJlZ0V4cChlbnYuZSkgfSxcbiAgICByZUNoYXJDbGFzczogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzIH0sXG4gICAgbnVtYmVyOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5pbnRlcnZhbC5jb250ZW50cykgfSxcblxuICAgIEFsdDogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdBbHQtcmVjJzogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYWx0KGVudi54LCBlbnYueSkgfSxcblxuICAgIFRlcm06ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdUZXJtLWlubGluZSc6ICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuaW5saW5lKGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lICsgJy0nICsgZW52Lm4sIGVudi54KSB9LFxuXG4gICAgU2VxOiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5zZXEuYXBwbHkoYnVpbGRlciwgZW52LnZhbHVlKSB9LFxuXG4gICAgRmFjdG9yOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH0sXG4gICAgJ0ZhY3Rvci1iaW5kJzogICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5iaW5kKGVudi54LCBlbnYubikgfSxcblxuICAgIEl0ZXI6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdJdGVyLXN0YXInOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubWFueShlbnYueCwgMCkgfSxcbiAgICAnSXRlci1wbHVzJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm1hbnkoZW52LngsIDEpIH0sXG4gICAgJ0l0ZXItb3B0JzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vcHQoZW52LngpIH0sXG5cbiAgICBQcmVkOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnUHJlZC1ub3QnOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm5vdChlbnYueCkgfSxcbiAgICAnUHJlZC1sb29rYWhlYWQnOiAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmxhKGVudi54KSB9LFxuXG4gICAgQmFzZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH0sXG4gICAgJ0Jhc2UtdW5kZWZpbmVkJzogICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKHVuZGVmaW5lZCkgfSxcbiAgICAnQmFzZS1udWxsJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8obnVsbCkgfSxcbiAgICAnQmFzZS10cnVlJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8odHJ1ZSkgfSxcbiAgICAnQmFzZS1mYWxzZSc6ICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8oZmFsc2UpIH0sXG4gICAgJ0Jhc2UtYXBwbGljYXRpb24nOiAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5hcHAoZW52LnJ1bGVOYW1lKSB9LFxuICAgICdCYXNlLXByaW0nOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuXyhlbnYudmFsdWUpIH0sXG4gICAgJ0Jhc2UtbHN0JzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5sc3QoZW52LngpIH0sXG4gICAgJ0Jhc2Utc3RyJzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5zdHIoZW52LngpIH0sXG4gICAgJ0Jhc2UtcGFyZW4nOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnggfSxcbiAgICAnQmFzZS1vYmonOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9iaihbXSwgZW52LmxlbmllbnQpIH0sXG4gICAgJ0Jhc2Utb2JqV2l0aFByb3BzJzogICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vYmooZW52LnBzLCBlbnYubGVuaWVudCkgfSxcblxuICAgIFByb3BzOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdQcm9wcy1iYXNlJzogICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIFtlbnYucF0gfSxcbiAgICAnUHJvcHMtcmVjJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBbZW52LnBdLmNvbmNhdChlbnYucHMpIH0sXG4gICAgUHJvcDogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4ge25hbWU6IGVudi5uLCBwYXR0ZXJuOiBlbnYucH0gfSxcblxuICAgIFJ1bGU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdSdWxlLWRlZmluZSc6ICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSA9IGVudi5uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZGVmaW5lKGVudi5uLCBlbnYuYilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAnUnVsZS1vdmVycmlkZSc6ICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLm92ZXJyaWRlKGVudi5uLCBlbnYuYilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAnUnVsZS1leHRlbmQnOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmV4dGVuZChlbnYubiwgZW52LmIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICBTdXBlckdyYW1tYXI6ICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IGJ1aWxkZXIuc2V0U3VwZXJHcmFtbWFyKGVudi52YWx1ZSkgfSxcbiAgICAnU3VwZXJHcmFtbWFyLXF1YWxpZmllZCc6ICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiB0aGlzTW9kdWxlLm5hbWVzcGFjZShlbnYubnMpLmdldEdyYW1tYXIoZW52Lm4pIH0sXG4gICAgJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCc6IGZ1bmN0aW9uKGVudikgeyByZXR1cm4gb3B0TmFtZXNwYWNlLmdldEdyYW1tYXIoZW52Lm4pIH0sXG5cbiAgICBHcmFtbWFyOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlciA9IG5ldyBCdWlsZGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLnNldE5hbWUoZW52Lm4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52LnMgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYucnMgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZChvcHROYW1lc3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgR3JhbW1hcnM6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIHdoYXRJdElzLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIHRodW5rID0gdGhpc01vZHVsZS5fb2htR3JhbW1hci5tYXRjaENvbnRlbnRzKHNvdXJjZSwgd2hhdEl0SXMpXG4gIGlmICh0aHVuaylcbiAgICByZXR1cm4gdGh1bmsobWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkpXG4gIGVsc2VcbiAgICAvLyBUT0RPOiBpbXByb3ZlIGVycm9yIG1lc3NhZ2UgKHNob3cgd2hhdCBwYXJ0IG9mIHRoZSBpbnB1dCBpcyB3cm9uZywgd2hhdCB3YXMgZXhwZWN0ZWQsIGV0Yy4pXG4gICAgYnJvd3Nlci5lcnJvcignaW52YWxpZCBpbnB1dCBpbjonLCBzb3VyY2UpXG59XG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFyJywgb3B0TmFtZXNwYWNlKVxufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXJzJywgb3B0TmFtZXNwYWNlKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHVibGljIG1ldGhvZHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcblxudGhpc01vZHVsZS5uYW1lc3BhY2UgPSBmdW5jdGlvbihuYW1lKSB7XG4gIGlmIChuYW1lc3BhY2VzW25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgbmFtZXNwYWNlc1tuYW1lXSA9IG5ldyBOYW1lc3BhY2UobmFtZSlcbiAgcmV0dXJuIG5hbWVzcGFjZXNbbmFtZV1cbn1cblxudGhpc01vZHVsZS5tYWtlR3JhbW1hciA9IG1ha2VHcmFtbWFyXG50aGlzTW9kdWxlLm1ha2VHcmFtbWFycyA9IG1ha2VHcmFtbWFyc1xuXG4vLyBTdHVmZiB0aGF0J3Mgb25seSB1c2VmdWwgZm9yIGJvb3RzdHJhcHBpbmcsIHRlc3RpbmcsIGV0Yy5cblxuLy8gVE9ETzogcmVuYW1lIHRvIF9idWlsZGVyXG50aGlzTW9kdWxlLmJ1aWxkZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCdWlsZGVyKClcbn1cblxudGhpc01vZHVsZS5fbWFrZUdyYW1tYXJBY3Rpb25EaWN0ID0gbWFrZUdyYW1tYXJBY3Rpb25EaWN0XG5cbnZhciBvaG1HcmFtbWFyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkodGhpc01vZHVsZSwgJ19vaG1HcmFtbWFyJywge1xuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghb2htR3JhbW1hcilcbiAgICAgIG9obUdyYW1tYXIgPSB0aGlzLl9vaG1HcmFtbWFyRmFjdG9yeSh0aGlzKVxuICAgIHJldHVybiBvaG1HcmFtbWFyXG4gIH1cbn0pXG5cbiJdfQ==
(7)
});
