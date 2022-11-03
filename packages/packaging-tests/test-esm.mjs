import ohm from 'ohm-js';
import * as extras from 'ohm-js/extras';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {checkExports} from './checkExports.mjs';

test('ES module contents', async () => {
  checkExports(ohm);

  const exports = await import('ohm-js');
  checkExports(exports.default);
});

test('Extras CommonJS exports', async () => {
  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.ok(Object.keys(extras).length === 3);

  const exports = await import('ohm-js/extras');
  assert.equal(exports.default, undefined, 'there should be no default export');
});
