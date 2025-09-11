const acorn = require('acorn');
const fs = require('fs');
const {test} = require('uvu');
const assert = require('uvu/assert');

// eslint-disable-next-line ava/no-import-test-files
const {checkExports, checkExtrasExports} = require('./test-commonjs.cjs');

const DEV_BUNDLE_CONTENTS = fs.readFileSync('../ohm-js/dist/ohm.js', 'utf-8');
const MIN_BUNDLE_CONTENTS = fs.readFileSync('../ohm-js/dist/ohm.min.js', 'utf-8');

const EXTRAS_DEV_BUNDLE_CONTENTS = fs.readFileSync('../ohm-js/dist/ohm-extras.js', 'utf-8');

const ecmaVersion = 2020;

function requireFromString(src, filename) {
  const Module = module.constructor;
  const m = new Module();
  m._compile(src, filename);
  return m.exports;
}

test('UMD bundles', () => {
  // Because the ohm-js package has `"type": "module"` in its package.json,
  // we can't actually require the UMD bundles normally.
  checkExports(requireFromString(DEV_BUNDLE_CONTENTS, 'ohm.js'));
  checkExports(requireFromString(MIN_BUNDLE_CONTENTS, 'ohm.min.js'));

  checkExports(new Function(`${DEV_BUNDLE_CONTENTS}; return this.ohm;`)());
  checkExports(new Function(`${MIN_BUNDLE_CONTENTS}; return this.ohm;`)());
});

test('UMD bundles - extras', () => {
  checkExtrasExports(requireFromString(EXTRAS_DEV_BUNDLE_CONTENTS, 'ohm-extras.js'));
  checkExtrasExports(new Function(`${EXTRAS_DEV_BUNDLE_CONTENTS}; return this.ohmExtras;`)());
});

test('sizes', () => {
  const ratio = DEV_BUNDLE_CONTENTS.length / MIN_BUNDLE_CONTENTS.length;

  // We expect the dev bundle to be "signficantly" bigger than the minified
  // one, but ultimately this is an arbitrary ratio. Note that this assumes
  // the dev bundle has inline source maps.
  assert.ok(ratio > 5);
});

test('ECMAScript version', () => {
  const acornOpts = {ecmaVersion, sourceType: 'script'};
  acorn.parse(DEV_BUNDLE_CONTENTS, acornOpts);
  acorn.parse(MIN_BUNDLE_CONTENTS, acornOpts);
  acorn.parse(EXTRAS_DEV_BUNDLE_CONTENTS, acornOpts);
});

test.run();
