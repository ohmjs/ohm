'use strict';

// Wrap the module in a universal module definition (UMD), allowing us to
// either include it as a <script> or to `require` it as a CommonJS module.
(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.ohmEditor = root.ohmEditor || {};
    initModule(root.ohm, root.ohmEditor, root.document, root.cmUtil, root.d3);
  }
})(this, function(ohm, ohmEditor, document, cmUtil, d3) {
  var ArrayProto = Array.prototype;
  function $(sel) { return document.querySelector(sel); }

  var UnicodeChars = {
    ANTICLOCKWISE_OPEN_CIRCLE_ARROW: '\u21BA',
    HORIZONTAL_ELLIPSIS: '\u2026',
    WHITE_BULLET: '\u25E6'
  };

  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  var zoomState = {};

  var inputMark;
  var grammarMark;
  var defMark;

  // DOM Helpers
  // -----------

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

  function clearMarks() {
    inputMark = cmUtil.clearMark(inputMark);
    grammarMark = cmUtil.clearMark(grammarMark);
    defMark = cmUtil.clearMark(defMark);
    ohmEditor.ui.grammarEditor.getWrapperElement().classList.remove('highlighting');
    ohmEditor.ui.inputEditor.getWrapperElement().classList.remove('highlighting');
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

  function updateZoomState(newState) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        zoomState[k] = newState[k];
      }
    }
    refreshParseTree(zoomState.rootTrace);
  }

  function clearZoomState() {
    var oldZoomState = zoomState;
    zoomState = {};
    refreshParseTree(oldZoomState.rootTrace);
  }

  // A blackhole node is hidden and makes all its descendents hidden too.
  function isBlackhole(traceNode) {
    var desc = traceNode.displayString;
    if (desc) {
      return desc === 'space' || desc === 'empty';
    }
    return false;
  }

  function shouldNodeBeLabeled(traceNode, parent) {
    if (isBlackhole(traceNode)) {
      return false;
    }

    var expr = traceNode.expr;

    // Don't label Seq and Alt nodes.
    if (expr instanceof ohm.pexprs.Seq || expr instanceof ohm.pexprs.Alt) {
      return false;
    }

    // Hide labels for nodes that don't correspond to something the user wrote, unless
    // it's a top-level node.
    if (parent && !expr.interval) {
      return false;
    }

    if (traceNode.succeeded && traceNode.bindings.length === 0) {
      return false;
    }

    return true;
  }

  /*
    When showing failures, the nodes representing the branches (choices) of an Alt node are
    stacked vertically. E.g., for a rule `width = pctWidth | pxWidth` where `pctWidth` fails,
    the nodes are layed out like this:

       width
       pctWidth
       pxWidth

    Since this could be confused with `pctWidth` being the parent node of `pxWidth`, we need
    to distinguish choice nodes visually when showing failures. This function returns true
    if `traceNode` is a choice that needs to be visually distinguished, otherwise false.
  */
  function isVisibleChoice(traceNode, parent) {
    if (!(parent && parent.expr instanceof ohm.pexprs.Alt)) {
      return false;  // It's not even a choice.
    }
    // Make choices visible when showing failures and the first choice didn't succeed.
    return ohmEditor.options.showFailures && !parent.children[0].succeeded;
  }

  function isPrimitive(expr) {
    return expr instanceof ohm.pexprs.Prim ||
           expr instanceof ohm.pexprs.Range ||
           expr instanceof ohm.pexprs.UnicodeChar;
  }

  function couldZoom(currentRootTrace, traceNode) {
    return currentRootTrace !== traceNode &&
           traceNode.succeeded &&
           !isPrimitive(traceNode.expr) &&
           traceNode.expr.ruleName !== 'spaces';
  }

  // Handle the 'contextmenu' event `e` for the DOM node associated with `traceNode`.
  function handleContextMenu(e, rootTrace, traceNode, optActionName) {
    var menuDiv = $('#contextMenu');
    menuDiv.style.left = e.clientX + 'px';
    menuDiv.style.top = e.clientY - 6 + 'px';
    menuDiv.hidden = false;

    var zoomItem = menuDiv.querySelector('#zoomItem');
    zoomItem.onclick = function() {
      var currentRootTrace = zoomState.zoomTrace || rootTrace;
      if (couldZoom(currentRootTrace, traceNode)) {
        updateZoomState({zoomTrace: traceNode, rootTrace: rootTrace});
        refreshParseTree(rootTrace, optActionName);
        clearMarks();
      }
    };
    e.preventDefault();
    e.stopPropagation();  // Prevent ancestor wrappers from handling.
  }

  function hideContextMenu() {
    $('#contextMenu').hidden = true;
  }

  // Create the DOM node that contains the parse tree for `traceNode` and all its children.
  function createTraceWrapper(traceNode) {
    var el = createElement('.pexpr');
    var ctorName = traceNode.expr.constructor.name;
    el.classList.add(ctorName.toLowerCase());
    return el;
  }

  function createTraceElement(rootTrace, traceNode, parent, input, optActionName) {
    var pexpr = traceNode.expr;
    var wrapper = parent.appendChild(createTraceWrapper(traceNode));
    wrapper._input = input;

    if (zoomState.zoomTrace === traceNode && zoomState.previewOnly) {
      if (input) {
        input.classList.add('highlight');
      }
      wrapper.classList.add('zoomBorder');
    }

    wrapper.addEventListener('click', function(e) {
      if (e.altKey && !(e.shiftKey || e.metaKey)) {
        console.log(traceNode);  // eslint-disable-line no-console
      } else if (!isPrimitive(pexpr)) {
        toggleTraceElement(wrapper);
      }
      e.stopPropagation();
      e.preventDefault();
    });

    wrapper.addEventListener('mouseover', function(e) {
      var grammarEditor = ohmEditor.ui.grammarEditor;
      var inputEditor = ohmEditor.ui.inputEditor;

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
        var defInterval = ohmEditor.grammar.ruleBodies[ruleName].definitionInterval;
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
      clearMarks();
    });

    var text = pexpr.ruleName === 'spaces' ? UnicodeChars.WHITE_BULLET : traceNode.displayString;
    // Truncate the label if it is too long.
    if (text.length > 20 && text.indexOf(' ') >= 0) {
      text = text.slice(0, 20) + UnicodeChars.HORIZONTAL_ELLIPSIS;
    }

    var label = wrapper.appendChild(createElement('.label', text));
    // label.setAttribute('title', traceNode.displayString);
    toggleClasses(label, {
      prim: isPrimitive(traceNode.expr),
      spaces: pexpr.ruleName === 'spaces'
    });

    wrapper.addEventListener('contextmenu', function(e) {
      handleContextMenu(e, rootTrace, traceNode, optActionName);
    });

    return wrapper;
  }

  // To make it easier to navigate around the parse tree, handle mousewheel events
  // and translate vertical overscroll into horizontal movement. I.e., when scrolled all
  // the way down, further downwards scrolling instead moves to the right -- and similarly
  // with up and left.
  $('#parseResults').addEventListener('wheel', function(e) {
    var el = e.currentTarget;
    var overscroll;
    var scrollingDown = e.deltaY > 0;

    var bottomSection = $('#bottomSection');

    if (scrollingDown) {
      var scrollBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
      overscroll = e.deltaY - scrollBottom;
      if (overscroll > 0) {
        bottomSection.scrollLeft += overscroll;
      }
    } else {
      overscroll = el.scrollTop + e.deltaY;
      if (overscroll < 0) {
        bottomSection.scrollLeft += overscroll;
      }
    }
  });

  // Hide the context menu when Esc is pressed, any click happens, or another
  // context menu is brought up.
  document.addEventListener('click', hideContextMenu);
  document.addEventListener('contextmenu', hideContextMenu);
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === KeyCode.ESC) {
      hideContextMenu();
    }
  });

  // Intialize the zoom out button.
  var zoomOutButton = $('#zoomOutButton');
  zoomOutButton.textContent = UnicodeChars.ANTICLOCKWISE_OPEN_CIRCLE_ARROW;
  zoomOutButton.onclick = function(e) { clearZoomState(); };
  zoomOutButton.onmouseover = function(e) {
    if (zoomState.zoomTrace) {
      updateZoomState({previewOnly: true});
    }
  };
  zoomOutButton.onmouseout = function(e) {
    if (zoomState.zoomTrace) {
      updateZoomState({previewOnly: false});
    }
  };

  function initializeActionButtonEvent(rootTrace, optActionName) {
    var actionContainers = document.querySelectorAll('.actionEntries');
    Array.prototype.forEach.call(actionContainers, function(actionContainer) {
      actionContainer.onclick = function(event) {
        var actionName = event.target.value;
        if (optActionName === actionName) {
          refreshParseTree(rootTrace, null);
        } else {
          refreshParseTree(rootTrace, actionName);
        }
      };

      actionContainer.onkeypress = function(event) {
        if (event.keyCode === KeyCode.ENTER && event.target.value && !event.target.readOnly) {
          event.target.readOnly = true;
          var actionName = event.target.value;
          refreshParseTree(rootTrace, actionName);
        }
      };
    });
  }

  // Re-render the parse tree starting with the trace at `rootTrace`.
  function refreshParseTree(rootTrace, optActionName) {
    var expandedInputDiv = $('#expandedInput');
    var parseResultsDiv = $('#parseResults');

    expandedInputDiv.innerHTML = '';
    parseResultsDiv.innerHTML = '';

    zoomOutButton.hidden = !zoomState.zoomTrace;

    var trace;
    if (zoomState.zoomTrace && !zoomState.previewOnly) {
      trace = zoomState.zoomTrace;
    } else {
      trace = rootTrace;
    }

    var rootWrapper = parseResultsDiv.appendChild(createTraceWrapper(trace));
    var rootContainer = rootWrapper.appendChild(createElement('.children'));

    initializeActionButtonEvent(rootTrace, optActionName);
    var inputStack = [expandedInputDiv];
    var containerStack = [rootContainer];

    trace.walk({
      enter: function(node, parent, depth) {
        // Don't recurse into nodes that didn't succeed, unless "Show failures" is enabled.
        if (!ohmEditor.options.showFailures && !node.succeeded) {
          return node.SKIP;
        }
        // Undefined nodes identify the base case for left recursion -- skip them.
        // TODO: Figure out a better way to handle this when generating traces.
        if (!node) {
          return trace.SKIP;
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

        // Get the span that contain the parent node's input. If it is undefined, it means that
        // this node is in a failed branch.
        var inputContainer = inputStack[inputStack.length - 1];

        if (inputContainer && node.succeeded) {
          var contents = isLeaf ? node.interval.contents : '';
          childInput = inputContainer.appendChild(createElement('span.input', contents));

          // Represent any non-empty run of whitespace as a single dot.
          if (isWhitespace && contents.length > 0) {
            childInput.innerHTML = '&#xb7;';  // Unicode Character 'MIDDLE DOT'
            childInput.classList.add('whitespace');
          }
        }

        var container = containerStack[containerStack.length - 1];
        var el = createTraceElement(rootTrace, node, container, childInput, optActionName);

        toggleClasses(el, {
          failed: !node.succeeded,
          hidden: !shouldNodeBeLabeled(node, parent),
          visibleChoice: isVisibleChoice(node, parent),
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

    // Hack to ensure that the vertical scroll bar doesn't overlap the parse tree contents.
    parseResultsDiv.style.paddingRight =
        2 + parseResultsDiv.scrollWidth - parseResultsDiv.clientWidth + 'px';
  }

  ohmEditor.refreshParseTree = refreshParseTree;
});
