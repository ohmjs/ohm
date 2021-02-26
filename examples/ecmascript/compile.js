/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const es5 = require('./src/es5');
const ohm = require('ohm-js');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function removeShebang(source) {
  return source.slice(0, 2) === '#!' ? source.replace('#!', '//') : source;
}

function loadModule(name) {
  const ns = {ES5: es5.grammar};
  if (fs.existsSync(name)) {
    return require(name)(ohm, ns, es5.semantics);
  }
  const relPath = path.join(__dirname, 'src', name);
  const modulePath = require.resolve(relPath);
  if (modulePath) {
    return require(modulePath)(ohm, ns, es5.semantics);
  }
  throw new Error("Error: Cannot find grammar module '" + name + "'");
}

// --------------------------------------------------------------------
// Main
// --------------------------------------------------------------------

/* eslint-disable no-console */

function compile(args) {
  const filenames = [];
  const opts = {
    grammar: null,
    b: false, // Benchmark (print matching times).
    v: false // Verbose
  };

  // Super basic command line option parsing.
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '-g') {
      opts.grammar = args[++i];
    } else if (args[i][0] === '-' && opts.hasOwnProperty(args[i][1])) {
      opts[args[i][1]] = true;
    } else {
      filenames.push(args[i]);
    }
  }

  const lang = opts.grammar ? loadModule(opts.grammar) : es5;

  const files = filenames.map(name => {
    // If benchmarking, read in all the files at once, so that we can just time the matching.
    return [name, opts.b ? removeShebang(fs.readFileSync(name).toString()) : null];
  });

  const matchStartTime = Date.now();

  // Parsing -- bails out when the first error is encountered.
  const results = [];
  const succeeded = files.every(arr => {
    const source = arr[1] || removeShebang(fs.readFileSync(arr[0]).toString());
    if (opts.v) { console.error(arr[0]); }
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
      console.error('Matching:', (Date.now() - matchStartTime) + 'ms');
    }

    // Codegen
    let code = '';
    const codegenStartTime = Date.now();
    results.forEach(r => {
      code += ';\n' + lang.semantics(r).toES5();
    });
    if (opts.b) {
      console.error('Codegen:', (Date.now() - codegenStartTime) + 'ms');
    }
    return code;
  }
  return null;
}

module.exports = compile;

if (require.main === module) {
  console.log(compile(process.argv.slice(2)));
}
