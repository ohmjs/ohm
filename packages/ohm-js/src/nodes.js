'use strict';

const common = require('./common');

// Ensures that the deprecation warning for `primitiveValue` only appears once.
let didWarnForPrimitiveValue = false;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

class Node {
  constructor(grammar, ctorName, matchLength) {
    this.grammar = grammar;
    this.ctorName = ctorName;
    this.matchLength = matchLength;
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

  toJSON() {
    return {[this.ctorName]: this.children};
  }
}

// Terminals

class TerminalNode extends Node {
  constructor(grammar, value) {
    const matchLength = value ? value.length : 0;
    super(grammar, '_terminal', matchLength);
    this._value = value;
  }

  isTerminal() {
    return true;
  }

  toJSON() {
    return {[this.ctorName]: this._value};
  }

  get primitiveValue() {
    if (!didWarnForPrimitiveValue) {
      // eslint-disable-next-line no-console
      console.warn(
          'Warning: primitiveValue is deprecated and will be removed in a future version of Ohm. ' +
          'Use sourceString instead.'
      );
      didWarnForPrimitiveValue = true;
    }

    return this._value;
  }
}

// Nonterminals

class NonterminalNode extends Node {
  constructor(grammar, ruleName, children, childOffsets, matchLength) {
    super(grammar, ruleName, matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
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

// Iterations

class IterationNode extends Node {
  constructor(grammar, children, childOffsets, matchLength, isOptional) {
    super(grammar, '_iter', matchLength);
    this.children = children;
    this.childOffsets = childOffsets;
    this.optional = isOptional;
  }

  isIteration() {
    return true;
  }

  isOptional() {
    return this.optional;
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  Node,
  TerminalNode,
  NonterminalNode,
  IterationNode,
};
