import fs from 'fs';
import ohm from 'ohm-js';

// Using 'generate-ohm-declarations' from the ohm-typescript-codegen package,
// we can generate type definitions for an Ohm grammar in a .ohm file.
// Note that this only imports the _types_ from that grammar -- we still need
// to instantiate the grammar via `ohm.grammar(...)` below.
import {ArithmeticGrammar} from './arithmetic.ohm';

const source = fs.readFileSync(`${__dirname}/arithmetic.ohm`, 'utf-8');
const grammar: ArithmeticGrammar = ohm.grammar(source);

const constants: {[name: string]: number} = {
  pi: Math.PI,
  e: Math.E
};

// By declaring `grammar: ArithmeticGrammar` above, our semantics object is
// inferred to be an `ArithmeticSemantics`. This lets the compiler check that
// our semantic actions have the correct number of arguments, a consistent
// return type, etc. In some editors (e.g. VS Code), this also enables some
// handy features like autocomplete of action names, tooltips with argument
// types (`IterationNode`, `NonterminalNode`, or `TerminalNode`), etc.
const semantics = grammar.createSemantics().addOperation<number>('eval()', {
  AddExp_plus: (x, _, y) => x.eval() + y.eval(),
  AddExp_minus: (x, _, y) => x.eval() - y.eval(),
  MulExp_times: (x, _, y) => x.eval() * y.eval(),
  MulExp_divide: (x, _, y) => x.eval() / y.eval(),
  ExpExp_power: (x, _, y) => Math.pow(x.eval(), y.eval()),
  PriExp_paren: (_l, e, _r) => e.eval(),
  PriExp_pos: (_, e) => e.eval(),
  PriExp_neg: (_, e) => -e.eval(),
  ident(_l, _ns) {
    return constants[this.sourceString] || 0;
  },

  // If we had instead written this action as `number(a, b) { ... }`, the TypeScript
  // compiler would give us an error:
  //
  //     src/arithmetic.ts:42:3 - error TS2322: Type '(a: any, b: any) => number' is not
  //     assignable to type '(arg0: NonterminalNode) => number'.
  number(_) {
    return parseFloat(this.sourceString);
  }
});

export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}

/*
TODO:
- put a comment on each action with the rule definition (for tooltips in VSCode)
- (maybe) _iter and _nonterminal should spread their properties, rather than getting a single children arg,
  so that they have the same type as other actions (?)
*/
