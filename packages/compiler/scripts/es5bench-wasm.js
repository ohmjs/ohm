/* eslint-disable no-console */

import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import process from 'node:process';

import {Bench} from 'tinybench';

import {grammar} from '../../../examples/ecmascript/index.js';
import {Compiler} from '../src/Compiler.ts';
import {Grammar} from 'ohm-js';

// Parse flags and positional args.
const flags = new Set(process.argv.slice(2).filter(a => a.startsWith('--')));
const positionalArgs = process.argv.slice(2).filter(a => !a.startsWith('--'));

const filename = positionalArgs[0];
if (!filename) {
  console.error(
    'Usage: es5bench-wasm.js [--with-acorn] [--with-esprima] [--with-babel] <file>'
  );
  process.exit(1);
}

const source = readFileSync(filename, 'utf-8');

const fmt = n => {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)}MB`;
  return `${(n / 1024).toFixed(0)}KB`;
};

(async () => {
  // Compile the grammar to Wasm.
  const start = performance.now();
  const bytes = new Compiler(grammar).compile();
  const compileTime = performance.now() - start;
  console.error(`Compile: ${compileTime.toFixed(0)}ms`);

  // Instantiate the Wasm module.
  const wasmGrammar = new Grammar();
  await wasmGrammar._instantiate(bytes, {});

  const bench = new Bench({
    iterations: 3,
    time: 0,
    warmup: false,
  });

  const opts = {
    afterEach() {
      process.stderr.write('.');
    },
  };

  bench.add(
    'JS match',
    () => {
      grammar.match(source).succeeded();
    },
    opts
  );

  bench.add(
    'Wasm match',
    () => {
      wasmGrammar.match(source).use(r => r.succeeded());
    },
    opts
  );

  if (flags.has('--with-acorn')) {
    // pnpm install acorn
    const acorn = await import('acorn');
    bench.add(
      'Acorn parse',
      () => {
        acorn.parse(source, {ecmaVersion: 5, sourceType: 'script'});
      },
      opts
    );
  }

  if (flags.has('--with-esprima')) {
    // pnpm install esprima
    const esprima = await import('esprima');
    bench.add(
      'Esprima parse',
      () => {
        esprima.parseScript(source);
      },
      opts
    );
  }

  if (flags.has('--with-babel')) {
    // pnpm install @babel/parser
    const babel = await import('@babel/parser');
    bench.add(
      'Babel parse',
      () => {
        babel.parse(source, {sourceType: 'script'});
      },
      opts
    );
  }

  await bench.run();
  process.stderr.write('\n');

  for (const task of bench.tasks) {
    const {mean, sd, samplesCount} = task.result.latency;
    console.error(
      `${task.name}: ${mean.toFixed(1)}ms ± ${sd.toFixed(1)}ms (n=${samplesCount})`
    );
  }

  const wasmMean = bench.tasks[1].result.latency.mean;
  for (const task of bench.tasks) {
    if (task.name === 'Wasm match') continue;
    const ratio = task.result.latency.mean / wasmMean;
    console.error(`Wasm vs ${task.name}: ${ratio.toFixed(1)}x`);
  }

  const wasmMem = wasmGrammar.getMemorySizeBytes();
  console.error(`Wasm memory: ${fmt(wasmMem)}`);
})();
