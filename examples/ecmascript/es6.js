/* eslint-env node */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(ohm, ns, es5semantics) {
  var g = ohm.grammar(fs.readFileSync(path.join(__dirname, 'es6.ohm')).toString(), ns);

// Cut and paste below here

var s = g.extendSemantics(es5semantics);

s.extendOperation('toES5', {
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

s.addOperation('mentionsThis()', {
  this(_) { return true; },
  _terminal() { return false; },
  _nonterminal(c) {
    return c.some(n => n.mentionsThis());
  },
  _iter(arr) {
    return arr.some(n => n.mentionsThis());
  }
});

// -----------

  return {
    grammar: g,
    semantics: s
  };
};
