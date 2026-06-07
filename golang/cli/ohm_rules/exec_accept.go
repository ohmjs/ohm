package ohm_rules

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"slices"
	"strings"

	"github.com/ohmjs/goohm"
	"github.com/ohmjs/ohmgo/utils"
	"github.com/samber/lo"
)

type BuildRuleAstCmd struct {
	Grammar string `opts:"mode=arg" help:"Path to .ohm grammar file to generate a visitor for."`
}

func NewBuildRuleAstCmd() *BuildRuleAstCmd {
	return &BuildRuleAstCmd{}
}

func (cm *BuildRuleAstCmd) Run() error {
	if cm.Grammar[:1] == "@" {
		barr, err := os.ReadFile(cm.Grammar[1:])
		if err != nil {
			return fmt.Errorf("Error reading grammar file. %[1]v", err)
		}
		cm.Grammar = string(barr)
	}
	g, err := cm.Do()
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	enc.Encode(g)
	return err
}

func (cm *BuildRuleAstCmd) Do() (*GrammarsNode, error) {
	ctx := context.Background()
	var (
		gmr  *goohm.Grammar
		mr   *goohm.MatchResult
		err  error
		root goohm.Node
	)
	if gmr, err = goohm.NewGrammar(ctx, utils.OhmGrammarWasmBytes()); err != nil {
		return nil, fmt.Errorf("creating grammar: %[1]v", err)
	}
	defer gmr.Close()
	if mr, err = gmr.Match(cm.Grammar); err != nil {
		return nil, fmt.Errorf("matching: %[1]v", err)
	}
	defer mr.Close()
	if !mr.Succeeded() {
		return nil, fmt.Errorf("match failed")
	}
	if root, err = mr.GetCstRoot(); err != nil {
		return nil, fmt.Errorf("Error getting cst root. %[1]v", err)
	}
	gmrs := &Grammars[any, *GrammarsNode]{
		Grammar: root.Children()[0].(goohm.ListNode),
	}
	v := &ruleAstBuilder{}
	resp, err := gmrs.Accept(root, v, nil)
	return resp, err
}

// type WithError[T any] struct {
// 	Val T
// 	Err error
// }

type ruleAstBuilder struct {
}

// VisitGrammars implements [VisitorGrammars].
func (r *ruleAstBuilder) VisitGrammars(node *Grammars[any, *GrammarsNode]) (result *GrammarsNode, err error) {
	gmrs := map[string]GrammarNode{}
	gmr_names := []string{}
	for _, n := range node.Grammar.Children() {
		kids := n.Children()
		resp, err := (&Grammar[any, *GrammarNode]{
			Ident:        kids[0].(goohm.RuleNode),
			SuperGrammar: kids[1].(goohm.OptNode),
			Term1:        kids[2].(goohm.TerminalNode),
			Rule:         kids[3].(goohm.ListNode),
			Term2:        kids[4].(goohm.TerminalNode),
		}).Accept(n, r, nil)
		if err != nil {
			return nil, err
		}
		gmr_names = append(gmr_names, resp.Name)
		gmrs[resp.Name] = *resp
	}
	return new(Make_GrammarsNode(gmr_names, gmrs)), nil
}

// VisitGrammar implements [VisitorGrammar].
func (r *ruleAstBuilder) VisitGrammar(node *Grammar[any, *GrammarNode]) (result *GrammarNode, err error) {
	rules := []string{}
	rmap := map[string]RuleNode{}
	for _, n := range node.Rule.Children() {
		rns, err := (&Rule[string, []RuleNode]{
			Node: n.(goohm.RuleNode),
		}).Accept(n, r, n.SourceString())
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

// VisitRuleDefine implements [VisitorRuleDefine].
func (r *ruleAstBuilder) VisitRuleDefine(node *RuleDefine[string, []RuleNode], payload string) (result []RuleNode, err error) {
	descr := ""
	if len(node.RuleDescr.Children()) > 0 {
		dn := node.RuleDescr.Children()[0]
		kids := dn.Children()
		descr, _ = (&LexRuleDescr[any, string]{
			Term1:         kids[0].(goohm.TerminalNode),
			RuleDescrText: kids[1].(goohm.RuleNode),
			Term2:         kids[2].(goohm.TerminalNode),
		}).Accept(dn, r, nil)
	}
	return r.BuildRuleAstRule(
		node.RuleBody,
		Make_RuleType_define(),
		node.Ident.SourceString(),
		payload,
		descr,
	)
}

// VisitRuleExtend implements [VisitorRuleExtend].
func (r *ruleAstBuilder) VisitRuleExtend(node *RuleExtend[string, []RuleNode], payload string) (result []RuleNode, err error) {
	return r.BuildRuleAstRule(
		node.RuleBody,
		Make_RuleType_extend(),
		node.Ident.SourceString(),
		payload,
		"",
	)
}

// VisitRuleOverride implements [VisitorPRERuleOverride].
func (r *ruleAstBuilder) VisitRuleOverride(node *RuleOverride[string, []RuleNode], payload string) (result []RuleNode, err error) {
	panic("unimplemented")
}

func (r *ruleAstBuilder) BuildRuleAstRule(
	ruleBody goohm.RuleNode,
	rule_type RuleType,
	name string,
	sourceString string,
	descr string,
) ([]RuleNode, error) {
	rb := ruleBody.Children()
	details, err := (&RuleBody[any, []RuleDetailNode]{
		Term:           rb[0].(goohm.OptNode),
		NonemptyListOf: rb[1].(goohm.BHorNode),
	}).Accept(ruleBody, r, nil)
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

// VisitLexRuleDescr implements [VisitorLexRuleDescr].
func (r *ruleAstBuilder) VisitLexRuleDescr(node *LexRuleDescr[any, string]) (result string) {
	return node.RuleDescrText.SourceString()
}

// VisitRuleBody implements [VisitorRuleBody].
func (r *ruleAstBuilder) VisitRuleBody(node *RuleBody[any, []RuleDetailNode]) (result []RuleDetailNode, err error) {
	resp := []RuleDetailNode{}
	for _, el := range node.NonemptyListOf.Elems() {
		rdn, err := (&TopLevelTerm[any, *RuleDetailNode]{
			Node: el.(goohm.RuleNode),
		}).Accept(el, r, nil)
		if err != nil {
			return nil, err
		}
		resp = append(resp, *rdn)
	}
	return resp, nil
}

// VisitTopLevelTermInline implements [VisitorTopLevelTermInline].
func (r *ruleAstBuilder) VisitTopLevelTermInline(node *TopLevelTermInline[any, *RuleDetailNode]) (result *RuleDetailNode, err error) {
	name := node.CaseName.Children()[2].SourceString()
	bnode, err := (&Seq[any, *RuleDetailNode]{
		Iter: node.Seq.Children()[0].(goohm.ListNode),
	}).Accept(node.Seq, r, nil)
	if err != nil {
		return nil, err
	}
	src := node.Seq.SourceString()
	bare, _ := bnode.Cast_bare()
	return new(Make_RuleDetailNode_inline(
		Make_InlineNode(name, src, bare.Args),
	)), nil

	// return WithError[*InlineNode]{
	// 	Val: new(Make_InlineNode(name, src, bnode.Val.Args)),
	// }
}

// VisitSeq implements [VisitorSeq].
func (r *ruleAstBuilder) VisitSeq(node *Seq[any, *RuleDetailNode]) (result *RuleDetailNode, err error) {
	args := []NamedArgNode{}
	for _, n := range node.Iter.Children() {
		arg, err := (&Iter[any, *NamedArgNode]{
			Node: n.(goohm.RuleNode),
		}).Accept(n, r, nil)
		if err != nil {
			return nil, err
		}
		if arg == nil {
			continue
		}
		args = append(args, *arg)
	}
	return new(Make_RuleDetailNode_bare(
		Make_BareNode(args),
	)), nil
	// return WithError[*BareNode]{Val: new(Make_BareNode(args))}
}

// VisitIterStar implements [VisitorIterStar].
func (r *ruleAstBuilder) VisitIterStar(node *IterStar[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	arg, err := (&Pred[any, *NamedArgNode]{
		Node: node.Pred.Children()[0].(goohm.RuleNode),
	}).Accept(node.Pred, r, nil)
	if arg == nil || err != nil {
		// return nil, err
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

// VisitIterPlus implements [VisitorIterPlus].
func (r *ruleAstBuilder) VisitIterPlus(node *IterPlus[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	arg, err := (&Pred[any, *NamedArgNode]{
		Node: node.Pred.Children()[0].(goohm.RuleNode),
	}).Accept(node.Pred, r, nil)
	if arg == nil || err != nil {
		// return nil, err
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

// VisitIterOpt implements [VisitorIterOpt].
func (r *ruleAstBuilder) VisitIterOpt(node *IterOpt[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	arg, err := (&Pred[any, *NamedArgNode]{
		Node: node.Pred.Children()[0].(goohm.RuleNode),
	}).Accept(node.Pred, r, nil)
	if arg == nil || err != nil {
		// return nil, err
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

// VisitPredNot implements [VisitorREPredNot].
func (r *ruleAstBuilder) VisitPredNot(node *PredNot[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	return
}

// VisitPredLookahead implements [VisitorREPredLookahead].
func (r *ruleAstBuilder) VisitPredLookahead(node *PredLookahead[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	return
}

// VisitLexLex implements [VisitorLexLex].
func (r *ruleAstBuilder) VisitLexLex(node *LexLex[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	resp, err := (&Base[any, *NamedArgNode]{
		Node: node.Base,
	}).Accept(node.Base, r, nil)
	return resp, err
}

// VisitBaseApplication implements [VisitorBaseApplication].
func (r *ruleAstBuilder) VisitBaseApplication(node *BaseApplication[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	if len(node.Params.Children()) > 0 {
		hor_name := node.Ident.SourceString()
		if slices.Contains(builtInHOR, hor_name) {
			params := node.Params.Children()[0]
			listof := params.Children()[1]
			nel := listof.Children()[0]
			seq := nel.Children()[0]
			elem, err := (&Seq[any, *RuleDetailNode]{
				Iter: seq.Children()[0].(goohm.ListNode),
			}).Accept(seq, r, nil)
			if err != nil {
				return nil, err
			}
			//
			list2 := nel.Children()[1]
			seq2 := list2.Children()[1]
			sep, err := (&Seq[any, *RuleDetailNode]{
				Iter: seq2.Children()[0].(goohm.ListNode),
			}).Accept(seq2, r, nil)
			if err != nil {
				return nil, err
			}
			ebare, _ := elem.Cast_bare()
			sbare, _ := sep.Cast_bare()
			if len(ebare.Args) != 1 || len(sbare.Args) != 1 {
				return nil, fmt.Errorf(
					"expected exactly one argument for elem and sep in builtin hor. got %d and %d",
					len(ebare.Args),
					len(sbare.Args),
				)
			}
			return new(NamedArgNode(Make_Named(
				hor_name,
				Make_ArgNode_bhor(
					Make_BuiltinHOR(
						hor_name,
						ebare.Args[0],
						sbare.Args[0],
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

// VisitBaseRange implements [VisitorBaseRange].
func (r *ruleAstBuilder) VisitBaseRange(node *BaseRange[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	resp := NamedArgNode(Make_Named(
		"rng",
		Make_ArgNode_term(
			Make_TermNode(),
		),
	))
	return &resp, nil
}

// VisitBaseTerminal implements [VisitorBaseTerminal].
func (r *ruleAstBuilder) VisitBaseTerminal(node *BaseTerminal[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	resp := NamedArgNode(Make_Named(
		"term",
		Make_ArgNode_term(
			Make_TermNode(),
		),
	))
	return &resp, nil
}

// VisitBaseParen implements [VisitorBaseParen].
func (r *ruleAstBuilder) VisitBaseParen(node *BaseParen[any, *NamedArgNode]) (result *NamedArgNode, err error) {
	resp := NamedArgNode(Make_Named(
		"alt",
		Make_ArgNode_nobj(
			Make_NObjNode(),
		),
	))
	return &resp, nil
}

// // BuiltInRule implements [goohm.BuiltinVisitor].
// func (v *v) BuiltInRule(node goohm.Node) {
// 	fmt.Printf("%s", node.SourceString())
// }

// // Terminal implements [goohm.TerminalVisitor].
// func (v *v) Terminal(node goohm.TerminalNode) {
// 	fmt.Printf("%s", node.SourceString())
// }

var (
	// Grammars
	_ VisitorRE_Grammars[any, *GrammarsNode] = (*ruleAstBuilder)(nil)
	// Grammar
	_ VisitorRE_Grammar[any, *GrammarNode] = (*ruleAstBuilder)(nil)
	// RuleDescr
	_ VisitorR_LexRuleDescr[any, string] = (*ruleAstBuilder)(nil)
	// Rule
	_ VisitorPRE_RuleDefine[string, []RuleNode]   = (*ruleAstBuilder)(nil)
	_ VisitorPRE_RuleExtend[string, []RuleNode]   = (*ruleAstBuilder)(nil)
	_ VisitorPRE_RuleOverride[string, []RuleNode] = (*ruleAstBuilder)(nil)
	// RuleBody
	_ VisitorRE_RuleBody[any, []RuleDetailNode] = (*ruleAstBuilder)(nil)
	// TopLevelTerm
	_ VisitorRE_TopLevelTermInline[any, *RuleDetailNode] = (*ruleAstBuilder)(nil)
	_ VisitorRE_Seq[any, *RuleDetailNode]                = (*ruleAstBuilder)(nil)
	// Iter
	_ VisitorRE_IterStar[any, *NamedArgNode] = (*ruleAstBuilder)(nil)
	_ VisitorRE_IterPlus[any, *NamedArgNode] = (*ruleAstBuilder)(nil)
	_ VisitorRE_IterOpt[any, *NamedArgNode]  = (*ruleAstBuilder)(nil)
	// Pred
	_ VisitorRE_PredNot[any, *NamedArgNode]       = (*ruleAstBuilder)(nil)
	_ VisitorRE_PredLookahead[any, *NamedArgNode] = (*ruleAstBuilder)(nil)
	_ VisitorRE_LexLex[any, *NamedArgNode]        = (*ruleAstBuilder)(nil)
	// Base
	_ VisitorRE_BaseApplication[any, *NamedArgNode] = (*ruleAstBuilder)(nil)
	_ VisitorRE_BaseRange[any, *NamedArgNode]       = (*ruleAstBuilder)(nil)
	_ VisitorRE_BaseTerminal[any, *NamedArgNode]    = (*ruleAstBuilder)(nil)
	_ VisitorRE_BaseParen[any, *NamedArgNode]       = (*ruleAstBuilder)(nil)
)

// var (
// 	_ SwitcherPR_TopLevelTerm[any, WithError[*RuleDetailNode]] = (*ruleAstBuilder)(nil)
// 	_ SwitcherPR_Rule[string, WithError[[]RuleNode]]           = (*ruleAstBuilder)(nil)
// 	_ SwitcherPR_Iter[any, WithError[*NamedArgNode]]           = (*ruleAstBuilder)(nil)
// 	_ SwitcherPR_Pred[any, WithError[*NamedArgNode]]           = (*ruleAstBuilder)(nil)
// 	_ SwitcherPR_Lex[any, WithError[*NamedArgNode]]            = (*ruleAstBuilder)(nil)
// 	_ SwitcherPR_Base[any, WithError[*NamedArgNode]]           = (*ruleAstBuilder)(nil)
// )

// // VisitTopLevelTerm implements [VisitorTopLevelTerm].
// func (r *ruleAstBuilder) SwitchTopLevelTerm(node *TopLevelTerm[any, WithError[*RuleDetailNode]], payload any) (result WithError[*RuleDetailNode]) {
// 	switch node.Node.CtorName() {
// 	case "TopLevelTerm":
// 		// node0 := ((*RuleDefine[any, string])(unsafe.Pointer(node))).AcceptRuleDescr(c, payload)
// 		resp, _ := (&TopLevelTerm[any, WithError[*RuleDetailNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).DefaultAccept(r, payload)
// 		return resp
// 	case "TopLevelTerm_inline":
// 		kids := node.Node.Children()
// 		inlineNode, _ := (&TopLevelTermInline[any, WithError[*RuleDetailNode]]{
// 			Seq:      kids[0].(goohm.RuleNode),
// 			CaseName: kids[1].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return inlineNode
// 		// if inlineNode.Err != nil {
// 		// 	return WithError[*RuleDetailNode]{Err: inlineNode.Err}
// 		// }
// 		// return WithError[*RuleDetailNode]{
// 		// 	Val: new(Make_RuleDetailNode_inline(*inlineNode.Val)),
// 		// }
// 		// Make_RuleDetailNode()
// 	case "Seq":
// 		kids := node.Node.Children()
// 		bnode, _ := (&Seq[any, WithError[*RuleDetailNode]]{
// 			Iter: kids[0].(goohm.ListNode),
// 		}).Accept(node.Node, r, nil)
// 		return bnode
// 		// if bnode.Err != nil {
// 		// 	return WithError[*RuleDetailNode]{Err: bnode.Err}
// 		// }
// 		// return WithError[*RuleDetailNode]{Val: new(Make_RuleDetailNode_bare(*bnode.Val))}
// 	default:
// 		panic("unexpected " + node.Node.CtorName())
// 	}
// }

// // VisitRule implements [VisitorRule].
// func (r *ruleAstBuilder) SwitchRule(node *Rule[string, WithError[[]RuleNode]], payload string) (result WithError[[]RuleNode]) {
// 	switch node.Node.CtorName() {
// 	case "Rule":
// 		resp, _ := (&Rule[string, WithError[[]RuleNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, node.Node.SourceString())
// 		return resp
// 	case "Rule_define":
// 		kids := node.Node.Children()
// 		resp, _ := (&RuleDefine[string, WithError[[]RuleNode]]{
// 			Ident:     kids[0].(goohm.RuleNode),
// 			Formals:   kids[1].(goohm.OptNode),
// 			RuleDescr: kids[2].(goohm.OptNode),
// 			Term:      kids[3].(goohm.TerminalNode),
// 			RuleBody:  kids[4].(goohm.RuleNode),
// 		}).Accept(node.Node, r, node.Node.SourceString())
// 		return resp
// 	case "Rule_override":
// 		panic("not implemented")
// 	case "Rule_extend":
// 		kids := node.Node.Children()
// 		resp, _ := (&RuleExtend[string, WithError[[]RuleNode]]{
// 			Ident:    kids[0].(goohm.RuleNode),
// 			Formals:  kids[1].(goohm.OptNode),
// 			Term:     kids[2].(goohm.TerminalNode),
// 			RuleBody: kids[3].(goohm.RuleNode),
// 		}).Accept(node.Node, r, node.Node.SourceString())
// 		return resp
// 	default:
// 		panic("unexpected " + node.Node.CtorName())
// 	}
// }

// // VisitIter implements [VisitorIter].
// func (r *ruleAstBuilder) SwitchIter(node *Iter[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
// 	switch node.Node.CtorName() {
// 	case "Iter":
// 		resp, _ := (&Iter[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).DefaultAccept(r, nil)
// 		return resp
// 	case "Iter_star":
// 		resp, _ := (&IterStar[any, WithError[*NamedArgNode]]{
// 			Pred: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Iter_plus":
// 		resp, _ := (&IterPlus[any, WithError[*NamedArgNode]]{
// 			Pred: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Iter_opt":
// 		resp, _ := (&IterOpt[any, WithError[*NamedArgNode]]{
// 			Pred: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Pred":
// 		resp, _ := (&Pred[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	default:
// 		panic("unexpected " + node.Node.CtorName())
// 	}
// }

// // VisitPred implements [VisitorPred].
// func (r *ruleAstBuilder) SwitchPred(node *Pred[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
// 	switch node.Node.CtorName() {
// 	case "Pred":
// 		resp, _ := (&Pred[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).DefaultAccept(r, nil)
// 		return resp
// 	case "Pred_not":
// 		// none thing consumed
// 		return WithError[*NamedArgNode]{}
// 	case "Pred_lookahead":
// 		// none thing consumed
// 		return WithError[*NamedArgNode]{}
// 	case "Lex":
// 		resp, _ := (&Lex[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	default:
// 		panic("unexpected " + node.Node.CtorName())
// 	}
// }

// // VisitLex implements [VisitorLex].
// func (r *ruleAstBuilder) SwitchLex(node *Lex[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
// 	switch node.Node.CtorName() {
// 	case "Lex":
// 		resp, _ := (&Lex[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).DefaultAccept(r, nil)
// 		return resp
// 	case "Lex_lex":
// 		resp, _ := (&LexLex[any, WithError[*NamedArgNode]]{
// 			Term: node.Node.Children()[0].(goohm.TerminalNode),
// 			Base: node.Node.Children()[1].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Base":
// 		resp, _ := (&Base[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	default:
// 		panic("unexpected " + node.Node.CtorName())
// 	}
// }

// // VisitBase implements [VisitorBase].
// func (r *ruleAstBuilder) SwitchBase(node *Base[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
// 	switch node.Node.CtorName() {
// 	case "Base":
// 		resp, _ := (&Base[any, WithError[*NamedArgNode]]{
// 			Node: node.Node.Children()[0].(goohm.RuleNode),
// 		}).DefaultAccept(r, nil)
// 		return resp
// 	case "Base_application":
// 		kids := node.Node.Children()
// 		resp, _ := (&BaseApplication[any, WithError[*NamedArgNode]]{
// 			Ident:  kids[0].(goohm.RuleNode),
// 			Params: kids[1].(goohm.OptNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Base_range":
// 		kids := node.Node.Children()
// 		resp, _ := (&BaseRange[any, WithError[*NamedArgNode]]{
// 			OneCharTerminal1: kids[0].(goohm.RuleNode),
// 			Term:             kids[1].(goohm.TerminalNode),
// 			OneCharTerminal2: kids[2].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Base_terminal":
// 		kids := node.Node.Children()
// 		resp, _ := (&BaseTerminal[any, WithError[*NamedArgNode]]{
// 			Terminal: kids[0].(goohm.RuleNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	case "Base_paren":
// 		kids := node.Node.Children()
// 		resp, _ := (&BaseParen[any, WithError[*NamedArgNode]]{
// 			Term1: kids[0].(goohm.TerminalNode),
// 			Alt:   kids[1].(goohm.RuleNode),
// 			Term2: kids[2].(goohm.TerminalNode),
// 		}).Accept(node.Node, r, nil)
// 		return resp
// 	default:
// 		panic("unexpected " + node.Node.CtorName())
// 	}
// }
