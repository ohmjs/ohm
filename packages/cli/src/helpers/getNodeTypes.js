import * as ohm from 'ohm-js';

const {pexprs} = ohm;

// Helpers
// -------

class UnionType {
  constructor(type) {
    this.types = new Set([type]);
  }

  merge(aUnionType) {
    aUnionType.types.forEach(t => this.types.add(t));
  }

  toString(prefix = '') {
    const format = t => (prefix ? `${prefix}.${t}` : t);
    if (this.types.has('Node') || this.types.size >= 3) {
      return format('Node');
    }
    return Array.from(this.types).sort().map(format).join(' | ');
  }
}

function flatMap(arr, cb) {
  return [].concat(...arr.map(cb));
}

function _getNodeTypes(pexpr) {
  if (
    pexpr === pexprs.any ||
    pexpr === pexprs.end ||
    pexpr instanceof pexprs.CaseInsensitiveTerminal ||
    pexpr instanceof pexprs.Range ||
    pexpr instanceof pexprs.Terminal ||
    pexpr instanceof pexprs.UnicodeChar
  ) {
    return [new UnionType('TerminalNode')];
  }

  if (pexpr instanceof pexprs.Apply) {
    return [new UnionType('NonterminalNode')];
  }

  if (pexpr instanceof pexprs.Param) {
    return [new UnionType('Node')];
  }

  if (pexpr instanceof pexprs.Alt) {
    const {terms} = pexpr;
    if (terms.length === 0) return [];

    const result = _getNodeTypes(terms[0]);
    for (const term of terms.slice(1)) {
      _getNodeTypes(term).forEach((termType, i) => result[i].merge(termType));
    }
    return result;
  }

  if (pexpr instanceof pexprs.Seq) {
    return flatMap(pexpr.factors, f => _getNodeTypes(f));
  }

  if (pexpr instanceof pexprs.Iter) {
    // TODO(pdubroy): Should IterationNode have a type parameter?
    return flatMap(_getNodeTypes(pexpr.expr), () => new UnionType('IterationNode'));
  }

  if (pexpr instanceof pexprs.Not) {
    return [];
  }

  if (pexpr instanceof pexprs.Lookahead || pexpr instanceof pexprs.Lex) {
    return _getNodeTypes(pexpr.expr);
  }
  throw new Error(`Not implemented for ${pexpr.constructor.name}`);
}

export function getNodeTypes(pexpr, prefix = '') {
  return _getNodeTypes(pexpr).map(t => t.toString(prefix));
}
