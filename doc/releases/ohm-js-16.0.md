# Ohm v16.0

## Upgrading

### Default semantic actions

In operations and attributes, if there is no specific semantic action for a given rule application node, a default "pass-through" action will be used in some cases. For example, your grammar has an _AddExp_ rule but your action dictionary doesn't contain a semantic action named 'AddExp'. Previously, if the _AddExp_ node had exactly one child, then Ohm would automatically use a default action which returns the result of applying the operation or attribute to the node's only child. **In Ohm v16.0**, it's slightly more restrictive: the default action is _not_ used if the child is an iteration node.

This change was made to ensure that the default action is type-safe. In TypeScript terms, if an operation has a return type `T` for non-terminal nodes, then by default it returns `T[]` for iteration nodes. The old behaviour meant that the default action could return `T[]` for a non-terminal node, if its only child was an iteration node. This can no longer happen.

When upgrading to Ohm v16.0, you will have to explicitly specify a semantic action for rules where you were previously relying on the default action. To preserve the old behaviour, you can write your own pass-through action, e.g.: `letters(letterIter) { return letterIter.myOp(); }`.

## Other changes

- `Grammar.semantics` has been completely removed. Use `Grammar.createSemantics` instead.

## New deprecations

- `Node.primitiveValue` is now deprecated in favour of `Node.sourceString`.
