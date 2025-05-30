package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"path/filepath"
)

func main() {
	// Parse command line arguments
	wasmFile := flag.String("wasm", "test/data/_add.wasm", "Path to WebAssembly file")
	inputText := flag.String("input", "", "Input text to match against the grammar")
	inputFile := flag.String("file", "", "Path to file containing input text to match")
	startRule := flag.String("rule", "", "Start rule for the grammar (defaults to grammar's start rule)")
	flag.Parse()

	// Create a context
	ctx := context.Background()

	// Create a new WasmMatcher
	matcher := NewWasmMatcher(ctx)
	defer matcher.Close()

	// Load the WebAssembly module
	wasmPath := *wasmFile
	err := matcher.LoadModule(wasmPath)
	if err != nil {
		fmt.Printf("Error loading module: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Loaded WebAssembly module: %s\n", filepath.Base(wasmPath))

	// Set the input text - either from direct text or from file
	if *inputFile != "" {
		// Read input from file
		err = matcher.SetInputFromFile(*inputFile)
		if err != nil {
			fmt.Printf("Error reading input file: %v\n", err)
			os.Exit(1)
		}
	} else if *inputText != "" {
		// Set the input text directly
		matcher.SetInput(*inputText)
	} else {
		fmt.Println("No input provided. Use -input flag to provide text or -file to specify an input file.")
		os.Exit(0)
	}

	// If a start rule was specified, set it
	if *startRule != "" {
		fmt.Printf("Using rule: %s\n", *startRule)
		matcher.SetDefaultStartRule(*startRule)
	}

	// Attempt to match the input
	if *inputFile != "" {
		fmt.Printf("Matching input file: %s\n", *inputFile)
	} else {
		fmt.Printf("Matching input: %q\n", matcher.GetInput())
	}
	success, err := matcher.Match()
	if err != nil {
		fmt.Printf("Error during matching: %v\n", err)
		os.Exit(1)
	}

	if success {
		fmt.Println("Match succeeded!")

		// Try to get the CST root
		cstRoot, err := matcher.GetCstRoot()
		if err != nil {
			fmt.Printf("Error getting CST root: %v\n", err)
		} else {
			fmt.Printf("CST root node ID: %d\n", cstRoot)
		}
	} else {
		fmt.Println("Match failed")
	}
}
