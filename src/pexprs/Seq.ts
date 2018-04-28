import PExpr from './PExpr';

export default class Seq extends PExpr {
  constructor(public factors: PExpr[]) {
    super();
  }
}
