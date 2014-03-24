// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');

var awlib = require('awlib');
var printString = awlib.stringUtils.printString;
var makeStringBuffer = awlib.objectUtils.stringBuffer;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toExpected = common.abstract;

pexprs.anything.toExpected = function() {
  return "any object";
};

pexprs.end.toExpected = function() {
  return "end of input";
};

pexprs.Prim.prototype.toExpected = function() {
  return printString(this.obj);
};

pexprs.Not.prototype.toExpected = function() {
  return "not " + this.expr.toExpected();
};

// TODO
pexprs.Str.prototype.toExpected = function() {
  return "a string";
};

// TODO
pexprs.List.prototype.toExpected = function() {
  return "a list";
};

// TODO
pexprs.Obj.prototype.toExpected = function() {
  return "an object";
};

pexprs.Apply.prototype.toExpected = function() {
  var article = /[aeiouAEIOU]/.test(this.ruleName.charAt(0)) ? "an" : "a";
  return article + " " + this.ruleName;
};

