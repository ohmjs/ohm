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
    if (info == null) return {};
    Object.keys(info.memo).forEach(function(ruleName) {
      var memoRec = info.memo[ruleName];
      result[ruleName] = memoRec[propName];
    });
    return result;
  });
}

var checkOffsetActions = {
  _nonterminal: function(children) {
    var desc = this._node.ctorName + ' @ ' + this.source.startIdx;
    this.args.t.equal(this.source.startIdx, this.args.startIdx, desc);
    for (var i = 0; i < children.length; ++i) {
      var childStartIdx = this.args.startIdx + this._node.childOffsets[i];
      children[i].checkOffsets(this.args.t, childStartIdx);
    }
  },
  _terminal: function() {
    var desc = '"' + this.sourceString + '" @ ' + this.source.startIdx;
    this.args.t.equal(this.source.startIdx, this.args.startIdx, desc);
  }
};

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
  t.equal(im.getInput(), 'helloworld');
  im.replace(3, 5, 'X');
  t.ok(im.match().succeeded());

  t.equal(im.getInput(), 'helXworld');
  t.ok(im.match('start').succeeded());
  t.ok(im.match().succeeded());

  im.replace(0, 4, '');
  t.ok(im.match().succeeded());

  im.replace(0, 0, 'aa');
  t.ok(im.match().succeeded());

  im.replace(1, 2, '9');
  t.ok(im.match().failed());

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

test('binding offsets - lexical rules', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | "oo"',
    '}']);
  var result = g.match('oolong');
  t.equal(result.succeeded(), true);

  var s = g.createSemantics().addOperation('checkOffsets(t, startIdx)', checkOffsetActions);
  s(result).checkOffsets(t, 0);

  result = g.match('oo');
  s(result).checkOffsets(t, 0);

  t.end();
});

test('binding offsets - syntactic rules', function(t) {
  var g = makeGrammar([
    'G {',
    '  Start = letter NotLast* any',
    '  NotLast = any &any',
    '}'
  ]);
  var result = g.match('   a 4');
  t.ok(result.succeeded());

  var s = g.createSemantics().addOperation('checkOffsets(t, startIdx)', checkOffsetActions);
  s(result).checkOffsets(t, result._offset);

  result = g.match('a   4 ');
  t.ok(result.succeeded());
  s(result).checkOffsets(t, result._offset);

  t.end();
});
