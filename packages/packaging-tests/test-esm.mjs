import * as ohm from 'ohm-js';
import * as extras from 'ohm-js/extras';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {checkExports} from './checkExports.mjs';

test('Main exports (ESM)', async () => {
  checkExports(ohm);
  checkExports(await import('ohm-js'));
});

test('Extras exports (ESM)', async () => {
  assert.equal(typeof extras.VisitorFamily, 'function');
  assert.equal(typeof extras.toAST, 'function');
  assert.ok(Object.keys(extras).length === 3);

  const exports = await import('ohm-js/extras');
  assert.equal(exports.default, undefined, 'there should be no default export');
});
