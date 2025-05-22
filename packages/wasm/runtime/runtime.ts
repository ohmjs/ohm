type RuleEval = () => i32;

function memoizeResult(ruleId: i32, pos: i32, result: i32): void {
  // TODO
}

function useMemoizedResult(ruleId: i32, pos: i32): i32 {
  return -1;
}

function hasMemoizedResult(ruleId: i32, pos: i32): boolean {
  return false;
}

export function evalApply(ruleId: i32, pos: i32): i32 {
  if (hasMemoizedResult(ruleId, pos)) {
    return useMemoizedResult(ruleId, pos);
  }
  const origPos = pos;
  const evalRule = call_indirect<RuleEval>(ruleId);
  const cst = evalRule();
  memoizeResult(origPos, ruleId, cst);
  return cst;
}
