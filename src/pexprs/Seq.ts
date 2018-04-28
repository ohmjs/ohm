import PExpr from './PExpr';

export default class Seq extends PExpr {
  constructor(public factors: PExpr[]) {
    super();
  }

  toString(): string {
    if (this.factors.length === 1) {
      return this.factors[0].toString();
    }
    return '(' + this.factors.map(fac => fac.toString()).join(' ') + ')';
  }
}
