var ohm = require('..');
module.exports = ohm.makeRecipe(function() {
  var decl = this.newGrammar("OperationsAndAttributes")
    .withSource("OperationsAndAttributes {\n\n  NameNoFormals =\n    name\n\n  NameAndFormals =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}")
    .withDefaultStartRule("NameNoFormals")
  return decl
    .define("NameNoFormals", [], this.app("name").withInterval(decl.sourceInterval(49, 53)))
    .define("NameAndFormals", [], this.seq(this.app("name").withInterval(decl.sourceInterval(78, 82)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(83, 90))).withInterval(decl.sourceInterval(83, 91))).withInterval(decl.sourceInterval(78, 91)))
    .define("Formals", [], this.seq(this.prim("(").withInterval(decl.sourceInterval(109, 112)), this.app("ListOf", [this.app("name").withInterval(decl.sourceInterval(120, 124)), this.prim(",").withInterval(decl.sourceInterval(126, 129))]).withInterval(decl.sourceInterval(113, 130)), this.prim(")").withInterval(decl.sourceInterval(131, 134))).withInterval(decl.sourceInterval(109, 134)))
    .define("name", [], this.seq(this.app("nameFirst").withInterval(decl.sourceInterval(159, 168)), this.star(this.app("nameRest").withInterval(decl.sourceInterval(169, 177))).withInterval(decl.sourceInterval(169, 178))).withInterval(decl.sourceInterval(159, 178)), "a name")
    .define("nameFirst", [], this.alt(this.prim("_").withInterval(decl.sourceInterval(198, 201)), this.app("letter").withInterval(decl.sourceInterval(208, 214))).withInterval(decl.sourceInterval(198, 214)))
    .define("nameRest", [], this.alt(this.prim("_").withInterval(decl.sourceInterval(233, 236)), this.app("alnum").withInterval(decl.sourceInterval(243, 248))).withInterval(decl.sourceInterval(233, 248)))
    .build();
});
