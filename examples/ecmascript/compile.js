/* global process */

/*
  Note: this file is for internal use within the Ohm monorepo, and is not
  intended to be shipped as part of the ohm-grammar-ecmascript package.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';

import * as es5 from './src/es5.js';
import initES6 from './src/es6.js';
import * as ohm from 'ohm-js';

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function removeShebang(source) {
  return source.slice(0, 2) === '#!' ? source.replace('#!', '//') : source;
}

// --------------------------------------------------------------------
// Main
// --------------------------------------------------------------------

/* eslint-disable no-console */

const hasOwnProperty = (x, prop) => Object.prototype.hasOwnProperty.call(x, prop);

function compile(args) {
  const filenames = [];
  const opts = {
    grammar: null,
    b: false, // Benchmark (print matching times).
    v: false, // Verbose
  };

  // Super basic command line option parsing.
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '-g') {
      opts.grammar = args[++i];
    } else if (args[i][0] === '-' && hasOwnProperty(opts, args[i][1])) {
      opts[args[i][1]] = true;
    } else {
      filenames.push(args[i]);
    }
  }

  assert(!opts.grammar || ['es5', 'es6'].includes(opts.grammar));
  const lang = opts.grammar === 'es6' ? initES6(ohm, {ES5: es5.grammar}, es5.semantics) : es5;

  const files = filenames.map(name => {
    // If benchmarking, read in all the files at once, so that we can just time the matching.
    return [name, opts.b ? removeShebang(fs.readFileSync(name).toString()) : null];
  });

  const matchStartTime = Date.now();

  // Parsing -- bails out when the first error is encountered.
  const results = [];
  const succeeded = files.every(arr => {
    const source = arr[1] || removeShebang(fs.readFileSync(arr[0]).toString());
    if (opts.v) {
      console.error(arr[0]);
    }
    const result = lang.grammar.match(source, 'Program');
    if (result.succeeded()) {
      results.push(result);
      return true;
    }
    console.error(arr[0] + ':\n' + result.message);
    return false;
  });

  if (succeeded) {
    if (opts.b) {
      console.error('Matching:', Date.now() - matchStartTime + 'ms');
    }

    // Codegen
    let code = '';
    const codegenStartTime = Date.now();
    results.forEach(r => {
      code += ';\n' + lang.semantics(r).toES5();
    });
    if (opts.b) {
      console.error('Codegen:', Date.now() - codegenStartTime + 'ms');
    }
    return code;
  }
  return null;
}

export {compile};

// `importa.meta.main` was added in Node v24.2.0.
if (import.meta.main) {
  console.log(compile(process.argv.slice(2)));
}
