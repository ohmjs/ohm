import {readFileSync, writeFileSync} from 'fs';
import {parse} from 'node-html-parser';
import ohm from 'ohm-js';

/*
const root = parse(readFileSync('spec.html', 'utf-8'));
console.log(
  root
    .querySelectorAll('emu-grammar[type="definition"]:not([example])')
    .map(node => node.innerHTML)
);
*/

const INPUT_FILENAME = 'es2015.grammar';

const grammarSource = readFileSync(new URL('./grammarkdown.ohm', import.meta.url), 'utf-8');
const g = ohm.grammar(grammarSource);
const result = g.match(readFileSync(INPUT_FILENAME, 'utf-8'));
if (!result.succeeded()) {
  console.error(result.message);
}

const literalToOhm = {
  LF: '\\n',
  CR: '\\r',
  TAB: '\\t',
  VT: '\\x0B',
  FF: '\\x0C',
  SP: ' ',
  NBSP: '\\xA0',
  ZWNBSP: '\\uFEFF',
  LS: '\\u2028',
  PS: '\\u2029'
};

const semantics = g.createSemantics();
semantics.addOperation('toOhm()', {
  Productions(productionIter) {
    const rules = productionIter.children.map(c => c.toOhm());
    for (const param of new Set(this.allParameters)) {
      rules.push(...[`with${param} = /* fixme */`, `no${param} = /* fixme */`]);
    }
    return ['G {', ...rules, '}'].join('\n\n  ');
  },
  Production_lexical(nonterminal, _, rhs) {
    return `${nonterminal.sourceString} = ${rhs.toOhm()}`;
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
    const parameterList = parameterListOpt.child(0);
    const params = parameterList ? parameterList.toOhm() : '';
    return `${nonterminal.sourceString}${params} = ${rhs.toOhm()}`;
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
    return terminalIter.children.map(c => c.toOhm()).join(' | ');
  },
  RightHandSide_alternatives(sentenceIter) {
    const sentences = sentenceIter.children;
    let ohmSentences = sentences.map(c => c.toOhm());
    if (sentences.some(s => s.simpleArity !== 1)) {
      ohmSentences = ohmSentences.map((s, i) => `${s} -- a${i}`);
    }
    return ['', ...ohmSentences].join('\n    | ');
  },
  rhsSentence(_, termIter) {
    return termIter.children.map(c => c.toOhm()).join(' ');
  },
  application_basic(nonterminal) {
    return nonterminal.sourceString;
  },
  term_opt(application, _) {
    return `${application.toOhm()}?`;
  },
  term_assertion(_open, assertionContents, _close) {
    return assertionContents.toOhm();
  },
  AssertionContents_empty(_) {
    return '""';
  },
  AssertionContents_negativeLookahead(_, _op, terminal) {
    return `~${terminal.toOhm()}`;
  },
  AssertionContents_otherLookahead(_, charIter) {
    return `/* FIXME Assertion: ${this.sourceString} */`;
  },
  AssertionContents_noSymbolHere(_no, nonterminal, _here) {
    return `~${nonterminal.sourceString}`;
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
  application_withCondition(nonterminal, butNotCondition) {
    return `${butNotCondition.toOhm()} ${nonterminal.sourceString}`;
  },
  application_withArgs(nonterminal, _open, applyListOfArgument, _close) {
    const listOfArgument = applyListOfArgument.child(0);
    const ruleName = nonterminal.sourceString;
    const ohmArgs = getOhmArgs(
      this.context.productions,
      ruleName,
      listOfArgument.asIteration().children
    );
    return `${ruleName}<${ohmArgs.join(', ')}>`;
  },
  application_basic(nonterminal) {
    const ruleName = nonterminal.sourceString;
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
  butNotCondition_basic(_, basicTerm) {
    return `~${basicTerm.toOhm()}`;
  },
  butNotCondition_oneOf(_, listOfBasicTerm) {
    const terms = listOfBasicTerm.asIteration().children.map(c => c.toOhm());
    return `~(${terms.join(' | ')})`;
  },
  nonterminal(_, _2) {
    return this.sourceString;
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
    }
    return `"${char.sourceString}"`;
  },
  literal(_open, charIter, _close) {
    const name = charIter.sourceString;
    if (name in literalToOhm) {
      return `"${literalToOhm[name]}"`;
    }
    return `"" /* FIXME ${this.sourceString} */`;
  }
});

semantics.addAttribute('simpleArity', {
  rhsSentence(_, termIter) {
    return termIter.numChildren;
  }
});

semantics.addAttribute('allParameters', {
  Productions(productionIter) {
    return productionIter.children.flatMap(c => c.allParameters);
  },
  Production_lexical(nonterminal, _, rhs) {
    return [];
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
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

function getOhmArgs(root, ruleName, argumentArr) {
  const argMap = new Map(
    argumentArr.forEach(arg => {
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
    }
    return `no${paramName}`;
  });
}

semantics.addAttribute('productionsByName', {
  Productions(productionIter) {
    return new Map(
      productionIter.children.map(prod => {
        return [prod.productionName, prod];
      })
    );
  }
});

semantics.addAttribute('productionName', {
  Production_lexical(nonterminal, _, rhs) {
    return nonterminal.sourceString;
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
    return nonterminal.sourceString;
  }
});

semantics.addAttribute('argumentInfo', {
  argument_set(_, param) {
    return {name: param.sourceString, type: 'set'};
  },
  argument_pass(_, param) {
    return {name: param.sourceString, type: 'pass'};
  }
});

addContext(semantics, (setContext, getContext) => ({
  Productions(productionIter) {
    setContext(productionIter, {productions: this});
  },
  Production_lexical(nonterminal, _, rhs) {
    setContext(rhs, {
      ruleName: nonterminal.sourceString,
      isLexicalProduction: true,
      isSyntacticProduction: false,
      production: this
    });
  },
  Production_syntactic(nonterminal, parameterListOpt, _, rhs) {
    setContext(rhs, {
      ruleName: nonterminal.sourceString,
      isLexicalProduction: false,
      isSyntacticProduction: true,
      production: this
    });
  },
  _default(...children) {
    children.forEach(c => setContext(c, {})); // fixme - do this inside AddContext
  }
}));

const root = semantics(result);
root.context;
const ohmGrammar = root.toOhm();
writeFileSync(`${INPUT_FILENAME}.ohm`, ohmGrammar, 'utf-8');
//console.log(ohmGrammar);
try {
  ohm.grammar(ohmGrammar);
  console.log('grammar parsed successfully!');
} catch (e) {
  console.log(e.message);
}

// -----------------------

function addContext(semantics, getActions) {
  const ctx = [{}];
  // TODO: Does this work correctly if node is `this`? No, it blows the stack.

  /* Thoughts: it seems useful to be able to set the context on the node itself,
     not just its children. Either (a) we should support `this` as the first arg
     to setContext, or (b) allow returning a value from the action.
     */

  const setContext = (node, val) => {
    const newContext = Object.create(ctx[ctx.length - 1]);
    Object.assign(newContext, val);
    ctx.push(newContext);
    node.context; // set the context if it isn't already
    ctx.pop();
  };
  const getContext = () => ctx[ctx.length - 1];
  semantics.addOperation('_initContextForSubtrees()', getActions(setContext, getContext));

  function defaultHandler(...children) {
    this._initContextForSubtrees();
    return ctx[ctx.length - 1];
  }

  semantics.addAttribute('context', {
    _default: defaultHandler
    //    _iter: defaultHandler
  });
}
