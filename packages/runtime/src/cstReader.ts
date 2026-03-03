import {
  isTaggedTerminal,
  MATCH_RECORD_TYPE_MASK,
  MatchRecordType,
} from './miniohm.ts';

import type {MatchContext, SucceededMatchResult} from './miniohm.ts';

export {MatchRecordType};

/**
 * Zero-allocation access to the CST stored in Wasm linear memory.
 * Instead of allocating CstNode objects, use integer handles (Wasm pointers)
 * and accessor methods to read node fields directly from the DataView.
 */
export class CstReader {
  /** @internal */
  private _ctx: MatchContext;

  readonly rootHandle: number;
  readonly rootStartIdx: number;
  /** Handle of a leading $spaces node before the root, or -1 if none. */
  readonly rootLeadingSpacesHandle: number;

  /** @internal */
  constructor(
    ctx: MatchContext,
    rootHandle: number,
    rootStartIdx: number,
    rootLeadingSpacesHandle: number
  ) {
    this._ctx = ctx;
    this.rootHandle = rootHandle;
    this.rootStartIdx = rootStartIdx;
    this.rootLeadingSpacesHandle = rootLeadingSpacesHandle;
  }

  /** The raw match record type (NONTERMINAL, TERMINAL, ITER_FLAG, or OPTIONAL). */
  recordType(handle: number): MatchRecordType {
    if (isTaggedTerminal(handle)) return MatchRecordType.TERMINAL;
    return (this._ctx.view.getInt32(handle + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
  }

  /** Number of raw children stored in this match record. */
  childCount(handle: number): number {
    if (isTaggedTerminal(handle)) return 0;
    return this._ctx.view.getUint32(handle, true);
  }

  /** Length of matched input (in UTF-16 code units). */
  matchLength(handle: number): number {
    if (isTaggedTerminal(handle)) return handle >>> 1;
    return this._ctx.view.getUint32(handle + 4, true);
  }

  /**
   * Constructor name. For nonterminals, the rule name (without parameterization).
   * For other types: '_terminal', '_iter', '_opt'.
   */
  ctorName(handle: number): string {
    if (isTaggedTerminal(handle)) return '_terminal';
    const type = this.recordType(handle);
    if (type === MatchRecordType.NONTERMINAL) {
      const ruleId = this._ctx.view.getInt32(handle + 8, true) >>> 2;
      return this._ctx.ruleNames[ruleId].split('<')[0];
    }
    if (type === MatchRecordType.TERMINAL) return '_terminal';
    if (type === MatchRecordType.ITER_FLAG) return '_iter';
    return '_opt';
  }

  /**
   * Upper bits of typeAndDetails. For NONTERMINAL: the ruleId.
   * For ITER_FLAG: the arity (children per iteration).
   */
  details(handle: number): number {
    if (isTaggedTerminal(handle)) return 0;
    return this._ctx.view.getInt32(handle + 8, true) >>> 2;
  }

  /** Handle (Wasm pointer) of the i-th raw child. */
  childAt(handle: number, i: number): number {
    return this._ctx.view.getUint32(handle + 16 + i * 4, true);
  }

  /** Source string for a node. Caller must supply startIdx. */
  sourceString(handle: number, startIdx: number): string {
    return this._ctx.input.slice(startIdx, startIdx + this.matchLength(handle));
  }

  /** The full input string that was parsed. */
  get input(): string {
    return this._ctx.input;
  }

  /**
   * Iterate over raw children. Computes startIdx for each child by
   * accumulating matchLength. Does NOT filter $spaces or synthesize
   * wrapper nodes. Returns the endIdx (startIdx after the last child).
   */
  forEachChild(
    handle: number,
    startIdx: number,
    fn: (childHandle: number, childStartIdx: number, index: number) => void
  ): number {
    const count = this.childCount(handle);
    let childStart = startIdx;
    for (let i = 0; i < count; i++) {
      const child = this.childAt(handle, i);
      fn(child, childStart, i);
      childStart += this.matchLength(child);
    }
    return childStart;
  }

  /**
   * Like forEachChild, but filters out $spaces children. When a $spaces
   * child is found, its handle is passed as `leadingSpacesHandle` to the
   * callback for the next non-$spaces child. Returns the endIdx.
   */
  forEachVisibleChild(
    handle: number,
    startIdx: number,
    fn: (
      childHandle: number,
      childStartIdx: number,
      index: number,
      leadingSpacesHandle: number
    ) => void
  ): number {
    const count = this.childCount(handle);
    let childStart = startIdx;
    let pendingSpaces = -1;
    let visibleIndex = 0;
    for (let i = 0; i < count; i++) {
      const child = this.childAt(handle, i);
      if (
        this.recordType(child) === MatchRecordType.NONTERMINAL &&
        this.ctorName(child) === '$spaces'
      ) {
        pendingSpaces = child;
      } else {
        fn(child, childStart, visibleIndex, pendingSpaces);
        pendingSpaces = -1;
        visibleIndex++;
      }
      childStart += this.matchLength(child);
    }
    return childStart;
  }
}

export function createReader(result: SucceededMatchResult): CstReader {
  const exports = (result.grammar as any)._instance.exports;
  const ctx = result._ctx;

  const firstPtr = exports.bindingsAt(0);
  const firstTypeAndDetails = ctx.view.getInt32(firstPtr + 8, true);
  const firstType = (firstTypeAndDetails & MATCH_RECORD_TYPE_MASK) as MatchRecordType;
  const firstRuleId = firstTypeAndDetails >>> 2;
  const firstName = ctx.ruleNames[firstRuleId]?.split('<')[0];

  if (firstType === MatchRecordType.NONTERMINAL && firstName === '$spaces') {
    const spacesMatchLength = ctx.view.getUint32(firstPtr + 4, true);
    return new CstReader(ctx, exports.bindingsAt(1), spacesMatchLength, firstPtr);
  }
  return new CstReader(ctx, firstPtr, 0, -1);
}
