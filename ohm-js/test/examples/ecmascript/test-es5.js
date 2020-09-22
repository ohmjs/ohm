'use strict';

const test = require('tape-catch');

const es5 = require('ohm-grammar-ecmascript');

test('basic es5 tests', t => {
  let results = es5.grammar.match('var x = 3; console.log(x)');
  t.ok(results.succeeded(), 'Example in readme is valid');

  results = es5.grammar.match('var x =; console.log(x)');
  t.notOk(results.succeeded(), 'Basic invalid example fails');

  t.end();
});

