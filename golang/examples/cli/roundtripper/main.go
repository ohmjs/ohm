package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/jpillora/opts"

	"github.com/ohmjs/goohm"
)

func main() {
	cli, err := opts.New(&roundtripperCmd{}).
		Name("roundtripper").
		EmbedGlobalFlagSet().
		Complete().
		ParseArgsError(os.Args)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%[2]s\nError: %[1]v\n\n", err, cli.Selected().Help())
		os.Exit(3)
	}
	err = cli.Run()
	if err != nil {
		fmt.Fprintf(os.Stderr, "%[2]s\nError: %[1]v\n\n", err, cli.Selected().Help())
		os.Exit(2)
	}
}

type roundtripperCmd struct {
	WasmFile  string
	InputText string
}

func (rtc *roundtripperCmd) Run() error {
	if rtc.WasmFile == "" || rtc.InputText == "" {
		return fmt.Errorf("wasm file path and input text are required")
	}
	fmt.Println("Ohm WebAssembly Matcher - Go Implementation")
	ctx := context.Background()
	wasmBytes, err := os.ReadFile(rtc.WasmFile)
	if err != nil {
		log.Fatalf("reading wasm file: %v", err)
	}
	g, err := goohm.NewGrammar(ctx, wasmBytes)
	if err != nil {
		log.Fatalf("instantiating grammar: %v", err)
	}
	defer g.Close()
	result, err := g.Match(string(rtc.InputText))
	if err != nil {
		log.Fatalf("matching: %v", err)
	}
	defer result.Close()
	if !result.Succeeded() {
		log.Printf("match failed")
		os.Exit(1)
	}
	fmt.Println("Match succeeded")
	nodes, err := result.GetAllBindings()
	if err != nil {
		log.Fatalf("getting bindings: %v", err)
	}
	unparsed := unparseAll(nodes)
	log.Printf("unparsed: '%s'", unparsed)

	node, err := result.GetCstRoot()
	if err != nil {
		fmt.Printf("GetCstRoot error: %v\n", err)
		os.Exit(1)
	}

	var resultStr strings.Builder
	fmt.Printf("root --------------------\n")
	unparseNode(node, &resultStr)
	fmt.Printf("'%s'\n", resultStr.String())
	return nil
}

// unparseAll walks all binding nodes and reconstructs the full input text.
func unparseAll(nodes []*goohm.CstNode) string {
	for i, node := range nodes {
		var result strings.Builder
		fmt.Printf("%d --------------------\n", i)
		unparseNode(node, &result)
		fmt.Printf("'%s'\n", result.String())
	}
	return ""
}

func unparseNode(node *goohm.CstNode, result *strings.Builder) {
	s, f := node.Source()
	// if node.MatchLength() != 0 {
	fmt.Printf("type: %d ", node.Type())
	fmt.Printf("num children:%3d ", node.NumChildren())
	fmt.Printf("length:%3d start:%3d end:%3d ", node.MatchLength(), s, f)
	fmt.Printf("name: %20v value: %s\n",
		node.CtorName(),
		node.Value(),
	)
	// }
	if node.IsTerminal() {
		result.WriteString(node.Value())
		return
	}
	for _, child := range node.Children() {
		unparseNode(child, result)
	}
}
