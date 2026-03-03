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

import {Compiler} from '../src/Compiler.ts';
import {unparse, toWasmGrammar} from '../test/_helpers.js';
import {createReader, NO_NODE} from '../../runtime/src/cstReader.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const liquid = ohm.grammars(readFileSync(join(datadir, 'liquid-html.ohm'), 'utf8'));

// Parse flags and positional args.
const flags = new Set(process.argv.slice(2).filter(a => a.startsWith('--')));
const positionalArgs = process.argv.slice(2).filter(a => !a.startsWith('--'));

// An option that makes it easy to run this script in CI.
// https://matklad.github.io/2024/03/22/basic-things.html
const smallSize = flags.has('--small-size');
const includeUnparse = flags.has('--include-unparse');
const useCstReader = flags.has('--cst-reader');
const useCstReaderPacked = flags.has('--cst-reader-packed');

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
  const modBytes = new Compiler(liquid.LiquidHTML).compile();
  const compileTime = bench.now() - compileStart;
  const g = await toWasmGrammar(liquid.LiquidHTML, {modBytes});
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

  // Walk CST using CstReader (raw handles), collecting terminal text.
  function unparseCstReaderRaw(matchResult) {
    const reader = createReader(matchResult);
    const inp = reader.input;
    let ans = '';
    function walk(handle, startIdx) {
      if (reader.isTerminal(handle)) {
        ans += inp.slice(startIdx, startIdx + reader.matchLength(handle));
        return;
      }
      reader.forEachChild(handle, startIdx, (child, _leadingSpaces, childStartIdx) => {
        walk(child, childStartIdx);
      });
    }
    if (reader.rootLeadingSpacesHandle !== -1) {
      walk(reader.rootLeadingSpacesHandle, 0);
    }
    walk(reader.rootHandle, reader.rootStartIdx);
    return ans;
  }

  // Walk CST using CstReader (handles with startIdx), collecting terminal text.
  function unparseCstReaderPacked(matchResult) {
    const reader = createReader(matchResult, {packStartIdx: true});
    let ans = '';
    function walk(handle) {
      if (reader.isTerminal(handle)) {
        ans += reader.sourceString(handle);
        return;
      }
      reader.forEachChild(handle, (child, _leadingSpaces) => {
        walk(child);
      });
    }
    if (reader.rootLeadingSpaces !== NO_NODE) {
      walk(reader.rootLeadingSpaces);
    }
    walk(reader.root);
    return ans;
  }

  const wasmLabel = includeUnparse ? 'Wasm parse+unparse' : 'Wasm parse';
  bench.add(
    useCstReaderPacked
      ? `${wasmLabel} (CstReader packed)`
      : useCstReader
        ? `${wasmLabel} (CstReader)`
        : wasmLabel,
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
          return useCstReaderPacked
            ? unparseCstReaderPacked(m)
            : useCstReader
              ? unparseCstReaderRaw(m)
              : unparse(g);
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
