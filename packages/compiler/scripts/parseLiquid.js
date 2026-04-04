/*
  This script is meant to exercise the LiquidHTML grammar in a similar way
  to Shopify's Prettier plugin. It doesn't really do anything useful :-)

  https://github.com/Shopify/theme-tools/tree/main/packages/prettier-plugin-liquid
 */
// Sample usage:
//   node scripts/parseLiquid.js '/Users/pdubroy/dev/third_party/Shopify/dawn/**/*.liquid'

/* eslint-disable no-console */
import fg from 'fast-glob';
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import * as ohm from 'ohm-js-legacy';
import {Bench} from 'tinybench';

import {Grammar} from 'ohm-js';
import {compileGrammars} from '../src/api.ts';
import {unparse} from '../test/_helpers.js';
import {CstNodeType} from '../../runtime/src/cstReader.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const grammarSource = readFileSync(join(datadir, 'liquid-html.ohm'), 'utf8');
const liquid = ohm.grammars(grammarSource);

// Parse flags and positional args.
const flags = new Set(process.argv.slice(2).filter(a => a.startsWith('--')));
const positionalArgs = process.argv.slice(2).filter(a => !a.startsWith('--'));

// An option that makes it easy to run this script in CI.
// https://matklad.github.io/2024/03/22/basic-things.html
const smallSize = flags.has('--small-size');
const includeUnparse = flags.has('--include-unparse');
const useCstReader = flags.has('--cst-reader');

// Get pattern from command line arguments
const pattern = positionalArgs[0];

(async function main() {
  // Pre-read all files.
  const files = [];
  for (const path of fg.sync(pattern)) {
    const input = readFileSync(path, 'utf8');
    files.push({path, input});
    if (smallSize) break;
  }

  const bench = new Bench({
    iterations: 3,
    time: 0,
    warmup: false,
    throws: true,
  });

  const opts = {
    afterEach() {
      process.stderr.write('.');
    },
  };

  // Walk v17 CST, collecting terminal text.
  function unparseV17(matchResult, input) {
    let ans = '';
    function walk(node, pos) {
      if (node.isTerminal()) {
        ans += input.slice(pos, pos + node.matchLength);
        return;
      }
      for (let i = 0; i < node.children.length; i++) {
        walk(node.children[i], pos + node.childOffsets[i]);
      }
    }
    walk(matchResult._cst, matchResult._cstOffset);
    return ans;
  }

  // Compile to Wasm.
  const compileStart = bench.now();
  const allBytes = compileGrammars(grammarSource);
  const compileTime = bench.now() - compileStart;
  const modBytes = allBytes.LiquidHTML;
  const g = await Grammar.instantiate(modBytes);
  const {exports} = g._instance;
  let peakWasmHeapBytes = 0;
  let peakWasmMemoryBytes = 0;

  bench.add(
    includeUnparse ? 'JS parse+unparse' : 'JS parse',
    () => {
      let overriddenDuration = 0;
      for (const {input} of files) {
        const start = bench.now();
        const r = liquid.LiquidHTML.match(input);
        if (!includeUnparse) overriddenDuration += bench.now() - start;
        unparseV17(r, input);
        if (includeUnparse) overriddenDuration += bench.now() - start;
      }
      return {overriddenDuration};
    },
    opts
  );

  // Walk CST using CstReader, collecting terminal text.
  function unparseCstReader(matchResult) {
    const cst = matchResult.cst();
    let ans = '';
    function walk(handle) {
      if (cst.type(handle) === CstNodeType.TERMINAL) {
        ans += cst.sourceString(handle);
        return;
      }
      cst.forEachChild(handle, (child, _leadingSpaces) => {
        walk(child);
      });
    }
    walk(cst.root);
    return ans;
  }

  const wasmLabel = includeUnparse ? 'Wasm parse+unparse' : 'Wasm parse';
  bench.add(
    useCstReader ? `${wasmLabel} (CstReader)` : wasmLabel,
    () => {
      let overriddenDuration = 0;
      for (const {input} of files) {
        const start = bench.now();
        const m = g.match(input);
        if (!includeUnparse) overriddenDuration += bench.now() - start;
        m.use(() => {
          // Capture memory stats before dispose() resets the heap.
          peakWasmHeapBytes = Math.max(
            peakWasmHeapBytes,
            exports.__offset.value - exports.__heap_base.value
          );
          peakWasmMemoryBytes = Math.max(
            peakWasmMemoryBytes,
            exports.memory.buffer.byteLength
          );
          return useCstReader ? unparseCstReader(m) : unparse(g);
        });
        if (includeUnparse) overriddenDuration += bench.now() - start;
      }
      return {overriddenDuration};
    },
    opts
  );

  await bench.run();
  process.stderr.write('\n');

  const fmt = bytes => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  for (const task of bench.tasks) {
    const {mean, sd, samplesCount} = task.result.latency;
    console.log(`${task.name}: ${mean.toFixed(0)}ms ± ${sd.toFixed(0)}ms (n=${samplesCount})`);
  }

  const jsParse = bench.tasks[0].result.latency.mean;
  const wasmParse = bench.tasks[1].result.latency.mean;
  console.log(`Speedup: ${(jsParse / wasmParse).toFixed(2)}x`);
  console.log(`Compile: ${compileTime.toFixed(0)}ms`);
  console.log(`Compiled grammar size: ${fmt(modBytes.length)}`);
  console.log(`Peak Wasm heap usage: ${fmt(peakWasmHeapBytes)}`);
  console.log(`Peak Wasm linear memory: ${fmt(peakWasmMemoryBytes)}`);
})();
