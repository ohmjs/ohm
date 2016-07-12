/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohm, root.ohmEditor, root.CheckedEmitter);
  }
})(this, function(ohm, ohmEditor, CheckedEmitter) {

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

  // Helpers
  // -------

  var idCounter = 0;
  var selectedId;
  var exampleValues = Object.create(null);

  function uniqueId() {
    return 'example-' + idCounter++;
  }

  function handleMouseDown(e) {
    var li = e.target.parentElement;
    ohmEditor.examples.setSelected(li.id);
    e.preventDefault();
  }

  function checkExample(elem) {
    var example = elem.textContent;
    try {
      var mr = ohmEditor.grammar.match(example);
      if (mr.succeeded()) {
        elem.parentElement.classList.add('pass');
      } else {
        throw new Error('Match failed');
      }
    } catch (e) {
      elem.parentElement.classList.add('fail');
    }
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

    var del = document.createElement('div');
    del.className = 'delete';
    del.innerHTML = '&#x2716;';
    del.onmousedown = function(e) {
      e.stopPropagation();
    };
    del.onclick = function() {
      li.remove();
      saveExamples(ohmEditor.ui.inputEditor, 'examples');
      if (selectedId === id) {
        selectedId = null;
      }

      delete exampleValues[id];
      ohmEditor.examples.emit('remove:example', id);
    };
    li.appendChild(del);

    document.querySelector('#userExampleContainer ul').appendChild(li);

    exampleValues[id] = null;
    setExample(id, '');

    ohmEditor.examples.emit('add:example', id);

    return id;
  }

  function getExample(id) {
    return exampleValues[id];
  }

  function getExamples() {
    return exampleValues;
  }

  function setExample(id, value) {
    if (!(id in exampleValues)) {
      throw new Error(id + ' is not a valid example id');
    }
    var oldValue = exampleValues[id];
    exampleValues[id] = value;
    var code = getListEl(id).querySelector(' code');
    code.parentElement.classList.remove('pass', 'fail');
    setTimeout(checkExample.bind(null, code), 0);
    if (value.length > 0) {
      code.textContent = value;
    } else {
      code.innerHTML = '&nbsp;';
    }

    ohmEditor.examples.emit('set:example', id, oldValue, value);
  }

  function setSelected(id) {
    var value = getExample(id);
    selectedId = id;
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

  function restoreExamples(editor, key, defaultEl) {
    var value = localStorage.getItem(key);
    var examples = [];
    if (value && value !== '[]') {
      examples = JSON.parse(value);
    } else if (defaultEl) {
      examples = Array.prototype.map.call(defaultEl.querySelectorAll('pre'), function(elem) {
        return elem.textContent;
      });
    }
    examples.forEach(function(ex) {
      setExample(addExample(), ex);
    });

    // Select the first example.
    var firstIDDOM = document.querySelector('#exampleList li:first-child');
    if (firstIDDOM) {
      var firstId = firstIDDOM.id;
      setSelected(firstId);
    }
  }

  function saveExamples(elem, key) {
    var elems = document.querySelectorAll('#exampleContainer ul li code');
    var examples = [].slice.apply(elems).map(function(elem) {
      return elem.textContent;
    });
    localStorage.setItem('examples', JSON.stringify(examples));
  }

  restoreExamples(ohmEditor.ui.inputEditor, 'examples', document.querySelector('#sampleExamples'));

});
