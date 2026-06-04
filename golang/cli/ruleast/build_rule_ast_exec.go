package ruleast

import (
	"context"
	_ "embed"
	"fmt"
	"os"
	"runtime"
	"strings"

	"github.com/ohmjs/goohm"
	"github.com/ohmjs/ohmgo/utils"
)

type RuleAstCmd struct {
	SkipSource        bool   `opts:"short=s"`
	SuffixOutfLineNos bool   `opts:"short=l"`
	Grammar           string `opts:"mode=arg" help:"Path to .ohm grammar file to generate a visitor for."`

	sbldr *strings.Builder
}

func NewRuleAstCmd() *RuleAstCmd {
	return &RuleAstCmd{
		sbldr: &strings.Builder{},
	}
}

func (vc *RuleAstCmd) outf(format string, a ...any) {
	_, file, line, _ := runtime.Caller(1) // for line numbers to be correct when SuffixOutfLineNos is true
	parts := strings.Split(file, "/")
	parts = parts[len(parts)-2:]
	file = strings.Join(parts, "/")
	callerLine := fmt.Sprintf("%s:%d", file, line)
	f0 := format
	if vc.SuffixOutfLineNos {
		f0 = strings.ReplaceAll(format, "\n", fmt.Sprintf(" // %%[%d]s\n", len(a)+1))
		a = append(a, callerLine)
	}
	fmt.Fprintf(vc.sbldr, f0, a...)
}

func (vc *RuleAstCmd) Run() error {
	if vc.Grammar[:1] == "@" {
		barr, err := os.ReadFile(vc.Grammar[1:])
		if err != nil {
			return fmt.Errorf("Error reading grammar file. %v", err)
		}
		vc.Grammar = string(barr)
	}
	out, err := vc.Process()
	if err != nil {
		return err
	}
	fmt.Printf("%s\n", out)
	return nil
}

func (vc *RuleAstCmd) Process() (string, error) {
	vc.sbldr = &strings.Builder{}
	ctx := context.Background()
	var (
		gmr  *goohm.Grammar
		mr   *goohm.MatchResult
		err  error
		root goohm.Node
	)
	if gmr, err = goohm.NewGrammar(ctx, utils.OhmGrammarWasmBytes()); err != nil {
		return "", fmt.Errorf("creating grammar: %v", err)
	}
	defer gmr.Close()
	if mr, err = gmr.Match(vc.Grammar); err != nil {
		return "", fmt.Errorf("matching: %v", err)
	}
	defer mr.Close()
	if !mr.Succeeded() {
		return "", fmt.Errorf("match failed")
	}
	if root, err = mr.GetCstRoot(); err != nil {
		return "", fmt.Errorf("Error getting cst root. %v", err)
	}
	gAst, err := NewBuildGrammars(root).BuildRuleAst(root)
	if err != nil {
		return "", err
	}
	for _, k := range gAst.Gmr_names {
		v := gAst.Grammars[k]
		vc.outf("%[1]s\n", k)
		for _, name := range v.Rule_names {
			rule0 := v.Rules[name]
			branch := rule0.GetBranch()
			descr := branch.Descr("(", ") ")
			Handle_RuleNode[any](
				rule0,
				func(rule BareRuleNode) any {
					if !vc.SkipSource {
						vc.outf("```\n%[1]s\n```\n", rule._BareRuleNode.Source)
					}
					vc.outf("%[1]s @bare %[2]s{\n", rule.RuleName(), descr)
					for _, a := range rule.Args {
						vc.outf("  %[1]s %+[2]v\n", strings.ToLower(a.Name[:1])+a.Name[1:], argNodeStr(a.Node))
					}
					vc.outf("}\n")
					return nil
				},
				func(rule VirtRuleNode) any {
					if !vc.SkipSource {
						vc.outf("```\n%s\n```\n", rule.Node._BareRuleNode.Source)
					}
					vc.outf("%[1]s @virt %[2]s %[3]s{\n", rule._Named.Name, rule.Node._BareRuleNode.Name, descr)
					for _, a := range rule.Node.Args {
						vc.outf("  %[1]s %+[2]v\n", strings.ToLower(a.Name[:1])+a.Name[1:], argNodeStr(a.Node))
					}
					vc.outf("}\n")
					return nil
				},
				func(rule CasesRuleNode) any {
					if !vc.SkipSource {
						vc.outf("```\n%[1]s\n```\n", rule._CasesRuleNode.Source)
					}
					vc.outf("%[1]s @cases %[2]s{\n", rule.RuleName(), descr)
					for _, c := range rule.Cases {
						vc.outf("  %[1]s @inline\n", c.Case_name)
					}
					for _, a := range rule.Args {
						vc.outf("  %[1]s %+[2]v\n", strings.ToLower(a.Name[:1])+a.Name[1:], argNodeStr(a.Node))
					}
					vc.outf("}\n")
					return nil
				},
				nil,
			)
		}
	}
	return vc.sbldr.String(), nil
}

func argNodeStr(arg ArgNode) string {
	return Handle_ArgNode[string](
		arg,
		func(nobj NObjNode) string {
			return "@node"
		},
		func(rule NontNode) string {
			return "@rule " + rule.Rule
		},
		func(term TermNode) string {
			return "@term"
		},
		func(list ListNode) string {
			return "@list " + argNodeStr(list.Elem)
		},
		func(opt OptNode) string {
			return "@opt " + argNodeStr(opt.Elem)
		},
		func(bhor BuiltinHOR) string {
			return fmt.Sprintf("@hor %s<%s, %s>",
				bhor.List_type,
				argNodeStr(bhor.Elem.Node),
				argNodeStr(bhor.Sep.Node),
			)
		},
		nil,
	)
}
