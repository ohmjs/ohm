// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream.js')

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Interval(source, startIdx, endIdx) {
  this.source = source
  this.startIdx = startIdx
  this.endIdx = endIdx
}

Object.defineProperties(Interval.prototype, {
  'contents': {
    get: function() {
      if (this._contents === undefined)
        this._contents = InputStream.newFor(this.source).interval(this.startIdx, this.endIdx)
      return this._contents
    },
    enumerable: true
  }
})

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval

