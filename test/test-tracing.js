'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape-catch');

var ohm = require('..');
var common = require('../src/common');

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

  var alt = trace.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.interval.contents, 'hallo');
  t.equal(many.children.length, 6);

  var childrenSucceeded = many.children.map(function(c) {
    return c.succeeded;
  });
  t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);
  t.end();
});

test('space skipping', function(t) {
  var trace = ohm.grammar('G { Start = "a"  }').trace('a');
  t.deepEqual(trace.children.map(displayString), ['spaces_', '"a"', 'spaces_', 'end']);
  t.deepEqual(trace.children[1].children.map(displayString),
              ['spaces_'],
              'primitive node in syntactic rule has spaces_ child');

  trace = ohm.grammar('G { start = "a" }').trace('a');
  t.deepEqual(trace.children.map(displayString), ['"a"', 'end'], 'no spaces_ in lexical context');
  t.equal(trace.children[0].children.length, 0, 'prim node has no children in lexical context');

  trace = ohm.grammar('G { Start = foo\n  foo = "a" "b" }').trace('  ab ');
  t.deepEqual(trace.children.map(displayString), ['spaces_', 'foo', 'spaces_', 'end']);
  var fooAppl = trace.children[1];
  t.deepEqual(fooAppl.children.map(displayString),
              ['spaces_', '"a" "b"'],
              'spaces_ occurs at beginning of a rule application');
  t.deepEqual(fooAppl.children[1].children.map(displayString),
              ['"a"', '"b"'],
              'no spaces_ between childen of a lexical rule');

  t.end();
});

test('tracing with parameterized rules', function(t) {
  var g = ohm.grammar('G { start = foo<123>  foo<x> = "a" | letter* }');
  var trace = g.trace('hallo');

  t.equal(trace.displayString, 'start');
  t.equal(trace.succeeded, true);
  t.equal(trace.pos, 0);

  var app = trace.children[0];
  t.equal(app.displayString, 'foo<123>');
  t.equal(app.succeeded, true);
  t.equal(app.children.length, 1);
  t.equal(app.children[0].succeeded, true);

  var alt = app.children[0];
  t.equal(alt.displayString, '"a" | letter*');
  t.equal(alt.succeeded, true);
  t.equal(alt.children.length, 2);
  t.equal(alt.children[0].succeeded, false);
  t.equal(alt.children[1].succeeded, true);

  var many = alt.children[1];
  t.equal(many.displayString, 'letter*');
  t.equal(many.interval.contents, 'hallo');
  t.equal(many.children.length, 6);

  var childrenSucceeded = many.children.map(function(c) {
    return c.succeeded;
  });
  t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);
  t.end();
});

test('tracing with memoization', function(t) {
  var g = ohm.grammar('G { start = letter ~letter | letter* }');
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
  t.equal(descendant(many, 0, 0, 0, 0).displayString, 'Unicode {Ll} character');

  t.equal(many.children[1].succeeded, true);
  t.equal(many.children[1].children.length, 1);
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

  var seq = recApply.children[0];
  t.equal(seq.interval.contents, 'abc');
  t.equal(seq.children.length, 2);
  t.equal(seq.children[0].displayString, 'id');
  t.equal(seq.children[1].displayString, 'letter');
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
