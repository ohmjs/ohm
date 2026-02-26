package main

import (
	"context"
	"encoding/binary"
	"fmt"
	"io"
	"regexp"
	"unicode"
	"unicode/utf16"

	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
)

// Grammar is a Go implementation of the JavaScript Grammar class from miniohm.
type Grammar struct {
	runtime     wazero.Runtime
	module      api.Module
	input       string
	inputUTF16  []uint16 // UTF-16 code units of the current input
	ctx         context.Context
	ruleIds     map[string]int
	ruleNames   []string
	strings     []string // strings table from the custom section
	resultStack []*MatchResult
}

// GetModule returns the WebAssembly module
func (g *Grammar) GetModule() api.Module {
	return g.module
}

// NewGrammar compiles and instantiates a grammar from the given Wasm bytes.
// This parallels Grammar.instantiate() in the JS API.
func NewGrammar(ctx context.Context, wasmBytes []byte) (*Grammar, error) {
	config := wazero.NewRuntimeConfig().WithCustomSections(true)

	g := &Grammar{
		runtime: wazero.NewRuntimeWithConfig(ctx, config),
		ctx:     ctx,
		ruleIds: make(map[string]int),
	}

	// Create the env module with the abort function
	_, err := g.runtime.NewHostModuleBuilder("env").
		NewFunctionBuilder().
		WithFunc(func(a, b, c, d int32) {
			panic("WebAssembly module aborted execution")
		}).
		Export("abort").
		Instantiate(g.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create env module: %v", err)
	}

	// Create the ohmRuntime module with required host functions
	_, err = g.runtime.NewHostModuleBuilder("ohmRuntime").
		NewFunctionBuilder().
		WithFunc(func(ctx context.Context, mod api.Module, dest, length uint32) uint32 {
			return g.fillInputBuffer(ctx, mod, dest, length)
		}).
		Export("fillInputBuffer").
		NewFunctionBuilder().
		WithFunc(func(ctx context.Context, mod api.Module, categoryBitmap uint32) uint32 {
			return g.matchUnicodeChar(ctx, mod, categoryBitmap)
		}).
		Export("matchUnicodeChar").
		NewFunctionBuilder().
		WithFunc(func(ctx context.Context, mod api.Module, stringIdx uint32) uint32 {
			return g.matchCaseInsensitive(ctx, mod, stringIdx)
		}).
		Export("matchCaseInsensitive").
		Instantiate(g.ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create ohmRuntime module: %v", err)
	}

	// Compile the module to access the custom sections
	compiledModule, err := g.runtime.CompileModule(g.ctx, wasmBytes)
	if err != nil {
		return nil, fmt.Errorf("error compiling module: %v", err)
	}

	// Parse custom sections
	customSections := compiledModule.CustomSections()
	if customSections == nil {
		return nil, fmt.Errorf("no custom sections found in module")
	}

	for _, section := range customSections {
		switch section.Name() {
		case "ruleNames":
			g.ruleNames, err = parseLEB128Strings(section.Data())
			if err != nil {
				return nil, fmt.Errorf("failed to parse ruleNames: %v", err)
			}
		case "strings":
			g.strings, err = parseLEB128Strings(section.Data())
			if err != nil {
				return nil, fmt.Errorf("failed to parse strings: %v", err)
			}
		}
	}

	if g.ruleNames == nil {
		return nil, fmt.Errorf("required custom section 'ruleNames' not found")
	}

	// Instantiate the module
	g.module, err = g.runtime.InstantiateModule(g.ctx, compiledModule, wazero.NewModuleConfig())
	if err != nil {
		return nil, fmt.Errorf("error instantiating module: %v", err)
	}

	// Build the ruleIds map
	g.ruleIds = make(map[string]int, len(g.ruleNames))
	for i, name := range g.ruleNames {
		g.ruleIds[name] = i
	}

	return g, nil
}

// parseLEB128Strings parses a LEB128-encoded vector of strings from a custom section.
// Used for both ruleNames and strings sections.
func parseLEB128Strings(data []byte) ([]string, error) {
	if len(data) == 0 {
		return nil, fmt.Errorf("empty custom section data")
	}

	numUint64, bytesRead := binary.Uvarint(data)
	if bytesRead <= 0 {
		return nil, fmt.Errorf("failed to read count: %v", io.ErrUnexpectedEOF)
	}
	if numUint64 > uint64(^uint32(0)) {
		return nil, fmt.Errorf("count exceeds maximum uint32 value")
	}

	num := uint32(numUint64)
	data = data[bytesRead:]

	result := make([]string, num)
	for i := uint32(0); i < num; i++ {
		lenUint64, bytesRead := binary.Uvarint(data)
		if bytesRead <= 0 {
			return nil, fmt.Errorf("failed to read string length: %v", io.ErrUnexpectedEOF)
		}
		if lenUint64 > uint64(^uint32(0)) {
			return nil, fmt.Errorf("string length exceeds maximum uint32 value")
		}

		strLen := uint32(lenUint64)
		data = data[bytesRead:]

		if uint64(len(data)) < uint64(strLen) {
			return nil, fmt.Errorf("buffer too small to read string bytes")
		}

		result[i] = string(data[:strLen])
		data = data[strLen:]
	}

	return result, nil
}

/*
 * Wasm heap memory management
 * ===========================
 *
 * The Wasm module uses a bump-pointer allocator (AssemblyScript's "stub"
 * runtime). Each match() call allocates a memo table and CST nodes on
 * the Wasm heap. There is no way to free individual allocations — you
 * can only reset the bump pointer.
 *
 * To allow incremental freeing, we exploit two facts:
 *
 *   1. MatchResult disposal is LIFO — you must dispose the most recent
 *      result first (enforced by Dispose).
 *
 *   2. Allocations for match N are always contiguous and sit above
 *      match N-1's allocations on the heap.
 *
 * Before each match, we snapshot the bump pointer (`__offset`) as a
 * "watermark" and store it on the MatchResult. On dispose, we reset the
 * bump pointer to that watermark, freeing exactly that match's
 * allocations while keeping earlier results intact.
 */

// readOffset reads the __offset global (bump-pointer allocator position).
func (g *Grammar) readOffset() uint64 {
	return g.module.ExportedGlobal("__offset").(api.MutableGlobal).Get()
}

// writeOffset sets the __offset global (bump-pointer allocator position).
func (g *Grammar) writeOffset(val uint64) {
	g.module.ExportedGlobal("__offset").(api.MutableGlobal).Set(val)
}

// Match matches the input against the grammar, using the given start rule
// (or the grammar's default start rule if none is specified).
// Returns a MatchResult that can be inspected for success/failure and CST access.
// The caller must call Close() on the result when done.
func (g *Grammar) Match(input string, startRule ...string) (*MatchResult, error) {
	g.input = input
	g.inputUTF16 = utf16.Encode([]rune(input))

	// Resolve the rule ID
	var ruleId uint64
	startExpr := ""
	if len(startRule) > 0 && startRule[0] != "" {
		startExpr = startRule[0]
		id, ok := g.ruleIds[startExpr]
		if !ok {
			return nil, fmt.Errorf("rule not found: %s", startExpr)
		}
		ruleId = uint64(id)
	}

	// Snapshot the heap bump pointer before the match.
	heapWatermark := g.readOffset()

	// Call match(inputLength, startRuleId)
	matchFunc := g.module.ExportedFunction("match")
	if matchFunc == nil {
		return nil, fmt.Errorf("match function not exported by module")
	}

	inputLength := uint64(len(g.inputUTF16))
	results, err := matchFunc.Call(g.ctx, inputLength, ruleId)
	if err != nil {
		return nil, fmt.Errorf("error calling match function: %v", err)
	}

	result := &MatchResult{
		grammar:       g,
		input:         input,
		inputUTF16:    g.inputUTF16,
		succeeded:     results[0] != 0,
		startExpr:     startExpr,
		heapWatermark: heapWatermark,
	}
	g.resultStack = append(g.resultStack, result)
	return result, nil
}

// MatchResult holds the result of matching input against a grammar.
// The caller must call Close() when done to free the CST memory.
// Disposal is LIFO: the most recent MatchResult must be disposed first.
type MatchResult struct {
	grammar       *Grammar
	input         string
	inputUTF16    []uint16
	succeeded     bool
	startExpr     string
	heapWatermark uint64
}

// Succeeded returns true if the match was successful.
func (r *MatchResult) Succeeded() bool { return r.succeeded }

// Failed returns true if the match was unsuccessful.
func (r *MatchResult) Failed() bool { return !r.succeeded }

// Input returns the input string that was matched.
func (r *MatchResult) Input() string { return r.input }

// Dispose frees the CST memory for this match result by resetting the
// bump-pointer allocator to the watermark recorded before this match.
// Disposal is LIFO: the most recent MatchResult must be disposed first.
func (r *MatchResult) Close() {
	g := r.grammar
	stack := g.resultStack
	if len(stack) == 0 || stack[len(stack)-1] != r {
		panic("You can only Close() the most recent MatchResult")
	}
	g.resultStack = stack[:len(stack)-1]
	g.writeOffset(r.heapWatermark)
}

func (r *MatchResult) cstContext() *cstContext {
	return &cstContext{
		ruleNames:  r.grammar.ruleNames,
		memory:     r.grammar.module.Memory(),
		inputUTF16: r.inputUTF16,
	}
}

// GetCstRoot returns the root CST node by using bindingsAt(0) and handling
// the $spaces leading node, mirroring miniohm.ts _getCstRoot.
func (r *MatchResult) GetCstRoot() (*CstNode, error) {
	g := r.grammar
	ctx := r.cstContext()

	bindingsAtFunc := g.module.ExportedFunction("bindingsAt")
	if bindingsAtFunc == nil {
		return nil, fmt.Errorf("bindingsAt function not exported")
	}

	getBindingsLengthFunc := g.module.ExportedFunction("getBindingsLength")
	if getBindingsLengthFunc == nil {
		return nil, fmt.Errorf("getBindingsLength function not exported")
	}

	// Get first binding
	results, err := bindingsAtFunc.Call(g.ctx, 0)
	if err != nil {
		return nil, fmt.Errorf("error calling bindingsAt(0): %v", err)
	}
	firstNode := newCstNode(ctx, uint32(results[0]), 0)

	if firstNode.CtorName() != "$spaces" {
		return firstNode, nil
	}

	// If first node is $spaces, the actual root is at binding 1
	lenResults, err := getBindingsLengthFunc.Call(g.ctx)
	if err != nil {
		return nil, fmt.Errorf("error calling getBindingsLength: %v", err)
	}
	if lenResults[0] <= 1 {
		return nil, fmt.Errorf("expected more than 1 binding, got %d", lenResults[0])
	}

	results, err = bindingsAtFunc.Call(g.ctx, 1)
	if err != nil {
		return nil, fmt.Errorf("error calling bindingsAt(1): %v", err)
	}
	return newCstNode(ctx, uint32(results[0]), firstNode.MatchLength()), nil
}

// GetAllBindings returns all top-level binding nodes from the match.
// For syntactic start rules, this is [$spaces, root].
// For lexical start rules, this is just [root].
func (r *MatchResult) GetAllBindings() ([]*CstNode, error) {
	g := r.grammar
	ctx := r.cstContext()

	bindingsAtFunc := g.module.ExportedFunction("bindingsAt")
	if bindingsAtFunc == nil {
		return nil, fmt.Errorf("bindingsAt function not exported")
	}

	getBindingsLengthFunc := g.module.ExportedFunction("getBindingsLength")
	if getBindingsLengthFunc == nil {
		return nil, fmt.Errorf("getBindingsLength function not exported")
	}

	lenResults, err := getBindingsLengthFunc.Call(g.ctx)
	if err != nil {
		return nil, fmt.Errorf("error calling getBindingsLength: %v", err)
	}
	numBindings := int(lenResults[0])

	nodes := make([]*CstNode, numBindings)
	startIdx := 0
	for i := 0; i < numBindings; i++ {
		results, err := bindingsAtFunc.Call(g.ctx, uint64(i))
		if err != nil {
			return nil, fmt.Errorf("error calling bindingsAt(%d): %v", i, err)
		}
		node := newCstNode(ctx, uint32(results[0]), startIdx)
		nodes[i] = node
		startIdx += node.MatchLength()
	}

	return nodes, nil
}

// GetRuleNames returns the list of rule names in the grammar
func (g *Grammar) GetRuleNames() []string {
	return g.ruleNames
}

// readPos reads the `pos` global from the Wasm module
func (g *Grammar) readPos() uint32 {
	posGlobal := g.module.ExportedGlobal("pos")
	if posGlobal == nil {
		return 0
	}
	return uint32(posGlobal.Get())
}

// writePos writes to the `pos` global in the Wasm module
func (g *Grammar) writePos(val uint32) {
	posGlobal := g.module.ExportedGlobal("pos")
	if posGlobal == nil {
		return
	}
	posGlobal.(api.MutableGlobal).Set(uint64(val))
}

// fillInputBuffer writes UTF-16LE code units to the dest pointer provided by the Wasm module.
func (g *Grammar) fillInputBuffer(ctx context.Context, mod api.Module, dest, length uint32) uint32 {
	memory := mod.Memory()
	if memory == nil {
		panic("WebAssembly module has no memory")
	}

	// Write UTF-16LE code units
	numUnits := uint32(len(g.inputUTF16))
	if length < numUnits {
		numUnits = length
	}

	for i := uint32(0); i < numUnits; i++ {
		offset := dest + i*2
		memory.WriteUint16Le(offset, g.inputUTF16[i])
	}

	return numUnits
}

// unicodeCategoryBitmapMap maps bit positions in the category bitmap to
// Unicode categories and properties that the Ohm runtime can match.
var unicodeCategoryBitmapMap = map[int]func(rune) bool{
	0:  func(r rune) bool { return unicode.IsLetter(r) },       // Lu|Ll|Lt|Lm|Lo
	1:  func(r rune) bool { return unicode.Is(unicode.Nl, r) }, // Nl
	2:  func(r rune) bool { return unicode.Is(unicode.Mn, r) }, // Mn
	3:  func(r rune) bool { return unicode.Is(unicode.Mc, r) }, // Mc
	4:  func(r rune) bool { return unicode.Is(unicode.Nd, r) }, // Nd
	5:  func(r rune) bool { return unicode.Is(unicode.Pc, r) }, // Pc
	6:  func(r rune) bool { return unicode.IsUpper(r) },        // Lu
	7:  func(r rune) bool { return unicode.IsLower(r) },        // Ll
	8:  func(r rune) bool { return unicode.Is(unicode.Lt, r) }, // Lt
	9:  func(r rune) bool { return unicode.Is(unicode.Lm, r) }, // Lm
	10: func(r rune) bool { return unicode.Is(unicode.Lo, r) }, // Lo
}

// matchUnicodeChar matches a character at the current `pos` against a Unicode category bitmap.
// Reads `pos` from the Wasm global, advances it on success.
func (g *Grammar) matchUnicodeChar(ctx context.Context, mod api.Module, categoryBitmap uint32) uint32 {
	pos := g.readPos()
	if int(pos) >= len(g.inputUTF16) {
		return 0
	}

	// Decode the rune at pos (may be a surrogate pair)
	codeUnit := g.inputUTF16[pos]
	var r rune
	var advance uint32 = 1
	if utf16.IsSurrogate(rune(codeUnit)) && int(pos+1) < len(g.inputUTF16) {
		r = utf16.DecodeRune(rune(codeUnit), rune(g.inputUTF16[pos+1]))
		advance = 2
	} else {
		r = rune(codeUnit)
	}

	// Check each category bit
	for bit := 0; bit < 32; bit++ {
		if categoryBitmap&(1<<uint(bit)) != 0 {
			if fn, ok := unicodeCategoryBitmapMap[bit]; ok && fn(r) {
				g.writePos(pos + advance)
				return 1
			}
		}
	}

	return 0
}

// matchCaseInsensitive performs case-insensitive matching of the string at stringIdx
// against the input at the current `pos`.
func (g *Grammar) matchCaseInsensitive(ctx context.Context, mod api.Module, stringIdx uint32) uint32 {
	if int(stringIdx) >= len(g.strings) {
		return 0
	}

	str := g.strings[stringIdx]
	pos := g.readPos()

	// Build a regex for case-insensitive match
	pattern := "(?i)" + regexp.QuoteMeta(str)
	re := regexp.MustCompile(pattern)

	// Convert input from pos onward back to a Go string for matching
	remaining := g.inputUTF16[pos:]
	remainingStr := string(utf16.Decode(remaining))

	loc := re.FindStringIndex(remainingStr)
	if loc == nil || loc[0] != 0 {
		return 0
	}

	// Advance pos by the number of UTF-16 code units consumed
	matched := remainingStr[:loc[1]]
	matchedUTF16 := utf16.Encode([]rune(matched))
	g.writePos(pos + uint32(len(matchedUTF16)))
	return 1
}

// GetRuleId returns the ID for a rule name
func (g *Grammar) GetRuleId(ruleName string) (int, bool) {
	id, ok := g.ruleIds[ruleName]
	return id, ok
}

// Close releases all resources
func (g *Grammar) Close() error {
	if g.module != nil {
		if err := g.module.Close(g.ctx); err != nil {
			return err
		}
	}

	if g.runtime != nil {
		if err := g.runtime.Close(g.ctx); err != nil {
			return err
		}
	}

	return nil
}
