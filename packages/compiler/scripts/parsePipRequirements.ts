// Benchmarks JS vs Wasm parsing of pip requirements files using the PEP 508 grammar.
// Sample usage:
//   node scripts/parsePipRequirements.js

/* eslint-disable no-console */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {performance} from 'node:perf_hooks';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import * as ohm from 'ohm-js-legacy';

import {Grammar} from 'ohm-js';
import {compile} from '../src/api.ts';
import {unparse} from '../test/_helpers.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const grammarSource = readFileSync(join(datadir, 'pep-508.ohm'), 'utf8');
const grammar = ohm.grammar(grammarSource);
const input = readFileSync(join(datadir, 'requirements_all.txt'), 'utf8');

(async function main() {
  // --- JS ---
  if (globalThis.gc) globalThis.gc();
  const jsHeapBefore = process.memoryUsage().heapUsed;

  const jsStart = performance.now();
  const r = grammar.match(input);
  const jsElapsed = performance.now() - jsStart;

  const peakJsHeap = process.memoryUsage().heapUsed - jsHeapBefore;
  assert.equal(r.succeeded(), true, `JS parse failed: ${r.shortMessage}`);

  // --- Wasm ---
  const modBytes = compile(grammarSource);
  const g = await Grammar.instantiate(modBytes);
  const {exports} = g._instance;

  const wasmStart = performance.now();
  const succeeded = g.match(input).use(r => {
    return r.succeeded() ? 1 : 0;
  });
  const wasmElapsed = performance.now() - wasmStart;
  assert.equal(succeeded, 1, 'Wasm parse failed');

  // Capture memory stats with a second match.
  let peakHeapBytes = 0;
  let peakWasmMemoryBytes = 0;
  g.match(input).use(() => {
    peakHeapBytes = exports.__offset.value - exports.__heap_base.value;
    peakWasmMemoryBytes = exports.memory.buffer.byteLength;
  });

  assert.equal(input.trim().length, unparse(g).trim().length);

  const fmt = bytes => {
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };
  console.log(`JS total: ${jsElapsed.toFixed(0)}ms`);
  console.log(`Wasm total: ${wasmElapsed.toFixed(0)}ms`);
  console.log(`Speedup:  ${(jsElapsed / wasmElapsed).toFixed(2)}x`);
  console.log(`Peak JS heap delta: ${fmt(peakJsHeap)}`);
  console.log(`Peak Wasm heap usage: ${fmt(peakHeapBytes)}`);
  console.log(`Peak Wasm linear memory: ${fmt(peakWasmMemoryBytes)}`);
})();
