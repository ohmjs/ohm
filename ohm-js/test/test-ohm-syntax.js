'use strict';

var test = require('tape-catch');

var fs = require('fs');
var ohm = require('..');
var testUtil = require('./testUtil');

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();
var ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString();

var makeGrammar = testUtil.makeGrammar;
var makeGrammars = testUtil.makeGrammars;

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
    ['namespaceName', 'name', 'ruleDecls', 'rules'].forEach(function(prop) {
      t.deepEqual(actual[prop], expected[prop]);
    });
  }
}

// A stub for Jasmin/RSpec-style tests, for tests that were written before we
// moved to `tape`. New tests shouldn't use this -- instead, they should
// pass a message argument to the assertion functions (e.g. `t.equal`), or
// just put checks in a separate call to `test`.
function it(desc, fn) {
  console.log(desc);  // eslint-disable-line no-console
  fn.call();
}

function buildTreeNodeWithUniqueId(g) {
  var nextId = 0;
  var s = g.createSemantics().addAttribute('tree', {
    _nonterminal: function(children) {
      return ['id', nextId++, this.ctorName]
          .concat(children.map(function(child) { return child.tree; }));
    },
    _terminal: function() {
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

test('char', function(t) {
  var m = ohm.grammar('M { bang = "!" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  assertSucceeds(t, m.match('!'));
  assertFails(t, m.match('!a'));
  assertFails(t, m.match(''));
  var cst = m.match('!');
  t.equal(s(cst).v, '!');
  t.end();
});

test('string', function(t) {
  var m = ohm.grammar('M { foo = "foo\\b\\n\\r\\t\\\\\\"\\u01bcff\\x8f" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  assertSucceeds(t, m.match('foo\b\n\r\t\\"\u01bcff\x8f'));
  assertFails(t, m.match('foo1'));
  assertFails(t, m.match('bar'));

  var cst = m.match('foo\b\n\r\t\\"\u01bcff\x8f');
  t.equal(s(cst).v, 'foo\b\n\r\t\\"\u01bcff\x8f');

  t.throws(function() { ohm.grammar('G { r = "\\w" }'); },
           /Expected "\\""/,
           'unrecognized escape characters are parse errors');
  t.end();
});

test('unicode', function(t) {
  var m = ohm.grammar('M {}');

  test('recognition', function(t) {
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

  test('semantic actions', function(t) {
    var s = m.createSemantics().addAttribute('v', {
      _terminal: function() {
        return this.primitiveValue + this.primitiveValue;
      }
    });
    var r = m.match('\u01C0', 'letter');
    t.equal(s(r).v, '\u01C0\u01C0');
    t.end();
  });
  t.end();
});

test('ranges', function(t) {
  var m = ohm.grammar('M { charRange = "0".."9" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  assertSucceeds(t, m.match('6', 'charRange'));
  assertFails(t, m.match('x', 'charRange'));
  t.equal(s(m.match('4', 'charRange')).v, '4');

  t.throws(
      function() { ohm.grammar('M { charRange = "ab".."c" }'); },
      /Expected "}"/,
      'from-terminal must have length 1');
  t.throws(
      function() { ohm.grammar('M { charRange = "ab".."cd" }'); },
      /Expected "}"/,
      'from-terminal must have length 1');
  t.throws(
      function() { ohm.grammar('M { charRange = "a".."bc" }'); },
      /Expected "\\""/,
      'to-terminal must have length 1');

  t.end();
});

test('alt', function(t) {
  var m = ohm.grammar('M { altTest = "a" | "b" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  it('recognition', function() {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  it('semantic actions', function() {
    t.equal(s(m.match('a')).v, 'a');
    t.equal(s(m.match('b')).v, 'b');
  });
  t.end();
});

test('rule bodies in defs can start with a |, and it\'s a no-op', function(t) {
  var m = ohm.grammar('M { altTest = | "a" | "b" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  it('recognition', function() {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  it('semantic actions', function() {
    t.equal(s(m.match('a')).v, 'a');
    t.equal(s(m.match('b')).v, 'b');
  });
  t.end();
});

test('rule bodies in overrides can start with a |, and it\'s a no-op', function(t) {
  var m = ohm.grammar('M { space := | "a" | "b" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  it('recognition', function() {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertFails(t, m.match(' ', 'space'));
    assertFails(t, m.match('\t', 'space'));
  });

  it('semantic actions', function() {
    t.equal(s(m.match('a', 'space')).v, 'a');
    t.equal(s(m.match('b', 'space')).v, 'b');
  });
  t.end();
});

test('rule bodies in extends can start with a |, and it\'s a no-op', function(t) {
  var m = ohm.grammar('M { space += | "a" | "b" }');
  var s = m.createSemantics().addAttribute('v', {
    _terminal: function() {
      return this.primitiveValue;
    }
  });

  it('recognition', function() {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertSucceeds(t, m.match(' ', 'space'));
    assertSucceeds(t, m.match('\t', 'space'));
  });

  it('semantic actions', function() {
    t.equal(s(m.match('a', 'space')).v, 'a');
    t.equal(s(m.match('b', 'space')).v, 'b');
  });
  t.end();
});

test('seq', function(t) {
  test('without bindings', function(t) {
    var m = ohm.grammar('M { start = "a" "bc" "z" }');

    it('recognition', function() {
      assertFails(t, m.match('a'));
      assertFails(t, m.match('bc'));
      assertSucceeds(t, m.match('abcz'));
      assertFails(t, m.match('abbz'));
    });

    it('semantic actions', function() {
      var f = m.match('abcz');
      var s = m.createSemantics().addAttribute('v', {
        start: function(x, y, z) {
          return [x.sourceString, y.sourceString, z.sourceString];
        }
      });
      t.deepEqual(s(f).v, ['a', 'bc', 'z']);
    });
    t.end();
  });

  test('with exactly one binding', function(t) {
    var m = ohm.grammar('M { start = "a" "bc" "z" }');

    it('recognition', function() {
      assertFails(t, m.match('a'));
      assertFails(t, m.match('bc'));
      assertSucceeds(t, m.match('abcz'));
      assertFails(t, m.match('abbz'));
    });

    it('semantic actions', function() {
      var f = m.match('abcz');
      var s = m.createSemantics().addAttribute('v', {
        start: function(a, _bc, _z) {
          return a.primitiveValue;
        }
      });
      t.deepEqual(s(f).v, 'a');
    });
    t.end();
  });

  test('with more than one binding', function(t) {
    var m = ohm.grammar('M { start = "a" "bc" "z" }');

    it('recognition', function() {
      assertFails(t, m.match('a'));
      assertFails(t, m.match('bc'));
      assertSucceeds(t, m.match('abcz'));
      assertFails(t, m.match('abbz'));
    });

    it('semantic actions', function() {
      var f = m.match('abcz');
      var s = m.createSemantics().addAttribute('v', {
        start: function(x, _, y) {
          return [x.primitiveValue, y.primitiveValue];
        }
      });
      t.deepEqual(s(f).v, ['a', 'z']);
    });
    t.end();
  });
  t.end();
});

test('alts and seqs together', function(t) {
  var m = ohm.grammar('M { start = "a" "b" "c" | "1" "2" "3" }');

  it('recognition', function() {
    assertFails(t, m.match('ab'));
    assertFails(t, m.match('12'));
    assertSucceeds(t, m.match('abc'));
    assertSucceeds(t, m.match('123'));
  });

  it('semantic actions', function() {
    var s = m.createSemantics().addAttribute('v', {
      start: function(x, _, y) {
        return [x.primitiveValue, y.primitiveValue];
      }
    });
    t.deepEqual(s(m.match('abc')).v, ['a', 'c']);
    t.deepEqual(s(m.match('123')).v, ['1', '3']);
  });

  t.end();
});

test('kleene-* and kleene-+', function(t) {
  var m = makeGrammar([
    'M {',
    '  number = digit+',
    '  digits = digit*',
    '  sss = &number number',
    '}'
  ]);

  it('recognition', function() {
    assertFails(t, m.match('1234a', 'number'));
    assertSucceeds(t, m.match('1234', 'number'));
    assertSucceeds(t, m.match('5', 'number'));
    assertFails(t, m.match('', 'number'));

    assertFails(t, m.match('1234a', 'digits'));
    assertSucceeds(t, m.match('1234', 'digits'));
    assertSucceeds(t, m.match('5', 'digits'));
    assertSucceeds(t, m.match('', 'digits'));
  });

  it('semantic actions', function() {
    var s = m.createSemantics().addAttribute('v', {
      number: function(expr) {
        return ['digits', expr.v];
      },
      digit: function(expr) {
        return ['digit', expr.v];
      },
      _terminal: function() {
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

  it('semantic actions are evaluated lazily', function() {
    var a = buildTreeNodeWithUniqueId(m);
    var tree = ['id', 1, 'number', [
      ['id', 2, 'digit', '1'],
      ['id', 3, 'digit', '2'],
      ['id', 4, 'digit', '3']
    ]];
    t.deepEqual(a(m.match('123', 'sss')), ['id', 0, 'sss', tree, tree]);
    t.equal(a._getNextId(), 5);
  });
  t.end();
});

test('opt', function(t) {
  var m = ohm.grammar('M { name = "dr"? "warth" }');

  it('recognition', function() {
    assertSucceeds(t, m.match('drwarth'));
    assertSucceeds(t, m.match('warth'));
    assertFails(t, m.match('mrwarth'));
  });

  it('semantic actions', function() {
    var s = m.createSemantics().addAttribute('v', {
      name: function(title, last) {
        return [title.children.length === 1 ? title.v[0] : undefined, last.primitiveValue];
      },
      _terminal: function() {
        return this.primitiveValue;
      }
    });
    t.deepEqual(s(m.match('drwarth')).v, ['dr', 'warth']);
    t.deepEqual(s(m.match('warth')).v, [undefined, 'warth']);
  });
  t.end();
});

test('not', function(t) {
  var m = ohm.grammar('M { start = ~"hello" any* }');

  it('recognition', function() {
    assertSucceeds(t, m.match('yello world'));
    assertFails(t, m.match('hello world'));
  });

  it('semantic actions', function() {
    var s = m.createSemantics().addAttribute('v', {
      start: function(x) { return x.sourceString; }
    });
    t.equal(s(m.match('yello world')).v, 'yello world');
  });
  t.end();
});

test('lookahead', function(t) {
  var m = ohm.grammar('M { start = &"hello" any* }');

  it('recognition', function() {
    assertSucceeds(t, m.match('hello world'));
    assertFails(t, m.match('hell! world'));
  });

  it('semantic actions', function() {
    var s = m.createSemantics().addAttribute('v', {
      start: function(x, _) {
        return x.primitiveValue;
      }
    });
    t.equal(s(m.match('hello world')).v, 'hello');
  });
  t.end();
});

test('apply', function(t) {
  test('simple, no left recursion', function(t) {
    var m = makeGrammar([
      'M {',
      '  easy = foo',
      '  foo = "foo"',
      '}'
    ]);

    it('recognition', function() {
      assertFails(t, m.match('fo'));
      assertSucceeds(t, m.match('foo'));
      assertFails(t, m.match('fooo'));
    });

    it('semantic actions', function() {
      var s = m.createSemantics().addAttribute('v', {
        easy: function(expr) {
          return ['easy', expr.v];
        },
        foo: function(expr) {
          return ['foo', expr.v];
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('foo')).v, ['easy', ['foo', 'foo']]);
    });
    t.end();
  });

  test('simple left recursion', function(t) {
    var m = makeGrammar([
      'M {',
      ' number = numberRec | digit',
      'numberRec = number digit',
      '}'
    ]);

    it('recognition', function() {
      assertFails(t, m.match('', 'number'));
      assertFails(t, m.match('a', 'number'));
      assertSucceeds(t, m.match('1', 'number'));
      assertSucceeds(t, m.match('12', 'number'));
      assertSucceeds(t, m.match('123', 'number'));
      assertSucceeds(t, m.match('7276218173', 'number'));
    });

    it('semantic actions', function() {
      var f = m.match('1234', 'number');
      var s = m.createSemantics().addAttribute('v', {
        numberRec: function(n, d) {
          return n.v * 10 + d.v;
        },
        digit: function(expr) {
          return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      }).addAttribute('t', {
        number: function(expr) {
          return ['number', expr.t];
        },
        numberRec: function(n, d) {
          return ['numberRec', n.t, d.t];
        },
        _terminal: function() {
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

  test('simple left recursion, with non-involved rules', function(t) {
    var m = makeGrammar([
      'M {',
      '  add = addRec | pri',
      '  addRec = add "+" pri',
      '  pri = priX | priY',
      '  priX = "x"',
      '  priY = "y"',
      '}'
    ]);

    it('recognition', function() {
      assertSucceeds(t, m.match('x+y+x', 'add'));
    });

    it('semantic actions', function() {
      var s = m.createSemantics().addAttribute('v', {
        addRec: function(x, _, y) {
          return [x.v, '+', y.v];
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('x+y+x', 'add')).v, [['x', '+', 'y'], '+', 'x']);
    });
    t.end();
  });

  test('indirect left recursion', function(t) {
    var m = makeGrammar([
      'M {',
      '  number = foo | digit',
      '  foo = bar', '  bar = baz',
      '  baz = qux', '  qux = quux',
      '  quux = numberRec',
      '  numberRec = number digit',
      '}'
    ]);

    it('recognition', function() {
      assertFails(t, m.match('', 'number'));
      assertFails(t, m.match('a', 'number'));
      assertSucceeds(t, m.match('1', 'number'));
      assertSucceeds(t, m.match('123', 'number'));
      assertSucceeds(t, m.match('7276218173', 'number'));
    });

    it('semantic actions', function() {
      var s = m.createSemantics().addAttribute('v', {
        numberRec: function(n, d) {
          return [n.v, d.v];
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('1234', 'number')).v, [[['1', '2'], '3'], '4']);
    });
    t.end();
  });

  test('nested left recursion', function(t) {
    var m = makeGrammar([
      'M {',
      '  addExp = addExpRec | mulExp',
      '  addExpRec = addExp "+" mulExp',
      '  mulExp = mulExpRec | priExp',
      '  mulExpRec = mulExp "*" priExp',
      '  priExp = "0".."9"',
      '  sss = &addExp addExp',
      '}'
    ]);

    it('recognition', function() {
      assertSucceeds(t, m.match('1'));
      assertSucceeds(t, m.match('2+3'));
      assertFails(t, m.match('4+'));
      assertSucceeds(t, m.match('5*6'));
      assertSucceeds(t, m.match('7*8+9+0'));
    });

    it('semantic actions', function() {
      var f = m.match('1*2+3+4*5');
      var s = m.createSemantics().addAttribute('t', {
        addExp: function(expr) {
          return ['addExp', expr.t];
        },
        addExpRec: function(x, _, y) {
          return ['addExpRec', x.t, y.t];
        },
        mulExp: function(expr) {
          return ['mulExp', expr.t];
        },
        mulExpRec: function(x, _, y) {
          return ['mulExpRec', x.t, y.t];
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      }).addAttribute('v', {
        addExp: function(expr) {
          return expr.v;
        },
        addExpRec: function(x, _, y) {
          return x.v + y.v;
        },
        mulExp: function(expr) {
          return expr.v;
        },
        mulExpRec: function(x, _, y) {
          return x.v * y.v;
        },
        priExp: function(expr) {
          return parseInt(expr.v);
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      }).addAttribute('p', {
        addExpRec: function(x, _, y) {
          return '(' + x.p + '+' + y.p + ')';
        },
        mulExpRec: function(x, _, y) {
          return '(' + x.p + '*' + y.p + ')';
        },
        _terminal: function() {
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

    it('semantic actions are evaluated lazily', function() {
      var f = m.match('1*2+3+4*5', 'sss');
      var a = buildTreeNodeWithUniqueId(m);
      var tree =
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

  test('nested and indirect left recursion', function(t) {
    var m = makeGrammar([
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

    it('recognition', function() {
      assertSucceeds(t, m.match('1'));
      assertSucceeds(t, m.match('2+3'));
      assertFails(t, m.match('4+'));
      assertSucceeds(t, m.match('5*6'));
      assertSucceeds(t, m.match('7+8*9+0'));
    });

    it('semantic actions', function() {
      var s = m.createSemantics().addAttribute('t', {
        addExpRec: function(x, _, y) {
          return [x.t, '+', y.t];
        },
        mulExpRec: function(x, _, y) {
          return [x.t, '*', y.t];
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      });
      t.deepEqual(s(m.match('7+8*9+0')).t, [['7', '+', ['8', '*', '9']], '+', '0']);
    });
    t.end();
  });

  test('tricky left recursion (different heads at same position)', function(t) {
    var m = makeGrammar([
      'G {',
      '  tricky = &foo bar',
      '  foo = fooRec | digit',
      '  fooRec = bar digit',
      '  bar = barRec | digit',
      '  barRec = foo digit',
      '}'
    ]);

    it('recognition', function() {
      assertSucceeds(t, m.match('1234', 'tricky'));
    });

    it('semantic actions', function() {
      var f = m.match('1234', 'tricky');
      // TODO: perhaps just use JSON.stringify(f) here, and compare the result?
      var s = m.createSemantics().addAttribute('t', {
        tricky: function(_, x) {
          return ['tricky', x.t];
        },
        foo: function(expr) {
          return ['foo', expr.t];
        },
        fooRec: function(x, y) {
          return ['fooRec', x.t, y.t];
        },
        bar: function(expr) {
          return ['bar', expr.t];
        },
        barRec: function(x, y) {
          return ['barRec', x.t, y.t];
        },
        _terminal: function() {
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

test('inheritance', function(t) {
  test('super-grammar does not exist', function(t) {
    it('no namespace', function() {
      t.throws(
          function() { ohm.grammar('G2 <: G1 {}'); },
          /Grammar G1 is not declared/);
    });

    it('empty namespace', function() {
      t.throws(
          function() { ohm.grammar('G2 <: G1 {}', {}); },
          /Grammar G1 is not declared in namespace/);
    });
    t.end();
  });

  test('define', function(t) {
    t.throws(
        function() {
          makeGrammars([
            'G1 { foo = "foo" }',
            'G2 <: G1 { foo = "bar" }'
          ]);
        },
        /Duplicate declaration for rule 'foo' in grammar 'G2' \(originally declared in 'G1'\)/,
        'throws if rule is already declared in super-grammar');
    t.end();
  });

  test('override', function(t) {
    var ns = makeGrammars(['G1 { number = digit+ }',
                           'G2 <: G1 { digit := "a".."z" }']);

    it('should check that rule exists in super-grammar', function() {
      t.throws(
          function() { ohm.grammar('G3 <: G1 { foo := "foo" }', ns); },
          /Cannot override rule foo because it is not declared in G1/);
    });

    it("shouldn't matter if arities aren't the same", function() {
      // It's OK for the semantic action "API" of a grammar to be different
      // from that of its super-grammar.

      // arity(overriding rule) > arity(overridden rule)
      ns.M1 = ohm.grammar('M1 { foo = "foo" }');
      ohm.grammar('M2 <: M1 { foo := "foo" "bar" }', ns);

      // arity(overriding rule) < arity(overridden rule)
      ns.M3 = ohm.grammar('M3 { foo = digit digit }', ns);
      ns.M4 = ohm.grammar('M4 <: M3 { foo := digit }', ns);
    });

    it('should be ok to add new cases', function() {
      t.ok(ohm.grammar('G { space := "foo" -- newCaseLabel }'));
    });

    it('recognition', function() {
      assertSucceeds(t, ns.G1.match('1234', 'number'));
      assertFails(t, ns.G1.match('hello', 'number'));
      assertFails(t, ns.G1.match('h3llo', 'number'));

      assertFails(t, ns.G2.match('1234', 'number'));
      assertSucceeds(t, ns.G2.match('hello', 'number'));
      assertFails(t, ns.G2.match('h3llo', 'number'));
    });

    it('semantic actions', function() {
      var s = ns.G2.createSemantics().addAttribute('v', {
        number: function(expr) {
          return ['number', expr.v];
        },
        digit: function(expr) {
          return ['digit', expr.v];
        },
        _terminal: function() {
          return this.primitiveValue;
        }
      });
      var expected = ['number', [['digit', 'a'], ['digit', 'b'], ['digit', 'c'], ['digit', 'd']]];
      t.deepEqual(s(ns.G2.match('abcd', 'number')).v, expected);
    });
    t.end();
  });

  test('extend', function(t) {
    var ns = makeGrammars(['G1 { foo = "aaa" "bbb" }',
                                'G2 <: G1 { foo += "111" "222" }']);

    it('recognition', function() {
      assertSucceeds(t, ns.G1.match('aaabbb'));
      assertFails(t, ns.G1.match('111222'));

      assertSucceeds(t, ns.G2.match('aaabbb'));
      assertSucceeds(t, ns.G2.match('111222'));
    });

    it('semantic actions', function() {
      var s = ns.G2.createSemantics().addAttribute('v', {
        foo: function(x, y) {
          return [x.primitiveValue, y.primitiveValue];
        }
      });
      t.deepEqual(s(ns.G2.match('aaabbb')).v, ['aaa', 'bbb']);
      t.deepEqual(s(ns.G2.match('111222')).v, ['111', '222']);
    });

    it('should check that rule exists in super-grammar', function() {
      t.throws(
          function() { ohm.grammar('G3 <: G1 { bar += "bar" }', ns); },
          /Cannot extend rule bar because it is not declared in G1/);
    });

    it('should make sure rule arities are compatible', function() {
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

    it('should be ok to add new cases', function() {
      t.ok(ohm.grammar('G { space += "foo" -- newCaseLabel }'));
    });

    t.end();
  });
  t.end();
});

test('bindings', function(t) {
  it('inconsistent arity in alts is an error', function() {
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

  it('by default, bindings are evaluated lazily', function() {
    var g = makeGrammar([
      'G {',
      '  foo = bar baz',
      '  bar = "a"',
      '  baz = "b"',
      '}'
    ]);

    var id = 0;
    var s = g.createSemantics().addAttribute('v', {
      foo: function(x, y) {
        var xv = x.v;
        var yv = y.v;
        return {
          x: xv,
          y: yv
        };
      },
      bar: function(expr) {
        return ['bar', expr.v, id++];
      },
      baz: function(expr) {
        return ['baz', expr.v, id++];
      },
      _terminal: function() {
        return this.primitiveValue;
      }
    });
    t.deepEqual(s(g.match('ab')).v, {
      x: ['bar', 'a', 0],
      y: ['baz', 'b', 1]
    });

    id = 0;
    s = g.createSemantics().addAttribute('v', {
      foo: function(x, y) {
        var yv = y.v;
        var xv = x.v;
        return {
          x: xv,
          y: yv
        };
      },
      bar: function(expr) {
        return ['bar', expr.v, id++];
      },
      baz: function(expr) {
        return ['baz', expr.v, id++];
      },
      _terminal: function() {
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

test('inline rule declarations', function(t) {
  function makeEval(g) {
    var s = g.createSemantics().addAttribute('v', {
      addExp_plus: function(x, op, y) {
        return x.v + y.v;
      },
      addExp_minus: function(x, op, y) {
        return x.v - y.v;
      },
      mulExp_times: function(x, op, y) {
        return x.v * y.v;
      },
      mulExp_divide: function(x, op, y) {
        return x.v / y.v;
      },
      priExp_paren: function(oparen, e, cparen) {
        return e.v;
      },
      number_rec: function(n, d) {
        return n.v * 10 + d.v;
      },
      digit: function(expr) {
        return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
      },
      _terminal: function() {
        return this.primitiveValue;
      }
    });
    return function(node) {
      return s(node).v;
    };
  }

  var ns = {};
  var Arithmetic = ns.Arithmetic = makeGrammar(arithmeticGrammarSource);

  assertSucceeds(t, Arithmetic.match('1*(2+3)-4/5'), 'expr is recognized');
  t.equal(
      makeEval(Arithmetic)(Arithmetic.match('10*(2+123)-4/5')), 1249.2, 'semantic action works');

  var m2 = makeGrammar([
    'Good <: Arithmetic {',
    '  addExp := addExp "~" mulExp  -- minus',
    '           | mulExp',
    '}'], ns);
  t.equal(makeEval(m2)(m2.match('2*3~4')), 2);

  t.throws(
    function() { ohm.grammar('Bad <: Arithmetic { addExp += addExp "~" mulExp  -- minus }', ns); },
    /rule 'addExp_minus' in grammar 'Bad' \(originally declared in 'Arithmetic'\)/);

  t.throws(
    function() { ohm.grammar('Bad { start = "a" ("b" -- bad\n) }'); },
    /Error/,
    'inline rules must be at the top level');

  t.end();
});

test('lexical vs. syntactic rules', function(t) {
  it("can't call syntactic rule from lexical rule, not not the other way around", function() {
    t.ok(ohm.grammar('G { foo = bar  bar = "bar" }'), 'lexical calling lexical');
    t.throws(
        function() { ohm.grammar('G { foo = Bar  Bar = "bar" }'); },
        /Cannot apply syntactic rule Bar from here \(inside a lexical context\)/,
        'lexical calling syntactic');
    t.ok(ohm.grammar('G { Foo = bar  bar = "bar" }'), 'syntactic calling lexical');
    t.ok(ohm.grammar('G { Foo = Bar  Bar = "bar" }'), 'syntactic calling syntactic');
  });

  it("lexical rules don't skip spaces implicitly", function() {
    var g = ohm.grammar('G { start = "foo" "bar" }');
    assertSucceeds(t, g.match('foobar', 'start'));
    assertFails(t, g.match('foo bar'));
    assertFails(t, g.match(' foo bar   '));
  });

  it('syntactic rules skip spaces implicitly', function() {
    var g = ohm.grammar('G { Start = "foo" "bar" }');
    assertSucceeds(t, g.match('foobar'));
    assertSucceeds(t, g.match('foo bar'));
    assertSucceeds(t, g.match(' foo bar   '));
  });

  it('mixing lexical and syntactic rules works as expected', function() {
    var g = makeGrammar([
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
  it('lexification operator works as expected', function() {
    var g = makeGrammar([
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
        function() {
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

test('space skipping semantics', function(t) {
  var g = makeGrammar([
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

test('case-insensitive matching', function(t) {
  var g = makeGrammar([
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
  var result = g.match('BLERG');
  t.equals(result.succeeded(), true);

  var s = g.createSemantics().addAttribute('matchedString', {
    _terminal: function() { return this.sourceString; },
    _nonterminal: function(children) {
      return children.map(function(c) { return c.matchedString; }).join('');
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

  t.throws(function() {
    ohm.grammar('G { start = caseInsensitive<start> }');
  }, /Incorrect argument type/, 'throws when argument is not a Terminal');

  // TODO: Maybe allow Ranges here?
  t.throws(function() {
    ohm.grammar('G { start = caseInsensitive<"a".."z"> }');
  }, /Incorrect argument type/, 'throws when argument is a Range');

  t.end();
});

test('bootstrap', function(t) {
  var ns = makeGrammars(ohmGrammarSource);

  it('can recognize arithmetic grammar', function() {
    assertSucceeds(t, ns.Ohm.match(arithmeticGrammarSource, 'Grammar'));
  });

  it('can recognize itself', function() {
    assertSucceeds(t, ns.Ohm.match(ohmGrammarSource, 'Grammar'));
  });

  var g = ohm._buildGrammar(ns.Ohm.match(ohmGrammarSource, 'Grammar'),
                            ohm.createNamespace(),
                            ns.Ohm);
  assertSucceeds(t, g.match(ohmGrammarSource, 'Grammar'), 'Ohm grammar can recognize itself');

  it('can produce a grammar that works', function() {
    var Arithmetic = ohm._buildGrammar(g.match(arithmeticGrammarSource, 'Grammar'),
                                       ohm.createNamespace(),
                                       g);
    var s = Arithmetic.createSemantics().addAttribute('v', {
      exp: function(expr) {
        return expr.v;
      },
      addExp: function(expr) {
        return expr.v;
      },
      addExp_plus: function(x, op, y) {
        return x.v + y.v;
      },
      addExp_minus: function(x, op, y) {
        return x.v - y.v;
      },
      mulExp: function(expr) {
        return expr.v;
      },
      mulExp_times: function(x, op, y) {
        return x.v * y.v;
      },
      mulExp_divide: function(x, op, y) {
        return x.v / y.v;
      },
      priExp: function(expr) {
        return expr.v;
      },
      priExp_paren: function(oparen, e, cparen) {
        return e.v;
      },
      number: function(expr) {
        return expr.v;
      },
      number_rec: function(n, d) {
        return n.v * 10 + d.v;
      },
      digit: function(expr) {
        return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
      },
      _terminal: function() {
        return this.primitiveValue;
      }
    });
    t.equal(s(Arithmetic.match('10*(2+123)-4/5')).v, 1249.2);
  });

  it('full bootstrap!', function() {
    var g = ohm._buildGrammar(ns.Ohm.match(ohmGrammarSource, 'Grammar'),
                              ohm.createNamespace(),
                              ns.Ohm);
    var gPrime = ohm._buildGrammar(g.match(ohmGrammarSource, 'Grammar'),
                                   ohm.createNamespace(),
                                   g);
    gPrime.namespaceName = g.namespaceName; // make their namespaceName properties the same
    compareGrammars(t, g, gPrime);
  });

  t.end();
});
