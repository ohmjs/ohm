/* eslint-env browser */

'use strict';

(function() {

  function formAddButton(argList) {
    var addButton = document.createElement('img');
    addButton.src = 'third_party/plus.png';
    addButton.className = 'add';
    addButton.onclick = function(e) {
      // add new (argName <- value) pair
      var argNameValuePair = document.createElement('div');
      argNameValuePair.className = 'nameValuePair';

      var argName = document.createElement('textarea');
      argName.className = 'name';
      argName.placeholder = 'name';
      argName.cols = 5;
      argName.addEventListener('keyup', function(e) {
        argName.cols = Math.max(argName.value.length, 5);
      });
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
      argNameValuePair.appendChild(argValue);

      argList.appendChild(argNameValuePair);
      argName.focus();
    };
    return addButton;
  }

  function formArrowButton(argList) {
    var arrowButton = document.createElement('img');
    arrowButton.src = 'third_party/arrow-up.png';
    arrowButton.classList.add('arrow');
    arrowButton.onclick = function(event) {
      argList.hidden = !argList.hidden;
      if (argList.hidden) {
        arrowButton.src = 'third_party/arrow-down.png';
      } else {
        arrowButton.src = 'third_party/arrow-up.png';
      }
    };
    return arrowButton;
  }

  function appendArgumentsOpButton(actionWrap, argList) {
    var buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'buttonWrapper';
    actionWrap.appendChild(buttonWrapper);

    var addButton = formAddButton(argList);
    buttonWrapper.appendChild(addButton);

    var arrowButton = formArrowButton(argList);
    arrowButton.hidden = true;
    buttonWrapper.appendChild(arrowButton);
  }

  // Un-select all the other action buttons
  function unselectOtherActionNodes(actionNode) {
    var actions = document.querySelectorAll('textarea.action');
    Array.prototype.forEach.call(actions, function(actionElement) {
      if (actionElement === actionNode) {
        return;
      }
      actionElement.classList.remove('selected');

      // Hide the argument list if there is one
      var arrowButton = actionElement.parentElement.querySelector('.arrow');
      if (arrowButton) {
        arrowButton.src = 'third_party/arrow-down.png';
        actionElement.parentElement.querySelector('.arguments').hidden = true;
      }
    });
  }

  function addAction(actionType) {
    var actionContainer = actionType === 'Operation' ?
      document.querySelector('#operations') :
      document.querySelector('#attributes');
    if (actionContainer.childElementCount > 0 &&
        !actionContainer.querySelector('.action').readOnly) {
      actionContainer.querySelector('.action').select();
      return;
    }

    var actionWrap = document.createElement('div');
    actionWrap.className = 'actionWrap';
    var actionNode = document.createElement('textarea');
    actionWrap.appendChild(actionNode);
    actionNode.className = 'action';
    actionNode.cols = 15;
    actionNode.addEventListener('keyup', function(e) {
      actionNode.cols = Math.max(actionNode.value.length, 15);
    });

    var argList = document.createElement('div');
    argList.className = 'arguments';
    if (actionType === 'Operation') {
      actionWrap.appendChild(argList);
      appendArgumentsOpButton(actionWrap, argList);
    }

    actionWrap.addEventListener('keypress', function(e) {
      if (e.keyCode !== 13) {
        return;
      }
      // No enter for action name
      e.preventDefault();

      unselectOtherActionNodes(actionNode);

      // Select the action button
      actionNode.classList.add('selected');
    });

    actionNode.addEventListener('click', function(e) {
      unselectOtherActionNodes(actionNode);

      if (actionNode.readOnly) {
        actionNode.classList.toggle('selected');

        // Hide/Show the argument list (if there is any) base on whether
        // the node is selected or not
        var arrowButton = actionWrap.querySelector('.buttonWrapper .arrow');
        if (arrowButton) {
          if (actionNode.classList.contains('selected')) {
            argList.hidden = false;
            arrowButton.src = 'third_party/arrow-up.png';
          } else {
            argList.hidden = true;
            arrowButton.src = 'third_party/arrow-down.png';
          }
        }
      } else {
        actionNode.classList.add('selected');
        actionNode.select();
      }
    });

    actionContainer.insertBefore(actionWrap, actionContainer.firstChild);
  }

  var addOperationButton = document.querySelector('#addOperation');
  addOperationButton.addEventListener('click', function(e) {
    addAction('Operation');
    document.querySelector('#operations').firstElementChild.querySelector('.action').focus();
  });

  var addAttributeButton = document.querySelector('#addAttribute');
  addAttributeButton.addEventListener('click', function(e) {
    addAction('Attribute');
    document.querySelector('#attributes').firstElementChild.querySelector('.action').focus();
  });

})();
