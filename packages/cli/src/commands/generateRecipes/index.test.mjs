import test from 'ava';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

import generateRecipesCommand from './index.js';

const generateRecipes = generateRecipesCommand.action;

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseOpts = {cwd: `${__dirname}/testdata`, dryRun: true};

test('basic', t => {
  let plan = generateRecipes(['**/*.ohm'], baseOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm-recipe.js',
    'e/f/g.ohm-recipe.js'
  ]);

  plan = generateRecipes(['**/*.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm-recipe.js',
    'arithmetic.ohm-recipe.d.ts',
    'e/f/g.ohm-recipe.js',
    'e/f/g.ohm-recipe.d.ts'
  ]);

  const gDecl = plan.filesToWrite['e/f/g.ohm-recipe.d.ts'];

  // Check that the declaration looks vaguely correct.
  t.true(gDecl.includes('export interface GGrammar'));
  t.true(gDecl.includes('export interface GSemantics'));

  plan = generateRecipes(['*.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm-recipe.js',
    'arithmetic.ohm-recipe.d.ts'
  ]);

  const arithmeticDecl = plan.filesToWrite['arithmetic.ohm-recipe.d.ts'];

  t.true(arithmeticDecl.includes('export interface ArithmeticGrammar'));
  t.true(arithmeticDecl.includes('export interface ArithmeticSemantics'));
  t.true(arithmeticDecl.includes('PriExp?'));
});

test('arithmetic grammar with no types', t => {
  const {filesToWrite} = generateRecipes(['arithmetic.ohm'], baseOpts);
  t.deepEqual(Object.keys(filesToWrite), ['arithmetic.ohm-recipe.js']);
  t.snapshot(filesToWrite['arithmetic.ohm-recipe.js']);
});

test('arithmetic grammar with types', t => {
  const {filesToWrite} = generateRecipes(['arithmetic.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(filesToWrite), [
    'arithmetic.ohm-recipe.js',
    'arithmetic.ohm-recipe.d.ts'
  ]);
  t.snapshot(filesToWrite['arithmetic.ohm-recipe.js']);
  t.snapshot(filesToWrite['arithmetic.ohm-recipe.d.ts']);
});
