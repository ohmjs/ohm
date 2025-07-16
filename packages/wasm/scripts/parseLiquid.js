/*
  This script is meant to exercise the LiquidHTML grammar in a similar way
  to Shopify's Prettier plugin. It doesn't really do anything useful :-)

  https://github.com/Shopify/theme-tools/tree/main/packages/prettier-plugin-liquid
 */
// Sample usage:
//   node scripts/parseLiquid.js '/Users/pdubroy/dev/third_party/Shopify/dawn/**/*.liquid'

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

const liquid = ohm.grammars(readFileSync(join(datadir, '_liquid-html-mod.ohm'), 'utf8'));

// Get pattern from command line arguments
const pattern = process.argv[2];

function unparseW(source, root) {
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
  const parsedPaths = new Set();
  const jsTimes = [];
  const wasmTimes = [];

  const m = await wasmMatcherForGrammar(liquid.LiquidHTML);
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
    parsedPaths.add(path);
    const start = performance.now();
    matchWithInput(m, input);
    wasmTimes.push(performance.now() - start);
    assert.equal(input.length, unparseW(input, m.getCstRoot()).length);
  }

  for (const path of fg.sync(pattern)) {
    const input = readFileSync(path, 'utf8');
    if (!parsedPaths.has(path)) {
      continue;
    }
    const start = performance.now();
    const r = liquid.LiquidHTML.match(input);
    jsTimes.push(performance.now() - start);
    assert.equal(r.succeeded(), true);
  }

  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const jsTotal = sum(jsTimes);
  const wasmTotal = sum(wasmTimes);
  console.log(`JS total: ${jsTotal.toFixed(0)}ms`);
  console.log(`Wasm avg: ${wasmTotal.toFixed(0)}ms`);
  console.log(`Speedup:  ${(jsTotal / wasmTotal).toFixed(2)}x`);
})();
