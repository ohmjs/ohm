/* eslint-env browser */
/* global funcBodyGrammar */

'use strict';

var semanticsActionHelpers = (function() {  // eslint-disable-line no-unused-vars

  // Private helpers
  // ---------------
  var resultMap, todo, passThrough;

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
    return this.error.message;
  };
  ErrorWrapper.prototype.isErrorWrapper = true;

  function toKey(cstNode, actionName) {
    return cstNode.ctorName + '_from_' +
           cstNode.interval.startIdx + '_to_' +
           cstNode.interval.endIdx + '_at_' +
           actionName;
  }

  function getAllActionNames() {
    var actionNames = [];
    var actionButtons = document.querySelectorAll('textarea.action');
    Array.prototype.forEach.call(actionButtons, function(actionButton) {
      if (actionButton.readOnly && actionButton.value) {
        actionNames.push(actionButton.value);
      }
    });
    return actionNames;
  }

  // Returns true if the there is a missing semantics action error caused
  // the failure of the `cstNode`. Note: the action is could be any one
  // that in the semantics.
  function isFailed(cstNode) {
    var actionNames = getAllActionNames();
    var hasFailureAtCSTNode = actionNames.some(function(actionName) {
      return resultMap[toKey(cstNode, actionName)] === failure;
    });
    return hasFailureAtCSTNode;
  }

  // Returns true if there is no result of action named `actionName` for all
  // the children of the `cstNode`
  function noResultForChildrenOf(cstNode, actionName) {
    var hasNoResult = cstNode.children.every(function(child) {
      return !resultMap.hasOwnProperty(toKey(child, actionName));
    });
    return hasNoResult;
  }

  // Exports
  // -------
  return {
    initializeActionLog: function() {
      resultMap = undefined;
      todo = undefined;
      passThrough = undefined;
    },

    addNewAction: function(semantics, actionType, actionName) {
      semantics['add' + actionType](actionName, {
        _nonterminal: function(children) {    // DEFAULT
          var ans;
          var key = toKey(this, actionName);
          try {
            if (children.length === 1) {
              if (!passThrough) {
                passThrough = [];
              }
              passThrough.push(key);

              ans = (actionType === 'Attribute' ?
                children[0][actionName] :
                children[0][actionName]());
            } else {
              if (!todo) {
                todo = [];
              }
              todo.push(key);
              ans = failure;
            }
          } catch (error) {
            if (todo) {
              ans = failure;
            } else {
              if (error instanceof Error) {
                ans = new ErrorWrapper(key, error);
              } else {
                ans = error;
              }
              throw ans;
            }
          } finally {
            resultMap[key] = ans;
          }
          return ans;
        },

        _terminal: function() {   // DEFAULT
          var key = toKey(this, actionName);
          if (!todo) {
            todo = [];
          }
          todo.push(key);
          resultMap[key] = failure;
          return failure;
        },

        _iter: function(children) {    // DEFAULT
          var ans;
          var key = toKey(this, actionName);
          try {
            ans = children.map(function(child) {
              return actionType === 'Attribute' ?
                  child[actionName] :
                  child[actionName]();
            });
            if (ans.indexOf(failure) >= 0) {
              ans = failure;
            }
          } catch (error) {
            if (todo) {
              ans = failure;
            } else {
              if (error instanceof Error) {
                ans = new ErrorWrapper(key, error);
              } else {
                ans = error;
              }
              throw ans;
            }
          } finally {
            resultMap[key] = ans;
          }
          return ans;
        }
      });
    },

    // Call action for the traceNode, and record all the result we get from the evaluation
    populateActionResult: function(semantics, traceNode, actionName) {
      if (resultMap) {
        return;
      }

      resultMap = {};
      try {
        var nodeWrapper = semantics._getSemantics().wrap(traceNode.bindings[0]);
        if (actionName in semantics._getSemantics().operations) {
          nodeWrapper[actionName]();
        } else {
          nodeWrapper._forgetMemoizedResultFor(actionName);
          nodeWrapper[actionName]; // eslint-disable-line no-unused-expressions
        }
      } catch (error) {
      }
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
          var key = toKey(this, actionName);
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
              if (error instanceof Error) {
                ans = new ErrorWrapper(key, error);
              } else {
                ans = error;
              }
              throw ans;
            }
          } finally {
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

    getActionResult: function(traceNode, actionName) {
      var cstNode = traceNode.bindings[0];
      var key = toKey(cstNode, actionName);
      return resultMap[key];
    },

    isNextStep: function(result, traceNode, actionName) {
      var cstNode = traceNode.bindings[0];
      var key = toKey(cstNode, actionName);
      if (!resultMap.hasOwnProperty(key)) {
        return false;
      }

      if (result instanceof ErrorWrapper) {
        return result.causedBy(key);
      } else if (result === failure) {
        return todo.includes(key) || noResultForChildrenOf(cstNode, actionName);
      }
      return false;
    },

    isPassThrough: function(traceNode, actionName) {
      var key = toKey(traceNode.bindings[0], actionName);
      return passThrough && passThrough.includes(key);
    },

    hasNoResult: function(traceNode, actionName) {
      var key = toKey(traceNode.bindings[0], actionName);
      return !resultMap.hasOwnProperty(key);
    }
  };
})();
