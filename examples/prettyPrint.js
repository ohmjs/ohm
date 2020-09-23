/* eslint-env node */

'use strict';

const fs = require('fs');
const ohm = require('../ohm-js');

/*
  Usage: prettyPrint.js <filename>

  Pretty prints the Ohm grammar in the file indicated by <filename>.
 */

// Helpers
// -------

function indentLines(arr, depth) {
  const padding = new Array(depth + 1).join(' ');
  return arr.join('\n' + padding);
}

function printRule(name, formals, desc, op, body) {
  let ans = '  ' + name.sourceString + formals.prettyPrint() + ' ';

  let indentation;
  if (desc.children.length > 0) {
    ans += desc.prettyPrint() + '\n    ';
    indentation = 4;
  } else {
    indentation = ans.length;
  }
  ans += op.sourceString.trim() + ' ';

  const bodyLines = body.prettyPrint().split('\n');
  return ans + indentLines(bodyLines, indentation);
}

function printPostfixOp(e, op) {
  return e.prettyPrint() + op.sourceString;
}

function printPrefixOp(op, e) {
  return op.sourceString + e.prettyPrint();
}

function printParams(open, paramList, close) {
  const params = paramList.asIteration().children.map(c => {
    return c.sourceString;
  });
  return params.length === 0 ? '' : '<' + params.join(', ') + '>';
}

// Semantics
// ---------

const semantics = ohm.ohmGrammar.createSemantics();
semantics.addOperation('prettyPrint()', {
  Grammar(name, superGrammar, open, rules, close) {
    const decl = name.sourceString + superGrammar.prettyPrint();
    return decl + ' {\n' + rules.prettyPrint().join('\n') + '\n}';
  },
  SuperGrammar(_, ident) {
    return ' <: ' + ident.sourceString;
  },
  Rule_define: printRule,
  Rule_override(name, formals, op, body) {
    return printRule(name, formals, null, op, body);
  },
  Rule_extend(name, formals, op, body) {
    return printRule(name, formals, null, op, body);
  },
  RuleBody(_, termList) {
    return termList.asIteration().prettyPrint().join('\n| ');
  },
  Formals: printParams,
  Params: printParams,
  TopLevelTerm_inline(seq, caseName) {
    return seq.prettyPrint() + '  ' + caseName.prettyPrint();
  },
  Alt(list) {
    return list.asIteration().prettyPrint().join(' | ');
  },
  Seq(iter) {
    return iter.prettyPrint().join(' ');
  },
  Iter_star: printPostfixOp,
  Iter_plus: printPostfixOp,
  Iter_opt: printPostfixOp,

  Pred_not: printPrefixOp,
  Pred_lookahead: printPrefixOp,
  Lex_lex: printPrefixOp,

  Base_application(id, params) {
    return id.sourceString + params.prettyPrint();
  },
  Base_range(t1, _, t2) {
    return t1.prettyPrint() + '..' + t2.prettyPrint();
  },
  Base_paren(open, alt, close) {
    return '(' + alt.prettyPrint() + ')';
  },
  caseName(_, leading, name, trailing, end) {
    return '-- ' + name.sourceString;
  },
  ruleDescr(open, text, close) {
    return '(' + text.sourceString.trim() + ')';
  },
  terminal(open, _, close) {
    return this.sourceString;
  },
  oneCharTerminal(open, c, close) {
    return this.sourceString;
  }
});

// Exports
// -------

const prettyPrint = module.exports = function(source) {
  const matchResult = ohm.ohmGrammar.match(source, 'Grammar');
  if (matchResult.failed()) {
    return matchResult;
  }
  return semantics(matchResult).prettyPrint();
};

// Main
// ----

if (require.main === module) {
  const filename = process.argv[2];
  const source = fs.readFileSync(filename).toString();
  const result = prettyPrint(source, filename);

  /* eslint-disable no-console, no-process-exit */
  if (typeof result === 'string') {
    console.log(result);
  } else {
    console.error('Not an Ohm grammar: ' + filename);
    console.error(result.message);
    process.exit(1);
  }
  /* eslint-enable no-console */
}
