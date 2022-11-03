import ohm from 'ohm-js';
import {test} from 'uvu';

import {checkExports} from './checkExports.mjs';

test('ES module contents', () => {
  checkExports(ohm);
});
