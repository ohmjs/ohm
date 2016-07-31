'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('./pexprs');
var VisitorFamily = require('./VisitorFamily');

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

/*
  Defines the recursive shape of every type of PExpr by describing how to
  visit every child expression.

  Keys correspond to a value return from `getTag`, and the value must be:
  - a string, which is the property name that holds an expression's only child
  - an array of property names (or the empty array, indicating a leaf type), or
  - a function, which must apply its `fn` argument to every one of the expression's children.
 */
var shapes = {
  any: [],
  end: [],
  Alt: function(alt, fn) {
    return alt.terms.map(fn);
  },
  Apply: function(app, fn) {
    return app.args.map(fn);
  },
  Iter: 'expr',
  Extend: function(ext, fn) {
    return ext.terms.map(fn);
  },
  Lex: 'expr',
  Lookahead: 'expr',
  Not: 'expr',
  Opt: 'expr',
  Param: [],
  Plus: 'expr',
  Range: [],
  Seq: function(seq, fn) {
    return seq.factors.map(fn);
  },
  Star: 'expr',
  Terminal: [],
  UnicodeChar: []
};

// Retuns the key that will be used to look up the operation implementation function.
function getTag(obj) {
  switch (obj) {
    case pexprs.any:
      return 'any';
    case pexprs.end:
      return 'end';
    default:
      return obj.constructor.name;
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = new VisitorFamily({shapes: shapes, getTag: getTag});
