import PExpr from './PExpr';

const common = require('../common');

export default class Apply extends PExpr {
  private _memoKey: string = null;

  constructor(public ruleName: string, public args: PExpr[] = []) {
    super();
  }

  isSyntactic(): boolean {
    return common.isSyntactic(this.ruleName);
  }

  toMemoKey(): string {
    if (this._memoKey === null) {
      this._memoKey = this.toString();
    }
    return this._memoKey;
  }

  toString(): string {
    if (this.args.length === 0) {
      return this.ruleName;
    }
    const ps = this.args.map(arg => arg.toString());
    return this.ruleName + '<' + ps.join(',') + '>';
  }
}
