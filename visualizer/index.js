/* eslint-env browser */
/* global CodeMirror, d3, ohm */

var ArrayProto = Array.prototype;
function $(sel) { return document.querySelector(sel); }
var options = {};

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

// Misc Helpers
// ------------

function clone(obj) {
  var result = {};
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      result[k] = obj[k];
    }
  }
  return result;
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

function initializeWidths() {
  var els = getWidthDependentElements($('.pexpr'));

  // First, ensure that each pexpr node must be as least as wide as the width
  // of its associated input text.
  for (var i = 0; i < els.length; ++i) {
    els[i].style.minWidth = measureInput(els[i]._input).width + 'px';
  }

  // Then, set the initial widths of all the input elements.
  updateInputWidths(els);
}

function createElement(sel, optContent) {
  var parts = sel.split('.');
  var tagName = parts[0];
  if (tagName.length === 0) {
    tagName = 'div';
  }

  var el = document.createElement(tagName);
  el.className = parts.slice(1).join(' ');
  if (optContent) {
    el.textContent = optContent;
  }
  return el;
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
    width: span.offsetWidth,
    height: span.offsetHeight
  };
  measuringDiv.removeChild(span);
  return result;
}

// Hides or shows the children of `el`, which is a div.pexpr.
function toggleTraceElement(el) {
  var children = el.lastChild;
  var showing = children.hidden;

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

function createTraceElement(traceNode, container, input) {
  var wrapper = container.appendChild(createElement('.pexpr'));
  wrapper.classList.add(traceNode.expr.constructor.name.toLowerCase());
  if (!traceNode.succeeded) {
    wrapper.classList.add('failed');
  }

  wrapper.addEventListener('click', function(e) {
    toggleTraceElement(wrapper);
    e.stopPropagation();
    e.preventDefault();
  });

  wrapper.addEventListener('mouseover', function(e) {
    input.classList.add('highlight');
    e.stopPropagation();
  });
  wrapper.addEventListener('mouseout', function(e) {
    input.classList.remove('highlight');
  });
  wrapper._input = input;

  var label = wrapper.appendChild(createElement('.label', traceNode.displayString));
  if (isPrimitive(traceNode.expr)) {
    label.classList.add('prim');
  }

  return wrapper;
}

// A blackhole node is hidden and makes all its descendents hidden too.
function isBlackhole(traceNode) {
  if (traceNode.expr.constructor.name === 'Many' && !options.showFailures) {
    // Not sure if this is exactly right. Maybe better would be to hide the
    // node if it doesn't have any visible children.
    return !traceNode.interval || traceNode.interval.contents.length === 0;
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
  return expr.constructor.name.indexOf('Prim') >= 0;
}

// Main
// ----

(function main() {
  var origDefaultGrammars = clone(ohm.namespace('default').grammars);

  var checkboxes = document.querySelectorAll('#options input[type=checkbox]');
  function triggerRefresh(e) {
    setTimeout(refresh, 1);
  }
  for (var i = 0; i < checkboxes.length; ++i) {
    checkboxes[i].addEventListener('click', triggerRefresh);
  }

  var origInput = $('#input').textContent;

  function refresh() {
    var grammarSrc = $('#grammar').value;
    ohm.namespace('default').grammars = clone(origDefaultGrammars);  // Hack to reset the namespace.

    var g = ohm.makeGrammar(grammarSrc);
    var trace = g.trace(origInput, 'Expr').trace;

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      options[checkbox.name] = checkbox.checked;
    }

    CodeMirror.fromTextArea($('#input'));
    CodeMirror.fromTextArea($('#grammar'));

    $('#expandedInput').innerHTML = '';
    $('#parseResults').innerHTML = '';
    (function walkTraceNodes(nodes, container, inputContainer, showTrace, parent) {
      nodes.forEach(function(node) {
        if (!(options.showFailures || node.succeeded)) {
          return;
        }
        if (!node) {
          // FIXME -- What's going on here??
          return;
        }
        var contents = '';
        if (node.succeeded) {
          contents = isPrimitive(node.expr) ? node.interval.contents : '';
        }
        var childInput = inputContainer.appendChild(createElement('span.input', contents));
        var isWhitespace = contents.length > 0 && contents.trim().length === 0;
        if (isWhitespace) {
          childInput.innerHTML = '&#xb7;';  // Unicode Character 'MIDDLE DOT'
          childInput.classList.add('whitespace');
        }

        var shouldShowTrace = showTrace && !isBlackhole(node);
        var childContainer = container;

        if (shouldShowTrace || isWhitespace || nodes === trace) {
          var el = createTraceElement(node, container, childInput);
          childContainer = el.appendChild(createElement('.children'));
          if (!shouldNodeBeVisible(node)) {
            el.classList.add('hidden');
          }
          if (isWhitespace) {
            el.classList.add('whitespace');
          }
          if (!node.succeeded) {
            el.classList.add('failed');
          }
        }
        walkTraceNodes(node.children, childContainer, childInput, shouldShowTrace, node);

        // For Seq nodes, also display children that weren't evaluated.
        // TODO: Consider handling this when the trace is being recorded.
        if (node.expr.constructor.name === 'Seq') {
          var factors = node.expr.factors;

          // Due to implicit rules like `spaces_`, the accounting here is a bit
          // tricky. This should probably be handled inside PExpr eval, not here.
          var skipCount = childContainer.querySelectorAll('.pexpr').length;

          for (var i = skipCount; i < factors.length; ++i) {
            var wrapper = createElement('.pexpr.unevaluated');
            wrapper.appendChild(createElement('.label', factors[i].toDisplayString()));
            childContainer.appendChild(wrapper);
          }
          if (options.showFailures && parent && parent.expr.constructor.name === 'Apply') {
            var ruleName = parent.expr.ruleName;
            var caseName = ruleName.slice(ruleName.lastIndexOf('_') + 1);
            if (caseName !== ruleName) {
              childContainer.appendChild(createElement('.caseName', caseName));
            }
          }
        }
      });
    })(trace, $('#parseResults'), $('#expandedInput'), true, null);
    initializeWidths();
  }
  refresh();
})();
