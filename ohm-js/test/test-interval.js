'use strict';

const test = require('ava');

const Interval = require('../src/Interval');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('collapsedLeft', t => {
  const interval = new Interval('hello world', 0, 5);
  const collapsed = interval.collapsedLeft();

  // Original interval shouldn't change
  t.is(interval.startIdx, 0);
  t.is(interval.endIdx, 5);
  t.is(interval.sourceString, 'hello world');
  t.is(interval.contents, 'hello');

  t.is(collapsed.startIdx, 0);
  t.is(collapsed.endIdx, 0);
  t.is(collapsed.sourceString, 'hello world');
  t.is(collapsed.contents, '');

});

test('collapsedRight', t => {
  const interval = new Interval('hello world', 0, 5);
  const collapsed = interval.collapsedRight();

  // Original interval shouldn't change
  t.is(interval.startIdx, 0);
  t.is(interval.endIdx, 5);
  t.is(interval.sourceString, 'hello world');
  t.is(collapsed.contents, '');

  t.is(collapsed.startIdx, 5);
  t.is(collapsed.endIdx, 5);
  t.is(collapsed.sourceString, 'hello world');
  t.is(collapsed.contents, '');

});

test('coverage - one interval', t => {
  const interval = new Interval('hello world', 0, 5);
  const ans = Interval.coverage(interval);

  t.is(ans.startIdx, 0);
  t.is(ans.endIdx, 5);
  t.is(ans.sourceString, 'hello world');
  t.is(ans.contents, 'hello');

});

test('two adjacent intervals', t => {
  const interval1 = new Interval('hello world', 2, 5);
  const interval2 = new Interval(interval1.sourceString, 0, 2);
  const ans = Interval.coverage(interval1, interval2);

  t.is(ans.startIdx, 0);
  t.is(ans.endIdx, 5);
  t.is(ans.sourceString, 'hello world');
  t.is(ans.contents, 'hello');

});

test('coverage - two non-adjacent intervals', t => {
  const interval1 = new Interval('hello world', 0, 2);
  const interval2 = new Interval(interval1.sourceString, 4, 5);
  const ans = Interval.coverage(interval1, interval2);

  t.is(ans.startIdx, 0);
  t.is(ans.endIdx, 5);
  t.is(ans.sourceString, 'hello world');
  t.is(ans.contents, 'hello');

});

test('coverage - nested intervals', t => {
  const interval1 = new Interval('hello world', 0, 5);
  const interval2 = new Interval(interval1.sourceString, 3, 4);
  const ans = Interval.coverage(interval1, interval2);

  t.is(ans.startIdx, 0);
  t.is(ans.endIdx, 5);
  t.is(ans.sourceString, 'hello world');
  t.is(ans.contents, 'hello');

});

test('coverage - more intervals', t => {
  const interval1 = new Interval('hello world', 0, 2);
  const interval2 = new Interval(interval1.sourceString, 3, 4);
  const interval3 = new Interval(interval1.sourceString, 6, 10);
  const ans = Interval.coverage(interval1, interval2, interval3);

  t.is(ans.startIdx, 0);
  t.is(ans.endIdx, 10);
  t.is(ans.sourceString, 'hello world');
  t.is(ans.contents, 'hello worl');

});

test('brotha from anotha motha', t => {
  const interval1 = new Interval('abc', 0, 3);
  const interval2 = new Interval('xyz', 1, 2);
  t.throws(
      () => { Interval.coverage(interval1, interval2); },
      {message: /Interval sources don't match/});
});

test('coverageWith', t => {
  const interval1 = new Interval('hello world', 0, 2);
  const interval2 = new Interval(interval1.sourceString, 3, 4);
  const interval3 = new Interval(interval1.sourceString, 6, 10);
  const ans = interval1.coverageWith(interval2, interval3);

  t.is(ans.startIdx, 0);
  t.is(ans.endIdx, 10);
  t.is(ans.sourceString, 'hello world');
  t.is(ans.contents, 'hello worl');

});

test('getLineAndColumn', t => {
  const interval = new Interval('blah\n3 + 4', 5, 6);
  const lineInfo = interval.getLineAndColumn();

  t.is(lineInfo.lineNum, 2);
  t.is(lineInfo.colNum, 1);
  t.is(lineInfo.line, '3 + 4');
  t.is(lineInfo.prevLine, 'blah');
  t.is(lineInfo.nextLine, null);
  t.is(lineInfo.toString([7, 8], [9, 10]), [
    'Line 2, col 1:',
    '  1 | blah',
    '> 2 | 3 + 4',
    '      ^ ~ ~',
    ''].join('\n'));

});
