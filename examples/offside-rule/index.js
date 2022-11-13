import * as ohm from 'ohm-js';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {
  IndentationSensitive,
  findIndentationPointsForTesting as findIndentationPoints,
} from './grammar.js';

const outline = ohm.grammar(
    String.raw`
  Outline <: IndentationSensitive {
    Items = Item+
    Item = "-" label indent Items dedent  -- withChildren
         | "-" label  -- leaf

    label = (~newline any)* eol

    eol = newline | end
    newline = "\r\n" | "\r" | "\n"
    spaces := (~newline space)*
  }
`,
    {IndentationSensitive}
);
const semantics = outline.createSemantics().addOperation('toJS', {
  Items(items) {
    return items.children.map(c => c.toJS());
  },
  Item_withChildren(_, label, _indent, items, _dedent) {
    return [label.toJS(), ...items.toJS()];
  },
  Item_leaf(_, label) {
    return [label.toJS()];
  },
  label(chars, _) {
    return chars.sourceString;
  },
});

const toJS = input => {
  const matchResult = outline.match(input);
  if (matchResult.succeeded()) {
    return semantics(matchResult).toJS();
  } else {
    throw new Error(matchResult.message);
  }
};

test('grammar', () => {
  assert.equal(toJS('- l1.1'), [['l1.1']]);
  assert.equal(toJS('- l1.1\n  - l2.1\n'), [['l1.1', ['l2.1']]]);
  assert.equal(toJS('- l1.1\n  - l2.1\n  - l2.2\n'), [['l1.1', ['l2.1'], ['l2.2']]]);
  assert.equal(toJS('- l1.1\n  - l2.1\n  - l2.2\n    - l3.1\n'), [
    ['l1.1', ['l2.1'], ['l2.2', ['l3.1']]],
  ]);
});

test('errors', () => {
  const g = ohm.grammar(
      String.raw`
    G <: IndentationSensitive {
      IfExpr = "if" Expr ":" Block
      Block = indent Expr dedent
      Expr = IfExpr
           | "True"
           | "False"
           | number

      number = digit+
    }
  `,
      {IndentationSensitive}
  );

  assert.is(g.match('if True:\n  3').succeeded(), true);
  assert.is(g.match('if True:\n  if False:\n    3').succeeded(), true);
  assert.is(g.match('if True:\n3').shortMessage, 'Line 2, col 1: expected an indented block');
  assert.is(
      g.match('if True:\n if False:\n 3').shortMessage,
      'Line 3, col 2: expected an indented block'
  );
});

test('findIndentationPoints', () => {
  assert.equal(findIndentationPoints(''), {});
  assert.equal(findIndentationPoints('  x'), {2: 1, 3: -1});
  assert.equal(findIndentationPoints('  x\n  y'), {2: 1, 7: -1});
  assert.equal(findIndentationPoints('  x\n   y'), {2: 1, 7: 1, 8: -2});
  assert.equal(findIndentationPoints('  x\n   y\nz'), {2: 1, 7: 1, 9: -2});
  assert.equal(findIndentationPoints('\n   y\n'), {4: 1, 6: -1});
});

test.run();
