import * as ohm from 'ohm-js';
import * as extras from 'ohm-js/extras';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

function checkExports(exports: any) {
  assert.type(exports.grammar, 'function');
  assert.type(exports.grammars, 'function');
  assert.type(exports.makeRecipe, 'function');
  assert.type(exports.ohmGrammar, 'object');
  assert.type(exports.pexprs, 'object');
  assert.type(exports.version, 'string');
  assert.not('default' in exports, 'there should be no default export');
}

test('Main exports (TS)', async () => {
  checkExports(ohm);
});

test('Extras exports (TS)', async () => {
  //  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.ok(Object.keys(extras).length === 6);

  const ex: {grammar: string; rule: string; example: string; shouldMatch: boolean} =
    extras.extractExamples('//+ ""\nG{}')[0];
  assert.equal(ex.grammar, 'G');

  const exports = await import('ohm-js/extras');
  assert.equal((exports as any).default, undefined, 'there should be no default export');
});

test.run();
