/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.domUtil, root.CheckedEmitter);
  }
})(this, function(ohm, ohmEditor, domUtil, CheckedEmitter) {

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

  ohmEditor.examples.registerEvents({
    'add:example': ['id'],
    'set:example': ['id', 'oldValue', 'newValue'],
    'set:selected': ['id'],
    'remove:example': ['id']
  });

  var idCounter = 0;
  var selectedId = -1;
  var exampleValues = Object.create(null);

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
    var matchResult;
    try {
      if (startRule) {
        matchResult = ohmEditor.grammar.match(text, startRule);
      } else {
        matchResult = ohmEditor.grammar.match(text);
      }
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
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
      if (selectedId === id) {
        setSelected(elToSelect ? elToSelect.id : -1);
      }

      delete exampleValues[id];
      ohmEditor.examples.emit('remove:example', id);
    };

    li.appendChild(del);

    exampleValues[id] = null;
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

  function getExamples() {
    return exampleValues;
  }

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

  // TODO: How will I know about these commands? (UI for "save as new"?)
  ohmEditor.ui.inputEditor.setOption('extraKeys', {
    'Cmd-S': function(ed) { // save
      if (selectedId) {
        setExample(selectedId, ed.doc.getValue());
      } else {
        var newId = addExample();
        setExample(newId, ed.doc.getValue());
        setSelected(newId);
      }
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
    },
    'Shift-Cmd-S': function(ed) { // save as new
      var newId = addExample();
      setExample(newId, ed.doc.getValue());
      setSelected(newId);
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
    },
    'Alt-S': function(ed) { // save
      if (selectedId) {
        setExample(selectedId, ed.doc.getValue());
      } else {
        var newId = addExample();
        setExample(newId, ed.doc.getValue());
        setSelected(newId);
      }
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
    },
    'Shift-Alt-S': function(ed) { // save as new
      var newId = addExample();
      setExample(newId, ed.doc.getValue());
      setSelected(newId);
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
    }
  });

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
    var firstIDDOM = document.querySelector('#exampleList li:first-child');
    if (firstIDDOM) {
      var firstId = firstIDDOM.id;
      setSelected(firstId);
    }
  }

  function saveExamples(elem, key) {
    var elems = domUtil.$$('#exampleContainer ul li code');
    var examples = [].slice.apply(elems).map(function(elem) {
      return {
        text: elem.textContent,
        startRule: elem.startRule
      };
    });
    localStorage.setItem('examples', JSON.stringify(examples));
  }

  // Main
  // ----

  domUtil.$('#addExampleButton').onclick = function(e) {
    setSelected(addExample());
  };

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
