!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ohm=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var ohm = _dereq_('../src/main.js');
ohm._ohmGrammarFactory =
(function(ohm, optNamespace) {
  var b = ohm._builder();
  b.setName('Ohm');
  b.inline('space_singleLine', b.seq(b._('//'), b.many(b.seq(b.not(b._('\n')), b.app('_')), 0), b._('\n')));
  b.inline('space_multiLine', b.seq(b._('/*'), b.many(b.seq(b.not(b._('*/')), b.app('_')), 0), b._('*/')));
  b.extend('space', b.alt(b.app('space_singleLine'), b.app('space_multiLine')));
  b.define('_name', b.seq(b.app('nameFirst'), b.many(b.app('nameRest'), 0)));
  b.define('nameFirst', b.alt(b._('_'), b.app('letter')));
  b.define('nameRest', b.alt(b._('_'), b.app('alnum')));
  b.define('name', b.seq(b.not(b.app('namedConst')), b.bind(b.app('_name'), 'n')));
  b.inline('namedConst_undefined', b.seq(b._('undefined'), b.not(b.app('nameRest'))));
  b.inline('namedConst_null', b.seq(b._('null'), b.not(b.app('nameRest'))));
  b.inline('namedConst_true', b.seq(b._('true'), b.not(b.app('nameRest'))));
  b.inline('namedConst_false', b.seq(b._('false'), b.not(b.app('nameRest'))));
  b.define('namedConst', b.alt(b.app('namedConst_undefined'), b.app('namedConst_null'), b.app('namedConst_true'), b.app('namedConst_false')));
  b.define('string', b.seq(b._("'"), b.bind(b.many(b.app('sChar'), 0), 'cs'), b._("'")));
  b.define('sChar', b.alt(b.seq(b._('\\x'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b._('\\u'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit'), b.app('hexDigit')), b.seq(b._('\\'), b.app('_')), b.seq(b.not(b._("'")), b.not(b._('\n')), b.app('_'))));
  b.define('regexp', b.seq(b._('/'), b.bind(b.app('reCharClass'), 'e'), b._('/')));
  b.define('reCharClass', b.seq(b._('['), b.many(b.alt(b._('\\]'), b.seq(b.not(b._(']')), b.app('_'))), 0), b._(']')));
  b.define('number', b.seq(b.opt(b._('-')), b.many(b.app('digit'), 1)));
  b.inline('Alt_rec', b.seq(b.bind(b.app('Term'), 'x'), b._('|'), b.bind(b.app('Alt'), 'y')));
  b.define('Alt', b.alt(b.app('Alt_rec'), b.app('Term')));
  b.inline('Term_inline', b.seq(b.bind(b.app('Seq'), 'x'), b._('{'), b.bind(b.app('_name'), 'n'), b._('}')));
  b.define('Term', b.alt(b.app('Term_inline'), b.app('Seq')));
  b.define('Seq', b.many(b.app('Factor'), 0));
  b.inline('Factor_bind', b.seq(b.bind(b.app('Iter'), 'x'), b._('.'), b.bind(b.app('name'), 'n')));
  b.define('Factor', b.alt(b.app('Factor_bind'), b.app('Iter')));
  b.inline('Iter_star', b.seq(b.bind(b.app('Pred'), 'x'), b._('*')));
  b.inline('Iter_plus', b.seq(b.bind(b.app('Pred'), 'x'), b._('+')));
  b.inline('Iter_opt', b.seq(b.bind(b.app('Pred'), 'x'), b._('?')));
  b.define('Iter', b.alt(b.app('Iter_star'), b.app('Iter_plus'), b.app('Iter_opt'), b.app('Pred')));
  b.inline('Pred_not', b.seq(b._('~'), b.bind(b.app('Base'), 'x')));
  b.inline('Pred_lookahead', b.seq(b._('&'), b.bind(b.app('Base'), 'x')));
  b.define('Pred', b.alt(b.app('Pred_not'), b.app('Pred_lookahead'), b.app('Base')));
  b.inline('Base_application', b.seq(b.bind(b.app('name'), 'ruleName'), b.not(b.alt(b._('=='), b._(':='), b._('+=')))));
  b.inline('Base_prim', b.alt(b.app('namedConst'), b.app('string'), b.app('regexp'), b.app('number')));
  b.inline('Base_lst', b.seq(b._('['), b.bind(b.app('Alt'), 'x'), b._(']')));
  b.inline('Base_str', b.seq(b._('"'), b.bind(b.app('Alt'), 'x'), b._('"')));
  b.inline('Base_paren', b.seq(b._('('), b.bind(b.app('Alt'), 'x'), b._(')')));
  b.inline('Base_obj', b.seq(b._('{'), b.bind(b.opt(b._('...')), 'lenient'), b._('}')));
  b.inline('Base_objWithProps', b.seq(b._('{'), b.bind(b.app('Props'), 'ps'), b.bind(b.opt(b.seq(b._(','), b._('...'))), 'lenient'), b._('}')));
  b.define('Base', b.alt(b.app('Base_application'), b.app('Base_prim'), b.app('Base_lst'), b.app('Base_str'), b.app('Base_paren'), b.app('Base_obj'), b.app('Base_objWithProps')));
  b.inline('Props_rec', b.seq(b.bind(b.app('Prop'), 'p'), b._(','), b.bind(b.app('Props'), 'ps')));
  b.inline('Props_base', b.bind(b.app('Prop'), 'p'));
  b.define('Props', b.alt(b.app('Props_rec'), b.app('Props_base')));
  b.define('Prop', b.seq(b.bind(b.alt(b.app('_name'), b.app('string')), 'n'), b._(':'), b.bind(b.app('Factor'), 'p')));
  b.inline('Rule_define', b.seq(b.bind(b.app('name'), 'n'), b._('=='), b.bind(b.app('Alt'), 'b')));
  b.inline('Rule_override', b.seq(b.bind(b.app('name'), 'n'), b._(':='), b.bind(b.app('Alt'), 'b')));
  b.inline('Rule_extend', b.seq(b.bind(b.app('name'), 'n'), b._('+='), b.bind(b.app('Alt'), 'b')));
  b.define('Rule', b.alt(b.app('Rule_define'), b.app('Rule_override'), b.app('Rule_extend')));
  b.inline('SuperGrammar_qualified', b.seq(b._('<:'), b.bind(b.app('name'), 'ns'), b._('.'), b.bind(b.app('name'), 'n')));
  b.inline('SuperGrammar_unqualified', b.seq(b._('<:'), b.bind(b.app('name'), 'n')));
  b.define('SuperGrammar', b.alt(b.app('SuperGrammar_qualified'), b.app('SuperGrammar_unqualified')));
  b.define('Grammar', b.seq(b.bind(b.app('name'), 'n'), b.bind(b.opt(b.app('SuperGrammar')), 's'), b._('{'), b.bind(b.many(b.app('Rule'), 0), 'rs'), b._('}')));
  b.define('Grammars', b.many(b.app('Grammar'), 0));
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

  define: function(ruleName, body) {
    this.ruleDecls.push(new decls.Define(ruleName, body, this.superGrammar));
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

  _: function(x) { return pexprs.makePrim(x); },
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


},{"./Grammar.js":8,"./decls.js":14,"./pexprs.js":25,"awlib":2}],8:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var InputStream = _dereq_('./InputStream.js');
var pexprs = _dereq_('./pexprs.js');
var skipSpaces = _dereq_('./skipSpaces.js');

var awlib = _dereq_('awlib');
var browser = awlib.browser;
var keysDo = awlib.objectUtils.keysDo;
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

  match: function(obj, startRule, optThrowOnFail) {
    return this.matchContents([obj], startRule, optThrowOnFail);
  },

  matchContents: function(obj, startRule, optThrowOnFail) {
    var inputStream = InputStream.newFor(obj);
    var thunk = new pexprs.Apply(startRule).eval(undefined, this.ruleDict, inputStream, undefined);
    if (common.isSyntactic(startRule)) {
      skipSpaces(this.ruleDict, inputStream);
    }
    var assertSemanticActionNamesMatch = this.assertSemanticActionNamesMatch.bind(this);
    if (thunk === common.fail || !inputStream.atEnd()) {
      if (optThrowOnFail) {
        throw {
          toString: function() { return 'match failed'; },
          pos: inputStream.getMaxPosSeen()
        };
      } else {
        return false;
      }
    } else {
      return function(actionDict) {
        assertSemanticActionNamesMatch(actionDict);
        return thunk.force(actionDict, {});
      };
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

    var rulesToBeIncluded = {};
    for (var idx = 0; idx < entryPoints.length; idx++) {
      var ruleName = entryPoints[idx];
      if (this.ruleDict[ruleName] === undefined) {
        throw new errors.UndeclaredRuleError(ruleName, this.name);
      } else {
        rulesToBeIncluded[ruleName] = true;
      }
    }

    var done = false;
    while (!done) {
      done = true;
      for (var ruleName in rulesToBeIncluded) {
        var addedNewRule = this.ruleDict[ruleName].addRulesThatNeedSemanticAction(rulesToBeIncluded, true);
        done &= !addedNewRule;
      }
    }

    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr-plus should appear next to
    // other cases of Add-Expr.

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
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;


},{"./InputStream.js":9,"./common.js":13,"./pexprs.js":25,"./skipSpaces.js":26,"awlib":2}],9:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = _dereq_('./common.js');
var PosInfo = _dereq_('./PosInfo.js');

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
    this.maxPosSeen = -1;
    this.posInfos = [];
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
    if (this.pos > this.maxPosSeen) {
      this.maxPosSeen = this.pos;
    }
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

  getMaxPosSeen: function() {
    return this.maxPosSeen;
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


},{"./PosInfo.js":12,"./common.js":13,"awlib":2}],10:[function(_dereq_,module,exports){
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
      throw new errors.DuplicateGrammarDeclarationError(name, this.name);
    } else {
      this.grammars[name] = grammar;
    }
    return this;
  },

  getGrammar: function(name) {
    if (this.grammars[name]) {
      return this.grammars[name];
    } else {
      throw new errors.UndeclaredGrammarError(name, this.name);
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

function PosInfo(pos) {
  this.pos = pos;
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

module.exports = function(pos) {
  return new PosInfo(pos);
};


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

  install: function(ruleDict) {
    ruleDict[this.name] = this.body;
  },

  outputRecipe: function(ws) {
    ws.nextPutAll('b.');
    ws.nextPutAll(this.kind);
    ws.nextPutAll('(');
    ws.nextPutAll(printString(this.name));
    ws.nextPutAll(', ');
    this.body.outputRecipe(ws);
    ws.nextPutAll(')');
  }
};

function Define(name, body, superGrammar) {
  this.name = name;
  this.body = body;
  this.superGrammar = superGrammar;
}

Define.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'define',

  performChecks: function() {
    if (this.superGrammar.ruleDict[this.name]) {
      throw new errors.DuplicateRuleDeclarationError(this.name, this.superGrammar.name);
    }
    this.performCommonChecks(this.name, this.body);
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
      throw new errors.UndeclaredRuleError(this.name, this.superGrammar.name);
    }
    if (overridden.getBindingNames().length === 0 && overridden.producesValue() && !this.body.producesValue()) {
      throw new errors.RuleMustProduceValueError(this.name, 'overriding');
    }
    this.performCommonChecks(this.name, this.body);
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
      throw new errors.DuplicateRuleDeclarationError(this.name, this.superGrammar.name);
    }
    this.performCommonChecks(this.name, this.body);
  }
});

function Extend(name, body, superGrammar) {
  this.name = name;
  this.base = superGrammar.ruleDict[name];
  if (!this.base) {
    throw new errors.UndeclaredRuleError(name, superGrammar.name);
  }
  this.body = body;
  this.extendedBody = new pexprs.ExtendAlt(this.body, this.base);
  this.superGrammar = superGrammar;
}

Extend.prototype = objectThatDelegatesTo(RuleDecl.prototype, {
  kind: 'extend',

  performChecks: function() {
    if (this.base.getBindingNames().length === 0 && this.base.producesValue() && !this.body.producesValue()) {
      throw new errors.RuleMustProduceValueError(this.name, 'extending');
    }
    this.performCommonChecks(this.name, this.extendedBody);
  },

  install: function(ruleDict) {
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


},{"./common.js":13,"./errors.js":15,"./pexprs.js":25,"awlib":2}],15:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// ----------------- grammars -----------------

// Undeclarated grammar

exports.UndeclaredGrammarError = function(grammarName, optNamespaceName) {
  this.grammarName = grammarName;
  this.namespaceName = optNamespaceName;
};

exports.UndeclaredGrammarError.prototype.toString = function() {
  return this.namespaceName ?
    ['grammar', this.grammarName, 'is not declared in namespace', this.namespaceName].join(' ') :
    ['undeclared grammar', this.grammarName].join(' ');
};

// Duplicate grammar declaration

exports.DuplicateGrammarDeclarationError = function(grammarName, namespaceName) {
  this.grammarName = grammarName;
  this.namespaceName = namespaceName;
};

exports.DuplicateGrammarDeclarationError.prototype.toString = function() {
  return ['grammar', this.grammarName, 'is already declared in namespace', this.namespaceName].join(' ');
};

// ----------------- rules -----------------

// Undeclared rule

exports.UndeclaredRuleError = function(ruleName, optGrammarName) {
  this.ruleName = ruleName;
  this.grammarName = optGrammarName;
};

exports.UndeclaredRuleError.prototype.toString = function() {
  return this.grammarName ?
    ['rule', this.ruleName, 'is not declared in grammar', this.grammarName].join(' ') :
    ['undeclared rule', this.ruleName].join(' ');
};

// Duplicate rule declaration

exports.DuplicateRuleDeclarationError = function(ruleName, grammarName) {
  this.ruleName = ruleName;
  this.grammarName = grammarName;
};

exports.DuplicateRuleDeclarationError.prototype.toString = function() {
  return ['rule', this.ruleName, 'is already declared in grammar', this.grammarName].join(' ');
};

// Rule must produce value

exports.RuleMustProduceValueError = function(ruleName, why) {
  this.ruleName = ruleName;
  this.why = why;
};

exports.RuleMustProduceValueError.prototype.toString = function() {
  return [
    'rule', this.ruleName, 'must produce a value',
    'because the rule it is', this.why, 'also produces a value'
  ].join(' ');
};

// ----------------- bindings -----------------

// Inconsistent bindings

exports.InconsistentBindingsError = function(ruleName, expected, actual) {
  this.ruleName = ruleName;
  this.expected = expected;
  this.actual = actual;
};

exports.InconsistentBindingsError.prototype.toString = function() {
  return [
    'rule', this.ruleName, 'has inconsistent bindings.',
    'expected:', this.expected,
    'got:', this.actual
  ].join(' ');
};

// Duplicate bindings

exports.DuplicateBindingsError = function(ruleName, duplicates) {
  this.ruleName = ruleName;
  this.duplicates = duplicates;
};

exports.DuplicateBindingsError.prototype.toString = function() {
  return ['rule', this.ruleName, 'has duplicate bindings:', this.duplicates].join(' ');
};

// Useless bindings

exports.UselessBindingsError = function(ruleName, useless) {
  this.ruleName = ruleName;
  this.useless = useless;
};

exports.UselessBindingsError.prototype.toString = function() {
  return ['rule', this.ruleName, 'has useless bindings:', this.useless].join(' ');
};

// ----------------- properties -----------------

// Duplicate property names

exports.DuplicatePropertyNamesError = function(duplicates) {
  this.duplicates = duplicates;
};

exports.DuplicatePropertyNamesError.prototype.toString = function() {
  return ['object pattern has duplicate property names:', this.duplicates].join(' ');
};


},{}],16:[function(_dereq_,module,exports){
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
  -- Parameterized rules? (But they're not so great for readability, and could be tricky for semantic action dicts.)

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

_dereq_('../dist/ohm-grammar.js');

var Builder = _dereq_('./Builder.js');
var Namespace = _dereq_('./Namespace.js');
var errors = _dereq_('./errors.js');

var awlib = _dereq_('awlib');
var unescapeChar = awlib.stringUtils.unescapeChar;
var browser = awlib.browser;

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

    _name:                      function()    { return this.interval.contents; },
    nameFirst:                  function(env) {},
    nameRest:                   function(env) {},

    name:                       function(env) { return env.n; },

    namedConst:                 function(env) { return env.value; },
    namedConst_undefined:       function()    { return undefined; },
    namedConst_null:            function()    { return null; },
    namedConst_true:            function()    { return true; },
    namedConst_false:           function()    { return false; },

    string:                     function(env) {
                                  return env.cs.map(function(c) { return unescapeChar(c); }).join('');
                                },
    sChar:                      function()    { return this.interval.contents; },
    regexp:                     function(env) { return new RegExp(env.e); },
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
    Base_undefined:             function()    { return builder._(undefined); },
    Base_null:                  function()    { return builder._(null); },
    Base_true:                  function()    { return builder._(true); },
    Base_false:                 function()    { return builder._(false); },
    Base_application:           function(env) { return builder.app(env.ruleName); },
    Base_prim:                  function(env) { return builder._(env.value); },
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
                                  return builder.define(env.n, env.b);
                                },
    Rule_override:              function(env) {
                                  builder.currentRuleName = env.n;
                                  return builder.override(env.n, env.b);
                                },
    Rule_extend:                function(env) {
                                  builder.currentRuleName = env.n;
                                  return builder.extend(env.n, env.b);
                                },

    SuperGrammar:               function(env) { builder.setSuperGrammar(env.value); },
    SuperGrammar_qualified:     function(env) { return thisModule.namespace(env.ns).getGrammar(env.n); },
    SuperGrammar_unqualified:   function(env) {
                                  if (optNamespace) {
                                    return optNamespace.getGrammar(env.n);
                                  } else {
                                    throw new errors.UndeclaredGrammarError(env.n);
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
  var thunk = thisModule._ohmGrammar.matchContents(source, whatItIs);
  if (thunk) {
    return thunk(makeGrammarActionDict(optNamespace));
  } else {
    // TODO: improve error message (show what part of the input is wrong, what was expected, etc.)
    browser.error('invalid input in:', source);
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


},{"./common.js":13,"./pexprs.js":25}],18:[function(_dereq_,module,exports){
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

pexprs.anything.assertChoicesHaveUniformBindings = function(ruleName) {};

pexprs.Prim.prototype.assertChoicesHaveUniformBindings = function(ruleName) {};

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
      throw new errors.InconsistentBindingsError(ruleName, names, otherNames);
    }
  }
};

pexprs.ExtendAlt.prototype.assertChoicesHaveUniformBindings = function(ruleName) {
  // Only has two terms, the second of which has the expected bindings.
  var names = this.terms[1].getBindingNames();
  var otherNames = this.terms[0].getBindingNames();
  if (!equals(names, otherNames)) {
    throw new errors.InconsistentBindingsError(ruleName, names, otherNames);
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

pexprs.Apply.prototype.assertChoicesHaveUniformBindings = function(ruleName) {};


},{"./common.js":13,"./errors.js":15,"./pexprs.js":25,"awlib":2}],19:[function(_dereq_,module,exports){
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

pexprs.anything.assertNoDuplicateBindings = function(ruleName) {};

pexprs.Prim.prototype.assertNoDuplicateBindings = function(ruleName) {};

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
    throw new errors.DuplicateBindingsError(ruleName, duplicates);
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
    throw new errors.DuplicateBindingsError(ruleName, duplicates);
  }
};

pexprs.Apply.prototype.assertNoDuplicateBindings = function(ruleName) {};


},{"./common.js":13,"./errors.js":15,"./pexprs.js":25}],20:[function(_dereq_,module,exports){
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
    throw new errors.UselessBindingsError(ruleName, bindings);
  }
}

pexprs.PExpr.prototype.assertNoUselessBindings = common.abstract;

pexprs.anything.assertNoUselessBindings = function(ruleName) {
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


},{"./common.js":13,"./errors.js":15,"./pexprs.js":25}],21:[function(_dereq_,module,exports){
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

pexprs.anything.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var value = inputStream.next();
  if (value === common.fail) {
    return common.fail;
  } else {
    return new thunks.ValueThunk(value);
  }
};

pexprs.Prim.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  if (this.match(inputStream) === common.fail) {
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

pexprs.RegExpPrim.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var origPos = inputStream.pos;
  if (inputStream.matchRegExp(this.obj) === common.fail) {
    return common.fail;
  } else {
    return new thunks.ValueThunk(inputStream.source[origPos]);
  }
};

pexprs.Alt.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var origNumBindings = bindings.length;
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (syntactic) {
      skipSpaces(ruleDict, inputStream);
    }
    var value = this.terms[idx].eval(syntactic, ruleDict, inputStream, bindings);
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

pexprs.Seq.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (syntactic) {
      skipSpaces(ruleDict, inputStream);
    }
    var factor = this.factors[idx];
    var value = factor.eval(syntactic, ruleDict, inputStream, bindings);
    if (value === common.fail) {
      return common.fail;
    }
  }
  return thunks.valuelessThunk;
};

pexprs.Bind.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var value = this.expr.eval(syntactic, ruleDict, inputStream, bindings);
  if (value !== common.fail) {
    bindings.push(this.name, value);
  }
  return value;
};

pexprs.Many.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var matches = [];
  while (true) {
    var backtrackPos = inputStream.pos;
    var value = this.expr.eval(syntactic, ruleDict, inputStream, []);
    if (value === common.fail) {
      inputStream.pos = backtrackPos;
      break;
    } else {
      matches.push(value);
    }
  }
  return matches.length < this.minNumMatches ?  common.fail : new thunks.ListThunk(matches);
};

pexprs.Opt.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var value = this.expr.eval(syntactic, ruleDict, inputStream, []);
  if (value === common.fail) {
    inputStream.pos = origPos;
    return thunks.valuelessThunk;
  } else {
    return new thunks.ListThunk([value]);
  }
};

pexprs.Not.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var value = this.expr.eval(syntactic, ruleDict, inputStream, []);
  if (value !== common.fail) {
    return common.fail;
  } else {
    inputStream.pos = origPos;
    return thunks.valuelessThunk;
  }
};

pexprs.Lookahead.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  var origPos = inputStream.pos;
  var value = this.expr.eval(syntactic, ruleDict, inputStream, []);
  if (value !== common.fail) {
    inputStream.pos = origPos;
    return value;
  } else {
    return common.fail;
  }
};

pexprs.Str.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var string = inputStream.next();
  if (typeof string === 'string') {
    var stringInputStream = InputStream.newFor(string);
    var value = this.expr.eval(syntactic, ruleDict, stringInputStream, bindings);
    return value !== common.fail && stringInputStream.atEnd() ?  new thunks.ValueThunk(string) : common.fail;
  } else {
    return common.fail;
  }
};

pexprs.List.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
  if (syntactic) {
    skipSpaces(ruleDict, inputStream);
  }
  var list = inputStream.next();
  if (list instanceof Array) {
    var listInputStream = InputStream.newFor(list);
    var value = this.expr.eval(syntactic, ruleDict, listInputStream, bindings);
    return value !== common.fail && listInputStream.atEnd() ?  new thunks.ValueThunk(list) : common.fail;
  } else {
    return common.fail;
  }
};

pexprs.Obj.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
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
      var matched = property.pattern.eval(syntactic, ruleDict, valueInputStream, bindings) !== common.fail &&
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

pexprs.Apply.prototype.eval = function(syntactic, ruleDict, inputStream, bindings) {
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
    var body = ruleDict[ruleName]
    if (!body) {
      throw new errors.UndeclaredRuleError(ruleName);
    }
    origPosInfo.enter(ruleName);
    var value = this.evalOnce(body, ruleDict, inputStream);
    var currentLR = origPosInfo.getCurrentLeftRecursion();
    if (currentLR) {
      if (currentLR.name === ruleName) {
        value = this.handleLeftRecursion(body, ruleDict, inputStream, origPosInfo.pos, currentLR, value);
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
    return value;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, ruleDict, inputStream) {
  var origPos = inputStream.pos;
  var bindings = [];
  var value = expr.eval(common.isSyntactic(this.ruleName), ruleDict, inputStream, bindings);
  if (value === common.fail) {
    return common.fail;
  } else {
    return new thunks.RuleThunk(this.ruleName, inputStream.source, origPos, inputStream.pos, value, bindings);
  }
};

pexprs.Apply.prototype.handleLeftRecursion = function(body, ruleDict, inputStream, origPos, currentLR, seedValue) {
  var value = seedValue;
  if (seedValue !== common.fail) {
    currentLR.value = seedValue;
    currentLR.pos = inputStream.pos;
    while (true) {
      inputStream.pos = origPos;
      value = this.evalOnce(body, ruleDict, inputStream);
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


},{"./InputStream.js":9,"./common.js":13,"./errors.js":15,"./pexprs.js":25,"./skipSpaces.js":26,"./thunks.js":27,"awlib":2}],22:[function(_dereq_,module,exports){
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


},{"./pexprs.js":25}],23:[function(_dereq_,module,exports){
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

pexprs.Prim.prototype.outputRecipe = function(ws) {
  ws.nextPutAll('b._(');
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


},{"./common.js":13,"./pexprs.js":25,"awlib":2}],24:[function(_dereq_,module,exports){
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

pexprs.Not.prototype.producesValue = function() {
  return false;
};


},{"./pexprs.js":25}],25:[function(_dereq_,module,exports){
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
    throw new errors.DuplicatePropertyNamesError(duplicates);
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


},{"./common.js":13,"./errors.js":15,"./pexprs-addRulesThatNeedSemanticAction.js":17,"./pexprs-assertChoicesHaveUniformBindings.js":18,"./pexprs-assertNoDuplicateBindings.js":19,"./pexprs-assertNoUselessBindings.js":20,"./pexprs-eval.js":21,"./pexprs-getBindingNames.js":22,"./pexprs-outputRecipe.js":23,"./pexprs-producesValue.js":24,"awlib":2}],26:[function(_dereq_,module,exports){
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = _dereq_('./pexprs.js');

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

var _applySpaces = new pexprs.Apply('spaces');
module.exports = function(ruleDict, inputStream) {
  _applySpaces.eval(false, ruleDict, inputStream, undefined);
};


},{"./pexprs.js":25}],27:[function(_dereq_,module,exports){
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
exports.valuelessThunk = new ValueThunk(undefined);


},{"./Interval.js":10,"awlib":2}]},{},[16])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYXdsaWIuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvYnJvd3Nlci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vbm9kZV9tb2R1bGVzL2F3bGliL3NyYy9lcXVhbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvb2JqZWN0VXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL25vZGVfbW9kdWxlcy9hd2xpYi9zcmMvc3RyaW5nVXRpbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9CdWlsZGVyLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvR3JhbW1hci5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL0lucHV0U3RyZWFtLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvSW50ZXJ2YWwuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9OYW1lc3BhY2UuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9Qb3NJbmZvLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvY29tbW9uLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvZGVjbHMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9lcnJvcnMuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9tYWluLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbi5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWFzc2VydE5vVXNlbGVzc0JpbmRpbmdzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLWV2YWwuanMiLCIvVXNlcnMvYWxleHdhcnRoL3Byb2cvb2htL3NyYy9wZXhwcnMtZ2V0QmluZGluZ05hbWVzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLW91dHB1dFJlY2lwZS5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3BleHBycy1wcm9kdWNlc1ZhbHVlLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvcGV4cHJzLmpzIiwiL1VzZXJzL2FsZXh3YXJ0aC9wcm9nL29obS9zcmMvc2tpcFNwYWNlcy5qcyIsIi9Vc2Vycy9hbGV4d2FydGgvcHJvZy9vaG0vc3JjL3RodW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9SQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9MQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uL3NyYy9tYWluLmpzJyk7XG5vaG0uX29obUdyYW1tYXJGYWN0b3J5ID1cbihmdW5jdGlvbihvaG0sIG9wdE5hbWVzcGFjZSkge1xuICB2YXIgYiA9IG9obS5fYnVpbGRlcigpO1xuICBiLnNldE5hbWUoJ09obScpO1xuICBiLmlubGluZSgnc3BhY2Vfc2luZ2xlTGluZScsIGIuc2VxKGIuXygnLy8nKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnXFxuJykpLCBiLmFwcCgnXycpKSwgMCksIGIuXygnXFxuJykpKTtcbiAgYi5pbmxpbmUoJ3NwYWNlX211bHRpTGluZScsIGIuc2VxKGIuXygnLyonKSwgYi5tYW55KGIuc2VxKGIubm90KGIuXygnKi8nKSksIGIuYXBwKCdfJykpLCAwKSwgYi5fKCcqLycpKSk7XG4gIGIuZXh0ZW5kKCdzcGFjZScsIGIuYWx0KGIuYXBwKCdzcGFjZV9zaW5nbGVMaW5lJyksIGIuYXBwKCdzcGFjZV9tdWx0aUxpbmUnKSkpO1xuICBiLmRlZmluZSgnX25hbWUnLCBiLnNlcShiLmFwcCgnbmFtZUZpcnN0JyksIGIubWFueShiLmFwcCgnbmFtZVJlc3QnKSwgMCkpKTtcbiAgYi5kZWZpbmUoJ25hbWVGaXJzdCcsIGIuYWx0KGIuXygnXycpLCBiLmFwcCgnbGV0dGVyJykpKTtcbiAgYi5kZWZpbmUoJ25hbWVSZXN0JywgYi5hbHQoYi5fKCdfJyksIGIuYXBwKCdhbG51bScpKSk7XG4gIGIuZGVmaW5lKCduYW1lJywgYi5zZXEoYi5ub3QoYi5hcHAoJ25hbWVkQ29uc3QnKSksIGIuYmluZChiLmFwcCgnX25hbWUnKSwgJ24nKSkpO1xuICBiLmlubGluZSgnbmFtZWRDb25zdF91bmRlZmluZWQnLCBiLnNlcShiLl8oJ3VuZGVmaW5lZCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3RfbnVsbCcsIGIuc2VxKGIuXygnbnVsbCcpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3RfdHJ1ZScsIGIuc2VxKGIuXygndHJ1ZScpLCBiLm5vdChiLmFwcCgnbmFtZVJlc3QnKSkpKTtcbiAgYi5pbmxpbmUoJ25hbWVkQ29uc3RfZmFsc2UnLCBiLnNlcShiLl8oJ2ZhbHNlJyksIGIubm90KGIuYXBwKCduYW1lUmVzdCcpKSkpO1xuICBiLmRlZmluZSgnbmFtZWRDb25zdCcsIGIuYWx0KGIuYXBwKCduYW1lZENvbnN0X3VuZGVmaW5lZCcpLCBiLmFwcCgnbmFtZWRDb25zdF9udWxsJyksIGIuYXBwKCduYW1lZENvbnN0X3RydWUnKSwgYi5hcHAoJ25hbWVkQ29uc3RfZmFsc2UnKSkpO1xuICBiLmRlZmluZSgnc3RyaW5nJywgYi5zZXEoYi5fKFwiJ1wiKSwgYi5iaW5kKGIubWFueShiLmFwcCgnc0NoYXInKSwgMCksICdjcycpLCBiLl8oXCInXCIpKSk7XG4gIGIuZGVmaW5lKCdzQ2hhcicsIGIuYWx0KGIuc2VxKGIuXygnXFxcXHgnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpKSwgYi5zZXEoYi5fKCdcXFxcdScpLCBiLmFwcCgnaGV4RGlnaXQnKSwgYi5hcHAoJ2hleERpZ2l0JyksIGIuYXBwKCdoZXhEaWdpdCcpLCBiLmFwcCgnaGV4RGlnaXQnKSksIGIuc2VxKGIuXygnXFxcXCcpLCBiLmFwcCgnXycpKSwgYi5zZXEoYi5ub3QoYi5fKFwiJ1wiKSksIGIubm90KGIuXygnXFxuJykpLCBiLmFwcCgnXycpKSkpO1xuICBiLmRlZmluZSgncmVnZXhwJywgYi5zZXEoYi5fKCcvJyksIGIuYmluZChiLmFwcCgncmVDaGFyQ2xhc3MnKSwgJ2UnKSwgYi5fKCcvJykpKTtcbiAgYi5kZWZpbmUoJ3JlQ2hhckNsYXNzJywgYi5zZXEoYi5fKCdbJyksIGIubWFueShiLmFsdChiLl8oJ1xcXFxdJyksIGIuc2VxKGIubm90KGIuXygnXScpKSwgYi5hcHAoJ18nKSkpLCAwKSwgYi5fKCddJykpKTtcbiAgYi5kZWZpbmUoJ251bWJlcicsIGIuc2VxKGIub3B0KGIuXygnLScpKSwgYi5tYW55KGIuYXBwKCdkaWdpdCcpLCAxKSkpO1xuICBiLmlubGluZSgnQWx0X3JlYycsIGIuc2VxKGIuYmluZChiLmFwcCgnVGVybScpLCAneCcpLCBiLl8oJ3wnKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3knKSkpO1xuICBiLmRlZmluZSgnQWx0JywgYi5hbHQoYi5hcHAoJ0FsdF9yZWMnKSwgYi5hcHAoJ1Rlcm0nKSkpO1xuICBiLmlubGluZSgnVGVybV9pbmxpbmUnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1NlcScpLCAneCcpLCBiLl8oJ3snKSwgYi5iaW5kKGIuYXBwKCdfbmFtZScpLCAnbicpLCBiLl8oJ30nKSkpO1xuICBiLmRlZmluZSgnVGVybScsIGIuYWx0KGIuYXBwKCdUZXJtX2lubGluZScpLCBiLmFwcCgnU2VxJykpKTtcbiAgYi5kZWZpbmUoJ1NlcScsIGIubWFueShiLmFwcCgnRmFjdG9yJyksIDApKTtcbiAgYi5pbmxpbmUoJ0ZhY3Rvcl9iaW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdJdGVyJyksICd4JyksIGIuXygnLicpLCBiLmJpbmQoYi5hcHAoJ25hbWUnKSwgJ24nKSkpO1xuICBiLmRlZmluZSgnRmFjdG9yJywgYi5hbHQoYi5hcHAoJ0ZhY3Rvcl9iaW5kJyksIGIuYXBwKCdJdGVyJykpKTtcbiAgYi5pbmxpbmUoJ0l0ZXJfc3RhcicsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJyonKSkpO1xuICBiLmlubGluZSgnSXRlcl9wbHVzJywgYi5zZXEoYi5iaW5kKGIuYXBwKCdQcmVkJyksICd4JyksIGIuXygnKycpKSk7XG4gIGIuaW5saW5lKCdJdGVyX29wdCcsIGIuc2VxKGIuYmluZChiLmFwcCgnUHJlZCcpLCAneCcpLCBiLl8oJz8nKSkpO1xuICBiLmRlZmluZSgnSXRlcicsIGIuYWx0KGIuYXBwKCdJdGVyX3N0YXInKSwgYi5hcHAoJ0l0ZXJfcGx1cycpLCBiLmFwcCgnSXRlcl9vcHQnKSwgYi5hcHAoJ1ByZWQnKSkpO1xuICBiLmlubGluZSgnUHJlZF9ub3QnLCBiLnNlcShiLl8oJ34nKSwgYi5iaW5kKGIuYXBwKCdCYXNlJyksICd4JykpKTtcbiAgYi5pbmxpbmUoJ1ByZWRfbG9va2FoZWFkJywgYi5zZXEoYi5fKCcmJyksIGIuYmluZChiLmFwcCgnQmFzZScpLCAneCcpKSk7XG4gIGIuZGVmaW5lKCdQcmVkJywgYi5hbHQoYi5hcHAoJ1ByZWRfbm90JyksIGIuYXBwKCdQcmVkX2xvb2thaGVhZCcpLCBiLmFwcCgnQmFzZScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX2FwcGxpY2F0aW9uJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICdydWxlTmFtZScpLCBiLm5vdChiLmFsdChiLl8oJz09JyksIGIuXygnOj0nKSwgYi5fKCcrPScpKSkpKTtcbiAgYi5pbmxpbmUoJ0Jhc2VfcHJpbScsIGIuYWx0KGIuYXBwKCduYW1lZENvbnN0JyksIGIuYXBwKCdzdHJpbmcnKSwgYi5hcHAoJ3JlZ2V4cCcpLCBiLmFwcCgnbnVtYmVyJykpKTtcbiAgYi5pbmxpbmUoJ0Jhc2VfbHN0JywgYi5zZXEoYi5fKCdbJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnXScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX3N0cicsIGIuc2VxKGIuXygnXCInKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ3gnKSwgYi5fKCdcIicpKSk7XG4gIGIuaW5saW5lKCdCYXNlX3BhcmVuJywgYi5zZXEoYi5fKCcoJyksIGIuYmluZChiLmFwcCgnQWx0JyksICd4JyksIGIuXygnKScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX29iaicsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5vcHQoYi5fKCcuLi4nKSksICdsZW5pZW50JyksIGIuXygnfScpKSk7XG4gIGIuaW5saW5lKCdCYXNlX29ialdpdGhQcm9wcycsIGIuc2VxKGIuXygneycpLCBiLmJpbmQoYi5hcHAoJ1Byb3BzJyksICdwcycpLCBiLmJpbmQoYi5vcHQoYi5zZXEoYi5fKCcsJyksIGIuXygnLi4uJykpKSwgJ2xlbmllbnQnKSwgYi5fKCd9JykpKTtcbiAgYi5kZWZpbmUoJ0Jhc2UnLCBiLmFsdChiLmFwcCgnQmFzZV9hcHBsaWNhdGlvbicpLCBiLmFwcCgnQmFzZV9wcmltJyksIGIuYXBwKCdCYXNlX2xzdCcpLCBiLmFwcCgnQmFzZV9zdHInKSwgYi5hcHAoJ0Jhc2VfcGFyZW4nKSwgYi5hcHAoJ0Jhc2Vfb2JqJyksIGIuYXBwKCdCYXNlX29ialdpdGhQcm9wcycpKSk7XG4gIGIuaW5saW5lKCdQcm9wc19yZWMnLCBiLnNlcShiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSwgYi5fKCcsJyksIGIuYmluZChiLmFwcCgnUHJvcHMnKSwgJ3BzJykpKTtcbiAgYi5pbmxpbmUoJ1Byb3BzX2Jhc2UnLCBiLmJpbmQoYi5hcHAoJ1Byb3AnKSwgJ3AnKSk7XG4gIGIuZGVmaW5lKCdQcm9wcycsIGIuYWx0KGIuYXBwKCdQcm9wc19yZWMnKSwgYi5hcHAoJ1Byb3BzX2Jhc2UnKSkpO1xuICBiLmRlZmluZSgnUHJvcCcsIGIuc2VxKGIuYmluZChiLmFsdChiLmFwcCgnX25hbWUnKSwgYi5hcHAoJ3N0cmluZycpKSwgJ24nKSwgYi5fKCc6JyksIGIuYmluZChiLmFwcCgnRmFjdG9yJyksICdwJykpKTtcbiAgYi5pbmxpbmUoJ1J1bGVfZGVmaW5lJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnPT0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpO1xuICBiLmlubGluZSgnUnVsZV9vdmVycmlkZScsIGIuc2VxKGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpLCBiLl8oJzo9JyksIGIuYmluZChiLmFwcCgnQWx0JyksICdiJykpKTtcbiAgYi5pbmxpbmUoJ1J1bGVfZXh0ZW5kJywgYi5zZXEoYi5iaW5kKGIuYXBwKCduYW1lJyksICduJyksIGIuXygnKz0nKSwgYi5iaW5kKGIuYXBwKCdBbHQnKSwgJ2InKSkpO1xuICBiLmRlZmluZSgnUnVsZScsIGIuYWx0KGIuYXBwKCdSdWxlX2RlZmluZScpLCBiLmFwcCgnUnVsZV9vdmVycmlkZScpLCBiLmFwcCgnUnVsZV9leHRlbmQnKSkpO1xuICBiLmlubGluZSgnU3VwZXJHcmFtbWFyX3F1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICducycpLCBiLl8oJy4nKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKTtcbiAgYi5pbmxpbmUoJ1N1cGVyR3JhbW1hcl91bnF1YWxpZmllZCcsIGIuc2VxKGIuXygnPDonKSwgYi5iaW5kKGIuYXBwKCduYW1lJyksICduJykpKTtcbiAgYi5kZWZpbmUoJ1N1cGVyR3JhbW1hcicsIGIuYWx0KGIuYXBwKCdTdXBlckdyYW1tYXJfcXVhbGlmaWVkJyksIGIuYXBwKCdTdXBlckdyYW1tYXJfdW5xdWFsaWZpZWQnKSkpO1xuICBiLmRlZmluZSgnR3JhbW1hcicsIGIuc2VxKGIuYmluZChiLmFwcCgnbmFtZScpLCAnbicpLCBiLmJpbmQoYi5vcHQoYi5hcHAoJ1N1cGVyR3JhbW1hcicpKSwgJ3MnKSwgYi5fKCd7JyksIGIuYmluZChiLm1hbnkoYi5hcHAoJ1J1bGUnKSwgMCksICdycycpLCBiLl8oJ30nKSkpO1xuICBiLmRlZmluZSgnR3JhbW1hcnMnLCBiLm1hbnkoYi5hcHAoJ0dyYW1tYXInKSwgMCkpO1xuICByZXR1cm4gYi5idWlsZChvcHROYW1lc3BhY2UpO1xufSk7XG4iLCJleHBvcnRzLm9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG5leHBvcnRzLnN0cmluZ1V0aWxzID0gcmVxdWlyZSgnLi9zdHJpbmdVdGlscy5qcycpXG5leHBvcnRzLmVxdWFscyA9IHJlcXVpcmUoJy4vZXF1YWxzLmpzJylcbmV4cG9ydHMuYnJvd3NlciA9IHJlcXVpcmUoJy4vYnJvd3Nlci5qcycpXG4iLCJ2YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvZ2dpbmdcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBzdWJzY3JpYmVkID0ge31cblxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbihzdWJqZWN0IC8qICwgLi4uICovKSB7XG4gIGlmICghc3Vic2NyaWJlZFtzdWJqZWN0XSlcbiAgICByZXR1cm5cbiAgYXJndW1lbnRzWzBdID0gJ1snICsgc3ViamVjdCArICddJ1xuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbmV4cG9ydHMuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBzdWJzY3JpYmVkW3N1YmplY3RdID0gdHJ1ZVxufVxuXG5leHBvcnRzLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24oc3ViamVjdCkge1xuICBkZWxldGUgc2hvd2luZ1tzdWJqZWN0XVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXNzZXJ0cywgZXJyb3JzLCBldGMuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmVycm9yID0gZnVuY3Rpb24oLyogYXJnMSwgYXJnMiwgLi4uICovKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKVxuICBjb25zb2xlLmVycm9yLmFwcGx5KGNvbnNvbGUsIGFyZ3MpXG4gIHRocm93ICdlcnJvcjogJyArIGFyZ3Muam9pbignICcpXG59XG5cbmV4cG9ydHMuc2FuaXR5Q2hlY2sgPSBmdW5jdGlvbihuYW1lLCBjb25kaXRpb24pIHtcbiAgaWYgKCFjb25kaXRpb24pXG4gICAgdGhpc01vZHVsZS5lcnJvcignZmFpbGVkIHNhbml0eSBjaGVjazonLCBuYW1lKVxufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRE9NIHV0aWxzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLnByZXR0eVByaW50Tm9kZSA9IGZ1bmN0aW9uKG5vZGUsIGVuZE5vZGUsIGVuZE9mZnNldCkge1xuICBpZiAobm9kZSBpbnN0YW5jZW9mIFRleHQpIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSlcbiAgICAgIHJldHVybiAndGV4dHsnICsgbm9kZS5kYXRhLnN1YnN0cigwLCBlbmRPZmZzZXQpICsgJ3wnICsgbm9kZS5kYXRhLnN1YnN0cihlbmRPZmZzZXQpICsgJ30nXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICd0ZXh0eycgKyBub2RlLmRhdGEgKyAnfSdcbiAgfVxuXG4gIHZhciBwYXJ0cyA9IFtub2RlLnRhZ05hbWUsICd7J11cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAobm9kZSA9PT0gZW5kTm9kZSAmJiBlbmRPZmZzZXQgPT0gaWR4KVxuICAgICAgcGFydHMucHVzaCgnfCcpXG4gICAgcGFydHMucHVzaCh0aGlzTW9kdWxlLnByZXR0eVByaW50Tm9kZShub2RlLmNoaWxkTm9kZXMuaXRlbShpZHgpLCBlbmROb2RlLCBlbmRPZmZzZXQpKVxuICB9XG4gIGlmIChub2RlID09PSBlbmROb2RlICYmIGVuZE9mZnNldCA9PSBub2RlLmNoaWxkTm9kZXMubGVuZ3RoKVxuICAgIHBhcnRzLnB1c2goJ3wnKVxuICBwYXJ0cy5wdXNoKCd9JylcbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG5cbiIsIi8vIEhlbHBlcnNcblxuZnVuY3Rpb24gZG91YmxlRXF1YWxzKHgsIHkpIHtcbiAgcmV0dXJuIHggPT0geVxufVxuXG5mdW5jdGlvbiB0cmlwbGVFcXVhbHMoeCwgeSkge1xuICByZXR1cm4geCA9PT0geVxufVxuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZSh4KSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHhcbiAgcmV0dXJuIHR5cGUgIT09ICdvYmplY3QnXG59XG5cbmZ1bmN0aW9uIGVxdWFscyh4LCB5LCBkZWVwLCBlcUZuKSB7XG4gIGlmIChpc1ByaW1pdGl2ZSh4KSlcbiAgICByZXR1cm4gZXFGbih4LCB5KVxuICBmb3IgKHZhciBwIGluIHgpXG4gICAgaWYgKGRlZXAgJiYgIWVxdWFscyh4W3BdLCB5W3BdLCBkZWVwLCBlcUZuKSB8fFxuICAgICAgICAhZGVlcCAmJiAhZXFGbih4W3BdLCB5W3BdKSlcbiAgICAgIHJldHVybiBmYWxzZVxuICBmb3IgKHZhciBwIGluIHkpXG4gICAgaWYgKHlbcF0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICB4W3BdID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIoYXJyMSwgYXJyMiwgZGVlcCwgZXFGbikge1xuICBpZiAoIWFycjEgaW5zdGFuY2VvZiBBcnJheSB8fCAhYXJyMiBpbnN0YW5jZW9mIEFycmF5IHx8XG4gICAgICBhcnIxLmxlbmd0aCAhPT0gYXJyMi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycjEubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyMVtpZHhdXG4gICAgdmFyIGZvdW5kWCA9IGFycjIuc29tZShmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4gZXF1YWxzKHgsIHksIGRlZXAsIGVxRm4pXG4gICAgfSlcbiAgICBpZiAoIWZvdW5kWClcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cbi8vIFB1YmxpYyBtZXRob2RzXG5cbmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuZGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RXF1YWxzID0gZnVuY3Rpb24oeCwgeSkge1xuICByZXR1cm4gZXF1YWxzKHgsIHksIGZhbHNlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuc3RyaWN0RGVlcEVxdWFscyA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgcmV0dXJuIGVxdWFscyh4LCB5LCB0cnVlLCB0cmlwbGVFcXVhbHMpXG59XG5cbmV4cG9ydHMuaGF2ZVNhbWVDb250ZW50c0luQW55T3JkZXIgPSBmdW5jdGlvbihhcnIxLCBhcnIyKSB7XG4gIHJldHVybiBoYXZlU2FtZUNvbnRlbnRzSW5BbnlPcmRlcihhcnIxLCBhcnIyLCB0cnVlLCBkb3VibGVFcXVhbHMpXG59XG5cbiIsInZhciB0aGlzTW9kdWxlID0gZXhwb3J0c1xuXG5leHBvcnRzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGZ1bmN0aW9uKG9iaiwgb3B0UHJvcGVydGllcykge1xuICBmdW5jdGlvbiBjb25zKCkge31cbiAgY29ucy5wcm90b3R5cGUgPSBvYmpcbiAgdmFyIGFucyA9IG5ldyBjb25zKClcbiAgaWYgKG9wdFByb3BlcnRpZXMpXG4gICAgdGhpc01vZHVsZS5rZXlzQW5kVmFsdWVzRG8ob3B0UHJvcGVydGllcywgZnVuY3Rpb24oaywgdikge1xuICAgICAgYW5zW2tdID0gdlxuICAgIH0pXG4gIHJldHVybiBhbnNcbn1cblxuZXhwb3J0cy5mb3JtYWxzID0gZnVuY3Rpb24oZnVuYykge1xuICByZXR1cm4gZnVuYy5cbiAgICB0b1N0cmluZygpLlxuICAgIG1hdGNoKC9cXCgoLio/KVxcKS8pWzBdLlxuICAgIHJlcGxhY2UoLyAvZywgJycpLlxuICAgIHNsaWNlKDEsIC0xKS5cbiAgICBzcGxpdCgnLCcpLlxuICAgIGZpbHRlcihmdW5jdGlvbihtb2R1bGVOYW1lKSB7IHJldHVybiBtb2R1bGVOYW1lICE9ICcnIH0pXG59XG5cbmV4cG9ydHMua2V5c0RvID0gZnVuY3Rpb24ob2JqZWN0LCBmbikge1xuICBmb3IgKHZhciBwIGluIG9iamVjdClcbiAgICBpZiAob2JqZWN0Lmhhc093blByb3BlcnR5KHApKVxuICAgICAgZm4ocClcbn1cblxuZXhwb3J0cy52YWx1ZXNEbyA9IGZ1bmN0aW9uKG9iamVjdCwgZm4pIHtcbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGZuKG9iamVjdFtwXSkgfSlcbn1cblxuZXhwb3J0cy5rZXlzQW5kVmFsdWVzRG8gPSBmdW5jdGlvbihvYmplY3QsIGZuKSB7XG4gIHRoaXNNb2R1bGUua2V5c0RvKG9iamVjdCwgZnVuY3Rpb24ocCkgeyBmbihwLCBvYmplY3RbcF0pIH0pXG59XG5cbmV4cG9ydHMua2V5c0l0ZXJhdG9yID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gIHJldHVybiBmdW5jdGlvbihmbikgeyBzZWxmLmtleXNEbyhvYmplY3QsIGZuKSB9XG59XG5cbmV4cG9ydHMudmFsdWVzSXRlcmF0b3IgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGZuKSB7IHNlbGYudmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLmtleXNBbmRWYWx1ZXNJdGVyYXRvciA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICByZXR1cm4gZnVuY3Rpb24oZm4pIHsgc2VsZi5rZXlzQW5kVmFsdWVzRG8ob2JqZWN0LCBmbikgfVxufVxuXG5leHBvcnRzLnZhbHVlcyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgYW5zID0gW11cbiAgdGhpc01vZHVsZS5rZXlzRG8ob2JqZWN0LCBmdW5jdGlvbihwKSB7IGFucy5wdXNoKG9iamVjdFtwXSkgfSlcbiAgcmV0dXJuIGFuc1xufVxuXG5mdW5jdGlvbiBTdHJpbmdCdWZmZXIoKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdXG4gIHRoaXMubGVuZ3RoU29GYXIgPSAwXG59XG5cblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLnN0cmluZ3MucHVzaChzKVxuICAgIHRoaXMubGVuZ3RoU29GYXIgKz0gcy5sZW5ndGhcbiAgfSxcblxuICBjb250ZW50czogZnVuY3Rpb24oKSAge1xuICAgIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJylcbiAgfVxufVxuXG5leHBvcnRzLnN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFN0cmluZ0J1ZmZlcigpXG59XG5cbmZ1bmN0aW9uIENvbHVtblN0cmluZ0J1ZmZlcigpIHtcbiAgdGhpcy5saW5lcyA9IFtdXG4gIHRoaXMubmV3TGluZSgpXG59XG5cbkNvbHVtblN0cmluZ0J1ZmZlci5wcm90b3R5cGUgPSB7XG4gIG5leHRQdXRBbGw6IGZ1bmN0aW9uKHMpIHtcbiAgICB0aGlzLmN1cnJlbnRDb2x1bW4oKS5wdXNoKHMpXG4gIH0sXG5cbiAgY29udGVudHM6IGZ1bmN0aW9uKCkge1xuICAgIC8vIENvbnZlcnQgY29sdW1ucyBmcm9tIGxpc3RzIG9mIHN0cmluZ3MgdG8gc3RyaW5ncywgYW5kIHJlY29yZCBjb2x1bW4gbGVuZ3Roc1xuICAgIHZhciBjb2x1bW5MZW5ndGhzID0gW11cbiAgICB0aGlzLmxpbmVzLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbGluZS5sZW5ndGg7IGNvbElkeCsrKSB7XG4gICAgICAgIHZhciBjb2x1bW4gPSBsaW5lW2NvbElkeF1cbiAgICAgICAgbGluZVtjb2xJZHhdID0gY29sdW1uLmpvaW4oJycpXG4gICAgICAgIGlmIChjb2x1bW5MZW5ndGhzW2NvbElkeF0gPT09IHVuZGVmaW5lZCB8fCBjb2x1bW5MZW5ndGhzW2NvbElkeF0gPCBsaW5lW2NvbElkeF0ubGVuZ3RoKVxuICAgICAgICAgIGNvbHVtbkxlbmd0aHNbY29sSWR4XSA9IGxpbmVbY29sSWR4XS5sZW5ndGhcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdmFyIHNiID0gdGhpc01vZHVsZS5zdHJpbmdCdWZmZXIoKVxuICAgIHRoaXMubGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBsaW5lLmxlbmd0aDsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbHVtbiA9IGxpbmVbY29sSWR4XVxuICAgICAgICBzYi5uZXh0UHV0QWxsKGNvbHVtbilcbiAgICAgICAgdmFyIG51bVNwYWNlcyA9IGNvbHVtbkxlbmd0aHNbY29sSWR4XSAtIGNvbHVtbi5sZW5ndGhcbiAgICAgICAgd2hpbGUgKG51bVNwYWNlcy0tID4gMClcbiAgICAgICAgICBzYi5uZXh0UHV0QWxsKCcgJylcbiAgICAgIH1cbiAgICAgIHNiLm5leHRQdXRBbGwoJ1xcbicpXG4gICAgfSlcbiAgICByZXR1cm4gc2IuY29udGVudHMoKVxuICB9LFxuXG4gIG5ld0xpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubGluZXMucHVzaChbXSlcbiAgICB0aGlzLm5ld0NvbHVtbigpXG4gIH0sXG5cbiAgbmV3Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmN1cnJlbnRMaW5lKCkucHVzaChbXSlcbiAgfSxcblxuICBjdXJyZW50Q29sdW1uOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgbGluZSA9IHRoaXMuY3VycmVudExpbmUoKVxuICAgIHJldHVybiBsaW5lW2xpbmUubGVuZ3RoIC0gMV1cbiAgfSxcblxuICBjdXJyZW50TGluZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGluZXNbdGhpcy5saW5lcy5sZW5ndGggLSAxXVxuICB9XG59XG5cbmV4cG9ydHMuY29sdW1uU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgQ29sdW1uU3RyaW5nQnVmZmVyKClcbn1cblxuIiwidmFyIG9iamVjdFV0aWxzID0gcmVxdWlyZSgnLi9vYmplY3RVdGlscy5qcycpXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHNcblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBwYWQobnVtYmVyQXNTdHJpbmcsIGxlbikge1xuICB2YXIgemVyb3MgPSBbXVxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBudW1iZXJBc1N0cmluZy5sZW5ndGggLSBsZW47IGlkeCsrKVxuICAgIHplcm9zLnB1c2goJzAnKVxuICByZXR1cm4gemVyb3Muam9pbignJykgKyBudW1iZXJBc1N0cmluZ1xufVxuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge31cbmZvciAodmFyIGMgPSAwOyBjIDwgMTI4OyBjKyspXG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYylcbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSAgPSBcIlxcXFwnXCJcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInXG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxiJ1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJ1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxyJ1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0J1xuZXNjYXBlU3RyaW5nRm9yWydcXHYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx2J1xuXG4vLyBQdWJsaWMgbWV0aG9kc1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMClcbiAgaWYgKChjID09ICdcIicgfHwgYyA9PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pXG4gICAgcmV0dXJuIGNcbiAgZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpXG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV1cbiAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KVxuICAgIHJldHVybiAnXFxcXHgnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMilcbiAgZWxzZVxuICAgIHJldHVybiAnXFxcXHUnICsgcGFkKGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNClcbn1cblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PSAnXFxcXCcpXG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6ICByZXR1cm4gJ1xcYidcbiAgICAgIGNhc2UgJ2YnOiAgcmV0dXJuICdcXGYnXG4gICAgICBjYXNlICduJzogIHJldHVybiAnXFxuJ1xuICAgICAgY2FzZSAncic6ICByZXR1cm4gJ1xccidcbiAgICAgIGNhc2UgJ3QnOiAgcmV0dXJuICdcXHQnXG4gICAgICBjYXNlICd2JzogIHJldHVybiAnXFx2J1xuICAgICAgY2FzZSAneCc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKVxuICAgICAgY2FzZSAndSc6ICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKVxuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSlcbiAgICB9XG4gIGVsc2VcbiAgICByZXR1cm4gc1xufVxuXG5mdW5jdGlvbiBwcmludE9uKHgsIHdzKSB7XG4gIGlmICh4IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdbJylcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB4Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmIChpZHggPiAwKVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKHhbaWR4XSwgd3MpXG4gICAgfVxuICAgIHdzLm5leHRQdXRBbGwoJ10nKVxuICB9IGVsc2UgaWYgKHR5cGVvZiB4ID09PSAnc3RyaW5nJykge1xuICAgIHZhciBoYXNTaW5nbGVRdW90ZXMgPSB4LmluZGV4T2YoXCInXCIpID49IDBcbiAgICB2YXIgaGFzRG91YmxlUXVvdGVzID0geC5pbmRleE9mKCdcIicpID49IDBcbiAgICB2YXIgZGVsaW0gPSBoYXNTaW5nbGVRdW90ZXMgJiYgIWhhc0RvdWJsZVF1b3RlcyA/ICdcIicgOiBcIidcIlxuICAgIHdzLm5leHRQdXRBbGwoZGVsaW0pXG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgeC5sZW5ndGg7IGlkeCsrKVxuICAgICAgd3MubmV4dFB1dEFsbCh0aGlzTW9kdWxlLmVzY2FwZUNoYXIoeFtpZHhdLCBkZWxpbSkpXG4gICAgd3MubmV4dFB1dEFsbChkZWxpbSlcbiAgfSBlbHNlIGlmICh4ID09PSBudWxsKSB7XG4gICAgd3MubmV4dFB1dEFsbCgnbnVsbCcpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHggPT09ICdvYmplY3QnICYmICEoeCBpbnN0YW5jZW9mIFJlZ0V4cCkpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCd7JylcbiAgICB2YXIgZmlyc3QgPSB0cnVlXG4gICAgb2JqZWN0VXRpbHMua2V5c0FuZFZhbHVlc0RvKHgsIGZ1bmN0aW9uKGssIHYpIHtcbiAgICAgIGlmIChmaXJzdClcbiAgICAgICAgZmlyc3QgPSBmYWxzZVxuICAgICAgZWxzZVxuICAgICAgICB3cy5uZXh0UHV0QWxsKCcsICcpXG4gICAgICBwcmludE9uKGssIHdzKVxuICAgICAgd3MubmV4dFB1dEFsbCgnOiAnKVxuICAgICAgcHJpbnRPbih2LCB3cylcbiAgICB9KVxuICAgIHdzLm5leHRQdXRBbGwoJ30nKVxuICB9IGVsc2VcbiAgICB3cy5uZXh0UHV0QWxsKCcnICsgeClcbn1cblxuZXhwb3J0cy5wcmludFN0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICB2YXIgd3MgPSBvYmplY3RVdGlscy5zdHJpbmdCdWZmZXIoKVxuICBwcmludE9uKG9iaiwgd3MpXG4gIHJldHVybiB3cy5jb250ZW50cygpXG59XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hci5qcycpO1xudmFyIGRlY2xzID0gcmVxdWlyZSgnLi9kZWNscy5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gQnVpbGRlcigpIHtcbiAgdGhpcy5pbml0KCk7XG59XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBHcmFtbWFyLnByb3RvdHlwZTtcbiAgICB0aGlzLnJ1bGVEZWNscyA9IFtdO1xuICB9LFxuXG4gIHNldE5hbWU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9LFxuXG4gIHNldFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gZ3JhbW1hcjtcbiAgfSxcblxuICBkZWZpbmU6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgZGVjbHMuRGVmaW5lKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpO1xuICB9LFxuXG4gIG92ZXJyaWRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSkge1xuICAgIHRoaXMucnVsZURlY2xzLnB1c2gobmV3IGRlY2xzLk92ZXJyaWRlKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpO1xuICB9LFxuXG4gIGlubGluZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnJ1bGVEZWNscy5wdXNoKG5ldyBkZWNscy5JbmxpbmUocnVsZU5hbWUsIGJvZHksIHRoaXMuc3VwZXJHcmFtbWFyKSk7XG4gICAgcmV0dXJuIHRoaXMuYXBwKHJ1bGVOYW1lKTtcbiAgfSxcblxuICBleHRlbmQ6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBib2R5KSB7XG4gICAgdGhpcy5ydWxlRGVjbHMucHVzaChuZXcgZGVjbHMuRXh0ZW5kKHJ1bGVOYW1lLCBib2R5LCB0aGlzLnN1cGVyR3JhbW1hcikpO1xuICB9LFxuXG4gIGJ1aWxkOiBmdW5jdGlvbihvcHROYW1lc3BhY2UpIHtcbiAgICB2YXIgc3VwZXJHcmFtbWFyID0gdGhpcy5zdXBlckdyYW1tYXI7XG4gICAgdmFyIHJ1bGVEaWN0ID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKHN1cGVyR3JhbW1hci5ydWxlRGljdCk7XG4gICAgdGhpcy5ydWxlRGVjbHMuZm9yRWFjaChmdW5jdGlvbihydWxlRGVjbCkge1xuICAgICAgcnVsZURlY2wucGVyZm9ybUNoZWNrcygpO1xuICAgICAgcnVsZURlY2wuaW5zdGFsbChydWxlRGljdCk7XG4gICAgfSk7XG5cbiAgICB2YXIgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKHJ1bGVEaWN0KTtcbiAgICBncmFtbWFyLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICBncmFtbWFyLnJ1bGVEZWNscyA9IHRoaXMucnVsZURlY2xzO1xuICAgIGlmICh0aGlzLm5hbWUpIHtcbiAgICAgIGdyYW1tYXIubmFtZSA9IHRoaXMubmFtZTtcbiAgICAgIGlmIChvcHROYW1lc3BhY2UpIHtcbiAgICAgICAgZ3JhbW1hci5uYW1lc3BhY2VOYW1lID0gb3B0TmFtZXNwYWNlLm5hbWU7XG4gICAgICAgIG9wdE5hbWVzcGFjZS5pbnN0YWxsKHRoaXMubmFtZSwgZ3JhbW1hcik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpO1xuICAgIHJldHVybiBncmFtbWFyO1xuICB9LFxuXG4gIF86IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBleHBycy5tYWtlUHJpbSh4KTsgfSxcbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLkFsdCkge1xuICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVybXMubGVuZ3RoID09PSAxID8gdGVybXNbMF0gOiBuZXcgcGV4cHJzLkFsdCh0ZXJtcyk7XG4gIH0sXG4gIHNlcTogZnVuY3Rpb24oLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgdmFyIGZhY3RvcnMgPSBbXTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5TZXEpIHtcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IHBleHBycy5TZXEoZmFjdG9ycyk7XG4gIH0sXG4gIGJpbmQ6IGZ1bmN0aW9uKGV4cHIsIG5hbWUpIHsgcmV0dXJuIG5ldyBwZXhwcnMuQmluZChleHByLCBuYW1lKTsgfSxcbiAgbWFueTogZnVuY3Rpb24oZXhwciwgbWluTnVtTWF0Y2hlcykgeyByZXR1cm4gbmV3IHBleHBycy5NYW55KGV4cHIsIG1pbk51bU1hdGNoZXMpOyB9LFxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuT3B0KGV4cHIpOyB9LFxuICBub3Q6IGZ1bmN0aW9uKGV4cHIpIHsgcmV0dXJuIG5ldyBwZXhwcnMuTm90KGV4cHIpOyB9LFxuICBsYTogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5Mb29rYWhlYWQoZXhwcik7IH0sXG4gIHN0cjogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5TdHIoZXhwcik7IH0sXG4gIGxzdDogZnVuY3Rpb24oZXhwcikgeyByZXR1cm4gbmV3IHBleHBycy5MaXN0KGV4cHIpOyB9LFxuICBvYmo6IGZ1bmN0aW9uKHByb3BlcnRpZXMsIGlzTGVuaWVudCkgeyByZXR1cm4gbmV3IHBleHBycy5PYmoocHJvcGVydGllcywgISFpc0xlbmllbnQpOyB9LFxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7IHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHJ1bGVOYW1lKTsgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbS5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgc2tpcFNwYWNlcyA9IHJlcXVpcmUoJy4vc2tpcFNwYWNlcy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyO1xudmFyIGtleXNEbyA9IGF3bGliLm9iamVjdFV0aWxzLmtleXNEbztcbnZhciBmb3JtYWxzID0gYXdsaWIub2JqZWN0VXRpbHMuZm9ybWFscztcbnZhciBtYWtlU3RyaW5nQnVmZmVyID0gYXdsaWIub2JqZWN0VXRpbHMuc3RyaW5nQnVmZmVyO1xudmFyIG1ha2VDb2x1bW5TdHJpbmdCdWZmZXIgPSBhd2xpYi5vYmplY3RVdGlscy5jb2x1bW5TdHJpbmdCdWZmZXI7XG52YXIgcHJpbnRTdHJpbmcgPSBhd2xpYi5zdHJpbmdVdGlscy5wcmludFN0cmluZztcbnZhciBlcXVhbHMgPSBhd2xpYi5lcXVhbHMuZXF1YWxzO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gR3JhbW1hcihydWxlRGljdCkge1xuICB0aGlzLnJ1bGVEaWN0ID0gcnVsZURpY3Q7XG59XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBydWxlRGljdDoge1xuICAgIF86IHBleHBycy5hbnl0aGluZyxcbiAgICBlbmQ6IG5ldyBwZXhwcnMuTm90KHBleHBycy5hbnl0aGluZyksXG4gICAgc3BhY2U6IHBleHBycy5tYWtlUHJpbSgvW1xcc10vKSxcbiAgICBzcGFjZXM6IG5ldyBwZXhwcnMuTWFueShuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZScpLCAwKSxcbiAgICBhbG51bTogcGV4cHJzLm1ha2VQcmltKC9bMC05YS16QS1aXS8pLFxuICAgIGxldHRlcjogcGV4cHJzLm1ha2VQcmltKC9bYS16QS1aXS8pLFxuICAgIGxvd2VyOiBwZXhwcnMubWFrZVByaW0oL1thLXpdLyksXG4gICAgdXBwZXI6IHBleHBycy5tYWtlUHJpbSgvW0EtWl0vKSxcbiAgICBkaWdpdDogcGV4cHJzLm1ha2VQcmltKC9bMC05XS8pLFxuICAgIGhleERpZ2l0OiBwZXhwcnMubWFrZVByaW0oL1swLTlhLWZBLUZdLylcbiAgfSxcblxuICBtYXRjaDogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUsIG9wdFRocm93T25GYWlsKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hDb250ZW50cyhbb2JqXSwgc3RhcnRSdWxlLCBvcHRUaHJvd09uRmFpbCk7XG4gIH0sXG5cbiAgbWF0Y2hDb250ZW50czogZnVuY3Rpb24ob2JqLCBzdGFydFJ1bGUsIG9wdFRocm93T25GYWlsKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gSW5wdXRTdHJlYW0ubmV3Rm9yKG9iaik7XG4gICAgdmFyIHRodW5rID0gbmV3IHBleHBycy5BcHBseShzdGFydFJ1bGUpLmV2YWwodW5kZWZpbmVkLCB0aGlzLnJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgdW5kZWZpbmVkKTtcbiAgICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHN0YXJ0UnVsZSkpIHtcbiAgICAgIHNraXBTcGFjZXModGhpcy5ydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgIH1cbiAgICB2YXIgYXNzZXJ0U2VtYW50aWNBY3Rpb25OYW1lc01hdGNoID0gdGhpcy5hc3NlcnRTZW1hbnRpY0FjdGlvbk5hbWVzTWF0Y2guYmluZCh0aGlzKTtcbiAgICBpZiAodGh1bmsgPT09IGNvbW1vbi5mYWlsIHx8ICFpbnB1dFN0cmVhbS5hdEVuZCgpKSB7XG4gICAgICBpZiAob3B0VGhyb3dPbkZhaWwpIHtcbiAgICAgICAgdGhyb3cge1xuICAgICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuICdtYXRjaCBmYWlsZWQnOyB9LFxuICAgICAgICAgIHBvczogaW5wdXRTdHJlYW0uZ2V0TWF4UG9zU2VlbigpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihhY3Rpb25EaWN0KSB7XG4gICAgICAgIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaChhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHRodW5rLmZvcmNlKGFjdGlvbkRpY3QsIHt9KTtcbiAgICAgIH07XG4gICAgfVxuICB9LFxuXG4gIGFzc2VydFNlbWFudGljQWN0aW9uTmFtZXNNYXRjaDogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcnVsZURpY3QgPSB0aGlzLnJ1bGVEaWN0O1xuICAgIHZhciBvayA9IHRydWU7XG4gICAga2V5c0RvKHJ1bGVEaWN0LCBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgaWYgKGFjdGlvbkRpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdmFyIGFjdHVhbCA9IGZvcm1hbHMoYWN0aW9uRGljdFtydWxlTmFtZV0pLnNvcnQoKTtcbiAgICAgIHZhciBleHBlY3RlZCA9IHNlbGYuc2VtYW50aWNBY3Rpb25BcmdOYW1lcyhydWxlTmFtZSk7XG4gICAgICBpZiAoIWVxdWFscyhhY3R1YWwsIGV4cGVjdGVkKSkge1xuICAgICAgICBvayA9IGZhbHNlO1xuICAgICAgICBjb25zb2xlLmxvZygnc2VtYW50aWMgYWN0aW9uIGZvciBydWxlJywgcnVsZU5hbWUsICdoYXMgdGhlIHdyb25nIGFyZ3VtZW50IG5hbWVzJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKCcgIGV4cGVjdGVkJywgZXhwZWN0ZWQpO1xuICAgICAgICBjb25zb2xlLmxvZygnICAgIGFjdHVhbCcsIGFjdHVhbCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFvaykge1xuICAgICAgYnJvd3Nlci5lcnJvcignb25lIG9yIG1vcmUgc2VtYW50aWMgYWN0aW9ucyBoYXZlIHRoZSB3cm9uZyBhcmd1bWVudCBuYW1lcyAtLSBzZWUgY29uc29sZSBmb3IgZGV0YWlscycpO1xuICAgIH1cbiAgfSxcblxuICBzZW1hbnRpY0FjdGlvbkFyZ05hbWVzOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiB0aGlzLnN1cGVyR3JhbW1hci5ydWxlRGljdFtydWxlTmFtZV0pIHtcbiAgICAgIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hci5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVEaWN0W3J1bGVOYW1lXTtcbiAgICAgIHZhciBuYW1lcyA9IGJvZHkuZ2V0QmluZGluZ05hbWVzKCk7XG4gICAgICByZXR1cm4gbmFtZXMubGVuZ3RoID4gMCB8fCBib2R5LnByb2R1Y2VzVmFsdWUoKSA/IFsnZW52J10gOiBbXTtcbiAgICB9XG4gIH0sXG5cbiAgdG9SZWNpcGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB3cyA9IG1ha2VTdHJpbmdCdWZmZXIoKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcoZnVuY3Rpb24ob2htLCBvcHROYW1lc3BhY2UpIHtcXG4nKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcgIHZhciBiID0gb2htLl9idWlsZGVyKCk7XFxuJyk7XG4gICAgd3MubmV4dFB1dEFsbCgnICBiLnNldE5hbWUoJyk7IHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7IHdzLm5leHRQdXRBbGwoJyk7XFxuJyk7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUgJiYgdGhpcy5zdXBlckdyYW1tYXIubmFtZXNwYWNlTmFtZSkge1xuICAgICAgd3MubmV4dFB1dEFsbCgnICBiLnNldFN1cGVyR3JhbW1hcihvaG0ubmFtZXNwYWNlKCcpO1xuICAgICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLnN1cGVyR3JhbW1hci5uYW1lc3BhY2VOYW1lKSk7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcpLmdldEdyYW1tYXIoJyk7XG4gICAgICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpKTtcbiAgICAgIHdzLm5leHRQdXRBbGwoJykpO1xcbicpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnJ1bGVEZWNscy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB3cy5uZXh0UHV0QWxsKCcgICcpO1xuICAgICAgdGhpcy5ydWxlRGVjbHNbaWR4XS5vdXRwdXRSZWNpcGUod3MpO1xuICAgICAgd3MubmV4dFB1dEFsbCgnO1xcbicpO1xuICAgIH1cbiAgICB3cy5uZXh0UHV0QWxsKCcgIHJldHVybiBiLmJ1aWxkKG9wdE5hbWVzcGFjZSk7XFxuJyk7XG4gICAgd3MubmV4dFB1dEFsbCgnfSk7Jyk7XG4gICAgcmV0dXJuIHdzLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgdG9TZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbigvKiBlbnRyeVBvaW50MSwgZW50cnlQb2ludDIsIC4uLiAqLykge1xuICAgIHZhciBlbnRyeVBvaW50cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzIDogT2JqZWN0LmtleXModGhpcy5ydWxlRGljdCk7XG5cbiAgICB2YXIgcnVsZXNUb0JlSW5jbHVkZWQgPSB7fTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBlbnRyeVBvaW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgcnVsZU5hbWUgPSBlbnRyeVBvaW50c1tpZHhdO1xuICAgICAgaWYgKHRoaXMucnVsZURpY3RbcnVsZU5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkUnVsZUVycm9yKHJ1bGVOYW1lLCB0aGlzLm5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcnVsZXNUb0JlSW5jbHVkZWRbcnVsZU5hbWVdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZG9uZSA9IGZhbHNlO1xuICAgIHdoaWxlICghZG9uZSkge1xuICAgICAgZG9uZSA9IHRydWU7XG4gICAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBydWxlc1RvQmVJbmNsdWRlZCkge1xuICAgICAgICB2YXIgYWRkZWROZXdSdWxlID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV0uYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKHJ1bGVzVG9CZUluY2x1ZGVkLCB0cnVlKTtcbiAgICAgICAgZG9uZSAmPSAhYWRkZWROZXdSdWxlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRPRE86IGFkZCB0aGUgc3VwZXItZ3JhbW1hcidzIHRlbXBsYXRlcyBhdCB0aGUgcmlnaHQgcGxhY2UsIGUuZy4sIGEgY2FzZSBmb3IgQWRkRXhwci1wbHVzIHNob3VsZCBhcHBlYXIgbmV4dCB0b1xuICAgIC8vIG90aGVyIGNhc2VzIG9mIEFkZC1FeHByLlxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBidWZmZXIgPSBtYWtlQ29sdW1uU3RyaW5nQnVmZmVyKCk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ3snKTtcblxuICAgIHZhciBmaXJzdCA9IHRydWU7XG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gcnVsZXNUb0JlSW5jbHVkZWQpIHtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlRGljdFtydWxlTmFtZV07XG4gICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcsJyk7XG4gICAgICB9XG4gICAgICBidWZmZXIubmV3TGluZSgpO1xuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoJyAgJyk7XG4gICAgICBidWZmZXIubmV3Q29sdW1uKCk7XG4gICAgICBzZWxmLmFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGUocnVsZU5hbWUsIGJvZHksIGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgYnVmZmVyLm5ld0xpbmUoKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnfScpO1xuICAgIHJldHVybiBidWZmZXIuY29udGVudHMoKTtcbiAgfSxcblxuICBhZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSwgYnVmZmVyKSB7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwocnVsZU5hbWUpO1xuICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCc6ICcpO1xuICAgIGJ1ZmZlci5uZXdDb2x1bW4oKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnZnVuY3Rpb24oJyk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwodGhpcy5zZW1hbnRpY0FjdGlvbkFyZ05hbWVzKHJ1bGVOYW1lKS5qb2luKCcsICcpKTtcbiAgICBidWZmZXIubmV4dFB1dEFsbCgnKSAnKTtcbiAgICBidWZmZXIubmV3Q29sdW1uKCk7XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ3snKTtcblxuICAgIHZhciBlbnZQcm9wZXJ0aWVzID0gYm9keS5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgICBpZiAoZW52UHJvcGVydGllcy5sZW5ndGggPT09IDAgJiYgYm9keS5wcm9kdWNlc1ZhbHVlKCkpIHtcbiAgICAgIGVudlByb3BlcnRpZXMgPSBbJ3ZhbHVlJ107XG4gICAgfVxuICAgIGlmIChlbnZQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGJ1ZmZlci5uZXh0UHV0QWxsKCcgLyogJyk7XG4gICAgICBidWZmZXIubmV4dFB1dEFsbChlbnZQcm9wZXJ0aWVzLmpvaW4oJywgJykpO1xuICAgICAgYnVmZmVyLm5leHRQdXRBbGwoJyAqLyAnKTtcbiAgICB9XG4gICAgYnVmZmVyLm5leHRQdXRBbGwoJ30nKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hcjtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIFBvc0luZm8gPSByZXF1aXJlKCcuL1Bvc0luZm8uanMnKTtcblxudmFyIGF3bGliID0gcmVxdWlyZSgnYXdsaWInKTtcbnZhciBvYmplY3RUaGF0RGVsZWdhdGVzVG8gPSBhd2xpYi5vYmplY3RVdGlscy5vYmplY3RUaGF0RGVsZWdhdGVzVG87XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbSgpIHtcbiAgdGhyb3cgJ0lucHV0U3RyZWFtIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jztcbn1cblxuSW5wdXRTdHJlYW0ubmV3Rm9yID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBuZXcgU3RyaW5nSW5wdXRTdHJlYW0ob2JqKTtcbiAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHJldHVybiBuZXcgTGlzdElucHV0U3RyZWFtKG9iaik7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgJ2Nhbm5vdCBtYWtlIGlucHV0IHN0cmVhbSBmb3IgJyArIG9iajtcbiAgfVxufTtcblxuSW5wdXRTdHJlYW0ucHJvdG90eXBlID0ge1xuICBpbml0OiBmdW5jdGlvbihzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnBvcyA9IDA7XG4gICAgdGhpcy5tYXhQb3NTZWVuID0gLTE7XG4gICAgdGhpcy5wb3NJbmZvcyA9IFtdO1xuICB9LFxuXG4gIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VyclBvcyA9IHRoaXMucG9zO1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5wb3NJbmZvc1tjdXJyUG9zXTtcbiAgICByZXR1cm4gcG9zSW5mbyB8fCAodGhpcy5wb3NJbmZvc1tjdXJyUG9zXSA9IG5ldyBQb3NJbmZvKGN1cnJQb3MpKTtcbiAgfSxcblxuICBhdEVuZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9zID09PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gIH0sXG5cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucG9zID4gdGhpcy5tYXhQb3NTZWVuKSB7XG4gICAgICB0aGlzLm1heFBvc1NlZW4gPSB0aGlzLnBvcztcbiAgICB9XG4gICAgaWYgKHRoaXMuYXRFbmQoKSkge1xuICAgICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5wb3MrK107XG4gICAgfVxuICB9LFxuXG4gIG1hdGNoRXhhY3RseTogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiB0aGlzLm5leHQoKSA9PT0geCA/IHRydWUgOiBjb21tb24uZmFpbDtcbiAgfSxcblxuICBpbnRlcnZhbDogZnVuY3Rpb24oc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydElkeCwgZW5kSWR4KTtcbiAgfSxcblxuICBnZXRNYXhQb3NTZWVuOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXhQb3NTZWVuO1xuICB9XG59O1xuXG5mdW5jdGlvbiBTdHJpbmdJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSk7XG59XG5cblN0cmluZ0lucHV0U3RyZWFtLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhJbnB1dFN0cmVhbS5wcm90b3R5cGUsIHtcbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmICh0aGlzLm1hdGNoRXhhY3RseShzW2lkeF0pID09PSBjb21tb24uZmFpbCkge1xuICAgICAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIG1hdGNoUmVnRXhwOiBmdW5jdGlvbihlKSB7XG4gICAgLy8gSU1QT1JUQU5UOiBlIG11c3QgYmUgYSBub24tZ2xvYmFsLCBvbmUtY2hhcmFjdGVyIGV4cHJlc3Npb24sIGUuZy4sIC8uLyBhbmQgL1swLTldL1xuICAgIHZhciBjID0gdGhpcy5uZXh0KCk7XG4gICAgcmV0dXJuIGMgIT09IGNvbW1vbi5mYWlsICYmIGUudGVzdChjKSA/IHRydWUgOiBjb21tb24uZmFpbDtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIExpc3RJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5pbml0KHNvdXJjZSk7XG59XG5cbkxpc3RJbnB1dFN0cmVhbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oSW5wdXRTdHJlYW0ucHJvdG90eXBlLCB7XG4gIG1hdGNoU3RyaW5nOiBmdW5jdGlvbihzKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KHMpO1xuICB9LFxuXG4gIG1hdGNoUmVnRXhwOiBmdW5jdGlvbihlKSB7XG4gICAgcmV0dXJuIHRoaXMubWF0Y2hFeGFjdGx5KGUpO1xuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRTdHJlYW07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcnZhbChzb3VyY2UsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeDtcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHg7XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEludGVydmFsLnByb3RvdHlwZSwge1xuICAnY29udGVudHMnOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9jb250ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRzID0gSW5wdXRTdHJlYW0ubmV3Rm9yKHRoaXMuc291cmNlKS5pbnRlcnZhbCh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbDtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBvaG0gPSByZXF1aXJlKCcuL21haW4uanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTmFtZXNwYWNlc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTmFtZXNwYWNlKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5ncmFtbWFycyA9IHt9O1xufVxuXG5OYW1lc3BhY2UucHJvdG90eXBlID0ge1xuICBpbnN0YWxsOiBmdW5jdGlvbihuYW1lLCBncmFtbWFyKSB7XG4gICAgaWYgKHRoaXMuZ3JhbW1hcnNbbmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uRXJyb3IobmFtZSwgdGhpcy5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ncmFtbWFyc1tuYW1lXSA9IGdyYW1tYXI7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIGdldEdyYW1tYXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBpZiAodGhpcy5ncmFtbWFyc1tuYW1lXSkge1xuICAgICAgcmV0dXJuIHRoaXMuZ3JhbW1hcnNbbmFtZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZEdyYW1tYXJFcnJvcihuYW1lLCB0aGlzLm5hbWUpO1xuICAgIH1cbiAgfSxcblxuICBsb2FkR3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudDogZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIGJyb3dzZXIuc2FuaXR5Q2hlY2soJ3NjcmlwdCB0YWdcXCdzIHR5cGUgYXR0cmlidXRlIG11c3QgYmUgXCJ0ZXh0L29obS1qc1wiJywgZWxlbWVudC50eXBlID09PSAndGV4dC9vaG0tanMnKTtcbiAgICBvaG0ubWFrZUdyYW1tYXJzKGVsZW1lbnQuaW5uZXJIVE1MLCB0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBtYWtlOiBmdW5jdGlvbihyZWNpcGUpIHtcbiAgICByZXR1cm4gcmVjaXBlKG9obSwgdGhpcyk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVzcGFjZTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUG9zSW5mbyhwb3MpIHtcbiAgdGhpcy5wb3MgPSBwb3M7XG4gIHRoaXMucnVsZVN0YWNrID0gW107XG4gIHRoaXMuYWN0aXZlUnVsZXMgPSB7fTsgIC8vIHJlZHVuZGFudCAoY291bGQgYmUgZ2VuZXJhdGVkIGZyb20gcnVsZVN0YWNrKSBidXQgdXNlZnVsIGZvciBwZXJmb3JtYW5jZSByZWFzb25zXG4gIHRoaXMubWVtbyA9IHt9O1xufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnB1c2gocnVsZU5hbWUpO1xuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gdHJ1ZTtcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHRoaXMucnVsZVN0YWNrLnBvcCgpO1xuICAgIHRoaXMuYWN0aXZlUnVsZXNbcnVsZU5hbWVdID0gZmFsc2U7XG4gIH0sXG5cbiAgc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQ6IGZ1bmN0aW9uKG1lbW9SZWMpIHtcbiAgICB2YXIgaW52b2x2ZWRSdWxlcyA9IG1lbW9SZWMuaW52b2x2ZWRSdWxlcztcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiBpbnZvbHZlZFJ1bGVzKSB7XG4gICAgICBpZiAoaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gJiYgdGhpcy5hY3RpdmVSdWxlc1tydWxlTmFtZV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBnZXRDdXJyZW50TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID8gdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2tbdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2subGVuZ3RoIC0gMV0gOiB1bmRlZmluZWQ7XG4gIH0sXG5cbiAgc3RhcnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIGlmICghdGhpcy5sZWZ0UmVjdXJzaW9uU3RhY2spIHtcbiAgICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrID0gW107XG4gICAgfVxuICAgIHRoaXMubGVmdFJlY3Vyc2lvblN0YWNrLnB1c2goe25hbWU6IHJ1bGVOYW1lLCB2YWx1ZTogY29tbW9uLmZhaWwsIHBvczogLTEsIGludm9sdmVkUnVsZXM6IHt9fSk7XG4gICAgdGhpcy51cGRhdGVJbnZvbHZlZFJ1bGVzKCk7XG4gIH0sXG5cbiAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB0aGlzLmxlZnRSZWN1cnNpb25TdGFjay5wb3AoKTtcbiAgfSxcblxuICB1cGRhdGVJbnZvbHZlZFJ1bGVzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgdmFyIGludm9sdmVkUnVsZXMgPSBjdXJyZW50TGVmdFJlY3Vyc2lvbi5pbnZvbHZlZFJ1bGVzO1xuICAgIHZhciBsclJ1bGVOYW1lID0gY3VycmVudExlZnRSZWN1cnNpb24ubmFtZTtcbiAgICB2YXIgaWR4ID0gdGhpcy5ydWxlU3RhY2subGVuZ3RoIC0gMTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5ydWxlU3RhY2tbaWR4LS1dO1xuICAgICAgaWYgKHJ1bGVOYW1lID09PSBsclJ1bGVOYW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW52b2x2ZWRSdWxlc1tydWxlTmFtZV0gPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9zKSB7XG4gIHJldHVybiBuZXcgUG9zSW5mbyhwb3MpO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuYWJzdHJhY3QgPSBmdW5jdGlvbigpIHtcbiAgdGhyb3cgJ3RoaXMgbWV0aG9kIGlzIGFic3RyYWN0ISc7XG59O1xuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmZhaWwgPSB7fTtcblxuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgcmV0dXJuICdBJyA8PSBmaXJzdENoYXIgJiYgZmlyc3RDaGFyIDw9ICdaJztcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xudmFyIHByaW50U3RyaW5nID0gYXdsaWIuc3RyaW5nVXRpbHMucHJpbnRTdHJpbmc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBSdWxlRGVjbCgpIHtcbiAgdGhyb3cgJ1J1bGVEZWNsIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXRcXCdzIGFic3RyYWN0Jztcbn1cblxuUnVsZURlY2wucHJvdG90eXBlID0ge1xuICBwZXJmb3JtQ2hlY2tzOiBjb21tb24uYWJzdHJhY3QsXG5cbiAgcGVyZm9ybUNvbW1vbkNoZWNrczogZnVuY3Rpb24obmFtZSwgYm9keSkge1xuICAgIGJvZHkuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhuYW1lKTtcbiAgICBib2R5LmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKG5hbWUpO1xuICAgIGJvZHkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MobmFtZSk7XG4gIH0sXG5cbiAgaW5zdGFsbDogZnVuY3Rpb24ocnVsZURpY3QpIHtcbiAgICBydWxlRGljdFt0aGlzLm5hbWVdID0gdGhpcy5ib2R5O1xuICB9LFxuXG4gIG91dHB1dFJlY2lwZTogZnVuY3Rpb24od3MpIHtcbiAgICB3cy5uZXh0UHV0QWxsKCdiLicpO1xuICAgIHdzLm5leHRQdXRBbGwodGhpcy5raW5kKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcoJyk7XG4gICAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyh0aGlzLm5hbWUpKTtcbiAgICB3cy5uZXh0UHV0QWxsKCcsICcpO1xuICAgIHRoaXMuYm9keS5vdXRwdXRSZWNpcGUod3MpO1xuICAgIHdzLm5leHRQdXRBbGwoJyknKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gRGVmaW5lKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJvZHkgPSBib2R5O1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbn1cblxuRGVmaW5lLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhSdWxlRGVjbC5wcm90b3R5cGUsIHtcbiAga2luZDogJ2RlZmluZScsXG5cbiAgcGVyZm9ybUNoZWNrczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVEaWN0W3RoaXMubmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlUnVsZURlY2xhcmF0aW9uRXJyb3IodGhpcy5uYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5ib2R5KTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIE92ZXJyaWRlKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJvZHkgPSBib2R5O1xuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbn1cblxuT3ZlcnJpZGUucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnb3ZlcnJpZGUnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdmVycmlkZGVuID0gdGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXTtcbiAgICBpZiAoIW92ZXJyaWRkZW4pIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGVFcnJvcih0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICAgIH1cbiAgICBpZiAob3ZlcnJpZGRlbi5nZXRCaW5kaW5nTmFtZXMoKS5sZW5ndGggPT09IDAgJiYgb3ZlcnJpZGRlbi5wcm9kdWNlc1ZhbHVlKCkgJiYgIXRoaXMuYm9keS5wcm9kdWNlc1ZhbHVlKCkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuUnVsZU11c3RQcm9kdWNlVmFsdWVFcnJvcih0aGlzLm5hbWUsICdvdmVycmlkaW5nJyk7XG4gICAgfVxuICAgIHRoaXMucGVyZm9ybUNvbW1vbkNoZWNrcyh0aGlzLm5hbWUsIHRoaXMuYm9keSk7XG4gIH1cbn0pO1xuXG5mdW5jdGlvbiBJbmxpbmUobmFtZSwgYm9keSwgc3VwZXJHcmFtbWFyKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xufVxuXG5JbmxpbmUucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFJ1bGVEZWNsLnByb3RvdHlwZSwge1xuICBraW5kOiAnaW5saW5lJyxcblxuICBwZXJmb3JtQ2hlY2tzOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBjb25zaWRlciByZWxheGluZyB0aGlzIGNoZWNrLCBlLmcuLCBtYWtlIGl0IG9rIHRvIG92ZXJyaWRlIGFuIGlubGluZSBydWxlIGlmIHRoZSBuZXN0aW5nIHJ1bGUgaXNcbiAgICAvLyBhbiBvdmVycmlkZS4gQnV0IG9ubHkgaWYgdGhlIGlubGluZSBydWxlIHRoYXQncyBiZWluZyBvdmVycmlkZGVuIGlzIG5lc3RlZCBpbnNpZGUgdGhlIG5lc3RpbmcgcnVsZSB0aGF0XG4gICAgLy8gd2UncmUgb3ZlcnJpZGluZz8gSG9wZWZ1bGx5IHRoZXJlJ3MgYSBtdWNoIGxlc3MgY29tcGxpY2F0ZWQgd2F5IHRvIGRvIHRoaXMgOilcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIucnVsZURpY3RbdGhpcy5uYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IGVycm9ycy5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb25FcnJvcih0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLnBlcmZvcm1Db21tb25DaGVja3ModGhpcy5uYW1lLCB0aGlzLmJvZHkpO1xuICB9XG59KTtcblxuZnVuY3Rpb24gRXh0ZW5kKG5hbWUsIGJvZHksIHN1cGVyR3JhbW1hcikge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJhc2UgPSBzdXBlckdyYW1tYXIucnVsZURpY3RbbmFtZV07XG4gIGlmICghdGhpcy5iYXNlKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5VbmRlY2xhcmVkUnVsZUVycm9yKG5hbWUsIHN1cGVyR3JhbW1hci5uYW1lKTtcbiAgfVxuICB0aGlzLmJvZHkgPSBib2R5O1xuICB0aGlzLmV4dGVuZGVkQm9keSA9IG5ldyBwZXhwcnMuRXh0ZW5kQWx0KHRoaXMuYm9keSwgdGhpcy5iYXNlKTtcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG59XG5cbkV4dGVuZC5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUnVsZURlY2wucHJvdG90eXBlLCB7XG4gIGtpbmQ6ICdleHRlbmQnLFxuXG4gIHBlcmZvcm1DaGVja3M6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmJhc2UuZ2V0QmluZGluZ05hbWVzKCkubGVuZ3RoID09PSAwICYmIHRoaXMuYmFzZS5wcm9kdWNlc1ZhbHVlKCkgJiYgIXRoaXMuYm9keS5wcm9kdWNlc1ZhbHVlKCkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuUnVsZU11c3RQcm9kdWNlVmFsdWVFcnJvcih0aGlzLm5hbWUsICdleHRlbmRpbmcnKTtcbiAgICB9XG4gICAgdGhpcy5wZXJmb3JtQ29tbW9uQ2hlY2tzKHRoaXMubmFtZSwgdGhpcy5leHRlbmRlZEJvZHkpO1xuICB9LFxuXG4gIGluc3RhbGw6IGZ1bmN0aW9uKHJ1bGVEaWN0KSB7XG4gICAgcnVsZURpY3RbdGhpcy5uYW1lXSA9IHRoaXMuZXh0ZW5kZWRCb2R5O1xuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuUnVsZURlY2wgPSBSdWxlRGVjbDtcbmV4cG9ydHMuRGVmaW5lID0gRGVmaW5lO1xuZXhwb3J0cy5PdmVycmlkZSA9IE92ZXJyaWRlO1xuZXhwb3J0cy5JbmxpbmUgPSBJbmxpbmU7XG5leHBvcnRzLkV4dGVuZCA9IEV4dGVuZDtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGdyYW1tYXJzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuZGVjbGFyYXRlZCBncmFtbWFyXG5cbmV4cG9ydHMuVW5kZWNsYXJlZEdyYW1tYXJFcnJvciA9IGZ1bmN0aW9uKGdyYW1tYXJOYW1lLCBvcHROYW1lc3BhY2VOYW1lKSB7XG4gIHRoaXMuZ3JhbW1hck5hbWUgPSBncmFtbWFyTmFtZTtcbiAgdGhpcy5uYW1lc3BhY2VOYW1lID0gb3B0TmFtZXNwYWNlTmFtZTtcbn07XG5cbmV4cG9ydHMuVW5kZWNsYXJlZEdyYW1tYXJFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubmFtZXNwYWNlTmFtZSA/XG4gICAgWydncmFtbWFyJywgdGhpcy5ncmFtbWFyTmFtZSwgJ2lzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UnLCB0aGlzLm5hbWVzcGFjZU5hbWVdLmpvaW4oJyAnKSA6XG4gICAgWyd1bmRlY2xhcmVkIGdyYW1tYXInLCB0aGlzLmdyYW1tYXJOYW1lXS5qb2luKCcgJyk7XG59O1xuXG4vLyBEdXBsaWNhdGUgZ3JhbW1hciBkZWNsYXJhdGlvblxuXG5leHBvcnRzLkR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbkVycm9yID0gZnVuY3Rpb24oZ3JhbW1hck5hbWUsIG5hbWVzcGFjZU5hbWUpIHtcbiAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xuICB0aGlzLm5hbWVzcGFjZU5hbWUgPSBuYW1lc3BhY2VOYW1lO1xufTtcblxuZXhwb3J0cy5EdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb25FcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsnZ3JhbW1hcicsIHRoaXMuZ3JhbW1hck5hbWUsICdpcyBhbHJlYWR5IGRlY2xhcmVkIGluIG5hbWVzcGFjZScsIHRoaXMubmFtZXNwYWNlTmFtZV0uam9pbignICcpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcnVsZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5kZWNsYXJlZCBydWxlXG5cbmV4cG9ydHMuVW5kZWNsYXJlZFJ1bGVFcnJvciA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBvcHRHcmFtbWFyTmFtZSkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuZ3JhbW1hck5hbWUgPSBvcHRHcmFtbWFyTmFtZTtcbn07XG5cbmV4cG9ydHMuVW5kZWNsYXJlZFJ1bGVFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZ3JhbW1hck5hbWUgP1xuICAgIFsncnVsZScsIHRoaXMucnVsZU5hbWUsICdpcyBub3QgZGVjbGFyZWQgaW4gZ3JhbW1hcicsIHRoaXMuZ3JhbW1hck5hbWVdLmpvaW4oJyAnKSA6XG4gICAgWyd1bmRlY2xhcmVkIHJ1bGUnLCB0aGlzLnJ1bGVOYW1lXS5qb2luKCcgJyk7XG59O1xuXG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuXG5leHBvcnRzLkR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbkVycm9yID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXJOYW1lKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5ncmFtbWFyTmFtZSA9IGdyYW1tYXJOYW1lO1xufTtcblxuZXhwb3J0cy5EdXBsaWNhdGVSdWxlRGVjbGFyYXRpb25FcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFsncnVsZScsIHRoaXMucnVsZU5hbWUsICdpcyBhbHJlYWR5IGRlY2xhcmVkIGluIGdyYW1tYXInLCB0aGlzLmdyYW1tYXJOYW1lXS5qb2luKCcgJyk7XG59O1xuXG4vLyBSdWxlIG11c3QgcHJvZHVjZSB2YWx1ZVxuXG5leHBvcnRzLlJ1bGVNdXN0UHJvZHVjZVZhbHVlRXJyb3IgPSBmdW5jdGlvbihydWxlTmFtZSwgd2h5KSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy53aHkgPSB3aHk7XG59O1xuXG5leHBvcnRzLlJ1bGVNdXN0UHJvZHVjZVZhbHVlRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbXG4gICAgJ3J1bGUnLCB0aGlzLnJ1bGVOYW1lLCAnbXVzdCBwcm9kdWNlIGEgdmFsdWUnLFxuICAgICdiZWNhdXNlIHRoZSBydWxlIGl0IGlzJywgdGhpcy53aHksICdhbHNvIHByb2R1Y2VzIGEgdmFsdWUnXG4gIF0uam9pbignICcpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gYmluZGluZ3MgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gSW5jb25zaXN0ZW50IGJpbmRpbmdzXG5cbmV4cG9ydHMuSW5jb25zaXN0ZW50QmluZGluZ3NFcnJvciA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5leHBlY3RlZCA9IGV4cGVjdGVkO1xuICB0aGlzLmFjdHVhbCA9IGFjdHVhbDtcbn07XG5cbmV4cG9ydHMuSW5jb25zaXN0ZW50QmluZGluZ3NFcnJvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtcbiAgICAncnVsZScsIHRoaXMucnVsZU5hbWUsICdoYXMgaW5jb25zaXN0ZW50IGJpbmRpbmdzLicsXG4gICAgJ2V4cGVjdGVkOicsIHRoaXMuZXhwZWN0ZWQsXG4gICAgJ2dvdDonLCB0aGlzLmFjdHVhbFxuICBdLmpvaW4oJyAnKTtcbn07XG5cbi8vIER1cGxpY2F0ZSBiaW5kaW5nc1xuXG5leHBvcnRzLkR1cGxpY2F0ZUJpbmRpbmdzRXJyb3IgPSBmdW5jdGlvbihydWxlTmFtZSwgZHVwbGljYXRlcykge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuZHVwbGljYXRlcyA9IGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLkR1cGxpY2F0ZUJpbmRpbmdzRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbJ3J1bGUnLCB0aGlzLnJ1bGVOYW1lLCAnaGFzIGR1cGxpY2F0ZSBiaW5kaW5nczonLCB0aGlzLmR1cGxpY2F0ZXNdLmpvaW4oJyAnKTtcbn07XG5cbi8vIFVzZWxlc3MgYmluZGluZ3NcblxuZXhwb3J0cy5Vc2VsZXNzQmluZGluZ3NFcnJvciA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCB1c2VsZXNzKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy51c2VsZXNzID0gdXNlbGVzcztcbn07XG5cbmV4cG9ydHMuVXNlbGVzc0JpbmRpbmdzRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbJ3J1bGUnLCB0aGlzLnJ1bGVOYW1lLCAnaGFzIHVzZWxlc3MgYmluZGluZ3M6JywgdGhpcy51c2VsZXNzXS5qb2luKCcgJyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIER1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lc1xuXG5leHBvcnRzLkR1cGxpY2F0ZVByb3BlcnR5TmFtZXNFcnJvciA9IGZ1bmN0aW9uKGR1cGxpY2F0ZXMpIHtcbiAgdGhpcy5kdXBsaWNhdGVzID0gZHVwbGljYXRlcztcbn07XG5cbmV4cG9ydHMuRHVwbGljYXRlUHJvcGVydHlOYW1lc0Vycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gWydvYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOicsIHRoaXMuZHVwbGljYXRlc10uam9pbignICcpO1xufTtcblxuIiwiLypcblxuVE9ETzpcblxuKiBUaGluayBhYm91dCBpbXByb3ZpbmcgdGhlIGltcGxlbWVudGF0aW9uIG9mIHN5bnRhY3RpYyBydWxlcycgYXV0b21hdGljIHNwYWNlIHNraXBwaW5nOlxuICAtLSBDb3VsZCBrZWVwIHRyYWNrIG9mIHRoZSBjdXJyZW50IHJ1bGUgbmFtZSBieSBtb2RpZnlpbmcgdGhlIGNvZGUgKGluIEFwcGx5LmV2YWwpIHdoZXJlIGVudGVyIGFuZCBleGl0IG1ldGhvZHNcbiAgICAgYXJlIGNhbGxlZC4gKFdvdWxkIGFsc28gd2FudCB0byBrZWVwIHRyYWNrIG9mIHdoZXRoZXIgdGhlIHJ1bGUgaXMgc3ludGFjdGljIHRvIGF2b2lkIHJlLWRvaW5nIHRoYXQgd29ya1xuICAgICBhdCBlYWNoIGFwcGxpY2F0aW9uLilcblxuKiBDb25zaWRlciBib3Jyb3dpbmcgKHNvbWV0aGluZyBsaWtlKSB0aGUgdmFyaWFibGUtbm90LW90aGVyd2lzZS1tZW50aW9uZWQgaWRlYSBmcm9tIFJvYmJ5IEZpbmRsZXIncyByZWRleCwgYXMgYSB3YXlcbiAgdG8gbWFrZSBpdCBlYXNpZXIgZm9yIHByb2dyYW1tZXJzIHRvIGRlYWwgd2l0aCBrZXl3b3JkcyBhbmQgaWRlbnRpZmllcnMuXG5cbiogVGhpbmsgYWJvdXQgYSBiZXR0ZXIgd2F5IHRvIGRlYWwgd2l0aCBsaXN0c1xuICAtLSBCdWlsdC1pbiBsaXN0IG9wZXJhdG9yP1xuICAtLSBQYXJhbWV0ZXJpemVkIHJ1bGVzPyAoQnV0IHRoZXkncmUgbm90IHNvIGdyZWF0IGZvciByZWFkYWJpbGl0eSwgYW5kIGNvdWxkIGJlIHRyaWNreSBmb3Igc2VtYW50aWMgYWN0aW9uIGRpY3RzLilcblxuKiBJbXByb3ZlIHRlc3QgY292ZXJhZ2VcbiAgLS0gQWRkIHRlc3RzIGZvciBzY29waW5nLCBlLmcuLCBcImZvbzphIFtiYXI6YiBiYXo6Y106ZFwiIHNob3VsZCBoYXZlIDQgYmluZGluZ3MuXG4gICAgIChTYW1lIGtpbmQgb2YgdGhpbmcgZm9yIG5lc3RlZCBzdHJpbmcgYW5kIGxvb2thaGVhZCBleHByZXNzaW9ucywgdGhlaXIgYmluZGluZ3Mgc2hvdWxkIGxlYWsgdG8gdGhlIGVuY2xvc2luZyBzZXEuKVxuXG4qIFRoaW5rIGFib3V0IGZvcmVpZ24gcnVsZSBpbnZvY2F0aW9uXG4gIC0tIENhbid0IGp1c3QgYmUgZG9uZSBpbiB0aGUgc2FtZSB3YXkgYXMgaW4gT01ldGEgYi9jIG9mIHRoZSBhY3Rpb25EaWN0XG4gIC0tIFdpbGwgd2FudCB0byBwcmVzZXJ2ZSB0aGUgXCJubyB1bm5lY2Vzc2FyeSBzZW1hbnRpYyBhY3Rpb25zXCIgZ3VhcmFudGVlXG4gIC0tIFRoZSBzb2x1dGlvbiBtaWdodCBiZSB0byBlbmFibGUgdGhlIHByb2dyYW1tZXIgdG8gcHJvdmlkZSBtdWx0aXBsZSBhY3Rpb25EaWN0cyxcbiAgICAgYnV0IEknbGwgaGF2ZSB0byBjb21lIHVwIHdpdGggYSBjb252ZW5pZW50IHdheSB0byBhc3NvY2lhdGUgZWFjaCB3aXRoIGEgcGFydGljdWxhciBncmFtbWFyLlxuXG4qIFRoaW5rIGFib3V0IGluY3JlbWVudGFsIHBhcnNpbmcgKGdvb2QgZm9yIGVkaXRvcnMpXG4gIC0tIEJhc2ljIGlkZWE6IGtlZXAgdHJhY2sgb2YgbWF4IGluZGV4IHNlZW4gdG8gY29tcHV0ZSBhIHJlc3VsdFxuICAgICAoc3RvcmUgdGhpcyBpbiBtZW1vIHJlYyBhcyBhbiBpbnQgcmVsYXRpdmUgdG8gY3VyciBwb3MpXG4gIC0tIE9rIHRvIHJldXNlIG1lbW9pemVkIHZhbHVlIGFzIGxvbmcgYXMgcmFuZ2UgZnJvbSBjdXJyZW50IGluZGV4IHRvIG1heCBpbmRleCBoYXNuJ3QgY2hhbmdlZFxuICAtLSBDb3VsZCBiZSBhIGN1dGUgd29ya3Nob3AgcGFwZXIuLi5cblxuXG5TeW50YXggLyBsYW5ndWFnZSBpZGVhczpcblxuKiBTeW50YXggZm9yIHJ1bGUgZGVjbGFyYXRpb25zOlxuXG4gICAgZm9vID09IGJhciBiYXogICAgIChkZWZpbmUpXG4gICAgZm9vIDo9IGJhciBiYXogICAgIChvdmVycmlkZSAvIHJlcGxhY2UpXG4gICAgZm9vIDw9IGJhciBiYXogICAgIChleHRlbmQpXG5cbiogSW5saW5lIHJ1bGVzLCBlLmcuLFxuXG4gICAgYWRkRXhwciA9IGFkZEV4cHI6eCAnKycgbXVsRXhwcjp5IHtwbHVzfVxuICAgICAgICAgICAgfCBhZGRFeHByOnggJy0nIG11bEV4cHI6eSB7bWludXN9XG4gICAgICAgICAgICB8IG11bEV4cHJcblxuICBpcyBzeW50YWN0aWMgc3VnYXIgZm9yXG5cbiAgICBhZGRFeHByID0gcGx1cyB8IG1pbnVzIHwgbXVsRXhwcixcbiAgICBwbHVzID0gYWRkRXhwcjp4ICcrJyBtdWxFeHByOnksXG4gICAgbWludXMgPSBhZGRFeHByOnggJy0nIG11bEV4cHI6eVxuXG4qIEluIHRoaXMgZXhhbXBsZTpcblxuICAgIGZvbyA9IFwiYmFyXCJcbiAgICBiYXIgPSAnYWJjJ1xuXG4gIFRoZSBmb28gcnVsZSBzYXlzIGl0IHdhbnRzIHRoZSBiYXIgcnVsZSB0byBtYXRjaCB0aGUgY29udGVudHMgb2YgYSBzdHJpbmcgb2JqZWN0LiAoVGhlIFwicyBpcyBhIGtpbmQgb2YgcGFyZW50aGVzaXMuKVxuICBUaGVuIHlvdSBjb3VsZCBlaXRoZXIgc2F5XG5cbiAgICBtLm1hdGNoQWxsKCdhYmMnLCAnYmFyJylcblxuICBvclxuXG4gICAgbS5tYXRjaCgnYWJjJywgJ2ZvbycpXG5cbiAgQm90aCBzaG91bGQgc3VjY2VlZC5cblxuKiBBYm91dCBvYmplY3QgbWF0Y2hpbmdcblxuICBTb21lIGlzc3VlczpcbiAgLS0gU2hvdWxkIGRlZmluaXRlbHkgYWxsb3cgcGF0dGVybiBtYXRjaGluZyBvbiBlYWNoIHByb3BlcnR5J3MgdmFsdWUuIEJ1dCB3aGF0IGFib3V0IHByb3BlcnR5IG5hbWVzP1xuICAtLSBXaGF0IHRvIGRvIGFib3V0IHVuc3BlY2lmaWVkIHByb3BlcnRpZXM/XG4gIC0tIFN5bnRheDogSlNPTiB1c2VzIGNvbG9ucyB0byBzZXBhcmF0ZSBwcm9wZXJ0eSBuYW1lcyBhbmQgdmFsdWVzLiBXaWxsIGxvb2sgYmFkIHcvIGJpbmRpbmdzLCBlLmcuLFxuICAgICB7Zm9vOiBudW1iZXI6bn0gKGV3d3d3KVxuXG4gIEN1cnJlbnQgc3RyYXdtYW46XG4gIC0tIFJlcXVpcmUgcHJvcGVydHkgbmFtZXMgdG8gYmUgc3RyaW5nIGxpdGVyYWxzIChub3QgcGF0dGVybnMpLCBvbmx5IGFsbG93IHBhdHRlcm4gbWF0Y2hpbmcgb24gdGhlaXIgdmFsdWVzLlxuICAtLSBBbGxvdyBhbiBvcHRpb25hbCAnLi4uJyBhcyB0aGUgbGFzdCBwYXR0ZXJuLCB0aGF0IHdvdWxkIG1hdGNoIGFueSB1bnNwZWNpZmllZCBwcm9wZXJ0aWVzLlxuICAgICAgIHsnZm9vJzogbnVtYmVyLCAnYmFyJzogc3RyaW5nLCAnYmF6JzogNSwgLi4ufVxuICAgICBNaWdodCBldmVuIGFsbG93IHRoZSAuLi4gdG8gYmUgYm91bmQgdG8gYSB2YXJpYWJsZSB0aGF0IHdvdWxkIGNvbnRhaW4gYWxsIG9mIHRob3NlIHByb3BlcnRpZXMuXG4gIC0tIENvbnNpZGVyIGNoYW5naW5nIGJpbmRpbmcgc3ludGF4IGZyb20gZXhwcjpuYW1lIHRvIGV4cHIubmFtZVxuICAgICAoTW9yZSBKU09OLWZyaWVuZGx5LCBidXQgaXQgZG9lc24ndCB3b3JrIHdlbGwgd2l0aCAuLi4gc3ludGF4LiBCdXQgbWF5YmUgaXQncyBub3Qgc28gaW1wb3J0YW50IHRvIGJlIGFibGUgdG8gYmluZFxuICAgICB0aGUgcmVzdCBvZiB0aGUgcHJvcGVydGllcyBhbmQgdmFsdWVzIGFueXdheSwgc2luY2UgeW91IGNhbiBhbHdheXMgYmluZCB0aGUgZW50aXJlIG9iamVjdC4pXG5cblxuT3B0aW1pemF0aW9uIGlkZWFzOlxuXG4qIE9wdGltaXplICdiaW5kcycgLS0gc2hvdWxkIHByZS1hbGxvY2F0ZSBhbiBhcnJheSBvZiBiaW5kaW5ncyBpbnN0ZWFkIG9mIGRvaW5nIHB1c2hlcywgdGhyb3dpbmcgYXdheSBhcnJheXMgb24gZmFpbFxuICAoc2VlIEFsdCksIGV0Yy5cblxuKiBDb25zaWRlciBhZGRpbmcgYW4gYWRkaXRpb25hbCBjb2RlIGdlbmVyYXRpb24gc3RlcCB0aGF0IGdlbmVyYXRlcyBlZmZpY2llbnQgY29kZSBmcm9tIHRoZSBBU1RzLCBpbnN0ZWFkIG9mXG4gIGludGVycHJldGluZyB0aGVtIGRpcmVjdGx5LlxuXG4qIERvbid0IGJvdGhlciBjcmVhdGluZyB0aHVua3MgLyBsaXN0cyBvZiB0aHVua3Mgd2hlbiB2YWx1ZSBpcyBub3QgbmVlZGVkIChPTWV0YSBkaWQgdGhpcylcbiAgLS0gRS5nLiwgaW4gXCJmb28gPSBzcGFjZSogYmFyXCIgdGhlIHJlc3VsdCBvZiBzcGFjZSogaXMgbm90IG5lZWRlZCwgc28gZG9uJ3QgYm90aGVyIGNyZWF0aW5nIGEgbGlzdCBvZiB0aHVua3MgLyB2YWx1ZXNcbiAgLS0gQ291bGQganVzdCByZXR1cm4gdW5kZWZpbmVkIChhbnl0aGluZyBleGNlcHQgZmFpbClcblxuKiBHZXQgcmlkIG9mIHVubmVjZXNzYXJ5IFNlcXMgYW5kIEFsdHMgKE9NZXRhIGRpZCB0aGlzIHRvbylcblxuKi9cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXIuanMnKTtcblxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXIuanMnKTtcbnZhciBOYW1lc3BhY2UgPSByZXF1aXJlKCcuL05hbWVzcGFjZS5qcycpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzLmpzJyk7XG5cbnZhciBhd2xpYiA9IHJlcXVpcmUoJ2F3bGliJyk7XG52YXIgdW5lc2NhcGVDaGFyID0gYXdsaWIuc3RyaW5nVXRpbHMudW5lc2NhcGVDaGFyO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyO1xuXG52YXIgdGhpc01vZHVsZSA9IGV4cG9ydHM7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hckFjdGlvbkRpY3Qob3B0TmFtZXNwYWNlKSB7XG4gIHZhciBidWlsZGVyO1xuICByZXR1cm4ge1xuICAgIHNwYWNlOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHt9LFxuICAgIHNwYWNlX211bHRpTGluZTogICAgICAgICAgICBmdW5jdGlvbigpICAgIHt9LFxuICAgIHNwYWNlX3NpbmdsZUxpbmU6ICAgICAgICAgICBmdW5jdGlvbigpICAgIHt9LFxuXG4gICAgX25hbWU6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50czsgfSxcbiAgICBuYW1lRmlyc3Q6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcbiAgICBuYW1lUmVzdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7fSxcblxuICAgIG5hbWU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi5uOyB9LFxuXG4gICAgbmFtZWRDb25zdDogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIG5hbWVkQ29uc3RfdW5kZWZpbmVkOiAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcbiAgICBuYW1lZENvbnN0X251bGw6ICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBudWxsOyB9LFxuICAgIG5hbWVkQ29uc3RfdHJ1ZTogICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHRydWU7IH0sXG4gICAgbmFtZWRDb25zdF9mYWxzZTogICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gZmFsc2U7IH0sXG5cbiAgICBzdHJpbmc6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudi5jcy5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gdW5lc2NhcGVDaGFyKGMpOyB9KS5qb2luKCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBzQ2hhcjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzOyB9LFxuICAgIHJlZ2V4cDogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIG5ldyBSZWdFeHAoZW52LmUpOyB9LFxuICAgIHJlQ2hhckNsYXNzOiAgICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7IH0sXG4gICAgbnVtYmVyOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gcGFyc2VJbnQodGhpcy5pbnRlcnZhbC5jb250ZW50cyk7IH0sXG5cbiAgICBBbHQ6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgQWx0X3JlYzogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5hbHQoZW52LngsIGVudi55KTsgfSxcblxuICAgIFRlcm06ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBUZXJtX2lubGluZTogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmlubGluZShidWlsZGVyLmN1cnJlbnRSdWxlTmFtZSArICdfJyArIGVudi5uLCBlbnYueCk7IH0sXG5cbiAgICBTZXE6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCBlbnYudmFsdWUpOyB9LFxuXG4gICAgRmFjdG9yOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIEZhY3Rvcl9iaW5kOiAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuYmluZChlbnYueCwgZW52Lm4pOyB9LFxuXG4gICAgSXRlcjogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIEl0ZXJfc3RhcjogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubWFueShlbnYueCwgMCk7IH0sXG4gICAgSXRlcl9wbHVzOiAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5tYW55KGVudi54LCAxKTsgfSxcbiAgICBJdGVyX29wdDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9wdChlbnYueCk7IH0sXG5cbiAgICBQcmVkOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgUHJlZF9ub3Q6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5ub3QoZW52LngpOyB9LFxuICAgIFByZWRfbG9va2FoZWFkOiAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubGEoZW52LngpOyB9LFxuXG4gICAgQmFzZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52LnZhbHVlOyB9LFxuICAgIEJhc2VfdW5kZWZpbmVkOiAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIGJ1aWxkZXIuXyh1bmRlZmluZWQpOyB9LFxuICAgIEJhc2VfbnVsbDogICAgICAgICAgICAgICAgICBmdW5jdGlvbigpICAgIHsgcmV0dXJuIGJ1aWxkZXIuXyhudWxsKTsgfSxcbiAgICBCYXNlX3RydWU6ICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oKSAgICB7IHJldHVybiBidWlsZGVyLl8odHJ1ZSk7IH0sXG4gICAgQmFzZV9mYWxzZTogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKCkgICAgeyByZXR1cm4gYnVpbGRlci5fKGZhbHNlKTsgfSxcbiAgICBCYXNlX2FwcGxpY2F0aW9uOiAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLmFwcChlbnYucnVsZU5hbWUpOyB9LFxuICAgIEJhc2VfcHJpbTogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIuXyhlbnYudmFsdWUpOyB9LFxuICAgIEJhc2VfbHN0OiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGJ1aWxkZXIubHN0KGVudi54KTsgfSxcbiAgICBCYXNlX3N0cjogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLnN0cihlbnYueCk7IH0sXG4gICAgQmFzZV9wYXJlbjogICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gZW52Lng7IH0sXG4gICAgQmFzZV9vYmo6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4gYnVpbGRlci5vYmooW10sIGVudi5sZW5pZW50KTsgfSxcbiAgICBCYXNlX29ialdpdGhQcm9wczogICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBidWlsZGVyLm9iaihlbnYucHMsIGVudi5sZW5pZW50KTsgfSxcblxuICAgIFByb3BzOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfSxcbiAgICBQcm9wc19iYXNlOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBbZW52LnBdOyB9LFxuICAgIFByb3BzX3JlYzogICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIFtlbnYucF0uY29uY2F0KGVudi5wcyk7IH0sXG4gICAgUHJvcDogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikgeyByZXR1cm4ge25hbWU6IGVudi5uLCBwYXR0ZXJuOiBlbnYucH07IH0sXG5cbiAgICBSdWxlOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiBlbnYudmFsdWU7IH0sXG4gICAgUnVsZV9kZWZpbmU6ICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuZGVmaW5lKGVudi5uLCBlbnYuYik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgUnVsZV9vdmVycmlkZTogICAgICAgICAgICAgIGZ1bmN0aW9uKGVudikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuY3VycmVudFJ1bGVOYW1lID0gZW52Lm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIub3ZlcnJpZGUoZW52Lm4sIGVudi5iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICBSdWxlX2V4dGVuZDogICAgICAgICAgICAgICAgZnVuY3Rpb24oZW52KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5jdXJyZW50UnVsZU5hbWUgPSBlbnYubjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5leHRlbmQoZW52Lm4sIGVudi5iKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgIFN1cGVyR3JhbW1hcjogICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgYnVpbGRlci5zZXRTdXBlckdyYW1tYXIoZW52LnZhbHVlKTsgfSxcbiAgICBTdXBlckdyYW1tYXJfcXVhbGlmaWVkOiAgICAgZnVuY3Rpb24oZW52KSB7IHJldHVybiB0aGlzTW9kdWxlLm5hbWVzcGFjZShlbnYubnMpLmdldEdyYW1tYXIoZW52Lm4pOyB9LFxuICAgIFN1cGVyR3JhbW1hcl91bnF1YWxpZmllZDogICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0TmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0TmFtZXNwYWNlLmdldEdyYW1tYXIoZW52Lm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgZXJyb3JzLlVuZGVjbGFyZWRHcmFtbWFyRXJyb3IoZW52Lm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgIEdyYW1tYXI6ICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLnNldE5hbWUoZW52Lm4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5zOyAgLy8gZm9yY2UgZXZhbHVhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudi5yczsgIC8vIGZvcmNlIGV2YWx1YXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVpbGRlci5idWlsZChvcHROYW1lc3BhY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgIEdyYW1tYXJzOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihlbnYpIHsgcmV0dXJuIGVudi52YWx1ZTsgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIHdoYXRJdElzLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIHRodW5rID0gdGhpc01vZHVsZS5fb2htR3JhbW1hci5tYXRjaENvbnRlbnRzKHNvdXJjZSwgd2hhdEl0SXMpO1xuICBpZiAodGh1bmspIHtcbiAgICByZXR1cm4gdGh1bmsobWFrZUdyYW1tYXJBY3Rpb25EaWN0KG9wdE5hbWVzcGFjZSkpO1xuICB9IGVsc2Uge1xuICAgIC8vIFRPRE86IGltcHJvdmUgZXJyb3IgbWVzc2FnZSAoc2hvdyB3aGF0IHBhcnQgb2YgdGhlIGlucHV0IGlzIHdyb25nLCB3aGF0IHdhcyBleHBlY3RlZCwgZXRjLilcbiAgICBicm93c2VyLmVycm9yKCdpbnZhbGlkIGlucHV0IGluOicsIHNvdXJjZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFrZUdyYW1tYXIoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXInLCBvcHROYW1lc3BhY2UpO1xufVxuXG5mdW5jdGlvbiBtYWtlR3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgcmV0dXJuIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgJ0dyYW1tYXJzJywgb3B0TmFtZXNwYWNlKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcblxudmFyIG5hbWVzcGFjZXMgPSB7fTtcbmV4cG9ydHMubmFtZXNwYWNlID0gZnVuY3Rpb24obmFtZSkge1xuICBpZiAobmFtZXNwYWNlc1tuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbmFtZXNwYWNlc1tuYW1lXSA9IG5ldyBOYW1lc3BhY2UobmFtZSk7XG4gIH1cbiAgcmV0dXJuIG5hbWVzcGFjZXNbbmFtZV07XG59O1xuXG5leHBvcnRzLm1ha2UgPSBmdW5jdGlvbihyZWNpcGUpIHtcbiAgcmV0dXJuIHJlY2lwZSh0aGlzTW9kdWxlKTtcbn07XG5cbmV4cG9ydHMubWFrZUdyYW1tYXIgPSBtYWtlR3JhbW1hcjtcbmV4cG9ydHMubWFrZUdyYW1tYXJzID0gbWFrZUdyYW1tYXJzO1xuXG4vLyBTdHVmZiB0aGF0J3Mgb25seSBoZXJlIGZvciBib290c3RyYXBwaW5nLCB0ZXN0aW5nLCBldGMuXG5cbmV4cG9ydHMuX2J1aWxkZXIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBCdWlsZGVyKCk7XG59O1xuXG5leHBvcnRzLl9tYWtlR3JhbW1hckFjdGlvbkRpY3QgPSBtYWtlR3JhbW1hckFjdGlvbkRpY3Q7XG5cbnZhciBvaG1HcmFtbWFyO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfb2htR3JhbW1hcicsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW9obUdyYW1tYXIpIHtcbiAgICAgIG9obUdyYW1tYXIgPSB0aGlzLl9vaG1HcmFtbWFyRmFjdG9yeSh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIG9obUdyYW1tYXI7XG4gIH1cbn0pO1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHZhciBhbnMgPSBmYWxzZTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2lkeF07XG4gICAgYW5zIHw9IHRlcm0uYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpO1xuICB9XG4gIHJldHVybiBhbnM7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHZhciBhbnMgPSBmYWxzZTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgYW5zIHw9IGZhY3Rvci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgZmFsc2UpO1xuICB9XG4gIHJldHVybiBhbnM7XG59O1xuXG5wZXhwcnMuQmluZC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB0cnVlKTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24gPSBmdW5jdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgZmFsc2UpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCB2YWx1ZVJlcXVpcmVkKTtcbn07XG5cbnBleHBycy5TdHIucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgZmFsc2UpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5hZGRSdWxlc1RoYXROZWVkU2VtYW50aWNBY3Rpb24oZGljdCwgZmFsc2UpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uID0gZnVuY3Rpb24oZGljdCwgdmFsdWVSZXF1aXJlZCkge1xuICByZXR1cm4gdGhpcy5leHByLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbihkaWN0LCBmYWxzZSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFkZFJ1bGVzVGhhdE5lZWRTZW1hbnRpY0FjdGlvbiA9IGZ1bmN0aW9uKGRpY3QsIHZhbHVlUmVxdWlyZWQpIHtcbiAgaWYgKCF2YWx1ZVJlcXVpcmVkIHx8IGRpY3RbdGhpcy5ydWxlTmFtZV0pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGRpY3RbdGhpcy5ydWxlTmFtZV0gPSB0cnVlO1xuICB9XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGVxdWFscyA9IGF3bGliLmVxdWFscy5lcXVhbHM7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge307XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIG5hbWVzID0gdGhpcy50ZXJtc1swXS5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2lkeF07XG4gICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncygpO1xuICAgIHZhciBvdGhlck5hbWVzID0gdGVybS5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgICBpZiAoIWVxdWFscyhuYW1lcywgb3RoZXJOYW1lcykpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuSW5jb25zaXN0ZW50QmluZGluZ3NFcnJvcihydWxlTmFtZSwgbmFtZXMsIG90aGVyTmFtZXMpO1xuICAgIH1cbiAgfVxufTtcblxucGV4cHJzLkV4dGVuZEFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBPbmx5IGhhcyB0d28gdGVybXMsIHRoZSBzZWNvbmQgb2Ygd2hpY2ggaGFzIHRoZSBleHBlY3RlZCBiaW5kaW5ncy5cbiAgdmFyIG5hbWVzID0gdGhpcy50ZXJtc1sxXS5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgdmFyIG90aGVyTmFtZXMgPSB0aGlzLnRlcm1zWzBdLmdldEJpbmRpbmdOYW1lcygpO1xuICBpZiAoIWVxdWFscyhuYW1lcywgb3RoZXJOYW1lcykpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkluY29uc2lzdGVudEJpbmRpbmdzRXJyb3IocnVsZU5hbWUsIG5hbWVzLCBvdGhlck5hbWVzKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1CaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHt9O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge307XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG5cbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlQmluZGluZ3NFcnJvcihydWxlTmFtZSwgZHVwbGljYXRlcyk7XG4gIH1cbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk1hbnkucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuU3RyLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydE5vRHVwbGljYXRlQmluZGluZ3MocnVsZU5hbWUpO1xuICB9XG5cbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyh0aGlzLmdldEJpbmRpbmdOYW1lcygpKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRHVwbGljYXRlQmluZGluZ3NFcnJvcihydWxlTmFtZSwgZHVwbGljYXRlcyk7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Tm9EdXBsaWNhdGVCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7fTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbi5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGFzc2VydE5vQmluZGluZ3MocnVsZU5hbWUsIGV4cHIpIHtcbiAgdmFyIGJpbmRpbmdzID0gZXhwci5nZXRCaW5kaW5nTmFtZXMoKTtcbiAgaWYgKGJpbmRpbmdzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLlVzZWxlc3NCaW5kaW5nc0Vycm9yKHJ1bGVOYW1lLCBiaW5kaW5ncyk7XG4gIH1cbn1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5CaW5kLnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyhydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICBhc3NlcnROb0JpbmRpbmdzKHJ1bGVOYW1lLCB0aGlzLmV4cHIpO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICBhc3NlcnROb0JpbmRpbmdzKHJ1bGVOYW1lLCB0aGlzLmV4cHIpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xuICBhc3NlcnROb0JpbmRpbmdzKHJ1bGVOYW1lLCB0aGlzLmV4cHIpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Tm9Vc2VsZXNzQmluZGluZ3MocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydE5vVXNlbGVzc0JpbmRpbmdzKHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnROb1VzZWxlc3NCaW5kaW5ncyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uLmpzJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMuanMnKTtcbnZhciB0aHVua3MgPSByZXF1aXJlKCcuL3RodW5rcy5qcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG52YXIgc2tpcFNwYWNlcyA9IHJlcXVpcmUoJy4vc2tpcFNwYWNlcy5qcycpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbS5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55dGhpbmcuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKSB7XG4gICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICB9XG4gIHZhciB2YWx1ZSA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKHZhbHVlID09PSBjb21tb24uZmFpbCkge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IHRodW5rcy5WYWx1ZVRodW5rKHZhbHVlKTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICBpZiAodGhpcy5tYXRjaChpbnB1dFN0cmVhbSkgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgdGh1bmtzLlZhbHVlVGh1bmsodGhpcy5vYmopO1xuICB9XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hFeGFjdGx5KHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5TdHJpbmdQcmltLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gIHJldHVybiBpbnB1dFN0cmVhbS5tYXRjaFN0cmluZyh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmVnRXhwUHJpbS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICBpZiAoc3ludGFjdGljKSB7XG4gICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICB9XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAoaW5wdXRTdHJlYW0ubWF0Y2hSZWdFeHAodGhpcy5vYmopID09PSBjb21tb24uZmFpbCkge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IHRodW5rcy5WYWx1ZVRodW5rKGlucHV0U3RyZWFtLnNvdXJjZVtvcmlnUG9zXSk7XG4gIH1cbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBvcmlnTnVtQmluZGluZ3MgPSBiaW5kaW5ncy5sZW5ndGg7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChzeW50YWN0aWMpIHtcbiAgICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgICB9XG4gICAgdmFyIHZhbHVlID0gdGhpcy50ZXJtc1tpZHhdLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICAvLyBOb3RlOiB3aGlsZSB0aGUgZm9sbG93aW5nIGFzc2lnbm1lbnQgY291bGQgYmUgZG9uZSB1bmNvbmRpdGlvbmFsbHksIG9ubHkgZG9pbmcgaXQgd2hlbiBuZWNlc3NhcnkgaXNcbiAgICAgIC8vIGJldHRlciBmb3IgcGVyZm9ybWFuY2UuIFRoaXMgaXMgYi9jIGFzc2lnbmluZyB0byBhbiBhcnJheSdzIGxlbmd0aCBwcm9wZXJ0eSBpcyBtb3JlIGV4cGVuc2l2ZSB0aGFuIGFcbiAgICAgIC8vIHR5cGljYWwgYXNzaWdubWVudC5cbiAgICAgIGlmIChiaW5kaW5ncy5sZW5ndGggPiBvcmlnTnVtQmluZGluZ3MpIHtcbiAgICAgICAgYmluZGluZ3MubGVuZ3RoID0gb3JpZ051bUJpbmRpbmdzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gY29tbW9uLmZhaWw7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKHN5bnRhY3RpYykge1xuICAgICAgc2tpcFNwYWNlcyhydWxlRGljdCwgaW5wdXRTdHJlYW0pO1xuICAgIH1cbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgdmFyIHZhbHVlID0gZmFjdG9yLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKTtcbiAgICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aHVua3MudmFsdWVsZXNzVGh1bms7XG59O1xuXG5wZXhwcnMuQmluZC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICBpZiAodmFsdWUgIT09IGNvbW1vbi5mYWlsKSB7XG4gICAgYmluZGluZ3MucHVzaCh0aGlzLm5hbWUsIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59O1xuXG5wZXhwcnMuTWFueS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgbWF0Y2hlcyA9IFtdO1xuICB3aGlsZSAodHJ1ZSkge1xuICAgIHZhciBiYWNrdHJhY2tQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKTtcbiAgICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBiYWNrdHJhY2tQb3M7XG4gICAgICBicmVhaztcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0Y2hlcy5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXMubGVuZ3RoIDwgdGhpcy5taW5OdW1NYXRjaGVzID8gIGNvbW1vbi5mYWlsIDogbmV3IHRodW5rcy5MaXN0VGh1bmsobWF0Y2hlcyk7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIGJpbmRpbmdzKSB7XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgW10pO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByZXR1cm4gdGh1bmtzLnZhbHVlbGVzc1RodW5rO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgdGh1bmtzLkxpc3RUaHVuayhbdmFsdWVdKTtcbiAgfVxufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIFtdKTtcbiAgaWYgKHZhbHVlICE9PSBjb21tb24uZmFpbCkge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0aHVua3MudmFsdWVsZXNzVGh1bms7XG4gIH1cbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciB2YWx1ZSA9IHRoaXMuZXhwci5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBbXSk7XG4gIGlmICh2YWx1ZSAhPT0gY29tbW9uLmZhaWwpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH1cbn07XG5cbnBleHBycy5TdHIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgc3RyaW5nID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcbiAgICB2YXIgc3RyaW5nSW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3Ioc3RyaW5nKTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV4cHIuZXZhbChzeW50YWN0aWMsIHJ1bGVEaWN0LCBzdHJpbmdJbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICAgIHJldHVybiB2YWx1ZSAhPT0gY29tbW9uLmZhaWwgJiYgc3RyaW5nSW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgdGh1bmtzLlZhbHVlVGh1bmsoc3RyaW5nKSA6IGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgfVxufTtcblxucGV4cHJzLkxpc3QucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgbGlzdCA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKGxpc3QgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgIHZhciBsaXN0SW5wdXRTdHJlYW0gPSBJbnB1dFN0cmVhbS5uZXdGb3IobGlzdCk7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5leHByLmV2YWwoc3ludGFjdGljLCBydWxlRGljdCwgbGlzdElucHV0U3RyZWFtLCBiaW5kaW5ncyk7XG4gICAgcmV0dXJuIHZhbHVlICE9PSBjb21tb24uZmFpbCAmJiBsaXN0SW5wdXRTdHJlYW0uYXRFbmQoKSA/ICBuZXcgdGh1bmtzLlZhbHVlVGh1bmsobGlzdCkgOiBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH1cbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzeW50YWN0aWMsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpIHtcbiAgaWYgKHN5bnRhY3RpYykge1xuICAgIHNraXBTcGFjZXMocnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgfVxuICB2YXIgb2JqID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAob2JqICE9PSBjb21tb24uZmFpbCAmJiBvYmogJiYgKHR5cGVvZiBvYmogPT09ICdvYmplY3QnIHx8IHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbicpKSB7XG4gICAgdmFyIG51bU93blByb3BlcnRpZXNNYXRjaGVkID0gMDtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5wcm9wZXJ0aWVzW2lkeF07XG4gICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XG4gICAgICB2YXIgdmFsdWVJbnB1dFN0cmVhbSA9IElucHV0U3RyZWFtLm5ld0ZvcihbdmFsdWVdKTtcbiAgICAgIHZhciBtYXRjaGVkID0gcHJvcGVydHkucGF0dGVybi5ldmFsKHN5bnRhY3RpYywgcnVsZURpY3QsIHZhbHVlSW5wdXRTdHJlYW0sIGJpbmRpbmdzKSAhPT0gY29tbW9uLmZhaWwgJiZcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVJbnB1dFN0cmVhbS5hdEVuZCgpO1xuICAgICAgaWYgKCFtYXRjaGVkKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICAgIH1cbiAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocHJvcGVydHkubmFtZSkpIHtcbiAgICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrKztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaXNMZW5pZW50IHx8IG51bU93blByb3BlcnRpZXNNYXRjaGVkID09PSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA/XG4gICAgICBuZXcgdGh1bmtzLlZhbHVlVGh1bmsob2JqKSA6XG4gICAgICBjb21tb24uZmFpbDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN5bnRhY3RpYywgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBiaW5kaW5ncykge1xuICB2YXIgcnVsZU5hbWUgPSB0aGlzLnJ1bGVOYW1lO1xuICB2YXIgb3JpZ1Bvc0luZm8gPSBpbnB1dFN0cmVhbS5nZXRDdXJyZW50UG9zSW5mbygpO1xuICB2YXIgbWVtb1JlYyA9IG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdO1xuICBpZiAobWVtb1JlYyAmJiBvcmlnUG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG1lbW9SZWMucG9zO1xuICAgIHJldHVybiBtZW1vUmVjLnZhbHVlO1xuICB9IGVsc2UgaWYgKG9yaWdQb3NJbmZvLmlzQWN0aXZlKHJ1bGVOYW1lKSkge1xuICAgIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5nZXRDdXJyZW50TGVmdFJlY3Vyc2lvbigpO1xuICAgIGlmIChjdXJyZW50TFIgJiYgY3VycmVudExSLm5hbWUgPT09IHJ1bGVOYW1lKSB7XG4gICAgICBvcmlnUG9zSW5mby51cGRhdGVJbnZvbHZlZFJ1bGVzKCk7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TFIucG9zO1xuICAgICAgcmV0dXJuIGN1cnJlbnRMUi52YWx1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKTtcbiAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIGJvZHkgPSBydWxlRGljdFtydWxlTmFtZV1cbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRocm93IG5ldyBlcnJvcnMuVW5kZWNsYXJlZFJ1bGVFcnJvcihydWxlTmFtZSk7XG4gICAgfVxuICAgIG9yaWdQb3NJbmZvLmVudGVyKHJ1bGVOYW1lKTtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSk7XG4gICAgdmFyIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmdldEN1cnJlbnRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgaWYgKGN1cnJlbnRMUikge1xuICAgICAgaWYgKGN1cnJlbnRMUi5uYW1lID09PSBydWxlTmFtZSkge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuaGFuZGxlTGVmdFJlY3Vyc2lvbihib2R5LCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIG9yaWdQb3NJbmZvLnBvcywgY3VycmVudExSLCB2YWx1ZSk7XG4gICAgICAgIG9yaWdQb3NJbmZvLm1lbW9bcnVsZU5hbWVdID1cbiAgICAgICAgICB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZSwgaW52b2x2ZWRSdWxlczogY3VycmVudExSLmludm9sdmVkUnVsZXN9O1xuICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKHJ1bGVOYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoIWN1cnJlbnRMUi5pbnZvbHZlZFJ1bGVzW3J1bGVOYW1lXSkge1xuICAgICAgICAvLyBPbmx5IG1lbW9pemUgaWYgdGhpcyBydWxlIGlzIG5vdCBpbnZvbHZlZCBpbiB0aGUgY3VycmVudCBsZWZ0IHJlY3Vyc2lvblxuICAgICAgICBvcmlnUG9zSW5mby5tZW1vW3J1bGVOYW1lXSA9IHtwb3M6IGlucHV0U3RyZWFtLnBvcywgdmFsdWU6IHZhbHVlfTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgb3JpZ1Bvc0luZm8ubWVtb1tydWxlTmFtZV0gPSB7cG9zOiBpbnB1dFN0cmVhbS5wb3MsIHZhbHVlOiB2YWx1ZX07XG4gICAgfVxuICAgIG9yaWdQb3NJbmZvLmV4aXQocnVsZU5hbWUpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ldmFsT25jZSA9IGZ1bmN0aW9uKGV4cHIsIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSkge1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGJpbmRpbmdzID0gW107XG4gIHZhciB2YWx1ZSA9IGV4cHIuZXZhbChjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSksIHJ1bGVEaWN0LCBpbnB1dFN0cmVhbSwgYmluZGluZ3MpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgcmV0dXJuIGNvbW1vbi5mYWlsO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgdGh1bmtzLlJ1bGVUaHVuayh0aGlzLnJ1bGVOYW1lLCBpbnB1dFN0cmVhbS5zb3VyY2UsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdmFsdWUsIGJpbmRpbmdzKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5oYW5kbGVMZWZ0UmVjdXJzaW9uID0gZnVuY3Rpb24oYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtLCBvcmlnUG9zLCBjdXJyZW50TFIsIHNlZWRWYWx1ZSkge1xuICB2YXIgdmFsdWUgPSBzZWVkVmFsdWU7XG4gIGlmIChzZWVkVmFsdWUgIT09IGNvbW1vbi5mYWlsKSB7XG4gICAgY3VycmVudExSLnZhbHVlID0gc2VlZFZhbHVlO1xuICAgIGN1cnJlbnRMUi5wb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgcnVsZURpY3QsIGlucHV0U3RyZWFtKTtcbiAgICAgIGlmICh2YWx1ZSAhPT0gY29tbW9uLmZhaWwgJiYgaW5wdXRTdHJlYW0ucG9zID4gY3VycmVudExSLnBvcykge1xuICAgICAgICBjdXJyZW50TFIudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgY3VycmVudExSLnBvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gY3VycmVudExSLnZhbHVlO1xuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBjdXJyZW50TFIucG9zO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufTtcblxuIiwiLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIFtdO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIC8vIFRoaXMgaXMgb2sgYi9jIGFsbCB0ZXJtcyBtdXN0IGhhdmUgdGhlIHNhbWUgYmluZGluZ3MgLS0gdGhpcyBwcm9wZXJ0eSBpcyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyBbXSA6IHRoaXMudGVybXNbMF0uZ2V0QmluZGluZ05hbWVzKCk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5hbWVzID0gW107XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5mYWN0b3JzW2lkeF0uZ2V0QmluZGluZ05hbWVzKCkpO1xuICB9XG4gIHJldHVybiBuYW1lcy5zb3J0KCk7XG59O1xuXG5wZXhwcnMuQmluZC5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBbdGhpcy5uYW1lXTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmdldEJpbmRpbmdOYW1lcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEJpbmRpbmdOYW1lcygpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKCk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUuZ2V0QmluZGluZ05hbWVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QmluZGluZ05hbWVzKCk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5nZXRCaW5kaW5nTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5hbWVzID0gW107XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgbmFtZXMgPSBuYW1lcy5jb25jYXQodGhpcy5wcm9wZXJ0aWVzW2lkeF0ucGF0dGVybi5nZXRCaW5kaW5nTmFtZXMoKSk7XG4gIH1cbiAgcmV0dXJuIG5hbWVzLnNvcnQoKTtcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIHByaW50U3RyaW5nID0gYXdsaWIuc3RyaW5nVXRpbHMucHJpbnRTdHJpbmc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueXRoaW5nLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5fKCcpO1xuICB3cy5uZXh0UHV0QWxsKHByaW50U3RyaW5nKHRoaXMub2JqKSk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IuYWx0KCcpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgd3MubmV4dFB1dEFsbCgnLCAnKTtcbiAgICB9XG4gICAgdGhpcy50ZXJtc1tpZHhdLm91dHB1dFJlY2lwZSh3cyk7XG4gIH1cbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5zZXEoJyk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJywgJyk7XG4gICAgfVxuICAgIHRoaXMuZmFjdG9yc1tpZHhdLm91dHB1dFJlY2lwZSh3cyk7XG4gIH1cbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLkJpbmQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2IuYmluZCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZSh3cyk7XG4gIHdzLm5leHRQdXRBbGwoJywgJyk7XG4gIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5uYW1lKSk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5NYW55LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLm1hbnkoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcsICcpO1xuICB3cy5uZXh0UHV0QWxsKHRoaXMubWluTnVtTWF0Y2hlcyk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHdzKSB7XG4gIHdzLm5leHRQdXRBbGwoJ2Iub3B0KCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5ub3QoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICB3cy5uZXh0UHV0QWxsKCdiLmxhKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHdzKTtcbiAgd3MubmV4dFB1dEFsbCgnKScpO1xufTtcblxucGV4cHJzLlN0ci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5zdHIoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuTGlzdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5sc3QoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUod3MpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbih3cykge1xuICBmdW5jdGlvbiBvdXRwdXRQcm9wZXJ0eVJlY2lwZShwcm9wKSB7XG4gICAgd3MubmV4dFB1dEFsbCgne25hbWU6ICcpO1xuICAgIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcocHJvcC5uYW1lKSk7XG4gICAgd3MubmV4dFB1dEFsbCgnLCBwYXR0ZXJuOiAnKTtcbiAgICBwcm9wLnBhdHRlcm4ub3V0cHV0UmVjaXBlKHdzKTtcbiAgICB3cy5uZXh0UHV0QWxsKCd9Jyk7XG4gIH1cblxuICB3cy5uZXh0UHV0QWxsKCdiLm9iaihbJyk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHdzLm5leHRQdXRBbGwoJywgJyk7XG4gICAgfVxuICAgIG91dHB1dFByb3BlcnR5UmVjaXBlKHRoaXMucHJvcGVydGllc1tpZHhdKTtcbiAgfVxuICB3cy5uZXh0UHV0QWxsKCddLCAnKTtcbiAgd3MubmV4dFB1dEFsbChwcmludFN0cmluZyghIXRoaXMuaXNMZW5pZW50KSk7XG4gIHdzLm5leHRQdXRBbGwoJyknKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24od3MpIHtcbiAgd3MubmV4dFB1dEFsbCgnYi5hcHAoJyk7XG4gIHdzLm5leHRQdXRBbGwocHJpbnRTdHJpbmcodGhpcy5ydWxlTmFtZSkpO1xuICB3cy5uZXh0UHV0QWxsKCcpJyk7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzLmpzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnByb2R1Y2VzVmFsdWUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmICghdGhpcy50ZXJtc1tpZHhdLnByb2R1Y2VzVmFsdWUoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxucGV4cHJzLlNlcS5wcm90b3R5cGUucHJvZHVjZXNWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5wcm9kdWNlc1ZhbHVlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24uanMnKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycy5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIG9iamVjdFRoYXREZWxlZ2F0ZXNUbyA9IGF3bGliLm9iamVjdFV0aWxzLm9iamVjdFRoYXREZWxlZ2F0ZXNUbztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdlbmVyYWwgc3R1ZmZcblxuZnVuY3Rpb24gUEV4cHIoKSB7XG4gIHRocm93ICdQRXhwciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCc7XG59XG5cbi8vIEFueXRoaW5nXG5cbnZhciBhbnl0aGluZyA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBQcmltaXRpdmVzXG5cbmZ1bmN0aW9uIFByaW0ob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuXG5QcmltLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBTdHJpbmdQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9iajtcbn1cblxuU3RyaW5nUHJpbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBSZWdFeHBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9iajtcbn1cblxuUmVnRXhwUHJpbS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUHJpbS5wcm90b3R5cGUpO1xuXG4vLyBBbHRlcm5hdGlvblxuXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgdGhpcy50ZXJtcyA9IHRlcm1zO1xufVxuXG5BbHQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEV4dGVuZEFsdCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cblxuZnVuY3Rpb24gRXh0ZW5kQWx0KGV4dGVuc2lvbnMsIGJhc2UpIHtcbiAgdGhpcy50ZXJtcyA9IFtleHRlbnNpb25zLCBiYXNlXTtcbn1cblxuRXh0ZW5kQWx0LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhBbHQucHJvdG90eXBlKTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5cblNlcS5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gQmluZGluZ3NcblxuZnVuY3Rpb24gQmluZChleHByLCBuYW1lKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG59XG5cbkJpbmQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5cbmZ1bmN0aW9uIE1hbnkoZXhwciwgbWluTnVtTWF0Y2hlcykge1xuICB0aGlzLmV4cHIgPSBleHByO1xuICB0aGlzLm1pbk51bU1hdGNoZXMgPSBtaW5OdW1NYXRjaGVzO1xufVxuXG5NYW55LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5PcHQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFByZWRpY2F0ZXNcblxuZnVuY3Rpb24gTm90KGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cblxuTm90LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG5mdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5Mb29rYWhlYWQucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5cblN0ci5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gTGlzdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIExpc3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuXG5MaXN0LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBPYmplY3QgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBPYmoocHJvcGVydGllcywgaXNMZW5pZW50KSB7XG4gIHZhciBuYW1lcyA9IHByb3BlcnRpZXMubWFwKGZ1bmN0aW9uKHByb3BlcnR5KSB7IHJldHVybiBwcm9wZXJ0eS5uYW1lOyB9KTtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhuYW1lcyk7XG4gIGlmIChkdXBsaWNhdGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkR1cGxpY2F0ZVByb3BlcnR5TmFtZXNFcnJvcihkdXBsaWNhdGVzKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSBwcm9wZXJ0aWVzO1xuICAgIHRoaXMuaXNMZW5pZW50ID0gaXNMZW5pZW50O1xuICB9XG59XG5cbk9iai5wcm90b3R5cGUgPSBvYmplY3RUaGF0RGVsZWdhdGVzVG8oUEV4cHIucHJvdG90eXBlKTtcblxuLy8gUnVsZSBhcHBsaWNhdGlvblxuXG5mdW5jdGlvbiBBcHBseShydWxlTmFtZSkge1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG59XG5cbkFwcGx5LnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhQRXhwci5wcm90b3R5cGUpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5tYWtlUHJpbSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycgJiYgb2JqLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBuZXcgU3RyaW5nUHJpbShvYmopO1xuICB9XG4gIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwUHJpbShvYmopO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgUHJpbShvYmopO1xuICB9XG59O1xuXG5leHBvcnRzLlBFeHByID0gUEV4cHI7XG5leHBvcnRzLmFueXRoaW5nID0gYW55dGhpbmc7XG5leHBvcnRzLlByaW0gPSBQcmltO1xuZXhwb3J0cy5TdHJpbmdQcmltID0gU3RyaW5nUHJpbTtcbmV4cG9ydHMuUmVnRXhwUHJpbSA9IFJlZ0V4cFByaW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kQWx0ID0gRXh0ZW5kQWx0O1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkJpbmQgPSBCaW5kO1xuZXhwb3J0cy5NYW55ID0gTWFueTtcbmV4cG9ydHMuT3B0ID0gT3B0O1xuZXhwb3J0cy5Ob3QgPSBOb3Q7XG5leHBvcnRzLkxvb2thaGVhZCA9IExvb2thaGVhZDtcbmV4cG9ydHMuU3RyID0gU3RyO1xuZXhwb3J0cy5MaXN0ID0gTGlzdDtcbmV4cG9ydHMuT2JqID0gT2JqO1xuZXhwb3J0cy5BcHBseSA9IEFwcGx5O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXh0ZW5zaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi9wZXhwcnMtYWRkUnVsZXNUaGF0TmVlZFNlbWFudGljQWN0aW9uLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnROb0R1cGxpY2F0ZUJpbmRpbmdzLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnROb1VzZWxlc3NCaW5kaW5ncy5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQmluZGluZ3MuanMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdldEJpbmRpbmdOYW1lcy5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbC5qcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlLmpzJyk7XG5yZXF1aXJlKCcuL3BleHBycy1wcm9kdWNlc1ZhbHVlLmpzJyk7XG5cbiIsIi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMuanMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBfYXBwbHlTcGFjZXMgPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocnVsZURpY3QsIGlucHV0U3RyZWFtKSB7XG4gIF9hcHBseVNwYWNlcy5ldmFsKGZhbHNlLCBydWxlRGljdCwgaW5wdXRTdHJlYW0sIHVuZGVmaW5lZCk7XG59O1xuXG4iLCIvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbC5qcycpO1xuXG52YXIgYXdsaWIgPSByZXF1aXJlKCdhd2xpYicpO1xudmFyIGJyb3dzZXIgPSBhd2xpYi5icm93c2VyXG52YXIgb2JqZWN0VGhhdERlbGVnYXRlc1RvID0gYXdsaWIub2JqZWN0VXRpbHMub2JqZWN0VGhhdERlbGVnYXRlc1RvO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gVGh1bmsoKSB7XG4gIHRocm93ICdUaHVuayBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCc7XG59XG5cbnZhciBuZXh0VGh1bmtJZCA9IDA7XG5UaHVuay5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaWQgPSBuZXh0VGh1bmtJZCsrO1xuICB9XG59O1xuXG5mdW5jdGlvbiBSdWxlVGh1bmsocnVsZU5hbWUsIHNvdXJjZSwgc3RhcnRJZHgsIGVuZElkeCwgdmFsdWUsIGJpbmRpbmdzKSB7XG4gIHRoaXMuaW5pdCgpO1xuICB0aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHg7XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4O1xuICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbn1cblxuUnVsZVRodW5rLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBpZiAoIW1lbW8uaGFzT3duUHJvcGVydHkodGhpcy5pZCkpIHtcbiAgICAgIHZhciBhY3Rpb24gPSB0aGlzLmxvb2t1cEFjdGlvbihhY3Rpb25EaWN0KTtcbiAgICAgIHZhciBhZGRsSW5mbyA9IHRoaXMuY3JlYXRlQWRkbEluZm8oKTtcbiAgICAgIHZhciBlbnYgPSB0aGlzLm1ha2VFbnYoYWN0aW9uRGljdCwgbWVtbyk7XG4gICAgICBtZW1vW3RoaXMuaWRdID0gYWN0aW9uLmNhbGwoYWRkbEluZm8sIGVudik7XG4gICAgfVxuICAgIHJldHVybiBtZW1vW3RoaXMuaWRdO1xuICB9LFxuXG4gIGxvb2t1cEFjdGlvbjogZnVuY3Rpb24oYWN0aW9uRGljdCkge1xuICAgIHZhciBydWxlTmFtZSA9IHRoaXMucnVsZU5hbWU7XG4gICAgdmFyIGFjdGlvbiA9IGFjdGlvbkRpY3RbcnVsZU5hbWVdO1xuICAgIGlmIChhY3Rpb24gPT09IHVuZGVmaW5lZCAmJiBhY3Rpb25EaWN0Ll9kZWZhdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGFjdGlvbiA9IGZ1bmN0aW9uKGVudikge1xuICAgICAgICByZXR1cm4gYWN0aW9uRGljdC5fZGVmYXVsdC5jYWxsKHRoaXMsIHJ1bGVOYW1lLCBlbnYpO1xuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGFjdGlvbiB8fCBicm93c2VyLmVycm9yKCdtaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3InLCBydWxlTmFtZSk7XG4gIH0sXG5cbiAgY3JlYXRlQWRkbEluZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpbnRlcnZhbDogbmV3IEludGVydmFsKHRoaXMuc291cmNlLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeClcbiAgICB9O1xuICB9LFxuXG4gIG1ha2VFbnY6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICB2YXIgYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmxlbmd0aCA9PT0gMCA/IFsndmFsdWUnLCB0aGlzLnZhbHVlXSA6IHRoaXMuYmluZGluZ3M7XG4gICAgdmFyIGVudiA9IHt9O1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJpbmRpbmdzLmxlbmd0aDsgaWR4ICs9IDIpIHtcbiAgICAgIHZhciBuYW1lID0gYmluZGluZ3NbaWR4XTtcbiAgICAgIHZhciB0aHVuayA9IGJpbmRpbmdzW2lkeCArIDFdO1xuICAgICAgdGhpcy5hZGRCaW5kaW5nKGVudiwgbmFtZSwgdGh1bmssIGFjdGlvbkRpY3QsIG1lbW8pO1xuICAgIH1cbiAgICByZXR1cm4gZW52O1xuICB9LFxuXG4gIGFkZEJpbmRpbmc6IGZ1bmN0aW9uKGVudiwgbmFtZSwgdmFsdWUsIGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZW52LCBuYW1lLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBUaHVuaykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUuZm9yY2UoYWN0aW9uRGljdCwgbWVtbyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IHRydWVcbiAgICB9KTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIExpc3RUaHVuayh0aHVua3MpIHtcbiAgdGhpcy5pbml0KCk7XG4gIHRoaXMudGh1bmtzID0gdGh1bmtzO1xufVxuXG5MaXN0VGh1bmsucHJvdG90eXBlID0gb2JqZWN0VGhhdERlbGVnYXRlc1RvKFRodW5rLnByb3RvdHlwZSwge1xuICBmb3JjZTogZnVuY3Rpb24oYWN0aW9uRGljdCwgbWVtbykge1xuICAgIGlmICghbWVtby5oYXNPd25Qcm9wZXJ0eSh0aGlzLmlkKSkge1xuICAgICAgbWVtb1t0aGlzLmlkXSA9IHRoaXMudGh1bmtzLm1hcChmdW5jdGlvbih0aHVuaykgeyByZXR1cm4gdGh1bmsuZm9yY2UoYWN0aW9uRGljdCwgbWVtbyk7IH0pO1xuICAgIH1cbiAgICByZXR1cm4gbWVtb1t0aGlzLmlkXTtcbiAgfVxufSk7XG5cbmZ1bmN0aW9uIFZhbHVlVGh1bmsodmFsdWUpIHtcbiAgdGhpcy52YWx1ZSA9IHZhbHVlO1xufVxuXG5WYWx1ZVRodW5rLnByb3RvdHlwZSA9IG9iamVjdFRoYXREZWxlZ2F0ZXNUbyhUaHVuay5wcm90b3R5cGUsIHtcbiAgZm9yY2U6IGZ1bmN0aW9uKGFjdGlvbkRpY3QsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZTtcbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlJ1bGVUaHVuayA9IFJ1bGVUaHVuaztcbmV4cG9ydHMuTGlzdFRodW5rID0gTGlzdFRodW5rO1xuZXhwb3J0cy5WYWx1ZVRodW5rID0gVmFsdWVUaHVuaztcbmV4cG9ydHMudmFsdWVsZXNzVGh1bmsgPSBuZXcgVmFsdWVUaHVuayh1bmRlZmluZWQpO1xuXG4iXX0=
(16)
});
