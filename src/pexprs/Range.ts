import PExpr from './PExpr';

export default class Range extends PExpr {
  constructor(public from: string, public to: string) {
    super();
  }

  toString(): string {
    return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
  }
}
