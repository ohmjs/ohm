type Result = i32;

declare function fillInputBuffer(offset: i32, maxLen: i32): i32;

// TODO: Find a way to share these.
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const MEMO_START_OFFSET: usize = 2 * WASM_PAGE_SIZE;
@inline const MEMO_COL_SIZE_BYTES: usize = 4 * 256;
@inline const STACK_START_OFFSET: usize = WASM_PAGE_SIZE;
@inline const MAX_INPUT_LEN_BYTES: usize = 64 * 1024;

@inline const BINDINGS_INITIAL_CAPACITY: i32 = 32;

@inline const EMPTY: Result = 0;
@inline const FAIL: Result = -1;

// Shared globals
let pos: i32 = 0;
let sp: usize = 0;
let bindings: Array<i32> = new Array<i32>(BINDINGS_INITIAL_CAPACITY);

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

function memoizeResult(memoPos: usize, ruleId: i32, result: Result): void {
  memoTableSet(memoPos, ruleId, result);
}

function useMemoizedResult(ruleId: i32): Result {
  const result = memoTableGet(pos, ruleId);
  if (result !== FAIL) {
    pos += cstGetMatchLength(result);
  }
  return result;
}

function hasMemoizedResult(ruleId: i32): boolean {
  return memoTableGet(pos, ruleId) !== 0;
}

export function match(startRuleId: i32): Result {
  // (Re-)initialize globals, clear memo table.
  pos = 0;
  sp = STACK_START_OFFSET;
  bindings = new Array<i32>(BINDINGS_INITIAL_CAPACITY);
  memory.fill(MEMO_START_OFFSET, 0, MEMO_COL_SIZE_BYTES * MAX_INPUT_LEN_BYTES);

  // Get the input and do the match.
  let inputLen = fillInputBuffer(0, i32(WASM_PAGE_SIZE));
  if (evalApply(startRuleId)) {
    return inputLen == pos;
  }
  return 0;
}


// Note: this must always be the last function.
export function evalApply(ruleId: i32): Result {
  if (hasMemoizedResult(ruleId)) {
    return useMemoizedResult(ruleId);
  }
  const origPos = pos;
  const cst = call_indirect<Result>(ruleId);
  memoizeResult(origPos, ruleId, cst);
  return cst;
}

export function newTerminalNode(startIdx: i32, endIdx: i32): usize {
  const ptr = heap.alloc(8);
  cstSetCount(ptr, 0);
  cstSetMatchLength(ptr, endIdx - startIdx);
  return ptr;
}
