'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');
var testUtil = require('./testUtil');

var makeGrammar = testUtil.makeGrammar;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function pluckMemoProp(result, propName) {
  return result.state.posInfos.map(function(info) {
    var result = {};
    Object.keys(info.memo).forEach(function(ruleName) {
      var memoRec = info.memo[ruleName];
      result[ruleName] = memoRec[propName];
    });
    return result;
  });
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic incremental parsing', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);
  var im = g.incrementalMatcher();
  im.replace(0, 0, 'helloworld');
  t.equal(im.input, 'helloworld');
  im.replace(3, 5, 'X');
  t.equal(im.input, 'helXworld');
  t.ok(im.match('start').succeeded());
  t.ok(im.match().succeeded());
  t.end();
});

test('examinedLength - no LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);
  var result = g.match('yip');
  var values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {letter: 1, lower: 1, notLastLetter: 2, start: 4},
    {letter: 1, lower: 1, notLastLetter: 2},
    {letter: 1, lower: 1, notLastLetter: 2},
    {letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
  ]);

  t.end();
});

test('examinedLength - simple LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | letter',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {letter: 1, lower: 1, start: 3},
    {letter: 1, lower: 1},
    {letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
  ]);

  t.end();
});

test('examinedLength - complicated LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {any: 1, foo: 3, start: 3},
    {letter: 1, lower: 1},
    {letter: 1, lower: 1, upper: 1, unicodeLtmo: 1, any: 1, foo: 1}
  ]);

  t.end();
});

test('matchLength', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = notLast* any',
    '  notLast = any &any',
    '}'
  ]);
  var result = g.match('woo');
  t.equal(result.succeeded(), true);

  var values = pluckMemoProp(result, 'matchLength');
  t.deepEqual(values, [
    {any: 1, notLast: 1, start: 3},
    {any: 1, notLast: 1},
    {any: 1, notLast: 0},
    {any: 0}
  ]);

  t.end();
});

test('matchLength - complicated LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var values = pluckMemoProp(result, 'matchLength');
  t.deepEqual(values, [
    {any: 1, foo: 2, start: 2},
    {letter: 1, lower: 1},
    {letter: 0, lower: 0, upper: 0, unicodeLtmo: 0, any: 0, foo: 0}
  ]);

  t.end();
});
