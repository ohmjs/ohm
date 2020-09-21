'use strict';

const test = require('tape-catch');

const es5 = require('ohm-grammar-ecmascript');

test('basic es5 tests', function(t) {
  let results;

  results = es5.grammar.match('let x = 3; console.log(x)');
  t.ok(results.succeeded(), 'Example in readme is valid');

  results = es5.grammar.match('let x =; console.log(x)');
  t.notOk(results.succeeded(), 'Basic invalid example fails');

  t.end();
});

