// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('./pexprs.js');

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

var _applySpaces = new pexprs.Apply('spaces');
module.exports = function(ruleDict, inputStream) {
  _applySpaces.eval(false, ruleDict, inputStream, undefined);
};

