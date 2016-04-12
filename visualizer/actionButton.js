/* eslint-env browser */

'use strict';

(function() {

  function addAction(actionType) {
    var actionContainer = actionType === 'Operation' ?
      document.querySelector('#operations') :
      document.querySelector('#attributes');
    if (actionContainer.childElementCount > 0 && !actionContainer.firstChild.readOnly) {
      actionContainer.firstChild.select();
      return;
    }

    var actionNode = document.createElement('textarea');
    actionNode.className = 'action';
    actionNode.placeholder = actionType + ' name';
    actionNode.cols = 15;
    actionNode.addEventListener('keyup', function(e) {
      actionNode.cols = Math.max(actionNode.value.length, 15);
    });

    actionNode.addEventListener('keypress', function(e) {
      // No enter for action name
      if (e.keyCode === 13) {
        e.preventDefault();
        var actions = document.querySelectorAll('textarea.action');
        Array.prototype.forEach.call(actions, function(actionElement) {
          if (actionElement !== actionNode) {
            actionElement.classList.remove('selected');
          }
        });
        actionNode.classList.add('selected');
      }
    });

    actionNode.addEventListener('click', function(e) {
      var actions = document.querySelectorAll('textarea.action');
      Array.prototype.forEach.call(actions, function(actionElement) {
        if (actionElement !== actionNode) {
          actionElement.classList.remove('selected');
        }
      });

      if (actionNode.readOnly) {
        actionNode.classList.toggle('selected');
      } else {
        actionNode.classList.add('selected');
        actionNode.select();
      }
    });

    actionContainer.insertBefore(actionNode, actionContainer.firstChild);
  }

  var addOperationButton = document.querySelector('#addOperation');
  addOperationButton.addEventListener('click', function(e) {
    addAction('Operation');
    document.querySelector('#operations').firstElementChild.focus();
  });

  var addAttributeButton = document.querySelector('#addAttribute');
  addAttributeButton.addEventListener('click', function(e) {
    addAction('Attribute');
    document.querySelector('#attributes').firstElementChild.focus();
  });

})();
