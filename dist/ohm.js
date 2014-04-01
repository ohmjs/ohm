!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/main.js');
ohm._ohmGrammarFactory =
(function(ohm, optNamespace) {
  var b = ohm._builder();
  b.setName('Ohm');
  b.setRuleDescription(undefined); b.define('Grammars', b.many(b.app('Grammar'), 0));
  b.setRuleDescription(undefined); b.define('Grammar', b.seq(b.bind(b.app('ident'), 'n'), b.bind(b.opt(b.app('SuperGrammar')), 's'), b.prim('{'), b.bind(b.many(b.app('Rule'), 0), 'rs'), b.prim('}')));
  b.inline('SuperGrammar_qualified', b.seq(b.prim('<:'), b.bind(b.app('ident'), 'ns'), b.prim('.'), b.bind(b.app('ident'), 'n')));
  b.inline('SuperGrammar_unqualified', b.seq(b.prim('<:'), b.bind(b.app('ident'), 'n')));
  b.setRuleDescription(undefined); b.define('SuperGrammar', b.alt(b.app('SuperGrammar_qualified'), b.app('SuperGrammar_unqualified')));
  b.inline('Rule_define', b.seq(b.bind(b.app('ident'), 'n'), b.bind(b.opt(b.app('ruleDescr')), 'd'), b.prim('='), b.bind(b.app('Alt'), 'b')));
  b.inline('Rule_override', b.seq(b.bind(b.app('ident'), 'n'), b.prim(':='), b.bind(b.app('Alt'), 'b')));
  b.inline('Rule_extend', b.seq(b.bind(b.app('ident'), 'n'), b.prim('+='), b.bind(b.app('Alt'), 'b')));
  b.setRuleDescription(undefined); b.define('Rule', b.alt(b.app('Rule_define'), b.app('Rule_override'), b.app('Rule_extend')));
  b.inline('Alt_rec', b.seq(b.bind(b.app('Term'), 'x'), b.prim('|'), b.bind(b.app('Alt'), 'y')));
  b.setRuleDescription(undefined); b.define('Alt', b.alt(b.app('Alt_rec'), b.app('Term')));
  b.inline('Term_inline', b.seq(b.bind(b.app('Seq'), 'x'), b.prim('{'), b.bind(b.app('name'), 'n'), b.prim('}')));
  b.setRuleDescription(undefined); b.define('Term', b.alt(b.app('Term_inline'), b.app('Seq')));
  b.setRuleDescription(undefined); b.define('Seq', b.many(b.app('Factor'), 0));
  b.inline('Factor_bind', b.seq(b.bind(b.app('Iter'), 'x'), b.prim(':'), b.bind(b.app('ident'), 'n')));
  b.setRuleDescription(undefined); b.define('Factor', b.alt(b.app('Factor_bind'), b.app('Iter')));
  b.inline('Iter_star', b.seq(b.bind(b.app('Pred'), 'x'), b.prim('*')));
  b.inline('Iter_plus', b.seq(b.bind(b.app('Pred'), 'x'), b.prim('+')));
  b.inline('Iter_opt', b.seq(b.bind(b.app('Pred'), 'x'), b.prim('?')));
  b.setRuleDescription(undefined); b.define('Iter', b.alt(b.app('Iter_star'), b.app('Iter_plus'), b.app('Iter_opt'), b.app('Pred')));
  b.inline('Pred_not', b.seq(b.prim('~'), b.bind(b.app('Base'), 'x')));
  b.inline('Pred_lookahead', b.seq(b.prim('&'), b.bind(b.app('Base'), 'x')));
  b.setRuleDescription(undefined); b.define('Pred', b.alt(b.app('Pred_not'), b.app('Pred_lookahead'), b.app('Base')));
  b.inline('Base_application', b.seq(b.bind(b.app('ident'), 'ruleName'), b.not(b.alt(b.seq(b.opt(b.app('ruleDescr')), b.prim('=')), b.prim(':='), b.prim('+=')))));
  b.inline('Base_prim', b.alt(b.app('keyword'), b.app('string'), b.app('regExp'), b.app('number')));
  b.inline('Base_lst', b.seq(b.prim('['), b.bind(b.app('Alt'), 'x'), b.prim(']')));
  b.inline('Base_str', b.seq(b.prim('"'), b.bind(b.app('Alt'), 'x'), b.prim('"')));
  b.inline('Base_paren', b.seq(b.prim('('), b.bind(b.app('Alt'), 'x'), b.prim(')')));
  b.inline('Base_obj', b.seq(b.prim('{'), b.bind(b.opt(b.prim('...')), 'lenient'), b.prim('}')));
  b.inline('Base_objWithProps', b.seq(b.prim('{'), b.bind(b.app('Props'), 'ps'), b.bind(b.opt(b.seq(b.prim(','), b.prim('...'))), 'lenient'), b.prim('}')));
  b.setRuleDescription(undefined); b.define('Base', b.alt(b.app('Base_application'), b.app('Base_prim'), b.app('Base_lst'), b.app('Base_str'), b.app('Base_paren'), b.app('Base_obj'), b.app('Base_objWithProps')));
  b.setRuleDescription(undefined); b.define('Prop', b.seq(b.bind(b.alt(b.app('name'), b.app('string')), 'n'), b.prim(':'), b.bind(b.app('Base'), 'p')));
  b.inline('Props_rec', b.seq(b.bind(b.app('Prop'), 'p'), b.prim(','), b.bind(b.app('Props'), 'ps')));
  b.inline('Props_base', b.bind(b.app('Prop'), 'p'));
  b.setRuleDescription(undefined); b.define('Props', b.alt(b.app('Props_rec'), b.app('Props_base')));
  b.setRuleDescription(' rule description for use in error messages'); b.define('ruleDescr', b.seq(b.prim('--'), b.bind(b.app('ruleDescrText'), 't'), b.prim('\n')));
  b.setRuleDescription(undefined); b.define('ruleDescrText', b.many(b.seq(b.not(b.prim('\n')), b.app('_')), 0));
  b.inline('space_singleLine', b.seq(b.prim('//'), b.many(b.seq(b.not(b.prim('\n')), b.app('_')), 0), b.prim('\n')));
  b.inline('space_multiLine', b.seq(b.prim('/*'), b.many(b.seq(b.not(b.prim('*/')), b.app('_')), 0), b.prim('*/')));
  b.extend('space', b.alt(b.app('space_singleLine'), b.app('space_multiLine')));
  b.setRuleDescription(' name'); b.define('name', b.seq(b.app('nameFirst'), b.many(b.app('nameRest'), 0)));
  b.setRuleDescription(undefined); b.define('nameFirst', b.alt(b.prim('_'), b.app('letter')));
  b.setRuleDescription(undefined); b.define('nameRest', b.alt(b.prim('_'), b.app('alnum')));
  b.setRuleDescription(' identifier'); b.define('ident', b.seq(b.not(b.app('keyword')), b.bind(b.app('name'), 'n')));
  b.inline('keyword_undefined', b.seq(b.prim('undefined'), b.not(b.app('nameRest'))));
  b.inline('keyword_null', b.seq(b.prim('null'), b.not(b.app('nameRest'))));
  b.inline('keyword_true', b.seq(b.prim('true'), b.not(b.app('nameRest'))));
  b.inline('keyword_false', b.seq(b.prim('false'), b.not(b.app('nameRest'))));
  b.setRuleDescription(undefined); b.define('keyword', b.alt(b.app('keyword_undefined'), b.app('keyword_null'), b.app('keyword_true'), b.app('keyword_false')));
  b.setRuleDescription(' string literal'); b.define('string', b.seq(b.prim("'"), b.bind(b.many(b.app('sChar'), 0), 'cs'), b.prim("'")));
  b.setRuleDescription(undefined); b.define('sChar', b.alt(b.seq(b.prim('\\x'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b.prim('\\u'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b.prim('\\'), b.app('_')), b.seq(b.not(b.prim("'")), b.not(b.prim('\n')), b.app('_'))));
  b.setRuleDescription(' regular expression'); b.define('regExp', b.seq(b.prim('/'), b.bind(b.app('reCharClass'), 'e'), b.prim('/')));
  b.setRuleDescription(undefined); b.define('reCharClass', b.seq(b.prim('['), b.many(b.alt(b.prim('\\]'), b.seq(b.not(b.prim(']')), b.app('_'))), 0), b.prim(']')));
  b.setRuleDescription(' number'); b.define('number', b.seq(b.opt(b.prim('-')), b.many(b.app('digit'), 1)));
  return b.build(optNamespace);
});

},{"../src/main.js":16}],2:[function(_dereq_,module,exports){
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

var Grammar = _dereq_('./Grammar.js');
var decls = _dereq_('./decls.js');
var pexprs = _dereq_('./pexprs.js');

var awlib = _dereq_('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {
  this.init();
}

Builder.prototype = {
  init: function() {
    this.name = undefined;
    this.superGrammar = Grammar.prototype;
    this.ruleDecls = [];
  },

  setName: function(name) {
    this.name = name;
  },

  setSuperGrammar: function(grammar) {
    this.superGrammar = grammar;
  },

  setRuleDescription: function(text) {
    this.ruleDescription = text;
  },

  define: function(ruleName, body) {
    this.ruleDecls.push(new decls.Define(ruleName, body, this.superGrammar, this.ruleDescription));
    this.ruleDescription = undefined;
  },

  override: function(ruleName, body) {
    this.ruleDecls.push(new decls.Override(ruleName, body, this.superGrammar));
  },

  inline: function(ruleName, body) {
    this.ruleDecls.push(new decls.Inline(ruleName, body, this.superGrammar));
    return this.app(ruleName);
  },

  extend: function(ruleName, body) {
    this.ruleDecls.push(new decls.Extend(ruleName, body, this.superGrammar));
  },

  build: function(optNamespace) {
    var superGrammar = this.superGrammar;
    var ruleDict = objectThatDelegatesTo(superGrammar.ruleDict);
    this.ruleDecls.forEach(function(ruleDecl) {
      ruleDecl.performChecks();
      ruleDecl.install(ruleDict);
    });

    var grammar = new Grammar(ruleDict);
    grammar.superGrammar = superGrammar;
    grammar.ruleDecls = this.ruleDecls;
    if (this.name) {
      grammar.name = this.name;
      if (optNamespace) {
        grammar.namespaceName = optNamespace.name;
        optNamespace.install(this.name, grammar);
      }
    }
    this.init();
    return grammar;
  },

  prim: function(x) { return pexprs.makePrim(x); },
  alt: function(/* term1, term1, ... */) {
    var terms = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
      if (arg instanceof pexprs.Alt) {
        terms = terms.concat(arg.terms);
      } else {
        terms.push(arg);
      }
    }
    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms);
  },
  seq: function(/* factor1, factor2, ... */) {
    var factors = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
      if (arg instanceof pexprs.Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
  },
  bind: function(expr, name) { return new pexprs.Bind(expr, name); },
  many: function(expr, minNumMatches) { return new pexprs.Many(expr, minNumMatches); },
  opt: function(expr) { return new pexprs.Opt(expr); },
  not: function(expr) { return new pexprs.Not(expr); },
  la: function(expr) { return new pexprs.Lookahead(expr); },
  str: function(expr) { return new pexprs.Str(expr); },
  lst: function(expr) { return new pexprs.List(expr); },
  obj: function(properties, isLenient) { return new pexprs.Obj(properties, !!isLenient); },
  app: function(ruleName) { return new pexprs.Apply(ruleName); }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;


},{"./Grammar.js":8,"./decls.js":14,"./pexprs.js":26,"awlib":2}],8:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var errors = _dereq_('./errors.js');
var InputStream = _dereq_('./InputStream.js');
var pexprs = _dereq_('./pexprs.js');
var skipSpaces = _dereq_('./skipSpaces.js');

var awlib = _dereq_('awlib');
var browser = awlib.browser;
var keysDo = awlib.objectUtils.keysDo;
var valuesDo = awlib.objectUtils.valuesDo;
var formals = awlib.objectUtils.formals;
var makeStringBuffer = awlib.objectUtils.stringBuffer;
var makeColumnStringBuffer = awlib.objectUtils.columnStringBuffer;
var printString = awlib.stringUtils.printString;
var equals = awlib.equals.equals;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(ruleDict) {
  this.ruleDict = ruleDict;
}

Grammar.prototype = {
  ruleDict: new (function() {
    this._ = pexprs.anything;
    this.end = new pexprs.Not(pexprs.anything);
    this.space = pexprs.makePrim(/[\s]/);
    this.space.description = 'space';
    this.alnum = pexprs.makePrim(/[0-9a-zA-Z]/);
    this.space.description = 'alpha-numeric character';
    this.letter = pexprs.makePrim(/[a-zA-Z]/);
    this.letter.description = 'letter';
    this.lower = pexprs.makePrim(/[a-z]/);
    this.lower.description = 'lower-case letter';
    this.upper = pexprs.makePrim(/[A-Z]/);
    this.upper.description = 'upper-case letter';
    this.digit = pexprs.makePrim(/[0-9]/);
    this.digit.description = 'digit';
    this.hexDigit = pexprs.makePrim(/[0-9a-fA-F]/);
    this.hexDigit.description = 'hexadecimal digit';
  })(),

  match: function(obj, startRule, optThrowOnFail) {
    return this.matchContents([obj], startRule, optThrowOnFail);
  },

  matchContents: function(obj, startRule, optThrowOnFail) {
    var inputStream = InputStream.newFor(obj);
    var thunk = new pexprs.Apply(startRule).eval(optThrowOnFail, undefined, this.ruleDict, inputStream, undefined);

    var succeeded;
    if (thunk === common.fail) {
      succeeded = false;
    } else {
      // This match only succeeded if the start rule consumed all of the input.
      if (common.isSyntactic(startRule)) {
        skipSpaces(this.ruleDict, inputStream);
      }
      succeeded = pexprs.end.eval(optThrowOnFail, false, this.ruleDict, inputStream, undefined) !== common.fail;
    }

    if (succeeded) {
      var assertSemanticActionNamesMatch = this.assertSemanticActionNamesMatch.bind(this);
      var ans = function(actionDict) {
        assertSemanticActionNamesMatch(actionDict);
        return thunk.force(actionDict, {});
      };
      ans.toString = function() { return '[ohm thunk]'; };
      return ans;
    } else if (optThrowOnFail) {
      throw new errors.MatchFailure(inputStream, this.ruleDict);
    } else {
      return false;
    }
  },

  assertSemanticActionNamesMatch: function(actionDict) {
    var self = this;
    var ruleDict = this.ruleDict;
    var ok = true;
    keysDo(ruleDict, function(ruleName) {
      if (actionDict[ruleName] === undefined) {
        return;
      }
      var actual = formals(actionDict[ruleName]).sort();
      var expected = self.semanticActionArgNames(ruleName);
      if (!equals(actual, expected)) {
        ok = false;
        console.log('semantic action for rule', ruleName, 'has the wrong argument names');
        console.log('  expected', expected);
        console.log('    actual', actual);
      }
    });
    if (!ok) {
      browser.error('one or more semantic actions have the wrong argument names -- see console for details');
    }
  },

  semanticActionArgNames: function(ruleName) {
    if (this.superGrammar && this.superGrammar.ruleDict[ruleName]) {
      return this.superGrammar.semanticActionArgNames(ruleName);
    } else {
      var body = this.ruleDict[ruleName];
      var names = body.getBindingNames();
      return names.length > 0 || body.producesValue() ? ['env'] : [];
    }
  },

  toRecipe: function() {
    var ws = makeStringBuffer();
    ws.nextPutAll('(function(ohm, optNamespace) {\n');
    ws.nextPutAll('  var b = ohm._builder();\n');
    ws.nextPutAll('  b.setName('); ws.nextPutAll(printString(this.name)); ws.nextPutAll(');\n');
    if (this.superGrammar.name && this.superGrammar.namespaceName) {
      ws.nextPutAll('  b.setSuperGrammar(ohm.namespace(');
      ws.nextPutAll(printString(this.superGrammar.namespaceName));
      ws.nextPutAll(').getGrammar(');
      ws.nextPutAll(printString(this.superGrammar.name));
      ws.nextPutAll('));\n');
    }
    for (var idx = 0; idx < this.ruleDecls.length; idx++) {
      ws.nextPutAll('  ');
      this.ruleDecls[idx].outputRecipe(ws);
      ws.nextPutAll(';\n');
    }
    ws.nextPutAll('  return b.build(optNamespace);\n');
    ws.nextPutAll('});');
    return ws.contents();
  },

  toSemanticActionTemplate: function(/* entryPoint1, entryPoint2, ... */) {
    var entryPoints = arguments.length > 0 ? arguments : Object.keys(this.ruleDict);
    var rulesToBeIncluded = this.rulesThatNeedSemanticAction(entryPoints);
    
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus should appear next to
    // other cases of AddExpr.

    var self = this;
    var buffer = makeColumnStringBuffer();
    buffer.nextPutAll('{');

    var first = true;
    for (var ruleName in rulesToBeIncluded) {
      var body = this.ruleDict[ruleName];
      if (first) {
        first = false;
      } else {
        buffer.nextPutAll(',');
      }
      buffer.newLine();
      buffer.nextPutAll('  ');
      buffer.newColumn();
      self.addSemanticActionTemplate(ruleName, body, buffer);
    }

    buffer.newLine();
    buffer.nextPutAll('}');
    return buffer.contents();
  },

  addSemanticActionTemplate: function(ruleName, body, buffer) {
    buffer.nextPutAll(ruleName);
    buffer.nextPutAll(': ');
    buffer.newColumn();
    buffer.nextPutAll('function(');
    buffer.nextPutAll(this.semanticActionArgNames(ruleName).join(', '));
    buffer.nextPutAll(') ');
    buffer.newColumn();
    buffer.nextPutAll('{');

    var envProperties = body.getBindingNames();
    if (envProperties.length === 0 && body.producesValue()) {
      envProperties = ['value'];
    }
    if (envProperties.length > 0) {
      buffer.nextPutAll(' /* ');
      buffer.nextPutAll(envProperties.join(', '));
      buffer.nextPutAll(' */ ');
    }
    buffer.nextPutAll('}');
  },

  rulesThatNeedSemanticAction: function(entryPoints) {
    var self = this;
    function getBody(ruleName) {
      if (self.ruleDict[ruleName] === undefined) {
        throw new errors.UndeclaredRule(ruleName, self.name);
      } else {
        return self.ruleDict[ruleName];
      }
    }

    var rules = {};
    for (var idx = 0; idx < entryPoints.length; idx++) {
      var ruleName = entryPoints[idx];
      getBody(ruleName);  // to make sure the rule exists
      rules[ruleName] = true;
    }

    var done = false;
    while (!done) {
      done = true;
      for (var ruleName in rules) {
        var addedNewRule = getBody(ruleName).addRulesThatNeedSemanticAction(rules, true);
        done &= !addedNewRule;
      }
    }

    return rules;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;


},{"./InputStream.js":9,"./common.js":13,"./errors.js":15,"./pexprs.js":26,"./skipSpaces.js":27,"awlib":2}],9:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var PosInfo = _dereq_('./PosInfo.js');
var Grammar = _dereq_('./Grammar.js');

var awlib = _dereq_('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream() {
  throw 'InputStream cannot be instantiated -- it\'s abstract';
}

InputStream.newFor = function(obj) {
  if (typeof obj === 'string') {
    return new StringInputStream(obj);
  } else if (obj instanceof Array) {
    return new ListInputStream(obj);
  } else {
    throw 'cannot make input stream for ' + obj;
  }
};

InputStream.prototype = {
  init: function(source) {
    this.source = source;
    this.pos = 0;
    this.posInfos = [];
    this.failures = null;
    this.failuresPos = -1;
  },

  recordFailure: function(pos, expr) {
    if (pos > this.failuresPos) {
      this.failures = {expr: expr, next: null};
      this.failuresPos = pos;
    } else if (pos === this.failuresPos) {
      this.failures = {expr: expr, next: this.failures};
    }
  },

  getCurrentPosInfo: function() {
    var currPos = this.pos;
    var posInfo = this.posInfos[currPos];
    return posInfo || (this.posInfos[currPos] = new PosInfo(currPos));
  },

  atEnd: function() {
    return this.pos === this.source.length;
  },

  next: function() {
    if (this.atEnd()) {
      return common.fail;
    } else {
      return this.source[this.pos++];
    }
  },

  matchExactly: function(x) {
    return this.next() === x ? true : common.fail;
  },

  interval: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  getFailuresPos: function() {
    return this.failuresPos;
  }
};

function StringInputStream(source) {
  this.init(source);
}

StringInputStream.prototype = objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    for (var idx = 0; idx < s.length; idx++) {
      if (this.matchExactly(s[idx]) === common.fail) {
        return common.fail;
      }
    }
    return true;
  },

  matchRegExp: function(e) {
    // IMPORTANT: e must be a non-global, one-character expression, e.g., /./ and /[0-9]/
    var c = this.next();
    return c !== common.fail && e.test(c) ? true : common.fail;
  }
});

function ListInputStream(source) {
  this.init(source);
}

ListInputStream.prototype = objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    return this.matchExactly(s);
  },

  matchRegExp: function(e) {
    return this.matchExactly(e);
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;


},{"./Grammar.js":8,"./PosInfo.js":12,"./common.js":13,"awlib":2}],10:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = _dereq_('./InputStream.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Interval(source, startIdx, endIdx) {
  this.source = source;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Object.defineProperties(Interval.prototype, {
  'contents': {
    get: function() {
      if (this._contents === undefined) {
        this._contents = InputStream.newFor(this.source).interval(this.startIdx, this.endIdx);
      }
      return this._contents;
    },
    enumerable: true
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;


},{"./InputStream.js":9}],11:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = _dereq_('./main.js');
var errors = _dereq_('./errors.js');

var awlib = _dereq_('awlib');
var browser = awlib.browser;

// --------------------------------------------------------------------
// Namespaces
// --------------------------------------------------------------------

function Namespace(name) {
  this.name = name;
  this.grammars = {};
}

Namespace.prototype = {
  install: function(name, grammar) {
    if (this.grammars[name]) {
      throw new errors.DuplicateGrammarDeclaration(name, this.name);
    } else {
      this.grammars[name] = grammar;
    }
    return this;
  },

  getGrammar: function(name) {
    if (this.grammars[name]) {
      return this.grammars[name];
    } else {
      throw new errors.UndeclaredGrammar(name, this.name);
    }
  },

  loadGrammarsFromScriptElement: function(element) {
    browser.sanityCheck('script tag\'s type attribute must be "text/ohm-js"', element.type === 'text/ohm-js');
    ohm.makeGrammars(element.innerHTML, this);
    return this;
  },

  make: function(recipe) {
    return recipe(ohm, this);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Namespace;


},{"./errors.js":15,"./main.js":16,"awlib":2}],12:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo() {
  this.ruleStack = [];
  this.activeRules = {};  // redundant (could be generated from ruleStack) but useful for performance reasons
  this.memo = {};
}

PosInfo.prototype = {
  isActive: function(ruleName) {
    return this.activeRules[ruleName];
  },

  enter: function(ruleName) {
    this.ruleStack.push(ruleName);
    this.activeRules[ruleName] = true;
  },

  exit: function(ruleName) {
    this.ruleStack.pop();
    this.activeRules[ruleName] = false;
  },

  shouldUseMemoizedResult: function(memoRec) {
    var involvedRules = memoRec.involvedRules;
    for (var ruleName in involvedRules) {
      if (involvedRules[ruleName] && this.activeRules[ruleName]) {
        return false;
      }
    }
    return true;
  },

  getCurrentLeftRecursion: function() {
    return this.leftRecursionStack ? this.leftRecursionStack[this.leftRecursionStack.length - 1] : undefined;
  },

  startLeftRecursion: function(ruleName) {
    if (!this.leftRecursionStack) {
      this.leftRecursionStack = [];
    }
    this.leftRecursionStack.push({name: ruleName, value: common.fail, pos: -1, involvedRules: {}});
    this.updateInvolvedRules();
  },

  endLeftRecursion: function(ruleName) {
    this.leftRecursionStack.pop();
  },

  updateInvolvedRules: function() {
    var currentLeftRecursion = this.getCurrentLeftRecursion();
    var involvedRules = currentLeftRecursion.involvedRules;
    var lrRuleName = currentLeftRecursion.name;
    var idx = this.ruleStack.length - 1;
    while (true) {
      var ruleName = this.ruleStack[idx--];
      if (ruleName === lrRuleName) {
        break;
      }
      involvedRules[ruleName] = true;
    }
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;


},{"./common.js":13}],13:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function() {
  throw 'this method is abstract!';
};

exports.getDuplicates = function(array) {
  var duplicates = [];
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
};

exports.fail = {};

exports.isSyntactic = function(ruleName) {
  var firstChar = ruleName[0];
  return 'A' <= firstChar && firstChar <= 'Z';
};


},{}],14:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');
var errors = _dereq_('./errors.js');

var awlib = _dereq_('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;
var printString = awlib.stringUtils.printString;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function outputRecipe(decl, ws) {
  ws.nextPutAll('b.');
  ws.nextPutAll(decl.kind);
  ws.nextPutAll('(');
  ws.nextPutAll(printString(decl.name));
  ws.nextPutAll(', ');
  decl.body.outputRecipe(ws);
  ws.nextPutAll(')');
}

function RuleDecl() {
  throw 'RuleDecl cannot be instantiated -- it\'s abstract';
}

RuleDecl.prototype = {
  performChecks: common.abstract,

  performCommonChecks: function(name, body) {
    body.assertNoDuplicateBindings(name);
    body.assertNoUselessBindings(name);
    body.assertChoicesHaveUniformBindings(name);
  },

  install: common.abstract,

  outputRecipe: function(ws) { outputRecipe(this, ws); }
};

function Define(name, body, superGrammar, description) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
  this.description = description;
}

Define.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'define',

  performChecks: function() {
    if (this.superGrammar.ruleDict[this.name]) {
      throw new errors.DuplicateRuleDeclaration(this.name, this.superGrammar.name);
    }
    this.performCommonChecks(this.name, this.body);
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.setRuleDescription(');
    ws.nextPutAll(printString(this.description));
    ws.nextPutAll('); ');
    outputRecipe(this, ws);
  },

  install: function(ruleDict) {
    this.body.description = this.description;
    ruleDict[this.name] = this.body;
  }
});

function Override(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Override.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'override',

  performChecks: function() {
    var overridden = this.superGrammar.ruleDict[this.name];
    if (!overridden) {
      throw new errors.UndeclaredRule(this.name, this.superGrammar.name);
    }
    if (overridden.getBindingNames().length === 0 && overridden.producesValue() && !this.body.producesValue()) {
      throw new errors.RuleMustProduceValue(this.name, 'overriding');
    }
    this.performCommonChecks(this.name, this.body);
  },

  install: function(ruleDict) {
    this.body.description = this.superGrammar.ruleDict[this.name].description;
    ruleDict[this.name] = this.body;
  }
});

function Inline(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Inline.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'inline',

  performChecks: function() {
    // TODO: consider relaxing this check, e.g., make it ok to override an inline rule if the nesting rule is
    // an override. But only if the inline rule that's being overridden is nested inside the nesting rule that
    // we're overriding? Hopefully there's a much less complicated way to do this :)
    if (this.superGrammar.ruleDict[this.name]) {
      throw new errors.DuplicateRuleDeclaration(this.name, this.superGrammar.name);
    }
    this.performCommonChecks(this.name, this.body);
  },

  install: function(ruleDict) {
    ruleDict[this.name] = this.body;
  }
});

function Extend(name, body, superGrammar) {
  this.name = name;
  this.base = superGrammar.ruleDict[name];
  if (!this.base) {
    throw new errors.UndeclaredRule(name, superGrammar.name);
  }
  this.body = body;
  this.extendedBody = new pexprs.ExtendAlt(this.body, this.base);
  this.superGrammar = superGrammar;
}

Extend.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'extend',

  performChecks: function() {
    if (this.base.getBindingNames().length === 0 && this.base.producesValue() && !this.body.producesValue()) {
      throw new errors.RuleMustProduceValue(this.name, 'extending');
    }
    this.performCommonChecks(this.name, this.extendedBody);
  },

  install: function(ruleDict) {
    this.extendedBody.description = this.superGrammar.ruleDict[this.name].description;
    ruleDict[this.name] = this.extendedBody;
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleDecl = RuleDecl;
exports.Define = Define;
exports.Override = Override;
exports.Inline = Inline;
exports.Extend = Extend;


},{"./common.js":13,"./errors.js":15,"./pexprs.js":26,"awlib":2}],15:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');

var awlib = _dereq_('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;
var makeStringBuffer = awlib.objectUtils.stringBuffer;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Error() {
  throw 'Error cannot be instantiated -- it\'s abstract';
}

Error.prototype.getMessage = common.abstract;

Error.prototype.printMessage = function() {
  console.log(this.getMessage());
};

Error.prototype.getShortMessage = function() {
  return this.getMessage();
};

Error.prototype.printShortMessage = function() {
  console.log(this.getMessage());
};

Error.prototype.toString = function() {
  return this.getShortMessage();
};

// ----------------- errors about grammars -----------------

// Undeclarated grammar

function UndeclaredGrammar(grammarName, optNamespaceName) {
  this.grammarName = grammarName;
  this.namespaceName = optNamespaceName;
};

UndeclaredGrammar.prototype = objectThatDelegatesTo(Error.prototype);

UndeclaredGrammar.prototype.getMessage = function() {
  return this.namespaceName ?
    ['grammar', this.grammarName, 'is not declared in namespace', this.namespaceName].join(' ') :
    ['undeclared grammar', this.grammarName].join(' ');
};

// Duplicate grammar declaration

function DuplicateGrammarDeclaration(grammarName, namespaceName) {
  this.grammarName = grammarName;
  this.namespaceName = namespaceName;
};

DuplicateGrammarDeclaration.prototype = objectThatDelegatesTo(Error.prototype);

DuplicateGrammarDeclaration.prototype.getMessage = function() {
  return ['grammar', this.grammarName, 'is already declared in namespace', this.namespaceName].join(' ');
};

// ----------------- rules -----------------

// Undeclared rule

function UndeclaredRule(ruleName, optGrammarName) {
  this.ruleName = ruleName;
  this.grammarName = optGrammarName;
};

UndeclaredRule.prototype = objectThatDelegatesTo(Error.prototype);

UndeclaredRule.prototype.getMessage = function() {
  return this.grammarName ?
    ['rule', this.ruleName, 'is not declared in grammar', this.grammarName].join(' ') :
    ['undeclared rule', this.ruleName].join(' ');
};

// Duplicate rule declaration

function DuplicateRuleDeclaration(ruleName, grammarName) {
  this.ruleName = ruleName;
  this.grammarName = grammarName;
};

DuplicateRuleDeclaration.prototype = objectThatDelegatesTo(Error.prototype);

DuplicateRuleDeclaration.prototype.getMessage = function() {
  return ['rule', this.ruleName, 'is already declared in grammar', this.grammarName].join(' ');
};

// Rule must produce value

function RuleMustProduceValue(ruleName, why) {
  this.ruleName = ruleName;
  this.why = why;
};

RuleMustProduceValue.prototype = objectThatDelegatesTo(Error.prototype);

RuleMustProduceValue.prototype.getMessage = function() {
  return [
    'rule', this.ruleName, 'must produce a value',
    'because the rule it is', this.why, 'also produces a value'
  ].join(' ');
};

// ----------------- bindings -----------------

// Inconsistent bindings

function InconsistentBindings(ruleName, expected, actual) {
  this.ruleName = ruleName;
  this.expected = expected;
  this.actual = actual;
};

InconsistentBindings.prototype = objectThatDelegatesTo(Error.prototype);

InconsistentBindings.prototype.getMessage = function() {
  return [
    'rule', this.ruleName, 'has inconsistent bindings.',
    'expected:', this.expected,
    'got:', this.actual
  ].join(' ');
};

// Duplicate bindings

function DuplicateBindings(ruleName, duplicates) {
  this.ruleName = ruleName;
  this.duplicates = duplicates;
};

DuplicateBindings.prototype = objectThatDelegatesTo(Error.prototype);

DuplicateBindings.prototype.getMessage = function() {
  return ['rule', this.ruleName, 'has duplicate bindings:', this.duplicates].join(' ');
};

// Useless bindings

function UselessBindings(ruleName, useless) {
  this.ruleName = ruleName;
  this.useless = useless;
};

UselessBindings.prototype = objectThatDelegatesTo(Error.prototype);

UselessBindings.prototype.getMessage = function() {
  return ['rule', this.ruleName, 'has useless bindings:', this.useless].join(' ');
};

// ----------------- properties -----------------

// Duplicate property names

function DuplicatePropertyNames(duplicates) {
  this.duplicates = duplicates;
};

DuplicatePropertyNames.prototype = objectThatDelegatesTo(Error.prototype);

DuplicatePropertyNames.prototype.getMessage = function() {
  return ['object pattern has duplicate property names:', this.duplicates].join(' ');
};

// ----------------- syntax -----------------

function toErrorInfo(pos, str) {
  var lineNum = 1;
  var colNum = 1;

  var currPos = 0;
  var lineStartPos = 0;

  while (currPos < pos) {
    var c = str.charAt(currPos++);
    if (c === '\n') {
      lineNum++;
      colNum = 1;
      lineStartPos = currPos;
    } else if (c !== '\r') {
      colNum++;
    }
  }

  var lineEndPos = str.indexOf('\n', lineStartPos);
  if (lineEndPos < 0) {
    lineEndPos = str.length;
  }

  return {
    lineNum: lineNum,
    colNum: colNum,
    line: str.substr(lineStartPos, lineEndPos - lineStartPos)
  };
}

function MatchFailure(inputStream, ruleDict) {
  this.inputStream = inputStream;
  this.ruleDict = ruleDict;
}

MatchFailure.prototype = objectThatDelegatesTo(Error.prototype);

MatchFailure.prototype.getPos = function() {
  return this.inputStream.failuresPos;
};

MatchFailure.prototype.getShortMessage = function() {
 if (typeof this.inputStream.source !== 'string') {
    return 'error at position ' + this.getPos();
  } else {
    var text = makeStringBuffer();
    var errorInfo = toErrorInfo(this.getPos(), this.inputStream.source);
    text.nextPutAll(this.getLineAndColText());
    text.nextPutAll(': expected ');
    text.nextPutAll(this.getExpectedText());
    return text.contents();
  }
};

MatchFailure.prototype.getMessage = function() {
 if (typeof this.inputStream.source !== 'string') {
    return 'error at position ' + this.getPos();
  } else {
    var text = makeStringBuffer();
    var errorInfo = toErrorInfo(this.getPos(), this.inputStream.source);
    var lineAndColText = this.getLineAndColText() + ': ';
    text.nextPutAll(lineAndColText);
    text.nextPutAll(errorInfo.line);
    text.nextPutAll('\n');
    for (var idx = 1; idx < lineAndColText.length + errorInfo.colNum; idx++) {
      text.nextPutAll(' ');
    }
    text.nextPutAll('^');
  }
  text.nextPutAll('\nExpected: ');
  text.nextPutAll(this.getExpectedText());
  return text.contents();
};

MatchFailure.prototype.getLineAndColText = function() {
  var errorInfo = toErrorInfo(this.getPos(), this.inputStream.source);
  return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum;
};

MatchFailure.prototype.getExpectedText = function() {
  var text = makeStringBuffer();
  var expected = this.getExpected();
  for (var idx = 0; idx < expected.length; idx++) {
    if (idx > 0) {
      if (idx === expected.length - 1) {
        text.nextPutAll(expected.length > 2 ? ', or ' : ' or ');
      } else {
        text.nextPutAll(', ');
      }
    }
    text.nextPutAll(expected[idx]);
  }
  return text.contents();
};

MatchFailure.prototype.getExpected = function() {
  var expected = {};
  for (var failure = this.inputStream.failures; failure !== null; failure = failure.next) {
    expected[failure.expr.toExpected(this.ruleDict)] = true;
  }
  return Object.keys(expected).reverse();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.UndeclaredGrammar = UndeclaredGrammar;
exports.DuplicateGrammarDeclaration = DuplicateGrammarDeclaration;
exports.UndeclaredRule = UndeclaredRule;
exports.DuplicateRuleDeclaration = DuplicateRuleDeclaration;
exports.RuleMustProduceValue = RuleMustProduceValue;
exports.InconsistentBindings = InconsistentBindings;
exports.DuplicateBindings = DuplicateBindings;
exports.UselessBindings = UselessBindings;
exports.DuplicatePropertyNames = DuplicatePropertyNames;
exports.MatchFailure = MatchFailure;


},{"./common.js":13,"awlib":2}],16:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

_dereq_('../dist/ohm-grammar.js');

var Builder = _dereq_('./Builder.js');
var Namespace = _dereq_('./Namespace.js');
var errors = _dereq_('./errors.js');

var awlib = _dereq_('awlib');
var unescapeChar = awlib.stringUtils.unescapeChar;

var thisModule = exports;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function makeGrammarActionDict(optNamespace) {
  var builder;
  return {
    space:                      function(env) {},
    space_multiLine:            function()    {},
    space_singleLine:           function()    {},

    ruleDescr:                  function(env) { builder.setRuleDescription(env.t); },
    ruleDescrText:              function()    { return this.interval.contents; },

    name:                       function()    { return this.interval.contents; },
    nameFirst:                  function(env) {},
    nameRest:                   function(env) {},

    ident:                      function(env) { return env.n; },

    keyword:                    function(env) { return env.value; },
    keyword_undefined:          function()    { return undefined; },
    keyword_null:               function()    { return null; },
    keyword_true:               function()    { return true; },
    keyword_false:              function()    { return false; },

    string:                     function(env) {
                                  return env.cs.map(function(c) { return unescapeChar(c); }).join('');
                                },
    sChar:                      function()    { return this.interval.contents; },
    regExp:                     function(env) { return new RegExp(env.e); },
    reCharClass:                function()    { return this.interval.contents; },
    number:                     function()    { return parseInt(this.interval.contents); },

    Alt:                        function(env) { return env.value; },
    Alt_rec:                    function(env) { return builder.alt(env.x, env.y); },

    Term:                       function(env) { return env.value; },
    Term_inline:                function(env) { return builder.inline(builder.currentRuleName + '_' + env.n, env.x); },

    Seq:                        function(env) { return builder.seq.apply(builder, env.value); },

    Factor:                     function(env) { return env.value; },
    Factor_bind:                function(env) { return builder.bind(env.x, env.n); },

    Iter:                       function(env) { return env.value; },
    Iter_star:                  function(env) { return builder.many(env.x, 0); },
    Iter_plus:                  function(env) { return builder.many(env.x, 1); },
    Iter_opt:                   function(env) { return builder.opt(env.x); },

    Pred:                       function(env) { return env.value; },
    Pred_not:                   function(env) { return builder.not(env.x); },
    Pred_lookahead:             function(env) { return builder.la(env.x); },

    Base:                       function(env) { return env.value; },
    Base_undefined:             function()    { return builder.prim(undefined); },
    Base_null:                  function()    { return builder.prim(null); },
    Base_true:                  function()    { return builder.prim(true); },
    Base_false:                 function()    { return builder.prim(false); },
    Base_application:           function(env) { return builder.app(env.ruleName); },
    Base_prim:                  function(env) { return builder.prim(env.value); },
    Base_lst:                   function(env) { return builder.lst(env.x); },
    Base_str:                   function(env) { return builder.str(env.x); },
    Base_paren:                 function(env) { return env.x; },
    Base_obj:                   function(env) { return builder.obj([], env.lenient); },
    Base_objWithProps:          function(env) { return builder.obj(env.ps, env.lenient); },

    Props:                      function(env) { return env.value; },
    Props_base:                 function(env) { return [env.p]; },
    Props_rec:                  function(env) { return [env.p].concat(env.ps); },
    Prop:                       function(env) { return {name: env.n, pattern: env.p}; },

    Rule:                       function(env) { return env.value; },
    Rule_define:                function(env) {
                                  builder.currentRuleName = env.n;
                                  env.d;  // force evaluation
                                  return builder.define(env.n, env.b);
                                },
    Rule_override:              function(env) {
                                  builder.currentRuleName = env.n;
                                  env.d;  // force evaluation
                                  return builder.override(env.n, env.b);
                                },
    Rule_extend:                function(env) {
                                  builder.currentRuleName = env.n;
                                  env.d;  // force evaluation
                                  return builder.extend(env.n, env.b);
                                },

    SuperGrammar:               function(env) { builder.setSuperGrammar(env.value); },
    SuperGrammar_qualified:     function(env) { return thisModule.namespace(env.ns).getGrammar(env.n); },
    SuperGrammar_unqualified:   function(env) {
                                  if (optNamespace) {
                                    return optNamespace.getGrammar(env.n);
                                  } else {
                                    throw new errors.UndeclaredGrammar(env.n);
                                  }
                                },

    Grammar:                    function(env) {
                                  builder = new Builder();
                                  builder.setName(env.n);
                                  env.s;  // force evaluation
                                  env.rs;  // force evaluation
                                  return builder.build(optNamespace);
                                },
    Grammars:                   function(env) { return env.value; }
  };
}

function compileAndLoad(source, whatItIs, optNamespace) {
  try {
    var thunk = thisModule._ohmGrammar.matchContents(source, whatItIs, true);
    return thunk(makeGrammarActionDict(optNamespace));
  } catch (e) {
    if (e instanceof errors.MatchFailure) {
      console.log('\n' + e.getMessage());
    }
    throw e;
  }
}

function makeGrammar(source, optNamespace) {
  return compileAndLoad(source, 'Grammar', optNamespace);
}

function makeGrammars(source, optNamespace) {
  return compileAndLoad(source, 'Grammars', optNamespace);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about

var namespaces = {};
exports.namespace = function(name) {
  if (namespaces[name] === undefined) {
    namespaces[name] = new Namespace(name);
  }
  return namespaces[name];
};

exports.make = function(recipe) {
  return recipe(thisModule);
};

exports.makeGrammar = makeGrammar;
exports.makeGrammars = makeGrammars;

// Stuff that's only here for bootstrapping, testing, etc.

exports._builder = function() {
  return new Builder();
};

exports._makeGrammarActionDict = makeGrammarActionDict;

var ohmGrammar;
Object.defineProperty(exports, '_ohmGrammar', {
  get: function() {
    if (!ohmGrammar) {
      ohmGrammar = this._ohmGrammarFactory(this);
    }
    return ohmGrammar;
  }
});


},{"../dist/ohm-grammar.js":1,"./Builder.js":7,"./Namespace.js":11,"./errors.js":15,"awlib":2}],17:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.addRulesThatNeedSemanticAction = common.abstract;

pexprs.anything.addRulesThatNeedSemanticAction = function() {
  // no-op
};

pexprs.end.addRulesThatNeedSemanticAction = function() {
  // no-op
};

pexprs.Prim.prototype.addRulesThatNeedSemanticAction = function() {
  // no-op
};

pexprs.Alt.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  var ans = false;
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    ans |= term.addRulesThatNeedSemanticAction(dict, valueRequired);
  }
  return ans;
};

pexprs.Seq.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  var ans = false;
  for (var idx = 0; idx < this.factors.length; idx++) {
    var factor = this.factors[idx];
    ans |= factor.addRulesThatNeedSemanticAction(dict, false);
  }
  return ans;
};

pexprs.Bind.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, true);
};

pexprs.Many.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Opt.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Not.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, false);
};

pexprs.Lookahead.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, valueRequired);
};

pexprs.Str.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, false);
};

pexprs.List.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, false);
};

pexprs.Obj.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  return this.expr.addRulesThatNeedSemanticAction(dict, false);
};

pexprs.Apply.prototype.addRulesThatNeedSemanticAction = function(dict, valueRequired) {
  if (!valueRequired || dict[this.ruleName]) {
    return false;
  } else {
    return dict[this.ruleName] = true;
  }
};


},{"./common.js":13,"./pexprs.js":26}],18:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');
var errors = _dereq_('./errors.js');

var awlib = _dereq_('awlib');
var equals = awlib.equals.equals;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformBindings = common.abstract;

pexprs.anything.assertChoicesHaveUniformBindings = function(ruleName) {
  // no-op
};

pexprs.end.assertChoicesHaveUniformBindings = function(ruleName) {
  // no-op
};

pexprs.Prim.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  if (this.terms.length === 0) {
    return;
  }
  var names = this.terms[0].getBindingNames();
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    term.assertChoicesHaveUniformBindings();
    var otherNames = term.getBindingNames();
    if (!equals(names, otherNames)) {
      throw new errors.InconsistentBindings(ruleName, names, otherNames);
    }
  }
};

pexprs.ExtendAlt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  // Only has two terms, the second of which has the expected bindings.
  var names = this.terms[1].getBindingNames();
  var otherNames = this.terms[0].getBindingNames();
  if (!equals(names, otherNames)) {
    throw new errors.InconsistentBindings(ruleName, names, otherNames);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformBindings(ruleName);
  }
};

pexprs.Bind.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.Many.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.Opt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.Not.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.Str.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.List.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  this.expr.assertChoicesHaveUniformBindings(ruleName);
};

pexprs.Obj.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertChoicesHaveUniformBindings(ruleName);
  }
};

pexprs.Apply.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  // no-op
};


},{"./common.js":13,"./errors.js":15,"./pexprs.js":26,"awlib":2}],19:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');
var errors = _dereq_('./errors.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertNoDuplicateBindings = common.abstract;

pexprs.anything.assertNoDuplicateBindings = function(ruleName) {
  // no-op
};

pexprs.end.assertNoDuplicateBindings = function(ruleName) {
  // no-op
};

pexprs.Prim.prototype.assertNoDuplicateBindings = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertNoDuplicateBindings(ruleName);
  }
};

pexprs.Seq.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertNoDuplicateBindings(ruleName);
  }

  var duplicates = common.getDuplicates(this.getBindingNames());
  if (duplicates.length > 0) {
    throw new errors.DuplicateBindings(ruleName, duplicates);
  }
};

pexprs.Bind.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Many.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Opt.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Not.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Lookahead.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Str.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.List.prototype.assertNoDuplicateBindings = function(ruleName) {
  this.expr.assertNoDuplicateBindings(ruleName);
};

pexprs.Obj.prototype.assertNoDuplicateBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertNoDuplicateBindings(ruleName);
  }

  var duplicates = common.getDuplicates(this.getBindingNames());
  if (duplicates.length > 0) {
    throw new errors.DuplicateBindings(ruleName, duplicates);
  }
};

pexprs.Apply.prototype.assertNoDuplicateBindings = function(ruleName) {
  // no-op
};


},{"./common.js":13,"./errors.js":15,"./pexprs.js":26}],20:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');
var errors = _dereq_('./errors.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

function assertNoBindings(ruleName, expr) {
  var bindings = expr.getBindingNames();
  if (bindings.length > 0) {
    throw new errors.UselessBindings(ruleName, bindings);
  }
}

pexprs.PExpr.prototype.assertNoUselessBindings = common.abstract;

pexprs.anything.assertNoUselessBindings = function(ruleName) {
  // no-op
};

pexprs.end.assertNoUselessBindings = function(ruleName) {
  // no-op
};

pexprs.Prim.prototype.assertNoUselessBindings = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertNoUselessBindings = function(ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertNoUselessBindings(ruleName);
  }
};

pexprs.Seq.prototype.assertNoUselessBindings = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertNoUselessBindings(ruleName);
  }
};

pexprs.Bind.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
};

pexprs.Many.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
  assertNoBindings(ruleName, this.expr);
};

pexprs.Opt.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
  assertNoBindings(ruleName, this.expr);
};

pexprs.Not.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
  assertNoBindings(ruleName, this.expr);
};

pexprs.Lookahead.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
};

pexprs.Str.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
};

pexprs.List.prototype.assertNoUselessBindings = function(ruleName) {
  this.expr.assertNoUselessBindings(ruleName);
};

pexprs.Obj.prototype.assertNoUselessBindings = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertNoUselessBindings(ruleName);
  }
};

pexprs.Apply.prototype.assertNoUselessBindings = function(ruleName) {
  // no-op
};


},{"./common.js":13,"./errors.js":15,"./pexprs.js":26}],21:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var errors = _dereq_('./errors.js');
var thunks = _dereq_('./thunks.js');
var pexprs = _dereq_('./pexprs.js');
var skipSpaces = _dereq_('./skipSpaces.js');
var InputStream = _dereq_('./InputStream.js');

var awlib = _dereq_('awlib');
var browser = awlib.browser;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.eval = common.abstract;

pexprs.anything.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (value === common.fail) {
    if (recordFailures) {
      inputStream.recordFailure(origPos, this);
    }
    return common.fail;
  } else {
    return new thunks.ValueThunk(value);
  }
};

pexprs.end.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  if (inputStream.atEnd()) {
    return thunks.undefinedThunk;
  } else {
    if (recordFailures) {
      inputStream.recordFailure(inputStream.pos, this);
    }
    return common.fail;
  }
};

pexprs.Prim.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var origPos = inputStream.pos;
  if (this.match(inputStream) === common.fail) {
    if (recordFailures) {
      inputStream.recordFailure(origPos, this);
    }
    return common.fail;
  } else {
    return new thunks.ValueThunk(this.obj);
  }
};

pexprs.Prim.prototype.match = function(inputStream) {
  return inputStream.matchExactly(this.obj);
};

pexprs.StringPrim.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj);
};

pexprs.RegExpPrim.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var origPos = inputStream.pos;
  if (inputStream.matchRegExp(this.obj) === common.fail) {
    if (recordFailures) {
      inputStream.recordFailure(origPos, this);
    }
    return common.fail;
  } else {
    return new thunks.ValueThunk(inputStream.source[origPos]);
  }
};

pexprs.Alt.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var origNumBindings = bindings.length;
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (syntactic) {
      skipSpaces(ruleDict, inputStream);
    }
    var value = this.terms[idx].eval(recordFailures, syntactic, ruleDict, inputStream, bindings);
    if (value !== common.fail) {
      return value;
    } else {
      inputStream.pos = origPos;
      // Note: while the following assignment could be done unconditionally, only doing it when necessary is
      // better for performance. This is b/c assigning to an array's length property is more expensive than a
      // typical assignment.
      if (bindings.length > origNumBindings) {
        bindings.length = origNumBindings;
      }
    }
  }
  return common.fail;
};

pexprs.Seq.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (syntactic) {
      skipSpaces(ruleDict, inputStream);
    }
    var factor = this.factors[idx];
    var value = factor.eval(recordFailures, syntactic, ruleDict, inputStream, bindings);
    if (value === common.fail) {
      return common.fail;
    }
  }
  return thunks.undefinedThunk;
};

pexprs.Bind.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var value = this.expr.eval(recordFailures, syntactic, ruleDict, inputStream, bindings);
  if (value !== common.fail) {
    bindings.push(this.name, value);
  }
  return value;
};

pexprs.Many.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var numMatches = 0;
  var matches = this.expr.producesValue() ? [] : undefined;
  while (true) {
    var backtrackPos = inputStream.pos;
    var value = this.expr.eval(recordFailures, syntactic, ruleDict, inputStream, []);
    if (value === common.fail) {
      inputStream.pos = backtrackPos;
      break;
    } else {
      numMatches++;
      if (matches) {
        matches.push(value);
      }
    }
  }
  if (numMatches < this.minNumMatches) {
    return common.fail;
  } else {
    return matches ? new thunks.ListThunk(matches) : thunks.undefinedThunk;
  }
};

pexprs.Opt.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var value = this.expr.eval(recordFailures, syntactic, ruleDict, inputStream, []);
  if (value === common.fail) {
    inputStream.pos = origPos;
    return thunks.undefinedThunk;
  } else {
    return this.expr.producesValue() ? value : thunks.trueThunk;
  }
};

pexprs.Not.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var value = this.expr.eval(false, syntactic, ruleDict, inputStream, []);
  if (value !== common.fail) {
    if (recordFailures) {
      inputStream.recordFailure(origPos, this);
    }
    return common.fail;
  } else {
    inputStream.pos = origPos;
    return thunks.undefinedThunk;
  }
};

pexprs.Lookahead.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var value = this.expr.eval(recordFailures, syntactic, ruleDict, inputStream, []);
  if (value !== common.fail) {
    inputStream.pos = origPos;
  }
  return value;
};

pexprs.Str.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var string = inputStream.next();
  if (typeof string === 'string') {
    var stringInputStream = InputStream.newFor(string);
    var value = this.expr.eval(recordFailures, syntactic, ruleDict, stringInputStream, bindings);
    return value !== common.fail && stringInputStream.atEnd() ?  new thunks.ValueThunk(string) : common.fail;
  } else {
    return common.fail;
  }
};

pexprs.List.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var list = inputStream.next();
  if (list instanceof Array) {
    var listInputStream = InputStream.newFor(list);
    var value = this.expr.eval(recordFailures, syntactic, ruleDict, listInputStream, bindings);
    return value !== common.fail && listInputStream.atEnd() ?  new thunks.ValueThunk(list) : common.fail;
  } else {
    return common.fail;
  }
};

pexprs.Obj.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var obj = inputStream.next();
  if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
    var numOwnPropertiesMatched = 0;
    for (var idx = 0; idx < this.properties.length; idx++) {
      var property = this.properties[idx];
      var value = obj[property.name];
      var valueInputStream = InputStream.newFor([value]);
      var matched =
          property.pattern.eval(recordFailures, syntactic, ruleDict, valueInputStream, bindings) !== common.fail &&
          valueInputStream.atEnd();
      if (!matched) {
        return common.fail;
      }
      if (obj.hasOwnProperty(property.name)) {
        numOwnPropertiesMatched++;
      }
    }
    return this.isLenient || numOwnPropertiesMatched === Object.keys(obj).length ?
        new thunks.ValueThunk(obj) :
        common.fail;
  } else {
    return common.fail;
  }
};

pexprs.Apply.prototype.eval = function(recordFailures, syntactic, ruleDict, inputStream, bindings) {
  var ruleName = this.ruleName;
  var origPosInfo = inputStream.getCurrentPosInfo();
  var memoRec = origPosInfo.memo[ruleName];
  if (memoRec && origPosInfo.shouldUseMemoizedResult(memoRec)) {
    inputStream.pos = memoRec.pos;
    return memoRec.value;
  } else if (origPosInfo.isActive(ruleName)) {
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR && currentLR.name === ruleName) {
      origPosInfo.updateInvolvedRules();
      inputStream.pos = currentLR.pos;
      return currentLR.value;
    } else {
      origPosInfo.startLeftRecursion(ruleName);
      return common.fail;
    }
  } else {
    var body = ruleDict[ruleName];
    if (!body) {
      throw new errors.UndeclaredRule(ruleName);
    }
    var origPos = inputStream.pos;
    origPosInfo.enter(ruleName);
    var rf = recordFailures && !body.description;
    var ruleIsSyntactic = common.isSyntactic(ruleName);
    var value = this.evalOnce(body, rf, ruleIsSyntactic, ruleDict, inputStream);
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR) {
      if (currentLR.name === ruleName) {
        value = this.handleLeftRecursion(body, rf, ruleIsSyntactic, ruleDict, inputStream, origPos, currentLR, value);
        origPosInfo.memo[ruleName] =
          {pos: inputStream.pos, value: value, involvedRules: currentLR.involvedRules};
        origPosInfo.endLeftRecursion(ruleName);
      } else if (!currentLR.involvedRules[ruleName]) {
        // Only memoize if this rule is not involved in the current left recursion
        origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
      }
    } else {
      origPosInfo.memo[ruleName] = {pos: inputStream.pos, value: value};
    }
    origPosInfo.exit(ruleName);
    if (value === common.fail && recordFailures && body.description) {
      var errorPos;
      if (body.description && ruleIsSyntactic) {
        inputStream.pos = origPos;
        skipSpaces(ruleDict, inputStream);
        errorPos = inputStream.pos;
      } else {
        errorPos = origPos;
      }
      inputStream.recordFailure(errorPos, this);
    }
    return value;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, recordFailures, syntactic, ruleDict, inputStream) {
  var origPos = inputStream.pos;
  var bindings = [];
  var value = expr.eval(recordFailures, syntactic, ruleDict, inputStream, bindings);
  if (value === common.fail) {
    return common.fail;
  } else {
    return new thunks.RuleThunk(this.ruleName, inputStream.source, origPos, inputStream.pos, value, bindings);
  }
};

pexprs.Apply.prototype.handleLeftRecursion = function(body, recordFailures, syntactic, ruleDict, inputStream, origPos, currentLR, seedValue) {
  var value = seedValue;
  if (seedValue !== common.fail) {
    currentLR.value = seedValue;
    currentLR.pos = inputStream.pos;
    while (true) {
      inputStream.pos = origPos;
      value = this.evalOnce(body, recordFailures, syntactic, ruleDict, inputStream);
      if (value !== common.fail && inputStream.pos > currentLR.pos) {
        currentLR.value = value;
        currentLR.pos = inputStream.pos;
      } else {
        value = currentLR.value;
        inputStream.pos = currentLR.pos;
        break;
      }
    }
  }
  return value;
};


},{"./InputStream.js":9,"./common.js":13,"./errors.js":15,"./pexprs.js":26,"./skipSpaces.js":27,"./thunks.js":28,"awlib":2}],22:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getBindingNames = function() {
  return [];
};

pexprs.Alt.prototype.getBindingNames = function() {
  // This is ok b/c all terms must have the same bindings -- this property is checked by the Grammar constructor.
  return this.terms.length === 0 ? [] : this.terms[0].getBindingNames();
};

pexprs.Seq.prototype.getBindingNames = function() {
  var names = [];
  for (var idx = 0; idx < this.factors.length; idx++) {
    names = names.concat(this.factors[idx].getBindingNames());
  }
  return names.sort();
};

pexprs.Bind.prototype.getBindingNames = function() {
  return [this.name];
};

pexprs.Lookahead.prototype.getBindingNames = function() {
  return this.expr.getBindingNames();
};

pexprs.Str.prototype.getBindingNames = function() {
  return this.expr.getBindingNames();
};

pexprs.List.prototype.getBindingNames = function() {
  return this.expr.getBindingNames();
};

pexprs.Obj.prototype.getBindingNames = function() {
  var names = [];
  for (var idx = 0; idx < this.properties.length; idx++) {
    names = names.concat(this.properties[idx].pattern.getBindingNames());
  }
  return names.sort();
};


},{"./pexprs.js":26}],23:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');

var awlib = _dereq_('awlib');
var printString = awlib.stringUtils.printString;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract;

pexprs.anything.outputRecipe = function(ws) {
  // no-op
};

pexprs.end.outputRecipe = function(ws) {
  // no-op
};

pexprs.Prim.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.prim(');
  ws.nextPutAll(printString(this.obj));
  ws.nextPutAll(')');
};

pexprs.Alt.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.alt(');
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (idx > 0) {
      ws.nextPutAll(', ');
    }
    this.terms[idx].outputRecipe(ws);
  }
  ws.nextPutAll(')');
};

pexprs.Seq.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.seq(');
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (idx > 0) {
      ws.nextPutAll(', ');
    }
    this.factors[idx].outputRecipe(ws);
  }
  ws.nextPutAll(')');
};

pexprs.Bind.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.bind(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(', ');
  ws.nextPutAll(printString(this.name));
  ws.nextPutAll(')');
};

pexprs.Many.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.many(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(', ');
  ws.nextPutAll(this.minNumMatches);
  ws.nextPutAll(')');
};

pexprs.Opt.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.opt(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(')');
};

pexprs.Not.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.not(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(')');
};

pexprs.Lookahead.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.la(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(')');
};

pexprs.Str.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.str(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(')');
};

pexprs.List.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.lst(');
  this.expr.outputRecipe(ws);
  ws.nextPutAll(')');
};

pexprs.Obj.prototype.outputRecipe = function(ws) {
  function outputPropertyRecipe(prop) {
    ws.nextPutAll('{name: ');
    ws.nextPutAll(printString(prop.name));
    ws.nextPutAll(', pattern: ');
    prop.pattern.outputRecipe(ws);
    ws.nextPutAll('}');
  }

  ws.nextPutAll('b.obj([');
  for (var idx = 0; idx < this.properties.length; idx++) {
    if (idx > 0) {
      ws.nextPutAll(', ');
    }
    outputPropertyRecipe(this.properties[idx]);
  }
  ws.nextPutAll('], ');
  ws.nextPutAll(printString(!!this.isLenient));
  ws.nextPutAll(')');
};

pexprs.Apply.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b.app(');
  ws.nextPutAll(printString(this.ruleName));
  ws.nextPutAll(')');
};


},{"./common.js":13,"./pexprs.js":26,"awlib":2}],24:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.producesValue = function() {
  return true;
};

pexprs.Alt.prototype.producesValue = function() {
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (!this.terms[idx].producesValue()) {
      return false;
    }
  }
  return true;
}

pexprs.Seq.prototype.producesValue = function() {
  return false;
};

pexprs.Many.prototype.producesValue = function() {
  return this.expr.producesValue();
};

pexprs.Not.prototype.producesValue = function() {
  return false;
};


},{"./pexprs.js":26}],25:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');

var awlib = _dereq_('awlib');
var printString = awlib.stringUtils.printString;
var makeStringBuffer = awlib.objectUtils.stringBuffer;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toExpected = function(ruleDict) {
  return undefined;
};

pexprs.anything.toExpected = function(ruleDict) {
  return "any object";
};

pexprs.end.toExpected = function(ruleDict) {
  return "end of input";
};

pexprs.Prim.prototype.toExpected = function(ruleDict) {
  return printString(this.obj);
};

pexprs.Not.prototype.toExpected = function(ruleDict) {
  return "no " + this.expr.toExpected();
};

// TODO: think about Str, List, and Obj

pexprs.Apply.prototype.toExpected = function(ruleDict) {
  var description = ruleDict[this.ruleName].description;
  if (description) {
    return description;
  } else {
    var article = /^[aeiouAEIOU]/.test(this.ruleName) ? "an" : "a";
    return article + " " + this.ruleName;
  }
};


},{"./common.js":13,"./pexprs.js":26,"awlib":2}],26:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var errors = _dereq_('./errors.js');

var awlib = _dereq_('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

function PExpr() {
  throw 'PExpr cannot be instantiated -- it\'s abstract';
}

// Anything

var anything = objectThatDelegatesTo(PExpr.prototype);

// End

var end = objectThatDelegatesTo(PExpr.prototype);

// Primitives

function Prim(obj) {
  this.obj = obj;
}

Prim.prototype = objectThatDelegatesTo(PExpr.prototype);

function StringPrim(obj) {
  this.obj = obj;
}

StringPrim.prototype = objectThatDelegatesTo(Prim.prototype);

function RegExpPrim(obj) {
  this.obj = obj;
}

RegExpPrim.prototype = objectThatDelegatesTo(Prim.prototype);

// Alternation

function Alt(terms) {
  this.terms = terms;
}

Alt.prototype = objectThatDelegatesTo(PExpr.prototype);

// ExtendAlt is an implementation detail of rule extension

function ExtendAlt(extensions, base) {
  this.terms = [extensions, base];
}

ExtendAlt.prototype = objectThatDelegatesTo(Alt.prototype);

// Sequences

function Seq(factors) {
  this.factors = factors;
}

Seq.prototype = objectThatDelegatesTo(PExpr.prototype);

// Bindings

function Bind(expr, name) {
  this.expr = expr;
  this.name = name;
}

Bind.prototype = objectThatDelegatesTo(PExpr.prototype);

// Iterators and optionals

function Many(expr, minNumMatches) {
  this.expr = expr;
  this.minNumMatches = minNumMatches;
}

Many.prototype = objectThatDelegatesTo(PExpr.prototype);

function Opt(expr) {
  this.expr = expr;
}

Opt.prototype = objectThatDelegatesTo(PExpr.prototype);

// Predicates

function Not(expr) {
  this.expr = expr;
}

Not.prototype = objectThatDelegatesTo(PExpr.prototype);

function Lookahead(expr) {
  this.expr = expr;
}

Lookahead.prototype = objectThatDelegatesTo(PExpr.prototype);

// String decomposition

function Str(expr) {
  this.expr = expr;
}

Str.prototype = objectThatDelegatesTo(PExpr.prototype);

// List decomposition

function List(expr) {
  this.expr = expr;
}

List.prototype = objectThatDelegatesTo(PExpr.prototype);

// Object decomposition

function Obj(properties, isLenient) {
  var names = properties.map(function(property) { return property.name; });
  var duplicates = common.getDuplicates(names);
  if (duplicates.length > 0) {
    throw new errors.DuplicatePropertyNames(duplicates);
  } else {
    this.properties = properties;
    this.isLenient = isLenient;
  }
}

Obj.prototype = objectThatDelegatesTo(PExpr.prototype);

// Rule application

function Apply(ruleName) {
  this.ruleName = ruleName;
}

Apply.prototype = objectThatDelegatesTo(PExpr.prototype);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.makePrim = function(obj) {
  if (typeof obj === 'string' && obj.length !== 1) {
    return new StringPrim(obj);
  }
  else if (obj instanceof RegExp) {
    return new RegExpPrim(obj);
  } else {
    return new Prim(obj);
  }
};

exports.PExpr = PExpr;
exports.anything = anything;
exports.end = end;
exports.Prim = Prim;
exports.StringPrim = StringPrim;
exports.RegExpPrim = RegExpPrim;
exports.Alt = Alt;
exports.ExtendAlt = ExtendAlt;
exports.Seq = Seq;
exports.Bind = Bind;
exports.Many = Many;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Str = Str;
exports.List = List;
exports.Obj = Obj;
exports.Apply = Apply;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

_dereq_('./pexprs-addRulesThatNeedSemanticAction.js');
_dereq_('./pexprs-assertNoDuplicateBindings.js');
_dereq_('./pexprs-assertNoUselessBindings.js');
_dereq_('./pexprs-assertChoicesHaveUniformBindings.js');
_dereq_('./pexprs-getBindingNames.js');
_dereq_('./pexprs-eval.js');
_dereq_('./pexprs-outputRecipe.js');
_dereq_('./pexprs-producesValue.js');
_dereq_('./pexprs-toExpected.js');


},{"./common.js":13,"./errors.js":15,"./pexprs-addRulesThatNeedSemanticAction.js":17,"./pexprs-assertChoicesHaveUniformBindings.js":18,"./pexprs-assertNoDuplicateBindings.js":19,"./pexprs-assertNoUselessBindings.js":20,"./pexprs-eval.js":21,"./pexprs-getBindingNames.js":22,"./pexprs-outputRecipe.js":23,"./pexprs-producesValue.js":24,"./pexprs-toExpected.js":25,"awlib":2}],27:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function skipSpaces(ruleDict, inputStream) {
  while (true) {
    var origPos = inputStream.pos;
    if (ruleDict.space.eval(false, false, ruleDict, inputStream, []) === common.fail) {
      inputStream.pos = origPos;
      break;
    }
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = skipSpaces;


},{"./common.js":13,"./pexprs.js":26}],28:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = _dereq_('./Interval.js');

var awlib = _dereq_('awlib');
var browser = awlib.browser
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Thunk() {
  throw 'Thunk cannot be instantiated -- it\'s abstract';
}

var nextThunkId = 0;
Thunk.prototype = {
  init: function() {
    this.id = nextThunkId++;
  }
};

function RuleThunk(ruleName, source, startIdx, endIdx, value, bindings) {
  this.init();
  this.ruleName = ruleName;
  this.source = source;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
  this.value = value;
  this.bindings = bindings;
}

RuleThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    if (!memo.hasOwnProperty(this.id)) {
      var action = this.lookupAction(actionDict);
      var addlInfo = this.createAddlInfo();
      var env = this.makeEnv(actionDict, memo);
      memo[this.id] = action.call(addlInfo, env);
    }
    return memo[this.id];
  },

  lookupAction: function(actionDict) {
    var ruleName = this.ruleName;
    var action = actionDict[ruleName];
    if (action === undefined && actionDict._default !== undefined) {
      action = function(env) {
        return actionDict._default.call(this, ruleName, env);
      };
    }
    return action || browser.error('missing semantic action for', ruleName);
  },

  createAddlInfo: function() {
    return {
      interval: new Interval(this.source, this.startIdx, this.endIdx)
    };
  },

  makeEnv: function(actionDict, memo) {
    var bindings = this.bindings.length === 0 ? ['value', this.value] : this.bindings;
    var env = {};
    for (var idx = 0; idx < bindings.length; idx += 2) {
      var name = bindings[idx];
      var thunk = bindings[idx + 1];
      this.addBinding(env, name, thunk, actionDict, memo);
    }
    return env;
  },

  addBinding: function(env, name, value, actionDict, memo) {
    Object.defineProperty(env, name, {
      get: function() {
        if (value instanceof Thunk) {
          value = value.force(actionDict, memo);
        }
        return value;
      },
      enumerable: true
    });
  }
});

function ListThunk(thunks) {
  this.init();
  this.thunks = thunks;
}

ListThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    if (!memo.hasOwnProperty(this.id)) {
      memo[this.id] = this.thunks.map(function(thunk) { return thunk.force(actionDict, memo); });
    }
    return memo[this.id];
  }
});

function ValueThunk(value) {
  this.value = value;
}

ValueThunk.prototype = objectThatDelegatesTo(Thunk.prototype, {
  force: function(actionDict, memo) {
    return this.value;
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.RuleThunk = RuleThunk;
exports.ListThunk = ListThunk;
exports.ValueThunk = ValueThunk;
exports.undefinedThunk = new ValueThunk(undefined);
exports.trueThunk = new ValueThunk(true);


},{"./Interval.js":10,"awlib":2}]},{},[16])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9kaXN0L29obS1ncmFtbWFyLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL2F3bGliLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL2Jyb3dzZXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvZXF1YWxzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL29iamVjdFV0aWxzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL3N0cmluZ1V0aWxzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvQnVpbGRlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL0dyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9JbnB1dFN0cmVhbS5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL0ludGVydmFsLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvTmFtZXNwYWNlLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvUG9zSW5mby5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL2NvbW1vbi5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL2RlY2xzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvZXJyb3JzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24uanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1hc3NlcnROb1VzZWxlc3NCaW5kaW5ncy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1ldmFsLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWdldEJpbmRpbmdOYW1lcy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtcHJvZHVjZXNWYWx1ZS5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy10b0V4cGVjdGVkLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvc2tpcFNwYWNlcy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3RodW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4vc3JjL21haW4uanMnKTtcbm9obS5fb2htR3JhbW1hckZhY3RvcnkgPVxuKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBiID0gb2htLl9idWlsZGVyKCk7XG4gIGIuc2V0TmFtZSgnT2htJyk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdHcmFtbWFycycsIGIubWFueShiLmFwcCgnR3JhbW1hcicpLCAwKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdHcmFtbWFyJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdpZGVudCcpLCAnbicpLCBiLmJpbmQoYi5vcHQoYi5hcHAoJ1N1cGVyR3JhbW1hcicpKSwgJ3MnKSwgYi5wcmltKCd7JyksIGIuYmluZChiLm1hbnkoYi5hcHAoJ1J1bGUnKSwgMCksICdycycpLCBiLnByaW0oJ30nKSkpO1xuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyX3F1YWxpZmllZCcsIGIuc2VxKGIucHJpbSgnPDonKSwgYi5iaW5kKGIuYXBwKCdpZGVudCcpLCAnbnMnKSwgYi5wcmltKCcuJyksIGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ24nKSkpO1xuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyX3VucXVhbGlmaWVkJywgYi5zZXEoYi5wcmltKCc8OicpLCBiLmJpbmQoYi5hcHAoJ2lkZW50JyksICduJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ1N1cGVyR3JhbW1hcicsIGIuYWx0KGIuYXBwKCdTdXBlckdyYW1tYXJfcXVhbGlmaWVkJyksIGIuYXBwKCdTdXBlckdyYW1tYXJfdW5xdWFsaWZpZWQnKSkpO1xuICBiLmlubGluZSgnUnVsZV9kZWZpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ2lkZW50JyksICduJyksIGIuYmluZChiLm9wdChiLmFwcCgncnVsZURlc2NyJykpLCAnZCcpLCBiLnByaW0oJz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpO1xuICBiLmlubGluZSgnUnVsZV9vdmVycmlkZScsIGIuc2VxKGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ24nKSwgYi5wcmltKCc6PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSk7XG4gIGIuaW5saW5lKCdSdWxlX2V4dGVuZCcsIGIuc2VxKGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ24nKSwgYi5wcmltKCcrPScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdSdWxlJywgYi5hbHQoYi5hcHAoJ1J1bGVfZGVmaW5lJyksIGIuYXBwKCdSdWxlX292ZXJyaWRlJyksIGIuYXBwKCdSdWxlX2V4dGVuZCcpKSk7XG4gIGIuaW5saW5lKCdBbHRfcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdUZXJtJyksICd4JyksIGIucHJpbSgnfCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneScpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdBbHQnLCBiLmFsdChiLmFwcCgnQWx0X3JlYycpLCBiLmFwcCgnVGVybScpKSk7XG4gIGIuaW5saW5lKCdUZXJtX2lubGluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnU2VxJyksICd4JyksIGIucHJpbSgneycpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSwgYi5wcmltKCd9JykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ1Rlcm0nLCBiLmFsdChiLmFwcCgnVGVybV9pbmxpbmUnKSwgYi5hcHAoJ1NlcScpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdTZXEnLCBiLm1hbnkoYi5hcHAoJ0ZhY3RvcicpLCAwKSk7XG4gIGIuaW5saW5lKCdGYWN0b3JfYmluZCcsIGIuc2VxKGIuYmluZChiLmFwcCgnSXRlcicpLCAneCcpLCBiLnByaW0oJzonKSwgYi5iaW5kKGIuYXBwKCdpZGVudCcpLCAnbicpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdGYWN0b3InLCBiLmFsdChiLmFwcCgnRmFjdG9yX2JpbmQnKSwgYi5hcHAoJ0l0ZXInKSkpO1xuICBiLmlubGluZSgnSXRlcl9zdGFyJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIucHJpbSgnKicpKSk7XG4gIGIuaW5saW5lKCdJdGVyX3BsdXMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5wcmltKCcrJykpKTtcbiAgYi5pbmxpbmUoJ0l0ZXJfb3B0JywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIucHJpbSgnPycpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdJdGVyJywgYi5hbHQoYi5hcHAoJ0l0ZXJfc3RhcicpLCBiLmFwcCgnSXRlcl9wbHVzJyksIGIuYXBwKCdJdGVyX29wdCcpLCBiLmFwcCgnUHJlZCcpKSk7XG4gIGIuaW5saW5lKCdQcmVkX25vdCcsIGIuc2VxKGIucHJpbSgnficpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpO1xuICBiLmlubGluZSgnUHJlZF9sb29rYWhlYWQnLCBiLnNlcShiLnByaW0oJyYnKSwgYi5iaW5kKGIuYXBwKCdCYXNlJyksICd4JykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ1ByZWQnLCBiLmFsdChiLmFwcCgnUHJlZF9ub3QnKSwgYi5hcHAoJ1ByZWRfbG9va2FoZWFkJyksIGIuYXBwKCdCYXNlJykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2VfYXBwbGljYXRpb24nLCBiLnNlcShiLmJpbmQoYi5hcHAoJ2lkZW50JyksICdydWxlTmFtZScpLCBiLm5vdChiLmFsdChiLnNlcShiLm9wdChiLmFwcCgncnVsZURlc2NyJykpLCBiLnByaW0oJz0nKSksIGIucHJpbSgnOj0nKSwgYi5wcmltKCcrPScpKSkpKTtcbiAgYi5pbmxpbmUoJ0Jhc2VfcHJpbScsIGIuYWx0KGIuYXBwKCdrZXl3b3JkJyksIGIuYXBwKCdzdHJpbmcnKSwgYi5hcHAoJ3JlZ0V4cCcpLCBiLmFwcCgnbnVtYmVyJykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2VfbHN0JywgYi5zZXEoYi5wcmltKCdbJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIucHJpbSgnXScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX3N0cicsIGIuc2VxKGIucHJpbSgnXCInKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5wcmltKCdcIicpKSk7XG4gIGIuaW5saW5lKCdCYXNlX3BhcmVuJywgYi5zZXEoYi5wcmltKCcoJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIucHJpbSgnKScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX29iaicsIGIuc2VxKGIucHJpbSgneycpLCBiLmJpbmQoYi5vcHQoYi5wcmltKCcuLi4nKSksICdsZW5pZW50JyksIGIucHJpbSgnfScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX29ialdpdGhQcm9wcycsIGIuc2VxKGIucHJpbSgneycpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpLCBiLmJpbmQoYi5vcHQoYi5zZXEoYi5wcmltKCcsJyksIGIucHJpbSgnLi4uJykpKSwgJ2xlbmllbnQnKSwgYi5wcmltKCd9JykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ0Jhc2UnLCBiLmFsdChiLmFwcCgnQmFzZV9hcHBsaWNhdGlvbicpLCBiLmFwcCgnQmFzZV9wcmltJyksIGIuYXBwKCdCYXNlX2xzdCcpLCBiLmFwcCgnQmFzZV9zdHInKSwgYi5hcHAoJ0Jhc2VfcGFyZW4nKSwgYi5hcHAoJ0Jhc2Vfb2JqJyksIGIuYXBwKCdCYXNlX29ialdpdGhQcm9wcycpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdQcm9wJywgYi5zZXEoYi5iaW5kKGIuYWx0KGIuYXBwKCduYW1lJyksIGIuYXBwKCdzdHJpbmcnKSksICduJyksIGIucHJpbSgnOicpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3AnKSkpO1xuICBiLmlubGluZSgnUHJvcHNfcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcm9wJyksICdwJyksIGIucHJpbSgnLCcpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpKSk7XG4gIGIuaW5saW5lKCdQcm9wc19iYXNlJywgYi5iaW5kKGIuYXBwKCdQcm9wJyksICdwJykpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgnUHJvcHMnLCBiLmFsdChiLmFwcCgnUHJvcHNfcmVjJyksIGIuYXBwKCdQcm9wc19iYXNlJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24oJyBydWxlIGRlc2NyaXB0aW9uIGZvciB1c2UgaW4gZXJyb3IgbWVzc2FnZXMnKTsgYi5kZWZpbmUoJ3J1bGVEZXNjcicsIGIuc2VxKGIucHJpbSgnLS0nKSwgYi5iaW5kKGIuYXBwKCdydWxlRGVzY3JUZXh0JyksICd0JyksIGIucHJpbSgnXFxuJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ3J1bGVEZXNjclRleHQnLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5wcmltKCdcXG4nKSksIGIuYXBwKCdfJykpLCAwKSk7XG4gIGIuaW5saW5lKCdzcGFjZV9zaW5nbGVMaW5lJywgYi5zZXEoYi5wcmltKCcvLycpLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5wcmltKCdcXG4nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5wcmltKCdcXG4nKSkpO1xuICBiLmlubGluZSgnc3BhY2VfbXVsdGlMaW5lJywgYi5zZXEoYi5wcmltKCcvKicpLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5wcmltKCcqLycpKSwgYi5hcHAoJ18nKSksIDApLCBiLnByaW0oJyovJykpKTtcbiAgYi5leHRlbmQoJ3NwYWNlJywgYi5hbHQoYi5hcHAoJ3NwYWNlX3NpbmdsZUxpbmUnKSwgYi5hcHAoJ3NwYWNlX211bHRpTGluZScpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKCcgbmFtZScpOyBiLmRlZmluZSgnbmFtZScsIGIuc2VxKGIuYXBwKCduYW1lRmlyc3QnKSwgYi5tYW55KGIuYXBwKCduYW1lUmVzdCcpLCAwKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgnbmFtZUZpcnN0JywgYi5hbHQoYi5wcmltKCdfJyksIGIuYXBwKCdsZXR0ZXInKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgnbmFtZVJlc3QnLCBiLmFsdChiLnByaW0oJ18nKSwgYi5hcHAoJ2FsbnVtJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24oJyBpZGVudGlmaWVyJyk7IGIuZGVmaW5lKCdpZGVudCcsIGIuc2VxKGIubm90KGIuYXBwKCdrZXl3b3JkJykpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpO1xuICBiLmlubGluZSgna2V5d29yZF91bmRlZmluZWQnLCBiLnNlcShiLnByaW0oJ3VuZGVmaW5lZCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5pbmxpbmUoJ2tleXdvcmRfbnVsbCcsIGIuc2VxKGIucHJpbSgnbnVsbCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5pbmxpbmUoJ2tleXdvcmRfdHJ1ZScsIGIuc2VxKGIucHJpbSgndHJ1ZScpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5pbmxpbmUoJ2tleXdvcmRfZmFsc2UnLCBiLnNlcShiLnByaW0oJ2ZhbHNlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgna2V5d29yZCcsIGIuYWx0KGIuYXBwKCdrZXl3b3JkX3VuZGVmaW5lZCcpLCBiLmFwcCgna2V5d29yZF9udWxsJyksIGIuYXBwKCdrZXl3b3JkX3RydWUnKSwgYi5hcHAoJ2tleXdvcmRfZmFsc2UnKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbignIHN0cmluZyBsaXRlcmFsJyk7IGIuZGVmaW5lKCdzdHJpbmcnLCBiLnNlcShiLnByaW0oXCInXCIpLCBiLmJpbmQoYi5tYW55KGIuYXBwKCdzQ2hhcicpLCAwKSwgJ2NzJyksIGIucHJpbShcIidcIikpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ3NDaGFyJywgYi5hbHQoYi5zZXEoYi5wcmltKCdcXFxceCcpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JykpLCBiLnNlcShiLnByaW0oJ1xcXFx1JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5wcmltKCdcXFxcJyksIGIuYXBwKCdfJykpLCBiLnNlcShiLm5vdChiLnByaW0oXCInXCIpKSwgYi5ub3QoYi5wcmltKCdcXG4nKSksIGIuYXBwKCdfJykpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKCcgcmVndWxhciBleHByZXNzaW9uJyk7IGIuZGVmaW5lKCdyZWdFeHAnLCBiLnNlcShiLnByaW0oJy8nKSwgYi5iaW5kKGIuYXBwKCdyZUNoYXJDbGFzcycpLCAnZScpLCBiLnByaW0oJy8nKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgncmVDaGFyQ2xhc3MnLCBiLnNlcShiLnByaW0oJ1snKSwgYi5tYW55KGIuYWx0KGIucHJpbSgnXFxcXF0nKSwgYi5zZXEoYi5ub3QoYi5wcmltKCddJykpLCBiLmFwcCgnXycpKSksIDApLCBiLnByaW0oJ10nKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbignIG51bWJlcicpOyBiLmRlZmluZSgnbnVtYmVyJywgYi5zZXEoYi5vcHQoYi5wcmltKCctJykpLCBiLm1hbnkoYi5hcHAoJ2RpZ2l0JyksIDEpKSk7XG4gIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSk7XG59KTtcbiIsImV4cG9ydHMub2JqZWN0VXRpbHMgPSByZXF1aXJlKCcuL29iamVjdFV0aWxzLmpzJylcbmV4cG9ydHMuc3RyaW5nVXRpbHMgPSByZXF1aXJlKCcuL3N0cmluZ1V0aWxzLmpzJylcbmV4cG9ydHMuZXF1YWxzID0gcmVxdWlyZSgnLi9lcXVhbHMuanMnKVxuZXhwb3J0cy5icm93c2VyID0gcmVxdWlyZSgnLi9icm93c2VyLmpzJylcbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTG9nZ2luZ1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHN1YnNjcmliZWQgPSB7fVxuXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKHN1YmplY3QgLyogLCAuLi4gKi8pIHtcbiAgaWYgKCFzdWJzY3JpYmVkW3N1YmplY3RdKVxuICAgIHJldHVyblxuICBhcmd1bWVudHNbMF0gPSAnWycgKyBzdWJqZWN0ICsgJ10nXG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbn1cblxuZXhwb3J0cy5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIHN1YnNjcmliZWRbc3ViamVjdF0gPSB0cnVlXG59XG5cbmV4cG9ydHMudW5zdWJzY3JpYmUgPSBmdW5jdGlvbihzdWJqZWN0KSB7XG4gIGRlbGV0ZSBzaG93aW5nW3N1YmplY3RdXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBc3NlcnRzLCBlcnJvcnMsIGV0Yy5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuZXJyb3IgPSBmdW5jdGlvbigvKiBhcmcxLCBhcmcyLCAuLi4gKi8pIHtcbiAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpXG4gIGNvbnNvbGUuZXJyb3IuYXBwbHkoY29uc29sZSwgYXJncylcbiAgdGhyb3cgJ2Vycm9yOiAnICsgYXJncy5qb2luKCcgJylcbn1cblxuZXhwb3J0cy5zYW5pdHlDaGVjayA9IGZ1bmN0aW9uKG5hbWUsIGNvbmRpdGlvbikge1xuICBpZiAoIWNvbmRpdGlvbilcbiAgICB0aGlzTW9kdWxlLmVycm9yKCdmYWlsZWQgc2FuaXR5IGNoZWNrOicsIG5hbWUpXG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBET00gdXRpbHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMucHJldHR5UHJpbnROb2RlID0gZnVuY3Rpb24obm9kZSwgZW5kTm9kZSwgZW5kT2Zmc2V0KSB7XG4gIGlmIChub2RlIGluc3RhbmNlb2YgVGV4dCkge1xuICAgIGlmIChub2RlID09PSBlbmROb2RlKVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEuc3Vic3RyKDAsIGVuZE9mZnNldCkgKyAnfCcgKyBub2RlLmRhdGEuc3Vic3RyKGVuZE9mZnNldCkgKyAnfSdcbiAgICBlbHNlXG4gICAgICByZXR1cm4gJ3RleHR7JyArIG5vZGUuZGF0YSArICd9J1xuICB9XG5cbiAgdmFyIHBhcnRzID0gW25vZGUudGFnTmFtZSwgJ3snXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBub2RlLmNoaWxkTm9kZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBpZHgpXG4gICAgICBwYXJ0cy5wdXNoKCd8JylcbiAgICBwYXJ0cy5wdXNoKHRoaXNNb2R1bGUucHJldHR5UHJpbnROb2RlKG5vZGUuY2hpbGROb2Rlcy5pdGVtKGlkeCksIGVuZE5vZGUsIGVuZE9mZnNldCkpXG4gIH1cbiAgaWYgKG5vZGUgPT09IGVuZE5vZGUgJiYgZW5kT2Zmc2V0ID09IG5vZGUuY2hpbGROb2Rlcy5sZW5ndGgpXG4gICAgcGFydHMucHVzaCgnfCcpXG4gIHBhcnRzLnB1c2goJ30nKVxuICByZXR1cm4gcGFydHMuam9pbignJylcbn1cblxuIiwiLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBkb3VibGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PSB5XG59XG5cbmZ1bmN0aW9uIHRyaXBsZUVxdWFscyh4LCB5KSB7XG4gIHJldHVybiB4ID09PSB5XG59XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKHgpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgeFxuICByZXR1cm4gdHlwZSAhPT0gJ29iamVjdCdcbn1cblxuZnVuY3Rpb24gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pIHtcbiAgaWYgKGlzUHJpbWl0aXZlKHgpKVxuICAgIHJldHVybiBlcUZuKHgsIHkpXG4gIGZvciAodmFyIHAgaW4geClcbiAgICBpZiAoZGVlcCAmJiAhZXF1YWxzKHhbcF0sIHlbcF0sIGRlZXAsIGVxRm4pIHx8XG4gICAgICAgICFkZWVwICYmICFlcUZuKHhbcF0sIHlbcF0pKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIHAgaW4geSlcbiAgICBpZiAoeVtwXSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHhbcF0gPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCBkZWVwLCBlcUZuKSB7XG4gIGlmICghYXJyMSBpbnN0YW5jZW9mIEFycmF5IHx8ICFhcnIyIGluc3RhbmNlb2YgQXJyYXkgfHxcbiAgICAgIGFycjEubGVuZ3RoICE9PSBhcnIyLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2VcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyMS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnIxW2lkeF1cbiAgICB2YXIgZm91bmRYID0gYXJyMi5zb21lKGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiBlcXVhbHMoeCwgeSwgZGVlcCwgZXFGbilcbiAgICB9KVxuICAgIGlmICghZm91bmRYKVxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuLy8gUHVibGljIG1ldGhvZHNcblxuZXhwb3J0cy5lcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgZmFsc2UsIGRvdWJsZUVxdWFscylcbn1cblxuZXhwb3J0cy5kZWVwRXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIHRydWUsIGRvdWJsZUVxdWFscylcbn1cblxuZXhwb3J0cy5zdHJpY3RFcXVhbHMgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHJldHVybiBlcXVhbHMoeCwgeSwgZmFsc2UsIHRyaXBsZUVxdWFscylcbn1cblxuZXhwb3J0cy5zdHJpY3REZWVwRXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIHRydWUsIHRyaXBsZUVxdWFscylcbn1cblxuZXhwb3J0cy5oYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlciA9IGZ1bmN0aW9uKGFycjEsIGFycjIpIHtcbiAgcmV0dXJuIGhhdmVTYW1lQ29udGVudHNJbkFueU9yZGVyKGFycjEsIGFycjIsIHRydWUsIGRvdWJsZUVxdWFscylcbn1cblxuIiwidmFyIHRoaXNNb2R1bGUgPSBleHBvcnRzXG5cbmV4cG9ydHMub2JqZWN0VGhhdERlbGVnYXRlc1RvID0gZnVuY3Rpb24ob2JqLCBvcHRQcm9wZXJ0aWVzKSB7XG4gIGZ1bmN0aW9uIGNvbnMoKSB7fVxuICBjb25zLnByb3RvdHlwZSA9IG9ialxuICB2YXIgYW5zID0gbmV3IGNvbnMoKVxuICBpZiAob3B0UHJvcGVydGllcylcbiAgICB0aGlzTW9kdWxlLmtleXNBbmRWYWx1ZXNEbyhvcHRQcm9wZXJ0aWVzLCBmdW5jdGlvbihrLCB2KSB7XG4gICAgICBhbnNba10gPSB2XG4gICAgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5leHBvcnRzLmZvcm1hbHMgPSBmdW5jdGlvbihmdW5jKSB7XG4gIHJldHVybiBmdW5jLlxuICAgIHRvU3RyaW5nKCkuXG4gICAgbWF0Y2goL1xcKCguKj8pXFwpLylbMF0uXG4gICAgcmVwbGFjZSgvIC9nLCAnJykuXG4gICAgc2xpY2UoMSwgLTEpLlxuICAgIHNwbGl0KCcsJykuXG4gICAgZmlsdGVyKGZ1bmN0aW9uKG1vZHVsZU5hbWUpIHsgcmV0dXJuIG1vZHVsZU5hbWUgIT0gJycgfSlcbn1cblxuZXhwb3J0cy5rZXlzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIGZvciAodmFyIHAgaW4gb2JqZWN0KVxuICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkocCkpXG4gICAgICBmbihwKVxufVxuXG5leHBvcnRzLnZhbHVlc0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICB0aGlzTW9kdWxlLmtleXNEbyhvYmplY3QsIGZ1bmN0aW9uKHApIHsgZm4ob2JqZWN0W3BdKSB9KVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKHAsIG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYua2V5c0RvKG9iamVjdCwgZm4pIH1cbn1cblxuZXhwb3J0cy52YWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi52YWx1ZXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMua2V5c0FuZFZhbHVlc0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNBbmRWYWx1ZXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHZhciBhbnMgPSBbXVxuICB0aGlzTW9kdWxlLmtleXNEbyhvYmplY3QsIGZ1bmN0aW9uKHApIHsgYW5zLnB1c2gob2JqZWN0W3BdKSB9KVxuICByZXR1cm4gYW5zXG59XG5cbmZ1bmN0aW9uIFN0cmluZ0J1ZmZlcigpIHtcbiAgdGhpcy5zdHJpbmdzID0gW11cbiAgdGhpcy5sZW5ndGhTb0ZhciA9IDBcbn1cblxuU3RyaW5nQnVmZmVyLnByb3RvdHlwZSA9IHtcbiAgbmV4dFB1dEFsbDogZnVuY3Rpb24ocykge1xuICAgIHRoaXMuc3RyaW5ncy5wdXNoKHMpXG4gICAgdGhpcy5sZW5ndGhTb0ZhciArPSBzLmxlbmd0aFxuICB9LFxuXG4gIGNvbnRlbnRzOiBmdW5jdGlvbigpICB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKVxuICB9XG59XG5cbmV4cG9ydHMuc3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgU3RyaW5nQnVmZmVyKClcbn1cblxuZnVuY3Rpb24gQ29sdW1uU3RyaW5nQnVmZmVyKCkge1xuICB0aGlzLmxpbmVzID0gW11cbiAgdGhpcy5uZXdMaW5lKClcbn1cblxuQ29sdW1uU3RyaW5nQnVmZmVyLnByb3RvdHlwZSA9IHtcbiAgbmV4dFB1dEFsbDogZnVuY3Rpb24ocykge1xuICAgIHRoaXMuY3VycmVudENvbHVtbigpLnB1c2gocylcbiAgfSxcblxuICBjb250ZW50czogZnVuY3Rpb24oKSB7XG4gICAgLy8gQ29udmVydCBjb2x1bW5zIGZyb20gbGlzdHMgb2Ygc3RyaW5ncyB0byBzdHJpbmdzLCBhbmQgcmVjb3JkIGNvbHVtbiBsZW5ndGhzXG4gICAgdmFyIGNvbHVtbkxlbmd0aHMgPSBbXVxuICAgIHRoaXMubGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBsaW5lLmxlbmd0aDsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbHVtbiA9IGxpbmVbY29sSWR4XVxuICAgICAgICBsaW5lW2NvbElkeF0gPSBjb2x1bW4uam9pbignJylcbiAgICAgICAgaWYgKGNvbHVtbkxlbmd0aHNbY29sSWR4XSA9PT0gdW5kZWZpbmVkIHx8IGNvbHVtbkxlbmd0aHNbY29sSWR4XSA8IGxpbmVbY29sSWR4XS5sZW5ndGgpXG4gICAgICAgICAgY29sdW1uTGVuZ3Roc1tjb2xJZHhdID0gbGluZVtjb2xJZHhdLmxlbmd0aFxuICAgICAgfVxuICAgIH0pXG5cbiAgICB2YXIgc2IgPSB0aGlzTW9kdWxlLnN0cmluZ0J1ZmZlcigpXG4gICAgdGhpcy5saW5lcy5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgIGZvciAodmFyIGNvbElkeCA9IDA7IGNvbElkeCA8IGxpbmUubGVuZ3RoOyBjb2xJZHgrKykge1xuICAgICAgICB2YXIgY29sdW1uID0gbGluZVtjb2xJZHhdXG4gICAgICAgIHNiLm5leHRQdXRBbGwoY29sdW1uKVxuICAgICAgICB2YXIgbnVtU3BhY2VzID0gY29sdW1uTGVuZ3Roc1tjb2xJZHhdIC0gY29sdW1uLmxlbmd0aFxuICAgICAgICB3aGlsZSAobnVtU3BhY2VzLS0gPiAwKVxuICAgICAgICAgIHNiLm5leHRQdXRBbGwoJyAnKVxuICAgICAgfVxuICAgICAgc2IubmV4dFB1dEFsbCgnXFxuJylcbiAgICB9KVxuICAgIHJldHVybiBzYi5jb250ZW50cygpXG4gIH0sXG5cbiAgbmV3TGluZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5saW5lcy5wdXNoKFtdKVxuICAgIHRoaXMubmV3Q29sdW1uKClcbiAgfSxcblxuICBuZXdDb2x1bW46IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3VycmVudExpbmUoKS5wdXNoKFtdKVxuICB9LFxuXG4gIGN1cnJlbnRDb2x1bW46IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsaW5lID0gdGhpcy5jdXJyZW50TGluZSgpXG4gICAgcmV0dXJuIGxpbmVbbGluZS5sZW5ndGggLSAxXVxuICB9LFxuXG4gIGN1cnJlbnRMaW5lOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5saW5lc1t0aGlzLmxpbmVzLmxlbmd0aCAtIDFdXG4gIH1cbn1cblxuZXhwb3J0cy5jb2x1bW5TdHJpbmdCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBDb2x1bW5TdHJpbmdCdWZmZXIoKVxufVxuXG4iLCJ2YXIgb2JqZWN0VXRpbHMgPSByZXF1aXJlKCcuL29iamVjdFV0aWxzLmpzJylcbnZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG4vLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIHBhZChudW1iZXJBc1N0cmluZywgbGVuKSB7XG4gIHZhciB6ZXJvcyA9IFtdXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IG51bWJlckFzU3RyaW5nLmxlbmd0aCAtIGxlbjsgaWR4KyspXG4gICAgemVyb3MucHVzaCgnMCcpXG4gIHJldHVybiB6ZXJvcy5qb2luKCcnKSArIG51bWJlckFzU3RyaW5nXG59XG5cbnZhciBlc2NhcGVTdHJpbmdGb3IgPSB7fVxuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKylcbiAgZXNjYXBlU3RyaW5nRm9yW2NdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjKVxuZXNjYXBlU3RyaW5nRm9yW1wiJ1wiLmNoYXJDb2RlQXQoMCldICA9IFwiXFxcXCdcIlxuZXNjYXBlU3RyaW5nRm9yWydcIicuY2hhckNvZGVBdCgwKV0gID0gJ1xcXFxcIidcbmVzY2FwZVN0cmluZ0ZvclsnXFxcXCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXFxcXFwnXG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcZicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGYnXG5lc2NhcGVTdHJpbmdGb3JbJ1xcbicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXG4nXG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcdCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHQnXG5lc2NhcGVTdHJpbmdGb3JbJ1xcdicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnXG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKGMsIG9wdERlbGltKSB7XG4gIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKVxuICBpZiAoKGMgPT0gJ1wiJyB8fCBjID09IFwiJ1wiKSAmJiBvcHREZWxpbSAmJiBjICE9PSBvcHREZWxpbSlcbiAgICByZXR1cm4gY1xuICBlbHNlIGlmIChjaGFyQ29kZSA8IDEyOClcbiAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXVxuICBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpXG4gICAgcmV0dXJuICdcXFxceCcgKyBwYWQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyKVxuICBlbHNlXG4gICAgcmV0dXJuICdcXFxcdScgKyBwYWQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCA0KVxufVxuXG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKHMpIHtcbiAgaWYgKHMuY2hhckF0KDApID09ICdcXFxcJylcbiAgICBzd2l0Y2ggKHMuY2hhckF0KDEpKSB7XG4gICAgICBjYXNlICdiJzogIHJldHVybiAnXFxiJ1xuICAgICAgY2FzZSAnZic6ICByZXR1cm4gJ1xcZidcbiAgICAgIGNhc2UgJ24nOiAgcmV0dXJuICdcXG4nXG4gICAgICBjYXNlICdyJzogIHJldHVybiAnXFxyJ1xuICAgICAgY2FzZSAndCc6ICByZXR1cm4gJ1xcdCdcbiAgICAgIGNhc2UgJ3YnOiAgcmV0dXJuICdcXHYnXG4gICAgICBjYXNlICd4JzogIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpXG4gICAgICBjYXNlICd1JzogIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDYpLCAxNikpXG4gICAgICBkZWZhdWx0OiAgIHJldHVybiBzLmNoYXJBdCgxKVxuICAgIH1cbiAgZWxzZVxuICAgIHJldHVybiBzXG59XG5cbmZ1bmN0aW9uIHByaW50T24oeCwgd3MpIHtcbiAgaWYgKHggaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHdzLm5leHRQdXRBbGwoJ1snKVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHgubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKGlkeCA+IDApXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHByaW50T24oeFtpZHhdLCB3cylcbiAgICB9XG4gICAgd3MubmV4dFB1dEFsbCgnXScpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdzdHJpbmcnKSB7XG4gICAgdmFyIGhhc1NpbmdsZVF1b3RlcyA9IHguaW5kZXhPZihcIidcIikgPj0gMFxuICAgIHZhciBoYXNEb3VibGVRdW90ZXMgPSB4LmluZGV4T2YoJ1wiJykgPj0gMFxuICAgIHZhciBkZWxpbSA9IGhhc1NpbmdsZVF1b3RlcyAmJiAhaGFzRG91YmxlUXVvdGVzID8gJ1wiJyA6IFwiJ1wiXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspXG4gICAgICB3cy5uZXh0UHV0QWxsKHRoaXNNb2R1bGUuZXNjYXBlQ2hhcih4W2lkeF0sIGRlbGltKSlcbiAgICB3cy5uZXh0UHV0QWxsKGRlbGltKVxuICB9IGVsc2UgaWYgKHggPT09IG51bGwpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdudWxsJylcbiAgfSBlbHNlIGlmICh0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgISh4IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgIHdzLm5leHRQdXRBbGwoJ3snKVxuICAgIHZhciBmaXJzdCA9IHRydWVcbiAgICBvYmplY3RVdGlscy5rZXlzQW5kVmFsdWVzRG8oeCwgZnVuY3Rpb24oaywgdikge1xuICAgICAgaWYgKGZpcnN0KVxuICAgICAgICBmaXJzdCA9IGZhbHNlXG4gICAgICBlbHNlXG4gICAgICAgIHdzLm5leHRQdXRBbGwoJywgJylcbiAgICAgIHByaW50T24oaywgd3MpXG4gICAgICB3cy5uZXh0UHV0QWxsKCc6ICcpXG4gICAgICBwcmludE9uKHYsIHdzKVxuICAgIH0pXG4gICAgd3MubmV4dFB1dEFsbCgnfScpXG4gIH0gZWxzZVxuICAgIHdzLm5leHRQdXRBbGwoJycgKyB4KVxufVxuXG5leHBvcnRzLnByaW50U3RyaW5nID0gZnVuY3Rpb24ob2JqKSB7XG4gIHZhciB3cyA9IG9iamVjdFV0aWxzLnN0cmluZ0J1ZmZlcigpXG4gIHByaW50T24ob2JqLCB3cylcbiAgcmV0dXJuIHdzLmNvbnRlbnRzKClcbn1cblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyLmpzJyk7XG52YXIgZGVjbHMgPSByZXF1aXJlKCcuL2RlY2xzLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG87XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBCdWlsZGVyKCkge1xuICB0aGlzLmluaXQoKTtcbn1cblxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IEdyYW1tYXIucHJvdG90eXBlO1xuICAgIHRoaXMucnVsZURlY2xzID0gW107XG4gIH0sXG5cbiAgc2V0TmFtZTogZnVuY3Rpb24obmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH0sXG5cbiAgc2V0U3VwZXJHcmFtbWFyOiBmdW5jdGlvbihncmFtbWFyKSB7XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBncmFtbWFyO1xuICB9LFxuXG4gIHNldFJ1bGVEZXNjcmlwdGlvbjogZnVuY3Rpb24odGV4dCkge1xuICAgIHRoaXMucnVsZURlc2NyaXB0aW9uID0gdGV4dDtcbiAgfSxcblxuICBkZWZpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgZGVjbHMuRGVmaW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hciwgdGhpcy5ydWxlRGVzY3JpcHRpb24pKTtcbiAgICB0aGlzLnJ1bGVEZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgfSxcblxuICBvdmVycmlkZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBkZWNscy5PdmVycmlkZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKTtcbiAgfSxcblxuICBpbmxpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgZGVjbHMuSW5saW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpO1xuICAgIHJldHVybiB0aGlzLmFwcChydWxlTmFtZSk7XG4gIH0sXG5cbiAgZXh0ZW5kOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLkV4dGVuZChydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKTtcbiAgfSxcblxuICBidWlsZDogZnVuY3Rpb24ob3B0TmFtZXNwYWNlKSB7XG4gICAgdmFyIHN1cGVyR3JhbW1hciA9IHRoaXMuc3VwZXJHcmFtbWFyO1xuICAgIHZhciBydWxlRGljdCA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhzdXBlckdyYW1tYXIucnVsZURpY3QpO1xuICAgIHRoaXMucnVsZURlY2xzLmZvckVhY2goZnVuY3Rpb24ocnVsZURlY2wpIHtcbiAgICAgIHJ1bGVEZWNsLnBlcmZvcm1DaGVja3MoKTtcbiAgICAgIHJ1bGVEZWNsLmluc3RhbGwocnVsZURpY3QpO1xuICAgIH0pO1xuXG4gICAgdmFyIGdyYW1tYXIgPSBuZXcgR3JhbW1hcihydWxlRGljdCk7XG4gICAgZ3JhbW1hci5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gICAgZ3JhbW1hci5ydWxlRGVjbHMgPSB0aGlzLnJ1bGVEZWNscztcbiAgICBpZiAodGhpcy5uYW1lKSB7XG4gICAgICBncmFtbWFyLm5hbWUgPSB0aGlzLm5hbWU7XG4gICAgICBpZiAob3B0TmFtZXNwYWNlKSB7XG4gICAgICAgIGdyYW1tYXIubmFtZXNwYWNlTmFtZSA9IG9wdE5hbWVzcGFjZS5uYW1lO1xuICAgICAgICBvcHROYW1lc3BhY2UuaW5zdGFsbCh0aGlzLm5hbWUsIGdyYW1tYXIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgICByZXR1cm4gZ3JhbW1hcjtcbiAgfSxcblxuICBwcmltOiBmdW5jdGlvbih4KSB7IHJldHVybiBwZXhwcnMubWFrZVByaW0oeCk7IH0sXG4gIGFsdDogZnVuY3Rpb24oLyogdGVybTEsIHRlcm0xLCAuLi4gKi8pIHtcbiAgICB2YXIgdGVybXMgPSBbXTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5BbHQpIHtcbiAgICAgICAgdGVybXMgPSB0ZXJtcy5jb25jYXQoYXJnLnRlcm1zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRlcm1zLnB1c2goYXJnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRlcm1zLmxlbmd0aCA9PT0gMSA/IHRlcm1zWzBdIDogbmV3IHBleHBycy5BbHQodGVybXMpO1xuICB9LFxuICBzZXE6IGZ1bmN0aW9uKC8qIGZhY3RvcjEsIGZhY3RvcjIsIC4uLiAqLykge1xuICAgIHZhciBmYWN0b3JzID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuU2VxKSB7XG4gICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3JzLnB1c2goYXJnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhY3RvcnMubGVuZ3RoID09PSAxID8gZmFjdG9yc1swXSA6IG5ldyBwZXhwcnMuU2VxKGZhY3RvcnMpO1xuICB9LFxuICBiaW5kOiBmdW5jdGlvbihleHByLCBuYW1lKSB7IHJldHVybiBuZXcgcGV4cHJzLkJpbmQoZXhwciwgbmFtZSk7IH0sXG4gIG1hbnk6IGZ1bmN0aW9uKGV4cHIsIG1pbk51bU1hdGNoZXMpIHsgcmV0dXJuIG5ldyBwZXhwcnMuTWFueShleHByLCBtaW5OdW1NYXRjaGVzKTsgfSxcbiAgb3B0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgcGV4cHJzLk9wdChleHByKTsgfSxcbiAgbm90OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgcGV4cHJzLk5vdChleHByKTsgfSxcbiAgbGE6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuTG9va2FoZWFkKGV4cHIpOyB9LFxuICBzdHI6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuU3RyKGV4cHIpOyB9LFxuICBsc3Q6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuTGlzdChleHByKTsgfSxcbiAgb2JqOiBmdW5jdGlvbihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHsgcmV0dXJuIG5ldyBwZXhwcnMuT2JqKHByb3BlcnRpZXMsICEhaXNMZW5pZW50KTsgfSxcbiAgYXBwOiBmdW5jdGlvbihydWxlTmFtZSkgeyByZXR1cm4gbmV3IHBleHBycy5BcHBseShydWxlTmFtZSk7IH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbS5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgc2tpcFNwYWNlcyA9IHJlcXVpcmUoJy4vc2tpcFNwYWNlcy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyO1xudmFyIGtleXNEbyA9IGF3bGliLm9iamVjdFV0aWxzLmtleXNEbztcbnZhciB2YWx1ZXNEbyA9IGF3bGliLm9iamVjdFV0aWxzLnZhbHVlc0RvO1xudmFyIGZvcm1hbHMgPSBhd2xpYi5vYmplY3RVdGlscy5mb3JtYWxzO1xudmFyIG1ha2VTdHJpbmdCdWZmZXIgPSBhd2xpYi5vYmplY3RVdGlscy5zdHJpbmdCdWZmZXI7XG52YXIgbWFrZUNvbHVtblN0cmluZ0J1ZmZlciA9IGF3bGliLm9iamVjdFV0aWxzLmNvbHVtblN0cmluZ0J1ZmZlcjtcbnZhciBwcmludFN0cmluZyA9IGF3bGliLnN0cmluZ1V0aWxzLnByaW50U3RyaW5nO1xudmFyIGVxdWFscyA9IGF3bGliLmVxdWFscy5lcXVhbHM7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBHcmFtbWFyKHJ1bGVEaWN0KSB7XG4gIHRoaXMucnVsZURpY3QgPSBydWxlRGljdDtcbn1cblxuR3JhbW1hci5wcm90b3R5cGUgPSB7XG4gIHJ1bGVEaWN0OiBuZXcgKGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuXyA9IHBleHBycy5hbnl0aGluZztcbiAgICB0aGlzLmVuZCA9IG5ldyBwZXhwcnMuTm90KHBleHBycy5hbnl0aGluZyk7XG4gICAgdGhpcy5zcGFjZSA9IHBleHBycy5tYWtlUHJpbSgvW1xcc10vKTtcbiAgICB0aGlzLnNwYWNlLmRlc2NyaXB0aW9uID0gJ3NwYWNlJztcbiAgICB0aGlzLmFsbnVtID0gcGV4cHJzLm1ha2VQcmltKC9bMC05YS16QS1aXS8pO1xuICAgIHRoaXMuc3BhY2UuZGVzY3JpcHRpb24gPSAnYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXInO1xuICAgIHRoaXMubGV0dGVyID0gcGV4cHJzLm1ha2VQcmltKC9bYS16QS1aXS8pO1xuICAgIHRoaXMubGV0dGVyLmRlc2NyaXB0aW9uID0gJ2xldHRlcic7XG4gICAgdGhpcy5sb3dlciA9IHBleHBycy5tYWtlUHJpbSgvW2Etel0vKTtcbiAgICB0aGlzLmxvd2VyLmRlc2NyaXB0aW9uID0gJ2xvd2VyLWNhc2UgbGV0dGVyJztcbiAgICB0aGlzLnVwcGVyID0gcGV4cHJzLm1ha2VQcmltKC9bQS1aXS8pO1xuICAgIHRoaXMudXBwZXIuZGVzY3JpcHRpb24gPSAndXBwZXItY2FzZSBsZXR0ZXInO1xuICAgIHRoaXMuZGlnaXQgPSBwZXhwcnMubWFrZVByaW0oL1swLTldLyk7XG4gICAgdGhpcy5kaWdpdC5kZXNjcmlwdGlvbiA9ICdkaWdpdCc7XG4gICAgdGhpcy5oZXhEaWdpdCA9IHBleHBycy5tYWtlUHJpbSgvWzAtOWEtZkEtRl0vKTtcbiAgICB0aGlzLmhleERpZ2l0LmRlc2NyaXB0aW9uID0gJ2hleGFkZWNpbWFsIGRpZ2l0JztcbiAgfSkoKSxcblxuICBtYXRjaDogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUsIG9wdFRocm93T25GYWlsKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hDb250ZW50cyhbb2JqXSwgc3RhcnRSdWxlLCBvcHRUaHJvd09uRmFpbCk7XG4gIH0sXG5cbiAgbWF0Y2hDb250ZW50czogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUsIG9wdFRocm93T25GYWlsKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKG9iaik7XG4gICAgdmFyIHRodW5rID0gbmV3IHBleHBycy5BcHBseShzdGFydFJ1bGUpLmV2YWwob3B0VGhyb3dPbkZhaWwsIHVuZGVmaW5lZCwgdGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZCk7XG5cbiAgICB2YXIgc3VjY2VlZGVkO1xuICAgIGlmICh0aHVuayA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICAgIHN1Y2NlZWRlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGlzIG1hdGNoIG9ubHkgc3VjY2VlZGVkIGlmIHRoZSBzdGFydCBydWxlIGNvbnN1bWVkIGFsbCBvZiB0aGUgaW5wdXQuXG4gICAgICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHN0YXJ0UnVsZSkpIHtcbiAgICAgICAgc2tpcFNwYWNlcyh0aGlzLnJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gICAgICB9XG4gICAgICBzdWNjZWVkZWQgPSBwZXhwcnMuZW5kLmV2YWwob3B0VGhyb3dPbkZhaWwsIGZhbHNlLCB0aGlzLnJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgdW5kZWZpbmVkKSAhPT0gY29tbW9uLmZhaWw7XG4gICAgfVxuXG4gICAgaWYgKHN1Y2NlZWRlZCkge1xuICAgICAgdmFyIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaCA9IHRoaXMuYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoLmJpbmQodGhpcyk7XG4gICAgICB2YXIgYW5zID0gZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgICAgICBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2goYWN0aW9uRGljdCk7XG4gICAgICAgIHJldHVybiB0aHVuay5mb3JjZShhY3Rpb25EaWN0LCB7fSk7XG4gICAgICB9O1xuICAgICAgYW5zLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiAnW29obSB0aHVua10nOyB9O1xuICAgICAgcmV0dXJuIGFucztcbiAgICB9IGVsc2UgaWYgKG9wdFRocm93T25GYWlsKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLk1hdGNoRmFpbHVyZShpbnB1dFN0cmVhbSwgdGhpcy5ydWxlRGljdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBydWxlRGljdCA9IHRoaXMucnVsZURpY3Q7XG4gICAgdmFyIG9rID0gdHJ1ZTtcbiAgICBrZXlzRG8ocnVsZURpY3QsIGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgICBpZiAoYWN0aW9uRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgYWN0dWFsID0gZm9ybWFscyhhY3Rpb25EaWN0W3J1bGVOYW1lXSkuc29ydCgpO1xuICAgICAgdmFyIGV4cGVjdGVkID0gc2VsZi5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKTtcbiAgICAgIGlmICghZXF1YWxzKGFjdHVhbCwgZXhwZWN0ZWQpKSB7XG4gICAgICAgIG9rID0gZmFsc2U7XG4gICAgICAgIGNvbnNvbGUubG9nKCdzZW1hbnRpYyBhY3Rpb24gZm9yIHJ1bGUnLCBydWxlTmFtZSwgJ2hhcyB0aGUgd3JvbmcgYXJndW1lbnQgbmFtZXMnKTtcbiAgICAgICAgY29uc29sZS5sb2coJyAgZXhwZWN0ZWQnLCBleHBlY3RlZCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcgICAgYWN0dWFsJywgYWN0dWFsKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIW9rKSB7XG4gICAgICBicm93c2VyLmVycm9yKCdvbmUgb3IgbW9yZSBzZW1hbnRpYyBhY3Rpb25zIGhhdmUgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzIC0tIHNlZSBjb25zb2xlIGZvciBkZXRhaWxzJyk7XG4gICAgfVxuICB9LFxuXG4gIHNlbWFudGljQWN0aW9uQXJnTmFtZXM6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyICYmIHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3J1bGVOYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyLnNlbWFudGljQWN0aW9uQXJnTmFtZXMocnVsZU5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgICAgdmFyIG5hbWVzID0gYm9keS5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgICAgIHJldHVybiBuYW1lcy5sZW5ndGggPiAwIHx8IGJvZHkucHJvZHVjZXNWYWx1ZSgpID8gWydlbnYnXSA6IFtdO1xuICAgIH1cbiAgfSxcblxuICB0b1JlY2lwZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHdzID0gbWFrZVN0cmluZ0J1ZmZlcigpO1xuICAgIHdzLm5leHRQdXRBbGwoJyhmdW5jdGlvbihvaG0sIG9wdE5hbWVzcGFjZSkge1xcbicpO1xuICAgIHdzLm5leHRQdXRBbGwoJyAgdmFyIGIgPSBvaG0uX2J1aWxkZXIoKTtcXG4nKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcgIGIuc2V0TmFtZSgnKTsgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLm5hbWUpKTsgd3MubmV4dFB1dEFsbCgnKTtcXG4nKTtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIubmFtZSAmJiB0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcgIGIuc2V0U3VwZXJHcmFtbWFyKG9obS5uYW1lc3BhY2UoJyk7XG4gICAgICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWVzcGFjZU5hbWUpKTtcbiAgICAgIHdzLm5leHRQdXRBbGwoJykuZ2V0R3JhbW1hcignKTtcbiAgICAgIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5zdXBlckdyYW1tYXIubmFtZSkpO1xuICAgICAgd3MubmV4dFB1dEFsbCgnKSk7XFxuJyk7XG4gICAgfVxuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucnVsZURlY2xzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJyAgJyk7XG4gICAgICB0aGlzLnJ1bGVEZWNsc1tpZHhdLm91dHB1dFJlY2lwZSh3cyk7XG4gICAgICB3cy5uZXh0UHV0QWxsKCc7XFxuJyk7XG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJyAgcmV0dXJuIGIuYnVpbGQob3B0TmFtZXNwYWNlKTtcXG4nKTtcbiAgICB3cy5uZXh0UHV0QWxsKCd9KTsnKTtcbiAgICByZXR1cm4gd3MuY29udGVudHMoKTtcbiAgfSxcblxuICB0b1NlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uKC8qIGVudHJ5UG9pbnQxLCBlbnRyeVBvaW50MiwgLi4uICovKSB7XG4gICAgdmFyIGVudHJ5UG9pbnRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHMgOiBPYmplY3Qua2V5cyh0aGlzLnJ1bGVEaWN0KTtcbiAgICB2YXIgcnVsZXNUb0JlSW5jbHVkZWQgPSB0aGlzLnJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihlbnRyeVBvaW50cyk7XG4gICAgXG4gICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByX3BsdXMgc2hvdWxkIGFwcGVhciBuZXh0IHRvXG4gICAgLy8gb3RoZXIgY2FzZXMgb2YgQWRkRXhwci5cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgYnVmZmVyID0gbWFrZUNvbHVtblN0cmluZ0J1ZmZlcigpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd7Jyk7XG5cbiAgICB2YXIgZmlyc3QgPSB0cnVlO1xuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIHJ1bGVzVG9CZUluY2x1ZGVkKSB7XG4gICAgICB2YXIgYm9keSA9IHRoaXMucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBidWZmZXIubmV4dFB1dEFsbCgnLCcpO1xuICAgICAgfVxuICAgICAgYnVmZmVyLm5ld0xpbmUoKTtcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcgICcpO1xuICAgICAgYnVmZmVyLm5ld0NvbHVtbigpO1xuICAgICAgc2VsZi5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBidWZmZXIpO1xuICAgIH1cblxuICAgIGJ1ZmZlci5uZXdMaW5lKCk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ30nKTtcbiAgICByZXR1cm4gYnVmZmVyLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHksIGJ1ZmZlcikge1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKHJ1bGVOYW1lKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnOiAnKTtcbiAgICBidWZmZXIubmV3Q29sdW1uKCk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ2Z1bmN0aW9uKCcpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKHRoaXMuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSkuam9pbignLCAnKSk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJykgJyk7XG4gICAgYnVmZmVyLm5ld0NvbHVtbigpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd7Jyk7XG5cbiAgICB2YXIgZW52UHJvcGVydGllcyA9IGJvZHkuZ2V0QmluZGluZ05hbWVzKCk7XG4gICAgaWYgKGVudlByb3BlcnRpZXMubGVuZ3RoID09PSAwICYmIGJvZHkucHJvZHVjZXNWYWx1ZSgpKSB7XG4gICAgICBlbnZQcm9wZXJ0aWVzID0gWyd2YWx1ZSddO1xuICAgIH1cbiAgICBpZiAoZW52UHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnIC8qICcpO1xuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoZW52UHJvcGVydGllcy5qb2luKCcsICcpKTtcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcgKi8gJyk7XG4gICAgfVxuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd9Jyk7XG4gIH0sXG5cbiAgcnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uOiBmdW5jdGlvbihlbnRyeVBvaW50cykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBnZXRCb2R5KHJ1bGVOYW1lKSB7XG4gICAgICBpZiAoc2VsZi5ydWxlRGljdFtydWxlTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBzZWxmLm5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYucnVsZURpY3RbcnVsZU5hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBydWxlcyA9IHt9O1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGVudHJ5UG9pbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBydWxlTmFtZSA9IGVudHJ5UG9pbnRzW2lkeF07XG4gICAgICBnZXRCb2R5KHJ1bGVOYW1lKTsgIC8vIHRvIG1ha2Ugc3VyZSB0aGUgcnVsZSBleGlzdHNcbiAgICAgIHJ1bGVzW3J1bGVOYW1lXSA9IHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGRvbmUgPSBmYWxzZTtcbiAgICB3aGlsZSAoIWRvbmUpIHtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gcnVsZXMpIHtcbiAgICAgICAgdmFyIGFkZGVkTmV3UnVsZSA9IGdldEJvZHkocnVsZU5hbWUpLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihydWxlcywgdHJ1ZSk7XG4gICAgICAgIGRvbmUgJj0gIWFkZGVkTmV3UnVsZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcnVsZXM7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXI7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBQb3NJbmZvID0gcmVxdWlyZSgnLi9Qb3NJbmZvLmpzJyk7XG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hci5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIElucHV0U3RyZWFtKCkge1xuICB0aHJvdyAnSW5wdXRTdHJlYW0gY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnO1xufVxuXG5JbnB1dFN0cmVhbS5uZXdGb3IgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdJbnB1dFN0cmVhbShvYmopO1xuICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0SW5wdXRTdHJlYW0ob2JqKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyAnY2Fubm90IG1ha2UgaW5wdXQgc3RyZWFtIGZvciAnICsgb2JqO1xuICB9XG59O1xuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMucG9zID0gMDtcbiAgICB0aGlzLnBvc0luZm9zID0gW107XG4gICAgdGhpcy5mYWlsdXJlcyA9IG51bGw7XG4gICAgdGhpcy5mYWlsdXJlc1BvcyA9IC0xO1xuICB9LFxuXG4gIHJlY29yZEZhaWx1cmU6IGZ1bmN0aW9uKHBvcywgZXhwcikge1xuICAgIGlmIChwb3MgPiB0aGlzLmZhaWx1cmVzUG9zKSB7XG4gICAgICB0aGlzLmZhaWx1cmVzID0ge2V4cHI6IGV4cHIsIG5leHQ6IG51bGx9O1xuICAgICAgdGhpcy5mYWlsdXJlc1BvcyA9IHBvcztcbiAgICB9IGVsc2UgaWYgKHBvcyA9PT0gdGhpcy5mYWlsdXJlc1Bvcykge1xuICAgICAgdGhpcy5mYWlsdXJlcyA9IHtleHByOiBleHByLCBuZXh0OiB0aGlzLmZhaWx1cmVzfTtcbiAgICB9XG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyUG9zID0gdGhpcy5wb3M7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW2N1cnJQb3NdO1xuICAgIHJldHVybiBwb3NJbmZvIHx8ICh0aGlzLnBvc0luZm9zW2N1cnJQb3NdID0gbmV3IFBvc0luZm8oY3VyclBvcykpO1xuICB9LFxuXG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfSxcblxuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5hdEVuZCgpKSB7XG4gICAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXTtcbiAgICB9XG4gIH0sXG5cbiAgbWF0Y2hFeGFjdGx5OiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHRoaXMubmV4dCgpID09PSB4ID8gdHJ1ZSA6IGNvbW1vbi5mYWlsO1xuICB9LFxuXG4gIGludGVydmFsOiBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0SWR4LCBlbmRJZHgpO1xuICB9LFxuXG4gIGdldEZhaWx1cmVzUG9zOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5mYWlsdXJlc1BvcztcbiAgfVxufTtcblxuZnVuY3Rpb24gU3RyaW5nSW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpO1xufVxuXG5TdHJpbmdJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAodGhpcy5tYXRjaEV4YWN0bHkoc1tpZHhdKSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIC8vIElNUE9SVEFOVDogZSBtdXN0IGJlIGEgbm9uLWdsb2JhbCwgb25lLWNoYXJhY3RlciBleHByZXNzaW9uLCBlLmcuLCAvLi8gYW5kIC9bMC05XS9cbiAgICB2YXIgYyA9IHRoaXMubmV4dCgpO1xuICAgIHJldHVybiBjICE9PSBjb21tb24uZmFpbCAmJiBlLnRlc3QoYykgPyB0cnVlIDogY29tbW9uLmZhaWw7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBMaXN0SW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuaW5pdChzb3VyY2UpO1xufVxuXG5MaXN0SW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShzKTtcbiAgfSxcblxuICBtYXRjaFJlZ0V4cDogZnVuY3Rpb24oZSkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoRXhhY3RseShlKTtcbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0U3RyZWFtO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbS5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW50ZXJ2YWwoc291cmNlLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHg7XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4O1xufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhJbnRlcnZhbC5wcm90b3R5cGUsIHtcbiAgJ2NvbnRlbnRzJzoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fY29udGVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9jb250ZW50cyA9IElucHV0U3RyZWFtLm5ld0Zvcih0aGlzLnNvdXJjZSkuaW50ZXJ2YWwodGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRzO1xuICAgIH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWw7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgb2htID0gcmVxdWlyZSgnLi9tYWluLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBicm93c2VyID0gYXdsaWIuYnJvd3NlcjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE5hbWVzcGFjZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5hbWVzcGFjZShuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuZ3JhbW1hcnMgPSB7fTtcbn1cblxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IHtcbiAgaW5zdGFsbDogZnVuY3Rpb24obmFtZSwgZ3JhbW1hcikge1xuICAgIGlmICh0aGlzLmdyYW1tYXJzW25hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdyYW1tYXJzW25hbWVdID0gZ3JhbW1hcjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgZ2V0R3JhbW1hcjogZnVuY3Rpb24obmFtZSkge1xuICAgIGlmICh0aGlzLmdyYW1tYXJzW25hbWVdKSB7XG4gICAgICByZXR1cm4gdGhpcy5ncmFtbWFyc1tuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkR3JhbW1hcihuYW1lLCB0aGlzLm5hbWUpO1xuICAgIH1cbiAgfSxcblxuICBsb2FkR3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGJyb3dzZXIuc2FuaXR5Q2hlY2soJ3NjcmlwdCB0YWdcXCdzIHR5cGUgYXR0cmlidXRlIG11c3QgYmUgXCJ0ZXh0L29obS1qc1wiJywgZWxlbWVudC50eXBlID09PSAndGV4dC9vaG0tanMnKTtcbiAgICBvaG0ubWFrZUdyYW1tYXJzKGVsZW1lbnQuaW5uZXJIVE1MLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBtYWtlOiBmdW5jdGlvbihyZWNpcGUpIHtcbiAgICByZXR1cm4gcmVjaXBlKG9obSwgdGhpcyk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVzcGFjZTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUG9zSW5mbygpIHtcbiAgdGhpcy5ydWxlU3RhY2sgPSBbXTtcbiAgdGhpcy5hY3RpdmVSdWxlcyA9IHt9OyAgLy8gcmVkdW5kYW50IChjb3VsZCBiZSBnZW5lcmF0ZWQgZnJvbSBydWxlU3RhY2spIGJ1dCB1c2VmdWwgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnNcbiAgdGhpcy5tZW1vID0ge307XG59XG5cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICBpc0FjdGl2ZTogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV07XG4gIH0sXG5cbiAgZW50ZXI6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5ydWxlU3RhY2sucHVzaChydWxlTmFtZSk7XG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSB0cnVlO1xuICB9LFxuXG4gIGV4aXQ6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5ydWxlU3RhY2sucG9wKCk7XG4gICAgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0gPSBmYWxzZTtcbiAgfSxcblxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIHZhciBpbnZvbHZlZFJ1bGVzID0gbWVtb1JlYy5pbnZvbHZlZFJ1bGVzO1xuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIGludm9sdmVkUnVsZXMpIHtcbiAgICAgIGlmIChpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSAmJiB0aGlzLmFjdGl2ZVJ1bGVzW3J1bGVOYW1lXSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIGdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sgPyB0aGlzLmxlZnRSZWN1cnNpb25TdGFja1t0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5sZW5ndGggLSAxXSA6IHVuZGVmaW5lZDtcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgaWYgKCF0aGlzLmxlZnRSZWN1cnNpb25TdGFjaykge1xuICAgICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sgPSBbXTtcbiAgICB9XG4gICAgdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2sucHVzaCh7bmFtZTogcnVsZU5hbWUsIHZhbHVlOiBjb21tb24uZmFpbCwgcG9zOiAtMSwgaW52b2x2ZWRSdWxlczoge319KTtcbiAgICB0aGlzLnVwZGF0ZUludm9sdmVkUnVsZXMoKTtcbiAgfSxcblxuICBlbmRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnBvcCgpO1xuICB9LFxuXG4gIHVwZGF0ZUludm9sdmVkUnVsZXM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHRoaXMuZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICB2YXIgaW52b2x2ZWRSdWxlcyA9IGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmludm9sdmVkUnVsZXM7XG4gICAgdmFyIGxyUnVsZU5hbWUgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5uYW1lO1xuICAgIHZhciBpZHggPSB0aGlzLnJ1bGVTdGFjay5sZW5ndGggLSAxO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVTdGFja1tpZHgtLV07XG4gICAgICBpZiAocnVsZU5hbWUgPT09IGxyUnVsZU5hbWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSA9IHRydWU7XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBQb3NJbmZvO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5hYnN0cmFjdCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyAndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhJztcbn07XG5cbmV4cG9ydHMuZ2V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHZhciBkdXBsaWNhdGVzID0gW107XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycmF5W2lkeF07XG4gICAgaWYgKGFycmF5Lmxhc3RJbmRleE9mKHgpICE9PSBpZHggJiYgZHVwbGljYXRlcy5pbmRleE9mKHgpIDwgMCkge1xuICAgICAgZHVwbGljYXRlcy5wdXNoKHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZHVwbGljYXRlcztcbn07XG5cbmV4cG9ydHMuZmFpbCA9IHt9O1xuXG5leHBvcnRzLmlzU3ludGFjdGljID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdmFyIGZpcnN0Q2hhciA9IHJ1bGVOYW1lWzBdO1xuICByZXR1cm4gJ0EnIDw9IGZpcnN0Q2hhciAmJiBmaXJzdENoYXIgPD0gJ1onO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG87XG52YXIgcHJpbnRTdHJpbmcgPSBhd2xpYi5zdHJpbmdVdGlscy5wcmludFN0cmluZztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG91dHB1dFJlY2lwZShkZWNsLCB3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLicpO1xuICB3cy5uZXh0UHV0QWxsKGRlY2wua2luZCk7XG4gIHdzLm5leHRQdXRBbGwoJygnKTtcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyhkZWNsLm5hbWUpKTtcbiAgd3MubmV4dFB1dEFsbCgnLCAnKTtcbiAgZGVjbC5ib2R5Lm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn1cblxuZnVuY3Rpb24gUnVsZURlY2woKSB7XG4gIHRocm93ICdSdWxlRGVjbCBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCc7XG59XG5cblJ1bGVEZWNsLnByb3RvdHlwZSA9IHtcbiAgcGVyZm9ybUNoZWNrczogY29tbW9uLmFic3RyYWN0LFxuXG4gIHBlcmZvcm1Db21tb25DaGVja3M6IGZ1bmN0aW9uKG5hbWUsIGJvZHkpIHtcbiAgICBib2R5LmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MobmFtZSk7XG4gICAgYm9keS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhuYW1lKTtcbiAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKG5hbWUpO1xuICB9LFxuXG4gIGluc3RhbGw6IGNvbW1vbi5hYnN0cmFjdCxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7IG91dHB1dFJlY2lwZSh0aGlzLCB3cyk7IH1cbn07XG5cbmZ1bmN0aW9uIERlZmluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIsIGRlc2NyaXB0aW9uKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG59XG5cbkRlZmluZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdkZWZpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbih0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpO1xuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLnNldFJ1bGVEZXNjcmlwdGlvbignKTtcbiAgICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMuZGVzY3JpcHRpb24pKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcpOyAnKTtcbiAgICBvdXRwdXRSZWNpcGUodGhpcywgd3MpO1xuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgdGhpcy5ib2R5LmRlc2NyaXB0aW9uID0gdGhpcy5kZXNjcmlwdGlvbjtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5O1xuICB9XG59KTtcblxuZnVuY3Rpb24gT3ZlcnJpZGUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xufVxuXG5PdmVycmlkZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdvdmVycmlkZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG92ZXJyaWRkZW4gPSB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdO1xuICAgIGlmICghb3ZlcnJpZGRlbikge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkUnVsZSh0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICAgIH1cbiAgICBpZiAob3ZlcnJpZGRlbi5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgb3ZlcnJpZGRlbi5wcm9kdWNlc1ZhbHVlKCkgJiYgIXRoaXMuYm9keS5wcm9kdWNlc1ZhbHVlKCkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuUnVsZU11c3RQcm9kdWNlVmFsdWUodGhpcy5uYW1lLCAnb3ZlcnJpZGluZycpO1xuICAgIH1cbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpO1xuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgdGhpcy5ib2R5LmRlc2NyaXB0aW9uID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXS5kZXNjcmlwdGlvbjtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5O1xuICB9XG59KTtcblxuZnVuY3Rpb24gSW5saW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJvZHkgPSBib2R5O1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbn1cblxuSW5saW5lLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2lubGluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogY29uc2lkZXIgcmVsYXhpbmcgdGhpcyBjaGVjaywgZS5nLiwgbWFrZSBpdCBvayB0byBvdmVycmlkZSBhbiBpbmxpbmUgcnVsZSBpZiB0aGUgbmVzdGluZyBydWxlIGlzXG4gICAgLy8gYW4gb3ZlcnJpZGUuIEJ1dCBvbmx5IGlmIHRoZSBpbmxpbmUgcnVsZSB0aGF0J3MgYmVpbmcgb3ZlcnJpZGRlbiBpcyBuZXN0ZWQgaW5zaWRlIHRoZSBuZXN0aW5nIHJ1bGUgdGhhdFxuICAgIC8vIHdlJ3JlIG92ZXJyaWRpbmc/IEhvcGVmdWxseSB0aGVyZSdzIGEgbXVjaCBsZXNzIGNvbXBsaWNhdGVkIHdheSB0byBkbyB0aGlzIDopXG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKHRoaXMubmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSk7XG4gICAgfVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSk7XG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5O1xuICB9XG59KTtcblxuZnVuY3Rpb24gRXh0ZW5kKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJhc2UgPSBzdXBlckdyYW1tYXIucnVsZURpY3RbbmFtZV07XG4gIGlmICghdGhpcy5iYXNlKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkUnVsZShuYW1lLCBzdXBlckdyYW1tYXIubmFtZSk7XG4gIH1cbiAgdGhpcy5ib2R5ID0gYm9keTtcbiAgdGhpcy5leHRlbmRlZEJvZHkgPSBuZXcgcGV4cHJzLkV4dGVuZEFsdCh0aGlzLmJvZHksIHRoaXMuYmFzZSk7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xufVxuXG5FeHRlbmQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnZXh0ZW5kJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5iYXNlLmdldEJpbmRpbmdOYW1lcygpLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmJhc2UucHJvZHVjZXNWYWx1ZSgpICYmICF0aGlzLmJvZHkucHJvZHVjZXNWYWx1ZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlJ1bGVNdXN0UHJvZHVjZVZhbHVlKHRoaXMubmFtZSwgJ2V4dGVuZGluZycpO1xuICAgIH1cbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmV4dGVuZGVkQm9keSk7XG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICB0aGlzLmV4dGVuZGVkQm9keS5kZXNjcmlwdGlvbiA9IHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0uZGVzY3JpcHRpb247XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuZXh0ZW5kZWRCb2R5O1xuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuUnVsZURlY2wgPSBSdWxlRGVjbDtcbmV4cG9ydHMuRGVmaW5lID0gRGVmaW5lO1xuZXhwb3J0cy5PdmVycmlkZSA9IE92ZXJyaWRlO1xuZXhwb3J0cy5JbmxpbmUgPSBJbmxpbmU7XG5leHBvcnRzLkV4dGVuZCA9IEV4dGVuZDtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbztcbnZhciBtYWtlU3RyaW5nQnVmZmVyID0gYXdsaWIub2JqZWN0VXRpbHMuc3RyaW5nQnVmZmVyO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gRXJyb3IoKSB7XG4gIHRocm93ICdFcnJvciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCc7XG59XG5cbkVycm9yLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gY29tbW9uLmFic3RyYWN0O1xuXG5FcnJvci5wcm90b3R5cGUucHJpbnRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKHRoaXMuZ2V0TWVzc2FnZSgpKTtcbn07XG5cbkVycm9yLnByb3RvdHlwZS5nZXRTaG9ydE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0TWVzc2FnZSgpO1xufTtcblxuRXJyb3IucHJvdG90eXBlLnByaW50U2hvcnRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKHRoaXMuZ2V0TWVzc2FnZSgpKTtcbn07XG5cbkVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5nZXRTaG9ydE1lc3NhZ2UoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBncmFtbWFycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBVbmRlY2xhcmF0ZWQgZ3JhbW1hclxuXG5mdW5jdGlvbiBVbmRlY2xhcmVkR3JhbW1hcihncmFtbWFyTmFtZSwgb3B0TmFtZXNwYWNlTmFtZSkge1xuICB0aGlzLmdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWU7XG4gIHRoaXMubmFtZXNwYWNlTmFtZSA9IG9wdE5hbWVzcGFjZU5hbWU7XG59O1xuXG5VbmRlY2xhcmVkR3JhbW1hci5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuVW5kZWNsYXJlZEdyYW1tYXIucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubmFtZXNwYWNlTmFtZSA/XG4gICAgWydncmFtbWFyJywgdGhpcy5ncmFtbWFyTmFtZSwgJ2lzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UnLCB0aGlzLm5hbWVzcGFjZU5hbWVdLmpvaW4oJyAnKSA6XG4gICAgWyd1bmRlY2xhcmVkIGdyYW1tYXInLCB0aGlzLmdyYW1tYXJOYW1lXS5qb2luKCcgJyk7XG59O1xuXG4vLyBEdXBsaWNhdGUgZ3JhbW1hciBkZWNsYXJhdGlvblxuXG5mdW5jdGlvbiBEdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZ3JhbW1hck5hbWUsIG5hbWVzcGFjZU5hbWUpIHtcbiAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xuICB0aGlzLm5hbWVzcGFjZU5hbWUgPSBuYW1lc3BhY2VOYW1lO1xufTtcblxuRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhFcnJvci5wcm90b3R5cGUpO1xuXG5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24ucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsnZ3JhbW1hcicsIHRoaXMuZ3JhbW1hck5hbWUsICdpcyBhbHJlYWR5IGRlY2xhcmVkIGluIG5hbWVzcGFjZScsIHRoaXMubmFtZXNwYWNlTmFtZV0uam9pbignICcpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5kZWNsYXJlZCBydWxlXG5cbmZ1bmN0aW9uIFVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBvcHRHcmFtbWFyTmFtZSkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuZ3JhbW1hck5hbWUgPSBvcHRHcmFtbWFyTmFtZTtcbn07XG5cblVuZGVjbGFyZWRSdWxlLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhFcnJvci5wcm90b3R5cGUpO1xuXG5VbmRlY2xhcmVkUnVsZS5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5ncmFtbWFyTmFtZSA/XG4gICAgWydydWxlJywgdGhpcy5ydWxlTmFtZSwgJ2lzIG5vdCBkZWNsYXJlZCBpbiBncmFtbWFyJywgdGhpcy5ncmFtbWFyTmFtZV0uam9pbignICcpIDpcbiAgICBbJ3VuZGVjbGFyZWQgcnVsZScsIHRoaXMucnVsZU5hbWVdLmpvaW4oJyAnKTtcbn07XG5cbi8vIER1cGxpY2F0ZSBydWxlIGRlY2xhcmF0aW9uXG5cbmZ1bmN0aW9uIER1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLmdyYW1tYXJOYW1lID0gZ3JhbW1hck5hbWU7XG59O1xuXG5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEVycm9yLnByb3RvdHlwZSk7XG5cbkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbi5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gWydydWxlJywgdGhpcy5ydWxlTmFtZSwgJ2lzIGFscmVhZHkgZGVjbGFyZWQgaW4gZ3JhbW1hcicsIHRoaXMuZ3JhbW1hck5hbWVdLmpvaW4oJyAnKTtcbn07XG5cbi8vIFJ1bGUgbXVzdCBwcm9kdWNlIHZhbHVlXG5cbmZ1bmN0aW9uIFJ1bGVNdXN0UHJvZHVjZVZhbHVlKHJ1bGVOYW1lLCB3aHkpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLndoeSA9IHdoeTtcbn07XG5cblJ1bGVNdXN0UHJvZHVjZVZhbHVlLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhFcnJvci5wcm90b3R5cGUpO1xuXG5SdWxlTXVzdFByb2R1Y2VWYWx1ZS5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW1xuICAgICdydWxlJywgdGhpcy5ydWxlTmFtZSwgJ211c3QgcHJvZHVjZSBhIHZhbHVlJyxcbiAgICAnYmVjYXVzZSB0aGUgcnVsZSBpdCBpcycsIHRoaXMud2h5LCAnYWxzbyBwcm9kdWNlcyBhIHZhbHVlJ1xuICBdLmpvaW4oJyAnKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGJpbmRpbmdzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEluY29uc2lzdGVudCBiaW5kaW5nc1xuXG5mdW5jdGlvbiBJbmNvbnNpc3RlbnRCaW5kaW5ncyhydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuZXhwZWN0ZWQgPSBleHBlY3RlZDtcbiAgdGhpcy5hY3R1YWwgPSBhY3R1YWw7XG59O1xuXG5JbmNvbnNpc3RlbnRCaW5kaW5ncy5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuSW5jb25zaXN0ZW50QmluZGluZ3MucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtcbiAgICAncnVsZScsIHRoaXMucnVsZU5hbWUsICdoYXMgaW5jb25zaXN0ZW50IGJpbmRpbmdzLicsXG4gICAgJ2V4cGVjdGVkOicsIHRoaXMuZXhwZWN0ZWQsXG4gICAgJ2dvdDonLCB0aGlzLmFjdHVhbFxuICBdLmpvaW4oJyAnKTtcbn07XG5cbi8vIER1cGxpY2F0ZSBiaW5kaW5nc1xuXG5mdW5jdGlvbiBEdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSwgZHVwbGljYXRlcykge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuZHVwbGljYXRlcyA9IGR1cGxpY2F0ZXM7XG59O1xuXG5EdXBsaWNhdGVCaW5kaW5ncy5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuRHVwbGljYXRlQmluZGluZ3MucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsncnVsZScsIHRoaXMucnVsZU5hbWUsICdoYXMgZHVwbGljYXRlIGJpbmRpbmdzOicsIHRoaXMuZHVwbGljYXRlc10uam9pbignICcpO1xufTtcblxuLy8gVXNlbGVzcyBiaW5kaW5nc1xuXG5mdW5jdGlvbiBVc2VsZXNzQmluZGluZ3MocnVsZU5hbWUsIHVzZWxlc3MpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLnVzZWxlc3MgPSB1c2VsZXNzO1xufTtcblxuVXNlbGVzc0JpbmRpbmdzLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhFcnJvci5wcm90b3R5cGUpO1xuXG5Vc2VsZXNzQmluZGluZ3MucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsncnVsZScsIHRoaXMucnVsZU5hbWUsICdoYXMgdXNlbGVzcyBiaW5kaW5nczonLCB0aGlzLnVzZWxlc3NdLmpvaW4oJyAnKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gRHVwbGljYXRlIHByb3BlcnR5IG5hbWVzXG5cbmZ1bmN0aW9uIER1cGxpY2F0ZVByb3BlcnR5TmFtZXMoZHVwbGljYXRlcykge1xuICB0aGlzLmR1cGxpY2F0ZXMgPSBkdXBsaWNhdGVzO1xufTtcblxuRHVwbGljYXRlUHJvcGVydHlOYW1lcy5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuRHVwbGljYXRlUHJvcGVydHlOYW1lcy5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gWydvYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOicsIHRoaXMuZHVwbGljYXRlc10uam9pbignICcpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gc3ludGF4IC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHRvRXJyb3JJbmZvKHBvcywgc3RyKSB7XG4gIHZhciBsaW5lTnVtID0gMTtcbiAgdmFyIGNvbE51bSA9IDE7XG5cbiAgdmFyIGN1cnJQb3MgPSAwO1xuICB2YXIgbGluZVN0YXJ0UG9zID0gMDtcblxuICB3aGlsZSAoY3VyclBvcyA8IHBvcykge1xuICAgIHZhciBjID0gc3RyLmNoYXJBdChjdXJyUG9zKyspO1xuICAgIGlmIChjID09PSAnXFxuJykge1xuICAgICAgbGluZU51bSsrO1xuICAgICAgY29sTnVtID0gMTtcbiAgICAgIGxpbmVTdGFydFBvcyA9IGN1cnJQb3M7XG4gICAgfSBlbHNlIGlmIChjICE9PSAnXFxyJykge1xuICAgICAgY29sTnVtKys7XG4gICAgfVxuICB9XG5cbiAgdmFyIGxpbmVFbmRQb3MgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZVN0YXJ0UG9zKTtcbiAgaWYgKGxpbmVFbmRQb3MgPCAwKSB7XG4gICAgbGluZUVuZFBvcyA9IHN0ci5sZW5ndGg7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxpbmVOdW06IGxpbmVOdW0sXG4gICAgY29sTnVtOiBjb2xOdW0sXG4gICAgbGluZTogc3RyLnN1YnN0cihsaW5lU3RhcnRQb3MsIGxpbmVFbmRQb3MgLSBsaW5lU3RhcnRQb3MpXG4gIH07XG59XG5cbmZ1bmN0aW9uIE1hdGNoRmFpbHVyZShpbnB1dFN0cmVhbSwgcnVsZURpY3QpIHtcbiAgdGhpcy5pbnB1dFN0cmVhbSA9IGlucHV0U3RyZWFtO1xuICB0aGlzLnJ1bGVEaWN0ID0gcnVsZURpY3Q7XG59XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRQb3MgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaW5wdXRTdHJlYW0uZmFpbHVyZXNQb3M7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldFNob3J0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuIGlmICh0eXBlb2YgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuICdlcnJvciBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRQb3MoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGV4dCA9IG1ha2VTdHJpbmdCdWZmZXIoKTtcbiAgICB2YXIgZXJyb3JJbmZvID0gdG9FcnJvckluZm8odGhpcy5nZXRQb3MoKSwgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UpO1xuICAgIHRleHQubmV4dFB1dEFsbCh0aGlzLmdldExpbmVBbmRDb2xUZXh0KCkpO1xuICAgIHRleHQubmV4dFB1dEFsbCgnOiBleHBlY3RlZCAnKTtcbiAgICB0ZXh0Lm5leHRQdXRBbGwodGhpcy5nZXRFeHBlY3RlZFRleHQoKSk7XG4gICAgcmV0dXJuIHRleHQuY29udGVudHMoKTtcbiAgfVxufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gaWYgKHR5cGVvZiB0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gJ2Vycm9yIGF0IHBvc2l0aW9uICcgKyB0aGlzLmdldFBvcygpO1xuICB9IGVsc2Uge1xuICAgIHZhciB0ZXh0ID0gbWFrZVN0cmluZ0J1ZmZlcigpO1xuICAgIHZhciBlcnJvckluZm8gPSB0b0Vycm9ySW5mbyh0aGlzLmdldFBvcygpLCB0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSk7XG4gICAgdmFyIGxpbmVBbmRDb2xUZXh0ID0gdGhpcy5nZXRMaW5lQW5kQ29sVGV4dCgpICsgJzogJztcbiAgICB0ZXh0Lm5leHRQdXRBbGwobGluZUFuZENvbFRleHQpO1xuICAgIHRleHQubmV4dFB1dEFsbChlcnJvckluZm8ubGluZSk7XG4gICAgdGV4dC5uZXh0UHV0QWxsKCdcXG4nKTtcbiAgICBmb3IgKHZhciBpZHggPSAxOyBpZHggPCBsaW5lQW5kQ29sVGV4dC5sZW5ndGggKyBlcnJvckluZm8uY29sTnVtOyBpZHgrKykge1xuICAgICAgdGV4dC5uZXh0UHV0QWxsKCcgJyk7XG4gICAgfVxuICAgIHRleHQubmV4dFB1dEFsbCgnXicpO1xuICB9XG4gIHRleHQubmV4dFB1dEFsbCgnXFxuRXhwZWN0ZWQ6ICcpO1xuICB0ZXh0Lm5leHRQdXRBbGwodGhpcy5nZXRFeHBlY3RlZFRleHQoKSk7XG4gIHJldHVybiB0ZXh0LmNvbnRlbnRzKCk7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldExpbmVBbmRDb2xUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlcnJvckluZm8gPSB0b0Vycm9ySW5mbyh0aGlzLmdldFBvcygpLCB0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSk7XG4gIHJldHVybiAnTGluZSAnICsgZXJyb3JJbmZvLmxpbmVOdW0gKyAnLCBjb2wgJyArIGVycm9ySW5mby5jb2xOdW07XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEV4cGVjdGVkVGV4dCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGV4dCA9IG1ha2VTdHJpbmdCdWZmZXIoKTtcbiAgdmFyIGV4cGVjdGVkID0gdGhpcy5nZXRFeHBlY3RlZCgpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBleHBlY3RlZC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIGlmIChpZHggPT09IGV4cGVjdGVkLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgdGV4dC5uZXh0UHV0QWxsKGV4cGVjdGVkLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQubmV4dFB1dEFsbCgnLCAnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGV4dC5uZXh0UHV0QWxsKGV4cGVjdGVkW2lkeF0pO1xuICB9XG4gIHJldHVybiB0ZXh0LmNvbnRlbnRzKCk7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEV4cGVjdGVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBleHBlY3RlZCA9IHt9O1xuICBmb3IgKHZhciBmYWlsdXJlID0gdGhpcy5pbnB1dFN0cmVhbS5mYWlsdXJlczsgZmFpbHVyZSAhPT0gbnVsbDsgZmFpbHVyZSA9IGZhaWx1cmUubmV4dCkge1xuICAgIGV4cGVjdGVkW2ZhaWx1cmUuZXhwci50b0V4cGVjdGVkKHRoaXMucnVsZURpY3QpXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGV4cGVjdGVkKS5yZXZlcnNlKCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5VbmRlY2xhcmVkR3JhbW1hciA9IFVuZGVjbGFyZWRHcmFtbWFyO1xuZXhwb3J0cy5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24gPSBEdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb247XG5leHBvcnRzLlVuZGVjbGFyZWRSdWxlID0gVW5kZWNsYXJlZFJ1bGU7XG5leHBvcnRzLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbiA9IER1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbjtcbmV4cG9ydHMuUnVsZU11c3RQcm9kdWNlVmFsdWUgPSBSdWxlTXVzdFByb2R1Y2VWYWx1ZTtcbmV4cG9ydHMuSW5jb25zaXN0ZW50QmluZGluZ3MgPSBJbmNvbnNpc3RlbnRCaW5kaW5ncztcbmV4cG9ydHMuRHVwbGljYXRlQmluZGluZ3MgPSBEdXBsaWNhdGVCaW5kaW5ncztcbmV4cG9ydHMuVXNlbGVzc0JpbmRpbmdzID0gVXNlbGVzc0JpbmRpbmdzO1xuZXhwb3J0cy5EdXBsaWNhdGVQcm9wZXJ0eU5hbWVzID0gRHVwbGljYXRlUHJvcGVydHlOYW1lcztcbmV4cG9ydHMuTWF0Y2hGYWlsdXJlID0gTWF0Y2hGYWlsdXJlO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hci5qcycpO1xuXG52YXIgQnVpbGRlciA9IHJlcXVpcmUoJy4vQnVpbGRlci5qcycpO1xudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciB1bmVzY2FwZUNoYXIgPSBhd2xpYi5zdHJpbmdVdGlscy51bmVzY2FwZUNoYXI7XG5cbnZhciB0aGlzTW9kdWxlID0gZXhwb3J0cztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyQWN0aW9uRGljdChvcHROYW1lc3BhY2UpIHtcbiAgdmFyIGJ1aWxkZXI7XG4gIHJldHVybiB7XG4gICAgc3BhY2U6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge30sXG4gICAgc3BhY2VfbXVsdGlMaW5lOiAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAge30sXG4gICAgc3BhY2Vfc2luZ2xlTGluZTogICAgICAgICAgIGZ1bmN0aW9uKCkgICAge30sXG5cbiAgICBydWxlRGVzY3I6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IGJ1aWxkZXIuc2V0UnVsZURlc2NyaXB0aW9uKGVudi50KTsgfSxcbiAgICBydWxlRGVzY3JUZXh0OiAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzOyB9LFxuXG4gICAgbmFtZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50czsgfSxcbiAgICBuYW1lRmlyc3Q6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcbiAgICBuYW1lUmVzdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcblxuICAgIGlkZW50OiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi5uOyB9LFxuXG4gICAga2V5d29yZDogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIGtleXdvcmRfdW5kZWZpbmVkOiAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICBrZXl3b3JkX251bGw6ICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBudWxsOyB9LFxuICAgIGtleXdvcmRfdHJ1ZTogICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHRydWU7IH0sXG4gICAga2V5d29yZF9mYWxzZTogICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gZmFsc2U7IH0sXG5cbiAgICBzdHJpbmc6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudi5jcy5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gdW5lc2NhcGVDaGFyKGMpOyB9KS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBzQ2hhcjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzOyB9LFxuICAgIHJlZ0V4cDogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIG5ldyBSZWdFeHAoZW52LmUpOyB9LFxuICAgIHJlQ2hhckNsYXNzOiAgICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7IH0sXG4gICAgbnVtYmVyOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5pbnRlcnZhbC5jb250ZW50cyk7IH0sXG5cbiAgICBBbHQ6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgQWx0X3JlYzogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5hbHQoZW52LngsIGVudi55KTsgfSxcblxuICAgIFRlcm06ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBUZXJtX2lubGluZTogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmlubGluZShidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSArICdfJyArIGVudi5uLCBlbnYueCk7IH0sXG5cbiAgICBTZXE6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCBlbnYudmFsdWUpOyB9LFxuXG4gICAgRmFjdG9yOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIEZhY3Rvcl9iaW5kOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYmluZChlbnYueCwgZW52Lm4pOyB9LFxuXG4gICAgSXRlcjogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIEl0ZXJfc3RhcjogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubWFueShlbnYueCwgMCk7IH0sXG4gICAgSXRlcl9wbHVzOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5tYW55KGVudi54LCAxKTsgfSxcbiAgICBJdGVyX29wdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9wdChlbnYueCk7IH0sXG5cbiAgICBQcmVkOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgUHJlZF9ub3Q6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5ub3QoZW52LngpOyB9LFxuICAgIFByZWRfbG9va2FoZWFkOiAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubGEoZW52LngpOyB9LFxuXG4gICAgQmFzZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIEJhc2VfdW5kZWZpbmVkOiAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIGJ1aWxkZXIucHJpbSh1bmRlZmluZWQpOyB9LFxuICAgIEJhc2VfbnVsbDogICAgICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIGJ1aWxkZXIucHJpbShudWxsKTsgfSxcbiAgICBCYXNlX3RydWU6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBidWlsZGVyLnByaW0odHJ1ZSk7IH0sXG4gICAgQmFzZV9mYWxzZTogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gYnVpbGRlci5wcmltKGZhbHNlKTsgfSxcbiAgICBCYXNlX2FwcGxpY2F0aW9uOiAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmFwcChlbnYucnVsZU5hbWUpOyB9LFxuICAgIEJhc2VfcHJpbTogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIucHJpbShlbnYudmFsdWUpOyB9LFxuICAgIEJhc2VfbHN0OiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubHN0KGVudi54KTsgfSxcbiAgICBCYXNlX3N0cjogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLnN0cihlbnYueCk7IH0sXG4gICAgQmFzZV9wYXJlbjogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52Lng7IH0sXG4gICAgQmFzZV9vYmo6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vYmooW10sIGVudi5sZW5pZW50KTsgfSxcbiAgICBCYXNlX29ialdpdGhQcm9wczogICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9iaihlbnYucHMsIGVudi5sZW5pZW50KTsgfSxcblxuICAgIFByb3BzOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBQcm9wc19iYXNlOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBbZW52LnBdOyB9LFxuICAgIFByb3BzX3JlYzogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIFtlbnYucF0uY29uY2F0KGVudi5wcyk7IH0sXG4gICAgUHJvcDogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4ge25hbWU6IGVudi5uLCBwYXR0ZXJuOiBlbnYucH07IH0sXG5cbiAgICBSdWxlOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgUnVsZV9kZWZpbmU6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52LmQ7ICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZGVmaW5lKGVudi5uLCBlbnYuYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgUnVsZV9vdmVycmlkZTogICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW52LmQ7ICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIub3ZlcnJpZGUoZW52Lm4sIGVudi5iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBSdWxlX2V4dGVuZDogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYubjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYuZDsgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5leHRlbmQoZW52Lm4sIGVudi5iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgIFN1cGVyR3JhbW1hcjogICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgYnVpbGRlci5zZXRTdXBlckdyYW1tYXIoZW52LnZhbHVlKTsgfSxcbiAgICBTdXBlckdyYW1tYXJfcXVhbGlmaWVkOiAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiB0aGlzTW9kdWxlLm5hbWVzcGFjZShlbnYubnMpLmdldEdyYW1tYXIoZW52Lm4pOyB9LFxuICAgIFN1cGVyR3JhbW1hcl91bnF1YWxpZmllZDogICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0TmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0TmFtZXNwYWNlLmdldEdyYW1tYXIoZW52Lm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRHcmFtbWFyKGVudi5uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICBHcmFtbWFyOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5zZXROYW1lKGVudi5uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYuczsgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYucnM7ICAvLyBmb3JjZSBldmFsdWF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYnVpbGQob3B0TmFtZXNwYWNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBHcmFtbWFyczogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCB3aGF0SXRJcywgb3B0TmFtZXNwYWNlKSB7XG4gIHRyeSB7XG4gICAgdmFyIHRodW5rID0gdGhpc01vZHVsZS5fb2htR3JhbW1hci5tYXRjaENvbnRlbnRzKHNvdXJjZSwgd2hhdEl0SXMsIHRydWUpO1xuICAgIHJldHVybiB0aHVuayhtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZSBpbnN0YW5jZW9mIGVycm9ycy5NYXRjaEZhaWx1cmUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdcXG4nICsgZS5nZXRNZXNzYWdlKCkpO1xuICAgIH1cbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VHcmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFyJywgb3B0TmFtZXNwYWNlKTtcbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHJldHVybiBjb21waWxlQW5kTG9hZChzb3VyY2UsICdHcmFtbWFycycsIG9wdE5hbWVzcGFjZSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5cbnZhciBuYW1lc3BhY2VzID0ge307XG5leHBvcnRzLm5hbWVzcGFjZSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgaWYgKG5hbWVzcGFjZXNbbmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgIG5hbWVzcGFjZXNbbmFtZV0gPSBuZXcgTmFtZXNwYWNlKG5hbWUpO1xuICB9XG4gIHJldHVybiBuYW1lc3BhY2VzW25hbWVdO1xufTtcblxuZXhwb3J0cy5tYWtlID0gZnVuY3Rpb24ocmVjaXBlKSB7XG4gIHJldHVybiByZWNpcGUodGhpc01vZHVsZSk7XG59O1xuXG5leHBvcnRzLm1ha2VHcmFtbWFyID0gbWFrZUdyYW1tYXI7XG5leHBvcnRzLm1ha2VHcmFtbWFycyA9IG1ha2VHcmFtbWFycztcblxuLy8gU3R1ZmYgdGhhdCdzIG9ubHkgaGVyZSBmb3IgYm9vdHN0cmFwcGluZywgdGVzdGluZywgZXRjLlxuXG5leHBvcnRzLl9idWlsZGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQnVpbGRlcigpO1xufTtcblxuZXhwb3J0cy5fbWFrZUdyYW1tYXJBY3Rpb25EaWN0ID0gbWFrZUdyYW1tYXJBY3Rpb25EaWN0O1xuXG52YXIgb2htR3JhbW1hcjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX29obUdyYW1tYXInLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFvaG1HcmFtbWFyKSB7XG4gICAgICBvaG1HcmFtbWFyID0gdGhpcy5fb2htR3JhbW1hckZhY3RvcnkodGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBvaG1HcmFtbWFyO1xuICB9XG59KTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLmVuZC5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbigpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgdmFyIGFucyA9IGZhbHNlO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XTtcbiAgICBhbnMgfD0gdGVybS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG4gIH1cbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgdmFyIGFucyA9IGZhbHNlO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XTtcbiAgICBhbnMgfD0gZmFjdG9yLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCBmYWxzZSk7XG4gIH1cbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHRydWUpO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCBmYWxzZSk7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCBmYWxzZSk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCBmYWxzZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIGZhbHNlKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICBpZiAoIXZhbHVlUmVxdWlyZWQgfHwgZGljdFt0aGlzLnJ1bGVOYW1lXSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZGljdFt0aGlzLnJ1bGVOYW1lXSA9IHRydWU7XG4gIH1cbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgZXF1YWxzID0gYXdsaWIuZXF1YWxzLmVxdWFscztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbmFtZXMgPSB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XTtcbiAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKCk7XG4gICAgdmFyIG90aGVyTmFtZXMgPSB0ZXJtLmdldEJpbmRpbmdOYW1lcygpO1xuICAgIGlmICghZXF1YWxzKG5hbWVzLCBvdGhlck5hbWVzKSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5JbmNvbnNpc3RlbnRCaW5kaW5ncyhydWxlTmFtZSwgbmFtZXMsIG90aGVyTmFtZXMpO1xuICAgIH1cbiAgfVxufTtcblxucGV4cHJzLkV4dGVuZEFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBPbmx5IGhhcyB0d28gdGVybXMsIHRoZSBzZWNvbmQgb2Ygd2hpY2ggaGFzIHRoZSBleHBlY3RlZCBiaW5kaW5ncy5cbiAgdmFyIG5hbWVzID0gdGhpcy50ZXJtc1sxXS5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgdmFyIG90aGVyTmFtZXMgPSB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpO1xuICBpZiAoIWVxdWFscyhuYW1lcywgb3RoZXJOYW1lcykpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkluY29uc2lzdGVudEJpbmRpbmdzKHJ1bGVOYW1lLCBuYW1lcywgb3RoZXJOYW1lcyk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuZW5kLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cblxuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpO1xuICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSwgZHVwbGljYXRlcyk7XG4gIH1cbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG5cbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUsIGR1cGxpY2F0ZXMpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGFzc2VydE5vQmluZGluZ3MocnVsZU5hbWUsIGV4cHIpIHtcbiAgdmFyIGJpbmRpbmdzID0gZXhwci5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSwgYmluZGluZ3MpO1xuICB9XG59XG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuZW5kLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICBhc3NlcnROb0JpbmRpbmdzKHJ1bGVOYW1lLCB0aGlzLmV4cHIpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICBhc3NlcnROb0JpbmRpbmdzKHJ1bGVOYW1lLCB0aGlzLmV4cHIpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICBhc3NlcnROb0JpbmRpbmdzKHJ1bGVOYW1lLCB0aGlzLmV4cHIpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcbnZhciB0aHVua3MgPSByZXF1aXJlKCcuL3RodW5rcy5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgc2tpcFNwYWNlcyA9IHJlcXVpcmUoJy4vc2tpcFNwYWNlcy5qcycpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbS5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgaWYgKHJlY29yZEZhaWx1cmVzKSB7XG4gICAgICBpbnB1dFN0cmVhbS5yZWNvcmRGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyB0aHVua3MuVmFsdWVUaHVuayh2YWx1ZSk7XG4gIH1cbn07XG5cbnBleHBycy5lbmQuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICBpZiAoaW5wdXRTdHJlYW0uYXRFbmQoKSkge1xuICAgIHJldHVybiB0aHVua3MudW5kZWZpbmVkVGh1bms7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHJlY29yZEZhaWx1cmVzKSB7XG4gICAgICBpbnB1dFN0cmVhbS5yZWNvcmRGYWlsdXJlKGlucHV0U3RyZWFtLnBvcywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpIHtcbiAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gIH1cbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmICh0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICBpZiAocmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgIGlucHV0U3RyZWFtLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IHRodW5rcy5WYWx1ZVRodW5rKHRoaXMub2JqKTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuU3RyaW5nUHJpbS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopO1xufTtcblxucGV4cHJzLlJlZ0V4cFByaW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpIHtcbiAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gIH1cbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmIChpbnB1dFN0cmVhbS5tYXRjaFJlZ0V4cCh0aGlzLm9iaikgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgaWYgKHJlY29yZEZhaWx1cmVzKSB7XG4gICAgICBpbnB1dFN0cmVhbS5yZWNvcmRGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyB0aHVua3MuVmFsdWVUaHVuayhpbnB1dFN0cmVhbS5zb3VyY2Vbb3JpZ1Bvc10pO1xuICB9XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9yaWdOdW1CaW5kaW5ncyA9IGJpbmRpbmdzLmxlbmd0aDtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKHN5bnRhY3RpYykge1xuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgIH1cbiAgICB2YXIgdmFsdWUgPSB0aGlzLnRlcm1zW2lkeF0uZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICAvLyBOb3RlOiB3aGlsZSB0aGUgZm9sbG93aW5nIGFzc2lnbm1lbnQgY291bGQgYmUgZG9uZSB1bmNvbmRpdGlvbmFsbHksIG9ubHkgZG9pbmcgaXQgd2hlbiBuZWNlc3NhcnkgaXNcbiAgICAgIC8vIGJldHRlciBmb3IgcGVyZm9ybWFuY2UuIFRoaXMgaXMgYi9jIGFzc2lnbmluZyB0byBhbiBhcnJheSdzIGxlbmd0aCBwcm9wZXJ0eSBpcyBtb3JlIGV4cGVuc2l2ZSB0aGFuIGFcbiAgICAgIC8vIHR5cGljYWwgYXNzaWdubWVudC5cbiAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPiBvcmlnTnVtQmluZGluZ3MpIHtcbiAgICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29tbW9uLmZhaWw7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChzeW50YWN0aWMpIHtcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgICB9XG4gICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdO1xuICAgIHZhciB2YWx1ZSA9IGZhY3Rvci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICAgIGlmICh2YWx1ZSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRodW5rcy51bmRlZmluZWRUaHVuaztcbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIGJpbmRpbmdzLnB1c2godGhpcy5uYW1lLCB2YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBudW1NYXRjaGVzID0gMDtcbiAgdmFyIG1hdGNoZXMgPSB0aGlzLmV4cHIucHJvZHVjZXNWYWx1ZSgpID8gW10gOiB1bmRlZmluZWQ7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgdmFyIGJhY2t0cmFja1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKTtcbiAgICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBiYWNrdHJhY2tQb3M7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2Uge1xuICAgICAgbnVtTWF0Y2hlcysrO1xuICAgICAgaWYgKG1hdGNoZXMpIHtcbiAgICAgICAgbWF0Y2hlcy5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKG51bU1hdGNoZXMgPCB0aGlzLm1pbk51bU1hdGNoZXMpIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG1hdGNoZXMgPyBuZXcgdGh1bmtzLkxpc3RUaHVuayhtYXRjaGVzKSA6IHRodW5rcy51bmRlZmluZWRUaHVuaztcbiAgfVxufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByZXR1cm4gdGh1bmtzLnVuZGVmaW5lZFRodW5rO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmV4cHIucHJvZHVjZXNWYWx1ZSgpID8gdmFsdWUgOiB0aHVua3MudHJ1ZVRodW5rO1xuICB9XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoZmFsc2UsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSk7XG4gIGlmICh2YWx1ZSAhPT0gY29tbW9uLmZhaWwpIHtcbiAgICBpZiAocmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgIGlucHV0U3RyZWFtLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0aHVua3MudW5kZWZpbmVkVGh1bms7XG4gIH1cbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKTtcbiAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgc3RyaW5nID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc3RyaW5nSW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Ioc3RyaW5nKTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgc3RyaW5nSW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgICByZXR1cm4gdmFsdWUgIT09IGNvbW1vbi5mYWlsICYmIHN0cmluZ0lucHV0U3RyZWFtLmF0RW5kKCkgPyAgbmV3IHRodW5rcy5WYWx1ZVRodW5rKHN0cmluZykgOiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH1cbn07XG5cbnBleHBycy5MaXN0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKSB7XG4gICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICB9XG4gIHZhciBsaXN0ID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAobGlzdCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgdmFyIGxpc3RJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihsaXN0KTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgbGlzdElucHV0U3RyZWFtLCBiaW5kaW5ncyk7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBjb21tb24uZmFpbCAmJiBsaXN0SW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgdGh1bmtzLlZhbHVlVGh1bmsobGlzdCkgOiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH1cbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpIHtcbiAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gIH1cbiAgdmFyIG9iaiA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKG9iaiAhPT0gY29tbW9uLmZhaWwgJiYgb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSkge1xuICAgIHZhciBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9IDA7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1tpZHhdO1xuICAgICAgdmFyIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdO1xuICAgICAgdmFyIHZhbHVlSW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3IoW3ZhbHVlXSk7XG4gICAgICB2YXIgbWF0Y2hlZCA9XG4gICAgICAgICAgcHJvcGVydHkucGF0dGVybi5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCB2YWx1ZUlucHV0U3RyZWFtLCBiaW5kaW5ncykgIT09IGNvbW1vbi5mYWlsICYmXG4gICAgICAgICAgdmFsdWVJbnB1dFN0cmVhbS5hdEVuZCgpO1xuICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkubmFtZSkpIHtcbiAgICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXNMZW5pZW50IHx8IG51bU93blByb3BlcnRpZXNNYXRjaGVkID09PSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA/XG4gICAgICAgIG5ldyB0aHVua3MuVmFsdWVUaHVuayhvYmopIDpcbiAgICAgICAgY29tbW9uLmZhaWw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWU7XG4gIHZhciBvcmlnUG9zSW5mbyA9IGlucHV0U3RyZWFtLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gIHZhciBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV07XG4gIGlmIChtZW1vUmVjICYmIG9yaWdQb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gbWVtb1JlYy5wb3M7XG4gICAgcmV0dXJuIG1lbW9SZWMudmFsdWU7XG4gIH0gZWxzZSBpZiAob3JpZ1Bvc0luZm8uaXNBY3RpdmUocnVsZU5hbWUpKSB7XG4gICAgdmFyIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgaWYgKGN1cnJlbnRMUiAmJiBjdXJyZW50TFIubmFtZSA9PT0gcnVsZU5hbWUpIHtcbiAgICAgIG9yaWdQb3NJbmZvLnVwZGF0ZUludm9sdmVkUnVsZXMoKTtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMUi5wb3M7XG4gICAgICByZXR1cm4gY3VycmVudExSLnZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnUG9zSW5mby5zdGFydExlZnRSZWN1cnNpb24ocnVsZU5hbWUpO1xuICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgYm9keSA9IHJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUpO1xuICAgIH1cbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBvcmlnUG9zSW5mby5lbnRlcihydWxlTmFtZSk7XG4gICAgdmFyIHJmID0gcmVjb3JkRmFpbHVyZXMgJiYgIWJvZHkuZGVzY3JpcHRpb247XG4gICAgdmFyIHJ1bGVJc1N5bnRhY3RpYyA9IGNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSk7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCByZiwgcnVsZUlzU3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpO1xuICAgIGlmIChjdXJyZW50TFIpIHtcbiAgICAgIGlmIChjdXJyZW50TFIubmFtZSA9PT0gcnVsZU5hbWUpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmhhbmRsZUxlZnRSZWN1cnNpb24oYm9keSwgcmYsIHJ1bGVJc1N5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zLCBjdXJyZW50TFIsIHZhbHVlKTtcbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPVxuICAgICAgICAgIHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlLCBpbnZvbHZlZFJ1bGVzOiBjdXJyZW50TFIuaW52b2x2ZWRSdWxlc307XG4gICAgICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24ocnVsZU5hbWUpO1xuICAgICAgfSBlbHNlIGlmICghY3VycmVudExSLmludm9sdmVkUnVsZXNbcnVsZU5hbWVdKSB7XG4gICAgICAgIC8vIE9ubHkgbWVtb2l6ZSBpZiB0aGlzIHJ1bGUgaXMgbm90IGludm9sdmVkIGluIHRoZSBjdXJyZW50IGxlZnQgcmVjdXJzaW9uXG4gICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID0ge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWV9O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICB9XG4gICAgb3JpZ1Bvc0luZm8uZXhpdChydWxlTmFtZSk7XG4gICAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbCAmJiByZWNvcmRGYWlsdXJlcyAmJiBib2R5LmRlc2NyaXB0aW9uKSB7XG4gICAgICB2YXIgZXJyb3JQb3M7XG4gICAgICBpZiAoYm9keS5kZXNjcmlwdGlvbiAmJiBydWxlSXNTeW50YWN0aWMpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgICAgICBlcnJvclBvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yUG9zID0gb3JpZ1BvcztcbiAgICAgIH1cbiAgICAgIGlucHV0U3RyZWFtLnJlY29yZEZhaWx1cmUoZXJyb3JQb3MsIHRoaXMpO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCByZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0pIHtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBiaW5kaW5ncyA9IFtdO1xuICB2YXIgdmFsdWUgPSBleHByLmV2YWwocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncyk7XG4gIGlmICh2YWx1ZSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyB0aHVua3MuUnVsZVRodW5rKHRoaXMucnVsZU5hbWUsIGlucHV0U3RyZWFtLnNvdXJjZSwgb3JpZ1BvcywgaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZSwgYmluZGluZ3MpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUxlZnRSZWN1cnNpb24gPSBmdW5jdGlvbihib2R5LCByZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3MsIGN1cnJlbnRMUiwgc2VlZFZhbHVlKSB7XG4gIHZhciB2YWx1ZSA9IHNlZWRWYWx1ZTtcbiAgaWYgKHNlZWRWYWx1ZSAhPT0gY29tbW9uLmZhaWwpIHtcbiAgICBjdXJyZW50TFIudmFsdWUgPSBzZWVkVmFsdWU7XG4gICAgY3VycmVudExSLnBvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCByZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgICAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbCAmJiBpbnB1dFN0cmVhbS5wb3MgPiBjdXJyZW50TFIucG9zKSB7XG4gICAgICAgIGN1cnJlbnRMUi52YWx1ZSA9IHZhbHVlO1xuICAgICAgICBjdXJyZW50TFIucG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBjdXJyZW50TFIudmFsdWU7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGN1cnJlbnRMUi5wb3M7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW107XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBiaW5kaW5ncyAtLSB0aGlzIHByb3BlcnR5IGlzIGNoZWNrZWQgYnkgdGhlIEdyYW1tYXIgY29uc3RydWN0b3IuXG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IFtdIDogdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZXMgPSBbXTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLmZhY3RvcnNbaWR4XS5nZXRCaW5kaW5nTmFtZXMoKSk7XG4gIH1cbiAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFt0aGlzLm5hbWVdO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKCk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKTtcbn07XG5cbnBleHBycy5MaXN0LnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZXMgPSBbXTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBuYW1lcyA9IG5hbWVzLmNvbmNhdCh0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmdldEJpbmRpbmdOYW1lcygpKTtcbiAgfVxuICByZXR1cm4gbmFtZXMuc29ydCgpO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgcHJpbnRTdHJpbmcgPSBhd2xpYi5zdHJpbmdVdGlscy5wcmludFN0cmluZztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5lbmQub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLnByaW0oJyk7XG4gIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5vYmopKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5hbHQoJyk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcsICcpO1xuICAgIH1cbiAgICB0aGlzLnRlcm1zW2lkeF0ub3V0cHV0UmVjaXBlKHdzKTtcbiAgfVxuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLnNlcSgnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKTtcbiAgICB9XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0ub3V0cHV0UmVjaXBlKHdzKTtcbiAgfVxuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuQmluZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5iaW5kKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnLCAnKTtcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLm5hbWUpKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IubWFueSgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJywgJyk7XG4gIHdzLm5leHRQdXRBbGwodGhpcy5taW5OdW1NYXRjaGVzKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5vcHQoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLm5vdCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IubGEoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLnN0cignKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5MaXN0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLmxzdCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIGZ1bmN0aW9uIG91dHB1dFByb3BlcnR5UmVjaXBlKHByb3ApIHtcbiAgICB3cy5uZXh0UHV0QWxsKCd7bmFtZTogJyk7XG4gICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyhwcm9wLm5hbWUpKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcsIHBhdHRlcm46ICcpO1xuICAgIHByb3AucGF0dGVybi5vdXRwdXRSZWNpcGUod3MpO1xuICAgIHdzLm5leHRQdXRBbGwoJ30nKTtcbiAgfVxuXG4gIHdzLm5leHRQdXRBbGwoJ2Iub2JqKFsnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKTtcbiAgICB9XG4gICAgb3V0cHV0UHJvcGVydHlSZWNpcGUodGhpcy5wcm9wZXJ0aWVzW2lkeF0pO1xuICB9XG4gIHdzLm5leHRQdXRBbGwoJ10sICcpO1xuICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKCEhdGhpcy5pc0xlbmllbnQpKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLmFwcCgnKTtcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLnJ1bGVOYW1lKSk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUucHJvZHVjZXNWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnByb2R1Y2VzVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKCF0aGlzLnRlcm1zW2lkeF0ucHJvZHVjZXNWYWx1ZSgpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIucHJvZHVjZXNWYWx1ZSgpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUucHJvZHVjZXNWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBwcmludFN0cmluZyA9IGF3bGliLnN0cmluZ1V0aWxzLnByaW50U3RyaW5nO1xudmFyIG1ha2VTdHJpbmdCdWZmZXIgPSBhd2xpYi5vYmplY3RVdGlscy5zdHJpbmdCdWZmZXI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gdW5kZWZpbmVkO1xufTtcblxucGV4cHJzLmFueXRoaW5nLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gXCJhbnkgb2JqZWN0XCI7XG59O1xuXG5wZXhwcnMuZW5kLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gXCJlbmQgb2YgaW5wdXRcIjtcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgcmV0dXJuIHByaW50U3RyaW5nKHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gXCJubyBcIiArIHRoaXMuZXhwci50b0V4cGVjdGVkKCk7XG59O1xuXG4vLyBUT0RPOiB0aGluayBhYm91dCBTdHIsIExpc3QsIGFuZCBPYmpcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0V4cGVjdGVkID0gZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgdmFyIGRlc2NyaXB0aW9uID0gcnVsZURpY3RbdGhpcy5ydWxlTmFtZV0uZGVzY3JpcHRpb247XG4gIGlmIChkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBkZXNjcmlwdGlvbjtcbiAgfSBlbHNlIHtcbiAgICB2YXIgYXJ0aWNsZSA9IC9eW2FlaW91QUVJT1VdLy50ZXN0KHRoaXMucnVsZU5hbWUpID8gXCJhblwiIDogXCJhXCI7XG4gICAgcmV0dXJuIGFydGljbGUgKyBcIiBcIiArIHRoaXMucnVsZU5hbWU7XG4gIH1cbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdlbmVyYWwgc3R1ZmZcblxuZnVuY3Rpb24gUEV4cHIoKSB7XG4gIHRocm93ICdQRXhwciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCc7XG59XG5cbi8vIEFueXRoaW5nXG5cbnZhciBhbnl0aGluZyA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBFbmRcblxudmFyIGVuZCA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBQcmltaXRpdmVzXG5cbmZ1bmN0aW9uIFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuXG5QcmltLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBTdHJpbmdQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9iajtcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBSZWdFeHBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9iajtcbn1cblxuUmVnRXhwUHJpbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUpO1xuXG4vLyBBbHRlcm5hdGlvblxuXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgdGhpcy50ZXJtcyA9IHRlcm1zO1xufVxuXG5BbHQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEV4dGVuZEFsdCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gRXh0ZW5kQWx0KGV4dGVuc2lvbnMsIGJhc2UpIHtcbiAgdGhpcy50ZXJtcyA9IFtleHRlbnNpb25zLCBiYXNlXTtcbn1cblxuRXh0ZW5kQWx0LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhBbHQucHJvdG90eXBlKTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5cblNlcS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gQmluZGluZ3NcblxuZnVuY3Rpb24gQmluZChleHByLCBuYW1lKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG59XG5cbkJpbmQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykge1xuICB0aGlzLmV4cHIgPSBleHByO1xuICB0aGlzLm1pbk51bU1hdGNoZXMgPSBtaW5OdW1NYXRjaGVzO1xufVxuXG5NYW55LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5PcHQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFByZWRpY2F0ZXNcblxuZnVuY3Rpb24gTm90KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cblxuTm90LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5Mb29rYWhlYWQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5cblN0ci5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gTGlzdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIExpc3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5MaXN0LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBPYmplY3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBPYmoocHJvcGVydGllcywgaXNMZW5pZW50KSB7XG4gIHZhciBuYW1lcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5KSB7IHJldHVybiBwcm9wZXJ0eS5uYW1lOyB9KTtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhuYW1lcyk7XG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVByb3BlcnR5TmFtZXMoZHVwbGljYXRlcyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB0aGlzLmlzTGVuaWVudCA9IGlzTGVuaWVudDtcbiAgfVxufVxuXG5PYmoucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFJ1bGUgYXBwbGljYXRpb25cblxuZnVuY3Rpb24gQXBwbHkocnVsZU5hbWUpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xufVxuXG5BcHBseS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMubWFrZVByaW0gPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnICYmIG9iai5sZW5ndGggIT09IDEpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ1ByaW0ob2JqKTtcbiAgfVxuICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cFByaW0ob2JqKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFByaW0ob2JqKTtcbiAgfVxufTtcblxuZXhwb3J0cy5QRXhwciA9IFBFeHByO1xuZXhwb3J0cy5hbnl0aGluZyA9IGFueXRoaW5nO1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlByaW0gPSBQcmltO1xuZXhwb3J0cy5TdHJpbmdQcmltID0gU3RyaW5nUHJpbTtcbmV4cG9ydHMuUmVnRXhwUHJpbSA9IFJlZ0V4cFByaW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kQWx0ID0gRXh0ZW5kQWx0O1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkJpbmQgPSBCaW5kO1xuZXhwb3J0cy5NYW55ID0gTWFueTtcbmV4cG9ydHMuT3B0ID0gT3B0O1xuZXhwb3J0cy5Ob3QgPSBOb3Q7XG5leHBvcnRzLkxvb2thaGVhZCA9IExvb2thaGVhZDtcbmV4cG9ydHMuU3RyID0gU3RyO1xuZXhwb3J0cy5MaXN0ID0gTGlzdDtcbmV4cG9ydHMuT2JqID0gT2JqO1xuZXhwb3J0cy5BcHBseSA9IEFwcGx5O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXh0ZW5zaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi9wZXhwcnMtYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnROb1VzZWxlc3NCaW5kaW5ncy5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MuanMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdldEJpbmRpbmdOYW1lcy5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbC5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1wcm9kdWNlc1ZhbHVlLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0V4cGVjdGVkLmpzJyk7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAocnVsZURpY3Quc3BhY2UuZXZhbChmYWxzZSwgZmFsc2UsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pID09PSBjb21tb24uZmFpbCkge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBza2lwU3BhY2VzO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbC5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyXG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gVGh1bmsoKSB7XG4gIHRocm93ICdUaHVuayBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCc7XG59XG5cbnZhciBuZXh0VGh1bmtJZCA9IDA7XG5UaHVuay5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaWQgPSBuZXh0VGh1bmtJZCsrO1xuICB9XG59O1xuXG5mdW5jdGlvbiBSdWxlVGh1bmsocnVsZU5hbWUsIHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCwgdmFsdWUsIGJpbmRpbmdzKSB7XG4gIHRoaXMuaW5pdCgpO1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHg7XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4O1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbn1cblxuUnVsZVRodW5rLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAoIW1lbW8uaGFzT3duUHJvcGVydHkodGhpcy5pZCkpIHtcbiAgICAgIHZhciBhY3Rpb24gPSB0aGlzLmxvb2t1cEFjdGlvbihhY3Rpb25EaWN0KTtcbiAgICAgIHZhciBhZGRsSW5mbyA9IHRoaXMuY3JlYXRlQWRkbEluZm8oKTtcbiAgICAgIHZhciBlbnYgPSB0aGlzLm1ha2VFbnYoYWN0aW9uRGljdCwgbWVtbyk7XG4gICAgICBtZW1vW3RoaXMuaWRdID0gYWN0aW9uLmNhbGwoYWRkbEluZm8sIGVudik7XG4gICAgfVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdO1xuICB9LFxuXG4gIGxvb2t1cEFjdGlvbjogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWU7XG4gICAgdmFyIGFjdGlvbiA9IGFjdGlvbkRpY3RbcnVsZU5hbWVdO1xuICAgIGlmIChhY3Rpb24gPT09IHVuZGVmaW5lZCAmJiBhY3Rpb25EaWN0Ll9kZWZhdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFjdGlvbiA9IGZ1bmN0aW9uKGVudikge1xuICAgICAgICByZXR1cm4gYWN0aW9uRGljdC5fZGVmYXVsdC5jYWxsKHRoaXMsIHJ1bGVOYW1lLCBlbnYpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGFjdGlvbiB8fCBicm93c2VyLmVycm9yKCdtaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3InLCBydWxlTmFtZSk7XG4gIH0sXG5cbiAgY3JlYXRlQWRkbEluZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcnZhbDogbmV3IEludGVydmFsKHRoaXMuc291cmNlLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeClcbiAgICB9O1xuICB9LFxuXG4gIG1ha2VFbnY6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICB2YXIgYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmxlbmd0aCA9PT0gMCA/IFsndmFsdWUnLCB0aGlzLnZhbHVlXSA6IHRoaXMuYmluZGluZ3M7XG4gICAgdmFyIGVudiA9IHt9O1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJpbmRpbmdzLmxlbmd0aDsgaWR4ICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gYmluZGluZ3NbaWR4XTtcbiAgICAgIHZhciB0aHVuayA9IGJpbmRpbmdzW2lkeCArIDFdO1xuICAgICAgdGhpcy5hZGRCaW5kaW5nKGVudiwgbmFtZSwgdGh1bmssIGFjdGlvbkRpY3QsIG1lbW8pO1xuICAgIH1cbiAgICByZXR1cm4gZW52O1xuICB9LFxuXG4gIGFkZEJpbmRpbmc6IGZ1bmN0aW9uKGVudiwgbmFtZSwgdmFsdWUsIGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW52LCBuYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBUaHVuaykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUuZm9yY2UoYWN0aW9uRGljdCwgbWVtbyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIExpc3RUaHVuayh0aHVua3MpIHtcbiAgdGhpcy5pbml0KCk7XG4gIHRoaXMudGh1bmtzID0gdGh1bmtzO1xufVxuXG5MaXN0VGh1bmsucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIGlmICghbWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSkge1xuICAgICAgbWVtb1t0aGlzLmlkXSA9IHRoaXMudGh1bmtzLm1hcChmdW5jdGlvbih0aHVuaykgeyByZXR1cm4gdGh1bmsuZm9yY2UoYWN0aW9uRGljdCwgbWVtbyk7IH0pO1xuICAgIH1cbiAgICByZXR1cm4gbWVtb1t0aGlzLmlkXTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIFZhbHVlVGh1bmsodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xufVxuXG5WYWx1ZVRodW5rLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlJ1bGVUaHVuayA9IFJ1bGVUaHVuaztcbmV4cG9ydHMuTGlzdFRodW5rID0gTGlzdFRodW5rO1xuZXhwb3J0cy5WYWx1ZVRodW5rID0gVmFsdWVUaHVuaztcbmV4cG9ydHMudW5kZWZpbmVkVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh1bmRlZmluZWQpO1xuZXhwb3J0cy50cnVlVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh0cnVlKTtcblxuIl19
(16)
});
