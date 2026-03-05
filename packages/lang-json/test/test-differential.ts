import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import fc from 'fast-check';
import {grammar} from '@ohm-js/compiler/compat';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonG = grammar(fs.readFileSync(path.join(__dirname, '../json.ohm'), 'utf-8'));
const fastG = grammar(fs.readFileSync(path.join(__dirname, '../fastjson.ohm'), 'utf-8'));

function accepts(g: any, input: string): boolean {
  let result = false;
  g.match(input).use((r: any) => {
    result = r.succeeded();
  });
  return result;
}

function assertAgree(input: string) {
  const j = accepts(jsonG, input);
  const f = accepts(fastG, input);
  assert.strictEqual(
    f,
    j,
    `Grammars disagree on ${JSON.stringify(input)}: json=${j}, fastjson=${f}`
  );
}

/** Produce mutations of a valid JSON string to explore boundary cases. */
function mutate(s: string): string[] {
  return [
    s.replace(/([:,\[]\s*)([1-9]\d*)/g, '$10$2'), // leading zeros
    s.replace(/./, c => c + c), // duplicate first char
    s.replace(/([\]\}])/, ',$1'), // trailing comma
    s.replace(/\d/, ''), // remove digit
    s.replace(/([:,\[]\s*)(\d)/, '$1+$2'), // leading +
  ];
}

test('targeted number forms', () => {
  for (const c of [
    '0',
    '-0',
    '1',
    '-1',
    '10',
    '100',
    '0.1',
    '-0.1',
    '1.0',
    '1.23',
    '1e2',
    '1E2',
    '1e+2',
    '1e-2',
    '1E+2',
    '1E-2',
    '0e1',
    '0E1',
    '-0e1',
    '1.5e10',
    '-1.5E-10',
    // Invalid forms
    '01',
    '00',
    '-01',
    '-00',
    '00.5',
    '012',
    '+1',
    '+0',
    '.1',
    '1.',
    '1.e2',
    '1e',
    '1e+',
    '1e-',
    '1E',
    '--1',
    '++1',
    '',
    '-',
    '+',
    '0x1',
    '0b1',
    '0o1',
    'NaN',
    'Infinity',
    '-Infinity',
  ]) {
    assertAgree(c);
  }
});

test('targeted string forms', () => {
  for (const c of [
    '""',
    '"hello"',
    '"\\n"',
    '"\\t"',
    '"\\r"',
    '"\\\\"',
    '"\\/"',
    '"\\""',
    '"\\b"',
    '"\\f"',
    '"\\u0041"',
    '"\\u00e9"',
    '"\\uFFFF"',
    // Invalid
    '"\\x41"',
    '"\\v"',
    "'hello'",
  ]) {
    assertAgree(c);
  }
});

test('structural edge cases', () => {
  for (const c of [
    '{}',
    '[]',
    '{"a": 1}',
    '{"a": 1, "b": 2}',
    '[1]',
    '[1, 2, 3]',
    '{"a": {"b": {"c": 1}}}',
    '[[[]]]',
    // Invalid
    '{,}',
    '[,]',
    '{"a": 1,}',
    '[1,]',
    '{1: "a"}',
    '',
  ]) {
    assertAgree(c);
  }
});

test('fast-check: grammars agree on valid JSON', () => {
  fc.assert(
    fc.property(fc.json(), json => {
      assertAgree(json);
    }),
    {numRuns: 200}
  );
});

test('fast-check: grammars agree on mutations of valid JSON', () => {
  fc.assert(
    fc.property(fc.json(), json => {
      for (const m of mutate(json)) {
        assertAgree(m);
      }
    }),
    {numRuns: 200}
  );
});
