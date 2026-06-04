package ruleast

import (
	"fmt"
	"slices"
	"strings"

	"github.com/ohmjs/goohm"
	"github.com/samber/lo"
)

func AssertName(this goohm.Node, name string) {
	if this.CtorName() != name {
		panic(fmt.Errorf(`name didn't name.
expected '%s'
received '%s'
`, name, this.CtorName()))
	}
}

func NewBuildGrammars(root goohm.Node) *Grammars {
	return &Grammars{
		Grammar: root.Children()[0].(goohm.ListNode),
	}
}

func (node *Grammars) BuildRuleAst(this goohm.Node) (*GrammarsNode, error) {
	AssertName(this, "Grammars")
	gmrs := map[string]GrammarNode{}
	gmr_names := []string{}
	for _, n := range node.Grammar.Children() {
		kids := n.Children()
		result, err := (&Grammar{
			Ident:        kids[0].(goohm.RuleNode),
			SuperGrammar: kids[1].(goohm.OptNode),
			Term1:        kids[2].(goohm.TerminalNode),
			Rules:        kids[3].(goohm.ListNode),
			Term2:        kids[4].(goohm.TerminalNode),
		}).BuildRuleAst(n)
		if err != nil {
			return nil, err
		}
		gmr_names = append(gmr_names, result.Name)
		gmrs[result.Name] = *result
	}
	return new(Make_GrammarsNode(gmr_names, gmrs)), nil
}

func (node *Grammar) BuildRuleAst(this goohm.Node) (*GrammarNode, error) {
	AssertName(this, "Grammar")
	rules := []string{}
	rmap := map[string]RuleNode{}
	for _, n := range node.Rules.Children() {
		rns, err := (&Rule{
			Arg1: n.(goohm.RuleNode),
		}).BuildRuleAst(n)
		if err != nil {
			return nil, err
		}
		for _, rn := range rns {
			name := rn.GetBranch().RuleName()
			rules = append(rules, name)
			rmap[name] = rn
		}
	}
	return new(Make_GrammarNode(
		node.Ident.SourceString(),
		rules,
		rmap,
	)), nil
}

func (node *Rule) BuildRuleAst(this goohm.Node) (result []RuleNode, err error) {
	AssertName(this, "Rule")
	switch node.Arg1.CtorName() {
	case "Rule":
		return (&Rule{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(this)
	case "Rule_define":
		kids := node.Arg1.Children()
		return (&RuleDefine{
			Ident:     kids[0].(goohm.RuleNode),
			Formals:   kids[1].(goohm.OptNode),
			RuleDescr: kids[2].(goohm.OptNode),
			Term1:     kids[3].(goohm.TerminalNode),
			RuleBody:  kids[4].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	case "Rule_override":
		panic("not implemented")
	case "Rule_extend":
		kids := node.Arg1.Children()
		return (&RuleExtend{
			Ident:    kids[0].(goohm.RuleNode),
			Formals:  kids[1].(goohm.OptNode),
			Term1:    kids[2].(goohm.TerminalNode),
			RuleBody: kids[3].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	default:
		panic("unexpected " + node.Arg1.CtorName())
	}
}

func (node *RuleDefine) BuildRuleAst(this goohm.Node) ([]RuleNode, error) {
	AssertName(this, "Rule_define")
	descr := ""
	if len(node.RuleDescr.Children()) > 0 {
		descr = (&LexRuleDescr{
			Arg2: node.RuleDescr.Children()[0].Children()[1].(goohm.RuleNode),
		}).BuildRuleAst(node.RuleDescr.Children()[0])
	}
	return BuildRuleAstRule(
		node.RuleBody,
		Make_RuleType_define(),
		node.Ident.SourceString(),
		this.SourceString(),
		descr,
	)
}

func (node *LexRuleDescr) BuildRuleAst(this goohm.Node) string {
	AssertName(this, "ruleDescr")
	return node.Arg2.SourceString()
}

func (node *RuleExtend) BuildRuleAst(this goohm.Node) ([]RuleNode, error) {
	AssertName(this, "Rule_extend")
	return BuildRuleAstRule(
		node.RuleBody,
		Make_RuleType_extend(),
		node.Ident.SourceString(),
		this.SourceString(),
		"",
	)
}

func BuildRuleAstRule(
	ruleBody goohm.RuleNode,
	rule_type RuleType,
	name string,
	sourceString string,
	descr string,
) ([]RuleNode, error) {
	rb := ruleBody.Children()
	details, err := (&RuleBody{
		Arg1: rb[0].(goohm.OptNode),
		Arg2: rb[1].(goohm.BHorNode),
	}).BuildRuleAst(ruleBody)
	if err != nil {
		return nil, err
	}
	cases := lo.FlatMap[RuleDetailNode, InlineNode](details, func(item RuleDetailNode, index int) []InlineNode {
		if b, ok := item.Cast_inline(); ok {
			return []InlineNode{
				Make_InlineNode(
					b.Case_name,
					b.Source,
					UnifyBranches2Args(
						[]BareNode{
							Make_BareNode(b.Args),
						},
						len(b.Args),
					),
				),
			}
		}
		return []InlineNode{}
	})
	size := 0
	bare := lo.FlatMap[RuleDetailNode, BareNode](details, func(item RuleDetailNode, index int) []BareNode {
		if b, ok := item.Cast_bare(); ok {
			if size == 0 {
				size = len(b.Args)
			} else if size != len(b.Args) {
				args := lo.Map[NamedArgNode, string](b.Args, func(item NamedArgNode, i int) string {
					return fmt.Sprintf("%d %s %v", i, item.Name, item.Node)
				})
				panic(fmt.Errorf("all branches must have the same number of args size %d curr %d. \n\t%s",
					size,
					len(b.Args),
					strings.Join(args, "\n\t"),
				))
			}
			return []BareNode{b}
		}
		return []BareNode{}
	})
	args := UnifyBranches2Args(bare, size)
	// cases_args := lo.Map[InlineNode, InlineNode](cases, func(item InlineNode, index int) InlineNode {
	// 	return Make_InlineNode(
	// 		item.Case_name,
	// 		unifyBranches2Args(bare, size),
	// 	)
	// })
	if len(cases) > 0 {
		result := []RuleNode{Make_RuleNode_case_rule(
			Make_CasesRuleNode(
				name,
				Make_RuleType_define(),
				descr,
				sourceString,
				args,
				cases,
			),
		)}
		for _, c := range cases {
			virt_rule := Make_RuleNode_virt_rule(
				VirtRuleNode(
					Make_Named(
						name,
						Make_BareRuleNode(
							c.Case_name,
							Make_RuleType_define(),
							"",
							c.Source,
							c.Args,
						),
					),
				),
			)
			result = append(result, virt_rule)
		}
		return result, nil
	}
	return []RuleNode{Make_RuleNode_bare_rule(
		Make_BareRuleNode(
			name,
			rule_type,
			descr,
			sourceString,
			args,
		),
	)}, nil
}

func (node *RuleBody) BuildRuleAst(this goohm.Node) (results []RuleDetailNode, err error) {
	AssertName(this, "RuleBody")
	for _, el := range node.Arg2.Elems() {
		rdn, err := (&TopLevelTerm{
			Arg1: el.(goohm.RuleNode),
		}).BuildRuleAst(el)
		if err != nil {
			return nil, err
		}
		results = append(results, *rdn)
	}
	return results, nil
}

func (node *TopLevelTerm) BuildRuleAst(this goohm.Node) (*RuleDetailNode, error) {
	AssertName(this, "TopLevelTerm")
	switch node.Arg1.CtorName() {
	case "TopLevelTerm":
		return (&TopLevelTerm{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(this)
	case "TopLevelTerm_inline":
		kids := node.Arg1.Children()
		inlineNode, err := (&TopLevelTermInline{
			Seq:      kids[0].(goohm.RuleNode),
			CaseName: kids[1].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
		if err != nil {
			return nil, err
		}
		return new(Make_RuleDetailNode_inline(*inlineNode)), nil
		// Make_RuleDetailNode()
	case "Seq":
		kids := node.Arg1.Children()
		bnode, err := (&Seq{
			Arg1: kids[0].(goohm.ListNode),
		}).BuildRuleAst(node.Arg1)
		if err != nil {
			return nil, err
		}
		return new(Make_RuleDetailNode_bare(*bnode)), nil
	default:
		panic("unexpected " + node.Arg1.CtorName())
	}
}

func (node *TopLevelTermInline) BuildRuleAst(this goohm.Node) (*InlineNode, error) {
	AssertName(this, "TopLevelTerm_inline")
	name := node.CaseName.Children()[2].SourceString()
	bnode, err := (&Seq{
		Arg1: node.Seq.Children()[0].(goohm.ListNode),
	}).BuildRuleAst(node.Seq)
	if err != nil {
		return nil, err
	}
	src := node.Seq.SourceString()
	return new(Make_InlineNode(name, src, bnode.Args)), nil
}

func (node *Seq) BuildRuleAst(this goohm.Node) (*BareNode, error) {
	AssertName(this, "Seq")
	args := []NamedArgNode{}
	for _, n := range node.Arg1.Children() {
		arg, err := (&Iter{
			Arg1: n.(goohm.RuleNode),
		}).BuildRuleAst(n)
		if err != nil {
			return nil, err
		}
		if arg == nil {
			continue
		}
		args = append(args, *arg)
	}
	return new(Make_BareNode(args)), nil
}

func (node *Iter) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Iter")
	switch node.Arg1.CtorName() {
	case "Iter":
		return (&Iter{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(this)
	case "Iter_star":
		return (&IterStar{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	case "Iter_plus":
		return (&IterPlus{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	case "Iter_opt":
		return (&IterOpt{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	case "Pred":
		return (&Pred{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	default:
		panic("unexpected " + node.Arg1.CtorName())
	}
}

func (node *IterStar) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Iter_star")
	arg, err := (&Pred{
		Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
	}).BuildRuleAst(node.Arg1)
	if arg == nil || err != nil {
		return nil, err
	}
	return new(
		NamedArgNode(
			Make_Named(
				arg.Name,
				Make_ArgNode_list(
					Make_ListNode(
						arg.Node,
					),
				),
			),
		),
	), nil
}

func (node *IterPlus) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Iter_plus")
	arg, err := (&Pred{
		Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
	}).BuildRuleAst(node.Arg1)
	if arg == nil || err != nil {
		return nil, err
	}
	return new(NamedArgNode(Make_Named(
		arg.Name,
		Make_ArgNode_list(
			Make_ListNode(
				arg.Node,
			),
		),
	))), nil
}

func (node *IterOpt) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Iter_opt")
	arg, err := (&Pred{
		Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
	}).BuildRuleAst(node.Arg1)
	if arg == nil || err != nil {
		return nil, err
	}
	return new(NamedArgNode(Make_Named(
		arg.Name,
		Make_ArgNode_opt(
			Make_OptNode(
				arg.Node,
			),
		),
	))), nil
}

func (node *Pred) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Pred")
	switch node.Arg1.CtorName() {
	case "Pred":
		return (&Pred{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(this)
	case "Pred_not":
		// none thing consumed
		return nil, nil
	case "Pred_lookahead":
		// none thing consumed
		return nil, nil
	case "Lex":
		return (&Lex{
			Base: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)
	default:
		panic("unexpected " + node.Arg1.CtorName())
	}
}

func (node *Lex) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Lex")
	switch node.Base.CtorName() {
	case "Lex":
		return (&Lex{
			Base: node.Base.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(this)
	case "Lex_lex":
		return (&LexLex{
			Term1: node.Base.Children()[0].(goohm.TerminalNode),
			Base:  node.Base.Children()[1].(goohm.RuleNode),
		}).BuildRuleAst(node.Base)
	case "Base":
		return (&Base{
			Arg1: node.Base.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Base)
	default:
		panic("unexpected " + node.Base.CtorName())
	}
}

func (node *LexLex) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	return (&Base{
		Arg1: node.Base,
	}).BuildRuleAst(node.Base)
}

func (node *Base) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Base")
	switch node.Arg1.CtorName() {
	case "Base":
		return (&Base{
			Arg1: node.Arg1.Children()[0].(goohm.RuleNode),
		}).BuildRuleAst(this)
	case "Base_application":
		kids := node.Arg1.Children()
		return (&BaseApplication{
			Ident:  kids[0].(goohm.RuleNode),
			Params: kids[1].(goohm.OptNode),
		}).BuildRuleAst(node.Arg1)
	case "Base_range":
		kids := node.Arg1.Children()
		return new((&BaseRange{
			OneCharTerminal1: kids[0].(goohm.RuleNode),
			Term1:            kids[1].(goohm.TerminalNode),
			OneCharTerminal2: kids[2].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)), nil
	case "Base_terminal":
		kids := node.Arg1.Children()
		return new((&BaseTerminal{
			Terminal: kids[0].(goohm.RuleNode),
		}).BuildRuleAst(node.Arg1)), nil
	case "Base_paren":
		kids := node.Arg1.Children()
		return new((&BaseParen{
			Term1: kids[0].(goohm.TerminalNode),
			Alt:   kids[1].(goohm.RuleNode),
			Term2: kids[2].(goohm.TerminalNode),
		}).BuildRuleAst(node.Arg1)), nil
	default:
		panic("unexpected " + node.Arg1.CtorName())
	}
}

var builtInHOR = []string{
	"ListOf", "listOf", "NonemptyListOf", "nonemptyListOf", "EmptyListOf", "emptyListOf",
}

func (node *BaseApplication) BuildRuleAst(this goohm.Node) (*NamedArgNode, error) {
	AssertName(this, "Base_application")
	if len(node.Params.Children()) > 0 {
		hor_name := node.Ident.SourceString()
		if slices.Contains(builtInHOR, hor_name) {
			params := node.Params.Children()[0]
			listof := params.Children()[1]
			nel := listof.Children()[0]
			seq := nel.Children()[0]
			elem, err := (&Seq{
				Arg1: seq.Children()[0].(goohm.ListNode),
			}).BuildRuleAst(seq)
			if err != nil {
				return nil, err
			}
			//
			list2 := nel.Children()[1]
			seq2 := list2.Children()[1]
			sep, err := (&Seq{
				Arg1: seq2.Children()[0].(goohm.ListNode),
			}).BuildRuleAst(seq2)
			if err != nil {
				return nil, err
			}
			if len(elem.Args) != 1 || len(sep.Args) != 1 {
				return nil, fmt.Errorf("expected exactly one argument for elem and sep in builtin hor. got %d and %d", len(elem.Args), len(sep.Args))
			}
			return new(NamedArgNode(Make_Named(
				hor_name,
				Make_ArgNode_bhor(
					Make_BuiltinHOR(
						hor_name,
						elem.Args[0],
						sep.Args[0],
					),
				),
			))), nil
		}
		return new(NamedArgNode(Make_Named(
			node.Ident.SourceString(),
			Make_ArgNode_nobj(
				Make_NObjNode(),
			),
		))), nil
	}
	return new(NamedArgNode(Make_Named(
		node.Ident.SourceString(),
		Make_ArgNode_rule(
			Make_NontNode(
				node.Ident.SourceString(),
			),
		),
	))), nil
}

func (node *BaseRange) BuildRuleAst(this goohm.Node) NamedArgNode {
	AssertName(this, "Base_range")
	return NamedArgNode(Make_Named(
		"rng",
		Make_ArgNode_term(
			Make_TermNode(),
		),
	))
}

func (node *BaseTerminal) BuildRuleAst(this goohm.Node) NamedArgNode {
	AssertName(this, "Base_terminal")
	return NamedArgNode(Make_Named(
		"term",
		Make_ArgNode_term(
			Make_TermNode(),
		),
	))
}

func (node *BaseParen) BuildRuleAst(this goohm.Node) NamedArgNode {
	AssertName(this, "Base_paren")
	return NamedArgNode(Make_Named(
		"alt",
		Make_ArgNode_nobj(
			Make_NObjNode(),
		),
	))
}
