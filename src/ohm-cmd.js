#!/usr/bin/env node

/*
  TODO:

  Rethink this stuff.

  A while ago, I removed it b/c it didn't work for grammars that inherit from another grammar,
  but I just realized (d'oh!) that this is needed for bootstrapping. So I'm reluctantly putting
  it back, but my plan is to replace it with something nicer and more general soon.
*/

var ohm = require('./main.js')
var fs = require('fs')

var grammars = []
process.argv.slice(2).forEach(function(filename) {
  var source
  try {
    source = fs.readFileSync(filename).toString()
  } catch (e) {
    console.log('ERROR: cannot read file', filename)
    process.exit(1)
  }
  grammars.push.apply(grammars, ohm.makeGrammars(source))
})

if (grammars.length === 1)
  console.log(grammars[0].toRecipe())
else {
  console.log('(function(ohm, optNamespace) {')
  console.log('  return [')
  var first = true
  grammars.forEach(function(grammar) {
    if (first)
      first = false
    else
      console.log(',')
    console.log(grammar.toRecipe() + '(ohm, optNamespace)')
  })
  console.log('  ]')
  console.log('})')
}

