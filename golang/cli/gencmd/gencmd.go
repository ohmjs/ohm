package gencmd

import (
	"fmt"
	"strings"

	"github.com/ohmjs/goohm"
)

type genCmdCmd struct {
	Debug       bool
	DockerTag   string `opts:"short=t" help:"The version tag of the ohmjs/ohm docker image to use in the generated command. Defaults to the version of the goohm runtime included in this cli."`
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

func NewGenCmdCmd() *genCmdCmd {
	return &genCmdCmd{
		Format:    format("command"),
		DockerTag: ((*goohm.Grammar)(nil)).MatchingDockerImageTags()[0],
	}
}

func (c *genCmdCmd) Run() error {
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

	switch c.Format {
	case "command":
		fmt.Printf(`
# To generate a .wasm file for use with this version of the runtime, run:
docker run --rm -v "$PWD":/local ohmjs/ohm:%s compile %s%s%s%s
`, c.DockerTag, debug, grammar, output, c.SourceFile)
	case "go_generate":
		fmt.Printf(`
//go:generate docker run --rm -v $PWD:/local ohmjs/ohm:%s compile %s%s%s%s
`, c.DockerTag, debug, grammar, output, c.SourceFile)
	case "script":
		fmt.Printf(`#!/bin/sh

docker run --rm -v "$PWD":/local ohmjs/ohm:%s compile %s%s%s%s
`, c.DockerTag, debug, grammar, output, c.SourceFile)
	default:
		return fmt.Errorf("invalid format: %s", c.Format)
	}
	return nil
}
