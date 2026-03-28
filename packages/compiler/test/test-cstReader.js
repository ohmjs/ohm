import test from 'ava';

import {createReader, CstNodeType} from '../../runtime/src/cstReader.ts';
import {compileAndLoad, matchWithInput} from './_helpers.js';

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
        spacesStr: leadingSpacesLen > 0
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
