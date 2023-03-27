import * as ohm from 'ohm-js';
import * as extras from 'ohm-js/extras';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

function checkExports(exports) {
  assert.type(exports.grammar, 'function');
  assert.type(exports.grammars, 'function');
  assert.type(exports.makeRecipe, 'function');
  assert.type(exports.ohmGrammar, 'object');
  assert.type(exports.pexprs, 'object');
  assert.type(exports.version, 'string');
  assert.not('default' in exports, 'there should be no default export');
}

test('Main exports (ESM)', async () => {
  checkExports(ohm);
  checkExports(await import('ohm-js'));
});

test('Extras exports (ESM)', async () => {
  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.equal(typeof extras.extractExamples, 'function');
  assert.ok(Object.keys(extras).length === 6);

  const exports = await import('ohm-js/extras');
  assert.not('default' in exports, 'there should be no default export');
});

test.run();
