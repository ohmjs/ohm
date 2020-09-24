/* global Buffer */

'use strict';

const fs = require('fs');
const test = require('tape');

const ohm = require('..');
const testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('namespaces', t => {
  const ns = ohm.grammars('G { start = "foo" }');
  t.ok(ns.G.match('foo'), 'G exists in the namespace and works');

  const ns2 = ohm.grammars('ccc { foo = "foo" }', ns);
  t.ok(ns2);
  t.throws(
      () => { ohm.grammar('ccc { bar = "bar" }', ns2); },
      'Grammar ccc is already declared in this namespace');
  t.ok(ns2.G, 'ns2 delegates to ns1');

  const ns3 = ohm.grammars('ccc { start = "x" }', ns);
  t.ok(ns3);
  t.ok(ns3.ccc, "grammars with same name can be created in diff't namespaces");
  t.notEqual(ns3.ccc, ns2.ccc, "grammars with same name are diff't objects");
  t.deepEqual(ns3.G, ns2.G, 'super grammar is the same');

  t.end();
});

test('loading from script elements', t => {
  const script1 = testUtil.fakeScriptTag(['O { number = number digit  -- rec',
    '           | digit',
    '}']);
  const script2 = testUtil.fakeScriptTag(['M { x = "xx" }',
    'N { y = "yy" }']);
  const ns1 = ohm.grammarsFromScriptElements([script1]);
  const ns2 = ohm.grammarsFromScriptElements([script2]);
  t.equal(ns1.M, undefined, 'M is undefined in ns1');
  t.ok(ns1.O, 'O is defined in ns1');
  t.equals(ns1.O.match('1234', 'number').succeeded(), true, 'O can match');

  t.ok(ns2.M, 'M is defined in ns2');
  t.ok(ns2.N, 'N is also defined');
  t.equal(ns2.O, undefined, 'O is not defined in ns2');
  t.equals(ns2.M.match('xx', 'x').succeeded(), true, 'M can match');

  const g1 = ohm.grammarFromScriptElement(script1);
  t.equals(g1.match('1234', 'number').succeeded(), true, 'loading a single grammar works');

  t.end();
});

test('instantiating grammars from different types of objects', t => {
  let g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  t.equals(g.match('1+2').succeeded(), true, 'works with a Buffer from fs.readFileSync()');

  g = ohm.grammar(Buffer.from('G {}'));
  t.equals(g.match('a', 'letter').succeeded(), true, 'works with a new Buffer');

  // Try with some objects where 'toString' won't work.
  t.throws(() => { ohm.grammar({toString: 3}); },
      'Expected string as first argument, got [object Object]', 'object with invalid toString');
  t.throws(() => { ohm.grammar(Object.create(null)); },
      'Expected string as first argument, got [object Object]', 'object with no toString');

  t.throws(() => { ohm.grammar([1, 2]); },
      'Expected string as first argument, got Array: "1,2"', 'Array with valid toString');

  function Foo() {
    this.toString = function() { return 'Foo!'; };
  }
  t.throws(() => { ohm.grammar(new Foo()); },
      'Expected string as first argument, got Foo: "Foo!"', 'Custom objects with toString');

  t.end();
});
