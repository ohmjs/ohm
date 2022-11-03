const acorn = require('acorn');
const fs = require('fs');
const {test} = require('uvu');
const assert = require('uvu/assert');

const DEV_BUNDLE_CONTENTS = fs.readFileSync('../ohm-js/dist/ohm.js', 'utf-8');
const MIN_BUNDLE_CONTENTS = fs.readFileSync('../ohm-js/dist/ohm.min.js', 'utf-8');

const ecmaVersion = 2017;

function requireFromString(src, filename) {
  const Module = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m.exports;
}

test('Core CommonJS exports', async () => {
  const {checkExports} = await import('./checkExports.mjs');
  const ohm = require('ohm-js');
  checkExports(ohm);
});

test('Extras CommonJS exports', async () => {
  const extras = require('ohm-js/extras');
  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.ok(Object.keys(extras).length === 3);
});

test('UMD bundles', async () => {
  const {checkExports} = await import('./checkExports.mjs');

  // Because the ohm-js package has `"type": "module"` in its package.json,
  // we can't actually require the UMD bundles normally.
  const ohmDev = requireFromString(DEV_BUNDLE_CONTENTS, 'ohm.js');
  checkExports(ohmDev);

  const ohmMin = requireFromString(MIN_BUNDLE_CONTENTS, 'ohm.min.js');
  checkExports(ohmMin);
});

test('sizes', () => {
  const ratio = DEV_BUNDLE_CONTENTS.length / MIN_BUNDLE_CONTENTS.length;

  // We expect the dev bundle to be "signficantly" bigger than the minified
  // one, but ultimately this is an arbitrary ratio. Note that this assumes
  // the dev bundle has inline source maps.
  assert.ok(ratio > 5);
});

test('ECMAScript version', () => {
  acorn.parse(DEV_BUNDLE_CONTENTS, {ecmaVersion, sourceType: 'script'});
  acorn.parse(MIN_BUNDLE_CONTENTS, {ecmaVersion, sourceType: 'script'});
});

test.run();
