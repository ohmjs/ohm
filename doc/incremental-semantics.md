# Incremental semantics

Ohm supports incremental parsing, meaning that once an input is parsed, it can be quickly reparsed after each edit operation. Incremental _parsing_ is straightforward to use: you just need to use instantiate a [Matcher object](https://ohmjs.org/docs/api-reference#matcher-objects) rather than directly using your Grammar's `match` method.

It's also possible to build fully incremental processing pipelines on top of Ohm's incremental parsing, but this is less straightforward. In this document we talk about some of the strategies for doing so.

## Understanding the _overlap rule_

TODO

## Defining an attribute

The first step for building an incremental processing pipeline is to define an attribute. In Ohm, an _attribute_ is like an operation, but (a) it takes no arguments, and (b) it is memoized. The attribute's value for a given node will be recalculated whenever the edit may have affected that node. For nodes that are not affected by an edit, the attribute value is cached.

So, the simplest kind of incremental processing pipeline you can build consists of a single attribute. For example, for an arithmetic grammar, you might define a `value` attribute for evaluating arithmetic expressions:

```js
const semantics = grammar.createSemantics().addAttribute('value', {
  Exp: (addExp) => addExp.value,
  AddExp_plus: (left, _op, right) => left.value + right.value,
  AddExp_minus: (left, _op, right) => left.value - right.value,
  AddExp: (priExp) => priExp.value,
  PriExp_paren: (_open, exp, _close) => exp.value,
  PriExp: (number) => number.value,
  number(digits) {
    return parseInt(this.sourceString, 10);
  }
});
```

And suppose you used the grammar and a `Matcher` object to evaluate an expression, then make an edit, then re-parse and re-evaluate:

```js
const m = grammar.matcher();

m.setInput('(1 + 2) + (3 - 4)');
assert.equal(semantics(m.match()).value, 2);

m.replaceInputRange(1, 2, '0'); // Replace 1 with 0
assert.equal(semantics(m.match()).value, 1);
```

Note that the `AddExp_minus` action, which calculates the value of "3 - 4", will only run once. The edit does not affect that part of the parse result, so the attribute value is cached.

Ohm's caching of attribute values is naive; notably, it does not track dependencies between attribute values or do any kind of [autotracking]([)](https://www.pzuraq.com/blog/what-is-reactivity) as seen in signals frameworks.

If the naive caching is not sufficient, there is an **internal** operation named `_forgetMemoizedResultFor` TODO

## Building more complex pipelines

You can leverage the caching of attributes to build more complex transformations. For example, if you define an `ast` attribute, you can rely on object identity to determine which AST nodes were affected by an edit:

```js
  const m = grammar.matcher();
  m.setInput("(1 + 2) + (3 - 4)");

  const seen = new Set(); // Could also use WeakSet here.
  let root = semantics(m.match()).ast;
  seen.add(root);
  seen.add(root.left);
  seen.add(root.right);

  m.replaceInputRange(1, 2, "0"); // Replace 1 with 0
  root = semantics(m.match()).ast;

  // The root and left child are recreated; the right child is reused.
  assert(!seen.has(root));
  assert(!seen.has(root.left));
  assert(seen.has(root.right));
```

You can then build additional transformations on top of the AST, using recursive tree-walking functions and memoization to avoid reprocessing unchanged subtrees. For example:

```js
  // Returns an array containing all the nubmers in the given subtree.
  function getNumbers(node, cache = new WeakMap()) {
    if (cache.has(node)) return cache.get(node);

    let result;
    if (node.type === "Number") {
      result = [node.value];
    }  else if (node.type === "BinaryOp") {
      result = [
        ...getNumbers(node.left, cache),
        ...getNumbers(node.right, cache),
      ];
    } else {
      throw new Error(`Unknown node type: ${node.type}`);
    }
    cache.set(node, result);
    return result;
  }
```

Rather than implementing the memoization yourself, you can also use an existing library like [memoizee](https://www.npmjs.com/package/memoizee), [micro-memoize](https://www.npmjs.com/package/micro-memoize), etc.

## Dependencies on siblings

When an attribute value depends on the value of a sibling, you can:

- Define an operation to compute the value, potentially taking one or more arguments with context information.
- Define an attribute which caches the value of invoking the operation on all the node's children.

This is an extremely useful pattern that can apply to many problems in text processing. For example, Ohm internally uses a version of this when calculating the absolute offset of nodes in the parse tree. Each node caches the relative offsets of all its children, so after an edit that affects _k_ nodes, the offsets can be updated in O(k) time.

See [Zed Decoded: Rope & SumTree](https://zed.dev/blog/zed-decoded-rope-sumtree) for a discussion of how this same pattern is used in text editors.
