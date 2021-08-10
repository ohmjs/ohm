# Ohm v16.0

## Upgrading

### Default semantic actions

In operations and attributes, if you haven't defined a semantic action for a particular rule application node, a default action will be used in some cases. For example, your grammar has an _AddExp_ rule but your action dictionary doesn't contain a semantic action named 'AddExp'. **In Ohm v16.0, there is no longer a default action for iteration nodes** — it is *only* defined for non-terminal nodes with exactly one child. See [#309](https://github.com/harc/ohm/issues/309) for context on this change.

Semantic actions that worked in previous versions of Ohm may need to be modified to work with v16.0. You can identify the code that needs modification because they will now raise a "missing semantic action" error. The [recommended way of dealing with iteration nodes](https://github.com/harc/ohm/blob/master/doc/patterns-and-pitfalls.md#iteration-nodes) is to use the `children` attribute to explicitly invoke the operation on each child, e.g. `iterNode.children.map(c => c.myOperation())`. This way, it's clear to readers of the code that the result is an array.

In some cases, it makes sense to write a generic *_iter* action that specifies the behaviour for all iteration nodes. This also makes it possible to replicate the old behaviour of the default action:

```
_iter(children) {
  return children.map(c => c.myOperation());
}
```

## Other changes

- `Grammar.semantics` has been completely removed. Use `Grammar.createSemantics` instead.

## New deprecations

- `Node.primitiveValue` is now deprecated in favour of `Node.sourceString`.
