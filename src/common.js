// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('./pexprs.js')

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function() {
  throw 'this method is abstract!'
}

exports.getDuplicates = function(array) {
  var duplicates = []
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx]
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0)
      duplicates.push(x)
  }
  return duplicates
}

exports.fail = {}

exports.isSyntactic = function(ruleName) {
  var firstChar = ruleName[0]
  return 'A' <= firstChar && firstChar <= 'Z'
}

var _applySpaces
exports.skipSpaces = function(ruleDict, inputStream) {
  (_applySpaces || (_applySpaces = new pexprs.Apply('spaces'))).eval(false, ruleDict, inputStream, undefined)
}

