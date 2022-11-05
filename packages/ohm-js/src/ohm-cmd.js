#!/usr/bin/env node
/* eslint-env node */

import fs from 'fs';
import * as ohm from '../index.mjs';

/* eslint-disable no-console */

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <ohm-grammar-file>');
  process.exit(1); // eslint-disable-line no-process-exit
}

const filename = args[0];
let source;
try {
  source = fs.readFileSync(filename, 'utf-8');
} catch (e) {
  console.error('error: cannot read file', filename);
  process.exit(2); // eslint-disable-line no-process-exit
}
const grammar = ohm.grammar(source);

// Special case the built-in rules -- it can't depend on main-kernel, because
// that module depends on the built-in rules.
const srcModule = filename === 'src/built-in-rules.ohm' ? 'makeRecipe.js' : 'main-kernel.js';

console.log(`import {makeRecipe} from '../src/${srcModule}';`);
console.log(`export default makeRecipe(${grammar.toRecipe()});`);
