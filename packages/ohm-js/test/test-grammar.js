import fs from 'fs';
import test from 'ava';

import {Grammar} from '../src/Grammar.js';
import * as ohm from '../index.mjs';

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('action dictionary templates', t => {
  const ns = ohm.grammars(`
    G1 {
      foo = bar
      bar = baz baz baz
      baz = qux
      qux = quux "123"
      quux = "42"
      aaa = "duh"
      bbb = ~aaa qux  -- blah
    }
    G2 <: G1 {
      qux := "100"
    }
  `);
  t.snapshot(ns.G1.toOperationActionDictionaryTemplate());
  t.snapshot(ns.G2.toAttributeActionDictionaryTemplate());
});

test('default start rule', t => {
  let g = ohm.grammar('G {}');
  t.is(g.defaultStartRule, undefined, 'undefined for an empty grammar');
  t.throws(
    () => {
      g.match('a');
    },
    {message: /Missing start rule/},
    'match throws with no start rule'
  );
  t.is(
    Grammar.ProtoBuiltInRules.defaultStartRule,
    undefined,
    'undefined for ProtoBuiltInRules'
  );
  t.is(Grammar.BuiltInRules.defaultStartRule, undefined, 'undefined for BuiltInRules');

  const g2 = ohm.grammar('G2 <: G {}', {G: g});
  t.is(g2.defaultStartRule, undefined, 'undefined for a subgrammar too');
  t.throws(
    () => {
      g2.match('a');
    },
    {message: /Missing start rule/},
    'match throws with no start rule'
  );

  const ns = ohm.grammars('G { foo = "a" } G2 <: G {}');
  t.is(ns.G.defaultStartRule, 'foo', 'only rule becomes default start rule');
  t.is(ns.G2.defaultStartRule, 'foo', 'start rule is inherited from supergrammar');
  t.is(ns.G.match('a').succeeded(), true, 'match works without a start rule argument');
  t.is(ns.G2.match('a').succeeded(), true);

  const g3 = ohm.grammar('G3 <: G { bar = "b" }', ns);
  t.is(g3.defaultStartRule, 'foo', 'start rule is still inherited');
  t.is(g3.match('a').succeeded(), true);

  const g4 = ohm.grammar('G4 <: G3 { blah = "c" }', {G3: g3});
  t.is(g4.defaultStartRule, 'foo', 'start rule inherited from super-supergrammar');
  t.is(g4.match('a').succeeded(), true);

  g = ohm.grammar('G { digit += any }');
  t.is(g.defaultStartRule, undefined, "extending alone doesn't set the start rule");
  t.throws(
    () => {
      g.match('a');
    },
    {message: /Missing start rule/},
    'match throws with no start rule'
  );
  g = ohm.grammar(`
    G {
      digit += any
      blah = "3"
    }
  `);
  t.is(g.defaultStartRule, 'blah', 'rule defined after extending becomes start rule');
  t.is(g.match('3').succeeded(), true);

  g = ohm.grammar('G { digit := any }');
  t.is(g.defaultStartRule, undefined, "overriding alone doesn't set the start rule");
  t.throws(
    () => {
      g.match('a');
    },
    {message: /Missing start rule/},
    'match throws with no start rule'
  );
  g = ohm.grammar(`
    G {
      digit := any
      blah = "3"
    }
  `);
  t.is(g.defaultStartRule, 'blah', 'rule defined after overriding becomes start rule');
  t.is(g.match('3').succeeded(), true);

  g = ohm.grammar('G { x = "a"\n| -- nothing }');
  t.is(g.defaultStartRule, 'x', "an inline rule doesn't become the default");

  // Test passing the default start rule as an argument to the Grammar constructor.
  const root = Grammar.BuiltInRules;
  t.throws(
    () => {
      new Grammar('G', root, {}, 'nonexistentRule');
    },
    {message: /Invalid start rule/},
    'throws when start rule is not in the grammar'
  );
  t.truthy(
    new Grammar('G', root, {aRule: null}, 'aRule'),
    'works when it is in the `rules` dict'
  );
  const rules = Object.create(root.rules);
  t.truthy(new Grammar('G', root, rules, 'digit'), 'works when rule is in the supergrammar');
});

test('grammar equality', t => {
  const source = fs.readFileSync('test/arithmetic.ohm').toString();
  const a = ohm.grammar(source);
  const b = ohm.grammar(source);
  t.is(a.equals(b), true, 'two grammars from same source');
  t.is(a.equals(), false, 'comparing to undefined');
  t.is(a.equals(null), false, 'comparing to null');

  const c = ohm.grammar(source.replace('digit', '(digit)'));
  t.is(a.equals(c), true, 'still equal after meaningless source change');

  const {exp} = a.rules;
  delete a.rules.exp;

  t.is(a.equals(b), false, 'not equal after deleting a rule');

  a.rules.exp = exp;
  t.is(a.equals(b), true, 'equal aftering adding rule back');

  a.rules.exp.description = 'doyyy';
  t.is(a.equals(b), false, 'not equal after changing a description');

  b.rules.zzz = {};
  t.is(b.equals(c), false, 'not equal after adding additional rule');
  delete b.rules.zzz;
  t.is(b.equals(c), true);

  b.defaultStartRule = '';
  t.is(b.equals(c), false, 'not equal after changing defaultStartRule');
});
