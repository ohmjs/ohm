#!/usr/bin/env node

var ohm = require("./main.js");
var fs = require("fs");

var args = process.argv.slice(2);
if (args.length !== 1) {
  console.error("usage: " + process.argv[0] + " " + process.argv[1] + " <ohm-grammar-file>");
  process.exit(1);
}

var filename = args[0];
var source;
try {
  source = fs.readFileSync(filename).toString();
} catch (e) {
  console.error('error: cannot read file', filename);
  process.exit(2);
}

var grammar = ohm.makeGrammar(source, "_default");
grammar.namespaceName = "default";
console.log("var ohm = require('../src/main.js');");
console.log("ohm._ohmGrammarRecipe = " + grammar.toRecipe());

