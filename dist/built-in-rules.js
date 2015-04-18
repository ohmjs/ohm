var ohm = require('..');
module.exports = ohm.makeRecipe(function() {
var buildSuperGrammar = (function() {
  return new this.newGrammar('')
    .build();
});
  return new this.newGrammar('BuiltInRules')
    .withSuperGrammar(buildSuperGrammar.call(this))
    .define('alnum', [], this.prim(/[0-9a-zA-Z]/), 'an alpha-numeric character')
    .define('letter', [], this.prim(/[a-zA-Z]/), 'a letter')
    .define('lower', [], this.prim(/[a-z]/), 'a lower-case letter')
    .define('upper', [], this.prim(/[A-Z]/), 'an upper-case letter')
    .define('digit', [], this.prim(/[0-9]/), 'a digit')
    .define('hexDigit', [], this.prim(/[0-9a-fA-F]/), 'a hexadecimal digit')
    .build();
});

