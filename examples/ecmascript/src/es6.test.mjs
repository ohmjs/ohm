import fs from 'fs';
import ohm from 'ohm-js';
import test from 'ava';

import es5 from './es5.js';
import initES6 from './es6.js';

const es6 = initES6(ohm, {ES5: es5.grammar}, es5.semantics);

test('template literals', t => {
  es6.grammar;
  const succeeds = str => {
    const result = es6.grammar.match(str);
    if (!result.succeeded()) {
      console.error(result.message);
    }
    return result.succeeded();
  };
  const fails = str => es6.grammar.match(str).failed();

  t.is(succeeds('``'), true);
  t.is(succeeds('`${1}${2}`'), true);
  t.is(succeeds('`${1}${2}${3}`'), true);

  // Test cases from Acorn
  // https://github.com/acornjs/acorn/blob/ccfd59d044fa004f852cc4105d09782e0192e078/test/tests-template-literal-revision.js

  t.is(succeeds('`foo`'), true);
  t.is(succeeds('`foo\\u25a0`'), true);

  t.is(succeeds('`foo${bar}\\u25a0`'), true);
  t.is(succeeds('foo`\\u25a0`'), true);
  t.is(succeeds('foo`foo${bar}\\u25a0`'), true);

  t.is(fails('`\\unicode`'), true);
  t.is(fails('`\\u`'), true);
  t.is(fails('`\\u{`'), true);
  t.is(fails('`\\u{abcdx`'), true);
  t.is(fails('`\\u{abcdx}`'), true);
  t.is(fails('`\\xylophone`'), true);
  t.is(fails('foo`\\unicode`'), true);
  t.is(fails('foo`\\xylophone`'), true);
  t.is(fails('foo`\\unicode'), true);
  t.is(fails('foo`\\unicode\\`'), true);

  /*
  t.is(succeeds("foo`\\unicode`"), true);
  t.is(succeeds("foo`foo${bar}\\unicode`"), true);
  t.is(succeeds("foo`\\u`"), true);
  t.is(succeeds("foo`\\u{`"), true);
  t.is(succeeds("foo`\\u{abcdx`"), true);
  t.is(succeeds("foo`\\u{abcdx}`"), true);
  t.is(succeeds("foo`\\unicode\\\\`"), true);
  */

  t.is(succeeds('`${ {class: 1} }`'), true);
  t.is(succeeds('`${ {delete: 1} }`'), true);
  t.is(succeeds('`${ {enum: 1} }`'), true);
  t.is(succeeds('`${ {function: 1} }`'), true);
});
