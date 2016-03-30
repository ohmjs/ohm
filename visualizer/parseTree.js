/* eslint-env browser */
/* global CodeMirror, semanticsActionHelpers */

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

  var zoomOutButton = $('#zoomOutButton');

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

  function toggleSemanticEditor(el) {
    if (el.children.length <= 2) {
      return;
    }

    var semanticsEditor = el.children[1];
    if (semanticsEditor.classList.contains('resultOnly')) {
      semanticsEditor.classList.remove('resultOnly');
    } else if (semanticsEditor.children[2].classList.contains('alwaysShow')) {
      semanticsEditor.classList.add('resultOnly');
    } else {
      semanticsEditor.hidden = !semanticsEditor.hidden;
    }

    // Refresh CodeMirror to show its contents
    if (!semanticsEditor.hidden && !semanticsEditor.classList.contains('resultOnly')) {
      var editorBodyCM = semanticsEditor.children[1].firstChild.CodeMirror;
      editorBodyCM.refresh();
      if (!editorBodyCM.getValue()) {
        editorBodyCM.focus();
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
    return currentRootTrace !== traceNode &&
           traceNode.succeeded &&
           !isPrimitive(traceNode.expr) &&
           traceNode.expr.ruleName !== 'spaces';
  }

  function getArgumentsExpr(traceNode) {
    var pexpr = traceNode.expr;

    // Get rule body of the Apply rule.
    if (pexpr instanceof ohm.pexprs.Apply) {
      var lastTraceChild = traceNode.children[traceNode.children.length - 1];
      pexpr = lastTraceChild.expr;

      // Get the succeed term of Alt rule.
      if (pexpr instanceof ohm.pexprs.Alt) {
        pexpr = lastTraceChild.children[lastTraceChild.children.length - 1].expr;
      }
    }

    return pexpr;
  }

  function getDefaultArguments(traceNode) {
    var defaultArgStrs;

    var argumentsExpr = getArgumentsExpr(traceNode);
    var argumentString = argumentsExpr.toArgumentString();
    if (argumentsExpr instanceof ohm.pexprs.Seq) {
      defaultArgStrs = argumentString.split(',');
    } else if (argumentString) {
      defaultArgStrs = argumentString.length === 0 ? ['$1'] : [argumentString];
    } else {
      defaultArgStrs = [];
    }

    return defaultArgStrs;
  }

  function retrieveActionFnStrObj(traceNode, actionName, semantics) {
    var ruleName = traceNode.expr.ruleName;

    var actionFnStrObj = Object.create(null);
    var actionFn = semantics.get(actionName).actionDict[ruleName];
    if (!actionFn) {
      actionFnStrObj.args = getDefaultArguments(traceNode);
      return actionFnStrObj;
    }

    var actionFnStr = actionFn.toString();
    var argStr = actionFnStr.substring(actionFnStr.indexOf('(') + 1, actionFnStr.indexOf(')'));
    actionFnStrObj.args = argStr.split(',').map(function(arg) { return arg.trim(); });

    var bodyStartIdx = actionFnStr.indexOf('\n') + 1;
    var bodyEndIdx = actionFnStr.lastIndexOf('\n');
    actionFnStrObj.body = actionFnStr.substring(bodyStartIdx, bodyEndIdx);

    return actionFnStrObj;
  }

  function getArgumentsDisplay(traceNode) {
    var argumentsDisplay = [];

    var argumentsExpr = getArgumentsExpr(traceNode);
    if (argumentsExpr instanceof ohm.pexprs.Seq) {
      argumentsExpr.factors.forEach(function(factor) {
        if (factor instanceof ohm.pexprs.Not ||
          factor instanceof ohm.pexprs.Lookahead ||
          factor === ohm.pexprs.end) {
          return;
        }

        argumentsDisplay.push(factor.toDisplayString());
      });
    } else if (!(argumentsExpr instanceof ohm.pexprs.Not ||
                 argumentsExpr instanceof ohm.pexprs.Lookahead ||
                 argumentsExpr === ohm.pexprs.end)) {

      argumentsDisplay.push(argumentsExpr.toDisplayString());
    }

    return argumentsDisplay;
  }

  function loadEditorHeader(traceNode, editorHeader, realArgStrs) {
    var ruleNameBlock = editorHeader.appendChild(createElement('.block'));
    ruleNameBlock.appendChild(createElement('span.name', traceNode.displayString + ' ='));

    var argDisplays = getArgumentsDisplay(traceNode);
    var defaultArgStrs = getDefaultArguments(traceNode);
    argDisplays.forEach(function(argDisplay, idx) {
      if (idx >= realArgStrs.length) {
        return;
      }

      var argBlock = editorHeader.appendChild(createElement('.block'));
      var argTag = argBlock.appendChild(createElement('span.name', argDisplay));
      var argEditor = argBlock.appendChild(createElement('textarea.rename'));
      if (realArgStrs[idx] === defaultArgStrs[idx]) {
        argEditor.hidden = true;
      }
      if (realArgStrs[idx] !== argDisplay) {
        argEditor.value = realArgStrs[idx];
      }

      argEditor.autofocus = true;
      argEditor.cols = Math.max(argEditor.value.length, 1);
      argEditor.addEventListener('keyup', function() {
        argEditor.cols = Math.max(argEditor.value.length, 1);
      });
      argTag.addEventListener('click', function(e) {
        argEditor.hidden = !argEditor.hidden;
        if (!argEditor.hidden && argEditor.value.length === 0) {
          argEditor.focus();
        }
        e.stopPropagation();
      });
    });
  }

  function retrieveArguementsFromHeader(editorHeader) {
    var argumentStrs = [];
    Array.prototype.forEach.call(editorHeader.children, function(block, idx) {
      if (idx === 0) {
        return;
      }
      argumentStrs.push(block.lastChild.value || block.firstChild.textContent);
    });
    return argumentStrs;
  }

  function loadActionResult(traceNode, actionName, actionResultContainer) {
    var result = semanticsActionHelpers.getActionResult(traceNode, actionName);

    // Mark the label if it's one of the next steps
    if (semanticsActionHelpers.isNextStep(result, traceNode, actionName)) {
      actionResultContainer.parentElement.previousElementSibling.classList.add('nextStepMark');
    }

    if (result && result.isErrorWrapper) {
      actionResultContainer.classList.add('error');
      actionResultContainer.textContent = result;
    } else if (result && result.isFailure) {
      actionResultContainer.classList.add('error');
    } else {
      // TODO: only has reserved result, put the reserved result, and style it
      actionResultContainer.innerHTML = JSON.stringify(result);
    }
  }

  function appendSemanticsEditor(semantics, wrapper, traceNode, actionName) {
    var semanticsEditor = wrapper.appendChild(createElement('.semanticsEditor'));
    semanticsEditor._traceNode = traceNode;

    var actionFnStrObj = retrieveActionFnStrObj(traceNode, actionName, semantics);
    var editorHeader = semanticsEditor.appendChild(createElement('.header'));
    loadEditorHeader(traceNode, editorHeader, actionFnStrObj.args);

    var editorBody = semanticsEditor.appendChild(createElement('.body'));
    var editorBodyCM = CodeMirror(editorBody);
    editorBodyCM.setValue(actionFnStrObj.body || '');

    var actionResultContainer = semanticsEditor.appendChild(createElement('.result'));
    loadActionResult(traceNode, actionName, actionResultContainer);

    semanticsEditor.appendChild(createElement('button.save', 'save'));

    if (semanticsActionHelpers.isPassThrough(traceNode, actionName)) {
      wrapper.firstElementChild.classList.add('passThrough');
      semanticsEditor.hidden = true;
    }

    if (semanticsActionHelpers.haveNoResult(traceNode, actionName) ||
      actionResultContainer.classList.contains('error')) {
      semanticsEditor.hidden = true;
    } else if (!semanticsEditor.hidden) {
      semanticsEditor.classList.add('resultOnly');
      actionResultContainer.classList.add('alwaysShow');
    }
  }

  function createTraceElement(ui, grammar, semantics, rootTrace, traceNode, parent, input,
    optActionName, optZoomState) {

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

    wrapper.addEventListener('mouseover', function(e) {
      if (input) {
        input.classList.add('highlight');
      }
      if (traceNode.interval) {
        wrapper._inputMark =
          cmUtil.markInterval(ui.inputEditor, traceNode.interval, 'highlight', false);
        ui.inputEditor.getWrapperElement().classList.add('highlighting');
      }
      if (pexpr.interval) {
        wrapper._grammarMark =
          cmUtil.markInterval(ui.grammarEditor, pexpr.interval, 'active-appl', false);
        ui.grammarEditor.getWrapperElement().classList.add('highlighting');
        cmUtil.scrollToInterval(ui.grammarEditor, pexpr.interval);
      }
      var ruleName = pexpr.ruleName;
      if (ruleName) {
        var defInterval = grammar.ruleBodies[ruleName].definitionInterval;
        if (defInterval) {
          wrapper._defMark =
            cmUtil.markInterval(ui.grammarEditor, defInterval, 'active-definition', true);
          cmUtil.scrollToInterval(ui.grammarEditor, defInterval);
        }
      }
      e.stopPropagation();
    });

    wrapper._clearMarks = function() {
      if (wrapper._input) {
        wrapper._input.classList.remove('highlight');
      }
      wrapper._inputMark = cmUtil.clearMark(wrapper._inputMark);
      wrapper._grammarMark = cmUtil.clearMark(wrapper._grammarMark);
      wrapper._defMark = cmUtil.clearMark(wrapper._defMark);
      ui.grammarEditor.getWrapperElement().classList.remove('highlighting');
      ui.inputEditor.getWrapperElement().classList.remove('highlighting');
    };

    wrapper.addEventListener('mouseout', function(e) {
      wrapper._clearMarks();
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

    var zoomButton = label.appendChild(createElement('button.zoom',
      UnicodeChars.TELEPHONE_RECORDER + ' zoom'));
    zoomButton.hidden = true;
    zoomButton.addEventListener('click', function(e) {
      var currentRootTrace = optZoomState && optZoomState.zoomTrace || rootTrace;
      if (couldZoom(currentRootTrace, traceNode)) {
        zoomOutButton._trace = traceNode;
        zoomOutButton.hidden = false;
        refreshParseTree(ui, grammar, semantics, rootTrace, ohmEditor.options.showFailures,
          optActionName, {zoomTrace: traceNode});
        wrapper._clearMarks();
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

    label.addEventListener('click', function(e) {
      if (e.altKey && !(e.shiftKey || e.metaKey)) {
        console.log(traceNode);  // eslint-disable-line no-console
      } else if (e.metaKey && !e.shiftKey && optActionName) {
        toggleSemanticEditor(wrapper); // cmd + click to open or close semantic editor
      } else if (!isPrimitive(pexpr)) {
        toggleTraceElement(wrapper);
      }
      e.stopPropagation();
      e.preventDefault();
    });

    var couldAppendSemanticsEditor = shouldNodeBeLabeled(traceNode) &&
                                     !isPrimitive(pexpr) &&
                                     pexpr.ruleName !== 'spaces';
    if (optActionName && couldAppendSemanticsEditor) {
      semanticsActionHelpers.populateActionResult(semantics, traceNode, optActionName);
      appendSemanticsEditor(semantics, wrapper, traceNode, optActionName);
    }
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

  function initializeZoomOutButton(semantics, rootTrace, optActionName, optZoomState) {
    zoomOutButton.textContent = UnicodeChars.ANTICLOCKWISE_OPEN_CIRCLE_ARROW;
    if (!optZoomState) {
      zoomOutButton.hidden = true;
      zoomOutButton._trace = undefined;
    }

    zoomOutButton.onclick = function(e) {
      zoomOutButton.hidden = true;
      zoomOutButton._trace = undefined;
      refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
        ohmEditor.options.showFailures, optActionName);
    };

    zoomOutButton.onmouseover = function(e) {
      var zoomState = {zoomTrace: zoomOutButton._trace, previewOnly: true};
      refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
        ohmEditor.options.showFailures, optActionName, zoomState);
    };

    zoomOutButton.onmouseout = function(e) {
      var zoomState = zoomOutButton._trace && {zoomTrace: zoomOutButton._trace};
      refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
        ohmEditor.options.showFailures, optActionName, zoomState);
    };
  }

  function intializeActionButtonEvent(semantics, rootTrace, optActionName, optZoomState) {
    var actionContainers = document.querySelectorAll('.actionEntries');
    Array.prototype.forEach.call(actionContainers, function(actionContainer) {
      actionContainer.onclick = function(event) {
        var actionName = event.target.value;
        if (optActionName === actionName) {
          refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
            ohmEditor.options.showFailures, null, optZoomState);
        } else {
          refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
            ohmEditor.options.showFailures, actionName, optZoomState);
        }
      };

      actionContainer.onkeypress = function(event) {
        if (event.keyCode !== 13) {
          return;
        }
        var actionType = actionContainer.id === 'operations' ? 'Operation' : 'Attribute';
        var actionName = event.target.value;
        if (actionName && !event.target.readOnly) {
          event.target.readOnly = true;
          try {
            semanticsActionHelpers.addNewAction(semantics, actionType, actionName);
            refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
              ohmEditor.options.showFailures, actionName, optZoomState);

          } catch (error) {
            event.target.readOnly = false;
            window.alert(error); // eslint-disable-line no-alert
            event.target.select();
          }
        }
      };
    });
  }

  function saveSemanticAction(semantics, traceNode, actionName, editorBody) {
    var editorBodyCM = editorBody.firstChild.CodeMirror;
    var actionFnStr = editorBodyCM.getValue();
    var args = retrieveArguementsFromHeader(editorBody.previousElementSibling);

    var actionFnWrapper = semanticsActionHelpers.getActionFnWrapper(actionName, args, actionFnStr);
    var actionKey = traceNode.bindings[0].ctorName;
    semantics.get(actionName).actionDict[actionKey] = actionFnWrapper;
    return true;
  }

  function addActionSavingEvent(semantics, rootTrace, actionName, optZoomState) {

    function handleSavingEvent(editorBody) {
      var nodeWrapper = editorBody.parentElement.parentElement;
      var traceNode = editorBody.parentElement._traceNode;

      // Save the actionFn if there is no syntax error, otherwise show the error
      try {
        saveSemanticAction(semantics, traceNode, actionName, editorBody);
        semanticsActionHelpers.initializeActionLog();
        semanticsActionHelpers.populateActionResult(semantics, traceNode, actionName);
        var result = semanticsActionHelpers.getActionResult(traceNode, actionName);

        // Keep the editor open if there still has an error
        if (semanticsActionHelpers.isNextStep(result, traceNode, actionName)) {
          loadActionResult(traceNode, actionName, editorBody.nextElementSibling);
        } else {
          refreshParseTree(ohmEditor.ui, ohmEditor.grammar, semantics, rootTrace,
            ohmEditor.options.showFailures, actionName, optZoomState);
        }
      } catch (error) {
        editorBody.nextElementSibling.classList.add('error');
        editorBody.nextElementSibling.textContent = error.message;
      } finally {
        nodeWrapper._clearMarks();
      }
    }

    var editorBodys = document.querySelectorAll('.semanticsEditor .body');
    Array.prototype.forEach.call(editorBodys, function(editorBody) {
      var editorBodyCM = editorBody.firstChild.CodeMirror;
      editorBodyCM.setOption('extraKeys', {
        'Cmd-S': function() { handleSavingEvent(editorBody); }
      });

      var saveButton = editorBody.nextElementSibling.nextElementSibling;
      saveButton.onclick = function(e) { handleSavingEvent(editorBody); };
    });
  }

  function refreshParseTree(ui, grammar, semantics, rootTrace, showFailures,
    optActionName, optZoomState) {

    $('#expandedInput').innerHTML = '';
    $('#parseResults').innerHTML = '';

    initializeZoomOutButton(semantics, rootTrace, optActionName, optZoomState);

    var trace;
    if (optZoomState && !optZoomState.previewOnly) {
      trace = optZoomState.zoomTrace;
    } else {
      trace = rootTrace;
    }

    intializeActionButtonEvent(semantics, rootTrace, optActionName, optZoomState);
    if (optActionName) {
      semanticsActionHelpers.initializeActionLog();
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
        var el = createTraceElement(ui, grammar, semantics, rootTrace, node, container, childInput,
          optActionName, optZoomState);

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
    if (optActionName) {
      addActionSavingEvent(semantics, rootTrace, optActionName, optZoomState);
    }
  }

  ohmEditor.refreshParseTree = refreshParseTree;
});
