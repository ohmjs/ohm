/* eslint-env node */

import assert from 'assert';
import * as ohm from 'ohm-js';
import fs from 'fs';
import {test} from 'uvu';

const hasOwn = (obj, prop) => Object.hasOwnProperty.call(obj, prop);

const g = ohm.grammar(String.raw`
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

    ident = lower+
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

const tokens = {
  async: '"async" ~identifierPart',
  await: '"await" ~identifierPart',
  dedent: undefined,
  indent: undefined,
  name: '~reservedWord identifierName',
  newline: '"\\n"',
  number: 'octalIntegerLiteral | hexIntegerLiteral | decimalLiteral',
  string: undefined,
  typeComment: '/* FIXME */',
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
  pass = /* empty */
  invalid<name> = fail
  cut_FIXME = /* empty */
  require_FIXME<exp> = exp

  // ----- Identifiers etc. -----

  identifierName (an identifier) = identifierStart identifierPart*

  // TODO: Correct these to use xidStart and xidContinue.
  identifierStart = letter | "_"
  identifierPart = identifierStart | digit

  reservedWord (a reserved word) = async | await

  // ----- Numbers -----

  octalIntegerLiteral = "0o" octalDigit+ | "0O" octalDigit+
  octalDigit = "0".."7"

  hexIntegerLiteral = "0x" hexDigit+ | "0X" hexDigit+
  // hexDigit defined in Ohm's built-in rules (otherwise: hexDigit = "0".."9" | "a".."f" | "A".."F")

  binaryIntegerLiteral = "0b" binaryDigit+ | "0B" binaryDigit+
  binaryDigit = "0" | "1"

  decimalLiteral = decimalIntegerLiteral "." decimalDigit* exponentPart -- bothParts
                 |                       "." decimalDigit+ exponentPart -- decimalsOnly
                 | decimalIntegerLiteral                   exponentPart -- integerOnly
  decimalIntegerLiteral = nonZeroDigit decimalDigit*  -- nonZero
                        | "0"                         -- zero
  decimalDigit = "0".."9"
  nonZeroDigit = "1".."9"

  // TODO: Also old-style octals, imaginary numbers, etc.

  exponentPart = exponentIndicator signedInteger -- present
               |                                 -- absent
  exponentIndicator = "e" | "E"
  signedInteger = "+" decimalDigit* -- positive
                | "-" decimalDigit* -- negative
                |     decimalDigit+ -- noSign

  // ----- Strings -----

  string = "\"" doubleStringCharacter* "\""
         | "'" singleStringCharacter* "'"
  doubleStringCharacter
    = ~("\"" | "\\" | lineTerminator) any -- nonEscaped
    | "\\" escapeSequence                 -- escaped
    | lineContinuation                    -- lineContinuation
  singleStringCharacter
    = ~("'" | "\\" | lineTerminator) any -- nonEscaped
    | "\\" escapeSequence                -- escaped
    | lineContinuation                   -- lineContinuation
  lineContinuation = "\\" lineTerminatorSequence
  escapeSequence = hexEscapeSequence
                 | octalEscapeSequence
                 | characterEscapeSequence  // Must come last.
  characterEscapeSequence = singleEscapeCharacter
                          | nonEscapeCharacter
  singleEscapeCharacter = "'" | "\"" | "\\" | "b" | "f" | "n" | "r" | "t" | "v"
  nonEscapeCharacter = ~(escapeCharacter | lineTerminator) any
  escapeCharacter = singleEscapeCharacter | decimalDigit | "x" | "u"
  octalEscapeSequence = zeroToThree octalDigit octalDigit    -- whole
                      | fourToSeven octalDigit               -- eightTimesfourToSeven
                      | zeroToThree octalDigit ~decimalDigit -- eightTimesZeroToThree
                      | octalDigit ~decimalDigit             -- octal
  hexEscapeSequence = "x" hexDigit hexDigit
  zeroToThree = "0".."3"
  fourToSeven = "4".."7"
  lineTerminator = "\n" | "\r" | "\u2028" | "\u2029"
  lineTerminatorSequence = "\n" | "\r" ~"\n" | "\u2028" | "\u2029" | "\r\n"
`;

const semantics = g.createSemantics();

// An attribute that guesses at the arity an expression will have once it's
// translated to Ohm.
semantics.addAttribute('simpleArity', {
  Seq(termIter) {
    return termIter.children.reduce((acc, c) => acc + c.simpleArity, 0);
  },
  Term_binding(_ident, _type, _, iter) {
    return iter.simpleArity;
  },
  Term_cut(_) {
    return 1;
  },
  Term(child) {
    return child.simpleArity;
  },
  Iter_star(pred, _) {
    return pred.simpleArity;
  },
  Iter_plus(pred, _) {
    return pred.simpleArity;
  },
  Iter_opt(pred, _) {
    return pred.simpleArity;
  },
  Iter(child) {
    return child.simpleArity;
  },
  Pred_not(_, base) {
    return 0;
  },
  Pred_immediateFailure(_, base) {
    return 1;
  },
  Pred_lookahead(_, base) {
    return 1;
  },
  Pred(child) {
    return child.simpleArity;
  },
  _nonterminal(...children) {
    return 1;
  },
});

semantics.addOperation('rewrite', {
  Grammar(rules) {
    const lines = [
      'Python3 <: IndentationSensitive {',
      ...rules.children.map(c => `\n${c.rewrite()}`),
      tokenRules,
      extraRules,
      '}',
    ];
    return lines.filter(l => l !== null).join('\n');
  },
  Rule(ruleDeclStart, _, alt) {
    return `  ${ruleDeclStart.rewrite()} = ${alt.rewrite()}`;
  },
  RuleDeclStart(ruleName, _type, _memo, _) {
    return toCamelCase(ruleName.sourceString);
  },
  // Line_ruleDefn(ruleName, _type, _memo, _, ruleBody) {
  //   const newBody = ruleBody.asIteration().children.map(c => c.rewrite()).join(' |');
  //   return `\n${toCamelCase(ruleName.sourceString)} = ${newBody}`;
  // },
  // Line_ruleBegin(ruleName, _type, _memo, _) {
  //   return `\n${toCamelCase(ruleName.sourceString)} =`;
  // },
  // Line_ruleContinuation(_, seq) {
  //   return `  ${seq.rewrite()}`;
  // },
  // Line_empty(_) {
  //   return null;
  // },
  Alt(listOfSeqs) {
    const {children} = listOfSeqs.asIteration();
    const arities = new Set(children.map(c => c.simpleArity));
    const choices = children.map(c => c.rewrite());
    if (choices[0] === 'assignmentExpression') {
      console.log(arities, choices[1]);
    }
    if (arities.size > 1) {
      return choices.map((str, i) => str + `  -- alt${i + 1}`).join('\n    | ');
    }
    return choices.join(' | ');
  },
  Seq(terms) {
    return terms.children
        .map(c => {
          return c.rewrite();
        })
        .join(' ');
  },
  Term_binding(ident, _type, _, iter) {
    return iter.rewrite();
  },
  Term_cut(_) {
    return 'cut_FIXME';
  },
  Iter_star(pred, _) {
    return `${pred.rewrite()}*`;
  },
  Iter_plus(pred, _) {
    return `${pred.rewrite()}+`;
  },
  Iter_opt(pred, _) {
    return `${pred.rewrite()}?`;
  },
  Pred_not(_, base) {
    return `~${base.rewrite()}`;
  },
  Pred_immediateFailure(_, base) {
    return `require_FIXME<${base.rewrite()}>`;
  },
  Pred_lookahead(_, base) {
    return `&${base.rewrite()}`;
  },
  Base_application(ruleName) {
    const name = ruleName.sourceString;
    // TODO: handle invalid_ rules in a better way

    if (name.startsWith('invalid_')) {
      return `invalid<"${name.slice(8)}">`;
    }
    return toCamelCase(name);
  },
  Base_paren(_open, alt, _close) {
    return `(${alt.rewrite()})`;
  },
  Base_opt(_open, alt, _close) {
    return `(${alt.rewrite()})?`;
  },
  Base_list(terminal, _, iter) {
    return `nonemptyListOf<${iter.rewrite()}, ${terminal.rewrite()}>`;
  },
  word(_) {
    return this.sourceString;
  },
  token(_) {
    const name = toCamelCase(this.sourceString.toLowerCase());
    if (name === 'endmarker') {
      return 'end';
    }
    assert(hasOwn(tokens, name), `Unknown token '${name}'`);
    return name;
  },
  terminal_keyword(_open, chars, _close) {
    return `"${chars.sourceString}"`;
  },
  terminal_softKeyword(_open, chars, _close) {
    return `"${chars.sourceString}"`;
  },
});

function toCamelCase(str) {
  if (str === '_') {
    return '_';
  }
  const [first, ...rest] = str.split('_');
  return [first, ...rest.map(s => s[0].toUpperCase() + s.slice(1))].join('');
}

// const source = `func_type_comment[Token*]:
// | NEWLINE t=TYPE_COMMENT &(NEWLINE INDENT) { t }  # Must be followed by indented block
// | invalid_double_type_comments
// | TYPE_COMMENT
// `;
let source = fs.readFileSync(process.argv[2], 'utf-8');

// Hack: there is one part of the grammar where there is a parenthesized
// alternation inside another alt. We can't add case labels there, so we
// add two dummy args to make the arity of both branches the same.
source = source.replace(
    "| single_subscript_attribute_target) ':'",
    "| single_subscript_attribute_target pass pass) ':'",
);

const matchResult = g.match(source);
if (matchResult.failed()) {
  throw new Error(matchResult.message);
}

test('basics', () => {
  const output = semantics(matchResult).rewrite();
  fs.writeFileSync('output.txt', output);
  ohm.grammar(output, {
    IndentationSensitive: ohm.ExperimentalIndentationSensitive
  });
});

test.run();
