.PHONY: all
all: out/ohmRuntime.wasm_sections.ts

out/ohmRuntime.wasm_sections.ts: build/ohmRuntime.wasm
	node scripts/bundlewasm.ts build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	npx asc --runtime stub -o build/ohmRuntime.wasm --memoryBase 67239936 runtime/ohmRuntime.ts

.PHONY: go-test
go-test: test/data/_add.wasm test/go/app
	test/go/testmain

test/data/_add.wasm:
	echo '(module (func (export "add") (param i32 i32) (result i32) local.get 0 local.get 1 i32.add))' | wasm-tools parse -o test/data/_add.wasm

test/go/app: test/go/testmain.go
	cd test/go && go mod tidy && go build -o testmain
