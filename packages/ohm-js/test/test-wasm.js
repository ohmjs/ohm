/* global WebAssembly */

import test from 'ava';

import * as ohm from '../index.mjs';

function loadMod(bytes) {
  const mod = new WebAssembly.Module(bytes);
  return new WebAssembly.Instance(mod).exports;
}

test('basic wasm support', async t => {
  const g = ohm.grammar(`
    G {
      nums = one two
      one = "1"
      two = "2"
    }
  `);
  const exports = loadMod(await g.toWasm());
  t.is(exports.match('12'), 1);
});
