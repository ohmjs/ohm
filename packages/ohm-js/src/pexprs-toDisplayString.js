import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns a string representing the PExpr, for use as a UI label, etc.
pexprs.PExpr.prototype.toDisplayString = abstract('toDisplayString');

pexprs.Alt.prototype.toDisplayString = pexprs.Seq.prototype.toDisplayString = function () {
  if (this.source) {
    return this.source.trimmed().contents;
  }
  return '[' + this.constructor.name + ']';
};

pexprs.any.toDisplayString =
  pexprs.end.toDisplayString =
  pexprs.Iter.prototype.toDisplayString =
  pexprs.Not.prototype.toDisplayString =
  pexprs.Lookahead.prototype.toDisplayString =
  pexprs.Lex.prototype.toDisplayString =
  pexprs.Terminal.prototype.toDisplayString =
  pexprs.Range.prototype.toDisplayString =
  pexprs.Param.prototype.toDisplayString =
    function () {
      return this.toString();
    };

pexprs.Apply.prototype.toDisplayString = function () {
  if (this.args.length > 0) {
    const ps = this.args.map(arg => arg.toDisplayString());
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toDisplayString = function () {
  return 'Unicode [' + this.categoryOrProp + '] character';
};
