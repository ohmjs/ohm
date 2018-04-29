import Param from './Param';
import PExpr from './PExpr';
import Terminal from './Terminal';

const Failure = require('../Failure');
const { TerminalNode } = require('../nodes');
const { assert } = require('../common');

export default class CaseInsensitiveTerminal extends PExpr {
  constructor(public obj: Param) {
    super();
  }

  private _getString(state) {
    const terminal = state.currentApplication().args[this.obj.index];
    assert(terminal instanceof Terminal, 'expected a Terminal expression');
    return terminal.obj;
  }

  // Implementation of the PExpr API

  allowsSkippingPrecedingSpace(): boolean {
    return true;
  }

  eval(state /* : State */): boolean {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const matchStr = this._getString(state);
    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this);
      return false;
    } else {
      state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
      return true;
    }
  }

  generateExample(grammar, examples, inSyntacticContext, actuals) /* : todo */ {
    // Start with a example generated from the Terminal...
    const str = this.obj['generateExample'](grammar, examples, inSyntacticContext, actuals).value; // fixme generateExample

    // ...and randomly switch characters to uppercase/lowercase.
    let value = '';
    for (let i = 0; i < str.length; ++i) {
      value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
    }
    return {value: value};
  }

  getArity(): number {
    return 1;
  }

  substituteParams(actuals): CaseInsensitiveTerminal {
    return new CaseInsensitiveTerminal(this.obj['substituteParams'](actuals)); // fixme substituteParams
  }

  toDisplayString(): string {
    return this.obj['toDisplayString']() + ' (case-insensitive)'; // fixme toDisplayString
  }

  toFailure() /* : Failure */ {
    return new Failure(this, this.obj['toFailure']() + ' (case-insensitive)', 'description'); // fixme toFailure
  }

  _isNullable(grammar, memo): boolean {
    return this.obj['_isNullable'](grammar, memo); // fixme isNullable
  }

  toString(): string {
    return `caseInsensitive<${this.obj.toString()}>`;
  }
}
