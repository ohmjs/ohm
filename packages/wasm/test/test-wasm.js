import test from 'ava';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {Compiler, ConstantsForTesting as Constants} from '../src/index.js';
import {wasmMatcherForGrammar} from './_helpers.js';

const matchWithInput = (m, str) => (m.setInput(str), m.match());

const SIZEOF_UINT32 = 4;

function checkNotNull(x, msg = 'unexpected null value') {
  if (x == null) throw new Error(msg);
  return x;
}

function memoTableViewForTesting(m) {
  const {buffer} = m._instance.exports.memory;
  return new DataView(buffer, Constants.MEMO_START_OFFSET);
}

function unparse(m, root) {
  const input = m.getInput();
  let ans = '';
  let pos = 0;
  function walk(node) {
    if (node.isTerminal()) {
      ans += input.slice(pos, pos + node.matchLength);
      pos += node.matchLength;
    }
    node.children.forEach(c => walk(c));
  }
  walk(m.getCstRoot());
  return ans;
}

// const dumpMemoTable = pos => {
//   const arr = [];
//   for (let i = 0; i < 6; i++) {
//     arr.push(view.getUint32(pos * Constants.MEMO_COL_SIZE_BYTES + i * 4, true));
//   }
//   console.log(arr.map(v => v.toString(16).padStart(8, '0')).join(' '));
// };

test('input in memory', async t => {
  const g = ohm.grammar('G { start = "x" }');
  const matcher = await wasmMatcherForGrammar(g);
  matcher.setInput('ohm');
  matcher.match(); // Trigger fillInputBuffer

  const view = new DataView(matcher._instance.exports.memory.buffer, 64 * 1024);
  t.is(view.getUint8(0), 'ohm'.charCodeAt(0));
  t.is(view.getUint8(1), 'ohm'.charCodeAt(1));
  t.is(view.getUint8(2), 'ohm'.charCodeAt(2));
});

test('cst returns', async t => {
  let matcher = await wasmMatcherForGrammar(ohm.grammar('G { start = "a" | "b" }'));

  // start
  t.is(matchWithInput(matcher, 'a'), 1);
  let root = matcher.getCstRoot();

  t.is(root.children.length, 1);
  t.is(root.matchLength, 1);
  t.is(root.ruleName, 'start');

  // "a"
  let {matchLength, _type, children} = root.children[0];
  t.is(children.length, 0);
  t.is(matchLength, 1);
  t.is(_type, -1);

  matcher = await wasmMatcherForGrammar(ohm.grammar('G { start = "a" b\nb = "b" }'));

  // start
  t.is(matchWithInput(matcher, 'ab'), 1);
  root = matcher.getCstRoot();
  t.is(root.children.length, 2);
  t.is(root.matchLength, 2);
  t.is(root.ruleName, 'start');

  // "a"
  const [childA, childB] = root.children;
  ({matchLength, _type, children} = childA);
  t.is(children.length, 0);
  t.is(matchLength, 1);
  t.is(_type, -1);

  // NonterminalNode for b
  t.is(childB.children.length, 1);
  t.is(childB.matchLength, 1);
  t.is(childB.ruleName, 'b');

  // TerminalNode for "b"
  // eslint-disable-next-line no-unused-vars
  ({matchLength, _type, children} = childB.children[0]);
  t.is(children.length, 0);
  t.is(matchLength, 1);
  t.is(_type, -1);
});

test('cst with lookahead', async t => {
  const matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = ~space any}'));
  const input = 'a';
  t.is(matchWithInput(matcher, input), 1);

  // Currently positive lookahead doesn't bind anything!

  // - apply(x)
  //   - any
  //     - "a"

  // x
  const root = matcher.getCstRoot();
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
  const matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = "a".."z"}'));
  t.is(matchWithInput(matcher, 'b'), 1);

  // x
  const root = matcher.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.children.length, 1);
  t.is(root.ruleName, 'x');

  // Terminal
  // eslint-disable-next-line no-unused-vars
  const term = root.children[0];
  t.is(term.matchLength, 1);
  t.is(term.children.length, 0);
  t.is(term.isTerminal(), true);
});

test('cst for opt', async t => {
  let matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(matcher, 'a'), 1);

  // x
  let root = matcher.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.ruleName, 'x');
  t.is(root.children.length, 1);

  // iter
  let iter = root.children[0];
  t.is(iter.matchLength, 1);
  t.is(iter._type, -2);
  t.is(iter.children.length, 1);
  t.is(iter.children[0].isTerminal(), true);
  t.is(iter.children[0].matchLength, 1);

  matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(matcher, ''), 1);

  // x
  // eslint-disable-next-line no-unused-vars
  root = matcher.getCstRoot();
  t.is(root.matchLength, 0);
  t.is(root.ruleName, 'x');
  t.is(root.children.length, 1);

  // iter
  // eslint-disable-next-line no-unused-vars
  iter = root.children[0];
  t.is(iter.matchLength, 0);
  t.is(iter._type, -2);
  t.is(iter.children.length, 0);
});

test('cst for plus', async t => {
  const matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = "a"+}'));
  t.is(matchWithInput(matcher, 'a'), 1);

  // x
  // eslint-disable-next-line no-unused-vars
  const root = matcher.getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.ruleName, 'x');
  t.is(root.children.length, 1);

  // iter
  // eslint-disable-next-line no-unused-vars
  const iter = root.children[0];
  t.is(iter.matchLength, 1);
  t.is(iter._type, -2);
  t.is(iter.children.length, 1);

  t.is(iter.children[0].isTerminal(), true);
  t.is(iter.children[0].matchLength, 1);
});

test('cst with (small) repetition', async t => {
  const matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = "a"*}'));
  t.is(matchWithInput(matcher, 'aaa'), 1);

  // - apply(start)
  //   - iter
  //     - "a"
  //     - "a"
  //     - "a"

  // start
  // eslint-disable-next-line no-unused-vars
  const root = matcher.getCstRoot();
  t.is(root.matchLength, 3);
  t.is(root.children.length, 1);
  t.is(root.ruleName, 'x');

  // iter
  // eslint-disable-next-line no-unused-vars
  const iter = root.children[0];
  t.is(iter.matchLength, 3);
  t.is(iter.children.length, 3);
  t.is(iter._type, -2);

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
  const matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = (~space any)*}'));
  t.is(matchWithInput(matcher, 'abc'), 1);
});

// eslint-disable-next-line ava/no-skip-test
test('cst with repetition and lookahead', async t => {
  let matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = (~space any)*}'));
  let input = 'abc';
  t.is(matchWithInput(matcher, input), 1);

  // x
  let {matchLength, _type, children} = matcher.getCstRoot();
  t.is(matchLength, 3);
  t.is(children.length, 1);
  t.is(_type, 0);

  // iter
  ({matchLength, _type, children} = children[0]);
  t.is(matchLength, 3);
  t.is(children.length, 3);
  t.is(_type, -2);

  const [childA, childB, childC] = children;
  ({matchLength, _type, children} = childA);
  t.is(matchLength, 1);
  t.is(children.length, 1);
  t.is(_type, 0);
  t.is(children[0].isTerminal(), true);
  t.is(children[0].matchLength, 1);

  ({matchLength, _type, children} = childB);
  t.is(matchLength, 1);
  t.is(children.length, 1);
  t.is(_type, 0);
  t.is(children[0].isTerminal(), true);
  t.is(children[0].matchLength, 1);

  // eslint-disable-next-line no-unused-vars
  ({matchLength, _type, children} = childC);
  t.is(matchLength, 1);
  t.is(children.length, 1);
  t.is(_type, 0);
  t.is(children[0].isTerminal(), true);
  t.is(children[0].matchLength, 1);

  matcher = await wasmMatcherForGrammar(ohm.grammar('G {x = (~space any)+ spaces any+}'));
  input = '/ab xy';
});

test('wasm: one-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '1'), 1);
});
test('wasm: multi-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "123"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '123'), 1);
});

test('wasm: handle end', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '123'), 0);
});

test('wasm: choice', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" | "2"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '2'), 1);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, '3'), 0);
});

test('wasm: more choice', async t => {
  const g = ohm.grammar(`
    G {
      start = "12" | "13" | "14"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '14'), 1);
  t.is(matchWithInput(matcher, '13'), 1);
  t.is(matchWithInput(matcher, '15'), 0);
});

test('wasm: sequence', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" "2"
            | "130" ""
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '12'), 1);
  t.is(matchWithInput(matcher, '130'), 1);
  t.is(matchWithInput(matcher, '13'), 0);
});

test('wasm: choice + sequence', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" ("2" | "3")
            | "14" ""
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '12'), 1);
  t.is(matchWithInput(matcher, '13'), 1);
  t.is(matchWithInput(matcher, '14'), 1);
  t.is(matchWithInput(matcher, '15'), 0);
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
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '12'), 1);
  t.is(matchWithInput(matcher, '1II'), 1);
  t.is(matchWithInput(matcher, '3'), 1);
  t.is(matchWithInput(matcher, '13'), 0);
});

test('wasm: star', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"*
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '111'), 1);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, ''), 1);
  t.is(matchWithInput(matcher, '2'), 0);

  const g2 = ohm.grammar(`
    G {
      start = "123"* "1"
    }
  `);
  const matcher2 = await wasmMatcherForGrammar(g2);
  t.is(matchWithInput(matcher2, '1'), 1);
  t.is(matchWithInput(matcher2, '1231'), 1);
  t.is(matchWithInput(matcher2, ''), 0);
  t.is(matchWithInput(matcher2, '2'), 0);
});

test('wasm: plus', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"+
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '111'), 1);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, ''), 0);
  t.is(matchWithInput(matcher, '2'), 0);
});

test('wasm: lookahead', async t => {
  const g = ohm.grammar(`
    G {
      start = &"1" "1"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, '2'), 0);
  t.is(matchWithInput(matcher, ''), 0);
});

test('wasm: negative lookahead', async t => {
  const g = ohm.grammar(`
    G {
      start = ~"1" "2"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '2'), 1);
  t.is(matchWithInput(matcher, '12'), 0);
  t.is(matchWithInput(matcher, ''), 0);
});

test('wasm: opt', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"? "2"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '12'), 1);
  t.is(matchWithInput(matcher, '2'), 1);
  t.is(matchWithInput(matcher, ''), 0);
});

test('wasm: range', async t => {
  const g = ohm.grammar(`
    G {
      start = "a".."z"
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, 'a'), 1);
  t.is(matchWithInput(matcher, 'm'), 1);
  t.is(matchWithInput(matcher, 'z'), 1);
  t.is(matchWithInput(matcher, 'A'), 0);
  t.is(matchWithInput(matcher, '1'), 0);
});

test('wasm: any', async t => {
  const g = ohm.grammar('G { start = any }');
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, 'a'), 1);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, ' '), 1);
  t.is(matchWithInput(matcher, ''), 0);

  const g2 = ohm.grammar('G { start = any* }');
  const matcher2 = await wasmMatcherForGrammar(g2);
  t.is(matchWithInput(matcher2, 'a'), 1);
  t.is(matchWithInput(matcher2, ''), 1);
});

test('wasm: end', async t => {
  const g = ohm.grammar(`
    G {
      start = "a" end
    }
  `);
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, 'a'), 1);
  t.is(matchWithInput(matcher, 'ab'), 0);
  t.is(matchWithInput(matcher, ''), 0);
});

test('real-world grammar', async t => {
  const g = ohm.grammar(String.raw`
    Test {
      Msgs = Msg*
      Msg = description? spaces (Head spaces Params spaces)

      lower := "a".."z"
      upper := "A".."Z"

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

  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, '/quickjs eval source: "1 + 1"'), 1);
  start = performance.now();
  t.is(matchWithInput(matcher, longInput), 1);
  t.log(`Wasm match time: ${(performance.now() - start).toFixed(2)}ms`);
});

test('basic memoization', async t => {
  const g = ohm.grammar('G { start = "a" b\nb = "b" }');
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, 'ab'), 1);

  const view = memoTableViewForTesting(matcher);

  const getMemo = (pos, ruleName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    const ruleId = checkNotNull(matcher._ruleIds.get(ruleName));
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleId, true);
  };

  const cstRoot = matcher.getCstRoot();

  // start
  let {matchLength, _type, children} = cstRoot;
  t.is(matchLength, 2);
  t.is(children.length, 2);
  t.is(_type, 0);

  const [childA, childB] = children;

  // "a"
  t.is(childA.isTerminal(), true);
  t.is(childA.matchLength, 1);

  // b
  // eslint-disable-next-line no-unused-vars
  ({matchLength, _type, children} = childB);
  t.is(matchLength, 1);
  t.is(children.length, 1);
  t.is(_type, 0);

  // "b"
  t.is(children[0].isTerminal(), true);
  t.is(children[0].matchLength, 1);

  // Expect memo for `b` at position 1, and `start` at position 0.
  t.is(getMemo(1, 'b'), childB._base);
  t.is(getMemo(0, 'start'), cstRoot._base);
});

test('more memoization', async t => {
  const g = ohm.grammar('G { start = b "a" | b b\nb = "b" }');
  const matcher = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(matcher, 'bb'), 1);

  const view = memoTableViewForTesting(matcher);

  const getMemo = (pos, ruleName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    const ruleId = checkNotNull(matcher._ruleIds.get(ruleName));
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleId, true);
  };

  // start
  const root = matcher.getCstRoot();
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
    const matcher = await wasmMatcherForGrammar(g);
    t.is(matchWithInput(matcher, 'xx'), 1);
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
    const matcher = await wasmMatcherForGrammar(g);
    t.is(matchWithInput(matcher, 'y'), 1);
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
    const matcher = await wasmMatcherForGrammar(g);
    t.is(matchWithInput(matcher, 'xx'), 1);
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
    const matcher = await wasmMatcherForGrammar(g);
    t.is(matchWithInput(matcher, 'yz'), 1);
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
    const matcher = await wasmMatcherForGrammar(g);
    t.is(matchWithInput(matcher, 'cool'), 1);
  }
  {
    // Same param appearing twice in a lifted expression.
    const g = ohm.grammar(`
      G {
        start = narf<"a">
        narf<exp> = once<(exp | exp)>
        once<a> = a
      }`);
    const matcher = await wasmMatcherForGrammar(g);
    t.is(matchWithInput(matcher, 'a'), 1);
  }
});

test('basic left recursion', async t => {
  const g = ohm.grammar(`
    G {
      number = number "1" -- rec
             | "1"
    }`);
  const m = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(m, '1'), 1);
});

test('tricky left recursion', async t => {
  const g = ohm.grammar(`
    G {
      number = number "1" -- rec
             | number "2" -- rec2
             | "1"
    }`);
  const m = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(m, '1'), 1);
  t.is(unparse(m), '1');
  t.is(matchWithInput(m, '12'), 1);
  t.is(unparse(m), '12');
  t.is(matchWithInput(m, '11212'), 1);
  t.is(unparse(m), '11212');
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
  const m = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(m, '1'), 1);
  t.is(unparse(m), '1');

  t.is(matchWithInput(m, '11'), 1);
  t.is(unparse(m), '11');

  t.is(matchWithInput(m, '1112111'), 1);
  t.is(unparse(m), '1112111');
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
  const m = await wasmMatcherForGrammar(g);
  t.is(matchWithInput(m, '1+276*(3+4)'), 1);
  t.is(unparse(m), '1+276*(3+4)');
  t.is(matchWithInput(m, '1'), 1);
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

  t.deepEqual([...compiler.rules.keys()].sort(), [
    'commaSep',
    'commaSep<exclaimed<$term$0>>',
    'emptyListOf',
    'emptyListOf<exclaimed<$term$0>,$term$1>',
    'exclaimed',
    'exclaimed<$term$0>',
    'exclaimed<hello2>',
    'exclaimed<hello>',
    'flip',
    'flip<exclaimed<hello2>,hello>',
    'hello',
    'hello2',
    'listOf',
    'listOf<exclaimed<$term$0>,$term$1>',
    'nonemptyListOf',
    'nonemptyListOf<exclaimed<$term$0>,$term$1>',
    'one',
    'start',
    'three',
    'two',
  ]);
});
