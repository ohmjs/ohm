/**
 * Forward compatibility layer: provides v18-style API on top of the v17 engine.
 *
 * Importing this module patches v17 prototypes with v18 methods (isList, isSeq,
 * getCstRoot, etc.) and re-exports the standard ohm-js API. Usage:
 *
 *   import { grammar } from 'ohm-js/v18';
 *   const g = grammar('G { greeting = "hello" "world" }');
 *   const result = g.match('helloworld');
 *   if (result.succeeded()) {
 *     const root = result.getCstRoot();
 *     // work with v18-style CST nodes
 *   }
 */

import * as common from './common.js';
import {_grammar, _grammars} from './main.js';
import {MatchResult} from './MatchResult.js';
import {Node} from './nodes.js';
import * as pexprs from './pexprs-main.js';

const buildOptions = {eliminateLookaheads: true};

export function grammar(source, optNamespace) {
  const g = _grammar(source, optNamespace, buildOptions);
  assertV18ArityConsistency(g);
  return g;
}

export function grammars(source, optNamespace) {
  const gs = _grammars(source, optNamespace, buildOptions);
  for (const g of Object.values(gs)) {
    assertV18ArityConsistency(g);
  }
  return gs;
}

// ===== v18 arity validation =====

/**
 * Compute the v18 CST arity for a PExpr. The key differences from v17's
 * getArity() are: (1) Iter always returns 1 (it produces a single
 * ListNode/OptNode in v18), and (2) Lookahead returns 0 (lookaheads are
 * eliminated from the CST via the eliminateLookaheads build option).
 */
function getArityV18(pexpr) {
  if (pexpr instanceof pexprs.Seq) {
    return pexpr.factors.reduce((sum, f) => sum + getArityV18(f), 0);
  }
  if (pexpr instanceof pexprs.Alt) {
    // Consistency checked separately; return first term's arity.
    return getArityV18(pexpr.terms[0]);
  }
  if (pexpr instanceof pexprs.Iter) {
    return 1;
  }
  if (pexpr instanceof pexprs.Not) {
    return 0;
  }
  if (pexpr instanceof pexprs.Lookahead) {
    return 0;
  }
  if (pexpr instanceof pexprs.Lex) {
    return getArityV18(pexpr.expr);
  }
  // Leaf nodes: any, end, Terminal, Range, Param, Apply, UnicodeChar
  return 1;
}

/**
 * Check that all Alt alternatives in the grammar have consistent v18 arity.
 */
function assertV18ArityConsistency(grammar) {
  for (const ruleName of Object.keys(grammar.rules)) {
    checkAltConsistency(grammar.rules[ruleName].body, ruleName);
  }
}

function checkAltConsistency(pexpr, ruleName) {
  if (pexpr instanceof pexprs.Alt) {
    const arities = pexpr.terms.map(t => getArityV18(t));
    for (let i = 1; i < arities.length; i++) {
      if (arities[i] !== arities[0]) {
        throw new Error(
          `v18 arity mismatch in rule '${ruleName}': ` +
            `alternative 1 has arity ${arities[0]}, ` +
            `alternative ${i + 1} has arity ${arities[i]}`
        );
      }
    }
    for (const term of pexpr.terms) {
      checkAltConsistency(term, ruleName);
    }
  } else if (pexpr instanceof pexprs.Seq) {
    for (const factor of pexpr.factors) {
      checkAltConsistency(factor, ruleName);
    }
  } else if (pexpr instanceof pexprs.Iter) {
    checkAltConsistency(pexpr.expr, ruleName);
  } else if (pexpr instanceof pexprs.Lookahead || pexpr instanceof pexprs.Lex) {
    checkAltConsistency(pexpr.expr, ruleName);
  }
  // Leaves (Terminal, Apply, etc.): no-op
}

// ===== v18 CST node base and types =====

class V18Node {
  isNonterminal() {
    return false;
  }
  isTerminal() {
    return false;
  }
  isList() {
    return false;
  }
  isOptional() {
    return false;
  }
  isSeq() {
    return false;
  }
}

class ListNode extends V18Node {
  constructor(children, source, sourceString) {
    super();
    this.ctorName = '_list';
    this.children = children;
    this.source = source;
    this.sourceString = sourceString;
    this.matchLength = source.endIdx - source.startIdx;
  }

  isList() {
    return true;
  }

  collect(cb) {
    return this.children.map(c => (c?.isSeq() ? c.unpack(cb) : cb(c)));
  }
}

class OptNode extends V18Node {
  constructor(child, source, sourceString) {
    super();
    this.ctorName = '_opt';
    this.children = child ? [child] : [];
    this.source = source;
    this.sourceString = sourceString;
    this.matchLength = source.endIdx - source.startIdx;
  }

  isOptional() {
    return true;
  }

  ifPresent(consume, orElse) {
    const child = this.children[0];
    if (child) {
      return child.isSeq() ? child.unpack(consume) : consume(child);
    }
    if (orElse) return orElse();
    return undefined;
  }

  isPresent() {
    return this.children.length > 0;
  }

  isEmpty() {
    return this.children.length === 0;
  }
}

class SeqNode extends V18Node {
  constructor(children, source, sourceString) {
    super();
    this.ctorName = '_seq';
    this.children = children;
    this.source = source;
    this.sourceString = sourceString;
    this.matchLength = source.endIdx - source.startIdx;
  }

  isSeq() {
    return true;
  }

  unpack(cb) {
    return cb(...this.children);
  }
}

class TerminalAdapter extends V18Node {
  constructor(absStart, absEnd, input) {
    super();
    this.ctorName = '_terminal';
    this.source = {startIdx: absStart, endIdx: absEnd};
    this.sourceString = input.slice(absStart, absEnd);
    this.matchLength = absEnd - absStart;
    this.children = [];
  }

  isTerminal() {
    return true;
  }
  isLexical() {
    return false;
  }
}

class NonterminalAdapter extends V18Node {
  constructor(ctorName, absStart, absEnd, input, matchLength, adaptedChildren) {
    super();
    this.ctorName = ctorName;
    this.source = {startIdx: absStart, endIdx: absEnd};
    this.sourceString = input.slice(absStart, absEnd);
    this.matchLength = matchLength;
    this.children = adaptedChildren;
  }

  isNonterminal() {
    return true;
  }
  isLexical() {
    return common.isLexical(this.ctorName);
  }
  isSyntactic() {
    return common.isSyntactic(this.ctorName);
  }
}

// ===== Grammar-aware slot resolution =====

/**
 * Returns an array of slot descriptors for a PExpr, describing how its
 * bindings map to CST children. Each descriptor is {kind, count}:
 *   - 'value': a normal child (count always 1)
 *   - 'iter': an iteration group of `count` consecutive _iter children
 *   - 'skip': `count` children to skip (e.g. from Lookahead)
 * Returns null for Alt/Extend/Splice (needs resolveSlots for disambiguation).
 */
function getSlots(pexpr) {
  if (pexpr instanceof pexprs.Seq) {
    const slots = [];
    for (const factor of pexpr.factors) {
      const sub = getSlots(factor);
      if (sub === null) return null;
      slots.push(...sub);
    }
    return slots;
  }
  if (pexpr instanceof pexprs.Lex) {
    return getSlots(pexpr.expr);
  }
  if (pexpr instanceof pexprs.Not) {
    return []; // arity 0, no children
  }
  if (pexpr instanceof pexprs.Lookahead) {
    const arity = pexpr.expr.getArity();
    return [{kind: 'skip', count: arity}];
  }
  if (pexpr instanceof pexprs.Iter) {
    return [{kind: 'iter', count: pexpr.expr.getArity()}];
  }
  if (pexpr instanceof pexprs.Alt) {
    return null; // needs resolveSlots
  }
  // Leaf nodes: Terminal, Apply, any, end, Range, UnicodeChar, Param
  return [{kind: 'value', count: 1}];
}

/**
 * For Alt (including Extend, Splice), try each term's slots and return the
 * first one consistent with the actual CST children. Recurses into nested
 * Alts (e.g. from Extend/Splice) so that every alternative is reachable.
 */
function resolveSlots(pexpr, childEntries) {
  if (pexpr instanceof pexprs.Alt) {
    for (const term of pexpr.terms) {
      const slots = resolveSlots(term, childEntries);
      if (slots !== null && slotsMatchEntries(slots, childEntries)) {
        return slots;
      }
    }
    return null;
  }
  return getSlots(pexpr);
}

/**
 * Check whether a list of slot descriptors is consistent with the actual
 * CST child entries — i.e. that 'iter' slots land on _iter children,
 * 'value' slots land on non-_iter children, and total counts match.
 */
function slotsMatchEntries(slots, entries) {
  let ei = 0;
  for (const slot of slots) {
    if (slot.kind === 'skip') {
      ei += slot.count;
    } else if (slot.kind === 'iter') {
      for (let k = 0; k < slot.count; k++, ei++) {
        if (ei >= entries.length || !entries[ei].node.isIteration()) return false;
      }
    } else {
      // 'value'
      if (ei >= entries.length || entries[ei].node.isIteration()) return false;
      ei++;
    }
  }
  return ei === entries.length;
}

// ===== Direct CST transform =====

/**
 * Build a v18-style CST directly from a v17 MatchResult, without creating
 * a Semantics instance or wrapper objects.
 *
 * Uses (absStart, baseStart) tracking to compute source positions:
 * - absStart: absolute start index of the node in the input
 * - baseStart: absolute start of the closest nonterminal ancestor (used as
 *   the offset base for iteration/terminal childOffsets)
 */
export function getCstRoot(matchResult) {
  if (!matchResult.succeeded()) {
    throw new Error('Cannot get CST root: no successful match');
  }
  const {input} = matchResult;
  const root = matchResult._cst;
  const rootStart = matchResult._cstOffset;
  const grammar = matchResult.matcher.grammar;
  return adaptNode(root, rootStart, rootStart, input, grammar);
}

function adaptNode(node, absStart, baseStart, input, grammar) {
  const absEnd = absStart + node.matchLength;

  if (node.isTerminal()) {
    return new TerminalAdapter(absStart, absEnd, input);
  }

  // For nonterminals, childOffsets are relative to their own start (absStart).
  // For iteration nodes, childOffsets are relative to the enclosing
  // nonterminal's base (baseStart).
  const base = node.isNonterminal() ? absStart : baseStart;
  const childEntries = [];
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const childAbsStart = base + node.childOffsets[i];
    const childAbsEnd = childAbsStart + child.matchLength;
    const childBaseStart = child.isNonterminal() ? childAbsStart : base;
    childEntries.push({
      node: child,
      absStart: childAbsStart,
      absEnd: childAbsEnd,
      baseStart: childBaseStart,
    });
  }

  const rule = grammar.rules[node.ctorName];
  const slots = resolveSlots(rule.body, childEntries);
  return adaptWithSlots(node, childEntries, slots, absStart, absEnd, input, grammar);
}

/**
 * Adapt a nonterminal node using grammar-aware slot descriptors.
 */
function adaptWithSlots(node, childEntries, slots, absStart, absEnd, input, grammar) {
  const adapted = [];
  let ei = 0;
  for (const slot of slots) {
    if (slot.kind === 'skip') {
      ei += slot.count;
    } else if (slot.kind === 'iter') {
      const siblings = [];
      for (let k = 0; k < slot.count; k++, ei++) {
        siblings.push(childEntries[ei]);
      }
      adapted.push(wrapIterGroup(siblings, input, grammar));
    } else {
      // 'value'
      const e = childEntries[ei++];
      adapted.push(adaptNode(e.node, e.absStart, e.baseStart, input, grammar));
    }
  }

  return new NonterminalAdapter(
    node.ctorName,
    absStart,
    absEnd,
    input,
    node.matchLength,
    adapted
  );
}

/**
 * Wrap a group of iteration sibling entries into ListNode/OptNode/SeqNode.
 */
function wrapIterGroup(siblingEntries, input, grammar) {
  const ref = siblingEntries[0];
  const source = {startIdx: ref.absStart, endIdx: ref.absEnd};
  const sourceStr = input.slice(ref.absStart, ref.absEnd);

  if (ref.node.isOptional()) {
    if (ref.node.children.length === 0) {
      return new OptNode(undefined, source, sourceStr);
    }
    const child =
      siblingEntries.length === 1
        ? adaptIterChild(ref, 0, input, grammar)
        : new SeqNode(
            siblingEntries.map(sib => adaptIterChild(sib, 0, input, grammar)),
            source,
            sourceStr
          );
    return new OptNode(child, source, sourceStr);
  }

  const numRows = ref.node.children.length;

  if (siblingEntries.length === 1) {
    const children = [];
    for (let i = 0; i < numRows; i++) {
      children.push(adaptIterChild(ref, i, input, grammar));
    }
    return new ListNode(children, source, sourceStr);
  }

  // Multi-column: transpose columns to rows of SeqNodes
  const rows = [];
  for (let row = 0; row < numRows; row++) {
    const seqChildren = siblingEntries.map(sib => adaptIterChild(sib, row, input, grammar));
    const rowStart = seqChildren[0].source.startIdx;
    const rowEnd = seqChildren[seqChildren.length - 1].source.endIdx;
    const rowSource = {startIdx: rowStart, endIdx: rowEnd};
    rows.push(new SeqNode(seqChildren, rowSource, input.slice(rowStart, rowEnd)));
  }
  return new ListNode(rows, source, sourceStr);
}

/**
 * Adapt a single child of an iteration node entry.
 */
function adaptIterChild(iterEntry, childIdx, input, grammar) {
  const iterNode = iterEntry.node;
  const base = iterEntry.baseStart;
  const child = iterNode.children[childIdx];
  const childAbsStart = base + iterNode.childOffsets[childIdx];
  const childBaseStart = child.isNonterminal() ? childAbsStart : base;
  return adaptNode(child, childAbsStart, childBaseStart, input, grammar);
}

// ===== Prototype patching =====

function patchProto(proto, name, value) {
  if (!proto[name]) {
    Object.defineProperty(proto, name, {value, configurable: true, writable: true});
  }
}

// MatchResult
patchProto(MatchResult.prototype, 'getCstRoot', function () {
  return getCstRoot(this);
});
patchProto(MatchResult.prototype, 'use', function (cb) {
  return cb(this);
});
patchProto(MatchResult.prototype, 'detach', () => {});

// Node (v17 CST base class)
patchProto(Node.prototype, 'isList', () => false);
patchProto(Node.prototype, 'isSeq', () => false);
