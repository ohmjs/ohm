import {createProjectSync, ts} from '@ts-morph/bootstrap';
import test from 'ava';

import {generateTypings} from './generateTypings';

function typeCheck(name: string, grammarSource: string, tsSource: string) {
  const project = createProjectSync();
  const {filename, contents} = generateTypings(grammarSource, `${name}.ohm`);

  const grammarDTS = project.createSourceFile(filename, contents);
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
      import {GGrammar} from './g.ohm';
      
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
      import {GGrammar} from './g.ohm';
      
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
  t.true(diagnostics.length > 0);
  t.deepEqual(diagnostics.slice(1), []);
  t.is(
    diagnostics[0].messageText,
    "Type '(letters: any, x: any) => any' is not assignable to type '(arg0: NonterminalNode) => number'."
  );
});

test('incorrect return type', t => {
  const diagnostics = typeCheck(
    'g',
    grammarSources.g,
    `
      import * as ohm from 'ohm-js';
      import {GGrammar} from './g.ohm';
      
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
    t.is(
      messageText.messageText,
      "Type '(letters: NonterminalNode) => string' is not assignable to type '(arg0: NonterminalNode) => number'."
    );
  }
});
