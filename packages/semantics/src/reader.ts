import type {CstReader} from 'ohm-js/cstReader';
import {CstNodeType} from 'ohm-js/cstReader';

export type ReaderActionDict<R> = {
  _nonterminal?: (handle: number) => R;
  _terminal?: (handle: number) => R;
  _default?: (handle: number) => R;
  [ruleName: string]: ((handle: number, ...children: number[]) => R) | undefined;
};

export type ReaderOperation<R> = (reader: CstReader, handle: number) => R;

function nextEdgePos(reader: CstReader, child: number): number {
  return reader.startIdx(child) + reader.matchLength(child);
}

function callWithChildren<R>(
  reader: CstReader,
  handle: number,
  action: (handle: number, ...children: number[]) => R
): R {
  const count = reader.childCount(handle);
  let ep = reader.startIdx(handle);

  if (count < 8) {
    if (count === 0) return action(handle);

    const c0 = reader.childAt(handle, 0, ep);
    if (count === 1) return action(handle, c0);

    ep = nextEdgePos(reader, c0);
    const c1 = reader.childAt(handle, 1, ep);
    if (count === 2) return action(handle, c0, c1);

    ep = nextEdgePos(reader, c1);
    const c2 = reader.childAt(handle, 2, ep);
    if (count === 3) return action(handle, c0, c1, c2);

    ep = nextEdgePos(reader, c2);
    const c3 = reader.childAt(handle, 3, ep);
    if (count === 4) return action(handle, c0, c1, c2, c3);

    ep = nextEdgePos(reader, c3);
    const c4 = reader.childAt(handle, 4, ep);
    if (count === 5) return action(handle, c0, c1, c2, c3, c4);

    ep = nextEdgePos(reader, c4);
    const c5 = reader.childAt(handle, 5, ep);
    if (count === 6) return action(handle, c0, c1, c2, c3, c4, c5);

    ep = nextEdgePos(reader, c5);
    const c6 = reader.childAt(handle, 6, ep);
    return action(handle, c0, c1, c2, c3, c4, c5, c6);
  }

  // Fallback for >=8 children.
  const children: number[] = [];
  for (let i = 0; i < count; i++) {
    const child = reader.childAt(handle, i, ep);
    children.push(child);
    ep = nextEdgePos(reader, child);
  }
  return action(handle, ...children);
}

type ActionFn<R> = (handle: number, ...children: number[]) => R;

// Sentinel values used in the dispatch table for fallback actions.
const NO_ACTION = 0;
const USE_NONTERMINAL = 1;
const USE_DEFAULT = 2;

export function createReaderOperation<R>(
  name: string,
  actions: ReaderActionDict<R>
): ReaderOperation<R> {
  // Lazily-built dispatch table: actionTable[ruleId] is either an action
  // function or a sentinel (NO_ACTION / USE_NONTERMINAL / USE_DEFAULT).
  let actionTable: (ActionFn<R> | number)[] | undefined;
  let cachedRuleNames: readonly string[] | undefined;

  function buildTable(ruleNames: readonly string[]): (ActionFn<R> | number)[] {
    const table: (ActionFn<R> | number)[] = new Array(ruleNames.length);
    for (let i = 0; i < ruleNames.length; i++) {
      const ctorName = ruleNames[i].split('<')[0];
      const action = actions[ctorName];
      if (action) {
        table[i] = action;
      } else if (actions._nonterminal) {
        table[i] = USE_NONTERMINAL;
      } else if (actions._default) {
        table[i] = USE_DEFAULT;
      } else {
        table[i] = NO_ACTION;
      }
    }
    return table;
  }

  function getTable(reader: CstReader): (ActionFn<R> | number)[] {
    const ruleNames = reader.ruleNames;
    if (actionTable && cachedRuleNames === ruleNames) return actionTable;
    cachedRuleNames = ruleNames;
    actionTable = buildTable(ruleNames);
    return actionTable;
  }

  return (reader: CstReader, handle: number): R => {
    const nodeType = reader.type(handle);

    // Terminal — no children, no table lookup needed.
    if (nodeType === CstNodeType.TERMINAL) {
      if (actions._terminal) return actions._terminal(handle);
      if (actions._default) return actions._default(handle);
      throw new Error(`missing semantic action for '_terminal'`);
    }

    // List or Opt — use _default.
    if (nodeType === CstNodeType.LIST || nodeType === CstNodeType.OPT) {
      if (actions._default) return actions._default(handle);
      throw new Error(`missing semantic action for '${reader.ctorName(handle)}'`);
    }

    // Nonterminal — use dispatch table indexed by ruleId.
    const table = getTable(reader);
    const ruleId = reader.details(handle);
    const entry = table[ruleId];

    if (typeof entry === 'function') {
      return callWithChildren(reader, handle, entry);
    }
    if (entry === USE_NONTERMINAL) {
      return actions._nonterminal!(handle);
    }
    if (entry === USE_DEFAULT) {
      return actions._default!(handle);
    }
    throw new Error(`missing semantic action for '${reader.ctorName(handle)}'`);
  };
}

function getChildren(reader: CstReader, handle: number): number[] {
  const count = reader.childCount(handle);
  const children: number[] = [];
  let ep = reader.startIdx(handle);
  for (let i = 0; i < count; i++) {
    const child = reader.childAt(handle, i, ep);
    children.push(child);
    ep = nextEdgePos(reader, child);
  }
  return children;
}

export function collect<R>(
  reader: CstReader,
  handle: number,
  cb: (...items: number[]) => R
): R[] {
  const arity = reader.details(handle);
  const children = getChildren(reader, handle);

  const results: R[] = [];
  if (arity <= 1) {
    for (const child of children) {
      results.push(cb(child));
    }
  } else {
    for (let i = 0; i < children.length; i += arity) {
      results.push(cb(...children.slice(i, i + arity)));
    }
  }
  return results;
}

export function ifPresent<R>(
  reader: CstReader,
  handle: number,
  consume: (...children: number[]) => R,
  orElse?: () => R
): R | undefined {
  const count = reader.childCount(handle);
  if (count === 0) {
    return orElse ? orElse() : undefined;
  }
  const children = getChildren(reader, handle);
  return consume(...children);
}
