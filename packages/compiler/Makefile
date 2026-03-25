NODE = node --disable-warning=ExperimentalWarning

SRC_TS_FILES := $(wildcard src/*.ts)

# If ohm-grammar-wasm.ts is just a stub (from a failed bootstrap), remove it
# so that Make's dependency logic will trigger a rebuild.
$(if $(wildcard build/ohm-grammar-wasm.ts),\
  $(if $(shell [ $$(wc -c < build/ohm-grammar-wasm.ts) -lt 100 ] && echo stale),\
    $(shell rm -f build/ohm-grammar-wasm.ts)))

.PHONY: all
all: dist-js check

.PHONY: clean
clean:
	rm -rf dist/* build/*

.PHONY: check
check:
	pnpm tsc --noEmit

.PHONY: debug
debug: clean
	OHM_DEBUG=1 make

.PHONY: bench
bench: all scripts/bench.js build/es5.wasm build/json.wasm build/liquid-html.wasm
	$(NODE) --expose-gc $(NODE_COMMON_FLAGS) scripts/bench.js

.PHONY: dist-js
dist-js: build/ohmRuntime.wasm_sections.ts build/ohm-grammar-wasm.ts $(SRC_TS_FILES)
	pnpm tsdown

# WASM meta-grammar, bootstrapped using ohm-js-legacy for parsing.
build/ohm-grammar-wasm.ts: ../ohm-js/src/ohm-grammar.ohm scripts/bootstrap.ts build/ohmRuntime.wasm_sections.ts
	$(NODE) scripts/bootstrap.ts

build/ohmRuntime.wasm_sections.ts: scripts/bundlewasm.ts build/ohmRuntime.wasm
	$(NODE) scripts/bundlewasm.ts build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	pnpm asc --runtime stub --debug -o build/ohmRuntime.wasm -t build/ohmRuntime.wat runtime/ohmRuntime.ts

build/es5.wasm: src/cli.ts ../../examples/ecmascript/src/es5.ohm
	$(NODE) src/cli.ts -o build/es5.wasm ../../examples/ecmascript/src/es5.ohm

build/json.wasm: src/cli.ts ../lang-json/json.ohm
	$(NODE) src/cli.ts -o build/json.wasm ../lang-json/json.ohm

build/liquid-html.wasm: src/cli.ts test/data/liquid-html.ohm
	$(NODE) src/cli.ts -g LiquidHTML -o build/liquid-html.wasm test/data/liquid-html.ohm

JAVY ?= javy

# --- Javy: self-contained Wasm build of the compiler ---
#
# Javy (https://github.com/bytecodealliance/javy) compiles JavaScript into a
# standalone Wasm module by embedding QuickJS. This lets us run the Ohm
# compiler in any environment with a Wasm runtime, without requiring Node.js.
#
# How it works:
#   1. tsdown bundles the compiler into a single IIFE (build/compiler-javy.iife.js),
#      using ohm-js-legacy for grammar parsing (pure JS, no Wasm dependency)
#      and stubbing out ohm-js v18 (which requires WebAssembly).
#   2. Javy compiles the IIFE into a Wasm module (build/compiler.wasm).
#
# The resulting module reads an Ohm grammar from stdin and writes compiled
# Wasm bytes to stdout. Errors are written to stderr.
#
# Prerequisites: `javy` CLI (https://github.com/bytecodealliance/javy/releases)
# Testing requires `wasmtime` (https://wasmtime.dev/).
.PHONY: compiler-wasm
compiler-wasm: build/compiler.wasm

build/compiler-javy.iife.js: src/javy-entry.ts src/javy-api.ts src/javy-ohm-js-stub.ts \
    build/ohmRuntime.wasm_sections.ts build/ohm-grammar-wasm.ts $(SRC_TS_FILES) tsdown.javy.config.ts
	pnpm tsdown --config tsdown.javy.config.ts

build/compiler.wasm: build/compiler-javy.iife.js
	$(JAVY) build $< -o $@

.PHONY: test-compiler-wasm
test-compiler-wasm: build/compiler.wasm
	pnpm ava test/_test-javy.js

.PHONY: go-test-es5
go-test-es5: build/es5.wasm
	cd test/go && go test -v

.PHONY: go-bench-es5
go-bench-es5: build/es5.wasm
	cd test/go && go test -bench=BenchmarkES5Match -benchmem -count=5
