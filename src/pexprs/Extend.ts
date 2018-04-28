import Alt from './Alt';
import PExpr from './PExpr';

export default class Extend extends Alt {
  constructor(public superGrammar /* : Grammar */, public name: string, public body: PExpr) {
    super([body, superGrammar.rules[name].body]);
  }
}
