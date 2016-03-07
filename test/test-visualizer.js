'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('assert');
var jsdom = require('jsdom');
var test = require('tape');

var ohm = require('..');
var parseTree = require('../visualizer/parseTree');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

var ArrayProto = Array.prototype;

function label(node) {
  var labelNode = node.firstChild;
  assert(labelNode.classList.contains('label'),
         "Expected node with class 'label', found '" + labelNode.className + "'");
  return labelNode.textContent;
}

function flattenParseNodes(nodeOrArray) {
  if (Array.isArray(nodeOrArray)) {
    var result = [];
    for (var i = 0; i < nodeOrArray.length; ++i) {
      result = result.concat(flattenParseNodes(nodeOrArray[i]));
    }
    return result;
  } else if (nodeOrArray.classList.contains('hidden')) {
    return visualChildren(nodeOrArray);
  } else {
    assert(nodeOrArray.classList.contains('pexpr'), 'expected pexpr');
    return nodeOrArray;
  }
}

// Return the DOM elements which *visually* the children of the given node in the parse tree.
// Because the labels of some nodes are omitted from the tree, the parse tree does not have a
// 1-to-1 correspondence to the DOM tree.
function visualChildren(node) {
  if (node.children.length === 1) {
    return [];
  }
  var childrenDiv = node.lastChild;
  assert(childrenDiv.classList.contains('children'),
         "Expected node with class 'children', found '" + childrenDiv.className + "'");
  return flattenParseNodes(ArrayProto.slice.call(childrenDiv.children));
}

// Recursively compares the DOM tree rooted at `traceNode` with an expected value.
// `expected` is an Array of the form ['someLabel', children...].
function compareTree(t, traceNode, expected) {
  // The first element in `expected` is the expected label.
  t.equal(label(traceNode), expected[0]);

  // The remaining elements are the expected children.
  var childNodes = visualChildren(traceNode);
  assert.equal(childNodes.length, expected.length - 1, 'wrong number of children');

  expected.slice(1).forEach(function(obj, i) {
    compareTree(t, childNodes[i], obj);
  });
}

function compareTrace(t, resultNode, expected) {
  assert.equal(resultNode.children.length, 1, 'single node at root');
  compareTree(t, resultNode.firstChild, expected);
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// Stripped down DOM containing only the markup that is required to show the parse tree.
var HTML = '<div id="expandedInput"></div><div id="parseResults"></div>' +
           '<div id="measuringDiv"><div class="pexpr"></div></div>';

test('simple parse tree', function(t) {
  var doc = jsdom.jsdom(HTML);
  var refreshParseTree = parseTree(ohm, doc, null, null);
  var g = ohm.grammar('G { start = letter digit+  -- x\n| digit }');

  refreshParseTree(null, g, g.trace('a99'), false);
  t.equal(doc.querySelector('#expandedInput').textContent, 'a99');

  compareTrace(t, doc.querySelector('#parseResults'), [
    'start', [
      'start_x',
        ['letter', ['lower']],
        ['digit+', ['digit', ['"0".."9"']],
        ['digit', ['"0".."9"']]]]
  ]);

  t.end();
});
