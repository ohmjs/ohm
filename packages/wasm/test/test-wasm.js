import test from 'ava';
import assert from 'node:assert/strict';
import * as fc from 'fast-check';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {Compiler, ConstantsForTesting as Constants} from '../src/Compiler.js';
import {matchWithInput, unparse, toWasmGrammar} from './_helpers.js';

const SIZEOF_UINT32 = 4;

function checkNotNull(x, msg = 'unexpected null value') {
  if (x == null) throw new Error(msg);
  return x;
}

function memoTableViewForTesting(m) {
  const {buffer} = m._instance.exports.memory;
  return new DataView(buffer, Constants.MEMO_START_OFFSET);
}

test('input in memory', async t => {
  const g = ohm.grammar('G { start = "x" }');
  const wasmGrammar = await toWasmGrammar(g);
  wasmGrammar.match('ohm'); // Trigger fillInputBuffer

  const view = new DataView(wasmGrammar._instance.exports.memory.buffer, 64 * 1024);
  t.is(view.getUint8(0), 'ohm'.charCodeAt(0));
  t.is(view.getUint8(1), 'ohm'.charCodeAt(1));
  t.is(view.getUint8(2), 'ohm'.charCodeAt(2));
});

test('cst returns', async t => {
  let g = await toWasmGrammar(ohm.grammar('G { start = "a" | "b" }'));

  // start
  t.is(matchWithInput(g, 'a'), 1);
  let root = g.getCstRoot();

  t.is(root.children.length, 1);
  t.is(root.matchLength, 1);
  t.is(root.ruleName, 'start');

  // "a"
  let term = root.children[0];
  t.is(term.children.length, 0);
  t.is(term.matchLength, 1);
  t.is(term._typeAndDetails, 1);
  t.true(term.isTerminal());

  g = await toWasmGrammar(ohm.grammar('G { start = "a" b\nb = "b" }'));

  // start
  t.is(matchWithInput(g, 'ab'), 1);
  root = g.getCstRoot();
  t.is(root.children.length, 2);
  t.is(root.matchLength, 2);
  t.is(root.ruleName, 'start');

  // "a"
  const [childA, childB] = root.children;
  t.is(childA.children.length, 0);
  t.is(childA.matchLength, 1);
  t.true(childA.isTerminal());

  // NonterminalNode for b
  t.is(childB.children.length, 1);
  t.is(childB.matchLength, 1);
  t.is(childB.ruleName, 'b');

  // TerminalNode for "b"
  term = childB.children[0];
  t.is(term.children.length, 0);
  t.is(term.matchLength, 1);
  t.true(term.isTerminal());
  t.is(term.ctorName, '_terminal');
});

test('cst with lookahead', async t => {
  const g = await toWasmGrammar(ohm.grammar('G {x = ~space any}'));
  const input = 'a';
  t.is(matchWithInput(g, input), 1);

  // Currently positive lookahead doesn't bind anything!

  // - apply(x)
  //   - any
  //     - "a"

  // x
  const root = g.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.children.length, 1);
  t.is(root.ruleName, 'x');

  // any
  const {matchLength, ruleName, children} = root.children[0];
  t.is(matchLength, 1);
  t.is(children.length, 1);
  t.is(ruleName, 'any');

  // Terminal
  const term = children[0];
  t.is(term.matchLength, 1);
  t.is(term.children.length, 0);
  t.is(term.isTerminal(), true);
});

test('cst for range', async t => {
  const g = await toWasmGrammar(ohm.grammar('G {x = "a".."z"}'));
  t.is(matchWithInput(g, 'b'), 1);

  // x
  const root = g.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.children.length, 1);
  t.is(root.ruleName, 'x');

  // Terminal

  const term = root.children[0];
  t.is(term.matchLength, 1);
  t.is(term.children.length, 0);
  t.is(term.isTerminal(), true);
});

test('cst for opt', async t => {
  let g = await toWasmGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(g, 'a'), 1);

  // x
  let root = g.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.ruleName, 'x');
  t.is(root.children.length, 1);

  // iter
  let iter = root.children[0];
  t.is(iter.matchLength, 1);
  t.true(iter.isIter());
  t.is(iter.children.length, 1);
  t.is(iter.children[0].isTerminal(), true);
  t.is(iter.children[0].matchLength, 1);

  g = await toWasmGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(g, ''), 1);

  // x

  root = g.getCstRoot();
  t.is(root.matchLength, 0);
  t.is(root.ruleName, 'x');
  t.is(root.children.length, 1);

  // iter

  iter = root.children[0];
  t.is(iter.matchLength, 0);
  t.true(iter.isIter());
  t.is(iter.children.length, 0);
});

test('cst for plus', async t => {
  const g = await toWasmGrammar(ohm.grammar('G {x = "a"+}'));
  t.is(matchWithInput(g, 'a'), 1);

  // x

  const root = g.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.ruleName, 'x');
  t.is(root.children.length, 1);

  // iter

  const iter = root.children[0];
  t.is(iter.matchLength, 1);
  t.true(iter.isIter());
  t.is(iter.children.length, 1);

  t.is(iter.children[0].isTerminal(), true);
  t.is(iter.children[0].matchLength, 1);
});

test('cst with (small) repetition', async t => {
  const g = await toWasmGrammar(ohm.grammar('G {x = "a"*}'));
  t.is(matchWithInput(g, 'aaa'), 1);

  // - apply(start)
  //   - iter
  //     - "a"
  //     - "a"
  //     - "a"

  // start

  const root = g.getCstRoot();
  t.is(root.matchLength, 3);
  t.is(root.children.length, 1);
  t.is(root.ruleName, 'x');

  // iter

  const iter = root.children[0];
  t.is(iter.matchLength, 3);
  t.is(iter.children.length, 3);
  t.true(iter.isIter());

  // Terminal children
  const [childA, childB, childC] = iter.children;
  t.is(childA.isTerminal(), true);
  t.is(childA.matchLength, 1);
  t.is(childB.isTerminal(), true);
  t.is(childB.matchLength, 1);
  t.is(childC.isTerminal(), true);
  t.is(childC.matchLength, 1);
});

test('repetition and lookahead', async t => {
  const g = await toWasmGrammar(ohm.grammar('G {x = (~space any)*}'));
  t.is(matchWithInput(g, 'abc'), 1);
});

test('cst with repetition and lookahead', async t => {
  let g = await toWasmGrammar(ohm.grammar('G {x = (~space any)*}'));
  let input = 'abc';
  t.is(matchWithInput(g, input), 1);

  // x
  const root = g.getCstRoot();
  t.is(root.matchLength, 3);
  t.is(root.children.length, 1);
  t.true(root.isNonterminal());

  // iter
  const iter = root.children[0];
  t.is(iter.matchLength, 3);
  t.is(iter.children.length, 3);
  t.true(iter.isIter());

  const [childA, childB, childC] = iter.children;
  t.is(childA.matchLength, 1);
  t.is(childA.children.length, 1);
  t.true(childA.isNonterminal());
  t.true(childA.children[0].isTerminal());
  t.is(childA.children[0].matchLength, 1);

  t.is(childB.matchLength, 1);
  t.is(childB.children.length, 1);
  t.true(childB.isNonterminal());
  t.true(childB.children[0].isTerminal());
  t.is(childB.children[0].matchLength, 1);

  t.is(childC.matchLength, 1);
  t.is(childC.children.length, 1);
  t.true(childC.isNonterminal());
  t.true(childC.children[0].isTerminal());
  t.is(childC.children[0].matchLength, 1);

  g = await toWasmGrammar(ohm.grammar('G {x = (~space any)+ spaces any+}'));
  input = '/ab xy';
});

test('wasm: one-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
});
test('wasm: multi-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "123"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '123'), 1);
});

test('wasm: handle end', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '123'), 0);
});

test('wasm: choice', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" | "2"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '2'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, '3'), 0);
});

test('wasm: more choice', async t => {
  const g = ohm.grammar(`
    G {
      start = "12" | "13" | "14"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '14'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 1);
  t.is(matchWithInput(wasmGrammar, '15'), 0);
});

test('wasm: sequence', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" "2"
            | "130" ""
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '130'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 0);
});

test('wasm: choice + sequence', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" ("2" | "3")
            | "14" ""
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 1);
  t.is(matchWithInput(wasmGrammar, '14'), 1);
  t.is(matchWithInput(wasmGrammar, '15'), 0);
});

test('wasm: rule application', async t => {
  const g = ohm.grammar(`
    G {
      start = one two -- x
            | three
      one = "1"
      two = "II" | "2"
      three = "3"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '1II'), 1);
  t.is(matchWithInput(wasmGrammar, '3'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 0);
});

test('wasm: star', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"*
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '111'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 1);
  t.is(matchWithInput(wasmGrammar, '2'), 0);

  const g2 = ohm.grammar(`
    G {
      start = "123"* "1"
    }
  `);
  const wasmGrammar2 = await toWasmGrammar(g2);
  t.is(matchWithInput(wasmGrammar2, '1'), 1);
  t.is(matchWithInput(wasmGrammar2, '1231'), 1);
  t.is(matchWithInput(wasmGrammar2, ''), 0);
  t.is(matchWithInput(wasmGrammar2, '2'), 0);
});

test('wasm: plus', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"+
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '111'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);
  t.is(matchWithInput(wasmGrammar, '2'), 0);
});

test('wasm: lookahead', async t => {
  const g = ohm.grammar(`
    G {
      start = &"1" "1"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, '2'), 0);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('wasm: negative lookahead', async t => {
  const g = ohm.grammar(`
    G {
      start = ~"1" "2"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '2'), 1);
  t.is(matchWithInput(wasmGrammar, '12'), 0);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('wasm: opt', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"? "2"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '2'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('wasm: range', async t => {
  const g = ohm.grammar(`
    G {
      start = "a".."z"
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'a'), 1);
  t.is(matchWithInput(wasmGrammar, 'm'), 1);
  t.is(matchWithInput(wasmGrammar, 'z'), 1);
  t.is(matchWithInput(wasmGrammar, 'A'), 0);
  t.is(matchWithInput(wasmGrammar, '1'), 0);
});

test('wasm: any', async t => {
  const g = ohm.grammar('G { start = any }');
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'a'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, ' '), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);

  const g2 = ohm.grammar('G { start = any* }');
  const wasmGrammar2 = await toWasmGrammar(g2);
  t.is(matchWithInput(wasmGrammar2, 'a'), 1);
  t.is(matchWithInput(wasmGrammar2, ''), 1);
});

test('wasm: end', async t => {
  const g = ohm.grammar(`
    G {
      start = "a" end
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'a'), 1);
  t.is(matchWithInput(wasmGrammar, 'ab'), 0);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('real-world grammar', async t => {
  const g = ohm.grammar(String.raw`
    Test {
      Msgs = Msg*
      Msg = description? spaces (Head spaces Params spaces)

      // Required until unicodeLtmo is implemented.
      letter := lower | upper

      description = "#" (~nl any)* nl?
      Head = msgTarget spaces msgName
      msgTarget
        = (~space any)*
      msgName
        = letter (alnum | "_" | "-" | ":" | "." | "+" | "/")*  -- literal
        | templateString                                       -- templateString
        | interpolation                                        -- interpolation
      Params = Param*
      Param = key spaces ":" spaces Json
      Json
        = "{" Param ("," Param)* ","? "}"   -- object1
        | "{" "}"                           -- object0
        | "[" Json ("," Json)* ","? "]"     -- array1
        | "["  "]"                          -- array0
        | string                            -- string
        | templateString                    -- templateString
        | number                            -- number
        | boolean                           -- boolean
        | interpolation                     -- interpolation
      ident = letter (alnum | "_")*
      key = ident | string
      boolean = "true" | "false"
      number
        = digit* "." digit+  -- fract
        | digit+             -- whole
      string = "\"" doubleStringCharacter* "\""
      doubleStringCharacter
        = "\\" any           -- escaped
        | ~"\"" any          -- nonEscaped
      fieldSelector
        = "." ident        -- dot
        | "[" ident "]"    -- bracketIdent
        | "[" number "]"   -- bracketNumber
        | "[" string "]"   -- bracketString
      fieldReference = ident fieldSelector*
      interpolation = "$" "{" fieldReference "}"
      templateString = "\u{0060}" templateStringCharacter* "\u{0060}"
      templateStringCharacter
        = "\\" any           -- escaped
        | interpolation      -- interpolation
        | ~"\u{0060}" any    -- nonEscaped
      comment
        = "//" (~nl any)* nl  -- cppComment
        | "/*" (~"*/" any)* "*/" -- cComment
      empty =
      // space += comment
      nl = "\n"
    }
  `);
  let longInput = '';
  for (let i = 0; i < 200; i++) {
    longInput += '/quickjs eval source: "1 + 1"\n';
  }
  let start = performance.now();
  g.match(longInput);
  t.log(`Ohm match time: ${(performance.now() - start).toFixed(2)}ms`);

  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '/quickjs eval source: "1 + 1"'), 1);
  start = performance.now();
  t.is(matchWithInput(wasmGrammar, longInput), 1);
  t.log(`Wasm match time: ${(performance.now() - start).toFixed(2)}ms`);
});

test('basic memoization', async t => {
  const g = ohm.grammar('G { start = "a" b\nb = "b" }');
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'ab'), 1);

  const view = memoTableViewForTesting(wasmGrammar);

  const getMemo = (pos, ruleName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    const ruleId = checkNotNull(wasmGrammar._ruleIds.get(ruleName));
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleId, true);
  };

  const root = wasmGrammar.getCstRoot();

  // start
  t.is(root.matchLength, 2);
  t.is(root.children.length, 2);
  t.is(root.ctorName, 'start');

  const [childA, childB] = root.children;

  // "a"
  t.true(childA.isTerminal());
  t.is(childA.matchLength, 1);

  // b
  t.is(childB.matchLength, 1);
  t.is(childB.children.length, 1);
  t.is(childB.ctorName, 'b');

  // "b"
  t.true(childB.children[0].isTerminal());
  t.is(childB.children[0].matchLength, 1);

  // Expect memo for `b` at position 1, and `start` at position 0.
  t.is(getMemo(1, 'b'), childB._base);
  t.is(getMemo(0, 'start'), root._base);
});

test('more memoization', async t => {
  const g = ohm.grammar('G { start = b "a" | b b\nb = "b" }');
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'bb'), 1);

  const view = memoTableViewForTesting(wasmGrammar);

  const getMemo = (pos, ruleName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    const ruleId = checkNotNull(wasmGrammar._ruleIds.get(ruleName));
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleId, true);
  };

  // start
  const root = wasmGrammar.getCstRoot();
  t.is(root.matchLength, 2);
  t.is(root.children.length, 2);
  t.is(root.ruleName, 'start');

  const [child1, child2] = root.children;

  // b #1
  t.is(child1.matchLength, 1);
  t.is(child1.children.length, 1);
  t.is(child1.ruleName, 'b');
  t.is(child1.children[0].isTerminal(), true);
  t.is(child1.children[0].matchLength, 1);

  // b #2
  t.is(child2.matchLength, 1);
  t.is(child2.children.length, 1);
  t.is(child2.ruleName, 'b');
  t.is(child2.children[0].isTerminal(), true);
  t.is(child2.children[0].matchLength, 1);

  // Expect memo for `b` at position 0 and 1.
  t.is(getMemo(0, 'b'), child1._base);
  t.is(getMemo(1, 'b'), child2._base);
});

test('parameterized rules (easy)', async t => {
  {
    // Easy: parameter is an Apply.
    const g = ohm.grammar(`
      G {
        start = twice<x>
        x = "x"
        twice<exp> = exp exp
      }`);
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  }
  {
    // Make sure that parameterized applications are not incorrectly memoized.
    const g = ohm.grammar(`
      G {
        start = ~narf<x> narf<y>
        narf<thing> = thing
        x = "x"
        y = "y"

      }`);
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, 'y'), 1);
  }
});

test('parameterized rules (hard)', async t => {
  {
    // Terminal as param, must be lifted.
    const g = ohm.grammar(`
      G {
        start = indirect<"x">
        indirect<e> = twice<e>
        twice<exp> = exp exp
      }`);
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  }
  {
    // What's interesting here? In the body of `narf`:
    // - `(c|b)` will need to be lifted
    // - the params b, c appear out of order
    // - `a` is unused
    const g = ohm.grammar(`
      G {
        start = narf<"x", "y", "z">
        narf<a, b, c> = twice<(c|b)>
        twice<exp> = exp exp
      }`);
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, 'yz'), 1);
  }
  {
    // Parameterized applications as args!
    const g = ohm.grammar(`
      G {
        start = once<reversed<"a", "b", "c">>
              | "cool"
        once<a> = a
        reversed<a, b, c> = c b a
      }`);
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, 'cool'), 1);
  }
  {
    // Same param appearing twice in a lifted expression.
    const g = ohm.grammar(`
      G {
        start = narf<"a">
        narf<exp> = once<(exp | exp)>
        once<a> = a
      }`);
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, 'a'), 1);
  }
});

test('parameterized rules - problematic', async t => {
  // Apply w/ arg that's not a Param from the enclosing scope.
  const g = ohm.grammar(`
      G {
        start = narf<"{", "}">
        narf<open, close> = open twice<digit> close
        twice<exp> = exp exp
      }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '{99}'), 1);
});

test('parameterized rules w/ many params', async t => {
  // Terminal as param, must be lifted.
  const g = ohm.grammar(`
    G {
      start = reversed<"v", "w", "x", "y", "z">
      reversed<a, b, c, d, e> = e d c b a
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'zyxwv'), 1);
});

test('basic left recursion', async t => {
  const g = ohm.grammar(`
    G {
      number = number "1" -- rec
             | "1"
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
});

test('tricky left recursion', async t => {
  const g = ohm.grammar(`
    G {
      number = number "1" -- rec
             | number "2" -- rec2
             | "1"
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(unparse(wasmGrammar), '1');
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(unparse(wasmGrammar), '12');
  t.is(matchWithInput(wasmGrammar, '11212'), 1);
  t.is(unparse(wasmGrammar), '11212');
});

test('tricky left recursion #2', async t => {
  const g = ohm.grammar(`
    G {
      number = number digit -- rec
             | number "2" -- rec2
             | digit
      digit := digit "1" -- rec
             | "1"
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(unparse(wasmGrammar), '1');

  t.is(matchWithInput(wasmGrammar, '11'), 1);
  t.is(unparse(wasmGrammar), '11');

  t.is(matchWithInput(wasmGrammar, '1112111'), 1);
  t.is(unparse(wasmGrammar), '1112111');
});

test('arithmetic', async t => {
  const g = ohm.grammar(`
    Arithmetic {
      addExp = addExp "+" mulExp  -- plus
             | addExp "-" mulExp  -- minus
             | mulExp

      mulExp = mulExp "*" priExp  -- times
             | mulExp "/" priExp  -- divide
             | priExp

      priExp = "(" addExp ")"  -- paren
             | number

      number = number digit  -- rec
             | digit
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '1+276*(3+4)'), 1);
  t.is(unparse(wasmGrammar), '1+276*(3+4)');
  t.is(matchWithInput(wasmGrammar, '1'), 1);
});

test('specialized rule names', t => {
  const g = ohm.grammar(`
    G {
      start = one | two | three

      one = exclaimed<hello> // Simple application
      two = flip<exclaimed<hello2>, hello> // Appl as argument
      three = commaSep<exclaimed<"hello">>

      exclaimed<exp> = exp "!"
      flip<a, b> = b a
      commaSep<exp> = listOf<exp, ",">

      hello = "hello"
      hello2 = "hello"
    }`);

  const compiler = new Compiler(g);
  compiler.normalize();

  const noGeneralizedRulesList = [
    '$spaces',
    'commaSep<exclaimed<$term$0>>',
    'emptyListOf<exclaimed<$term$0>,$term$1>',
    'exclaimed<$term$0>',
    'exclaimed<hello2>',
    'exclaimed<hello>',
    'flip<exclaimed<hello2>,hello>',
    'hello',
    'hello2',
    'listOf<exclaimed<$term$0>,$term$1>',
    'nonemptyListOf<exclaimed<$term$0>,$term$1>',
    'one',
    'space',
    'start',
    'three',
    'two',
  ].sort();
  // When `EMIT_GENERALIZED_RULES = true`, there is a generalized version
  // of each parameterized rule. To make sure this test passes either way,
  // we filter those out.
  const ignored = new Set([
    'commaSep',
    'emptyListOf',
    'exclaimed',
    'flip',
    'listOf',
    'nonemptyListOf',
  ]);
  const keys = [...compiler.rules.keys()].filter(x => !ignored.has(x)).sort();
  t.deepEqual(keys, noGeneralizedRulesList);
});

test('determinism', t => {
  const g = ohm.grammar('G { start = "a" }');
  t.deepEqual(new Compiler(g).compile(), new Compiler(g).compile());
});

test('lifted terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = two<"x"> | one<"y">
      one<t> = t
      two<t> = t t
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  t.is(matchWithInput(wasmGrammar, 'y'), 1);
  t.is(matchWithInput(wasmGrammar, 'yy'), 0);
});

test('basic space skipping', async t => {
  const g = ohm.grammar(`
    G {
      Start = ">" (digit "a".."z")*
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '> 0 a 1 b'), 1);
  t.is(matchWithInput(wasmGrammar, ' > 0 a 1 b '), 1);

  const [term, iter] = wasmGrammar.getCstRoot().children;
  t.is(term.matchLength, 1);
  t.is(iter.matchLength, 8);

  t.deepEqual(
    iter.children.map(c => c.matchLength),
    [1, 1, 1, 1]
  );
});

test('space skipping w/ lifted terminals', async t => {
  // It shouldn't matter that the terminal (as arg) appears in a syntactic
  // context; only the point of use.
  const g = ohm.grammar(`
    G {
      Start = two<"x">
      two<t> = t t
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  t.is(matchWithInput(wasmGrammar, ' xx'), 1);
  t.is(matchWithInput(wasmGrammar, 'x x'), 0);
});

test('space skipping w/ params', async t => {
  // Make sure space is skipped before params in the body of syntactic rule.
  const g = ohm.grammar(`
    G {
      Start = Reversed<(x | "x"), y, "z".."z"> Reversed<z, y, x>
      Reversed<a, b, c> = c b a
      x = "x"
      y = "y"
      z = "z"
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, ' z y x xyz'), 1);
});

test('space skipping & lex', async t => {
  {
    const g = ohm.grammar('G { start = ">" digit+ #(space) }');
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, '> 0 9 '), 0);
  }
  {
    const g = ohm.grammar('G { Start = ">" digit+ #(space) }');
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, '> 0 9 '), 1, "iter doesn't consume trailing space");
  }
  {
    const g = ohm.grammar('G { Start = ">" &digit #(space digit) }');
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, '> 9'), 1, "lookahead doesn't consume anything");
  }
  {
    const g = ohm.grammar('G { Start = ">" ~"x" #(space digit) }');
    const wasmGrammar = await toWasmGrammar(g);
    t.is(matchWithInput(wasmGrammar, '> 9'), 1, "neg lookahead doesn't consume anything");
  }
});

// Because fast-check's `stringMatching` doesn't support unicode regexes.
const arbitraryStringMatching = regex =>
  fc.string({maxLength: 2, unit: 'binary'}).filter(str => regex.test(str));

test('unicode built-ins: non-ASII (fast-check)', async t => {
  const g = ohm.grammar('G { Start = letter letter }');
  const wasmGrammar = await toWasmGrammar(g);
  const hasExpectedResult = wg => {
    return fc.property(arbitraryStringMatching(/^\p{L}\p{L}$/u), str => {
      assert.equal(matchWithInput(wg, str), 1);
    });
  };
  const details = fc.check(hasExpectedResult(wasmGrammar), {
    includeErrorInReport: true,
    interruptAfterTimeLimit: 200,
  });
  t.log(`numRuns: ${details.numRuns}`);
  t.is(details.failed, false, `${fc.defaultReportMessage(details)}`);
});

test('caseInsensitive', async t => {
  // Make sure space is skipped before params in the body of syntactic rule.
  const g = ohm.grammar(`
    G {
      Start = "." caseInsensitive<"blah!">
    }`);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, '.BlaH!'), 1);

  t.is(matchWithInput(wasmGrammar, '. BlaH! '), 1);
  t.is(unparse(wasmGrammar), '. BlaH!'); // Trailing space is lost, who cares.

  t.is(matchWithInput(wasmGrammar, '.BLAH!'), 1);
});

test.failing('unicode', async t => {
  const source = 'Nöö';
  const g = await toWasmGrammar(ohm.grammar('G { Start = any* }'));
  t.is(matchWithInput(g, source), 1);
  t.is(unparse(g), source);
});

test('iter nodes: star w/ 0 matches', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)* }'));
  t.is(matchWithInput(g, ''), 1, 'empty input matches');
  t.is(g.getCstRoot().children.length, 1);
  const iter = g.getCstRoot().children[0];
  t.is(iter.children.length, 0);
});

test('iter nodes: basic map (star)', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)* }'));
  t.is(matchWithInput(g, ''), 1, 'empty input matches');
  t.is(matchWithInput(g, 'a1 b2 c 3'), 1);
  t.is(g.getCstRoot().children.length, 1);
  const iter = g.getCstRoot().children[0];
  t.deepEqual(
    iter.map((letter, digit) => `${digit.sourceString}${letter.sourceString}`),
    ['1a', '2b', '3c']
  );
  t.throws(() => iter.map(() => {}), {message: /bad arity/});
});

test('iter nodes: basic map (plus)', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)+ }'));
  t.is(matchWithInput(g, ''), 0, 'empty input FAILS');
  t.is(matchWithInput(g, 'a1 b2 c 3'), 1);
  t.is(g.getCstRoot().children.length, 1);
  const iter = g.getCstRoot().children[0];
  t.deepEqual(
    iter.map((letter, digit) => `${digit.sourceString}${letter.sourceString}`),
    ['1a', '2b', '3c']
  );
  t.throws(() => iter.map(() => {}), {message: /bad arity/});
});

test('iter nodes: basic map (opt)', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)? }'));
  t.is(matchWithInput(g, ''), 1, 'empty input matches');
  t.is(matchWithInput(g, 'a1'), 1);
  t.is(g.getCstRoot().children.length, 1);
  const iter = g.getCstRoot().children[0];
  t.deepEqual(
    iter.map((letter, digit) => `${digit.sourceString}${letter.sourceString}`),
    ['1a']
  );
  t.throws(() => iter.map(() => {}), {message: /bad arity/});
});
