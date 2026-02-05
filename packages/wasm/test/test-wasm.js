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
  const memoBase = m._instance.exports.memoBase.value;
  return new DataView(buffer, memoBase);
}

test('cst returns', async t => {
  let g = await toWasmGrammar(ohm.grammar('G { start = "a" | "b" }'));

  // start
  t.is(matchWithInput(g, 'a'), 1);
  let root = g.getCstRoot();

  t.is(root.children.length, 1);
  t.is(root.matchLength, 1);
  t.is(root.ctorName, 'start');

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
  t.is(root.ctorName, 'start');

  // "a"
  const [childA, childB] = root.children;
  t.is(childA.children.length, 0);
  t.is(childA.matchLength, 1);
  t.true(childA.isTerminal());

  // NonterminalNode for b
  t.is(childB.children.length, 1);
  t.is(childB.matchLength, 1);
  t.is(childB.ctorName, 'b');

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
  t.is(root.ctorName, 'x');

  // any
  const {matchLength, ctorName, children} = root.children[0];
  t.is(matchLength, 1);
  t.is(children.length, 1);
  t.is(ctorName, 'any');

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
  t.is(root.ctorName, 'x');

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
  t.is(root.ctorName, 'x');
  t.is(root.children.length, 1);

  // opt
  let opt = root.children[0];
  t.true(opt.isOptional());

  opt.ifPresent(
    term => {
      t.is(term.matchLength, 1);
      t.is(term.isTerminal(), true);
      t.is(term.matchLength, 1);
    },
    () => {
      throw new Error('Expected opt to be present');
    }
  );

  g = await toWasmGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(g, ''), 1);

  // x

  root = g.getCstRoot();
  t.is(root.matchLength, 0);
  t.is(root.ctorName, 'x');
  t.is(root.children.length, 1);

  // opt

  opt = root.children[0];
  t.true(opt.isOptional());
  t.true(opt.isEmpty());
});

test('cst for plus', async t => {
  const g = await toWasmGrammar(ohm.grammar('G {x = "a"+}'));
  t.is(matchWithInput(g, 'a'), 1);

  // x

  const root = g.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.ctorName, 'x');
  t.is(root.children.length, 1);

  // list

  const list = root.children[0];
  t.true(list.isList());
  t.is(list.children.length, 1);

  t.is(list.children[0].isTerminal(), true);
  t.is(list.children[0].matchLength, 1);
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
  t.is(root.ctorName, 'x');

  // list

  const list = root.children[0];
  t.true(list.isList());
  t.is(list.children.length, 3);

  // Terminal children
  const [childA, childB, childC] = list.children;
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

  // list
  const list = root.children[0];
  t.true(list.isList());
  t.is(list.children.length, 3);

  const [childA, childB, childC] = list.children;
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

  const getMemo = (pos, ctorName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    const ruleId = checkNotNull(wasmGrammar._ruleIds.get(ctorName));
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

  const getMemo = (pos, ctorName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    const ruleId = checkNotNull(wasmGrammar._ruleIds.get(ctorName));
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleId, true);
  };

  // start
  const root = wasmGrammar.getCstRoot();
  t.is(root.matchLength, 2);
  t.is(root.children.length, 2);
  t.is(root.ctorName, 'start');

  const [child1, child2] = root.children;

  // b #1
  t.is(child1.matchLength, 1);
  t.is(child1.children.length, 1);
  t.is(child1.ctorName, 'b');
  t.is(child1.children[0].isTerminal(), true);
  t.is(child1.children[0].matchLength, 1);

  // b #2
  t.is(child2.matchLength, 1);
  t.is(child2.children.length, 1);
  t.is(child2.ctorName, 'b');
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

  const [term, list] = wasmGrammar.getCstRoot().children;
  t.is(term.matchLength, 1);
  t.true(list.isList());
  t.is(list.children.length, 2);

  t.deepEqual(
    list.children.map(seq => seq.matchLength),
    [4, 4]
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

test('unicode built-ins: non-ASCII (fast-check)', async t => {
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

test('fast-check zoo', async t => {
  const g = ohm.grammar('G { Start = letter letter }');
  const wasmGrammar = await toWasmGrammar(g);
  t.true(wasmGrammar.match('㐀𝐀').succeeded());
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

test('unicode', async t => {
  const source = 'Nöö';
  const g = await toWasmGrammar(ohm.grammar('G { Start = any* }'));
  t.is(matchWithInput(g, source), 1);
  t.is(unparse(g), source);
});

test('iter nodes: star w/ 0 matches', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)* }'));
  t.is(matchWithInput(g, ''), 1, 'empty input matches');
  t.is(g.getCstRoot().children.length, 1);
  const list = g.getCstRoot().children[0];
  t.true(list.isList());
  t.is(list.children.length, 0);
});

test('iter nodes: basic unpack (star)', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)* }'));
  t.is(matchWithInput(g, ''), 1, 'empty input matches');
  t.is(matchWithInput(g, 'a1 b2 c 3'), 1);
  t.is(g.getCstRoot().children.length, 1);
  const list = g.getCstRoot().children[0];
  t.true(list.isList());
  t.deepEqual(
    list.collect((letter, digit) => `${digit.sourceString}${letter.sourceString}`),
    ['1a', '2b', '3c']
  );
  t.throws(() => list.collect(() => {}), {message: /bad arity/});
});

test('iter nodes: basic unpack (plus)', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)+ }'));
  t.is(matchWithInput(g, ''), 0, 'empty input FAILS');
  t.is(matchWithInput(g, 'a1 b2 c 3'), 1);
  t.is(g.getCstRoot().children.length, 1);
  const list = g.getCstRoot().children[0];
  t.true(list.isList());
  t.deepEqual(
    list.collect((letter, digit) => `${digit.sourceString}${letter.sourceString}`),
    ['1a', '2b', '3c']
  );
  t.throws(() => list.collect(() => {}), {message: /bad arity/});
});

test('iter nodes: basic unpack (opt)', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)? }'));
  t.is(matchWithInput(g, ''), 1, 'empty input matches');
  t.is(matchWithInput(g, 'a1'), 1);
  t.is(g.getCstRoot().children.length, 1);
  const opt = g.getCstRoot().children[0];
  t.true(opt.isOptional());
  t.is(
    opt.ifPresent((letter, digit) => `${digit.sourceString}${letter.sourceString}`),
    '1a'
  );
  t.throws(() => opt.ifPresent(() => {}), {message: /bad arity/});
});

test('MatchResult.detach()', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { Start = (letter digit)? }'));
  const r1 = g.match('');
  t.assert(r1.succeeded());
  t.throws(() => g.match(''), {message: /unmanaged MatchResults/});
  r1.detach();
  const r2 = g.match('');
  t.assert(r2.succeeded());
  t.throws(() => g.match(''), {message: /unmanaged MatchResults/});
  r2.detach();
  t.notThrows(() => g.match(''));
});

test('matching at end', async t => {
  const g = ohm.grammar(`
    G {
      start =
        | alnum
        | letter
        | digit
        | hexDigit
        // ListOf
        // NonemptyListOf
        // EmptyListOf
        // listOf
        // nonemptyListOf
        // emptyListOf
        // applySyntactic
        | any
        // end
        // caseInsensitive
        | lower
        | upper
        | unicodeLtmo
        // spaces
        | space
    }
  `);
  const wasmGrammar = await toWasmGrammar(g);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('any consumes an entire code point', async t => {
  const g = await toWasmGrammar(ohm.grammar('G { start = any }'));
  t.assert('😇'.length === 2);
  t.true(g.match('😇').succeeded());
});

test.failing('ranges w/ code points > 0xFFFF', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      face = "😇".."😈"
      notFace = ~face any
    }
  `)
  );

  // Every emoji by code point: https://emojipedia.org/emoji/
  t.false(g.match('😆').succeeded()); // just below
  t.true(g.match('😇').succeeded());
  t.true(g.match('😈').succeeded());
  t.false(g.match('😉').succeeded()); // just above

  t.true(g.match('x', 'notFace').succeeded());
});

test('shortMessage (basic)', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start = "one" | two | three
      two = "two"
      three (eine Drei) = "three"
    }
  `)
  );
  const result = g.match('four');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  t.true(msg.includes('"one"'));
  t.true(msg.includes('"two"'));
});

test('shortMessage (descriptions)', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start (a start) = "x" "one"
    }
  `)
  );
  const result = g.match('xx');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  t.false(msg.includes('"one"'));
  t.true(msg.includes('a start'));
});

test('shortMessage (descriptions): multiple described rules in choice', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start = foo | bar
      foo (a foo) = "foo"
      bar (a bar) = "bar"
    }
  `)
  );
  const result = g.match('baz');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // Both descriptions should appear since both failed at position 0
  t.true(msg.includes('a foo'));
  t.true(msg.includes('a bar'));
});

test('shortMessage (descriptions): nested described rules', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start (a start) = inner
      inner (an inner) = "x" "y"
    }
  `)
  );
  const result = g.match('xz');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // The outer description should swallow the inner one
  t.true(msg.includes('a start'));
  t.false(msg.includes('an inner'));
});

test('shortMessage (descriptions): description on successful prefix', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start = foo "end"
      foo (a foo) = "foo"
    }
  `)
  );
  const result = g.match('foox');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // foo succeeded, so its description shouldn't appear
  t.false(msg.includes('a foo'));
  t.true(msg.includes('"end"'));
});

test('shortMessage (descriptions): description with repetition', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start = item+ "end"
      item (an item) = "x"
    }
  `)
  );
  const result = g.match('xxxy');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // After matching some items, we fail - should see "end" expected
  t.true(msg.includes('"end"'));
});

test('shortMessage (descriptions): lexical rule with description', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      Start = num
      num (a number) = digit+
    }
  `)
  );
  const result = g.match('abc');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  t.true(msg.includes('a number'));
  t.false(msg.includes('digit'));
});

test('shortMessage (descriptions): rightmost failure wins', async t => {
  const g = await toWasmGrammar(
    ohm.grammar(`
    G {
      start = foo | "abc"
      foo (a foo) = "ab" "x"
    }
  `)
  );
  const result = g.match('abd');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // Both alternatives fail at position 0:
  // - foo: "ab" matched, "x" failed. Description "a foo" recorded at pos 0.
  // - "abc": "ab" matched, "c" failed. Terminal failure at pos 0.
  // Both should appear in the error message.
  t.true(msg.includes('a foo'));
  t.true(msg.includes('"abc"'));
});

function getExpectedSet(result) {
  const failures = result.getRightmostFailures() || [];
  return new Set(failures.filter(f => !f.isFluffy()).map(f => f.toString()));
}

function setsEqual(a, b) {
  return a.size === b.size && [...a].every(x => b.has(x));
}

const errorMessageGrammars = [
  'G { start = "a" | "b" | "c" }',
  'G { start = "a" "b" "c" }',
  'G { start = "a"+ }',
  'G { start = digit+ }',
  'G { start = "a".."z" }',
  'G { start = foo | bar\n  foo = "abc"\n  bar = "123" }',
  'G { start = foo\n  foo (a foo) = "x" "y" }',
  'G { start = foo | bar\n  foo (a foo) = "abc"\n  bar (a bar) = "xy" }',
  'G { start = letter+ }',
  'G { start = any end }',
  'G { start = "a"* "b" }',
  'G { start = "a"? "b" }',
  'G { start = &"a" any }',
  'G { start = &("x" | "a") "b" }', // Lookahead succeeds, internal failures are fluffy
];

test('fast-check: error messages match JS impl', async t => {
  // Bias input generation toward characters used in the test grammars.
  const inputArb = fc.oneof(
    fc.array(fc.constantFrom(...'abc123xy'), {maxLength: 10}).map(arr => arr.join('')),
    fc.string({maxLength: 10})
  );

  for (const source of errorMessageGrammars) {
    const ohmG = ohm.grammar(source);
    const wasmG = await toWasmGrammar(ohmG);

    const result = fc.check(
      fc.property(inputArb, input => {
        const ohmResult = ohmG.match(input);
        return wasmG.match(input).use(wasmResult => {
          assert.equal(
            ohmResult.succeeded(),
            wasmResult.succeeded(),
            'success/failure mismatch'
          );
          if (ohmResult.succeeded()) return true;

          assert.equal(
            ohmResult.getRightmostFailurePosition(),
            wasmResult.getRightmostFailurePosition(),
            'failure position mismatch'
          );

          const ohmExpected = getExpectedSet(ohmResult);
          const wasmExpected = getExpectedSet(wasmResult);
          assert(
            setsEqual(ohmExpected, wasmExpected),
            `expected tokens mismatch: ohm=${[...ohmExpected]}, wasm=${[...wasmExpected]}`
          );
          return true;
        });
      }),
      {numRuns: 100, includeErrorInReport: true}
    );
    t.false(result.failed, `${source}\n${fc.defaultReportMessage(result)}`);
  }
});

// Test failure descriptions for each expression type, both positive and negated.
test('failure descriptions match JS impl', async t => {
  // Each test case: [grammar source, input, description]
  // Positive (non-negated) cases:
  const testCases = [
    ['G { start = "x" }', '0', 'Terminal'],
    ['G { start = "a".."z" }', '0', 'Range'],
    ['G { start = end }', 'x', 'End'],
    ['G { start = any }', '', 'any'],
    ['G { start = digit }', 'x', 'digit'],
    // Negated cases:
    ['G { start = ~"x" "y" }', 'x', '~Terminal'],
    ['G { start = ~("a".."z") "0" }', 'a', '~Range'],
    ['G { start = ~end any }', '', '~End'],
    ['G { start = ~any "x" }', 'a', '~any'],
    ['G { start = ~digit letter }', '5', '~digit'],
  ];

  for (const [source, input, desc] of testCases) {
    const ohmG = ohm.grammar(source);
    const wasmG = await toWasmGrammar(ohmG);

    const ohmResult = ohmG.match(input);
    const ohmExpected = getExpectedSet(ohmResult);

    wasmG.match(input).use(wasmResult => {
      t.false(wasmResult.succeeded(), `${desc}: expected failure`);
      const wasmExpected = getExpectedSet(wasmResult);
      t.true(
        setsEqual(ohmExpected, wasmExpected),
        `${desc}: expected ${[...ohmExpected]}, got ${[...wasmExpected]}`
      );
    });
  }
});

// Test for FailedMatchResult methods: getExpectedText, message, getInterval.
test('fast-check: FailedMatchResult methods match JS impl', async t => {
  const inputArb = fc.oneof(
    fc.array(fc.constantFrom(...'abc123xy'), {maxLength: 10}).map(arr => arr.join('')),
    fc.string({maxLength: 10})
  );

  for (const source of errorMessageGrammars) {
    const ohmG = ohm.grammar(source);
    const wasmG = await toWasmGrammar(ohmG);

    const result = fc.check(
      fc.property(inputArb, input => {
        const ohmResult = ohmG.match(input);
        if (ohmResult.succeeded()) return true;

        return wasmG.match(input).use(wasmResult => {
          assert(wasmResult.failed(), 'expected wasm match to fail');

          const ohmExpectedSet = getExpectedSet(ohmResult);
          const wasmExpectedSet = getExpectedSet(wasmResult);

          // Verify the sets match
          assert(
            setsEqual(ohmExpectedSet, wasmExpectedSet),
            `mismatch: ohm=${[...ohmExpectedSet]}, wasm=${[...wasmExpectedSet]}`
          );

          // Test getExpectedText() - verify it contains all expected items
          const expectedText = wasmResult.getExpectedText();
          for (const item of wasmExpectedSet) {
            assert(expectedText.includes(item), `getExpectedText missing: ${item}`);
          }

          // Test message property - check format and content
          assert(wasmResult.message.includes('Line '), 'message should include Line info');
          assert(wasmResult.message.includes('Expected '), 'message should include Expected');
          for (const item of wasmExpectedSet) {
            assert(wasmResult.message.includes(item), `message missing: ${item}`);
          }

          // Test getInterval()
          const ohmInterval = ohmResult.getInterval();
          const wasmInterval = wasmResult.getInterval();
          assert.equal(
            ohmInterval.startIdx,
            wasmInterval.startIdx,
            'interval startIdx mismatch'
          );
          assert.equal(ohmInterval.endIdx, wasmInterval.endIdx, 'interval endIdx mismatch');

          return true;
        });
      }),
      {numRuns: 100, includeErrorInReport: true}
    );
    t.false(result.failed, `${source}\n${fc.defaultReportMessage(result)}`);
  }
});

test('accessing .message after detach throws an error', async t => {
  const ohmGrammar = ohm.grammar('G { start = "a" "b" "c" }');
  const wasmGrammar = await toWasmGrammar(ohmGrammar);

  const input = 'ab'; // Missing "c"

  const wasmResult = wasmGrammar.match(input);
  wasmResult.detach();

  t.true(wasmResult.failed(), 'wasm match should fail');

  // Accessing .message after detach should throw
  t.throws(
    () => wasmResult.message,
    {message: /Cannot access.*after MatchResult has been detached/}
  );
});

test('accessing .message inside use() works correctly', async t => {
  const ohmGrammar = ohm.grammar('G { start = "a" "b" "c" }');
  const wasmGrammar = await toWasmGrammar(ohmGrammar);

  const input = 'ab'; // Missing "c"

  const ohmResult = ohmGrammar.match(input);
  const wasmResult = wasmGrammar.match(input);

  wasmResult.use(() => {
    t.true(ohmResult.failed(), 'ohm-js match should fail');
    t.true(wasmResult.failed(), 'wasm match should fail');

    t.is(wasmResult.message, ohmResult.message, 'error messages should be identical');
  });
});
