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

test('rightmostPos - simple', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);
  var result = g.match('yip');
  var positions = pluckMemoProp(result, 'rightmostPos');
  t.deepEqual(positions, [
    {letter: 1, lower: 1, notLastLetter: 2, start: 4},
    {letter: 1, lower: 1, notLastLetter: 2},
    {letter: 1, lower: 1, notLastLetter: 2},
    {letter: 1, lower: 1, unicodeLtmo: 1, upper: 1} // TODO: Where is `end`?
  ]);

  t.end();
});

test('rightmostPos - left recursion', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | letter',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var positions = pluckMemoProp(result, 'rightmostPos');
  t.deepEqual(positions, [
    {letter: 1, lower: 1, start: 3},
    {letter: 1, lower: 1},
    {letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
  ]);

  t.end();
});

// TODO: Discuss w/ Alex!
test.skip('rightmostPos - complicated left recursion', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var positions = pluckMemoProp(result, 'rightmostPos');
  t.deepEqual(positions, [
    {any: 1, foo: 3, start: 3},
    {any: 1},  // Why isn't there an entry for 'foo' here?
    {any: 1}  // Why is `foo` 0??
  ]);

  t.end();
});
