package main

import (
	"unicode/utf16"
	"unsafe"

	"github.com/tetratelabs/wazero/api"
)

// CstNodeType constants matching the ohm-js CstNodeType enum.
const (
	CstNodeTypeNonterminal = 0
	CstNodeTypeTerminal    = 1
	CstNodeTypeList        = 2
	CstNodeTypeOpt         = 3
)

const (
	matchRecordTypeMask = 3
	cstNodeHeaderSize   = 16
	slotSize            = 4
)

// cstContext holds shared state for all CstNodes from a single match result.
type cstContext struct {
	ruleNames  []string
	memory     api.Memory
	inputUTF16 []uint16
}

// CstNode represents a node in the concrete syntax tree.
// Its API mirrors the ohm-js CstNode interface.
type CstNode struct {
	ctx      *cstContext
	base     uint32
	startIdx int // position in the input (UTF-16 code units)
}

func newCstNode(ctx *cstContext, base uint32, startIdx int) *CstNode {
	return &CstNode{ctx: ctx, base: base, startIdx: startIdx}
}

// --- internal field accessors ---

func (n *CstNode) typeAndDetails() int32 {
	data, ok := n.ctx.memory.Read(n.base+8, 4)
	if !ok {
		return 0
	}
	return readInt32(data, 0)
}

func (n *CstNode) matchRecordType() int32 {
	return n.typeAndDetails() & matchRecordTypeMask
}

func (n *CstNode) ruleID() int32 {
	return n.typeAndDetails() >> 2
}

func (n *CstNode) count() uint32 {
	data, ok := n.ctx.memory.Read(n.base, 4)
	if !ok {
		return 0
	}
	return readUint32(data, 0)
}

// --- public API (matches the ohm-js CstNode interface) ---

// Type returns the CstNodeType for this node.
func (n *CstNode) Type() int {
	switch n.matchRecordType() {
	case 0:
		return CstNodeTypeNonterminal
	case 1:
		return CstNodeTypeTerminal
	case 2:
		return CstNodeTypeList
	case 3:
		return CstNodeTypeOpt
	default:
		return -1
	}
}

// CtorName returns the constructor name for this node.
// For nonterminals this is the rule name; for other types it is
// "_terminal", "_list", or "_opt".
func (n *CstNode) CtorName() string {
	switch n.Type() {
	case CstNodeTypeNonterminal:
		id := n.ruleID()
		if int(id) < len(n.ctx.ruleNames) {
			return n.ctx.ruleNames[id]
		}
		return ""
	case CstNodeTypeTerminal:
		return "_terminal"
	case CstNodeTypeList:
		return "_list"
	case CstNodeTypeOpt:
		return "_opt"
	default:
		return ""
	}
}

// MatchLength returns the number of UTF-16 code units consumed by this node.
func (n *CstNode) MatchLength() int {
	data, ok := n.ctx.memory.Read(n.base+4, 4)
	if !ok {
		return 0
	}
	return int(readUint32(data, 0))
}

// Source returns the start and end indices (UTF-16 code units) in the input.
func (n *CstNode) Source() (startIdx, endIdx int) {
	return n.startIdx, n.startIdx + n.MatchLength()
}

// SourceString returns the portion of the input matched by this node.
func (n *CstNode) SourceString() string {
	start := n.startIdx
	end := start + n.MatchLength()
	if end > len(n.ctx.inputUTF16) {
		end = len(n.ctx.inputUTF16)
	}
	if start >= end {
		return ""
	}
	return string(utf16.Decode(n.ctx.inputUTF16[start:end]))
}

// Value returns the matched text.
func (n *CstNode) Value() string {
	return n.SourceString()
}

func (n *CstNode) IsNonterminal() bool { return n.Type() == CstNodeTypeNonterminal }
func (n *CstNode) IsTerminal() bool    { return n.Type() == CstNodeTypeTerminal }
func (n *CstNode) IsList() bool        { return n.Type() == CstNodeTypeList }
func (n *CstNode) IsOptional() bool    { return n.Type() == CstNodeTypeOpt }

// IsSyntactic returns true if this is a nonterminal whose rule name starts
// with an uppercase letter.
func (n *CstNode) IsSyntactic() bool {
	if !n.IsNonterminal() {
		return false
	}
	name := n.CtorName()
	return len(name) > 0 && name[0] >= 'A' && name[0] <= 'Z'
}

// IsLexical returns true if this is a nonterminal whose rule name starts
// with a lowercase letter.
func (n *CstNode) IsLexical() bool {
	return n.IsNonterminal() && !n.IsSyntactic()
}

// Children returns the child nodes, with startIdx properly tracked.
func (n *CstNode) Children() []*CstNode {
	count := n.count()
	if count == 0 {
		return nil
	}
	children := make([]*CstNode, count)
	startIdx := n.startIdx
	for i := uint32(0); i < count; i++ {
		slotOffset := n.base + cstNodeHeaderSize + i*slotSize
		data, ok := n.ctx.memory.Read(slotOffset, 4)
		if !ok {
			return children[:i]
		}
		childBase := readUint32(data, 0)
		child := newCstNode(n.ctx, childBase, startIdx)
		children[i] = child
		startIdx += child.MatchLength()
	}
	return children
}

// Helper functions for reading little-endian values from memory.
func readUint32(data []byte, offset uint32) uint32 {
	return *(*uint32)(unsafe.Pointer(&data[offset]))
}

func readInt32(data []byte, offset uint32) int32 {
	return *(*int32)(unsafe.Pointer(&data[offset]))
}
