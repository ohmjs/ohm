/* eslint-disable no-console */

import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

import {Bench} from 'tinybench';
import {grammar} from '@ohm-js/compiler/compat';
import type {NonterminalNode} from 'ohm-js';

import {createMatcher, tokenize} from './tokenizer.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ohmSource = readFileSync(path.join(__dirname, 'python3.ohm'), 'utf-8');
const python = grammar(ohmSource);
const matchPython = createMatcher(python);

const filePath = path.join(__dirname, 'test/data/argparse.py');
const input = readFileSync(filePath, 'utf-8');
console.error(`Input: argparse.py (${(input.length / 1024).toFixed(0)}KB)`);

const iterations = 5;

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
  'tokenize',
  () => {
    tokenize(input);
  },
  opts
);

bench.add(
  'tokenize + parse',
  () => {
    const r = matchPython(input);
    r.use(r => r.succeeded());
  },
  opts
);

// Sanity check: unparse the CST and verify it matches the tokenized input.
{
  const r = matchPython(input);
  r.use(r => {
    if (!r.succeeded()) throw new Error('Match failed');
    const cst = r.getCstRoot();
    const {input: tokenizedInput} = tokenize(input);
    const root = cst as NonterminalNode;
    const fullSource = input.slice(0, root.startIdx) + root.sourceString;
    if (fullSource !== tokenizedInput) {
      console.error('UNPARSE MISMATCH!');
      process.exit(1);
    }
    console.error('Unparse check passed.');
  });
}

(async () => {
  await bench.run();
  process.stderr.write('\n');

  // Run CPython ast.parse and libCST for comparison.
  const pyScript = `
import ast, time, json, sys

with open(sys.argv[1]) as f:
    source = f.read()

n = int(sys.argv[2])
results = {}

# ast.parse (tokenize + parse + build AST)
ast.parse(source)  # warmup
times = []
for _ in range(n):
    start = time.perf_counter()
    ast.parse(source)
    times.append((time.perf_counter() - start) * 1000)
mean = sum(times) / len(times)
sd = (sum((t - mean) ** 2 for t in times) / len(times)) ** 0.5
results["ast_parse"] = {"mean": mean, "sd": sd, "n": len(times)}

# libCST (tokenize + parse + build CST)
try:
    import libcst
    libcst.parse_module(source)  # warmup
    times = []
    for _ in range(n):
        start = time.perf_counter()
        libcst.parse_module(source)
        times.append((time.perf_counter() - start) * 1000)
    mean = sum(times) / len(times)
    sd = (sum((t - mean) ** 2 for t in times) / len(times)) ** 0.5
    results["libcst"] = {"mean": mean, "sd": sd, "n": len(times)}
except ImportError:
    pass

print(json.dumps(results))
`;

  const pyResults = JSON.parse(
    execFileSync(
      'uv',
      ['run', '--with', 'libcst', 'python3', '-c', pyScript, filePath, String(iterations)],
      {encoding: 'utf-8'}
    )
  );

  for (const task of bench.tasks) {
    const {state} = task.result;
    if (state !== 'completed') continue;
    const {mean, sd, samplesCount} = task.result.latency;
    console.error(
      `${task.name}: ${mean.toFixed(1)}ms ± ${sd.toFixed(1)}ms` + ` (n=${samplesCount})`
    );
  }
  const ap = pyResults.ast_parse;
  console.error(
    `CPython ast.parse: ${ap.mean.toFixed(1)}ms ±` + ` ${ap.sd.toFixed(1)}ms (n=${ap.n})`
  );
  if (pyResults.libcst) {
    const lc = pyResults.libcst;
    console.error(
      `libCST parse_module: ${lc.mean.toFixed(1)}ms ±` + ` ${lc.sd.toFixed(1)}ms (n=${lc.n})`
    );
  }
})();
