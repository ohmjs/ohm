package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	fmt.Println("Ohm WebAssembly Matcher - Go Implementation")
	// Parse command line arguments
	wasmFile := flag.String("wasm", "test/data/_add.wasm", "Path to WebAssembly file")
	inputText := flag.String("input", "", "Input text to match against the grammar")
	inputFile := flag.String("file", "", "Path to file containing input text to match")
	startRule := flag.String("rule", "", "Start rule for the grammar (defaults to grammar's start rule)")
	verbose := flag.Bool("verbose", false, "Display verbose information about CST nodes")
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

			// Create a CST walker with the matcher
			cstWalker := NewCstWalker(matcher)

			// Read the CST node
			node, err := cstWalker.GetRawCstNode(cstRoot)
			if err != nil {
				fmt.Printf("Error reading CST node: %v\n", err)
			} else {
				fmt.Printf("CST Node - Count: %d, MatchLen: %d, Type: %d\n",
					node.Count, node.MatchLen, node.Type)

				if len(node.ChildRefs) > 0 {
					fmt.Printf("Child references: %v\n", node.ChildRefs)
				}

				// Unparse the CST to get the original text
				fmt.Println("\nUnparsing the CST to reconstruct the input:")
				unparsedText := unparse(cstWalker, cstRoot, matcher.GetInput())
				fmt.Printf("Unparsed text: %q\n", unparsedText)
				fmt.Printf("Original input: %q\n", matcher.GetInput())
				fmt.Printf("Match: %v\n", unparsedText == matcher.GetInput())
			}

			// Display more verbose information if requested
			if *verbose {
				fmt.Println("\nCST node details have been displayed above.")
				fmt.Println("Node Types:")
				fmt.Printf(" - Terminal nodes (type %d): Leaf nodes that consume input\n", NODE_TYPE_TERMINAL)
				fmt.Printf(" - Iteration nodes (type %d): Used for repetition operations\n", NODE_TYPE_ITER)
				fmt.Printf(" - Non-terminal nodes (type %d): Internal nodes with children\n", NODE_TYPE_NONTERMINAL)
				fmt.Println("\nThe unparse function reconstructs the original input by collecting text from all terminal nodes in order.")
			}
		}
	} else {
		fmt.Println("Match failed")
	}
}

// unparse walks the CST starting from the given node and reconstructs the original text
// It returns the reconstructed text from the terminal nodes
func unparse(walker *CstWalker, nodeAddr uint32, input string) string {
	var result strings.Builder
	pos := uint32(0)
	unparseNode(walker, nodeAddr, &pos, input, &result)
	return result.String()
}

// unparseNode is a helper function that recursively processes nodes and builds the result
func unparseNode(walker *CstWalker, nodeAddr uint32, pos *uint32, input string, result *strings.Builder) {
	// Read the current node
	node, err := walker.GetRawCstNode(nodeAddr)
	if err != nil {
		fmt.Printf("Error reading CST node: %v\n", err)
		return
	}

	// Handle terminal nodes - append the consumed text to the result
	if node.Type == NODE_TYPE_TERMINAL {
		if *pos < uint32(len(input)) && node.MatchLen > 0 {
			end := *pos + node.MatchLen
			if end > uint32(len(input)) {
				end = uint32(len(input))
			}
			matchedText := input[*pos:end]
			result.WriteString(matchedText)

			// Update position only after processing terminal nodes
			*pos += node.MatchLen
		}
		return
	}

	// For all other node types (nonterminal, iteration, etc.), process children recursively
	for _, childAddr := range node.ChildRefs {
		unparseNode(walker, childAddr, pos, input, result)
	}
}
