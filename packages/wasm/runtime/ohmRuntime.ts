let pos: i32 = 0;
let sp: usize = 0;

type Result = i32;

declare function fillInputBuffer(offset: i32, maxLen: i32): i32;

// TODO: Find a way to share these.
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const MEMO_START_OFFSET: usize = 2 * WASM_PAGE_SIZE;
@inline const MEMO_COL_SIZE_BYTES: usize = 4 * 256;
@inline const STACK_START_OFFSET: usize = WASM_PAGE_SIZE;
@inline const MAX_INPUT_LEN_BYTES: usize = 64 * 1024;

@inline const EMPTY: Result = 0;
@inline const FAIL: Result = -1;

@inline function memoTableGet(memoPos: usize, ruleId: i32): Result {
  return load<Result>(memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<Result>(), MEMO_START_OFFSET);
}

@inline function memoTableSet(memoPos: usize, ruleId: i32, value: Result): void {
  store<Result>(memoPos * MEMO_COL_SIZE_BYTES + ruleId * sizeof<Result>(), value, MEMO_START_OFFSET);
}

@inline function cstGetMatchLength(addr: usize): i32 {
  return load<i32>(addr);
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
  let ret: i32 = 0;
  let tmp: i32 = 0;

  pos = 0;
  sp = STACK_START_OFFSET;

  // Clear memo table
  memory.fill(MEMO_START_OFFSET, 0, MEMO_COL_SIZE_BYTES * MAX_INPUT_LEN_BYTES);

  // Fill input buffer and get length
  let inputLen = fillInputBuffer(0, i32(WASM_PAGE_SIZE));

  // Apply the grammar's default start rule.
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
