'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var fs = require('fs');
var test = require('tape-catch');

var ohm = require('..');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function makeRuleWithBody(expr) {
  ohm.grammar('G { start = ' + expr + '}');
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('non-string input', function(t) {
  var g = ohm.grammar('G { start = 5 }');

  var e = g.match(42);
  t.equal(e.failed(), true);
  t.equal(e.message, 'match failed at position 0');
  t.equal(e.getRightmostFailurePosition(), 0);
  t.end();
});

test('match failure', function(t) {
  var g = ohm.grammar('G { start = "a" "b" "c" "d" }');

  var e = g.match('ab');
  t.equal(e.failed(), true);
  t.equal(e.succeeded(), false);
  t.equal(e.message, [
    'Line 1, col 3:',
    '> 1 | ab',
    '        ^',
    'Expected "c"'].join('\n'));
  t.equal(e.shortMessage, 'Line 1, col 3: expected "c"');
  t.equal(e.getRightmostFailurePosition(), 2);

  e = g.match('abcde');
  t.equal(e.failed(), true);
  t.equal(e.succeeded(), false);
  t.equal(e.message, [
    'Line 1, col 5:',
    '> 1 | abcde',
    '          ^',
    'Expected end of input'].join('\n'));
  t.equal(e.shortMessage, 'Line 1, col 5: expected end of input');
  t.equal(e.getRightmostFailurePosition(), 4);

  var m = g.match('abcd');
  t.equal(m.succeeded(), true, 'succeeded() is true for root CST node');
  t.equal(m.failed(), false, 'failed() is false for root CST node');

  t.end();
});

test('undeclared rules', function(t) {
  t.throws(
      function() { makeRuleWithBody('undeclaredRule'); },
      'Rule undeclaredRule is not declared in grammar G');

  t.end();
});

test('many expressions with nullable operands', function(t) {
  t.throws(
      function() { makeRuleWithBody('("a"*)*'); },
      /Nullable expression "a"\* is not allowed inside '\*'/);
  t.throws(
      function() { makeRuleWithBody('("a"?)*'); },
      /Nullable expression "a"\? is not allowed inside '\*'/);
  t.throws(
      function() { makeRuleWithBody('("a"*)+'); },
      /Nullable expression "a"\* is not allowed inside '\+'/);
  t.throws(
      function() { makeRuleWithBody('("a"?)+'); },
      /Nullable expression "a"\? is not allowed inside '\+'/);

  try {
    makeRuleWithBody('("a"?)*');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.equal(e.message, [
      'Line 1, col 14:',
      '> 1 | G { start = ("a"?)*}',
      '                   ^~~~',
      'Nullable expression "a"? is not allowed inside \'*\' (possible infinite loop)'].join('\n'));
  }

  try {
    makeRuleWithBody('("a"?)+');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.equal(e.message, [
      'Line 1, col 14:',
      '> 1 | G { start = ("a"?)+}',
      '                   ^~~~',
      'Nullable expression "a"? is not allowed inside \'+\' (possible infinite loop)'].join('\n'));
  }

  t.throws(
      function() { ohm.grammar('G { x = y+  y = undeclaredRule }'); },
      'Rule * is not declared in grammar G',
      'undeclared rule prevents ManyExprHasNullableOperand check');

  t.end();
});

test('errors from makeGrammar()', function(t) {
  var source = 'G {}\nG2 <: G {}';
  try {
    ohm.grammar(source);
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.equal(e.message, [
      'Line 2, col 1:',
      '  1 | G {}',
      '> 2 | G2 <: G {}',
      '      ^',
      'Found more than one grammar definition -- use ohm.grammars() instead.'].join('\n'));
  }
  t.throws(function() { ohm.grammar(''); }, /Missing grammar/);
  t.throws(function() { ohm.grammar(' \t\n'); }, /Missing grammar/);

  try {
    ohm.grammar('G {');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.equal(e.message, [
      'Line 1, col 4:',
      '> 1 | G {',
      '         ^',
      'Expected "}"'].join('\n'));
  }

  t.end();
});

test('unrecognized escape sequences', function(t) {
  function testBadEscapeSequence(bes) {
    try {
      ohm.grammar('G { start = "hello' + bes + 'world" }');
      t.fail('Expected an exception to be thrown');
    } catch (e) {
      t.equal(e.message, [
        'Line 1, col 19:',
        '> 1 | G { start = "hello' + bes + 'world" }',
        '                        ^',
        'Expected \"\\"\"'].join('\n'));
    }
  }
  testBadEscapeSequence('\\$');
  testBadEscapeSequence('\\!');
  testBadEscapeSequence('\\w');
  t.end();
});

test('failures are memoized', function(t) {
  var g = ohm.grammar(
    'G {\n' +
    '  S = ~A "b"  -- c1\n' +
    '    | A       -- c2\n' +
    '  A = "a"\n' +
    '}');
  var e = g.match('');
  t.equal(e.failed(), true);
  t.equal(e.message, [
    'Line 1, col 1:',
    '> 1 | ',
    '      ^',
    'Expected "a" or "b"'
  ].join('\n'));
  t.end();
});

test('non-fluffy failures subsume fluffy failures, etc.', function(t) {
  var g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  var r = g.match('(1');
  var failures = r.getRightmostFailures();
  t.equal(failures.length, 5);
  t.equal(failures[0].getText(), ')');
  t.equal(failures[0].type, 'string');
  t.equal(failures[1].getText(), '-');
  t.equal(failures[1].type, 'string');
  t.equal(failures[2].getText(), '/');
  t.equal(failures[2].type, 'string');
  t.equal(failures[3].getText(), '*');
  t.equal(failures[3].type, 'string');
  t.equal(failures[4].getText(), '+');
  t.equal(failures[4].type, 'string');
  t.end();
});
