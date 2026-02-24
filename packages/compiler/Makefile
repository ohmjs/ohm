NODE = node --disable-warning=ExperimentalWarning

SRC_TS_FILES := $(wildcard src/*.ts)

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
	pnpm asc --enable reference-types --runtime stub --debug -o build/ohmRuntime.wasm -t build/ohmRuntime.wat --memoryBase 65536 runtime/ohmRuntime.ts

# 2025-10-07: The rules below may not work anymore.

build/es5.wasm: src/cli.ts
	$(NODE) scripts/es5ToWasm.js build/es5.wasm

build/json.wasm: src/cli.ts ../lang-json/json.ohm
	$(NODE) src/cli.ts -o build/json.wasm ../lang-json/json.ohm

build/liquid-html.wasm: src/cli.ts test/data/liquid-html.ohm
	$(NODE) src/cli.ts -g LiquidHTML -o build/liquid-html.wasm test/data/liquid-html.ohm

.PHONY: go-test-es5
go-test-es5: test/go/testmain build/es5.wasm
	cd test/go && ./testmain -wasm ../../build/es5.wasm -file ../data/_html5shiv-3.7.3.js

.PHONY: go-test-es5-lite
go-test-es5-lite: test/go/testmain
	cd test/go && ./testmain -wasm ../../build/es5.wasm -input "var x = 3; function foo() {}"

test/go/testmain: test/go/testmain.go test/go/matcher.go
	cd test/go && go mod tidy && go build -o testmain
