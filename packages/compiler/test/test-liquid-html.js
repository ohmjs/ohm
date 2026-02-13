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
  const [opt, list] = root.children;
  t.true(opt.isEmpty());
  t.true(list.isList());
  const sourceString = list.collect(x => x.sourceString).join('');
  t.true(sourceString.startsWith('{% raw -%}'));

  const onlyChild = (node, ruleName = undefined) => {
    t.assert(node.children.length === 1);
    if (ruleName) {
      t.assert(node.children[0].ctorName === ruleName);
    }
    return node.children[0];
  };

  let child = onlyChild(list, 'liquidNode');
  child = onlyChild(child, 'liquidRawTag');
  child = onlyChild(child, 'liquidRawTagImpl');
  t.is(child.children.length, 19);
});

test('AttrSingleQuoted', async t => {
  const sourceCode = 'single=‘single‘';
  const g = await toWasmGrammar(grammars.LiquidHTML);
  const r = g.match(sourceCode, 'AttrSingleQuoted');
  t.true(r.succeeded());
});

test('tagMarkup', async t => {
  const sourceCode = '"example-snippet", id: 2, foo█ ';
  const g = await toWasmGrammar(grammars.LiquidHTML);
  const r = g.match(sourceCode, 'tagMarkup');
  t.true(r.succeeded());
});

test('Not discards child failures', async t => {
  // Grammar where Not's child failures should be completely discarded
  const simpleG = ohm.grammar('G { start = (~space any)+ ">" }');
  const wg = await toWasmGrammar(simpleG);

  // 'abc!' fails because no '>' at end. Inside the star, ~space tries space
  // which fails and records "a space" — but Not should discard it.
  wg.match('abc!').use(r1 => {
    const jsR1 = simpleG.match('abc!');
    t.is(r1.getExpectedText(), jsR1.getExpectedText());
  });

  // Test with alternation inside Not (like the real grammar)
  const altG = ohm.grammar('G { start = (~(space | "\'" | "{{") any)+ ">" }');
  const wg2 = await toWasmGrammar(altG);
  wg2.match('abc!').use(r2 => {
    const jsR2 = altG.match('abc!');
    t.is(r2.getExpectedText(), jsR2.getExpectedText());
  });
});

// Compare sorted descriptions — the content must match, but the wasm compiler's
// grammar transformations may produce a different ordering than the JS interpreter.
const sortDescriptions = text =>
  text
    .split(/, (?:or )?|(?:^| )or /)
    .sort()
    .join(', ');

test('failure message', async t => {
  const g = await toWasmGrammar(grammars.LiquidHTML);
  const getExpectedText = input => g.match(input).use(r => r.getExpectedText());

  t.is(getExpectedText('{%if cond }}'), '"%}"');

  t.is(getExpectedText('{% if cond }}'), '"%}"');
  t.is(getExpectedText('< a href = "abc" "></a>'), '"script", "style", or "svg"');

  const input = `
    <a href="abc" "></a>
  `;
  t.is(
    sortDescriptions(getExpectedText(input)),
    sortDescriptions(grammars.LiquidHTML.match(input).getExpectedText())
  );

  t.is(
    getExpectedText('<a href="abc" {%></a>'),
    [
      '"doc", "comment", "raw", "javascript", "schema", "stylesheet",',
      '"style", "end", "case", "capture", "form", "for", "tablerow",',
      '"if", "paginate", "unless", "ifchanged", "assign", "break",',
      '"continue", "cycle", "content_for", "decrement", "echo", "else",',
      '"elsif", "include", "increment", "layout", "liquid", "render",',
      '"section", "sections", "when", a letter, or "#"',
    ].join(' ')
  );
});
