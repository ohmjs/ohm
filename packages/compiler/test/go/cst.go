package main

import (
	"unicode/utf16"
	"unsafe"

	"github.com/tetratelabs/wazero/api"
)

// CstNodeType represents the type of a CST node.
type CstNodeType int

const (
	CstNodeTypeNonterminal CstNodeType = 0
	CstNodeTypeTerminal    CstNodeType = 1
	CstNodeTypeList        CstNodeType = 2
	CstNodeTypeOpt         CstNodeType = 3
)

const (
	matchRecordTypeMask = 3
	cstNodeHeaderSize   = 16
	slotSize            = 4
)

// cstContext holds shared state for all CstNodes from a single match result.
type cstContext struct {
	ruleNames      []string
	memory         api.Memory
	inputUTF16     []uint16
	getSpacesLenAt func(pos int) int // returns spaces length at a position, or -1
}

// CstNode represents a node in the concrete syntax tree.
// Its API mirrors the ohm-js CstNode interface.
//
// Child slot values in the CST use a tagged encoding:
//   - Bit 0: terminal flag (1 = tagged terminal, 0 = heap pointer)
//   - Bit 1: HAS_LEADING_SPACES edge flag (enable implicit space lookup)
//   - Tagged terminal matchLength = value >> 2
//   - Heap pointer = value & ^2 (strip edge flag)
type CstNode struct {
	ctx      *cstContext
	base     uint32
	startIdx int // position in the input (UTF-16 code units)
}

func newCstNode(ctx *cstContext, base uint32, startIdx int) *CstNode {
	return &CstNode{ctx: ctx, base: base, startIdx: startIdx}
}

func isTerminal(raw uint32) bool {
	return raw&1 == 1
}

// --- internal field accessors ---

func (n *CstNode) typeAndDetails() int32 {
	data, ok := n.ctx.memory.Read(n.base+4, 4)
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
	if isTerminal(n.base) {
		return 0
	}
	data, ok := n.ctx.memory.Read(n.base+8, 4)
	if !ok {
		return 0
	}
	return readUint32(data, 0)
}

// --- public API (matches the ohm-js CstNode interface) ---

// Type returns the CstNodeType for this node.
func (n *CstNode) Type() CstNodeType {
	if isTerminal(n.base) {
		return CstNodeTypeTerminal
	}
	return CstNodeType(n.matchRecordType())
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
	if isTerminal(n.base) {
		return int(n.base >> 2)
	}
	data, ok := n.ctx.memory.Read(n.base, 4)
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
	matchLen := n.MatchLength()
	if matchLen == 0 {
		return ""
	}
	start := n.startIdx
	end := start + matchLen
	if start < 0 || start >= len(n.ctx.inputUTF16) {
		return ""
	}
	if end > len(n.ctx.inputUTF16) {
		end = len(n.ctx.inputUTF16)
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

// hasParentSpaces returns true if this raw child value should have
// implicit leading spaces inserted by the parent (syntactic rules).
func (n *CstNode) hasParentSpaces(raw uint32) bool {
	if isTerminal(raw) {
		return true
	}
	typ := readNodeType(n.ctx.memory, raw)
	return typ == CstNodeTypeNonterminal || typ == CstNodeTypeTerminal
}

// readNodeType reads the node type from a CST node pointer.
func readNodeType(mem api.Memory, ptr uint32) CstNodeType {
	data, ok := mem.Read(ptr+4, 4) // typeAndDetails at offset 4
	if !ok {
		return -1
	}
	return CstNodeType(readInt32(data, 0) & matchRecordTypeMask)
}

// Children returns the child nodes, with startIdx properly tracked.
// For children of syntactic rules, implicit leading spaces are accounted
// for when computing startIdx.
func (n *CstNode) Children() []*CstNode {
	if isTerminal(n.base) {
		return nil
	}
	count := n.count()
	if count == 0 {
		return nil
	}
	children := make([]*CstNode, count)
	startIdx := n.startIdx
	endIdx := n.startIdx + n.MatchLength()
	for i := uint32(0); i < count; i++ {
		slotOffset := n.base + cstNodeHeaderSize + i*slotSize
		data, ok := n.ctx.memory.Read(slotOffset, 4)
		if !ok {
			return children[:i]
		}
		slot := readUint32(data, 0)

		// Bit 1 is the HAS_LEADING_SPACES edge flag.
		hasLeadingSpaces := slot&2 != 0
		// Strip the edge flag to get the actual value.
		raw := slot & ^uint32(2)

		// Account for implicit leading spaces.
		// Only apply if spaces were actually recorded at this position
		// and the result stays within the parent's span.
		if hasLeadingSpaces && n.ctx.getSpacesLenAt != nil && n.hasParentSpaces(raw) {
			spacesLen := n.ctx.getSpacesLenAt(startIdx)
			if spacesLen > 0 && startIdx+spacesLen <= endIdx {
				startIdx += spacesLen
			}
		}

		child := newCstNode(n.ctx, raw, startIdx)
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
