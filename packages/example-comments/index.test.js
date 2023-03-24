import fs from 'node:fs';
import {test} from 'uvu';
import * as assert from 'uvu/assert';

import * as grammars from './grammars.js';
import {extractExamples, extractExamplesFlat} from './index.js';

test('empty', () => {
  assert.equal(extractExamples(''), {});
});

test('grammar with no examples', () => {
  assert.equal(extractExamples('G { }'), {G: {}});
});

test('simple positive examples', () => {
  let examples = extractExamples(`
    G {
      //+ "x"
      start = "x"
    }
  `);
  assert.equal(Object.keys(examples), ['G']);
  assert.equal(examples.G, {
    start: [{example: 'x', shouldMatch: true}],
  });

  examples = extractExamples(`
    G {
      //+ ""
      start = ""

      //+ "x"
      other = ""
    }
  `);
  assert.equal(Object.keys(examples), ['G']);
  assert.equal(examples.G, {
    start: [{example: '', shouldMatch: true}],
    other: [{example: 'x', shouldMatch: true}],
  });
});

test('examples for default start rule', () => {
  let examples = extractExamples(`
    //+ "hey"
    G {
      //+ ""
      start = ""
    }
  `);
  assert.equal(Object.keys(examples), ['G']);
  assert.equal(examples.G, {
    '(default)': [{example: 'hey', shouldMatch: true}],
    'start': [{example: '', shouldMatch: true}],
  });

  examples = extractExamples(`
    //+ "hey"
    G {
      //+ ""
      start = ""
    }
  `);
  assert.equal(Object.keys(examples), ['G']);
  assert.equal(examples.G, {
    '(default)': [{example: 'hey', shouldMatch: true}],
    'start': [{example: '', shouldMatch: true}],
  });
});

test('top-level whitespace', () => {
  const expected = {G: {'(default)': [{example: '', shouldMatch: true}]}};
  assert.equal(extractExamples('  //+ ""\n  G{}'), expected);
  assert.equal(extractExamples('  //+ "" \nG{}'), expected);
  assert.equal(extractExamples('\n\n//+ ""\n\nG{}'), expected);
});

function getExamples(input) {
  const {G} = extractExamples(`G { ${input}\nstart = }`);
  return G.start;
}

test('example comments - negative examples', () => {
  assert.equal(getExamples('//- "blah"\n'), [{example: 'blah', shouldMatch: false}]);
  assert.equal(
      getExamples(`
      //+ "blah"
      //- "wooo"`),
      [
        {example: 'blah', shouldMatch: true},
        {example: 'wooo', shouldMatch: false},
      ],
  );
  //  assert.throws(() => getExamples('//-"x"'), null, 'space required after "-"');
  assert.equal(getExamples('// - "x"'), [], 'parsed as a normal comment');
});

test('example comments - corner cases', () => {
  assert.equal(
      getExamples('//+ "blah"\n\n'),
      [{example: 'blah', shouldMatch: true}],
      'extra blank lines before rule',
  );
  assert.equal(
      getExamples(`
      //+ "blah"
      //+    "wooo"`),
      [
        {example: 'blah', shouldMatch: true},
        {example: 'wooo', shouldMatch: true},
      ],
      'extra leading space',
  );
  // assert.throws(() => {
  //   assert.equal(getExamples('//+ '), [], 'no terminals');
  // });
  assert.equal(getExamples('//+ "" '), [{example: '', shouldMatch: true}], 'trailing space');
  assert.equal(
      getExamples('//+ ""\n//- ""'),
      [
        {example: '', shouldMatch: true},
        {example: '', shouldMatch: false},
      ],
      'contradictory examples',
  );
  assert.equal(
      getExamples('//+ ""\n//+ ""'),
      [
        {example: '', shouldMatch: true},
        {example: '', shouldMatch: true},
      ],
      'duplicate examples',
  );
});

test('extracted examples', () => {
  const grammarDef = fs.readFileSync('./ohm-with-examples.ohm', 'utf-8');
  for (const {grammar, rule, example, shouldMatch} of extractExamplesFlat(grammarDef)) {
    const g = grammars[grammar];
    const startRule = rule === '(default)' ? undefined : rule;
    assert.is(g.match(example, startRule).succeeded(), shouldMatch, example);
  }
});

test.run();
