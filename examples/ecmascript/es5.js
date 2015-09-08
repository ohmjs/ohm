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

// Semantic actions for the `modifiedSource` attribute (see below).
var modifiedSourceActions = {
  _nonterminal: function(children) {
    var flatChildren = flattenIterNodes(children).sort(compareByInterval);
    var childResults = flatChildren.map(function(n) { return n.modifiedSource; });
    if (flatChildren.length === 0 || childResults.every(isUndefined)) {
      return undefined;
    }
    var code = '';
    var interval = flatChildren[0].interval.collapsedLeft();
    for (var i = 0; i < flatChildren.length; ++i) {
      if (childResults[i] == null) {
        // Grow the interval to include this node.
        interval = interval.coverageWith(flatChildren[i].interval.collapsedRight());
      } else {
        interval = interval.coverageWith(flatChildren[i].interval.collapsedLeft());
        code +=  interval.contents + childResults[i];
        interval = flatChildren[i].interval.collapsedRight();
      }
    }
    code += interval.contents;
    return code;
  },
  _iter: function(_) {
    throw new Error('_iter semantic action should never be hit');
  },
  _terminal: function() {
    return undefined;
  }
};

// Instantiate the ES5 grammar.
var contents = fs.readFileSync(path.join(__dirname, 'es5.ohm'));
var g = ohm.grammars(contents).ES5;
var semantics = g.semantics();

// An attribute whose value is either a string representing the modified source code for the
// node, or undefined (which means that the original source code should be used).
semantics.addAttribute('modifiedSource', modifiedSourceActions);

// A simple wrapper around the `modifiedSource` attribute, which always returns a string
// containing the ES5 source code for the node.
semantics.addAttribute('asES5', {
  _nonterminal: function(children) {
    return isUndefined(this.modifiedSource) ? this.interval.contents : this.modifiedSource;
  }
});

module.exports = {
  grammar: g,
  semantics: semantics
};
