/* eslint-env node*/

import markscript from 'markscript';
import * as url from 'url';
import {test} from 'uvu';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

const markscriptConfig = {
  // Allow require calls to work properly from inside Markdown.
  moduleAliases: {
    'ohm-js': scriptRel('..'),
    'ohm-js/extras': scriptRel('../dist/ohm-extras.cjs'),
  },
  workingDir: scriptRel('data'),
};

function scriptRel(relPath) {
  return url.fileURLToPath(new URL(relPath, import.meta.url));
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// The tests below use Markscript to execute any code that is inside fenced
// code blocks in a Markdown document. This allows us to ensure that examples
// in the documentation run without errors.

test('doc/README.md', () => {
  markscript.evaluateFile(scriptRel('../../../doc/README.md'), markscriptConfig);
});

test('doc/api-reference.md', () => {
  markscript.evaluateFile(scriptRel('../../../doc/api-reference.md'), markscriptConfig);
});

test('doc/syntax-reference.md', () => {
  markscript.evaluateFile(scriptRel('../../../doc/syntax-reference.md'), markscriptConfig);
});

test('doc/extras.md', () => {
  markscript.evaluateFile(scriptRel('../../../doc/extras.md'), markscriptConfig);
});

test.run();
