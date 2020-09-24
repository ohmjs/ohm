#!/usr/bin/env node

'use strict';

const compile = require('../examples/ecmascript/compile');

const glob = require('glob');

const ignorePatterns = [
  '/const/',
  '/let/',
  '/ES6/',
  '/array/migrated_0007' // Contains some Unicode identifiers.
];

function shouldTest(filename) {
  return ignorePatterns.every(p => filename.indexOf(p) === -1);
}

glob(__dirname + '/../../../third_party/esprima/test/fixtures/**/*.js', (err, files) => {
  compile(['-v'].concat(files.filter(shouldTest)));
});
