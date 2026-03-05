import {readFileSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

import {Bench} from 'tinybench';
import {grammar} from '@ohm-js/compiler/compat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const json = grammar(readFileSync(path.join(__dirname, 'json.ohm'), 'utf-8'));
const fastjson = grammar(readFileSync(path.join(__dirname, 'fastjson.ohm'), 'utf-8'));

// The benchmark file assigns a JSON string to `self.sample`.
// Evaluate it to extract the actual JSON.
const jsSource = readFileSync(path.join(__dirname, 'test/data/1K_json.js'), 'utf-8');
const self: Record<string, string> = {};
new Function('self', jsSource)(self);
let input = self.sample;

const {values} = parseArgs({
  options: {'small-size': {type: 'boolean', default: false}},
});
const smallSize = values['small-size'];

// For 'small-size' just test some random JSON.
if (smallSize) {
  input = '{ "extends": "../tsconfig.base.json", "include": ["*.ts", "test/**/*.ts"] }';
}

const bench = new Bench({
  iterations: smallSize ? 1 : 10,
  time: 0,
  warmup: !smallSize,
});

const opts = {
  afterEach() {
    process.stderr.write('.');
  },
};

bench.add('JSON', () => json.match(input).use(r => r.succeeded()), opts);
bench.add('FastJSON', () => fastjson.match(input).use(r => r.succeeded()), opts);
bench.add('JSON.parse', () => JSON.parse(input), opts);

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
