// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

/*
  `Failure`s represent expressions that weren't matched while parsing. They are used to generate
  error messages automatically. The interface of `Failure`s includes the collowing methods:

  - getText() : String
  - getType() : String  (one of {"description", "string", "code"})
  - isDescription() : bool
  - isStringTerminal() : bool
  - isCode() : bool
  - isFluffy() : bool
  - makeFluffy() : void
  - subsumes(Failure) : bool
*/

function isValidType(type) {
  return type === 'description' || type === 'string' || type === 'code';
}

export class Failure {
  constructor(pexpr, text, type) {
    if (!isValidType(type)) {
      throw new Error('invalid Failure type: ' + type);
    }
    this.pexpr = pexpr;
    this.text = text;
    this.type = type;
    this.fluffy = false;
  }

  getPExpr() {
    return this.pexpr;
  }

  getText() {
    return this.text;
  }

  getType() {
    return this.type;
  }

  isDescription() {
    return this.type === 'description';
  }

  isStringTerminal() {
    return this.type === 'string';
  }

  isCode() {
    return this.type === 'code';
  }

  isFluffy() {
    return this.fluffy;
  }

  makeFluffy() {
    this.fluffy = true;
  }

  clearFluffy() {
    this.fluffy = false;
  }

  subsumes(that) {
    return (
      this.getText() === that.getText() &&
      this.type === that.type &&
      (!this.isFluffy() || (this.isFluffy() && that.isFluffy()))
    );
  }

  toString() {
    return this.type === 'string' ? JSON.stringify(this.getText()) : this.getText();
  }

  clone() {
    const failure = new Failure(this.pexpr, this.text, this.type);
    if (this.isFluffy()) {
      failure.makeFluffy();
    }
    return failure;
  }

  toKey() {
    return this.toString() + '#' + this.type;
  }
}
