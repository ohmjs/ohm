.PHONY: all
all: dist/index.js dist/cli.js

.PHONY: clean
clean:
	rm -f dist/* build/*

.PHONY: debug
debug: clean
	OHM_DEBUG=1 make

dist/index.js: build/ohmRuntime.wasm_sections.ts src/index.js
	npx esbuild src/index.js --bundle --loader:.ts=ts --outfile=dist/index.js --format=esm --platform=node --external:ohm-js

dist/cli.js: dist/index.js src/cli.js
	npx esbuild src/cli.js --bundle --loader:.ts=ts --outfile=dist/cli.js --format=esm --platform=node  --external:ohm-js --external:./index.js --banner:js="#!/usr/bin/env node"

build/ohmRuntime.wasm_sections.ts: scripts/bundlewasm.ts build/ohmRuntime.wasm
	node scripts/bundlewasm.ts build/ohmRuntime.wasm

.PHONY: force-bundlewasm
force-bundlewasm:
	touch build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	npx asc --runtime stub -o build/ohmRuntime.wasm --memoryBase 67239936 runtime/ohmRuntime.ts

.PHONY: go-test-es5
go-test-es5: test/go/testmain
	cd test/go && ./testmain -wasm ../data/_es5.wasm -file ../data/_html5shiv-3.7.3.js

.PHONY: go-test-es5-lite
go-test-es5-lite: test/go/testmain
	cd test/go && ./testmain -wasm ../data/_es5.wasm -input "var x = 3; function foo() {}"

test/go/testmain: test/go/testmain.go test/go/matcher.go
	cd test/go && go mod tidy && go build -o testmain
