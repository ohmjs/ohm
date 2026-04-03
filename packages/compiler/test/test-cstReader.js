import test from 'ava';

import {createReader, CstNodeType} from '../../runtime/src/cstReader.ts';
import {createHandle} from '../../runtime/src/cstReaderShared.ts';
import {compileAndLoad, matchWithInput} from './_helpers.js';

const childrenOf = (reader, handle) => {
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
    reader.forEachChild(reader.root, (child, leadingSpaces, index) => {
      children.push({child, leadingSpaces, startIdx: reader.startIdx(child), index});
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
    reader.forEachChild(reader.root, (child, ls, i) => {
      children.push({child, ls, startIdx: reader.startIdx(child), i});
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

test('withChildren, tupleArity, forEachTuple, and isPresent', async t => {
  const g = await compileAndLoad('G { start = ("a" "b"?)* }');
  g.match('abab').use(mr => {
    const reader = createReader(mr);
    let list;
    reader.forEachChild(reader.root, child => {
      list = child;
    });

    t.is(reader.tupleArity(list), 2);

    const tuples = [];
    reader.forEachTuple(list, (a, b) => {
      tuples.push(
        reader.sourceString(a) +
          reader.withChildren(b, (_handle, child) =>
            reader.isPresent(b) ? reader.sourceString(child) : ''
          )
      );
    });
    t.deepEqual(tuples, ['ab', 'ab']);

    let emptyOpt;
    g.match('a').use(mr2 => {
      const reader2 = createReader(mr2);
      reader2.forEachChild(reader2.root, child => {
        list = child;
      });
      reader2.forEachTuple(list, (_a, b) => {
        emptyOpt = b;
      });
      t.false(reader2.isPresent(emptyOpt));
      t.is(
        reader2.withChildren(emptyOpt, (_handle, child) =>
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
    const reader = createReader(mr);
    let list;
    reader.forEachChild(reader.root, child => {
      list = child;
    });

    let terminal;
    let opt;
    reader.forEachTuple(list, (a, b) => {
      terminal = a;
      opt = b;
    });

    t.throws(() => reader.ruleId(list), {message: 'Not a nonterminal'});
    t.throws(() => reader.tupleArity(reader.root), {message: 'Not a list'});
    t.throws(() => reader.isPresent(terminal), {message: 'Not an opt'});
    t.true(reader.isPresent(opt));
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
    t.is(reader.input.slice(0, reader.rootLeadingSpacesLen), '  ');
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
    reader.forEachChild(reader.root, (child, leadingSpacesLen, index) => {
      const childStartIdx = reader.startIdx(child);
      spacesInfo.push({
        index,
        hasSpaces: leadingSpacesLen > 0,
        spacesLen: leadingSpacesLen,
        spacesStr:
          leadingSpacesLen > 0
            ? reader.input.slice(childStartIdx - leadingSpacesLen, childStartIdx)
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
    reader.forEachChild(two, (child, leadingSpacesLen) => {
      children.push({child, leadingSpacesLen, childStartIdx: reader.startIdx(child)});
    });
    t.deepEqual(
      children.map(({leadingSpacesLen}) => leadingSpacesLen),
      Array(children.length).fill(0)
    );
  });
});

test.failing('spaces memo ignored in lexical rule', spaceMemoIgnored, '">" " x" x');
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
    const reader = createReader(mr);
    t.true(reader.ruleId(reader.root) >= 0);
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
