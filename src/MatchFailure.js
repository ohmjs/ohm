// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function MatchFailure(pos) {
  this.pos = pos;
}

MatchFailure.prototype.toString = function() {
  return '[ohm match failure]';
};

MatchFailure.prototype.getPos = function() {
  return this.pos;
};

MatchFailure.prototype.getErrorMessage = function() {
  // TODO
  return 'oops';
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchFailure;

