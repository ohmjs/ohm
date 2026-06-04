package candp

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/ohmjs/goohm"
	"github.com/samber/lo"
)

type CompileAndParseCmd struct {
	KeepWasm           bool   `opts:"short=K"`
	ExcludeTerminals   bool   `opts:"short=t"`
	SyntacticRulesOnly bool   `opts:"short=S"`
	ExcludeBuiltin     bool   `opts:"short=b"`
	PruneLists         bool   `opts:"short=l"`
	NoClosingNewline   bool   `opts:"short=n"`
	Verbose            bool   `opts:"short=v" help:"Output source (start & end) and source string for every node"`
	GrammarFile        string `opts:"mode=arg"`
	Source             string `opts:"mode=arg"`
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

func NewCompileAndParseCmd() *CompileAndParseCmd {
	return &CompileAndParseCmd{}
}

func (vc *CompileAndParseCmd) Run() error {
	if len(vc.Source) > 2 && vc.Source[:1] == "@" {
		barr, err := os.ReadFile(vc.Source[1:])
		if err != nil {
			return fmt.Errorf("Error reading grammar file. %v", err)
		}
		vc.Source = string(barr)
	}
	out, err := vc.Process()
	if err != nil {
		return err
	}
	fmt.Printf("%s\n", out)
	return nil
}

func (vc *CompileAndParseCmd) Process() (string, error) {
	// create a tempdir, get the absolute path of the directory GrammarFile is in
	// run `docker run --rm -v "<basedir>:/local" -v "<tempdir>:/dst" ohmjs/ohm:18.0.0-beta.15 compile GrammarFile`
	tempdir, err := os.MkdirTemp("", "ohm-compile-*")
	if err != nil {
		return "", fmt.Errorf("creating tempdir: %v", err)
	}
	if !vc.KeepWasm {
		defer os.RemoveAll(tempdir)
	} else {
		fmt.Fprintf(os.Stderr, "working dir %s\n", tempdir)
	}
	absGrammarPath, err := filepath.Abs(vc.GrammarFile)
	if err != nil {
		return "", fmt.Errorf("resolving grammar file path: %v", err)
	}
	basedir := filepath.Dir(absGrammarPath)
	grammarBasename := filepath.Base(absGrammarPath)
	dockerTag := ((*goohm.Grammar)(nil)).MatchingDockerImageTags()[0]
	cmd := exec.Command("docker", "run", "--rm",
		"-v", fmt.Sprintf("%s:/local", basedir),
		"-v", fmt.Sprintf("%s:/dst", tempdir),
		fmt.Sprintf("ohmjs/ohm:%s", dockerTag),
		"compile", grammarBasename,
	)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("docker compile: %v", err)
	}
	// get the basename of GrammarFile without the extension
	// read <tempdir>/<basename>.wasm
	baseNoExt := strings.TrimSuffix(grammarBasename, filepath.Ext(grammarBasename))
	wasmPath := filepath.Join(tempdir, baseNoExt+".wasm")
	wasmBytes, err := os.ReadFile(wasmPath)
	if err != nil {
		return "", fmt.Errorf("reading compiled wasm at %s: %v", wasmPath, err)
	}
	ctx := context.Background()
	var (
		gmr  *goohm.Grammar
		mr   *goohm.MatchResult
		root goohm.Node
	)
	if gmr, err = goohm.NewGrammar(ctx, wasmBytes); err != nil {
		return "", fmt.Errorf("creating grammar: %v", err)
	}
	defer gmr.Close()
	if mr, err = gmr.Match(vc.Source); err != nil {
		return "", fmt.Errorf("matching: %v", err)
	}
	defer mr.Close()
	if !mr.Succeeded() {
		return "", fmt.Errorf("match failed for grammar\n'%s'\nsource\n'%s'\n", vc.GrammarFile, vc.Source)
	}
	if root, err = mr.GetCstRoot(); err != nil {
		return "", fmt.Errorf("Error getting cst root. %v", err)
	}
	var result strings.Builder
	vc.toSexprNode(root, 0, &result)
	return result.String()[1:], nil
}

func (vc *CompileAndParseCmd) toSexprNode(node goohm.Node, depth int, result *strings.Builder) {
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
			result.WriteString("'")
			result.WriteString(src)
			result.WriteString("'")
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
	case "\t":
		result.WriteString(" TAB")
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
	val = strings.ReplaceAll(val, "\t", "\\t")
	val = strings.ReplaceAll(val, "\n", "\\n")
	val = strings.ReplaceAll(val, "(", "OP")
	val = strings.ReplaceAll(val, ")", "CP")
	val = strings.ReplaceAll(val, "{", "OC")
	val = strings.ReplaceAll(val, "}", "CC")
	return val
}
