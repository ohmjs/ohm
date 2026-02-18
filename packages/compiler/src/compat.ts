import {Compiler} from './Compiler.js';
import {grammars as grammarsJs} from './parseGrammars.ts';
import {Grammar as BaseGrammar} from 'ohm-js';

// Matches the v17 Grammar.rules shape. Defined inline to avoid pulling
// ohm-js-legacy types into the public .d.ts.
type Rules = {
  [ruleName: string]: {body: any; formals: string[]; description: string; source: any};
};

export interface Grammar extends BaseGrammar {
  rules: Rules;
}

class CompatGrammar extends BaseGrammar implements Grammar {
  rules: Rules;

  constructor(wasmModule: Uint8Array<ArrayBuffer>, rules: Rules) {
    super(wasmModule);
    this.rules = rules;
  }
}

// TODO: Support a namespace parameter.
export function grammar(source: string): Grammar {
  const values = Object.values(grammars(source));
  return values[values.length - 1];
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
