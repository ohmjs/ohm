/* global URL */

import test from 'ava';
import fs from 'node:fs';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {WasmMatcher} from '../src/index.js';

const matchWithInput = (m, str) => (m.setInput(str), m.match());

const scriptRel = relPath => new URL(relPath, import.meta.url);
const grammarSource = fs.readFileSync(scriptRel('data/_liquid-html.ohm'), 'utf8');
const input = fs.readFileSync(scriptRel('data/_book-review.liquid'), 'utf8');

// eslint-disable-next-line ava/no-skip-test
test.skip('basic matching', async t => {
  const ns = ohm.grammars(grammarSource);
  let start = performance.now();
  t.is(ns.LiquidHTML.match(input).succeeded(), true); // Trigger fillInputBuffer
  t.log(`Ohm.js: ${(performance.now() - start).toFixed(2)}ms`);

  const m = await WasmMatcher.fromGrammar(ns.LiquidHTML);
  start = performance.now();
  t.is(matchWithInput(m, input), 1);
  t.log(`Wasm: ${(performance.now() - start).toFixed(2)}ms`);
});
