/* eslint-env node */

import test from 'ava';
import fs from 'fs';
import * as ohm from 'ohm-js';
import {dedent} from 'ts-dedent';
import {Project} from 'ts-morph';

import {generateTypes} from './generateTypes.js';

// Snarf the contents of Ohm's type declarations, so we can stuff it into the in-memory fs.
const ohmDTSContents = fs.readFileSync(
  new URL(`../../../ohm-js/index.d.ts`, import.meta.url),
  'utf-8'
);

// Helpers
// -------

function typeCheck(name: string, grammarSource: string, tsSource: string) {
  const project = new Project({useInMemoryFileSystem: true});

  // I couldn't figure out the right way to properly import 'ohm-js' when using ts-morph's
  // in-memory file system, so create a fake file and stuff in the correct contents.
  project.createSourceFile('hackyInMemoryOhmDecls.d.ts', ohmDTSContents);

  const grammars = ohm.grammars(grammarSource);
  const bundleDtsContents = generateTypes(grammars).replace(
    `from 'ohm-js'`,
    `from './hackyInMemoryOhmDecls'`
  );

  project.createSourceFile(`${name}.ohm-bundle.d.ts`, bundleDtsContents);
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
  `,
  g2: dedent`
    G2 <: G {
      start += digits
      digits = digit+
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
  import {GGrammar} from './g.ohm-bundle';

  const g: GGrammar = ohm.grammar(\`${grammarSources.g}\`);
  const s = g.createSemantics().addOperation<number>('op', {
    ${actionsSource}
  });
`;

// Tests
// -----

test('.d.ts. contents', t => {
  const {g, g2} = grammarSources;
  t.snapshot(generateTypes(ohm.grammars(g)));
  t.snapshot(generateTypes(ohm.grammars(g + g2)));
  t.snapshot(generateTypes(ohm.grammars('')));
});

test('basic example, one grammar', t => {
  const diagnostics = typeCheck('g', grammarSources.g, createMainSource(defaultActionsSource));
  t.deepEqual(diagnostics, []);
});

test('basic example, multiple grammars', t => {
  const {g, g2} = grammarSources;
  let mainSource = createMainSource(defaultActionsSource);
  mainSource += dedent`
    import {G2Grammar} from './g.ohm-bundle';
    const g2: G2Grammar = ohm.grammar(\`${grammarSources.g2}\`);
    const s2 = g2.createSemantics().addOperation<number>('op', {
      ${defaultActionsSource}
    });
  `;
  const diagnostics = typeCheck('g', g + g2, mainSource);
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
