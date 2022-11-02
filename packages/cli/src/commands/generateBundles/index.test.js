import test from 'ava';
import {dirname} from 'path';
import requireFromString from 'require-from-string';
import {fileURLToPath} from 'url';

import generateBundlesCommand from './index.js';

const generateBundles = generateBundlesCommand.action;

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseOpts = {cwd: `${__dirname}/testdata`, dryRun: true};

test('basic', t => {
  let plan = generateBundles(['**/*.ohm'], baseOpts);
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm-bundle.js',
    'e/f/g.ohm-bundle.js',
  ]);

  plan = generateBundles(['**/*.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm-bundle.js',
    'arithmetic.ohm-bundle.d.ts',
    'e/f/g.ohm-bundle.js',
    'e/f/g.ohm-bundle.d.ts',
  ]);

  const gDecl = plan.filesToWrite['e/f/g.ohm-bundle.d.ts'];

  // Check that the declaration looks vaguely correct.
  t.true(gDecl.includes('export interface GGrammar'));
  t.true(gDecl.includes('export interface GSemantics'));

  plan = generateBundles(['*.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(plan.filesToWrite), [
    'arithmetic.ohm-bundle.js',
    'arithmetic.ohm-bundle.d.ts',
  ]);

  const arithmeticDecl = plan.filesToWrite['arithmetic.ohm-bundle.d.ts'];

  t.true(arithmeticDecl.includes('export interface ArithmeticGrammar'));
  t.true(arithmeticDecl.includes('export interface ArithmeticSemantics'));
  t.true(arithmeticDecl.includes('PriExp?'));
});

test('arithmetic grammar with no types', t => {
  const {filesToWrite} = generateBundles(['arithmetic.ohm'], baseOpts);
  t.deepEqual(Object.keys(filesToWrite), ['arithmetic.ohm-bundle.js']);
  t.snapshot(filesToWrite['arithmetic.ohm-bundle.js']);

  const g = requireFromString(filesToWrite['arithmetic.ohm-bundle.js']);
  t.true(g.match('1+2').succeeded());
});

test('arithmetic grammar with types', t => {
  const {filesToWrite} = generateBundles(['arithmetic.ohm'], {...baseOpts, withTypes: true});
  t.deepEqual(Object.keys(filesToWrite), [
    'arithmetic.ohm-bundle.js',
    'arithmetic.ohm-bundle.d.ts',
  ]);
  t.snapshot(filesToWrite['arithmetic.ohm-bundle.d.ts']);
});

test('multiple grammars', t => {
  const {filesToWrite} = generateBundles(['e/f/g.ohm'], baseOpts);
  t.deepEqual(Object.keys(filesToWrite), ['e/f/g.ohm-bundle.js']);

  const ns = requireFromString(filesToWrite['e/f/g.ohm-bundle.js']);
  t.true(ns.G.match('G').succeeded());
  t.true(ns.G2.match('G2').succeeded());
});
