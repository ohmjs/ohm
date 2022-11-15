import {InputStream} from '../src/InputStream.js';

import test from 'ava';

test('next() at end', t => {
  const inputStream = new InputStream('');
  t.is(inputStream.atEnd(), true);
  t.is(inputStream.next(), undefined);
  t.is(inputStream.atEnd(), true);
});
