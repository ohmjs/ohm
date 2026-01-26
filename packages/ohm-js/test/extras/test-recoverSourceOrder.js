import test from 'ava';
import {recoverSourceOrder} from '../../extras/recoverSourceOrder.js';
import * as ohm from '../../index.mjs';

const g = ohm.grammar(String.raw`
  G {
    start = test1 | test2 | test3 | test4
    test1 = (a b)+ c*
    test2 = (a b)? c? "."
    test3 = ((a b)* c)+
    test4 = (c? (a b*)+)*
    a = "a"
    b = "b"
    c = "c"
  }
`);

test('recoverNodeOrder', t => {
  const semantics = g.createSemantics().addOperation('fix()', {
    start: child => child.fix(),
    _default(...children) {
      return recoverSourceOrder(children)
        .map(c => `${c.ctorName}[${c.source.startIdx}..${c.source.endIdx}]`)
        .join(' ');
    },
  });

  const sig1 = semantics(g.match('abc', 'test1')).fix();
  t.is(sig1, 'a[0..1] b[1..2] c[2..3]');

  let sig2 = semantics(g.match('.', 'test2')).fix();
  t.is(sig2, '_terminal[0..1]');

  sig2 = semantics(g.match('ab.', 'test2')).fix();
  t.is(sig2, 'a[0..1] b[1..2] _terminal[2..3]');

  const sig3 = semantics(g.match('ababcabc', 'test3')).fix();
  t.is(sig3, 'a[0..1] b[1..2] a[2..3] b[3..4] c[4..5] a[5..6] b[6..7] c[7..8]');

  const sig4 = semantics(g.match('abbabab', 'test4')).fix();
  t.is(sig4, 'a[0..1] b[1..2] b[2..3] a[3..4] b[4..5] a[5..6] b[6..7]');
});
