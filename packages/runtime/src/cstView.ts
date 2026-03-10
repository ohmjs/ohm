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
 * (27 bits for the pointer, 26 bits for startIdx).
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
  /** @internal — mutable cursor used by _decodeChild to avoid allocation. */
  private _pos = 0;

  /** Handle for the root node (with startIdx packed in). */
  readonly root: number;
  /** Handle for leading spaces before the root, or NULL_HANDLE if none. */
  readonly rootLeadingSpaces: number;

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
    this._checkNull(handle);
    return unpackStartIdx(handle);
  }

  /**
   * Node kind. Returns the rule name (without parameterization) for
   * nonterminals, or one of the CstKind constants ('_terminal', '_list',
   * '_opt', 'spaces') for other node types.
   */
  kind(handle: number): CstKind {
    this._checkNull(handle);
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

  /**
   * Iterate over logical groups. Works for both list and optional nodes.
   *
   * - List (`_list`): groups children by the list's arity and calls `cb`
   *   per group.
   * - Optional (`_opt`): all children form a single group. Calls `cb`
   *   once if present, not at all if absent.
   */
  forEachGroup(handle: number, cb: (...children: number[]) => void): void {
    this._checkNull(handle);
    const k = this.kind(handle);
    if (k !== CstKind.List && k !== CstKind.Optional) {
      throw new Error(
        `forEachGroup() is only valid for list and optional nodes, got ${k}`
      );
    }
    const raw = handle & MASK;
    const count = this._ctx.view.getUint32(raw, true);
    if (count === 0) return;

    const type = (this._ctx.view.getInt32(raw + 8, true) &
      MATCH_RECORD_TYPE_MASK) as MatchRecordType;
    // For lists, arity is in the details field; for optionals, all children are one group.
    const arity =
      type === MatchRecordType.ITER_FLAG
        ? this._ctx.view.getInt32(raw + 8, true) >>> 2
        : count;

    const savedPos = this._pos;
    this._pos = (handle - raw) / SHIFT;
    try {
      // Stream groups directly — fast paths for common arities.
      // Decode all children in a group before calling cb, then
      // save/restore _pos around the callback for reentrancy safety.
      switch (arity) {
        case 1:
          for (let i = 0; i < count; i++) {
            const c0 = this._decodeChild(raw, i);
            const p = this._pos; cb(c0); this._pos = p;
          }
          break;
        case 2:
          for (let i = 0; i < count; i += 2) {
            const c0 = this._decodeChild(raw, i), c1 = this._decodeChild(raw, i + 1);
            const p = this._pos; cb(c0, c1); this._pos = p;
          }
          break;
        case 3:
          for (let i = 0; i < count; i += 3) {
            const c0 = this._decodeChild(raw, i), c1 = this._decodeChild(raw, i + 1),
              c2 = this._decodeChild(raw, i + 2);
            const p = this._pos; cb(c0, c1, c2); this._pos = p;
          }
          break;
        case 4:
          for (let i = 0; i < count; i += 4) {
            const c0 = this._decodeChild(raw, i), c1 = this._decodeChild(raw, i + 1),
              c2 = this._decodeChild(raw, i + 2), c3 = this._decodeChild(raw, i + 3);
            const p = this._pos; cb(c0, c1, c2, c3); this._pos = p;
          }
          break;
        default: {
          const args = new Array<number>(arity);
          for (let i = 0; i < count; i += arity) {
            for (let j = 0; j < arity; j++) args[j] = this._decodeChild(raw, i + j);
            const p = this._pos; cb.apply(undefined, args); this._pos = p;
          }
        }
      }
    } finally {
      this._pos = savedPos;
    }
  }

  /**
   * Unpack a node's children into the callback arguments.
   *
   * For nonterminals: always calls `cb` with all children (even if zero),
   * returns the result.
   * For optionals: calls `cb` once if present (returns `T`), or returns
   * `undefined` if absent.
   *
   * Not valid for terminals or lists — use `sourceString` for terminals
   * and `forEachGroup` for lists.
   *
   * Zero-allocation for nodes with up to 6 children. For zero-allocation
   * traversal of any arity, use `forEachChild` directly.
   */
  unpack<T>(handle: number, cb: (...children: number[]) => T): T | undefined {
    this._checkNull(handle);
    const k = this.kind(handle);
    if (k === CstKind.Terminal || k === CstKind.Spaces) {
      throw new Error(`unpack() is not valid for ${k} nodes; use sourceString() instead`);
    }
    if (k === CstKind.List) {
      throw new Error(`unpack() is not valid for list nodes; use forEachGroup() instead`);
    }
    const raw = handle & MASK;
    const count = this._ctx.view.getUint32(raw, true);
    // For optionals, absent means no callback.
    if (k === CstKind.Optional && count === 0) return undefined;
    if (cb.length > count) {
      throw new Error(
        `unpack(): callback expects ${cb.length} args but ${k} has ${count} children`
      );
    }
    this._pos = (handle - raw) / SHIFT;
    // Fast paths for common arities — no array allocation.
    switch (count) {
      case 0: return (cb as () => T)();
      case 1: return (cb as any)(this._decodeChild(raw, 0));
      case 2: return (cb as any)(this._decodeChild(raw, 0), this._decodeChild(raw, 1));
      case 3: return (cb as any)(
        this._decodeChild(raw, 0), this._decodeChild(raw, 1),
        this._decodeChild(raw, 2));
      case 4: return (cb as any)(
        this._decodeChild(raw, 0), this._decodeChild(raw, 1),
        this._decodeChild(raw, 2), this._decodeChild(raw, 3));
      case 5: return (cb as any)(
        this._decodeChild(raw, 0), this._decodeChild(raw, 1),
        this._decodeChild(raw, 2), this._decodeChild(raw, 3),
        this._decodeChild(raw, 4));
      case 6: return (cb as any)(
        this._decodeChild(raw, 0), this._decodeChild(raw, 1),
        this._decodeChild(raw, 2), this._decodeChild(raw, 3),
        this._decodeChild(raw, 4), this._decodeChild(raw, 5));
      default: {
        const children = new Array<number>(count);
        for (let i = 0; i < count; i++) children[i] = this._decodeChild(raw, i);
        return cb.apply(undefined, children);
      }
    }
  }

  /**
   * Return the only child of a wrapper nonterminal. Throws if the node
   * doesn't have exactly one child.
   */
  onlyChild(handle: number): number {
    const raw = handle & MASK;
    const count = this._ctx.view.getUint32(raw, true);
    if (count !== 1) {
      throw new Error(
        `onlyChild(): expected 1 child, got ${count} (kind: ${this.kind(handle)})`
      );
    }
    this._pos = (handle - raw) / SHIFT;
    return this._decodeChild(raw, 0);
  }

  /** Number of raw children stored in this match record. */
  childCount(handle: number): number {
    this._checkNull(handle);
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return 0;
    return this._ctx.view.getUint32(raw, true);
  }

  /** Length of matched input (in UTF-16 code units). */
  matchLength(handle: number): number {
    this._checkNull(handle);
    const raw = handle & MASK;
    if (isSpacesHandle(raw)) return raw >>> 2;
    if (isTaggedTerminal(raw)) return raw >>> 1;
    return this._ctx.view.getUint32(raw + 4, true);
  }

  /** Source string for a node. startIdx is extracted from the handle. */
  sourceString(handle: number): string {
    this._checkNull(handle);
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
   * (works with accessor methods like matchLength, kind, sourceString),
   * or NULL_HANDLE (0) if none. `pos` is the child's absolute startIdx.
   */
  forEachChild(
    handle: number,
    fn: (child: number, leadingSpaces: number, pos: number, index: number) => void
  ): void {
    this._checkNull(handle);
    const raw = handle & MASK;
    if (isSpacesHandle(raw) || isTaggedTerminal(raw)) return;
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

  /**
   * @internal — decode child at slot `i` of raw pointer `raw`.
   * Reads and advances `this._pos`. Must be called sequentially for i = 0, 1, 2, ...
   */
  private _decodeChild(raw: number, i: number): number {
    const rawChild = this._ctx.view.getUint32(raw + 16 + i * 4, true);
    const {getSpacesLenAt} = this._ctx;
    const rawSpacesLen =
      getSpacesLenAt && this._hasParentSpaces(rawChild)
        ? Math.max(0, getSpacesLenAt(this._pos))
        : 0;
    this._pos += rawSpacesLen;
    const childHandle = this._pos * SHIFT + rawChild;
    const len = isTaggedTerminal(rawChild)
      ? rawChild >>> 1
      : this._ctx.view.getUint32(rawChild + 4, true);
    this._pos += len;
    return childHandle;
  }

  /** @internal — throw on NULL_HANDLE to catch bugs early. */
  private _checkNull(handle: number): void {
    if (handle === NULL_HANDLE) {
      throw new Error('NULL_HANDLE passed to CstView method');
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
