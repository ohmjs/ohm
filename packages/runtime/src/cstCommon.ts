// CST constants, types, and handle-packing utilities shared by cstView.ts
// and miniohm.ts. This module has no imports from either, so it can be
// imported by both without circular dependencies.

export const MATCH_RECORD_TYPE_MASK = 0b11;

// Byte offsets for fields in a CST match record (Wasm linear memory layout).
export const CST_MATCH_LENGTH_OFFSET = 0;
export const CST_TYPE_AND_DETAILS_OFFSET = 4;
export const CST_CHILD_COUNT_OFFSET = 8;
export const CST_CHILDREN_OFFSET = 16;

/** Bit 1 of a child slot is the HAS_LEADING_SPACES edge flag. */
export const CST_HAS_LEADING_SPACES_FLAG = 2;

// Tagged terminal: (matchLength << 2) | 1. Bit 0 distinguishes from real pointers.
// Bit 1 is the HAS_LEADING_SPACES edge flag (set on child slots, not on root handles).
export function isTaggedTerminal(handle: number): boolean {
  return (handle & 1) !== 0;
}

// Extract the MatchRecordType from a raw (non-tagged-terminal) CST pointer.
export function rawMatchRecordType(view: DataView, ptr: number): MatchRecordType {
  return (view.getInt32(ptr + CST_TYPE_AND_DETAILS_OFFSET, true) &
    MATCH_RECORD_TYPE_MASK) as MatchRecordType;
}

// A MatchRecord is the representation of a CstNode in Wasm linear memory.
export const MatchRecordType = {
  NONTERMINAL: 0,
  TERMINAL: 1, // Only for tagged-integer detection, never in heap nodes.
  ITER_FLAG: 2,
  OPTIONAL: 3,
} as const;

export type MatchRecordType = (typeof MatchRecordType)[keyof typeof MatchRecordType];

// A _CST node_ is the user-facing representation, built from a match record.
export const CstNodeType = {
  NONTERMINAL: 0,
  TERMINAL: 1,
  LIST: 2,
  OPT: 3,
  SEQ: 4,
} as const;

// Define types with the same name as the values above. This gives us roughly the
// same functionality as a TypeScript enum, but works with erasableSyntaxOnly.
export type CstNodeType = (typeof CstNodeType)[keyof typeof CstNodeType];

export interface MatchContext {
  ruleNames: string[];
  ruleIsSyntactic: boolean[];
  view: DataView;
  input: string;
  getSpacesLenAt?: (pos: number) => number;
  evalSpacesFull?: (pos: number) => number;
  memory?: WebAssembly.Memory;
}

// --- Handle packing ---

const HANDLE_BITS: number = 27;
const SHIFT: number = 2 ** HANDLE_BITS; // 134217728
const MASK: number = SHIFT - 1; // 0x7FFFFFF
const START_IDX_BITS: number = 53 - HANDLE_BITS;
const START_IDX_LIMIT: number = 2 ** START_IDX_BITS;
const TERMINAL_LENGTH_LIMIT: number = 2 ** (HANDLE_BITS - 2);
const INPUT_LENGTH_LIMIT: number = Math.min(START_IDX_LIMIT, TERMINAL_LENGTH_LIMIT);

/**
 * Pack a raw CST handle and startIdx into a single Number handle.
 * Uses 53 of the available integer-precision bits in an IEEE 754 double
 * (27 bits for the pointer, 26 bits for startIdx).
 */
function pack(rawHandle: number, startIdx: number): number {
  return startIdx * SHIFT + rawHandle;
}

/** Extract the raw CST pointer from a packed handle. */
export function rawHandle(handle: number): number {
  return handle & MASK;
}

/** Extract the startIdx from a packed handle. */
export function unpackStartIdx(handle: number): number {
  const raw = rawHandle(handle);
  return (handle - raw) / SHIFT;
}

/**
 * Create a packed handle from a raw pointer and startIdx.
 * Validates that both values fit in the packed representation.
 */
export function createHandle(rawPtr: number, startIdx: number): number {
  if (rawPtr >= SHIFT) {
    throw new Error(
      `Raw CST pointer ${rawPtr} exceeds ${HANDLE_BITS}-bit limit (max ${SHIFT - 1})`
    );
  }
  if (startIdx >= START_IDX_LIMIT) {
    throw new Error(
      `startIdx ${startIdx} exceeds ${START_IDX_BITS}-bit limit (max ${START_IDX_LIMIT - 1})`
    );
  }
  return pack(rawPtr, startIdx);
}

export {HANDLE_BITS, INPUT_LENGTH_LIMIT, SHIFT};

/** @internal */
export const _nodeFactory: {
  make: ((view: any, handle: number, leadingSpacesLen: number) => any) | null;
} = {
  make: null,
};
