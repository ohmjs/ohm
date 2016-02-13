'use strict';

/* global $, CodeMirror */

var searchBar = (function() {  // eslint-disable-line no-unused-vars
  // Returns the first ancestor node of `el` that has class `className`.
  function ancestorWithClassName(el, className) {
    var node = el;
    while ((node = node.parentElement) != null) {
      if (node.classList.contains(className)) {
        return node;
      }
    }
  }

  // An implementation of CodeMirror's `openDialog` API, but specialized for use
  // as the search box. As such, it might not be very well suited to other purposes.
  CodeMirror.defineExtension('openDialog', function(template, callback, opts) {
    var ENTER_KEY = 13;
    var ESC_KEY = 27;

    var editor = this;

    if (template.indexOf('Search:') !== 0) {
      throw new Error('No dialog for template ' + template);
    }

    // Re-use the existing footer if it's visible, or create a new one.
    var container = ancestorWithClassName(editor.getWrapperElement(), 'flex-fix').parentNode;
    var footer = container.querySelector('.footer');
    var reused = true;
    if (!footer) {
      footer = $('#protos .footer').cloneNode(true);
      container.appendChild(footer);
      footer.removeAttribute('hidden');
      reused = false;
    }

    var closeButton = footer.querySelector('.closeButton');
    var input = footer.querySelector('input[type=search]');

    // Install a temporary keymap while the toolbar is open, which makes Cmd-F
    // refocus the search bar rather than starting a new search.
    var keyMap = {};
    keyMap['Cmd-F'] = function(cm) {
      var selection = cm.getSelection();

      // If there's no selection or it's the same as the current search, refocus the search bar.
      // Otherwise, start a new search.
      if (selection.length === 0 || selection === input.value) {
        input.select();
      } else {
        cm.execCommand('findPersistent');
      }
    };

    if (!reused) {
      var closeFooter = function() {
        footer.parentNode.removeChild(footer);
        editor.execCommand('clearSearch');
        editor.removeKeyMap(keyMap);
        editor.focus();
      };
      closeButton = footer.querySelector('.closeButton');
      closeButton.onclick = closeFooter;
      editor.addKeyMap(keyMap);

      input.onkeydown = function(e) {
        if (e.keyCode === ESC_KEY) {
          closeFooter();
          editor.focus();
        } else if (e.keyCode === ENTER_KEY) {
          callback(input.value, e);
        }
      };
    }
    if (opts.value) {
      input.value = opts.value;
    }
    input.select();

    return closeButton.onclick;
  });

  // A keymap which maps Ctrl-F/Cmd-F to 'findPersistent' (rather than 'find').
  var editorKeyMap = {};
  editorKeyMap['Ctrl-F'] = editorKeyMap['Cmd-F'] = 'findPersistent';

  return {
    // Initialize the search bar for the CodeMirror instance `cm`.
    initializeForEditor: function(cm) {
      cm.addKeyMap(editorKeyMap);
    }
  };
})();
