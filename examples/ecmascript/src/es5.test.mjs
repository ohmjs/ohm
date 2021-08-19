import compile from '../compile.js';

import test from 'ava';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const testdataPath = filename => path.join(__dirname, 'testdata', filename);

test('es5 - parsing underscore.js', t => {
  t.truthy(compile([testdataPath('underscore-1.0.0.js')]));
});

test('es6', t => {
  t.truthy(compile(['-g', 'es6', testdataPath('test.es6')]));
});
