package main

import (
	"context"
	"os"
	"strings"
	"testing"
)

// unparseAll walks all binding nodes and reconstructs the full input text.
func unparseAll(nodes []*CstNode) string {
	var result strings.Builder
	for _, node := range nodes {
		unparseNode(node, &result)
	}
	return result.String()
}

func unparseNode(node *CstNode, result *strings.Builder) {
	if node.IsTerminal() {
		result.WriteString(node.Value())
		return
	}
	for _, child := range node.Children() {
		unparseNode(child, result)
	}
}

func BenchmarkES5Match(b *testing.B) {
	ctx := context.Background()

	wasmPath := os.Getenv("OHM_WASM")
	if wasmPath == "" {
		wasmPath = "../../build/es5.wasm"
	}
	wasmBytes, err := os.ReadFile(wasmPath)
	if err != nil {
		b.Fatalf("reading wasm file: %v", err)
	}

	g, err := NewGrammar(ctx, wasmBytes)
	if err != nil {
		b.Fatalf("instantiating grammar: %v", err)
	}
	defer g.Close()

	input, err := os.ReadFile("../data/_underscore-1.8.3.js")
	if err != nil {
		b.Fatalf("reading input file: %v", err)
	}
	inputStr := string(input)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		result, err := g.Match(inputStr)
		if err != nil {
			b.Fatalf("matching: %v", err)
		}
		if !result.Succeeded() {
			b.Fatal("match failed")
		}
		result.Close()
	}
}

func TestES5Match(t *testing.T) {
	ctx := context.Background()

	wasmPath := os.Getenv("OHM_WASM")
	if wasmPath == "" {
		wasmPath = "../../build/es5.wasm"
	}
	wasmBytes, err := os.ReadFile(wasmPath)
	if err != nil {
		t.Fatalf("reading wasm file: %v", err)
	}

	g, err := NewGrammar(ctx, wasmBytes)
	if err != nil {
		t.Fatalf("instantiating grammar: %v", err)
	}
	defer g.Close()

	input, err := os.ReadFile("../data/_html5shiv-3.7.3.js")
	if err != nil {
		t.Fatalf("reading input file: %v", err)
	}

	result, err := g.Match(string(input))
	if err != nil {
		t.Fatalf("matching: %v", err)
	}
	defer result.Close()

	if !result.Succeeded() {
		t.Fatal("match failed")
	}

	nodes, err := result.GetAllBindings()
	if err != nil {
		t.Fatalf("getting bindings: %v", err)
	}

	unparsed := unparseAll(nodes)
	if unparsed != string(input) {
		t.Errorf("unparsed text does not match input (got %d bytes, want %d bytes)", len(unparsed), len(input))
	}
}
