/* eslint-env browser */
/* global $, ohm */

'use strict';

var updateExternalRules = (function() {  // eslint-disable-line no-unused-vars
  var ohmGrammar = ohm.ohmGrammar;

  function extend(origin, add) {
    if (!add || typeof add !== 'object') {
      return origin;
    }

    var keys = Object.keys(add);
    var i = keys.length;
    while (i--) {
      origin[keys[i]] = add[keys[i]];
    }
    return origin;
  }

  function combineChildResults(children) {
    return children.reduce(function(acc, child) {
      return extend(acc, child.referencedRules);
    }, {});
  }

  // Semantic actions for collecting all of the rule names referenced
  // within a grammar.
  var referencedRulesActions = {
    Base_application: function(ident, params) {
      var rules = {};
      rules[ident.interval.contents] = true;
      return extend(rules, params.referencedRules);
    },
    _iter: combineChildResults,
    _nonterminal: combineChildResults,
    _terminal: function() {
      return {};
    }
  };

  // Returns an array of all the rules defined
  function getExternalRules(grammar) {
    var source = grammar.definitionInterval.contents;
    var result = ohmGrammar.match(source);
    var s = ohmGrammar.semantics();
    s.addAttribute('referencedRules', referencedRulesActions);
    var rules = s(result).referencedRules;
    return Object.keys(rules).filter(function(ruleName) {
      return !grammar.ruleBodies.hasOwnProperty(ruleName);
    });
  }

  // Implements a line widget that is always associated with the last line in
  // the document, no matter what edits are made.
  function LastLineWidget(editor) {
      this.editor = editor;
      this.node = $('#protos .externalRules').cloneNode(true);
      this.widget = null;

      // Create a bound version of `_placeWidget` for use with on() and off().
      this.placeWidget = this._placeWidget.bind(this);

      // Place the widget for the first time.
      this._placeWidget(null);
    }

  LastLineWidget.prototype._placeWidget = function() {
    if (this.widget) {
      this.clear();
    }
    var cm = this.editor;

    // Add the widget on the current last line.
    var lineHandle = this.lineHandle = cm.getLineHandle(cm.lastLine());
    this.widget = cm.addLineWidget(lineHandle, this.node);

    // Register for change/delete events on the line.
    // 'change' because the handle is associated with the beginning of the line, and if
    // the user inserts a newline somewhere after the beginning, the handle will no longer
    // refer to the last line in the document.
    lineHandle.on('change', this.placeWidget);
    lineHandle.on('delete', this.placeWidget);
  };

  LastLineWidget.prototype.clear = function() {
    this.widget.clear();
    this.lineHandle.off('change', this.placeWidget);
    this.lineHandle.off('delete', this.placeWidget);
  };

  LastLineWidget.prototype.update = function(matchResult, grammar) {
    // For now, only update when there is a valid grammar.
    if (!grammar) {
      return;
    }

    var container = this.node.querySelector('.content');
    container.textContent = '';

    getExternalRules(grammar).forEach(function(ruleName) {
      var pre = document.createElement('pre');
      pre.textContent = ruleName + ' = ' + grammar.ruleBodies[ruleName].toString() + '\n\n';
      container.appendChild(pre);
    });
  };

  // The singleton widget (since there's only one grammar editor).
  var widget;

  // Export: a function to be called when the grammar contents change.
  return function(editor, matchResult, grammar) {
    if (!widget) {
      widget = new LastLineWidget(editor);
    }
    widget.update(matchResult, grammar);
  };
})();
