import {
  CST_CHILD_COUNT_OFFSET,
  CST_CHILDREN_OFFSET,
  CST_MATCH_LENGTH_OFFSET,
  CST_HAS_LEADING_SPACES_FLAG,
  CST_TYPE_AND_DETAILS_OFFSET,
  CstNodeType,
  isTaggedTerminal,
  MatchRecordType,
  rawMatchRecordType,
} from './miniohm.ts';
import {assert, checkNotNull} from './assert.ts';
import {createHandle, rawHandle, unpackStartIdx, _nodeFactory} from './cstReaderShared.ts';

import type {CstNode, MatchContext} from './miniohm.ts';

export {CstNodeType};

function nextEdgePos(cst: CstView, child: number): number {
  return cst.startIdx(child) + cst.matchLength(child);
}

/**
 * Zero-allocation access to the CST stored in Wasm linear memory.
 *
 * Handles have startIdx packed in the upper bits.
 *
 * forEachChild(handle, fn) iterates visible children. The callback receives
 * (childHandle, leadingSpacesLen, index).
 *
 * Leading spaces are edge data (they belong to the parent→child relationship),
 * not node data. For each child edge:
 * - startIdx(childHandle) is the child's start position
 * - leadingSpacesLen >= 0
 * - leading spaces span: start = startIdx(childHandle) - leadingSpacesLen, length = leadingSpacesLen
 * - child source span: start = startIdx(childHandle), length = matchLength(childHandle)
 *
 * For root:
 * - startIdx(root) === rootLeadingSpacesLen
 * - leading spaces before root are input.slice(0, rootLeadingSpacesLen)
 */
export class CstView {
  /** @internal */
  private _ctx: MatchContext;

  /** Handle for the root node (with startIdx packed in). */
  readonly root: number;
  /** Length of leading spaces before the root, or 0 if none. */
  readonly rootLeadingSpacesLen: number;

  /** @internal */
  constructor(ctx: MatchContext, root: number, rootLeadingSpacesLen: number) {
    this._ctx = ctx;
    this.root = root;
    this.rootLeadingSpacesLen = rootLeadingSpacesLen;
  }

  /** Extract the startIdx from a handle. */
  startIdx(handle: number): number {
    return unpackStartIdx(handle);
  }

  /** Node type: NONTERMINAL, TERMINAL, LIST, or OPT. */
  type(handle: number): CstNodeType {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return CstNodeType.TERMINAL;
    const mrType = rawMatchRecordType(this._ctx.view, raw);
    if (mrType === MatchRecordType.NONTERMINAL) return CstNodeType.NONTERMINAL;
    if (mrType === MatchRecordType.TERMINAL) return CstNodeType.TERMINAL;
    if (mrType === MatchRecordType.ITER_FLAG) return CstNodeType.LIST;
    return CstNodeType.OPT;
  }

  /** Number of raw children stored in this match record. */
  childCount(handle: number): number {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return 0;
    return this._ctx.view.getUint32(raw + CST_CHILD_COUNT_OFFSET, true);
  }

  /** Length of matched input (in UTF-16 code units). */
  matchLength(handle: number): number {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return raw >>> 2;
    return this._ctx.view.getUint32(raw + CST_MATCH_LENGTH_OFFSET, true);
  }

  /**
   * Constructor name. For nonterminals, the rule name (without parameterization).
   * For other types: '_terminal', '_list', '_opt'.
   */
  ctorName(handle: number): string {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return '_terminal';
    const type = rawMatchRecordType(this._ctx.view, raw);
    if (type === MatchRecordType.NONTERMINAL) {
      const ruleId = this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) >>> 2;
      return this._ctx.ruleNames[ruleId].split('<')[0];
    }
    if (type === MatchRecordType.TERMINAL) return '_terminal';
    if (type === MatchRecordType.ITER_FLAG) return '_list';
    return '_opt';
  }

  /** @internal */
  private _details(handle: number): number {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return 0;
    return this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) >>> 2;
  }

  /** Rule ID for a nonterminal node. */
  ruleId(handle: number): number {
    assert(this.type(handle) === CstNodeType.NONTERMINAL, 'Not a nonterminal');
    return this._details(handle);
  }

  /** Children per tuple for a list node. */
  tupleArity(handle: number): number {
    assert(this.type(handle) === CstNodeType.LIST, 'Not a list');
    return this._details(handle);
  }

  /** Whether an optional node has a child. */
  isPresent(handle: number): boolean {
    assert(this.type(handle) === CstNodeType.OPT, 'Not an opt');
    return this.childCount(handle) > 0;
  }

  /** Source string for a node (startIdx is extracted from the handle). */
  sourceString(handle: number): string {
    const si = unpackStartIdx(handle);
    return this._ctx.input.slice(si, si + this.matchLength(handle));
  }

  /** The full input string that was parsed. */
  get input(): string {
    return this._ctx.input;
  }

  /** The array of rule names, indexed by rule ID. */
  get ruleNames(): readonly string[] {
    return this._ctx.ruleNames;
  }

  /**
   * Iterate over children. The callback receives (childHandle, leadingSpacesLen,
   * index).
   *
   * Leading spaces belong to the parent→child edge. Use `startIdx(child)` and
   * `input.slice()` to recover the spaces text.
   *
   * Only NONTERMINAL and TERMINAL children may have leading spaces;
   * LIST and OPT children always have leadingSpacesLen === 0.
   */
  forEachChild(
    handle: number,
    fn: (child: number, leadingSpacesLen: number, index: number) => void
  ): void {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return;

    const count = this._ctx.view.getUint32(raw + CST_CHILD_COUNT_OFFSET, true);
    let edgeStartIdx = unpackStartIdx(handle);
    const {getSpacesLenAt} = this._ctx;

    for (let i = 0; i < count; i++) {
      const slot = this._ctx.view.getUint32(raw + CST_CHILDREN_OFFSET + i * 4, true);

      const hasLeadingSpaces = (slot & CST_HAS_LEADING_SPACES_FLAG) !== 0;
      const rawChild = slot & ~CST_HAS_LEADING_SPACES_FLAG;

      const leadingSpacesLen =
        hasLeadingSpaces && getSpacesLenAt && this._hasParentSpaces(rawChild)
          ? Math.max(0, getSpacesLenAt(edgeStartIdx))
          : 0;

      const childStartIdx = edgeStartIdx + leadingSpacesLen;
      const childHandle = createHandle(rawChild, childStartIdx);

      fn(childHandle, leadingSpacesLen, i);

      const len = isTaggedTerminal(rawChild)
        ? rawChild >>> 2
        : this._ctx.view.getUint32(rawChild + CST_MATCH_LENGTH_OFFSET, true);

      edgeStartIdx = childStartIdx + len;
    }
  }

  /**
   * Get the handle of the child at `index`, given the current `edgeStartIdx`.
   * The caller must track `edgeStartIdx`: for the first child, it's
   * `startIdx(parentHandle)`; for subsequent children, it's
   * `startIdx(prevChild) + matchLength(prevChild)`.
   */
  private childAt(handle: number, index: number, edgeStartIdx: number): number {
    const raw = rawHandle(handle);
    const slot = this._ctx.view.getUint32(raw + CST_CHILDREN_OFFSET + index * 4, true);
    const hasLeadingSpaces = (slot & CST_HAS_LEADING_SPACES_FLAG) !== 0;
    const rawChild = slot & ~CST_HAS_LEADING_SPACES_FLAG;

    const {getSpacesLenAt} = this._ctx;
    const leadingSpacesLen =
      hasLeadingSpaces && getSpacesLenAt && this._hasParentSpaces(rawChild)
        ? Math.max(0, getSpacesLenAt(edgeStartIdx))
        : 0;

    return createHandle(rawChild, edgeStartIdx + leadingSpacesLen);
  }

  /**
   * Call `fn` with the node handle followed by its children.
   * Avoids allocation for nodes with up to 7 children.
   */
  withChildren<R>(handle: number, fn: (handle: number, ...children: number[]) => R): R {
    const count = this.childCount(handle);
    let edgeStartIdx = this.startIdx(handle);

    if (count < 8) {
      if (count === 0) return fn(handle);

      const c0 = this.childAt(handle, 0, edgeStartIdx);
      if (count === 1) return fn(handle, c0);

      edgeStartIdx = nextEdgePos(this, c0);
      const c1 = this.childAt(handle, 1, edgeStartIdx);
      if (count === 2) return fn(handle, c0, c1);

      edgeStartIdx = nextEdgePos(this, c1);
      const c2 = this.childAt(handle, 2, edgeStartIdx);
      if (count === 3) return fn(handle, c0, c1, c2);

      edgeStartIdx = nextEdgePos(this, c2);
      const c3 = this.childAt(handle, 3, edgeStartIdx);
      if (count === 4) return fn(handle, c0, c1, c2, c3);

      edgeStartIdx = nextEdgePos(this, c3);
      const c4 = this.childAt(handle, 4, edgeStartIdx);
      if (count === 5) return fn(handle, c0, c1, c2, c3, c4);

      edgeStartIdx = nextEdgePos(this, c4);
      const c5 = this.childAt(handle, 5, edgeStartIdx);
      if (count === 6) return fn(handle, c0, c1, c2, c3, c4, c5);

      edgeStartIdx = nextEdgePos(this, c5);
      const c6 = this.childAt(handle, 6, edgeStartIdx);
      return fn(handle, c0, c1, c2, c3, c4, c5, c6);
    }

    const children: number[] = [];
    for (let i = 0; i < count; i++) {
      const child = this.childAt(handle, i, edgeStartIdx);
      children.push(child);
      edgeStartIdx = nextEdgePos(this, child);
    }
    return fn(handle, ...children);
  }

  /**
   * Iterate over a list node in tuple-sized groups.
   * Avoids allocation for arities up to 3.
   */
  forEachTuple(handle: number, fn: (...children: number[]) => void): void {
    const arity = this.tupleArity(handle);
    if (arity <= 1) {
      this.forEachChild(handle, child => fn(child));
      return;
    }

    const count = this.childCount(handle);
    let edgeStartIdx = this.startIdx(handle);

    if (arity === 2) {
      for (let i = 0; i < count; i += 2) {
        const c0 = this.childAt(handle, i, edgeStartIdx);
        edgeStartIdx = nextEdgePos(this, c0);
        const c1 = this.childAt(handle, i + 1, edgeStartIdx);
        edgeStartIdx = nextEdgePos(this, c1);
        fn(c0, c1);
      }
      return;
    }

    if (arity === 3) {
      for (let i = 0; i < count; i += 3) {
        const c0 = this.childAt(handle, i, edgeStartIdx);
        edgeStartIdx = nextEdgePos(this, c0);
        const c1 = this.childAt(handle, i + 1, edgeStartIdx);
        edgeStartIdx = nextEdgePos(this, c1);
        const c2 = this.childAt(handle, i + 2, edgeStartIdx);
        edgeStartIdx = nextEdgePos(this, c2);
        fn(c0, c1, c2);
      }
      return;
    }

    const tuple = new Array<number>(arity);
    for (let i = 0; i < count; ) {
      for (let j = 0; j < arity; j++, i++) {
        const child = this.childAt(handle, i, edgeStartIdx);
        tuple[j] = child;
        edgeStartIdx = nextEdgePos(this, child);
      }
      fn(...tuple);
    }
  }

  /**
   * Whether the nonterminal at `handle` is a syntactic rule.
   * Uses cached metadata (ruleIsSyntactic), not string formatting.
   */
  isSyntactic(handle: number): boolean {
    const raw = rawHandle(handle);
    if (isTaggedTerminal(raw)) return false;
    const mrType = rawMatchRecordType(this._ctx.view, raw);
    if (mrType !== MatchRecordType.NONTERMINAL) return false;
    const ruleId = this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) >>> 2;
    return this._ctx.ruleIsSyntactic[ruleId];
  }

  /**
   * Evaluate the full spaces rule at `startIdx`, returning the children.
   * Handles memory.grow() refresh internally.
   * @internal
   */
  evalSpacesFull(startIdx: number): number {
    const {evalSpacesFull, memory} = this._ctx;
    if (!evalSpacesFull) return 0;
    const ptr = evalSpacesFull(startIdx);
    // Refresh the DataView in case evalSpacesFull triggered memory.grow().
    if (memory && this._ctx.view.buffer !== memory.buffer) {
      this._ctx.view = new DataView(memory.buffer);
    }
    return ptr;
  }

  /**
   * Check whether a raw child handle has parent-level space skipping.
   * Only NONTERMINAL and TERMINAL children may have leading spaces.
   */
  private _hasParentSpaces(rawChild: number): boolean {
    if (isTaggedTerminal(rawChild)) return true;
    const type = rawMatchRecordType(this._ctx.view, rawChild);
    return type === MatchRecordType.NONTERMINAL || type === MatchRecordType.TERMINAL;
  }

  /** Create a lazy CstNode wrapper for the given handle. */
  node(handle: number): CstNode {
    return checkNotNull(_nodeFactory.make)(this, handle, 0);
  }

  /** Create a lazy CstNode wrapper for the root, including leading spaces. */
  rootNode(): CstNode {
    return checkNotNull(_nodeFactory.make)(this, this.root, this.rootLeadingSpacesLen);
  }
}
