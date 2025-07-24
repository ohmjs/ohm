type Result = i32;

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

// Note: the rule evaluation functions use a different representation.
// They return non-zero for success and zero for failure.
@inline const EMPTY: Result = 0;
@inline const FAIL: Result = 0xfffffff0;
@inline const UNUSED_LR_BOMB: Result = FAIL | 0x1;
@inline const USED_LR_BOMB: Result = FAIL | 0x3;

@inline const CST_NODE_OVERHEAD: usize = 12;
@inline const NODE_TYPE_ITERATION: i32 = -2;

// Shared globals
let pos: i32 = 0;

// The rightmost position at which a leaf (Terminal, etc.) failed to match.
let rightmostFailurePos: i32 = 0;

let sp: usize = 0;
let bindings: Array<i32> = new Array<i32>();

// Preallocated CST nodes for some common cases.
let preallocAlnum1: i32 = 0;
let preallocAny1: i32 = 0;
let preallocLetter1: i32 = 0;
let preallocLower1: i32 = 0;
let preallocUpper1: i32 = 0;

@inline function max<T>(a: T, b: T): T {
  return a > b ? a : b;
}

@inline function memoTableGet(memoPos: usize, ruleId: i32): Result {
  return load<Result>(memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<Result>(), MEMO_START_OFFSET);
}

@inline function memoTableSet(memoPos: usize, ruleId: i32, value: Result): void {
  store<Result>(memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<Result>(), value, MEMO_START_OFFSET);
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

@inline function memoizeResult(memoPos: usize, ruleId: i32, result: Result): void {
  memoTableSet(memoPos, ruleId, result);
}

@inline function isFailure(result: Result): bool {
  return result < 0;
}

function useMemoizedResult(ruleId: i32, result: Result): Result {
  if (result === UNUSED_LR_BOMB) {
    memoTableSet(pos, ruleId, USED_LR_BOMB);
    return 0;
  } else if (isFailure(result)) {
    return 0;
  }
  pos += cstGetMatchLength(result);
  bindings.push(result);
  return result;
}

function hasMemoizedResult(ruleId: i32): boolean {
  return memoTableGet(pos, ruleId) !== 0;
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

  // spaces = 2, alnum = 3, any = 4, letter = 5, lower = 6, upper = 7
  newTerminalNode(0, 1);
  preallocAlnum1 = newNonterminalNode(0, 1, 3, 0);
  bindings.length = 0;
}

export function match(startRuleId: i32): Result {
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

  return 0;
}

@inline function evalRuleBody(ruleId: i32): Result {
  return call_indirect<Result>(ruleId);
}

export function evalApplyGeneralized(ruleId: i32, caseIdx: i32): Result {
  const origPos = pos;
  const origNumBindings = bindings.length;
  if (call_indirect<Result>(ruleId, caseIdx)) {
    return newNonterminalNode(origPos, pos, ruleId, origNumBindings);
  }
  return 0;
}

export function evalApplyNoMemo0(ruleId: i32): Result {
  const origPos = pos;
  const origNumBindings = bindings.length;
  const origFailurePos = rightmostFailurePos;
  let result: i32 = 0;
  if (evalRuleBody(ruleId)) {
    result = newNonterminalNode(origPos, pos, ruleId, origNumBindings);
  }
  // rightmostFailurePos = max(rightmostFailurePos, origFailurePos);
  // printI32(rightmostFailurePos);
  return result;
}

export function evalApply0(ruleId: i32): Result {
  let result = memoTableGet(pos, ruleId);

  if (result !== 0) {
    return useMemoizedResult(ruleId, result);
  }
  const origPos = pos;
  const origNumBindings = bindings.length;
  const origFailurePos = rightmostFailurePos;
  memoizeResult(origPos, ruleId, UNUSED_LR_BOMB);
  const succeeded: i32 = evalRuleBody(ruleId);

  // Straight failure — record a clean failure in the memo table.
  if (!succeeded) {
    memoizeResult(origPos, ruleId, FAIL);
    // rightmostFailurePos = max(rightmostFailurePos, origFailurePos);
    // printI32(rightmostFailurePos);
    return 0;
  }

  if (memoTableGet(origPos, ruleId) === USED_LR_BOMB) {
    // TODO: Update rightmostFailurePos here.
    return handleLeftRecursion(origPos, ruleId, origNumBindings);
  }
  // No left recursion — memoize and return.
  result = newNonterminalNode(origPos, pos, ruleId, origNumBindings);
  memoizeResult(origPos, ruleId, result);
  // rightmostFailurePos = max(rightmostFailurePos, origFailurePos);
  // printI32(rightmostFailurePos);
  return result;
}

export function handleLeftRecursion(origPos: usize, ruleId: i32, origNumBindings: i32): Result {
  let maxPos: i32;
  let result: Result;
  let succeeded: i32;
  do {
    // The current result is the best one -- record it.
    maxPos = pos;
    result = newNonterminalNode(origPos, pos, ruleId, origNumBindings);
    memoizeResult(origPos, ruleId, result);

    // Reset and try to improve on the current best.
    pos = origPos;
    bindings.length = origNumBindings;
    succeeded = evalRuleBody(ruleId);
  } while (succeeded && pos > maxPos);

  pos = maxPos;
  bindings.length = origNumBindings + 1;
  bindings[origNumBindings] = result;
  return succeeded;
}

export function newTerminalNode(startIdx: i32, endIdx: i32): usize {
  const ptr = heap.alloc(CST_NODE_OVERHEAD);
  cstSetCount(ptr, 0);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetType(ptr, -1);
  bindings.push(ptr);
  return ptr;
}

// Create an internal (non-leaf) node (IterationNode or NonterminalNode).
@inline function newNonLeafNodeWithType(startIdx: i32, endIdx: i32, type: i32, origNumBindings: i32): usize {
  const bindingsLen = bindings.length;
  const numChildren = bindingsLen - origNumBindings;
  const ptr = heap.alloc(CST_NODE_OVERHEAD + numChildren * 4);
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetType(ptr, type);
  for (let i = 0; i < numChildren; i++) {
    store<i32>(ptr + CST_NODE_OVERHEAD + i * 4, bindings[bindingsLen - numChildren + i]);
  }
  bindings.length = origNumBindings;
  bindings.push(ptr);
  return ptr;
}

export function newNonterminalNode(startIdx: i32, endIdx: i32, ruleId: i32, origNumBindings: i32): usize {
  return newNonLeafNodeWithType(startIdx, endIdx, ruleId, origNumBindings);
}

export function newIterationNode(startIdx: i32, endIdx: i32, origNumBindings: i32): usize {
  return newNonLeafNodeWithType(startIdx, endIdx, NODE_TYPE_ITERATION, origNumBindings);
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

export function pushPreallocAlnum(): i32 {
  return bindings.push(preallocAlnum1);
}
