let pos: i32 = 0;

function memoizeResult(memoPos: i32, ruleId: i32, result: i32): void {
  // TODO
}

function useMemoizedResult(ruleId: i32): i32 {
  return -1;
}

function hasMemoizedResult(ruleId: i32): boolean {
  return false;
}

// Note: this must always be the last function.
export function evalApply(ruleId: i32): i32 {
  if (hasMemoizedResult(ruleId)) {
    return useMemoizedResult(ruleId);
  }
  const origPos = pos;
  const cst = call_indirect<i32>(ruleId);
  memoizeResult(origPos, ruleId, cst);
  return cst;
}
