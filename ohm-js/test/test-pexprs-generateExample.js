'use strict';

var test = require('tape');

var makeGrammar = require('./testUtil').makeGrammar;

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('Alt', function(t) {
  var random = Math.random;

  try {
    var g = makeGrammar([
      'G {',
      '  alt = "a" | "b"',
      '}'
    ]);

    // Stubbed out random functions force the 'generateExample()' function
    //   to take one path or another. In this case:
    //   floor(0.6 * 2) = 1, making 'generateExample()' select the second path.
    Math.random = function() { return 0.6; };
    var example = g.rules.alt.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'b');

    Math.random = function() { return 0.2; };
    example = g.rules.alt.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'a');
  } finally {
    Math.random = random;
  }
  t.end();
});

test('Seq', function(t) {
  var g = makeGrammar([
    'G {',
    '  seq = "a" "b"',
    '}'
  ]);

  var example = g.rules.seq.body.generateExample(g, {}, false, []);

  t.equal(example.value, 'ab');

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

  t.equal(example.value, 'bbbb');
  t.end();
});

test('Terminal', function(t) {
  var g = makeGrammar([
    'G {',
    '  a = "a"',
    '}'
  ]);

  var example = g.rules.a.body.generateExample(g, {}, false, []);

  t.equal(example.value, 'a');
  t.end();
});

test('Range', function(t) {
  var g = makeGrammar([
    'G {',
    '  num = "1" .. "9"',
    '}'
  ]);

  var example = g.rules.num.body.generateExample(g, {}, false, []);
  var charCode = example.value.charCodeAt(0);

  t.ok(charCode >= '1'.charCodeAt(0));
  t.ok(charCode <= '9'.charCodeAt(0));

  t.end();
});

test('Not', function(t) {
  var g = makeGrammar([
    'G {',
    '  not = ~"a"',
    '}'
  ]);

  var example = g.rules.not.body.generateExample(g, {}, false, []);

  t.equal(example.value, '');

  t.end();
});

test('Lookahead', function(t) {
  var g = makeGrammar([
    'G {',
    '  lookahead = &"a"',
    '}'
  ]);

  var example = g.rules.lookahead.body.generateExample(g, {}, false, []);

  t.equal(example.value, '');

  t.end();
});

test('Star', function(t) {
  var random = Math.random;

  try {
    var g = makeGrammar([
      'G {',
      '  star = "a"*',
      '}'
    ]);

    // Here, a stubbed 'Math.random()' makes 'generateExample()' repeat 'a'
    //   a certain number of times. for example:
    //   floor(4 * 0.76) = 3, and floor(3 * 0.1) = 0
    // Note: the system only generates up to 3 repetitions in an iter node
    Math.random = function() { return 0.76; };
    var example = g.rules.star.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'aaa');

    Math.random = function() { return 0.1; };
    example = g.rules.star.body.generateExample(g, {}, false, []);
    t.equal(example.value, '');
  } finally {
    Math.random = random;
  }

  t.end();
});

test('Plus', function(t) {
  var random = Math.random;

  try {
    var g = makeGrammar([
      'G {',
      '  plus = "a"+',
      '}'
    ]);

    Math.random = function() { return 0.1; };
    var example = g.rules.plus.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'a');

    Math.random = function() { return 0.76; };
    example = g.rules.plus.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'aaaa');
  } finally {
    Math.random = random;
  }

  t.end();
});

test('Opt', function(t) {
  var random = Math.random;

  try {
    var g = makeGrammar([
      'G {',
      '  opt = "a"?',
      '}'
    ]);

    Math.random = function() { return 0.76; };
    var example = g.rules.opt.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'a');

    Math.random = function() { return 0.1; };
    example = g.rules.opt.body.generateExample(g, {}, false, []);
    t.equal(example.value, '');
  } finally {
    Math.random = random;
  }

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

  t.equal(example.value, 'm');

  t.end();
});

test('Lex', function(t) {
  var g = makeGrammar([
    'G {',
    '  A = #("a" "b")',
    '}'
  ]);

  var example = g.rules.A.body.generateExample(g, {}, true, []);

  t.equal(example.value, 'ab');

  t.end();
});
