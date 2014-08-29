// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var pexprs = require('./pexprs.js');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// TODO: make this a method to grammar and nuke this file.

function skipSpaces(grammar, inputStream) {
  while (true) {
    var origPos = inputStream.pos;
    if (!grammar.ruleDict.space.eval(false, false, grammar, inputStream, [])) {
      inputStream.pos = origPos;
      break;
    }
  }
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = skipSpaces;

