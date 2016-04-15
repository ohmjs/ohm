/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.ohmEditor = root.ohmEditor || {};
    initModule(root.ohm, root.ohmEditor);
  }
})(this, function(ohm, ohmEditor) {
  var idCounter = 0;
  var exampleValues = Object.create(null);

  function uniqueId() {
    return 'example-' + idCounter++;
  }

  function handleMouseDown(e) {
    var li = e.target.parentElement;
    ohmEditor.examples.setSelected(li.id);
    e.preventDefault();
  }

  function getListEl(exampleId) {
    return document.querySelector('#' + exampleId);
  }

  function addExample() {
    var id = uniqueId();

    var li = document.createElement('li');
    li.id = id;
    li.className = 'example';
    li.appendChild(document.createElement('code'));
    li.onmousedown = handleMouseDown;

    document.querySelector('#exampleContainer ul').appendChild(li);

    exampleValues[id] = null;
    setExample(id, '');

    return id;
  }

  function getExample(id) {
    return exampleValues[id];
  }

  function setExample(id, value) {
    if (!(id in exampleValues)) {
      throw new Error(id + ' is not a valid example id');
    }
    exampleValues[id] = value;
    var code = getListEl(id).querySelector(' code');
    if (value.length > 0) {
      code.textContent = value;
    } else {
      code.innerHTML = '&nbsp;';
    }
  }

  function setSelected(id) {
    var value = getExample(id);
    ohmEditor.ui.inputEditor.setValue(value);

    // Update the DOM.
    var el = getListEl(id);
    var current = el.parentElement.querySelector('.selected');
    if (current !== el) {
      if (current) {
        current.classList.remove('selected');
      }
      el.classList.add('selected');
    }
  }

  setExample(addExample(), 'var x = 3;');
  setExample(addExample(), 'var y = function() { return "y"; }');
  setExample(addExample(), '"hello"');

  // Exports
  // -------

  ohmEditor.examples = {
    addExample: addExample,
    getExample: getExample,
    setExample: setExample,
    setSelected: setSelected
  };
});
