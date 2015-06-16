/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var ohm = require('../..');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

var UNMODIFIED = {};

function isJavaScriptFile(filename) {
  return path.extname(filename) === '.js';
}

function removeShebang(source) {
  return source.slice(0, 2) === '#!' ? source.replace('#!', '//') : source;
}

function isUndefined(x) { return x === void 0; }

// Take an Array of nodes, and whenever an _iter node is encountered, splice in its
// recursively-flattened children instead.
function flattenIterNodes(nodes) {
  var result = [];
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i]._node.ctorName === '_iter') {
      result.push.apply(result, flattenIterNodes(nodes[i].children));
    } else {
      result.push(nodes[i]);
    }
  }
  return result;
}

// Comparison function for sorting nodes based on their interval's start index.
function compareByInterval(node, otherNode) {
  return node.interval.startIdx - otherNode.interval.startIdx;
}

// Semantic actions for the `modifiedSource` attribute.
var modifiedSourceActions = {
  _default: function(children) {
    var flatChildren = flattenIterNodes(children).sort(compareByInterval);
    var childResults = flatChildren.map(function(n) { return n.modifiedSource; });
    if (flatChildren.length === 0 || childResults.every(isUndefined)) {
      return UNMODIFIED;
    }
    var code = '';
    var interval = flatChildren[0].interval.collapsedLeft();
    for (var i = 0; i < flatChildren.length; ++i) {
      if (childResults[i] == null) {
        // Grow the interval to include this node.
        interval.endIdx = flatChildren[i].interval.endIdx;
      } else {
        code += interval.contents + childResults[i];
        interval.startIdx = interval.endIdx;
      }
    }
    code += interval.contents;
    return code;
  },
  _iter: function(_) {
    throw new Error('_iter semantic action should never be hit');
  },
  _terminal: function() {
    return UNMODIFIED;
  }
};

// --------------------------------------------------------------------
// Main
// --------------------------------------------------------------------

(function main() {
  // Instantiate the ES5 grammar.
  var es5 = ohm.grammars(fs.readFileSync(path.join(__dirname, 'es5.ohm'))).ES5;
  var semantics = es5.semantics();

  // An attribute whose value is either a string representing the modified source code for the
  // node, or UNMODIFIED (which means that the original source code should be used).
  semantics.addAttribute('modifiedSource', modifiedSourceActions);

  // A simple wrapper around the `modifiedSource` attribute, which always returns a string
  // containing the ES5 source code for the node.
  semantics.addAttribute('asES5', {
    _default: function(children) {
      return this.modifiedSource === UNMODIFIED ? this.interval.contents : this.modifiedSource;
    }
  });

  var dir = path.resolve(__dirname, '../../src');
  var files = fs.readdirSync(dir).filter(isJavaScriptFile).map(function(name) {
    return {
      name: name,
      contents: removeShebang(fs.readFileSync(path.join(dir, name)).toString())
    };
  });

  console.time('Matching');
  var filename;
  var result;

  var ok = files.every(function(f) {
    filename = f.name;
    result = es5.match(f.contents, 'Program');
    return result.succeeded();
  });
  if (ok) {
    console.timeEnd('Matching');
    console.time('Codegen');
    var code = semantics(result).asES5;
    console.timeEnd('Codegen');
    console.log(code.length + ' bytes');
  } else {
    console.log(filename + ':\n' + result.message);
  }
})();
