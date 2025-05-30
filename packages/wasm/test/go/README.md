# Ohm-WASM Go Integration

This directory contains a Go implementation for running Ohm grammars compiled to WebAssembly. It provides a simple API to load grammar modules, match input against them, and access the resulting concrete syntax trees.

## Overview

The implementation consists of two main components:

1. **matcher.go**: A Go implementation of the JavaScript `WasmMatcher` class from the Ohm `wasm` package
2. **testmain.go**: A command-line program that demonstrates how to use the WasmMatcher

## WasmMatcher

The `WasmMatcher` class provides a high-level API for working with Ohm grammars compiled to WebAssembly:

```go
// Create a new matcher
matcher := NewWasmMatcher(ctx)

// Load a grammar module
err := matcher.LoadModule("path/to/grammar.wasm")

// Set input text
matcher.SetInput("text to match")

// Match against the grammar
success, err := matcher.Match()

// Match against a specific rule
success, err := matcher.MatchRule("specificRule")

// Access the concrete syntax tree
cstRoot, err := matcher.GetCstRoot()
```

## Command-Line Usage

You can use the command-line program to test Ohm grammars:

```
# Test the simple add function (automatically detected)
./testmain -wasm ../data/_add.wasm

# Match input against a grammar
./testmain -wasm path/to/grammar.wasm -input "text to match"

# Specify a start rule
./testmain -wasm path/to/grammar.wasm -input "text to match" -rule "StartRule"
```

### Example with ES5 Grammar

```
./testmain -wasm ../data/_es5.wasm -input "var x = 3;"
```

## Build Instructions

Use the Makefile in the parent directory to build and test:

```
# Build the testmain program
make test/go/testmain

# Run the test with the ES5 grammar
make go-test-es5
```
