import test from 'ava';

import {evaluate} from './arithmetic';

test('basic', t => {
  t.is(evaluate('(3 + 4) * 5'), 35);
  t.is(evaluate('pi'), Math.PI);
});
