'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var fs = require('fs');
var test = require('tape');

var ohm = require('..');
var util = require('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic semantics', function(t) {
  var ns = util.makeGrammars(arithmeticGrammarSource);
  var expr = ns.Expr;

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
