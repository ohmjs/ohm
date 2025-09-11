import {assert} from './common.js';
import * as errors from './errors.js';
import * as util from './util.js';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

export class Interval {
  constructor(sourceString, startIdx, endIdx) {
    // Store the full source in a non-enumerable property, so that when
    // grammars and other objects are printed in the REPL, it's not
    // cluttered with multiple copies of the same long string.
    Object.defineProperty(this, '_sourceString', {
      value: sourceString,
      configurable: false,
      enumerable: false,
      writable: false,
    });
    this.startIdx = startIdx;
    this.endIdx = endIdx;
  }

  get sourceString() {
    return this._sourceString;
  }

  get contents() {
    if (this._contents === undefined) {
      this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
    }
    return this._contents;
  }

  get length() {
    return this.endIdx - this.startIdx;
  }

  coverageWith(...intervals) {
    return Interval.coverage(...intervals, this);
  }

  collapsedLeft() {
    return new Interval(this.sourceString, this.startIdx, this.startIdx);
  }

  collapsedRight() {
    return new Interval(this.sourceString, this.endIdx, this.endIdx);
  }

  getLineAndColumn() {
    return util.getLineAndColumn(this.sourceString, this.startIdx);
  }

  getLineAndColumnMessage() {
    const range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
  }

  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus(that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
      // `this` and `that` are the same interval!
      return [];
    } else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
      // `that` splits `this` into two intervals
      return [
        new Interval(this.sourceString, this.startIdx, that.startIdx),
        new Interval(this.sourceString, that.endIdx, this.endIdx),
      ];
    } else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
      // `that` contains a prefix of `this`
      return [new Interval(this.sourceString, that.endIdx, this.endIdx)];
    } else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
      // `that` contains a suffix of `this`
      return [new Interval(this.sourceString, this.startIdx, that.startIdx)];
    } else {
      // `that` and `this` do not overlap
      return [this];
    }
  }

  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo(that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    }
    assert(
      this.startIdx >= that.startIdx && this.endIdx <= that.endIdx,
      'other interval does not cover this one'
    );
    return new Interval(
      this.sourceString,
      this.startIdx - that.startIdx,
      this.endIdx - that.startIdx
    );
  }

  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends.
  trimmed() {
    const {contents} = this;
    const startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    const endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.sourceString, startIdx, endIdx);
  }

  subInterval(offset, len) {
    const newStartIdx = this.startIdx + offset;
    return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
  }
}

Interval.coverage = function (firstInterval, ...intervals) {
  let {startIdx, endIdx} = firstInterval;
  for (const interval of intervals) {
    if (interval.sourceString !== firstInterval.sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, interval.startIdx);
      endIdx = Math.max(endIdx, interval.endIdx);
    }
  }
  return new Interval(firstInterval.sourceString, startIdx, endIdx);
};
