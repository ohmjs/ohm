/*

TODO:
* add a test that tries to use a semantic action for one grammar w/ a CST from another (should throw an error)
* rethink these tests, they're outdated now and should be re-written to test what Ohm has become
  (see TODO.md)

*/

var test = require('tape-catch');

var errors = require('../src/errors.js');
var fs = require('fs');
var ohm = require('../src/main.js');
var Node = require('../src/Node.js');
var InputStream = require('../src/InputStream.js');
var Interval = require('../src/Interval.js');

var nextFreshNSId = 0;
function freshNamespaceName() {
  return 'ns' + nextFreshNSId++;
}

function makeGrammar(source, optNamespaceName) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammar(source, optNamespaceName || freshNamespaceName());
}

function makeGrammars(source, optNamespaceName) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammars(source, optNamespaceName || freshNamespaceName());
}

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();
var ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString();

function makeInterval(thing, startIdx, endIdx) {
  return new Interval(InputStream.newFor(thing), startIdx, endIdx);
}

function compareGrammars(t, expected, actual) {
  // The other property on grammars is "constructors", which contains
  // closures which cause spurious test failures if we compare
  // them. So we ignore that property here, concentrating on ruleDict
  // and other "real" properties of each grammar.

  t.equal(typeof actual, typeof expected);
  // ^ e.g. when one is undefined and the other isn't

  if (expected && actual) {
    compareGrammars(t, expected.superGrammar, actual.superGrammar);
    // In the list below, we exclude superGrammar (just tested above)
    // and constructors (for reasons given above).
    ['namespaceName', 'name', 'ruleDecls', 'ruleDict'].forEach(function(prop) {
      t.deepEqual(actual[prop], expected[prop]);
    });
  }
}

// A stub for Jasmin/RSpec-style tests, for tests that were written before we
// moved to `tape`. New tests shouldn't use this -- instead, they should
// pass a message argument to the assertion functions (e.g. `t.equal`), or
// just put checks in a separate call to `test`.
function it(desc, fn) {
  console.log(desc);
  fn.call();
}

function buildTreeNodeWithUniqueId(m) {
  var nextId = 0;
  var attr = m.synthesizedAttribute({
    _default: function() {
      return ['id', nextId++, this.ctorName].concat(this.children.map(attr));
    },
    _many: ohm.actions.makeArray,
    _terminal: ohm.actions.getValue
  });
  attr._getNextId = function() {
    return nextId;
  };
  return attr;
}

test('grammar constructors dictionary', function(t) {
  var m = makeGrammar(arithmeticGrammarSource);

  it('exists and has a _default entry', function() {
    t.ok(m.constructors);
  });

  it('has an entry for each of a few carefully chosen rules', function() {
    t.ok(m.constructors.addExpr);
    t.ok(m.constructors.addExpr_minus);
    t.ok(m.constructors.priExpr);
    t.ok(m.constructors.digit);
    t.ok(m.constructors._);
  });

  it('lacks entries for nonexistent rules', function() {
    t.equal(m.constructors.foobar, undefined);
  });

  it('_default entry rejects nonexistent rule name', function() {
    t.throws(function() { m.construct('foobar', []); }, errors.InvalidConstructorCall);
  });

  it('_default entry works when called correctly', function() {
    t.ok(m.construct('addExpr', [m.match('1+2', 'addExpr_plus')]) instanceof Node);
  });

  it('particular entries work when called', function() {
    var n = m.match('1+2*3', 'addExpr');
    t.equal(n.ctorName, 'addExpr');

    var p = n.children[0];
    t.equal(p.ctorName, 'addExpr_plus');
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
      t.throws(function() {
        Interval.coverage(interval1, interval2);
      }, errors.IntervalSourcesDontMatch);
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
  test('anything', function(t) {
    var m = makeGrammar('M { }');

    test('direct match, no stream', function(t) {
      it('recognition', function() {
        t.ok(m.match(5, '_'));
        t.ok(m.match(null, '_'));
      });

      it('semantic actions', function() {
        var dict = {
          _: ohm.actions.passThrough,
          _terminal: ohm.actions.getValue
        };
        t.equal(m.synthesizedAttribute(dict)(m.match(5, '_')), 5);
        t.equal(m.synthesizedAttribute(dict)(m.match(null, '_')), null);
      });
      t.end();
    });

    test('match in string stream', function(t) {
      it('recognition', function() {
        t.ok(m.match('5', '_'));
        t.equal(m.match('', '_'), false);
      });

      it('semantic actions', function() {
        var dict = {
          _: ohm.actions.passThrough,
          _terminal: ohm.actions.getValue
        };
        t.equal(m.synthesizedAttribute(dict)(m.match('5', '_')), '5');
      });
      t.end();
    });

    test('match in list stream', function(t) {
      it('recognition', function() {
        t.ok(m.match(['123'], '_'));
      });

      it('semantic actions', function() {
        var dict = {
          _: ohm.actions.passThrough,
          _terminal: ohm.actions.getValue
        };
        t.deepEqual(m.synthesizedAttribute(dict)(m.match(['123'], '_')), ['123']);
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
      '  _undefined = undefined',
      '}'
    ]);

    it('recognition', function() {
      t.ok(m.match(5, 'five'));
      t.equal(m.match(2, 'five'), false);
      t.equal(m.match('a', 'five'), false);
      t.equal(m.match('5', 'five'), false);
      t.equal(m.match('true', 'five'), false);
      t.equal(m.match(true, 'five'), false);
      t.equal(m.match('false', 'five'), false);
      t.equal(m.match(false, 'five'), false);
      t.equal(m.match(null, 'five'), false);
      t.equal(m.match(undefined, 'five'), false);

      t.equal(m.match(5, '_true'), false);
      t.equal(m.match(2, '_true'), false);
      t.equal(m.match('a', '_true'), false);
      t.equal(m.match('5', '_true'), false);
      t.equal(m.match('true', '_true'), false);
      t.ok(m.match(true, '_true'));
      t.equal(m.match('false', '_true'), false);
      t.equal(m.match(false, '_true'), false);
      t.equal(m.match(null, '_true'), false);
      t.equal(m.match(undefined, '_true'), false);

      t.equal(m.match(5, '_false'), false);
      t.equal(m.match(2, '_false'), false);
      t.equal(m.match('a', '_false'), false);
      t.equal(m.match('5', '_false'), false);
      t.equal(m.match('true', '_false'), false);
      t.equal(m.match(true, '_false'), false);
      t.equal(m.match('false', '_false'), false);
      t.ok(m.match(false, '_false'));
      t.equal(m.match(null, '_false'), false);
      t.equal(m.match(undefined, '_false'), false);

      t.equal(m.match(5, '_null'), false);
      t.equal(m.match(2, '_null'), false);
      t.equal(m.match('a', '_null'), false);
      t.equal(m.match('5', '_null'), false);
      t.equal(m.match('true', '_null'), false);
      t.equal(m.match(true, '_null'), false);
      t.equal(m.match('false', '_null'), false);
      t.equal(m.match(false, '_null'), false);
      t.ok(m.match(null, '_null'));
      t.equal(m.match(undefined, '_null'), false);

      t.equal(m.match(5, '_undefined'), false);
      t.equal(m.match(2, '_undefined'), false);
      t.equal(m.match('a', '_undefined'), false);
      t.equal(m.match('5', '_undefined'), false);
      t.equal(m.match('true', '_undefined'), false);
      t.equal(m.match(true, '_undefined'), false);
      t.equal(m.match('false', '_undefined'), false);
      t.equal(m.match(false, '_undefined'), false);
      t.equal(m.match(null, '_undefined'), false);
      t.ok(m.match(undefined, '_undefined'));
    });

    it('semantic actions', function() {
      var dict = {
        five: ohm.actions.passThrough,
        _true: ohm.actions.passThrough,
        _false: ohm.actions.passThrough,
        _null: ohm.actions.passThrough,
        _undefined: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue,
      };
      t.equal(m.synthesizedAttribute(dict)(m.match(5, 'five')), 5);
      t.equal(m.synthesizedAttribute(dict)(m.match(true, '_true')), true);
      t.equal(m.synthesizedAttribute(dict)(m.match(false, '_false')), false);
      t.equal(m.synthesizedAttribute(dict)(m.match(null, '_null')), null);
      t.equal(m.synthesizedAttribute(dict)(m.match(undefined, '_undefined')), undefined);
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
      '  _undefined = undefined',
      '}'
    ]);
    it('recognition', function() {
      t.equal(m.match('!', 'five'), false);
      t.equal(m.match('5', 'five'), false);
      t.equal(m.match('2', 'five'), false);
      t.equal(m.match('', 'five'), false);
      t.equal(m.match('true', '_true'), false);
      t.equal(m.match('false', '_false'), false);
      t.equal(m.match('null', '_null'), false);
      t.equal(m.match('undefined', '_undefined'), false);
    });

    it('semantic actions', function() {
      // N/A
    });
    t.end();
  });
  t.end();
});

test('char', function(t) {
  var m = makeGrammar('M { bang = "!" }');

  test('direct match, no stream', function(t) {
    it('recognition', function() {
      t.ok(m.match('!', 'bang'));
      t.equal(m.match('!a', 'bang'), false);
      t.equal(m.match(5, 'bang'), false);
      t.equal(m.match('', 'bang'), false);
    });

    it('semantic actions', function() {
      var dict = {
        bang: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      };
      var cst = m.match('!', 'bang');
      t.equal(m.synthesizedAttribute(dict)(cst), '!');
    });
    t.end();
  });

  test('match in string stream', function(t) {
    it('recognition', function() {
      t.ok(m.match('!', 'bang'));
      t.equal(m.match('a', 'bang'), false);
      t.equal(m.match('', 'bang'), false);
    });

    it('semantic actions', function() {
      var dict = {
        bang: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      };
      var cst = m.match('!', 'bang');
      t.equal(m.synthesizedAttribute(dict)(cst), '!');
    });
    t.end();
  });
  t.end();
});

test('string', function(t) {
  var m = makeGrammar('M { foo = "foo" }');

  test('direct match, no stream', function(t) {
    it('recognition', function() {
      t.ok(m.match('foo', 'foo'));
      t.equal(m.match('foo1', 'foo'), false);
      t.equal(m.match('bar', 'foo'), false);
      t.equal(m.match(null, 'foo'), false);
    });

    it('semantic actions', function() {
      var dict = {
        foo: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      };
      var cst = m.match('foo', 'foo');
      t.equal(m.synthesizedAttribute(dict)(cst), 'foo');
    });
    t.end();
  });

  test('match in string stream', function(t) {
    it('recognition', function() {
      t.ok(m.match('foo', 'foo'));
      t.equal(m.match('foo1', 'foo'), false);
      t.equal(m.match('bar', 'foo'), false);
    });

    it('semantic actions', function() {
      var dict = {
        foo: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      };
      var cst = m.match('foo', 'foo');
      t.equal(m.synthesizedAttribute(dict)(cst), 'foo');
    });
    t.end();
  });
  t.end();
});

test('regexp', function(t) {
  var m = makeGrammar('M { myDigit = /[0-9]/ myLetter = /\\p{L}/ myLF = /\\p{LF}/ }');

  test('direct match, no stream', function(t) {
    it('recognition', function() {
      t.equal(m.match(/[0-9]/, 'myDigit'), false);
      t.ok(m.match('4', 'myDigit'));
      t.equal(m.match(4, 'myDigit'), false);
      t.equal(m.match('a', 'myDigit'), false);
      t.equal(m.match('a4', 'myDigit'), false);
    });
    t.end();
  });

  test('match in string stream', function(t) {
    it('recognition', function() {
      t.ok(m.match('4', 'myDigit'));
      t.equal(m.match('a', 'myDigit'), false);
      t.equal(m.match('a4', 'myDigit'), false);
    });

    it('semantic actions', function() {
      var dict = {
        myDigit: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      };
      var cst = m.match('4', 'myDigit');
      t.equal(m.synthesizedAttribute(dict)(cst), '4');
    });
    t.end();
  });

  test('unicode match in string stream', function(t) {
    it('recognition', function() {
      t.equal(m.match('4', 'myLetter'), false);
      t.ok(m.match('a', 'myLetter'));
      t.equal(m.match('a4', 'myLetter'), false);
      t.ok(m.match('\u03e6', 'myLetter'));
      t.equal(m.match('\u226a', 'myLetter'), false);
      t.ok(m.match('\n', 'myLF'));
      t.equal(m.match('x', 'myLF'), false);
    });

    it('semantic actions', function() {
      var dict = {
        myLetter: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      };
      var cst = m.match('a', 'myLetter');
      t.equal(m.synthesizedAttribute(dict)(cst), 'a');
    });
    t.end();
  });
  t.end();
});

test('alt', function(t) {
  var m = makeGrammar('M { altTest = "a" | "b" }');

  it('recognition', function() {
    t.equal(m.match('', 'altTest'), false);
    t.ok(m.match('a', 'altTest'));
    t.ok(m.match('b', 'altTest'));
    t.equal(m.match('ab', 'altTest'), false);
  });

  it('semantic actions', function() {
    var dict = {
      altTest: ohm.actions.passThrough,
      _terminal: ohm.actions.getValue
    };
    t.equal(m.synthesizedAttribute(dict)(m.match('a', 'altTest')), 'a');
    t.equal(m.synthesizedAttribute(dict)(m.match('b', 'altTest')), 'b');
  });
  t.end();
});

test('seq', function(t) {
  test('without bindings', function(t) {
    var m = makeGrammar('M { start = "a" "bc" "z" }');

    it('recognition', function() {
      t.equal(m.match('a', 'start'), false);
      t.equal(m.match('bc', 'start'), false);
      t.ok(m.match('abcz', 'start'));
      t.equal(m.match('abbz', 'start'), false);
    });

    it('semantic actions', function() {
      var f = m.match('abcz', 'start');
      t.deepEqual(m.synthesizedAttribute({
        start: function(x, y, z) {
          return [x.interval.contents, y.interval.contents, z.interval.contents];
        }
      })(f), ['a', 'bc', 'z']);
    });
    t.end();
  });

  test('with exactly one binding', function(t) {
    var m = makeGrammar('M { start = "a" "bc" "z" }');

    it('recognition', function() {
      t.equal(m.match('a', 'start'), false);
      t.equal(m.match('bc', 'start'), false);
      t.ok(m.match('abcz', 'start'));
      t.equal(m.match('abbz', 'start'), false);
    });

    it('semantic actions', function() {
      var f = m.match('abcz', 'start');
      t.deepEqual(m.synthesizedAttribute({
        start: function(x, _, _) {
          return x.value();
        },
      })(f), 'a');
    });
    t.end();
  });

  test('with more than one binding', function(t) {
    var m = makeGrammar('M { start = "a" "bc" "z" }');

    it('recognition', function() {
      t.equal(m.match('a', 'start'), false);
      t.equal(m.match('bc', 'start'), false);
      t.ok(m.match('abcz', 'start'));
      t.equal(m.match('abbz', 'start'), false);
    });

    it('semantic actions', function() {
      var f = m.match('abcz', 'start');
      t.deepEqual(m.synthesizedAttribute({
        start: function(x, _, y) {
          return [x.value(), y.value()];
        }
      })(f), ['a', 'z']);
    });
    t.end();
  });
  t.end();
});

test('alts and seqs together', function(t) {
  var m = makeGrammar('M { start = "a" "b" "c" | "1" "2" "3" }');

  it('recognition', function() {
    t.equal(m.match('ab', 'start'), false);
    t.equal(m.match('12', 'start'), false);
    t.ok(m.match('abc', 'start'));
    t.ok(m.match('123', 'start'));
  });

  it('semantic actions', function() {
    t.deepEqual(m.synthesizedAttribute({
        start: function(x, _, y) {
          return [x.value(), y.value()];
        }
      })(m.match('abc', 'start')), ['a', 'c']);
    t.deepEqual(m.synthesizedAttribute({
        start: function(x, _, y) {
          return [x.value(), y.value()];
        }
      })(m.match('123', 'start')), ['1', '3']);
  });

  t.end();
});

test('many', function(t) {
  var m = makeGrammar([
    'M {',
    '  number = digit+',
    '  digits = digit*',
    '  sss = &number number',
    '}'
  ]);

  it('recognition', function() {
    t.equal(m.match('1234a', 'number'), false);
    t.ok(m.match('1234', 'number'));
    t.ok(m.match('5', 'number'));
    t.equal(m.match('', 'number'), false);

    t.equal(m.match('1234a', 'digits'), false);
    t.ok(m.match('1234', 'digits'));
    t.ok(m.match('5', 'digits'));
    t.ok(m.match('', 'digits'));
  });

  it('semantic actions', function() {
    var value = m.synthesizedAttribute({
      number: function(expr) {
        return ['digits', value(expr)];
      },
      digit: function(expr) {
        return ['digit', value(expr)];
      },
      _many: ohm.actions.makeArray,
      _terminal: ohm.actions.getValue
    });
    t.deepEqual(value(m.match('1234', 'number')), [
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
  var m = makeGrammar('M { name = "dr"? "warth" }');

  it('recognition', function() {
    t.ok(m.match('drwarth', 'name'));
    t.ok(m.match('warth', 'name'));
    t.equal(m.match('mrwarth', 'name'), false);
  });

  it('semantic actions', function() {
    var actionDict = {
      name: function(title, last) {
        return [title.value(), last.value()];
      }
    };
    t.deepEqual(m.synthesizedAttribute(actionDict)(m.match('drwarth', 'name')), ['dr', 'warth']);
    t.deepEqual(m.synthesizedAttribute(actionDict)(m.match('warth', 'name')), [undefined, 'warth']);
  });
  t.end();
});
test('not', function(t) {
  var m = makeGrammar('M { start = ~"hello" _* }');

  it('recognition', function() {
    t.ok(m.match('yello world', 'start'));
    t.equal(m.match('hello world', 'start'), false);
  });

  it('semantic actions', function() {
    var attr = m.synthesizedAttribute({
      start: function(x) {
        return x.interval.contents;
      }
    });
    t.equal(attr(m.match('yello world', 'start')), 'yello world');
  });
  t.end();
});

test('lookahead', function(t) {
  var m = makeGrammar('M { start = &"hello" _* }');

  it('recognition', function() {
    t.ok(m.match('hello world', 'start'));
    t.equal(m.match('hell! world', 'start'), false);
  });

  it('semantic actions', function() {
    var attr = m.synthesizedAttribute({
      start: function(x, _) {
        return x.value();
      }
    });
    t.equal(attr(m.match('hello world', 'start')), 'hello');
  });
  t.end();
});

test('arr', function(t) {
  var m = makeGrammar('M { start = ["abc" &_ ["d" "ef"] "g"] }');

  it('recognition', function() {
    t.ok(m.match(['abc', ['d', 'ef'], 'g'], 'start'));
    t.equal(m.match(['abc', ['def'], 'g'], 'start'), false);
    t.equal(m.match(['abc', 'def', 'g'], 'start'), false);
    t.equal(m.match(['abc', ['d', 'ef', 'oops'], 'g'], 'start'), false);
    t.equal(m.match(['abc', ['d', 'ef'], 'gh'], 'start'), false);
    t.equal(m.match(['abc', [5], 'g'], 'start'), false);
    t.equal(m.match(['abc', [], 'g'], 'start'), false);
    t.equal(m.match(['abc', 5, 'g'], 'start'), false);
  });

  it('semantic actions', function() {
    var value = m.synthesizedAttribute({
      start: function(_, y, x, _, _) {
        return [value(x), value(y)];
      },
      _: ohm.actions.passThrough,
      _terminal: ohm.actions.getValue
    });
    t.deepEqual(value(m.match(['abc', ['d', 'ef'], 'g'], 'start')), ['d', ['d', 'ef']]);
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
      t.equal(m.match('foo', 'strict'), false);
      t.equal(m.match([], 'strict'), false);
      t.equal(m.match({y: 2}, 'strict'), false);
      t.ok(m.match({x: 1, y: 2}, 'strict'));
      t.ok(m.match({y: 2, x: 1}, 'strict'));
      t.equal(m.match({x: 1, y: 2, z: 3}, 'strict'), false);
    });

    it('semantic actions', function() {
      t.deepEqual(m.synthesizedAttribute({
        strict: function(a, b) {
          return [a.value(), b.value()];
        }
      })(m.match({x: 1, y: 2}, 'strict')), [1, 2]);
      t.deepEqual(m.synthesizedAttribute({
        strict: function(a, b) {
          return [a.value(), b.value()];
        }
      })(m.match({y: 2, x: 1}, 'strict')), [1, 2]);
    });
    t.end();
  });

  test('lenient', function(t) {
    it('recognition', function() {
      t.equal(m.match('foo', 'lenient'), false);
      t.equal(m.match([], 'lenient'), false);
      t.equal(m.match({y: 2}, 'lenient'), false);
      t.ok(m.match({x: 1, y: 2}, 'lenient'));
      t.ok(m.match({y: 2, x: 1}, 'lenient'));
      t.ok(m.match({x: 1, y: 2, z: 3}, 'lenient'));
    });

    it('semantic actions', function() {
      t.deepEqual(m.synthesizedAttribute({
        lenient: function(a, b, _) {
          return [a.value(), b.value()];
        }
      })(m.match({x: 1, y: 2}, 'lenient')), [1, 2]);
      t.deepEqual(m.synthesizedAttribute({
        lenient: function(a, b, _) {
          return [a.value(), b.value()];
        }
      })(m.match({y: 2, x: 1}, 'lenient')), [1, 2]);
    });
    t.end();
  });

  test('string props', function(t) {
    it('recognition', function() {
      t.equal(m.match({foos: 'fo', bar: 'bar'}, 'withStringProps'), false);
      t.ok(m.match({foos: 'foo', bar: 'bar'}, 'withStringProps'));
      t.equal(m.match({foos: 'foofo', bar: 'bar'}, 'withStringProps'), false);
      t.ok(m.match({foos: 'foofoo', bar: 'bar'}, 'withStringProps'));
      t.ok(m.match({foos: 'foofoofoofoofoofoo', bar: 'bar'}, 'withStringProps'));
    });

    it('semantic actions', function() {
      var attr = m.synthesizedAttribute({
        withStringProps: function(foos, bar) {
          return [attr(foos), attr(bar)];
        },
        _many: ohm.actions.makeArray,
        _terminal: ohm.actions.getValue,
      });
      t.deepEqual(attr(m.match({foos: 'foofoo', bar: 'bar'}, 'withStringProps')), [
        ['foo', 'foo'], 'bar'
      ]);
    });
    t.end();
  });

  it('duplicate property names are not allowed', function() {
    try {
      m = makeGrammar('M { duh = {x: 1, x: 2, y: 3, ...} }');
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.ok(e instanceof errors.DuplicatePropertyNames);
      t.deepEqual(e.duplicates, ['x']);
    }
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
      t.equal(m.match('fo', 'easy'), false);
      t.ok(m.match('foo', 'easy'));
      t.equal(m.match('fooo', 'easy'), false);
    });

    it('semantic actions', function() {
      var value = m.synthesizedAttribute({
        easy: function(expr) {
          return ['easy', value(expr)];
        },
        foo: function(expr) {
          return ['foo', value(expr)];
        },
        _terminal: ohm.actions.getValue
      });
      t.deepEqual(value(m.match('foo', 'easy')), ['easy', ['foo', 'foo']]);
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
      t.equal(m.match('', 'number'), false);
      t.equal(m.match('a', 'number'), false);
      t.ok(m.match('1', 'number'));
      t.ok(m.match('123', 'number'));
      t.ok(m.match('7276218173', 'number'));
    });

    it('semantic actions', function() {
      var f = m.match('1234', 'number');
      var eval = m.synthesizedAttribute({
        number: ohm.actions.passThrough,
        numberRec: function(n, d) {
          return eval(n) * 10 + eval(d);
        },
        digit: function(expr) {
          return eval(expr).charCodeAt(0) - '0'.charCodeAt(0);
        },
        _terminal: ohm.actions.getValue
      });
      t.equal(eval(f), 1234);
      var parseTree = m.synthesizedAttribute({
        number: function(expr) {
          return ['number', parseTree(expr)];
        },
        numberRec: function(n, d) {
          return ['numberRec', parseTree(n), parseTree(d)];
        },
        digit: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      });
      t.deepEqual(parseTree(f),
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
      t.ok(m.match('x+y+x', 'add'));
    });

    it('semantic actions', function() {
      var v = m.synthesizedAttribute({
        add: ohm.actions.passThrough,
        addRec: function(x, _, y) {
          return [v(x), '+', v(y)];
        },
        pri: ohm.actions.passThrough,
        priX: ohm.actions.passThrough,
        priY: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      });
      t.deepEqual(v(m.match('x+y+x', 'add')), [
        ['x', '+', 'y'], '+', 'x'
      ]);
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
      t.equal(m.match('', 'number'), false);
      t.equal(m.match('a', 'number'), false);
      t.ok(m.match('1', 'number'));
      t.ok(m.match('123', 'number'));
      t.ok(m.match('7276218173', 'number'));
    });

    it('semantic actions', function() {
      var v = m.synthesizedAttribute({
        number: ohm.actions.passThrough,
        foo: ohm.actions.passThrough,
        bar: ohm.actions.passThrough,
        baz: ohm.actions.passThrough,
        qux: ohm.actions.passThrough,
        quux: ohm.actions.passThrough,
        numberRec: function(n, d) {
          return [v(n), v(d)];
        },
        digit: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      });
      t.deepEqual(v(m.match('1234', 'number')), [[['1', '2'], '3'], '4']);
    });
    t.end();
  });

  test('nested left recursion', function(t) {
    var m = makeGrammar([
      'M {',
      '  addExpr = addExprRec | mulExpr',
      '  addExprRec = addExpr "+" mulExpr',
      '  mulExpr = mulExprRec | priExpr',
      '  mulExprRec = mulExpr "*" priExpr',
      '  priExpr = /[0-9]/',
      '  sss = &addExpr addExpr',
      '}'
    ]);

    it('recognition', function() {
      t.ok(m.match('1', 'addExpr'));
      t.ok(m.match('2+3', 'addExpr'));
      t.equal(m.match('4+', 'addExpr'), false);
      t.ok(m.match('5*6', 'addExpr'));
      t.ok(m.match('7*8+9+0', 'addExpr'));
    });

    it('semantic actions', function() {
      var f = m.match('1*2+3+4*5', 'addExpr');
      var parseTree = m.synthesizedAttribute({
        addExpr: function(expr) {
          return ['addExpr', parseTree(expr)];
        },
        addExprRec: function(x, _, y) {
          return ['addExprRec', parseTree(x), parseTree(y)];
        },
        mulExpr: function(expr) {
          return ['mulExpr', parseTree(expr)];
        },
        mulExprRec: function(x, _, y) {
          return ['mulExprRec', parseTree(x), parseTree(y)];
        },
        priExpr: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      });
      t.deepEqual(parseTree(f),
        ['addExpr',
          ['addExprRec',
            ['addExpr',
              ['addExprRec',
                ['addExpr', ['mulExpr', ['mulExprRec', ['mulExpr', '1'], '2']]],
                ['mulExpr', '3']]],
            ['mulExpr', ['mulExprRec', ['mulExpr', '4'], '5']]]]);
      var eval = m.synthesizedAttribute({
        addExpr: function(expr) {
          return eval(expr);
        },
        addExprRec: function(x, _, y) {
          return eval(x) + eval(y);
        },
        mulExpr: function(expr) {
          return eval(expr);
        },
        mulExprRec: function(x, _, y) {
          return eval(x) * eval(y);
        },
        priExpr: function(expr) {
          return parseInt(eval(expr));
        },
        _terminal: ohm.actions.getValue
      });
      t.equal(eval(f), 25);
      var pretty = m.synthesizedAttribute({
        addExpr: ohm.actions.passThrough,
        addExprRec: function(x, _, y) {
          return '(' + pretty(x) + '+' + pretty(y) + ')';
        },
        mulExpr: ohm.actions.passThrough,
        mulExprRec: function(x, _, y) {
          return '(' + pretty(x) + '*' + pretty(y) + ')';
        },
        priExpr: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      });
      t.equal(pretty(f), '(((1*2)+3)+(4*5))');
    });

    it('semantic actions are evaluated lazily', function() {
      var f = m.match('1*2+3+4*5', 'sss');
      var a = buildTreeNodeWithUniqueId(m);
      var tree =
        ['id', 1, 'addExpr',
          ['id', 2, 'addExprRec',
            ['id', 3, 'addExpr',
              ['id', 4, 'addExprRec',
                ['id', 5, 'addExpr',
                  ['id', 6, 'mulExpr',
                    ['id', 7, 'mulExprRec',
                      ['id', 8, 'mulExpr',
                        ['id', 9, 'priExpr', '1']], '*',
                      ['id', 10, 'priExpr', '2']]]], '+',
                  ['id', 11, 'mulExpr',
                    ['id', 12, 'priExpr', '3']]]], '+',
              ['id', 13, 'mulExpr',
                ['id', 14, 'mulExprRec',
                  ['id', 15, 'mulExpr',
                    ['id', 16, 'priExpr', '4']], '*',
                  ['id', 17, 'priExpr', '5']]]]];
      t.deepEqual(a(f), ['id', 0, 'sss', tree, tree]);
      t.equal(a._getNextId(), 18);
    });
    t.end();
  });

  test('nested and indirect left recursion', function(t) {
    var m = makeGrammar([
      'G {',
      '  addExpr = a | c',
      '  a = b',
      '  b = addExprRec',
      '  addExprRec = addExpr "+" mulExpr',
      '  c = d',
      '  d = mulExpr',
      '  mulExpr = e | g',
      '  e = f',
      '  f = mulExprRec',
      '  g = h',
      '  h = priExpr',
      '  mulExprRec = mulExpr "*" priExpr',
      '  priExpr = /[0-9]/',
      '}'
    ]);

    it('recognition', function() {
      t.ok(m.match('1', 'addExpr'));
      t.ok(m.match('2+3', 'addExpr'));
      t.equal(m.match('4+', 'addExpr'), false);
      t.ok(m.match('5*6', 'addExpr'));
      t.ok(m.match('7+8*9+0', 'addExpr'));
    });

    it('semantic actions', function() {
      var buildTree = m.synthesizedAttribute({
        addExprRec: function(x, _, y) {
          return [buildTree(x), '+', buildTree(y)];
        },
        mulExprRec: function(x, _, y) {
          return [buildTree(x), '*', buildTree(y)];
        },
        _terminal: ohm.actions.getValue,
        _default: ohm.actions.passThrough
      });
      t.deepEqual(buildTree(m.match('7+8*9+0', 'addExpr')), [
        ['7', '+', ['8', '*', '9']], '+', '0'
      ]);
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
      t.ok(m.match('1234', 'tricky'));
    });

    it('semantic actions', function() {
      var f = m.match('1234', 'tricky');
      // TODO: perhaps just use JSON.stringify(f) here, and compare the result?
      var buildTree = m.synthesizedAttribute({
        tricky: function(_, x) {
          return ['tricky', buildTree(x)];
        },
        foo: function(expr) {
          return ['foo', buildTree(expr)];
        },
        fooRec: function(x, y) {
          return ['fooRec', buildTree(x), buildTree(y)];
        },
        bar: function(expr) {
          return ['bar', buildTree(expr)];
        },
        barRec: function(x, y) {
          return ['barRec', buildTree(x), buildTree(y)];
        },
        digit: ohm.actions.passThrough,
        _terminal: ohm.actions.getValue
      });
      t.deepEqual(buildTree(f),
        ['tricky', ['bar', ['barRec', ['foo', ['fooRec', ['bar', ['barRec', ['foo', '1'], '2']], '3']], '4']]]);
    });
    t.end();
  });
  t.end();
});

test('inheritance', function(t) {
  test('super-grammar does not exist', function(t) {
    it('in namespace', function() {
      try {
        makeGrammar('G2 <: G1 {}', 'inheritance-oops');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.UndeclaredGrammar);
        t.equal(e.grammarName, 'G1');
        t.equal(e.namespaceName, 'inheritance-oops');
      };
    });

    it('default namespace', function() {
      try {
        makeGrammar('G2 <: G1 {}', 'default');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.UndeclaredGrammar);
        t.equal(e.grammarName, 'G1');
        t.equal(e.namespaceName, 'default');
      };
    });
    t.end();
  });

  test('define', function(t) {
    it('should check that rule does not already exist in super-grammar', function() {
      try {
        makeGrammars([
          'G1 { foo = "foo" }',
          'G2 <: G1 { foo = "bar" }'
        ], 'inheritance-define');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.DuplicateRuleDeclaration);
        t.equal(e.ruleName, 'foo');
        t.equal(e.offendingGrammarName, 'G2');
        t.equal(e.declGrammarName, 'G1');
      };
    });
    t.end();
  });

  test('override', function(t) {
    var m1 = makeGrammar('G1 { number = digit+ }', 'inheritance-override');
    var m2 = makeGrammar('G2 <: G1 { digit := /[a-z]/ }', 'inheritance-override');

    it('should check that rule exists in super-grammar', function() {
      try {
        makeGrammar('G3 <: G1 { foo := "foo" }', 'inheritance-override');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.UndeclaredRule);
        t.equal(e.ruleName, 'foo');
        t.equal(e.grammarName, 'G1');
      };
    });

    it("shouldn't matter if arities aren't the same", function() {
      // It's OK for the semantic action "API" of a grammar to be different
      // from that of its super-grammar.

      // arity(overriding rule) > arity(overridden rule)
      makeGrammar('M1 { foo = "foo" }', 'inheritance-override');
      makeGrammar('M2 <: M1 { foo := "foo" "bar" }', 'inheritance-override');

      // arity(overriding rule) < arity(overridden rule)
      makeGrammar('M3 { foo = digit digit }', 'inheritance-override');
      makeGrammar('M4 <: M3 { foo := digit }', 'inheritance-override');
    });

    it('recognition', function() {
      t.ok(m1.match('1234', 'number'));
      t.equal(m1.match('hello', 'number'), false);
      t.equal(m1.match('h3llo', 'number'), false);

      t.equal(m2.match('1234', 'number'), false);
      t.ok(m2.match('hello', 'number'));
      t.equal(m2.match('h3llo', 'number'), false);
    });

    it('semantic actions', function() {
      var v = m2.synthesizedAttribute({
        number: function(expr) {
          return ['number', v(expr)];
        },
        digit: function(expr) {
          return ['digit', v(expr)];
        },
        _many: ohm.actions.makeArray,
        _terminal: ohm.actions.getValue
      });
      var expected = ['number', [['digit', 'a'], ['digit', 'b'], ['digit', 'c'], ['digit', 'd']]];
      t.deepEqual(v(m2.match('abcd', 'number')), expected);
    });
    t.end();
  });

  test('extend', function(t) {
    var m1 = makeGrammar('G1 { foo = "aaa" "bbb" }', 'inheritanceExtend');
    var m2 = makeGrammar('G2 <: inheritanceExtend.G1 { foo += "111" "222" }', 'inheritanceExtend2');

    it('should check that rule exists in super-grammar', function() {
      try {
        makeGrammar('G3 <: G1 { bar += "bar" }', 'inheritanceExtend');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.UndeclaredRule);
        t.equal(e.ruleName, 'bar');
        t.equal(e.grammarName, 'G1');
      }
    });

    it('should make sure rule arities are compatible', function() {
      // An extending rule must produce the same number of values
      // as the underlying rule. This is to ensure the semantic
      // action "API" doesn't change.

      // Too many:
      makeGrammar('M1 { foo = "foo"  bar = "bar"  baz = "baz" }', 'inheritanceExtend3');
      try {
        makeGrammar('M2 <: M1 { foo += bar baz }', 'inheritanceExtend3');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.InconsistentArity);
        t.equal(e.ruleName, 'foo');
        t.equal(e.expected, 1);
        t.equal(e.actual, 2);
      }

      // Too few:
      makeGrammar('M3 { foo = digit digit }', 'inheritanceExtend3');
      try {
        makeGrammar('M4 <: M3 { foo += digit }', 'inheritanceExtend3');
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.InconsistentArity);
        t.equal(e.ruleName, 'foo');
        t.equal(e.expected, 2);
        t.equal(e.actual, 1);
      }
    });

    it('recognition', function() {
      t.ok(m1.match('aaabbb', 'foo'));
      t.equal(m1.match('111222', 'foo'), false);

      t.ok(m2.match('aaabbb', 'foo'));
      t.ok(m2.match('111222', 'foo'));
    });

    it('semantic actions', function() {
      t.deepEqual(m2.synthesizedAttribute({
        foo: function(x, y) {
          return [x.value(), y.value()];
        }
      })(m2.match('aaabbb', 'foo')), ['aaa', 'bbb']);
      t.deepEqual(m2.synthesizedAttribute({
        foo: function(x, y) {
          return [x.value(), y.value()];
        }
      })(m2.match('111222', 'foo')), ['111', '222']);
    });
    t.end();
  });
  t.end();
});

test('bindings', function(t) {
  it('inconsistent arity in alts is an error', function() {
    try {
      makeGrammar('G { foo = "a" "c" | "b" }');
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.ok(e instanceof errors.InconsistentArity);
      t.equal(e.ruleName, 'foo');
      t.deepEqual(e.expected, 2);
      t.deepEqual(e.actual, 1);
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
    var v = g.synthesizedAttribute({
      foo: function(x, y) {
        var xv = v(x);
        var yv = v(y);
        return {
          x: xv,
          y: yv
        };
      },
      bar: function(expr) {
        return ['bar', v(expr), id++];
      },
      baz: function(expr) {
        return ['baz', v(expr), id++];
      },
      _terminal: ohm.actions.getValue
    });
    t.deepEqual(v(g.match('ab', 'foo')), {
      x: ['bar', 'a', 0],
      y: ['baz', 'b', 1]
    });

    id = 0;
    v = g.synthesizedAttribute({
      foo: function(x, y) {
        var yv = v(y);
        var xv = v(x);
        return {
          x: xv,
          y: yv
        };
      },
      bar: function(expr) {
        return ['bar', v(expr), id++];
      },
      baz: function(expr) {
        return ['baz', v(expr), id++];
      },
      _terminal: ohm.actions.getValue
    });
    t.deepEqual(v(g.match('ab', 'foo')), {
      x: ['bar', 'a', 1],
      y: ['baz', 'b', 0]
    });
  });
  t.end();
});

test('inline rule declarations', function(t) {
  function makeEval(g) {
    var eval = g.synthesizedAttribute({
      addExpr_plus: function(x, op, y) {
        return eval(x) + eval(y);
      },
      addExpr_minus: function(x, op, y) {
        return eval(x) - eval(y);
      },
      mulExpr_times: function(x, op, y) {
        return eval(x) * eval(y);
      },
      mulExpr_divide: function(x, op, y) {
        return eval(x) / eval(y);
      },
      priExpr_paren: function(oparen, e, cparen) {
        return eval(e);
      },
      number_rec: function(n, d) {
        return eval(n) * 10 + eval(d);
      },
      digit: function(expr) {
        return eval(expr).charCodeAt(0) - '0'.charCodeAt(0);
      },
      _default: ohm.actions.passThrough,
      _terminal: ohm.actions.getValue
    });
    return eval;
  }

  var m = makeGrammar(arithmeticGrammarSource);

  it('recognition', function() {
    t.ok(m.match('1*(2+3)-4/5', 'expr'));
  });

  it('semantic actions', function() {
    t.equal(makeEval(m)(m.match('10*(2+123)-4/5', 'expr')), 1249.2);
  });

  it('overriding', function() {
    var m2 = makeGrammar(['Good <: Expr {',
        '  addExpr := addExpr "~" mulExpr  -- minus',
        '           | mulExpr',
        '}'
      ],
      m.namespaceName);
    t.equal(makeEval(m2)(m2.match('2*3~4', 'expr')), 2);

    try {
      makeGrammar('Bad <: Expr { addExpr += addExpr "~" mulExpr  -- minus }', m.namespaceName);
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.ok(e instanceof errors.DuplicateRuleDeclaration);
      t.equal(e.ruleName, 'addExpr_minus');
      t.equal(e.offendingGrammarName, 'Bad');
      t.equal(e.declGrammarName, 'Expr');
    };
  });
  t.end();
});

test('lexical vs. syntactic rules', function(t) {
  it("lexical rules don't skip spaces implicitly", function() {
    var g = makeGrammar('G { start = "foo" "bar" }');
    t.ok(g.match('foobar', 'start'));
    t.equal(g.match('foo bar', 'start'), false);
    t.equal(g.match(' foo bar   ', 'start'), false);
  });

  it('syntactic rules skip spaces implicitly', function() {
    var g = makeGrammar('G { Start = "foo" "bar" }');
    t.ok(g.match('foobar', 'Start'));
    t.ok(g.match('foo bar', 'Start'));
    t.ok(g.match(' foo bar   ', 'Start'));
  });

  it('mixing lexical and syntactic rules works as expected', function() {
    var g = makeGrammar([
      'G {',
      '  foo = "foo"',
      '  bar = "bar"',
      '  Start = foo bar',
      '}'
    ]);
    t.ok(g.match('foobar', 'Start'));
    t.ok(g.match('foo bar', 'Start'));
    t.ok(g.match(' foo bar   ', 'Start'));
  });
  t.end();
});

test('semantic action templates', function(t) {
  makeGrammars([
    'G1 {',
    '  foo = bar',
    '  bar = baz',
    '  baz = qux',
    '  qux = quux',
    '  quux = 42',
    '  aaa = "duh"',
    '  bbb = ~aaa qux  -- blah',
    '}',
    'G2 <: G1 {',
    '  qux := 100',
    '}'
  ], 'semantic-action-templates');
  var g1 = ohm.namespace('semantic-action-templates').grammar('G1');
  var g2 = ohm.namespace('semantic-action-templates').grammar('G2');

  it('rules that need semantic action', function() {
    t.deepEqual(g1.rulesThatNeedSemanticAction([]), {});
    t.deepEqual(g1.rulesThatNeedSemanticAction(['foo']), {
      foo: true,
      bar: true,
      baz: true,
      qux: true,
      quux: true
    });
    t.deepEqual(g1.rulesThatNeedSemanticAction(['aaa']), {aaa: true});
    t.deepEqual(g1.rulesThatNeedSemanticAction(['bbb']), {
      bbb: true,
      bbb_blah: true,
      qux: true,
      quux: true
    });
    t.deepEqual(g1.rulesThatNeedSemanticAction(['aaa', 'bbb']), {
      aaa: true,
      bbb: true,
      bbb_blah: true,
      qux: true,
      quux: true
    });

    t.deepEqual(g2.rulesThatNeedSemanticAction([]), {});
    t.deepEqual(g2.rulesThatNeedSemanticAction(['foo']), {
      foo: true,
      bar: true,
      baz: true,
      qux: true
    });
    t.deepEqual(g2.rulesThatNeedSemanticAction(['aaa']), {aaa: true});
    t.deepEqual(g2.rulesThatNeedSemanticAction(['bbb']), {
      bbb: true,
      bbb_blah: true,
      qux: true
    });
    t.deepEqual(g2.rulesThatNeedSemanticAction(['aaa', 'bbb']), {
      aaa: true,
      bbb: true,
      bbb_blah: true,
      qux: true
    });
  });
  t.end();
});

test('namespaces', function(t) {
  test('install', function(t) {
    var ns1 = ohm.namespace(freshNamespaceName());
    var ns2 = ohm.namespace(freshNamespaceName());

    it('actually installs a grammar in a namespace', function() {
      var m = makeGrammar('aaa { foo = "foo" }', ns1.name);
      t.deepEqual(ns1.grammar('aaa'), m);
      t.ok(m.match('foo', 'foo'));
    });

    it('detects duplicates', function() {
      try {
        makeGrammar('ccc { foo = "foo" }', ns1.name);
        makeGrammar('ccc { bar = "bar" }', ns1.name);
        t.fail('Expected an exception to be thrown');
      } catch(e) {
        t.ok(e instanceof errors.DuplicateGrammarDeclaration);
        t.equal(e.grammarName, 'ccc');
        t.equal(e.namespaceName, ns1.name);
      }
    });

    it('allows same-name grammars to be installed in different namespaces', function() {
      var m1 = makeGrammar('bbb { foo = "foo" }', ns1.name);
      var m2 = makeGrammar('bbb { bar = "bar" }', ns2.name);

      t.deepEqual(ns1.grammar('bbb'), m1);
      t.deepEqual(ns2.grammar('bbb'), m2);
      t.ok(m1 !== m2);
    });
    t.end();
  });
  t.end();
});

test('loadGrammarsFromScriptElement', function(t) {
  var scriptTag = {
    type: 'text/ohm-js',
    innerHTML: [
      'O {',
      '  number = number digit  -- rec',
      '         | digit',
      '}'
    ].join('\n'),
    getAttribute: function(name) {
      return undefined;
    }
  };

  it('recognition', function() {
    var ns = ohm.namespace('aaa1');
    ns.loadGrammarsFromScriptElement(scriptTag);
    try {
      ns.grammar('M');
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.ok(e instanceof errors.UndeclaredGrammar);
      t.equal(e.grammarName, 'M');
      t.equal(e.namespaceName, 'aaa1');
    }
    t.ok(ns.grammar('O'));
    t.ok(ns.grammar('O').match('1234', 'number'));
  });

  it('semantic actions', function() {
    var ns = ohm.namespace('aaa2');
    ns.loadGrammarsFromScriptElement(scriptTag);
    var m = ns.grammar('O');
    t.ok(m);
    var eval = m.synthesizedAttribute({
      number: function(expr) {
        return eval(expr);
      },
      number_rec: function(n, d) {
        return eval(n) * 10 + eval(d);
      },
      digit: function(expr) {
        return eval(expr).charCodeAt(0) - '0'.charCodeAt(0);
      },
      _terminal: ohm.actions.getValue
    });
    t.equal(eval(m.match('1234', 'number')), 1234);
  });
  t.end();
});

test('throw on fail', function(t) {
  it('non-string input', function() {
    var g = makeGrammar('G { start = 5 }');
    try {
      g.match(42, 'start', true);
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.equal(e.message, 'match failed at position 0');
      t.equal(e.getPos(), 0);
    }
  });

  it('string input', function() {
    var g = makeGrammar('G { start = "a" "b" "c" "d" }');
    try {
      g.match('ab', 'start', true);
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.equal(e.message,
        'Line 1, col 3:\n' +
        '> | ab\n' +
        '  |   ^\n' +
        "Expected 'c'");
      t.equal(e.getPos(), 2);
    };
    try {
      g.match('abcde', 'start', true);
      t.fail('Expected an exception to be thrown');
    } catch(e) {
      t.equal(e.message,
        'Line 1, col 5:\n' +
        '> | abcde\n' +
        '  |     ^\n' +
        'Expected end of input');
      t.equal(e.getPos(), 4);
    }
  });
  t.end();
});

test('bootstrap', function(t) {
  var g = makeGrammar(ohmGrammarSource, 'bootstrap');

  it('can recognize arithmetic grammar', function() {
    t.ok(g.match(arithmeticGrammarSource, 'Grammar'));
  });

  it('can recognize itself', function() {
    t.ok(g.match(ohmGrammarSource, 'Grammar'));
  });

  it('can produce a grammar that will recognize itself', function() {
    var gPrime = ohm._makeGrammarBuilder(freshNamespaceName(), g)(g.match(ohmGrammarSource, 'Grammar'));
    t.ok(gPrime.match(ohmGrammarSource, 'Grammar'));
  });

  it('can produce a grammar that works', function() {
    var gPrime = ohm._makeGrammarBuilder(freshNamespaceName(), g)(g.match(ohmGrammarSource, 'Grammar'));
    var a = ohm._makeGrammarBuilder(freshNamespaceName(), gPrime)(gPrime.match(arithmeticGrammarSource, 'Grammar'));
    var eval = a.synthesizedAttribute({
      expr: function(expr) {
        return eval(expr);
      },
      addExpr: function(expr) {
        return eval(expr);
      },
      addExpr_plus: function(x, op, y) {
        return eval(x) + eval(y);
      },
      addExpr_minus: function(x, op, y) {
        return eval(x) - eval(y);
      },
      mulExpr: function(expr) {
        return eval(expr);
      },
      mulExpr_times: function(x, op, y) {
        return eval(x) * eval(y);
      },
      mulExpr_divide: function(x, op, y) {
        return eval(x) / eval(y);
      },
      priExpr: function(expr) {
        return eval(expr);
      },
      priExpr_paren: function(oparen, e, cparen) {
        return eval(e);
      },
      number: function(expr) {
        return eval(expr);
      },
      number_rec: function(n, d) {
        return eval(n) * 10 + eval(d);
      },
      digit: function(expr) {
        return eval(expr).charCodeAt(0) - '0'.charCodeAt(0);
      },
      _terminal: ohm.actions.getValue
    });
    t.equal(eval(a.match('10*(2+123)-4/5', 'expr')), 1249.2);
  });

  it('full bootstrap!', function() {
    var gPrime = ohm._makeGrammarBuilder(freshNamespaceName(), g)(g.match(ohmGrammarSource, 'Grammar'));
    var gPrimePrime = ohm._makeGrammarBuilder(freshNamespaceName(), gPrime)(gPrime.match(ohmGrammarSource, 'Grammar'));
    gPrimePrime.namespaceName = gPrime.namespaceName; // make their namespaceName properties the same
    compareGrammars(t, gPrime, gPrimePrime);
  });

  it('inherited attributes', function() {
    var g = makeGrammar([
      'G {',
      '  abcs = "a" b "c"*',
      '  b    = "b"',
      '}'
    ]);
    var depth = g.inheritedAttribute({
      _base: function(node) {
        depth.set(0);
      },
      abcs$0: function(a) {
        depth.set(depth(this) + 1);
      },
      abcs$1: function(b) {
        depth.set(depth(this) + 1);
      },
      abcs$2: function(cs) {
        depth.set(depth(this) + 1);
      },
      abcs$2$each: function(c) {
        depth.set(depth(this) + 1);
      },
      b$0: function(b) {
        depth.set(depth(this) + 1);
      }
    });
    var print = g.semanticAction({
      _default: function() {
        for (var idx = 0; idx < this.numChildren(); idx++) {
          print(this.childAt(idx));
        }
      },
      _terminal: function(t) {
        console.log('terminal ' + t + ' has depth ' + depth(this));
      }
    });
    var cst = g.match('abccc', 'abcs');
    print(cst);
  });
  t.end();
});

test('definitionInterval', function(t) {
  var g = makeGrammar([
    'G {',
    '  foo = bar',
    '  bar = "a" | "b" -- baz',
    '}'
  ], 'ns');

  function definitionLoc(grammar, ruleName) {
    var interval = grammar.ruleDict[ruleName].definitionInterval;
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
  ], 'ns');
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
    '  bar = "a" | "blah" | /[a-z]/ -- baz',
    '}'
  ]);

  function fromLoc(pexpr) {
    return [pexpr.interval.startIdx, pexpr.interval.endIdx];
  }
  var fooBody = g.ruleDict.foo;
  var beepBody = g.ruleDict.beep;
  var barBody = g.ruleDict.bar;
  it('works for regular rule applications', function() {
    t.deepEqual(fromLoc(fooBody), [12, 15]);
    t.deepEqual(fromLoc(beepBody.factors[1]), [32, 35]);
  });
  it('works for applications of built-in rules', function() {
    t.deepEqual(fromLoc(beepBody.factors[0]), [25, 31]);
  });
  it('works for primitives', function() {
    t.deepEqual(fromLoc(barBody.terms[0]), [44, 47]);
    t.deepEqual(fromLoc(barBody.terms[1]), [50, 56]);

    var barBazBody = g.ruleDict.bar_baz;
    t.deepEqual(fromLoc(barBazBody), [59, 66]);
  });
  it('is undefined for other types of pexpr', function() {
    t.equal(beepBody.fromInterval, undefined);
    t.equal(barBody.fromInterval, undefined);
  });
  t.end();
});

test('trace', function(t) {
  var g = makeGrammar('G { start = "a" | letter* }');
  t.test('basic tracing', function(t) {
    var state = g.trace('hallo', 'start');
    var trace = state.trace;

    t.equal(trace.length, 1);
    t.equal(trace[0].displayString, 'start');
    t.equal(trace[0].succeeded, true);
    t.equal(trace[0].pos, 0);

    var alt = trace[0].children[0];
    t.equal(alt.displayString, '"a" | letter*');
    t.equal(alt.succeeded, true);
    t.equal(alt.children[0].succeeded, false);
    t.equal(alt.children[1].succeeded, true);

    var many = alt.children[1];
    t.equal(many.displayString, 'letter*');
    t.equal(many.interval.contents, 'hallo');
    t.equal(many.children.length, 6);

    var childrenSucceeded = many.children.map(function(c) {
      return c.succeeded;
    });
    t.deepEqual(childrenSucceeded, [true, true, true, true, true, false]);
    t.end();
  });

  var g2 = makeGrammar('G { start = letter ~letter | letter* }');
  t.test('traces with memoization', function(t) {
    var state = g2.trace('ab', 'start');
    var trace = state.trace;
    t.equal(trace.length, 1);

    var alt = trace[0].children[0];
    t.equal(alt.children[0].succeeded, false);
    t.equal(alt.children[1].succeeded, true);
    t.equal(alt.children.length, 2);

    var many = alt.children[1];
    t.equal(many.children.length, 3);

    // The 'letter*' should succeed, but its first two children should be
    // memoized from the other size of the Alt (letter ~letter). Ensure
    // the the trace is still recorded properly.
    t.equal(many.children[0].succeeded, true);
    t.equal(many.children[0].children.length, 1);
    t.equal(many.children[0].children[0].displayString, '/[a-zA-Z]/');

    t.equal(many.children[1].succeeded, true);
    t.equal(many.children[1].children.length, 1);
    t.equal(many.children[1].children[0].displayString, '/[a-zA-Z]/');
    t.end();
  });
  t.end();
});

test('toDisplayString', function(t) {
  var g = makeGrammar('G { start = "ab" | letter* | /[a-z]/ }');
  it('does the right thing', function() {
    var seq = g.ruleDict.start;
    t.equal(seq.toDisplayString(), '"ab" | letter* | /[a-z]/');
    t.equal(seq.terms[0].toDisplayString(), '"ab"');

    var many = seq.terms[1];
    t.equal(many.toDisplayString(), 'letter*');
    t.equal(many.expr.toDisplayString(), 'letter');

    t.equal(seq.terms[2].toDisplayString(), '/[a-z]/');
  });
  t.end();
});

test('infinite loops', function(t) {
  function matchExpr(expr, input) {
    var g = makeGrammar('G { start = ' + expr + '}');
    return g.match(input, 'start');
  }
  t.throws(function() { matchExpr('("a"*)*', 'aaa') }, errors.InfiniteLoop);
  t.throws(function() { matchExpr('("a"?)*', 'aaa') }, errors.InfiniteLoop);
  t.throws(function() { matchExpr('("a"*)+', 'aaa') }, errors.InfiniteLoop);
  t.throws(function() { matchExpr('("a"?)+', 'aaa') }, errors.InfiniteLoop);

  try {
    matchExpr('("a"*)*', 'aaa');
    t.fail('Expected an exception to be thrown');
  } catch(e) {
    t.equal(e.message, [
      'Line 1, col 4:',
      '> | aaa',
      '  |    ^',
      'Infinite loop detected when matching \'("a"*)*\''].join('\n'));
  }

  t.end();
});
