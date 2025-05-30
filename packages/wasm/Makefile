.PHONY: all
all: out/ohmRuntime.wasm_sections.ts

out/ohmRuntime.wasm_sections.ts: build/ohmRuntime.wasm
	node scripts/bundlewasm.ts build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	npx asc --runtime stub -o build/ohmRuntime.wasm --memoryBase 67239936 runtime/ohmRuntime.ts

.PHONY: print-runtime
print-runtime:
	npx asc --runtime stub --memoryBase 67239936 runtime/ohmRuntime.ts

.PHONY: go-test-es5
go-test-es5: test/go/testmain
	cd test/go && ./testmain -wasm ../data/_es5.wasm -file ../data/_html5shiv-3.7.3.js

.PHONY: go-test-es5-lite
go-test-es5-lite: test/go/testmain
	cd test/go && ./testmain -wasm ../data/_es5.wasm -input "var x = 3; function foo() {}"

test/go/testmain: test/go/testmain.go test/go/matcher.go
	cd test/go && go mod tidy && go build -o testmain
