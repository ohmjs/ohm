# @ohm-js/compiler

Compile Ohm.js grammars to WebAssembly.

This package is typically a **dev dependency** — use it to compile `.ohm` grammars to `.wasm` at build time. At runtime, use [`ohm-js`](https://www.npmjs.com/package/ohm-js) to load and use the compiled grammars.

```bash
npm install --save-dev @ohm-js/compiler
npm install ohm-js
```

**NOTE:** This package is experimental; the API is not yet stable.

## Usage (compiling to Wasm)

### Command line

```
npx ohm2wasm my-grammar.ohm
```

This will write a Wasm grammar blob to ./my-grammar.wasm.

### API

```js
import {compile} from '@ohm-js/compiler';

// compile() returns the Wasm grammar blob as a Uint8Array.
const bytes = compile('MyGrammar { start = "blah" }');
```

If the source contains multiple grammars, you can specify which one to compile:

```js
const bytes = compile(source, {grammarName: 'MyGrammar'});
```

…or compile all grammars at once:

```js
import {compileGrammars} from '@ohm-js/compiler';

// Returns a Record<string, Uint8Array>.
const bytesByName = compileGrammars(source);
```

#### Compat mode

For compatibility with existing v17 codebases, `@ohm-js/compiler/compat` provides
`grammar()` and `grammars()` functions that parse, compile, and instantiate in one step:

```js
import {grammar} from '@ohm-js/compiler/compat';

const g = grammar('MyGrammar { start = "blah" }');
const result = g.match('blah');
console.log(result.succeeded()); // true
```

Note: this compiles the grammar to Wasm on every call. For production use,
it's recommended to compile to `.wasm` ahead of time and load with the `ohm-js` runtime:

```js
import {Grammar} from 'ohm-js';

const g = await Grammar.instantiate(fs.readFileSync('my-grammar.wasm'));
const result = g.match('blah');
```

**Important:** `MatchResult`s must be explicitly disposed to free Wasm memory — use `using` or `.use()`. See [MatchResult lifecycle](../../doc/releases/ohm-js-18.0.md#matchresult-lifecycle) for details.

#### Differences from v17

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
- Node >= 20
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
