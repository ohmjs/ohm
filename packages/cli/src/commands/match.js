/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const ohm = require('ohm-js');
const path = require('path');
const {exit} = require('process');

function match(inputPath, opts) {
  const {grammarFile, grammarName} = opts;
  const ext = path.extname(grammarFile);
  let ns;
  if (ext === '.ohm') {
    ns = ohm.grammars(fs.readFileSync(grammarFile, 'utf-8'));
  } else if (ext === '.ohm-bundle.js') {
    ns = require(grammarFile);
  }
  const grammars = Object.values(ns);
  if (grammars.length === 0) {
    console.log('No grammars found');
    exit(2);
  }
  const grammar = grammarName ? ns[grammarName] : grammars[grammars.length - 1];
  if (!grammar) {
    console.error(`Grammar '${grammarName}' not found`);
    exit(2);
  }
  const result = grammar.match(fs.readFileSync(inputPath, 'utf-8'));
  if (result.failed()) {
    console.error(result.message);
    exit(1);
  }
}

module.exports = {
  command: 'match',
  args: [['<inputPath>', 'the input file to be matched']],
  description: 'match an input against a given grammar',
  requiredOptions: [
    ['-f, --grammarFile <path>', 'the grammar source file (.ohm) or bundle (.ohm-bundle.js)'],
  ],
  options: [
    [
      '-g, --grammarName <name>',
      'name of the grammar to match against (default: last in file)',
    ],
  ],
  action: match,
};
