import PExpr from './PExpr';

class End extends PExpr {
  static instance = new End();

  toString(): string {
    return 'end';
  }
}

export default End.instance;
