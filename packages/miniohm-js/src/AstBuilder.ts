import {assert, checkNotNull} from './assert.ts';
import type {CstNode, MatchResult} from './index.ts';

export type AstMapping = Record<string, unknown>; // TODO: Improve this.

export class AstBuilder {
  _mapping: AstMapping;
  currNode?: CstNode;

  constructor(mapping: AstMapping) {
    const handleListOf = (child: CstNode) => this.toAst(child);
    const handleEmptyListOf = () => [];
    const handleNonemptyListOf = (first: CstNode, iterSepAndElem: CstNode) => [
      this.toAst(first),
      ...iterSepAndElem.map((_, elem) => this.toAst(elem)),
    ];
    this._mapping = {
      listOf: handleListOf,
      ListOf: handleListOf,
      emptyListOf: handleEmptyListOf,
      EmptyListOf: handleEmptyListOf,
      nonemptyListOf: handleNonemptyListOf,
      NonemptyListOf: handleNonemptyListOf,
      ...mapping,
    };
  }

  _visitTerminal(node: CstNode): string {
    return node.sourceString;
  }

  _visitNonterminal(node: CstNode): unknown {
    const {children, ruleName} = node;
    const mapping = this._mapping;

    // without customization
    if (!Object.hasOwn(mapping, ruleName)) {
      // lexical rule
      if (node.isLexical()) {
        return node.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(c => !c.isTerminal());
      if (realChildren.length === 1) {
        return this.toAst(realChildren[0]);
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ruleName] === 'number') {
      return this.toAst(children[mapping[ruleName]]);
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
        ans[prop] = this.toAst(children[mappedProp]);
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
        ans[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        const child: CstNode = children[Number(prop)];
        if (child && !child.isTerminal()) {
          ans[prop] = this.toAst(child);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitly removed
          delete ans[prop];
        }
      }
    }
    return ans;
  }

  _visitIter(node: CstNode): unknown {
    const {children} = node;
    if (node.isOptional()) {
      if (children.length === 0) {
        return null;
      }
      return this.toAst(children[0]);
    }

    return children.map(c => this.toAst(c));
  }

  toAst(nodeOrResult: MatchResult | CstNode): unknown {
    let node: CstNode = nodeOrResult as CstNode;
    if (typeof (nodeOrResult as MatchResult).succeeded === 'function') {
      const matchResult = nodeOrResult as MatchResult;
      assert(matchResult.succeeded(), 'Cannot convert failed match result to AST');
      node = checkNotNull((matchResult as MatchResult)._cst);
    }
    if (node.isTerminal()) {
      return this._visitTerminal(node);
    } else if (node.isIter()) {
      return this._visitIter(node);
    } else {
      assert(node.isNonterminal(), `Unknown node type: ${(node as any)._type}`);
      this.currNode = node;
      const ans =
        typeof this._mapping[node.ctorName] === 'function'
          ? (this._mapping[node.ctorName] as Function).apply(this, node.children)
          : this._visitNonterminal(node);
      this.currNode = undefined;
      return ans;
    }
  }
}
