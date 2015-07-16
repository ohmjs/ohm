/* eslint-env node*/

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var markscript = require('markscript');
var path = require('path');
var test = require('tape-catch');

var ohm = require('..');
var testUtil = require('./testUtil');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var fakeDocument = {
  querySelector: function(sel) {
    return testUtil.fakeScriptTag('G { foo = end }');
  },
  querySelectorAll: function(sel) {
    return [testUtil.fakeScriptTag('G { foo = end }')];
  }
};

var markscriptConfig = {
  // Expose the fake document object to scripts inside Markdown.
  globals: {document: fakeDocument},

  // Make `require('ohm-js')` work properly from inside Markdown.
  moduleAliases: {'ohm-js': '..'},
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

test('README.md', function(t) {
  markscript.evaluateFile(scriptRel('../README.md'), markscriptConfig);
  t.end();
});

test('doc/index.md', function(t) {
  markscript.evaluateFile(scriptRel('../doc/index.md'), markscriptConfig);
  t.end();
});

test('doc/api-reference.md', function(t) {
  markscript.evaluateFile(scriptRel('../doc/api-reference.md'), markscriptConfig);
  t.end();
});

test('doc/syntax-reference.md', function(t) {
  markscript.evaluateFile(scriptRel('../doc/syntax-reference.md'), markscriptConfig);
  t.end();
});
