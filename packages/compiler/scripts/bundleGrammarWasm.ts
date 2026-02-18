/* global process */

// Converts a .wasm file into a TypeScript module that exports the raw bytes
// as a Uint8Array (base64-encoded for compact source).

import * as fs from 'node:fs';

const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath.replace('.wasm', '.wasm.ts');

const buf = fs.readFileSync(inputPath);
const base64 = Buffer.from(buf).toString('base64');

const output = `// Auto-generated — do not edit.
const base64 =
  ${JSON.stringify(base64)};
const binary = atob(base64);
const bytes = new Uint8Array(binary.length);
for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
export default bytes;
`;

fs.writeFileSync(outputPath, output, 'utf8');
// eslint-disable-next-line no-console
console.log(`Wrote ${outputPath} (${buf.length} bytes WASM → ${base64.length} chars base64)`);
