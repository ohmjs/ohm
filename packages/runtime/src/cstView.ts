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
 * Special kind values for non-nonterminal nodes.
 * For nonterminal nodes, `kind()` returns the rule name (a string).
 */
export const CstKind = {
  Terminal: '_terminal',
  List: '_list',
  Optional: '_opt',
  Spaces: 'spaces',
} as const;

export type CstKindValue = (typeof CstKind)[keyof typeof CstKind];
export type CstKind = CstKindValue | string;

/**
 * Spaces handle encoding: (spacesLen << 2) | 0b10.
 * Bit 1 set, bit 0 clear — distinct from heap pointers (low 2 bits = 00)
 * and tagged terminals (bit 0 = 1).
 *
 * In packed mode, startIdx is embedded in the upper bits just like other
 * handles: startIdx * SHIFT + rawSpacesHandle.
 *
 * These are internal — consumers use the normal accessor methods on CstView.
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
 * All handles have startIdx packed in.
 *
 * Use `kind(handle)` to get the node kind — returns the rule name for
 * nonterminals, or a CstKind constant for other node types.
 */
export class CstView {
  /** @internal */
  private _ctx: MatchContext;
  /** @internal — precomputed rule ctor names (without parameterization). */
  private _ruleCtorNames: string[];

  /** Handle for the root node (with startIdx packed in). */
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
  constructor(
    ctx: MatchContext,
    root: number,
    rootLeadingSpaces: number,
    ruleCtorNames: string[]
  ) {
    this._ctx = ctx;
    this.root = root;
    this.rootLeadingSpaces = rootLeadingSpaces;
    this._ruleCtorNames = ruleCtorNames;
  }

  /** Create a CstView from a successful match result. */
  static from(result: SucceededMatchResult): CstView {
    const exports = (result.grammar as any)._instance.exports;
    const ctx = result._ctx;

    const heapTop = exports.__offset.value;
    if (heapTop >= SHIFT) {
      throw new Error(
        `Wasm heap too large for CstView: ${heapTop} bytes exceeds ${HANDLE_BITS}-bit limit (${SHIFT} bytes)`
      );
    }
    const startIdxLimit = 2 ** (53 - HANDLE_BITS);
    if (ctx.input.length >= startIdxLimit) {
      throw new Error(
        `Input too long for CstView: ${ctx.input.length} chars exceeds ${53 - HANDLE_BITS}-bit limit (${startIdxLimit} chars)`
      );
    }

    const ruleCtorNames = (result.grammar as any)._ruleCtorNames as string[];

    const spacesLen = Math.max(0, exports.getSpacesLenAt(0));
    const rootPtr = exports.bindingsAt(0);
    const rootLeadingSpaces = spacesLen > 0 ? 0 * SHIFT + makeSpacesHandle(spacesLen) : 0;
    return new CstView(ctx, pack(rootPtr, spacesLen), rootLeadingSpaces, ruleCtorNames);
  }

  /** Extract the startIdx from a handle. */
  startIdx(handle: number): number {
    return unpackStartIdx(handle);
  }

  /**
   * Node kind. Returns the rule name (without parameterization) for
   * nonterminals, or one of the CstKind constants ('_terminal', '_list',
   * '_opt', 'spaces') for other node types.
   */
  kind(handle: number): CstKind {
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return CstKind.Spaces;
    if (isTaggedTerminal(raw)) return CstKind.Terminal;
    const type = (this._ctx.view.getInt32(raw + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    switch (type) {
      case MatchRecordType.NONTERMINAL: {
        const ruleId = this._ctx.view.getInt32(raw + 8, true) >>> 2;
        return this._ruleCtorNames[ruleId];
      }
      case MatchRecordType.TERMINAL:
        return CstKind.Terminal;
      case MatchRecordType.ITER_FLAG:
        return CstKind.List;
      case MatchRecordType.OPTIONAL:
        return CstKind.Optional;
    }
  }

  /** Children per list item. Only valid when kind() === CstKind.List. */
  listArity(handle: number): number {
    const raw = handle & MASK;
    return this._ctx.view.getInt32(raw + 8, true) >>> 2;
  }

  /**
   * Iterate list items grouped by arity. The callback receives the child
   * handles for one iteration as arguments.
   * Only valid when kind() === CstKind.List.
   */
  mapList<T>(handle: number, cb: (...itemChildren: number[]) => T): T[] {
    const arity = this.listArity(handle);
    const results: T[] = [];
    if (arity <= 1) {
      this.forEachChild(handle, child => {
        results.push(cb(child));
      });
    } else {
      const group: number[] = [];
      this.forEachChild(handle, child => {
        group.push(child);
        if (group.length === arity) {
          results.push(cb(...group));
          group.length = 0;
        }
      });
    }
    return results;
  }

  /**
   * Unwrap an optional node. If present, calls `present` with the children.
   * If absent, calls `absent` (or returns undefined).
   * Only valid when kind() === CstKind.Optional.
   */
  mapOpt<T>(
    handle: number,
    present: (...children: number[]) => T,
    absent?: () => T
  ): T | undefined {
    const count = this.childCount(handle);
    if (count === 0) {
      return absent ? absent() : undefined;
    }
    const children: number[] = [];
    this.forEachChild(handle, child => {
      children.push(child);
    });
    return present(...children);
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

  /** Source string for a node. startIdx is extracted from the handle. */
  sourceString(handle: number): string {
    const raw = handle & MASK;
    const si = (handle - raw) / SHIFT;
    return this._ctx.input.slice(si, si + this.matchLength(raw));
  }

  /** The full input string that was parsed. */
  get input(): string {
    return this._ctx.input;
  }

  /**
   * Iterate over children. The callback receives (childHandle, leadingSpaces,
   * pos, index). leadingSpaces is a handle for the leading spaces node
   * (works with accessor methods like matchLength, ctorName, sourceString),
   * or NULL_HANDLE (0) if none. `pos` is the child's absolute startIdx.
   */
  forEachChild(
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

  /** Check whether a raw child handle has parent-level space skipping. */
  private _hasParentSpaces(rawChild: number): boolean {
    if (isTaggedTerminal(rawChild)) return true;
    const type = (this._ctx.view.getInt32(rawChild + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    return type === MatchRecordType.NONTERMINAL || type === MatchRecordType.TERMINAL;
  }
}
