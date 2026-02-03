type ApplyResult = bool;

@external("wasm:js-string", "length")
declare function jsStringLength(s: externref): i32;

declare function printI32(val: i32): void;
declare function isRuleSyntactic(ruleId: i32): bool;
declare function matchUnicodeChar(categoryBitmap: i32): bool;

@inline const IMPLICIT_SPACE_SKIPPING = true;

// TODO: Find a way to share these constants with JS?
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const STACK_START_OFFSET: usize = WASM_PAGE_SIZE;
@inline const MAX_INPUT_LEN_BYTES: usize = 64 * 1024;

// We current use 1k (1/64 page) per char for the memo table:
// - 4 bytes per entry
// - 256 entries per column
// - 1 column per char
@inline const MEMO_COL_SIZE_BYTES: usize = 4 * 256;

// CST nodes
@inline const CST_NODE_OVERHEAD: usize = 16;

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

// Shared globals
let pos: u32 = 0;
let endPos: u32 = 0;
let input: externref = null;
let memoBase: usize = 0;

// The rightmost position at which a leaf (Terminal, etc.) failed to match.
let rightmostFailurePos: i32 = 0;

// Known as `positionToRecordFailures` in the JS code.
// When this is >= 0, we are building up an error message for a previous
// parse, where that was rightmostFailurePos.
let errorMessagePos: i32 = -1;

let sp: usize = 0;
let bindings: Array<i32> = new Array<i32>();
let recordedFailures: Array<i32> = new Array<i32>();
let fluffyFailureIds: Set<i32> = new Set<i32>();

@inline function max<T>(a: T, b: T): T {
  return a > b ? a : b;
}

@inline function memoEntryForFailure(failurePos: i32): MemoEntry {
  return (failurePos << 1) | MEMO_FAILURE_FLAG;
}

@inline function memoTableGet(memoPos: usize, ruleId: i32): MemoEntry {
  const ptr = memoBase + memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<MemoEntry>();
  return load<MemoEntry>(ptr);
}

@inline function memoTableSet(memoPos: usize, ruleId: i32, value: MemoEntry): void {
  const ptr = memoBase + memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<MemoEntry>();
  store<MemoEntry>(ptr, value);
}

@inline function memoGetFailurePos(entry: MemoEntry): i32 {
  if (entry & MEMO_FAILURE_FLAG) {
    return entry >> 1;
  }
  assert(entry >= 0);
  return cstGetFailurePos(<usize>entry);
}

@inline function cstGetCount(ptr: usize): i32 {
  return load<i32>(ptr, 0);
}

@inline function cstSetCount(ptr: usize, count: i32): void {
  store<i32>(ptr, count, 0);
}

@inline function cstGetMatchLength(ptr: usize): i32 {
  return load<i32>(ptr, 4);
}

@inline function cstSetMatchLength(ptr: usize, len: i32): void {
  store<i32>(ptr, len, 4);
}

@inline function cstSetTypeAndDetails(ptr: usize, val: i32): void {
  store<i32>(ptr, val, 8);
}

@inline function cstGetFailurePos(ptr: usize): i32 {
  return load<i32>(ptr, 12);
}

@inline function cstSetFailurePos(ptr: usize, pos: i32): void {
  store<i32>(ptr, pos, 12);
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
    evalApply0(2);
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

function initMemoTable(inputLenBytes: usize): usize {
  const sizeBytes = (inputLenBytes + 1) * MEMO_COL_SIZE_BYTES;
  const buf = heap.alloc(sizeBytes);
  memory.fill(buf, 0, sizeBytes);
  return buf;
}

function doMatch(startRuleId: i32): ApplyResult {
  endPos = jsStringLength(input);
  memoBase = initMemoTable(endPos);

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
  fluffyFailureIds.clear();  // Reset fluffy tracking
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
  memoTableSet(origPos, ruleId, <MemoEntry>node);
  return true;
}

export function handleLeftRecursion(origPos: u32, ruleId: i32, origNumBindings: i32, failurePos: i32): ApplyResult {
  let maxPos: u32;
  let node: usize;
  let succeeded: bool;
  do {
    // The current result is the best one -- record it.
    maxPos = pos;
    rightmostFailurePos = max(rightmostFailurePos, failurePos);
    node = newNonterminalNode(origPos, pos, ruleId, origNumBindings, failurePos);
    memoTableSet(origPos, ruleId, <MemoEntry>node);

    // Reset and try to improve on the current best.
    pos = origPos;
    bindings.length = origNumBindings;
    const result = evalRuleBody(ruleId);
    succeeded = (result & RULE_EVAL_SUCCESS_FLAG) != 0;
    failurePos = result >> 1;
  } while (succeeded && pos > maxPos);

  pos = maxPos;

  bindings.length = origNumBindings + 1;
  bindings[origNumBindings] = node;
  return succeeded;
}

export function newTerminalNode(startIdx: i32, endIdx: i32): usize {
  const ptr = heap.alloc(CST_NODE_OVERHEAD);
  cstSetCount(ptr, 0);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetTypeAndDetails(ptr, NODE_TYPE_TERMINAL);
  cstSetFailurePos(ptr, 0);
  bindings.push(ptr);
  return ptr;
}

// Create an internal (non-leaf) node (IterationNode or NonterminalNode).
@inline function newNonLeafNode(startIdx: i32, endIdx: i32, typeAndDetails: i32, origNumBindings: i32, failurePos: i32): usize {
  const bindingsLen = bindings.length;
  const numChildren = bindingsLen - origNumBindings;
  const ptr = heap.alloc(CST_NODE_OVERHEAD + numChildren * 4);
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetTypeAndDetails(ptr, typeAndDetails);
  cstSetFailurePos(ptr, failurePos);
  for (let i = 0; i < numChildren; i++) {
    store<i32>(ptr + CST_NODE_OVERHEAD + i * 4, bindings[bindingsLen - numChildren + i]);
  }
  bindings.length = origNumBindings;
  bindings.push(ptr);
  return ptr;
}

export function newNonterminalNode(startIdx: i32, endIdx: i32, ruleId: i32, origNumBindings: i32, failurePos: i32): usize {
  const typeAndDetails = (ruleId << 2) | NODE_TYPE_NONTERMINAL;
  return newNonLeafNode(startIdx, endIdx, typeAndDetails, origNumBindings, failurePos);
}

export function newIterationNode(startIdx: i32, endIdx: i32, origNumBindings: i32, arity: i32, isOpt: bool): usize {
  if (isOpt) {
    const typeAndDetails = (arity << 2) | NODE_TYPE_OPTIONAL;
    return newNonLeafNode(startIdx, endIdx, typeAndDetails, origNumBindings, -1);
  }
  const typeAndDetails = (arity << 2) | NODE_TYPE_ITER_FLAG;
  return newNonLeafNode(startIdx, endIdx, typeAndDetails, origNumBindings, -1);
}

export function getBindingsLength(): i32 {
  return bindings.length;
}

export function setBindingsLength(len: i32): void {
  return bindings.length = len;
}

export function bindingsAt(i: i32): usize {
  return bindings[i];
}

// TODO: Find a way to call this directly from generated code.
export function doMatchUnicodeChar(categoryBitmap: i32): bool {
  return matchUnicodeChar(categoryBitmap)
}

export function recordFailure(id: i32): void {
  recordedFailures.push(id);
  fluffyFailureIds.delete(id);  // Clear fluffy status
}

export function makeFluffy(): void {
  for (let i = 0; i < recordedFailures.length; i++) {
    fluffyFailureIds.add(recordedFailures[i]);
  }
}

export function isFluffy(idx: i32): bool {
  return fluffyFailureIds.has(recordedFailures[idx]);
}

export function getRecordedFailuresLength(): i32 {
  return recordedFailures.length;
}

export function setRecordedFailuresLength(len: i32): void {
  recordedFailures.length = len;
}

export function recordedFailuresAt(i: i32): i32 {
  return recordedFailures[i];
}
