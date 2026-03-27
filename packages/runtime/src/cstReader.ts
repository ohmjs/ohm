import {
  CST_CHILD_COUNT_OFFSET,
  CST_CHILDREN_OFFSET,
  CST_MATCH_LENGTH_OFFSET,
  CST_TYPE_AND_DETAILS_OFFSET,
  CstNodeType,
  isTaggedTerminal,
  MATCH_RECORD_TYPE_MASK,
  MatchRecordType,
  NODE_CHILDREN_SYNTACTIC_FLAG,
  NODE_DETAILS_SHIFT,
} from './miniohm.ts';

import type {MatchContext, SucceededMatchResult} from './miniohm.ts';

export {CstNodeType};

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
 * startIdx is embedded in the upper bits just like other handles:
 * startIdx * SHIFT + rawSpacesHandle.
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
 * (isTerminal, matchLength, etc.) extract the low 27 bits via `& MASK`.
 */
function pack(rawHandle: number, startIdx: number): number {
  return startIdx * SHIFT + rawHandle;
}

function unpackStartIdx(handle: number): number {
  const raw = handle & MASK;
  return (handle - raw) / SHIFT;
}

/**
 * Zero-allocation access to the CST stored in Wasm linear memory.
 *
 * Handles have startIdx packed in the upper bits. Accessor methods
 * (isTerminal, matchLength, childCount, ctorName, details) extract
 * the raw pointer via `& MASK`.
 *
 * forEachChild(handle, fn) iterates visible children. The callback receives
 * (childHandle, leadingSpaces, startIdx, index). leadingSpaces is a handle
 * for the leading spaces node (use accessor methods to inspect), or
 * NULL_HANDLE if none.
 */
export class CstReader {
  /** @internal */
  private _ctx: MatchContext;

  /** Handle for the root node (with startIdx packed in). */
  readonly root: number;
  /** Handle for leading spaces before the root, or NULL_HANDLE if none. */
  readonly rootLeadingSpaces: number;

  /** @internal */
  constructor(ctx: MatchContext, root: number, rootLeadingSpaces: number) {
    this._ctx = ctx;
    this.root = root;
    this.rootLeadingSpaces = rootLeadingSpaces;
  }

  /** Extract the startIdx from a handle. */
  startIdx(handle: number): number {
    return unpackStartIdx(handle);
  }

  /** Node type: NONTERMINAL, TERMINAL, LIST, or OPT. */
  type(handle: number): CstNodeType {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return CstNodeType.NONTERMINAL;
    if (isTaggedTerminal(raw)) return CstNodeType.TERMINAL;
    const mrType = (this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    if (mrType === MatchRecordType.NONTERMINAL) return CstNodeType.NONTERMINAL;
    if (mrType === MatchRecordType.TERMINAL) return CstNodeType.TERMINAL;
    if (mrType === MatchRecordType.ITER_FLAG) return CstNodeType.LIST;
    return CstNodeType.OPT;
  }

  /** Number of raw children stored in this match record. */
  childCount(handle: number): number {
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return 0;
    return this._ctx.view.getUint32(raw + CST_CHILD_COUNT_OFFSET, true);
  }

  /** Length of matched input (in UTF-16 code units). */
  matchLength(handle: number): number {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return raw >>> 2;
    if (isTaggedTerminal(raw)) return raw >>> 1;
    return this._ctx.view.getUint32(raw + CST_MATCH_LENGTH_OFFSET, true);
  }

  /**
   * Constructor name. For nonterminals, the rule name (without parameterization).
   * For other types: '_terminal', '_list', '_opt'.
   */
  ctorName(handle: number): string {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return 'spaces';
    if (isTaggedTerminal(raw)) return '_terminal';
    const type = (this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    if (type === MatchRecordType.NONTERMINAL) {
      const ruleId =
        this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) >>>
        NODE_DETAILS_SHIFT;
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
    return (
      this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true) >>> NODE_DETAILS_SHIFT
    );
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

  /**
   * Iterate over children. The callback receives (childHandle, leadingSpaces,
   * startIdx, index). childHandle and leadingSpaces have startIdx packed in,
   * so sourceString() and startIdx() work on them directly.
   */
  forEachChild(
    handle: number,
    fn: (child: number, leadingSpaces: number, startIdx: number, index: number) => void
  ): void {
    const raw = handle & MASK;
    if (isTaggedTerminal(raw)) return;
    const count = this._ctx.view.getUint32(raw + CST_CHILD_COUNT_OFFSET, true);
    let childStart = (handle - raw) / SHIFT;
    const {getSpacesLenAt} = this._ctx;

    // Read the childrenAreSyntactic bit from the parent node header.
    const typeAndDetails = this._ctx.view.getInt32(raw + CST_TYPE_AND_DETAILS_OFFSET, true);
    const childrenAreSyntactic = (typeAndDetails & NODE_CHILDREN_SYNTACTIC_FLAG) !== 0;

    for (let i = 0; i < count; i++) {
      const childWord = this._ctx.view.getUint32(raw + CST_CHILDREN_OFFSET + i * 4, true);

      // Extract per-edge parentSpacesAllowed flag from child word.
      const parentSpacesAllowed = (childWord & 0b10) !== 0;

      // Decode child word to raw handle.
      let rawChild: number;
      let len: number;
      if (childWord & 1) {
        // Terminal child word: (matchLength << 2) | flags
        len = childWord >>> 2;
        rawChild = (len << 1) | 1; // Convert to public tagged terminal format
      } else {
        // Pointer child word: ptr | flags
        rawChild = childWord & ~3;
        len = this._ctx.view.getUint32(rawChild + CST_MATCH_LENGTH_OFFSET, true);
      }

      // Look up spaces only if both node bit and edge flag are set.
      const rawSpacesLen =
        getSpacesLenAt && childrenAreSyntactic && parentSpacesAllowed
          ? Math.max(0, getSpacesLenAt(childStart))
          : 0;
      // Pack the spaces handle with startIdx so sourceString() works.
      const spacesStartIdx = childStart;
      const leadingSpaces =
        rawSpacesLen > 0 ? spacesStartIdx * SHIFT + makeSpacesHandle(rawSpacesLen) : 0;
      childStart += rawSpacesLen;
      const childHandle = childStart * SHIFT + rawChild;
      fn(childHandle, leadingSpaces, childStart, i);
      childStart += len;
    }
  }
}

export function createReader(result: SucceededMatchResult): CstReader {
  const exports = (result.grammar as any)._instance.exports;
  const ctx = result._ctx;

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

  const spacesLen = Math.max(0, exports.getSpacesLenAt(0));
  const rootPtr = exports.bindingsAt(0);
  const rootLeadingSpaces = spacesLen > 0 ? 0 * SHIFT + makeSpacesHandle(spacesLen) : 0;
  return new CstReader(ctx, pack(rootPtr, spacesLen), rootLeadingSpaces);
}
