/* global Buffer */

'use strict';

const fs = require('fs');
const test = require('ava');

const ohm = require('..');
const testUtil = require('./helpers/testUtil');

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('namespaces', t => {
  const ns = ohm.grammars('G { start = "foo" }');
  t.truthy(ns.G.match('foo'), 'G exists in the namespace and works');

  const ns2 = ohm.grammars('ccc { foo = "foo" }', ns);
  t.truthy(ns2);
  t.throws(
      () => {
        ohm.grammar('ccc { bar = "bar" }', ns2);
      },
      {message: 'Grammar ccc is already declared in this namespace'}
  );
  t.truthy(ns2.G, 'ns2 delegates to ns1');

  const ns3 = ohm.grammars('ccc { start = "x" }', ns);
  t.truthy(ns3);
  t.truthy(ns3.ccc, "grammars with same name can be created in diff't namespaces");
  t.not(ns3.ccc, ns2.ccc, "grammars with same name are diff't objects");
  t.deepEqual(ns3.G, ns2.G, 'super grammar is the same');
});

test('loading from script elements', t => {
  const script1 = testUtil.fakeScriptTag([
    'O { number = number digit  -- rec',
    '           | digit',
    '}'
  ]);
  const script2 = testUtil.fakeScriptTag(['M { x = "xx" }', 'N { y = "yy" }']);
  const ns1 = ohm.grammarsFromScriptElements([script1]);
  const ns2 = ohm.grammarsFromScriptElements([script2]);
  t.is(ns1.M, undefined, 'M is undefined in ns1');
  t.truthy(ns1.O, 'O is defined in ns1');
  t.is(ns1.O.match('1234', 'number').succeeded(), true, 'O can match');

  t.truthy(ns2.M, 'M is defined in ns2');
  t.truthy(ns2.N, 'N is also defined');
  t.is(ns2.O, undefined, 'O is not defined in ns2');
  t.is(ns2.M.match('xx', 'x').succeeded(), true, 'M can match');

  const g1 = ohm.grammarFromScriptElement(script1);
  t.is(g1.match('1234', 'number').succeeded(), true, 'loading a single grammar works');
});

test('instantiating grammars from different types of objects', t => {
  let g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  t.is(g.match('1+2').succeeded(), true, 'works with a Buffer from fs.readFileSync()');

  g = ohm.grammar(Buffer.from('G {}'));
  t.is(g.match('a', 'letter').succeeded(), true, 'works with a new Buffer');

  // Try with some objects where 'toString' won't work.
  t.throws(
      () => {
        ohm.grammar({toString: 3});
      },
      {message: 'Expected string as first argument, got [object Object]'},
      'object with invalid toString'
  );
  t.throws(
      () => {
        ohm.grammar(Object.create(null));
      },
      {message: 'Expected string as first argument, got [object Object]'},
      'object with no toString'
  );

  t.throws(
      () => {
        ohm.grammar([1, 2]);
      },
      {message: 'Expected string as first argument, got Array: "1,2"'},
      'Array with valid toString'
  );

  function Foo() {
    this.toString = function() {
      return 'Foo!';
    };
  }
  t.throws(
      () => {
        ohm.grammar(new Foo());
      },
      {message: 'Expected string as first argument, got Foo: "Foo!"'},
      'Custom objects with toString'
  );
});
