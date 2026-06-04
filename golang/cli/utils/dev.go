//go:build dev

package utils

import (
	"fmt"
	"os"
)

func OhmGrammarWasmBytes() []byte {
	// expected to be run from cli dir
	barr, err := os.ReadFile("utils/ohm-grammar.wasm")
	if err != nil {
		panic(fmt.Errorf("dev mode error %v", err))
	}
	return barr
}
