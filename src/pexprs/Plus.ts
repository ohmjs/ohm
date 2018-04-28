import Iter from './Iter';
import PExpr from './PExpr';

export default class Star extends Iter {
  constructor(expr: PExpr) {
    super(expr, '+', 1, Number.POSITIVE_INFINITY);
  }
}
