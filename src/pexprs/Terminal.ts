import PExpr from './PExpr';

export default class Terminal extends PExpr {
  constructor(public obj: string) {
    super();
  }
}
