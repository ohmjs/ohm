import PExpr from './PExpr';

abstract class Iter extends PExpr {
  constructor(
    public expr: PExpr,
    public operator: string,
    public minNumMatches: number,
    public maxNumMatches: number
  ) {
    super();
  }
}

export default Iter;
