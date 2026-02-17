# Ohm v18.0 Alpha

## @ohm-js/compiler/compat

A submodule with some helpers to make it easier to upgrade to v18.

Provides:

### `grammar()` and `grammars()`

In v18, it's recommended to compile your grammars to a Wasm blob at build time, and to use `Grammar.instantiate` (or `instantiateStreaming`) to load the compiled grammar.

`grammar()` and `grammars()` provide the same API as Ohm v17, compiling your grammar and instantiating it in a single step.

## MatchResult lifecycle

In v18, grammars are compiled to WebAssembly, and parse results (memo tables, CST nodes) live in Wasm linear memory. Unlike v17, where results were managed by the JavaScript garbage collector, v18 `MatchResult`s must be explicitly disposed to free this memory.

### `using` (recommended)

```js
using result = g.match(input);
if (result.succeeded()) {
  // ... use result ...
}
// Memory is automatically freed when `result` goes out of scope.
```

### `.use()` callback

```js
g.match(input).use(result => {
  if (result.succeeded()) {
    // ... use result ...
  }
});
```

### Notes

- Each `dispose()` frees only the memory for that particular match. If you have nested or stacked matches, earlier results remain valid.
- Results must be disposed in LIFO order (most recent first).
- Forgetting to dispose a result will prevent subsequent `match()` calls from succeeding.

## @ohm-js/to-ast-compat

### `createToAst`

In v17, the `ohm-js/extras` submodule provides [toAST](https://ohmjs.org/docs/extras#toastmatchresult-mapping), a helper for producing abstract syntax trees (ASTs). However, we now recommend avoiding the `toAST` helper and instead writing your own `toAST` operation directly, and `toAST` has been removed entirely in v18.

For existing users of `toAST` who would like to upgrade to v18, we provide `createToAst`:

Old (v17):

```js
import {toAST} from "@ohm-js/extras";

// …

const ast = toAST(match, {
  Equation: {content: 0},
  AddExpr: {type: 'Expression', expr1: 0, op: 1, expr2: 2},
});
```

New (v18):

```js
import {createToAst} from "@ohm-js/to-ast-compat";

const toAST = createToAst({
  Equation: {content: 0},
  AddExpr: {type: 'Expression', expr1: 0, op: 1, expr2: 2},
});

// …

const ast = toAST(match);
```

#### Differences

- With `createToAst`, when you provide a function in the mapping object, the arguments (and `this`) have type `CSTNode`. Conceptually, this is similar to the `Node` type in Ohm v17, but the interface is slightly different.
- In v17, you can call `toAST` recursively via `someNode.toAST(this.args.mapping)`. In v18, the result of `createToAST` is a function that includes the mapping, so you can just call it directly, passing the appropriate node: `toAST(someNode)`.
