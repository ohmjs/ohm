var test = require('tape-catch');

var fs = require('fs');
var ohm = require('..');
var testUtil = require('./testUtil');
var nodes = require('../src/nodes');
var Grammar = require('../src/Grammar');
var InputStream = require('../src/InputStream');
var Interval = require('../src/Interval');

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();
var ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString();

var makeGrammar = testUtil.makeGrammar;
var makeGrammars = testUtil.makeGrammars;

function makeInterval(thing, startIdx, endIdx) {
  return new Interval(InputStream.newFor(thing), startIdx, endIdx);
}

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

test('grammar constructors dictionary', function(t) {
  var m = makeGrammar(arithmeticGrammarSource);

  it('exists and has a _nonterminal entry', function() {
    t.ok(m.constructors);
  });

  it('has an entry for each of a few carefully chosen rules', function() {
    t.ok(m.constructors.addExp);
    t.ok(m.constructors.addExp_minus);
    t.ok(m.constructors.priExp);
    t.ok(m.constructors.digit);
    t.ok(m.constructors.any);
  });

  it('lacks entries for nonexistent rules', function() {
    t.equal(m.constructors.foobar, undefined);
  });

  it('_nonterminal entry rejects nonexistent rule name', function() {
    t.throws(
        function() { m.construct('foobar', []); },
        /Attempt to invoke constructor foobar with invalid or unexpected arguments/);
  });

  it('_nonterminal entry works when called correctly', function() {
    t.ok(m.construct('addExp', [m.match('1+2', 'addExp_plus')._cst]) instanceof nodes.Node);
  });

  it('particular entries work when called', function() {
    var n = m.match('1+2*3', 'addExp')._cst;
    t.equal(n.ctorName, 'addExp');

    var p = n.children[0];
    t.equal(p.ctorName, 'addExp_plus');
    t.equal(p.numChildren(), 3);
  });

  t.end();
});

test('intervals', function(t) {
  test('collapsing', function(t) {
    it('left', function() {
      var interval = makeInterval('hello world', 0, 5);
      var collapsed = interval.collapsedLeft();

      // Original interval shouldn't change
      t.equal(interval.startIdx, 0);
      t.equal(interval.endIdx, 5);
      t.equal(interval.inputStream.source, 'hello world');
      t.equal(interval.contents, 'hello');

      t.equal(collapsed.startIdx, 0);
      t.equal(collapsed.endIdx, 0);
      t.equal(collapsed.inputStream.source, 'hello world');
      t.equal(collapsed.contents, '');
    });

    it('right', function() {
      var interval = makeInterval('hello world', 0, 5);
      var collapsed = interval.collapsedRight();

      // Original interval shouldn't change
      t.equal(interval.startIdx, 0);
      t.equal(interval.endIdx, 5);
      t.equal(interval.inputStream.source, 'hello world');
      t.equal(collapsed.contents, '');

      t.equal(collapsed.startIdx, 5);
      t.equal(collapsed.endIdx, 5);
      t.equal(collapsed.inputStream.source, 'hello world');
      t.equal(collapsed.contents, '');
    });
    t.end();
  });

  test('coverage', function(t) {
    it('one interval', function() {
      var interval = makeInterval('hello world', 0, 5);
      var ans = Interval.coverage(interval);

      t.equal(ans.startIdx, 0);
      t.equal(ans.endIdx, 5);
      t.equal(ans.inputStream.source, 'hello world');
      t.equal(ans.contents, 'hello');
    });

    it('two adjacent intervals', function() {
      var interval1 = makeInterval('hello world', 2, 5);
      var interval2 = makeInterval(interval1.inputStream, 0, 2);
      var ans = Interval.coverage(interval1, interval2);

      t.equal(ans.startIdx, 0);
      t.equal(ans.endIdx, 5);
      t.equal(ans.inputStream.source, 'hello world');
      t.equal(ans.contents, 'hello');
    });

    it('two non-adjacent intervals', function() {
      var interval1 = makeInterval('hello world', 0, 2);
      var interval2 = makeInterval(interval1.inputStream, 4, 5);
      var ans = Interval.coverage(interval1, interval2);

      t.equal(ans.startIdx, 0);
      t.equal(ans.endIdx, 5);
      t.equal(ans.inputStream.source, 'hello world');
      t.equal(ans.contents, 'hello');
    });

    it('nested intervals', function() {
      var interval1 = makeInterval('hello world', 0, 5);
      var interval2 = makeInterval(interval1.inputStream, 3, 4);
      var ans = Interval.coverage(interval1, interval2);

      t.equal(ans.startIdx, 0);
      t.equal(ans.endIdx, 5);
      t.equal(ans.inputStream.source, 'hello world');
      t.equal(ans.contents, 'hello');
    });

    it('more intervals', function() {
      var interval1 = makeInterval('hello world', 0, 2);
      var interval2 = makeInterval(interval1.inputStream, 3, 4);
      var interval3 = makeInterval(interval1.inputStream, 6, 10);
      var ans = Interval.coverage(interval1, interval2, interval3);

      t.equal(ans.startIdx, 0);
      t.equal(ans.endIdx, 10);
      t.equal(ans.inputStream.source, 'hello world');
      t.equal(ans.contents, 'hello worl');
    });

    it('brotha from anotha motha', function() {
      var interval1 = makeInterval('abc', 0, 3);
      var interval2 = makeInterval('xyz', 1, 2);
      t.throws(
          function() { Interval.coverage(interval1, interval2) },
          /Interval sources don't match/);
    });

    it('coverageWith (same method as above but as a method of an interval)', function() {
      var interval1 = makeInterval('hello world', 0, 2);
      var interval2 = makeInterval(interval1.inputStream, 3, 4);
      var interval3 = makeInterval(interval1.inputStream, 6, 10);
      var ans = interval1.coverageWith(interval2, interval3);

      t.equal(ans.startIdx, 0);
      t.equal(ans.endIdx, 10);
      t.equal(ans.inputStream.source, 'hello world');
      t.equal(ans.contents, 'hello worl');
    });

    t.end();
  });
  t.end();
});

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
        start: function(x, _, _) {
          return x.primitiveValue;
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
    })
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
      start: function(_, y, x, _, _) {
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
    '  withStringProps = {foos: ``"foo"*\'\', bar: "bar"}',
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
          "Duplicate declaration for rule 'foo' in grammar 'G2' \(originally declared in 'G1'\)");
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

      t.throws(
        function() { ohm.grammar('M2 <: M1 { foo += bar baz }', ns); },
        'Rule foo involves an alternation which has inconsistent arity (expected 1, got 2)');

      // Too few:
      ns.M3 = ohm.grammar('M3 { foo = digit digit }');
      t.throws(
        function() { ohm.grammar('M4 <: M3 { foo += digit }', ns); },
        'Rule foo involves an alternation which has inconsistent arity (expected 2, got 1)');
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
    t.throws(
      function() { ohm.grammar('G { foo = "a" "c" | "b" }'); },
      'Rule foo involves an alternation which has inconsistent arity (expected 2, got 1)');
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
      },
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

test('action dictionary templates', function(t) {
  var ns = makeGrammars([
    'G1 {',
    '  foo = bar',
    '  bar = baz baz baz',
    '  baz = qux',
    '  qux = quux 123',
    '  quux = 42',
    '  aaa = "duh"',
    '  bbb = ~aaa qux  -- blah',
    '}',
    'G2 <: G1 {',
    '  qux := 100',
    '}'
  ]);
  var g1 = ns.G1;
  var g2 = ns.G2;
  t.equal(ns.G1.toOperationActionDictionaryTemplate(),
    '{\n' +
    '  foo: function(_) {\n' +
    '  },\n' +
    '  bar: function(_, _, _) {\n' +
    '  },\n' +
    '  baz: function(_) {\n' +
    '  },\n' +
    '  qux: function(_, _) {\n' +
    '  },\n' +
    '  quux: function(_) {\n' +
    '  },\n' +
    '  aaa: function(_) {\n' +
    '  },\n' +
    '  bbb_blah: function(_) {\n' +
    '  },\n' +
    '  bbb: function(_) {\n' +
    '  },\n' +
    '  alnum: function(_) {\n' +
    '  },\n' +
    '  letter: function(_) {\n' +
    '  },\n' +
    '  digit: function(_) {\n' +
    '  },\n' +
    '  hexDigit: function(_) {\n' +
    '  },\n' +
    '  ListOf_some: function(_, _, _) {\n' +
    '  },\n' +
    '  ListOf_none: function() {\n' +
    '  },\n' +
    '  ListOf: function(_) {\n' +
    '  },\n' +
    '  listOf_some: function(_, _, _) {\n' +
    '  },\n' +
    '  listOf_none: function() {\n' +
    '  },\n' +
    '  listOf: function(_) {\n' +
    '  },\n' +
    '  any: function(_) {\n' +
    '  },\n' +
    '  end: function(_) {\n' +
    '  },\n' +
    '  space: function(_) {\n' +
    '  },\n' +
    '  lower: function(_) {\n' +
    '  },\n' +
    '  upper: function(_) {\n' +
    '  },\n' +
    '  unicodeLtmo: function(_) {\n' +
    '  }\n' +
    '}');
  t.equal(ns.G2.toAttributeActionDictionaryTemplate(),
    '{\n' +
    '  qux: function(_) {\n' +
    '  },\n' +
    '  foo: function(_) {\n' +
    '  },\n' +
    '  bar: function(_, _, _) {\n' +
    '  },\n' +
    '  baz: function(_) {\n' +
    '  },\n' +
    '  quux: function(_) {\n' +
    '  },\n' +
    '  aaa: function(_) {\n' +
    '  },\n' +
    '  bbb_blah: function(_) {\n' +
    '  },\n' +
    '  bbb: function(_) {\n' +
    '  },\n' +
    '  alnum: function(_) {\n' +
    '  },\n' +
    '  letter: function(_) {\n' +
    '  },\n' +
    '  digit: function(_) {\n' +
    '  },\n' +
    '  hexDigit: function(_) {\n' +
    '  },\n' +
    '  ListOf_some: function(_, _, _) {\n' +
    '  },\n' +
    '  ListOf_none: function() {\n' +
    '  },\n' +
    '  ListOf: function(_) {\n' +
    '  },\n' +
    '  listOf_some: function(_, _, _) {\n' +
    '  },\n' +
    '  listOf_none: function() {\n' +
    '  },\n' +
    '  listOf: function(_) {\n' +
    '  },\n' +
    '  any: function(_) {\n' +
    '  },\n' +
    '  end: function(_) {\n' +
    '  },\n' +
    '  space: function(_) {\n' +
    '  },\n' +
    '  lower: function(_) {\n' +
    '  },\n' +
    '  upper: function(_) {\n' +
    '  },\n' +
    '  unicodeLtmo: function(_) {\n' +
    '  }\n' +
    '}');
  t.end();
});

test('namespaces', function(t) {
  var ns = ohm.grammars('G { start = "foo" }');
  t.ok(ns.G.match('foo'), 'G exists in the namespace and works');

  var ns2 = ohm.grammars('ccc { foo = "foo" }', ns);
  t.ok(ns2);
  t.throws(
      function() { ohm.grammar('ccc { bar = "bar" }', ns2); },
      'Grammar ccc is already declared in this namespace');
  t.ok(ns2.G, 'ns2 delegates to ns1');

  var ns3 = ohm.grammars('ccc { start = "x" }', ns);
  t.ok(ns3);
  t.ok(ns3.ccc, "grammars with same name can be created in diff't namespaces");
  t.notEqual(ns3.ccc, ns2.ccc, "grammars with same name are diff't objects");
  t.deepEqual(ns3.G, ns2.G, 'super grammar is the same');

  t.end();
});

test('loading from script elements', function(t) {
  var script1 = testUtil.fakeScriptTag(['O { number = number digit  -- rec',
                                    '           | digit',
                                    '}']);
  var script2 = testUtil.fakeScriptTag(['M { x = "xx" }',
                                    'N { y = "yy" }']);
  var ns1 = ohm.grammarsFromScriptElements([script1]);
  var ns2 = ohm.grammarsFromScriptElements([script2]);
  t.equal(ns1.M, undefined, 'M is undefined in ns1');
  t.ok(ns1.O, 'O is defined in ns1');
  assertSucceeds(t, ns1.O.match('1234', 'number'), 'O can match');

  t.ok(ns2.M, 'M is defined in ns2');
  t.ok(ns2.N, 'N is also defined');
  t.equal(ns2.O, undefined, 'O is not defined in ns2');
  assertSucceeds(t, ns2.M.match('xx', 'x'), 'M can match');

  var g1 = ohm.grammarFromScriptElement(script1);
  assertSucceeds(t, g1.match('1234', 'number'), 'loading a single grammar works');

  t.end();
});

test('instantiating grammars from different types of objects', function(t) {
  var g = ohm.grammar(fs.readFileSync('test/arithmetic.ohm'));
  assertSucceeds(t, g.match('1+2'), 'works with a Buffer from fs.readFileSync()');

  var ns = ohm.grammars(new Buffer('G {}'));
  assertSucceeds(t, g.match('a', 'letter'), 'works with a new Buffer');

  // Try with some objects where 'toString' won't work.
  t.throws(function() { ohm.grammar({toString: 3}); },
      'Expected string as first argument, got [object Object]', 'object with invalid toString');
  t.throws(function() { ohm.grammar(Object.create(null)); },
      'Expected string as first argument, got [object Object]', 'object with no toString');

  t.throws(function() { ohm.grammar([1, 2]); },
      'Expected string as first argument, got Array: "1,2"', 'Array with valid toString');

  function Foo() {
    this.toString = function() { return 'Foo!'; };
  };
  t.throws(function() { ohm.grammar(new Foo()); },
      'Expected string as first argument, got Foo: "Foo!"', 'Custom objects with toString');

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

test('definitionInterval', function(t) {
  var g = makeGrammar([
    'G {',
    '  foo = bar',
    '  bar = "a" | "b" -- baz',
    '}'
  ]);

  function definitionLoc(grammar, ruleName) {
    var interval = grammar.ruleBodies[ruleName].definitionInterval;
    return [interval.startIdx, interval.endIdx];
  }
  it('works for regular rules', function() {
    t.deepEqual(definitionLoc(g, 'foo'), [6, 15]);
    t.deepEqual(definitionLoc(g, 'bar'), [18, 40]);
  });
  it('works for inline rules', function() {
    t.deepEqual(definitionLoc(g, 'bar_baz'), [30, 40]);
  });

  var g2 = makeGrammar([
    'G2 <: G {',
    '  foo += bar',
    '  bar := "a" | "b" -- baz',
    '}'
  ], {G: g});
  it('works when overriding and extending rules', function() {
    t.deepEqual(definitionLoc(g2, 'foo'), [12, 22]);
    t.deepEqual(definitionLoc(g2, 'bar'), [25, 48]);
    t.deepEqual(definitionLoc(g2, 'bar_baz'), [38, 48]);
  });
  t.end();
});

test('rule invocation interval', function(t) {
  var g = makeGrammar([
    'G {',
    '  foo = bar',
    '  beep = letter bar',
    '  bar = "a" | "blah" | "a".."z" -- baz',
    '}'
  ]);

  function fromLoc(pexpr) {
    return [pexpr.interval.startIdx, pexpr.interval.endIdx];
  }
  var fooBody = g.ruleBodies.foo;
  var beepBody = g.ruleBodies.beep;
  var barBody = g.ruleBodies.bar;
  it('works for regular rule applications', function() {
    t.deepEqual(fromLoc(fooBody), [12, 15]);
    t.deepEqual(fromLoc(beepBody.factors[1]), [32, 35]);
  });
  t.deepEqual(fromLoc(beepBody.factors[0]), [25, 31], 'works for built-in rule applications');
  it('works for primitives', function() {
    t.deepEqual(fromLoc(barBody.terms[0]), [44, 47]);
    t.deepEqual(fromLoc(barBody.terms[1]), [50, 56]);

    var barBazBody = g.ruleBodies.bar_baz;
    t.deepEqual(fromLoc(barBazBody), [59, 67]);
  });
  t.deepEqual(fromLoc(beepBody), [25, 35], 'works for seq');
  t.deepEqual(fromLoc(barBody), [44, 74], 'works for alt');
  t.end();
});

test('toDisplayString', function(t) {
  var g = ohm.grammar('G { start = "ab" | letter* | "a".."z" }');
  it('does the right thing', function() {
    var seq = g.ruleBodies.start;
    t.equal(seq.toDisplayString(), '"ab" | letter* | "a".."z"');
    t.equal(seq.terms[0].toDisplayString(), '"ab"');

    var many = seq.terms[1];
    t.equal(many.toDisplayString(), 'letter*');
    t.equal(many.expr.toDisplayString(), 'letter');

    t.equal(seq.terms[2].toDisplayString(), '"a".."z"');
  });
  t.end();
});

test('pexpr.toString()', function(t) {
  var g = makeGrammar(
      'G { start = &"a" ~(2 | 3?) ``b a\'\' [c {e: b, ...} {g: "a".."z"}]  a = 1  b = 2  c = 3 }');
  var e = g.ruleBodies.start;
  t.equal(e.toString(), '(&"a" ~(2 | 3?) ``(b a)\'\' [(c {"e": b, ...} {"g": "a".."z"})])');
  t.end();
});

test('default start rule', function(t) {
  var g = ohm.grammar('G {}');
  t.equal(g.defaultStartRule, undefined, 'undefined for an empty grammar');
  t.throws(function() { g.match('a'); }, /Missing start rule/, 'match throws with no start rule');
  t.equal(Grammar.ProtoBuiltInRules.defaultStartRule, undefined, 'undefined for ProtoBuiltInRules');
  t.equal(Grammar.BuiltInRules.defaultStartRule, undefined, 'undefined for BuiltInRules');

  var g2 = ohm.grammar('G2 <: G {}', {G:g});
  t.equal(g2.defaultStartRule, undefined, 'undefined for a subgrammar too');
  t.throws(function() { g2.match('a'); }, /Missing start rule/, 'match throws with no start rule');

  var ns = makeGrammars(['G { foo = "a" }', 'G2 <: G {}']);
  t.equal(ns.G.defaultStartRule, 'foo', 'only rule becomes default start rule');
  t.equal(ns.G2.defaultStartRule, 'foo', 'start rule is inherited from supergrammar');
  assertSucceeds(t, ns.G.match('a'), 'match works without a start rule argument');
  assertSucceeds(t, ns.G2.match('a'));

  var g3 = ohm.grammar('G3 <: G { bar = "b" }', ns);
  t.equal(g3.defaultStartRule, 'foo', 'start rule is still inherited');
  assertSucceeds(t, g3.match('a'));

  var g4 = ohm.grammar('G4 <: G3 { blah = "c" }', {G3:g3});
  t.equal(g4.defaultStartRule, 'foo', 'start rule inherited from super-supergrammar');
  assertSucceeds(t, g4.match('a'));

  g = ohm.grammar('G { digit += any }');
  t.equal(g.defaultStartRule, undefined, "extending alone doesn't set the start rule");
  t.throws(function() { g.match('a'); }, /Missing start rule/, 'match throws with no start rule');
  g = makeGrammar(['G { digit += any', 'blah = "3" }'])
  t.equal(g.defaultStartRule, 'blah', 'rule defined after extending becomes start rule');
  assertSucceeds(t, g.match('3'));

  g = ohm.grammar('G { digit := any }');
  t.equal(g.defaultStartRule, undefined, "overriding alone doesn't set the start rule");
  t.throws(function() { g.match('a'); }, /Missing start rule/, 'match throws with no start rule');
  g = makeGrammar(['G { digit := any', 'blah = "3" }'])
  t.equal(g.defaultStartRule, 'blah', 'rule defined after overriding becomes start rule');
  assertSucceeds(t, g.match('3'));

  g = ohm.grammar('G { x = "a"\n| -- nothing }');
  t.equal(g.defaultStartRule, 'x', "an inline rule doesn't become the default");

  // Test passing the default start rule as an argument to the Grammar constructor.
  var root = Grammar.BuiltInRules;
  t.throws(function() {
    new Grammar('G', root, {}, {}, {}, 'nonexistentRule');
  }, /Invalid start rule/, 'throws when start rule is not in the grammar');
  t.ok(
      new Grammar('G', root, {aRule:null}, {}, {}, 'aRule'),
     'works when rule is in the ruleBodies');
  var ruleBodies = Object.create(root.ruleBodies);
  t.ok(
      new Grammar('G', root, ruleBodies, {}, {}, 'digit'),
      'works when rule is in the supergrammar');

  t.end();
});
