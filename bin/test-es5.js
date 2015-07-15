#!/usr/bin/env node

/*eslint-disable */

var compile = require('../examples/ecmascript/compile');

var glob = require('glob');

var ignorePatterns = [
  '/const/',
  '/let/',
  '/ES6/',
  '/array/migrated_0007',  // Contains some Unicode identifiers.
];

function shouldTest(filename) {
  return ignorePatterns.every(function(p) { return filename.indexOf(p) === -1; });
}

glob(__dirname + '/../../../third_party/esprima/test/fixtures/**/*.js', function(err, files) {
  compile(['-v'].concat(files.filter(shouldTest)));
});
