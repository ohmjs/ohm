package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
)

// Constants for memory layout
const (
	WASM_PAGE_SIZE		= 64 * 1024
	InputBufferOffset = WASM_PAGE_SIZE
	InputBufferSize   = WASM_PAGE_SIZE
	MemoTableOffset   = InputBufferOffset + InputBufferSize
)

func main() {
	// Parse command line arguments
	wasmFile := flag.String("wasm", "test/data/_add.wasm", "Path to WebAssembly file")
	inputText := flag.String("input", "", "Input text to match against the grammar")
	startRule := flag.String("rule", "", "Start rule for the grammar (defaults to grammar's start rule)")
	flag.Parse()

	wasmPath := *wasmFile

	// Global variables for input handling
	input := *inputText
	inputPos := 0

	// Read the WASM file
	wasmBytes, err := os.ReadFile(wasmPath)
	if err != nil {
		fmt.Printf("Error reading WASM file: %v\n", err)
		os.Exit(1)
	}

	// Create a context and runtime
	ctx := context.Background()
	runtime := wazero.NewRuntime(ctx)
	defer runtime.Close(ctx)

	// Create a host module with the functions that the Ohm grammar module needs
	_, err = runtime.NewHostModuleBuilder("env").
		NewFunctionBuilder().
		WithFunc(func(a int32, b int32, c int32, d int32) {
			panic("WebAssembly module aborted execution")
		}).
		Export("abort").
		NewFunctionBuilder().
		WithFunc(func(val uint32) {
			fmt.Printf("WASM debug: %d\n", val)
		}).
		Export("printI32").
		NewFunctionBuilder().
		WithFunc(func(ctx context.Context, mod api.Module, offset, maxLen uint32) uint32 {
			// Determine how much of the input to copy
			remaining := input[inputPos:]
			bytesToWrite := len(remaining)
			if bytesToWrite > int(maxLen) {
				bytesToWrite = int(maxLen)
			}

			// Get module memory
			memory := mod.Memory()
			if memory == nil {
				panic("WebAssembly module has no memory")
			}

			// Write to WebAssembly memory
			if bytesToWrite > 0 {
				// Create a buffer with our input data
				inputData := []byte(remaining[:bytesToWrite])

				// Write directly to WebAssembly memory
				memory.Write(InputBufferOffset+offset, inputData)

				// Mark end of input with 0xFF (invalid UTF-8 character)
				memory.WriteByte(InputBufferOffset+offset+uint32(bytesToWrite), 0xFF)

				// Update position
				inputPos += bytesToWrite
			} else {
				// No more input, just write the terminator
				memory.WriteByte(InputBufferOffset+offset, 0xFF)
			}

			return uint32(bytesToWrite)
		}).
		Export("fillInputBuffer").
		Instantiate(ctx)

	if err != nil {
		fmt.Printf("Failed to create host module: %v\n", err)
		os.Exit(1)
	}

	// Instantiate the module
	module, err := runtime.Instantiate(ctx, wasmBytes)
	if err != nil {
		fmt.Printf("Error instantiating module: %v\n", err)
		os.Exit(1)
	}
	defer module.Close(ctx)

	fmt.Printf("Loaded WebAssembly module: %s\n", filepath.Base(wasmPath))

	matchFunc := module.ExportedFunction("match")
	if matchFunc == nil {
		panic("Module does not export 'match' function")
	}

	if input == "" {
		fmt.Println("No input provided. Use -input flag to provide text to match.")
		os.Exit(0)
	}

	// Get the rule ID (0 by default for the start rule)
	ruleId := uint64(0)
	if *startRule != "" {
		fmt.Printf("Using rule: %s\n", *startRule)
		// In a real implementation, you would look up the rule ID by name
	}

	fmt.Printf("Matching input: %q\n", input)
	results, err := matchFunc.Call(ctx, ruleId)
	if err != nil {
		fmt.Printf("Error calling match function: %v\n", err)
		os.Exit(1)
	}

	if results[0] != 0 {
		fmt.Println("Match succeeded!")

		// Try to get the CST root if match succeeded
		getCstRootFunc := module.ExportedFunction("getCstRoot")
		if getCstRootFunc != nil {
			rootResults, err := getCstRootFunc.Call(ctx)
			if err != nil {
				fmt.Printf("Error getting CST root: %v\n", err)
			} else {
				fmt.Printf("CST root node ID: %d\n", rootResults[0])
			}
		}
	} else {
		fmt.Println("Match failed")
	}
}
