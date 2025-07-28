import assert from 'node:assert';
import test from 'node:test';

import fastGlob from 'fast-glob';
import fs from 'fs';
import * as ohm from 'ohm-js';
import path from 'path';
import {fileURLToPath} from 'url';

const grammarPath = new URL('../gen/es2015.grammar.ohm', import.meta.url);

const es2015 = ohm.grammar(fs.readFileSync(grammarPath, 'utf-8'));

const testdataPath = fileURLToPath(new URL('.', import.meta.url));

function esprimaTestMacro(t, sourcePath, shouldSucceed, startRule = 'Script') {
  const input = fs.readFileSync(sourcePath, 'utf-8');
  const result = es2015.match(input);
  if (shouldSucceed) {
    t.is(result.message, undefined);
  }
  //  assert.ok(shouldSucceed ? result.succeeded() : result.failed());
}

const skippedTests = new Set([
  // These are actually not legal ES2015.
  'data/esprima/ES6/binding-pattern/array-pattern/rest-element-array-pattern.js',
  'data/esprima/ES6/binding-pattern/array-pattern/rest-element-object-pattern.js',
  'data/esprima/ES6/rest-parameter/arrow-rest-parameter-array.js',
  'data/esprima/ES6/rest-parameter/arrow-rest-parameter-object.js',
  'data/esprima/ES6/rest-parameter/rest-parameter-array.js',
  'data/esprima/ES6/rest-parameter/rest-parameter-object.js',

  // Early errors. These are supposed to be treated as syntax errors, although
  // they are not purely syntactic.
  // https://262.ecma-international.org/6.0/#sec-__proto__-property-names-in-object-initializers
  'data/esprima/ES6/object-initialiser/invalid-proto-getter-literal-identifier.js',

  // Strict mode: see https://262.ecma-international.org/6.0/#sec-identifiers-static-semantics-early-errors
  // and https://262.ecma-international.org/6.0/#sec-strict-mode-code
  // In our ES5 grammar, we just always assume strict mode — maybe that's ok here?
  'data/esprima/ES6/lexical-declaration/invalid_forin_const_let.js',
  'data/esprima/ES6/lexical-declaration/invalid_forin_let_let.js',
  'data/esprima/ES6/lexical-declaration/invalid_let_init.js',
  'data/esprima/ES6/lexical-declaration/invalid_let_let.js',
  'data/esprima/ES6/lexical-declaration/invalid_strict_const_let.js'
]);

const moduleTests = new Set(['data/esprima/ES6/import-declaration/import-null-as-nil.js']);

// Find a run all the esprima ES6 tests.
for (const relPath of fastGlob.sync('**/*.js', {cwd: testdataPath})) {
  const sourcePath = path.join(testdataPath, relPath);

  // In the Esprima tests, each test file either has an associated .tree.json,
  // or .failure.json. This tell sus whether it should parse successfully or not.
  const failureJSONPath = sourcePath.replace(/(\.source)?\.js$/, '.failure.json');
  const treeJSONPath = sourcePath.replace(/(\.source)?\.js$/, '.tree.json');

  const shouldSucceed = fs.existsSync(treeJSONPath);
  assert(shouldSucceed || fs.existsSync(failureJSONPath), relPath);

  if (skippedTests.has(relPath)) continue;
  const startRule = moduleTests.has(relPath) ? 'Module' : 'Script';

  // Uncomment this to actually run the Esprima tests!
  //  test(relPath, esprimaTestMacro, sourcePath, shouldSucceed, startRule);
}

test('zoo', t => {
  const matchSucceeds = (input, startRule = undefined) => [
    es2015.match(input, startRule).succeeded(),
    input
  ];
  const matchFails = (input, startRule = undefined) => [
    es2015.match(input, startRule).failed(),
    input
  ];

  // Fix: rule override for LeftHandSideExpression.
  assert.ok(...matchSucceeds('assert(str.includes(pattern));'));

  // Fix: the base case of identifierName has to come after the left-recursive alternative.
  assert.ok(...matchSucceeds("import assert from 'assert';", 'Module'));

  // Fix: rule overrides for multiLineCommentChars and postAsteriskCommentChars.
  assert.ok(...matchSucceeds('/* test */', 'multiLineComment'));

  // Fix: rule override for PropertyDefinition.
  assert.ok(...matchSucceeds('const x = {zz(a, b) {}}'));

  // Fix: rule override for AssignmentExpression.
  assert.ok(...matchSucceeds('() => 3;', 'Module'));

  // `import.meta` is not valid in ES2015!
  assert.ok(...matchFails('new URL(import.meta.url)'));

  // Fix: rule override for FormalParameters.
  assert.ok(...matchSucceeds('function safelyReplace(str) {}'));

  assert.ok(...matchSucceeds('foo().map();'));

  // Fix: rule override for AssignmentExpression — moving ConditionalExpression after LeftHandSideExpressions.
  assert.ok(...matchSucceeds('x[y] = 3;'));

  // Fix: rule override for UnaryExpression.
  assert.ok(...matchSucceeds("if (typeof override === 'string') {}"));

  assert.ok(...matchSucceeds('const x = aBoolean\n? a : b;'));

  // Fix: rule override for RelationalExpression
  assert.ok(...matchSucceeds('if (name in x) {}'));

  // Fix: Correctly handle sequences of terminals in lookahead sets.
  assert.ok(...matchSucceeds('[a]=b;'));

  // Fix: Correctly handle sequences of terminals in lookahead sets.
  assert.ok(...matchSucceeds('0o12'));

  assert.ok(...matchSucceeds('thisThing.map(x => x);'));

  /*
    Other known bugs:

    - [no LineTerminator here]: needs to be wrapped in a lex.
    - Nullable expression ScriptBody is not allowed inside '?'
   */
});
