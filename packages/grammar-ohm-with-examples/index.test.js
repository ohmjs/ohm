import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {extractExamples} from './index.js';

test('empty', () => {
  assert.equal(extractExamples(''), {});
});

test('grammar with no examples', () => {
  assert.equal(extractExamples('G { }'), {G: {}});
});

test('simple positive examples', () => {
  let examples = extractExamples(`
    G {
      // Examples:
      // - "x"
      start = "x"
    }
  `);
  assert.equal(Object.keys(examples), ['G']);
  assert.equal(examples.G, {
    start: [{example: 'x', shouldMatch: true}],
  });

  examples = extractExamples(`
    G {
      // Examples:
      // - ""
      start = ""

      // Examples:
      // - "x"
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
    // Examples:
    // - "hey"
    G {
      // Examples:
      // - ""
      start = ""
    }
  `);
  assert.equal(Object.keys(examples), ['G']);
  assert.equal(examples.G, {
    '(default)': [{example: 'hey', shouldMatch: true}],
    'start': [{example: '', shouldMatch: true}],
  });

  examples = extractExamples(`
    // Examples:
    // - "hey"
    G {
      // Examples:
      // - ""
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
  extractExamples('  // Examples:\n  G{}', { G: { '(default)': [] }});
  extractExamples('  // Examples:  \nG{}', { G: { '(default)': [] }});
  extractExamples('  // Examples:\nG{}', { G: { '(default)': [] }});
  extractExamples('\n\n// Examples:\n\nG{}', { G: { '(default)': [] }});
});

function getExamples(input) {
  const {G} = extractExamples(`G { ${input}\nstart = }`);
  return G.start;
}

test('example comments - negative examples', () => {
  assert.equal(getExamples('// Examples:\n    // - not "blah"\n'), [
    {example: 'blah', shouldMatch: false},
  ]);
  assert.equal(
      getExamples(`
      // Examples:
      // - "blah"
      // - not "wooo"`),
      [
        {example: 'blah', shouldMatch: true},
        {example: 'wooo', shouldMatch: false},
      ],
  );
  assert.equal(getExamples('// Examples:\n// - not"x"'), [], 'space required after "not"');
  assert.equal(getExamples('// Examples:\n// -not"x"'), [], 'space required before "not"');
});

test('example comments - corner cases', () => {
  assert.equal(getExamples('// Examples:\n    // - "blah"\n'), [
    {example: 'blah', shouldMatch: true},
  ]);
  assert.equal(
      getExamples(`
      // Examples:
      // - "blah"
      // - "wooo"`),
      [
        {example: 'blah', shouldMatch: true},
        {example: 'wooo', shouldMatch: true},
      ],
  );
  assert.equal(getExamples('// Examples:'), []);
  assert.equal(getExamples('// Examples:\n// - ""'), [{example: '', shouldMatch: true}]);
  assert.equal(
      getExamples('// Examples:\n// - "" '),
      [{example: '', shouldMatch: true}],
      'trailing space is ok',
  );
  assert.equal(getExamples('// Examples:\n\n// - ""'), [{example: '', shouldMatch: true}]);
});

test.run();
