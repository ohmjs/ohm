# Guide to @ohm-js/wasm

This is the code for the @ohm-js/wasm package. Its purpose is to convert Ohm grammars to WebAssembly, and also for using the result Wasm modules from JavaScript.

There is also code for using the Wasm modules from Go.

## Repository structure

- `src`: Source of the @ohm-js/wasm NPM package.
- `test`: Tests
- `runtime`: AssemblyScript code, which is used to write the runtime support library for the JavaScript code.
- `test/go`: Go code and tests for using the generate grammars from Go.

## Build and test commands

- `pnpm test` to run the JavaScript tests.
- `make go-test-es5` to run the Go tests.
- `make` to rebuild the runtime support library after changing the AssemblyScript code.

## Code style guidelines

- Strive to write the smallest amount of code that will solve the problem as posed. Do not add things "just in case".
- Do not include JSDoc in the code that you write.
- Use comments sparingly. Only leave comments where the meaning is not clear to an informed reader of the code.
- When the Go and JS code handle similar things, the Go code should follow the patterns of the JavaScript code, but it should also look like idiomatic Go. It's better for the Go code to have a slightly different interface than to be very un-idiomatic.
