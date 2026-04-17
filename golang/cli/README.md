# OhmGo — CLI for Ohm, for Go

`ohmgo` is a command-line tool that helps you compile `.ohm` grammar files into WebAssembly (`.wasm`) for use with the [`goohm`](https://github.com/ohmjs/goohm) Go runtime.

It does not compile grammars directly. Instead, it generates the Docker command needed to compile them via the official `ohmjs/ohm` image — letting you review, adapt, or automate the compilation step however you like.

## Overview

The typical workflow for using Ohm in a Go project looks like this:

```
my-grammar.ohm  →  (docker compile)  →  my-grammar.wasm  →  embedded in Go binary
```

`ohmgo` handles the middle step by generating the correct `docker run` invocation, pinned to the version of the `goohm` runtime you're using.

## Installation

```bash
go install github.com/ohmjs/ohmgo@latest
```

Or build from source:

```bash
git clone https://github.com/ohmjs/ohmgo
cd ohmgo
go build -o ohmgo .
```

## Commands

### `generate command`

Generates a Docker command to compile a `.ohm` grammar file into a `.wasm` file compatible with the current `goohm` runtime version.

<!--tmpl,code=bash:go run main.go generate command -h -->
``` bash 

  Usage: ohmgo generate command [options] <source-file>

  Generate a command, in the specified format (default is 'command') to compile a .ohm grammar file
  using the ohmjs/ohm docker image. Does not actually compile the file.

  Path to .ohm grammar file to compile.

  Options:
  --debug, -d
  --docker-tag, -t    The version tag of the ohmjs/ohm docker image to use in the generated command.
                      Defaults to the version of the goohm runtime included in this cli. (default
                      18.0.0-beta.14)
  --grammar-name, -g
  --output, -o
  --format, -f        Output format. One of: command, go_generate, script. (default command)
  --help, -h          display help

```
<!--/tmpl-->

The `--docker-tag` default is derived at runtime from the `goohm` package, so it always matches the runtime version bundled with this CLI — preventing version mismatches between the compiler and the runtime.

## Output Formats

The `--format` flag controls how the generated command is wrapped.

### `command` (default)

A ready-to-run shell snippet with a comment:

<!--tmpl,code=bash:go run main.go generate command my-grammar.ohm -->
``` bash 

# To generate a .wasm file for use with this version of the runtime, run:
docker run --rm -v "$PWD":/local ohmjs/ohm:18.0.0-beta.14 compile my-grammar.ohm
```
<!--/tmpl-->

### `go_generate`

A `//go:generate` directive for embedding in a Go source file:

<!--tmpl,code=bash:go run main.go generate command --format=go_generate my-grammar.ohm -->
``` bash 

//go:generate docker run --rm -v $PWD:/local ohmjs/ohm:18.0.0-beta.14 compile my-grammar.ohm
```
<!--/tmpl-->

Paste this into any `.go` file in your package. Running `go generate ./...` will compile the grammar and produce `my-grammar.wasm` in the same directory.

### `script`

A standalone shell script with a shebang:

<!--tmpl,code=bash:go run main.go generate command --format=script my-grammar.ohm -->
``` bash 
#!/bin/sh

docker run --rm -v "$PWD":/local ohmjs/ohm:18.0.0-beta.14 compile my-grammar.ohm
```
<!--/tmpl-->

Useful when you want a reusable script checked into your repo:

```bash
ohmgo generate command --format=script my-grammar.ohm > compile.sh
chmod +x compile.sh
./compile.sh
```

## Using the Compiled Grammar in Go

Once you have a `.wasm` file, load it with `goohm`:

```go
package main

import (
    "context"
    _ "embed"
    "log"

    goohm "github.com/ohmjs/goohm"
)

//go:embed my-grammar.wasm
var wasmBytes []byte

func main() {
    ctx := context.Background()
    grmr, err := goohm.NewGrammar(ctx, wasmBytes)
    if err != nil {
        log.Fatalf("creating grammar: %v", err)
    }
    defer grmr.Close()

    result, err := grmr.Match("Hello, world!")
    if err != nil {
        log.Fatalf("matching: %v", err)
    }
    defer result.Close()

    if result.Succeeded() {
        log.Println("match succeeded")
    }
}
```

## Shell Completion

Install or remove zsh, bash or fish completion:

```bash
ohmgo --install    # install zsh, bash or fish completions
ohmgo --uninstall  # remove zsh, bash or fish completion
```