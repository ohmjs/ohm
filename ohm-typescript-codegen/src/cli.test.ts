import test from 'ava';

import {main} from './cli';

test('basic', t => {
  const testOpts = {cwd: `${__dirname}/testdata`, dryRun: true};
  let plan = main(['**/*.ohm'], testOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), ['arithmetic.ohm.d.ts', 'e/f/g.ohm.d.ts']);

  const gDecl = plan.filesToWrite['e/f/g.ohm.d.ts'];

  // Check that the declaration looks vaguely correct.
  t.true(gDecl.includes('declare interface GGrammar'));
  t.true(gDecl.includes('declare interface GSemantics'));

  plan = main(['*.ohm'], testOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), ['arithmetic.ohm.d.ts']);

  const arithmeticDecl = plan.filesToWrite['arithmetic.ohm.d.ts'];

  t.true(arithmeticDecl.includes('declare interface ArithmeticGrammar'));
  t.true(arithmeticDecl.includes('declare interface ArithmeticSemantics'));
  t.true(arithmeticDecl.includes('PriExp?'));
});
