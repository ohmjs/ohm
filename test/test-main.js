/* global Buffer */

'use strict';

var fs = require('fs');
var test = require('tape');

var ohm = require('..');
var testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('namespaces', function(t) {
  var ns = ohm.grammars('G { start = "foo" }');
  t.ok(ns.G.match('foo'), 'G exists in the namespace and works');

  var ns2 = ohm.grammars('ccc { foo = "foo" }', ns);
  t.ok(ns2);
  t.throws(
      function() { ohm.grammar('ccc { bar = "bar" }', ns2); },
      'Grammar ccc is already declared in this namespace');
  t.ok(ns2.G, 'ns2 delegates to ns1');

  var ns3 = ohm.grammars('ccc { start = "x" }', ns);
  t.ok(ns3);
  t.ok(ns3.ccc, "grammars with same name can be created in diff't namespaces");
  t.notEqual(ns3.ccc, ns2.ccc, "grammars with same name are diff't objects");
  t.deepEqual(ns3.G, ns2.G, 'super grammar is the same');

  t.end();
});

test('loading from script elements', function(t) {
  var script1 = testUtil.fakeScriptTag(['O { number = number digit  -- rec',
                                    '           | digit',
                                    '}']);
  var script2 = testUtil.fakeScriptTag(['M { x = "xx" }',
                                    'N { y = "yy" }']);
  var ns1 = ohm.grammarsFromScriptElements([script1]);
  var ns2 = ohm.grammarsFromScriptElements([script2]);
  t.equal(ns1.M, undefined, 'M is undefined in ns1');
  t.ok(ns1.O, 'O is defined in ns1');
  t.equals(ns1.O.match('1234', 'number').succeeded(), true, 'O can match');

  t.ok(ns2.M, 'M is defined in ns2');
  t.ok(ns2.N, 'N is also defined');
  t.equal(ns2.O, undefined, 'O is not defined in ns2');
  t.equals(ns2.M.match('xx', 'x').succeeded(), true, 'M can match');

  var g1 = ohm.grammarFromScriptElement(script1);
  t.equals(g1.match('1234', 'number').succeeded(), true, 'loading a single grammar works');

  t.end();
});

test('instantiating grammars from different types of objects', function(t) {
  var g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  t.equals(g.match('1+2').succeeded(), true, 'works with a Buffer from fs.readFileSync()');

  g = ohm.grammar(new Buffer('G {}'));
  t.equals(g.match('a', 'letter').succeeded(), true, 'works with a new Buffer');

  // Try with some objects where 'toString' won't work.
  t.throws(function() { ohm.grammar({toString: 3}); },
      'Expected string as first argument, got [object Object]', 'object with invalid toString');
  t.throws(function() { ohm.grammar(Object.create(null)); },
      'Expected string as first argument, got [object Object]', 'object with no toString');

  t.throws(function() { ohm.grammar([1, 2]); },
      'Expected string as first argument, got Array: "1,2"', 'Array with valid toString');

  function Foo() {
    this.toString = function() { return 'Foo!'; };
  }
  t.throws(function() { ohm.grammar(new Foo()); },
      'Expected string as first argument, got Foo: "Foo!"', 'Custom objects with toString');

  t.end();
});
