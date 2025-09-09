/* global URL */

import {compile} from '../compile.js';
import * as es5 from './es5.js';

import test from 'ava';
import {join} from 'node:path';

const testdataPath = filename => new URL(join('testdata', filename), import.meta.url);

test('es5 - basic tests', t => {
  let results = es5.grammar.match('var x = 3; console.log(x)');
  t.truthy(results.succeeded(), 'Example in readme is valid');

  results = es5.grammar.match('var x =; console.log(x)');
  t.falsy(results.succeeded(), 'Basic invalid example fails');
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
  t.truthy(result.succeeded());

  const bindings = es5.semantics(result).hoistDeclarations();
  t.deepEqual(Array.from(bindings.keys()), ['x', 'y', 'z']);
  t.is(bindings.get('x').length, 3);
  t.is(bindings.get('y').length, 1);
  t.is(bindings.get('z').length, 2);
});

test('es5 - parsing underscore.js', t => {
  t.truthy(compile([testdataPath('underscore-1.0.0.js')]));
});

test('es6', t => {
  t.truthy(compile(['-g', 'es6', testdataPath('test.es6')]));
});
