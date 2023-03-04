import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {evaluate} from './arithmetic';

test('basic', () => {
  assert.is(evaluate('(3 + 4) * 5'), 35);
  assert.is(evaluate('pi'), Math.PI);
});

test.run();
