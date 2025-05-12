import test from 'ava';
import * as ohm from 'ohm-js';
import {performance} from 'perf_hooks';

import {WasmMatcher} from '../src/index.js';

const matchWithInput = (m, str) => (m.setInput(str), m.match());

const indented = (d, str) => new Array(d * 2).join(' ') + str;

const BYTES_PER_CST_REC = 8;

function rawCst(matcher) {
  const view = new DataView(matcher._instance.exports.memory.buffer);
  const cstBase = matcher._instance.exports.cstBase.value;
  const cstTop = matcher._instance.exports.cst.value;
  const ans = [];
  for (let offset = cstBase; offset < cstTop; offset += BYTES_PER_CST_REC) {
    const depth = view.getUint32(offset, true);
    const matchLen = view.getUint32(offset + 4, true);
    ans.push([depth, matchLen]);
  }
  return ans;
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
  t.is(matchWithInput(matcher, input), 1);
  t.deepEqual(rawCst(matcher), [
    [0, 2],
    [1, 1],
    [1, 1],
    [2, 1],
  ]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G { start = "a" | b\nb = "b" }'));
  input = 'a';
  t.is(matchWithInput(matcher, input), 1);
  t.deepEqual(rawCst(matcher), [
    [0, 1],
    [1, 1],
  ]);

  input = 'b';
  t.is(matchWithInput(matcher, input), 1);
  t.deepEqual(rawCst(matcher), [
    [0, 1],
    [1, 1],
    [2, 1],
  ]);
});

test('cst with lookahead', async t => {
  let matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = ~space any}'));
  let input = 'a';
  t.is(matchWithInput(matcher, input), 1);
  t.deepEqual(rawCst(matcher), [
    [0, 1],
    [1, 1],
    [2, 1],
  ]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)*}'));
  input = 'abc';
  t.is(matchWithInput(matcher, input), 1);
  t.deepEqual(rawCst(matcher), [
    [0, 3], // - rep
    [1, 1], //   - seq
    [2, 1], //     - any
    [3, 1], //       - (child)
    [1, 1], //   - seq
    [2, 1], //     - any
    [3, 1], //       - (child)
    [1, 1], //   - seq
    [2, 1], //     - any
    [3, 1], //       - (child)
  ]);

  matcher = await WasmMatcher.forGrammar(ohm.grammar('G {x = (~space any)+ spaces any+}'));
  input = '/ab xy';
  t.is(matchWithInput(matcher, input), 1);
  t.deepEqual(rawCst(matcher), [
    [0, 6], // - seq
    [1, 3], //   - rep
    [2, 1], //     - seq
    [3, 1], //       - any
    [4, 1], //         - (child)
    [2, 1], //     - seq
    [3, 1], //       - any
    [4, 1], //         - (child)
    [2, 1], //     - seq
    [3, 1], //       - any
    [4, 1], //         - (child)
    [1, 1], //   - spaces
    [2, 1], //     - rep
    [3, 1], //       - space
    [4, 1], //         - (child)
    [1, 2], //   - rep
    [2, 1], //     - any
    [3, 1], //       - (child)
    [2, 1], //     - any
    [3, 1], //       - (child)
  ]);
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
