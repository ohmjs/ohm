.PHONY: all
all: out/ohmRuntime.wasm_sections.ts

out/ohmRuntime.wasm_sections.ts: build/ohmRuntime.wasm
	node scripts/bundlewasm.ts build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	npx asc --runtime stub -o build/ohmRuntime.wasm --memoryBase 67239936 runtime/ohmRuntime.ts

.PHONY: go-test-es5
go-test-es5: test/go/testmain
	cd test/go && ./testmain -wasm ../data/_es5.wasm -input "var x = 3;"

test/data/_add.wasm:
	echo '(module (func (export "add") (param i32 i32) (result i32) local.get 0 local.get 1 i32.add))' | wasm-tools parse -o test/data/_add.wasm

test/go/testmain: test/go/testmain.go
	cd test/go && go mod tidy && go build -o testmain
