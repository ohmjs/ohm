import Iter from './Iter';
import PExpr from './PExpr';

export default class Opt extends Iter {
  constructor(expr: PExpr) {
    super(expr, '?', 0, 1);
  }
}
