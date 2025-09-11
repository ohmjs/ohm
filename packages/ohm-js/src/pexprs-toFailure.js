import {abstract} from './common.js';
import * as pexprs from './pexprs-main.js';
import {Failure} from './Failure.js';

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toFailure = abstract('toFailure');

pexprs.any.toFailure = function (grammar) {
  return new Failure(this, 'any object', 'description');
};

pexprs.end.toFailure = function (grammar) {
  return new Failure(this, 'end of input', 'description');
};

pexprs.Terminal.prototype.toFailure = function (grammar) {
  return new Failure(this, this.obj, 'string');
};

pexprs.Range.prototype.toFailure = function (grammar) {
  // TODO: come up with something better
  return new Failure(this, JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function (grammar) {
  const description =
    this.expr === pexprs.any ? 'nothing' : 'not ' + this.expr.toFailure(grammar);
  return new Failure(this, description, 'description');
};

pexprs.Lookahead.prototype.toFailure = function (grammar) {
  return this.expr.toFailure(grammar);
};

pexprs.Apply.prototype.toFailure = function (grammar) {
  let {description} = grammar.rules[this.ruleName];
  if (!description) {
    const article = /^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a';
    description = article + ' ' + this.ruleName;
  }
  return new Failure(this, description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function (grammar) {
  return new Failure(this, 'a Unicode [' + this.categoryOrProp + '] character', 'description');
};

pexprs.Alt.prototype.toFailure = function (grammar) {
  const fs = this.terms.map(t => t.toFailure(grammar));
  const description = '(' + fs.join(' or ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Seq.prototype.toFailure = function (grammar) {
  const fs = this.factors.map(f => f.toFailure(grammar));
  const description = '(' + fs.join(' ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Iter.prototype.toFailure = function (grammar) {
  const description = '(' + this.expr.toFailure(grammar) + this.operator + ')';
  return new Failure(this, description, 'description');
};
