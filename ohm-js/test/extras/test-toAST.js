'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const fs = require('fs');
const test = require('tape-catch');

const ohm = require('../..');
const toAST = require('../../extras').toAST;
const semanticsForToAST = require('../../extras').semanticsForToAST;

const g = ohm.grammar(fs.readFileSync('test/data/arithmetic.ohm'));

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('semantic action', t => {
  const semantics = semanticsForToAST(g);
  const matchResult = g.match('10 + 20');

  t.ok('toAST' in semantics._getSemantics().operations, 'toAST operation added to semantics');
  t.ok(semantics(matchResult).toAST, 'toAST operation added to match result');

  t.end();
});

test('default', t => {
  let matchResult = g.match('10 + 20');
  let ast = toAST(matchResult);
  let expected = {
    0: '10',
    2: '20',
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper default AST');

  const g2 = ohm.grammar('G { Mix = a? b* "|" a? b* a = "a" b = "b" }');
  matchResult = g2.match('a|bb');
  ast = toAST(matchResult, {});
  expected = {
    0: 'a',
    1: [],
    3: null,
    4: ['b', 'b'],
    type: 'Mix'
  };
  t.deepEqual(ast, expected, 'proper optionals and lists in AST');

  t.end();
});

test('mapping', t => {
  let matchResult = g.match('10 + 20');
  let ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      expr2: 2
    }
  });
  let expected = {
    expr1: '10',
    expr2: '20',
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper AST with mapped properties');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      op: 1,
      expr2: 2
    }
  });
  expected = {
    expr1: '10',
    op: '+',
    expr2: '20',
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly mapped property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      0: 0
    }
  });
  expected = {
    0: '10',
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      0: 0,
      type: undefined
    }
  });
  expected = {
    0: '10'
  };
  t.deepEqual(ast, expected, 'proper AST with explicitly removed type');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      op: 'plus',
      expr2: 2
    }
  });
  expected = {
    expr1: '10',
    op: 'plus',
    expr2: '20',
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper AST with static property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: Object(0),
      op: 'plus',
      expr2: Object(2)
    }
  });
  expected = {
    expr1: 0,
    op: 'plus',
    expr2: 2,
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper AST with boxed number property');

  ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      expr2: 2,
      str(children) {
        return children.map(function(child) {
          return child.toAST(this.args.mapping);
        }, this).join('');
      }
    }
  });
  expected = {
    expr1: '10',
    expr2: '20',
    str: '10+20',
    type: 'AddExp_plus'
  };
  t.deepEqual(ast, expected, 'proper AST with computed property');

  matchResult = g.match('10 + 20 - 30');
  ast = toAST(matchResult, {
    AddExp_plus: 2
  });
  expected = {
    0: '20', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus'
  };
  t.deepEqual(ast, expected, 'proper AST with forwarded child node');

  ast = toAST(matchResult, {
    AddExp_plus(expr1, _, expr2) {
      expr1 = expr1.toAST(this.args.mapping);
      expr2 = expr2.toAST(this.args.mapping);
      return 'plus(' + expr1 + ', ' + expr2 + ')';
    }
  });
  expected = {
    0: 'plus(10, 20)', // child 2 of AddExp_plus
    2: '30',
    type: 'AddExp_minus'
  };
  t.deepEqual(ast, expected, 'proper AST with computed node/operation extension');

  ast = toAST(matchResult, {
    Exp: {
      type: 'Exp',
      0: 0
    }
  });
  expected = {
    0: {
      0: {
        0: '10',
        2: '20',
        type: 'AddExp_plus'
      },
      2: '30',
      type: 'AddExp_minus'
    },
    type: 'Exp'
  };
  t.deepEqual(ast, expected, 'proper AST with explicity reintroduced node');

  t.end();
});

test('real examples (combinations)', t => {
  const matchResult = g.match('10 + 20 - 30');

  let ast = toAST(matchResult, {
    AddExp_plus: {
      expr1: 0,
      op: 1,
      expr2: 2,
      type: 'Expression'
    },
    AddExp_minus: {
      expr1: 0,
      op: 1,
      expr2: 2,
      type: 'Expression'
    }
  });
  let expected = {
    expr1: {
      expr1: '10',
      expr2: '20',
      op: '+',
      type: 'Expression'
    },
    expr2: '30',
    op: '-',
    type: 'Expression'
  };
  t.deepEqual(ast, expected, 'proper AST for arithmetic example #1');

  ast = toAST(matchResult, {
    AddExp_plus: {
      augend: 0,
      addend: 2,
      type: 'AddExpression'
    },
    AddExp_minus: {
      minuend: 0,
      subtrahend: 2,
      type: 'SubExpression'
    }
  });
  expected = {
    minuend: {
      augend: '10',
      addend: '20',
      type: 'AddExpression'
    },
    subtrahend: '30',
    type: 'SubExpression'
  };
  t.deepEqual(ast, expected, 'proper AST for arithmetic example #2');

  t.end();
});
