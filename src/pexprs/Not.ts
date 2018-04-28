import PExpr from './PExpr';

export default class Not extends PExpr {
  constructor(public expr: PExpr) {
    super();
  }
}
