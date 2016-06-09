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

// Instantiate the ES5 grammar.
var contents = fs.readFileSync(path.join(__dirname, 'es5.ohm'));
var g = ohm.grammars(contents).ES5;
var semantics = g.semantics();

// An attribute whose value is either a string representing the modified source code for the
// node, or undefined (which means that the original source code should be used).
semantics.addOperation('toES5()', {
  _nonterminal: function(children) {
    var flatChildren = flattenIterNodes(children).sort(compareByInterval);
    if (flatChildren.length === 0) {
      return this.interval.contents;
    }
    var ans = '';
    var childResults = flatChildren.map(function(n) { return n.toES5(); });

    // In theory, we could simply join the output of calling `toES5()` on all the children.
    // However, Ohm's implicit space skipping means that the `spaces` nodes are not included in
    // the children, so if we did that, the output would be missing all the spaces.
    // Instead, we use the node intervals to determine what parts of the input were implicitly
    // skipped over, and splice those into the output appropriately.
    var interval = flatChildren[0].interval.collapsedLeft();
    for (var i = 0; i < flatChildren.length; ++i) {
      interval = interval.coverageWith(flatChildren[i].interval.collapsedLeft());
      ans +=  interval.contents + childResults[i];
      interval = flatChildren[i].interval.collapsedRight();
    }
    ans += interval.contents;
    return ans;
  },
  _terminal: function() {
    return this.interval.contents;
  },
  _iter: function(_) {
    throw new Error('_iter semantic action should never be hit');
  }
});

module.exports = {
  grammar: g,
  semantics: semantics
};
