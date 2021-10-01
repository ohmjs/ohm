import test from 'ava';

import {ohmCli} from './cli.js';

// Specify that bad arguments should throw an exception rather than calling process.exit().
const opts = {noProcessExit: true};

test('generateBundles', t => {
  t.is(ohmCli(['generateBundles', '*.ohm', '--dryRun'], opts), undefined);
  t.is(ohmCli(['generateBundles', '*.ohm', '-n'], opts), undefined);
  t.is(ohmCli(['generateBundles', '*.ohm', '-n', '--withTypes'], opts), undefined);
  t.is(ohmCli(['generateBundles', '*.ohm', '-n', '-t'], opts), undefined);

  t.throws(
    () => {
      t.is(ohmCli(['generateBundles', '*.ohm', '-n', '-z'], opts), undefined);
    },
    {message: "error: unknown option '-z'"}
  );

  t.throws(
    () => {
      ohmCli(['generateBundles'], opts);
    },
    {message: "error: missing required argument 'patterns'"}
  );
});

test('unknown or missing command', t => {
  t.throws(
    () => {
      ohmCli(['blah'], opts);
    },
    {message: "error: unknown command 'blah'"}
  );
});
