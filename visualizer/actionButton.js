/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor);
  }
})(this, function(ohmEditor) {
  var rootTrace = null;
  ohmEditor.addListener('parse:input', function(matchResult, trace) {
    rootTrace = trace;
  });

  var UnicodeChars = {
    BLACK_UP_POINTING_TRIANGLE: '\u25B2',
    BLACK_DOWN_POINTING_TRIANGLE: '\u25BC',
    PLUS_SIGN: '\u002B',
    LEFTWARDS_ARROW: '\u2190'
  };

  function createSemanticNameContainer() {
    var nameContainer = document.createElement('textarea');
    nameContainer.className = 'opName';
    nameContainer.cols = 15;
    nameContainer.addEventListener('keyup', function(e) {
      nameContainer.cols = Math.max(nameContainer.value.length, 15);
    });
    return nameContainer;
  }

  // Create the add button for adding new (name, value) pair
  function createAddButton() {
    var addButton = document.createElement('div');
    addButton.classList.add('add');
    addButton.classList.add('button');
    addButton.innerHTML = UnicodeChars.PLUS_SIGN;

    // Add new (name, value) pair to the argument list when clicking on the
    // add button
    addButton.onclick = function(e) {
      var nameValPair = document.createElement('div');
      nameValPair.className = 'nameValuePair';

      // Create the argument name container of the (name, value) pair
      var argName = nameValPair.appendChild(document.createElement('textarea'));
      argName.className = argName.placeholder = 'name';
      argName.cols = 5;
      argName.addEventListener('keyup', function(e) {
        argName.cols = Math.max(argName.value.length, 5);
      });

      // Add a left arrow (<-) in each (name, value) pair (i.e. name <- value)
      var assign = nameValPair.appendChild(document.createElement('div'));
      assign.innerHTML = UnicodeChars.LEFTWARDS_ARROW;
      assign.className = 'assign';

      // Create the argument value container of the (name, value) pair
      var argValue = nameValPair.appendChild(document.createElement('textarea'));
      argValue.className = argValue.placeholder = 'value';
      argValue.cols = 5;
      argValue.addEventListener('keyup', function(e) {
        argValue.cols = Math.max(argValue.value.length, 5);
      });

      var argList = addButton.parentElement.previousElementSibling;
      argList.appendChild(nameValPair);
      argName.focus();
    };

    return addButton;
  }

  // Create the arrow button for hide/show the argument list
  function createArrowButton() {
    var arrowButton = document.createElement('div');
    arrowButton.innerHTML = UnicodeChars.BLACK_UP_POINTING_TRIANGLE;
    arrowButton.classList.add('arrow');
    arrowButton.classList.add('button');
    arrowButton.onclick = function(event) {
      var argList = arrowButton.parentElement.previousElementSibling;
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

  function createButtons() {
    var buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'buttonWrapper';

    // Create the add button, and append it to the button wrapper
    buttonWrapper.appendChild(createAddButton());

    // Create the arrow button, and append it to the button wrapper
    buttonWrapper.appendChild(createArrowButton());
    return buttonWrapper;
  }

  // Unselect all the semantics buttons, except the target semantic button
  function unselectOtherSemanticButtons(targetNameContainer) {
    var nameContainers = document.querySelectorAll('textarea.opName');
    Array.prototype.forEach.call(nameContainers, function(nameContainer) {
      if (targetNameContainer === nameContainer) {
        return;
      }
      nameContainer.classList.remove('selected');

      // Hide the argument list if there is one
      var arrowButton = nameContainer.parentElement.querySelector('.arrow');
      if (arrowButton) {
        arrowButton.innerHTML = UnicodeChars.BLACK_DOWN_POINTING_TRIANGLE;
        nameContainer.parentElement.querySelector('.arguments').hidden = true;
      }
    });
  }

  function retrieveArgs(wrapper) {
    var argList = wrapper.querySelector('.arguments');
    var nameValPairs = wrapper.querySelectorAll('.nameValuePair');
    var args = Object.create(null);
    Array.prototype.forEach.call(nameValPairs, function(nameValPair) {
      var argNameContainer = nameValPair.querySelector('.name');
      var argName = argNameContainer.value;

      var valueContainer = nameValPair.querySelector('.value');
      var value = valueContainer.value;
      if (argName && /^[_a-zA-Z0-9]+$/.test(argName) && !(argName in args)) {
        args[argName] = eval(value);  // eslint-disable-line no-eval
        argNameContainer.readOnly = true;
      } else {
        // TODO: maybe overwrite duplicates?
        argList.removeChild(nameValPair);
      }
    });
    return args;
  }

  // Relax the semantic button to make every part editable
  function relaxButton(wrapper) {
    var nameContainer = wrapper.querySelector('textarea.opName');
    nameContainer.readOnly = false;
    nameContainer.select();
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

  // Add new operation or attribute wrapper
  function addNewSemanticButton(type) {
    var container = type === 'Operation' ?
        document.querySelector('#operations') :
        document.querySelector('#attributes');

    // If the first semantic button in the list is not saved yet, return
    // without create a new one
    if (container.childElementCount > 0 &&
        !container.querySelector('textarea.opName').readOnly) {
      container.querySelector('textarea.opName').select();
      return;
    }

    // Create a new semantic button
    var wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    container.insertBefore(wrapper, container.firstChild);
    // TODO: handleContextMenuOnAction

    // Create the div that contains the name of the new semantic, and append it to
    // the wrapper as an semantic button
    var nameContainer = wrapper.appendChild(createSemanticNameContainer());
    if (type === 'Operation') {
      // Create the div to contain the list of arguments, and append it to
      // the wrapper
      var argList = wrapper.appendChild(document.createElement('div'));
      argList.className = 'arguments';
      // TODO: handleContextMenuOnArgument

      // Create the div that contains all the arguments related buttons, and append
      // it to the wrapper
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

      unselectOtherSemanticButtons(nameContainer);
      nameContainer.classList.add('selected');

      var argumentValueChangeOnly = event.target.classList.contains('value') &&
            event.target.parentElement.querySelector('.name').readOnly;
      var name = nameContainer.value;
      var args = type === 'Operation' ? retrieveArgs(wrapper) : undefined;
      if (!name) {
        container.removeChild(wrapper);
        return;
      } else if (argumentValueChangeOnly) {
        // If the user is just changing an argument value, so we just
        // refresh the tree with new arguments values
        // TODO: update argument values
        ohmEditor.parseTree.refresh(rootTrace, false);
        return;
      }

      // If it is an `Operation`, switching the button from `add` to `arrow` if there is
      // any arguments, or we hide both buttons.
      if (type === 'Operation') {
        var argNames = args && Object.keys(args);
        if (!argNames || argNames.length === 0) {
          wrapper.querySelector('.buttonWrapper').hidden = true;
        } else {
          wrapper.querySelector('.buttonWrapper').querySelector('.add').hidden = true;
          wrapper.querySelector('.buttonWrapper').querySelector('.arrow').hidden = false;
        }
      }
      // TODO: add operation/attribute to force evaluation menu
      try {
        ohmEditor.semantics.emit('add:semanticOperation', type, name, args);
        nameContainer.readOnly = true;
      } catch (error) {
        relaxButton(wrapper);
        window.alert(error);  // eslint-disable-line no-alert
      }

      ohmEditor.parseTree.refresh(rootTrace, false);
    });

    nameContainer.addEventListener('click', function(event) {
      unselectOtherSemanticButtons(nameContainer);
      if (nameContainer.readOnly) {
        nameContainer.classList.toggle('selected');
        // Hide/Show the argument list (if there is any) base on whether
        // the node is selected or not
        var arrowButton = wrapper.querySelector('.buttonWrapper .arrow');
        if (arrowButton) {
          argList.hidden = !nameContainer.classList.contains('selected');
          arrowButton.innerHTML = nameContainer.classList.contains('selected') ?
              UnicodeChars.BLACK_UP_POINTING_TRIANGLE :
              UnicodeChars.BLACK_DOWN_POINTING_TRIANGLE;
        }

        // TODO: change the calling semantics action
        ohmEditor.parseTree.refresh(rootTrace, false);
      } else {
        nameContainer.classList.add('selected');
        nameContainer.select();
      }
    });
  }

  var addOperationButton = document.querySelector('#addOperation');
  addOperationButton.addEventListener('click', function(e) {
    addNewSemanticButton('Operation');
    document.querySelector('#operations').firstElementChild.querySelector('.opName').focus();
  });

  var addAttributeButton = document.querySelector('#addAttribute');
  addAttributeButton.addEventListener('click', function(e) {
    addNewSemanticButton('Attribute');
    document.querySelector('#attributes').firstElementChild.querySelector('.opName').focus();
  });

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    document.querySelector('#operations').innerHTML = '';
    document.querySelector('#attributes').innerHTML = '';
  });
});
