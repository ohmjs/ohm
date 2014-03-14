// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common.js');
var PosInfo = require('./PosInfo.js');

var awlib = require('awlib');
var objectThatDelegatesTo = awlib.objectUtils.objectThatDelegatesTo;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream() {
  throw 'InputStream cannot be instantiated -- it\'s abstract';
}

InputStream.newFor = function(obj) {
  if (typeof obj === 'string') {
    return new StringInputStream(obj);
  } else if (obj instanceof Array) {
    return new ListInputStream(obj);
  } else {
    throw 'cannot make input stream for ' + obj;
  }
};

InputStream.prototype = {
  init: function(source) {
    this.source = source;
    this.pos = 0;
    this.maxPosSeen = -1;
    this.posInfos = [];
  },

  getCurrentPosInfo: function() {
    var currPos = this.pos;
    var posInfo = this.posInfos[currPos];
    return posInfo || (this.posInfos[currPos] = new PosInfo(currPos));
  },

  atEnd: function() {
    return this.pos === this.source.length;
  },

  next: function() {
    if (this.pos > this.maxPosSeen) {
      this.maxPosSeen = this.pos;
    }
    if (this.atEnd()) {
      return common.fail;
    } else {
      return this.source[this.pos++];
    }
  },

  matchExactly: function(x) {
    return this.next() === x ? true : common.fail;
  },

  interval: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  getMaxPosSeen: function() {
    return this.maxPosSeen;
  }
};

function StringInputStream(source) {
  this.init(source);
}

StringInputStream.prototype = objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    for (var idx = 0; idx < s.length; idx++) {
      if (this.matchExactly(s[idx]) === common.fail) {
        return common.fail;
      }
    }
    return true;
  },

  matchRegExp: function(e) {
    // IMPORTANT: e must be a non-global, one-character expression, e.g., /./ and /[0-9]/
    var c = this.next();
    return c !== common.fail && e.test(c) ? true : common.fail;
  }
});

function ListInputStream(source) {
  this.init(source);
}

ListInputStream.prototype = objectThatDelegatesTo(InputStream.prototype, {
  matchString: function(s) {
    return this.matchExactly(s);
  },

  matchRegExp: function(e) {
    return this.matchExactly(e);
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;

