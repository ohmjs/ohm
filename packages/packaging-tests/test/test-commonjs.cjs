const {test} = require('uvu');
const assert = require('uvu/assert');

// Simple sniff test that the given object/module has the exports that we're
// expecting.
function checkExports(exports) {
  assert.type(exports.grammar, 'function');
  assert.type(exports.grammars, 'function');
  assert.type(exports.makeRecipe, 'function');
  assert.type(exports.ohmGrammar, 'object');
  assert.type(exports.pexprs, 'object');
  assert.type(exports.version, 'string');
  assert.not('default' in exports, 'there should be no default export');
}

function checkExtrasExports(extras) {
  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.equal(typeof extras.extractExamples, 'function');
  assert.not('default' in exports, 'there should be no default export');
  assert.ok(Object.keys(extras).length === 6);
}

test('Core CommonJS exports', async () => {
  checkExports(require('ohm-js'));
});

test('Extras CommonJS exports', async () => {
  checkExtrasExports(require('ohm-js/extras'));
});

test.run();

module.exports = {checkExports, checkExtrasExports};
