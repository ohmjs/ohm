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
  var s = g.semantics().addOperation('v', {
    Pair: function(oparen, x, comma, y, cparen) { return [x.v(), y.v()]; },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  var cst = g.match('(1,2)', 'Start');
  t.deepEqual(s(cst).v(), ['1', '2']);
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
  var s = g.semantics().addOperation('v', {
    List_some: function(x, sep, xs) { return [x.v()].concat(xs.v()); },
    List_none: function() { return []; },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  var cst = g.match('x, x,x', 'Start');
  t.deepEqual(s(cst).v(), ['x', 'x', 'x']);
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
  var s = g.semantics().addOperation('v', {
    LeftAssoc_rec: function(x, op, y) { return [op.v(), x.v(), y.v()]; },
    LeftAssoc_base: function(x) { return x.v(); },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  var cst = g.match('1 + 2 + 3', 'Start');
  t.deepEqual(s(cst).v(), ['+', ['+', '1', '2'], '3']);
  t.end();
});

test('complex parameters', function(t) {
  var g = util.makeGrammar(
      'G {\n' +
      '  start = two<~"5" digit>\n' +
      '  two<x> = x x\n' +
      '}');
  var s = g.semantics().addOperation('v', {
    two: function(x, y) { return [x.v(), y.v()]; },
    _terminal: ohm.actions.getPrimitiveValue,
    _default: ohm.actions.passThrough
  });
  t.deepEqual(s(g.match('42')).v(), ['4', '2']);
  t.equal(g.match('45').failed(), true);
  t.end();
});
