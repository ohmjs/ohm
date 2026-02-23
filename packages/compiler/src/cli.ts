#!/usr/bin/env node

import fs from 'node:fs';
import {basename} from 'node:path';
import {parseArgs} from 'node:util';

import {Compiler} from './Compiler.ts';
import {grammars} from './parseGrammars.ts';

// Compile an Ohm grammar file (.ohm) to WebAssembly (.wasm).
function main(): void {
  const argsConfig = {
    options: {
      grammarName: {short: 'g' as const, type: 'string' as const},
      output: {short: 'o' as const, type: 'string' as const},
    },
    allowPositionals: true as const,
  };
  let args: ReturnType<typeof parseArgs<typeof argsConfig>>;
  try {
    args = parseArgs(argsConfig);
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error(e.message);
    printUsage();
    process.exit(1);
  }

  if (args.positionals.length !== 1) {
    printUsage();
    process.exit(1);
  }

  const filename = args.positionals[0];
  const ns = grammars(fs.readFileSync(filename, 'utf8'));

  // By default, use the last grammar in the file.
  let g = Object.values(ns).at(-1);

  const {grammarName} = args.values;
  if (grammarName) {
    if (!ns[grammarName]) {
      // eslint-disable-next-line no-console
      console.error(`Grammar '${grammarName}' not found in ${filename}`);
      process.exit(1);
    }
    g = ns[grammarName];
  }

  const bytes = new Compiler(g).compile();
  const outFilename = args.values.output ?? filename.replace('.ohm', '.wasm');
  fs.writeFileSync(outFilename, bytes);
  // eslint-disable-next-line no-console
  console.log(`Wrote Wasm to ${outFilename}`);
}

// Print usage information
function printUsage(): void {
  const exeName = basename(process.argv[1]);
  // eslint-disable-next-line no-console
  console.log(
    `usage: ${exeName} [(--grammarName|-g) <name>] [(--output|-o) <file>] <ohm-grammar-file>`
  );
}

main();
