package main

import (
	"context"
	"fmt"
	"os"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
)

// Constants for memory layout
const (
	WASM_PAGE_SIZE    = 64 * 1024
	InputBufferOffset = WASM_PAGE_SIZE
	InputBufferSize   = WASM_PAGE_SIZE
	MemoTableOffset   = InputBufferOffset + InputBufferSize
)

// WasmMatcher is a Go implementation of the JavaScript WasmMatcher class for Ohm
type WasmMatcher struct {
	runtime          wazero.Runtime
	module           api.Module
	input            string
	pos              int
	ctx              context.Context
	ruleIds          map[string]int
	defaultStartRule string
}

// GetModule returns the WebAssembly module
func (m *WasmMatcher) GetModule() api.Module {
	return m.module
}

func NewWasmMatcher(ctx context.Context) *WasmMatcher {
	return &WasmMatcher{
		runtime: wazero.NewRuntime(ctx),
		ctx:     ctx,
		ruleIds: make(map[string]int),
		pos:     0,
	}
}

func (m *WasmMatcher) LoadModule(wasmPath string) error {
	// Read the WASM file
	wasmBytes, err := os.ReadFile(wasmPath)
	if err != nil {
		return fmt.Errorf("error reading WASM file: %v", err)
	}

	// Create the env module with required host functions
	_, err = m.runtime.NewHostModuleBuilder("env").
		NewFunctionBuilder().
		WithFunc(func(a, b, c, d int32) {
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
			return m.fillInputBuffer(ctx, mod, offset, maxLen)
		}).
		Export("fillInputBuffer").
		Instantiate(m.ctx)

	if err != nil {
		return fmt.Errorf("failed to create host module: %v", err)
	}

	// Instantiate the module
	m.module, err = m.runtime.Instantiate(m.ctx, wasmBytes)
	if err != nil {
		return fmt.Errorf("error instantiating module: %v", err)
	}

	// Try to extract rule IDs if this is a grammar module
	// Note: In a real implementation, you would extract rule IDs from the module

	return nil
}

func (m *WasmMatcher) SetInput(input string) {
	if m.input != input {
		m.input = input
		m.pos = 0
	}
}

// SetInputFromFile reads input from a file and sets it as the current input
func (m *WasmMatcher) SetInputFromFile(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return fmt.Errorf("error reading input file: %v", err)
	}

	m.SetInput(string(data))
	return nil
}

func (m *WasmMatcher) GetInput() string {
	return m.input
}

func (m *WasmMatcher) Match() (bool, error) {
	return m.MatchRule(m.defaultStartRule)
}

func (m *WasmMatcher) MatchRule(ruleName string) (bool, error) {
	m.pos = 0 // Reset position

	// Get the rule ID
	ruleId := uint64(0) // Default to 0 (start rule)
	if ruleName != "" {
		if id, ok := m.ruleIds[ruleName]; ok {
			ruleId = uint64(id)
		} else {
			return false, fmt.Errorf("rule not found: %s", ruleName)
		}
	}

	// Call the match function
	matchFunc := m.module.ExportedFunction("match")
	if matchFunc == nil {
		return false, fmt.Errorf("match function not exported by module")
	}

	results, err := matchFunc.Call(m.ctx, ruleId)
	if err != nil {
		return false, fmt.Errorf("error calling match function: %v", err)
	}

	// Non-zero result means success
	return results[0] != 0, nil
}

// GetCstRoot returns the root node of the concrete syntax tree
func (m *WasmMatcher) GetCstRoot() (uint32, error) {
	getCstRootFunc := m.module.ExportedFunction("getCstRoot")
	if getCstRootFunc == nil {
		return 0, fmt.Errorf("getCstRoot function not exported by module")
	}

	results, err := getCstRootFunc.Call(m.ctx)
	if err != nil {
		return 0, fmt.Errorf("error getting CST root: %v", err)
	}

	return uint32(results[0]), nil
}

// fillInputBuffer is called by the WebAssembly module to get more input
func (m *WasmMatcher) fillInputBuffer(ctx context.Context, mod api.Module, offset, maxLen uint32) uint32 {
	// Determine how much of the input to copy
	remaining := m.input[m.pos:]
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
		m.pos += bytesToWrite
	} else {
		// No more input, just write the terminator
		memory.WriteByte(InputBufferOffset+offset, 0xFF)
	}

	return uint32(bytesToWrite)
}

// GetRuleId returns the ID for a rule name
func (m *WasmMatcher) GetRuleId(ruleName string) (int, bool) {
	id, ok := m.ruleIds[ruleName]
	return id, ok
}

// SetDefaultStartRule sets the default start rule for matching
func (m *WasmMatcher) SetDefaultStartRule(ruleName string) {
	m.defaultStartRule = ruleName
}

// Close releases all resources
func (m *WasmMatcher) Close() error {
	if m.module != nil {
		if err := m.module.Close(m.ctx); err != nil {
			return err
		}
	}

	if m.runtime != nil {
		if err := m.runtime.Close(m.ctx); err != nil {
			return err
		}
	}

	return nil
}
