'use strict';

const test = require('ava');

const pexprs = require('../src/pexprs');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function getNodeTypeStrings(pexpr) {
  return pexpr.getNodeTypes().map(t => t.toString());
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('basic expressions', t => {
  t.deepEqual(getNodeTypeStrings(pexprs.any), ['TerminalNode']);
  t.deepEqual(getNodeTypeStrings(pexprs.end), ['TerminalNode']);
  t.deepEqual(getNodeTypeStrings(new pexprs.Terminal('zzz')), ['TerminalNode']);
  t.deepEqual(getNodeTypeStrings(new pexprs.Range('a', 'b')), ['TerminalNode']);
  t.deepEqual(getNodeTypeStrings(new pexprs.UnicodeChar('Ltmo')), ['TerminalNode']);
  t.deepEqual(getNodeTypeStrings(new pexprs.Apply('any')), ['NonterminalNode']);

  // Not has arity 0.
  t.deepEqual(getNodeTypeStrings(new pexprs.Not(pexprs.any)), []);

  // Param can't be any more specific than 'Node'.
  t.deepEqual(getNodeTypeStrings(new pexprs.Param(0)), ['Node']);
});

test('Alt with no terms', t => {
  const exp = new pexprs.Alt([]);
  t.deepEqual(getNodeTypeStrings(exp), []);
});

test('Alt with one term', t => {
  const exp = new pexprs.Alt([new pexprs.Apply('any')]);
  t.deepEqual(getNodeTypeStrings(exp), ['NonterminalNode']);
});

test('Alt with two homogeneous terms', t => {
  const exp = new pexprs.Alt([new pexprs.Apply('any'), new pexprs.Apply('any')]);
  t.deepEqual(getNodeTypeStrings(exp), ['NonterminalNode']);
});

test('Alt with two heterogeneous terms', t => {
  const exp = new pexprs.Alt([new pexprs.Apply('any'), new pexprs.Terminal('xyz')]);
  t.deepEqual(getNodeTypeStrings(exp), ['NonterminalNode | TerminalNode']);
});

test('Alt with three different terms', t => {
  const exp = new pexprs.Alt([
    new pexprs.Apply('any'),
    new pexprs.Terminal('xyz'),
    new pexprs.Opt(new pexprs.Terminal('xyz'))
  ]);
  t.deepEqual(getNodeTypeStrings(exp), ['Node']);
});

test('Seq', t => {
  let exp = new pexprs.Seq([]);
  t.deepEqual(getNodeTypeStrings(exp), []);

  exp = new pexprs.Seq([new pexprs.Apply('any')]);
  t.deepEqual(getNodeTypeStrings(exp), ['NonterminalNode']);

  exp = new pexprs.Seq([
    new pexprs.Apply('any'),
    new pexprs.Param(0),
    new pexprs.Terminal('zzz')
  ]);
  t.deepEqual(getNodeTypeStrings(exp), ['NonterminalNode', 'Node', 'TerminalNode']);
});

test('Iter expressions', t => {
  t.deepEqual(getNodeTypeStrings(new pexprs.Opt(new pexprs.Terminal('zzz'))), [
    'IterationNode'
  ]);
  t.deepEqual(getNodeTypeStrings(new pexprs.Opt(new pexprs.Apply('any'))), ['IterationNode']);

  let exp = new pexprs.Star(new pexprs.Opt(new pexprs.Terminal('zzz')));
  t.deepEqual(getNodeTypeStrings(exp), ['IterationNode']);

  exp = new pexprs.Star(new pexprs.Seq([new pexprs.Terminal('a'), new pexprs.Terminal('a')]));
  t.deepEqual(getNodeTypeStrings(exp), ['IterationNode', 'IterationNode']);
});

test('Lookahead and Lex', t => {
  // Lookahead and Lex have the same types as the expression they wrap.

  t.deepEqual(getNodeTypeStrings(new pexprs.Lookahead(new pexprs.Terminal('zzz'))), [
    'TerminalNode'
  ]);
  t.deepEqual(getNodeTypeStrings(new pexprs.Lex(new pexprs.Apply('any'))), [
    'NonterminalNode'
  ]);

  const exp = new pexprs.Seq([
    new pexprs.Apply('any'),
    new pexprs.Param(0),
    new pexprs.Terminal('zzz')
  ]);
  t.deepEqual(getNodeTypeStrings(new pexprs.Lookahead(exp)), [
    'NonterminalNode',
    'Node',
    'TerminalNode'
  ]);
  t.deepEqual(getNodeTypeStrings(new pexprs.Lex(exp)), [
    'NonterminalNode',
    'Node',
    'TerminalNode'
  ]);
});
