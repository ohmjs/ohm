'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var fs = require('fs');
var ohm = require('..');
var test = require('tape-catch');
var testUtil = require('./testUtil');

var makeGrammar = testUtil.makeGrammar;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function pluckMemoProp(result, propName) {
  return result.matcher.memoTable.map(function(info) {
    var result = {};
    if (info == null) return {};
    if (propName === 'examinedLength') {
      result.maxExaminedLength = info.maxExaminedLength;
    } else if (propName === 'rightmostFailureOffset') {
      result.maxRightmostFailureOffset = info.maxRightmostFailureOffset;
    }
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

var ctorTreeActions = {
  _default: function(children) {
    return [this.ctorName].concat(children.map(function(c) { return c.ctorTree; }));
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

  // Create an operation which reconstructs the matched based on the offsets
  // stored for each node. This can be compared to the input stored in the matcher.
  var s = g.createSemantics().addOperation('reconstructInput(input)', {
    start: function(letters, lastLetter) {
      var lastLetterOffset = this._node.childOffsets[1];
      return letters.reconstructInput(this.args.input) +
          lastLetter.reconstructInput(this.args.input.slice(lastLetterOffset));
    },
    notLastLetter: function(letter, _) {
      return letter.reconstructInput(this.args.input);
    },
    _iter: function(children) {
      var self = this;
      return this._node.childOffsets.map(function(offset, i) {
        var c = children[i].reconstructInput(self.args.input.slice(offset));
        return c;
      }).join('');
    },
    _terminal: function() {
      return this.sourceString;
    }
  });

  var im = g.matcher();
  var result;

  im.replaceInputRange(0, 0, 'helloworld');
  t.equal(im.getInput(), 'helloworld');
  im.replaceInputRange(3, 5, 'X');
  t.equal(im.getInput(), 'helXworld');

  result = im.match();
  t.equal(s(result).reconstructInput(im.getInput()), 'helXworld');

  t.ok(im.match('start').succeeded());
  t.ok(im.match().succeeded());
  t.equal(s(result).reconstructInput(im.getInput()), 'helXworld');

  im.replaceInputRange(0, 4, '');
  t.equals(im.getInput(), 'world');

  result = im.match();
  t.equal(s(result).reconstructInput(im.getInput()), 'world');

  im.replaceInputRange(3, 4, ' ');
  t.equals(im.getInput(), 'wor d');
  t.ok(im.match().failed());

  im.replaceInputRange(0, 4, 'aa');
  t.equals(im.getInput(), 'aad');

  result = im.match();
  t.equal(s(result).reconstructInput(im.getInput()), 'aad');

  im.replaceInputRange(1, 2, '9');
  t.ok(im.match().failed());

  t.end();
});

test('trickier incremental parsing', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | lookahead',
    '        | "a"',
    '  lookahead = &"ac" "a"',
    '}'
  ]);
  var s = g.createSemantics().addAttribute('ctorTree', ctorTreeActions);
  var im = g.matcher();
  var result;

  im.replaceInputRange(0, 0, 'ab');
  result = im.match();
  t.ok(result.succeeded());
  t.deepEqual(s(result).ctorTree,
      ['start',
        ['start_rec',
          ['start', ['_terminal']],
          ['letter', ['lower', ['_terminal']]]]]);

  // When the input is 'ac', the lookahead rule should now succeed.
  im.replaceInputRange(1, 2, 'c');
  result = im.match();
  t.ok(result.succeeded());
  t.deepEqual(s(result).ctorTree,
      ['start',
        ['start_rec', ['start', ['lookahead', ['_terminal'], ['_terminal']]],
        ['letter', ['lower', ['_terminal']]]]]);

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
    {maxExaminedLength: 4, letter: 1, lower: 1, notLastLetter: 2, start: 4},
    {maxExaminedLength: 2, letter: 1, lower: 1, notLastLetter: 2},
    {maxExaminedLength: 2, letter: 1, lower: 1, notLastLetter: 2},
    {maxExaminedLength: 1, letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
  ]);

  t.end();
});

test('examinedLength - no LR, but non-monotonic', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = "a" "b" "c" | letter letter letter',
    '}'
  ]);
  var result = g.match('abd');
  var values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {maxExaminedLength: 3, letter: 1, lower: 1, start: 3},
    {maxExaminedLength: 1, letter: 1, lower: 1},
    {maxExaminedLength: 1, letter: 1, lower: 1}
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
    {maxExaminedLength: 3, letter: 1, lower: 1, start: 3},
    {maxExaminedLength: 1, letter: 1, lower: 1},
    {maxExaminedLength: 1, letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
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
    {maxExaminedLength: 3, any: 1, foo: 3, start: 3},
    {maxExaminedLength: 1, letter: 1, lower: 1},
    {maxExaminedLength: 1, letter: 1, lower: 1, upper: 1, unicodeLtmo: 1, any: 1, foo: 1}
  ]);

  t.end();
});

test('rightmostFailureOffset - no LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);
  var result = g.match('yip');
  var values = pluckMemoProp(result, 'rightmostFailureOffset');
  t.deepEqual(values, [
    {maxRightmostFailureOffset: 3, letter: -1, lower: -1, notLastLetter: -1, start: 3},
    {maxRightmostFailureOffset: -1, letter: -1, lower: -1, notLastLetter: -1},
    {maxRightmostFailureOffset: 1, letter: -1, lower: -1, notLastLetter: 1},
    {maxRightmostFailureOffset: 0, letter: 0, lower: 0, upper: 0, unicodeLtmo: 0}
  ]);

  t.end();
});

test('rightmostFailureOffset - simple LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | letter',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var values = pluckMemoProp(result, 'rightmostFailureOffset');
  t.deepEqual(values, [
    {maxRightmostFailureOffset: 2, letter: -1, lower: -1, start: 2},
    {maxRightmostFailureOffset: -1, letter: -1, lower: -1},
    {maxRightmostFailureOffset: 0, letter: 0, lower: 0, upper: 0, unicodeLtmo: 0}
  ]);

  t.end();
});

test('rightmostFailureOffset - complicated LR', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  var result = g.match('yo');
  t.equal(result.succeeded(), true);

  var values = pluckMemoProp(result, 'rightmostFailureOffset');
  t.deepEqual(values, [
    {maxRightmostFailureOffset: 2, any: -1, foo: 2, start: 2},
    {maxRightmostFailureOffset: -1, letter: -1, lower: -1},
    {maxRightmostFailureOffset: 0, letter: 0, lower: 0, upper: 0, unicodeLtmo: 0, any: 0, foo: 0}
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
    '    G {',
    '  Start = letter NotLast* any',
    '  NotLast = any &any',
    '}'
  ]);
  var result = g.match('   a 4');
  t.ok(result.succeeded());

  var s = g.createSemantics().addOperation('checkOffsets(t, startIdx)', checkOffsetActions);
  s(result).checkOffsets(t, result._cstOffset);

  result = g.match('a   4 ');
  t.ok(result.succeeded());
  s(result).checkOffsets(t, result._cstOffset);

  t.end();
});

test('incremental parsing + attributes = incremental computation', function(t) {
  var g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));

  var freshlyEvaluated;
  var s = g.createSemantics().addAttribute('value', {
    addExp_plus: function(x, _op, y) {
      var ans = x.value + y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    addExp_minus: function(x, _op, y) {
      var ans = x.value - y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    mulExp_times: function(x, _op, y) {
      var ans = x.value * y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    mulExp_divide: function(x, _op, y) {
      var ans = x.value / y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    priExp_paren: function(_open, x, _close) {
      var ans = x.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    number: function(_) {
      var ans = parseInt(this.sourceString);
      freshlyEvaluated.push(this.sourceString);
      return ans;
    }
  });

  var m = g.matcher();

  freshlyEvaluated = [];
  m.replaceInputRange(0, 0, '(1+2)*3-4');
  t.equal(s(m.match()).value, 5);
  t.deepEqual(freshlyEvaluated, ['1', '2', '1+2', '(1+2)', '3', '(1+2)*3', '4', '(1+2)*3-4']);

  freshlyEvaluated = [];
  m.replaceInputRange(8, 9, '9');
  t.equal(m.getInput(), '(1+2)*3-9');
  t.equal(s(m.match()).value, 0);
  t.deepEqual(freshlyEvaluated, ['9', '(1+2)*3-9']);

  freshlyEvaluated = [];
  m.replaceInputRange(2, 3, '-');
  t.equal(m.getInput(), '(1-2)*3-9');
  t.equal(s(m.match()).value, -12);
  t.deepEqual(freshlyEvaluated, [
      '1',  // why? because its 'examinedLength' property is 2
            // (you have to read the next character to know that you're done parsing a number)
            // and we changed that character from '+' to '-'
       '1-2',
       '(1-2)',
       '(1-2)*3',
       '(1-2)*3-9']);

  t.end();
});
