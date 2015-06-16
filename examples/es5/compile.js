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
    return {
      name: name,
      contents: removeShebang(fs.readFileSync(name).toString())
    };
  });

  var filename;
  var result;

  console.time('Matching');
  var ok = files.every(function(f) {
    filename = f.name;
    result = lang.grammar.match(f.contents, 'Program');
    return result.succeeded();
  });
  if (ok) {
    console.timeEnd('Matching');
    console.time('Codegen');
    var code = lang.semantics(result).asES5;
    // console.log(code);
    console.timeEnd('Codegen');
    console.log(code.length + ' bytes');
  } else {
    console.log(filename + ':\n' + result.message);
  }
})();
