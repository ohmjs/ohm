'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toJson = common.abstract;

pexprs.any.toJson = function(formals) {
  return {
    type: 'any'
  };
};

pexprs.end.toJson = function(formals) {
  return {
    type: 'end'
  };
};

pexprs.Prim.prototype.toJson = function(formals) {
  return {
    type: 'prim',
    obj: this.obj
  };
};

pexprs.Range.prototype.toJson = function(formals) {
  return {
    type: 'range',
    from: this.from,
    to: this.to
  };
};

pexprs.Param.prototype.toJson = function(formals) {
  return {
    type: 'param',
    index: this.index
  };
};

pexprs.Alt.prototype.toJson = function(formals) {
  return {
    type: 'alt',
    terms: this.terms.map(function(t) { return t.toJson(formals); })
  };
};

pexprs.Extend.prototype.toJson = function(formals) {
  return this.terms[0].toJson(formals);
};

pexprs.Seq.prototype.toJson = function(formals) {
  return {
    type: 'seq',
    factors: this.factors.map(function(f) { return f.toJson(formals); })
  };
};

pexprs.Star.prototype.toJson = function(formals) {
  return {
    type: 'star',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Plus.prototype.toJson = function(formals) {
  return {
    type: 'plus',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Opt.prototype.toJson = function(formals) {
  return {
    type: 'opt',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Not.prototype.toJson = function(formals) {
  return {
    type: 'not',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Lookahead.prototype.toJson = function(formals) {
  return {
    type: 'lookahead',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Lex.prototype.toJson = function(formals) {
  return {
    type: 'lex',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Value.prototype.toJson = function(formals) {
  return {
    type: 'val',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Arr.prototype.toJson = function(formals) {
  return {
    type: 'arr',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Str.prototype.toJson = function(formals) {
  return {
    type: 'str',
    expr: this.expr.toJson(formals)
  };
};

pexprs.Obj.prototype.toJson = function(formals) {
  return {
    type: 'obj',
    lenient: !!this.isLenient,
    properties: this.properties.map(function(p) {
      return {
        name: p.name,
        pattern: p.pattern.toJson(formals)
      };
    })
  };
};

pexprs.Apply.prototype.toJson = function(formals) {
  var args;
  if (this.ruleName.indexOf('_') >= 0 && formals.length > 0) {
    args = formals;
  } else if (this.args.length > 0) {
    args = this.args.map(function(arg) { return arg.toJson(formals); });
  }
  return {
    type: 'app',
    rule: this.ruleName,
    args: args
  };
};

pexprs.UnicodeChar.prototype.toJson = function(formals) {
  return {
    type: 'unicodeChar',
    category: this.category
  };
};

pexprs.TypeCheck.prototype.toJson = function(formals) {
  return {
    type: 'typeCheck',
    expectedType: this.type
  };
};
