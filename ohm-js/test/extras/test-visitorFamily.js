'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape');
var VisitorFamily = require('../../extras/VisitorFamily');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function noop0() {}
function noop1(a) {}

var arr1 = ['a'];
var arr2 = ['a', 'b'];

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic', function(t) {
  var family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: ['l', 'r']
    },
    getTag: function(x) { return typeof x === 'string' ? 'leaf' : 'tree'; }
  });

  family.addOperation('visit()', {
    leaf: function() {
      return this._adaptee;
    },
    tree: function(left, right) {
      return left.visit() + ' ' + right.visit();
    }
  });

  var tree = {l: 'one', r: {l: 'two', r: 'three'}};
  t.equal(family.wrap(tree).visit(), 'one two three');

  t.end();
});

test('array props', function(t) {
  var family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: 'children[]'
    },
    getTag: function(x) { return typeof x === 'string' ? 'leaf' : 'tree'; }
  });
  family.addOperation('visit()', {
    leaf: function() { return this._adaptee; },
    tree: function(children) { return children.map(function(c) { return c.visit(); }); }
  });
  var tree = {children: ['a', {children: ['b', 'c']}, 'd']};
  t.deepEqual(family.wrap(tree).visit(), ['a', ['b', 'c'], 'd']);

  family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: ['children[]', 'extra']
    },
    getTag: function(x) { return typeof x === 'string' ? 'leaf' : 'tree'; }
  });
  family.addOperation('visit()', {
    leaf: function() { return this._adaptee; },
    tree: function(children, extra) {
      return children.map(function(c) { return c.visit(); }).concat(extra.visit());
    }
  });
  tree = {children: ['a', {children: ['b', 'c'], extra: 'd'}], extra: 'e'};
  t.deepEqual(family.wrap(tree).visit(), ['a', ['b', 'c', 'd'], 'e']);

  t.end();
});

test('arity checks', function(t) {
  var family = new VisitorFamily({shapes: {x: arr1, y: arr2}});
  t.throws(function() { family.addOperation('foo()', {x: noop0}); },
      /Action 'x' has the wrong arity: expected 1, got 0/);
  t.throws(function() { family.addOperation('foo()', {x: noop1, y: noop0}); },
      /Action 'y' has the wrong arity: expected 2, got 0/);

  t.end();
});

test('unknown action names', function(t) {
  var family = new VisitorFamily({shapes: {x: arr1, y: arr2}});
  t.throws(function() { family.addOperation('foo()', {z: null}); },
      /Unrecognized action name 'z'/);
  t.throws(function() { family.addOperation('foo()', {toString: null}); },
      /Unrecognized action name 'toString'/);

  t.end();
});

test('unrecognized tags', function(t) {
  var v = new VisitorFamily({shapes: {}, getTag: function(x) { return 'bad'; }});
  v.addOperation('foo()', {});
  t.throws(function() { v.wrap(0).foo(); }, /getTag returned unrecognized tag 'bad'/);

  v = new VisitorFamily({shapes: {}, getTag: function(x) { return 'toString'; }});
  v.addOperation('foo()', {});
  t.throws(function() { v.wrap(0).foo(); }, /getTag returned unrecognized tag 'toString'/);

  t.end();
});

test('operations with arguments', function(t) {
  var v = new VisitorFamily({shapes: {hello: []}, getTag: function(x) { return 'hello'; }});
  var root = {};
  v.addOperation('greet(n)', {hello: function() { return 'hello ' + this.args.n; }});
  t.equal(v.wrap(root).greet('donald'), 'hello donald');

  t.end();
});
