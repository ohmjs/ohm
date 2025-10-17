import {grammars as grammarsJs, grammar as grammarJs} from 'ohm-js';
import type {Grammar as GrammarJs} from 'ohm-js';

import {Compiler} from './Compiler.js';
import {WasmGrammar} from './miniohm.ts';

export interface Grammar extends WasmGrammar {
  rules: GrammarJs['rules'];
}

class CompatGrammar extends WasmGrammar implements Grammar {
  rules: GrammarJs['rules'];

  constructor(wasmModule: Uint8Array<ArrayBuffer>, rules: GrammarJs['rules']) {
    super(wasmModule);
    this.rules = rules;
  }
}

// TODO: Support a namespace parameter.
export function grammar(source: string): Grammar {
  return Object.values(grammars(source))[0];
}

// TODO: Support a namespace parameter.
export function grammars(source: string): Record<string, Grammar> {
  const ans = {} as Record<string, Grammar>;
  for (const g of Object.values(grammarsJs(source))) {
    const compiler = new Compiler(g);
    ans[g.name] = new CompatGrammar(compiler.compile(), g.rules);
  }

  return ans;
}

export {createToAst} from './createToAst.ts';
export type {AstMapping, AstNodeTemplate} from './createToAst.ts';
