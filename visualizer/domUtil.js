'use strict';

(function(root, initModule) {
  if (typeof exports === 'object') {
    module.exports = initModule;
  } else {
    root.domUtil = initModule(root.document);  // eslint-disable-line no-unused-vars
  }
})(this, function(document) {

  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  // Hide the context menus when Esc or Enter is pressed, any click happens, or another
  // context menu is brought up.
  document.addEventListener('click', hideContextMenus);
  document.addEventListener('contextmenu', hideContextMenus);
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === KeyCode.ESC || e.keyCode === KeyCode.ENTER) {
      hideContextMenus();
    }
  });
  function hideContextMenus() {
    var menus = document.querySelectorAll('.contextMenu');
    Array.prototype.forEach.call(menus, function(menu) {
      menu.hidden = true;
    });
  }

  // Exports
  // -------

  return {
    $: function(sel) { return document.querySelector(sel); },

    $$: function(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); },

    clearDOMNode: function(domNode) {
      while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
      }
    },

    createElement: function(sel, optContent) {
      var parts = sel.split('.');
      var tagName = parts[0];
      if (tagName.length === 0) {
        tagName = 'div';
      }

      var el = document.createElement(tagName);
      el.className = parts.slice(1).join(' ');
      if (optContent) {
        el.textContent = optContent;
      }
      return el;
    },

    closestElementMatching: function(sel, startEl) {
      var el = startEl;
      while (el != null) {
        if (el.matches(sel)) {
          return el;
        }
        el = el.parentElement;
      }
    },

    toggleClasses: function(el, map) {
      for (var k in map) {
        if (map.hasOwnProperty(k)) {
          el.classList.toggle(k, !!map[k]);
        }
      }
    },

    // Permanently add a menu item to the context menu.
    // `menuId` is the value use as the `id` attribute of the context menu.
    // `id` is the value to use as the 'id' attribute of the DOM node.
    // `label` is the text label of the item.
    // `onClick` is a function to use as the onclick handler for the item.
    // If an item with the same id was already added, then the old item will be updated
    // with the new values from `label`, `enabled`, and `onClick`.
    addMenuItem: function(menuId, id, label, enabled, onClick) {
      var itemList = document.querySelector('#' + menuId + ' ul');
      var li = itemList.querySelector('#' + id);
      if (!li) {
        li = itemList.appendChild(this.createElement('li'));
        li.id = id;
      }
      // Set the label.
      li.innerHTML = '<label></label>';
      li.firstChild.innerHTML = label;

      li.classList.toggle('disabled', !enabled);
      if (enabled) {
        li.onclick = onClick;
      }
      return li;
    }
  };
});
