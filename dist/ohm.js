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
  b.inline('Term_inline', b.seq(b.bind(b.app('Seq'), 'x'), b.bind(b.app('caseName'), 'n')));
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
  b.setRuleDescription(undefined); b.define('caseName', b.seq(b.prim('--'), b.many(b.seq(b.not(b.prim('\n')), b.app('space')), 0), b.bind(b.app('name'), 'n'), b.many(b.seq(b.not(b.prim('\n')), b.app('space')), 0), b.alt(b.prim('\n'), b.la(b.prim('}')))));
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

    caseName:                   function(env) { return env.n },

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9kaXN0L29obS1ncmFtbWFyLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL2F3bGliLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL2Jyb3dzZXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvZXF1YWxzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL29iamVjdFV0aWxzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9ub2RlX21vZHVsZXMvYXdsaWIvc3JjL3N0cmluZ1V0aWxzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvQnVpbGRlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL0dyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9JbnB1dFN0cmVhbS5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL0ludGVydmFsLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvTmFtZXNwYWNlLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvUG9zSW5mby5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL2NvbW1vbi5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL2RlY2xzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvZXJyb3JzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24uanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1hc3NlcnROb1VzZWxlc3NCaW5kaW5ncy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1ldmFsLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWdldEJpbmRpbmdOYW1lcy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtcHJvZHVjZXNWYWx1ZS5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy10b0V4cGVjdGVkLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvc2tpcFNwYWNlcy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3RodW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDck1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4vc3JjL21haW4uanMnKTtcbm9obS5fb2htR3JhbW1hckZhY3RvcnkgPVxuKGZ1bmN0aW9uKG9obSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBiID0gb2htLl9idWlsZGVyKCk7XG4gIGIuc2V0TmFtZSgnT2htJyk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdHcmFtbWFycycsIGIubWFueShiLmFwcCgnR3JhbW1hcicpLCAwKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdHcmFtbWFyJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdpZGVudCcpLCAnbicpLCBiLmJpbmQoYi5vcHQoYi5hcHAoJ1N1cGVyR3JhbW1hcicpKSwgJ3MnKSwgYi5wcmltKCd7JyksIGIuYmluZChiLm1hbnkoYi5hcHAoJ1J1bGUnKSwgMCksICdycycpLCBiLnByaW0oJ30nKSkpO1xuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyX3F1YWxpZmllZCcsIGIuc2VxKGIucHJpbSgnPDonKSwgYi5iaW5kKGIuYXBwKCdpZGVudCcpLCAnbnMnKSwgYi5wcmltKCcuJyksIGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ24nKSkpO1xuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyX3VucXVhbGlmaWVkJywgYi5zZXEoYi5wcmltKCc8OicpLCBiLmJpbmQoYi5hcHAoJ2lkZW50JyksICduJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ1N1cGVyR3JhbW1hcicsIGIuYWx0KGIuYXBwKCdTdXBlckdyYW1tYXJfcXVhbGlmaWVkJyksIGIuYXBwKCdTdXBlckdyYW1tYXJfdW5xdWFsaWZpZWQnKSkpO1xuICBiLmlubGluZSgnUnVsZV9kZWZpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ2lkZW50JyksICduJyksIGIuYmluZChiLm9wdChiLmFwcCgncnVsZURlc2NyJykpLCAnZCcpLCBiLnByaW0oJz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpO1xuICBiLmlubGluZSgnUnVsZV9vdmVycmlkZScsIGIuc2VxKGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ24nKSwgYi5wcmltKCc6PScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSk7XG4gIGIuaW5saW5lKCdSdWxlX2V4dGVuZCcsIGIuc2VxKGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ24nKSwgYi5wcmltKCcrPScpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAnYicpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdSdWxlJywgYi5hbHQoYi5hcHAoJ1J1bGVfZGVmaW5lJyksIGIuYXBwKCdSdWxlX292ZXJyaWRlJyksIGIuYXBwKCdSdWxlX2V4dGVuZCcpKSk7XG4gIGIuaW5saW5lKCdBbHRfcmVjJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdUZXJtJyksICd4JyksIGIucHJpbSgnfCcpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneScpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdBbHQnLCBiLmFsdChiLmFwcCgnQWx0X3JlYycpLCBiLmFwcCgnVGVybScpKSk7XG4gIGIuaW5saW5lKCdUZXJtX2lubGluZScsIGIuc2VxKGIuYmluZChiLmFwcCgnU2VxJyksICd4JyksIGIuYmluZChiLmFwcCgnY2FzZU5hbWUnKSwgJ24nKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgnVGVybScsIGIuYWx0KGIuYXBwKCdUZXJtX2lubGluZScpLCBiLmFwcCgnU2VxJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ1NlcScsIGIubWFueShiLmFwcCgnRmFjdG9yJyksIDApKTtcbiAgYi5pbmxpbmUoJ0ZhY3Rvcl9iaW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdJdGVyJyksICd4JyksIGIucHJpbSgnOicpLCBiLmJpbmQoYi5hcHAoJ2lkZW50JyksICduJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ0ZhY3RvcicsIGIuYWx0KGIuYXBwKCdGYWN0b3JfYmluZCcpLCBiLmFwcCgnSXRlcicpKSk7XG4gIGIuaW5saW5lKCdJdGVyX3N0YXInLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5wcmltKCcqJykpKTtcbiAgYi5pbmxpbmUoJ0l0ZXJfcGx1cycsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLnByaW0oJysnKSkpO1xuICBiLmlubGluZSgnSXRlcl9vcHQnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1ByZWQnKSwgJ3gnKSwgYi5wcmltKCc/JykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ0l0ZXInLCBiLmFsdChiLmFwcCgnSXRlcl9zdGFyJyksIGIuYXBwKCdJdGVyX3BsdXMnKSwgYi5hcHAoJ0l0ZXJfb3B0JyksIGIuYXBwKCdQcmVkJykpKTtcbiAgYi5pbmxpbmUoJ1ByZWRfbm90JywgYi5zZXEoYi5wcmltKCd+JyksIGIuYmluZChiLmFwcCgnQmFzZScpLCAneCcpKSk7XG4gIGIuaW5saW5lKCdQcmVkX2xvb2thaGVhZCcsIGIuc2VxKGIucHJpbSgnJicpLCBiLmJpbmQoYi5hcHAoJ0Jhc2UnKSwgJ3gnKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgnUHJlZCcsIGIuYWx0KGIuYXBwKCdQcmVkX25vdCcpLCBiLmFwcCgnUHJlZF9sb29rYWhlYWQnKSwgYi5hcHAoJ0Jhc2UnKSkpO1xuICBiLmlubGluZSgnQmFzZV9hcHBsaWNhdGlvbicsIGIuc2VxKGIuYmluZChiLmFwcCgnaWRlbnQnKSwgJ3J1bGVOYW1lJyksIGIubm90KGIuYWx0KGIuc2VxKGIub3B0KGIuYXBwKCdydWxlRGVzY3InKSksIGIucHJpbSgnPScpKSwgYi5wcmltKCc6PScpLCBiLnByaW0oJys9JykpKSkpO1xuICBiLmlubGluZSgnQmFzZV9wcmltJywgYi5hbHQoYi5hcHAoJ2tleXdvcmQnKSwgYi5hcHAoJ3N0cmluZycpLCBiLmFwcCgncmVnRXhwJyksIGIuYXBwKCdudW1iZXInKSkpO1xuICBiLmlubGluZSgnQmFzZV9sc3QnLCBiLnNlcShiLnByaW0oJ1snKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5wcmltKCddJykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2Vfc3RyJywgYi5zZXEoYi5wcmltKCdcIicpLCBiLmJpbmQoYi5hcHAoJ0FsdCcpLCAneCcpLCBiLnByaW0oJ1wiJykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2VfcGFyZW4nLCBiLnNlcShiLnByaW0oJygnKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5wcmltKCcpJykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2Vfb2JqJywgYi5zZXEoYi5wcmltKCd7JyksIGIuYmluZChiLm9wdChiLnByaW0oJy4uLicpKSwgJ2xlbmllbnQnKSwgYi5wcmltKCd9JykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2Vfb2JqV2l0aFByb3BzJywgYi5zZXEoYi5wcmltKCd7JyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJyksIGIuYmluZChiLm9wdChiLnNlcShiLnByaW0oJywnKSwgYi5wcmltKCcuLi4nKSkpLCAnbGVuaWVudCcpLCBiLnByaW0oJ30nKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgnQmFzZScsIGIuYWx0KGIuYXBwKCdCYXNlX2FwcGxpY2F0aW9uJyksIGIuYXBwKCdCYXNlX3ByaW0nKSwgYi5hcHAoJ0Jhc2VfbHN0JyksIGIuYXBwKCdCYXNlX3N0cicpLCBiLmFwcCgnQmFzZV9wYXJlbicpLCBiLmFwcCgnQmFzZV9vYmonKSwgYi5hcHAoJ0Jhc2Vfb2JqV2l0aFByb3BzJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ1Byb3AnLCBiLnNlcShiLmJpbmQoYi5hbHQoYi5hcHAoJ25hbWUnKSwgYi5hcHAoJ3N0cmluZycpKSwgJ24nKSwgYi5wcmltKCc6JyksIGIuYmluZChiLmFwcCgnQmFzZScpLCAncCcpKSk7XG4gIGIuaW5saW5lKCdQcm9wc19yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSwgYi5wcmltKCcsJyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJykpKTtcbiAgYi5pbmxpbmUoJ1Byb3BzX2Jhc2UnLCBiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdQcm9wcycsIGIuYWx0KGIuYXBwKCdQcm9wc19yZWMnKSwgYi5hcHAoJ1Byb3BzX2Jhc2UnKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbignIHJ1bGUgZGVzY3JpcHRpb24gZm9yIHVzZSBpbiBlcnJvciBtZXNzYWdlcycpOyBiLmRlZmluZSgncnVsZURlc2NyJywgYi5zZXEoYi5wcmltKCctLScpLCBiLmJpbmQoYi5hcHAoJ3J1bGVEZXNjclRleHQnKSwgJ3QnKSwgYi5wcmltKCdcXG4nKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbih1bmRlZmluZWQpOyBiLmRlZmluZSgncnVsZURlc2NyVGV4dCcsIGIubWFueShiLnNlcShiLm5vdChiLnByaW0oJ1xcbicpKSwgYi5hcHAoJ18nKSksIDApKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ2Nhc2VOYW1lJywgYi5zZXEoYi5wcmltKCctLScpLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5wcmltKCdcXG4nKSksIGIuYXBwKCdzcGFjZScpKSwgMCksIGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpLCBiLm1hbnkoYi5zZXEoYi5ub3QoYi5wcmltKCdcXG4nKSksIGIuYXBwKCdzcGFjZScpKSwgMCksIGIuYWx0KGIucHJpbSgnXFxuJyksIGIubGEoYi5wcmltKCd9JykpKSkpO1xuICBiLmlubGluZSgnc3BhY2Vfc2luZ2xlTGluZScsIGIuc2VxKGIucHJpbSgnLy8nKSwgYi5tYW55KGIuc2VxKGIubm90KGIucHJpbSgnXFxuJykpLCBiLmFwcCgnXycpKSwgMCksIGIucHJpbSgnXFxuJykpKTtcbiAgYi5pbmxpbmUoJ3NwYWNlX211bHRpTGluZScsIGIuc2VxKGIucHJpbSgnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIucHJpbSgnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5wcmltKCcqLycpKSk7XG4gIGIuZXh0ZW5kKCdzcGFjZScsIGIuYWx0KGIuYXBwKCdzcGFjZV9zaW5nbGVMaW5lJyksIGIuYXBwKCdzcGFjZV9tdWx0aUxpbmUnKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbignIG5hbWUnKTsgYi5kZWZpbmUoJ25hbWUnLCBiLnNlcShiLmFwcCgnbmFtZUZpcnN0JyksIGIubWFueShiLmFwcCgnbmFtZVJlc3QnKSwgMCkpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ25hbWVGaXJzdCcsIGIuYWx0KGIucHJpbSgnXycpLCBiLmFwcCgnbGV0dGVyJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ25hbWVSZXN0JywgYi5hbHQoYi5wcmltKCdfJyksIGIuYXBwKCdhbG51bScpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKCcgaWRlbnRpZmllcicpOyBiLmRlZmluZSgnaWRlbnQnLCBiLnNlcShiLm5vdChiLmFwcCgna2V5d29yZCcpKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKTtcbiAgYi5pbmxpbmUoJ2tleXdvcmRfdW5kZWZpbmVkJywgYi5zZXEoYi5wcmltKCd1bmRlZmluZWQnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSk7XG4gIGIuaW5saW5lKCdrZXl3b3JkX251bGwnLCBiLnNlcShiLnByaW0oJ251bGwnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSk7XG4gIGIuaW5saW5lKCdrZXl3b3JkX3RydWUnLCBiLnNlcShiLnByaW0oJ3RydWUnKSwgYi5ub3QoYi5hcHAoJ25hbWVSZXN0JykpKSk7XG4gIGIuaW5saW5lKCdrZXl3b3JkX2ZhbHNlJywgYi5zZXEoYi5wcmltKCdmYWxzZScpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ2tleXdvcmQnLCBiLmFsdChiLmFwcCgna2V5d29yZF91bmRlZmluZWQnKSwgYi5hcHAoJ2tleXdvcmRfbnVsbCcpLCBiLmFwcCgna2V5d29yZF90cnVlJyksIGIuYXBwKCdrZXl3b3JkX2ZhbHNlJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24oJyBzdHJpbmcgbGl0ZXJhbCcpOyBiLmRlZmluZSgnc3RyaW5nJywgYi5zZXEoYi5wcmltKFwiJ1wiKSwgYi5iaW5kKGIubWFueShiLmFwcCgnc0NoYXInKSwgMCksICdjcycpLCBiLnByaW0oXCInXCIpKSk7XG4gIGIuc2V0UnVsZURlc2NyaXB0aW9uKHVuZGVmaW5lZCk7IGIuZGVmaW5lKCdzQ2hhcicsIGIuYWx0KGIuc2VxKGIucHJpbSgnXFxcXHgnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5wcmltKCdcXFxcdScpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIucHJpbSgnXFxcXCcpLCBiLmFwcCgnXycpKSwgYi5zZXEoYi5ub3QoYi5wcmltKFwiJ1wiKSksIGIubm90KGIucHJpbSgnXFxuJykpLCBiLmFwcCgnXycpKSkpO1xuICBiLnNldFJ1bGVEZXNjcmlwdGlvbignIHJlZ3VsYXIgZXhwcmVzc2lvbicpOyBiLmRlZmluZSgncmVnRXhwJywgYi5zZXEoYi5wcmltKCcvJyksIGIuYmluZChiLmFwcCgncmVDaGFyQ2xhc3MnKSwgJ2UnKSwgYi5wcmltKCcvJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24odW5kZWZpbmVkKTsgYi5kZWZpbmUoJ3JlQ2hhckNsYXNzJywgYi5zZXEoYi5wcmltKCdbJyksIGIubWFueShiLmFsdChiLnByaW0oJ1xcXFxdJyksIGIuc2VxKGIubm90KGIucHJpbSgnXScpKSwgYi5hcHAoJ18nKSkpLCAwKSwgYi5wcmltKCddJykpKTtcbiAgYi5zZXRSdWxlRGVzY3JpcHRpb24oJyBudW1iZXInKTsgYi5kZWZpbmUoJ251bWJlcicsIGIuc2VxKGIub3B0KGIucHJpbSgnLScpKSwgYi5tYW55KGIuYXBwKCdkaWdpdCcpLCAxKSkpO1xuICByZXR1cm4gYi5idWlsZChvcHROYW1lc3BhY2UpO1xufSk7XG4iLCJleHBvcnRzLm9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG5leHBvcnRzLnN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi9zdHJpbmdVdGlscy5qcycpXG5leHBvcnRzLmVxdWFscyA9IHJlcXVpcmUoJy4vZXF1YWxzLmpzJylcbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvZ2dpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBzdWJzY3JpYmVkID0ge31cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbihzdWJqZWN0IC8qICwgLi4uICovKSB7XG4gIGlmICghc3Vic2NyaWJlZFtzdWJqZWN0XSlcbiAgICByZXR1cm5cbiAgYXJndW1lbnRzWzBdID0gJ1snICsgc3ViamVjdCArICddJ1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmV4cG9ydHMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzdWJzY3JpYmVkW3N1YmplY3RdID0gdHJ1ZVxufVxuXG5leHBvcnRzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBkZWxldGUgc2hvd2luZ1tzdWJqZWN0XVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXNzZXJ0cywgZXJyb3JzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmVycm9yID0gZnVuY3Rpb24oLyogYXJnMSwgYXJnMiwgLi4uICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3MpXG4gIHRocm93ICdlcnJvcjogJyArIGFyZ3Muam9pbignICcpXG59XG5cbmV4cG9ydHMuc2FuaXR5Q2hlY2sgPSBmdW5jdGlvbihuYW1lLCBjb25kaXRpb24pIHtcbiAgaWYgKCFjb25kaXRpb24pXG4gICAgdGhpc01vZHVsZS5lcnJvcignZmFpbGVkIHNhbml0eSBjaGVjazonLCBuYW1lKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRE9NIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnByZXR0eVByaW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGVuZE5vZGUsIGVuZE9mZnNldCkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSlcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhLnN1YnN0cigwLCBlbmRPZmZzZXQpICsgJ3wnICsgbm9kZS5kYXRhLnN1YnN0cihlbmRPZmZzZXQpICsgJ30nXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEgKyAnfSdcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtub2RlLnRhZ05hbWUsICd7J11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gaWR4KVxuICAgICAgcGFydHMucHVzaCgnfCcpXG4gICAgcGFydHMucHVzaCh0aGlzTW9kdWxlLnByZXR0eVByaW50Tm9kZShub2RlLmNoaWxkTm9kZXMuaXRlbShpZHgpLCBlbmROb2RlLCBlbmRPZmZzZXQpKVxuICB9XG4gIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goJ3wnKVxuICBwYXJ0cy5wdXNoKCd9JylcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cbiIsIi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZG91YmxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT0geVxufVxuXG5mdW5jdGlvbiB0cmlwbGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geVxufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHhcbiAgcmV0dXJuIHR5cGUgIT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh4KSlcbiAgICByZXR1cm4gZXFGbih4LCB5KVxuICBmb3IgKHZhciBwIGluIHgpXG4gICAgaWYgKGRlZXAgJiYgIWVxdWFscyh4W3BdLCB5W3BdLCBkZWVwLCBlcUZuKSB8fFxuICAgICAgICAhZGVlcCAmJiAhZXFGbih4W3BdLCB5W3BdKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBwIGluIHkpXG4gICAgaWYgKHlbcF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB4W3BdID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgZGVlcCwgZXFGbikge1xuICBpZiAoIWFycjEgaW5zdGFuY2VvZiBBcnJheSB8fCAhYXJyMiBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICBhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycjEubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyMVtpZHhdXG4gICAgdmFyIGZvdW5kWCA9IGFycjIuc29tZShmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kWClcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuZGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIgPSBmdW5jdGlvbihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG5leHBvcnRzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGZ1bmN0aW9uKG9iaiwgb3B0UHJvcGVydGllcykge1xuICBmdW5jdGlvbiBjb25zKCkge31cbiAgY29ucy5wcm90b3R5cGUgPSBvYmpcbiAgdmFyIGFucyA9IG5ldyBjb25zKClcbiAgaWYgKG9wdFByb3BlcnRpZXMpXG4gICAgdGhpc01vZHVsZS5rZXlzQW5kVmFsdWVzRG8ob3B0UHJvcGVydGllcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgYW5zW2tdID0gdlxuICAgIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZXhwb3J0cy5mb3JtYWxzID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gZnVuYy5cbiAgICB0b1N0cmluZygpLlxuICAgIG1hdGNoKC9cXCgoLio/KVxcKS8pWzBdLlxuICAgIHJlcGxhY2UoLyAvZywgJycpLlxuICAgIHNsaWNlKDEsIC0xKS5cbiAgICBzcGxpdCgnLCcpLlxuICAgIGZpbHRlcihmdW5jdGlvbihtb2R1bGVOYW1lKSB7IHJldHVybiBtb2R1bGVOYW1lICE9ICcnIH0pXG59XG5cbmV4cG9ydHMua2V5c0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICBmb3IgKHZhciBwIGluIG9iamVjdClcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHApKVxuICAgICAgZm4ocClcbn1cblxuZXhwb3J0cy52YWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihwLCBvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYudmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzQW5kVmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgYW5zID0gW11cbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGFucy5wdXNoKG9iamVjdFtwXSkgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdXG4gIHRoaXMubGVuZ3RoU29GYXIgPSAwXG59XG5cblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnN0cmluZ3MucHVzaChzKVxuICAgIHRoaXMubGVuZ3RoU29GYXIgKz0gcy5sZW5ndGhcbiAgfSxcblxuICBjb250ZW50czogZnVuY3Rpb24oKSAge1xuICAgIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJylcbiAgfVxufVxuXG5leHBvcnRzLnN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFN0cmluZ0J1ZmZlcigpXG59XG5cbmZ1bmN0aW9uIENvbHVtblN0cmluZ0J1ZmZlcigpIHtcbiAgdGhpcy5saW5lcyA9IFtdXG4gIHRoaXMubmV3TGluZSgpXG59XG5cbkNvbHVtblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLmN1cnJlbnRDb2x1bW4oKS5wdXNoKHMpXG4gIH0sXG5cbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIENvbnZlcnQgY29sdW1ucyBmcm9tIGxpc3RzIG9mIHN0cmluZ3MgdG8gc3RyaW5ncywgYW5kIHJlY29yZCBjb2x1bW4gbGVuZ3Roc1xuICAgIHZhciBjb2x1bW5MZW5ndGhzID0gW11cbiAgICB0aGlzLmxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbGluZS5sZW5ndGg7IGNvbElkeCsrKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSBsaW5lW2NvbElkeF1cbiAgICAgICAgbGluZVtjb2xJZHhdID0gY29sdW1uLmpvaW4oJycpXG4gICAgICAgIGlmIChjb2x1bW5MZW5ndGhzW2NvbElkeF0gPT09IHVuZGVmaW5lZCB8fCBjb2x1bW5MZW5ndGhzW2NvbElkeF0gPCBsaW5lW2NvbElkeF0ubGVuZ3RoKVxuICAgICAgICAgIGNvbHVtbkxlbmd0aHNbY29sSWR4XSA9IGxpbmVbY29sSWR4XS5sZW5ndGhcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIHNiID0gdGhpc01vZHVsZS5zdHJpbmdCdWZmZXIoKVxuICAgIHRoaXMubGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBsaW5lLmxlbmd0aDsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbHVtbiA9IGxpbmVbY29sSWR4XVxuICAgICAgICBzYi5uZXh0UHV0QWxsKGNvbHVtbilcbiAgICAgICAgdmFyIG51bVNwYWNlcyA9IGNvbHVtbkxlbmd0aHNbY29sSWR4XSAtIGNvbHVtbi5sZW5ndGhcbiAgICAgICAgd2hpbGUgKG51bVNwYWNlcy0tID4gMClcbiAgICAgICAgICBzYi5uZXh0UHV0QWxsKCcgJylcbiAgICAgIH1cbiAgICAgIHNiLm5leHRQdXRBbGwoJ1xcbicpXG4gICAgfSlcbiAgICByZXR1cm4gc2IuY29udGVudHMoKVxuICB9LFxuXG4gIG5ld0xpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGluZXMucHVzaChbXSlcbiAgICB0aGlzLm5ld0NvbHVtbigpXG4gIH0sXG5cbiAgbmV3Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmN1cnJlbnRMaW5lKCkucHVzaChbXSlcbiAgfSxcblxuICBjdXJyZW50Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuY3VycmVudExpbmUoKVxuICAgIHJldHVybiBsaW5lW2xpbmUubGVuZ3RoIC0gMV1cbiAgfSxcblxuICBjdXJyZW50TGluZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXNbdGhpcy5saW5lcy5sZW5ndGggLSAxXVxuICB9XG59XG5cbmV4cG9ydHMuY29sdW1uU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQ29sdW1uU3RyaW5nQnVmZmVyKClcbn1cblxuIiwidmFyIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBwYWQobnVtYmVyQXNTdHJpbmcsIGxlbikge1xuICB2YXIgemVyb3MgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1iZXJBc1N0cmluZy5sZW5ndGggLSBsZW47IGlkeCsrKVxuICAgIHplcm9zLnB1c2goJzAnKVxuICByZXR1cm4gemVyb3Muam9pbignJykgKyBudW1iZXJBc1N0cmluZ1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge31cbmZvciAodmFyIGMgPSAwOyBjIDwgMTI4OyBjKyspXG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYylcbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSAgPSBcIlxcXFwnXCJcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJ1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxyJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0J1xuZXNjYXBlU3RyaW5nRm9yWydcXHYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx2J1xuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMClcbiAgaWYgKChjID09ICdcIicgfHwgYyA9PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pXG4gICAgcmV0dXJuIGNcbiAgZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpXG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV1cbiAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KVxuICAgIHJldHVybiAnXFxcXHgnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMilcbiAgZWxzZVxuICAgIHJldHVybiAnXFxcXHUnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNClcbn1cblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PSAnXFxcXCcpXG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6ICByZXR1cm4gJ1xcYidcbiAgICAgIGNhc2UgJ2YnOiAgcmV0dXJuICdcXGYnXG4gICAgICBjYXNlICduJzogIHJldHVybiAnXFxuJ1xuICAgICAgY2FzZSAncic6ICByZXR1cm4gJ1xccidcbiAgICAgIGNhc2UgJ3QnOiAgcmV0dXJuICdcXHQnXG4gICAgICBjYXNlICd2JzogIHJldHVybiAnXFx2J1xuICAgICAgY2FzZSAneCc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKVxuICAgICAgY2FzZSAndSc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKVxuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSlcbiAgICB9XG4gIGVsc2VcbiAgICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBwcmludE9uKHgsIHdzKSB7XG4gIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKHhbaWR4XSwgd3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10nKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIHZhciBoYXNTaW5nbGVRdW90ZXMgPSB4LmluZGV4T2YoXCInXCIpID49IDBcbiAgICB2YXIgaGFzRG91YmxlUXVvdGVzID0geC5pbmRleE9mKCdcIicpID49IDBcbiAgICB2YXIgZGVsaW0gPSBoYXNTaW5nbGVRdW90ZXMgJiYgIWhhc0RvdWJsZVF1b3RlcyA/ICdcIicgOiBcIidcIlxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKVxuICAgICAgd3MubmV4dFB1dEFsbCh0aGlzTW9kdWxlLmVzY2FwZUNoYXIoeFtpZHhdLCBkZWxpbSkpXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgfSBlbHNlIGlmICh4ID09PSBudWxsKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnbnVsbCcpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmICEoeCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCd7JylcbiAgICB2YXIgZmlyc3QgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0FuZFZhbHVlc0RvKHgsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKGssIHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnOiAnKVxuICAgICAgcHJpbnRPbih2LCB3cylcbiAgICB9KVxuICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICB9IGVsc2VcbiAgICB3cy5uZXh0UHV0QWxsKCcnICsgeClcbn1cblxuZXhwb3J0cy5wcmludFN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgd3MgPSBvYmplY3RVdGlscy5zdHJpbmdCdWZmZXIoKVxuICBwcmludE9uKG9iaiwgd3MpXG4gIHJldHVybiB3cy5jb250ZW50cygpXG59XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hci5qcycpO1xudmFyIGRlY2xzID0gcmVxdWlyZSgnLi9kZWNscy5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gQnVpbGRlcigpIHtcbiAgdGhpcy5pbml0KCk7XG59XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBHcmFtbWFyLnByb3RvdHlwZTtcbiAgICB0aGlzLnJ1bGVEZWNscyA9IFtdO1xuICB9LFxuXG4gIHNldE5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9LFxuXG4gIHNldFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gZ3JhbW1hcjtcbiAgfSxcblxuICBzZXRSdWxlRGVzY3JpcHRpb246IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB0aGlzLnJ1bGVEZXNjcmlwdGlvbiA9IHRleHQ7XG4gIH0sXG5cbiAgZGVmaW5lOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLkRlZmluZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIsIHRoaXMucnVsZURlc2NyaXB0aW9uKSk7XG4gICAgdGhpcy5ydWxlRGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgb3ZlcnJpZGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgZGVjbHMuT3ZlcnJpZGUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSk7XG4gIH0sXG5cbiAgaW5saW5lOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLklubGluZShydWxlTmFtZSwgYm9keSwgdGhpcy5zdXBlckdyYW1tYXIpKTtcbiAgICByZXR1cm4gdGhpcy5hcHAocnVsZU5hbWUpO1xuICB9LFxuXG4gIGV4dGVuZDogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBkZWNscy5FeHRlbmQocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSk7XG4gIH0sXG5cbiAgYnVpbGQ6IGZ1bmN0aW9uKG9wdE5hbWVzcGFjZSkge1xuICAgIHZhciBzdXBlckdyYW1tYXIgPSB0aGlzLnN1cGVyR3JhbW1hcjtcbiAgICB2YXIgcnVsZURpY3QgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oc3VwZXJHcmFtbWFyLnJ1bGVEaWN0KTtcbiAgICB0aGlzLnJ1bGVEZWNscy5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVEZWNsKSB7XG4gICAgICBydWxlRGVjbC5wZXJmb3JtQ2hlY2tzKCk7XG4gICAgICBydWxlRGVjbC5pbnN0YWxsKHJ1bGVEaWN0KTtcbiAgICB9KTtcblxuICAgIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIocnVsZURpY3QpO1xuICAgIGdyYW1tYXIuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICAgIGdyYW1tYXIucnVsZURlY2xzID0gdGhpcy5ydWxlRGVjbHM7XG4gICAgaWYgKHRoaXMubmFtZSkge1xuICAgICAgZ3JhbW1hci5uYW1lID0gdGhpcy5uYW1lO1xuICAgICAgaWYgKG9wdE5hbWVzcGFjZSkge1xuICAgICAgICBncmFtbWFyLm5hbWVzcGFjZU5hbWUgPSBvcHROYW1lc3BhY2UubmFtZTtcbiAgICAgICAgb3B0TmFtZXNwYWNlLmluc3RhbGwodGhpcy5uYW1lLCBncmFtbWFyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gICAgcmV0dXJuIGdyYW1tYXI7XG4gIH0sXG5cbiAgcHJpbTogZnVuY3Rpb24oeCkgeyByZXR1cm4gcGV4cHJzLm1ha2VQcmltKHgpOyB9LFxuICBhbHQ6IGZ1bmN0aW9uKC8qIHRlcm0xLCB0ZXJtMSwgLi4uICovKSB7XG4gICAgdmFyIHRlcm1zID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuQWx0KSB7XG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXJtcy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBwZXhwcnMuQWx0KHRlcm1zKTtcbiAgfSxcbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICBmYWN0b3JzID0gZmFjdG9ycy5jb25jYXQoYXJnLmZhY3RvcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWN0b3JzLmxlbmd0aCA9PT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgcGV4cHJzLlNlcShmYWN0b3JzKTtcbiAgfSxcbiAgYmluZDogZnVuY3Rpb24oZXhwciwgbmFtZSkgeyByZXR1cm4gbmV3IHBleHBycy5CaW5kKGV4cHIsIG5hbWUpOyB9LFxuICBtYW55OiBmdW5jdGlvbihleHByLCBtaW5OdW1NYXRjaGVzKSB7IHJldHVybiBuZXcgcGV4cHJzLk1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcyk7IH0sXG4gIG9wdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5PcHQoZXhwcik7IH0sXG4gIG5vdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5Ob3QoZXhwcik7IH0sXG4gIGxhOiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgcGV4cHJzLkxvb2thaGVhZChleHByKTsgfSxcbiAgc3RyOiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgcGV4cHJzLlN0cihleHByKTsgfSxcbiAgbHN0OiBmdW5jdGlvbihleHByKSB7IHJldHVybiBuZXcgcGV4cHJzLkxpc3QoZXhwcik7IH0sXG4gIG9iajogZnVuY3Rpb24ocHJvcGVydGllcywgaXNMZW5pZW50KSB7IHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCAhIWlzTGVuaWVudCk7IH0sXG4gIGFwcDogZnVuY3Rpb24ocnVsZU5hbWUpIHsgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUpOyB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xudmFyIHNraXBTcGFjZXMgPSByZXF1aXJlKCcuL3NraXBTcGFjZXMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBicm93c2VyID0gYXdsaWIuYnJvd3NlcjtcbnZhciBrZXlzRG8gPSBhd2xpYi5vYmplY3RVdGlscy5rZXlzRG87XG52YXIgdmFsdWVzRG8gPSBhd2xpYi5vYmplY3RVdGlscy52YWx1ZXNEbztcbnZhciBmb3JtYWxzID0gYXdsaWIub2JqZWN0VXRpbHMuZm9ybWFscztcbnZhciBtYWtlU3RyaW5nQnVmZmVyID0gYXdsaWIub2JqZWN0VXRpbHMuc3RyaW5nQnVmZmVyO1xudmFyIG1ha2VDb2x1bW5TdHJpbmdCdWZmZXIgPSBhd2xpYi5vYmplY3RVdGlscy5jb2x1bW5TdHJpbmdCdWZmZXI7XG52YXIgcHJpbnRTdHJpbmcgPSBhd2xpYi5zdHJpbmdVdGlscy5wcmludFN0cmluZztcbnZhciBlcXVhbHMgPSBhd2xpYi5lcXVhbHMuZXF1YWxzO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gR3JhbW1hcihydWxlRGljdCkge1xuICB0aGlzLnJ1bGVEaWN0ID0gcnVsZURpY3Q7XG59XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBydWxlRGljdDogbmV3IChmdW5jdGlvbigpIHtcbiAgICB0aGlzLl8gPSBwZXhwcnMuYW55dGhpbmc7XG4gICAgdGhpcy5lbmQgPSBuZXcgcGV4cHJzLk5vdChwZXhwcnMuYW55dGhpbmcpO1xuICAgIHRoaXMuc3BhY2UgPSBwZXhwcnMubWFrZVByaW0oL1tcXHNdLyk7XG4gICAgdGhpcy5zcGFjZS5kZXNjcmlwdGlvbiA9ICdzcGFjZSc7XG4gICAgdGhpcy5hbG51bSA9IHBleHBycy5tYWtlUHJpbSgvWzAtOWEtekEtWl0vKTtcbiAgICB0aGlzLnNwYWNlLmRlc2NyaXB0aW9uID0gJ2FscGhhLW51bWVyaWMgY2hhcmFjdGVyJztcbiAgICB0aGlzLmxldHRlciA9IHBleHBycy5tYWtlUHJpbSgvW2EtekEtWl0vKTtcbiAgICB0aGlzLmxldHRlci5kZXNjcmlwdGlvbiA9ICdsZXR0ZXInO1xuICAgIHRoaXMubG93ZXIgPSBwZXhwcnMubWFrZVByaW0oL1thLXpdLyk7XG4gICAgdGhpcy5sb3dlci5kZXNjcmlwdGlvbiA9ICdsb3dlci1jYXNlIGxldHRlcic7XG4gICAgdGhpcy51cHBlciA9IHBleHBycy5tYWtlUHJpbSgvW0EtWl0vKTtcbiAgICB0aGlzLnVwcGVyLmRlc2NyaXB0aW9uID0gJ3VwcGVyLWNhc2UgbGV0dGVyJztcbiAgICB0aGlzLmRpZ2l0ID0gcGV4cHJzLm1ha2VQcmltKC9bMC05XS8pO1xuICAgIHRoaXMuZGlnaXQuZGVzY3JpcHRpb24gPSAnZGlnaXQnO1xuICAgIHRoaXMuaGV4RGlnaXQgPSBwZXhwcnMubWFrZVByaW0oL1swLTlhLWZBLUZdLyk7XG4gICAgdGhpcy5oZXhEaWdpdC5kZXNjcmlwdGlvbiA9ICdoZXhhZGVjaW1hbCBkaWdpdCc7XG4gIH0pKCksXG5cbiAgbWF0Y2g6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlLCBvcHRUaHJvd09uRmFpbCkge1xuICAgIHJldHVybiB0aGlzLm1hdGNoQ29udGVudHMoW29ial0sIHN0YXJ0UnVsZSwgb3B0VGhyb3dPbkZhaWwpO1xuICB9LFxuXG4gIG1hdGNoQ29udGVudHM6IGZ1bmN0aW9uKG9iaiwgc3RhcnRSdWxlLCBvcHRUaHJvd09uRmFpbCkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihvYmopO1xuICAgIHZhciB0aHVuayA9IG5ldyBwZXhwcnMuQXBwbHkoc3RhcnRSdWxlKS5ldmFsKG9wdFRocm93T25GYWlsLCB1bmRlZmluZWQsIHRoaXMucnVsZURpY3QsIGlucHV0U3RyZWFtLCB1bmRlZmluZWQpO1xuXG4gICAgdmFyIHN1Y2NlZWRlZDtcbiAgICBpZiAodGh1bmsgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICBzdWNjZWVkZWQgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBtYXRjaCBvbmx5IHN1Y2NlZWRlZCBpZiB0aGUgc3RhcnQgcnVsZSBjb25zdW1lZCBhbGwgb2YgdGhlIGlucHV0LlxuICAgICAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyhzdGFydFJ1bGUpKSB7XG4gICAgICAgIHNraXBTcGFjZXModGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgICAgfVxuICAgICAgc3VjY2VlZGVkID0gcGV4cHJzLmVuZC5ldmFsKG9wdFRocm93T25GYWlsLCBmYWxzZSwgdGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZCkgIT09IGNvbW1vbi5mYWlsO1xuICAgIH1cblxuICAgIGlmIChzdWNjZWVkZWQpIHtcbiAgICAgIHZhciBhc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2ggPSB0aGlzLmFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaC5iaW5kKHRoaXMpO1xuICAgICAgdmFyIGFucyA9IGZ1bmN0aW9uKGFjdGlvbkRpY3QpIHtcbiAgICAgICAgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoKGFjdGlvbkRpY3QpO1xuICAgICAgICByZXR1cm4gdGh1bmsuZm9yY2UoYWN0aW9uRGljdCwge30pO1xuICAgICAgfTtcbiAgICAgIGFucy50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gJ1tvaG0gdGh1bmtdJzsgfTtcbiAgICAgIHJldHVybiBhbnM7XG4gICAgfSBlbHNlIGlmIChvcHRUaHJvd09uRmFpbCkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5NYXRjaEZhaWx1cmUoaW5wdXRTdHJlYW0sIHRoaXMucnVsZURpY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaDogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcnVsZURpY3QgPSB0aGlzLnJ1bGVEaWN0O1xuICAgIHZhciBvayA9IHRydWU7XG4gICAga2V5c0RvKHJ1bGVEaWN0LCBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgaWYgKGFjdGlvbkRpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGFjdHVhbCA9IGZvcm1hbHMoYWN0aW9uRGljdFtydWxlTmFtZV0pLnNvcnQoKTtcbiAgICAgIHZhciBleHBlY3RlZCA9IHNlbGYuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSk7XG4gICAgICBpZiAoIWVxdWFscyhhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZygnc2VtYW50aWMgYWN0aW9uIGZvciBydWxlJywgcnVsZU5hbWUsICdoYXMgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcgIGV4cGVjdGVkJywgZXhwZWN0ZWQpO1xuICAgICAgICBjb25zb2xlLmxvZygnICAgIGFjdHVhbCcsIGFjdHVhbCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFvaykge1xuICAgICAgYnJvd3Nlci5lcnJvcignb25lIG9yIG1vcmUgc2VtYW50aWMgYWN0aW9ucyBoYXZlIHRoZSB3cm9uZyBhcmd1bWVudCBuYW1lcyAtLSBzZWUgY29uc29sZSBmb3IgZGV0YWlscycpO1xuICAgIH1cbiAgfSxcblxuICBzZW1hbnRpY0FjdGlvbkFyZ05hbWVzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hci5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIHZhciBuYW1lcyA9IGJvZHkuZ2V0QmluZGluZ05hbWVzKCk7XG4gICAgICByZXR1cm4gbmFtZXMubGVuZ3RoID4gMCB8fCBib2R5LnByb2R1Y2VzVmFsdWUoKSA/IFsnZW52J10gOiBbXTtcbiAgICB9XG4gIH0sXG5cbiAgdG9SZWNpcGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB3cyA9IG1ha2VTdHJpbmdCdWZmZXIoKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcoZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcXG4nKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLl9idWlsZGVyKCk7XFxuJyk7XG4gICAgd3MubmV4dFB1dEFsbCgnICBiLnNldE5hbWUoJyk7IHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7IHdzLm5leHRQdXRBbGwoJyk7XFxuJyk7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUgJiYgdGhpcy5zdXBlckdyYW1tYXIubmFtZXNwYWNlTmFtZSkge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICBiLnNldFN1cGVyR3JhbW1hcihvaG0ubmFtZXNwYWNlKCcpO1xuICAgICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSk7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcpLmdldEdyYW1tYXIoJyk7XG4gICAgICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpKTtcbiAgICAgIHdzLm5leHRQdXRBbGwoJykpO1xcbicpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnJ1bGVEZWNscy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcgICcpO1xuICAgICAgdGhpcy5ydWxlRGVjbHNbaWR4XS5vdXRwdXRSZWNpcGUod3MpO1xuICAgICAgd3MubmV4dFB1dEFsbCgnO1xcbicpO1xuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcgIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSk7XFxuJyk7XG4gICAgd3MubmV4dFB1dEFsbCgnfSk7Jyk7XG4gICAgcmV0dXJuIHdzLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgdG9TZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbigvKiBlbnRyeVBvaW50MSwgZW50cnlQb2ludDIsIC4uLiAqLykge1xuICAgIHZhciBlbnRyeVBvaW50cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzIDogT2JqZWN0LmtleXModGhpcy5ydWxlRGljdCk7XG4gICAgdmFyIHJ1bGVzVG9CZUluY2x1ZGVkID0gdGhpcy5ydWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZW50cnlQb2ludHMpO1xuICAgIFxuICAgIC8vIFRPRE86IGFkZCB0aGUgc3VwZXItZ3JhbW1hcidzIHRlbXBsYXRlcyBhdCB0aGUgcmlnaHQgcGxhY2UsIGUuZy4sIGEgY2FzZSBmb3IgQWRkRXhwcl9wbHVzIHNob3VsZCBhcHBlYXIgbmV4dCB0b1xuICAgIC8vIG90aGVyIGNhc2VzIG9mIEFkZEV4cHIuXG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGJ1ZmZlciA9IG1ha2VDb2x1bW5TdHJpbmdCdWZmZXIoKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCgneycpO1xuXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBydWxlc1RvQmVJbmNsdWRlZCkge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnVmZmVyLm5leHRQdXRBbGwoJywnKTtcbiAgICAgIH1cbiAgICAgIGJ1ZmZlci5uZXdMaW5lKCk7XG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnICAnKTtcbiAgICAgIGJ1ZmZlci5uZXdDb2x1bW4oKTtcbiAgICAgIHNlbGYuYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZShydWxlTmFtZSwgYm9keSwgYnVmZmVyKTtcbiAgICB9XG5cbiAgICBidWZmZXIubmV3TGluZSgpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCd9Jyk7XG4gICAgcmV0dXJuIGJ1ZmZlci5jb250ZW50cygpO1xuICB9LFxuXG4gIGFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5LCBidWZmZXIpIHtcbiAgICBidWZmZXIubmV4dFB1dEFsbChydWxlTmFtZSk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJzogJyk7XG4gICAgYnVmZmVyLm5ld0NvbHVtbigpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCdmdW5jdGlvbignKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCh0aGlzLnNlbWFudGljQWN0aW9uQXJnTmFtZXMocnVsZU5hbWUpLmpvaW4oJywgJykpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcpICcpO1xuICAgIGJ1ZmZlci5uZXdDb2x1bW4oKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCgneycpO1xuXG4gICAgdmFyIGVudlByb3BlcnRpZXMgPSBib2R5LmdldEJpbmRpbmdOYW1lcygpO1xuICAgIGlmIChlbnZQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCAmJiBib2R5LnByb2R1Y2VzVmFsdWUoKSkge1xuICAgICAgZW52UHJvcGVydGllcyA9IFsndmFsdWUnXTtcbiAgICB9XG4gICAgaWYgKGVudlByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoJyAvKiAnKTtcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKGVudlByb3BlcnRpZXMuam9pbignLCAnKSk7XG4gICAgICBidWZmZXIubmV4dFB1dEFsbCgnICovICcpO1xuICAgIH1cbiAgICBidWZmZXIubmV4dFB1dEFsbCgnfScpO1xuICB9LFxuXG4gIHJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbjogZnVuY3Rpb24oZW50cnlQb2ludHMpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gZ2V0Qm9keShydWxlTmFtZSkge1xuICAgICAgaWYgKHNlbGYucnVsZURpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkUnVsZShydWxlTmFtZSwgc2VsZi5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcnVsZXMgPSB7fTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlbnRyeVBvaW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgcnVsZU5hbWUgPSBlbnRyeVBvaW50c1tpZHhdO1xuICAgICAgZ2V0Qm9keShydWxlTmFtZSk7ICAvLyB0byBtYWtlIHN1cmUgdGhlIHJ1bGUgZXhpc3RzXG4gICAgICBydWxlc1tydWxlTmFtZV0gPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBkb25lID0gZmFsc2U7XG4gICAgd2hpbGUgKCFkb25lKSB7XG4gICAgICBkb25lID0gdHJ1ZTtcbiAgICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIHJ1bGVzKSB7XG4gICAgICAgIHZhciBhZGRlZE5ld1J1bGUgPSBnZXRCb2R5KHJ1bGVOYW1lKS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24ocnVsZXMsIHRydWUpO1xuICAgICAgICBkb25lICY9ICFhZGRlZE5ld1J1bGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJ1bGVzO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgUG9zSW5mbyA9IHJlcXVpcmUoJy4vUG9zSW5mby5qcycpO1xudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuL0dyYW1tYXIuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG87XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbSgpIHtcbiAgdGhyb3cgJ0lucHV0U3RyZWFtIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jztcbn1cblxuSW5wdXRTdHJlYW0ubmV3Rm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuZXcgU3RyaW5nSW5wdXRTdHJlYW0ob2JqKTtcbiAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuZXcgTGlzdElucHV0U3RyZWFtKG9iaik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgJ2Nhbm5vdCBtYWtlIGlucHV0IHN0cmVhbSBmb3IgJyArIG9iajtcbiAgfVxufTtcblxuSW5wdXRTdHJlYW0ucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnBvcyA9IDA7XG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdO1xuICAgIHRoaXMuZmFpbHVyZXMgPSBudWxsO1xuICAgIHRoaXMuZmFpbHVyZXNQb3MgPSAtMTtcbiAgfSxcblxuICByZWNvcmRGYWlsdXJlOiBmdW5jdGlvbihwb3MsIGV4cHIpIHtcbiAgICBpZiAocG9zID4gdGhpcy5mYWlsdXJlc1Bvcykge1xuICAgICAgdGhpcy5mYWlsdXJlcyA9IHtleHByOiBleHByLCBuZXh0OiBudWxsfTtcbiAgICAgIHRoaXMuZmFpbHVyZXNQb3MgPSBwb3M7XG4gICAgfSBlbHNlIGlmIChwb3MgPT09IHRoaXMuZmFpbHVyZXNQb3MpIHtcbiAgICAgIHRoaXMuZmFpbHVyZXMgPSB7ZXhwcjogZXhwciwgbmV4dDogdGhpcy5mYWlsdXJlc307XG4gICAgfVxuICB9LFxuXG4gIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyclBvcyA9IHRoaXMucG9zO1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5wb3NJbmZvc1tjdXJyUG9zXTtcbiAgICByZXR1cm4gcG9zSW5mbyB8fCAodGhpcy5wb3NJbmZvc1tjdXJyUG9zXSA9IG5ldyBQb3NJbmZvKGN1cnJQb3MpKTtcbiAgfSxcblxuICBhdEVuZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zID09PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH0sXG5cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuYXRFbmQoKSkge1xuICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5wb3MrK107XG4gICAgfVxuICB9LFxuXG4gIG1hdGNoRXhhY3RseTogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLm5leHQoKSA9PT0geCA/IHRydWUgOiBjb21tb24uZmFpbDtcbiAgfSxcblxuICBpbnRlcnZhbDogZnVuY3Rpb24oc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydElkeCwgZW5kSWR4KTtcbiAgfSxcblxuICBnZXRGYWlsdXJlc1BvczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmFpbHVyZXNQb3M7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFN0cmluZ0lucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cblxuU3RyaW5nSW5wdXRTdHJlYW0ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKElucHV0U3RyZWFtLnByb3RvdHlwZSwge1xuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocykge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKHRoaXMubWF0Y2hFeGFjdGx5KHNbaWR4XSkgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICAvLyBJTVBPUlRBTlQ6IGUgbXVzdCBiZSBhIG5vbi1nbG9iYWwsIG9uZS1jaGFyYWN0ZXIgZXhwcmVzc2lvbiwgZS5nLiwgLy4vIGFuZCAvWzAtOV0vXG4gICAgdmFyIGMgPSB0aGlzLm5leHQoKTtcbiAgICByZXR1cm4gYyAhPT0gY29tbW9uLmZhaWwgJiYgZS50ZXN0KGMpID8gdHJ1ZSA6IGNvbW1vbi5mYWlsO1xuICB9XG59KTtcblxuZnVuY3Rpb24gTGlzdElucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cblxuTGlzdElucHV0U3RyZWFtLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkocyk7XG4gIH0sXG5cbiAgbWF0Y2hSZWdFeHA6IGZ1bmN0aW9uKGUpIHtcbiAgICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkoZSk7XG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFN0cmVhbTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0uanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEludGVydmFsKHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCkge1xuICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4O1xuICB0aGlzLmVuZElkeCA9IGVuZElkeDtcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSW50ZXJ2YWwucHJvdG90eXBlLCB7XG4gICdjb250ZW50cyc6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSBJbnB1dFN0cmVhbS5uZXdGb3IodGhpcy5zb3VyY2UpLmludGVydmFsKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9jb250ZW50cztcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWVcbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIG9obSA9IHJlcXVpcmUoJy4vbWFpbi5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgYnJvd3NlciA9IGF3bGliLmJyb3dzZXI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBOYW1lc3BhY2VzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBOYW1lc3BhY2UobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmdyYW1tYXJzID0ge307XG59XG5cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSB7XG4gIGluc3RhbGw6IGZ1bmN0aW9uKG5hbWUsIGdyYW1tYXIpIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyc1tuYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ncmFtbWFyc1tuYW1lXSA9IGdyYW1tYXI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGdldEdyYW1tYXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyc1tuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JhbW1hcnNbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZEdyYW1tYXIobmFtZSwgdGhpcy5uYW1lKTtcbiAgICB9XG4gIH0sXG5cbiAgbG9hZEdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnQ6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICBicm93c2VyLnNhbml0eUNoZWNrKCdzY3JpcHQgdGFnXFwncyB0eXBlIGF0dHJpYnV0ZSBtdXN0IGJlIFwidGV4dC9vaG0tanNcIicsIGVsZW1lbnQudHlwZSA9PT0gJ3RleHQvb2htLWpzJyk7XG4gICAgb2htLm1ha2VHcmFtbWFycyhlbGVtZW50LmlubmVySFRNTCwgdGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgbWFrZTogZnVuY3Rpb24ocmVjaXBlKSB7XG4gICAgcmV0dXJuIHJlY2lwZShvaG0sIHRoaXMpO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBOYW1lc3BhY2U7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFBvc0luZm8oKSB7XG4gIHRoaXMucnVsZVN0YWNrID0gW107XG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fTsgIC8vIHJlZHVuZGFudCAoY291bGQgYmUgZ2VuZXJhdGVkIGZyb20gcnVsZVN0YWNrKSBidXQgdXNlZnVsIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXG4gIHRoaXMubWVtbyA9IHt9O1xufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnB1c2gocnVsZU5hbWUpO1xuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gdHJ1ZTtcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnBvcCgpO1xuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gZmFsc2U7XG4gIH0sXG5cbiAgc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQ6IGZ1bmN0aW9uKG1lbW9SZWMpIHtcbiAgICB2YXIgaW52b2x2ZWRSdWxlcyA9IG1lbW9SZWMuaW52b2x2ZWRSdWxlcztcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBpbnZvbHZlZFJ1bGVzKSB7XG4gICAgICBpZiAoaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gJiYgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID8gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgc3RhcnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICghdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2spIHtcbiAgICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID0gW107XG4gICAgfVxuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnB1c2goe25hbWU6IHJ1bGVOYW1lLCB2YWx1ZTogY29tbW9uLmZhaWwsIHBvczogLTEsIGludm9sdmVkUnVsZXM6IHt9fSk7XG4gICAgdGhpcy51cGRhdGVJbnZvbHZlZFJ1bGVzKCk7XG4gIH0sXG5cbiAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wb3AoKTtcbiAgfSxcblxuICB1cGRhdGVJbnZvbHZlZFJ1bGVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzO1xuICAgIHZhciBsclJ1bGVOYW1lID0gY3VycmVudExlZnRSZWN1cnNpb24ubmFtZTtcbiAgICB2YXIgaWR4ID0gdGhpcy5ydWxlU3RhY2subGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlU3RhY2tbaWR4LS1dO1xuICAgICAgaWYgKHJ1bGVOYW1lID09PSBsclJ1bGVOYW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gUG9zSW5mbztcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuYWJzdHJhY3QgPSBmdW5jdGlvbigpIHtcbiAgdGhyb3cgJ3RoaXMgbWV0aG9kIGlzIGFic3RyYWN0ISc7XG59O1xuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmZhaWwgPSB7fTtcblxuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgcmV0dXJuICdBJyA8PSBmaXJzdENoYXIgJiYgZmlyc3RDaGFyIDw9ICdaJztcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xudmFyIHByaW50U3RyaW5nID0gYXdsaWIuc3RyaW5nVXRpbHMucHJpbnRTdHJpbmc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBvdXRwdXRSZWNpcGUoZGVjbCwgd3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi4nKTtcbiAgd3MubmV4dFB1dEFsbChkZWNsLmtpbmQpO1xuICB3cy5uZXh0UHV0QWxsKCcoJyk7XG4gIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcoZGVjbC5uYW1lKSk7XG4gIHdzLm5leHRQdXRBbGwoJywgJyk7XG4gIGRlY2wuYm9keS5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59XG5cbmZ1bmN0aW9uIFJ1bGVEZWNsKCkge1xuICB0aHJvdyAnUnVsZURlY2wgY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnO1xufVxuXG5SdWxlRGVjbC5wcm90b3R5cGUgPSB7XG4gIHBlcmZvcm1DaGVja3M6IGNvbW1vbi5hYnN0cmFjdCxcblxuICBwZXJmb3JtQ29tbW9uQ2hlY2tzOiBmdW5jdGlvbihuYW1lLCBib2R5KSB7XG4gICAgYm9keS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKG5hbWUpO1xuICAgIGJvZHkuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MobmFtZSk7XG4gICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhuYW1lKTtcbiAgfSxcblxuICBpbnN0YWxsOiBjb21tb24uYWJzdHJhY3QsXG5cbiAgb3V0cHV0UmVjaXBlOiBmdW5jdGlvbih3cykgeyBvdXRwdXRSZWNpcGUodGhpcywgd3MpOyB9XG59O1xuXG5mdW5jdGlvbiBEZWZpbmUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyLCBkZXNjcmlwdGlvbikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJvZHkgPSBib2R5O1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgdGhpcy5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xufVxuXG5EZWZpbmUucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnZGVmaW5lJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24odGhpcy5uYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5ib2R5KTtcbiAgfSxcblxuICBvdXRwdXRSZWNpcGU6IGZ1bmN0aW9uKHdzKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnYi5zZXRSdWxlRGVzY3JpcHRpb24oJyk7XG4gICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLmRlc2NyaXB0aW9uKSk7XG4gICAgd3MubmV4dFB1dEFsbCgnKTsgJyk7XG4gICAgb3V0cHV0UmVjaXBlKHRoaXMsIHdzKTtcbiAgfSxcblxuICBpbnN0YWxsOiBmdW5jdGlvbihydWxlRGljdCkge1xuICAgIHRoaXMuYm9keS5kZXNjcmlwdGlvbiA9IHRoaXMuZGVzY3JpcHRpb247XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuYm9keTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIE92ZXJyaWRlKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJvZHkgPSBib2R5O1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbn1cblxuT3ZlcnJpZGUucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnb3ZlcnJpZGUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdmVycmlkZGVuID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXTtcbiAgICBpZiAoIW92ZXJyaWRkZW4pIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGUodGhpcy5uYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lKTtcbiAgICB9XG4gICAgaWYgKG92ZXJyaWRkZW4uZ2V0QmluZGluZ05hbWVzKCkubGVuZ3RoID09PSAwICYmIG92ZXJyaWRkZW4ucHJvZHVjZXNWYWx1ZSgpICYmICF0aGlzLmJvZHkucHJvZHVjZXNWYWx1ZSgpKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLlJ1bGVNdXN0UHJvZHVjZVZhbHVlKHRoaXMubmFtZSwgJ292ZXJyaWRpbmcnKTtcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5ib2R5KTtcbiAgfSxcblxuICBpbnN0YWxsOiBmdW5jdGlvbihydWxlRGljdCkge1xuICAgIHRoaXMuYm9keS5kZXNjcmlwdGlvbiA9IHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0uZGVzY3JpcHRpb247XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuYm9keTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIElubGluZShuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5ib2R5ID0gYm9keTtcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG59XG5cbklubGluZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdpbmxpbmUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGNvbnNpZGVyIHJlbGF4aW5nIHRoaXMgY2hlY2ssIGUuZy4sIG1ha2UgaXQgb2sgdG8gb3ZlcnJpZGUgYW4gaW5saW5lIHJ1bGUgaWYgdGhlIG5lc3RpbmcgcnVsZSBpc1xuICAgIC8vIGFuIG92ZXJyaWRlLiBCdXQgb25seSBpZiB0aGUgaW5saW5lIHJ1bGUgdGhhdCdzIGJlaW5nIG92ZXJyaWRkZW4gaXMgbmVzdGVkIGluc2lkZSB0aGUgbmVzdGluZyBydWxlIHRoYXRcbiAgICAvLyB3ZSdyZSBvdmVycmlkaW5nPyBIb3BlZnVsbHkgdGhlcmUncyBhIG11Y2ggbGVzcyBjb21wbGljYXRlZCB3YXkgdG8gZG8gdGhpcyA6KVxuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbih0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpO1xuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuYm9keTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIEV4dGVuZChuYW1lLCBib2R5LCBzdXBlckdyYW1tYXIpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5iYXNlID0gc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W25hbWVdO1xuICBpZiAoIXRoaXMuYmFzZSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGUobmFtZSwgc3VwZXJHcmFtbWFyLm5hbWUpO1xuICB9XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHRoaXMuZXh0ZW5kZWRCb2R5ID0gbmV3IHBleHBycy5FeHRlbmRBbHQodGhpcy5ib2R5LCB0aGlzLmJhc2UpO1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbn1cblxuRXh0ZW5kLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2V4dGVuZCcsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuYmFzZS5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgdGhpcy5iYXNlLnByb2R1Y2VzVmFsdWUoKSAmJiAhdGhpcy5ib2R5LnByb2R1Y2VzVmFsdWUoKSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5SdWxlTXVzdFByb2R1Y2VWYWx1ZSh0aGlzLm5hbWUsICdleHRlbmRpbmcnKTtcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5leHRlbmRlZEJvZHkpO1xuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgdGhpcy5leHRlbmRlZEJvZHkuZGVzY3JpcHRpb24gPSB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFt0aGlzLm5hbWVdLmRlc2NyaXB0aW9uO1xuICAgIHJ1bGVEaWN0W3RoaXMubmFtZV0gPSB0aGlzLmV4dGVuZGVkQm9keTtcbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlJ1bGVEZWNsID0gUnVsZURlY2w7XG5leHBvcnRzLkRlZmluZSA9IERlZmluZTtcbmV4cG9ydHMuT3ZlcnJpZGUgPSBPdmVycmlkZTtcbmV4cG9ydHMuSW5saW5lID0gSW5saW5lO1xuZXhwb3J0cy5FeHRlbmQgPSBFeHRlbmQ7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG87XG52YXIgbWFrZVN0cmluZ0J1ZmZlciA9IGF3bGliLm9iamVjdFV0aWxzLnN0cmluZ0J1ZmZlcjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEVycm9yKCkge1xuICB0aHJvdyAnRXJyb3IgY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdFxcJ3MgYWJzdHJhY3QnO1xufVxuXG5FcnJvci5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxuRXJyb3IucHJvdG90eXBlLnByaW50TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyh0aGlzLmdldE1lc3NhZ2UoKSk7XG59O1xuXG5FcnJvci5wcm90b3R5cGUuZ2V0U2hvcnRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmdldE1lc3NhZ2UoKTtcbn07XG5cbkVycm9yLnByb3RvdHlwZS5wcmludFNob3J0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZyh0aGlzLmdldE1lc3NhZ2UoKSk7XG59O1xuXG5FcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0U2hvcnRNZXNzYWdlKCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgZ3JhbW1hcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5kZWNsYXJhdGVkIGdyYW1tYXJcblxuZnVuY3Rpb24gVW5kZWNsYXJlZEdyYW1tYXIoZ3JhbW1hck5hbWUsIG9wdE5hbWVzcGFjZU5hbWUpIHtcbiAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xuICB0aGlzLm5hbWVzcGFjZU5hbWUgPSBvcHROYW1lc3BhY2VOYW1lO1xufTtcblxuVW5kZWNsYXJlZEdyYW1tYXIucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEVycm9yLnByb3RvdHlwZSk7XG5cblVuZGVjbGFyZWRHcmFtbWFyLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm5hbWVzcGFjZU5hbWUgP1xuICAgIFsnZ3JhbW1hcicsIHRoaXMuZ3JhbW1hck5hbWUsICdpcyBub3QgZGVjbGFyZWQgaW4gbmFtZXNwYWNlJywgdGhpcy5uYW1lc3BhY2VOYW1lXS5qb2luKCcgJykgOlxuICAgIFsndW5kZWNsYXJlZCBncmFtbWFyJywgdGhpcy5ncmFtbWFyTmFtZV0uam9pbignICcpO1xufTtcblxuLy8gRHVwbGljYXRlIGdyYW1tYXIgZGVjbGFyYXRpb25cblxuZnVuY3Rpb24gRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2VOYW1lKSB7XG4gIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgdGhpcy5uYW1lc3BhY2VOYW1lID0gbmFtZXNwYWNlTmFtZTtcbn07XG5cbkR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbi5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbJ2dyYW1tYXInLCB0aGlzLmdyYW1tYXJOYW1lLCAnaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiBuYW1lc3BhY2UnLCB0aGlzLm5hbWVzcGFjZU5hbWVdLmpvaW4oJyAnKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHJ1bGVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuZGVjbGFyZWQgcnVsZVxuXG5mdW5jdGlvbiBVbmRlY2xhcmVkUnVsZShydWxlTmFtZSwgb3B0R3JhbW1hck5hbWUpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLmdyYW1tYXJOYW1lID0gb3B0R3JhbW1hck5hbWU7XG59O1xuXG5VbmRlY2xhcmVkUnVsZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuVW5kZWNsYXJlZFJ1bGUucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZ3JhbW1hck5hbWUgP1xuICAgIFsncnVsZScsIHRoaXMucnVsZU5hbWUsICdpcyBub3QgZGVjbGFyZWQgaW4gZ3JhbW1hcicsIHRoaXMuZ3JhbW1hck5hbWVdLmpvaW4oJyAnKSA6XG4gICAgWyd1bmRlY2xhcmVkIHJ1bGUnLCB0aGlzLnJ1bGVOYW1lXS5qb2luKCcgJyk7XG59O1xuXG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuXG5mdW5jdGlvbiBEdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24ocnVsZU5hbWUsIGdyYW1tYXJOYW1lKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xufTtcblxuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhFcnJvci5wcm90b3R5cGUpO1xuXG5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24ucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsncnVsZScsIHRoaXMucnVsZU5hbWUsICdpcyBhbHJlYWR5IGRlY2xhcmVkIGluIGdyYW1tYXInLCB0aGlzLmdyYW1tYXJOYW1lXS5qb2luKCcgJyk7XG59O1xuXG4vLyBSdWxlIG11c3QgcHJvZHVjZSB2YWx1ZVxuXG5mdW5jdGlvbiBSdWxlTXVzdFByb2R1Y2VWYWx1ZShydWxlTmFtZSwgd2h5KSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy53aHkgPSB3aHk7XG59O1xuXG5SdWxlTXVzdFByb2R1Y2VWYWx1ZS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuUnVsZU11c3RQcm9kdWNlVmFsdWUucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtcbiAgICAncnVsZScsIHRoaXMucnVsZU5hbWUsICdtdXN0IHByb2R1Y2UgYSB2YWx1ZScsXG4gICAgJ2JlY2F1c2UgdGhlIHJ1bGUgaXQgaXMnLCB0aGlzLndoeSwgJ2Fsc28gcHJvZHVjZXMgYSB2YWx1ZSdcbiAgXS5qb2luKCcgJyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBiaW5kaW5ncyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBJbmNvbnNpc3RlbnQgYmluZGluZ3NcblxuZnVuY3Rpb24gSW5jb25zaXN0ZW50QmluZGluZ3MocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLmV4cGVjdGVkID0gZXhwZWN0ZWQ7XG4gIHRoaXMuYWN0dWFsID0gYWN0dWFsO1xufTtcblxuSW5jb25zaXN0ZW50QmluZGluZ3MucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEVycm9yLnByb3RvdHlwZSk7XG5cbkluY29uc2lzdGVudEJpbmRpbmdzLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gICAgJ3J1bGUnLCB0aGlzLnJ1bGVOYW1lLCAnaGFzIGluY29uc2lzdGVudCBiaW5kaW5ncy4nLFxuICAgICdleHBlY3RlZDonLCB0aGlzLmV4cGVjdGVkLFxuICAgICdnb3Q6JywgdGhpcy5hY3R1YWxcbiAgXS5qb2luKCcgJyk7XG59O1xuXG4vLyBEdXBsaWNhdGUgYmluZGluZ3NcblxuZnVuY3Rpb24gRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUsIGR1cGxpY2F0ZXMpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLmR1cGxpY2F0ZXMgPSBkdXBsaWNhdGVzO1xufTtcblxuRHVwbGljYXRlQmluZGluZ3MucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEVycm9yLnByb3RvdHlwZSk7XG5cbkR1cGxpY2F0ZUJpbmRpbmdzLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbJ3J1bGUnLCB0aGlzLnJ1bGVOYW1lLCAnaGFzIGR1cGxpY2F0ZSBiaW5kaW5nczonLCB0aGlzLmR1cGxpY2F0ZXNdLmpvaW4oJyAnKTtcbn07XG5cbi8vIFVzZWxlc3MgYmluZGluZ3NcblxuZnVuY3Rpb24gVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lLCB1c2VsZXNzKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy51c2VsZXNzID0gdXNlbGVzcztcbn07XG5cblVzZWxlc3NCaW5kaW5ncy5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oRXJyb3IucHJvdG90eXBlKTtcblxuVXNlbGVzc0JpbmRpbmdzLnByb3RvdHlwZS5nZXRNZXNzYWdlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbJ3J1bGUnLCB0aGlzLnJ1bGVOYW1lLCAnaGFzIHVzZWxlc3MgYmluZGluZ3M6JywgdGhpcy51c2VsZXNzXS5qb2luKCcgJyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIER1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lc1xuXG5mdW5jdGlvbiBEdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpIHtcbiAgdGhpcy5kdXBsaWNhdGVzID0gZHVwbGljYXRlcztcbn07XG5cbkR1cGxpY2F0ZVByb3BlcnR5TmFtZXMucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEVycm9yLnByb3RvdHlwZSk7XG5cbkR1cGxpY2F0ZVByb3BlcnR5TmFtZXMucHJvdG90eXBlLmdldE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsnb2JqZWN0IHBhdHRlcm4gaGFzIGR1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lczonLCB0aGlzLmR1cGxpY2F0ZXNdLmpvaW4oJyAnKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHN5bnRheCAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiB0b0Vycm9ySW5mbyhwb3MsIHN0cikge1xuICB2YXIgbGluZU51bSA9IDE7XG4gIHZhciBjb2xOdW0gPSAxO1xuXG4gIHZhciBjdXJyUG9zID0gMDtcbiAgdmFyIGxpbmVTdGFydFBvcyA9IDA7XG5cbiAgd2hpbGUgKGN1cnJQb3MgPCBwb3MpIHtcbiAgICB2YXIgYyA9IHN0ci5jaGFyQXQoY3VyclBvcysrKTtcbiAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgIGxpbmVOdW0rKztcbiAgICAgIGNvbE51bSA9IDE7XG4gICAgICBsaW5lU3RhcnRQb3MgPSBjdXJyUG9zO1xuICAgIH0gZWxzZSBpZiAoYyAhPT0gJ1xccicpIHtcbiAgICAgIGNvbE51bSsrO1xuICAgIH1cbiAgfVxuXG4gIHZhciBsaW5lRW5kUG9zID0gc3RyLmluZGV4T2YoJ1xcbicsIGxpbmVTdGFydFBvcyk7XG4gIGlmIChsaW5lRW5kUG9zIDwgMCkge1xuICAgIGxpbmVFbmRQb3MgPSBzdHIubGVuZ3RoO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsaW5lTnVtOiBsaW5lTnVtLFxuICAgIGNvbE51bTogY29sTnVtLFxuICAgIGxpbmU6IHN0ci5zdWJzdHIobGluZVN0YXJ0UG9zLCBsaW5lRW5kUG9zIC0gbGluZVN0YXJ0UG9zKVxuICB9O1xufVxuXG5mdW5jdGlvbiBNYXRjaEZhaWx1cmUoaW5wdXRTdHJlYW0sIHJ1bGVEaWN0KSB7XG4gIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgdGhpcy5ydWxlRGljdCA9IHJ1bGVEaWN0O1xufVxuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEVycm9yLnByb3RvdHlwZSk7XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0UG9zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLmZhaWx1cmVzUG9zO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRTaG9ydE1lc3NhZ2UgPSBmdW5jdGlvbigpIHtcbiBpZiAodHlwZW9mIHRoaXMuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiAnZXJyb3IgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UG9zKCk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHRleHQgPSBtYWtlU3RyaW5nQnVmZmVyKCk7XG4gICAgdmFyIGVycm9ySW5mbyA9IHRvRXJyb3JJbmZvKHRoaXMuZ2V0UG9zKCksIHRoaXMuaW5wdXRTdHJlYW0uc291cmNlKTtcbiAgICB0ZXh0Lm5leHRQdXRBbGwodGhpcy5nZXRMaW5lQW5kQ29sVGV4dCgpKTtcbiAgICB0ZXh0Lm5leHRQdXRBbGwoJzogZXhwZWN0ZWQgJyk7XG4gICAgdGV4dC5uZXh0UHV0QWxsKHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCkpO1xuICAgIHJldHVybiB0ZXh0LmNvbnRlbnRzKCk7XG4gIH1cbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0TWVzc2FnZSA9IGZ1bmN0aW9uKCkge1xuIGlmICh0eXBlb2YgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuICdlcnJvciBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRQb3MoKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGV4dCA9IG1ha2VTdHJpbmdCdWZmZXIoKTtcbiAgICB2YXIgZXJyb3JJbmZvID0gdG9FcnJvckluZm8odGhpcy5nZXRQb3MoKSwgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UpO1xuICAgIHZhciBsaW5lQW5kQ29sVGV4dCA9IHRoaXMuZ2V0TGluZUFuZENvbFRleHQoKSArICc6ICc7XG4gICAgdGV4dC5uZXh0UHV0QWxsKGxpbmVBbmRDb2xUZXh0KTtcbiAgICB0ZXh0Lm5leHRQdXRBbGwoZXJyb3JJbmZvLmxpbmUpO1xuICAgIHRleHQubmV4dFB1dEFsbCgnXFxuJyk7XG4gICAgZm9yICh2YXIgaWR4ID0gMTsgaWR4IDwgbGluZUFuZENvbFRleHQubGVuZ3RoICsgZXJyb3JJbmZvLmNvbE51bTsgaWR4KyspIHtcbiAgICAgIHRleHQubmV4dFB1dEFsbCgnICcpO1xuICAgIH1cbiAgICB0ZXh0Lm5leHRQdXRBbGwoJ14nKTtcbiAgfVxuICB0ZXh0Lm5leHRQdXRBbGwoJ1xcbkV4cGVjdGVkOiAnKTtcbiAgdGV4dC5uZXh0UHV0QWxsKHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCkpO1xuICByZXR1cm4gdGV4dC5jb250ZW50cygpO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRMaW5lQW5kQ29sVGV4dCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZXJyb3JJbmZvID0gdG9FcnJvckluZm8odGhpcy5nZXRQb3MoKSwgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UpO1xuICByZXR1cm4gJ0xpbmUgJyArIGVycm9ySW5mby5saW5lTnVtICsgJywgY29sICcgKyBlcnJvckluZm8uY29sTnVtO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRFeHBlY3RlZFRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRleHQgPSBtYWtlU3RyaW5nQnVmZmVyKCk7XG4gIHZhciBleHBlY3RlZCA9IHRoaXMuZ2V0RXhwZWN0ZWQoKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZXhwZWN0ZWQubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBpZiAoaWR4ID09PSBleHBlY3RlZC5sZW5ndGggLSAxKSB7XG4gICAgICAgIHRleHQubmV4dFB1dEFsbChleHBlY3RlZC5sZW5ndGggPiAyID8gJywgb3IgJyA6ICcgb3IgJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0Lm5leHRQdXRBbGwoJywgJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHRleHQubmV4dFB1dEFsbChleHBlY3RlZFtpZHhdKTtcbiAgfVxuICByZXR1cm4gdGV4dC5jb250ZW50cygpO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRFeHBlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZXhwZWN0ZWQgPSB7fTtcbiAgZm9yICh2YXIgZmFpbHVyZSA9IHRoaXMuaW5wdXRTdHJlYW0uZmFpbHVyZXM7IGZhaWx1cmUgIT09IG51bGw7IGZhaWx1cmUgPSBmYWlsdXJlLm5leHQpIHtcbiAgICBleHBlY3RlZFtmYWlsdXJlLmV4cHIudG9FeHBlY3RlZCh0aGlzLnJ1bGVEaWN0KV0gPSB0cnVlO1xuICB9XG4gIHJldHVybiBPYmplY3Qua2V5cyhleHBlY3RlZCkucmV2ZXJzZSgpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuVW5kZWNsYXJlZEdyYW1tYXIgPSBVbmRlY2xhcmVkR3JhbW1hcjtcbmV4cG9ydHMuRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uID0gRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uO1xuZXhwb3J0cy5VbmRlY2xhcmVkUnVsZSA9IFVuZGVjbGFyZWRSdWxlO1xuZXhwb3J0cy5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24gPSBEdXBsaWNhdGVSdWxlRGVjbGFyYXRpb247XG5leHBvcnRzLlJ1bGVNdXN0UHJvZHVjZVZhbHVlID0gUnVsZU11c3RQcm9kdWNlVmFsdWU7XG5leHBvcnRzLkluY29uc2lzdGVudEJpbmRpbmdzID0gSW5jb25zaXN0ZW50QmluZGluZ3M7XG5leHBvcnRzLkR1cGxpY2F0ZUJpbmRpbmdzID0gRHVwbGljYXRlQmluZGluZ3M7XG5leHBvcnRzLlVzZWxlc3NCaW5kaW5ncyA9IFVzZWxlc3NCaW5kaW5ncztcbmV4cG9ydHMuRHVwbGljYXRlUHJvcGVydHlOYW1lcyA9IER1cGxpY2F0ZVByb3BlcnR5TmFtZXM7XG5leHBvcnRzLk1hdGNoRmFpbHVyZSA9IE1hdGNoRmFpbHVyZTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXIuanMnKTtcblxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXIuanMnKTtcbnZhciBOYW1lc3BhY2UgPSByZXF1aXJlKCcuL05hbWVzcGFjZS5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgdW5lc2NhcGVDaGFyID0gYXdsaWIuc3RyaW5nVXRpbHMudW5lc2NhcGVDaGFyO1xuXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHM7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSB7XG4gIHZhciBidWlsZGVyO1xuICByZXR1cm4ge1xuICAgIHNwYWNlOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgIHNwYWNlX211bHRpTGluZTogICAgICAgICAgICBmdW5jdGlvbigpICAgIHt9LFxuICAgIHNwYWNlX3NpbmdsZUxpbmU6ICAgICAgICAgICBmdW5jdGlvbigpICAgIHt9LFxuXG4gICAgcnVsZURlc2NyOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyBidWlsZGVyLnNldFJ1bGVEZXNjcmlwdGlvbihlbnYudCk7IH0sXG4gICAgcnVsZURlc2NyVGV4dDogICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50czsgfSxcblxuICAgIGNhc2VOYW1lOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi5uIH0sXG5cbiAgICBuYW1lOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzOyB9LFxuICAgIG5hbWVGaXJzdDogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgIG5hbWVSZXN0OiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuXG4gICAgaWRlbnQ6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52Lm47IH0sXG5cbiAgICBrZXl3b3JkOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAga2V5d29yZF91bmRlZmluZWQ6ICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gdW5kZWZpbmVkOyB9LFxuICAgIGtleXdvcmRfbnVsbDogICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIG51bGw7IH0sXG4gICAga2V5d29yZF90cnVlOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gdHJ1ZTsgfSxcbiAgICBrZXl3b3JkX2ZhbHNlOiAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBmYWxzZTsgfSxcblxuICAgIHN0cmluZzogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW52LmNzLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiB1bmVzY2FwZUNoYXIoYyk7IH0pLmpvaW4oJycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIHNDaGFyOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7IH0sXG4gICAgcmVnRXhwOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gbmV3IFJlZ0V4cChlbnYuZSk7IH0sXG4gICAgcmVDaGFyQ2xhc3M6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50czsgfSxcbiAgICBudW1iZXI6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKTsgfSxcblxuICAgIEFsdDogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBBbHRfcmVjOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmFsdChlbnYueCwgZW52LnkpOyB9LFxuXG4gICAgVGVybTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIFRlcm1faW5saW5lOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuaW5saW5lKGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lICsgJ18nICsgZW52Lm4sIGVudi54KTsgfSxcblxuICAgIFNlcTogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuc2VxLmFwcGx5KGJ1aWxkZXIsIGVudi52YWx1ZSk7IH0sXG5cbiAgICBGYWN0b3I6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgRmFjdG9yX2JpbmQ6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5iaW5kKGVudi54LCBlbnYubik7IH0sXG5cbiAgICBJdGVyOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgSXRlcl9zdGFyOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5tYW55KGVudi54LCAwKTsgfSxcbiAgICBJdGVyX3BsdXM6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm1hbnkoZW52LngsIDEpOyB9LFxuICAgIEl0ZXJfb3B0OiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIub3B0KGVudi54KTsgfSxcblxuICAgIFByZWQ6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBQcmVkX25vdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm5vdChlbnYueCk7IH0sXG4gICAgUHJlZF9sb29rYWhlYWQ6ICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5sYShlbnYueCk7IH0sXG5cbiAgICBCYXNlOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgQmFzZV91bmRlZmluZWQ6ICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gYnVpbGRlci5wcmltKHVuZGVmaW5lZCk7IH0sXG4gICAgQmFzZV9udWxsOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gYnVpbGRlci5wcmltKG51bGwpOyB9LFxuICAgIEJhc2VfdHJ1ZTogICAgICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIGJ1aWxkZXIucHJpbSh0cnVlKTsgfSxcbiAgICBCYXNlX2ZhbHNlOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBidWlsZGVyLnByaW0oZmFsc2UpOyB9LFxuICAgIEJhc2VfYXBwbGljYXRpb246ICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGVudi5ydWxlTmFtZSk7IH0sXG4gICAgQmFzZV9wcmltOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5wcmltKGVudi52YWx1ZSk7IH0sXG4gICAgQmFzZV9sc3Q6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5sc3QoZW52LngpOyB9LFxuICAgIEJhc2Vfc3RyOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuc3RyKGVudi54KTsgfSxcbiAgICBCYXNlX3BhcmVuOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYueDsgfSxcbiAgICBCYXNlX29iajogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9iaihbXSwgZW52LmxlbmllbnQpOyB9LFxuICAgIEJhc2Vfb2JqV2l0aFByb3BzOiAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIub2JqKGVudi5wcywgZW52LmxlbmllbnQpOyB9LFxuXG4gICAgUHJvcHM6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIFByb3BzX2Jhc2U6ICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIFtlbnYucF07IH0sXG4gICAgUHJvcHNfcmVjOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gW2Vudi5wXS5jb25jYXQoZW52LnBzKTsgfSxcbiAgICBQcm9wOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiB7bmFtZTogZW52Lm4sIHBhdHRlcm46IGVudi5wfTsgfSxcblxuICAgIFJ1bGU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBSdWxlX2RlZmluZTogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYubjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYuZDsgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5kZWZpbmUoZW52Lm4sIGVudi5iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBSdWxlX292ZXJyaWRlOiAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYubjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnYuZDsgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5vdmVycmlkZShlbnYubiwgZW52LmIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIFJ1bGVfZXh0ZW5kOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSA9IGVudi5uO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5kOyAgLy8gZm9yY2UgZXZhbHVhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmV4dGVuZChlbnYubiwgZW52LmIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgU3VwZXJHcmFtbWFyOiAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyBidWlsZGVyLnNldFN1cGVyR3JhbW1hcihlbnYudmFsdWUpOyB9LFxuICAgIFN1cGVyR3JhbW1hcl9xdWFsaWZpZWQ6ICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIHRoaXNNb2R1bGUubmFtZXNwYWNlKGVudi5ucykuZ2V0R3JhbW1hcihlbnYubik7IH0sXG4gICAgU3VwZXJHcmFtbWFyX3VucXVhbGlmaWVkOiAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHROYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHROYW1lc3BhY2UuZ2V0R3JhbW1hcihlbnYubik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZEdyYW1tYXIoZW52Lm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgIEdyYW1tYXI6ICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLnNldE5hbWUoZW52Lm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5zOyAgLy8gZm9yY2UgZXZhbHVhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5yczsgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZChvcHROYW1lc3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIEdyYW1tYXJzOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIHdoYXRJdElzLCBvcHROYW1lc3BhY2UpIHtcbiAgdHJ5IHtcbiAgICB2YXIgdGh1bmsgPSB0aGlzTW9kdWxlLl9vaG1HcmFtbWFyLm1hdGNoQ29udGVudHMoc291cmNlLCB3aGF0SXRJcywgdHJ1ZSk7XG4gICAgcmV0dXJuIHRodW5rKG1ha2VHcmFtbWFyQWN0aW9uRGljdChvcHROYW1lc3BhY2UpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlIGluc3RhbmNlb2YgZXJyb3JzLk1hdGNoRmFpbHVyZSkge1xuICAgICAgY29uc29sZS5sb2coJ1xcbicgKyBlLmdldE1lc3NhZ2UoKSk7XG4gICAgfVxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXIoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXInLCBvcHROYW1lc3BhY2UpO1xufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXJzJywgb3B0TmFtZXNwYWNlKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcblxudmFyIG5hbWVzcGFjZXMgPSB7fTtcbmV4cG9ydHMubmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAobmFtZXNwYWNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbmFtZXNwYWNlc1tuYW1lXSA9IG5ldyBOYW1lc3BhY2UobmFtZSk7XG4gIH1cbiAgcmV0dXJuIG5hbWVzcGFjZXNbbmFtZV07XG59O1xuXG5leHBvcnRzLm1ha2UgPSBmdW5jdGlvbihyZWNpcGUpIHtcbiAgcmV0dXJuIHJlY2lwZSh0aGlzTW9kdWxlKTtcbn07XG5cbmV4cG9ydHMubWFrZUdyYW1tYXIgPSBtYWtlR3JhbW1hcjtcbmV4cG9ydHMubWFrZUdyYW1tYXJzID0gbWFrZUdyYW1tYXJzO1xuXG4vLyBTdHVmZiB0aGF0J3Mgb25seSBoZXJlIGZvciBib290c3RyYXBwaW5nLCB0ZXN0aW5nLCBldGMuXG5cbmV4cG9ydHMuX2J1aWxkZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCdWlsZGVyKCk7XG59O1xuXG5leHBvcnRzLl9tYWtlR3JhbW1hckFjdGlvbkRpY3QgPSBtYWtlR3JhbW1hckFjdGlvbkRpY3Q7XG5cbnZhciBvaG1HcmFtbWFyO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfb2htR3JhbW1hcicsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW9obUdyYW1tYXIpIHtcbiAgICAgIG9obUdyYW1tYXIgPSB0aGlzLl9vaG1HcmFtbWFyRmFjdG9yeSh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIG9obUdyYW1tYXI7XG4gIH1cbn0pO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuZW5kLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICB2YXIgYW5zID0gZmFsc2U7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgIGFucyB8PSB0ZXJtLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKTtcbiAgfVxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICB2YXIgYW5zID0gZmFsc2U7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdO1xuICAgIGFucyB8PSBmYWN0b3IuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIGZhbHNlKTtcbiAgfVxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdHJ1ZSk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKTtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIGZhbHNlKTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIGZhbHNlKTtcbn07XG5cbnBleHBycy5MaXN0LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIGZhbHNlKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgZmFsc2UpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIGlmICghdmFsdWVSZXF1aXJlZCB8fCBkaWN0W3RoaXMucnVsZU5hbWVdKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBkaWN0W3RoaXMucnVsZU5hbWVdID0gdHJ1ZTtcbiAgfVxufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBlcXVhbHMgPSBhd2xpYi5lcXVhbHMuZXF1YWxzO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5lbmQuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuYW1lcyA9IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKCk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgIHRlcm0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MoKTtcbiAgICB2YXIgb3RoZXJOYW1lcyA9IHRlcm0uZ2V0QmluZGluZ05hbWVzKCk7XG4gICAgaWYgKCFlcXVhbHMobmFtZXMsIG90aGVyTmFtZXMpKSB7XG4gICAgICB0aHJvdyBuZXcgZXJyb3JzLkluY29uc2lzdGVudEJpbmRpbmdzKHJ1bGVOYW1lLCBuYW1lcywgb3RoZXJOYW1lcyk7XG4gICAgfVxuICB9XG59O1xuXG5wZXhwcnMuRXh0ZW5kQWx0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIE9ubHkgaGFzIHR3byB0ZXJtcywgdGhlIHNlY29uZCBvZiB3aGljaCBoYXMgdGhlIGV4cGVjdGVkIGJpbmRpbmdzLlxuICB2YXIgbmFtZXMgPSB0aGlzLnRlcm1zWzFdLmdldEJpbmRpbmdOYW1lcygpO1xuICB2YXIgb3RoZXJOYW1lcyA9IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKCk7XG4gIGlmICghZXF1YWxzKG5hbWVzLCBvdGhlck5hbWVzKSkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuSW5jb25zaXN0ZW50QmluZGluZ3MocnVsZU5hbWUsIG5hbWVzLCBvdGhlck5hbWVzKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5lbmQuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxuXG4gIHZhciBkdXBsaWNhdGVzID0gY29tbW9uLmdldER1cGxpY2F0ZXModGhpcy5nZXRCaW5kaW5nTmFtZXMoKSk7XG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lLCBkdXBsaWNhdGVzKTtcbiAgfVxufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5TdHIucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cblxuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKHRoaXMuZ2V0QmluZGluZ05hbWVzKCkpO1xuICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSwgZHVwbGljYXRlcyk7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gYXNzZXJ0Tm9CaW5kaW5ncyhydWxlTmFtZSwgZXhwcikge1xuICB2YXIgYmluZGluZ3MgPSBleHByLmdldEJpbmRpbmdOYW1lcygpO1xuICBpZiAoYmluZGluZ3MubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lLCBiaW5kaW5ncyk7XG4gIH1cbn1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5lbmQuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIGFzc2VydE5vQmluZGluZ3MocnVsZU5hbWUsIHRoaXMuZXhwcik7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIGFzc2VydE5vQmluZGluZ3MocnVsZU5hbWUsIHRoaXMuZXhwcik7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIGFzc2VydE5vQmluZGluZ3MocnVsZU5hbWUsIHRoaXMuZXhwcik7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xudmFyIHRodW5rcyA9IHJlcXVpcmUoJy4vdGh1bmtzLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBza2lwU3BhY2VzID0gcmVxdWlyZSgnLi9za2lwU3BhY2VzLmpzJyk7XG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgYnJvd3NlciA9IGF3bGliLmJyb3dzZXI7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmV2YWwgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKSB7XG4gICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICB9XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgdmFsdWUgPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmICh2YWx1ZSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICBpZiAocmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgIGlucHV0U3RyZWFtLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IHRodW5rcy5WYWx1ZVRodW5rKHZhbHVlKTtcbiAgfVxufTtcblxucGV4cHJzLmVuZC5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKSB7XG4gICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICB9XG4gIGlmIChpbnB1dFN0cmVhbS5hdEVuZCgpKSB7XG4gICAgcmV0dXJuIHRodW5rcy51bmRlZmluZWRUaHVuaztcbiAgfSBlbHNlIHtcbiAgICBpZiAocmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgIGlucHV0U3RyZWFtLnJlY29yZEZhaWx1cmUoaW5wdXRTdHJlYW0ucG9zLCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICB9XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgaWYgKHRoaXMubWF0Y2goaW5wdXRTdHJlYW0pID09PSBjb21tb24uZmFpbCkge1xuICAgIGlmIChyZWNvcmRGYWlsdXJlcykge1xuICAgICAgaW5wdXRTdHJlYW0ucmVjb3JkRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgdGh1bmtzLlZhbHVlVGh1bmsodGhpcy5vYmopO1xuICB9XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hFeGFjdGx5KHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5TdHJpbmdQcmltLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gIHJldHVybiBpbnB1dFN0cmVhbS5tYXRjaFN0cmluZyh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmVnRXhwUHJpbS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgaWYgKGlucHV0U3RyZWFtLm1hdGNoUmVnRXhwKHRoaXMub2JqKSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICBpZiAocmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgIGlucHV0U3RyZWFtLnJlY29yZEZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IHRodW5rcy5WYWx1ZVRodW5rKGlucHV0U3RyZWFtLnNvdXJjZVtvcmlnUG9zXSk7XG4gIH1cbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgb3JpZ051bUJpbmRpbmdzID0gYmluZGluZ3MubGVuZ3RoO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoc3ludGFjdGljKSB7XG4gICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gICAgfVxuICAgIHZhciB2YWx1ZSA9IHRoaXMudGVybXNbaWR4XS5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICAgIGlmICh2YWx1ZSAhPT0gY29tbW9uLmZhaWwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgIC8vIE5vdGU6IHdoaWxlIHRoZSBmb2xsb3dpbmcgYXNzaWdubWVudCBjb3VsZCBiZSBkb25lIHVuY29uZGl0aW9uYWxseSwgb25seSBkb2luZyBpdCB3aGVuIG5lY2Vzc2FyeSBpc1xuICAgICAgLy8gYmV0dGVyIGZvciBwZXJmb3JtYW5jZS4gVGhpcyBpcyBiL2MgYXNzaWduaW5nIHRvIGFuIGFycmF5J3MgbGVuZ3RoIHByb3BlcnR5IGlzIG1vcmUgZXhwZW5zaXZlIHRoYW4gYVxuICAgICAgLy8gdHlwaWNhbCBhc3NpZ25tZW50LlxuICAgICAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IG9yaWdOdW1CaW5kaW5ncykge1xuICAgICAgICBiaW5kaW5ncy5sZW5ndGggPSBvcmlnTnVtQmluZGluZ3M7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb21tb24uZmFpbDtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKHN5bnRhY3RpYykge1xuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgIH1cbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgdmFyIHZhbHVlID0gZmFjdG9yLmV2YWwocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncyk7XG4gICAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbCkge1xuICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGh1bmtzLnVuZGVmaW5lZFRodW5rO1xufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsKSB7XG4gICAgYmluZGluZ3MucHVzaCh0aGlzLm5hbWUsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIG51bU1hdGNoZXMgPSAwO1xuICB2YXIgbWF0Y2hlcyA9IHRoaXMuZXhwci5wcm9kdWNlc1ZhbHVlKCkgPyBbXSA6IHVuZGVmaW5lZDtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICB2YXIgYmFja3RyYWNrUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pO1xuICAgIGlmICh2YWx1ZSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IGJhY2t0cmFja1BvcztcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBudW1NYXRjaGVzKys7XG4gICAgICBpZiAobWF0Y2hlcykge1xuICAgICAgICBtYXRjaGVzLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAobnVtTWF0Y2hlcyA8IHRoaXMubWluTnVtTWF0Y2hlcykge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbWF0Y2hlcyA/IG5ldyB0aHVua3MuTGlzdFRodW5rKG1hdGNoZXMpIDogdGh1bmtzLnVuZGVmaW5lZFRodW5rO1xuICB9XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSk7XG4gIGlmICh2YWx1ZSA9PT0gY29tbW9uLmZhaWwpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0aHVua3MudW5kZWZpbmVkVGh1bms7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5wcm9kdWNlc1ZhbHVlKCkgPyB2YWx1ZSA6IHRodW5rcy50cnVlVGh1bms7XG4gIH1cbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChmYWxzZSwgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKTtcbiAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIGlmIChyZWNvcmRGYWlsdXJlcykge1xuICAgICAgaW5wdXRTdHJlYW0ucmVjb3JkRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgcmV0dXJuIHRodW5rcy51bmRlZmluZWRUaHVuaztcbiAgfVxufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pO1xuICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24ocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKSB7XG4gICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICB9XG4gIHZhciBzdHJpbmcgPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmICh0eXBlb2Ygc3RyaW5nID09PSAnc3RyaW5nJykge1xuICAgIHZhciBzdHJpbmdJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihzdHJpbmcpO1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBzdHJpbmdJbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICAgIHJldHVybiB2YWx1ZSAhPT0gY29tbW9uLmZhaWwgJiYgc3RyaW5nSW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgdGh1bmtzLlZhbHVlVGh1bmsoc3RyaW5nKSA6IGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfVxufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGlmIChzeW50YWN0aWMpIHtcbiAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gIH1cbiAgdmFyIGxpc3QgPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChsaXN0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB2YXIgbGlzdElucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKGxpc3QpO1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBsaXN0SW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgICByZXR1cm4gdmFsdWUgIT09IGNvbW1vbi5mYWlsICYmIGxpc3RJbnB1dFN0cmVhbS5hdEVuZCgpID8gIG5ldyB0aHVua3MuVmFsdWVUaHVuayhsaXN0KSA6IGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfVxufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAob2JqICE9PSBjb21tb24uZmFpbCAmJiBvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpKSB7XG4gICAgdmFyIG51bU93blByb3BlcnRpZXNNYXRjaGVkID0gMDtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzW2lkeF07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XG4gICAgICB2YXIgdmFsdWVJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihbdmFsdWVdKTtcbiAgICAgIHZhciBtYXRjaGVkID1cbiAgICAgICAgICBwcm9wZXJ0eS5wYXR0ZXJuLmV2YWwocmVjb3JkRmFpbHVyZXMsIHN5bnRhY3RpYywgcnVsZURpY3QsIHZhbHVlSW5wdXRTdHJlYW0sIGJpbmRpbmdzKSAhPT0gY29tbW9uLmZhaWwgJiZcbiAgICAgICAgICB2YWx1ZUlucHV0U3RyZWFtLmF0RW5kKCk7XG4gICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgICAgfVxuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCsrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pc0xlbmllbnQgfHwgbnVtT3duUHJvcGVydGllc01hdGNoZWQgPT09IE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID9cbiAgICAgICAgbmV3IHRodW5rcy5WYWx1ZVRodW5rKG9iaikgOlxuICAgICAgICBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZTtcbiAgdmFyIG9yaWdQb3NJbmZvID0gaW5wdXRTdHJlYW0uZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgdmFyIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXTtcbiAgaWYgKG1lbW9SZWMgJiYgb3JpZ1Bvc0luZm8uc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBtZW1vUmVjLnBvcztcbiAgICByZXR1cm4gbWVtb1JlYy52YWx1ZTtcbiAgfSBlbHNlIGlmIChvcmlnUG9zSW5mby5pc0FjdGl2ZShydWxlTmFtZSkpIHtcbiAgICB2YXIgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uZ2V0Q3VycmVudExlZnRSZWN1cnNpb24oKTtcbiAgICBpZiAoY3VycmVudExSICYmIGN1cnJlbnRMUi5uYW1lID09PSBydWxlTmFtZSkge1xuICAgICAgb3JpZ1Bvc0luZm8udXBkYXRlSW52b2x2ZWRSdWxlcygpO1xuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gY3VycmVudExSLnBvcztcbiAgICAgIHJldHVybiBjdXJyZW50TFIudmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9yaWdQb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbihydWxlTmFtZSk7XG4gICAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBib2R5ID0gcnVsZURpY3RbcnVsZU5hbWVdO1xuICAgIGlmICghYm9keSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkUnVsZShydWxlTmFtZSk7XG4gICAgfVxuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIG9yaWdQb3NJbmZvLmVudGVyKHJ1bGVOYW1lKTtcbiAgICB2YXIgcmYgPSByZWNvcmRGYWlsdXJlcyAmJiAhYm9keS5kZXNjcmlwdGlvbjtcbiAgICB2YXIgcnVsZUlzU3ludGFjdGljID0gY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJmLCBydWxlSXNTeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gICAgdmFyIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgaWYgKGN1cnJlbnRMUikge1xuICAgICAgaWYgKGN1cnJlbnRMUi5uYW1lID09PSBydWxlTmFtZSkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuaGFuZGxlTGVmdFJlY3Vyc2lvbihib2R5LCByZiwgcnVsZUlzU3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3MsIGN1cnJlbnRMUiwgdmFsdWUpO1xuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9XG4gICAgICAgICAge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWUsIGludm9sdmVkUnVsZXM6IGN1cnJlbnRMUi5pbnZvbHZlZFJ1bGVzfTtcbiAgICAgICAgb3JpZ1Bvc0luZm8uZW5kTGVmdFJlY3Vyc2lvbihydWxlTmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKCFjdXJyZW50TFIuaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0pIHtcbiAgICAgICAgLy8gT25seSBtZW1vaXplIGlmIHRoaXMgcnVsZSBpcyBub3QgaW52b2x2ZWQgaW4gdGhlIGN1cnJlbnQgbGVmdCByZWN1cnNpb25cbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID0ge3BvczogaW5wdXRTdHJlYW0ucG9zLCB2YWx1ZTogdmFsdWV9O1xuICAgIH1cbiAgICBvcmlnUG9zSW5mby5leGl0KHJ1bGVOYW1lKTtcbiAgICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsICYmIHJlY29yZEZhaWx1cmVzICYmIGJvZHkuZGVzY3JpcHRpb24pIHtcbiAgICAgIHZhciBlcnJvclBvcztcbiAgICAgIGlmIChib2R5LmRlc2NyaXB0aW9uICYmIHJ1bGVJc1N5bnRhY3RpYykge1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgICBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gICAgICAgIGVycm9yUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3JQb3MgPSBvcmlnUG9zO1xuICAgICAgfVxuICAgICAgaW5wdXRTdHJlYW0ucmVjb3JkRmFpbHVyZShlcnJvclBvcywgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ldmFsT25jZSA9IGZ1bmN0aW9uKGV4cHIsIHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGJpbmRpbmdzID0gW107XG4gIHZhciB2YWx1ZSA9IGV4cHIuZXZhbChyZWNvcmRGYWlsdXJlcywgc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbCkge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IHRodW5rcy5SdWxlVGh1bmsodGhpcy5ydWxlTmFtZSwgaW5wdXRTdHJlYW0uc291cmNlLCBvcmlnUG9zLCBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlLCBiaW5kaW5ncyk7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuaGFuZGxlTGVmdFJlY3Vyc2lvbiA9IGZ1bmN0aW9uKGJvZHksIHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgb3JpZ1BvcywgY3VycmVudExSLCBzZWVkVmFsdWUpIHtcbiAgdmFyIHZhbHVlID0gc2VlZFZhbHVlO1xuICBpZiAoc2VlZFZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIGN1cnJlbnRMUi52YWx1ZSA9IHNlZWRWYWx1ZTtcbiAgICBjdXJyZW50TFIucG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJlY29yZEZhaWx1cmVzLCBzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gICAgICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsICYmIGlucHV0U3RyZWFtLnBvcyA+IGN1cnJlbnRMUi5wb3MpIHtcbiAgICAgICAgY3VycmVudExSLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIGN1cnJlbnRMUi5wb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IGN1cnJlbnRMUi52YWx1ZTtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gY3VycmVudExSLnBvcztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGJpbmRpbmdzIC0tIHRoaXMgcHJvcGVydHkgaXMgY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwID8gW10gOiB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYW1lcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KHRoaXMuZmFjdG9yc1tpZHhdLmdldEJpbmRpbmdOYW1lcygpKTtcbiAgfVxuICByZXR1cm4gbmFtZXMuc29ydCgpO1xufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gW3RoaXMubmFtZV07XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRCaW5kaW5nTmFtZXMoKTtcbn07XG5cbnBleHBycy5TdHIucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBuYW1lcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIG5hbWVzID0gbmFtZXMuY29uY2F0KHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uZ2V0QmluZGluZ05hbWVzKCkpO1xuICB9XG4gIHJldHVybiBuYW1lcy5zb3J0KCk7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBwcmludFN0cmluZyA9IGF3bGliLnN0cmluZ1V0aWxzLnByaW50U3RyaW5nO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnl0aGluZy5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IucHJpbSgnKTtcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLm9iaikpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLmFsdCgnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJywgJyk7XG4gICAgfVxuICAgIHRoaXMudGVybXNbaWR4XS5vdXRwdXRSZWNpcGUod3MpO1xuICB9XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2Iuc2VxKCcpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcsICcpO1xuICAgIH1cbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5vdXRwdXRSZWNpcGUod3MpO1xuICB9XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLmJpbmQoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcsICcpO1xuICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMubmFtZSkpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5tYW55KCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnLCAnKTtcbiAgd3MubmV4dFB1dEFsbCh0aGlzLm1pbk51bU1hdGNoZXMpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLm9wdCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2Iubm90KCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5sYSgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5TdHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2Iuc3RyKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IubHN0KCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgZnVuY3Rpb24gb3V0cHV0UHJvcGVydHlSZWNpcGUocHJvcCkge1xuICAgIHdzLm5leHRQdXRBbGwoJ3tuYW1lOiAnKTtcbiAgICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHByb3AubmFtZSkpO1xuICAgIHdzLm5leHRQdXRBbGwoJywgcGF0dGVybjogJyk7XG4gICAgcHJvcC5wYXR0ZXJuLm91dHB1dFJlY2lwZSh3cyk7XG4gICAgd3MubmV4dFB1dEFsbCgnfScpO1xuICB9XG5cbiAgd3MubmV4dFB1dEFsbCgnYi5vYmooWycpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcsICcpO1xuICAgIH1cbiAgICBvdXRwdXRQcm9wZXJ0eVJlY2lwZSh0aGlzLnByb3BlcnRpZXNbaWR4XSk7XG4gIH1cbiAgd3MubmV4dFB1dEFsbCgnXSwgJyk7XG4gIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcoISF0aGlzLmlzTGVuaWVudCkpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IuYXBwKCcpO1xuICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMucnVsZU5hbWUpKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUucHJvZHVjZXNWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoIXRoaXMudGVybXNbaWR4XS5wcm9kdWNlc1ZhbHVlKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnByb2R1Y2VzVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLnByb2R1Y2VzVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5wcm9kdWNlc1ZhbHVlKCk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIHByaW50U3RyaW5nID0gYXdsaWIuc3RyaW5nVXRpbHMucHJpbnRTdHJpbmc7XG52YXIgbWFrZVN0cmluZ0J1ZmZlciA9IGF3bGliLm9iamVjdFV0aWxzLnN0cmluZ0J1ZmZlcjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIHJldHVybiB1bmRlZmluZWQ7XG59O1xuXG5wZXhwcnMuYW55dGhpbmcudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIHJldHVybiBcImFueSBvYmplY3RcIjtcbn07XG5cbnBleHBycy5lbmQudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIHJldHVybiBcImVuZCBvZiBpbnB1dFwiO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICByZXR1cm4gcHJpbnRTdHJpbmcodGhpcy5vYmopO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9FeHBlY3RlZCA9IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gIHJldHVybiBcIm5vIFwiICsgdGhpcy5leHByLnRvRXhwZWN0ZWQoKTtcbn07XG5cbi8vIFRPRE86IHRoaW5rIGFib3V0IFN0ciwgTGlzdCwgYW5kIE9ialxuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRXhwZWN0ZWQgPSBmdW5jdGlvbihydWxlRGljdCkge1xuICB2YXIgZGVzY3JpcHRpb24gPSBydWxlRGljdFt0aGlzLnJ1bGVOYW1lXS5kZXNjcmlwdGlvbjtcbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgcmV0dXJuIGRlc2NyaXB0aW9uO1xuICB9IGVsc2Uge1xuICAgIHZhciBhcnRpY2xlID0gL15bYWVpb3VBRUlPVV0vLnRlc3QodGhpcy5ydWxlTmFtZSkgPyBcImFuXCIgOiBcImFcIjtcbiAgICByZXR1cm4gYXJ0aWNsZSArIFwiIFwiICsgdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG5mdW5jdGlvbiBQRXhwcigpIHtcbiAgdGhyb3cgJ1BFeHByIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jztcbn1cblxuLy8gQW55dGhpbmdcblxudmFyIGFueXRoaW5nID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEVuZFxuXG52YXIgZW5kID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFByaW1pdGl2ZXNcblxuZnVuY3Rpb24gUHJpbShvYmopIHtcbiAgdGhpcy5vYmogPSBvYmo7XG59XG5cblByaW0ucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFN0cmluZ1ByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuXG5TdHJpbmdQcmltLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIFJlZ0V4cFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuXG5SZWdFeHBQcmltLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQcmltLnByb3RvdHlwZSk7XG5cbi8vIEFsdGVybmF0aW9uXG5cbmZ1bmN0aW9uIEFsdCh0ZXJtcykge1xuICB0aGlzLnRlcm1zID0gdGVybXM7XG59XG5cbkFsdC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gRXh0ZW5kQWx0IGlzIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbCBvZiBydWxlIGV4dGVuc2lvblxuXG5mdW5jdGlvbiBFeHRlbmRBbHQoZXh0ZW5zaW9ucywgYmFzZSkge1xuICB0aGlzLnRlcm1zID0gW2V4dGVuc2lvbnMsIGJhc2VdO1xufVxuXG5FeHRlbmRBbHQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKEFsdC5wcm90b3R5cGUpO1xuXG4vLyBTZXF1ZW5jZXNcblxuZnVuY3Rpb24gU2VxKGZhY3RvcnMpIHtcbiAgdGhpcy5mYWN0b3JzID0gZmFjdG9ycztcbn1cblxuU2VxLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBCaW5kaW5nc1xuXG5mdW5jdGlvbiBCaW5kKGV4cHIsIG5hbWUpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbn1cblxuQmluZC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gTWFueShleHByLCBtaW5OdW1NYXRjaGVzKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG4gIHRoaXMubWluTnVtTWF0Y2hlcyA9IG1pbk51bU1hdGNoZXM7XG59XG5cbk1hbnkucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5cbk9wdC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5Ob3QucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5cbkxvb2thaGVhZC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gU3RyaW5nIGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gU3RyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cblxuU3RyLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBMaXN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gTGlzdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5cbkxpc3QucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWU7IH0pO1xuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKG5hbWVzKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUHJvcGVydHlOYW1lcyhkdXBsaWNhdGVzKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIHRoaXMuaXNMZW5pZW50ID0gaXNMZW5pZW50O1xuICB9XG59XG5cbk9iai5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gUnVsZSBhcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBBcHBseShydWxlTmFtZSkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG59XG5cbkFwcGx5LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5tYWtlUHJpbSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBuZXcgU3RyaW5nUHJpbShvYmopO1xuICB9XG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwUHJpbShvYmopO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJpbShvYmopO1xuICB9XG59O1xuXG5leHBvcnRzLlBFeHByID0gUEV4cHI7XG5leHBvcnRzLmFueXRoaW5nID0gYW55dGhpbmc7XG5leHBvcnRzLmVuZCA9IGVuZDtcbmV4cG9ydHMuUHJpbSA9IFByaW07XG5leHBvcnRzLlN0cmluZ1ByaW0gPSBTdHJpbmdQcmltO1xuZXhwb3J0cy5SZWdFeHBQcmltID0gUmVnRXhwUHJpbTtcbmV4cG9ydHMuQWx0ID0gQWx0O1xuZXhwb3J0cy5FeHRlbmRBbHQgPSBFeHRlbmRBbHQ7XG5leHBvcnRzLlNlcSA9IFNlcTtcbmV4cG9ydHMuQmluZCA9IEJpbmQ7XG5leHBvcnRzLk1hbnkgPSBNYW55O1xuZXhwb3J0cy5PcHQgPSBPcHQ7XG5leHBvcnRzLk5vdCA9IE5vdDtcbmV4cG9ydHMuTG9va2FoZWFkID0gTG9va2FoZWFkO1xuZXhwb3J0cy5TdHIgPSBTdHI7XG5leHBvcnRzLkxpc3QgPSBMaXN0O1xuZXhwb3J0cy5PYmogPSBPYmo7XG5leHBvcnRzLkFwcGx5ID0gQXBwbHk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHRlbnNpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5yZXF1aXJlKCcuL3BleHBycy1hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24uanMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MuanMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydE5vVXNlbGVzc0JpbmRpbmdzLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncy5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZ2V0QmluZGluZ05hbWVzLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1ldmFsLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1vdXRwdXRSZWNpcGUuanMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXByb2R1Y2VzVmFsdWUuanMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRXhwZWN0ZWQuanMnKTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBza2lwU3BhY2VzKHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmIChydWxlRGljdC5zcGFjZS5ldmFsKGZhbHNlLCBmYWxzZSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSkgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNraXBTcGFjZXM7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgYnJvd3NlciA9IGF3bGliLmJyb3dzZXJcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG87XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBUaHVuaygpIHtcbiAgdGhyb3cgJ1RodW5rIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jztcbn1cblxudmFyIG5leHRUaHVua0lkID0gMDtcblRodW5rLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pZCA9IG5leHRUaHVua0lkKys7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFJ1bGVUaHVuayhydWxlTmFtZSwgc291cmNlLCBzdGFydElkeCwgZW5kSWR4LCB2YWx1ZSwgYmluZGluZ3MpIHtcbiAgdGhpcy5pbml0KCk7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeDtcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHg7XG4gIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xufVxuXG5SdWxlVGh1bmsucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIGlmICghbWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSkge1xuICAgICAgdmFyIGFjdGlvbiA9IHRoaXMubG9va3VwQWN0aW9uKGFjdGlvbkRpY3QpO1xuICAgICAgdmFyIGFkZGxJbmZvID0gdGhpcy5jcmVhdGVBZGRsSW5mbygpO1xuICAgICAgdmFyIGVudiA9IHRoaXMubWFrZUVudihhY3Rpb25EaWN0LCBtZW1vKTtcbiAgICAgIG1lbW9bdGhpcy5pZF0gPSBhY3Rpb24uY2FsbChhZGRsSW5mbywgZW52KTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW9bdGhpcy5pZF07XG4gIH0sXG5cbiAgbG9va3VwQWN0aW9uOiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlTmFtZTtcbiAgICB2YXIgYWN0aW9uID0gYWN0aW9uRGljdFtydWxlTmFtZV07XG4gICAgaWYgKGFjdGlvbiA9PT0gdW5kZWZpbmVkICYmIGFjdGlvbkRpY3QuX2RlZmF1bHQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgYWN0aW9uID0gZnVuY3Rpb24oZW52KSB7XG4gICAgICAgIHJldHVybiBhY3Rpb25EaWN0Ll9kZWZhdWx0LmNhbGwodGhpcywgcnVsZU5hbWUsIGVudik7XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gYWN0aW9uIHx8IGJyb3dzZXIuZXJyb3IoJ21pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvcicsIHJ1bGVOYW1lKTtcbiAgfSxcblxuICBjcmVhdGVBZGRsSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGludGVydmFsOiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2UsIHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KVxuICAgIH07XG4gIH0sXG5cbiAgbWFrZUVudjogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIHZhciBiaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MubGVuZ3RoID09PSAwID8gWyd2YWx1ZScsIHRoaXMudmFsdWVdIDogdGhpcy5iaW5kaW5ncztcbiAgICB2YXIgZW52ID0ge307XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYmluZGluZ3MubGVuZ3RoOyBpZHggKz0gMikge1xuICAgICAgdmFyIG5hbWUgPSBiaW5kaW5nc1tpZHhdO1xuICAgICAgdmFyIHRodW5rID0gYmluZGluZ3NbaWR4ICsgMV07XG4gICAgICB0aGlzLmFkZEJpbmRpbmcoZW52LCBuYW1lLCB0aHVuaywgYWN0aW9uRGljdCwgbWVtbyk7XG4gICAgfVxuICAgIHJldHVybiBlbnY7XG4gIH0sXG5cbiAgYWRkQmluZGluZzogZnVuY3Rpb24oZW52LCBuYW1lLCB2YWx1ZSwgYWN0aW9uRGljdCwgbWVtbykge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbnYsIG5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFRodW5rKSB7XG4gICAgICAgICAgdmFsdWUgPSB2YWx1ZS5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG59KTtcblxuZnVuY3Rpb24gTGlzdFRodW5rKHRodW5rcykge1xuICB0aGlzLmluaXQoKTtcbiAgdGhpcy50aHVua3MgPSB0aHVua3M7XG59XG5cbkxpc3RUaHVuay5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oVGh1bmsucHJvdG90eXBlLCB7XG4gIGZvcmNlOiBmdW5jdGlvbihhY3Rpb25EaWN0LCBtZW1vKSB7XG4gICAgaWYgKCFtZW1vLmhhc093blByb3BlcnR5KHRoaXMuaWQpKSB7XG4gICAgICBtZW1vW3RoaXMuaWRdID0gdGhpcy50aHVua3MubWFwKGZ1bmN0aW9uKHRodW5rKSB7IHJldHVybiB0aHVuay5mb3JjZShhY3Rpb25EaWN0LCBtZW1vKTsgfSk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdO1xuICB9XG59KTtcblxuZnVuY3Rpb24gVmFsdWVUaHVuayh2YWx1ZSkge1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG59XG5cblZhbHVlVGh1bmsucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuUnVsZVRodW5rID0gUnVsZVRodW5rO1xuZXhwb3J0cy5MaXN0VGh1bmsgPSBMaXN0VGh1bms7XG5leHBvcnRzLlZhbHVlVGh1bmsgPSBWYWx1ZVRodW5rO1xuZXhwb3J0cy51bmRlZmluZWRUaHVuayA9IG5ldyBWYWx1ZVRodW5rKHVuZGVmaW5lZCk7XG5leHBvcnRzLnRydWVUaHVuayA9IG5ldyBWYWx1ZVRodW5rKHRydWUpO1xuXG4iXX0=
(16)
});
