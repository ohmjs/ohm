import {
  isTaggedTerminal,
  MATCH_RECORD_TYPE_MASK,
  MatchRecordType,
} from './miniohm.ts';

import type {MatchContext, SucceededMatchResult} from './miniohm.ts';

export {MatchRecordType};

const HANDLE_BITS = 27;
const SHIFT = 2 ** HANDLE_BITS; // 134217728
const MASK = SHIFT - 1;         // 0x7FFFFFF

/** Sentinel value indicating no node (e.g. no leading spaces). */
export const NO_NODE = -1;

/**
 * Pack a raw CST handle and startIdx into a single Number handle.
 * Uses 53 of the available integer-precision bits in an IEEE 754 double
 * (27 bits for the pointer, 26 bits for startIdx). Accessor methods
 * (recordType, matchLength, etc.) transparently accept either a raw handle
 * or a handle with startIdx — they extract the low 27 bits via `& MASK`,
 * which is an identity operation for raw handles (< 2^27).
 */
export function pack(rawHandle: number, startIdx: number): number {
  return startIdx * SHIFT + rawHandle;
}

export function unpackHandle(handle: number): number {
  return handle & MASK;
}

export function unpackStartIdx(handle: number): number {
  const raw = handle & MASK;
  return (handle - raw) / SHIFT;
}

/**
 * Zero-allocation access to the CST stored in Wasm linear memory.
 *
 * Accessor methods (recordType, matchLength, childCount, ctorName, details)
 * accept either a raw handle or a handle with startIdx.
 *
 * forEachChild supports two calling conventions:
 *   - forEachChild(handle, startIdx, fn) — fn receives (handle, leadingSpaces, startIdx, i)
 *   - forEachChild(handle, fn)           — fn receives (handle, leadingSpaces, i),
 *     where handles have startIdx packed in (see pack()).
 *
 * $spaces children are filtered out; when present, the $spaces handle is
 * passed as `leadingSpaces` to the next non-$spaces child (NO_NODE / -1
 * otherwise).
 */
export class CstReader {
  /** @internal */
  private _ctx: MatchContext;
  /** @internal — precomputed ruleId for $spaces, or -1 if not found. */
  private _spacesRuleId: number;

  /** Handle for the root node (with startIdx packed in). */
  readonly root: number;
  /** Handle for leading $spaces before the root, or NO_NODE if none. */
  readonly rootLeadingSpaces: number;

  /** Raw handle for the root node (without startIdx). */
  get rootHandle(): number { return this.root & MASK; }
  /** startIdx for the root node. */
  get rootStartIdx(): number { return unpackStartIdx(this.root); }
  /** Raw handle for leading $spaces, or -1 if none. */
  get rootLeadingSpacesHandle(): number {
    return this.rootLeadingSpaces === NO_NODE ? -1 : this.rootLeadingSpaces & MASK;
  }

  /** @internal */
  constructor(
    ctx: MatchContext,
    root: number,
    rootLeadingSpaces: number
  ) {
    this._ctx = ctx;
    this.root = root;
    this.rootLeadingSpaces = rootLeadingSpaces;
    this._spacesRuleId = ctx.ruleNames.findIndex(
      n => n.split('<')[0] === '$spaces'
    );
  }

  /** Extract the startIdx from a handle. */
  startIdx(handle: number): number {
    return unpackStartIdx(handle);
  }

  /** The raw match record type (NONTERMINAL, TERMINAL, ITER_FLAG, or OPTIONAL). */
  recordType(handle: number): MatchRecordType {
    handle = handle & MASK;
    if (isTaggedTerminal(handle)) return MatchRecordType.TERMINAL;
    return (this._ctx.view.getInt32(handle + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
  }

  /** Number of raw children stored in this match record. */
  childCount(handle: number): number {
    handle = handle & MASK;
    if (isTaggedTerminal(handle)) return 0;
    return this._ctx.view.getUint32(handle, true);
  }

  /** Length of matched input (in UTF-16 code units). */
  matchLength(handle: number): number {
    handle = handle & MASK;
    if (isTaggedTerminal(handle)) return handle >>> 1;
    return this._ctx.view.getUint32(handle + 4, true);
  }

  /**
   * Constructor name. For nonterminals, the rule name (without parameterization).
   * For other types: '_terminal', '_iter', '_opt'.
   */
  ctorName(handle: number): string {
    handle = handle & MASK;
    if (isTaggedTerminal(handle)) return '_terminal';
    const type = (this._ctx.view.getInt32(handle + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
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
    handle = handle & MASK;
    if (isTaggedTerminal(handle)) return 0;
    return this._ctx.view.getInt32(handle + 8, true) >>> 2;
  }

  /** Handle (Wasm pointer) of the i-th raw child. */
  childAt(handle: number, i: number): number {
    handle = handle & MASK;
    return this._ctx.view.getUint32(handle + 16 + i * 4, true);
  }

  /** Source string for a node. If startIdx is omitted, it is extracted from the handle. */
  sourceString(handle: number, startIdx?: number): string {
    if (startIdx === undefined) {
      const raw = handle & MASK;
      startIdx = (handle - raw) / SHIFT;
      handle = raw;
    }
    return this._ctx.input.slice(startIdx, startIdx + this.matchLength(handle));
  }

  /** The full input string that was parsed. */
  get input(): string {
    return this._ctx.input;
  }

  /**
   * Iterate over visible children (filtering out $spaces). When a $spaces
   * child is found, its handle is passed as `leadingSpaces` to the next
   * non-$spaces child (NO_NODE / -1 otherwise).
   *
   * Two calling conventions:
   *   forEachChild(handle, startIdx, fn) — fn(handle, leadingSpaces, startIdx, i)
   *   forEachChild(handle, fn)           — fn(handle, leadingSpaces, i),
   *     where handles have startIdx packed in.
   */
  forEachChild(
    handle: number,
    startIdxOrFn:
      | number
      | ((child: number, leadingSpaces: number, index: number) => void),
    maybeFn?: (
      childHandle: number,
      leadingSpaces: number,
      childStartIdx: number,
      index: number
    ) => void
  ): number {
    if (typeof startIdxOrFn === 'function') {
      return this._forEachChildPacked(handle, startIdxOrFn);
    }
    return this._forEachChildRaw(handle, startIdxOrFn, maybeFn!);
  }

  private _forEachChildRaw(
    handle: number,
    startIdx: number,
    fn: (
      childHandle: number,
      leadingSpaces: number,
      childStartIdx: number,
      index: number
    ) => void
  ): number {
    if (isTaggedTerminal(handle)) return startIdx;
    const count = this._ctx.view.getUint32(handle, true);
    let childStart = startIdx;
    let pendingSpaces = -1;
    let visibleIndex = 0;
    for (let i = 0; i < count; i++) {
      const child = this._ctx.view.getUint32(handle + 16 + i * 4, true);
      const len = isTaggedTerminal(child)
        ? child >>> 1
        : this._ctx.view.getUint32(child + 4, true);
      if (
        !isTaggedTerminal(child) &&
        ((this._ctx.view.getInt32(child + 8, true) &
          MATCH_RECORD_TYPE_MASK) as MatchRecordType) ===
          MatchRecordType.NONTERMINAL
      ) {
        const ruleId = this._ctx.view.getInt32(child + 8, true) >>> 2;
        if (ruleId === this._spacesRuleId) {
          pendingSpaces = child;
          childStart += len;
          continue;
        }
      }
      fn(child, pendingSpaces, childStart, visibleIndex);
      pendingSpaces = -1;
      visibleIndex++;
      childStart += len;
    }
    return childStart;
  }

  private _forEachChildPacked(
    handle: number,
    fn: (child: number, leadingSpaces: number, index: number) => void
  ): number {
    const raw = handle & MASK;
    if (isTaggedTerminal(raw)) return handle;
    const count = this._ctx.view.getUint32(raw, true);
    let childStart = (handle - raw) / SHIFT;
    let pendingSpaces = NO_NODE;
    let visibleIndex = 0;
    for (let i = 0; i < count; i++) {
      const rawChild = this._ctx.view.getUint32(raw + 16 + i * 4, true);
      const childHandle = childStart * SHIFT + rawChild;
      const len = isTaggedTerminal(rawChild)
        ? rawChild >>> 1
        : this._ctx.view.getUint32(rawChild + 4, true);
      if (
        !isTaggedTerminal(rawChild) &&
        ((this._ctx.view.getInt32(rawChild + 8, true) &
          MATCH_RECORD_TYPE_MASK) as MatchRecordType) ===
          MatchRecordType.NONTERMINAL
      ) {
        const ruleId = this._ctx.view.getInt32(rawChild + 8, true) >>> 2;
        if (ruleId === this._spacesRuleId) {
          pendingSpaces = childHandle;
          childStart += len;
          continue;
        }
      }
      fn(childHandle, pendingSpaces, visibleIndex);
      pendingSpaces = NO_NODE;
      visibleIndex++;
      childStart += len;
    }
    return childStart;
  }
}

interface CreateReaderOptions {
  /** If true, handles include startIdx (see pack()). Default: false. */
  packStartIdx?: boolean;
}

export function createReader(
  result: SucceededMatchResult,
  options?: CreateReaderOptions
): CstReader {
  const exports = (result.grammar as any)._instance.exports;
  const ctx = result._ctx;
  const doPack = options?.packStartIdx ?? false;

  if (doPack) {
    const heapTop = exports.__offset.value;
    if (heapTop >= SHIFT) {
      throw new Error(
        `Wasm heap too large for CstReader: ${heapTop} bytes exceeds ${HANDLE_BITS}-bit limit (${SHIFT} bytes)`
      );
    }
    const startIdxLimit = 2 ** (53 - HANDLE_BITS);
    if (ctx.input.length >= startIdxLimit) {
      throw new Error(
        `Input too long for CstReader: ${ctx.input.length} chars exceeds ${53 - HANDLE_BITS}-bit limit (${startIdxLimit} chars)`
      );
    }
  }

  const firstPtr = exports.bindingsAt(0);
  const firstTypeAndDetails = ctx.view.getInt32(firstPtr + 8, true);
  const firstType = (firstTypeAndDetails &
    MATCH_RECORD_TYPE_MASK) as MatchRecordType;
  const firstRuleId = firstTypeAndDetails >>> 2;
  const firstName = ctx.ruleNames[firstRuleId]?.split('<')[0];

  const p = doPack ? pack : (h: number, _s: number) => h;
  if (firstType === MatchRecordType.NONTERMINAL && firstName === '$spaces') {
    const spacesMatchLength = ctx.view.getUint32(firstPtr + 4, true);
    return new CstReader(
      ctx,
      p(exports.bindingsAt(1), spacesMatchLength),
      p(firstPtr, 0)
    );
  }
  return new CstReader(ctx, p(firstPtr, 0), NO_NODE);
}
