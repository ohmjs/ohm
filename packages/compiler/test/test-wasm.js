import test from 'ava';
import assert from 'node:assert/strict';
import * as fc from 'fast-check';
import * as ohm from 'ohm-js-legacy';
import {performance} from 'perf_hooks';

import {Compiler} from '../src/Compiler.ts';
import {compileAndLoad, matchWithInput, unparse, legacyGrammarToWasm} from './_helpers.js';

const SIZEOF_UINT32 = 4;

function checkNotNull(x, msg = 'unexpected null value') {
  if (x == null) throw new Error(msg);
  return x;
}

const MEMO_BLOCK_ENTRIES = 16;

function getMemoEntry(m, pos, ruleId) {
  const {buffer} = m._instance.exports.memory;
  const view = new DataView(buffer);
  const memoIndexBase = m._instance.exports.memoIndexBase.value;
  const numMemoBlocks = m._instance.exports.numMemoBlocks.value;
  const blockIdx = ruleId >>> 4; // ruleId / 16
  const idxPtr = memoIndexBase + (pos * numMemoBlocks + blockIdx) * SIZEOF_UINT32;
  const blockPtr = view.getUint32(idxPtr, true);
  if (blockPtr === 0) return 0; // EMPTY
  const offset = (ruleId & (MEMO_BLOCK_ENTRIES - 1)) * SIZEOF_UINT32;
  return view.getUint32(blockPtr + offset, true);
}

test('cst returns', async t => {
  let g = await compileAndLoad('G { start = "a" | "b" }');

  // start
  t.is(matchWithInput(g, 'a'), 1);
  let root = g._getCstRoot();

  t.is(root.children.length, 1);
  t.is(root.matchLength, 1);
  t.is(root.ctorName, 'start');

  // "a"
  let term = root.children[0];
  t.is(term.children.length, 0);
  t.is(term.matchLength, 1);
  t.true(term.isTerminal());

  g = await compileAndLoad('G { start = "a" b\nb = "b" }');

  // start
  t.is(matchWithInput(g, 'ab'), 1);
  root = g._getCstRoot();
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

test('cst: nonterminal type predicates', async t => {
  const g = await compileAndLoad('G { start = "a" | "b" }');
  t.is(matchWithInput(g, 'a'), 1);
  const root = g._getCstRoot();

  t.true(root.isNonterminal());
  t.false(root.isTerminal());
  t.false(root.isList());
  t.false(root.isOptional());
  t.false(root.isSeq());
});

test('cst: terminal sourceString', async t => {
  const g = await compileAndLoad('G { start = "hello" }');
  t.is(matchWithInput(g, 'hello'), 1);
  const root = g._getCstRoot();
  t.is(root.sourceString, 'hello');
  t.is(root.matchLength, 5);
  t.true(root.children[0].isTerminal());
  t.is(root.children[0].sourceString, 'hello');
});

test('cst: isSyntactic and isLexical', async t => {
  const g = await compileAndLoad('G { Start = inner  inner = "x" }');
  t.is(matchWithInput(g, 'x'), 1);
  const root = g._getCstRoot();
  t.true(root.isSyntactic());
  t.false(root.isLexical());

  const inner = root.children[0];
  t.true(inner.isNonterminal());
  t.false(inner.isSyntactic());
  t.true(inner.isLexical());
});

test('cst: no leadingSpaces in lexical context', async t => {
  // A syntactic rule (Start) invokes a lexical rule (ident) which has
  // multiple children. Spaces between those children must NOT be skipped,
  // and leadingSpaces must not be set on nodes in lexical context.
  const g = await compileAndLoad('G { Start = ident ";" ident = letter+ }');

  // Match with spaces in syntactic context (between ident and ";").
  t.is(matchWithInput(g, 'abc ;'), 1);
  const root = g._getCstRoot();

  // Start is syntactic — children may have leadingSpaces.
  t.true(root.isSyntactic());

  const ident = root.children[0];
  t.true(ident.isNonterminal());
  t.true(ident.isLexical());

  // The ident node itself is in syntactic context (child of Start),
  // so it *could* have leadingSpaces. But inside ident, the letter+
  // list should NOT have leadingSpaces — we're in lexical context.
  const letterList = ident.children[0];
  t.true(letterList.isList());
  t.is(letterList.leadingSpaces, undefined);

  // Each letter terminal inside the list should also lack leadingSpaces.
  for (const child of letterList.children) {
    t.is(child.leadingSpaces, undefined);
  }

  // The ";" terminal is in syntactic context (child of Start).
  // It has a space before it, so verify it's still reachable but
  // the space was skipped (sourceString is just ";").
  const semi = root.children[1];
  t.true(semi.isTerminal());
  t.is(semi.sourceString, ';');

  // Verify getSpacesLenAt distinguishes between "tried but matched 0"
  // (syntactic context) and "never tried" (lexical context).
  const {getSpacesLenAt} = g._instance.exports;

  // Position 0: beginning of input in syntactic context — spaces were
  // tried and matched 0 characters.
  t.is(getSpacesLenAt(0), 0);

  // Position 3 ("abc|"): between ident and ";" in syntactic context —
  // spaces were tried and matched 1 character (the space).
  t.is(getSpacesLenAt(3), 1);

  // Position 1 ("a|bc"): inside the lexical ident rule — spaces were
  // never tried here, so getSpacesLenAt should return -1.
  t.is(getSpacesLenAt(1), -1);
  t.is(getSpacesLenAt(2), -1);
});

test('cst: leadingSpaces on syntactic children', async t => {
  const g = await compileAndLoad('G { Start = "a" "b" }');
  t.is(matchWithInput(g, '  a b'), 1);
  const root = g._getCstRoot();

  // Root should have leadingSpaces (2 spaces at position 0).
  t.truthy(root.leadingSpaces);
  t.is(root.leadingSpaces.ctorName, 'spaces');
  t.is(root.leadingSpaces.matchLength, 2);
  t.is(root.leadingSpaces.sourceString, '  ');
  t.true(root.leadingSpaces.isNonterminal());
  t.true(root.leadingSpaces.isLexical());
  t.false(root.leadingSpaces.isSyntactic());

  // "a" has no leading spaces (immediately after the root's leading spaces).
  const a = root.children[0];
  t.is(a.leadingSpaces, undefined);

  // "b" has 1 leading space.
  const b = root.children[1];
  t.truthy(b.leadingSpaces);
  t.is(b.leadingSpaces.matchLength, 1);
  t.is(b.leadingSpaces.sourceString, ' ');
});

test('cst: leadingSpaces children via lazy parsing', async t => {
  const g = await compileAndLoad('G { Start = "x" }');
  // Access children within the match lifecycle (evalSpacesFull needs live WASM state).
  g.match('  x').use(r => {
    t.true(r.succeeded());
    const root = r.getCstRoot();
    const spaces = root.leadingSpaces;
    t.truthy(spaces);

    // Children should be a ListNode (from space*).
    t.is(spaces.children.length, 1);
    const list = spaces.children[0];
    t.true(list.isList());

    // Each character is wrapped in a 'space' nonterminal.
    t.is(list.children.length, 2);
    for (const child of list.children) {
      t.true(child.isNonterminal());
      t.is(child.ctorName, 'space');
      t.is(child.matchLength, 1);
    }
  });
});

test('cst: leadingSpaces with custom spaces rule', async t => {
  const g = await compileAndLoad(`G {
    Start = word+
    word = letter+
    space += comment
    comment = "//" (~"\\n" any)*
  }`);
  g.match('abc // yo\n def').use(r => {
    t.true(r.succeeded());
    const root = r.getCstRoot();

    // The Plus list should contain two words.
    const list = root.children[0];
    t.is(list.children.length, 2);

    const [word1, word2] = list.children;
    t.is(word1.sourceString, 'abc');
    t.is(word2.sourceString, 'def');

    // word2 should have leadingSpaces covering the comment and whitespace.
    const spaces = word2.leadingSpaces;
    t.truthy(spaces);
    t.is(spaces.ctorName, 'spaces');
    t.is(spaces.sourceString, ' // yo\n ');
    t.is(spaces.matchLength, 8);

    // Lazy CST children should have correct source strings.
    const starList = spaces.children[0];
    t.true(starList.isList());
    t.is(starList.children.length, 4);
    t.is(starList.children[0].sourceString, ' ');
    t.is(starList.children[1].sourceString, '// yo');
    t.is(starList.children[2].sourceString, '\n');
    t.is(starList.children[3].sourceString, ' ');

    // The comment child should be a 'space' wrapping a 'comment'.
    const commentSpace = starList.children[1];
    t.is(commentSpace.ctorName, 'space');
    t.is(commentSpace.children[0].ctorName, 'comment');
  });
});

// Regression: inside a lexical rule (like $spaces), forEachChild must not
// look for leading spaces. The memo table may have cached getSpacesLenAt()
// results from the syntactic-level parse at the same positions, which would
// produce spurious offsets.
test('cst: leadingSpaces children are not corrupted by cached spaces', async t => {
  const g = await compileAndLoad('G { Start = "a" "b" "c" }');
  g.match('a  b   c').use(r => {
    t.true(r.succeeded());
    const root = r.getCstRoot();

    // "b" has 2 leading spaces, "c" has 3 leading spaces.
    const [a, b, c] = root.children;
    t.is(a.sourceString, 'a');
    t.is(b.sourceString, 'b');
    t.is(c.sourceString, 'c');

    // Access the leadingSpaces children for "c" (3 spaces at positions 4,5,6).
    // During the original syntactic parse, getSpacesLenAt(4) was evaluated
    // (returning 3). Without the isLexical fix, forEachChild would find that
    // cached value and add spurious offsets to the $spaces children.
    const spaces = c.leadingSpaces;
    t.truthy(spaces);
    t.is(spaces.sourceString, '   ');
    t.is(spaces.matchLength, 3);

    // Drill into the children: should be a list of 'space' nonterminals.
    const starList = spaces.children[0];
    t.true(starList.isList());
    t.is(starList.children.length, 3);
    for (const child of starList.children) {
      t.is(child.ctorName, 'space');
      t.is(child.sourceString, ' ');
      t.is(child.matchLength, 1);
    }
  });
});

test('cst: leadingSpaces suppressed in prealloc lexical rule', async t => {
  // Regression: evalApplyPrealloc was not omitting HAS_LEADING_SPACES_EDGE
  // from the child slot of preallocated lexical nonterminal nodes.
  // `two` is a lexical rule whose child `x` is also lexical (single-char),
  // so `x` hits the prealloc fast path. The syntactic Start rule caches
  // spaces at position 1; then `x` at position 1 must not pick those up.
  const g = await compileAndLoad(`G {
    Start = "a" two
    two = x x
    x = letter
  }`);
  g.match('a bc').use(r => {
    t.true(r.succeeded());
    const root = r.getCstRoot();
    // Start > two > x x
    const two = root.children[1];
    t.is(two.ctorName, 'two');
    const [x1, x2] = two.children;
    t.is(x1.ctorName, 'x');
    t.is(x1.sourceString, 'b');
    t.is(x1.matchLength, 1);
    // The child of x1 (the letter terminal) should not have leading spaces.
    const x1Child = x1.children[0];
    t.is(x1Child.sourceString, 'b');
    t.is(x1Child.matchLength, 1);
    t.is(x2.ctorName, 'x');
    t.is(x2.sourceString, 'c');
  });
});

test('cst: lazy parsing survives memory.grow()', async t => {
  const g = await compileAndLoad('G { Start = "x" }');
  g.match('  x').use(r => {
    t.true(r.succeeded());
    const root = r.getCstRoot();
    const spaces = root.leadingSpaces;
    t.truthy(spaces);

    // Grow Wasm memory to detach the existing ArrayBuffer, simulating what
    // happens when evalSpacesFull triggers memory.grow().
    g._instance.exports.memory.grow(1);

    // Accessing children should still work — the DataView gets refreshed.
    t.is(spaces.children.length, 1);
    const list = spaces.children[0];
    t.true(list.isList());
    t.is(list.children.length, 2);
  });
});

test('cst: source intervals', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  t.is(matchWithInput(g, 'abcd'), 1);
  const root = g._getCstRoot();
  t.is(root.source.startIdx, 0);
  t.is(root.source.endIdx, 4);

  const ab = root.children[0];
  t.is(ab.source.startIdx, 0);
  t.is(ab.source.endIdx, 2);

  const cd = root.children[1];
  t.is(cd.source.startIdx, 2);
  t.is(cd.source.endIdx, 4);
});

test('cst with lookahead', async t => {
  const g = await compileAndLoad('G {x = ~space any}');
  const input = 'a';
  t.is(matchWithInput(g, input), 1);

  // Currently positive lookahead doesn't bind anything!

  // - apply(x)
  //   - any
  //     - "a"

  // x
  const root = g._getCstRoot();
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
  const g = await compileAndLoad('G {x = "a".."z"}');
  t.is(matchWithInput(g, 'b'), 1);

  // x
  const root = g._getCstRoot();
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
  let g = await compileAndLoad('G {x = "a"?}');
  t.is(matchWithInput(g, 'a'), 1);

  // x
  let root = g._getCstRoot();
  t.is(root.matchLength, 1);
  t.is(root.ctorName, 'x');
  t.is(root.children.length, 1);

  // opt
  let opt = root.children[0];
  t.true(opt.isOptional());
  t.is(opt.ctorName, '_opt');
  t.true(opt.isPresent());
  t.false(opt.isEmpty());
  t.is(opt.children.length, 1);
  t.true(opt.children[0].isTerminal());
  t.is(opt.children[0].sourceString, 'a');

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

  g = await compileAndLoad('G {x = "a"?}');
  t.is(matchWithInput(g, ''), 1);

  // x

  root = g._getCstRoot();
  t.is(root.matchLength, 0);
  t.is(root.ctorName, 'x');
  t.is(root.children.length, 1);

  // opt

  opt = root.children[0];
  t.true(opt.isOptional());
  t.false(opt.isPresent());
  t.true(opt.isEmpty());
  t.is(opt.children.length, 0);
});

test('cst: opt ifPresent with value', async t => {
  const g = await compileAndLoad('G { start = "x"? }');
  t.is(matchWithInput(g, 'x'), 1);
  const opt = g._getCstRoot().children[0];
  t.is(
    opt.ifPresent(child => child.sourceString + '!'),
    'x!'
  );
});

test('cst: opt ifPresent when absent with orElse', async t => {
  const g = await compileAndLoad('G { start = "x"? }');
  t.is(matchWithInput(g, ''), 1);
  const opt = g._getCstRoot().children[0];
  const val = opt.ifPresent(
    child => child.sourceString,
    () => 'default'
  );
  t.is(val, 'default');
});

test('cst: opt ifPresent when absent without orElse', async t => {
  const g = await compileAndLoad('G { start = "x"? }');
  t.is(matchWithInput(g, ''), 1);
  const opt = g._getCstRoot().children[0];
  t.is(
    opt.ifPresent(child => child.sourceString),
    undefined
  );
});

test('cst for plus', async t => {
  const g = await compileAndLoad('G {x = "a"+}');
  t.is(matchWithInput(g, 'a'), 1);

  // x

  const root = g._getCstRoot();
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
  const g = await compileAndLoad('G {x = "a"*}');
  t.is(matchWithInput(g, 'aaa'), 1);

  // - apply(start)
  //   - iter
  //     - "a"
  //     - "a"
  //     - "a"

  // start

  const root = g._getCstRoot();
  t.is(root.matchLength, 3);
  t.is(root.children.length, 1);
  t.is(root.ctorName, 'x');

  // list

  const list = root.children[0];
  t.true(list.isList());
  t.is(list.ctorName, '_list');
  t.is(list.children.length, 3);

  // Terminal children
  for (const child of list.children) {
    t.is(child.isTerminal(), true);
    t.is(child.matchLength, 1);
    t.is(child.sourceString, 'a');
  }
});

test('cst: star with no matches', async t => {
  const g = await compileAndLoad('G { start = "x"* }');
  t.is(matchWithInput(g, ''), 1);
  const list = g._getCstRoot().children[0];
  t.true(list.isList());
  t.is(list.children.length, 0);
});

test('cst: ListNode.collect()', async t => {
  const g = await compileAndLoad('G { start = letter* }');
  t.is(matchWithInput(g, 'abc'), 1);
  const list = g._getCstRoot().children[0];
  t.deepEqual(
    list.collect(child => child.sourceString),
    ['a', 'b', 'c']
  );
});

test('repetition and lookahead', async t => {
  const g = await compileAndLoad('G {x = (~space any)*}');
  t.is(matchWithInput(g, 'abc'), 1);
});

test('cst with repetition and lookahead', async t => {
  let g = await compileAndLoad('G {x = (~space any)*}');
  let input = 'abc';
  t.is(matchWithInput(g, input), 1);

  // x
  const root = g._getCstRoot();
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

  g = await compileAndLoad('G {x = (~space any)+ spaces any+}');
  input = '/ab xy';
});

test('cst: multi-column star', async t => {
  const g = await compileAndLoad('G { start = (letter digit)* }');
  t.is(matchWithInput(g, 'a1b2'), 1);
  const list = g._getCstRoot().children[0];
  t.true(list.isList());
  t.is(list.children.length, 2);

  const row1 = list.children[0];
  t.true(row1.isSeq());
  t.is(row1.ctorName, '_seq');
  t.is(row1.children.length, 2);
  t.is(row1.children[0].sourceString, 'a');
  t.is(row1.children[1].sourceString, '1');

  const row2 = list.children[1];
  t.true(row2.isSeq());
  t.is(row2.children[0].sourceString, 'b');
  t.is(row2.children[1].sourceString, '2');
});

test('cst: multi-column opt present', async t => {
  const g = await compileAndLoad('G { start = (letter digit)? }');
  t.is(matchWithInput(g, 'a1'), 1);
  const opt = g._getCstRoot().children[0];
  t.true(opt.isOptional());
  t.true(opt.isPresent());

  const seqChild = opt.children[0];
  t.true(seqChild.isSeq());
  t.is(seqChild.children.length, 2);
  t.is(seqChild.children[0].sourceString, 'a');
  t.is(seqChild.children[1].sourceString, '1');

  t.is(
    opt.ifPresent((letter, digit) => letter.sourceString + digit.sourceString),
    'a1'
  );
});

test('cst: multi-column opt absent', async t => {
  const g = await compileAndLoad('G { start = (letter digit)? }');
  t.is(matchWithInput(g, ''), 1);
  const opt = g._getCstRoot().children[0];
  t.true(opt.isOptional());
  t.true(opt.isEmpty());
});

test('wasm: one-char terminals', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
});
test('wasm: multi-char terminals', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "123"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '123'), 1);
});

test('wasm: handle end', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '123'), 0);
});

test('wasm: choice', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1" | "2"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '2'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, '3'), 0);
});

test('wasm: more choice', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "12" | "13" | "14"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '14'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 1);
  t.is(matchWithInput(wasmGrammar, '15'), 0);
});

test('wasm: sequence', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1" "2"
            | "130" ""
    }
  `);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '130'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 0);
});

test('wasm: choice + sequence', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1" ("2" | "3")
            | "14" ""
    }
  `);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 1);
  t.is(matchWithInput(wasmGrammar, '14'), 1);
  t.is(matchWithInput(wasmGrammar, '15'), 0);
});

test('wasm: rule application', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = one two -- x
            | three
      one = "1"
      two = "II" | "2"
      three = "3"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '1II'), 1);
  t.is(matchWithInput(wasmGrammar, '3'), 1);
  t.is(matchWithInput(wasmGrammar, '13'), 0);
});

test('wasm: star', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1"*
    }
  `);
  t.is(matchWithInput(wasmGrammar, '111'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 1);
  t.is(matchWithInput(wasmGrammar, '2'), 0);

  const wasmGrammar2 = await compileAndLoad(`
    G {
      start = "123"* "1"
    }
  `);
  t.is(matchWithInput(wasmGrammar2, '1'), 1);
  t.is(matchWithInput(wasmGrammar2, '1231'), 1);
  t.is(matchWithInput(wasmGrammar2, ''), 0);
  t.is(matchWithInput(wasmGrammar2, '2'), 0);
});

test('wasm: plus', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1"+
    }
  `);
  t.is(matchWithInput(wasmGrammar, '111'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);
  t.is(matchWithInput(wasmGrammar, '2'), 0);
});

test('wasm: lookahead', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = &"1" "1"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, '2'), 0);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('wasm: negative lookahead', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = ~"1" "2"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '2'), 1);
  t.is(matchWithInput(wasmGrammar, '12'), 0);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('wasm: opt', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "1"? "2"
    }
  `);
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(matchWithInput(wasmGrammar, '2'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('wasm: range', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "a".."z"
    }
  `);
  t.is(matchWithInput(wasmGrammar, 'a'), 1);
  t.is(matchWithInput(wasmGrammar, 'm'), 1);
  t.is(matchWithInput(wasmGrammar, 'z'), 1);
  t.is(matchWithInput(wasmGrammar, 'A'), 0);
  t.is(matchWithInput(wasmGrammar, '1'), 0);
});

test('wasm: any', async t => {
  const wasmGrammar = await compileAndLoad('G { start = any }');
  t.is(matchWithInput(wasmGrammar, 'a'), 1);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(matchWithInput(wasmGrammar, ' '), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);

  const wasmGrammar2 = await compileAndLoad('G { start = any* }');
  t.is(matchWithInput(wasmGrammar2, 'a'), 1);
  t.is(matchWithInput(wasmGrammar2, ''), 1);
});

test('wasm: end', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = "a" end
    }
  `);
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

  const wasmGrammar = await legacyGrammarToWasm(g);
  t.is(matchWithInput(wasmGrammar, '/quickjs eval source: "1 + 1"'), 1);
  start = performance.now();
  t.is(matchWithInput(wasmGrammar, longInput), 1);
  t.log(`Wasm match time: ${(performance.now() - start).toFixed(2)}ms`);
});

test('basic memoization', async t => {
  const wasmGrammar = await compileAndLoad('G { start = "a" b\nb = "b" }');
  t.is(matchWithInput(wasmGrammar, 'ab'), 1);

  const getMemo = (pos, ctorName) => {
    const ruleId = checkNotNull(wasmGrammar._ruleIds.get(ctorName));
    return getMemoEntry(wasmGrammar, pos, ruleId);
  };

  const root = wasmGrammar._getCstRoot();

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

  // `b` is applied only once, so it's not memoized.
  t.is(getMemo(1, 'b'), 0);
  // `start` is the start rule, so it's always memoized.
  t.is(getMemo(0, 'start'), root._base);
});

test('more memoization', async t => {
  const wasmGrammar = await compileAndLoad('G { start = b "a" | b b\nb = "b" }', {
    preallocNodes: false,
  });
  t.is(matchWithInput(wasmGrammar, 'bb'), 1);

  const getMemo = (pos, ctorName) => {
    const ruleId = checkNotNull(wasmGrammar._ruleIds.get(ctorName));
    return getMemoEntry(wasmGrammar, pos, ruleId);
  };

  // start
  const root = wasmGrammar._getCstRoot();
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
    const wasmGrammar = await compileAndLoad(`
      G {
        start = twice<x>
        x = "x"
        twice<exp> = exp exp
      }`);
    t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  }
  {
    // Make sure that parameterized applications are not incorrectly memoized.
    const wasmGrammar = await compileAndLoad(`
      G {
        start = ~narf<x> narf<y>
        narf<thing> = thing
        x = "x"
        y = "y"

      }`);
    t.is(matchWithInput(wasmGrammar, 'y'), 1);
  }
});

test('parameterized rules (hard)', async t => {
  {
    // Terminal as param, must be lifted.
    const wasmGrammar = await compileAndLoad(`
      G {
        start = indirect<"x">
        indirect<e> = twice<e>
        twice<exp> = exp exp
      }`);
    t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  }
  {
    // What's interesting here? In the body of `narf`:
    // - `(c|b)` will need to be lifted
    // - the params b, c appear out of order
    // - `a` is unused
    const wasmGrammar = await compileAndLoad(`
      G {
        start = narf<"x", "y", "z">
        narf<a, b, c> = twice<(c|b)>
        twice<exp> = exp exp
      }`);
    t.is(matchWithInput(wasmGrammar, 'yz'), 1);
  }
  {
    // Parameterized applications as args!
    const wasmGrammar = await compileAndLoad(`
      G {
        start = once<reversed<"a", "b", "c">>
              | "cool"
        once<a> = a
        reversed<a, b, c> = c b a
      }`);
    t.is(matchWithInput(wasmGrammar, 'cool'), 1);
  }
  {
    // Same param appearing twice in a lifted expression.
    const wasmGrammar = await compileAndLoad(`
      G {
        start = narf<"a">
        narf<exp> = once<(exp | exp)>
        once<a> = a
      }`);
    t.is(matchWithInput(wasmGrammar, 'a'), 1);
  }
});

test('parameterized rules - problematic', async t => {
  // Apply w/ arg that's not a Param from the enclosing scope.
  const wasmGrammar = await compileAndLoad(`
      G {
        start = narf<"{", "}">
        narf<open, close> = open twice<digit> close
        twice<exp> = exp exp
      }`);
  t.is(matchWithInput(wasmGrammar, '{99}'), 1);
});

test('parameterized rules w/ many params', async t => {
  // Terminal as param, must be lifted.
  const wasmGrammar = await compileAndLoad(`
    G {
      start = reversed<"v", "w", "x", "y", "z">
      reversed<a, b, c, d, e> = e d c b a
    }`);
  t.is(matchWithInput(wasmGrammar, 'zyxwv'), 1);
});

test('basic left recursion', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      number = number "1" -- rec
             | "1"
    }`);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
});

test('tricky left recursion', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      number = number "1" -- rec
             | number "2" -- rec2
             | "1"
    }`);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(unparse(wasmGrammar), '1');
  t.is(matchWithInput(wasmGrammar, '12'), 1);
  t.is(unparse(wasmGrammar), '12');
  t.is(matchWithInput(wasmGrammar, '11212'), 1);
  t.is(unparse(wasmGrammar), '11212');
});

test('tricky left recursion #2', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      number = number digit -- rec
             | number "2" -- rec2
             | digit
      digit := digit "1" -- rec
             | "1"
    }`);
  t.is(matchWithInput(wasmGrammar, '1'), 1);
  t.is(unparse(wasmGrammar), '1');

  t.is(matchWithInput(wasmGrammar, '11'), 1);
  t.is(unparse(wasmGrammar), '11');

  t.is(matchWithInput(wasmGrammar, '1112111'), 1);
  t.is(unparse(wasmGrammar), '1112111');
});

test('arithmetic', async t => {
  const wasmGrammar = await compileAndLoad(`
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
  t.is(matchWithInput(wasmGrammar, '1+276*(3+4)'), 1);
  t.is(unparse(wasmGrammar), '1+276*(3+4)');
  t.is(matchWithInput(wasmGrammar, '1'), 1);
});

test('overriding a built-in rule', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      start = digit+
      digit += "x"
    }`);
  t.is(matchWithInput(wasmGrammar, '123'), 1);
  t.is(matchWithInput(wasmGrammar, 'x'), 1);
  t.is(matchWithInput(wasmGrammar, '1x2'), 1);
  t.is(matchWithInput(wasmGrammar, 'abc'), 0);
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
  compiler.lowerToIR();
  compiler.specializeRules();

  const noGeneralizedRulesList = [
    '$spaces',
    'commaSep<exclaimed<"hello">>',
    'emptyListOf<exclaimed<"hello">,",">',
    'exclaimed<"hello">',
    'exclaimed<hello2>',
    'exclaimed<hello>',
    'flip<exclaimed<hello2>,hello>',
    'hello',
    'hello2',
    'listOf<exclaimed<"hello">,",">',
    'nonemptyListOf<exclaimed<"hello">,",">',
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
  const wasmGrammar = await compileAndLoad(`
    G {
      start = two<"x"> | one<"y">
      one<t> = t
      two<t> = t t
    }`);
  t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  t.is(matchWithInput(wasmGrammar, 'y'), 1);
  t.is(matchWithInput(wasmGrammar, 'yy'), 0);
});

test('basic space skipping', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = ">" (digit "a".."z")*
    }`);
  t.is(matchWithInput(wasmGrammar, '> 0 a 1 b'), 1);
  t.is(matchWithInput(wasmGrammar, ' > 0 a 1 b '), 1);

  const [term, list] = wasmGrammar._getCstRoot().children;
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
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = two<"x">
      two<t> = t t
    }`);
  t.is(matchWithInput(wasmGrammar, 'xx'), 1);
  t.is(matchWithInput(wasmGrammar, ' xx'), 1);
  t.is(matchWithInput(wasmGrammar, 'x x'), 0);
});

test('space skipping w/ params', async t => {
  // Make sure space is skipped before params in the body of syntactic rule.
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = Reversed<(x | "x"), y, "z".."z"> Reversed<z, y, x>
      Reversed<a, b, c> = c b a
      x = "x"
      y = "y"
      z = "z"
    }`);
  t.is(matchWithInput(wasmGrammar, ' z y x xyz'), 1);
});

test('space skipping & lex', async t => {
  {
    const wasmGrammar = await compileAndLoad('G { start = ">" digit+ #(space) }');
    t.is(matchWithInput(wasmGrammar, '> 0 9 '), 0);
  }
  {
    const wasmGrammar = await compileAndLoad('G { Start = ">" digit+ #(space) }');
    t.is(matchWithInput(wasmGrammar, '> 0 9 '), 1, "iter doesn't consume trailing space");
  }
  {
    const wasmGrammar = await compileAndLoad('G { Start = ">" &digit #(space digit) }');
    t.is(matchWithInput(wasmGrammar, '> 9'), 1, "lookahead doesn't consume anything");
  }
  {
    const wasmGrammar = await compileAndLoad('G { Start = ">" ~"x" #(space digit) }');
    t.is(matchWithInput(wasmGrammar, '> 9'), 1, "neg lookahead doesn't consume anything");
  }
});

test('lex (#) syntax', async t => {
  // Lex prevents space skipping inside, even in a syntactic rule.
  const g = await compileAndLoad('G { Start = #(letter+) }');
  t.is(matchWithInput(g, 'abc'), 1);
  t.is(matchWithInput(g, 'a b c'), 0, 'spaces not allowed inside lex');

  // Lex with a sequence
  const g2 = await compileAndLoad('G { Start = #(letter digit) }');
  t.is(matchWithInput(g2, 'a1'), 1);
  t.is(matchWithInput(g2, 'a 1'), 0, 'spaces not allowed inside lex sequence');

  // Lex with a terminal
  const g3 = await compileAndLoad('G { Start = #("abc") }');
  t.is(matchWithInput(g3, 'abc'), 1);
  t.is(matchWithInput(g3, 'a b c'), 0);
});

// Because fast-check's `stringMatching` doesn't support unicode regexes.
const arbitraryStringMatching = regex =>
  fc.string({maxLength: 2, unit: 'binary'}).filter(str => regex.test(str));

test('unicode built-ins: non-ASCII (fast-check)', async t => {
  const wasmGrammar = await compileAndLoad('G { Start = letter letter }');
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
  const wasmGrammar = await compileAndLoad('G { Start = letter letter }');
  t.true(wasmGrammar.match('㐀𝐀').succeeded());
});

test('caseInsensitive', async t => {
  // Make sure space is skipped before params in the body of syntactic rule.
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = "." caseInsensitive<"blah!">
    }`);
  t.is(matchWithInput(wasmGrammar, '.BlaH!'), 1);

  t.is(matchWithInput(wasmGrammar, '. BlaH! '), 1);
  t.is(unparse(wasmGrammar), '. BlaH!'); // Trailing space is lost, who cares.

  t.is(matchWithInput(wasmGrammar, '.BLAH!'), 1);
});

test('caseInsensitive: Unicode', async t => {
  // Accented Latin characters
  const wg1 = await compileAndLoad('G { start = caseInsensitive<"café"> }');
  t.is(matchWithInput(wg1, 'café'), 1);
  t.is(matchWithInput(wg1, 'CAFÉ'), 1);
  t.is(matchWithInput(wg1, 'Café'), 1);
  t.is(matchWithInput(wg1, 'caff'), 0);

  // Cyrillic
  const wg2 = await compileAndLoad('G { start = caseInsensitive<"Привет"> }');
  t.is(matchWithInput(wg2, 'Привет'), 1);
  t.is(matchWithInput(wg2, 'привет'), 1);
  t.is(matchWithInput(wg2, 'ПРИВЕТ'), 1);
  t.is(matchWithInput(wg2, 'Привеx'), 0);

  // Mixed ASCII + non-ASCII
  const wg3 = await compileAndLoad('G { start = caseInsensitive<"naïve"> }');
  t.is(matchWithInput(wg3, 'naïve'), 1);
  t.is(matchWithInput(wg3, 'NAÏVE'), 1);
  t.is(matchWithInput(wg3, 'Naïve'), 1);
  t.is(matchWithInput(wg3, 'naive'), 0);
});

test('unicode', async t => {
  const source = 'Nöö';
  const g = await compileAndLoad('G { Start = any* }');
  t.is(matchWithInput(g, source), 1);
  t.is(unparse(g), source);
});

test('unmanaged MatchResult throws', async t => {
  const g = await compileAndLoad('G { Start = (letter digit)? }');

  // succeeded()/failed() work without .use() for a single match.
  const r = g.match('');
  t.true(r.succeeded());

  // Calling match() without managing the previous result throws.
  t.throws(() => g.match(''), {message: /unmanaged/});

  // Cleaning up with use() works.
  r.use(() => {});

  // After cleanup, a new match works fine.
  t.notThrows(() => g.match('').use(() => {}));
});

// The `using` syntax requires Node >= 24 (V8 >= 13).
// eslint-disable-next-line no-undef
const nodeMajor = Number(process.versions.node.split('.')[0]);
if (nodeMajor >= 24) {
  await import('./_test-v24.js');
}

test('nested matching with use()', async t => {
  const g = await compileAndLoad('G { Start = letter+ | digit+ }');

  g.match('abc').use(outer => {
    const outerCst = outer.getCstRoot();
    g.match('1234').use(inner => {
      t.is(inner.getCstRoot().sourceString, '1234');
      // Both CSTs valid simultaneously.
      t.is(outerCst.sourceString, 'abc');
    });
    // Outer CST still valid after inner use() ends.
    t.is(outerCst.sourceString, 'abc');
  });
});

test('matching at end', async t => {
  const wasmGrammar = await compileAndLoad(`
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
  t.is(matchWithInput(wasmGrammar, ''), 0);
});

test('any consumes an entire code point', async t => {
  const g = await compileAndLoad('G { start = any }');
  t.assert('😇'.length === 2);
  t.true(g.match('😇').succeeded());
});

test('ranges w/ code points > 0xFFFF', async t => {
  const g = await compileAndLoad(`
    G {
      start = "😇".."😈"
    }
  `);

  // Every emoji by code point: https://emojipedia.org/emoji/
  t.is(matchWithInput(g, '😆'), 0); // just below
  t.is(matchWithInput(g, '😇'), 1);
  t.is(matchWithInput(g, '😈'), 1);
  t.is(matchWithInput(g, '😉'), 0); // just above

  // BMP chars should not match a supplementary-only range.
  t.is(matchWithInput(g, 'x'), 0);
});

test('shortMessage (basic)', async t => {
  const g = await compileAndLoad(`
    G {
      start = "one" | two | three
      two = "two"
      three (eine Drei) = "three"
    }
  `);
  const result = g.match('four');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  t.true(msg.includes('"one"'));
  t.true(msg.includes('"two"'));
});

test('shortMessage (descriptions)', async t => {
  const g = await compileAndLoad(`
    G {
      start (a start) = "x" "one"
    }
  `);
  const result = g.match('xx');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  t.false(msg.includes('"one"'));
  t.true(msg.includes('a start'));
});

test('shortMessage (descriptions): multiple described rules in choice', async t => {
  const g = await compileAndLoad(`
    G {
      start = foo | bar
      foo (a foo) = "foo"
      bar (a bar) = "bar"
    }
  `);
  const result = g.match('baz');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // Both descriptions should appear since both failed at position 0
  t.true(msg.includes('a foo'));
  t.true(msg.includes('a bar'));
});

test('shortMessage (descriptions): nested described rules', async t => {
  const g = await compileAndLoad(`
    G {
      start (a start) = inner
      inner (an inner) = "x" "y"
    }
  `);
  const result = g.match('xz');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // The outer description should swallow the inner one
  t.true(msg.includes('a start'));
  t.false(msg.includes('an inner'));
});

test('shortMessage (descriptions): description on successful prefix', async t => {
  const g = await compileAndLoad(`
    G {
      start = foo "end"
      foo (a foo) = "foo"
    }
  `);
  const result = g.match('foox');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // foo succeeded, so its description shouldn't appear
  t.false(msg.includes('a foo'));
  t.true(msg.includes('"end"'));
});

test('shortMessage (descriptions): description with repetition', async t => {
  const g = await compileAndLoad(`
    G {
      start = item+ "end"
      item (an item) = "x"
    }
  `);
  const result = g.match('xxxy');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  // After matching some items, we fail - should see "end" expected
  t.true(msg.includes('"end"'));
});

test('shortMessage (descriptions): lexical rule with description', async t => {
  const g = await compileAndLoad(`
    G {
      Start = num
      num (a number) = digit+
    }
  `);
  const result = g.match('abc');
  t.false(result.succeeded());
  const msg = result.shortMessage;
  t.true(msg.includes('a number'));
  t.false(msg.includes('digit'));
});

test('shortMessage (descriptions): rightmost failure wins', async t => {
  const g = await compileAndLoad(`
    G {
      start = foo | "abc"
      foo (a foo) = "ab" "x"
    }
  `);
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
    const wasmG = await legacyGrammarToWasm(ohmG);

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
    // Negated compound (Alt inside Not):
    ['G { start = ~(space | "\'") any }', ' ', '~Alt(Apply,Terminal)'],
    ['G { start = ~(space | "\'" | "{{") any }', ' ', '~Alt(Apply,Terminal,Terminal)'],
    ['G { start = ~("a".."z" | "0".."9") "!" }', 'a', '~Alt(Range,Range)'],
  ];

  for (const [source, input, desc] of testCases) {
    const ohmG = ohm.grammar(source);
    const wasmG = await legacyGrammarToWasm(ohmG);

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
    const wasmG = await legacyGrammarToWasm(ohmG);

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

test('accessing .message on disposed MatchResult throws', async t => {
  const wasmGrammar = await compileAndLoad('G { start = "a" "b" "c" }');

  const input = 'ab'; // Missing "c"

  let savedResult;
  wasmGrammar.match(input).use(r => {
    t.true(r.failed(), 'wasm match should fail');
    savedResult = r;
  });

  // Accessing .message after dispose should throw
  t.throws(() => savedResult.message, {
    message: /Cannot access.*after MatchResult has been disposed/,
  });
});

test('accessing CST node after dispose throws', async t => {
  const wasmGrammar = await compileAndLoad('G { start = "a" "b" "c" }');

  let savedCst;
  wasmGrammar.match('abc').use(r => {
    t.true(r.succeeded(), 'match should succeed');
    savedCst = r.getCstRoot();
    // Accessing CST inside use() should work fine.
    t.is(savedCst.sourceString, 'abc');
  });

  // Accessing CST node properties after dispose should throw a RangeError,
  // because the DataView has been replaced with a zero-length one.
  t.throws(() => savedCst.children, {instanceOf: RangeError});
  t.throws(() => savedCst.matchLength, {instanceOf: RangeError});
});

test('accessing .message inside use() works correctly', async t => {
  const ohmGrammar = ohm.grammar('G { start = "a" "b" "c" }');
  const wasmGrammar = await legacyGrammarToWasm(ohmGrammar);

  const input = 'ab'; // Missing "c"

  const ohmResult = ohmGrammar.match(input);
  const wasmResult = wasmGrammar.match(input);

  wasmResult.use(() => {
    t.true(ohmResult.failed(), 'ohm-js match should fail');
    t.true(wasmResult.failed(), 'wasm match should fail');

    t.is(wasmResult.message, ohmResult.message, 'error messages should be identical');
  });
});

// --- Ohm meta-grammar ---

test('compile and use the Ohm meta-grammar', async t => {
  const wasmGrammar = await legacyGrammarToWasm(ohm.ohmGrammar);

  // Should parse valid grammars
  const inputs = [
    'G { start = "hello" }',
    'G { start = "a" | "b" | "c" }',
    'G { start = letter+ }',
    'G { x = "a".."z" }',
    'G { start = ListOf<letter, ","> }',
    'G <: Base { start = "x" }',
    'G { start = "a" -- first\n| "b" -- second\n}',
    'G <: Base { start := "new" }',
    'G <: Base { start += "extra" }',
    'G { start (a start rule) = "x" }',
    'G { /* comment */ start = "x" // line comment\n}',
    'G { start = "hello\\nworld" }',
    'G { start = "\\u0041" }',
    'G { x = "\\u{1F600}" }',
    'G { start = &"a" letter }',
    'G { start = ~"a" letter }',
    'G { Start = #(letter+) }',
    'A { x = "a" }\nB <: A { y = "b" }',
    '', // empty input — zero grammars
  ];

  for (const input of inputs) {
    t.is(matchWithInput(wasmGrammar, input), 1, `should pass: ${JSON.stringify(input)}`);
  }

  // Should reject invalid grammars
  const badInputs = ['G { start "hello" }', 'G { start = "hello"'];

  for (const input of badInputs) {
    t.is(matchWithInput(wasmGrammar, input), 0, `should fail: ${JSON.stringify(input)}`);
  }
});

// --- Transitive prealloc tests ---

test('transitive prealloc: simple delegation', async t => {
  const wasmGrammar = await compileAndLoad('G { start = myDigit myDigit\nmyDigit = digit }');
  t.is(matchWithInput(wasmGrammar, '42'), 1);

  const root = wasmGrammar._getCstRoot();
  t.is(root.ctorName, 'start');
  t.is(root.children.length, 2);

  const [d1, d2] = root.children;
  t.is(d1.ctorName, 'myDigit');
  t.is(d1.matchLength, 1);
  t.is(d1.children.length, 1);
  t.is(d1.children[0].ctorName, 'digit');

  t.is(d2.ctorName, 'myDigit');
  t.is(d2.matchLength, 1);
  t.is(d2.children.length, 1);
  t.is(d2.children[0].ctorName, 'digit');
});

test('transitive prealloc: chained delegation', async t => {
  const wasmGrammar = await compileAndLoad('G { start = a a\na = b\nb = digit }');
  t.is(matchWithInput(wasmGrammar, '73'), 1);

  const root = wasmGrammar._getCstRoot();
  t.is(root.children.length, 2);

  const [c1] = root.children;
  t.is(c1.ctorName, 'a');
  t.is(c1.matchLength, 1);
  t.is(c1.children.length, 1);
  t.is(c1.children[0].ctorName, 'b');
  t.is(c1.children[0].matchLength, 1);
  t.is(c1.children[0].children[0].ctorName, 'digit');
});

test('transitive prealloc: surrogate pair fallback', async t => {
  // When a transitive prealloc rule matches a surrogate pair (matchLength=2),
  // it should fall back to dynamic allocation.
  const wasmGrammar = await compileAndLoad('G { start = myAny\nmyAny = any }');

  // BMP character — should use prealloc
  t.is(matchWithInput(wasmGrammar, 'a'), 1);
  const root1 = wasmGrammar._getCstRoot();
  t.is(root1.ctorName, 'start');
  t.is(root1.children[0].ctorName, 'myAny');
  t.is(root1.children[0].matchLength, 1);

  // Non-BMP character (surrogate pair) — should fall back to dynamic alloc
  t.is(matchWithInput(wasmGrammar, '\u{1F600}'), 1);
  const root2 = wasmGrammar._getCstRoot();
  t.is(root2.ctorName, 'start');
  t.is(root2.children[0].ctorName, 'myAny');
  t.is(root2.children[0].matchLength, 2);
});

test('transitive prealloc: interaction with single-use inlining', async t => {
  // When the inner rule is inlined (single-use), transitive prealloc should
  // NOT apply. The rule should still work correctly via dynamic allocation.
  const wasmGrammar = await compileAndLoad(
    'G { start = wrapper\nwrapper = inner\ninner = digit }'
  );
  t.is(matchWithInput(wasmGrammar, '5'), 1);

  const root = wasmGrammar._getCstRoot();
  t.is(root.ctorName, 'start');
  t.is(root.children[0].ctorName, 'wrapper');
  t.is(root.children[0].children[0].ctorName, 'inner');
  t.is(root.children[0].children[0].children[0].ctorName, 'digit');
});

test('repeated matches do not leak memory', async t => {
  const wasmGrammar = await compileAndLoad('G { Start = letter+ ";" }');

  const {__offset} = wasmGrammar._instance.exports;

  // Run one match to warm up (allocates initial structures).
  wasmGrammar.match('abc;').use(r => t.true(r.succeeded()));
  const baselineOffset = __offset.value;

  // Run many matches — each should be fully reclaimed by dispose().
  for (let i = 0; i < 200; i++) {
    wasmGrammar.match('hello;').use(r => t.true(r.succeeded()));
  }

  t.is(
    __offset.value,
    baselineOffset,
    'heap offset should return to baseline after disposing all matches'
  );
});

test('bindings chunks contain valid CST nodes and tagged terminals', async t => {
  // Use a grammar with iteration to generate many bindings during parsing.
  const wasmGrammar = await compileAndLoad('G { Start = item+\nitem = letter }');

  // Match a long enough string to spill into multiple chunks (capacity=128).
  t.is(matchWithInput(wasmGrammar, 'a'.repeat(150)), 1);

  const {memory, bindingsChunk} = wasmGrammar._instance.exports;
  const view = new DataView(memory.buffer);

  const CHUNK_HEADER = 8; // prev (i32) + next (i32)
  const CHUNK_CAPACITY = 128;

  // Walk backwards from bindingsChunk to find the first chunk.
  let firstChunk = bindingsChunk.value;
  while (view.getInt32(firstChunk, true) !== 0) {
    firstChunk = view.getInt32(firstChunk, true);
  }

  // Checks that a value is a valid CST node pointer or tagged terminal.
  function isValidBinding(val) {
    // Tagged terminal: bit 0 = 1 (bit 1 may also be set as edge flag).
    if (val & 1) return true;
    // Strip HAS_LEADING_SPACES edge flag (bit 1) before checking alignment.
    const ptr = val & ~2;
    // CST node pointer: must be 4-byte aligned.
    if ((ptr & 3) !== 0) return false;
    // Read the CST node header and sanity-check.
    const matchLength = view.getInt32(ptr, true);
    const count = view.getInt32(ptr + 8, true);
    return matchLength >= 0 && count >= 0;
  }

  // Walk forward through all chunks. Every non-zero slot should be a valid
  // CST node or tagged terminal, since memory is never freed.
  let chunk = firstChunk;
  let numChunks = 0;
  let totalNonZero = 0;
  while (chunk !== 0) {
    // Verify prev/next consistency.
    const prev = view.getInt32(chunk, true);
    const next = view.getInt32(chunk + 4, true);
    if (numChunks === 0) {
      t.is(prev, 0, 'first chunk prev should be 0');
    }
    if (next !== 0) {
      t.is(view.getInt32(next, true), chunk, 'next chunk prev should point back');
    }

    for (let i = 0; i < CHUNK_CAPACITY; i++) {
      const val = view.getInt32(chunk + CHUNK_HEADER + i * 4, true);
      if (val === 0) continue;
      totalNonZero++;
      t.true(isValidBinding(val));
    }

    numChunks++;
    chunk = next;
  }
  t.true(numChunks >= 2, `should have at least two chunks (got ${numChunks})`);
  t.true(totalNonZero >= 1, 'should have found at least one non-zero binding');
});

function hexDump(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const parts = [];
  for (let i = 0; i + 4 <= bytes.length; i += 4) {
    parts.push(view.getUint32(i, true).toString(16).padStart(8, '0'));
  }
  return parts.join(' ');
}

test('snapshot: raw heap after match', async t => {
  const wasmGrammar = await compileAndLoad('G { start = "a" b\nb = "b" }');

  const {memory, __offset} = wasmGrammar._instance.exports;

  wasmGrammar.match('ab').use(r => {
    t.true(r.succeeded());

    // Capture the heap region allocated during this match.
    const heapStart = r._heapWatermark;
    const heapEnd = __offset.value;
    const bytes = new Uint8Array(memory.buffer, heapStart, heapEnd - heapStart);
    t.snapshot(hexDump(bytes));
  });
});

test('chunkedBindings: false', async t => {
  const wasmGrammar = await compileAndLoad('G { Start = letter+ ";" }', {
    chunkedBindings: false,
  });

  t.is(matchWithInput(wasmGrammar, 'abc;'), 1);
  t.is(matchWithInput(wasmGrammar, ''), 0);
  t.is(matchWithInput(wasmGrammar, 'abc;'), 1);

  const root = wasmGrammar._getCstRoot();
  t.is(root.ctorName, 'Start');
  t.is(root.children.length, 2);
  t.is(root.children[0].sourceString, 'abc');

  // Run multiple matches to verify no leak / crash.
  for (let i = 0; i < 50; i++) {
    wasmGrammar.match('hello;').use(r => t.true(r.succeeded()));
  }
});

// When parameters grow at each recursive step — e.g., grow<(e | "x")> where
// e keeps expanding — each specialization produces a new unique name, so the
// placeholder cycle detection never fires. The specializer should detect this
// and throw a clear error rather than blowing the stack / running out of memory.
test('parameterized rules: growing parameters should not blow the stack', t => {
  t.throws(
    () => {
      const compiler = new Compiler(
        ohm.grammar(`
        G {
          start = grow<"a">
          grow<e> = e | grow<(e | "x")>
        }
      `)
      );
      compiler.compile();
    },
    {message: /Excessively deep specialization/}
  );
});

test('leadingSpaces in a lexical context', async t => {
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = ">" "a" digit
            | ">" #(" a" letter)
    }
  `);
  t.is(matchWithInput(wasmGrammar, '> ab'), 1);
  const root = wasmGrammar._getCstRoot();
  t.is(root.ctorName, 'Start');
  const [_, a, letter] = root.children; // eslint-disable-line no-unused-vars
  t.falsy(a.leadingSpaces);
  t.falsy(letter.leadingSpaces);
});

test('leadingSpaces suppressed in nested #(letter+)', async t => {
  // #() includes the space in the literal so the lex context starts at the space.
  // letter+ children inside #() should have no leadingSpaces.
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = ">" #(" " letter+)
    }
  `);
  t.is(matchWithInput(wasmGrammar, '> abc'), 1);
  const root = wasmGrammar._getCstRoot();
  // root.children: [">", " ", letter+]
  const letterPlus = root.children[2];
  t.is(letterPlus.ctorName, '_list');
  for (const child of letterPlus.children) {
    t.falsy(child.leadingSpaces, `child "${child.sourceString}" should have no leadingSpaces`);
  }
});

test('edge flag: tagged terminal decoding with HAS_LEADING_SPACES bit', async t => {
  // When a tagged terminal has the edge flag set (bit 1), the reader
  // must still correctly decode its matchLength (>> 2, not >> 1).
  // ">" is a 1-char literal outside #(), so its tagged value is
  // (1 << 2) | 3 = 7 (with HAS_LEADING_SPACES edge flag).
  const wasmGrammar = await compileAndLoad(`
    G {
      Start = ">" #(" ab" letter)
    }
  `);
  t.is(matchWithInput(wasmGrammar, '> abc'), 1);
  const root = wasmGrammar._getCstRoot();
  const [gt, ab, letter] = root.children;
  // " ab" is a tagged terminal inside #(), so it does NOT have the edge flag.
  t.is(ab.sourceString, ' ab');
  t.is(ab.matchLength, 3);
  t.falsy(ab.leadingSpaces);
  // ">" is outside #(), so it has HAS_LEADING_SPACES_EDGE.
  t.is(gt.sourceString, '>');
  t.is(letter.sourceString, 'c');
  t.falsy(letter.leadingSpaces);
});
