import * as ohm from 'ohm-js';

/*
  TODO:
  - add support for example comments above the grammar (default start rule)
  - add tests for multiple grammars in the same file
  - add API for testing examples?
 */

export const ohmWithExamples = ohm.grammar(
    String.raw`
  OhmWithExamples <: Ohm {
    grammarsWithExamples = (exampleComments applySyntactic<Grammar>)*

    Grammar := ident SuperGrammar? "{" (#exampleComments Rule)* "}"
    exampleComments = (spacesNoComment comment)*

    comment += exampleComment

    exampleComment
      = "// Examples:" spacesNoNl "\n" nonemptyListOf<exampleItem, "\n">
    
    exampleItem
      = spacesNoComment "// - " not? terminal spacesNoNl &"\n"
    
    not = "not" (~"\n" space)+
    spacesNoNl = (~"\n" space)*
    spacesNoComment = (~comment space)*
  }
`,
    {Ohm: ohm.ohmGrammar},
);

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
  exampleComment(_head, _spaces, _nl, exampleItemList) {
    return exampleItemList.asIteration().children.flatMap(c => c.examples());
  },
  comment_singleLine(_, commentCharIter, _nl) {
    return [];
  },
  comment_multiLine(_, commentCharIter, _nl) {
    return [];
  },
  exampleItem(_spaces, _bullet, notOpt, terminal, _spaces2, _nl) {
    const shouldMatch = notOpt.numChildren > 0 ? false : true;
    return [{example: terminal.terminalChars(), shouldMatch}];
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
