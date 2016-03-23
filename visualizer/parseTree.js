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
    HORIZONTAL_ELLIPSIS: '\u2026',
    WHITE_BULLET: '\u25E6',
    ANTICLOCKWISE_OPEN_CIRCLE_ARROW: '\u21BA',
    TELEPHONE_RECORDER: '\u2315'
  };

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
    var desc = traceNode.displayString;
    if (desc) {
      return desc === 'space' || desc === 'empty';
    }
    return false;
  }

  function shouldNodeBeLabeled(traceNode) {
    if (isBlackhole(traceNode)) {
      return false;
    }

    var expr = traceNode.expr;

    // Don't label Seq and Alt nodes.
    if (expr instanceof ohm.pexprs.Seq || expr instanceof ohm.pexprs.Alt) {
      return false;
    }

    // Don't label failed inline rule applications.
    if (expr instanceof ohm.pexprs.Apply) {
      return traceNode.succeeded;
    }

    // Hide labels for nodes that don't correspond to something the user wrote, and
    // nodes that have no bindings.
    if (!expr.interval || traceNode.bindings.length === 0) {
      return false;
    }

    return true;
  }

  function isPrimitive(expr) {
    return expr instanceof ohm.pexprs.Prim ||
           expr instanceof ohm.pexprs.Range ||
           expr instanceof ohm.pexprs.UnicodeChar;
  }

  function couldZoom(currentRootTrace, traceNode) {
    return !(currentRootTrace === traceNode ||
           !(traceNode.expr instanceof ohm.pexprs.Apply));
  }

  function zoomIn(ui, grammar, rootTrace, showFailures, traceNode) {
    var zoomOutButton = $('#zoomOutButton');
    zoomOutButton.textContent = UnicodeChars.ANTICLOCKWISE_OPEN_CIRCLE_ARROW;
    zoomOutButton._trace = traceNode;
    zoomOutButton.hidden = false;

    zoomOutButton.onclick = function(e) {
      zoomOutButton.hidden = true;
      zoomOutButton._trace = undefined;
      refreshParseTree(ui, grammar, rootTrace, showFailures);
    };
    zoomOutButton.onmouseover = function(e) {
      var zoomState = {zoomTrace: zoomOutButton._trace, previewOnly: true};
      refreshParseTree(ui, grammar, rootTrace, showFailures, zoomState);
    };
    zoomOutButton.onmouseout = function(e) {
      var zoomState = zoomOutButton._trace && {zoomTrace: zoomOutButton._trace};
      refreshParseTree(ui, grammar, rootTrace, showFailures, zoomState);
    };

    refreshParseTree(ui, grammar, rootTrace, showFailures, {zoomTrace: traceNode});
  }

  function createTraceElement(ui, grammar, rootTrace, traceNode, parent, input,
    showFailures, optZoomState) {

    var wrapper = parent.appendChild(createElement('.pexpr'));
    var pexpr = traceNode.expr;
    wrapper.classList.add(pexpr.constructor.name.toLowerCase());
    wrapper.classList.toggle('failed', !traceNode.succeeded);

    if (optZoomState && optZoomState.zoomTrace === traceNode && optZoomState.previewOnly) {
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

    var inputMark;
    var grammarMark;
    var defMark;
    wrapper.addEventListener('mouseover', function(e) {
      if (input) {
        input.classList.add('highlight');
      }
      if (traceNode.interval) {
        inputMark = cmUtil.markInterval(ui.inputEditor, traceNode.interval, 'highlight', false);
        ui.inputEditor.getWrapperElement().classList.add('highlighting');
      }
      if (pexpr.interval) {
        grammarMark = cmUtil.markInterval(ui.grammarEditor, pexpr.interval, 'active-appl', false);
        ui.grammarEditor.getWrapperElement().classList.add('highlighting');
        cmUtil.scrollToInterval(ui.grammarEditor, pexpr.interval);
      }
      var ruleName = pexpr.ruleName;
      if (ruleName) {
        var defInterval = grammar.ruleBodies[ruleName].definitionInterval;
        if (defInterval) {
          defMark = cmUtil.markInterval(ui.grammarEditor, defInterval, 'active-definition', true);
          cmUtil.scrollToInterval(ui.grammarEditor, defInterval);
        }
      }
      e.stopPropagation();
    });
    function clearMarks() {
      if (input) {
        input.classList.remove('highlight');
      }
      inputMark = cmUtil.clearMark(inputMark);
      grammarMark = cmUtil.clearMark(grammarMark);
      defMark = cmUtil.clearMark(defMark);
      ui.grammarEditor.getWrapperElement().classList.remove('highlighting');
      ui.inputEditor.getWrapperElement().classList.remove('highlighting');
    }
    wrapper.addEventListener('mouseout', clearMarks);
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

    var zoomButton = label.appendChild(createElement('button.zoom',
      UnicodeChars.TELEPHONE_RECORDER + ' zoom'));
    zoomButton.hidden = true;
    zoomButton.addEventListener('click', function(e) {
      var currentRootTrace = optZoomState && optZoomState.zoomTrace || rootTrace;
      if (couldZoom(currentRootTrace, traceNode)) {
        zoomIn(ui, grammar, rootTrace, showFailures, traceNode);
        clearMarks();
      }
      e.stopPropagation();
      e.preventDefault();
    });

    label.addEventListener('mouseover', function(e) {
      var currentRootTrace = optZoomState && optZoomState.zoomTrace || rootTrace;
      if (couldZoom(currentRootTrace, traceNode)) {
        zoomButton.hidden = false;
      }
    });

    label.addEventListener('mouseout', function(e) {
      zoomButton.hidden = true;
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

    if (scrollingDown) {
      var scrollBottom = el.scrollHeight - el.clientHeight - el.scrollTop;
      overscroll = e.deltaY - scrollBottom;
      if (overscroll > 0) {
        el.scrollLeft += overscroll;
      }
    } else {
      overscroll = el.scrollTop + e.deltaY;
      if (overscroll < 0) {
        el.scrollLeft += overscroll;
      }
    }
  });

  function refreshParseTree(ui, grammar, rootTrace, showFailures, optZoomState) {
    $('#expandedInput').innerHTML = '';
    $('#parseResults').innerHTML = '';

    var trace;
    if (optZoomState && !optZoomState.previewOnly) {
      trace = optZoomState.zoomTrace;
    } else {
      trace = rootTrace;
    }

    var inputStack = [$('#expandedInput')];
    var containerStack = [$('#parseResults')];
    trace.walk({
      enter: function(node, parent, depth) {
        // Don't recurse into nodes that didn't succeed unless "Show failures" is enabled.
        if (!showFailures && !node.succeeded) {
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
        if (node.succeeded) {
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
        var el = createTraceElement(ui, grammar, rootTrace, node, container, childInput,
          showFailures, optZoomState);
        toggleClasses(el, {
          failed: !node.succeeded,
          hidden: !shouldNodeBeLabeled(node),
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

  ohmEditor.refreshParseTree = refreshParseTree;
});
