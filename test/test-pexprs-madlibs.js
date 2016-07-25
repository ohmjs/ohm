'use strict';

var test = require('tape');

var makeGrammar = require('./testUtil').makeGrammar;

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// test('PExpr');
//
test('Alt', function(t) {
  var g = makeGrammar([
    'G {',
    '  alt = "a" | "b"',
    '}'
  ]);

  var random = Math.random;

  Math.random = function() { return 0.6; };
  var example = g.rules.alt.body.generateExample(g, {}, false, []);
  t.equal(example.example, 'b');

  Math.random = function() { return 0.2; };
  example = g.rules.alt.body.generateExample(g, {}, false, []);
  t.equal(example.example, 'a');

  Math.random = random;
  t.end();
});

test('Seq', function(t) {
  var g = makeGrammar([
    'G {',
    '  seq = "a" "b"',
    '}'
  ]);

  var example = g.rules.seq.body.generateExample(g, {}, false, []);

  t.equal(example.example, 'ab');

  t.end();
});

test('Apply', function(t) {
  var g = makeGrammar([
    'G {',
    '  apply = a ',
    '  a = "b"*   ',
    '}'
  ]);

  var example = g.rules.apply.body.generateExample(g, {a: ['bbbb']}, false, []);

  t.equal(example.example, 'bbbb');
  t.end();
});

test('Terminal', function(t) {
  var g = makeGrammar([
    'G {',
    '  a = "a"',
    '}'
  ]);

  var example = g.rules.a.body.generateExample(g, {}, false, []);

  t.equal(example.example, 'a');
  t.end();
});

test('Range', function(t) {
  var g = makeGrammar([
    'G {',
    '  num = "1" .. "9"',
    '}'
  ]);

  var example = g.rules.num.body.generateExample(g, {}, false, []);
  var charCode = example.example.charCodeAt(0);

  t.pass(charCode >= '1'.charCodeAt(0));
  t.pass(charCode <= '9'.charCodeAt(0));

  t.end();
});

test('Not', function(t) {
  var g = makeGrammar([
    'G {',
    '  not = ~"a"',
    '}'
  ]);

  var example = g.rules.not.body.generateExample(g, {}, false, []);

  t.equal(example.example, '');

  t.end();
});

test('Lookahead', function(t) {
  var g = makeGrammar([
    'G {',
    '  lookahead = &"a"',
    '}'
  ]);

  var example = g.rules.lookahead.body.generateExample(g, {}, false, []);

  t.equal(example.example, '');

  t.end();
});

test('Star', function(t) {
  var g = makeGrammar([
    'G {',
    '  star = "a"*',
    '}'
  ]);

  var random = Math.random;

  Math.random = function() { return 0.76; };
  var example = g.rules.star.body.generateExample(g, {}, false, []);
  t.equal(example.example, 'aaa');

  Math.random = function() { return 0.1; };
  example = g.rules.star.body.generateExample(g, {}, false, []);
  t.equal(example.example, '');

  Math.random = random;
  t.end();
});

test('Plus', function(t) {
  var g = makeGrammar([
    'G {',
    '  plus = "a"+',
    '}'
  ]);

  var random = Math.random;

  Math.random = function() { return 0.1; };
  var example = g.rules.plus.body.generateExample(g, {}, false, []);
  t.equal(example.example, 'a');

  Math.random = function() { return 0.76; };
  example = g.rules.plus.body.generateExample(g, {}, false, []);
  t.equal(example.example, 'aaa');

  Math.random = random;
  t.end();
});

test('Opt', function(t) {
  var g = makeGrammar([
    'G {',
    '  opt = "a"?',
    '}'
  ]);

  var random = Math.random;

  Math.random = function() { return 0.76; };
  var example = g.rules.opt.body.generateExample(g, {}, false, []);
  t.equal(example.example, 'a');

  Math.random = function() { return 0.1; };
  example = g.rules.opt.body.generateExample(g, {}, false, []);
  t.equal(example.example, '');

  Math.random = random;
  t.end();
});

test('Param', function(t) {
  var g = makeGrammar([
    'G {',
    '  one<x> = x     ',
    '  m = "m"        ',
    '}'
  ]);

  var example = g.rules.one.body.generateExample(g, {}, false, [g.rules.m.body]);

  t.equal(example.example, 'm');

  t.end();
});
