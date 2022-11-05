/* eslint-disable no-console */

import assert from 'assert';
import fs from 'fs';
import * as ohm from 'ohm-js';
import path from 'path';

function match(inputPath, opts) {
  const {grammarFile, grammarName} = opts;
  const ext = path.extname(grammarFile);
  let ns;
  if (ext === '.ohm-bundle.js') {
    ns = require(grammarFile);
  } else {
    // If it's not a bundle, assume it's an Ohm source file.
    ns = ohm.grammars(fs.readFileSync(grammarFile, 'utf-8'));
  }
  const grammars = Object.values(ns);
  assert(grammars.length > 0, 'No grammars found');
  const grammar = grammarName ? ns[grammarName] : grammars[grammars.length - 1];
  assert(!!grammar, `Grammar '${grammarName}' not found`);

  const result = grammar.match(fs.readFileSync(inputPath, 'utf-8'));
  if (result.failed()) {
    throw new Error(result.message);
  }
}

export default {
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
