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

const buildOptions = {eliminateLookaheads: true};

export function grammar(source, optNamespace) {
  return _grammar(source, optNamespace, buildOptions);
}

export function grammars(source, optNamespace) {
  return _grammars(source, optNamespace, buildOptions);
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
  return adaptNode(root, rootStart, rootStart, input);
}

function adaptNode(node, absStart, baseStart, input) {
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

  // Group iteration siblings and adapt
  const adapted = [];
  for (const group of groupIterEntries(childEntries)) {
    if (group.kind === 'node') {
      const e = group.entry;
      adapted.push(adaptNode(e.node, e.absStart, e.baseStart, input));
    } else {
      adapted.push(wrapIterGroup(group.entries, input));
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
 * Group consecutive iteration node entries that are siblings
 * (same source interval and same child count).
 */
function groupIterEntries(entries) {
  const groups = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (!e.node.isIteration()) {
      groups.push({kind: 'node', entry: e});
      continue;
    }
    const siblings = [e];
    for (let j = i + 1; j < entries.length; j++) {
      const other = entries[j];
      if (
        other.node.isIteration() &&
        other.absStart === e.absStart &&
        other.absEnd === e.absEnd &&
        other.node.children.length === e.node.children.length
      ) {
        siblings.push(other);
        i = j;
      } else {
        break;
      }
    }
    groups.push({kind: 'iter', entries: siblings});
  }
  return groups;
}

/**
 * Wrap a group of iteration sibling entries into ListNode/OptNode/SeqNode.
 */
function wrapIterGroup(siblingEntries, input) {
  const ref = siblingEntries[0];
  const source = {startIdx: ref.absStart, endIdx: ref.absEnd};
  const sourceStr = input.slice(ref.absStart, ref.absEnd);

  if (ref.node.isOptional()) {
    if (ref.node.children.length === 0) {
      return new OptNode(undefined, source, sourceStr);
    }
    const child =
      siblingEntries.length === 1
        ? adaptIterChild(ref, 0, input)
        : new SeqNode(
            siblingEntries.map(sib => adaptIterChild(sib, 0, input)),
            source,
            sourceStr
          );
    return new OptNode(child, source, sourceStr);
  }

  const numRows = ref.node.children.length;

  if (siblingEntries.length === 1) {
    const children = [];
    for (let i = 0; i < numRows; i++) {
      children.push(adaptIterChild(ref, i, input));
    }
    return new ListNode(children, source, sourceStr);
  }

  // Multi-column: transpose columns to rows of SeqNodes
  const rows = [];
  for (let row = 0; row < numRows; row++) {
    const seqChildren = siblingEntries.map(sib => adaptIterChild(sib, row, input));
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
function adaptIterChild(iterEntry, childIdx, input) {
  const iterNode = iterEntry.node;
  const base = iterEntry.baseStart;
  const child = iterNode.children[childIdx];
  const childAbsStart = base + iterNode.childOffsets[childIdx];
  const childBaseStart = child.isNonterminal() ? childAbsStart : base;
  return adaptNode(child, childAbsStart, childBaseStart, input);
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
