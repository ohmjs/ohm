/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.domUtil);
  }
})(this, function(ohm, ohmEditor, domUtil) {
  var idCounter = 0;
  var selectedId = -1;

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
    var succeeded;
    try {
      succeeded = ohmEditor.grammar.match(example).succeeded();
    } catch (e) {
      succeeded = false;
    }
    var el = getListEl(id);
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
      saveExamples();
      if (selectedId === id) {
        setSelected(elToSelect ? elToSelect.id : -1);
      }
    };
    domUtil.$('#exampleContainer ul').appendChild(li);
    ohmEditor.ui.inputEditor.focus();

    return id;
  }

  // Return the contents of the example with the given id.
  function getExample(id) {
    var el = getListEl(id);
    if (!el) {
      throw new Error(id + ' is not a valid example id');
    }
    return el.querySelector('code').textContent;
  }

  // Set the contents of an example the given id to `value`.
  function setExample(id, value) {
    var el = getListEl(id);
    if (!el) {
      throw new Error(id + ' is not a valid example id');
    }
    var code = el.querySelector('code');
    el.classList.remove('pass', 'fail');
    setTimeout(checkExample.bind(null, id), 0);
    if (value.length > 0) {
      code.textContent = value;
    } else {
      code.innerHTML = '&nbsp;';
    }
  }

  // Select the example with the given id.
  function setSelected(id) {
    var el;
    var value = '';
    var inputEditor = ohmEditor.ui.inputEditor;
    if (id !== -1) {
      value = getExample(id);
      el = getListEl(id);
    }
    selectedId = id;
    inputEditor.setValue(value);

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
  }

  // Restore the examples from localStorage.
  function restoreExamples(editor, key) {
    var value = localStorage.getItem(key);
    var examples = [];
    if (value) {
      examples = JSON.parse(value);
    } else {
      examples = domUtil.$$('#sampleExamples pre').map(function(elem) {
        return elem.textContent;
      });
    }
    examples.forEach(function(ex) {
      setExample(addExample(), ex);
    });

    // Select the first example.
    var first = domUtil.$('#exampleList li:first-child');
    var firstId = first ? first.id : -1;
    setSelected(firstId);
  }

  // Save the current contents of all examples to localStorage.
  function saveExamples() {
    var elems = domUtil.$$('#exampleContainer ul li code');
    var examples = elems.map(function(elem) {
      return elem.textContent;
    });
    localStorage.setItem('examples', JSON.stringify(examples));
  }

  // Main
  // ----

  domUtil.$('#addExampleButton').onclick = function(e) {
    setSelected(addExample());
  };

  ohmEditor.ui.inputEditor.setOption('extraKeys', {
    'Cmd-S': function(cm) { // save
      if (selectedId) {
        setExample(selectedId, cm.getValue());
        saveExamples();
      }
    }
  });

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, err) {
    var exampleEls = domUtil.$$('#exampleContainer ul li');
    exampleEls.forEach(function(el) {
      if (err) {
        el.classList.remove('pass', 'fail');
      } else {
        checkExample(el.id);
      }
    });
  });

  // Hide the inputEditor by default, only showing it when there is a selected example.
  ohmEditor.ui.inputEditor.getWrapperElement().hidden = true;

  restoreExamples(ohmEditor.ui.inputEditor, 'examples');
});
