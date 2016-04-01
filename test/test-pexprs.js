'use strict';

var ohm = require('..');
var pexprs = require('../src/pexprs');
var test = require('tape');

require('../src/pexprs-toArgumentNameList');

var makeGrammar = require('./testUtil').makeGrammar;

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('definitionInterval', function(t) {
  var g = makeGrammar([
    'G {',
    '  foo = bar',
    '  bar = "a" | "b" -- baz',
    '}'
  ]);

  function definitionLoc(grammar, ruleName) {
    var interval = grammar.ruleBodies[ruleName].definitionInterval;
    return [interval.startIdx, interval.endIdx];
  }
  t.deepEqual(definitionLoc(g, 'foo'), [6, 15], 'regular rule');
  t.deepEqual(definitionLoc(g, 'bar'), [18, 40]);
  t.deepEqual(definitionLoc(g, 'bar_baz'), [30, 40], 'inline rule');

  var g2 = makeGrammar([
    'G2 <: G {',
    '  foo += bar',
    '  bar := "a" | "b" -- baz',
    '}'
  ], {G: g});
  t.deepEqual(definitionLoc(g2, 'foo'), [12, 22], 'extended rule');
  t.deepEqual(definitionLoc(g2, 'bar'), [25, 48], 'overridden rule');
  t.deepEqual(definitionLoc(g2, 'bar_baz'), [38, 48], 'inline rule in overridden rule');

  t.end();
});

test('rule invocation interval', function(t) {
  var g = makeGrammar([
    'G {',
    '  foo = bar',
    '  beep = letter bar',
    '  bar = "a" | "blah" | "a".."z" -- baz',
    '}'
  ]);

  function fromLoc(pexpr) {
    return [pexpr.interval.startIdx, pexpr.interval.endIdx];
  }
  var fooBody = g.ruleBodies.foo;
  var beepBody = g.ruleBodies.beep;
  var barBody = g.ruleBodies.bar;
  t.deepEqual(fromLoc(fooBody), [12, 15], 'regular rule application');
  t.deepEqual(fromLoc(beepBody.factors[1]), [32, 35]);

  t.deepEqual(fromLoc(beepBody.factors[0]), [25, 31], 'built-in rule application');
  t.deepEqual(fromLoc(barBody.terms[0]), [44, 47], 'primitive (string)');
  t.deepEqual(fromLoc(barBody.terms[1]), [50, 56], 'another string');

  var barBazBody = g.ruleBodies.bar_baz;
  t.deepEqual(fromLoc(barBazBody), [59, 67], 'primitive (range)');
  t.deepEqual(fromLoc(beepBody), [25, 35], 'works for seq');
  t.deepEqual(fromLoc(barBody), [44, 74], 'works for alt');
  t.end();
});

test('toDisplayString', function(t) {
  var g = ohm.grammar('G { start = "ab" | letter* | "a".."z" }');
  var seq = g.ruleBodies.start;
  t.equal(seq.toDisplayString(), '"ab" | letter* | "a".."z"');
  t.equal(seq.terms[0].toDisplayString(), '"ab"');

  var many = seq.terms[1];
  t.equal(many.toDisplayString(), 'letter*');
  t.equal(many.expr.toDisplayString(), 'letter');

  t.equal(seq.terms[2].toDisplayString(), '"a".."z"');

  t.end();
});

test('toString', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = ~(2 | 3?) $(&"a" b #a) [c {e: $b, ...} {g: $("a".."z")}]',
    '  a = "a"',
    '  b = "b"',
    '  c = 3',
    '}'
    ]);
  var e = g.ruleBodies.start;
  t.equal(e.toString(), '(~(2 | 3?) $((&"a" b #(a))) [(c {"e": $(b), ...} {"g": $("a".."z")})])');
  t.end();
});

test('toArgumentNameList', function(t) {
  var g =  makeGrammar([
    'G {',
    ' Start = &((foo bars foo)+)',
    ' foo = "ab" | letter* | "a".."z"',
    ' bars = ~"a" (letter "b"| digit "b") foo? "+"',
    ' plus = foo "+" bars',
    ' MoreOpts = ("+" Start)?',
    ' }'
    ]);

  var iter = g.ruleBodies.Start;
  t.deepEqual(iter.toArgumentNameList(1), ['foo_1s', 'barses', 'foo_2s']);

  var alt = g.ruleBodies.foo;
  t.deepEqual(alt.toArgumentNameList(1), ['_ab_or_letters_or_a_to_z']);
  t.deepEqual(alt.terms[0].toArgumentNameList(1), ['_ab']);

  var many = alt.terms[1];
  t.deepEqual(many.toArgumentNameList(1), ['letters']);
  t.deepEqual(many.expr.toArgumentNameList(1), ['letter']);

  var range = alt.terms[2];
  t.deepEqual(range.toArgumentNameList(1), ['a_to_z']);

  var seq = g.ruleBodies.bars;
  t.deepEqual(seq.toArgumentNameList(1), ['letter_or_digit', '_b', 'optFoo', '$4']);
  t.deepEqual(seq.factors[2].toArgumentNameList(1), ['optFoo']);
  t.deepEqual(seq.factors[3].toArgumentNameList(1), ['$1']);

  var plus = g.ruleBodies.plus;
  t.deepEqual(plus.toArgumentNameList(1), ['foo', '$2', 'bars']);

  var opts = g.ruleBodies.MoreOpts;
  t.deepEqual(opts.toArgumentNameList(1), ['opt$1', 'optStart']);

  t.end();
});

test('getExprType', function(t) {
  var g = makeGrammar([
    'G {',
    '  str = listOf<alnum*, ",">',
    '  Str2 = Maybe<"ab">',
    '  Str3 = MaybeTwice<"ab">',
    '  Val = ListOf<String, null>',
    '  Val2 = Maybe<Boolean>',
    '  Val3 = MaybeTwice<Number>',
    '  Maybe<x> = x  -- some',
    '           |    -- none',
    '  MaybeTwice<exp> = Maybe<exp> Maybe<exp>',
    '  nothing = ',
    '  nil = null',
    '  leftRecStr = leftRecStr | str',
    '  leftRecVal = leftRecVal | 3',
    '  leftRecAny = leftRecAny | nothing',
    '}'
  ]);
  function getExprType(ruleName) {
    return g.ruleBodies[ruleName].getExprType(g);
  }
  t.equal(getExprType('str'), pexprs.TYPE_STRING);
  t.equal(getExprType('Str2'), pexprs.TYPE_STRING);
  t.equal(getExprType('Str3'), pexprs.TYPE_STRING);
  t.equal(getExprType('leftRecStr'), pexprs.TYPE_STRING);

  t.equal(getExprType('Val'), pexprs.TYPE_VALUE);
  t.equal(getExprType('Val2'), pexprs.TYPE_VALUE);
  t.equal(getExprType('Val3'), pexprs.TYPE_VALUE);
  t.equal(getExprType('leftRecVal'), pexprs.TYPE_VALUE);

  t.equal(getExprType('nothing'), pexprs.TYPE_ANY);
  t.equal(getExprType('end'), pexprs.TYPE_ANY);
  t.equal(getExprType('any'), pexprs.TYPE_STRING);
  t.equal(getExprType('leftRecAny'), pexprs.TYPE_ANY);

  t.equal(getExprType('String'), pexprs.TYPE_VALUE);
  t.equal(getExprType('Number'), pexprs.TYPE_VALUE);
  t.equal(getExprType('Boolean'), pexprs.TYPE_VALUE);

  t.equal(getExprType('letter'), pexprs.TYPE_STRING, 'letter');
  t.equal(getExprType('nil'), pexprs.TYPE_VALUE, 'null');

  t.throws(function() { ohm.grammar('G2 <: G { x = "a" null }', {G: g}); });
  t.throws(function() { ohm.grammar('G2 <: G { x = Str2 Val2 }', {G: g}); });

  t.end();
});
