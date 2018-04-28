abstract class PExpr {
  source /* : Interval */;

  withSource(interval /* : Interval */): this {
    if (interval) {
      this.source = interval.trimmed();
    }
    return this;
  }

  /*
    Return a string representing this parsing expression.
    `e1.toString() === e2.toString()` implies that `e1` and `e2` are semantically equivalent.
    Note that this is not an iff (<==>): e.g., `(~"b" "a").toString() !== ("a").toString()`,
    even though `~"b" "a"` and `"a"` are interchangeable in any grammar, both in terms of the
    languages they accept and their arities.
  */
  abstract toString(): string;
}

export default PExpr;
