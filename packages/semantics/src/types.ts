import type {
  CstNode,
  CstNodeChildren,
  ListNode,
  NonterminalNode,
  SeqNode,
  TerminalNode,
} from '@ohm-js/wasm';

export interface VisitorCtx<TNode extends CstNode = CstNode> {
  thisNode: TNode;
}

/**
 * An Action is a function from CstNodes, called with the children nodes
 * of the node it is being executed on.
 */
export type Action<
  R,
  TNode extends CstNode = CstNode,
  TChildren extends CstNodeChildren = CstNodeChildren,
> = (ctx: VisitorCtx<TNode>, ...args: TChildren) => R;

/**
 * An ActionDict is a dictionary of Actions indexed by rule names.
 * This is a "pure" type that only contains keys for built-in rules.
 */
export interface BaseActionDict<R> {
  _root?: (ctx: VisitorCtx<SeqNode>, start: NonterminalNode, end: TerminalNode) => R;

  // _iter?: (this: IterationNode, ...children: Node[]) => T;
  _nonterminal?: (ctx: VisitorCtx<NonterminalNode>, ...children: CstNodeChildren) => R;
  _terminal?: (ctx: VisitorCtx<TerminalNode>) => R;

  // Built-in rules

  alnum?: (ctx: VisitorCtx<NonterminalNode>, arg0: NonterminalNode) => R;
  letter?: (ctx: VisitorCtx<NonterminalNode>, arg0: NonterminalNode) => R;
  digit?: (ctx: VisitorCtx<NonterminalNode>, arg0: TerminalNode) => R;
  hexDigit?: (ctx: VisitorCtx<NonterminalNode>, arg0: NonterminalNode | TerminalNode) => R;
  // TODO: Make these use ListNodes?
  // ListOf?: (ctx: VisitorCtx<NonterminalNode>, arg0: NonterminalNode) => T;
  // NonemptyListOf?: (
  //   this: NonterminalNode,
  //   arg0: Node,
  //   arg1: IterationNode,
  //   arg2: IterationNode
  // ) => T;
  // EmptyListOf?: (this: NonterminalNode) => T;
  // listOf?: (this: NonterminalNode, arg0: NonterminalNode) => T;
  // nonemptyListOf?: (
  //   this: NonterminalNode,
  //   arg0: Node,
  //   arg1: IterationNode,
  //   arg2: IterationNode
  // ) => T;
  // emptyListOf?: (this: NonterminalNode) => T;
  //applySyntactic?: (this: NonterminalNode, arg0: Node) => T;
}

/**
 * An ActionDict is a dictionary of Actions indexed by rule names.
 */
export type ActionDict<R> = BaseActionDict<R> & {
  [index: string]: Action<R>;
};

export type Operation<R> = (node: CstNode) => R;
