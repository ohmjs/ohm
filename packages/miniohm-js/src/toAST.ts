import {assert, checkNotNull} from './assert.ts';
import type {CstNode, MatchResult} from './index.ts';

export function toAstWithMapping(
  mapping: Record<string, unknown>
): (nodeOrResult: MatchResult | CstNode) => unknown {
  const handleListOf = (child: CstNode) => visit(child);
  const handleEmptyListOf = () => [];
  const handleNonemptyListOf = (first: CstNode, iterSepAndElem: CstNode) => [
    visit(first),
    ...iterSepAndElem.map((_, elem) => visit(elem)),
  ];

  mapping = {
    listOf: handleListOf,
    ListOf: handleListOf,
    emptyListOf: handleEmptyListOf,
    EmptyListOf: handleEmptyListOf,
    nonemptyListOf: handleNonemptyListOf,
    NonemptyListOf: handleNonemptyListOf,
    ...mapping,
  };

  function visitTerminal(node: CstNode): string {
    return node.sourceString;
  }

  function visitNonterminal(node: CstNode): unknown {
    const {children, ruleName} = node;

    // without customization
    if (!Object.hasOwn(mapping, ruleName)) {
      // lexical rule
      if (node.isLexical()) {
        return node.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(c => !c.isTerminal());
      if (realChildren.length === 1) {
        return visit(realChildren[0]);
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ruleName] === 'number') {
      return visit(children[mapping[ruleName]]);
    }
    assert(typeof mapping[ruleName] !== 'function', "shouldn't be possible");

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    const propMap = mapping[ruleName] || children;
    const ans: Record<string, unknown> = {
      type: ruleName,
    };
    // eslint-disable-next-line guard-for-in
    for (const prop in propMap) {
      const mappedProp =
        mapping[ruleName] && (mapping[ruleName] as Record<string, unknown>)[prop];
      if (typeof mappedProp === 'number') {
        // direct forward
        ans[prop] = visit(children[mappedProp]);
      } else if (
        typeof mappedProp === 'string' ||
        typeof mappedProp === 'boolean' ||
        mappedProp === null
      ) {
        // primitive value
        ans[prop] = mappedProp;
      } else if (typeof mappedProp === 'object' && mappedProp instanceof Number) {
        // primitive number (must be unboxed)
        ans[prop] = Number(mappedProp);
      } else if (typeof mappedProp === 'function') {
        // computed value
        // Note that `thisArg` is `null`, which is different than the regular toAST.
        ans[prop] = mappedProp.call(null, children);
      } else if (mappedProp === undefined) {
        const child: CstNode = children[Number(prop)];
        if (child && !child.isTerminal()) {
          ans[prop] = visit(child);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitly removed
          delete ans[prop];
        }
      }
    }
    return ans;
  }

  function visitIter(node: CstNode): unknown {
    const {children} = node;
    if (node.isOptional()) {
      if (children.length === 0) {
        return null;
      }
      return visit(children[0]);
    }

    return children.map(c => visit(c));
  }

  function visit(nodeOrResult: MatchResult | CstNode): unknown {
    let node: CstNode = nodeOrResult as CstNode;
    if (typeof (nodeOrResult as MatchResult).succeeded === 'function') {
      const matchResult = nodeOrResult as MatchResult;
      assert(matchResult.succeeded(), 'Cannot convert failed match result to AST');
      node = checkNotNull((matchResult as MatchResult)._cst);
    }
    if (node.isTerminal()) {
      return visitTerminal(node);
    } else if (node.isIter()) {
      return visitIter(node);
    } else {
      assert(node.isNonterminal(), `Unknown node type: ${(node as any)._type}`);
      return typeof mapping[node.ctorName] === 'function'
        ? (mapping[node.ctorName] as Function).apply(null, node.children)
        : visitNonterminal(node);
    }
  }

  return visit;
}

export const toAst = toAstWithMapping({});
