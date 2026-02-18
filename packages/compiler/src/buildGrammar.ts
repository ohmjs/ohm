// CST visitor: takes a WASM CST root node (from matching the Ohm meta-grammar)
// and produces v17 Grammar objects using v17's GrammarDecl for validation.

import type {CstNode} from 'ohm-js';

import * as ohm from 'ohm-js-legacy';
import * as errors from 'ohm-js-legacy/src/errors.js';
import {Grammar} from 'ohm-js-legacy/src/Grammar.js';
import {GrammarDecl} from 'ohm-js-legacy/src/GrammarDecl.js';
import {Interval} from 'ohm-js-legacy/src/Interval.js';

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

export function buildGrammars(
  rootNode: CstNode,
  namespace: Record<string, any>,
  sourceString: string
): any[] {
  let currentDecl: any;
  let currentRuleName: string;
  let currentRuleFormals: string[];
  let overriding = false;

  // Create a v17 Interval from a CstNode's source position.
  function interval(node: CstNode): any {
    return new Interval(sourceString, node.source.startIdx, node.source.endIdx);
  }

  function visit(node: CstNode): any {
    switch (node.ctorName) {
      case 'Grammars': {
        // Grammars = Grammar*
        // children[0] is the ListNode for Grammar*
        return node.children[0].children.map((child: CstNode) => visit(child));
      }
      case 'Grammar': {
        // Grammar = ident SuperGrammar? "{" Rule* "}"
        const grammarName = node.children[0].sourceString;
        const superGrammarOpt = node.children[1]; // OptNode
        const rulesList = node.children[3]; // ListNode

        currentDecl = new GrammarDecl(grammarName);

        if (superGrammarOpt.children.length > 0) {
          visit(superGrammarOpt.children[0]); // SuperGrammar
        }
        for (const ruleNode of rulesList.children) {
          visit(ruleNode);
        }

        const g = currentDecl.build();
        g.source = interval(node).trimmed();
        if (namespace[grammarName]) {
          throw errors.duplicateGrammarDeclaration(g, namespace);
        }
        namespace[grammarName] = g;
        return g;
      }
      case 'SuperGrammar': {
        // SuperGrammar = "<:" ident
        const superNameNode = node.children[1];
        const superName = superNameNode.sourceString;
        if (superName === 'null') {
          currentDecl.withSuperGrammar(null);
        } else {
          if (!namespace[superName]) {
            throw errors.undeclaredGrammar(superName, namespace, interval(superNameNode));
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
          formalsOpt.children.length > 0 ? visitFormals(formalsOpt.children[0]) : [];

        // Set default start rule if not yet set.
        if (
          !currentDecl.defaultStartRule &&
          currentDecl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules
        ) {
          currentDecl.withDefaultStartRule(name);
        }

        const body = visit(node.children[4]); // RuleBody

        const descrOpt = node.children[2];
        const description =
          descrOpt.children.length > 0 ? visitRuleDescr(descrOpt.children[0]) : undefined;

        const source = interval(node).trimmed();
        currentDecl.define(name, currentRuleFormals, body, description, source);
        return;
      }
      case 'Rule_override': {
        // ident Formals? ":=" OverrideRuleBody
        const name = node.children[0].sourceString;
        currentRuleName = name;

        const formalsOpt = node.children[1];
        currentRuleFormals =
          formalsOpt.children.length > 0 ? visitFormals(formalsOpt.children[0]) : [];

        const source = interval(node).trimmed();
        currentDecl.ensureSuperGrammarRuleForOverriding(name, source);

        overriding = true;
        const body = visit(node.children[3]);
        overriding = false;

        currentDecl.override(name, currentRuleFormals, body, null, source);
        return;
      }
      case 'Rule_extend': {
        // ident Formals? "+=" RuleBody
        const name = node.children[0].sourceString;
        currentRuleName = name;

        const formalsOpt = node.children[1];
        currentRuleFormals =
          formalsOpt.children.length > 0 ? visitFormals(formalsOpt.children[0]) : [];

        const body = visit(node.children[3]);
        const source = interval(node).trimmed();
        currentDecl.extend(name, currentRuleFormals, body, null, source);
        return;
      }
      case 'RuleBody':
      case 'OverrideRuleBody': {
        // "|"? NonemptyListOf<TopLevelTerm/OverrideTopLevelTerm, "|">
        const terms = listOfElements(node.children[1]).map(t => visit(t));
        return makeAlt(terms).withSource(interval(node));
      }
      case 'TopLevelTerm_inline': {
        // Seq caseName
        const body = visit(node.children[0]);
        const caseName = visitCaseName(node.children[1]);
        const inlineRuleName = currentRuleName + '_' + caseName;
        const source = interval(node).trimmed();

        const isNewRule = !(
          currentDecl.superGrammar && currentDecl.superGrammar.rules[inlineRuleName]
        );
        if (overriding && !isNewRule) {
          currentDecl.override(inlineRuleName, currentRuleFormals, body, null, source);
        } else {
          currentDecl.define(inlineRuleName, currentRuleFormals, body, null, source);
        }

        const params = currentRuleFormals.map(formal => new pexprs.Apply(formal));
        return new pexprs.Apply(inlineRuleName, params).withSource(body.source);
      }
      case 'Rule':
      case 'TopLevelTerm':
      case 'OverrideTopLevelTerm':
      case 'Iter':
      case 'Pred':
      case 'Lex':
      case 'Base':
        // Passthrough: single child.
        return visit(node.children[0]);
      case 'OverrideTopLevelTerm_superSplice':
        throw new Error('Super splice (...) is not supported');
      case 'Formals':
        return visitFormals(node);
      case 'Params':
        return visitParams(node);
      case 'Alt': {
        // NonemptyListOf<Seq, "|">
        const terms = listOfElements(node.children[0]).map(s => visit(s));
        return makeAlt(terms).withSource(interval(node));
      }
      case 'Seq': {
        // Iter*
        const iterList = node.children[0]; // ListNode
        const factors = iterList.children.map((iter: CstNode) => visit(iter));
        return makeSeq(factors).withSource(interval(node));
      }
      case 'Iter_star':
        return new pexprs.Star(visit(node.children[0])).withSource(interval(node));
      case 'Iter_plus':
        return new pexprs.Plus(visit(node.children[0])).withSource(interval(node));
      case 'Iter_opt':
        return new pexprs.Opt(visit(node.children[0])).withSource(interval(node));
      case 'Pred_not':
        return new pexprs.Not(visit(node.children[1])).withSource(interval(node));
      case 'Pred_lookahead':
        return new pexprs.Lookahead(visit(node.children[1])).withSource(interval(node));
      case 'Lex_lex':
        return new pexprs.Lex(visit(node.children[1])).withSource(interval(node));
      case 'Base_application': {
        // ident Params? ~(ruleDescr? "=" | ":=" | "+=")
        // The Not produces 0 bindings, so children: [ident, Params?]
        const ruleName = node.children[0].sourceString;
        const paramsOpt = node.children[1]; // OptNode
        const params = paramsOpt.children.length > 0 ? visitParams(paramsOpt.children[0]) : [];
        return new pexprs.Apply(ruleName, params).withSource(interval(node));
      }
      case 'Base_range': {
        // oneCharTerminal ".." oneCharTerminal
        const from = visitOneCharTerminal(node.children[0]);
        const to = visitOneCharTerminal(node.children[2]);
        return new pexprs.Range(from, to).withSource(interval(node));
      }
      case 'Base_terminal':
        return new pexprs.Terminal(visitTerminal(node.children[0])).withSource(interval(node));
      case 'Base_paren':
        // "(" Alt ")"
        return visit(node.children[1]);
      default:
        throw new Error(`buildGrammar: unhandled ctorName: ${node.ctorName}`);
    }
  }

  function visitFormals(node: CstNode): string[] {
    // Formals = "<" ListOf<ident, ","> ">"
    return listOfElements(node.children[1]).map(n => n.sourceString);
  }

  function visitParams(node: CstNode): any[] {
    // Params = "<" ListOf<Seq, ","> ">"
    return listOfElements(node.children[1]).map(s => visit(s));
  }

  function visitTerminal(node: CstNode): string {
    // terminal = "\"" terminalChar* "\""
    const charList = node.children[1]; // ListNode
    return charList.children.map(c => visitTerminalChar(c)).join('');
  }

  function visitOneCharTerminal(node: CstNode): string {
    // oneCharTerminal = "\"" terminalChar "\""
    return visitTerminalChar(node.children[1]);
  }

  function visitTerminalChar(node: CstNode): string {
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

  function visitRuleDescr(node: CstNode): string {
    // ruleDescr = "(" ruleDescrText ")"
    return node.children[1].sourceString.trim();
  }

  function visitCaseName(node: CstNode): string {
    // caseName = "--" (~"\n" space)* name (~"\n" space)* ("\n" | &"}")
    // Bindings: "--", ListNode, name, ListNode, [possibly "\n"]
    // We only need the name at index 2.
    return node.children[2].sourceString;
  }

  return visit(rootNode);
}
