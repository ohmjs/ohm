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
    objectUtils.keysAndValuesDo(this.ruleDict, function(ruleName, body) {
      if (first)
        first = false
      else
        buffer.nextPutAll(',')
      buffer.newLine()
      buffer.nextPutAll('  ')
      buffer.newColumn()
      self.addSemanticActionTemplate(ruleName, body, buffer)
    })

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9vaG0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uL3NyYy9vaG0uanMnKVxub2htLl9vaG1HcmFtbWFyRmFjdG9yeSA9XG4oZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIGIgPSBvaG0uYnVpbGRlcigpXG4gIGIuc2V0TmFtZSgnT2htJylcbiAgYi5pbmxpbmUoJ3NwYWNlLXNpbmdsZUxpbmUnLCBiLnNlcShiLl8oJy8vJyksIGIubWFueShiLnNlcShiLm5vdChiLl8oJ1xcbicpKSwgYi5hcHAoJ18nKSksIDApLCBiLl8oJ1xcbicpKSlcbiAgYi5pbmxpbmUoJ3NwYWNlLW11bHRpTGluZScsIGIuc2VxKGIuXygnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCcqLycpKSlcbiAgYi5leHRlbmQoJ3NwYWNlJywgYi5hbHQoYi5hcHAoJ3NwYWNlLXNpbmdsZUxpbmUnKSwgYi5hcHAoJ3NwYWNlLW11bHRpTGluZScpKSlcbiAgYi5kZWZpbmUoJ19uYW1lJywgYi5zZXEoYi5hcHAoJ25hbWVGaXJzdCcpLCBiLm1hbnkoYi5hcHAoJ25hbWVSZXN0JyksIDApKSlcbiAgYi5kZWZpbmUoJ25hbWVGaXJzdCcsIGIuYWx0KGIuXygnXycpLCBiLmFwcCgnbGV0dGVyJykpKVxuICBiLmRlZmluZSgnbmFtZVJlc3QnLCBiLmFsdChiLl8oJ18nKSwgYi5hcHAoJ2FsbnVtJykpKVxuICBiLmRlZmluZSgnbmFtZScsIGIuc2VxKGIubm90KGIuYXBwKCduYW1lZENvbnN0JykpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJykpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC11bmRlZmluZWQnLCBiLnNlcShiLl8oJ3VuZGVmaW5lZCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC1udWxsJywgYi5zZXEoYi5fKCdudWxsJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LXRydWUnLCBiLnNlcShiLl8oJ3RydWUnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtZmFsc2UnLCBiLnNlcShiLl8oJ2ZhbHNlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuZGVmaW5lKCduYW1lZENvbnN0JywgYi5hbHQoYi5hcHAoJ25hbWVkQ29uc3QtdW5kZWZpbmVkJyksIGIuYXBwKCduYW1lZENvbnN0LW51bGwnKSwgYi5hcHAoJ25hbWVkQ29uc3QtdHJ1ZScpLCBiLmFwcCgnbmFtZWRDb25zdC1mYWxzZScpKSlcbiAgYi5kZWZpbmUoJ3N0cmluZycsIGIuc2VxKGIuXyhcIidcIiksIGIuYmluZChiLm1hbnkoYi5hcHAoJ3NDaGFyJyksIDApLCAnY3MnKSwgYi5fKFwiJ1wiKSkpXG4gIGIuZGVmaW5lKCdzQ2hhcicsIGIuYWx0KGIuc2VxKGIuXygnXFxcXHgnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5fKCdcXFxcdScpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXCcpLCBiLmFwcCgnXycpKSwgYi5zZXEoYi5ub3QoYi5fKFwiJ1wiKSksIGIuYXBwKCdfJykpKSlcbiAgYi5kZWZpbmUoJ3JlZ2V4cCcsIGIuc2VxKGIuXygnLycpLCBiLmJpbmQoYi5hcHAoJ3JlQ2hhckNsYXNzJyksICdlJyksIGIuXygnLycpKSlcbiAgYi5kZWZpbmUoJ3JlQ2hhckNsYXNzJywgYi5zZXEoYi5fKCdbJyksIGIubWFueShiLmFsdChiLl8oJ1xcXFxdJyksIGIuc2VxKGIubm90KGIuXygnXScpKSwgYi5hcHAoJ18nKSkpLCAwKSwgYi5fKCddJykpKVxuICBiLmRlZmluZSgnbnVtYmVyJywgYi5zZXEoYi5vcHQoYi5fKCctJykpLCBiLm1hbnkoYi5hcHAoJ2RpZ2l0JyksIDEpKSlcbiAgYi5pbmxpbmUoJ0FsdC1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Rlcm0nKSwgJ3gnKSwgYi5fKCd8JyksIGIuYmluZChiLmFwcCgnQWx0JyksICd5JykpKVxuICBiLmRlZmluZSgnQWx0JywgYi5hbHQoYi5hcHAoJ0FsdC1yZWMnKSwgYi5hcHAoJ1Rlcm0nKSkpXG4gIGIuaW5saW5lKCdUZXJtLWlubGluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnU2VxJyksICd4JyksIGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ1Rlcm0nLCBiLmFsdChiLmFwcCgnVGVybS1pbmxpbmUnKSwgYi5hcHAoJ1NlcScpKSlcbiAgYi5kZWZpbmUoJ1NlcScsIGIubWFueShiLmFwcCgnRmFjdG9yJyksIDApKVxuICBiLmlubGluZSgnRmFjdG9yLWJpbmQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ0l0ZXInKSwgJ3gnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5kZWZpbmUoJ0ZhY3RvcicsIGIuYWx0KGIuYXBwKCdGYWN0b3ItYmluZCcpLCBiLmFwcCgnSXRlcicpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItc3RhcicsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJyonKSkpXG4gIGIuaW5saW5lKCdJdGVyLXBsdXMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCcrJykpKVxuICBiLmlubGluZSgnSXRlci1vcHQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCc/JykpKVxuICBiLmRlZmluZSgnSXRlcicsIGIuYWx0KGIuYXBwKCdJdGVyLXN0YXInKSwgYi5hcHAoJ0l0ZXItcGx1cycpLCBiLmFwcCgnSXRlci1vcHQnKSwgYi5hcHAoJ1ByZWQnKSkpXG4gIGIuaW5saW5lKCdQcmVkLW5vdCcsIGIuc2VxKGIuXygnficpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuaW5saW5lKCdQcmVkLWxvb2thaGVhZCcsIGIuc2VxKGIuXygnJicpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuZGVmaW5lKCdQcmVkJywgYi5hbHQoYi5hcHAoJ1ByZWQtbm90JyksIGIuYXBwKCdQcmVkLWxvb2thaGVhZCcpLCBiLmFwcCgnQmFzZScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtYXBwbGljYXRpb24nLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ3J1bGVOYW1lJyksIGIubm90KGIuYWx0KGIuXygnPT0nKSwgYi5fKCc6PScpLCBiLl8oJys9JykpKSkpXG4gIGIuaW5saW5lKCdCYXNlLXByaW0nLCBiLmFsdChiLmFwcCgnbmFtZWRDb25zdCcpLCBiLmFwcCgnc3RyaW5nJyksIGIuYXBwKCdyZWdleHAnKSwgYi5hcHAoJ251bWJlcicpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtbHN0JywgYi5zZXEoYi5fKCdbJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnXScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utc3RyJywgYi5zZXEoYi5fKCdcIicpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJ1wiJykpKVxuICBiLmlubGluZSgnQmFzZS1wYXJlbicsIGIuc2VxKGIuXygnKCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJyknKSkpXG4gIGIuaW5saW5lKCdCYXNlLW9iaicsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5vcHQoYi5fKCcuLi4nKSksICdsZW5pZW50JyksIGIuXygnfScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utb2JqV2l0aFByb3BzJywgYi5zZXEoYi5fKCd7JyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJyksIGIuYmluZChiLm9wdChiLnNlcShiLl8oJywnKSwgYi5fKCcuLi4nKSkpLCAnbGVuaWVudCcpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdCYXNlJywgYi5hbHQoYi5hcHAoJ0Jhc2UtYXBwbGljYXRpb24nKSwgYi5hcHAoJ0Jhc2UtcHJpbScpLCBiLmFwcCgnQmFzZS1sc3QnKSwgYi5hcHAoJ0Jhc2Utc3RyJyksIGIuYXBwKCdCYXNlLXBhcmVuJyksIGIuYXBwKCdCYXNlLW9iaicpLCBiLmFwcCgnQmFzZS1vYmpXaXRoUHJvcHMnKSkpXG4gIGIuaW5saW5lKCdQcm9wcy1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSwgYi5fKCcsJyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJykpKVxuICBiLmlubGluZSgnUHJvcHMtYmFzZScsIGIuYmluZChiLmFwcCgnUHJvcCcpLCAncCcpKVxuICBiLmRlZmluZSgnUHJvcHMnLCBiLmFsdChiLmFwcCgnUHJvcHMtcmVjJyksIGIuYXBwKCdQcm9wcy1iYXNlJykpKVxuICBiLmRlZmluZSgnUHJvcCcsIGIuc2VxKGIuYmluZChiLmFsdChiLmFwcCgnX25hbWUnKSwgYi5hcHAoJ3N0cmluZycpKSwgJ24nKSwgYi5fKCc6JyksIGIuYmluZChiLmFwcCgnRmFjdG9yJyksICdwJykpKVxuICBiLmlubGluZSgnUnVsZS1kZWZpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5fKCc9PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtb3ZlcnJpZGUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5fKCc6PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtZXh0ZW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnKz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuZGVmaW5lKCdSdWxlJywgYi5hbHQoYi5hcHAoJ1J1bGUtZGVmaW5lJyksIGIuYXBwKCdSdWxlLW92ZXJyaWRlJyksIGIuYXBwKCdSdWxlLWV4dGVuZCcpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnLCBiLnNlcShiLl8oJzw6JyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbnMnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKVxuICBiLmRlZmluZSgnU3VwZXJHcmFtbWFyJywgYi5hbHQoYi5hcHAoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnKSwgYi5hcHAoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcpKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5iaW5kKGIub3B0KGIuYXBwKCdTdXBlckdyYW1tYXInKSksICdzJyksIGIuXygneycpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdSdWxlJyksIDApLCAncnMnKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnR3JhbW1hcnMnLCBiLm1hbnkoYi5hcHAoJ0dyYW1tYXInKSwgMCkpXG4gIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcbn0pXG4iLCJleHBvcnRzLm9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG5leHBvcnRzLnN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi9zdHJpbmdVdGlscy5qcycpXG5leHBvcnRzLmVxdWFscyA9IHJlcXVpcmUoJy4vZXF1YWxzLmpzJylcbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvZ2dpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBzdWJzY3JpYmVkID0ge31cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbihzdWJqZWN0IC8qICwgLi4uICovKSB7XG4gIGlmICghc3Vic2NyaWJlZFtzdWJqZWN0XSlcbiAgICByZXR1cm5cbiAgYXJndW1lbnRzWzBdID0gJ1snICsgc3ViamVjdCArICddJ1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmV4cG9ydHMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzdWJzY3JpYmVkW3N1YmplY3RdID0gdHJ1ZVxufVxuXG5leHBvcnRzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBkZWxldGUgc2hvd2luZ1tzdWJqZWN0XVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXNzZXJ0cywgZXJyb3JzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmVycm9yID0gZnVuY3Rpb24oLyogYXJnMSwgYXJnMiwgLi4uICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3MpXG4gIHRocm93ICdlcnJvcjogJyArIGFyZ3Muam9pbignICcpXG59XG5cbmV4cG9ydHMuc2FuaXR5Q2hlY2sgPSBmdW5jdGlvbihuYW1lLCBjb25kaXRpb24pIHtcbiAgaWYgKCFjb25kaXRpb24pXG4gICAgdGhpc01vZHVsZS5lcnJvcignZmFpbGVkIHNhbml0eSBjaGVjazonLCBuYW1lKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRE9NIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnByZXR0eVByaW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGVuZE5vZGUsIGVuZE9mZnNldCkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSlcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhLnN1YnN0cigwLCBlbmRPZmZzZXQpICsgJ3wnICsgbm9kZS5kYXRhLnN1YnN0cihlbmRPZmZzZXQpICsgJ30nXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEgKyAnfSdcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtub2RlLnRhZ05hbWUsICd7J11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gaWR4KVxuICAgICAgcGFydHMucHVzaCgnfCcpXG4gICAgcGFydHMucHVzaCh0aGlzTW9kdWxlLnByZXR0eVByaW50Tm9kZShub2RlLmNoaWxkTm9kZXMuaXRlbShpZHgpLCBlbmROb2RlLCBlbmRPZmZzZXQpKVxuICB9XG4gIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goJ3wnKVxuICBwYXJ0cy5wdXNoKCd9JylcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cbiIsIi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZG91YmxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT0geVxufVxuXG5mdW5jdGlvbiB0cmlwbGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geVxufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHhcbiAgcmV0dXJuIHR5cGUgIT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh4KSlcbiAgICByZXR1cm4gZXFGbih4LCB5KVxuICBmb3IgKHZhciBwIGluIHgpXG4gICAgaWYgKGRlZXAgJiYgIWVxdWFscyh4W3BdLCB5W3BdLCBkZWVwLCBlcUZuKSB8fFxuICAgICAgICAhZGVlcCAmJiAhZXFGbih4W3BdLCB5W3BdKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBwIGluIHkpXG4gICAgaWYgKHlbcF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB4W3BdID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgZGVlcCwgZXFGbikge1xuICBpZiAoIWFycjEgaW5zdGFuY2VvZiBBcnJheSB8fCAhYXJyMiBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICBhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycjEubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyMVtpZHhdXG4gICAgdmFyIGZvdW5kWCA9IGFycjIuc29tZShmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kWClcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuZGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIgPSBmdW5jdGlvbihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG5leHBvcnRzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGZ1bmN0aW9uKG9iaiwgb3B0UHJvcGVydGllcykge1xuICBmdW5jdGlvbiBjb25zKCkge31cbiAgY29ucy5wcm90b3R5cGUgPSBvYmpcbiAgdmFyIGFucyA9IG5ldyBjb25zKClcbiAgaWYgKG9wdFByb3BlcnRpZXMpXG4gICAgdGhpc01vZHVsZS5rZXlzQW5kVmFsdWVzRG8ob3B0UHJvcGVydGllcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgYW5zW2tdID0gdlxuICAgIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZXhwb3J0cy5mb3JtYWxzID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gZnVuYy5cbiAgICB0b1N0cmluZygpLlxuICAgIG1hdGNoKC9cXCgoLio/KVxcKS8pWzBdLlxuICAgIHJlcGxhY2UoLyAvZywgJycpLlxuICAgIHNsaWNlKDEsIC0xKS5cbiAgICBzcGxpdCgnLCcpLlxuICAgIGZpbHRlcihmdW5jdGlvbihtb2R1bGVOYW1lKSB7IHJldHVybiBtb2R1bGVOYW1lICE9ICcnIH0pXG59XG5cbmV4cG9ydHMua2V5c0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICBmb3IgKHZhciBwIGluIG9iamVjdClcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHApKVxuICAgICAgZm4ocClcbn1cblxuZXhwb3J0cy52YWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihwLCBvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYudmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzQW5kVmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgYW5zID0gW11cbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGFucy5wdXNoKG9iamVjdFtwXSkgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdXG4gIHRoaXMubGVuZ3RoU29GYXIgPSAwXG59XG5cblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnN0cmluZ3MucHVzaChzKVxuICAgIHRoaXMubGVuZ3RoU29GYXIgKz0gcy5sZW5ndGhcbiAgfSxcblxuICBjb250ZW50czogZnVuY3Rpb24oKSAge1xuICAgIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJylcbiAgfVxufVxuXG5leHBvcnRzLnN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFN0cmluZ0J1ZmZlcigpXG59XG5cbmZ1bmN0aW9uIENvbHVtblN0cmluZ0J1ZmZlcigpIHtcbiAgdGhpcy5saW5lcyA9IFtdXG4gIHRoaXMubmV3TGluZSgpXG59XG5cbkNvbHVtblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLmN1cnJlbnRDb2x1bW4oKS5wdXNoKHMpXG4gIH0sXG5cbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIENvbnZlcnQgY29sdW1ucyBmcm9tIGxpc3RzIG9mIHN0cmluZ3MgdG8gc3RyaW5ncywgYW5kIHJlY29yZCBjb2x1bW4gbGVuZ3Roc1xuICAgIHZhciBjb2x1bW5MZW5ndGhzID0gW11cbiAgICB0aGlzLmxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbGluZS5sZW5ndGg7IGNvbElkeCsrKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSBsaW5lW2NvbElkeF1cbiAgICAgICAgbGluZVtjb2xJZHhdID0gY29sdW1uLmpvaW4oJycpXG4gICAgICAgIGlmIChjb2x1bW5MZW5ndGhzW2NvbElkeF0gPT09IHVuZGVmaW5lZCB8fCBjb2x1bW5MZW5ndGhzW2NvbElkeF0gPCBsaW5lW2NvbElkeF0ubGVuZ3RoKVxuICAgICAgICAgIGNvbHVtbkxlbmd0aHNbY29sSWR4XSA9IGxpbmVbY29sSWR4XS5sZW5ndGhcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIHNiID0gdGhpc01vZHVsZS5zdHJpbmdCdWZmZXIoKVxuICAgIHRoaXMubGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBsaW5lLmxlbmd0aDsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbHVtbiA9IGxpbmVbY29sSWR4XVxuICAgICAgICBzYi5uZXh0UHV0QWxsKGNvbHVtbilcbiAgICAgICAgdmFyIG51bVNwYWNlcyA9IGNvbHVtbkxlbmd0aHNbY29sSWR4XSAtIGNvbHVtbi5sZW5ndGhcbiAgICAgICAgd2hpbGUgKG51bVNwYWNlcy0tID4gMClcbiAgICAgICAgICBzYi5uZXh0UHV0QWxsKCcgJylcbiAgICAgIH1cbiAgICAgIHNiLm5leHRQdXRBbGwoJ1xcbicpXG4gICAgfSlcbiAgICByZXR1cm4gc2IuY29udGVudHMoKVxuICB9LFxuXG4gIG5ld0xpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGluZXMucHVzaChbXSlcbiAgICB0aGlzLm5ld0NvbHVtbigpXG4gIH0sXG5cbiAgbmV3Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmN1cnJlbnRMaW5lKCkucHVzaChbXSlcbiAgfSxcblxuICBjdXJyZW50Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuY3VycmVudExpbmUoKVxuICAgIHJldHVybiBsaW5lW2xpbmUubGVuZ3RoIC0gMV1cbiAgfSxcblxuICBjdXJyZW50TGluZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXNbdGhpcy5saW5lcy5sZW5ndGggLSAxXVxuICB9XG59XG5cbmV4cG9ydHMuY29sdW1uU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQ29sdW1uU3RyaW5nQnVmZmVyKClcbn1cblxuIiwidmFyIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBwYWQobnVtYmVyQXNTdHJpbmcsIGxlbikge1xuICB2YXIgemVyb3MgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1iZXJBc1N0cmluZy5sZW5ndGggLSBsZW47IGlkeCsrKVxuICAgIHplcm9zLnB1c2goJzAnKVxuICByZXR1cm4gemVyb3Muam9pbignJykgKyBudW1iZXJBc1N0cmluZ1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge31cbmZvciAodmFyIGMgPSAwOyBjIDwgMTI4OyBjKyspXG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYylcbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSAgPSBcIlxcXFwnXCJcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJ1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxyJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0J1xuZXNjYXBlU3RyaW5nRm9yWydcXHYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx2J1xuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMClcbiAgaWYgKChjID09ICdcIicgfHwgYyA9PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pXG4gICAgcmV0dXJuIGNcbiAgZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpXG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV1cbiAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KVxuICAgIHJldHVybiAnXFxcXHgnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMilcbiAgZWxzZVxuICAgIHJldHVybiAnXFxcXHUnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNClcbn1cblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PSAnXFxcXCcpXG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6ICByZXR1cm4gJ1xcYidcbiAgICAgIGNhc2UgJ2YnOiAgcmV0dXJuICdcXGYnXG4gICAgICBjYXNlICduJzogIHJldHVybiAnXFxuJ1xuICAgICAgY2FzZSAncic6ICByZXR1cm4gJ1xccidcbiAgICAgIGNhc2UgJ3QnOiAgcmV0dXJuICdcXHQnXG4gICAgICBjYXNlICd2JzogIHJldHVybiAnXFx2J1xuICAgICAgY2FzZSAneCc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKVxuICAgICAgY2FzZSAndSc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKVxuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSlcbiAgICB9XG4gIGVsc2VcbiAgICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBwcmludE9uKHgsIHdzKSB7XG4gIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKHhbaWR4XSwgd3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10nKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIHZhciBoYXNTaW5nbGVRdW90ZXMgPSB4LmluZGV4T2YoXCInXCIpID49IDBcbiAgICB2YXIgaGFzRG91YmxlUXVvdGVzID0geC5pbmRleE9mKCdcIicpID49IDBcbiAgICB2YXIgZGVsaW0gPSBoYXNTaW5nbGVRdW90ZXMgJiYgIWhhc0RvdWJsZVF1b3RlcyA/ICdcIicgOiBcIidcIlxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKVxuICAgICAgd3MubmV4dFB1dEFsbCh0aGlzTW9kdWxlLmVzY2FwZUNoYXIoeFtpZHhdLCBkZWxpbSkpXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgfSBlbHNlIGlmICh4ID09PSBudWxsKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnbnVsbCcpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmICEoeCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCd7JylcbiAgICB2YXIgZmlyc3QgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0FuZFZhbHVlc0RvKHgsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKGssIHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnOiAnKVxuICAgICAgcHJpbnRPbih2LCB3cylcbiAgICB9KVxuICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICB9IGVsc2VcbiAgICB3cy5uZXh0UHV0QWxsKCcnICsgeClcbn1cblxuZXhwb3J0cy5wcmludFN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgd3MgPSBvYmplY3RVdGlscy5zdHJpbmdCdWZmZXIoKVxuICBwcmludE9uKG9iaiwgd3MpXG4gIHJldHVybiB3cy5jb250ZW50cygpXG59XG5cbiIsIi8qXG5cblRPRE86XG5cbiogVGhpbmsgYWJvdXQgaW1wcm92aW5nIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiBzeW50YWN0aWMgcnVsZXMnIGF1dG9tYXRpYyBzcGFjZSBza2lwcGluZzpcbiAgLS0gQ291bGQga2VlcCB0cmFjayBvZiB0aGUgY3VycmVudCBydWxlIG5hbWUgYnkgbW9kaWZ5aW5nIHRoZSBjb2RlIChpbiBBcHBseS5ldmFsKSB3aGVyZSBlbnRlciBhbmQgZXhpdCBtZXRob2RzXG4gICAgIGFyZSBjYWxsZWQuIChXb3VsZCBhbHNvIHdhbnQgdG8ga2VlcCB0cmFjayBvZiB3aGV0aGVyIHRoZSBydWxlIGlzIHN5bnRhY3RpYyB0byBhdm9pZCByZS1kb2luZyB0aGF0IHdvcmtcbiAgICAgYXQgZWFjaCBhcHBsaWNhdGlvbi4pXG5cbiogQ29uc2lkZXIgYm9ycm93aW5nIChzb21ldGhpbmcgbGlrZSkgdGhlIHZhcmlhYmxlLW5vdC1vdGhlcndpc2UtbWVudGlvbmVkIGlkZWEgZnJvbSBSb2JieSBGaW5kbGVyJ3MgcmVkZXgsIGFzIGEgd2F5XG4gIHRvIG1ha2UgaXQgZWFzaWVyIGZvciBwcm9ncmFtbWVycyB0byBkZWFsIHdpdGgga2V5d29yZHMgYW5kIGlkZW50aWZpZXJzLlxuXG4qIFRoaW5rIGFib3V0IGEgYmV0dGVyIHdheSB0byBkZWFsIHdpdGggbGlzdHNcbiAgLS0gQnVpbHQtaW4gbGlzdCBvcGVyYXRvcj9cbiAgLS0gUGFyYW1ldGVyaXplZCBydWxlcz9cblxuKiBJbXByb3ZlIHRlc3QgY292ZXJhZ2VcbiAgLS0gQWRkIHRlc3RzIGZvciBzY29waW5nLCBlLmcuLCBcImZvbzphIFtiYXI6YiBiYXo6Y106ZFwiIHNob3VsZCBoYXZlIDQgYmluZGluZ3MuXG4gICAgIChTYW1lIGtpbmQgb2YgdGhpbmcgZm9yIG5lc3RlZCBzdHJpbmcgYW5kIGxvb2thaGVhZCBleHByZXNzaW9ucywgdGhlaXIgYmluZGluZ3Mgc2hvdWxkIGxlYWsgdG8gdGhlIGVuY2xvc2luZyBzZXEuKVxuXG4qIFRoaW5rIGFib3V0IGZvcmVpZ24gcnVsZSBpbnZvY2F0aW9uXG4gIC0tIENhbid0IGp1c3QgYmUgZG9uZSBpbiB0aGUgc2FtZSB3YXkgYXMgaW4gT01ldGEgYi9jIG9mIHRoZSBhY3Rpb25EaWN0XG4gIC0tIFdpbGwgd2FudCB0byBwcmVzZXJ2ZSB0aGUgXCJubyB1bm5lY2Vzc2FyeSBzZW1hbnRpYyBhY3Rpb25zXCIgZ3VhcmFudGVlXG4gIC0tIFRoZSBzb2x1dGlvbiBtaWdodCBiZSB0byBlbmFibGUgdGhlIHByb2dyYW1tZXIgdG8gcHJvdmlkZSBtdWx0aXBsZSBhY3Rpb25EaWN0cyxcbiAgICAgYnV0IEknbGwgaGF2ZSB0byBjb21lIHVwIHdpdGggYSBjb252ZW5pZW50IHdheSB0byBhc3NvY2lhdGUgZWFjaCB3aXRoIGEgcGFydGljdWxhciBncmFtbWFyLlxuXG4qIFRoaW5rIGFib3V0IGluY3JlbWVudGFsIHBhcnNpbmcgKGdvb2QgZm9yIGVkaXRvcnMpXG4gIC0tIEJhc2ljIGlkZWE6IGtlZXAgdHJhY2sgb2YgbWF4IGluZGV4IHNlZW4gdG8gY29tcHV0ZSBhIHJlc3VsdFxuICAgICAoc3RvcmUgdGhpcyBpbiBtZW1vIHJlYyBhcyBhbiBpbnQgcmVsYXRpdmUgdG8gY3VyciBwb3MpXG4gIC0tIE9rIHRvIHJldXNlIG1lbW9pemVkIHZhbHVlIGFzIGxvbmcgYXMgcmFuZ2UgZnJvbSBjdXJyZW50IGluZGV4IHRvIG1heCBpbmRleCBoYXNuJ3QgY2hhbmdlZFxuICAtLSBDb3VsZCBiZSBhIGN1dGUgd29ya3Nob3AgcGFwZXIuLi5cblxuXG5TeW50YXggLyBsYW5ndWFnZSBpZGVhczpcblxuKiBTeW50YXggZm9yIHJ1bGUgZGVjbGFyYXRpb25zOlxuXG4gICAgZm9vID09IGJhciBiYXogICAgIChkZWZpbmUpXG4gICAgZm9vIDo9IGJhciBiYXogICAgIChvdmVycmlkZSAvIHJlcGxhY2UpXG4gICAgZm9vIDw9IGJhciBiYXogICAgIChleHRlbmQpXG5cbiogSW5saW5lIHJ1bGVzLCBlLmcuLFxuXG4gICAgYWRkRXhwciA9IGFkZEV4cHI6eCAnKycgbXVsRXhwcjp5IHtwbHVzfVxuICAgICAgICAgICAgfCBhZGRFeHByOnggJy0nIG11bEV4cHI6eSB7bWludXN9XG4gICAgICAgICAgICB8IG11bEV4cHJcblxuICBpcyBzeW50YWN0aWMgc3VnYXIgZm9yXG5cbiAgICBhZGRFeHByID0gcGx1cyB8IG1pbnVzIHwgbXVsRXhwcixcbiAgICBwbHVzID0gYWRkRXhwcjp4ICcrJyBtdWxFeHByOnksXG4gICAgbWludXMgPSBhZGRFeHByOnggJy0nIG11bEV4cHI6eVxuXG4qIEluIHRoaXMgZXhhbXBsZTpcblxuICAgIGZvbyA9IFwiYmFyXCJcbiAgICBiYXIgPSAnYWJjJ1xuXG4gIFRoZSBmb28gcnVsZSBzYXlzIGl0IHdhbnRzIHRoZSBiYXIgcnVsZSB0byBtYXRjaCB0aGUgY29udGVudHMgb2YgYSBzdHJpbmcgb2JqZWN0LiAoVGhlIFwicyBpcyBhIGtpbmQgb2YgcGFyZW50aGVzaXMuKVxuICBUaGVuIHlvdSBjb3VsZCBlaXRoZXIgc2F5XG5cbiAgICBtLm1hdGNoQWxsKCdhYmMnLCAnYmFyJylcblxuICBvclxuXG4gICAgbS5tYXRjaCgnYWJjJywgJ2ZvbycpXG5cbiAgQm90aCBzaG91bGQgc3VjY2VlZC5cblxuKiBBYm91dCBvYmplY3QgbWF0Y2hpbmdcblxuICBTb21lIGlzc3VlczpcbiAgLS0gU2hvdWxkIGRlZmluaXRlbHkgYWxsb3cgcGF0dGVybiBtYXRjaGluZyBvbiBlYWNoIHByb3BlcnR5J3MgdmFsdWUuIEJ1dCB3aGF0IGFib3V0IHByb3BlcnR5IG5hbWVzP1xuICAtLSBXaGF0IHRvIGRvIGFib3V0IHVuc3BlY2lmaWVkIHByb3BlcnRpZXM/XG4gIC0tIFN5bnRheDogSlNPTiB1c2VzIGNvbG9ucyB0byBzZXBhcmF0ZSBwcm9wZXJ0eSBuYW1lcyBhbmQgdmFsdWVzLiBXaWxsIGxvb2sgYmFkIHcvIGJpbmRpbmdzLCBlLmcuLFxuICAgICB7Zm9vOiBudW1iZXI6bn0gKGV3d3d3KVxuXG4gIEN1cnJlbnQgc3RyYXdtYW46XG4gIC0tIFJlcXVpcmUgcHJvcGVydHkgbmFtZXMgdG8gYmUgc3RyaW5nIGxpdGVyYWxzIChub3QgcGF0dGVybnMpLCBvbmx5IGFsbG93IHBhdHRlcm4gbWF0Y2hpbmcgb24gdGhlaXIgdmFsdWVzLlxuICAtLSBBbGxvdyBhbiBvcHRpb25hbCAnLi4uJyBhcyB0aGUgbGFzdCBwYXR0ZXJuLCB0aGF0IHdvdWxkIG1hdGNoIGFueSB1bnNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICAgICAgIHsnZm9vJzogbnVtYmVyLCAnYmFyJzogc3RyaW5nLCAnYmF6JzogNSwgLi4ufVxuICAgICBNaWdodCBldmVuIGFsbG93IHRoZSAuLi4gdG8gYmUgYm91bmQgdG8gYSB2YXJpYWJsZSB0aGF0IHdvdWxkIGNvbnRhaW4gYWxsIG9mIHRob3NlIHByb3BlcnRpZXMuXG4gIC0tIENvbnNpZGVyIGNoYW5naW5nIGJpbmRpbmcgc3ludGF4IGZyb20gZXhwcjpuYW1lIHRvIGV4cHIubmFtZVxuICAgICAoTW9yZSBKU09OLWZyaWVuZGx5LCBidXQgaXQgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCAuLi4gc3ludGF4LiBCdXQgbWF5YmUgaXQncyBub3Qgc28gaW1wb3J0YW50IHRvIGJlIGFibGUgdG8gYmluZFxuICAgICB0aGUgcmVzdCBvZiB0aGUgcHJvcGVydGllcyBhbmQgdmFsdWVzIGFueXdheSwgc2luY2UgeW91IGNhbiBhbHdheXMgYmluZCB0aGUgZW50aXJlIG9iamVjdC4pXG5cblxuT3B0aW1pemF0aW9uIGlkZWFzOlxuXG4qIE9wdGltaXplICdiaW5kcycgLS0gc2hvdWxkIHByZS1hbGxvY2F0ZSBhbiBhcnJheSBvZiBiaW5kaW5ncyBpbnN0ZWFkIG9mIGRvaW5nIHB1c2hlcywgdGhyb3dpbmcgYXdheSBhcnJheXMgb24gZmFpbFxuICAoc2VlIEFsdCksIGV0Yy5cblxuKiBDb25zaWRlciBhZGRpbmcgYW4gYWRkaXRpb25hbCBjb2RlIGdlbmVyYXRpb24gc3RlcCB0aGF0IGdlbmVyYXRlcyBlZmZpY2llbnQgY29kZSBmcm9tIHRoZSBBU1RzLCBpbnN0ZWFkIG9mXG4gIGludGVycHJldGluZyB0aGVtIGRpcmVjdGx5LlxuXG4qIERvbid0IGJvdGhlciBjcmVhdGluZyB0aHVua3MgLyBsaXN0cyBvZiB0aHVua3Mgd2hlbiB2YWx1ZSBpcyBub3QgbmVlZGVkIChPTWV0YSBkaWQgdGhpcylcbiAgLS0gRS5nLiwgaW4gXCJmb28gPSBzcGFjZSogYmFyXCIgdGhlIHJlc3VsdCBvZiBzcGFjZSogaXMgbm90IG5lZWRlZCwgc28gZG9uJ3QgYm90aGVyIGNyZWF0aW5nIGEgbGlzdCBvZiB0aHVua3MgLyB2YWx1ZXNcbiAgLS0gQ291bGQganVzdCByZXR1cm4gdW5kZWZpbmVkIChhbnl0aGluZyBleGNlcHQgZmFpbClcblxuKiBHZXQgcmlkIG9mIHVubmVjZXNzYXJ5IFNlcXMgYW5kIEFsdHMgKE9NZXRhIGRpZCB0aGlzIHRvbylcblxuKi9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIERlcGVuZGVuY2llc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hci5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBvYmplY3RVdGlscyA9IGF3bGliLm9iamVjdFV0aWxzXG52YXIgc3RyaW5nVXRpbHMgPSBhd2xpYi5zdHJpbmdVdGlsc1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyXG52YXIgZXF1YWxzID0gYXdsaWIuZXF1YWxzXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIZWxwZXJzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxudmFyIGZhaWwgPSB7fVxuXG5mdW5jdGlvbiBnZXREdXBsaWNhdGVzKGFycmF5KSB7XG4gIHZhciBkdXBsaWNhdGVzID0gW11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyYXkubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyYXlbaWR4XVxuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApXG4gICAgICBkdXBsaWNhdGVzLnB1c2goeClcbiAgfVxuICByZXR1cm4gZHVwbGljYXRlc1xufVxuXG5mdW5jdGlvbiBhYnN0cmFjdCgpIHtcbiAgdGhyb3cgJ3RoaXMgbWV0aG9kIGlzIGFic3RyYWN0ISdcbn1cblxuZnVuY3Rpb24gaXNTeW50YWN0aWMocnVsZU5hbWUpIHtcbiAgdmFyIGZpcnN0Q2hhciA9IHJ1bGVOYW1lWzBdXG4gIHJldHVybiAnQScgPD0gZmlyc3RDaGFyICYmIGZpcnN0Q2hhciA8PSAnWidcbn1cblxudmFyIF9hcHBseVNwYWNlc1xuZnVuY3Rpb24gc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pIHtcbiAgKF9hcHBseVNwYWNlcyB8fCAoX2FwcGx5U3BhY2VzID0gbmV3IEFwcGx5KCdzcGFjZXMnKSkpLmV2YWwoZmFsc2UsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgdW5kZWZpbmVkKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW5wdXQgc3RyZWFtc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW5wdXRTdHJlYW0oKSB7XG4gIHRocm93ICdJbnB1dFN0cmVhbSBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuSW5wdXRTdHJlYW0ubmV3Rm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJylcbiAgICByZXR1cm4gbmV3IFN0cmluZ0lucHV0U3RyZWFtKG9iailcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgcmV0dXJuIG5ldyBMaXN0SW5wdXRTdHJlYW0ob2JqKVxuICBlbHNlXG4gICAgdGhyb3cgJ2Nhbm5vdCBtYWtlIGlucHV0IHN0cmVhbSBmb3IgJyArIG9ialxufVxuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlXG4gICAgdGhpcy5wb3MgPSAwXG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdXG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyUG9zID0gdGhpcy5wb3NcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMucG9zSW5mb3NbY3VyclBvc11cbiAgICByZXR1cm4gcG9zSW5mbyB8fCAodGhpcy5wb3NJbmZvc1tjdXJyUG9zXSA9IG5ldyBQb3NJbmZvKGN1cnJQb3MpKVxuICB9LFxuXG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aFxuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmF0RW5kKCkgPyBmYWlsIDogdGhpcy5zb3VyY2VbdGhpcy5wb3MrK11cbiAgfSxcblxuICBtYXRjaEV4YWN0bHk6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXh0KCkgPT09IHggPyB0cnVlIDogZmFpbFxuICB9LFxuXG4gIGludGVydmFsOiBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0SWR4LCBlbmRJZHgpXG4gIH1cbn1cblxuZnVuY3Rpb24gU3RyaW5nSW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpXG59XG5cblN0cmluZ0lucHV0U3RyZWFtLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspXG4gICAgICBpZiAodGhpcy5tYXRjaEV4YWN0bHkoc1tpZHhdKSA9PT0gZmFpbClcbiAgICAgICAgcmV0dXJuIGZhaWxcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIG1hdGNoUmVnRXhwOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gSU1QT1JUQU5UOiBlIG11c3QgYmUgYSBub24tZ2xvYmFsLCBvbmUtY2hhcmFjdGVyIGV4cHJlc3Npb24sIGUuZy4sIC8uLyBhbmQgL1swLTldL1xuICAgIHZhciBjID0gdGhpcy5uZXh0KClcbiAgICByZXR1cm4gYyAhPT0gZmFpbCAmJiBlLnRlc3QoYykgPyB0cnVlIDogZmFpbFxuICB9XG59KVxuXG5mdW5jdGlvbiBMaXN0SW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpXG59XG5cbkxpc3RJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KHMpXG4gIH0sXG4gICAgXG4gIG1hdGNoUmVnRXhwOiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KGUpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFBvc0luZm8ocG9zKSB7XG4gIHRoaXMucG9zID0gcG9zXG4gIHRoaXMucnVsZVN0YWNrID0gW11cbiAgdGhpcy5hY3RpdmVSdWxlcyA9IHt9ICAvLyByZWR1bmRhbnQgZGF0YSAoY291bGQgYmUgZ2VuZXJhdGVkIGZyb20gcnVsZVN0YWNrKSwgZXhpc3RzIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXG4gIHRoaXMubWVtbyA9IHt9XG59XG5cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICBpc0FjdGl2ZTogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV1cbiAgfSxcblxuICBlbnRlcjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLnJ1bGVTdGFjay5wdXNoKHJ1bGVOYW1lKVxuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gdHJ1ZVxuICB9LFxuXG4gIGV4aXQ6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5ydWxlU3RhY2sucG9wKClcbiAgICB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSA9IGZhbHNlXG4gIH0sXG5cbiAgc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQ6IGZ1bmN0aW9uKG1lbW9SZWMpIHtcbiAgICB2YXIgaW52b2x2ZWRSdWxlcyA9IG1lbW9SZWMuaW52b2x2ZWRSdWxlc1xuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIGludm9sdmVkUnVsZXMpXG4gICAgICBpZiAoaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gJiYgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0pXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIHJldHVybiB0cnVlXG4gIH0sXG5cbiAgZ2V0Q3VycmVudExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmxlZnRSZWN1cnNpb25TdGFjayA/IHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrW3RoaXMubGVmdFJlY3Vyc2lvblN0YWNrLmxlbmd0aCAtIDFdIDogdW5kZWZpbmVkXG4gIH0sXG5cbiAgc3RhcnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICghdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2spXG4gICAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjayA9IFtdXG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucHVzaCh7bmFtZTogcnVsZU5hbWUsIHZhbHVlOiBmYWlsLCBwb3M6IC0xLCBpbnZvbHZlZFJ1bGVzOiB7fX0pXG4gICAgdGhpcy51cGRhdGVJbnZvbHZlZFJ1bGVzKClcbiAgfSxcblxuICBlbmRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnBvcCgpXG4gIH0sXG5cbiAgdXBkYXRlSW52b2x2ZWRSdWxlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzXG4gICAgdmFyIGxyUnVsZU5hbWUgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5uYW1lXG4gICAgdmFyIGlkeCA9IHRoaXMucnVsZVN0YWNrLmxlbmd0aCAtIDFcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlU3RhY2tbaWR4LS1dXG4gICAgICBpZiAocnVsZU5hbWUgPT09IGxyUnVsZU5hbWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEludGVydmFsc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW50ZXJ2YWwoc291cmNlLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gIHRoaXMuc291cmNlID0gc291cmNlXG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeFxuICB0aGlzLmVuZElkeCA9IGVuZElkeFxufVxuXG5JbnRlcnZhbC5wcm90b3R5cGUgPSB7XG4gIGNvbnRlbnRzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gSW5wdXRTdHJlYW0ubmV3Rm9yKHRoaXMuc291cmNlKS5pbnRlcnZhbCh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeClcbiAgfSxcblxuICBvbmx5RWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRJZHggKyAxICE9PSB0aGlzLmVuZElkeClcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2ludGVydmFsJywgdGhpcywgJ3dhcyBleHBlY3RlZCB0byBjb250YWluIG9ubHkgb25lIGVsZW1lbnQnKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZVt0aGlzLnN0YXJ0SWR4XVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaHVua3Ncbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFRodW5rKCkge31cblxudmFyIG5leHRUaHVua0lkID0gMFxuVGh1bmsucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlkID0gbmV4dFRodW5rSWQrK1xuICB9XG59XG5cbmZ1bmN0aW9uIFJ1bGVUaHVuayhydWxlTmFtZSwgc291cmNlLCBzdGFydElkeCwgZW5kSWR4LCB2YWx1ZSwgYmluZGluZ3MpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG4gIHRoaXMuc291cmNlID0gc291cmNlXG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeFxuICB0aGlzLmVuZElkeCA9IGVuZElkeFxuICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzXG59XG5cblJ1bGVUaHVuay5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oVGh1bmsucHJvdG90eXBlLCB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgaWYgKCFtZW1vLmhhc093blByb3BlcnR5KHRoaXMuaWQpKSB7XG4gICAgICB2YXIgYWN0aW9uID0gdGhpcy5sb29rdXBBY3Rpb24oYWN0aW9uRGljdClcbiAgICAgIHZhciBhZGRsSW5mbyA9IHRoaXMuY3JlYXRlQWRkbEluZm8oKVxuICAgICAgdmFyIGVudiA9IHRoaXMubWFrZUVudihhY3Rpb25EaWN0LCBtZW1vKVxuICAgICAgbWVtb1t0aGlzLmlkXSA9IGFjdGlvbi5jYWxsKGFkZGxJbmZvLCBlbnYpXG4gICAgfVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdXG4gIH0sXG5cbiAgbG9va3VwQWN0aW9uOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZVxuICAgIHZhciBhY3Rpb24gPSBhY3Rpb25EaWN0W3J1bGVOYW1lXVxuICAgIGlmIChhY3Rpb24gPT09IHVuZGVmaW5lZCAmJiBhY3Rpb25EaWN0Ll9kZWZhdWx0ICE9PSB1bmRlZmluZWQpXG4gICAgICBhY3Rpb24gPSBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbkRpY3QuX2RlZmF1bHQuY2FsbCh0aGlzLCBydWxlTmFtZSwgZW52KVxuICAgICAgfVxuICAgIHJldHVybiBhY3Rpb24gfHwgYnJvd3Nlci5lcnJvcignbWlzc2luZyBzZW1hbnRpYyBhY3Rpb24gZm9yJywgcnVsZU5hbWUpXG4gIH0sXG5cbiAgY3JlYXRlQWRkbEluZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcnZhbDogbmV3IEludGVydmFsKHRoaXMuc291cmNlLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeClcbiAgICB9XG4gIH0sXG5cbiAgbWFrZUVudjogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIHZhciBiaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MubGVuZ3RoID09PSAwID8gWyd2YWx1ZScsIHRoaXMudmFsdWVdIDogdGhpcy5iaW5kaW5nc1xuICAgIHZhciBlbnYgPSB7fVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJpbmRpbmdzLmxlbmd0aDsgaWR4ICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gYmluZGluZ3NbaWR4XVxuICAgICAgdmFyIHRodW5rID0gYmluZGluZ3NbaWR4ICsgMV1cbiAgICAgIHRoaXMuYWRkQmluZGluZyhlbnYsIG5hbWUsIHRodW5rLCBhY3Rpb25EaWN0LCBtZW1vKVxuICAgIH1cbiAgICByZXR1cm4gZW52XG4gIH0sXG5cbiAgYWRkQmluZGluZzogZnVuY3Rpb24oZW52LCBuYW1lLCB2YWx1ZSwgYWN0aW9uRGljdCwgbWVtbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnYsIG5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFRodW5rKVxuICAgICAgICAgIHZhbHVlID0gdmFsdWUuZm9yY2UoYWN0aW9uRGljdCwgbWVtbylcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExpc3RUaHVuayh0aHVua3MpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy50aHVua3MgPSB0aHVua3Ncbn1cblxuTGlzdFRodW5rLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAoIW1lbW8uaGFzT3duUHJvcGVydHkodGhpcy5pZCkpXG4gICAgICBtZW1vW3RoaXMuaWRdID0gdGhpcy50aHVua3MubWFwKGZ1bmN0aW9uKHRodW5rKSB7IHJldHVybiB0aHVuay5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKSB9KVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFZhbHVlVGh1bmsodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG59XG5cblZhbHVlVGh1bmsucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLnZhbHVlXG4gIH1cbn0pXG5cbnZhciB2YWx1ZWxlc3NUaHVuayA9IG5ldyBWYWx1ZVRodW5rKHVuZGVmaW5lZClcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFR5cGVzIG9mIHBhdHRlcm5zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBHZW5lcmFsIHN0dWZmXG5cbmZ1bmN0aW9uIFBhdHRlcm4oKSB7XG4gIHRocm93ICdQYXR0ZXJuIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5QYXR0ZXJuLnByb3RvdHlwZSA9IHtcbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW11cbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGFic3RyYWN0LFxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogYWJzdHJhY3QsXG5cbiAgb3V0cHV0UmVjaXBlOiBhYnN0cmFjdFxufVxuXG4vLyBBbnl0aGluZ1xuXG52YXIgYW55dGhpbmcgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgIHZhciB2YWx1ZSA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmICh2YWx1ZSA9PT0gZmFpbClcbiAgICAgIHJldHVybiBmYWlsXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG5ldyBWYWx1ZVRodW5rKHZhbHVlKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgLy8gbm8tb3BcbiAgfVxufSlcblxuLy8gUHJpbWl0aXZlc1xuXG5mdW5jdGlvbiBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5QcmltLm5ld0ZvciA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmxlbmd0aCAhPT0gMSlcbiAgICByZXR1cm4gbmV3IFN0cmluZ1ByaW0ob2JqKVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgcmV0dXJuIG5ldyBSZWdFeHBQcmltKG9iailcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUHJpbShvYmopXG59XG4gICAgXG5QcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgaWYgKHRoaXMubWF0Y2goaW5wdXRTdHJlYW0pID09PSBmYWlsKVxuICAgICAgcmV0dXJuIGZhaWxcbiAgICBlbHNlXG4gICAgICByZXR1cm4gbmV3IFZhbHVlVGh1bmsodGhpcy5vYmopXG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gICAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iailcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge30sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuXygnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5vYmopKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG5mdW5jdGlvbiBTdHJpbmdQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9ialxufVxuXG5TdHJpbmdQcmltLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSwge1xuICBtYXRjaDogZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFJlZ0V4cFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqXG59XG5cblJlZ0V4cFByaW0ucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFByaW0ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIGlmIChpbnB1dFN0cmVhbS5tYXRjaFJlZ0V4cCh0aGlzLm9iaikgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgVmFsdWVUaHVuayhpbnB1dFN0cmVhbS5zb3VyY2Vbb3JpZ1Bvc10pXG4gIH1cbn0pXG5cbi8vIEFsdGVybmF0aW9uXG5cbmZ1bmN0aW9uIEFsdCh0ZXJtcykge1xuICB0aGlzLnRlcm1zID0gdGVybXNcbn1cblxuQWx0LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciBvcmlnTnVtQmluZGluZ3MgPSBiaW5kaW5ncy5sZW5ndGhcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChzeW50YWN0aWMpXG4gICAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy50ZXJtc1tpZHhdLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgaWYgKHZhbHVlICE9PSBmYWlsKVxuICAgICAgICByZXR1cm4gdmFsdWVcbiAgICAgIGVsc2Uge1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICAgIC8vIE5vdGU6IHdoaWxlIHRoZSBmb2xsb3dpbmcgYXNzaWdubWVudCBjb3VsZCBiZSBkb25lIHVuY29uZGl0aW9uYWxseSwgb25seSBkb2luZyBpdCB3aGVuIG5lY2Vzc2FyeSBpc1xuICAgICAgICAvLyBiZXR0ZXIgZm9yIHBlcmZvcm1hbmNlLiBUaGlzIGlzIGIvYyBhc3NpZ25pbmcgdG8gYW4gYXJyYXkncyBsZW5ndGggcHJvcGVydHkgaXMgbW9yZSBleHBlbnNpdmUgdGhhbiBhXG4gICAgICAgIC8vIHR5cGljYWwgYXNzaWdubWVudC5cbiAgICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IG9yaWdOdW1CaW5kaW5ncylcbiAgICAgICAgICBiaW5kaW5ncy5sZW5ndGggPSBvcmlnTnVtQmluZGluZ3NcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhaWxcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgb2sgYi9jIGFsbCB0ZXJtcyBtdXN0IGhhdmUgdGhlIHNhbWUgYmluZGluZ3MgLS0gdGhpcyBwcm9wZXJ0eSBpcyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICAgIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IFtdIDogdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKVxuICB9LFxuXG4gIHByb2R1Y2VzVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIGlmICghdGhpcy50ZXJtc1tpZHhdLnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIGFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVyblxuICAgIHZhciBuYW1lcyA9IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKClcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdXG4gICAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKClcbiAgICAgIHZhciBvdGhlck5hbWVzID0gdGVybS5nZXRCaW5kaW5nTmFtZXMoKVxuICAgICAgaWYgKCFlcXVhbHMuZXF1YWxzKG5hbWVzLCBvdGhlck5hbWVzKSlcbiAgICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGFuIGFsdCB3aXRoIGluY29uc2lzdGVudCBiaW5kaW5nczonLCBuYW1lcywgJ3ZzJywgb3RoZXJOYW1lcylcbiAgICB9XG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuYWx0KCcpXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAoaWR4ID4gMClcbiAgICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgICAgdGhpcy50ZXJtc1tpZHhdLm91dHB1dFJlY2lwZSh3cylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFNlcXVlbmNlc1xuXG5mdW5jdGlvbiBTZXEoZmFjdG9ycykge1xuICB0aGlzLmZhY3RvcnMgPSBmYWN0b3JzXG59XG5cblNlcS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChzeW50YWN0aWMpXG4gICAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdXG4gICAgICB2YXIgdmFsdWUgPSBmYWN0b3IuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICAgIHJldHVybiBmYWlsXG4gICAgfVxuICAgIHJldHVybiB2YWx1ZWxlc3NUaHVua1xuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5hbWVzID0gW11cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KHRoaXMuZmFjdG9yc1tpZHhdLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIHJldHVybiBuYW1lcy5zb3J0KClcbiAgfSxcblxuICBwcm9kdWNlc1ZhbHVlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSxcblxuICBhc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcblxuICAgIHZhciBkdXBsaWNhdGVzID0gZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKVxuICAgIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgZHVwbGljYXRlIGJpbmRpbmdzOicsIGR1cGxpY2F0ZXMpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5zZXEoJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLm91dHB1dFJlY2lwZSh3cylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIEJpbmRpbmdzXG5cbmZ1bmN0aW9uIEJpbmQoZXhwciwgbmFtZSkge1xuICB0aGlzLmV4cHIgPSBleHByXG4gIHRoaXMubmFtZSA9IG5hbWVcbn1cblxuQmluZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgIGlmICh2YWx1ZSAhPT0gZmFpbClcbiAgICAgIGJpbmRpbmdzLnB1c2godGhpcy5uYW1lLCB2YWx1ZSlcbiAgICByZXR1cm4gdmFsdWVcbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbdGhpcy5uYW1lXVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5iaW5kKCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLm5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBJdGVyYXRvcnMgYW5kIG9wdGlvbmFsc1xuXG5mdW5jdGlvbiBNYW55KGV4cHIsIG1pbk51bU1hdGNoZXMpIHtcbiAgdGhpcy5leHByID0gZXhwclxuICB0aGlzLm1pbk51bU1hdGNoZXMgPSBtaW5OdW1NYXRjaGVzXG59XG5cbk1hbnkucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBtYXRjaGVzID0gW11cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGJhY2t0cmFja1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgICAgaWYgKHZhbHVlID09PSBmYWlsKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGJhY2t0cmFja1Bvc1xuICAgICAgICBicmVha1xuICAgICAgfSBlbHNlXG4gICAgICAgIG1hdGNoZXMucHVzaCh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIG1hdGNoZXMubGVuZ3RoIDwgdGhpcy5taW5OdW1NYXRjaGVzID8gIGZhaWwgOiBuZXcgTGlzdFRodW5rKG1hdGNoZXMpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLm1hbnkoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICB3cy5uZXh0UHV0QWxsKHRoaXMubWluTnVtTWF0Y2hlcylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuZnVuY3Rpb24gT3B0KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5PcHQucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSA9PT0gZmFpbCkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgcmV0dXJuIHZhbHVlbGVzc1RodW5rXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gbmV3IExpc3RUaHVuayhbdmFsdWVdKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5vcHQoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBQcmVkaWNhdGVzXG5cbmZ1bmN0aW9uIE5vdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTm90LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgICBpZiAodmFsdWUgIT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2Uge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgcmV0dXJuIHZhbHVlbGVzc1RodW5rXG4gICAgfVxuICB9LFxuXG4gIHByb2R1Y2VzVmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5ub3QoJylcbiAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG5mdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbkxvb2thaGVhZC5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUGF0dGVybi5wcm90b3R5cGUsIHtcbiAgZXZhbDogZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pXG4gICAgaWYgKHZhbHVlICE9PSBmYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmxhKCcpXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgICB3cy5uZXh0UHV0QWxsKCcpJylcbiAgfVxufSlcblxuLy8gU3RyaW5nIGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gU3RyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5TdHIucHJvdG90eXBlID0gb2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvKFBhdHRlcm4ucHJvdG90eXBlLCB7XG4gIGV2YWw6IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgc3RyaW5nID0gaW5wdXRTdHJlYW0ubmV4dCgpXG4gICAgaWYgKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YXIgc3RyaW5nSW5wdXRTdHJlYW0gPSBuZXcgU3RyaW5nSW5wdXRTdHJlYW0oc3RyaW5nKVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgc3RyaW5nSW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgICAgcmV0dXJuIHZhbHVlICE9PSBmYWlsICYmIHN0cmluZ0lucHV0U3RyZWFtLmF0RW5kKCkgPyAgbmV3IFZhbHVlVGh1bmsoc3RyaW5nKSA6IGZhaWxcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLnN0cignKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIExpc3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBMaXN0KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5MaXN0LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIGxpc3QgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgICBpZiAobGlzdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICB2YXIgbGlzdElucHV0U3RyZWFtID0gbmV3IExpc3RJbnB1dFN0cmVhbShsaXN0KVxuICAgICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgbGlzdElucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICAgIHJldHVybiB2YWx1ZSAhPT0gZmFpbCAmJiBsaXN0SW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgVmFsdWVUaHVuayhsaXN0KSA6IGZhaWxcbiAgICB9IGVsc2VcbiAgICAgIHJldHVybiBmYWlsXG4gIH0sXG5cbiAgZ2V0QmluZGluZ05hbWVzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLmxzdCgnKVxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWUgfSlcbiAgdmFyIGR1cGxpY2F0ZXMgPSBnZXREdXBsaWNhdGVzKG5hbWVzKVxuICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKVxuICAgIGJyb3dzZXIuZXJyb3IoJ29iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6JywgZHVwbGljYXRlcylcbiAgZWxzZSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllc1xuICAgIHRoaXMuaXNMZW5pZW50ID0gaXNMZW5pZW50XG4gIH1cbn1cblxuT2JqLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICBpZiAoc3ludGFjdGljKVxuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIG9iaiA9IGlucHV0U3RyZWFtLm5leHQoKVxuICAgIGlmIChvYmogIT09IGZhaWwgJiYgb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSkge1xuICAgICAgdmFyIG51bU93blByb3BlcnRpZXNNYXRjaGVkID0gMFxuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzW2lkeF1cbiAgICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdXG4gICAgICAgIHZhciB2YWx1ZUlucHV0U3RyZWFtID0gbmV3IExpc3RJbnB1dFN0cmVhbShbdmFsdWVdKVxuICAgICAgICB2YXIgbWF0Y2hlZCA9XG4gICAgICAgICAgcHJvcGVydHkucGF0dGVybi5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIHZhbHVlSW5wdXRTdHJlYW0sIGJpbmRpbmdzKSAhPT0gZmFpbCAmJiB2YWx1ZUlucHV0U3RyZWFtLmF0RW5kKClcbiAgICAgICAgaWYgKCFtYXRjaGVkKVxuICAgICAgICAgIHJldHVybiBmYWlsXG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkubmFtZSkpXG4gICAgICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrK1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuaXNMZW5pZW50IHx8IG51bU93blByb3BlcnRpZXNNYXRjaGVkID09PSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA/XG4gICAgICAgIG5ldyBWYWx1ZVRodW5rKG9iaikgOlxuICAgICAgICBmYWlsXG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gZmFpbFxuICB9LFxuXG4gIGdldEJpbmRpbmdOYW1lczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5hbWVzID0gW11cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uZ2V0QmluZGluZ05hbWVzKCkpXG4gICAgcmV0dXJuIG5hbWVzLnNvcnQoKVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG5cbiAgICB2YXIgZHVwbGljYXRlcyA9IGdldER1cGxpY2F0ZXModGhpcy5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKVxuICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGFuIG9iamVjdCBwYXR0ZXJuIHdpdGggZHVwbGljYXRlIGJpbmRpbmdzOicsIGR1cGxpY2F0ZXMpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspXG4gICAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICBmdW5jdGlvbiBvdXRwdXRQcm9wZXJ0eVJlY2lwZShwcm9wKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCd7bmFtZTogJylcbiAgICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcocHJvcC5uYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJywgcGF0dGVybjogJylcbiAgICAgIHByb3AucGF0dGVybi5vdXRwdXRSZWNpcGUod3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCd9JylcbiAgICB9XG5cbiAgICB3cy5uZXh0UHV0QWxsKCdiLm9iaihbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIG91dHB1dFByb3BlcnR5UmVjaXBlKHRoaXMucHJvcGVydGllc1tpZHhdKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCddLCAnKVxuICAgIHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcoISF0aGlzLmlzTGVuaWVudCkpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn0pXG5cbi8vIFJ1bGUgYXBwbGljYXRpb25cblxuZnVuY3Rpb24gQXBwbHkocnVsZU5hbWUpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG59XG5cbkFwcGx5LnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lXG4gICAgdmFyIG9yaWdQb3NJbmZvID0gaW5wdXRTdHJlYW0uZ2V0Q3VycmVudFBvc0luZm8oKVxuICAgIHZhciBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV1cbiAgICBpZiAobWVtb1JlYyAmJiBvcmlnUG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gbWVtb1JlYy5wb3NcbiAgICAgIHJldHVybiBtZW1vUmVjLnZhbHVlXG4gICAgfSBlbHNlIGlmIChvcmlnUG9zSW5mby5pc0FjdGl2ZShydWxlTmFtZSkpIHtcbiAgICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbiAmJiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5uYW1lID09PSBydWxlTmFtZSkge1xuICAgICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZFJ1bGVzKClcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gY3VycmVudExlZnRSZWN1cnNpb24ucG9zXG4gICAgICAgIHJldHVybiBjdXJyZW50TGVmdFJlY3Vyc2lvbi52YWx1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3JpZ1Bvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgICByZXR1cm4gZmFpbFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYm9keSA9IHJ1bGVEaWN0W3J1bGVOYW1lXSB8fCBicm93c2VyLmVycm9yKCd1bmRlZmluZWQgcnVsZScsIHJ1bGVOYW1lKVxuICAgICAgb3JpZ1Bvc0luZm8uZW50ZXIocnVsZU5hbWUpXG4gICAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbikge1xuICAgICAgICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24ubmFtZSA9PT0gcnVsZU5hbWUpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMuaGFuZGxlTGVmdFJlY3Vyc2lvbihib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3NJbmZvLnBvcywgY3VycmVudExlZnRSZWN1cnNpb24sIHZhbHVlKVxuICAgICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID1cbiAgICAgICAgICAgIHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlLCBpbnZvbHZlZFJ1bGVzOiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzfVxuICAgICAgICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24ocnVsZU5hbWUpXG4gICAgICAgIH0gZWxzZSBpZiAoIWN1cnJlbnRMZWZ0UmVjdXJzaW9uLmludm9sdmVkUnVsZXNbcnVsZU5hbWVdKVxuICAgICAgICAgIC8vIE9ubHkgbWVtb2l6ZSBpZiB0aGlzIHJ1bGUgaXMgbm90IGludm9sdmVkIGluIHRoZSBjdXJyZW50IGxlZnQgcmVjdXJzaW9uXG4gICAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX1cbiAgICAgIH0gZWxzZVxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfVxuICAgICAgb3JpZ1Bvc0luZm8uZXhpdChydWxlTmFtZSlcbiAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbiAgfSxcblxuICBldmFsT25jZTogZnVuY3Rpb24oZXhwciwgcnVsZURpY3QsIGlucHV0U3RyZWFtKSB7XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB2YXIgYmluZGluZ3MgPSBbXVxuICAgIHZhciB2YWx1ZSA9IGV4cHIuZXZhbChpc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgICBpZiAodmFsdWUgPT09IGZhaWwpXG4gICAgICByZXR1cm4gZmFpbFxuICAgIGVsc2VcbiAgICAgIHJldHVybiBuZXcgUnVsZVRodW5rKHRoaXMucnVsZU5hbWUsIGlucHV0U3RyZWFtLnNvdXJjZSwgb3JpZ1BvcywgaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZSwgYmluZGluZ3MpXG4gIH0sXG5cbiAgaGFuZGxlTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zLCBjdXJyZW50TGVmdFJlY3Vyc2lvbiwgc2VlZFZhbHVlKSB7XG4gICAgdmFyIHZhbHVlID0gc2VlZFZhbHVlXG4gICAgaWYgKHNlZWRWYWx1ZSAhPT0gZmFpbCkge1xuICAgICAgY3VycmVudExlZnRSZWN1cnNpb24udmFsdWUgPSBzZWVkVmFsdWVcbiAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICAgICAgICBpZiAodmFsdWUgIT09IGZhaWwgJiYgaW5wdXRTdHJlYW0ucG9zID4gY3VycmVudExlZnRSZWN1cnNpb24ucG9zKSB7XG4gICAgICAgICAgY3VycmVudExlZnRSZWN1cnNpb24udmFsdWUgPSB2YWx1ZVxuICAgICAgICAgIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLnBvcyA9IGlucHV0U3RyZWFtLnBvc1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gY3VycmVudExlZnRSZWN1cnNpb24udmFsdWVcbiAgICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5wb3NcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZVxuICB9LFxuXG4gIGFzc2VydE5vRHVwbGljYXRlQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5hcHAoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMucnVsZU5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59KVxuXG4vLyBSdWxlIGV4cGFuc2lvbiAtLSBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gX0V4cGFuZChydWxlTmFtZSwgZ3JhbW1hcikge1xuICBpZiAoZ3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICBicm93c2VyLmVycm9yKCdncmFtbWFyJywgZ3JhbW1hci5uYW1lLCAnZG9lcyBub3QgaGF2ZSBhIHJ1bGUgY2FsbGVkJywgcnVsZU5hbWUpXG4gIGVsc2Uge1xuICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXJcbiAgfVxufVxuXG5fRXhwYW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQYXR0ZXJuLnByb3RvdHlwZSwge1xuICBldmFsOiBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgfSxcblxuICBleHBhbnNpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdyYW1tYXIucnVsZURpY3RbdGhpcy5ydWxlTmFtZV1cbiAgfSxcblxuICBnZXRCaW5kaW5nTmFtZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLmdldEJpbmRpbmdOYW1lcygpXG4gIH0sXG5cbiAgcHJvZHVjZXNWYWx1ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwYW5zaW9uKCkucHJvZHVjZXNWYWx1ZSgpXG4gIH0sXG5cbiAgYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5nczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cGFuc2lvbigpLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG4gIH0sXG5cbiAgYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3M6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgLy8gbm8tb3BcbiAgfVxufSlcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdyYW1tYXJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIocnVsZURpY3QpIHtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0XG59XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBydWxlRGljdDogbmV3IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuXyA9IGFueXRoaW5nXG4gICAgdGhpcy5lbmQgPSBuZXcgTm90KHRoaXMuXylcbiAgICB0aGlzLnNwYWNlID0gUHJpbS5uZXdGb3IoL1tcXHNdLylcbiAgICB0aGlzLnNwYWNlcyA9IG5ldyBNYW55KG5ldyBBcHBseSgnc3BhY2UnKSwgMClcbiAgICB0aGlzLmFsbnVtID0gUHJpbS5uZXdGb3IoL1swLTlhLXpBLVpdLylcbiAgICB0aGlzLmxldHRlciA9IFByaW0ubmV3Rm9yKC9bYS16QS1aXS8pXG4gICAgdGhpcy5sb3dlciA9IFByaW0ubmV3Rm9yKC9bYS16XS8pXG4gICAgdGhpcy51cHBlciA9IFByaW0ubmV3Rm9yKC9bQS1aXS8pXG4gICAgdGhpcy5kaWdpdCA9IFByaW0ubmV3Rm9yKC9bMC05XS8pXG4gICAgdGhpcy5oZXhEaWdpdCA9IFByaW0ubmV3Rm9yKC9bMC05YS1mQS1GXS8pXG4gIH0sXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hDb250ZW50cyhbb2JqXSwgc3RhcnRSdWxlKVxuICB9LFxuXG4gIG1hdGNoQ29udGVudHM6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKG9iailcbiAgICB2YXIgdGh1bmsgPSBuZXcgQXBwbHkoc3RhcnRSdWxlKS5ldmFsKHVuZGVmaW5lZCwgdGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZClcbiAgICBpZiAoaXNTeW50YWN0aWMoc3RhcnRSdWxlKSlcbiAgICAgIHNraXBTcGFjZXModGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaCA9IHRoaXMuYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoLmJpbmQodGhpcylcbiAgICByZXR1cm4gdGh1bmsgPT09IGZhaWwgfHwgIWlucHV0U3RyZWFtLmF0RW5kKCkgP1xuICAgICAgZmFsc2UgOlxuICAgICAgZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgICAgICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2goYWN0aW9uRGljdClcbiAgICAgICAgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIHt9KVxuICAgICAgfVxuICB9LFxuXG4gIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaDogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBydWxlRGljdCA9IHRoaXMucnVsZURpY3RcbiAgICB2YXIgb2sgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0RvKHJ1bGVEaWN0LCBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgaWYgKGFjdGlvbkRpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVyblxuICAgICAgdmFyIGFjdHVhbCA9IG9iamVjdFV0aWxzLmZvcm1hbHMoYWN0aW9uRGljdFtydWxlTmFtZV0pLnNvcnQoKVxuICAgICAgdmFyIGV4cGVjdGVkID0gc2VsZi5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKVxuICAgICAgaWYgKCFlcXVhbHMuZXF1YWxzKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgICAgIG9rID0gZmFsc2VcbiAgICAgICAgY29uc29sZS5sb2coJ3NlbWFudGljIGFjdGlvbiBmb3IgcnVsZScsIHJ1bGVOYW1lLCAnaGFzIHRoZSB3cm9uZyBhcmd1bWVudCBuYW1lcycpXG4gICAgICAgIGNvbnNvbGUubG9nKCcgIGV4cGVjdGVkJywgZXhwZWN0ZWQpXG4gICAgICAgIGNvbnNvbGUubG9nKCcgICAgYWN0dWFsJywgYWN0dWFsKVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKCFvaylcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ29uZSBvciBtb3JlIHNlbWFudGljIGFjdGlvbnMgaGF2ZSB0aGUgd3JvbmcgYXJndW1lbnQgbmFtZXMgLS0gc2VlIGNvbnNvbGUgZm9yIGRldGFpbHMnKVxuICB9LFxuXG4gIHNlbWFudGljQWN0aW9uQXJnTmFtZXM6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyICYmIHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXSlcbiAgICAgIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hci5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXVxuICAgICAgdmFyIG5hbWVzID0gYm9keS5nZXRCaW5kaW5nTmFtZXMoKVxuICAgICAgcmV0dXJuIG5hbWVzLmxlbmd0aCA+IDAgfHwgYm9keS5wcm9kdWNlc1ZhbHVlKCkgPyBbJ2VudiddIDogW11cbiAgICB9XG4gIH0sXG5cbiAgdG9SZWNpcGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB3cyA9IG9iamVjdFV0aWxzLnN0cmluZ0J1ZmZlcigpXG4gICAgd3MubmV4dFB1dEFsbCgnKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLmJ1aWxkZXIoKVxcbicpXG4gICAgd3MubmV4dFB1dEFsbCgnICBiLnNldE5hbWUoJyk7IHdzLm5leHRQdXRBbGwoc3RyaW5nVXRpbHMucHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7IHdzLm5leHRQdXRBbGwoJylcXG4nKVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5uYW1lICYmIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWVzcGFjZU5hbWUpIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgYi5zZXRTdXBlckdyYW1tYXIob2htLm5hbWVzcGFjZSgnKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykuZ2V0R3JhbW1hcignKVxuICAgICAgd3MubmV4dFB1dEFsbChzdHJpbmdVdGlscy5wcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lKSlcbiAgICAgIHdzLm5leHRQdXRBbGwoJykpXFxuJylcbiAgICB9XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5ydWxlRGVjbHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICAnKVxuICAgICAgdGhpcy5ydWxlRGVjbHNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCdcXG4nKVxuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcgIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJ30pJylcbiAgICByZXR1cm4gd3MuY29udGVudHMoKVxuICB9LFxuXG4gIHRvU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24oLyogZW50cnlQb2ludDEsIGVudHJ5UG9pbnQyLCAuLi4gKi8pIHtcbiAgICAvLyBUT0RPOiBhZGQgdGhlIHN1cGVyLWdyYW1tYXIncyB0ZW1wbGF0ZXMgYXQgdGhlIHJpZ2h0IHBsYWNlLCBlLmcuLCBhIGNhc2UgZm9yIEFkZEV4cHItcGx1cyBzaG91bGQgYXBwZWFyIG5leHQgdG9cbiAgICAvLyBvdGhlciBjYXNlcyBvZiBBZGQtRXhwci5cbiAgICAvLyBUT0RPOiBpZiB0aGUgY2FsbGVyIHN1cHBsaWVzIGVudHJ5IHBvaW50cywgb25seSBpbmNsdWRlIHRlbXBsYXRlcyBmb3IgcnVsZXMgdGhhdCBhcmUgcmVhY2hhYmxlIGluIHRoZSBjYWxsIGdyYXBoLlxuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBidWZmZXIgPSBvYmplY3RVdGlscy5jb2x1bW5TdHJpbmdCdWZmZXIoKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd7JylcblxuICAgIHZhciBmaXJzdCA9IHRydWVcbiAgICBvYmplY3RVdGlscy5rZXlzQW5kVmFsdWVzRG8odGhpcy5ydWxlRGljdCwgZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBidWZmZXIubmV4dFB1dEFsbCgnLCcpXG4gICAgICBidWZmZXIubmV3TGluZSgpXG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnICAnKVxuICAgICAgYnVmZmVyLm5ld0NvbHVtbigpXG4gICAgICBzZWxmLmFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGUocnVsZU5hbWUsIGJvZHksIGJ1ZmZlcilcbiAgICB9KVxuXG4gICAgYnVmZmVyLm5ld0xpbmUoKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd9JylcbiAgICByZXR1cm4gYnVmZmVyLmNvbnRlbnRzKClcbiAgfSxcblxuICBhZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSwgYnVmZmVyKSB7XG4gICAgaWYgKHJ1bGVOYW1lLmluZGV4T2YoJy0nKSA+PSAwKSB7XG4gICAgICBidWZmZXIubmV4dFB1dEFsbChcIidcIilcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKHJ1bGVOYW1lKVxuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoXCInXCIpXG4gICAgfSBlbHNlXG4gICAgICBidWZmZXIubmV4dFB1dEFsbChydWxlTmFtZSlcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnOiAnKVxuICAgIGJ1ZmZlci5uZXdDb2x1bW4oKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCdmdW5jdGlvbignKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKHRoaXMuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSkuam9pbignLCAnKSlcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnKSAnKVxuICAgIGJ1ZmZlci5uZXdDb2x1bW4oKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd7JylcblxuICAgIHZhciBiaW5kaW5ncyA9IGJvZHkuZ2V0QmluZGluZ05hbWVzKClcbiAgICBpZiAoYmluZGluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoJyAvKiAnKVxuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoYmluZGluZ3Muam9pbignLCAnKSlcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcgKi8gJylcbiAgICB9XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ30nKVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBCdWlsZGVyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSdWxlRGVjbCgpIHtcbiAgdGhyb3cgJ1J1bGVEZWNsIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5SdWxlRGVjbC5wcm90b3R5cGUgPSB7XG4gIHBlcmZvcm1DaGVja3M6IGFic3RyYWN0LFxuXG4gIHBlcmZvcm1Db21tb25DaGVja3M6IGZ1bmN0aW9uKG5hbWUsIGJvZHkpIHtcbiAgICBib2R5LmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MobmFtZSlcbiAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKG5hbWUpXG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5XG4gIH0sXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykge1xuICAgIHdzLm5leHRQdXRBbGwoJ2IuJylcbiAgICB3cy5uZXh0UHV0QWxsKHRoaXMua2luZClcbiAgICB3cy5uZXh0UHV0QWxsKCcoJylcbiAgICB3cy5uZXh0UHV0QWxsKHN0cmluZ1V0aWxzLnByaW50U3RyaW5nKHRoaXMubmFtZSkpXG4gICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHRoaXMuYm9keS5vdXRwdXRSZWNpcGUod3MpXG4gICAgd3MubmV4dFB1dEFsbCgnKScpXG4gIH1cbn1cblxuZnVuY3Rpb24gRGVmaW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuRGVmaW5lLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2RlZmluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZGVmaW5lIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGFscmVhZHkgZXhpc3RzIGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IG92ZXJyaWRlIG9yIGV4dGVuZCBpbnN0ZWFkLiknKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gT3ZlcnJpZGUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWVcbiAgdGhpcy5ib2R5ID0gYm9keVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5PdmVycmlkZS5wcm90b3R5cGUgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdvdmVycmlkZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG92ZXJyaWRkZW4gPSB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdXG4gICAgaWYgKCFvdmVycmlkZGVuKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IG92ZXJyaWRlIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgIGlmIChvdmVycmlkZGVuLmdldEJpbmRpbmdOYW1lcygpLmxlbmd0aCA9PT0gMCAmJiBvdmVycmlkZGVuLnByb2R1Y2VzVmFsdWUoKSAmJiAhdGhpcy5ib2R5LnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ3RoZSBib2R5IG9mIHJ1bGUnLCB0aGlzLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICdtdXN0IHByb2R1Y2UgYSB2YWx1ZSwgYmVjYXVzZSB0aGUgcnVsZSBpdFxcJ3Mgb3ZlcnJpZGluZyBhbHNvIHByb2R1Y2VzIGEgdmFsdWUnKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gSW5saW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuSW5saW5lLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2lubGluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgcmVsYXhpbmcgdGhpcyBjaGVjaywgZS5nLiwgbWFrZSBpdCBvayB0byBvdmVycmlkZSBhbiBpbmxpbmUgcnVsZSBpZiB0aGUgbmVzdGluZyBydWxlIGlzXG4gICAgLy8gYW4gb3ZlcnJpZGUuIEJ1dCBvbmx5IGlmIHRoZSBpbmxpbmUgcnVsZSB0aGF0J3MgYmVpbmcgb3ZlcnJpZGRlbiBpcyBuZXN0ZWQgaW5zaWRlIHRoZSBuZXN0aW5nIHJ1bGUgdGhhdFxuICAgIC8vIHdlJ3JlIG92ZXJyaWRpbmc/IEhvcGVmdWxseSB0aGVyZSdzIGEgbXVjaCBsZXNzIGNvbXBsaWNhdGVkIHdheSB0byBkbyB0aGlzIDopXG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZGVmaW5lIGlubGluZSBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc3VwZXItZ3JhbW1hci4nKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSlcbiAgfVxufSlcblxuZnVuY3Rpb24gRXh0ZW5kKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5leHBhbmRlZEJvZHkgPSBuZXcgQWx0KFtib2R5LCBuZXcgX0V4cGFuZChuYW1lLCBzdXBlckdyYW1tYXIpXSlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuRXh0ZW5kLnByb3RvdHlwZSA9IG9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2V4dGVuZCcsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGV4dGVuZGVkID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXVxuICAgIGlmICghZXh0ZW5kZWQpXG4gICAgICBicm93c2VyLmVycm9yKCdjYW5ub3QgZXh0ZW5kIHJ1bGUnLCB0aGlzLm5hbWUsICdiZWNhdXNlIGl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBzdXBlci1ncmFtbWFyLicsXG4gICAgICAgICAgICAgICAgICAgICcodHJ5IGRlZmluZSBpbnN0ZWFkLiknKVxuICAgIGlmIChleHRlbmRlZC5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgZXh0ZW5kZWQucHJvZHVjZXNWYWx1ZSgpICYmICF0aGlzLmJvZHkucHJvZHVjZXNWYWx1ZSgpKVxuICAgICAgYnJvd3Nlci5lcnJvcigndGhlIGJvZHkgb2YgcnVsZScsIHRoaXMubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgJ211c3QgcHJvZHVjZSBhIHZhbHVlLCBiZWNhdXNlIHRoZSBydWxlIGl0XFwncyBleHRlbmRpbmcgYWxzbyBwcm9kdWNlcyBhIHZhbHVlJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmV4cGFuZGVkQm9keSlcbiAgfSxcblxuICBpbnN0YWxsOiBmdW5jdGlvbihydWxlRGljdCkge1xuICAgIHJ1bGVEaWN0W3RoaXMubmFtZV0gPSB0aGlzLmV4cGFuZGVkQm9keVxuICB9XG59KVxuXG5mdW5jdGlvbiBCdWlsZGVyKCkge1xuICB0aGlzLmluaXQoKVxufVxuXG5CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5uYW1lID0gdW5kZWZpbmVkXG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBHcmFtbWFyLnByb3RvdHlwZVxuICAgIHRoaXMucnVsZURlY2xzID0gW11cbiAgfSxcblxuICBzZXROYW1lOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZVxuICB9LFxuXG4gIHNldFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gZ3JhbW1hclxuICB9LFxuXG4gIGRlZmluZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBEZWZpbmUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgfSxcblxuICBvdmVycmlkZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBPdmVycmlkZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICB9LFxuXG4gIGlubGluZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBJbmxpbmUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSlcbiAgICByZXR1cm4gdGhpcy5hcHAocnVsZU5hbWUpXG4gIH0sXG5cbiAgZXh0ZW5kOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IEV4dGVuZChydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICB9LFxuXG4gIGJ1aWxkOiBmdW5jdGlvbihvcHROYW1lc3BhY2UpIHtcbiAgICB2YXIgc3VwZXJHcmFtbWFyID0gdGhpcy5zdXBlckdyYW1tYXJcbiAgICB2YXIgcnVsZURpY3QgPSBvYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG8oc3VwZXJHcmFtbWFyLnJ1bGVEaWN0KVxuICAgIHRoaXMucnVsZURlY2xzLmZvckVhY2goZnVuY3Rpb24ocnVsZURlY2wpIHtcbiAgICAgIHJ1bGVEZWNsLnBlcmZvcm1DaGVja3MoKVxuICAgICAgcnVsZURlY2wuaW5zdGFsbChydWxlRGljdClcbiAgICB9KVxuXG4gICAgdmFyIGdyYW1tYXIgPSBuZXcgR3JhbW1hcihydWxlRGljdClcbiAgICBncmFtbWFyLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxuICAgIGdyYW1tYXIucnVsZURlY2xzID0gdGhpcy5ydWxlRGVjbHNcbiAgICBpZiAodGhpcy5uYW1lKSB7XG4gICAgICBncmFtbWFyLm5hbWUgPSB0aGlzLm5hbWVcbiAgICAgIGlmIChvcHROYW1lc3BhY2UpIHtcbiAgICAgICAgZ3JhbW1hci5uYW1lc3BhY2VOYW1lID0gb3B0TmFtZXNwYWNlLm5hbWVcbiAgICAgICAgb3B0TmFtZXNwYWNlLmluc3RhbGwodGhpcy5uYW1lLCBncmFtbWFyKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmluaXQoKVxuICAgIHJldHVybiBncmFtbWFyXG4gIH0sXG5cbiAgXzogZnVuY3Rpb24oeCkgeyByZXR1cm4gUHJpbS5uZXdGb3IoeCkgfSxcbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIEFsdClcbiAgICAgICAgdGVybXMgPSB0ZXJtcy5jb25jYXQoYXJnLnRlcm1zKVxuICAgICAgZWxzZVxuICAgICAgICB0ZXJtcy5wdXNoKGFyZylcbiAgICB9XG4gICAgcmV0dXJuIHRlcm1zLmxlbmd0aCA9PT0gMSA/IHRlcm1zWzBdIDogbmV3IEFsdCh0ZXJtcylcbiAgfSxcbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIFNlcSlcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKVxuICAgICAgZWxzZVxuICAgICAgICBmYWN0b3JzLnB1c2goYXJnKVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IFNlcShmYWN0b3JzKVxuICB9LFxuICBiaW5kOiBmdW5jdGlvbihleHByLCBuYW1lKSB7IHJldHVybiBuZXcgQmluZChleHByLCBuYW1lKSB9LFxuICBtYW55OiBmdW5jdGlvbihleHByLCBtaW5OdW1NYXRjaGVzKSB7IHJldHVybiBuZXcgTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB9LFxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBPcHQoZXhwcikgfSxcbiAgbm90OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTm90KGV4cHIpIH0sXG4gIGxhOiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgTG9va2FoZWFkKGV4cHIpIH0sXG4gIHN0cjogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IFN0cihleHByKSB9LFxuICBsc3Q6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBMaXN0KGV4cHIpIH0sXG4gIG9iajogZnVuY3Rpb24ocHJvcGVydGllcywgaXNMZW5pZW50KSB7IHJldHVybiBuZXcgT2JqKHByb3BlcnRpZXMsICEhaXNMZW5pZW50KSB9LFxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7IHJldHVybiBuZXcgQXBwbHkocnVsZU5hbWUpIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5hbWVzcGFjZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBuYW1lc3BhY2VzID0ge31cblxuZnVuY3Rpb24gTmFtZXNwYWNlKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmdyYW1tYXJzID0ge31cbn1cblxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IHtcbiAgaW5zdGFsbDogZnVuY3Rpb24obmFtZSwgZ3JhbW1hcikge1xuICAgIGlmICh0aGlzLmdyYW1tYXJzW25hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignZHVwbGljYXRlIGRlY2xhcmF0aW9uIG9mIGdyYW1tYXInLCBuYW1lLCAnaW4gbmFtZXNwYWNlJywgdGhpcy5uYW1lKVxuICAgIGVsc2VcbiAgICAgIHRoaXMuZ3JhbW1hcnNbbmFtZV0gPSBncmFtbWFyXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcblxuICBnZXRHcmFtbWFyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hcnNbbmFtZV0gfHwgYnJvd3Nlci5lcnJvcignb2htIG5hbWVzcGFjZScsIHRoaXMubmFtZSwgJ2hhcyBubyBncmFtbWFyIGNhbGxlZCcsIG5hbWUpXG4gIH0sXG5cbiAgbG9hZEdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBicm93c2VyLnNhbml0eUNoZWNrKCdzY3JpcHQgdGFnXFwncyB0eXBlIGF0dHJpYnV0ZSBtdXN0IGJlIFwidGV4dC9vaG0tanNcIicsIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQvb2htLWpzJylcbiAgICBtYWtlR3JhbW1hcnMoZWxlbWVudC5pbm5lckhUTUwsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRmFjdG9yaWVzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSB7XG4gIHZhciBidWlsZGVyXG4gIHJldHVybiB7XG4gICAgc3BhY2U6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge30sXG4gICAgJ3NwYWNlLW11bHRpTGluZSc6ICAgICAgICAgIGZ1bmN0aW9uKCkge30sXG4gICAgJ3NwYWNlLXNpbmdsZUxpbmUnOiAgICAgICAgIGZ1bmN0aW9uKCkge30sXG5cbiAgICBfbmFtZTogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICBuYW1lRmlyc3Q6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcbiAgICBuYW1lUmVzdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcblxuICAgIG5hbWU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi5uIH0sXG5cbiAgICBuYW1lZENvbnN0OiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnbmFtZWRDb25zdC11bmRlZmluZWQnOiAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB1bmRlZmluZWQgfSxcbiAgICAnbmFtZWRDb25zdC1udWxsJzogICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBudWxsIH0sXG4gICAgJ25hbWVkQ29uc3QtdHJ1ZSc6ICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gdHJ1ZSB9LFxuICAgICduYW1lZENvbnN0LWZhbHNlJzogICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGZhbHNlIH0sXG5cbiAgICBzdHJpbmc6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudi5jcy5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gc3RyaW5nVXRpbHMudW5lc2NhcGVDaGFyKGMpIH0pLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgc0NoYXI6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cygpIH0sXG4gICAgcmVnZXhwOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gbmV3IFJlZ0V4cChlbnYuZSkgfSxcbiAgICByZUNoYXJDbGFzczogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzKCkgfSxcbiAgICBudW1iZXI6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKCkpIH0sXG5cbiAgICBBbHQ6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnQWx0LXJlYyc6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmFsdChlbnYueCwgZW52LnkpIH0sXG5cbiAgICBUZXJtOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnVGVybS1pbmxpbmUnOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmlubGluZShidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSArICctJyArIGVudi5uLCBlbnYueCkgfSxcblxuICAgIFNlcTogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuc2VxLmFwcGx5KGJ1aWxkZXIsIGVudi52YWx1ZSkgfSxcblxuICAgIEZhY3RvcjogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdGYWN0b3ItYmluZCc6ICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYmluZChlbnYueCwgZW52Lm4pIH0sXG5cbiAgICBJdGVyOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnSXRlci1zdGFyJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm1hbnkoZW52LngsIDApIH0sXG4gICAgJ0l0ZXItcGx1cyc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5tYW55KGVudi54LCAxKSB9LFxuICAgICdJdGVyLW9wdCc6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIub3B0KGVudi54KSB9LFxuXG4gICAgUHJlZDogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH0sXG4gICAgJ1ByZWQtbm90JzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5ub3QoZW52LngpIH0sXG4gICAgJ1ByZWQtbG9va2FoZWFkJzogICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5sYShlbnYueCkgfSxcblxuICAgIEJhc2U6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdCYXNlLXVuZGVmaW5lZCc6ICAgICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIGJ1aWxkZXIuXyh1bmRlZmluZWQpIH0sXG4gICAgJ0Jhc2UtbnVsbCc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKG51bGwpIH0sXG4gICAgJ0Jhc2UtdHJ1ZSc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKHRydWUpIH0sXG4gICAgJ0Jhc2UtZmFsc2UnOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKGZhbHNlKSB9LFxuICAgICdCYXNlLWFwcGxpY2F0aW9uJzogICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGVudi5ydWxlTmFtZSkgfSxcbiAgICAnQmFzZS1wcmltJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLl8oZW52LnZhbHVlKSB9LFxuICAgICdCYXNlLWxzdCc6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubHN0KGVudi54KSB9LFxuICAgICdCYXNlLXN0cic6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuc3RyKGVudi54KSB9LFxuICAgICdCYXNlLXBhcmVuJzogICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi54IH0sXG4gICAgJ0Jhc2Utb2JqJzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vYmooW10sIGVudi5sZW5pZW50KSB9LFxuICAgICdCYXNlLW9ialdpdGhQcm9wcyc6ICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIub2JqKGVudi5wcywgZW52LmxlbmllbnQpIH0sXG5cbiAgICBQcm9wczogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnUHJvcHMtYmFzZSc6ICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBbZW52LnBdIH0sXG4gICAgJ1Byb3BzLXJlYyc6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gW2Vudi5wXS5jb25jYXQoZW52LnBzKSB9LFxuICAgIFByb3A6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIHtuYW1lOiBlbnYubiwgcGF0dGVybjogZW52LnB9IH0sXG5cbiAgICBSdWxlOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnUnVsZS1kZWZpbmUnOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmRlZmluZShlbnYubiwgZW52LmIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgJ1J1bGUtb3ZlcnJpZGUnOiAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5vdmVycmlkZShlbnYubiwgZW52LmIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgJ1J1bGUtZXh0ZW5kJzogICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5leHRlbmQoZW52Lm4sIGVudi5iKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgU3VwZXJHcmFtbWFyOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyBidWlsZGVyLnNldFN1cGVyR3JhbW1hcihlbnYudmFsdWUpIH0sXG4gICAgJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnOiAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gdGhpc01vZHVsZS5uYW1lc3BhY2UoZW52Lm5zKS5nZXRHcmFtbWFyKGVudi5uKSB9LFxuICAgICdTdXBlckdyYW1tYXItdW5xdWFsaWZpZWQnOiBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIG9wdE5hbWVzcGFjZS5nZXRHcmFtbWFyKGVudi5uKSB9LFxuXG4gICAgR3JhbW1hcjogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5zZXROYW1lKGVudi5uKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5zICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52LnJzICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYnVpbGQob3B0TmFtZXNwYWNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIEdyYW1tYXJzOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCB3aGF0SXRJcywgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciB0aHVuayA9IHRoaXNNb2R1bGUuX29obUdyYW1tYXIubWF0Y2hDb250ZW50cyhzb3VyY2UsIHdoYXRJdElzKVxuICBpZiAodGh1bmspXG4gICAgcmV0dXJuIHRodW5rKG1ha2VHcmFtbWFyQWN0aW9uRGljdChvcHROYW1lc3BhY2UpKVxuICBlbHNlXG4gICAgLy8gVE9ETzogaW1wcm92ZSBlcnJvciBtZXNzYWdlIChzaG93IHdoYXQgcGFydCBvZiB0aGUgaW5wdXQgaXMgd3JvbmcsIHdoYXQgd2FzIGV4cGVjdGVkLCBldGMuKVxuICAgIGJyb3dzZXIuZXJyb3IoJ2ludmFsaWQgaW5wdXQgaW46Jywgc291cmNlKVxufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICByZXR1cm4gY29tcGlsZUFuZExvYWQoc291cmNlLCAnR3JhbW1hcicsIG9wdE5hbWVzcGFjZSlcbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFycycsIG9wdE5hbWVzcGFjZSlcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFB1YmxpYyBtZXRob2RzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5cbnRoaXNNb2R1bGUubmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAobmFtZXNwYWNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgIG5hbWVzcGFjZXNbbmFtZV0gPSBuZXcgTmFtZXNwYWNlKG5hbWUpXG4gIHJldHVybiBuYW1lc3BhY2VzW25hbWVdXG59XG5cbnRoaXNNb2R1bGUubWFrZUdyYW1tYXIgPSBtYWtlR3JhbW1hclxudGhpc01vZHVsZS5tYWtlR3JhbW1hcnMgPSBtYWtlR3JhbW1hcnNcblxuLy8gU3R1ZmYgdGhhdCdzIG9ubHkgdXNlZnVsIGZvciBib290c3RyYXBwaW5nLCB0ZXN0aW5nLCBldGMuXG5cbi8vIFRPRE86IHJlbmFtZSB0byBfYnVpbGRlclxudGhpc01vZHVsZS5idWlsZGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQnVpbGRlcigpXG59XG5cbnRoaXNNb2R1bGUuX21ha2VHcmFtbWFyQWN0aW9uRGljdCA9IG1ha2VHcmFtbWFyQWN0aW9uRGljdFxuXG52YXIgb2htR3JhbW1hclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXNNb2R1bGUsICdfb2htR3JhbW1hcicsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW9obUdyYW1tYXIpXG4gICAgICBvaG1HcmFtbWFyID0gdGhpcy5fb2htR3JhbW1hckZhY3RvcnkodGhpcylcbiAgICByZXR1cm4gb2htR3JhbW1hclxuICB9XG59KVxuXG4iXX0=
(7)
});
