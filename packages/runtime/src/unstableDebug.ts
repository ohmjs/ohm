import type {SucceededMatchResult} from './miniohm.ts';

const MATCH_RECORD_TYPE_MASK = 0b11;
const MEMO_BLOCK_ENTRIES = 16;

export interface MatchRecordStats {
  /** Number of unique match records visited. */
  count: number;
  /** Sum of payload bytes for visited match records. */
  sumBytes: number;
  /** Count by match record type. */
  countByType: {
    nonterminal: number;
    terminal: number;
    iter: number;
    optional: number;
  };
  /** Count by rule name (nonterminals only). */
  countByRule: Record<string, number>;
}

export interface MemoTableStats {
  /** Memo entries with successful match record pointers. */
  successEntries: number;
  /** Memo entries recording failures (including LR bombs). */
  failureEntries: number;
}

export interface MemoryStats {
  /** Bytes allocated on the Wasm heap for this match. */
  heapBytesUsed: number;
  /** Total Wasm linear memory size. */
  wasmMemoryBytes: number;
}

export interface MatchStats {
  /** Stats from walking the CST tree (reachable from root). */
  cst: MatchRecordStats;
  /** Stats from walking all match records found via the memo table. */
  heap: MatchRecordStats;
  /** Memo table occupancy. */
  memoTable: MemoTableStats;
  /** Memory usage. */
  memory: MemoryStats;
  /** Memo entries whose match records are not reachable from the CST root. */
  unusedMemoEntries: number;
}

// Walk a tree of match records, collecting stats. Uses a visited set to
// avoid double-counting shared nodes (e.g. preallocated nonterminals).
// Tagged terminals are counted in countByType but not in count/sumBytes
// since they are inline values, not heap-allocated match records.
function walkRecordTree(
  view: DataView,
  ruleNames: string[],
  rootPtrs: Iterable<number>,
  visited: Set<number>
): MatchRecordStats {
  const stats: MatchRecordStats = {
    count: 0,
    sumBytes: 0,
    countByType: {nonterminal: 0, terminal: 0, iter: 0, optional: 0},
    countByRule: {},
  };

  const stack: number[] = [];
  for (const ptr of rootPtrs) {
    if (ptr & 1) {
      // Tagged terminal: (matchLength << 1) | 1. Not a heap object.
      stats.countByType.terminal++;
    } else if (!visited.has(ptr)) {
      visited.add(ptr);
      stack.push(ptr);
    }
  }

  while (stack.length > 0) {
    const ptr = stack.pop()!;
    stats.count++;

    const count = view.getUint32(ptr, true);
    const typeAndDetails = view.getInt32(ptr + 8, true);
    const type = typeAndDetails & MATCH_RECORD_TYPE_MASK;

    // Each match record: 16-byte header + count * 4 bytes of child pointers.
    stats.sumBytes += 16 + count * 4;

    switch (type) {
      case 0: {
        // NONTERMINAL
        stats.countByType.nonterminal++;
        const ruleId = typeAndDetails >>> 2;
        const ruleName = ruleNames[ruleId]?.split('<')[0] ?? `unknown(${ruleId})`;
        stats.countByRule[ruleName] = (stats.countByRule[ruleName] ?? 0) + 1;
        break;
      }
      case 2:
        stats.countByType.iter++;
        break;
      case 3:
        stats.countByType.optional++;
        break;
    }

    for (let i = count - 1; i >= 0; i--) {
      const childPtr = view.getUint32(ptr + 16 + i * 4, true);
      if (childPtr & 1) {
        // Tagged terminal: not a heap object.
        stats.countByType.terminal++;
      } else if (!visited.has(childPtr)) {
        visited.add(childPtr);
        stack.push(childPtr);
      }
    }
  }

  return stats;
}

/**
 * Walk both the raw match records (via the memo table) and the CST tree,
 * producing stats about each and identifying unused memoized results.
 *
 * Must be called on the most recent (undisposed) match result, since
 * the memo table globals reflect the last match.
 */
export function getMatchStats(result: SucceededMatchResult): MatchStats {
  const root = result.getCstRoot() as any;
  const grammar = result.grammar as any;
  const exports = grammar._instance.exports;
  const ctx = (result as any)._ctx;
  const view: DataView = ctx.view;
  const ruleNames: string[] = ctx.ruleNames;
  const heapWatermark = (result as any)._heapWatermark;
  const inputLength = result.input.length;

  // --- 1. Walk CST tree from root ---
  const cstVisited = new Set<number>();
  const cstRoots: number[] = [];
  if (root.leadingSpaces) cstRoots.push(root.leadingSpaces._base);
  cstRoots.push(root._base);
  const cstStats = walkRecordTree(view, ruleNames, cstRoots, cstVisited);

  // --- 2. Walk memo table, collect all successful match record pointers ---
  const memoIndexBase = exports.memoIndexBase.value;
  const numMemoBlocks = exports.numMemoBlocks.value;

  const memoStats: MemoTableStats = {
    successEntries: 0,
    failureEntries: 0,
  };
  const memoPtrs = new Set<number>();

  for (let pos = 0; pos <= inputLength; pos++) {
    for (let blockIdx = 0; blockIdx < numMemoBlocks; blockIdx++) {
      const idxPtr = memoIndexBase + (pos * numMemoBlocks + blockIdx) * 4;
      const blockPtr = view.getUint32(idxPtr, true);
      if (blockPtr === 0) continue;

      for (let i = 0; i < MEMO_BLOCK_ENTRIES; i++) {
        const entry = view.getUint32(blockPtr + i * 4, true);
        if (entry === 0) continue;
        if ((entry & 1) !== 0) {
          // Failure encoding or LR bomb (bit 0 is set).
          memoStats.failureEntries++;
        } else {
          // Success: entry is a pointer to a match record.
          memoStats.successEntries++;
          memoPtrs.add(entry);
        }
      }
    }
  }

  // --- 3. Walk subtrees from all memo entries + CST roots ---
  const heapVisited = new Set<number>();
  const heapRoots = new Set([...memoPtrs, ...cstRoots]);
  const heapStats = walkRecordTree(view, ruleNames, heapRoots, heapVisited);

  // --- 4. Count unused memo entries ---
  let unusedMemoEntries = 0;
  for (const ptr of memoPtrs) {
    if (!cstVisited.has(ptr)) unusedMemoEntries++;
  }

  // --- 5. Memory stats ---
  const currentOffset = exports.__offset.value;

  return {
    cst: cstStats,
    heap: heapStats,
    memoTable: memoStats,
    memory: {
      heapBytesUsed: currentOffset - heapWatermark,
      wasmMemoryBytes: exports.memory.buffer.byteLength,
    },
    unusedMemoEntries,
  };
}
