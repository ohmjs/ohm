import {toAST} from '@ohm-js/miniohm-js/toAST.js';
import test from 'ava';
import * as ohm from 'ohm-js';

import {matchWithInput, wasmMatcherForGrammar} from './_helpers.js';

const arithmetic = ohm.grammar(`
  Arithmetic {
    Exp
      = AddExp

    AddExp
      = AddExp "+" PriExp  -- plus
      | AddExp "-" PriExp  -- minus
      | PriExp

    PriExp
      = "(" Exp ")"  -- paren
      | number

    number
      = digit+
  }
`);

// eslint-disable-next-line ava/no-skip-test
test('toAST basic', async t => {
  const m = await wasmMatcherForGrammar(arithmetic);
  t.is(matchWithInput(m, '10 + 20'), 1);
  const ast = toAST(m, {
    AddExp_plus: {
      expr1: 0,
      expr2: 2,
    },
  });
  t.deepEqual(
      ast,
      {
        expr1: '10',
        expr2: '20',
        type: 'AddExp_plus',
      },
      'proper AST with mapped properties',
  );
});
