//go:build !dev

package utils

import (
	_ "embed"
)

//go:generate docker run --rm -v "$PWD/../../../packages/ohm-js/src:/local" -v "$PWD:/dst" ohmjs/ohm:18.0.0-beta.15 compile ohm-grammar.ohm

var (
	//go:embed ohm-grammar.wasm
	ohmGrammarWasmBytes []byte
)

func OhmGrammarWasmBytes() []byte { return ohmGrammarWasmBytes }
