#!/usr/bin/env node
/* eslint-env node */

'use strict';

const ohm = require('./main');
const fs = require('fs');

/* eslint-disable no-console */

const args = process.argv.slice(2);
if (args.length !== 1) {
  console.error(
      'usage: ' + process.argv[0] + ' ' + process.argv[1] + ' { --builtin | <ohm-grammar-file> }'
  );
  process.exit(1); // eslint-disable-line no-process-exit
}

const filename = args[0];
let grammar;

if (filename === '--builtin') {
  const Grammar = require('./Grammar');
  grammar = Grammar.ProtoBuiltInRules;
} else {
  let source;
  try {
    source = fs.readFileSync(filename).toString();
  } catch (e) {
    console.error('error: cannot read file', filename);
    process.exit(2); // eslint-disable-line no-process-exit
  }
  grammar = ohm.grammar(source);
}

console.log("var {makeRecipe} = require('../src/makeRecipe');");
console.log('module.exports = makeRecipe(' + grammar.toRecipe() + ');');
