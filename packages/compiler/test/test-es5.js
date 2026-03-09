import test from 'ava';
import {readFileSync} from 'node:fs';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';

import * as es5js from '../../../examples/ecmascript/index.js';
import {compileAndLoadAll, matchWithInput, unparse, legacyGrammarToWasm} from './_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, 'data');

const html5shivPath = join(datadir, '_html5shiv-3.7.3.js');
const es5GrammarSource = readFileSync(
  join(__dirname, '../../../examples/ecmascript/src/es5.ohm'),
  'utf8'
);

async function loadES5() {
  const grammars = await compileAndLoadAll(es5GrammarSource);
  return grammars.ES5;
}

test('basic es5 examples', async t => {
  const g = await loadES5();
  t.is(matchWithInput(g, 'x = 3;'), 1);
  t.is(matchWithInput(g, 'function foo() { return 1; }'), 1);
});

test('html5shiv', async t => {
  const source = await readFile(html5shivPath, 'utf8');

  const g = await legacyGrammarToWasm(es5js.grammar);
  let start = performance.now();
  es5js.grammar.match(source);
  t.log(`html5shiv (Ohm) match time: ${(performance.now() - start).toFixed(2)}ms`);
  start = performance.now();
  t.is(matchWithInput(g, source), 1);
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

  const g = await loadES5();
  t.is(matchWithInput(g, source), 1);
  t.is(unparse(g).trimEnd(), source.trimEnd());
});

test('matching at end', async t => {
  const g = await loadES5();
  t.false(g.match('', 'letter').use(r => r.succeeded()));
});
