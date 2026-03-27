// Javy-specific compile API. The normal compile path (parseGrammars.ts) uses
// the Wasm-compiled Ohm meta-grammar to parse grammars, but QuickJS/Javy
// doesn't have a WebAssembly runtime. So this module uses ohm-js-legacy's
// pure-JS grammar parser instead, the same approach as scripts/bootstrap.ts.

import {grammars} from 'ohm-js-legacy';

import {Compiler} from './Compiler.ts';

export function compile(source: string, grammarName?: string): Uint8Array {
  const ns = grammars(source);
  let g;
  if (grammarName) {
    g = ns[grammarName];
    if (!g) throw new Error(`Grammar '${grammarName}' not found`);
  } else {
    g = Object.values(ns).at(-1);
  }
  return new Compiler(g, {debug: false}).compile();
}
