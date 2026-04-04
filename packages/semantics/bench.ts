import {readFileSync} from 'node:fs';
import process from 'node:process';

import {Bench} from 'tinybench';
import * as ohm from '@ohm-js/compiler/compat';

import {createOperation} from './src/index.ts';
import {createReaderOperation} from './src/reader.ts';

const smallSize = process.argv.includes('--small-size');

const scriptRel = (relPath: string) => new URL(relPath, import.meta.url);
const es5Source = readFileSync(scriptRel('../../examples/ecmascript/src/es5.ohm'), 'utf8');
const g = ohm.grammars(es5Source).ES5;

const input = smallSize
  ? 'var x = 1 + 2;'
  : readFileSync(scriptRel('../compiler/test/data/_underscore-1.8.3.js'), 'utf8');

// --- CstNode-based (createOperation) ---

const countNodesCstNode = createOperation<number>('countNodes', {
  _nonterminal(ctx, ...children) {
    let sum = 1;
    for (const c of children) sum += countNodesCstNode(c);
    return sum;
  },
  _terminal(ctx) {
    return 1;
  },
  _default(ctx, ...children) {
    let sum = 1;
    for (const c of children) sum += countNodesCstNode(c);
    return sum;
  },
});

// --- CstReader-based (createReaderOperation) ---

let _cst: any;

const countNodesCstReader = createReaderOperation<number>('countNodes', {
  _nonterminal(h) {
    let sum = 1;
    _cst.forEachChild(h, child => {
      sum += countNodesCstReader(_cst, child);
    });
    return sum;
  },
  _terminal(h) {
    return 1;
  },
  _default(h) {
    let sum = 1;
    _cst.forEachChild(h, child => {
      sum += countNodesCstReader(_cst, child);
    });
    return sum;
  },
});

// --- Benchmark ---

const opts = {
  afterEach() {
    process.stderr.write('.');
  },
};

const bench = new Bench({
  iterations: smallSize ? 1 : 10,
  time: 0,
  warmup: !smallSize,
  throws: true,
});

bench.add(
  'createOperation (CstNode)',
  () => g.match(input).use((r: any) => countNodesCstNode(r.cstView().rootNode())),
  opts
);

bench.add(
  'createReaderOperation (CstReader)',
  () =>
    g.match(input).use((r: any) => {
      const cst = r.cstView();
      _cst = cst;
      return countNodesCstReader(_cst, cst.root);
    }),
  opts
);

console.log(`Input: ${smallSize ? 'small' : 'underscore-1.8.3.js'} (${input.length} bytes)\n`);

(async () => {
  await bench.run();
  process.stderr.write('\n');

  for (const task of bench.tasks) {
    const {mean, sd, samplesCount} = task.result!.latency;
    console.log(`${task.name}: ${mean.toFixed(0)}ms ± ${sd.toFixed(0)}ms (n=${samplesCount})`);
  }

  const cstNodeMean = bench.tasks[0].result!.latency.mean;
  const cstReaderMean = bench.tasks[1].result!.latency.mean;
  console.log(`\nSpeedup: ${(cstNodeMean / cstReaderMean).toFixed(2)}x`);
})();
