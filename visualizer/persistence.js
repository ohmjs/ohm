/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.CheckedEmitter);
  }
})(this, function(ohmEditor, CheckedEmitter) {
  function getFromURL(url, cb) {
    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
      if (httpObj.readyState === 4 && httpObj.status === 200) {
        cb(httpObj.responseText);
      }
    };
    httpObj.open('GET', url, true);
    httpObj.send();
  }

  function postToURL(url, data, cb) {
    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
      if (httpObj.readyState === 4 && httpObj.status === 200) {
        cb(httpObj.responseText);
      }
    };
    httpObj.open('POST', url, true);
    httpObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpObj.send(data);
  }

  document.querySelector('#grammars').style.setProperty('display', 'block');

  var loadedGrammar = 'ohm';
  var grammarName = document.querySelector('#grammarName');

  var loadButton = document.querySelector('#loadGrammar');
  loadButton.addEventListener('click', function(e) {
    var grammar = window.prompt('Grammar to load:', loadedGrammar); // eslint-disable-line no-alert
    if (grammar === null) {
      return;
    }

    getFromURL('../grammars/' + grammar, function(src) {
      loadedGrammar = grammar;
      grammarName.textContent = grammar;
      grammarName.classList.remove('unnamed');

      ohmEditor.ui.grammarEditor.setValue(src);
    });
  });

  var saveButton = document.querySelector('#saveGrammar');
  saveButton.addEventListener('click', function(e) {
    var grammar = window.prompt('Save grammar as:', loadedGrammar); // eslint-disable-line no-alert
    if (grammar === null) {
      return;
    }

    postToURL('../grammars/' + grammar, ohmEditor.ui.grammarEditor.getValue(), function(response) {
      loadedGrammar = grammar;
      grammarName.textContent = grammar;
      grammarName.classList.remove('unnamed');
    });
  });
});
