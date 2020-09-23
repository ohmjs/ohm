'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const fs = require('fs');
const ohm = require('..');
const test = require('tape-catch');
const testUtil = require('./testUtil');

const makeGrammar = testUtil.makeGrammar;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function pluckMemoProp(result, propName) {
  return result.matcher.memoTable.map(info => {
    const result = {};
    if (info == null) return {};
    if (propName === 'examinedLength') {
      result.maxExaminedLength = info.maxExaminedLength;
    } else if (propName === 'rightmostFailureOffset') {
      result.maxRightmostFailureOffset = info.maxRightmostFailureOffset;
    }
    Object.keys(info.memo).forEach(ruleName => {
      const memoRec = info.memo[ruleName];
      result[ruleName] = memoRec[propName];
    });
    return result;
  });
}

const checkOffsetActions = {
  _nonterminal(children) {
    const desc = this._node.ctorName + ' @ ' + this.source.startIdx;
    this.args.t.equal(this.source.startIdx, this.args.startIdx, desc);
    for (let i = 0; i < children.length; ++i) {
      const childStartIdx = this.args.startIdx + this._node.childOffsets[i];
      children[i].checkOffsets(this.args.t, childStartIdx);
    }
  },
  _terminal() {
    const desc = '"' + this.sourceString + '" @ ' + this.source.startIdx;
    this.args.t.equal(this.source.startIdx, this.args.startIdx, desc);
  }
};

const ctorTreeActions = {
  _default(children) {
    return [this.ctorName].concat(children.map(c => c.ctorTree));
  }
};

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic incremental parsing', t => {
  const g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);

  // Create an operation which reconstructs the matched based on the offsets
  // stored for each node. This can be compared to the input stored in the matcher.
  const s = g.createSemantics().addOperation('reconstructInput(input)', {
    start(letters, lastLetter) {
      const lastLetterOffset = this._node.childOffsets[1];
      return letters.reconstructInput(this.args.input) +
          lastLetter.reconstructInput(this.args.input.slice(lastLetterOffset));
    },
    notLastLetter(letter, _) {
      return letter.reconstructInput(this.args.input);
    },
    _iter(children) {
      const self = this;
      return this._node.childOffsets.map((offset, i) => {
        const c = children[i].reconstructInput(self.args.input.slice(offset));
        return c;
      }).join('');
    },
    _terminal() {
      return this.sourceString;
    }
  });

  const im = g.matcher();
  let result;

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

test('trickier incremental parsing', t => {
  const g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | lookahead',
    '        | "a"',
    '  lookahead = &"ac" "a"',
    '}'
  ]);
  const s = g.createSemantics().addAttribute('ctorTree', ctorTreeActions);
  const im = g.matcher();
  let result;

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

test('examinedLength - no LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);
  const result = g.match('yip');
  const values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {maxExaminedLength: 4, letter: 1, lower: 1, notLastLetter: 2, start: 4},
    {maxExaminedLength: 2, letter: 1, lower: 1, notLastLetter: 2},
    {maxExaminedLength: 2, letter: 1, lower: 1, notLastLetter: 2},
    {maxExaminedLength: 1, letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
  ]);

  t.end();
});

test('examinedLength - no LR, but non-monotonic', t => {
  const g = makeGrammar([
    'G {',
    '  start = "a" "b" "c" | letter letter letter',
    '}'
  ]);
  const result = g.match('abd');
  const values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {maxExaminedLength: 3, letter: 1, lower: 1, start: 3},
    {maxExaminedLength: 1, letter: 1, lower: 1},
    {maxExaminedLength: 1, letter: 1, lower: 1}
  ]);

  t.end();
});

test('examinedLength - simple LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | letter',
    '}']);
  const result = g.match('yo');
  t.equal(result.succeeded(), true);

  const values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {maxExaminedLength: 3, letter: 1, lower: 1, start: 3},
    {maxExaminedLength: 1, letter: 1, lower: 1},
    {maxExaminedLength: 1, letter: 1, lower: 1, upper: 1, unicodeLtmo: 1}
  ]);

  t.end();
});

test('examinedLength - complicated LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  const result = g.match('yo');
  t.equal(result.succeeded(), true);

  const values = pluckMemoProp(result, 'examinedLength');
  t.deepEqual(values, [
    {maxExaminedLength: 3, any: 1, foo: 3, start: 3},
    {maxExaminedLength: 1, letter: 1, lower: 1},
    {maxExaminedLength: 1, letter: 1, lower: 1, upper: 1, unicodeLtmo: 1, any: 1, foo: 1}
  ]);

  t.end();
});

test('rightmostFailureOffset - no LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = notLastLetter* letter',
    '  notLastLetter = letter &letter',
    '}'
  ]);
  const result = g.match('yip');
  const values = pluckMemoProp(result, 'rightmostFailureOffset');
  t.deepEqual(values, [
    {maxRightmostFailureOffset: 3, letter: -1, lower: -1, notLastLetter: -1, start: 3},
    {maxRightmostFailureOffset: -1, letter: -1, lower: -1, notLastLetter: -1},
    {maxRightmostFailureOffset: 1, letter: -1, lower: -1, notLastLetter: 1},
    {maxRightmostFailureOffset: 0, letter: 0, lower: 0, upper: 0, unicodeLtmo: 0}
  ]);

  t.end();
});

test('rightmostFailureOffset - simple LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = start letter  -- rec',
    '        | letter',
    '}']);
  const result = g.match('yo');
  t.equal(result.succeeded(), true);

  const values = pluckMemoProp(result, 'rightmostFailureOffset');
  t.deepEqual(values, [
    {maxRightmostFailureOffset: 2, letter: -1, lower: -1, start: 2},
    {maxRightmostFailureOffset: -1, letter: -1, lower: -1},
    {maxRightmostFailureOffset: 0, letter: 0, lower: 0, upper: 0, unicodeLtmo: 0}
  ]);

  t.end();
});

test('rightmostFailureOffset - complicated LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  const result = g.match('yo');
  t.equal(result.succeeded(), true);

  const values = pluckMemoProp(result, 'rightmostFailureOffset');
  t.deepEqual(values, [
    {maxRightmostFailureOffset: 2, any: -1, foo: 2, start: 2},
    {maxRightmostFailureOffset: -1, letter: -1, lower: -1},
    {maxRightmostFailureOffset: 0, letter: 0, lower: 0, upper: 0, unicodeLtmo: 0, any: 0, foo: 0}
  ]);

  t.end();
});

test('matchLength', t => {
  const g = makeGrammar([
    'G {',
    '  start = notLast* any',
    '  notLast = any &any',
    '}'
  ]);
  const result = g.match('woo');
  t.equal(result.succeeded(), true);

  const values = pluckMemoProp(result, 'matchLength');
  t.deepEqual(values, [
    {any: 1, notLast: 1, start: 3},
    {any: 1, notLast: 1},
    {any: 1, notLast: 0},
    {any: 0}
  ]);

  t.end();
});

test('matchLength - complicated LR', t => {
  const g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | any',
    '}']);
  const result = g.match('yo');
  t.equal(result.succeeded(), true);

  const values = pluckMemoProp(result, 'matchLength');
  t.deepEqual(values, [
    {any: 1, foo: 2, start: 2},
    {letter: 1, lower: 1},
    {letter: 0, lower: 0, upper: 0, unicodeLtmo: 0, any: 0, foo: 0}
  ]);

  t.end();
});

test('binding offsets - lexical rules', t => {
  const g = makeGrammar([
    'G {',
    '  start = start foo  -- rec',
    '        | foo',
    '  foo = foo letter  -- rec',
    '      | "oo"',
    '}']);
  let result = g.match('oolong');
  t.equal(result.succeeded(), true);

  const s = g.createSemantics().addOperation('checkOffsets(t, startIdx)', checkOffsetActions);
  s(result).checkOffsets(t, 0);

  result = g.match('oo');
  s(result).checkOffsets(t, 0);

  t.end();
});

test('binding offsets - syntactic rules', t => {
  const g = makeGrammar([
    '    G {',
    '  Start = letter NotLast* any',
    '  NotLast = any &any',
    '}'
  ]);
  let result = g.match('   a 4');
  t.ok(result.succeeded());

  const s = g.createSemantics().addOperation('checkOffsets(t, startIdx)', checkOffsetActions);
  s(result).checkOffsets(t, result._cstOffset);

  result = g.match('a   4 ');
  t.ok(result.succeeded());
  s(result).checkOffsets(t, result._cstOffset);

  t.end();
});

test('incremental parsing + attributes = incremental computation', t => {
  const g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));

  let freshlyEvaluated;
  const s = g.createSemantics().addAttribute('value', {
    addExp_plus(x, _op, y) {
      const ans = x.value + y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    addExp_minus(x, _op, y) {
      const ans = x.value - y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    mulExp_times(x, _op, y) {
      const ans = x.value * y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    mulExp_divide(x, _op, y) {
      const ans = x.value / y.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    priExp_paren(_open, x, _close) {
      const ans = x.value;
      freshlyEvaluated.push(this.sourceString);
      return ans;
    },
    number(_) {
      const ans = parseInt(this.sourceString);
      freshlyEvaluated.push(this.sourceString);
      return ans;
    }
  });

  const m = g.matcher();

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
    '1', // why? because its 'examinedLength' property is 2
    // (you have to read the next character to know that you're done parsing a number)
    // and we changed that character from '+' to '-'
    '1-2',
    '(1-2)',
    '(1-2)*3',
    '(1-2)*3-9']);

  t.end();
});
