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

import {unparse, wasmMatcherForGrammar} from '../test/_helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const liquid = ohm.grammars(readFileSync(join(datadir, 'liquid-html.ohm'), 'utf8'));

// Get pattern from command line arguments
const pattern = process.argv[2];

const matchWithInput = (m, str) => (m.setInput(str), m.match());

(async function main() {
  const parsedPaths = new Set();
  const jsTimes = [];
  const wasmTimes = [];

  for (const path of fg.sync(pattern)) {
    const input = readFileSync(path, 'utf8');
    // Wasm matcher currently has a limit of 64kB input size.
    if (input.length > 64 * 1024) {
      console.log(`skipping ${path} (too big)`);
      continue;
    }
    const start = performance.now();
    const r = liquid.LiquidHTML.match(input);
    const elapsed = performance.now() - start;
    if (!r.succeeded()) {
      console.error(`Failed to parse ${path}: ${r.message}`);
      continue;
    }
    parsedPaths.add(path);
    jsTimes.push(elapsed);
    assert.equal(r.succeeded(), true, `failed: ${path}`);
  }

  const m = await wasmMatcherForGrammar(liquid.LiquidHTML);
  for (const path of fg.sync(pattern)) {
    if (!parsedPaths.has(path)) continue;
    const input = readFileSync(path, 'utf8');
    const start = performance.now();
    assert.equal(matchWithInput(m, input), 1, `failed: ${path}`);
    wasmTimes.push(performance.now() - start);

    // Trailing/leading spaces are currently dropped, so trim both
    // to after unparsing.
    assert.equal(input.trim().length, unparse(m).trim().length);
  }

  const sum = arr => arr.reduce((a, b) => a + b, 0);
  const jsTotal = sum(jsTimes);
  const wasmTotal = sum(wasmTimes);
  console.log(`JS total: ${jsTotal.toFixed(0)}ms`);
  console.log(`Wasm avg: ${wasmTotal.toFixed(0)}ms`);
  console.log(`Speedup:  ${(jsTotal / wasmTotal).toFixed(2)}x`);
})();
