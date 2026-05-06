package main

import (
	"fmt"
	"os"

	"github.com/jpillora/opts"
	"github.com/ohmjs/ohmgo/gencmd"
)

var (
	rootCmd = &struct{}{}
	builder = opts.New(rootCmd).
		Name("ohmgo").
		EmbedGlobalFlagSet().
		Complete()
)

func init() {
	builder.AddCommand(opts.New(&struct{}{}).Name("generate").
		AddCommand(opts.New(gencmd.NewGenCmdCmd()).Name("command").
			Summary("Generate a command, in the specified format (default is 'command') to compile a .ohm grammar file using the ohmjs/ohm docker image. Does not actually compile the file.")),
	)
}

//go:generate go run github.com/jpillora/md-tmpl -w README.md

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
