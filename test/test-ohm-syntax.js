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
  // them. So we ignore that property here, concentrating on ruleBodies
  // and other "real" properties of each grammar.

  t.equal(typeof actual, typeof expected);
  // ^ e.g. when one is undefined and the other isn't

  if (expected && actual) {
    compareGrammars(t, expected.superGrammar, actual.superGrammar);
    // In the list below, we exclude superGrammar (just tested above)
    // and constructors (for reasons given above).
    ['namespaceName', 'name', 'ruleDecls', 'ruleBodies'].forEach(function(prop) {
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
  var s = g.semantics().addAttribute('tree', {
    _nonterminal: function(children) {
      return ['id', nextId++, this.ctorName]
          .concat(children.map(function(child) { return child.tree; }));
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

test('primitive patterns', function(t) {
  test('any', function(t) {
    var m = ohm.grammar('M { }');

    test('direct match, no stream', function(t) {
      it('recognition', function() {
        assertSucceeds(t, m.match(5, 'any'), 'any matches 5');
        assertSucceeds(t, m.match(null, 'any'), 'any matches null');
      });

      it('semantic actions', function() {
        var s = m.semantics().addAttribute('v', {});
        t.equal(s(m.match(5, 'any')).v, 5, 'SA on 5');
        t.equal(s(m.match(null, 'any')).v, null, 'SA on null');
      });
      t.end();
    });

    test('match in string stream', function(t) {
      it('recognition', function() {
        assertSucceeds(t, m.match('5', 'any'));
        assertFails(t, m.match('', 'any'));
      });

      it('semantic actions', function() {
        var s = m.semantics().addAttribute('v', {});
        t.equal(s(m.match('5', 'any')).v, '5');
      });
      t.end();
    });

    test('match in list stream', function(t) {
      it('recognition', function() {
        assertSucceeds(t, m.match(['123'], 'any'));
      });

      it('semantic actions', function() {
        var s = m.semantics().addAttribute('v', {});
        t.deepEqual(s(m.match(['123'], 'any')).v, ['123']);
      });
      t.end();
    });
    t.end();
  });

  test('direct match, no stream', function(t) {
    var m = makeGrammar([
      'M {',
      '  five = 5',
      '  _true = true',
      '  _false = false',
      '  _null = null',
      '}'
    ]);

    it('recognition', function() {
      assertSucceeds(t, m.match(5));
      assertFails(t, m.match(2));
      assertFails(t, m.match('a'));
      assertFails(t, m.match('5'));
      assertFails(t, m.match('true'));
      assertFails(t, m.match(true));
      assertFails(t, m.match('false'));
      assertFails(t, m.match(false));
      assertFails(t, m.match(null));
      assertFails(t, m.match(undefined));

      assertFails(t, m.match(5, '_true'));
      assertFails(t, m.match(2, '_true'));
      assertFails(t, m.match('a', '_true'));
      assertFails(t, m.match('5', '_true'));
      assertFails(t, m.match('true', '_true'));
      assertSucceeds(t, m.match(true, '_true'));
      assertFails(t, m.match('false', '_true'));
      assertFails(t, m.match(false, '_true'));
      assertFails(t, m.match(null, '_true'));
      assertFails(t, m.match(undefined, '_true'));

      assertFails(t, m.match(5, '_false'));
      assertFails(t, m.match(2, '_false'));
      assertFails(t, m.match('a', '_false'));
      assertFails(t, m.match('5', '_false'));
      assertFails(t, m.match('true', '_false'));
      assertFails(t, m.match(true, '_false'));
      assertFails(t, m.match('false', '_false'));
      assertSucceeds(t, m.match(false, '_false'));
      assertFails(t, m.match(null, '_false'));
      assertFails(t, m.match(undefined, '_false'));

      assertFails(t, m.match(5, '_null'));
      assertFails(t, m.match(2, '_null'));
      assertFails(t, m.match('a', '_null'));
      assertFails(t, m.match('5', '_null'));
      assertFails(t, m.match('true', '_null'));
      assertFails(t, m.match(true, '_null'));
      assertFails(t, m.match('false', '_null'));
      assertFails(t, m.match(false, '_null'));
      assertSucceeds(t, m.match(null, '_null'));
      assertFails(t, m.match(undefined, '_null'));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {});
      t.equal(s(m.match(5)).v, 5);
      t.equal(s(m.match(true, '_true')).v, true);
      t.equal(s(m.match(false, '_false')).v, false);
      t.equal(s(m.match(null, '_null')).v, null);
    });
    t.end();
  });

  test('match in string stream', function(t) {
    var m = makeGrammar([
      'M {',
      '  five = 5',
      '  _true = true',
      '  _false = false',
      '  _null = null',
      '}'
    ]);
    it('recognition', function() {
      assertFails(t, m.match('!'));
      assertFails(t, m.match('5'));
      assertFails(t, m.match('2'));
      assertFails(t, m.match(''));
      assertFails(t, m.match('true', '_true'));
      assertFails(t, m.match('false', '_false'));
      assertFails(t, m.match('null', '_null'));
    });
    t.end();
  });
  t.end();
});

test('char', function(t) {
  var m = ohm.grammar('M { bang = "!" }');

  test('direct match, no stream', function(t) {
    it('recognition', function() {
      assertSucceeds(t, m.match('!'));
      assertFails(t, m.match('!a'));
      assertFails(t, m.match(5));
      assertFails(t, m.match(''));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {});
      var cst = m.match('!');
      t.equal(s(cst).v, '!');
    });
    t.end();
  });

  test('match in string stream', function(t) {
    it('recognition', function() {
      assertSucceeds(t, m.match('!'));
      assertFails(t, m.match('a'));
      assertFails(t, m.match(''));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {});
      var cst = m.match('!');
      t.equal(s(cst).v, '!');
    });
    t.end();
  });
  t.end();
});

test('string', function(t) {
  var m = ohm.grammar('M { foo = "foo\\b\\n\\r\\t\\\\\\\"\\u01bcff\\x8f" }');

  test('direct match, no stream', function(t) {
    it('recognition', function() {
      assertSucceeds(t, m.match('foo\b\n\r\t\\"\u01bcff\x8f'));
      assertFails(t, m.match('foo1'));
      assertFails(t, m.match('bar'));
      assertFails(t, m.match(null));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {});
      var cst = m.match('foo\b\n\r\t\\"\u01bcff\x8f');
      t.equal(s(cst).v, 'foo\b\n\r\t\\"\u01bcff\x8f');
    });

    it('unrecognized escape characters are parse errors', function() {
      t.throws(
          function() { ohm.grammar('G { r = "\\w" }'); },
          'Expected \"\\\"\"');
    });

    t.end();
  });

  test('match in string stream', function(t) {
    it('recognition', function() {
      assertSucceeds(t, m.match('foo\b\n\r\t\\"\u01bcff\x8f'));
      assertFails(t, m.match('foo1'));
      assertFails(t, m.match('bar'));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {});
      var cst = m.match('foo\b\n\r\t\\"\u01bcff\x8f');
      t.equal(s(cst).v, 'foo\b\n\r\t\\"\u01bcff\x8f');
    });
    t.end();
  });
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
    var s = m.semantics().addAttribute('v', {
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
  var m = ohm.grammar('M { charRange = "0".."9"  intRange = 5..131  strRange = ["bb".."foobar"] }');

  test('recognition', function(t) {
    assertSucceeds(t, m.match('6', 'charRange'));
    assertFails(t, m.match('x', 'charRange'));
    assertFails(t, m.match(6, 'charRange'));

    assertSucceeds(t, m.match(5, 'intRange'));
    assertSucceeds(t, m.match(6, 'intRange'));
    assertSucceeds(t, m.match(120, 'intRange'));
    assertSucceeds(t, m.match(131, 'intRange'));
    assertFails(t, m.match(132, 'intRange'));
    assertFails(t, m.match('x', 'intRange'));
    assertFails(t, m.match('100', 'intRange'));

    assertFails(t, m.match(['aa'], 'strRange'));
    assertSucceeds(t, m.match(['bb'], 'strRange'));
    assertSucceeds(t, m.match(['bc'], 'strRange'));
    assertSucceeds(t, m.match(['cc'], 'strRange'));
    assertSucceeds(t, m.match(['ccsa'], 'strRange'));
    assertSucceeds(t, m.match(['doo-a-dee-dee'], 'strRange'));
    assertSucceeds(t, m.match(['foo'], 'strRange'));
    assertSucceeds(t, m.match(['foobar'], 'strRange'));
    assertSucceeds(t, m.match(['foobaar'], 'strRange'));
    assertFails(t, m.match(['foobarr'], 'strRange'));
    assertFails(t, m.match(['xxasdf'], 'strRange'));
    assertFails(t, m.match([4]));
    assertFails(t, m.match(['foo']));

    t.end();
  });

  test('semantic actions', function(t) {
    var s = m.semantics().addAttribute('v', {});
    t.equal(s(m.match('4', 'charRange')).v, '4');
    t.equal(s(m.match(40, 'intRange')).v, 40);
    t.equal(s(m.match(['foo'], 'strRange')).v, 'foo');
    t.end();
  });

  t.end();
});

test('alt', function(t) {
  var m = ohm.grammar('M { altTest = "a" | "b" }');

  it('recognition', function() {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  it('semantic actions', function() {
    var s = m.semantics().addAttribute('v', {});
    t.equal(s(m.match('a')).v, 'a');
    t.equal(s(m.match('b')).v, 'b');
  });
  t.end();
});

test('rule bodies in defs can start with a |, and it\'s a no-op', function(t) {
  var m = ohm.grammar('M { altTest = | "a" | "b" }');

  it('recognition', function() {
    assertFails(t, m.match(''));
    assertSucceeds(t, m.match('a'));
    assertSucceeds(t, m.match('b'));
    assertFails(t, m.match('ab'));
  });

  it('semantic actions', function() {
    var s = m.semantics().addAttribute('v', {});
    t.equal(s(m.match('a')).v, 'a');
    t.equal(s(m.match('b')).v, 'b');
  });
  t.end();
});

test('rule bodies in overrides can start with a |, and it\'s a no-op', function(t) {
  var m = ohm.grammar('M { space := | "a" | "b" }');

  it('recognition', function() {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertFails(t, m.match(' ', 'space'));
    assertFails(t, m.match('\t', 'space'));
  });

  it('semantic actions', function() {
    var s = m.semantics().addAttribute('v', {});
    t.equal(s(m.match('a', 'space')).v, 'a');
    t.equal(s(m.match('b', 'space')).v, 'b');
  });
  t.end();
});

test('rule bodies in extends can start with a |, and it\'s a no-op', function(t) {
  var m = ohm.grammar('M { space += | "a" | "b" }');

  it('recognition', function() {
    assertFails(t, m.match('', 'space'));
    assertSucceeds(t, m.match('a', 'space'));
    assertSucceeds(t, m.match('b', 'space'));
    assertSucceeds(t, m.match(' ', 'space'));
    assertSucceeds(t, m.match('\t', 'space'));
  });

  it('semantic actions', function() {
    var s = m.semantics().addAttribute('v', {});
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
      var s = m.semantics().addAttribute('v', {
        start: function(x, y, z) {
          return [x.interval.contents, y.interval.contents, z.interval.contents];
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
      var s = m.semantics().addAttribute('v', {
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
      var s = m.semantics().addAttribute('v', {
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
    var s = m.semantics().addAttribute('v', {
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
    var s = m.semantics().addAttribute('v', {
      number: function(expr) {
        return ['digits', expr.v];
      },
      digit: function(expr) {
        return ['digit', expr.v];
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
    var s = m.semantics().addAttribute('v', {
      name: function(title, last) {
        return [title.children.length === 1 ? title.v[0] : undefined, last.primitiveValue];
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
    var s = m.semantics().addAttribute('v', {
      start: function(x) {
        return x.interval.contents;
      }
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
    var s = m.semantics().addAttribute('v', {
      start: function(x, _) {
        return x.primitiveValue;
      }
    });
    t.equal(s(m.match('hello world')).v, 'hello');
  });
  t.end();
});

test('arr', function(t) {
  var m = ohm.grammar('M { start = ["abc" &any ["d" "ef"] "g"] }');

  it('recognition', function() {
    assertSucceeds(t, m.match(['abc', ['d', 'ef'], 'g']));
    assertFails(t, m.match(['abc', ['def'], 'g']));
    assertFails(t, m.match(['abc', 'def', 'g']));
    assertFails(t, m.match(['abc', ['d', 'ef', 'oops'], 'g']));
    assertFails(t, m.match(['abc', ['d', 'ef'], 'gh']));
    assertFails(t, m.match(['abc', [5], 'g']));
    assertFails(t, m.match(['abc', [], 'g']));
    assertFails(t, m.match(['abc', 5, 'g']));
  });

  it('semantic actions', function() {
    var s = m.semantics().addAttribute('v', {
      start: function(_abc, y, x, _ef, _g) {
        return [x.v, y.v];
      }
    });
    t.deepEqual(s(m.match(['abc', ['d', 'ef'], 'g'])).v, ['d', ['d', 'ef']]);
  });
  t.end();
});

test('obj', function(t) {
  var m = makeGrammar([
    'M {',
    '  strict  = {x: 1, y: (2)}',
    '  lenient = {x: 1, y: (2), ...}',
    '  withStringProps = {foos: $("foo"*), bar: $"bar"}',
    '}'
  ]);

  test('strict', function(t) {
    it('recognition', function() {
      assertFails(t, m.match('foo', 'strict'));
      assertFails(t, m.match([], 'strict'));
      assertFails(t, m.match({y: 2}, 'strict'));
      assertSucceeds(t, m.match({x: 1, y: 2}, 'strict'));
      assertSucceeds(t, m.match({y: 2, x: 1}, 'strict'));
      assertFails(t, m.match({x: 1, y: 2, z: 3}, 'strict'));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {
        strict: function(a, b) {
          return [a.primitiveValue, b.primitiveValue];
        }
      });
      t.deepEqual(s(m.match({x: 1, y: 2}, 'strict')).v, [1, 2]);
      t.deepEqual(s(m.match({y: 2, x: 1}, 'strict')).v, [1, 2]);
    });
    t.end();
  });

  test('lenient', function(t) {
    it('recognition', function() {
      assertFails(t, m.match('foo', 'lenient'));
      assertFails(t, m.match([], 'lenient'));
      assertFails(t, m.match({y: 2}, 'lenient'));
      assertSucceeds(t, m.match({x: 1, y: 2}, 'lenient'));
      assertSucceeds(t, m.match({y: 2, x: 1}, 'lenient'));
      assertSucceeds(t, m.match({x: 1, y: 2, z: 3}, 'lenient'));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {
        lenient: function(a, b, _) {
          return [a.primitiveValue, b.primitiveValue];
        }
      });
      t.deepEqual(s(m.match({x: 1, y: 2}, 'lenient')).v, [1, 2]);
      t.deepEqual(s(m.match({y: 2, x: 1}, 'lenient')).v, [1, 2]);
    });
    t.end();
  });

  test('string props', function(t) {
    it('recognition', function() {
      assertFails(t, m.match({foos: 'fo', bar: 'bar'}, 'withStringProps'));
      assertSucceeds(t, m.match({foos: 'foo', bar: 'bar'}, 'withStringProps'));
      assertFails(t, m.match({foos: 'foofo', bar: 'bar'}, 'withStringProps'));
      assertSucceeds(t, m.match({foos: 'foofoo', bar: 'bar'}, 'withStringProps'));
      assertSucceeds(t, m.match({foos: 'foofoofoofoofoo', bar: 'bar'}, 'withStringProps'));
    });

    it('semantic actions', function() {
      var s = m.semantics().addAttribute('v', {
        withStringProps: function(foos, bar) {
          return [foos.v, bar.v];
        }
      });
      t.deepEqual(s(m.match({foos: 'foofoo', bar: 'bar'}, 'withStringProps')).v, [
        ['foo', 'foo'], 'bar'
      ]);
    });
    t.end();
  });

  it('duplicate property names are not allowed', function() {
    t.throws(
        function() { ohm.grammar('M { duh = {x: 1, x: 2, y: 3, ...} }'); },
        'Object pattern has duplicate property names: x');
  });

  var obj = Object.create(null);
  obj.x = 1;
  obj.y = 2;
  assertSucceeds(t, m.match(obj), 'object with null prototype');

  obj = {hasOwnProperty: null, x: 1, y: 2};
  assertSucceeds(t, m.match(obj, 'lenient'), 'object overriding hasOwnProperty');

  t.end();
});

test('val', function(t) {
  var g = makeGrammar([
    'G {',
    '  start = $blah',
    '  blah = "ab"',
    '  blahTwice = $(blah blah)',
    '  twoStrings = $blah $blah',
    '  arrOfTwoStrings = [twoStrings]',
    '}'
  ]);
  t.equals(g.match('ab').succeeded(), true);
  t.equals(g.match('abab', 'twoStrings').failed(), true);
  t.equals(g.match('abab', 'blahTwice').succeeded(), true);
  t.equals(g.match(['ab', 'ab'], 'twoStrings').failed(), true);
  t.equals(g.match(['ab', 'ab'], 'arrOfTwoStrings').succeeded(), true);

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
      var s = m.semantics().addAttribute('v', {
        easy: function(expr) {
          return ['easy', expr.v];
        },
        foo: function(expr) {
          return ['foo', expr.v];
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
      var s = m.semantics().addAttribute('v', {
        numberRec: function(n, d) {
          return n.v * 10 + d.v;
        },
        digit: function(expr) {
          return expr.v.charCodeAt(0) - '0'.charCodeAt(0);
        }
      }).addAttribute('t', {
        number: function(expr) {
          return ['number', expr.t];
        },
        numberRec: function(n, d) {
          return ['numberRec', n.t, d.t];
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
      var s = m.semantics().addAttribute('v', {
        addRec: function(x, _, y) {
          return [x.v, '+', y.v];
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
      var s = m.semantics().addAttribute('v', {
        numberRec: function(n, d) {
          return [n.v, d.v];
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
      var s = m.semantics().addAttribute('t', {
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
        }
      }).addAttribute('p', {
        addExpRec: function(x, _, y) {
          return '(' + x.p + '+' + y.p + ')';
        },
        mulExpRec: function(x, _, y) {
          return '(' + x.p + '*' + y.p + ')';
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
      var s = m.semantics().addAttribute('t', {
        addExpRec: function(x, _, y) {
          return [x.t, '+', y.t];
        },
        mulExpRec: function(x, _, y) {
          return [x.t, '*', y.t];
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
      var s = m.semantics().addAttribute('t', {
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

test('built-in types', function(t) {
  var g = makeGrammar([
    'G {',
    '  Arr = [Boolean Number String]',
    '  Obj = {b: Boolean, n: Number, s: String}',
    '}']);

  // Boolean
  t.equal(g.match(true, 'Boolean').succeeded(), true);
  t.equal(g.match(false, 'Boolean').succeeded(), true);
  t.equal(g.match(0, 'Boolean').failed(), true);
  t.equal(g.match({}, 'Boolean').failed(), true);

  // Number
  t.equal(g.match(0, 'Number').succeeded(), true, 'zero');
  t.equal(g.match(Math.PI, 'Number').succeeded(), true, 'pi');
  t.equal(g.match(Math.sqrt(-1), 'Number').succeeded(), true, 'NaN');
  t.equal(g.match('1', 'Number').failed(), true);
  t.equal(g.match(false, 'Number').failed(), true);
  t.equal(g.match(null, 'Number').failed(), true);

  // String
  t.equal(g.match('', 'String').succeeded(), true);
  t.equal(g.match('blah', 'String').succeeded(), true);
  t.equal(g.match(0, 'String').failed(), true);

  var result = g.match([true, 99.99, 'blah'], 'Arr');
  t.equal(result.succeeded(), true, 'matching inside an Array');
  // TODO: The binding given to these actions should be the value itself, not an instance
  // of pexprs.TypeCheck.
  var s = g.semantics().addAttribute('val', {
    Arr: function(bool, num, str) { return [bool.val, num.val, str.val]; },
    Obj: function(bool, num, str) { return [bool.val, num.val, str.val]; },
    Boolean: function(typeCheck) { return typeCheck.val; },
    Number: function(typeCheck) { return typeCheck.val; },
    String: function(typeCheck) { return typeCheck.val; }
  });
  t.looseEqual(s(result).val, [true, 99.99, 'blah'], 'array match with semantics');

  result = g.match({b: false, n: -0, s: 'zzz'}, 'Obj');
  t.equal(result.succeeded(), true, 'matching inside an object');
  t.looseEqual(s(result).val, [false, -0, 'zzz'], 'obj match with semantics');

  t.end();
});

test('inheritance', function(t) {
  test('super-grammar does not exist', function(t) {
    it('no namespace', function() {
      t.throws(
          function() { ohm.grammar('G2 <: G1 {}'); },
          'Grammar G1 is not declared');
    });

    it('empty namespace', function() {
      t.throws(
          function() { ohm.grammar('G2 <: G1 {}', {}); },
          'Grammar G1 is not declared in namespace');
    });
    t.end();
  });

  test('define', function(t) {
    it('should check that rule does not already exist in super-grammar', function() {
      t.throws(
          function() {
            makeGrammars([
              'G1 { foo = "foo" }',
              'G2 <: G1 { foo = "bar" }'
            ]);
          },
          "Duplicate declaration for rule 'foo' in grammar 'G2' (originally declared in 'G1')");
    });
    t.end();
  });

  test('override', function(t) {
    var ns = makeGrammars(['G1 { number = digit+ }',
                           'G2 <: G1 { digit := "a".."z" }']);

    it('should check that rule exists in super-grammar', function() {
      t.throws(
          function() { ohm.grammar('G3 <: G1 { foo := "foo" }', ns); },
          'Cannot override rule foo because it is not declared in G1');
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
      var s = ns.G2.semantics().addAttribute('v', {
        number: function(expr) {
          return ['number', expr.v];
        },
        digit: function(expr) {
          return ['digit', expr.v];
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
      var s = ns.G2.semantics().addAttribute('v', {
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
          'Cannot extend rule bar because it is not declared in G1');
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
    var s = g.semantics().addAttribute('v', {
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
      }
    });
    t.deepEqual(s(g.match('ab')).v, {
      x: ['bar', 'a', 0],
      y: ['baz', 'b', 1]
    });

    id = 0;
    s = g.semantics().addAttribute('v', {
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
    var s = g.semantics().addAttribute('v', {
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
      '}'
    ], ns);
  t.equal(makeEval(m2)(m2.match('2*3~4')), 2);

  t.throws(
    function() { ohm.grammar('Bad <: Arithmetic { addExp += addExp "~" mulExp  -- minus }', ns); },
    "rule 'addExp_minus' in grammar 'Bad' (originally declared in 'Arithmetic')");

  t.end();
});

test('lexical vs. syntactic rules', function(t) {
  it("can't call syntactic rule from lexical rule, not not the other way around", function() {
    t.ok(ohm.grammar('G { foo = bar  bar = "bar" }'), 'lexical calling lexical');
    t.throws(
        function() { ohm.grammar('G { foo = Bar  Bar = "bar" }'); },
        'Cannot apply syntactic rule Bar from here (inside a lexical context)',
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
        'Cannot apply syntactic rule R from here (inside a lexical context)');
  });

  t.end();
});

test('strings vs. value exprs', function(t) {
  var g = makeGrammar([
    'G {',
    '  amb = ',
    '  str = "a" amb',
    '  arr = [amb]',
    '  obj = {x: amb}',
    '  obj2 = {x: arr}',
    '}'
  ]);
  t.equal(g.match('', 'amb').succeeded(), true);
  t.equal(g.match('a', 'str').succeeded(), true);
  t.equal(g.match([], 'arr').succeeded(), true);
  t.equal(g.match({x: ''}, 'obj').succeeded(), true);
  t.equal(g.match({x: []}, 'obj').failed(), true);
  t.equal(g.match({x: []}, 'obj2').succeeded(), true);

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
    var s = Arithmetic.semantics().addAttribute('v', {
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
