@phony: all
all: out/ohmRuntime.wasm_sections.ts

out/ohmRuntime.wasm_sections.ts: build/ohmRuntime.wasm
	node scripts/bundlewasm.ts build/ohmRuntime.wasm

build/ohmRuntime.wasm: runtime/ohmRuntime.ts
	npx asc --runtime stub -o build/ohmRuntime.wasm --memoryBase 67239936 runtime/ohmRuntime.ts
