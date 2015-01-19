// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var ohm = require('./main.js');
var errors = require('./errors.js');

var awlib = require('awlib');
var browser = awlib.browser;

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// TODO: just use the jQuery thing
function load(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error('unable to load url ' + url);
}

// --------------------------------------------------------------------
// Namespaces
// --------------------------------------------------------------------

function Namespace(name) {
  this.name = name;
  this.grammars = {};
}

Namespace.prototype = {
  install: function(name, grammar) {
    if (this.grammars[name]) {
      throw new errors.DuplicateGrammarDeclaration(name, this.name);
    } else {
      this.grammars[name] = grammar;
    }
    return this;
  },

  getGrammar: function(name) {
    if (this.grammars[name]) {
      return this.grammars[name];
    } else {
      throw new errors.UndeclaredGrammar(name, this.name);
    }
  },

  loadGrammarsFromScriptElement: function(element) {
    browser.sanityCheck('script tag\'s type attribute must be "text/ohm-js"', element.type === 'text/ohm-js');
    var source = element.getAttribute('src') ? load(element.getAttribute('src')) : element.innerHTML;
    try {
      ohm.makeGrammars(source, this);
    } catch (e) {}
    return this;
  },

  make: function(recipe) {
    return recipe(ohm, this);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Namespace;

