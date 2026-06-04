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
	gmrs := &Grammars[any, WithError[*GrammarsNode]]{
		Grammar: root.Children()[0].(goohm.ListNode),
	}
	v := &ruleAstBuilder{}
	resp := gmrs.Accept(root, v, nil)
	return resp.Val, resp.Err
}

type WithError[T any] struct {
	Val T
	Err error
}

type ruleAstBuilder struct {
}

// VisitGrammars implements [VisitorGrammars].
func (r *ruleAstBuilder) VisitGrammars(node *Grammars[any, WithError[*GrammarsNode]], payload any) (result WithError[*GrammarsNode]) {
	gmrs := map[string]GrammarNode{}
	gmr_names := []string{}
	for _, n := range node.Grammar.Children() {
		kids := n.Children()
		resp := (&Grammar[any, WithError[*GrammarNode]]{
			Ident:        kids[0].(goohm.RuleNode),
			SuperGrammar: kids[1].(goohm.OptNode),
			Term1:        kids[2].(goohm.TerminalNode),
			Rule:         kids[3].(goohm.ListNode),
			Term2:        kids[4].(goohm.TerminalNode),
		}).Accept(n, r, nil)
		if resp.Err != nil {
			return WithError[*GrammarsNode]{
				Err: resp.Err,
			}
		}
		gmr_names = append(gmr_names, resp.Val.Name)
		gmrs[resp.Val.Name] = *resp.Val
	}
	return WithError[*GrammarsNode]{Val: new(Make_GrammarsNode(gmr_names, gmrs))}
}

// VisitGrammar implements [VisitorGrammar].
func (r *ruleAstBuilder) VisitGrammar(node *Grammar[any, WithError[*GrammarNode]], payload any) (result WithError[*GrammarNode]) {
	rules := []string{}
	rmap := map[string]RuleNode{}
	for _, n := range node.Rule.Children() {
		rns := (&Rule[any, WithError[[]RuleNode]]{
			Node: n.(goohm.RuleNode),
		}).Accept(n, r, nil)
		if rns.Err != nil {
			return WithError[*GrammarNode]{Err: rns.Err}
		}
		for _, rn := range rns.Val {
			name := rn.GetBranch().RuleName()
			rules = append(rules, name)
			rmap[name] = rn
		}
	}
	return WithError[*GrammarNode]{Val: new(Make_GrammarNode(
		node.Ident.SourceString(),
		rules,
		rmap,
	))}
}

// VisitRule implements [VisitorRule].
func (r *ruleAstBuilder) VisitRule(node *Rule[any, WithError[[]RuleNode]], payload any) (result WithError[[]RuleNode]) {
	switch node.Node.CtorName() {
	case "Rule":
		return (&Rule[any, WithError[[]RuleNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	case "Rule_define":
		kids := node.Node.Children()
		return (&RuleDefine[string, WithError[[]RuleNode]]{
			Ident:     kids[0].(goohm.RuleNode),
			Formals:   kids[1].(goohm.OptNode),
			RuleDescr: kids[2].(goohm.OptNode),
			Term:      kids[3].(goohm.TerminalNode),
			RuleBody:  kids[4].(goohm.RuleNode),
		}).Accept(node.Node, r, node.Node.SourceString())
	case "Rule_override":
		panic("not implemented")
	case "Rule_extend":
		kids := node.Node.Children()
		return (&RuleExtend[string, WithError[[]RuleNode]]{
			Ident:    kids[0].(goohm.RuleNode),
			Formals:  kids[1].(goohm.OptNode),
			Term:     kids[2].(goohm.TerminalNode),
			RuleBody: kids[3].(goohm.RuleNode),
		}).Accept(node.Node, r, node.Node.SourceString())
	default:
		panic("unexpected " + node.Node.CtorName())
	}
}

// VisitRuleDefine implements [VisitorRuleDefine].
func (r *ruleAstBuilder) VisitRuleDefine(node *RuleDefine[string, WithError[[]RuleNode]], payload string) (result WithError[[]RuleNode]) {
	descr := ""
	if len(node.RuleDescr.Children()) > 0 {
		dn := node.RuleDescr.Children()[0]
		kids := dn.Children()
		descr = (&LexRuleDescr[any, string]{
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

func (r *ruleAstBuilder) BuildRuleAstRule(
	ruleBody goohm.RuleNode,
	rule_type RuleType,
	name string,
	sourceString string,
	descr string,
) WithError[[]RuleNode] {
	rb := ruleBody.Children()
	details := (&RuleBody[any, WithError[[]RuleDetailNode]]{
		Term:           rb[0].(goohm.OptNode),
		NonemptyListOf: rb[1].(goohm.BHorNode),
	}).Accept(ruleBody, r, nil)
	if details.Err != nil {
		return WithError[[]RuleNode]{
			Err: details.Err,
		}
	}
	cases := lo.FlatMap[RuleDetailNode, InlineNode](details.Val, func(item RuleDetailNode, index int) []InlineNode {
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
	bare := lo.FlatMap[RuleDetailNode, BareNode](details.Val, func(item RuleDetailNode, index int) []BareNode {
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
		return WithError[[]RuleNode]{Val: result}
	}
	return WithError[[]RuleNode]{
		Val: []RuleNode{Make_RuleNode_bare_rule(
			Make_BareRuleNode(
				name,
				rule_type,
				descr,
				sourceString,
				args,
			),
		)},
	}
}

// VisitLexRuleDescr implements [VisitorLexRuleDescr].
func (r *ruleAstBuilder) VisitLexRuleDescr(node *LexRuleDescr[any, string], payload any) (result string) {
	return node.RuleDescrText.SourceString()
}

// VisitRuleExtend implements [VisitorRuleExtend].
func (r *ruleAstBuilder) VisitRuleExtend(node *RuleExtend[string, WithError[[]RuleNode]], payload string) (result WithError[[]RuleNode]) {
	return r.BuildRuleAstRule(
		node.RuleBody,
		Make_RuleType_extend(),
		node.Ident.SourceString(),
		payload,
		"",
	)
}

// VisitRuleBody implements [VisitorRuleBody].
func (r *ruleAstBuilder) VisitRuleBody(node *RuleBody[any, WithError[[]RuleDetailNode]], payload any) (result WithError[[]RuleDetailNode]) {
	resp := []RuleDetailNode{}
	for _, el := range node.NonemptyListOf.Elems() {
		rdn := (&TopLevelTerm[any, WithError[*RuleDetailNode]]{
			Node: el.(goohm.RuleNode),
		}).Accept(el, r, nil)
		if rdn.Err != nil {
			return WithError[[]RuleDetailNode]{Err: rdn.Err}
		}
		resp = append(resp, *rdn.Val)
	}
	return WithError[[]RuleDetailNode]{
		Val: resp,
	}
}

// VisitTopLevelTerm implements [VisitorTopLevelTerm].
func (r *ruleAstBuilder) VisitTopLevelTerm(node *TopLevelTerm[any, WithError[*RuleDetailNode]], payload any) (result WithError[*RuleDetailNode]) {
	switch node.Node.CtorName() {
	case "TopLevelTerm":
		// node0 := ((*RuleDefine[any, string])(unsafe.Pointer(node))).AcceptRuleDescr(c, payload)
		return (&TopLevelTerm[any, WithError[*RuleDetailNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).DefaultAccept(r, payload)
	case "TopLevelTerm_inline":
		kids := node.Node.Children()
		inlineNode := (&TopLevelTermInline[any, WithError[*RuleDetailNode]]{
			Seq:      kids[0].(goohm.RuleNode),
			CaseName: kids[1].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
		return inlineNode
		// if inlineNode.Err != nil {
		// 	return WithError[*RuleDetailNode]{Err: inlineNode.Err}
		// }
		// return WithError[*RuleDetailNode]{
		// 	Val: new(Make_RuleDetailNode_inline(*inlineNode.Val)),
		// }
		// Make_RuleDetailNode()
	case "Seq":
		kids := node.Node.Children()
		bnode := (&Seq[any, WithError[*RuleDetailNode]]{
			Iter: kids[0].(goohm.ListNode),
		}).Accept(node.Node, r, nil)
		return bnode
		// if bnode.Err != nil {
		// 	return WithError[*RuleDetailNode]{Err: bnode.Err}
		// }
		// return WithError[*RuleDetailNode]{Val: new(Make_RuleDetailNode_bare(*bnode.Val))}
	default:
		panic("unexpected " + node.Node.CtorName())
	}
}

// VisitTopLevelTermInline implements [VisitorTopLevelTermInline].
func (r *ruleAstBuilder) VisitTopLevelTermInline(node *TopLevelTermInline[any, WithError[*RuleDetailNode]], payload any) (result WithError[*RuleDetailNode]) {
	name := node.CaseName.Children()[2].SourceString()
	bnode := (&Seq[any, WithError[*RuleDetailNode]]{
		Iter: node.Seq.Children()[0].(goohm.ListNode),
	}).Accept(node.Seq, r, nil)
	if bnode.Err != nil {
		return WithError[*RuleDetailNode]{Err: bnode.Err}
	}
	src := node.Seq.SourceString()
	bare, _ := bnode.Val.Cast_bare()
	return WithError[*RuleDetailNode]{Val: new(Make_RuleDetailNode_inline(
		Make_InlineNode(name, src, bare.Args),
	))}

	// return WithError[*InlineNode]{
	// 	Val: new(Make_InlineNode(name, src, bnode.Val.Args)),
	// }
}

// VisitSeq implements [VisitorSeq].
func (r *ruleAstBuilder) VisitSeq(node *Seq[any, WithError[*RuleDetailNode]], payload any) (result WithError[*RuleDetailNode]) {
	args := []NamedArgNode{}
	for _, n := range node.Iter.Children() {
		arg := (&Iter[any, WithError[*NamedArgNode]]{
			Node: n.(goohm.RuleNode),
		}).Accept(n, r, nil)
		if arg.Err != nil {
			return WithError[*RuleDetailNode]{Err: arg.Err}
		}
		if arg.Val == nil {
			continue
		}
		args = append(args, *arg.Val)
	}
	return WithError[*RuleDetailNode]{Val: new(Make_RuleDetailNode_bare(
		Make_BareNode(args),
	))}
	// return WithError[*BareNode]{Val: new(Make_BareNode(args))}
}

// VisitIter implements [VisitorIter].
func (r *ruleAstBuilder) VisitIter(node *Iter[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	switch node.Node.CtorName() {
	case "Iter":
		return (&Iter[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).DefaultAccept(r, nil)
	case "Iter_star":
		return (&IterStar[any, WithError[*NamedArgNode]]{
			Pred: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	case "Iter_plus":
		return (&IterPlus[any, WithError[*NamedArgNode]]{
			Pred: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	case "Iter_opt":
		return (&IterOpt[any, WithError[*NamedArgNode]]{
			Pred: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	case "Pred":
		return (&Pred[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	default:
		panic("unexpected " + node.Node.CtorName())
	}
}

// VisitIterStar implements [VisitorIterStar].
func (r *ruleAstBuilder) VisitIterStar(node *IterStar[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	arg := (&Pred[any, WithError[*NamedArgNode]]{
		Node: node.Pred.Children()[0].(goohm.RuleNode),
	}).Accept(node.Pred, r, nil)
	if arg.Val == nil || arg.Err != nil {
		// return nil, err
		return arg
	}
	return WithError[*NamedArgNode]{Val: new(
		NamedArgNode(
			Make_Named(
				arg.Val.Name,
				Make_ArgNode_list(
					Make_ListNode(
						arg.Val.Node,
					),
				),
			),
		),
	)}
}

// VisitIterPlus implements [VisitorIterPlus].
func (r *ruleAstBuilder) VisitIterPlus(node *IterPlus[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	arg := (&Pred[any, WithError[*NamedArgNode]]{
		Node: node.Pred.Children()[0].(goohm.RuleNode),
	}).Accept(node.Pred, r, nil)
	if arg.Val == nil || arg.Err != nil {
		// return nil, err
		return arg
	}
	return WithError[*NamedArgNode]{Val: new(NamedArgNode(Make_Named(
		arg.Val.Name,
		Make_ArgNode_list(
			Make_ListNode(
				arg.Val.Node,
			),
		),
	)))}
}

// VisitIterOpt implements [VisitorIterOpt].
func (r *ruleAstBuilder) VisitIterOpt(node *IterOpt[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	arg := (&Pred[any, WithError[*NamedArgNode]]{
		Node: node.Pred.Children()[0].(goohm.RuleNode),
	}).Accept(node.Pred, r, nil)
	if arg.Val == nil || arg.Err != nil {
		// return nil, err
		return arg
	}
	return WithError[*NamedArgNode]{Val: new(NamedArgNode(Make_Named(
		arg.Val.Name,
		Make_ArgNode_opt(
			Make_OptNode(
				arg.Val.Node,
			),
		),
	)))}
}

// VisitPred implements [VisitorPred].
func (r *ruleAstBuilder) VisitPred(node *Pred[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	switch node.Node.CtorName() {
	case "Pred":
		return (&Pred[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).DefaultAccept(r, nil)
	case "Pred_not":
		// none thing consumed
		return WithError[*NamedArgNode]{}
	case "Pred_lookahead":
		// none thing consumed
		return WithError[*NamedArgNode]{}
	case "Lex":
		return (&Lex[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	default:
		panic("unexpected " + node.Node.CtorName())
	}
}

// VisitLex implements [VisitorLex].
func (r *ruleAstBuilder) VisitLex(node *Lex[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	switch node.Node.CtorName() {
	case "Lex":
		return (&Lex[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).DefaultAccept(r, nil)
	case "Lex_lex":
		return (&LexLex[any, WithError[*NamedArgNode]]{
			Term: node.Node.Children()[0].(goohm.TerminalNode),
			Base: node.Node.Children()[1].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	case "Base":
		return (&Base[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil)
	default:
		panic("unexpected " + node.Node.CtorName())
	}
}

// VisitLexLex implements [VisitorLexLex].
func (r *ruleAstBuilder) VisitLexLex(node *LexLex[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	return (&Base[any, WithError[*NamedArgNode]]{
		Node: node.Base,
	}).Accept(node.Base, r, nil)
}

// VisitBase implements [VisitorBase].
func (r *ruleAstBuilder) VisitBase(node *Base[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	switch node.Node.CtorName() {
	case "Base":
		return (&Base[any, WithError[*NamedArgNode]]{
			Node: node.Node.Children()[0].(goohm.RuleNode),
		}).DefaultAccept(r, nil)
	case "Base_application":
		kids := node.Node.Children()
		return (&BaseApplication[any, WithError[*NamedArgNode]]{
			Ident:  kids[0].(goohm.RuleNode),
			Params: kids[1].(goohm.OptNode),
		}).Accept(node.Node, r, nil)
	case "Base_range":
		kids := node.Node.Children()
		resp := new((&BaseRange[any, NamedArgNode]{
			OneCharTerminal1: kids[0].(goohm.RuleNode),
			Term:             kids[1].(goohm.TerminalNode),
			OneCharTerminal2: kids[2].(goohm.RuleNode),
		}).Accept(node.Node, r, nil))
		return WithError[*NamedArgNode]{Val: resp}
	case "Base_terminal":
		kids := node.Node.Children()
		resp := new((&BaseTerminal[any, NamedArgNode]{
			Terminal: kids[0].(goohm.RuleNode),
		}).Accept(node.Node, r, nil))
		return WithError[*NamedArgNode]{Val: resp}
	case "Base_paren":
		kids := node.Node.Children()
		resp := new((&BaseParen[any, NamedArgNode]{
			Term1: kids[0].(goohm.TerminalNode),
			Alt:   kids[1].(goohm.RuleNode),
			Term2: kids[2].(goohm.TerminalNode),
		}).Accept(node.Node, r, nil))
		return WithError[*NamedArgNode]{Val: resp}
	default:
		panic("unexpected " + node.Node.CtorName())
	}
}

// VisitBaseApplication implements [VisitorBaseApplication].
func (r *ruleAstBuilder) VisitBaseApplication(node *BaseApplication[any, WithError[*NamedArgNode]], payload any) (result WithError[*NamedArgNode]) {
	if len(node.Params.Children()) > 0 {
		hor_name := node.Ident.SourceString()
		if slices.Contains(builtInHOR, hor_name) {
			params := node.Params.Children()[0]
			listof := params.Children()[1]
			nel := listof.Children()[0]
			seq := nel.Children()[0]
			elem := (&Seq[any, WithError[*RuleDetailNode]]{
				Iter: seq.Children()[0].(goohm.ListNode),
			}).Accept(seq, r, nil)
			if elem.Err != nil {
				return WithError[*NamedArgNode]{Err: elem.Err}
			}
			//
			list2 := nel.Children()[1]
			seq2 := list2.Children()[1]
			sep := (&Seq[any, WithError[*RuleDetailNode]]{
				Iter: seq2.Children()[0].(goohm.ListNode),
			}).Accept(seq2, r, nil)
			if sep.Err != nil {
				return WithError[*NamedArgNode]{Err: sep.Err}
			}
			ebare, _ := elem.Val.Cast_bare()
			sbare, _ := sep.Val.Cast_bare()
			if len(ebare.Args) != 1 || len(sbare.Args) != 1 {
				return WithError[*NamedArgNode]{
					Err: fmt.Errorf(
						"expected exactly one argument for elem and sep in builtin hor. got %d and %d",
						len(ebare.Args),
						len(sbare.Args),
					),
				}
			}
			return WithError[*NamedArgNode]{Val: new(NamedArgNode(Make_Named(
				hor_name,
				Make_ArgNode_bhor(
					Make_BuiltinHOR(
						hor_name,
						ebare.Args[0],
						sbare.Args[0],
					),
				),
			)))}
		}
		return WithError[*NamedArgNode]{Val: new(NamedArgNode(Make_Named(
			node.Ident.SourceString(),
			Make_ArgNode_nobj(
				Make_NObjNode(),
			),
		)))}
	}
	return WithError[*NamedArgNode]{Val: new(NamedArgNode(Make_Named(
		node.Ident.SourceString(),
		Make_ArgNode_rule(
			Make_NontNode(
				node.Ident.SourceString(),
			),
		),
	)))}
}

// VisitBaseRange implements [VisitorBaseRange].
func (r *ruleAstBuilder) VisitBaseRange(node *BaseRange[any, NamedArgNode], payload any) (result NamedArgNode) {
	return NamedArgNode(Make_Named(
		"rng",
		Make_ArgNode_term(
			Make_TermNode(),
		),
	))
}

// VisitBaseTerminal implements [VisitorBaseTerminal].
func (r *ruleAstBuilder) VisitBaseTerminal(node *BaseTerminal[any, NamedArgNode], payload any) (result NamedArgNode) {
	return NamedArgNode(Make_Named(
		"term",
		Make_ArgNode_term(
			Make_TermNode(),
		),
	))
}

// VisitBaseParen implements [VisitorBaseParen].
func (r *ruleAstBuilder) VisitBaseParen(node *BaseParen[any, NamedArgNode], payload any) (result NamedArgNode) {
	return NamedArgNode(Make_Named(
		"alt",
		Make_ArgNode_nobj(
			Make_NObjNode(),
		),
	))
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
	_ VisitorGrammars[any, WithError[*GrammarsNode]]             = (*ruleAstBuilder)(nil)
	_ VisitorGrammar[any, WithError[*GrammarNode]]               = (*ruleAstBuilder)(nil)
	_ VisitorRule[any, WithError[[]RuleNode]]                    = (*ruleAstBuilder)(nil)
	_ VisitorRuleDefine[string, WithError[[]RuleNode]]           = (*ruleAstBuilder)(nil)
	_ VisitorLexRuleDescr[any, string]                           = (*ruleAstBuilder)(nil)
	_ VisitorRuleExtend[string, WithError[[]RuleNode]]           = (*ruleAstBuilder)(nil)
	_ VisitorRuleBody[any, WithError[[]RuleDetailNode]]          = (*ruleAstBuilder)(nil)
	_ VisitorTopLevelTerm[any, WithError[*RuleDetailNode]]       = (*ruleAstBuilder)(nil)
	_ VisitorTopLevelTermInline[any, WithError[*RuleDetailNode]] = (*ruleAstBuilder)(nil)
	_ VisitorSeq[any, WithError[*RuleDetailNode]]                = (*ruleAstBuilder)(nil)
	_ VisitorIter[any, WithError[*NamedArgNode]]                 = (*ruleAstBuilder)(nil)
	_ VisitorIterStar[any, WithError[*NamedArgNode]]             = (*ruleAstBuilder)(nil)
	_ VisitorIterPlus[any, WithError[*NamedArgNode]]             = (*ruleAstBuilder)(nil)
	_ VisitorIterOpt[any, WithError[*NamedArgNode]]              = (*ruleAstBuilder)(nil)
	_ VisitorPred[any, WithError[*NamedArgNode]]                 = (*ruleAstBuilder)(nil)
	_ VisitorLex[any, WithError[*NamedArgNode]]                  = (*ruleAstBuilder)(nil)
	_ VisitorLexLex[any, WithError[*NamedArgNode]]               = (*ruleAstBuilder)(nil)
	_ VisitorBase[any, WithError[*NamedArgNode]]                 = (*ruleAstBuilder)(nil)
	_ VisitorBaseApplication[any, WithError[*NamedArgNode]]      = (*ruleAstBuilder)(nil)
	_ VisitorBaseRange[any, NamedArgNode]                        = (*ruleAstBuilder)(nil)
	_ VisitorBaseTerminal[any, NamedArgNode]                     = (*ruleAstBuilder)(nil)
	_ VisitorBaseParen[any, NamedArgNode]                        = (*ruleAstBuilder)(nil)
)
