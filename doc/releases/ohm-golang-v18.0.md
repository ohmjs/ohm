# Ohm Go v18.0 — API Specification

This document specifies the Go runtime API for Ohm v18. The Go implementation consumes `.wasm` files produced by the Ohm compiler. This document is the authoritative specification for the implementation; portions marked **[not yet implemented]** describe the target behavior.

## TL;DR

Prerequists
- Golang
- Docker (for generating wasm files from ohm source)

```bash
cd golang/examples
# Step 1
go generate
# expected output 'Wrote Wasm to my-grammar.wasm'

# Step 2
go build
# note, if Step 1 failed, the build will fail with a message '... pattern my-grammar.wasm: no matching files found'

# Step 3
./ohmgo-examples
# or
./ohmgo-examples "<input>"
# expected out, 'match failed' or 'match succeeded'
```

## Compiling grammars

In v18 the grammar is compiled to a `.wasm` binary at build time, then loaded at runtime. The compiler is packaged as a Docker image.

### Command line (Docker)

The compiler is packaged as a Docker image. Mount your working directory to `/local` and use the `compile` subcommand:

```bash
docker run --rm -v "$(pwd):/local" ohm:latest compile my-grammar.ohm
# writes my-grammar.wasm in the current directory
```

With an explicit output path or grammar name:

```bash
docker run --rm -v "$(pwd):/local" ohm:latest compile -o out/my-grammar.wasm my-grammar.ohm
docker run --rm -v "$(pwd):/local" ohm:latest compile --grammarName MyGrammar my-grammar.ohm
```

### Build integration

Add a `go:generate` directive so `go generate` keeps the `.wasm` up to date:

**Note: this depends on the OS setting a PWD environment variable**

```go
//go:generate docker run --rm -v "$PWD:/local" ohm:latest compile my-grammar.ohm
```

## Loading and using grammars

```go
import (
    "context"
    "os"

    goohm "github.com/ohmjs/goohm/runtime"
)

wasmBytes, err := os.ReadFile("my-grammar.wasm")
if err != nil {
    // handle
}

ctx := context.Background()
g, err := goohm.NewGrammar(ctx, wasmBytes)
if err != nil {
    // handle
}
defer g.Close()
```

`NewGrammar` compiles the Wasm module and initialises the runtime. Call `Close` when the grammar is no longer needed to release all WebAssembly resources.

## MatchResult lifecycle

Parse results live in Wasm linear memory and **must be explicitly disposed**. Results must be disposed in LIFO order (most recent first).

### `defer` (recommended)

```go
result, err := g.Match(input)
if err != nil {
    // handle
}
defer result.Close()

if result.Succeeded() {
    // ... use result ...
}
```

### Explicit close

When you need precise control over disposal order (e.g. nested matches):

```go
result1, _ := g.Match(input1)
result2, _ := g.Match(input2)

result2.Close() // must close most-recent first
result1.Close()
```

### Notes

- Results must be disposed in LIFO order (most recent first).
- Failing to dispose a result will prevent subsequent `Match()` calls from succeeding.

## Matching with a start rule

By default, `Match` uses the grammar's default start rule. Pass an optional start rule name to override:

```go
result, err := g.Match(input, "MyRule")
```

## MatchResult API

```go
type MatchResult struct { /* ... */ }

func (r *MatchResult) Succeeded() bool
func (r *MatchResult) Failed() bool
func (r *MatchResult) Input() string
func (r *MatchResult) Close()

// CST access (only valid when Succeeded() is true)
func (r *MatchResult) GetCstRoot() (*CstNode, error)
```

## CST nodes

`MatchResult` gives you the CST directly — there is no Semantics layer.

```go
result, err := g.Match(input)
if err != nil {
    // handle
}
defer result.Close()

if result.Succeeded() {
    root, err := result.GetCstRoot()
    if err != nil {
        // handle
    }
    fmt.Println(root.CtorName())     // rule name
    fmt.Println(root.SourceString()) // matched text
    start, end := root.Source()
    children := root.Children()
}
```

### Node types

All nodes share: `CtorName()`, `SourceString()`, `Source()` (returns `startIdx, endIdx`), `Children()`.

| Type | `CtorName()` | Description |
|------|-------------|-------------|
| `NonterminalNode` | rule name | Has `IsSyntactic()`, `IsLexical()`, `LeadingSpaces()` |
| `TerminalNode` | `"_terminal"` | Has `Value()` |
| `ListNode` | `"_list"` | From `*` or `+`. Has `Collect(cb)` **[not yet implemented]** |
| `OptNode` | `"_opt"` | From `?`. Has `IfPresent(cb, orElse)`, `IsPresent()`, `IsEmpty()` **[not yet implemented]** |
| `SeqNode` | `"_seq"` | Grouped sequence. Has `Unpack(cb)` **[not yet implemented]** |

Type guards:

```go
node.IsNonterminal() bool
node.IsTerminal()    bool
node.IsList()        bool
node.IsOptional()    bool
node.IsSeq()         bool   // [not yet implemented]
```

### Arity

- Iter (`*`/`+`) and Opt (`?`) nodes are **not flattened**. A rule `a b c*` produces 3 children; the third is a `ListNode`.
- Positive lookahead (`&e`) **does not bind a node**.

### Working with ListNode

`Collect` maps over the items in a `ListNode`. When an item is a `SeqNode`, its children are unpacked as separate arguments to the callback.

**[not yet implemented]**

```go
// Signature (generic, exact form TBD with Go generics or interface{})
func (n *CstNode) Collect(cb func(items ...*CstNode) any) []any

// Example: rule like  items = (name ":" value)*
items := listNode.Collect(func(parts ...*CstNode) any {
    // parts[0] = name, parts[1] = ":", parts[2] = value
    return map[string]string{
        "name":  parts[0].SourceString(),
        "value": parts[2].SourceString(),
    }
})
```

### Working with OptNode

`IfPresent` calls the first callback if the option matched and the second (optional) callback otherwise. When the value is a `SeqNode`, its children are unpacked.

**[not yet implemented]**

```go
func (n *CstNode) IsPresent() bool
func (n *CstNode) IsEmpty() bool
func (n *CstNode) IfPresent(present func(parts ...*CstNode) any, orElse func() any) any

// Example
val := optNode.IfPresent(
    func(parts ...*CstNode) any { return parts[0].SourceString() },
    func() any { return "default" },
)
```

### Working with SeqNode

`Unpack` spreads the children of a `SeqNode` as arguments to the callback.

**[not yet implemented]**

```go
func (n *CstNode) Unpack(cb func(parts ...*CstNode))

seqNode.Unpack(func(parts ...*CstNode) {
    left, op, right := parts[0], parts[1], parts[2]
    _ = left; _ = op; _ = right
})
```

### LeadingSpaces

For syntactic rules, nonterminal nodes may carry implicit leading whitespace. `LeadingSpaces()` returns a `*CstNode` of type `ListNode` (possibly empty) representing those spaces.

**[not yet implemented as a public method]**

```go
func (n *CstNode) LeadingSpaces() *CstNode // ListNode; nil if not applicable
```

## Error handling

**[not yet implemented — fields below are the target API]**

When `result.Failed()` is true, the following fields are available:

```go
type MatchResult struct { /* ... */ }

func (r *MatchResult) Message() string              // Full message with line/col and input excerpt
func (r *MatchResult) ShortMessage() string         // "Line 1, col 5: expected ..."
func (r *MatchResult) GetExpectedText() string      // "letter or digit"
func (r *MatchResult) RightmostFailurePosition() int
func (r *MatchResult) RightmostFailures() []Failure
```

```go
result, _ := g.Match(input)
defer result.Close()

if result.Failed() {
    fmt.Println(result.Message())
    fmt.Println(result.ShortMessage())
    fmt.Println(result.GetExpectedText())
    fmt.Println(result.RightmostFailurePosition())
}
```

## Syntactic vs. lexical rule classification

`IsSyntactic()` checks whether the **first letter** of the rule name is an upper-case letter. Rule names that start with a non-letter character (e.g. `_ident`, `0digit`) are classified as lexical, not syntactic.

```go
node.IsSyntactic() bool // true iff first letter in CtorName() is upper-case
node.IsLexical()   bool // !IsSyntactic() for nonterminals
```

## Grammar introspection

```go
g.GetRuleNames() []string           // all rule names defined in the grammar
g.GetRuleId(name string) (int, bool) // rule name → internal id; false if not found
```

## Removed / not-yet-available APIs

The following are not present in v18 (mirroring the JS v18 status):

- **Semantics** — no `CreateSemantics`, `AddOperation`, `AddAttribute`. Traverse the CST directly.
- **Matcher** — no incremental parsing.
- **Tracing** — no `Trace()`.
- **Grammar introspection via `.Rules`** — use `GetRuleNames()` instead.

## Full example

```go
package main

import (
    "context"
    "fmt"
    "os"

    goohm "github.com/ohmjs/goohm/runtime"
)

func main() {
    wasmBytes, err := os.ReadFile("arithmetic.wasm")
    if err != nil {
        panic(err)
    }

    ctx := context.Background()
    g, err := goohm.NewGrammar(ctx, wasmBytes)
    if err != nil {
        panic(err)
    }
    defer g.Close()

    result, err := g.Match("1 + 2 * 3")
    if err != nil {
        panic(err)
    }
    defer result.Close()

    if result.Failed() {
        fmt.Println("Parse failed:", result.Message())
        return
    }

    root, err := result.GetCstRoot()
    if err != nil {
        panic(err)
    }

    walk(root, 0)
}

func walk(node *goohm.CstNode, depth int) {
    indent := ""
    for i := 0; i < depth; i++ {
        indent += "  "
    }
    fmt.Printf("%s%s %q\n", indent, node.CtorName(), node.SourceString())
    for _, child := range node.Children() {
        walk(child, depth+1)
    }
}
```
