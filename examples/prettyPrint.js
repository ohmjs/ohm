/* eslint-env node */

'use strict';

var fs = require('fs');
var ohm = require('..');

/*
  Usage: prettyPrint.js <filename>

  Pretty prints the Ohm grammar in the file indicated by <filename>.
 */

// Helpers
// -------

function indentLines(arr, depth) {
  var padding = new Array(depth + 1).join(' ');
  return arr.join('\n' + padding);
}

function printRule(name, formals, desc, op, body) {
  var ans = '  ' + name.sourceString + formals.prettyPrint() + ' ';

  var indentation;
  if (desc.children.length > 0) {
    ans += desc.prettyPrint() + '\n    ';
    indentation = 4;
  } else {
    indentation = ans.length;
  }
  ans += op.sourceString.trim() + ' ';

  var bodyLines = body.prettyPrint().split('\n');
  return ans + indentLines(bodyLines, indentation);
}

function printPostfixOp(e, op) {
  return e.prettyPrint() + op.sourceString;
}

function printPrefixOp(op, e) {
  return op.sourceString + e.prettyPrint();
}

function printParams(open, paramList, close) {
  var params = paramList.asIteration().children.map(function(c) {
    return c.sourceString;
  });
  return params.length === 0 ? '' : '<' + params.join(', ') + '>';
}

// Semantics
// ---------

var semantics = ohm.ohmGrammar.createSemantics();
semantics.addOperation('prettyPrint()', {
  Grammar: function(name, superGrammar, open, rules, close) {
    var decl = name.sourceString + superGrammar.prettyPrint();
    return decl + ' {\n' + rules.prettyPrint().join('\n') + '\n}';
  },
  SuperGrammar: function(_, ident) {
    return ' <: ' + ident.sourceString;
  },
  Rule_define: printRule,
  Rule_override: function(name, formals, op, body) {
    return printRule(name, formals, null, op, body);
  },
  Rule_extend: function(name, formals, op, body) {
    return printRule(name, formals, null, op, body);
  },
  RuleBody: function(_, termList) {
    return termList.asIteration().prettyPrint().join('\n| ');
  },
  Formals: printParams,
  Params: printParams,
  TopLevelTerm_inline: function(seq, caseName) {
    return seq.prettyPrint() + '  ' + caseName.prettyPrint();
  },
  Alt: function(list) {
    return list.asIteration().prettyPrint().join(' | ');
  },
  Seq: function(iter) {
    return iter.prettyPrint().join(' ');
  },
  Iter_star: printPostfixOp,
  Iter_plus: printPostfixOp,
  Iter_opt: printPostfixOp,

  Pred_not: printPrefixOp,
  Pred_lookahead: printPrefixOp,
  Lex_lex: printPrefixOp,

  Base_application: function(id, params) {
    return id.sourceString + params.prettyPrint();
  },
  Base_range: function(t1, _, t2) {
    return t1.prettyPrint() + '..' + t2.prettyPrint();
  },
  Base_paren: function(open, alt, close) {
    return '(' + alt.prettyPrint() + ')';
  },
  caseName: function(_, leading, name, trailing, end) {
    return '-- ' + name.sourceString;
  },
  ruleDescr: function(open, text, close) {
    return '(' + text.sourceString.trim() + ')';
  },
  terminal: function(open, _, close) {
    return this.sourceString;
  },
  oneCharTerminal: function(open, c, close) {
    return this.sourceString;
  }
});

// Exports
// -------

var prettyPrint = module.exports = function(source) {
  var matchResult = ohm.ohmGrammar.match(source, 'Grammar');
  if (matchResult.failed()) {
    return matchResult;
  }
  return semantics(matchResult).prettyPrint();
};

// Main
// ----

if (require.main === module) {
  var filename = process.argv[2];
  var source = fs.readFileSync(filename).toString();
  var result = prettyPrint(source, filename);

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
