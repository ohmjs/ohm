import PExpr from './PExpr';

class Any extends PExpr {
  static instance = new Any();

  toString(): string {
    return 'any';
  }
}

export default Any.instance;
