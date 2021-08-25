import test from 'ava';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import generateRecipesCommand from './index.js';

const generateRecipes = generateRecipesCommand.action;

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseOpts = {cwd: `${__dirname}/testdata`, dryRun: true};

test('basic', t => {
  let plan = generateRecipes(['**/*.ohm'], baseOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), ['arithmetic.ohm.js', 'e/f/g.ohm.js']);

  plan = generateRecipes(['**/*.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm.js',
    'arithmetic.ohm.d.ts',
    'e/f/g.ohm.js',
    'e/f/g.ohm.d.ts'
  ]);

  const gDecl = plan.filesToWrite['e/f/g.ohm.d.ts'];

  // Check that the declaration looks vaguely correct.
  t.true(gDecl.includes('declare interface GGrammar'));
  t.true(gDecl.includes('declare interface GSemantics'));

  plan = generateRecipes(['*.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(plan.filesToWrite), ['arithmetic.ohm.js', 'arithmetic.ohm.d.ts']);

  const arithmeticDecl = plan.filesToWrite['arithmetic.ohm.d.ts'];

  t.true(arithmeticDecl.includes('declare interface ArithmeticGrammar'));
  t.true(arithmeticDecl.includes('declare interface ArithmeticSemantics'));
  t.true(arithmeticDecl.includes('PriExp?'));
});

test('arithmetic grammar with no types', t => {
  const {filesToWrite} = generateRecipes(['arithmetic.ohm'], baseOpts);
  t.deepEqual(Object.keys(filesToWrite), ['arithmetic.ohm.js']);
  t.snapshot(filesToWrite['arithmetic.ohm.js']);
});

test('arithmetic grammar with types', t => {
  const {filesToWrite} = generateRecipes(['arithmetic.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(filesToWrite), ['arithmetic.ohm.js', 'arithmetic.ohm.d.ts']);
  t.snapshot(filesToWrite['arithmetic.ohm.js']);
  t.snapshot(filesToWrite['arithmetic.ohm.d.ts']);
});
