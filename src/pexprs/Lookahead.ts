import PExpr from './PExpr';

export default class Lookahead extends PExpr {
  constructor(public expr: PExpr) {
    super();
  }
}
