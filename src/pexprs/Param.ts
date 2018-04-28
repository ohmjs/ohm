import PExpr from './PExpr';

export default class Param extends PExpr {
  constructor(public index: number) {
    super();
  }
}
