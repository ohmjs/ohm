import test from 'ava';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';

import * as es5js from '../../../examples/ecmascript/index.js';
import {matchWithInput, unparse, wasmMatcherForGrammar} from './_helpers.js';
import es5 from './data/_es5.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, 'data');

const html5shivPath = join(datadir, '_html5shiv-3.7.3.js');

test('basic es5 examples', async t => {
  const m = await wasmMatcherForGrammar(es5);
  t.is(matchWithInput(m, 'x = 3;'), 1);
  t.is(matchWithInput(m, 'function foo() { return 1; }'), 1);
});

test('html5shiv', async t => {
  const source = await readFile(html5shivPath, 'utf8');

  const m = await wasmMatcherForGrammar(es5);
  let start = performance.now();
  es5js.grammar.match(source);
  t.log(`html5shiv (Ohm) match time: ${(performance.now() - start).toFixed(2)}ms`);
  start = performance.now();
  t.is(matchWithInput(m, source), 1);
  t.log(`html5shiv (Wasm) match time: ${(performance.now() - start).toFixed(2)}ms`);
});

test('unparsing', async t => {
  // TODO: Change it back to "Müller" once any properly matches code points.
  const source = String.raw`
    var obj = {_nm: "Thomas", "full-name": "Thomas Mueller", name: function() { return this._nm; }};
    var arr = [1, "hello", true, null, {x: 2}];
    function Car(brand) { this.brand = brand; }
    Car.prototype.start = function() { return this.brand + " started"; };
    var car = new Car("BMW");
    (function(x) { console.log("IIFE: " + x); })(42);
    for (var i in obj) if (obj.hasOwnProperty(i)) console.log(i);
    var result = obj.name === "John" ? "match" : "no match";
    try {
        var test = typeof arr instanceof Array && !false || 5 + 3 * 2;
    } catch (e) {
    } finally {
    }
    var counter = (function() { var n = 0; return function() { return ++n; }; })();
    /\d+/.test("123") && console.log(counter());
  `;

  const m = await wasmMatcherForGrammar(es5);
  t.is(matchWithInput(m, source), 1);
  t.is(unparse(m), source);
});
