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

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic tracing', function(t) {
  var g = ohm.grammar('G { start = "a" | letter* }');
  var trace = g.trace('hallo');

  t.equal(trace.displayString, 'start');
  t.equal(trace.succeeded, true);
  t.equal(trace.pos, 0);

  var cstNode = trace.cstNode;
  t.equal(cstNode.isNonterminal(), true);
  t.equal(cstNode.numChildren(), 1);
  t.equal(cstNode.ctorName, 'start');

  var alt = trace.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  var altCSTNode = alt.cstNode;
  t.equal(altCSTNode.isIteration(), true);
  t.equal(altCSTNode.numChildren(), 5);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.interval.contents, 'hallo');
  t.equal(many.children.length, 6);

  var manyCSTNode = many.cstNode;
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
  var trace = ohm.grammar('G { Start = "a"  }').trace('a');
  t.deepEqual(trace.children.map(displayString), ['spaces', '"a"', 'spaces', 'end']);
  t.deepEqual(trace.children[1].children.map(displayString),
              ['spaces'],
              'primitive node in syntactic rule has spaces child');

  trace = ohm.grammar('G { start = "a" }').trace('a');
  t.deepEqual(trace.children.map(displayString), ['"a"', 'end'], 'no spaces in lexical context');
  t.equal(trace.children[0].children.length, 0, 'prim node has no children in lexical context');

  trace = ohm.grammar('G { Start = foo\n  foo = "a" "b" }').trace('  ab ');
  t.deepEqual(trace.children.map(displayString), ['spaces', 'foo', 'spaces', 'end']);
  var fooAppl = trace.children[1];
  t.deepEqual(fooAppl.children.map(displayString),
              ['spaces', '"a" "b"'],
              'spaces occurs at beginning of a rule application');
  t.deepEqual(fooAppl.children[1].children.map(displayString),
              ['"a"', '"b"'],
              'no spaces between childen of a lexical rule');

  t.end();
});

test('tracing with parameterized rules', function(t) {
  var g = ohm.grammar('G { start = foo<123>  foo<x> = "a" | letter* }');
  var trace = g.trace('hallo');

  t.equal(trace.displayString, 'start');
  t.equal(trace.succeeded, true);
  t.equal(trace.pos, 0);
  t.equal(trace.cstNode.ctorName, 'start');
  t.equal(trace.cstNode.numChildren(), 1);

  var app = trace.children[0];
  t.equal(app.displayString, 'foo<123>');
  t.equal(app.succeeded, true);
  t.equal(app.children.length, 1);
  t.equal(app.children[0].succeeded, true);
  t.equal(app.cstNode.ctorName, 'foo');
  t.equal(app.cstNode.numChildren(), 1);

  var alt = app.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.cstNode.isIteration(), true);
  t.equal(alt.cstNode.numChildren(), 5);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.interval.contents, 'hallo');
  t.equal(many.children.length, 6);
  t.equal(many.cstNode.ctorName, '_iter');
  t.equal(many.cstNode.numChildren(), 5);

  var childrenSucceeded = many.children.map(function(c) {
    return c.succeeded;
  });
  t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);

  var cstChildrenName = many.cstNode.children.map(function(c) {
    return c.ctorName === 'letter';
  });
  t.deepEqual(cstChildrenName, [true, true, true, true, true]);
  t.end();
});

test('tracing with memoization', function(t) {
  var g = ohm.grammar('G { start = letter ~letter | letter* }');
  var trace = g.trace('aB');

  var alt = trace.children[0];
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.cstNode.isIteration(), true);

  var many = alt.children[1];
  t.equal(many.children.length, 3);
  t.equal(many.cstNode.isIteration(), true);

  // The 'letter*' should succeed, but its first two children should be
  // memoized from the other size of the Alt (letter ~letter). Ensure
  // the the trace is still recorded properly.
  t.equal(many.children[0].succeeded, true);
  t.equal(many.children[0].children.length, 1);
  t.equal(many.children[0].cstNode.ctorName, 'letter');
  t.equal(many.children[0].cstNode.numChildren(), 1);

  t.equal(descendant(many, 0, 0).children.length, 1);
  t.equal(descendant(many, 0, 0, 0).children.length, 1);
  t.equal(descendant(many, 0, 0, 0, 0).displayString, 'Unicode {Ll} character');

  t.equal(many.children[1].succeeded, true);
  t.equal(many.children[1].children.length, 1);
  t.equal(many.children[1].cstNode.ctorName, 'letter');
  t.equal(many.children[1].cstNode.numChildren(), 1);
  t.equal(descendant(many, 1, 0).children.length, 2);
  t.equal(descendant(many, 1, 0, 0).children.length, 1);
  t.equal(descendant(many, 1, 0, 0, 0).displayString, 'Unicode {Ll} character');
  t.equal(descendant(many, 1, 0, 1).children.length, 1);
  t.equal(descendant(many, 1, 0, 1, 0).displayString, 'Unicode {Lu} character');
  t.end();
});

test('tracing with parameterized rules and memoization', function(t) {
  var g = ohm.grammar('G { start = foo<123> ~foo<123> | foo<123>*  foo<x> = letter }');
  var trace = g.trace('aB');

  var alt = trace.children[0];
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
  t.equal(descendant(many, 0, 0, 0, 0, 0).displayString, 'Unicode {Ll} character');

  t.equal(many.children[1].succeeded, true);
  t.equal(many.children[1].children.length, 1);
  t.equal(descendant(many, 1, 0).children.length, 1);
  t.equal(descendant(many, 1, 0, 0).children.length, 2);
  t.equal(descendant(many, 1, 0, 0, 0).children.length, 1);
  t.equal(descendant(many, 1, 0, 0, 0, 0).displayString, 'Unicode {Ll} character');
  t.equal(descendant(many, 1, 0, 0, 1).children.length, 1);
  t.equal(descendant(many, 1, 0, 0, 1, 0).displayString, 'Unicode {Lu} character');
  t.end();
});

test('tracing with left recursion', function(t) {
  var g = ohm.grammar('G { id = id letter -- rec\n    | letter }');
  var trace = g.trace('abc');

  var children = trace.children;
  t.ok(trace.isLeftRecursive);
  // At the top-level recursive application, there is a loop which grows the
  // left-recursive result. There should be one entry for each iteration of
  // the loop.
  t.equal(children.length, 4);
  t.equal(children[0].replacedBy, children[1]);
  t.equal(children[1].replacedBy, children[2]);
  t.equal(children[3].interval.contents, '', 'last entry is <end>');

  var choice = children[2];
  t.equal(choice.children.length, 1);

  var recApply = choice.children[0];
  t.equal(recApply.displayString, 'id_rec');
  t.equal(recApply.children.length, 1);
  t.equal(recApply.cstNode.ctorName, 'id_rec');
  t.equal(recApply.cstNode.numChildren(), 2);

  var seq = recApply.children[0];
  t.equal(seq.interval.contents, 'abc');
  t.equal(seq.children.length, 2);
  t.equal(seq.children[0].displayString, 'id');
  t.equal(seq.children[1].displayString, 'letter');
  t.equal(seq.children[0].cstNode.ctorName, 'id');
  t.equal(seq.children[0].cstNode.numChildren(), 1);
  t.equal(seq.children[0].children[0].cstNode.ctorName, 'id_rec');
  t.equal(seq.children[0].children[0].cstNode.numChildren(), 2);

  trace = g.trace('a');
  t.ok(trace.isLeftRecursive);
  t.equal(trace.children.length, 2);

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

test('memoization', function(t) {
  var g = testUtil.makeGrammar([
    'G {',
    '  start = &id id',
    '  id = id alnum  -- rec',
    '     | letter',
    '}'
  ]);
  var trace = g.trace('a9');
  var seq = trace.children[0];
  var lookahead = seq.children[0];
  var applyId = lookahead.children[0];
  t.equal(applyId.expr.ruleName, 'id');
  t.equal(applyId.isLeftRecursive, true);
  t.equal(applyId.expr.interval.startIdx, 15);
  t.equal(applyId.expr.interval.endIdx, 17);
  t.equal(applyId.cstNode.ctorName, 'id');
  t.equal(applyId.cstNode.interval.startIdx, 0);
  t.equal(applyId.cstNode.interval.endIdx, 2);

  var applyId2 = seq.children[1];
  t.equal(applyId2.expr.ruleName, 'id');
  t.equal(applyId2.isLeftRecursive, true);
  t.equal(applyId2.expr.interval.startIdx, 18);
  t.equal(applyId2.expr.interval.endIdx, 20);
  t.equal(applyId2.cstNode.ctorName, 'id');
  t.equal(applyId2.cstNode.interval.startIdx, 0);
  t.equal(applyId2.cstNode.interval.endIdx, 2);

  t.equal(applyId.pos, 0);
  t.equal(applyId2.pos, 0);
  t.ok(applyId.succeeded);
  t.ok(applyId2.succeeded);

  t.end();
});
