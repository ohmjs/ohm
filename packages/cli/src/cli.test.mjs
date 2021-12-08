import test from 'ava';

import {ohmCli} from './cli.js';
import {fileURLToPath} from 'url';

// Specify that bad arguments should throw an exception rather than calling process.exit().
const testOpts = {noProcessExit: true};

const testdataPath = relPath => fileURLToPath(new URL(`testdata/${relPath}`, import.meta.url));

test('generateBundles', t => {
  t.is(ohmCli(['generateBundles', '*.ohm', '--dryRun'], testOpts), undefined);
  t.is(ohmCli(['generateBundles', '*.ohm', '-n'], testOpts), undefined);
  t.is(ohmCli(['generateBundles', '*.ohm', '-n', '--withTypes'], testOpts), undefined);
  t.is(ohmCli(['generateBundles', '*.ohm', '-n', '-t'], testOpts), undefined);

  t.throws(() => ohmCli(['generateBundles', '*.ohm', '-n', '-z'], testOpts), {
    message: "error: unknown option '-z'"
  });

  t.throws(() => ohmCli(['generateBundles'], testOpts), {
    message: "error: missing required argument 'patterns'"
  });
});

test('match', t => {
  const goodArgs = [
    'match',
    '-f',
    testdataPath('words.ohm'),
    testdataPath('words-succeeds.txt')
  ];
  // TODO: Usage errors should throw a particular exception that we can catch
  // and deal with cleanly.

  t.is(ohmCli(goodArgs, testOpts), undefined);

  // TODO: This shouldn't throw an exception.
  const matchFailedArgs = [...goodArgs.slice(0, 3), testdataPath('words-fails.txt')];
  t.throws(() => ohmCli(matchFailedArgs, testOpts), {
    message: /Line 1, col 6:/
  });

  t.throws(() => ohmCli(goodArgs.slice(0, 1), testOpts), {
    message: `error: required option '-f, --grammarFile <path>' not specified`
  });
  t.throws(() => ohmCli(goodArgs.slice(0, 3), testOpts), {
    message: `error: missing required argument 'inputPath'`
  });

  const argsWithBadInputPath = [...goodArgs.slice(0, 3), 'doesnotexist'];
  t.throws(() => ohmCli(argsWithBadInputPath, testOpts), {
    message: `ENOENT: no such file or directory, open 'doesnotexist'`
  });
});

test('unknown or missing command', t => {
  t.throws(() => ohmCli(['blah'], testOpts), {message: "error: unknown command 'blah'"});
});
