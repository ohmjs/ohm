'use strict';

var test = require('tape-catch');

var Interval = require('../src/Interval');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('collapsedLeft', function(t) {
  var interval = new Interval('hello world', 0, 5);
  var collapsed = interval.collapsedLeft();

  // Original interval shouldn't change
  t.equal(interval.startIdx, 0);
  t.equal(interval.endIdx, 5);
  t.equal(interval.sourceString, 'hello world');
  t.equal(interval.contents, 'hello');

  t.equal(collapsed.startIdx, 0);
  t.equal(collapsed.endIdx, 0);
  t.equal(collapsed.sourceString, 'hello world');
  t.equal(collapsed.contents, '');

  t.end();
});

test('collapsedRight', function(t) {
  var interval = new Interval('hello world', 0, 5);
  var collapsed = interval.collapsedRight();

  // Original interval shouldn't change
  t.equal(interval.startIdx, 0);
  t.equal(interval.endIdx, 5);
  t.equal(interval.sourceString, 'hello world');
  t.equal(collapsed.contents, '');

  t.equal(collapsed.startIdx, 5);
  t.equal(collapsed.endIdx, 5);
  t.equal(collapsed.sourceString, 'hello world');
  t.equal(collapsed.contents, '');

  t.end();
});

test('coverage - one interval', function(t) {
  var interval = new Interval('hello world', 0, 5);
  var ans = Interval.coverage(interval);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('two adjacent intervals', function(t) {
  var interval1 = new Interval('hello world', 2, 5);
  var interval2 = new Interval(interval1.sourceString, 0, 2);
  var ans = Interval.coverage(interval1, interval2);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('coverage - two non-adjacent intervals', function(t) {
  var interval1 = new Interval('hello world', 0, 2);
  var interval2 = new Interval(interval1.sourceString, 4, 5);
  var ans = Interval.coverage(interval1, interval2);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('coverage - nested intervals', function(t) {
  var interval1 = new Interval('hello world', 0, 5);
  var interval2 = new Interval(interval1.sourceString, 3, 4);
  var ans = Interval.coverage(interval1, interval2);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('coverage - more intervals', function(t) {
  var interval1 = new Interval('hello world', 0, 2);
  var interval2 = new Interval(interval1.sourceString, 3, 4);
  var interval3 = new Interval(interval1.sourceString, 6, 10);
  var ans = Interval.coverage(interval1, interval2, interval3);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 10);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello worl');

  t.end();
});

test('brotha from anotha motha', function(t) {
  var interval1 = new Interval('abc', 0, 3);
  var interval2 = new Interval('xyz', 1, 2);
  t.throws(
      function() { Interval.coverage(interval1, interval2); },
      /Interval sources don't match/);
  t.end();
});

test('coverageWith', function(t) {
  var interval1 = new Interval('hello world', 0, 2);
  var interval2 = new Interval(interval1.sourceString, 3, 4);
  var interval3 = new Interval(interval1.sourceString, 6, 10);
  var ans = interval1.coverageWith(interval2, interval3);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 10);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello worl');

  t.end();
});
