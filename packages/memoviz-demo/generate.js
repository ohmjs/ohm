/* eslint-disable no-console */

import assert from 'node:assert/strict';
import * as es from 'ohm-grammar-ecmascript';

const es5 = es.grammar;

const m = es5.matcher();
m.setInput(
    `
function foo(x) {
  var o = {
    name: "Thomas",
    number: 13
  };
  var finalAnswer = o.number + x;
  return finalAnswer;
}
`.trim(),
);
assert.equal(m.match().succeeded(), true);

const rulesById = new Map();

const ruleId = k => {
  if (!rulesById.has(k)) {
    rulesById.set(k, rulesById.size);
  }
  return rulesById.get(k);
};

const counts = new Map();

const incCount = ruleId => {
  counts.set(ruleId, 1 + (counts.get(ruleId) ?? 0));
};

const lines = m._memoTable.map(posInfo => {
  const posData = new Array(256).fill(0);
  if (posInfo) {
    Object.entries(posInfo.memo).forEach(([k, v]) => {
      const id = ruleId(k);
      posData[id] = 1;
      incCount(id);
    });
  }
  return `  ${JSON.stringify(posData)}`;
});
assert(rulesById.size <= 256);
const invCounts = [...counts.entries()].sort((a, b) => b[1] - a[1]);
console.error([...rulesById.entries()].slice(0, 32));
console.error(invCounts);
console.log(`[${lines.join(', ')}]`);
