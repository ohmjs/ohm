'use strict';

var ohm = require('..');
var test = require('tape');

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
    'G { start = &"a" ~(2 | 3?) $(b #a) [c {e: b, ...} {g: "a".."z"}]',
    'a = "a"',
    'b = "b"',
    'c = 3',
  '}']);
  var e = g.ruleBodies.start;
  t.equal(e.toString(), '(&"a" ~(2 | 3?) $((b #(a))) [(c {"e": b, ...} {"g": "a".."z"})])');
  t.end();
});

test('isValueExpr', function(t) {
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
    '}'
  ]);
  function isValueExpr(ruleName) {
    return g.ruleBodies[ruleName].isValueExpr(g);
  }
  t.equal(isValueExpr('str'), false);
  t.equal(isValueExpr('Str2'), false);
  t.equal(isValueExpr('Str3'), false);
  t.equal(isValueExpr('Val'), true);
  t.equal(isValueExpr('Val2'), true);
  t.equal(isValueExpr('Val3'), true);
  t.end();
});
