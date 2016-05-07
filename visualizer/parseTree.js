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
    ANTICLOCKWISE_OPEN_CIRCLE_ARROW: '\u21BA',
    HORIZONTAL_ELLIPSIS: '\u2026',
    MIDDLE_DOT: '\u00B7'
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

  function closestElementMatching(sel, startEl) {
    var el = startEl;
    while (el != null) {
      if (el.matches(sel)) {
        return el;
      }
      el = el.parentElement;
    }
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
        el.classList.toggle(k, !!map[k]);
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
    if (!inputEl) {
      return 0;
    }
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
      el.style.minWidth = measureInput(el._input).width + 'px';
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

  function updateNextStepNode(selfWrapper, showing) {
    // If the node is collapsed, then mark it as temporary `next step`
    // if one of its descendants is `next step`.
    // Otherwise, if the node is expanded,  then remove its temporary
    // `next step` mark if there is any.
    var resultDiv = selfWrapper.querySelector('.result');
    if (!resultDiv) {
      return;
    }

    var shouldMark = !showing &&
        !resultDiv.classList.contains('reserved') &&
        (resultDiv.classList.contains('error') ||
        resultDiv.classList.contains('failure'));
    selfWrapper.classList.toggle('tmpNextStepMark', shouldMark);
  }

  // Hides or shows the children of `el`, which is a div.pexpr.
  function toggleTraceElement(el, optActionName, optDurationInMs) {
    var children = el.lastChild;
    var showing = children.hidden;
    el.classList.toggle('collapsed', !showing);
    el._traceNode._collapsed = !showing;
    if (optActionName) {
      updateNextStepNode(el.firstElementChild, showing);
    }

    var childrenSize = measureChildren(el);
    var newWidth = showing ? childrenSize.width : measureLabel(el).width;

    // The pexpr can't be smaller than the input text.
    newWidth = Math.max(newWidth, measureInput(el._input).width);

    var widthDeps = getWidthDependentElements(el);
    var duration = optDurationInMs != null ? optDurationInMs : 500;

    d3.select(el)
        .transition().duration(duration)
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
    d3.select(el.lastChild)
        .style('height', currentHeightPx)
        .transition().duration(duration)
        .style('height', height + 'px')
        .each('start', function() { if (showing) { this.hidden = false; } })
        .each('end', function() {
          if (!showing) {
            this.hidden = true;
          }
          this.style.height = '';
        });

    if (duration === 0) {
      d3.timer.flush();
    }
  }

  function updateZoomState(newState, semantics, optActionName, optActionArguments) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        zoomState[k] = newState[k];
      }
    }
    refreshParseTree(semantics, zoomState.rootTrace, optActionName, optActionArguments, true);
  }

  function clearZoomState(semantics, optActionName, optActionArguments) {
    var oldZoomState = zoomState;
    zoomState = {};
    refreshParseTree(semantics, oldZoomState.rootTrace, optActionName, optActionArguments, true);
  }

  function shouldNodeBeLabeled(traceNode, parent) {
    var expr = traceNode.expr;

    // Don't label Seq and Alt nodes.
    if (expr instanceof ohm.pexprs.Seq || expr instanceof ohm.pexprs.Alt) {
      return false;
    }

    // Hide successful nodes that have no bindings.
    if (traceNode.succeeded && traceNode.bindings.length === 0) {
      return false;
    }

    return true;
  }

  function isSyntactic(expr) {
    if (expr instanceof ohm.pexprs.Apply) {
      return expr.isSyntactic();
    }
    if (expr instanceof ohm.pexprs.Iter ||
        expr instanceof ohm.pexprs.Lookahead ||
        expr instanceof ohm.pexprs.Not) {
      return isSyntactic(expr.expr);
    }
    return false;
  }

  // Return true if the trace element `el` should be collapsed by default.
  function shouldTraceElementBeCollapsed(el) {
    // Collapse/un-collapse accordingly if this node was a memoized `collapsed state`
    if (el._traceNode._collapsed === true) {
      return true;
    } else if (el._traceNode._collapsed === false) {
      return false;
    }

    // Don't collapse unlabeled nodes (they can't be expanded), or nodes with a collapsed ancestor.
    if (el.classList.contains('hidden') || closestElementMatching('.collapsed', el) != null) {
      return false;
    }

    // Collapse the trace if the next labeled ancestor is syntactic, but the node itself isn't.
    var visualParent = closestElementMatching('.pexpr:not(.hidden)', el.parentElement);
    if (visualParent && visualParent._traceNode) {
      return isSyntactic(visualParent._traceNode.expr) && !isSyntactic(el._traceNode.expr);
    }
    return false;
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
    if (ohmEditor.options.showFailures) {
      // Make the choice visible if the first (real) choice failed.
      return parent.children.some(function(c) {
        return !c.isImplicitSpaces && !c.succeeded;
      });
    }
    return false;
  }

  // Return true if `traceNode` should be treated as a leaf node in the parse tree.
  function isLeaf(traceNode) {
    var pexpr = traceNode.expr;
    if (isPrimitive(pexpr)) {
      return true;
    }
    if (pexpr instanceof ohm.pexprs.Apply) {
      // If the rule body has no interval, treat its implementation as opaque.
      var body = ohmEditor.grammar.ruleBodies[pexpr.ruleName];
      if (!body.interval) {
        return true;
      }
    }
    return traceNode.children.length === 0;
  }

  function isPrimitive(expr) {
    return expr instanceof ohm.pexprs.Terminal ||
           expr instanceof ohm.pexprs.Range ||
           expr instanceof ohm.pexprs.UnicodeChar;
  }

  function couldZoom(currentRootTrace, traceNode) {
    return currentRootTrace !== traceNode &&
           traceNode.succeeded &&
           !isLeaf(traceNode);
  }

  // Handle the clicking event associated with an action entry in `Force evaluation` of
  // context menu.
  function handleEventsOfActionEntry(actionDiv, semantics, traceNode, semanticsEditor, result) {
    var actionName = actionDiv.querySelector('label').textContent;
    var resultDiv = semanticsEditor.querySelector('.result');
    actionDiv.onclick = function(e) {
      if (actionDiv.querySelector('.args')) {
        // For actions that have arguments, click it will hide/show its arguments list
        actionDiv.querySelector('.args').hidden = !actionDiv.querySelector('.args').hidden;
        e.preventDefault();
        e.stopPropagation();
      } else {
        // For actions that don't have arguments, click it to show result of
        // `Force evaluation`
        resultDiv.title = actionName;
        resultDiv.innerHTML = JSON.stringify(result.ans);
        resultDiv.classList.add('reserved');
        semanticsEditor.hidden = false;
        semanticsEditor.classList.add('resultOnly');
        resultDiv._result = result;
      }
    };

    // For those actions that have arguments, set the arguments and press `enter` to
    // force the evaluation
    actionDiv.onkeypress = function(e) {
      if (e.keyCode !== 13) {
        return;
      }
      var args = Object.create(null);
      Array.prototype.forEach.call(actionDiv.querySelectorAll('li'), function(argPair) {
        var argName = argPair.querySelector('.name').textContent;
        var argValue =
            eval(argPair.querySelector('.value').value); // eslint-disable-line no-eval
        args[argName] = argValue;
      });
      try {
        result = semanticsActionHelpers.getActionResultForce(semantics, actionName,
            args, traceNode);
        resultDiv.innerHTML = JSON.stringify(result.ans);
        resultDiv.classList.add('reserved');
        semanticsEditor.hidden = false;
        semanticsEditor.classList.add('resultOnly');
        resultDiv.title = actionName + '(' + Object.keys(args).map(function(key) {
          return args[key] || '_';
        }) + ')';
        resultDiv._result = result;
      } catch (error) { }
    };
  }

  // Handle the 'contextmenu' event `e` for the DOM node associated with `traceNode`.
  function handleContextMenu(e, semantics, rootTrace, traceNode,
      optActionName, optActionArguments) {
    var menuDiv = $('#node.contextMenu');
    menuDiv.style.left = e.clientX + 'px';
    menuDiv.style.top = e.clientY - 6 + 'px';
    menuDiv.hidden = false;

    var currentRootTrace = zoomState.zoomTrace || rootTrace;
    var zoomEnabled = couldZoom(currentRootTrace, traceNode);

    var zoomItem = menuDiv.querySelector('#zoomItem');
    zoomItem.classList.toggle('disabled', !zoomEnabled);
    if (zoomEnabled) {
      zoomItem.onclick = function() {
        updateZoomState({zoomTrace: traceNode, rootTrace: rootTrace}, semantics,
          optActionName, optActionArguments);
        clearMarks();
      };
    }

    var showResult = menuDiv.querySelector('#showResult');
    // Find the `label` element from the event target, if the target is the child of label, i.e.
    // `casename`, then the event target's parent element is the `label` we want.
    var label = e.target;
    if (!label.classList.contains('label')) {
      label = e.target.parentElement;
    }
    var semanticsEditor = label.nextElementSibling;

    // If we didn't select any action, or there is already an action result showed for this node,
    // then we disable the `Get action result` option.
    var hasArguments = optActionArguments && Object.keys(optActionArguments).length !== 0;
    if (!optActionName) {
      showResult.classList.add('disabled');
    } else {
      var actionDivs = showResult.querySelectorAll('.action');
      var noDisplay = true;
      Array.prototype.forEach.call(actionDivs, function(actionDiv) {
        var actionName = actionDiv.querySelector('label').textContent;
        if (actionName === optActionName && !hasArguments) {
          actionDiv.style.display = 'none';
          return;
        }
        noDisplay = false;
        actionDiv.style.display = 'flex';
        // Check whether this action entry should be enabled based on if there is an action result
        // for this cstNode. If so, handle the clicking event associated with this action entry.
        try {
          var args = Object.create(null);
          Array.prototype.forEach.call(actionDiv.querySelectorAll('li'), function(argPair) {
            var argName = argPair.querySelector('.name').textContent;
            var argValue =
                eval(argPair.querySelector('.value').value); // eslint-disable-line no-eval
            args[argName] = argValue;
          });
          var result = semanticsActionHelpers.getActionResultForce(semantics, actionName,
              args, traceNode);

          handleEventsOfActionEntry(actionDiv, semantics, traceNode, semanticsEditor, result);

          actionDiv.classList.remove('disabled');
        } catch (error) {
          // If we could not force to get a result for this node, then disable the `Get action
          // result` option.
          actionDiv.classList.add('disabled');
        }
      });
      showResult.classList.toggle('disabled', noDisplay);
    }
    e.preventDefault();
    e.stopPropagation();  // Prevent ancestor wrappers from handling.
  }

  function hideContextMenu() {
    $('#node.contextMenu').hidden = true;
    $('#action.contextMenu').hidden = true;
  }

  // Create the DOM node that contains the parse tree for `traceNode` and all its children.
  function createTraceWrapper(traceNode) {
    var el = createElement('.pexpr');
    var ctorName = traceNode.expr.constructor.name;
    el.classList.add(ctorName.toLowerCase());
    return el;
  }

  function createTraceLabel(traceNode) {
    var pexpr = traceNode.expr;
    var label = createElement('.label');

    var isInlineRule = pexpr.ruleName && pexpr.ruleName.indexOf('_') >= 0;

    if (isInlineRule) {
      var parts = pexpr.ruleName.split('_');
      label.textContent = parts[0];
      label.appendChild(createElement('span.caseName', parts[1]));
    } else {
      var labelText = traceNode.displayString;

      // Truncate the label if it is too long, and show the full label in the tooltip.
      if (labelText.length > 20 && labelText.indexOf(' ') >= 0) {
        label.setAttribute('title', labelText);
        labelText = labelText.slice(0, 20) + UnicodeChars.HORIZONTAL_ELLIPSIS;
      }
      label.textContent = labelText;
    }
    toggleClasses(label, {
      leaf: isLeaf(traceNode),
      prim: isPrimitive(pexpr)
    });
    return label;
  }

  // Returns the pexpr that represent the arguments of semantics action function
  // of the receiver (i.e. traceNode.expr)
  function getArgumentsExpr(traceNode) {
    var pexpr = traceNode.expr;

    // Get rule body of the Apply expression.
    if (pexpr instanceof ohm.pexprs.Apply) {
      var lastTraceChild = traceNode.children[traceNode.children.length - 1];
      pexpr = lastTraceChild.expr;

      // If the rule body is an Alt expression, then get the succeed term of it.
      if (pexpr instanceof ohm.pexprs.Alt) {
        pexpr = lastTraceChild.children[lastTraceChild.children.length - 1].expr;
      }
    }
    return pexpr;
  }

  // Returns the arguments display format of the expression `argumentsExpr`
  function getArgumentsDisplay(argumentsExpr) {
    var argumentsDisplay = [];

    if (argumentsExpr instanceof ohm.pexprs.Seq) {
      argumentsExpr.factors.forEach(function(factor) {
        argumentsDisplay = argumentsDisplay.concat(getArgumentsDisplay(factor));
      });
    } else if (!(argumentsExpr instanceof ohm.pexprs.Not)) {
      // We skip `Not` as it won't be a semantics action function argument.
      argumentsDisplay.push(argumentsExpr.toDisplayString());
    }
    return argumentsDisplay;
  }

  // Loads the semantic editor header with the format: `<ruleName> = <ruleBody>`
  function loadEditorHeader(traceNode, editorHeader, realArgStrs) {
    var argumentsExpr = getArgumentsExpr(traceNode);
    var argDisplays = getArgumentsDisplay(argumentsExpr);
    var defaultArgStrs = argumentsExpr.toArgumentNameList(1);
    argDisplays.forEach(function(argDisplay, idx) {
      if (idx >= realArgStrs.length) {
        return;
      }

      // Each `block` represent a argument, inside block there are:
      // `span.name`, which is the argument display string
      // `textarea.rename`, which is the argument rename editor
      var argBlock = editorHeader.appendChild(createElement('.block'));
      var argTag = argBlock.appendChild(createElement('span.name', argDisplay));
      var argEditor = argBlock.appendChild(createElement('argEditor'));

      // Make the argument editor element editable
      argEditor.setAttribute('contenteditable', true);
      argEditor.addEventListener('keydown', function(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
          // Disable the ENTER and space keys
          e.preventDefault();
        }
      });

      // Default argument name is hidden by defalut
      if (realArgStrs[idx] === defaultArgStrs[idx]) {
        argEditor.style.display = 'none';
      }

      // Display the real argument name, if it is different from the argument's
      // display string.
      if (realArgStrs[idx] !== argDisplay) {
        argEditor.textContent = realArgStrs[idx];
      }

      // Shows or hides the argument editor by clicking the argument.
      argTag.addEventListener('click', function(e) {
        var shouldBeVisible = argEditor.style.display === 'none';
        argEditor.style.display = shouldBeVisible ? 'inline-block' : 'none';
        if (shouldBeVisible) {
          argEditor.focus();
        }
        e.stopPropagation();
      });
    });
  }

  // Returns an object represent the action function in string
  // `args` is a list of argument names of the action function
  // `body` is the action function body in string
  function retrieveActionFnStrObj(traceNode, actionName, semantics) {
    var actionKey = traceNode.bindings[0].ctorName;

    var actionFnStrObj = Object.create(null);
    var actionFn = semantics._getActionDict(actionName)[actionKey];

    // If we don't have the semantic action for the `actionKey`, or the semantics action is
    // default, then returns the object with default arguments
    if (!actionFn ||
        actionFn.toString().indexOf('// DEFAULT') + 10 === actionFn.toString().indexOf('\n')) {
      actionFnStrObj.args = getArgumentsExpr(traceNode).toArgumentNameList(1);
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

  function retrieveArguementsFromHeader(editorHeader) {
    var argumentStrs = [];
    Array.prototype.forEach.call(editorHeader.children, function(block, idx) {
      argumentStrs.push(block.lastChild.textContent || block.firstChild.textContent);
    });
    return argumentStrs;
  }

  // Wraps the actual semantics action function and put it to the corresponding action dictionary
  function saveSemanticAction(semantics, traceNode, actionName, editorBody) {
    var editorBodyCM = editorBody.firstChild.CodeMirror;
    var actionFnStr = editorBodyCM.getValue();
    var args = retrieveArguementsFromHeader(editorBody.parentElement.querySelector('.header'));

    var actionFnWrapper = semanticsActionHelpers.getActionFnWrapper(actionName, args, actionFnStr);
    var actionKey = traceNode.bindings[0].ctorName;
    semantics._getActionDict(actionName)[actionKey] = actionFnWrapper;
  }

  function addSavingEvent(editorBody, semantics, rootTrace, actionName, optActionArguments) {
    var traceNode = editorBody.parentElement.parentElement.parentElement._traceNode;
    try {
      saveSemanticAction(semantics, traceNode, actionName, editorBody);
      semanticsActionHelpers.getActionResultForce(semantics, actionName,
          optActionArguments, traceNode);
      refreshParseTree(semantics, rootTrace, actionName, optActionArguments, true);
      clearMarks();
    } catch (error) {
      if (error instanceof Error && error.message) {
        // If there is an syntax error in the semantics action code, then load the error
        // message to the result container.
        editorBody.nextElementSibling.classList.add('error');
        editorBody.nextElementSibling.textContent = error.message;
        clearMarks();
      } else {
        // If there is a run time error for executing the semantics action, then refresh
        // the parse tree.
        if (!(error instanceof Error)) {
          // If the run time error is caused by the node itself (i.e. the node is still the
          // logical next step after saving the semantics action), then put the error to
          // `_runtimeError` of the trace, so when refresh the tree, we could load the error,
          // and keep the editor open for users to revise its action.
          traceNode._runtimeError = error;
        }
        refreshParseTree(semantics, rootTrace, actionName, optActionArguments, true);
        clearMarks();
      }
    }
  }

  function loadEditorArgTags(argTags, args) {
    Object.keys(args).forEach(function(argName) {
      var argTag = createElement('.argTag');
      argTag.innerHTML = argName;

      var valueSpan = createElement('span');
      valueSpan.innerHTML = JSON.stringify(args[argName]);
      argTag.appendChild(valueSpan);
      argTag.onmouseover = function(event) {
        argTag.style.marginRight = '12px';
      };
      argTag.onmouseout = function(event) {
        if (valueSpan.classList.contains('show')) {
          return;
        }
        argTag.style.marginRight = '0px';
      };
      argTag.onclick = function(event) {
        var showing = valueSpan.classList.contains('show');
        valueSpan.classList.toggle('show', !showing);
      };
      argTags.appendChild(argTag);
    });
  }

  // Insert semantics editor body to the semantics editor, which includes: `header`, `body`
  // and `save` button
  function insertSemanticsEditorBody(semanticsEditor, semantics, rootTrace,
      actionName, optActionArguments) {
    semanticsEditor.parentElement.classList.add('selected');
    var traceNode = semanticsEditor.parentElement.parentElement._traceNode;
    var resultDiv = semanticsEditor.querySelector('.result');

    var actionFnStrObj = retrieveActionFnStrObj(traceNode, actionName, semantics);
    var editorHeader = semanticsEditor.insertBefore(createElement('.header'), resultDiv);
    loadEditorHeader(traceNode, editorHeader, actionFnStrObj.args);

    var argTags = semanticsEditor.insertBefore(createElement('.argTags'), resultDiv);
    loadEditorArgTags(argTags, resultDiv._result.args);

    var editorBody = semanticsEditor.insertBefore(createElement('.body'), resultDiv);
    var editorBodyCM = CodeMirror(editorBody);
    editorBodyCM.setValue(actionFnStrObj.body || '');
    editorBodyCM.setCursor({line: editorBodyCM.lineCount()});
    editorBodyCM.focus();

    // Hooks the saving action to key `Cmd-S` of semantic editor
    editorBodyCM.setOption('extraKeys', {
      'Cmd-S': function() {
        addSavingEvent(editorBody, semantics, rootTrace, actionName, optActionArguments);
      }
    });

    var saveButton = semanticsEditor.appendChild(createElement('button.save', 'save'));
    // Hooks the saving action to the `save` button of semantic editor
    saveButton.onclick = function() {
      addSavingEvent(editorBody, semantics, rootTrace, actionName, optActionArguments);
    };
  }

  function removeSemanticsEditorBody(semanticsEditor) {
    semanticsEditor.parentElement.classList.remove('selected');
    var header = semanticsEditor.querySelector('.header');
    var argTags = semanticsEditor.querySelector('.argTags');
    var body = semanticsEditor.querySelector('.body');
    semanticsEditor.removeChild(header);
    semanticsEditor.removeChild(argTags);
    semanticsEditor.removeChild(body);
  }

  // Hides or shows the semantics editor of `el`, which is a div.pexpr.
  function toggleSemanticsEditor(el, semantics, rootTrace, actionName, optActionArguments) {
    var semanticsEditor = el.querySelector('.semanticsEditor');
    if (!semanticsEditor || semanticsEditor.parentNode !== el) {
      // If there is no semantics editor (e.g., for a implicit space cst node), do nothing.
      return;
    }

    var resultDiv = semanticsEditor.querySelector('.result');
    if (semanticsEditor.classList.contains('resultOnly')) {
      // Show the result if there is one and the editor body is toggle to hide.
      resultDiv.hidden = true;
      semanticsEditor.classList.remove('resultOnly');
    } else if (resultDiv.classList.contains('alwaysShow')) {
      // Hide the result if we toggle to show the editor body.
      resultDiv.hidden = false;
      semanticsEditor.classList.add('resultOnly');
    } else {
      semanticsEditor.hidden = !semanticsEditor.hidden;
    }

    // Insert or remove the editor body. This avoids having too many CodeMirror.
    if (!semanticsEditor.hidden && !semanticsEditor.classList.contains('resultOnly')) {
      // If we toggle to show the semantics editor of `el`, insert the editor body
      insertSemanticsEditorBody(semanticsEditor, semantics, rootTrace, actionName,
          optActionArguments);
    } else {
      // If we toggle to hide the semantics editor of `el`, remove the editor body
      removeSemanticsEditorBody(semanticsEditor);
    }

  }

  // Loads action result to the semantics result containter, also style the selfWrapper and the
  // container according to the result
  function loadActionResult(semantics, traceNode, actionName,
      optActionArguments, actionResultContainer) {

    actionResultContainer.title = actionName;
    if (optActionArguments && Object.keys(optActionArguments).length > 0) {
      actionResultContainer.title = actionName + '(' + Object.keys(optActionArguments).map(
        function(key) {
          return optActionArguments[key] || '_';
        }) + ')';
    }

    // If there is no action result for this node, and it's not the one we edited before refresh,
    // then return
    if (semanticsActionHelpers.hasNoResult(traceNode, actionName, optActionArguments, true) &&
        !traceNode._runtimeError) {
      try {
        semanticsActionHelpers.getActionResultForce(semantics, actionName,
            optActionArguments, traceNode);
      } catch (error) {
        return;
      }
    }

    // If this node was edited before refresh, and there was runtime error for runing
    // its semantics action, then load the runtime error to its result container.
    // Otherwise, get actual action result.
    var result = traceNode._runtimeError ?
        traceNode._runtimeError :
        semanticsActionHelpers.getActionResult(traceNode, actionName, optActionArguments);

    // Mark the selfWrapper if it's one of the next steps
    var selfWrapper = actionResultContainer.parentElement.parentElement;
    if (semanticsActionHelpers.isNextStep(result && result.ans, traceNode, actionName,
        optActionArguments)) {
      selfWrapper.classList.add('nextStepMark');
    }

    if (semanticsActionHelpers.shouldUseReservedResult(traceNode, actionName, optActionArguments)) {
      actionResultContainer.classList.add('reserved');
      result = semanticsActionHelpers.getReservedResult(traceNode, actionName, optActionArguments);
    }

    var ans = result && result.ans;
    if (ans && ans.isErrorWrapper) {
      actionResultContainer.innerHTML = ans;
    } else if (!(ans && ans.isFailure)) {
      actionResultContainer.innerHTML = JSON.stringify(ans);
    }

    var isError = !!(result && (ans.isErrorWrapper || ans.isFailure));
    actionResultContainer.classList.toggle('error', isError);

    var isPassThrough = !!semanticsActionHelpers.isPassThrough(traceNode, actionName,
        optActionArguments);
    selfWrapper.classList.toggle('passThrough', isPassThrough);

    actionResultContainer._result = result;
  }

  // Appends an semantic editor to the label of node wrapper
  function appendSemanticsEditor(semantics, wrapper, rootTrace, actionName, optActionArguments) {
    var traceNode = wrapper.parentElement._traceNode;
    var semanticsEditor = wrapper.appendChild(createElement('.semanticsEditor'));
    var actionResultContainer = semanticsEditor.appendChild(createElement('.result'));
    loadActionResult(semantics, traceNode, actionName, optActionArguments, actionResultContainer);

    // If there is no result for the traceNode, or the result is an error,
    // then hides the whole editor. Otherwise, only shows the result.
    if (semanticsActionHelpers.hasNoResult(traceNode, actionName, optActionArguments) ||
        wrapper.classList.contains('passThrough') ||
        actionResultContainer.classList.contains('error')) {
      semanticsEditor.hidden = true;
    } else {
      semanticsEditor.classList.add('resultOnly');
      actionResultContainer.classList.add('alwaysShow');
    }

    // If this node was edited before refresh, and there was runtime error for runing
    // its semantics action, then keep its semantics editor open.
    if (traceNode._runtimeError) {
      toggleSemanticsEditor(wrapper, semantics, rootTrace, actionName, optActionArguments);
      delete traceNode._runtimeError;
    }
  }

  function createTraceElement(semantics, rootTrace, traceNode, parent, input,
      optActionName, optActionArguments) {
    var pexpr = traceNode.expr;
    var wrapper = parent.appendChild(createTraceWrapper(traceNode));
    wrapper._input = input;
    wrapper._traceNode = traceNode;

    if (zoomState.zoomTrace === traceNode && zoomState.previewOnly) {
      if (input) {
        input.classList.add('highlight');
      }
      wrapper.classList.add('zoomBorder');
    }

    var selfWrapper = wrapper.appendChild(createElement('.self'));
    var label = selfWrapper.appendChild(createTraceLabel(traceNode));

    label.addEventListener('click', function(e) {
      if (e.altKey && !(e.shiftKey || e.metaKey)) {
        console.log(traceNode);  // eslint-disable-line no-console
      } else if (e.metaKey && !e.shiftKey && optActionName) {
        // cmd + click to open or close semantic editor
        toggleSemanticsEditor(selfWrapper, semantics, rootTrace, optActionName, optActionArguments);
      } else if (!isLeaf(traceNode)) {
        toggleTraceElement(wrapper, optActionName);
      }
      e.preventDefault();
    });

    label.addEventListener('mouseover', function(e) {
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

    label.addEventListener('mouseout', function(e) {
      if (input) {
        input.classList.remove('highlight');
      }
      clearMarks();
    });

    label.addEventListener('contextmenu', function(e) {
      handleContextMenu(e, semantics, rootTrace, traceNode, optActionName, optActionArguments);
    });

    var couldAppendSemanticsEditor =
        shouldNodeBeLabeled(traceNode) &&
        traceNode.succeeded &&
        pexpr.ruleName !== 'spaces';

    if (optActionName && couldAppendSemanticsEditor) {
      semanticsActionHelpers.populateActionResult(semantics, traceNode,
          optActionName, optActionArguments);
      appendSemanticsEditor(semantics, selfWrapper, rootTrace, optActionName, optActionArguments);
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
    if (e.keyCode === KeyCode.ESC || e.keyCode === KeyCode.ENTER) {
      hideContextMenu();
    }
  });

  // Intialize the zoom out button.
  var zoomOutButton = $('#zoomOutButton');
  zoomOutButton.textContent = UnicodeChars.ANTICLOCKWISE_OPEN_CIRCLE_ARROW;
  function initializeZoomOutButton(semantics, optActionName, optActionArguments) {
    zoomOutButton.hidden = !zoomState.zoomTrace;

    zoomOutButton.onclick = function(e) {
      clearZoomState(semantics, optActionName, optActionArguments);
    };
    zoomOutButton.onmouseover = function(e) {
      if (zoomState.zoomTrace) {
        semanticsActionHelpers.reserveResults();
        updateZoomState({previewOnly: true}, semantics, optActionName, optActionArguments);
      }
    };
    zoomOutButton.onmouseout = function(e) {
      if (zoomState.zoomTrace) {
        updateZoomState({previewOnly: false}, semantics, optActionName, optActionArguments);
        semanticsActionHelpers.clearCurrentReservedResults();
      }
    };
  }

  // Constract the arguments entries in node context menu for
  // actions that have arguments
  function formArgumentsEntries(args) {
    var argList = createElement('ul.args');

    Object.keys(args).forEach(function(name) {
      var argNameValuePair = createElement('li.nameValuePair');

      var argName = document.createElement('div');
      argName.className = 'name';
      argName.textContent = name;
      argNameValuePair.appendChild(argName);

      var assign = document.createElement('img');
      assign.src = 'third_party/left-arrow.png';
      assign.className = 'assign';
      argNameValuePair.appendChild(assign);

      var argValue = document.createElement('textarea');
      argValue.className = 'value';
      argValue.placeholder = 'value';
      argValue.cols = 5;
      argValue.addEventListener('keyup', function(e) {
        argValue.cols = Math.max(argValue.value.length, 5);
      });
      argValue.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
      argValue.addEventListener('keypress', function(e) {
        if (e.keyCode === 13) {
          e.preventDefault();
        }
      });
      argNameValuePair.appendChild(argValue);

      argList.appendChild(argNameValuePair);
    });
    argList.hidden = true;

    return argList;
  }

  // Add a new action to the `Force evaluation` of node context menu.
  // If the action name already exist, change the existing entry to this
  // new one.
  function addActionToContextMenu(actionName, args) {
    var showResult = document.querySelector('#showResult');
    var entries = showResult.querySelector('ul');

    var actionDiv = createElement('li.action');
    // If there is an existed entry with the same `actionName`, clear
    // its content to prepare for filling with new `args` information.
    Array.prototype.forEach.call(entries.querySelectorAll('li.action'),
        function(action) {
          if (action.querySelector('label').textContent === actionName) {
            action.innerHTML = '';
            actionDiv = action;
          }
        });

    actionDiv.appendChild(createElement('label', actionName));
    entries.appendChild(actionDiv);

    // If there is no arguments, then we are done
    if (!args || Object.keys(args).length === 0) {
      return;
    }

    var argList = formArgumentsEntries(args);
    actionDiv.appendChild(argList);
  }

  // Remove action that has name `actionName` from the context menu
  function removeActionFromContextMenu(actionName) {
    var showResult = document.querySelector('#showResult');
    var contents = showResult.querySelector('ul');
    var actionDivs = contents.querySelectorAll('li.action');
    var actionDiv = Array.prototype.filter.call(actionDivs, function(div) {
      return div.querySelector('label').textContent === actionName;
    })[0];
    contents.removeChild(actionDiv);
  }

  function retrieveActionArgs(actionWrapper) {
    var argumentsContainer = actionWrapper.querySelector('.arguments');
    if (!argumentsContainer) {
      return null;
    }
    var argNameValuePairs = actionWrapper.querySelectorAll('.nameValuePair');
    var args = Object.create(null);
    Array.prototype.forEach.call(argNameValuePairs, function(argNameValuePair) {
      var nameContainer = argNameValuePair.querySelector('.name');
      var valueContainer = argNameValuePair.querySelector('.value');
      if (nameContainer.value &&
          /^[_a-zA-Z0-9]+$/.test(nameContainer.value) &&
          !(nameContainer.value in args)) {
        args[nameContainer.value] = eval(valueContainer.value);  // eslint-disable-line no-eval
        nameContainer.readOnly = true;
      } else {
        // TODO: maybe overwrite duplicates?
        argumentsContainer.removeChild(argNameValuePair);
      }
    });
    return args;
  }

  function removeAction(semantics, rootTrace, actionType, actionName) {
    var action = semantics._removeAction(actionName);
    if (actionType === 'Attribute') {
      semantics._getSemantics().wrap(rootTrace.bindings[0])._forgetMemoizedResultFor(actionName);
    }
    removeActionFromContextMenu(actionName);
    return action;
  }

  // Relax the action node to make every part editable
  function relaxActionNode(actionWrapper, action) {
    var actionNode = actionWrapper.querySelector('.action');
    actionNode.classList.add('editing');
    actionNode._mergeAction = action;
    actionNode.readOnly = false;
    actionNode.select();
    actionWrapper.querySelector('.arguments').hidden = false;
    Array.prototype.forEach.call(actionWrapper.querySelectorAll('.nameValuePair'),
        function(pair, idx) {
          pair.querySelector('.name').readOnly = false;
        });
    var buttonWrapper = actionWrapper.querySelector('.buttonWrapper');
    buttonWrapper.querySelector('.add').hidden = false;
    buttonWrapper.querySelector('.arrow').hidden = true;
    buttonWrapper.hidden = false;
  }

  function initializeActionButtonEvent(semantics, rootTrace, optActionName, optActionArguments) {
    var actionContainers = document.querySelectorAll('.actionEntries');
    Array.prototype.forEach.call(actionContainers, function(actionContainer) {
      var actionType = actionContainer.id === 'operations' ? 'Operation' : 'Attribute';
      actionContainer.onclick = function(event) {
        // Handle `click` only if it happens on an action button
        if (!event.target.classList.contains('action')) {
          return;
        }
        var actionWrapper = event.target.parentElement;
        var actionName = event.target.value;
        if (optActionName === actionName || !event.target.readOnly) {
          // If we click on an action that was selected before, or an action
          // that hasn't been saved (press `enter` to save an action), we don't
          // show semantics action result on the example
          refreshParseTree(semantics, rootTrace, null, null, false);
        } else {
          var args = retrieveActionArgs(actionWrapper);
          refreshParseTree(semantics, rootTrace, actionName, args, false);
        }
      };

      actionContainer.onkeypress = function(event) {
        if (event.keyCode !== 13) {
          return;
        }

        // Retrieve action wrapper from event target: an argument name/value, or an action name
        var actionWrapper = event.target;
        if (actionWrapper.classList.contains('value') ||
            actionWrapper.classList.contains('name')) {
          actionWrapper = actionWrapper.parentElement.parentElement.parentElement;
        } else if (actionWrapper.classList.contains('action')) {
          actionWrapper = actionWrapper.parentElement;
        }

        var argumentValueChange = event.target.classList.contains('value') &&
              event.target.parentElement.querySelector('.name').readOnly;

        var actionNode = actionWrapper.querySelector('.action');
        var actionName = actionNode.value;
        var args = retrieveActionArgs(actionWrapper);
        if (!actionName) {
          actionContainer.removeChild(actionWrapper);
          refreshParseTree(semantics, rootTrace, null, null, false);
          return;
        } else if (argumentValueChange) {
          // If the event target is an argument value, and its name is saved,
          // then the user is just changing an argument value, so we just
          // refresh the tree with new arguments values
          refreshParseTree(semantics, rootTrace, actionName, args, false);
          return;
        }

        actionNode.readOnly = true;

        // If the user is editing an action (i.e. changing name, or edit arguments),
        // we keep what already implemented for the semantics action, and merge it to
        // the new action that's going to be saved (i.e. call `addNewAction` with
        // `mergeAction`)
        var mergeAction;
        if (actionNode.classList.contains('editing')) {
          actionNode.classList.remove('editing');
          mergeAction = actionNode._mergeAction;
          delete actionNode._mergeAction;
        }

        // If the action is an operation, switching the button from `add` to `arrow` if there is
        // any arguments, or we hide both buttons.
        if (actionType === 'Operation') {
          var argNames = Object.keys(args);
          if (argNames.length === 0) {
            actionWrapper.querySelector('.buttonWrapper').hidden = true;
          } else {
            actionWrapper.querySelector('.buttonWrapper').querySelector('.add').hidden = true;
            actionWrapper.querySelector('.buttonWrapper').querySelector('.arrow').hidden = false;
          }
        }

        try {
          semanticsActionHelpers.addNewAction(semantics, actionType, actionName, args, mergeAction);
          addActionToContextMenu(actionName, args);
          refreshParseTree(semantics, rootTrace, actionName, args, false);
        } catch (error) {
          // Show alert if we couldn't add the new action with name `actionName`
          // and arguments `args`.
          event.target.readOnly = false;
          window.alert(error);  // eslint-disable-line no-alert
          event.target.select();
        }
      };

      // Handle `edit`/`delete` action on action node
      actionContainer.oncontextmenu = function(event) {
        var actionContextMenu = $('#action.contextMenu');
        actionContextMenu.style.left = event.clientX + 'px';
        actionContextMenu.style.top = event.clientY - 6 + 'px';
        actionContextMenu.hidden = false;

        var del = actionContextMenu.querySelector('#delete');
        var edit = actionContextMenu.querySelector('#edit');
        var actionWrapper, actionName;
        if (event.target.classList.contains('action')) {
          // Click on the action node needs to handle the operation
          // on entire action
          actionWrapper = event.target.parentElement;
          actionName = event.target.value;
          del.onclick = function(event) {
            removeAction(semantics, rootTrace, actionType, actionName);

            actionContainer.removeChild(actionWrapper);
            if (actionName === optActionArguments) {
              refreshParseTree(semantics, rootTrace, null, null, false);
            } else {
              refreshParseTree(semantics, rootTrace, optActionName, optActionArguments, false);
            }
          };

          edit.onclick = function(event) {
            var action = removeAction(semantics, rootTrace, actionType, actionName);
            relaxActionNode(actionWrapper, action);
          };
        } else {
          // Click on the attribute node needs to handle the operation
          // on the attribute
          var nameValuePair = event.target;
          if (event.target.classList.contains('name') ||
            event.target.classList.contains('assign') ||
            event.target.classList.contains('value')) {
            nameValuePair = event.target.parentElement;
          }
          actionName = nameValuePair.parentElement.previousElementSibling.value;
          actionWrapper = nameValuePair.parentElement.parentElement;

          del.onclick = function(event) {
            nameValuePair.parentElement.removeChild(nameValuePair);
            // If the deleted argument is the only argument for the action, then
            // hide all the buttons that operate on arguments (i.e. add, arrows)
            if (actionWrapper.querySelector('.arguments').children.length === 0) {
              actionWrapper.querySelector('.buttonWrapper').hidden = true;
            }

            // Change the entry that corresponding this action in the `Force evaluation` list
            // of contextmenu accordingly.
            var args = retrieveActionArgs(actionWrapper);
            addActionToContextMenu(actionName, args);
            // Remove the current action and add a new one with the same name, with different
            // arguments
            var action = semantics._removeAction(actionName);
            semanticsActionHelpers.addNewAction(semantics, actionType, actionName, args, action);

            optActionArguments = actionName === optActionName ? args : optActionArguments;
            refreshParseTree(semantics, rootTrace, optActionName, optActionArguments, false);
          };

          edit.onclick = function(event) {
            // Relax the name container, so it could be editable
            nameValuePair.querySelector('.name').readOnly = false;
            nameValuePair.querySelector('.name').select();

            // Keep the current `action`, so we won't lose our implementation
            // after refresh (happens when press `enter`)
            var actionNode = actionWrapper.querySelector('.action');
            var action = semantics._removeAction(actionName);
            actionNode.classList.add('editing');
            actionNode._mergeAction = action;
          };
        }
        event.preventDefault();
        event.stopPropagation();  // Prevent ancestor wrappers from handling.
      };

    });
  }

  // Re-render the parse tree starting with the trace at `rootTrace`.
  function refreshParseTree(semantics,
      rootTrace, optActionName, optActionArguments, keepReservedResults, clearZoomTrace) {
    var expandedInputDiv = $('#expandedInput');
    var parseResultsDiv = $('#parseResults');

    expandedInputDiv.innerHTML = '';
    parseResultsDiv.innerHTML = '';

    if (clearZoomState) {
      zoomState = {};
    }
    initializeZoomOutButton(semantics, optActionName, optActionArguments);

    var trace;
    if (zoomState.zoomTrace && !zoomState.previewOnly) {
      trace = zoomState.zoomTrace;
    } else {
      trace = rootTrace;
    }

    var rootWrapper = parseResultsDiv.appendChild(createTraceWrapper(trace));
    var rootContainer = rootWrapper.appendChild(createElement('.children'));

    initializeActionButtonEvent(semantics, rootTrace, optActionName, optActionArguments);
    if (optActionName) {
      semanticsActionHelpers.initializeActionLog(keepReservedResults);
    }

    var inputStack = [expandedInputDiv];
    var containerStack = [rootContainer];
    trace.walk({
      enter: function(node, parent, depth) {
        // Undefined nodes identify the base case for left recursion -- skip them.
        // TODO: Figure out a better way to handle this when generating traces.
        if (!node) {
          return trace.SKIP;
        }
        // Don't recurse into nodes that didn't succeed, unless "Show failures" is enabled.
        if ((!node.succeeded && !ohmEditor.options.showFailures) ||
            (node.isImplicitSpaces && !ohmEditor.options.showSpaces)) {
          return node.SKIP;
        }
        var childInput;
        var isWhitespace = node.expr.ruleName === 'spaces';
        var isLeafNode = isLeaf(node);

        // Don't bother showing whitespace nodes that didn't consume anything.
        if (isWhitespace && node.interval.contents.length === 0) {
          return node.SKIP;
        }

        // Get the span that contain the parent node's input. If it is undefined, it means that
        // this node is in a failed branch.
        var inputContainer = inputStack[inputStack.length - 1];

        if (inputContainer && node.succeeded) {
          var contents = isLeafNode ? node.interval.contents : '';
          childInput = inputContainer.appendChild(createElement('span.input', contents));

          // Represent any non-empty run of whitespace as a single dot.
          if (isWhitespace && contents.length > 0) {
            childInput.innerHTML = UnicodeChars.MIDDLE_DOT;
            childInput.classList.add('whitespace');
          }
        }

        var container = containerStack[containerStack.length - 1];
        var el = createTraceElement(
            semantics, rootTrace, node, container, childInput, optActionName, optActionArguments);

        toggleClasses(el, {
          failed: !node.succeeded,
          hidden: !shouldNodeBeLabeled(node, parent),
          visibleChoice: isVisibleChoice(node, parent)
        });
        if (isLeafNode) {
          return node.SKIP;
        }
        inputStack.push(childInput);
        containerStack.push(el.appendChild(createElement('.children')));

        if (shouldTraceElementBeCollapsed(el)) {
          toggleTraceElement(el, optActionName, 0);
        }
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
