import test from 'ava';

import * as ohm from '../index.mjs';
import {getCstRoot, grammar as v18Grammar} from '../src/v18.js';

test('independent optionals produce separate OptNodes', t => {
  const g = v18Grammar('G { Start = letter? digit? }');

  // Both absent
  let root = g.match('').getCstRoot();
  t.is(root.children.length, 2);
  t.true(root.children[0].isOptional());
  t.true(root.children[1].isOptional());
  t.true(root.children[0].isEmpty());
  t.true(root.children[1].isEmpty());

  // Both present
  root = g.match('a1').getCstRoot();
  t.true(root.children[0].isPresent());
  t.true(root.children[1].isPresent());

  // First absent, second present
  root = g.match('1').getCstRoot();
  t.true(root.children[0].isEmpty());
  t.true(root.children[1].isPresent());
});

test('lookahead children are skipped in Lex context', t => {
  // Build grammar WITHOUT eliminateLookaheads, so the grammar body
  // contains a Lookahead PExpr with a CST child that should be skipped.
  const g = ohm.grammar('G { Start = #(letter &digit) digit }');
  const r = g.match('a1');
  const root = getCstRoot(r);

  t.is(root.children.length, 2, 'lookahead child should be skipped');
  t.true(root.children[0].isNonterminal());
  t.true(root.children[1].isNonterminal());
});

test('multi-column iter: (a b)* produces ListNode of SeqNodes', t => {
  const g = v18Grammar('G { Start = (letter digit)* }');
  const root = g.match('a1b2').getCstRoot();

  t.is(root.children.length, 1, 'single ListNode for the star');
  const list = root.children[0];
  t.true(list.isList());
  t.is(list.children.length, 2, 'two rows in the list');
  t.true(list.children[0].isSeq(), 'each row is a SeqNode');
  t.true(list.children[1].isSeq());
});

test('alt with different iter structures resolves correctly', t => {
  const g = v18Grammar('G { Start = letter digit+ -- withDigits\n  | digit -- plain }');

  const case1 = g.match('a123').getCstRoot().children[0];
  t.is(case1.ctorName, 'Start_withDigits');
  t.is(case1.children.length, 2);
  t.true(case1.children[0].isNonterminal()); // letter
  t.true(case1.children[1].isList()); // digit+

  const case2 = g.match('1').getCstRoot().children[0];
  t.is(case2.ctorName, 'Start_plain');
  t.is(case2.children.length, 1);
});

test('v18 arity mismatch: seq vs iter of seq', t => {
  t.throws(
    () => v18Grammar('G { Start = (letter digit) | (letter digit)* }'),
    {message: /v18 arity mismatch/}
  );
});

test('v18 arity mismatch via extend', t => {
  const ns = {G: v18Grammar('G { Start = letter digit }')};
  t.throws(
    () => v18Grammar('G2 <: G { Start += (letter digit)* }', ns),
    {message: /v18 arity mismatch/}
  );
});

test('v18 arity consistent: single value vs iter', t => {
  t.notThrows(() => v18Grammar('G { Start = letter | letter* }'));
});

test('extended rule resolves slots through nested Alt', t => {
  const ns = {G: v18Grammar('G { Start = letter digit* }')};
  const g2 = v18Grammar('G2 <: G { Start += digit letter* }', ns);

  const root1 = g2.match('a123').getCstRoot();
  t.is(root1.children.length, 2);
  t.true(root1.children[0].isNonterminal()); // letter
  t.true(root1.children[1].isList()); // digit*

  const root2 = g2.match('1abc').getCstRoot();
  t.is(root2.children.length, 2);
  t.true(root2.children[0].isNonterminal()); // digit
  t.true(root2.children[1].isList()); // letter*
});

test('mixed value and iter children', t => {
  const g = v18Grammar('G { Start = "(" digit* ")" }');
  const root = g.match('(123)').getCstRoot();

  t.is(root.children.length, 3);
  t.true(root.children[0].isTerminal());
  t.true(root.children[1].isList());
  t.true(root.children[2].isTerminal());
  t.is(root.children[1].children.length, 3);
});
