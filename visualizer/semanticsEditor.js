/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.CodeMirror, root.domUtil,
        root.es6);
  }
})(this, function(ohm, ohmEditor, CodeMirror, domUtil, es6) {

  // Privates
  // --------
  var $ = domUtil.$;
  var $$ = domUtil.$$;

  var semanticsEditor = $('.semanticsEditor');

  var UnicodeChars = {
    BLACK_RIGHT_POINTING_TRIANGLE: '\u25B6',
    LEFTWARDS_ARROW: '\u2190',
    BLACK_DOWN_POINTING_TRIANGLE: '\u25BC'
  };

  function generateOperationSignature(opName, optFormals) {
    return optFormals ? opName + '(' + optFormals.join(', ') + ')' : opName;
  }

  function addEditorMovingListener() {
    var offsetY = 0;
    var offsetX = 0;
    var prepareToMove = false;

    var header = semanticsEditor.querySelector('.header');
    window.onmousedown = function(event) {
      if (event.target === header) {
        prepareToMove = true;
        offsetY = event.clientY - semanticsEditor.offsetTop;
        offsetX = event.clientX - semanticsEditor.offsetLeft;
      }
    };

    window.onmousemove = function(event) {
      if (!prepareToMove) {
        return;
      }
      semanticsEditor.style.left = event.clientX - offsetX + 'px';
      semanticsEditor.style.top = event.clientY - offsetY + 'px';
    };

    window.onmouseup = function(event) {
      prepareToMove = false;
      offsetY = 0;
      offsetX = 0;
    };
  }

  function closeEditor() {
    var preSelected = $('.self.selected');
    if (preSelected) {
      preSelected.classList.remove('selected');
    }

    semanticsEditor.classList.remove('showing');
  }

  function createHeader() {
    var container = domUtil.createElement('.header');

    // TODO: ADD back and forward buttom for navigating through editing process.
    container.appendChild(domUtil.createElement('directBt'));

    container.appendChild(domUtil.createElement('select.names'));

    var close = container.appendChild(domUtil.createElement('closeBT', 'X'));
    close.onclick = function(event) { closeEditor(); };

    return container;
  }

  function createMainBody() {
    var container = domUtil.createElement('.mainBody');

    // Create editor header.
    container.appendChild(domUtil.createElement('.rule'));

    // Create argument tags.
    container.appendChild(domUtil.createElement('.argTags'));

    // Create action editor and add CodeMirror to it.
    var actionEditorDiv = container.appendChild(domUtil.createElement('.body'));
    CodeMirror(actionEditorDiv);

    // Create action result container.
    container.appendChild(domUtil.createElement('.result'));

    return container;
  }

  // TODO: table[operation, subexpression]
  function createFooter() {
    var container = domUtil.createElement('.footer');

    return container;
  }

  // Add `header`, `body`, and `footer` to the editor as containers for different
  // parts of the semanticsEditor
  function initializeSemanticsEditor() {
    semanticsEditor.innerHTML = '';
    semanticsEditor.appendChild(createHeader());
    semanticsEditor.appendChild(createMainBody());
    semanticsEditor.appendChild(createFooter());

    addEditorMovingListener();
  }

  // Initialize the semantics editor when semantics is initialized, to prepared
  // for semantics editing.
  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    if (grammar && grammar.defaultStartRule) {
      initializeSemanticsEditor();
    }
  });

  // Check if an operation name is a restrict JS identifier
  // TODO: it less restrictive in the future
  function isOperationNameValid(name) {
    return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  }
  function addToOperationList(type, name, optArgs) {
    var opList = $('.semanticsEditor .header .names');
    var operation = generateOperationSignature(name, optArgs && Object.keys(optArgs));
    var entry = opList.appendChild(domUtil.createElement('option.name', operation));
    entry.value = name;
  }
  ohmEditor.semantics.addListener('add:semanticOperation', function(type, name, optArgs,
      origActionDict) {
    closeEditor();
    if (!isOperationNameValid(name)) {
      return;
    }
    addToOperationList(type, name, optArgs);
  });

  ohmEditor.semantics.addListener('change:semanticOperation', function(targetName, optArgs) {
    closeEditor();
  });

  ohmEditor.semantics.addListener('edit:semanticOperation', function(wrapper, operationName,
    optArgs) {
    closeEditor();

    var opList = $('.semanticsEditor .header .names');
    var entry = Array.prototype.filter.call(opList.children, function(child) {
      return child.value === operationName;
    })[0];

    opList.removeChild(entry);
    if (optArgs) {
      addToOperationList('Operation', operationName, optArgs);
    }
  });

  // Generate a class name for the result block which used to identify the
  // semantic operation that generates the result.
  // Format: 'operationName_' <operation name> ('_' <arg#i>)*
  function generateResultBlockClassId(name, args) {
    var blockClassId = name;
    if (args) {
      var argValues = Object.keys(args).map(function(key) {
        return args[key];
      });
      blockClassId += '_' + argValues.join('_');
    }
    return 'operationName_' + blockClassId;
  }

  // Creates a single `resultBlock`, which contains,
  // `value`: the actual result container
  // `operation`: the semantic operation for the result
  function createResultBlock(opName, resultWrapper) {
    var block = domUtil.createElement('resultBlock');
    domUtil.toggleClasses(block, {
      error: resultWrapper.isError && !resultWrapper.missingSemanticsAction,
      forced: resultWrapper.forced,
      passThrough: resultWrapper.isPassThrough,
      optNextStep: !resultWrapper.forced && resultWrapper.isError
    });

    var blockClassId = generateResultBlockClassId(opName, resultWrapper.args);
    block.classList.add(blockClassId);

    // Return without putting actual result contents if the result is missing semantics action,
    // or it's an error, which not caused by the associated node.
    if (resultWrapper.missingSemanticsAction ||
        block.classList.contains('error') && !resultWrapper.isNextStep) {
      return block;
    }

    var result = resultWrapper.result;
    var valueContainer = block.appendChild(domUtil.createElement('value'));
    valueContainer.innerHTML = resultWrapper.isError ? result : JSON.stringify(result);

    var opSignature = opName;
    if (resultWrapper.args) {
      var argValues = Object.keys(resultWrapper.args).map(function(key) {
          return String(resultWrapper.args[key]);
        });
      opSignature += '(' + argValues.join(',') + ')';
    }
    var opNameContainer = block.appendChild(domUtil.createElement('operation'));
    var semanticOperations = ohmEditor.semantics.getSemantics();
    var operationCount = Object.keys(semanticOperations.operations).length +
        Object.keys(semanticOperations.attributes).length;
    if (!resultWrapper.args && operationCount === 1) {
      opNameContainer.hidden = true;
    }
    opNameContainer.innerHTML = opSignature;

    // If there are more than one operations, or the only opertaion has arguments, then hover
    // the block, and all the blocks that represent the results for the same operation signature
    // will be highlighted.
    if (operationCount > 1 || resultWrapper.args) {
      block.onmouseover = function(event) {
        $$('.self .result .' + blockClassId).forEach(function(b) {
          b.classList.add('highlight');
        });
      };
      block.onmouseout = function(event) {
        $$('.self .result .' + blockClassId).forEach(function(b) {
          b.classList.remove('highlight');
        });
      };
    }
    return block;
  }

  // Creates semantics editor result container and fills it the with `resultBlock`,
  // each of which reprensents a semantic result on this node.
  function createAndLoadResultContainer(traceNode, selfWrapper) {
    var resultContainer = domUtil.createElement('.result');
    var results = ohmEditor.semantics.getResults(traceNode);
    if (!results) {
      return resultContainer;
    }
    var idx = 0;
    Object.keys(results).forEach(function(opName) {
      var resultList = results[opName];
      resultList.forEach(function(resultWrapper) {
        var resultBlock = resultContainer.appendChild(createResultBlock(opName, resultWrapper));
        // If the result block is not the first one that contains a result, then add a left border
        // to it to seperate it from its former block
        if (resultBlock.textContent) {
          resultBlock.classList.toggle('leftBorder', idx++ > 0);
        }
        if (!resultWrapper.forced && resultWrapper.isNextStep) {
          selfWrapper.classList.add('nextStep');
        }
      });
    });

    // A `self` wrapper is marked as `passThrough` if all the results are passThrough.
    // Also, if a result is forced, then it could not be a missing semantics error.
    var passThroughContainers = resultContainer.querySelectorAll('.passThrough');
    if (passThroughContainers.length === resultContainer.children.length) {
      selfWrapper.classList.toggle('passThrough',
        Array.prototype.some.call(resultContainer.children, function(child) {
          return child.classList.contains('forced') ? !!child.textContent : true;
        }));
    }

    if (resultContainer.textContent.length === 0) {
      resultContainer.style.padding = '0';
      resultContainer.style.margin  = '0';
    }
    return resultContainer;
  }

  function appendResultContainer(wrapper) {
    var selfWrapper = wrapper.querySelector('.self');
    var traceNode = wrapper._traceNode;

    var resultContainer = selfWrapper.appendChild(createAndLoadResultContainer(traceNode,
        selfWrapper));

    // If the node is collapsed, and its children is one of the next steps, then mark it as a
    // temperary next step
    if (selfWrapper.parentElement.classList.contains('collapsed')) {
      selfWrapper.classList.toggle('tmpNextStep', !!resultContainer.querySelector('.optNextStep'));
    }

    if (traceNode._lastEdited) {
      selfWrapper.classList.add('selected');
    }
  }
  ohmEditor.parseTree.addListener('create:traceElement', function(wrapper, traceNode) {
    var shouldHaveSemanticsEditor = ohmEditor.options.semantics &&
        ohmEditor.semantics.appendEditor &&
        !wrapper.classList.contains('hidden') &&
        !wrapper.classList.contains('failed');
    if (shouldHaveSemanticsEditor) {
      appendResultContainer(wrapper);
    }
  });

  function copyWithoutDuplicates(array) {
    var noDuplicates = [];
    array.forEach(function(entry) {
      if (noDuplicates.indexOf(entry) < 0) {
        noDuplicates.push(entry);
      }
    });
    return noDuplicates;
  }

  function getArgDisplayList(defaultArgExp) {
    var argDisplayList = [];

    var iterOp = '';
    var lookaheadOp = '';
    if (defaultArgExp instanceof ohm.pexprs.Iter) {
      // Treat `Iter` expression as an iteration on each of its sub-expression,
      // i.e.  `("a" "b")+` shown as `"a"+ "b"+`
      iterOp = defaultArgExp.operator;
      defaultArgExp = defaultArgExp.expr;
    } else if (defaultArgExp instanceof ohm.pexprs.Lookahead) {
      // Treat `Lookahead` expression as a lookahead on each of its sub-expression,
      // i.e. `&("a" "b")` shown as `&"a" &"b"`
      lookaheadOp = '&';
      defaultArgExp = defaultArgExp.expr;
    }

    if (defaultArgExp instanceof ohm.pexprs.Seq) {
      defaultArgExp.factors.forEach(function(factor) {
        var factorDisplayList = getArgDisplayList(factor).map(function(display) {
          return lookaheadOp + display + iterOp;
        });
        argDisplayList = argDisplayList.concat(factorDisplayList);
      });
    } else if (defaultArgExp instanceof ohm.pexprs.Alt) {
      // Handle the `Alt` expression the same way as the `toArgNameList`, i.e.
      // split each list into columns, and combine argument displays for the same column
      // as a single argument.
      var termArgDisplayLists = defaultArgExp.terms.map(function(term) {
        return getArgDisplayList(term);
      });
      var numArgs = termArgDisplayLists[0].length;
      for (var colIdx = 0; colIdx < numArgs; colIdx++) {
        var col = [];
        for (var rowIdx = 0; rowIdx < defaultArgExp.terms.length; rowIdx++) {
          col.push(termArgDisplayLists[rowIdx][colIdx]);
        }
        var uniqueNames = copyWithoutDuplicates(col).join('|');
        if (lookaheadOp || iterOp) {
          uniqueNames = lookaheadOp + '(' + uniqueNames + ')' + iterOp;
        }
        argDisplayList.push(uniqueNames);
      }
    } else if (!(defaultArgExp instanceof ohm.pexprs.Not)) {
      // We skip `Not` as it won't be a semantics action function argument.
      argDisplayList.push(lookaheadOp + defaultArgExp.toDisplayString() + iterOp);
    }
    return argDisplayList;
  }

  // Create the DOM node that contains action argument display name
  function createArgDisplayContainer(display) {
    var argDisplayContainer = domUtil.createElement('span.display', display);

    // Shows or hides the argument editor by clicking the argument.
    argDisplayContainer.addEventListener('click', function(e) {
      var realArgContainer = argDisplayContainer.parentElement.querySelector('real');
      var shouldBeVisible = realArgContainer.style.display === 'none';
      realArgContainer.style.display = shouldBeVisible ? 'inline-block' : 'none';
      if (shouldBeVisible) {
        realArgContainer.focus();
      }
      e.stopPropagation();
    });

    return argDisplayContainer;
  }

  // Create the DOM node that contains real action argument name
  function createRealArgContainer(display, real, defaultArg) {
    var realArgContainer = domUtil.createElement('real');

    // Make the argument editor element editable
    realArgContainer.setAttribute('contenteditable', true);
    realArgContainer.addEventListener('keydown', function(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        // Disable the ENTER and space keys
        e.preventDefault();
      }
    });

    // Default argument name is hidden if it's not user defined
    var shouldHide = real === defaultArg;
    if (shouldHide) {
      realArgContainer.style.display = 'none';
    }

    // Don't show argument name is if it's the same as its display
    var content = real === display ? '' : real;
    realArgContainer.textContent = content;
    return realArgContainer;
  }

  // Creates a single operation argument tag, which contains a argument name, and
  // corresponding value.
  function createAndLoadArgTag(argName, argValue) {
    var argTag = domUtil.createElement('.argTag');
    argTag.innerHTML = argTag._name = argName;

    var valueSpan = argTag.appendChild(domUtil.createElement('span'));
    valueSpan.innerHTML = JSON.stringify(argValue);

    return argTag;
  }

  function retrieveArgumentsFromHeader() {
    var blocks = semanticsEditor.querySelector('.mainBody .rule blocks');
    return Array.prototype.map.call(blocks.children, function(block) {
      return block.lastChild.textContent || block.firstChild.textContent;
    });
  }

  function updateRule(traceNode, operation) {
    var ruleContainer = $('.semanticsEditor .mainBody .rule');
    ruleContainer.innerHTML = '';

    var cstNodeName = getCSTNodeName(traceNode);
    ruleContainer.appendChild(domUtil.createElement('cstNodeName', cstNodeName));

    // Fill the container with `block`
    // Each `block` represent an argument, inside there are:
    // `span.display`, which contains the argument display name
    // `real`, which is the argument rename editor that contains the real arg name
    var blocks = ruleContainer.appendChild(domUtil.createElement('blocks'));
    var actionArgPairedList = ohmEditor.semantics.getActionArgPairedList(traceNode, operation);
    var argDefaultList = actionArgPairedList.argExpr.toArgumentNameList(1);
    var argRealList = actionArgPairedList.real;
    var argDisplayList = getArgDisplayList(actionArgPairedList.argExpr);
    argDisplayList.forEach(function(argDisplay, idx) {
      var argReal = argRealList ? argRealList[idx] : argDefaultList[idx];
      var argDefault = argDefaultList[idx];
      var block = blocks.appendChild(domUtil.createElement('block'));
      block.appendChild(createArgDisplayContainer(argDisplay));
      block.appendChild(createRealArgContainer(argDisplay, argReal, argDefault));
    });
  }

  // TODO
  function updateArgTags(args) {
    var argTagContainer = $('.semanticsEditor .mainBody .argTags');
    argTagContainer.innerHTML = '';
    if (!args) {
      return;
    }

    Object.keys(args).forEach(function(argName) {
      argTagContainer.appendChild(createAndLoadArgTag(argName, args[argName]));
    });
  }

  // TODO
  function updateActionResult(selfWrapper, operation, args) {
    var editorResultContainer = $('.semanticsEditor .mainBody .result');
    editorResultContainer.classList.remove('error');
    editorResultContainer.textContent = '';
    var targetBlockId = generateResultBlockClassId(operation, args);
    Array.prototype.forEach.call(selfWrapper.querySelectorAll('resultblock.' + targetBlockId),
      function(resultBlock) {
        if (resultBlock.classList.contains('error') && !resultBlock.classList.contains('forced')) {
          editorResultContainer.classList.add('error');
          editorResultContainer.textContent = resultBlock.querySelector('value').textContent;
        }
      });
  }

  function retrieveSelectedOperation() {
    var entries = $$('.semanticsEditor .header .name');
    var selectedEntry = entries.filter(function(entry) {
      return entry.selected;
    })[0];
    return selectedEntry.value;
  }

  // TODO
  function updateMainBody(selfWrapper) {
    var operation = retrieveSelectedOperation();
    var traceNode = selfWrapper.parentElement._traceNode;
    updateRule(traceNode, operation);

    // TODO: handle calling the same operation with multi-set of argument, all of them are unforced
    var argList = ohmEditor.semantics.retrieveArguments(operation, traceNode);
    var args = argList && argList[0];
    updateArgTags(args);

    var actionEditorCM = $('.semanticsEditor .mainBody .body').firstChild.CodeMirror;
    actionEditorCM.setValue(ohmEditor.semantics.getActionBody(traceNode, operation));
    actionEditorCM.setCursor({line: actionEditorCM.lineCount()});

    var saveAction = function(cm) {
      var actionArguments = retrieveArgumentsFromHeader();
      var operationName = $$('.semanticsEditor .header .name').filter(function(entry) {
        return entry.selected;
      })[0].value;
      ohmEditor.semantics.emit('save:semanticAction', traceNode, actionArguments, cm.getValue(),
          operationName);

      traceNode._lastEdited = true;
      ohmEditor.parseTree.refresh();
      delete traceNode._lastEdited;

      // Load the result if there is an run time error
      var operationArgs;
      if ($('.semanticsEditor .mainBody .argTags').textContent) {
        operationArgs = Object.create(null);
        $$('.semanticsEditor .mainBody .argTag').forEach(function(tag) {
          var returnStmt = 'return ' + tag.querySelector('span').textContent + ';';
          operationArgs[tag._name] = new Function(returnStmt)(); // eslint-disable-line no-new-func
        });
      }

      var resultWrapper = ohmEditor.semantics.forceResult(traceNode, operationName, operationArgs);
      var editorResultContainer = $('.semanticsEditor .mainBody .result');
      editorResultContainer.classList.remove('error');
      editorResultContainer.textContent = '';
      if (resultWrapper.isError && !resultWrapper.missingSemanticsAction &&
        resultWrapper.isNextStep) {
        editorResultContainer.classList.add('error');
        editorResultContainer.textContent = resultWrapper.result;
      }
    };

    var isPlatformMac = /Mac/.test(navigator.platform);
    if (isPlatformMac) {
      actionEditorCM.setOption('extraKeys', {'Cmd-S': saveAction});
    } else {
      actionEditorCM.setOption('extraKeys', {'Ctrl-S': saveAction});
    }

    updateActionResult(selfWrapper, operation, args);
  }

  function updateBodyContents(operationName, selfWrapper) {
    var traceNode = selfWrapper.parentElement._traceNode;
    // TODO: handle calling the same operation with multi-set of argument, all of them are unforced
    var argList = ohmEditor.semantics.retrieveArguments(operationName, traceNode);
    var args =  argList && argList[0];
    updateArgTags(args);

    var actionEditorCM = $('.semanticsEditor .mainBody .body').firstChild.CodeMirror;
    actionEditorCM.setValue(ohmEditor.semantics.getActionBody(traceNode, operationName));
    actionEditorCM.setCursor({line: actionEditorCM.lineCount()});
    actionEditorCM.focus();
    actionEditorCM.refresh();

    updateActionResult(selfWrapper, operationName, args);
  }

  function updateOperationList(selfWrapper) {
    var opList = semanticsEditor.querySelector('.header .names');

    // Update the selected operation.
    var traceNode = selfWrapper.parentElement._traceNode;
    // TODO: handle calling the multi-operation
    var opName = ohmEditor.semantics.retrieveOperations(traceNode)[0];
    if (opName) {
      var entry = Array.prototype.filter.call(opList.children, function(e) {
        return e.value === opName;
      })[0];
      entry.selected = true;
    }

    // Update the event listener of operation list.
    opList.onchange = function(event) {
      var entry = Array.prototype.filter.call(opList.children, function(e) {
        return e.selected;
      })[0];
      updateBodyContents(entry.value, selfWrapper);
    };
  }

  // TODO: remove???
  function updateHeader(selfWrapper) {
    updateOperationList(selfWrapper);
    // TODO: ADD back and forward buttom for navigating through editing process.
  }

  // TODO: make sure all cases covered
  function getCSTNodeName(traceNode) {
    var pexpr = traceNode.expr;
    if (pexpr instanceof ohm.pexprs.Iter) {
      return '_iter';
    } else if (pexpr instanceof ohm.pexprs.Terminal) {
      return '_terminal';
    } else {
      return pexpr.toDisplayString();
    }
  }

  function updateSemanticsEditor(selfWrapper) {

    // TODO: <-       eval()        X
    updateHeader(selfWrapper);

    updateMainBody(selfWrapper);

    // TODO: table[operation, subexpression]

    var actionEditor = $('.semanticsEditor .mainBody .body');
    var actionEditorCM = actionEditor.firstChild.CodeMirror;
    actionEditorCM.focus();
    actionEditorCM.refresh();
  }

  // Hides or shows the semantics editor of `el`, which is a div.pexpr.
  function toggleSemanticsEditor(wrapper) {
    var selfWrapper = wrapper.querySelector('.self');
    if (selfWrapper.parentElement !== wrapper) {
      return;
    }

    // Insert or remove the editor body. This avoids having too many CodeMirror.
    var closeOnly = selfWrapper.classList.contains('selected');
    closeEditor();
    if (!closeOnly) {
      selfWrapper.classList.add('selected');
      semanticsEditor.classList.add('showing');
      updateSemanticsEditor(selfWrapper);
    }
  }
  ohmEditor.parseTree.addListener('cmdOrCtrlClick:traceElement', toggleSemanticsEditor);

  // Retrieve arguments from the menu entry's submenu
  function retrieveArgumentsFromSubList(entry) {
    var argumentWrappers = entry.querySelectorAll('ul li');
    if (!argumentWrappers) {
      return undefined;
    }

    var operationArguments = Object.create(null);
    Array.prototype.forEach.call(argumentWrappers, function(argumentWrapper) {
      var name = argumentWrapper.querySelector('.name').textContent;
      var valueContainer = argumentWrapper.querySelector('.value');
      var value = valueContainer.value;
      // If the value is not a valid es6 `assignmentExpression`, and we are not ignoring
      // invalid value, throw an error. This provides a clear and readable error message.
      var isExpression = es6.match(value, 'AssignmentExpression<withIn>').succeeded();
      valueContainer.classList.toggle('error', value && !isExpression);
      if (value && !isExpression) {
        throw new Error(value + ' is not a valid expression for argument assignment.');
      }
      var returnStmt = 'return ' + value + ';';
      operationArguments[name] = new Function(returnStmt)();    // eslint-disable-line no-new-func
    });
    return operationArguments;
  }

  // Create a menu entry that wraps the argument name and a textarea for user to enter
  // corresponding value.
  function createArgumentWrapper(name) {
    var wrapper = domUtil.createElement('li');
    wrapper.appendChild(domUtil.createElement('.name', name));
    wrapper.appendChild(domUtil.createElement('.assign', UnicodeChars.LEFTWARDS_ARROW));
    var valueContainer = wrapper.appendChild(domUtil.createElement('textarea.value'));
    valueContainer.placeholder = 'value';
    valueContainer.cols = 5;
    valueContainer.onkeyup = function(e) {
      valueContainer.cols = Math.max(valueContainer.value.length, 5);
    };
    valueContainer.onclick = function(e) {
      valueContainer.classList.remove('error');
      e.stopPropagation();
    };
    valueContainer.onkeypress = function(e) {
      valueContainer.classList.remove('error');
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    };
    return wrapper;
  }

  // Create a submenu that wraps the list of arguments.
  function createArgumentsWrapper(formals) {
    var argumentsWrapper = domUtil.createElement('ul');
    formals.forEach(function(name) {
      argumentsWrapper.appendChild(createArgumentWrapper(name));
    });
    argumentsWrapper.hidden = true;
    return argumentsWrapper;
  }

  // Append a `resultBlock` to the result container of the editor
  function appendSingleResult(resultContainer, entry, traceNode, name) {
    resultContainer.hidden = false;
    resultContainer.classList.add('showing');

    var args = retrieveArgumentsFromSubList(entry);
    // If the result already showed, return.
    var blockClassId = generateResultBlockClassId(name, args);
    if (resultContainer.querySelector('.' + blockClassId)) {
      return;
    }

    var resultWrapper = ohmEditor.semantics.forceResult(traceNode, name, args);
    if (!resultWrapper) {
      return;
    }

    var resultBlock = resultContainer.appendChild(createResultBlock(name, resultWrapper));

    // Mark the newly appended result block if it is a pass through node, i.e. the result
    // will be hided no matter what.
    // This will be used by `removeEditorBody` to remove the block at the same time to avoid
    // confusion.
    if (domUtil.closestElementMatching('.self.passThrough', resultContainer)) {
      resultBlock._needRemove = true;
    }
    var resultBlocks = resultContainer.querySelectorAll('resultBlock');
    var hasLeftBorder = false;
    Array.prototype.forEach.call(resultBlocks, function(block) {
      if (block.textContent && block !== resultBlock) {
        hasLeftBorder = true;
      } else if (block === resultBlock) {
        resultBlock.classList.toggle('leftBorder', hasLeftBorder);
      }
    });
  }

  // Create an menu entry that corresponding a semantic operation
  function createSemanticEntry(semanticOperation, traceNode, resultContainer) {
    var name = semanticOperation.name;
    var entry = domUtil.createElement('li');
    var formals = semanticOperation.formals;
    entry.appendChild(domUtil.createElement('label', name));
    entry.appendChild(createArgumentsWrapper(formals));

    // Mark the entry `disabled` if semantics action of the operation is missing for the node,
    // or the result for the node already showed. * For the operation with arguments, we only need
    // to check if the semantics action is missing.
    var resultBlock = resultContainer.querySelector('.operationName_' + name);
    var args = retrieveArgumentsFromSubList(entry);
    var resultWrapper = ohmEditor.semantics.forceResult(traceNode, name, args);
    var missingSemanticsAction = resultWrapper.missingSemanticsAction;
    entry.classList.toggle('disabled',
        missingSemanticsAction ||    // Missing the semantics action for the node.
        resultBlock);                // The semantic result for the node already showed.
    entry.onclick = function(event) {
      event.stopPropagation();
      if (entry.classList.contains('disabled')) {
        return;
      }
      try {
        appendSingleResult(resultContainer, entry, traceNode, name);
      } catch (error) {
        window.alert(error);    // eslint-disable-line no-alert
        return;
      }
      if (formals.length === 0) {
        entry.classList.add('disabled');
      }
      $('#parseTreeMenu').hidden = true;
    };

    entry.onkeypress = function(event) {
      event.stopPropagation();
      if (event.keyCode !== 13) {
        return;
      }
      event.preventDefault();
      try {
        appendSingleResult(resultContainer, entry, traceNode, name);
      } catch (error) {
        window.alert(error);    // eslint-disable-line no-alert
        return;
      }
      $('#parseTreeMenu').hidden = true;
    };
    return entry;
  }

  // Add all the semantics to the submenu of `Force evaluation`
  function addSemanticEntries(entryWrapper, traceNode, resultContainer) {
    var semanticOperations = ohmEditor.semantics.getSemantics();
    var operations = semanticOperations.operations;
    Object.keys(operations).forEach(function(operationName) {
      entryWrapper.appendChild(createSemanticEntry(operations[operationName], traceNode,
          resultContainer));
    });

    var attributes = semanticOperations.attributes;
    Object.keys(attributes).forEach(function(attributeName) {
      entryWrapper.appendChild(createSemanticEntry(attributes[attributeName], traceNode,
          resultContainer));
    });
  }
  ohmEditor.parseTree.addListener('contextMenu', function(target, traceNode) {
    var selfWrapper = domUtil.closestElementMatching('.self', target);
    var resultContainer = selfWrapper.querySelector('.result');
    var evaluatingSemantics = ohmEditor.semantics.appendEditor;
    var forceEntryContent = 'Force Evaluation';
    forceEntryContent +=
        '<span class="triangle">' + UnicodeChars.BLACK_RIGHT_POINTING_TRIANGLE + '</span>';
    var forceEntry = domUtil.addMenuItem('parseTreeMenu', 'forceEvaluation', forceEntryContent,
        evaluatingSemantics, function(event) { event.stopPropagation(); });
    if (!evaluatingSemantics) {
      return;
    }
    // Hover the `Force Evaluation` entry to show forcing options
    forceEntry.onmouseover = function() {
      var entryWrapper;
      if (forceEntry.querySelector('ul')) {
        entryWrapper = forceEntry.querySelector('ul');
      } else {
        entryWrapper = forceEntry.appendChild(domUtil.createElement('ul'));
        entryWrapper.hidden = true;
        addSemanticEntries(entryWrapper, traceNode, resultContainer);
      }
    };
  });

  // Remove the node's `tmpNextStep` mark if there is any.
  ohmEditor.parseTree.addListener('expand:traceElement', function(wrapper) {
    var selfWrapper = wrapper.querySelector('.self');
    selfWrapper.classList.remove('tmpNextStep');
  });

  // If one of the node's descendants is `next step`, mark it as temporary `next step`.
  ohmEditor.parseTree.addListener('collapse:traceElement', function(wrapper) {
    var selfWrapper = wrapper.querySelector('.self');
    var resultContainer = selfWrapper.querySelector('.result');
    if (!resultContainer) {
      return;
    }
    var shouldMark = resultContainer.querySelector('.optNextStep');
    selfWrapper.classList.toggle('tmpNextStep', !!shouldMark);
  });

});
