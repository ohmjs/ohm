/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.domUtil, root.CheckedEmitter);
  }
})(this, function(ohm, ohmEditor, domUtil, CheckedEmitter) {
  var idCounter = 0;
  var selectedId = -1;
  var exampleValues = Object.create(null);

  // Exports
  // -------

  ohmEditor.examples = Object.assign(new CheckedEmitter(), {
    addExample: addExample,
    getExample: getExample,
    getExamples: getExamples,
    setExample: setExample,
    setSelected: setSelected,
    saveExamples: saveExamples
  });

  // each of these events is emitted after the action they refer to
  //   takes place. For example, 'add:example' is emitted after an
  //   example is added to the list.
  ohmEditor.examples.registerEvents({
    'add:example': ['id'],
    'set:example': ['id', 'oldValue', 'newValue'],
    'set:selected': ['id'],
    'remove:example': ['id']
  });

  // Helpers
  // -------

  function uniqueId() {
    return 'example-' + idCounter++;
  }

  function handleMouseDown(e) {
    var li = e.target.parentElement;
    setSelected(li.id);
  }

  function checkExample(id) {
    var example = getExample(id);
    var text = example.text;
    var startRule = example.startRule;
    var el = getListEl(id);
    var succeeded;
    try {
      var matchResult = ohmEditor.grammar.match(text, startRule);
      succeeded = matchResult.succeeded();
    } catch (e) {
      succeeded = false;
    }
    el.classList.toggle('pass', succeeded);
    el.classList.toggle('fail', !succeeded);
  }

  function getListEl(exampleId) {
    return domUtil.$('#' + exampleId);
  }

  // Add a new example to the list, and return its ID.
  function addExample() {
    var li = domUtil.createElement('li.example');
    var id = li.id = uniqueId();
    li.onmousedown = handleMouseDown;

    li.appendChild(domUtil.createElement('code'));

    var del = li.appendChild(domUtil.createElement('div.delete'));
    del.innerHTML = '&#x2716;';
    del.onmousedown = function(e) {
      e.stopPropagation();  // Prevent selection.
    };
    del.onclick = function() {
      var elToSelect = li.previousSibling || li.nextSibling;
      li.remove();
      delete exampleValues[id];
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
      if (selectedId === id) {
        setSelected(elToSelect ? elToSelect.id : -1);
      }

      ohmEditor.examples.emit('remove:example', id);
    };

    li.appendChild(del);

    exampleValues[id] = {
      text: '',
      startRule: null
    };
    domUtil.$('#exampleContainer ul').appendChild(li);
    ohmEditor.ui.inputEditor.focus();

    ohmEditor.examples.emit('add:example', id);

    return id;
  }

  // Return the contents of the example with the given id.
  function getExample(id) {
    if (!(id in exampleValues)) {
      throw new Error(id + ' is not a valid example id');
    } else {
      return exampleValues[id];
    }
  }

  // Return the dicationary of all examples. Used in
  //   'exampleGenerationRequests.js'
  function getExamples() {
    return exampleValues;
  }

  // Set the contents of an example the given id to `value`.
  function setExample(id, text, optStartRule) {
    if (!(id in exampleValues)) {
      throw new Error(id + ' is not a valid example id');
    }

    var startRule = optStartRule || null;
    var oldValue = exampleValues[id];
    var value = exampleValues[id] = {
      text: text,
      startRule: startRule
    };

    var code = getListEl(id).querySelector(' code');
    code.startRule = startRule;
    code.parentElement.classList.remove('pass', 'fail');
    setTimeout(checkExample.bind(null, id), 0);
    if (value.text.length > 0) {
      code.textContent = text;
    } else {
      code.innerHTML = '&nbsp;';
    }

    ohmEditor.examples.emit('set:example', id, oldValue, value);
  }

  // Select the example with the given id.
  function setSelected(id) {
    var el;
    var value = {
      text: '',
      startRule: null
    };
    var inputEditor = ohmEditor.ui.inputEditor;
    if (id !== -1) {
      value = getExample(id);
      el = getListEl(id);
    }
    selectedId = id;

    ohmEditor.startRule = value.startRule;
    inputEditor.setValue(value.text);

    // Update the DOM.
    var current = domUtil.$('#exampleContainer .selected');
    if (current !== el) {
      if (current) {
        current.classList.remove('selected');
      }
      if (el) {
        el.classList.add('selected');
      }
    }

    inputEditor.getWrapperElement().hidden = !el;
    inputEditor.focus();

    ohmEditor.examples.emit('set:selected', id);
  }

  // Restore the examples from localStorage.
  function restoreExamples(editor, key) {
    var value = localStorage.getItem(key);
    var examples = [];
    if (value) {
      examples = JSON.parse(value);
    } else {
      examples = domUtil.$$('#sampleExamples pre').map(function(elem) {
        return {
          text: elem.textContent,
          startRule: null
        };
      });
    }

    examples.forEach(function(ex) {
      setExample(addExample(), ex.text, ex.startRule);
    });

    // Select the first example.
    var firstEl = domUtil.$('#exampleList li:first-child');
    var firstId = firstEl ? firstEl.id : -1;
    setSelected(firstId);
  }

  // Save the current contents of all examples to localStorage.
  function saveExamples() {
    localStorage.setItem('examples', JSON.stringify(
      Object.keys(exampleValues).map(function(key) {
        return exampleValues[key];
      })
    ));
  }

  // Main
  // ----

  domUtil.$('#addExampleButton').onclick = function(e) {
    setSelected(addExample());
  };

  var uiSave = function(cm) {
    if (selectedId) {
      setExample(selectedId, cm.getValue());
      saveExamples();
    }
  };

  ohmEditor.ui.inputEditor.setOption('extraKeys', {
    'Cmd-S': uiSave,
    'Ctrl-S': uiSave
  });

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, err) {
    Object.keys(exampleValues).forEach(function(id) {
      var el = getListEl(id);
      if (err) {
        el.classList.remove('pass', 'fail');
      } else {
        checkExample(id);
      }
    });
  });

  // Hide the inputEditor by default, only showing it when there is a selected example.
  ohmEditor.ui.inputEditor.getWrapperElement().hidden = true;

  restoreExamples(ohmEditor.ui.inputEditor, 'examples');
});
