import test from 'ava';
import {exec} from 'child_process';
import {promisify} from 'util';

const execPromise = promisify(exec);

test('benchmark smoke tests', async t => {
  const {stdout} = await execPromise(
    "node scripts/parseLiquid.js --small-size 'test/data/*.liquid'"
  );
  t.is(stdout.slice(0, 9), 'JS parse:');
});
