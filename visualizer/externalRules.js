/* eslint-env browser */
/* global $, ohm */

'use strict';

var updateExternalRules = (function() {  // eslint-disable-line no-unused-vars
  var ohmGrammar = ohm.ohmGrammar;
  var builtInRules = ohm.grammar('G {}').superGrammar;

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

  function combineChildResults(attr) {
    return function(children) {
      return children.reduce(function(acc, child) {
        return extend(acc, child[attr]);
      }, {});
    };
  }

  var semantics = ohmGrammar.semantics();

  // An attribute for collecting all of the rule names referenced within a grammar.
  // Returns an object whose own properties represent all the referenced rule names.
  semantics.addAttribute('referencedRules', {
    Base_application: function(ident, args) {
      var ans = {};
      ans[ident.interval.contents] = true;
      return extend(ans, args.referencedRules);
    },
    _iter: combineChildResults('referencedRules'),
    _nonterminal: combineChildResults('referencedRules'),
    _terminal: function() {
      return {};
    }
  });

  // An attribute for collecting all of the identifiers found in a (possibly invalid) grammar.
  // Returns an object whose own properties represent all the identifiers found in the source.
  semantics.addAttribute('identifiers', {
    ident: function(_) {
      var ans = {};
      ans[this.interval.contents] = true;
      return ans;
    },
    _iter: combineChildResults('identifiers'),
    _nonterminal: combineChildResults('identifiers'),
    _terminal: function() {
      return {};
    }
  });

  // Returns an object whose keys represent all externally-defined rules which
  // are referenced in the Ohm grammar represented by `matchResult`.
  function getExternalRules(rulesObj) {
    var ans = {};
    Object.keys(rulesObj).forEach(function(ruleName) {
      if (ruleName in builtInRules.ruleBodies) {
        ans[ruleName] = builtInRules.ruleBodies[ruleName].toString();
      }
    });
    return ans;
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

  LastLineWidget.prototype.update = function(cm, matchResult, grammar) {
    if (grammar) {
      this._rules = getExternalRules(semantics(matchResult).referencedRules);
    } else {
      var lenientResult = ohmGrammar.match(cm.getValue(), 'tokens');
      this._rules = getExternalRules(semantics(lenientResult).identifiers);
    }

    var container = this.node.querySelector('.content');
    container.textContent = '';

    for (var ruleName in this._rules) {
      var pre = document.createElement('pre');
      pre.textContent = ruleName + ' = ' + this._rules[ruleName] + '\n\n';
      container.appendChild(pre);
    }
  };

  // The singleton widget (since there's only one grammar editor).
  var widget;

  // Export: a function to be called when the grammar contents change.
  return function(editor, matchResult, grammar) {
    if (!widget) {
      widget = new LastLineWidget(editor);
    }
    widget.update(editor, matchResult, grammar);
  };
})();
