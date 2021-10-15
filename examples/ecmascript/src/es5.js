/* eslint-env node */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const ohm = require('ohm-js');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

// Take an Array of nodes, and whenever an _iter node is encountered, splice in its
// recursively-flattened children instead.
function flattenIterNodes(nodes) {
  const result = [];
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i]._node.ctorName === '_iter') {
      result.push(...flattenIterNodes(nodes[i].children));
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
  const flatChildren = flattenIterNodes(children).sort(compareByInterval);

  // Keeps track of where the previous sibling ended, so that we can re-insert discarded
  // whitespace into the final output.
  let prevEndIdx = node.source.startIdx;

  let code = '';
  for (let i = 0; i < flatChildren.length; ++i) {
    const child = flatChildren[i];

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
const contents = fs.readFileSync(path.join(__dirname, 'es5.ohm'));
const g = ohm.grammars(contents).ES5;
const semantics = g.createSemantics();

semantics.addOperation('toES5()', {
  Program(_, sourceElements) {
    // Top-level leading and trailing whitespace is not handled by nodeToES5(), so do it here.
    const {sourceString} = this.source;
    return (
      sourceString.slice(0, this.source.startIdx) +
      nodeToES5(this, [sourceElements]) +
      sourceString.slice(this.source.endIdx)
    );
  },
  _nonterminal(...children) {
    return nodeToES5(this, children);
  },
  _terminal() {
    return this.sourceString;
  },
});

// Implements hoisting of variable and function declarations.
// See https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
// Note that on its own, this operation doesn't create nested lexical environments,
// but it should be possible to use it as a helper for another operation that would.
semantics.addOperation('hoistDeclarations()', {
  FunctionDeclaration(_, ident, _1, _2, _3, _4, _5, _6) {
    // Don't hoist from the function body, only return this function's identifier.
    return new Map([[ident.sourceString, [ident.source]]]);
  },
  FunctionExpression(_) {
    return new Map();
  },
  VariableDeclaration(ident, _) {
    return new Map([[ident.sourceString, [ident.source]]]);
  },
  _iter: mergeBindings,
  _nonterminal: mergeBindings,
  _terminal() {
    return new Map();
  },
});

// Merge the bindings from the given `nodes` into a single map, where the value
// is an array of source locations that name is bound.
function mergeBindings(...nodes) {
  const bindings = new Map();
  for (const child of nodes.filter(c => !c.isLexical())) {
    child.hoistDeclarations().forEach((sources, ident) => {
      if (bindings.has(ident)) {
        bindings.get(ident).push(...sources); // Shadowed binding.
      } else {
        bindings.set(ident, sources); // Not shadowed at this level.
      }
    });
  }
  return bindings;
}

module.exports = {
  grammar: g,
  semantics,
};
