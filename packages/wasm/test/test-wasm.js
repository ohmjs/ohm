import test from 'ava';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {ConstantsForTesting as Constants, WasmMatcher} from '../src/index.js';

const matchWithInput = (m, str) => (m.setInput(str), m.match());

const indented = (d, str) => new Array(d * 2).join(' ') + str;

const BYTES_PER_CST_REC = 8;
const SIZEOF_UINT32 = 4;

function getUint32Array(view, offset, count) {
  const arr = new Uint32Array(count);
  for (let i = 0; i < count; i++) {
    arr[i] = view.getUint32(offset + i * 4, true);
  }
  return arr;
}

function rawCstNode(matcher, addr = undefined) {
  const view = new DataView(matcher._instance.exports.memory.buffer);
  if (addr === undefined) {
    addr = matcher._instance.exports.cstBase.value;
  }
  const count = view.getUint32(addr, true);
  const matchLen = view.getUint32(addr + 4, true);

  return [count, matchLen, ...getUint32Array(view, addr + 8, count)];
}

// eslint-disable-next-line no-unused-vars
function cstToString(matcher, input) {
  const cstBase = matcher._instance.exports.cstBase.value;
  const cstTop = matcher._instance.exports.cst.value;

  const view = new DataView(matcher._instance.exports.memory.buffer);
  let pos = 0;
  const tree = [[0, -1, 0]];
  const lines = [];
  for (let p = cstBase; p < cstTop; p += BYTES_PER_CST_REC) {
    // const [lastDepth, lastMatchLen] = depthStack.at(-1);

    const depth = view.getUint32(p, true);
    const matchLen = view.getUint32(p + 4, true);

    let popped = undefined;
    while (depth <= tree.at(-1)[1]) {
      popped = tree.pop();
      pos = Math.max(pos, popped[0] + popped[2]);
    }
    tree.push([pos, depth, matchLen]);
    lines.push(indented(depth, input.substring(pos, pos + matchLen)));
  }
  return lines.join('\n');
}

test('input in memory', async t => {
  const g = ohm.grammar('G { start = "x" }');
  const matcher = await WasmMatcher.forGrammar(g);
  matcher.setInput('ohm');
  matcher.match(); // Trigger fillInputBuffer

  const view = new DataView(matcher._instance.exports.memory.buffer, 64 * 1024);
  t.is(view.getUint8(0), 'ohm'.charCodeAt(0));
  t.is(view.getUint8(1), 'ohm'.charCodeAt(1));
  t.is(view.getUint8(2), 'ohm'.charCodeAt(2));
});

test('basic cst', async t => {
  let matcher = await WasmMatcher.forGrammar(ohm.grammar('G { start = "a" b\nb = "b" }'));
  let input = 'ab';

  // Treat the entire CST region as an array of i32 slots.
  const slot = slot => Constants.CST_START_OFFSET + slot * 4;

  t.is(matchWithInput(matcher, input), 1);

  // - apply(start)
  // - seq
  //   - "a"
  //   - apply(b)
  //     - "b"
  t.deepEqual(rawCstNode(matcher, slot(0)), [1, 2, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [2, 2, slot(7), slot(9)]);
  t.deepEqual(rawCstNode(matcher, slot(7)), [0, 1]);
  t.deepEqual(rawCstNode(matcher, slot(9)), [1, 1, slot(12)]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G { start = "a" | b\nb = "b" }'));
  input = 'a';
  t.is(matchWithInput(matcher, input), 1);

  // - apply(start)
  //   - alt
  //     - "a"
  t.deepEqual(rawCstNode(matcher, slot(0)), [1, 1, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [1, 1, slot(6)]);
  t.deepEqual(rawCstNode(matcher, slot(6)), [0, 1]);

  input = 'b';
  t.is(matchWithInput(matcher, input), 1);

  // - apply(start)
  //   - alt
  //     - apply(b)
  //       - "b"
  t.deepEqual(rawCstNode(matcher, slot(0)), [1, 1, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [1, 1, slot(6)]);
  t.deepEqual(rawCstNode(matcher, slot(6)), [1, 1, slot(9)]);
  t.deepEqual(rawCstNode(matcher, slot(9)), [0, 1]);
});

test('cst with lookahead', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = ~space any}'));
  const input = 'a';
  t.is(matchWithInput(matcher, input), 1);

  const slot = slot => Constants.CST_START_OFFSET + slot * 4;

  // - apply(x)
  //   - seq
  //     - Lookahead
  //     - any
  //       - "a"
  t.deepEqual(rawCstNode(matcher, slot(0)), [1, 1, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [2, 1, slot(7), slot(9)]);

  // Right now a Lookahead node has a 0 matchLength and 0 children. Should it be different?
  t.deepEqual(rawCstNode(matcher, slot(7)), [0, 0]);
  t.deepEqual(rawCstNode(matcher, slot(9)), [1, 1, slot(12)]);
});

test('cst with (small) repetition', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a"*}'));
  const input = 'aaa';
  t.is(matchWithInput(matcher, input), 1);

  const slot = slot => Constants.CST_START_OFFSET + slot * 4;

  // - apply(start)
  //   - iter
  //     - "a"
  //     - "a"
  //     - "a"
  t.deepEqual(rawCstNode(matcher, slot(0)), [1, 3, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [3, 3, slot(13), slot(15), slot(17)]);
  t.deepEqual(rawCstNode(matcher, slot(13)), [0, 1]);
  t.deepEqual(rawCstNode(matcher, slot(15)), [0, 1]);
  t.deepEqual(rawCstNode(matcher, slot(17)), [0, 1]);
});

test('cst with (big) repetition', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a"*}'));
  const input = 'aaaaaaaaaa';
  t.is(matchWithInput(matcher, input), 1);

  const slot = slot => Constants.CST_START_OFFSET + slot * 4;

  // - apply(start)
  //   - iter
  //     - "a"
  //     - "a"
  //     - ... (8 more "a"s)
  t.deepEqual(rawCstNode(matcher, slot(0)), [1, 10, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [
    8,
    10,
    slot(13), // "a"
    slot(15), // "a"
    slot(17), // "a"
    slot(19), // "a"
    slot(21), // "a"
    slot(23), // "a"
    slot(25), // "a" #7
    slot(27), // -> next
  ]);
  t.deepEqual(rawCstNode(matcher, slot(27)), [
    3,
    0,
    slot(37), // "a"
    slot(39), // "a"
    slot(41), // "a"
  ]);
});

test.skip('cst with repetition and lookahead', async t => {
  let matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)*}'));
  let input = 'abc';
  t.is(matchWithInput(matcher, input), 1);
  // t.deepEqual(rawCst(matcher), [
  //   [0, 3], // - apply
  //   [1, 3], //   - rep
  //   [2, 1], //     - seq
  //   [3, 1], //       - any
  //   [4, 1], //         - (child)
  //   [2, 1], //     - seq
  //   [3, 1], //       - any
  //   [4, 1], //         - (child)
  //   [2, 1], //     - seq
  //   [3, 1], //       - any
  //   [4, 1], //         - (child)
  // ]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)+ spaces any+}'));
  input = '/ab xy';
  // t.is(matchWithInput(matcher, input), 1);
  // t.deepEqual(rawCst(matcher), [
  //   [0, 6], // - apply
  //   [1, 6], //   - seq
  //   [2, 3], //     - rep
  //   [3, 1], //       - seq
  //   [4, 1], //         - any
  //   [5, 1], //           - (child)
  //   [3, 1], //       - seq
  //   [4, 1], //         - any
  //   [5, 1], //           - (child)
  //   [3, 1], //       - seq
  //   [4, 1], //         - any
  //   [5, 1], //           - (child)
  //   [2, 1], //     - spaces
  //   [3, 1], //       - rep
  //   [4, 1], //         - space
  //   [5, 1], //           - (child)
  //   [2, 2], //     - rep
  //   [3, 1], //       - any
  //   [4, 1], //         - (child)
  //   [3, 1], //       - any
  //   [4, 1], //         - (child)
  // ]);
});

test('wasm: one-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, '1'), 1);
});
test('wasm: multi-char terminals', async t => {
  const g = ohm.grammar(`
    G {
      start = "123"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, '123'), 1);
});

test('wasm: handle end', async t => {
  const g = ohm.grammar(`
    G {
      start = "1"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, '123'), 0);
});

test('wasm: choice', async t => {
  const g = ohm.grammar(`
    G {
      start = "1" | "2"
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, '111'), 1);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, ''), 1);
  t.is(matchWithInput(matcher, '2'), 0);

  const g2 = ohm.grammar(`
    G {
      start = "123"* "1"
    }
  `);
  const matcher2 = await WasmMatcher.forGrammar(g2);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
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
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, 'a'), 1);
  t.is(matchWithInput(matcher, 'm'), 1);
  t.is(matchWithInput(matcher, 'z'), 1);
  t.is(matchWithInput(matcher, 'A'), 0);
  t.is(matchWithInput(matcher, '1'), 0);
});

test('wasm: any', async t => {
  const g = ohm.grammar('G { start = any }');
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, 'a'), 1);
  t.is(matchWithInput(matcher, '1'), 1);
  t.is(matchWithInput(matcher, ' '), 1);
  t.is(matchWithInput(matcher, ''), 0);

  const g2 = ohm.grammar('G { start = any* }');
  const matcher2 = await WasmMatcher.forGrammar(g2);
  t.is(matchWithInput(matcher2, 'a'), 1);
  t.is(matchWithInput(matcher2, ''), 1);
});

test('wasm: end', async t => {
  const g = ohm.grammar(`
    G {
      start = "a" end
    }
  `);
  const matcher = await WasmMatcher.forGrammar(g);
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
  t.log('Ohm match time:', performance.now() - start);

  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, '/quickjs eval source: "1 + 1"'), 1);
  start = performance.now();
  t.is(matchWithInput(matcher, longInput), 1);
  t.log('Wasm match time:', performance.now() - start, 'ms');
});

test('basic memoization', async t => {
  const g = ohm.grammar('G { start = "a" b\nb = "b" }');
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, 'ab'), 1);

  const view = matcher.memoTableViewForTesting();
  const ruleIdxByName = new Map(Object.keys(g.rules).map((name, idx) => [name, idx]));

  const getMemo = (pos, ruleName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleIdxByName.get(ruleName), true);
  };

  const slot = slot => Constants.CST_START_OFFSET + slot * 4;

  // - apply(start)  [0]
  //   - seq         [1]
  //     - "a"       [2]
  //     - apply(b)  [3]
  //       - "b"     [4]
  t.deepEqual(rawCstNode(matcher), [1, 2, slot(3)]);
  t.deepEqual(rawCstNode(matcher, slot(3)), [2, 2, slot(7), slot(9)]);
  t.deepEqual(rawCstNode(matcher, slot(7)), [0, 1]);
  t.deepEqual(rawCstNode(matcher, slot(9)), [1, 1, slot(12)]);
  t.deepEqual(rawCstNode(matcher, slot(12)), [0, 1]);

  // Expect memo for `b` at position 1, and `start` at position 0.
  t.is(getMemo(1, 'b'), slot(9));
  t.is(getMemo(0, 'start'), slot(0));
});
