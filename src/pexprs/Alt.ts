import PExpr from './PExpr';

export default class Alt extends PExpr {
  constructor(public terms: PExpr[]) {
    super();
  }
}
