'use strict';

const test = require('ava');

const ohm = require('..');

const displayString = traceNode => traceNode.displayString;

// Tests
// -----

test('case-insensitive matching', t => {
  const g = ohm.grammar(`
    G {
      start = caseInsensitive<"blerg">
      WithSpaces = "bl" caseInsensitive<"erg">
      withUmlaut = caseInsensitive<"blërg">
      eszett = caseInsensitive<"ß">
      dotlessI = caseInsensitive<"ı">
      dottedI = caseInsensitive<"İ">
      insideRepetition1 = (caseInsensitive<"a">)+
      insideRepetition2 = (caseInsensitive<"a">)*
    }
  `);
  let result = g.match('BLERG');
  t.is(result.succeeded(), true);

  const s = g.createSemantics().addAttribute('matchedString', {
    _terminal() {
      return this.sourceString;
    },
    _nonterminal(...children) {
      return children.map(c => c.matchedString).join('');
    },
  });
  t.is(s(result).matchedString, 'BLERG');

  result = g.match('bl ErG', 'WithSpaces');
  t.is(result.succeeded(), true);
  t.is(s(result).matchedString, 'blErG');

  t.is(g.match('blËrg', 'withUmlaut').succeeded(), true);

  result = g.match('blErg', 'withUmlaut');
  t.is(result.failed(), true);
  t.is(result.shortMessage, 'Line 1, col 1: expected "blërg" (case-insensitive)');

  t.is(g.match('ı', 'dotlessI').succeeded(), true, 'matches same code point');
  t.is(g.match('I', 'dotlessI').succeeded(), true, 'matches uppercase dotless I');
  t.is(g.match('İ', 'dottedI').succeeded(), true, 'matches some code point');

  // Getting this right is really tricky. Our implementation currently doesn't treat "i" and "İ"
  // as being case-insensitive-equal. TODO: Maybe fix this?
  t.is(g.match('i', 'dottedI').succeeded(), false, "regular i WON'T match uppercase dotted I");

  t.is(g.match('s', 'eszett').failed(), true);
  t.is(g.match('ss', 'eszett').failed(), true);

  t.is(g.match('aaaA', 'insideRepetition1').succeeded(), true, 'works inside +');
  t.is(g.match('aaaA', 'insideRepetition2').succeeded(), true, 'works inside *');

  t.throws(
      () => {
        ohm.grammar('G { start = caseInsensitive<start> }');
      },
      {message: /Incorrect argument type/},
      'throws when argument is not a Terminal'
  );

  // TODO: Maybe allow Ranges here?
  t.throws(
      () => {
        ohm.grammar('G { start = caseInsensitive<"a".."z"> }');
      },
      {message: /Incorrect argument type/},
      'throws when argument is a Range'
  );
});

test('experimentalApplySyntactic - basics', t => {
  const g = ohm.grammar('G { start = experimentalApplySyntactic<ListOf<digit, ",">> }');
  t.is(g.match('1, 2 , 3 ').succeeded(), true);

  // Syntactic rule can be passed to experimentalApplySyntactic in a lexical context
  t.notThrows(() => ohm.grammar('G { foo = experimentalApplySyntactic<X>\nX = }'));
  t.notThrows(() => ohm.grammar('G { Foo = #(experimentalApplySyntactic<X>)\nX = }'));

  t.throws(
      () => ohm.grammar('G { foo = experimentalApplySyntactic<"bad"> }'),
      {
        message: /expected a syntactic rule application/,
      },
      'other arg types (e.g. Terminal) are not allowed'
  );

  t.throws(
      () => ohm.grammar('G { foo = experimentalApplySyntactic<x>\nx = }'),
      {
        message: /experimentalApplySyntactic is for syntactic rules, but 'x' is a lexical rule/,
      },
      'error if arg is a lexical rule application'
  );
});

test('experimentalApplySyntactic - space skipping', t => {
  const g = ohm.grammar(`
    G {
      start = "a" experimentalApplySyntactic<Letters> "."
      Letters = letter+
    }
  `);
  t.is(g.match('a x.').succeeded(), true, 'space is skipped before the syntactic rule');
  t.is(g.match('a x y.').succeeded(), true, 'space is skipped inside the syntactic rule');
  t.is(g.match('a z  .').succeeded(), true, 'trailing space is skipped');

  // Space skipping should work like it does with a top-level semantic rule: trailing space
  // is skipped at the top level, while leading spaces are skipped before leaf nodes.

  const trace = g.trace('a b .');
  t.deepEqual(trace.children.map(displayString), ['start', 'end'], 'no spaces at top level');

  const start = trace.children[0];
  const seq = start.children[0];
  const applySyntactic = seq.children[1];
  t.deepEqual(seq.children.map(displayString), [
    '"a"',
    'experimentalApplySyntactic<Letters>',
    '"."',
  ]);
  t.deepEqual(
      applySyntactic.children.map(displayString),
      ['$0', 'spaces'],
      'applySyntactic consumes only the trailing space'
  );
  t.deepEqual(
      applySyntactic.children.map(displayString),
      ['$0', 'spaces'],
      'applySyntactic consumes only the trailing space'
  );
  const letters = applySyntactic.children[0].children[0];
  t.deepEqual(letters.children.map(displayString), ['letter+']);

  const g2 = ohm.grammar(`
    G2 {
      start = experimentalApplySyntactic<LettersLR>
      LettersLR = LettersLR letter -- rec
                | letter
    }
  `);
  t.is(g2.match(' a  bc d').succeeded(), true, 'no issues w/ left recursion');

  const g3 = ohm.grammar(`
    G3 {
      start = #experimentalApplySyntactic<ListOf<digit, "+">>
    }`);
  t.is(g3.match(' 3+ 2').succeeded(), true, "lex operator doesn't prevent space skipping");
});

// TODO: Get this working (or should it just warn?)
test.failing('experimentalApplySyntactic with a lexical arg', t => {
  // experimentalApplySyntactic can't appear in a syntatic context, and or lexical args.
  t.throws(() => ohm.grammar('G { Foo = experimentalApplySyntactic<X>\nX = }'), {
    message: /fixme/,
  });
});

test.failing('experimentalApplySyntactic with lookahead', t => {
  t.throws(
      () =>
        ohm.grammar(`
          G {
            withLookahead = experimentalApplySyntactic<~Number Number>
            Number = digit+
          }
        `),
      {message: /what should this be/}
  );
});
