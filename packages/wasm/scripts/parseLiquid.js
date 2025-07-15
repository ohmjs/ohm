/*
  This script is meant to exercise the LiquidHTML grammar in a similar way
  to Shopify's Prettier plugin. It doesn't really do anything useful :-)

  https://github.com/Shopify/theme-tools/tree/main/packages/prettier-plugin-liquid
 */

/* eslint-disable no-console */
import fg from 'fast-glob';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {performance} from 'node:perf_hooks';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import * as ohm from 'ohm-js';

import {wasmMatcherForGrammar} from '../test/_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const liquid = ohm.grammars(readFileSync(join(datadir, '_liquid-html.ohm'), 'utf8'));

// Get pattern from command line arguments
const pattern = process.argv[2];

function unparse(source, root) {
  let pos = 0;
  let unparsed = '';
  function walk(node) {
    if (node.isTerminal()) {
      unparsed += source.slice(pos, pos + node.matchLength);
      pos += node.matchLength;
    }
    for (const child of node.children) {
      walk(child);
    }
  }
  walk(root);
  return unparsed;
}

const matchWithInput = (m, str) => (m.setInput(str), m.match());

(async function main() {
  const times = new Map();

  for (const path of fg.sync(pattern)) {
    const input = readFileSync(path, 'utf8');
    if (
      input.length > 64 * 1024 ||
      path.includes('swatch') ||
      path.includes('password') ||
      path.includes('theme.liquid') ||
      path.includes('gift_card.liquid')
    ) {
      console.log(`skipping ${path}`);
      continue;
    }
    const m = await wasmMatcherForGrammar(liquid.LiquidHTML);
    const start = performance.now();
    matchWithInput(m, input);
    const elapsed = performance.now() - start;
    times.set(path, [elapsed]);
    if (input.length !== unparse(input, m.getCstRoot()).length) {
      console.log('not equal:', path);
    }
  }

  for (const path of fg.sync(pattern)) {
    const input = readFileSync(path, 'utf8');
    if (!times.has(path)) {
      console.log(`skipping ${path}`);
      continue;
    }
    const start = performance.now();
    const result = liquid.LiquidHTML.match(input);
    const elapsed = performance.now() - start;
    times.get(path).push(elapsed);
    assert.equal(result.succeeded(), true);
  }

  let min;
  let max;
  let total = 0;
  for (const [path, [wasmTime, ohmTime]] of times) {
    const speedup = ohmTime / wasmTime;
    min = Math.min(min, speedup);
    max = Math.max(max, speedup);
    total += speedup;
    console.log(`${path}: ${speedup.toFixed(2)}x`);
  }
  console.log({min, max, avg: total / times.size});
})();
