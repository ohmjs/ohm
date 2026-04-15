package main

import (
	"context"
	"os"
	"strings"
	"testing"
	"unicode/utf16"
)

// unparseAll walks all binding nodes and reconstructs the full input text.
// It includes implicit leading/trailing spaces.
func unparseAll(nodes []*CstNode) string {
	if len(nodes) == 0 {
		return ""
	}
	var result strings.Builder
	ctx := nodes[0].ctx
	startIdx := 0
	for _, node := range nodes {
		// Emit leading spaces before this binding node.
		if node.startIdx > startIdx {
			result.WriteString(string(utf16.Decode(ctx.inputUTF16[startIdx:node.startIdx])))
		}
		unparseNode(node, &result)
		startIdx = node.startIdx + node.MatchLength()
	}
	// Emit any trailing content (e.g., trailing whitespace after the last binding).
	if startIdx < len(ctx.inputUTF16) {
		result.WriteString(string(utf16.Decode(ctx.inputUTF16[startIdx:])))
	}
	return result.String()
}
func unparseNode(node *CstNode, result *strings.Builder) {
	if node.IsTerminal() {
		result.WriteString(node.Value())
		return
	}
	children := node.Children()
	startIdx := node.startIdx
	for _, child := range children {
		// Emit any implicit spaces before this child.
		if child.startIdx > startIdx {
			spacesLen := child.startIdx - startIdx
			if spacesLen > 0 && spacesLen+startIdx <= len(node.ctx.inputUTF16) {
				result.WriteString(string(utf16.Decode(node.ctx.inputUTF16[startIdx : startIdx+spacesLen])))
			}
		}
		unparseNode(child, result)
		startIdx = child.startIdx + child.MatchLength()
	}
}

//go:generate sh ./generate.sh
func BenchmarkES5Match(b *testing.B) {
	ctx := context.Background()
	wasmPath := os.Getenv("OHM_WASM")
	if wasmPath == "" {
		wasmPath = "./es5.wasm"
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
	input, err := os.ReadFile("../../packages/compiler/test/data/_underscore-1.8.3.js")
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
		wasmPath = "./es5.wasm"
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
	input, err := os.ReadFile("../../packages/compiler/test/data/_html5shiv-3.7.3.js")
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
