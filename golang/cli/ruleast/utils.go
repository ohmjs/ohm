package ruleast

import (
	"fmt"
	"strings"
)

func upper1st(s string) string {
	return strings.ToUpper(s[:1]) + s[1:]
}

func r2name(rname string) string {
	if rname[0] >= 'A' && rname[0] <= 'Z' {
		return rname
	}
	return "Lex" + upper1st(rname)
}

type GoTyped interface {
	GoType(rtpkg string) string
	GenGoLeafAccepts(vc *genAcceptsCmd, gmr_name string, name string)
	GenGoBHORCallback(vc *genAcceptsCmd, gmr_name string, fname string)
	// GenGoBareCaseAccepts(vc *genAcceptsCmd, gmr_name string, name string)
}

func (NObjNode) GoType(rtpkg string) string { return rtpkg + ".Node" }
func (NontNode) GoType(rtpkg string) string { return rtpkg + ".RuleNode" }
func (TermNode) GoType(rtpkg string) string { return rtpkg + ".TerminalNode" }
func (n ListNode) GoType(rtpkg string) string {
	return rtpkg + ".ListNode"
	// return n.Elem.GetBranch().GoType(rtpkg)
}
func (OptNode) GoType(rtpkg string) string    { return rtpkg + ".OptNode" }
func (BuiltinHOR) GoType(rtpkg string) string { return rtpkg + ".BHorNode" }

func (v ArgNode) GetBranch() GoTyped {
	return Handle_ArgNode[GoTyped](
		v,
		func(n NObjNode) GoTyped { return NObjNode{n._NObjNode} },
		func(n NontNode) GoTyped { return NontNode{n._NontNode} },
		func(n TermNode) GoTyped { return TermNode{n._TermNode} },
		func(n ListNode) GoTyped { return ListNode{n._ListNode} },
		func(n OptNode) GoTyped { return OptNode{n._OptNode} },
		func(n BuiltinHOR) GoTyped { return BuiltinHOR{n._BuiltinHOR} },
		nil,
	)
}

type GoTypedRule interface {
	Descr(pre, suf string) string
	TypeName() string
	RuleName() string
	Source() []string
	GetArgs() []NamedArgNode
	GenGoTypes(vc *genTypesCmd)
	GenGoAccepts(vc *genAcceptsCmd, gmr_name string)
	GenGoLeafInstAccepts(vc *genAcceptsCmd, tabs int)
}

func (rule RuleNode) GetBranch() GoTypedRule {
	return Handle_RuleNode[GoTypedRule](
		rule,
		func(r BareRuleNode) GoTypedRule {
			return BareRuleNode{r._BareRuleNode}
		},
		func(r VirtRuleNode) GoTypedRule {
			return VirtRuleNode(Named[BareRuleNode]{r._Named})
		},
		func(r CasesRuleNode) GoTypedRule {
			return CasesRuleNode{r._CasesRuleNode}
		},
		nil,
	)
}

func (r BareRuleNode) Descr(pre, suf string) string {
	if r._BareRuleNode.Descr == "" {
		return ""
	}
	return pre + r._BareRuleNode.Descr + suf
}
func (r CasesRuleNode) Descr(pre, suf string) string {
	if r._CasesRuleNode.Descr == "" {
		return ""
	}
	return pre + r._CasesRuleNode.Descr + suf
}
func (r VirtRuleNode) Descr(pre, suf string) string {
	return r.Node.Descr(pre, suf)
}

func (r BareRuleNode) TypeName() string  { return r2name(r._BareRuleNode.Name) }
func (r CasesRuleNode) TypeName() string { return r2name(r._CasesRuleNode.Name) }
func (r VirtRuleNode) TypeName() string {
	return r2name(r._Named.Name) + upper1st(r._Named.Node._BareRuleNode.Name)
}

func (r BareRuleNode) RuleName() string  { return r._BareRuleNode.Name }
func (r CasesRuleNode) RuleName() string { return r._CasesRuleNode.Name }
func (r VirtRuleNode) RuleName() string {
	return r._Named.Name + "_" + r._Named.Node._BareRuleNode.Name
}

func (r BareRuleNode) Source() []string {
	return strings.Split(r._BareRuleNode.Source, "\n")
}
func (r CasesRuleNode) Source() []string {
	return strings.Split(r._CasesRuleNode.Source, "\n")
}
func (r VirtRuleNode) Source() []string {
	return r.Node.Source()
}

func (r BareRuleNode) GetArgs() []NamedArgNode  { return r.Args }
func (r CasesRuleNode) GetArgs() []NamedArgNode { return r.Args }
func (r VirtRuleNode) GetArgs() []NamedArgNode  { return r._Named.Node.Args }

func UnifyBranches2Args(bare []BareNode, size int) (args []NamedArgNode) {
	nodetypes := make([]string, size)
	nodenames := make([]string, size)
	nameMap := map[string]int{}
	for _, rulebody := range bare {
		for i := range size {
			key := Key4ArgNode(rulebody.Args[i].Node)
			name := rulebody.Args[i].Name
			if nodetypes[i] == "" {
				nodetypes[i] = key
				nodenames[i] = name
				nameMap[rulebody.Args[i].Name]++
				continue
			}
			if nodetypes[i] != key || nodenames[i] != name {
				nodetypes[i] = "node"
				nodenames[i] = "arg"
				nameMap["arg"]++
			} else {
				nodenames[i] = name
			}
		}
	}
	for k, v := range nameMap {
		if v == 1 {
			continue
		}
		c := 1
		for i := range nodenames {
			if nodenames[i] == k {
				nodenames[i] = fmt.Sprintf("%s%d", k, c)
				c++
			}
		}
	}
	for i := range nodetypes {
		var argNode ArgNode = bare[0].Args[i].Node
		if nodetypes[i] == "node" {
			argNode = Make_ArgNode_nobj(
				Make_NObjNode(),
			)
		}
		args = append(args,
			NamedArgNode(
				Make_Named(
					nodenames[i],
					argNode,
				),
			),
		)
	}
	return
}

func Key4ArgNode(arg ArgNode) string {
	return Handle_ArgNode[string](
		arg,
		func(nobj NObjNode) string {
			return "node"
		},
		func(rule NontNode) string {
			return "rule"
		},
		func(term TermNode) string {
			return "term"
		},
		func(list ListNode) string {
			return "list"
		},
		func(opt OptNode) string {
			return "opt"
		},
		func(bhor BuiltinHOR) string {
			return "hor"
		},
		nil,
	)
}
