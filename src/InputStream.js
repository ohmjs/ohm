'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream(source) {
  this.source = source;
  this.pos = 0;
  this.rightmostPos = 0;
  this.posInfos = [];
}

InputStream.prototype = {
  atEnd: function() {
    var ans = this.pos === this.source.length;
    this.rightmostPos = Math.max(this.rightmostPos, this.pos + 1);
    return ans;
  },

  next: function() {
    var ans = this.source[this.pos++];
    this.rightmostPos = Math.max(this.rightmostPos, this.pos);
    return ans;
  },

  matchString: function(s) {
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
