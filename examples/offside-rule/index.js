import * as ohm from 'ohm-js';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {
  IndentationSensitive,
  findIndentationPointsForTesting as findIndentationPoints,
} from './grammar.js';

const g = ohm.grammar(
    String.raw`
  Outline <: IndentationSensitive {
    Items = Item+
    Item = "-" label indent Items dedent  -- withChildren
         | "-" label  -- leaf

    label = (~newline any)* eol
//    indent = "{"
//    dedent = "}"

    eol = newline | end
    newline = "\r\n" | "\r" | "\n"
    spaces := (~newline space)*
  }
`,
    {IndentationSensitive}
);
const semantics = g.createSemantics().addOperation('toJS', {
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

// assert.is(g.match('- foo').succeeded(), true);
// assert.is(g.match('- foo\n{- blah\n}').succeeded(), true);

const toJS = input => {
  const matchResult = g.match(input);
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

test('findIndentationPoints', () => {
  assert.equal(findIndentationPoints(''), {});
  assert.equal(findIndentationPoints('  x'), {2: 1, 3: -1});
  assert.equal(findIndentationPoints('  x\n  y'), {2: 1, 7: -1});
  assert.equal(findIndentationPoints('  x\n   y'), {2: 1, 7: 1, 8: -2});
  assert.equal(findIndentationPoints('  x\n   y\nz'), {2: 1, 7: 1, 9: -2});
  assert.equal(findIndentationPoints('\n   y\n'), {4: 1, 6: -1});
});

/*
  Now - can we use the Matcher API to rewrite the input stream?

  There are a couple of ways we could do it:
  - insert regular characters into the input stream - then we have to do sourcemap type stuff
  - give InputStream a general way to match "pseudo" characters. `end` is an example.
    - could just prefill the memo table.

  Prefilling the memo table
  - slight problem with incremental parsing: changes to a range can affect memo table
    entries further ahead in the table - this wasn't the case before. Possible sol'ns:
    * scan the whole table (in certain scenarios), and allow the memo entry to specify
     a backwards range that it is affected by
    * have paired memo table entries, where invalidation of one automatically invalidates
      the other (indent / dedent). Would this work?
    * how does having a lexer even interact with incremental parsing anyways?
      * could some kind of "token" rule let Ohm be kinda smart about it?
      * or could we have something like a callback that you implement?


*/

test.run();
