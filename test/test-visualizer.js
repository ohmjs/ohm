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
  return labelNode.firstChild.textContent;
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

// Recursively serializes the DOM tree rooted at `traceNode`.
// For each node, returns an Array of the form ['theLabel', children...].
// NOTE: The serialized form represents the visual structure of the tree, rather than the
// action structure of the DOM -- see `visualChildren`.
function serializeTree(traceNode, expected) {
  var children = visualChildren(traceNode);
  return [label(traceNode)].concat(children.map(serializeTree));
}

function serializeTrace(resultNode) {
  assert.equal(resultNode.children.length, 2, 'root has two nodes');
  return serializeTree(resultNode.firstChild);
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// Stripped down DOM containing only the markup that is required to show the parse tree.
var HTML = '<div id="expandedInput"></div><div id="parseResults"></div>' +
           '<div id="measuringDiv"><div class="pexpr"></div></div>';

test('simple parse tree', function(t) {
  var doc = jsdom.jsdom(HTML);
  var ohmEditor = {};
  parseTree(ohm, ohmEditor, doc, null, null);
  var g = ohm.grammar('G { start = letter digit+  -- x\n| digit }');

  ohmEditor.refreshParseTree(null, g, g.trace('a99'), false);
  t.equal(doc.querySelector('#expandedInput').textContent, 'a99');

  t.deepEqual(serializeTrace(doc.querySelector('#parseResults')), [
    'start', [
      'start_x',
        ['letter', ['lower']],
        ['digit+', ['digit', ['"0".."9"']],
        ['digit', ['"0".."9"']]]]
  ]);

  t.end();
});
