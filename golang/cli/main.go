package main

//go:generate go run github.com/jpillora/md-tmpl -w README.md
//go:generate go generate ./utils

import (
	"fmt"
	"os"

	"github.com/jpillora/opts"
	"github.com/ohmjs/ohmgo/candp"
	"github.com/ohmjs/ohmgo/gencmd"
	"github.com/ohmjs/ohmgo/ohm"
	"github.com/ohmjs/ohmgo/ohm_rules"
	"github.com/ohmjs/ohmgo/ruleast"
	"github.com/ohmjs/ohmgo/sexpr"
	"github.com/ohmjs/ohmgo/tests"
)

var (
	rootCmd = &struct{}{}
	builder = opts.New(rootCmd).
		Name("ohmgo").
		EmbedGlobalFlagSet().
		Complete()
)

func init() {
	parts := opts.New(&struct{}{}).Name("parts")
	types := opts.New(ruleast.NewGenTypesCmd()).Name("go_types")
	interfaces := opts.New(ruleast.NewGenInterfaceCmd()).Name("go_interfaces")
	accepts := opts.New(ruleast.NewGenAcceptsCmd()).Name("go_accepts")
	parts.
		AddCommand(types).
		AddCommand(interfaces).
		AddCommand(accepts)

	command := opts.New(gencmd.NewGenCmdCmd()).Name("command").
		Summary("Generate a command, in the specified format (default is 'command') to compile a .ohm grammar file using the ohmjs/ohm docker image. Does not actually compile the file.")
	gogen := opts.New(ruleast.NewGenGoCmd()).Name("go").
		Summary("Generate golang visitor interfaces and helper methods for this provided grammar. The 'family visitor' flavour (ie with an extra swappable receive) is implementated, with easy storage of payloads & results in the call stack.")

	generate := opts.New(&struct{}{}).Name("generate")
	generate.
		AddCommand(command).
		AddCommand(parts).
		AddCommand(gogen)

	test := opts.New(&struct{}{}).Name("test")
	exec_accept := opts.New(ohm.NewExerciseGenedCmd()).Name("exec_accept")
	rule_ast := opts.New(ruleast.NewRuleAstCmd()).Name("rule_ast")
	c_and_p := opts.New(candp.NewCompileAndParseCmd()).Name("c_and_p")
	to_sexpr := opts.New(sexpr.NewToSexprCmd()).Name("to_sexpr")
	txtar := opts.New(tests.NewTestGmrCmd()).Name("txtar")
	test.
		AddCommand(exec_accept).
		AddCommand(rule_ast).
		AddCommand(c_and_p).
		AddCommand(to_sexpr).
		AddCommand(txtar)

	cr := opts.New(ohm_rules.NewBuildRuleAstCmd()).Name("collect_rule")
	builder.AddCommand(cr)

	builder.AddCommand(test)
	builder.AddCommand(generate)

}

func main() {
	var (
		cli opts.ParsedOpts
		err error
	)
	cli, err = builder.ParseArgsError(os.Args)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%[1]v", err)
		os.Exit(1)
	}
	// cli = builder.ParseArgs(os.Args)
	err = cli.Run()
	if err != nil {
		fmt.Fprintf(os.Stderr, "%[2]s\nError: %[1]v\n\n", err, cli.Selected().Help())
		os.Exit(2)
	}
}
