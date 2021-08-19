import test from 'ava';
import fs from 'fs';

import {main} from './cli';

const baseOpts = {cwd: `${__dirname}/testdata`, dryRun: true};

test('basic', t => {
  let plan = main(['**/*.ohm'], baseOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), ['arithmetic.ohm.d.ts', 'e/f/g.ohm.d.ts']);

  const gDecl = plan.filesToWrite['e/f/g.ohm.d.ts'];

  // Check that the declaration looks vaguely correct.
  t.true(gDecl.includes('declare interface GGrammar'));
  t.true(gDecl.includes('declare interface GSemantics'));

  plan = main(['*.ohm'], baseOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), ['arithmetic.ohm.d.ts']);

  const arithmeticDecl = plan.filesToWrite['arithmetic.ohm.d.ts'];

  t.true(arithmeticDecl.includes('declare interface ArithmeticGrammar'));
  t.true(arithmeticDecl.includes('declare interface ArithmeticSemantics'));
  t.true(arithmeticDecl.includes('PriExp?'));
});

test('arithmetic grammar', t => {
  const {filesToWrite} = main(['arithmetic.ohm'], baseOpts);
  t.deepEqual(Object.keys(filesToWrite), ['arithmetic.ohm.d.ts']);
  t.snapshot(filesToWrite['arithmetic.ohm.d.ts']);
});
