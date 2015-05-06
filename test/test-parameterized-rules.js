/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var errors = require('../src/errors');
var ohm = require('..');
var test = require('tape-catch');
var util = require('./util');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('require same number of params when overriding and extending', function(t) {
  var ns = util.makeGrammars('G { Foo<x, y> = x y }');

  // Too few arguments
  t.throws(
      function() { util.makeGrammar('G2 <: G { Foo<x> := "oops!" }', ns); },
      errors.WrongNumberOfParameters);
  t.throws(
      function() { util.makeGrammar('G2 <: G { Foo<x> += "oops!" }', ns); },
      errors.WrongNumberOfParameters);

  // Too many arguments
  t.throws(
      function() { util.makeGrammar('G2 <: G { Foo<x, y, z> := "oops!" }', ns); },
      errors.WrongNumberOfParameters);
  t.throws(
      function() { util.makeGrammar('G2 <: G { Foo<x, y, z> += "oops!" }', ns); },
      errors.WrongNumberOfParameters);

  // Just right
  t.ok(util.makeGrammar('G2 <: G { Foo<x, y> := "yay!" }', ns));
  t.ok(util.makeGrammar('G2 <: G { Foo<x, y> += "it" "works" }', ns));
  t.end();
});

test('require same number of params when applying', function(t) {
  var ns = util.makeGrammars('G { Foo<x, y> = x y }');
  t.throws(
      function() { util.makeGrammar('G2 <: G { Foo<x> += "oops!" }', ns); },
      errors.WrongNumberOfParameters);
  t.throws(
      function() { util.makeGrammar('G2 <: G { Foo<x, y, z> += "oops!" }', ns); },
      errors.WrongNumberOfParameters);
  t.end();
});

test('require arguments to have arity 1', function(t) {
  t.throws(
      function() {
        util.makeGrammar(
          'G {\n' +
          '  Foo<x> = x x\n' +
          '  Start = Foo<digit digit>\n' +
          '}');
      },
      errors.InvalidParameter);
  t.end();
});

test('simple examples', function(t) {
  var g = util.makeGrammar(
      'G {\n' +
      '  Pair<elem> = "(" elem "," elem ")"\n' +
      '  Start = Pair<digit>\n' +
      '}');
  var value = g.semanticAction({
    Pair: function(oparen, x, comma, y, cparen) { return [value(x), value(y)]; },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  var cst = g.match('(1,2)', 'Start');
  t.deepEqual(value(cst), ['1', '2']);
  t.end();
});

test('inline rule declarations', function(t) {
  var g = util.makeGrammar(
      'G {\n' +
      '  List<elem, sep>\n' +
      '    = elem (sep elem)*  -- some\n' +
      '    |                   -- none\n' +
      '  Start\n' +
      '    = List<"x", ",">\n' +
      '}');
  var value = g.semanticAction({
    List_some: function(x, sep, xs) { return [value(x)].concat(value(xs)); },
    List_none: function() { return []; },
    _many: ohm.actions.makeArray,
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  var cst = g.match('x, x,x', 'Start');
  t.deepEqual(value(cst), ['x', 'x', 'x']);
  t.end();
});

test('left recursion', function(t) {
  var g = util.makeGrammar(
      'G {\n' +
      '  LeftAssoc<expr, op>\n' +
      '    = LeftAssoc<expr, op> op expr  -- rec\n' +
      '    | expr                         -- base\n' +
      '  Start\n' +
      '    = LeftAssoc<digit, "+">\n' +
      '}');
  var value = g.semanticAction({
    LeftAssoc_rec: function(x, op, y) { return [value(op), value(x), value(y)]; },
    LeftAssoc_base: function(x) { return value(x); },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  var cst = g.match('1 + 2 + 3', 'Start');
  t.deepEqual(value(cst), ['+', ['+', '1', '2'], '3']);
  t.end();
});

test('complex parameters', function(t) {
  var g = util.makeGrammar(
      'G {\n' +
      '  start = two<~"5" digit>\n' +
      '  two<x> = x x\n' +
      '}');
  var value = g.semanticAction({
    two: function(x, y) { return [value(x), value(y)]; },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  t.deepEqual(value(g.match('42')), ['4', '2']);
  t.equal(g.match('45').failed(), true);
  t.end();
});
