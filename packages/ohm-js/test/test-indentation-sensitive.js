import {grammar, IndentationSensitive} from '../index.mjs';

import test from 'ava';

const grammarWithRule = rule =>
  grammar(`G <: IndentationSensitive { ${rule} }`, {IndentationSensitive});

test('all dedents must be consumed', t => {
  const g = grammarWithRule('X = indent "x"');
  t.is(g.match('  x').shortMessage, 'Line 1, col 4: expected end of input');

  const g2 = grammarWithRule('X = indent "x" dedent');
  t.is(g2.match('  x').succeeded(), true);
});

test("can't skip over an indent", t => {
  let g = grammarWithRule('X = "x"');
  t.is(g.match('  x').shortMessage, 'Line 1, col 3: expected "x"');

  g = grammarWithRule('X = "x"');
  t.is(g.match('  x').shortMessage, 'Line 1, col 3: expected "x"');

  g = grammarWithRule('X = "a".."z"');
  t.is(g.match('  x').shortMessage, 'Line 1, col 3: expected "a".."z"');

  g = grammarWithRule('X = caseInsensitive<"x">');
  t.is(g.match('  x').shortMessage, 'Line 1, col 3: expected "x" (case-insensitive)');

  g = grammarWithRule('X = lower');
  t.is(g.match('  x').shortMessage, 'Line 1, col 3: expected a lowercase letter');

  // TODO: This one is unclear, `any` should probably be able to consume an indent?
  g = grammarWithRule('X = any');
  t.is(g.match('  x').shortMessage, 'Line 1, col 3: expected any character');
});

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

test('memoization', t => {
  // A double indent shouldn't succeed. If it does, we may be incorrectly using
  // a memoized result.
  const g = grammar('G <: IndentationSensitive { Start = indent indent "x" dedent }', {
    IndentationSensitive,
  });
  t.is(g.match('  x').failed(), true);
});

test('basic tracing', t => {
  const g = grammar(
      `G <: IndentationSensitive {
        Start = indent "x" dedent
      }`,
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
