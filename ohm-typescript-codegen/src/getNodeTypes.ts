import {timeStamp} from 'console';
import * as ohm from 'ohm-js';
import {tokenToString} from 'typescript';

const pexprs = (ohm as any).pexprs;

// Helpers
// -------

class UnionType {
  private types = new Set<string>();

  constructor(type: string) {
    this.types.add(type);
  }

  merge(other: UnionType) {
    other.types.forEach(t => this.types.add(t));
  }

  toString(prefix?: string) {
    const format = (t: string) => (prefix ? `${prefix}.${t}` : t);
    if (this.types.has('Node') || this.types.size >= 3) {
      return format('Node');
    }
    return Array.from(this.types).sort().map(format).join(' | ');
  }
}

function _getNodeTypes(pexpr: any): UnionType[] {
  if (
    pexpr === pexprs.any ||
    pexpr === pexprs.end ||
    pexpr instanceof pexprs.Terminal ||
    pexpr instanceof pexprs.Range ||
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
    const terms = pexpr['terms'];
    if (terms.length === 0) return [];

    const result = _getNodeTypes(terms[0]);
    for (const term of terms.slice(1)) {
      _getNodeTypes(term).forEach((termType, i) => result[i].merge(termType));
    }
    return result;
  }

  if (pexpr instanceof pexprs.Seq) {
    return pexpr['factors'].map((f: any) => _getNodeTypes(f));
  }

  if (pexpr instanceof pexprs.Iter) {
    // TODO(pdubroy): Should IterationNode have a type parameter?
    return _getNodeTypes(pexpr['expr']).map(() => new UnionType('IterationNode'));
  }

  if (pexpr instanceof pexprs.Not) {
    return [];
  }

  if (pexpr instanceof pexprs.Lookahead || pexpr instanceof pexprs.Lex) {
    return _getNodeTypes(pexpr['expr']);
  }
  throw new Error(`Not implemented for ${pexpr.constructor.name}`);
}

// Exports
// -------

export default function getNodeTypes(pexpr: any, prefix?: string): string[] {
  return _getNodeTypes(pexpr).map(t => t.toString(prefix));
}
