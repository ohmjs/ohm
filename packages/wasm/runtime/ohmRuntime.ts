let pos: i32 = 0;

type Result = i32;

// TODO: Find a way to share these.
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const MEMO_START_OFFSET: usize = 2 * WASM_PAGE_SIZE;
@inline const MEMO_COL_SIZE_BYTES: usize = 4 * 256;

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
