/*
 * Block-sparse memo table
 * =======================
 *
 * The rule ID space is divided into fixed-size blocks of 16 entries.
 * The index is a 2D array: index[pos][blockIdx] -> block pointer,
 * where numMemoBlocks = ceil(numMemoizedRules / 16).
 * numMemoizedRules is determined at compile time and set by the
 * Wasm start function at instantiation.
 * The index is allocated upfront; blocks are allocated on first write.
 *
 *   Index: a flat array of block pointers, indexed by
 *   (pos * numMemoBlocks + blockIdx):
 *
 *   pos 0                        pos 1
 *   ┌────────┬────────┬─── ···  ┌────────┬────────┬─── ···
 *   │ blk 0  │ blk 1  │         │ blk 0  │ blk 1  │
 *   └───┬────┴───┬────┴─── ···  └────────┴────────┴─── ···
 *       │        │
 *       ▼        ▼
 *   ┌────────┐ ┌────────┐
 *   │ 16     │ │ 16     │           ← MemoEntry values (i32)
 *   │ entries│ │ entries│
 *   └────────┘ └────────┘
 *   (64 bytes)  (0 = not yet allocated)
 *
 *
 * CST node layout (16-byte header + children)
 * ============================================
 *
 *   Offset  Field
 *   ------  ----------------------------------
 *     0     count: i32         (number of children)
 *     4     matchLength: i32   (chars consumed)
 *     8     typeAndDetails: i32
 *               bits [1:0] = node type
 *                 0=nonterminal, 2=iteration, 3=optional
 *               bits [31:2] = ruleId (nonterminal) or arity (iter)
 *    12     failureOffset: i32  (relative to startIdx)
 *    16+    children: i32[]    (pointers to child nodes, or tagged terminals)
 *
 * Terminal nodes are NOT stored as CST nodes. Instead, they are tagged
 * 31-bit integers: (matchLength << 1) | 1. Bit 0 distinguishes them
 * from heap pointers (which are always word-aligned, so bit 0 = 0).
 */

type ApplyResult = bool;

declare function printI32(val: i32): void;
declare function matchUnicodeChar(categoryBitmap: i32): bool;
declare function matchCaseInsensitive(stringIdx: i32): bool;

@external("ohmRuntime", "fillInputBuffer")
declare function fillInputBuffer(dest: i32, len: i32): i32;

// TODO: Find a way to share these constants with JS?
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;

// Must match the $spaces rule ID from Compiler constructor.
@inline const IMPLICIT_SPACES_RULE_ID: i32 = 1;

// Block-sparse memo table constants.
// The rule ID space is partitioned into fixed-size blocks.
// Each block is allocated lazily on first write.
@inline const MEMO_BLOCK_ENTRIES: i32 = 16;
@inline const MEMO_BLOCK_SHIFT: i32 = 4; // log2(MEMO_BLOCK_ENTRIES)
@inline const MEMO_BLOCK_SIZE_BYTES: usize = <usize>MEMO_BLOCK_ENTRIES * sizeof<MemoEntry>();

// CST nodes
@inline const CST_NODE_OVERHEAD: i32 = 16;

// Node type is given by the two least significant bits of typeAndDetails.
// 0=nonterminal, 2=iteration, 3=optional. (Terminal nodes are not CST nodes;
// they are tagged integers — see taggedTerminal().)
// Note that an optional is also an iteration node, so bit 1 is treated as a flag.
@inline const NODE_TYPE_NONTERMINAL: i32 = 0;
@inline const NODE_TYPE_ITER_FLAG: i32 = 2;
@inline const NODE_TYPE_OPTIONAL: i32 = 3;

// Memo table entries
type MemoEntry = i32;

@inline const EMPTY: MemoEntry = 0;

// Low bit: failure flag.
// Rest: failureOffset (signed int, 31 bits).
@inline const MEMO_FAILURE_FLAG: MemoEntry = 0x1;

// Memo entries with only bit 1 set represent implicit spaces.
// Rest: matchLength (signed int, 30 bits).
@inline const MEMO_SPACES_FLAG: MemoEntry = 2;

// Left recursion bombs. These use extreme negative values that can't
// collide with valid (failureOffset << 1) | 1 entries.
@inline const UNUSED_LR_BOMB: MemoEntry = <i32>0x80000001;
@inline const USED_LR_BOMB: MemoEntry = <i32>0x80000003;

// The result of a raw rule evaluation function.
// Low bit: RULE_EVAL_SUCCESS_FLAG
// Rest: failurePos (signed int, 31 bits).
type RuleEvalResult = i32;

@inline const RULE_EVAL_SUCCESS_FLAG = 1;

// Tagged terminal encoding: (matchLength << 1) | 1.
// Bit 0 = 1 distinguishes terminals from heap pointers (which are always aligned).
@inline function taggedTerminal(matchLength: i32): i32 {
  return (matchLength << 1) | 1;
}

@inline function isTaggedTerminal(val: i32): bool {
  return (val & 1) !== 0;
}

@inline function taggedTerminalMatchLength(val: i32): i32 {
  return val >>> 1;
}

// Base pointer for preallocated nonterminal table (bump-heap allocated).
// Each entry is NODE_WITH_1_CHILD bytes, indexed by ruleId.
// count=0 in an entry means "not yet initialized".
@inline const NODE_WITH_1_CHILD: i32 = CST_NODE_OVERHEAD + 4; // 20 bytes
let preallocNtBase: i32 = 0;

// Preallocated empty iteration nodes (count=0, matchLength=0, failureOffset=-1).
// Indexed by typeAndDetails value. Covers arities 1-8 for both iter and opt.
@inline const MAX_PREALLOC_ITER: i32 = 36; // (8 << 2) | 3 + 1
let preallocEmptyIterBase: i32 = 0;

// Shared globals
export let pos: u32 = 0;
export let endPos: u32 = 0;
export let inputBuf: usize = 0;

// Block-sparse memo table state.
export let numMemoBlocks: i32 = 0;    // ceil(numMemoizedRules / MEMO_BLOCK_ENTRIES)
export let memoIndexBase: usize = 0;  // base of the index table (block pointers)

// The rightmost position at which a leaf (Terminal, etc.) failed to match.
export let rightmostFailurePos: i32 = 0;

// Known as `positionToRecordFailures` in the JS code.
// When this is >= 0, we are building up an error message for a previous
// parse, where that was rightmostFailurePos.
export let errorMessagePos: i32 = -1;

// Feature flags — set by the compiler's start function.
// When disabled, fall back to Array<i32> bindings or direct heap.alloc.
export let useChunkedBindings: i32 = 1;
// Chunked bindings: a doubly-linked list of fixed-size chunks.
// Each chunk: [prev: i32, next: i32, data: i32[BINDINGS_CHUNK_CAPACITY]]
@inline const BINDINGS_CHUNK_HEADER: i32 = 8;
@inline const BINDINGS_CHUNK_CAPACITY: i32 = 128;
@inline const BINDINGS_CHUNK_BYTES: i32 = BINDINGS_CHUNK_HEADER + BINDINGS_CHUNK_CAPACITY * 4;

export let bindingsChunk: i32 = 0;  // Pointer to current chunk (0 in array mode)
export let bindingsIdx: i32 = 0;    // Index within current chunk (or array length in array mode)
let bindingsFirstChunk: i32 = 0;    // Pointer to first chunk (for bindingsAt)

// Array-based bindings (used when useChunkedBindings === 0).
let bindingsArr: Array<i32> = new Array<i32>(0);

export let recordedFailures: Array<i32> = new Array<i32>();

@inline function max<T>(a: T, b: T): T {
  return a > b ? a : b;
}

// Allocate a new bindings chunk, linking it after `prev`.
function allocBindingsChunk(prev: i32): i32 {
  const ptr = <i32>heap.alloc(<usize>BINDINGS_CHUNK_BYTES);
  store<i32>(<usize>ptr, prev);        // prev pointer
  store<i32>(<usize>(ptr + 4), 0);     // next pointer (null)
  if (prev) {
    store<i32>(<usize>(prev + 4), ptr); // prev.next = ptr
  }
  return ptr;
}

// Called when current chunk is full.
export function bindingsAdvanceChunk(): void {
  let next = load<i32>(<usize>(bindingsChunk + 4));
  if (next === 0) {
    next = allocBindingsChunk(bindingsChunk);
  }
  bindingsChunk = next;
  bindingsIdx = 0;
}

// Push a value onto the bindings.
@inline function bindingsPush(value: i32): void {
  if (!useChunkedBindings) {
    bindingsArr.push(value);
    bindingsIdx++;
    return;
  }
  store<i32>(<usize>(bindingsChunk + BINDINGS_CHUNK_HEADER + (bindingsIdx << 2)), value);
  bindingsIdx++;
  if (bindingsIdx === BINDINGS_CHUNK_CAPACITY) {
    bindingsAdvanceChunk();
  }
}

// Read a binding by chunk pointer and index within that chunk.
@inline function bindingsRead(chunk: i32, idx: i32): i32 {
  if (!useChunkedBindings) return unchecked(bindingsArr[idx]);
  return load<i32>(<usize>(chunk + BINDINGS_CHUNK_HEADER + (idx << 2)));
}

// Write a binding at a specific chunk + index position.
@inline function bindingsWrite(chunk: i32, idx: i32, value: i32): void {
  if (!useChunkedBindings) { unchecked(bindingsArr[idx] = value); return; }
  store<i32>(<usize>(chunk + BINDINGS_CHUNK_HEADER + (idx << 2)), value);
}

@inline function memoEntryForFailure(failureOffset: i32): MemoEntry {
  return (failureOffset << 1) | MEMO_FAILURE_FLAG;
}

@inline function memoIndexPtr(memoPos: usize, ruleId: i32): usize {
  const blockIdx = ruleId >> MEMO_BLOCK_SHIFT;
  return memoIndexBase + (memoPos * numMemoBlocks + blockIdx) * sizeof<u32>();
}

@inline function memoTableGet(memoPos: usize, ruleId: i32): MemoEntry {
  const blockPtr = load<u32>(memoIndexPtr(memoPos, ruleId));
  if (blockPtr === 0) return EMPTY;
  const offset = (ruleId & (MEMO_BLOCK_ENTRIES - 1)) * sizeof<MemoEntry>();
  return load<MemoEntry>(<usize>blockPtr + offset);
}

@inline function memoTableSet(memoPos: usize, ruleId: i32, value: MemoEntry): void {
  const idxPtr = memoIndexPtr(memoPos, ruleId);
  let blockPtr = load<u32>(idxPtr);
  if (blockPtr === 0) {
    blockPtr = <u32>heap.alloc(MEMO_BLOCK_SIZE_BYTES);
    memory.fill(blockPtr, 0, MEMO_BLOCK_SIZE_BYTES);
    store<u32>(idxPtr, blockPtr);
  }
  const offset = (ruleId & (MEMO_BLOCK_ENTRIES - 1)) * sizeof<MemoEntry>();
  store<MemoEntry>(<usize>blockPtr + offset, value);
}

@inline function memoGetFailureOffset(entry: MemoEntry): i32 {
  if (entry & MEMO_FAILURE_FLAG) {
    return entry >> 1;
  }
  assert(entry >= 0);
  return cstGetFailureOffset(entry);
}

@inline function cstGetCount(ptr: i32): i32 {
  return load<i32>(<usize>ptr, 0);
}

@inline function cstSetCount(ptr: i32, count: i32): void {
  store<i32>(<usize>ptr, count, 0);
}

@inline function cstGetMatchLength(ptr: i32): i32 {
  return load<i32>(<usize>ptr, 4);
}

@inline function cstSetMatchLength(ptr: i32, len: i32): void {
  store<i32>(<usize>ptr, len, 4);
}

@inline function cstSetTypeAndDetails(ptr: i32, val: i32): void {
  store<i32>(<usize>ptr, val, 8);
}

@inline function cstGetFailureOffset(ptr: i32): i32 {
  return load<i32>(<usize>ptr, 12);
}

@inline function cstSetFailureOffset(ptr: i32, offset: i32): void {
  store<i32>(<usize>ptr, offset, 12);
}

function useMemoizedResult(ruleId: i32, result: MemoEntry): ApplyResult {
  if (result & MEMO_FAILURE_FLAG) {
    if (result === UNUSED_LR_BOMB) {
      memoTableSet(pos, ruleId, USED_LR_BOMB);
    } else {
      rightmostFailurePos = max(rightmostFailurePos, <i32>pos + (result >> 1));
    }
    return false;
  }
  // Read failureOffset before advancing pos, since pos is the node's startIdx.
  rightmostFailurePos = max(rightmostFailurePos, <i32>pos + cstGetFailureOffset(result));
  pos += cstGetMatchLength(result);
  bindingsPush(result);
  return true;
}

@inline function maybeSkipSpaces(ruleId: i32): void {
  if (isRuleSyntactic(ruleId)) {
    evalSpacesImplicit();
  }
}

// Evaluate $spaces without allocating a CST node or pushing a binding.
// Stores a sentinel in the memo table encoding just the match length.
export function evalSpacesImplicit(): void {
  const memo = memoTableGet(pos, IMPLICIT_SPACES_RULE_ID);
  if (memo !== EMPTY) {
    // Memo hit — sentinel from previous evaluation at this position.
    pos += <u32>(memo >>> 2);
    return;
  }
  const origPos = pos;
  const origChunk = bindingsChunk;
  const origIdx = bindingsIdx;
  evalRuleBody(IMPLICIT_SPACES_RULE_ID);
  const matchLen = <i32>pos - <i32>origPos;
  restoreBindings(origChunk, origIdx); // discard child bindings
  memoTableSet(origPos, IMPLICIT_SPACES_RULE_ID, (matchLen << 2) | MEMO_SPACES_FLAG);
}

// Look up spaces match length at a given position (for consumer use).
// Returns -1 if spaces were never tried at this position (lexical context).
export function getSpacesLenAt(memoPos: i32): i32 {
  const entry = memoTableGet(<usize>memoPos, IMPLICIT_SPACES_RULE_ID);
  if ((entry & 3) === MEMO_SPACES_FLAG) return entry >>> 2;
  return -1;
}

// Evaluate $spaces at a given position and return a full CST node pointer.
// Used for lazy evaluation of leadingSpaces.children.
export function evalSpacesFull(targetPos: i32): i32 {
  const savedPos = pos;
  pos = <u32>targetPos;

  // Clear the sentinel so evalRuleBody doesn't short-circuit.
  const savedMemo = memoTableGet(<usize>targetPos, IMPLICIT_SPACES_RULE_ID);
  memoTableSet(<usize>targetPos, IMPLICIT_SPACES_RULE_ID, EMPTY);

  const origChunk = bindingsChunk;
  const origIdx = bindingsIdx;
  const result = evalRuleBody(IMPLICIT_SPACES_RULE_ID);

  let nodePtr: i32 = 0;
  if (result & RULE_EVAL_SUCCESS_FLAG) {
    nodePtr = newNonterminalNode(<i32>(<usize>targetPos), <i32>pos, IMPLICIT_SPACES_RULE_ID, origChunk, origIdx, 0);
    // newNonterminalNode pushes the node to bindings; discard it.
    restoreBindings(origChunk, origIdx);
  } else {
    restoreBindings(origChunk, origIdx);
  }

  // Restore memo entry and pos.
  memoTableSet(<usize>targetPos, IMPLICIT_SPACES_RULE_ID, savedMemo);
  pos = savedPos;

  return nodePtr;
}

// The last entry in the function table is a compiler-generated dispatch
// function that returns 1 for syntactic rules, 0 for lexical rules.
@inline function isRuleSyntactic(ruleId: i32): bool {
  return call_indirect<i32>(numRules, ruleId) !== 0;
}

// Restore bindings to a saved (chunk, idx) position. In array mode,
// also trims the array to match.
@inline function restoreBindings(chunk: i32, idx: i32): void {
  bindingsChunk = chunk;
  bindingsIdx = idx;
  if (!useChunkedBindings) bindingsArr.length = idx;
}

function resetParsingState(): void {
  pos = 0;
  rightmostFailurePos = -1;
  if (useChunkedBindings) {
    // Allocate initial chunk (or reuse first chunk after heap.reset()).
    bindingsFirstChunk = allocBindingsChunk(0);
    bindingsChunk = bindingsFirstChunk;
  } else {
    bindingsArr = new Array<i32>();
    bindingsChunk = 0;
    bindingsFirstChunk = 0;
  }
  bindingsIdx = 0;
}

export function resetHeap(): void {
  heap.reset();
}

let numMemoizedRules: i32 = 0;
export let numRules: i32 = 0;

export function setNumMemoizedRules(n: i32): void {
  numMemoizedRules = n;
  numMemoBlocks = (n + MEMO_BLOCK_ENTRIES - 1) / MEMO_BLOCK_ENTRIES;
}

function initMemoTable(inputLenBytes: usize): void {
  const indexSizeBytes = (inputLenBytes + 1) * numMemoBlocks * sizeof<u32>();
  memoIndexBase = heap.alloc(indexSizeBytes);
  memory.fill(memoIndexBase, 0, indexSizeBytes);
}

function initPreallocatedNodes(): void {
  // Allocate nonterminal table — lazily initialized on first use per ruleId.
  // Only non-memoized rules use prealloc, and they have ruleId >= numMemoizedRules.
  const preallocCount = numRules - numMemoizedRules;
  preallocNtBase = <i32>heap.alloc(<usize>(preallocCount * NODE_WITH_1_CHILD));
  memory.fill(<usize>preallocNtBase, 0, <usize>(preallocCount * NODE_WITH_1_CHILD));

  // Allocate empty iteration table — lazily initialized on first use.
  preallocEmptyIterBase = <i32>heap.alloc(<usize>(MAX_PREALLOC_ITER * CST_NODE_OVERHEAD));
  memory.fill(<usize>preallocEmptyIterBase, 0, <usize>(MAX_PREALLOC_ITER * CST_NODE_OVERHEAD));
}

export function matchSetup(inputLength: i32): void {
  resetParsingState();
  errorMessagePos = -1;
  endPos = inputLength;
  inputBuf = heap.alloc(<usize>endPos << 1);  // 2 bytes per UTF-16 code unit
  fillInputBuffer(<i32>inputBuf, endPos);
  initMemoTable(endPos);
  initPreallocatedNodes();
}

export function matchEval(startRuleId: i32): ApplyResult {
  maybeSkipSpaces(startRuleId);
  const succeeded = evalApply0(startRuleId) !== 0;
  if (succeeded) {
    maybeSkipSpaces(startRuleId);
    assert(pos <= endPos);
    if (pos === endPos) {
      return true;
    }
    // Implicit end check failed: there's trailing input.
    // Use max() to preserve earlier rightmost failures (e.g., from backtracking).
    // Note: "end of input" is always failure ID 0 (see Compiler.js).
    rightmostFailurePos = max(rightmostFailurePos, <i32>pos);
    if (errorMessagePos === <i32>pos) {
      // Clear any existing failures at this position (they would be from
      // repetitions that succeeded, which Ohm.js marks as "fluffy").
      recordedFailures.length = 0;
      recordFailure(0);
    }
    return false;
  }
  return false;
}

export function match(inputLength: i32, startRuleId: i32): ApplyResult {
  matchSetup(inputLength);
  return matchEval(startRuleId);
}

// Pre-fill a memo entry: a nonterminal node wrapping a single tagged terminal.
export function memoizeToken(memoPos: i32, matchLength: i32, ruleId: i32): void {
  const ptr = <i32>heap.alloc(<usize>(CST_NODE_OVERHEAD + 4));
  cstSetCount(ptr, 1);
  cstSetMatchLength(ptr, matchLength);
  cstSetTypeAndDetails(ptr, (ruleId << 2) | NODE_TYPE_NONTERMINAL);
  cstSetFailureOffset(ptr, 0);
  store<i32>(<usize>(ptr + CST_NODE_OVERHEAD), taggedTerminal(matchLength));
  memoTableSet(<usize>memoPos, ruleId, ptr);
}

export function recordFailures(inputLength: i32, startRuleId: i32): void {
  const savedFailurePos = rightmostFailurePos;  // Save before reset
  matchSetup(inputLength);
  errorMessagePos = savedFailurePos;  // Override: record failures at this pos
  recordedFailures.length = 0;
  fluffySaveStack.length = 0;
  matchEval(startRuleId);  // Re-match with errorMessagePos set
}

@inline function evalRuleBody(ruleId: i32): RuleEvalResult {
  return call_indirect<RuleEvalResult>(ruleId);
}

// Extracts the local failure position from a RuleEvalResult.
// If it's greater than the global rightmostFailurePos, it updates it.
// Returns the local failure position.
@inline function maybeUpdateRightmostFailurePos(result: RuleEvalResult): i32 {
  const failurePos = result >> 1;
  rightmostFailurePos = max(rightmostFailurePos, failurePos);
  return failurePos;
}

// Evaluates a generalized rule. Identical to evalApplyNoMemo0, but includes
// the caseIdx.
export function evalApplyGeneralized(ruleId: i32, caseIdx: i32): ApplyResult {
  const origPos = pos;
  const origChunk = bindingsChunk;
  const origIdx = bindingsIdx;
  const result = call_indirect<RuleEvalResult>(ruleId, caseIdx)
  const failurePos = maybeUpdateRightmostFailurePos(result);
  if (result & RULE_EVAL_SUCCESS_FLAG) {
    const failureOffset = failurePos - <i32>origPos;
    newNonterminalNode(origPos, pos, ruleId, origChunk, origIdx, failureOffset);
    return true;
  }
  return false;
}

export function evalApplyNoMemo0(ruleId: i32): ApplyResult {
  const origPos = pos;
  const origChunk = bindingsChunk;
  const origIdx = bindingsIdx;
  let result = evalRuleBody(ruleId);
  const failurePos = maybeUpdateRightmostFailurePos(result);
  if (result & RULE_EVAL_SUCCESS_FLAG) {
    const failureOffset = failurePos - <i32>origPos;
    newNonterminalNode(origPos, pos, ruleId, origChunk, origIdx, failureOffset);
    return true;
  }
  return false;
}

// Evaluates a trivial (non-memoized) rule that matches a single code point.
// On success, reuses a preallocated nonterminal node instead of allocating.
// Falls back to dynamic allocation if matchLength != 1 (e.g. surrogate pair).
// innerPreallocIdx: -1 for direct rules (child = tagged terminal), >= 0 for
// transitive rules (child = inner preallocated nonterminal at that index).
export function evalApplyPrealloc(ruleId: i32, innerPreallocIdx: i32): ApplyResult {
  const origPos = pos;
  const origChunk = bindingsChunk;
  const origIdx = bindingsIdx;
  const result = evalRuleBody(ruleId);
  const failurePos = maybeUpdateRightmostFailurePos(result);
  if (result & RULE_EVAL_SUCCESS_FLAG) {
    if (pos - origPos === 1) {
      // Fast path: single code unit match.
      // These rules always produce exactly one child binding on success.
      const ptr: i32 = preallocNtBase + (ruleId - numMemoizedRules) * NODE_WITH_1_CHILD;
      if (cstGetCount(ptr) === 0) {
        // Lazy init: first use of this ruleId in this match.
        cstSetCount(ptr, 1);
        cstSetMatchLength(ptr, 1);
        cstSetTypeAndDetails(ptr, (ruleId << 2) | NODE_TYPE_NONTERMINAL);
        cstSetFailureOffset(ptr, 0);
        const childPtr = innerPreallocIdx < 0
          ? taggedTerminal(1)
          : preallocNtBase + innerPreallocIdx * NODE_WITH_1_CHILD;
        store<i32>(<usize>(ptr + CST_NODE_OVERHEAD), childPtr);
      }
      // Reset bindings to orig position and push the node — the body may
      // have advanced to the next chunk if origIdx was at the boundary.
      restoreBindings(origChunk, origIdx);
      bindingsPush(ptr);
      return true;
    }
    // Slow path: non-BMP character (surrogate pair, matchLength=2).
    const failureOffset = failurePos - <i32>origPos;
    newNonterminalNode(origPos, pos, ruleId, origChunk, origIdx, failureOffset);
    return true;
  }
  return false;
}

// When we are recording failures (errorMessagePos >= 0), and the rightmost
// failure position of `entry` matches `errorMessagePos`.
@inline function isInvolvedInError(entry: MemoEntry, memoPos: u32): bool {
  // TODO: Do we need to check that errorMessagePos >= 0?
  return errorMessagePos >= 0 && <i32>memoPos + memoGetFailureOffset(entry) === errorMessagePos;
}

export function evalApply0(ruleId: i32): ApplyResult {
  const memo = memoTableGet(pos, ruleId);
  if (memo !== 0 && !isInvolvedInError(memo, pos)) {
    return useMemoizedResult(ruleId, memo);
  }
  const origPos = pos;
  const origChunk = bindingsChunk;
  const origIdx = bindingsIdx;
  memoTableSet(origPos, ruleId, UNUSED_LR_BOMB);

  const result = evalRuleBody(ruleId);
  const failurePos = maybeUpdateRightmostFailurePos(result);
  const failureOffset = failurePos - <i32>origPos;

  // Straight failure — record a clean failure in the memo table.
  if ((result & RULE_EVAL_SUCCESS_FLAG) == 0) {
    memoTableSet(origPos, ruleId, memoEntryForFailure(failureOffset));
    return false;
  }

  if (memoTableGet(origPos, ruleId) === USED_LR_BOMB) {
    return handleLeftRecursion(origPos, ruleId, origChunk, origIdx, failurePos);
  }
  // No left recursion — memoize and return.
  const node = newNonterminalNode(origPos, pos, ruleId, origChunk, origIdx, failureOffset);
  memoTableSet(origPos, ruleId, node);
  return true;
}

export function handleLeftRecursion(origPos: u32, ruleId: i32, origChunk: i32, origIdx: i32, failurePos: i32): ApplyResult {
  let maxPos: u32;
  let node: i32;
  let succeeded: bool;
  do {
    // The current result is the best one -- record it.
    maxPos = pos;
    rightmostFailurePos = max(rightmostFailurePos, failurePos);
    const failureOffset = failurePos - <i32>origPos;
    node = newNonterminalNode(origPos, pos, ruleId, origChunk, origIdx, failureOffset);
    memoTableSet(origPos, ruleId, node);

    // Reset and try to improve on the current best.
    pos = origPos;
    restoreBindings(origChunk, origIdx);
    const result = evalRuleBody(ruleId);
    succeeded = (result & RULE_EVAL_SUCCESS_FLAG) != 0;
    failurePos = result >> 1;
  } while (succeeded && pos > maxPos);

  pos = maxPos;

  // Set bindings to [node] at the orig position.
  restoreBindings(origChunk, origIdx);
  bindingsPush(<i32>node);
  return succeeded;
}

export function newTerminalNode(startIdx: i32, endIdx: i32): i32 {
  const tagged = taggedTerminal(endIdx - startIdx);
  bindingsPush(tagged);
  return tagged;
}

// Create an internal (non-leaf) node (IterationNode or NonterminalNode).
@inline function newNonLeafNode(startIdx: i32, endIdx: i32, typeAndDetails: i32, origChunk: i32, origIdx: i32, failureOffset: i32): i32 {
  // Count children from (origChunk, origIdx) to (bindingsChunk, bindingsIdx).
  let numChildren: i32 = 0;
  if (origChunk === bindingsChunk) {
    numChildren = bindingsIdx - origIdx;
  } else {
    numChildren = BINDINGS_CHUNK_CAPACITY - origIdx;
    let c = load<i32>(<usize>(origChunk + 4)); // next
    while (c !== bindingsChunk) {
      numChildren += BINDINGS_CHUNK_CAPACITY;
      c = load<i32>(<usize>(c + 4));
    }
    numChildren += bindingsIdx;
  }

  const ptr: i32 = <i32>heap.alloc(<usize>(CST_NODE_OVERHEAD + numChildren * 4));
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetTypeAndDetails(ptr, typeAndDetails);
  cstSetFailureOffset(ptr, failureOffset);

  // Copy children from (origChunk, origIdx) to the node.
  let chunk = origChunk;
  let idx = origIdx;
  for (let i = 0; i < numChildren; i++) {
    store<i32>(<usize>(ptr + CST_NODE_OVERHEAD + i * 4), bindingsRead(chunk, idx));
    idx++;
    if (useChunkedBindings && idx === BINDINGS_CHUNK_CAPACITY) {
      chunk = load<i32>(<usize>(chunk + 4)); // next
      idx = 0;
    }
  }

  // Reset bindings to orig position, then push the new node.
  restoreBindings(origChunk, origIdx);
  bindingsPush(<i32>ptr);
  return ptr;
}

export function newNonterminalNode(startIdx: i32, endIdx: i32, ruleId: i32, origChunk: i32, origIdx: i32, failureOffset: i32): i32 {
  const typeAndDetails = (ruleId << 2) | NODE_TYPE_NONTERMINAL;
  return newNonLeafNode(startIdx, endIdx, typeAndDetails, origChunk, origIdx, failureOffset);
}

export function newIterationNode(startIdx: i32, endIdx: i32, origChunk: i32, origIdx: i32, arity: i32, isOpt: bool): i32 {
  const typeAndDetails = isOpt
    ? (arity << 2) | NODE_TYPE_OPTIONAL
    : (arity << 2) | NODE_TYPE_ITER_FLAG;

  // Fast path: empty iteration (no children, matchLength=0).
  // Reuse a preallocated node since the structure is always identical.
  if (endIdx === startIdx && bindingsChunk === origChunk && bindingsIdx === origIdx && typeAndDetails < MAX_PREALLOC_ITER) {
    const ptr: i32 = preallocEmptyIterBase + typeAndDetails * CST_NODE_OVERHEAD;
    if (cstGetMatchLength(ptr) === 0 && cstGetFailureOffset(ptr) === 0) {
      // Lazy init on first use.
      cstSetCount(ptr, 0);
      // matchLength already 0 from memory.fill
      cstSetTypeAndDetails(ptr, typeAndDetails);
      cstSetFailureOffset(ptr, -1);
    }
    bindingsPush(ptr);
    return ptr;
  }

  return newNonLeafNode(startIdx, endIdx, typeAndDetails, origChunk, origIdx, -1);
}

export function getBindingsLength(): i32 {
  if (!useChunkedBindings) return bindingsArr.length;
  // Compute total length by walking the chunk list from first to current.
  let count: i32 = 0;
  let chunk = bindingsFirstChunk;
  while (chunk !== bindingsChunk) {
    count += BINDINGS_CHUNK_CAPACITY;
    chunk = load<i32>(<usize>(chunk + 4)); // next
  }
  return count + bindingsIdx;
}

export function setBindingsLength(len: i32): void {
  if (!useChunkedBindings) {
    bindingsArr.length = len;
    bindingsIdx = len;
    return;
  }
  // Walk from first chunk to find the right chunk+idx.
  let chunk = bindingsFirstChunk;
  while (len >= BINDINGS_CHUNK_CAPACITY) {
    chunk = load<i32>(<usize>(chunk + 4)); // next
    len -= BINDINGS_CHUNK_CAPACITY;
  }
  bindingsChunk = chunk;
  bindingsIdx = len;
}

export function bindingsAt(i: i32): i32 {
  if (!useChunkedBindings) return unchecked(bindingsArr[i]);
  let chunk = bindingsFirstChunk;
  while (i >= BINDINGS_CHUNK_CAPACITY) {
    chunk = load<i32>(<usize>(chunk + 4)); // next
    i -= BINDINGS_CHUNK_CAPACITY;
  }
  return bindingsRead(chunk, i);
}

// TODO: Find a way to call this directly from generated code.
export function doMatchUnicodeChar(categoryBitmap: i32): bool {
  return matchUnicodeChar(categoryBitmap)
}

export function doMatchCaseInsensitive(stringIdx: i32): bool {
  return matchCaseInsensitive(stringIdx);
}

@inline const FLUFFY_BIT: i32 = 0x80000000;

export function recordFailure(id: i32): void {
  recordedFailures.push(id);
}

export function isFluffy(idx: i32): bool {
  return (recordedFailures[idx] & FLUFFY_BIT) != 0;
}

export function getRecordedFailuresLength(): i32 {
  return recordedFailures.length;
}

export function setRecordedFailuresLength(len: i32): void {
  recordedFailures.length = len;
}

export function recordedFailuresAt(i: i32): i32 {
  return recordedFailures[i] & ~FLUFFY_BIT;
}

export let fluffySaveStack: Array<i32> = new Array<i32>();

export function pushFluffySavePoint(): void {
  if (errorMessagePos < 0) return;
  fluffySaveStack.push(recordedFailures.length);
}

export function popFluffySavePoint(shouldMark: bool): void {
  if (errorMessagePos < 0) return;
  if (fluffySaveStack.length === 0) return;
  const startIdx = fluffySaveStack.pop();
  if (shouldMark) {
    for (let i = startIdx; i < recordedFailures.length; i++) {
      recordedFailures[i] |= FLUFFY_BIT;
    }
  }
}
