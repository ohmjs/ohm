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

test('basic tracing', t => {
  const g = grammar(
      `
    G <: IndentationSensitive {
      Start = indent "x" dedent
    }
  `,
      {IndentationSensitive},
  );
  const trace = g.trace('  x');
  const start = trace.children[1];

  t.is(start.displayString, 'Start');
  t.is(start.succeeded, true);
  t.is(start.pos, 2);

  const cstNode = start.bindings[0];
  t.is(cstNode.numChildren(), 3);

  const seq = start.children[0];
  t.is(seq.displayString, 'indent "x" dedent');
  t.is(seq.succeeded, true);
  t.is(seq.children.length, 6);

  const indent = seq.children[1];
  t.is(indent.displayString, 'indent');
  t.is(indent.source.startIdx, 2);
  t.is(indent.source.endIdx, 2);

  const dedent = seq.children[5];
  t.is(dedent.displayString, 'dedent');
  t.is(dedent.source.startIdx, 3);
  t.is(dedent.source.endIdx, 3);

  t.is(indent.toString(), 'x          ✓ indent ⇒  ""\nx            ✓ indent ⇒  ""\n');
  t.is(dedent.toString(), '           ✓ dedent ⇒  ""\n             ✓ dedent ⇒  ""\n');
});
