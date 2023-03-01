# Ohm v16.0

## Upgrading

### Args to _\_iter_ and _\_nonterminal_ actions

<!-- https://ohmjs.org/d/ati -->

The [`_iter` and `_nonterminal` actions](../api-reference.md#special-actions) now take a variable number of arguments, rather than a single `Node[]` argument containing the child nodes. To make existing code work with Ohm v16, you should change the parameter to a [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) — e.g., `_iter(children) { ... }` should be changed to `_iter(...children) { ... }`. You can easily find code that needs to change because `addOperation` and friends will now throw an exception if your actions have a single parameter which is _not_ a rest parameter. See [#324](https://github.com/harc/ohm/issues/324) for the reasons behind this change.

### Default semantic actions

<!-- https://ohmjs.org/d/dsa -->

In operations and attributes, if you haven't defined a semantic action for a particular rule application node, a default action will be used in some cases. For example, your grammar has an _AddExp_ rule but your action dictionary doesn't contain a semantic action named 'AddExp'. **In Ohm v16.0, there is no longer a default action for iteration nodes** — it is _only_ defined for non-terminal nodes with exactly one child. See [#309](https://github.com/harc/ohm/issues/309) for context on this change.

Semantic actions that worked in previous versions of Ohm may need to be modified to work with v16.0. You can identify the code that needs modification because they will now raise a "missing semantic action" error. The [recommended way of dealing with iteration nodes](https://github.com/harc/ohm/blob/main/doc/patterns-and-pitfalls.md#iteration-nodes) is to use the `children` attribute to explicitly invoke the operation on each child, e.g. `iterNode.myOperation()` becomes `iterNode.children.map(c => c.myOperation())`. This way, it's clear to readers of the code that the result is an array.

In some cases, it makes sense to write a generic _\_iter_ action that specifies the behaviour for all iteration nodes. This also makes it possible to replicate the old behaviour of the default action:

```
_iter(...children) {
  return children.map(c => c.myOperation());
}
```

### grammarFromScriptElement / grammarsFromScriptElements

<!-- https://ohmjs.org/d/gfs -->

The functions `grammarFromScriptElement` and `grammarsFromScriptElements` have been removed. When using Ohm in the browser, it's now recommended to put your grammar in a [template literal with String.raw](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw):

```js
const myGrammar = ohm.grammar(String.raw`
  MyGrammar {
    greeting = "Hello" | "Hola"
  }
`);
```

### Type parameters for operations and actions (TypeScript only)

On semantics objects, the methods `addOperation`, `extendOperation`, `addAttribute`, and `extendAttribute` now have a required type parameter, which is the return type of the operation (or the type of the attribute). The related types `Action` and `ActionDict` are similarly parameterized by the return type of the semantic actions. In other words, all of the semantic actions for a particular operation/attribute are now required to have a consistent return type.

The simplest change to make your code compatible with Ohm v16 is to simply specify the type paramter. E.g., `semantics.addOperation('toString', { ... })` becomes `semantics.addOperation<string>('toString', { ... })`. In some cases, it may be necessary to use `any`, which is the type that was assumed in previous versions of Ohm.

## Other changes

- `Grammar.semantics` has been completely removed. Use `Grammar.createSemantics` instead.

## New deprecations

- `Node.primitiveValue` is now deprecated in favour of `Node.sourceString`.
