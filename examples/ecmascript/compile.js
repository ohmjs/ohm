/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var es5 = require('./es5');
var ohm = require('../..');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function removeShebang(source) {
  return source.slice(0, 2) === '#!' ? source.replace('#!', '//') : source;
}

function loadModule(name) {
  var ns = {ES5: es5.grammar};
  if (fs.exists(name)) {
    return require(name)(ohm, ns, es5.semantics);
  }
  var relPath = path.join(__dirname, name);
  var modulePath = require.resolve(relPath);
  if (modulePath) {
    return require(modulePath)(ohm, ns, es5.semantics);
  }
  throw new Error("Error: Cannot find grammar module '" + name + "'");
}

// --------------------------------------------------------------------
// Main
// --------------------------------------------------------------------

(function main() {
  var args = process.argv.slice(2);
  var filenames = [];
  var opts = {};

  // Super basic command line option parsing.
  for (var i = 0; i < args.length; ++i) {
    if (args[i] === '-g') {
      opts.g = args[++i];
    } else {
      filenames.push(args[i]);
    }
  }

  var lang = opts.g ? loadModule(opts.g) : es5;

  // Read in the source of all the files, so that we can time just the matching.
  var files = filenames.map(function(name) {
    return [name, removeShebang(fs.readFileSync(name).toString())];
  });

  var matchStartTime = Date.now();

  // Parsing -- bails out when the first error is encountered.
  var results = [];
  var succeeded = files.every(function(arr) {
    var result = lang.grammar.match(arr[1], 'Program');
    if (result.succeeded()) {
      results.push(result);
      return true;
    }
    console.log(arr[0] + ':\n' + result.message);
  });

  if (succeeded) {
    console.error('Matching:', (Date.now() - matchStartTime) + 'ms');

    // Codegen
    var code = '';
    var codegenStartTime = Date.now();
    results.forEach(function(r) { code += ';\n' + lang.semantics(r).asES5; });
    console.error('Codegen:', (Date.now() - codegenStartTime) + 'ms');

    console.log(code);
  }
})();
