/* eslint-env browser */
/* global funcBodyGrammar */

'use strict';

var semanticsActionHelpers = (function() {  // eslint-disable-line no-unused-vars

  // Private helpers
  // ---------------
  var resultMap, todo, passThrough, reservedResults;
  function saveActionLog() {
    var origActionLog = {
      resultMap: resultMap,
      todo: todo,
      passThrough: passThrough
    };
    resultMap = undefined;
    todo = undefined;
    passThrough = undefined;
    return origActionLog;
  }

  function reloadActionLog(origActionLog) {
    resultMap = origActionLog.resultMap;
    todo = origActionLog.todo;
    passThrough = origActionLog.passThrough;
  }

  // Action result type that represents missing
  // semantic action
  function Failure() { }
  Failure.prototype.toString = function() {
    return undefined;
  };
  var failure = new Failure();
  failure.isFailure = true;

  // Action result type that represents runtime error
  // other than missing semantic action
  function ErrorWrapper(key, e) {
    this.expressionKey = key;
    this.error = e;
  }
  ErrorWrapper.prototype.causedBy = function(key) {
    return this.expressionKey === key;
  };
  ErrorWrapper.prototype.toString = function() {
    return this.error.message || this.error;
  };
  ErrorWrapper.prototype.isErrorWrapper = true;

  function toKey(cstNode, actionName, args) {
    var argVals = [];
    if (args) {
      Object.keys(args).forEach(function(key) {
        argVals.push(args[key]);
      });
    }
    return cstNode.ctorName + '_from_' +
           cstNode.interval.startIdx + '_to_' +
           cstNode.interval.endIdx + '_at_' +
           actionName + '_with_' + argVals.join('_');
  }

  function getAllActions() {
    var actions = [];
    var actionButtons = document.querySelectorAll('textarea.action');
    Array.prototype.forEach.call(actionButtons, function(actionButton) {
      if (actionButton.readOnly && actionButton.value) {
        var argsDiv = actionButton.parentElement.querySelector('.arguments');
        if (!argsDiv || argsDiv.children.length === 0) {
          actions.push({name: actionButton.value});
        } else {
          var args = Object.create(null);
          Array.prototype.forEach.call(argsDiv.children, function(argPair) {
            var n = argPair.querySelector('.name').value;
            var v = eval(argPair.querySelector('.value').value);  // eslint-disable-line no-eval
            args[n] = v;
          });
          actions.push({name: actionButton.value, args: args});
        }
      }
    });
    return actions;
  }

  // Returns true if the there is a missing semantics action error caused
  // the failure of the `cstNode`. Note: the action is could be any one
  // that in the semantics.
  function isFailed(cstNode) {
    var actions = getAllActions();
    var hasFailureAtCSTNode = actions.some(function(action) {
      var keyPrefix = toKey(cstNode, action.name);
      return Object.keys(resultMap).some(function(key) {
        return key.indexOf(keyPrefix) === 0 && resultMap[key] === failure;
      });
    });
    return hasFailureAtCSTNode;
  }

  // Returns true if there is no result of action named `actionName` for all
  // the children of the `cstNode`
  function noResultForChildrenOf(cstNode, actionName, args) {
    var hasNoResult = cstNode.children.every(function(child) {
      return !(toKey(child, actionName, args) in resultMap) &&
        !(toKey(child, actionName) in resultMap);
    });
    return hasNoResult;
  }

  // Exports
  // -------
  return {
    initializeActionLog: function(keepReservedResults) {
      resultMap = undefined;
      todo = undefined;
      passThrough = undefined;
      if (!keepReservedResults) {
        reservedResults = undefined;
      }
    },

    /* Add new action to `semantics`
       actionType: the type of the new action, could either be `Operation`, or `Attribute`
       actionName: the name of the new action
       optArgs: the arguments of the new action, it's optional (i.e. could be `undefined`)
       optMergeAction: an `Object` that contains the action functions for set of CST nodes
                       that need to be added into the new action, it's optional as well.
    */
    addNewAction: function(semantics, actionType, actionName, optArgs, optMergeAction) {
      var addActionName = actionName;
      if (optArgs) {
        var argNames = Object.keys(optArgs);
        if (argNames.length > 0) {
          addActionName += '(' + argNames.join(',') + ')';
        }
      }

      semantics['add' + actionType](addActionName, {
        _nonterminal: function(children) {    // DEFAULT
          var ans;
          var key = toKey(this, actionName, this.args);
          var keyPrefix = toKey(this, actionName);
          var self = this;
          var argValues = [];
          Object.keys(this.args).forEach(function(name) {
            argValues.push(self.args[name]);
          });
          try {
            if (children.length === 1) {
              if (!passThrough) {
                passThrough = [];
              }
              passThrough.push(key);

              ans = (actionType === 'Attribute' ?
                children[0][actionName] :
                children[0][actionName].apply(children[0], argValues));
            } else {
              if (!todo) {
                todo = [];
              }
              todo.push(keyPrefix);
              ans = failure;
            }
          } catch (error) {
            if (todo) {
              ans = failure;
            } else {
              if (!(error instanceof ErrorWrapper)) {
                ans = new ErrorWrapper(key, error);
              } else {
                ans = error;
              }
              throw ans;
            }
          } finally {
            if (ans instanceof ErrorWrapper || ans === failure) {
              key = keyPrefix;
              if (children.length === 1) {
                passThrough.pop();
                passThrough.push(key);
              }
            }
            resultMap[key] = ans;
          }
          return ans;
        },

        _terminal: function() {   // DEFAULT
          var keyPrefix = toKey(this, actionName);
          if (!todo) {
            todo = [];
          }
          todo.push(keyPrefix);
          resultMap[keyPrefix] = failure;
          return failure;
        },

        _iter: function(children) {    // DEFAULT
          var ans;
          var self = this;
          var key = toKey(this, actionName, this.args);
          var keyPrefix = toKey(this, actionName);
          var argValues = [];
          Object.keys(this.args).forEach(function(name) {
            argValues.push(self.args[name]);
          });
          try {
            ans = children.map(function(child) {
              return actionType === 'Attribute' ?
                  child[actionName] :
                  child[actionName].apply(child, argValues);
            });
            if (ans.indexOf(failure) >= 0) {
              ans = failure;
            }
          } catch (error) {
            if (todo) {
              ans = failure;
            } else {
              if (!(error instanceof ErrorWrapper)) {
                ans = new ErrorWrapper(key, error);
              } else {
                ans = error;
              }
              throw ans;
            }
          } finally {
            if (ans instanceof ErrorWrapper || ans === failure) {
              key = keyPrefix;
            }
            resultMap[key] = ans;
          }
          return ans;
        }
      });

      if (optMergeAction) {
        var actionDict = semantics._getActionDict(actionName);
        var self = this;
        Object.keys(optMergeAction.actionDict).forEach(function(key) {
          if (actionDict[key]) {
            return;
          }
          var actionStr = optMergeAction.actionDict[key].toString();
          var startIdx = actionStr.indexOf('{\n') + 2;
          var endIdx = actionStr.lastIndexOf('\n}');
          var actionBody = actionStr.substring(startIdx, endIdx);
          var argStr = actionStr.substring(actionStr.indexOf('function(') + 9,
            startIdx - 3);
          var currentArgs = argStr.split(',').map(function(arg) {
            return arg.trim();
          });
          actionDict[key] = self.getActionFnWrapper(actionName, currentArgs, actionBody);
        });
      }
    },

    // Call action for the traceNode, and record all the result we get from the evaluation
    populateActionResult: function(semantics, traceNode, actionName, args) {
      if (resultMap) {
        return;
      }

      resultMap = Object.create(null);
      var argValues = [];
      if (args) {
        Object.keys(args).forEach(function(key) {
          argValues.push(args[key]);
        });
      }
      try {
        var nodeWrapper = semantics._getSemantics().wrap(traceNode.bindings[0]);
        if (actionName in semantics._getSemantics().operations) {
          nodeWrapper[actionName].apply(nodeWrapper, argValues);
        } else {
          nodeWrapper._forgetMemoizedResultFor(actionName);
          nodeWrapper[actionName]; // eslint-disable-line no-unused-expressions
        }
      } catch (error) {
        // console.log('pop', error);
      }
    },

    reserveResults: function() {
      if (!resultMap) {
        return;
      }

      if (!reservedResults) {
        reservedResults = Object.create(null);
      }

      Object.keys(resultMap).forEach(function(key) {
        reservedResults[key] = {
          result: resultMap[key],
          isPassThrough: passThrough && passThrough.includes(key)
        };
      });
    },

    clearCurrentReservedResults: function() {
      if (!reservedResults) {
        return;
      }

      Object.keys(resultMap).forEach(function(key) {
        delete reservedResults[key];
      });
    },

    getActionFnWrapper: function(actionName, args, actionFnStr) {
      var actionFn, actionFnWrapper;

      var argumentStrs = '(' + args.join(', ') + ')';
      var origActionFnStr = 'function' + argumentStrs + '{\n' + actionFnStr + '\n}';

      if (actionFnStr.trim()) {
        var bodyMatchResult = funcBodyGrammar.match(actionFnStr, 'BodyExpression');
        if (bodyMatchResult.succeeded()) {
          actionFnStr = 'return ' + actionFnStr + ';';
        }
        actionFnStr = 'function' + argumentStrs + '{\n' + actionFnStr + '\n}';
        actionFn = eval('(' +  actionFnStr + ')');  // eslint-disable-line no-eval

        actionFnWrapper = function(/* arguments */) {
          var ans;
          var key = toKey(this, actionName, this.args);
          var keyPrefix = toKey(this, actionName, this.args);
          try {
            ans = actionFn.apply(this, arguments);
            var aChildFailed = this.children.some(function(child) {
              return isFailed(child);
            });
            if (aChildFailed) {
              ans = failure;
            }
          } catch (error) {
            if (todo) {
              ans = failure;
            } else {
              if (!(error instanceof ErrorWrapper)) {
                ans = new ErrorWrapper(key, error);
              } else {
                ans = error;
              }
              throw ans;
            }
          } finally {
            if (ans instanceof ErrorWrapper || ans === failure) {
              key = keyPrefix;
            }
            resultMap[key] = ans;
          }
          return ans;
        };

        actionFnWrapper.toString = function() {
          return origActionFnStr;
        };
      }

      return actionFnWrapper;
    },

    shouldUseReservedResult: function(traceNode, actionName, args) {
      var key = toKey(traceNode.bindings[0], actionName, args);
      var keyPrefix = toKey(traceNode.bindings[0], actionName);

      var noResultInResultMap = !(key in resultMap) && !(keyPrefix in resultMap);
      var hasResultReserved = reservedResults &&
          ((key in reservedResults) || (keyPrefix in reservedResults));
      return noResultInResultMap && hasResultReserved;
    },

    getReservedResult: function(traceNode, actionName, args) {
      var key = toKey(traceNode.bindings[0], actionName, args);
      if (key in reservedResults) {
        return reservedResults[key].result;
      } else {
        return reservedResults[toKey(traceNode.bindings[0], actionName)].result;
      }
    },

    getActionResult: function(traceNode, actionName, args) {
      var cstNode = traceNode.bindings[0];
      var key = toKey(cstNode, actionName, args);
      if (key in resultMap) {
        return resultMap[key];
      } else {
        return resultMap[toKey(cstNode, actionName)];
      }
    },

    getActionResultForce: function(semantics, actionName, args, traceNode) {
      var key = toKey(traceNode.bindings[0], actionName, args);
      var keyPrefix = toKey(traceNode.bindings[0], actionName);
      var origActionLog = saveActionLog();

      // If there is a reserved result for this node, we want to remove it and
      // re-evaluate the node.
      if (reservedResults) {
        delete reservedResults[key];
        delete reservedResults[keyPrefix];
      }

      this.populateActionResult(semantics, traceNode, actionName, args);
      var result = this.getActionResult(traceNode, actionName, args);
      // If the result is an error (either an ErrorWrapper, or failure). Then
      // either throw the result or null. This is used for caller to distinguish
      // between error that caused by executing the semantics action on the node
      // itself or its descendents.
      if (this.isNextStep(result, traceNode, actionName, args)) {
        // If the traceNode is the next step after executing the semantics
        // action, the throw the result (which will either by an ErrorWrapper, or
        // a failure).
        reloadActionLog(origActionLog);
        throw result;
      } else if ((!(key in resultMap) && !(keyPrefix in resultMap)) ||
          result instanceof ErrorWrapper || result === failure) {
        // If the result is an error, and it's not going to be the next step after
        // executing the semantics action. Then throw null.
        reloadActionLog(origActionLog);
        throw new Error();
      }
      this.reserveResults();
      reloadActionLog(origActionLog);
      return result;
    },

    isNextStep: function(result, traceNode, actionName, args) {
      var cstNode = traceNode.bindings[0];
      var key = toKey(cstNode, actionName, args);
      var keyPrefix = toKey(cstNode, actionName);
      if (!(key in resultMap) && !(keyPrefix in resultMap)) {
        return false;
      }

      if (result instanceof ErrorWrapper) {
        return result.causedBy(key) || result.causedBy(keyPrefix);
      } else if (result === failure) {
        return todo.includes(keyPrefix) || noResultForChildrenOf(cstNode, actionName, args);
      }
      return false;
    },

    isPassThrough: function(traceNode, actionName, args) {
      var key = toKey(traceNode.bindings[0], actionName, args);
      var keyPrefix = toKey(traceNode.bindings[0], actionName);
      if (this.shouldUseReservedResult(traceNode, actionName, args)) {
        if (key in reservedResults) {
          return reservedResults[key].isPassThrough;
        } else {
          return reservedResults[keyPrefix].isPassThrough;
        }
      }

      return passThrough && (passThrough.includes(key) || passThrough.includes(keyPrefix));
    },

    hasNoResult: function(traceNode, actionName, args, excludesReserve) {
      var key = toKey(traceNode.bindings[0], actionName, args);
      var keyPrefix = toKey(traceNode.bindings[0], actionName);
      var ans = !(key in resultMap) && !(keyPrefix in resultMap);
      if (!excludesReserve) {
        ans = ans && (!reservedResults ||
            (!(key in reservedResults) && !(keyPrefix in reservedResults)));
      }
      return ans;
    }
  };
})();
