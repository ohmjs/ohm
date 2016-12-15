/* eslint-env node */

'use strict';

var fs = require('fs');
var path = require('path');

// Semantic actions for the `mentionsThis` attribute, which returns true for a node
// if the `this` keyword appears anywhere in the node's subtree, and otherwise false.
var mentionsThisActions = {
  this: function(_) { return true; },
  _terminal: function() { return false; },
  _nonterminal: anyNodesMentionThis,
  _iter: anyNodesMentionThis
};

function anyNodesMentionThis(nodes) {
  return nodes.some(function(n) { return n.mentionsThis; });
}

var toES5Actions = {
  ArrowFunction: function(params, _, arrow, body) {
    var source = 'function ' + params.toES5() + ' ' + body.toES5();
    // Only use `bind` if necessary.
    return body.mentionsThis ? source + '.bind(this)' : source;
  },
  ArrowParameters_unparenthesized: function(id) {
    return '(' + id.toES5() + ')';
  },
  ConciseBody_noBraces: function(exp) {
    return '{ return ' + exp.toES5() + ' }';
  }
};

module.exports = function(ohm, ns, s) {
  var g = ohm.grammar(fs.readFileSync(path.join(__dirname, 'es6.ohm')).toString(), ns);
  var semantics = g.extendSemantics(s);
  semantics.addAttribute('mentionsThis', mentionsThisActions);
  semantics.extendOperation('toES5', toES5Actions);

  return {
    grammar: g,
    semantics: semantics
  };
};
