#!/usr/bin/env node

/* global process */

import * as ohm from 'ohm-js';
import fs from 'node:fs';
import {basename} from 'node:path';

import { Compiler } from './index.js';

// Compile an Ohm grammar file (.ohm) to WebAssembly (.wasm).
function main() {
  const args = process.argv.slice(2);

  // Check if we have exactly one argument
  if (args.length !== 1) {
    printUsage();
    process.exit(1);
  }

  const filename = args[0];
  const g = ohm.grammar(fs.readFileSync(filename, 'utf8'));
  const bytes = new Compiler(g).compile();
  const outFilename = filename.replace('.ohm', '.wasm');
  fs.writeFileSync(outFilename, bytes);
  console.log(`Wrote Wasm to ${outFilename}`);
}

// Print usage information
function printUsage() {
  console.log(`usage: ${basename(process.argv[1])} <ohm-grammar-file>`);
}

main();
