/* eslint-env node*/

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const markscript = require('markscript');
const path = require('path');
const test = require('tape-catch');

const ohm = require('..');
const testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

const fakeDocument = {
  querySelector(sel) {
    return testUtil.fakeScriptTag('G { foo = end }');
  },
  querySelectorAll(sel) {
    return [testUtil.fakeScriptTag('G { foo = end }')];
  }
};

const markscriptConfig = {
  // Expose the fake document object to scripts inside Markdown.
  globals: {document: fakeDocument},

  // Allow require calls to work properly from inside Markdown.
  moduleAliases: {
    'ohm-js': scriptRel('..'),
    'ohm-js/extras': scriptRel('../extras')
  },
  workingDir: scriptRel('data')
};

function scriptRel(relPath) {
  return path.join(__dirname, relPath);
}

// Stub out the use of `document` in the loaded module. When scripts inside
// Markdown require 'ohm', they will get the same instance.
ohm._setDocumentInterfaceForTesting(fakeDocument);

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// The tests below use Markscript to execute any code that is inside fenced
// code blocks in a Markdown document. This allows us to ensure that examples
// in the documentation run without errors.

test('README.md', t => {
  markscript.evaluateFile(scriptRel('../../README.md'), markscriptConfig);
  t.end();
});

test('doc/README.md', t => {
  markscript.evaluateFile(scriptRel('../../doc/README.md'), markscriptConfig);
  t.end();
});

test('doc/api-reference.md', t => {
  markscript.evaluateFile(scriptRel('../../doc/api-reference.md'), markscriptConfig);
  t.end();
});

test('doc/syntax-reference.md', t => {
  markscript.evaluateFile(scriptRel('../../doc/syntax-reference.md'), markscriptConfig);
  t.end();
});

test('doc/extras.md', t => {
  markscript.evaluateFile(scriptRel('../../doc/extras.md'), markscriptConfig);
  t.end();
});
