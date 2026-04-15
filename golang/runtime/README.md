# Ohm Go runtime

A Go implementation of the `Grammar` and `MatchResult` classes from the [ohm-js](https://www.npmjs.com/package/ohm-js) package, for use with Ohm grammars compiled to WebAssembly.

## Usage

```go
// Instantiate a grammar from compiled Wasm bytes
wasmBytes, _ := os.ReadFile("path/to/grammar.wasm")
g, err := NewGrammar(ctx, wasmBytes)
defer g.Close()

// Match input against the grammar (optional second arg is start rule)
result, err := g.Match("var x = 1;")
defer result.Close()

if result.Succeeded() {
    cstRoot, err := result.GetCstRoot()
    // ...walk the tree
}
```

## Build and Test

From the compiler package directory (`packages/compiler`):

```bash
make go-test-es5    # build es5.wasm and run Go tests
```
