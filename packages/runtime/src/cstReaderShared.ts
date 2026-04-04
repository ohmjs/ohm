const HANDLE_BITS = 27;
const SHIFT = 2 ** HANDLE_BITS; // 134217728
const MASK = SHIFT - 1; // 0x7FFFFFF
const START_IDX_BITS = 53 - HANDLE_BITS;
const START_IDX_LIMIT = 2 ** START_IDX_BITS;
const TERMINAL_LENGTH_LIMIT = 2 ** (HANDLE_BITS - 2);
const INPUT_LENGTH_LIMIT = Math.min(START_IDX_LIMIT, TERMINAL_LENGTH_LIMIT);

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
