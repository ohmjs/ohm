/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.CheckedEmitter, root.es6);
  }
})(this, function(ohm, ohmEditor, CheckedEmitter, es6) {

  var semantics = null;

  // `opName` is the semantic operation that current executing, it's null whenever
  // an empty semantics is created.
  var opName = null;

  // `opArguments` is the operation arguments for the operation with `opName`, could
  // be empty.
  var opArguments = null;

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    if (grammar && grammar.defaultStartRule) {
      semantics = grammar.createSemantics();
      opName = null;
      opArguments = null;
    }
  });

  // Handle the `change:semanticOperation` event. The event is emitted when user click on an
  // operation button, or try to change the operation argument
  ohmEditor.semantics.addListener('change:semanticOperation', function(targetName, optArgs) {
    if (opName === targetName) {
      // If user click on the same button that already selected, we stop evaluating the semantic
      // operation, i.e. no semantics is called afterward.
      opName = null;
      opArguments = null;
    } else {
      // If the user is just change the arguments, i.e. `targetName` is `null`, keep the `opName`
      opName = targetName || opName;
      opArguments = ohmEditor.semantics.opArguments = optArgs;
    }
  });

  // Semantics result that represents an error
  // caused by missing semantics action
  function Failure() { }
  Failure.prototype.toString = function() {
    return undefined;
  };
  var failure = new Failure();
  failure.isFailure = true;

  // Semantics result that represents a runtime error
  // except caused by missing semantics action
  function ErrorWrapper(key, error) {
    this.nodeOpKey = key;
    this.error = error;
  }
  ErrorWrapper.prototype.causedBy = function(key) {
    return this.nodeOpKey === key;
  };
  ErrorWrapper.prototype.toString = function() {
    return this.error.message || this.error;
  };
  ErrorWrapper.prototype.isErrorWrapper = true;

  var resultMap;
  var forcing;
  var todoList;
  var errorList;
  var passThroughList;
  function initializeSemanticsLog() {
    resultMap = Object.create(null);
    todoList = undefined;
    errorList = undefined;
    passThroughList = undefined;
    forcing = false;
  }

  function nodeKey(cstNode) {
    var ctorName = cstNode.ctorName;
    var source = cstNode.source;
    return ctorName + '_from_' + source.startIdx + '_to_' + source.endIdx;
  }

  function nodeOpKey(nodeKey, operationName) {
    return nodeKey + '_at_' + operationName;
  }

  // Return the corresponding result that is already recorded (* this also be used for
  // result existance checking).
  function getResult(key, name, optArgs) {
    if (!(key in resultMap) || !(name in resultMap[key])) {
      return undefined;
    }

    var resultList = resultMap[key][name].filter(function(resultWrapper) {
      if (!resultWrapper.args ||
          JSON.stringify(resultWrapper.args) === JSON.stringify(optArgs)) {
        // Alternate the `forced` property, to make sure is result is only forced
        // when all the path that could get the result is forced.
        resultWrapper.forced = resultWrapper.forced && forcing;
        return true;
      }
      return false;
    });
    return resultList[0];
  }

  function addResult(result, key, name, optArgs) {
    // Return without adding duplicated results.
    if (getResult(key, name, optArgs)) {
      return;
    }

    // Initialize entry to prepare for the new result
    resultMap[key] = resultMap[key] || Object.create(null);
    resultMap[key][name] = resultMap[key][name] || [];

    // Check if the result is already recorded (* as `forceResults` is called without
    // checking duplications).
    var isDuplicated = false;
    resultMap[key][name].forEach(function(resultWrapper) {
      if (!resultWrapper.args ||
          JSON.stringify(resultWrapper.args) === JSON.stringify(optArgs)) {
        isDuplicated = true;
        // Alternate the `forced` property, to make sure is result is only forced
        // when all the path that could get the result is forced.
        resultWrapper.forced = resultWrapper.forced && forcing;
      }
    });
    // Return without adding duplicated results.
    if (isDuplicated) {
      return;
    }

    // Wrap actual result into an object, which may contain
    // arguments, and markers.
    var resultWrapper = {result: result};
    if (optArgs && Object.keys(optArgs).length > 0) {
      resultWrapper.args = optArgs;
    }

    var nOpKey = nodeOpKey(key, name);
    resultWrapper.forced = forcing;
    resultWrapper.forCallingSemantic = opName === name;
    resultWrapper.missingSemanticsAction = result === failure;
    resultWrapper.isError = result && result.isErrorWrapper || result === failure;
    resultWrapper.isNextStep = name === opName && result &&
      ((result.isErrorWrapper && result.causedBy(nOpKey)) ||
      (todoList && todoList.includes(nOpKey)));
    resultWrapper.isPassThrough = !!passThroughList && passThroughList.includes(nOpKey);
    resultMap[key][name].push(resultWrapper);
  }

  function toValueList(args) {
    return Object.keys(args).map(function(argName) {
      return args[argName];
    });
  }

  function initActionDict(type, operationName) {
    var name = operationName;
    var defaults = {
      _terminal: function() {
        var key = nodeKey(this);
        var result = failure;
        todoList = todoList || [];
        todoList.push(nodeOpKey(key, name));
        addResult(result, key, name, this.args);
        return result;
      },

      _iter: function(children) {
        var key = nodeKey(this);
        var argValues = toValueList(this.args);
        var result = children.map(function(child) {
          return type === 'Operation' ? child[name].apply(child, argValues) : child[name];
        });
        var aChildFailed = result.indexOf(failure) >= 0;
        var aChildError = result.some(function(childResult) {
          return childResult && childResult.isErrorWrapper;
        });
        result = aChildFailed ? failure : (aChildError ? errorList[0] : result);
        addResult(result, key, name, this.args);
        return result;
      },

      _nonterminal: function(children) {
        var key = nodeKey(this);
        var nOpKey = nodeOpKey(key, name);
        var argValues = toValueList(this.args);

        var result;
        var origTodoList = todoList;
        var origErrorList = errorList;
        todoList = errorList = undefined;
        try {
          if (children.length === 1) {
            passThroughList = passThroughList || [];
            passThroughList.push(nOpKey);

            var child = children[0];
            result = type === 'Operation' ? child[name].apply(child, argValues) : child[name];
          } else {
            todoList = [nOpKey];
          }
        } catch (error) {
          result = new ErrorWrapper(nOpKey, error);
          if (!errorList) {
            errorList = [result];
          }
        }
        result = todoList ? failure : (errorList ? errorList[0] : result);
        todoList = todoList ? todoList.concat(origTodoList) : origTodoList;
        errorList = errorList ? errorList.concat(origErrorList) : origErrorList;
        addResult(result, key, name, this.args);
        return result;
      }
    };
    Object.keys(defaults).forEach(function(k) { defaults[k]._isDefault = true; });
    return defaults;
  }

  // Merge the actions in the `optActionDict` into `actionDict`
  function mergeActionDict(name, actionDict, optActionDict) {
    if (!optActionDict) {
      return;
    }
    Object.keys(optActionDict).forEach(function(key) {
      if (actionDict[key]) {
        return;
      }
      var actionArguments = optActionDict[key]._actionArguments;
      var actionBody = optActionDict[key]._actionBody;
      actionDict[key] = wrapAction(name, actionArguments, actionBody);
    });
  }

  // Add new operation/attribute to the semantics
  function addSemanticOperation(type, name, optArgs, optOrigActionDict) {
    var signature = name;
    if (type === 'Operation' && optArgs) {
      var argumentNames = Object.keys(optArgs);
      if (argumentNames.length > 0) {
        signature += '(' + argumentNames.join(',') + ')';
      }
    }

    semantics['add' + type](signature, initActionDict(type, name));
    mergeActionDict(name, semantics._getActionDict(name), optOrigActionDict);
  }

  // Check if an operation name is a restrict JS identifier
  // TODO: it less restrictive in the future
  function isOperationNameValid(name) {
    return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);
  }
  ohmEditor.semantics.addListener('add:semanticOperation', function(type, name, optArgs,
      origActionDict) {
    // Throw a more clear and readable error message if the name is not a valid operation name.
    if (!isOperationNameValid(name)) {
      throw new Error('Cannot add ' + type + " '" + name + "': that's an invalid name");
    }
    addSemanticOperation(type, name, optArgs, origActionDict);
    opName = name;
    opArguments = ohmEditor.semantics.opArguments = optArgs;
  });

  function populateSemanticsResult(traceNode, optOpName, optArgs) {
    var operationName = optOpName || opName;
    try {
      var nodeWrapper = semantics._getSemantics().wrap(traceNode.bindings[0]);
      if (operationName in semantics._getSemantics().operations) {
        var argValues;
        if (operationName === opName) {
          argValues = toValueList(optArgs || opArguments || Object.create(null));
        } else {
          argValues = toValueList(optArgs || Object.create(null));
        }
        nodeWrapper[operationName].apply(nodeWrapper, argValues);
      } else {
        nodeWrapper._forgetMemoizedResultFor(operationName);
        nodeWrapper[operationName];   // eslint-disable-line no-unused-expressions
      }
    } catch (error) {
      /* All the error will be an ErrorWrapper which already recorded in the resultMap */
    }
  }
  ohmEditor.parseTree.addListener('render:parseTree', function(traceNode) {
    if (!opName) {
      ohmEditor.semantics.appendEditor = false;
      return;
    }
    ohmEditor.semantics.appendEditor = true;
    initializeSemanticsLog();
    populateSemanticsResult(traceNode);
  });

  function forceResults(traceNode) {
    forcing = true;
    var semanticsNameList = semantics.getOperationNames().concat(semantics.getAttributeNames());
    semanticsNameList.forEach(function(name) {
      populateSemanticsResult(traceNode, name);
    });
    forcing = false;
  }

  function allForced(key) {
    var results = resultMap[key];
    var forced = Object.keys(results).every(function(operationName) {
      var resultList = results[operationName];
      return resultList.every(function(resultWrapper) {
        return resultWrapper.forced;
      });
    });
    return forced;
  }

  function getDefaultArgExpression(traceNode) {
    var pexpr = traceNode.expr;

    // Get rule body of the Apply expression.
    if (pexpr instanceof ohm.pexprs.Apply) {
      var succeedChild = traceNode.children[traceNode.children.length - 1];
      pexpr = succeedChild.expr;

      // If the rule body is an Alt expression, then get its succeed term.
      if (pexpr instanceof ohm.pexprs.Alt) {
        pexpr = succeedChild.children[succeedChild.children.length - 1].expr;
      }
    }

    return pexpr;
  }

  // Build the action that called from the wrapper, which includes renaming the
  // operation arguments, and actual action body that user typed.
  function buildAction(opArgs, actionArguments, actionBody) {
    // Constructs the code that renames the operation arguments, so we could refer
    // them by name directly. i.e. `var <argument name> = this.args.<argument name>`
    var renameOpArgStr = opArgs && Object.keys(opArgs).map(function(argName) {
      return 'var ' + argName + ' = this.args.' + argName + ';';
    }).join('\n');

    actionBody = renameOpArgStr + '\n' + actionBody;
    var formals = actionArguments.join(',');
    return new Function(formals, actionBody);    // eslint-disable-line no-new-func
  }

  function wrapAction(currentOpName, actionArguments, actionBody) {
    if (!actionBody.trim()) {
      return undefined;
    }

    var origActionBody = actionBody;
    var enclosedActionArgStr = '(' + actionArguments.join(',') + ')';
    var realAction = 'function' + enclosedActionArgStr + '{\n' + actionBody + '\n}';
    var isExpression = es6.match(actionBody, 'AssignmentExpression<withIn>').succeeded();
    if (isExpression) {
      actionBody = 'return ' + actionBody + ';';
    }
    var wrapper = function() {
      var key = nodeKey(this);
      var nOpKey = nodeOpKey(key, currentOpName);
      var result;
      var action;

      // Build the semantic action, if there is a syntactic error, then
      // record it and return.
      try {
        action = buildAction(this.args, actionArguments, actionBody);
      } catch (error) {
        result = new ErrorWrapper(nOpKey, error);
        errorList = errorList || [];
        errorList.push(result);
        addResult(result, key, currentOpName, this.args);
        return result;
      }

      var origTodoList = todoList;
      var origErrorList = errorList;
      todoList = errorList = undefined;
      try {
        result = action.apply(this, arguments);
      } catch (error) {
        result = new ErrorWrapper(nOpKey, error);

        // The error will be recorded only if there is no error caught by its children.
        if (!errorList) {
          errorList = [result];
        }
      }

      // If there is a child missing semantic action, then its result should be
      // `failure`. If there is an error occured during the action evaluation, then
      // its result should be an `ErrorWrapper`. Otherwise, keep the result.
      result = todoList ? failure : (errorList ? errorList[0] : result);
      todoList = todoList ? todoList.concat(origTodoList) : origTodoList;
      errorList = errorList ? errorList.concat(origErrorList) : origErrorList;
      addResult(result, key, currentOpName, this.args);
      return result;
    };
    wrapper.toString = function() {
      return realAction;
    };
    wrapper._actionArguments = actionArguments;
    wrapper._actionBody = origActionBody;
    return wrapper;
  }

  function saveAction(traceNode, currentOpName, actionArguments, actionBody) {
    var actionKey = traceNode.bindings[0].ctorName;
    var actionWrapper = wrapAction(currentOpName, actionArguments, actionBody);
    semantics._getActionDict(currentOpName)[actionKey] = actionWrapper;
  }
  ohmEditor.semantics.addListener('save:semanticAction', function(traceNode, actionArguments,
      actionBody) {
    saveAction(traceNode, opName, actionArguments, actionBody);
  });

  function editSemanticsOperation(wrapper, operationName, opDescription) {
    wrapper._origActionDict = semantics._getActionDict(operationName);
    semantics._remove(operationName);

    if (opDescription) {
      var type = opDescription.type;
      var optArgs = opDescription.args;
      addSemanticOperation(type, operationName, optArgs, wrapper._origActionDict);
      delete wrapper._origActionDict;
      if (operationName === opName) {
        opArguments = ohmEditor.semantics.opArguments = optArgs;
      }
    } else if (operationName === opName) {
      opName = null;
      opArguments = null;
    }
  }
  ohmEditor.semantics.addListener('edit:semanticOperation', editSemanticsOperation);

  // Exports
  // -------

  ohmEditor.semantics.forceResult = function(traceNode, name, optArgs) {
    var key = nodeKey(traceNode.bindings[0]);
    forcing = true;
    populateSemanticsResult(traceNode, name, optArgs);
    var resultWrapper = getResult(key, name, optArgs);
    forcing = false;
    return resultWrapper;
  };

  ohmEditor.semantics.getResults = function(traceNode) {
    var key = nodeKey(traceNode.bindings[0]);
    // If the node has not been evaluated yet, or all its existing semantic results are
    // forced, then we force the evaluation on it to make sure all the available operations
    // are evaluated at this node.
    if (!(key in resultMap) || allForced(key)) {
      forceResults(traceNode);
    }
    return resultMap[key];
  };

  // If there is no user added action for the rule, return default argument list,
  // Otherwise, return the argument list that user renamed before
  ohmEditor.semantics.getActionArgPairedList = function(traceNode) {
    var actionKey = traceNode.bindings[0].ctorName;
    var defaultArgExpression = getDefaultArgExpression(traceNode);

    var argPairList = {argExpr: defaultArgExpression};
    var action = semantics._getActionDict(opName)[actionKey];
    if (!action || action._isDefault) {
      return argPairList;
    }

    var actionStr = action.toString();
    var realArgStr = actionStr.substring(actionStr.indexOf('(') + 1, actionStr.indexOf(')'));
    argPairList.real = realArgStr.split(',').map(function(argStr) {
      return argStr.trim();
    });
    return argPairList;
  };

  ohmEditor.semantics.getActionBody = function(traceNode) {
    var actionKey = traceNode.bindings[0].ctorName;
    var action = semantics._getActionDict(opName)[actionKey];
    if (!action || action._isDefault) {
      return '';
    }

    var actionStr = action.toString();
    var actionBodyStartIdx = actionStr.indexOf('\n') + 1;
    var actionBodyEndIdx = actionStr.lastIndexOf('\n');
    return actionStr.substring(actionBodyStartIdx, actionBodyEndIdx);
  };

  ohmEditor.semantics.getSemantics = function() {
    var semanticOperations = {
      operations: semantics._getSemantics().operations,
      attributes: semantics._getSemantics().attributes
    };
    return semanticOperations;
  };
});
