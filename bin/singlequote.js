#!/usr/bin/env node

'use strict';

var fs = require('fs'),
    recast = require('recast');

var b = recast.types.builders;

process.argv.slice(2).forEach(function(filename) {
  if (filename.indexOf('unicode.js') >= 0) {
    return;
  }

  var contents = fs.readFileSync(filename).toString();
  var prelude;
  if (contents.slice(0, 2) === '#!') {
    var eol = contents.indexOf('\n');
    prelude = contents.slice(0, eol);
    contents = contents.slice(eol);
  }

  var ast = recast.parse(contents);
  recast.types.visit(ast, {
    visitExpression: function(path) {
      this.traverse(path);

      var n = path.node;
      if (n.type === 'Literal' && typeof n.value === 'string' && n.raw.indexOf("'") === -1) {
        n.original = null;
      }
    }
  });

  var output = recast.print(ast, { quote: 'single' }).code;
  if (prelude) {
    output = prelude + output;
  }
  fs.writeFileSync(filename, output);
});
