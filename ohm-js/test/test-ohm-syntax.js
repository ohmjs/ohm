'use strict';

const test = require('tape-catch');

const fs = require('fs');
const ohm = require('..');
const testUtil = require('./testUtil');

const arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();
const ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString();

const makeGrammar = testUtil.makeGrammar;
const makeGrammars = testUtil.makeGrammars;

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function compareGrammars(t, expected, actual) {
  // The other property on grammars is "constructors", which contains
  // closures which cause spurious test failures if we compare
  // them. So we ignore that property here, concentrating on `rules`
  // and other "real" properties of each grammar.

  t.equal(typeof actual, typeof expected);
  // ^ e.g. when one is undefined and the other isn't

  if (expected && actual) {
    compareGrammars(t, expected.superGrammar, actual.superGrammar);
    // In the list below, we exclude superGrammar (just tested above)
    // and constructors (for reasons given above).
    ['namespaceName', 'name', 'ruleDecls', 'rules'].forEach(prop => {
      t.deepEqual(actual[prop], expected[prop]);
    });
  }
}

// A stub for Jasmin/RSpec-style tests, for tests that were written before we
// moved to `tape`. New tests shouldn't use this -- instead, they should
// pass a message argument to the assertion functions (e.g. `t.equal`), or
// just put checks in a separate call to `test`.
function it(desc, fn) {
  console.log(desc); // eslint-disable-line no-console
  fn.call();
}

function buildTreeNodeWithUniqueId(g) {
  let nextId = 0;
  const s = g.createSemantics().addAttribute('tree', {
    _nonterminal(children) {
      return ['id', nextId++, this.ctorName]
          .concat(children.map(child => child.tree));
    },
    _terminal() {
      return this.primitiveValue;
    }
  });

  function makeTree(node) { return s(node).tree; }
  makeTree._getNextId = function() { return nextId; };
  return makeTree;
}

function assertSucceeds(t, matchResult, optMessage) {
  t.equal(matchResult.succeeded(), true, optMessage);
  t.equal(matchResult.failed(), false, optMessage);
}

function assertFails(t, matchResult, optMessage) {
  t.equal(matchResult.succeeded(), false, optMessage);
  t.equal(matchResult.failed(), true, optMessage);
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('char', t => {
  const m = ohm.grammar('M { bang = "!" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  assertSucceeds(t, m.match('!'));
  assertFails(t, m.match('!a'));
  assertFails(t, m.match(''));
  const cst = m.match('!');
  t.equal(s(cst).v, '!');
  t.end();
});

test('string', t => {
  const m = ohm.grammar('M { foo = "foo\\b\\n\\r\\t\\\\\\"\\u01bcff\\x8f" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  assertSucceeds(t, m.match('foo\b\n\r\t\\"\u01bcff\x8f'));
  assertFails(t, m.match('foo1'));
  assertFails(t, m.match('bar'));

  const cst = m.match('foo\b\n\r\t\\"\u01bcff\x8f');
  t.equal(s(cst).v, 'foo\b\n\r\t\\"\u01bcff\x8f');

  t.throws(() => { ohm.grammar('G { r = "\\w" }'); },
      /Expected "\\""/,
      'unrecognized escape characters are parse errors');
  t.end();
});

test('unicode', t => {
  const m = ohm.grammar('M {}');

  test('recognition', t => {
    assertSucceeds(t, m.match('a', 'lower'));
    assertSucceeds(t, m.match('\u00E9', 'lower'), 'small letter e with acute');
    assertSucceeds(t, m.match('\u03C9', 'lower'), 'Greek small letter Omega');
    assertFails(t, m.match('`', 'lower'));
    assertFails(t, m.match('\u20AC', 'lower'), 'Euro sign');
    assertFails(t, m.match('\u01C0', 'lower'), 'Latin letter dental click');

    assertSucceeds(t, m.match('Z', 'upper'));
    assertSucceeds(t, m.match('\u03A9', 'upper'), 'Greek capital letter Omega');
    assertFails(t, m.match('[', 'upper'));
    assertFails(t, m.match('\u20AC', 'upper'), 'Euro sign');
    assertFails(t, m.match('\u01C0', 'upper'), 'Latin letter dental click');

    assertSucceeds(t, m.match('\u01C0', 'letter'), 'dental click is a letter');
    assertSucceeds(t, m.match(['\u01C0'], 'letter'), 'dental click in a list');
    t.end();
  });

  test('semantic actions', t => {
    const s = m.createSemantics().addAttribute('v', {
      _terminal() {
        return this.primitiveValue + this.primitiveValue;
      }
    });
    const r = m.match('\u01C0', 'letter');
    t.equal(s(r).v, '\u01C0\u01C0');
    t.end();
  });
  t.end();
});

test('ranges', t => {
  const m = ohm.grammar('M { charRange = "0".."9" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  assertSucceeds(t, m.match('6', 'charRange'));
  assertFails(t, m.match('x', 'charRange'));
  t.equal(s(m.match('4', 'charRange')).v, '4');

  t.throws(
      () => { ohm.grammar('M { charRange = "ab".."c" }'); },
      /Expected "}"/,
      'from-terminal must have length 1');
  t.throws(
      () => { ohm.grammar('M { charRange = "ab".."cd" }'); },
      /Expected "}"/,
      'from-terminal must have length 1');
  t.throws(
      () => { ohm.grammar('M { charRange = "a".."bc" }'); },
      /Expected "\\""/,
      'to-terminal must have length 1');

  t.end();
});

test('alt', t => {
  const m = ohm.grammar('M { altTest = "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  it('recognition', () => {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  it('semantic actions', () => {
    t.equal(s(m.match('a')).v, 'a');
    t.equal(s(m.match('b')).v, 'b');
  });
  t.end();
});

test('rule bodies in defs can start with a |, and it\'s a no-op', t => {
  const m = ohm.grammar('M { altTest = | "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  it('recognition', () => {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  it('semantic actions', () => {
    t.equal(s(m.match('a')).v, 'a');
    t.equal(s(m.match('b')).v, 'b');
  });
  t.end();
});

test('rule bodies in overrides can start with a |, and it\'s a no-op', t => {
  const m = ohm.grammar('M { space := | "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  it('recognition', () => {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertFails(t, m.match(' ', 'space'));
    assertFails(t, m.match('\t', 'space'));
  });

  it('semantic actions', () => {
    t.equal(s(m.match('a', 'space')).v, 'a');
    t.equal(s(m.match('b', 'space')).v, 'b');
  });
  t.end();
});

test('rule bodies in extends can start with a |, and it\'s a no-op', t => {
  const m = ohm.grammar('M { space += | "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  it('recognition', () => {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertSucceeds(t, m.match(' ', 'space'));
    assertSucceeds(t, m.match('\t', 'space'));
  });

  it('semantic actions', () => {
    t.equal(s(m.match('a', 'space')).v, 'a');
    t.equal(s(m.match('b', 'space')).v, 'b');
  });
  t.end();
});

test('seq', t => {
  test('without bindings', t => {
    const m = ohm.grammar('M { start = "a" "bc" "z" }');

    it('recognition', () => {
      assertFails(t, m.match('a'));
      assertFails(t, m.match('bc'));
      assertSucceeds(t, m.match('abcz'));
      assertFails(t, m.match('abbz'));
    });

    it('semantic actions', () => {
      const f = m.match('abcz');
      const s = m.createSemantics().addAttribute('v', {
        start(x, y, z) {
          return [x.sourceString, y.sourceString, z.sourceString];
        }
      });
      t.deepEqual(s(f).v, ['a', 'bc', 'z']);
    });
    t.end();
  });

  test('with exactly one binding', t => {
    const m = ohm.grammar('M { start = "a" "bc" "z" }');

    it('recognition', () => {
      assertFails(t, m.match('a'));
      assertFails(t, m.match('bc'));
      assertSucceeds(t, m.match('abcz'));
      assertFails(t, m.match('abbz'));
    });

    it('semantic actions', () => {
      const f = m.match('abcz');
      const s = m.createSemantics().addAttribute('v', {
        start(a, _bc, _z) {
          return a.primitiveValue;
        }
      });
      t.deepEqual(s(f).v, 'a');
    });
    t.end();
  });

  test('with more than one binding', t => {
    const m = ohm.grammar('M { start = "a" "bc" "z" }');

    it('recognition', () => {
      assertFails(t, m.match('a'));
      assertFails(t, m.match('bc'));
      assertSucceeds(t, m.match('abcz'));
      assertFails(t, m.match('abbz'));
    });

    it('semantic actions', () => {
      const f = m.match('abcz');
      const s = m.createSemantics().addAttribute('v', {
        start(x, _, y) {
          return [x.primitiveValue, y.primitiveValue];
        }
      });
      t.deepEqual(s(f).v, ['a', 'z']);
    });
    t.end();
  });
  t.end();
});

test('alts and seqs together', t => {
  const m = ohm.grammar('M { start = "a" "b" "c" | "1" "2" "3" }');

  it('recognition', () => {
    assertFails(t, m.match('ab'));
    assertFails(t, m.match('12'));
    assertSucceeds(t, m.match('abc'));
    assertSucceeds(t, m.match('123'));
  });

  it('semantic actions', () => {
    const s = m.createSemantics().addAttribute('v', {
      start(x, _, y) {
        return [x.primitiveValue, y.primitiveValue];
      }
    });
    t.deepEqual(s(m.match('abc')).v, ['a', 'c']);
    t.deepEqual(s(m.match('123')).v, ['1', '3']);
  });

  t.end();
});

test('kleene-* and kleene-+', t => {
  const m = makeGrammar([
    'M {',
    '  number = digit+',
    '  digits = digit*',
    '  sss = &number number',
    '}'
  ]);

  it('recognition', () => {
    assertFails(t, m.match('1234a', 'number'));
    assertSucceeds(t, m.match('1234', 'number'));
    assertSucceeds(t, m.match('5', 'number'));
    assertFails(t, m.match('', 'number'));

    assertFails(t, m.match('1234a', 'digits'));
    assertSucceeds(t, m.match('1234', 'digits'));
    assertSucceeds(t, m.match('5', 'digits'));
    assertSucceeds(t, m.match('', 'digits'));
  });

  it('semantic actions', () => {
    const s = m.createSemantics().addAttribute('v', {
      number(expr) {
        return ['digits', expr.v];
      },
      digit(expr) {
        return ['digit', expr.v];
      },
      _terminal() {
        return this.primitiveValue;
      }
    });
    t.deepEqual(s(m.match('1234', 'number')).v, [
      'digits', [
        ['digit', '1'],
        ['digit', '2'],
        ['digit', '3'],
        ['digit', '4']
      ]]);
  });

  it('semantic actions are evaluated lazily', () => {
    const a = buildTreeNodeWithUniqueId(m);
    const tree = ['id', 1, 'number', [
      ['id', 2, 'digit', '1'],
      ['id', 3, 'digit', '2'],
      ['id', 4, 'digit', '3']
    ]];
    t.deepEqual(a(m.match('123', 'sss')), ['id', 0, 'sss', tree, tree]);
    t.equal(a._getNextId(), 5);
  });
  t.end();
});

test('opt', t => {
  const m = ohm.grammar('M { name = "dr"? "warth" }');

  it('recognition', () => {
    assertSucceeds(t, m.match('drwarth'));
    assertSucceeds(t, m.match('warth'));
    assertFails(t, m.match('mrwarth'));
  });

  it('semantic actions', () => {
    const s = m.createSemantics().addAttribute('v', {
      name(title, last) {
        return [title.children.length === 1 ? title.v[0] : undefined, last.primitiveValue];
      },
      _terminal() {
        return this.primitiveValue;
      }
    });
    t.deepEqual(s(m.match('drwarth')).v, ['dr', 'warth']);
    t.deepEqual(s(m.match('warth')).v, [undefined, 'warth']);
  });
  t.end();
});

test('not', t => {
  const m = ohm.grammar('M { start = ~"hello" any* }');

  it('recognition', () => {
    assertSucceeds(t, m.match('yello world'));
    assertFails(t, m.match('hello world'));
  });

  it('semantic actions', () => {
    const s = m.createSemantics().addAttribute('v', {
      start(x) { return x.sourceString; }
    });
    t.equal(s(m.match('yello world')).v, 'yello world');
  });
  t.end();
});

test('lookahead', t => {
  const m = ohm.grammar('M { start = &"hello" any* }');

  it('recognition', () => {
    assertSucceeds(t, m.match('hello world'));
    assertFails(t, m.match('hell! world'));
  });

  it('semantic actions', () => {
    const s = m.createSemantics().addAttribute('v', {
      start(x, _) {
        return x.primitiveValue;
      }
    });
    t.equal(s(m.match('hello world')).v, 'hello');
  });
  t.end();
});

test('apply', t => {
  test('simple, no left recursion', t => {
    const m = makeGrammar([
      'M {',
      '  easy = foo',
      '  foo = "foo"',
      '}'
    ]);

    it('recognition', () => {
      assertFails(t, m.match('fo'));
      assertSucceeds(t, m.match('foo'));
      assertFails(t, m.match('fooo'));
    });

    it('semantic actions', () => {
      const s = m.createSemantics().addAttribute('v', {
        easy(expr) {
          return ['easy', expr.v];
        },
        foo(expr) {
          return ['foo', expr.v];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('foo')).v, ['easy', ['foo', 'foo']]);
    });
    t.end();
  });

  test('simple left recursion', t => {
    const m = makeGrammar([
      'M {',
      ' number = numberRec | digit',
      'numberRec = number digit',
      '}'
    ]);

    it('recognition', () => {
      assertFails(t, m.match('', 'number'));
      assertFails(t, m.match('a', 'number'));
      assertSucceeds(t, m.match('1', 'number'));
      assertSucceeds(t, m.match('12', 'number'));
      assertSucceeds(t, m.match('123', 'number'));
      assertSucceeds(t, m.match('7276218173', 'number'));
    });

    it('semantic actions', () => {
      const f = m.match('1234', 'number');
      const s = m.createSemantics().addAttribute('v', {
        numberRec(n, d) {
          return n.v * 10 + d.v;
        },
        digit(expr) {
          return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
        },
        _terminal() {
          return this.primitiveValue;
        }
      }).addAttribute('t', {
        number(expr) {
          return ['number', expr.t];
        },
        numberRec(n, d) {
          return ['numberRec', n.t, d.t];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.equal(s(f).v, 1234);
      t.deepEqual(s(f).t,
          ['number',
            ['numberRec',
              ['number',
                ['numberRec',
                  ['number',
                    ['numberRec',
                      ['number', '1'],
                      '2']],
                  '3']],
              '4']]);
    });
    t.end();
  });

  test('simple left recursion, with non-involved rules', t => {
    const m = makeGrammar([
      'M {',
      '  add = addRec | pri',
      '  addRec = add "+" pri',
      '  pri = priX | priY',
      '  priX = "x"',
      '  priY = "y"',
      '}'
    ]);

    it('recognition', () => {
      assertSucceeds(t, m.match('x+y+x', 'add'));
    });

    it('semantic actions', () => {
      const s = m.createSemantics().addAttribute('v', {
        addRec(x, _, y) {
          return [x.v, '+', y.v];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('x+y+x', 'add')).v, [['x', '+', 'y'], '+', 'x']);
    });
    t.end();
  });

  test('indirect left recursion', t => {
    const m = makeGrammar([
      'M {',
      '  number = foo | digit',
      '  foo = bar', '  bar = baz',
      '  baz = qux', '  qux = quux',
      '  quux = numberRec',
      '  numberRec = number digit',
      '}'
    ]);

    it('recognition', () => {
      assertFails(t, m.match('', 'number'));
      assertFails(t, m.match('a', 'number'));
      assertSucceeds(t, m.match('1', 'number'));
      assertSucceeds(t, m.match('123', 'number'));
      assertSucceeds(t, m.match('7276218173', 'number'));
    });

    it('semantic actions', () => {
      const s = m.createSemantics().addAttribute('v', {
        numberRec(n, d) {
          return [n.v, d.v];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('1234', 'number')).v, [[['1', '2'], '3'], '4']);
    });
    t.end();
  });

  test('nested left recursion', t => {
    const m = makeGrammar([
      'M {',
      '  addExp = addExpRec | mulExp',
      '  addExpRec = addExp "+" mulExp',
      '  mulExp = mulExpRec | priExp',
      '  mulExpRec = mulExp "*" priExp',
      '  priExp = "0".."9"',
      '  sss = &addExp addExp',
      '}'
    ]);

    it('recognition', () => {
      assertSucceeds(t, m.match('1'));
      assertSucceeds(t, m.match('2+3'));
      assertFails(t, m.match('4+'));
      assertSucceeds(t, m.match('5*6'));
      assertSucceeds(t, m.match('7*8+9+0'));
    });

    it('semantic actions', () => {
      const f = m.match('1*2+3+4*5');
      const s = m.createSemantics().addAttribute('t', {
        addExp(expr) {
          return ['addExp', expr.t];
        },
        addExpRec(x, _, y) {
          return ['addExpRec', x.t, y.t];
        },
        mulExp(expr) {
          return ['mulExp', expr.t];
        },
        mulExpRec(x, _, y) {
          return ['mulExpRec', x.t, y.t];
        },
        _terminal() {
          return this.primitiveValue;
        }
      }).addAttribute('v', {
        addExp(expr) {
          return expr.v;
        },
        addExpRec(x, _, y) {
          return x.v + y.v;
        },
        mulExp(expr) {
          return expr.v;
        },
        mulExpRec(x, _, y) {
          return x.v * y.v;
        },
        priExp(expr) {
          return parseInt(expr.v);
        },
        _terminal() {
          return this.primitiveValue;
        }
      }).addAttribute('p', {
        addExpRec(x, _, y) {
          return '(' + x.p + '+' + y.p + ')';
        },
        mulExpRec(x, _, y) {
          return '(' + x.p + '*' + y.p + ')';
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(f).t,
          ['addExp',
            ['addExpRec',
              ['addExp',
                ['addExpRec',
                  ['addExp', ['mulExp', ['mulExpRec', ['mulExp', '1'], '2']]],
                  ['mulExp', '3']]],
              ['mulExp', ['mulExpRec', ['mulExp', '4'], '5']]]]);
      t.equal(s(f).v, 25);
      t.equal(s(f).p, '(((1*2)+3)+(4*5))');
    });

    it('semantic actions are evaluated lazily', () => {
      const f = m.match('1*2+3+4*5', 'sss');
      const a = buildTreeNodeWithUniqueId(m);
      const tree =
        ['id', 1, 'addExp',
          ['id', 2, 'addExpRec',
            ['id', 3, 'addExp',
              ['id', 4, 'addExpRec',
                ['id', 5, 'addExp',
                  ['id', 6, 'mulExp',
                    ['id', 7, 'mulExpRec',
                      ['id', 8, 'mulExp',
                        ['id', 9, 'priExp', '1']], '*',
                      ['id', 10, 'priExp', '2']]]], '+',
                ['id', 11, 'mulExp',
                  ['id', 12, 'priExp', '3']]]], '+',
            ['id', 13, 'mulExp',
              ['id', 14, 'mulExpRec',
                ['id', 15, 'mulExp',
                  ['id', 16, 'priExp', '4']], '*',
                ['id', 17, 'priExp', '5']]]]];
      t.deepEqual(a(f), ['id', 0, 'sss', tree, tree]);
      t.equal(a._getNextId(), 18);
    });
    t.end();
  });

  test('nested and indirect left recursion', t => {
    const m = makeGrammar([
      'G {',
      '  addExp = a | c',
      '  a = b',
      '  b = addExpRec',
      '  addExpRec = addExp "+" mulExp',
      '  c = d',
      '  d = mulExp',
      '  mulExp = e | g',
      '  e = f',
      '  f = mulExpRec',
      '  g = h',
      '  h = priExp',
      '  mulExpRec = mulExp "*" priExp',
      '  priExp = "0".."9"',
      '}'
    ]);

    it('recognition', () => {
      assertSucceeds(t, m.match('1'));
      assertSucceeds(t, m.match('2+3'));
      assertFails(t, m.match('4+'));
      assertSucceeds(t, m.match('5*6'));
      assertSucceeds(t, m.match('7+8*9+0'));
    });

    it('semantic actions', () => {
      const s = m.createSemantics().addAttribute('t', {
        addExpRec(x, _, y) {
          return [x.t, '+', y.t];
        },
        mulExpRec(x, _, y) {
          return [x.t, '*', y.t];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('7+8*9+0')).t, [['7', '+', ['8', '*', '9']], '+', '0']);
    });
    t.end();
  });

  test('tricky left recursion (different heads at same position)', t => {
    const m = makeGrammar([
      'G {',
      '  tricky = &foo bar',
      '  foo = fooRec | digit',
      '  fooRec = bar digit',
      '  bar = barRec | digit',
      '  barRec = foo digit',
      '}'
    ]);

    it('recognition', () => {
      assertSucceeds(t, m.match('1234', 'tricky'));
    });

    it('semantic actions', () => {
      const f = m.match('1234', 'tricky');
      // TODO: perhaps just use JSON.stringify(f) here, and compare the result?
      const s = m.createSemantics().addAttribute('t', {
        tricky(_, x) {
          return ['tricky', x.t];
        },
        foo(expr) {
          return ['foo', expr.t];
        },
        fooRec(x, y) {
          return ['fooRec', x.t, y.t];
        },
        bar(expr) {
          return ['bar', expr.t];
        },
        barRec(x, y) {
          return ['barRec', x.t, y.t];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(f).t,
          ['tricky',
            ['bar',
              ['barRec', ['foo', ['fooRec', ['bar', ['barRec', ['foo', '1'], '2']], '3']], '4']]]);
    });
    t.end();
  });
  t.end();
});

test('inheritance', t => {
  test('super-grammar does not exist', t => {
    it('no namespace', () => {
      t.throws(
          () => { ohm.grammar('G2 <: G1 {}'); },
          /Grammar G1 is not declared/);
    });

    it('empty namespace', () => {
      t.throws(
          () => { ohm.grammar('G2 <: G1 {}', {}); },
          /Grammar G1 is not declared in namespace/);
    });
    t.end();
  });

  test('define', t => {
    t.throws(
        () => {
          makeGrammars([
            'G1 { foo = "foo" }',
            'G2 <: G1 { foo = "bar" }'
          ]);
        },
        /Duplicate declaration for rule 'foo' in grammar 'G2' \(originally declared in 'G1'\)/,
        'throws if rule is already declared in super-grammar');
    t.end();
  });

  test('override', t => {
    const ns = makeGrammars(['G1 { number = digit+ }',
      'G2 <: G1 { digit := "a".."z" }']);

    it('should check that rule exists in super-grammar', () => {
      t.throws(
          () => { ohm.grammar('G3 <: G1 { foo := "foo" }', ns); },
          /Cannot override rule foo because it is not declared in G1/);
    });

    it("shouldn't matter if arities aren't the same", () => {
      // It's OK for the semantic action "API" of a grammar to be different
      // from that of its super-grammar.

      // arity(overriding rule) > arity(overridden rule)
      ns.M1 = ohm.grammar('M1 { foo = "foo" }');
      ohm.grammar('M2 <: M1 { foo := "foo" "bar" }', ns);

      // arity(overriding rule) < arity(overridden rule)
      ns.M3 = ohm.grammar('M3 { foo = digit digit }', ns);
      ns.M4 = ohm.grammar('M4 <: M3 { foo := digit }', ns);
    });

    it('should be ok to add new cases', () => {
      t.ok(ohm.grammar('G { space := "foo" -- newCaseLabel }'));
    });

    it('recognition', () => {
      assertSucceeds(t, ns.G1.match('1234', 'number'));
      assertFails(t, ns.G1.match('hello', 'number'));
      assertFails(t, ns.G1.match('h3llo', 'number'));

      assertFails(t, ns.G2.match('1234', 'number'));
      assertSucceeds(t, ns.G2.match('hello', 'number'));
      assertFails(t, ns.G2.match('h3llo', 'number'));
    });

    it('semantic actions', () => {
      const s = ns.G2.createSemantics().addAttribute('v', {
        number(expr) {
          return ['number', expr.v];
        },
        digit(expr) {
          return ['digit', expr.v];
        },
        _terminal() {
          return this.primitiveValue;
        }
      });
      const expected = ['number', [['digit', 'a'], ['digit', 'b'], ['digit', 'c'], ['digit', 'd']]];
      t.deepEqual(s(ns.G2.match('abcd', 'number')).v, expected);
    });
    t.end();
  });

  test('extend', t => {
    const ns = makeGrammars(['G1 { foo = "aaa" "bbb" }',
      'G2 <: G1 { foo += "111" "222" }']);

    it('recognition', () => {
      assertSucceeds(t, ns.G1.match('aaabbb'));
      assertFails(t, ns.G1.match('111222'));

      assertSucceeds(t, ns.G2.match('aaabbb'));
      assertSucceeds(t, ns.G2.match('111222'));
    });

    it('semantic actions', () => {
      const s = ns.G2.createSemantics().addAttribute('v', {
        foo(x, y) {
          return [x.primitiveValue, y.primitiveValue];
        }
      });
      t.deepEqual(s(ns.G2.match('aaabbb')).v, ['aaa', 'bbb']);
      t.deepEqual(s(ns.G2.match('111222')).v, ['111', '222']);
    });

    it('should check that rule exists in super-grammar', () => {
      t.throws(
          () => { ohm.grammar('G3 <: G1 { bar += "bar" }', ns); },
          /Cannot extend rule bar because it is not declared in G1/);
    });

    it('should make sure rule arities are compatible', () => {
      // An extending rule must produce the same number of values
      // as the underlying rule. This is to ensure the semantic
      // action "API" doesn't change.

      // Too many:
      ns.M1 = ohm.grammar('M1 { foo = "foo"  bar = "bar"  baz = "baz" }');
      try {
        ohm.grammar('M2 <: M1 { foo += bar baz }', ns);
        t.fail('Expected an exception to be thrown');
      } catch (e) {
        t.equal(e.message, [
          'Line 1, col 19:',
          '> 1 | M2 <: M1 { foo += bar baz }',
          '                        ^~~~~~~',
          'Rule foo involves an alternation which has inconsistent arity (expected 1, got 2)'
        ].join('\n'));
      }

      // Too few:
      ns.M3 = ohm.grammar('M3 { foo = digit digit }');
      try {
        ohm.grammar('M4 <: M3 { foo += digit }', ns);
        t.fail('Expected an exception to be thrown');
      } catch (e) {
        t.equal(e.message, [
          'Line 1, col 19:',
          '> 1 | M4 <: M3 { foo += digit }',
          '                        ^~~~~',
          'Rule foo involves an alternation which has inconsistent arity (expected 2, got 1)'
        ].join('\n'));
      }
    });

    it('should be ok to add new cases', () => {
      t.ok(ohm.grammar('G { space += "foo" -- newCaseLabel }'));
    });

    t.end();
  });
  t.end();
});

test('override with "..."', t => {
  let g = ohm.grammar('G { letter := "@" | ... }');
  t.equal(g.match('@', 'letter').succeeded(), true);
  t.equal(g.match('a', 'letter').succeeded(), true);

  g = ohm.grammar('G { letter := ... | "@" }');
  t.equal(g.match('@', 'letter').succeeded(), true);
  t.equal(g.match('a', 'letter').succeeded(), true);

  g = ohm.grammar('G { letter := "3" | ... | "@" }');
  t.equal(g.match('@', 'letter').succeeded(), true);
  t.equal(g.match('a', 'letter').succeeded(), true);
  t.equal(g.match('3', 'letter').succeeded(), true);

  t.ok(ohm.grammar('G { letter := ... }'), 'it allows `...` as the whole body');

  // Check that the branches are evaluated in the correct order.
  g = ohm.grammar('G { letter := "" | ... }');
  t.equal(g.match('', 'letter').succeeded(), true);
  t.equal(g.match('a', 'letter').succeeded(), false);
  g = ohm.grammar('G { letter := ... | "ab" }');
  t.equal(g.match('a', 'letter').succeeded(), true);
  t.equal(g.match('ab', 'letter').succeeded(), false);

  g = ohm.grammar(`
    G {
      Start = ListOf<letter, ",">
      ListOf<elem, sep> := "✌️" | ...
    }`);
  t.equal(g.match('✌️').succeeded(), true, 'it works on parameterized rules');

  t.throws(
      () => ohm.grammar('G { doesNotExist := ... }'),
      /Cannot override rule doesNotExist/,
      'it gives the correct error message when overriding non-existent rule');

  t.throws(
      () => ohm.grammar('G { foo = ... }'),
      /Expected "}"/,
      "it's not allowed in a rule definition");

  t.throws(
      () => ohm.grammar('G { letter += ... }'),
      /Expected "}"/,
      "it's not allowed when extending");

  t.throws(
      () => ohm.grammar('G { letter := "@" "#" | ... }'),
      /inconsistent arity/);

  t.throws(
      () => ohm.grammar('G { letter := ... | "@" | ... }'),
      /at most once/,
      "'...' can appear at most once in a rule body");

  /*
    TODO:
    - [ ] improve error message (inconsistent arity seems backwards)
    - [ ] improve error message when using `...` in a rule defintion/extension
    - [ ] unify Extend and Combine?
    - [ ] using '...' when overriding a non-existent rule
  */

  t.end();
});

test('bindings', t => {
  it('inconsistent arity in alts is an error', () => {
    try {
      ohm.grammar('G { foo = "a" "c" | "b" }');
    } catch (e) {
      t.equal(e.message, [
        'Line 1, col 21:',
        '> 1 | G { foo = "a" "c" | "b" }',
        '                          ^~~',
        'Rule foo involves an alternation which has inconsistent arity (expected 2, got 1)'
      ].join('\n'));
    }
  });

  it('by default, bindings are evaluated lazily', () => {
    const g = makeGrammar([
      'G {',
      '  foo = bar baz',
      '  bar = "a"',
      '  baz = "b"',
      '}'
    ]);

    let id = 0;
    let s = g.createSemantics().addAttribute('v', {
      foo(x, y) {
        const xv = x.v;
        const yv = y.v;
        return {
          x: xv,
          y: yv
        };
      },
      bar(expr) {
        return ['bar', expr.v, id++];
      },
      baz(expr) {
        return ['baz', expr.v, id++];
      },
      _terminal() {
        return this.primitiveValue;
      }
    });
    t.deepEqual(s(g.match('ab')).v, {
      x: ['bar', 'a', 0],
      y: ['baz', 'b', 1]
    });

    id = 0;
    s = g.createSemantics().addAttribute('v', {
      foo(x, y) {
        const yv = y.v;
        const xv = x.v;
        return {
          x: xv,
          y: yv
        };
      },
      bar(expr) {
        return ['bar', expr.v, id++];
      },
      baz(expr) {
        return ['baz', expr.v, id++];
      },
      _terminal() {
        return this.primitiveValue;
      }
    });
    t.deepEqual(s(g.match('ab')).v, {
      x: ['bar', 'a', 1],
      y: ['baz', 'b', 0]
    });
  });
  t.end();
});

test('inline rule declarations', t => {
  function makeEval(g) {
    const s = g.createSemantics().addAttribute('v', {
      addExp_plus(x, op, y) {
        return x.v + y.v;
      },
      addExp_minus(x, op, y) {
        return x.v - y.v;
      },
      mulExp_times(x, op, y) {
        return x.v * y.v;
      },
      mulExp_divide(x, op, y) {
        return x.v / y.v;
      },
      priExp_paren(oparen, e, cparen) {
        return e.v;
      },
      number_rec(n, d) {
        return n.v * 10 + d.v;
      },
      digit(expr) {
        return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
      },
      _terminal() {
        return this.primitiveValue;
      }
    });
    return function(node) {
      return s(node).v;
    };
  }

  const ns = {};
  const Arithmetic = ns.Arithmetic = makeGrammar(arithmeticGrammarSource);

  assertSucceeds(t, Arithmetic.match('1*(2+3)-4/5'), 'expr is recognized');
  t.equal(
      makeEval(Arithmetic)(Arithmetic.match('10*(2+123)-4/5')), 1249.2, 'semantic action works');

  const m2 = makeGrammar([
    'Good <: Arithmetic {',
    '  addExp := addExp "~" mulExp  -- minus',
    '           | mulExp',
    '}'], ns);
  t.equal(makeEval(m2)(m2.match('2*3~4')), 2);

  t.throws(
      () => {
        ohm.grammar('Bad <: Arithmetic { addExp += addExp "~" mulExp  -- minus }', ns);
      },
      /rule 'addExp_minus' in grammar 'Bad' \(originally declared in 'Arithmetic'\)/);

  t.throws(
      () => { ohm.grammar('Bad { start = "a" ("b" -- bad\n) }'); },
      /Error/,
      'inline rules must be at the top level');

  t.end();
});

test('lexical vs. syntactic rules', t => {
  it("can't call syntactic rule from lexical rule, not not the other way around", () => {
    t.ok(ohm.grammar('G { foo = bar  bar = "bar" }'), 'lexical calling lexical');
    t.throws(
        () => { ohm.grammar('G { foo = Bar  Bar = "bar" }'); },
        /Cannot apply syntactic rule Bar from here \(inside a lexical context\)/,
        'lexical calling syntactic');
    t.ok(ohm.grammar('G { Foo = bar  bar = "bar" }'), 'syntactic calling lexical');
    t.ok(ohm.grammar('G { Foo = Bar  Bar = "bar" }'), 'syntactic calling syntactic');
  });

  it("lexical rules don't skip spaces implicitly", () => {
    const g = ohm.grammar('G { start = "foo" "bar" }');
    assertSucceeds(t, g.match('foobar', 'start'));
    assertFails(t, g.match('foo bar'));
    assertFails(t, g.match(' foo bar   '));
  });

  it('syntactic rules skip spaces implicitly', () => {
    const g = ohm.grammar('G { Start = "foo" "bar" }');
    assertSucceeds(t, g.match('foobar'));
    assertSucceeds(t, g.match('foo bar'));
    assertSucceeds(t, g.match(' foo bar   '));
  });

  it('mixing lexical and syntactic rules works as expected', () => {
    const g = makeGrammar([
      'G {',
      '  Start = foo bar',
      '  foo = "foo"',
      '  bar = "bar"',
      '}'
    ]);
    assertSucceeds(t, g.match('foobar'));
    assertSucceeds(t, g.match('foo bar'));
    assertSucceeds(t, g.match(' foo bar   '));
  });

  // TODO: write more tests for this operator (e.g., to ensure that it's "transparent", arity-wise)
  // and maybe move it somewhere else.
  it('lexification operator works as expected', () => {
    const g = makeGrammar([
      'G {',
      '  ArrowFun = name #(spacesNoNl "=>") "{}"',
      '  name = "x" | "y"',
      '  spacesNoNl = " "*',
      '}'
    ]);
    assertSucceeds(t, g.match('x => {}'));
    assertSucceeds(t, g.match(' y  =>    \n\n  \n{}'));
    assertFails(t, g.match('x \n  => {}'));

    t.throws(
        () => {
          makeGrammar([
            'G {',
            '  R',
            '    = #("a" R)',
            '    | "b" "c"',
            '}'
          ]);
        },
        /Cannot apply syntactic rule R from here \(inside a lexical context\)/);
  });

  t.end();
});

test('space skipping semantics', t => {
  const g = makeGrammar([
    'G {',
    ' Iter = ">" letter+ #(space)',
    ' Lookahead = ">" &letter #(space letter)',
    ' NegLookahead = ">" ~digit #(space letter)',
    '}'
  ]);
  assertSucceeds(t, g.match('> a b ', 'Iter'), "iter doesn't consume trailing space");
  assertSucceeds(t, g.match('> a', 'Lookahead'), "lookahead doesn't consume anything");
  assertSucceeds(t, g.match('> a', 'NegLookahead'), "negative lookahead doesn't consume anything");
  t.end();
});

test('case-insensitive matching', t => {
  const g = makeGrammar([
    'G {',
    '  start = caseInsensitive<"blerg">',
    '  WithSpaces = "bl" caseInsensitive<"erg">',
    '  withUmlaut = caseInsensitive<"blërg">',
    '  eszett = caseInsensitive<"ß">',
    '  dotlessI = caseInsensitive<"ı">',
    '  dottedI = caseInsensitive<"İ">',
    '  insideRepetition1 = (caseInsensitive<"a">)+',
    '  insideRepetition2 = (caseInsensitive<"a">)*',
    '}'
  ]);
  let result = g.match('BLERG');
  t.equals(result.succeeded(), true);

  const s = g.createSemantics().addAttribute('matchedString', {
    _terminal() { return this.sourceString; },
    _nonterminal(children) {
      return children.map(c => c.matchedString).join('');
    }
  });
  t.equals(s(result).matchedString, 'BLERG');

  result = g.match('bl ErG', 'WithSpaces');
  t.equals(result.succeeded(), true);
  t.equals(s(result).matchedString, 'blErG');

  t.equals(g.match('blËrg', 'withUmlaut').succeeded(), true);

  result = g.match('blErg', 'withUmlaut');
  t.equals(result.failed(), true);
  t.equals(result.shortMessage, 'Line 1, col 1: expected "blërg" (case-insensitive)');

  t.equals(g.match('ı', 'dotlessI').succeeded(), true, 'matches same code point');
  t.equals(g.match('I', 'dotlessI').succeeded(), true, 'matches uppercase dotless I');
  t.equals(g.match('İ', 'dottedI').succeeded(), true, 'matches some code point');

  // Getting this right is really tricky. Our implementation currently doesn't treat "i" and "İ"
  // as being case-insensitive-equal. TODO: Maybe fix this?
  t.equals(g.match('i', 'dottedI').succeeded(), false, "regular i WON'T match uppercase dotted I");

  t.equals(g.match('s', 'eszett').failed(), true);
  t.equals(g.match('ss', 'eszett').failed(), true);

  t.equals(g.match('aaaA', 'insideRepetition1').succeeded(), true, 'works inside +');
  t.equals(g.match('aaaA', 'insideRepetition2').succeeded(), true, 'works inside *');

  t.throws(() => {
    ohm.grammar('G { start = caseInsensitive<start> }');
  }, /Incorrect argument type/, 'throws when argument is not a Terminal');

  // TODO: Maybe allow Ranges here?
  t.throws(() => {
    ohm.grammar('G { start = caseInsensitive<"a".."z"> }');
  }, /Incorrect argument type/, 'throws when argument is a Range');

  t.end();
});

// https://github.com/harc/ohm/issues/282
test('single-line comment after case name (#282)', t => {
  const {ohmGrammar} = ohm;
  assertSucceeds(t, ohmGrammar.match(`G {
    Start = -- foo // ok
          | "x"
  }`));
  assertSucceeds(t, ohmGrammar.match('G {Start = -- foo // A comment\n}'));
  assertSucceeds(t, ohmGrammar.match('G {} // This works too'));
  assertSucceeds(t, ohmGrammar.match('// And this'));

  t.end();
});

test('bootstrap', t => {
  const ns = makeGrammars(ohmGrammarSource);

  it('can recognize arithmetic grammar', () => {
    assertSucceeds(t, ns.Ohm.match(arithmeticGrammarSource, 'Grammar'));
  });

  it('can recognize itself', () => {
    assertSucceeds(t, ns.Ohm.match(ohmGrammarSource, 'Grammar'));
  });

  const g = ohm._buildGrammar(ns.Ohm.match(ohmGrammarSource, 'Grammar'),
      ohm.createNamespace(),
      ns.Ohm);
  assertSucceeds(t, g.match(ohmGrammarSource, 'Grammar'), 'Ohm grammar can recognize itself');

  it('can produce a grammar that works', () => {
    const Arithmetic = ohm._buildGrammar(g.match(arithmeticGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        g);
    const s = Arithmetic.createSemantics().addAttribute('v', {
      exp(expr) {
        return expr.v;
      },
      addExp(expr) {
        return expr.v;
      },
      addExp_plus(x, op, y) {
        return x.v + y.v;
      },
      addExp_minus(x, op, y) {
        return x.v - y.v;
      },
      mulExp(expr) {
        return expr.v;
      },
      mulExp_times(x, op, y) {
        return x.v * y.v;
      },
      mulExp_divide(x, op, y) {
        return x.v / y.v;
      },
      priExp(expr) {
        return expr.v;
      },
      priExp_paren(oparen, e, cparen) {
        return e.v;
      },
      number(expr) {
        return expr.v;
      },
      number_rec(n, d) {
        return n.v * 10 + d.v;
      },
      digit(expr) {
        return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
      },
      _terminal() {
        return this.primitiveValue;
      }
    });
    t.equal(s(Arithmetic.match('10*(2+123)-4/5')).v, 1249.2);
  });

  it('full bootstrap!', () => {
    const g = ohm._buildGrammar(ns.Ohm.match(ohmGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        ns.Ohm);
    const gPrime = ohm._buildGrammar(g.match(ohmGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        g);
    gPrime.namespaceName = g.namespaceName; // make their namespaceName properties the same
    compareGrammars(t, g, gPrime);
  });

  t.end();
});
