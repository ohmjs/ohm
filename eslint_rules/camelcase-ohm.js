'use strict';

var camelcase = require('./third_party/camelcase');

// Checks whether the given node is considered an error by the camelcase rule.
function checkCamelCase(idNode) {
  var reported = false;
  var fakeContext = {
    report: function() { reported = true; },
    options: []
  };
  camelcase(fakeContext).Identifier(idNode);  // eslint-disable-line new-cap
  return !reported;
}

// Reports an AST node as a rule violation.
function report(context, node) {
  context.report(node, "Identifier '{{name}}' is not camel case.", {name: node.name});
}

// Returns true if `name` appears to be the name of a semantic action.
// The idiomatic style in Ohm is `RuleName_caseName`.
function checkSemanticActionName(node) {
  var name = node.name;
  var underscoreIdx = name.indexOf('_');

  // The underscore should not appear on the ends,
  // case names should begin with a lowercase letter,
  // and there should be only one underscore in the name.
  if ((underscoreIdx > 0 && underscoreIdx < (name.length - 1)) &&
      name[underscoreIdx + 1] === name[underscoreIdx + 1].toLowerCase() &&
      name.indexOf('_', underscoreIdx + 1) === -1) {
    return true;
  }
  return false;
}

module.exports = function(context) {
  return {
    Identifier: function(node) {
      if (!checkCamelCase(node) && !checkSemanticActionName(node)) {
        report(context, node);
      }
    }
  };
};
