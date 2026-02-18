// CST walker: takes a WASM CST root node (from matching the Ohm meta-grammar)
// and produces v17 Grammar objects using v17's GrammarDecl for validation.

import type {CstNode} from 'ohm-js';

import * as ohm from 'ohm-js-legacy';
import {GrammarDecl} from 'ohm-js-legacy/src/GrammarDecl.js';
import {Grammar} from 'ohm-js-legacy/src/Grammar.js';

const {pexprs} = ohm;

// Unescape a code point from an Ohm escape sequence string.
// Replicates common.unescapeCodePoint from ohm-js-legacy.
function unescapeCodePoint(s: string): string {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b':
        return '\b';
      case 'f':
        return '\f';
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      case 'v':
        return '\v';
      case 'x':
        return String.fromCodePoint(parseInt(s.slice(2, 4), 16));
      case 'u':
        return s.charAt(2) === '{'
          ? String.fromCodePoint(parseInt(s.slice(3, -1), 16))
          : String.fromCodePoint(parseInt(s.slice(2, 6), 16));
      default:
        return s.charAt(1);
    }
  }
  return s;
}

// Extract elements from a NonemptyListOf/EmptyListOf/ListOf CST node.
function listOfElements(node: CstNode): CstNode[] {
  switch (node.ctorName) {
    case 'EmptyListOf':
    case 'emptyListOf':
      return [];
    case 'NonemptyListOf':
    case 'nonemptyListOf': {
      // NonemptyListOf<elem, sep> = elem (sep elem)*
      const first = node.children[0];
      const restList = node.children[1]; // ListNode for (sep elem)*
      // Each child of restList is a SeqNode with [sep, elem].
      const rest = restList.children.map(seqNode => seqNode.children[1]);
      return [first, ...rest];
    }
    case 'ListOf':
    case 'listOf':
      return listOfElements(node.children[0]);
    default:
      throw new Error(`Expected ListOf node, got: ${node.ctorName}`);
  }
}

function makeAlt(terms: any[]): any {
  if (terms.length === 1) return terms[0];
  // Flatten nested Alts (like v17's builder.alt).
  const flattened: any[] = [];
  for (const t of terms) {
    if (t instanceof pexprs.Alt) {
      flattened.push(...t.terms);
    } else {
      flattened.push(t);
    }
  }
  return new pexprs.Alt(flattened);
}

function makeSeq(factors: any[]): any {
  if (factors.length === 0) return new pexprs.Seq([]);
  if (factors.length === 1) return factors[0];
  // Flatten nested Seqs.
  const flattened: any[] = [];
  for (const f of factors) {
    if (f instanceof pexprs.Seq) {
      flattened.push(...f.factors);
    } else {
      flattened.push(f);
    }
  }
  return flattened.length === 1 ? flattened[0] : new pexprs.Seq(flattened);
}

export function buildGrammars(rootNode: CstNode, namespace: Record<string, any>): any[] {
  let currentDecl: any;
  let currentRuleName: string;
  let currentRuleFormals: string[];
  let overriding = false;

  function walk(node: CstNode): any {
    switch (node.ctorName) {
      case 'Grammars': {
        // Grammars = Grammar*
        // children[0] is the ListNode for Grammar*
        return node.children[0].children.map((child: CstNode) => walk(child));
      }
      case 'Grammar': {
        // Grammar = ident SuperGrammar? "{" Rule* "}"
        const grammarName = node.children[0].sourceString;
        const superGrammarOpt = node.children[1]; // OptNode
        const rulesList = node.children[3]; // ListNode

        currentDecl = new GrammarDecl(grammarName);

        if (superGrammarOpt.children.length > 0) {
          walk(superGrammarOpt.children[0]); // SuperGrammar
        }
        for (const ruleNode of rulesList.children) {
          walk(ruleNode);
        }

        const g = currentDecl.build();
        if (namespace[grammarName]) {
          throw new Error(`Grammar '${grammarName}' is already declared`);
        }
        namespace[grammarName] = g;
        return g;
      }
      case 'SuperGrammar': {
        // SuperGrammar = "<:" ident
        const superName = node.children[1].sourceString;
        if (superName === 'null') {
          currentDecl.withSuperGrammar(null);
        } else {
          if (!namespace[superName]) {
            throw new Error(`Undeclared grammar: '${superName}'`);
          }
          currentDecl.withSuperGrammar(namespace[superName]);
        }
        return;
      }
      case 'Rule_define': {
        // ident Formals? ruleDescr? "=" RuleBody
        const name = node.children[0].sourceString;
        currentRuleName = name;

        const formalsOpt = node.children[1];
        currentRuleFormals =
          formalsOpt.children.length > 0 ? walkFormals(formalsOpt.children[0]) : [];

        // Set default start rule if not yet set.
        if (
          !currentDecl.defaultStartRule &&
          currentDecl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules
        ) {
          currentDecl.withDefaultStartRule(name);
        }

        const body = walk(node.children[4]); // RuleBody

        const descrOpt = node.children[2];
        const description =
          descrOpt.children.length > 0 ? walkRuleDescr(descrOpt.children[0]) : undefined;

        currentDecl.define(name, currentRuleFormals, body, description);
        return;
      }
      case 'Rule_override': {
        // ident Formals? ":=" OverrideRuleBody
        const name = node.children[0].sourceString;
        currentRuleName = name;

        const formalsOpt = node.children[1];
        currentRuleFormals =
          formalsOpt.children.length > 0 ? walkFormals(formalsOpt.children[0]) : [];

        overriding = true;
        const body = walk(node.children[3]);
        overriding = false;

        currentDecl.override(name, currentRuleFormals, body);
        return;
      }
      case 'Rule_extend': {
        // ident Formals? "+=" RuleBody
        const name = node.children[0].sourceString;
        currentRuleName = name;

        const formalsOpt = node.children[1];
        currentRuleFormals =
          formalsOpt.children.length > 0 ? walkFormals(formalsOpt.children[0]) : [];

        const body = walk(node.children[3]);
        currentDecl.extend(name, currentRuleFormals, body);
        return;
      }
      case 'RuleBody':
      case 'OverrideRuleBody': {
        // "|"? NonemptyListOf<TopLevelTerm/OverrideTopLevelTerm, "|">
        const terms = listOfElements(node.children[1]).map(t => walk(t));
        return makeAlt(terms);
      }
      case 'TopLevelTerm_inline': {
        // Seq caseName
        const body = walk(node.children[0]);
        const caseName = walkCaseName(node.children[1]);
        const inlineRuleName = currentRuleName + '_' + caseName;

        const isNewRule = !(
          currentDecl.superGrammar && currentDecl.superGrammar.rules[inlineRuleName]
        );
        if (overriding && !isNewRule) {
          currentDecl.override(inlineRuleName, currentRuleFormals, body);
        } else {
          currentDecl.define(inlineRuleName, currentRuleFormals, body);
        }

        const params = currentRuleFormals.map(formal => new pexprs.Apply(formal));
        return new pexprs.Apply(inlineRuleName, params);
      }
      case 'Rule':
      case 'TopLevelTerm':
      case 'OverrideTopLevelTerm':
      case 'Iter':
      case 'Pred':
      case 'Lex':
      case 'Base':
        // Passthrough: single child.
        return walk(node.children[0]);
      case 'OverrideTopLevelTerm_superSplice':
        throw new Error('Super splice (...) is not supported');
      case 'Formals':
        return walkFormals(node);
      case 'Params':
        return walkParams(node);
      case 'Alt': {
        // NonemptyListOf<Seq, "|">
        const terms = listOfElements(node.children[0]).map(s => walk(s));
        return makeAlt(terms);
      }
      case 'Seq': {
        // Iter*
        const iterList = node.children[0]; // ListNode
        const factors = iterList.children.map((iter: CstNode) => walk(iter));
        return makeSeq(factors);
      }
      case 'Iter_star':
        return new pexprs.Star(walk(node.children[0]));
      case 'Iter_plus':
        return new pexprs.Plus(walk(node.children[0]));
      case 'Iter_opt':
        return new pexprs.Opt(walk(node.children[0]));
      case 'Pred_not':
        return new pexprs.Not(walk(node.children[1]));
      case 'Pred_lookahead':
        return new pexprs.Lookahead(walk(node.children[1]));
      case 'Lex_lex':
        return new pexprs.Lex(walk(node.children[1]));
      case 'Base_application': {
        // ident Params? ~(ruleDescr? "=" | ":=" | "+=")
        // The Not produces 0 bindings, so children: [ident, Params?]
        const ruleName = node.children[0].sourceString;
        const paramsOpt = node.children[1]; // OptNode
        const params = paramsOpt.children.length > 0 ? walkParams(paramsOpt.children[0]) : [];
        return new pexprs.Apply(ruleName, params);
      }
      case 'Base_range': {
        // oneCharTerminal ".." oneCharTerminal
        const from = walkOneCharTerminal(node.children[0]);
        const to = walkOneCharTerminal(node.children[2]);
        return new pexprs.Range(from, to);
      }
      case 'Base_terminal':
        return new pexprs.Terminal(walkTerminal(node.children[0]));
      case 'Base_paren':
        // "(" Alt ")"
        return walk(node.children[1]);
      default:
        throw new Error(`buildGrammar: unhandled ctorName: ${node.ctorName}`);
    }
  }

  function walkFormals(node: CstNode): string[] {
    // Formals = "<" ListOf<ident, ","> ">"
    return listOfElements(node.children[1]).map(n => n.sourceString);
  }

  function walkParams(node: CstNode): any[] {
    // Params = "<" ListOf<Seq, ","> ">"
    return listOfElements(node.children[1]).map(s => walk(s));
  }

  function walkTerminal(node: CstNode): string {
    // terminal = "\"" terminalChar* "\""
    const charList = node.children[1]; // ListNode
    return charList.children.map(c => walkTerminalChar(c)).join('');
  }

  function walkOneCharTerminal(node: CstNode): string {
    // oneCharTerminal = "\"" terminalChar "\""
    return walkTerminalChar(node.children[1]);
  }

  function walkTerminalChar(node: CstNode): string {
    // terminalChar = escapeChar | ~"\\" ~"\"" ~"\n" "\u{0}".."\u{10FFFF}"
    // In both cases, there is 1 child.
    const child = node.children[0];
    if (child.isTerminal()) {
      // Regular character (from the Range match).
      return child.sourceString;
    }
    // escapeChar node — use its sourceString and unescape.
    return unescapeCodePoint(child.sourceString);
  }

  function walkRuleDescr(node: CstNode): string {
    // ruleDescr = "(" ruleDescrText ")"
    return node.children[1].sourceString.trim();
  }

  function walkCaseName(node: CstNode): string {
    // caseName = "--" (~"\n" space)* name (~"\n" space)* ("\n" | &"}")
    // Bindings: "--", ListNode, name, ListNode, [possibly "\n"]
    // We only need the name at index 2.
    return node.children[2].sourceString;
  }

  return walk(rootNode);
}
