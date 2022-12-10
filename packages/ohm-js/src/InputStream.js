import {Interval} from './Interval.js';

const MAX_CHAR_CODE = 0xffff;

export class InputStream {
  constructor(source) {
    this.source = source;
    this.pos = 0;
    this.examinedLength = 0;
  }

  atEnd() {
    const ans = this.pos >= this.source.length;
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
    return ans;
  }

  next() {
    const ans = this.source[this.pos++];
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return ans;
  }

  nextCharCode() {
    const nextChar = this.next();
    return nextChar && nextChar.charCodeAt(0);
  }

  nextCodePoint() {
    const cp = this.source.slice(this.pos++).codePointAt(0);
    // If the code point is beyond plane 0, it takes up two characters.
    if (cp > MAX_CHAR_CODE) {
      this.pos += 1;
    }
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return cp;
  }

  matchString(s, optIgnoreCase) {
    let idx;
    if (optIgnoreCase) {
      /*
        Case-insensitive comparison is a tricky business. Some notable gotchas include the
        "Turkish I" problem (http://www.i18nguy.com/unicode/turkish-i18n.html) and the fact
        that the German Esszet (ß) turns into "SS" in upper case.

        This is intended to be a locale-invariant comparison, which means it may not obey
        locale-specific expectations (e.g. "i" => "İ").
       */
      for (idx = 0; idx < s.length; idx++) {
        const actual = this.next();
        const expected = s[idx];
        if (actual == null || actual.toUpperCase() !== expected.toUpperCase()) {
          return false;
        }
      }
      return true;
    }
    // Default is case-sensitive comparison.
    for (idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) {
        return false;
      }
    }
    return true;
  }

  sourceSlice(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  }

  interval(startIdx, optEndIdx) {
    return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
}
