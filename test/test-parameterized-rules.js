/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('require same number of params when overriding and extending', function(t) {
  var ns = testUtil.makeGrammars('G { Foo<x, y> = x y }');

  // Too few arguments
  t.throws(
      function() { testUtil.makeGrammar('G2 <: G { Foo<x> := "oops!" }', ns); },
      /Wrong number of parameters for rule Foo \(expected 2, got 1\)/);
  t.throws(
      function() { testUtil.makeGrammar('G2 <: G { Foo<x> += "oops!" }', ns); },
      /Wrong number of parameters for rule Foo \(expected 2, got 1\)/);

  // Too many arguments
  t.throws(
      function() { testUtil.makeGrammar('G2 <: G { Foo<x, y, z> := "oops!" }', ns); },
      /Wrong number of parameters for rule Foo \(expected 2, got 3\)/);
  t.throws(
      function() { testUtil.makeGrammar('G2 <: G { Foo<x, y, z> += "oops!" }', ns); },
      /Wrong number of parameters for rule Foo \(expected 2, got 3\)/);

  // Just right
  t.ok(testUtil.makeGrammar('G2 <: G { Foo<x, y> := "yay!" }', ns));
  t.ok(testUtil.makeGrammar('G2 <: G { Foo<x, y> += "it" "works" }', ns));
  t.end();
});

test('require same number of params when applying', function(t) {
  var ns = testUtil.makeGrammars('G { Foo<x, y> = x y }');
  t.throws(
      function() { testUtil.makeGrammar('G2 <: G { Bar = Foo<"a"> }', ns); },
      /Wrong number of parameters for rule Foo \(expected 2, got 1\)/);
  t.throws(
      function() { testUtil.makeGrammar('G2 <: G { Bar = Foo<"a", "b", "c"> }', ns); },
      /Wrong number of parameters for rule Foo \(expected 2, got 3\)/);
  t.end();
});

test('require arguments to have arity 1', function(t) {
  t.throws(
      function() {
        testUtil.makeGrammar(
          'G {\n' +
          '  Foo<x> = x x\n' +
          '  Start = Foo<digit digit>\n' +
          '}');
      },
      /Invalid parameter to rule Foo/);
  t.end();
});

test('require the rules referenced in arguments to be declared', function(t) {
  t.throws(
      function() {
        testUtil.makeGrammar(
          'G {\n' +
          '  start = listOf<asdlfk, ",">\n' +
          '}');
      },
      /Rule asdlfk is not declared in grammar G/);
  t.end();
});

test('simple examples', function(t) {
  var g = testUtil.makeGrammar(
      'G {\n' +
      '  Pair<elem> = "(" elem "," elem ")"\n' +
      '  Start = Pair<digit>\n' +
      '}');
  var s = g.semantics().addOperation('v', {
    Pair: function(oparen, x, comma, y, cparen) { return [x.v(), y.v()]; }
  });
  var cst = g.match('(1,2)', 'Start');
  t.deepEqual(s(cst).v(), ['1', '2']);
  t.end();
});

test('inline rule declarations', function(t) {
  var g = testUtil.makeGrammar(
      'G {\n' +
      '  List<elem, sep>\n' +
      '    = elem (sep elem)*  -- some\n' +
      '    |                   -- none\n' +
      '  Start\n' +
      '    = List<"x", ",">\n' +
      '}');
  var s = g.semantics().addOperation('v', {
    List_some: function(x, sep, xs) { return [x.v()].concat(xs.v()); },
    List_none: function() { return []; }
  });
  var cst = g.match('x, x,x', 'Start');
  t.deepEqual(s(cst).v(), ['x', 'x', 'x']);
  t.end();
});

test('left recursion', function(t) {
  var g = testUtil.makeGrammar(
      'G {\n' +
      '  LeftAssoc<expr, op>\n' +
      '    = LeftAssoc<expr, op> op expr  -- rec\n' +
      '    | expr                         -- base\n' +
      '  Start\n' +
      '    = LeftAssoc<digit, "+">\n' +
      '}');
  var s = g.semantics().addOperation('v', {
    LeftAssoc_rec: function(x, op, y) { return [op.v(), x.v(), y.v()]; },
    LeftAssoc_base: function(x) { return x.v(); }
  });
  var cst = g.match('1 + 2 + 3', 'Start');
  t.deepEqual(s(cst).v(), ['+', ['+', '1', '2'], '3']);
  t.end();
});

test('complex parameters', function(t) {
  var g = testUtil.makeGrammar(
      'G {\n' +
      '  start = two<~"5" digit>\n' +
      '  two<x> = x x\n' +
      '}');
  var s = g.semantics().addOperation('v', {
    two: function(x, y) { return [x.v(), y.v()]; }
  });
  t.deepEqual(s(g.match('42')).v(), ['4', '2']);
  t.equal(g.match('45').failed(), true);
  t.end();
});
