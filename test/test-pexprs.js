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
  var g = makeGrammar(
      'G { start = &"a" ~("b" | #c?) "a".."z"  c = "c" }');
  var e = g.ruleBodies.start;
  t.equal(e.toString(), '(&"a" ~("b" | #(c)?) "a".."z")');
  t.end();
});

test('toArgumentNameList', function(t) {
  var g =  makeGrammar([
    'G {',
    ' Start = &((foo bars foo)+)',
    ' foo = "ab" | letter* | "a".."z"',
    ' MoreAlt = "a" "b" | "c" "c" ',
    ' bars = ~"a" (letter "b"| digit "b") foo? "+"',
    ' MoreSeq = &(foo "a" foo) foo "a" foo',
    ' plus = foo "+" bars',
    ' MoreOpts = ("+" Start)?',
    ' ranges = "1".."9" | "!".."@"',
    ' Pair<elem> = "(" elem "," elem ")"',
    ' }'
    ]);

  var iter = g.ruleBodies.Start;
  t.deepEqual(iter.toArgumentNameList(1), ['foo_1s', 'barses', 'foo_2s']);

  var alt = g.ruleBodies.foo;
  t.deepEqual(alt.toArgumentNameList(1), ['_ab_or_letters_or_a_to_z']);
  t.deepEqual(alt.terms[0].toArgumentNameList(1), ['_ab']);

  var moreAlt = g.ruleBodies.MoreAlt;
  t.deepEqual(moreAlt.toArgumentNameList(1), ['_a_or__c', '_b_or__c']);

  var many = alt.terms[1];
  t.deepEqual(many.toArgumentNameList(1), ['letters']);
  t.deepEqual(many.expr.toArgumentNameList(1), ['letter']);

  var range = alt.terms[2];
  t.deepEqual(range.toArgumentNameList(1), ['a_to_z']);

  var seq = g.ruleBodies.bars;
  t.deepEqual(seq.toArgumentNameList(1), ['letter_or_digit', '_b', 'optFoo', '$4']);
  t.deepEqual(seq.factors[2].toArgumentNameList(1), ['optFoo']);
  t.deepEqual(seq.factors[3].toArgumentNameList(1), ['$1']);

  var moreSeq = g.ruleBodies.MoreSeq;
  t.deepEqual(moreSeq.toArgumentNameList(1),
              ['foo_1', '_a_1', 'foo_2', 'foo_3', '_a_2', 'foo_4']);

  var plus = g.ruleBodies.plus;
  t.deepEqual(plus.toArgumentNameList(1), ['foo', '$2', 'bars']);

  var opts = g.ruleBodies.MoreOpts;
  t.deepEqual(opts.toArgumentNameList(1), ['opt$1', 'optStart']);

  var ranges = g.ruleBodies.ranges;
  t.deepEqual(ranges.terms[0].toArgumentNameList(1), ['_1_to_9']);
  t.deepEqual(ranges.terms[1].toArgumentNameList(1), ['$1']);

  var pair = g.ruleBodies.Pair;
  t.deepEqual(pair.toArgumentNameList(1), ['$1', 'param0_1', '$3', 'param0_2', '$5']);
  t.end();
});

test('toFailure', function(t) {
  var g = makeGrammar('G { start = ~("b" | "c") "d" }');
  var r = g.match('b');
  t.equal(r.failed(), true);
  t.equal(typeof r.message, 'string'); // implicitly requires that r.message not throw
  // t.comment(r.message);
  t.ok(/Expected not \(b or c\)/.exec(r.message), 'reasonable failure report for Not-of-Alt');
  t.end();
});
