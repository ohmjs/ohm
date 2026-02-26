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

func TestES5Match(t *testing.T) {
	ctx := context.Background()

	wasmBytes, err := os.ReadFile("../../build/es5.wasm")
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
