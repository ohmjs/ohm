package ruleast

import (
	"fmt"
	"runtime"
	"strings"
)

type genCmd struct {
	Grammar           string `opts:"mode=arg" help:"Path to .ohm grammar file to generate a visitor for."`
	GoTypePackage     string `opts:"short=P" help:"The package name for the generated code, default to lower case of the grammar"`
	GoRuntimeImport   string
	GoRuntimePackage  string
	SuffixOutfLineNos bool `opts:"short=l"`

	sbldr *strings.Builder
}

func (vc genCmd) outf(format string, a ...any) {
	_, file, line, _ := runtime.Caller(1) // for line numbers to be correct when SuffixOutfLineNos is true
	parts := strings.Split(file, "/")
	parts = parts[len(parts)-2:]
	file = strings.Join(parts, "/")
	callerLine := fmt.Sprintf("%s:%d", file, line)
	f0 := format
	if vc.SuffixOutfLineNos {
		f0 = strings.ReplaceAll(format, "\n", fmt.Sprintf("\t\t\t\t\t// %%[%d]s\n", len(a)+1))
		a = append(a, callerLine)
	}
	fmt.Fprintf(vc.sbldr, f0, a...)
}
