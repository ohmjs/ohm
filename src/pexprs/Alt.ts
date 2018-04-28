import PExpr from './PExpr';

export default class Alt extends PExpr {
  constructor(public terms: PExpr[]) {
    super();
  }

  toString(): string {
    if (this.terms.length === 1) {
      return this.terms[0].toString();
    }
    return '(' + this.terms.map(term => term.toString()).join(' | ') + ')';
  }
}
