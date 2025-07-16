/* global URL */

import test from 'ava';
import fs from 'node:fs';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {wasmMatcherForGrammar} from './_helpers.js';

const matchWithInput = (m, str) => (m.setInput(str), m.match());

const scriptRel = relPath => new URL(relPath, import.meta.url);
const grammarSource = fs.readFileSync(scriptRel('data/_liquid-html.ohm'), 'utf8');
const input = fs.readFileSync(scriptRel('data/_book-review.liquid'), 'utf8');

const liquid = ohm.grammars(grammarSource);

test('basic matching (small)', async t => {
  const input = `---
layout: default
---
{% assign year = page.started | date: '%Y' %}`;
  t.is(liquid.LiquidHTML.match(input).succeeded(), true);

  const m = await wasmMatcherForGrammar(liquid.LiquidHTML);
  t.is(matchWithInput(m, input), 1);
});

test('basic matching', async t => {
  let start = performance.now();
  t.is(liquid.LiquidHTML.match(input).succeeded(), true); // Trigger fillInputBuffer
  t.log(`Ohm.js: ${(performance.now() - start).toFixed(2)}ms`);

  const m = await wasmMatcherForGrammar(liquid.LiquidHTML);
  start = performance.now();
  t.is(matchWithInput(m, input), 1);
  t.log(`Wasm: ${(performance.now() - start).toFixed(2)}ms`);
});
