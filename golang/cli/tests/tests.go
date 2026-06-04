package tests

import (
	_ "embed"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/google/go-cmp/cmp"
	"github.com/ohmjs/ohmgo/candp"
	"github.com/ohmjs/ohmgo/ruleast"
	"github.com/ohmjs/ohmgo/sexpr"
	"golang.org/x/tools/txtar"
)

type testGmrCmd struct {
	ReMatchTest string
	TxTarFile   []string `opts:"mode=arg"`
}

func NewTestGmrCmd() *testGmrCmd {
	return &testGmrCmd{}
}

type Processor interface {
	Process() (string, error)
}

type Expect struct {
	file    txtar.File
	process Processor
}

func (cm *testGmrCmd) Run() error {
	for _, f := range cm.TxTarFile {
		err := cm.TestFile(f)
		if err != nil {
			return err
		}
	}
	return nil
}

func (cm *testGmrCmd) TestFile(txTarFile string) error {
	ar, err := txtar.ParseFile(txTarFile)
	if err != nil {
		return err
	}
	var gmr *txtar.File
	// var gmr *string
	sepxrs := []Expect{}
	candps := map[string][]Expect{}
	txtsMap := map[string]struct {
		GrammarFile string
		Source      string
	}{}
	txtKeys := []string{}
	for _, fi := range ar.Files {
		parts := strings.Split(fi.Name, ".")
		ext := parts[len(parts)-1]
		testName := parts[0]
		if ext != "ohm" && cm.ReMatchTest != "" {
			ok, err := regexp.MatchString(cm.ReMatchTest, testName)
			if err != nil {
				return err
			}
			if !ok {
				continue
			}
		}
		if fi.Name[:1] == "!" {
			fmt.Fprintf(os.Stderr, "skipping %s\n", fi.Name)
			continue
		}
		switch ext {
		case "ohm":
			if gmr != nil {
				panic(fmt.Errorf("only one grammar file per txtar. %v", txTarFile))
			}
			if strings.HasPrefix(fi.Name, "@") {
				data, err := os.ReadFile(fi.Name[1:])
				if err != nil {
					panic(err)
				}
				paths := strings.Split(fi.Name, "/")
				name := strings.TrimPrefix(paths[len(paths)-1], "@")
				gmr = &txtar.File{
					Name: name,
					Data: data,
				}
				continue
			}
			gmr = &fi
		case "sexpr":
			toSexpr := &sexpr.ToSexprCmd{
				Grammar: string(gmr.Data),
			}
			for _, flag := range parts[1 : len(parts)-1] {
				switch flag {
				case "t":
					toSexpr.ExcludeTerminals = true
				case "S":
					toSexpr.SyntacticRulesOnly = true
				case "b":
					toSexpr.ExcludeBuiltin = true
				case "l":
					toSexpr.PruneLists = true
				case "v":
					toSexpr.Verbose = true
				case "n":
					toSexpr.NoClosingNewline = true
				default:
					panic("unkown short flag : " + flag)
				}
			}
			sepxrs = append(sepxrs, Expect{
				file:    fi,
				process: toSexpr,
			})
		case "txt":
			if _, ok := txtsMap[parts[0]]; ok {
				panic(fmt.Errorf("duplicate txt file. %s", parts[0]))
			}
			if gmr == nil {
				panic(fmt.Errorf("expected grammar file before txt file. %v", txTarFile))
			}
			tempdir, err := os.MkdirTemp("", "ohm-compile-*")
			if err != nil {
				return fmt.Errorf("creating tempdir: %v", err)
			}
			gmrp := filepath.Join(tempdir, gmr.Name)
			gmrf, err := os.Create(gmrp)
			if err != nil {
				return fmt.Errorf("creating file: %v", err)
			}
			_, err = gmrf.Write(gmr.Data)
			if err != nil {
				return fmt.Errorf("creating writing: %v", err)
			}
			gmrf.Close()
			defer os.RemoveAll(tempdir)
			txtKeys = append(txtKeys, parts[0])
			txtsMap[parts[0]] = struct {
				GrammarFile string
				Source      string
			}{
				GrammarFile: gmrp,
				Source:      string(fi.Data),
			}
		case "c_and_p":
			if _, ok := txtsMap[parts[0]]; !ok {
				panic(fmt.Errorf("txt file doesn't exist for c and p. %s", parts[0]))
			}
			candp := &candp.CompileAndParseCmd{
				GrammarFile: txtsMap[parts[0]].GrammarFile,
				Source:      txtsMap[parts[0]].Source,
			}
			for _, flag := range parts[1 : len(parts)-1] {
				switch flag {
				case "t":
					candp.ExcludeTerminals = true
				case "S":
					candp.SyntacticRulesOnly = true
				case "b":
					candp.ExcludeBuiltin = true
				case "l":
					candp.PruneLists = true
				case "v":
					candp.Verbose = true
				case "n":
					candp.NoClosingNewline = true
				default:
					panic("unkown short flag : " + flag)
				}
			}
			candps[parts[0]] = append(candps[parts[0]], Expect{
				file:    fi,
				process: candp,
			})
		case "rule_ast":
			if _, ok := txtsMap[parts[0]]; !ok {
				panic(fmt.Errorf("txt file doesn't exist for rule ast. %s", parts[0]))
			}
			rast := &ruleast.RuleAstCmd{
				Grammar: txtsMap[parts[0]].Source,
			}
			for _, flag := range parts[1 : len(parts)-1] {
				switch flag {
				case "s":
					rast.SkipSource = true
				case "l":
					rast.SuffixOutfLineNos = true
				default:
					panic("unkown short flag : " + flag)
				}
			}
			candps[parts[0]] = append(candps[parts[0]], Expect{
				file:    fi,
				process: rast,
			})
		}
	}
	if gmr == nil {
		panic(fmt.Errorf("expected one grammar file per txtar. %v", txTarFile))
	}
	RunTests(txTarFile, gmr, sepxrs)
	for _, f := range txtKeys {
		candp := candps[f]
		RunTests(txTarFile, gmr, candp)
	}
	return nil
}

func RunTests(
	txTarFile string,
	gmr *txtar.File,
	tests []Expect,
) {
	for _, exp := range tests {
		var (
			rec string
			err error
		)
		rec, err = exp.process.Process()
		if err != nil {
			fmt.Fprintf(os.Stderr, "gen result error for %s, err : %v\n", exp.file.Name, err)
			fmt.Fprintf(os.Stderr, " gmr '%s'\n", string(gmr.Data))
			fmt.Fprintf(os.Stderr, " text '%s'\n'%s'\n", exp.file.Name, string(exp.file.Data))
			continue
		}
		expected := strings.TrimSpace(string(exp.file.Data))
		received := strings.TrimSpace(rec)
		if expected != received {
			fmt.Fprintf(os.Stderr, "! vv sexpr doesn't match %s %s\n", txTarFile, exp.file.Name)
			fmt.Fprintf(os.Stderr, "expected:\n")
			fmt.Fprintf(os.Stderr, "%s\n", expected)
			fmt.Fprintf(os.Stderr, "received:\n")
			fmt.Fprintf(os.Stdout, "%s\n", received)
			fmt.Fprintf(os.Stderr, "diff    :\n%s\n", cmp.Diff(expected, received))
			fmt.Fprintf(os.Stderr, "! ^^ sexpr doesn't match %s %s\n", txTarFile, exp.file.Name)
		} else {
			fmt.Fprintf(os.Stderr, "+ matches %s %s\n", txTarFile, exp.file.Name)
		}
	}
}
