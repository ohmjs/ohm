/* global URL */

import test from 'ava';
import fs from 'node:fs';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {matchWithInput, unparse, toWasmGrammar} from './_helpers.js';

const scriptRel = relPath => new URL(relPath, import.meta.url);
const grammarSource = fs.readFileSync(scriptRel('data/liquid-html.ohm'), 'utf8');

const grammars = ohm.grammars(grammarSource);

test('basic compilation', async t => {
  Object.values(grammars).forEach(async g => await toWasmGrammar(g));
  t.pass();
});

test('basic matching (small)', async t => {
  const input = `---
    layout: default
    ---
    {% assign year = page.started | date: '%Y' %}`;
  t.is(grammars.LiquidHTML.match(input).succeeded(), true);

  const g = await toWasmGrammar(grammars.LiquidHTML);
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
  const g = await toWasmGrammar(grammars.LiquidHTML);
  t.is(matchWithInput(g, input), 1);
});

test('html comment', async t => {
  const input = `{% if x %}
    <!-- x -->
  {% endif %}`;
  const g = await toWasmGrammar(grammars.LiquidHTML);
  t.is(matchWithInput(g, input), 1);
});

test('book-review.liquid', async t => {
  const input = fs.readFileSync(scriptRel('data/book-review.liquid'), 'utf8');
  let start = performance.now();
  t.is(grammars.LiquidHTML.match(input).succeeded(), true); // Trigger fillInputBuffer
  t.log(`Ohm.js: ${(performance.now() - start).toFixed(2)}ms`);

  const g = await toWasmGrammar(grammars.LiquidHTML);
  start = performance.now();
  t.is(matchWithInput(g, input), 1);
  t.log(`Wasm: ${(performance.now() - start).toFixed(2)}ms`);
});

test('liquidRawTagImpl', async t => {
  // Just verifies the shape of the CST for a specific example in the
  // LiquidHTML grammar. This was an example from Shopify's CST tests
  // that was failing due to the arity changes in the Wasm implementation.
  const sourceCode = `
    {% raw -%}
      {% if unclosed %}
        not a problem
    {%- endraw %}
  `;
  const g = await toWasmGrammar(grammars.LiquidHTML);
  const r = g.match(sourceCode);
  t.true(r.succeeded());
  const root = r._cst;
  t.is(root.ctorName, 'Node');
  t.is(root.startIdx, 5);
  t.not(root.leadingSpaces, null);
  const [opt, iter] = root.children;
  t.is(opt.startIdx, 5);
  t.true(opt.isOptional());
  t.is(opt.sourceString.length, 0);
  t.true(iter.isIter());
  t.true(iter.sourceString.startsWith('{% raw -%}'));

  const onlyChild = (node, ruleName = undefined) => {
    t.assert(node.children.length === 1);
    if (ruleName) {
      t.assert(node.children[0].ruleName === ruleName);
    }
    return node.children[0];
  };

  let child = onlyChild(iter, 'liquidNode');
  child = onlyChild(child, 'liquidRawTag');
  child = onlyChild(child, 'liquidRawTagImpl');
  t.is(child.children.length, 19);
});

test.failing('AttrSingleQuoted', async t => {
  const sourceCode = 'single=‘single‘';
  const g = await toWasmGrammar(grammars.LiquidHTML);
  const r = g.match(sourceCode, 'AttrSingleQuoted');
  t.true(r.succeeded());
});

test.failing('tagMarkup', async t => {
  const sourceCode = '"example-snippet", id: 2, foo█ ';
  const g = await toWasmGrammar(grammars.LiquidHTML);
  const r = g.match(sourceCode, 'AttrSingleQuoted');
  t.true(r.succeeded());
});
