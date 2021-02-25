/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const test = require('ava');

const testUtil = require('./helpers/testUtil');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('require same number of params when overriding and extending', t => {
  const ns = testUtil.makeGrammars('G { Foo<x, y> = x y }');

  // Too few parameters
  t.throws(
      () => { testUtil.makeGrammar('G2 <: G { Foo<x> := "oops!" }', ns); },
      {message: /Wrong number of parameters for rule Foo \(expected 2, got 1\)/});
  t.throws(
      () => { testUtil.makeGrammar('G2 <: G { Foo<x> += "oops!" }', ns); },
      {message: /Wrong number of parameters for rule Foo \(expected 2, got 1\)/});

  // Too many parameters
  t.throws(
      () => { testUtil.makeGrammar('G2 <: G { Foo<x, y, z> := "oops!" }', ns); },
      {message: /Wrong number of parameters for rule Foo \(expected 2, got 3\)/});
  t.throws(
      () => { testUtil.makeGrammar('G2 <: G { Foo<x, y, z> += "oops!" }', ns); },
      {message: /Wrong number of parameters for rule Foo \(expected 2, got 3\)/});

  // Just right
  t.truthy(testUtil.makeGrammar('G2 <: G { Foo<x, y> := "yay!" }', ns));
  t.truthy(testUtil.makeGrammar('G2 <: G { Foo<x, y> += "it" "works" }', ns));
});

test('require same number of args when applying', t => {
  const ns = testUtil.makeGrammars('G { Foo<x, y> = x y }');
  t.throws(
      () => { testUtil.makeGrammar('G2 <: G { Bar = Foo<"a"> }', ns); },
      {message: /Wrong number of arguments for rule Foo \(expected 2, got 1\)/});
  t.throws(
      () => { testUtil.makeGrammar('G2 <: G { Bar = Foo<"a", "b", "c"> }', ns); },
      {message: /Wrong number of arguments for rule Foo \(expected 2, got 3\)/});
});

test('require arguments to have arity 1', t => {
  t.throws(
      () => {
        testUtil.makeGrammar(
            'G {\n' +
          '  Foo<x> = x x\n' +
          '  Start = Foo<digit digit>\n' +
          '}');
      },
      {message: /Invalid parameter to rule Foo/});
});

test('require the rules referenced in arguments to be declared', t => {
  t.throws(
      () => {
        testUtil.makeGrammar(
            'G {\n' +
          '  start = listOf<asdlfk, ",">\n' +
          '}');
      },
      {message: /Rule asdlfk is not declared in grammar G/});
});

test('simple examples', t => {
  const g = testUtil.makeGrammar(
      'G {\n' +
      '  Pair<elem> = "(" elem "," elem ")"\n' +
      '  Start = Pair<digit>\n' +
      '}');
  const s = g.createSemantics().addOperation('v', {
    Pair(oparen, x, comma, y, cparen) { return [x.v(), y.v()]; },
    digit(_) { return this.sourceString; }
  });
  const cst = g.match('(1,2)', 'Start');
  t.deepEqual(s(cst).v(), ['1', '2']);
});

test('start matching from parameterized rule', t => {
  const g = testUtil.makeGrammar(
      'G {\n' +
      '  App<arg> = arg\n' +
      '  Simple = App<"x">\n' +
      '  z = "z"\n' +
      '}');
  t.throws(
      () => { g.match('x'); },
      {message: /Wrong number of parameters for rule App \(expected 1, got 0\)/},
      'parameterized default start rule does not work');
  t.throws(
      () => { g.match('y', 'App'); },
      {message: /Wrong number of parameters for rule App \(expected 1, got 0\)/},
      'parameterized rule does not work as simple rule');
  t.truthy(g.match('y', 'App<"y">').succeeded(), 'matching with primitive parameter');
  t.truthy(g.match('z', 'App<"z">').succeeded(), 'matching with rule parameter');
});

test('inline rule declarations', t => {
  const g = testUtil.makeGrammar(
      'G {\n' +
      '  List<elem, sep>\n' +
      '    = elem (sep elem)*  -- some\n' +
      '    |                   -- none\n' +
      '  Start\n' +
      '    = List<"x", ",">\n' +
      '}');
  const s = g.createSemantics().addOperation('v', {
    List_some(x, sep, xs) { return [x.v()].concat(xs.v()); },
    List_none() { return []; },
    _terminal() { return this.primitiveValue; }
  });
  const cst = g.match('x, x,x', 'Start');
  t.deepEqual(s(cst).v(), ['x', 'x', 'x']);
});

test('left recursion', t => {
  const g = testUtil.makeGrammar(
      'G {\n' +
      '  LeftAssoc<expr, op>\n' +
      '    = LeftAssoc<expr, op> op expr  -- rec\n' +
      '    | expr                         -- base\n' +
      '  Start\n' +
      '    = LeftAssoc<digit, "+">\n' +
      '}');
  const s = g.createSemantics().addOperation('v', {
    LeftAssoc_rec(x, op, y) { return [op.v(), x.v(), y.v()]; },
    LeftAssoc_base(x) { return x.v(); },
    _terminal() { return this.primitiveValue; }
  });
  const cst = g.match('1 + 2 + 3', 'Start');
  t.deepEqual(s(cst).v(), ['+', ['+', '1', '2'], '3']);
});

test('complex parameters', t => {
  const g = testUtil.makeGrammar(
      'G {\n' +
      '  start = two<~"5" digit>\n' +
      '  two<x> = x x\n' +
      '}');
  const s = g.createSemantics().addOperation('v', {
    two(x, y) { return [x.v(), y.v()]; },
    _terminal() { return this.primitiveValue; }
  });
  t.deepEqual(s(g.match('42')).v(), ['4', '2']);
  t.is(g.match('45').failed(), true);
});

test('duplicate parameter names', t => {
  t.throws(
      () => { testUtil.makeGrammar('G { Foo<a, b, a, b> = a }'); },
      {message: /Duplicate parameter names in rule Foo: a, b/},
      'defining');
  t.throws(
      () => { testUtil.makeGrammar('G { ListOf<a, a> := a }'); },
      {message: /Duplicate parameter names in rule ListOf: a/},
      'overriding');
  t.throws(
      () => { testUtil.makeGrammar('G { ListOf<a, a> += a }'); },
      {message: /Duplicate parameter names in rule ListOf: a/},
      'extending');

});

