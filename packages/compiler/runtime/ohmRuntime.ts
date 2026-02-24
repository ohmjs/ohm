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
 *                 0=nonterminal, 1=terminal, 2=iteration, 3=optional
 *               bits [31:2] = ruleId (nonterminal) or arity (iter)
 *    12     failurePos: i32
 *    16+    children: i32[]    (pointers to child nodes)
 */

type ApplyResult = bool;

@external("wasm:js-string", "length")
declare function jsStringLength(s: externref): i32;

declare function printI32(val: i32): void;
declare function isRuleSyntactic(ruleId: i32): bool;
declare function matchUnicodeChar(categoryBitmap: i32): bool;
declare function matchCaseInsensitive(stringIdx: i32): bool;

@external("ohmRuntime", "fillInputBuffer")
declare function fillInputBuffer(dest: i32, len: i32): i32;

@inline const IMPLICIT_SPACE_SKIPPING = true;

// TODO: Find a way to share these constants with JS?
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const STACK_START_OFFSET: usize = WASM_PAGE_SIZE;

// Block-sparse memo table constants.
// The rule ID space is partitioned into fixed-size blocks.
// Each block is allocated lazily on first write.
@inline const MEMO_BLOCK_ENTRIES: i32 = 16;
@inline const MEMO_BLOCK_SHIFT: i32 = 4; // log2(MEMO_BLOCK_ENTRIES)
@inline const MEMO_BLOCK_SIZE_BYTES: usize = <usize>MEMO_BLOCK_ENTRIES * sizeof<MemoEntry>();

// CST nodes
@inline const CST_NODE_OVERHEAD: i32 = 16;

// Node type is given by the two least sigificant bits.
// Note that an optional is also an iteration node, so
// bit 1 should be treated as a flag.
@inline const NODE_TYPE_NONTERMINAL: i32 = 0;
@inline const NODE_TYPE_TERMINAL: i32 = 1;
@inline const NODE_TYPE_ITER_FLAG: i32 = 2;
@inline const NODE_TYPE_OPTIONAL: i32 = 3;

// Memo table entries
type MemoEntry = i32;

@inline const EMPTY: MemoEntry = 0;

// Low bit: failure flag.
// Rest: failurePos (signed int, 31 bits).
@inline const MEMO_FAILURE_FLAG: MemoEntry = 0x1;

// Not: left recursion bombs never include failurePos.
// We need to be careful that a true failure w/ failurePos can't produce
// the same value. Because failurePos >= -1, we can use -2 and -3.
// TODO: Use failureOffset (unsigned) instead? That's what we do in JS.
@inline const UNUSED_LR_BOMB: MemoEntry = (-2 << 1) | MEMO_FAILURE_FLAG;
@inline const USED_LR_BOMB: MemoEntry = (-3 << 1) | MEMO_FAILURE_FLAG

// The result of a raw rule evaluation function.
// Low bit: RULE_EVAL_SUCCESS_FLAG
// Rest: failurePos (signed int, 31 bits).
type RuleEvalResult = i32;

@inline const RULE_EVAL_SUCCESS_FLAG = 1;

// Preallocated terminal nodes for matchLength 0..8.
// Indexed by matchLength; each entry is CST_NODE_OVERHEAD bytes.
@inline const MAX_PREALLOC_TERMINAL_LEN: i32 = 8;
let preallocTerminalBase: i32 = 0;

// Base pointer for preallocated nonterminal table (bump-heap allocated).
// Each entry is NODE_WITH_1_CHILD bytes, indexed by ruleId.
// count=0 in an entry means "not yet initialized".
@inline const NODE_WITH_1_CHILD: i32 = CST_NODE_OVERHEAD + 4; // 20 bytes
let preallocNtBase: i32 = 0;

// Preallocated empty iteration nodes (count=0, matchLength=0, failurePos=-1).
// Indexed by typeAndDetails value. Covers arities 1-8 for both iter and opt.
@inline const MAX_PREALLOC_ITER: i32 = 36; // (8 << 2) | 3 + 1
let preallocEmptyIterBase: i32 = 0;

// Shared globals
export let pos: u32 = 0;
export let endPos: u32 = 0;
export let input: externref = null;
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

export let sp: usize = 0;
export let bindings: Array<i32> = new Array<i32>();
export let recordedFailures: Array<i32> = new Array<i32>();

@inline function max<T>(a: T, b: T): T {
  return a > b ? a : b;
}

@inline function memoEntryForFailure(failurePos: i32): MemoEntry {
  return (failurePos << 1) | MEMO_FAILURE_FLAG;
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

@inline function memoGetFailurePos(entry: MemoEntry): i32 {
  if (entry & MEMO_FAILURE_FLAG) {
    return entry >> 1;
  }
  assert(entry >= 0);
  return cstGetFailurePos(entry);
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

@inline function cstGetFailurePos(ptr: i32): i32 {
  return load<i32>(<usize>ptr, 12);
}

@inline function cstSetFailurePos(ptr: i32, pos: i32): void {
  store<i32>(<usize>ptr, pos, 12);
}

function useMemoizedResult(ruleId: i32, result: MemoEntry): ApplyResult {
  if (result & MEMO_FAILURE_FLAG) {
    if (result === UNUSED_LR_BOMB) {
      memoTableSet(pos, ruleId, USED_LR_BOMB);
    } else {
      rightmostFailurePos = max(rightmostFailurePos, result >> 1);
    }
    return false;
  }
  pos += cstGetMatchLength(result);
  rightmostFailurePos = max(rightmostFailurePos, cstGetFailurePos(result));
  bindings.push(result);
  return true;
}

@inline function maybeSkipSpaces(ruleId: i32): void {
  if (IMPLICIT_SPACE_SKIPPING && isRuleSyntactic(ruleId)) {
    evalApply0(1); // Must match the $spaces rule ID from Compiler.js constructor.
  }
}

function resetParsingState(): void {
  pos = 0;
  rightmostFailurePos = -1;
  sp = STACK_START_OFFSET;
  bindings = new Array<i32>();
}

// TODO: Move the logic for doing this into the Wasm module.
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
  const termCount = MAX_PREALLOC_TERMINAL_LEN + 1;
  preallocTerminalBase = <i32>heap.alloc(<usize>(termCount * CST_NODE_OVERHEAD));
  for (let i: i32 = 0; i <= MAX_PREALLOC_TERMINAL_LEN; i++) {
    const ptr = preallocTerminalBase + i * CST_NODE_OVERHEAD;
    cstSetCount(ptr, 0);
    cstSetMatchLength(ptr, i);
    cstSetTypeAndDetails(ptr, NODE_TYPE_TERMINAL);
    cstSetFailurePos(ptr, 0);
  }

  // Allocate nonterminal table — lazily initialized on first use per ruleId.
  // Only non-memoized rules use prealloc, and they have ruleId >= numMemoizedRules.
  const preallocCount = numRules - numMemoizedRules;
  preallocNtBase = <i32>heap.alloc(<usize>(preallocCount * NODE_WITH_1_CHILD));
  memory.fill(<usize>preallocNtBase, 0, <usize>(preallocCount * NODE_WITH_1_CHILD));

  // Allocate empty iteration table — lazily initialized on first use.
  preallocEmptyIterBase = <i32>heap.alloc(<usize>(MAX_PREALLOC_ITER * CST_NODE_OVERHEAD));
  memory.fill(<usize>preallocEmptyIterBase, 0, <usize>(MAX_PREALLOC_ITER * CST_NODE_OVERHEAD));
}

function doMatch(startRuleId: i32): ApplyResult {
  endPos = jsStringLength(input);
  inputBuf = heap.alloc(<usize>endPos << 1);  // 2 bytes per UTF-16 code unit
  fillInputBuffer(<i32>inputBuf, endPos);
  initMemoTable(endPos);
  initPreallocatedNodes();

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

export function match(inputStr: externref, startRuleId: i32): ApplyResult {
  resetParsingState();
  errorMessagePos = -1;  // Fresh match: no failure recording
  input = inputStr;
  return doMatch(startRuleId);
}

export function recordFailures(startRuleId: i32): void {
  const savedFailurePos = rightmostFailurePos;  // Save before reset
  resetParsingState();  // Reset parsing state (but not errorMessagePos)
  errorMessagePos = savedFailurePos;  // Set errorMessagePos to failure pos
  recordedFailures = new Array<i32>();
  fluffySaveStack = new Array<i32>();
  doMatch(startRuleId);  // Re-match with errorMessagePos set
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
  const origNumBindings = bindings.length;
  const result = call_indirect<RuleEvalResult>(ruleId, caseIdx)
  const failurePos = maybeUpdateRightmostFailurePos(result);
  if (result & RULE_EVAL_SUCCESS_FLAG) {
    newNonterminalNode(origPos, pos, ruleId, origNumBindings, failurePos);
    return true;
  }
  return false;
}

export function evalApplyNoMemo0(ruleId: i32): ApplyResult {
  const origPos = pos;
  const origNumBindings = bindings.length;
  let result = evalRuleBody(ruleId);
  const failurePos = maybeUpdateRightmostFailurePos(result);
  if (result & RULE_EVAL_SUCCESS_FLAG) {
    newNonterminalNode(origPos, pos, ruleId, origNumBindings, failurePos);
    return true;
  }
  return false;
}

// Evaluates a trivial (non-memoized) rule that matches a single code point.
// On success, reuses a preallocated nonterminal node instead of allocating.
// Falls back to dynamic allocation if matchLength != 1 (e.g. surrogate pair).
export function evalApplyPrealloc(ruleId: i32): ApplyResult {
  const origPos = pos;
  const origNumBindings = bindings.length;
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
        cstSetFailurePos(ptr, 0);
        store<i32>(<usize>(ptr + CST_NODE_OVERHEAD), preallocTerminalBase + CST_NODE_OVERHEAD);
      }
      bindings[origNumBindings] = ptr;
      return true;
    }
    // Slow path: non-BMP character (surrogate pair, matchLength=2).
    newNonterminalNode(origPos, pos, ruleId, origNumBindings, failurePos);
    return true;
  }
  return false;
}

// When we are recording failures (errorMessagePos >= 0), and the rightmost
// failure position of `entry` matches `errorMessagePos`.
@inline function isInvolvedInError(entry: MemoEntry): bool {
  // TODO: Do we need to check that errorMessagePos >= 0?
  return errorMessagePos >= 0 && memoGetFailurePos(entry) === errorMessagePos;
}

export function evalApply0(ruleId: i32): ApplyResult {
  const memo = memoTableGet(pos, ruleId);
  if (memo !== 0 && !isInvolvedInError(memo)) {
    return useMemoizedResult(ruleId, memo);
  }
  const origPos = pos;
  const origNumBindings = bindings.length;
  memoTableSet(origPos, ruleId, UNUSED_LR_BOMB);

  const result = evalRuleBody(ruleId);
  const failurePos = maybeUpdateRightmostFailurePos(result);

  // Straight failure — record a clean failure in the memo table.
  if ((result & RULE_EVAL_SUCCESS_FLAG) == 0) {
    memoTableSet(origPos, ruleId, memoEntryForFailure(failurePos));
    return false;
  }

  if (memoTableGet(origPos, ruleId) === USED_LR_BOMB) {
    return handleLeftRecursion(origPos, ruleId, origNumBindings, failurePos);
  }
  // No left recursion — memoize and return.
  const node = newNonterminalNode(origPos, pos, ruleId, origNumBindings, failurePos);
  memoTableSet(origPos, ruleId, node);
  return true;
}

export function handleLeftRecursion(origPos: u32, ruleId: i32, origNumBindings: i32, failurePos: i32): ApplyResult {
  let maxPos: u32;
  let node: i32;
  let succeeded: bool;
  do {
    // The current result is the best one -- record it.
    maxPos = pos;
    rightmostFailurePos = max(rightmostFailurePos, failurePos);
    node = newNonterminalNode(origPos, pos, ruleId, origNumBindings, failurePos);
    memoTableSet(origPos, ruleId, node);

    // Reset and try to improve on the current best.
    pos = origPos;
    bindings.length = origNumBindings;
    const result = evalRuleBody(ruleId);
    succeeded = (result & RULE_EVAL_SUCCESS_FLAG) != 0;
    failurePos = result >> 1;
  } while (succeeded && pos > maxPos);

  pos = maxPos;

  bindings.length = origNumBindings + 1;
  bindings[origNumBindings] = <i32>node;
  return succeeded;
}

export function newTerminalNode(startIdx: i32, endIdx: i32): i32 {
  const matchLen = endIdx - startIdx;
  if (matchLen <= MAX_PREALLOC_TERMINAL_LEN) {
    const ptr = preallocTerminalBase + matchLen * CST_NODE_OVERHEAD;
    bindings.push(ptr);
    return ptr;
  }
  const ptr: i32 = <i32>heap.alloc(<usize>CST_NODE_OVERHEAD);
  cstSetCount(ptr, 0);
  cstSetMatchLength(ptr, matchLen);
  cstSetTypeAndDetails(ptr, NODE_TYPE_TERMINAL);
  cstSetFailurePos(ptr, 0);
  bindings.push(<i32>ptr);
  return ptr;
}

// Create an internal (non-leaf) node (IterationNode or NonterminalNode).
@inline function newNonLeafNode(startIdx: i32, endIdx: i32, typeAndDetails: i32, origNumBindings: i32, failurePos: i32): i32 {
  const bindingsLen = bindings.length;
  const numChildren = bindingsLen - origNumBindings;
  const ptr: i32 = <i32>heap.alloc(<usize>(CST_NODE_OVERHEAD + numChildren * 4));
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetTypeAndDetails(ptr, typeAndDetails);
  cstSetFailurePos(ptr, failurePos);
  for (let i = 0; i < numChildren; i++) {
    store<i32>(<usize>(ptr + CST_NODE_OVERHEAD + i * 4), bindings[bindingsLen - numChildren + i]);
  }
  bindings.length = origNumBindings;
  bindings.push(<i32>ptr);
  return ptr;
}

export function newNonterminalNode(startIdx: i32, endIdx: i32, ruleId: i32, origNumBindings: i32, failurePos: i32): i32 {
  const typeAndDetails = (ruleId << 2) | NODE_TYPE_NONTERMINAL;
  return newNonLeafNode(startIdx, endIdx, typeAndDetails, origNumBindings, failurePos);
}

export function newIterationNode(startIdx: i32, endIdx: i32, origNumBindings: i32, arity: i32, isOpt: bool): i32 {
  const typeAndDetails = isOpt
    ? (arity << 2) | NODE_TYPE_OPTIONAL
    : (arity << 2) | NODE_TYPE_ITER_FLAG;

  // Fast path: empty iteration (no children, matchLength=0).
  // Reuse a preallocated node since the structure is always identical.
  if (endIdx === startIdx && bindings.length === origNumBindings && typeAndDetails < MAX_PREALLOC_ITER) {
    const ptr: i32 = preallocEmptyIterBase + typeAndDetails * CST_NODE_OVERHEAD;
    if (cstGetMatchLength(ptr) === 0 && cstGetFailurePos(ptr) === 0) {
      // Lazy init on first use.
      cstSetCount(ptr, 0);
      // matchLength already 0 from memory.fill
      cstSetTypeAndDetails(ptr, typeAndDetails);
      cstSetFailurePos(ptr, -1);
    }
    bindings.push(ptr);
    return ptr;
  }

  return newNonLeafNode(startIdx, endIdx, typeAndDetails, origNumBindings, -1);
}

export function getBindingsLength(): i32 {
  return bindings.length;
}

export function setBindingsLength(len: i32): void {
  return bindings.length = len;
}

export function bindingsAt(i: i32): i32 {
  return bindings[i];
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
