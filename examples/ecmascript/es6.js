/* eslint-env node */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = function(ohm, ns, s) {
  var g = ohm.grammar(fs.readFileSync(path.join(__dirname, 'es6.ohm')).toString(), ns);
  var semantics = g.extendSemantics(s).extendAttribute('modifiedSource', {
    ArrowFunction: function(params, _, body) {
      return 'function ' + params.asES5 + ' { ' + body.asES5 + ' }.bind(this)';
    },
    ArrowParameters_unparenthesized: function(id) {
      return '(' + id.asES5 + ')';
    }
  });

  return {
    grammar: g,
    semantics: semantics
  };
};
