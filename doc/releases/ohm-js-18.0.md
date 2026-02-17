# Ohm v18.0 Beta — Migration Guide

Ohm v18 compiles grammars to WebAssembly. The runtime is smaller and faster, but the API has changed significantly. This guide covers everything you need to migrate from v17.

## Installation

```bash
npm install ohm-js                      # Runtime (production dependency)
npm install --save-dev @ohm-js/compiler # Compiler (dev dependency)
```

## Compiling grammars

In v17, grammars were parsed at runtime. In v18, the recommendation is to compile them to `.wasm` at build time.

### Command line

```bash
npx ohm2wasm my-grammar.ohm   # writes my-grammar.wasm
```

### Programmatic

```js
import {compile, compileGrammars} from '@ohm-js/compiler';

const bytes = compile('MyGrammar { start = "hello" }');

// Multiple grammars:
const bytesByName = compileGrammars(source); // Record<string, Uint8Array>
```

## Loading and using grammars

```js
import {Grammar} from 'ohm-js';
import fs from 'node:fs';

const g = await Grammar.instantiate(fs.readFileSync('my-grammar.wasm'));

// Or from a fetch response:
const g = await Grammar.instantiateStreaming(fetch('my-grammar.wasm'));
```

## MatchResult lifecycle

Parse results live in Wasm linear memory and must be explicitly disposed.

### `using` (recommended)

```js
using result = g.match(input);
if (result.succeeded()) {
  // ... use result ...
}
// Memory is automatically freed when `result` goes out of scope.
```

### `.use()` callback

In environments that don't support the `using` keyword, the `use()` callback should be used:

```js
g.match(input).use(result => {
  if (result.succeeded()) {
    // ... use result ...
  }
});
```

### Notes

- Results must be disposed in LIFO order (most recent first).
- Forgetting to dispose a result will prevent subsequent `match()` calls from succeeding.

## CST nodes

In v17, you access CST nodes through Semantics wrappers. In v18, `MatchResult` gives you the CST directly — there is no Semantics layer (not yet, at least).

```js
using result = g.match(input);
if (result.succeeded()) {
  const cst = result.getCstRoot(); // NonterminalNode
  console.log(cst.ctorName);       // rule name
  console.log(cst.sourceString);   // matched text
  console.log(cst.children);       // child nodes
}
```

### Node types

All nodes share: `ctorName`, `sourceString`, `source` (with `startIdx`/`endIdx`), `children`.

| Type | `ctorName` | Description |
|------|-----------|-------------|
| `NonterminalNode` | rule name | Has `.isSyntactic()`, `.isLexical()`, `.leadingSpaces` |
| `TerminalNode` | `"_terminal"` | Has `.value` |
| `ListNode` | `"_list"` | From `*` or `+`. Has `.collect(cb)` |
| `OptNode` | `"_opt"` | From `?`. Has `.ifPresent(cb, orElse?)`, `.isPresent()`, `.isEmpty()` |
| `SeqNode` | `"_seq"` | Grouped sequence. Has `.unpack(cb)` |

Type guards: `node.isNonterminal()`, `node.isTerminal()`, `node.isList()`, `node.isOptional()`, `node.isSeq()`.

### Arity changes

- Iter (`*`/`+`) and Opt (`?`) nodes are **no longer flattened**. In v17, `a b c*` would give a semantic action 4 arguments (a, b, c_1, c_2, ...); in v18, you get 3 children, where the third is a `ListNode`.
- Positive lookahead (`&e`) **does not bind a node**.

### Working with ListNode

```js
// .collect() maps over items, unpacking SeqNode children as arguments:
const items = listNode.collect((name, sep, value) => {
  return {name: name.sourceString, value: value.sourceString};
});
```

### Working with OptNode

```js
// .ifPresent() calls the callback if the option matched, with SeqNode unpacking:
const val = optNode.ifPresent(
  child => child.sourceString,
  () => 'default'
);
```

### Working with SeqNode

```js
// .unpack() spreads children as callback arguments:
seqNode.unpack((left, op, right) => {
  // ...
});
```

## Error handling

```js
using result = g.match(input);
if (result.failed()) {
  console.log(result.message);      // Full message with line/col and input excerpt
  console.log(result.shortMessage); // "Line 1, col 5: expected ..."
  console.log(result.getExpectedText());          // "letter or digit"
  console.log(result.getRightmostFailurePosition()); // number
  console.log(result.getRightmostFailures());     // Failure[]
}
```

## Removed APIs

The following v17 APIs do not exist in v18 (yet):

- **Semantics** — `createSemantics()`, `addOperation()`, `addAttribute()`, `extendSemantics()`. Traverse the CST directly instead.
- **Matcher** — `grammar.matcher()` and incremental parsing.
- **Tracing** — `grammar.trace()`.
- **Extras** — `ohm-js/extras` (including `toAST`). See `@ohm-js/to-ast-compat` below.
- **Recipes** — `makeRecipe()`.
- **PExprs** — The `pexprs` export.
- **Grammar introspection** — `grammar.rules` (available via compat layer).

## Compat helpers

### `@ohm-js/compiler/compat`

For incremental migration, `grammar()` and `grammars()` parse, compile, and instantiate in one step — matching the v17 API:

```js
import {grammar} from '@ohm-js/compiler/compat';

const g = grammar('MyGrammar { start = "hello" }');
using result = g.match('hello');
```

This compiles on every call. For production, compile to `.wasm` ahead of time.

### `@ohm-js/to-ast-compat`

Replaces `toAST` from `ohm-js/extras`.

```bash
npm install @ohm-js/to-ast-compat
```

Old (v17):

```js
import {toAST} from 'ohm-js/extras';

const ast = toAST(match, {
  Equation: {content: 0},
  AddExpr: {type: 'Expression', expr1: 0, op: 1, expr2: 2},
});
```

New (v18):

```js
import {createToAst} from '@ohm-js/to-ast-compat';

const toAST = createToAst({
  Equation: {content: 0},
  AddExpr: {type: 'Expression', expr1: 0, op: 1, expr2: 2},
});

// Later:
const ast = toAST(matchResult); // accepts MatchResult or CstNode
```

#### Differences from v17's `toAST`

- Mapping functions receive `CstNode` args (similar to v17's `Node`, but slightly different interface).
- Recursive calls: use `toAST(someNode)` instead of `someNode.toAST(this.args.mapping)`.
- The `AstBuilder` class is also exported for advanced use — it has a `currNode` property and a `toAst()` method.
