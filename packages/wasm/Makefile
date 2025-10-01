NODE = node --disable-warning=ExperimentalWarning

SRC_JS_FILES := $(wildcard src/*.js)
SRC_TS_FILES := $(wildcard src/*.ts)

.PHONY: all
all: dist/index.js dist/index.d.ts dist/cli.js check

.PHONY: clean
clean:
	rm -f dist/* build/*

.PHONY: check
check:
	pnpm tsc --noEmit

.PHONY: debug
debug: clean
	OHM_DEBUG=1 make

.PHONY: bench
bench: all build/es5.wasm build/json.wasm build/liquid-html.wasm
	$(NODE) --expose-gc $(NODE_COMMON_FLAGS) scripts/bench.js

build/%.O3.wasm: build/%.wasm
	wasm-opt -O3 --enable-bulk-memory-opt -o $@ $<

dist/index.js: build/ohmRuntime.wasm_sections.ts $(SRC_JS_FILES) $(SRC_TS_FILES)
	pnpm esbuild index.js --bundle --loader:.ts=ts --outfile=dist/index.js --format=esm --platform=node --external:ohm-js

dist/index.d.ts:
	cp index.d.ts dist/index.d.ts

dist/cli.js: dist/index.js src/cli.js
	pnpm esbuild src/cli.js --bundle --loader:.ts=ts --outfile=dist/cli.js --format=esm --platform=node  --external:ohm-js --external:./index.js --banner:js="#!/usr/bin/env node"

build/ohmRuntime.wasm_sections.ts: scripts/bundlewasm.ts build/ohmRuntime.wasm
	$(NODE) scripts/bundlewasm.ts build/ohmRuntime.wasm

.PHONY: force-bundlewasm
force-bundlewasm:
	touch build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	pnpm asc --runtime stub -o build/ohmRuntime.wasm -t build/ohmRuntime.wat --memoryBase 65536 runtime/ohmRuntime.ts

build/es5.wasm: dist/index.js
	$(NODE) scripts/es5ToWasm.js build/es5.wasm

build/json.wasm: dist/index.js
	$(NODE) src/cli.js -o build/json.wasm ../lang-json/json.ohm

build/liquid-html.wasm: dist/index.js
	$(NODE) src/cli.js -g LiquidHTML -o build/liquid-html.wasm test/data/liquid-html.ohm

.PHONY: go-test-es5
go-test-es5: test/go/testmain build/es5.wasm
	cd test/go && ./testmain -wasm ../../build/es5.wasm -file ../data/_html5shiv-3.7.3.js

.PHONY: go-test-es5-lite
go-test-es5-lite: test/go/testmain
	cd test/go && ./testmain -wasm ../../build/es5.wasm -input "var x = 3; function foo() {}"

test/go/testmain: test/go/testmain.go test/go/matcher.go
	cd test/go && go mod tidy && go build -o testmain
