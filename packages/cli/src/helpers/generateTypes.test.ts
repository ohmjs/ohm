import {createProjectSync, ts} from '@ts-morph/bootstrap';
import test from 'ava';
import * as ohm from 'ohm-js';

import {generateTypes} from './generateTypes';

function typeCheck(name: string, grammarSource: string, tsSource: string) {
  const project = createProjectSync();
  const typesFilename = `${name}.ohm-recipe.d.ts`;
  const contents = generateTypes(ohm.grammar(grammarSource));

  const grammarDTS = project.createSourceFile(typesFilename, contents);
  const mainFile = project.createSourceFile(`${name}.ts`, tsSource);

  return ts.getPreEmitDiagnostics(project.createProgram());
}

const grammarSources = {
  g: `
    G {
      start = letters
      letters = letter+
    }
  `
};

test('basic working example', t => {
  const diagnostics = typeCheck(
    'g',
    grammarSources.g,
    `
      import * as ohm from 'ohm-js';
      import {GGrammar} from './g.ohm-recipe';
      
      const g: GGrammar = ohm.grammar(\`${grammarSources.g}\`);
      const s = g.createSemantics().addOperation<number>('foo', {
        start(letters) {
          return letters.foo();
        },
        letters(letterIter) {
          return letterIter.children.length;
        }
      });
    `
  );
  t.deepEqual(diagnostics, []);
});

test('incorrect arity', t => {
  const diagnostics = typeCheck(
    'g',
    grammarSources.g,
    `
      import * as ohm from 'ohm-js';
      import {GGrammar} from './g.ohm-recipe';
      
      const g: GGrammar = ohm.grammar(\`${grammarSources.g}\`);
      const s = g.createSemantics().addOperation<number>('foo', {
        start(letters, x) {
          return letters.foo();
        },
        letters(letterIter) {
          return letterIter.children.length;
        }
      });
    `
  );
  t.deepEqual(
    diagnostics.map(d => d.messageText),
    [
      `Type \'(letters: any, x: any) => any\' is not assignable to type \'(this: NonterminalNode, arg0: NonterminalNode) => number\'.`
    ]
  );
});

test('incorrect return type', t => {
  const diagnostics = typeCheck(
    'g',
    grammarSources.g,
    `
      import * as ohm from 'ohm-js';
      import {GGrammar} from './g.ohm-recipe';
      
      const g: GGrammar = ohm.grammar(\`${grammarSources.g}\`);
      const s = g.createSemantics().addOperation<number>('foo', {
        start(letters) {
          return 'not a number!';
        },
        letters(letterIter) {
          return letterIter.children.length;
        }
      });
    `
  );
  t.true(diagnostics.length > 0);
  t.deepEqual(diagnostics.slice(1), []);

  const {messageText} = diagnostics[0];
  if (typeof messageText === 'string') {
    t.fail();
  } else {
    t.snapshot(messageText.messageText);
  }
});
