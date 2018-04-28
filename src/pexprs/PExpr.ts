export default class PExpr {
  source /* : Interval */;

  constructor() {}

  withSource(interval /* : Interval */): this {
    if (interval) {
      this.source = interval.trimmed();
    }
    return this;
  }
}
