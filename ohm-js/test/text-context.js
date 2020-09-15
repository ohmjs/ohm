'use strict';

const test = require('tape');

const ohm = require('..');
const { matchWithPredicates, GrammarWithPredicates } = ohm.experimental;

/* */
TODO:
- prevent memoization of withPredicate applications
- automatically save and restore changes to context? (e.g. using immer)
- semantic actions?
- figure out how to handle failures correctly
/* */

test.only('context', (t) => {

  const g = ohm.grammar(`
    G <: GrammarWithPredicates {
      Doc = OpenTag Doc CloseTag  -- recursive
          |                       -- base
      OpenTag = "<" tagName ">"
      CloseTag = "</" matchingTagName ">"
      tagName = withPredicate<"pushTagName", letter+>
      matchingTagName = withPredicate<"matchesOpenTagName", letter+>
    }
  `, { GrammarWithPredicates });
  const tagStack = [];
  const predicates = {
    pushTagName(name) {
      tagStack.push(name);
      return true;
    },
    matchesOpenTagName(name) {
      const openTagName = tagStack.pop();
      if (name !== openTagName) {
        tagStack.push(openTagName); // Restore stack.
        return false;
      }
      return true;
    }
  };
  t.ok(matchWithPredicates(g, '<foo></foo>', null, predicates).succeeded());
  t.ok(matchWithPredicates(g, '<foo></bar>', null, predicates).failed());

  t.end();
});
