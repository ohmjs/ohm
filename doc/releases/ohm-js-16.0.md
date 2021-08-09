# Ohm v16.0

## Upgrading

### Default semantic actions

In operations and attributes, if you haven't defined a semantic action for a particular rule application node, a default action will be used in some cases. For example, your grammar has an _AddExp_ rule but your action dictionary doesn't contain a semantic action named 'AddExp'. **In Ohm v16.0**, there are two significant changes to the default actions:

1. There is no longer a default action for iteration nodes.
2. For non-terminal nodes, the default action does not apply if the node's only child is an iteration node. Previously, Ohm would use the default action for non-terminal nodes with exactly one child — no matter what the type of the child node was (iteration, terminal, non-terminal).

In other words, the new behaviour is: a default semantic action is *only* defined for non-terminal nodes whose only child is either a terminal or non-terminal node. See [#308](https://github.com/harc/ohm/pull/308) and [#309](https://github.com/harc/ohm/issues/309) for context on these changes.

When upgrading to Ohm v16.0, you may need to modify your code in cases where you were relying on the default action:

1. For iteration nodes, we recommend that you use the `children` attribute to explicitly invoke the operation on each child, e.g. `iterNode.children.map(c => c.myOperation())`. This way it's clear that the result will be an array.

    In some cases, it makes sense to write a generic *_iter* action that specifies the behaviour for all iteration nodes. This is also how you can replicate the old behaviour of the default action:

    ```
    _iter(children) {
      return children.map(c => c.myOperation());
    }
    ```

2. For non-terminal nodes whose only child is an iteration node, you'll need to define a semantic action, e.g.:
    ```
    letters(letterIter) {
      return letterIter.children.map(c => c.myOperation()).join('');
    }
    ```

## Other changes

- `Grammar.semantics` has been completely removed. Use `Grammar.createSemantics` instead.

## New deprecations

- `Node.primitiveValue` is now deprecated in favour of `Node.sourceString`.
