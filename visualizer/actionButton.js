/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.document, root.domUtil, root.es6);
  }
})(this, function(ohmEditor, document, domUtil, es6) {

  // Privates
  // --------
  var $ = domUtil.$;
  var $$ = domUtil.$$;

  var UnicodeChars = {
    BLACK_UP_POINTING_TRIANGLE: '\u25B2',
    BLACK_DOWN_POINTING_TRIANGLE: '\u25BC',
    PLUS_SIGN: '\u002B',
    LEFTWARDS_ARROW: '\u2190'
  };

  // Unselect all the semantics buttons, except the target semantic button
  function unselectOtherSemanticButtons(targetNameContainer) {
    $$('#semantics .wrapper').forEach(function(wrapper) {
      var nameContainer = wrapper.querySelector('textarea.opName');
      if (targetNameContainer === nameContainer) {
        return;
      }
      wrapper.classList.remove('selected');

      // Hide the argument list if there is one
      var arrowButton = wrapper.querySelector('.arrow');
      if (arrowButton) {
        arrowButton.innerHTML = UnicodeChars.BLACK_DOWN_POINTING_TRIANGLE;
        wrapper.querySelector('.arguments').hidden = true;
      }
    });
  }

  // Check if the given argument name is a restrict JS identifier.
  // TODO: it less restrictive in the future
  function isArgumentNameValid(argName, args) {
    return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(argName);
  }

  // Retrieve operation arguments from the operation button wrapper
  function retrieveArgs(wrapper, ignoreInvalidValue) {
    var argList = wrapper.querySelector('.arguments');
    var nameValPairs = wrapper.querySelectorAll('.nameValuePair');
    var args = Object.create(null);
    Array.prototype.forEach.call(nameValPairs, function(nameValPair) {
      var argNameContainer = nameValPair.querySelector('.name');
      var argName = argNameContainer.value;
      if (!argName || argName in args) {
        // Remove the entry if there is no argument name, or it is already exist.
        // TODO: maybe overwrite duplicates? or throw an error?
        argList.removeChild(nameValPair);
        return;
      } else if (!isArgumentNameValid(argName)) {
        // Throw an error if it's not a valid argument name. This will provide
        // a more clear readable error message.
        argNameContainer.select();
        throw new Error(argName + ' is not a valid argument name.');
      }

      var valueContainer = nameValPair.querySelector('.value');
      var value = valueContainer.value;
      // If the value is not a valid es6 `assignmentExpression`, and we are not ignoring
      // invalid value, throw an error. This provides a clear and readable error message.
      var isExpression = es6.match(value, 'AssignmentExpression<withIn>').succeeded();
      if (value && !isExpression) {
        if (ignoreInvalidValue) {
          value = undefined;
        } else {
          valueContainer.select();
          throw new Error(value + ' is not a valid expression for argument assignment.');
        }
      }

      var returnStmt = 'return ' + value + ';';
      args[argName] = new Function(returnStmt)();    // eslint-disable-line no-new-func
      argNameContainer.readOnly = true;
    });
    return args;
  }

  function showActionMenu(e) {
    var actionMenu = $('#operationMenu');
    actionMenu.style.left = e.clientX + 'px';
    actionMenu.style.top = e.clientY - 6 + 'px';
    actionMenu.hidden = false;
  }

  function createSemanticNameContainer(type) {
    var nameContainer = domUtil.createElement('textarea.opName');
    nameContainer.cols = 15;
    nameContainer.addEventListener('keyup', function(e) {
      nameContainer.cols = Math.max(nameContainer.value.length, 15);
    });

    nameContainer.addEventListener('click', function(event) {
      if (!nameContainer.readOnly) {
        return;
      }

      var wrapper = domUtil.closestElementMatching('.wrapper', nameContainer);
      var argList = wrapper.querySelector('.arguments');
      if (!nameContainer.readOnly) {
        nameContainer.select();
        return;
      }
      // Hide/Show the argument list (if there is any) base on whether
      // the node is selected or not
      var arrowButton = wrapper.querySelector('.buttonWrapper .arrow');
      if (arrowButton) {
        argList.hidden = wrapper.classList.contains('selected');
        arrowButton.innerHTML = argList.hidden ?
            UnicodeChars.BLACK_DOWN_POINTING_TRIANGLE : UnicodeChars.BLACK_UP_POINTING_TRIANGLE;
      }
      var name = nameContainer.value;
      var args;
      // If there is an invalid argument detacted, and the user is trying to evaluate the
      // operation, then just alert the user.
      try {
        args = type === 'Operation' ? retrieveArgs(wrapper) : undefined;
      } catch (error) {
        if (!wrapper.classList.contains('selected')) {
          window.alert(error);    // eslint-disable-line no-alert
          return;
        }
      }

      unselectOtherSemanticButtons(nameContainer);
      wrapper.classList.toggle('selected');
      ohmEditor.semantics.emit('change:semanticOperation', name, args);
      ohmEditor.parseTree.refresh(ohmEditor.parseTree.rootTrace, false);
    });

    nameContainer.oncontextmenu = function(event) {
      showActionMenu(event);
      handleContextMenuOnAction(nameContainer);
      event.preventDefault();
      event.stopPropagation();  // Prevent ancestor wrappers from handling.
    };
    return nameContainer;
  }

  function handleContextMenuOnArgument(target, argList) {
    var wrapper = domUtil.closestElementMatching('.wrapper', argList);
    var operationName = wrapper.querySelector('.opName').value;
    var nameValPair = domUtil.closestElementMatching('.nameValuePair', target);

    domUtil.addMenuItem('operationMenu', 'delete', 'Delete', true, function(event) {
      argList.removeChild(nameValPair);

      // If the deleted argument is the only argument for the action, then
      // hide all the buttons that operate on arguments (i.e. add, arrows)
      if (wrapper.querySelector('.arguments').children.length === 0) {
        wrapper.querySelector('.buttonWrapper').hidden = true;
      }

      var args;
      try {
        args = retrieveArgs(wrapper);
      } catch (error) {
        // Assign `undefined` to the corresponding argument name, and alert user with the
        // corresponding error message.
        args = retrieveArgs(wrapper, true);
        window.alert(error);    // eslint-disable-line no-alert
      }
      var opDescription = {
        type: 'Operation',
        args: args
      };
      ohmEditor.semantics.emit('edit:semanticOperation', wrapper, operationName, opDescription);
      ohmEditor.parseTree.refresh(ohmEditor.parseTree.rootTrace, false);
    });

    domUtil.addMenuItem('operationMenu', 'edit', 'Edit', true, function(event) {
      // Relax the name container, so it could be editable
      var argNameContainer = nameValPair.querySelector('.name');
      argNameContainer.readOnly = false;
      argNameContainer.select();
      ohmEditor.semantics.emit('edit:semanticOperation', wrapper, operationName, undefined);
    });
  }

  // Create the div to contain the list of arguments
  function createArgumentList() {
    var argList = domUtil.createElement('div.arguments');
    argList.oncontextmenu = function(event) {
      showActionMenu(event);
      handleContextMenuOnArgument(event.target, argList);
      event.preventDefault();
      event.stopPropagation();  // Prevent ancestor wrappers from handling.
    };
    return argList;
  }

  // Create the add button for adding new (name, value) pair
  function createAddButton() {
    var addButton = domUtil.createElement('div.add.button');
    addButton.innerHTML = UnicodeChars.PLUS_SIGN;

    // Add new (name, value) pair to the argument list when clicking on the
    // add button
    addButton.onclick = function(e) {
      var nameValPair = domUtil.createElement('div.nameValuePair');

      // Create the argument name container of the (name, value) pair
      var argName = nameValPair.appendChild(domUtil.createElement('textarea.name'));
      argName.cols = 5;
      argName.placeholder = 'name';
      argName.addEventListener('keyup', function(e) {
        argName.cols = Math.max(argName.value.length, 5);
      });

      // Add a left arrow (<-) in each (name, value) pair (i.e. name <- value)
      var assign = nameValPair.appendChild(domUtil.createElement('div.assign'));
      assign.innerHTML = UnicodeChars.LEFTWARDS_ARROW;

      // Create the argument value container of the (name, value) pair
      var argValue = nameValPair.appendChild(domUtil.createElement('textarea.value'));
      argValue.cols = 5;
      argValue.placeholder = 'value';
      argValue.addEventListener('keyup', function(e) {
        argValue.cols = Math.max(argValue.value.length, 5);
      });

      var wrapper = domUtil.closestElementMatching('.wrapper', addButton);
      var argList = wrapper.querySelector('.arguments');
      argList.appendChild(nameValPair);
      argName.focus();
    };

    return addButton;
  }

  // Create the arrow button for hide/show the argument list
  function createArrowButton() {
    var arrowButton = domUtil.createElement('.arrow.button');
    arrowButton.innerHTML = UnicodeChars.BLACK_UP_POINTING_TRIANGLE;
    arrowButton.onclick = function(event) {
      var wrapper = domUtil.closestElementMatching('.wrapper', arrowButton);
      var argList = wrapper.querySelector('.arguments');
      argList.hidden = !argList.hidden;
      if (argList.hidden) {
        arrowButton.innerHTML = UnicodeChars.BLACK_DOWN_POINTING_TRIANGLE;
      } else {
        arrowButton.innerHTML = UnicodeChars.BLACK_UP_POINTING_TRIANGLE;
      }
    };
    arrowButton.hidden = true;
    return arrowButton;
  }

  // Create the div that contains all the arguments related buttons
  function createButtons() {
    var buttonWrapper = domUtil.createElement('div.buttonWrapper');

    // Create the add button, and append it to the button wrapper
    buttonWrapper.appendChild(createAddButton());

    // Create the arrow button, and append it to the button wrapper
    buttonWrapper.appendChild(createArrowButton());
    return buttonWrapper;
  }

  // Relax the semantic button to make every part editable
  function relaxButton(wrapper) {
    var nameContainer = wrapper.querySelector('textarea.opName');
    nameContainer.readOnly = false;
    if (!wrapper.querySelector('.arguments')) {
      return;
    }

    wrapper.querySelector('.arguments').hidden = false;
    Array.prototype.forEach.call(wrapper.querySelectorAll('.nameValuePair'),
        function(pair, idx) {
          pair.querySelector('.name').readOnly = false;
        });
    var buttonWrapper = wrapper.querySelector('.buttonWrapper');
    buttonWrapper.querySelector('.add').hidden = false;
    buttonWrapper.querySelector('.arrow').hidden = true;
    buttonWrapper.hidden = false;
  }

  function handleContextMenuOnAction(nameContainer) {
    var operationName = nameContainer.value;
    var wrapper = domUtil.closestElementMatching('.wrapper', nameContainer);
    var container = domUtil.closestElementMatching('.entries', nameContainer);
    domUtil.addMenuItem('operationMenu', 'delete', 'Delete', true, function(event) {
      container.removeChild(wrapper);
      ohmEditor.semantics.emit('edit:semanticOperation', wrapper, operationName, undefined);
      ohmEditor.parseTree.refresh(ohmEditor.parseTree.rootTrace, false);
    });

    domUtil.addMenuItem('operationMenu', 'edit', 'Edit', true, function(event) {
      nameContainer.select();
      relaxButton(wrapper);
      ohmEditor.semantics.emit('edit:semanticOperation', wrapper, operationName, undefined);
    });
  }

  // Add new operation or attribute wrapper
  function addNewSemanticButton(type) {
    var container = type === 'Operation' ? $('#operations') : $('#attributes');

    // If the first semantic button in the list is not saved yet, return
    // without create a new one
    if (container.childElementCount > 0 &&
        !container.querySelector('textarea.opName').readOnly) {
      container.querySelector('textarea.opName').select();
      return;
    }

    // Create a new semantic button
    var wrapper = domUtil.createElement('div.wrapper');
    container.insertBefore(wrapper, container.firstChild);

    // Create the div that contains the name of the new semantic, and append it to
    // the wrapper as an semantic button
    var nameContainer = wrapper.appendChild(createSemanticNameContainer(type));
    if (type === 'Operation') {
      wrapper.appendChild(createArgumentList());
      wrapper.appendChild(createButtons());
    }

    // Add new operation/attribute to the semantics when `enter` is press
    wrapper.addEventListener('keypress', function(event) {
      // Return if the pressed key is not `enter` or it has been saved already,
      // otherwise, prevent default event
      if (event.keyCode !== 13 || event.target.readOnly) {
        return;
      } else {
        event.preventDefault();
      }

      var target = event.target;
      var argumentChangeOnly = target.classList.contains('value') &&
          target.parentElement.querySelector('.name').readOnly;
      var name = nameContainer.value;
      var args;

      // Alert user if there is an invalid argument name, or value.
      try {
        args = type === 'Operation' ? retrieveArgs(wrapper) : undefined;
      } catch (error) {
        if (!argumentChangeOnly) {
          relaxButton(wrapper);
        }
        window.alert(error);    // eslint-disable-line no-alert
        return;
      }

      if (!name) {
        container.removeChild(wrapper);
        ohmEditor.parseTree.refresh();
        return;
      } else if (argumentChangeOnly) {
        // If the user is just changing an argument value, so we just
        // refresh the tree with new arguments values
        var operationName = wrapper.classList.contains('selected') ? null : name;
        ohmEditor.semantics.emit('change:semanticOperation', operationName, args);
        unselectOtherSemanticButtons(nameContainer);
        wrapper.classList.add('selected');
        ohmEditor.parseTree.refresh();
        return;
      }

      // If it is an `Operation`, switching the button from `add` to `arrow` if there is
      // any arguments, or we hide both buttons.
      if (type === 'Operation') {
        var argNames = args && Object.keys(args);
        if (!argNames || argNames.length === 0) {
          wrapper.querySelector('.buttonWrapper').hidden = true;
        } else {
          wrapper.querySelector('.buttonWrapper .add').hidden = true;
          wrapper.querySelector('.buttonWrapper .arrow').hidden = false;
        }
      }
      var origActionDict = wrapper._origActionDict;
      try {
        ohmEditor.semantics.emit('add:semanticOperation', type, name, args, origActionDict);
      } catch (error) {
        nameContainer.select();
        relaxButton(wrapper);
        window.alert(error);    // eslint-disable-line no-alert
        return;
      }
      delete wrapper._origActionDict;
      nameContainer.readOnly = true;
      unselectOtherSemanticButtons(nameContainer);
      wrapper.classList.add('selected');
      ohmEditor.parseTree.refresh();
    });
  }

  var addOperationButton = $('#addOperation');
  addOperationButton.addEventListener('click', function(e) {
    addNewSemanticButton('Operation');
    $('#operations').firstElementChild.querySelector('.opName').focus();
  });

  var addAttributeButton = $('#addAttribute');
  addAttributeButton.addEventListener('click', function(e) {
    addNewSemanticButton('Attribute');
    $('#attributes').firstElementChild.querySelector('.opName').focus();
  });

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    $('#operations').innerHTML = '';
    $('#attributes').innerHTML = '';
  });
});
