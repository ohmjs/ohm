package sexpr

import (
	"context"
	"fmt"
	"os"
	"strings"

	"github.com/ohmjs/goohm"
	"github.com/ohmjs/ohmgo/utils"
	"github.com/samber/lo"
)

type ToSexprCmd struct {
	ExcludeTerminals   bool   `opts:"short=t"`
	SyntacticRulesOnly bool   `opts:"short=S"`
	ExcludeBuiltin     bool   `opts:"short=b"`
	PruneLists         bool   `opts:"short=l"`
	NoClosingNewline   bool   `opts:"short=n"`
	Verbose            bool   `opts:"short=v" help:"Output source (start & end) and source string for every node"`
	Grammar            string `opts:"mode=arg" help:"Grammar text, if starts with @ Path to .ohm grammar file to generate a visitor for."`
}

var builtins = map[string]struct{}{
	"any":      {},
	"letter":   {},
	"lower":    {},
	"upper":    {},
	"digit":    {},
	"hexDigit": {},
	"alnum":    {},
	"space":    {},
	"end":      {},
}

func NewToSexprCmd() *ToSexprCmd {
	return &ToSexprCmd{}
}

func (vc *ToSexprCmd) Run() error {
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

func (vc *ToSexprCmd) Process() (string, error) {
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
	var result strings.Builder
	vc.toSexprNode(root, 0, &result)
	return result.String()[1:], nil
}

func (vc *ToSexprCmd) toSexprNode(node goohm.Node, depth int, result *strings.Builder) {
	kids := node.Children()
	if vc.ExcludeTerminals {
		kids = lo.Filter(kids, func(node goohm.Node, i int) bool {
			_, is := node.(goohm.TerminalNode)
			return !is
		})
	}
	if vc.SyntacticRulesOnly {
		kids = lo.Filter(kids, func(node goohm.Node, i int) bool {
			ctor := node.CtorName()
			return strings.ToUpper(ctor[:1]) == ctor[:1]
		})
	}
	if vc.ExcludeBuiltin {
		kids = lo.Filter(kids, func(node goohm.Node, i int) bool {
			ctor := node.CtorName()
			_, ex := builtins[ctor]
			return !ex
		})
	}
	ctor := node.CtorName()
	if vc.PruneLists && ctor == "_list" {
		for _, n := range kids {
			vc.toSexprNode(n, depth, result)
		}
		return
	}
	switch {
	case len(kids) != 0:
		result.WriteString("\n")
		result.WriteString(strings.Repeat("  ", depth))
		result.WriteString("(")
		result.WriteString(ctor)
		if vc.Verbose {
			s, f := node.Source()
			result.WriteString(fmt.Sprintf(" %d-%d ", s, f))
			src := node.SourceString()
			src = sexprStrEncode(src)
			if len(src) > 40 {
				src = src[:37] + "..."
			}
			result.WriteString("'" + src + "'")
		}
	case ctor == "_terminal":
		result.WriteString(" (")
		result.WriteString(ctor)
	default:
		result.WriteString(" ")
		result.WriteString(ctor)
	}

	if ctor == "_terminal" {
		addTerm(node, result)
	}
	for _, n := range kids {
		vc.toSexprNode(n, depth+1, result)
	}
	switch {
	case len(kids) != 0:
		if !vc.NoClosingNewline {
			result.WriteString("\n")
			result.WriteString(strings.Repeat("  ", depth))
		}
		result.WriteString(")")
	case ctor == "_terminal":
		result.WriteString(")")
	}
}

func addTerm(node goohm.Node, result *strings.Builder) {
	val := node.SourceString()
	switch val {
	case "\n":
		result.WriteString(" NL")
	case "(":
		result.WriteString(" OP")
	case ")":
		result.WriteString(" CP")
	case "{":
		result.WriteString(" OC")
	case "}":
		result.WriteString(" CC")
	default:
		result.WriteString(" '")
		result.WriteString(val)
		result.WriteString("'")
	}
	result.WriteString(" ")
	s, f := node.Source()
	result.WriteString(fmt.Sprintf("%d-%d", s, f))
}

func sexprStrEncode(val string) string {
	val = strings.ReplaceAll(val, "\n", "\\n")
	val = strings.ReplaceAll(val, "(", "OP")
	val = strings.ReplaceAll(val, ")", "CP")
	val = strings.ReplaceAll(val, "{", "OC")
	val = strings.ReplaceAll(val, "}", "CC")
	return val
}
