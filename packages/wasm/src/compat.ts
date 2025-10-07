import {grammars as grammarsJs, grammar as grammarJs} from 'ohm-js';
import type {Namespace} from 'ohm-js';

import {Compiler} from './Compiler.js';
import {WasmGrammar} from './miniohm.ts';

// TODO: Support a namespace parameter.
export function grammar(source: string): WasmGrammar {
  const compiler = new Compiler(grammarJs(source));
  return new WasmGrammar(compiler.compile());
}

// TODO: Support a namespace parameter.
export function grammars(source: string): Record<string, WasmGrammar> {
  const ans = {} as Record<string, WasmGrammar>;
  for (const g of Object.values(grammarsJs(source))) {
    const compiler = new Compiler(g);
    ans[g.name] = new WasmGrammar(compiler.compile());
  }

  return ans;
}
