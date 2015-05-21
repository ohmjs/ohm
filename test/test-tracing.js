'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var ohm = require('..');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic tracing', function(t) {
  var g = ohm.grammar('G { start = "a" | letter* }');
  var state = g.trace('hallo', 'start');
  var trace = state.trace;

  t.equal(trace.length, 1);
  t.equal(trace[0].displayString, 'start');
  t.equal(trace[0].succeeded, true);
  t.equal(trace[0].pos, 0);

  var alt = trace[0].children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.interval.contents, 'hallo');
  t.equal(many.children.length, 6);

  var childrenSucceeded = many.children.map(function(c) {
    return c.succeeded;
  });
  t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);
  t.end();
});

test('tracing with memoization', function(t) {
  var g = ohm.grammar('G { start = letter ~letter | letter* }');
  var state = g.trace('ab', 'start');
  var trace = state.trace;
  t.equal(trace.length, 1);

  var alt = trace[0].children[0];
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.children.length, 2);

  var many = alt.children[1];
  t.equal(many.children.length, 3);

  // The 'letter*' should succeed, but its first two children should be
  // memoized from the other size of the Alt (letter ~letter). Ensure
  // the the trace is still recorded properly.
  t.equal(many.children[0].succeeded, true);
  t.equal(many.children[0].children.length, 1);
  t.equal(many.children[0].children[0].displayString, '/[a-zA-Z]/');

  t.equal(many.children[1].succeeded, true);
  t.equal(many.children[1].children.length, 1);
  t.equal(many.children[1].children[0].displayString, '/[a-zA-Z]/');
  t.end();
});

test('tracing with left recursion', function(t) {
  var g = ohm.grammar('G { id = id letter -- rec\n    | letter }');
  var state = g.trace('abc', 'id');
  var trace = state.trace;

  var entries = trace[0].children;
  t.ok(trace[0].isLeftRecursive);
  // At the top-level recursive application, there is a loop which grows the
  // left-recursive result. There should be one entry for each iteration of
  // the loop.
  t.equal(entries.length, 4);
  t.equal(entries[0].replacedBy, entries[1]);
  t.equal(entries[1].replacedBy, entries[2]);
  t.equal(entries[3].interval.contents, '', 'last entry is <end>');

  var choice = entries[2];
  t.equal(choice.children.length, 1);

  var recApply = choice.children[0];
  t.equal(recApply.displayString, 'id_rec');
  t.equal(recApply.children.length, 1);

  var seq = recApply.children[0];
  t.equal(seq.interval.contents, 'abc');
  t.equal(seq.children.length, 2);
  t.equal(seq.children[0].displayString, 'id');
  t.equal(seq.children[1].displayString, 'letter');
  t.end();
});

test('toString', function(t) {
  var g = ohm.grammar('G { start = "a" | letter* }');
  var state = g.trace('hi');
  var lines = state.trace[0].toString().split('\n').slice(0, -1);

  var exprs = lines.map(function(l) { return l.split(/\s+/)[2]; });
  t.deepEqual(exprs, [
      'start',
      'a',  // Failed.
      'letter*',
      'letter', '/[a-zA-Z]/',
      'letter', '/[a-zA-Z]/',
      'letter', '/[a-zA-Z]/',  // Failed.
      '[PExpr]'], 'expressions');

  var excerpts = lines.map(function(l) { return l.split(/\s+/)[0]; });
  t.deepEqual(excerpts, ['hi', 'hi', 'hi', 'hi', 'hi', 'i', 'i', '', '', ''], 'excerpts');

  t.end();
});
