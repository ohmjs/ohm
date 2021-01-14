'use strict';

const test = require('tape-catch');

const Interval = require('../src/Interval');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('collapsedLeft', t => {
  const interval = new Interval('hello world', 0, 5);
  const collapsed = interval.collapsedLeft();

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

test('collapsedRight', t => {
  const interval = new Interval('hello world', 0, 5);
  const collapsed = interval.collapsedRight();

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

test('coverage - one interval', t => {
  const interval = new Interval('hello world', 0, 5);
  const ans = Interval.coverage(interval);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('two adjacent intervals', t => {
  const interval1 = new Interval('hello world', 2, 5);
  const interval2 = new Interval(interval1.sourceString, 0, 2);
  const ans = Interval.coverage(interval1, interval2);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('coverage - two non-adjacent intervals', t => {
  const interval1 = new Interval('hello world', 0, 2);
  const interval2 = new Interval(interval1.sourceString, 4, 5);
  const ans = Interval.coverage(interval1, interval2);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('coverage - nested intervals', t => {
  const interval1 = new Interval('hello world', 0, 5);
  const interval2 = new Interval(interval1.sourceString, 3, 4);
  const ans = Interval.coverage(interval1, interval2);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 5);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello');

  t.end();
});

test('coverage - more intervals', t => {
  const interval1 = new Interval('hello world', 0, 2);
  const interval2 = new Interval(interval1.sourceString, 3, 4);
  const interval3 = new Interval(interval1.sourceString, 6, 10);
  const ans = Interval.coverage(interval1, interval2, interval3);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 10);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello worl');

  t.end();
});

test('brotha from anotha motha', t => {
  const interval1 = new Interval('abc', 0, 3);
  const interval2 = new Interval('xyz', 1, 2);
  t.throws(
      () => { Interval.coverage(interval1, interval2); },
      /Interval sources don't match/);
  t.end();
});

test('coverageWith', t => {
  const interval1 = new Interval('hello world', 0, 2);
  const interval2 = new Interval(interval1.sourceString, 3, 4);
  const interval3 = new Interval(interval1.sourceString, 6, 10);
  const ans = interval1.coverageWith(interval2, interval3);

  t.equal(ans.startIdx, 0);
  t.equal(ans.endIdx, 10);
  t.equal(ans.sourceString, 'hello world');
  t.equal(ans.contents, 'hello worl');

  t.end();
});

test('getLineAndColumn', t => {
  const interval = new Interval('blah\n3 + 4', 5, 6);
  const lineInfo = interval.getLineAndColumn();

  t.equal(lineInfo.lineNum, 2);
  t.equal(lineInfo.colNum, 1);
  t.equal(lineInfo.line, '3 + 4');
  t.equal(lineInfo.prevLine, 'blah');
  t.equal(lineInfo.nextLine, null);
  t.equal(lineInfo.toString([7, 8], [9, 10]), [
    'Line 2, col 1:',
    '  1 | blah',
    '> 2 | 3 + 4',
    '      ^ ~ ~',
    ''].join('\n'));

  t.end();
});
