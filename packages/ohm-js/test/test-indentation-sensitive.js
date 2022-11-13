import {grammar, IndentationSensitive} from '../index.mjs';

import test from 'ava';

test('incremental parsing fails', t => {
  const matcher = grammar('G <: IndentationSensitive { start = "!!!" }', {
    IndentationSensitive,
  }).matcher();
  matcher.setInput('!!!');
  t.is(matcher.match().succeeded(), true);
  t.is(matcher.match().succeeded(), true);

  matcher.setInput('!!!');
  t.is(matcher.match().succeeded(), true);

  matcher.setInput('');

  t.throws(() => matcher.match(), {message: /does not support incremental parsing/});
});
