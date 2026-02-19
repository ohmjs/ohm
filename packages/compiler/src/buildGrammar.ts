// CST visitor: takes a WASM CST root node (from matching the Ohm meta-grammar)
// and produces v17 Grammar objects using v17's GrammarDecl for validation.

import type {CstNode} from 'ohm-js';

import * as errors from 'ohm-js-legacy/src/errors.js';
import * as pexprs from 'ohm-js-legacy/src/pexprs-build.js';
import {Grammar} from 'ohm-js-legacy/src/Grammar.js';
import {GrammarDecl} from 'ohm-js-legacy/src/GrammarDecl.js';
import {Interval} from 'ohm-js-legacy/src/Interval.js';

const superSplicePlaceholder = Object.create(pexprs.PExpr.prototype);

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
      const first = node.children[0];
      const restList = node.children[1]; // (sep elem)*
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

function namespaceHas(ns: Record<string, any>, name: string): boolean {
  for (const prop in ns) {
    if (prop === name) return true;
  }
  return false;
}

function makeAlt(terms: any[]): any {
  if (terms.length === 1) return terms[0];
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

// Returns an array of Grammar instances for the given CST root node.
// Each grammar will be assigned into `namespace` under its declared name.
export function buildGrammars(
  rootNode: CstNode,
  namespace: Record<string, any>,
  sourceString: string
): any[] {
  let decl: any;
  let currentRuleName: string;
  let currentRuleFormals: string[];
  let overriding = false;

  // Create a v17 Interval from a CstNode's source position.
  function interval(node: CstNode): any {
    return new Interval(sourceString, node.source.startIdx, node.source.endIdx);
  }

  // A visitor that produces Grammar instances from the CST.
  function visit(node: CstNode): any {
    switch (node.ctorName) {
      case 'Grammars':
        return node.children[0].children.map((c: CstNode) => visit(c));

      case 'Grammar': {
        // Grammar = ident SuperGrammar? "{" Rule* "}"
        const [id, s, _open, rules] = node.children;
        const grammarName = id.sourceString;
        decl = new GrammarDecl(grammarName);
        if (s.children.length > 0) {
          visit(s.children[0]);
        }
        rules.children.map((c: CstNode) => visit(c));
        const g = decl.build();
        g.source = interval(node).trimmed();
        if (namespaceHas(namespace, grammarName)) {
          throw errors.duplicateGrammarDeclaration(g, namespace);
        }
        namespace[grammarName] = g;
        return g;
      }

      case 'SuperGrammar': {
        // SuperGrammar = "<:" ident
        const [, n] = node.children;
        const superGrammarName = n.sourceString;
        if (superGrammarName === 'null') {
          decl.withSuperGrammar(null);
        } else {
          if (!namespaceHas(namespace, superGrammarName)) {
            throw errors.undeclaredGrammar(superGrammarName, namespace, interval(n));
          }
          decl.withSuperGrammar(namespace[superGrammarName]);
        }
        return;
      }

      case 'Rule_define': {
        // Rule_define = ident Formals? ruleDescr? "=" RuleBody
        const [n, fs, d, , b] = node.children;
        currentRuleName = n.sourceString;
        currentRuleFormals = visitFormals(fs);
        // If there is no default start rule yet, set it now. This must be done before visiting
        // the body, because it might contain an inline rule definition.
        if (
          !decl.defaultStartRule &&
          decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules
        ) {
          decl.withDefaultStartRule(currentRuleName);
        }
        const body = visit(b);
        const description = d.children.length > 0 ? visitRuleDescr(d.children[0]) : undefined;
        const source = interval(node).trimmed();
        return decl.define(currentRuleName, currentRuleFormals, body, description, source);
      }
      case 'Rule_override': {
        // Rule_override = ident Formals? ":=" OverrideRuleBody
        const [n, fs, , b] = node.children;
        currentRuleName = n.sourceString;
        currentRuleFormals = visitFormals(fs);

        const source = interval(node).trimmed();
        decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);

        overriding = true;
        const body = visit(b);
        overriding = false;
        return decl.override(currentRuleName, currentRuleFormals, body, null, source);
      }
      case 'Rule_extend': {
        // Rule_extend = ident Formals? "+=" RuleBody
        const [n, fs, , b] = node.children;
        currentRuleName = n.sourceString;
        currentRuleFormals = visitFormals(fs);
        const body = visit(b);
        const source = interval(node).trimmed();
        return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
      }

      case 'RuleBody': {
        // RuleBody = "|"? NonemptyListOf<TopLevelTerm, "|">
        const [, terms] = node.children;
        return makeAlt(listOfElements(terms).map(t => visit(t))).withSource(interval(node));
      }
      case 'OverrideRuleBody': {
        // OverrideRuleBody = "|"? NonemptyListOf<OverrideTopLevelTerm, "|">
        const [, terms] = node.children;
        const args = listOfElements(terms).map(t => visit(t));

        // Check if the super-splice operator (`...`) appears in the terms.
        const expansionPos = args.indexOf(superSplicePlaceholder);
        if (expansionPos >= 0) {
          const beforeTerms = args.slice(0, expansionPos);
          const afterTerms = args.slice(expansionPos + 1);

          // Ensure it appears no more than once.
          afterTerms.forEach(t => {
            if (t === superSplicePlaceholder) throw errors.multipleSuperSplices(t);
          });

          return new pexprs.Splice(
            decl.superGrammar,
            currentRuleName,
            beforeTerms,
            afterTerms
          ).withSource(interval(node));
        } else {
          return makeAlt(args).withSource(interval(node));
        }
      }

      case 'Alt': {
        const [seqs] = node.children;
        return makeAlt(listOfElements(seqs).map(s => visit(s))).withSource(interval(node));
      }

      case 'TopLevelTerm_inline': {
        // TopLevelTerm_inline = Seq caseName
        const [b, n] = node.children;
        const inlineRuleName = currentRuleName + '_' + visitCaseName(n);
        const body = visit(b);
        const source = interval(node).trimmed();
        const isNewRuleDeclaration = !(
          decl.superGrammar && decl.superGrammar.rules[inlineRuleName]
        );
        if (overriding && !isNewRuleDeclaration) {
          decl.override(inlineRuleName, currentRuleFormals, body, null, source);
        } else {
          decl.define(inlineRuleName, currentRuleFormals, body, null, source);
        }
        decl.rules[inlineRuleName]._isInlineRule = true;
        const params = currentRuleFormals.map(formal => new pexprs.Apply(formal));
        return new pexprs.Apply(inlineRuleName, params).withSource(body.source);
      }
      case 'OverrideTopLevelTerm_superSplice':
        return superSplicePlaceholder;

      case 'Seq': {
        const [expr] = node.children;
        return makeSeq(expr.children.map((c: CstNode) => visit(c))).withSource(interval(node));
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
        const [rule, ps] = node.children;
        return new pexprs.Apply(rule.sourceString, visitParams(ps)).withSource(interval(node));
      }
      case 'Base_range': {
        const [from, , to] = node.children;
        return new pexprs.Range(
          visitOneCharTerminal(from),
          visitOneCharTerminal(to)
        ).withSource(interval(node));
      }
      case 'Base_terminal': {
        const [expr] = node.children;
        return new pexprs.Terminal(visitTerminal(expr)).withSource(interval(node));
      }
      case 'Base_paren': {
        const [, x] = node.children;
        return visit(x);
      }

      // Passthrough cases (implicit in the JS version via Semantics defaults).
      case 'Rule':
      case 'TopLevelTerm':
      case 'OverrideTopLevelTerm':
      case 'Iter':
      case 'Pred':
      case 'Lex':
      case 'Base':
        return visit(node.children[0]);

      default:
        throw new Error(`buildGrammar: unhandled ctorName: ${node.ctorName}`);
    }
  }

  // Accept the OptNode for Formals? and extract ident names.
  function visitFormals(fs: CstNode): string[] {
    if (fs.children.length === 0) return [];
    // Formals = "<" ListOf<ident, ","> ">"
    return listOfElements(fs.children[0].children[1]).map(n => n.sourceString);
  }

  // Accept the OptNode for Params? and visit each Seq.
  function visitParams(ps: CstNode): any[] {
    if (ps.children.length === 0) return [];
    // Params = "<" ListOf<Seq, ","> ">"
    return listOfElements(ps.children[0].children[1]).map(s => visit(s));
  }

  function visitTerminal(node: CstNode): string {
    // terminal = "\"" terminalChar* "\""
    return node.children[1].children.map(c => visitTerminalChar(c)).join('');
  }

  function visitOneCharTerminal(node: CstNode): string {
    // oneCharTerminal = "\"" terminalChar "\""
    return visitTerminalChar(node.children[1]);
  }

  function visitTerminalChar(node: CstNode): string {
    // terminalChar = escapeChar | ~"\\" ~"\"" ~"\n" "\u{0}".."\u{10FFFF}"
    const child = node.children[0];
    if (child.isTerminal()) {
      return child.sourceString;
    }
    // escapeChar
    try {
      return unescapeCodePoint(child.sourceString);
    } catch (err) {
      if (err instanceof RangeError && err.message.startsWith('Invalid code point ')) {
        // escapeChar_unicodeCodePoint = "\u{" hexDigit+ "}"
        // Point the error at just the hex digits.
        const hexStart = child.source.startIdx + 3; // skip \u{
        const hexEnd = child.source.endIdx - 1; // skip }
        const hex = sourceString.slice(hexStart, hexEnd);
        throw errors.createError(
          `U+${hex} is not a valid Unicode code point`,
          new Interval(sourceString, hexStart, hexEnd)
        );
      }
      throw err;
    }
  }

  function visitRuleDescr(node: CstNode): string {
    // ruleDescr = "(" ruleDescrText ")"
    return node.children[1].sourceString.trim();
  }

  function visitCaseName(node: CstNode): string {
    // caseName = "--" (~"\n" space)* name (~"\n" space)* ("\n" | &"}")
    return node.children[2].sourceString;
  }

  return visit(rootNode);
}
