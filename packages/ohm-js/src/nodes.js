import * as common from './common.js';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

export class Node {
  constructor(matchLength) {
    this.matchLength = matchLength;
  }

  get ctorName() {
    throw new Error('subclass responsibility');
  }

  numChildren() {
    return this.children ? this.children.length : 0;
  }

  childAt(idx) {
    if (this.children) {
      return this.children[idx];
    }
  }

  indexOfChild(arg) {
    return this.children.indexOf(arg);
  }

  hasChildren() {
    return this.numChildren() > 0;
  }

  hasNoChildren() {
    return !this.hasChildren();
  }

  onlyChild() {
    if (this.numChildren() !== 1) {
      throw new Error(
        'cannot get only child of a node of type ' +
          this.ctorName +
          ' (it has ' +
          this.numChildren() +
          ' children)'
      );
    } else {
      return this.firstChild();
    }
  }

  firstChild() {
    if (this.hasNoChildren()) {
      throw new Error(
        'cannot get first child of a ' + this.ctorName + ' node, which has no children'
      );
    } else {
      return this.childAt(0);
    }
  }

  lastChild() {
    if (this.hasNoChildren()) {
      throw new Error(
        'cannot get last child of a ' + this.ctorName + ' node, which has no children'
      );
    } else {
      return this.childAt(this.numChildren() - 1);
    }
  }

  childBefore(child) {
    const childIdx = this.indexOfChild(child);
    if (childIdx < 0) {
      throw new Error('Node.childBefore() called w/ an argument that is not a child');
    } else if (childIdx === 0) {
      throw new Error('cannot get child before first child');
    } else {
      return this.childAt(childIdx - 1);
    }
  }

  childAfter(child) {
    const childIdx = this.indexOfChild(child);
    if (childIdx < 0) {
      throw new Error('Node.childAfter() called w/ an argument that is not a child');
    } else if (childIdx === this.numChildren() - 1) {
      throw new Error('cannot get child after last child');
    } else {
      return this.childAt(childIdx + 1);
    }
  }

  isTerminal() {
    return false;
  }

  isNonterminal() {
    return false;
  }

  isIteration() {
    return false;
  }

  isOptional() {
    return false;
  }
}

// Terminals

export class TerminalNode extends Node {
  get ctorName() {
    return '_terminal';
  }

  isTerminal() {
    return true;
  }

  get primitiveValue() {
    throw new Error('The `primitiveValue` property was removed in Ohm v17.');
  }
}

// Nonterminals

export class NonterminalNode extends Node {
  constructor(ruleName, children, childOffsets, matchLength) {
    super(matchLength);
    this.ruleName = ruleName;
    this.children = children;
    this.childOffsets = childOffsets;
  }

  get ctorName() {
    return this.ruleName;
  }

  isNonterminal() {
    return true;
  }

  isLexical() {
    return common.isLexical(this.ctorName);
  }

  isSyntactic() {
    return common.isSyntactic(this.ctorName);
  }
}

// Lists (row-based iteration: container for repetitions and optionals).
// In the v17 engine, ListNode is used for both; the isOptional flag distinguishes them.
// In v18, optionals get their own OptNode — see v18.js, which also patches isList()
// onto the prototype.

export class ListNode extends Node {
  constructor(children, childOffsets, matchLength, isOptional) {
    super(matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
    this.optional = isOptional;
  }

  get ctorName() {
    return '_list';
  }

  isOptional() {
    return this.optional;
  }
}

// Seqs (row-based iteration: a single row grouping multiple bindings).
// Used for v18 compatibility — see v18.js, which patches isSeq() onto the prototype.

export class SeqNode extends Node {
  constructor(children, childOffsets, matchLength) {
    super(matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
  }

  get ctorName() {
    return '_seq';
  }
}

// Iterations

export class IterationNode extends Node {
  constructor(children, childOffsets, matchLength, isOptional) {
    super(matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
    this.optional = isOptional;
  }

  get ctorName() {
    return '_iter';
  }

  isIteration() {
    return true;
  }

  isOptional() {
    return this.optional;
  }
}
