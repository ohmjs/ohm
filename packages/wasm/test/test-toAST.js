import test from 'ava';
import * as fc from 'fast-check';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as ohm from 'ohm-js';
import {toAST} from 'ohm-js/extras';

import {scriptRel, toWasmGrammar} from './_helpers.js';
import {AstBuilder} from '../src/AstBuilder.ts';

const arithmetic = ohm.grammar(
  readFileSync(scriptRel('../../ohm-js/test/data/arithmetic.ohm'))
);

// A version of the arithmetic grammar that contains a few more elements:
// - an optional
// - a use of ListOf
const arithmetic2 = ohm.grammar(`
  Arithmetic {
    Exp = ListOf<AddExp, ";">
    AddExp = AddExp "+" PriExp  -- plus
           | AddExp "-" PriExp  -- minus
           | PriExp
    PriExp = "(" Exp ")"  -- paren
           | number
    number = sign? digit+
    sign = "-" | "+"
  }
`);

// Copied from test/extras/test-toAst.js and modified for the new toAST API.
test('toAST basic', async t => {
  const g = await toWasmGrammar(arithmetic);
  let matchResult = g.match('10 + 20');
  let builder = new AstBuilder({
    AddExp_plus: {
      expr1: 0,
      expr2: 2,
    },
  });
  let expected = {
    expr1: '10',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(builder.toAst(matchResult), expected, 'proper AST with mapped properties');

  builder = new AstBuilder({
    AddExp_plus: {
      expr1: 0,
      op: 1,
      expr2: 2,
    },
  });
  let ast = builder.toAst(matchResult);
  expected = {
    expr1: '10',
    op: '+',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly mapped property');

  builder = new AstBuilder({
    AddExp_plus: {
      0: 0,
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    0: '10',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed property');

  builder = new AstBuilder({
    AddExp_plus: {
      0: 0,
      type: undefined,
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    0: '10',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed type');

  builder = new AstBuilder({
    AddExp_plus: {
      expr1: 0,
      op: 'plus',
      expr2: 2,
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    expr1: '10',
    op: 'plus',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with static property');

  builder = new AstBuilder({
    AddExp_plus: {
      expr1: Object(0),
      op: 'plus',
      expr2: Object(2),
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    expr1: 0,
    op: 'plus',
    expr2: 2,
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with boxed number property');

  builder = new AstBuilder({
    AddExp_plus: {
      expr1: 0,
      expr2: 2,
      str(children) {
        return children.map(c => this.toAst(c)).join('');
      },
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    expr1: '10',
    expr2: '20',
    str: '10+20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with computed property');

  matchResult.detach();
  matchResult = g.match('10 + 20 - 30');
  builder = new AstBuilder({
    AddExp_plus: 2,
  });
  ast = builder.toAst(matchResult);
  expected = {
    0: '20', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus',
  };
  t.deepEqual(ast, expected, 'proper AST with forwarded child node');

  builder = new AstBuilder({
    AddExp_plus(expr1, _, expr2) {
      expr1 = this.toAst(expr1);
      expr2 = this.toAst(expr2);
      return 'plus(' + expr1 + ', ' + expr2 + ')';
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    0: 'plus(10, 20)', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus',
  };
  t.deepEqual(ast, expected, 'proper AST with computed node/operation extension');

  builder = new AstBuilder({
    Exp: {
      type: 'Exp',
      0: 0,
    },
  });
  ast = builder.toAst(matchResult);
  expected = {
    0: {
      0: {
        0: '10',
        2: '20',
        type: 'AddExp_plus',
      },
      2: '30',
      type: 'AddExp_minus',
    },
    type: 'Exp',
  };
  t.deepEqual(ast, expected, 'proper AST with explicity reintroduced node');
});

test('listOf and friends - #394', async t => {
  // By default, toAST assumes that lexical rules represent indivisible tokens,
  // but that doesn't make sense for listOf, nonemptyListOf, and emptyListOf.
  const g = ohm.grammar(`
    G {
      Exp = listOf<digit, "+">
          | ~end end Exp2 -- dummy // Defeat dead rule elimination
      Exp2 = ListOf<digit, "+">
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);

  const ast = (input, mapping, ruleName = 'Exp') => {
    const builder = new AstBuilder(mapping);
    return wasmGrammar.match(input, ruleName).use(r => builder.toAst(r));
  };
  const astSyntactic = (input, mapping) => ast(input, mapping, 'Exp2');

  // By default, the `listOf` action should pass through, and both `nonemptyListOf`
  // and `emptyListOf` should return an array.
  t.deepEqual(ast('3+5'), ['3', '5']);
  t.deepEqual(ast(''), []);

  // // The AST should be the same whether we use `listOf` or `ListOf`.
  t.deepEqual(ast('3+5'), astSyntactic('3 + 5'));
  t.deepEqual(ast(''), astSyntactic(''));

  // // Ensure that it's still be possible to override the default mappings.

  t.is(
    ast('0+1', {
      nonemptyListOf: (first, sep, rest) => 'XX',
    }),
    'XX'
  );

  t.is(
    ast('1+2', {
      nonemptyListOf: 0,
    }),
    '1'
  );

  t.is(
    ast('', {
      emptyListOf: () => 'nix',
    }),
    'nix'
  );
});

// An arbitrary producing a valid mapping for the arithmetic grammar.
function arbitraryMapping() {
  // Pick a subset of rule names…
  return fc.subarray(Object.keys(arithmetic.rules), {minLength: 1}).chain(ruleNames => {
    // …then for each rule, generate a "node template" where:
    // - the keys are a single letter
    // - the values are either a number or a string.
    // - a function that return an array of each child's `ctorName`.
    // If a number, it's constrained to be less than the rule arity, because
    // the meaning is "put child[i] in this prop".
    const arities = new Map(
      ruleNames.map(ruleName => [ruleName, arithmetic.rules[ruleName].body.getArity()])
    );
    const model = Object.fromEntries(
      ruleNames.map(ruleName => {
        const arity = arities.get(ruleName);
        return [
          ruleName,
          fc.dictionary(
            fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'),
            fc.oneof(
              fc.nat({max: arity - 1}),
              fc.string(),
              fc.constant(children =>
                // For compatibility with legacy behavior, we map `_opt` to `_iter`.
                children.map(c => (c.ctorName === '_opt' ? '_iter' : c.ctorName))
              )
            )
          ),
        ];
      })
    );
    return fc.record(model);
  });
}

test('arbitrary mappings (fast-check)', async t => {
  const g = await toWasmGrammar(arithmetic2);
  const input = '(10+ 999)- 1 +222; 2';
  const wasmResult = g.match(input);
  const jsResult = arithmetic2.match(input);
  const hasExpectedResult = () => {
    return fc.property(arbitraryMapping(), mapping => {
      const builder = new AstBuilder(mapping);
      const wasmAst = builder.toAst(wasmResult);
      const jsAst = toAST(jsResult, mapping);
      assert.deepEqual(wasmAst, jsAst);
    });
  };
  const details = fc.check(hasExpectedResult(), {
    includeErrorInReport: true,
    interruptAfterTimeLimit: 300,
  });
  t.log(`numRuns: ${details.numRuns}`);
  t.is(details.failed, false, `${fc.defaultReportMessage(details)}`);
});

// Failures that fast-check has found, which we don't want to regress on.
test('fast-check zoo', async t => {
  const wasmGrammar = await toWasmGrammar(arithmetic2);
  const createAsts = (input, mapping) => {
    const builder = new AstBuilder(mapping);
    const wasmAst = wasmGrammar.match(input).use(r => builder.toAst(r));
    const jsAst = toAST(arithmetic2.match(input), mapping);
    return [wasmAst, jsAst];
  };
  const [wasmAst, jsAst] = createAsts('(10+ -999)- 1 +222; 2', {
    PriExp: {a: 0},
    number: {a: 0},
    sign: {},
  });
  t.deepEqual(jsAst, wasmAst);
});
