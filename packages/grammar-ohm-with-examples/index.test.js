import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {extractExamples, ohmWithExamples, s} from './index.js';

test('empty', () => {
  assert.equal(extractExamples(''), {});
});

test('grammar with no examples', () => {
  assert.equal(extractExamples('G { }'), {G: {}});
});

test('simple examples', () => {
  assert.equal(
    extractExamples(`
      G {
        // Examples:
        // - "x"
        start = "x"
      }
    `),
    {
      G: {
        start: [{example: 'x', shouldMatch: true}]
      }
    }
  );

  assert.equal(
    extractExamples(`
      G {
        // Examples:
        // - ""
        start = ""

        // Examples:
        // - "x"
        other = ""
      }
    `),
    {
      G: {
        start: [{example: '', shouldMatch: true}],
        other: [{example: 'x', shouldMatch: true}]
      }
    }
  );
});

test('examples for default start rule', () => {
  const def1 = `
    // Examples:
    // - "hey"
    G {
      // Examples:
      // - ""
      start = ""
    }
  `;

  assert.equal(extractExamples(def1), {
    G: {
      '(default)': [{example: 'hey', shouldMatch: true}],
      start: [{example: '', shouldMatch: true}]
    }
  });
});

function getExamples(input) {
  const {G} = extractExamples(`G { ${input}\nstart = }`);
  return G.start;
}

test('example comments', () => {
  assert.equal(getExamples('// Examples:\n    // - "blah"\n'), [
    {example: 'blah', shouldMatch: true}
  ]);
  assert.equal(
    getExamples(`
      // Examples:
      // - "blah"
      // - "wooo"`),
    [
      {example: 'blah', shouldMatch: true},
      {example: 'wooo', shouldMatch: true}
    ]
  );
  assert.equal(getExamples('// Examples:'), []);
  assert.equal(getExamples('// Examples:\n// - ""'), [{example: '', shouldMatch: true}]);
  assert.equal(getExamples('// Examples:\n// - "" '), [{example: '', shouldMatch: true}]);

  assert.equal(getExamples('// Examples:\n\n// - ""'), [{example: '', shouldMatch: true}]);
});

test.run();
