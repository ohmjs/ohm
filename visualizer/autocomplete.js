/* eslint-env browser */

'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.domUtil);
  }
})(this, function(ohmEditor, domUtil) {

  var $ = domUtil.$;
  var $$ = domUtil.$$;

  function connect(node, type, handler) {
    if (typeof node.addEventListener === 'function') {
      node.addEventListener(type, handler, false);
    } else {
      node.attachEvent('on' + type, handler);
    }
  }

  var nodeList;
  var variableList;
  var localTokens;
  ohmEditor.parseTree.addListener('cmdOrCtrlClick:traceElement', function(wrapper) {
    if ($('.semanticsEditor').hidden) {
      variableList = nodeList = undefined;
      return;
    }
    nodeList = Object.create(null);
    variableList = [];
    nodeList.this = $('.self.selected').parentElement._traceNode.bindings[0];
    variableList.push('this');
    $$('.semanticsEditor .mainBody .rule block').forEach(function(block) {
      var name = block.lastChild.textContent || block.querySelector('.display').textContent;
      nodeList[name] = block.firstChild._cstNode;
      variableList.push(name);
    });
    $$('.semanticsEditor .mainBody .argTag').forEach(function(tag) {
      variableList.push(tag._name);
    });
  });

  var editor;
  function populateTokens(startLine, endIdx) {
    localTokens = [];
    for (var l = startLine; l >= 0; l--) {
      while (endIdx > 0) {
        var token = editor.getTokenAt({line: l, ch: endIdx});
        if (token.string.trim()) {
          if (token.string === '.') {
            var lastToken = localTokens[localTokens.length - 1];
            if (lastToken && !editor.getLine(l).substring(token.end, lastToken.start).trim()) {
              localTokens.pop();
            }
          } else if (/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(token.string)) {
            localTokens.push(token);
          }
        }
        endIdx = token.start;
      }
      endIdx = editor.getLine(l).length;
    }
  }

  function setPlaceholder(placeHolder) {
    clearPlaceholder();
    var elt = editor.state.placeholder = domUtil.createElement('span.CodeMirror-placeholder');
    elt.style.cssText = 'height: 0; overflow: visible; color: grey;';
    elt.appendChild(document.createTextNode(placeHolder));
    var preElt = $('.semanticsEditor .CodeMirror-code .placeholderAppended');
    if (preElt.nextSibling) {
      preElt.parentElement.insertBefore(elt, preElt.nextSibling);
    } else {
      preElt.parentElement.appendChild(elt);
    }
  }

  function clearPlaceholder() {
    if (!editor.state.placeholder) {
      return;
    }
    editor.state.placeholder.parentNode.removeChild(editor.state.placeholder);
    editor.state.placeholder = null;
  }

  var refreshTimeout;
  function triggerAutoCompletion(delay) {
    clearPlaceholder();

    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }
    refreshTimeout = setTimeout(startComplete, delay || 0);
  }

  ohmEditor.addListener('parse:grammar', function(matchResult, grammar, error) {
    if (grammar && grammar.defaultStartRule) {
      editor = $('.semanticsEditor .mainBody .body').firstChild.CodeMirror;
      editor.on('keydown', function(cm, event) {
        if (event.code === 'Tab' && editor.state.placeholder) {
          event.preventDefault();
          var cur = editor.getCursor(false);
          editor.replaceRange(editor.state.placeholder.textContent, cur);
        }
        triggerAutoCompletion(400);
      });
    }
  });

  var marker;
  function startComplete() {
    // We want a single cursor position.
    if (editor.somethingSelected()) {
      return;
    }
    // Build the select widget
    var complete = $('#completions');

    // Find the token at the cursor
    var cur = editor.getCursor(false);
    var token = editor.getTokenAt(cur);
    var tprop = token;
    var context = [];

    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = tprop = {start: cur.ch, end: cur.ch, string: '', state: token.state,
                       className: token.string === '.' ? 'property' : null};
    }

    // If it is a property, find out what it is a property of.
    if (tprop.className === 'property') {
      tprop = editor.getTokenAt({line: cur.line, ch: tprop.start});
      if (tprop.string !== '.') {
        return;
      }
      tprop = editor.getTokenAt({line: cur.line, ch: tprop.start});
      context.push(tprop);
    }

    var completions = getCompletions(token, context);
    if (!completions || !completions.length) {
      return;
    }

    // When there is only one completion, use it directly.
    if (completions.length === 1) {
      if (marker) {
        marker.clear();
      }

      marker = editor.markText({line: cur.line, ch: token.end - 1},
          {line: cur.line, ch: token.end},
          {className: 'placeholderAppended'});
      setPlaceholder(completions[0].substring(token.string.length));
      return;
    }

    var sel = complete.appendChild(domUtil.createElement('select'));
    sel.style.backgroundColor = 'white';
    completions.forEach(function(c) {
      sel.appendChild(domUtil.createElement('option', c));
    });
    sel.firstChild.selected = true;
    sel.size = Math.min(10, completions.length);

    var pos = editor.cursorCoords();
    complete.style.left = pos.left + 'px';
    complete.style.top = pos.top + 'px';
    complete.hidden = false;

    // Hack to hide the scrollbar.
    if (completions.length <= 10) {
      complete.style.width = (sel.clientWidth - 1) + 'px';
    }

    function close() {
      $('#completions').hidden = true;
      complete.innerHTML = '';
      editor.focus();
    }

    function pick() {
      var str = sel.options[sel.selectedIndex].text;
      editor.replaceRange(str, {line: cur.line, ch: token.start}, {line: cur.line, ch: token.end});
      close();
    }
    connect(sel, 'blur', close);
    connect(sel, 'keydown', function(event) {
      var code = event.code;
      if (code === 'Enter' || code === 'Space') {
        event.preventDefault();
        event.stopPropagation();
        pick();
      } else if (code === 'Escape' || code === 'Backspace') {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (code !== 'ArrowUp' && code !== 'ArrowDown') {
        close();
        triggerAutoCompletion(400);
      }
    });
    connect(sel, 'click', pick);

    sel.focus();
  }

  function getCompletions(token, context) {
    if (!token.string.trim() && !context.length) {
      return undefined;
    }
    var completions = [];
    var prefix = token.string;
    function maybeAdd(str) {
      if (str.indexOf(prefix) === 0 && !completions.includes(str)) {
        completions.push(str);
      }
    }

    if (context.length > 0) {
      // If this is a property, see if it belongs to some object we can
      // find in the current environment.
      var objName = context.pop().string;
      if (objName in nodeList) {
        var node = nodeList[objName];
        var semantics = ohmEditor.semantics.getSemantics();
        Object.keys(semantics.operations).forEach(function(op) {
          var resultWrapper = ohmEditor.semantics.forceResult(node, op);
          if (!resultWrapper.missingSemanticsAction) {
            maybeAdd(op);
          }
        });

        Object.keys(semantics.attributes).forEach(function(at) {
          var resultWrapper = ohmEditor.semantics.forceResult(node, at);
          if (!resultWrapper.missingSemanticsAction) {
            maybeAdd(at);
          }
        });
        maybeAdd('sourceString');
      }
    } else {
      variableList.forEach(function(variable) {
        maybeAdd(variable);
      });

      populateTokens(editor.lineCount() - 1, token.start);
      localTokens.forEach(function(t) {
        maybeAdd(t.string);
      });
    }

    return completions;
  }

});
