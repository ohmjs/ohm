import type {CstView} from 'ohm-js/cstView';
import {CstNodeType} from 'ohm-js/cstView';

export type CstViewActionDict<R> = {
  _list?: (handle: number) => R;
  _nonterminal?: (handle: number) => R;
  _opt?: (handle: number) => R;
  _terminal?: (handle: number) => R;
  _default?: (handle: number) => R;
  [ruleName: string]: ((handle: number, ...children: number[]) => R) | undefined;
};

export type CstViewOperation<R> = (cst: CstView, handle: number) => R;

type ActionFn<R> = (handle: number, ...children: number[]) => R;

// Sentinel values used in the dispatch table for fallback actions.
const NO_ACTION = 0;
const USE_NONTERMINAL = 1;
const USE_DEFAULT = 2;

export function createCstViewOperation<R>(
  name: string,
  actions: CstViewActionDict<R>
): CstViewOperation<R> {
  // Lazily-built dispatch table: actionTable[ruleId] is either an action
  // function or a sentinel (NO_ACTION / USE_NONTERMINAL / USE_DEFAULT).
  let actionTable: (ActionFn<R> | number)[] | undefined;
  let cachedRuleNames: readonly string[] | undefined;
  const listAction = actions._list;
  const terminalAction = actions._terminal;
  const nonterminalAction = actions._nonterminal;
  const optAction = actions._opt;
  const defaultAction = actions._default;

  function fail(cst: CstView, handle: number): never {
    throw new Error(`missing semantic action for '${cst.ctorName(handle)}' in '${name}'`);
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

  function getTable(cst: CstView): (ActionFn<R> | number)[] {
    const ruleNames = cst.ruleNames;
    if (actionTable && cachedRuleNames === ruleNames) return actionTable;
    cachedRuleNames = ruleNames;
    actionTable = buildTable(ruleNames);
    return actionTable;
  }

  const doIt: CstViewOperation<R> = (cst: CstView, handle: number): R => {
    const nodeType = cst.type(handle);

    // Terminal — no children, no table lookup needed.
    if (nodeType === CstNodeType.TERMINAL) {
      if (terminalAction) return terminalAction(handle);
      if (defaultAction) return defaultAction(handle);
      return fail(cst, handle);
    }

    if (nodeType === CstNodeType.LIST) {
      if (listAction) return listAction(handle);
      if (defaultAction) return defaultAction(handle);
      return fail(cst, handle);
    }

    if (nodeType === CstNodeType.OPT) {
      if (optAction) return optAction(handle);
      if (defaultAction) return defaultAction(handle);
      return fail(cst, handle);
    }

    // Nonterminal — use dispatch table indexed by ruleId.
    const table = getTable(cst);
    const ruleId = cst.ruleId(handle);
    const entry = table[ruleId];

    if (typeof entry === 'function') {
      return cst.withChildren(handle, entry);
    }
    if (entry === USE_NONTERMINAL) {
      return nonterminalAction!(handle);
    }
    if (entry === USE_DEFAULT) {
      return defaultAction!(handle);
    }
    if (cst.childCount(handle) === 1) {
      return cst.withChildren(handle, (_handle, child) => doIt(cst, child));
    }
    return fail(cst, handle);
  };

  return doIt;
}
