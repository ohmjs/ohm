'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var regExpCache = Object.create(null);

var IGNORE_CASE = 'i';  // Flag for the RegExp constructor

function regExpForString(s, flags) {
  if (!(s in regExpCache)) {
    var pattern = s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');  // Escape any special characters
    regExpCache[s] = new RegExp(pattern, flags);
  }
  return regExpCache[s];
}

function InputStream(source) {
  this.source = source;
  this.pos = 0;
  this.posInfos = [];
}

InputStream.prototype = {
  atEnd: function() {
    return this.pos === this.source.length;
  },

  next: function() {
    return this.source[this.pos++];
  },

  matchString: function(s, optIgnoreCase) {
    if (optIgnoreCase) {
      var substring = this.sourceSlice(this.pos, this.pos + s.length);
      var match = regExpForString(s, IGNORE_CASE).exec(substring);
      this.pos += s.length;
      return !!match;
    }
    for (var idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) {
        return false;
      }
    }
    return true;
  },

  sourceSlice: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  interval: function(startIdx, optEndIdx) {
    return new Interval(this, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;
