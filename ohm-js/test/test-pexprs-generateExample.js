'use strict';

const test = require('tape');

const makeGrammar = require('./testUtil').makeGrammar;

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('Alt', t => {
  const random = Math.random;

  try {
    const g = makeGrammar([
      'G {',
      '  alt = "a" | "b"',
      '}'
    ]);

    // Stubbed out random functions force the 'generateExample()' function
    //   to take one path or another. In this case:
    //   floor(0.6 * 2) = 1, making 'generateExample()' select the second path.
    Math.random = function() { return 0.6; };
    let example = g.rules.alt.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'b');

    Math.random = function() { return 0.2; };
    example = g.rules.alt.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'a');
  } finally {
    Math.random = random;
  }
  t.end();
});

test('Seq', t => {
  const g = makeGrammar([
    'G {',
    '  seq = "a" "b"',
    '}'
  ]);

  const example = g.rules.seq.body.generateExample(g, {}, false, []);

  t.equal(example.value, 'ab');

  t.end();
});

test('Apply', t => {
  const g = makeGrammar([
    'G {',
    '  apply = a ',
    '  a = "b"*   ',
    '}'
  ]);

  const example = g.rules.apply.body.generateExample(g, {a: ['bbbb']}, false, []);

  t.equal(example.value, 'bbbb');
  t.end();
});

test('Terminal', t => {
  const g = makeGrammar([
    'G {',
    '  a = "a"',
    '}'
  ]);

  const example = g.rules.a.body.generateExample(g, {}, false, []);

  t.equal(example.value, 'a');
  t.end();
});

test('Range', t => {
  const g = makeGrammar([
    'G {',
    '  num = "1" .. "9"',
    '}'
  ]);

  const example = g.rules.num.body.generateExample(g, {}, false, []);
  const charCode = example.value.charCodeAt(0);

  t.ok(charCode >= '1'.charCodeAt(0));
  t.ok(charCode <= '9'.charCodeAt(0));

  t.end();
});

test('Not', t => {
  const g = makeGrammar([
    'G {',
    '  not = ~"a"',
    '}'
  ]);

  const example = g.rules.not.body.generateExample(g, {}, false, []);

  t.equal(example.value, '');

  t.end();
});

test('Lookahead', t => {
  const g = makeGrammar([
    'G {',
    '  lookahead = &"a"',
    '}'
  ]);

  const example = g.rules.lookahead.body.generateExample(g, {}, false, []);

  t.equal(example.value, '');

  t.end();
});

test('Star', t => {
  const random = Math.random;

  try {
    const g = makeGrammar([
      'G {',
      '  star = "a"*',
      '}'
    ]);

    // Here, a stubbed 'Math.random()' makes 'generateExample()' repeat 'a'
    //   a certain number of times. for example:
    //   floor(4 * 0.76) = 3, and floor(3 * 0.1) = 0
    // Note: the system only generates up to 3 repetitions in an iter node
    Math.random = function() { return 0.76; };
    let example = g.rules.star.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'aaa');

    Math.random = function() { return 0.1; };
    example = g.rules.star.body.generateExample(g, {}, false, []);
    t.equal(example.value, '');
  } finally {
    Math.random = random;
  }

  t.end();
});

test('Plus', t => {
  const random = Math.random;

  try {
    const g = makeGrammar([
      'G {',
      '  plus = "a"+',
      '}'
    ]);

    Math.random = function() { return 0.1; };
    let example = g.rules.plus.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'a');

    Math.random = function() { return 0.76; };
    example = g.rules.plus.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'aaaa');
  } finally {
    Math.random = random;
  }

  t.end();
});

test('Opt', t => {
  const random = Math.random;

  try {
    const g = makeGrammar([
      'G {',
      '  opt = "a"?',
      '}'
    ]);

    Math.random = function() { return 0.76; };
    let example = g.rules.opt.body.generateExample(g, {}, false, []);
    t.equal(example.value, 'a');

    Math.random = function() { return 0.1; };
    example = g.rules.opt.body.generateExample(g, {}, false, []);
    t.equal(example.value, '');
  } finally {
    Math.random = random;
  }

  t.end();
});

test('Param', t => {
  const g = makeGrammar([
    'G {',
    '  one<x> = x     ',
    '  m = "m"        ',
    '}'
  ]);

  const example = g.rules.one.body.generateExample(g, {}, false, [g.rules.m.body]);

  t.equal(example.value, 'm');

  t.end();
});

test('Lex', t => {
  const g = makeGrammar([
    'G {',
    '  A = #("a" "b")',
    '}'
  ]);

  const example = g.rules.A.body.generateExample(g, {}, true, []);

  t.equal(example.value, 'ab');

  t.end();
});
