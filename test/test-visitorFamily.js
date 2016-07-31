'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var test = require('tape');
var VisitorFamily = require('../src/VisitorFamily');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function noop0() {};
function noop1(a) {};

var arr1 = ['a'];
var arr2 = ['a', 'b'];

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic', t => {
  var family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: ['l', 'r']
    },
    getTag: x => typeof x === 'string' ? 'leaf' : 'tree',
  });

  family.addOperation('visit', {
    leaf() {
      return this._adaptee;
    },
    tree(left, right) {
      return left.visit() + ' ' + right.visit();
    }
  })

  var tree = {l: 'one', r: {l: 'two', r: 'three'}};

  t.equal(family.wrap(tree).visit(), 'one two three');

  t.end();
});

test('arity checks', t => {
  var family = new VisitorFamily({shapes: {x: arr1, y: arr2}});
  t.throws(() => family.addOperation('foo', {x: noop0}),
      /Action 'x' has the wrong arity: expected 1, got 0/);
  t.throws(() => family.addOperation('foo', {x: noop1, y: noop0}),
      /Action 'y' has the wrong arity: expected 2, got 0/);

  t.end();
});

test('unknown action names', t => {
  var family = new VisitorFamily({shapes: {x: arr1, y: arr2}});
  t.throws(() => family.addOperation('foo', {z: null}), /Unrecognized action name 'z'/);
  t.throws(() => family.addOperation('foo', {toString: null}),
      /Unrecognized action name 'toString'/);

  t.end();
});

test('unrecognized tags', t => {
  var v = new VisitorFamily({shapes: {}, getTag: x => 'bad'});
  v.addOperation('foo', {});
  t.throws(() => { v.wrap(0).foo() }, /getTag returned unrecognized tag 'bad'/);

  v = new VisitorFamily({shapes: {}, getTag: x => 'toString'});
  v.addOperation('foo', {});
  t.throws(() => { v.wrap(0).foo() }, /getTag returned unrecognized tag 'toString'/);

  t.end();
});
