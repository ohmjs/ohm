// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract;

pexprs.anything.outputRecipe = function(sb) {
  sb.append('this.anything()');
};

pexprs.end.outputRecipe = function(sb) {
  sb.append('this.end()');
};

pexprs.Prim.prototype.outputRecipe = function(sb) {
  sb.append('this.prim(');
  sb.append(typeof this.obj === 'string' ? common.toStringLiteral(this.obj) : '' + this.obj);
  sb.append(')');
};

pexprs.Alt.prototype.outputRecipe = function(sb) {
  sb.append('this.alt(');
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    this.terms[idx].outputRecipe(sb);
  }
  sb.append(')');
};

pexprs.Seq.prototype.outputRecipe = function(sb) {
  sb.append('this.seq(');
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    this.factors[idx].outputRecipe(sb);
  }
  sb.append(')');
};

pexprs.Many.prototype.outputRecipe = function(sb) {
  sb.append('this.many(');
  this.expr.outputRecipe(sb);
  sb.append(', ');
  sb.append(this.minNumMatches);
  sb.append(')');
};

pexprs.Opt.prototype.outputRecipe = function(sb) {
  sb.append('this.opt(');
  this.expr.outputRecipe(sb);
  sb.append(')');
};

pexprs.Not.prototype.outputRecipe = function(sb) {
  sb.append('this.not(');
  this.expr.outputRecipe(sb);
  sb.append(')');
};

pexprs.Lookahead.prototype.outputRecipe = function(sb) {
  sb.append('this.la(');
  this.expr.outputRecipe(sb);
  sb.append(')');
};

pexprs.Arr.prototype.outputRecipe = function(sb) {
  sb.append('this.arr(');
  this.expr.outputRecipe(sb);
  sb.append(')');
};

pexprs.Str.prototype.outputRecipe = function(sb) {
  sb.append('this.str(');
  this.expr.outputRecipe(sb);
  sb.append(')');
};

pexprs.Obj.prototype.outputRecipe = function(sb) {
  function outputPropertyRecipe(prop) {
    sb.append('{name: ');
    sb.append(common.toStringLiteral(prop.name));
    sb.append(', pattern: ');
    prop.pattern.outputRecipe(sb);
    sb.append('}');
  }

  sb.append('this.obj([');
  for (var idx = 0; idx < this.properties.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    outputPropertyRecipe(this.properties[idx]);
  }
  sb.append('], ');
  sb.append(!!this.isLenient);
  sb.append(')');
};

pexprs.Apply.prototype.outputRecipe = function(sb) {
  sb.append('this.app(');
  sb.append(common.toStringLiteral(this.ruleName));
  sb.append(')');
};

