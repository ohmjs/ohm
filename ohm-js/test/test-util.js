'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const test = require('ava');
const dedent = require('dedent');

const util = require('../src/util');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

const getLineAndColumn = util.getLineAndColumn;

test('getLineAndColumn().toString()', t => {
  t.is(
      getLineAndColumn('', 0).toString(),
      dedent`
        Line 1, col 1:
        > 1 | 
              ^\n`,
      'empty input'
  );

  t.is(
      getLineAndColumn('3 + 4', 2).toString([0, 1], [4, 5]),
      dedent`
        Line 1, col 3:
        > 1 | 3 + 4
              ~ ^ ~\n`,
      'more than one range'
  );
});

const getLineAndColumnMessage = util.getLineAndColumnMessage;

test('getLineAndColumnMessage', t => {
  t.is(
      getLineAndColumnMessage('', 0),
      dedent`
        Line 1, col 1:
        > 1 | 
              ^\n`,
      'empty input'
  );

  let expected = dedent`
    Line 1, col 1:
    > 1 | 
          ^
      2 | \n`;
  t.is(getLineAndColumnMessage('\n', 0), expected, 'past last char on empty line');
  t.is(getLineAndColumnMessage('\r\n', 0), expected, '...and with CRLF, offset at CR');
  t.is(getLineAndColumnMessage('\r\n', 1), expected, '...and with CRLF, offset at LF');

  expected = dedent`
    Line 2, col 1:
      1 | a
    > 2 | foo
          ^
      3 | \n`;
  t.is(getLineAndColumnMessage('a\nfoo\n', 2), expected, 'char after an empty line');
  t.is(getLineAndColumnMessage('a\r\nfoo\r\n', 3), expected, '...and with CRLF');

  expected = dedent`
    Line 2, col 1:
      1 | 
    > 2 | 
          ^\n`;
  t.is(getLineAndColumnMessage('\n', 1), expected, 'past last char on 2nd empty line');
  t.is(getLineAndColumnMessage('\r\n', 2), expected, '...and with CRLF');

  expected = dedent`
    Line 1, col 1:
    > 1 | a
          ^
      2 | \n`;
  t.is(getLineAndColumnMessage('a\n\n', 0), expected, 'two trailing empty lines');
  t.is(getLineAndColumnMessage('a\r\n\r\n', 0), expected, '...and with CRLF');

  let input = new Array(9).join('\n') + 'a\nhi!\nb';
  expected = dedent`
    Line 10, col 1:
       9 | a
    > 10 | hi!
           ^
      11 | b\n`;
  t.is(getLineAndColumnMessage(input, 10), expected, 'prev line num has fewer digits');

  input = new Array(99).join('\n') + 'hi!\n';
  expected = dedent`
    Line 99, col 1:
       98 | 
    >  99 | hi!
            ^
      100 | \n`;
  t.is(getLineAndColumnMessage(input, 98), expected, 'next line num has more digits');

  expected = dedent`
    Line 1, col 1:
    > 1 | x
          ^\n`;
  t.is(getLineAndColumnMessage('x', 0), expected, 'no next or prev line');
});

test('getLineAndColumnMessage with ranges', t => {
  t.is(
      getLineAndColumnMessage('3 + 4', 2, [0, 1]),
      dedent`
        Line 1, col 3:
        > 1 | 3 + 4
              ~ ^\n`,
      'a simple range'
  );

  t.is(
      getLineAndColumnMessage('3 + 4', 2, [0, 1], [4, 5]),
      dedent`
        Line 1, col 3:
        > 1 | 3 + 4
              ~ ^ ~\n`,
      'more than one range'
  );

  t.is(
      getLineAndColumnMessage('3 + 4', 2, [0, 100]),
      dedent`
        Line 1, col 3:
        > 1 | 3 + 4
              ~~^~~\n`,
      'end index out of bounds'
  );

  t.is(
      getLineAndColumnMessage('3 + 4', 2, [0, 0]),
      getLineAndColumnMessage('3 + 4', 2),
      'empty range'
  );

  t.is(
      getLineAndColumnMessage('3 + 4', 0, [0, 3], [1, 5]),
      dedent`
        Line 1, col 1:
        > 1 | 3 + 4
              ^~~~~\n`,
      'overlapping ranges'
  );

  t.is(
      getLineAndColumnMessage('blah\n3 + 4', 7, [5, 6]),
      dedent`
        Line 2, col 3:
          1 | blah
        > 2 | 3 + 4
              ~ ^\n`,
      'range on second line'
  );

  t.is(
      getLineAndColumnMessage('blah\n3 + 4', 7, [0, 6]),
      dedent`
        Line 2, col 3:
          1 | blah
        > 2 | 3 + 4
              ~ ^\n`,
      'range crossing lines'
  );

  t.is(
      getLineAndColumnMessage('blah\n3 + 4', 7, [0, 50]),
      dedent`
        Line 2, col 3:
          1 | blah
        > 2 | 3 + 4
              ~~^~~\n`,
      'range crossing lines at start and end'
  );
});
