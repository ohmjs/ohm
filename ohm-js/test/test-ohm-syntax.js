'use strict';

const test = require('ava-spec');

const fs = require('fs');
const ohm = require('..');
const testUtil = require('./helpers/testUtil');

const arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();
const ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString();

const {describe} = test;

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

  t.is(typeof actual, typeof expected);
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

function buildTreeNodeWithUniqueId(g) {
  let nextId = 0;
  const s = g.createSemantics().addAttribute('tree', {
    _nonterminal(children) {
      return ['id', nextId++, this.ctorName].concat(children.map(child => child.tree));
    },
    _terminal() {
      return this.primitiveValue;
    }
  });

  function makeTree(node) {
    return s(node).tree;
  }
  makeTree._getNextId = function() {
    return nextId;
  };
  return makeTree;
}

function assertSucceeds(t, matchResult, optMessage) {
  t.is(matchResult.succeeded(), true, optMessage);
  t.is(matchResult.failed(), false, optMessage);
}

function assertFails(t, matchResult, optMessage) {
  t.is(matchResult.succeeded(), false, optMessage);
  t.is(matchResult.failed(), true, optMessage);
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
  t.is(s(cst).v, '!');
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
  t.is(s(cst).v, 'foo\b\n\r\t\\"\u01bcff\x8f');

  t.throws(
      () => {
        ohm.grammar('G { r = "\\w" }');
      },
      {message: /Expected "\\""/},
      'unrecognized escape characters are parse errors'
  );
});

describe('unicode', test => {
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
  });

  test('semantic actions', t => {
    const s = m.createSemantics().addAttribute('v', {
      _terminal() {
        return this.primitiveValue + this.primitiveValue;
      }
    });
    const r = m.match('\u01C0', 'letter');
    t.is(s(r).v, '\u01C0\u01C0');
  });
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
  t.is(s(m.match('4', 'charRange')).v, '4');

  t.throws(
      () => {
        ohm.grammar('M { charRange = "ab".."c" }');
      },
      {message: /Expected "}"/},
      'from-terminal must have length 1'
  );
  t.throws(
      () => {
        ohm.grammar('M { charRange = "ab".."cd" }');
      },
      {message: /Expected "}"/},
      'from-terminal must have length 1'
  );
  t.throws(
      () => {
        ohm.grammar('M { charRange = "a".."bc" }');
      },
      {message: /Expected "\\""/},
      'to-terminal must have length 1'
  );
});

describe('alt', test => {
  const m = ohm.grammar('M { altTest = "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  test('recognition', t => {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  test('semantic actions', t => {
    t.is(s(m.match('a')).v, 'a');
    t.is(s(m.match('b')).v, 'b');
  });
});

describe("rule bodies in defs can start with a |, and it's a no-op", test => {
  const m = ohm.grammar('M { altTest = | "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  test('recognition', t => {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  test('semantic actions', t => {
    t.is(s(m.match('a')).v, 'a');
    t.is(s(m.match('b')).v, 'b');
  });
});

describe("rule bodies in overrides can start with a |, and it's a no-op", test => {
  const m = ohm.grammar('M { space := | "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  test('recognition', t => {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertFails(t, m.match(' ', 'space'));
    assertFails(t, m.match('\t', 'space'));
  });

  test('semantic actions', t => {
    t.is(s(m.match('a', 'space')).v, 'a');
    t.is(s(m.match('b', 'space')).v, 'b');
  });
});

describe("rule bodies in extends can start with a |, and it's a no-op", test => {
  const m = ohm.grammar('M { space += | "a" | "b" }');
  const s = m.createSemantics().addAttribute('v', {
    _terminal() {
      return this.primitiveValue;
    }
  });

  test('recognition', t => {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertSucceeds(t, m.match(' ', 'space'));
    assertSucceeds(t, m.match('\t', 'space'));
  });

  test('semantic actions', t => {
    t.is(s(m.match('a', 'space')).v, 'a');
    t.is(s(m.match('b', 'space')).v, 'b');
  });
});

describe('seq', test => {
  const m = ohm.grammar('M { start = "a" "bc" "z" }');
  test('recognition', t => {
    assertFails(t, m.match('a'));
    assertFails(t, m.match('bc'));
    assertSucceeds(t, m.match('abcz'));
    assertFails(t, m.match('abbz'));
  });

  test('semantic actions', t => {
    const f = m.match('abcz');
    const s = m.createSemantics().addAttribute('v', {
      start(x, y, z) {
        return [x.sourceString, y.sourceString, z.sourceString];
      }
    });
    t.deepEqual(s(f).v, ['a', 'bc', 'z']);
  });
});

describe('alts and seqs together', test => {
  const m = ohm.grammar('M { start = "a" "b" "c" | "1" "2" "3" }');

  test('recognition', t => {
    assertFails(t, m.match('ab'));
    assertFails(t, m.match('12'));
    assertSucceeds(t, m.match('abc'));
    assertSucceeds(t, m.match('123'));
  });

  test('semantic actions', t => {
    const s = m.createSemantics().addAttribute('v', {
      start(x, _, y) {
        return [x.primitiveValue, y.primitiveValue];
      }
    });
    t.deepEqual(s(m.match('abc')).v, ['a', 'c']);
    t.deepEqual(s(m.match('123')).v, ['1', '3']);
  });
});

describe('kleene-* and kleene-+', test => {
  const m = makeGrammar([
    'M {',
    '  number = digit+',
    '  digits = digit*',
    '  sss = &number number',
    '}'
  ]);

  test('recognition', t => {
    assertFails(t, m.match('1234a', 'number'));
    assertSucceeds(t, m.match('1234', 'number'));
    assertSucceeds(t, m.match('5', 'number'));
    assertFails(t, m.match('', 'number'));

    assertFails(t, m.match('1234a', 'digits'));
    assertSucceeds(t, m.match('1234', 'digits'));
    assertSucceeds(t, m.match('5', 'digits'));
    assertSucceeds(t, m.match('', 'digits'));
  });

  test('semantic actions', t => {
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
      'digits',
      [
        ['digit', '1'],
        ['digit', '2'],
        ['digit', '3'],
        ['digit', '4']
      ]
    ]);
  });

  test('semantic actions are evaluated lazily', t => {
    const a = buildTreeNodeWithUniqueId(m);
    const tree = [
      'id',
      1,
      'number',
      [
        ['id', 2, 'digit', '1'],
        ['id', 3, 'digit', '2'],
        ['id', 4, 'digit', '3']
      ]
    ];
    t.deepEqual(a(m.match('123', 'sss')), ['id', 0, 'sss', tree, tree]);
    t.is(a._getNextId(), 5);
  });
});

describe('opt', test => {
  const m = ohm.grammar('M { name = "dr"? "warth" }');

  test('recognition', t => {
    assertSucceeds(t, m.match('drwarth'));
    assertSucceeds(t, m.match('warth'));
    assertFails(t, m.match('mrwarth'));
  });

  test('semantic actions', t => {
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
});

describe('not', test => {
  const m = ohm.grammar('M { start = ~"hello" any* }');

  test('recognition', t => {
    assertSucceeds(t, m.match('yello world'));
    assertFails(t, m.match('hello world'));
  });

  test('semantic actions', t => {
    const s = m.createSemantics().addAttribute('v', {
      start(x) {
        return x.sourceString;
      }
    });
    t.is(s(m.match('yello world')).v, 'yello world');
  });
});

describe('lookahead', test => {
  const m = ohm.grammar('M { start = &"hello" any* }');

  test('recognition', t => {
    assertSucceeds(t, m.match('hello world'));
    assertFails(t, m.match('hell! world'));
  });

  test('semantic actions', t => {
    const s = m.createSemantics().addAttribute('v', {
      start(x, _) {
        return x.primitiveValue;
      }
    });
    t.is(s(m.match('hello world')).v, 'hello');
  });
});

describe('simple left recursion', test => {
  const m = makeGrammar(['M {', ' number = numberRec | digit', 'numberRec = number digit', '}']);

  test('recognition', t => {
    assertFails(t, m.match('', 'number'));
    assertFails(t, m.match('a', 'number'));
    assertSucceeds(t, m.match('1', 'number'));
    assertSucceeds(t, m.match('12', 'number'));
    assertSucceeds(t, m.match('123', 'number'));
    assertSucceeds(t, m.match('7276218173', 'number'));
  });

  test('semantic actions', t => {
    const f = m.match('1234', 'number');
    const s = m
        .createSemantics()
        .addAttribute('v', {
          numberRec(n, d) {
            return n.v * 10 + d.v;
          },
          digit(expr) {
            return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
          },
          _terminal() {
            return this.primitiveValue;
          }
        })
        .addAttribute('t', {
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
    t.is(s(f).v, 1234);
    t.deepEqual(s(f).t, [
      'number',
      [
        'numberRec',
        ['number', ['numberRec', ['number', ['numberRec', ['number', '1'], '2']], '3']],
        '4'
      ]
    ]);
  });

  describe('simple left recursion, with non-involved rules', test => {
    const m = makeGrammar([
      'M {',
      '  add = addRec | pri',
      '  addRec = add "+" pri',
      '  pri = priX | priY',
      '  priX = "x"',
      '  priY = "y"',
      '}'
    ]);

    test('recognition', t => {
      assertSucceeds(t, m.match('x+y+x', 'add'));
    });

    test('semantic actions', t => {
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
  });

  describe('indirect left recursion', test => {
    const m = makeGrammar([
      'M {',
      '  number = foo | digit',
      '  foo = bar',
      '  bar = baz',
      '  baz = qux',
      '  qux = quux',
      '  quux = numberRec',
      '  numberRec = number digit',
      '}'
    ]);

    test('recognition', t => {
      assertFails(t, m.match('', 'number'));
      assertFails(t, m.match('a', 'number'));
      assertSucceeds(t, m.match('1', 'number'));
      assertSucceeds(t, m.match('123', 'number'));
      assertSucceeds(t, m.match('7276218173', 'number'));
    });

    test('semantic actions', t => {
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
  });

  describe('nested left recursion', test => {
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

    test('recognition', t => {
      assertSucceeds(t, m.match('1'));
      assertSucceeds(t, m.match('2+3'));
      assertFails(t, m.match('4+'));
      assertSucceeds(t, m.match('5*6'));
      assertSucceeds(t, m.match('7*8+9+0'));
    });

    test('semantic actions', t => {
      const f = m.match('1*2+3+4*5');
      const s = m
          .createSemantics()
          .addAttribute('t', {
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
          })
          .addAttribute('v', {
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
          })
          .addAttribute('p', {
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
      t.deepEqual(s(f).t, [
        'addExp',
        [
          'addExpRec',
          [
            'addExp',
            [
              'addExpRec',
              ['addExp', ['mulExp', ['mulExpRec', ['mulExp', '1'], '2']]],
              ['mulExp', '3']
            ]
          ],
          ['mulExp', ['mulExpRec', ['mulExp', '4'], '5']]
        ]
      ]);
      t.is(s(f).v, 25);
      t.is(s(f).p, '(((1*2)+3)+(4*5))');
    });

    test('semantic actions are evaluated lazily', t => {
      const f = m.match('1*2+3+4*5', 'sss');
      const a = buildTreeNodeWithUniqueId(m);
      const tree = [
        'id',
        1,
        'addExp',
        [
          'id',
          2,
          'addExpRec',
          [
            'id',
            3,
            'addExp',
            [
              'id',
              4,
              'addExpRec',
              [
                'id',
                5,
                'addExp',
                [
                  'id',
                  6,
                  'mulExp',
                  [
                    'id',
                    7,
                    'mulExpRec',
                    ['id', 8, 'mulExp', ['id', 9, 'priExp', '1']],
                    '*',
                    ['id', 10, 'priExp', '2']
                  ]
                ]
              ],
              '+',
              ['id', 11, 'mulExp', ['id', 12, 'priExp', '3']]
            ]
          ],
          '+',
          [
            'id',
            13,
            'mulExp',
            [
              'id',
              14,
              'mulExpRec',
              ['id', 15, 'mulExp', ['id', 16, 'priExp', '4']],
              '*',
              ['id', 17, 'priExp', '5']
            ]
          ]
        ]
      ];
      t.deepEqual(a(f), ['id', 0, 'sss', tree, tree]);
      t.is(a._getNextId(), 18);
    });
  });

  describe('nested and indirect left recursion', test => {
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

    test('recognition', t => {
      assertSucceeds(t, m.match('1'));
      assertSucceeds(t, m.match('2+3'));
      assertFails(t, m.match('4+'));
      assertSucceeds(t, m.match('5*6'));
      assertSucceeds(t, m.match('7+8*9+0'));
    });

    test('semantic actions', t => {
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
  });

  describe('tricky left recursion (different heads at same position)', test => {
    const m = makeGrammar([
      'G {',
      '  tricky = &foo bar',
      '  foo = fooRec | digit',
      '  fooRec = bar digit',
      '  bar = barRec | digit',
      '  barRec = foo digit',
      '}'
    ]);

    test('recognition', t => {
      assertSucceeds(t, m.match('1234', 'tricky'));
    });

    test('semantic actions', t => {
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
      t.deepEqual(s(f).t, [
        'tricky',
        ['bar', ['barRec', ['foo', ['fooRec', ['bar', ['barRec', ['foo', '1'], '2']], '3']], '4']]
      ]);
    });
  });
});

describe('inheritance', t => {
  test('no namespace', t => {
    t.throws(
        () => {
          ohm.grammar('G2 <: G1 {}');
        },
        {message: /Grammar G1 is not declared/}
    );
  });

  test('empty namespace', t => {
    t.throws(
        () => {
          ohm.grammar('G2 <: G1 {}', {});
        },
        {message: /Grammar G1 is not declared in namespace/}
    );
  });

  test('duplicate definition', t => {
    t.throws(
        () => {
          makeGrammars(['G1 { foo = "foo" }', 'G2 <: G1 { foo = "bar" }']);
        },
        {
          // eslint-disable-next-line max-len
          message: /Duplicate declaration for rule 'foo' in grammar 'G2' \(originally declared in 'G1'\)/
        },
        'throws if rule is already declared in super-grammar'
    );
  });

  describe('override', test => {
    const ns = makeGrammars(['G1 { number = digit+ }', 'G2 <: G1 { digit := "a".."z" }']);

    test('it checks that rule exists in super-grammar', t => {
      t.throws(
          () => {
            ohm.grammar('G3 <: G1 { foo := "foo" }', ns);
          },
          {message: /Cannot override rule foo because it is not declared in G1/}
      );
    });

    test("shouldn't matter if arities aren't the same", t => {
      // It's OK for the semantic action "API" of a grammar to be different
      // from that of its super-grammar.

      // arity(overriding rule) > arity(overridden rule)
      ns.M1 = ohm.grammar('M1 { foo = "foo" }');
      ohm.grammar('M2 <: M1 { foo := "foo" "bar" }', ns);

      // arity(overriding rule) < arity(overridden rule)
      ns.M3 = ohm.grammar('M3 { foo = digit digit }', ns);
      ns.M4 = ohm.grammar('M4 <: M3 { foo := digit }', ns);
      t.pass();
    });

    test('should be ok to add new cases', t => {
      t.truthy(ohm.grammar('G { space := "foo" -- newCaseLabel }'));
    });

    test('recognition', t => {
      assertSucceeds(t, ns.G1.match('1234', 'number'));
      assertFails(t, ns.G1.match('hello', 'number'));
      assertFails(t, ns.G1.match('h3llo', 'number'));

      assertFails(t, ns.G2.match('1234', 'number'));
      assertSucceeds(t, ns.G2.match('hello', 'number'));
      assertFails(t, ns.G2.match('h3llo', 'number'));
    });

    test('semantic actions', t => {
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
      const expected = [
        'number',
        [
          ['digit', 'a'],
          ['digit', 'b'],
          ['digit', 'c'],
          ['digit', 'd']
        ]
      ];
      t.deepEqual(s(ns.G2.match('abcd', 'number')).v, expected);
    });
  });

  describe('extend', test => {
    const ns = makeGrammars(['G1 { foo = "aaa" "bbb" }', 'G2 <: G1 { foo += "111" "222" }']);

    test('recognition', t => {
      assertSucceeds(t, ns.G1.match('aaabbb'));
      assertFails(t, ns.G1.match('111222'));

      assertSucceeds(t, ns.G2.match('aaabbb'));
      assertSucceeds(t, ns.G2.match('111222'));
    });

    test('semantic actions', t => {
      const s = ns.G2.createSemantics().addAttribute('v', {
        foo(x, y) {
          return [x.primitiveValue, y.primitiveValue];
        }
      });
      t.deepEqual(s(ns.G2.match('aaabbb')).v, ['aaa', 'bbb']);
      t.deepEqual(s(ns.G2.match('111222')).v, ['111', '222']);
    });

    test('should check that rule exists in super-grammar', t => {
      t.throws(
          () => {
            ohm.grammar('G3 <: G1 { bar += "bar" }', ns);
          },
          {message: /Cannot extend rule bar because it is not declared in G1/}
      );
    });

    test('should make sure rule arities are compatible', t => {
      // An extending rule must produce the same number of values
      // as the underlying rule. This is to ensure the semantic
      // action "API" doesn't change.

      // Too many:
      ns.M1 = ohm.grammar('M1 { foo = "foo"  bar = "bar"  baz = "baz" }');
      try {
        ohm.grammar('M2 <: M1 { foo += bar baz }', ns);
        t.fail('Expected an exception to be thrown');
      } catch (e) {
        t.is(
            e.message,
            [
              'Line 1, col 19:',
              '> 1 | M2 <: M1 { foo += bar baz }',
              '                        ^~~~~~~',
              'Rule foo involves an alternation which has inconsistent arity (expected 1, got 2)'
            ].join('\n')
        );
      }

      // Too few:
      ns.M3 = ohm.grammar('M3 { foo = digit digit }');
      try {
        ohm.grammar('M4 <: M3 { foo += digit }', ns);
        t.fail('Expected an exception to be thrown');
      } catch (e) {
        t.is(
            e.message,
            [
              'Line 1, col 19:',
              '> 1 | M4 <: M3 { foo += digit }',
              '                        ^~~~~',
              'Rule foo involves an alternation which has inconsistent arity (expected 2, got 1)'
            ].join('\n')
        );
      }
    });

    test('should be ok to add new cases', t => {
      t.truthy(ohm.grammar('G { space += "foo" -- newCaseLabel }'));
    });
  });
});

test('override with "..."', t => {
  let g = ohm.grammar('G { letter := "@" | ... }');
  t.is(g.match('@', 'letter').succeeded(), true);
  t.is(g.match('a', 'letter').succeeded(), true);

  g = ohm.grammar('G { letter := ... | "@" }');
  t.is(g.match('@', 'letter').succeeded(), true);
  t.is(g.match('a', 'letter').succeeded(), true);

  g = ohm.grammar('G { letter := "3" | ... | "@" }');
  t.is(g.match('@', 'letter').succeeded(), true);
  t.is(g.match('a', 'letter').succeeded(), true);
  t.is(g.match('3', 'letter').succeeded(), true);

  t.truthy(ohm.grammar('G { letter := ... }'), 'it allows `...` as the whole body');

  // Check that the branches are evaluated in the correct order.
  g = ohm.grammar('G { letter := "" | ... }');
  t.is(g.match('', 'letter').succeeded(), true);
  t.is(g.match('a', 'letter').succeeded(), false);
  g = ohm.grammar('G { letter := ... | "ab" }');
  t.is(g.match('a', 'letter').succeeded(), true);
  t.is(g.match('ab', 'letter').succeeded(), false);

  g = ohm.grammar(`
    G {
      Start = ListOf<letter, ",">
      ListOf<elem, sep> := "✌️" | ...
    }`);
  t.is(g.match('✌️').succeeded(), true, 'it works on parameterized rules');

  t.throws(
      () => ohm.grammar('G { doesNotExist := ... }'),
      {message: /Cannot override rule doesNotExist/},
      'it gives the correct error message when overriding non-existent rule'
  );

  t.throws(
      () => ohm.grammar('G { foo = ... }'),
      {message: /Expected "}"/},
      "it's not allowed in a rule definition"
  );

  t.throws(
      () => ohm.grammar('G { letter += ... }'),
      {message: /Expected "}"/},
      "it's not allowed when extending"
  );

  t.throws(() => ohm.grammar('G { letter := "@" "#" | ... }'), {
    message: /inconsistent arity/
  });

  t.throws(
      () => ohm.grammar('G { letter := ... | "@" | ... }'),
      {message: /at most once/},
      "'...' can appear at most once in a rule body"
  );

  /*
    TODO:
    - [ ] improve error message (inconsistent arity seems backwards)
    - [ ] improve error message when using `...` in a rule defintion/extension
    - [ ] unify Extend and Combine?
    - [ ] using '...' when overriding a non-existent rule
  */
});

describe('bindings', test => {
  test('inconsistent arity in alts is an error', t => {
    try {
      ohm.grammar('G { foo = "a" "c" | "b" }');
    } catch (e) {
      t.is(
          e.message,
          [
            'Line 1, col 21:',
            '> 1 | G { foo = "a" "c" | "b" }',
            '                          ^~~',
            'Rule foo involves an alternation which has inconsistent arity (expected 2, got 1)'
          ].join('\n')
      );
    }
  });

  test('by default, bindings are evaluated lazily', t => {
    const g = makeGrammar(['G {', '  foo = bar baz', '  bar = "a"', '  baz = "b"', '}']);

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
  const Arithmetic = (ns.Arithmetic = makeGrammar(arithmeticGrammarSource));

  assertSucceeds(t, Arithmetic.match('1*(2+3)-4/5'), 'expr is recognized');
  t.is(makeEval(Arithmetic)(Arithmetic.match('10*(2+123)-4/5')), 1249.2, 'semantic action works');

  const m2 = makeGrammar([
    'Good <: Arithmetic {',
    '  addExp := addExp "~" mulExp  -- minus',
    '           | mulExp',
    '}'],
  ns
  );
  t.is(makeEval(m2)(m2.match('2*3~4')), 2);

  t.throws(
      () => {
        ohm.grammar('Bad <: Arithmetic { addExp += addExp "~" mulExp  -- minus }', ns);
      },
      {
        message: /rule 'addExp_minus' in grammar 'Bad' \(originally declared in 'Arithmetic'\)/
      }
  );

  t.throws(
      () => {
        ohm.grammar('Bad { start = "a" ("b" -- bad\n) }');
      },
      null,
      'inline rules must be at the top level'
  );
});

describe('lexical vs. syntactic rules', test => {
  test("can't call syntactic rule from lexical rule, not not the other way around", t => {
    t.truthy(ohm.grammar('G { foo = bar  bar = "bar" }'), 'lexical calling lexical');
    t.throws(
        () => {
          ohm.grammar('G { foo = Bar  Bar = "bar" }');
        },
        {
          message: /Cannot apply syntactic rule Bar from here \(inside a lexical context\)/
        },
        'lexical calling syntactic'
    );
    t.truthy(ohm.grammar('G { Foo = bar  bar = "bar" }'), 'syntactic calling lexical');
    t.truthy(ohm.grammar('G { Foo = Bar  Bar = "bar" }'), 'syntactic calling syntactic');
  });

  test("lexical rules don't skip spaces implicitly", t => {
    const g = ohm.grammar('G { start = "foo" "bar" }');
    assertSucceeds(t, g.match('foobar', 'start'));
    assertFails(t, g.match('foo bar'));
    assertFails(t, g.match(' foo bar   '));
  });

  test('syntactic rules skip spaces implicitly', t => {
    const g = ohm.grammar('G { Start = "foo" "bar" }');
    assertSucceeds(t, g.match('foobar'));
    assertSucceeds(t, g.match('foo bar'));
    assertSucceeds(t, g.match(' foo bar   '));
  });

  test('mixing lexical and syntactic rules works as expected', t => {
    const g = makeGrammar(['G {', '  Start = foo bar', '  foo = "foo"', '  bar = "bar"', '}']);
    assertSucceeds(t, g.match('foobar'));
    assertSucceeds(t, g.match('foo bar'));
    assertSucceeds(t, g.match(' foo bar   '));
  });

  // TODO: write more tests for this operator (e.g., to ensure that it's "transparent", arity-wise)
  // and maybe move it somewhere else.
  test('lexification operator works as expected', t => {
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
          makeGrammar(['G {', '  R', '    = #("a" R)', '    | "b" "c"', '}']);
        },
        {
          message: /Cannot apply syntactic rule R from here \(inside a lexical context\)/
        }
    );
  });
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
  t.is(result.succeeded(), true);

  const s = g.createSemantics().addAttribute('matchedString', {
    _terminal() {
      return this.sourceString;
    },
    _nonterminal(children) {
      return children.map(c => c.matchedString).join('');
    }
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

// https://github.com/harc/ohm/issues/282
test('single-line comment after case name (#282)', t => {
  const {ohmGrammar} = ohm;
  assertSucceeds(
      t,
      ohmGrammar.match(`G {
    Start = -- foo // ok
          | "x"
  }`)
  );
  assertSucceeds(t, ohmGrammar.match('G {Start = -- foo // A comment\n}'));
  assertSucceeds(t, ohmGrammar.match('G {} // This works too'));
  assertSucceeds(t, ohmGrammar.match('// And this'));
});

describe('bootstrap', test => {
  const ns = makeGrammars(ohmGrammarSource);

  test('it can recognize arithmetic grammar', t => {
    assertSucceeds(t, ns.Ohm.match(arithmeticGrammarSource, 'Grammar'));
  });

  test('it can recognize itself', t => {
    assertSucceeds(t, ns.Ohm.match(ohmGrammarSource, 'Grammar'));
  });

  test('it can produce a grammar that works', t => {
    const g = ohm._buildGrammar(
        ns.Ohm.match(ohmGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        ns.Ohm
    );
    assertSucceeds(t, g.match(ohmGrammarSource, 'Grammar'), 'Ohm grammar can recognize itself');
    const Arithmetic = ohm._buildGrammar(
        g.match(arithmeticGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        g
    );
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
    t.is(s(Arithmetic.match('10*(2+123)-4/5')).v, 1249.2);
  });

  test('full bootstrap!', t => {
    const g = ohm._buildGrammar(
        ns.Ohm.match(ohmGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        ns.Ohm
    );
    const gPrime = ohm._buildGrammar(
        g.match(ohmGrammarSource, 'Grammar'),
        ohm.createNamespace(),
        g
    );
    gPrime.namespaceName = g.namespaceName; // make their namespaceName properties the same
    compareGrammars(t, g, gPrime);
  });
});
