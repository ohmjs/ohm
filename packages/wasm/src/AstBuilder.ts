import {assert, checkNotNull} from './assert.ts';
import type {
  CstNode,
  MatchResult,
  NonterminalNode,
  TerminalNode,
  OptNode,
  IterNode,
} from './miniohm.ts';

export type AstNodeTemplate<T> = {
  [property: string]:
    | number
    | string
    | boolean
    | object
    | null
    | ((this: AstBuilder, children: CstNode[]) => T);
};

export type AstMapping<T> = Record<
  string,
  | AstNodeTemplate<T>
  | number // forward to nth child
  | ((this: AstBuilder, ...children: CstNode[]) => T) // semantic action
>;

function childAt(children: CstNode[], idx: number, ruleName: string, propName = ''): CstNode {
  if (idx > children.length) {
    const path = propName ? `${ruleName}.${propName}` : ruleName;
    throw new Error(`${path}: Child index ${idx} out of range`);
  }
  return children[idx];
}

export class AstBuilder<T = any> {
  currNode?: CstNode;

  private _mapping: AstMapping<T | T[]>;
  private _depth = -1;
  private _debug = false;

  constructor(mapping: AstMapping<T>, opts: {debug?: boolean} = {}) {
    const handleListOf = (child: CstNode) => this.toAst(child);
    const handleEmptyListOf = (): T[] => [];
    const handleNonemptyListOf = (first: CstNode, iterSepAndElem: CstNode) => {
      assert(iterSepAndElem.isIter(), 'Expected an iteration node');
      return [this.toAst(first), ...iterSepAndElem.collect((_, elem) => this.toAst(elem))];
    };
    this._mapping = {
      listOf: handleListOf,
      ListOf: handleListOf,
      emptyListOf: handleEmptyListOf,
      EmptyListOf: handleEmptyListOf,
      nonemptyListOf: handleNonemptyListOf,
      NonemptyListOf: handleNonemptyListOf,
      ...mapping,
    };
    this._debug = opts.debug ?? false;
  }

  private _debugLog(...data: any[]) {
    if (this._debug) console.log('  '.repeat(this._depth), ...data);
  }

  _visitTerminal(node: TerminalNode): string {
    return node.sourceString;
  }

  _visitNonterminal(node: NonterminalNode): unknown {
    const {children, ctorName} = node;
    const mapping = this._mapping;

    this._debugLog(`> ${ctorName}`);
    const dbgReturn = <T>(val: T): T => {
      this._debugLog(`| ${ctorName} DONE`);
      return val;
    };

    // without customization
    if (!Object.hasOwn(mapping, ctorName)) {
      // lexical rule
      if (node.isLexical()) {
        return node.sourceString;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      const realChildren = children.filter(c => !c.isTerminal());
      if (realChildren.length === 1) {
        return dbgReturn(this.toAst(realChildren[0]));
      }

      // rest: terms with multiple children
    }
    // direct forward
    if (typeof mapping[ctorName] === 'number') {
      const idx = mapping[ctorName];
      return dbgReturn(this.toAst(childAt(children, idx, ctorName)));
    }
    assert(typeof mapping[ctorName] !== 'function', "shouldn't be possible");

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    const propMap = mapping[ctorName] || children;
    const ans: Record<string, unknown> = {
      type: ctorName,
    };
    // eslint-disable-next-line guard-for-in
    for (const prop in propMap) {
      const mappedProp =
        mapping[ctorName] && (mapping[ctorName] as Record<string, unknown>)[prop];
      if (typeof mappedProp === 'number') {
        // direct forward
        ans[prop] = this.toAst(childAt(children, mappedProp, ctorName, prop));
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
    return dbgReturn(ans);
  }

  _visitIter(node: CstNode): T[] | T | null {
    assert(node.isIter() || node.isOptional(), 'Expected an iteration node');
    const {children} = node;
    if (node.isOptional()) {
      if (children.length === 0) {
        return null;
      }
      return this.toAst(children[0]);
    }

    return children.map(c => this.toAst(c));
  }

  toAst(nodeOrResult: MatchResult | CstNode): T {
    let node: CstNode = nodeOrResult as CstNode;
    if (typeof (nodeOrResult as MatchResult).succeeded === 'function') {
      const matchResult = nodeOrResult as MatchResult;
      assert(matchResult.succeeded(), 'Cannot convert failed match result to AST');
      node = matchResult.grammar.getCstRoot();
    }
    let ans;
    this._depth++;
    if (node.isTerminal()) {
      ans = this._visitTerminal(node);
    } else if (node.isIter()) {
      ans = this._visitIter(node);
    } else {
      assert(node.isNonterminal(), `Unknown node type: ${(node as any)._type}`);
      this.currNode = node;
      ans =
        typeof this._mapping[node.ctorName] === 'function'
          ? (this._mapping[node.ctorName] as Function).apply(this, node.children)
          : this._visitNonterminal(node);
      this.currNode = undefined;
    }
    this._depth--;
    return ans;
  }
}
