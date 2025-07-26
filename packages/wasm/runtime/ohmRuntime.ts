type ApplyResult = bool;

declare function fillInputBuffer(offset: i32, maxLen: i32): i32;
declare function printI32(val: i32): void;
declare function isRuleSyntactic(ruleId: i32): bool;

@inline const IMPLICIT_SPACE_SKIPPING = true;

// TODO: Find a way to share these.
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const MEMO_START_OFFSET: usize = 2 * WASM_PAGE_SIZE;
@inline const MEMO_COL_SIZE_BYTES: usize = 4 * 256;
@inline const STACK_START_OFFSET: usize = WASM_PAGE_SIZE;
@inline const MAX_INPUT_LEN_BYTES: usize = 64 * 1024;

// CST nodes
@inline const CST_NODE_OVERHEAD: usize = 16;
@inline const NODE_TYPE_TERMINAL: i32 = -1;
@inline const NODE_TYPE_ITERATION: i32 = -2;

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
let pos: i32 = 0;

// The rightmost position at which a leaf (Terminal, etc.) failed to match.
let rightmostFailurePos: i32 = 0;

let sp: usize = 0;
let bindings: Array<i32> = new Array<i32>();

@inline function max<T>(a: T, b: T): T {
  return a > b ? a : b;
}

@inline function memoEntryForFailure(failurePos: i32): MemoEntry {
  return (failurePos << 1) | MEMO_FAILURE_FLAG;
}

@inline function memoTableGet(memoPos: usize, ruleId: i32): MemoEntry {
  return load<MemoEntry>(memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<MemoEntry>(), MEMO_START_OFFSET);
}

@inline function memoTableSet(memoPos: usize, ruleId: i32, value: MemoEntry): void {
  store<MemoEntry>(memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<MemoEntry>(), value, MEMO_START_OFFSET);
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

@inline function cstGetType(ptr: usize): i32 {
  return load<i32>(ptr, 8);
}

@inline function cstSetType(ptr: usize, t: i32): void {
  store<i32>(ptr, t, 8);
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
  // TODO: Find a better way to deal with the bindings here.
  if (IMPLICIT_SPACE_SKIPPING && isRuleSyntactic(ruleId)) {
    const origNumBindings = bindings.length;
    evalApply0(2);
    bindings.length = origNumBindings;
  }
}

function resetParsingState(): void {
  pos = 0;
  rightmostFailurePos = -1;
  sp = STACK_START_OFFSET;
  heap.reset();

  bindings = new Array<i32>();
  memory.fill(MEMO_START_OFFSET, 0, MEMO_COL_SIZE_BYTES * MAX_INPUT_LEN_BYTES);
}

export function match(startRuleId: i32): ApplyResult {
  resetParsingState();

  // Get the input and do the match.
  let inputLen = fillInputBuffer(0, i32(WASM_PAGE_SIZE));

  maybeSkipSpaces(startRuleId);
  const succeeded = evalApply0(startRuleId) !== 0;
  if (succeeded) {
    maybeSkipSpaces(startRuleId);
    // printI32(heap.alloc(8) - __heap_base); // Print heap usage.
    // TODO: Do we need to update rightmostFailurePos here?
    return inputLen === pos;
  }

  return false;
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

export function evalApply0(ruleId: i32): ApplyResult {
  const memo = memoTableGet(pos, ruleId);
  if (memo !== 0) {
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

export function handleLeftRecursion(origPos: usize, ruleId: i32, origNumBindings: i32, failurePos: i32): ApplyResult {
  let maxPos: i32;
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
  cstSetType(ptr, NODE_TYPE_TERMINAL);
  cstSetFailurePos(ptr, 0);
  bindings.push(ptr);
  return ptr;
}

// Create an internal (non-leaf) node (IterationNode or NonterminalNode).
@inline function newNonLeafNode(startIdx: i32, endIdx: i32, type: i32, origNumBindings: i32, failurePos: i32): usize {
  const bindingsLen = bindings.length;
  const numChildren = bindingsLen - origNumBindings;
  const ptr = heap.alloc(CST_NODE_OVERHEAD + numChildren * 4);
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetType(ptr, type);
  cstSetFailurePos(ptr, failurePos);
  for (let i = 0; i < numChildren; i++) {
    store<i32>(ptr + CST_NODE_OVERHEAD + i * 4, bindings[bindingsLen - numChildren + i]);
  }
  bindings.length = origNumBindings;
  bindings.push(ptr);
  return ptr;
}

export function newNonterminalNode(startIdx: i32, endIdx: i32, ruleId: i32, origNumBindings: i32, failurePos: i32): usize {
  return newNonLeafNode(startIdx, endIdx, ruleId, origNumBindings, failurePos);
}

export function newIterationNode(startIdx: i32, endIdx: i32, origNumBindings: i32): usize {
  return newNonLeafNode(startIdx, endIdx, NODE_TYPE_ITERATION, origNumBindings, -1);
}

export function getBindingsLength(): i32 {
  return bindings.length;
}

export function setBindingsLength(len: i32): void {
  return bindings.length = len;
}

export function getCstRoot(): usize {
  // TODO: Figure out how to handle this w.r.t. leading and trailing space.
  return bindings[0];
}
