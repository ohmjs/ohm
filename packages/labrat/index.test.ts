import assert from 'node:assert/strict';
import test from 'node:test';

import {Matcher, RuleApplication, Sequence, Choice, Terminal, Repetition} from './index.ts';

test('basic matcher', () => {
  const m = new Matcher({
    start: new RuleApplication('exp'),
    exp: new Sequence([
      new RuleApplication('var'),
      new Repetition(new Sequence([new RuleApplication('op'), new RuleApplication('var')])),
    ]),
    op: new Choice([new Terminal('+'), new Terminal('-')]),
    var: new Choice([new Terminal('x'), new Terminal('y'), new Terminal('z')]),
  });

  assert.ok(m.match('x'));
  assert.ok(m.match('x-z'));
  assert.ok(m.match('x+y-z'));
  assert.ok(!m.match('x+y-'));
});

test('left recursion', () => {
  const g = new Matcher({
    start: new RuleApplication('mulExp'),
    mulExp: new Choice([
      new Sequence([
        new RuleApplication('mulExp'),
        new Terminal('+'),
        new RuleApplication('priExp'),
      ]),
      new RuleApplication('priExp'),
    ]),
    priExp: new Choice([new Terminal('pi'), new Terminal('x')]),
  });
  assert.ok(g.match('pi+pi+x'));
});

test('left recursion (bad)', () => {
  const g = new Matcher({
    start: new RuleApplication('start'),
  });
  assert.equal(g.match('x'), null);
});
