import test from 'ava';

import {findIndentation} from '../src/findIndentation.js';

test('findIndentationPoints', t => {
  t.deepEqual(findIndentation(''), {});
  t.deepEqual(findIndentation('  x'), {2: 1, 3: -1});
  t.deepEqual(findIndentation('  x\n  y'), {2: 1, 7: -1});
  t.deepEqual(findIndentation('  x\n   y'), {2: 1, 7: 1, 8: -2});
  t.deepEqual(findIndentation('  x\n   y\nz'), {2: 1, 7: 1, 9: -2});
  t.deepEqual(findIndentation('\n   y\n'), {4: 1, 6: -1});
});
