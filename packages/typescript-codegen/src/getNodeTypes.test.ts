import test from 'ava';
import * as ohm from 'ohm-js';

import {getNodeTypes} from './getNodeTypes';

const pexprs = (ohm as any).pexprs;

test('basic expressions', t => {
  t.deepEqual(getNodeTypes(pexprs.any), ['TerminalNode']);
  t.deepEqual(getNodeTypes(pexprs.end), ['TerminalNode']);
  t.deepEqual(getNodeTypes(new pexprs.Terminal('zzz')), ['TerminalNode']);
  t.deepEqual(getNodeTypes(new pexprs.Range('a', 'b')), ['TerminalNode']);
  t.deepEqual(getNodeTypes(new pexprs.UnicodeChar('Ltmo')), ['TerminalNode']);
  t.deepEqual(getNodeTypes(new pexprs.Apply('any')), ['NonterminalNode']);

  // Not has arity 0.
  t.deepEqual(getNodeTypes(new pexprs.Not(pexprs.any)), []);

  // Param can't be any more specific than 'Node'.
  t.deepEqual(getNodeTypes(new pexprs.Param(0)), ['Node']);
});

test('Alt with no terms', t => {
  const exp = new pexprs.Alt([]);
  t.deepEqual(getNodeTypes(exp), []);
});

test('Alt with one term', t => {
  const exp = new pexprs.Alt([new pexprs.Apply('any')]);
  t.deepEqual(getNodeTypes(exp), ['NonterminalNode']);
});

test('Alt with two homogeneous terms', t => {
  const exp = new pexprs.Alt([new pexprs.Apply('any'), new pexprs.Apply('any')]);
  t.deepEqual(getNodeTypes(exp), ['NonterminalNode']);
});

test('Alt with two heterogeneous terms', t => {
  const exp = new pexprs.Alt([new pexprs.Apply('any'), new pexprs.Terminal('xyz')]);
  t.deepEqual(getNodeTypes(exp), ['NonterminalNode | TerminalNode']);
});

test('Alt with three different terms', t => {
  const exp = new pexprs.Alt([
    new pexprs.Apply('any'),
    new pexprs.Terminal('xyz'),
    new pexprs.Opt(new pexprs.Terminal('xyz'))
  ]);
  t.deepEqual(getNodeTypes(exp), ['Node']);
});

test('Seq', t => {
  let exp = new pexprs.Seq([]);
  t.deepEqual(getNodeTypes(exp), []);

  exp = new pexprs.Seq([new pexprs.Apply('any')]);
  t.deepEqual(getNodeTypes(exp), ['NonterminalNode']);

  exp = new pexprs.Seq([
    new pexprs.Apply('any'),
    new pexprs.Param(0),
    new pexprs.Terminal('zzz')
  ]);
  t.deepEqual(getNodeTypes(exp), ['NonterminalNode', 'Node', 'TerminalNode']);
});

test('Iter expressions', t => {
  t.deepEqual(getNodeTypes(new pexprs.Opt(new pexprs.Terminal('zzz'))), ['IterationNode']);
  t.deepEqual(getNodeTypes(new pexprs.Opt(new pexprs.Apply('any'))), ['IterationNode']);

  let exp = new pexprs.Star(new pexprs.Opt(new pexprs.Terminal('zzz')));
  t.deepEqual(getNodeTypes(exp), ['IterationNode']);

  exp = new pexprs.Star(new pexprs.Seq([new pexprs.Terminal('a'), new pexprs.Terminal('a')]));
  t.deepEqual(getNodeTypes(exp), ['IterationNode', 'IterationNode']);
});

test('Iter with arity > 1 inside a Seq', t => {
  let exp = new pexprs.Seq([
    new pexprs.Apply('letter'),
    new pexprs.Star(new pexprs.Seq([new pexprs.Terminal(','), new pexprs.Apply('letter')]))
  ]);
  t.deepEqual(getNodeTypes(exp), ['NonterminalNode', 'IterationNode', 'IterationNode']);
});

test('Lookahead and Lex', t => {
  // Lookahead and Lex have the same types as the expression they wrap.

  t.deepEqual(getNodeTypes(new pexprs.Lookahead(new pexprs.Terminal('zzz'))), [
    'TerminalNode'
  ]);
  t.deepEqual(getNodeTypes(new pexprs.Lex(new pexprs.Apply('any'))), ['NonterminalNode']);

  const exp = new pexprs.Seq([
    new pexprs.Apply('any'),
    new pexprs.Param(0),
    new pexprs.Terminal('zzz')
  ]);
  t.deepEqual(getNodeTypes(new pexprs.Lookahead(exp)), [
    'NonterminalNode',
    'Node',
    'TerminalNode'
  ]);
  t.deepEqual(getNodeTypes(new pexprs.Lex(exp)), ['NonterminalNode', 'Node', 'TerminalNode']);
});
