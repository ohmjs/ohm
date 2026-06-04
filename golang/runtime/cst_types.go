package goohm

// type Source struct {
// 	StartIdx uint32
// 	EndIdx   uint32
// }

type Node interface {
	CtorName() string
	// RuleName() string
	StartIdx() int
	Source() (startIdx, endIdx int)
	SourceString() string
	MatchLength() int
	Children() []Node
	// NumChildren() int
	// IsNonterminal() bool
	// IsTerminal() bool
	// IsOptional() bool
	// IsSeq() bool
	// IsList() bool
	CstCtx() *cstContext
}

type RuleNode interface {
	rule()
	Node
	// Children() []Node
	// LeadingSpaces() NonterminalNode // nil if absent
	IsSyntactic() bool
	IsLexical() bool
}

// built-in higher order rules
// currently these are [Ll]istOf [Nn]onemptyListOf
type BHorNode interface {
	bhor()
	Node
	Elems() []Node
	Seps() []Node
	// Children() []Node
	// LeadingSpaces() NonterminalNode // nil if absent
}

type TerminalNode interface {
	terminal()
	Node
	// // For terminals, Children() returns an empty slice.
	// Children() []Node
	// LeadingSpaces() NonterminalNode // nil if absent
	Value() string
}

type ListNode interface {
	list()
	Node
	// Children() []Node
	// // maybe this should be generic
	// Collect(cb func(children ...Node) any) []any
}

type OptNode interface {
	optional()
	Node
	Children() []Node
	IsPresent() bool
	// IsEmpty() bool
	// // IfPresent calls consume with the child (unpacking a SeqNode's children if applicable).
	// // orElse may be nil. Returns the consume/orElse result, or nil if absent and orElse is nil.
	// IfPresent(consume func(children ...Node) any, orElse func() any) any
}

type SeqNode interface {
	seq()
	Node
	// Children() []Node
	// Unpack(cb func(children ...Node) any) any
}
