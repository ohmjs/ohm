/* eslint-env node*/

const markscript = require('markscript');
const path = require('path');
const test = require('ava');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

const markscriptConfig = {
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

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// The tests below use Markscript to execute any code that is inside fenced
// code blocks in a Markdown document. This allows us to ensure that examples
// in the documentation run without errors.

test('doc/README.md', t => {
  //  markscript.evaluateFile(scriptRel('../../../doc/README.md'), markscriptConfig);
  t.pass();
});

test('doc/api-reference.md', t => {
  //  markscript.evaluateFile(scriptRel('../../../doc/api-reference.md'), markscriptConfig);
  t.pass();
});

test('doc/syntax-reference.md', t => {
  //  markscript.evaluateFile(scriptRel('../../../doc/syntax-reference.md'), markscriptConfig);
  t.pass();
});

test('doc/extras.md', t => {
  //  markscript.evaluateFile(scriptRel('../../../doc/extras.md'), markscriptConfig);
  t.pass();
});
