/* eslint-env browser */
/* global cmUtil, createElement, d3, getWidthDependentElements, grammarEditor, inputEditor */
/* global options, setError */

'use strict';

var ArrayProto = Array.prototype;
function $(sel) { return document.querySelector(sel); }

var UnicodeChars = {
  HORIZONTAL_ELLIPSIS: '\u2026',
  WHITE_BULLET: '\u25E6'
};

// D3 Helpers
// ----------

function currentHeightPx(optEl) {
  return (optEl || this).offsetHeight + 'px';
}

function tweenWithCallback(endValue, cb) {
  return function tween(d, i, a) {
    var interp = d3.interpolate(a, endValue);
    return function(t) {
      var stepValue = interp.apply(this, arguments);
      cb(stepValue);
      return stepValue;
    };
  };
}

// Parse tree helpers
// ------------------

function toggleClasses(el, map) {
  for (var k in map) {
    if (map.hasOwnProperty(k)) {
      el.classList.toggle(k, map[k]);
    }
  }
}

function measureLabel(wrapperEl) {
  var tempWrapper = $('#measuringDiv .pexpr');
  var labelClone = wrapperEl.querySelector('.label').cloneNode(true);
  var clone = tempWrapper.appendChild(labelClone);
  var result = {
    width: clone.offsetWidth,
    height: clone.offsetHeight
  };
  tempWrapper.innerHTML = '';
  return result;
}

function measureChildren(wrapperEl) {
  var measuringDiv = $('#measuringDiv');
  var clone = measuringDiv.appendChild(wrapperEl.cloneNode(true));
  clone.style.width = '';
  var children = clone.lastChild;
  children.hidden = !children.hidden;
  var result = {
    width: children.offsetWidth,
    height: children.offsetHeight
  };
  measuringDiv.removeChild(clone);
  return result;
}

function measureInput(inputEl) {
  var measuringDiv = $('#measuringDiv');
  var span = measuringDiv.appendChild(createElement('span.input'));
  span.innerHTML = inputEl.textContent;
  var result = {
    width: span.clientWidth,
    height: span.clientHeight
  };
  measuringDiv.removeChild(span);
  return result;
}

function initializeWidths() {
  var els = getWidthDependentElements($('.pexpr'));

  // First, ensure that each pexpr node must be as least as wide as the width
  // of its associated input text.
  for (var i = 0; i < els.length; ++i) {
    var el = els[i];
    if (!el._input) {
      el.style.minWidth = '0';
    } else {
      el.style.minWidth = measureInput(el._input).width + 'px';
    }
  }

  // Then, set the initial widths of all the input elements.
  updateInputWidths(els);
}

// Returns an array of elements whose width could depend on `el`, including
// the element itself.
function getWidthDependentElements(el) {
  var els = [el];
  // Add all ancestor pexpr nodes.
  var node = el;
  while ((node = node.parentNode) !== document) {
    if (node.classList.contains('pexpr')) {
      els.push(node);
    }
  }
  // And add all descendent pexpr nodes.
  return els.concat(ArrayProto.slice.call(el.querySelectorAll('.pexpr')));
}

// For each pexpr div in `els`, updates the width of its associated input
// span based on the current width of the pexpr. This ensures the input text
// for each pexpr node appears directly above it in the visualization.
function updateInputWidths(els) {
  for (var i = 0; i < els.length; ++i) {
    var el = els[i];
    if (!el._input) {
      continue;
    }
    el._input.style.minWidth = el.offsetWidth + 'px';
    if (!el.style.minWidth) {
      el.style.minWidth = measureInput(el._input).width + 'px';
    }
  }
}

// Hides or shows the children of `el`, which is a div.pexpr.
function toggleTraceElement(el) {
  var children = el.lastChild;
  var showing = children.hidden;
  el.classList.toggle('collapsed', !showing && children.childNodes.length > 0);

  var childrenSize = measureChildren(el);
  var newWidth = showing ? childrenSize.width : measureLabel(el).width;

  // The pexpr can't be smaller than the input text.
  newWidth = Math.max(newWidth, measureInput(el._input).width);

  var widthDeps = getWidthDependentElements(el);

  d3.select(el)
      .transition()
      .duration(500)
      .styleTween('width', tweenWithCallback(newWidth + 'px', function(v) {
        updateInputWidths(widthDeps);
      }))
      .each('end', function() {
        // Remove the width and allow the flexboxes to adjust to the correct
        // size. If there is a glitch when this happens, we haven't calculated
        // `newWidth` correctly.
        this.style.width = '';
      });

  var height = showing ? childrenSize.height : 0;
  d3.select(el.lastChild).style('height', currentHeightPx)
      .transition()
      .duration(500)
      .style('height', height + 'px')
      .each('start', function() { if (showing) { this.hidden = false; } })
      .each('end', function() {
        if (!showing) {
          this.hidden = true;
        }
        this.style.height = '';
      });
}

// A blackhole node is hidden and makes all its descendents hidden too.
function isBlackhole(traceNode) {
  if (traceNode.expr.constructor.name === 'Many' && !options.showFailures) {
    // Not sure if this is exactly right. Maybe better would be to hide the
    // node if it doesn't have any visible children.
    return !traceNode.interval || traceNode.interval.contents.length === 0;
  }

  if (traceNode.replacedBy) {
    return true;
  }

  var desc = traceNode.displayString;
  if (desc) {
    return desc[desc.length - 1] === '_' ||
           desc === 'space' ||
           desc === 'empty';
  }
  return false;
}

function shouldNodeBeVisible(traceNode) {
  // TODO: We need to distinguish between nodes that nodes that should be
  // hidden and nodes that should be collapsed by default.

  if (isBlackhole(traceNode)) {
    return false;
  }

  switch (traceNode.expr.constructor.name) {
    case 'Seq':
    case 'Alt':
      return false;
    case 'Apply':
      // Don't show a separate node for failed inline rule applications.
      return traceNode.succeeded || traceNode.expr.ruleName.indexOf('_') === -1;
    default:
      // Hide things that don't correspond to something the user wrote.
      if (!traceNode.expr.interval) {
        return false;
      }
  }
  return true;
}

function isPrimitive(expr) {
  switch (expr.constructor.name) {
    case 'Prim':
    case 'Range':
    case 'UnicodeChar':
      return true;
    default:
      return false;
  }
}

function createTraceElement(grammar, traceNode, parent, input) {
  var wrapper = parent.appendChild(createElement('.pexpr'));
  var pexpr = traceNode.expr;
  wrapper.classList.add(pexpr.constructor.name.toLowerCase());
  wrapper.classList.toggle('failed', !traceNode.succeeded);

  wrapper.addEventListener('click', function(e) {
    if (e.altKey && !(e.shiftKey || e.metaKey)) {
      console.log(traceNode);  // eslint-disable-line no-console
    } else if (pexpr.constructor.name !== 'Prim') {
      toggleTraceElement(wrapper);
    }
    e.stopPropagation();
    e.preventDefault();
  });

  var inputMark, grammarMark, defMark;
  wrapper.addEventListener('mouseover', function(e) {
    if (input) {
      input.classList.add('highlight');
    }
    if (traceNode.interval) {
      inputMark = cmUtil.markInterval(inputEditor, traceNode.interval, 'highlight', false);
      inputEditor.getWrapperElement().classList.add('highlighting');
    }
    if (pexpr.interval) {
      grammarMark = cmUtil.markInterval(grammarEditor, pexpr.interval, 'active-appl', false);
      grammarEditor.getWrapperElement().classList.add('highlighting');
      cmUtil.scrollToInterval(grammarEditor, pexpr.interval);
    }
    var ruleName = pexpr.ruleName;
    if (ruleName) {
      var defInterval = grammar.ruleBodies[ruleName].definitionInterval;
      if (defInterval) {
        defMark = cmUtil.markInterval(grammarEditor, defInterval, 'active-definition', true);
        cmUtil.scrollToInterval(grammarEditor, defInterval);
      }
    }
    e.stopPropagation();
  });
  wrapper.addEventListener('mouseout', function(e) {
    if (input) {
      input.classList.remove('highlight');
    }
    inputMark = cmUtil.clearMark(inputMark);
    grammarMark = cmUtil.clearMark(grammarMark);
    defMark = cmUtil.clearMark(defMark);
    grammarEditor.getWrapperElement().classList.remove('highlighting');
    inputEditor.getWrapperElement().classList.remove('highlighting');
  });
  wrapper._input = input;

  var text = pexpr.ruleName === 'spaces' ? UnicodeChars.WHITE_BULLET : traceNode.displayString;
  // Truncate the label if it is too long.
  if (text.length > 20 && text.indexOf(' ') >= 0) {
    text = text.slice(0, 20) + UnicodeChars.HORIZONTAL_ELLIPSIS;
  }

  var label = wrapper.appendChild(createElement('.label', text));
  label.setAttribute('title', traceNode.displayString);
  toggleClasses(label, {
    prim: isPrimitive(traceNode.expr),
    spaces: pexpr.ruleName === 'spaces'
  });
  return wrapper;
}

function refreshParseTree(grammar, input) {  // eslint-disable-line no-unused-vars
  var trace = grammar.trace(input);
  if (trace.result.failed()) {
    // Intervals with start == end won't show up in CodeMirror.
    var interval = trace.result.getInterval();
    interval.endIdx += 1;
    setError('input', inputEditor, interval, 'Expected ' + trace.result.getExpectedText());
  }

  var inputStack = [$('#expandedInput')];
  var containerStack = [$('#parseResults')];

  trace.walk({
    enter: function(node, parent, depth) {
      // Don't recurse into nodes that didn't succeed unless "Show failures" is enabled.
      if (!(options.showFailures || node.succeeded)) {
        return node.SKIP;
      }
      var childInput;
      var isWhitespace = node.expr.ruleName === 'spaces';
      var isLeaf = isPrimitive(node.expr) ||
                   isBlackhole(node) ||
                   isWhitespace ||
                   node.children.length === 0;

      // Don't bother showing whitespace nodes that didn't consume anything.
      if (isWhitespace && node.interval.contents.length === 0) {
        return node.SKIP;
      }

      // If the node or its descendants successfully consumed input, create a span to wrap
      // all the input that was consumed.
      if (node.succeeded && !node.replacedBy) {
        var contents = isLeaf ? node.interval.contents : '';
        var inputContainer = inputStack[inputStack.length - 1];
        childInput = inputContainer.appendChild(createElement('span.input', contents));

        // Represent any non-empty run of whitespace as a single dot.
        if (isWhitespace && contents.length > 0) {
          childInput.innerHTML = '&#xb7;';  // Unicode Character 'MIDDLE DOT'
          childInput.classList.add('whitespace');
        }
      }
      var container = containerStack[containerStack.length - 1];
      var el = createTraceElement(grammar, node, container, childInput);
      toggleClasses(el, {
        failed: !node.succeeded,
        hidden: !shouldNodeBeVisible(node),
        whitespace: isWhitespace
      });
      if (isLeaf) {
        return node.SKIP;
      }
      inputStack.push(childInput);
      containerStack.push(el.appendChild(createElement('.children')));
    },
    exit: function(node, parent, depth) {
      containerStack.pop();
      inputStack.pop();
    }
  });
  initializeWidths();
}
