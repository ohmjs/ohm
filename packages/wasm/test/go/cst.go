package main

import (
	"fmt"
	"unsafe"
)

// Code for walking a CST by hand, by accessing the raw memory.
// Ultimately, we will want a higher-level API for this, but for now,
// this is useful for testing/debugging.

const (
	BYTES_PER_CST_REC = 12
	SIZEOF_UINT32     = 4

	// Node type constants
	NODE_TYPE_NONTERMINAL = 0
	NODE_TYPE_TERMINAL    = -1
	NODE_TYPE_ITER        = -2
)

type CstNode struct {
	Count     uint32   // Number of child nodes
	MatchLen  uint32   // Length of the matched text
	Type      int32    // Nonterminal: 0, terminal: -1, iter: -2
	ChildRefs []uint32 // Addresses of child nodes
}

type CstWalker struct {
	matcher *WasmMatcher
}

func NewCstWalker(matcher *WasmMatcher) *CstWalker {
	return &CstWalker{
		matcher: matcher,
	}
}

// Read a CST node from memory at the given address
func (p *CstWalker) GetRawCstNode(addr uint32) (*CstNode, error) {
	memory := p.matcher.GetModule().Memory()
	if memory == nil {
		return nil, fmt.Errorf("WebAssembly module has no memory")
	}

	// Read the node data
	data, ok := memory.Read(addr, BYTES_PER_CST_REC)
	if !ok {
		return nil, fmt.Errorf("failed to read CST node data at address %d", addr)
	}

	node := &CstNode{
		Count:    readUint32(data, 0),
		MatchLen: readUint32(data, 4),
		Type:     readInt32(data, 8),
	}

	// Read child references if any
	if node.Count > 0 {
		childData, ok := memory.Read(addr+12, SIZEOF_UINT32*node.Count)
		if !ok {
			return nil, fmt.Errorf("failed to read CST child references at address %d", addr+12)
		}

		node.ChildRefs = make([]uint32, node.Count)
		for i := uint32(0); i < node.Count; i++ {
			node.ChildRefs[i] = readUint32(childData, i*SIZEOF_UINT32)
		}
	}

	return node, nil
}

func readUint32(data []byte, offset uint32) uint32 {
	return *(*uint32)(unsafe.Pointer(&data[offset]))
}

func readInt32(data []byte, offset uint32) int32 {
	return *(*int32)(unsafe.Pointer(&data[offset]))
}
