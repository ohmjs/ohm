import type {CstNode, NonterminalNode} from '@ohm-js/wasm';
import type {ActionDict, VisitorCtx} from './types.ts';

const globalActionStack: [string, string, string][] = [];

const getActionStackTrace = () =>
  globalActionStack
    .map(
      ([opName, actionName, ctorName], i) =>
        `\n  ${opName} > ${actionName}${actionName !== ctorName ? ` for '${ctorName}'` : ''}`
    )
    .join('\n');

export function createOperation<R, T extends ActionDict<R>>(
  name: string,
  actionDict: T
): (node: CstNode) => R {
  const doIt = (node: CstNode) => {
    const ctx: VisitorCtx = {
      thisNode: node,
    };

    // Ported from Operation.execute in ohm-js/src/Semantics.js
    try {
      // Look for a semantic action whose name matches the node's constructor name, which is either
      // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
      // iteration node).
      const {ctorName} = node;
      const action = actionDict[ctorName];
      if (action) {
        globalActionStack.push([name, ctorName, ctorName]);
        return action.apply(null, [ctx, ...node.children]);
      }

      // The action dictionary does not contain a semantic action for this specific type of node.
      // If this is a nonterminal node and the programmer has provided a `_nonterminal` semantic
      // action, we invoke it:
      if (node.isNonterminal()) {
        const nonterminalAction = actionDict._nonterminal;
        if (nonterminalAction) {
          globalActionStack.push([name, '_nonterminal', ctorName]);
          return nonterminalAction.apply(null, [
            ctx as VisitorCtx<NonterminalNode>,
            ...node.children,
          ]);
        }
      }

      // Note: here we diverge from the original version in Operation.execute slightly.
      // It builds a new dictionary _default is always present — if the user doesn't
      // specify _default, there is a system-provided one (via `newDefaultAction`).
      // We simply the logic from the system-provided one here.

      // Invoke the '_default' semantic action (if it exists).
      const defaultAction = actionDict._default;
      if (defaultAction) {
        globalActionStack.push([name, '_default', ctorName]);
        return defaultAction.apply(null, [ctx, ...node.children]);
      }

      // Inlined logic from newDefaultAction in Semantics.js.
      if (node.isNonterminal() && node.children.length === 1) {
        globalActionStack.push([name, 'default action', ctorName]);
        return doIt(node.children[0]);
      }
      throw new Error(`missing semantic action: ${ctorName}` + getActionStackTrace());
      // End inlined logic
    } finally {
      globalActionStack.pop();
    }
  };
  return doIt;
}
