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

pexprs.anything.toFailure = function(ruleDict) {
  return new Failure('any object', 'description');
};

pexprs.end.toFailure = function(ruleDict) {
  return new Failure('end of input', 'description');
};

pexprs.Prim.prototype.toFailure = function(ruleDict) {
  return typeof this.obj === 'string' ?
    new Failure(this.obj, 'string') :
    new Failure(JSON.stringify(this.obj), 'code');
};

pexprs.Range.prototype.toFailure = function(ruleDict) {
  // TODO: come up with something better
  return new Failure(JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function(ruleDict) {
  var description = this.expr === pexprs.anything ?
      'nothing' :
      'not ' + this.expr.toFailure(ruleDict);
  return new Failure(description, 'description');
};

// TODO: think about Arr, Str, and Obj

pexprs.Apply.prototype.toFailure = function(ruleDict) {
  var description = ruleDict[this.ruleName].description;
  if (!description) {
    var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    description = article + ' ' + this.ruleName;
  }
  return new Failure(description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function(ruleDict) {
  return new Failure(this.toDisplayString(), 'description');
};
