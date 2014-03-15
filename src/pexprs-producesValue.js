// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.producesValue = function() {
  return true;
};

pexprs.Alt.prototype.producesValue = function() {
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (!this.terms[idx].producesValue()) {
      return false;
    }
  }
  return true;
}

pexprs.Seq.prototype.producesValue = function() {
  return false;
};

pexprs.Not.prototype.producesValue = function() {
  return false;
};

