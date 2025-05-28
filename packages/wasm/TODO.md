## Unanswered questions

- How to deal with matchLength in lookahead. In regular Ohm, lookahead _does_ bind things. But that is hard to square with the current CST representation, that stores only the matchLength. Because somehow the things inside a lookahead must consume nothing — but if you have `&("a" "b")`, the only way to make them consume nothing (in the current representation) is to rewrite the matchLength of the two terminal nodes.
  - Could we introduce a pseudo-node for lookahead? It could get transparently unpacked when walking the tree.
