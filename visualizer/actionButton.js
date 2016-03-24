/* eslint-env browser */

'use strict';

(function() {

  function selectNode(actionNode) {
    actionNode.classList.add('selected');
    if (!actionNode.readOnly) {
      actionNode.select();
    }
  }

  function addAction(actionType) {
    var actions = document.querySelectorAll('textarea.action');
    Array.prototype.forEach.call(actions, function(actionElement) {
      actionElement.classList.remove('selected');
    });

    var actionContainer = actionType === 'Operation' ?
      document.querySelector('#operations') :
      document.querySelector('#attributes');
    if (actionContainer.childElementCount > 0 && !actionContainer.firstChild.readOnly) {
      selectNode(actionContainer.firstChild);
      return;
    }

    var actionNode = document.createElement('textarea');
    actionNode.className = 'action';
    actionNode.placeholder = 'New ' + actionType;
    actionNode.cols = 13;
    actionNode.addEventListener('keyup', function(e) {
      actionNode.cols = Math.max(actionNode.value.length, 13);
    });

    actionNode.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 && actionNode.value) {
        // TODO ...
        // addActionToSemantics(semantics, actionType, actionName);
        actionNode.readOnly = true;
      }

      // No enter for action name
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    });

    actionNode.addEventListener('click', function(e) {
      var actions = document.querySelectorAll('textarea.action');
      Array.prototype.forEach.call(actions, function(actionElement) {
        if (actionElement !== actionNode) {
          actionElement.classList.remove('selected');
        }
      });

      actionNode.classList.toggle('selected');
      if (!actionNode.readOnly) {
        selectNode(actionNode);
      }
    });

    selectNode(actionNode);
    actionContainer.insertBefore(actionNode, actionContainer.firstChild);
  }

  var addOperationButton = document.querySelector('#addOperation');
  addOperationButton.addEventListener('click', function(e) {
    addAction('Operation');
  });

  var addAttributeButton = document.querySelector('#addAttribute');
  addAttributeButton.addEventListener('click', function(e) {
    addAction('Attribute');
  });

})();
