var expect = require('expect.js');
var fs = require('fs');
var ohm = require('../src/main.js');
var errors = require('../src/errors.js');
var Interval = require('../src/Interval.js');

function makeGrammar(source, optNamespaceName) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammar(source, optNamespaceName ? ohm.namespace(optNamespaceName) : undefined);
}

function makeGrammars(source, optNamespaceName) {
  if (source instanceof Array) {
    source = source.join('\n');
  }
  return ohm.makeGrammars(source, optNamespaceName ? ohm.namespace(optNamespaceName) : undefined);
}

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();
var ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString();

describe("Ohm", function() {
  describe("unit tests", function() {

    function buildTreeNodeWithUniqueId() {
      var nextId = 0;
      return {
        _default: function(ruleName, args) {
          return ['id', nextId++, ruleName].concat(args.map(function(arg) { return arg.value; }));
        },
        _getNextId: function() {
          return nextId;
        }
      };
    }

    describe("helper stuff", function() {
      describe("intervals", function() {
        describe("collapsing", function() {
          it("left", function() {
            var interval = new Interval('hello world', 0, 5);
            var collapsed = interval.collapsedLeft();

            // Original interval shouldn't change
            expect(interval.startIdx).to.equal(0);
            expect(interval.endIdx).to.equal(5);
            expect(interval.source).to.equal('hello world');
            expect(interval.contents).to.equal('hello');

            expect(collapsed.startIdx).to.equal(0);
            expect(collapsed.endIdx).to.equal(0);
            expect(collapsed.source).to.equal('hello world');
            expect(collapsed.contents).to.equal('');
          });

          it("right", function() {
            var interval = new Interval('hello world', 0, 5);
            var collapsed = interval.collapsedRight();

            // Original interval shouldn't change
            expect(interval.startIdx).to.equal(0);
            expect(interval.endIdx).to.equal(5);
            expect(interval.source).to.equal('hello world');
            expect(collapsed.contents).to.equal('');

            expect(collapsed.startIdx).to.equal(5);
            expect(collapsed.endIdx).to.equal(5);
            expect(collapsed.source).to.equal('hello world');
            expect(collapsed.contents).to.equal('');
          });
        });

        describe("coverage", function() {
          it("one interval", function() {
            var interval = new Interval('hello world', 0, 5);
            var ans = Interval.coverage(interval);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("two adjacent intervals", function() {
            var interval1 = new Interval('hello world', 2, 5);
            var interval2 = new Interval('hello world', 0, 2);
            var ans = Interval.coverage(interval1, interval2);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("two non-adjacent intervals", function() {
            var interval1 = new Interval('hello world', 0, 2);
            var interval2 = new Interval('hello world', 4, 5);
            var ans = Interval.coverage(interval1, interval2);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("nested intervals", function() {
            var interval1 = new Interval('hello world', 0, 5);
            var interval2 = new Interval('hello world', 3, 4);
            var ans = Interval.coverage(interval1, interval2);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(5);
            expect(ans.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello');
          });

          it("more intervals", function() {
            var interval1 = new Interval('hello world', 0, 2);
            var interval2 = new Interval('hello world', 3, 4);
            var interval3 = new Interval('hello world', 6, 10);
            var ans = Interval.coverage(interval1, interval2, interval3);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(10);
            expect(ans.source).to.equal('hello world');
            expect(ans.contents).to.equal('hello worl');
          });

          it("brotha from anotha motha", function() {
            var interval1 = new Interval('abc', 0, 3);
            var interval2 = new Interval('xyz', 1, 2);
            expect(function() { Interval.coverage(interval1, interval2); }).to.throwException(function(e) {
              expect(e).to.be.a(errors.IntervalSourcesDontMatch);
            });
          });

          it("coverageWith (same method as above but as a method of an interval)", function() {
            var interval1 = new Interval('hello world', 0, 2);
            var interval2 = new Interval('hello world', 3, 4);
            var interval3 = new Interval('hello world', 6, 10);
            var ans = interval1.coverageWith(interval2, interval3);

            expect(ans.startIdx).to.equal(0);
            expect(ans.endIdx).to.equal(10);
            expect(ans.source).to.equal('hello world');
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

        it("to recipe and back", function() {
          expect(ohm.make(eval(m.toRecipe()))).to.eql(m);
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(5, '_')).to.be.ok();
            expect(m.match(null, '_')).to.be.ok();
          });

          it("semantic actions", function() {
            expect(m.match(5, '_')({_: function(expr) { return expr.value; }})).to.equal(5);
            expect(m.match(null, '_')({_: function(expr) { return expr.value; }})).to.equal(null);
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('5', '_')).to.be.ok();
            expect(m.matchContents('', '_')).to.equal(false);
          });

          it("semantic actions", function() {
            expect(m.matchContents('5', '_')({_: function(expr) { return expr.value; }})).to.equal('5');
          });
        });

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['123'], '_')).to.be.ok();
            expect(m.matchContents(['123', 4], '_')).to.equal(false);
            expect(m.matchContents([], '_')).to.equal(false);
          });

          it("semantic actions", function() {
            expect(m.matchContents(['123'], '_')({_: function(expr) { return expr.value; }})).to.equal('123');
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

        it("to recipe and back", function() {
          expect(ohm.make(eval(m.toRecipe()))).to.eql(m);
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
            expect(m.match(5, 'five')({five: function(expr) { return expr.value; }})).to.equal(5);
            expect(m.match(true, '_true')({_true: function(expr) { return expr.value; }})).to.equal(true);
            expect(m.match(false, '_false')({_false: function(expr) { return expr.value; }})).to.equal(false);
            expect(m.match(null, '_null')({_null: function(expr) { return expr.value; }})).to.equal(null);
            expect(m.match(undefined, '_undefined')({
              _undefined: function(expr) { return expr.value; }
            })).to.equal(undefined);
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
            var thunk = m.matchContents([5], 'five');
            expect(thunk({five: function(expr) { return expr.value; }})).to.equal(5);
          });
        });
      });

      describe("char", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar("M { bang = '!' }");
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match('!', 'bang')).to.be.ok();
            expect(m.match('!a', 'bang')).to.equal(false);
            expect(m.match(5, 'bang')).to.equal(false);
            expect(m.match('', 'bang')).to.equal(false);
          });

          it("semantic actions", function() {
            var thunk = m.match('!', 'bang');
            expect(thunk({bang: function(expr) { return expr.value; }})).to.equal('!');
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('!', 'bang')).to.be.ok();
            expect(m.matchContents('a', 'bang')).to.equal(false);
            expect(m.matchContents('', 'bang')).to.equal(false);
          });

          it("semantic actions", function() {
            var thunk = m.matchContents('!', 'bang');
            expect(thunk({bang: function(expr) { return expr.value; }})).to.equal('!');
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
            var thunk = m.matchContents(['!'], 'bang');
            expect(thunk({bang: function(expr) { return expr.value; }})).to.equal('!');
          });
        });
      });

      describe("string", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar("M { foo = 'foo' }");
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match('foo', 'foo')).to.be.ok();
            expect(m.match('foo1', 'foo')).to.equal(false);
            expect(m.match('bar', 'foo')).to.equal(false);
            expect(m.match(null, 'foo')).to.equal(false);
          });

          it("semantic actions", function() {
            var thunk = m.match('foo', 'foo');
            expect(thunk({foo: function(expr) { return expr.value; }})).to.equal('foo');
          });
        });

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('foo', 'foo')).to.be.ok();
            expect(m.matchContents('foo1', 'foo')).to.equal(false);
            expect(m.matchContents('bar', 'foo')).to.equal(false);
          });

          it("semantic actions", function() {
            var thunk = m.matchContents('foo', 'foo');
            expect(thunk({foo: function(expr) { return expr.value; }})).to.equal('foo');
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
            var thunk = m.matchContents(['foo'], 'foo');
            expect(thunk({foo: function(expr) { return expr.value; }})).to.equal('foo');
          });
        });
      });

      describe("regexp", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar('M { myDigit = /[0-9]/ myLetter = /\\p{L}/ myLF = /\\p{LF}/ }');
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(/[0-9]/, 'myDigit')).to.equal(false);
            expect(m.match('4', 'myDigit')).to.equal(false);
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
            var thunk = m.matchContents('4', 'myDigit');
            expect(thunk({myDigit: function(expr) { return expr.value; }})).to.equal('4');
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
            var thunk = m.matchContents('a', 'myLetter');
            expect(thunk({myLetter: function(expr) { return expr.value; }})).to.equal('a');
          });
        });
      });
    });

    describe("alt", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar("M { altTest = 'a' | 'b' }");
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents('', 'altTest')).to.equal(false);
        expect(m.matchContents('a', 'altTest')).to.be.ok();
        expect(m.matchContents('b', 'altTest')).to.be.ok();
        expect(m.matchContents('ab', 'altTest')).to.equal(false);
      });

      it("semantic actions", function() {
        expect(m.matchContents('a', 'altTest')({altTest: function(expr) { return expr.value }})).to.equal('a');
        expect(m.matchContents('b', 'altTest')({altTest: function(expr) { return expr.value }})).to.equal('b');
      });
    });

    describe("seq", function() {
      it("to recipe and back", function() {
        var m = makeGrammar("M { start = 'a' 'bc' 'z' }");
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      describe("without bindings", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar("M { start = 'a' 'bc' 'z' }");
        });
  
        it("recognition", function() {
          expect(m.matchContents('a', 'start')).to.equal(false);
          expect(m.matchContents('bc', 'start')).to.equal(false);
          expect(m.matchContents('abcz', 'start')).to.be.ok();
          expect(m.matchContents('abbz', 'start')).to.equal(false);
        });

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start');
          expect(f({
            start: function(x, y, z) { return [x.interval.contents, y.interval.contents, z.interval.contents]; }
          })).to.eql(['a', 'bc', 'z']);
        });
      });

      describe("with exactly one binding", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar("M { start = 'a' 'bc' 'z' }");
        });
  
        it("recognition", function() {
          expect(m.matchContents('a', 'start')).to.equal(false);
          expect(m.matchContents('bc', 'start')).to.equal(false);
          expect(m.matchContents('abcz', 'start')).to.be.ok();
          expect(m.matchContents('abbz', 'start')).to.equal(false);
        });

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start');
          expect(f({
            start: function(x, _, _) { return x.value; },
          })).to.eql('a');
        });
      });

      describe("with more than one binding", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar("M { start = 'a' 'bc' 'z' }");
        });
  
        it("recognition", function() {
          expect(m.matchContents('a', 'start')).to.equal(false);
          expect(m.matchContents('bc', 'start')).to.equal(false);
          expect(m.matchContents('abcz', 'start')).to.be.ok();
          expect(m.matchContents('abbz', 'start')).to.equal(false);
        });

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start');
          expect(f({
            start: function(x, _, y) { return [x.value, y.value]; }
          })).to.eql(['a', 'z']);
        });
      });
    });

    describe("alts and seqs together", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar("M { start = 'a' 'b' 'c' | '1' '2' '3' }");
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents('ab', 'start')).to.equal(false);
        expect(m.matchContents('12', 'start')).to.equal(false);
        expect(m.matchContents('abc', 'start')).to.be.ok();
        expect(m.matchContents('123', 'start')).to.be.ok();
      });

      it("semantic actions", function() {
        expect(m.matchContents('abc', 'start')({start: function(x, _, y) { return [x.value, y.value] }}))
          .to.eql(['a', 'c']);
        expect(m.matchContents('123', 'start')({start: function(x, _, y) { return [x.value, y.value] }}))
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

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
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
        var f = m.matchContents('1234', 'number');
        expect(f({
          number: function(expr) { return ['digits', expr.value]; },
          digit:  function(expr) { return ['digit', expr.value]; }
        })).to.eql(['digits', [['digit', '1'], ['digit', '2'], ['digit', '3'], ['digit', '4']]]);
      });

      it("semantic actions are evaluated lazily", function() {
        var f = m.matchContents('123', 'sss');
        var a = buildTreeNodeWithUniqueId();
        var t = ['id', 1, 'number', [[ 'id', 2, 'digit', '1'], ['id', 3, 'digit', '2'], ['id', 4, 'digit', '3']]];
        expect(f(a)).to.eql(['id', 0, 'sss', t, t]);
        expect(a._getNextId()).to.equal(5);
      });
    });

    describe("opt", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar("M { name = 'dr'? 'warth' }");
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents('drwarth', 'name')).to.be.ok();
        expect(m.matchContents('warth', 'name')).to.be.ok();
        expect(m.matchContents('mrwarth', 'name')).to.equal(false);
      });

      it("semantic actions", function() {
        var actionDict = {name: function(title, last) { return [title.value, last.value]; }};
        expect(m.matchContents('drwarth', 'name')(actionDict)).to.eql(['dr', 'warth']);
        expect(m.matchContents('warth', 'name')(actionDict)).to.eql([undefined, 'warth']);
      });
    });

    describe("not", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar("M { start = ~'hello' _* }");
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents('yello world', 'start')).to.be.ok();
        expect(m.matchContents('hello world', 'start')).to.equal(false);
      });

      it("semantic actions", function() {
        expect(m.matchContents('yello world', 'start')({
          start: function(x) { return x.interval.contents; }
        })).to.equal('yello world');
      });
    });

    describe("lookahead", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar("M { start = &'hello' _* }");
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents('hello world', 'start')).to.be.ok();
        expect(m.matchContents('hell! world', 'start')).to.equal(false);
      });

      it("semantic actions", function() {
        expect(m.matchContents('hello world', 'start')({start: function(x, _) { return x.value }})).to.equal('hello');
      });
    });

    describe("listy", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar("M { start = 'abc' &_ ['d' 'ef'] 'g' }");
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents(['abc', ['d', 'ef'], 'g'], 'start')).to.be.ok();
        expect(m.matchContents(['abc', ['def'], 'g'], 'start')).to.equal(false);
        expect(m.matchContents(['abc', 'def', 'g'], 'start')).to.be.ok();
        expect(m.matchContents(['abc', ['d', 'ef', 'oops'], 'g'], 'start')).to.equal(false);
        expect(m.matchContents(['abc', ['d', 'ef'], 'gh'], 'start')).to.equal(false);
        expect(m.matchContents(['abc', [5], 'g'], 'start')).to.equal(false);
        expect(m.matchContents(['abc', [], 'g'], 'start')).to.equal(false);
        expect(m.matchContents(['abc', 5, 'g'], 'start')).to.equal(false);
      });

      it("semantic actions", function() {
        expect(m.matchContents(['abc', ['d', 'ef'], 'g'], 'start')({
	  _: function (expr) { return expr.value; },
          start: function(_, y, x, _, _) { return [x.value, y.value]; }
        })).to.eql(['d', ['d', 'ef']]);
      });
    });

    describe("obj", function() {
      var m;
      beforeEach(function() {
        m = makeGrammar([
          'M {',
          '  strict  = {x: 1, y: (2)}',
          '  lenient = {x: 1, y: (2), ...}',
          '}']);
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
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
          expect(m.match({x: 1, y: 2}, 'strict')({
            strict: function(a, b) { return [a.value, b.value]; }
          }))
          expect(m.match({y: 2, x: 1}, 'strict')({
            strict: function(a, b) { return [a.value, b.value]; }
          })).to.eql([1, 2]);
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
          expect(m.match({x: 1, y: 2}, 'lenient')({
            lenient: function(a, b, _) { return [a.value, b.value]; }
          })).to.eql([1, 2]);
          expect(m.match({y: 2, x: 1}, 'lenient')({
            lenient: function(a, b, _) { return [a.value, b.value]; }
          })).to.eql([1, 2]);
        });
      });

      it("duplicate property names are not allowed", function() {
        expect(function() {
          m = ohm.makeGrammar("M { duh = {x: 1, x: 2, y: 3, ...} }");
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
            "M {",
            "  easy = foo",
            "  foo = 'foo'",
            "}"]);
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        it("recognition", function() {
          expect(m.matchContents('fo', 'easy')).to.equal(false);
          expect(m.matchContents('foo', 'easy')).to.be.ok();
          expect(m.matchContents('fooo', 'easy')).to.equal(false);
        });

        it("semantic actions", function() {
          expect(m.matchContents('foo', 'easy')({
            easy: function(expr) { return ['easy', expr.value]; },
            foo:  function(expr) { return ['foo', expr.value]; }
          })).to.eql(['easy', ['foo', 'foo']]);
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

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
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
          expect(f({
            number:    function(expr) { return expr.value; },
            numberRec: function(n, d) { return n.value * 10 + d.value; },
            digit:     function(expr) { return expr.value.charCodeAt(0) - '0'.charCodeAt(0); }
          })).to.equal(1234);
          expect(f({
            number:    function(expr) { return ['number', expr.value]; },
            numberRec: function(n, d) { return ['numberRec', n.value, d.value]; },
            digit:     function(expr) { return expr.value; }
          })).to.eql(
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
            "M {",
            "  add = addRec | pri",
            "  addRec = add '+' pri",
            "  pri = priX | priY",
            "  priX = 'x'",
            "  priY = 'y'",
            "}"]);
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        it("recognition", function() {
          expect(m.matchContents('x+y+x', 'add')).to.be.ok();
        });

        it("semantic actions", function() {
          expect(m.matchContents('x+y+x', 'add')({
            addRec:   function(x, _, y) { return [x.value, '+', y.value]; },
            _default: function(ruleName, args) {
              return args[0].value;
            }
          })).to.eql([['x', '+', 'y'], '+', 'x']);
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

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        it("recognition", function() {
          expect(m.matchContents('', 'number')).to.equal(false);
          expect(m.matchContents('a', 'number')).to.equal(false);
          expect(m.matchContents('1', 'number')).to.be.ok();
          expect(m.matchContents('123', 'number')).to.be.ok();
          expect(m.matchContents('7276218173', 'number')).to.be.ok();
        });

        it("semantic actions", function() {
          expect(m.matchContents('1234', 'number')({
            numberRec: function(n, d) { return [n.value, d.value]; },
            _default:  function(ruleName, args) { return args[0].value; }
          })).to.eql([[['1', '2'], '3'], '4']);
        });
      });

      describe("nested left recursion", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  addExpr = addExprRec | mulExpr",
            "  addExprRec = addExpr '+' mulExpr",
            "  mulExpr = mulExprRec | priExpr",
            "  mulExprRec = mulExpr '*' priExpr",
            "  priExpr = /[0-9]/",
            "  sss = &addExpr addExpr",
            "}"]);
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
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
          expect(f({
            addExpr:    function(expr)    { return ['addExpr', expr.value]; },
            addExprRec: function(x, _, y) { return ['addExprRec', x.value, y.value]; },
            mulExpr:    function(expr)    { return ['mulExpr', expr.value]; },
            mulExprRec: function(x, _, y) { return ['mulExprRec', x.value, y.value] },
            priExpr:    function(expr)    { return expr.value; }
          })).to.eql(
            ['addExpr',
              ['addExprRec',
                ['addExpr',
                  ['addExprRec',
                    ['addExpr', ['mulExpr', ['mulExprRec', ['mulExpr', '1'], '2']]],
                    ['mulExpr', '3']]],
                ['mulExpr', ['mulExprRec', ['mulExpr', '4'], '5']]]]);
          expect(f({
            addExpr:    function(expr)    { return expr.value; },
            addExprRec: function(x, _, y) { return x.value + y.value; },
            mulExpr:    function(expr)    { return expr.value; },
            mulExprRec: function(x, _, y) { return x.value * y.value; },
            priExpr:    function(expr)    { return parseInt(expr.value); }
          })).to.equal(25);
          expect(f({
            addExprRec: function(x, _, y) { return '(' + x.value + '+' + y.value + ')'; },
            mulExprRec: function(x, _, y) { return '(' + x.value + '*' + y.value + ')'; },
            _default:   function(ruleName, args) { return args[0].value; }
          })).to.equal('(((1*2)+3)+(4*5))');
        });

        it("semantic actions are evaluated lazily", function() {
          var f = m.matchContents('1*2+3+4*5', 'sss');
          var a = buildTreeNodeWithUniqueId();
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
          expect(f(a)).to.eql(['id', 0, 'sss', t, t]);
          expect(a._getNextId()).to.equal(18);
        });
      });

      describe("nested and indirect left recursion", function() {
        var m;
        beforeEach(function() {
          m = makeGrammar([
            "G {",
            "  addExpr = a | c",
            "  a = b",
            "  b = addExprRec",
            "  addExprRec = addExpr '+' mulExpr",
            "  c = d",
            "  d = mulExpr",
            "  mulExpr = e | g",
            "  e = f",
            "  f = mulExprRec",
            "  g = h",
            "  h = priExpr",
            "  mulExprRec = mulExpr '*' priExpr",
            "  priExpr = /[0-9]/",
            "}"]);
        });

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        it("recognition", function() {
          expect(m.matchContents('1', 'addExpr')).to.be.ok();
          expect(m.matchContents('2+3', 'addExpr')).to.be.ok();
          expect(m.matchContents('4+', 'addExpr')).to.equal(false);
          expect(m.matchContents('5*6', 'addExpr')).to.be.ok();
          expect(m.matchContents('7+8*9+0', 'addExpr')).to.be.ok();
        });

        it("semantic actions", function() {
          expect(m.matchContents('7+8*9+0', 'addExpr')({
            addExprRec: function(x, _, y) { return [x.value, '+', y.value]; },
            mulExprRec: function(x, _, y) { return [x.value, '*', y.value]; },
            _default:   function(ruleName, args) { return args[0].value; }
          })).to.eql([['7', '+', ['8', '*', '9']], '+', '0']);
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

        it("to recipe and back", function() {
          expect(m).to.eql(ohm.make(eval(m.toRecipe())));
        });

        it("recognition", function() {
          expect(m.matchContents('1234', 'tricky')).to.be.ok();
        });

        it("semantic actions", function() {
          var f = m.matchContents('1234', 'tricky');
          expect(f({
            tricky: function(_, x) { return ['tricky', x.value]; },
            foo:    function(expr) { return ['foo', expr.value]; },
            fooRec: function(x, y) { return ['fooRec', x.value, y.value]; },
            bar:    function(expr) { return ['bar', expr.value]; },
            barRec: function(x, y) { return ['barRec', x.value, y.value]; },
            digit:  function(expr) { return expr.value; }
          })).to.eql(
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

        it("no namespace", function() {
          expect(function() {
            makeGrammar("G2 <: G1 {}");
          }).to.throwException(function(e) {
            expect(e).to.be.a(errors.UndeclaredGrammar);
            expect(e.grammarName).to.equal('G1');
            expect(e.namespaceName).to.be(undefined);
          });
        });
      });

      describe("define", function() {
        it("should check that rule does not already exist in super-grammar", function() {
          expect(function() {
            makeGrammars([
              "G1 { foo = 'foo' }",
              "G2 <: G1 { foo = 'bar' }"
            ], 'inheritance-define');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.DuplicateRuleDeclaration);
            expect(e.ruleName).to.equal('foo');
            expect(e.grammarName).to.equal('G1');
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

        it("to recipe and back", function() {
          var m1Prime = ohm.namespace('inheritance-override-prime').make(eval(m1.toRecipe()));
          m1Prime.namespaceName = 'inheritance-override';
          expect(m1).to.eql(m1Prime);

          var m2Prime = ohm.namespace('inheritance-override-prime').make(eval(m2.toRecipe()));
          m2Prime.namespaceName = 'inheritance-override';
          expect(m2).to.eql(m2Prime);
        });

        it("should check that rule exists in super-grammar", function() {
          expect(function() {
            makeGrammar("G3 <: G1 { foo := 'foo' }", 'inheritance-override');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.UndeclaredRule);
            expect(e.ruleName).to.equal('foo');
            expect(e.grammarName).to.equal('G1');
          });
        });

        it("should make sure rule arities are compatible", function() {
          // An overriding rule must produce the same number of values
	  // as the overridden rule. This is to ensure the semantic
	  // action "API" doesn't change.

	  // Too many:
          expect(function() {
            makeGrammar("M1 { foo = 'foo' }", "inheritance-override");
            makeGrammar("M2 <: M1 { foo := bar baz }", "inheritance-override");
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.RefinementMustBeCompatible);
            expect(e.ruleName).to.equal('foo');
            expect(e.why).to.equal('overriding');
          });

	  // Too few:
	  expect(function() {
            makeGrammar("M3 { foo = digit digit }", 'inheritance-override');
            makeGrammar("M4 <: M3 { foo := digit }", 'inheritance-override');
	  }).to.throwException(function (e) {
            expect(e).to.be.an(errors.RefinementMustBeCompatible);
            expect(e.ruleName).to.equal('foo');
            expect(e.why).to.equal('overriding');
	  });
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
          expect(m2.matchContents('abcd', 'number')({
            number: function(expr) { return ['number', expr.value]; },
            digit:  function(expr) { return ['digit', expr.value]; }
          })).to.eql(['number', [['digit', 'a'], ['digit', 'b'], ['digit', 'c'], ['digit', 'd']]]);
        });
      });

      describe("extend", function() {
        var m1;
        var m2;
        beforeEach(function() {
          if (m1 && m2) {
            return;
          } else {
            m1 = makeGrammar("G1 { foo = 'aaa' 'bbb' }", 'inheritanceExtend');
            m2 = makeGrammar("G2 <: inheritanceExtend.G1 { foo += '111' '222' }", 'inheritanceExtend2');
          }
        });

        it("to recipe and back", function() {
          var m1Prime = ohm.namespace('inheritance-extend-prime').make(eval(m1.toRecipe()));
          m1Prime.namespaceName = 'inheritanceExtend';
          expect(m1).to.eql(m1Prime);

          var m2Prime = ohm.namespace('inheritance-extend-prime').make(eval(m2.toRecipe()));
          m2Prime.namespaceName = 'inheritanceExtend2';
          expect(m2).to.eql(m2Prime);
        });

        it("should check that rule exists in super-grammar", function() {
          expect(function() {
            makeGrammar("G3 <: G1 { bar += 'bar' }", 'inheritanceExtend');
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
          expect(function() {
            makeGrammar("M1 { foo = 'foo' }", "inheritanceExtend3");
            makeGrammar("M2 <: M1 { foo += bar baz }", "inheritanceExtend3");
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.RefinementMustBeCompatible);
            expect(e.ruleName).to.equal('foo');
            expect(e.why).to.equal('extending');
          });

	  // Too few:
	  expect(function() {
            makeGrammar("M3 { foo = digit digit }", 'inheritanceExtend3');
            makeGrammar("M4 <: M3 { foo += digit }", 'inheritanceExtend3');
	  }).to.throwException(function(e) {
            expect(e).to.be.an(errors.RefinementMustBeCompatible);
            expect(e.ruleName).to.equal('foo');
            expect(e.why).to.equal('extending');
	  });
        });

        it("recognition", function() {
          expect(m1.matchContents('aaabbb', 'foo')).to.be.ok();
          expect(m1.matchContents('111222', 'foo')).to.equal(false);

          expect(m2.matchContents('aaabbb', 'foo')).to.be.ok();
          expect(m2.matchContents('111222', 'foo')).to.be.ok();
        });

        it("semantic actions", function() {
          expect(m2.matchContents('aaabbb', 'foo')({
            foo: function(x, y) { return [x.value, y.value]; }
          })).to.eql(['aaa', 'bbb']);
          expect(m2.matchContents('111222', 'foo')({
            foo: function(x, y) { return [x.value, y.value]; }
          })).to.eql(['111', '222']);
        });
      });
    });

    describe("bindings", function() {
      it("to recipe and back", function() {
        var m = makeGrammar("G { foo = 'a' 'b' | 'b' 'a' }");
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("inconsistent arity in alts is an error", function() {
        expect(function() {
          makeGrammar("G { foo = 'a' 'c' | 'b' }");
        }).to.throwException(function(e) {
          expect(e).to.be.a(errors.InconsistentArity);
          expect(e.ruleName).to.equal('foo');
          expect(e.expected).to.eql(2);
          expect(e.actual).to.eql(1);
        });
      });

      it("by default, bindings are evaluated lazily", function() {
        var g = makeGrammar([
          "G {",
          "  foo = bar baz",
          "  bar = 'a'",
          "  baz = 'b'",
          "}"]);

        var id = 0;
        expect(g.matchContents('ab', 'foo')({
          foo: function(x, y) { var xv = x.value; var yv = y.value; return {x: xv, y: yv}; },
          bar: function(expr) { return ['bar', expr.value, id++]; },
          baz: function(expr) { return ['baz', expr.value, id++]; }
        })).to.eql({x: ['bar', 'a', 0], y: ['baz', 'b', 1]});

        id = 0;
        expect(g.matchContents('ab', 'foo')({
          foo: function(x, y) { var yv = y.value; var xv = x.value; return {x: xv, y: yv}; },
          bar: function(expr) { return ['bar', expr.value, id++]; },
          baz: function(expr) { return ['baz', expr.value, id++]; }
        })).to.eql({x: ['bar', 'a', 1], y: ['baz', 'b', 0]});
      });

      it("eager evaluation mode works, too", function() {
        var g = makeGrammar([
          "G {",
          "  start = foo",  // rule that produces a value, but doesn't have bindings
          "  foo = bar baz",
          "  bar = 'a'",
          "  baz = 'b'",
          "}"]);

        var id = 0;
        var ddd = {};
        expect(g.matchContents('ab', 'start')({
          foo: function(x, y) { ddd.foo = id++; },
          bar: function(expr) { ddd.bar = id++; },
          baz: function(expr) { ddd.baz = id++; }
        }, 'eager')).to.equal(undefined);
        expect(ddd).to.eql({bar: 0, baz: 1, foo: 2});

        id = 0;
        ddd = {};
        expect(g.matchContents('ab', 'start')({
          // Note: in eager evaluation mode, it's ok to leave some semantic actions out (they'll just return undefined
          // by default, and the sub-expressions of the associated rule will be evaluated anyway).
          bar: function(expr) { ddd.bar = id++; },
          baz: function(expr) { ddd.baz = id++; }
        }, 'eager')).to.equal(undefined);
        expect(ddd).to.eql({bar: 0, baz: 1});

        id = 0;
        ddd = {};
        expect(g.matchContents('ab', 'start')({
          foo: function(x, y) { x.value; y.value; },
          bar: function(expr) { ddd.bar = id++; },
          baz: function(expr) { ddd.baz = id++; },
        }, 'eager')).to.eql(undefined);
        expect(ddd).to.eql({bar:  0, baz: 1});

        id = 0;
        ddd = {};
        expect(g.matchContents('ab', 'start')({
          foo: function(x, y) { y.value; x.value; },
          bar: function(expr) { ddd.bar = id++; },
          baz: function(expr) { ddd.baz = id++; },
        }, 'eager')).to.eql(undefined);
        expect(ddd).to.eql({bar:  0, baz: 1});
      });
    });

    describe("inline rule declarations", function() {
      var m;
      beforeEach(function() {
        m = ohm.makeGrammar(arithmeticGrammarSource);
      });

      it("to recipe and back", function() {
        expect(m).to.eql(ohm.make(eval(m.toRecipe())));
      });

      it("recognition", function() {
        expect(m.matchContents('1*(2+3)-4/5', 'expr')).to.be.ok();
      });

      it("semantic actions", function() {
        expect(m.matchContents('10*(2+123)-4/5', 'expr')({
          expr:           function(expr) { return expr.value; },
          addExpr:        function(expr) { return expr.value; },
          addExpr_plus:   function(x, op, y) { return x.value + y.value; },
          addExpr_minus:  function(x, op, y) { return x.value - y.value; },
          mulExpr:        function(expr) { return expr.value; },
          mulExpr_times:  function(x, op, y) { return x.value * y.value; },
          mulExpr_divide: function(x, op, y) { return x.value / y.value; },
          priExpr:        function(expr) { return expr.value; },
          priExpr_paren:  function(oparen, e, cparen) { return e.value; },
          number:         function(expr) { return expr.value; },
          number_rec:     function(n, d) { return n.value * 10 + d.value; },
          digit:          function(expr) { return expr.value.charCodeAt(0) - '0'.charCodeAt(0); }
        })).to.equal(1249.2);
      });

      it("can't be overridden/replaced", function() {
        ohm.namespace('inlineRuleTest1').install('Expr', m);

        expect(function() {
          makeGrammar("N <: Expr { addExpr := addExpr '~' mulExpr  -- minus }", 'inlineRuleTest1');
        }).to.throwException(function(e) {
          expect(e).to.be.an(errors.DuplicateRuleDeclaration);
          expect(e.ruleName).to.equal('addExpr_minus');
          expect(e.grammarName).to.equal('Expr');
        });

        expect(function() {
          makeGrammar("N <: Expr { addExpr += addExpr '~' mulExpr  -- minus }", 'inlineRuleTest1');
        }).to.throwException(function(e) {
          expect(e).to.be.an(errors.DuplicateRuleDeclaration);
          expect(e.ruleName).to.equal('addExpr_minus');
          expect(e.grammarName).to.equal('Expr');
        });
      });
    });

    describe("lexical vs. syntactic rules", function() {
      it("lexical rules don't skip spaces implicitly", function() {
        var g = makeGrammar("G { start = 'foo' 'bar' }");
        expect(g.matchContents('foobar', 'start')).to.be.ok();
        expect(g.matchContents('foo bar', 'start')).to.equal(false);
        expect(g.matchContents(' foo bar   ', 'start')).to.equal(false);
      });

      it("syntactic rules skip spaces implicitly", function() {
        var g = makeGrammar("G { Start = 'foo' 'bar' }");
        expect(g.matchContents('foobar', 'Start')).to.be.ok();
        expect(g.matchContents('foo bar', 'Start')).to.be.ok();
        expect(g.matchContents(' foo bar   ', 'Start')).to.be.ok();
      });

      it("mixing lexical and syntactic rules works as expected", function() {
        var g = makeGrammar([
          "G {",
          "  foo = 'foo'",
          "  bar = 'bar'",
          "  Start = foo bar",
          "}"]);
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
            "G1 {",
            "  foo = bar",
            "  bar = baz",
            "  baz = qux",
            "  qux = quux",
            "  quux = 42",
            "  aaa = 'duh'",
            "  bbb = ~aaa qux  -- blah",
            "}",
            "G2 <: G1 {",
            "  qux := 100",
            "}"
          ], 'semantic-action-templates');
          g1 = ohm.namespace('semantic-action-templates').getGrammar('G1');
          g2 = ohm.namespace('semantic-action-templates').getGrammar('G2');
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
           ns1 = ohm.namespace('ns1');
           ns2 = ohm.namespace('ns2');
        });

        it("actually installs a grammar in a namespace", function() {
          var m = ohm.makeGrammar("aaa { foo = 'foo' }", ns1);
          expect(ns1.getGrammar('aaa')).to.eql(m);
          expect(m.matchContents('foo', 'foo')).to.be.ok();
        });

        it("detects duplicates", function() {
          expect(function() {
            ohm.makeGrammar("ccc { foo = 'foo' }", ns1);
            ohm.makeGrammar("ccc { bar = 'bar' }", ns1);
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.DuplicateGrammarDeclaration);
            expect(e.grammarName).to.equal('ccc');
            expect(e.namespaceName).to.equal('ns1');
          });
        });

        it("allows same-name grammars to be installed in different namespaces", function() {
          var m1 = ohm.makeGrammar("bbb { foo = 'foo' }", ns1);
          var m2 = ohm.makeGrammar("bbb { bar = 'bar' }", ns2);

          expect(ns1.getGrammar('bbb')).to.eql(m1);
          expect(ns2.getGrammar('bbb')).to.eql(m2);
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
            ].join('\n')
          };
        });

        it("recognition", function() {
          var ns = ohm.namespace('aaa1');
          ns.loadGrammarsFromScriptElement(scriptTag);
          expect(function() {
            ns.getGrammar('M');
          }).to.throwException(function(e) {
            expect(e).to.be.an(errors.UndeclaredGrammar);
            expect(e.grammarName).to.equal('M');
            expect(e.namespaceName).to.equal('aaa1');
          });
          expect(ns.getGrammar('O')).to.be.ok();
          expect(ns.getGrammar('O').matchContents('1234', 'number')).to.be.ok();
        });

        it("semantic actions", function() {
          var ns = ohm.namespace('aaa2');
          ns.loadGrammarsFromScriptElement(scriptTag);
          var m = ns.getGrammar('O');
          expect(m).to.be.ok();
          expect(m.matchContents('1234', 'number')({
            number:     function(expr) { return expr.value; },
            number_rec: function(n, d) { return n.value * 10 + d.value; },
            digit:      function(expr) { return expr.value.charCodeAt(0) - '0'.charCodeAt(0); }
          })).to.equal(1234);
        });
      });
    });

    describe("throw on fail", function() {
      it("match", function() {
        var g = makeGrammar('G { start = 5 }');
        expect(function() {
          g.match(42, 'start', true);
        }).to.throwException(function(e) {
          expect(e.toString()).to.equal('error at position 0');
          expect(e.getPos()).to.equal(0);
        });
      });

      it("matchContents", function() {
        var g = makeGrammar("G { start = 'a' 'b' 'c' 'd' }");
        expect(function() {
          g.matchContents('ab', 'start', true);
        }).to.throwException(function(e) {
          expect(e.toString()).to.equal("Line 1, col 3: expected 'c'");
          expect(e.getPos()).to.equal(2);
        });
        expect(function() {
          g.matchContents('abcde', 'start', true);
        }).to.throwException(function(e) {
          expect(e.toString()).to.equal("Line 1, col 5: expected the end of the input");
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
        var gPrime = ohm._makeGrammarBuilder()(g.matchContents(ohmGrammarSource, 'Grammar'));
        expect(gPrime.matchContents(ohmGrammarSource, 'Grammar')).to.be.ok();
      });

      it("can produce a grammar that works", function() {
        var gPrime = ohm._makeGrammarBuilder()(g.matchContents(ohmGrammarSource, 'Grammar'));
        var a = ohm._makeGrammarBuilder()(gPrime.matchContents(arithmeticGrammarSource, 'Grammar'));
        var eval = a.attribute({
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
          digit:          function(expr) { return eval(expr).charCodeAt(0) - '0'.charCodeAt(0); }
        });
        expect(eval(a.matchContents('10*(2+123)-4/5', 'expr'))).to.equal(1249.2);
      });

      it("full bootstrap!", function() {
        var gPrime = ohm._makeGrammarBuilder()(g.matchContents(ohmGrammarSource, 'Grammar'));
        var gPrimePrime = ohm._makeGrammarBuilder()(gPrime.matchContents(ohmGrammarSource, 'Grammar'));
        expect(gPrime).to.eql(gPrimePrime);
      });

      it("to recipe and back", function() {
        var gPrime = ohm._makeGrammarBuilder()(g.matchContents(ohmGrammarSource, 'Grammar'));
        expect(ohm.make(eval(gPrime.toRecipe()))).to.eql(gPrime);
      });
    });
  });
});

