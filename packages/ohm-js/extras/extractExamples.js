import * as ohm from 'ohm-js';

export const grammarsSource = String.raw`
  /*
    Superset of the Ohm grammar that allows examples to be embedded in comments.
    Any valid Ohm grammar will also be matched by this grammar.
  */

  // Example:
  //+ "//+ \"x\"\nG {\n//- \"\"\nstart = \"x\"}"
  OhmWithExamples <: Ohm {
    // The default start rule for Ohm is 'Grammars', which is syntactic rule.
    // When the start rule is a syntactic rule, there's no way to get access to
    // leading space (including comments). So, for this grammar to be useful,
    // you have to explicit use this rule as the start rule.
    grammarsWithExamples = (exampleComments applySyntactic<Grammar>)*

    Grammar := ident SuperGrammar? "{" (#exampleComments Rule)* "}"

    exampleComments = (spacesNoExampleComment exampleComment)*

    // Examples:
    //+ "//+ \"blah\""
    //+ "//- \"one\", \"two\""
    //- "// - \"x\", "//-\"x\"
    exampleComment
      = "//+" examples  -- positive
      | "//-" examples  -- negative

    examples = spaceNoNl+ nonemptyListOf<terminal, exampleSep> spaceNoNl*
    exampleSep = "," spaces

    exampleCommentPrefix = "//+" | "//-"  

    spaceNoNl = ~"\n" space
    spacesNoExampleComment = (~exampleCommentPrefix space)*
  }

  /*
    A stricter version of the grammar that prevents many malformed example
    comments from being parsed as regular comments.
  */
  OhmWithExamplesStrict <: OhmWithExamples {
    // Redefine 'comment' to avoid malformed example comments from silently
    // being parsed as regular comments.
    comment :=
      | ~exampleCommentPrefix comment_singleLine
      | comment_multiLine
  }
`;

export const grammars = ohm.grammars(grammarsSource, {Ohm: ohm.ohmGrammar});

const semantics = grammars.OhmWithExamples.createSemantics().addOperation('hasExamples', {
  _iter(...children) {
    return children.some(c => c.hasExamples());
  },
  exampleComments(_, commentIter) {
    return commentIter.numChildren > 0;
  },
});

semantics.addOperation('examples', {
  grammarsWithExamples(exampleCommentsIter, grammarIter) {
    const result = [];
    for (const [i, child] of Object.entries(grammarIter.children)) {
      if (exampleCommentsIter.hasExamples()) {
        const defaultExamples = exampleCommentsIter.child(i).examples();
        const grammar = child.grammarName();
        result.push(...defaultExamples.map(ex => ({...ex, grammar, rule: ''})));
      }
      result.push(...child.examples());
    }
    return result;
  },
  Grammar(name, _, _open, exampleCommentsIter, ruleIter, _close) {
    const result = [];
    const grammar = this.grammarName();
    for (let i = 0; i < ruleIter.numChildren; i++) {
      const rule = ruleIter.child(i).ruleName();

      // Augment each of the examples with the grammar and rule name.
      const examples = exampleCommentsIter.child(i).examples();
      const augmentedExamples = examples.map(ex => ({...ex, grammar, rule}));

      result.push(...augmentedExamples);
    }
    return result;
  },
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
      return {example: JSON.parse(t.sourceString)};
    });
  },
  comment_singleLine(_, commentCharIter, _nl) {
    return [];
  },
  comment_multiLine(_, commentCharIter, _nl) {
    return [];
  },
});

semantics.addOperation('grammarName', {
  Grammar(name, _, _open, exampleCommentsIter, ruleIter, _close) {
    return name.sourceString;
  },
});

semantics.addOperation('ruleName', {
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
  const matchResult = grammars.OhmWithExamples.match(grammarDef, 'grammarsWithExamples');
  if (matchResult.failed()) {
    throw new Error(matchResult.message);
  }
  return semantics(matchResult).examples();
}
