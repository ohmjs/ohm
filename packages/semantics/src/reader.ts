import type {CstReader} from 'ohm-js/cstReader';
import {CstNodeType} from 'ohm-js/cstReader';

export type ReaderActionDict<R> = {
  _list?: (handle: number) => R;
  _nonterminal?: (handle: number) => R;
  _opt?: (handle: number) => R;
  _terminal?: (handle: number) => R;
  _default?: (handle: number) => R;
  [ruleName: string]: ((handle: number, ...children: number[]) => R) | undefined;
};

export type ReaderOperation<R> = (reader: CstReader, handle: number) => R;

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
  const listAction = actions._list;
  const terminalAction = actions._terminal;
  const nonterminalAction = actions._nonterminal;
  const optAction = actions._opt;
  const defaultAction = actions._default;

  function fail(reader: CstReader, handle: number): never {
    throw new Error(`missing semantic action for '${reader.ctorName(handle)}' in '${name}'`);
  }

  function buildTable(ruleNames: readonly string[]): (ActionFn<R> | number)[] {
    const table: (ActionFn<R> | number)[] = new Array(ruleNames.length);
    for (let i = 0; i < ruleNames.length; i++) {
      const ctorName = ruleNames[i].split('<')[0];
      const action = actions[ctorName];
      if (action) {
        table[i] = action;
      } else if (nonterminalAction) {
        table[i] = USE_NONTERMINAL;
      } else if (defaultAction) {
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

  const doIt: ReaderOperation<R> = (reader: CstReader, handle: number): R => {
    const nodeType = reader.type(handle);

    // Terminal — no children, no table lookup needed.
    if (nodeType === CstNodeType.TERMINAL) {
      if (terminalAction) return terminalAction(handle);
      if (defaultAction) return defaultAction(handle);
      return fail(reader, handle);
    }

    if (nodeType === CstNodeType.LIST) {
      if (listAction) return listAction(handle);
      if (defaultAction) return defaultAction(handle);
      return fail(reader, handle);
    }

    if (nodeType === CstNodeType.OPT) {
      if (optAction) return optAction(handle);
      if (defaultAction) return defaultAction(handle);
      return fail(reader, handle);
    }

    // Nonterminal — use dispatch table indexed by ruleId.
    const table = getTable(reader);
    const ruleId = reader.ruleId(handle);
    const entry = table[ruleId];

    if (typeof entry === 'function') {
      return reader.withChildren(handle, entry);
    }
    if (entry === USE_NONTERMINAL) {
      return nonterminalAction!(handle);
    }
    if (entry === USE_DEFAULT) {
      return defaultAction!(handle);
    }
    if (reader.childCount(handle) === 1) {
      return reader.withChildren(handle, (_handle, child) => doIt(reader, child));
    }
    return fail(reader, handle);
  };

  return doIt;
}
