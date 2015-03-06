var expect = require('expect.js');
var fs = require('fs');
var ohm = require('../src/main.js');
var errors = require('../src/errors.js');
var Node = require('../src/Node.js');
var InputStream = require('../src/InputStream.js');
var Interval = require('../src/Interval.js');

var nextFreshNSId = 0;
function freshNamespaceName() {
  return "ns" + nextFreshNSId++;
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

function compareGrammars(expected, actual) {
  // The other property on grammars is "constructors", which contains
  // closures which cause spurious test failures if we compare
  // them. So we ignore that property here, concentrating on ruleDict
  // and other "real" properties of each grammar.

  expect(typeof actual).to.be(typeof expected);
  // ^ e.g. when one is undefined and the other isn't

  if (expected && actual) {
    compareGrammars(expected.superGrammar, actual.superGrammar);
    // In the list below, we exclude superGrammar (just tested above)
    // and constructors (for reasons given above).
    ["namespaceName", "name", "ruleDecls", "ruleDict"].forEach(function (prop) {
      expect(actual[prop]).to.eql(expected[prop]);
    });
  }
}

describe("Ohm", function() {
  describe("unit tests", function() {

    function buildTreeNodeWithUniqueId(m) {
      var nextId = 0;
      var attr = m.synthesizedAttribute({
        _default: function() {
          return ['id', nextId++, this.ctorName].concat(this.children.map(attr));
        },
        _many: ohm.actions.makeArray,
        _terminal: ohm.actions.getValue
      });
      attr._getNextId = function() { return nextId; };
      return attr;
    }

    describe("grammar constructors dictionary", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar(arithmeticGrammarSource);
      });

      it("exists and has a _default entry", function() {
        expect(m.constructors).to.be.ok();
      });

      it("has an entry for each of a few carefully chosen rules", function () {
        expect(m.constructors.addExpr).to.be.ok();
        expect(m.constructors.addExpr_minus).to.be.ok();
        expect(m.constructors.priExpr).to.be.ok();
        expect(m.constructors.digit).to.be.ok();
        expect(m.constructors._).to.be.ok();
      });

      it("lacks entries for nonexistent rules", function () {
        expect(m.constructors.foobar).to.be(undefined);
      });

      it("_default entry rejects nonexistent rule name", function () {
        expect(function () { m.construct('foobar', []) })
          .to.throwException(function (e) {
            expect(e).to.be.a(errors.InvalidConstructorCall);
          });
      });

      it("_default entry works when called correctly", function () {
        expect(m.construct('addExpr', [m.match('1+2', 'addExpr_plus')]))
          .to.be.a(Node);
      });

      it("particular entries work when called", function () {
        var n = m.matchContents('1+2*3', 'addExpr');
        expect(n.ctorName).to.equal('addExpr');
        var n2 = m.constructors.addExpr(n.children[0]);

        var p = n.children[0];
        expect(p.ctorName).to.equal('addExpr_plus');
        expect(p.numChildren()).to.equal(3);
        var p2 = m.constructors.addExpr_plus(p.children[0], p.children[1], p.children[2]);
      });
    });

    describe("helper stuff", function() {
      describe("intervals", function() {
        describe("collapsing", function() {
          it("left", function() {
            var interval = makeInterval('hello world', 0, 5);
            var collapsed = interval.collapsedLeft();

            // Original interval shouldn't change
            expect(interval.startIdx).to.equal(0);
            expect(interval.endIdx).to.equal(5);
            expect(interval.inputStream.source).to.equal('hello world');
            expect(interval.contents).to.equal('hello');

            expect(collapsed.startIdx).to.equal(0);
            expect(collapsed.endIdx).to.equal(0);
            expect(collapsed.inputStream.source).to.equal('hello world');
            expect(collapsed.contents).to.equal('');
          });

          it("right", function() {
            var interval = makeInterval('hello world', 0, 5);
            var collapsed = interval.collapsedRight();

            // Original interval shouldn't change
            expect(interval.startIdx).to.equal(0);
            expect(interval.endIdx).to.equal(5);
            expect(interval.inputStream.source).to.equal('hello world');
            expect(collapsed.contents).to.equal('');

            expect(collapsed.startIdx).to.equal(5);
            expect(collapsed.endIdx).to.equal(5);
            expect(collapsed.inputStream.source).to.equal('hello world');
            expect(collapsed.contents).to.equal('');
          });
        });

        describe("coverage", function() {
          it("one interval", function() {
            var interval = makeInterval('hello world', 0, 5);
            var ans = Interval.coverage(interval);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.inputStream.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("two adjacent intervals", function() {
            var interval1 = makeInterval('hello world', 2, 5);
            var interval2 = makeInterval(interval1.inputStream, 0, 2);
            var ans = Interval.coverage(interval1, interval2);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.inputStream.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("two non-adjacent intervals", function() {
            var interval1 = makeInterval('hello world', 0, 2);
            var interval2 = makeInterval(interval1.inputStream, 4, 5);
            var ans = Interval.coverage(interval1, interval2);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.inputStream.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("nested intervals", function() {
            var interval1 = makeInterval('hello world', 0, 5);
            var interval2 = makeInterval(interval1.inputStream, 3, 4);
            var ans = Interval.coverage(interval1, interval2);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.inputStream.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("more intervals", function() {
            var interval1 = makeInterval('hello world', 0, 2);
            var interval2 = makeInterval(interval1.inputStream, 3, 4);
            var interval3 = makeInterval(interval1.inputStream, 6, 10);
            var ans = Interval.coverage(interval1, interval2, interval3);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(10);
            expect(ans.inputStream.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello worl');
          });

          it("brotha from anotha motha", function() {
            var interval1 = makeInterval('abc', 0, 3);
            var interval2 = makeInterval('xyz', 1, 2);
            expect(function() { Interval.coverage(interval1, interval2); }).to.throwException(function(e) {
              expect(e).to.be.a(errors.IntervalSourcesDontMatch);
            });
          });

          it("coverageWith (same method as above but as a method of an interval)", function() {
            var interval1 = makeInterval('hello world', 0, 2);
            var interval2 = makeInterval(interval1.inputStream, 3, 4);
            var interval3 = makeInterval(interval1.inputStream, 6, 10);
            var ans = interval1.coverageWith(interval2, interval3);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(10);
            expect(ans.inputStream.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello worl');
          });
        });
      });
    });

    describe("primitive patterns", function() {
      describe("anything", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar("M { }");
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(5, '_')).to.be.ok();
            expect(m.match(null, '_')).to.be.ok();
          });

          it("semantic actions", function() {
            var dict = {
              _: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            expect(m.synthesizedAttribute(dict)(m.match(5, '_'))).to.equal(5);
            expect(m.synthesizedAttribute(dict)(m.match(null, '_'))).to.equal(null);
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.match('5', '_')).to.be.ok();
            expect(m.matchContents('5', '_')).to.be.ok();
            expect(m.matchContents('', '_')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              _: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            expect(m.synthesizedAttribute(dict)(m.match('5', '_'))).to.equal('5');
            expect(m.synthesizedAttribute(dict)(m.matchContents('5', '_'))).to.equal('5');
          });
        });

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['123'], '_')).to.be.ok();
            expect(m.matchContents(['123', 4], '_')).to.equal(false);
            expect(m.matchContents([], '_')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              _: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            expect(m.synthesizedAttribute(dict)(m.matchContents(['123'], '_'))).to.equal('123');
          });
        });
      });

      describe("exactly(x)", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  five = 5",
            "  _true = true",
            "  _false = false",
            "  _null = null",
            "  _undefined = undefined",
            "}"]);
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(5, 'five')).to.be.ok();
            expect(m.match(2, 'five')).to.equal(false);
            expect(m.match('a', 'five')).to.equal(false);
            expect(m.match('5', 'five')).to.equal(false);
            expect(m.match('true', 'five')).to.equal(false);
            expect(m.match(true, 'five')).to.equal(false);
            expect(m.match('false', 'five')).to.equal(false);
            expect(m.match(false, 'five')).to.equal(false);
            expect(m.match(null, 'five')).to.equal(false);
            expect(m.match(undefined, 'five')).to.equal(false);

            expect(m.match(5, '_true')).to.equal(false);
            expect(m.match(2, '_true')).to.equal(false);
            expect(m.match('a', '_true')).to.equal(false);
            expect(m.match('5', '_true')).to.equal(false);
            expect(m.match('true', '_true')).to.equal(false);
            expect(m.match(true, '_true')).to.be.ok();
            expect(m.match('false', '_true')).to.equal(false);
            expect(m.match(false, '_true')).to.equal(false);
            expect(m.match(null, '_true')).to.equal(false);
            expect(m.match(undefined, '_true')).to.equal(false);

            expect(m.match(5, '_false')).to.equal(false);
            expect(m.match(2, '_false')).to.equal(false);
            expect(m.match('a', '_false')).to.equal(false);
            expect(m.match('5', '_false')).to.equal(false);
            expect(m.match('true', '_false')).to.equal(false);
            expect(m.match(true, '_false')).to.equal(false);
            expect(m.match('false', '_false')).to.equal(false);
            expect(m.match(false, '_false')).to.be.ok();
            expect(m.match(null, '_false')).to.equal(false);
            expect(m.match(undefined, '_false')).to.equal(false);

            expect(m.match(5, '_null')).to.equal(false);
            expect(m.match(2, '_null')).to.equal(false);
            expect(m.match('a', '_null')).to.equal(false);
            expect(m.match('5', '_null')).to.equal(false);
            expect(m.match('true', '_null')).to.equal(false);
            expect(m.match(true, '_null')).to.equal(false);
            expect(m.match('false', '_null')).to.equal(false);
            expect(m.match(false, '_null')).to.equal(false);
            expect(m.match(null, '_null')).to.be.ok();
            expect(m.match(undefined, '_null')).to.equal(false);

            expect(m.match(5, '_undefined')).to.equal(false);
            expect(m.match(2, '_undefined')).to.equal(false);
            expect(m.match('a', '_undefined')).to.equal(false);
            expect(m.match('5', '_undefined')).to.equal(false);
            expect(m.match('true', '_undefined')).to.equal(false);
            expect(m.match(true, '_undefined')).to.equal(false);
            expect(m.match('false', '_undefined')).to.equal(false);
            expect(m.match(false, '_undefined')).to.equal(false);
            expect(m.match(null, '_undefined')).to.equal(false);
            expect(m.match(undefined, '_undefined')).to.be.ok();
          });

          it("semantic actions", function() {
            var dict = {
              five: ohm.actions.passThrough,
              _true: ohm.actions.passThrough,
              _false: ohm.actions.passThrough,
              _null: ohm.actions.passThrough,
              _undefined: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue,
            };
            expect(m.synthesizedAttribute(dict)(m.match(5, 'five'))).to.equal(5);
            expect(m.synthesizedAttribute(dict)(m.match(true, '_true'))).to.equal(true);
            expect(m.synthesizedAttribute(dict)(m.match(false, '_false'))).to.equal(false);
            expect(m.synthesizedAttribute(dict)(m.match(null, '_null'))).to.equal(null);
            expect(m.synthesizedAttribute(dict)(m.match(undefined, '_undefined'))).to.equal(undefined);
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('!', 'five')).to.equal(false);
            expect(m.matchContents('5', 'five')).to.equal(false);
            expect(m.matchContents('2', 'five')).to.equal(false);
            expect(m.matchContents('', 'five')).to.equal(false);
            expect(m.matchContents('true', '_true')).to.equal(false);
            expect(m.matchContents('false', '_false')).to.equal(false);
            expect(m.matchContents('null', '_null')).to.equal(false);
            expect(m.matchContents('undefined', '_undefined')).to.equal(false);
          });

          it("semantic actions", function() {
            // N/A
          });
        });

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['!'], 'five')).to.equal(false);
            expect(m.matchContents(['5'], 'five')).to.equal(false);
            expect(m.matchContents([2], 'five')).to.equal(false);
            expect(m.matchContents([5], 'five')).to.be.ok();
            expect(m.matchContents([5, 'a'], 'five')).to.equal(false);
            expect(m.matchContents([''], 'five')).to.equal(false);
            expect(m.matchContents([], 'five')).to.equal(false);
            expect(m.matchContents([true], '_true')).to.be.ok();
            expect(m.matchContents([false], '_false')).to.be.ok();
            expect(m.matchContents([undefined], '_undefined')).to.be.ok();
          });

          it("semantic actions", function() {
            var dict = {
              five: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue,
            };
            var cst = m.matchContents([5], 'five');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal(5);
          });
        });
      });

      describe("char", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { bang = "!" }');
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match('!', 'bang')).to.be.ok();
            expect(m.match('!a', 'bang')).to.equal(false);
            expect(m.match(5, 'bang')).to.equal(false);
            expect(m.match('', 'bang')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              bang: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.match('!', 'bang');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('!');
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('!', 'bang')).to.be.ok();
            expect(m.matchContents('a', 'bang')).to.equal(false);
            expect(m.matchContents('', 'bang')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              bang: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.matchContents('!', 'bang');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('!');
          });
        });

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['!'], 'bang')).to.be.ok();
            expect(m.matchContents(['a'], 'bang')).to.equal(false);
            expect(m.matchContents(['!', 'a'], 'bang')).to.equal(false);
            expect(m.matchContents([''], 'bang')).to.equal(false);
            expect(m.matchContents([], 'bang')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              bang: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.matchContents(['!'], 'bang');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('!');
          });
        });
      });

      describe("string", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { foo = "foo" }');
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match('foo', 'foo')).to.be.ok();
            expect(m.match('foo1', 'foo')).to.equal(false);
            expect(m.match('bar', 'foo')).to.equal(false);
            expect(m.match(null, 'foo')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              foo: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.match('foo', 'foo');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('foo');
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('foo', 'foo')).to.be.ok();
            expect(m.matchContents('foo1', 'foo')).to.equal(false);
            expect(m.matchContents('bar', 'foo')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              foo: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.matchContents('foo', 'foo');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('foo');
          });
        });

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['foo'], 'foo')).to.be.ok();
            expect(m.matchContents(['foo1'], 'foo')).to.equal(false);
            expect(m.matchContents(['foo', '1'], 'foo')).to.equal(false);
            expect(m.matchContents(['foo', 'foo'], 'foo')).to.equal(false);
            expect(m.matchContents([''], 'foo')).to.equal(false);
            expect(m.matchContents([], 'foo')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              foo: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.matchContents(['foo'], 'foo');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('foo');
          });
        });
      });

      describe("regexp", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { myDigit = /[0-9]/ myLetter = /\\p{L}/ myLF = /\\p{LF}/ }');
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(/[0-9]/, 'myDigit')).to.equal(false);
            expect(m.match('4', 'myDigit')).to.be.ok();
            expect(m.match(4, 'myDigit')).to.equal(false);
            expect(m.match('a', 'myDigit')).to.equal(false);
            expect(m.match('a4', 'myDigit')).to.equal(false);
          });

          it("semantic actions", function() {
            // N/A
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('4', 'myDigit')).to.be.ok();
            expect(m.matchContents('a', 'myDigit')).to.equal(false);
            expect(m.matchContents('a4', 'myDigit')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              myDigit: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.matchContents('4', 'myDigit');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('4');
          });
        });

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['4'], 'myDigit')).to.equal(false);
            expect(m.matchContents([/[0-9]/], 'myDigit')).to.equal(false);
            expect(m.matchContents([''], 'myDigit')).to.equal(false);
            expect(m.matchContents([], 'myDigit')).to.equal(false);
          });

          it("semantic actions", function() {
            // N/A
          });
        });

        describe("unicode match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('4', 'myLetter')).to.equal(false);
            expect(m.matchContents('a', 'myLetter')).to.be.ok();
            expect(m.matchContents('a4', 'myLetter')).to.equal(false);
            expect(m.matchContents('\u03e6', 'myLetter')).to.be.ok();
            expect(m.matchContents('\u226a', 'myLetter')).to.equal(false);
            expect(m.matchContents('\n', 'myLF')).to.be.ok();
            expect(m.matchContents('x', 'myLF')).to.equal(false);
          });

          it("semantic actions", function() {
            var dict = {
              myLetter: ohm.actions.passThrough,
              _terminal: ohm.actions.getValue
            };
            var cst = m.matchContents('a', 'myLetter');
            expect(m.synthesizedAttribute(dict)(cst)).to.equal('a');
          });
        });
      });
    });

    describe("alt", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar('M { altTest = "a" | "b" }');
      });

      it("recognition", function() {
        expect(m.matchContents('', 'altTest')).to.equal(false);
        expect(m.matchContents('a', 'altTest')).to.be.ok();
        expect(m.matchContents('b', 'altTest')).to.be.ok();
        expect(m.matchContents('ab', 'altTest')).to.equal(false);
      });

      it("semantic actions", function() {
        var dict = {
          altTest: ohm.actions.passThrough,
          _terminal: ohm.actions.getValue
        };
        expect(m.synthesizedAttribute(dict)(m.matchContents('a', 'altTest'))).to.equal('a');
        expect(m.synthesizedAttribute(dict)(m.matchContents('b', 'altTest'))).to.equal('b');
      });
    });

    describe("seq", function() {
      describe("without bindings", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { start = "a" "bc" "z" }');
        });

        it("recognition", function() {
          expect(m.matchContents('a', 'start')).to.equal(false);
          expect(m.matchContents('bc', 'start')).to.equal(false);
          expect(m.matchContents('abcz', 'start')).to.be.ok();
          expect(m.matchContents('abbz', 'start')).to.equal(false);
        });

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start');
          expect(m.synthesizedAttribute({
            start: function(x, y, z) { return [x.interval.contents, y.interval.contents, z.interval.contents]; }
          })(f)).to.eql(['a', 'bc', 'z']);
        });
      });

      describe("with exactly one binding", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { start = "a" "bc" "z" }');
        });

        it("recognition", function() {
          expect(m.matchContents('a', 'start')).to.equal(false);
          expect(m.matchContents('bc', 'start')).to.equal(false);
          expect(m.matchContents('abcz', 'start')).to.be.ok();
          expect(m.matchContents('abbz', 'start')).to.equal(false);
        });

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start');
          expect(m.synthesizedAttribute({
            start: function(x, _, _) { return x.value(); },
          })(f)).to.eql('a');
        });
      });

      describe("with more than one binding", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { start = "a" "bc" "z" }');
        });

        it("recognition", function() {
          expect(m.matchContents('a', 'start')).to.equal(false);
          expect(m.matchContents('bc', 'start')).to.equal(false);
          expect(m.matchContents('abcz', 'start')).to.be.ok();
          expect(m.matchContents('abbz', 'start')).to.equal(false);
        });

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start');
          expect(m.synthesizedAttribute({
            start: function(x, _, y) { return [x.value(), y.value()]; }
          })(f)).to.eql(['a', 'z']);
        });
      });
    });

    describe("alts and seqs together", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar('M { start = "a" "b" "c" | "1" "2" "3" }');
      });

      it("recognition", function() {
        expect(m.matchContents('ab', 'start')).to.equal(false);
        expect(m.matchContents('12', 'start')).to.equal(false);
        expect(m.matchContents('abc', 'start')).to.be.ok();
        expect(m.matchContents('123', 'start')).to.be.ok();
      });

      it("semantic actions", function() {
        expect(m.synthesizedAttribute({start: function(x, _, y) { return [x.value(), y.value()] }})(m.matchContents('abc', 'start')))
          .to.eql(['a', 'c']);
        expect(m.synthesizedAttribute({start: function(x, _, y) { return [x.value(), y.value()] }})(m.matchContents('123', 'start')))
          .to.eql(['1', '3']);
      });
    });

    describe("many", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar([
          "M {",
          "  number = digit+",
          "  digits = digit*",
          "  sss = &number number",
          "}"]);
      });

      it("recognition", function() {
        expect(m.matchContents('1234a', 'number')).to.equal(false);
        expect(m.matchContents('1234', 'number')).to.be.ok();
        expect(m.matchContents('5', 'number')).to.be.ok();
        expect(m.matchContents('', 'number')).to.equal(false);

        expect(m.matchContents('1234a', 'digits')).to.equal(false);
        expect(m.matchContents('1234', 'digits')).to.be.ok();
        expect(m.matchContents('5', 'digits')).to.be.ok();
        expect(m.matchContents('', 'digits')).to.be.ok();
      });

      it("semantic actions", function() {
        var value = m.synthesizedAttribute({
          number:     function(expr) { return ['digits', value(expr)]; },
          digit:      function(expr) { return ['digit', value(expr)]; },
          _many:      ohm.actions.makeArray,
          _terminal:  ohm.actions.getValue
        });
        expect(value(m.matchContents('1234', 'number')))
          .to.eql(['digits', [['digit', '1'], ['digit', '2'], ['digit', '3'], ['digit', '4']]]);
      });

      it("semantic actions are evaluated lazily", function() {
        var a = buildTreeNodeWithUniqueId(m);
        var t = ['id', 1, 'number', [[ 'id', 2, 'digit', '1'], ['id', 3, 'digit', '2'], ['id', 4, 'digit', '3']]];
        expect(a(m.matchContents('123', 'sss'))).to.eql(['id', 0, 'sss', t, t]);
        expect(a._getNextId()).to.equal(5);
      });
    });

    describe("opt", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar('M { name = "dr"? "warth" }');
      });

      it("recognition", function() {
        expect(m.matchContents('drwarth', 'name')).to.be.ok();
        expect(m.matchContents('warth', 'name')).to.be.ok();
        expect(m.matchContents('mrwarth', 'name')).to.equal(false);
      });

      it("semantic actions", function() {
        var actionDict = {name: function(title, last) { return [title.value(), last.value()]; }};
        expect(m.synthesizedAttribute(actionDict)(m.matchContents('drwarth', 'name'))).to.eql(['dr', 'warth']);
        expect(m.synthesizedAttribute(actionDict)(m.matchContents('warth', 'name'))).to.eql([undefined, 'warth']);
      });
    });

    describe("not", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar('M { start = ~"hello" _* }');
      });

      it("recognition", function() {
        expect(m.matchContents('yello world', 'start')).to.be.ok();
        expect(m.matchContents('hello world', 'start')).to.equal(false);
      });

      it("semantic actions", function() {
        expect(m.synthesizedAttribute({
          start: function(x) { return x.interval.contents; }
        })(m.matchContents('yello world', 'start'))).to.equal('yello world');
      });
    });

    describe("lookahead", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar('M { start = &"hello" _* }');
      });

      it("recognition", function() {
        expect(m.matchContents('hello world', 'start')).to.be.ok();
        expect(m.matchContents('hell! world', 'start')).to.equal(false);
      });

      it("semantic actions", function() {
        expect(m.synthesizedAttribute({start: function(x, _) { return x.value() }})(m.matchContents('hello world', 'start'))).to.equal('hello');
      });
    });

    describe("arr", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar('M { start = ["abc" &_ ["d" "ef"] "g"] }');
      });

      it("recognition", function() {
        expect(m.match(['abc', ['d', 'ef'], 'g'], 'start')).to.be.ok();
        expect(m.match(['abc', ['def'], 'g'], 'start')).to.equal(false);
        expect(m.match(['abc', 'def', 'g'], 'start')).to.equal(false);
        expect(m.match(['abc', ['d', 'ef', 'oops'], 'g'], 'start')).to.equal(false);
        expect(m.match(['abc', ['d', 'ef'], 'gh'], 'start')).to.equal(false);
        expect(m.match(['abc', [5], 'g'], 'start')).to.equal(false);
        expect(m.match(['abc', [], 'g'], 'start')).to.equal(false);
        expect(m.match(['abc', 5, 'g'], 'start')).to.equal(false);
      });

      it("semantic actions", function() {
        var value = m.synthesizedAttribute({
          start: function(_, y, x, _, _) { return [value(x), value(y)]; },
          _: ohm.actions.passThrough,
          _terminal: ohm.actions.getValue
        });
        expect(value(m.match(['abc', ['d', 'ef'], 'g'], 'start'))).to.eql(['d', ['d', 'ef']]);
      });
    });

    describe("obj", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar([
          'M {',
          '  strict  = {x: 1, y: (2)}',
          '  lenient = {x: 1, y: (2), ...}',
          '  withStringProps = {foos: ``"foo"*\'\', bar: "bar"}',
          '}']);
      });

      describe("strict", function() {
        it("recognition", function() {
          expect(m.match('foo', 'strict')).to.equal(false);
          expect(m.match([], 'strict')).to.equal(false);
          expect(m.match({y: 2}, 'strict')).to.equal(false);
          expect(m.match({x: 1, y: 2}, 'strict')).to.be.ok();
          expect(m.match({y: 2, x: 1}, 'strict')).to.be.ok();
          expect(m.match({x: 1, y: 2, z: 3}, 'strict')).to.equal(false);
        });

        it("semantic actions", function() {
          expect(m.synthesizedAttribute({
            strict: function(a, b) { return [a.value(), b.value()]; }
          })(m.match({x: 1, y: 2}, 'strict')))
          expect(m.synthesizedAttribute({
            strict: function(a, b) { return [a.value(), b.value()]; }
          })(m.match({y: 2, x: 1}, 'strict'))).to.eql([1, 2]);
        });
      });

      describe("lenient", function() {
        it("recognition", function() {
          expect(m.match('foo', 'lenient')).to.equal(false);
          expect(m.match([], 'lenient')).to.equal(false);
          expect(m.match({y: 2}, 'lenient')).to.equal(false);
          expect(m.match({x: 1, y: 2}, 'lenient')).to.be.ok();
          expect(m.match({y: 2, x: 1}, 'lenient')).to.be.ok();
          expect(m.match({x: 1, y: 2, z: 3}, 'lenient')).to.be.ok();
        });

        it("semantic actions", function() {
          expect(m.synthesizedAttribute({
            lenient: function(a, b, _) { return [a.value(), b.value()]; }
          })(m.match({x: 1, y: 2}, 'lenient'))).to.eql([1, 2]);
          expect(m.synthesizedAttribute({
            lenient: function(a, b, _) { return [a.value(), b.value()]; }
          })(m.match({y: 2, x: 1}, 'lenient'))).to.eql([1, 2]);
        });
      });

      describe("string props", function() {
        it("recognition", function() {
          expect(m.match({foos: 'fo', bar: 'bar'}, 'withStringProps')).to.equal(false);
          expect(m.match({foos: 'foo', bar: 'bar'}, 'withStringProps')).to.be.ok();
          expect(m.match({foos: 'foofo', bar: 'bar'}, 'withStringProps')).to.equal(false);
          expect(m.match({foos: 'foofoo', bar: 'bar'}, 'withStringProps')).to.be.ok();
          expect(m.match({foos: 'foofoofoofoofoofoo', bar: 'bar'}, 'withStringProps')).to.be.ok();
        });

        it("semantic actions", function() {
          var attr = m.synthesizedAttribute({
            withStringProps: function(foos, bar) { return [attr(foos), attr(bar)]; },
            _many: ohm.actions.makeArray,
            _terminal: ohm.actions.getValue,
          });
          expect(attr(m.match({foos: 'foofoo', bar: 'bar'}, 'withStringProps'))).to.eql([['foo', 'foo'], 'bar']);
        });
      });

      it("duplicate property names are not allowed", function() {
        expect(function() {
          m = makeGrammar("M { duh = {x: 1, x: 2, y: 3, ...} }");
        }).to.throwException(function(e) {
          expect(e).to.be.a(errors.DuplicatePropertyNames);
          expect(e.duplicates).to.eql(['x']);
        });
      });
    });

    describe("apply", function() {
      describe("simple, no left recursion", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            'M {',
            '  easy = foo',
            '  foo = "foo"',
            '}']);
        });

        it("recognition", function() {
          expect(m.matchContents('fo', 'easy')).to.equal(false);
          expect(m.matchContents('foo', 'easy')).to.be.ok();
          expect(m.matchContents('fooo', 'easy')).to.equal(false);
        });

        it("semantic actions", function() {
          var value = m.synthesizedAttribute({
            easy: function(expr) { return ['easy', value(expr)]; },
            foo:  function(expr) { return ['foo', value(expr)]; },
            _terminal: ohm.actions.getValue
          });
          expect(value(m.matchContents('foo', 'easy'))).to.eql(['easy', ['foo', 'foo']]);
        });
      });

      describe("simple left recursion", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  number = numberRec | digit",
            "  numberRec = number digit",
            "}"]);
        });

        it("recognition", function() {
          expect(m.matchContents('', 'number')).to.equal(false);
          expect(m.matchContents('a', 'number')).to.equal(false);
          expect(m.matchContents('1', 'number')).to.be.ok();
          expect(m.matchContents('123', 'number')).to.be.ok();
          expect(m.matchContents('7276218173', 'number')).to.be.ok();
        });

        it("semantic actions", function() {
          var f = m.matchContents('1234', 'number');
          var eval = m.synthesizedAttribute({
            number:    ohm.actions.passThrough,
            numberRec: function(n, d) { return eval(n) * 10 + eval(d); },
            digit:     function(expr) { return eval(expr).charCodeAt(0) - '0'.charCodeAt(0); },
            _terminal: ohm.actions.getValue
          });
          expect(eval(f)).to.equal(1234);
          var parseTree = m.synthesizedAttribute({
            number:    function(expr) { return ['number', parseTree(expr)]; },
            numberRec: function(n, d) { return ['numberRec', parseTree(n), parseTree(d)]; },
            digit:     ohm.actions.passThrough,
            _terminal: ohm.actions.getValue
          });
          expect(parseTree(f)).to.eql(
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
      });

      describe("simple left recursion, with non-involved rules", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            'M {',
            '  add = addRec | pri',
            '  addRec = add "+" pri',
            '  pri = priX | priY',
            '  priX = "x"',
            '  priY = "y"',
            '}']);
        });

        it("recognition", function() {
          expect(m.matchContents('x+y+x', 'add')).to.be.ok();
        });

        it("semantic actions", function() {
          var v = m.synthesizedAttribute({
            add:       ohm.actions.passThrough,
            addRec:    function(x, _, y) { return [v(x), '+', v(y)]; },
            pri:       ohm.actions.passThrough,
            priX:      ohm.actions.passThrough,
            priY:      ohm.actions.passThrough,
            _terminal: ohm.actions.getValue
          });
          expect(v(m.matchContents('x+y+x', 'add'))).to.eql([['x', '+', 'y'], '+', 'x']);
        });
      });

      describe("indirect left recursion", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  number = foo | digit",
            "  foo = bar",
            "  bar = baz",
            "  baz = qux",
            "  qux = quux",
            "  quux = numberRec",
            "  numberRec = number digit",
            "}"]);
        });

        it("recognition", function() {
          expect(m.matchContents('', 'number')).to.equal(false);
          expect(m.matchContents('a', 'number')).to.equal(false);
          expect(m.matchContents('1', 'number')).to.be.ok();
          expect(m.matchContents('123', 'number')).to.be.ok();
          expect(m.matchContents('7276218173', 'number')).to.be.ok();
        });

        it("semantic actions", function() {
          var v = m.synthesizedAttribute({
            number: ohm.actions.passThrough,
            foo: ohm.actions.passThrough,
            bar: ohm.actions.passThrough,
            baz: ohm.actions.passThrough,
            qux: ohm.actions.passThrough,
            quux: ohm.actions.passThrough,
            numberRec: function(n, d) { return [v(n), v(d)]; },
            digit: ohm.actions.passThrough,
            _terminal: ohm.actions.getValue
          });
          expect(v(m.matchContents('1234', 'number'))).to.eql([[['1', '2'], '3'], '4']);
        });
      });

      describe("nested left recursion", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            'M {',
            '  addExpr = addExprRec | mulExpr',
            '  addExprRec = addExpr "+" mulExpr',
            '  mulExpr = mulExprRec | priExpr',
            '  mulExprRec = mulExpr "*" priExpr',
            '  priExpr = /[0-9]/',
            '  sss = &addExpr addExpr',
            '}']);
        });

        it("recognition", function() {
          expect(m.matchContents('1', 'addExpr')).to.be.ok();
          expect(m.matchContents('2+3', 'addExpr')).to.be.ok();
          expect(m.matchContents('4+', 'addExpr')).to.equal(false);
          expect(m.matchContents('5*6', 'addExpr')).to.be.ok();
          expect(m.matchContents('7*8+9+0', 'addExpr')).to.be.ok();
        });

        it("semantic actions", function() {
          var f = m.matchContents('1*2+3+4*5', 'addExpr');
          var parseTree = m.synthesizedAttribute({
            addExpr:    function(expr)    { return ['addExpr', parseTree(expr)]; },
            addExprRec: function(x, _, y) { return ['addExprRec', parseTree(x), parseTree(y)]; },
            mulExpr:    function(expr)    { return ['mulExpr', parseTree(expr)]; },
            mulExprRec: function(x, _, y) { return ['mulExprRec', parseTree(x), parseTree(y)] },
            priExpr:    ohm.actions.passThrough,
            _terminal:  ohm.actions.getValue
          });
          expect(parseTree(f)).to.eql(
            ['addExpr',
              ['addExprRec',
                ['addExpr',
                  ['addExprRec',
                    ['addExpr', ['mulExpr', ['mulExprRec', ['mulExpr', '1'], '2']]],
                    ['mulExpr', '3']]],
                ['mulExpr', ['mulExprRec', ['mulExpr', '4'], '5']]]]);
          var eval = m.synthesizedAttribute({
            addExpr:    function(expr)    { return eval(expr); },
            addExprRec: function(x, _, y) { return eval(x) + eval(y); },
            mulExpr:    function(expr)    { return eval(expr); },
            mulExprRec: function(x, _, y) { return eval(x) * eval(y); },
            priExpr:    function(expr)    { return parseInt(eval(expr)); },
            _terminal:  ohm.actions.getValue
          });
          expect(eval(f)).to.equal(25);
          var pretty = m.synthesizedAttribute({
            addExpr:    ohm.actions.passThrough,
            addExprRec: function(x, _, y) { return '(' + pretty(x) + '+' + pretty(y) + ')'; },
            mulExpr:    ohm.actions.passThrough,
            mulExprRec: function(x, _, y) { return '(' + pretty(x) + '*' + pretty(y) + ')'; },
            priExpr:    ohm.actions.passThrough,
            _terminal:  ohm.actions.getValue
          });
          expect(pretty(f)).to.equal('(((1*2)+3)+(4*5))');
        });

        it("semantic actions are evaluated lazily", function() {
          var f = m.matchContents('1*2+3+4*5', 'sss');
          var a = buildTreeNodeWithUniqueId(m);
          var t = 
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
          expect(a(f)).to.eql(['id', 0, 'sss', t, t]);
          expect(a._getNextId()).to.equal(18);
        });
      });

      describe("nested and indirect left recursion", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
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
            '}']);
        });

        it("recognition", function() {
          expect(m.matchContents('1', 'addExpr')).to.be.ok();
          expect(m.matchContents('2+3', 'addExpr')).to.be.ok();
          expect(m.matchContents('4+', 'addExpr')).to.equal(false);
          expect(m.matchContents('5*6', 'addExpr')).to.be.ok();
          expect(m.matchContents('7+8*9+0', 'addExpr')).to.be.ok();
        });

        it("semantic actions", function() {
          var buildTree = m.synthesizedAttribute({
            addExprRec: function(x, _, y) { return [buildTree(x), '+', buildTree(y)]; },
            mulExprRec: function(x, _, y) { return [buildTree(x), '*', buildTree(y)]; },
            _terminal:  ohm.actions.getValue,
            _default:   ohm.actions.passThrough
          });
          expect(buildTree(m.matchContents('7+8*9+0', 'addExpr'))).to.eql([['7', '+', ['8', '*', '9']], '+', '0']);
        });
      });

      describe("tricky left recursion (different heads at same position)", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            "G {",
            "  tricky = &foo bar",
            "  foo = fooRec | digit",
            "  fooRec = bar digit",
            "  bar = barRec | digit",
            "  barRec = foo digit",
            "}"]);
        });

        it("recognition", function() {
          expect(m.matchContents('1234', 'tricky')).to.be.ok();
        });

        it("semantic actions", function() {
          var f = m.matchContents('1234', 'tricky');
          // TODO: perhaps just use JSON.stringify(f) here, and compare the result?
          var buildTree = m.synthesizedAttribute({
            tricky:    function(_, x) { return ['tricky', buildTree(x)]; },
            foo:       function(expr) { return ['foo', buildTree(expr)]; },
            fooRec:    function(x, y) { return ['fooRec', buildTree(x), buildTree(y)]; },
            bar:       function(expr) { return ['bar', buildTree(expr)]; },
            barRec:    function(x, y) { return ['barRec', buildTree(x), buildTree(y)]; },
            digit:     ohm.actions.passThrough,
            _terminal: ohm.actions.getValue
          });
          expect(buildTree(f)).to.eql(
            ['tricky', ['bar', ['barRec', ['foo', ['fooRec', ['bar', ['barRec', ['foo', '1'], '2']], '3']], '4']]]);
        });
      });
    });

    describe("inheritance", function() {
      describe("super-grammar does not exist", function() {
        it("in namespace", function() {
          expect(function() {
            makeGrammar("G2 <: G1 {}", 'inheritance-oops');
          }).to.throwException(function(e) {
            expect(e).to.be.a(errors.UndeclaredGrammar);
            expect(e.grammarName).to.equal('G1');
            expect(e.namespaceName).to.equal('inheritance-oops');
          });
        });

        it("default namespace", function() {
          expect(function() {
            makeGrammar("G2 <: G1 {}", "default");
          }).to.throwException(function(e) {
            expect(e).to.be.a(errors.UndeclaredGrammar);
            expect(e.grammarName).to.equal('G1');
            expect(e.namespaceName).to.be("default");
          });
        });
      });

      describe("define", function() {
        it("should check that rule does not already exist in super-grammar", function() {
          expect(function() {
            makeGrammars([
              'G1 { foo = "foo" }',
              'G2 <: G1 { foo = "bar" }'
            ], 'inheritance-define');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.DuplicateRuleDeclaration);
            expect(e.ruleName).to.equal('foo');
            expect(e.offendingGrammarName).to.equal('G2');
            expect(e.declGrammarName).to.equal('G1');
          });
        });
      });

      describe("override", function() {
        var m1;
        var m2;
        beforeEach(function() {
          if (m1 && m2) {
            return;
          } else {
            m1 = makeGrammar("G1 { number = digit+ }", 'inheritance-override');
            m2 = makeGrammar("G2 <: G1 { digit := /[a-z]/ }", 'inheritance-override');
          }
        });

        it("should check that rule exists in super-grammar", function() {
          expect(function() {
            makeGrammar('G3 <: G1 { foo := "foo" }', 'inheritance-override');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.UndeclaredRule);
            expect(e.ruleName).to.equal('foo');
            expect(e.grammarName).to.equal('G1');
          });
        });

        it("shouldn't matter if arities aren't the same", function() {
          // It's OK for the semantic action "API" of a grammar to be different
          // from that of its super-grammar.

          // arity(overriding rule) > arity(overridden rule)
          makeGrammar('M1 { foo = "foo" }', "inheritance-override");
          makeGrammar('M2 <: M1 { foo := "foo" "bar" }', "inheritance-override");

          // arity(overriding rule) < arity(overridden rule)
          makeGrammar("M3 { foo = digit digit }", 'inheritance-override');
          makeGrammar("M4 <: M3 { foo := digit }", 'inheritance-override');
        });

        it("recognition", function() {
          expect(m1.matchContents('1234', 'number')).to.be.ok();
          expect(m1.matchContents('hello', 'number')).to.equal(false);
          expect(m1.matchContents('h3llo', 'number')).to.equal(false);

          expect(m2.matchContents('1234', 'number')).to.equal(false);
          expect(m2.matchContents('hello', 'number')).to.be.ok();
          expect(m2.matchContents('h3llo', 'number')).to.equal(false);
        });

        it("semantic actions", function() {
          var v = m2.synthesizedAttribute({
            number:    function(expr) { return ['number', v(expr)]; },
            digit:     function(expr) { return ['digit', v(expr)]; },
            _many:     ohm.actions.makeArray,
            _terminal: ohm.actions.getValue
          });
          var expected = ['number', [['digit', 'a'], ['digit', 'b'], ['digit', 'c'], ['digit', 'd']]];
          expect(v(m2.matchContents('abcd', 'number'))).to.eql(expected);
        });
      });

      describe("extend", function() {
        var m1;
        var m2;
        beforeEach(function() {
          if (m1 && m2) {
            return;
          } else {
            m1 = makeGrammar('G1 { foo = "aaa" "bbb" }', 'inheritanceExtend');
            m2 = makeGrammar('G2 <: inheritanceExtend.G1 { foo += "111" "222" }', 'inheritanceExtend2');
          }
        });

        it("should check that rule exists in super-grammar", function() {
          expect(function() {
            makeGrammar('G3 <: G1 { bar += "bar" }', 'inheritanceExtend');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.UndeclaredRule);
            expect(e.ruleName).to.equal('bar');
            expect(e.grammarName).to.equal('G1');
          });
        });

        it("should make sure rule arities are compatible", function() {
          // An extending rule must produce the same number of values
          // as the underlying rule. This is to ensure the semantic
          // action "API" doesn't change.

          // Too many:
          makeGrammar('M1 { foo = "foo"  bar = "bar"  baz = "baz" }', "inheritanceExtend3");
          expect(function() {
            makeGrammar("M2 <: M1 { foo += bar baz }", "inheritanceExtend3");
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.InconsistentArity);
            expect(e.ruleName).to.equal('foo');
            expect(e.expected).to.equal(1);
            expect(e.actual).to.equal(2);
          });

          // Too few:
          makeGrammar("M3 { foo = digit digit }", 'inheritanceExtend3');
          expect(function() {
            makeGrammar("M4 <: M3 { foo += digit }", 'inheritanceExtend3');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.InconsistentArity);
            expect(e.ruleName).to.equal('foo');
            expect(e.expected).to.equal(2);
            expect(e.actual).to.equal(1);
          });
        });

        it("recognition", function() {
          expect(m1.matchContents('aaabbb', 'foo')).to.be.ok();
          expect(m1.matchContents('111222', 'foo')).to.equal(false);

          expect(m2.matchContents('aaabbb', 'foo')).to.be.ok();
          expect(m2.matchContents('111222', 'foo')).to.be.ok();
        });

        it("semantic actions", function() {
          expect(m2.synthesizedAttribute({
            foo: function(x, y) { return [x.value(), y.value()]; }
          })(m2.matchContents('aaabbb', 'foo'))).to.eql(['aaa', 'bbb']);
          expect(m2.synthesizedAttribute({
            foo: function(x, y) { return [x.value(), y.value()]; }
          })(m2.matchContents('111222', 'foo'))).to.eql(['111', '222']);
        });
      });
    });

    describe("bindings", function() {
      it("inconsistent arity in alts is an error", function() {
        expect(function() {
          makeGrammar('G { foo = "a" "c" | "b" }');
        }).to.throwException(function(e) {
          expect(e).to.be.a(errors.InconsistentArity);
          expect(e.ruleName).to.equal('foo');
          expect(e.expected).to.eql(2);
          expect(e.actual).to.eql(1);
        });
      });

      it("by default, bindings are evaluated lazily", function() {
        var g = makeGrammar([
          'G {',
          '  foo = bar baz',
          '  bar = "a"',
          '  baz = "b"',
          '}']);

        var id = 0;
        var v = g.synthesizedAttribute({
          foo:       function(x, y) { var xv = v(x); var yv = v(y); return {x: xv, y: yv}; },
          bar:       function(expr) { return ['bar', v(expr), id++]; },
          baz:       function(expr) { return ['baz', v(expr), id++]; },
          _terminal: ohm.actions.getValue
        });
        expect(v(g.matchContents('ab', 'foo'))).to.eql({x: ['bar', 'a', 0], y: ['baz', 'b', 1]});

        id = 0;
        v = g.synthesizedAttribute({
          foo: function(x, y) { var yv = v(y); var xv = v(x); return {x: xv, y: yv}; },
          bar: function(expr) { return ['bar', v(expr), id++]; },
          baz: function(expr) { return ['baz', v(expr), id++]; },
          _terminal: ohm.actions.getValue
        });
        expect(v(g.matchContents('ab', 'foo'))).to.eql({x: ['bar', 'a', 1], y: ['baz', 'b', 0]});
      });
    });

    describe("inline rule declarations", function() {
      function makeEval(g) {
        var eval = g.synthesizedAttribute({
          addExpr_plus:   function(x, op, y) { return eval(x) + eval(y); },
          addExpr_minus:  function(x, op, y) { return eval(x) - eval(y); },
          mulExpr_times:  function(x, op, y) { return eval(x) * eval(y); },
          mulExpr_divide: function(x, op, y) { return eval(x) / eval(y); },
          priExpr_paren:  function(oparen, e, cparen) { return eval(e); },
          number_rec:     function(n, d) { return eval(n) * 10 + eval(d); },
          digit:          function(expr) { return eval(expr).charCodeAt(0) - '0'.charCodeAt(0); },
          _default:       ohm.actions.passThrough,
          _terminal:      ohm.actions.getValue
        });
        return eval;
      }

      var m;
      beforeEach(function() {
        m = makeGrammar(arithmeticGrammarSource);
      });

      it("recognition", function() {
        expect(m.matchContents('1*(2+3)-4/5', 'expr')).to.be.ok();
      });

      it("semantic actions", function() {
        expect(makeEval(m)(m.matchContents('10*(2+123)-4/5', 'expr'))).to.equal(1249.2);
      });

      it("overriding", function() {
        var m2 = makeGrammar(['Good <: Expr {',
                              '  addExpr := addExpr "~" mulExpr  -- minus',
                              '           | mulExpr',
                              '}'],
                             m.namespaceName);
        expect(makeEval(m2)(m2.matchContents('2*3~4', 'expr'))).to.equal(2);

        expect(function() {
          makeGrammar('Bad <: Expr { addExpr += addExpr "~" mulExpr  -- minus }', m.namespaceName);
        }).to.throwException(function(e) {
          expect(e).to.be.an(errors.DuplicateRuleDeclaration);
          expect(e.ruleName).to.equal('addExpr_minus');
          expect(e.offendingGrammarName).to.equal('Bad');
          expect(e.declGrammarName).to.equal('Expr');
        });
      });
    });

    describe("lexical vs. syntactic rules", function() {
      it("lexical rules don't skip spaces implicitly", function() {
        var g = makeGrammar('G { start = "foo" "bar" }');
        expect(g.matchContents('foobar', 'start')).to.be.ok();
        expect(g.matchContents('foo bar', 'start')).to.equal(false);
        expect(g.matchContents(' foo bar   ', 'start')).to.equal(false);
      });

      it("syntactic rules skip spaces implicitly", function() {
        var g = makeGrammar('G { Start = "foo" "bar" }');
        expect(g.matchContents('foobar', 'Start')).to.be.ok();
        expect(g.matchContents('foo bar', 'Start')).to.be.ok();
        expect(g.matchContents(' foo bar   ', 'Start')).to.be.ok();
      });

      it("mixing lexical and syntactic rules works as expected", function() {
        var g = makeGrammar([
          'G {',
          '  foo = "foo"',
          '  bar = "bar"',
          '  Start = foo bar',
          '}']);
        expect(g.matchContents('foobar', 'Start')).to.be.ok();
        expect(g.matchContents('foo bar', 'Start')).to.be.ok();
        expect(g.matchContents(' foo bar   ', 'Start')).to.be.ok();
      });
    });

    describe("semantic action templates", function() {
      var g1;
      var g2;
      beforeEach(function() {
        if (g1 && g2) {
          return;
        } else {
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
          g1 = ohm.namespace('semantic-action-templates').grammar('G1');
          g2 = ohm.namespace('semantic-action-templates').grammar('G2');
        }
      });

      it("rules that need semantic action", function() {
        expect(g1.rulesThatNeedSemanticAction([])).to.eql({});
        expect(g1.rulesThatNeedSemanticAction(['foo'])).to.eql(
          {foo: true, bar: true, baz: true, qux: true, quux: true}
        );
        expect(g1.rulesThatNeedSemanticAction(['aaa'])).to.eql({aaa: true});
        expect(g1.rulesThatNeedSemanticAction(['bbb'])).to.eql({bbb: true, bbb_blah: true, qux: true, quux: true});
        expect(g1.rulesThatNeedSemanticAction(['aaa', 'bbb'])).to.eql(
          {aaa: true, bbb: true, bbb_blah: true, qux: true, quux: true}
        );

        expect(g2.rulesThatNeedSemanticAction([])).to.eql({});
        expect(g2.rulesThatNeedSemanticAction(['foo'])).to.eql(
          {foo: true, bar: true, baz: true, qux: true}
        );
        expect(g2.rulesThatNeedSemanticAction(['aaa'])).to.eql({aaa: true});
        expect(g2.rulesThatNeedSemanticAction(['bbb'])).to.eql({bbb: true, bbb_blah: true, qux: true});
        expect(g2.rulesThatNeedSemanticAction(['aaa', 'bbb'])).to.eql(
          {aaa: true, bbb: true, bbb_blah: true, qux: true}
        );
      });
    });

    describe("namespaces", function() {
      describe("install", function() {
        var ns1;
        var ns2;
        beforeEach(function() {
           ns1 = ohm.namespace(freshNamespaceName());
           ns2 = ohm.namespace(freshNamespaceName());
        });

        it("actually installs a grammar in a namespace", function() {
          var m = makeGrammar('aaa { foo = "foo" }', ns1.name);
          expect(ns1.grammar('aaa')).to.eql(m);
          expect(m.matchContents('foo', 'foo')).to.be.ok();
        });

        it("detects duplicates", function() {
          expect(function() {
            makeGrammar('ccc { foo = "foo" }', ns1.name);
            makeGrammar('ccc { bar = "bar" }', ns1.name);
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.DuplicateGrammarDeclaration);
            expect(e.grammarName).to.equal('ccc');
            expect(e.namespaceName).to.equal(ns1.name);
          });
        });

        it("allows same-name grammars to be installed in different namespaces", function() {
          var m1 = makeGrammar('bbb { foo = "foo" }', ns1.name);
          var m2 = makeGrammar('bbb { bar = "bar" }', ns2.name);

          expect(ns1.grammar('bbb')).to.eql(m1);
          expect(ns2.grammar('bbb')).to.eql(m2);
          expect(m1 !== m2).to.be.ok();
        });
      });
    });

    describe("script tag support", function() {
      describe("loadGrammarsFromScriptElement", function() {
        var scriptTag;
        beforeEach(function() {
          scriptTag = {
            type: 'text/ohm-js',
            innerHTML: [
              "O {",
              "  number = number digit  -- rec",
              "         | digit",
              "}"
            ].join('\n'),
            getAttribute: function(name) {
              return undefined;
            }
          };
        });

        it("recognition", function() {
          var ns = ohm.namespace('aaa1');
          ns.loadGrammarsFromScriptElement(scriptTag);
          expect(function() {
            ns.grammar('M');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.UndeclaredGrammar);
            expect(e.grammarName).to.equal('M');
            expect(e.namespaceName).to.equal('aaa1');
          });
          expect(ns.grammar('O')).to.be.ok();
          expect(ns.grammar('O').matchContents('1234', 'number')).to.be.ok();
        });

        it("semantic actions", function() {
          var ns = ohm.namespace('aaa2');
          ns.loadGrammarsFromScriptElement(scriptTag);
          var m = ns.grammar('O');
          expect(m).to.be.ok();
          var eval = m.synthesizedAttribute({
            number:     function(expr) { return eval(expr); },
            number_rec: function(n, d) { return eval(n) * 10 + eval(d); },
            digit:      function(expr) { return eval(expr).charCodeAt(0) - '0'.charCodeAt(0); },
            _terminal:  ohm.actions.getValue
          });
          expect(eval(m.matchContents('1234', 'number'))).to.equal(1234);
        });
      });
    });

    describe("throw on fail", function() {
      it("match", function() {
        var g = makeGrammar('G { start = 5 }');
        expect(function() {
          g.match(42, 'start', true);
        }).to.throwException(function(e) {
          expect(e.message).to.equal('match failed at position 0');
          expect(e.getPos()).to.equal(0);
        });
      });

      it("matchContents", function() {
        var g = makeGrammar('G { start = "a" "b" "c" "d" }');
        expect(function() {
          g.matchContents('ab', 'start', true);
        }).to.throwException(function(e) {
          expect(e.message).to.equal("Line 1, col 3: ab\n" +
                                     "                 ^\n" +
                                     "Expected 'c'");
          expect(e.getPos()).to.equal(2);
        });
        expect(function() {
          g.matchContents('abcde', 'start', true);
        }).to.throwException(function(e) {
          expect(e.message).to.equal("Line 1, col 5: abcde\n" +
                                     "                   ^\n" +
                                     "Expected end of input");
          expect(e.getPos()).to.equal(4);
        });
      });
    });

    describe("bootstrap", function() {
      var g;
      beforeEach(function() {
        g = g || makeGrammar(ohmGrammarSource, 'bootstrap');
      });

      it("can recognize arithmetic grammar", function() {
        expect(g.matchContents(arithmeticGrammarSource, 'Grammar')).to.be.ok();
      });

      it("can recognize itself", function() {
        expect(g.matchContents(ohmGrammarSource, 'Grammar')).to.be.ok();
      });

      it("can produce a grammar that will recognize itself", function() {
        var gPrime = ohm._makeGrammarBuilder(freshNamespaceName())(g.matchContents(ohmGrammarSource, 'Grammar'));
        expect(gPrime.matchContents(ohmGrammarSource, 'Grammar')).to.be.ok();
      });

      it("can produce a grammar that works", function() {
        var gPrime = ohm._makeGrammarBuilder(freshNamespaceName())(g.matchContents(ohmGrammarSource, 'Grammar'));
        var a = ohm._makeGrammarBuilder(freshNamespaceName())(gPrime.matchContents(arithmeticGrammarSource, 'Grammar'));
        var eval = a.synthesizedAttribute({
          expr:           function(expr) { return eval(expr); },
          addExpr:        function(expr) { return eval(expr); },
          addExpr_plus:   function(x, op, y) { return eval(x) + eval(y); },
          addExpr_minus:  function(x, op, y) { return eval(x) - eval(y); },
          mulExpr:        function(expr) { return eval(expr); },
          mulExpr_times:  function(x, op, y) { return eval(x) * eval(y); },
          mulExpr_divide: function(x, op, y) { return eval(x) / eval(y); },
          priExpr:        function(expr) { return eval(expr); },
          priExpr_paren:  function(oparen, e, cparen) { return eval(e); },
          number:         function(expr) { return eval(expr); },
          number_rec:     function(n, d) { return eval(n) * 10 + eval(d); },
          digit:          function(expr) { return eval(expr).charCodeAt(0) - '0'.charCodeAt(0); },
          _terminal:      ohm.actions.getValue
        });
        expect(eval(a.matchContents('10*(2+123)-4/5', 'expr'))).to.equal(1249.2);
      });

      it("full bootstrap!", function() {
        var gPrime = ohm._makeGrammarBuilder(freshNamespaceName())(g.matchContents(ohmGrammarSource, 'Grammar'));
        var gPrimePrime = ohm._makeGrammarBuilder(freshNamespaceName())(gPrime.matchContents(ohmGrammarSource, 'Grammar'));
        gPrimePrime.namespaceName = gPrime.namespaceName;  // make their namespaceName properties the same
        compareGrammars(gPrime, gPrimePrime);
      });

      it("inherited attributes", function() {
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
          abcs$1: function(ab, cs) {
            depth.set(depth(this) + 1);
          },
          abcs$2: function(ab, cs) {
            depth.set(depth(this) + 1);
          },
          abcs$3: function(ab, cs) {
            depth.set(depth(this) + 1);
          },
          abcs$3$each: function(c) {
            depth.set(depth(this) + 1);
          },
          b$1: function(b) {
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
        var cst = g.matchContents('abccc', 'abcs');
        print(cst);
      });
    });

    describe("definitionInterval", function() {
      var g = makeGrammar([
          'G {',
          '  foo = bar',
          '  bar = "a" | "b" -- baz',
          '}'], "ns");
      function definitionLoc(grammar, ruleName) {
        var interval = grammar.ruleDict[ruleName].definitionInterval;
        return [interval.startIdx, interval.endIdx];
      }
      it("works for regular rules", function() {
        expect(definitionLoc(g, "foo")).to.eql([6, 15]);
        expect(definitionLoc(g, "bar")).to.eql([18, 40]);
      });
      it("works for inline rules", function() {
        expect(definitionLoc(g, "bar_baz")).to.eql([30, 40]);
      });

      var g2 = makeGrammar([
          'G2 <: G {',
          '  foo += bar',
          '  bar := "a" | "b" -- baz',
          '}'], "ns");
      it("works when overriding and extending rules", function() {
        expect(definitionLoc(g2, "foo")).to.eql([12, 22]);
        expect(definitionLoc(g2, "bar")).to.eql([25, 48]);
        expect(definitionLoc(g2, "bar_baz")).to.eql([38, 48]);
      });
    });

    describe("rule invocation interval", function() {
      var g = makeGrammar([
          'G {',
          '  foo = bar',
          '  beep = letter bar',
          '  bar = "a" | "blah" | /[a-z]/ -- baz',
          '}']);
      function fromLoc(pexpr) {
        return [pexpr.interval.startIdx, pexpr.interval.endIdx];
      }
      var fooBody = g.ruleDict["foo"];
      var beepBody = g.ruleDict["beep"];
      var barBody = g.ruleDict["bar"];
      it("works for regular rule applications", function() {
        expect(fromLoc(fooBody)).to.eql([12, 15]);
        expect(fromLoc(beepBody.factors[1])).to.eql([32, 35]);
      });
      it("works for applications of built-in rules", function() {
        expect(fromLoc(beepBody.factors[0])).to.eql([25, 31]);
      });
      it("works for primitives", function() {
        expect(fromLoc(barBody.terms[0])).to.eql([44, 47]);
        expect(fromLoc(barBody.terms[1])).to.eql([50, 56]);

        var barBazBody = g.ruleDict["bar_baz"];
        expect(fromLoc(barBazBody)).to.eql([59, 66]);
      });
      it("is undefined for other types of pexpr", function() {
        expect(beepBody.fromInterval).to.be(undefined);
        expect(barBody.fromInterval).to.be(undefined);
      });
    });
  });
});
