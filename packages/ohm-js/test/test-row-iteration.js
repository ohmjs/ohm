import fs from 'node:fs';
import {URL} from 'node:url';
import test from 'ava';

import * as ohm from '../index.mjs';
import {SeqNode} from '../src/nodes.js';
import {getCstRoot} from '../src/v18.js'; // patches isList/isSeq onto v17 node prototypes

function enableRowBasedIteration(g) {
  g._matchStateInitializer = state => {
    state._rowBasedIteration = true;
  };
}

// --------------------------------------------------------------------
// Raw CST behavior
// --------------------------------------------------------------------

test('star row mode: (letter digit)* produces SeqNode rows in a ListNode', t => {
  const g = ohm.grammar('G { Start = (letter digit)* }');
  enableRowBasedIteration(g);

  const r = g.match('a1b2');
  t.true(r.succeeded());

  const cst = r._cst;
  t.is(cst.children.length, 1, 'row mode: 1 child (single ListNode)');

  const listNode = cst.children[0];
  t.true(listNode.isList());
  t.is(listNode.ctorName, '_list');
  t.is(listNode.children.length, 2, 'two rows (matches)');

  const row0 = listNode.children[0];
  const row1 = listNode.children[1];
  t.true(row0 instanceof SeqNode, 'row is a SeqNode');
  t.true(row1 instanceof SeqNode, 'row is a SeqNode');

  t.is(row0.children.length, 2);
  t.is(row1.children.length, 2);
  t.is(row0.ctorName, '_seq');
});

test('default (column) mode: multi-arity iter produces multiple IterationNodes', t => {
  const g = ohm.grammar('G { Start = (letter digit)* }');
  // NOT enabling rowBased

  const r = g.match('a1b2');
  t.true(r.succeeded());

  const cst = r._cst;
  t.is(cst.children.length, 2, 'column mode: 2 iter nodes');
  t.true(cst.children[0].isIteration());
  t.true(cst.children[1].isIteration());

  t.is(cst.children[0].children.length, 2);
  t.is(cst.children[1].children.length, 2);
});

// --------------------------------------------------------------------
// Unparse round-trip via v18 CST
// --------------------------------------------------------------------

// Gaps between CST children (implicit space-skipping in syntactic rules)
// must contain only whitespace and/or JavaScript comments.
const WHITESPACE = '\\s';
const SINGLE_LINE_COMMENT = '\\/\\/[^\\n]*(\\n|$)'; // // comment
const MULTI_LINE_COMMENT = '\\/\\*[\\s\\S]*?\\*\\/'; // /* comment */
const SPACE_OR_COMMENT_RE = new RegExp(
  `^(${WHITESPACE}|${SINGLE_LINE_COMMENT}|${MULTI_LINE_COMMENT})+$`
);

// Walk the v18 CST and reconstruct the source text.
// Uses `sourceString` for leaf nodes; for internal nodes, fills gaps
// between children using source positions and asserts they are whitespace/comments.
function unparse(node, input, t) {
  if (!node.children || node.children.length === 0) {
    return node.sourceString;
  }
  let result = '';
  let cursor = node.source.startIdx;
  for (const child of node.children) {
    if (child.source.startIdx > cursor) {
      const gap = input.slice(cursor, child.source.startIdx);
      t.regex(
        gap,
        SPACE_OR_COMMENT_RE,
        `expected whitespace/comment gap, got: ${JSON.stringify(gap)}`
      );
      result += gap;
    }
    result += unparse(child, input, t);
    cursor = child.source.endIdx;
  }
  // Fill trailing gap (e.g. trailing whitespace in syntactic rules).
  const nodeEnd = node.source.endIdx;
  if (nodeEnd > cursor) {
    const gap = input.slice(cursor, nodeEnd);
    t.regex(
      gap,
      SPACE_OR_COMMENT_RE,
      `expected whitespace/comment trailing gap, got: ${JSON.stringify(gap)}`
    );
    result += gap;
  }
  return result;
}

test('row mode: small unparse round-trip', t => {
  const g = ohm.grammar('G { Start = "(" (letter digit)* ")" }');
  enableRowBasedIteration(g);

  const input = '(a1b2)';
  const r = g.match(input);
  t.true(r.succeeded());
  t.is(unparse(getCstRoot(r), input, t), input);
});

test('ES5 grammar: unparse round-trip with row-based mode', async t => {
  const es5 = await import('../../../examples/ecmascript/src/es5.js');
  const g = es5.grammar;

  const input = fs.readFileSync(
    new URL('../../../examples/ecmascript/src/testdata/underscore-1.0.0.js', import.meta.url),
    'utf-8'
  );

  enableRowBasedIteration(g);
  const r = g.match(input);
  t.true(r.succeeded(), 'underscore.js parses in row-based mode');
  const root = getCstRoot(r);
  // The CST root may not cover leading/trailing whitespace (skipped by
  // the syntactic rule's implicit space-skipping and the `end` check).
  const leading = input.slice(0, root.source.startIdx);
  const trailing = input.slice(root.source.endIdx);
  if (leading) t.regex(leading, SPACE_OR_COMMENT_RE, 'leading content is whitespace/comments');
  if (trailing) {
    t.regex(trailing, SPACE_OR_COMMENT_RE, 'trailing content is whitespace/comments');
  }
  const output = leading + unparse(root, input, t) + trailing;
  t.is(output, input, 'row-based CST round-trips');
});

// --------------------------------------------------------------------
// getCstRoot: v18 adapter layer with row-based iteration
// --------------------------------------------------------------------

test('getCstRoot: multi-arity star produces v18 ListNode with SeqNode rows', t => {
  const g = ohm.grammar('G { Start = (letter digit)* }');
  enableRowBasedIteration(g);

  const r = g.match('a1b2');
  const root = getCstRoot(r);

  t.true(root.isNonterminal());
  t.is(root.children.length, 1);

  const list = root.children[0];
  t.true(list.isList());
  t.false(list.isOptional());
  t.is(list.children.length, 2);

  const row0 = list.children[0];
  t.true(row0.isSeq());
  t.is(row0.children.length, 2);
  t.is(row0.sourceString, 'a1');

  const row1 = list.children[1];
  t.true(row1.isSeq());
  t.is(row1.sourceString, 'b2');
});

test('getCstRoot: multi-arity opt present produces v18 OptNode', t => {
  const g = ohm.grammar('G { Start = (letter digit)? }');
  enableRowBasedIteration(g);

  const r = g.match('a1');
  const root = getCstRoot(r);

  const opt = root.children[0];
  t.true(opt.isOptional());
  t.false(opt.isList());
  t.true(opt.isPresent());
  t.false(opt.isEmpty());

  // The child should be a SeqNode since arity > 1
  const child = opt.children[0];
  t.true(child.isSeq());
  t.is(child.children.length, 2);
  t.is(child.sourceString, 'a1');

  // ifPresent should unpack the SeqNode
  const result = opt.ifPresent((a, b) => a.sourceString + '+' + b.sourceString);
  t.is(result, 'a+1');
});

test('getCstRoot: multi-arity opt absent produces empty v18 OptNode', t => {
  const g = ohm.grammar('G { Start = (letter digit)? }');
  enableRowBasedIteration(g);

  const r = g.match('');
  const root = getCstRoot(r);

  const opt = root.children[0];
  t.true(opt.isOptional());
  t.false(opt.isPresent());
  t.true(opt.isEmpty());

  const result = opt.ifPresent(
    () => 'yes',
    () => 'no'
  );
  t.is(result, 'no');
});

test('getCstRoot: collect on ListNode with SeqNode rows', t => {
  const g = ohm.grammar('G { Start = (letter digit)* }');
  enableRowBasedIteration(g);

  const r = g.match('a1b2');
  const root = getCstRoot(r);
  const list = root.children[0];

  const result = list.collect((letter, digit) => letter.sourceString + digit.sourceString);
  t.deepEqual(result, ['a1', 'b2']);
});

test('getCstRoot: source positions are correct', t => {
  const g = ohm.grammar('G { Start = "(" (letter digit)* ")" }');
  enableRowBasedIteration(g);

  const r = g.match('(a1b2)');
  const root = getCstRoot(r);

  t.is(root.sourceString, '(a1b2)');
  t.is(root.children[0].sourceString, '(');
  t.is(root.children[2].sourceString, ')');

  const list = root.children[1];
  t.is(list.sourceString, 'a1b2');

  const row0 = list.children[0];
  t.is(row0.sourceString, 'a1');
  t.is(row0.source.startIdx, 1);
  t.is(row0.source.endIdx, 3);

  const row1 = list.children[1];
  t.is(row1.sourceString, 'b2');
  t.is(row1.source.startIdx, 3);
  t.is(row1.source.endIdx, 5);
});
