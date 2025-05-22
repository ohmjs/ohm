@phony: all
all: out/runtime.wasm_sections.ts

out/runtime.wasm_sections.ts: build/runtime.wasm
	node scripts/bundlewasm.ts build/runtime.wasm

build/runtime.wasm: runtime/runtime.ts
	npx asc --runtime stub -o build/runtime.wasm runtime/runtime.ts
