import assert from 'node:assert/strict';

import * as ohm from 'ohm-js';
import {recoverSourceOrder} from 'ohm-js/extras';

/*
  Our goal will be to compute line and column information for all of the nodes
  in the tree, and do it in a way that's friendly to incremental evaluation.

  Incrementality wouldn't help you much if you need to do (say) produce an
  AST with line/column information on every node, because an edit at the
  beginning of the input would always require updating nearly every node in
  the tree.

  But, there are lots of cases where you might only need to know line and
  column information for selected nodes. For example, we'll ipmlement an
  operation called `findNodeAt` that finds the top-most node at a given line
  and column position. By maintaining size information for all nodes in the
  tree, se can use tree search to quick find the node at a given position.

  This is similar to how the _rope_ data structure works. In fact, in text
  editors, there are many useful things that can be represented this way.
  See https://zed.dev/blog/zed-decoded-rope-sumtree for a good overview.

  Another (fancier) term for what we're doing here is "monoid-cached tree".
 */

/*
   A simple grammar containing only lexical rules, i.e. rules whose name begins
   with a lowercase letter. They need to be _lexical_ rules, because otherwise
   Ohm's implicit space skipping wouldn't let us easily see the newlines.
  */
const g = ohm.grammar(String.raw`
   Listy {
       start = expr spaces
       expr = spaces (list | num | nil)
       list = spaces "[" expr* spaces "]"
       num = digit+
       nil = "nil"
   }
 `);

// In abstract algebra, a _monoid_ is a set (or a data type) that has
// (a) a "combine" operation that's associative, i.e. (a + b) + c = a + (b + c)
// (b) an identity or neutral element.
// This is our identity element…
const LOC_IDENTITY = {line: 0, col: 0};

// …and this is our "combine" operator.
function sumLocations(a, b) {
  return {
    line: a.line + b.line,
    // If `b` has more than one line, we can ignore `a.col`.
    col: b.line > 0 ? b.col : a.col + b.col,
  };
}

function compareLocations(a, b) {
  return a.line - b.line || a.col - b.col;
}

const semantics = g.createSemantics();

// A helper operation to get the "size" of a node, such that
// endLoc = sumLocations(startLoc, size).
semantics.addAttribute('_size', {
  _default(...children) {
    return children.reduce((acc, node) => sumLocations(acc, node._size), LOC_IDENTITY);
  },
  _terminal() {
    const lines = this.sourceString.split('\n');
    return {
      line: lines.length - 1,
      col: lines.at(-1)?.length || 0,
    };
  },
});

// Returns the top-most node at a given location.
// `loc` is the "needle", i.e. the position we're searching for.
// `baseLoc` is the start location of the node being searched.
semantics.addOperation('findNodeAt(loc, baseLoc)', {
  _nonterminal(...children) {
    const {loc, baseLoc} = this.args;
    assert(children.length > 0, 'Node has no children!');
    assert(compareLocations(baseLoc, loc) <= 0, 'Already passed the searched-for location!');

    // One thing to watch out for: due to the way Ohm represents repetitions,
    // a post-order traversal of the tree doesn't necessarily visit nodes
    // in the order they appear in the input. For example, an expression
    // like `(a b)*` produces two iter nodes: one with all the a's, and
    // another with the b's. This is useful in some scenarios, but it makes
    // tree search impossible.
    // This is *only* a problem if the grammar has repetition expressions
    // with arity >1. E.g., `a*` is not problematic, but `(a b)*` is.
    // Even though it's not strictly required for this grammar, we use
    // `recoverSourceOrder` here, which fixes the issue by replacing iter
    // nodes with their children, and reordering them to restore the original
    // input order.
    const descendants = recoverSourceOrder(this.children);

    // Base case: this node is *at* the searched-for position.
    if (compareLocations(loc, baseLoc) === 0) return this;

    // Recursive case: it's in one of the children.
    let prevEndLoc = baseLoc;
    for (const node of descendants) {
      const endLoc = sumLocations(prevEndLoc, node._size);
      if (compareLocations(loc, endLoc) < 0) {
        return node.findNodeAt(loc, prevEndLoc);
      }
      prevEndLoc = endLoc;
    }
    // If we get here, it's not in this subtree at all.
    return null;
  },
  // Note: we don't need an _iter action; the use of `recoverSourceOrder` in
  // the _nonterminal action ensures that we'll never encounter iter nodes.
});

// Here's how the findNodeAt operation works in practice:

const matcher = g.matcher();
matcher.setInput(`
  [
    3
    45 99
  ]
`);
assert.ok(matcher.match().succeeded());

const findNodeAt = pos => {
  return semantics(matcher.match()).findNodeAt(pos, LOC_IDENTITY);
};

const node = findNodeAt({line: 2, col: 4});
assert.equal(node.ctorName, 'num');
assert.equal(node.sourceString, '3');

// Change '3' to '43', and add '44' on a new line.
matcher.replaceInputRange(9, 10, '43\n    44');
assert.equal(findNodeAt({line: 2, col: 4}).sourceString, '43');
assert.equal(findNodeAt({line: 3, col: 4}).sourceString, '44');
