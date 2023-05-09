import assert from 'assert';
import {readFileSync} from 'fs';
import * as ohm from 'ohm-js';
import {exit} from 'process';

const {raw} = String;

// Maps from a Unicode character literal as used in the ECMAScript spec to
// an equivalent Ohm parsing expression.
const literalToOhm = {
  LF: raw`"\n"`,
  CR: raw`"\r"`,
  TAB: raw`"\t"`,
  VT: raw`"\x0B"`,
  FF: raw`"\x0C"`,
  SP: raw`" "`,
  NBSP: raw`"\xA0"`,
  ZWNBSP: raw`"\uFEFF"`,
  LS: raw`"\u2028"`,
  PS: raw`"\u2029"`,
  USP: 'unicodeZs'
};

function safelyReplace(str, pattern, replacement) {
  if (!str.includes(pattern)) console.error(str);
  assert(str.includes(pattern), `not found: ${JSON.stringify(pattern)}`);
  return str.replace(pattern, replacement);
}

const lexicalRuleName = str => str[0].toLowerCase() + str.slice(1);
const syntacticRuleName = str => {
  assert(str[0] === str[0].toUpperCase());
  return str;
};

let ruleOverrides = {};
/*
  Allows particular rule bodies to be overridden, by specifying either:

  1. a string to use as the rule body
  2. a function (rhs: Node, defaultBody: string) => string, where the function
     result will be used as the rule body.
 */
function mkRuleOverrides(substitutions) {
  const overrides = {};
  for (const substitution of substitutions) {
    const keys = Object.keys(substitution)
    if (keys.includes('override')) {
      overrides[substitution.name] = substitution.override;
      continue;
    }
    if (keys.includes('pattern') && keys.includes('replacement')) {
      let postlude = '';
      if (keys.includes('postlude')) {
        postlude = substitution.postlude
      }
      overrides[substitution.name] = (rhs, defaultBody) => (safelyReplace(defaultBody, substitution.pattern, substitution.replacement) + postlude)
    }
  }
  return overrides
}

let reservedWordProductions = [];
// All productions (using the source grammar naming scheme) that are define lists of
// reserved words. We modify these to ensure that they don't match against valid identifiers
// that happen to have a keyword as a prefix — e.g., `class` matching `classification`.
function mkReservedWordProductions(productions) {
  return productions;
}

// Converts all terminals in the rule body to rule applications.
// E.g., `"blah" | "blarg"` => `blah | blarg`.
const terminalsToRules = ohmString => ohmString.replace(/"/g, '');


const PRELUDE = raw`
  Start = Script

  // Override Ohm's built-in definition of space.
  space := whiteSpace | lineTerminator | comment

  unicodeZs = "\xA0" | "\u1680" | "\u2000".."\u200A" | "\u202F" | "\u205F" | "\u3000"

  multiLineCommentNoNL = "/*" (~("*/" | lineTerminator) sourceCharacter)* "*/"

  // does not accept lineTerminators, not even implicit ones in a multiLineComment (cf. section 7.4)
  spacesNoNL = (whiteSpace | singleLineComment | multiLineCommentNoNL)*

  // A semicolon is "automatically inserted" if a newline or the end of the input stream is
  // reached, or the offending token is "}".
  // See https://es5.github.io/#x7.9 for more information.
  // NOTE: Applications of this rule *must* appear in a lexical context -- either in the body of a
  // lexical rule, or inside '#()'.
  sc = space* (";" | end)
     | spacesNoNL (lineTerminator | ~multiLineCommentNoNL multiLineComment | &"}")
`;

function overrideRuleBodyOrElse(ruleName, rhs, noOverrideValue) {
  const override = ruleOverrides[ruleName];
  if (typeof override === 'string') {
    return override;
  } else if (typeof override === 'function') {
    return override(rhs, noOverrideValue);
  } else {
    return noOverrideValue;
  }
}

const grammarSource = readFileSync(new URL('./grammarkdown.ohm', import.meta.url), 'utf-8');
const grammarkdown = ohm.grammar(grammarSource);
const semantics = grammarkdown.createSemantics();

let grammarName; // Initialized in main(), below.

semantics.addOperation(
  'toOhm()',
  (() => {
    function handleProduction(nonterminal, rhs, parameterListOpt = undefined, kind = 'LEXICAL') {
      // const isLexical = parameterListOpt === undefined;
      const isLexical = kind === 'LEXICAL'
      const strippedNonTerminal = nonterminal.sourceString.replaceAll('|', '')
      const ruleName = isLexical
        ? lexicalRuleName(strippedNonTerminal)
        : syntacticRuleName(strippedNonTerminal);
      const parameterList = parameterListOpt && parameterListOpt.child(0);
      const params = parameterList ? parameterList.toOhm() : '';
      const body = overrideRuleBodyOrElse(ruleName, rhs, rhs.toOhm());
      const op = ruleName === 'hexDigit' ? ':=' : '=';
      return `${ruleName}${params} ${op} ${body}`;
    }

    const handlePositiveLookahead = (_, _op, exprList) => `&(${exprList.children.map(c => c.toOhm()).join('|')})`;
    const handleNegativeLookahead = (_, _op, exprList) => {
      if (exprList.isIteration()) {
        return `~(${exprList.children.map(c => c.toOhm()).join('|')})`;
      }
      return `~${exprList.toOhm()}`;
    }

    return {
      Productions(productionIter) {
        const rules = productionIter.children.map(c => c.toOhm());
        for (const param of new Set(this.allParameters)) {
          rules.push(...[`with${param} = /* fixme */`, `no${param} = ~any /* is this right? */`]);
        }
        const prettyRules = [...rules].join('\n\n  ');
        const indentedAdditionalRules = this.getAdditionalRules().map(str => `  ${str}`);
        const additionalRules = ['', ...indentedAdditionalRules, ''].join('\n');
        return `${grammarName} {\n${PRELUDE}\n  ${prettyRules}\n${additionalRules}}`;
      },
      Production_lexical(nonterminal, parameterListOpt, _, rhs) {
        return handleProduction(nonterminal, rhs, parameterListOpt);
      },
      Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
        return handleProduction(nonterminal, rhs, parameterListOpt, 'SYNTACTIC');
      },
      ParameterList(_open, listOfParameter, _close) {
        const params = listOfParameter.asIteration().children.map(c => c.toOhm());
        return `<${params.join(', ')}>`;
      },
      parameter(_first, _rest) {
        return `guard${this.sourceString}`;
      },
      RightHandSide_prose(_, proseSentence) {
        return `/* ${proseSentence.sourceString} */`;
      },
      RightHandSide_oneOf(_, terminalIter) {
        const terminals = terminalIter.children.map(c => c.toOhm());
        // Sort by descending length to avoid bugs with Ohm's prioritized choice, if
        // one terminal is a prefix of another one (e.g. "in" / "instanceof").
        terminals.sort((a, b) => b.length - a.length);
        return terminals.join(' | ');
      },
      RightHandSide_alternatives(sentenceIter) {
        let needsCaseNames = false;
        let sentences = sentenceIter.children.map(sentence => {
          // If any alternative has an arity other than one, add case names for *all*.
          if (sentence.simpleArity !== 1) {
            needsCaseNames = true;
          }
          return [sentence, sentence.toOhm()];
        });
        if (needsCaseNames) {
          // Use a case name base on the _original_ ordering of the alternatives.
          sentences = sentences.map(([s, ohmSentence], i) => {
            return [s, `${ohmSentence} -- alt${i + 1}`];
          });
        }
        // Sort the alternatives so that "obviously" left-recursive rules come first.
        const {productions, ruleName} = this.context;
        sentences.sort(([a], [b]) => {
          return (b.isLeftRecursive(ruleName) ? 1 : 0) - (a.isLeftRecursive(ruleName) ? 1 : 0);
        });
        const ohmSentences = sentences.map(([s, ohmSentence]) => ohmSentence);
        return ['', ...ohmSentences].join('\n    | ');
      },
      rhsSentence(_, termIter) {
        return termIter.children.map(c => c.toOhm()).join(' ');
      },
      application_basic(nonterminal) {
        return nonterminal.toOhm();
      },
      term_opt(application, _) {
        return `${application.toOhm()}?`;
      },
      term_assertion(assertionContents) {
        return assertionContents.toOhm();
      },
      term_terminal(terminal) {
        // Rewrite keyword terminals to instead use the helper rule that we define
        // for each keyword. E.g, use `new` rather than `"new"`.
        const root = this.context.productions;
        const ohmTerminal = terminal.toOhm();
        return root.reservedWords.has(ohmTerminal)
          ? terminalsToRules(ohmTerminal)
          : ohmTerminal;
      },
      term_link(_) {
        return ''
      },
      assertion(_open, assertionContents, _close) {
        return assertionContents.toOhm();
      },
      AssertionContents_empty(_) {
        return '/* empty */';
      },
      AssertionContents_noSymbolHere(_no, nonterminal, _here) {
        return `~${nonterminal.toOhm()}`;
      },
      AssertionContents_lexicalGoal(_lexical, _goal, nonterminal) {
        return `~${nonterminal.toOhm()}`;
      },
      AssertionContents_paramSet(_, param) {
        return `guard${param.sourceString}`;
      },
      AssertionContents_paramCleared(_, param) {
        return `guard${param.sourceString}`;
      },
      AssertionContents_prose(_, _charIter) {
        return `/* FIXME Assertion: ${this.sourceString} */`;
      },
      Lookahead_positive: handlePositiveLookahead,
      Lookahead_positiveSet: handlePositiveLookahead,
      Lookahead_negative: handleNegativeLookahead,
      Lookahead_negativeSet: handleNegativeLookahead,
      Lookahead_negativeNonterminal: handleNegativeLookahead,
      LookaheadSet(_open, listOfTerminalIter, _close) {
        const items = listOfTerminalIter.asIteration().children.map(terminalIter => {
          const ans = terminalIter.children.map(c => c.toOhm()).join(' ');
          return terminalIter.numChildren > 1 ? `(${ans})` : ans;
        });
        return `(${items.join(' | ')})`;
      },
      application_withCondition(nonterminal, butNotCondition) {
        return `${butNotCondition.toOhm()} ${nonterminal.toOhm()}`;
      },
      application_withArgs(nonterminal, _open, applyListOfArgument, _close) {
        const listOfArgument = applyListOfArgument.child(0);
        const ruleName = nonterminal.toOhm();
        const ohmArgs = getOhmArgs(
          this.context.productions,
          ruleName,
          listOfArgument.asIteration().children
        );
        return `${ruleName}<${ohmArgs.join(', ')}>`;
      },
      application_basic(nonterminal) {
        const ruleName = nonterminal.toOhm();
        const ohmArgs = getOhmArgs(this.context.productions, ruleName, []);
        if (ohmArgs.length > 0) {
          return `${ruleName}<${ohmArgs.join(', ')}>`;
        }
        return ruleName;
      },
      argument_set(_, param) {
        return `with${param.sourceString}`;
      },
      argument_pass(_, param) {
        return param.toOhm();
      },
      argument_unset(_, param) {
        return `no${param.sourceString}`;
      },
      butNotCondition_basic(_, basicTerm) {
        return `~${basicTerm.toOhm()}`;
      },
      butNotCondition_oneOf(_, listOfBasicTerm) {
        const terms = listOfBasicTerm.asIteration().children.map(c => c.toOhm());
        return `~(${terms.join(' | ')})`;
      },
      nonterminal(_optPipe, _, _2, _optPipe2) {
        const {sourceString} = this;
        const trimmedSourceString = sourceString.replaceAll('|', '')
        const root = this.context.productions;
        if (root.productionsByName.has(trimmedSourceString)) {
          return sourceString;
        }
        const lexicalName = lexicalRuleName(trimmedSourceString);
        assert(root.productionsByName.has(lexicalName));
        return lexicalName;
      },
      terminal_backtick(_) {
        return '"`"';
      },
      terminal_other(_open, char, _close) {
        const {sourceString} = char;
        switch (sourceString) {
          case '\\':
            return '"\\\\"';
          case '"':
            return '"\\""';
          case ';':
            return '#sc';
        }
        return `"${sourceString.replace('\\','\\\\')}"`;
      },
      literal(_open, charIter, _close) {
        const name = charIter.sourceString;
        if (name in literalToOhm) {
          return literalToOhm[name];
        }
        return `"" /* FIXME ${this.sourceString} */`;
      }
    };
  })()
);

// Computes any additional rules to be appended at the end of the generated grammar.
semantics.addOperation('getAdditionalRules', {
  _nonterminal(...children) {
    return children.flatMap(c => c.getAdditionalRules());
  },
  _iter(...children) {
    return children.flatMap(c => c.getAdditionalRules());
  },
  _terminal() {
    return [];
  },
  Production_lexical(nonterminal, _parameterList, _, rhs) {
    if (reservedWordProductions.includes(nonterminal.sourceString)) {
      const ruleNames = rhs.getReservedWordTerminals().map(t => terminalsToRules(t.toOhm()));
      return ruleNames.map(name => `${name} = "${name}" ~identifierPart`);
    }
    return [];
  }
});

// Extracts all of the terminals from the body of one of the reservedWordProductions.
// These are expected to be either a "one of", or a simple alternation of terminals.
semantics.addOperation('getReservedWordTerminals()', {
  RightHandSide_oneOf(_, terminalIter) {
    return terminalIter.children;
  },
  RightHandSide_alternatives(sentenceIter) {
    return sentenceIter.children.flatMap(c => c.getReservedWordTerminals());
  },
  rhsSentence(_, termIter) {
    return termIter.children.flatMap(c => c.getReservedWordTerminals());
  },
  term_terminal(terminal) {
    return [terminal];
  },
  term_link(_) {
    return '';
  }
});

semantics.addAttribute('simpleArity', {
  rhsSentence(_, termIter) {
    let arity = 0;
    for (const child of termIter.children) {
      arity += child.sourceString === '[empty]' ? 0 : 1;
    }
    return arity;
  }
});

semantics.addAttribute('allParameters', {
  Productions(productionIter) {
    return productionIter.children.flatMap(c => c.allParameters);
  },
  Production_lexical(_nonterminal, parameterListOpt, _, rhs) {
    const parameterList = parameterListOpt.child(0);
    return parameterList ? parameterList.allParameters : [];
  },
  Production_syntactic(_nonterminal, parameterListOpt, _, rhs) {
    const parameterList = parameterListOpt.child(0);
    return parameterList ? parameterList.allParameters : [];
  },
  ParameterList(_open, listOfParameter, _close) {
    return listOfParameter.asIteration().children.map(c => c.allParameters);
  },
  parameter(_first, _rest) {
    return this.sourceString;
  }
});

semantics.addOperation('isLeftRecursive(containingRuleName)', {
  rhsSentence(_, termIter) {
    const firstTerm = termIter.child(0);
    if (firstTerm) {
      return firstTerm.ruleNameForApplication === this.args.containingRuleName;
    }
    return false;
  }
});

semantics.addAttribute('ruleNameForApplication', {
  term(child) {
    return child.ruleNameForApplication;
  },
  term_opt(appl, _) {
    return appl.ruleNameForApplication;
  },
  term_nonterminal(appl) {
    return appl.ruleNameForApplication;
  },
  term_terminalOpt(_, _opt) {
    return undefined;
  },
  term_terminal(_) {
    return undefined;
  },
  term_assertion(assertion) {
    return undefined;
  },
  term_link(_) {
    return undefined;
  },
  application(child) {
    return child.ruleNameForApplication;
  },
  application_withCondition(nonterminal, _) {
    return nonterminal.toOhm();
  },
  application_withArgs(nonterminal, _open, listOfArgument, _close) {
    return nonterminal.toOhm();
  },
  application_basic(nonterminal) {
    return nonterminal.toOhm();
  }
});

function getOhmArgs(root, ruleName, argumentArr) {
  const argMap = new Map(
    argumentArr.map(arg => {
      const {name, type} = arg.argumentInfo;
      return [name, type];
    })
  );

  const {allParameters} = root.productionsByName.get(ruleName);
  return allParameters.map(paramName => {
    switch (argMap.get(paramName)) {
      case 'set':
        return `with${paramName}`;
      case 'pass':
        return `guard${paramName}`;
      case 'unset':
      default:
        return `no${paramName}`;
    }
  });
}

semantics.addAttribute('productionsByName', {
  Productions(productionIter) {
    return new Map(
      productionIter.children.map(prod => {
        return [prod.ruleNameForProduction, prod];
      })
    );
  }
});

// Returns a Set containing all the reserved words defined in the grammar.
// Note that the words are all double-quoted like an Ohm terminal — e.g., `"class"`.
semantics.addAttribute('reservedWords', {
  Productions(productionIter) {
    const ans = new Set();
    for (const prod of productionIter.children) {
      prod.reservedWords.forEach(word => ans.add(word));
    }
    return ans;
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
    return new Set();
  },
  Production_lexical(nonterminal, parameterListOpts, _, rhs) {
    if (reservedWordProductions.includes(nonterminal.sourceString)) {
      return new Set(rhs.getReservedWordTerminals().map(t => t.toOhm()));
    }
    return new Set([]);
  }
});

semantics.addAttribute('ruleNameForProduction', {
  Production_lexical(nonterminal, parameterListOpt, _, rhs) {
    return lexicalRuleName(nonterminal.sourceString);
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
    return syntacticRuleName(nonterminal.sourceString);
  }
});

semantics.addAttribute('argumentInfo', {
  argument_set(_, param) {
    return {name: param.sourceString, type: 'set'};
  },
  argument_pass(_, param) {
    return {name: param.sourceString, type: 'pass'};
  },
  argument_unset(_, param) {
    return {name: param.sourceString, type: 'unset'};
  }
});

addContext(semantics, (setContext, getContext) => ({
  Productions(productionIter) {
    setContext(productionIter, {productions: this});
  },
  Production_lexical(nonterminal, parameterListOpt, _, rhs) {
    setContext(rhs, {
      ruleName: this.ruleNameForProduction,
      isLexicalProduction: true,
      isSyntacticProduction: false,
      production: this
    });
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
    setContext(rhs, {
      ruleName: this.ruleNameForProduction,
      isLexicalProduction: false,
      isSyntacticProduction: true,
      production: this
    });
  },
  _default(...children) {
    children.forEach(c => setContext(c, {})); // fixme - do this inside AddContext
  }
}));

/*
  An experiment in having a generic way to implement something like inherited
  attributes. Basically, a regular Ohm attribute where the value of the
  attribute for a given node is determined by that node's parent.

  Thoughts: it seems useful to be able to set the context on the node itself,
  not just its children. Either (a) we should support `this` as the first arg
  to setContext, or (b) allow returning a value from the action.
 */
function addContext(semantics, getActions) {
  const ctx = [{}];
  // NOTE: You cannot pass `this` for the node, or it will blow the stack.
  const setContext = (node, val) => {
    const newContext = Object.create(ctx[ctx.length - 1]);
    Object.assign(newContext, val);
    ctx.push(newContext);
    node.context; // set the context if it isn't already
    ctx.pop();
  };
  const getContext = () => ctx[ctx.length - 1];
  // TODO: Could the operation name be a Symbol?
  semantics.addOperation('_initContextForSubtrees()', getActions(setContext, getContext));

  function defaultHandler(...children) {
    this._initContextForSubtrees();
    return ctx[ctx.length - 1];
  }

  semantics.addAttribute('context', {_default: defaultHandler});
}

/*
  Generates an Ohm grammar given an input file containing a grammar from
  one of the ECMAScript specs. See https://github.com/rbuckton/grammarkdown
  for details of the grammar format.
 */
(function main() {
  grammarName = process.argv[2];
  const inputFilename = process.argv[3];
  if (process.argv.length > 4) {
    const overrideConfig = JSON.parse(readFileSync(process.argv[4], { encoding: 'utf-8'}));
    if (overrideConfig.substitutions) {
      ruleOverrides = mkRuleOverrides(overrideConfig.substitutions);
    }
    if (overrideConfig.reservedWords) {
      reservedWordProductions = mkReservedWordProductions(overrideConfig.reservedWords)
      // Add a rule override for each of the reserved word productions.
      for (const prod of reservedWordProductions) {
        ruleOverrides[lexicalRuleName(prod)] = (rhs, defaultBody) => terminalsToRules(defaultBody);
      }
    }
  }

  const result = grammarkdown.match(readFileSync(inputFilename, 'utf-8'));
  if (!result.succeeded()) {
    console.error(result.message);
  }

  const root = semantics(result);
  root.context; // Trigger creation of the context attribute on all nodes.
  const outGrammar = root.toOhm();

  // If the resulting grammar is valid, write it to stdout.
  try {
    ohm.grammar(outGrammar);
    console.log(outGrammar);
  } catch (e) {
    console.error(e.message);
    exit(1);
  }
})();
