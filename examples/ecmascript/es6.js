/* eslint-env node */

'use strict';

var fs = require('fs');
var path = require('path');

function anyNodesMentionThis(nodes) {
  return nodes.some(function(n) { return n.mentionsThis(); });
}

module.exports = function(ohm, ns, s) {
  var g = ohm.grammar(fs.readFileSync(path.join(__dirname, 'es6.ohm')).toString(), ns);
  var semantics = g.extendSemantics(s);

  // Returns true if the `this` keyword appears anywhere in the node's subtree, otherwise false.
  semantics.addOperation('mentionsThis()', {
    this: function(_) { return true; },
    _terminal: function() { return false; },
    _nonterminal: anyNodesMentionThis,
    _iter: anyNodesMentionThis
  });

semantics.extendOperation('toES5', {
  ArrowFunction(params, _, arrow, body) {
    var def =
        'function ' + params.toES5() +
        ' ' + body.toES5();
    if (body.mentionsThis()) {
      def += '.bind(this)';
    }
    return def;
  },
  ArrowParameters_unparenthesized(id) {
    return '(' + id.toES5() + ')';
  },
  ConciseBody_noBraces(e) {
    return '{ return ' + e.toES5() + ' }';
  }
});

  return {
    grammar: g,
    semantics: semantics
  };
};
