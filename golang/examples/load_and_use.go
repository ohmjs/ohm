package main

import (
	"context"
	_ "embed"
	"log"
	"os"

	goohm "github.com/ohmjs/goohm"
)

//go:embed my-grammar.wasm
var wasmBytes []byte

func main() {
	// or, if you prefer, read the .wasm file from disk
	// wasmBytes, err := os.ReadFile("my-grammar.wasm")
	ctx := context.Background()
	grmr, err := goohm.NewGrammar(ctx, wasmBytes)
	if err != nil {
		log.Fatalf("creating grammar: %v", err)
	}
	defer grmr.Close()
	// use the grammar to match some input text
	input := "Hello, world!"
	if len(os.Args) > 1 && os.Args[1] != "" {
		input = os.Args[1]
	}
	result, err := grmr.Match(input)
	if err != nil {
		log.Fatalf("matching: %v", err)
	}
	defer result.Close()
	if !result.Succeeded() {
		log.Printf("match failed")
		os.Exit(1)
	}
	log.Printf("match succeeded")
}
