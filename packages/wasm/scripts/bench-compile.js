import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';
import * as ohm from 'ohm-js';

import {Compiler} from '../src/Compiler.js';
import {WasmGrammar} from '@ohm-js/runtime';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, '../test/data');

const liquidSource = readFileSync(join(datadir, 'liquid-html.ohm'), 'utf8');

const ITERATIONS = 5;

console.log('=== Grammar compilation + instantiation benchmark ===\n');

// --- v17: ohm.grammars() ---
{
  const times = [];
  for (let i = 0; i < ITERATIONS; i++) {
    const start = performance.now();
    const gs = ohm.grammars(liquidSource);
    times.push(performance.now() - start);
  }
  console.log('v17 ohm.grammars() [LiquidHTML]:');
  console.log(`  times: ${times.map(t => t.toFixed(1) + 'ms').join(', ')}`);
  console.log(`  min:   ${Math.min(...times).toFixed(1)}ms`);
  console.log();
}

// --- Wasm: compile + instantiate (from source) ---
{
  // Step 1: Parse with v17 (required to get Grammar objects for compiler)
  const parseStart = performance.now();
  const gs = ohm.grammars(liquidSource);
  const v17ParseTime = performance.now() - parseStart;

  // Step 2: Compile to Wasm
  const compileTimes = [];
  const instantiateTimes = [];
  const totalTimes = [];
  let wasmBytes;

  for (let i = 0; i < ITERATIONS; i++) {
    const compileStart = performance.now();
    const compiler = new Compiler(gs.LiquidHTML);
    wasmBytes = compiler.compile();
    const compileEnd = performance.now();
    compileTimes.push(compileEnd - compileStart);

    const instStart = performance.now();
    const g = new WasmGrammar(wasmBytes);
    const instEnd = performance.now();
    instantiateTimes.push(instEnd - instStart);

    totalTimes.push(compileEnd - compileStart + instEnd - instStart);
  }

  console.log('Wasm compile (Compiler.compile()) [LiquidHTML]:');
  console.log(`  times: ${compileTimes.map(t => t.toFixed(1) + 'ms').join(', ')}`);
  console.log(`  min:   ${Math.min(...compileTimes).toFixed(1)}ms`);
  console.log(`  wasm size: ${wasmBytes.byteLength} bytes`);
  console.log();

  console.log('Wasm instantiate (sync, from bytes) [LiquidHTML]:');
  console.log(`  times: ${instantiateTimes.map(t => t.toFixed(1) + 'ms').join(', ')}`);
  console.log(`  min:   ${Math.min(...instantiateTimes).toFixed(1)}ms`);
  console.log();

  console.log('Wasm total (compile + instantiate, excludes v17 parse):');
  console.log(`  times: ${totalTimes.map(t => t.toFixed(1) + 'ms').join(', ')}`);
  console.log(`  min:   ${Math.min(...totalTimes).toFixed(1)}ms`);
  console.log();

  console.log('End-to-end (v17 parse + compile + instantiate):');
  console.log(
    `  v17 parse: ${v17ParseTime.toFixed(1)}ms + compile+inst min: ${Math.min(...totalTimes).toFixed(1)}ms = ${(v17ParseTime + Math.min(...totalTimes)).toFixed(1)}ms`
  );
  console.log();
}

// --- Wasm: instantiate from pre-compiled .wasm file ---
{
  const wasmPath = join(__dirname, '../build/liquid-html.wasm');
  let precompiledBytes;
  try {
    precompiledBytes = readFileSync(wasmPath);
  } catch {
    console.log('(No pre-compiled liquid-html.wasm found, skipping)');
  }

  if (precompiledBytes) {
    const times = [];
    for (let i = 0; i < ITERATIONS; i++) {
      const start = performance.now();
      const g = new WasmGrammar(precompiledBytes);
      times.push(performance.now() - start);
    }
    console.log('Wasm instantiate from pre-compiled .wasm [LiquidHTML]:');
    console.log(`  times: ${times.map(t => t.toFixed(1) + 'ms').join(', ')}`);
    console.log(`  min:   ${Math.min(...times).toFixed(1)}ms`);
    console.log(`  file size: ${precompiledBytes.byteLength} bytes`);
  }
}
