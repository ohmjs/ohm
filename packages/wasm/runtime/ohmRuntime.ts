type Result = i32;

declare function fillInputBuffer(offset: i32, maxLen: i32): i32;
declare function printI32(val: i32): void;

// TODO: Find a way to share these.
@inline const WASM_PAGE_SIZE: usize = 64 * 1024;
@inline const MEMO_START_OFFSET: usize = 2 * WASM_PAGE_SIZE;
@inline const MEMO_COL_SIZE_BYTES: usize = 4 * 256;
@inline const STACK_START_OFFSET: usize = WASM_PAGE_SIZE;
@inline const MAX_INPUT_LEN_BYTES: usize = 64 * 1024;

@inline const EMPTY: Result = 0;
@inline const FAIL: Result = -1;

@inline const CST_NODE_OVERHEAD: usize = 12;

// Shared globals
let pos: i32 = 0;
let sp: usize = 0;
let bindings: Array<i32> = new Array<i32>();

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

function memoizeResult(memoPos: usize, ruleId: i32, result: Result): void {
  memoTableSet(memoPos, ruleId, result);
}

function useMemoizedResult(ruleId: i32): Result {
  const result = memoTableGet(pos, ruleId);
  if (result === FAIL) return 0;
  pos += cstGetMatchLength(result);
  bindings.push(result);
  return result;
}

function hasMemoizedResult(ruleId: i32): boolean {
  return memoTableGet(pos, ruleId) !== 0;
}

export function match(startRuleId: i32): Result {
  // (Re-)initialize globals, clear memo table.
  pos = 0;
  sp = STACK_START_OFFSET;
  bindings = new Array<i32>();
  memory.fill(MEMO_START_OFFSET, 0, MEMO_COL_SIZE_BYTES * MAX_INPUT_LEN_BYTES);

  // Get the input and do the match.
  let inputLen = fillInputBuffer(0, i32(WASM_PAGE_SIZE));
  const succeeded = evalApply(startRuleId) !== 0;
  if (inputLen === pos) {
    return succeeded;
  }
  return 0;
}


// Note: this must always be the last function.
export function evalApply(ruleId: i32): Result {
  if (hasMemoizedResult(ruleId)) {
    return useMemoizedResult(ruleId);
  }
  const origPos = pos;
  const origNumBindings = bindings.length;
  let result: Result = FAIL;
  const succeeded = call_indirect<Result>(ruleId);
  if (succeeded) {
    const numChildren = bindings.length - origNumBindings;
    result = newNonterminalNode(origPos, pos, numChildren);
  }
  memoizeResult(origPos, ruleId, result);
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

export function newNonterminalNode(startIdx: i32, endIdx: i32, numChildren: i32): usize {
  const ptr = heap.alloc(CST_NODE_OVERHEAD + numChildren * 4);
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetType(ptr, 0);
  for (let i = 0; i < numChildren; i++) {
    store<i32>(ptr + CST_NODE_OVERHEAD + i * 4, bindings[bindings.length - numChildren + i]);
  }
  bindings.length -= numChildren;
  bindings.push(ptr);
  return ptr;
}

export function newIterationNode(startIdx: i32, endIdx: i32, oldNumBindings: i32): usize {
  const numChildren = bindings.length - oldNumBindings;
  const ptr = heap.alloc(CST_NODE_OVERHEAD + numChildren * 4);
  cstSetCount(ptr, numChildren);
  cstSetMatchLength(ptr, endIdx - startIdx);
  cstSetType(ptr, -2);
  for (let i = 0; i < numChildren; i++) {
    store<i32>(ptr + CST_NODE_OVERHEAD + i * 4, bindings[bindings.length - numChildren + i]);
  }
  bindings.length -= numChildren;
  bindings.push(ptr);
  return ptr;
}

export function getBindingsLength(): i32 {
  return bindings.length;
}

export function setBindingsLength(len: i32): void {
  return bindings.length = len;
}

export function getCstRoot(): usize {
  return bindings[0];
}
