import {isTaggedTerminal, MATCH_RECORD_TYPE_MASK, MatchRecordType} from './miniohm.ts';

import type {MatchContext, SucceededMatchResult} from './miniohm.ts';

const HANDLE_BITS = 27;
const SHIFT = 2 ** HANDLE_BITS; // 134217728
const MASK = SHIFT - 1; // 0x7FFFFFF

/**
 * Null handle — indicates no node (e.g. no leading spaces).
 * 0 is safe because heap allocations start from __heap_base (always > 0),
 * so no CST node pointer is ever 0.
 */
export const NULL_HANDLE = 0;

/**
 * Spaces handle encoding: (spacesLen << 2) | 0b10.
 * Bit 1 set, bit 0 clear — distinct from heap pointers (low 2 bits = 00)
 * and tagged terminals (bit 0 = 1).
 *
 * In packed mode, startIdx is embedded in the upper bits just like other
 * handles: startIdx * SHIFT + rawSpacesHandle.
 *
 * These are internal — consumers use the normal accessor methods on CstReader.
 */
function makeSpacesHandle(spacesLen: number): number {
  return (spacesLen << 2) | 2;
}

function isSpacesHandle(raw: number): boolean {
  return (raw & 3) === 2;
}

/**
 * Pack a raw CST handle and startIdx into a single Number handle.
 * Uses 53 of the available integer-precision bits in an IEEE 754 double
 * (27 bits for the pointer, 26 bits for startIdx). Accessor methods
 * (isTerminal, matchLength, etc.) transparently accept either a raw handle
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
 * Accessor methods (isTerminal, matchLength, childCount, ctorName, details)
 * accept either a raw handle or a handle with startIdx.
 *
 * forEachChild(handle, fn) iterates visible children. The callback receives
 * (childHandle, leadingSpaces, pos, index). leadingSpaces is a handle for
 * the leading spaces node (use accessor methods to inspect), or NULL_HANDLE
 * if none.
 */
export class CstReader {
  /** @internal */
  private _ctx: MatchContext;
  /** @internal — whether handles have startIdx packed in. */
  private _packed: boolean;

  /** Handle for the root node (with startIdx packed in if packStartIdx was set). */
  readonly root: number;
  /** Handle for leading spaces before the root, or NULL_HANDLE if none. */
  readonly rootLeadingSpaces: number;

  /** Raw handle for the root node (without startIdx). */
  get rootHandle(): number {
    return this.root & MASK;
  }
  /** startIdx for the root node. */
  get rootStartIdx(): number {
    return unpackStartIdx(this.root);
  }

  /** @internal */
  constructor(ctx: MatchContext, root: number, rootLeadingSpaces: number, packed: boolean) {
    this._ctx = ctx;
    this.root = root;
    this.rootLeadingSpaces = rootLeadingSpaces;
    this._packed = packed;
  }

  /** Extract the startIdx from a handle. */
  startIdx(handle: number): number {
    return unpackStartIdx(handle);
  }

  isTerminal(handle: number): boolean {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return false;
    if (isTaggedTerminal(raw)) return true;
    return (
      ((this._ctx.view.getInt32(raw + 8, true) &
        MATCH_RECORD_TYPE_MASK) as MatchRecordType) === MatchRecordType.TERMINAL
    );
  }

  isNonterminal(handle: number): boolean {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return true;
    if (isTaggedTerminal(raw)) return false;
    return (
      ((this._ctx.view.getInt32(raw + 8, true) &
        MATCH_RECORD_TYPE_MASK) as MatchRecordType) === MatchRecordType.NONTERMINAL
    );
  }

  isList(handle: number): boolean {
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return false;
    return (
      ((this._ctx.view.getInt32(raw + 8, true) &
        MATCH_RECORD_TYPE_MASK) as MatchRecordType) === MatchRecordType.ITER_FLAG
    );
  }

  isOptional(handle: number): boolean {
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return false;
    return (
      ((this._ctx.view.getInt32(raw + 8, true) &
        MATCH_RECORD_TYPE_MASK) as MatchRecordType) === MatchRecordType.OPTIONAL
    );
  }

  /** Number of raw children stored in this match record. */
  childCount(handle: number): number {
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return 0;
    return this._ctx.view.getUint32(raw, true);
  }

  /** Length of matched input (in UTF-16 code units). */
  matchLength(handle: number): number {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return raw >>> 2;
    if (isTaggedTerminal(raw)) return raw >>> 1;
    return this._ctx.view.getUint32(raw + 4, true);
  }

  /**
   * Constructor name. For nonterminals, the rule name (without parameterization).
   * For other types: '_terminal', '_list', '_opt'.
   */
  ctorName(handle: number): string {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return 'spaces';
    if (isTaggedTerminal(raw)) return '_terminal';
    const type = (this._ctx.view.getInt32(raw + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    if (type === MatchRecordType.NONTERMINAL) {
      const ruleId = this._ctx.view.getInt32(raw + 8, true) >>> 2;
      return this._ctx.ruleNames[ruleId].split('<')[0];
    }
    if (type === MatchRecordType.TERMINAL) return '_terminal';
    if (type === MatchRecordType.ITER_FLAG) return '_list';
    return '_opt';
  }

  /**
   * Upper bits of typeAndDetails. For NONTERMINAL: the ruleId.
   * For ITER_FLAG: the arity (children per iteration).
   */
  details(handle: number): number {
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return 0;
    return this._ctx.view.getInt32(raw + 8, true) >>> 2;
  }

  /** Handle (Wasm pointer) of the i-th raw child. */
  childAt(handle: number, i: number): number {
    const raw = handle & MASK;
    return this._ctx.view.getUint32(raw + 16 + i * 4, true);
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
   * Iterate over children. The callback receives (childHandle, leadingSpaces,
   * pos, index). leadingSpaces is a handle for the leading spaces node
   * (works with accessor methods like matchLength, ctorName, sourceString),
   * or NULL_HANDLE (0) if none.
   *
   * The meaning of `pos` depends on the mode:
   *   - Raw mode: offset from the parent's start position.
   *     `parentStartIdx` is the parent's absolute position, needed to
   *     query the memo table for spaces lengths.
   *   - Packed mode: the child's absolute startIdx (parentStartIdx is
   *     ignored since startIdx is embedded in the handle).
   */
  forEachChild(
    handle: number,
    fn: (child: number, leadingSpaces: number, pos: number, index: number) => void,
    parentStartIdx = 0
  ): void {
    if (this._packed) {
      this._forEachChildPacked(handle, fn);
    } else {
      this._forEachChildRaw(handle, parentStartIdx, fn);
    }
  }

  /** Check whether a raw child handle has parent-level space skipping. */
  private _hasParentSpaces(rawChild: number): boolean {
    if (isTaggedTerminal(rawChild)) return true;
    const type = (this._ctx.view.getInt32(rawChild + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    return type === MatchRecordType.NONTERMINAL || type === MatchRecordType.TERMINAL;
  }

  private _forEachChildRaw(
    handle: number,
    parentStartIdx: number,
    fn: (child: number, leadingSpaces: number, offset: number, index: number) => void
  ): void {
    if (isTaggedTerminal(handle)) return;
    const count = this._ctx.view.getUint32(handle, true);
    const {getSpacesLenAt} = this._ctx;
    let offset = 0;
    for (let i = 0; i < count; i++) {
      const child = this._ctx.view.getUint32(handle + 16 + i * 4, true);
      const rawSpacesLen =
        getSpacesLenAt && this._hasParentSpaces(child)
          ? Math.max(0, getSpacesLenAt(parentStartIdx + offset))
          : 0;
      const leadingSpaces = rawSpacesLen > 0 ? makeSpacesHandle(rawSpacesLen) : 0;
      offset += rawSpacesLen;
      const len = isTaggedTerminal(child)
        ? child >>> 1
        : this._ctx.view.getUint32(child + 4, true);
      fn(child, leadingSpaces, offset, i);
      offset += len;
    }
  }

  private _forEachChildPacked(
    handle: number,
    fn: (child: number, leadingSpaces: number, pos: number, index: number) => void
  ): void {
    const raw = handle & MASK;
    if (isTaggedTerminal(raw)) return;
    const count = this._ctx.view.getUint32(raw, true);
    let childStart = (handle - raw) / SHIFT;
    const {getSpacesLenAt} = this._ctx;
    for (let i = 0; i < count; i++) {
      const rawChild = this._ctx.view.getUint32(raw + 16 + i * 4, true);
      const rawSpacesLen =
        getSpacesLenAt && this._hasParentSpaces(rawChild)
          ? Math.max(0, getSpacesLenAt(childStart))
          : 0;
      // Pack the spaces handle with startIdx so sourceString() works.
      const spacesStartIdx = childStart;
      const leadingSpaces =
        rawSpacesLen > 0 ? spacesStartIdx * SHIFT + makeSpacesHandle(rawSpacesLen) : 0;
      childStart += rawSpacesLen;
      const childHandle = childStart * SHIFT + rawChild;
      const len = isTaggedTerminal(rawChild)
        ? rawChild >>> 1
        : this._ctx.view.getUint32(rawChild + 4, true);
      fn(childHandle, leadingSpaces, childStart, i);
      childStart += len;
    }
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

  const spacesLen = Math.max(0, exports.getSpacesLenAt(0));
  const rootPtr = exports.bindingsAt(0);
  const p = doPack ? pack : (h: number, _s: number) => h;
  // Pack the spaces handle with startIdx=0 (root leading spaces always start at 0).
  const rootLeadingSpaces =
    spacesLen > 0 ? (doPack ? 0 * SHIFT + makeSpacesHandle(spacesLen) : makeSpacesHandle(spacesLen)) : 0;
  return new CstReader(ctx, p(rootPtr, spacesLen), rootLeadingSpaces, doPack);
}
