#!/usr/bin/env node
/* eslint-env node */

'use strict';

var ohm = require('./main');
var fs = require('fs');

var args = process.argv.slice(2);
if (args.length !== 1) {
  console.error('usage: ' + process.argv[0] + ' ' + process.argv[1] + ' <ohm-grammar-file>');
  process.exit(1);  // eslint-disable-line no-process-exit
}

var filename = args[0];
var source;
try {
  source = fs.readFileSync(filename).toString();
} catch (e) {
  console.error('error: cannot read file', filename);
  process.exit(2);  // eslint-disable-line no-process-exit
}

var grammar = ohm.grammar(source);
console.log("var ohm = require('..');");
console.log('module.exports = ohm.makeRecipe' + grammar.toRecipe());
