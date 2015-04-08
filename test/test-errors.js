// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var ohm = require('..');
var errors = require('../src/errors.js');
var util = require('./util.js');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('non-string input', function(t) {
  var g = util.makeGrammar('G { start = 5 }');
  t.plan(2);
  try {
    g.match(42, 'start', true);
  } catch(e) {
    t.equal(e.displayString, 'match failed at position 0');
    t.equal(e.getPos(), 0);
  }
});

test('basic match failure', function(t) {
  var g = util.makeGrammar('G { start = "a" "b" "c" "d" }');

  t.plan(4);
  try {
    g.match('ab', 'start', true);
  } catch(e) {
    t.equal(e.displayString, [
      'Line 1, col 3:',
      '> | ab',
      '      ^',
      "Expected 'c'"].join('\n'));
    t.equal(e.getPos(), 2);
  };

  try {
    g.match('abcde', 'start', true);
  } catch(e) {
    t.equal(e.displayString, [
      'Line 1, col 5:',
      '> | abcde',
      '        ^',
      'Expected end of input'].join('\n'));
    t.equal(e.getPos(), 4);
  }
});

test('displayString vs. message', function(t) {
  var g = util.makeGrammar([
    'G {',
    '  start = one | two | three',
    '  one = "1" | "eins"',
    '  two = "2"',
    '  three = one',
    '}'
  ]);
  try {
    g.match('x', 'start', true);
  } catch (e) {
    t.equal(e.displayString, [
        'Line 1, col 1:',
        '> | x',
        '    ^',
        "Expected '1', 'eins', or '2'"].join('\n'));
    // `message` contains more information, because it should only be seen by
    // grammar developers.
    t.equal(e.message, [
        'Line 1, col 1:',
        '> | x',
        '    ^',
        "Expected '1' (start > one), 'eins' (start > one), or '2' (start > two)"].join('\n'));
  }
  t.end();
});

test('infinite loops', function(t) {
  function matchExpr(expr, input) {
    var g = util.makeGrammar('G { start = ' + expr + '}');
    return g.match(input, 'start');
  }
  t.throws(function() { matchExpr('("a"*)*', 'aaa') }, errors.InfiniteLoop);
  t.throws(function() { matchExpr('("a"?)*', 'aaa') }, errors.InfiniteLoop);
  t.throws(function() { matchExpr('("a"*)+', 'aaa') }, errors.InfiniteLoop);
  t.throws(function() { matchExpr('("a"?)+', 'aaa') }, errors.InfiniteLoop);

  try {
    matchExpr('("a"*)*', 'aaa');
    t.fail('Expected an exception to be thrown');
  } catch(e) {
    t.equal(e.message, [
      'Line 1, col 4:',
      '> | aaa',
      '       ^',
      'Infinite loop detected when matching \'("a"*)*\''].join('\n'));
  }
  t.end();
});
