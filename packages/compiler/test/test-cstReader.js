import test from 'ava';
import * as fc from 'fast-check';

import {createHandle, createReader, CstNodeType} from '../../runtime/src/cstReader.ts';
import {compileAndLoad, matchWithInput} from './_helpers.js';

const childrenOf = (reader, handle, i) => {
  const arr = [];
  reader.forEachChild(handle, c => arr.push(c));
  return arr;
};

test('root node basics', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  t.is(matchWithInput(g, 'abcd'), 1);

  g.match('abcd').use(mr => {
    const reader = createReader(mr);
    t.is(reader.type(reader.root), CstNodeType.NONTERMINAL);
    t.is(reader.matchLength(reader.root), 4);
    t.is(reader.ctorName(reader.root), 'start');
    t.is(reader.childCount(reader.root), 2);
    t.is(reader.input, 'abcd');
    t.is(reader.sourceString(reader.root), 'abcd');
    t.is(reader.startIdx(reader.root), 0);
  });
});

test('terminal children', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  g.match('abcd').use(mr => {
    const reader = createReader(mr);
    const children = [];
    reader.forEachChild(reader.root, (child, leadingSpaces, startIdx, index) => {
      children.push({child, leadingSpaces, startIdx, index});
    });
    t.is(children.length, 2);

    // First child: "ab"
    t.is(reader.type(children[0].child), CstNodeType.TERMINAL);
    t.is(reader.matchLength(children[0].child), 2);
    t.is(reader.ctorName(children[0].child), '_terminal');
    t.is(reader.sourceString(children[0].child), 'ab');
    t.is(children[0].leadingSpaces, 0);
    t.is(children[0].index, 0);

    // Second child: "cd"
    t.is(reader.type(children[1].child), CstNodeType.TERMINAL);
    t.is(reader.matchLength(children[1].child), 2);
    t.is(reader.sourceString(children[1].child), 'cd');
    t.is(children[1].index, 1);
  });
});

test('nonterminal children', async t => {
  const g = await compileAndLoad('G { start = a b\na = "x"\nb = "y" }');
  g.match('xy').use(mr => {
    const reader = createReader(mr);
    const children = [];
    reader.forEachChild(reader.root, (child, ls, startIdx, i) => {
      children.push({child, ls, startIdx, i});
    });
    t.is(children.length, 2);
    t.is(reader.ctorName(children[0].child), 'a');
    t.is(reader.ctorName(children[1].child), 'b');
    t.is(reader.type(children[0].child), CstNodeType.NONTERMINAL);
    t.is(reader.type(children[1].child), CstNodeType.NONTERMINAL);
    t.is(reader.sourceString(children[0].child), 'x');
    t.is(reader.sourceString(children[1].child), 'y');
  });
});

test('iteration (list) node', async t => {
  const g = await compileAndLoad('G { start = "a"* }');
  g.match('aaa').use(mr => {
    const reader = createReader(mr);
    let listHandle;
    reader.forEachChild(reader.root, child => {
      listHandle = child;
    });
    t.is(reader.type(listHandle), CstNodeType.LIST);
    t.is(reader.ctorName(listHandle), '_list');
    t.is(reader.childCount(listHandle), 3);

    const items = [];
    reader.forEachChild(listHandle, child => {
      items.push(reader.sourceString(child));
    });
    t.deepEqual(items, ['a', 'a', 'a']);
  });
});

test('iteration with nonterminals', async t => {
  const g = await compileAndLoad('G { start = letter* }');
  g.match('abc').use(mr => {
    const reader = createReader(mr);
    let listHandle;
    reader.forEachChild(reader.root, child => {
      listHandle = child;
    });
    t.is(reader.type(listHandle), CstNodeType.LIST);
    const items = [];
    reader.forEachChild(listHandle, child => {
      items.push(reader.sourceString(child));
    });
    t.is(items.length, 3);
    t.deepEqual(items, ['a', 'b', 'c']);
  });
});

test('optional node: present', async t => {
  const g = await compileAndLoad('G { start = "a"? }');
  g.match('a').use(mr => {
    const reader = createReader(mr);
    let opt;
    reader.forEachChild(reader.root, child => {
      opt = child;
    });
    t.is(reader.type(opt), CstNodeType.OPT);
    t.is(reader.ctorName(opt), '_opt');
    t.is(reader.childCount(opt), 1);
    t.is(reader.matchLength(opt), 1);
  });
});

test('optional node: absent', async t => {
  const g = await compileAndLoad('G { start = "a"? }');
  g.match('').use(mr => {
    const reader = createReader(mr);
    let opt;
    reader.forEachChild(reader.root, child => {
      opt = child;
    });
    t.is(reader.type(opt), CstNodeType.OPT);
    t.is(reader.childCount(opt), 0);
    t.is(reader.matchLength(opt), 0);
  });
});

// --- unparse via walk ---

test('unparse: simple terminals', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  g.match('abcd').use(mr => {
    const reader = createReader(mr);
    let ans = '';
    function walk(handle) {
      if (reader.type(handle) === CstNodeType.TERMINAL) {
        ans += reader.sourceString(handle);
        return;
      }
      reader.forEachChild(handle, child => walk(child));
    }
    walk(reader.root);
    t.is(ans, 'abcd');
  });
});

test('unparse: with rule application', async t => {
  const g = await compileAndLoad('G { start = a b\na = "x"\nb = "y" }');
  g.match('xy').use(mr => {
    const reader = createReader(mr);
    let ans = '';
    function walk(handle) {
      if (reader.type(handle) === CstNodeType.TERMINAL) {
        ans += reader.sourceString(handle);
        return;
      }
      reader.forEachChild(handle, child => walk(child));
    }
    walk(reader.root);
    t.is(ans, 'xy');
  });
});

test('unparse: with nonterminals', async t => {
  const g = await compileAndLoad('G { start = a b\na = "hello"\nb = "world" }');
  g.match('helloworld').use(mr => {
    const reader = createReader(mr);
    let ans = '';
    function walk(handle) {
      if (reader.type(handle) === CstNodeType.TERMINAL) {
        ans += reader.sourceString(handle);
        return;
      }
      reader.forEachChild(handle, child => walk(child));
    }
    walk(reader.root);
    t.is(ans, 'helloworld');
  });
});

test('unparse: unicode', async t => {
  const g = await compileAndLoad('G { start = any* }');
  const input = 'Nöö';
  g.match(input).use(mr => {
    const reader = createReader(mr);
    let ans = '';
    function walk(handle) {
      if (reader.type(handle) === CstNodeType.TERMINAL) {
        ans += reader.sourceString(handle);
        return;
      }
      reader.forEachChild(handle, child => walk(child));
    }
    walk(reader.root);
    t.is(ans, input);
  });
});

// --- leading spaces ---

test('rootLeadingSpacesLen: present', async t => {
  const g = await compileAndLoad('G { Start = "x" }');
  g.match('  x').use(mr => {
    const reader = createReader(mr);
    t.is(reader.rootLeadingSpacesLen, 2);
    t.is(reader.sourceSlice(0, reader.rootLeadingSpacesLen), '  ');
    t.is(reader.startIdx(reader.root), 2);
  });
});

test('rootLeadingSpacesLen: absent', async t => {
  const g = await compileAndLoad('G { Start = "x" }');
  g.match('x').use(mr => {
    const reader = createReader(mr);
    t.is(reader.rootLeadingSpacesLen, 0);
  });
});

test('child leadingSpaces in syntactic rule', async t => {
  const g = await compileAndLoad('G { Start = "a" "b" }');
  g.match('a b').use(mr => {
    const reader = createReader(mr);
    const spacesInfo = [];
    reader.forEachChild(reader.root, (child, leadingSpacesLen, childStartIdx, index) => {
      spacesInfo.push({
        index,
        hasSpaces: leadingSpacesLen > 0,
        spacesLen: leadingSpacesLen,
        spacesStr:
          leadingSpacesLen > 0
            ? reader.sourceSlice(childStartIdx - leadingSpacesLen, leadingSpacesLen)
            : '',
      });
    });
    t.is(spacesInfo.length, 2);
    // "a" has no leading spaces
    t.false(spacesInfo[0].hasSpaces);
    // "b" has 1 leading space
    t.true(spacesInfo[1].hasSpaces);
    t.is(spacesInfo[1].spacesLen, 1);
    t.is(spacesInfo[1].spacesStr, ' ');
  });
});

const spaceMemoIgnored = test.macro(async (t, twoBody, input = '> xx') => {
  // The first alt causes getSpacesLenAt to be cached at position 1 (after ">").
  // The second alt (`two`) is a lexical rule whose children pass through that
  // same position. forEachChild must not use the cached value.
  const g = await compileAndLoad(`
    G {
      Start = ">" x digit -- one
            | two
      two = ${twoBody}
      x = "x"
      spx = " x"
    }
  `);
  g.match(input).use(mr => {
    t.true(mr.succeeded());
    const reader = createReader(mr);
    const [two] = childrenOf(reader, reader.root);
    const children = [];
    reader.forEachChild(two, (child, leadingSpacesLen, childStartIdx) => {
      children.push({child, leadingSpacesLen, childStartIdx});
    });
    t.deepEqual(
      children.map(({leadingSpacesLen}) => leadingSpacesLen),
      Array(children.length).fill(0)
    );
  });
});

test('spaces memo ignored in lexical rule', spaceMemoIgnored, '">" " x" x');
test('spaces memo ignored in lexical rule: plus', spaceMemoIgnored, '">" (" x")+ x');
test('spaces memo ignored in lexical rule: star', spaceMemoIgnored, '">" (" x")* x');
test('spaces memo ignored in lexical rule: opt', spaceMemoIgnored, '">" (" x")? x');
test(
  'spaces memo ignored in lexical rule: nonterminal plus',
  spaceMemoIgnored,
  '">" spx+',
  '> x'
);
test(
  'spaces memo ignored in lexical rule: nonterminal star',
  spaceMemoIgnored,
  '">" spx*',
  '> x'
);
test(
  'spaces memo ignored in lexical rule: nonterminal opt',
  spaceMemoIgnored,
  '">" spx?',
  '> x'
);

// --- details ---

test('details returns ruleId for nonterminals', async t => {
  const g = await compileAndLoad('G { start = a\na = "x" }');
  g.match('x').use(mr => {
    const reader = createReader(mr);
    // Root is 'start', details should be its ruleId (>= 0).
    const d = reader.details(reader.root);
    t.true(d >= 0);
  });
});

// --- edge cases ---

test('childCount is 0 for tagged terminals', async t => {
  const g = await compileAndLoad('G { start = "x" }');
  g.match('x').use(mr => {
    const reader = createReader(mr);
    let termChild;
    reader.forEachChild(reader.root, child => {
      termChild = child;
    });
    t.is(reader.type(termChild), CstNodeType.TERMINAL);
    t.is(reader.childCount(termChild), 0);
  });
});

// --- createHandle bounds ---

test('createHandle rejects out-of-range raw pointer', t => {
  t.throws(() => createHandle(2 ** 27, 0), {message: /exceeds.*bit limit/});
});

test('createHandle rejects out-of-range startIdx', t => {
  t.throws(() => createHandle(0, 2 ** 26), {message: /exceeds.*bit limit/});
});

test('createHandle accepts max valid values', t => {
  const handle = createHandle(2 ** 27 - 1, 2 ** 26 - 1);
  t.true(handle > 0);
});

// --- isSyntactic via CstReader ---

test('isSyntactic: true for syntactic rule, false for lexical', async t => {
  const g = await compileAndLoad('G { Start = inner\ninner = "x" }');
  g.match('x').use(mr => {
    const reader = createReader(mr);
    t.true(reader.isSyntactic(reader.root)); // Start is syntactic
    let innerHandle;
    reader.forEachChild(reader.root, child => {
      innerHandle = child;
    });
    t.false(reader.isSyntactic(innerHandle)); // inner is lexical
  });
});

// --- syntactic classification from Wasm section ---

test('isSyntactic reads compiler-embedded classification', async t => {
  // The compiler embeds a syntacticRules custom section; the runtime reads it
  // directly rather than rederiving from rule names.
  const g = await compileAndLoad('G { Start = inner\ninner = "x" }');
  g.match('x').use(mr => {
    const reader = createReader(mr);
    // Walk all nonterminals and verify classification
    function check(handle) {
      if (reader.type(handle) === CstNodeType.NONTERMINAL) {
        const name = reader.ctorName(handle);
        if (name === 'Start') t.true(reader.isSyntactic(handle));
        if (name === 'inner') t.false(reader.isSyntactic(handle));
      }
      reader.forEachChild(handle, child => check(child));
    }
    check(reader.root);
  });
});

// --- property-based: source tiling ---

// Recursively check all invariants on a CST node and its descendants.
// Returns an array of error strings (empty = all good).
function checkInvariants(reader, handle, isLexicalParent) {
  const errors = [];
  const type = reader.type(handle);
  const ctor = reader.ctorName(handle);
  const start = reader.startIdx(handle);
  const len = reader.matchLength(handle);

  // -- Packed-handle span consistency --
  const actual = reader.sourceString(handle);
  const expected = reader.input.slice(start, start + len);
  if (actual !== expected) {
    errors.push(
      `span mismatch at ${start}: sourceString=${JSON.stringify(actual)}, ` +
        `slice=${JSON.stringify(expected)}`
    );
  }

  // -- Node-type contracts --
  if (type === CstNodeType.TERMINAL) {
    if (ctor !== '_terminal') {
      errors.push(`terminal ctorName=${ctor}, expected '_terminal'`);
    }
    if (reader.childCount(handle) !== 0) {
      errors.push(`terminal childCount=${reader.childCount(handle)}, expected 0`);
    }
    // Terminals are leaves — nothing more to check.
    return errors;
  }

  if (type === CstNodeType.OPT) {
    const cc = reader.childCount(handle);
    if (cc !== 0 && cc !== 1) {
      errors.push(`opt childCount=${cc}, expected 0 or 1`);
    }
  }

  // -- Public iteration contract --
  const childCount = reader.childCount(handle);
  let callbackCount = 0;
  const indices = [];

  // -- Source tiling + round-trip reconstruction --
  const parentEnd = start + len;
  let cursor = start;
  let reconstructed = '';

  reader.forEachChild(handle, (child, leadingSpacesLen, childStartIdx, index) => {
    indices.push(index);
    callbackCount++;

    // Lexical children must never have leading spaces.
    if (isLexicalParent && leadingSpacesLen > 0) {
      errors.push(
        `lexical child at ${childStartIdx} has leadingSpacesLen=${leadingSpacesLen}`
      );
    }

    // LIST/OPT edges never report leading spaces (documented contract).
    const childType = reader.type(child);
    if (
      (childType === CstNodeType.LIST || childType === CstNodeType.OPT) &&
      leadingSpacesLen > 0
    ) {
      errors.push(
        `${childType === CstNodeType.LIST ? 'list' : 'opt'} edge has ` +
          `leadingSpacesLen=${leadingSpacesLen}`
      );
    }

    // Tiling: cursor + leadingSpaces should equal childStartIdx.
    const expectedStart = cursor + leadingSpacesLen;
    if (childStartIdx !== expectedStart) {
      errors.push(
        `gap/overlap at cursor=${cursor}: expected childStartIdx=${expectedStart}, ` +
          `got ${childStartIdx}`
      );
    }

    // Round-trip reconstruction: interleave spaces + child text.
    if (leadingSpacesLen > 0) {
      reconstructed += reader.sourceSlice(childStartIdx - leadingSpacesLen, leadingSpacesLen);
    }
    reconstructed += reader.sourceString(child);

    cursor = childStartIdx + reader.matchLength(child);

    // Recurse. Lexical context propagates through non-nonterminal wrappers.
    let childIsLexical;
    if (childType === CstNodeType.NONTERMINAL) {
      childIsLexical = !reader.isSyntactic(child);
    } else {
      childIsLexical = isLexicalParent;
    }
    errors.push(...checkInvariants(reader, child, childIsLexical));
  });

  // Tiling: children must cover entire parent span.
  if (cursor !== parentEnd) {
    errors.push(
      `children don't cover parent: cursor=${cursor}, parentEnd=${parentEnd}`
    );
  }

  // Round-trip: reconstructed text must equal parent's sourceString.
  if (reconstructed !== actual) {
    errors.push(
      `reconstruction mismatch: got ${JSON.stringify(reconstructed)}, ` +
        `expected ${JSON.stringify(actual)}`
    );
  }

  // Iteration contract: callback count and indices.
  if (callbackCount !== childCount) {
    errors.push(
      `forEachChild count=${callbackCount}, childCount()=${childCount}`
    );
  }
  const expectedIndices = Array.from({length: childCount}, (_, i) => i);
  if (indices.join(',') !== expectedIndices.join(',')) {
    errors.push(
      `forEachChild indices=[${indices}], expected=[${expectedIndices}]`
    );
  }

  return errors;
}

// Check all invariants on a full match result, including root-level checks.
function checkMatch(reader) {
  const errors = [];
  const {root, rootLeadingSpacesLen, input} = reader;

  // -- Root consumption invariant --
  if (reader.startIdx(root) !== rootLeadingSpacesLen) {
    errors.push(
      `root startIdx=${reader.startIdx(root)}, ` +
        `rootLeadingSpacesLen=${rootLeadingSpacesLen}`
    );
  }
  if (rootLeadingSpacesLen + reader.matchLength(root) !== input.length) {
    errors.push(
      `rootLeadingSpacesLen(${rootLeadingSpacesLen}) + matchLength(${reader.matchLength(root)}) ` +
        `!== input.length(${input.length})`
    );
  }

  // -- Root round-trip: leadingSpaces + render(root) === input --
  const rootSpaces = reader.sourceSlice(0, rootLeadingSpacesLen);
  const rootText = reader.sourceString(root);
  if (rootSpaces + rootText !== input) {
    errors.push(
      `root round-trip: ${JSON.stringify(rootSpaces + rootText)} !== ${JSON.stringify(input)}`
    );
  }

  // Recurse into the tree.
  const isLexicalRoot = !reader.isSyntactic(root);
  errors.push(...checkInvariants(reader, root, isLexicalRoot));
  return errors;
}

// Letters including non-BMP (surrogate pairs in UTF-16).
const astralLetters = ['\u{1D49E}', '\u{10000}', '\u{1D504}']; // 𝒞, 𐀀, 𝔄

const propertyGrammars = [
  // Mix of syntactic + lexical, with iteration and alternation.
  {
    source: `G {
      Start = Item+
      Item = word | punct
      word = letter+
      punct = "." | "," | "!"
    }`,
    arb: fc.array(
      fc.oneof(
        fc.array(fc.constantFrom(...'abcXYZ', ...astralLetters), {minLength: 1, maxLength: 4}).map(a => a.join('')),
        fc.constantFrom('.', ',', '!')
      ),
      {minLength: 1, maxLength: 8}
    ).map(parts => parts.join(' ')),
  },
  // Nested syntactic rules with optional and star.
  {
    source: `G {
      Start = Outer*
      Outer = "(" Inner ")"
      Inner = digit+
    }`,
    arb: fc.array(
      fc.array(fc.constantFrom(...'0123456789'), {minLength: 1, maxLength: 4})
        .map(a => `(${a.join('')})`),
      {minLength: 1, maxLength: 6}
    ).map(parts => parts.join(' ')),
  },
  // Lexical rule called from syntactic context — the core bug scenario.
  {
    source: `G {
      Start = ">" tok+
      tok = letter+
    }`,
    arb: fc.array(
      fc.array(fc.constantFrom(...'abcxyz', ...astralLetters), {minLength: 1, maxLength: 3}).map(a => a.join('')),
      {minLength: 1, maxLength: 6}
    ).map(parts => '>' + parts.join(' ')),
  },
  // Non-BMP letters — stresses UTF-16 surrogate pair indexing.
  {
    source: `G {
      Start = tok+
      tok = letter+
    }`,
    arb: fc.array(
      fc.array(
        fc.constantFrom('a', 'x', 'Z', ...astralLetters),
        {minLength: 1, maxLength: 4}
      ).map(a => a.join('')),
      {minLength: 1, maxLength: 6}
    ).map(parts => parts.join(' ')),
  },
];

test('fast-check: CST structural invariants', async t => {
  for (const {source, arb} of propertyGrammars) {
    const g = await compileAndLoad(source);
    const result = fc.check(
      fc.property(arb, input => {
        return g.match(input).use(mr => {
          if (!mr.succeeded()) {
            throw new Error(`expected match for input=${JSON.stringify(input)}`);
          }
          const reader = createReader(mr);
          const errors = checkMatch(reader);
          if (errors.length > 0) {
            throw new Error(`input=${JSON.stringify(input)}\n${errors.join('\n')}`);
          }
          return true;
        });
      }),
      {numRuns: 200}
    );
    t.false(result.failed, `${source}\n${fc.defaultReportMessage(result)}`);
  }
});
