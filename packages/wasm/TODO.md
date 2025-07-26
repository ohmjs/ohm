## TODOs

- [x] Include a map of rule name to ruleId in the module.
- [x] Implicit space skipping
- [ ] Error handling
- [x] NonterminalNodes should keep track of the rule
- [ ] When iteration contains a sequence, the children are flattened into the iter node.
- [x] Basic parameterized rules
- [x] Parameterized rules with >3 params
- [x] Parameters that aren't terminals
- [x] Memoization for parameterized rules
- [x] Support direct left recursion.
- [x] Separate API for _creating_ the Wasm module from the WasmMatcher interface.
- [x] Implement a proper CLI.

Cleanups:

- [ ] Handle left recursion detection at grammar parse time.
- [ ] Handle non-memoization of inline rules at grammar parse time

Optimizations:

- [ ] Avoid unnecessary dispatch in generalized rules
- [ ] Avoid duplicate lifted rules.
- [ ] Compressed (32-bit) header for Nonterminal nodes in common case
- [ ] Compressed (inline 32-bit) repr for Terminal nodes
- [ ] Proper preallocated nodes (incl. failurePos) for common cases

## Limitations

- The input is assumed to be no bigger than 64k.
- For the memo table, we assume that there are no more than 256 rules in the grammar.

## Unanswered questions

- How to deal with matchLength in lookahead. In regular Ohm, lookahead _does_ bind things. But that is hard to square with the current CST representation, that stores only the matchLength. Because somehow the things inside a lookahead must consume nothing — but if you have `&("a" "b")`, the only way to make them consume nothing (in the current representation) is to rewrite the matchLength of the two terminal nodes.
  - Could we introduce a pseudo-node for lookahead? It could get transparently unpacked when walking the tree.
