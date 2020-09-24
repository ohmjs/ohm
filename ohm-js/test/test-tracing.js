'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const test = require('tape-catch');

const ohm = require('..');
const common = require('../src/common');
const testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function descendant(traceNode /* ...path */) {
  const path = Array.prototype.slice.call(arguments, 1);
  for (let i = 0; i < path.length; ++i) {
    traceNode = traceNode.children[path[i]];
  }
  return traceNode;
}

function displayString(traceNode) {
  return traceNode.displayString;
}

function succeeded(traceNode) {
  return traceNode.succeeded;
}

function onlyChild(traceNode) {
  common.assert(traceNode.children.length === 1, 'expected only 1 child');
  return traceNode.children[0];
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic tracing', t => {
  const g = ohm.grammar('G { start = "a" | letter* }');
  const start = g.trace('hallo').children[0];

  t.equal(start.displayString, 'start');
  t.equal(start.succeeded, true);
  t.equal(start.pos, 0);

  const cstNode = start.bindings[0];
  t.equal(cstNode.isNonterminal(), true);
  t.equal(cstNode.numChildren(), 1);
  t.equal(cstNode.ctorName, 'start');

  const alt = start.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  const altCSTNode = alt.bindings[0];
  t.equal(altCSTNode.isIteration(), true);
  t.equal(altCSTNode.numChildren(), 5);

  const many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.source.contents, 'hallo');
  t.equal(many.children.length, 6);

  const manyCSTNode = many.bindings[0];
  t.equal(manyCSTNode, altCSTNode);

  const childrenSucceeded = many.children.map(c => c.succeeded);
  t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);

  const cstChildrenName = manyCSTNode.children.map(c => c.ctorName === 'letter');
  t.deepEqual(cstChildrenName, [true, true, true, true, true]);
  t.end();
});

test('space skipping', t => {
  const g = ohm.grammar('G { Start = "a"  }');
  let trace = g.trace('a');

  t.deepEqual(trace.children.map(displayString), ['spaces', 'Start', 'spaces', 'end']);
  let start = trace.children[1];
  t.deepEqual(start.children.map(displayString), ['spaces', '"a"']);
  t.equal(start.children[1].children.length, 0, 'primitive node has no children');

  trace = ohm.grammar('G { start = "a" }').trace('a');
  t.deepEqual(trace.children.map(displayString), ['start', 'end']);
  start = trace.children[0];
  t.deepEqual(start.children.map(displayString), ['"a"'], 'no spaces in lexical context');
  t.equal(start.children[0].children.length, 0, 'prim node has no children in lexical context');

  trace = ohm.grammar('G { Start = foo\n  foo = "a" "b" }').trace('  ab ');
  t.deepEqual(trace.children.map(displayString), ['spaces', 'Start', 'spaces', 'end']);

  start = trace.children[1];
  t.deepEqual(start.children.map(displayString), ['spaces', 'foo']);
  const fooAppl = start.children[1];
  t.deepEqual(fooAppl.children.map(displayString),
      ['"a" "b"'], 'no spaces under lexical rule appl');
  t.end();
});

test('tracing with parameterized rules', t => {
  const g = ohm.grammar('G { start = foo<"123">  foo<x> = "a" | letter* }');
  const start = g.trace('hallo').children[0];

  t.equal(start.displayString, 'start');
  t.equal(start.succeeded, true);
  t.equal(start.pos, 0);

  let cstNode = start.bindings[0];
  t.equal(cstNode.ctorName, 'start');
  t.equal(cstNode.numChildren(), 1);

  const app = start.children[0];
  t.equal(app.displayString, 'foo<"123">');
  t.equal(app.succeeded, true);
  t.equal(app.children.length, 1);
  t.equal(app.children[0].succeeded, true);

  cstNode = app.bindings[0];
  t.equal(cstNode.ctorName, 'foo');
  t.equal(cstNode.numChildren(), 1);

  const alt = app.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  cstNode = alt.bindings[0];
  t.equal(cstNode.isIteration(), true);
  t.equal(cstNode.numChildren(), 5);

  const many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.source.contents, 'hallo');
  t.equal(many.children.length, 6);

  cstNode = many.bindings[0];
  t.equal(cstNode.ctorName, '_iter');
  t.equal(cstNode.numChildren(), 5);

  t.deepEqual(many.children.map(succeeded), [true, true, true, true, true, false]);

  const cstChildrenName = cstNode.children.map(c => c.ctorName === 'letter');
  t.deepEqual(cstChildrenName, [true, true, true, true, true]);

  t.end();
});

test('tracing with memoization', t => {
  const g = ohm.grammar('G { Start = letter ~letter | letter* }');
  const start = g.trace(' aB').children[1];

  t.deepEqual(start.children.map(displayString), ['letter ~letter | letter*']);

  const alt = start.children[0];
  t.deepEqual(alt.children.map(displayString), ['letter ~letter', 'letter*']);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.bindings[0].isIteration(), true);

  const star = alt.children[1];
  t.equal(star.bindings[0].isIteration(), true);
  t.deepEqual(star.children.map(displayString),
      ['spaces', 'letter', 'spaces', 'letter', 'spaces', 'letter']);

  // The 'letter*' should succeed, and its 'letter' children should be
  // memoized from the other size of the Alt (letter ~letter). Ensure
  // the the trace is still recorded properly.
  t.deepEqual(star.children.map(succeeded), [true, true, true, true, true, false]);

  const cstNode = star.children[1].bindings[0];
  t.equal(cstNode.ctorName, 'letter');
  t.equal(cstNode.numChildren(), 1);

  t.deepEqual(descendant(star, 1).children.map(displayString),
      ['lower\n    | upper\n    | unicodeLtmo']);
  t.deepEqual(descendant(star, 1, 0).children.map(displayString), ['lower']);
  t.deepEqual(descendant(star, 1, 0, 0).children.map(displayString), ['Unicode [Ll] character']);

  t.deepEqual(descendant(star, 3).children.map(displayString),
      ['lower\n    | upper\n    | unicodeLtmo']);
  t.deepEqual(descendant(star, 3, 0).children.map(displayString), ['lower', 'upper']);
  t.deepEqual(descendant(star, 3, 0, 0).children.map(displayString), ['Unicode [Ll] character']);

  t.end();
});

test('tracing with parameterized rules and memoization', t => {
  const g = ohm.grammar('G { start = foo<"123"> ~foo<"123"> | foo<"123">*  foo<x> = letter }');
  const start = g.trace('aB').children[0];

  const alt = start.children[0];
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.children.length, 2);

  const many = alt.children[1];
  t.equal(many.children.length, 3);

  // The 'letter*' should succeed, but its first two children should be
  // memoized from the other size of the Alt (letter ~letter). Ensure
  // the the trace is still recorded properly.
  t.equal(many.children[0].succeeded, true);
  t.equal(many.children[0].children.length, 1);
  t.equal(descendant(many, 0, 0).children.length, 1);
  t.equal(descendant(many, 0, 0, 0).children.length, 1);
  t.equal(descendant(many, 0, 0, 0, 0).children.length, 1);
  t.equal(descendant(many, 0, 0, 0, 0, 0).displayString, 'Unicode [Ll] character');

  t.equal(many.children[1].succeeded, true);
  t.equal(many.children[1].children.length, 1);
  t.equal(descendant(many, 1, 0).children.length, 1);
  t.equal(descendant(many, 1, 0, 0).children.length, 2);
  t.equal(descendant(many, 1, 0, 0, 0).children.length, 1);
  t.equal(descendant(many, 1, 0, 0, 0, 0).displayString, 'Unicode [Ll] character');
  t.equal(descendant(many, 1, 0, 0, 1).children.length, 1);
  t.equal(descendant(many, 1, 0, 0, 1, 0).displayString, 'Unicode [Lu] character');
  t.end();
});

test('tracing with left recursion', t => {
  const g = ohm.grammar('G { id = id letter -- rec\n    | letter }');
  let id = g.trace('abc').children[0];

  t.equal(id.isHeadOfLeftRecursion, true);

  // For successful left recursion, there is an extra entry holding the trace for the
  // last iteration of the loop, which failed to grow the seed result.
  const terminatingEntry = id.terminatingLREntry;
  t.ok(terminatingEntry, 'has an entry for the last iteration of the growSeedResult loop');
  t.equal(terminatingEntry.expr, id.expr, 'it is for the same expression');
  t.equal(terminatingEntry.succeeded, false, 'but marked as a failure');
  t.equal(terminatingEntry.isHeadOfLeftRecursion, false);
  t.equal(terminatingEntry.pos, id.pos);
  t.ok(terminatingEntry.source.length <= id.source.length, 'its source interval is not longer');

  t.equal(id.children.length, 1, 'has a single child');

  const choice = id.children[0];
  t.equal(choice.children.length, 1);

  const recApply = choice.children[0];
  t.equal(recApply.displayString, 'id_rec');
  t.equal(recApply.children.length, 1);

  let cstNode = recApply.bindings[0];
  t.equal(cstNode.ctorName, 'id_rec');
  t.equal(cstNode.numChildren(), 2);

  const seq = recApply.children[0];
  t.equal(seq.source.contents, 'abc');
  t.equal(seq.children.length, 2);
  t.equal(seq.children[0].displayString, 'id');
  t.equal(seq.children[0].isHeadOfLeftRecursion, false);
  t.equal(seq.children[1].displayString, 'letter');

  cstNode = seq.children[0].bindings[0];
  t.equal(cstNode.ctorName, 'id');
  t.equal(cstNode.numChildren(), 1);

  cstNode = seq.children[0].children[0].bindings[0];
  t.equal(cstNode.ctorName, 'id_rec');
  t.equal(cstNode.numChildren(), 2);

  id = g.trace('a').children[0];
  t.equal(id.isHeadOfLeftRecursion, true);
  t.equal(id.children.length, 1);

  id = g.trace('9').children[0];
  t.equal(id.succeeded, false);
  t.equal(id.isHeadOfLeftRecursion, true, 'failed LR node is still an LR head');
  t.looseEqual(id.terminatingLREntry, null, 'it has no terminatingLREntry');

  t.end();
});

test('tracing with left recursion and leading space', t => {
  const g = testUtil.makeGrammar([
    'G {',
    '  Foo = Foo "x"  -- x',
    '      | Foo "y" -- y',
    '      | "z"',
    '}'
  ]);
  const foo = g.trace(' zy').children[1]; // First child is 'spaces'.
  t.equal(foo.isHeadOfLeftRecursion, true);
  t.equal(foo.children.length, 1);

  let alt = foo.children[0];
  t.deepEqual(alt.children.map(displayString), ['spaces', 'Foo_x', 'spaces', 'Foo_y']);
  t.deepEqual(alt.children.map(succeeded), [true, false, true, true]);

  const seq = onlyChild(alt.children[3]);
  t.deepEqual(seq.children.map(displayString), ['spaces', 'Foo', 'spaces', '"y"']);

  const applyFoo = seq.children[1];

  alt = onlyChild(applyFoo);
  t.deepEqual(alt.children.map(displayString),
      ['spaces', 'Foo_x', 'spaces', 'Foo_y', 'spaces', '"z"']);
  t.deepEqual(alt.children.map(succeeded), [true, false, true, false, true, true]);
  t.equal(alt.children[5].children.length, 0);

  t.end();
});

test('toString', t => {
  let g = ohm.grammar('G { start = "a" | letter* }');
  let lines = g.trace('hi').toString().split('\n').slice(0, -1);

  const exprs = lines.map(l => l.split(/\s+/)[2]);
  t.deepEqual(exprs, [
    'start',
    '"a"', // Failed.
    'letter*',
    'letter', 'lower', 'Unicode',
    'letter', 'lower', 'Unicode',
    'letter', 'lower', 'Unicode', // Failed.
    'upper', 'Unicode', // Failed.
    'unicodeLtmo', 'Unicode', // Failed.
    'end'], 'expressions');

  const excerpts = lines.map(l => l.split(/\s+/)[0]);
  t.deepEqual(
      excerpts,
      common.repeat('hi', 6).concat(common.repeat('i', 3)).concat(common.repeat('', 8)),
      'excerpts');

  // Test that newlines are escaped in the trace output.
  g = ohm.grammar('G { start = space* }');
  lines = g.trace(' ', 'space').toString().split('\n');
  t.equal(lines.length, 4, 'trace is only four lines long');

  lines = g.trace('\n\n', 'space').toString().split('\n');
  t.equal(lines.length, 4, 'trace is still four lines long');
  t.equal(lines[lines.length - 1], '', 'last line is empty');

  t.end();
});

test('toString with left recursion', t => {
  const g = ohm.grammar('G { start = start letter  -- rec\n | letter }');
  const lines = g.trace('a').toString().split('\n').slice(0, -1);

  // TODO: Augment the trace with the missing information about growing the seed.
  // We show the initial failure due to left recursion, but not the retry which fails
  // to grow the seed.
  t.deepEqual(lines, [
    'a          ✓ start (LR) ⇒  "a"',
    'a              ✗ start_rec',
    'a                ✗ start letter',
    'a                  ✗ start', // Left-recursive base case.
    'a              ✓ letter ⇒  "a"',
    'a                  ✓ lower ⇒  "a"',
    'a                    ✓ Unicode [Ll] character ⇒  "a"',
    '           ✓ end ⇒  ""']);

  t.end();
});

test('displayString', t => {
  const g = ohm.grammar('G { start = caseInsensitive<"tk"> }');
  const start = g.trace('tK').children[0];

  const app = start.children[0];
  t.equal(app.displayString, 'caseInsensitive<"tk">');

  const caseInsensitive = app.children[0];
  // TODO: Get this working! It should be equal() here.
  t.notEqual(caseInsensitive.displayString, '"tk" (case-insensitive)');

  t.end();
});

// TODO: Get these tests working again for the incremental parser!

test.skip('memoization', t => {
  const g = testUtil.makeGrammar([
    'G {',
    '  start = &id id',
    '  id = id alnum  -- rec',
    '     | letter',
    '}'
  ]);
  const start = g.trace('a9').children[0];
  const seq = start.children[0];
  const lookahead = seq.children[0];
  const applyId = lookahead.children[0];
  t.equal(applyId.expr.ruleName, 'id');
  t.equal(applyId.isHeadOfLeftRecursion, true);
  t.equal(applyId.expr.source.startIdx, 15);
  t.equal(applyId.expr.source.endIdx, 17);

  let cstNode = applyId.bindings[0];
  t.equal(cstNode.ctorName, 'id');
  t.equal(cstNode.source.startIdx, 0);
  t.equal(cstNode.source.endIdx, 2);

  const applyId2 = seq.children[1];
  t.equal(applyId2.expr.ruleName, 'id');
  t.equal(applyId2.isHeadOfLeftRecursion, true);
  t.equal(applyId2.expr.source.startIdx, 18);
  t.equal(applyId2.expr.source.endIdx, 20);

  cstNode = applyId2.bindings[0];
  t.equal(cstNode.ctorName, 'id');
  t.equal(cstNode.source.startIdx, 0);
  t.equal(cstNode.source.endIdx, 2);

  t.equal(applyId.pos, 0);
  t.equal(applyId2.pos, 0);
  t.ok(applyId.succeeded);
  t.ok(applyId2.succeeded);

  t.end();
});

test.skip('bindings', t => {
  const g = ohm.grammar('G { start = "a" "b" | "c" notX\n  notX = ~"x" any }');
  let trace = g.trace('ab');
  t.equal(trace.succeeded, true);
  t.equal(trace.bindings.length, 2, 'top-level Seq has two bindings (start appl + end)');
  t.equal(trace.bindings[0].source.contents, 'ab');

  const start = trace.children[0];
  t.equal(start.displayString, 'start');
  t.equal(start.succeeded, true);
  t.equal(start.bindings.length, 1);

  let alt = start.children[0];
  t.equal(alt.expr.constructor, ohm.pexprs.Alt);
  t.equal(alt.bindings.length, 2, 'alt has two bindings');
  t.equal(alt.bindings[0].source.contents, 'a');
  t.equal(alt.bindings[1].source.contents, 'b');
  t.deepEqual(alt.bindings.map(b => b.ctorName), ['_terminal', '_terminal']);

  trace = g.trace('cd');
  alt = trace.children[0].children[0];
  t.equal(alt.expr.constructor, ohm.pexprs.Alt);
  t.equal(alt.bindings.length, 2, 'alt has two bindings');
  t.equal(alt.bindings[0].source.contents, 'c');
  t.equal(alt.bindings[1].source.contents, 'd');
  t.deepEqual(alt.bindings.map(b => b.ctorName), ['_terminal', 'notX']);

  const notX = alt.children[1];
  t.deepEqual(notX.children.map(succeeded), [true, true], 'both children succeeded');

  t.end();
});
