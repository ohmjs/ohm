/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var ohm = require('ohm-js');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

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
  return node.source.startIdx - otherNode.source.startIdx;
}

function nodeToES5(node, children) {
  var flatChildren = flattenIterNodes(children).sort(compareByInterval);

  // Keeps track of where the previous sibling ended, so that we can re-insert discarded
  // whitespace into the final output.
  var prevEndIdx = node.source.startIdx;

  var code = '';
  for (var i = 0; i < flatChildren.length; ++i) {
    var child = flatChildren[i];

    // Restore any discarded whitespace between this node and the previous one.
    if (child.source.startIdx > prevEndIdx) {
      code += node.source.sourceString.slice(prevEndIdx, child.source.startIdx);
    }
    code += child.toES5();
    prevEndIdx = child.source.endIdx;
  }
  return code;
}

// Instantiate the ES5 grammar.
var contents = fs.readFileSync(path.join(__dirname, 'es5.ohm'));
var g = ohm.grammars(contents).ES5;
var semantics = g.createSemantics();

semantics.addOperation('toES5()', {
  Program: function(_, sourceElements) {
    // Top-level leading and trailing whitespace is not handled by nodeToES5(), so do it here.
    var sourceString = this.source.sourceString;
    return sourceString.slice(0, this.source.startIdx) +
           nodeToES5(this, [sourceElements]) +
           sourceString.slice(this.source.endIdx);
  },
  _nonterminal: function(children) {
    return nodeToES5(this, children);
  },
  _terminal: function() {
    return this.sourceString;
  }
});

module.exports = {
  grammar: g,
  semantics: semantics
};
