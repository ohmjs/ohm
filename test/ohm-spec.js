var fs = require('fs')
var ohm = require('../src/ohm.js')
var awlib = require('awlib')
var objectUtils = awlib.objectUtils
var stringUtils = awlib.stringUtils
var equals = awlib.equals

function makeGrammar(source, optNamespaceName) {
  if (source instanceof Array)
    source = source.join('\n')
  return ohm.makeGrammar(source, optNamespaceName ? ohm.namespace(optNamespaceName) : undefined)
}

function makeGrammars(source, optNamespaceName) {
  if (source instanceof Array)
    source = source.join('\n')
  return ohm.makeGrammars(source, optNamespaceName ? ohm.namespace(optNamespaceName) : undefined)
}

var arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString()
var ohmGrammarSource = fs.readFileSync('src/ohm-grammar.ohm').toString()

describe("Ohm", function() {
  describe("unit tests", function() {

    function buildTreeNodeWithUniqueId() {
      var nextId = 0
      return {
        _default: function(ruleName) {
          var ans = ['id', nextId++, ruleName]
          for (var idx = 1; idx < arguments.length; idx++)
            ans.push(arguments[idx])
          return ans
        },
        _getNextId: function() {
          return nextId
        }
      }
    }

    describe("primitive patterns", function() {
      describe("anything", function() {
        var m
        beforeEach(function() {
          m = makeGrammar("M { }")
        })

        it("to recipe and back", function() {
          expect(eval(m.toRecipe())(ohm)).toEqual(m)
        })

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(5, '_')).toBeTruthy()
            expect(m.match(null, '_')).toBeTruthy()
          })

          it("semantic actions", function() {
            expect(m.match(5, '_')({_: function(value) { return value }})).toEqual(5)
            expect(m.match(null, '_')({_: function(value) { return value }})).toEqual(null)
          })
        })

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('5', '_')).toBeTruthy()
            expect(m.matchContents('', '_')).toEqual(false)
          })

          it("semantic actions", function() {
            expect(m.matchContents('5', '_')({_: function(value) { return value }})).toEqual('5')
          })
        })

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['123'], '_')).toBeTruthy()
            expect(m.matchContents(['123', 4], '_')).toEqual(false)
            expect(m.matchContents([], '_')).toEqual(false)
          })

          it("semantic actions", function() {
            expect(m.matchContents(['123'], '_')({_: function(value) { return value }})).toEqual('123')
          })
        })
      })

      describe("exactly(x)", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  five == 5",
            "  _true == true",
            "  _false == false",
            "  _null == null",
            "  _undefined == undefined",
            "}"])
        })

        it("to recipe and back", function() {
          expect(eval(m.toRecipe())(ohm)).toEqual(m)
        })

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(5, 'five')).toBeTruthy()
            expect(m.match(2, 'five')).toEqual(false)
            expect(m.match('a', 'five')).toEqual(false)
            expect(m.match('5', 'five')).toEqual(false)
            expect(m.match('true', 'five')).toEqual(false)
            expect(m.match(true, 'five')).toEqual(false)
            expect(m.match('false', 'five')).toEqual(false)
            expect(m.match(false, 'five')).toEqual(false)
            expect(m.match(null, 'five')).toEqual(false)
            expect(m.match(undefined, 'five')).toEqual(false)

            expect(m.match(5, '_true')).toEqual(false)
            expect(m.match(2, '_true')).toEqual(false)
            expect(m.match('a', '_true')).toEqual(false)
            expect(m.match('5', '_true')).toEqual(false)
            expect(m.match('true', '_true')).toEqual(false)
            expect(m.match(true, '_true')).toBeTruthy()
            expect(m.match('false', '_true')).toEqual(false)
            expect(m.match(false, '_true')).toEqual(false)
            expect(m.match(null, '_true')).toEqual(false)
            expect(m.match(undefined, '_true')).toEqual(false)

            expect(m.match(5, '_false')).toEqual(false)
            expect(m.match(2, '_false')).toEqual(false)
            expect(m.match('a', '_false')).toEqual(false)
            expect(m.match('5', '_false')).toEqual(false)
            expect(m.match('true', '_false')).toEqual(false)
            expect(m.match(true, '_false')).toEqual(false)
            expect(m.match('false', '_false')).toEqual(false)
            expect(m.match(false, '_false')).toBeTruthy()
            expect(m.match(null, '_false')).toEqual(false)
            expect(m.match(undefined, '_false')).toEqual(false)

            expect(m.match(5, '_null')).toEqual(false)
            expect(m.match(2, '_null')).toEqual(false)
            expect(m.match('a', '_null')).toEqual(false)
            expect(m.match('5', '_null')).toEqual(false)
            expect(m.match('true', '_null')).toEqual(false)
            expect(m.match(true, '_null')).toEqual(false)
            expect(m.match('false', '_null')).toEqual(false)
            expect(m.match(false, '_null')).toEqual(false)
            expect(m.match(null, '_null')).toBeTruthy()
            expect(m.match(undefined, '_null')).toEqual(false)

            expect(m.match(5, '_undefined')).toEqual(false)
            expect(m.match(2, '_undefined')).toEqual(false)
            expect(m.match('a', '_undefined')).toEqual(false)
            expect(m.match('5', '_undefined')).toEqual(false)
            expect(m.match('true', '_undefined')).toEqual(false)
            expect(m.match(true, '_undefined')).toEqual(false)
            expect(m.match('false', '_undefined')).toEqual(false)
            expect(m.match(false, '_undefined')).toEqual(false)
            expect(m.match(null, '_undefined')).toEqual(false)
            expect(m.match(undefined, '_undefined')).toBeTruthy()
          })

          it("semantic actions", function() {
            expect(m.match(5, 'five')({five: function(value) { return value }})).toEqual(5)
            expect(m.match(true, '_true')({_true: function(value) { return value }})).toEqual(true)
            expect(m.match(false, '_false')({_false: function(value) { return value }})).toEqual(false)
            expect(m.match(null, '_null')({_null: function(value) { return value }})).toEqual(null)
            expect(m.match(undefined, '_undefined')({_undefined: function(value) { return value }})).toEqual(undefined)
          })
        })

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('!', 'five')).toEqual(false)
            expect(m.matchContents('5', 'five')).toEqual(false)
            expect(m.matchContents('2', 'five')).toEqual(false)
            expect(m.matchContents('', 'five')).toEqual(false)
            expect(m.matchContents('true', '_true')).toEqual(false)
            expect(m.matchContents('false', '_false')).toEqual(false)
            expect(m.matchContents('null', '_null')).toEqual(false)
            expect(m.matchContents('undefined', '_undefined')).toEqual(false)
          })

          it("semantic actions", function() {
            // N/A
          })
        })

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['!'], 'five')).toEqual(false)
            expect(m.matchContents(['5'], 'five')).toEqual(false)
            expect(m.matchContents([2], 'five')).toEqual(false)
            expect(m.matchContents([5], 'five')).toBeTruthy()
            expect(m.matchContents([5, 'a'], 'five')).toEqual(false)
            expect(m.matchContents([''], 'five')).toEqual(false)
            expect(m.matchContents([], 'five')).toEqual(false)
            expect(m.matchContents([true], '_true')).toBeTruthy()
            expect(m.matchContents([false], '_false')).toBeTruthy()
            expect(m.matchContents([undefined], '_undefined')).toBeTruthy()
          })

          it("semantic actions", function() {
            var thunk = m.matchContents([5], 'five')
            expect(thunk({five: function(value) { return value }})).toEqual(5)
          })
        })
      })

      describe("char", function() {
        var m
        beforeEach(function() {
          m = makeGrammar("M { bang == '!' }")
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match('!', 'bang')).toBeTruthy()
            expect(m.match('!a', 'bang')).toEqual(false)
            expect(m.match(5, 'bang')).toEqual(false)
            expect(m.match('', 'bang')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.match('!', 'bang')
            expect(thunk({bang: function(value) { return value }})).toEqual('!')
          })
        })

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('!', 'bang')).toBeTruthy()
            expect(m.matchContents('a', 'bang')).toEqual(false)
            expect(m.matchContents('', 'bang')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.matchContents('!', 'bang')
            expect(thunk({bang: function(value) { return value }})).toEqual('!')
          })
        })

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['!'], 'bang')).toBeTruthy()
            expect(m.matchContents(['a'], 'bang')).toEqual(false)
            expect(m.matchContents(['!', 'a'], 'bang')).toEqual(false)
            expect(m.matchContents([''], 'bang')).toEqual(false)
            expect(m.matchContents([], 'bang')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.matchContents(['!'], 'bang')
            expect(thunk({bang: function(value) { return value }})).toEqual('!')
          })
        })
      })

      describe("string", function() {
        var m
        beforeEach(function() {
          m = makeGrammar("M { foo == 'foo' }")
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match('foo', 'foo')).toBeTruthy()
            expect(m.match('foo1', 'foo')).toEqual(false)
            expect(m.match('bar', 'foo')).toEqual(false)
            expect(m.match(null, 'foo')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.match('foo', 'foo')
            expect(thunk({foo: function(value) { return value }})).toEqual('foo')
          })
        })

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('foo', 'foo')).toBeTruthy()
            expect(m.matchContents('foo1', 'foo')).toEqual(false)
            expect(m.matchContents('bar', 'foo')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.matchContents('foo', 'foo')
            expect(thunk({foo: function(value) { return value }})).toEqual('foo')
          })
        })

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['foo'], 'foo')).toBeTruthy()
            expect(m.matchContents(['foo1'], 'foo')).toEqual(false)
            expect(m.matchContents(['foo', '1'], 'foo')).toEqual(false)
            expect(m.matchContents(['foo', 'foo'], 'foo')).toEqual(false)
            expect(m.matchContents([''], 'foo')).toEqual(false)
            expect(m.matchContents([], 'foo')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.matchContents(['foo'], 'foo')
            expect(thunk({foo: function(value) { return value }})).toEqual('foo')
          })
        })
      })

      describe("regexp", function() {
        var m
        beforeEach(function() {
          m = makeGrammar('M { myDigit == /[0-9]/ }')
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        describe("direct match, no stream", function() {
          it("recognition", function() {
            expect(m.match(/[0-9]/, 'myDigit')).toEqual(false)
            expect(m.match('4', 'myDigit')).toEqual(false)
            expect(m.match(4, 'myDigit')).toEqual(false)
            expect(m.match('a', 'myDigit')).toEqual(false)
            expect(m.match('a4', 'myDigit')).toEqual(false)
          })

          it("semantic actions", function() {
            // N/A
          })
        })

        describe("match in string stream", function() {
          it("recognition", function() {
            expect(m.matchContents('4', 'myDigit')).toBeTruthy()
            expect(m.matchContents('a', 'myDigit')).toEqual(false)
            expect(m.matchContents('a4', 'myDigit')).toEqual(false)
          })

          it("semantic actions", function() {
            var thunk = m.matchContents('4', 'myDigit')
            expect(thunk({myDigit: function(value) { return value }})).toEqual('4')
          })
        })

        describe("match in list stream", function() {
          it("recognition", function() {
            expect(m.matchContents(['4'], 'myDigit')).toEqual(false)
            expect(m.matchContents([/[0-9]/], 'myDigit')).toEqual(false)
            expect(m.matchContents([''], 'myDigit')).toEqual(false)
            expect(m.matchContents([], 'myDigit')).toEqual(false)
          })

          it("semantic actions", function() {
            // N/A
          })
        })
      })
    })

    describe("alt", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { altTest == 'a' | 'b' }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('', 'altTest')).toEqual(false)
        expect(m.matchContents('a', 'altTest')).toBeTruthy()
        expect(m.matchContents('b', 'altTest')).toBeTruthy()
        expect(m.matchContents('ab', 'altTest')).toEqual(false)
      })

      it("semantic actions", function() {
        expect(m.matchContents('a', 'altTest')({altTest: function(value) { return value }})).toEqual('a')
        expect(m.matchContents('b', 'altTest')({altTest: function(value) { return value }})).toEqual('b')
      })
    })

    describe("seq", function() {
      it("to recipe and back", function() {
        var m = makeGrammar("M { start == 'a' 'bc' 'z' }")
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      describe("without bindings", function() {
        var m
        beforeEach(function() {
          m = makeGrammar("M { start == ('a' 'bc' 'z')? }")
        })
  
        it("recognition", function() {
          expect(m.matchContents('a', 'start')).toEqual(false)
          expect(m.matchContents('bc', 'start')).toEqual(false)
          expect(m.matchContents('abcz', 'start')).toBeTruthy()
          expect(m.matchContents('abbz', 'start')).toEqual(false)
        })

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start')
          expect(f({
            start: function(value) { return value }
          })).toEqual([undefined])
        })
      })

      describe("with exactly one binding", function() {
        var m
        beforeEach(function() {
          m = makeGrammar("M { start == ('a'.x 'bc' 'z')? }")
        })
  
        it("recognition", function() {
          expect(m.matchContents('a', 'start')).toEqual(false)
          expect(m.matchContents('bc', 'start')).toEqual(false)
          expect(m.matchContents('abcz', 'start')).toBeTruthy()
          expect(m.matchContents('abbz', 'start')).toEqual(false)
        })

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start')
          expect(f({
            start: function(value) { return value },
          })).toEqual([undefined])
        })
      })

      describe("with more than one binding", function() {
        var m
        beforeEach(function() {
          m = makeGrammar("M { start == ('a'.x 'bc' 'z'.y)? }")
        })
  
        it("recognition", function() {
          expect(m.matchContents('a', 'start')).toEqual(false)
          expect(m.matchContents('bc', 'start')).toEqual(false)
          expect(m.matchContents('abcz', 'start')).toBeTruthy()
          expect(m.matchContents('abbz', 'start')).toEqual(false)
        })

        it("semantic actions", function() {
          var f = m.matchContents('abcz', 'start')
          expect(f({
            start: function(value) { return value }
          })).toEqual([undefined])
        })
      })

      it("with duplicate binding", function() {
        console.log('\nNote: the following error message is actually supposed to be there')
        expect(function() {
          m = makeGrammar("M { start == ('a'.x 'bc' 'z'.x)? }")
        }).toThrow()
      })
    })

    describe("alts and seqs together", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { start == 'a'.x 'b' 'c'.y | '1'.x '2' '3'.y }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('ab', 'start')).toEqual(false)
        expect(m.matchContents('12', 'start')).toEqual(false)
        expect(m.matchContents('abc', 'start')).toBeTruthy()
        expect(m.matchContents('123', 'start')).toBeTruthy()
      })

      it("semantic actions", function() {
        expect(m.matchContents('abc', 'start')({start: function(x, y) { return [x, y] }})).toEqual(['a', 'c'])
        expect(m.matchContents('123', 'start')({start: function(x, y) { return [x, y] }})).toEqual(['1', '3'])
      })
    })

    describe("many", function() {
      var m
      beforeEach(function() {
        m = makeGrammar([
          "M {",
          "  number == digit+",
          "  digits == digit*",
          "}"])
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('1234a', 'number')).toEqual(false)
        expect(m.matchContents('1234', 'number')).toBeTruthy()
        expect(m.matchContents('5', 'number')).toBeTruthy()
        expect(m.matchContents('', 'number')).toEqual(false)

        expect(m.matchContents('1234a', 'digits')).toEqual(false)
        expect(m.matchContents('1234', 'digits')).toBeTruthy()
        expect(m.matchContents('5', 'digits')).toBeTruthy()
        expect(m.matchContents('', 'digits')).toBeTruthy()
      })

      it("semantic actions", function() {
        var f = m.matchContents('1234', 'number')
        expect(f({
          number: function(value) { return ['digits', value] },
          digit: function(value) { return ['digit', value] }
        })).toEqual(['digits', [['digit', '1'], ['digit', '2'], ['digit', '3'], ['digit', '4']]])
      })
    })

    describe("opt", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { name == 'dr'?.title 'warth'.last }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('drwarth', 'name')).toBeTruthy()
        expect(m.matchContents('warth', 'name')).toBeTruthy()
        expect(m.matchContents('mrwarth', 'name')).toEqual(false)
      })

      it("semantic actions", function() {
        var actionDict = {name: function(title, last) { return [title, last] }}
        expect(m.matchContents('drwarth', 'name')(actionDict)).toEqual([['dr'], 'warth'])
        expect(m.matchContents('warth', 'name')(actionDict)).toEqual([undefined, 'warth'])
      })
    })

    describe("not", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { start == ~'hello'.x _* }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('yello world', 'start')).toBeTruthy()
        expect(m.matchContents('hello world', 'start')).toEqual(false)
      })

      it("semantic actions", function() {
        expect(m.matchContents('yello world', 'start')({
            start: function(x) { return x }
        })).toEqual(undefined)
      })
    })

    describe("lookahead", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { start == &'hello'.x _* }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('hello world', 'start')).toBeTruthy()
        expect(m.matchContents('hell! world', 'start')).toEqual(false)
      })

      it("semantic actions", function() {
        expect(m.matchContents('hello world', 'start')({start: function(x) { return x }})).toEqual('hello')
      })
    })

    describe("str", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { start == \"/[a-z]/ 'bc'\".x 'd' 'ef' }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents(['abc', 'd', 'ef'], 'start')).toBeTruthy()
        expect(m.matchContents(['pbc', 'd', 'ef'], 'start')).toBeTruthy()
        expect(m.matchContents(['abcd', 'd', 'ef'], 'start')).toEqual(false)
      })

      it("semantic actions", function() {
        expect(m.matchContents(['abc', 'd', 'ef'], 'start')({
          start: function(x) { return x }
        })).toEqual('abc')
      })
    })

    describe("lst", function() {
      var m
      beforeEach(function() {
        m = makeGrammar("M { start == 'abc' ['d'].x 'ef' }")
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents(['abc', ['d'], 'ef'], 'start')).toBeTruthy()
        expect(m.matchContents(['abc', ['d', 'e'], 'ef'], 'start')).toEqual(false)
        expect(m.matchContents(['abc', ['e'], 'ef'], 'start')).toEqual(false)
        expect(m.matchContents(['abc', [5], 'ef'], 'start')).toEqual(false)
        expect(m.matchContents(['abc', [], 'ef'], 'start')).toEqual(false)
        expect(m.matchContents(['abc', 5, 'ef'], 'start')).toEqual(false)
      })

      it("semantic actions", function() {
        expect(m.matchContents(['abc', ['d'], 'ef'], 'start')({
          start: function(x) { return x }
        })).toEqual(['d'])
      })
    })

    describe("obj", function() {
      var m
      beforeEach(function() {
        m = makeGrammar([
          'M {',
            '  strict  == {x: 1.a, y: 2.b}',
            '  lenient == {x: 1.a, y: 2.b, ...}',
          '}'])
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      describe("strict", function() {
        it("recognition", function() {
          expect(m.match('foo', 'strict')).toEqual(false)
          expect(m.match([], 'strict')).toEqual(false)
          expect(m.match({y: 2}, 'strict')).toEqual(false)
          expect(m.match({x: 1, y: 2}, 'strict')).toBeTruthy()
          expect(m.match({y: 2, x: 1}, 'strict')).toBeTruthy()
          expect(m.match({x: 1, y: 2, z: 3}, 'strict')).toEqual(false)
        })

        it("semantic actions", function() {
          expect(m.match({x: 1, y: 2}, 'strict')({
            strict: function(a, b) { return [a, b] }
          })).toEqual([1, 2])
        })
      })

      describe("lenient", function() {
        it("recognition", function() {
          expect(m.match('foo', 'lenient')).toEqual(false)
          expect(m.match([], 'lenient')).toEqual(false)
          expect(m.match({y: 2}, 'lenient')).toEqual(false)
          expect(m.match({x: 1, y: 2}, 'lenient')).toBeTruthy()
          expect(m.match({y: 2, x: 1}, 'lenient')).toBeTruthy()
          expect(m.match({x: 1, y: 2, z: 3}, 'lenient')).toBeTruthy()
        })

        it("semantic actions", function() {
          expect(m.match({x: 1, y: 2}, 'lenient')({
            lenient: function(a, b) { return [a, b] }
          })).toEqual([1, 2])
        })
      })

      it("duplicate property names are not allowed", function() {
        console.log('\nNote: the following error message is actually supposed to be there')
        expect(function() {
          m = ohm.makeGrammar("M { duh == {x: 1.a, y: 2.a, ...} }")
        }).toThrow()
      })
    })

    describe("apply", function() {
      describe("simple, no left recursion", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  easy == foo",
            "  foo == 'foo'",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('fo', 'easy')).toEqual(false)
          expect(m.matchContents('foo', 'easy')).toBeTruthy()
          expect(m.matchContents('fooo', 'easy')).toEqual(false)
        })

        it("semantic actions", function() {
          expect(m.matchContents('foo', 'easy')({
            easy: function(value) { return ['easy', value] },
            foo: function(value) { return ['foo', value] }
          })).toEqual(['easy', ['foo', 'foo']])
        })
      })

      describe("simple left recursion", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  number == numberRec | digit",
            "  numberRec == number.n digit.d",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('', 'number')).toEqual(false)
          expect(m.matchContents('a', 'number')).toEqual(false)
          expect(m.matchContents('1', 'number')).toBeTruthy()
          expect(m.matchContents('123', 'number')).toBeTruthy()
          expect(m.matchContents('7276218173', 'number')).toBeTruthy()
        })

        it("semantic actions", function() {
          var f = m.matchContents('1234', 'number')
          expect(f({
            number: function(value) { return value },
            numberRec: function(n, d) { return n * 10 + d },
            digit: function(value) { return value.charCodeAt(0) - '0'.charCodeAt(0) }
          })).toEqual(1234)
          expect(f({
            number: function(value) { return ['number', value] },
            numberRec: function(n, d) { return ['numberRec', n, d] },
            digit: function(value) { return value }
          })).toEqual(
            ['number',
              ['numberRec',
                ['number',
                  ['numberRec',
                    ['number',
                      ['numberRec',
                        ['number', '1'],
                        '2']],
                    '3']],
                '4']])
        })
      })

      describe("simple left recursion, with non-involved rules", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  add == addRec | pri",
            "  addRec == add.x '+' pri.y",
            "  pri == priX | priY",
            "  priX == 'x'",
            "  priY == 'y'",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('x+y+x', 'add')).toBeTruthy()
        })

        it("semantic actions", function() {
          expect(m.matchContents('x+y+x', 'add')({
            addRec: function(x, y) { return [x, '+', y] },
            _default: function(ruleName, value) { return value }
          })).toEqual([['x', '+', 'y'], '+', 'x'])
        })
      })

      describe("indirect left recursion", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  number == foo | digit",
            "  foo == bar",
            "  bar == baz",
            "  baz == qux",
            "  qux == quux",
            "  quux == numberRec",
            "  numberRec == number.n digit.d",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('', 'number')).toEqual(false)
          expect(m.matchContents('a', 'number')).toEqual(false)
          expect(m.matchContents('1', 'number')).toBeTruthy()
          expect(m.matchContents('123', 'number')).toBeTruthy()
          expect(m.matchContents('7276218173', 'number')).toBeTruthy()
        })

        it("semantic actions", function() {
          expect(m.matchContents('1234', 'number')({
            numberRec: function(n, d) { return [n, d] },
            _default: function(ruleName, x) { return x }
          })).toEqual([[['1', '2'], '3'], '4'])
        })
      })

      describe("nested left recursion", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "M {",
            "  addExpr == addExprRec | mulExpr",
            "  addExprRec == addExpr.x '+' mulExpr.y",
            "  mulExpr == mulExprRec | priExpr",
            "  mulExprRec == mulExpr.x '*' priExpr.y",
            "  priExpr == /[0-9]/",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('1', 'addExpr')).toBeTruthy()
          expect(m.matchContents('2+3', 'addExpr')).toBeTruthy()
          expect(m.matchContents('4+', 'addExpr')).toEqual(false)
          expect(m.matchContents('5*6', 'addExpr')).toBeTruthy()
          expect(m.matchContents('7*8+9+0', 'addExpr')).toBeTruthy()
        })

        it("semantic actions", function() {
          var f = m.matchContents('1*2+3+4*5', 'addExpr')
          expect(f({
            addExpr: function(value) { return ['addExpr', value] },
            addExprRec: function(x, y) { return ['addExprRec', x, y] },
            mulExpr: function(value) { return ['mulExpr', value] },
            mulExprRec: function(x, y) { return ['mulExprRec', x, y] },
            priExpr: function(value) { return value }
          })).toEqual(
            ['addExpr',
              ['addExprRec',
                ['addExpr',
                  ['addExprRec',
                    ['addExpr', ['mulExpr', ['mulExprRec', ['mulExpr', '1'], '2']]],
                    ['mulExpr', '3']]],
                ['mulExpr', ['mulExprRec', ['mulExpr', '4'], '5']]]])
          expect(f({
            addExpr: function(value) { return value },
            addExprRec: function(x, y) { return x + y },
            mulExpr: function(value) { return value },
            mulExprRec: function(x, y) { return x * y },
            priExpr: function(value) { return parseInt(value) }
          })).toEqual(25)
          expect(f({
            addExprRec: function(x, y) { return '(' + x + '+' + y + ')' },
            mulExprRec: function(x, y) { return '(' + x + '*' + y + ')' },
            _default: function(ruleName, x) { return x }
          })).toEqual('(((1*2)+3)+(4*5))')
        })

        it("stingy on semantic actions", function() {
          var f = m.matchContents('1*2+3+4*5', 'addExpr')
          var a = buildTreeNodeWithUniqueId()
          expect(f(a)).toEqual(
            ['id', 16, 'addExpr',
              ['id', 15, 'addExprRec',
                ['id', 9, 'addExpr',
                  ['id', 8, 'addExprRec',
                    ['id', 5, 'addExpr',
                      ['id', 4, 'mulExpr',
                        ['id', 3, 'mulExprRec',
                          ['id', 1, 'mulExpr',
                            ['id', 0, 'priExpr', '1']],
                          ['id', 2, 'priExpr', '2']]]],
                    ['id', 7, 'mulExpr',
                      ['id', 6, 'priExpr', '3']]]],
                ['id', 14, 'mulExpr',
                  ['id', 13, 'mulExprRec',
                    ['id', 11, 'mulExpr',
                      ['id', 10, 'priExpr', '4']],
                    ['id', 12, 'priExpr', '5']]]]])
          expect(a._getNextId()).toEqual(17)
        })
      })

      describe("nested and indirect left recursion", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "G {",
            "  addExpr == a | c",
            "  a == b",
            "  b == addExprRec",
            "  addExprRec == addExpr.x '+' mulExpr.y",
            "  c == d",
            "  d == mulExpr",
            "  mulExpr == e | g",
            "  e == f",
            "  f == mulExprRec",
            "  g == h",
            "  h == priExpr",
            "  mulExprRec == mulExpr.x '*' priExpr.y",
            "  priExpr == /[0-9]/",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('1', 'addExpr')).toBeTruthy()
          expect(m.matchContents('2+3', 'addExpr')).toBeTruthy()
          expect(m.matchContents('4+', 'addExpr')).toEqual(false)
          expect(m.matchContents('5*6', 'addExpr')).toBeTruthy()
          expect(m.matchContents('7+8*9+0', 'addExpr')).toBeTruthy()
        })

        it("semantic actions", function() {
          expect(m.matchContents('7+8*9+0', 'addExpr')({
            addExprRec: function(x, y) { return [x, '+', y] },
            mulExprRec: function(x, y) { return [x, '*', y] },
            _default: function(ruleName, x) { return x }
          })).toEqual([['7', '+', ['8', '*', '9']], '+', '0'])
        })
      })

      describe("tricky left recursion (different heads at same position)", function() {
        var m
        beforeEach(function() {
          m = makeGrammar([
            "G {",
            "  tricky == &foo bar.x",
            "  foo == fooRec | digit",
            "  fooRec == bar.x digit.y",
            "  bar == barRec | digit",
            "  barRec == foo.x digit.y",
            "}"])
        })

        it("to recipe and back", function() {
          expect(m).toEqual(eval(m.toRecipe())(ohm))
        })

        it("recognition", function() {
          expect(m.matchContents('1234', 'tricky')).toBeTruthy()
        })

        it("semantic actions", function() {
          var f = m.matchContents('1234', 'tricky')
          expect(f({
            tricky: function(x) { return ['tricky', x] },
            foo: function(value) { return ['foo', value] },
            fooRec: function(x, y) { return ['fooRec', x, y] },
            bar: function(value) { return ['bar', value] },
            barRec: function(x, y) { return ['barRec', x, y] },
            digit: function(value) { return value }
          })).toEqual(
            ['tricky', ['bar', ['barRec', ['foo', ['fooRec', ['bar', ['barRec', ['foo', '1'], '2']], '3']], '4']]])
        })
      })
    })

    describe("inheritance", function() {
      describe("define", function() {
        it("should check that rule does not already exist in super-grammar", function() {
          console.log('\nNote: the following error message is actually supposed to be there')
          expect(function() {
            makeGrammars([
              "G1 { foo == 'foo' }",
              "G2 <: G1 { foo == 'bar' }"
            ], 'inheritance-define')
          }).toThrow()
        })
      })

      describe("override", function() {
        var m1
        var m2
        beforeEach(function() {
          if (m1 && m2)
            return
          else {
            m1 = makeGrammar("G1 { number == digit+ }", 'inheritance-override')
            m2 = makeGrammar("G2 <: G1 { digit := /[a-z]/ }", 'inheritance-override')
          }
        })

        it("to recipe and back", function() {
          var m1Prime = eval(m1.toRecipe())(ohm, ohm.namespace('inheritance-override-prime'))
          m1Prime.namespaceName = 'inheritance-override'
          expect(m1).toEqual(m1Prime)

          var m2Prime = eval(m2.toRecipe())(ohm, ohm.namespace('inheritance-override-prime'))
          m2Prime.namespaceName = 'inheritance-override'
          expect(m2).toEqual(m2Prime)
        })

        it("should check that rule exists in super-grammar", function() {
          console.log('\nNote: the following error message is actually supposed to be there')
          expect(function() {
            makeGrammar("G3 <: G1 { foo := 'foo' }", 'inheritance-override')
          }).toThrow()
        })

        it("recognition", function() {
          expect(m1.matchContents('1234', 'number')).toBeTruthy()
          expect(m1.matchContents('hello', 'number')).toEqual(false)
          expect(m1.matchContents('h3llo', 'number')).toEqual(false)

          expect(m2.matchContents('1234', 'number')).toEqual(false)
          expect(m2.matchContents('hello', 'number')).toBeTruthy()
          expect(m2.matchContents('h3llo', 'number')).toEqual(false)
        })

        it("semantic actions", function() {
          expect(m2.matchContents('abcd', 'number')({
            number: function(value) { return ['number', value] },
            digit: function(value) { return ['digit', value] }
          })).toEqual(['number', [['digit', 'a'], ['digit', 'b'], ['digit', 'c'], ['digit', 'd']]])
        })
      })

      describe("extend", function() {
        var m1
        var m2
        beforeEach(function() {
          if (m1 && m2)
            return
          else {
            m1 = makeGrammar("G1 { foo == 'aaa'.x 'bbb'.y }", 'inheritance-extend')
            m2 = makeGrammar("G2 <: G1 { foo += '111'.x '222'.y }", 'inheritance-extend')
          }
        })

        it("to recipe and back", function() {
          var m1Prime = eval(m1.toRecipe())(ohm, ohm.namespace('inheritance-extend-prime'))
          m1Prime.namespaceName = 'inheritance-extend'
          expect(m1).toEqual(m1Prime)

          var m2Prime = eval(m2.toRecipe())(ohm, ohm.namespace('inheritance-extend-prime'))
          m2Prime.namespaceName = 'inheritance-extend'
          expect(m2).toEqual(m2Prime)
        })

        it("should check that rule exists in super-grammar", function() {
          console.log('\nNote: the following error message is actually supposed to be there')
          expect(function() {
            makeGrammar("G3 <: G1 { bar += 'bar' }", 'inheritance-extend')
          }).toThrow()
        })

        it("should check that binding names are consistent", function() {
          console.log('\nNote: the following error message is actually supposed to be there')
          expect(function() {
            makeGrammar("G3 <: G1 { foo += '111'.x '222'.z }", 'inheritance-extend')
          }).toThrow()
        })

        it("recognition", function() {
          expect(m1.matchContents('aaabbb', 'foo')).toBeTruthy()
          expect(m1.matchContents('111222', 'foo')).toEqual(false)

          expect(m2.matchContents('aaabbb', 'foo')).toBeTruthy()
          expect(m2.matchContents('111222', 'foo')).toBeTruthy()
        })

        it("semantic actions", function() {
          expect(m2.matchContents('aaabbb', 'foo')({foo: function(x, y) { return [x, y] }})).toEqual(['aaa', 'bbb'])
          expect(m2.matchContents('111222', 'foo')({foo: function(x, y) { return [x, y] }})).toEqual(['111', '222'])
        })
      })
    })

    describe("bindings", function() {
      it("to recipe and back", function() {
        var m = makeGrammar("G { foo == 'a'.x 'b'.y | 'b'.y 'a'.x }")
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("inconsistent bindings in alts are errors", function() {
        console.log('\nNote: the following error message is actually supposed to be there')
        expect(function() {
          makeGrammar("G { foo == 'a'.x | 'b'.y }")
        }).toThrow()
      })

      it("binding order shouldn't matter", function() {
        makeGrammar("G { foo == 'a'.x 'b'.y | 'b'.y 'a'.x }")
      })

      it("semantic action's formals determine evaluation order", function() {
        var g = makeGrammar([
          "G {",
          "  foo == bar.x baz.y",
          "  bar == 'a'",
          "  baz == 'b'",
          "}"])

        var id = 0
        expect(g.matchContents('ab', 'foo')({
          foo: function(x, y) { return {x: x, y: y} },
          bar: function(value) { return ['bar', value, id++] },
          baz: function(value) { return ['baz', value, id++] }
        })).toEqual({x: ['bar', 'a', 0], y: ['baz', 'b', 1]})

        var id = 0
        expect(g.matchContents('ab', 'foo')({
          foo: function(y, x) { return {x: x, y: y} },
          bar: function(value) { return ['bar', value, id++] },
          baz: function(value) { return ['baz', value, id++] }
        })).toEqual({x: ['bar', 'a', 1], y: ['baz', 'b', 0]})
      })
    })

    describe("inline rule declarations", function() {
      var m
      beforeEach(function() {
        m = ohm.makeGrammar(arithmeticGrammarSource)
      })

      it("to recipe and back", function() {
        expect(m).toEqual(eval(m.toRecipe())(ohm))
      })

      it("recognition", function() {
        expect(m.matchContents('1*(2+3)-4/5', 'expr')).toBeTruthy()
      })

      it("semantic actions", function() {
        expect(m.matchContents('10*(2+123)-4/5', 'expr')({
          expr: function(value) { return value },
          addExpr: function(value) { return value },
          'addExpr-plus': function(x, op, y) { return x + y },
          'addExpr-minus': function(x, op, y) { return x - y },
          mulExpr: function(value) { return value },
          'mulExpr-times': function(x, op, y) { return x * y },
          'mulExpr-divide': function(x, op, y) { return x / y },
          priExpr: function(value) { return value },
          'priExpr-paren': function(oparen, e, cparen) { return e },
          number: function(value) { return value },
          'number-rec': function(n, d) { return n * 10 + d },
          digit: function(value) { return value.charCodeAt(0) - '0'.charCodeAt(0) }
        })).toEqual(1249.2)
      })

      it("can't override/replace existing inline rule", function() {
        console.log('\nNote: the following error message is actually supposed to be there')
        ohm.namespace('inlineRuleTest1').install('M', m)
        expect(function() {
          makeGrammar("N <: M { addExpr += addExpr.x '~' mulExpr.y {minus} }", 'inlineRuleTest1')
        }).toThrow()
      })
    })

    describe("lexical vs. syntactic rules", function() {
      it("lexical rules don't skip spaces implicitly", function() {
        var g = makeGrammar("G { start == 'foo' 'bar' }")
        expect(g.matchContents('foobar', 'start')).toBeTruthy()
        expect(g.matchContents('foo bar', 'start')).toEqual(false)
        expect(g.matchContents(' foo bar   ', 'start')).toEqual(false)
      })

      it("syntactic rules skip spaces implicitly", function() {
        var g = makeGrammar("G { Start == 'foo' 'bar' }")
        expect(g.matchContents('foobar', 'Start')).toBeTruthy()
        expect(g.matchContents('foo bar', 'Start')).toBeTruthy()
        expect(g.matchContents(' foo bar   ', 'Start')).toBeTruthy()
      })

      it("mixing lexical and syntactic rules works as expected", function() {
        var g = makeGrammar([
          "G {",
          "  foo == 'foo'",
          "  bar == 'bar'",
          "  Start == foo bar",
          "}"])
        expect(g.matchContents('foobar', 'Start')).toBeTruthy()
        expect(g.matchContents('foo bar', 'Start')).toBeTruthy()
        expect(g.matchContents(' foo bar   ', 'Start')).toBeTruthy()
      })
    })

    describe("namespaces", function() {
      describe("install", function() {
        var ns1
        var ns2
        beforeEach(function() {
           ns1 = ohm.namespace('ns1')
           ns2 = ohm.namespace('ns2')
        })

        it("actually installs a grammar in a namespace", function() {
          var m = ohm.makeGrammar("aaa { foo == 'foo' }", ns1)
          expect(ns1.getGrammar('aaa')).toEqual(m)
          expect(m.matchContents('foo', 'foo')).toBeTruthy()
        })

        it("detects duplicates", function() {
          console.log('\nNote: the following error message is actually supposed to be there')
          expect(function() {
            ohm.makeGrammar("ccc { foo == 'foo' }", ns1)
            ohm.makeGrammar("ccc { bar == 'bar' }", ns1)
          }).toThrow()
        })

        it("allows same-name grammars to be installed in different namespaces", function() {
          var m1 = ohm.makeGrammar("bbb { foo == 'foo' }", ns1)
          var m2 = ohm.makeGrammar("bbb { bar == 'bar' }", ns2)

          expect(ns1.getGrammar('bbb')).toEqual(m1)
          expect(ns2.getGrammar('bbb')).toEqual(m2)
          expect(m1 !== m2).toBeTruthy()
        })
      })
    })

    describe("script tag support", function() {
      describe("loadGrammarsFromScriptElement", function() {
        var scriptTag
        beforeEach(function() {
          scriptTag = {
            type: 'text/ohm-js',
            innerHTML: [
              "O {",
              "  number == number.n digit.d {rec}",
              "          | digit",
              "}"
            ].join('\n')
          }
        })

        it("recognition", function() {
          var ns = ohm.namespace('aaa1')
          ns.loadGrammarsFromScriptElement(scriptTag)
          expect(function() {
            console.log('\nNote: the following error message is actually supposed to be there')
            ns.getGrammar('M')
          }).toThrow()
          expect(function() {
            console.log('\nNote: the following error message is actually supposed to be there')
            ns.getGrammar('N')
          }).toThrow()
          expect(ns.getGrammar('O')).toBeTruthy()
          expect(ns.getGrammar('O').matchContents('1234', 'number')).toBeTruthy()
        })

        it("semantic actions", function() {
          var ns = ohm.namespace('aaa2')
          ns.loadGrammarsFromScriptElement(scriptTag)
          var m = ns.getGrammar('O')
          expect(m).toBeTruthy()
          expect(m.matchContents('1234', 'number')({
            number: function(value) { return value },
            'number-rec': function(n, d) { return n * 10 + d },
            digit: function(value) { return value.charCodeAt(0) - '0'.charCodeAt(0) }
          })).toEqual(1234)
        })
      })
    })

    describe("bootstrap", function() {
      var g
      beforeEach(function() {
        g = g || makeGrammar(ohmGrammarSource, 'bootstrap')
      })

      it("can recognize arithmetic grammar", function() {
        expect(g.matchContents(arithmeticGrammarSource, 'Grammar')).toBeTruthy()
      })

      it("can recognize itself", function() {
        expect(g.matchContents(ohmGrammarSource, 'Grammar')).toBeTruthy()
      })

      it("can produce a grammar that will recognize itself", function() {
        var gPrime = g.matchContents(ohmGrammarSource, 'Grammar')(ohm._makeGrammarActionDict())
        expect(gPrime.matchContents(ohmGrammarSource, 'Grammar')).toBeTruthy()
      })

      it("can produce a grammar that works", function() {
        var gPrime = g.matchContents(ohmGrammarSource, 'Grammar')(ohm._makeGrammarActionDict())
        var a = gPrime.matchContents(arithmeticGrammarSource, 'Grammar')(ohm._makeGrammarActionDict())
        expect(a.matchContents('10*(2+123)-4/5', 'expr')({
          expr: function(value) { return value },
          addExpr: function(value) { return value },
          'addExpr-plus': function(x, op, y) { return x + y },
          'addExpr-minus': function(x, op, y) { return x - y },
          mulExpr: function(value) { return value },
          'mulExpr-times': function(x, op, y) { return x * y },
          'mulExpr-divide': function(x, op, y) { return x / y },
          priExpr: function(value) { return value },
          'priExpr-paren': function(oparen, e, cparen) { return e },
          number: function(value) { return value },
          'number-rec': function(n, d) { return n * 10 + d },
          digit: function(value) { return value.charCodeAt(0) - '0'.charCodeAt(0) }
        })).toEqual(1249.2)
      })

      it("full bootstrap!", function() {
        var gPrime = g.matchContents(ohmGrammarSource, 'Grammar')(ohm._makeGrammarActionDict())
        var gPrimePrime = gPrime.matchContents(ohmGrammarSource, 'Grammar')(ohm._makeGrammarActionDict())
        expect(gPrime).toEqual(gPrimePrime)
      })

      it("to recipe and back", function() {
        // TODO: replace this w/ proper unit tests for toRecipe() -- make sure there is at least one test for
        // grammar inheritance.
        var gPrime = g.matchContents(ohmGrammarSource, 'Grammar')(ohm._makeGrammarActionDict())
        expect(eval(gPrime.toRecipe())(ohm)).toEqual(gPrime)
      })
    })
  })
})

