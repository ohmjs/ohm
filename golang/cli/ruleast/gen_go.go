package ruleast

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/ohmjs/goohm"
	"github.com/ohmjs/ohmgo/utils"
)

type genGoCmd struct {
	GenCmd    genCmd `opts:"mode=embedded"`
	OutputDir string `help:"Output directory for generated files.\nDefaults to go-type-package, which defaults to the lowercase grammar name."`
}

func NewGenGoCmd() *genGoCmd {
	return &genGoCmd{
		GenCmd: genCmd{
			GoRuntimeImport:  "github.com/ohmjs/goohm",
			GoRuntimePackage: "goohm",
			// sbldr:             &strings.Builder{},
			// SuffixOutfLineNos: true,
		},
	}
}

func (vc *genGoCmd) Run() error {
	if vc.GenCmd.GoTypePackage != "" && vc.OutputDir == "" {
		vc.OutputDir = vc.GenCmd.GoTypePackage
	}
	ctx := context.Background()
	var (
		gmr  *goohm.Grammar
		mr   *goohm.MatchResult
		err  error
		root goohm.Node
	)
	if vc.GenCmd.Grammar[:1] == "@" {
		barr, err := os.ReadFile(vc.GenCmd.Grammar[1:])
		if err != nil {
			return fmt.Errorf("Error reading grammar file. %[1]v", err)
		}
		vc.GenCmd.Grammar = string(barr)
	}
	if gmr, err = goohm.NewGrammar(ctx, utils.OhmGrammarWasmBytes()); err != nil {
		return fmt.Errorf("creating grammar: %[1]v", err)
	}
	defer gmr.Close()
	if mr, err = gmr.Match(vc.GenCmd.Grammar); err != nil {
		return fmt.Errorf("matching: %[1]v", err)
	}
	defer mr.Close()
	if !mr.Succeeded() {
		return fmt.Errorf("match failed")
	}
	if root, err = mr.GetCstRoot(); err != nil {
		return fmt.Errorf("Error getting cst root. %[1]v", err)
	}
	gmrsAst, err := NewBuildGrammars(root).BuildRuleAst(root)
	if err != nil {
		return fmt.Errorf("Error building rule ast. %[1]v", err)
	}
	if len(gmrsAst.Gmr_names) > 1 {
		if vc.GenCmd.GrammarName == "" {
			return fmt.Errorf("For files with multiple grammars, the --grammar-name flag is required. Found grammars '%v", gmrsAst.Gmr_names)
		}
	}
	if vc.GenCmd.GrammarName != "" {
		if _, ok := gmrsAst.Grammars[vc.GenCmd.GrammarName]; !ok {
			return fmt.Errorf("grammar-name not found. Asked for '%s', grammar names are '%v'", vc.GenCmd.GrammarName, gmrsAst.Gmr_names)
		}
	}
	if vc.OutputDir == "" {
		vc.OutputDir = strings.ToLower(gmrsAst.Gmr_names[0])
	}
	if err = os.MkdirAll(vc.OutputDir, os.ModePerm); err != nil {
		return fmt.Errorf("creating output directory: %[1]v", err)
	}
	//
	types_sb := &strings.Builder{}
	vc.GenCmd.sbldr = types_sb
	types := &genTypesCmd{
		GenCmd:     vc.GenCmd,
		OutputFile: filepath.Join(vc.OutputDir, "types.go"),
		gmrsAst:    *gmrsAst,
	}
	gmrsAst.GenGoTypes(types)
	//
	inter_sb := &strings.Builder{}
	vc.GenCmd.sbldr = inter_sb
	inter := &genInterfaceCmd{
		GenCmd:     vc.GenCmd,
		OutputFile: filepath.Join(vc.OutputDir, "interfaces.go"),
		gmrsAst:    *gmrsAst,
	}
	gmrsAst.GenGoInterfaces(inter)
	//
	accepts_sb := &strings.Builder{}
	vc.GenCmd.sbldr = accepts_sb
	accepts := &genAcceptsCmd{
		GenCmd:     vc.GenCmd,
		OutputFile: filepath.Join(vc.OutputDir, "accepts.go"),
		gmrsAst:    *gmrsAst,
	}
	gmrsAst.GenGoAccepts(accepts)
	//
	if typesFile, err := os.Create(types.OutputFile); err != nil {
		return fmt.Errorf("creating file: %[1]v", err)
	} else {
		defer typesFile.Close()
		if _, err = typesFile.WriteString(types_sb.String()); err != nil {
			return fmt.Errorf("writing file: %[1]v", err)
		}
		fmt.Fprintf(os.Stderr, "wrote %s\n", types.OutputFile)
	}
	if interFile, err := os.Create(inter.OutputFile); err != nil {
		return fmt.Errorf("creating file: %[1]v", err)
	} else {
		defer interFile.Close()
		if _, err = interFile.WriteString(inter_sb.String()); err != nil {
			return fmt.Errorf("writing file: %[1]v", err)
		}
		fmt.Fprintf(os.Stderr, "wrote %s\n", inter.OutputFile)
	}
	if acceptsFile, err := os.Create(accepts.OutputFile); err != nil {
		return fmt.Errorf("creating file: %[1]v", err)
	} else {
		defer acceptsFile.Close()
		if _, err = acceptsFile.WriteString(accepts_sb.String()); err != nil {
			return fmt.Errorf("writing file: %[1]v", err)
		}
		fmt.Fprintf(os.Stderr, "wrote %s\n", accepts.OutputFile)
	}
	return nil
}
