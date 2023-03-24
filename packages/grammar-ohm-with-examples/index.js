import fs from 'node:fs';
import * as ohm from 'ohm-js';

/*
  TODO:
  - add support for example comments above the grammar (default start rule)
  - add tests for multiple grammars in the same file
  - add API for testing examples?
 */

const grammars = ohm.grammars(fs.readFileSync('./ohm-with-examples.ohm', 'utf-8'), {
  Ohm: ohm.ohmGrammar,
});

export const ohmWithExamples = grammars.OhmWithExamples;

export const s = ohmWithExamples.createSemantics().addOperation('getRulesWithExamples', {
  grammarsWithExamples(exampleCommentsIter, grammarIter) {
    const result = {};
    for (const [i, child] of Object.entries(grammarIter.children)) {
      const includeDefaults = exampleCommentsIter.hasExamples();
      const defaultExamples = exampleCommentsIter.child(i).examples();
      result[child.grammarName()] = {
        ...child.getRulesWithExamples(),
        ...(includeDefaults ? {'(default)': defaultExamples} : {}),
      };
    }
    return result;
  },
  Grammar(name, _, _open, exampleCommentsIter, ruleIter, _close) {
    const result = {};
    for (let i = 0; i < ruleIter.numChildren; i++) {
      result[ruleIter.child(i).ruleName()] = exampleCommentsIter.child(i).examples();
    }
    return result;
  },
});

s.addOperation('hasExamples', {
  _iter(...children) {
    return children.some(c => c.hasExamples());
  },
  exampleComments(_, commentIter) {
    return commentIter.numChildren > 0;
  },
});

s.addOperation('examples', {
  exampleComments(_, commentIter) {
    return commentIter.children.flatMap(c => c.examples());
  },
  exampleComment_positive(_, examples) {
    return examples.examples().map(ex => ({...ex, shouldMatch: true}));
  },
  exampleComment_negative(_, examples) {
    return examples.examples().map(ex => ({...ex, shouldMatch: false}));
  },
  examples(_ws, terminalList, _) {
    return terminalList.asIteration().children.map(t => {
      return {example: t.terminalChars()};
    });
  },
  comment_singleLine(_, commentCharIter, _nl) {
    return [];
  },
  comment_multiLine(_, commentCharIter, _nl) {
    return [];
  },
});

s.addOperation('terminalChars', {
  terminal(_open, terminalCharIter, _close) {
    return terminalCharIter.sourceString;
  },
});

s.addOperation('grammarName', {
  Grammar(name, _, _open, exampleCommentsIter, ruleIter, _close) {
    return name.sourceString;
  },
});

s.addOperation('ruleName', {
  Rule_define(ident, _formals, _desc, _, _body) {
    return ident.sourceString;
  },
  Rule_override(ident, _formals, _, _body) {
    return ident.sourceString;
  },
  Rule_extend(ident, _formals, _, _body) {
    return ident.sourceString;
  },
});

export function extractExamples(grammarDef) {
  const matchResult = ohmWithExamples.match(grammarDef, 'grammarsWithExamples');
  if (matchResult.failed()) {
    throw new Error(matchResult.message);
  }
  return s(matchResult).getRulesWithExamples();
}
