# @ohmjs/wasm

Compile Ohm.js grammars to WebAsssembly (aka Wasm), so they can be used from other languages.

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
import {Compiler} from '@ohmjs/wasm';

// Instantiate your own grammar…
const g = ohm.grammar('MyGrammar { start = "blah" }');

// compile() returns the Wasm grammar blob as a Uint8Array.
const bytes = new Compiler(g).compile();
```
