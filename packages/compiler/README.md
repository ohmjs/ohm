# @ohm-js/compiler

Compile Ohm.js grammars to WebAsssembly, so they can be used from other languages.

To use the grammar, use the appropriate _miniohm_ package for your language.

**NOTE:** This package is experimental; the API is not yet stable.

## Prerequisites

This package requires Node 24.

## Usage (compiling to Wasm)

### Command line

```
npx ohm2wasm my-grammar.ohm
```

This will write a Wasm grammar blob to ./my-grammar.wasm.

### API

```
import * as ohm from 'ohm-js';
import {Compiler} from '@ohm-js/compiler';

// Instantiate your own grammar…
const g = ohm.grammar('MyGrammar { start = "blah" }');

// compile() returns the Wasm grammar blob as a Uint8Array.
const bytes = new Compiler(g).compile();
```

Differences:

**Arity**
- Iter and Opt nodes are no longer flattened.
- Positive lookahead does not bind a node.

**Building ASTs**
- `AstBuilder` class replaces `toAST`.
- Recursive calls: `this.toAst(node)` rather than `node.toAST(this.args.mapping)`
- `this.currNode` vs `this`.

### Development

#### Prerequisites

- pnpm
- Node >= 24
- Make

#### Setup

From the repo root:

```
pnpm install
```

#### Testing etc.

From packages/compiler dir:

```
pnpm test # Run all tests
pnpm ava test/test-liquid-html.js # Run a specific test file
make bench # Run perf benchmarks
node scripts/parseLiquid.js '/Users/pdubroy/dev/third_party/Shopify/dawn/**/*.liquid'
```
