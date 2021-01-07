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

test('hoistDeclarations()', t => {
  const result = es5.grammar.match(`
    function x() {}
    for (var x, y;;) {      // x shadows
      var z = function() {
        var y;              // no shadow
        var notHoisted;
      }
      var x;                // shadow
      while (true) {
        var z;              // shadow
      }
    }
  `);
  t.ok(result.succeeded());

  const bindings = es5.semantics(result).hoistDeclarations();
  t.deepEqual(Array.from(bindings.keys()), ['x', 'y', 'z']);
  t.equal(bindings.get('x').length, 3);
  t.equal(bindings.get('y').length, 1);
  t.equal(bindings.get('z').length, 2);

  t.end();
});
