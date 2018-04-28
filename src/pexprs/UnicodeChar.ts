import PExpr from './PExpr';

const UnicodeCategories = require('../../third_party/UnicodeCategories');

export default class UnicodeChar extends PExpr {
  pattern: RegExp;

  constructor(public category: string) {
    super();
    this.pattern = UnicodeCategories[category];
  }
}
