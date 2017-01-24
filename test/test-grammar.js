'use strict';

var fs = require('fs');
var test = require('tape');

var Grammar = require('../src/Grammar');
var ohm = require('..');
var testUtil = require('./testUtil');

var makeGrammar = testUtil.makeGrammar;
var makeGrammars = testUtil.makeGrammars;

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('action dictionary templates', function(t) {
  var ns = makeGrammars([
    'G1 {',
    '  foo = bar',
    '  bar = baz baz baz',
    '  baz = qux',
    '  qux = quux "123"',
    '  quux = "42"',
    '  aaa = "duh"',
    '  bbb = ~aaa qux  -- blah',
    '}',
    'G2 <: G1 {',
    '  qux := "100"',
    '}'
  ]);
  t.equal(ns.G1.toOperationActionDictionaryTemplate(),
    '{\n' +
    '  foo: function(_) {\n' +
    '  },\n' +
    '  bar: function(_, _, _) {\n' +
    '  },\n' +
    '  baz: function(_) {\n' +
    '  },\n' +
    '  qux: function(_, _) {\n' +
    '  },\n' +
    '  quux: function(_) {\n' +
    '  },\n' +
    '  aaa: function(_) {\n' +
    '  },\n' +
    '  bbb_blah: function(_) {\n' +
    '  },\n' +
    '  bbb: function(_) {\n' +
    '  },\n' +
    '  alnum: function(_) {\n' +
    '  },\n' +
    '  letter: function(_) {\n' +
    '  },\n' +
    '  digit: function(_) {\n' +
    '  },\n' +
    '  hexDigit: function(_) {\n' +
    '  },\n' +
    '  ListOf: function(_) {\n' +
    '  },\n' +
    '  NonemptyListOf: function(_, _, _) {\n' +
    '  },\n' +
    '  EmptyListOf: function() {\n' +
    '  },\n' +
    '  listOf: function(_) {\n' +
    '  },\n' +
    '  nonemptyListOf: function(_, _, _) {\n' +
    '  },\n' +
    '  emptyListOf: function() {\n' +
    '  },\n' +
    '  any: function(_) {\n' +
    '  },\n' +
    '  end: function(_) {\n' +
    '  },\n' +
    '  caseInsensitive: function(_) {\n' +
    '  },\n' +
    '  lower: function(_) {\n' +
    '  },\n' +
    '  upper: function(_) {\n' +
    '  },\n' +
    '  unicodeLtmo: function(_) {\n' +
    '  },\n' +
    '  spaces: function(_) {\n' +
    '  },\n' +
    '  space: function(_) {\n' +
    '  }\n' +
    '}');
  t.equal(ns.G2.toAttributeActionDictionaryTemplate(),
    '{\n' +
    '  qux: function(_) {\n' +
    '  },\n' +
    '  foo: function(_) {\n' +
    '  },\n' +
    '  bar: function(_, _, _) {\n' +
    '  },\n' +
    '  baz: function(_) {\n' +
    '  },\n' +
    '  quux: function(_) {\n' +
    '  },\n' +
    '  aaa: function(_) {\n' +
    '  },\n' +
    '  bbb_blah: function(_) {\n' +
    '  },\n' +
    '  bbb: function(_) {\n' +
    '  },\n' +
    '  alnum: function(_) {\n' +
    '  },\n' +
    '  letter: function(_) {\n' +
    '  },\n' +
    '  digit: function(_) {\n' +
    '  },\n' +
    '  hexDigit: function(_) {\n' +
    '  },\n' +
    '  ListOf: function(_) {\n' +
    '  },\n' +
    '  NonemptyListOf: function(_, _, _) {\n' +
    '  },\n' +
    '  EmptyListOf: function() {\n' +
    '  },\n' +
    '  listOf: function(_) {\n' +
    '  },\n' +
    '  nonemptyListOf: function(_, _, _) {\n' +
    '  },\n' +
    '  emptyListOf: function() {\n' +
    '  },\n' +
    '  any: function(_) {\n' +
    '  },\n' +
    '  end: function(_) {\n' +
    '  },\n' +
    '  caseInsensitive: function(_) {\n' +
    '  },\n' +
    '  lower: function(_) {\n' +
    '  },\n' +
    '  upper: function(_) {\n' +
    '  },\n' +
    '  unicodeLtmo: function(_) {\n' +
    '  },\n' +
    '  spaces: function(_) {\n' +
    '  },\n' +
    '  space: function(_) {\n' +
    '  }\n' +
    '}');
  t.end();
});

test('default start rule', function(t) {
  var g = ohm.grammar('G {}');
  t.equal(g.defaultStartRule, undefined, 'undefined for an empty grammar');
  t.throws(function() { g.match('a'); }, /Missing start rule/, 'match throws with no start rule');
  t.equal(Grammar.ProtoBuiltInRules.defaultStartRule, undefined, 'undefined for ProtoBuiltInRules');
  t.equal(Grammar.BuiltInRules.defaultStartRule, undefined, 'undefined for BuiltInRules');

  var g2 = ohm.grammar('G2 <: G {}', {G: g});
  t.equal(g2.defaultStartRule, undefined, 'undefined for a subgrammar too');
  t.throws(function() { g2.match('a'); }, /Missing start rule/, 'match throws with no start rule');

  var ns = makeGrammars(['G { foo = "a" }', 'G2 <: G {}']);
  t.equal(ns.G.defaultStartRule, 'foo', 'only rule becomes default start rule');
  t.equal(ns.G2.defaultStartRule, 'foo', 'start rule is inherited from supergrammar');
  t.equal(ns.G.match('a').succeeded(), true, 'match works without a start rule argument');
  t.equal(ns.G2.match('a').succeeded(), true);

  var g3 = ohm.grammar('G3 <: G { bar = "b" }', ns);
  t.equal(g3.defaultStartRule, 'foo', 'start rule is still inherited');
  t.equal(g3.match('a').succeeded(), true);

  var g4 = ohm.grammar('G4 <: G3 { blah = "c" }', {G3: g3});
  t.equal(g4.defaultStartRule, 'foo', 'start rule inherited from super-supergrammar');
  t.equal(g4.match('a').succeeded(), true);

  g = ohm.grammar('G { digit += any }');
  t.equal(g.defaultStartRule, undefined, "extending alone doesn't set the start rule");
  t.throws(function() { g.match('a'); }, /Missing start rule/, 'match throws with no start rule');
  g = makeGrammar(['G { digit += any', 'blah = "3" }']);
  t.equal(g.defaultStartRule, 'blah', 'rule defined after extending becomes start rule');
  t.equal(g.match('3').succeeded(), true);

  g = ohm.grammar('G { digit := any }');
  t.equal(g.defaultStartRule, undefined, "overriding alone doesn't set the start rule");
  t.throws(function() { g.match('a'); }, /Missing start rule/, 'match throws with no start rule');
  g = makeGrammar(['G { digit := any', 'blah = "3" }']);
  t.equal(g.defaultStartRule, 'blah', 'rule defined after overriding becomes start rule');
  t.equal(g.match('3').succeeded(), true);

  g = ohm.grammar('G { x = "a"\n| -- nothing }');
  t.equal(g.defaultStartRule, 'x', "an inline rule doesn't become the default");

  // Test passing the default start rule as an argument to the Grammar constructor.
  var root = Grammar.BuiltInRules;
  t.throws(function() {
    new Grammar('G', root, {}, 'nonexistentRule');  // eslint-disable-line no-new
  }, /Invalid start rule/, 'throws when start rule is not in the grammar');
  t.ok(
      new Grammar('G', root, {aRule: null}, 'aRule'),
     'works when it is in the `rules` dict');
  var rules = Object.create(root.rules);
  t.ok(
      new Grammar('G', root, rules, 'digit'),
      'works when rule is in the supergrammar');

  t.end();
});

test('grammar equality', function(t) {
  var source = fs.readFileSync('test/arithmetic.ohm').toString();
  var a = ohm.grammar(source);
  var b = ohm.grammar(source);
  t.equal(a.equals(b), true, 'two grammars from same source');
  t.equal(a.equals(), false, 'comparing to undefined');
  t.equal(a.equals(null), false, 'comparing to null');

  var c = ohm.grammar(source.replace('digit', '(digit)'));
  t.equal(a.equals(c), true, 'still equal after meaningless source change');

  var exp = a.rules.exp;
  delete a.rules.exp;

  t.equals(a.equals(b), false, 'not equal after deleting a rule');

  a.rules.exp = exp;
  t.equals(a.equals(b), true, 'equal aftering adding rule back');

  a.rules.exp.description = 'doyyy';
  t.equals(a.equals(b), false, 'not equal after changing a description');

  b.rules.zzz = {};
  t.equals(b.equals(c), false, 'not equal after adding additional rule');
  delete b.rules.zzz;
  t.equals(b.equals(c), true);

  b.defaultStartRule = '';
  t.equals(b.equals(c), false, 'not equal after changing defaultStartRule');

  t.end();
});
