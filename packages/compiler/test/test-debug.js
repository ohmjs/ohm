import test from 'ava';

import {getMatchStats} from 'ohm-js/unstableDebug';
import {compileAndLoad} from './_helpers.js';

test('getMatchStats basic', async t => {
  const g = await compileAndLoad('G { start = "a" "b" }');
  g.match('ab').use(r => {
    t.true(r.succeeded());
    const stats = getMatchStats(r);

    // CST has start (nonterminal) + terminals (deduplicated via prealloc pool).
    t.true(stats.cst.count > 0);
    t.true(stats.cst.countByType.nonterminal >= 1);
    t.true(stats.cst.countByType.terminal >= 1);
    t.true(stats.cst.sumBytes > 0);
    t.deepEqual(stats.cst.countByRule, {start: 1});

    // Heap is a superset of CST.
    t.true(stats.heap.count >= stats.cst.count);

    // Memory stats are non-zero.
    t.true(stats.memory.heapBytesUsed > 0);
    t.true(stats.memory.wasmMemoryBytes > 0);
  });
});

test('getMatchStats with alternatives', async t => {
  const g = await compileAndLoad(
    'G { start = big | small\n  big = "x" "y" "z"\n  small = "a" }'
  );
  g.match('a').use(r => {
    t.true(r.succeeded());
    const stats = getMatchStats(r);

    // CST contains start + small + terminal.
    t.true(stats.cst.countByRule.start >= 1);
    t.true(stats.cst.countByRule.small >= 1);
    t.is(stats.cst.countByRule.big, undefined);

    t.true(stats.heap.count >= stats.cst.count);
  });
});
