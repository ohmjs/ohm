package ohm_rules

import (
	"fmt"
)

var builtInHOR = []string{
	"ListOf", "listOf", "NonemptyListOf", "nonemptyListOf", "EmptyListOf", "emptyListOf",
}

type ruleNamer interface {
	RuleName() string
}

func (r BareRuleNode) RuleName() string  { return r.Name }
func (r CasesRuleNode) RuleName() string { return r.Name }
func (r VirtRuleNode) RuleName() string  { return r.Name + "_" + r.Node.Name }

func (rule RuleNode) GetBranch() ruleNamer {
	return Handle_RuleNode[ruleNamer](
		rule,
		func(r BareRuleNode) ruleNamer { return r },
		func(r VirtRuleNode) ruleNamer { return r },
		func(r CasesRuleNode) ruleNamer { return r },
		nil,
	)
}

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
