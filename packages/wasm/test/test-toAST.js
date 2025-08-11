import {toAstWithMapping} from '@ohm-js/miniohm-js/toAST.js';
import test from 'ava';
import * as ohm from 'ohm-js';

import {wasmMatcherForGrammar} from './_helpers.js';

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

// Copied from test/extras/test-toAst.js and modified for the new toAST API.
test('toAST basic', async t => {
  const m = await wasmMatcherForGrammar(arithmetic);
  m.setInput('10 + 20');
  let matchResult = m.match();
  let toAST = toAstWithMapping({
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
  t.deepEqual(toAST(matchResult), expected, 'proper AST with mapped properties');

  toAST = toAstWithMapping({
    AddExp_plus: {
      expr1: 0,
      op: 1,
      expr2: 2,
    },
  });
  let ast = toAST(matchResult);
  expected = {
    expr1: '10',
    op: '+',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly mapped property');

  toAST = toAstWithMapping({
    AddExp_plus: {
      0: 0,
    },
  });
  ast = toAST(matchResult);
  expected = {
    0: '10',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed property');

  toAST = toAstWithMapping({
    AddExp_plus: {
      0: 0,
      type: undefined,
    },
  });
  ast = toAST(matchResult);
  expected = {
    0: '10',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed type');

  toAST = toAstWithMapping({
    AddExp_plus: {
      expr1: 0,
      op: 'plus',
      expr2: 2,
    },
  });
  ast = toAST(matchResult);
  expected = {
    expr1: '10',
    op: 'plus',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with static property');

  toAST = toAstWithMapping({
    AddExp_plus: {
      expr1: Object(0),
      op: 'plus',
      expr2: Object(2),
    },
  });
  ast = toAST(matchResult);
  expected = {
    expr1: 0,
    op: 'plus',
    expr2: 2,
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with boxed number property');

  toAST = toAstWithMapping({
    AddExp_plus: {
      expr1: 0,
      expr2: 2,
      str(children) {
        return children.map(c => toAST(c)).join('');
      },
    },
  });
  ast = toAST(matchResult);
  expected = {
    expr1: '10',
    expr2: '20',
    str: '10+20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with computed property');

  m.setInput('10 + 20 - 30');
  matchResult = m.match();
  toAST = toAstWithMapping({
    AddExp_plus: 2,
  });
  ast = toAST(matchResult);
  expected = {
    0: '20', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus',
  };
  t.deepEqual(ast, expected, 'proper AST with forwarded child node');

  toAST = toAstWithMapping({
    AddExp_plus(expr1, _, expr2) {
      expr1 = toAST(expr1);
      expr2 = toAST(expr2);
      return 'plus(' + expr1 + ', ' + expr2 + ')';
    },
  });
  ast = toAST(matchResult);
  expected = {
    0: 'plus(10, 20)', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus',
  };
  t.deepEqual(ast, expected, 'proper AST with computed node/operation extension');

  toAST = toAstWithMapping({
    Exp: {
      type: 'Exp',
      0: 0,
    },
  });
  ast = toAST(matchResult);
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
