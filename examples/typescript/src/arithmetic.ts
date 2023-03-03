/*
  In ../package.json, there is a 'generate' script that uses the Ohm command
  line tool (from the @ohm-js/cli package) to generate a "bundle" for our
  grammar, along with the corresponding TypeScript type definitions.

  A bundle is a standalone CommonJS module from which we can directly import
  our grammar(s). The associated .d.ts file also defines some useful related
  types, such as `ArithmeticSemantics`.
 */
import grammar, {ArithmeticSemantics} from './arithmetic.ohm-bundle';

const constants: {[name: string]: number} = {
  pi: Math.PI,
  e: Math.E
};

/*
  It's not necessary to specificy the type explicitly here, but we do it
  to demonstrate that the `grammar.createSemantics()` doesn't return a
  generic `Semantics`, but rather an `ArithmeticSemantics`...
 */
const semantics: ArithmeticSemantics = grammar.createSemantics();

/*
  ...and this lets the compiler check that our semantic actions have the
  correct number of arguments, a consistent return type, etc. In some
  editors (e.g. VS Code), this also enables some handy features like
  autocomplete of action names, tooltips with argument types (`IterationNode`,
  `NonterminalNode`, or `TerminalNode`), etc.
 */
semantics.addOperation<number>('eval()', {
  AddExp_plus(x, _, y) {
    return x.eval() + y.eval();
  },
  AddExp_minus(x, _, y) {
    return x.eval() - y.eval();
  },
  MulExp_times(x, _, y) {
    return x.eval() * y.eval();
  },
  MulExp_divide(x, _, y) {
    return x.eval() / y.eval();
  },
  ExpExp_power(x, _, y) {
    return Math.pow(x.eval(), y.eval());
  },
  PriExp_paren(_l, e, _r) {
    return e.eval();
  },
  PriExp_pos(_, e) {
    return e.eval();
  },
  PriExp_neg(_, e) {
    return -e.eval();
  },
  ident(_l, _ns) {
    return constants[this.sourceString] || 0;
  },

  /*
    If we had instead written this action as `number(a, b) { ... }`, the TypeScript
    compiler would give us an error like this:
  
        src/arithmetic.ts:42:3 - error TS2322: Type '(a: any, b: any) => number' is not
        assignable to type '(arg0: NonterminalNode) => number'.
   */
  number(_) {
    return parseFloat(this.sourceString);
  }
});

export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
