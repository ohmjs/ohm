/* eslint-env browser */

'use strict';

(function(root, initLocal, initServer) {
  if (typeof exports === 'object') {
    module.exports = {
      local: initLocal,
      server: initServer
    };
  } else {
    checkForServerGrammars(initServer, initLocal);
  }

  function checkForServerGrammars(success, fail) {
    var httpObj = new XMLHttpRequest();
    httpObj.onreadystatechange = function() {
      if (httpObj.readyState === 4) {
        if (httpObj.status === 200) {
          var grammars = [];
          try {
            grammars = JSON.parse(httpObj.responseText);
          } catch (e) { }
          success(root.ohmEditor, root.CheckedEmitter, root.domUtil, grammars);
        } else {
          fail(root.ohmEditor, root.CheckedEmitter, root.domUtil, root.saveAs);
        }
      }
    };
    httpObj.open('GET', '../grammars/', true);
    httpObj.send();
  }
})(this, function initLocal(ohmEditor, CheckedEmitter, domUtil, saveAs) {
  var $ = domUtil.$;

  $('#grammars').hidden = false;

  var loadedGrammar = 'unnamed.ohm';
  var grammarName = $('#grammarName');

  var loadButton = $('#loadGrammar');
  var grammarFile = $('#grammarFile');
  loadButton.addEventListener('click', function(e) {
    grammarFile.click();
  });
  grammarFile.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    var filename = file.name;
    reader.onload = function(e) {
      var src = e.target.result;
      loadedGrammar = filename;
      grammarName.textContent = filename;
      grammarName.classList.remove('unnamed');

      ohmEditor.ui.grammarEditor.setValue(src);
    };
    reader.readAsText(file);
  }, false);

  var saveButton = $('#saveGrammar');
  saveButton.addEventListener('click', function(e) {
    var src = ohmEditor.ui.grammarEditor.getValue();
    // var url = 'data:application/stream;base64,' + btoa(src);
    // window.location = url;

    // use application/octet-stream to force download (not text/ohm-js;charset=utf-8)
    var blob = new Blob([src], {type: 'application/octet-stream'});
    saveAs(blob, loadedGrammar);
  });

  // local storage
  ohmEditor.addListener('change:grammar', function(source) {
    ohmEditor.saveState(ohmEditor.ui.grammarEditor, 'grammar');
  });
}, function initServer(ohmEditor, CheckedEmitter, domUtil, grammars) {
  var $ = domUtil.$;

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

  function getStringifiedActionsFor(type, semantics) {
    // type: operations || attributes
    var ops = Object.keys(semantics[type]);

    var strObj = {};
    ops.forEach(function(op) {
      var actions = semantics[type][op].actionDict;
      strObj[op] = {};
      Object.getOwnPropertyNames(actions).filter(function(action) {
        // exclude visualizer's helper actions
        return (action !== '_default') && (action !== '_nonterminal') &&
          (action !== '_terminal') && (action !== '_iter');
      }).forEach(function(action) {
        // FIXME: necessary when saving loaded functions again
        strObj[op][action] = actions[action].toString().replace('function (', 'function(');
      });
    });
    return strObj;
  }

  function getActionDictFor(operation) {
    var actionDict = {};
    Object.keys(operation).forEach(function(actionName) {
      var action = operation[actionName];
      var actionStr = action.toString();
      var match = actionStr.match(/function\s*\((.*?)\)\s*{([\s\S]*)\}$/m);

      var body = match[2];
      var lines = body.split('\n');
      if (lines[0].trim() === '') {
        lines.shift();
      }
      if (lines[lines.length - 1].trim() === '') {
        lines.pop();
      }
      var indentLen = lines.reduce(function(min, line) {
        if (line.trim() === '') {
          return min;
        } else {
          return Math.min(min, line.match(/^\s*/)[0].length);
        }
      }, Number.MAX_VALUE);
      body = lines.map(function(line, idx) {
        if (line.substr(0, indentLen).trim() === '') {
          return line.substr(indentLen);
        } else if (idx === lines.length - 1) {
          return line.trimLeft();
        } else {
          return line;
        }
      }).join('\n');

      action._actionArguments = match[1].split(',').map(function(s) { return s.trim(); });
      action._actionBody = body;
      actionDict[actionName] = action;
    });
    return actionDict;
  }

  function getSemantics() {
    var semantics = ohmEditor.semantics.getSemantics();
    var ops = getStringifiedActionsFor('operations', semantics);
    var atts = getStringifiedActionsFor('attributes', semantics);
    return JSON.stringify({operations: ops, attributes: atts});
  }

  function setSemantics(src) {
    // FIXME: A worker would be safer here!
    var semOps = (function() {
      var module = {};
      eval(src); // eslint-disable-line no-eval
      return module.exports;
    })();

    if (semOps.operations) {
      Object.getOwnPropertyNames(semOps.operations).forEach(function(opName) {
        var actionDict = getActionDictFor(semOps.operations[opName]);
        ohmEditor.semantics.emit('add:semanticOperation', 'Operation', opName, null, actionDict);
      });
    }
    if (semOps.attributes) {
      Object.getOwnPropertyNames(semOps.attributes).forEach(function(opName) {
        var actionDict = getActionDictFor(semOps.attributes[opName]);
        ohmEditor.semantics.emit('add:semanticOperation', 'Attribute', opName, null, actionDict);
      });
    }
  }

  $('#grammars').hidden = false;
  $('#grammarName').hidden = true;
  $('#saveIndicator').hidden = false;

  var grammarList = $('#grammarList');
  grammarList.hidden = false;
  grammars.forEach(function(grammar) {
    var option = document.createElement('option');
    option.text = grammar;
    grammarList.add(option);
  });
  grammarList.addEventListener('change', function(e) {
    var grammar = e.target.options[e.target.selectedIndex].value;
    if (grammar === '') { // local storage
      ohmEditor.restoreState(ohmEditor.ui.grammarEditor, 'grammar', $('#sampleGrammar'));
      return;
    }

    getFromURL('../grammars/' + grammar, function(src) {
      // TODO: should be ohmEditor.once(...)
      ohmEditor.addListener('change:grammar', function(source) {
        ohmEditor.removeCurrentListener();
        $('#saveIndicator').classList.remove('edited');
      });

      // TODO: should be ohmEditor.once(...)
      ohmEditor.addListener('parse:grammar', function(matchResult, ohmGrammar, error) {
        ohmEditor.removeCurrentListener();
        getFromURL('../semantics/' + grammar, function(src) {
          setSemantics(src);
        });
      });

      ohmEditor.ui.grammarEditor.setValue(src);
    });
  });

  $('#loadGrammar').hidden = true;
  $('#saveGrammar').hidden = true;

  ohmEditor.ui.grammarEditor.setOption('extraKeys', {
    'Cmd-S': function(cm) {
      var grammar = grammarList.options[grammarList.selectedIndex].value;
      if (grammar === '') {
        return;
      }

      postToURL('../grammars/' + grammar, cm.getValue(), function(response) {
        $('#saveIndicator').classList.remove('edited');

        postToURL('../semantics/' + grammar, getSemantics(), function(response) {
          // do nothing
        });
      });
    }
  });

  ohmEditor.addListener('change:grammar', function(source) {
    var grammar = grammarList.options[grammarList.selectedIndex].value;
    if (grammar === '') { // local storage
      ohmEditor.saveState(ohmEditor.ui.grammarEditor, 'grammar');
    } else {
      $('#saveIndicator').classList.add('edited');
    }
  });
});
