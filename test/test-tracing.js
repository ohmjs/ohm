'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var ohm = require('..');
var common = require('../src/common');
var testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function descendant(traceNode /* ...path */) {
  var path = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < path.length; ++i) {
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

test('basic tracing', function(t) {
  var g = ohm.grammar('G { start = "a" | letter* }');
  var start = g.trace('hallo').children[0];

  t.equal(start.displayString, 'start');
  t.equal(start.succeeded, true);
  t.equal(start.pos, 0);

  var cstNode = start.bindings[0];
  t.equal(cstNode.isNonterminal(), true);
  t.equal(cstNode.numChildren(), 1);
  t.equal(cstNode.ctorName, 'start');

  var alt = start.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  var altCSTNode = alt.bindings[0];
  t.equal(altCSTNode.isIteration(), true);
  t.equal(altCSTNode.numChildren(), 5);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.source.contents, 'hallo');
  t.equal(many.children.length, 6);

  var manyCSTNode = many.bindings[0];
  t.equal(manyCSTNode, altCSTNode);

  var childrenSucceeded = many.children.map(function(c) {
    return c.succeeded;
  });
  t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);

  var cstChildrenName = manyCSTNode.children.map(function(c) {
    return c.ctorName === 'letter';
  });
  t.deepEqual(cstChildrenName, [true, true, true, true, true]);
  t.end();
});

test('space skipping', function(t) {
  var g = ohm.grammar('G { Start = "a"  }');
  var trace = g.trace('a');

  t.deepEqual(trace.children.map(displayString), ['spaces', 'Start', 'spaces', 'end']);
  var start = trace.children[1];
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
  var fooAppl = start.children[1];
  t.deepEqual(fooAppl.children.map(displayString),
              ['"a" "b"'], 'no spaces under lexical rule appl');
  t.end();
});

test('tracing with parameterized rules', function(t) {
  var g = ohm.grammar('G { start = foo<"123">  foo<x> = "a" | letter* }');
  var start = g.trace('hallo').children[0];

  t.equal(start.displayString, 'start');
  t.equal(start.succeeded, true);
  t.equal(start.pos, 0);

  var cstNode = start.bindings[0];
  t.equal(cstNode.ctorName, 'start');
  t.equal(cstNode.numChildren(), 1);

  var app = start.children[0];
  t.equal(app.displayString, 'foo<"123">');
  t.equal(app.succeeded, true);
  t.equal(app.children.length, 1);
  t.equal(app.children[0].succeeded, true);

  cstNode = app.bindings[0];
  t.equal(cstNode.ctorName, 'foo');
  t.equal(cstNode.numChildren(), 1);

  var alt = app.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  cstNode = alt.bindings[0];
  t.equal(cstNode.isIteration(), true);
  t.equal(cstNode.numChildren(), 5);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.source.contents, 'hallo');
  t.equal(many.children.length, 6);

  cstNode = many.bindings[0];
  t.equal(cstNode.ctorName, '_iter');
  t.equal(cstNode.numChildren(), 5);

  t.deepEqual(many.children.map(succeeded), [true, true, true, true, true, false]);

  var cstChildrenName = cstNode.children.map(function(c) { return c.ctorName === 'letter'; });
  t.deepEqual(cstChildrenName, [true, true, true, true, true]);

  t.end();
});

test('tracing with memoization', function(t) {
  var g = ohm.grammar('G { Start = letter ~letter | letter* }');
  var start = g.trace(' aB').children[1];

  t.deepEqual(start.children.map(displayString), ['letter ~letter | letter*']);

  var alt = start.children[0];
  t.deepEqual(alt.children.map(displayString), ['letter ~letter', 'letter*']);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.bindings[0].isIteration(), true);

  var star = alt.children[1];
  t.equal(star.bindings[0].isIteration(), true);
  t.deepEqual(star.children.map(displayString),
              ['spaces', 'letter', 'spaces', 'letter', 'spaces', 'letter']);

  // The 'letter*' should succeed, and its 'letter' children should be
  // memoized from the other size of the Alt (letter ~letter). Ensure
  // the the trace is still recorded properly.
  t.deepEqual(star.children.map(succeeded), [true, true, true, true, true, false]);

  var cstNode = star.children[1].bindings[0];
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

test('tracing with parameterized rules and memoization', function(t) {
  var g = ohm.grammar('G { start = foo<"123"> ~foo<"123"> | foo<"123">*  foo<x> = letter }');
  var start = g.trace('aB').children[0];

  var alt = start.children[0];
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.children.length, 2);

  var many = alt.children[1];
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

test('tracing with left recursion', function(t) {
  var g = ohm.grammar('G { id = id letter -- rec\n    | letter }');
  var id = g.trace('abc').children[0];

  t.equal(id.isHeadOfLeftRecursion, true);

  // For successful left recursion, there is an extra entry holding the trace for the
  // last iteration of the loop, which failed to grow the seed result.
  var terminatingEntry = id.terminatingLREntry;
  t.ok(terminatingEntry, 'has an entry for the last iteration of the growSeedResult loop');
  t.equal(terminatingEntry.expr, id.expr, 'it is for the same expression');
  t.equal(terminatingEntry.succeeded, false, 'but marked as a failure');
  t.equal(terminatingEntry.isHeadOfLeftRecursion, false);
  t.equal(terminatingEntry.pos, id.pos);
  t.ok(terminatingEntry.source.length <= id.source.length, 'its source interval is not longer');

  t.equal(id.children.length, 1, 'has a single child');

  var choice = id.children[0];
  t.equal(choice.children.length, 1);

  var recApply = choice.children[0];
  t.equal(recApply.displayString, 'id_rec');
  t.equal(recApply.children.length, 1);

  var cstNode = recApply.bindings[0];
  t.equal(cstNode.ctorName, 'id_rec');
  t.equal(cstNode.numChildren(), 2);

  var seq = recApply.children[0];
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

test('tracing with left recursion and leading space', function(t) {
  var g = testUtil.makeGrammar([
    'G {',
    '  Foo = Foo "x"  -- x',
    '      | Foo "y" -- y',
    '      | "z"',
    '}'
  ]);
  var foo = g.trace(' zy').children[1];  // First child is 'spaces'.
  t.equal(foo.isHeadOfLeftRecursion, true);
  t.equal(foo.children.length, 1);

  var alt = foo.children[0];
  t.deepEqual(alt.children.map(displayString), ['spaces', 'Foo_x', 'spaces', 'Foo_y']);
  t.deepEqual(alt.children.map(succeeded), [true, false, true, true]);

  var seq = onlyChild(alt.children[3]);
  t.deepEqual(seq.children.map(displayString), ['spaces', 'Foo', 'spaces', '"y"']);

  var applyFoo = seq.children[1];

  alt = onlyChild(applyFoo);
  t.deepEqual(alt.children.map(displayString),
              ['spaces', 'Foo_x', 'spaces', 'Foo_y', 'spaces', '"z"']);
  t.deepEqual(alt.children.map(succeeded), [true, false, true, false, true, true]);
  t.equal(alt.children[5].children.length, 0);

  t.end();
});

test('toString', function(t) {
  var g = ohm.grammar('G { start = "a" | letter* }');
  var lines = g.trace('hi').toString().split('\n').slice(0, -1);

  var exprs = lines.map(function(l) { return l.split(/\s+/)[2]; });
  t.deepEqual(exprs, [
    'start',
    '"a"',  // Failed.
    'letter*',
    'letter', 'lower', 'Unicode',
    'letter', 'lower', 'Unicode',
    'letter', 'lower', 'Unicode',  // Failed.
    'upper', 'Unicode',  // Failed.
    'unicodeLtmo', 'Unicode',  // Failed.
    'end'], 'expressions');

  var excerpts = lines.map(function(l) { return l.split(/\s+/)[0]; });
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

test('toString with left recursion', function(t) {
  var g = ohm.grammar('G { start = start letter  -- rec\n | letter }');
  var lines = g.trace('a').toString().split('\n').slice(0, -1);

  // TODO: Augment the trace with the missing information about growing the seed.
  // We show the initial failure due to left recursion, but not the retry which fails
  // to grow the seed.
  t.deepEqual(lines, [
    'a          ✓ start (LR) ⇒  "a"',
    'a              ✗ start_rec',
    'a                ✗ start letter',
    'a                  ✗ start',  // Left-recursive base case.
    'a              ✓ letter ⇒  "a"',
    'a                  ✓ lower ⇒  "a"',
    'a                    ✓ Unicode [Ll] character ⇒  "a"',
    '           ✓ end ⇒  ""']);

  t.end();
});

test('displayString', function(t) {
  var g = ohm.grammar('G { start = caseInsensitive<"tk"> }');
  var start = g.trace('tK').children[0];

  var app = start.children[0];
  t.equal(app.displayString, 'caseInsensitive<"tk">');

  var caseInsensitive = app.children[0];
  // TODO: Get this working! It should be equal() here.
  t.notEqual(caseInsensitive.displayString, '"tk" (case-insensitive)');

  t.end();
});

// TODO: Get these tests working again for the incremental parser!

test.skip('memoization', function(t) {
  var g = testUtil.makeGrammar([
    'G {',
    '  start = &id id',
    '  id = id alnum  -- rec',
    '     | letter',
    '}'
  ]);
  var start = g.trace('a9').children[0];
  var seq = start.children[0];
  var lookahead = seq.children[0];
  var applyId = lookahead.children[0];
  t.equal(applyId.expr.ruleName, 'id');
  t.equal(applyId.isHeadOfLeftRecursion, true);
  t.equal(applyId.expr.source.startIdx, 15);
  t.equal(applyId.expr.source.endIdx, 17);

  var cstNode = applyId.bindings[0];
  t.equal(cstNode.ctorName, 'id');
  t.equal(cstNode.source.startIdx, 0);
  t.equal(cstNode.source.endIdx, 2);

  var applyId2 = seq.children[1];
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

test.skip('bindings', function(t) {
  var g = ohm.grammar('G { start = "a" "b" | "c" notX\n  notX = ~"x" any }');
  var trace = g.trace('ab');
  t.equal(trace.succeeded, true);
  t.equal(trace.bindings.length, 2, 'top-level Seq has two bindings (start appl + end)');
  t.equal(trace.bindings[0].source.contents, 'ab');

  var start = trace.children[0];
  t.equal(start.displayString, 'start');
  t.equal(start.succeeded, true);
  t.equal(start.bindings.length, 1);

  var alt = start.children[0];
  t.equal(alt.expr.constructor, ohm.pexprs.Alt);
  t.equal(alt.bindings.length, 2, 'alt has two bindings');
  t.equal(alt.bindings[0].source.contents, 'a');
  t.equal(alt.bindings[1].source.contents, 'b');
  t.deepEqual(alt.bindings.map(function(b) { return b.ctorName; }), ['_terminal', '_terminal']);

  trace = g.trace('cd');
  alt = trace.children[0].children[0];
  t.equal(alt.expr.constructor, ohm.pexprs.Alt);
  t.equal(alt.bindings.length, 2, 'alt has two bindings');
  t.equal(alt.bindings[0].source.contents, 'c');
  t.equal(alt.bindings[1].source.contents, 'd');
  t.deepEqual(alt.bindings.map(function(b) { return b.ctorName; }), ['_terminal', 'notX']);

  var notX = alt.children[1];
  t.deepEqual(notX.children.map(succeeded), [true, true], 'both children succeeded');

  t.end();
});
