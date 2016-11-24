'use strict';

var test = require('tape-catch');

var es5 = require('../../../examples/ecmascript');

test('basic es5 tests', function(t) {
  var results;

  results = es5.grammar.match('var x = 3; console.log(x)');
  t.ok(results.succeeded(), 'Example in readme is valid');

  results = es5.grammar.match('var x =; console.log(x)');
  t.notOk(results.succeeded(), 'Basic invalid example fails');

  t.end();
});

