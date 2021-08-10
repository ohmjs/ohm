'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const fs = require('fs');
const test = require('ava');

const ohm = require('..');
const testUtil = require('./helpers/testUtil');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

const arithmeticGrammarSource = fs.readFileSync('test/arithmetic.ohm').toString();

const passThroughOp = ls => ls.children.map(c => c.op());

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

test('operations', t => {
  const Arithmetic = ohm.grammar(arithmeticGrammarSource);
  const s = Arithmetic.createSemantics();

  // An operation that evaluates an expression
  s.addOperation('value', {
    addExp_plus(x, op, y) {
      return x.value() + y.value();
    },
    mulExp_times(x, op, y) {
      return x.value() * y.value();
    },
    number_rec(n, d) {
      return n.value() * 10 + d.value();
    },
    digit(_) {
      return this.sourceString.charCodeAt(0) - '0'.charCodeAt(0);
    }
  });

  t.is(s(Arithmetic.match('1+2')).value(), 3, 'single addExp');
  t.is(s(Arithmetic.match('13+10*2*3')).value(), 73, 'more complicated case');

  // An operation that produces a list of the values of all the numbers in the tree.
  s.addOperation('numberValues', {
    addExp_plus(x, op, y) {
      return x.numberValues().concat(y.numberValues());
    },
    mulExp_times(x, op, y) {
      return x.numberValues().concat(y.numberValues());
    },
    number(n) {
      return [n.value()];
    },
    digit(d) {
      return this.sourceString;
    }
  });
  t.deepEqual(s(Arithmetic.match('9')).numberValues(), [9]);
  t.deepEqual(s(Arithmetic.match('13+10*2*3')).numberValues(), [13, 10, 2, 3]);

  // An operation that (like the others above) doesn't take any arguments.
  s.addOperation('noArgs', {
    addExp_plus(x, op, y) {
      return x.noArgs() + y.noArgs();
    },
    mulExp_times(x, op, y) {
      return x.noArgs(1); // should result in an error
    },
    number(n) {
      return '#';
    }
  });
  t.is(s(Arithmetic.match('1+2')).noArgs(), '##');
  t.throws(
      () => {
        s(Arithmetic.match('1*2')).noArgs();
      },
      {
        message: 'Invalid number of arguments passed to noArgs operation (expected 0, got 1)'
      }
  );

  // An operation that failed checks when first added but then succeeds
  t.throws(
      () => {
        s.addOperation('failSuccess', {
          exp() {}
        });
      },
      {message: /wrong arity/}
  );
  t.falsy(s(Arithmetic.match('1+2')).failSuccess, 'failed operation not added');
  s.addOperation('failSuccess', {
    exp(arg) {
      return arg.value();
    }
  });
  t.truthy(s(Arithmetic.match('1+2')).failSuccess, 'operation added successfully');
  t.is(s(Arithmetic.match('1+2')).failSuccess(), 3, 'corrected operation');
});

test('operations with arguments', t => {
  const Arithmetic = ohm.grammar(arithmeticGrammarSource);
  const s = Arithmetic.createSemantics();

  s.addOperation('op1(level)', {
    number(n) {
      return this.sourceString + '@L' + this.args.level;
    },
    _default(children) {
      let ans = [];
      children.forEach(child => {
        ans = ans.concat(child.op1(this.args.level + 1));
      });
      return ans;
    }
  });
  t.deepEqual(s(Arithmetic.match('1+2*3')).op1(0), ['1@L6', '2@L7', '3@L6']);
  t.throws(
      () => {
        s(Arithmetic.match('(5)-2')).op1();
      },
      {
        message: 'Invalid number of arguments passed to op1 operation (expected 1, got 0)'
      }
  );
  t.throws(
      () => {
        s(Arithmetic.match('(5)-2')).op1(1, 2);
      },
      {
        message: 'Invalid number of arguments passed to op1 operation (expected 1, got 2)'
      }
  );

  s.addOperation('op2(a, b)', {
    number(n) {
      return this.args.a * 100 + this.args.b * 10 + parseInt(this.sourceString);
    }
  });
  t.throws(
      () => {
        s(Arithmetic.match('(5)-2')).op2();
      },
      {
        message: 'Invalid number of arguments passed to op2 operation (expected 2, got 0)'
      }
  );
  t.throws(
      () => {
        s(Arithmetic.match('(5)-2')).op2(1);
      },
      {message: 'Invalid number of arguments passed to op2 operation (expected 2, got 1)'}
  );
  t.is(s(Arithmetic.match('3')).op2(1, 2), 123);
  t.throws(
      () => {
        s(Arithmetic.match('(5)-2')).op1(1, 2, 3);
      },
      {
        message: 'Invalid number of arguments passed to op1 operation (expected 1, got 3)'
      }
  );

  s.addOperation('op3(foo, bar, baz)', {
    _default(children) {
      const oldArgs = this.args;
      this.op1(0);
      t.deepEqual(
          this.args,
          oldArgs,
          "make sure that calling other operations doesn't clobber the arguments of the caller"
      );
    }
  });
  s(Arithmetic.match('(5)-2')).op3(1, 2, 3);
});

test('attributes', t => {
  const Arithmetic = ohm.grammar(arithmeticGrammarSource);
  let count = 0;
  const s = Arithmetic.createSemantics().addAttribute('value', {
    addExp_plus(x, op, y) {
      count++;
      return x.value + y.value;
    },
    mulExp_times(x, op, y) {
      count++;
      return x.value * y.value;
    },
    number_rec(n, d) {
      count++;
      return n.value * 10 + d.value;
    },
    digit(expr) {
      count++;
      return expr.value.charCodeAt(0) - '0'.charCodeAt(0);
    },
    _terminal() {
      count++;
      return this.sourceString;
    }
  });

  const simple = Arithmetic.match('1+2');
  const complicated = Arithmetic.match('13+10*2*3');

  t.is(s(simple).value, 3, 'single addExp');
  t.is(s(complicated).value, 73, 'more complicated case');

  // Check that attributes are memoized
  const oldCount = count;
  t.is(s(simple).value, 3);
  t.is(s(complicated).value, 73);
  t.is(count, oldCount);

  // Remove memoized attributes
  s(simple)._forgetMemoizedResultFor('value');
  s(complicated)._forgetMemoizedResultFor('value');

  // Change the action function for `addExp_plus`
  s._getActionDict('value').addExp_plus = function(x, op, y) {
    return 1 + x.value + y.value;
  };

  t.is(s(simple).value, 4, 'new value for single addExp');
  t.is(s(complicated).value, 74, 'new value for more complicated case');

  t.throws(
      () => {
        s._getActionDict('eval');
      },
      {
        message:
        '"eval" is not a valid operation or attribute name in this semantics for "Arithmetic"'
      }
  );

  t.throws(
      () => {
        Arithmetic.createSemantics().addAttribute('badAttribute(x, y)', {});
      },
      {message: /Expected end of input/},
      'attributes are not allowed to have arguments'
  );
});

test("attributes - same-named attributes don't collide", t => {
  const g = ohm.grammar('G { start = }');
  const s1 = g.createSemantics();
  const s2 = g.createSemantics();

  let val = 1;
  s1.addAttribute('attr', {
    start() {
      return val++;
    }
  });
  s2.addAttribute('attr', {
    start() {
      return val++;
    }
  });

  const m = g.match('');
  t.is(s1(m).attr, 1);
  t.is(s2(m).attr, 2);

  t.is(s1(m).attr, 1, 's1.attr is memoized');
  t.is(s2(m).attr, 2, 's2.attr is memoized');
});

test('semantics', t => {
  const Arithmetic = ohm.grammar(arithmeticGrammarSource);
  const s = Arithmetic.createSemantics();

  t.is(s.addOperation('op', {}), s, 'addOperation returns the receiver');
  t.is(s.addAttribute('attr', {}), s, 'addAttribute returns the receiver');

  t.is(s.addOperation('op2', {}), s, 'can add more than one operation');
  t.is(s.addAttribute('attr2', {}), s, 'can add more than one attribute');

  t.throws(
      () => {
        s.addOperation('op', {});
      },
      {message: /already exists/},
      'addOperation throws when name is already used'
  );
  t.throws(
      () => {
        s.addOperation('attr', {});
      },
      {message: /already exists/},
      'addOperation throws when name is already used, even if it is an attribute'
  );

  t.throws(
      () => {
        s.addAttribute('attr', {});
      },
      {message: /already exists/},
      'addAttribute throws when name is already used'
  );
  t.throws(
      () => {
        s.addAttribute('attr', {});
      },
      {message: /already exists/},
      'addAttribute throws when name is already used, even if it is an operation'
  );

  t.throws(
      () => {
        s(null);
      },
      {message: /expected a MatchResult/}
  );
  t.throws(
      () => {
        s(false);
      },
      {message: /expected a MatchResult/}
  );
  t.throws(
      () => {
        s();
      },
      {message: /expected a MatchResult/}
  );
  t.throws(
      () => {
        s(3);
      },
      {message: /expected a MatchResult/}
  );
  t.throws(
      () => {
        s('asdf');
      },
      {message: /expected a MatchResult/}
  );
  t.throws(
      () => {
        s(Arithmetic.match('barf'));
      },
      {message: /cannot apply Semantics to \[match failed at position 0\]/},
      'throws when arg is a MatchFailure'
  );

  // Cannot use the semantics on nodes from another grammar...
  let g = ohm.grammar('G {}');
  t.throws(
      () => {
        s(g.match('a', 'letter'));
      },
      {message: /Cannot use a MatchResult from grammar/}
  );
  // ... even if it's a sub-grammar
  g = ohm.grammar('Arithmetic2 <: Arithmetic {}', {Arithmetic});
  t.throws(
      () => {
        s(g.match('1+2', 'exp'));
      },
      {message: /Cannot use a MatchResult from grammar/}
  );
});

test('_iter nodes', t => {
  const g = testUtil.makeGrammar([
    'G {',
    '  letters = letter*',
    '  optLetter = letter?',
    '  ident = letter+',
    '}'
  ]);
  let s = g.createSemantics().addOperation('op', {
    letters: passThroughOp,
    letter(l) {
      return l.sourceString;
    }
  });

  const m = g.match('abc', 'letters');
  t.deepEqual(s(m).op(), ['a', 'b', 'c'], 'operations are mapped over children');

  s = g.createSemantics().addOperation('op', {
    letters: passThroughOp,
    letter(l) {
      return l.sourceString;
    }
  });
  t.deepEqual(
      s(m).op(),
      ['a', 'b', 'c'],
      'works with pass-through default behavior of _nonterminal'
  );

  s = g.createSemantics().addOperation('op', {
    letters(ls) {
      t.is(ls.ctorName, '_iter', '`ls` is an _iter node');
      t.truthy(ls.isIteration(), '`ls.isIteration()` returns a truthy value');
      t.is(typeof ls.op, 'function', '`ls` has an op() method');
      t.truthy(
          ls.children.every(l => typeof l.op === 'function'),
          'children is an array of wrappers'
      );
      return ls.children.map(l => l.op()).join(',');
    },
    letter(l) {
      return l.sourceString;
    }
  });
  t.is(s(m).op(), 'a,b,c');

  const m2 = g.match('', 'optLetter');
  const m3 = g.match('ab', 'ident');
  s = g.createSemantics().addOperation('op', {
    letters(ls) {
      return ls.isOptional();
    },
    optLetter(ls) {
      return ls.isOptional();
    },
    ident(ls) {
      return ls.isOptional();
    }
  });
  t.falsy(s(m).op(), '`ls` should NOT be optional for *');
  t.truthy(s(m2).op(), '`ls` should be optional for ?');
  t.falsy(s(m3).op(), '`ls` should NOT be optional for +');
});

test('_terminal nodes', t => {
  const g = ohm.grammar('G { letters = letter* }');
  let s = g.createSemantics().addOperation('op', {
    letters: passThroughOp
  });
  const m = g.match('abc', 'letters');

  t.throws(
      () => {
        const s = g.createSemantics().addOperation('op', {
          letters: passThroughOp
        });
        s(m).op();
      },
      {message: /Missing semantic action for '_terminal'/}
  );

  t.throws(
      () => {
        g.createSemantics().addOperation('op', {
          letters: passThroughOp,
          _terminal(x) {}
        });
      },
      {message: /wrong arity/}
  );

  s = g.createSemantics().addOperation('op', {
    letters: passThroughOp,
    _terminal() {
      t.is(arguments.length, 0, 'there are no arguments');
      t.is(this.ctorName, '_terminal');
      t.is(this.children.length, 0, 'node has no children');
      return this.sourceString;
    }
  });
  t.deepEqual(s(m).op(), ['a', 'b', 'c']);
});

test('semantic action arity checks', t => {
  let g = ohm.grammar('G {}');
  function makeOperation(grammar, actions) {
    return grammar.createSemantics().addOperation('op' + testUtil.uniqueId(), actions);
  }
  function ignore0() {}
  function ignore1(a) {}
  function ignore2(a, b) {}

  t.truthy(makeOperation(g, {}), 'empty actions with empty grammar');
  t.throws(
      () => {
        makeOperation(g, {foo: null});
      },
      {message: /not a valid semantic action/},
      'superfluous action dictionary keys are not allowed'
  );

  t.throws(
      () => {
        makeOperation(g, {_nonterminal: ignore0});
      },
      {message: /arity/},
      '_nonterminal is checked'
  );
  t.truthy(makeOperation(g, {_nonterminal: ignore1}), '_nonterminal works with one arg');

  t.throws(
      () => {
        makeOperation(g, {_terminal: ignore1});
      },
      {message: /arity/},
      '_terminal is checked'
  );
  t.truthy(makeOperation(g, {_terminal: ignore0}), '_terminal works with no args');

  t.throws(
      () => {
        makeOperation(g, {letter: ignore0});
      },
      {message: /arity/},
      'built-in rules are checked'
  );
  t.truthy(makeOperation(g, {letter: ignore1}), 'letter works with one arg');

  g = testUtil.makeGrammar(['G {', '  one = two', '  two = "2" letter', '}']);
  t.truthy(makeOperation(g, {one: ignore1, two: ignore2}));

  t.throws(
      () => {
        makeOperation(g, {one: ignore0, two: ignore2});
      },
      {message: /wrong arity/},
      "'one', is checked"
  );
  t.throws(
      () => {
        makeOperation(g, {one: ignore1, two: ignore0});
      },
      {message: /wrong arity/},
      "'two' is checked"
  );

  const g2 = ohm.grammar('G2 <: G {}', {G: g});
  t.throws(
      () => {
        makeOperation(g2, {one: ignore2});
      },
      {message: /wrong arity/},
      'supergrammar rules are checked'
  );
  t.truthy(makeOperation(g2, {one: ignore1}), 'works with one arg');

  const g3 = ohm.grammar('G3 <: G { one := "now" "two" }', {G: g});
  t.throws(
      () => {
        makeOperation(g3, {one: ignore1});
      },
      {message: /wrong arity/},
      'changing arity in an overridden rule'
  );
  t.truthy(makeOperation(g3, {one: ignore2}));
});

test('extending semantics', t => {
  const ns = testUtil.makeGrammars([
    'G { ',
    '  one = "one"',
    '  two = "two"',
    '}',
    'G2 <: G {',
    '  one := "eins" "!"',
    '  three = "drei"',
    '}',
    'G3 <: G2 { }',
    'G4 { }'
  ]);

  // Make sure operations behave as expected

  let s = ns.G.createSemantics()
      .addOperation('value', {
        one(_) {
          return 1;
        },
        two(_) {
          return 2;
        }
      })
      .addOperation('valueTimesTwo', {
        _nonterminal(children) {
          return this.value() * 2;
        }
      });
  t.throws(
      () => {
        ns.G2.extendSemantics(s).addOperation('value', {});
      },
      {message: /already exists/}
  );
  t.throws(
      () => {
        ns.G2.extendSemantics(s).extendOperation('foo', {});
      },
      {message: /did not inherit/}
  );
  t.throws(
      () => {
        ns.G.createSemantics().extendOperation('value', {});
      },
      {message: /did not inherit/}
  );
  t.truthy(ns.G3.extendSemantics(s));
  t.throws(
      () => {
        ns.G4.extendSemantics(s);
      },
      {message: /not a sub-grammar/}
  );

  t.throws(
      () => {
        ns.G2.extendSemantics(s).extendOperation('value', {});
      },
      {message: /wrong arity/}
  );
  // If there is an arity mismatch due to overriding and we don't explicitly extend the operation /
  // attribute, we should catch this error when the derived semantics is applied to its first
  // CST node.
  t.throws(
      () => {
        ns.G2.extendSemantics(s)(ns.G2.match('eins!', 'one'));
      },
      {message: /wrong arity/}
  );

  let s2 = ns.G2.extendSemantics(s).extendOperation('value', {
    one(str, _) {
      return 21;
    }, // overriding
    three(str) {
      return 3;
    } // adding a new case
  });
  let m = ns.G2.match('eins!', 'one');
  t.is(s2(m).value(), 21);
  t.is(s2(m).valueTimesTwo(), 42);

  m = ns.G2.match('two', 'two');
  t.is(s2(m).value(), 2);
  t.is(s2(m).valueTimesTwo(), 4);

  m = ns.G2.match('drei', 'three');
  t.is(s2(m).value(), 3);
  t.is(s2(m).valueTimesTwo(), 6);

  // Make sure you can't extend the same operation again
  t.throws(
      () => {
        s2.extendOperation('value', {});
      },
      {message: /again/}
  );

  // Make sure you can't specify arguments when you extend an operation
  t.throws(
      () => {
        s2.extendOperation('value(x)', {});
      },
      {message: /Expected end of input/}
  );

  // Make sure attributes behave as expected

  s = ns.G.createSemantics()
      .addAttribute('value', {
        one(_) {
          return 1;
        },
        two(_) {
          return 2;
        }
      })
      .addAttribute('valueTimesTwo', {
        _nonterminal(children) {
          return this.value * 2;
        }
      });
  t.throws(
      () => {
        ns.G2.extendSemantics(s).addAttribute('value', {});
      },
      {message: /already exists/}
  );
  t.throws(
      () => {
        ns.G2.extendSemantics(s).extendAttribute('value', {});
      },
      {message: /wrong arity/}
  );
  t.throws(
      () => {
        ns.G2.extendSemantics(s).extendAttribute('foo', {});
      },
      {message: /did not inherit/}
  );
  t.throws(
      () => {
        ns.G.createSemantics().extendAttribute('value', {});
      },
      {message: /did not inherit/}
  );

  s2 = ns.G2.extendSemantics(s).extendAttribute('value', {
    one(str, _) {
      return 21;
    }, // overriding
    three(str) {
      return 3;
    } // adding a new case
  });
  m = ns.G2.match('eins!', 'one');
  t.is(s2(m).value, 21);
  t.is(s2(m).valueTimesTwo, 42);

  m = ns.G2.match('two', 'two');
  t.is(s2(m).value, 2);
  t.is(s2(m).valueTimesTwo, 4);

  m = ns.G2.match('drei', 'three');
  t.is(s2(m).value, 3);
  t.is(s2(m).valueTimesTwo, 6);

  // Make sure you can't extend the same attribute again
  t.throws(
      () => {
        s2.extendAttribute('value', {});
      },
      {message: /again/}
  );

  // Make sure an attribute that was inherited from a parent semantics
  // does not share its memo table with its parent.
  const s3 = ns.G2.extendSemantics(s2).extendAttribute('value', {
    one(str, _) {
      return 123;
    }
  });
  m = ns.G2.match('eins!', 'one');
  t.is(s2(m).value, 21);
  t.is(s2(m).valueTimesTwo, 42);
  t.is(s3(m).value, 123);
  t.is(s3(m).valueTimesTwo, 246);

  // Make sure you can't specify arguments when you extend an attribute
  t.throws(
      () => {
        s2.extendAttribute('value(x)', {});
      },
      {message: /Expected end of input/}
  );

  // Make sure that semantics from the same grammar source are considered compatible.
  const arith1 = ohm.grammar(arithmeticGrammarSource);
  const arith2 = ohm.grammar(arithmeticGrammarSource);
  t.truthy(arith2.extendSemantics(arith1.createSemantics()));
});

test('mixing nodes from one grammar with semantics from another', t => {
  const ns = testUtil.makeGrammars([
    'G {',
    '  start = "aaa"',
    '}',
    'GPrime <: G {',
    '  start := "bbb"',
    '}',
    'Unrelated {',
    '  start = "asdf"',
    '}'
  ]);

  const s = ns.G.createSemantics().addOperation('value', {
    start(x) {
      return x.value() + 'choo!';
    },
    _terminal() {
      return this.sourceString;
    }
  });

  let m = ns.G.match('aaa', 'start');
  t.is(s(m).value(), 'aaachoo!');

  m = ns.GPrime.match('bbb', 'start');
  t.throws(
      () => {
        s(m).value();
      },
      {message: /Cannot use a MatchResult from grammar/}
  );

  m = ns.Unrelated.match('asdf', 'start');
  t.throws(
      () => {
        s(m).value();
      },
      {message: /Cannot use a MatchResult from grammar/}
  );
});

test('asIteration', t => {
  const g = testUtil.makeGrammar([
    'G {',
    '  Start = ListOf<letter, ","> listOf<any, ".">',
    '  anyTwo = any any',
    '  anyThree = any any any',
    '}'
  ]);
  const s = g.createSemantics().addAttribute('value', {
    Start(list1, list2) {
      const arr1 = list1.asIteration().children.map(c => c.value);
      const arr2 = list2.asIteration().children.map(c => c.value);
      return arr1.join('') + arr2.join('');
    },
    letter(_) {
      return this.sourceString;
    },
    any(_) {
      return this.sourceString;
    }
  });
  t.is(s(g.match('a, b, c')).value, 'abc', 'one nonempty, one empty');
  t.is(s(g.match('a, b, c 1.2.3')).value, 'abc123', 'baby you and me');
  t.is(s(g.match('')).value, '', 'both empty');

  // Check that we can override asIteration for ListOf, and extend it with an action
  // for a rule of our own.
  s.extendOperation('asIteration', {
    NonemptyListOf(first, _, rest) {
      return this.iteration([first].concat(rest.children).reverse());
    },
    anyTwo(a, b) {
      return this.iteration([b, a]);
    }
  });
  s.addAttribute('reversedValue', {
    anyTwo(a, b) {
      const arr = this.asIteration().children.map(c => c.value);
      return arr.join('');
    }
  });
  t.is(s(g.match('a, b, c')).value, 'cba', 'overriding works');
  t.is(s(g.match('z9', 'anyTwo')).reversedValue, '9z');

  t.throws(
      () => {
        s.addAttribute('asIteration', {});
      },
      {message: /already exists/}
  );
  t.throws(
      () => {
        s.addOperation('asIteration', {});
      },
      {message: /already exists/}
  );
  t.throws(
      () => {
        s(g.match('xxx', 'anyThree')).asIteration(); // eslint-disable-line no-unused-expressions
      },
      {message: /Missing semantic action/}
  );
});

test('sourceString', t => {
  const g = ohm.grammar('G { Start = "a" "b"* }');

  // An operation that calls `sourceString` on a nonterminal, terminal, and iter node.
  const s = g.createSemantics().addOperation('foo', {
    Start(a, bs) {
      return this.sourceString + a.sourceString + bs.sourceString;
    }
  });
  t.is(s(g.match('abb')).foo(), 'abbabb');
});

// https://github.com/harc/ohm/issues/188
test('sourceString - issue #188', t => {
  const g = testUtil.makeGrammar(['G {', '  Start = num num', '  num = digit+', '}']);
  const s = g.createSemantics().addOperation('origSource', {
    Start(a, b) {
      return a.origSource() + b.origSource();
    },
    num(digits) {
      return digits.sourceString;
    }
  });
  t.is(s(g.match('1 22')).origSource(), '122');
});

// https://github.com/harc/ohm/issues/204
test('sourceString - issue #204', t => {
  const g = ohm.grammar('Mu{ List = NonemptyListOf<Item, ","> Item = alnum+ }');
  const s = g.createSemantics().addOperation('eval()', {
    NonemptyListOf(x, _, xs) {
      return [x.eval()].concat(xs.children.map(c => c.eval()));
    },
    Item(value) {
      return value.sourceString;
    }
  });
  const m = g.match('Aloha, Hi');
  t.deepEqual(s(m).eval(), ['Aloha', 'Hi']);
});

test('action call stacks', t => {
  const g = ohm.grammar('G { start = digit }');
  const s = g.createSemantics().addOperation('oops', {});

  let err;
  try {
    s(g.match('9')).oops();
  } catch (e) {
    err = e;
  }
  t.is(
      err.message,
      [
        "Missing semantic action for '_terminal' in operation 'oops'.",
        'Action stack (most recent call last):',
        "  oops > default action for 'start'",
        "  oops > default action for 'digit'",
        '  oops > _terminal'
      ].join('\n')
  );

  s.addOperation('op2', {
    start(d) {
      return d.oops();
    }
  });
  try {
    s(g.match('9')).op2();
  } catch (e) {
    err = e;
  }
  t.is(
      err.message,
      [
        "Missing semantic action for '_terminal' in operation 'oops'.",
        'Action stack (most recent call last):',
        '  op2 > start',
        "  oops > default action for 'digit'",
        '  oops > _terminal'
      ].join('\n')
  );
});
