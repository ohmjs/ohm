import type {
  CstNode,
  NonterminalNode,
  CstNodeBase,
  TerminalNode,
  ListNode,
  OptNode,
  SeqNode,
} from '@ohm-js/wasm';
import {CstNodeType} from '@ohm-js/wasm';

import * as legacy from 'ohm-js';

function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) throw new Error(message ?? 'Assertion failed');
}

class AdaptedCstNode implements CstNodeBase {
  #grammar: legacy.Grammar;
  #node: any;
  #startIdx: number;
  #cachedChildren?: CstNode[];

  constructor(grammar: legacy.Grammar, node: any, startIdx = 0) {
    this.#grammar = grammar;
    this.#node = node;
    this.#startIdx = startIdx;
  }

  get ctorName(): string {
    return this.#node.ctorName;
  }

  get sourceString(): string {
    return this.#node.sourceString;
  }

  get matchLength(): number {
    return this.#node.matchLength;
  }

  get source() {
    return {
      startIdx: this.#startIdx,
      endIdx: this.#startIdx + this.matchLength,
    };
  }

  get type(): CstNodeType {
    if (this.ctorName === '_terminal') return CstNodeType.TERMINAL;
    if (this.ctorName === '_list') return CstNodeType.LIST;
    if (this.ctorName === '_opt') return CstNodeType.OPT;
    if (this.ctorName === '_seq') return CstNodeType.SEQ;
    return CstNodeType.NONTERMINAL;
  }

  get children(): CstNode[] {
    if (this.#cachedChildren !== undefined) return this.#cachedChildren;
    if (this.type === CstNodeType.TERMINAL) {
      return (this.#cachedChildren = []);
    }
    const {children, childOffsets} = this.#node;
    const adaptedChildren = children.map(
      (child: any, i: number) =>
        new AdaptedCstNode(this.#grammar, child, this.#startIdx + childOffsets[i])
    );
    return (this.#cachedChildren = adaptedChildren);
  }

  isNonterminal(): this is NonterminalNode {
    return this.type === CstNodeType.NONTERMINAL;
  }

  isTerminal(): this is TerminalNode {
    return this.type === CstNodeType.TERMINAL;
  }

  isOptional(): this is OptNode {
    return this.type === CstNodeType.OPT;
  }

  isSeq(): this is SeqNode {
    return this.type === CstNodeType.SEQ;
  }

  isList(): this is ListNode {
    return this.type === CstNodeType.LIST;
  }

  // NonterminalNode methods
  isSyntactic(ruleName?: string): boolean {
    if (!this.isNonterminal()) return false;
    return ruleName ? this.ctorName === ruleName : true;
  }

  isLexical(ruleName?: string): boolean {
    if (!this.isNonterminal()) return false;
    return ruleName ? this.ctorName === ruleName : true;
  }

  // TerminalNode
  get value(): string {
    if (!this.isTerminal()) throw new Error('Not a terminal node');
    return this.sourceString;
  }

  // ListNode
  collect<R>(cb: (...children: CstNode[]) => R): R[] {
    if (!this.isList()) throw new Error('Not a list node');
    return this.children.map(child => cb(child));
  }

  // OptNode
  ifPresent<R>(consume: any, orElse?: () => R): R | undefined {
    if (!this.isOptional()) throw new Error('Not an optional node');
    if (this.children.length === 0) {
      return orElse ? orElse() : undefined;
    }
    const child = this.children[0];
    if (child.isSeq()) {
      return (consume as any)(...child.children);
    } else {
      return consume(child);
    }
  }

  isPresent(): boolean {
    if (!this.isOptional()) throw new Error('Not an optional node');
    return this.children.length > 0;
  }

  isEmpty(): boolean {
    return !this.isPresent();
  }

  // SeqNode
  unpack<R>(cb: (...children: CstNode[]) => R): R {
    if (!this.isSeq()) throw new Error('Not a seq node');
    return cb(...this.children);
  }
}

export function adaptCstFromMatchResult(result: any): CstNode {
  assert(
    typeof result.succeeded === 'function' && result.succeeded(),
    'Expected a successful Ohm v17 MatchResult'
  );
  const node = result._cst;
  return new AdaptedCstNode(result.matcher.grammar, result._cst) as CstNode;
}
