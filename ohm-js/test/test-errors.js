'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const fs = require('fs');
const test = require('ava');

const ohm = require('..');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function makeRuleWithBody(expr) {
  return ohm.grammar('G { start = ' + expr + '}');
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('match failure', t => {
  const g = ohm.grammar('G { start = "a" "b" "c" "d" }');

  let e = g.match('ab');
  t.is(e.failed(), true);
  t.is(e.succeeded(), false);
  t.is(e.message, ['Line 1, col 3:', '> 1 | ab', '        ^', 'Expected "c"'].join('\n'));
  t.is(e.shortMessage, 'Line 1, col 3: expected "c"');
  t.is(e.getRightmostFailurePosition(), 2);

  e = g.match('abcde');
  t.is(e.failed(), true);
  t.is(e.succeeded(), false);
  t.is(
      e.message,
      ['Line 1, col 5:', '> 1 | abcde', '          ^', 'Expected end of input'].join('\n')
  );
  t.is(e.shortMessage, 'Line 1, col 5: expected end of input');
  t.is(e.getRightmostFailurePosition(), 4);

  const m = g.match('abcd');
  t.is(m.succeeded(), true, 'succeeded() is true for root CST node');
  t.is(m.failed(), false, 'failed() is false for root CST node');
});

test('undeclared rules', t => {
  t.throws(
      () => {
        makeRuleWithBody('undeclaredRule');
      },
      {message: /Rule undeclaredRule is not declared in grammar G/}
  );
  const g = makeRuleWithBody('digit');
  t.throws(
      () => {
        g.match('hello world', 'x');
      },
      {message: /Rule x is not declared in grammar G/}
  );
});

test('many expressions with nullable operands', t => {
  t.throws(
      () => {
        makeRuleWithBody('("a"*)*');
      },
      {message: /Nullable expression "a"\* is not allowed inside '\*'/}
  );
  t.throws(
      () => {
        makeRuleWithBody('("a"?)*');
      },
      {message: /Nullable expression "a"\? is not allowed inside '\*'/}
  );
  t.throws(
      () => {
        makeRuleWithBody('("a"*)+');
      },
      {message: /Nullable expression "a"\* is not allowed inside '\+'/}
  );
  t.throws(
      () => {
        makeRuleWithBody('("a"?)+');
      },
      {message: /Nullable expression "a"\? is not allowed inside '\+'/}
  );

  try {
    makeRuleWithBody('("a"?)*');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        [
          'Line 1, col 14:',
          '> 1 | G { start = ("a"?)*}',
          '                   ^~~~',
          'Nullable expression "a"? is not allowed inside \'*\' (possible infinite loop)'
        ].join('\n')
    );
  }

  try {
    makeRuleWithBody('("a"?)+');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        [
          'Line 1, col 14:',
          '> 1 | G { start = ("a"?)+}',
          '                   ^~~~',
          'Nullable expression "a"? is not allowed inside \'+\' (possible infinite loop)'
        ].join('\n')
    );
  }

  t.throws(
      () => {
        ohm.grammar('G { x = y+  y = undeclaredRule }');
      },
      {message: /Rule undeclaredRule is not declared in grammar G/},
      'undeclared rule prevents ManyExprHasNullableOperand check'
  );

  // Dynamic checks for infinite loops. These are needed because our static checks for nullable
  // expressions inside kleene +s and *s don't catch cases where the expression is or contains one
  // or more of the rule's parameters.

  const g1 = ohm.grammar(
      'G { plus<e> = e+  star<e> = e*  inf1 = star<"">  inf2 = plus<"a"*> }'
  );
  try {
    g1.match('', 'inf1');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        'Line 1, col 29:\n' +
        '> 1 | G { plus<e> = e+  star<e> = e*  inf1 = star<"">  inf2 = plus<"a"*> }\n' +
        '                                  ^\n' +
        'Nullable expression "" is not allowed inside \'*\' (possible infinite loop)\n' +
        'Application stack (most recent application last):\n' +
        'inf1\n' +
        'star<"">'
    );
  }
  try {
    g1.match('', 'inf2');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        'Line 1, col 15:\n' +
        '> 1 | G { plus<e> = e+  star<e> = e*  inf1 = star<"">  inf2 = plus<"a"*> }\n' +
        '                    ^\n' +
        'Nullable expression "a"* is not allowed inside \'+\' (possible infinite loop)\n' +
        'Application stack (most recent application last):\n' +
        'inf2\n' +
        'plus<"a"*>'
    );
  }

  const g2 = ohm.grammar('G { Start = ListOf<"a"?, ""> }');
  try {
    g2.match('whatever');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        'Line 25, col 13:\n' +
        '  24 |   NonemptyListOf<elem, sep>\n' +
        '> 25 |     = elem (sep elem)*\n' +
        '                   ^~~~~~~~\n' +
        '  26 | \n' +
        'Nullable expression ("" "a"?) is not allowed inside \'*\' (possible infinite loop)\n' +
        'Application stack (most recent application last):\n' +
        'Start\n' +
        'ListOf<"a"?,"">\n' +
        'NonemptyListOf<"a"?,"">'
    );
  }
});

test('errors from makeGrammar()', t => {
  const source = 'G {}\nG2 <: G {}';
  try {
    ohm.grammar(source);
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        [
          'Line 2, col 1:',
          '  1 | G {}',
          '> 2 | G2 <: G {}',
          '      ^',
          'Found more than one grammar definition -- use ohm.grammars() instead.'
        ].join('\n')
    );
  }
  t.throws(
      () => {
        ohm.grammar('');
      },
      {message: /Missing grammar/}
  );
  t.throws(
      () => {
        ohm.grammar(' \t\n');
      },
      {message: /Missing grammar/}
  );

  try {
    ohm.grammar('G {');
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(e.message, ['Line 1, col 4:', '> 1 | G {', '         ^', 'Expected "}"'].join('\n'));
  }
});

test('unrecognized escape sequences', t => {
  function testBadEscapeSequence(bes) {
    try {
      ohm.grammar('G { start = "hello' + bes + 'world" }');
      t.fail('Expected an exception to be thrown');
    } catch (e) {
      t.is(
          e.message,
          [
            'Line 1, col 19:',
            '> 1 | G { start = "hello' + bes + 'world" }',
            '                        ^',
            'Expected "\\""'
          ].join('\n')
      );
    }
  }
  testBadEscapeSequence('\\$');
  testBadEscapeSequence('\\!');
  testBadEscapeSequence('\\w');
});

test('failures are memoized', t => {
  const g = ohm.grammar(
      'G {\n' + '  S = ~A "b"  -- c1\n' + '    | A       -- c2\n' + '  A = "a"\n' + '}'
  );
  const e = g.match('');
  t.is(e.failed(), true);
  t.is(e.message, ['Line 1, col 1:', '> 1 | ', '      ^', 'Expected "a" or "b"'].join('\n'));
});

test('multiple MatchResults from the same Matcher', t => {
  const g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  const m = g.matcher();
  const r1 = m.replaceInputRange(0, 0, '(1').match();
  const r2 = m.replaceInputRange(0, 2, '1+').match();
  t.is(r1.message, ['Line 1, col 3:', '> 1 | (1', '        ^', 'Expected ")"'].join('\n'));
  t.is(
      r2.message,
      ['Line 1, col 3:', '> 1 | 1+', '        ^', 'Expected a number or "("'].join('\n')
  );
});

test('non-fluffy failures subsume fluffy failures, etc.', t => {
  const g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  const r = g.match('(1');
  const failures = r.getRightmostFailures();
  t.is(failures.length, 5);
  t.is(failures[0].getText(), ')');
  t.is(failures[0].type, 'string');
  t.is(failures[1].getText(), '-');
  t.is(failures[1].type, 'string');
  t.is(failures[2].getText(), '+');
  t.is(failures[2].type, 'string');
  t.is(failures[3].getText(), '/');
  t.is(failures[3].type, 'string');
  t.is(failures[4].getText(), '*');
  t.is(failures[4].type, 'string');
});

test('memo recs that do not contain the necessary info are deleted properly', t => {
  const g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  const r = g.match('1+2*#3/4');
  const failures = r.getRightmostFailures();
  t.is(failures.length, 2);
});

test('trailing space should not influence the result', t => {
  const g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  const r = g.match('(1  ');
  const failures = r.getRightmostFailures().filter(failure => !failure.isFluffy());
  t.is(failures.length, 1);
  t.is(failures[0].getText(), ')');
  t.is(failures[0].type, 'string');
});

test('method name displayed on abstract function failure', t => {
  const g = ohm.ohmGrammar.superGrammar;
  const param = g.rules.NonemptyListOf.body.factors[0];
  try {
    param.toFailure();
    t.fail('Expected an exception to be thrown');
  } catch (e) {
    t.is(
        e.message,
        'this method toFailure is abstract! (it has no implementation in class Param)'
    );
  }
});

test('errors for Not-of-<PExpr>', t => {
  const notAltG = ohm.grammar('G { start = ~("b" | "c") "d" }');
  let r = notAltG.match('b');
  t.is(r.failed(), true);
  t.is(typeof r.message, 'string'); // implicitly requires that r.message not throw
  t.truthy(
      /Expected not \("b" or "c"\)/.exec(r.message),
      'reasonable failure report for Not-of-Alt'
  );

  const notParamG = ohm.grammar('G {\n' + '  S = Not<"a">\n' + '  Not<elem> = ~elem\n' + '}');
  r = notParamG.match('a');
  t.is(r.failed(), true);
  t.is(typeof r.message, 'string');
  t.truthy(/Expected not "a"/.exec(r.message), 'reasonable failure report for Not-of-Param');

  const notLookaheadG = ohm.grammar('G { start = ~(&"a") "b" }');
  r = notLookaheadG.match('a');
  t.is(r.failed(), true);
  t.is(typeof r.message, 'string');
  t.truthy(
      /Expected not "a"/.exec(r.message),
      'reasonable failure report for Not-of-Lookahead'
  );

  const notSeqG = ohm.grammar('G { start = ~("a" "b") "c" }');
  r = notSeqG.match('ab');
  t.is(r.failed(), true);
  t.is(typeof r.message, 'string');
  t.truthy(
      /Expected not \("a" "b"\)/.exec(r.message),
      'reasonable failure report for Not-of-Seq'
  );

  const notIterG = ohm.grammar('G { start = ~("a"*) "b" }');
  r = notIterG.match('a');
  t.is(r.failed(), true);
  t.is(typeof r.message, 'string');
  t.truthy(
      /Expected not \("a"\*\)/.exec(r.message),
      'reasonable failure report for Not-of-Iter'
  );
});

test('complex match failure', t => {
  const g = ohm.grammar(
      [
        'G {',
        ' start = term* ',
        ' term = rule1 | rule2 | rule3 | rule4 ',
        ' rule1 = int | float ',
        ' rule2 = "#" alnum* ',
        ' rule3 = (~("$" | "_" | "#" | space+ | "\\"") any)+ ',
        ' rule4 = space+ ',
        ' int = digit+ ',
        ' float = int ("." digit+) ',
        '}'
      ].join('\n')
  );
  const r = g.match('fail?"');
  t.is(r.failed(), true);
  t.truthy(/Expected /.exec(r.message), 'Should have a message failure');
});
