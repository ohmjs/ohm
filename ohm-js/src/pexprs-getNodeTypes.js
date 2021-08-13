'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const common = require('./common');
const pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

class NodeType {
  constructor(...types) {
    this._types = new Set();
    this.add(...types);
  }

  add(...types) {
    for (const t of types) {
      this._types.add(t);
    }
  }

  toString() {
    if (this._types.has('Node') || this._types.size >= 3) {
      return 'Node';
    }
    return Array.from(this._types).sort().join(' | ');
  }

  * [Symbol.iterator]() {
    for (const t of this._types) {
      yield t;
    }
  }
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getNodeTypes = common.abstract('getNodeTypes');

pexprs.any.getNodeTypes =
  pexprs.end.getNodeTypes =
  pexprs.Terminal.prototype.getNodeTypes =
  pexprs.Range.prototype.getNodeTypes =
  pexprs.UnicodeChar.prototype.getNodeTypes =
    function() {
      return [new NodeType('TerminalNode')];
    };

pexprs.Apply.prototype.getNodeTypes = function() {
  return [new NodeType('NonterminalNode')];
};

pexprs.Param.prototype.getNodeTypes = function() {
  return [new NodeType('Node')];
};

pexprs.Alt.prototype.getNodeTypes = function() {
  if (this.terms.length === 0) return [];

  const result = this.terms[0].getNodeTypes();
  for (const term of this.terms.slice(1)) {
    for (const [i, termType] of term.getNodeTypes().entries()) {
      result[i].add(...termType);
    }
  }
  return result;
};

pexprs.Seq.prototype.getNodeTypes = function() {
  return this.factors.map(f => f.getNodeTypes());
};

pexprs.Iter.prototype.getNodeTypes = function() {
  // TODO(pdubroy): Should IterationNode have a type parameter?
  return this.expr.getNodeTypes().map(_ => new NodeType('IterationNode'));
};

pexprs.Not.prototype.getNodeTypes = function() {
  return [];
};

pexprs.Lookahead.prototype.getNodeTypes = pexprs.Lex.prototype.getNodeTypes = function() {
  return this.expr.getNodeTypes();
};
