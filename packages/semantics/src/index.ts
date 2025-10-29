import type { CstNode, CstNodeChildren,TerminalNode} from '@ohm-js/wasm';
import type {ActionDict, VisitorCtx} from './types.ts';

function newDefaultAction(type, name: string, doIt) {
  return function (ctx: VisitorCtx, ...children: CstNodeChildren) {
    const { thisNode } = ctx;
    if ((thisNode.isTerminal() || thisNode.isNonterminal()) && children.length === 1) {
      // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
      // we got here means that this action dictionary doesn't have an action for this particular
      // non-terminal or a generic `_nonterminal` action.
      // As a convenience, if this node only has one child, we just return the result of applying
      // this operation / attribute to the child node.
      return doIt.apply(null, ctx, children[0]);
    } else {
      // Otherwise, we throw an exception to let the programmer know that we don't know what
      // to do with this node.
      // throw errors.missingSemanticAction(this.ctorName, name, type, globalActionStack);
      throw new Error(`missing semantic action: '${name}'`);
    }
  };
}


export function createOperation<R, T extends ActionDict<R>>(
  name: string,
  actionDict: ActionDict<T>
): (node: CstNode) => R {
  return node => {
    const ctx: VisitorCtx = {
      thisNode: node
    };
    let action = actionDict[node.ctorName];
    if (!action) {
      switch (node.ctorName) {
        case '_terminal': action = action['_terminal'] ?? defaultTerminalAction;
      }
    }
    return action.apply(null,
  };
}
