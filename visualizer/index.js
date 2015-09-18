/* eslint-env browser */
/* global CodeMirror, d3, ohm, Storage */

'use strict';

var ArrayProto = Array.prototype;
function $(sel) { return document.querySelector(sel); }
var options = {};

var inputEditor = CodeMirror.fromTextArea($('#input'));
var grammarEditor = CodeMirror.fromTextArea($('#grammar'));
var grammar;

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

// CodeMirror Helpers
// ------------------

function countLeadingWhitespace(str) {
  return str.match(/^\s*/)[0].length;
}

function countTrailingWhitespace(str) {
  return str.match(/\s*$/)[0].length;
}

function isBlockSelectable(cm, startPos, endPos) {
  var lastLine = cm.getLine(endPos.line);
  return countLeadingWhitespace(cm.getLine(startPos.line)) === startPos.ch &&
         (lastLine.length - countTrailingWhitespace(lastLine)) === endPos.ch;
}

// Mark a block of text with `className` by marking entire lines.
function markBlock(cm, startLine, endLine, className) {
  for (var i = startLine; i <= endLine; ++i) {
    cm.addLineClass(i, 'wrap', className);
  }
  return {
    clear: function() {
      for (var i = startLine; i <= endLine; ++i) {
        cm.removeLineClass(i, 'wrap', className);
      }
    }
  };
}

function markInterval(cm, interval, className, canHighlightBlocks) {
  var startPos = cm.posFromIndex(interval.startIdx);
  var endPos = cm.posFromIndex(interval.endIdx);

  // See if the selection can be expanded to a block selection.
  if (canHighlightBlocks && isBlockSelectable(cm, startPos, endPos)) {
    return markBlock(cm, startPos.line, endPos.line, className);
  }
  return cm.markText(startPos, endPos, {className: className});
}

function clearMark(mark) {
  if (mark) {
    mark.clear();
  }
}

function indexToHeight(cm, index) {
  var pos = cm.posFromIndex(index);
  return cm.heightAtLine(pos.line, 'local');
}

function scrollToInterval(cm, interval) {
  var startHeight = indexToHeight(cm, interval.startIdx);
  var endHeight = indexToHeight(cm, interval.endIdx);
  var scrollInfo = cm.getScrollInfo();
  var margin = scrollInfo.clientHeight - (endHeight - startHeight);
  if (startHeight < scrollInfo.top  ||
      endHeight > (scrollInfo.top + scrollInfo.clientHeight)) {
    cm.scrollIntoView({left: 0, top: startHeight,
                       right: 0, bottom: endHeight},
                      margin > 0 ? margin / 2 : undefined);
  }
}

// Misc Helpers
// ------------

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
    var el = els[i];
    if (!el._input) {
      el.style.minWidth = '0px';
    } else {
      el.style.minWidth = measureInput(el._input).width + 'px';
    }
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

function createTraceElement(traceNode, parent, input) {
  var wrapper = parent.appendChild(createElement('.pexpr'));
  wrapper.classList.add(traceNode.expr.constructor.name.toLowerCase());
  if (!traceNode.succeeded) {
    wrapper.classList.add('failed');
  }

  wrapper.addEventListener('click', function(e) {
    if (e.altKey && !(e.shiftKey || e.metaKey)) {
      console.log(traceNode);  // eslint-disable-line no-console
    } else {
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
      inputMark = markInterval(inputEditor, traceNode.interval, 'highlight', false);
      inputEditor.getWrapperElement().classList.add('highlighting');
    }
    if (traceNode.expr.interval) {
      grammarMark = markInterval(grammarEditor, traceNode.expr.interval, 'active-appl', false);
      grammarEditor.getWrapperElement().classList.add('highlighting');
      scrollToInterval(grammarEditor, traceNode.expr.interval);
    }
    var ruleName = traceNode.expr.ruleName;
    if (ruleName) {
      var defInterval = grammar.ruleBodies[ruleName].definitionInterval;
      if (defInterval) {
        defMark = markInterval(grammarEditor, defInterval, 'active-definition', true);
        scrollToInterval(grammarEditor, defInterval);
      }
    }
    e.stopPropagation();
  });
  wrapper.addEventListener('mouseout', function(e) {
    if (input) {
      input.classList.remove('highlight');
    }
    inputMark = clearMark(inputMark);
    grammarMark = clearMark(grammarMark);
    defMark = clearMark(defMark);
    grammarEditor.getWrapperElement().classList.remove('highlighting');
    inputEditor.getWrapperElement().classList.remove('highlighting');
  });
  wrapper._input = input;

  var text = (traceNode.displayString.length > 20 && traceNode.displayString.indexOf(' ') !== -1) ?
      (traceNode.displayString.slice(0, 20) + '\u2026') : traceNode.displayString;
  var label = wrapper.appendChild(createElement('.label', text));
  label.setAttribute('title', traceNode.displayString);
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

var errorMarks = {
  grammar: null,
  input: null
};

function hideError(category, editor) {
  var errInfo = errorMarks[category];
  if (errInfo) {
    errInfo.mark.clear();
    clearTimeout(errInfo.timeout);
    if (errInfo.widget) {
      errInfo.widget.clear();
    }
    errorMarks[category] = null;
  }
}

function setError(category, editor, interval, message) {
  hideError(category, editor);

  errorMarks[category] = {
    mark: markInterval(editor, interval, 'error-interval', false),
    timeout: setTimeout(function() { showError(category, editor, interval, message); }, 1500),
    widget: null
  };
}

function showError(category, editor, interval, message) {
  var errorEl = createElement('.error', message);
  var line = editor.posFromIndex(interval.endIdx).line;
  errorMarks[category].widget = editor.addLineWidget(line, errorEl);
}

function useLocalStorage() {
  return typeof localStorage !== 'undefined' &&
         typeof Storage === 'function' &&
         localStorage instanceof Storage;
}

function setEditorValueFromLocalStorage(editor, key) {
  if (useLocalStorage()) {
    var contents = localStorage.getItem(key);
    if (contents != null) {
      editor.setValue(contents);
    }
  }
}

function hideBottomOverlay() {
  $('#bottomSection .overlay').style.width = 0;
}

function showBottomOverlay() {
  $('#bottomSection .overlay').style.width = '100%';
}

// Main
// ----

(function main() {
  var checkboxes = document.querySelectorAll('#options input[type=checkbox]');
  var refreshTimeout;
  var grammarChanged = true;

  function triggerRefresh(delay) {
    showBottomOverlay();
    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(refresh, delay || 0);
  }
  Array.prototype.forEach.call(checkboxes, function(cb) {
    cb.addEventListener('click', function(e) { triggerRefresh(); });
  });

  setEditorValueFromLocalStorage(inputEditor, 'input');
  setEditorValueFromLocalStorage(grammarEditor, 'grammar');

  inputEditor.on('change', function() { triggerRefresh(250); });
  grammarEditor.on('change', function() {
    grammarChanged = true;
    hideError('grammar', grammarEditor);
    triggerRefresh(250);
  });

  function refresh() {
    hideError('input', inputEditor);
    if (useLocalStorage()) {
      localStorage.setItem('input', inputEditor.getValue());
    }

    if (grammarChanged) {
      grammarChanged = false;

      var grammarSrc = grammarEditor.getValue();
      if (useLocalStorage()) {
        localStorage.setItem('grammar', grammarSrc);
      }
      try {
        grammar = ohm.grammar(grammarSrc);
      } catch (e) {
        console.log(e);  // eslint-disable-line no-console

        var message = e.shortMessage ? e.shortMessage : e.message;
        setError('grammar', grammarEditor, e.interval, message);
        // If the grammar is unusable, prevent the input from being parsed.
        grammar = null;
        return;
      }
    }

    if (!grammar) {
      return;
    }
    hideBottomOverlay();
    $('#expandedInput').innerHTML = '';
    $('#parseResults').innerHTML = '';

    var trace = grammar.trace(inputEditor.getValue());
    if (trace.result.failed()) {
      // Intervals with start == end won't show up in CodeMirror.
      var interval = trace.result.getInterval();
      interval.endIdx += 1;
      setError('input', inputEditor, interval, 'Expected ' + trace.result.getExpectedText());
    }

    // Refresh the option values.
    for (var i = 0; i < checkboxes.length; ++i) {
      var checkbox = checkboxes[i];
      options[checkbox.name] = checkbox.checked;
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
        var isLeaf = isPrimitive(node.expr) || isBlackhole(node);
        var isWhitespace = node.displayString === 'spaces_';

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
        var el = createTraceElement(node, container, childInput);
        if (!shouldNodeBeVisible(node)) {
          el.classList.add('hidden');
        }
        if (isWhitespace) {
          el.classList.add('whitespace');
        }
        if (!node.succeeded) {
          el.classList.add('failed');
        }
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
  refresh();
})();
