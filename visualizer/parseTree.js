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
    // TODO: if this node has reserved result, then don't mark it no matter what
    var resultDiv = selfWrapper.querySelector('.result');
    if (!resultDiv) {
      return;
    }
    var shouldMark = !showing &&
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

  function updateZoomState(newState, semantics, optActionName) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        zoomState[k] = newState[k];
      }
    }
    refreshParseTree(semantics, zoomState.rootTrace, optActionName);
  }

  function clearZoomState(semantics, optActionName) {
    var oldZoomState = zoomState;
    zoomState = {};
    refreshParseTree(semantics, oldZoomState.rootTrace, optActionName);
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
    return expr instanceof ohm.pexprs.Prim ||
           expr instanceof ohm.pexprs.Range ||
           expr instanceof ohm.pexprs.UnicodeChar;
  }

  function couldZoom(currentRootTrace, traceNode) {
    return currentRootTrace !== traceNode &&
           traceNode.succeeded &&
           !isLeaf(traceNode);
  }

  // Handle the 'contextmenu' event `e` for the DOM node associated with `traceNode`.
  function handleContextMenu(e, semantics, rootTrace, traceNode, optActionName) {
    var menuDiv = $('#contextMenu');
    menuDiv.style.left = e.clientX + 'px';
    menuDiv.style.top = e.clientY - 6 + 'px';
    menuDiv.hidden = false;

    var currentRootTrace = zoomState.zoomTrace || rootTrace;
    var zoomEnabled = couldZoom(currentRootTrace, traceNode);

    var zoomItem = menuDiv.querySelector('#zoomItem');
    zoomItem.classList.toggle('disabled', !zoomEnabled);
    if (zoomEnabled) {
      zoomItem.onclick = function() {
        updateZoomState({zoomTrace: traceNode, rootTrace: rootTrace}, semantics, optActionName);
        clearMarks();
      };
    }

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
    var ruleNameBlock = editorHeader.appendChild(createElement('.block'));
    ruleNameBlock.appendChild(createElement('span.name', traceNode.displayString + ' ='));

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

  function retrieveArguementsFromHeader(editorHeader) {
    var argumentStrs = [];
    Array.prototype.forEach.call(editorHeader.children, function(block, idx) {
      if (idx === 0) {
        return;
      }
      argumentStrs.push(block.lastChild.textContent || block.firstChild.textContent);
    });
    return argumentStrs;
  }

  // Wraps the actual semantics action function and put it to the corresponding action dictionary
  function saveSemanticAction(semantics, traceNode, actionName, editorBody) {
    var editorBodyCM = editorBody.firstChild.CodeMirror;
    var actionFnStr = editorBodyCM.getValue();
    var args = retrieveArguementsFromHeader(editorBody.previousElementSibling);

    var actionFnWrapper = semanticsActionHelpers.getActionFnWrapper(actionName, args, actionFnStr);
    var actionKey = traceNode.bindings[0].ctorName;
    semantics._getActionDict(actionName)[actionKey] = actionFnWrapper;
  }

  function addSavingEvent(editorBody, semantics, rootTrace, actionName) {
    var traceNode = editorBody.parentElement.parentElement.parentElement._traceNode;
    try {
      saveSemanticAction(semantics, traceNode, actionName, editorBody);
      // If there has an run time error, then put it to `_runtimeError` of the trace,
      // so when refresh the tree, we could load the error, and keep the editor open
      // for users to revise its action.
      semanticsActionHelpers.initializeActionLog(true);
      semanticsActionHelpers.populateActionResult(semantics, traceNode, actionName);
      var result = semanticsActionHelpers.getActionResult(traceNode, actionName);
      if (semanticsActionHelpers.isNextStep(result, traceNode, actionName)) {
        traceNode._runtimeError = result;
      }
      refreshParseTree(semantics, rootTrace, actionName);
    } catch (error) {
      // If there is an syntax error in the semantics action code, then load the error
      // message to the result container.
      editorBody.nextElementSibling.classList.add('error');
      editorBody.nextElementSibling.textContent = error.message;
    } finally {
      clearMarks();
    }
  }

  // Insert semantics editor body to the semantics editor, which includes: `header`, `body`
  // and `save` button
  function insertSemanticsEditorBody(semanticsEditor, semantics, rootTrace, actionName) {
    semanticsEditor.parentElement.classList.add('selected');
    var traceNode = semanticsEditor.parentElement.parentElement._traceNode;
    var resultDiv = semanticsEditor.querySelector('.result');

    var actionFnStrObj = retrieveActionFnStrObj(traceNode, actionName, semantics);
    var editorHeader = semanticsEditor.insertBefore(createElement('.header'), resultDiv);
    loadEditorHeader(traceNode, editorHeader, actionFnStrObj.args);

    var editorBody = semanticsEditor.insertBefore(createElement('.body'), resultDiv);
    var editorBodyCM = CodeMirror(editorBody);
    editorBodyCM.setValue(actionFnStrObj.body || '');
    editorBodyCM.setCursor({line: editorBodyCM.lineCount()});
    editorBodyCM.focus();

    // Hooks the saving action to key `Cmd-S` of semantic editor
    editorBodyCM.setOption('extraKeys', {
      'Cmd-S': function() {
        addSavingEvent(editorBody, semantics, rootTrace, actionName);
      }
    });

    var saveButton = semanticsEditor.appendChild(createElement('button.save', 'save'));
    // Hooks the saving action to the `save` button of semantic editor
    saveButton.onclick = function() {
      addSavingEvent(editorBody, semantics, rootTrace, actionName);
    };
  }

  function removeSemanticsEditorBody(semanticsEditor) {
    semanticsEditor.parentElement.classList.remove('selected');
    var header = semanticsEditor.querySelector('.header');
    var body = semanticsEditor.querySelector('.body');
    semanticsEditor.removeChild(header);
    semanticsEditor.removeChild(body);
  }

  // Hides or shows the semantics editor of `el`, which is a div.pexpr.
  function toggleSemanticsEditor(el, semantics, rootTrace, actionName) {
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
      insertSemanticsEditorBody(semanticsEditor, semantics, rootTrace, actionName);
    } else {
      // If we toggle to hide the semantics editor of `el`, remove the editor body
      removeSemanticsEditorBody(semanticsEditor);
    }
  }

  // Loads action result to the semantics result containter, also style the label and the
  // container according to the result
  function loadActionResult(traceNode, actionName, actionResultContainer) {
    // If there is no action result for this node, and it's not the one we edited before refresh,
    // then return
    if (semanticsActionHelpers.hasNoResult(traceNode, actionName) && !traceNode._runtimeError) {
      return;
    }

    // If this node was edited before refresh, and there was runtime error for runing
    // its semantics action, then load the runtime error to its result container.
    // Otherwise, get actual action result.
    var result = traceNode._runtimeError ?
        traceNode._runtimeError :
        semanticsActionHelpers.getActionResult(traceNode, actionName);

    // Mark the selfWrapper if it's one of the next steps
    var selfWrapper = actionResultContainer.parentElement.parentElement;
    if (semanticsActionHelpers.isNextStep(result, traceNode, actionName)) {
      selfWrapper.classList.add('nextStepMark');
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

  // Appends an semantic editor to the label of node wrapper
  function appendSemanticsEditor(semantics, wrapper, rootTrace, actionName) {
    var traceNode = wrapper.parentElement._traceNode;
    var semanticsEditor = wrapper.appendChild(createElement('.semanticsEditor'));

    var actionResultContainer = semanticsEditor.appendChild(createElement('.result'));
    loadActionResult(traceNode, actionName, actionResultContainer);

    var isPassThrough = !!semanticsActionHelpers.isPassThrough(traceNode, actionName);
    wrapper.classList.toggle('passThrough', isPassThrough);

    // If there is no result for the traceNode, or the result is an error,
    // then hides the whole editor. Otherwise, only shows the result.
    if (semanticsActionHelpers.hasNoResult(traceNode, actionName) ||
        wrapper.classList.contains('passThrough') ||
        actionResultContainer.classList.contains('error')) {
      semanticsEditor.hidden = true;
    } else if (!semanticsEditor.hidden) {
      semanticsEditor.classList.add('resultOnly');
      actionResultContainer.classList.add('alwaysShow');
    }

    // If this node was edited before refresh, and there was runtime error for runing
    // its semantics action, then keep its semantics editor open.
    if (traceNode._runtimeError) {
      toggleSemanticsEditor(wrapper, semantics, rootTrace, actionName);
      delete traceNode._runtimeError;
    }
  }

  function createTraceElement(semantics, rootTrace, traceNode, parent, input, optActionName) {
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
        toggleSemanticsEditor(selfWrapper, semantics, rootTrace, optActionName);
      } else if (!isLeaf(traceNode)) {
        toggleTraceElement(wrapper, optActionName);
      }
      e.preventDefault();
    });

    selfWrapper.addEventListener('mouseover', function(e) {
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

    selfWrapper.addEventListener('mouseout', function(e) {
      if (input) {
        input.classList.remove('highlight');
      }
      clearMarks();
    });

    label.addEventListener('contextmenu', function(e) {
      handleContextMenu(e, semantics, rootTrace, traceNode, optActionName);
    });

    var couldAppendSemanticsEditor =
        shouldNodeBeLabeled(traceNode) &&
        traceNode.succeeded &&
        pexpr.ruleName !== 'spaces';

    if (optActionName && couldAppendSemanticsEditor) {
      semanticsActionHelpers.populateActionResult(semantics, traceNode, optActionName);
      appendSemanticsEditor(semantics, selfWrapper, rootTrace, optActionName);
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
    if (e.keyCode === KeyCode.ESC) {
      hideContextMenu();
    }
  });

  // Intialize the zoom out button.
  var zoomOutButton = $('#zoomOutButton');
  zoomOutButton.textContent = UnicodeChars.ANTICLOCKWISE_OPEN_CIRCLE_ARROW;
  function initializeZoomOutButton(semantics, optActionName) {
    zoomOutButton.hidden = !zoomState.zoomTrace;

    zoomOutButton.onclick = function(e) { clearZoomState(semantics, optActionName); };
    zoomOutButton.onmouseover = function(e) {
      if (zoomState.zoomTrace) {
        updateZoomState({previewOnly: true}, semantics, optActionName);
      }
    };
    zoomOutButton.onmouseout = function(e) {
      if (zoomState.zoomTrace) {
        updateZoomState({previewOnly: false}, semantics, optActionName);
      }
    };
  }

  function initializeActionButtonEvent(semantics, rootTrace, optActionName) {
    var actionContainers = document.querySelectorAll('.actionEntries');
    Array.prototype.forEach.call(actionContainers, function(actionContainer) {
      actionContainer.onclick = function(event) {
        var actionName = event.target.value;
        if (optActionName === actionName || !event.target.readOnly) {
          refreshParseTree(semantics, rootTrace);
        } else {
          refreshParseTree(semantics, rootTrace, actionName);
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
            refreshParseTree(semantics, rootTrace, actionName);
          } catch (error) {
            event.target.readOnly = false;
            window.alert(error); // eslint-disable-line no-alert
            event.target.select();
          }
        }
      };
    });
  }

  // Re-render the parse tree starting with the trace at `rootTrace`.
  function refreshParseTree(semantics, rootTrace, optActionName, clearZoomTrace) {
    var expandedInputDiv = $('#expandedInput');
    var parseResultsDiv = $('#parseResults');

    expandedInputDiv.innerHTML = '';
    parseResultsDiv.innerHTML = '';

    if (clearZoomTrace) {
      zoomState = {};
    }
    initializeZoomOutButton(semantics, optActionName);

    var trace;
    if (zoomState.zoomTrace && !zoomState.previewOnly) {
      trace = zoomState.zoomTrace;
    } else {
      trace = rootTrace;
    }

    var rootWrapper = parseResultsDiv.appendChild(createTraceWrapper(trace));
    var rootContainer = rootWrapper.appendChild(createElement('.children'));

    initializeActionButtonEvent(semantics, rootTrace, optActionName);
    if (optActionName) {
      semanticsActionHelpers.initializeActionLog();
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
            semantics, rootTrace, node, container, childInput, optActionName);
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
