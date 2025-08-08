import {toAST} from '@ohm-js/miniohm-js/toAST.js';
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

// eslint-disable-next-line ava/no-skip-test
test('toAST basic', async t => {
  const m = await wasmMatcherForGrammar(arithmetic);
  m.setInput('10 + 20');
  let matchResult = m.match();
  let ast = toAST(matchResult, {
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
  t.deepEqual(ast, expected, 'proper AST with mapped properties');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      op: 1,
      expr2: 2,
    },
  });
  expected = {
    expr1: '10',
    op: '+',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly mapped property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      0: 0,
    },
  });
  expected = {
    0: '10',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      0: 0,
      type: undefined,
    },
  });
  expected = {
    0: '10',
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed type');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      op: 'plus',
      expr2: 2,
    },
  });
  expected = {
    expr1: '10',
    op: 'plus',
    expr2: '20',
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with static property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: Object(0),
      op: 'plus',
      expr2: Object(2),
    },
  });
  expected = {
    expr1: 0,
    op: 'plus',
    expr2: 2,
    type: 'AddExp_plus',
  };
  t.deepEqual(ast, expected, 'proper AST with boxed number property');

  // ast = toAST(matchResult, {
  //   AddExp_plus: {
  //     expr1: 0,
  //     expr2: 2,
  //     str(children) {
  //       return children
  //           .map(function(child) {
  //             return child.toAST(this.args.mapping);
  //           }, this)
  //           .join('');
  //     },
  //   },
  // });
  // expected = {
  //   expr1: '10',
  //   expr2: '20',
  //   str: '10+20',
  //   type: 'AddExp_plus',
  // };
  // t.deepEqual(ast, expected, 'proper AST with computed property');

  m.setInput('10 + 20 - 30');
  matchResult = m.match();
  ast = toAST(matchResult, {
    AddExp_plus: 2,
  });
  expected = {
    0: '20', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus',
  };
  t.deepEqual(ast, expected, 'proper AST with forwarded child node');

  ast = toAST(matchResult, {
    AddExp_plus(expr1, _, expr2) {
      expr1 = this.visit(expr1);
      expr2 = this.visit(expr2);
      return 'plus(' + expr1 + ', ' + expr2 + ')';
    },
  });
  expected = {
    0: 'plus(10, 20)', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus',
  };
  t.deepEqual(ast, expected, 'proper AST with computed node/operation extension');

  ast = toAST(matchResult, {
    Exp: {
      type: 'Exp',
      0: 0,
    },
  });
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
