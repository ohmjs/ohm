'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/* Trying to convert pexpr to string that could be used as argument of function. */
/* Rulename could be used directly, and for those we don't have a better way to */
/* represent, use '$'+index (index in the arguement list) */

pexprs.PExpr.prototype.toArgumentString = common.abstract;

pexprs.any.toArgumentString = function() {
  return 'any';
};

pexprs.end.toArgumentString =
pexprs.Not.prototype.toArgumentString =
pexprs.Lookahead.prototype.toArgumentString = function() {
  return undefined;
};

pexprs.Prim.prototype.toArgumentString =
pexprs.Lex.prototype.toArgumentString =
pexprs.Value.prototype.toArgumentString =
pexprs.Obj.prototype.toArgumentString =
pexprs.UnicodeChar.prototype.toArgumentString = function() {
  return '';
};

pexprs.Range.prototype.toArgumentString = function() {
  return 'from_' + this.from.toString().split(',').join('_') +
         '_to_' + this.to.toString().split(',').join('_');
};

pexprs.Alt.prototype.toArgumentString = function() {
  return 'alt';
};

pexprs.Param.prototype.toArgumentString = function() {
  return '$param' + this.index;
};

pexprs.Seq.prototype.toArgumentString = function() {
  var ans = [];
  var count = {};
  this.factors.forEach(function(factor, idx) {
    if (factor.toArgumentString() === undefined) {
      return;
    }

    var arg = factor.toArgumentString().length > 0 ?
      factor.toArgumentString() :
      '$' + (ans.length + 1);

    // Check if argument name duplicated
    if (!count[arg]) {
      count[arg] = 1;
    } else {
      if (count[arg] === 1) {
        ans[ans.indexOf(arg)] = arg + '_1';
      }
      arg = arg + '_' + (++count[arg]);
    }

    ans.push(arg);
  });

  return ans.join(',');
};

pexprs.Iter.prototype.toArgumentString = function() {
  var str = this.expr.toArgumentString();
  if (str === undefined) {
    return undefined;
  }

  str = str.length === 0 ? 'Iter' : str.split(',').join('_');
  switch (this.operator) {
    case '*':
    case '+':
      return str + 's'; // return `argument`s
    case '?': return 'opt' + str; // return opt`argument`
  }
};

pexprs.Arr.prototype.toArgumentString = function() {
  return 'array_' + this.expr.toString().split(',').join('_');
};

pexprs.Apply.prototype.toArgumentString = function() {
  return this.ruleName;
};

pexprs.TypeCheck.prototype.toArgumentString = function() {
  return this.type;
};
