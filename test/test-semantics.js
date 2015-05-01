'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend');
var fs = require('fs');
var test = require('tape');

var ohm = require('..');
var util = require('./util');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();

// Combines the properties of `obj1` and `props` into a new object.
function combine(obj1, props) {
  return extend(extend({}, obj1), props);
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic semantics', function(t) {
  var expr = util.makeGrammar(arithmeticGrammarSource);

  var s = expr.semantics();
  s.addOperation('value', {
    addExpr_plus: function(x, op, y) {
      return x.value() + y.value();
    },
    mulExpr_times: function(x, op, y) {
      return x.value() * y.value();
    },
    number_rec: function(n, d) {
      return n.value() * 10 + d.value();
    },
    digit: function(expr) {
      return expr.value().charCodeAt(0) - '0'.charCodeAt(0);
    },
    _default: ohm.actions.passThrough,
    _terminal: function() {
      return this.node.primitiveValue;
    }
  });

  function match(source) {
    return expr.match(source, 'expr');
  }

  t.ok(match('1*(2+3)-4/5'), 'expr is recognized');

  t.equal(s(match('1+2')).value(), 3, 'single addExpr');
  t.equal(s(match('13+10*2*3')).value(), 73, 'more complicated case');
  t.throws(function() { s.addOperation('value'); }, 'throws when name already exists');

  t.ok(s.addOperation('one', {}).addOperation('two', {}), 'chaining');
  t.throws(function() { s(null).value(); }, TypeError);
  t.throws(function() { s(false).value(); }, TypeError);
  t.throws(function() { s().value(); }, TypeError);
  t.throws(function() { s(3).value(); }, TypeError);
  t.throws(function() { s('asdf').value(); }, TypeError);

  // An operation that produces a list of the values of all the numbers in the tree.
  s.addOperation('numberValues', {
    addExpr_plus: function(x, op, y) {
      return x.numberValues().concat(y.numberValues());
    },
    mulExpr_times: function(x, op, y) {
      return x.numberValues().concat(y.numberValues());
    },
    number: function(n) {
      return [n.value()];
    },
    _default: ohm.actions.passThrough
  });
  t.deepEqual(s(match('13+10*2*3')).numberValues(), [13, 10, 2, 3]);
  t.deepEqual(s(match('9')).numberValues(), [9]);

  t.end();
});

test('_many nodes', function(t) {
  var g = util.makeGrammar('G { letters = letter* }');
  var actions = {
    _default: ohm.actions.passThrough,
    _terminal: ohm.actions.getPrimitiveValue
  };
  var s = g.semantics().addOperation('op', combine(actions, {_many: ohm.actions.makeArray}));
  var m = g.match('abc', 'letters');
  t.deepEqual(s(m).op(), ['a', 'b', 'c'], 'makeArray works');

  s = g.semantics().addOperation('op', combine(actions, {_many: ohm.actions.passThrough}));
  t.throws(function() { s(m).op(); }, /passThrough/, 'throws with passThrough');

  t.throws(function() {
    g.semantics().addOperation('op', combine(actions, {_many: ohm.actions.getPrimitiveValue}));
  }, /wrong arity/, 'throws with getPrimitiveValue');

  s = g.semantics().addOperation('op', combine(actions, {
    _many: function(letters) {
      t.ok(letters.every(function(l) {
        return typeof l.op === 'function';
      }), 'only arg is an array of wrappers');
      t.equal(typeof this.op, 'function', '`this` has an op() method');
      t.equal(this.node.ctorName, '_many', '`this.node` is the actual node');
      return letters.map(function(l) { return l.op(); }).join(',');
    }
  }));
  t.equal(s(m).op(), 'a,b,c');

  t.end();
});

test('_terminal nodes', function(t) {
  var g = util.makeGrammar('G { letters = letter* }');
  var actions = {
    _default: ohm.actions.passThrough,
    _many: ohm.actions.makeArray
  };
  var s = g.semantics().addOperation('op', combine(actions, {
    _terminal: ohm.actions.getPrimitiveValue
  }));
  var m = g.match('abc', 'letters');
  t.deepEqual(s(m).op(), ['a', 'b', 'c'], 'getPrimitiveValue works');

  t.throws(function() {
    g.semantics().addOperation('op', combine(actions, {_terminal: ohm.actions.passThrough}));
  }, /wrong arity/, 'throws with passThrough');

  t.throws(function() {
    g.semantics().addOperation('op', combine(actions, {_terminal: ohm.actions.makeArray}));
  }, /wrong arity/, 'throws with makeArray');

  s = g.semantics().addOperation('op', combine(actions, {
    _terminal: function() {
      t.equal(arguments.length, 0, 'there are no arguments');
      t.equal(this.node.ctorName, '_terminal');
      t.equal(this.node.children.length, 0, 'node has no children');
      return this.node.primitiveValue;
    }
  }));
  t.deepEqual(s(m).op(), ['a', 'b', 'c']);

  t.end();
});

test('semantic action arity checks', function(t) {
  var g = util.makeGrammar('G {}');
  function makeOperation(grammar, actions) {
    return grammar.semantics().addOperation('op' + util.uniqueId(), actions);
  }
  function ignore0() {}
  function ignore1(a) {}
  function ignore2(a, b) {}

  t.ok(makeOperation(g, {}), 'empty actions with empty grammar');
  t.ok(makeOperation(g, {foo: null}), 'unrecognized action names are ignored');

  t.throws(function() { makeOperation(g, {_many: ignore0}); }, /arity/, '_many');
  t.ok(makeOperation(g, {_many: ignore1}), '_many works with one arg');

  t.throws(function() { makeOperation(g, {_default: ignore0}); }, /arity/, '_default is checked');
  t.ok(makeOperation(g, {_default: ignore1}), '_default works with one arg');

  t.throws(function() {
    makeOperation(g, {_terminal: ignore1});
  }, /arity/, '_terminal is checked');
  t.ok(makeOperation(g, {_terminal: ignore0}), '_terminal works with no args');

  t.throws(function() {
    makeOperation(g, {letter: ignore0});
  }, /arity/, 'built-in rules are checked');
  t.ok(makeOperation(g, {letter: ignore1}), 'letter works with one arg');

  g = util.makeGrammar([
    'G {',
    '  one = two',
    '  two = "2" letter',
    '}']);
  t.ok(makeOperation(g, {one: ignore1, two: ignore2}));

  t.throws(function() {
    makeOperation(g, {one: ignore0, two: ignore2});
  }, /wrong arity/, "'one', is checked");
  t.throws(function() {
    makeOperation(g, {one: ignore1, two: ignore0});
  }, /wrong arity/, "'two' is checked");

  var g2 = util.makeGrammar('G2 <: G {}', {G: g});
  t.throws(function() {
    makeOperation(g2, {one: ignore2});
  }, /wrong arity/, 'supergrammar rules are checked');
  t.ok(makeOperation(g2, {one: ignore1}), 'works with one arg');

  var g3 = util.makeGrammar('G3 <: G { one := "now" "two" }', {G: g});
  t.throws(function() {
    makeOperation(g3, {one: ignore1});
  }, /wrong arity/, 'changing arity in an overridden rule');
  t.ok(makeOperation(g3, {one: ignore2}));

  t.end();
});
