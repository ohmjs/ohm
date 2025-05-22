@phony: all
all: out/runtime.wasm_sections.ts

out/runtime.wasm_sections.ts: build/runtime.wasm
	node scripts/bundlewasm.ts build/runtime.wasm

build/runtime.wasm: runtime/runtime.v3
	v3c -target=wasm -output=build -symbols -program-name=runtime runtime/runtime.v3
