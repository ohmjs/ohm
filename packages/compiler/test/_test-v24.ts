// eslint-disable-next-line ava/no-ignored-test-files -- dynamically imported from test-wasm.js
import test from 'ava';
import {compileAndLoad} from './_helpers.ts';

test('nested matching with `using`', async t => {
  const g = await compileAndLoad('G { Start = letter+ | digit+ }');

  {
    using outer = g.match('abc');
    t.assert(outer.succeeded());
    const outerCst = outer.getCstRoot();

    {
      using inner = g.match('1234');
      t.assert(inner.succeeded());
      t.is(inner.getCstRoot().sourceString, '1234');
    }

    // Outer CST is still valid after inner is disposed.
    t.is(outerCst.sourceString, 'abc');
    t.is(outerCst.children[0].children.length, 3);
  }
});
