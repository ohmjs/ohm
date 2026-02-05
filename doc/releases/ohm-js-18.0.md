# Ohm v18.0 Alpha

## @ohm-js/wasm/compat

A submodule with some helpers to make it easier to upgrade to v18.

Provides:

### `grammar()` and `grammars()`

In v18, it's recommended to compile your grammars to a Wasm blob at build time, and to use `WasmGrammar.instantiate` (or `instantiateStreaming`) to load the compiled grammar.

`grammar()` and `grammars()` provide the same API as Ohm v17, compiling your grammar and instantiating it in a single step.

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
import {createToAst from "@ohm-js/wasm/compat";

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
