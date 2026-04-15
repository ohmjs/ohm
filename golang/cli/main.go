package main

import (
	"fmt"
	"os"
	"strings"

	"github.com/jpillora/opts"
	"github.com/ohmjs/goohm"
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
		AddCommand(opts.New(NewGenGeneCmd()).Name("generate")),
	)
}

func main() {
	cli, err := builder.ParseArgsError(os.Args)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%[1]v\n\n", err)
		os.Exit(3)
	}
	err = cli.Run()
	if err != nil {
		fmt.Fprintf(os.Stderr, "%[2]s\nError: %[1]v\n\n", err, cli.Selected().Help())
		os.Exit(2)
	}
}

type genGeneCmd struct {
	Debug       bool
	GrammarName string
	Output      string
	Format      format `help:"Output format. One of: command, go_generate, script."`
	SourceFile  string `opts:"mode=arg" help:"Path to .ohm grammar file to compile."`
}

type format string

var validFormats = []string{"command", "go_generate", "script"}

func (format) Complete(s string) []string {
	return validFormats
}

func (e *format) Set(s string) error {
	for _, v := range validFormats {
		if s == v {
			*e = format(s)
			return nil
		}
	}
	return fmt.Errorf("must be one of: %v", strings.Join(validFormats, ", "))
}

func NewGenGeneCmd() *genGeneCmd {
	return &genGeneCmd{
		Format: format("command"),
	}
}

func (c *genGeneCmd) Run() error {
	var (
		debug   = ""
		grammar = ""
		output  = ""
	)
	if c.Debug {
		debug = "--debug "
	}
	if c.GrammarName != "" {
		grammar = fmt.Sprintf("--grammarName %s ", c.GrammarName)
	}
	if c.Output != "" {
		output = fmt.Sprintf("--output %s ", c.Output)
	}

	dockerTag := ((*goohm.Grammar)(nil)).MatchingDockerImageTags()[0]
	switch c.Format {
	case "command":
		fmt.Printf(`To generate a .wasm file for use with this version of the runtime, run:
docker run --rm -v "$PWD":/local ohmjs/ohm:%s compile %s%s%s%s
`, dockerTag, debug, grammar, output, c.SourceFile)
	case "go_generate":
		fmt.Printf(`//go:generate docker run --rm -v $PWD:/local ohmjs/ohm:%s compile %s%s%s%s
`, dockerTag, debug, grammar, output, c.SourceFile)
	case "script":
		fmt.Printf(`#!/bin/sh

docker run --rm -v "$PWD":/local ohmjs/ohm:%s compile %s%s%s%s
`, dockerTag, debug, grammar, output, c.SourceFile)
	default:
		return fmt.Errorf("invalid format: %s", c.Format)
	}
	return nil
}
