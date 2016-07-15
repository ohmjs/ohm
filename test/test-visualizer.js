'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var CheckedEmitter = require('checked-emitter');
var assert = require('assert');
var jsdom = require('jsdom');
var test = require('tape');

var domUtil = require('../visualizer/domUtil');
var ohm = require('..');
var parseTree = require('../visualizer/parseTree');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

var ArrayProto = Array.prototype;

function label(node) {
  var selfNode = node.firstChild;
  assert(selfNode.classList.contains('self'),
       "Expected node with class 'self', found '" + selfNode.className + "'");

  var labelNode = selfNode.firstChild;
  assert(labelNode.classList.contains('label'),
         "Expected node with class 'label', found '" + labelNode.className + "'");
  // Special handling for inline rules.
  var caseName = labelNode.querySelector('.caseName');
  if (caseName) {
    return labelNode.firstChild.textContent + '_' + caseName.textContent;
  }
  // Use the 'title' (tooltip) if available, otherwise the textContent.
  return labelNode.title || labelNode.textContent;
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
  var rootWrapper = resultNode.firstChild;
  assert.equal(resultNode.children.length, 1, 'root DOM node has exactly one child');

  var rootContainer = rootWrapper.firstChild;
  assert(rootContainer.classList.contains('children'), "root container has class 'children'");

  return ArrayProto.map.call(rootContainer.children, function(c) { return serializeTree(c); });
}

function refreshParseTree(emitter, trace) {
  emitter.emit('parse:input', trace.result, trace);
}

// --------------------------------------------------------------------
// Tests
// --------------------------------------------------------------------

// Stripped down DOM containing only the markup that is required to show the parse tree.
var HTML = '<div id="bottomSection">' +
           '  <button id="zoomOutButton" type="button" hidden></button>' +
           '  <div id="expandedInput"></div>' +
           '  <div id="parseResults"></div>' +
           '  <div id="semantics" hidden></div>' +
           '  <input id="timeSlider" type="range" step="1">' +
           '  <div id="measuringDiv"><div class="pexpr"></div></div>' +
           '  <div class="overlay"></div>' +
           '</div>';

test('simple parse tree', function(t) {
  var doc = jsdom.jsdom(HTML);
  var g = ohm.grammar('G { start = letter digit+  -- x\n| digit }');
  var ohmEditor = new CheckedEmitter();
  ohmEditor.registerEvents({
    'parse:input': ['matchResult', 'trace'],
    'change:inputEditor': ['codeMirror'],
    'change:grammarEditor': ['codeMirror'],
    'peek:failure': ['failure'],
    'unpeek:failure': [],
    'goto:failure': ['failure'],
    'peek:ruleDefinition': ['ruleName'],
    'unpeek:ruleDefinition': []
  });
  ohmEditor.grammar = g;
  ohmEditor.options = {};
  ohmEditor.ui = {};

  // Initialize the parseTree module.
  parseTree(ohm, ohmEditor, CheckedEmitter, doc, null, null, domUtil(doc));

  refreshParseTree(ohmEditor, g.trace('a99'));
  t.equal(doc.querySelector('#expandedInput').textContent, 'a99');

  t.deepEqual(serializeTrace(doc.querySelector('#parseResults')), [
    ['start', [
      'start_x',
        ['letter', ['lower']],
        ['digit+', ['digit', ['"0".."9"']],
        ['digit', ['"0".."9"']]]]],
    ['end']
  ]);

  t.end();
});
