/* eslint-env node */

import test from 'ava';
import * as ohm from '../index.mjs';

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('require same number of params when overriding and extending', t => {
  const ns = ohm.grammars('G { Foo<x, y> = x y }');

  // Too few parameters
  t.throws(() => ohm.grammars('G2 <: G { Foo<x> := "oops!" }', ns), {
    message: /Wrong number of parameters for rule Foo \(expected 2, got 1\)/,
  });
  t.throws(() => ohm.grammars('G2 <: G { Foo<x> += "oops!" }', ns), {
    message: /Wrong number of parameters for rule Foo \(expected 2, got 1\)/,
  });

  // Too many parameters
  t.throws(() => ohm.grammar('G2 <: G { Foo<x, y, z> := "oops!" }', ns), {
    message: /Wrong number of parameters for rule Foo \(expected 2, got 3\)/,
  });
  t.throws(() => ohm.grammar('G2 <: G { Foo<x, y, z> += "oops!" }', ns), {
    message: /Wrong number of parameters for rule Foo \(expected 2, got 3\)/,
  });

  // Just right
  t.truthy(ohm.grammar('G2 <: G { Foo<x, y> := "yay!" }', ns));
  t.truthy(ohm.grammar('G2 <: G { Foo<x, y> += "it" "works" }', ns));
});

test('require same number of args when applying', t => {
  const ns = ohm.grammars('G { Foo<x, y> = x y }');
  t.throws(() => ohm.grammar('G2 <: G { Bar = Foo<"a"> }', ns), {
    message: /Wrong number of arguments for rule Foo \(expected 2, got 1\)/,
  });
  t.throws(() => ohm.grammar('G2 <: G { Bar = Foo<"a", "b", "c"> }', ns), {
    message: /Wrong number of arguments for rule Foo \(expected 2, got 3\)/,
  });
});

test('require arguments to have arity 1', t => {
  t.throws(
      () =>
        ohm.grammar(`
        G {
          Foo<x> = x x\n
          Start = Foo<digit digit>\n
        }
      `),
      {message: /Invalid parameter to rule Foo/},
  );
});

test('require the rules referenced in arguments to be declared', t => {
  t.throws(() => ohm.grammar('G { start = listOf<asdlfk, ","> }'), {
    message: /Rule asdlfk is not declared in grammar G/,
  });
});

test('simple examples', t => {
  const g = ohm.grammar(`
    G {
      Pair<elem> = "(" elem "," elem ")"
      Start = Pair<digit>\n
    }
  `);
  const s = g.createSemantics().addOperation('v', {
    Pair(oparen, x, comma, y, cparen) {
      return [x.v(), y.v()];
    },
    digit(_) {
      return this.sourceString;
    },
  });
  const cst = g.match('(1,2)', 'Start');
  t.deepEqual(s(cst).v(), ['1', '2']);
});

test('start matching from parameterized rule', t => {
  const g = ohm.grammar(`
    G {
      App<arg> = arg
      Simple = App<"x">
      z = "z"
    }
  `);
  t.throws(
      () => {
        g.match('x');
      },
      {message: /Wrong number of parameters for rule App \(expected 1, got 0\)/},
      'parameterized default start rule does not work',
  );
  t.throws(
      () => {
        g.match('y', 'App');
      },
      {message: /Wrong number of parameters for rule App \(expected 1, got 0\)/},
      'parameterized rule does not work as simple rule',
  );
  t.truthy(g.match('y', 'App<"y">').succeeded(), 'matching with primitive parameter');
  t.truthy(g.match('z', 'App<"z">').succeeded(), 'matching with rule parameter');
});

test('inline rule declarations', t => {
  const g = ohm.grammar(`
    G {
      List<elem, sep>
        = elem (sep elem)*  -- some
        |                   -- none
      Start = List<"x", ",">
    }
  `);
  const s = g.createSemantics().addOperation('v', {
    List_some(x, sep, xs) {
      return [x.v()].concat(xs.children.map(c => c.v()));
    },
    List_none() {
      return [];
    },
    _terminal() {
      return this.sourceString;
    },
  });
  const cst = g.match('x, x,x', 'Start');
  t.deepEqual(s(cst).v(), ['x', 'x', 'x']);
});

test('left recursion', t => {
  const g = ohm.grammar(`
    G {
      LeftAssoc<expr, op>
        = LeftAssoc<expr, op> op expr  -- rec
        | expr                         -- base
      Start
        = LeftAssoc<digit, "+">
    }
  `);
  const s = g.createSemantics().addOperation('v', {
    LeftAssoc_rec(x, op, y) {
      return [op.v(), x.v(), y.v()];
    },
    LeftAssoc_base(x) {
      return x.v();
    },
    _terminal() {
      return this.sourceString;
    },
  });
  const cst = g.match('1 + 2 + 3', 'Start');
  t.deepEqual(s(cst).v(), ['+', ['+', '1', '2'], '3']);
});

test('complex parameters', t => {
  const g = ohm.grammar(`
    G {
      start = two<~"5" digit>
      two<x> = x x
    }
  `);
  const s = g.createSemantics().addOperation('v', {
    two(x, y) {
      return [x.v(), y.v()];
    },
    _terminal() {
      return this.sourceString;
    },
  });
  t.deepEqual(s(g.match('42')).v(), ['4', '2']);
  t.is(g.match('45').failed(), true);
});

test('duplicate parameter names', t => {
  t.throws(
      () => ohm.grammar('G { Foo<a, b, a, b> = a }'),
      {message: /Duplicate parameter names in rule Foo: a, b/},
      'defining',
  );
  t.throws(
      () => ohm.grammar('G { ListOf<a, a> := a }'),
      {message: /Duplicate parameter names in rule ListOf: a/},
      'overriding',
  );
  t.throws(
      () => ohm.grammar('G { ListOf<a, a> += a }'),
      {message: /Duplicate parameter names in rule ListOf: a/},
      'extending',
  );
});
