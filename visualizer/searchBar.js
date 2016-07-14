'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    initModule(root.ohmEditor, root.domUtil, root.CodeMirror);
  }
})(this, function(ohmEditor, domUtil, CodeMirror) {
  // Returns the first ancestor node of `el` that has class `className`.
  function ancestorWithClassName(el, className) {
    var node = el;
    while ((node = node.parentElement) != null) {
      if (node.classList.contains(className)) {
        return node;
      }
    }
  }

  function installEventHandlers(editor, footer, findCallback) {
    var input = footer.querySelector('input[type=search]');

    // Install a temporary keymap while the toolbar is open, which makes Cmd-F
    // refocus the search bar rather than starting a new search.
    var tempKeyMap = {fallthrough: 'default'};
    tempKeyMap['Cmd-F'] = tempKeyMap['Ctrl-F'] = function doFind(cm) {
      var selection = cm.getSelection();

      // If there's no selection or it's the same as the current search, refocus the search bar.
      // Otherwise, start a new search.
      if (selection.length === 0 || selection === input.value) {
        input.select();
      } else {
        cm.execCommand('findPersistent');
      }
    };
    editor.addKeyMap(tempKeyMap);

    // Handles find-related keys when the search bar has focus. `binding` is the result
    // of looking up the key in `tempKeyMap`. Returns `true` if the key was handled, and
    // `false` otherwise.
    var handleKey = function(binding) {
      if (typeof binding === 'function') {
        binding(editor);
        return true;
      } else if (typeof binding === 'string' && binding.indexOf('find') === 0) {
        editor.execCommand(binding);
        return true;
      }
      return false;
    };

    var closeFooter = function() {
      footer.parentNode.removeChild(footer);
      editor.execCommand('clearSearch');
      editor.removeKeyMap(tempKeyMap);
      editor.focus();
    };

    // Handler for keydown events in the search bar.
    footer.onkeydown = function(e) {
      var keyName = CodeMirror.keyName(e);
      if (keyName === 'Esc') {
        closeFooter();
        editor.focus();
      } else if (e.target === input && keyName === 'Enter') {
        findCallback(input.value, e);
      } else if (CodeMirror.lookupKey(keyName, tempKeyMap, handleKey) === 'handled') {
        e.preventDefault();
      }
    };

    var closeButton = footer.querySelector('.closeButton');
    closeButton.onclick = closeFooter;
  }

  // An implementation of CodeMirror's `openDialog` API, but specialized for use
  // as the search box. As such, it might not be very well suited to other purposes.
  CodeMirror.defineExtension('openDialog', function(template, callback, opts) {
    var editor = this;

    if (template.indexOf('Search:') !== 0) {
      throw new Error('No dialog for template ' + template);
    }

    // Re-use the existing footer if it's visible, or create a new one.
    var container = ancestorWithClassName(editor.getWrapperElement(), 'flex-fix').parentNode;
    var footer = container.querySelector('.footer');
    if (!footer) {
      footer = domUtil.$('#protos .footer').cloneNode(true);
      container.appendChild(footer);
      footer.removeAttribute('hidden');
      installEventHandlers(editor, footer, callback);
    }

    var closeButton = footer.querySelector('.closeButton');
    var input = footer.querySelector('input[type=search]');

    if (opts.value) {
      input.value = opts.value;
    }
    input.select();
    return closeButton.onclick;
  });

  // A keymap which maps Ctrl-F/Cmd-F to 'findPersistent' (rather than 'find').
  var editorKeyMap = {};
  editorKeyMap['Ctrl-F'] = editorKeyMap['Cmd-F'] = 'findPersistent';

  var handleEditorInit = function(cm) {
    cm.addKeyMap(editorKeyMap);
  };
  ohmEditor.addListener('init:inputEditor', handleEditorInit);
  ohmEditor.addListener('init:grammarEditor', handleEditorInit);
});
