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

// const dumpMemoTable = pos => {
//   const arr = [];
//   for (let i = 0; i < 6; i++) {
//     arr.push(view.getUint32(pos * Constants.MEMO_COL_SIZE_BYTES + i * 4, true));
//   }
//   console.log(arr.map(v => v.toString(16).padStart(8, '0')).join(' '));
// };

function rawCstNode(matcher, addr = undefined) {
  const view = new DataView(matcher._instance.exports.memory.buffer);
  if (addr === undefined) {
    addr = matcher._instance.exports.cstBase.value;
  }
  const count = view.getUint32(addr, true);
  const matchLen = view.getUint32(addr + 4, true);
  const type = view.getInt32(addr + 8, true);
  return [count, matchLen, type, ...getUint32Array(view, addr + 12, count)];
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

test('cst returns', async t => {
  let matcher = await WasmMatcher.forGrammar(ohm.grammar('G { start = "a" | "b" }'));

  // start
  t.is(matchWithInput(matcher, 'a'), 1);
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(children.length, 1);
  t.is(matchLen, 1);
  t.is(type, 0);

  // "a"
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(children.length, 0);
  t.is(matchLen, 1);
  t.is(type, -1);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G { start = "a" b\nb = "b" }'));

  // start
  t.is(matchWithInput(matcher, 'ab'), 1);
  [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(children.length, 2);
  t.is(matchLen, 2);
  t.is(type, 0);

  // "a"
  const [childA, childB] = children;
  [_, matchLen, type, ...children] = rawCstNode(matcher, childA);
  t.is(children.length, 0);
  t.is(matchLen, 1);
  t.is(type, -1);

  // NonterminalNode for b
  [_, matchLen, type, ...children] = rawCstNode(matcher, childB);
  t.is(children.length, 1);
  t.is(matchLen, 1);
  t.is(type, 0);

  // TerminalNode for "b"
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(children.length, 0);
  t.is(matchLen, 1);
  t.is(type, -1);
});

test('cst with lookahead', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = ~space any}'));
  const input = 'a';
  t.is(matchWithInput(matcher, input), 1);

  // Currently positive lookahead doesn't bind anything!

  // - apply(x)
  //   - any
  //     - "a"

  // x
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 1);
  t.is(children.length, 1);
  t.is(type, 0);

  // any
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 1);
  t.is(children.length, 1);
  t.is(type, 0);

  // Terminal
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 1);
  t.is(children.length, 0);
  t.is(type, -1);
});

test('cst for range', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a".."z"}'));
  t.is(matchWithInput(matcher, 'b'), 1);

  // x
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 1);
  t.is(children.length, 1);
  t.is(type, 0);

  // Terminal
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 1);
  t.is(children.length, 0);
  t.is(type, -1);
});

test('cst for opt', async t => {
  let matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(matcher, 'a'), 1);

  // x
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 1);
  t.is(type, 0);
  t.is(children.length, 1);

  // iter
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 1);
  t.is(type, -2);
  t.is(children.length, 1);

  t.deepEqual(rawCstNode(matcher, children[0]), [0, 1, -1]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a"?}'));
  t.is(matchWithInput(matcher, ''), 1);

  // x
  [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 0);
  t.is(type, 0);
  t.is(children.length, 1);

  // iter
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 0);
  t.is(type, -2);
  t.is(children.length, 0);
});

test('cst for plus', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a"+}'));
  t.is(matchWithInput(matcher, 'a'), 1);

  // x
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 1);
  t.is(type, 0);
  t.is(children.length, 1);

  // iter
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 1);
  t.is(type, -2);
  t.is(children.length, 1);

  t.deepEqual(rawCstNode(matcher, children[0]), [0, 1, -1]);
});

test('cst with (small) repetition', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = "a"*}'));
  t.is(matchWithInput(matcher, 'aaa'), 1);

  // - apply(start)
  //   - iter
  //     - "a"
  //     - "a"
  //     - "a"

  // start
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 3);
  t.is(children.length, 1);
  t.is(type, 0);

  // iter
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 3);
  t.is(children.length, 3);
  t.is(type, -2);

  // Terminal children
  t.deepEqual(rawCstNode(matcher, children[0]), [0, 1, -1]);
  t.deepEqual(rawCstNode(matcher, children[1]), [0, 1, -1]);
  t.deepEqual(rawCstNode(matcher, children[2]), [0, 1, -1]);
});

test('repetition and lookahead', async t => {
  const matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)*}'));
  t.is(matchWithInput(matcher, 'abc'), 1);
});

// eslint-disable-next-line ava/no-skip-test
test('cst with repetition and lookahead', async t => {
  let matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)*}'));
  let input = 'abc';
  t.is(matchWithInput(matcher, input), 1);

  // x
  let [_, matchLen, type, ...children] = rawCstNode(matcher, matcher.getCstRoot());
  t.is(matchLen, 3);
  t.is(children.length, 1);
  t.is(type, 0);

  // iter
  [_, matchLen, type, ...children] = rawCstNode(matcher, children[0]);
  t.is(matchLen, 3);
  t.is(children.length, 3);
  t.is(type, -2);

  const [childA, childB, childC] = children;
  [_, matchLen, type, ...children] = rawCstNode(matcher, childA);
  t.is(matchLen, 1);
  t.is(children.length, 1);
  t.is(type, 0);
  t.deepEqual(rawCstNode(matcher, children[0]), [0, 1, -1]);

  [_, matchLen, type, ...children] = rawCstNode(matcher, childB);
  t.is(matchLen, 1);
  t.is(children.length, 1);
  t.is(type, 0);
  t.deepEqual(rawCstNode(matcher, children[0]), [0, 1, -1]);

  [_, matchLen, type, ...children] = rawCstNode(matcher, childC);
  t.is(matchLen, 1);
  t.is(children.length, 1);
  t.is(type, 0);
  t.deepEqual(rawCstNode(matcher, children[0]), [0, 1, -1]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)+ spaces any+}'));
  input = '/ab xy';
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

test.skip('basic memoization', async t => {
  const g = ohm.grammar('G { start = "a" b\nb = "b" }');
  const matcher = await WasmMatcher.forGrammar(g);
  t.is(matchWithInput(matcher, 'ab'), 1);

  const view = matcher.memoTableViewForTesting();
  const ruleIdByName = new Map(Object.keys(g.rules).map((name, idx) => [name, idx]));

  const getMemo = (pos, ruleName) => {
    const colOffset = pos * Constants.MEMO_COL_SIZE_BYTES;
    return view.getUint32(colOffset + SIZEOF_UINT32 * ruleIdByName.get(ruleName), true);
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
