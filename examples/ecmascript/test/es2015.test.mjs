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
  // Fix: rule override for LeftHandSideExpression.
  t.is(es2015.match('assert(str.includes(pattern));').succeeded(), true);

  // Fix: the base case of identifierName has to come after the left-recursive alternative.
  t.is(es2015.match("import assert from 'assert';", 'Module').succeeded(), true);

  // Fix: rule overrides for multiLineCommentChars and postAsteriskCommentChars.
  t.is(es2015.match('/* test */', 'multiLineComment').succeeded(), true);

  // Fix: rule override for PropertyDefinition.
  t.is(es2015.match('const x = {zz(a, b) {}}').succeeded(), true);

  // Fix: rule override for AssignmentExpression.
  t.is(es2015.match('() => 3;', 'Module').succeeded(), true);

  // `import.meta` is not valid in ES2015!
  t.is(es2015.match('new URL(import.meta.url)').succeeded(), false);

  // Fix: rule override for FormalParameters.
  t.is(es2015.match('function safelyReplace(str) {}').succeeded(), true);

  t.is(es2015.match('foo().map();').succeeded(), true);

  // Fix: rule override for AssignmentExpression — moving ConditionalExpression after LeftHandSideExpressions.
  t.is(es2015.match('x[y] = 3;').succeeded(), true);

  // Fix: rule override for UnaryExpression.
  t.is(es2015.match("if (typeof override === 'string') {}").succeeded(), true);

  t.is(es2015.match('const x = aBoolean\n? a : b;').succeeded(), true);

  // Fix: rule override for RelationalExpression
  t.is(es2015.match('if (name in x) {}').succeeded(), true);
  /*
    Other known bugs:

    - [no LineTerminator here]: needs to be wrapped in a lex.
    - Nullable expression ScriptBody is not allowed inside '?'
   */
});
