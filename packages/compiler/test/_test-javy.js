// Tests for the Javy-compiled Wasm module (build/compiler.wasm).
// Run via `make test-compiler-wasm`.

import test from 'ava';
import {execFileSync} from 'node:child_process';
import {Grammar} from 'ohm-js';

import {compile} from '../src/javy-api.ts';

const COMPILER_WASM = new URL('../build/compiler.wasm', import.meta.url).pathname;

function javyCompile(grammarSource, grammarName) {
  const input = grammarName
    ? `#grammarName ${grammarName}\n${grammarSource}`
    : grammarSource;
  return execFileSync('wasmtime', [COMPILER_WASM], {
    input,
    maxBuffer: 1024 * 1024,
  });
}

test('javy: simple grammar', t => {
  const bytes = javyCompile('G { start = "hello" "world" }');
  const g = new Grammar(bytes);
  g.match('helloworld').use(r => t.false(r.failed()));
  g.match('goodbye').use(r => t.true(r.failed()));
});

test('javy: arithmetic grammar', t => {
  const source = `Arithmetic {
  Exp = AddExp
  AddExp = AddExp "+" MulExp  -- plus
         | AddExp "-" MulExp  -- minus
         | MulExp
  MulExp = MulExp "*" PriExp  -- times
         | MulExp "/" PriExp  -- divide
         | PriExp
  PriExp = "(" Exp ")"  -- paren
         | number
  number = digit+
}`;
  const bytes = javyCompile(source);
  const g = new Grammar(bytes);
  g.match('1+2*3').use(r => t.false(r.failed()));
  g.match('(1+2)*3').use(r => t.false(r.failed()));
  g.match('hello').use(r => t.true(r.failed()));
});

test('javy: output matches Node compiler', t => {
  const source = 'G { start = "a" | "b" | "c" }';
  const javyBytes = javyCompile(source);
  const nodeBytes = compile(source);
  t.deepEqual(new Uint8Array(javyBytes), nodeBytes);
});

test('javy: #grammarName selects grammar', t => {
  const source = 'A { start = "a" }\nB { start = "b" }';
  const bytesA = javyCompile(source, 'A');
  const gA = new Grammar(bytesA);
  gA.match('a').use(r => t.false(r.failed()));
  gA.match('b').use(r => t.true(r.failed()));

  const bytesB = javyCompile(source, 'B');
  const gB = new Grammar(bytesB);
  gB.match('b').use(r => t.false(r.failed()));
  gB.match('a').use(r => t.true(r.failed()));
});
