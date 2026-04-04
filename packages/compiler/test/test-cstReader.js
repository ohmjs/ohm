import test from 'ava';
import * as fc from 'fast-check';

import {CstNodeType} from '../../runtime/src/cstView.ts';
import {createHandle} from '../../runtime/src/cstCommon.ts';
import {compileAndLoad, matchWithInput} from './_helpers.js';

test('root node basics', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  t.is(matchWithInput(g, 'abcd'), 1);

  g.match('abcd').use(mr => {
    const cst = mr.cstView();
    t.is(cst.type(cst.root), CstNodeType.NONTERMINAL);
    t.is(cst.matchLength(cst.root), 4);
    t.is(cst.ctorName(cst.root), 'start');
    t.is(cst.childCount(cst.root), 2);
    t.is(cst.input, 'abcd');
    t.is(cst.sourceString(cst.root), 'abcd');
    t.is(cst.startIdx(cst.root), 0);
  });
});

test('terminal children', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  g.match('abcd').use(mr => {
    const cst = mr.cstView();
    const children = [];
    cst.forEachChild(cst.root, (child, leadingSpaces, index) => {
      children.push({child, leadingSpaces, startIdx: cst.startIdx(child), index});
    });
    t.is(children.length, 2);

    // First child: "ab"
    t.is(cst.type(children[0].child), CstNodeType.TERMINAL);
    t.is(cst.matchLength(children[0].child), 2);
    t.is(cst.ctorName(children[0].child), '_terminal');
    t.is(cst.sourceString(children[0].child), 'ab');
    t.is(children[0].leadingSpaces, 0);
    t.is(children[0].index, 0);

    // Second child: "cd"
    t.is(cst.type(children[1].child), CstNodeType.TERMINAL);
    t.is(cst.matchLength(children[1].child), 2);
    t.is(cst.sourceString(children[1].child), 'cd');
    t.is(children[1].index, 1);
  });
});

test('nonterminal children', async t => {
  const g = await compileAndLoad('G { start = a b\na = "x"\nb = "y" }');
  g.match('xy').use(mr => {
    const cst = mr.cstView();
    const children = [];
    cst.forEachChild(cst.root, (child, ls, i) => {
      children.push({child, ls, startIdx: cst.startIdx(child), i});
    });
    t.is(children.length, 2);
    t.is(cst.ctorName(children[0].child), 'a');
    t.is(cst.ctorName(children[1].child), 'b');
    t.is(cst.type(children[0].child), CstNodeType.NONTERMINAL);
    t.is(cst.type(children[1].child), CstNodeType.NONTERMINAL);
    t.is(cst.sourceString(children[0].child), 'x');
    t.is(cst.sourceString(children[1].child), 'y');
  });
});

test('iteration (list) node', async t => {
  const g = await compileAndLoad('G { start = "a"* }');
  g.match('aaa').use(mr => {
    const cst = mr.cstView();
    let listHandle;
    cst.forEachChild(cst.root, child => {
      listHandle = child;
    });
    t.is(cst.type(listHandle), CstNodeType.LIST);
    t.is(cst.ctorName(listHandle), '_list');
    t.is(cst.childCount(listHandle), 3);

    const items = [];
    cst.forEachChild(listHandle, child => {
      items.push(cst.sourceString(child));
    });
    t.deepEqual(items, ['a', 'a', 'a']);
  });
});

test('iteration with nonterminals', async t => {
  const g = await compileAndLoad('G { start = letter* }');
  g.match('abc').use(mr => {
    const cst = mr.cstView();
    let listHandle;
    cst.forEachChild(cst.root, child => {
      listHandle = child;
    });
    t.is(cst.type(listHandle), CstNodeType.LIST);
    const items = [];
    cst.forEachChild(listHandle, child => {
      items.push(cst.sourceString(child));
    });
    t.is(items.length, 3);
    t.deepEqual(items, ['a', 'b', 'c']);
  });
});

test('optional node: present', async t => {
  const g = await compileAndLoad('G { start = "a"? }');
  g.match('a').use(mr => {
    const cst = mr.cstView();
    let opt;
    cst.forEachChild(cst.root, child => {
      opt = child;
    });
    t.is(cst.type(opt), CstNodeType.OPT);
    t.is(cst.ctorName(opt), '_opt');
    t.is(cst.childCount(opt), 1);
    t.is(cst.matchLength(opt), 1);
  });
});

test('optional node: absent', async t => {
  const g = await compileAndLoad('G { start = "a"? }');
  g.match('').use(mr => {
    const cst = mr.cstView();
    let opt;
    cst.forEachChild(cst.root, child => {
      opt = child;
    });
    t.is(cst.type(opt), CstNodeType.OPT);
    t.is(cst.childCount(opt), 0);
    t.is(cst.matchLength(opt), 0);
  });
});

test('withChildren, tupleArity, forEachTuple, and isPresent', async t => {
  const g = await compileAndLoad('G { start = ("a" "b"?)* }');
  g.match('abab').use(mr => {
    const cst = mr.cstView();
    let list;
    cst.forEachChild(cst.root, child => {
      list = child;
    });

    t.is(cst.tupleArity(list), 2);

    const tuples = [];
    cst.forEachTuple(list, (a, b) => {
      tuples.push(
        cst.sourceString(a) +
          cst.withChildren(b, (_handle, child) =>
            cst.isPresent(b) ? cst.sourceString(child) : ''
          )
      );
    });
    t.deepEqual(tuples, ['ab', 'ab']);

    let emptyOpt;
    g.match('a').use(mr2 => {
      const cst2 = mr2.cstView();
      cst2.forEachChild(cst2.root, child => {
        list = child;
      });
      cst2.forEachTuple(list, (_a, b) => {
        emptyOpt = b;
      });
      t.false(cst2.isPresent(emptyOpt));
      t.is(
        cst2.withChildren(emptyOpt, (_handle, child) =>
          child === undefined ? 'missing' : 'present'
        ),
        'missing'
      );
    });
  });
});

test('type-specific helpers assert on the wrong handle kind', async t => {
  const g = await compileAndLoad('G { Start = ("a" "b"?)* }');
  g.match('ab').use(mr => {
    const cst = mr.cstView();
    let list;
    cst.forEachChild(cst.root, child => {
      list = child;
    });

    let terminal;
    let opt;
    cst.forEachTuple(list, (a, b) => {
      terminal = a;
      opt = b;
    });

    t.throws(() => cst.ruleId(list), {message: 'Not a nonterminal'});
    t.throws(() => cst.tupleArity(cst.root), {message: 'Not a list'});
    t.throws(() => cst.isPresent(terminal), {message: 'Not an opt'});
    t.true(cst.isPresent(opt));
  });
});

// --- unparse via walk ---

test('unparse: simple terminals', async t => {
  const g = await compileAndLoad('G { start = "ab" "cd" }');
  g.match('abcd').use(mr => {
    const cst = mr.cstView();
    let ans = '';
    function walk(handle) {
      if (cst.type(handle) === CstNodeType.TERMINAL) {
        ans += cst.sourceString(handle);
        return;
      }
      cst.forEachChild(handle, child => walk(child));
    }
    walk(cst.root);
    t.is(ans, 'abcd');
  });
});

test('unparse: with rule application', async t => {
  const g = await compileAndLoad('G { start = a b\na = "x"\nb = "y" }');
  g.match('xy').use(mr => {
    const cst = mr.cstView();
    let ans = '';
    function walk(handle) {
      if (cst.type(handle) === CstNodeType.TERMINAL) {
        ans += cst.sourceString(handle);
        return;
      }
      cst.forEachChild(handle, child => walk(child));
    }
    walk(cst.root);
    t.is(ans, 'xy');
  });
});

test('unparse: with nonterminals', async t => {
  const g = await compileAndLoad('G { start = a b\na = "hello"\nb = "world" }');
  g.match('helloworld').use(mr => {
    const cst = mr.cstView();
    let ans = '';
    function walk(handle) {
      if (cst.type(handle) === CstNodeType.TERMINAL) {
        ans += cst.sourceString(handle);
        return;
      }
      cst.forEachChild(handle, child => walk(child));
    }
    walk(cst.root);
    t.is(ans, 'helloworld');
  });
});

test('unparse: unicode', async t => {
  const g = await compileAndLoad('G { start = any* }');
  const input = 'Nöö';
  g.match(input).use(mr => {
    const cst = mr.cstView();
    let ans = '';
    function walk(handle) {
      if (cst.type(handle) === CstNodeType.TERMINAL) {
        ans += cst.sourceString(handle);
        return;
      }
      cst.forEachChild(handle, child => walk(child));
    }
    walk(cst.root);
    t.is(ans, input);
  });
});

// --- leading spaces ---

test('rootLeadingSpacesLen: present', async t => {
  const g = await compileAndLoad('G { Start = "x" }');
  g.match('  x').use(mr => {
    const cst = mr.cstView();
    t.is(cst.rootLeadingSpacesLen, 2);
    t.is(cst.input.slice(0, cst.rootLeadingSpacesLen), '  ');
    t.is(cst.startIdx(cst.root), 2);
  });
});

test('rootLeadingSpacesLen: absent', async t => {
  const g = await compileAndLoad('G { Start = "x" }');
  g.match('x').use(mr => {
    const cst = mr.cstView();
    t.is(cst.rootLeadingSpacesLen, 0);
  });
});

test('child leadingSpaces in syntactic rule', async t => {
  const g = await compileAndLoad('G { Start = "a" "b" }');
  g.match('a b').use(mr => {
    const cst = mr.cstView();
    const spacesInfo = [];
    cst.forEachChild(cst.root, (child, leadingSpacesLen, index) => {
      const childStartIdx = cst.startIdx(child);
      spacesInfo.push({
        index,
        hasSpaces: leadingSpacesLen > 0,
        spacesLen: leadingSpacesLen,
        spacesStr:
          leadingSpacesLen > 0
            ? cst.input.slice(childStartIdx - leadingSpacesLen, childStartIdx)
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
    const cst = mr.cstView();
    const two = cst.withChildren(cst.root, (_h, first) => first);
    const children = [];
    cst.forEachChild(two, (child, leadingSpacesLen) => {
      children.push({child, leadingSpacesLen, childStartIdx: cst.startIdx(child)});
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

// --- rule metadata ---

test('ruleId returns a stable rule index for nonterminals', async t => {
  const g = await compileAndLoad('G { start = a\na = "x" }');
  g.match('x').use(mr => {
    const cst = mr.cstView();
    t.true(cst.ruleId(cst.root) >= 0);
  });
});

// --- edge cases ---

test('childCount is 0 for tagged terminals', async t => {
  const g = await compileAndLoad('G { start = "x" }');
  g.match('x').use(mr => {
    const cst = mr.cstView();
    let termChild;
    cst.forEachChild(cst.root, child => {
      termChild = child;
    });
    t.is(cst.type(termChild), CstNodeType.TERMINAL);
    t.is(cst.childCount(termChild), 0);
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
    const cst = mr.cstView();
    t.true(cst.isSyntactic(cst.root)); // Start is syntactic
    let innerHandle;
    cst.forEachChild(cst.root, child => {
      innerHandle = child;
    });
    t.false(cst.isSyntactic(innerHandle)); // inner is lexical
  });
});

// --- syntactic classification from Wasm section ---

test('isSyntactic reads compiler-embedded classification', async t => {
  // The compiler embeds a syntacticRules custom section; the runtime reads it
  // directly rather than rederiving from rule names.
  const g = await compileAndLoad('G { Start = inner\ninner = "x" }');
  g.match('x').use(mr => {
    const cst = mr.cstView();
    // Walk all nonterminals and verify classification
    function check(handle) {
      if (cst.type(handle) === CstNodeType.NONTERMINAL) {
        const name = cst.ctorName(handle);
        if (name === 'Start') t.true(cst.isSyntactic(handle));
        if (name === 'inner') t.false(cst.isSyntactic(handle));
      }
      cst.forEachChild(handle, child => check(child));
    }
    check(cst.root);
  });
});

// --- property-based: source tiling ---

// Recursively check all invariants on a CST node and its descendants.
// Returns an array of error strings (empty = all good).
function checkInvariants(cst, handle, isLexicalParent) {
  const errors = [];
  const type = cst.type(handle);
  const ctor = cst.ctorName(handle);
  const start = cst.startIdx(handle);
  const len = cst.matchLength(handle);

  // -- Packed-handle span consistency --
  const actual = cst.sourceString(handle);
  const expected = cst.input.slice(start, start + len);
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
    if (cst.childCount(handle) !== 0) {
      errors.push(`terminal childCount=${cst.childCount(handle)}, expected 0`);
    }
    // Terminals are leaves — nothing more to check.
    return errors;
  }

  if (type === CstNodeType.OPT) {
    const cc = cst.childCount(handle);
    if (cc !== 0 && cc !== 1) {
      errors.push(`opt childCount=${cc}, expected 0 or 1`);
    }
  }

  // -- Public iteration contract --
  const childCount = cst.childCount(handle);
  let callbackCount = 0;
  const indices = [];

  // -- Source tiling + round-trip reconstruction --
  const parentEnd = start + len;
  let cursor = start;
  let reconstructed = '';

  cst.forEachChild(handle, (child, leadingSpacesLen, index) => {
    const childStartIdx = cst.startIdx(child);
    indices.push(index);
    callbackCount++;

    // Lexical children must never have leading spaces.
    if (isLexicalParent && leadingSpacesLen > 0) {
      errors.push(
        `lexical child at ${childStartIdx} has leadingSpacesLen=${leadingSpacesLen}`
      );
    }

    // LIST/OPT edges never report leading spaces (documented contract).
    const childType = cst.type(child);
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
      reconstructed += cst.input.slice(childStartIdx - leadingSpacesLen, childStartIdx);
    }
    reconstructed += cst.sourceString(child);

    cursor = childStartIdx + cst.matchLength(child);

    // Recurse. Lexical context propagates through non-nonterminal wrappers.
    let childIsLexical;
    if (childType === CstNodeType.NONTERMINAL) {
      childIsLexical = !cst.isSyntactic(child);
    } else {
      childIsLexical = isLexicalParent;
    }
    errors.push(...checkInvariants(cst, child, childIsLexical));
  });

  // Tiling: children must cover entire parent span.
  if (cursor !== parentEnd) {
    errors.push(`children don't cover parent: cursor=${cursor}, parentEnd=${parentEnd}`);
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
    errors.push(`forEachChild count=${callbackCount}, childCount()=${childCount}`);
  }
  const expectedIndices = Array.from({length: childCount}, (_, i) => i);
  if (indices.join(',') !== expectedIndices.join(',')) {
    errors.push(`forEachChild indices=[${indices}], expected=[${expectedIndices}]`);
  }

  return errors;
}

// Check all invariants on a full match result, including root-level checks.
function checkMatch(cst) {
  const errors = [];
  const {root, rootLeadingSpacesLen, input} = cst;

  // -- Root consumption invariant --
  if (cst.startIdx(root) !== rootLeadingSpacesLen) {
    errors.push(
      `root startIdx=${cst.startIdx(root)}, ` + `rootLeadingSpacesLen=${rootLeadingSpacesLen}`
    );
  }
  if (rootLeadingSpacesLen + cst.matchLength(root) !== input.length) {
    errors.push(
      `rootLeadingSpacesLen(${rootLeadingSpacesLen}) + matchLength(${cst.matchLength(root)}) ` +
        `!== input.length(${input.length})`
    );
  }

  // -- Root round-trip: leadingSpaces + render(root) === input --
  const rootSpaces = input.slice(0, rootLeadingSpacesLen);
  const rootText = cst.sourceString(root);
  if (rootSpaces + rootText !== input) {
    errors.push(
      `root round-trip: ${JSON.stringify(rootSpaces + rootText)} !== ${JSON.stringify(input)}`
    );
  }

  // Recurse into the tree.
  const isLexicalRoot = !cst.isSyntactic(root);
  errors.push(...checkInvariants(cst, root, isLexicalRoot));
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
    arb: fc
      .array(
        fc.oneof(
          fc
            .array(fc.constantFrom(...'abcXYZ', ...astralLetters), {
              minLength: 1,
              maxLength: 4,
            })
            .map(a => a.join('')),
          fc.constantFrom('.', ',', '!')
        ),
        {minLength: 1, maxLength: 8}
      )
      .map(parts => parts.join(' ')),
  },
  // Nested syntactic rules with optional and star.
  {
    source: `G {
      Start = Outer*
      Outer = "(" Inner ")"
      Inner = digit+
    }`,
    arb: fc
      .array(
        fc
          .array(fc.constantFrom(...'0123456789'), {minLength: 1, maxLength: 4})
          .map(a => `(${a.join('')})`),
        {minLength: 1, maxLength: 6}
      )
      .map(parts => parts.join(' ')),
  },
  // Lexical rule called from syntactic context — the core bug scenario.
  {
    source: `G {
      Start = ">" tok+
      tok = letter+
    }`,
    arb: fc
      .array(
        fc
          .array(fc.constantFrom(...'abcxyz', ...astralLetters), {minLength: 1, maxLength: 3})
          .map(a => a.join('')),
        {minLength: 1, maxLength: 6}
      )
      .map(parts => '>' + parts.join(' ')),
  },
  // Non-BMP letters — stresses UTF-16 surrogate pair indexing.
  {
    source: `G {
      Start = tok+
      tok = letter+
    }`,
    arb: fc
      .array(
        fc
          .array(fc.constantFrom('a', 'x', 'Z', ...astralLetters), {
            minLength: 1,
            maxLength: 4,
          })
          .map(a => a.join('')),
        {minLength: 1, maxLength: 6}
      )
      .map(parts => parts.join(' ')),
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
          const cst = mr.cstView();
          const errors = checkMatch(cst);
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
