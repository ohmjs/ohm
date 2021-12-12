import assert from 'assert';
import test from 'ava';
import fastGlob from 'fast-glob';
import fs from 'fs';
import ohm from 'ohm-js';
import path from 'path';
import {fileURLToPath} from 'url';

const grammarPath = new URL('../gen/es2015.grammar.ohm', import.meta.url);

const es2015 = ohm.grammar(fs.readFileSync(grammarPath, 'utf-8'));

const testdataPath = fileURLToPath(new URL('.', import.meta.url));

function esprimaTestMacro(t, sourcePath, shouldSucceed) {
  const input = fs.readFileSync(sourcePath, 'utf-8');
  const result = es2015.match(input);
  if (shouldSucceed) {
    t.is(result.message, undefined);
  }
  t.true(shouldSucceed ? result.succeeded() : result.failed());
}

// Find a run all the esprima ES6 tests.
for (const relPath of fastGlob.sync('**/*.js', {cwd: testdataPath})) {
  const sourcePath = path.join(testdataPath, relPath);

  // In the Esprima tests, each test file either has an associated .tree.json,
  // or .failure.json. This tell sus whether it should parse successfully or not.
  const failureJSONPath = sourcePath.replace(/(\.source)?\.js$/, '.failure.json');
  const treeJSONPath = sourcePath.replace(/(\.source)?\.js$/, '.tree.json');

  const shouldSucceed = fs.existsSync(treeJSONPath);
  assert(shouldSucceed || fs.existsSync(failureJSONPath), relPath);

  // Uncomment this to actually run the Esprima tests!
  //  test(relPath, esprimaTestMacro, sourcePath, shouldSucceed);
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
  t.true(...matchSucceeds('assert(str.includes(pattern));'));

  // Fix: the base case of identifierName has to come after the left-recursive alternative.
  t.true(...matchSucceeds("import assert from 'assert';", 'Module'));

  // Fix: rule overrides for multiLineCommentChars and postAsteriskCommentChars.
  t.true(...matchSucceeds('/* test */', 'multiLineComment'));

  // Fix: rule override for PropertyDefinition.
  t.true(...matchSucceeds('const x = {zz(a, b) {}}'));

  // Fix: rule override for AssignmentExpression.
  t.true(...matchSucceeds('() => 3;', 'Module'));

  // `import.meta` is not valid in ES2015!
  t.true(...matchFails('new URL(import.meta.url)'));

  // Fix: rule override for FormalParameters.
  t.true(...matchSucceeds('function safelyReplace(str) {}'));

  t.true(...matchSucceeds('foo().map();'));

  // Fix: rule override for AssignmentExpression — moving ConditionalExpression after LeftHandSideExpressions.
  t.true(...matchSucceeds('x[y] = 3;'));

  // Fix: rule override for UnaryExpression.
  t.true(...matchSucceeds("if (typeof override === 'string') {}"));

  t.true(...matchSucceeds('const x = aBoolean\n? a : b;'));

  // Fix: rule override for RelationalExpression
  t.true(...matchSucceeds('if (name in x) {}'));

  // Fix: Correctly handle sequences of terminals in lookahead sets.
  t.true(...matchSucceeds('[a]=b;'));

  /*
    Other known bugs:

    - [no LineTerminator here]: needs to be wrapped in a lex.
    - Nullable expression ScriptBody is not allowed inside '?'
   */
});
