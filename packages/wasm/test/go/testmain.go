package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/imports/wasi_snapshot_preview1"
)

func main() {
	// Create context
	ctx := context.Background()

	// Create a new WebAssembly Runtime
	runtime := wazero.NewRuntime(ctx)
	defer runtime.Close(ctx)

	// Instantiate WASI
	_, err := wasi_snapshot_preview1.Instantiate(ctx, runtime)
	if err != nil {
		fmt.Printf("Failed to instantiate WASI: %v\n", err)
		os.Exit(1)
	}

	// Path to the existing Wasm module - relative to the executable
	wasmPath := filepath.Join("test", "data", "_add.wasm")

	// Read the WebAssembly module
	wasmBytes, err := os.ReadFile(wasmPath)
	if err != nil {
		fmt.Printf("Failed to read WebAssembly module at %s: %v\n", wasmPath, err)
		os.Exit(1)
	}

	// Compile the module
	compiledModule, err := runtime.CompileModule(ctx, wasmBytes)
	if err != nil {
		fmt.Printf("Failed to compile module: %v\n", err)
		os.Exit(1)
	}

	// Instantiate the module
	module, err := runtime.InstantiateModule(ctx, compiledModule, wazero.NewModuleConfig())
	if err != nil {
		fmt.Printf("Failed to instantiate module: %v\n", err)
		os.Exit(1)
	}

	// Call the 'add' function with arguments 5 and 7
	a, b := int32(5), int32(7)
	result, err := module.ExportedFunction("add").Call(ctx, uint64(a), uint64(b))
	if err != nil {
		fmt.Printf("Failed to call add function: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("WebAssembly add(%d, %d) = %d\n", a, b, int32(result[0]))
}
