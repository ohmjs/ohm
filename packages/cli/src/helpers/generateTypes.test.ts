import test from 'ava';
import * as fs from 'fs';
import * as ohm from 'ohm-js';
import dedent from 'ts-dedent';
import {Project} from 'ts-morph';

import {generateTypes} from './generateTypes';

// Snarf the contents of Ohm's type declarations, so we can stuff it into the in-memory fs.
const ohmDTSContents = fs.readFileSync(`${__dirname}/../../../ohm-js/index.d.ts`, 'utf-8');

// Helpers
// -------

function typeCheck(name: string, grammarSource: string, tsSource: string) {
  const project = new Project({useInMemoryFileSystem: true});

  // I couldn't figure out the right way to properly import 'ohm-js' when using ts-morph's
  // in-memory file system, so create a fake file and stuff in the correct contents.
  project.createSourceFile('hackyInMemoryOhmDecls.d.ts', ohmDTSContents);
  const recipeDtsContents = generateTypes(ohm.grammar(grammarSource)).replace(
    `from 'ohm-js'`,
    `from './hackyInMemoryOhmDecls'`
  );

  project.createSourceFile(`${name}.ohm-recipe.d.ts`, recipeDtsContents);
  project.createSourceFile(`${name}.ts`, tsSource);

  const diagnostics = project.getPreEmitDiagnostics();
  //  console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
  return diagnostics.map(d => d.getMessageText());
}

const grammarSources = {
  g: dedent`
    G {
      start = letters
      letters = letter+
    }
  `
};

const defaultActionsSource = dedent`
  start(letters) {
    return letters.op();
  },
  letters(letterIter) {
    return letterIter.children.length;
  }
`;

const createMainSource = (actionsSource: string) => dedent`
  import * as ohm from './hackyInMemoryOhmDecls';
  import {GGrammar} from './g.ohm-recipe';

  const g: GGrammar = ohm.grammar(\`${grammarSources.g}\`);
  const s = g.createSemantics().addOperation<number>('op', {
    ${actionsSource}
  });
`;

// Tests
// -----

test('.d.ts. contents', t => {
  t.snapshot(generateTypes(ohm.grammar(grammarSources.g)));
});

test('basic working example', t => {
  const diagnostics = typeCheck('g', grammarSources.g, createMainSource(defaultActionsSource));
  t.deepEqual(diagnostics, []);
});

test('incorrect arity', t => {
  const diagnostics = typeCheck(
    'g',
    grammarSources.g,
    createMainSource(`
      start(letters, x) {
        return letters.op();
      },
      letters(letterIter) {
        return letterIter.children.length;
      }
    `)
  );
  t.deepEqual(diagnostics, [
    `Type \'(letters: any, x: any) => any\' is not assignable to type \'(this: NonterminalNode, arg0: NonterminalNode) => number\'.`
  ]);
});

test('incorrect return type', t => {
  const diagnostics = typeCheck(
    'g',
    grammarSources.g,
    createMainSource(`
        start(letters) {
          return 'not a number!';
        },
        letters(letterIter) {
          return letterIter.children.length;
        }
    `)
  );
  t.true(diagnostics.length > 0);
  t.deepEqual(diagnostics.slice(1), []);
  t.snapshot(diagnostics[0]);
});

test('extendSemantics + addOperation', t => {
  const source =
    createMainSource(defaultActionsSource) +
    dedent`
      const s2 = g.extendSemantics(s).addOperation<number>('op2', {
        ${defaultActionsSource}
      });
    `;

  const diagnostics = typeCheck('g', grammarSources.g, source);
  t.deepEqual(diagnostics, []);
});

test('extendOperation', t => {
  const goodSource =
    createMainSource(defaultActionsSource) +
    dedent`
      const s2 = g.extendSemantics(s).extendOperation<number>('op', {
        ${defaultActionsSource}
      });
    `;

  let diagnostics = typeCheck('g', grammarSources.g, goodSource);
  t.deepEqual(diagnostics, []);

  // Check that an action with incorrect arity is flagged by the compiler.
  const badSource = goodSource.replace('start(letters)', 'start(letters, x)');
  diagnostics = typeCheck('g', grammarSources.g, badSource);
  t.pass();
  t.deepEqual(diagnostics, [
    `Type \'(letters: any, x: any) => any\' is not assignable to type \'(this: NonterminalNode, arg0: NonterminalNode) => number\'.`
  ]);
});
