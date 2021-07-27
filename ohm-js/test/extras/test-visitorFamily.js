'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const test = require('ava');
const VisitorFamily = require('../../extras/VisitorFamily');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function noop0() {}
function noop1(a) {}

const arr1 = ['a'];
const arr2 = ['a', 'b'];

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic', t => {
  const family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: ['l', 'r']
    },
    getTag(x) {
      return typeof x === 'string' ? 'leaf' : 'tree';
    }
  });

  family.addOperation('visit()', {
    leaf() {
      return this._adaptee;
    },
    tree(left, right) {
      return left.visit() + ' ' + right.visit();
    }
  });

  const tree = {l: 'one', r: {l: 'two', r: 'three'}};
  t.is(family.wrap(tree).visit(), 'one two three');
});

test('array props', t => {
  let family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: 'children[]'
    },
    getTag(x) {
      return typeof x === 'string' ? 'leaf' : 'tree';
    }
  });
  family.addOperation('visit()', {
    leaf() {
      return this._adaptee;
    },
    tree(children) {
      return children.map(c => c.visit());
    }
  });
  let tree = {children: ['a', {children: ['b', 'c']}, 'd']};
  t.deepEqual(family.wrap(tree).visit(), ['a', ['b', 'c'], 'd']);

  family = new VisitorFamily({
    shapes: {
      leaf: [],
      tree: ['children[]', 'extra']
    },
    getTag(x) {
      return typeof x === 'string' ? 'leaf' : 'tree';
    }
  });
  family.addOperation('visit()', {
    leaf() {
      return this._adaptee;
    },
    tree(children, extra) {
      return children.map(c => c.visit()).concat(extra.visit());
    }
  });
  tree = {children: ['a', {children: ['b', 'c'], extra: 'd'}], extra: 'e'};
  t.deepEqual(family.wrap(tree).visit(), ['a', ['b', 'c', 'd'], 'e']);
});

test('arity checks', t => {
  const family = new VisitorFamily({shapes: {x: arr1, y: arr2}});
  t.throws(
      () => {
        family.addOperation('foo()', {x: noop0});
      },
      {message: /Action 'x' has the wrong arity: expected 1, got 0/}
  );
  t.throws(
      () => {
        family.addOperation('foo()', {x: noop1, y: noop0});
      },
      {message: /Action 'y' has the wrong arity: expected 2, got 0/}
  );
});

test('unknown action names', t => {
  const family = new VisitorFamily({shapes: {x: arr1, y: arr2}});
  t.throws(
      () => {
        family.addOperation('foo()', {z: null});
      },
      {message: /Unrecognized action name 'z'/}
  );
  t.throws(
      () => {
        family.addOperation('foo()', {toString: null});
      },
      {message: /Unrecognized action name 'toString'/}
  );
});

test('unrecognized tags', t => {
  let v = new VisitorFamily({
    shapes: {},
    getTag(x) {
      return 'bad';
    }
  });
  v.addOperation('foo()', {});
  t.throws(
      () => {
        v.wrap(0).foo();
      },
      {message: /getTag returned unrecognized tag 'bad'/}
  );

  v = new VisitorFamily({
    shapes: {},
    getTag(x) {
      return 'toString';
    }
  });
  v.addOperation('foo()', {});
  t.throws(
      () => {
        v.wrap(0).foo();
      },
      {message: /getTag returned unrecognized tag 'toString'/}
  );
});

test('operations with arguments', t => {
  const v = new VisitorFamily({
    shapes: {hello: []},
    getTag(x) {
      return 'hello';
    }
  });
  const root = {};
  v.addOperation('greet(n)', {
    hello() {
      return 'hello ' + this.args.n;
    }
  });
  t.is(v.wrap(root).greet('donald'), 'hello donald');
});
