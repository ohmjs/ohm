# minohm-go

A Go implementation of the [minohm][] interface, for using Ohm grammars from Go.

A _grammar blob_ is an [Ohm][] grammar that has been compiled to .wasm via the `@ohm-js/wasm` NPM package. To use a grammar blob to match some input, you need a miniohm implementation for your host language of choice (JavaScript, Go, Python, etc.) This package provides a miniohm implementation for the [Go Programming Language][go].

[minohm]: https://github.com/ohmjs/ohm/blob/main/doc/design/miniohm.md
[Ohm]: https://ohmjs.org
[go]: https://go.dev/

## Overview

- The `miniohm` module is in matcher.go and cst.go.
- An example can be found in cmd/example/main.go.

## Compiling grammars to Wasm

Use the `ohm2wasm` command from the `@ohm-js/wasm` NPM package to compile a .ohm file to a Wasm grammar blob. For example:

```
npx ohm2wasm myGrammar.ohm
```

See Makefile for an example.

## Matching input

Create a new `WasmMatcher` and use the `Match` function:

```go
matcher := NewWasmMatcher(ctx)
err := matcher.LoadModule("path/to/grammar.wasm")
matcher.SetInput("text to match")
success, err := matcher.Match()
cstRoot, err := matcher.GetCstRoot()
```

## Walking the CST

A full implementation of semantics, operations, etc. is not part of the miniohm interface. Instead, you can walk the CST (concrete syntax tree) directly using the CstNode interface. See cmd/example/main.go for an example.

## Developing

Useful commands:

```sh
make # Build
make test # Run tests
```
