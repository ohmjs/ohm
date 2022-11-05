/* global Buffer */

import fs from 'fs';
import test from 'ava';

import ohm from '../index.mjs';

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('namespaces', t => {
  const ns = ohm.grammars('G { start = "foo" }');
  t.is(ns.G.match('foo').succeeded(), true, 'G exists in the namespace and works');

  const ns2 = ohm.grammars('ccc { foo = "foo" }', ns);
  t.truthy(ns2);
  t.throws(
      () => {
        ohm.grammar('ccc { bar = "bar" }', ns2);
      },
      {message: 'Grammar ccc is already declared in this namespace'},
  );
  t.truthy(ns2.G, 'ns2 delegates to ns1');

  const ns3 = ohm.grammars('ccc { start = "x" }', ns);
  t.truthy(ns3);
  t.truthy(ns3.ccc, "grammars with same name can be created in diff't namespaces");
  t.not(ns3.ccc, ns2.ccc, "grammars with same name are diff't objects");
  t.deepEqual(ns3.G, ns2.G, 'super grammar is the same');
});

test('plain JS objects as namespaces', t => {
  const ns = ohm.grammars('toString { start = "!!!" }');
  t.is(ns.toString.match('!!!').succeeded(), true);

  t.truthy(ohm.grammar('G <: toString {}', ns));
  t.throws(() => ohm.grammar('G <: toString {}', {}), {
    message: /Grammar toString is not declared/,
  });

  const toString = ohm.grammar('toString {}');
  t.truthy(ohm.grammar('G <: toString {}', {toString}));
  t.truthy(ohm.grammar('G <: toString {}', Object.create({toString})));

  const ns2 = {};
  Object.defineProperty(ns2, 'G', {
    value: ohm.grammar('G {}'),
    enumerable: false,
  });
  t.throws(
      () => ohm.grammar('G2 <: G {}', ns2),
      {message: /Grammar G is not declared/},
      'an own, non-enumerable property is ignored',
  );
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
      'object with invalid toString',
  );
  t.throws(
      () => {
        ohm.grammar(Object.create(null));
      },
      {message: 'Expected string as first argument, got [object Object]'},
      'object with no toString',
  );

  t.throws(
      () => {
        ohm.grammar([1, 2]);
      },
      {message: 'Expected string as first argument, got Array: "1,2"'},
      'Array with valid toString',
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
      'Custom objects with toString',
  );
});
