#!/usr/bin/env node

import fs from 'node:fs';
import process from 'node:process';
import * as ohm from '../index.mjs';

/* eslint-disable no-console */

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <ohm-grammar-file>');
  process.exit(1);
}

const filename = args[0];
let source;
try {
  source = fs.readFileSync(filename, 'utf-8');
} catch {
  console.error('error: cannot read file', filename);
  process.exit(2);
}
const grammar = ohm.grammar(source);

// Special case the built-in rules -- it can't depend on main-kernel, because
// that module depends on the built-in rules.
const srcModule = filename === 'src/built-in-rules.ohm' ? 'makeRecipe.js' : 'main-kernel.js';

console.log(`import {makeRecipe} from '../src/${srcModule}';`);
console.log(`export default makeRecipe(${grammar.toRecipe()});`);
