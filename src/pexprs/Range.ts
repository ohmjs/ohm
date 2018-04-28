import PExpr from './PExpr';

export default class Range extends PExpr {
  constructor(public from: string, public to: string) {
    super();
  }
}
