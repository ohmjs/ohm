import {assert, checkNotNull} from './assert.ts';
import {
  CstNodeType,
  isTaggedTerminal,
  MATCH_RECORD_TYPE_MASK,
  MatchRecordType,
} from './miniohm.ts';

import type {
  CstNode,
  CstNodeBase,
  CstNodeChildren,
  ListNode,
  MatchContext,
  NonterminalNode,
  OptNode,
  SeqNode,
  TerminalNode,
} from './miniohm.ts';

const EMPTY_CHILDREN: ReadonlyArray<CstNode> = Object.freeze([]);

export class CstNodeImpl implements CstNodeBase {
  _ctx!: MatchContext;
  _children?: CstNodeChildren = undefined;
  _base: number;
  startIdx: number;
  leadingSpaces?: NonterminalNode = undefined;
  source: {startIdx: number; endIdx: number};

  constructor(ctx: MatchContext, ptr: number, startIdx: number) {
    // Non-enumerable properties
    Object.defineProperties(this, {
      _ctx: {value: ctx},
      _children: {writable: true},
    });
    this._base = ptr;
    this.startIdx = startIdx;
    this.source = {
      startIdx,
      endIdx: startIdx + this.sourceString.length,
    };
    if (this.matchRecordType === MatchRecordType.TERMINAL || this.count === 0) {
      this._children = EMPTY_CHILDREN;
    }
  }

  get type(): CstNodeType {
    switch (this._typeAndDetails & MATCH_RECORD_TYPE_MASK) {
      case MatchRecordType.NONTERMINAL:
        return CstNodeType.NONTERMINAL;
      case MatchRecordType.TERMINAL:
        return CstNodeType.TERMINAL;
      case MatchRecordType.ITER_FLAG:
        return CstNodeType.LIST;
      case MatchRecordType.OPTIONAL:
        return CstNodeType.OPT;
      default:
        throw new Error('unreachable');
    }
  }

  private get matchRecordType(): MatchRecordType {
    return (this._typeAndDetails & MATCH_RECORD_TYPE_MASK) as MatchRecordType;
  }

  isNonterminal(): this is NonterminalNode {
    return this.type === CstNodeType.NONTERMINAL;
  }

  isTerminal(): this is TerminalNode {
    return this.type === CstNodeType.TERMINAL;
  }

  isList(): this is ListNode {
    return this.type === CstNodeType.LIST;
  }

  isOptional(): this is OptNode {
    return this.type === CstNodeType.OPT;
  }

  isSeq(): this is SeqNode {
    return false;
  }

  get ctorName(): string {
    switch (this.type) {
      case CstNodeType.NONTERMINAL: {
        const {ruleNames, view} = this._ctx;
        const ruleId = view.getInt32(this._base + 8, true) >>> 2;
        return ruleNames[ruleId].split('<')[0];
      }
      case CstNodeType.TERMINAL:
        return '_terminal';
      case CstNodeType.LIST:
        return '_list';
      case CstNodeType.OPT:
        return '_opt';
      case CstNodeType.SEQ:
        return '_seq';
    }
  }

  get count(): number {
    if (isTaggedTerminal(this._base)) return 0;
    return this._ctx.view.getUint32(this._base, true);
  }

  get matchLength(): number {
    if (isTaggedTerminal(this._base)) return this._base >>> 1;
    return this._ctx.view.getUint32(this._base + 4, true);
  }

  get _typeAndDetails(): number {
    if (isTaggedTerminal(this._base)) return MatchRecordType.TERMINAL;
    return this._ctx.view.getInt32(this._base + 8, true);
  }

  get arity(): number {
    return this._typeAndDetails >>> 2;
  }

  get children(): CstNodeChildren {
    if (!this._children) {
      const rawChildren = this._computeRawChildren();
      switch (this.matchRecordType) {
        case MatchRecordType.OPTIONAL:
          if (rawChildren.length <= 1) {
            this._children = rawChildren;
          } else {
            this._children = [
              new SeqNodeImpl(rawChildren, this.source, this.sourceString) as CstNode,
            ];
          }
          break;
        case MatchRecordType.ITER_FLAG:
          if (this.arity <= 1) {
            this._children = rawChildren;
          } else {
            const arr: CstNode[] = [];
            let startIdx = this.startIdx;
            for (let i = 0; i < rawChildren.length; i += this.arity) {
              const seqChildren = rawChildren.slice(i, i + this.arity);
              const endIdx = checkNotNull(seqChildren.at(-1)).source.endIdx;
              const sourceString = this._ctx.input.slice(startIdx, endIdx);
              arr.push(
                new SeqNodeImpl(seqChildren, {startIdx, endIdx}, sourceString) as CstNode
              );
              startIdx = endIdx;
            }
            assert(startIdx === this.source.endIdx);
            this._children = arr;
          }
          break;
        default:
          this._children = rawChildren;
          break;
      }
    }
    return this._children;
  }

  // Compute direct children, filtering out $spaces and attaching them as leadingSpaces.
  private _computeRawChildren(): CstNodeChildren {
    const children: CstNode[] = [];
    let spaces: NonterminalNode | undefined;
    let {startIdx} = this;
    for (let i = 0; i < this.count; i++) {
      const slotOffset = this._base + 16 + i * 4;
      const ptr = this._ctx.view.getUint32(slotOffset, true);
      const node = new CstNodeImpl(this._ctx, ptr, startIdx);
      if (
        node.matchRecordType === MatchRecordType.NONTERMINAL &&
        node.ctorName === '$spaces'
      ) {
        assert(!spaces, 'Multiple $spaces nodes found');
        spaces = node as NonterminalNode;
      } else {
        if (spaces) {
          node.leadingSpaces = spaces;
          spaces = undefined;
        }
        children.push(node as CstNode);
      }
      startIdx += node.matchLength;
    }
    assert(spaces === undefined, 'Unclaimed $spaces!');
    return children;
  }

  get sourceString(): string {
    return this._ctx.input.slice(this.startIdx, this.startIdx + this.matchLength);
  }

  get value(): string {
    return this.sourceString;
  }

  isSyntactic(): boolean {
    assert(this.isNonterminal(), 'Not a nonterminal');
    const firstChar = this.ctorName[0];
    return firstChar === firstChar.toUpperCase();
  }

  isLexical(): boolean {
    assert(this.isNonterminal(), 'Not a nonterminal');
    return !this.isSyntactic();
  }

  // ListNode
  collect<R>(cb: (...args: CstNode[]) => R): R[] {
    return this.children.map(c => {
      return c?.isSeq() ? c.unpack(cb) : cb(c);
    });
  }

  // OptNode
  ifPresent<R>(consume: (...args: any[]) => R, orElse?: () => R): R | undefined {
    const child = this.children[0];
    if (child) {
      return child.isSeq()
        ? child.unpack(consume as (...children: any[]) => R)
        : consume(child);
    }
    if (orElse) return orElse();
  }

  isPresent(): boolean {
    return this.children.length > 0;
  }

  isEmpty(): boolean {
    return this.children.length === 0;
  }

  toString(): string {
    const ctorName = this.isTerminal() ? '_terminal' : this.ctorName;
    const {sourceString, startIdx} = this;
    return `CstNode {ctorName: ${ctorName}, sourceString: ${sourceString}, startIdx: ${startIdx} }`;
  }
}

// SeqNode is the only purely synthetic node type — it has no Wasm match record,
// and is created when grouping children of ITER_FLAG (arity > 1) or OPTIONAL (> 1 child).
class SeqNodeImpl implements CstNodeBase {
  type: typeof CstNodeType.SEQ = CstNodeType.SEQ;
  ctorName = '_seq' as const;
  source: {startIdx: number; endIdx: number};
  sourceString: string;
  children: CstNodeChildren;

  constructor(
    children: CstNodeChildren,
    source: {startIdx: number; endIdx: number},
    sourceString: string
  ) {
    this.source = source;
    this.sourceString = sourceString;
    this.children = children;
  }

  get matchLength(): number {
    return this.sourceString.length;
  }

  isNonterminal(): this is NonterminalNode {
    return false;
  }
  isTerminal(): this is TerminalNode {
    return false;
  }
  isOptional(): this is OptNode {
    return false;
  }
  isSeq(): this is SeqNode {
    return true;
  }
  isList(): this is ListNode {
    return false;
  }

  unpack<R>(cb: (...args: CstNodeChildren) => R): R {
    assert(
      cb.length === this.children.length,
      `bad arity: expected ${this.children.length}, got ${cb.length}`
    );
    return cb.call(null, ...this.children);
  }
}
