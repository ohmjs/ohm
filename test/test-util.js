'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var util = require('../src/util');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

var getLineAndColumnMessage = util.getLineAndColumnMessage;

test('getLineAndColumnMessage', function(t) {
  t.equal(getLineAndColumnMessage('', 0), [
      'Line 1, col 1:',
      '> 1 | ',
      '      ^',
      ''].join('\n'), 'empty input');

  var expected = [
      'Line 1, col 1:',
      '> 1 | ',
      '      ^',
      '  2 | ',
      ''].join('\n');
  t.equal(getLineAndColumnMessage('\n', 0), expected, 'past last char on empty line');
  t.equal(getLineAndColumnMessage('\r\n', 0), expected, '...and with CRLF, offset at CR');
  t.equal(getLineAndColumnMessage('\r\n', 1), expected, '...and with CRLF, offset at LF');

  expected = [
      'Line 2, col 1:',
      '  1 | a',
      '> 2 | foo',
      '      ^',
      '  3 | ',
      ''].join('\n');
  t.equal(getLineAndColumnMessage('a\nfoo\n', 2), expected, 'char after an empty line');
  t.equal(getLineAndColumnMessage('a\r\nfoo\r\n', 3), expected, '...and with CRLF');

  expected = [
      'Line 2, col 1:',
      '  1 | ',
      '> 2 | ',
      '      ^',
      ''].join('\n');
  t.equal(getLineAndColumnMessage('\n', 1), expected, 'past last char on 2nd empty line');
  t.equal(getLineAndColumnMessage('\r\n', 2), expected, '...and with CRLF');

  expected = [
      'Line 1, col 1:',
      '> 1 | a',
      '      ^',
      '  2 | ',
      ''].join('\n');
  t.equal(getLineAndColumnMessage('a\n\n', 0), expected, 'two trailing empty lines');
  t.equal(getLineAndColumnMessage('a\r\n\r\n', 0), expected, '...and with CRLF');

  var input = new Array(9).join('\n') + 'a\nhi!\nb';
  expected = [
      'Line 10, col 1:',
      '   9 | a',
      '> 10 | hi!',
      '       ^',
      '  11 | b',
      ''].join('\n');
  t.equal(getLineAndColumnMessage(input, 10), expected, 'prev line num has fewer digits');

  input = new Array(99).join('\n') + 'hi!\n';
  expected = [
      'Line 99, col 1:',
      '   98 | ',
      '>  99 | hi!',
      '        ^',
      '  100 | ',
      ''].join('\n');
  t.equal(getLineAndColumnMessage(input, 98), expected, 'next line num has more digits');

  expected = [
    'Line 1, col 1:',
    '> 1 | x',
    '      ^',
    ''].join('\n');
  t.equal(getLineAndColumnMessage('x', 0), expected, 'no next or prev line');

  t.end();
});

test('getLineAndColumnMessage with ranges', function(t) {
  t.equal(getLineAndColumnMessage('3 + 4', 2, [0, 1]), [
    'Line 1, col 3:',
    '> 1 | 3 + 4',
    '      ~ ^',
    ''].join('\n'), 'a simple range');

  t.equal(getLineAndColumnMessage('3 + 4', 2, [0, 1], [4, 5]), [
    'Line 1, col 3:',
    '> 1 | 3 + 4',
    '      ~ ^ ~',
    ''].join('\n'), 'more than one range');

  t.equal(getLineAndColumnMessage('3 + 4', 2, [0, 100]), [
    'Line 1, col 3:',
    '> 1 | 3 + 4',
    '      ~~^~~',
    ''].join('\n'), 'end index out of bounds');

  t.equal(getLineAndColumnMessage('3 + 4', 2, [0, 0]),
          getLineAndColumnMessage('3 + 4', 2),
          'empty range');

  t.equal(getLineAndColumnMessage('3 + 4', 0, [0, 3], [1, 5]), [
    'Line 1, col 1:',
    '> 1 | 3 + 4',
    '      ^~~~~',
    ''].join('\n'), 'overlapping ranges');

  t.equal(getLineAndColumnMessage('blah\n3 + 4', 7, [5, 6]), [
    'Line 2, col 3:',
    '  1 | blah',
    '> 2 | 3 + 4',
    '      ~ ^',
    ''].join('\n'), 'range on second line');

  t.equal(getLineAndColumnMessage('blah\n3 + 4', 7, [0, 6]), [
    'Line 2, col 3:',
    '  1 | blah',
    '> 2 | 3 + 4',
    '      ~ ^',
    ''].join('\n'), 'range crossing lines');

  t.equal(getLineAndColumnMessage('blah\n3 + 4', 7, [0, 50]), [
    'Line 2, col 3:',
    '  1 | blah',
    '> 2 | 3 + 4',
    '      ~~^~~',
    ''].join('\n'), 'range crossing lines at start and end');

  t.end();
});
