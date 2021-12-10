import test from 'ava';
import fs from 'fs';
import ohm from 'ohm-js';

const grammarPath = new URL('../gen/es2015.grammar.ohm', import.meta.url);
const es2015 = ohm.grammar(fs.readFileSync(grammarPath, 'utf-8'));

test('bugs fixed after naive translation', t => {
  // Fix: rule override for LeftHandSideExpression.
  t.is(es2015.match('assert(str.includes(pattern));').succeeded(), true);

  // Fix: the base case of identifierName has to come after the left-recursive alternative.
  t.is(es2015.match("import assert from 'assert';", 'Module').succeeded(), true);

  // Fix: rule overrides for multiLineCommentChars and postAsteriskCommentChars.
  t.is(es2015.match('/* test */', 'multiLineComment').succeeded(), true);

  // Fix: rule override for PropertyDefinition — MethodDefinition must come before IdentifierReference.
  t.is(es2015.match('const x = {zz(a, b) {}}').succeeded(), true);

  // Fix: rule override for AssignmentExpression.
  t.is(es2015.match('() => 3;', 'Module').succeeded(), true);

  // Fix: rule override for NewExpression.
  t.is(es2015.match('new URL(import.meta.url)').succeeded(), true);

  // Fix: rule override for FormalParameters.
  t.is(es2015.match('function safelyReplace(str) {}').succeeded(), true);

  t.is(es2015.match('foo().map();').succeeded(), true);

  /*
    Other known bugs:

    - [no LineTerminator here]: needs to be wrapped in a lex.
    - Nullable expression ScriptBody is not allowed inside '?'
   */
});
