import {readFileSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

import {Bench} from 'tinybench';
import {grammar} from '@ohm-js/compiler/compat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ohmSource = readFileSync(path.join(__dirname, 'json.ohm'), 'utf-8');
const json = grammar(ohmSource);

// The benchmark file assigns a JSON string to `self.sample`.
// Evaluate it to extract the actual JSON.
const jsSource = readFileSync(path.join(__dirname, 'test/data/1K_json.js'), 'utf-8');
const self: Record<string, string> = {};
new Function('self', jsSource)(self);
const input = self.sample;

// Sanity check: verify JSON.parse and our grammar both accept it.
JSON.parse(input);
json.match(input).use(r => {
  if (!r.succeeded()) throw new Error('Match failed');
});
console.error(`Input: 1K_json.js (${(input.length / 1024).toFixed(0)}KB)`);

const smallSize = process.argv.includes('--small-size');
const iterations = smallSize ? 1 : 10;

const bench = new Bench({
  iterations,
  time: 0,
  warmup: true,
});

const opts = {
  afterEach() {
    process.stderr.write('.');
  },
};

bench.add(
  'ohm (wasm)',
  () => {
    json.match(input).use(r => r.succeeded());
  },
  opts
);

bench.add(
  'JSON.parse',
  () => {
    JSON.parse(input);
  },
  opts
);

(async () => {
  await bench.run();
  process.stderr.write('\n');

  for (const task of bench.tasks) {
    const {state} = task.result;
    if (state !== 'completed') continue;
    const {mean, sd, samplesCount} = task.result.latency;
    console.error(
      `${task.name}: ${mean.toFixed(2)}ms ± ${sd.toFixed(2)}ms (n=${samplesCount})`
    );
  }
})();
