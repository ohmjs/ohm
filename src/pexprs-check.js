// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var nodes = require('./nodes.js');
var pexprs = require('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.check = common.abstract;

pexprs.anything.check = function(vals) {
  return 1;
};

pexprs.end.check = function(vals) {
  return (vals[0] instanceof nodes.ValueNode && vals[0].value === undefined) && 1;
};

pexprs.Prim.prototype.check = function(vals) {
  return (vals[0] instanceof nodes.ValueNode && vals[0].value === this.obj) && 1;
};

pexprs.RegExpPrim.prototype.check = function(vals) {
  // TODO: more efficient "total match checker" than the use of .replace here
  return (vals[0] instanceof nodes.ValueNode
	  && typeof vals[0].value === 'string'
	  && vals[0].value.replace(this.obj, '') === '') && 1;
};

pexprs.Alt.prototype.check = function(vals) {
  for (var i = 0; i < this.terms.length; i++) {
    var result = this.terms[i].check(vals[0]);
    if (result !== false) {
      return result;
    }
  }
  return false;
};

pexprs.Seq.prototype.check = function(vals) {
  var pos = 0;
  for (var i = 0; i < this.factors.length; i++) {
    var result = this.factors[i].check(vals.slice(pos));
    if (result === false) {
      return result;
    }
    pos += result;
  }
  return pos;
};

pexprs.Many.prototype.check = function(vals) {
  var i;
  var arity = this.getArity();
  if (arity === 0) {
    // TODO: make this a static check w/ a nice error message, then remove the dynamic check.
    // cf. pexprs-eval.js for Many
    throw 'fix me!';
  }

  var columns = vals.slice(0, arity);
  if (columns.length !== arity) {
    return false;
  }
  var rowcount = columns[0].length;
  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowcount) {
      return false;
    }
  }

  for (i = 0; i < rowcount; i++) {
    var row = []
    for (var j = 0; j < arity; j++) {
      row.push(columns[j][i]);
    }
    var result = this.expr.check(row);
    if (result !== arity) {
      return result;
    }
  }

  return arity;
};

pexprs.Opt.prototype.check = function(vals) {
  var i;
  var arity = this.getArity();
  var allUndefined = true;
  for (i = 0; i < arity; i++) {
    if (vals[i] !== undefined) {
      allUndefined = false;
      break;
    }
  }

  if (allUndefined) {
    return arity;
  } else {
    return this.expr.check(vals);
  }
};

pexprs.Not.prototype.check = function(vals) {
  return 0;
};

pexprs.Lookahead.prototype.check = function(vals) {
  return this.expr.check(vals);
};

pexprs.Listy.prototype.check = function(vals) {
  return this.expr.check(vals);
};

pexprs.Obj.prototype.check = function(vals) {
  var i;
  var fixedArity = this.getArity();
  if (this.isLenient) {
    fixedArity--;
  }

  var pos = 0;
  for (var i = 0; i < fixedArity; i++) {
    var result = this.properties[i].pattern.check(vals.slice(pos));
    if (result === false) {
      return result;
    }
    pos += result;
  }

  if (this.isLenient) {
    if (!(typeof vals[pos] === 'object' && vals !== null) ) {
      return false;
    }
    pos++;
  }

  return pos;
};

