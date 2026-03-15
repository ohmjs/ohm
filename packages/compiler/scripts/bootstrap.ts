// Bootstrap script: generates build/ohm-grammar-wasm.ts without requiring
// a pre-existing compiler build. Uses ohm-js-legacy (pure JS) for parsing,
// and the Compiler class (imported from source) for WASM compilation.
//
// This breaks the bootstrap cycle: normally the compiler needs the WASM
// meta-grammar to parse .ohm files, but generating that WASM requires
// the compiler. This script sidesteps it by using ohm-js-legacy's parser.

import {existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = join(__dirname, '..', 'build');
const wasmTsPath = join(buildDir, 'ohm-grammar-wasm.ts');
const wasmPath = join(buildDir, 'ohm-grammar.wasm');
const ohmGrammarPath = join(__dirname, '../../ohm-js/src/ohm-grammar.ohm');

// Ensure build directory exists.
mkdirSync(buildDir, {recursive: true});

// Create a stub ohm-grammar-wasm.ts so that importing Compiler.js
// (which transitively imports parseGrammars.ts -> ohm-grammar-wasm.ts)
// doesn't fail at module resolution time. The lazy initialization in
// parseGrammars.ts means the stub bytes are never actually used.
const createdStub = !existsSync(wasmTsPath);
if (createdStub) {
  writeFileSync(wasmTsPath, 'export default new Uint8Array(0);\n');
}

try {
  // Dynamic imports — the stub must be in place before modules are loaded.
  const ohm = await import('ohm-js-legacy');
  const {Compiler} = await import('../src/Compiler.ts');

  // Parse the Ohm meta-grammar using ohm-js-legacy (pure JS, no WASM needed).
  const source = readFileSync(ohmGrammarPath, 'utf8');
  const g = ohm.grammar(source);

  // Compile to WASM.
  // Never include debug imports in the metagrammar — it's loaded via the
  // sync Grammar constructor which doesn't support debug imports.
  const bytes = new Compiler(g, {debug: false}).compile();

  // Write the raw .wasm file.
  writeFileSync(wasmPath, bytes);

  // Bundle into a TypeScript module (base64-encoded).
  const base64 = Buffer.from(bytes).toString('base64');
  const output = `// Auto-generated — do not edit.
const base64 =
  ${JSON.stringify(base64)};
const binary = atob(base64);
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
export default bytes;
`;
  writeFileSync(wasmTsPath, output, 'utf8');
  console.log(
    `Wrote ${wasmTsPath} (${bytes.length} bytes WASM -> ${base64.length} chars base64)`
  );
} catch (e) {
  // If we created the stub, remove it so Make will retry on the next run.
  if (createdStub) {
    unlinkSync(wasmTsPath);
  }
  throw e;
}
