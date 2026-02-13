import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import process from 'node:process';

import {grammar} from '../../../examples/ecmascript/index.js';
import {Compiler} from '../src/Compiler.js';
import {WasmGrammar} from '@ohm-js/runtime';

const filename = process.argv[2];
if (!filename) {
  console.error('Usage: es5bench-wasm.js <file>');
  process.exit(1);
}

const source = readFileSync(filename, 'utf-8');

const fmt = n => {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)}MB`;
  return `${(n / 1024).toFixed(0)}KB`;
};

// Compile the grammar to Wasm.
let start = performance.now();
const bytes = new Compiler(grammar).compile();
const elapsed = performance.now() - start;
console.error(`Compile: ${elapsed.toFixed(0)}ms`);

// Instantiate the Wasm module.
const wasmGrammar = new WasmGrammar();
await wasmGrammar._instantiate(bytes, {});

// JS matching.
globalThis.gc?.();
const jsHeapBefore = process.memoryUsage().heapUsed;
start = performance.now();
grammar.match(source);
const jsTime = performance.now() - start;
const jsHeapAfter = process.memoryUsage().heapUsed;
const jsMem = jsHeapAfter - jsHeapBefore;
console.error(`Match (JS):   ${jsTime.toFixed(0)}ms, ${fmt(jsMem)}`);

// Wasm matching.
globalThis.gc?.();
start = performance.now();
wasmGrammar.match(source).dispose();
const wasmTime = performance.now() - start;
const wasmMem = wasmGrammar.getMemorySizeBytes();
console.error(`Match (Wasm): ${wasmTime.toFixed(0)}ms, ${fmt(wasmMem)}`);

console.error(`Speedup: ${(jsTime / wasmTime).toFixed(1)}x`);
