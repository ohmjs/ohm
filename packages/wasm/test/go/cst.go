package main

import (
	"fmt"
	"unsafe"

	"github.com/tetratelabs/wazero/api"
)

// Code for walking a CST by hand, by accessing the raw memory.
// Ultimately, we will want a higher-level API for this, but for now,
// this is useful for testing/debugging.

const (
	// Node type constants
	NodeTypeNonterminal = 0
	NodeTypeTerminal    = -1
	NodeTypeIter        = -2

	// CST node structure size constants
	cstNodeHeaderSize = 12 // 3 uint32 fields (count, matchLen, type)
	uint32Size        = 4
)

// CstNode represents a node in the Concrete Syntax Tree
type CstNode struct {
	ruleNames []string
	memory    api.Memory
	base      uint32
}

// NewCstNode creates a new CstNode with the given parameters
func NewCstNode(ruleNames []string, memory api.Memory, offset uint32) *CstNode {
	return &CstNode{
		ruleNames: ruleNames,
		memory:    memory,
		base:      offset,
	}
}

// IsNonterminal returns true if this node represents a nonterminal
func (n *CstNode) IsNonterminal() bool {
	return n.Type() >= 0
}

// IsTerminal returns true if this node represents a terminal
func (n *CstNode) IsTerminal() bool {
	return n.Type() == NodeTypeTerminal
}

// IsIter returns true if this node represents an iteration
func (n *CstNode) IsIter() bool {
	return n.Type() == NodeTypeIter
}

// RuleName returns the name of the rule that created this node
func (n *CstNode) RuleName() (string, error) {
	data, ok := n.memory.Read(n.base+8, 4)
	if !ok {
		return "", fmt.Errorf("failed to read rule ID at address %d", n.base+8)
	}

	id := readInt32(data, 0)
	if id < 0 {
		return "", nil
	}

	if len(n.ruleNames) == 0 {
		return fmt.Sprintf("rule_%d", id), nil
	}

	if int(id) >= len(n.ruleNames) {
		return fmt.Sprintf("rule_%d", id), nil
	}

	if n.ruleNames[id] == "" {
		return fmt.Sprintf("rule_%d", id), nil
	}

	return n.ruleNames[id], nil
}

// count returns the number of child nodes
func (n *CstNode) count() (uint32, error) {
	data, ok := n.memory.Read(n.base, 4)
	if !ok {
		return 0, fmt.Errorf("failed to read count at address %d", n.base)
	}
	return readUint32(data, 0), nil
}

// MatchLength returns the length of the matched text
func (n *CstNode) MatchLength() (uint32, error) {
	data, ok := n.memory.Read(n.base+4, 4)
	if !ok {
		return 0, fmt.Errorf("failed to read match length at address %d", n.base+4)
	}
	return readUint32(data, 0), nil
}

// Type returns the type of this node (0 for nonterminal, -1 for terminal, -2 for iter)
func (n *CstNode) Type() int32 {
	data, ok := n.memory.Read(n.base+8, 4)
	if !ok {
		return 0 // Return nonterminal as default in case of error
	}

	t := readInt32(data, 0)
	if t < 0 {
		return t
	}
	return NodeTypeNonterminal
}

// Children returns a slice of child nodes
func (n *CstNode) Children() ([]*CstNode, error) {
	count, err := n.count()
	if err != nil {
		return nil, err
	}

	if count == 0 {
		return []*CstNode{}, nil
	}

	children := make([]*CstNode, count)

	for i := uint32(0); i < count; i++ {
		slotOffset := n.base + cstNodeHeaderSize + i*uint32Size
		data, ok := n.memory.Read(slotOffset, 4)
		if !ok {
			return nil, fmt.Errorf("failed to read child pointer at address %d", slotOffset)
		}

		childOffset := readUint32(data, 0)
		children[i] = NewCstNode(n.ruleNames, n.memory, childOffset)
	}

	return children, nil
}

// Helper functions for reading values from memory
func readUint32(data []byte, offset uint32) uint32 {
	return *(*uint32)(unsafe.Pointer(&data[offset]))
}

func readInt32(data []byte, offset uint32) int32 {
	return *(*int32)(unsafe.Pointer(&data[offset]))
}

// GetCstRoot returns the root node of the CST from the WasmMatcher
func GetCstRoot(matcher *WasmMatcher, ruleNames []string) (*CstNode, error) {
	rootAddr, err := matcher.GetCstRoot()
	if err != nil {
		return nil, fmt.Errorf("failed to get CST root: %v", err)
	}

	memory := matcher.GetModule().Memory()
	if memory == nil {
		return nil, fmt.Errorf("WebAssembly module has no memory")
	}

	return NewCstNode(ruleNames, memory, rootAddr), nil
}
