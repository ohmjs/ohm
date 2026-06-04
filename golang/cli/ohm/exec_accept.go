package ohm

import (
	"context"
	"fmt"
	"os"

	"github.com/ohmjs/goohm"
	"github.com/ohmjs/ohmgo/utils"
)

type execeriseGenedCmd struct {
	Grammar string `opts:"mode=arg" help:"Path to .ohm grammar file to generate a visitor for."`
}

func NewExerciseGenedCmd() *execeriseGenedCmd {
	return &execeriseGenedCmd{}
}

func (cm *execeriseGenedCmd) Run() error {
	if cm.Grammar[:1] == "@" {
		barr, err := os.ReadFile(cm.Grammar[1:])
		if err != nil {
			return fmt.Errorf("Error reading grammar file. %[1]v", err)
		}
		cm.Grammar = string(barr)
	}
	ctx := context.Background()
	var (
		gmr  *goohm.Grammar
		mr   *goohm.MatchResult
		err  error
		root goohm.Node
	)
	if gmr, err = goohm.NewGrammar(ctx, utils.OhmGrammarWasmBytes()); err != nil {
		return fmt.Errorf("creating grammar: %[1]v", err)
	}
	defer gmr.Close()
	if mr, err = gmr.Match(cm.Grammar); err != nil {
		return fmt.Errorf("matching: %[1]v", err)
	}
	defer mr.Close()
	if !mr.Succeeded() {
		return fmt.Errorf("match failed")
	}
	if root, err = mr.GetCstRoot(); err != nil {
		return fmt.Errorf("Error getting cst root. %[1]v", err)
	}
	gmrs := &Grammars[any, any]{
		Grammar: root.Children()[0].(goohm.ListNode),
	}
	v := &v{}
	gmrs.Accept(root, v, nil)
	return nil
}

type v struct {
}

// BuiltInRule implements [goohm.BuiltinVisitor].
func (v *v) BuiltInRule(node goohm.Node) {
	fmt.Printf("%s", node.SourceString())
}

// Terminal implements [goohm.TerminalVisitor].
func (v *v) Terminal(node goohm.TerminalNode) {
	fmt.Printf("%s", node.SourceString())
}

var (
	_ goohm.TerminalVisitor = (*v)(nil)
	_ goohm.BuiltinVisitor  = (*v)(nil)
)
