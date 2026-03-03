import assert from 'node:assert';

import {grammar} from '@ohm-js/compiler/compat';
import type {Operation} from '@ohm-js/semantics/src/types.ts';
import {createOperation} from '@ohm-js/semantics/src/index.ts';

const hasOwn = (obj: object, prop: string) => Object.hasOwnProperty.call(obj, prop);

const g = grammar(String.raw`
  PythonPEG {
    Grammar = Rule*

    Rule = RuleDeclStart "|"? Alt

    RuleDeclStart = ruleName type? memo? ":"

    Alt = NonemptyListOf<Seq, "|">

    Seq = Term*

    Term
      = ident type? "=" Iter  -- binding
      | "~"  -- cut
      | Iter

    Iter
      = Pred "*"  -- star
      | Pred "+"  -- plus
      | Pred "?"  -- opt
      | Pred

    Pred
      = "!" Base  -- not
      | "&&" Base  -- immediateFailure
      | "&" Base  -- lookahead
      | Base

    Base
      = ~RuleDeclStart ruleName  -- application
      | terminal "." Iter  -- list
      | terminal  -- terminal
      | token  -- token
      | "(" Alt ")"  -- paren
      | "[" Alt "]"  -- opt

    terminal
      = "\"" anythingBut<"\"">* "\"" -- keyword
      | "'" anythingBut<"'">* "'" -- softKeyword

    word = anythingBut<space>+

    ident = (lower | "_")+
    token = (upper | "_")+
    ruleName = (lower | "_")+
    type = "[" anythingBut<"]">+ "]"
    memo = "(memo)"

    space += comment | action
    comment = "#" anythingBut<"\n">*
    action = "{" anythingBut<"}">* "}"
    anythingBut<delim> = ~delim any
    empty = /* nothing */
  }
`);

const tokens: Record<string, string> = {
  indent: 'fail',
  dedent: 'fail',
  name: 'fail',
  newline: 'fail',
  number: 'fail',
  string: 'fail',
  typeComment: 'fail',
  fstringStart: 'fail',
  fstringMiddle: 'fail',
  fstringEnd: 'fail',
  tstringStart: 'fail',
  tstringMiddle: 'fail',
  tstringEnd: 'fail',
  softKeyword: 'fail',
};
const tokenRules = Object.entries(tokens)
  .map(([name, ruleBody]) => {
    if (ruleBody) {
      return `  ${name} = ${ruleBody}`;
    }
  })
  .filter(x => !!x)
  .join('\n');

const extraRules = String.raw`
  fail = ~any any
  Pass = /* empty */
  invalid<name> = fail
  cut_FIXME = /* empty */
  require_FIXME<exp> = exp

  // Only horizontal whitespace is skipped between tokens.
  // Comments are handled by the tokenizer (replaced with spaces).
  space := " " | "\t"
`;

function toCamelCase(str: string): string {
  if (str === '_') {
    return '_';
  }
  const [first, ...rest] = str.split('_');
  return [first, ...rest.map(s => s[0].toUpperCase() + s.slice(1))].join('');
}

function toPascalCase(str: string): string {
  if (str === '_') {
    return '_';
  }
  return str
    .split('_')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('');
}

// Helper to extract elements from a NonemptyListOf node (stripping separators).
function getListElements(nonemptyListOfNode: any): any[] {
  const [first, rest] = nonemptyListOfNode.children;
  const restElements = rest.collect((_sep: any, elem: any) => elem);
  return [first, ...restElements];
}

// An operation that guesses at the arity an expression will have once it's
// translated to Ohm.
const simpleArity: Operation<number> = createOperation('simpleArity', {
  Seq(ctx, termList) {
    return termList.children.reduce((acc: number, c) => acc + simpleArity(c), 0);
  },
  Term_binding(ctx, _ident, _type, _, iter) {
    return simpleArity(iter);
  },
  Term_cut(ctx, _) {
    return 1;
  },
  Term(ctx, child) {
    return simpleArity(child);
  },
  Iter_star(ctx, pred, _) {
    return simpleArity(pred);
  },
  Iter_plus(ctx, pred, _) {
    return simpleArity(pred);
  },
  Iter_opt(ctx, pred, _) {
    return simpleArity(pred);
  },
  Iter(ctx, child) {
    return simpleArity(child);
  },
  Pred_not(ctx, _, base) {
    return 0;
  },
  Pred_immediateFailure(ctx, _, base) {
    return 1;
  },
  Pred_lookahead(ctx, _, base) {
    return 1;
  },
  Pred(ctx, child) {
    return simpleArity(child);
  },
  _nonterminal(ctx, ...children) {
    return 1;
  },
});

const rewrite: Operation<string> = createOperation('rewrite', {
  Grammar(ctx, ruleList) {
    // Collect names defined by tokens and extraRules so we can skip
    // converted PEG rules that would create duplicates.
    const reservedNames = new Set(Object.keys(tokens));
    for (const m of extraRules.matchAll(/^\s*(\w+)\s*(?:\(.*?\))?\s*[:=]/gm)) {
      reservedNames.add(m[1]);
    }

    const rules = ruleList.children
      .map(c => rewrite(c))
      .filter(r => {
        // Skip rules whose name collides with a token or extraRules definition.
        const m = r.match(/^\s*(\w+)\s*=/);
        return !(m && reservedNames.has(m[1]));
      });
    const lines = ['Python3 {', ...rules.map(r => `\n${r}`), tokenRules, extraRules, '}'];
    return lines.filter(l => l !== null).join('\n');
  },
  Rule(ctx, ruleDeclStart, _, alt) {
    return `  ${rewrite(ruleDeclStart)} = ${rewrite(alt)}`;
  },
  RuleDeclStart(ctx, ruleName, _type, _memo, _) {
    return toPascalCase(ruleName.sourceString);
  },
  Alt(ctx, listOfSeqs) {
    const children = getListElements(listOfSeqs);
    const arities = new Set(children.map(c => simpleArity(c)));
    const choices = children.map(c => rewrite(c));
    if (arities.size > 1) {
      return choices.map((str, i) => str + `  -- alt${i + 1}`).join('\n    | ');
    }
    return choices.join(' | ');
  },
  Seq(ctx, terms) {
    return terms.children.map(c => rewrite(c)).join(' ');
  },
  Term_binding(ctx, ident, _type, _, iter) {
    return rewrite(iter);
  },
  Term_cut(ctx, _) {
    return 'cut_FIXME';
  },
  Iter_star(ctx, pred, _) {
    return `${rewrite(pred)}*`;
  },
  Iter_plus(ctx, pred, _) {
    return `${rewrite(pred)}+`;
  },
  Iter_opt(ctx, pred, _) {
    return `${rewrite(pred)}?`;
  },
  Pred_not(ctx, _, base) {
    return `~${rewrite(base)}`;
  },
  Pred_immediateFailure(ctx, _, base) {
    return `require_FIXME<${rewrite(base)}>`;
  },
  Pred_lookahead(ctx, _, base) {
    return `&${rewrite(base)}`;
  },
  Base_application(ctx, ruleName) {
    const name = ruleName.sourceString;
    if (name.startsWith('invalid_')) {
      return `invalid<"${name.slice(8)}">`;
    }
    return toPascalCase(name);
  },
  Base_paren(ctx, _open, alt, _close) {
    return `(${rewrite(alt)})`;
  },
  Base_opt(ctx, _open, alt, _close) {
    return `(${rewrite(alt)})?`;
  },
  Base_list(ctx, terminal, _, iter) {
    return `nonemptyListOf<${rewrite(iter)}, ${rewrite(terminal)}>`;
  },
  word(ctx, _) {
    return ctx.thisNode.sourceString;
  },
  token(ctx, _) {
    const name = toCamelCase(ctx.thisNode.sourceString.toLowerCase());
    if (name === 'endmarker') {
      return 'end';
    }
    assert(hasOwn(tokens, name), `Unknown token '${name}'`);
    return name;
  },
  terminal_keyword(ctx, _open, chars, _close) {
    return `"${chars.sourceString}"`;
  },
  terminal_softKeyword(ctx, _open, chars, _close) {
    return `"${chars.sourceString}"`;
  },
});

export function convertToOhm(rawSource: string): string {
  let source = rawSource;

  // Strip @trailer section (C code between triple-quoted strings).
  source = source.replace(/@trailer\s*'''[\s\S]*?'''\s*/, '');

  // Strip invalid rules section — these are only for CPython's error recovery
  // and their C action blocks contain unbalanced braces in string literals.
  source = source.replace(/# =+ START OF INVALID RULES[\s\S]*$/, '');

  // Hack: there is one part of the grammar where there is a parenthesized
  // alternation inside another alt. We can't add case labels there, so we
  // add two dummy args to make the arity of both branches the same.
  source = source.replace(
    "| single_subscript_attribute_target) ':'",
    "| single_subscript_attribute_target pass pass) ':'"
  );

  const matchResult = g.match(source);
  return matchResult.use(r => {
    if (!r.succeeded()) {
      throw new Error(String(r));
    }
    return rewrite(r.getCstRoot());
  });
}
