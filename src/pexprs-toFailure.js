'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');
var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toFailure = common.abstract;

pexprs.any.toFailure =
pexprs.end.toFailure = function(ruleBodies) {
  return new Failure(this.description, 'description');
};

pexprs.Prim.prototype.toFailure = function(ruleBodies) {
  return typeof this.obj === 'string' ?
    new Failure(this.obj, 'string') :
    new Failure(JSON.stringify(this.obj), 'code');
};

pexprs.Range.prototype.toFailure = function(ruleBodies) {
  // TODO: come up with something better
  return new Failure(JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function(ruleBodies) {
  var description = this.expr === pexprs.any ?
      'nothing' :
      'not ' + this.expr.toFailure(ruleBodies);
  return new Failure(description, 'description');
};

// TODO: think about Arr, Str, and Obj

pexprs.Apply.prototype.toFailure = function(ruleBodies) {
  var description = ruleBodies[this.ruleName].description;
  if (!description) {
    var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    description = article + ' ' + this.ruleName;
  }
  return new Failure(description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function(ruleBodies) {
  return new Failure(this.toDisplayString(), 'description');
};
