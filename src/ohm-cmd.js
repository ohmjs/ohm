#!/usr/bin/env node

var ohm = require('./ohm.js')
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

