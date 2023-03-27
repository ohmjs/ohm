import test from 'ava';
import {extractExamples, grammars, grammarsSource} from '../../extras/extractExamples.js';

test('empty', t => {
  t.deepEqual(extractExamples(''), []);
});

test('grammar with no examples', t => {
  t.deepEqual(extractExamples('G { }'), []);
});

test('simple positive examples', t => {
  let examples = extractExamples(`
    G {
      //+ "x"
      start = "x"
    }
  `);
  t.deepEqual(examples, [{grammar: 'G', rule: 'start', example: 'x', shouldMatch: true}]);

  examples = extractExamples(`
    G {
      //+ ""
      start = ""

      //+ "x"
      other = ""
    }
  `);
  t.deepEqual(examples, [
    {grammar: 'G', rule: 'start', example: '', shouldMatch: true},
    {grammar: 'G', rule: 'other', example: 'x', shouldMatch: true},
  ]);
});

test('examples for default start rule', t => {
  let examples = extractExamples(`
    //+ "hey"
    G {
      //+ ""
      start = ""
    }
  `);
  t.deepEqual(examples, [
    {grammar: 'G', rule: '', example: 'hey', shouldMatch: true},
    {grammar: 'G', rule: 'start', example: '', shouldMatch: true},
  ]);

  examples = extractExamples(`
    //+ "hey"
    G {
      //+ ""
      start = ""
    }
  `);
  t.deepEqual(examples, [
    {grammar: 'G', rule: '', example: 'hey', shouldMatch: true},
    {grammar: 'G', rule: 'start', example: '', shouldMatch: true},
  ]);
});

test('top-level whitespace', t => {
  const expected = [{grammar: 'G', rule: '', example: '', shouldMatch: true}];
  t.deepEqual(extractExamples('  //+ ""\n  G{}'), expected);
  t.deepEqual(extractExamples('  //+ "" \nG{}'), expected);
  t.deepEqual(extractExamples('\n\n//+ ""\n\nG{}'), expected);
});

function getExamples(input) {
  return extractExamples(`G { ${input}\nstart = }`).map(({example, shouldMatch}) => {
    return {example, shouldMatch};
  });
}

test('example comments - negative examples', t => {
  t.deepEqual(getExamples('//- "blah"\n'), [{example: 'blah', shouldMatch: false}]);
  t.deepEqual(
      getExamples(`
      //+ "blah"
      //- "wooo"`),
      [
        {example: 'blah', shouldMatch: true},
        {example: 'wooo', shouldMatch: false},
      ],
  );
  //  t.throws(() => getExamples('//-"x"'), null, 'space required after "-"');
  t.deepEqual(getExamples('// - "x"'), [], 'parsed as a normal comment');
});

test('example comments - corner cases', t => {
  t.deepEqual(
      getExamples('//+ "blah"\n\n'),
      [{example: 'blah', shouldMatch: true}],
      'extra blank lines before rule',
  );
  t.deepEqual(
      getExamples(`
      //+ "blah"
      //+    "wooo"`),
      [
        {example: 'blah', shouldMatch: true},
        {example: 'wooo', shouldMatch: true},
      ],
      'extra leading space',
  );
  // t.throws(() => {
  //   t.deepEqual(getExamples('//+ '), [], 'no terminals');
  // });
  t.deepEqual(getExamples('//+ "" '), [{example: '', shouldMatch: true}], 'trailing space');
  t.deepEqual(
      getExamples('//+ ""\n//- ""'),
      [
        {example: '', shouldMatch: true},
        {example: '', shouldMatch: false},
      ],
      'contradictory examples',
  );
  t.deepEqual(
      getExamples('//+ ""\n//+ ""'),
      [
        {example: '', shouldMatch: true},
        {example: '', shouldMatch: true},
      ],
      'duplicate examples',
  );
});

test('extracted examples', t => {
  for (const {grammar, rule, example, shouldMatch} of extractExamples(grammarsSource)) {
    const g = grammars[grammar];
    const startRule = rule === '' ? undefined : rule;
    t.is(g.match(example, startRule).succeeded(), shouldMatch, `${example}`);
  }
});
