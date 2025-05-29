import test from 'ava';
import {readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as ohm from 'ohm-js';

import {WasmMatcher} from '../src/index.js';
import es5fac from './data/_es5.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const datadir = join(__dirname, 'data');

function ES5Matcher(rules) {
  // `rules` is an object with the raw rule bodies.
  // The WasmMatcher constructor requires a grammar object, so we create
  // one and manually add the rules in.
  const g = ohm.grammar('ES5 { start = }');
  for (const key of Object.keys(rules)) {
    g.rules[key] = {
      body: rules[key],
      formals: [],
      description: key,
      primitive: false,
    };
  }
  // Since this is called with `new`, we can't use `await` here.
  return WasmMatcher.forGrammar(g).then(m => ({
    match(input) {
      m.setInput(input);
      return m.match();
    },
  }));
}

async function es5Matcher() {
  return es5fac({
    Terminal: ohm.pexprs.Terminal,
    RuleApplication: ohm.pexprs.Apply,
    Sequence: ohm.pexprs.Seq,
    Choice: ohm.pexprs.Alt,
    Repetition: ohm.pexprs.Star,
    Not: ohm.pexprs.Not,
    Range: ohm.pexprs.Range,
    any: ohm.pexprs.any,
    end: ohm.pexprs.end,
    Matcher: ES5Matcher,
  });
}

// eslint-disable-next-line ava/no-skip-test
test('basic es5 examples', async t => {
  const es5 = await es5Matcher();
  t.is(es5.match('x = 3;'), 1);
  t.is(es5.match('function foo() { return 1; }'), 1);
});

// eslint-disable-next-line ava/no-skip-test
test.skip('broken es5 examples', async t => {
  const es5 = await es5Matcher();
  t.is(
      es5.match(`
    function fib(n) {
      if (n <= 1) {
        return n;
      }
      return fib(n - 1) + fib(n - 2);
    }
  `),
      1,
  );
});

// eslint-disable-next-line ava/no-skip-test
test.skip('html5shiv', async t => {
  const html5shivPath = join(datadir, '_html5shiv-3.7.3.js');
  const source = await readFile(html5shivPath, 'utf8');

  const es5 = await es5Matcher();
  t.is(es5.match(source), 1);
});
