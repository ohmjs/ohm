import test from 'ava';

import * as ohm from '../index.mjs';
import {WasmMatcher} from '../src/wasm.js';

test('input in memory', async t => {
  const g = ohm.grammar('G { start = "x" }');
  const matcher = await WasmMatcher.forGrammar(g);
  matcher.setInput('ohm');
  matcher.match(); // Trigger fillInputBuffer

  const view = new DataView(matcher._instance.exports.memory.buffer);
  t.is(view.getUint8(0), 'ohm'.charCodeAt(0));
  t.is(view.getUint8(1), 'ohm'.charCodeAt(1));
  t.is(view.getUint8(2), 'ohm'.charCodeAt(2));
});

test('wasm: one-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  matcher.setInput('1');
  t.is(matcher.match(), 1);
});

test('wasm: multi-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "123"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  matcher.setInput('123');
  t.is(matcher.match(), 1);
});

test('wasm: handle end', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  matcher.setInput('123');
  t.is(matcher.match(), 0);
});

test('wasm: choice', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" | "2"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  matcher.setInput('2');
  t.is(matcher.match(), 1);

  matcher.setInput('1');
  t.is(matcher.match(), 1);

  matcher.setInput('3');
  t.is(matcher.match(), 1);
});

test.skip('wasm: chained choice', async t => {
  const g2 = ohm.grammar(`
    G {
      start = "12" | ("13" | "14")
    }
  `);
  const matcher2 = await WasmMatcher.forGrammar(g);
  matcher2.setInput('14');
  t.is(matcher2.match(), 1);
});
