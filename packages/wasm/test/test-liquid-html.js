/* global URL */

import test from 'ava';
import fs from 'node:fs';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {matchWithInput, unparse, toWasmGrammar} from './_helpers.js';

const scriptRel = relPath => new URL(relPath, import.meta.url);
const grammarSource = fs.readFileSync(scriptRel('data/liquid-html.ohm'), 'utf8');

const liquid = ohm.grammars(grammarSource);

test('basic matching (small)', async t => {
  const input = `---
    layout: default
    ---
    {% assign year = page.started | date: '%Y' %}`;
  t.is(liquid.LiquidHTML.match(input).succeeded(), true);

  const g = await toWasmGrammar(liquid.LiquidHTML);
  t.is(matchWithInput(g, input), 1);
  t.is(unparse(g), input);
});

test('swatch.liquid', async t => {
  const input = `<span
  {% if y %}
  {% else %}
    class="{% if x == 'x' %}x{% endif %}"
  {% endif %}
>`;
  const g = await toWasmGrammar(liquid.LiquidHTML);
  t.is(matchWithInput(g, input), 1);
});

test('html comment', async t => {
  const input = `{% if x %}
    <!-- x -->
  {% endif %}`;
  const g = await toWasmGrammar(liquid.LiquidHTML);
  t.is(matchWithInput(g, input), 1);
});

test('book-review.liquid', async t => {
  const input = fs.readFileSync(scriptRel('data/book-review.liquid'), 'utf8');
  let start = performance.now();
  t.is(liquid.LiquidHTML.match(input).succeeded(), true); // Trigger fillInputBuffer
  t.log(`Ohm.js: ${(performance.now() - start).toFixed(2)}ms`);

  const g = await toWasmGrammar(liquid.LiquidHTML);
  start = performance.now();
  t.is(matchWithInput(g, input), 1);
  t.log(`Wasm: ${(performance.now() - start).toFixed(2)}ms`);
});
