import Iter from './Iter';
import PExpr from './PExpr';

export default class Plus extends Iter {
  constructor(expr: PExpr) {
    super(expr, '+', 1, Number.POSITIVE_INFINITY);
  }
}
