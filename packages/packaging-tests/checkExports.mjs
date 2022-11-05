import * as assert from 'uvu/assert';

const expectedExports = [
  'grammar',
  'grammarFromScriptElement',
  'grammars',
  'grammarsFromScriptElements',
  'makeRecipe',
  'ohmGrammar',
  'pexprs',
  'util',
  'version'
];

// Simple sniff test that the given object/module has the exports that we're
// expecting.
export function checkExports(exports) {
  assert.type(exports.version, 'string');
  assert.type(exports.grammar, 'function');

  assert.equal(Object.keys(exports).sort(), expectedExports);
}
