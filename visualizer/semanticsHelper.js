/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.CheckedEmitter);
  }
})(this, function(ohm, ohmEditor, CheckedEmitter) {

  var semantics = null;

  // `opName` is the semantic operation that current executing, it's null whenever
  // an empty semantics is created.
  var opName = null;

  // `opArguments` is the operation arguments for the operation with `opName`, could
  // be empty.
  var opArguments = null;

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    if (grammar && grammar.defaultStartRule) {
      semantics = grammar.semantics();
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
    this.nodeKey = key;
    this.error = error;
  }
  ErrorWrapper.prototype.causedBy = function(key) {
    return this.nodeKey === key;
  };
  ErrorWrapper.prototype.isErrorWrapper = true;

  // TODO: add 'forced' marker?
  var resultMap, forcing, todoList, passThroughList;
  function initializeSemanticsLog() {
    resultMap = Object.create(null);
    todoList = undefined;
    passThroughList = undefined;
    forcing = false;
  }

  function nodeKey(cstNode) {
    var ctorName = cstNode.ctorName;
    var startIdx = cstNode.interval.startIdx;
    var endIdx = cstNode.interval.endIdx;
    return ctorName + '_from_' + startIdx + '_to_' + endIdx;
  }

  function nodeOpKey(nodeKey, opName) {
    return nodeKey + '_at_' + opName;
  }

  function addResult(result, key, name, optArguments) {
    if (forcing && name !== opName && (result.isErrorWrapper || result === failure)) {
      return;
    }

    // Initialize entry to prepare for the new result
    resultMap[key] = resultMap[key] || Object.create(null);
    resultMap[key][name] = resultMap[key][name] || [];

    // Wrap actual result into an object, which may contain
    // arguments, and markers.
    var resultWrapper = {result: result};
    if (optArguments && Object.keys(optArguments).length > 0) {
      resultWrapper.args = optArguments;
    }

    var nOpKey = nodeOpKey(key, name);
    resultWrapper.forced = forcing;
    resultWrapper.forCallingSemantic = opName === name;
    resultWrapper.missingSemanticsAction = result === failure;
    resultWrapper.isError = result.isErrorWrapper || result === failure;
    resultWrapper.isPassThrough = !forcing && passThroughList && passThroughList.includes(nOpKey);
    if (!forcing) {
      resultWrapper.isNextStep = name === opName &&
        ((result.isErrorWrapper && result.causedBy(key)) ||
        (todoList && todoList.includes(nOpKey)));
    }
    resultMap[key][name].push(resultWrapper);
  }

  function toValueList(args) {
    return Object.keys(args).map(function(argName) {
      return args[argName];
    });
  }

  function initActionDict(type) {
    var defaults = {
      _terminal: function() {
        var key = nodeKey(this);
        var result = failure;

        todoList = todoList || [];
        todoList.push(nodeOpKey(key, opName));
        addResult(result, key, opName, this.args);
        return result;
      },

      _iter: function(children) {
        var key = nodeKey(this);
        var argValues = toValueList(this.args);
        var result;
        try {
          result = children.map(function(child) {
            return type === 'Operation' ? child[opName].apply(child, argValues) : child[opName];
          });
          result = result.indexOf(failure) >= 0 ? failure : result;
        } catch (error) {
          if (todoList) {
            result = failure;
          } else {
            result = error.isErrorWrapper ? error : new ErrorWrapper(key, error);
            throw result;
          }
        } finally {
          addResult(result, key, opName, this.args);
        }
        return result;
      },

      _nonterminal: function(children) {
        var key = nodeKey(this);
        var argValues = toValueList(this.args);
        var result;
        try {
          if (children.length === 1) {
            passThroughList = passThroughList || [];
            passThroughList.push(nodeOpKey(key, opName));

            var child = children[0];
            result = type === 'Operation' ? child[opName].apply(child, argValues) : child[opName];
          } else {
            todoList = todoList || [];
            todoList.push(nodeOpKey(key, opName));
            result = failure;
          }
        } catch (error) {
          if (todoList) {
            result = failure;
          } else {
            result = error.isErrorWrapper ? error : new ErrorWrapper(key, error);
            throw result;
          }
        } finally {
          addResult(result, key, opName, this.args);
        }
        return result;
      }
    };
    Object.keys(defaults).forEach(function(k) { defaults[k]._isDefault = true; });
    return defaults;
  }

  // Add new operation/attribute to the semantics
  function addSemanticOperation(type, name, optArguments) {
    var signature = name;
    if (type === 'Operation' && optArguments) {
      var argumentNames = Object.keys(optArguments);
      if (argumentNames.length > 0) {
        signature += '(' + argumentNames.join(',') + ')';
      }
    }
    semantics['add' + type](signature, initActionDict(type));
  }
  ohmEditor.semantics.addListener('add:semanticOperation', function(type, name, optArguments) {
    opName = name;
    opArguments = optArguments;
    addSemanticOperation(type, name, optArguments);
  });

  function populateSemanticsResult(traceNode, optOpName, optArguments) {
    var operationName = optOpName || opName;
    try {
      var nodeWrapper = semantics._getSemantics().wrap(traceNode.bindings[0]);
      if (operationName in semantics._getSemantics().operations) {
        var argValues;
        if (operationName === opName) {
          argValues = toValueList(opArguments || Object.create(null));
        } else {
          argValues = toValueList(optArguments || Object.create(null));
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

  function forceResult(traceNode) {
    forcing = true;
    var semanticsNameList = semantics.getOperationNames().concat(semantics.getAttributeNames());
    semanticsNameList.forEach(function(name) {
      populateSemanticsResult(traceNode, name);
    });
    forcing = false;
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

  // Exports
  // -------

  ohmEditor.semantics.getResults = function(traceNode) {
    var key = nodeKey(traceNode.bindings[0]);
    if (!(key in resultMap)) {
      forceResult(traceNode);
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
    argPairList.real = actionStr.substring(actionStr.indexOf('(') + 1, actionStr.indexOf(')'));
    return argPairList;
  };
});
