!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/main.js')
ohm._ohmGrammarFactory =
(function(ohm, optNamespace) {
  var b = ohm._builder()
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

},{"../src/main.js":15}],2:[function(_dereq_,module,exports){
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
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = _dereq_('./Grammar.js')
var decls = _dereq_('./decls.js')
var pexprs = _dereq_('./pexprs.js')

var awlib = _dereq_('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

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
    this.ruleDecls.push(new decls.Define(ruleName, body, this.superGrammar))
  },

  override: function(ruleName, body) {
    this.ruleDecls.push(new decls.Override(ruleName, body, this.superGrammar))
  },

  inline: function(ruleName, body) {
    this.ruleDecls.push(new decls.Inline(ruleName, body, this.superGrammar))
    return this.app(ruleName)
  },

  extend: function(ruleName, body) {
    this.ruleDecls.push(new decls.Extend(ruleName, body, this.superGrammar))
  },

  build: function(optNamespace) {
    var superGrammar = this.superGrammar
    var ruleDict = objectThatDelegatesTo(superGrammar.ruleDict)
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

  _: function(x) { return pexprs.makePrim(x) },
  alt: function(/* term1, term1, ... */) {
    var terms = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof pexprs.Alt)
        terms = terms.concat(arg.terms)
      else
        terms.push(arg)
    }
    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms)
  },
  seq: function(/* factor1, factor2, ... */) {
    var factors = []
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx]
      if (arg instanceof pexprs.Seq)
        factors = factors.concat(arg.factors)
      else
        factors.push(arg)
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors)
  },
  bind: function(expr, name) { return new pexprs.Bind(expr, name) },
  many: function(expr, minNumMatches) { return new pexprs.Many(expr, minNumMatches) },
  opt: function(expr) { return new pexprs.Opt(expr) },
  not: function(expr) { return new pexprs.Not(expr) },
  la: function(expr) { return new pexprs.Lookahead(expr) },
  str: function(expr) { return new pexprs.Str(expr) },
  lst: function(expr) { return new pexprs.List(expr) },
  obj: function(properties, isLenient) { return new pexprs.Obj(properties, !!isLenient) },
  app: function(ruleName) { return new pexprs.Apply(ruleName) }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder


},{"./Grammar.js":8,"./decls.js":14,"./pexprs.js":22,"awlib":2}],8:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var InputStream = _dereq_('./InputStream.js')
var pexprs = _dereq_('./pexprs.js')

var awlib = _dereq_('awlib')
var keysDo = awlib.objectUtils.keysDo
var formals = awlib.objectUtils.formals
var makeStringBuffer = awlib.objectUtils.stringBuffer
var makeColumnStringBuffer = awlib.objectUtils.columnStringBuffer
var printString = awlib.stringUtils.printString
var equals = awlib.equals.equals

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(ruleDict) {
  this.ruleDict = ruleDict
}

Grammar.prototype = {
  ruleDict: {
    _: pexprs.anything,
    end: new pexprs.Not(pexprs.anything),
    space: pexprs.makePrim(/[\s]/),
    spaces: new pexprs.Many(new pexprs.Apply('space'), 0),
    alnum: pexprs.makePrim(/[0-9a-zA-Z]/),
    letter: pexprs.makePrim(/[a-zA-Z]/),
    lower: pexprs.makePrim(/[a-z]/),
    upper: pexprs.makePrim(/[A-Z]/),
    digit: pexprs.makePrim(/[0-9]/),
    hexDigit: pexprs.makePrim(/[0-9a-fA-F]/)
  },

  match: function(obj, startRule) {
    return this.matchContents([obj], startRule)
  },

  matchContents: function(obj, startRule) {
    var inputStream = InputStream.newFor(obj)
    var thunk = new pexprs.Apply(startRule).eval(undefined, this.ruleDict, inputStream, undefined)
    if (common.isSyntactic(startRule))
      common.skipSpaces(this.ruleDict, inputStream)
    var assertSemanticActionNamesMatch = this.assertSemanticActionNamesMatch.bind(this)
    return thunk === common.fail || !inputStream.atEnd() ?
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
    keysDo(ruleDict, function(ruleName) {
      if (actionDict[ruleName] === undefined)
        return
      var actual = formals(actionDict[ruleName]).sort()
      var expected = self.semanticActionArgNames(ruleName)
      if (!equals(actual, expected)) {
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
    var ws = makeStringBuffer()
    ws.nextPutAll('(function(ohm, optNamespace) {\n')
    ws.nextPutAll('  var b = ohm._builder()\n')
    ws.nextPutAll('  b.setName('); ws.nextPutAll(printString(this.name)); ws.nextPutAll(')\n')
    if (this.superGrammar.name && this.superGrammar.namespaceName) {
      ws.nextPutAll('  b.setSuperGrammar(ohm.namespace(')
      ws.nextPutAll(printString(this.superGrammar.namespaceName))
      ws.nextPutAll(').getGrammar(')
      ws.nextPutAll(printString(this.superGrammar.name))
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
    var buffer = makeColumnStringBuffer()
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
// Exports
// --------------------------------------------------------------------

module.exports = Grammar


},{"./InputStream.js":9,"./common.js":13,"./pexprs.js":22,"awlib":2}],9:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var PosInfo = _dereq_('./PosInfo.js')

var awlib = _dereq_('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo

// --------------------------------------------------------------------
// Private stuff
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
    return this.atEnd() ? common.fail : this.source[this.pos++]
  },

  matchExactly: function(x) {
    return this.next() === x ? true : common.fail
  },

  interval: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx)
  }
}

function StringInputStream(source) {
  this.init(source)
}

StringInputStream.prototype = objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    for (var idx = 0; idx < s.length; idx++)
      if (this.matchExactly(s[idx]) === common.fail)
        return common.fail
    return true
  },

  matchRegExp: function(e) {
    // IMPORTANT: e must be a non-global, one-character expression, e.g., /./ and /[0-9]/
    var c = this.next()
    return c !== common.fail && e.test(c) ? true : common.fail
  }
})

function ListInputStream(source) {
  this.init(source)
}

ListInputStream.prototype = objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    return this.matchExactly(s)
  },

  matchRegExp: function(e) {
    return this.matchExactly(e)
  }
})

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream


},{"./PosInfo.js":12,"./common.js":13,"awlib":2}],10:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = _dereq_('./InputStream.js')

// --------------------------------------------------------------------
// Private stuff
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
// Exports
// --------------------------------------------------------------------

module.exports = Interval


},{"./InputStream.js":9}],11:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = _dereq_('./main.js')

var awlib = _dereq_('awlib')
var browser = awlib.browser

// --------------------------------------------------------------------
// Namespaces
// --------------------------------------------------------------------

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
    ohm.makeGrammars(element.innerHTML, this)
    return this
  },

  make: function(recipe) {
    return recipe(ohm, this)
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Namespace


},{"./main.js":15,"awlib":2}],12:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo(pos) {
  this.pos = pos
  this.ruleStack = []
  this.activeRules = {}  // redundant (could be generated from ruleStack) but useful for performance reasons
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
    this.leftRecursionStack.push({name: ruleName, value: common.fail, pos: -1, involvedRules: {}})
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
// Exports
// --------------------------------------------------------------------

module.exports = function(pos) {
  return new PosInfo(pos)
}


},{"./common.js":13}],13:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js')

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function() {
  throw 'this method is abstract!'
}

exports.getDuplicates = function(array) {
  var duplicates = []
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx]
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0)
      duplicates.push(x)
  }
  return duplicates
}

exports.fail = {}

exports.isSyntactic = function(ruleName) {
  var firstChar = ruleName[0]
  return 'A' <= firstChar && firstChar <= 'Z'
}

var _applySpaces
exports.skipSpaces = function(ruleDict, inputStream) {
  (_applySpaces || (_applySpaces = new pexprs.Apply('spaces'))).eval(false, ruleDict, inputStream, undefined)
}


},{"./pexprs.js":22}],14:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var pexprs = _dereq_('./pexprs.js')

var awlib = _dereq_('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo
var printString = awlib.stringUtils.printString

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function RuleDecl() {
  throw 'RuleDecl cannot be instantiated -- it\'s abstract'
}

RuleDecl.prototype = {
  performChecks: common.abstract,

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
    ws.nextPutAll(printString(this.name))
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

Define.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
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

Override.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
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

Inline.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
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
  this.expandedBody = new pexprs.Alt([body, new pexprs.Expand(name, superGrammar)])
  this.superGrammar = superGrammar
}

Extend.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
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

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleDecl = RuleDecl
exports.Define = Define
exports.Override = Override
exports.Inline = Inline
exports.Extend = Extend


},{"./common.js":13,"./pexprs.js":22,"awlib":2}],15:[function(_dereq_,module,exports){
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
// Imports
// --------------------------------------------------------------------

_dereq_('../dist/ohm-grammar.js')

var Builder = _dereq_('./Builder.js')
var Namespace = _dereq_('./Namespace.js')

var awlib = _dereq_('awlib')
var unescapeChar = awlib.stringUtils.unescapeChar
var browser = awlib.browser

var thisModule = exports

// --------------------------------------------------------------------
// Private stuff
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
                                  return env.cs.map(function(c) { return unescapeChar(c) }).join('')
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
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

var namespaces = {}
exports.namespace = function(name) {
  if (namespaces[name] === undefined)
    namespaces[name] = new Namespace(name)
  return namespaces[name]
}

exports.make = function(recipe) {
  return recipe(thisModule)
}

exports.makeGrammar = makeGrammar
exports.makeGrammars = makeGrammars

// Stuff that's only here for bootstrapping, testing, etc.

exports._builder = function() {
  return new Builder()
}

exports._makeGrammarActionDict = makeGrammarActionDict

var ohmGrammar
Object.defineProperty(exports, '_ohmGrammar', {
  get: function() {
    if (!ohmGrammar)
      ohmGrammar = this._ohmGrammarFactory(this)
    return ohmGrammar
  }
})


},{"../dist/ohm-grammar.js":1,"./Builder.js":7,"./Namespace.js":11,"awlib":2}],16:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var pexprs = _dereq_('./pexprs.js')

var awlib = _dereq_('awlib')
var equals = awlib.equals.equals

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformBindings = common.abstract

pexprs.anything.assertChoicesHaveUniformBindings = function(ruleName) {}

pexprs.Prim.prototype.assertChoicesHaveUniformBindings = function(ruleName) {}

pexprs.Alt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  if (this.terms.length === 0)
    return
  var names = this.terms[0].getBindingNames()
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx]
    term.assertChoicesHaveUniformBindings()
    var otherNames = term.getBindingNames()
    if (!equals(names, otherNames))
      browser.error('rule', ruleName, 'has an alt with inconsistent bindings:', names, 'vs', otherNames)
  }
}

pexprs.Seq.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++)
    this.factors[idx].assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Bind.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Many.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Opt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Not.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Lookahead.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Str.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.List.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Obj.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++)
    this.properties[idx].pattern.assertChoicesHaveUniformBindings(ruleName)
}

pexprs.Apply.prototype.assertChoicesHaveUniformBindings = function(ruleName) {}

pexprs.Expand.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expansion().assertChoicesHaveUniformBindings(ruleName)
}


},{"./common.js":13,"./pexprs.js":22,"awlib":2}],17:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var pexprs = _dereq_('./pexprs.js')

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertNoDuplicateBindings = common.abstract

pexprs.anything.assertNoDuplicateBindings = function(ruleName) {}

pexprs.Prim.prototype.assertNoDuplicateBindings = function(ruleName) {}

pexprs.Alt.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++)
    this.terms[idx].assertNoDuplicateBindings(ruleName)
}

pexprs.Seq.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++)
    this.factors[idx].assertNoDuplicateBindings(ruleName)

  var duplicates = common.getDuplicates(this.getBindingNames())
  if (duplicates.length > 0)
    browser.error('rule', ruleName, 'has duplicate bindings:', duplicates)
}

pexprs.Bind.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.Many.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.Opt.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.Not.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.Lookahead.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.Str.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.List.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName)
}

pexprs.Obj.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++)
    this.properties[idx].pattern.assertNoDuplicateBindings(ruleName)

  var duplicates = common.getDuplicates(this.getBindingNames())
  if (duplicates.length > 0)
    browser.error('rule', ruleName, 'has an object pattern with duplicate bindings:', duplicates)
}

pexprs.Apply.prototype.assertNoDuplicateBindings = function(ruleName) {}

pexprs.Expand.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expansion().assertNoDuplicateBindings(ruleName)
}


},{"./common.js":13,"./pexprs.js":22}],18:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var thunks = _dereq_('./thunks.js')
var pexprs = _dereq_('./pexprs.js')
var InputStream = _dereq_('./InputStream.js')

var awlib = _dereq_('awlib')
var browser = awlib.browser

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.eval = common.abstract

pexprs.anything.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic)
    common.skipSpaces(ruleDict, inputStream)
  var value = inputStream.next()
  if (value === common.fail)
    return common.fail
  else
    return new thunks.ValueThunk(value)
}

pexprs.Prim.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic)
    common.skipSpaces(ruleDict, inputStream)
  if (this.match(inputStream) === common.fail)
    return common.fail
  else
    return new thunks.ValueThunk(this.obj)
}

pexprs.Prim.prototype.match = function(inputStream) {
  return inputStream.matchExactly(this.obj)
}

pexprs.StringPrim.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj)
}

pexprs.RegExpPrim.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic)
    common.skipSpaces(ruleDict, inputStream)
  var origPos = inputStream.pos
  if (inputStream.matchRegExp(this.obj) === common.fail)
    return common.fail
  else
    return new thunks.ValueThunk(inputStream.source[origPos])
}

pexprs.Alt.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
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
}

pexprs.Seq.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (syntactic)
      common.skipSpaces(ruleDict, inputStream)
    var factor = this.factors[idx]
    var value = factor.eval(syntactic, ruleDict, inputStream, bindings)
    if (value === common.fail)
      return common.fail
  }
  return thunks.valuelessThunk
}

pexprs.Bind.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var value = this.expr.eval(syntactic, ruleDict, inputStream, bindings)
  if (value !== common.fail)
    bindings.push(this.name, value)
  return value
}

pexprs.Many.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
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

pexprs.Opt.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos
  var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
  if (value === common.fail) {
    inputStream.pos = origPos
    return thunks.valuelessThunk
  } else
    return new thunks.ListThunk([value])
}

pexprs.Not.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos
  var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
  if (value !== common.fail)
    return common.fail
  else {
    inputStream.pos = origPos
    return thunks.valuelessThunk
  }
}

pexprs.Lookahead.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos
  var value = this.expr.eval(syntactic, ruleDict, inputStream, [])
  if (value !== common.fail) {
    inputStream.pos = origPos
    return value
  } else
    return common.fail
}

pexprs.Str.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic)
    common.skipSpaces(ruleDict, inputStream)
  var string = inputStream.next()
  if (typeof string === 'string') {
    var stringInputStream = InputStream.newFor(string)
    var value = this.expr.eval(syntactic, ruleDict, stringInputStream, bindings)
    return value !== common.fail && stringInputStream.atEnd() ?  new thunks.ValueThunk(string) : common.fail
  } else
    return common.fail
}

pexprs.List.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic)
    common.skipSpaces(ruleDict, inputStream)
  var list = inputStream.next()
  if (list instanceof Array) {
    var listInputStream = InputStream.newFor(list)
    var value = this.expr.eval(syntactic, ruleDict, listInputStream, bindings)
    return value !== common.fail && listInputStream.atEnd() ?  new thunks.ValueThunk(list) : common.fail
  } else
    return common.fail
}

pexprs.Obj.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
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
}

pexprs.Apply.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var ruleName = this.ruleName
  var origPosInfo = inputStream.getCurrentPosInfo()
  var memoRec = origPosInfo.memo[ruleName]
  if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
    inputStream.pos = memoRec.pos
    return memoRec.value
  } else if (origPosInfo.isActive(ruleName)) {
    var currentLR = origPosInfo.getCurrentLeftRecursion()
    if (currentLR && currentLR.name === ruleName) {
      origPosInfo.updateInvolvedRules()
      inputStream.pos = currentLR.pos
      return currentLR.value
    } else {
      origPosInfo.startLeftRecursion(ruleName)
      return common.fail
    }
  } else {
    var body = ruleDict[ruleName] || browser.error('undefined rule', ruleName)
    origPosInfo.enter(ruleName)
    var value = this.evalOnce(body, ruleDict, inputStream)
    var currentLR = origPosInfo.getCurrentLeftRecursion()
    if (currentLR) {
      if (currentLR.name === ruleName) {
        value = this.handleLeftRecursion(body, ruleDict, inputStream, origPosInfo.pos, currentLR, value)
        origPosInfo.memo[ruleName] =
          {pos: inputStream.pos, value: value, involvedRules: currentLR.involvedRules}
        origPosInfo.endLeftRecursion(ruleName)
      } else if (!currentLR.involvedRules[ruleName])
        // Only memoize if this rule is not involved in the current left recursion
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value}
    } else
      origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value}
    origPosInfo.exit(ruleName)
    return value
  }
}

pexprs.Apply.prototype.evalOnce = function(expr, ruleDict, inputStream) {
  var origPos = inputStream.pos
  var bindings = []
  var value = expr.eval(common.isSyntactic(this.ruleName), ruleDict, inputStream, bindings)
  if (value === common.fail)
    return common.fail
  else
    return new thunks.RuleThunk(this.ruleName, inputStream.source, origPos, inputStream.pos, value, bindings)
}

pexprs.Apply.prototype.handleLeftRecursion = function(body, ruleDict, inputStream, origPos, currentLR, seedValue) {
  var value = seedValue
  if (seedValue !== common.fail) {
    currentLR.value = seedValue
    currentLR.pos = inputStream.pos
    while (true) {
      inputStream.pos = origPos
      value = this.evalOnce(body, ruleDict, inputStream)
      if (value !== common.fail && inputStream.pos > currentLR.pos) {
        currentLR.value = value
        currentLR.pos = inputStream.pos
      } else {
        value = currentLR.value
        inputStream.pos = currentLR.pos
        break
      }
    }
  }
  return value
}

pexprs.Expand.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  return this.expansion().eval(syntactic, ruleDict, inputStream, bindings)
}


},{"./InputStream.js":9,"./common.js":13,"./pexprs.js":22,"./thunks.js":23,"awlib":2}],19:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js')

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getBindingNames = function() {
  return []
}

pexprs.Alt.prototype.getBindingNames = function() {
  // This is ok b/c all terms must have the same bindings -- this property is checked by the Grammar constructor.
  return this.terms.length === 0 ? [] : this.terms[0].getBindingNames()
}

pexprs.Seq.prototype.getBindingNames = function() {
  var names = []
  for (var idx = 0; idx < this.factors.length; idx++)
    names = names.concat(this.factors[idx].getBindingNames())
  return names.sort()
}

pexprs.Bind.prototype.getBindingNames = function() {
  return [this.name]
}

pexprs.Lookahead.prototype.getBindingNames = function() {
  return this.expr.getBindingNames()
}

pexprs.Str.prototype.getBindingNames = function() {
  return this.expr.getBindingNames()
}

pexprs.List.prototype.getBindingNames = function() {
  return this.expr.getBindingNames()
}

pexprs.Obj.prototype.getBindingNames = function() {
  var names = []
  for (var idx = 0; idx < this.properties.length; idx++)
    names = names.concat(this.properties[idx].pattern.getBindingNames())
  return names.sort()
}

pexprs.Expand.prototype.getBindingNames = function() {
  return this.expansion().getBindingNames()
}


},{"./pexprs.js":22}],20:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')
var pexprs = _dereq_('./pexprs.js')

var awlib = _dereq_('awlib')
var printString = awlib.stringUtils.printString

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract

pexprs.anything.outputRecipe = function(ws) {
  // no-op
}

pexprs.Prim.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b._(')
  ws.nextPutAll(printString(this.obj))
  ws.nextPutAll(')')
}

pexprs.Alt.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.alt(')
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (idx > 0)
      ws.nextPutAll(', ')
    this.terms[idx].outputRecipe(ws)
  }
  ws.nextPutAll(')')
}

pexprs.Seq.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.seq(')
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (idx > 0)
      ws.nextPutAll(', ')
    this.factors[idx].outputRecipe(ws)
  }
  ws.nextPutAll(')')
}

pexprs.Bind.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.bind(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(', ')
  ws.nextPutAll(printString(this.name))
  ws.nextPutAll(')')
}

pexprs.Many.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.many(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(', ')
  ws.nextPutAll(this.minNumMatches)
  ws.nextPutAll(')')
}

pexprs.Opt.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.opt(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(')')
}

pexprs.Not.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.not(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(')')
}

pexprs.Lookahead.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.la(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(')')
}

pexprs.Str.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.str(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(')')
}

pexprs.List.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.lst(')
  this.expr.outputRecipe(ws)
  ws.nextPutAll(')')
}

pexprs.Obj.prototype.outputRecipe = function(ws) {
  function outputPropertyRecipe(prop) {
    ws.nextPutAll('{name: ')
    ws.nextPutAll(printString(prop.name))
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
  ws.nextPutAll(printString(!!this.isLenient))
  ws.nextPutAll(')')
}

pexprs.Apply.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.app(')
  ws.nextPutAll(printString(this.ruleName))
  ws.nextPutAll(')')
}

pexprs.Expand.prototype.outputRecipe = function(ws) {
  // no-op
}


},{"./common.js":13,"./pexprs.js":22,"awlib":2}],21:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js')

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.producesValue = function() {
  return true
}

pexprs.Alt.prototype.producesValue = function() {
  for (var idx = 0; idx < this.terms.length; idx++)
    if (!this.terms[idx].producesValue())
      return false
  return true
}

pexprs.Seq.prototype.producesValue = function() {
  return false
}

pexprs.Not.prototype.producesValue = function() {
  return false
}

pexprs.Expand.prototype.producesValue = function() {
  return this.expansion().producesValue()
}


},{"./pexprs.js":22}],22:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js')

var awlib = _dereq_('awlib')
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

function PExpr() {
  throw 'PExpr cannot be instantiated -- it\'s abstract'
}

// Anything

var anything = objectThatDelegatesTo(PExpr.prototype)

// Primitives

function Prim(obj) {
  this.obj = obj
}

Prim.prototype = objectThatDelegatesTo(PExpr.prototype)

function StringPrim(obj) {
  this.obj = obj
}

StringPrim.prototype = objectThatDelegatesTo(Prim.prototype)

function RegExpPrim(obj) {
  this.obj = obj
}

RegExpPrim.prototype = objectThatDelegatesTo(Prim.prototype)

// Alternation

function Alt(terms) {
  this.terms = terms
}

Alt.prototype = objectThatDelegatesTo(PExpr.prototype)

// Sequences

function Seq(factors) {
  this.factors = factors
}

Seq.prototype = objectThatDelegatesTo(PExpr.prototype)

// Bindings

function Bind(expr, name) {
  this.expr = expr
  this.name = name
}

Bind.prototype = objectThatDelegatesTo(PExpr.prototype)

// Iterators and optionals

function Many(expr, minNumMatches) {
  this.expr = expr
  this.minNumMatches = minNumMatches
}

Many.prototype = objectThatDelegatesTo(PExpr.prototype)

function Opt(expr) {
  this.expr = expr
}

Opt.prototype = objectThatDelegatesTo(PExpr.prototype)

// Predicates

function Not(expr) {
  this.expr = expr
}

Not.prototype = objectThatDelegatesTo(PExpr.prototype)

function Lookahead(expr) {
  this.expr = expr
}

Lookahead.prototype = objectThatDelegatesTo(PExpr.prototype)

// String decomposition

function Str(expr) {
  this.expr = expr
}

Str.prototype = objectThatDelegatesTo(PExpr.prototype)

// List decomposition

function List(expr) {
  this.expr = expr
}

List.prototype = objectThatDelegatesTo(PExpr.prototype)

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

Obj.prototype = objectThatDelegatesTo(PExpr.prototype)

// Rule application

function Apply(ruleName) {
  this.ruleName = ruleName
}

Apply.prototype = objectThatDelegatesTo(PExpr.prototype)

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
  expansion: function() {
    return this.grammar.ruleDict[this.ruleName]
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
exports.StringPrim = StringPrim
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

_dereq_('./pexprs-assertNoDuplicateBindings.js')
_dereq_('./pexprs-assertChoicesHaveUniformBindings.js')
_dereq_('./pexprs-getBindingNames.js')
_dereq_('./pexprs-eval.js')
_dereq_('./pexprs-outputRecipe.js')
_dereq_('./pexprs-producesValue.js')


},{"./common.js":13,"./pexprs-assertChoicesHaveUniformBindings.js":16,"./pexprs-assertNoDuplicateBindings.js":17,"./pexprs-eval.js":18,"./pexprs-getBindingNames.js":19,"./pexprs-outputRecipe.js":20,"./pexprs-producesValue.js":21,"awlib":2}],23:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = _dereq_('./Interval.js')

var awlib = _dereq_('awlib')
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


},{"./Interval.js":10,"awlib":2}]},{},[15])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9CdWlsZGVyLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvR3JhbW1hci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL0lucHV0U3RyZWFtLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvSW50ZXJ2YWwuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9OYW1lc3BhY2UuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9Qb3NJbmZvLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvY29tbW9uLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvZGVjbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9tYWluLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtZXZhbC5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1nZXRCaW5kaW5nTmFtZXMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtb3V0cHV0UmVjaXBlLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLXByb2R1Y2VzVmFsdWUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy90aHVua3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBvaG0gPSByZXF1aXJlKCcuLi9zcmMvbWFpbi5qcycpXG5vaG0uX29obUdyYW1tYXJGYWN0b3J5ID1cbihmdW5jdGlvbihvaG0sIG9wdE5hbWVzcGFjZSkge1xuICB2YXIgYiA9IG9obS5fYnVpbGRlcigpXG4gIGIuc2V0TmFtZSgnT2htJylcbiAgYi5pbmxpbmUoJ3NwYWNlLXNpbmdsZUxpbmUnLCBiLnNlcShiLl8oJy8vJyksIGIubWFueShiLnNlcShiLm5vdChiLl8oJ1xcbicpKSwgYi5hcHAoJ18nKSksIDApLCBiLl8oJ1xcbicpKSlcbiAgYi5pbmxpbmUoJ3NwYWNlLW11bHRpTGluZScsIGIuc2VxKGIuXygnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCcqLycpKSlcbiAgYi5leHRlbmQoJ3NwYWNlJywgYi5hbHQoYi5hcHAoJ3NwYWNlLXNpbmdsZUxpbmUnKSwgYi5hcHAoJ3NwYWNlLW11bHRpTGluZScpKSlcbiAgYi5kZWZpbmUoJ19uYW1lJywgYi5zZXEoYi5hcHAoJ25hbWVGaXJzdCcpLCBiLm1hbnkoYi5hcHAoJ25hbWVSZXN0JyksIDApKSlcbiAgYi5kZWZpbmUoJ25hbWVGaXJzdCcsIGIuYWx0KGIuXygnXycpLCBiLmFwcCgnbGV0dGVyJykpKVxuICBiLmRlZmluZSgnbmFtZVJlc3QnLCBiLmFsdChiLl8oJ18nKSwgYi5hcHAoJ2FsbnVtJykpKVxuICBiLmRlZmluZSgnbmFtZScsIGIuc2VxKGIubm90KGIuYXBwKCduYW1lZENvbnN0JykpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJykpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC11bmRlZmluZWQnLCBiLnNlcShiLl8oJ3VuZGVmaW5lZCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKVxuICBiLmlubGluZSgnbmFtZWRDb25zdC1udWxsJywgYi5zZXEoYi5fKCdudWxsJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuaW5saW5lKCduYW1lZENvbnN0LXRydWUnLCBiLnNlcShiLl8oJ3RydWUnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSlcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3QtZmFsc2UnLCBiLnNlcShiLl8oJ2ZhbHNlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpXG4gIGIuZGVmaW5lKCduYW1lZENvbnN0JywgYi5hbHQoYi5hcHAoJ25hbWVkQ29uc3QtdW5kZWZpbmVkJyksIGIuYXBwKCduYW1lZENvbnN0LW51bGwnKSwgYi5hcHAoJ25hbWVkQ29uc3QtdHJ1ZScpLCBiLmFwcCgnbmFtZWRDb25zdC1mYWxzZScpKSlcbiAgYi5kZWZpbmUoJ3N0cmluZycsIGIuc2VxKGIuXyhcIidcIiksIGIuYmluZChiLm1hbnkoYi5hcHAoJ3NDaGFyJyksIDApLCAnY3MnKSwgYi5fKFwiJ1wiKSkpXG4gIGIuZGVmaW5lKCdzQ2hhcicsIGIuYWx0KGIuc2VxKGIuXygnXFxcXHgnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5fKCdcXFxcdScpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXCcpLCBiLmFwcCgnXycpKSwgYi5zZXEoYi5ub3QoYi5fKFwiJ1wiKSksIGIuYXBwKCdfJykpKSlcbiAgYi5kZWZpbmUoJ3JlZ2V4cCcsIGIuc2VxKGIuXygnLycpLCBiLmJpbmQoYi5hcHAoJ3JlQ2hhckNsYXNzJyksICdlJyksIGIuXygnLycpKSlcbiAgYi5kZWZpbmUoJ3JlQ2hhckNsYXNzJywgYi5zZXEoYi5fKCdbJyksIGIubWFueShiLmFsdChiLl8oJ1xcXFxdJyksIGIuc2VxKGIubm90KGIuXygnXScpKSwgYi5hcHAoJ18nKSkpLCAwKSwgYi5fKCddJykpKVxuICBiLmRlZmluZSgnbnVtYmVyJywgYi5zZXEoYi5vcHQoYi5fKCctJykpLCBiLm1hbnkoYi5hcHAoJ2RpZ2l0JyksIDEpKSlcbiAgYi5pbmxpbmUoJ0FsdC1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Rlcm0nKSwgJ3gnKSwgYi5fKCd8JyksIGIuYmluZChiLmFwcCgnQWx0JyksICd5JykpKVxuICBiLmRlZmluZSgnQWx0JywgYi5hbHQoYi5hcHAoJ0FsdC1yZWMnKSwgYi5hcHAoJ1Rlcm0nKSkpXG4gIGIuaW5saW5lKCdUZXJtLWlubGluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnU2VxJyksICd4JyksIGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ19uYW1lJyksICduJyksIGIuXygnfScpKSlcbiAgYi5kZWZpbmUoJ1Rlcm0nLCBiLmFsdChiLmFwcCgnVGVybS1pbmxpbmUnKSwgYi5hcHAoJ1NlcScpKSlcbiAgYi5kZWZpbmUoJ1NlcScsIGIubWFueShiLmFwcCgnRmFjdG9yJyksIDApKVxuICBiLmlubGluZSgnRmFjdG9yLWJpbmQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ0l0ZXInKSwgJ3gnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5kZWZpbmUoJ0ZhY3RvcicsIGIuYWx0KGIuYXBwKCdGYWN0b3ItYmluZCcpLCBiLmFwcCgnSXRlcicpKSlcbiAgYi5pbmxpbmUoJ0l0ZXItc3RhcicsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJyonKSkpXG4gIGIuaW5saW5lKCdJdGVyLXBsdXMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCcrJykpKVxuICBiLmlubGluZSgnSXRlci1vcHQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5fKCc/JykpKVxuICBiLmRlZmluZSgnSXRlcicsIGIuYWx0KGIuYXBwKCdJdGVyLXN0YXInKSwgYi5hcHAoJ0l0ZXItcGx1cycpLCBiLmFwcCgnSXRlci1vcHQnKSwgYi5hcHAoJ1ByZWQnKSkpXG4gIGIuaW5saW5lKCdQcmVkLW5vdCcsIGIuc2VxKGIuXygnficpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuaW5saW5lKCdQcmVkLWxvb2thaGVhZCcsIGIuc2VxKGIuXygnJicpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpXG4gIGIuZGVmaW5lKCdQcmVkJywgYi5hbHQoYi5hcHAoJ1ByZWQtbm90JyksIGIuYXBwKCdQcmVkLWxvb2thaGVhZCcpLCBiLmFwcCgnQmFzZScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtYXBwbGljYXRpb24nLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ3J1bGVOYW1lJyksIGIubm90KGIuYWx0KGIuXygnPT0nKSwgYi5fKCc6PScpLCBiLl8oJys9JykpKSkpXG4gIGIuaW5saW5lKCdCYXNlLXByaW0nLCBiLmFsdChiLmFwcCgnbmFtZWRDb25zdCcpLCBiLmFwcCgnc3RyaW5nJyksIGIuYXBwKCdyZWdleHAnKSwgYi5hcHAoJ251bWJlcicpKSlcbiAgYi5pbmxpbmUoJ0Jhc2UtbHN0JywgYi5zZXEoYi5fKCdbJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnXScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utc3RyJywgYi5zZXEoYi5fKCdcIicpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJ1wiJykpKVxuICBiLmlubGluZSgnQmFzZS1wYXJlbicsIGIuc2VxKGIuXygnKCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLl8oJyknKSkpXG4gIGIuaW5saW5lKCdCYXNlLW9iaicsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5vcHQoYi5fKCcuLi4nKSksICdsZW5pZW50JyksIGIuXygnfScpKSlcbiAgYi5pbmxpbmUoJ0Jhc2Utb2JqV2l0aFByb3BzJywgYi5zZXEoYi5fKCd7JyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJyksIGIuYmluZChiLm9wdChiLnNlcShiLl8oJywnKSwgYi5fKCcuLi4nKSkpLCAnbGVuaWVudCcpLCBiLl8oJ30nKSkpXG4gIGIuZGVmaW5lKCdCYXNlJywgYi5hbHQoYi5hcHAoJ0Jhc2UtYXBwbGljYXRpb24nKSwgYi5hcHAoJ0Jhc2UtcHJpbScpLCBiLmFwcCgnQmFzZS1sc3QnKSwgYi5hcHAoJ0Jhc2Utc3RyJyksIGIuYXBwKCdCYXNlLXBhcmVuJyksIGIuYXBwKCdCYXNlLW9iaicpLCBiLmFwcCgnQmFzZS1vYmpXaXRoUHJvcHMnKSkpXG4gIGIuaW5saW5lKCdQcm9wcy1yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSwgYi5fKCcsJyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJykpKVxuICBiLmlubGluZSgnUHJvcHMtYmFzZScsIGIuYmluZChiLmFwcCgnUHJvcCcpLCAncCcpKVxuICBiLmRlZmluZSgnUHJvcHMnLCBiLmFsdChiLmFwcCgnUHJvcHMtcmVjJyksIGIuYXBwKCdQcm9wcy1iYXNlJykpKVxuICBiLmRlZmluZSgnUHJvcCcsIGIuc2VxKGIuYmluZChiLmFsdChiLmFwcCgnX25hbWUnKSwgYi5hcHAoJ3N0cmluZycpKSwgJ24nKSwgYi5fKCc6JyksIGIuYmluZChiLmFwcCgnRmFjdG9yJyksICdwJykpKVxuICBiLmlubGluZSgnUnVsZS1kZWZpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5fKCc9PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtb3ZlcnJpZGUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5fKCc6PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSlcbiAgYi5pbmxpbmUoJ1J1bGUtZXh0ZW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnKz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpXG4gIGIuZGVmaW5lKCdSdWxlJywgYi5hbHQoYi5hcHAoJ1J1bGUtZGVmaW5lJyksIGIuYXBwKCdSdWxlLW92ZXJyaWRlJyksIGIuYXBwKCdSdWxlLWV4dGVuZCcpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnLCBiLnNlcShiLl8oJzw6JyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbnMnKSwgYi5fKCcuJyksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpKSlcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKVxuICBiLmRlZmluZSgnU3VwZXJHcmFtbWFyJywgYi5hbHQoYi5hcHAoJ1N1cGVyR3JhbW1hci1xdWFsaWZpZWQnKSwgYi5hcHAoJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCcpKSlcbiAgYi5kZWZpbmUoJ0dyYW1tYXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5iaW5kKGIub3B0KGIuYXBwKCdTdXBlckdyYW1tYXInKSksICdzJyksIGIuXygneycpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdSdWxlJyksIDApLCAncnMnKSwgYi5fKCd9JykpKVxuICBiLmRlZmluZSgnR3JhbW1hcnMnLCBiLm1hbnkoYi5hcHAoJ0dyYW1tYXInKSwgMCkpXG4gIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSlcbn0pXG4iLCJleHBvcnRzLm9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG5leHBvcnRzLnN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi9zdHJpbmdVdGlscy5qcycpXG5leHBvcnRzLmVxdWFscyA9IHJlcXVpcmUoJy4vZXF1YWxzLmpzJylcbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvZ2dpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBzdWJzY3JpYmVkID0ge31cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbihzdWJqZWN0IC8qICwgLi4uICovKSB7XG4gIGlmICghc3Vic2NyaWJlZFtzdWJqZWN0XSlcbiAgICByZXR1cm5cbiAgYXJndW1lbnRzWzBdID0gJ1snICsgc3ViamVjdCArICddJ1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmV4cG9ydHMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzdWJzY3JpYmVkW3N1YmplY3RdID0gdHJ1ZVxufVxuXG5leHBvcnRzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBkZWxldGUgc2hvd2luZ1tzdWJqZWN0XVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXNzZXJ0cywgZXJyb3JzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmVycm9yID0gZnVuY3Rpb24oLyogYXJnMSwgYXJnMiwgLi4uICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3MpXG4gIHRocm93ICdlcnJvcjogJyArIGFyZ3Muam9pbignICcpXG59XG5cbmV4cG9ydHMuc2FuaXR5Q2hlY2sgPSBmdW5jdGlvbihuYW1lLCBjb25kaXRpb24pIHtcbiAgaWYgKCFjb25kaXRpb24pXG4gICAgdGhpc01vZHVsZS5lcnJvcignZmFpbGVkIHNhbml0eSBjaGVjazonLCBuYW1lKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRE9NIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnByZXR0eVByaW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGVuZE5vZGUsIGVuZE9mZnNldCkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSlcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhLnN1YnN0cigwLCBlbmRPZmZzZXQpICsgJ3wnICsgbm9kZS5kYXRhLnN1YnN0cihlbmRPZmZzZXQpICsgJ30nXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEgKyAnfSdcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtub2RlLnRhZ05hbWUsICd7J11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gaWR4KVxuICAgICAgcGFydHMucHVzaCgnfCcpXG4gICAgcGFydHMucHVzaCh0aGlzTW9kdWxlLnByZXR0eVByaW50Tm9kZShub2RlLmNoaWxkTm9kZXMuaXRlbShpZHgpLCBlbmROb2RlLCBlbmRPZmZzZXQpKVxuICB9XG4gIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goJ3wnKVxuICBwYXJ0cy5wdXNoKCd9JylcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cbiIsIi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZG91YmxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT0geVxufVxuXG5mdW5jdGlvbiB0cmlwbGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geVxufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHhcbiAgcmV0dXJuIHR5cGUgIT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh4KSlcbiAgICByZXR1cm4gZXFGbih4LCB5KVxuICBmb3IgKHZhciBwIGluIHgpXG4gICAgaWYgKGRlZXAgJiYgIWVxdWFscyh4W3BdLCB5W3BdLCBkZWVwLCBlcUZuKSB8fFxuICAgICAgICAhZGVlcCAmJiAhZXFGbih4W3BdLCB5W3BdKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBwIGluIHkpXG4gICAgaWYgKHlbcF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB4W3BdID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgZGVlcCwgZXFGbikge1xuICBpZiAoIWFycjEgaW5zdGFuY2VvZiBBcnJheSB8fCAhYXJyMiBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICBhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycjEubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyMVtpZHhdXG4gICAgdmFyIGZvdW5kWCA9IGFycjIuc29tZShmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kWClcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuZGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIgPSBmdW5jdGlvbihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG5leHBvcnRzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGZ1bmN0aW9uKG9iaiwgb3B0UHJvcGVydGllcykge1xuICBmdW5jdGlvbiBjb25zKCkge31cbiAgY29ucy5wcm90b3R5cGUgPSBvYmpcbiAgdmFyIGFucyA9IG5ldyBjb25zKClcbiAgaWYgKG9wdFByb3BlcnRpZXMpXG4gICAgdGhpc01vZHVsZS5rZXlzQW5kVmFsdWVzRG8ob3B0UHJvcGVydGllcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgYW5zW2tdID0gdlxuICAgIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZXhwb3J0cy5mb3JtYWxzID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gZnVuYy5cbiAgICB0b1N0cmluZygpLlxuICAgIG1hdGNoKC9cXCgoLio/KVxcKS8pWzBdLlxuICAgIHJlcGxhY2UoLyAvZywgJycpLlxuICAgIHNsaWNlKDEsIC0xKS5cbiAgICBzcGxpdCgnLCcpLlxuICAgIGZpbHRlcihmdW5jdGlvbihtb2R1bGVOYW1lKSB7IHJldHVybiBtb2R1bGVOYW1lICE9ICcnIH0pXG59XG5cbmV4cG9ydHMua2V5c0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICBmb3IgKHZhciBwIGluIG9iamVjdClcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHApKVxuICAgICAgZm4ocClcbn1cblxuZXhwb3J0cy52YWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihwLCBvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYudmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzQW5kVmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgYW5zID0gW11cbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGFucy5wdXNoKG9iamVjdFtwXSkgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdXG4gIHRoaXMubGVuZ3RoU29GYXIgPSAwXG59XG5cblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnN0cmluZ3MucHVzaChzKVxuICAgIHRoaXMubGVuZ3RoU29GYXIgKz0gcy5sZW5ndGhcbiAgfSxcblxuICBjb250ZW50czogZnVuY3Rpb24oKSAge1xuICAgIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJylcbiAgfVxufVxuXG5leHBvcnRzLnN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFN0cmluZ0J1ZmZlcigpXG59XG5cbmZ1bmN0aW9uIENvbHVtblN0cmluZ0J1ZmZlcigpIHtcbiAgdGhpcy5saW5lcyA9IFtdXG4gIHRoaXMubmV3TGluZSgpXG59XG5cbkNvbHVtblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLmN1cnJlbnRDb2x1bW4oKS5wdXNoKHMpXG4gIH0sXG5cbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIENvbnZlcnQgY29sdW1ucyBmcm9tIGxpc3RzIG9mIHN0cmluZ3MgdG8gc3RyaW5ncywgYW5kIHJlY29yZCBjb2x1bW4gbGVuZ3Roc1xuICAgIHZhciBjb2x1bW5MZW5ndGhzID0gW11cbiAgICB0aGlzLmxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbGluZS5sZW5ndGg7IGNvbElkeCsrKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSBsaW5lW2NvbElkeF1cbiAgICAgICAgbGluZVtjb2xJZHhdID0gY29sdW1uLmpvaW4oJycpXG4gICAgICAgIGlmIChjb2x1bW5MZW5ndGhzW2NvbElkeF0gPT09IHVuZGVmaW5lZCB8fCBjb2x1bW5MZW5ndGhzW2NvbElkeF0gPCBsaW5lW2NvbElkeF0ubGVuZ3RoKVxuICAgICAgICAgIGNvbHVtbkxlbmd0aHNbY29sSWR4XSA9IGxpbmVbY29sSWR4XS5sZW5ndGhcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIHNiID0gdGhpc01vZHVsZS5zdHJpbmdCdWZmZXIoKVxuICAgIHRoaXMubGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBsaW5lLmxlbmd0aDsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbHVtbiA9IGxpbmVbY29sSWR4XVxuICAgICAgICBzYi5uZXh0UHV0QWxsKGNvbHVtbilcbiAgICAgICAgdmFyIG51bVNwYWNlcyA9IGNvbHVtbkxlbmd0aHNbY29sSWR4XSAtIGNvbHVtbi5sZW5ndGhcbiAgICAgICAgd2hpbGUgKG51bVNwYWNlcy0tID4gMClcbiAgICAgICAgICBzYi5uZXh0UHV0QWxsKCcgJylcbiAgICAgIH1cbiAgICAgIHNiLm5leHRQdXRBbGwoJ1xcbicpXG4gICAgfSlcbiAgICByZXR1cm4gc2IuY29udGVudHMoKVxuICB9LFxuXG4gIG5ld0xpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGluZXMucHVzaChbXSlcbiAgICB0aGlzLm5ld0NvbHVtbigpXG4gIH0sXG5cbiAgbmV3Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmN1cnJlbnRMaW5lKCkucHVzaChbXSlcbiAgfSxcblxuICBjdXJyZW50Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuY3VycmVudExpbmUoKVxuICAgIHJldHVybiBsaW5lW2xpbmUubGVuZ3RoIC0gMV1cbiAgfSxcblxuICBjdXJyZW50TGluZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXNbdGhpcy5saW5lcy5sZW5ndGggLSAxXVxuICB9XG59XG5cbmV4cG9ydHMuY29sdW1uU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQ29sdW1uU3RyaW5nQnVmZmVyKClcbn1cblxuIiwidmFyIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBwYWQobnVtYmVyQXNTdHJpbmcsIGxlbikge1xuICB2YXIgemVyb3MgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1iZXJBc1N0cmluZy5sZW5ndGggLSBsZW47IGlkeCsrKVxuICAgIHplcm9zLnB1c2goJzAnKVxuICByZXR1cm4gemVyb3Muam9pbignJykgKyBudW1iZXJBc1N0cmluZ1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge31cbmZvciAodmFyIGMgPSAwOyBjIDwgMTI4OyBjKyspXG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYylcbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSAgPSBcIlxcXFwnXCJcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJ1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxyJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0J1xuZXNjYXBlU3RyaW5nRm9yWydcXHYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx2J1xuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMClcbiAgaWYgKChjID09ICdcIicgfHwgYyA9PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pXG4gICAgcmV0dXJuIGNcbiAgZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpXG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV1cbiAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KVxuICAgIHJldHVybiAnXFxcXHgnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMilcbiAgZWxzZVxuICAgIHJldHVybiAnXFxcXHUnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNClcbn1cblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PSAnXFxcXCcpXG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6ICByZXR1cm4gJ1xcYidcbiAgICAgIGNhc2UgJ2YnOiAgcmV0dXJuICdcXGYnXG4gICAgICBjYXNlICduJzogIHJldHVybiAnXFxuJ1xuICAgICAgY2FzZSAncic6ICByZXR1cm4gJ1xccidcbiAgICAgIGNhc2UgJ3QnOiAgcmV0dXJuICdcXHQnXG4gICAgICBjYXNlICd2JzogIHJldHVybiAnXFx2J1xuICAgICAgY2FzZSAneCc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKVxuICAgICAgY2FzZSAndSc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKVxuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSlcbiAgICB9XG4gIGVsc2VcbiAgICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBwcmludE9uKHgsIHdzKSB7XG4gIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKHhbaWR4XSwgd3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10nKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIHZhciBoYXNTaW5nbGVRdW90ZXMgPSB4LmluZGV4T2YoXCInXCIpID49IDBcbiAgICB2YXIgaGFzRG91YmxlUXVvdGVzID0geC5pbmRleE9mKCdcIicpID49IDBcbiAgICB2YXIgZGVsaW0gPSBoYXNTaW5nbGVRdW90ZXMgJiYgIWhhc0RvdWJsZVF1b3RlcyA/ICdcIicgOiBcIidcIlxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKVxuICAgICAgd3MubmV4dFB1dEFsbCh0aGlzTW9kdWxlLmVzY2FwZUNoYXIoeFtpZHhdLCBkZWxpbSkpXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgfSBlbHNlIGlmICh4ID09PSBudWxsKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnbnVsbCcpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmICEoeCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCd7JylcbiAgICB2YXIgZmlyc3QgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0FuZFZhbHVlc0RvKHgsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKGssIHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnOiAnKVxuICAgICAgcHJpbnRPbih2LCB3cylcbiAgICB9KVxuICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICB9IGVsc2VcbiAgICB3cy5uZXh0UHV0QWxsKCcnICsgeClcbn1cblxuZXhwb3J0cy5wcmludFN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgd3MgPSBvYmplY3RVdGlscy5zdHJpbmdCdWZmZXIoKVxuICBwcmludE9uKG9iaiwgd3MpXG4gIHJldHVybiB3cy5jb250ZW50cygpXG59XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hci5qcycpXG52YXIgZGVjbHMgPSByZXF1aXJlKCcuL2RlY2xzLmpzJylcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEJ1aWxkZXIoKSB7XG4gIHRoaXMuaW5pdCgpXG59XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm5hbWUgPSB1bmRlZmluZWRcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IEdyYW1tYXIucHJvdG90eXBlXG4gICAgdGhpcy5ydWxlRGVjbHMgPSBbXVxuICB9LFxuXG4gIHNldE5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gIH0sXG5cbiAgc2V0U3VwZXJHcmFtbWFyOiBmdW5jdGlvbihncmFtbWFyKSB7XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBncmFtbWFyXG4gIH0sXG5cbiAgZGVmaW5lOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLkRlZmluZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICB9LFxuXG4gIG92ZXJyaWRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLk92ZXJyaWRlKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgaW5saW5lOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLklubGluZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKVxuICAgIHJldHVybiB0aGlzLmFwcChydWxlTmFtZSlcbiAgfSxcblxuICBleHRlbmQ6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgZGVjbHMuRXh0ZW5kKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpXG4gIH0sXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdE5hbWVzcGFjZSkge1xuICAgIHZhciBzdXBlckdyYW1tYXIgPSB0aGlzLnN1cGVyR3JhbW1hclxuICAgIHZhciBydWxlRGljdCA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhzdXBlckdyYW1tYXIucnVsZURpY3QpXG4gICAgdGhpcy5ydWxlRGVjbHMuZm9yRWFjaChmdW5jdGlvbihydWxlRGVjbCkge1xuICAgICAgcnVsZURlY2wucGVyZm9ybUNoZWNrcygpXG4gICAgICBydWxlRGVjbC5pbnN0YWxsKHJ1bGVEaWN0KVxuICAgIH0pXG5cbiAgICB2YXIgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKHJ1bGVEaWN0KVxuICAgIGdyYW1tYXIuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG4gICAgZ3JhbW1hci5ydWxlRGVjbHMgPSB0aGlzLnJ1bGVEZWNsc1xuICAgIGlmICh0aGlzLm5hbWUpIHtcbiAgICAgIGdyYW1tYXIubmFtZSA9IHRoaXMubmFtZVxuICAgICAgaWYgKG9wdE5hbWVzcGFjZSkge1xuICAgICAgICBncmFtbWFyLm5hbWVzcGFjZU5hbWUgPSBvcHROYW1lc3BhY2UubmFtZVxuICAgICAgICBvcHROYW1lc3BhY2UuaW5zdGFsbCh0aGlzLm5hbWUsIGdyYW1tYXIpXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpXG4gICAgcmV0dXJuIGdyYW1tYXJcbiAgfSxcblxuICBfOiBmdW5jdGlvbih4KSB7IHJldHVybiBwZXhwcnMubWFrZVByaW0oeCkgfSxcbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5BbHQpXG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcylcbiAgICAgIGVsc2VcbiAgICAgICAgdGVybXMucHVzaChhcmcpXG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBwZXhwcnMuQWx0KHRlcm1zKVxuICB9LFxuICBzZXE6IGZ1bmN0aW9uKC8qIGZhY3RvcjEsIGZhY3RvcjIsIC4uLiAqLykge1xuICAgIHZhciBmYWN0b3JzID0gW11cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdXG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSlcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKVxuICAgICAgZWxzZVxuICAgICAgICBmYWN0b3JzLnB1c2goYXJnKVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IHBleHBycy5TZXEoZmFjdG9ycylcbiAgfSxcbiAgYmluZDogZnVuY3Rpb24oZXhwciwgbmFtZSkgeyByZXR1cm4gbmV3IHBleHBycy5CaW5kKGV4cHIsIG5hbWUpIH0sXG4gIG1hbnk6IGZ1bmN0aW9uKGV4cHIsIG1pbk51bU1hdGNoZXMpIHsgcmV0dXJuIG5ldyBwZXhwcnMuTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB9LFxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuT3B0KGV4cHIpIH0sXG4gIG5vdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5Ob3QoZXhwcikgfSxcbiAgbGE6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuTG9va2FoZWFkKGV4cHIpIH0sXG4gIHN0cjogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5TdHIoZXhwcikgfSxcbiAgbHN0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgcGV4cHJzLkxpc3QoZXhwcikgfSxcbiAgb2JqOiBmdW5jdGlvbihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHsgcmV0dXJuIG5ldyBwZXhwcnMuT2JqKHByb3BlcnRpZXMsICEhaXNMZW5pZW50KSB9LFxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7IHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHJ1bGVOYW1lKSB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXJcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtLmpzJylcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBrZXlzRG8gPSBhd2xpYi5vYmplY3RVdGlscy5rZXlzRG9cbnZhciBmb3JtYWxzID0gYXdsaWIub2JqZWN0VXRpbHMuZm9ybWFsc1xudmFyIG1ha2VTdHJpbmdCdWZmZXIgPSBhd2xpYi5vYmplY3RVdGlscy5zdHJpbmdCdWZmZXJcbnZhciBtYWtlQ29sdW1uU3RyaW5nQnVmZmVyID0gYXdsaWIub2JqZWN0VXRpbHMuY29sdW1uU3RyaW5nQnVmZmVyXG52YXIgcHJpbnRTdHJpbmcgPSBhd2xpYi5zdHJpbmdVdGlscy5wcmludFN0cmluZ1xudmFyIGVxdWFscyA9IGF3bGliLmVxdWFscy5lcXVhbHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEdyYW1tYXIocnVsZURpY3QpIHtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0XG59XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBydWxlRGljdDoge1xuICAgIF86IHBleHBycy5hbnl0aGluZyxcbiAgICBlbmQ6IG5ldyBwZXhwcnMuTm90KHBleHBycy5hbnl0aGluZyksXG4gICAgc3BhY2U6IHBleHBycy5tYWtlUHJpbSgvW1xcc10vKSxcbiAgICBzcGFjZXM6IG5ldyBwZXhwcnMuTWFueShuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZScpLCAwKSxcbiAgICBhbG51bTogcGV4cHJzLm1ha2VQcmltKC9bMC05YS16QS1aXS8pLFxuICAgIGxldHRlcjogcGV4cHJzLm1ha2VQcmltKC9bYS16QS1aXS8pLFxuICAgIGxvd2VyOiBwZXhwcnMubWFrZVByaW0oL1thLXpdLyksXG4gICAgdXBwZXI6IHBleHBycy5tYWtlUHJpbSgvW0EtWl0vKSxcbiAgICBkaWdpdDogcGV4cHJzLm1ha2VQcmltKC9bMC05XS8pLFxuICAgIGhleERpZ2l0OiBwZXhwcnMubWFrZVByaW0oL1swLTlhLWZBLUZdLylcbiAgfSxcblxuICBtYXRjaDogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaENvbnRlbnRzKFtvYmpdLCBzdGFydFJ1bGUpXG4gIH0sXG5cbiAgbWF0Y2hDb250ZW50czogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Iob2JqKVxuICAgIHZhciB0aHVuayA9IG5ldyBwZXhwcnMuQXBwbHkoc3RhcnRSdWxlKS5ldmFsKHVuZGVmaW5lZCwgdGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZClcbiAgICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHN0YXJ0UnVsZSkpXG4gICAgICBjb21tb24uc2tpcFNwYWNlcyh0aGlzLnJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoID0gdGhpcy5hc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2guYmluZCh0aGlzKVxuICAgIHJldHVybiB0aHVuayA9PT0gY29tbW9uLmZhaWwgfHwgIWlucHV0U3RyZWFtLmF0RW5kKCkgP1xuICAgICAgZmFsc2UgOlxuICAgICAgZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgICAgICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2goYWN0aW9uRGljdClcbiAgICAgICAgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIHt9KVxuICAgICAgfVxuICB9LFxuXG4gIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaDogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgIHZhciBydWxlRGljdCA9IHRoaXMucnVsZURpY3RcbiAgICB2YXIgb2sgPSB0cnVlXG4gICAga2V5c0RvKHJ1bGVEaWN0LCBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgaWYgKGFjdGlvbkRpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVyblxuICAgICAgdmFyIGFjdHVhbCA9IGZvcm1hbHMoYWN0aW9uRGljdFtydWxlTmFtZV0pLnNvcnQoKVxuICAgICAgdmFyIGV4cGVjdGVkID0gc2VsZi5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKVxuICAgICAgaWYgKCFlcXVhbHMoYWN0dWFsLCBleHBlY3RlZCkpIHtcbiAgICAgICAgb2sgPSBmYWxzZVxuICAgICAgICBjb25zb2xlLmxvZygnc2VtYW50aWMgYWN0aW9uIGZvciBydWxlJywgcnVsZU5hbWUsICdoYXMgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzJylcbiAgICAgICAgY29uc29sZS5sb2coJyAgZXhwZWN0ZWQnLCBleHBlY3RlZClcbiAgICAgICAgY29uc29sZS5sb2coJyAgICBhY3R1YWwnLCBhY3R1YWwpXG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoIW9rKVxuICAgICAgYnJvd3Nlci5lcnJvcignb25lIG9yIG1vcmUgc2VtYW50aWMgYWN0aW9ucyBoYXZlIHRoZSB3cm9uZyBhcmd1bWVudCBuYW1lcyAtLSBzZWUgY29uc29sZSBmb3IgZGV0YWlscycpXG4gIH0sXG5cbiAgc2VtYW50aWNBY3Rpb25BcmdOYW1lczogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIgJiYgdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbcnVsZU5hbWVdKVxuICAgICAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyLnNlbWFudGljQWN0aW9uQXJnTmFtZXMocnVsZU5hbWUpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdXG4gICAgICB2YXIgbmFtZXMgPSBib2R5LmdldEJpbmRpbmdOYW1lcygpXG4gICAgICByZXR1cm4gbmFtZXMubGVuZ3RoID4gMCB8fCBib2R5LnByb2R1Y2VzVmFsdWUoKSA/IFsnZW52J10gOiBbXVxuICAgIH1cbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdzID0gbWFrZVN0cmluZ0J1ZmZlcigpXG4gICAgd3MubmV4dFB1dEFsbCgnKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLl9idWlsZGVyKClcXG4nKVxuICAgIHdzLm5leHRQdXRBbGwoJyAgYi5zZXROYW1lKCcpOyB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMubmFtZSkpOyB3cy5uZXh0UHV0QWxsKCcpXFxuJylcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIubmFtZSAmJiB0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcgIGIuc2V0U3VwZXJHcmFtbWFyKG9obS5uYW1lc3BhY2UoJylcbiAgICAgIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5zdXBlckdyYW1tYXIubmFtZXNwYWNlTmFtZSkpXG4gICAgICB3cy5uZXh0UHV0QWxsKCcpLmdldEdyYW1tYXIoJylcbiAgICAgIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5zdXBlckdyYW1tYXIubmFtZSkpXG4gICAgICB3cy5uZXh0UHV0QWxsKCcpKVxcbicpXG4gICAgfVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucnVsZURlY2xzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgJylcbiAgICAgIHRoaXMucnVsZURlY2xzW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnXFxuJylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnICByZXR1cm4gYi5idWlsZChvcHROYW1lc3BhY2UpXFxuJylcbiAgICB3cy5uZXh0UHV0QWxsKCd9KScpXG4gICAgcmV0dXJuIHdzLmNvbnRlbnRzKClcbiAgfSxcblxuICB0b1NlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uKC8qIGVudHJ5UG9pbnQxLCBlbnRyeVBvaW50MiwgLi4uICovKSB7XG4gICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByLXBsdXMgc2hvdWxkIGFwcGVhciBuZXh0IHRvXG4gICAgLy8gb3RoZXIgY2FzZXMgb2YgQWRkLUV4cHIuXG4gICAgLy8gVE9ETzogaWYgdGhlIGNhbGxlciBzdXBwbGllcyBlbnRyeSBwb2ludHMsIG9ubHkgaW5jbHVkZSB0ZW1wbGF0ZXMgZm9yIHJ1bGVzIHRoYXQgYXJlIHJlYWNoYWJsZSBpbiB0aGUgY2FsbCBncmFwaC5cbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICB2YXIgYnVmZmVyID0gbWFrZUNvbHVtblN0cmluZ0J1ZmZlcigpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ3snKVxuXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZVxuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIHRoaXMucnVsZURpY3QpIHtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV1cbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICBidWZmZXIubmV4dFB1dEFsbCgnLCcpXG4gICAgICBidWZmZXIubmV3TGluZSgpXG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnICAnKVxuICAgICAgYnVmZmVyLm5ld0NvbHVtbigpXG4gICAgICBzZWxmLmFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGUocnVsZU5hbWUsIGJvZHksIGJ1ZmZlcilcbiAgICB9XG5cbiAgICBidWZmZXIubmV3TGluZSgpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ30nKVxuICAgIHJldHVybiBidWZmZXIuY29udGVudHMoKVxuICB9LFxuXG4gIGFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5LCBidWZmZXIpIHtcbiAgICBpZiAocnVsZU5hbWUuaW5kZXhPZignLScpID49IDApIHtcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKFwiJ1wiKVxuICAgICAgYnVmZmVyLm5leHRQdXRBbGwocnVsZU5hbWUpXG4gICAgICBidWZmZXIubmV4dFB1dEFsbChcIidcIilcbiAgICB9IGVsc2VcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKHJ1bGVOYW1lKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCc6ICcpXG4gICAgYnVmZmVyLm5ld0NvbHVtbigpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ2Z1bmN0aW9uKCcpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwodGhpcy5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKS5qb2luKCcsICcpKVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcpICcpXG4gICAgYnVmZmVyLm5ld0NvbHVtbigpXG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ3snKVxuXG4gICAgdmFyIGJpbmRpbmdzID0gYm9keS5nZXRCaW5kaW5nTmFtZXMoKVxuICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnIC8qICcpXG4gICAgICBidWZmZXIubmV4dFB1dEFsbChiaW5kaW5ncy5qb2luKCcsICcpKVxuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoJyAqLyAnKVxuICAgIH1cbiAgICBidWZmZXIubmV4dFB1dEFsbCgnfScpXG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hclxuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJylcbnZhciBQb3NJbmZvID0gcmVxdWlyZSgnLi9Qb3NJbmZvLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUb1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW5wdXRTdHJlYW0oKSB7XG4gIHRocm93ICdJbnB1dFN0cmVhbSBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxuSW5wdXRTdHJlYW0ubmV3Rm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJylcbiAgICByZXR1cm4gbmV3IFN0cmluZ0lucHV0U3RyZWFtKG9iailcbiAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpXG4gICAgcmV0dXJuIG5ldyBMaXN0SW5wdXRTdHJlYW0ob2JqKVxuICBlbHNlXG4gICAgdGhyb3cgJ2Nhbm5vdCBtYWtlIGlucHV0IHN0cmVhbSBmb3IgJyArIG9ialxufVxuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlXG4gICAgdGhpcy5wb3MgPSAwXG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdXG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyUG9zID0gdGhpcy5wb3NcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMucG9zSW5mb3NbY3VyclBvc11cbiAgICByZXR1cm4gcG9zSW5mbyB8fCAodGhpcy5wb3NJbmZvc1tjdXJyUG9zXSA9IG5ldyBQb3NJbmZvKGN1cnJQb3MpKVxuICB9LFxuXG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aFxuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmF0RW5kKCkgPyBjb21tb24uZmFpbCA6IHRoaXMuc291cmNlW3RoaXMucG9zKytdXG4gIH0sXG5cbiAgbWF0Y2hFeGFjdGx5OiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMubmV4dCgpID09PSB4ID8gdHJ1ZSA6IGNvbW1vbi5mYWlsXG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeClcbiAgfVxufVxuXG5mdW5jdGlvbiBTdHJpbmdJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSlcbn1cblxuU3RyaW5nSW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKylcbiAgICAgIGlmICh0aGlzLm1hdGNoRXhhY3RseShzW2lkeF0pID09PSBjb21tb24uZmFpbClcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIC8vIElNUE9SVEFOVDogZSBtdXN0IGJlIGEgbm9uLWdsb2JhbCwgb25lLWNoYXJhY3RlciBleHByZXNzaW9uLCBlLmcuLCAvLi8gYW5kIC9bMC05XS9cbiAgICB2YXIgYyA9IHRoaXMubmV4dCgpXG4gICAgcmV0dXJuIGMgIT09IGNvbW1vbi5mYWlsICYmIGUudGVzdChjKSA/IHRydWUgOiBjb21tb24uZmFpbFxuICB9XG59KVxuXG5mdW5jdGlvbiBMaXN0SW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpXG59XG5cbkxpc3RJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KHMpXG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkoZSlcbiAgfVxufSlcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRTdHJlYW1cblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0uanMnKVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW50ZXJ2YWwoc291cmNlLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gIHRoaXMuc291cmNlID0gc291cmNlXG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeFxuICB0aGlzLmVuZElkeCA9IGVuZElkeFxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhJbnRlcnZhbC5wcm90b3R5cGUsIHtcbiAgJ2NvbnRlbnRzJzoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fY29udGVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSBJbnB1dFN0cmVhbS5uZXdGb3IodGhpcy5zb3VyY2UpLmludGVydmFsKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRzXG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH1cbn0pXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsXG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgb2htID0gcmVxdWlyZSgnLi9tYWluLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBOYW1lc3BhY2VzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBOYW1lc3BhY2UobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuZ3JhbW1hcnMgPSB7fVxufVxuXG5OYW1lc3BhY2UucHJvdG90eXBlID0ge1xuICBpbnN0YWxsOiBmdW5jdGlvbihuYW1lLCBncmFtbWFyKSB7XG4gICAgaWYgKHRoaXMuZ3JhbW1hcnNbbmFtZV0pXG4gICAgICBicm93c2VyLmVycm9yKCdkdXBsaWNhdGUgZGVjbGFyYXRpb24gb2YgZ3JhbW1hcicsIG5hbWUsICdpbiBuYW1lc3BhY2UnLCB0aGlzLm5hbWUpXG4gICAgZWxzZVxuICAgICAgdGhpcy5ncmFtbWFyc1tuYW1lXSA9IGdyYW1tYXJcbiAgICByZXR1cm4gdGhpc1xuICB9LFxuXG4gIGdldEdyYW1tYXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFtbWFyc1tuYW1lXSB8fCBicm93c2VyLmVycm9yKCdvaG0gbmFtZXNwYWNlJywgdGhpcy5uYW1lLCAnaGFzIG5vIGdyYW1tYXIgY2FsbGVkJywgbmFtZSlcbiAgfSxcblxuICBsb2FkR3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGJyb3dzZXIuc2FuaXR5Q2hlY2soJ3NjcmlwdCB0YWdcXCdzIHR5cGUgYXR0cmlidXRlIG11c3QgYmUgXCJ0ZXh0L29obS1qc1wiJywgZWxlbWVudC50eXBlID09PSAndGV4dC9vaG0tanMnKVxuICAgIG9obS5tYWtlR3JhbW1hcnMoZWxlbWVudC5pbm5lckhUTUwsIHRoaXMpXG4gICAgcmV0dXJuIHRoaXNcbiAgfSxcblxuICBtYWtlOiBmdW5jdGlvbihyZWNpcGUpIHtcbiAgICByZXR1cm4gcmVjaXBlKG9obSwgdGhpcylcbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lc3BhY2VcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBQb3NJbmZvKHBvcykge1xuICB0aGlzLnBvcyA9IHBvc1xuICB0aGlzLnJ1bGVTdGFjayA9IFtdXG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fSAgLy8gcmVkdW5kYW50IChjb3VsZCBiZSBnZW5lcmF0ZWQgZnJvbSBydWxlU3RhY2spIGJ1dCB1c2VmdWwgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnNcbiAgdGhpcy5tZW1vID0ge31cbn1cblxuUG9zSW5mby5wcm90b3R5cGUgPSB7XG4gIGlzQWN0aXZlOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXVxuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnB1c2gocnVsZU5hbWUpXG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSB0cnVlXG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLnJ1bGVTdGFjay5wb3AoKVxuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gZmFsc2VcbiAgfSxcblxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gbWVtb1JlYy5pbnZvbHZlZFJ1bGVzXG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gaW52b2x2ZWRSdWxlcylcbiAgICAgIGlmIChpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSAmJiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSlcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID8gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV0gOiB1bmRlZmluZWRcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKCF0aGlzLmxlZnRSZWN1cnNpb25TdGFjaylcbiAgICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID0gW11cbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wdXNoKHtuYW1lOiBydWxlTmFtZSwgdmFsdWU6IGNvbW1vbi5mYWlsLCBwb3M6IC0xLCBpbnZvbHZlZFJ1bGVzOiB7fX0pXG4gICAgdGhpcy51cGRhdGVJbnZvbHZlZFJ1bGVzKClcbiAgfSxcblxuICBlbmRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnBvcCgpXG4gIH0sXG5cbiAgdXBkYXRlSW52b2x2ZWRSdWxlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpXG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzXG4gICAgdmFyIGxyUnVsZU5hbWUgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5uYW1lXG4gICAgdmFyIGlkeCA9IHRoaXMucnVsZVN0YWNrLmxlbmd0aCAtIDFcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlU3RhY2tbaWR4LS1dXG4gICAgICBpZiAocnVsZU5hbWUgPT09IGxyUnVsZU5hbWUpXG4gICAgICAgIGJyZWFrXG4gICAgICBpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9zKSB7XG4gIHJldHVybiBuZXcgUG9zSW5mbyhwb3MpXG59XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5hYnN0cmFjdCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyAndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhJ1xufVxuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycmF5W2lkeF1cbiAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKVxuICAgICAgZHVwbGljYXRlcy5wdXNoKHgpXG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXNcbn1cblxuZXhwb3J0cy5mYWlsID0ge31cblxuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXVxuICByZXR1cm4gJ0EnIDw9IGZpcnN0Q2hhciAmJiBmaXJzdENoYXIgPD0gJ1onXG59XG5cbnZhciBfYXBwbHlTcGFjZXNcbmV4cG9ydHMuc2tpcFNwYWNlcyA9IGZ1bmN0aW9uKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICAoX2FwcGx5U3BhY2VzIHx8IChfYXBwbHlTcGFjZXMgPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXMnKSkpLmV2YWwoZmFsc2UsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgdW5kZWZpbmVkKVxufVxuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJylcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG9cbnZhciBwcmludFN0cmluZyA9IGF3bGliLnN0cmluZ1V0aWxzLnByaW50U3RyaW5nXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSdWxlRGVjbCgpIHtcbiAgdGhyb3cgJ1J1bGVEZWNsIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG5SdWxlRGVjbC5wcm90b3R5cGUgPSB7XG4gIHBlcmZvcm1DaGVja3M6IGNvbW1vbi5hYnN0cmFjdCxcblxuICBwZXJmb3JtQ29tbW9uQ2hlY2tzOiBmdW5jdGlvbihuYW1lLCBib2R5KSB7XG4gICAgYm9keS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKG5hbWUpXG4gICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhuYW1lKVxuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuYm9keVxuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLicpXG4gICAgd3MubmV4dFB1dEFsbCh0aGlzLmtpbmQpXG4gICAgd3MubmV4dFB1dEFsbCgnKCcpXG4gICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLm5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICB0aGlzLmJvZHkub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJyknKVxuICB9XG59XG5cbmZ1bmN0aW9uIERlZmluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbkRlZmluZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdkZWZpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGRlZmluZSBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgc3VwZXItZ3JhbW1hci4nLFxuICAgICAgICAgICAgICAgICAgICAnKHRyeSBvdmVycmlkZSBvciBleHRlbmQgaW5zdGVhZC4pJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIE92ZXJyaWRlKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lXG4gIHRoaXMuYm9keSA9IGJvZHlcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXJcbn1cblxuT3ZlcnJpZGUucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnb3ZlcnJpZGUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdmVycmlkZGVuID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXVxuICAgIGlmICghb3ZlcnJpZGRlbilcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2Nhbm5vdCBvdmVycmlkZSBydWxlJywgdGhpcy5uYW1lLCAnYmVjYXVzZSBpdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3VwZXItZ3JhbW1hci4nLFxuICAgICAgICAgICAgICAgICAgICAnKHRyeSBkZWZpbmUgaW5zdGVhZC4pJylcbiAgICBpZiAob3ZlcnJpZGRlbi5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgb3ZlcnJpZGRlbi5wcm9kdWNlc1ZhbHVlKCkgJiYgIXRoaXMuYm9keS5wcm9kdWNlc1ZhbHVlKCkpXG4gICAgICBicm93c2VyLmVycm9yKCd0aGUgYm9keSBvZiBydWxlJywgdGhpcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAnbXVzdCBwcm9kdWNlIGEgdmFsdWUsIGJlY2F1c2UgdGhlIHJ1bGUgaXRcXCdzIG92ZXJyaWRpbmcgYWxzbyBwcm9kdWNlcyBhIHZhbHVlJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIElubGluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyXG59XG5cbklubGluZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdpbmxpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIHJlbGF4aW5nIHRoaXMgY2hlY2ssIGUuZy4sIG1ha2UgaXQgb2sgdG8gb3ZlcnJpZGUgYW4gaW5saW5lIHJ1bGUgaWYgdGhlIG5lc3RpbmcgcnVsZSBpc1xuICAgIC8vIGFuIG92ZXJyaWRlLiBCdXQgb25seSBpZiB0aGUgaW5saW5lIHJ1bGUgdGhhdCdzIGJlaW5nIG92ZXJyaWRkZW4gaXMgbmVzdGVkIGluc2lkZSB0aGUgbmVzdGluZyBydWxlIHRoYXRcbiAgICAvLyB3ZSdyZSBvdmVycmlkaW5nPyBIb3BlZnVsbHkgdGhlcmUncyBhIG11Y2ggbGVzcyBjb21wbGljYXRlZCB3YXkgdG8gZG8gdGhpcyA6KVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKVxuICAgICAgYnJvd3Nlci5lcnJvcignY2Fubm90IGRlZmluZSBpbmxpbmUgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgYWxyZWFkeSBleGlzdHMgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJylcbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIEV4dGVuZChuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZVxuICB0aGlzLmJvZHkgPSBib2R5XG4gIHRoaXMuZXhwYW5kZWRCb2R5ID0gbmV3IHBleHBycy5BbHQoW2JvZHksIG5ldyBwZXhwcnMuRXhwYW5kKG5hbWUsIHN1cGVyR3JhbW1hcildKVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hclxufVxuXG5FeHRlbmQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnZXh0ZW5kJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZXh0ZW5kZWQgPSB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdXG4gICAgaWYgKCFleHRlbmRlZClcbiAgICAgIGJyb3dzZXIuZXJyb3IoJ2Nhbm5vdCBleHRlbmQgcnVsZScsIHRoaXMubmFtZSwgJ2JlY2F1c2UgaXQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHN1cGVyLWdyYW1tYXIuJyxcbiAgICAgICAgICAgICAgICAgICAgJyh0cnkgZGVmaW5lIGluc3RlYWQuKScpXG4gICAgaWYgKGV4dGVuZGVkLmdldEJpbmRpbmdOYW1lcygpLmxlbmd0aCA9PT0gMCAmJiBleHRlbmRlZC5wcm9kdWNlc1ZhbHVlKCkgJiYgIXRoaXMuYm9keS5wcm9kdWNlc1ZhbHVlKCkpXG4gICAgICBicm93c2VyLmVycm9yKCd0aGUgYm9keSBvZiBydWxlJywgdGhpcy5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAnbXVzdCBwcm9kdWNlIGEgdmFsdWUsIGJlY2F1c2UgdGhlIHJ1bGUgaXRcXCdzIGV4dGVuZGluZyBhbHNvIHByb2R1Y2VzIGEgdmFsdWUnKVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuZXhwYW5kZWRCb2R5KVxuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuZXhwYW5kZWRCb2R5XG4gIH1cbn0pXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlJ1bGVEZWNsID0gUnVsZURlY2xcbmV4cG9ydHMuRGVmaW5lID0gRGVmaW5lXG5leHBvcnRzLk92ZXJyaWRlID0gT3ZlcnJpZGVcbmV4cG9ydHMuSW5saW5lID0gSW5saW5lXG5leHBvcnRzLkV4dGVuZCA9IEV4dGVuZFxuXG4iLCIvKlxuXG5UT0RPOlxuXG4qIFRoaW5rIGFib3V0IGltcHJvdmluZyB0aGUgaW1wbGVtZW50YXRpb24gb2Ygc3ludGFjdGljIHJ1bGVzJyBhdXRvbWF0aWMgc3BhY2Ugc2tpcHBpbmc6XG4gIC0tIENvdWxkIGtlZXAgdHJhY2sgb2YgdGhlIGN1cnJlbnQgcnVsZSBuYW1lIGJ5IG1vZGlmeWluZyB0aGUgY29kZSAoaW4gQXBwbHkuZXZhbCkgd2hlcmUgZW50ZXIgYW5kIGV4aXQgbWV0aG9kc1xuICAgICBhcmUgY2FsbGVkLiAoV291bGQgYWxzbyB3YW50IHRvIGtlZXAgdHJhY2sgb2Ygd2hldGhlciB0aGUgcnVsZSBpcyBzeW50YWN0aWMgdG8gYXZvaWQgcmUtZG9pbmcgdGhhdCB3b3JrXG4gICAgIGF0IGVhY2ggYXBwbGljYXRpb24uKVxuXG4qIENvbnNpZGVyIGJvcnJvd2luZyAoc29tZXRoaW5nIGxpa2UpIHRoZSB2YXJpYWJsZS1ub3Qtb3RoZXJ3aXNlLW1lbnRpb25lZCBpZGVhIGZyb20gUm9iYnkgRmluZGxlcidzIHJlZGV4LCBhcyBhIHdheVxuICB0byBtYWtlIGl0IGVhc2llciBmb3IgcHJvZ3JhbW1lcnMgdG8gZGVhbCB3aXRoIGtleXdvcmRzIGFuZCBpZGVudGlmaWVycy5cblxuKiBUaGluayBhYm91dCBhIGJldHRlciB3YXkgdG8gZGVhbCB3aXRoIGxpc3RzXG4gIC0tIEJ1aWx0LWluIGxpc3Qgb3BlcmF0b3I/XG4gIC0tIFBhcmFtZXRlcml6ZWQgcnVsZXM/XG5cbiogSW1wcm92ZSB0ZXN0IGNvdmVyYWdlXG4gIC0tIEFkZCB0ZXN0cyBmb3Igc2NvcGluZywgZS5nLiwgXCJmb286YSBbYmFyOmIgYmF6OmNdOmRcIiBzaG91bGQgaGF2ZSA0IGJpbmRpbmdzLlxuICAgICAoU2FtZSBraW5kIG9mIHRoaW5nIGZvciBuZXN0ZWQgc3RyaW5nIGFuZCBsb29rYWhlYWQgZXhwcmVzc2lvbnMsIHRoZWlyIGJpbmRpbmdzIHNob3VsZCBsZWFrIHRvIHRoZSBlbmNsb3Npbmcgc2VxLilcblxuKiBUaGluayBhYm91dCBmb3JlaWduIHJ1bGUgaW52b2NhdGlvblxuICAtLSBDYW4ndCBqdXN0IGJlIGRvbmUgaW4gdGhlIHNhbWUgd2F5IGFzIGluIE9NZXRhIGIvYyBvZiB0aGUgYWN0aW9uRGljdFxuICAtLSBXaWxsIHdhbnQgdG8gcHJlc2VydmUgdGhlIFwibm8gdW5uZWNlc3Nhcnkgc2VtYW50aWMgYWN0aW9uc1wiIGd1YXJhbnRlZVxuICAtLSBUaGUgc29sdXRpb24gbWlnaHQgYmUgdG8gZW5hYmxlIHRoZSBwcm9ncmFtbWVyIHRvIHByb3ZpZGUgbXVsdGlwbGUgYWN0aW9uRGljdHMsXG4gICAgIGJ1dCBJJ2xsIGhhdmUgdG8gY29tZSB1cCB3aXRoIGEgY29udmVuaWVudCB3YXkgdG8gYXNzb2NpYXRlIGVhY2ggd2l0aCBhIHBhcnRpY3VsYXIgZ3JhbW1hci5cblxuKiBUaGluayBhYm91dCBpbmNyZW1lbnRhbCBwYXJzaW5nIChnb29kIGZvciBlZGl0b3JzKVxuICAtLSBCYXNpYyBpZGVhOiBrZWVwIHRyYWNrIG9mIG1heCBpbmRleCBzZWVuIHRvIGNvbXB1dGUgYSByZXN1bHRcbiAgICAgKHN0b3JlIHRoaXMgaW4gbWVtbyByZWMgYXMgYW4gaW50IHJlbGF0aXZlIHRvIGN1cnIgcG9zKVxuICAtLSBPayB0byByZXVzZSBtZW1vaXplZCB2YWx1ZSBhcyBsb25nIGFzIHJhbmdlIGZyb20gY3VycmVudCBpbmRleCB0byBtYXggaW5kZXggaGFzbid0IGNoYW5nZWRcbiAgLS0gQ291bGQgYmUgYSBjdXRlIHdvcmtzaG9wIHBhcGVyLi4uXG5cblxuU3ludGF4IC8gbGFuZ3VhZ2UgaWRlYXM6XG5cbiogU3ludGF4IGZvciBydWxlIGRlY2xhcmF0aW9uczpcblxuICAgIGZvbyA9PSBiYXIgYmF6ICAgICAoZGVmaW5lKVxuICAgIGZvbyA6PSBiYXIgYmF6ICAgICAob3ZlcnJpZGUgLyByZXBsYWNlKVxuICAgIGZvbyA8PSBiYXIgYmF6ICAgICAoZXh0ZW5kKVxuXG4qIElubGluZSBydWxlcywgZS5nLixcblxuICAgIGFkZEV4cHIgPSBhZGRFeHByOnggJysnIG11bEV4cHI6eSB7cGx1c31cbiAgICAgICAgICAgIHwgYWRkRXhwcjp4ICctJyBtdWxFeHByOnkge21pbnVzfVxuICAgICAgICAgICAgfCBtdWxFeHByXG5cbiAgaXMgc3ludGFjdGljIHN1Z2FyIGZvclxuXG4gICAgYWRkRXhwciA9IHBsdXMgfCBtaW51cyB8IG11bEV4cHIsXG4gICAgcGx1cyA9IGFkZEV4cHI6eCAnKycgbXVsRXhwcjp5LFxuICAgIG1pbnVzID0gYWRkRXhwcjp4ICctJyBtdWxFeHByOnlcblxuKiBJbiB0aGlzIGV4YW1wbGU6XG5cbiAgICBmb28gPSBcImJhclwiXG4gICAgYmFyID0gJ2FiYydcblxuICBUaGUgZm9vIHJ1bGUgc2F5cyBpdCB3YW50cyB0aGUgYmFyIHJ1bGUgdG8gbWF0Y2ggdGhlIGNvbnRlbnRzIG9mIGEgc3RyaW5nIG9iamVjdC4gKFRoZSBcInMgaXMgYSBraW5kIG9mIHBhcmVudGhlc2lzLilcbiAgVGhlbiB5b3UgY291bGQgZWl0aGVyIHNheVxuXG4gICAgbS5tYXRjaEFsbCgnYWJjJywgJ2JhcicpXG5cbiAgb3JcblxuICAgIG0ubWF0Y2goJ2FiYycsICdmb28nKVxuXG4gIEJvdGggc2hvdWxkIHN1Y2NlZWQuXG5cbiogQWJvdXQgb2JqZWN0IG1hdGNoaW5nXG5cbiAgU29tZSBpc3N1ZXM6XG4gIC0tIFNob3VsZCBkZWZpbml0ZWx5IGFsbG93IHBhdHRlcm4gbWF0Y2hpbmcgb24gZWFjaCBwcm9wZXJ0eSdzIHZhbHVlLiBCdXQgd2hhdCBhYm91dCBwcm9wZXJ0eSBuYW1lcz9cbiAgLS0gV2hhdCB0byBkbyBhYm91dCB1bnNwZWNpZmllZCBwcm9wZXJ0aWVzP1xuICAtLSBTeW50YXg6IEpTT04gdXNlcyBjb2xvbnMgdG8gc2VwYXJhdGUgcHJvcGVydHkgbmFtZXMgYW5kIHZhbHVlcy4gV2lsbCBsb29rIGJhZCB3LyBiaW5kaW5ncywgZS5nLixcbiAgICAge2ZvbzogbnVtYmVyOm59IChld3d3dylcblxuICBDdXJyZW50IHN0cmF3bWFuOlxuICAtLSBSZXF1aXJlIHByb3BlcnR5IG5hbWVzIHRvIGJlIHN0cmluZyBsaXRlcmFscyAobm90IHBhdHRlcm5zKSwgb25seSBhbGxvdyBwYXR0ZXJuIG1hdGNoaW5nIG9uIHRoZWlyIHZhbHVlcy5cbiAgLS0gQWxsb3cgYW4gb3B0aW9uYWwgJy4uLicgYXMgdGhlIGxhc3QgcGF0dGVybiwgdGhhdCB3b3VsZCBtYXRjaCBhbnkgdW5zcGVjaWZpZWQgcHJvcGVydGllcy5cbiAgICAgICB7J2Zvbyc6IG51bWJlciwgJ2Jhcic6IHN0cmluZywgJ2Jheic6IDUsIC4uLn1cbiAgICAgTWlnaHQgZXZlbiBhbGxvdyB0aGUgLi4uIHRvIGJlIGJvdW5kIHRvIGEgdmFyaWFibGUgdGhhdCB3b3VsZCBjb250YWluIGFsbCBvZiB0aG9zZSBwcm9wZXJ0aWVzLlxuICAtLSBDb25zaWRlciBjaGFuZ2luZyBiaW5kaW5nIHN5bnRheCBmcm9tIGV4cHI6bmFtZSB0byBleHByLm5hbWVcbiAgICAgKE1vcmUgSlNPTi1mcmllbmRseSwgYnV0IGl0IGRvZXNuJ3Qgd29yayB3ZWxsIHdpdGggLi4uIHN5bnRheC4gQnV0IG1heWJlIGl0J3Mgbm90IHNvIGltcG9ydGFudCB0byBiZSBhYmxlIHRvIGJpbmRcbiAgICAgdGhlIHJlc3Qgb2YgdGhlIHByb3BlcnRpZXMgYW5kIHZhbHVlcyBhbnl3YXksIHNpbmNlIHlvdSBjYW4gYWx3YXlzIGJpbmQgdGhlIGVudGlyZSBvYmplY3QuKVxuXG5cbk9wdGltaXphdGlvbiBpZGVhczpcblxuKiBPcHRpbWl6ZSAnYmluZHMnIC0tIHNob3VsZCBwcmUtYWxsb2NhdGUgYW4gYXJyYXkgb2YgYmluZGluZ3MgaW5zdGVhZCBvZiBkb2luZyBwdXNoZXMsIHRocm93aW5nIGF3YXkgYXJyYXlzIG9uIGZhaWxcbiAgKHNlZSBBbHQpLCBldGMuXG5cbiogQ29uc2lkZXIgYWRkaW5nIGFuIGFkZGl0aW9uYWwgY29kZSBnZW5lcmF0aW9uIHN0ZXAgdGhhdCBnZW5lcmF0ZXMgZWZmaWNpZW50IGNvZGUgZnJvbSB0aGUgQVNUcywgaW5zdGVhZCBvZlxuICBpbnRlcnByZXRpbmcgdGhlbSBkaXJlY3RseS5cblxuKiBEb24ndCBib3RoZXIgY3JlYXRpbmcgdGh1bmtzIC8gbGlzdHMgb2YgdGh1bmtzIHdoZW4gdmFsdWUgaXMgbm90IG5lZWRlZCAoT01ldGEgZGlkIHRoaXMpXG4gIC0tIEUuZy4sIGluIFwiZm9vID0gc3BhY2UqIGJhclwiIHRoZSByZXN1bHQgb2Ygc3BhY2UqIGlzIG5vdCBuZWVkZWQsIHNvIGRvbid0IGJvdGhlciBjcmVhdGluZyBhIGxpc3Qgb2YgdGh1bmtzIC8gdmFsdWVzXG4gIC0tIENvdWxkIGp1c3QgcmV0dXJuIHVuZGVmaW5lZCAoYW55dGhpbmcgZXhjZXB0IGZhaWwpXG5cbiogR2V0IHJpZCBvZiB1bm5lY2Vzc2FyeSBTZXFzIGFuZCBBbHRzIChPTWV0YSBkaWQgdGhpcyB0b28pXG5cbiovXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5yZXF1aXJlKCcuLi9kaXN0L29obS1ncmFtbWFyLmpzJylcblxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXIuanMnKVxudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIHVuZXNjYXBlQ2hhciA9IGF3bGliLnN0cmluZ1V0aWxzLnVuZXNjYXBlQ2hhclxudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyXG5cbnZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkge1xuICB2YXIgYnVpbGRlclxuICByZXR1cm4ge1xuICAgIHNwYWNlOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgICdzcGFjZS1tdWx0aUxpbmUnOiAgICAgICAgICBmdW5jdGlvbigpIHt9LFxuICAgICdzcGFjZS1zaW5nbGVMaW5lJzogICAgICAgICBmdW5jdGlvbigpIHt9LFxuXG4gICAgX25hbWU6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cyB9LFxuICAgIG5hbWVGaXJzdDogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgIG5hbWVSZXN0OiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuXG4gICAgbmFtZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52Lm4gfSxcblxuICAgIG5hbWVkQ29uc3Q6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICduYW1lZENvbnN0LXVuZGVmaW5lZCc6ICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIHVuZGVmaW5lZCB9LFxuICAgICduYW1lZENvbnN0LW51bGwnOiAgICAgICAgICBmdW5jdGlvbigpIHsgcmV0dXJuIG51bGwgfSxcbiAgICAnbmFtZWRDb25zdC10cnVlJzogICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0cnVlIH0sXG4gICAgJ25hbWVkQ29uc3QtZmFsc2UnOiAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gZmFsc2UgfSxcblxuICAgIHN0cmluZzogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW52LmNzLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiB1bmVzY2FwZUNoYXIoYykgfSkuam9pbignJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBzQ2hhcjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzIH0sXG4gICAgcmVnZXhwOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gbmV3IFJlZ0V4cChlbnYuZSkgfSxcbiAgICByZUNoYXJDbGFzczogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzIH0sXG4gICAgbnVtYmVyOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5pbnRlcnZhbC5jb250ZW50cykgfSxcblxuICAgIEFsdDogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdBbHQtcmVjJzogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYWx0KGVudi54LCBlbnYueSkgfSxcblxuICAgIFRlcm06ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdUZXJtLWlubGluZSc6ICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuaW5saW5lKGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lICsgJy0nICsgZW52Lm4sIGVudi54KSB9LFxuXG4gICAgU2VxOiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5zZXEuYXBwbHkoYnVpbGRlciwgZW52LnZhbHVlKSB9LFxuXG4gICAgRmFjdG9yOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH0sXG4gICAgJ0ZhY3Rvci1iaW5kJzogICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5iaW5kKGVudi54LCBlbnYubikgfSxcblxuICAgIEl0ZXI6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdJdGVyLXN0YXInOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubWFueShlbnYueCwgMCkgfSxcbiAgICAnSXRlci1wbHVzJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm1hbnkoZW52LngsIDEpIH0sXG4gICAgJ0l0ZXItb3B0JzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vcHQoZW52LngpIH0sXG5cbiAgICBQcmVkOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWUgfSxcbiAgICAnUHJlZC1ub3QnOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm5vdChlbnYueCkgfSxcbiAgICAnUHJlZC1sb29rYWhlYWQnOiAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmxhKGVudi54KSB9LFxuXG4gICAgQmFzZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH0sXG4gICAgJ0Jhc2UtdW5kZWZpbmVkJzogICAgICAgICAgIGZ1bmN0aW9uKCkgeyByZXR1cm4gYnVpbGRlci5fKHVuZGVmaW5lZCkgfSxcbiAgICAnQmFzZS1udWxsJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8obnVsbCkgfSxcbiAgICAnQmFzZS10cnVlJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8odHJ1ZSkgfSxcbiAgICAnQmFzZS1mYWxzZSc6ICAgICAgICAgICAgICAgZnVuY3Rpb24oKSB7IHJldHVybiBidWlsZGVyLl8oZmFsc2UpIH0sXG4gICAgJ0Jhc2UtYXBwbGljYXRpb24nOiAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5hcHAoZW52LnJ1bGVOYW1lKSB9LFxuICAgICdCYXNlLXByaW0nOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuXyhlbnYudmFsdWUpIH0sXG4gICAgJ0Jhc2UtbHN0JzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5sc3QoZW52LngpIH0sXG4gICAgJ0Jhc2Utc3RyJzogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5zdHIoZW52LngpIH0sXG4gICAgJ0Jhc2UtcGFyZW4nOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnggfSxcbiAgICAnQmFzZS1vYmonOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9iaihbXSwgZW52LmxlbmllbnQpIH0sXG4gICAgJ0Jhc2Utb2JqV2l0aFByb3BzJzogICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vYmooZW52LnBzLCBlbnYubGVuaWVudCkgfSxcblxuICAgIFByb3BzOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdQcm9wcy1iYXNlJzogICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIFtlbnYucF0gfSxcbiAgICAnUHJvcHMtcmVjJzogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBbZW52LnBdLmNvbmNhdChlbnYucHMpIH0sXG4gICAgUHJvcDogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4ge25hbWU6IGVudi5uLCBwYXR0ZXJuOiBlbnYucH0gfSxcblxuICAgIFJ1bGU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZSB9LFxuICAgICdSdWxlLWRlZmluZSc6ICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSA9IGVudi5uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZGVmaW5lKGVudi5uLCBlbnYuYilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAnUnVsZS1vdmVycmlkZSc6ICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLm92ZXJyaWRlKGVudi5uLCBlbnYuYilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAnUnVsZS1leHRlbmQnOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYublxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmV4dGVuZChlbnYubiwgZW52LmIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICBTdXBlckdyYW1tYXI6ICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IGJ1aWxkZXIuc2V0U3VwZXJHcmFtbWFyKGVudi52YWx1ZSkgfSxcbiAgICAnU3VwZXJHcmFtbWFyLXF1YWxpZmllZCc6ICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiB0aGlzTW9kdWxlLm5hbWVzcGFjZShlbnYubnMpLmdldEdyYW1tYXIoZW52Lm4pIH0sXG4gICAgJ1N1cGVyR3JhbW1hci11bnF1YWxpZmllZCc6IGZ1bmN0aW9uKGVudikgeyByZXR1cm4gb3B0TmFtZXNwYWNlLmdldEdyYW1tYXIoZW52Lm4pIH0sXG5cbiAgICBHcmFtbWFyOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlciA9IG5ldyBCdWlsZGVyKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLnNldE5hbWUoZW52Lm4pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52LnMgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYucnMgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZChvcHROYW1lc3BhY2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgR3JhbW1hcnM6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIHdoYXRJdElzLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIHRodW5rID0gdGhpc01vZHVsZS5fb2htR3JhbW1hci5tYXRjaENvbnRlbnRzKHNvdXJjZSwgd2hhdEl0SXMpXG4gIGlmICh0aHVuaylcbiAgICByZXR1cm4gdGh1bmsobWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkpXG4gIGVsc2VcbiAgICAvLyBUT0RPOiBpbXByb3ZlIGVycm9yIG1lc3NhZ2UgKHNob3cgd2hhdCBwYXJ0IG9mIHRoZSBpbnB1dCBpcyB3cm9uZywgd2hhdCB3YXMgZXhwZWN0ZWQsIGV0Yy4pXG4gICAgYnJvd3Nlci5lcnJvcignaW52YWxpZCBpbnB1dCBpbjonLCBzb3VyY2UpXG59XG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFyJywgb3B0TmFtZXNwYWNlKVxufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXJzJywgb3B0TmFtZXNwYWNlKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gU3R1ZmYgdGhhdCB1c2VycyBzaG91bGQga25vdyBhYm91dFxuXG52YXIgbmFtZXNwYWNlcyA9IHt9XG5leHBvcnRzLm5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgaWYgKG5hbWVzcGFjZXNbbmFtZV0gPT09IHVuZGVmaW5lZClcbiAgICBuYW1lc3BhY2VzW25hbWVdID0gbmV3IE5hbWVzcGFjZShuYW1lKVxuICByZXR1cm4gbmFtZXNwYWNlc1tuYW1lXVxufVxuXG5leHBvcnRzLm1ha2UgPSBmdW5jdGlvbihyZWNpcGUpIHtcbiAgcmV0dXJuIHJlY2lwZSh0aGlzTW9kdWxlKVxufVxuXG5leHBvcnRzLm1ha2VHcmFtbWFyID0gbWFrZUdyYW1tYXJcbmV4cG9ydHMubWFrZUdyYW1tYXJzID0gbWFrZUdyYW1tYXJzXG5cbi8vIFN0dWZmIHRoYXQncyBvbmx5IGhlcmUgZm9yIGJvb3RzdHJhcHBpbmcsIHRlc3RpbmcsIGV0Yy5cblxuZXhwb3J0cy5fYnVpbGRlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IEJ1aWxkZXIoKVxufVxuXG5leHBvcnRzLl9tYWtlR3JhbW1hckFjdGlvbkRpY3QgPSBtYWtlR3JhbW1hckFjdGlvbkRpY3RcblxudmFyIG9obUdyYW1tYXJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX29obUdyYW1tYXInLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFvaG1HcmFtbWFyKVxuICAgICAgb2htR3JhbW1hciA9IHRoaXMuX29obUdyYW1tYXJGYWN0b3J5KHRoaXMpXG4gICAgcmV0dXJuIG9obUdyYW1tYXJcbiAgfVxufSlcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKVxuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpXG52YXIgZXF1YWxzID0gYXdsaWIuZXF1YWxzLmVxdWFsc1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGNvbW1vbi5hYnN0cmFjdFxuXG5wZXhwcnMuYW55dGhpbmcuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge31cblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHt9XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKVxuICAgIHJldHVyblxuICB2YXIgbmFtZXMgPSB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdXG4gICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncygpXG4gICAgdmFyIG90aGVyTmFtZXMgPSB0ZXJtLmdldEJpbmRpbmdOYW1lcygpXG4gICAgaWYgKCFlcXVhbHMobmFtZXMsIG90aGVyTmFtZXMpKVxuICAgICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGFuIGFsdCB3aXRoIGluY29uc2lzdGVudCBiaW5kaW5nczonLCBuYW1lcywgJ3ZzJywgb3RoZXJOYW1lcylcbiAgfVxufVxuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKVxuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxufVxuXG5wZXhwcnMuQmluZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbn1cblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxufVxuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbn1cblxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5MaXN0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbn1cblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKVxufVxuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHt9XG5cbnBleHBycy5FeHBhbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSlcbn1cblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gY29tbW9uLmFic3RyYWN0XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHt9XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHt9XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspXG4gICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKylcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxuXG4gIHZhciBkdXBsaWNhdGVzID0gY29tbW9uLmdldER1cGxpY2F0ZXModGhpcy5nZXRCaW5kaW5nTmFtZXMoKSlcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICBicm93c2VyLmVycm9yKCdydWxlJywgcnVsZU5hbWUsICdoYXMgZHVwbGljYXRlIGJpbmRpbmdzOicsIGR1cGxpY2F0ZXMpXG59XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbn1cblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxufVxuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpXG59XG5cbnBleHBycy5TdHIucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbn1cblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcbn1cblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKVxuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSlcblxuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpXG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApXG4gICAgYnJvd3Nlci5lcnJvcigncnVsZScsIHJ1bGVOYW1lLCAnaGFzIGFuIG9iamVjdCBwYXR0ZXJuIHdpdGggZHVwbGljYXRlIGJpbmRpbmdzOicsIGR1cGxpY2F0ZXMpXG59XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fVxuXG5wZXhwcnMuRXhwYW5kLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHBhbnNpb24oKS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKVxufVxuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJylcbnZhciB0aHVua3MgPSByZXF1aXJlKCcuL3RodW5rcy5qcycpXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKVxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbS5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBicm93c2VyID0gYXdsaWIuYnJvd3NlclxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gY29tbW9uLmFic3RyYWN0XG5cbnBleHBycy5hbnl0aGluZy5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpXG4gICAgY29tbW9uLnNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICB2YXIgdmFsdWUgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbClcbiAgICByZXR1cm4gY29tbW9uLmZhaWxcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgdGh1bmtzLlZhbHVlVGh1bmsodmFsdWUpXG59XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpXG4gICAgY29tbW9uLnNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICBpZiAodGhpcy5tYXRjaChpbnB1dFN0cmVhbSkgPT09IGNvbW1vbi5mYWlsKVxuICAgIHJldHVybiBjb21tb24uZmFpbFxuICBlbHNlXG4gICAgcmV0dXJuIG5ldyB0aHVua3MuVmFsdWVUaHVuayh0aGlzLm9iailcbn1cblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iailcbn1cblxucGV4cHJzLlN0cmluZ1ByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKVxufVxuXG5wZXhwcnMuUmVnRXhwUHJpbS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKVxuICAgIGNvbW1vbi5za2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgaWYgKGlucHV0U3RyZWFtLm1hdGNoUmVnRXhwKHRoaXMub2JqKSA9PT0gY29tbW9uLmZhaWwpXG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsXG4gIGVsc2VcbiAgICByZXR1cm4gbmV3IHRodW5rcy5WYWx1ZVRodW5rKGlucHV0U3RyZWFtLnNvdXJjZVtvcmlnUG9zXSlcbn1cblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvc1xuICB2YXIgb3JpZ051bUJpbmRpbmdzID0gYmluZGluZ3MubGVuZ3RoXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChzeW50YWN0aWMpXG4gICAgICBjb21tb24uc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIHZhbHVlID0gdGhpcy50ZXJtc1tpZHhdLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICAgIGlmICh2YWx1ZSAhPT0gY29tbW9uLmZhaWwpXG4gICAgICByZXR1cm4gdmFsdWVcbiAgICBlbHNlIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICAgIC8vIE5vdGU6IHdoaWxlIHRoZSBmb2xsb3dpbmcgYXNzaWdubWVudCBjb3VsZCBiZSBkb25lIHVuY29uZGl0aW9uYWxseSwgb25seSBkb2luZyBpdCB3aGVuIG5lY2Vzc2FyeSBpc1xuICAgICAgLy8gYmV0dGVyIGZvciBwZXJmb3JtYW5jZS4gVGhpcyBpcyBiL2MgYXNzaWduaW5nIHRvIGFuIGFycmF5J3MgbGVuZ3RoIHByb3BlcnR5IGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4gYVxuICAgICAgLy8gdHlwaWNhbCBhc3NpZ25tZW50LlxuICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IG9yaWdOdW1CaW5kaW5ncylcbiAgICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzXG4gICAgfVxuICB9XG4gIHJldHVybiBjb21tb24uZmFpbFxufVxuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKHN5bnRhY3RpYylcbiAgICAgIGNvbW1vbi5za2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF1cbiAgICB2YXIgdmFsdWUgPSBmYWN0b3IuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbClcbiAgICAgIHJldHVybiBjb21tb24uZmFpbFxuICB9XG4gIHJldHVybiB0aHVua3MudmFsdWVsZXNzVGh1bmtcbn1cblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxuICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsKVxuICAgIGJpbmRpbmdzLnB1c2godGhpcy5uYW1lLCB2YWx1ZSlcbiAgcmV0dXJuIHZhbHVlXG59XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBtYXRjaGVzID0gW11cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgYmFja3RyYWNrUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKVxuICAgIGlmICh2YWx1ZSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGJhY2t0cmFja1Bvc1xuICAgICAgYnJlYWtcbiAgICB9IGVsc2VcbiAgICAgIG1hdGNoZXMucHVzaCh2YWx1ZSlcbiAgfVxuICByZXR1cm4gbWF0Y2hlcy5sZW5ndGggPCB0aGlzLm1pbk51bU1hdGNoZXMgPyAgY29tbW9uLmZhaWwgOiBuZXcgdGh1bmtzLkxpc3RUaHVuayhtYXRjaGVzKVxufVxuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbCkge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICByZXR1cm4gdGh1bmtzLnZhbHVlbGVzc1RodW5rXG4gIH0gZWxzZVxuICAgIHJldHVybiBuZXcgdGh1bmtzLkxpc3RUaHVuayhbdmFsdWVdKVxufVxuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbClcbiAgICByZXR1cm4gY29tbW9uLmZhaWxcbiAgZWxzZSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgIHJldHVybiB0aHVua3MudmFsdWVsZXNzVGh1bmtcbiAgfVxufVxuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSlcbiAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3NcbiAgICByZXR1cm4gdmFsdWVcbiAgfSBlbHNlXG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsXG59XG5cbnBleHBycy5TdHIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYylcbiAgICBjb21tb24uc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gIHZhciBzdHJpbmcgPSBpbnB1dFN0cmVhbS5uZXh0KClcbiAgaWYgKHR5cGVvZiBzdHJpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIHN0cmluZ0lucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKHN0cmluZylcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBzdHJpbmdJbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgcmV0dXJuIHZhbHVlICE9PSBjb21tb24uZmFpbCAmJiBzdHJpbmdJbnB1dFN0cmVhbS5hdEVuZCgpID8gIG5ldyB0aHVua3MuVmFsdWVUaHVuayhzdHJpbmcpIDogY29tbW9uLmZhaWxcbiAgfSBlbHNlXG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsXG59XG5cbnBleHBycy5MaXN0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpXG4gICAgY29tbW9uLnNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKVxuICB2YXIgbGlzdCA9IGlucHV0U3RyZWFtLm5leHQoKVxuICBpZiAobGlzdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgdmFyIGxpc3RJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihsaXN0KVxuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGxpc3RJbnB1dFN0cmVhbSwgYmluZGluZ3MpXG4gICAgcmV0dXJuIHZhbHVlICE9PSBjb21tb24uZmFpbCAmJiBsaXN0SW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgdGh1bmtzLlZhbHVlVGh1bmsobGlzdCkgOiBjb21tb24uZmFpbFxuICB9IGVsc2VcbiAgICByZXR1cm4gY29tbW9uLmZhaWxcbn1cblxucGV4cHJzLk9iai5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKVxuICAgIGNvbW1vbi5za2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgdmFyIG9iaiA9IGlucHV0U3RyZWFtLm5leHQoKVxuICBpZiAob2JqICE9PSBjb21tb24uZmFpbCAmJiBvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpKSB7XG4gICAgdmFyIG51bU93blByb3BlcnRpZXNNYXRjaGVkID0gMFxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLnByb3BlcnRpZXNbaWR4XVxuICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdXG4gICAgICB2YXIgdmFsdWVJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihbdmFsdWVdKVxuICAgICAgdmFyIG1hdGNoZWQgPSBwcm9wZXJ0eS5wYXR0ZXJuLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgdmFsdWVJbnB1dFN0cmVhbSwgYmluZGluZ3MpICE9PSBjb21tb24uZmFpbCAmJlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZUlucHV0U3RyZWFtLmF0RW5kKClcbiAgICAgIGlmICghbWF0Y2hlZClcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHByb3BlcnR5Lm5hbWUpKVxuICAgICAgICBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCsrXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmlzTGVuaWVudCB8fCBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9PT0gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggP1xuICAgICAgbmV3IHRodW5rcy5WYWx1ZVRodW5rKG9iaikgOlxuICAgICAgY29tbW9uLmZhaWxcbiAgfSBlbHNlXG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsXG59XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lXG4gIHZhciBvcmlnUG9zSW5mbyA9IGlucHV0U3RyZWFtLmdldEN1cnJlbnRQb3NJbmZvKClcbiAgdmFyIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXVxuICBpZiAobWVtb1JlYyAmJiBvcmlnUG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG1lbW9SZWMucG9zXG4gICAgcmV0dXJuIG1lbW9SZWMudmFsdWVcbiAgfSBlbHNlIGlmIChvcmlnUG9zSW5mby5pc0FjdGl2ZShydWxlTmFtZSkpIHtcbiAgICB2YXIgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKVxuICAgIGlmIChjdXJyZW50TFIgJiYgY3VycmVudExSLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZFJ1bGVzKClcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMUi5wb3NcbiAgICAgIHJldHVybiBjdXJyZW50TFIudmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBib2R5ID0gcnVsZURpY3RbcnVsZU5hbWVdIHx8IGJyb3dzZXIuZXJyb3IoJ3VuZGVmaW5lZCBydWxlJywgcnVsZU5hbWUpXG4gICAgb3JpZ1Bvc0luZm8uZW50ZXIocnVsZU5hbWUpXG4gICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0pXG4gICAgdmFyIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKClcbiAgICBpZiAoY3VycmVudExSKSB7XG4gICAgICBpZiAoY3VycmVudExSLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5oYW5kbGVMZWZ0UmVjdXJzaW9uKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgb3JpZ1Bvc0luZm8ucG9zLCBjdXJyZW50TFIsIHZhbHVlKVxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9XG4gICAgICAgICAge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWUsIGludm9sdmVkUnVsZXM6IGN1cnJlbnRMUi5pbnZvbHZlZFJ1bGVzfVxuICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKVxuICAgICAgfSBlbHNlIGlmICghY3VycmVudExSLmludm9sdmVkUnVsZXNbcnVsZU5hbWVdKVxuICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBydWxlIGlzIG5vdCBpbnZvbHZlZCBpbiB0aGUgY3VycmVudCBsZWZ0IHJlY3Vyc2lvblxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfVxuICAgIH0gZWxzZVxuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX1cbiAgICBvcmlnUG9zSW5mby5leGl0KHJ1bGVOYW1lKVxuICAgIHJldHVybiB2YWx1ZVxuICB9XG59XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBydWxlRGljdCwgaW5wdXRTdHJlYW0pIHtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgdmFyIGJpbmRpbmdzID0gW11cbiAgdmFyIHZhbHVlID0gZXhwci5ldmFsKGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncylcbiAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbClcbiAgICByZXR1cm4gY29tbW9uLmZhaWxcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgdGh1bmtzLlJ1bGVUaHVuayh0aGlzLnJ1bGVOYW1lLCBpbnB1dFN0cmVhbS5zb3VyY2UsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdmFsdWUsIGJpbmRpbmdzKVxufVxuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUxlZnRSZWN1cnNpb24gPSBmdW5jdGlvbihib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3MsIGN1cnJlbnRMUiwgc2VlZFZhbHVlKSB7XG4gIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZVxuICBpZiAoc2VlZFZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIGN1cnJlbnRMUi52YWx1ZSA9IHNlZWRWYWx1ZVxuICAgIGN1cnJlbnRMUi5wb3MgPSBpbnB1dFN0cmVhbS5wb3NcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1Bvc1xuICAgICAgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSlcbiAgICAgIGlmICh2YWx1ZSAhPT0gY29tbW9uLmZhaWwgJiYgaW5wdXRTdHJlYW0ucG9zID4gY3VycmVudExSLnBvcykge1xuICAgICAgICBjdXJyZW50TFIudmFsdWUgPSB2YWx1ZVxuICAgICAgICBjdXJyZW50TFIucG9zID0gaW5wdXRTdHJlYW0ucG9zXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGN1cnJlbnRMUi52YWx1ZVxuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TFIucG9zXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZVxufVxuXG5wZXhwcnMuRXhwYW5kLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKVxufVxuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJylcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXVxufVxuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBiaW5kaW5ncyAtLSB0aGlzIHByb3BlcnR5IGlzIGNoZWNrZWQgYnkgdGhlIEdyYW1tYXIgY29uc3RydWN0b3IuXG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IFtdIDogdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKVxufVxuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5hbWVzID0gW11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspXG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5mYWN0b3JzW2lkeF0uZ2V0QmluZGluZ05hbWVzKCkpXG4gIHJldHVybiBuYW1lcy5zb3J0KClcbn1cblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW3RoaXMubmFtZV1cbn1cblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbn1cblxucGV4cHJzLlN0ci5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKClcbn1cblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpXG59XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZXMgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKylcbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmdldEJpbmRpbmdOYW1lcygpKVxuICByZXR1cm4gbmFtZXMuc29ydCgpXG59XG5cbnBleHBycy5FeHBhbmQucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHBhbnNpb24oKS5nZXRCaW5kaW5nTmFtZXMoKVxufVxuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJylcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpXG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJylcbnZhciBwcmludFN0cmluZyA9IGF3bGliLnN0cmluZ1V0aWxzLnByaW50U3RyaW5nXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGNvbW1vbi5hYnN0cmFjdFxuXG5wZXhwcnMuYW55dGhpbmcub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgLy8gbm8tb3Bcbn1cblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IuXygnKVxuICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMub2JqKSlcbiAgd3MubmV4dFB1dEFsbCgnKScpXG59XG5cbnBleHBycy5BbHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IuYWx0KCcpXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKVxuICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKVxuICAgIHRoaXMudGVybXNbaWR4XS5vdXRwdXRSZWNpcGUod3MpXG4gIH1cbiAgd3MubmV4dFB1dEFsbCgnKScpXG59XG5cbnBleHBycy5TZXEucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2Iuc2VxKCcpXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApXG4gICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgdGhpcy5mYWN0b3JzW2lkeF0ub3V0cHV0UmVjaXBlKHdzKVxuICB9XG4gIHdzLm5leHRQdXRBbGwoJyknKVxufVxuXG5wZXhwcnMuQmluZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5iaW5kKCcpXG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gIHdzLm5leHRQdXRBbGwoJywgJylcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLm5hbWUpKVxuICB3cy5uZXh0UHV0QWxsKCcpJylcbn1cblxucGV4cHJzLk1hbnkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IubWFueSgnKVxuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gIHdzLm5leHRQdXRBbGwodGhpcy5taW5OdW1NYXRjaGVzKVxuICB3cy5uZXh0UHV0QWxsKCcpJylcbn1cblxucGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5vcHQoJylcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cylcbiAgd3MubmV4dFB1dEFsbCgnKScpXG59XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2Iubm90KCcpXG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gIHdzLm5leHRQdXRBbGwoJyknKVxufVxuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLmxhKCcpXG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gIHdzLm5leHRQdXRBbGwoJyknKVxufVxuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLnN0cignKVxuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKVxuICB3cy5uZXh0UHV0QWxsKCcpJylcbn1cblxucGV4cHJzLkxpc3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IubHN0KCcpXG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpXG4gIHdzLm5leHRQdXRBbGwoJyknKVxufVxuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICBmdW5jdGlvbiBvdXRwdXRQcm9wZXJ0eVJlY2lwZShwcm9wKSB7XG4gICAgd3MubmV4dFB1dEFsbCgne25hbWU6ICcpXG4gICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyhwcm9wLm5hbWUpKVxuICAgIHdzLm5leHRQdXRBbGwoJywgcGF0dGVybjogJylcbiAgICBwcm9wLnBhdHRlcm4ub3V0cHV0UmVjaXBlKHdzKVxuICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICB9XG5cbiAgd3MubmV4dFB1dEFsbCgnYi5vYmooWycpXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApXG4gICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgb3V0cHV0UHJvcGVydHlSZWNpcGUodGhpcy5wcm9wZXJ0aWVzW2lkeF0pXG4gIH1cbiAgd3MubmV4dFB1dEFsbCgnXSwgJylcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyghIXRoaXMuaXNMZW5pZW50KSlcbiAgd3MubmV4dFB1dEFsbCgnKScpXG59XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5hcHAoJylcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLnJ1bGVOYW1lKSlcbiAgd3MubmV4dFB1dEFsbCgnKScpXG59XG5cbnBleHBycy5FeHBhbmQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIC8vIG5vLW9wXG59XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlXG59XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnByb2R1Y2VzVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKVxuICAgIGlmICghdGhpcy50ZXJtc1tpZHhdLnByb2R1Y2VzVmFsdWUoKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHJ1ZVxufVxuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZVxufVxuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZVxufVxuXG5wZXhwcnMuRXhwYW5kLnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cGFuc2lvbigpLnByb2R1Y2VzVmFsdWUoKVxufVxuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUb1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG5mdW5jdGlvbiBQRXhwcigpIHtcbiAgdGhyb3cgJ1BFeHByIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0J1xufVxuXG4vLyBBbnl0aGluZ1xuXG52YXIgYW55dGhpbmcgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKVxuXG4vLyBQcmltaXRpdmVzXG5cbmZ1bmN0aW9uIFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqXG59XG5cblByaW0ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSlcblxuZnVuY3Rpb24gU3RyaW5nUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmpcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUpXG5cbmZ1bmN0aW9uIFJlZ0V4cFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqXG59XG5cblJlZ0V4cFByaW0ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFByaW0ucHJvdG90eXBlKVxuXG4vLyBBbHRlcm5hdGlvblxuXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgdGhpcy50ZXJtcyA9IHRlcm1zXG59XG5cbkFsdC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKVxuXG4vLyBTZXF1ZW5jZXNcblxuZnVuY3Rpb24gU2VxKGZhY3RvcnMpIHtcbiAgdGhpcy5mYWN0b3JzID0gZmFjdG9yc1xufVxuXG5TZXEucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSlcblxuLy8gQmluZGluZ3NcblxuZnVuY3Rpb24gQmluZChleHByLCBuYW1lKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbiAgdGhpcy5uYW1lID0gbmFtZVxufVxuXG5CaW5kLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpXG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykge1xuICB0aGlzLmV4cHIgPSBleHByXG4gIHRoaXMubWluTnVtTWF0Y2hlcyA9IG1pbk51bU1hdGNoZXNcbn1cblxuTWFueS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKVxuXG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByXG59XG5cbk9wdC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKVxuXG4vLyBQcmVkaWNhdGVzXG5cbmZ1bmN0aW9uIE5vdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTm90LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpXG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuTG9va2FoZWFkLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpXG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHJcbn1cblxuU3RyLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpXG5cbi8vIExpc3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBMaXN0KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwclxufVxuXG5MaXN0LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpXG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWUgfSlcbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhuYW1lcylcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMClcbiAgICBicm93c2VyLmVycm9yKCdvYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOicsIGR1cGxpY2F0ZXMpXG4gIGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXNcbiAgICB0aGlzLmlzTGVuaWVudCA9IGlzTGVuaWVudFxuICB9XG59XG5cbk9iai5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKVxuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZVxufVxuXG5BcHBseS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKVxuXG4vLyBSdWxlIGV4cGFuc2lvbiAtLSBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gRXhwYW5kKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGlmIChncmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXSA9PT0gdW5kZWZpbmVkKVxuICAgIGJyb3dzZXIuZXJyb3IoJ2dyYW1tYXInLCBncmFtbWFyLm5hbWUsICdkb2VzIG5vdCBoYXZlIGEgcnVsZSBjYWxsZWQnLCBydWxlTmFtZSlcbiAgZWxzZSB7XG4gICAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hclxuICB9XG59XG5cbkV4cGFuZC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlLCB7XG4gIGV4cGFuc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbW1hci5ydWxlRGljdFt0aGlzLnJ1bGVOYW1lXVxuICB9XG59KVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5tYWtlUHJpbSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmxlbmd0aCAhPT0gMSlcbiAgICByZXR1cm4gbmV3IFN0cmluZ1ByaW0ob2JqKVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgcmV0dXJuIG5ldyBSZWdFeHBQcmltKG9iailcbiAgZWxzZVxuICAgIHJldHVybiBuZXcgUHJpbShvYmopXG59XG5cbmV4cG9ydHMuUEV4cHIgPSBQRXhwclxuZXhwb3J0cy5hbnl0aGluZyA9IGFueXRoaW5nXG5leHBvcnRzLlByaW0gPSBQcmltXG5leHBvcnRzLlN0cmluZ1ByaW0gPSBTdHJpbmdQcmltXG5leHBvcnRzLlJlZ0V4cFByaW0gPSBSZWdFeHBQcmltXG5leHBvcnRzLkFsdCA9IEFsdFxuZXhwb3J0cy5TZXEgPSBTZXFcbmV4cG9ydHMuQmluZCA9IEJpbmRcbmV4cG9ydHMuTWFueSA9IE1hbnlcbmV4cG9ydHMuT3B0ID0gT3B0XG5leHBvcnRzLk5vdCA9IE5vdFxuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWRcbmV4cG9ydHMuU3RyID0gU3RyXG5leHBvcnRzLkxpc3QgPSBMaXN0XG5leHBvcnRzLk9iaiA9IE9ialxuZXhwb3J0cy5BcHBseSA9IEFwcGx5XG5leHBvcnRzLkV4cGFuZCA9IEV4cGFuZFxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXh0ZW5zaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncy5qcycpXG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncy5qcycpXG5yZXF1aXJlKCcuL3BleHBycy1nZXRCaW5kaW5nTmFtZXMuanMnKVxucmVxdWlyZSgnLi9wZXhwcnMtZXZhbC5qcycpXG5yZXF1aXJlKCcuL3BleHBycy1vdXRwdXRSZWNpcGUuanMnKVxucmVxdWlyZSgnLi9wZXhwcnMtcHJvZHVjZXNWYWx1ZS5qcycpXG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsLmpzJylcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKVxudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUb1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gVGh1bmsoKSB7XG4gIHRocm93ICdUaHVuayBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCdcbn1cblxudmFyIG5leHRUaHVua0lkID0gMFxuVGh1bmsucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmlkID0gbmV4dFRodW5rSWQrK1xuICB9XG59XG5cbmZ1bmN0aW9uIFJ1bGVUaHVuayhydWxlTmFtZSwgc291cmNlLCBzdGFydElkeCwgZW5kSWR4LCB2YWx1ZSwgYmluZGluZ3MpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lXG4gIHRoaXMuc291cmNlID0gc291cmNlXG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeFxuICB0aGlzLmVuZElkeCA9IGVuZElkeFxuICB0aGlzLnZhbHVlID0gdmFsdWVcbiAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzXG59XG5cblJ1bGVUaHVuay5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oVGh1bmsucHJvdG90eXBlLCB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgaWYgKCFtZW1vLmhhc093blByb3BlcnR5KHRoaXMuaWQpKSB7XG4gICAgICB2YXIgYWN0aW9uID0gdGhpcy5sb29rdXBBY3Rpb24oYWN0aW9uRGljdClcbiAgICAgIHZhciBhZGRsSW5mbyA9IHRoaXMuY3JlYXRlQWRkbEluZm8oKVxuICAgICAgdmFyIGVudiA9IHRoaXMubWFrZUVudihhY3Rpb25EaWN0LCBtZW1vKVxuICAgICAgbWVtb1t0aGlzLmlkXSA9IGFjdGlvbi5jYWxsKGFkZGxJbmZvLCBlbnYpXG4gICAgfVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdXG4gIH0sXG5cbiAgbG9va3VwQWN0aW9uOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZVxuICAgIHZhciBhY3Rpb24gPSBhY3Rpb25EaWN0W3J1bGVOYW1lXVxuICAgIGlmIChhY3Rpb24gPT09IHVuZGVmaW5lZCAmJiBhY3Rpb25EaWN0Ll9kZWZhdWx0ICE9PSB1bmRlZmluZWQpXG4gICAgICBhY3Rpb24gPSBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgcmV0dXJuIGFjdGlvbkRpY3QuX2RlZmF1bHQuY2FsbCh0aGlzLCBydWxlTmFtZSwgZW52KVxuICAgICAgfVxuICAgIHJldHVybiBhY3Rpb24gfHwgYnJvd3Nlci5lcnJvcignbWlzc2luZyBzZW1hbnRpYyBhY3Rpb24gZm9yJywgcnVsZU5hbWUpXG4gIH0sXG5cbiAgY3JlYXRlQWRkbEluZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcnZhbDogbmV3IEludGVydmFsKHRoaXMuc291cmNlLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeClcbiAgICB9XG4gIH0sXG5cbiAgbWFrZUVudjogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIHZhciBiaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MubGVuZ3RoID09PSAwID8gWyd2YWx1ZScsIHRoaXMudmFsdWVdIDogdGhpcy5iaW5kaW5nc1xuICAgIHZhciBlbnYgPSB7fVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJpbmRpbmdzLmxlbmd0aDsgaWR4ICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gYmluZGluZ3NbaWR4XVxuICAgICAgdmFyIHRodW5rID0gYmluZGluZ3NbaWR4ICsgMV1cbiAgICAgIHRoaXMuYWRkQmluZGluZyhlbnYsIG5hbWUsIHRodW5rLCBhY3Rpb25EaWN0LCBtZW1vKVxuICAgIH1cbiAgICByZXR1cm4gZW52XG4gIH0sXG5cbiAgYWRkQmluZGluZzogZnVuY3Rpb24oZW52LCBuYW1lLCB2YWx1ZSwgYWN0aW9uRGljdCwgbWVtbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnYsIG5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFRodW5rKVxuICAgICAgICAgIHZhbHVlID0gdmFsdWUuZm9yY2UoYWN0aW9uRGljdCwgbWVtbylcbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIExpc3RUaHVuayh0aHVua3MpIHtcbiAgdGhpcy5pbml0KClcbiAgdGhpcy50aHVua3MgPSB0aHVua3Ncbn1cblxuTGlzdFRodW5rLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAoIW1lbW8uaGFzT3duUHJvcGVydHkodGhpcy5pZCkpXG4gICAgICBtZW1vW3RoaXMuaWRdID0gdGhpcy50aHVua3MubWFwKGZ1bmN0aW9uKHRodW5rKSB7IHJldHVybiB0aHVuay5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKSB9KVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdXG4gIH1cbn0pXG5cbmZ1bmN0aW9uIFZhbHVlVGh1bmsodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlXG59XG5cblZhbHVlVGh1bmsucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLnZhbHVlXG4gIH1cbn0pXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlJ1bGVUaHVuayA9IFJ1bGVUaHVua1xuZXhwb3J0cy5MaXN0VGh1bmsgPSBMaXN0VGh1bmtcbmV4cG9ydHMuVmFsdWVUaHVuayA9IFZhbHVlVGh1bmtcbmV4cG9ydHMudmFsdWVsZXNzVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh1bmRlZmluZWQpXG5cbiJdfQ==
(15)
});
