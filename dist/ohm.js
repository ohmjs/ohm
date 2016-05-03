(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ohm = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(function() {
  var decl = this.newGrammar("BuiltInRules")
    .withSource("BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}")
  return decl
    .define("alnum", [], this.alt(this.app("letter").withInterval(decl.sourceInterval(60, 66)), this.app("digit").withInterval(decl.sourceInterval(73, 78))).withInterval(decl.sourceInterval(60, 78)), "an alpha-numeric character")
    .define("letter", [], this.alt(this.app("lower").withInterval(decl.sourceInterval(107, 112)), this.app("upper").withInterval(decl.sourceInterval(119, 124)), this.app("unicodeLtmo").withInterval(decl.sourceInterval(131, 142))).withInterval(decl.sourceInterval(107, 142)), "a letter")
    .define("digit", [], this.range("0", "9").withInterval(decl.sourceInterval(169, 177)), "a digit")
    .define("hexDigit", [], this.alt(this.app("digit").withInterval(decl.sourceInterval(219, 224)), this.range("a", "f").withInterval(decl.sourceInterval(231, 239)), this.range("A", "F").withInterval(decl.sourceInterval(246, 254))).withInterval(decl.sourceInterval(219, 254)), "a hexadecimal digit")
    .define("ListOf", ["elem", "sep"], this.alt(this.app("NonemptyListOf", [this.param(0), this.param(1)]).withInterval(decl.sourceInterval(282, 307)), this.app("EmptyListOf", [this.param(0), this.param(1)]).withInterval(decl.sourceInterval(314, 336))).withInterval(decl.sourceInterval(282, 336)))
    .define("NonemptyListOf", ["elem", "sep"], this.seq(this.param(0), this.star(this.seq(this.param(1), this.param(0)).withInterval(decl.sourceInterval(378, 386))).withInterval(decl.sourceInterval(377, 388))).withInterval(decl.sourceInterval(372, 388)))
    .define("EmptyListOf", ["elem", "sep"], this.seq().withInterval(decl.sourceInterval(438, 438)))
    .define("listOf", ["elem", "sep"], this.alt(this.app("nonemptyListOf", [this.param(0), this.param(1)]).withInterval(decl.sourceInterval(462, 487)), this.app("emptyListOf", [this.param(0), this.param(1)]).withInterval(decl.sourceInterval(494, 516))).withInterval(decl.sourceInterval(462, 516)))
    .define("nonemptyListOf", ["elem", "sep"], this.seq(this.param(0), this.star(this.seq(this.param(1), this.param(0)).withInterval(decl.sourceInterval(558, 566))).withInterval(decl.sourceInterval(557, 568))).withInterval(decl.sourceInterval(552, 568)))
    .define("emptyListOf", ["elem", "sep"], this.seq().withInterval(decl.sourceInterval(616, 616)))
    .build();
});


},{"..":41}],2:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(function() {
  var decl = this.newGrammar("Ohm")
    .withSource("Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  \"|\"? Alt  -- define\n    | ident Formals?            \":=\" \"|\"? Alt  -- override\n    | ident Formals?            \"+=\" \"|\"? Alt  -- extend\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = Term (\"|\" Term)*\n\n  Term\n    = Seq caseName -- inline\n    | Seq\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Modifier  -- not\n    | \"&\" Modifier  -- lookahead\n    | Modifier\n\n  Modifier\n    = \"#\" Base  -- lex\n    | \"$\" Base  -- val\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | Prim \"..\" Prim                                 -- range\n    | Prim                                           -- prim\n    | \"(\" Alt \")\"                                    -- paren\n    | \"[\" Alt \"]\"                                    -- arr\n    | \"{\" \"...\"? \"}\"                                 -- obj\n    | \"{\" Props (\",\" \"...\")? \"}\"                     -- objWithProps\n\n  Prim\n    = keyword\n    | string\n    | number\n\n  Props\n    = Prop (\",\" Prop)*\n\n  Prop\n    = (name | string) \":\" Alt\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = ~keyword name\n\n  keyword\n    = \"null\" ~nameRest   -- null\n    | \"true\" ~nameRest   -- true\n    | \"false\" ~nameRest  -- false\n\n  string\n    = \"\\\"\" strChar* \"\\\"\"\n\n  strChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  number  (a number)\n    = \"-\"? digit+\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | keyword | number | operator | punctuation | string | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}")
    .withDefaultStartRule("Grammars")
  return decl
    .define("Grammars", [], this.star(this.app("Grammar").withInterval(decl.sourceInterval(24, 31))).withInterval(decl.sourceInterval(24, 32)))
    .define("Grammar", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(50, 55)), this.opt(this.app("SuperGrammar").withInterval(decl.sourceInterval(56, 68))).withInterval(decl.sourceInterval(56, 69)), this.prim("{").withInterval(decl.sourceInterval(70, 73)), this.star(this.app("Rule").withInterval(decl.sourceInterval(74, 78))).withInterval(decl.sourceInterval(74, 79)), this.prim("}").withInterval(decl.sourceInterval(80, 83))).withInterval(decl.sourceInterval(50, 83)))
    .define("SuperGrammar", [], this.seq(this.prim("<:").withInterval(decl.sourceInterval(106, 110)), this.app("ident").withInterval(decl.sourceInterval(111, 116))).withInterval(decl.sourceInterval(106, 116)))
    .define("Rule_define", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(131, 136)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(137, 144))).withInterval(decl.sourceInterval(137, 145)), this.opt(this.app("ruleDescr").withInterval(decl.sourceInterval(146, 155))).withInterval(decl.sourceInterval(146, 156)), this.prim("=").withInterval(decl.sourceInterval(157, 160)), this.opt(this.prim("|").withInterval(decl.sourceInterval(162, 165))).withInterval(decl.sourceInterval(162, 166)), this.app("Alt").withInterval(decl.sourceInterval(167, 170))).withInterval(decl.sourceInterval(131, 170)))
    .define("Rule_override", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(188, 193)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(194, 201))).withInterval(decl.sourceInterval(194, 202)), this.prim(":=").withInterval(decl.sourceInterval(214, 218)), this.opt(this.prim("|").withInterval(decl.sourceInterval(219, 222))).withInterval(decl.sourceInterval(219, 223)), this.app("Alt").withInterval(decl.sourceInterval(224, 227))).withInterval(decl.sourceInterval(188, 227)))
    .define("Rule_extend", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(247, 252)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(253, 260))).withInterval(decl.sourceInterval(253, 261)), this.prim("+=").withInterval(decl.sourceInterval(273, 277)), this.opt(this.prim("|").withInterval(decl.sourceInterval(278, 281))).withInterval(decl.sourceInterval(278, 282)), this.app("Alt").withInterval(decl.sourceInterval(283, 286))).withInterval(decl.sourceInterval(247, 286)))
    .define("Rule", [], this.alt(this.app("Rule_define").withInterval(decl.sourceInterval(131, 170)), this.app("Rule_override").withInterval(decl.sourceInterval(188, 227)), this.app("Rule_extend").withInterval(decl.sourceInterval(247, 286))).withInterval(decl.sourceInterval(131, 297)))
    .define("Formals", [], this.seq(this.prim("<").withInterval(decl.sourceInterval(315, 318)), this.app("ListOf", [this.app("ident").withInterval(decl.sourceInterval(326, 331)), this.prim(",").withInterval(decl.sourceInterval(333, 336))]).withInterval(decl.sourceInterval(319, 337)), this.prim(">").withInterval(decl.sourceInterval(338, 341))).withInterval(decl.sourceInterval(315, 341)))
    .define("Params", [], this.seq(this.prim("<").withInterval(decl.sourceInterval(358, 361)), this.app("ListOf", [this.app("Seq").withInterval(decl.sourceInterval(369, 372)), this.prim(",").withInterval(decl.sourceInterval(374, 377))]).withInterval(decl.sourceInterval(362, 378)), this.prim(">").withInterval(decl.sourceInterval(379, 382))).withInterval(decl.sourceInterval(358, 382)))
    .define("Alt", [], this.seq(this.app("Term").withInterval(decl.sourceInterval(396, 400)), this.star(this.seq(this.prim("|").withInterval(decl.sourceInterval(402, 405)), this.app("Term").withInterval(decl.sourceInterval(406, 410))).withInterval(decl.sourceInterval(402, 410))).withInterval(decl.sourceInterval(401, 412))).withInterval(decl.sourceInterval(396, 412)))
    .define("Term_inline", [], this.seq(this.app("Seq").withInterval(decl.sourceInterval(427, 430)), this.app("caseName").withInterval(decl.sourceInterval(431, 439))).withInterval(decl.sourceInterval(427, 439)))
    .define("Term", [], this.alt(this.app("Term_inline").withInterval(decl.sourceInterval(427, 439)), this.app("Seq").withInterval(decl.sourceInterval(456, 459))).withInterval(decl.sourceInterval(427, 459)))
    .define("Seq", [], this.star(this.app("Iter").withInterval(decl.sourceInterval(473, 477))).withInterval(decl.sourceInterval(473, 478)))
    .define("Iter_star", [], this.seq(this.app("Pred").withInterval(decl.sourceInterval(493, 497)), this.prim("*").withInterval(decl.sourceInterval(498, 501))).withInterval(decl.sourceInterval(493, 501)))
    .define("Iter_plus", [], this.seq(this.app("Pred").withInterval(decl.sourceInterval(517, 521)), this.prim("+").withInterval(decl.sourceInterval(522, 525))).withInterval(decl.sourceInterval(517, 525)))
    .define("Iter_opt", [], this.seq(this.app("Pred").withInterval(decl.sourceInterval(541, 545)), this.prim("?").withInterval(decl.sourceInterval(546, 549))).withInterval(decl.sourceInterval(541, 549)))
    .define("Iter", [], this.alt(this.app("Iter_star").withInterval(decl.sourceInterval(493, 501)), this.app("Iter_plus").withInterval(decl.sourceInterval(517, 525)), this.app("Iter_opt").withInterval(decl.sourceInterval(541, 549)), this.app("Pred").withInterval(decl.sourceInterval(564, 568))).withInterval(decl.sourceInterval(493, 568)))
    .define("Pred_not", [], this.seq(this.prim("~").withInterval(decl.sourceInterval(583, 586)), this.app("Modifier").withInterval(decl.sourceInterval(587, 595))).withInterval(decl.sourceInterval(583, 595)))
    .define("Pred_lookahead", [], this.seq(this.prim("&").withInterval(decl.sourceInterval(610, 613)), this.app("Modifier").withInterval(decl.sourceInterval(614, 622))).withInterval(decl.sourceInterval(610, 622)))
    .define("Pred", [], this.alt(this.app("Pred_not").withInterval(decl.sourceInterval(583, 595)), this.app("Pred_lookahead").withInterval(decl.sourceInterval(610, 622)), this.app("Modifier").withInterval(decl.sourceInterval(643, 651))).withInterval(decl.sourceInterval(583, 651)))
    .define("Modifier_lex", [], this.seq(this.prim("#").withInterval(decl.sourceInterval(670, 673)), this.app("Base").withInterval(decl.sourceInterval(674, 678))).withInterval(decl.sourceInterval(670, 678)))
    .define("Modifier_val", [], this.seq(this.prim("$").withInterval(decl.sourceInterval(693, 696)), this.app("Base").withInterval(decl.sourceInterval(697, 701))).withInterval(decl.sourceInterval(693, 701)))
    .define("Modifier", [], this.alt(this.app("Modifier_lex").withInterval(decl.sourceInterval(670, 678)), this.app("Modifier_val").withInterval(decl.sourceInterval(693, 701)), this.app("Base").withInterval(decl.sourceInterval(716, 720))).withInterval(decl.sourceInterval(670, 720)))
    .define("Base_application", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(735, 740)), this.opt(this.app("Params").withInterval(decl.sourceInterval(741, 747))).withInterval(decl.sourceInterval(741, 748)), this.not(this.alt(this.seq(this.opt(this.app("ruleDescr").withInterval(decl.sourceInterval(751, 760))).withInterval(decl.sourceInterval(751, 761)), this.prim("=").withInterval(decl.sourceInterval(762, 765))).withInterval(decl.sourceInterval(751, 765)), this.prim(":=").withInterval(decl.sourceInterval(768, 772)), this.prim("+=").withInterval(decl.sourceInterval(775, 779))).withInterval(decl.sourceInterval(751, 779))).withInterval(decl.sourceInterval(749, 780))).withInterval(decl.sourceInterval(735, 780)))
    .define("Base_range", [], this.seq(this.app("Prim").withInterval(decl.sourceInterval(803, 807)), this.prim("..").withInterval(decl.sourceInterval(808, 812)), this.app("Prim").withInterval(decl.sourceInterval(813, 817))).withInterval(decl.sourceInterval(803, 817)))
    .define("Base_prim", [], this.app("Prim").withInterval(decl.sourceInterval(865, 869)))
    .define("Base_paren", [], this.seq(this.prim("(").withInterval(decl.sourceInterval(926, 929)), this.app("Alt").withInterval(decl.sourceInterval(930, 933)), this.prim(")").withInterval(decl.sourceInterval(934, 937))).withInterval(decl.sourceInterval(926, 937)))
    .define("Base_arr", [], this.seq(this.prim("[").withInterval(decl.sourceInterval(988, 991)), this.app("Alt").withInterval(decl.sourceInterval(992, 995)), this.prim("]").withInterval(decl.sourceInterval(996, 999))).withInterval(decl.sourceInterval(988, 999)))
    .define("Base_obj", [], this.seq(this.prim("{").withInterval(decl.sourceInterval(1048, 1051)), this.opt(this.prim("...").withInterval(decl.sourceInterval(1052, 1057))).withInterval(decl.sourceInterval(1052, 1058)), this.prim("}").withInterval(decl.sourceInterval(1059, 1062))).withInterval(decl.sourceInterval(1048, 1062)))
    .define("Base_objWithProps", [], this.seq(this.prim("{").withInterval(decl.sourceInterval(1108, 1111)), this.app("Props").withInterval(decl.sourceInterval(1112, 1117)), this.opt(this.seq(this.prim(",").withInterval(decl.sourceInterval(1119, 1122)), this.prim("...").withInterval(decl.sourceInterval(1123, 1128))).withInterval(decl.sourceInterval(1119, 1128))).withInterval(decl.sourceInterval(1118, 1130)), this.prim("}").withInterval(decl.sourceInterval(1131, 1134))).withInterval(decl.sourceInterval(1108, 1134)))
    .define("Base", [], this.alt(this.app("Base_application").withInterval(decl.sourceInterval(735, 780)), this.app("Base_range").withInterval(decl.sourceInterval(803, 817)), this.app("Base_prim").withInterval(decl.sourceInterval(865, 869)), this.app("Base_paren").withInterval(decl.sourceInterval(926, 937)), this.app("Base_arr").withInterval(decl.sourceInterval(988, 999)), this.app("Base_obj").withInterval(decl.sourceInterval(1048, 1062)), this.app("Base_objWithProps").withInterval(decl.sourceInterval(1108, 1134))).withInterval(decl.sourceInterval(735, 1170)))
    .define("Prim", [], this.alt(this.app("keyword").withInterval(decl.sourceInterval(1185, 1192)), this.app("string").withInterval(decl.sourceInterval(1199, 1205)), this.app("number").withInterval(decl.sourceInterval(1212, 1218))).withInterval(decl.sourceInterval(1185, 1218)))
    .define("Props", [], this.seq(this.app("Prop").withInterval(decl.sourceInterval(1234, 1238)), this.star(this.seq(this.prim(",").withInterval(decl.sourceInterval(1240, 1243)), this.app("Prop").withInterval(decl.sourceInterval(1244, 1248))).withInterval(decl.sourceInterval(1240, 1248))).withInterval(decl.sourceInterval(1239, 1250))).withInterval(decl.sourceInterval(1234, 1250)))
    .define("Prop", [], this.seq(this.alt(this.app("name").withInterval(decl.sourceInterval(1266, 1270)), this.app("string").withInterval(decl.sourceInterval(1273, 1279))).withInterval(decl.sourceInterval(1266, 1279)), this.prim(":").withInterval(decl.sourceInterval(1281, 1284)), this.app("Alt").withInterval(decl.sourceInterval(1285, 1288))).withInterval(decl.sourceInterval(1265, 1288)))
    .define("ruleDescr", [], this.seq(this.prim("(").withInterval(decl.sourceInterval(1330, 1333)), this.app("ruleDescrText").withInterval(decl.sourceInterval(1334, 1347)), this.prim(")").withInterval(decl.sourceInterval(1348, 1351))).withInterval(decl.sourceInterval(1330, 1351)), "a rule description")
    .define("ruleDescrText", [], this.star(this.seq(this.not(this.prim(")").withInterval(decl.sourceInterval(1377, 1380))).withInterval(decl.sourceInterval(1376, 1380)), this.app("any").withInterval(decl.sourceInterval(1381, 1384))).withInterval(decl.sourceInterval(1376, 1384))).withInterval(decl.sourceInterval(1375, 1386)))
    .define("caseName", [], this.seq(this.prim("--").withInterval(decl.sourceInterval(1405, 1409)), this.star(this.seq(this.not(this.prim("\n").withInterval(decl.sourceInterval(1412, 1416))).withInterval(decl.sourceInterval(1411, 1416)), this.app("space").withInterval(decl.sourceInterval(1417, 1422))).withInterval(decl.sourceInterval(1411, 1422))).withInterval(decl.sourceInterval(1410, 1424)), this.app("name").withInterval(decl.sourceInterval(1425, 1429)), this.star(this.seq(this.not(this.prim("\n").withInterval(decl.sourceInterval(1432, 1436))).withInterval(decl.sourceInterval(1431, 1436)), this.app("space").withInterval(decl.sourceInterval(1437, 1442))).withInterval(decl.sourceInterval(1431, 1442))).withInterval(decl.sourceInterval(1430, 1444)), this.alt(this.prim("\n").withInterval(decl.sourceInterval(1446, 1450)), this.la(this.prim("}").withInterval(decl.sourceInterval(1454, 1457))).withInterval(decl.sourceInterval(1453, 1457))).withInterval(decl.sourceInterval(1446, 1457))).withInterval(decl.sourceInterval(1405, 1458)))
    .define("name", [], this.seq(this.app("nameFirst").withInterval(decl.sourceInterval(1483, 1492)), this.star(this.app("nameRest").withInterval(decl.sourceInterval(1493, 1501))).withInterval(decl.sourceInterval(1493, 1502))).withInterval(decl.sourceInterval(1483, 1502)), "a name")
    .define("nameFirst", [], this.alt(this.prim("_").withInterval(decl.sourceInterval(1522, 1525)), this.app("letter").withInterval(decl.sourceInterval(1532, 1538))).withInterval(decl.sourceInterval(1522, 1538)))
    .define("nameRest", [], this.alt(this.prim("_").withInterval(decl.sourceInterval(1557, 1560)), this.app("alnum").withInterval(decl.sourceInterval(1567, 1572))).withInterval(decl.sourceInterval(1557, 1572)))
    .define("ident", [], this.seq(this.not(this.app("keyword").withInterval(decl.sourceInterval(1606, 1613))).withInterval(decl.sourceInterval(1605, 1613)), this.app("name").withInterval(decl.sourceInterval(1614, 1618))).withInterval(decl.sourceInterval(1605, 1618)), "an identifier")
    .define("keyword_null", [], this.seq(this.prim("null").withInterval(decl.sourceInterval(1636, 1642)), this.not(this.app("nameRest").withInterval(decl.sourceInterval(1644, 1652))).withInterval(decl.sourceInterval(1643, 1652))).withInterval(decl.sourceInterval(1636, 1652)))
    .define("keyword_true", [], this.seq(this.prim("true").withInterval(decl.sourceInterval(1669, 1675)), this.not(this.app("nameRest").withInterval(decl.sourceInterval(1677, 1685))).withInterval(decl.sourceInterval(1676, 1685))).withInterval(decl.sourceInterval(1669, 1685)))
    .define("keyword_false", [], this.seq(this.prim("false").withInterval(decl.sourceInterval(1702, 1709)), this.not(this.app("nameRest").withInterval(decl.sourceInterval(1711, 1719))).withInterval(decl.sourceInterval(1710, 1719))).withInterval(decl.sourceInterval(1702, 1719)))
    .define("keyword", [], this.alt(this.app("keyword_null").withInterval(decl.sourceInterval(1636, 1652)), this.app("keyword_true").withInterval(decl.sourceInterval(1669, 1685)), this.app("keyword_false").withInterval(decl.sourceInterval(1702, 1719))).withInterval(decl.sourceInterval(1636, 1729)))
    .define("string", [], this.seq(this.prim("\"").withInterval(decl.sourceInterval(1746, 1750)), this.star(this.app("strChar").withInterval(decl.sourceInterval(1751, 1758))).withInterval(decl.sourceInterval(1751, 1759)), this.prim("\"").withInterval(decl.sourceInterval(1760, 1764))).withInterval(decl.sourceInterval(1746, 1764)))
    .define("strChar", [], this.alt(this.app("escapeChar").withInterval(decl.sourceInterval(1782, 1792)), this.seq(this.not(this.prim("\\").withInterval(decl.sourceInterval(1800, 1804))).withInterval(decl.sourceInterval(1799, 1804)), this.not(this.prim("\"").withInterval(decl.sourceInterval(1806, 1810))).withInterval(decl.sourceInterval(1805, 1810)), this.not(this.prim("\n").withInterval(decl.sourceInterval(1812, 1816))).withInterval(decl.sourceInterval(1811, 1816)), this.app("any").withInterval(decl.sourceInterval(1817, 1820))).withInterval(decl.sourceInterval(1799, 1820))).withInterval(decl.sourceInterval(1782, 1820)))
    .define("escapeChar_backslash", [], this.prim("\\\\").withInterval(decl.sourceInterval(1863, 1869)))
    .define("escapeChar_doubleQuote", [], this.prim("\\\"").withInterval(decl.sourceInterval(1925, 1931)))
    .define("escapeChar_singleQuote", [], this.prim("\\'").withInterval(decl.sourceInterval(1989, 1995)))
    .define("escapeChar_backspace", [], this.prim("\\b").withInterval(decl.sourceInterval(2053, 2058)))
    .define("escapeChar_lineFeed", [], this.prim("\\n").withInterval(decl.sourceInterval(2115, 2120)))
    .define("escapeChar_carriageReturn", [], this.prim("\\r").withInterval(decl.sourceInterval(2176, 2181)))
    .define("escapeChar_tab", [], this.prim("\\t").withInterval(decl.sourceInterval(2243, 2248)))
    .define("escapeChar_unicodeEscape", [], this.seq(this.prim("\\u").withInterval(decl.sourceInterval(2299, 2304)), this.app("hexDigit").withInterval(decl.sourceInterval(2305, 2313)), this.app("hexDigit").withInterval(decl.sourceInterval(2314, 2322)), this.app("hexDigit").withInterval(decl.sourceInterval(2323, 2331)), this.app("hexDigit").withInterval(decl.sourceInterval(2332, 2340))).withInterval(decl.sourceInterval(2299, 2340)))
    .define("escapeChar_hexEscape", [], this.seq(this.prim("\\x").withInterval(decl.sourceInterval(2365, 2370)), this.app("hexDigit").withInterval(decl.sourceInterval(2371, 2379)), this.app("hexDigit").withInterval(decl.sourceInterval(2380, 2388))).withInterval(decl.sourceInterval(2365, 2388)))
    .define("escapeChar", [], this.alt(this.app("escapeChar_backslash").withInterval(decl.sourceInterval(1863, 1869)), this.app("escapeChar_doubleQuote").withInterval(decl.sourceInterval(1925, 1931)), this.app("escapeChar_singleQuote").withInterval(decl.sourceInterval(1989, 1995)), this.app("escapeChar_backspace").withInterval(decl.sourceInterval(2053, 2058)), this.app("escapeChar_lineFeed").withInterval(decl.sourceInterval(2115, 2120)), this.app("escapeChar_carriageReturn").withInterval(decl.sourceInterval(2176, 2181)), this.app("escapeChar_tab").withInterval(decl.sourceInterval(2243, 2248)), this.app("escapeChar_unicodeEscape").withInterval(decl.sourceInterval(2299, 2340)), this.app("escapeChar_hexEscape").withInterval(decl.sourceInterval(2365, 2388))).withInterval(decl.sourceInterval(1863, 2420)), "an escape sequence")
    .define("number", [], this.seq(this.opt(this.prim("-").withInterval(decl.sourceInterval(2449, 2452))).withInterval(decl.sourceInterval(2449, 2453)), this.plus(this.app("digit").withInterval(decl.sourceInterval(2454, 2459))).withInterval(decl.sourceInterval(2454, 2460))).withInterval(decl.sourceInterval(2449, 2460)), "a number")
    .extend("space", [], this.app("comment").withInterval(decl.sourceInterval(2476, 2483)))
    .define("comment_singleLine", [], this.seq(this.prim("//").withInterval(decl.sourceInterval(2501, 2505)), this.star(this.seq(this.not(this.prim("\n").withInterval(decl.sourceInterval(2508, 2512))).withInterval(decl.sourceInterval(2507, 2512)), this.app("any").withInterval(decl.sourceInterval(2513, 2516))).withInterval(decl.sourceInterval(2507, 2516))).withInterval(decl.sourceInterval(2506, 2518)), this.prim("\n").withInterval(decl.sourceInterval(2519, 2523))).withInterval(decl.sourceInterval(2501, 2523)))
    .define("comment_multiLine", [], this.seq(this.prim("/*").withInterval(decl.sourceInterval(2545, 2549)), this.star(this.seq(this.not(this.prim("*/").withInterval(decl.sourceInterval(2552, 2556))).withInterval(decl.sourceInterval(2551, 2556)), this.app("any").withInterval(decl.sourceInterval(2557, 2560))).withInterval(decl.sourceInterval(2551, 2560))).withInterval(decl.sourceInterval(2550, 2562)), this.prim("*/").withInterval(decl.sourceInterval(2563, 2567))).withInterval(decl.sourceInterval(2545, 2567)))
    .define("comment", [], this.alt(this.app("comment_singleLine").withInterval(decl.sourceInterval(2501, 2523)), this.app("comment_multiLine").withInterval(decl.sourceInterval(2545, 2567))).withInterval(decl.sourceInterval(2501, 2581)))
    .define("tokens", [], this.star(this.app("token").withInterval(decl.sourceInterval(2594, 2599))).withInterval(decl.sourceInterval(2594, 2600)))
    .define("token", [], this.alt(this.app("caseName").withInterval(decl.sourceInterval(2612, 2620)), this.app("comment").withInterval(decl.sourceInterval(2623, 2630)), this.app("ident").withInterval(decl.sourceInterval(2633, 2638)), this.app("keyword").withInterval(decl.sourceInterval(2641, 2648)), this.app("number").withInterval(decl.sourceInterval(2651, 2657)), this.app("operator").withInterval(decl.sourceInterval(2660, 2668)), this.app("punctuation").withInterval(decl.sourceInterval(2671, 2682)), this.app("string").withInterval(decl.sourceInterval(2685, 2691)), this.app("any").withInterval(decl.sourceInterval(2694, 2697))).withInterval(decl.sourceInterval(2612, 2697)))
    .define("operator", [], this.alt(this.prim("<:").withInterval(decl.sourceInterval(2712, 2716)), this.prim("=").withInterval(decl.sourceInterval(2719, 2722)), this.prim(":=").withInterval(decl.sourceInterval(2725, 2729)), this.prim("+=").withInterval(decl.sourceInterval(2732, 2736)), this.prim("*").withInterval(decl.sourceInterval(2739, 2742)), this.prim("+").withInterval(decl.sourceInterval(2745, 2748)), this.prim("?").withInterval(decl.sourceInterval(2751, 2754)), this.prim("~").withInterval(decl.sourceInterval(2757, 2760)), this.prim("&").withInterval(decl.sourceInterval(2763, 2766))).withInterval(decl.sourceInterval(2712, 2766)))
    .define("punctuation", [], this.alt(this.prim("<").withInterval(decl.sourceInterval(2784, 2787)), this.prim(">").withInterval(decl.sourceInterval(2790, 2793)), this.prim(",").withInterval(decl.sourceInterval(2796, 2799)), this.prim("--").withInterval(decl.sourceInterval(2802, 2806))).withInterval(decl.sourceInterval(2784, 2806)))
    .build();
});


},{"..":41}],3:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(function() {
  var decl = this.newGrammar("OperationsAndAttributes")
    .withSource("OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}")
    .withDefaultStartRule("AttributeSignature")
  return decl
    .define("AttributeSignature", [], this.app("name").withInterval(decl.sourceInterval(54, 58)))
    .define("OperationSignature", [], this.seq(this.app("name").withInterval(decl.sourceInterval(87, 91)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(92, 99))).withInterval(decl.sourceInterval(92, 100))).withInterval(decl.sourceInterval(87, 100)))
    .define("Formals", [], this.seq(this.prim("(").withInterval(decl.sourceInterval(118, 121)), this.app("ListOf", [this.app("name").withInterval(decl.sourceInterval(129, 133)), this.prim(",").withInterval(decl.sourceInterval(135, 138))]).withInterval(decl.sourceInterval(122, 139)), this.prim(")").withInterval(decl.sourceInterval(140, 143))).withInterval(decl.sourceInterval(118, 143)))
    .define("name", [], this.seq(this.app("nameFirst").withInterval(decl.sourceInterval(168, 177)), this.star(this.app("nameRest").withInterval(decl.sourceInterval(178, 186))).withInterval(decl.sourceInterval(178, 187))).withInterval(decl.sourceInterval(168, 187)), "a name")
    .define("nameFirst", [], this.alt(this.prim("_").withInterval(decl.sourceInterval(207, 210)), this.app("letter").withInterval(decl.sourceInterval(217, 223))).withInterval(decl.sourceInterval(207, 223)))
    .define("nameRest", [], this.alt(this.prim("_").withInterval(decl.sourceInterval(242, 245)), this.app("alnum").withInterval(decl.sourceInterval(252, 257))).withInterval(decl.sourceInterval(242, 257)))
    .build();
});


},{"..":41}],4:[function(require,module,exports){
'use strict';

module.exports = {
  toAST: require('./semantics-toAST').helper,
  semanticsForToAST: require('./semantics-toAST').semantics
};

},{"./semantics-toAST":5}],5:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('../src/pexprs');
var MatchResult = require('../src/MatchResult');
var Grammar = require('../src/Grammar');
var extend = require('util-extend');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var defaultOperation = {
  _terminal: function() {
    return this.primitiveValue;
  },

  _nonterminal: function(children) {
    var ctorName = this._node.ctorName;
    var mapping = this.args.mapping;

    // without customization
    if (!mapping.hasOwnProperty(ctorName)) {
      // intermediate node
      if (this._node instanceof pexprs.Alt || this._node instanceof pexprs.Apply) {
        return children[0].toAST(mapping);
      }

      // lexical rule
      if (this.isLexical()) {
        return this.interval.contents;
      }

      // singular node (e.g. only surrounded by literals or lookaheads)
      var realChildren = children.filter(function(child) {
        return !child.isTerminal();
      });
      if (realChildren.length === 1) {
        return realChildren[0].toAST(mapping);
      }

      // rest: terms with multiple children
    }

    // direct forward
    if (typeof mapping[ctorName] === 'number') {
      return children[mapping[ctorName]].toAST(mapping);
    }

    // named/mapped children or unnamed children ('0', '1', '2', ...)
    var propMap = mapping[ctorName] || children;
    var node = {
      type: ctorName
    };
    for (var prop in propMap) {
      var mappedProp = mapping[ctorName] && mapping[ctorName][prop];
      if (typeof mappedProp === 'number') {
        // direct forward
        node[prop] = children[mappedProp].toAST(mapping);
      } else if ((typeof mappedProp === 'string') || (typeof mappedProp === 'boolean') ||
          (mappedProp === null)) {
        // primitive value
        node[prop] = mappedProp;
      } else if ((typeof mappedProp === 'object') && (mappedProp instanceof Number)) {
        // primitive number (must be unboxed)
        node[prop] = Number(mappedProp);
      } else if (typeof mappedProp === 'function') {
        // computed value
        node[prop] = mappedProp.call(this, children);
      } else if (mappedProp === undefined) {
        if (children[prop] && !children[prop].isTerminal()) {
          node[prop] = children[prop].toAST(mapping);
        } else {
          // delete predefined 'type' properties, like 'type', if explicitely removed
          delete node[prop];
        }
      }
    }
    return node;
  },

  _iter: function(children) {
    if (this._node.isOptional()) {
      if (this.numChildren === 0) {
        return null;
      } else {
        return children[0].toAST(this.args.mapping);
      }
    }

    return children.map(function(child) {
      return child.toAST(this.args.mapping);
    }, this);
  },

  NonemptyListOf: function(first, sep, rest) {
    return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
  },

  EmptyListOf: function() {
    return [];
  }
};

// Returns a plain JavaScript object that includes an abstract syntax tree (AST)
// for the given match result `res` containg a concrete syntax tree (CST) and grammar.
// The optional `mapping` parameter can be used to customize how the nodes of the CST
// are mapped to the AST (see /doc/extras.md#toastmatchresult-mapping).
function toAST(res, mapping) {
  if (!(res instanceof MatchResult) || res.failed()) {
    throw new Error('toAST() expects a succesfull MatchResult as first parameter');
  }

  mapping = extend({}, mapping);
  var operation = extend({}, defaultOperation);
  for (var termName in mapping) {
    if (typeof mapping[termName] === 'function') {
      operation[termName] = mapping[termName];
      delete mapping[termName];
    }
  }
  var g = res._cst.grammar;
  var s = g.semantics().addOperation('toAST(mapping)', operation);
  return s(res).toAST(mapping);
}

// Returns a semantics containg the toAST(mapping) operation for the given grammar g.
function semanticsForToAST(g) {
  if (!(g instanceof Grammar)) {
    throw new Error('semanticsToAST() expects a Grammar as parameter');
  }

  return g.semantics().addOperation('toAST(mapping)', defaultOperation);
}

module.exports = {
  helper: toAST,
  semantics: semanticsForToAST
};

},{"../src/Grammar":29,"../src/MatchResult":33,"../src/pexprs":60,"util-extend":26}],6:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":7,"./polyfill":22}],7:[function(require,module,exports){
'use strict';

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }
	if (typeof Symbol.iterator === 'symbol') return true;

	// Return 'true' for polyfills
	if (typeof Symbol.isConcatSpreadable !== 'object') return false;
	if (typeof Symbol.iterator !== 'object') return false;
	if (typeof Symbol.toPrimitive !== 'object') return false;
	if (typeof Symbol.toStringTag !== 'object') return false;
	if (typeof Symbol.unscopables !== 'object') return false;

	return true;
};

},{}],8:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
};

},{}],9:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":10,"es5-ext/object/is-callable":13,"es5-ext/object/normalize-options":17,"es5-ext/string/#/contains":19}],10:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":11,"./shim":12}],11:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],12:[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":14,"../valid-value":18}],13:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],14:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":15,"./shim":16}],15:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],16:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],17:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{}],18:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],19:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":20,"./shim":21}],20:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],21:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],22:[function(require,module,exports){
'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , Symbol, HiddenSymbol, globalSymbols = create(null);

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			defineProperty(this, name, d(value));
		}));
		return name;
	};
}());

HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
	return Symbol(description);
};
module.exports = Symbol = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(Symbol, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = Symbol(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),
	hasInstance: d('', Symbol('hasInstance')),
	isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
	iterator: d('', Symbol('iterator')),
	match: d('', Symbol('match')),
	replace: d('', Symbol('replace')),
	search: d('', Symbol('search')),
	species: d('', Symbol('species')),
	split: d('', Symbol('split')),
	toPrimitive: d('', Symbol('toPrimitive')),
	toStringTag: d('', Symbol('toStringTag')),
	unscopables: d('', Symbol('unscopables'))
});
defineProperties(HiddenSymbol.prototype, {
	constructor: d(Symbol),
	toString: d('', function () { return this.__name__; })
});

defineProperties(Symbol.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
	function () { return validateSymbol(this); }));
defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));

defineProperty(HiddenSymbol.prototype, Symbol.toPrimitive,
	d('c', Symbol.prototype[Symbol.toPrimitive]));
defineProperty(HiddenSymbol.prototype, Symbol.toStringTag,
	d('c', Symbol.prototype[Symbol.toStringTag]));

},{"./validate-symbol":23,"d":9}],23:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":8}],24:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],25:[function(require,module,exports){
/**
 * Determine if an object is Buffer
 *
 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * License:  MIT
 *
 * `npm install is-buffer`
 */

module.exports = function (obj) {
  return !!(
    obj != null &&
    obj.constructor &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  )
}

},{}],26:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = extend;
function extend(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || typeof add !== 'object') return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
}

},{}],27:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var GrammarDecl = require('./GrammarDecl');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Builder() {}

Builder.prototype = {
  newGrammar: function(name) {
    return new GrammarDecl(name);
  },

  prim: function(x) {
    return new pexprs.Prim(x);
  },

  range: function(from, to) {
    return new pexprs.Range(from, to);
  },

  param: function(index) {
    return new pexprs.Param(index);
  },

  alt: function(/* term1, term1, ... */) {
    var terms = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
      if (arg instanceof pexprs.Alt) {
        terms = terms.concat(arg.terms);
      } else {
        terms.push(arg);
      }
    }
    return terms.length === 1 ? terms[0] : new pexprs.Alt(terms);
  },

  seq: function(/* factor1, factor2, ... */) {
    var factors = [];
    for (var idx = 0; idx < arguments.length; idx++) {
      var arg = arguments[idx];
      if (arg instanceof pexprs.Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
  },

  star: function(expr) {
    return new pexprs.Star(expr);
  },

  plus: function(expr) {
    return new pexprs.Plus(expr);
  },

  opt: function(expr) {
    return new pexprs.Opt(expr);
  },

  not: function(expr) {
    return new pexprs.Not(expr);
  },

  la: function(expr) {
    return new pexprs.Lookahead(expr);
  },

  lex: function(expr) {
    return new pexprs.Lex(expr);
  },

  val: function(expr) {
    return new pexprs.Value(expr);
  },

  arr: function(expr) {
    return new pexprs.Arr(expr);
  },

  str: function(expr) {
    return new pexprs.Str(expr);
  },

  obj: function(properties, isLenient) {
    return new pexprs.Obj(properties, !!isLenient);
  },

  app: function(ruleName, optParams) {
    return new pexprs.Apply(ruleName, optParams);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;

},{"./GrammarDecl":30,"./pexprs":60}],28:[function(require,module,exports){
'use strict';

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

function Failure(text, type) {
  if (!isValidType(type)) {
    throw new Error('invalid Failure type: ' + type);
  }

  this.text = text;
  this.type = type;
  this.fluffy = false;
}

Failure.prototype.getText = function() {
  return this.text;
};

Failure.prototype.getType = function() {
  return this.type;
};

Failure.prototype.isDescription = function() {
  return this.type === 'description';
};

Failure.prototype.isStringTerminal = function() {
  return this.type === 'string';
};

Failure.prototype.isCode = function() {
  return this.type === 'code';
};

Failure.prototype.isFluffy = function() {
  return this.fluffy;
};

Failure.prototype.makeFluffy = function() {
  this.fluffy = true;
};

Failure.prototype.clearFluffy = function() {
  this.fluffy = false;
};

Failure.prototype.subsumes = function(that) {
  return this.getText() === that.getText() &&
      this.type === that.type &&
      (!this.isFluffy() || this.isFluffy() && that.isFluffy());
};

Failure.prototype.toString = function() {
  return this.type === 'string' ?
    JSON.stringify(this.getText()) :
    this.getText();
};

Failure.prototype.clone = function() {
  var failure = new Failure(this.text, this.type);
  if (this.isFluffy()) {
    failure.makeFluffy();
  }
  return failure;
};

Failure.prototype.toKey = function() {
  return this.toString() + '#' + this.type;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Failure;

},{}],29:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var MatchResult = require('./MatchResult');
var Semantics = require('./Semantics');
var State = require('./State');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Grammar(
    name,
    superGrammar,
    ruleBodies,
    ruleFormals,
    ruleDescriptions,
    optDefaultStartRule) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.ruleBodies = ruleBodies;
  this.ruleFormals = ruleFormals;
  this.ruleDescriptions = ruleDescriptions;
  if (optDefaultStartRule) {
    if (!(optDefaultStartRule in ruleBodies)) {
      throw new Error("Invalid start rule: '" + optDefaultStartRule +
                      "' is not a rule in grammar '" + name + "'");
    }
    this.defaultStartRule = optDefaultStartRule;
  }
  this.constructors = this.ctors = this.createConstructors();
}

var ohmGrammar;
var buildGrammar;

// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function(grammar, builderFn) {
  ohmGrammar = grammar;
  buildGrammar = builderFn;
};

Grammar.prototype = {
  construct: function(ruleName, children) {
    var body = this.ruleBodies[ruleName];
    if (!body) {
      throw errors.undeclaredRule(ruleName, this.name);
    }

    var ans = this._constructByMatching(ruleName, children);
    if (!ans) {
      throw errors.invalidConstructorCall(this, ruleName, children);
    }
    return ans;
  },

  // Try to match `ctorArgs` with the body of the rule given by `ruleName`.
  // Return the resulting CST node if it succeeds, otherwise return null.
  _constructByMatching: function(ruleName, ctorArgs) {
    var state = this._match(ctorArgs, {startApplication: ruleName, matchNodes: true});
    if (state.bindings.length > 0) {
      return state.bindings[0];
    }
    return null;
  },

  createConstructors: function() {
    var self = this;
    var constructors = {};

    function makeConstructor(ruleName) {
      return function(/* val1, val2, ... */) {
        return self.construct(ruleName, Array.prototype.slice.call(arguments));
      };
    }

    for (var ruleName in this.ruleBodies) {
      // We want *all* properties, not just own properties, because of
      // supergrammars.
      constructors[ruleName] = makeConstructor(ruleName);
    }
    return constructors;
  },

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn: function() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  _match: function(values, opts) {
    var state = new State(this, values, opts);
    state.evalFromStart();
    return state;
  },

  match: function(obj, optStartApplication) {
    var state = this._match([obj], {startApplication: optStartApplication});
    return MatchResult.newFor(state);
  },

  trace: function(obj, optStartApplication) {
    var state = this._match([obj], {startApplication: optStartApplication, trace: true});

    // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.
    var rootTrace = state.trace[state.trace.length - 1];
    rootTrace.state = state;
    rootTrace.result = MatchResult.newFor(state);
    return rootTrace;
  },

  semantics: function() {
    return Semantics.createSemantics(this);
  },

  extendSemantics: function(superSemantics) {
    return Semantics.createSemantics(this, superSemantics._getSemantics());
  },

  // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
  // a function of the correct arity. If not, throw an exception.
  _checkTopDownActionDict: function(what, name, actionDict) {
    function isSpecialAction(a) {
      return a === '_iter' || a === '_terminal' || a === '_nonterminal' || a === '_default';
    }

    var problems = [];
    for (var k in actionDict) {
      var v = actionDict[k];
      if (!isSpecialAction(k) && !(k in this.ruleBodies)) {
        problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
      } else if (typeof v !== 'function') {
        problems.push(
            "'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
      } else {
        var actual = v.length;
        var expected = this._topDownActionArity(k);
        if (actual !== expected) {
          problems.push(
              "Semantic action '" + k + "' has the wrong arity: " +
              'expected ' + expected + ', got ' + actual);
        }
      }
    }
    if (problems.length > 0) {
      var prettyProblems = problems.map(function(problem) { return '- ' + problem; });
      var error = new Error(
          "Found errors in the action dictionary of the '" + name + "' " + what + ':\n' +
          prettyProblems.join('\n'));
      error.problems = problems;
      throw error;
    }
  },

  // Return the expected arity for a semantic action named `actionName`, which
  // is either a rule name or a special action name like '_nonterminal'.
  _topDownActionArity: function(actionName) {
    if (actionName === '_iter' || actionName === '_nonterminal' || actionName === '_default') {
      return 1;
    } else if (actionName === '_terminal') {
      return 0;
    }
    return this.ruleBodies[actionName].getArity();
  },

  _inheritsFrom: function(grammar) {
    var g = this.superGrammar;
    while (g) {
      if (g === grammar) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  },

  toRecipe: function(optVarName) {
    if (this.isBuiltIn()) {
      throw new Error(
          'Why would anyone want to generate a recipe for the ' + this.name + ' grammar?!?!');
    }
    var sb = new common.StringBuffer();
    if (optVarName) {
      sb.append('var ' + optVarName + ' = ');
    }
    sb.append('(function() {\n');

    // Include the supergrammar in the recipe if it's not a built-in grammar.
    var superGrammarDecl = '';
    if (!this.superGrammar.isBuiltIn()) {
      sb.append(this.superGrammar.toRecipe('buildSuperGrammar'));
      superGrammarDecl = '    .withSuperGrammar(buildSuperGrammar.call(this))\n';
    }
    sb.append('  var decl = this.newGrammar(' + JSON.stringify(this.name) + ')\n');

    // Include the grammar source if it is available.
    if (this.definitionInterval) {
      sb.append('    .withSource(' + JSON.stringify(this.definitionInterval.contents) + ')\n');
    }
    sb.append(superGrammarDecl);

    if (this.defaultStartRule) {
      sb.append('    .withDefaultStartRule("' + this.defaultStartRule + '")\n');
    }
    sb.append('  return decl\n');

    var self = this;
    Object.keys(this.ruleBodies).forEach(function(ruleName) {
      var body = self.ruleBodies[ruleName];
      sb.append('    .');
      if (self.superGrammar.ruleBodies[ruleName]) {
        sb.append(body instanceof pexprs.Extend ? 'extend' : 'override');
      } else {
        sb.append('define');
      }
      var formals = self.ruleFormals[ruleName];
      var formalsString = '[' + formals.map(JSON.stringify).join(', ') + ']';
      sb.append('(' + JSON.stringify(ruleName) + ', ' + formalsString + ', ');
      body.outputRecipe(sb, formals, self.definitionInterval);

      if (!self.superGrammar.ruleBodies[ruleName] && self.ruleDescriptions[ruleName]) {
        sb.append(', ' + JSON.stringify(self.ruleDescriptions[ruleName]));
      }
      sb.append(')\n');
    });
    sb.append('    .build();\n});\n');
    return sb.contents();
  },

  // TODO: Come up with better names for these methods.
  // TODO: Write the analog of these methods for inherited attributes.
  toOperationActionDictionaryTemplate: function() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },
  toAttributeActionDictionaryTemplate: function() {
    return this._toOperationOrAttributeActionDictionaryTemplate();
  },

  _toOperationOrAttributeActionDictionaryTemplate: function() {
    // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
    // should appear next to other cases of AddExpr.

    var sb = new common.StringBuffer();
    sb.append('{');

    var first = true;
    for (var ruleName in this.ruleBodies) {
      var body = this.ruleBodies[ruleName];
      if (first) {
        first = false;
      } else {
        sb.append(',');
      }
      sb.append('\n');
      sb.append('  ');
      this.addSemanticActionTemplate(ruleName, body, sb);
    }

    sb.append('\n}');
    return sb.contents();
  },

  addSemanticActionTemplate: function(ruleName, body, sb) {
    sb.append(ruleName);
    sb.append(': function(');
    var arity = this._topDownActionArity(ruleName);
    sb.append(common.repeat('_', arity).join(', '));
    sb.append(') {\n');
    sb.append('  }');
  },

  // Parse a string which expresses a rule application in this grammar, and return the
  // resulting Apply node.
  parseApplication: function(str) {
    var app;
    if (str.indexOf('<') === -1) {
      // simple application
      app = new pexprs.Apply(str);
    } else {
      // parameterized application
      var cst = ohmGrammar.match(str, 'Base_application');
      app = buildGrammar(cst, {});
    }

    // Ensure that the application is valid.
    if (!(app.ruleName in this.ruleBodies)) {
      throw errors.undeclaredRule(app.ruleName, this.name);
    } else if (this.ruleFormals[app.ruleName].length !== app.args.length) {
      throw errors.wrongNumberOfParameters(
          app.ruleName, this.ruleFormals[app.ruleName].length, app.args.length);
    }
    return app;
  }
};

// The following grammar contains a few rules that couldn't be written  in "userland".
// At the bottom of src/main.js, we create a sub-grammar of this grammar that's called
// `BuiltInRules`. That grammar contains several convenience rules, e.g., `letter` and
// `digit`, and is implicitly the super-grammar of any grammar whose super-grammar
// isn't specified.
Grammar.ProtoBuiltInRules = new Grammar(
    'ProtoBuiltInRules',  // name
    undefined,  // supergrammar

    // rule bodies
    {
      any: pexprs.any,
      end: pexprs.end,
      lower: new pexprs.UnicodeChar('Ll'),

      // The following rule is invoked implicitly by syntactic rules to skip spaces.
      spaces: new pexprs.Star(new pexprs.Apply('space')),

      // The `space` rule must be defined here because it's referenced by `spaces`.
      space: new pexprs.Range('\x00', ' '),

      // The union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not
      // in Ll or Lu.
      unicodeLtmo: new pexprs.UnicodeChar('Ltmo'),

      upper: new pexprs.UnicodeChar('Lu'),

      Boolean: new pexprs.TypeCheck('boolean'),
      Number: new pexprs.TypeCheck('number'),
      String: new pexprs.TypeCheck('string')
    },

    // rule formal arguments
    {
      any: [],
      end: [],
      spaces: [],
      space: [],
      lower: [],
      unicodeLtmo: [],
      upper: [],
      Boolean: [],
      Number: [],
      String: []
    },

    // rule descriptions
    {
      any: 'any object',
      end: 'end of input',
      space: 'a space',
      lower: 'a lowercase letter',
      upper: 'an uppercase letter'
    }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;

},{"./MatchResult":33,"./Semantics":36,"./State":37,"./common":39,"./errors":40,"./pexprs":60}],30:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Grammar = require('./Grammar');
var InputStream = require('./InputStream');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Constructors

function GrammarDecl(name) {
  this.name = name;
}

// Helpers

GrammarDecl.prototype.sourceInterval = function(startIdx, endIdx) {
  var inputStream = this.interval.inputStream;
  return inputStream.interval(startIdx, endIdx);
};

GrammarDecl.prototype.ensureSuperGrammar = function() {
  if (!this.superGrammar) {
    this.withSuperGrammar(
        // TODO: The conditional expression below is an ugly hack. It's kind of ok because
        // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
        // we should try to find a better way to do this.
        this.name === 'BuiltInRules' ?
            Grammar.ProtoBuiltInRules :
            Grammar.BuiltInRules);
  }
  return this.superGrammar;
};

GrammarDecl.prototype.installOverriddenOrExtendedRule = function(name, formals, body) {
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, body);
  }
  var expectedFormals = this.ensureSuperGrammar().ruleFormals[name];
  var expectedNumFormals = expectedFormals ? expectedFormals.length : 0;
  if (formals.length !== expectedNumFormals) {
    throw errors.wrongNumberOfParameters(name, expectedNumFormals, formals.length, body);
  }
  return this.install(name, formals, body);
};

GrammarDecl.prototype.install = function(name, formals, body, optDescription) {
  body = body.introduceParams(formals);
  this.ruleFormals[name] = formals;
  if (optDescription) {
    this.ruleDescriptions[name] = optDescription;
  }
  this.ruleBodies[name] = body;
  return this;
};

// Stuff that you should only do once

GrammarDecl.prototype.withSuperGrammar = function(superGrammar) {
  if (this.superGrammar) {
    throw new Error('the super grammar of a GrammarDecl cannot be set more than once');
  }
  this.superGrammar = superGrammar;
  this.ruleBodies = Object.create(superGrammar.ruleBodies);
  this.ruleFormals = Object.create(superGrammar.ruleFormals);
  this.ruleDescriptions = Object.create(superGrammar.ruleDescriptions);

  // Grammars with an explicit supergrammar inherit a default start rule.
  if (!superGrammar.isBuiltIn()) {
    this.defaultStartRule = superGrammar.defaultStartRule;
  }
  return this;
};

GrammarDecl.prototype.withDefaultStartRule = function(ruleName) {
  this.defaultStartRule = ruleName;
  return this;
};

GrammarDecl.prototype.withSource = function(source) {
  this.interval = InputStream.newFor(source).interval(0, source.length);
  return this;
};

// Creates a Grammar instance, and if it passes the sanity checks, returns it.
GrammarDecl.prototype.build = function() {
  var grammar = new Grammar(
      this.name,
      this.ensureSuperGrammar(),
      this.ruleBodies,
      this.ruleFormals,
      this.ruleDescriptions,
      this.defaultStartRule);
  // TODO: change the pexpr.prototype.assert... methods to make them add
  // exceptions to an array that's provided as an arg. Then we'll be able to
  // show more than one error of the same type at a time.
  // TODO: include the offending pexpr in the errors, that way we can show
  // the part of the source that caused it.
  var grammarErrors = [];
  var grammarHasInvalidApplications = false;
  Object.keys(grammar.ruleBodies).forEach(function(ruleName) {
    var body = grammar.ruleBodies[ruleName];
    try {
      body.assertChoicesHaveUniformArity(ruleName);
    } catch (e) {
      grammarErrors.push(e);
    }
    try {
      body.assertAllApplicationsAreValid(ruleName, grammar);
    } catch (e) {
      grammarErrors.push(e);
      grammarHasInvalidApplications = true;
    }
  });
  if (!grammarHasInvalidApplications) {
    // The following check can only be done if the grammar has no invalid applications.
    Object.keys(grammar.ruleBodies).forEach(function(ruleName) {
      var body = grammar.ruleBodies[ruleName];
      try {
        body.assertIteratedExprsAreNotNullable(grammar, ruleName);
      } catch (e) {
        grammarErrors.push(e);
      }
      // For now, only check the bodies of unparameterized rules, because the checks can't deal
      // properly with parameters that don't have a concrete value.
      // TODO: Fix this.
      if (grammar.ruleFormals[ruleName].length === 0) {
        try {
          body.assertValuesAndStringsAreNotMixed(grammar, ruleName);
        } catch (e) {
          grammarErrors.push(e);
        }
      }
    });
  }
  if (grammarErrors.length > 0) {
    errors.throwErrors(grammarErrors);
  }
  if (this.interval) {
    grammar.definitionInterval = this.interval;
  }

  return grammar;
};

// Rule declarations

GrammarDecl.prototype.define = function(name, formals, body, optDescr) {
  this.ensureSuperGrammar();
  if (this.superGrammar.ruleBodies[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.superGrammar.name, body);
  } else if (this.ruleBodies[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.name, body);
  }
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, body);
  }
  return this.install(name, formals, body, optDescr);
};

GrammarDecl.prototype.override = function(name, formals, body) {
  var baseRule = this.ensureSuperGrammar().ruleBodies[name];
  if (!baseRule) {
    throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, body);
  }
  this.installOverriddenOrExtendedRule(name, formals, body);
  return this;
};

GrammarDecl.prototype.extend = function(name, formals, fragment) {
  var baseRule = this.ensureSuperGrammar().ruleBodies[name];
  if (!baseRule) {
    throw errors.cannotExtendUndeclaredRule(name, this.superGrammar.name, fragment);
  }
  var body = new pexprs.Extend(this.superGrammar, name, fragment);
  body.interval = fragment.interval;
  this.installOverriddenOrExtendedRule(name, formals, body);
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

},{"./Grammar":29,"./InputStream":31,"./common":39,"./errors":40,"./pexprs":60}],31:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var inherits = require('inherits');

var common = require('./common');
var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream() {
  throw new Error('InputStream cannot be instantiated -- it\'s abstract');
}

InputStream.newFor = function(arrOrStr) {
  return Array.isArray(arrOrStr) ? new ListInputStream(arrOrStr) : new StringInputStream(arrOrStr);
};

InputStream.prototype = {
  init: function(source) {
    this.source = source;
    this.pos = 0;
    this.posInfos = [];
  },

  atEnd: function() {
    return this.pos === this.source.length;
  },

  next: function() {
    if (this.atEnd()) {
      return common.fail;
    } else {
      return this.source[this.pos++];
    }
  },

  matchExactly: function(x) {
    return this.next() === x ? true : common.fail;
  },

  sourceSlice: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  interval: function(startIdx, optEndIdx) {
    return new Interval(this, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
};

function StringInputStream(source) {
  this.init(source);
}
inherits(StringInputStream, InputStream);

StringInputStream.prototype.matchString = function(s) {
  for (var idx = 0; idx < s.length; idx++) {
    if (this.matchExactly(s[idx]) === common.fail) {
      return common.fail;
    }
  }
  return true;
};

function ListInputStream(source) {
  this.init(source);
}
inherits(ListInputStream, InputStream);

ListInputStream.prototype.matchString = function(s) {
  return this.matchExactly(s);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;

},{"./Interval":32,"./common":39,"inherits":24}],32:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('./common').assert;
var errors = require('./errors');
var util = require('./util');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Interval(inputStream, startIdx, endIdx) {
  this.inputStream = inputStream;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Interval.coverage = function(/* interval1, interval2, ... */) {
  var inputStream = arguments[0].inputStream;
  var startIdx = arguments[0].startIdx;
  var endIdx = arguments[0].endIdx;
  for (var idx = 1; idx < arguments.length; idx++) {
    var interval = arguments[idx];
    if (interval.inputStream !== inputStream) {
      throw errors.intervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, arguments[idx].startIdx);
      endIdx = Math.max(endIdx, arguments[idx].endIdx);
    }
  }
  return new Interval(inputStream, startIdx, endIdx);
};

Interval.prototype = {
  coverageWith: function(/* interval1, interval2, ... */) {
    var intervals = Array.prototype.slice.call(arguments);
    intervals.push(this);
    return Interval.coverage.apply(undefined, intervals);
  },

  collapsedLeft: function() {
    return new Interval(this.inputStream, this.startIdx, this.startIdx);
  },

  collapsedRight: function() {
    return new Interval(this.inputStream, this.endIdx, this.endIdx);
  },

  getLineAndColumnMessage: function() {
    var range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.inputStream.source, this.startIdx, range);
  },

  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus: function(that) {
    if (this.inputStream !== that.inputStream) {
      throw errors.intervalSourcesDontMatch();
    } else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
      // `this` and `that` are the same interval!
      return [
      ];
    } else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
      // `that` splits `this` into two intervals
      return [
        new Interval(this.inputStream, this.startIdx, that.startIdx),
        new Interval(this.inputStream, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
      // `that` contains a prefix of `this`
      return [
        new Interval(this.inputStream, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
      // `that` contains a suffix of `this`
      return [
        new Interval(this.inputStream, this.startIdx, that.startIdx)
      ];
    } else {
      // `that` and `this` do not overlap
      return [
        this
      ];
    }
  },

  // Returns a new Interval that has the same extent as this one, but which is relative
  // to `that`, an Interval that fully covers this one.
  relativeTo: function(that, newInputStream) {
    if (this.inputStream !== that.inputStream) {
      throw errors.intervalSourcesDontMatch();
    }
    assert(this.startIdx >= that.startIdx && this.endIdx <= that.endIdx,
           'other interval does not cover this one');
    return new Interval(newInputStream,
                        this.startIdx - that.startIdx,
                        this.endIdx - that.startIdx);
  },

  // Returns a new Interval which contains the same contents as this one,
  // but with whitespace trimmed from both ends. (This only makes sense when
  // the input stream is a string.)
  trimmed: function() {
    var contents = this.contents;
    var startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
    var endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
    return new Interval(this.inputStream, startIdx, endIdx);
  }
};

Object.defineProperties(Interval.prototype, {
  contents: {
    get: function() {
      if (this._contents === undefined) {
        this._contents = this.inputStream.sourceSlice(this.startIdx, this.endIdx);
      }
      return this._contents;
    },
    enumerable: true
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;


},{"./common":39,"./errors":40,"./util":61}],33:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var inherits = require('inherits');

var common = require('./common');
var nodes = require('./nodes');
var util = require('./util');
var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Create a short error message for an error that occurred during matching.
function getShortMatchErrorMessage(pos, source, detail) {
  var errorInfo = util.getLineAndColumn(source, pos);
  return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
}

// ----------------- MatchFailure -----------------

function MatchResult(state) {
  this.state = state;
  this._cst = state.bindings[0];
}

MatchResult.newFor = function(state) {
  var succeeded = state.bindings.length > 0;
  return succeeded ? new MatchResult(state) : new MatchFailure(state);
};

MatchResult.prototype.failed = function() {
  return false;
};

MatchResult.prototype.succeeded = function() {
  return !this.failed();
};

// Returns a `MatchResult` that can be fed into operations or attributes that care
// about the whitespace that was implicitly skipped over by syntactic rules. This
// is useful for doing things with comments, e.g., syntax highlighting.
MatchResult.prototype.getDiscardedSpaces = function() {
  if (this.failed()) {
    return [];
  }

  var state = this.state;
  var grammar = state.grammar;
  var inputStream = state.inputStream;

  var intervals = [new Interval(inputStream, 0, inputStream.source.length)];

  // Subtract the interval of each terminal from the set of intervals above.
  var s = grammar.semantics().addOperation('subtractTerminals', {
    _nonterminal: function(children) {
      children.forEach(function(child) {
        child.subtractTerminals();
      });
    },
    _terminal: function() {
      var t = this;
      intervals = intervals.
          map(function(interval) { return interval.minus(t.interval); }).
          reduce(function(xs, ys) { return xs.concat(ys); }, []);
    }
  });
  s(this).subtractTerminals();

  // Now `intervals` holds the intervals of the input stream that were skipped over by syntactic
  // rules, because they contained spaces.

  // Next, we want to match the contents of each of those intervals with the grammar's `spaces`
  // rule, to reconstruct the CST nodes that were discarded by syntactic rules. But if we simply
  // pass each interval's `contents` to the grammar's `match` method, the resulting nodes and
  // their children will have intervals that are associated with a different input, i.e., a
  // substring of the original input. The following operation will fix this problem for us.
  s.addOperation('fixIntervals(idxOffset)', {
    _default: function(children) {
      var idxOffset = this.args.idxOffset;
      this.interval.inputStream = inputStream;
      this.interval.startIdx += idxOffset;
      this.interval.endIdx += idxOffset;
      if (!this.isTerminal()) {
        children.forEach(function(child) {
          child.fixIntervals(idxOffset);
        });
      }
    }
  });

  // Now we're finally ready to reconstruct the discarded CST nodes.
  var discardedNodes = intervals.map(function(interval) {
    var r = grammar.match(interval.contents, 'spaces');
    s(r).fixIntervals(interval.startIdx);
    return r._cst;
  });

  // Rather than return a bunch of CST nodes and make the caller of this method loop over them,
  // we can construct a single CST node that is the parent of all of the discarded nodes. An
  // `IterationNode` is the obvious choice for this.
  discardedNodes = new nodes.IterationNode(
      grammar,
      discardedNodes,
      discardedNodes.length === 0 ?
          new Interval(inputStream, 0, 0) :
          new Interval(
              inputStream,
              discardedNodes[0].interval.startIdx,
              discardedNodes[discardedNodes.length - 1].interval.endIdx));

  // But remember that a CST node can't be used directly by clients. What we really need to return
  // from this method is a successful `MatchResult` that can be used with the clients' semantics.
  // We already have one -- `this` -- but it's got a different CST node inside. So we create a new
  // object that delegates to `this`, and override its `_cst` property.
  var r = Object.create(this);
  r._cst = discardedNodes;

  // We also override its `getDiscardedSpaces` method, in case someone decides to call it.
  r.getDiscardedSpaces = function() { return r; };

  return r;
};

// ----------------- MatchFailure -----------------

function MatchFailure(state) {
  this.state = state;
  common.defineLazyProperty(this, '_failures', function() {
    return this.state.getFailures();
  });
  common.defineLazyProperty(this, 'message', function() {
    var source = this.state.inputStream.source;
    if (typeof source !== 'string') {
      return 'match failed at position ' + this.getRightmostFailurePosition();
    }

    var detail = 'Expected ' + this.getExpectedText();
    return util.getLineAndColumnMessage(source, this.getRightmostFailurePosition()) + detail;
  });
  common.defineLazyProperty(this, 'shortMessage', function() {
    if (typeof this.state.inputStream.source !== 'string') {
      return 'match failed at position ' + this.getRightmostFailurePosition();
    }
    var detail = 'expected ' + this.getExpectedText();
    return getShortMatchErrorMessage(
        this.getRightmostFailurePosition(),
        this.state.inputStream.source,
        detail);
  });
}
inherits(MatchFailure, MatchResult);

MatchFailure.prototype.toString = function() {
  return '[MatchFailure at position ' + this.getRightmostFailurePosition() + ']';
};

MatchFailure.prototype.failed = function() {
  return true;
};

MatchFailure.prototype.getRightmostFailurePosition = function() {
  return this.state.getRightmostFailurePosition();
};

MatchFailure.prototype.getRightmostFailures = function() {
  return this._failures;
};

// Return a string summarizing the expected contents of the input stream when
// the match failure occurred.
MatchFailure.prototype.getExpectedText = function() {
  var sb = new common.StringBuffer();
  var failures = this.getRightmostFailures();

  // Filter out the fluffy failures to make the default error messages more useful
  failures = failures.filter(function(failure) {
    return !failure.isFluffy();
  });

  for (var idx = 0; idx < failures.length; idx++) {
    if (idx > 0) {
      if (idx === failures.length - 1) {
        sb.append((failures.length > 2 ? ', or ' : ' or '));
      } else {
        sb.append(', ');
      }
    }
    sb.append(failures[idx].toString());
  }
  return sb.contents();
};

MatchFailure.prototype.getInterval = function() {
  var pos = this.state.getRightmostFailurePosition();
  return new Interval(this.state.inputStream, pos, pos);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchResult;

},{"./Interval":32,"./common":39,"./nodes":42,"./util":61,"inherits":24}],34:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Namespace() {
}
Namespace.prototype = Object.create(null);

Namespace.asNamespace = function(objOrNamespace) {
  if (objOrNamespace instanceof Namespace) {
    return objOrNamespace;
  }
  return Namespace.createNamespace(objOrNamespace);
};

// Create a new namespace. If `optProps` is specified, all of its properties
// will be copied to the new namespace.
Namespace.createNamespace = function(optProps) {
  return Namespace.extend(Namespace.prototype, optProps);
};

// Create a new namespace which extends another namespace. If `optProps` is
// specified, all of its properties will be copied to the new namespace.
Namespace.extend = function(namespace, optProps) {
  if (namespace !== Namespace.prototype && !(namespace instanceof Namespace)) {
    throw new TypeError('not a Namespace object: ' + namespace);
  }
  var ns = Object.create(namespace, {
    constructor: {
      value: Namespace,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  return extend(ns, optProps);
};

// TODO: Should this be a regular method?
Namespace.toString = function(ns) {
  return Object.prototype.toString.call(ns);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Namespace;

},{"util-extend":26}],35:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo(state) {
  this.state = state;
  this.applicationMemoKeyStack = [];  // a stack of "memo keys" of the active applications
  this.memo = {};
  this.currentLeftRecursion = undefined;
}

PosInfo.prototype = {
  isActive: function(application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  },

  enter: function(application) {
    this.state.enter(application);
    this.applicationMemoKeyStack.push(application.toMemoKey());
  },

  exit: function() {
    this.state.exit();
    this.applicationMemoKeyStack.pop();
  },

  startLeftRecursion: function(headApplication, memoRec) {
    memoRec.isLeftRecursion = true;
    memoRec.headApplication = headApplication;
    memoRec.nextLeftRecursion = this.currentLeftRecursion;
    this.currentLeftRecursion = memoRec;

    var applicationMemoKeyStack = this.applicationMemoKeyStack;
    var indexOfFirstInvolvedRule = applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
    var involvedApplicationMemoKeys = applicationMemoKeyStack.slice(indexOfFirstInvolvedRule);

    memoRec.isInvolved = function(applicationMemoKey) {
      return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
    };

    memoRec.updateInvolvedApplicationMemoKeys = function() {
      for (var idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
        var applicationMemoKey = applicationMemoKeyStack[idx];
        if (!this.isInvolved(applicationMemoKey)) {
          involvedApplicationMemoKeys.push(applicationMemoKey);
        }
      }
    };
  },

  endLeftRecursion: function() {
    this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
  },

  // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
  // the memoized result (which starts out being a failure) is always used.
  shouldUseMemoizedResult: function(memoRec) {
    if (!memoRec.isLeftRecursion) {
      return true;
    }
    var applicationMemoKeyStack = this.applicationMemoKeyStack;
    for (var idx = 0; idx < applicationMemoKeyStack.length; idx++) {
      var applicationMemoKey = applicationMemoKeyStack[idx];
      if (memoRec.isInvolved(applicationMemoKey)) {
        return false;
      }
    }
    return true;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;

},{}],36:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = require('es6-symbol');  // eslint-disable-line no-undef
var inherits = require('inherits');

var MatchResult = require('./MatchResult');
var IterationNode = require('./nodes').IterationNode;
var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// ----------------- Wrappers -----------------

// Wrappers decorate CST nodes with all of the functionality (i.e., operations and attributes)
// provided by a Semantics (see below). `Wrapper` is the abstract superclass of all wrappers. A
// `Wrapper` must have `_node` and `_semantics` instance variables, which refer to the CST node and
// Semantics (resp.) for which it was created, and a `_childWrappers` instance variable which is
// used to cache the wrapper instances that are created for its child nodes. Setting these instance
// variables is the responsibility of the constructor of each Semantics-specific subclass of
// `Wrapper`.
function Wrapper() {}

Wrapper.prototype.toString = function() {
  return '[semantics wrapper for ' + this._node.grammar.name + ']';
};

Wrapper.prototype._forgetMemoizedResultFor = function(attributeName) {
  // Remove the memoized attribute from the cstNode and all its children.
  delete this._node[this._semantics.attributeKeys[attributeName]];
  this.children.forEach(function(child) {
    child._forgetMemoizedResultFor(attributeName);
  });
};

// Returns the wrapper of the specified child node. Child wrappers are created lazily and cached in
// the parent wrapper's `_childWrappers` instance variable.
Wrapper.prototype.child = function(idx) {
  if (!(0 <= idx && idx < this._node.numChildren())) {
    // TODO: Consider throwing an exception here.
    return undefined;
  }
  var childWrapper = this._childWrappers[idx];
  if (!childWrapper) {
    childWrapper = this._childWrappers[idx] = this._semantics.wrap(this._node.childAt(idx));
  }
  return childWrapper;
};

// Returns an array containing the wrappers of all of the children of the node associated with this
// wrapper.
Wrapper.prototype._children = function() {
  // Force the creation of all child wrappers
  for (var idx = 0; idx < this._node.numChildren(); idx++) {
    this.child(idx);
  }
  return this._childWrappers;
};

// Returns `true` if the CST node associated with this wrapper corresponds to an iteration
// expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
Wrapper.prototype.isIteration = function() {
  return this._node.isIteration();
};

// Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
// otherwise.
Wrapper.prototype.isTerminal = function() {
  return this._node.isTerminal();
};

// Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
// otherwise.
Wrapper.prototype.isNonterminal = function() {
  return this._node.isNonterminal();
};

// Returns `true` if the CST node associated with this wrapper is a nonterminal node
// corresponding to a syntactic rule, `false` otherwise.
Wrapper.prototype.isSyntactic = function() {
  return this.isNonterminal() && this._node.isSyntactic();
};

// Returns `true` if the CST node associated with this wrapper is a nonterminal node
// corresponding to a lexical rule, `false` otherwise.
Wrapper.prototype.isLexical = function() {
  return this.isNonterminal() && this._node.isLexical();
};

// Returns `true` if the CST node associated with this wrapper is an iterator node
// having either one or no child (? operator), `false` otherwise.
// Otherwise, throws an exception.
Wrapper.prototype.isOptional = function() {
  return this._node.isOptional();
};

// Create a new IterationNode in the same semantics as this wrapper.
Wrapper.prototype.iteration = function(optElements) {
  var iter = new IterationNode(this._node.grammar, optElements || [], this.interval, false);
  return this._semantics.wrap(iter);
};

Object.defineProperties(Wrapper.prototype, {
  // Returns an array containing the children of this CST node.
  children: {get: function() { return this._children(); }},

  // Returns the name of grammar rule that created this CST node.
  ctorName: {get: function() { return this._node.ctorName; }},

  // Returns the interval consumed by the CST node associated with this wrapper.
  interval: {get: function() { return this._node.interval; }},

  // Returns the number of children of this CST node.
  numChildren: {get: function() { return this._node.numChildren(); }},

  // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
  // throws an exception.
  primitiveValue: {
    get: function() {
      if (this.isTerminal()) {
        return this._node.primitiveValue;
      }
      throw new TypeError(
          "tried to access the 'primitiveValue' attribute of a non-terminal CST node");
    }
  }
});

// ----------------- Semantics -----------------

// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.semantics()` and `g.extendSemantics(parentSemantics)`.
function Semantics(grammar, superSemantics) {
  var self = this;
  this.grammar = grammar;
  this.checkedActionDicts = false;

  // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
  // of an operation or attribute. Operations and attributes require double dispatch: the semantic
  // action is chosen based on both the node's type and the semantics. Wrappers ensure that
  // the `execute` method is called with the correct (most specific) semantics object as an
  // argument.
  this.Wrapper = function(node) {
    self.checkActionDictsIfHaventAlready();
    this._semantics = self;
    this._node = node;
    this._childWrappers = [];
  };

  this.super = superSemantics;
  if (superSemantics) {
    if (grammar !== this.super.grammar && !grammar._inheritsFrom(this.super.grammar)) {
      throw new Error(
          "Cannot extend a semantics for grammar '" + this.super.grammar.name +
          "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
    }
    inherits(this.Wrapper, this.super.Wrapper);
    this.operations = Object.create(this.super.operations);
    this.attributes = Object.create(this.super.attributes);
    this.attributeKeys = Object.create(null);

    // Assign unique symbols for each of the attributes inherited from the super-semantics so that
    // they are memoized independently.
    for (var attributeName in this.attributes) {
      this.attributeKeys[attributeName] = Symbol();
    }
  } else {
    inherits(this.Wrapper, Wrapper);
    this.operations = Object.create(null);
    this.attributes = Object.create(null);
    this.attributeKeys = Object.create(null);
  }
}

Semantics.prototype.toString = function() {
  return '[semantics for ' + this.grammar.name + ']';
};

Semantics.prototype.checkActionDictsIfHaventAlready = function() {
  if (!this.checkedActionDicts) {
    this.checkActionDicts();
    this.checkedActionDicts = true;
  }
};

// Checks that the action dictionaries for all operations and attributes in this semantics,
// including the ones that were inherited from the super-semantics, agree with the grammar.
// Throws an exception if one or more of them doesn't.
Semantics.prototype.checkActionDicts = function() {
  for (var name in this.operations) {
    this.operations[name].checkActionDict(this.grammar);
  }
  for (name in this.attributes) {
    this.attributes[name].checkActionDict(this.grammar);
  }
};

var prototypeGrammar;
var prototypeGrammarSemantics;

// This method is called from main.js once Ohm has loaded.
Semantics.initPrototypeParser = function(grammar) {
  prototypeGrammarSemantics = grammar.semantics().addOperation('parse', {
    AttributeSignature: function(name) {
      return {
        name: name.parse(),
        formals: []
      };
    },
    OperationSignature: function(name, optFormals) {
      return {
        name: name.parse(),
        formals: optFormals.parse()[0] || []
      };
    },
    Formals: function(oparen, fs, cparen) {
      return fs.asIteration().parse();
    },
    name: function(first, rest) {
      return this.interval.contents;
    }
  });
  prototypeGrammar = grammar;
};

function parseSignature(signature, type) {
  if (!prototypeGrammar) {
    // The Operations and Attributes grammar won't be available while Ohm is loading,
    // but we can get away the following simplification b/c none of the operations
    // that are used while loading take arguments.
    common.assert(signature.indexOf('(') === -1);
    return {
      name: signature,
      formals: []
    };
  }

  var r = prototypeGrammar.match(
      signature,
      type === 'operation' ? 'OperationSignature' : 'AttributeSignature');
  if (r.failed()) {
    throw new Error(r.message);
  }

  return prototypeGrammarSemantics(r).parse();
}

Semantics.prototype.addOperationOrAttribute = function(type, signature, actionDict) {
  var typePlural = type + 's';

  var parsedNameAndFormalArgs = parseSignature(signature, type);
  var name = parsedNameAndFormalArgs.name;
  var formals = parsedNameAndFormalArgs.formals;

  // TODO: check that there are no duplicate formal arguments

  this.assertNewName(name, type);

  // Create the action dictionary for this operation / attribute that contains a `_default` action
  // which defines the default behavior of iteration, terminal, and non-terminal nodes...
  var realActionDict = {
    _default: function(children) {
      var self = this;
      var thisThing = this._semantics[typePlural][name];
      var args = thisThing.formals.map(function(formal) {
        return self.args[formal];
      });

      if (this.isIteration()) {
        // This CST node corresponds to an iteration expression in the grammar (*, +, or ?). The
        // default behavior is to map this operation or attribute over all of its child nodes.
        return children.map(function(child) { return doIt.apply(child, args); });
      }

      // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
      // we got here means that this action dictionary doesn't have an action for this particular
      // non-terminal or a generic `_nonterminal` action.
      if (children.length === 1) {
        // As a convenience, if this node only has one child, we just return the result of
        // applying this operation / attribute to the child node.
        return doIt.apply(children[0], args);
      } else {
        // Otherwise, we throw an exception to let the programmer know that we don't know what
        // to do with this node.
        throw new Error(
            'Missing semantic action for ' + this.ctorName + ' in ' + name + ' ' + type);
      }
    }
  };
  // ... and add in the actions supplied by the programmer, which may override some or all of the
  // default ones.
  Object.keys(actionDict).forEach(function(name) {
    realActionDict[name] = actionDict[name];
  });

  var entry = type === 'operation' ?
      new Operation(name, formals, realActionDict) :
      new Attribute(name, realActionDict);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  entry.checkActionDict(this.grammar);

  this[typePlural][name] = entry;

  function doIt() {
    // Dispatch to most specific version of this operation / attribute -- it may have been
    // overridden by a sub-semantics.
    var thisThing = this._semantics[typePlural][name];

    // Check that the caller passed the correct number of arguments.
    if (arguments.length !== thisThing.formals.length) {
      throw new Error(
          'Invalid number of arguments passed to ' + name + ' ' + type + ' (expected ' +
          thisThing.formals.length + ', got ' + arguments.length + ')');
    }

    // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.
    var args = Object.create(null);
    for (var idx = 0; idx < arguments.length; idx++) {
      var formal = thisThing.formals[idx];
      args[formal] = arguments[idx];
    }

    var oldArgs = this.args;
    this.args = args;
    var ans = thisThing.execute(this._semantics, this);
    this.args = oldArgs;
    return ans;
  }

  if (type === 'operation') {
    this.Wrapper.prototype[name] = doIt;
    this.Wrapper.prototype[name].toString = function() {
      return '[' + name + ' operation]';
    };
  } else {
    Object.defineProperty(this.Wrapper.prototype, name, {get: doIt});
    this.attributeKeys[name] = Symbol();
  }
};

Semantics.prototype.extendOperationOrAttribute = function(type, name, actionDict) {
  var typePlural = type + 's';

  // Make sure that `name` really is just a name, i.e., that it doesn't also contain formals.
  parseSignature(name, 'attribute');

  if (!(this.super && name in this.super[typePlural])) {
    throw new Error('Cannot extend ' + type + " '" + name +
        "': did not inherit an " + type + ' with that name');
  }
  if (Object.prototype.hasOwnProperty.call(this[typePlural], name)) {
    throw new Error('Cannot extend ' + type + " '" + name + "' again");
  }

  // Create a new operation / attribute whose actionDict delegates to the super operation /
  // attribute's actionDict, and which has all the keys from `inheritedActionDict`.
  var inheritedFormals = this[typePlural][name].formals;
  var inheritedActionDict = this[typePlural][name].actionDict;
  var newActionDict = Object.create(inheritedActionDict);
  Object.keys(actionDict).forEach(function(name) {
    newActionDict[name] = actionDict[name];
  });

  this[typePlural][name] = type === 'operation' ?
      new Operation(name, inheritedFormals, newActionDict) :
      new Attribute(name, newActionDict);

  // The following check is not strictly necessary (it will happen later anyway) but it's better to
  // catch errors early.
  this[typePlural][name].checkActionDict(this.grammar);
};

Semantics.prototype.assertNewName = function(name, type) {
  if (Wrapper.prototype.hasOwnProperty(name)) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': that's a reserved name");
  }
  if (name in this.operations) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an operation with that name already exists");
  }
  if (name in this.attributes) {
    throw new Error(
        'Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
  }
};

// Returns a wrapper for the given CST `node` in this semantics.
// If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?
Semantics.prototype.wrap = function(node) {
  return node instanceof this.Wrapper ? node : new this.Wrapper(node);
};

// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
Semantics.createSemantics = function(grammar, optSuperSemantics) {
  var s = new Semantics(
      grammar,
      optSuperSemantics !== undefined ?
          optSuperSemantics :
          Semantics.BuiltInSemantics._getSemantics());

  // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
  // for `s`, which is the real `Semantics` instance.
  var proxy = function ASemantics(matchResult) {
    if (!(matchResult instanceof MatchResult)) {
      throw new TypeError(
          'Semantics expected a MatchResult, but got ' + common.unexpectedObjToString(matchResult));
    }
    if (!matchResult.succeeded()) {
      throw new TypeError(
          'cannot apply Semantics to ' + matchResult.toString());
    }

    var cst = matchResult._cst;
    if (cst.grammar !== grammar) {
      throw new Error(
          "Cannot use a CST node created by grammar '" + cst.grammar.name +
          "' with a semantics for '" + grammar.name + "'");
    }
    return s.wrap(cst);
  };

  // Forward public methods from the proxy to the semantics instance.
  proxy.addOperation = function(signature, actionDict) {
    s.addOperationOrAttribute.call(s, 'operation', signature, actionDict);
    return proxy;
  };
  proxy.extendOperation = function(name, actionDict) {
    s.extendOperationOrAttribute.call(s, 'operation', name, actionDict);
    return proxy;
  };
  proxy.addAttribute = function(name, actionDict) {
    s.addOperationOrAttribute.call(s, 'attribute', name, actionDict);
    return proxy;
  };
  proxy.extendAttribute = function(name, actionDict) {
    s.extendOperationOrAttribute.call(s, 'attribute', name, actionDict);
    return proxy;
  };
  proxy._getActionDict = function(operationOrAttributeName) {
    var action = s.operations[operationOrAttributeName] || s.attributes[operationOrAttributeName];
    if (!action) {
      throw new Error('"' + operationOrAttributeName + '" is not a valid operation or attribute ' +
        'name in this semantics for "' + grammar.name + '"');
    }
    return action.actionDict;
  };
  proxy._removeAction = function(operationOrAttributeName) {
    var action;
    if (operationOrAttributeName in s.operations) {
      action = s.operations[operationOrAttributeName];
      delete s.operations[operationOrAttributeName];
    } else if (operationOrAttributeName in s.attributes) {
      action = s.attributes[operationOrAttributeName];
      delete s.attributes[operationOrAttributeName];
    }
    return action;
  };

  // Make the proxy's toString() work.
  proxy.toString = s.toString.bind(s);

  // Returns the semantics for the proxy.
  proxy._getSemantics = function() {
    return s;
  };

  return proxy;
};

Semantics.initBuiltInSemantics = function(builtInRules) {
  var actions = {
    empty: function() {
      return this.iteration();
    },
    nonEmpty: function(first, _, rest) {
      return this.iteration([first].concat(rest.children));
    }
  };

  Semantics.BuiltInSemantics = Semantics
      .createSemantics(builtInRules, null)
      .addOperation('asIteration', {
        emptyListOf: actions.empty,
        nonemptyListOf: actions.nonEmpty,
        EmptyListOf: actions.empty,
        NonemptyListOf: actions.nonEmpty
      });
};

// ----------------- Operation -----------------

// An Operation represents a function to be applied to a concrete syntax tree (CST) -- it's very
// similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by
// recursively walking the CST, and at each node, invoking the matching semantic action from
// `actionDict`. See `Operation.prototype.execute` for details of how a CST node's matching semantic
// action is found.
function Operation(name, formals, actionDict) {
  this.name = name;
  this.formals = formals;
  this.actionDict = actionDict;
}

Operation.prototype.typeName = 'operation';

Operation.prototype.checkActionDict = function(grammar) {
  grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
};

// Execute this operation on the CST node associated with `nodeWrapper` in the context of the given
// Semantics instance.
Operation.prototype.execute = function(semantics, nodeWrapper) {
  // Look for a semantic action whose name matches the node's constructor name, which is either the
  // name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
  // iteration node). In the latter case, the action function receives a single argument, which is
  // an array containing all of the children of the CST node.
  var actionFn = this.actionDict[nodeWrapper._node.ctorName];
  if (actionFn) {
    return this.doAction(semantics, nodeWrapper, actionFn, nodeWrapper.isIteration());
  }

  // The action dictionary does not contain a semantic action for this specific type of node.
  // If this is a nonterminal node and the programmer has provided a `_nonterminal` semantic
  // action, we invoke it:
  if (nodeWrapper.isNonterminal()) {
    actionFn = this.actionDict._nonterminal;
    if (actionFn) {
      return this.doAction(semantics, nodeWrapper, actionFn, true);
    }
  }

  // Otherwise, we invoke the '_default' semantic action.
  return this.doAction(semantics, nodeWrapper, this.actionDict._default, true);
};

// Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
// `semantics`. If `optPassChildrenAsArray` is truthy, `actionFn` will be called with a single
// argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
// be equal to the number of children in the CST node.
Operation.prototype.doAction = function(semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
  return optPassChildrenAsArray ?
      actionFn.call(nodeWrapper, nodeWrapper._children()) :
      actionFn.apply(nodeWrapper, nodeWrapper._children());
};

// ----------------- Attribute -----------------

// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
function Attribute(name, actionDict) {
  this.name = name;
  this.formals = [];
  this.actionDict = actionDict;
}
inherits(Attribute, Operation);

Attribute.prototype.typeName = 'attribute';

Attribute.prototype.execute = function(semantics, nodeWrapper) {
  var node = nodeWrapper._node;
  var key = semantics.attributeKeys[this.name];
  if (!node.hasOwnProperty(key)) {
    // The following is a super-send -- isn't JS beautiful? :/
    node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
  }
  return node[key];
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Semantics;

},{"./MatchResult":33,"./common":39,"./nodes":42,"es6-symbol":6,"inherits":24}],37:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var PosInfo = require('./PosInfo');
var Trace = require('./Trace');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var RM_RIGHTMOST_FAILURE_POSITION = 0;
var RM_RIGHTMOST_FAILURES = 1;

var applySpaces = new pexprs.Apply('spaces');

function State(grammar, input, opts) {
  this.grammar = grammar;
  this.startExpr = this._getStartExpr(grammar, opts.startApplication);
  this.origInputStream = this.startExpr.newInputStreamFor(input, this.grammar);
  this.tracingEnabled = opts.trace || false;
  this.matchNodes = opts.matchNodes || false;
  this.init(RM_RIGHTMOST_FAILURE_POSITION);
}

State.prototype = {
  init: function(recordingMode) {
    this.bindings = [];

    this.inputStreamStack = [];
    this.posInfosStack = [];
    this.pushInputStream(this.origInputStream);

    this.applicationStack = [];
    this.inLexifiedContextStack = [false];

    this.recordingMode = recordingMode;
    if (recordingMode === RM_RIGHTMOST_FAILURE_POSITION) {
      this.rightmostFailurePosition = -1;
    } else if (recordingMode === RM_RIGHTMOST_FAILURES) {
      // We always run in *rightmost failure position* recording mode before running in
      // *rightmost failures* recording mode. And since the traces generated by each of
      // these passes would be identical, there's no need to record it now if we have
      // already recorded it in the first pass.
      this.tracingEnabled = false;
    } else {
      throw new Error('invalid recording mode: ' + recordingMode);
    }

    if (this.isTracing()) {
      this.trace = [];
    }
  },

  enter: function(app) {
    this.applicationStack.push(app);
    this.inLexifiedContextStack.push(false);
  },

  exit: function() {
    this.applicationStack.pop();
    this.inLexifiedContextStack.pop();
  },

  enterLexifiedContext: function() {
    this.inLexifiedContextStack.push(true);
  },

  exitLexifiedContext: function() {
    this.inLexifiedContextStack.pop();
  },

  currentApplication: function() {
    return this.applicationStack[this.applicationStack.length - 1];
  },

  inSyntacticContext: function() {
    if (typeof this.inputStream.source !== 'string') {
      return false;
    }
    var currentApplication = this.currentApplication();
    if (currentApplication) {
      return currentApplication.isSyntactic() && !this.inLexifiedContext();
    } else {
      // The top-level context is syntactic if the start application is.
      return this.startExpr.factors[0].isSyntactic();
    }
  },

  inLexifiedContext: function() {
    return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
  },

  skipSpaces: function() {
    var origFailuresInfo = this.getFailuresInfo();
    this.eval(applySpaces);
    this.bindings.pop();
    this.restoreFailuresInfo(origFailuresInfo);
    return this.inputStream.pos;
  },

  skipSpacesIfInSyntacticContext: function() {
    return this.inSyntacticContext() ?
        this.skipSpaces() :
        this.inputStream.pos;
  },

  maybeSkipSpacesBefore: function(expr) {
    if (expr instanceof pexprs.Apply && expr.isSyntactic()) {
      return this.skipSpaces();
    } else if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
      return this.skipSpacesIfInSyntacticContext();
    } else {
      return this.inputStream.pos;
    }
  },

  truncateBindings: function(newLength) {
    // TODO: is this really faster than setting the `length` property?
    while (this.bindings.length > newLength) {
      this.bindings.pop();
    }
  },

  pushInputStream: function(inputStream) {
    this.inputStreamStack.push(this.inputStream);
    this.posInfosStack.push(this.posInfos);
    this.inputStream = inputStream;
    this.posInfos = [];
  },

  popInputStream: function() {
    this.inputStream = this.inputStreamStack.pop();
    this.posInfos = this.posInfosStack.pop();
  },

  getCurrentPosInfo: function() {
    return this.getPosInfo(this.inputStream.pos);
  },

  getPosInfo: function(pos) {
    var posInfo = this.posInfos[pos];
    return posInfo || (this.posInfos[pos] = new PosInfo(this));
  },

  processFailure: function(pos, expr) {
    if (this.recordingMode === RM_RIGHTMOST_FAILURE_POSITION) {
      if (pos > this.rightmostFailurePosition) {
        this.rightmostFailurePosition = pos;
      }
    } else /* if (this.recordingMode === RM_RIGHTMOST_FAILURES) */
        if (pos === this.rightmostFailurePosition) {
          // We're only interested in failures at the rightmost failure position that haven't
          // already been recorded.

          this.addRightmostFailure(expr.toFailure(this.grammar), false);
        }
  },

  ensureRightmostFailures: function() {
    if (!this.rightmostFailures) {
      this.rightmostFailures = Object.create(null);
    }
  },

  addRightmostFailure: function(failure, shouldCloneIfNew) {
    this.ensureRightmostFailures();
    var key = failure.toKey();
    if (!this.rightmostFailures[key]) {
      this.rightmostFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.rightmostFailures[key].isFluffy() && !failure.isFluffy()) {
      this.rightmostFailures[key].clearFluffy();
    }
  },

  addRightmostFailures: function(failures, shouldCloneIfNew) {
    var self = this;
    Object.keys(failures).forEach(function(key) {
      self.addRightmostFailure(failures[key], shouldCloneIfNew);
    });
  },

  cloneRightmostFailures: function() {
    if (!this.rightmostFailures) {
      return undefined;
    }

    var ans = Object.create(null);
    var self = this;
    Object.keys(this.rightmostFailures).forEach(function(key) {
      ans[key] = self.rightmostFailures[key].clone();
    });
    return ans;
  },

  getRightmostFailurePosition: function() {
    return this.rightmostFailurePosition;
  },

  getFailures: function() {
    if (this.recordingMode === RM_RIGHTMOST_FAILURE_POSITION) {
      // Rewind, then try to match the input again, recording failures.
      this.init(RM_RIGHTMOST_FAILURES);
      this.evalFromStart();
    }

    this.ensureRightmostFailures();
    var self = this;
    return Object.keys(this.rightmostFailures).map(function(key) {
      return self.rightmostFailures[key];
    });
  },

  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry: function(pos, expr) {
    var posInfo = this.posInfos[pos];
    if (posInfo && expr.ruleName) {
      var memoRec = posInfo.memo[expr.toMemoKey()];
      if (memoRec) {
        return memoRec.traceEntry;
      }
    }
    return null;
  },

  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry: function(pos, expr, succeeded, bindings) {
    var memoEntry = this.getMemoizedTraceEntry(pos, expr);
    return memoEntry ? memoEntry.cloneWithExpr(expr)
                     : new Trace(this.inputStream, pos, expr, succeeded, bindings, this.trace);
  },

  isTracing: function() {
    return this.tracingEnabled;
  },

  useMemoizedResult: function(memoRec) {
    if (this.isTracing()) {
      this.trace.push(memoRec.traceEntry);
    }

    if (this.recordingMode === RM_RIGHTMOST_FAILURES && memoRec.failuresAtRightmostPosition) {
      this.addRightmostFailures(memoRec.failuresAtRightmostPosition, true);
    }

    if (memoRec.value) {
      this.inputStream.pos = memoRec.pos;
      this.bindings.push(memoRec.value);
      return true;
    }
    return false;
  },

  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval: function(expr) {
    var inputStream = this.inputStream;
    var origNumBindings = this.bindings.length;

    if (this.recordingMode === RM_RIGHTMOST_FAILURES) {
      var origFailures = this.rightmostFailures;
      this.rightmostFailures = undefined;
    }

    var origPos = inputStream.pos;
    var memoPos = this.maybeSkipSpacesBefore(expr);

    if (this.isTracing()) {
      var origTrace = this.trace;
      this.trace = [];
    }

    // Do the actual evaluation.
    var ans = expr.eval(this);

    if (this.isTracing()) {
      var bindings = this.bindings.slice(origNumBindings);
      var traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }

    if (ans) {
      if (this.rightmostFailures &&
        (inputStream.pos === this.rightmostFailurePosition ||
         this.skipSpacesIfInSyntacticContext() === this.rightmostFailurePosition)) {
        var self = this;
        Object.keys(this.rightmostFailures).forEach(function(key) {
          self.rightmostFailures[key].makeFluffy();
        });
      }
    } else {
      // Reset the position and the bindings.
      inputStream.pos = origPos;
      this.truncateBindings(origNumBindings);
    }

    if (this.recordingMode === RM_RIGHTMOST_FAILURES && origFailures) {
      this.addRightmostFailures(origFailures, false);
    }

    return ans;
  },

  // Return the starting expression for this grammar. If `optStartApplication` is specified, it
  // is a string expressing a rule application in the grammar. If not specified, the grammar's
  // default start rule will be used.
  _getStartExpr: function(grammar, optStartApplication) {
    var applicationStr = optStartApplication || grammar.defaultStartRule;
    if (!applicationStr) {
      throw new Error('Missing start rule argument -- the grammar has no default start rule.');
    }

    var startApp = grammar.parseApplication(applicationStr);
    return new pexprs.Seq([startApp, pexprs.end]);
  },

  evalFromStart: function() {
    this.eval(this.startExpr);
  },

  getFailuresInfo: function() {
    if (this.recordingMode === RM_RIGHTMOST_FAILURE_POSITION) {
      return this.rightmostFailurePosition;
    } else /* if (this.recordingMode === RM_RIGHTMOST_FAILURES) */ {
      return this.rightmostFailures;
    }
  },

  restoreFailuresInfo: function(failuresInfo) {
    if (this.recordingMode === RM_RIGHTMOST_FAILURE_POSITION) {
      this.rightmostFailurePosition = failuresInfo;
    } else /* if (this.recordingMode === RM_RIGHTMOST_FAILURES) */ {
      this.rightmostFailures = failuresInfo;
    }
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = State;

},{"./PosInfo":35,"./Trace":38,"./pexprs":60}],38:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');
var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Unicode characters that are used in the `toString` output.
var BALLOT_X = '\u2717';
var CHECK_MARK = '\u2713';
var DOT_OPERATOR = '\u22C5';
var RIGHTWARDS_DOUBLE_ARROW = '\u21D2';
var SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409';
var SYMBOL_FOR_LINE_FEED = '\u240A';
var SYMBOL_FOR_CARRIAGE_RETURN = '\u240D';

function spaces(n) {
  return common.repeat(' ', n).join('');
}

// Return a string representation of a portion of `inputStream` at offset `pos`.
// The result will contain exactly `len` characters.
function getInputExcerpt(inputStream, pos, len) {
  var excerpt = asEscapedString(inputStream.sourceSlice(pos, pos + len));

  // Pad the output if necessary.
  if (excerpt.length < len) {
    return excerpt + common.repeat(' ', len - excerpt.length).join('');
  }
  return excerpt;
}

function asEscapedString(obj) {
  if (typeof obj === 'string') {
    // Replace non-printable characters with visible symbols.
    return obj
        .replace(/ /g, DOT_OPERATOR)
        .replace(/\t/g, SYMBOL_FOR_HORIZONTAL_TABULATION)
        .replace(/\n/g, SYMBOL_FOR_LINE_FEED)
        .replace(/\r/g, SYMBOL_FOR_CARRIAGE_RETURN);
  }
  return String(obj);
}

// ----------------- Trace -----------------

function Trace(inputStream, pos, expr, succeeded, bindings, optChildren) {
  this.inputStream = inputStream;
  this.pos = pos;
  this.interval = new Interval(inputStream, pos, inputStream.pos);
  this.expr = expr;
  this.succeeded = succeeded;
  this.bindings = bindings;
  this.children = optChildren || [];

  this.isImplicitSpaces = false;
  this.isLeftRecursive = false;
  this.isMemoized = false;
  this.isRootNode = false;
}

// A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.
Trace.prototype.SKIP = {};

Object.defineProperty(Trace.prototype, 'displayString', {
  get: function() { return this.expr.toDisplayString(); }
});

Trace.prototype.cloneWithExpr = function(expr) {
  var ans = new Trace(
      this.inputStream, this.pos, expr, this.succeeded, this.bindings, this.children);
  ans.isLeftRecursive = this.isLeftRecursive;
  ans.isRootNode = this.isRootNode;
  ans.isMemoized = true;
  return ans;
};

// Recursively traverse this trace node and all its descendents, calling a visitor function
// for each node that is visited. If `vistorObjOrFn` is an object, then its 'enter' property
// is a function to call before visiting the children of a node, and its 'exit' property is
// a function to call afterwards. If `visitorObjOrFn` is a function, it represents the 'enter'
// function.
//
// The functions are called with three arguments: the Trace node, its parent Trace, and a number
// representing the depth of the node in the tree. (The root node has depth 0.) `optThisArg`, if
// specified, is the value to use for `this` when executing the visitor functions.
Trace.prototype.walk = function(visitorObjOrFn, optThisArg) {
  var visitor = visitorObjOrFn;
  if (typeof visitor === 'function') {
    visitor = {enter: visitor};
  }

  function _walk(node, parent, depth) {
    var recurse = true;
    if (visitor.enter) {
      if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
        recurse = false;
      }
    }
    if (recurse) {
      node.children.forEach(function(child, i) {
        var nextChild = node.children[i + 1];
        if (nextChild && nextChild.expr === child.expr && nextChild.pos === child.pos) {
          // Skip this child -- it is an intermediate left-recursive result.
          common.assert(node.isLeftRecursive);
        } else {
          _walk(child, node, depth + 1);
        }
      });
      if (visitor.exit) {
        visitor.exit.call(optThisArg, node, parent, depth);
      }
    }
  }
  if (this.isRootNode) {
    // Don't visit the root node itself, only its children.
    this.children.forEach(function(c) { _walk(c, null, 0); });
  } else {
    _walk(this, null, 0);
  }
};

// Return a string representation of the trace.
// Sample:
//     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
//     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
//     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
Trace.prototype.toString = function() {
  var sb = new common.StringBuffer();
  this.walk(function(node, parent, depth) {
    if (!node) {
      return this.SKIP;
    }
    var ctorName = node.expr.constructor.name;
    // Don't print anything for Alt nodes.
    if (ctorName === 'Alt') {
      return;  // eslint-disable-line consistent-return
    }
    sb.append(getInputExcerpt(node.inputStream, node.pos, 10) + spaces(depth * 2 + 1));
    sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);
    if (node.isLeftRecursive) {
      sb.append(' (LR)');
    }
    if (node.succeeded) {
      var contents = asEscapedString(node.interval.contents);
      sb.append(' ' + RIGHTWARDS_DOUBLE_ARROW + '  ');
      sb.append(typeof contents === 'string' ? '"' + contents + '"' : contents);
    }
    sb.append('\n');
  }.bind(this));
  return sb.contents();
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Trace;

},{"./Interval":32,"./common":39}],39:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var extend = require('util-extend');

// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------

// Helpers

var escapeStringFor = {};
for (var c = 0; c < 128; c++) {
  escapeStringFor[c] = String.fromCharCode(c);
}
escapeStringFor["'".charCodeAt(0)]  = "\\'";
escapeStringFor['"'.charCodeAt(0)]  = '\\"';
escapeStringFor['\\'.charCodeAt(0)] = '\\\\';
escapeStringFor['\b'.charCodeAt(0)] = '\\b';
escapeStringFor['\f'.charCodeAt(0)] = '\\f';
escapeStringFor['\n'.charCodeAt(0)] = '\\n';
escapeStringFor['\r'.charCodeAt(0)] = '\\r';
escapeStringFor['\t'.charCodeAt(0)] = '\\t';
escapeStringFor['\u000b'.charCodeAt(0)] = '\\v';

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.abstract = function() {
  throw new Error(
      'this method is abstract! ' +
      '(it has no implementation in class ' + this.constructor.name + ')');
};

exports.assert = function(cond, message) {
  if (!cond) {
    throw new Error(message);
  }
};

// Define a lazily-computed, non-enumerable property named `propName`
// on the object `obj`. `getterFn` will be called to compute the value the
// first time the property is accessed.
exports.defineLazyProperty = function(obj, propName, getterFn) {
  var memo;
  Object.defineProperty(obj, propName, {
    get: function() {
      if (!memo) {
        memo = getterFn.call(this);
      }
      return memo;
    }
  });
};

exports.clone = function(obj) {
  if (obj) {
    return extend({}, obj);
  }
  return obj;
};

exports.extend = extend;

exports.repeatFn = function(fn, n) {
  var arr = [];
  while (n-- > 0) {
    arr.push(fn());
  }
  return arr;
};

exports.repeatStr = function(str, n) {
  return new Array(n + 1).join(str);
};

exports.repeat = function(x, n) {
  return exports.repeatFn(function() { return x; }, n);
};

exports.getDuplicates = function(array) {
  var duplicates = [];
  for (var idx = 0; idx < array.length; idx++) {
    var x = array[idx];
    if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
      duplicates.push(x);
    }
  }
  return duplicates;
};

exports.copyWithoutDuplicates = function(array) {
  var noDuplicates = [];
  array.forEach(function(entry) {
    if (noDuplicates.indexOf(entry) < 0) {
      noDuplicates.push(entry);
    }
  });
  return noDuplicates;
};

exports.fail = {};

exports.isSyntactic = function(ruleName) {
  var firstChar = ruleName[0];
  return firstChar === firstChar.toUpperCase();
};

exports.isLexical = function(ruleName) {
  return !exports.isSyntactic(ruleName);
};

exports.padLeft = function(str, len, optChar) {
  var ch = optChar || ' ';
  if (str.length < len) {
    return exports.repeatStr(ch, len - str.length) + str;
  }
  return str;
};

// StringBuffer

exports.StringBuffer = function() {
  this.strings = [];
};

exports.StringBuffer.prototype.append = function(str) {
  this.strings.push(str);
};

exports.StringBuffer.prototype.contents = function() {
  return this.strings.join('');
};

// Character escaping and unescaping

exports.escapeChar = function(c, optDelim) {
  var charCode = c.charCodeAt(0);
  if ((c === '"' || c === "'") && optDelim && c !== optDelim) {
    return c;
  } else if (charCode < 128) {
    return escapeStringFor[charCode];
  } else if (128 <= charCode && charCode < 256) {
    return '\\x' + exports.padLeft(charCode.toString(16), 2, '0');
  } else {
    return '\\u' + exports.padLeft(charCode.toString(16), 4, '0');
  }
};

exports.unescapeChar = function(s) {
  if (s.charAt(0) === '\\') {
    switch (s.charAt(1)) {
      case 'b': return '\b';
      case 'f': return '\f';
      case 'n': return '\n';
      case 'r': return '\r';
      case 't': return '\t';
      case 'v': return '\v';
      case 'x': return String.fromCharCode(parseInt(s.substring(2, 4), 16));
      case 'u': return String.fromCharCode(parseInt(s.substring(2, 6), 16));
      default:   return s.charAt(1);
    }
  } else {
    return s;
  }
};

// Helper for producing a description of an unknown object in a safe way.
// Especially useful for error messages where an unexpected type of object was encountered.
exports.unexpectedObjToString = function(obj) {
  if (obj == null) {
    return String(obj);
  }
  var baseToString = Object.prototype.toString.call(obj);
  try {
    var typeName;
    if (obj.constructor && obj.constructor.name) {
      typeName = obj.constructor.name;
    } else if (baseToString.indexOf('[object ') === 0) {
      typeName = baseToString.slice(8, -1);  // Extract e.g. "Array" from "[object Array]".
    } else {
      typeName = typeof obj;
    }
    return typeName + ': ' + JSON.stringify(String(obj));
  } catch (e) {
    return baseToString;
  }
};

},{"util-extend":26}],40:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Namespace = require('./Namespace');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function createError(message, optInterval) {
  var e;
  if (optInterval) {
    e = new Error(optInterval.getLineAndColumnMessage() + message);
    e.shortMessage = message;
    e.interval = optInterval;
  } else {
    e = new Error(message);
  }
  return e;
}

// ----------------- errors about intervals -----------------

function intervalSourcesDontMatch() {
  return createError("Interval sources don't match");
}

// ----------------- errors about grammars -----------------

// Grammar syntax error

function grammarSyntaxError(matchFailure) {
  var e = new Error();
  Object.defineProperty(e, 'message', {get: function() { return matchFailure.message; }});
  Object.defineProperty(e, 'shortMessage', {get: function() {
    return 'Expected ' + matchFailure.getExpectedText();
  }});
  e.interval = matchFailure.getInterval();
  return e;
}

// Undeclared grammar

function undeclaredGrammar(grammarName, namespace, interval) {
  var message = namespace ?
      'Grammar ' + grammarName + ' is not declared in namespace ' + Namespace.toString(namespace) :
      'Undeclared grammar ' + grammarName;
  return createError(message, interval);
}

// Duplicate grammar declaration

function duplicateGrammarDeclaration(grammar, namespace) {
  return createError('Grammar ' + grammar.name + ' is already declared in this namespace');
}

// ----------------- rules -----------------

// Undeclared rule

function undeclaredRule(ruleName, grammarName, optInterval) {
  return createError(
      'Rule ' + ruleName + ' is not declared in grammar ' + grammarName,
      optInterval);
}

// Cannot override undeclared rule

function cannotOverrideUndeclaredRule(ruleName, grammarName, body) {
  return createError(
      'Cannot override rule ' + ruleName + ' because it is not declared in ' + grammarName,
      body.definitionInterval);
}

// Cannot extend undeclared rule

function cannotExtendUndeclaredRule(ruleName, grammarName, body) {
  return createError(
      'Cannot extend rule ' + ruleName + ' because it is not declared in ' + grammarName,
      body.definitionInterval);
}

// Duplicate rule declaration

function duplicateRuleDeclaration(ruleName, offendingGrammarName, declGrammarName, body) {
  var message = "Duplicate declaration for rule '" + ruleName +
      "' in grammar '" + offendingGrammarName + "'";
  if (offendingGrammarName !== declGrammarName) {
    message += " (originally declared in '" + declGrammarName + "')";
  }
  return createError(message, body.definitionInterval);
}

// Wrong number of parameters

function wrongNumberOfParameters(ruleName, expected, actual, body) {
  return createError(
      'Wrong number of parameters for rule ' + ruleName +
          ' (expected ' + expected + ', got ' + actual + ')',
      body && body.definitionInterval);
}

// Wrong number of arguments

function wrongNumberOfArguments(ruleName, expected, actual, expr) {
  return createError(
      'Wrong number of arguments for rule ' + ruleName +
          ' (expected ' + expected + ', got ' + actual + ')',
      expr.interval);
}

// Duplicate parameter names

function duplicateParameterNames(ruleName, duplicates, body) {
  return createError(
      'Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(','),
      body.definitionInterval);
}

// Invalid parameter expression

function invalidParameter(ruleName, expr) {
  return createError(
      'Invalid parameter to rule ' + ruleName + ': ' + expr + ' has arity ' + expr.getArity() +
          ', but parameter expressions ' + 'must have arity 1',
      expr.interval);
}

// Application of syntactic rule from lexical rule

function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
  return createError(
      'Cannot apply syntactic rule ' + ruleName + ' from here (inside a lexical context)',
      applyExpr.interval);
}

function exprMixesValueAndStringExpressions(expr, optRuleName) {
  // TODO: Improve the reporting here.
  var desc =
      (optRuleName ? 'Rule ' + optRuleName : 'Expression') + ' mixes value and string expressions';
  return createError(desc, expr.interval);
}

// ----------------- Kleene operators -----------------

function kleeneExprHasNullableOperand(kleeneExpr) {
  return createError(
      'Nullable expression ' + kleeneExpr.expr.interval.contents + " is not allowed inside '" +
          kleeneExpr.operator + "' (possible infinite loop)",
      kleeneExpr.expr.interval);
}

// ----------------- arity -----------------

function inconsistentArity(ruleName, expected, actual, expr) {
  return createError(
      'Rule ' + ruleName + ' involves an alternation which has inconsistent arity ' +
          '(expected ' + expected + ', got ' + actual + ')',
      expr.interval);
}

// ----------------- properties -----------------

function duplicatePropertyNames(duplicates) {
  return createError('Object pattern has duplicate property names: ' + duplicates.join(', '));
}

// ----------------- constructors -----------------

function invalidConstructorCall(grammar, ctorName, children) {
  return createError(
      'Attempt to invoke constructor ' + ctorName + ' with invalid or unexpected arguments');
}

// ----------------- convenience -----------------

function multipleErrors(errors) {
  var messages = errors.map(function(e) { return e.message; });
  return createError(
      ['Errors:'].concat(messages).join('\n- '),
      errors[0].interval);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  applicationOfSyntacticRuleFromLexicalContext: applicationOfSyntacticRuleFromLexicalContext,
  cannotExtendUndeclaredRule: cannotExtendUndeclaredRule,
  cannotOverrideUndeclaredRule: cannotOverrideUndeclaredRule,
  duplicateGrammarDeclaration: duplicateGrammarDeclaration,
  duplicateParameterNames: duplicateParameterNames,
  duplicatePropertyNames: duplicatePropertyNames,
  duplicateRuleDeclaration: duplicateRuleDeclaration,
  exprMixesValueAndStringExpressions: exprMixesValueAndStringExpressions,
  inconsistentArity: inconsistentArity,
  intervalSourcesDontMatch: intervalSourcesDontMatch,
  invalidConstructorCall: invalidConstructorCall,
  invalidParameter: invalidParameter,
  grammarSyntaxError: grammarSyntaxError,
  kleeneExprHasNullableOperand: kleeneExprHasNullableOperand,
  undeclaredGrammar: undeclaredGrammar,
  undeclaredRule: undeclaredRule,
  wrongNumberOfArguments: wrongNumberOfArguments,
  wrongNumberOfParameters: wrongNumberOfParameters,

  throwErrors: function(errors) {
    if (errors.length === 1) {
      throw errors[0];
    }
    if (errors.length > 1) {
      throw multipleErrors(errors);
    }
  }
};

},{"./Namespace":34}],41:[function(require,module,exports){
/* global document, XMLHttpRequest */

'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Builder = require('./Builder');
var Grammar = require('./Grammar');
var Namespace = require('./Namespace');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');
var util = require('./util');

var isBuffer = require('is-buffer');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
var ohmGrammar;

// An object which makes it possible to stub out the document API for testing.
var documentInterface = {
  querySelector: function(sel) { return document.querySelector(sel); },
  querySelectorAll: function(sel) { return document.querySelectorAll(sel); }
};

// Check if `obj` is a DOM element.
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}

function isUndefined(obj) {
  return obj === void 0;
}

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

function isArrayLike(obj) {
  if (obj == null) {
    return false;
  }
  var length = obj.length;
  return typeof length === 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
}

// TODO: just use the jQuery thing
function load(url) {
  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  try {
    req.send();
    if (req.status === 0 || req.status === 200) {
      return req.responseText;
    }
  } catch (e) {}
  throw new Error('unable to load url ' + url);
}

// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
function buildGrammar(match, namespace, optOhmGrammarForTesting) {
  var builder = new Builder();
  var decl;
  var currentRuleName;
  var currentRuleFormals;
  var overriding = false;
  var metaGrammar = optOhmGrammarForTesting || ohmGrammar;

  // A visitor that produces a Grammar instance from the CST.
  var helpers = metaGrammar.semantics().addOperation('visit', {
    Grammar: function(n, s, open, rs, close) {
      var grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      var g = decl.build();
      g.definitionInterval = this.interval.trimmed();
      if (grammarName in namespace) {
        throw errors.duplicateGrammarDeclaration(g, namespace);
      }
      namespace[grammarName] = g;
      return g;
    },

    SuperGrammar: function(_, n) {
      var superGrammarName = n.visit();
      if (superGrammarName === 'null') {
        decl.withSuperGrammar(null);
      } else {
        if (!namespace || !(superGrammarName in namespace)) {
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.interval);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define: function(n, fs, d, _equals, _optBar, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      var body = b.visit();
      body.definitionInterval = this.interval.trimmed();
      var description = d.visit()[0];
      return decl.define(currentRuleName, currentRuleFormals, body, description);
    },
    Rule_override: function(n, fs, _colonEquals, _optBar, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      overriding = true;
      var body = b.visit();
      body.definitionInterval = this.interval.trimmed();
      var ans = decl.override(currentRuleName, currentRuleFormals, body);
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, fs, _plusEquals, _optBar, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      var body = b.visit();
      var ans = decl.extend(currentRuleName, currentRuleFormals, body);
      decl.ruleBodies[currentRuleName].definitionInterval = this.interval.trimmed();
      return ans;
    },

    Formals: function(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params: function(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt: function(term, _, terms) {
      var args = [term.visit()].concat(terms.visit());
      return builder.alt.apply(builder, args).withInterval(this.interval);
    },

    Term_inline: function(b, n) {
      var inlineRuleName = currentRuleName + '_' + n.visit();
      var body = b.visit();
      body.definitionInterval = this.interval.trimmed();
      var isNewRuleDeclaration =
          !(decl.superGrammar && decl.superGrammar.ruleBodies[inlineRuleName]);
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body);
      }
      var params = currentRuleFormals.map(function(formal) { return builder.app(formal); });
      return builder.app(inlineRuleName, params).withInterval(body.interval);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, expr.visit()).withInterval(this.interval);
    },

    Iter_star: function(x, _) {
      return builder.star(x.visit()).withInterval(this.interval);
    },
    Iter_plus: function(x, _) {
      return builder.plus(x.visit()).withInterval(this.interval);
    },
    Iter_opt: function(x, _) {
      return builder.opt(x.visit()).withInterval(this.interval);
    },

    Pred_not: function(_, x) {
      return builder.not(x.visit()).withInterval(this.interval);
    },
    Pred_lookahead: function(_, x) {
      return builder.la(x.visit()).withInterval(this.interval);
    },

    Modifier_lex: function(_, x) {
      return builder.lex(x.visit()).withInterval(this.interval);
    },
    Modifier_val: function(_, x) {
      return builder.val(x.visit()).withInterval(this.interval);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withInterval(this.interval);
    },
    Base_range: function(from, _, to) {
      return builder.range(from.visit(), to.visit()).withInterval(this.interval);
    },
    Base_prim: function(expr) {
      return builder.prim(expr.visit()).withInterval(this.interval);
    },
    Base_paren: function(open, x, close) {
      return x.visit();
    },
    Base_arr: function(open, x, close) {
      return builder.arr(x.visit()).withInterval(this.interval);
    },
    Base_obj: function(open, lenient, close) {
      return builder.obj([], lenient.visit()[0]);
    },

    Base_objWithProps: function(open, ps, _, lenient, close) {
      return builder.obj(ps.visit(), lenient.visit()[0]).withInterval(this.interval);
    },

    Props: function(p, _, ps) {
      return [p.visit()].concat(ps.visit());
    },
    Prop: function(n, _, p) {
      return {name: n.visit(), pattern: p.visit()};
    },

    ruleDescr: function(open, t, close) {
      return t.visit();
    },
    ruleDescrText: function(_) {
      return this.interval.contents.trim();
    },

    caseName: function(_, space1, n, space2, end) {
      return n.visit();
    },

    name: function(first, rest) {
      return this.interval.contents;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    keyword_null: function(_) {
      return null;
    },
    keyword_true: function(_) {
      return true;
    },
    keyword_false: function(_) {
      return false;
    },

    string: function(open, cs, close) {
      return cs.visit().map(function(c) { return common.unescapeChar(c); }).join('');
    },

    strChar: function(_) {
      return this.interval.contents;
    },

    escapeChar: function(_) {
      return this.interval.contents;
    },

    number: function(_, digits) {
      return parseInt(this.interval.contents);
    },

    NonemptyListOf: function(x, _, xs) {
      return [x.visit()].concat(xs.visit());
    },
    EmptyListOf: function() {
      return [];
    },

    _terminal: function() {
      return this.primitiveValue;
    }
  });
  return helpers(match).visit();
}

function compileAndLoad(source, namespace) {
  var m = ohmGrammar.match(source, 'Grammars');
  if (m.failed()) {
    throw errors.grammarSyntaxError(m);
  }
  return buildGrammar(m, namespace);
}

// Return the contents of a script element, fetching it via XHR if necessary.
function getScriptElementContents(el) {
  if (!isElement(el)) {
    throw new TypeError('Expected a DOM Node, got ' + common.unexpectedObjToString(el));
  }
  if (el.type !== 'text/ohm-js') {
    throw new Error('Expected a script tag with type="text/ohm-js", got ' + el);
  }
  return el.getAttribute('src') ? load(el.getAttribute('src')) : el.innerHTML;
}

function grammar(source, optNamespace) {
  var ns = grammars(source, optNamespace);

  // Ensure that the source contained no more than one grammar definition.
  var grammarNames = Object.keys(ns);
  if (grammarNames.length === 0) {
    throw new Error('Missing grammar definition');
  } else if (grammarNames.length > 1) {
    var secondGrammar = ns[grammarNames[1]];
    var interval = secondGrammar.definitionInterval;
    throw new Error(
        util.getLineAndColumnMessage(interval.inputStream.source, interval.startIdx) +
        'Found more than one grammar definition -- use ohm.grammars() instead.');
  }
  return ns[grammarNames[0]];  // Return the one and only grammar.
}

function grammars(source, optNamespace) {
  var ns = Namespace.extend(Namespace.asNamespace(optNamespace));
  if (typeof source !== 'string') {
    // For convenience, detect Node.js Buffer objects and automatically call toString().
    if (isBuffer(source)) {
      source = source.toString();
    } else {
      throw new TypeError(
          'Expected string as first argument, got ' + common.unexpectedObjToString(source));
    }
  }
  compileAndLoad(source, ns);
  return ns;
}

function grammarFromScriptElement(optNode) {
  var node = optNode;
  if (isUndefined(node)) {
    var nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
    if (nodeList.length !== 1) {
      throw new Error(
          'Expected exactly one script tag with type="text/ohm-js", found ' + nodeList.length);
    }
    node = nodeList[0];
  }
  return grammar(getScriptElementContents(node));
}

function grammarsFromScriptElements(optNodeOrNodeList) {
  // Simple case: the argument is a DOM node.
  if (isElement(optNodeOrNodeList)) {
    return grammars(optNodeOrNodeList);
  }
  // Otherwise, it must be either undefined or a NodeList.
  var nodeList = optNodeOrNodeList;
  if (isUndefined(nodeList)) {
    // Find all script elements with type="text/ohm-js".
    nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
  } else if (typeof nodeList === 'string' || (!isElement(nodeList) && !isArrayLike(nodeList))) {
    throw new TypeError('Expected a Node, NodeList, or Array, but got ' + nodeList);
  }
  var ns = Namespace.createNamespace();
  for (var i = 0; i < nodeList.length; ++i) {
    // Copy the new grammars into `ns` to keep the namespace flat.
    common.extend(ns, grammars(getScriptElementContents(nodeList[i]), ns));
  }
  return ns;
}

function makeRecipe(recipeFn) {
  return recipeFn.call(new Builder());
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Stuff that users should know about
module.exports = {
  createNamespace: Namespace.createNamespace,
  grammar: grammar,
  grammars: grammars,
  grammarFromScriptElement: grammarFromScriptElement,
  grammarsFromScriptElements: grammarsFromScriptElements,
  makeRecipe: makeRecipe,
  ohmGrammar: null,  // Initialized below, after Grammar.BuiltInRules.
  pexprs: pexprs,
  util: util,
  extras: require('../extras')
};

// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function(doc) { documentInterface = doc; };

// Late initialization for stuff that is bootstrapped.

Grammar.BuiltInRules = require('../dist/built-in-rules');

var Semantics = require('./Semantics');
var operationsAndAttributesGrammar = require('../dist/operations-and-attributes');
Semantics.initBuiltInSemantics(Grammar.BuiltInRules);
Semantics.initPrototypeParser(operationsAndAttributesGrammar);  // requires BuiltInSemantics

module.exports.ohmGrammar = ohmGrammar = require('../dist/ohm-grammar');
Grammar.initApplicationParser(ohmGrammar, buildGrammar);

},{"../dist/built-in-rules":1,"../dist/ohm-grammar":2,"../dist/operations-and-attributes":3,"../extras":4,"./Builder":27,"./Grammar":29,"./Namespace":34,"./Semantics":36,"./common":39,"./errors":40,"./pexprs":60,"./util":61,"is-buffer":25}],42:[function(require,module,exports){
'use strict';

var inherits = require('inherits');

var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node(grammar, ctorName, children, interval) {
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.children = children;
  this.interval = interval;
}

Node.prototype.numChildren = function() {
  return this.children.length;
};

Node.prototype.childAt = function(idx) {
  return this.children[idx];
};

Node.prototype.indexOfChild = function(arg) {
  return this.children.indexOf(arg);
};

Node.prototype.hasChildren = function() {
  return this.children.length > 0;
};

Node.prototype.hasNoChildren = function() {
  return !this.hasChildren();
};

Node.prototype.onlyChild = function() {
  if (this.children.length !== 1) {
    throw new Error(
        'cannot get only child of a node of type ' + this.ctorName +
        ' (it has ' + this.numChildren() + ' children)');
  } else {
    return this.firstChild();
  }
};

Node.prototype.firstChild = function() {
  if (this.hasNoChildren()) {
    throw new Error(
        'cannot get first child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(0);
  }
};

Node.prototype.lastChild = function() {
  if (this.hasNoChildren()) {
    throw new Error(
        'cannot get last child of a ' + this.ctorName + ' node, which has no children');
  } else {
    return this.childAt(this.numChildren() - 1);
  }
};

Node.prototype.childBefore = function(child) {
  var childIdx = this.indexOfChild(child);
  if (childIdx < 0) {
    throw new Error('Node.childBefore() called w/ an argument that is not a child');
  } else if (childIdx === 0) {
    throw new Error('cannot get child before first child');
  } else {
    return this.childAt(childIdx - 1);
  }
};

Node.prototype.childAfter = function(child) {
  var childIdx = this.indexOfChild(child);
  if (childIdx < 0) {
    throw new Error('Node.childAfter() called w/ an argument that is not a child');
  } else if (childIdx === this.numChildren() - 1) {
    throw new Error('cannot get child after last child');
  } else {
    return this.childAt(childIdx + 1);
  }
};

Node.prototype.isTerminal = function() {
  return false;
};

Node.prototype.isNonterminal = function() {
  return false;
};

Node.prototype.isIteration = function() {
  return false;
};

Node.prototype.isOptional = function() {
  return false;
};

Node.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.children;
  return r;
};

// Terminals

function TerminalNode(grammar, value, interval) {
  Node.call(this, grammar, '_terminal', [], interval);
  this.primitiveValue = value;
}
inherits(TerminalNode, Node);

TerminalNode.prototype.isTerminal = function() {
  return true;
};

// Nonterminals

function NonterminalNode(grammar, ruleName, children, interval) {
  Node.call(this, grammar, ruleName, children, interval);
}
inherits(NonterminalNode, Node);

NonterminalNode.prototype.isNonterminal = function() {
  return true;
};

NonterminalNode.prototype.isLexical = function() {
  return common.isLexical(this.ctorName);
};

NonterminalNode.prototype.isSyntactic = function() {
  return common.isSyntactic(this.ctorName);
};

// Iterations

function IterationNode(grammar, children, interval, optional) {
  Node.call(this, grammar, '_iter', children, interval);
  this.optional = optional;
}
inherits(IterationNode, Node);

IterationNode.prototype.isIteration = function() {
  return true;
};

IterationNode.prototype.isOptional = function() {
  return this.optional;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = {
  Node: Node,
  TerminalNode: TerminalNode,
  NonterminalNode: NonterminalNode,
  IterationNode: IterationNode
};

},{"./common":39,"inherits":24}],43:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Return true if we should skip spaces preceding this expression in a syntactic context.
*/
pexprs.PExpr.prototype.allowsSkippingPrecedingSpace = common.abstract;

/*
  Generally, these are all first-order expressions that operate on strings and (with the
  exception of Apply) directly read from the input stream.
*/
pexprs.any.allowsSkippingPrecedingSpace =
pexprs.end.allowsSkippingPrecedingSpace =
pexprs.Apply.prototype.allowsSkippingPrecedingSpace =
pexprs.Prim.prototype.allowsSkippingPrecedingSpace =
pexprs.Range.prototype.allowsSkippingPrecedingSpace =
pexprs.UnicodeChar.prototype.allowsSkippingPrecedingSpace = function() {
  return true;
};

/*
  Higher-order expressions that don't directly consume input, and expressions that
  don't operate on string input streams (e.g. Obj and Arr).
*/
pexprs.Alt.prototype.allowsSkippingPrecedingSpace =
pexprs.Arr.prototype.allowsSkippingPrecedingSpace =
pexprs.Iter.prototype.allowsSkippingPrecedingSpace =
pexprs.Lex.prototype.allowsSkippingPrecedingSpace =
pexprs.Lookahead.prototype.allowsSkippingPrecedingSpace =
pexprs.Not.prototype.allowsSkippingPrecedingSpace =
pexprs.Obj.prototype.allowsSkippingPrecedingSpace =
pexprs.Param.prototype.allowsSkippingPrecedingSpace =
pexprs.Seq.prototype.allowsSkippingPrecedingSpace =
pexprs.TypeCheck.prototype.allowsSkippingPrecedingSpace =
pexprs.Value.prototype.allowsSkippingPrecedingSpace = function() {
  return false;
};

},{"./common":39,"./pexprs":60}],44:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

var lexifyCount;

pexprs.PExpr.prototype.assertAllApplicationsAreValid = function(ruleName, grammar) {
  lexifyCount = 0;
  this._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.PExpr.prototype._assertAllApplicationsAreValid = common.abstract;

pexprs.any._assertAllApplicationsAreValid =
pexprs.end._assertAllApplicationsAreValid =
pexprs.Prim.prototype._assertAllApplicationsAreValid =
pexprs.Range.prototype._assertAllApplicationsAreValid =
pexprs.Param.prototype._assertAllApplicationsAreValid =
pexprs.TypeCheck.prototype._assertAllApplicationsAreValid =
pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  // no-op
};

pexprs.Lex.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  lexifyCount++;
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
  lexifyCount--;
};

pexprs.Alt.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Seq.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Iter.prototype._assertAllApplicationsAreValid =
pexprs.Not.prototype._assertAllApplicationsAreValid =
pexprs.Lookahead.prototype._assertAllApplicationsAreValid =
pexprs.Value.prototype._assertAllApplicationsAreValid =
pexprs.Arr.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
};

pexprs.Obj.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern._assertAllApplicationsAreValid(ruleName, grammar);
  }
};

pexprs.Apply.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  var body = grammar.ruleBodies[this.ruleName];

  // Make sure that the rule exists...
  if (!body) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.interval);
  }

  // ...and that this application is allowed
  if (common.isSyntactic(this.ruleName) && (!common.isSyntactic(ruleName) || lexifyCount > 0)) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }

  // ...and that this application has the correct number of arguments
  var actual = this.args.length;
  var expected = grammar.ruleFormals[this.ruleName].length;
  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this);
  }

  // ...and that all of the argument expressions only have valid applications and have arity 1.
  var self = this;
  this.args.forEach(function(arg) {
    arg._assertAllApplicationsAreValid(ruleName, grammar);
    if (arg.getArity() !== 1) {
      throw errors.invalidParameter(self.ruleName, arg);
    }
  });
};

},{"./common":39,"./errors":40,"./pexprs":60}],45:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract;

pexprs.any.assertChoicesHaveUniformArity =
pexprs.end.assertChoicesHaveUniformArity =
pexprs.Prim.prototype.assertChoicesHaveUniformArity =
pexprs.Range.prototype.assertChoicesHaveUniformArity =
pexprs.Param.prototype.assertChoicesHaveUniformArity =
pexprs.Lex.prototype.assertChoicesHaveUniformArity =
pexprs.TypeCheck.prototype.assertChoicesHaveUniformArity =
pexprs.UnicodeChar.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  if (this.terms.length === 0) {
    return;
  }
  var arity = this.terms[0].getArity();
  for (var idx = 0; idx < this.terms.length; idx++) {
    var term = this.terms[idx];
    term.assertChoicesHaveUniformArity();
    var otherArity = term.getArity();
    if (arity !== otherArity) {
      throw errors.inconsistentArity(ruleName, arity, otherArity, term);
    }
  }
};

pexprs.Extend.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // Extend is a special case of Alt that's guaranteed to have exactly two
  // cases: [extensions, origBody].
  var actualArity = this.terms[0].getArity();
  var expectedArity = this.terms[1].getArity();
  if (actualArity !== expectedArity) {
    throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
  }
};

pexprs.Seq.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Iter.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Not.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // no-op (not required b/c the nested expr doesn't show up in the CST)
};

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity =
pexprs.Arr.prototype.assertChoicesHaveUniformArity =
pexprs.Value.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Obj.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertChoicesHaveUniformArity(ruleName);
  }
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // The arities of the parameter expressions is required to be 1 by
  // `assertAllApplicationsAreValid()`.
};

},{"./common":39,"./errors":40,"./pexprs":60}],46:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = common.abstract;

pexprs.any.assertIteratedExprsAreNotNullable =
pexprs.end.assertIteratedExprsAreNotNullable =
pexprs.Prim.prototype.assertIteratedExprsAreNotNullable =
pexprs.Range.prototype.assertIteratedExprsAreNotNullable =
pexprs.Param.prototype.assertIteratedExprsAreNotNullable =
pexprs.TypeCheck.prototype.assertIteratedExprsAreNotNullable =
pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  // no-op
};

pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    this.terms[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    this.factors[idx].assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  // Note: this is the implementation of this method for `Star` and `Plus` expressions.
  // It is overridden for `Opt` below.
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
  if (this.expr.isNullable(grammar)) {
    throw errors.kleeneExprHasNullableOperand(this, ruleName);
  }
};

pexprs.Opt.prototype.assertIteratedExprsAreNotNullable =
pexprs.Not.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable =
pexprs.Lex.prototype.assertIteratedExprsAreNotNullable =
pexprs.Value.prototype.assertIteratedExprsAreNotNullable =
pexprs.Arr.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
};

pexprs.Obj.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  for (var idx = 0; idx < this.properties.length; idx++) {
    this.properties[idx].pattern.assertIteratedExprsAreNotNullable(grammar, ruleName);
  }
};

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.args.forEach(function(arg) {
    arg.assertIteratedExprsAreNotNullable(grammar, ruleName);
  });
};

},{"./common":39,"./errors":40,"./pexprs":60}],47:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Checks that no PExpr combines a value expression (e.g., `null`, `3`) with a string fragment
// expression (e.g., `"blah"`).
pexprs.PExpr.prototype.assertValuesAndStringsAreNotMixed = function(grammar, ruleName) {
  var memo = Object.create(null);
  memo[ruleName] = pexprs.TYPE_ANY;  // Initialize memo table for the rule we are checking.
  this.getExprType(grammar, memo);
};

},{"./pexprs":60}],48:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var nodes = require('./nodes');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.check = common.abstract;

pexprs.any.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.end.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         vals[0].primitiveValue === undefined;
};

pexprs.Prim.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         vals[0].primitiveValue === this.obj;
};

pexprs.Range.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === typeof this.from;
};

pexprs.Param.prototype.check = function(grammar, vals) {
  return vals.length >= 1;
};

pexprs.Alt.prototype.check = function(grammar, vals) {
  for (var i = 0; i < this.terms.length; i++) {
    var term = this.terms[i];
    if (term.check(grammar, vals)) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.check = function(grammar, vals) {
  var pos = 0;
  for (var i = 0; i < this.factors.length; i++) {
    var factor = this.factors[i];
    if (factor.check(grammar, vals.slice(pos))) {
      pos += factor.getArity();
    } else {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.check = function(grammar, vals) {
  var arity = this.getArity();
  var columns = vals.slice(0, arity);
  if (columns.length !== arity) {
    return false;
  }
  var rowCount = columns[0].length;
  var i;
  for (i = 1; i < arity; i++) {
    if (columns[i].length !== rowCount) {
      return false;
    }
  }

  for (i = 0; i < rowCount; i++) {
    var row = [];
    for (var j = 0; j < arity; j++) {
      row.push(columns[j][i]);
    }
    if (!this.expr.check(grammar, row)) {
      return false;
    }
  }

  return true;
};

pexprs.Not.prototype.check = function(grammar, vals) {
  return true;
};

pexprs.Lookahead.prototype.check =
pexprs.Lex.prototype.check =
pexprs.Value.prototype.check =
pexprs.Arr.prototype.check = function(grammar, vals) {
  return this.expr.check(grammar, vals);
};

pexprs.Obj.prototype.check = function(grammar, vals) {
  var fixedArity = this.getArity();
  if (this.isLenient) {
    fixedArity--;
  }

  var pos = 0;
  for (var i = 0; i < fixedArity; i++) {
    var pattern = this.properties[i].pattern;
    if (pattern.check(grammar, vals.slice(pos))) {
      pos += pattern.getArity();
    } else {
      return false;
    }
  }

  return this.isLenient ? typeof vals[pos] === 'object' && vals[pos] : true;
};

pexprs.Apply.prototype.check = function(grammar, vals) {
  if (!(vals[0] instanceof nodes.Node &&
        vals[0].grammar === grammar &&
        vals[0].ctorName === this.ruleName)) {
    return false;
  }

  // TODO: think about *not* doing the following checks, i.e., trusting that the rule
  // was correctly constructed.
  var ruleNode = vals[0];
  var body = grammar.ruleBodies[this.ruleName];
  return body.check(grammar, ruleNode.children) && ruleNode.numChildren() === body.getArity();
};

pexprs.UnicodeChar.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === 'string';
};

pexprs.TypeCheck.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         typeof vals[0].primitiveValue === this.type;
};

},{"./common":39,"./nodes":42,"./pexprs":60}],49:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream');
var Trace = require('./Trace');
var common = require('./common');
var nodes = require('./nodes');
var pexprs = require('./pexprs');

var TerminalNode = nodes.TerminalNode;
var NonterminalNode = nodes.NonterminalNode;
var IterationNode = nodes.IterationNode;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// A safer version of hasOwnProperty.
var hasOwnProp = Object.prototype.hasOwnProperty;

/*
  Evaluate the expression and return `true` if it succeeds, `false` otherwise. This method should
  only be called directly by `State.prototype.eval(expr)`, which also updates the data structures
  that are used for tracing. (Making those updates in a method of `State` enables the trace-specific
  data structures to be "secrets" of that class, which is good for modularity.)

  The contract of this method is as follows:
  * When the return value is `true`,
    - the state object will have `expr.getArity()` more bindings than it did before the call.
  * When the return value is `false`,
    - the state object may have more bindings than it did before the call, and
    - its input stream's position may be anywhere.

  Note that `State.prototype.eval(expr)`, unlike this method, guarantees that neither the state
  object's bindings nor its input stream's position will change if the expression fails to match.
*/
pexprs.PExpr.prototype.eval = common.abstract;  // function(state) { ... }

pexprs.any.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (value === common.fail) {
    state.processFailure(origPos, this);
    return false;
  } else {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, value, interval));
    return true;
  }
};

pexprs.end.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (inputStream.atEnd()) {
    var interval = inputStream.interval(inputStream.pos);
    state.bindings.push(new TerminalNode(state.grammar, undefined, interval));
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Prim.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (this.match(inputStream) === common.fail) {
    state.processFailure(origPos, this);
    return false;
  } else {
    var interval = inputStream.interval(origPos);
    var primitiveValue = this.obj;
    state.bindings.push(new TerminalNode(state.grammar, primitiveValue, interval));
    return true;
  }
};

pexprs.Prim.prototype.match = function(inputStream) {
  return typeof this.obj === 'string' ?
      inputStream.matchString(this.obj) :
      inputStream.matchExactly(this.obj);
};

pexprs.Range.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var obj = inputStream.next();
  if (typeof obj === typeof this.from && this.from <= obj && obj <= this.to) {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, obj, interval));
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Param.prototype.eval = function(state) {
  return state.eval(state.currentApplication().args[this.index]);
};

pexprs.Lex.prototype.eval = function(state) {
  state.enterLexifiedContext();
  var ans = state.eval(this.expr);
  state.exitLexifiedContext();
  return ans;
};

pexprs.Alt.prototype.eval = function(state) {
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (state.eval(this.terms[idx])) {
      return true;
    }
  }
  return false;
};

pexprs.Seq.prototype.eval = function(state) {
  for (var idx = 0; idx < this.factors.length; idx++) {
    var factor = this.factors[idx];
    if (!state.eval(factor)) {
      return false;
    }
  }
  return true;
};

pexprs.Iter.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var arity = this.getArity();
  var cols = [];
  while (cols.length < arity) {
    cols.push([]);
  }
  var numMatches = 0;
  var idx;
  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    numMatches++;
    var row = state.bindings.splice(state.bindings.length - arity, arity);
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  var interval;
  if (numMatches === 0) {
    interval = inputStream.interval(origPos, origPos);
  } else {
    var firstCol = cols[0];
    var lastCol = cols[cols.length - 1];
    interval = inputStream.interval(
        firstCol[0].interval.startIdx,
        lastCol[lastCol.length - 1].interval.endIdx);
  }
  for (idx = 0; idx < cols.length; idx++) {
    state.bindings.push(new IterationNode(state.grammar, cols[idx], interval,
      this instanceof pexprs.Opt));
  }
  return true;
};

pexprs.Not.prototype.eval = function(state) {
  /*
    TODO:
    - Right now we're just throwing away all of the failures that happen inside a `not`, and
      recording `this` as a failed expression.
    - Double negation should be equivalent to lookahead, but that's not the case right now wrt
      failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
      a failure for 'foo' instead.
  */

  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var failuresInfo = state.getFailuresInfo();

  var ans = state.eval(this.expr);

  state.restoreFailuresInfo(failuresInfo);
  if (ans) {
    state.processFailure(origPos, this);
    return false;
  }

  inputStream.pos = origPos;
  return true;
};

pexprs.Lookahead.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (state.eval(this.expr)) {
    inputStream.pos = origPos;
    return true;
  } else {
    return false;
  }
};

pexprs.Arr.prototype.eval = function(state) {
  var obj = state.inputStream.next();
  if (Array.isArray(obj)) {
    state.pushInputStream(InputStream.newFor(obj));
    var ans = state.eval(this.expr) && state.inputStream.atEnd();
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Value.prototype.eval = function(state) {
  var obj = state.inputStream.next();
  if (typeof obj === 'string') {
    state.pushInputStream(InputStream.newFor(obj));
    var ans = state.eval(this.expr) && state.inputStream.atEnd();
    state.popInputStream();
    return ans;
  } else {
    return false;
  }
};

pexprs.Obj.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var obj = inputStream.next();
  if (obj !== common.fail && obj && (typeof obj === 'object' || typeof obj === 'function')) {
    var numOwnPropertiesMatched = 0;
    for (var idx = 0; idx < this.properties.length; idx++) {
      var property = this.properties[idx];
      if (!hasOwnProp.call(obj, property.name)) {
        return false;
      }
      var value = obj[property.name];
      var expr = property.pattern;
      state.pushInputStream(expr.newInputStreamFor([value], state.grammar));
      var matched = state.eval(expr) && state.inputStream.atEnd();
      state.popInputStream();
      if (!matched) {
        return false;
      }
      numOwnPropertiesMatched++;
    }
    if (this.isLenient) {
      var remainder = {};
      for (var p in obj) {
        if (hasOwnProp.call(obj, p) && this.properties.indexOf(p) < 0) {
          remainder[p] = obj[p];
        }
      }
      var interval = inputStream.interval(origPos);
      state.bindings.push(new TerminalNode(state.grammar, remainder, interval));
      return true;
    } else {
      return numOwnPropertiesMatched === Object.keys(obj).length;
    }
  } else {
    return false;
  }
};

pexprs.Apply.prototype.eval = function(state) {
  var caller = state.currentApplication();
  var actuals = caller ? caller.args : [];
  var app = this.substituteParams(actuals);

  var posInfo = state.getCurrentPosInfo();
  if (posInfo.isActive(app)) {
    // This rule is already active at this position, i.e., it is left-recursive.
    return app.handleCycle(state);
  }

  var memoKey = app.toMemoKey();
  var memoRec = posInfo.memo[memoKey];
  return memoRec && posInfo.shouldUseMemoizedResult(memoRec) ?
      state.useMemoizedResult(memoRec) :
      app.reallyEval(state);
};

pexprs.Apply.prototype.handleCycle = function(state) {
  var posInfo = state.getCurrentPosInfo();
  var currentLeftRecursion = posInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var memoRec = posInfo.memo[memoKey];

  if (currentLeftRecursion && currentLeftRecursion.headApplication.toMemoKey() === memoKey) {
    // We already know about this left recursion, but it's possible there are "involved
    // applications" that we don't already know about, so...
    memoRec.updateInvolvedApplicationMemoKeys();
  } else if (!memoRec) {
    // New left recursion detected! Memoize a failure to try to get a seed parse.
    memoRec = posInfo.memo[memoKey] = {pos: -1, value: false};
    posInfo.startLeftRecursion(this, memoRec);
  }
  return state.useMemoizedResult(memoRec);
};

pexprs.Apply.prototype.reallyEval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origPosInfo = state.getCurrentPosInfo();
  var body = state.grammar.ruleBodies[this.ruleName];
  var description = state.grammar.ruleDescriptions[this.ruleName];

  origPosInfo.enter(this);

  if (description) {
    var origFailuresInfo = state.getFailuresInfo();
  }

  var value = this.evalOnce(body, state);
  var currentLR = origPosInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
  var memoized = true;

  if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value);
    origPosInfo.endLeftRecursion();
  } else if (currentLR && currentLR.isInvolved(memoKey)) {
    // Don't memoize the result
    memoized = false;
  } else {
    origPosInfo.memo[memoKey] = {
      pos: inputStream.pos,
      value: value,
      failuresAtRightmostPosition: state.cloneRightmostFailures()
    };
  }

  if (description) {
    state.restoreFailuresInfo(origFailuresInfo);
    if (!value) {
      state.processFailure(origPos, this);
    }

    if (memoized) {
      origPosInfo.memo[memoKey].failuresAtRightmostPosition = state.cloneRightmostFailures();
    }
  }

  // Record trace information in the memo table, so that it is available if the memoized result
  // is used later.
  if (state.isTracing() && origPosInfo.memo[memoKey]) {
    var succeeded = !!value;
    var entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);
    entry.isLeftRecursive = isHeadOfLeftRecursion;
    origPosInfo.memo[memoKey].traceEntry = entry;
  }

  origPosInfo.exit();

  if (value) {
    state.bindings.push(value);
    return true;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.evalOnce = function(expr, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  // If `matchNodes` is true and the next thing in the input stream is a Node whose type matches
  // this rule, then accept that as a valid match -- but not for the top-level application.
  if (state.matchNodes && state.applicationStack.length > 1) {
    var node = inputStream.next();
    if (node instanceof nodes.Node &&
        node.grammar === state.grammar &&
        node.ctorName === this.ruleName) {
      return node;
    } else {
      inputStream.pos = origPos;
    }
  }

  if (state.eval(expr)) {
    var arity = expr.getArity();
    var bindings = state.bindings.splice(state.bindings.length - arity, arity);
    var ans =
        new NonterminalNode(state.grammar, this.ruleName, bindings, inputStream.interval(origPos));
    return ans;
  } else {
    return false;
  }
};

pexprs.Apply.prototype.growSeedResult = function(body, state, origPos, lrMemoRec, newValue) {
  if (!newValue) {
    return false;
  }

  var inputStream = state.inputStream;

  while (true) {
    lrMemoRec.pos = inputStream.pos;
    lrMemoRec.value = newValue;
    lrMemoRec.failuresAtRightmostPosition = state.cloneRightmostFailures();

    if (state.isTracing()) {
      // Before evaluating the body again, add a trace node for this application to the memo entry.
      // Its only child is the trace node from `newValue`, which will always be the last element
      // in `state.trace`.
      var children = state.trace.slice(-1);
      lrMemoRec.traceEntry = new Trace(
          state.inputStream, origPos, this, true, [newValue], children);
    }
    inputStream.pos = origPos;
    newValue = this.evalOnce(body, state);
    if (inputStream.pos <= lrMemoRec.pos) {
      break;
    }
  }
  if (state.isTracing()) {
    state.trace.pop();  // Drop last trace entry since `value` was unused.
    lrMemoRec.traceEntry = null;
  }
  inputStream.pos = lrMemoRec.pos;
  return lrMemoRec.value;
};

pexprs.UnicodeChar.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (value === common.fail || !this.pattern.test(value)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, value, interval));
    return true;
  }
};

pexprs.TypeCheck.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var value = inputStream.next();
  if (typeof value === this.type) {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, value, interval));
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

},{"./InputStream":31,"./Trace":38,"./common":39,"./nodes":42,"./pexprs":60}],50:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = common.abstract;

pexprs.any.getArity =
pexprs.end.getArity =
pexprs.Prim.prototype.getArity =
pexprs.Range.prototype.getArity =
pexprs.Param.prototype.getArity =
pexprs.Apply.prototype.getArity =
pexprs.TypeCheck.prototype.getArity =
pexprs.UnicodeChar.prototype.getArity = function() {
  return 1;
};

pexprs.Alt.prototype.getArity = function() {
  // This is ok b/c all terms must have the same arity -- this property is
  // checked by the Grammar constructor.
  return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};

pexprs.Seq.prototype.getArity = function() {
  var arity = 0;
  for (var idx = 0; idx < this.factors.length; idx++) {
    arity += this.factors[idx].getArity();
  }
  return arity;
};

pexprs.Iter.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Not.prototype.getArity = function() {
  return 0;
};

pexprs.Lookahead.prototype.getArity =
pexprs.Lex.prototype.getArity =
pexprs.Value.prototype.getArity =
pexprs.Arr.prototype.getArity = function() {
  return this.expr.getArity();
};

pexprs.Obj.prototype.getArity = function() {
  var arity = this.isLenient ? 1 : 0;
  for (var idx = 0; idx < this.properties.length; idx++) {
    arity += this.properties[idx].pattern.getArity();
  }
  return arity;
};

},{"./common":39,"./pexprs":60}],51:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

function typeFromPrimitive(prim) {
  return typeof prim === 'string' ? pexprs.TYPE_STRING : pexprs.TYPE_VALUE;
}

/*
  Returns the type of this PExpr -- one of `TYPE_STRING`, `TYPE_VALUE`, or `TYPE_ANY`.
  String expressions (e.g. `"foo"`) and value expressions (e.g., `null`, `3`) cannot be combined
  with each other, but they may be combined with TYPE_ANY expressions. An exception is thrown if
  an expression with inconsistent types is encountered.

  The result of this method is cached as a property on the node. For rule applications, the
  result is cached in a separate memo table, so that the result can be shared for all `Apply`
  nodes having the same parameters.
*/
pexprs.PExpr.prototype.getExprType = function(grammar, optMemo) {
  if (!this.hasOwnProperty('_exprType')) {
    var memo = optMemo || Object.create(null);
    Object.defineProperty(this, '_exprType', {
      value: this._calculateExprType(grammar, memo)
    });
  }
  return this._exprType;
};

/*
  The actual implementation of getExprType, with no caching logic. These implementations
  should only be invoked directly by the implementation of getExprType above.
*/
pexprs.PExpr.prototype._calculateExprType = common.abstract;

pexprs.any._calculateExprType =
pexprs.UnicodeChar.prototype._calculateExprType = function(grammar, memo) {
  return pexprs.TYPE_STRING;
};

pexprs.end._calculateExprType = function(grammar, memo) {
  return pexprs.TYPE_ANY;
};

pexprs.Range.prototype._calculateExprType = function(grammar, memo) {
  return typeFromPrimitive(this.from) | typeFromPrimitive(this.to);
};

pexprs.Arr.prototype._calculateExprType =
pexprs.Obj.prototype._calculateExprType =
pexprs.TypeCheck.prototype._calculateExprType =
pexprs.Value.prototype._calculateExprType = function(grammar, memo) {
  return pexprs.TYPE_VALUE;
};

pexprs.Prim.prototype._calculateExprType = function(grammar, memo) {
  return typeFromPrimitive(this.obj);
};

pexprs.Alt.prototype._calculateExprType = function(grammar, memo) {
  var ans = this.terms.reduce(function(acc, t) {
    return acc | t.getExprType(grammar, memo);
  }, 0);
  if (ans === pexprs.TYPE_INCONSISTENT) {
    throw errors.exprMixesValueAndStringExpressions(this);
  }
  return ans;
};

pexprs.Seq.prototype._calculateExprType = function(grammar, memo) {
  var ans = this.factors.reduce(function(acc, f) {
    return acc | f.getExprType(grammar, memo);
  }, 0);
  if (ans === pexprs.TYPE_INCONSISTENT) {
    throw errors.exprMixesValueAndStringExpressions(this);
  }
  return ans;
};

pexprs.Iter.prototype._calculateExprType =
pexprs.Not.prototype._calculateExprType =
pexprs.Lookahead.prototype._calculateExprType =
pexprs.Lex.prototype._calculateExprType = function(grammar, memo) {
  return this.expr.getExprType(grammar, memo);
};

pexprs.Param.prototype._calculateExprType = function(grammar, memo) {
  // Throwing an error here ensures that we never calculate and cache the result of an
  // expression containing unbound parameters, because it could be incorrect.
  throw new Error('Cannot calculate _calculateExprType for unbound parameter');
};

pexprs.Apply.prototype._calculateExprType = function(grammar, memo) {
  var key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var inlinedBody = grammar.ruleBodies[this.ruleName].substituteParams(this.args);

    // Initialize a memo value to prevent infinite recursion for recursive rules.
    // Use TYPE_ANY because it is the identity of the bitwise 'or' operator, ensuring that a rule
    // like 'x = x | String' will return `TYPE_STRING`.
    memo[key] = pexprs.TYPE_ANY;

    memo[key] = inlinedBody.getExprType(grammar, memo);
  }
  return memo[key];
};

},{"./common":39,"./errors":40,"./pexprs":60}],52:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Called at grammar creation time to rewrite a rule body, replacing each reference to a formal
  parameter with a `Param` node. Returns a PExpr -- either a new one, or the original one if
  it was modified in place.
*/
pexprs.PExpr.prototype.introduceParams = common.abstract;

pexprs.any.introduceParams =
pexprs.end.introduceParams =
pexprs.Prim.prototype.introduceParams =
pexprs.Range.prototype.introduceParams =
pexprs.Param.prototype.introduceParams =
pexprs.TypeCheck.prototype.introduceParams =
pexprs.UnicodeChar.prototype.introduceParams = function(formals) {
  return this;
};

pexprs.Alt.prototype.introduceParams = function(formals) {
  this.terms.forEach(function(term, idx, terms) {
    terms[idx] = term.introduceParams(formals);
  });
  return this;
};

pexprs.Seq.prototype.introduceParams = function(formals) {
  this.factors.forEach(function(factor, idx, factors) {
    factors[idx] = factor.introduceParams(formals);
  });
  return this;
};

pexprs.Iter.prototype.introduceParams =
pexprs.Not.prototype.introduceParams =
pexprs.Lookahead.prototype.introduceParams =
pexprs.Lex.prototype.introduceParams =
pexprs.Value.prototype.introduceParams =
pexprs.Arr.prototype.introduceParams = function(formals) {
  this.expr = this.expr.introduceParams(formals);
  return this;
};

pexprs.Obj.prototype.introduceParams = function(formals) {
  this.properties.forEach(function(property, idx) {
    property.pattern = property.pattern.introduceParams(formals);
  });
  return this;
};

pexprs.Apply.prototype.introduceParams = function(formals) {
  var index = formals.indexOf(this.ruleName);
  if (index >= 0) {
    if (this.args.length > 0) {
      // TODO: Should this be supported? See issue #64.
      throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
    }
    return new pexprs.Param(index);
  } else {
    this.args.forEach(function(arg, idx, args) {
      args[idx] = arg.introduceParams(formals);
    });
    return this;
  }
};

},{"./common":39,"./pexprs":60}],53:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns `true` if this parsing expression may accept without consuming any input.
pexprs.PExpr.prototype.isNullable = function(grammar) {
  return this._isNullable(grammar, Object.create(null));
};

pexprs.PExpr.prototype._isNullable = common.abstract;

pexprs.any._isNullable =
pexprs.Range.prototype._isNullable =
pexprs.Param.prototype._isNullable =
pexprs.Plus.prototype._isNullable =
pexprs.Value.prototype._isNullable =
pexprs.Arr.prototype._isNullable =
pexprs.Obj.prototype._isNullable =
pexprs.TypeCheck.prototype._isNullable =
pexprs.UnicodeChar.prototype._isNullable = function(grammar, memo) {
  return false;
};

pexprs.end._isNullable = function(grammar, memo) {
  return true;
};

pexprs.Prim.prototype._isNullable = function(grammar, memo) {
  if (typeof this.obj === 'string') {
    // This is an over-simplification: it's only correct if the input is a string. If it's an array
    // or an object, then the empty string parsing expression is not nullable.
    return this.obj === '';
  } else {
    return false;
  }
};

pexprs.Alt.prototype._isNullable = function(grammar, memo) {
  return this.terms.length === 0 ||
      this.terms.some(function(term) { return term._isNullable(grammar, memo); });
};

pexprs.Seq.prototype._isNullable = function(grammar, memo) {
  return this.factors.every(function(factor) { return factor._isNullable(grammar, memo); });
};

pexprs.Star.prototype._isNullable =
pexprs.Opt.prototype._isNullable =
pexprs.Not.prototype._isNullable =
pexprs.Lookahead.prototype._isNullable = function(grammar, memo) {
  return true;
};

pexprs.Lex.prototype._isNullable = function(grammar, memo) {
  return this.expr._isNullable(grammar, memo);
};

pexprs.Apply.prototype._isNullable = function(grammar, memo) {
  var key = this.toMemoKey();
  if (!Object.prototype.hasOwnProperty.call(memo, key)) {
    var body = grammar.ruleBodies[this.ruleName];
    var inlined = body.substituteParams(this.args);
    memo[key] = false;  // Prevent infinite recursion for recursive rules.
    memo[key] = inlined._isNullable(grammar, memo);
  }
  return memo[key];
};

},{"./common":39,"./pexprs":60}],54:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function escapeString(str) {
  var output = JSON.stringify(str);
  output = output.replace(/[\u2028\u2029]/g, function(char, pos, str) {
    var hex = char.codePointAt(0).toString(16);
    return '\\u' + '0000'.slice(hex.length) + hex;
  });
  return output;
}

function getIntervalInfo(expr, grammarInterval) {
  if (expr.interval && grammarInterval) {
    var adjusted = expr.interval.relativeTo(grammarInterval);
    var start = adjusted.startIdx;
    var end = adjusted.endIdx;
    return '.withInterval(decl.sourceInterval(' + start + ', ' + end + '))';
  }
  return '';
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract;

pexprs.any.outputRecipe = function(sb, formals, grammarInterval) {
  throw new Error('should never output a recipe for `any` expression');
};

pexprs.end.outputRecipe = function(sb, formals, grammarInterval) {
  throw new Error('should never output a recipe for `end` expression');
};

pexprs.Prim.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.prim(');
  sb.append(typeof this.obj === 'string' ? escapeString(this.obj) : '' + this.obj);
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Range.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.range(');
  sb.append(JSON.stringify(this.from));
  sb.append(', ');
  sb.append(JSON.stringify(this.to));
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Param.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.param(' + this.index + ')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Alt.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.alt(');
  for (var idx = 0; idx < this.terms.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    this.terms[idx].outputRecipe(sb, formals, grammarInterval);
  }
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Extend.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  var extension = this.terms[0]; // [extension, orginal]
  extension.outputRecipe(sb, formals, grammarInterval);
};

pexprs.Seq.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.seq(');
  for (var idx = 0; idx < this.factors.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    this.factors[idx].outputRecipe(sb, formals, grammarInterval);
  }
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Star.prototype.outputRecipe =
pexprs.Plus.prototype.outputRecipe =
pexprs.Opt.prototype.outputRecipe =
pexprs.Not.prototype.outputRecipe =
pexprs.Lex.prototype.outputRecipe =
pexprs.Arr.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.' + this.constructor.name.toLowerCase() + '(');
  this.expr.outputRecipe(sb, formals, grammarInterval);
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Lookahead.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.la(');
  this.expr.outputRecipe(sb, formals, grammarInterval);
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Value.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.val(');
  this.expr.outputRecipe(sb, formals, grammarInterval);
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Obj.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  function outputPropertyRecipe(prop) {
    sb.append('{name: ');
    sb.append(JSON.stringify(prop.name));
    sb.append(', pattern: ');
    prop.pattern.outputRecipe(sb, formals, grammarInterval);
    sb.append('}');
  }

  sb.append('this.obj([');
  for (var idx = 0; idx < this.properties.length; idx++) {
    if (idx > 0) {
      sb.append(', ');
    }
    outputPropertyRecipe(this.properties[idx]);
  }
  sb.append('], ');
  sb.append(!!this.isLenient);
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Apply.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.app(');
  sb.append(JSON.stringify(this.ruleName));
  if (this.ruleName.indexOf('_') >= 0 && formals.length > 0) {
    var apps = formals.
        map(function(_, idx) { return 'this.param(' + idx + ')'; });
    sb.append(', [' + apps.join(', ') + ']');
  } else if (this.args.length > 0) {
    sb.append(', [');
    this.args.forEach(function(arg, idx) {
      if (idx > 0) {
        sb.append(', ');
      }
      arg.outputRecipe(sb, formals, grammarInterval);
    });
    sb.append(']');
  }
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

},{"./common":39,"./pexprs":60}],55:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a PExpr that results from recursively replacing every formal parameter (i.e., instance
  of `Param`) inside this PExpr with its actual value from `actuals` (an Array).

  The receiver must not be modified; a new PExpr must be returned if any replacement is necessary.
*/
pexprs.PExpr.prototype.substituteParams = common.abstract;  // function(actuals) { ... }

pexprs.any.substituteParams =
pexprs.end.substituteParams =
pexprs.Prim.prototype.substituteParams =
pexprs.Range.prototype.substituteParams =
pexprs.Prim.prototype.substituteParams =
pexprs.TypeCheck.prototype.substituteParams =
pexprs.UnicodeChar.prototype.substituteParams = function(actuals) {
  return this;
};

pexprs.Param.prototype.substituteParams = function(actuals) {
  return actuals[this.index];
};

pexprs.Alt.prototype.substituteParams = function(actuals) {
  return new pexprs.Alt(
      this.terms.map(function(term) { return term.substituteParams(actuals); }));
};

pexprs.Seq.prototype.substituteParams = function(actuals) {
  return new pexprs.Seq(
      this.factors.map(function(factor) { return factor.substituteParams(actuals); }));
};

pexprs.Iter.prototype.substituteParams =
pexprs.Not.prototype.substituteParams =
pexprs.Lookahead.prototype.substituteParams =
pexprs.Lex.prototype.substituteParams =
pexprs.Value.prototype.substituteParams =
pexprs.Arr.prototype.substituteParams = function(actuals) {
  return new this.constructor(this.expr.substituteParams(actuals));
};

pexprs.Obj.prototype.substituteParams = function(actuals) {
  var properties = this.properties.map(function(property) {
    return {
      name: property.name,
      pattern: property.pattern.substituteParams(actuals)
    };
  });
  return new pexprs.Obj(properties, this.isLenient);
};

pexprs.Apply.prototype.substituteParams = function(actuals) {
  if (this.args.length === 0) {
    // Avoid making a copy of this application, as an optimization
    return this;
  } else {
    var args = this.args.map(function(arg) { return arg.substituteParams(actuals); });
    return new pexprs.Apply(this.ruleName, args);
  }
};

},{"./common":39,"./pexprs":60}],56:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

var copyWithoutDuplicates = common.copyWithoutDuplicates;

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a list of strings that will be used as the default argument names for its receiver
  (a pexpr) in a semantic action. This is used exclusively by the Semantics Editor.

  `firstArgIndex` is the 1-based index of the first argument name that will be generated for this
  pexpr. It enables us to name arguments positionally, e.g., if the second argument is a
  non-alphanumeric terminal like "+", it will be named '$2'.

  Here is a more elaborate example that illustrates how this method works:
  `(a "+" b).toArgumentNameList(1)` evaluates to `['a', '$2', 'b']` with the following recursive
  calls:

    (a).toArgumentNameList(1) -> ['a'],
    ("+").toArgumentNameList(2) -> ['$2'],
    (b).toArgumentNameList(3) -> ['b']

  Notes:
  * This method must only be called on well-formed expressions, e.g., the receiver must
    not have any Alt sub-expressions with inconsistent arities.
  * e.getArity() === e.toArgumentNameList(1).length
*/
pexprs.PExpr.prototype.toArgumentNameList = common.abstract;  // function(firstArgIndex) { ... }

pexprs.any.toArgumentNameList = function(firstArgIndex) {
  return ['any'];
};

pexprs.end.toArgumentNameList = function(firstArgIndex) {
  return ['end'];
};

pexprs.Prim.prototype.toArgumentNameList = function(firstArgIndex) {
  if (typeof this.obj === 'string' && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
    // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
    return ['_' + this.obj];
  } else {
    // Otherwise, name it positionally.
    return ['$' + firstArgIndex];
  }
};

pexprs.Range.prototype.toArgumentNameList = function(firstArgIndex) {
  var argName = this.from + '_to_' + this.to;
  // If the `argName` doesn't start with an valid character, i.e. alphabet or `_`,
  // then prepending a `_` to it.
  if (!/[_$a-zA-Z]/.test(argName[0])) {
    argName = '_' + argName;
  }
  return [argName];
};

pexprs.Alt.prototype.toArgumentNameList = function(firstArgIndex) {
  // `termArgNameLists` is an array of arrays where each row is the
  // argument name list that corresponds to a term in this alternation.
  var termArgNameLists = this.terms.map(function(term) {
    return term.toArgumentNameList(firstArgIndex);
  });

  var argumentNameList = [];
  var numArgs = termArgNameLists[0].length;
  for (var colIdx = 0; colIdx < numArgs; colIdx++) {
    var col = [];
    for (var rowIdx = 0; rowIdx < this.terms.length; rowIdx++) {
      col.push(termArgNameLists[rowIdx][colIdx]);
    }
    var uniqueNames = copyWithoutDuplicates(col);
    argumentNameList.push(uniqueNames.join('_or_'));
  }

  return argumentNameList;
};

pexprs.Seq.prototype.toArgumentNameList = function(firstArgIndex) {
  // Generate the argument name list, without worrying about duplicates.
  var argumentNameList = [];
  this.factors.forEach(function(factor) {
    var factorArgumentNameList = factor.toArgumentNameList(firstArgIndex);
    argumentNameList = argumentNameList.concat(factorArgumentNameList);

    // Shift the firstArgIndex to take this factor's argument names into account.
    firstArgIndex += factorArgumentNameList.length;
  });

  // `count` is used to record the number of times each argument name occurs in the list,
  // this is useful for checking duplicated argument name. It maps argument names to ints.
  var count = Object.create(null);
  argumentNameList.forEach(function(argName) {
    count[argName] = (count[argName] || 0) + 1;
  });

  // Append subscripts ('_1', '_2', ...) to duplicate argument names.
  Object.keys(count).forEach(function(dupArgName) {
    if (count[dupArgName] <= 1) {
      return;
    }

    // This name shows up more than once, so add subscripts.
    var subscript = 1;
    argumentNameList.forEach(function(argName, idx) {
      if (argName === dupArgName) {
        argumentNameList[idx] = argName + '_' + subscript++;
      }
    });
  });

  return argumentNameList;
};

pexprs.Iter.prototype.toArgumentNameList = function(firstArgIndex) {
  return this.expr.toArgumentNameList(firstArgIndex).map(function(exprArgumentString) {
    return exprArgumentString[exprArgumentString.length - 1] === 's' ?
        exprArgumentString + 'es' :
        exprArgumentString + 's';
  });
};

pexprs.Opt.prototype.toArgumentNameList = function(firstArgIndex) {
  return this.expr.toArgumentNameList(firstArgIndex).map(function(argName) {
    return 'opt' + argName[0].toUpperCase() + argName.slice(1);
  });
};

pexprs.Not.prototype.toArgumentNameList = function(firstArgIndex) {
  return [];
};

pexprs.Lookahead.prototype.toArgumentNameList =
pexprs.Lex.prototype.toArgumentNameList = function(firstArgIndex) {
  return this.expr.toArgumentNameList(firstArgIndex);
};

pexprs.Apply.prototype.toArgumentNameList = function(firstArgIndex) {
  return [this.ruleName];
};

pexprs.UnicodeChar.prototype.toArgumentNameList = function(firstArgIndex) {
  return '$' + firstArgIndex;
};

// "Value pexprs" (Value, Str, Arr, Obj) are going away soon, so we don't worry about them here.

},{"./common":39,"./pexprs":60}],57:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

// Returns a string representing the PExpr, for use as a UI label, etc.
pexprs.PExpr.prototype.toDisplayString = common.abstract;

pexprs.Alt.prototype.toDisplayString =
pexprs.Seq.prototype.toDisplayString =
pexprs.Iter.prototype.toDisplayString =
pexprs.Not.prototype.toDisplayString =
pexprs.Lookahead.prototype.toDisplayString =
pexprs.Lex.prototype.toDisplayString =
pexprs.Value.prototype.toDisplayString =
pexprs.Arr.prototype.toDisplayString =
pexprs.Obj.prototype.toDisplayString = function() {
  if (this.interval) {
    return this.interval.trimmed().contents;
  }
  return '[' + this.constructor.name + ']';
};

pexprs.any.toDisplayString = function() {
  return 'any';
};

pexprs.end.toDisplayString = function() {
  return 'end';
};

pexprs.Prim.prototype.toDisplayString = function() {
  return JSON.stringify(this.obj);
};

pexprs.Range.prototype.toDisplayString = function() {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};

pexprs.Param.prototype.toDisplayString = function() {
  return '#' + this.index;
};

pexprs.Apply.prototype.toDisplayString = function() {
  return this.toString();
};

pexprs.UnicodeChar.prototype.toDisplayString = function() {
  return 'Unicode {' + this.category + '} character';
};

pexprs.TypeCheck.prototype.toDisplayString = function() {
  return 'TypeCheck(' + JSON.stringify(this.type) + ')';
};

},{"./common":39,"./pexprs":60}],58:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');
var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.toFailure = common.abstract;

pexprs.any.toFailure = function(grammar) {
  return new Failure('any object', 'description');
};

pexprs.end.toFailure = function(grammar) {
  return new Failure('end of input', 'description');
};

pexprs.Prim.prototype.toFailure = function(grammar) {
  return typeof this.obj === 'string' ?
    new Failure(this.obj, 'string') :
    new Failure(JSON.stringify(this.obj), 'code');
};

pexprs.Range.prototype.toFailure = function(grammar) {
  // TODO: come up with something better
  return new Failure(JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function(grammar) {
  var description = this.expr === pexprs.any ?
      'nothing' :
      'not ' + this.expr.toFailure(grammar);
  return new Failure(description, 'description');
};

// TODO: think about Arr, Str, and Obj

pexprs.Apply.prototype.toFailure = function(grammar) {
  var description = grammar.ruleDescriptions[this.ruleName];
  if (!description) {
    var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    description = article + ' ' + this.ruleName;
  }
  return new Failure(description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function(grammar) {
  return new Failure(this.toDisplayString(), 'description');
};

pexprs.TypeCheck.prototype.toFailure = function(grammar) {
  return new Failure('a value of type ' + JSON.stringify(this.type), 'description');
};

},{"./Failure":28,"./common":39,"./pexprs":60}],59:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  e1.toString() === e2.toString() ==> e1 and e2 are semantically equivalent.
  Note that this is not an iff (<==>): e.g.,
  (~"b" "a").toString() !== ("a").toString(), even though
  ~"b" "a" and "a" are interchangeable in any grammar,
  both in terms of the languages they accept and their arities.
*/
pexprs.PExpr.prototype.toString = common.abstract;

pexprs.any.toString = function() {
  return 'any';
};

pexprs.end.toString = function() {
  return 'end';
};

pexprs.Prim.prototype.toString = function() {
  return JSON.stringify(this.obj);
};

pexprs.Range.prototype.toString = function() {
  return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};

pexprs.Param.prototype.toString = function() {
  return '$' + this.index;
};

pexprs.Lex.prototype.toString = function() {
  return '#(' + this.expr.toString() + ')';
};

pexprs.Value.prototype.toString = function() {
  return '$(' + this.expr.toString() + ')';
};

pexprs.Alt.prototype.toString = function() {
  return this.terms.length === 1 ?
    this.terms[0].toString() :
    '(' + this.terms.map(function(term) { return term.toString(); }).join(' | ') + ')';
};

pexprs.Seq.prototype.toString = function() {
  return this.factors.length === 1 ?
    this.factors[0].toString() :
    '(' + this.factors.map(function(factor) { return factor.toString(); }).join(' ') + ')';
};

pexprs.Iter.prototype.toString = function() {
  return this.expr + this.operator;
};

pexprs.Not.prototype.toString = function() {
  return '~' + this.expr;
};

pexprs.Lookahead.prototype.toString = function() {
  return '&' + this.expr;
};

pexprs.Arr.prototype.toString = function() {
  return '[' + this.expr.toString() + ']';
};

pexprs.Obj.prototype.toString = function() {
  var parts = ['{'];

  var first = true;
  function emit(part) {
    if (first) {
      first = false;
    } else {
      parts.push(', ');
    }
    parts.push(part);
  }

  this.properties.forEach(function(property) {
    emit(JSON.stringify(property.name) + ': ' + property.pattern.toString());
  });
  if (this.isLenient) {
    emit('...');
  }

  parts.push('}');
  return parts.join('');
};

pexprs.Apply.prototype.toString = function() {
  if (this.args.length > 0) {
    var ps = this.args.map(function(arg) { return arg.toString(); });
    return this.ruleName + '<' + ps.join(',') + '>';
  } else {
    return this.ruleName;
  }
};

pexprs.UnicodeChar.prototype.toString = function() {
  return '\\p{' + this.category + '}';
};

pexprs.TypeCheck.prototype.toString = function() {
  return 'TypeCheck(' + JSON.stringify(this.type) + ')';
};

},{"./common":39,"./pexprs":60}],60:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream');
var UnicodeCategories = require('../third_party/UnicodeCategories');
var common = require('./common');
var errors = require('./errors');
var inherits = require('inherits');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

// Constants representing the type of a PExpr. See pexprs-getExprType.js for
// more information.
var TYPE_ANY = 0;
var TYPE_STRING = 1;
var TYPE_VALUE = 2;

function PExpr() {
  throw new Error("PExpr cannot be instantiated -- it's abstract");
}

// Set the `interval` property to the interval containing the source for this expression.
PExpr.prototype.withInterval = function(interval) {
  if (interval) {
    this.interval = interval.trimmed();
  }
  return this;
};

// Allocate the appropriate input stream for this expression and the given values.
PExpr.prototype.newInputStreamFor = function(values, grammar) {
  var exprType = this.getExprType(grammar);
  if (values.length === 1 && typeof values[0] === 'string' && exprType !== TYPE_VALUE) {
    return InputStream.newFor(values[0]);
  } else {
    return InputStream.newFor(values);
  }
};

// Any

var any = Object.create(PExpr.prototype);

// End

var end = Object.create(PExpr.prototype);

// Primitives

function Prim(obj) {
  this.obj = obj;
}
inherits(Prim, PExpr);

// Ranges

function Range(from, to) {
  this.from = from;
  this.to = to;
}
inherits(Range, PExpr);

// Parameters

function Param(index) {
  this.index = index;
}
inherits(Param, PExpr);

// Alternation

function Alt(terms) {
  this.terms = terms;
}
inherits(Alt, PExpr);

// Extend is an implementation detail of rule extension

function Extend(superGrammar, name, body) {
  this.superGrammar = superGrammar;
  this.name = name;
  this.body = body;
  var origBody = superGrammar.ruleBodies[name];
  this.terms = [body, origBody];
}
inherits(Extend, Alt);

// Sequences

function Seq(factors) {
  this.factors = factors;
}
inherits(Seq, PExpr);

// Iterators and optionals

function Iter(expr) {
  this.expr = expr;
}
inherits(Iter, PExpr);

function Star(expr) {
  this.expr = expr;
}
inherits(Star, Iter);

function Plus(expr) {
  this.expr = expr;
}
inherits(Plus, Iter);

function Opt(expr) {
  this.expr = expr;
}
inherits(Opt, Iter);

Star.prototype.operator = '*';
Plus.prototype.operator = '+';
Opt.prototype.operator = '?';

Star.prototype.minNumMatches = 0;
Plus.prototype.minNumMatches = 1;
Opt.prototype.minNumMatches = 0;

Star.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Plus.prototype.maxNumMatches = Number.POSITIVE_INFINITY;
Opt.prototype.maxNumMatches = 1;

// Predicates

function Not(expr) {
  this.expr = expr;
}
inherits(Not, PExpr);

function Lookahead(expr) {
  this.expr = expr;
}
inherits(Lookahead, PExpr);

// "Lexification"

function Lex(expr) {
  this.expr = expr;
}
inherits(Lex, PExpr);

// "Value-ification"

function Value(expr) {
  this.expr = expr;
}
inherits(Value, PExpr);

// Array decomposition

function Arr(expr) {
  this.expr = expr;
}
inherits(Arr, PExpr);

// String decomposition

function Str(expr) {
  this.expr = expr;
}
inherits(Str, PExpr);

// Object decomposition

function Obj(properties, isLenient) {
  var names = properties.map(function(property) { return property.name; });
  var duplicates = common.getDuplicates(names);
  if (duplicates.length > 0) {
    throw errors.duplicatePropertyNames(duplicates);
  } else {
    this.properties = properties;
    this.isLenient = isLenient;
  }
}
inherits(Obj, PExpr);

// Rule application

function Apply(ruleName, optArgs) {
  this.ruleName = ruleName;
  this.args = optArgs || [];
}
inherits(Apply, PExpr);

Apply.prototype.isSyntactic = function() {
  return common.isSyntactic(this.ruleName);
};

// This method just caches the result of `this.toString()` in a non-enumerable property.
Apply.prototype.toMemoKey = function() {
  if (!this._memoKey) {
    Object.defineProperty(this, '_memoKey', {value: this.toString()});
  }
  return this._memoKey;
};

// Unicode character
function UnicodeChar(category) {
  this.category = category;
  this.pattern = UnicodeCategories[category];
}
inherits(UnicodeChar, PExpr);

// Matches a value of a particular type (using `typeof`).
function TypeCheck(t) {
  this.type = t;
}
inherits(TypeCheck, PExpr);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.TYPE_ANY = TYPE_ANY;
exports.TYPE_STRING = TYPE_STRING;
exports.TYPE_VALUE = TYPE_VALUE;
exports.TYPE_INCONSISTENT = TYPE_STRING | TYPE_VALUE;

exports.PExpr = PExpr;
exports.any = any;
exports.end = end;
exports.Prim = Prim;
exports.Range = Range;
exports.Param = Param;
exports.Alt = Alt;
exports.Extend = Extend;
exports.Seq = Seq;
exports.Iter = Iter;
exports.Star = Star;
exports.Plus = Plus;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Lex = Lex;
exports.Value = Value;
exports.Arr = Arr;
exports.Str = Str;
exports.Obj = Obj;
exports.Apply = Apply;
exports.UnicodeChar = UnicodeChar;
exports.TypeCheck = TypeCheck;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

require('./pexprs-allowsSkippingPrecedingSpace');
require('./pexprs-assertAllApplicationsAreValid');
require('./pexprs-assertChoicesHaveUniformArity');
require('./pexprs-assertIteratedExprsAreNotNullable');
require('./pexprs-assertValuesAndStringsAreNotMixed');
require('./pexprs-check');
require('./pexprs-eval');
require('./pexprs-getArity');
require('./pexprs-getExprType');
require('./pexprs-outputRecipe');
require('./pexprs-introduceParams');
require('./pexprs-isNullable');
require('./pexprs-substituteParams');
require('./pexprs-toDisplayString');
require('./pexprs-toArgumentNameList');
require('./pexprs-toFailure');
require('./pexprs-toString');

},{"../third_party/UnicodeCategories":62,"./InputStream":31,"./common":39,"./errors":40,"./pexprs-allowsSkippingPrecedingSpace":43,"./pexprs-assertAllApplicationsAreValid":44,"./pexprs-assertChoicesHaveUniformArity":45,"./pexprs-assertIteratedExprsAreNotNullable":46,"./pexprs-assertValuesAndStringsAreNotMixed":47,"./pexprs-check":48,"./pexprs-eval":49,"./pexprs-getArity":50,"./pexprs-getExprType":51,"./pexprs-introduceParams":52,"./pexprs-isNullable":53,"./pexprs-outputRecipe":54,"./pexprs-substituteParams":55,"./pexprs-toArgumentNameList":56,"./pexprs-toDisplayString":57,"./pexprs-toFailure":58,"./pexprs-toString":59,"inherits":24}],61:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function padNumbersToEqualLength(arr) {
  var maxLen = 0;
  var strings = arr.map(function(n) {
    var str = n.toString();
    maxLen = Math.max(maxLen, str.length);
    return str;
  });
  return strings.map(function(s) { return common.padLeft(s, maxLen); });
}

// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function strcpy(dest, src, offset) {
  var origDestLen = dest.length;
  var start = dest.slice(0, offset);
  var end = dest.slice(offset + src.length);
  return (start + src + end).substr(0, origDestLen);
}

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

// Return an object with the line and column information for the given
// offset in `str`.
exports.getLineAndColumn = function(str, offset) {
  var lineNum = 1;
  var colNum = 1;

  var currOffset = 0;
  var lineStartOffset = 0;

  var nextLine = null;
  var prevLine = null;
  var prevLineStartOffset = -1;

  while (currOffset < offset) {
    var c = str.charAt(currOffset++);
    if (c === '\n') {
      lineNum++;
      colNum = 1;
      prevLineStartOffset = lineStartOffset;
      lineStartOffset = currOffset;
    } else if (c !== '\r') {
      colNum++;
    }
  }

  // Find the end of the target line.
  var lineEndOffset = str.indexOf('\n', lineStartOffset);
  if (lineEndOffset === -1) {
    lineEndOffset = str.length;
  } else {
    // Get the next line.
    var nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
    nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset)
                                        : str.slice(lineEndOffset, nextLineEndOffset);
    // Strip leading and trailing EOL char(s).
    nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
  }

  // Get the previous line.
  if (prevLineStartOffset >= 0) {
    prevLine = str.slice(prevLineStartOffset, lineStartOffset)
                  .replace(/\r?\n$/, '');  // Strip trailing EOL char(s).
  }

  // Get the target line, stripping a trailing carriage return if necessary.
  var line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');

  return {
    lineNum: lineNum,
    colNum: colNum,
    line: line,
    prevLine: prevLine,
    nextLine: nextLine
  };
};

// Return a nicely-formatted string describing the line and column for the
// given offset in `str`.
exports.getLineAndColumnMessage = function(str, offset /* ...ranges */) {
  var repeatStr = common.repeatStr;

  var lineAndCol = exports.getLineAndColumn(str, offset);
  var sb = new common.StringBuffer();
  sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n');

  // An array of the previous, current, and next line numbers as strings of equal length.
  var lineNumbers = padNumbersToEqualLength([
      lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
      lineAndCol.lineNum,
      lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
  ]);

  // Helper for appending formatting input lines to the buffer.
  function appendLine(num, content, prefix) {
    sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n');
  }

  // Include the previous line for context if possible.
  if (lineAndCol.prevLine != null) {
    appendLine(0, lineAndCol.prevLine, '  ');
  }
  // Line that the error occurred on.
  appendLine(1, lineAndCol.line, '> ');

  // Build up the line that points to the offset and possible indicates one or more ranges.
  // Start with a blank line, and indicate each range by overlaying a string of `~` chars.
  var lineLen = lineAndCol.line.length;
  var indicationLine = repeatStr(' ', lineLen + 1);
  var ranges = Array.prototype.slice.call(arguments, 2);
  for (var i = 0; i < ranges.length; ++i) {
    var startIdx = ranges[i][0];
    var endIdx = ranges[i][1];
    common.assert(startIdx >= 0 && startIdx <= endIdx, 'range start must be >= 0 and <= end');

    var lineStartOffset = offset - lineAndCol.colNum + 1;
    startIdx = Math.max(0, startIdx - lineStartOffset);
    endIdx = Math.min(endIdx - lineStartOffset, lineLen);

    indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
  }
  var gutterWidth = 2 + lineNumbers[1].length + 3;
  sb.append(repeatStr(' ', gutterWidth));
  indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
  sb.append(indicationLine.replace(/ +$/, '') + '\n');

  // Include the next line for context if possible.
  if (lineAndCol.nextLine != null) {
    appendLine(2, lineAndCol.nextLine, '  ');
  }
  return sb.contents();
};

},{"./common":39}],62:[function(require,module,exports){
// Based on https://github.com/tvcutsem/es-lab/blob/master/src/parser/unicode.js.
// These are just categories that are used in ES5.
// The full list of Unicode categories is here: http://www.fileformat.info/info/unicode/category/index.htm.
module.exports = {
  // Letters
  Lu: /[\u0041-\u005A]|[\u00C0-\u00D6]|[\u00D8-\u00DE]|[\u0100-\u0100]|[\u0102-\u0102]|[\u0104-\u0104]|[\u0106-\u0106]|[\u0108-\u0108]|[\u010A-\u010A]|[\u010C-\u010C]|[\u010E-\u010E]|[\u0110-\u0110]|[\u0112-\u0112]|[\u0114-\u0114]|[\u0116-\u0116]|[\u0118-\u0118]|[\u011A-\u011A]|[\u011C-\u011C]|[\u011E-\u011E]|[\u0120-\u0120]|[\u0122-\u0122]|[\u0124-\u0124]|[\u0126-\u0126]|[\u0128-\u0128]|[\u012A-\u012A]|[\u012C-\u012C]|[\u012E-\u012E]|[\u0130-\u0130]|[\u0132-\u0132]|[\u0134-\u0134]|[\u0136-\u0136]|[\u0139-\u0139]|[\u013B-\u013B]|[\u013D-\u013D]|[\u013F-\u013F]|[\u0141-\u0141]|[\u0143-\u0143]|[\u0145-\u0145]|[\u0147-\u0147]|[\u014A-\u014A]|[\u014C-\u014C]|[\u014E-\u014E]|[\u0150-\u0150]|[\u0152-\u0152]|[\u0154-\u0154]|[\u0156-\u0156]|[\u0158-\u0158]|[\u015A-\u015A]|[\u015C-\u015C]|[\u015E-\u015E]|[\u0160-\u0160]|[\u0162-\u0162]|[\u0164-\u0164]|[\u0166-\u0166]|[\u0168-\u0168]|[\u016A-\u016A]|[\u016C-\u016C]|[\u016E-\u016E]|[\u0170-\u0170]|[\u0172-\u0172]|[\u0174-\u0174]|[\u0176-\u0176]|[\u0178-\u0179]|[\u017B-\u017B]|[\u017D-\u017D]|[\u0181-\u0182]|[\u0184-\u0184]|[\u0186-\u0187]|[\u0189-\u018B]|[\u018E-\u0191]|[\u0193-\u0194]|[\u0196-\u0198]|[\u019C-\u019D]|[\u019F-\u01A0]|[\u01A2-\u01A2]|[\u01A4-\u01A4]|[\u01A6-\u01A7]|[\u01A9-\u01A9]|[\u01AC-\u01AC]|[\u01AE-\u01AF]|[\u01B1-\u01B3]|[\u01B5-\u01B5]|[\u01B7-\u01B8]|[\u01BC-\u01BC]|[\u01C4-\u01C4]|[\u01C7-\u01C7]|[\u01CA-\u01CA]|[\u01CD-\u01CD]|[\u01CF-\u01CF]|[\u01D1-\u01D1]|[\u01D3-\u01D3]|[\u01D5-\u01D5]|[\u01D7-\u01D7]|[\u01D9-\u01D9]|[\u01DB-\u01DB]|[\u01DE-\u01DE]|[\u01E0-\u01E0]|[\u01E2-\u01E2]|[\u01E4-\u01E4]|[\u01E6-\u01E6]|[\u01E8-\u01E8]|[\u01EA-\u01EA]|[\u01EC-\u01EC]|[\u01EE-\u01EE]|[\u01F1-\u01F1]|[\u01F4-\u01F4]|[\u01FA-\u01FA]|[\u01FC-\u01FC]|[\u01FE-\u01FE]|[\u0200-\u0200]|[\u0202-\u0202]|[\u0204-\u0204]|[\u0206-\u0206]|[\u0208-\u0208]|[\u020A-\u020A]|[\u020C-\u020C]|[\u020E-\u020E]|[\u0210-\u0210]|[\u0212-\u0212]|[\u0214-\u0214]|[\u0216-\u0216]|[\u0386-\u0386]|[\u0388-\u038A]|[\u038C-\u038C]|[\u038E-\u038F]|[\u0391-\u03A1]|[\u03A3-\u03AB]|[\u03D2-\u03D4]|[\u03DA-\u03DA]|[\u03DC-\u03DC]|[\u03DE-\u03DE]|[\u03E0-\u03E0]|[\u03E2-\u03E2]|[\u03E4-\u03E4]|[\u03E6-\u03E6]|[\u03E8-\u03E8]|[\u03EA-\u03EA]|[\u03EC-\u03EC]|[\u03EE-\u03EE]|[\u0401-\u040C]|[\u040E-\u042F]|[\u0460-\u0460]|[\u0462-\u0462]|[\u0464-\u0464]|[\u0466-\u0466]|[\u0468-\u0468]|[\u046A-\u046A]|[\u046C-\u046C]|[\u046E-\u046E]|[\u0470-\u0470]|[\u0472-\u0472]|[\u0474-\u0474]|[\u0476-\u0476]|[\u0478-\u0478]|[\u047A-\u047A]|[\u047C-\u047C]|[\u047E-\u047E]|[\u0480-\u0480]|[\u0490-\u0490]|[\u0492-\u0492]|[\u0494-\u0494]|[\u0496-\u0496]|[\u0498-\u0498]|[\u049A-\u049A]|[\u049C-\u049C]|[\u049E-\u049E]|[\u04A0-\u04A0]|[\u04A2-\u04A2]|[\u04A4-\u04A4]|[\u04A6-\u04A6]|[\u04A8-\u04A8]|[\u04AA-\u04AA]|[\u04AC-\u04AC]|[\u04AE-\u04AE]|[\u04B0-\u04B0]|[\u04B2-\u04B2]|[\u04B4-\u04B4]|[\u04B6-\u04B6]|[\u04B8-\u04B8]|[\u04BA-\u04BA]|[\u04BC-\u04BC]|[\u04BE-\u04BE]|[\u04C1-\u04C1]|[\u04C3-\u04C3]|[\u04C7-\u04C7]|[\u04CB-\u04CB]|[\u04D0-\u04D0]|[\u04D2-\u04D2]|[\u04D4-\u04D4]|[\u04D6-\u04D6]|[\u04D8-\u04D8]|[\u04DA-\u04DA]|[\u04DC-\u04DC]|[\u04DE-\u04DE]|[\u04E0-\u04E0]|[\u04E2-\u04E2]|[\u04E4-\u04E4]|[\u04E6-\u04E6]|[\u04E8-\u04E8]|[\u04EA-\u04EA]|[\u04EE-\u04EE]|[\u04F0-\u04F0]|[\u04F2-\u04F2]|[\u04F4-\u04F4]|[\u04F8-\u04F8]|[\u0531-\u0556]|[\u10A0-\u10C5]|[\u1E00-\u1E00]|[\u1E02-\u1E02]|[\u1E04-\u1E04]|[\u1E06-\u1E06]|[\u1E08-\u1E08]|[\u1E0A-\u1E0A]|[\u1E0C-\u1E0C]|[\u1E0E-\u1E0E]|[\u1E10-\u1E10]|[\u1E12-\u1E12]|[\u1E14-\u1E14]|[\u1E16-\u1E16]|[\u1E18-\u1E18]|[\u1E1A-\u1E1A]|[\u1E1C-\u1E1C]|[\u1E1E-\u1E1E]|[\u1E20-\u1E20]|[\u1E22-\u1E22]|[\u1E24-\u1E24]|[\u1E26-\u1E26]|[\u1E28-\u1E28]|[\u1E2A-\u1E2A]|[\u1E2C-\u1E2C]|[\u1E2E-\u1E2E]|[\u1E30-\u1E30]|[\u1E32-\u1E32]|[\u1E34-\u1E34]|[\u1E36-\u1E36]|[\u1E38-\u1E38]|[\u1E3A-\u1E3A]|[\u1E3C-\u1E3C]|[\u1E3E-\u1E3E]|[\u1E40-\u1E40]|[\u1E42-\u1E42]|[\u1E44-\u1E44]|[\u1E46-\u1E46]|[\u1E48-\u1E48]|[\u1E4A-\u1E4A]|[\u1E4C-\u1E4C]|[\u1E4E-\u1E4E]|[\u1E50-\u1E50]|[\u1E52-\u1E52]|[\u1E54-\u1E54]|[\u1E56-\u1E56]|[\u1E58-\u1E58]|[\u1E5A-\u1E5A]|[\u1E5C-\u1E5C]|[\u1E5E-\u1E5E]|[\u1E60-\u1E60]|[\u1E62-\u1E62]|[\u1E64-\u1E64]|[\u1E66-\u1E66]|[\u1E68-\u1E68]|[\u1E6A-\u1E6A]|[\u1E6C-\u1E6C]|[\u1E6E-\u1E6E]|[\u1E70-\u1E70]|[\u1E72-\u1E72]|[\u1E74-\u1E74]|[\u1E76-\u1E76]|[\u1E78-\u1E78]|[\u1E7A-\u1E7A]|[\u1E7C-\u1E7C]|[\u1E7E-\u1E7E]|[\u1E80-\u1E80]|[\u1E82-\u1E82]|[\u1E84-\u1E84]|[\u1E86-\u1E86]|[\u1E88-\u1E88]|[\u1E8A-\u1E8A]|[\u1E8C-\u1E8C]|[\u1E8E-\u1E8E]|[\u1E90-\u1E90]|[\u1E92-\u1E92]|[\u1E94-\u1E94]|[\u1EA0-\u1EA0]|[\u1EA2-\u1EA2]|[\u1EA4-\u1EA4]|[\u1EA6-\u1EA6]|[\u1EA8-\u1EA8]|[\u1EAA-\u1EAA]|[\u1EAC-\u1EAC]|[\u1EAE-\u1EAE]|[\u1EB0-\u1EB0]|[\u1EB2-\u1EB2]|[\u1EB4-\u1EB4]|[\u1EB6-\u1EB6]|[\u1EB8-\u1EB8]|[\u1EBA-\u1EBA]|[\u1EBC-\u1EBC]|[\u1EBE-\u1EBE]|[\u1EC0-\u1EC0]|[\u1EC2-\u1EC2]|[\u1EC4-\u1EC4]|[\u1EC6-\u1EC6]|[\u1EC8-\u1EC8]|[\u1ECA-\u1ECA]|[\u1ECC-\u1ECC]|[\u1ECE-\u1ECE]|[\u1ED0-\u1ED0]|[\u1ED2-\u1ED2]|[\u1ED4-\u1ED4]|[\u1ED6-\u1ED6]|[\u1ED8-\u1ED8]|[\u1EDA-\u1EDA]|[\u1EDC-\u1EDC]|[\u1EDE-\u1EDE]|[\u1EE0-\u1EE0]|[\u1EE2-\u1EE2]|[\u1EE4-\u1EE4]|[\u1EE6-\u1EE6]|[\u1EE8-\u1EE8]|[\u1EEA-\u1EEA]|[\u1EEC-\u1EEC]|[\u1EEE-\u1EEE]|[\u1EF0-\u1EF0]|[\u1EF2-\u1EF2]|[\u1EF4-\u1EF4]|[\u1EF6-\u1EF6]|[\u1EF8-\u1EF8]|[\u1F08-\u1F0F]|[\u1F18-\u1F1D]|[\u1F28-\u1F2F]|[\u1F38-\u1F3F]|[\u1F48-\u1F4D]|[\u1F59-\u1F59]|[\u1F5B-\u1F5B]|[\u1F5D-\u1F5D]|[\u1F5F-\u1F5F]|[\u1F68-\u1F6F]|[\u1F88-\u1F8F]|[\u1F98-\u1F9F]|[\u1FA8-\u1FAF]|[\u1FB8-\u1FBC]|[\u1FC8-\u1FCC]|[\u1FD8-\u1FDB]|[\u1FE8-\u1FEC]|[\u1FF8-\u1FFC]|[\u2102-\u2102]|[\u2107-\u2107]|[\u210B-\u210D]|[\u2110-\u2112]|[\u2115-\u2115]|[\u2119-\u211D]|[\u2124-\u2124]|[\u2126-\u2126]|[\u2128-\u2128]|[\u212A-\u212D]|[\u2130-\u2131]|[\u2133-\u2133]|[\uFF21-\uFF3A]/,
  Ll: /[\u0061-\u007A]|[\u00AA-\u00AA]|[\u00B5-\u00B5]|[\u00BA-\u00BA]|[\u00DF-\u00F6]|[\u00F8-\u00FF]|[\u0101-\u0101]|[\u0103-\u0103]|[\u0105-\u0105]|[\u0107-\u0107]|[\u0109-\u0109]|[\u010B-\u010B]|[\u010D-\u010D]|[\u010F-\u010F]|[\u0111-\u0111]|[\u0113-\u0113]|[\u0115-\u0115]|[\u0117-\u0117]|[\u0119-\u0119]|[\u011B-\u011B]|[\u011D-\u011D]|[\u011F-\u011F]|[\u0121-\u0121]|[\u0123-\u0123]|[\u0125-\u0125]|[\u0127-\u0127]|[\u0129-\u0129]|[\u012B-\u012B]|[\u012D-\u012D]|[\u012F-\u012F]|[\u0131-\u0131]|[\u0133-\u0133]|[\u0135-\u0135]|[\u0137-\u0138]|[\u013A-\u013A]|[\u013C-\u013C]|[\u013E-\u013E]|[\u0140-\u0140]|[\u0142-\u0142]|[\u0144-\u0144]|[\u0146-\u0146]|[\u0148-\u0149]|[\u014B-\u014B]|[\u014D-\u014D]|[\u014F-\u014F]|[\u0151-\u0151]|[\u0153-\u0153]|[\u0155-\u0155]|[\u0157-\u0157]|[\u0159-\u0159]|[\u015B-\u015B]|[\u015D-\u015D]|[\u015F-\u015F]|[\u0161-\u0161]|[\u0163-\u0163]|[\u0165-\u0165]|[\u0167-\u0167]|[\u0169-\u0169]|[\u016B-\u016B]|[\u016D-\u016D]|[\u016F-\u016F]|[\u0171-\u0171]|[\u0173-\u0173]|[\u0175-\u0175]|[\u0177-\u0177]|[\u017A-\u017A]|[\u017C-\u017C]|[\u017E-\u0180]|[\u0183-\u0183]|[\u0185-\u0185]|[\u0188-\u0188]|[\u018C-\u018D]|[\u0192-\u0192]|[\u0195-\u0195]|[\u0199-\u019B]|[\u019E-\u019E]|[\u01A1-\u01A1]|[\u01A3-\u01A3]|[\u01A5-\u01A5]|[\u01A8-\u01A8]|[\u01AB-\u01AB]|[\u01AD-\u01AD]|[\u01B0-\u01B0]|[\u01B4-\u01B4]|[\u01B6-\u01B6]|[\u01B9-\u01BA]|[\u01BD-\u01BD]|[\u01C6-\u01C6]|[\u01C9-\u01C9]|[\u01CC-\u01CC]|[\u01CE-\u01CE]|[\u01D0-\u01D0]|[\u01D2-\u01D2]|[\u01D4-\u01D4]|[\u01D6-\u01D6]|[\u01D8-\u01D8]|[\u01DA-\u01DA]|[\u01DC-\u01DD]|[\u01DF-\u01DF]|[\u01E1-\u01E1]|[\u01E3-\u01E3]|[\u01E5-\u01E5]|[\u01E7-\u01E7]|[\u01E9-\u01E9]|[\u01EB-\u01EB]|[\u01ED-\u01ED]|[\u01EF-\u01F0]|[\u01F3-\u01F3]|[\u01F5-\u01F5]|[\u01FB-\u01FB]|[\u01FD-\u01FD]|[\u01FF-\u01FF]|[\u0201-\u0201]|[\u0203-\u0203]|[\u0205-\u0205]|[\u0207-\u0207]|[\u0209-\u0209]|[\u020B-\u020B]|[\u020D-\u020D]|[\u020F-\u020F]|[\u0211-\u0211]|[\u0213-\u0213]|[\u0215-\u0215]|[\u0217-\u0217]|[\u0250-\u02A8]|[\u0390-\u0390]|[\u03AC-\u03CE]|[\u03D0-\u03D1]|[\u03D5-\u03D6]|[\u03E3-\u03E3]|[\u03E5-\u03E5]|[\u03E7-\u03E7]|[\u03E9-\u03E9]|[\u03EB-\u03EB]|[\u03ED-\u03ED]|[\u03EF-\u03F2]|[\u0430-\u044F]|[\u0451-\u045C]|[\u045E-\u045F]|[\u0461-\u0461]|[\u0463-\u0463]|[\u0465-\u0465]|[\u0467-\u0467]|[\u0469-\u0469]|[\u046B-\u046B]|[\u046D-\u046D]|[\u046F-\u046F]|[\u0471-\u0471]|[\u0473-\u0473]|[\u0475-\u0475]|[\u0477-\u0477]|[\u0479-\u0479]|[\u047B-\u047B]|[\u047D-\u047D]|[\u047F-\u047F]|[\u0481-\u0481]|[\u0491-\u0491]|[\u0493-\u0493]|[\u0495-\u0495]|[\u0497-\u0497]|[\u0499-\u0499]|[\u049B-\u049B]|[\u049D-\u049D]|[\u049F-\u049F]|[\u04A1-\u04A1]|[\u04A3-\u04A3]|[\u04A5-\u04A5]|[\u04A7-\u04A7]|[\u04A9-\u04A9]|[\u04AB-\u04AB]|[\u04AD-\u04AD]|[\u04AF-\u04AF]|[\u04B1-\u04B1]|[\u04B3-\u04B3]|[\u04B5-\u04B5]|[\u04B7-\u04B7]|[\u04B9-\u04B9]|[\u04BB-\u04BB]|[\u04BD-\u04BD]|[\u04BF-\u04BF]|[\u04C2-\u04C2]|[\u04C4-\u04C4]|[\u04C8-\u04C8]|[\u04CC-\u04CC]|[\u04D1-\u04D1]|[\u04D3-\u04D3]|[\u04D5-\u04D5]|[\u04D7-\u04D7]|[\u04D9-\u04D9]|[\u04DB-\u04DB]|[\u04DD-\u04DD]|[\u04DF-\u04DF]|[\u04E1-\u04E1]|[\u04E3-\u04E3]|[\u04E5-\u04E5]|[\u04E7-\u04E7]|[\u04E9-\u04E9]|[\u04EB-\u04EB]|[\u04EF-\u04EF]|[\u04F1-\u04F1]|[\u04F3-\u04F3]|[\u04F5-\u04F5]|[\u04F9-\u04F9]|[\u0561-\u0587]|[\u10D0-\u10F6]|[\u1E01-\u1E01]|[\u1E03-\u1E03]|[\u1E05-\u1E05]|[\u1E07-\u1E07]|[\u1E09-\u1E09]|[\u1E0B-\u1E0B]|[\u1E0D-\u1E0D]|[\u1E0F-\u1E0F]|[\u1E11-\u1E11]|[\u1E13-\u1E13]|[\u1E15-\u1E15]|[\u1E17-\u1E17]|[\u1E19-\u1E19]|[\u1E1B-\u1E1B]|[\u1E1D-\u1E1D]|[\u1E1F-\u1E1F]|[\u1E21-\u1E21]|[\u1E23-\u1E23]|[\u1E25-\u1E25]|[\u1E27-\u1E27]|[\u1E29-\u1E29]|[\u1E2B-\u1E2B]|[\u1E2D-\u1E2D]|[\u1E2F-\u1E2F]|[\u1E31-\u1E31]|[\u1E33-\u1E33]|[\u1E35-\u1E35]|[\u1E37-\u1E37]|[\u1E39-\u1E39]|[\u1E3B-\u1E3B]|[\u1E3D-\u1E3D]|[\u1E3F-\u1E3F]|[\u1E41-\u1E41]|[\u1E43-\u1E43]|[\u1E45-\u1E45]|[\u1E47-\u1E47]|[\u1E49-\u1E49]|[\u1E4B-\u1E4B]|[\u1E4D-\u1E4D]|[\u1E4F-\u1E4F]|[\u1E51-\u1E51]|[\u1E53-\u1E53]|[\u1E55-\u1E55]|[\u1E57-\u1E57]|[\u1E59-\u1E59]|[\u1E5B-\u1E5B]|[\u1E5D-\u1E5D]|[\u1E5F-\u1E5F]|[\u1E61-\u1E61]|[\u1E63-\u1E63]|[\u1E65-\u1E65]|[\u1E67-\u1E67]|[\u1E69-\u1E69]|[\u1E6B-\u1E6B]|[\u1E6D-\u1E6D]|[\u1E6F-\u1E6F]|[\u1E71-\u1E71]|[\u1E73-\u1E73]|[\u1E75-\u1E75]|[\u1E77-\u1E77]|[\u1E79-\u1E79]|[\u1E7B-\u1E7B]|[\u1E7D-\u1E7D]|[\u1E7F-\u1E7F]|[\u1E81-\u1E81]|[\u1E83-\u1E83]|[\u1E85-\u1E85]|[\u1E87-\u1E87]|[\u1E89-\u1E89]|[\u1E8B-\u1E8B]|[\u1E8D-\u1E8D]|[\u1E8F-\u1E8F]|[\u1E91-\u1E91]|[\u1E93-\u1E93]|[\u1E95-\u1E9B]|[\u1EA1-\u1EA1]|[\u1EA3-\u1EA3]|[\u1EA5-\u1EA5]|[\u1EA7-\u1EA7]|[\u1EA9-\u1EA9]|[\u1EAB-\u1EAB]|[\u1EAD-\u1EAD]|[\u1EAF-\u1EAF]|[\u1EB1-\u1EB1]|[\u1EB3-\u1EB3]|[\u1EB5-\u1EB5]|[\u1EB7-\u1EB7]|[\u1EB9-\u1EB9]|[\u1EBB-\u1EBB]|[\u1EBD-\u1EBD]|[\u1EBF-\u1EBF]|[\u1EC1-\u1EC1]|[\u1EC3-\u1EC3]|[\u1EC5-\u1EC5]|[\u1EC7-\u1EC7]|[\u1EC9-\u1EC9]|[\u1ECB-\u1ECB]|[\u1ECD-\u1ECD]|[\u1ECF-\u1ECF]|[\u1ED1-\u1ED1]|[\u1ED3-\u1ED3]|[\u1ED5-\u1ED5]|[\u1ED7-\u1ED7]|[\u1ED9-\u1ED9]|[\u1EDB-\u1EDB]|[\u1EDD-\u1EDD]|[\u1EDF-\u1EDF]|[\u1EE1-\u1EE1]|[\u1EE3-\u1EE3]|[\u1EE5-\u1EE5]|[\u1EE7-\u1EE7]|[\u1EE9-\u1EE9]|[\u1EEB-\u1EEB]|[\u1EED-\u1EED]|[\u1EEF-\u1EEF]|[\u1EF1-\u1EF1]|[\u1EF3-\u1EF3]|[\u1EF5-\u1EF5]|[\u1EF7-\u1EF7]|[\u1EF9-\u1EF9]|[\u1F00-\u1F07]|[\u1F10-\u1F15]|[\u1F20-\u1F27]|[\u1F30-\u1F37]|[\u1F40-\u1F45]|[\u1F50-\u1F57]|[\u1F60-\u1F67]|[\u1F70-\u1F7D]|[\u1F80-\u1F87]|[\u1F90-\u1F97]|[\u1FA0-\u1FA7]|[\u1FB0-\u1FB4]|[\u1FB6-\u1FB7]|[\u1FBE-\u1FBE]|[\u1FC2-\u1FC4]|[\u1FC6-\u1FC7]|[\u1FD0-\u1FD3]|[\u1FD6-\u1FD7]|[\u1FE0-\u1FE7]|[\u1FF2-\u1FF4]|[\u1FF6-\u1FF7]|[\u207F-\u207F]|[\u210A-\u210A]|[\u210E-\u210F]|[\u2113-\u2113]|[\u2118-\u2118]|[\u212E-\u212F]|[\u2134-\u2134]|[\uFB00-\uFB06]|[\uFB13-\uFB17]|[\uFF41-\uFF5A]/,
  Lt: /[\u01C5-\u01C5]|[\u01C8-\u01C8]|[\u01CB-\u01CB]|[\u01F2-\u01F2]/,
  Lm: /[\u02B0-\u02B8]|[\u02BB-\u02C1]|[\u02D0-\u02D1]|[\u02E0-\u02E4]|[\u037A-\u037A]|[\u0559-\u0559]|[\u0640-\u0640]|[\u06E5-\u06E6]|[\u0E46-\u0E46]|[\u0EC6-\u0EC6]|[\u3005-\u3005]|[\u3031-\u3035]|[\u309D-\u309E]|[\u30FC-\u30FE]|[\uFF70-\uFF70]|[\uFF9E-\uFF9F]/,
  Lo: /[\u01AA-\u01AA]|[\u01BB-\u01BB]|[\u01BE-\u01C3]|[\u03F3-\u03F3]|[\u04C0-\u04C0]|[\u05D0-\u05EA]|[\u05F0-\u05F2]|[\u0621-\u063A]|[\u0641-\u064A]|[\u0671-\u06B7]|[\u06BA-\u06BE]|[\u06C0-\u06CE]|[\u06D0-\u06D3]|[\u06D5-\u06D5]|[\u0905-\u0939]|[\u093D-\u093D]|[\u0950-\u0950]|[\u0958-\u0961]|[\u0985-\u098C]|[\u098F-\u0990]|[\u0993-\u09A8]|[\u09AA-\u09B0]|[\u09B2-\u09B2]|[\u09B6-\u09B9]|[\u09DC-\u09DD]|[\u09DF-\u09E1]|[\u09F0-\u09F1]|[\u0A05-\u0A0A]|[\u0A0F-\u0A10]|[\u0A13-\u0A28]|[\u0A2A-\u0A30]|[\u0A32-\u0A33]|[\u0A35-\u0A36]|[\u0A38-\u0A39]|[\u0A59-\u0A5C]|[\u0A5E-\u0A5E]|[\u0A72-\u0A74]|[\u0A85-\u0A8B]|[\u0A8D-\u0A8D]|[\u0A8F-\u0A91]|[\u0A93-\u0AA8]|[\u0AAA-\u0AB0]|[\u0AB2-\u0AB3]|[\u0AB5-\u0AB9]|[\u0ABD-\u0ABD]|[\u0AD0-\u0AD0]|[\u0AE0-\u0AE0]|[\u0B05-\u0B0C]|[\u0B0F-\u0B10]|[\u0B13-\u0B28]|[\u0B2A-\u0B30]|[\u0B32-\u0B33]|[\u0B36-\u0B39]|[\u0B3D-\u0B3D]|[\u0B5C-\u0B5D]|[\u0B5F-\u0B61]|[\u0B85-\u0B8A]|[\u0B8E-\u0B90]|[\u0B92-\u0B95]|[\u0B99-\u0B9A]|[\u0B9C-\u0B9C]|[\u0B9E-\u0B9F]|[\u0BA3-\u0BA4]|[\u0BA8-\u0BAA]|[\u0BAE-\u0BB5]|[\u0BB7-\u0BB9]|[\u0C05-\u0C0C]|[\u0C0E-\u0C10]|[\u0C12-\u0C28]|[\u0C2A-\u0C33]|[\u0C35-\u0C39]|[\u0C60-\u0C61]|[\u0C85-\u0C8C]|[\u0C8E-\u0C90]|[\u0C92-\u0CA8]|[\u0CAA-\u0CB3]|[\u0CB5-\u0CB9]|[\u0CDE-\u0CDE]|[\u0CE0-\u0CE1]|[\u0D05-\u0D0C]|[\u0D0E-\u0D10]|[\u0D12-\u0D28]|[\u0D2A-\u0D39]|[\u0D60-\u0D61]|[\u0E01-\u0E30]|[\u0E32-\u0E33]|[\u0E40-\u0E45]|[\u0E81-\u0E82]|[\u0E84-\u0E84]|[\u0E87-\u0E88]|[\u0E8A-\u0E8A]|[\u0E8D-\u0E8D]|[\u0E94-\u0E97]|[\u0E99-\u0E9F]|[\u0EA1-\u0EA3]|[\u0EA5-\u0EA5]|[\u0EA7-\u0EA7]|[\u0EAA-\u0EAB]|[\u0EAD-\u0EB0]|[\u0EB2-\u0EB3]|[\u0EBD-\u0EBD]|[\u0EC0-\u0EC4]|[\u0EDC-\u0EDD]|[\u0F00-\u0F00]|[\u0F40-\u0F47]|[\u0F49-\u0F69]|[\u0F88-\u0F8B]|[\u1100-\u1159]|[\u115F-\u11A2]|[\u11A8-\u11F9]|[\u2135-\u2138]|[\u3006-\u3006]|[\u3041-\u3094]|[\u30A1-\u30FA]|[\u3105-\u312C]|[\u3131-\u318E]|[\u4E00-\u9FA5]|[\uAC00-\uD7A3]|[\uF900-\uFA2D]|[\uFB1F-\uFB28]|[\uFB2A-\uFB36]|[\uFB38-\uFB3C]|[\uFB3E-\uFB3E]|[\uFB40-\uFB41]|[\uFB43-\uFB44]|[\uFB46-\uFBB1]|[\uFBD3-\uFD3D]|[\uFD50-\uFD8F]|[\uFD92-\uFDC7]|[\uFDF0-\uFDFB]|[\uFE70-\uFE72]|[\uFE74-\uFE74]|[\uFE76-\uFEFC]|[\uFF66-\uFF6F]|[\uFF71-\uFF9D]|[\uFFA0-\uFFBE]|[\uFFC2-\uFFC7]|[\uFFCA-\uFFCF]|[\uFFD2-\uFFD7]|[\uFFDA-\uFFDC]/,

  // Numbers
  Nl: /[\u2160-\u2182]|[\u3007-\u3007]|[\u3021-\u3029]/,
  Nd: /[\u0030-\u0039]|[\u0660-\u0669]|[\u06F0-\u06F9]|[\u0966-\u096F]|[\u09E6-\u09EF]|[\u0A66-\u0A6F]|[\u0AE6-\u0AEF]|[\u0B66-\u0B6F]|[\u0BE7-\u0BEF]|[\u0C66-\u0C6F]|[\u0CE6-\u0CEF]|[\u0D66-\u0D6F]|[\u0E50-\u0E59]|[\u0ED0-\u0ED9]|[\u0F20-\u0F29]|[\uFF10-\uFF19]/,

  // Marks
  Mn: /[\u0300-\u0345]|[\u0360-\u0361]|[\u0483-\u0486]|[\u0591-\u05A1]|[\u05A3-\u05B9]|[\u05BB-\u05BD]|[\u05BF-\u05BF]|[\u05C1-\u05C2]|[\u05C4-\u05C4]|[\u064B-\u0652]|[\u0670-\u0670]|[\u06D6-\u06DC]|[\u06DF-\u06E4]|[\u06E7-\u06E8]|[\u06EA-\u06ED]|[\u0901-\u0902]|[\u093C-\u093C]|[\u0941-\u0948]|[\u094D-\u094D]|[\u0951-\u0954]|[\u0962-\u0963]|[\u0981-\u0981]|[\u09BC-\u09BC]|[\u09C1-\u09C4]|[\u09CD-\u09CD]|[\u09E2-\u09E3]|[\u0A02-\u0A02]|[\u0A3C-\u0A3C]|[\u0A41-\u0A42]|[\u0A47-\u0A48]|[\u0A4B-\u0A4D]|[\u0A70-\u0A71]|[\u0A81-\u0A82]|[\u0ABC-\u0ABC]|[\u0AC1-\u0AC5]|[\u0AC7-\u0AC8]|[\u0ACD-\u0ACD]|[\u0B01-\u0B01]|[\u0B3C-\u0B3C]|[\u0B3F-\u0B3F]|[\u0B41-\u0B43]|[\u0B4D-\u0B4D]|[\u0B56-\u0B56]|[\u0B82-\u0B82]|[\u0BC0-\u0BC0]|[\u0BCD-\u0BCD]|[\u0C3E-\u0C40]|[\u0C46-\u0C48]|[\u0C4A-\u0C4D]|[\u0C55-\u0C56]|[\u0CBF-\u0CBF]|[\u0CC6-\u0CC6]|[\u0CCC-\u0CCD]|[\u0D41-\u0D43]|[\u0D4D-\u0D4D]|[\u0E31-\u0E31]|[\u0E34-\u0E3A]|[\u0E47-\u0E4E]|[\u0EB1-\u0EB1]|[\u0EB4-\u0EB9]|[\u0EBB-\u0EBC]|[\u0EC8-\u0ECD]|[\u0F18-\u0F19]|[\u0F35-\u0F35]|[\u0F37-\u0F37]|[\u0F39-\u0F39]|[\u0F71-\u0F7E]|[\u0F80-\u0F84]|[\u0F86-\u0F87]|[\u0F90-\u0F95]|[\u0F97-\u0F97]|[\u0F99-\u0FAD]|[\u0FB1-\u0FB7]|[\u0FB9-\u0FB9]|[\u20D0-\u20DC]|[\u20E1-\u20E1]|[\u302A-\u302F]|[\u3099-\u309A]|[\uFB1E-\uFB1E]|[\uFE20-\uFE23]/,
  Mc: /[\u0903-\u0903]|[\u093E-\u0940]|[\u0949-\u094C]|[\u0982-\u0983]|[\u09BE-\u09C0]|[\u09C7-\u09C8]|[\u09CB-\u09CC]|[\u09D7-\u09D7]|[\u0A3E-\u0A40]|[\u0A83-\u0A83]|[\u0ABE-\u0AC0]|[\u0AC9-\u0AC9]|[\u0ACB-\u0ACC]|[\u0B02-\u0B03]|[\u0B3E-\u0B3E]|[\u0B40-\u0B40]|[\u0B47-\u0B48]|[\u0B4B-\u0B4C]|[\u0B57-\u0B57]|[\u0B83-\u0B83]|[\u0BBE-\u0BBF]|[\u0BC1-\u0BC2]|[\u0BC6-\u0BC8]|[\u0BCA-\u0BCC]|[\u0BD7-\u0BD7]|[\u0C01-\u0C03]|[\u0C41-\u0C44]|[\u0C82-\u0C83]|[\u0CBE-\u0CBE]|[\u0CC0-\u0CC4]|[\u0CC7-\u0CC8]|[\u0CCA-\u0CCB]|[\u0CD5-\u0CD6]|[\u0D02-\u0D03]|[\u0D3E-\u0D40]|[\u0D46-\u0D48]|[\u0D4A-\u0D4C]|[\u0D57-\u0D57]|[\u0F3E-\u0F3F]|[\u0F7F-\u0F7F]/,

  // Punctuation, Connector
  Pc: /[\u005F-\u005F]|[\u203F-\u2040]|[\u30FB-\u30FB]|[\uFE33-\uFE34]|[\uFE4D-\uFE4F]|[\uFF3F-\uFF3F]|[\uFF65-\uFF65]/,

  // Separator, Space
  Zs: /[\u2000-\u200B]|[\u3000-\u3000]/,

  // These two are not real Unicode categories, but our useful for Ohm.
  // L is a combination of all the letter categories.
  // Ltmo is a combination of Lt, Lm, and Lo.
  L: /[\u0041-\u005A]|[\u00C0-\u00D6]|[\u00D8-\u00DE]|[\u0100-\u0100]|[\u0102-\u0102]|[\u0104-\u0104]|[\u0106-\u0106]|[\u0108-\u0108]|[\u010A-\u010A]|[\u010C-\u010C]|[\u010E-\u010E]|[\u0110-\u0110]|[\u0112-\u0112]|[\u0114-\u0114]|[\u0116-\u0116]|[\u0118-\u0118]|[\u011A-\u011A]|[\u011C-\u011C]|[\u011E-\u011E]|[\u0120-\u0120]|[\u0122-\u0122]|[\u0124-\u0124]|[\u0126-\u0126]|[\u0128-\u0128]|[\u012A-\u012A]|[\u012C-\u012C]|[\u012E-\u012E]|[\u0130-\u0130]|[\u0132-\u0132]|[\u0134-\u0134]|[\u0136-\u0136]|[\u0139-\u0139]|[\u013B-\u013B]|[\u013D-\u013D]|[\u013F-\u013F]|[\u0141-\u0141]|[\u0143-\u0143]|[\u0145-\u0145]|[\u0147-\u0147]|[\u014A-\u014A]|[\u014C-\u014C]|[\u014E-\u014E]|[\u0150-\u0150]|[\u0152-\u0152]|[\u0154-\u0154]|[\u0156-\u0156]|[\u0158-\u0158]|[\u015A-\u015A]|[\u015C-\u015C]|[\u015E-\u015E]|[\u0160-\u0160]|[\u0162-\u0162]|[\u0164-\u0164]|[\u0166-\u0166]|[\u0168-\u0168]|[\u016A-\u016A]|[\u016C-\u016C]|[\u016E-\u016E]|[\u0170-\u0170]|[\u0172-\u0172]|[\u0174-\u0174]|[\u0176-\u0176]|[\u0178-\u0179]|[\u017B-\u017B]|[\u017D-\u017D]|[\u0181-\u0182]|[\u0184-\u0184]|[\u0186-\u0187]|[\u0189-\u018B]|[\u018E-\u0191]|[\u0193-\u0194]|[\u0196-\u0198]|[\u019C-\u019D]|[\u019F-\u01A0]|[\u01A2-\u01A2]|[\u01A4-\u01A4]|[\u01A6-\u01A7]|[\u01A9-\u01A9]|[\u01AC-\u01AC]|[\u01AE-\u01AF]|[\u01B1-\u01B3]|[\u01B5-\u01B5]|[\u01B7-\u01B8]|[\u01BC-\u01BC]|[\u01C4-\u01C4]|[\u01C7-\u01C7]|[\u01CA-\u01CA]|[\u01CD-\u01CD]|[\u01CF-\u01CF]|[\u01D1-\u01D1]|[\u01D3-\u01D3]|[\u01D5-\u01D5]|[\u01D7-\u01D7]|[\u01D9-\u01D9]|[\u01DB-\u01DB]|[\u01DE-\u01DE]|[\u01E0-\u01E0]|[\u01E2-\u01E2]|[\u01E4-\u01E4]|[\u01E6-\u01E6]|[\u01E8-\u01E8]|[\u01EA-\u01EA]|[\u01EC-\u01EC]|[\u01EE-\u01EE]|[\u01F1-\u01F1]|[\u01F4-\u01F4]|[\u01FA-\u01FA]|[\u01FC-\u01FC]|[\u01FE-\u01FE]|[\u0200-\u0200]|[\u0202-\u0202]|[\u0204-\u0204]|[\u0206-\u0206]|[\u0208-\u0208]|[\u020A-\u020A]|[\u020C-\u020C]|[\u020E-\u020E]|[\u0210-\u0210]|[\u0212-\u0212]|[\u0214-\u0214]|[\u0216-\u0216]|[\u0386-\u0386]|[\u0388-\u038A]|[\u038C-\u038C]|[\u038E-\u038F]|[\u0391-\u03A1]|[\u03A3-\u03AB]|[\u03D2-\u03D4]|[\u03DA-\u03DA]|[\u03DC-\u03DC]|[\u03DE-\u03DE]|[\u03E0-\u03E0]|[\u03E2-\u03E2]|[\u03E4-\u03E4]|[\u03E6-\u03E6]|[\u03E8-\u03E8]|[\u03EA-\u03EA]|[\u03EC-\u03EC]|[\u03EE-\u03EE]|[\u0401-\u040C]|[\u040E-\u042F]|[\u0460-\u0460]|[\u0462-\u0462]|[\u0464-\u0464]|[\u0466-\u0466]|[\u0468-\u0468]|[\u046A-\u046A]|[\u046C-\u046C]|[\u046E-\u046E]|[\u0470-\u0470]|[\u0472-\u0472]|[\u0474-\u0474]|[\u0476-\u0476]|[\u0478-\u0478]|[\u047A-\u047A]|[\u047C-\u047C]|[\u047E-\u047E]|[\u0480-\u0480]|[\u0490-\u0490]|[\u0492-\u0492]|[\u0494-\u0494]|[\u0496-\u0496]|[\u0498-\u0498]|[\u049A-\u049A]|[\u049C-\u049C]|[\u049E-\u049E]|[\u04A0-\u04A0]|[\u04A2-\u04A2]|[\u04A4-\u04A4]|[\u04A6-\u04A6]|[\u04A8-\u04A8]|[\u04AA-\u04AA]|[\u04AC-\u04AC]|[\u04AE-\u04AE]|[\u04B0-\u04B0]|[\u04B2-\u04B2]|[\u04B4-\u04B4]|[\u04B6-\u04B6]|[\u04B8-\u04B8]|[\u04BA-\u04BA]|[\u04BC-\u04BC]|[\u04BE-\u04BE]|[\u04C1-\u04C1]|[\u04C3-\u04C3]|[\u04C7-\u04C7]|[\u04CB-\u04CB]|[\u04D0-\u04D0]|[\u04D2-\u04D2]|[\u04D4-\u04D4]|[\u04D6-\u04D6]|[\u04D8-\u04D8]|[\u04DA-\u04DA]|[\u04DC-\u04DC]|[\u04DE-\u04DE]|[\u04E0-\u04E0]|[\u04E2-\u04E2]|[\u04E4-\u04E4]|[\u04E6-\u04E6]|[\u04E8-\u04E8]|[\u04EA-\u04EA]|[\u04EE-\u04EE]|[\u04F0-\u04F0]|[\u04F2-\u04F2]|[\u04F4-\u04F4]|[\u04F8-\u04F8]|[\u0531-\u0556]|[\u10A0-\u10C5]|[\u1E00-\u1E00]|[\u1E02-\u1E02]|[\u1E04-\u1E04]|[\u1E06-\u1E06]|[\u1E08-\u1E08]|[\u1E0A-\u1E0A]|[\u1E0C-\u1E0C]|[\u1E0E-\u1E0E]|[\u1E10-\u1E10]|[\u1E12-\u1E12]|[\u1E14-\u1E14]|[\u1E16-\u1E16]|[\u1E18-\u1E18]|[\u1E1A-\u1E1A]|[\u1E1C-\u1E1C]|[\u1E1E-\u1E1E]|[\u1E20-\u1E20]|[\u1E22-\u1E22]|[\u1E24-\u1E24]|[\u1E26-\u1E26]|[\u1E28-\u1E28]|[\u1E2A-\u1E2A]|[\u1E2C-\u1E2C]|[\u1E2E-\u1E2E]|[\u1E30-\u1E30]|[\u1E32-\u1E32]|[\u1E34-\u1E34]|[\u1E36-\u1E36]|[\u1E38-\u1E38]|[\u1E3A-\u1E3A]|[\u1E3C-\u1E3C]|[\u1E3E-\u1E3E]|[\u1E40-\u1E40]|[\u1E42-\u1E42]|[\u1E44-\u1E44]|[\u1E46-\u1E46]|[\u1E48-\u1E48]|[\u1E4A-\u1E4A]|[\u1E4C-\u1E4C]|[\u1E4E-\u1E4E]|[\u1E50-\u1E50]|[\u1E52-\u1E52]|[\u1E54-\u1E54]|[\u1E56-\u1E56]|[\u1E58-\u1E58]|[\u1E5A-\u1E5A]|[\u1E5C-\u1E5C]|[\u1E5E-\u1E5E]|[\u1E60-\u1E60]|[\u1E62-\u1E62]|[\u1E64-\u1E64]|[\u1E66-\u1E66]|[\u1E68-\u1E68]|[\u1E6A-\u1E6A]|[\u1E6C-\u1E6C]|[\u1E6E-\u1E6E]|[\u1E70-\u1E70]|[\u1E72-\u1E72]|[\u1E74-\u1E74]|[\u1E76-\u1E76]|[\u1E78-\u1E78]|[\u1E7A-\u1E7A]|[\u1E7C-\u1E7C]|[\u1E7E-\u1E7E]|[\u1E80-\u1E80]|[\u1E82-\u1E82]|[\u1E84-\u1E84]|[\u1E86-\u1E86]|[\u1E88-\u1E88]|[\u1E8A-\u1E8A]|[\u1E8C-\u1E8C]|[\u1E8E-\u1E8E]|[\u1E90-\u1E90]|[\u1E92-\u1E92]|[\u1E94-\u1E94]|[\u1EA0-\u1EA0]|[\u1EA2-\u1EA2]|[\u1EA4-\u1EA4]|[\u1EA6-\u1EA6]|[\u1EA8-\u1EA8]|[\u1EAA-\u1EAA]|[\u1EAC-\u1EAC]|[\u1EAE-\u1EAE]|[\u1EB0-\u1EB0]|[\u1EB2-\u1EB2]|[\u1EB4-\u1EB4]|[\u1EB6-\u1EB6]|[\u1EB8-\u1EB8]|[\u1EBA-\u1EBA]|[\u1EBC-\u1EBC]|[\u1EBE-\u1EBE]|[\u1EC0-\u1EC0]|[\u1EC2-\u1EC2]|[\u1EC4-\u1EC4]|[\u1EC6-\u1EC6]|[\u1EC8-\u1EC8]|[\u1ECA-\u1ECA]|[\u1ECC-\u1ECC]|[\u1ECE-\u1ECE]|[\u1ED0-\u1ED0]|[\u1ED2-\u1ED2]|[\u1ED4-\u1ED4]|[\u1ED6-\u1ED6]|[\u1ED8-\u1ED8]|[\u1EDA-\u1EDA]|[\u1EDC-\u1EDC]|[\u1EDE-\u1EDE]|[\u1EE0-\u1EE0]|[\u1EE2-\u1EE2]|[\u1EE4-\u1EE4]|[\u1EE6-\u1EE6]|[\u1EE8-\u1EE8]|[\u1EEA-\u1EEA]|[\u1EEC-\u1EEC]|[\u1EEE-\u1EEE]|[\u1EF0-\u1EF0]|[\u1EF2-\u1EF2]|[\u1EF4-\u1EF4]|[\u1EF6-\u1EF6]|[\u1EF8-\u1EF8]|[\u1F08-\u1F0F]|[\u1F18-\u1F1D]|[\u1F28-\u1F2F]|[\u1F38-\u1F3F]|[\u1F48-\u1F4D]|[\u1F59-\u1F59]|[\u1F5B-\u1F5B]|[\u1F5D-\u1F5D]|[\u1F5F-\u1F5F]|[\u1F68-\u1F6F]|[\u1F88-\u1F8F]|[\u1F98-\u1F9F]|[\u1FA8-\u1FAF]|[\u1FB8-\u1FBC]|[\u1FC8-\u1FCC]|[\u1FD8-\u1FDB]|[\u1FE8-\u1FEC]|[\u1FF8-\u1FFC]|[\u2102-\u2102]|[\u2107-\u2107]|[\u210B-\u210D]|[\u2110-\u2112]|[\u2115-\u2115]|[\u2119-\u211D]|[\u2124-\u2124]|[\u2126-\u2126]|[\u2128-\u2128]|[\u212A-\u212D]|[\u2130-\u2131]|[\u2133-\u2133]|[\uFF21-\uFF3A]|[\u0061-\u007A]|[\u00AA-\u00AA]|[\u00B5-\u00B5]|[\u00BA-\u00BA]|[\u00DF-\u00F6]|[\u00F8-\u00FF]|[\u0101-\u0101]|[\u0103-\u0103]|[\u0105-\u0105]|[\u0107-\u0107]|[\u0109-\u0109]|[\u010B-\u010B]|[\u010D-\u010D]|[\u010F-\u010F]|[\u0111-\u0111]|[\u0113-\u0113]|[\u0115-\u0115]|[\u0117-\u0117]|[\u0119-\u0119]|[\u011B-\u011B]|[\u011D-\u011D]|[\u011F-\u011F]|[\u0121-\u0121]|[\u0123-\u0123]|[\u0125-\u0125]|[\u0127-\u0127]|[\u0129-\u0129]|[\u012B-\u012B]|[\u012D-\u012D]|[\u012F-\u012F]|[\u0131-\u0131]|[\u0133-\u0133]|[\u0135-\u0135]|[\u0137-\u0138]|[\u013A-\u013A]|[\u013C-\u013C]|[\u013E-\u013E]|[\u0140-\u0140]|[\u0142-\u0142]|[\u0144-\u0144]|[\u0146-\u0146]|[\u0148-\u0149]|[\u014B-\u014B]|[\u014D-\u014D]|[\u014F-\u014F]|[\u0151-\u0151]|[\u0153-\u0153]|[\u0155-\u0155]|[\u0157-\u0157]|[\u0159-\u0159]|[\u015B-\u015B]|[\u015D-\u015D]|[\u015F-\u015F]|[\u0161-\u0161]|[\u0163-\u0163]|[\u0165-\u0165]|[\u0167-\u0167]|[\u0169-\u0169]|[\u016B-\u016B]|[\u016D-\u016D]|[\u016F-\u016F]|[\u0171-\u0171]|[\u0173-\u0173]|[\u0175-\u0175]|[\u0177-\u0177]|[\u017A-\u017A]|[\u017C-\u017C]|[\u017E-\u0180]|[\u0183-\u0183]|[\u0185-\u0185]|[\u0188-\u0188]|[\u018C-\u018D]|[\u0192-\u0192]|[\u0195-\u0195]|[\u0199-\u019B]|[\u019E-\u019E]|[\u01A1-\u01A1]|[\u01A3-\u01A3]|[\u01A5-\u01A5]|[\u01A8-\u01A8]|[\u01AB-\u01AB]|[\u01AD-\u01AD]|[\u01B0-\u01B0]|[\u01B4-\u01B4]|[\u01B6-\u01B6]|[\u01B9-\u01BA]|[\u01BD-\u01BD]|[\u01C6-\u01C6]|[\u01C9-\u01C9]|[\u01CC-\u01CC]|[\u01CE-\u01CE]|[\u01D0-\u01D0]|[\u01D2-\u01D2]|[\u01D4-\u01D4]|[\u01D6-\u01D6]|[\u01D8-\u01D8]|[\u01DA-\u01DA]|[\u01DC-\u01DD]|[\u01DF-\u01DF]|[\u01E1-\u01E1]|[\u01E3-\u01E3]|[\u01E5-\u01E5]|[\u01E7-\u01E7]|[\u01E9-\u01E9]|[\u01EB-\u01EB]|[\u01ED-\u01ED]|[\u01EF-\u01F0]|[\u01F3-\u01F3]|[\u01F5-\u01F5]|[\u01FB-\u01FB]|[\u01FD-\u01FD]|[\u01FF-\u01FF]|[\u0201-\u0201]|[\u0203-\u0203]|[\u0205-\u0205]|[\u0207-\u0207]|[\u0209-\u0209]|[\u020B-\u020B]|[\u020D-\u020D]|[\u020F-\u020F]|[\u0211-\u0211]|[\u0213-\u0213]|[\u0215-\u0215]|[\u0217-\u0217]|[\u0250-\u02A8]|[\u0390-\u0390]|[\u03AC-\u03CE]|[\u03D0-\u03D1]|[\u03D5-\u03D6]|[\u03E3-\u03E3]|[\u03E5-\u03E5]|[\u03E7-\u03E7]|[\u03E9-\u03E9]|[\u03EB-\u03EB]|[\u03ED-\u03ED]|[\u03EF-\u03F2]|[\u0430-\u044F]|[\u0451-\u045C]|[\u045E-\u045F]|[\u0461-\u0461]|[\u0463-\u0463]|[\u0465-\u0465]|[\u0467-\u0467]|[\u0469-\u0469]|[\u046B-\u046B]|[\u046D-\u046D]|[\u046F-\u046F]|[\u0471-\u0471]|[\u0473-\u0473]|[\u0475-\u0475]|[\u0477-\u0477]|[\u0479-\u0479]|[\u047B-\u047B]|[\u047D-\u047D]|[\u047F-\u047F]|[\u0481-\u0481]|[\u0491-\u0491]|[\u0493-\u0493]|[\u0495-\u0495]|[\u0497-\u0497]|[\u0499-\u0499]|[\u049B-\u049B]|[\u049D-\u049D]|[\u049F-\u049F]|[\u04A1-\u04A1]|[\u04A3-\u04A3]|[\u04A5-\u04A5]|[\u04A7-\u04A7]|[\u04A9-\u04A9]|[\u04AB-\u04AB]|[\u04AD-\u04AD]|[\u04AF-\u04AF]|[\u04B1-\u04B1]|[\u04B3-\u04B3]|[\u04B5-\u04B5]|[\u04B7-\u04B7]|[\u04B9-\u04B9]|[\u04BB-\u04BB]|[\u04BD-\u04BD]|[\u04BF-\u04BF]|[\u04C2-\u04C2]|[\u04C4-\u04C4]|[\u04C8-\u04C8]|[\u04CC-\u04CC]|[\u04D1-\u04D1]|[\u04D3-\u04D3]|[\u04D5-\u04D5]|[\u04D7-\u04D7]|[\u04D9-\u04D9]|[\u04DB-\u04DB]|[\u04DD-\u04DD]|[\u04DF-\u04DF]|[\u04E1-\u04E1]|[\u04E3-\u04E3]|[\u04E5-\u04E5]|[\u04E7-\u04E7]|[\u04E9-\u04E9]|[\u04EB-\u04EB]|[\u04EF-\u04EF]|[\u04F1-\u04F1]|[\u04F3-\u04F3]|[\u04F5-\u04F5]|[\u04F9-\u04F9]|[\u0561-\u0587]|[\u10D0-\u10F6]|[\u1E01-\u1E01]|[\u1E03-\u1E03]|[\u1E05-\u1E05]|[\u1E07-\u1E07]|[\u1E09-\u1E09]|[\u1E0B-\u1E0B]|[\u1E0D-\u1E0D]|[\u1E0F-\u1E0F]|[\u1E11-\u1E11]|[\u1E13-\u1E13]|[\u1E15-\u1E15]|[\u1E17-\u1E17]|[\u1E19-\u1E19]|[\u1E1B-\u1E1B]|[\u1E1D-\u1E1D]|[\u1E1F-\u1E1F]|[\u1E21-\u1E21]|[\u1E23-\u1E23]|[\u1E25-\u1E25]|[\u1E27-\u1E27]|[\u1E29-\u1E29]|[\u1E2B-\u1E2B]|[\u1E2D-\u1E2D]|[\u1E2F-\u1E2F]|[\u1E31-\u1E31]|[\u1E33-\u1E33]|[\u1E35-\u1E35]|[\u1E37-\u1E37]|[\u1E39-\u1E39]|[\u1E3B-\u1E3B]|[\u1E3D-\u1E3D]|[\u1E3F-\u1E3F]|[\u1E41-\u1E41]|[\u1E43-\u1E43]|[\u1E45-\u1E45]|[\u1E47-\u1E47]|[\u1E49-\u1E49]|[\u1E4B-\u1E4B]|[\u1E4D-\u1E4D]|[\u1E4F-\u1E4F]|[\u1E51-\u1E51]|[\u1E53-\u1E53]|[\u1E55-\u1E55]|[\u1E57-\u1E57]|[\u1E59-\u1E59]|[\u1E5B-\u1E5B]|[\u1E5D-\u1E5D]|[\u1E5F-\u1E5F]|[\u1E61-\u1E61]|[\u1E63-\u1E63]|[\u1E65-\u1E65]|[\u1E67-\u1E67]|[\u1E69-\u1E69]|[\u1E6B-\u1E6B]|[\u1E6D-\u1E6D]|[\u1E6F-\u1E6F]|[\u1E71-\u1E71]|[\u1E73-\u1E73]|[\u1E75-\u1E75]|[\u1E77-\u1E77]|[\u1E79-\u1E79]|[\u1E7B-\u1E7B]|[\u1E7D-\u1E7D]|[\u1E7F-\u1E7F]|[\u1E81-\u1E81]|[\u1E83-\u1E83]|[\u1E85-\u1E85]|[\u1E87-\u1E87]|[\u1E89-\u1E89]|[\u1E8B-\u1E8B]|[\u1E8D-\u1E8D]|[\u1E8F-\u1E8F]|[\u1E91-\u1E91]|[\u1E93-\u1E93]|[\u1E95-\u1E9B]|[\u1EA1-\u1EA1]|[\u1EA3-\u1EA3]|[\u1EA5-\u1EA5]|[\u1EA7-\u1EA7]|[\u1EA9-\u1EA9]|[\u1EAB-\u1EAB]|[\u1EAD-\u1EAD]|[\u1EAF-\u1EAF]|[\u1EB1-\u1EB1]|[\u1EB3-\u1EB3]|[\u1EB5-\u1EB5]|[\u1EB7-\u1EB7]|[\u1EB9-\u1EB9]|[\u1EBB-\u1EBB]|[\u1EBD-\u1EBD]|[\u1EBF-\u1EBF]|[\u1EC1-\u1EC1]|[\u1EC3-\u1EC3]|[\u1EC5-\u1EC5]|[\u1EC7-\u1EC7]|[\u1EC9-\u1EC9]|[\u1ECB-\u1ECB]|[\u1ECD-\u1ECD]|[\u1ECF-\u1ECF]|[\u1ED1-\u1ED1]|[\u1ED3-\u1ED3]|[\u1ED5-\u1ED5]|[\u1ED7-\u1ED7]|[\u1ED9-\u1ED9]|[\u1EDB-\u1EDB]|[\u1EDD-\u1EDD]|[\u1EDF-\u1EDF]|[\u1EE1-\u1EE1]|[\u1EE3-\u1EE3]|[\u1EE5-\u1EE5]|[\u1EE7-\u1EE7]|[\u1EE9-\u1EE9]|[\u1EEB-\u1EEB]|[\u1EED-\u1EED]|[\u1EEF-\u1EEF]|[\u1EF1-\u1EF1]|[\u1EF3-\u1EF3]|[\u1EF5-\u1EF5]|[\u1EF7-\u1EF7]|[\u1EF9-\u1EF9]|[\u1F00-\u1F07]|[\u1F10-\u1F15]|[\u1F20-\u1F27]|[\u1F30-\u1F37]|[\u1F40-\u1F45]|[\u1F50-\u1F57]|[\u1F60-\u1F67]|[\u1F70-\u1F7D]|[\u1F80-\u1F87]|[\u1F90-\u1F97]|[\u1FA0-\u1FA7]|[\u1FB0-\u1FB4]|[\u1FB6-\u1FB7]|[\u1FBE-\u1FBE]|[\u1FC2-\u1FC4]|[\u1FC6-\u1FC7]|[\u1FD0-\u1FD3]|[\u1FD6-\u1FD7]|[\u1FE0-\u1FE7]|[\u1FF2-\u1FF4]|[\u1FF6-\u1FF7]|[\u207F-\u207F]|[\u210A-\u210A]|[\u210E-\u210F]|[\u2113-\u2113]|[\u2118-\u2118]|[\u212E-\u212F]|[\u2134-\u2134]|[\uFB00-\uFB06]|[\uFB13-\uFB17]|[\uFF41-\uFF5A]|[\u01C5-\u01C5]|[\u01C8-\u01C8]|[\u01CB-\u01CB]|[\u01F2-\u01F2]|[\u02B0-\u02B8]|[\u02BB-\u02C1]|[\u02D0-\u02D1]|[\u02E0-\u02E4]|[\u037A-\u037A]|[\u0559-\u0559]|[\u0640-\u0640]|[\u06E5-\u06E6]|[\u0E46-\u0E46]|[\u0EC6-\u0EC6]|[\u3005-\u3005]|[\u3031-\u3035]|[\u309D-\u309E]|[\u30FC-\u30FE]|[\uFF70-\uFF70]|[\uFF9E-\uFF9F]|[\u01AA-\u01AA]|[\u01BB-\u01BB]|[\u01BE-\u01C3]|[\u03F3-\u03F3]|[\u04C0-\u04C0]|[\u05D0-\u05EA]|[\u05F0-\u05F2]|[\u0621-\u063A]|[\u0641-\u064A]|[\u0671-\u06B7]|[\u06BA-\u06BE]|[\u06C0-\u06CE]|[\u06D0-\u06D3]|[\u06D5-\u06D5]|[\u0905-\u0939]|[\u093D-\u093D]|[\u0950-\u0950]|[\u0958-\u0961]|[\u0985-\u098C]|[\u098F-\u0990]|[\u0993-\u09A8]|[\u09AA-\u09B0]|[\u09B2-\u09B2]|[\u09B6-\u09B9]|[\u09DC-\u09DD]|[\u09DF-\u09E1]|[\u09F0-\u09F1]|[\u0A05-\u0A0A]|[\u0A0F-\u0A10]|[\u0A13-\u0A28]|[\u0A2A-\u0A30]|[\u0A32-\u0A33]|[\u0A35-\u0A36]|[\u0A38-\u0A39]|[\u0A59-\u0A5C]|[\u0A5E-\u0A5E]|[\u0A72-\u0A74]|[\u0A85-\u0A8B]|[\u0A8D-\u0A8D]|[\u0A8F-\u0A91]|[\u0A93-\u0AA8]|[\u0AAA-\u0AB0]|[\u0AB2-\u0AB3]|[\u0AB5-\u0AB9]|[\u0ABD-\u0ABD]|[\u0AD0-\u0AD0]|[\u0AE0-\u0AE0]|[\u0B05-\u0B0C]|[\u0B0F-\u0B10]|[\u0B13-\u0B28]|[\u0B2A-\u0B30]|[\u0B32-\u0B33]|[\u0B36-\u0B39]|[\u0B3D-\u0B3D]|[\u0B5C-\u0B5D]|[\u0B5F-\u0B61]|[\u0B85-\u0B8A]|[\u0B8E-\u0B90]|[\u0B92-\u0B95]|[\u0B99-\u0B9A]|[\u0B9C-\u0B9C]|[\u0B9E-\u0B9F]|[\u0BA3-\u0BA4]|[\u0BA8-\u0BAA]|[\u0BAE-\u0BB5]|[\u0BB7-\u0BB9]|[\u0C05-\u0C0C]|[\u0C0E-\u0C10]|[\u0C12-\u0C28]|[\u0C2A-\u0C33]|[\u0C35-\u0C39]|[\u0C60-\u0C61]|[\u0C85-\u0C8C]|[\u0C8E-\u0C90]|[\u0C92-\u0CA8]|[\u0CAA-\u0CB3]|[\u0CB5-\u0CB9]|[\u0CDE-\u0CDE]|[\u0CE0-\u0CE1]|[\u0D05-\u0D0C]|[\u0D0E-\u0D10]|[\u0D12-\u0D28]|[\u0D2A-\u0D39]|[\u0D60-\u0D61]|[\u0E01-\u0E30]|[\u0E32-\u0E33]|[\u0E40-\u0E45]|[\u0E81-\u0E82]|[\u0E84-\u0E84]|[\u0E87-\u0E88]|[\u0E8A-\u0E8A]|[\u0E8D-\u0E8D]|[\u0E94-\u0E97]|[\u0E99-\u0E9F]|[\u0EA1-\u0EA3]|[\u0EA5-\u0EA5]|[\u0EA7-\u0EA7]|[\u0EAA-\u0EAB]|[\u0EAD-\u0EB0]|[\u0EB2-\u0EB3]|[\u0EBD-\u0EBD]|[\u0EC0-\u0EC4]|[\u0EDC-\u0EDD]|[\u0F00-\u0F00]|[\u0F40-\u0F47]|[\u0F49-\u0F69]|[\u0F88-\u0F8B]|[\u1100-\u1159]|[\u115F-\u11A2]|[\u11A8-\u11F9]|[\u2135-\u2138]|[\u3006-\u3006]|[\u3041-\u3094]|[\u30A1-\u30FA]|[\u3105-\u312C]|[\u3131-\u318E]|[\u4E00-\u9FA5]|[\uAC00-\uD7A3]|[\uF900-\uFA2D]|[\uFB1F-\uFB28]|[\uFB2A-\uFB36]|[\uFB38-\uFB3C]|[\uFB3E-\uFB3E]|[\uFB40-\uFB41]|[\uFB43-\uFB44]|[\uFB46-\uFBB1]|[\uFBD3-\uFD3D]|[\uFD50-\uFD8F]|[\uFD92-\uFDC7]|[\uFDF0-\uFDFB]|[\uFE70-\uFE72]|[\uFE74-\uFE74]|[\uFE76-\uFEFC]|[\uFF66-\uFF6F]|[\uFF71-\uFF9D]|[\uFFA0-\uFFBE]|[\uFFC2-\uFFC7]|[\uFFCA-\uFFCF]|[\uFFD2-\uFFD7]|[\uFFDA-\uFFDC]/,
  Ltmo: /[\u01C5-\u01C5]|[\u01C8-\u01C8]|[\u01CB-\u01CB]|[\u01F2-\u01F2][\u02B0-\u02B8]|[\u02BB-\u02C1]|[\u02D0-\u02D1]|[\u02E0-\u02E4]|[\u037A-\u037A]|[\u0559-\u0559]|[\u0640-\u0640]|[\u06E5-\u06E6]|[\u0E46-\u0E46]|[\u0EC6-\u0EC6]|[\u3005-\u3005]|[\u3031-\u3035]|[\u309D-\u309E]|[\u30FC-\u30FE]|[\uFF70-\uFF70]|[\uFF9E-\uFF9F][\u01AA-\u01AA]|[\u01BB-\u01BB]|[\u01BE-\u01C3]|[\u03F3-\u03F3]|[\u04C0-\u04C0]|[\u05D0-\u05EA]|[\u05F0-\u05F2]|[\u0621-\u063A]|[\u0641-\u064A]|[\u0671-\u06B7]|[\u06BA-\u06BE]|[\u06C0-\u06CE]|[\u06D0-\u06D3]|[\u06D5-\u06D5]|[\u0905-\u0939]|[\u093D-\u093D]|[\u0950-\u0950]|[\u0958-\u0961]|[\u0985-\u098C]|[\u098F-\u0990]|[\u0993-\u09A8]|[\u09AA-\u09B0]|[\u09B2-\u09B2]|[\u09B6-\u09B9]|[\u09DC-\u09DD]|[\u09DF-\u09E1]|[\u09F0-\u09F1]|[\u0A05-\u0A0A]|[\u0A0F-\u0A10]|[\u0A13-\u0A28]|[\u0A2A-\u0A30]|[\u0A32-\u0A33]|[\u0A35-\u0A36]|[\u0A38-\u0A39]|[\u0A59-\u0A5C]|[\u0A5E-\u0A5E]|[\u0A72-\u0A74]|[\u0A85-\u0A8B]|[\u0A8D-\u0A8D]|[\u0A8F-\u0A91]|[\u0A93-\u0AA8]|[\u0AAA-\u0AB0]|[\u0AB2-\u0AB3]|[\u0AB5-\u0AB9]|[\u0ABD-\u0ABD]|[\u0AD0-\u0AD0]|[\u0AE0-\u0AE0]|[\u0B05-\u0B0C]|[\u0B0F-\u0B10]|[\u0B13-\u0B28]|[\u0B2A-\u0B30]|[\u0B32-\u0B33]|[\u0B36-\u0B39]|[\u0B3D-\u0B3D]|[\u0B5C-\u0B5D]|[\u0B5F-\u0B61]|[\u0B85-\u0B8A]|[\u0B8E-\u0B90]|[\u0B92-\u0B95]|[\u0B99-\u0B9A]|[\u0B9C-\u0B9C]|[\u0B9E-\u0B9F]|[\u0BA3-\u0BA4]|[\u0BA8-\u0BAA]|[\u0BAE-\u0BB5]|[\u0BB7-\u0BB9]|[\u0C05-\u0C0C]|[\u0C0E-\u0C10]|[\u0C12-\u0C28]|[\u0C2A-\u0C33]|[\u0C35-\u0C39]|[\u0C60-\u0C61]|[\u0C85-\u0C8C]|[\u0C8E-\u0C90]|[\u0C92-\u0CA8]|[\u0CAA-\u0CB3]|[\u0CB5-\u0CB9]|[\u0CDE-\u0CDE]|[\u0CE0-\u0CE1]|[\u0D05-\u0D0C]|[\u0D0E-\u0D10]|[\u0D12-\u0D28]|[\u0D2A-\u0D39]|[\u0D60-\u0D61]|[\u0E01-\u0E30]|[\u0E32-\u0E33]|[\u0E40-\u0E45]|[\u0E81-\u0E82]|[\u0E84-\u0E84]|[\u0E87-\u0E88]|[\u0E8A-\u0E8A]|[\u0E8D-\u0E8D]|[\u0E94-\u0E97]|[\u0E99-\u0E9F]|[\u0EA1-\u0EA3]|[\u0EA5-\u0EA5]|[\u0EA7-\u0EA7]|[\u0EAA-\u0EAB]|[\u0EAD-\u0EB0]|[\u0EB2-\u0EB3]|[\u0EBD-\u0EBD]|[\u0EC0-\u0EC4]|[\u0EDC-\u0EDD]|[\u0F00-\u0F00]|[\u0F40-\u0F47]|[\u0F49-\u0F69]|[\u0F88-\u0F8B]|[\u1100-\u1159]|[\u115F-\u11A2]|[\u11A8-\u11F9]|[\u2135-\u2138]|[\u3006-\u3006]|[\u3041-\u3094]|[\u30A1-\u30FA]|[\u3105-\u312C]|[\u3131-\u318E]|[\u4E00-\u9FA5]|[\uAC00-\uD7A3]|[\uF900-\uFA2D]|[\uFB1F-\uFB28]|[\uFB2A-\uFB36]|[\uFB38-\uFB3C]|[\uFB3E-\uFB3E]|[\uFB40-\uFB41]|[\uFB43-\uFB44]|[\uFB46-\uFBB1]|[\uFBD3-\uFD3D]|[\uFD50-\uFD8F]|[\uFD92-\uFDC7]|[\uFDF0-\uFDFB]|[\uFE70-\uFE72]|[\uFE74-\uFE74]|[\uFE76-\uFEFC]|[\uFF66-\uFF6F]|[\uFF71-\uFF9D]|[\uFFA0-\uFFBE]|[\uFFC2-\uFFC7]|[\uFFCA-\uFFCF]|[\uFFD2-\uFFD7]|[\uFFDA-\uFFDC]/
};

},{}]},{},[41])(41)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwiZGlzdC9vaG0tZ3JhbW1hci5qcyIsImRpc3Qvb3BlcmF0aW9ucy1hbmQtYXR0cmlidXRlcy5qcyIsImV4dHJhcy9pbmRleC5qcyIsImV4dHJhcy9zZW1hbnRpY3MtdG9BU1QuanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL2lzLWltcGxlbWVudGVkLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvaXMtc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9ub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3QvYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2Fzc2lnbi9pcy1pbXBsZW1lbnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9hc3NpZ24vc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9pcy1jYWxsYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2tleXMvaXMtaW1wbGVtZW50ZWQuanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9ub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3Qva2V5cy9zaGltLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L25vcm1hbGl6ZS1vcHRpb25zLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L3ZhbGlkLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvc3RyaW5nLyMvY29udGFpbnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9ub2RlX21vZHVsZXMvZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucy9pcy1pbXBsZW1lbnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zL3NoaW0uanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL3ZhbGlkYXRlLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dGlsLWV4dGVuZC9leHRlbmQuanMiLCJzcmMvQnVpbGRlci5qcyIsInNyYy9GYWlsdXJlLmpzIiwic3JjL0dyYW1tYXIuanMiLCJzcmMvR3JhbW1hckRlY2wuanMiLCJzcmMvSW5wdXRTdHJlYW0uanMiLCJzcmMvSW50ZXJ2YWwuanMiLCJzcmMvTWF0Y2hSZXN1bHQuanMiLCJzcmMvTmFtZXNwYWNlLmpzIiwic3JjL1Bvc0luZm8uanMiLCJzcmMvU2VtYW50aWNzLmpzIiwic3JjL1N0YXRlLmpzIiwic3JjL1RyYWNlLmpzIiwic3JjL2NvbW1vbi5qcyIsInNyYy9lcnJvcnMuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9ub2Rlcy5qcyIsInNyYy9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZS5qcyIsInNyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJzcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzIiwic3JjL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUuanMiLCJzcmMvcGV4cHJzLWFzc2VydFZhbHVlc0FuZFN0cmluZ3NBcmVOb3RNaXhlZC5qcyIsInNyYy9wZXhwcnMtY2hlY2suanMiLCJzcmMvcGV4cHJzLWV2YWwuanMiLCJzcmMvcGV4cHJzLWdldEFyaXR5LmpzIiwic3JjL3BleHBycy1nZXRFeHByVHlwZS5qcyIsInNyYy9wZXhwcnMtaW50cm9kdWNlUGFyYW1zLmpzIiwic3JjL3BleHBycy1pc051bGxhYmxlLmpzIiwic3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCJzcmMvcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMuanMiLCJzcmMvcGV4cHJzLXRvQXJndW1lbnROYW1lTGlzdC5qcyIsInNyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwic3JjL3BleHBycy10b0ZhaWx1cmUuanMiLCJzcmMvcGV4cHJzLXRvU3RyaW5nLmpzIiwic3JjL3BleHBycy5qcyIsInNyYy91dGlsLmpzIiwidGhpcmRfcGFydHkvVW5pY29kZUNhdGVnb3JpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9NQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2paQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKGZ1bmN0aW9uKCkge1xuICB2YXIgZGVjbCA9IHRoaXMubmV3R3JhbW1hcihcIkJ1aWx0SW5SdWxlc1wiKVxuICAgIC53aXRoU291cmNlKFwiQnVpbHRJblJ1bGVzIHtcXG5cXG4gIGFsbnVtICAoYW4gYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXIpXFxuICAgID0gbGV0dGVyXFxuICAgIHwgZGlnaXRcXG5cXG4gIGxldHRlciAgKGEgbGV0dGVyKVxcbiAgICA9IGxvd2VyXFxuICAgIHwgdXBwZXJcXG4gICAgfCB1bmljb2RlTHRtb1xcblxcbiAgZGlnaXQgIChhIGRpZ2l0KVxcbiAgICA9IFxcXCIwXFxcIi4uXFxcIjlcXFwiXFxuXFxuICBoZXhEaWdpdCAgKGEgaGV4YWRlY2ltYWwgZGlnaXQpXFxuICAgID0gZGlnaXRcXG4gICAgfCBcXFwiYVxcXCIuLlxcXCJmXFxcIlxcbiAgICB8IFxcXCJBXFxcIi4uXFxcIkZcXFwiXFxuXFxuICBMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IE5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgfCBFbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuXFxuICBOb25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gZWxlbSAoc2VwIGVsZW0pKlxcblxcbiAgRW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IC8qIG5vdGhpbmcgKi9cXG5cXG4gIGxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gbm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICB8IGVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG5cXG4gIG5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBlbGVtIChzZXAgZWxlbSkqXFxuXFxuICBlbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gLyogbm90aGluZyAqL1xcblxcbn1cIilcbiAgcmV0dXJuIGRlY2xcbiAgICAuZGVmaW5lKFwiYWxudW1cIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwibGV0dGVyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDYwLCA2NikpLCB0aGlzLmFwcChcImRpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDczLCA3OCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2MCwgNzgpKSwgXCJhbiBhbHBoYS1udW1lcmljIGNoYXJhY3RlclwiKVxuICAgIC5kZWZpbmUoXCJsZXR0ZXJcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwibG93ZXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA3LCAxMTIpKSwgdGhpcy5hcHAoXCJ1cHBlclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTksIDEyNCkpLCB0aGlzLmFwcChcInVuaWNvZGVMdG1vXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMTQyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNywgMTQyKSksIFwiYSBsZXR0ZXJcIilcbiAgICAuZGVmaW5lKFwiZGlnaXRcIiwgW10sIHRoaXMucmFuZ2UoXCIwXCIsIFwiOVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjksIDE3NykpLCBcImEgZGlnaXRcIilcbiAgICAuZGVmaW5lKFwiaGV4RGlnaXRcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiZGlnaXRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE5LCAyMjQpKSwgdGhpcy5yYW5nZShcImFcIiwgXCJmXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIzMSwgMjM5KSksIHRoaXMucmFuZ2UoXCJBXCIsIFwiRlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDYsIDI1NCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTksIDI1NCkpLCBcImEgaGV4YWRlY2ltYWwgZGlnaXRcIilcbiAgICAuZGVmaW5lKFwiTGlzdE9mXCIsIFtcImVsZW1cIiwgXCJzZXBcIl0sIHRoaXMuYWx0KHRoaXMuYXBwKFwiTm9uZW1wdHlMaXN0T2ZcIiwgW3RoaXMucGFyYW0oMCksIHRoaXMucGFyYW0oMSldKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyODIsIDMwNykpLCB0aGlzLmFwcChcIkVtcHR5TGlzdE9mXCIsIFt0aGlzLnBhcmFtKDApLCB0aGlzLnBhcmFtKDEpXSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzE0LCAzMzYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjgyLCAzMzYpKSlcbiAgICAuZGVmaW5lKFwiTm9uZW1wdHlMaXN0T2ZcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5zZXEodGhpcy5wYXJhbSgwKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucGFyYW0oMSksIHRoaXMucGFyYW0oMCkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM3OCwgMzg2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM3NywgMzg4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM3MiwgMzg4KSkpXG4gICAgLmRlZmluZShcIkVtcHR5TGlzdE9mXCIsIFtcImVsZW1cIiwgXCJzZXBcIl0sIHRoaXMuc2VxKCkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDM4LCA0MzgpKSlcbiAgICAuZGVmaW5lKFwibGlzdE9mXCIsIFtcImVsZW1cIiwgXCJzZXBcIl0sIHRoaXMuYWx0KHRoaXMuYXBwKFwibm9uZW1wdHlMaXN0T2ZcIiwgW3RoaXMucGFyYW0oMCksIHRoaXMucGFyYW0oMSldKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0NjIsIDQ4NykpLCB0aGlzLmFwcChcImVtcHR5TGlzdE9mXCIsIFt0aGlzLnBhcmFtKDApLCB0aGlzLnBhcmFtKDEpXSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDk0LCA1MTYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDYyLCA1MTYpKSlcbiAgICAuZGVmaW5lKFwibm9uZW1wdHlMaXN0T2ZcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5zZXEodGhpcy5wYXJhbSgwKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucGFyYW0oMSksIHRoaXMucGFyYW0oMCkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU1OCwgNTY2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU1NywgNTY4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU1MiwgNTY4KSkpXG4gICAgLmRlZmluZShcImVtcHR5TGlzdE9mXCIsIFtcImVsZW1cIiwgXCJzZXBcIl0sIHRoaXMuc2VxKCkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjE2LCA2MTYpKSlcbiAgICAuYnVpbGQoKTtcbn0pO1xuXG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoZnVuY3Rpb24oKSB7XG4gIHZhciBkZWNsID0gdGhpcy5uZXdHcmFtbWFyKFwiT2htXCIpXG4gICAgLndpdGhTb3VyY2UoXCJPaG0ge1xcblxcbiAgR3JhbW1hcnNcXG4gICAgPSBHcmFtbWFyKlxcblxcbiAgR3JhbW1hclxcbiAgICA9IGlkZW50IFN1cGVyR3JhbW1hcj8gXFxcIntcXFwiIFJ1bGUqIFxcXCJ9XFxcIlxcblxcbiAgU3VwZXJHcmFtbWFyXFxuICAgID0gXFxcIjw6XFxcIiBpZGVudFxcblxcbiAgUnVsZVxcbiAgICA9IGlkZW50IEZvcm1hbHM/IHJ1bGVEZXNjcj8gXFxcIj1cXFwiICBcXFwifFxcXCI/IEFsdCAgLS0gZGVmaW5lXFxuICAgIHwgaWRlbnQgRm9ybWFscz8gICAgICAgICAgICBcXFwiOj1cXFwiIFxcXCJ8XFxcIj8gQWx0ICAtLSBvdmVycmlkZVxcbiAgICB8IGlkZW50IEZvcm1hbHM/ICAgICAgICAgICAgXFxcIis9XFxcIiBcXFwifFxcXCI/IEFsdCAgLS0gZXh0ZW5kXFxuXFxuICBGb3JtYWxzXFxuICAgID0gXFxcIjxcXFwiIExpc3RPZjxpZGVudCwgXFxcIixcXFwiPiBcXFwiPlxcXCJcXG5cXG4gIFBhcmFtc1xcbiAgICA9IFxcXCI8XFxcIiBMaXN0T2Y8U2VxLCBcXFwiLFxcXCI+IFxcXCI+XFxcIlxcblxcbiAgQWx0XFxuICAgID0gVGVybSAoXFxcInxcXFwiIFRlcm0pKlxcblxcbiAgVGVybVxcbiAgICA9IFNlcSBjYXNlTmFtZSAtLSBpbmxpbmVcXG4gICAgfCBTZXFcXG5cXG4gIFNlcVxcbiAgICA9IEl0ZXIqXFxuXFxuICBJdGVyXFxuICAgID0gUHJlZCBcXFwiKlxcXCIgIC0tIHN0YXJcXG4gICAgfCBQcmVkIFxcXCIrXFxcIiAgLS0gcGx1c1xcbiAgICB8IFByZWQgXFxcIj9cXFwiICAtLSBvcHRcXG4gICAgfCBQcmVkXFxuXFxuICBQcmVkXFxuICAgID0gXFxcIn5cXFwiIE1vZGlmaWVyICAtLSBub3RcXG4gICAgfCBcXFwiJlxcXCIgTW9kaWZpZXIgIC0tIGxvb2thaGVhZFxcbiAgICB8IE1vZGlmaWVyXFxuXFxuICBNb2RpZmllclxcbiAgICA9IFxcXCIjXFxcIiBCYXNlICAtLSBsZXhcXG4gICAgfCBcXFwiJFxcXCIgQmFzZSAgLS0gdmFsXFxuICAgIHwgQmFzZVxcblxcbiAgQmFzZVxcbiAgICA9IGlkZW50IFBhcmFtcz8gfihydWxlRGVzY3I/IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiKSAgLS0gYXBwbGljYXRpb25cXG4gICAgfCBQcmltIFxcXCIuLlxcXCIgUHJpbSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHJhbmdlXFxuICAgIHwgUHJpbSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBwcmltXFxuICAgIHwgXFxcIihcXFwiIEFsdCBcXFwiKVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBwYXJlblxcbiAgICB8IFxcXCJbXFxcIiBBbHQgXFxcIl1cXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gYXJyXFxuICAgIHwgXFxcIntcXFwiIFxcXCIuLi5cXFwiPyBcXFwifVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBvYmpcXG4gICAgfCBcXFwie1xcXCIgUHJvcHMgKFxcXCIsXFxcIiBcXFwiLi4uXFxcIik/IFxcXCJ9XFxcIiAgICAgICAgICAgICAgICAgICAgIC0tIG9ialdpdGhQcm9wc1xcblxcbiAgUHJpbVxcbiAgICA9IGtleXdvcmRcXG4gICAgfCBzdHJpbmdcXG4gICAgfCBudW1iZXJcXG5cXG4gIFByb3BzXFxuICAgID0gUHJvcCAoXFxcIixcXFwiIFByb3ApKlxcblxcbiAgUHJvcFxcbiAgICA9IChuYW1lIHwgc3RyaW5nKSBcXFwiOlxcXCIgQWx0XFxuXFxuICBydWxlRGVzY3IgIChhIHJ1bGUgZGVzY3JpcHRpb24pXFxuICAgID0gXFxcIihcXFwiIHJ1bGVEZXNjclRleHQgXFxcIilcXFwiXFxuXFxuICBydWxlRGVzY3JUZXh0XFxuICAgID0gKH5cXFwiKVxcXCIgYW55KSpcXG5cXG4gIGNhc2VOYW1lXFxuICAgID0gXFxcIi0tXFxcIiAoflxcXCJcXFxcblxcXCIgc3BhY2UpKiBuYW1lICh+XFxcIlxcXFxuXFxcIiBzcGFjZSkqIChcXFwiXFxcXG5cXFwiIHwgJlxcXCJ9XFxcIilcXG5cXG4gIG5hbWUgIChhIG5hbWUpXFxuICAgID0gbmFtZUZpcnN0IG5hbWVSZXN0KlxcblxcbiAgbmFtZUZpcnN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgbGV0dGVyXFxuXFxuICBuYW1lUmVzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGFsbnVtXFxuXFxuICBpZGVudCAgKGFuIGlkZW50aWZpZXIpXFxuICAgID0gfmtleXdvcmQgbmFtZVxcblxcbiAga2V5d29yZFxcbiAgICA9IFxcXCJudWxsXFxcIiB+bmFtZVJlc3QgICAtLSBudWxsXFxuICAgIHwgXFxcInRydWVcXFwiIH5uYW1lUmVzdCAgIC0tIHRydWVcXG4gICAgfCBcXFwiZmFsc2VcXFwiIH5uYW1lUmVzdCAgLS0gZmFsc2VcXG5cXG4gIHN0cmluZ1xcbiAgICA9IFxcXCJcXFxcXFxcIlxcXCIgc3RyQ2hhciogXFxcIlxcXFxcXFwiXFxcIlxcblxcbiAgc3RyQ2hhclxcbiAgICA9IGVzY2FwZUNoYXJcXG4gICAgfCB+XFxcIlxcXFxcXFxcXFxcIiB+XFxcIlxcXFxcXFwiXFxcIiB+XFxcIlxcXFxuXFxcIiBhbnlcXG5cXG4gIGVzY2FwZUNoYXIgIChhbiBlc2NhcGUgc2VxdWVuY2UpXFxuICAgID0gXFxcIlxcXFxcXFxcXFxcXFxcXFxcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGJhY2tzbGFzaFxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFxcXFwiXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBkb3VibGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFwnXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBzaW5nbGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXGJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBiYWNrc3BhY2VcXG4gICAgfCBcXFwiXFxcXFxcXFxuXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gbGluZUZlZWRcXG4gICAgfCBcXFwiXFxcXFxcXFxyXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gY2FycmlhZ2VSZXR1cm5cXG4gICAgfCBcXFwiXFxcXFxcXFx0XFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gdGFiXFxuICAgIHwgXFxcIlxcXFxcXFxcdVxcXCIgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgIC0tIHVuaWNvZGVFc2NhcGVcXG4gICAgfCBcXFwiXFxcXFxcXFx4XFxcIiBoZXhEaWdpdCBoZXhEaWdpdCAgICAgICAgICAgICAgICAgICAgLS0gaGV4RXNjYXBlXFxuXFxuICBudW1iZXIgIChhIG51bWJlcilcXG4gICAgPSBcXFwiLVxcXCI/IGRpZ2l0K1xcblxcbiAgc3BhY2VcXG4gICArPSBjb21tZW50XFxuXFxuICBjb21tZW50XFxuICAgID0gXFxcIi8vXFxcIiAoflxcXCJcXFxcblxcXCIgYW55KSogXFxcIlxcXFxuXFxcIiAgLS0gc2luZ2xlTGluZVxcbiAgICB8IFxcXCIvKlxcXCIgKH5cXFwiKi9cXFwiIGFueSkqIFxcXCIqL1xcXCIgIC0tIG11bHRpTGluZVxcblxcbiAgdG9rZW5zID0gdG9rZW4qXFxuXFxuICB0b2tlbiA9IGNhc2VOYW1lIHwgY29tbWVudCB8IGlkZW50IHwga2V5d29yZCB8IG51bWJlciB8IG9wZXJhdG9yIHwgcHVuY3R1YXRpb24gfCBzdHJpbmcgfCBhbnlcXG5cXG4gIG9wZXJhdG9yID0gXFxcIjw6XFxcIiB8IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiIHwgXFxcIipcXFwiIHwgXFxcIitcXFwiIHwgXFxcIj9cXFwiIHwgXFxcIn5cXFwiIHwgXFxcIiZcXFwiXFxuXFxuICBwdW5jdHVhdGlvbiA9IFxcXCI8XFxcIiB8IFxcXCI+XFxcIiB8IFxcXCIsXFxcIiB8IFxcXCItLVxcXCJcXG59XCIpXG4gICAgLndpdGhEZWZhdWx0U3RhcnRSdWxlKFwiR3JhbW1hcnNcIilcbiAgcmV0dXJuIGRlY2xcbiAgICAuZGVmaW5lKFwiR3JhbW1hcnNcIiwgW10sIHRoaXMuc3Rhcih0aGlzLmFwcChcIkdyYW1tYXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQsIDMxKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0LCAzMikpKVxuICAgIC5kZWZpbmUoXCJHcmFtbWFyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDUwLCA1NSkpLCB0aGlzLm9wdCh0aGlzLmFwcChcIlN1cGVyR3JhbW1hclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1NiwgNjgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTYsIDY5KSksIHRoaXMucHJpbShcIntcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzAsIDczKSksIHRoaXMuc3Rhcih0aGlzLmFwcChcIlJ1bGVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzQsIDc4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDc0LCA3OSkpLCB0aGlzLnByaW0oXCJ9XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDgwLCA4MykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1MCwgODMpKSlcbiAgICAuZGVmaW5lKFwiU3VwZXJHcmFtbWFyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCI8OlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDYsIDExMCkpLCB0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExMSwgMTE2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNiwgMTE2KSkpXG4gICAgLmRlZmluZShcIlJ1bGVfZGVmaW5lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMTM2KSksIHRoaXMub3B0KHRoaXMuYXBwKFwiRm9ybWFsc1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzcsIDE0NCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzcsIDE0NSkpLCB0aGlzLm9wdCh0aGlzLmFwcChcInJ1bGVEZXNjclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDYsIDE1NSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDYsIDE1NikpLCB0aGlzLnByaW0oXCI9XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE1NywgMTYwKSksIHRoaXMub3B0KHRoaXMucHJpbShcInxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTYyLCAxNjUpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTYyLCAxNjYpKSwgdGhpcy5hcHAoXCJBbHRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTY3LCAxNzApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTMxLCAxNzApKSlcbiAgICAuZGVmaW5lKFwiUnVsZV9vdmVycmlkZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJpZGVudFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODgsIDE5MykpLCB0aGlzLm9wdCh0aGlzLmFwcChcIkZvcm1hbHNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTk0LCAyMDEpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTk0LCAyMDIpKSwgdGhpcy5wcmltKFwiOj1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE0LCAyMTgpKSwgdGhpcy5vcHQodGhpcy5wcmltKFwifFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTksIDIyMikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTksIDIyMykpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMjQsIDIyNykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODgsIDIyNykpKVxuICAgIC5kZWZpbmUoXCJSdWxlX2V4dGVuZFwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJpZGVudFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDcsIDI1MikpLCB0aGlzLm9wdCh0aGlzLmFwcChcIkZvcm1hbHNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUzLCAyNjApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUzLCAyNjEpKSwgdGhpcy5wcmltKFwiKz1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjczLCAyNzcpKSwgdGhpcy5vcHQodGhpcy5wcmltKFwifFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzgsIDI4MSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzgsIDI4MikpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyODMsIDI4NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDcsIDI4NikpKVxuICAgIC5kZWZpbmUoXCJSdWxlXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcIlJ1bGVfZGVmaW5lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMTcwKSksIHRoaXMuYXBwKFwiUnVsZV9vdmVycmlkZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODgsIDIyNykpLCB0aGlzLmFwcChcIlJ1bGVfZXh0ZW5kXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0NywgMjg2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMjk3KSkpXG4gICAgLmRlZmluZShcIkZvcm1hbHNcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIjxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzE1LCAzMTgpKSwgdGhpcy5hcHAoXCJMaXN0T2ZcIiwgW3RoaXMuYXBwKFwiaWRlbnRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzI2LCAzMzEpKSwgdGhpcy5wcmltKFwiLFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMzMsIDMzNikpXSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzE5LCAzMzcpKSwgdGhpcy5wcmltKFwiPlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMzgsIDM0MSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMTUsIDM0MSkpKVxuICAgIC5kZWZpbmUoXCJQYXJhbXNcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIjxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzU4LCAzNjEpKSwgdGhpcy5hcHAoXCJMaXN0T2ZcIiwgW3RoaXMuYXBwKFwiU2VxXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM2OSwgMzcyKSksIHRoaXMucHJpbShcIixcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzc0LCAzNzcpKV0pLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM2MiwgMzc4KSksIHRoaXMucHJpbShcIj5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzc5LCAzODIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzU4LCAzODIpKSlcbiAgICAuZGVmaW5lKFwiQWx0XCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIlRlcm1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzk2LCA0MDApKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMucHJpbShcInxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDAyLCA0MDUpKSwgdGhpcy5hcHAoXCJUZXJtXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQwNiwgNDEwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQwMiwgNDEwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQwMSwgNDEyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM5NiwgNDEyKSkpXG4gICAgLmRlZmluZShcIlRlcm1faW5saW5lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIlNlcVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MjcsIDQzMCkpLCB0aGlzLmFwcChcImNhc2VOYW1lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQzMSwgNDM5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQyNywgNDM5KSkpXG4gICAgLmRlZmluZShcIlRlcm1cIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiVGVybV9pbmxpbmVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDI3LCA0MzkpKSwgdGhpcy5hcHAoXCJTZXFcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDU2LCA0NTkpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDI3LCA0NTkpKSlcbiAgICAuZGVmaW5lKFwiU2VxXCIsIFtdLCB0aGlzLnN0YXIodGhpcy5hcHAoXCJJdGVyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ3MywgNDc3KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ3MywgNDc4KSkpXG4gICAgLmRlZmluZShcIkl0ZXJfc3RhclwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJQcmVkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ5MywgNDk3KSksIHRoaXMucHJpbShcIipcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDk4LCA1MDEpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDkzLCA1MDEpKSlcbiAgICAuZGVmaW5lKFwiSXRlcl9wbHVzXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIlByZWRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTE3LCA1MjEpKSwgdGhpcy5wcmltKFwiK1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1MjIsIDUyNSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1MTcsIDUyNSkpKVxuICAgIC5kZWZpbmUoXCJJdGVyX29wdFwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJQcmVkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU0MSwgNTQ1KSksIHRoaXMucHJpbShcIj9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTQ2LCA1NDkpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTQxLCA1NDkpKSlcbiAgICAuZGVmaW5lKFwiSXRlclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJJdGVyX3N0YXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDkzLCA1MDEpKSwgdGhpcy5hcHAoXCJJdGVyX3BsdXNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTE3LCA1MjUpKSwgdGhpcy5hcHAoXCJJdGVyX29wdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1NDEsIDU0OSkpLCB0aGlzLmFwcChcIlByZWRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTY0LCA1NjgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDkzLCA1NjgpKSlcbiAgICAuZGVmaW5lKFwiUHJlZF9ub3RcIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIn5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTgzLCA1ODYpKSwgdGhpcy5hcHAoXCJNb2RpZmllclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1ODcsIDU5NSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1ODMsIDU5NSkpKVxuICAgIC5kZWZpbmUoXCJQcmVkX2xvb2thaGVhZFwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiJlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2MTAsIDYxMykpLCB0aGlzLmFwcChcIk1vZGlmaWVyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDYxNCwgNjIyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDYxMCwgNjIyKSkpXG4gICAgLmRlZmluZShcIlByZWRcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiUHJlZF9ub3RcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTgzLCA1OTUpKSwgdGhpcy5hcHAoXCJQcmVkX2xvb2thaGVhZFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2MTAsIDYyMikpLCB0aGlzLmFwcChcIk1vZGlmaWVyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDY0MywgNjUxKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU4MywgNjUxKSkpXG4gICAgLmRlZmluZShcIk1vZGlmaWVyX2xleFwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiI1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2NzAsIDY3MykpLCB0aGlzLmFwcChcIkJhc2VcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjc0LCA2NzgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjcwLCA2NzgpKSlcbiAgICAuZGVmaW5lKFwiTW9kaWZpZXJfdmFsXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDY5MywgNjk2KSksIHRoaXMuYXBwKFwiQmFzZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2OTcsIDcwMSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2OTMsIDcwMSkpKVxuICAgIC5kZWZpbmUoXCJNb2RpZmllclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJNb2RpZmllcl9sZXhcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjcwLCA2NzgpKSwgdGhpcy5hcHAoXCJNb2RpZmllcl92YWxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjkzLCA3MDEpKSwgdGhpcy5hcHAoXCJCYXNlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDcxNiwgNzIwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDY3MCwgNzIwKSkpXG4gICAgLmRlZmluZShcIkJhc2VfYXBwbGljYXRpb25cIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiaWRlbnRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzM1LCA3NDApKSwgdGhpcy5vcHQodGhpcy5hcHAoXCJQYXJhbXNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzQxLCA3NDcpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzQxLCA3NDgpKSwgdGhpcy5ub3QodGhpcy5hbHQodGhpcy5zZXEodGhpcy5vcHQodGhpcy5hcHAoXCJydWxlRGVzY3JcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzUxLCA3NjApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzUxLCA3NjEpKSwgdGhpcy5wcmltKFwiPVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NjIsIDc2NSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NTEsIDc2NSkpLCB0aGlzLnByaW0oXCI6PVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NjgsIDc3MikpLCB0aGlzLnByaW0oXCIrPVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NzUsIDc3OSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NTEsIDc3OSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NDksIDc4MCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MzUsIDc4MCkpKVxuICAgIC5kZWZpbmUoXCJCYXNlX3JhbmdlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIlByaW1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODAzLCA4MDcpKSwgdGhpcy5wcmltKFwiLi5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODA4LCA4MTIpKSwgdGhpcy5hcHAoXCJQcmltXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDgxMywgODE3KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDgwMywgODE3KSkpXG4gICAgLmRlZmluZShcIkJhc2VfcHJpbVwiLCBbXSwgdGhpcy5hcHAoXCJQcmltXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDg2NSwgODY5KSkpXG4gICAgLmRlZmluZShcIkJhc2VfcGFyZW5cIiwgW10sIHRoaXMuc2VxKHRoaXMucHJpbShcIihcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTI2LCA5MjkpKSwgdGhpcy5hcHAoXCJBbHRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTMwLCA5MzMpKSwgdGhpcy5wcmltKFwiKVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg5MzQsIDkzNykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg5MjYsIDkzNykpKVxuICAgIC5kZWZpbmUoXCJCYXNlX2FyclwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiW1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg5ODgsIDk5MSkpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg5OTIsIDk5NSkpLCB0aGlzLnByaW0oXCJdXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDk5NiwgOTk5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDk4OCwgOTk5KSkpXG4gICAgLmRlZmluZShcIkJhc2Vfb2JqXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJ7XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNDgsIDEwNTEpKSwgdGhpcy5vcHQodGhpcy5wcmltKFwiLi4uXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNTIsIDEwNTcpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA1MiwgMTA1OCkpLCB0aGlzLnByaW0oXCJ9XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNTksIDEwNjIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA0OCwgMTA2MikpKVxuICAgIC5kZWZpbmUoXCJCYXNlX29ialdpdGhQcm9wc1wiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwie1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTA4LCAxMTExKSksIHRoaXMuYXBwKFwiUHJvcHNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTExMiwgMTExNykpLCB0aGlzLm9wdCh0aGlzLnNlcSh0aGlzLnByaW0oXCIsXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExMTksIDExMjIpKSwgdGhpcy5wcmltKFwiLi4uXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExMjMsIDExMjgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTExOSwgMTEyOCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTE4LCAxMTMwKSksIHRoaXMucHJpbShcIn1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTEzMSwgMTEzNCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTA4LCAxMTM0KSkpXG4gICAgLmRlZmluZShcIkJhc2VcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiQmFzZV9hcHBsaWNhdGlvblwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MzUsIDc4MCkpLCB0aGlzLmFwcChcIkJhc2VfcmFuZ2VcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODAzLCA4MTcpKSwgdGhpcy5hcHAoXCJCYXNlX3ByaW1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODY1LCA4NjkpKSwgdGhpcy5hcHAoXCJCYXNlX3BhcmVuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDkyNiwgOTM3KSksIHRoaXMuYXBwKFwiQmFzZV9hcnJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTg4LCA5OTkpKSwgdGhpcy5hcHAoXCJCYXNlX29ialwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDQ4LCAxMDYyKSksIHRoaXMuYXBwKFwiQmFzZV9vYmpXaXRoUHJvcHNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTEwOCwgMTEzNCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MzUsIDExNzApKSlcbiAgICAuZGVmaW5lKFwiUHJpbVwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJrZXl3b3JkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExODUsIDExOTIpKSwgdGhpcy5hcHAoXCJzdHJpbmdcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTE5OSwgMTIwNSkpLCB0aGlzLmFwcChcIm51bWJlclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjEyLCAxMjE4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExODUsIDEyMTgpKSlcbiAgICAuZGVmaW5lKFwiUHJvcHNcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJvcFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjM0LCAxMjM4KSksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLnByaW0oXCIsXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyNDAsIDEyNDMpKSwgdGhpcy5hcHAoXCJQcm9wXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyNDQsIDEyNDgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI0MCwgMTI0OCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjM5LCAxMjUwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyMzQsIDEyNTApKSlcbiAgICAuZGVmaW5lKFwiUHJvcFwiLCBbXSwgdGhpcy5zZXEodGhpcy5hbHQodGhpcy5hcHAoXCJuYW1lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyNjYsIDEyNzApKSwgdGhpcy5hcHAoXCJzdHJpbmdcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI3MywgMTI3OSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjY2LCAxMjc5KSksIHRoaXMucHJpbShcIjpcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI4MSwgMTI4NCkpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjg1LCAxMjg4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyNjUsIDEyODgpKSlcbiAgICAuZGVmaW5lKFwicnVsZURlc2NyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIoXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMzAsIDEzMzMpKSwgdGhpcy5hcHAoXCJydWxlRGVzY3JUZXh0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMzQsIDEzNDcpKSwgdGhpcy5wcmltKFwiKVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzQ4LCAxMzUxKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMzAsIDEzNTEpKSwgXCJhIHJ1bGUgZGVzY3JpcHRpb25cIilcbiAgICAuZGVmaW5lKFwicnVsZURlc2NyVGV4dFwiLCBbXSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbShcIilcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTM3NywgMTM4MCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzc2LCAxMzgwKSksIHRoaXMuYXBwKFwiYW55XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzODEsIDEzODQpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTM3NiwgMTM4NCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzc1LCAxMzg2KSkpXG4gICAgLmRlZmluZShcImNhc2VOYW1lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCItLVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDA1LCAxNDA5KSksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oXCJcXG5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQxMiwgMTQxNikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDExLCAxNDE2KSksIHRoaXMuYXBwKFwic3BhY2VcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQxNywgMTQyMikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDExLCAxNDIyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0MTAsIDE0MjQpKSwgdGhpcy5hcHAoXCJuYW1lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0MjUsIDE0MjkpKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMubm90KHRoaXMucHJpbShcIlxcblwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDMyLCAxNDM2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0MzEsIDE0MzYpKSwgdGhpcy5hcHAoXCJzcGFjZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDM3LCAxNDQyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0MzEsIDE0NDIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQzMCwgMTQ0NCkpLCB0aGlzLmFsdCh0aGlzLnByaW0oXCJcXG5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQ0NiwgMTQ1MCkpLCB0aGlzLmxhKHRoaXMucHJpbShcIn1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQ1NCwgMTQ1NykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDUzLCAxNDU3KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0NDYsIDE0NTcpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQwNSwgMTQ1OCkpKVxuICAgIC5kZWZpbmUoXCJuYW1lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIm5hbWVGaXJzdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDgzLCAxNDkyKSksIHRoaXMuc3Rhcih0aGlzLmFwcChcIm5hbWVSZXN0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0OTMsIDE1MDEpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQ5MywgMTUwMikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDgzLCAxNTAyKSksIFwiYSBuYW1lXCIpXG4gICAgLmRlZmluZShcIm5hbWVGaXJzdFwiLCBbXSwgdGhpcy5hbHQodGhpcy5wcmltKFwiX1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNTIyLCAxNTI1KSksIHRoaXMuYXBwKFwibGV0dGVyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE1MzIsIDE1MzgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTUyMiwgMTUzOCkpKVxuICAgIC5kZWZpbmUoXCJuYW1lUmVzdFwiLCBbXSwgdGhpcy5hbHQodGhpcy5wcmltKFwiX1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNTU3LCAxNTYwKSksIHRoaXMuYXBwKFwiYWxudW1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTU2NywgMTU3MikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNTU3LCAxNTcyKSkpXG4gICAgLmRlZmluZShcImlkZW50XCIsIFtdLCB0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLmFwcChcImtleXdvcmRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTYwNiwgMTYxMykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjA1LCAxNjEzKSksIHRoaXMuYXBwKFwibmFtZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjE0LCAxNjE4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2MDUsIDE2MTgpKSwgXCJhbiBpZGVudGlmaWVyXCIpXG4gICAgLmRlZmluZShcImtleXdvcmRfbnVsbFwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwibnVsbFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjM2LCAxNjQyKSksIHRoaXMubm90KHRoaXMuYXBwKFwibmFtZVJlc3RcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTY0NCwgMTY1MikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjQzLCAxNjUyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2MzYsIDE2NTIpKSlcbiAgICAuZGVmaW5lKFwia2V5d29yZF90cnVlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJ0cnVlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2NjksIDE2NzUpKSwgdGhpcy5ub3QodGhpcy5hcHAoXCJuYW1lUmVzdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjc3LCAxNjg1KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2NzYsIDE2ODUpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTY2OSwgMTY4NSkpKVxuICAgIC5kZWZpbmUoXCJrZXl3b3JkX2ZhbHNlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJmYWxzZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzAyLCAxNzA5KSksIHRoaXMubm90KHRoaXMuYXBwKFwibmFtZVJlc3RcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTcxMSwgMTcxOSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzEwLCAxNzE5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3MDIsIDE3MTkpKSlcbiAgICAuZGVmaW5lKFwia2V5d29yZFwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJrZXl3b3JkX251bGxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTYzNiwgMTY1MikpLCB0aGlzLmFwcChcImtleXdvcmRfdHJ1ZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjY5LCAxNjg1KSksIHRoaXMuYXBwKFwia2V5d29yZF9mYWxzZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzAyLCAxNzE5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2MzYsIDE3MjkpKSlcbiAgICAuZGVmaW5lKFwic3RyaW5nXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCJcXFwiXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3NDYsIDE3NTApKSwgdGhpcy5zdGFyKHRoaXMuYXBwKFwic3RyQ2hhclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzUxLCAxNzU4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3NTEsIDE3NTkpKSwgdGhpcy5wcmltKFwiXFxcIlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzYwLCAxNzY0KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3NDYsIDE3NjQpKSlcbiAgICAuZGVmaW5lKFwic3RyQ2hhclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJlc2NhcGVDaGFyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3ODIsIDE3OTIpKSwgdGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKFwiXFxcXFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODAwLCAxODA0KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3OTksIDE4MDQpKSwgdGhpcy5ub3QodGhpcy5wcmltKFwiXFxcIlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODA2LCAxODEwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE4MDUsIDE4MTApKSwgdGhpcy5ub3QodGhpcy5wcmltKFwiXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE4MTIsIDE4MTYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTgxMSwgMTgxNikpLCB0aGlzLmFwcChcImFueVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODE3LCAxODIwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3OTksIDE4MjApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTc4MiwgMTgyMCkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiLCBbXSwgdGhpcy5wcmltKFwiXFxcXFxcXFxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTg2MywgMTg2OSkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2RvdWJsZVF1b3RlXCIsIFtdLCB0aGlzLnByaW0oXCJcXFxcXFxcIlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxOTI1LCAxOTMxKSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfc2luZ2xlUXVvdGVcIiwgW10sIHRoaXMucHJpbShcIlxcXFwnXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE5ODksIDE5OTUpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIiwgW10sIHRoaXMucHJpbShcIlxcXFxiXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwNTMsIDIwNTgpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9saW5lRmVlZFwiLCBbXSwgdGhpcy5wcmltKFwiXFxcXG5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjExNSwgMjEyMCkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2NhcnJpYWdlUmV0dXJuXCIsIFtdLCB0aGlzLnByaW0oXCJcXFxcclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTc2LCAyMTgxKSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfdGFiXCIsIFtdLCB0aGlzLnByaW0oXCJcXFxcdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMjQzLCAyMjQ4KSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfdW5pY29kZUVzY2FwZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiXFxcXHVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI5OSwgMjMwNCkpLCB0aGlzLmFwcChcImhleERpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIzMDUsIDIzMTMpKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMzE0LCAyMzIyKSksIHRoaXMuYXBwKFwiaGV4RGlnaXRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjMyMywgMjMzMSkpLCB0aGlzLmFwcChcImhleERpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIzMzIsIDIzNDApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI5OSwgMjM0MCkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2hleEVzY2FwZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiXFxcXHhcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjM2NSwgMjM3MCkpLCB0aGlzLmFwcChcImhleERpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIzNzEsIDIzNzkpKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMzgwLCAyMzg4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIzNjUsIDIzODgpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODYzLCAxODY5KSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxOTI1LCAxOTMxKSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9zaW5nbGVRdW90ZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxOTg5LCAxOTk1KSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA1MywgMjA1OCkpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfbGluZUZlZWRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjExNSwgMjEyMCkpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfY2FycmlhZ2VSZXR1cm5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE3NiwgMjE4MSkpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfdGFiXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIyNDMsIDIyNDgpKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI5OSwgMjM0MCkpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfaGV4RXNjYXBlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIzNjUsIDIzODgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTg2MywgMjQyMCkpLCBcImFuIGVzY2FwZSBzZXF1ZW5jZVwiKVxuICAgIC5kZWZpbmUoXCJudW1iZXJcIiwgW10sIHRoaXMuc2VxKHRoaXMub3B0KHRoaXMucHJpbShcIi1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQ0OSwgMjQ1MikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDQ5LCAyNDUzKSksIHRoaXMucGx1cyh0aGlzLmFwcChcImRpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0NTQsIDI0NTkpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQ1NCwgMjQ2MCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDQ5LCAyNDYwKSksIFwiYSBudW1iZXJcIilcbiAgICAuZXh0ZW5kKFwic3BhY2VcIiwgW10sIHRoaXMuYXBwKFwiY29tbWVudFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDc2LCAyNDgzKSkpXG4gICAgLmRlZmluZShcImNvbW1lbnRfc2luZ2xlTGluZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5wcmltKFwiLy9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUwMSwgMjUwNSkpLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5ub3QodGhpcy5wcmltKFwiXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1MDgsIDI1MTIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUwNywgMjUxMikpLCB0aGlzLmFwcChcImFueVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTEzLCAyNTE2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1MDcsIDI1MTYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUwNiwgMjUxOCkpLCB0aGlzLnByaW0oXCJcXG5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUxOSwgMjUyMykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTAxLCAyNTIzKSkpXG4gICAgLmRlZmluZShcImNvbW1lbnRfbXVsdGlMaW5lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIvKlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTQ1LCAyNTQ5KSksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnByaW0oXCIqL1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTUyLCAyNTU2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1NTEsIDI1NTYpKSwgdGhpcy5hcHAoXCJhbnlcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjU1NywgMjU2MCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTUxLCAyNTYwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1NTAsIDI1NjIpKSwgdGhpcy5wcmltKFwiKi9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjU2MywgMjU2NykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTQ1LCAyNTY3KSkpXG4gICAgLmRlZmluZShcImNvbW1lbnRcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiY29tbWVudF9zaW5nbGVMaW5lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1MDEsIDI1MjMpKSwgdGhpcy5hcHAoXCJjb21tZW50X211bHRpTGluZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTQ1LCAyNTY3KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1MDEsIDI1ODEpKSlcbiAgICAuZGVmaW5lKFwidG9rZW5zXCIsIFtdLCB0aGlzLnN0YXIodGhpcy5hcHAoXCJ0b2tlblwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTk0LCAyNTk5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1OTQsIDI2MDApKSlcbiAgICAuZGVmaW5lKFwidG9rZW5cIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiY2FzZU5hbWVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjYxMiwgMjYyMCkpLCB0aGlzLmFwcChcImNvbW1lbnRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjYyMywgMjYzMCkpLCB0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI2MzMsIDI2MzgpKSwgdGhpcy5hcHAoXCJrZXl3b3JkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI2NDEsIDI2NDgpKSwgdGhpcy5hcHAoXCJudW1iZXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjY1MSwgMjY1NykpLCB0aGlzLmFwcChcIm9wZXJhdG9yXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI2NjAsIDI2NjgpKSwgdGhpcy5hcHAoXCJwdW5jdHVhdGlvblwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNjcxLCAyNjgyKSksIHRoaXMuYXBwKFwic3RyaW5nXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI2ODUsIDI2OTEpKSwgdGhpcy5hcHAoXCJhbnlcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjY5NCwgMjY5NykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNjEyLCAyNjk3KSkpXG4gICAgLmRlZmluZShcIm9wZXJhdG9yXCIsIFtdLCB0aGlzLmFsdCh0aGlzLnByaW0oXCI8OlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzEyLCAyNzE2KSksIHRoaXMucHJpbShcIj1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjcxOSwgMjcyMikpLCB0aGlzLnByaW0oXCI6PVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzI1LCAyNzI5KSksIHRoaXMucHJpbShcIis9XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI3MzIsIDI3MzYpKSwgdGhpcy5wcmltKFwiKlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzM5LCAyNzQyKSksIHRoaXMucHJpbShcIitcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjc0NSwgMjc0OCkpLCB0aGlzLnByaW0oXCI/XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI3NTEsIDI3NTQpKSwgdGhpcy5wcmltKFwiflwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzU3LCAyNzYwKSksIHRoaXMucHJpbShcIiZcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjc2MywgMjc2NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzEyLCAyNzY2KSkpXG4gICAgLmRlZmluZShcInB1bmN0dWF0aW9uXCIsIFtdLCB0aGlzLmFsdCh0aGlzLnByaW0oXCI8XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI3ODQsIDI3ODcpKSwgdGhpcy5wcmltKFwiPlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzkwLCAyNzkzKSksIHRoaXMucHJpbShcIixcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjc5NiwgMjc5OSkpLCB0aGlzLnByaW0oXCItLVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyODAyLCAyODA2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI3ODQsIDI4MDYpKSlcbiAgICAuYnVpbGQoKTtcbn0pO1xuXG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoZnVuY3Rpb24oKSB7XG4gIHZhciBkZWNsID0gdGhpcy5uZXdHcmFtbWFyKFwiT3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNcIilcbiAgICAud2l0aFNvdXJjZShcIk9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzIHtcXG5cXG4gIEF0dHJpYnV0ZVNpZ25hdHVyZSA9XFxuICAgIG5hbWVcXG5cXG4gIE9wZXJhdGlvblNpZ25hdHVyZSA9XFxuICAgIG5hbWUgRm9ybWFscz9cXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiKFxcXCIgTGlzdE9mPG5hbWUsIFxcXCIsXFxcIj4gXFxcIilcXFwiXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbn1cIilcbiAgICAud2l0aERlZmF1bHRTdGFydFJ1bGUoXCJBdHRyaWJ1dGVTaWduYXR1cmVcIilcbiAgcmV0dXJuIGRlY2xcbiAgICAuZGVmaW5lKFwiQXR0cmlidXRlU2lnbmF0dXJlXCIsIFtdLCB0aGlzLmFwcChcIm5hbWVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTQsIDU4KSkpXG4gICAgLmRlZmluZShcIk9wZXJhdGlvblNpZ25hdHVyZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJuYW1lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDg3LCA5MSkpLCB0aGlzLm9wdCh0aGlzLmFwcChcIkZvcm1hbHNcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTIsIDk5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDkyLCAxMDApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODcsIDEwMCkpKVxuICAgIC5kZWZpbmUoXCJGb3JtYWxzXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnByaW0oXCIoXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExOCwgMTIxKSksIHRoaXMuYXBwKFwiTGlzdE9mXCIsIFt0aGlzLmFwcChcIm5hbWVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI5LCAxMzMpKSwgdGhpcy5wcmltKFwiLFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzUsIDEzOCkpXSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTIyLCAxMzkpKSwgdGhpcy5wcmltKFwiKVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDAsIDE0MykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTgsIDE0MykpKVxuICAgIC5kZWZpbmUoXCJuYW1lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIm5hbWVGaXJzdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjgsIDE3NykpLCB0aGlzLnN0YXIodGhpcy5hcHAoXCJuYW1lUmVzdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzgsIDE4NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzgsIDE4NykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjgsIDE4NykpLCBcImEgbmFtZVwiKVxuICAgIC5kZWZpbmUoXCJuYW1lRmlyc3RcIiwgW10sIHRoaXMuYWx0KHRoaXMucHJpbShcIl9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA3LCAyMTApKSwgdGhpcy5hcHAoXCJsZXR0ZXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE3LCAyMjMpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA3LCAyMjMpKSlcbiAgICAuZGVmaW5lKFwibmFtZVJlc3RcIiwgW10sIHRoaXMuYWx0KHRoaXMucHJpbShcIl9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQyLCAyNDUpKSwgdGhpcy5hcHAoXCJhbG51bVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNTIsIDI1NykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDIsIDI1NykpKVxuICAgIC5idWlsZCgpO1xufSk7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRvQVNUOiByZXF1aXJlKCcuL3NlbWFudGljcy10b0FTVCcpLmhlbHBlcixcbiAgc2VtYW50aWNzRm9yVG9BU1Q6IHJlcXVpcmUoJy4vc2VtYW50aWNzLXRvQVNUJykuc2VtYW50aWNzXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4uL3NyYy9wZXhwcnMnKTtcbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4uL3NyYy9NYXRjaFJlc3VsdCcpO1xudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuLi9zcmMvR3JhbW1hcicpO1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZGVmYXVsdE9wZXJhdGlvbiA9IHtcbiAgX3Rlcm1pbmFsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVWYWx1ZTtcbiAgfSxcblxuICBfbm9udGVybWluYWw6IGZ1bmN0aW9uKGNoaWxkcmVuKSB7XG4gICAgdmFyIGN0b3JOYW1lID0gdGhpcy5fbm9kZS5jdG9yTmFtZTtcbiAgICB2YXIgbWFwcGluZyA9IHRoaXMuYXJncy5tYXBwaW5nO1xuXG4gICAgLy8gd2l0aG91dCBjdXN0b21pemF0aW9uXG4gICAgaWYgKCFtYXBwaW5nLmhhc093blByb3BlcnR5KGN0b3JOYW1lKSkge1xuICAgICAgLy8gaW50ZXJtZWRpYXRlIG5vZGVcbiAgICAgIGlmICh0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFsdCB8fCB0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5KSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlblswXS50b0FTVChtYXBwaW5nKTtcbiAgICAgIH1cblxuICAgICAgLy8gbGV4aWNhbCBydWxlXG4gICAgICBpZiAodGhpcy5pc0xleGljYWwoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICAgIH1cblxuICAgICAgLy8gc2luZ3VsYXIgbm9kZSAoZS5nLiBvbmx5IHN1cnJvdW5kZWQgYnkgbGl0ZXJhbHMgb3IgbG9va2FoZWFkcylcbiAgICAgIHZhciByZWFsQ2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuICFjaGlsZC5pc1Rlcm1pbmFsKCk7XG4gICAgICB9KTtcbiAgICAgIGlmIChyZWFsQ2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiByZWFsQ2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlc3Q6IHRlcm1zIHdpdGggbXVsdGlwbGUgY2hpbGRyZW5cbiAgICB9XG5cbiAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgIGlmICh0eXBlb2YgbWFwcGluZ1tjdG9yTmFtZV0gPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5bbWFwcGluZ1tjdG9yTmFtZV1dLnRvQVNUKG1hcHBpbmcpO1xuICAgIH1cblxuICAgIC8vIG5hbWVkL21hcHBlZCBjaGlsZHJlbiBvciB1bm5hbWVkIGNoaWxkcmVuICgnMCcsICcxJywgJzInLCAuLi4pXG4gICAgdmFyIHByb3BNYXAgPSBtYXBwaW5nW2N0b3JOYW1lXSB8fCBjaGlsZHJlbjtcbiAgICB2YXIgbm9kZSA9IHtcbiAgICAgIHR5cGU6IGN0b3JOYW1lXG4gICAgfTtcbiAgICBmb3IgKHZhciBwcm9wIGluIHByb3BNYXApIHtcbiAgICAgIHZhciBtYXBwZWRQcm9wID0gbWFwcGluZ1tjdG9yTmFtZV0gJiYgbWFwcGluZ1tjdG9yTmFtZV1bcHJvcF07XG4gICAgICBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdudW1iZXInKSB7XG4gICAgICAgIC8vIGRpcmVjdCBmb3J3YXJkXG4gICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlblttYXBwZWRQcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnc3RyaW5nJykgfHwgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnYm9vbGVhbicpIHx8XG4gICAgICAgICAgKG1hcHBlZFByb3AgPT09IG51bGwpKSB7XG4gICAgICAgIC8vIHByaW1pdGl2ZSB2YWx1ZVxuICAgICAgICBub2RlW3Byb3BdID0gbWFwcGVkUHJvcDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnb2JqZWN0JykgJiYgKG1hcHBlZFByb3AgaW5zdGFuY2VvZiBOdW1iZXIpKSB7XG4gICAgICAgIC8vIHByaW1pdGl2ZSBudW1iZXIgKG11c3QgYmUgdW5ib3hlZClcbiAgICAgICAgbm9kZVtwcm9wXSA9IE51bWJlcihtYXBwZWRQcm9wKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gY29tcHV0ZWQgdmFsdWVcbiAgICAgICAgbm9kZVtwcm9wXSA9IG1hcHBlZFByb3AuY2FsbCh0aGlzLCBjaGlsZHJlbik7XG4gICAgICB9IGVsc2UgaWYgKG1hcHBlZFByb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoY2hpbGRyZW5bcHJvcF0gJiYgIWNoaWxkcmVuW3Byb3BdLmlzVGVybWluYWwoKSkge1xuICAgICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlbltwcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkZWxldGUgcHJlZGVmaW5lZCAndHlwZScgcHJvcGVydGllcywgbGlrZSAndHlwZScsIGlmIGV4cGxpY2l0ZWx5IHJlbW92ZWRcbiAgICAgICAgICBkZWxldGUgbm9kZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcblxuICBfaXRlcjogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICBpZiAodGhpcy5fbm9kZS5pc09wdGlvbmFsKCkpIHtcbiAgICAgIGlmICh0aGlzLm51bUNoaWxkcmVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZXR1cm4gY2hpbGQudG9BU1QodGhpcy5hcmdzLm1hcHBpbmcpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIE5vbmVtcHR5TGlzdE9mOiBmdW5jdGlvbihmaXJzdCwgc2VwLCByZXN0KSB7XG4gICAgcmV0dXJuIFtmaXJzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyldLmNvbmNhdChyZXN0LnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKSk7XG4gIH0sXG5cbiAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0IHRoYXQgaW5jbHVkZXMgYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUgKEFTVClcbi8vIGZvciB0aGUgZ2l2ZW4gbWF0Y2ggcmVzdWx0IGByZXNgIGNvbnRhaW5nIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgYW5kIGdyYW1tYXIuXG4vLyBUaGUgb3B0aW9uYWwgYG1hcHBpbmdgIHBhcmFtZXRlciBjYW4gYmUgdXNlZCB0byBjdXN0b21pemUgaG93IHRoZSBub2RlcyBvZiB0aGUgQ1NUXG4vLyBhcmUgbWFwcGVkIHRvIHRoZSBBU1QgKHNlZSAvZG9jL2V4dHJhcy5tZCN0b2FzdG1hdGNocmVzdWx0LW1hcHBpbmcpLlxuZnVuY3Rpb24gdG9BU1QocmVzLCBtYXBwaW5nKSB7XG4gIGlmICghKHJlcyBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSB8fCByZXMuZmFpbGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RvQVNUKCkgZXhwZWN0cyBhIHN1Y2Nlc2Z1bGwgTWF0Y2hSZXN1bHQgYXMgZmlyc3QgcGFyYW1ldGVyJyk7XG4gIH1cblxuICBtYXBwaW5nID0gZXh0ZW5kKHt9LCBtYXBwaW5nKTtcbiAgdmFyIG9wZXJhdGlvbiA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wZXJhdGlvbik7XG4gIGZvciAodmFyIHRlcm1OYW1lIGluIG1hcHBpbmcpIHtcbiAgICBpZiAodHlwZW9mIG1hcHBpbmdbdGVybU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcGVyYXRpb25bdGVybU5hbWVdID0gbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgICBkZWxldGUgbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgfVxuICB9XG4gIHZhciBnID0gcmVzLl9jc3QuZ3JhbW1hcjtcbiAgdmFyIHMgPSBnLnNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBvcGVyYXRpb24pO1xuICByZXR1cm4gcyhyZXMpLnRvQVNUKG1hcHBpbmcpO1xufVxuXG4vLyBSZXR1cm5zIGEgc2VtYW50aWNzIGNvbnRhaW5nIHRoZSB0b0FTVChtYXBwaW5nKSBvcGVyYXRpb24gZm9yIHRoZSBnaXZlbiBncmFtbWFyIGcuXG5mdW5jdGlvbiBzZW1hbnRpY3NGb3JUb0FTVChnKSB7XG4gIGlmICghKGcgaW5zdGFuY2VvZiBHcmFtbWFyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2VtYW50aWNzVG9BU1QoKSBleHBlY3RzIGEgR3JhbW1hciBhcyBwYXJhbWV0ZXInKTtcbiAgfVxuXG4gIHJldHVybiBnLnNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBkZWZhdWx0T3BlcmF0aW9uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhlbHBlcjogdG9BU1QsXG4gIHNlbWFudGljczogc2VtYW50aWNzRm9yVG9BU1Rcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pcy1pbXBsZW1lbnRlZCcpKCkgPyBTeW1ib2wgOiByZXF1aXJlKCcuL3BvbHlmaWxsJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgc3ltYm9sO1xuXHRpZiAodHlwZW9mIFN5bWJvbCAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXHRzeW1ib2wgPSBTeW1ib2woJ3Rlc3Qgc3ltYm9sJyk7XG5cdHRyeSB7IFN0cmluZyhzeW1ib2wpOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfVxuXHRpZiAodHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gJ3N5bWJvbCcpIHJldHVybiB0cnVlO1xuXG5cdC8vIFJldHVybiAndHJ1ZScgZm9yIHBvbHlmaWxsc1xuXHRpZiAodHlwZW9mIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGUgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cdGlmICh0eXBlb2YgU3ltYm9sLml0ZXJhdG9yICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXHRpZiAodHlwZW9mIFN5bWJvbC50b1ByaW1pdGl2ZSAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblx0aWYgKHR5cGVvZiBTeW1ib2wudG9TdHJpbmdUYWcgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cdGlmICh0eXBlb2YgU3ltYm9sLnVuc2NvcGFibGVzICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXG5cdHJldHVybiB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuXHRyZXR1cm4gKHggJiYgKCh0eXBlb2YgeCA9PT0gJ3N5bWJvbCcpIHx8ICh4WydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSkpIHx8IGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFzc2lnbiAgICAgICAgPSByZXF1aXJlKCdlczUtZXh0L29iamVjdC9hc3NpZ24nKVxuICAsIG5vcm1hbGl6ZU9wdHMgPSByZXF1aXJlKCdlczUtZXh0L29iamVjdC9ub3JtYWxpemUtb3B0aW9ucycpXG4gICwgaXNDYWxsYWJsZSAgICA9IHJlcXVpcmUoJ2VzNS1leHQvb2JqZWN0L2lzLWNhbGxhYmxlJylcbiAgLCBjb250YWlucyAgICAgID0gcmVxdWlyZSgnZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucycpXG5cbiAgLCBkO1xuXG5kID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZHNjciwgdmFsdWUvKiwgb3B0aW9ucyovKSB7XG5cdHZhciBjLCBlLCB3LCBvcHRpb25zLCBkZXNjO1xuXHRpZiAoKGFyZ3VtZW50cy5sZW5ndGggPCAyKSB8fCAodHlwZW9mIGRzY3IgIT09ICdzdHJpbmcnKSkge1xuXHRcdG9wdGlvbnMgPSB2YWx1ZTtcblx0XHR2YWx1ZSA9IGRzY3I7XG5cdFx0ZHNjciA9IG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1syXTtcblx0fVxuXHRpZiAoZHNjciA9PSBudWxsKSB7XG5cdFx0YyA9IHcgPSB0cnVlO1xuXHRcdGUgPSBmYWxzZTtcblx0fSBlbHNlIHtcblx0XHRjID0gY29udGFpbnMuY2FsbChkc2NyLCAnYycpO1xuXHRcdGUgPSBjb250YWlucy5jYWxsKGRzY3IsICdlJyk7XG5cdFx0dyA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ3cnKTtcblx0fVxuXG5cdGRlc2MgPSB7IHZhbHVlOiB2YWx1ZSwgY29uZmlndXJhYmxlOiBjLCBlbnVtZXJhYmxlOiBlLCB3cml0YWJsZTogdyB9O1xuXHRyZXR1cm4gIW9wdGlvbnMgPyBkZXNjIDogYXNzaWduKG5vcm1hbGl6ZU9wdHMob3B0aW9ucyksIGRlc2MpO1xufTtcblxuZC5ncyA9IGZ1bmN0aW9uIChkc2NyLCBnZXQsIHNldC8qLCBvcHRpb25zKi8pIHtcblx0dmFyIGMsIGUsIG9wdGlvbnMsIGRlc2M7XG5cdGlmICh0eXBlb2YgZHNjciAhPT0gJ3N0cmluZycpIHtcblx0XHRvcHRpb25zID0gc2V0O1xuXHRcdHNldCA9IGdldDtcblx0XHRnZXQgPSBkc2NyO1xuXHRcdGRzY3IgPSBudWxsO1xuXHR9IGVsc2Uge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbM107XG5cdH1cblx0aWYgKGdldCA9PSBudWxsKSB7XG5cdFx0Z2V0ID0gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKCFpc0NhbGxhYmxlKGdldCkpIHtcblx0XHRvcHRpb25zID0gZ2V0O1xuXHRcdGdldCA9IHNldCA9IHVuZGVmaW5lZDtcblx0fSBlbHNlIGlmIChzZXQgPT0gbnVsbCkge1xuXHRcdHNldCA9IHVuZGVmaW5lZDtcblx0fSBlbHNlIGlmICghaXNDYWxsYWJsZShzZXQpKSB7XG5cdFx0b3B0aW9ucyA9IHNldDtcblx0XHRzZXQgPSB1bmRlZmluZWQ7XG5cdH1cblx0aWYgKGRzY3IgPT0gbnVsbCkge1xuXHRcdGMgPSB0cnVlO1xuXHRcdGUgPSBmYWxzZTtcblx0fSBlbHNlIHtcblx0XHRjID0gY29udGFpbnMuY2FsbChkc2NyLCAnYycpO1xuXHRcdGUgPSBjb250YWlucy5jYWxsKGRzY3IsICdlJyk7XG5cdH1cblxuXHRkZXNjID0geyBnZXQ6IGdldCwgc2V0OiBzZXQsIGNvbmZpZ3VyYWJsZTogYywgZW51bWVyYWJsZTogZSB9O1xuXHRyZXR1cm4gIW9wdGlvbnMgPyBkZXNjIDogYXNzaWduKG5vcm1hbGl6ZU9wdHMob3B0aW9ucyksIGRlc2MpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2lzLWltcGxlbWVudGVkJykoKVxuXHQ/IE9iamVjdC5hc3NpZ25cblx0OiByZXF1aXJlKCcuL3NoaW0nKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBhc3NpZ24gPSBPYmplY3QuYXNzaWduLCBvYmo7XG5cdGlmICh0eXBlb2YgYXNzaWduICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2U7XG5cdG9iaiA9IHsgZm9vOiAncmF6JyB9O1xuXHRhc3NpZ24ob2JqLCB7IGJhcjogJ2R3YScgfSwgeyB0cnp5OiAndHJ6eScgfSk7XG5cdHJldHVybiAob2JqLmZvbyArIG9iai5iYXIgKyBvYmoudHJ6eSkgPT09ICdyYXpkd2F0cnp5Jztcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrZXlzICA9IHJlcXVpcmUoJy4uL2tleXMnKVxuICAsIHZhbHVlID0gcmVxdWlyZSgnLi4vdmFsaWQtdmFsdWUnKVxuXG4gICwgbWF4ID0gTWF0aC5tYXg7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRlc3QsIHNyYy8qLCDigKZzcmNuKi8pIHtcblx0dmFyIGVycm9yLCBpLCBsID0gbWF4KGFyZ3VtZW50cy5sZW5ndGgsIDIpLCBhc3NpZ247XG5cdGRlc3QgPSBPYmplY3QodmFsdWUoZGVzdCkpO1xuXHRhc3NpZ24gPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0dHJ5IHsgZGVzdFtrZXldID0gc3JjW2tleV07IH0gY2F0Y2ggKGUpIHtcblx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZTtcblx0XHR9XG5cdH07XG5cdGZvciAoaSA9IDE7IGkgPCBsOyArK2kpIHtcblx0XHRzcmMgPSBhcmd1bWVudHNbaV07XG5cdFx0a2V5cyhzcmMpLmZvckVhY2goYXNzaWduKTtcblx0fVxuXHRpZiAoZXJyb3IgIT09IHVuZGVmaW5lZCkgdGhyb3cgZXJyb3I7XG5cdHJldHVybiBkZXN0O1xufTtcbiIsIi8vIERlcHJlY2F0ZWRcblxuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmogPT09ICdmdW5jdGlvbic7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pcy1pbXBsZW1lbnRlZCcpKClcblx0PyBPYmplY3Qua2V5c1xuXHQ6IHJlcXVpcmUoJy4vc2hpbScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0dHJ5IHtcblx0XHRPYmplY3Qua2V5cygncHJpbWl0aXZlJyk7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5cyA9IE9iamVjdC5rZXlzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcblx0cmV0dXJuIGtleXMob2JqZWN0ID09IG51bGwgPyBvYmplY3QgOiBPYmplY3Qob2JqZWN0KSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuXG52YXIgcHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIG9iaikge1xuXHR2YXIga2V5O1xuXHRmb3IgKGtleSBpbiBzcmMpIG9ialtrZXldID0gc3JjW2tleV07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zLyosIOKApm9wdGlvbnMqLykge1xuXHR2YXIgcmVzdWx0ID0gY3JlYXRlKG51bGwpO1xuXHRmb3JFYWNoLmNhbGwoYXJndW1lbnRzLCBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdGlmIChvcHRpb25zID09IG51bGwpIHJldHVybjtcblx0XHRwcm9jZXNzKE9iamVjdChvcHRpb25zKSwgcmVzdWx0KTtcblx0fSk7XG5cdHJldHVybiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAodmFsdWUgPT0gbnVsbCkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB1c2UgbnVsbCBvciB1bmRlZmluZWRcIik7XG5cdHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pcy1pbXBsZW1lbnRlZCcpKClcblx0PyBTdHJpbmcucHJvdG90eXBlLmNvbnRhaW5zXG5cdDogcmVxdWlyZSgnLi9zaGltJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBzdHIgPSAncmF6ZHdhdHJ6eSc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHRpZiAodHlwZW9mIHN0ci5jb250YWlucyAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXHRyZXR1cm4gKChzdHIuY29udGFpbnMoJ2R3YScpID09PSB0cnVlKSAmJiAoc3RyLmNvbnRhaW5zKCdmb28nKSA9PT0gZmFsc2UpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmRleE9mID0gU3RyaW5nLnByb3RvdHlwZS5pbmRleE9mO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChzZWFyY2hTdHJpbmcvKiwgcG9zaXRpb24qLykge1xuXHRyZXR1cm4gaW5kZXhPZi5jYWxsKHRoaXMsIHNlYXJjaFN0cmluZywgYXJndW1lbnRzWzFdKSA+IC0xO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGQgICAgICAgICAgICAgID0gcmVxdWlyZSgnZCcpXG4gICwgdmFsaWRhdGVTeW1ib2wgPSByZXF1aXJlKCcuL3ZhbGlkYXRlLXN5bWJvbCcpXG5cbiAgLCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlLCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSwgb2JqUHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZVxuICAsIFN5bWJvbCwgSGlkZGVuU3ltYm9sLCBnbG9iYWxTeW1ib2xzID0gY3JlYXRlKG51bGwpO1xuXG52YXIgZ2VuZXJhdGVOYW1lID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIGNyZWF0ZWQgPSBjcmVhdGUobnVsbCk7XG5cdHJldHVybiBmdW5jdGlvbiAoZGVzYykge1xuXHRcdHZhciBwb3N0Zml4ID0gMCwgbmFtZTtcblx0XHR3aGlsZSAoY3JlYXRlZFtkZXNjICsgKHBvc3RmaXggfHwgJycpXSkgKytwb3N0Zml4O1xuXHRcdGRlc2MgKz0gKHBvc3RmaXggfHwgJycpO1xuXHRcdGNyZWF0ZWRbZGVzY10gPSB0cnVlO1xuXHRcdG5hbWUgPSAnQEAnICsgZGVzYztcblx0XHRkZWZpbmVQcm9wZXJ0eShvYmpQcm90b3R5cGUsIG5hbWUsIGQuZ3MobnVsbCwgZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRkZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCBkKHZhbHVlKSk7XG5cdFx0fSkpO1xuXHRcdHJldHVybiBuYW1lO1xuXHR9O1xufSgpKTtcblxuSGlkZGVuU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XG5cdGlmICh0aGlzIGluc3RhbmNlb2YgSGlkZGVuU3ltYm9sKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRyZXR1cm4gU3ltYm9sKGRlc2NyaXB0aW9uKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuXHR2YXIgc3ltYm9sO1xuXHRpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0c3ltYm9sID0gY3JlYXRlKEhpZGRlblN5bWJvbC5wcm90b3R5cGUpO1xuXHRkZXNjcmlwdGlvbiA9IChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pKTtcblx0cmV0dXJuIGRlZmluZVByb3BlcnRpZXMoc3ltYm9sLCB7XG5cdFx0X19kZXNjcmlwdGlvbl9fOiBkKCcnLCBkZXNjcmlwdGlvbiksXG5cdFx0X19uYW1lX186IGQoJycsIGdlbmVyYXRlTmFtZShkZXNjcmlwdGlvbikpXG5cdH0pO1xufTtcbmRlZmluZVByb3BlcnRpZXMoU3ltYm9sLCB7XG5cdGZvcjogZChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSkgcmV0dXJuIGdsb2JhbFN5bWJvbHNba2V5XTtcblx0XHRyZXR1cm4gKGdsb2JhbFN5bWJvbHNba2V5XSA9IFN5bWJvbChTdHJpbmcoa2V5KSkpO1xuXHR9KSxcblx0a2V5Rm9yOiBkKGZ1bmN0aW9uIChzKSB7XG5cdFx0dmFyIGtleTtcblx0XHR2YWxpZGF0ZVN5bWJvbChzKTtcblx0XHRmb3IgKGtleSBpbiBnbG9iYWxTeW1ib2xzKSBpZiAoZ2xvYmFsU3ltYm9sc1trZXldID09PSBzKSByZXR1cm4ga2V5O1xuXHR9KSxcblx0aGFzSW5zdGFuY2U6IGQoJycsIFN5bWJvbCgnaGFzSW5zdGFuY2UnKSksXG5cdGlzQ29uY2F0U3ByZWFkYWJsZTogZCgnJywgU3ltYm9sKCdpc0NvbmNhdFNwcmVhZGFibGUnKSksXG5cdGl0ZXJhdG9yOiBkKCcnLCBTeW1ib2woJ2l0ZXJhdG9yJykpLFxuXHRtYXRjaDogZCgnJywgU3ltYm9sKCdtYXRjaCcpKSxcblx0cmVwbGFjZTogZCgnJywgU3ltYm9sKCdyZXBsYWNlJykpLFxuXHRzZWFyY2g6IGQoJycsIFN5bWJvbCgnc2VhcmNoJykpLFxuXHRzcGVjaWVzOiBkKCcnLCBTeW1ib2woJ3NwZWNpZXMnKSksXG5cdHNwbGl0OiBkKCcnLCBTeW1ib2woJ3NwbGl0JykpLFxuXHR0b1ByaW1pdGl2ZTogZCgnJywgU3ltYm9sKCd0b1ByaW1pdGl2ZScpKSxcblx0dG9TdHJpbmdUYWc6IGQoJycsIFN5bWJvbCgndG9TdHJpbmdUYWcnKSksXG5cdHVuc2NvcGFibGVzOiBkKCcnLCBTeW1ib2woJ3Vuc2NvcGFibGVzJykpXG59KTtcbmRlZmluZVByb3BlcnRpZXMoSGlkZGVuU3ltYm9sLnByb3RvdHlwZSwge1xuXHRjb25zdHJ1Y3RvcjogZChTeW1ib2wpLFxuXHR0b1N0cmluZzogZCgnJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fX25hbWVfXzsgfSlcbn0pO1xuXG5kZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbC5wcm90b3R5cGUsIHtcblx0dG9TdHJpbmc6IGQoZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sKHRoaXMpLl9fZGVzY3JpcHRpb25fXyArICcpJzsgfSksXG5cdHZhbHVlT2Y6IGQoZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7IH0pXG59KTtcbmRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1ByaW1pdGl2ZSwgZCgnJyxcblx0ZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7IH0pKTtcbmRlZmluZVByb3BlcnR5KFN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZywgZCgnYycsICdTeW1ib2wnKSk7XG5cbmRlZmluZVByb3BlcnR5KEhpZGRlblN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1ByaW1pdGl2ZSxcblx0ZCgnYycsIFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvUHJpbWl0aXZlXSkpO1xuZGVmaW5lUHJvcGVydHkoSGlkZGVuU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sLnRvU3RyaW5nVGFnLFxuXHRkKCdjJywgU3ltYm9sLnByb3RvdHlwZVtTeW1ib2wudG9TdHJpbmdUYWddKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXMtc3ltYm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdGlmICghaXNTeW1ib2wodmFsdWUpKSB0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgXCIgaXMgbm90IGEgc3ltYm9sXCIpO1xuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvKipcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgQnVmZmVyXG4gKlxuICogQXV0aG9yOiAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBMaWNlbnNlOiAgTUlUXG4gKlxuICogYG5wbSBpbnN0YWxsIGlzLWJ1ZmZlcmBcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuICEhKFxuICAgIG9iaiAhPSBudWxsICYmXG4gICAgb2JqLmNvbnN0cnVjdG9yICYmXG4gICAgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG4gIClcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDtcbmZ1bmN0aW9uIGV4dGVuZChvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8IHR5cGVvZiBhZGQgIT09ICdvYmplY3QnKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEdyYW1tYXJEZWNsID0gcmVxdWlyZSgnLi9HcmFtbWFyRGVjbCcpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBCdWlsZGVyKCkge31cblxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gIG5ld0dyYW1tYXI6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEdyYW1tYXJEZWNsKG5hbWUpO1xuICB9LFxuXG4gIHByaW06IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5QcmltKHgpO1xuICB9LFxuXG4gIHJhbmdlOiBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlJhbmdlKGZyb20sIHRvKTtcbiAgfSxcblxuICBwYXJhbTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gIH0sXG5cbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLkFsdCkge1xuICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVybXMubGVuZ3RoID09PSAxID8gdGVybXNbMF0gOiBuZXcgcGV4cHJzLkFsdCh0ZXJtcyk7XG4gIH0sXG5cbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICBmYWN0b3JzID0gZmFjdG9ycy5jb25jYXQoYXJnLmZhY3RvcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWN0b3JzLmxlbmd0aCA9PT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgcGV4cHJzLlNlcShmYWN0b3JzKTtcbiAgfSxcblxuICBzdGFyOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuU3RhcihleHByKTtcbiAgfSxcblxuICBwbHVzOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUGx1cyhleHByKTtcbiAgfSxcblxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5PcHQoZXhwcik7XG4gIH0sXG5cbiAgbm90OiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTm90KGV4cHIpO1xuICB9LFxuXG4gIGxhOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTG9va2FoZWFkKGV4cHIpO1xuICB9LFxuXG4gIGxleDogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkxleChleHByKTtcbiAgfSxcblxuICB2YWw6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5WYWx1ZShleHByKTtcbiAgfSxcblxuICBhcnI6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5BcnIoZXhwcik7XG4gIH0sXG5cbiAgc3RyOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuU3RyKGV4cHIpO1xuICB9LFxuXG4gIG9iajogZnVuY3Rpb24ocHJvcGVydGllcywgaXNMZW5pZW50KSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuT2JqKHByb3BlcnRpZXMsICEhaXNMZW5pZW50KTtcbiAgfSxcblxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBvcHRQYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5BcHBseShydWxlTmFtZSwgb3B0UGFyYW1zKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIGBGYWlsdXJlYHMgcmVwcmVzZW50IGV4cHJlc3Npb25zIHRoYXQgd2VyZW4ndCBtYXRjaGVkIHdoaWxlIHBhcnNpbmcuIFRoZXkgYXJlIHVzZWQgdG8gZ2VuZXJhdGVcbiAgZXJyb3IgbWVzc2FnZXMgYXV0b21hdGljYWxseS4gVGhlIGludGVyZmFjZSBvZiBgRmFpbHVyZWBzIGluY2x1ZGVzIHRoZSBjb2xsb3dpbmcgbWV0aG9kczpcblxuICAtIGdldFRleHQoKSA6IFN0cmluZ1xuICAtIGdldFR5cGUoKSA6IFN0cmluZyAgKG9uZSBvZiB7XCJkZXNjcmlwdGlvblwiLCBcInN0cmluZ1wiLCBcImNvZGVcIn0pXG4gIC0gaXNEZXNjcmlwdGlvbigpIDogYm9vbFxuICAtIGlzU3RyaW5nVGVybWluYWwoKSA6IGJvb2xcbiAgLSBpc0NvZGUoKSA6IGJvb2xcbiAgLSBpc0ZsdWZmeSgpIDogYm9vbFxuICAtIG1ha2VGbHVmZnkoKSA6IHZvaWRcbiAgLSBzdWJzdW1lcyhGYWlsdXJlKSA6IGJvb2xcbiovXG5cbmZ1bmN0aW9uIGlzVmFsaWRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGUgPT09ICdkZXNjcmlwdGlvbicgfHwgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ2NvZGUnO1xufVxuXG5mdW5jdGlvbiBGYWlsdXJlKHRleHQsIHR5cGUpIHtcbiAgaWYgKCFpc1ZhbGlkVHlwZSh0eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBGYWlsdXJlIHR5cGU6ICcgKyB0eXBlKTtcbiAgfVxuXG4gIHRoaXMudGV4dCA9IHRleHQ7XG4gIHRoaXMudHlwZSA9IHR5cGU7XG4gIHRoaXMuZmx1ZmZ5ID0gZmFsc2U7XG59XG5cbkZhaWx1cmUucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudGV4dDtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmlzRGVzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJztcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmlzU3RyaW5nVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZyc7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5pc0NvZGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2NvZGUnO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuaXNGbHVmZnkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZmx1ZmZ5O1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUubWFrZUZsdWZmeSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmZsdWZmeSA9IHRydWU7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5jbGVhckZsdWZmeSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmZsdWZmeSA9IGZhbHNlO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuc3Vic3VtZXMgPSBmdW5jdGlvbih0aGF0KSB7XG4gIHJldHVybiB0aGlzLmdldFRleHQoKSA9PT0gdGhhdC5nZXRUZXh0KCkgJiZcbiAgICAgIHRoaXMudHlwZSA9PT0gdGhhdC50eXBlICYmXG4gICAgICAoIXRoaXMuaXNGbHVmZnkoKSB8fCB0aGlzLmlzRmx1ZmZ5KCkgJiYgdGhhdC5pc0ZsdWZmeSgpKTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdzdHJpbmcnID9cbiAgICBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFRleHQoKSkgOlxuICAgIHRoaXMuZ2V0VGV4dCgpO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGZhaWx1cmUgPSBuZXcgRmFpbHVyZSh0aGlzLnRleHQsIHRoaXMudHlwZSk7XG4gIGlmICh0aGlzLmlzRmx1ZmZ5KCkpIHtcbiAgICBmYWlsdXJlLm1ha2VGbHVmZnkoKTtcbiAgfVxuICByZXR1cm4gZmFpbHVyZTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLnRvS2V5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCkgKyAnIycgKyB0aGlzLnR5cGU7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBGYWlsdXJlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIFNlbWFudGljcyA9IHJlcXVpcmUoJy4vU2VtYW50aWNzJyk7XG52YXIgU3RhdGUgPSByZXF1aXJlKCcuL1N0YXRlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBHcmFtbWFyKFxuICAgIG5hbWUsXG4gICAgc3VwZXJHcmFtbWFyLFxuICAgIHJ1bGVCb2RpZXMsXG4gICAgcnVsZUZvcm1hbHMsXG4gICAgcnVsZURlc2NyaXB0aW9ucyxcbiAgICBvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLnJ1bGVCb2RpZXMgPSBydWxlQm9kaWVzO1xuICB0aGlzLnJ1bGVGb3JtYWxzID0gcnVsZUZvcm1hbHM7XG4gIHRoaXMucnVsZURlc2NyaXB0aW9ucyA9IHJ1bGVEZXNjcmlwdGlvbnM7XG4gIGlmIChvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgaWYgKCEob3B0RGVmYXVsdFN0YXJ0UnVsZSBpbiBydWxlQm9kaWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdGFydCBydWxlOiAnXCIgKyBvcHREZWZhdWx0U3RhcnRSdWxlICtcbiAgICAgICAgICAgICAgICAgICAgICBcIicgaXMgbm90IGEgcnVsZSBpbiBncmFtbWFyICdcIiArIG5hbWUgKyBcIidcIik7XG4gICAgfVxuICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IG9wdERlZmF1bHRTdGFydFJ1bGU7XG4gIH1cbiAgdGhpcy5jb25zdHJ1Y3RvcnMgPSB0aGlzLmN0b3JzID0gdGhpcy5jcmVhdGVDb25zdHJ1Y3RvcnMoKTtcbn1cblxudmFyIG9obUdyYW1tYXI7XG52YXIgYnVpbGRHcmFtbWFyO1xuXG4vLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBtYWluLmpzIG9uY2UgT2htIGhhcyBsb2FkZWQuXG5HcmFtbWFyLmluaXRBcHBsaWNhdGlvblBhcnNlciA9IGZ1bmN0aW9uKGdyYW1tYXIsIGJ1aWxkZXJGbikge1xuICBvaG1HcmFtbWFyID0gZ3JhbW1hcjtcbiAgYnVpbGRHcmFtbWFyID0gYnVpbGRlckZuO1xufTtcblxuR3JhbW1hci5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdDogZnVuY3Rpb24ocnVsZU5hbWUsIGNoaWxkcmVuKSB7XG4gICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVCb2RpZXNbcnVsZU5hbWVdO1xuICAgIGlmICghYm9keSkge1xuICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCB0aGlzLm5hbWUpO1xuICAgIH1cblxuICAgIHZhciBhbnMgPSB0aGlzLl9jb25zdHJ1Y3RCeU1hdGNoaW5nKHJ1bGVOYW1lLCBjaGlsZHJlbik7XG4gICAgaWYgKCFhbnMpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnZhbGlkQ29uc3RydWN0b3JDYWxsKHRoaXMsIHJ1bGVOYW1lLCBjaGlsZHJlbik7XG4gICAgfVxuICAgIHJldHVybiBhbnM7XG4gIH0sXG5cbiAgLy8gVHJ5IHRvIG1hdGNoIGBjdG9yQXJnc2Agd2l0aCB0aGUgYm9keSBvZiB0aGUgcnVsZSBnaXZlbiBieSBgcnVsZU5hbWVgLlxuICAvLyBSZXR1cm4gdGhlIHJlc3VsdGluZyBDU1Qgbm9kZSBpZiBpdCBzdWNjZWVkcywgb3RoZXJ3aXNlIHJldHVybiBudWxsLlxuICBfY29uc3RydWN0QnlNYXRjaGluZzogZnVuY3Rpb24ocnVsZU5hbWUsIGN0b3JBcmdzKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fbWF0Y2goY3RvckFyZ3MsIHtzdGFydEFwcGxpY2F0aW9uOiBydWxlTmFtZSwgbWF0Y2hOb2RlczogdHJ1ZX0pO1xuICAgIGlmIChzdGF0ZS5iaW5kaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gc3RhdGUuYmluZGluZ3NbMF07XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIGNyZWF0ZUNvbnN0cnVjdG9yczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBjb25zdHJ1Y3RvcnMgPSB7fTtcblxuICAgIGZ1bmN0aW9uIG1ha2VDb25zdHJ1Y3RvcihydWxlTmFtZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKC8qIHZhbDEsIHZhbDIsIC4uLiAqLykge1xuICAgICAgICByZXR1cm4gc2VsZi5jb25zdHJ1Y3QocnVsZU5hbWUsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiB0aGlzLnJ1bGVCb2RpZXMpIHtcbiAgICAgIC8vIFdlIHdhbnQgKmFsbCogcHJvcGVydGllcywgbm90IGp1c3Qgb3duIHByb3BlcnRpZXMsIGJlY2F1c2Ugb2ZcbiAgICAgIC8vIHN1cGVyZ3JhbW1hcnMuXG4gICAgICBjb25zdHJ1Y3RvcnNbcnVsZU5hbWVdID0gbWFrZUNvbnN0cnVjdG9yKHJ1bGVOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnN0cnVjdG9ycztcbiAgfSxcblxuICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgZ3JhbW1hciBpcyBhIGJ1aWx0LWluIGdyYW1tYXIsIG90aGVyd2lzZSBmYWxzZS5cbiAgLy8gTk9URTogVGhpcyBtaWdodCBnaXZlIGFuIHVuZXhwZWN0ZWQgcmVzdWx0IGlmIGNhbGxlZCBiZWZvcmUgQnVpbHRJblJ1bGVzIGlzIGRlZmluZWQhXG4gIGlzQnVpbHRJbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMgPT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgfHwgdGhpcyA9PT0gR3JhbW1hci5CdWlsdEluUnVsZXM7XG4gIH0sXG5cbiAgX21hdGNoOiBmdW5jdGlvbih2YWx1ZXMsIG9wdHMpIHtcbiAgICB2YXIgc3RhdGUgPSBuZXcgU3RhdGUodGhpcywgdmFsdWVzLCBvcHRzKTtcbiAgICBzdGF0ZS5ldmFsRnJvbVN0YXJ0KCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihvYmosIG9wdFN0YXJ0QXBwbGljYXRpb24pIHtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLl9tYXRjaChbb2JqXSwge3N0YXJ0QXBwbGljYXRpb246IG9wdFN0YXJ0QXBwbGljYXRpb259KTtcbiAgICByZXR1cm4gTWF0Y2hSZXN1bHQubmV3Rm9yKHN0YXRlKTtcbiAgfSxcblxuICB0cmFjZTogZnVuY3Rpb24ob2JqLCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgdmFyIHN0YXRlID0gdGhpcy5fbWF0Y2goW29ial0sIHtzdGFydEFwcGxpY2F0aW9uOiBvcHRTdGFydEFwcGxpY2F0aW9uLCB0cmFjZTogdHJ1ZX0pO1xuXG4gICAgLy8gVGhlIHRyYWNlIG5vZGUgZm9yIHRoZSBzdGFydCBydWxlIGlzIGFsd2F5cyB0aGUgbGFzdCBlbnRyeS4gSWYgaXQgaXMgYSBzeW50YWN0aWMgcnVsZSxcbiAgICAvLyB0aGUgZmlyc3QgZW50cnkgaXMgZm9yIGFuIGFwcGxpY2F0aW9uIG9mICdzcGFjZXMnLlxuICAgIC8vIFRPRE8ocGR1YnJveSk6IENsZWFuIHRoaXMgdXAgYnkgaW50cm9kdWNpbmcgYSBzcGVjaWFsIGBNYXRjaDxzdGFydEFwcGw+YCBydWxlLCB3aGljaCB3aWxsXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlcmUgaXMgYWx3YXlzIGEgc2luZ2xlIHJvb3QgdHJhY2Ugbm9kZS5cbiAgICB2YXIgcm9vdFRyYWNlID0gc3RhdGUudHJhY2Vbc3RhdGUudHJhY2UubGVuZ3RoIC0gMV07XG4gICAgcm9vdFRyYWNlLnN0YXRlID0gc3RhdGU7XG4gICAgcm9vdFRyYWNlLnJlc3VsdCA9IE1hdGNoUmVzdWx0Lm5ld0ZvcihzdGF0ZSk7XG4gICAgcmV0dXJuIHJvb3RUcmFjZTtcbiAgfSxcblxuICBzZW1hbnRpY3M6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzKHRoaXMpO1xuICB9LFxuXG4gIGV4dGVuZFNlbWFudGljczogZnVuY3Rpb24oc3VwZXJTZW1hbnRpY3MpIHtcbiAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzLCBzdXBlclNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCkpO1xuICB9LFxuXG4gIC8vIENoZWNrIHRoYXQgZXZlcnkga2V5IGluIGBhY3Rpb25EaWN0YCBjb3JyZXNwb25kcyB0byBhIHNlbWFudGljIGFjdGlvbiwgYW5kIHRoYXQgaXQgbWFwcyB0b1xuICAvLyBhIGZ1bmN0aW9uIG9mIHRoZSBjb3JyZWN0IGFyaXR5LiBJZiBub3QsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAgX2NoZWNrVG9wRG93bkFjdGlvbkRpY3Q6IGZ1bmN0aW9uKHdoYXQsIG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBmdW5jdGlvbiBpc1NwZWNpYWxBY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIGEgPT09ICdfaXRlcicgfHwgYSA9PT0gJ190ZXJtaW5hbCcgfHwgYSA9PT0gJ19ub250ZXJtaW5hbCcgfHwgYSA9PT0gJ19kZWZhdWx0JztcbiAgICB9XG5cbiAgICB2YXIgcHJvYmxlbXMgPSBbXTtcbiAgICBmb3IgKHZhciBrIGluIGFjdGlvbkRpY3QpIHtcbiAgICAgIHZhciB2ID0gYWN0aW9uRGljdFtrXTtcbiAgICAgIGlmICghaXNTcGVjaWFsQWN0aW9uKGspICYmICEoayBpbiB0aGlzLnJ1bGVCb2RpZXMpKSB7XG4gICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIGlzIG5vdCBhIHZhbGlkIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9ibGVtcy5wdXNoKFxuICAgICAgICAgICAgXCInXCIgKyBrICsgXCInIG11c3QgYmUgYSBmdW5jdGlvbiBpbiBhbiBhY3Rpb24gZGljdGlvbmFyeSBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGFjdHVhbCA9IHYubGVuZ3RoO1xuICAgICAgICB2YXIgZXhwZWN0ZWQgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkoayk7XG4gICAgICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgICAgcHJvYmxlbXMucHVzaChcbiAgICAgICAgICAgICAgXCJTZW1hbnRpYyBhY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBcIiArXG4gICAgICAgICAgICAgICdleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb2JsZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBwcmV0dHlQcm9ibGVtcyA9IHByb2JsZW1zLm1hcChmdW5jdGlvbihwcm9ibGVtKSB7IHJldHVybiAnLSAnICsgcHJvYmxlbTsgfSk7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJGb3VuZCBlcnJvcnMgaW4gdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IG9mIHRoZSAnXCIgKyBuYW1lICsgXCInIFwiICsgd2hhdCArICc6XFxuJyArXG4gICAgICAgICAgcHJldHR5UHJvYmxlbXMuam9pbignXFxuJykpO1xuICAgICAgZXJyb3IucHJvYmxlbXMgPSBwcm9ibGVtcztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm4gdGhlIGV4cGVjdGVkIGFyaXR5IGZvciBhIHNlbWFudGljIGFjdGlvbiBuYW1lZCBgYWN0aW9uTmFtZWAsIHdoaWNoXG4gIC8vIGlzIGVpdGhlciBhIHJ1bGUgbmFtZSBvciBhIHNwZWNpYWwgYWN0aW9uIG5hbWUgbGlrZSAnX25vbnRlcm1pbmFsJy5cbiAgX3RvcERvd25BY3Rpb25Bcml0eTogZnVuY3Rpb24oYWN0aW9uTmFtZSkge1xuICAgIGlmIChhY3Rpb25OYW1lID09PSAnX2l0ZXInIHx8IGFjdGlvbk5hbWUgPT09ICdfbm9udGVybWluYWwnIHx8IGFjdGlvbk5hbWUgPT09ICdfZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ190ZXJtaW5hbCcpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ydWxlQm9kaWVzW2FjdGlvbk5hbWVdLmdldEFyaXR5KCk7XG4gIH0sXG5cbiAgX2luaGVyaXRzRnJvbTogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHZhciBnID0gdGhpcy5zdXBlckdyYW1tYXI7XG4gICAgd2hpbGUgKGcpIHtcbiAgICAgIGlmIChnID09PSBncmFtbWFyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZyA9IGcuc3VwZXJHcmFtbWFyO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgdG9SZWNpcGU6IGZ1bmN0aW9uKG9wdFZhck5hbWUpIHtcbiAgICBpZiAodGhpcy5pc0J1aWx0SW4oKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdXaHkgd291bGQgYW55b25lIHdhbnQgdG8gZ2VuZXJhdGUgYSByZWNpcGUgZm9yIHRoZSAnICsgdGhpcy5uYW1lICsgJyBncmFtbWFyPyE/IScpO1xuICAgIH1cbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIGlmIChvcHRWYXJOYW1lKSB7XG4gICAgICBzYi5hcHBlbmQoJ3ZhciAnICsgb3B0VmFyTmFtZSArICcgPSAnKTtcbiAgICB9XG4gICAgc2IuYXBwZW5kKCcoZnVuY3Rpb24oKSB7XFxuJyk7XG5cbiAgICAvLyBJbmNsdWRlIHRoZSBzdXBlcmdyYW1tYXIgaW4gdGhlIHJlY2lwZSBpZiBpdCdzIG5vdCBhIGJ1aWx0LWluIGdyYW1tYXIuXG4gICAgdmFyIHN1cGVyR3JhbW1hckRlY2wgPSAnJztcbiAgICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgICBzYi5hcHBlbmQodGhpcy5zdXBlckdyYW1tYXIudG9SZWNpcGUoJ2J1aWxkU3VwZXJHcmFtbWFyJykpO1xuICAgICAgc3VwZXJHcmFtbWFyRGVjbCA9ICcgICAgLndpdGhTdXBlckdyYW1tYXIoYnVpbGRTdXBlckdyYW1tYXIuY2FsbCh0aGlzKSlcXG4nO1xuICAgIH1cbiAgICBzYi5hcHBlbmQoJyAgdmFyIGRlY2wgPSB0aGlzLm5ld0dyYW1tYXIoJyArIEpTT04uc3RyaW5naWZ5KHRoaXMubmFtZSkgKyAnKVxcbicpO1xuXG4gICAgLy8gSW5jbHVkZSB0aGUgZ3JhbW1hciBzb3VyY2UgaWYgaXQgaXMgYXZhaWxhYmxlLlxuICAgIGlmICh0aGlzLmRlZmluaXRpb25JbnRlcnZhbCkge1xuICAgICAgc2IuYXBwZW5kKCcgICAgLndpdGhTb3VyY2UoJyArIEpTT04uc3RyaW5naWZ5KHRoaXMuZGVmaW5pdGlvbkludGVydmFsLmNvbnRlbnRzKSArICcpXFxuJyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZChzdXBlckdyYW1tYXJEZWNsKTtcblxuICAgIGlmICh0aGlzLmRlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgIHNiLmFwcGVuZCgnICAgIC53aXRoRGVmYXVsdFN0YXJ0UnVsZShcIicgKyB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgKyAnXCIpXFxuJyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZCgnICByZXR1cm4gZGVjbFxcbicpO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMucnVsZUJvZGllcykuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgdmFyIGJvZHkgPSBzZWxmLnJ1bGVCb2RpZXNbcnVsZU5hbWVdO1xuICAgICAgc2IuYXBwZW5kKCcgICAgLicpO1xuICAgICAgaWYgKHNlbGYuc3VwZXJHcmFtbWFyLnJ1bGVCb2RpZXNbcnVsZU5hbWVdKSB7XG4gICAgICAgIHNiLmFwcGVuZChib2R5IGluc3RhbmNlb2YgcGV4cHJzLkV4dGVuZCA/ICdleHRlbmQnIDogJ292ZXJyaWRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJ2RlZmluZScpO1xuICAgICAgfVxuICAgICAgdmFyIGZvcm1hbHMgPSBzZWxmLnJ1bGVGb3JtYWxzW3J1bGVOYW1lXTtcbiAgICAgIHZhciBmb3JtYWxzU3RyaW5nID0gJ1snICsgZm9ybWFscy5tYXAoSlNPTi5zdHJpbmdpZnkpLmpvaW4oJywgJykgKyAnXSc7XG4gICAgICBzYi5hcHBlbmQoJygnICsgSlNPTi5zdHJpbmdpZnkocnVsZU5hbWUpICsgJywgJyArIGZvcm1hbHNTdHJpbmcgKyAnLCAnKTtcbiAgICAgIGJvZHkub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzLCBzZWxmLmRlZmluaXRpb25JbnRlcnZhbCk7XG5cbiAgICAgIGlmICghc2VsZi5zdXBlckdyYW1tYXIucnVsZUJvZGllc1tydWxlTmFtZV0gJiYgc2VsZi5ydWxlRGVzY3JpcHRpb25zW3J1bGVOYW1lXSkge1xuICAgICAgICBzYi5hcHBlbmQoJywgJyArIEpTT04uc3RyaW5naWZ5KHNlbGYucnVsZURlc2NyaXB0aW9uc1tydWxlTmFtZV0pKTtcbiAgICAgIH1cbiAgICAgIHNiLmFwcGVuZCgnKVxcbicpO1xuICAgIH0pO1xuICAgIHNiLmFwcGVuZCgnICAgIC5idWlsZCgpO1xcbn0pO1xcbicpO1xuICAgIHJldHVybiBzYi5jb250ZW50cygpO1xuICB9LFxuXG4gIC8vIFRPRE86IENvbWUgdXAgd2l0aCBiZXR0ZXIgbmFtZXMgZm9yIHRoZXNlIG1ldGhvZHMuXG4gIC8vIFRPRE86IFdyaXRlIHRoZSBhbmFsb2cgb2YgdGhlc2UgbWV0aG9kcyBmb3IgaW5oZXJpdGVkIGF0dHJpYnV0ZXMuXG4gIHRvT3BlcmF0aW9uQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICB9LFxuICB0b0F0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGUoKTtcbiAgfSxcblxuICBfdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByX3BsdXNcbiAgICAvLyBzaG91bGQgYXBwZWFyIG5leHQgdG8gb3RoZXIgY2FzZXMgb2YgQWRkRXhwci5cblxuICAgIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gICAgc2IuYXBwZW5kKCd7Jyk7XG5cbiAgICB2YXIgZmlyc3QgPSB0cnVlO1xuICAgIGZvciAodmFyIHJ1bGVOYW1lIGluIHRoaXMucnVsZUJvZGllcykge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVCb2RpZXNbcnVsZU5hbWVdO1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJywnKTtcbiAgICAgIH1cbiAgICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gICAgICBzYi5hcHBlbmQoJyAgJyk7XG4gICAgICB0aGlzLmFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGUocnVsZU5hbWUsIGJvZHksIHNiKTtcbiAgICB9XG5cbiAgICBzYi5hcHBlbmQoJ1xcbn0nKTtcbiAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbiAgfSxcblxuICBhZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSwgc2IpIHtcbiAgICBzYi5hcHBlbmQocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZCgnOiBmdW5jdGlvbignKTtcbiAgICB2YXIgYXJpdHkgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZChjb21tb24ucmVwZWF0KCdfJywgYXJpdHkpLmpvaW4oJywgJykpO1xuICAgIHNiLmFwcGVuZCgnKSB7XFxuJyk7XG4gICAgc2IuYXBwZW5kKCcgIH0nKTtcbiAgfSxcblxuICAvLyBQYXJzZSBhIHN0cmluZyB3aGljaCBleHByZXNzZXMgYSBydWxlIGFwcGxpY2F0aW9uIGluIHRoaXMgZ3JhbW1hciwgYW5kIHJldHVybiB0aGVcbiAgLy8gcmVzdWx0aW5nIEFwcGx5IG5vZGUuXG4gIHBhcnNlQXBwbGljYXRpb246IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBhcHA7XG4gICAgaWYgKHN0ci5pbmRleE9mKCc8JykgPT09IC0xKSB7XG4gICAgICAvLyBzaW1wbGUgYXBwbGljYXRpb25cbiAgICAgIGFwcCA9IG5ldyBwZXhwcnMuQXBwbHkoc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGFyYW1ldGVyaXplZCBhcHBsaWNhdGlvblxuICAgICAgdmFyIGNzdCA9IG9obUdyYW1tYXIubWF0Y2goc3RyLCAnQmFzZV9hcHBsaWNhdGlvbicpO1xuICAgICAgYXBwID0gYnVpbGRHcmFtbWFyKGNzdCwge30pO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHBsaWNhdGlvbiBpcyB2YWxpZC5cbiAgICBpZiAoIShhcHAucnVsZU5hbWUgaW4gdGhpcy5ydWxlQm9kaWVzKSkge1xuICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRSdWxlKGFwcC5ydWxlTmFtZSwgdGhpcy5uYW1lKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucnVsZUZvcm1hbHNbYXBwLnJ1bGVOYW1lXS5sZW5ndGggIT09IGFwcC5hcmdzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKFxuICAgICAgICAgIGFwcC5ydWxlTmFtZSwgdGhpcy5ydWxlRm9ybWFsc1thcHAucnVsZU5hbWVdLmxlbmd0aCwgYXBwLmFyZ3MubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcDtcbiAgfVxufTtcblxuLy8gVGhlIGZvbGxvd2luZyBncmFtbWFyIGNvbnRhaW5zIGEgZmV3IHJ1bGVzIHRoYXQgY291bGRuJ3QgYmUgd3JpdHRlbiAgaW4gXCJ1c2VybGFuZFwiLlxuLy8gQXQgdGhlIGJvdHRvbSBvZiBzcmMvbWFpbi5qcywgd2UgY3JlYXRlIGEgc3ViLWdyYW1tYXIgb2YgdGhpcyBncmFtbWFyIHRoYXQncyBjYWxsZWRcbi8vIGBCdWlsdEluUnVsZXNgLiBUaGF0IGdyYW1tYXIgY29udGFpbnMgc2V2ZXJhbCBjb252ZW5pZW5jZSBydWxlcywgZS5nLiwgYGxldHRlcmAgYW5kXG4vLyBgZGlnaXRgLCBhbmQgaXMgaW1wbGljaXRseSB0aGUgc3VwZXItZ3JhbW1hciBvZiBhbnkgZ3JhbW1hciB3aG9zZSBzdXBlci1ncmFtbWFyXG4vLyBpc24ndCBzcGVjaWZpZWQuXG5HcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzID0gbmV3IEdyYW1tYXIoXG4gICAgJ1Byb3RvQnVpbHRJblJ1bGVzJywgIC8vIG5hbWVcbiAgICB1bmRlZmluZWQsICAvLyBzdXBlcmdyYW1tYXJcblxuICAgIC8vIHJ1bGUgYm9kaWVzXG4gICAge1xuICAgICAgYW55OiBwZXhwcnMuYW55LFxuICAgICAgZW5kOiBwZXhwcnMuZW5kLFxuICAgICAgbG93ZXI6IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0xsJyksXG5cbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgcnVsZSBpcyBpbnZva2VkIGltcGxpY2l0bHkgYnkgc3ludGFjdGljIHJ1bGVzIHRvIHNraXAgc3BhY2VzLlxuICAgICAgc3BhY2VzOiBuZXcgcGV4cHJzLlN0YXIobmV3IHBleHBycy5BcHBseSgnc3BhY2UnKSksXG5cbiAgICAgIC8vIFRoZSBgc3BhY2VgIHJ1bGUgbXVzdCBiZSBkZWZpbmVkIGhlcmUgYmVjYXVzZSBpdCdzIHJlZmVyZW5jZWQgYnkgYHNwYWNlc2AuXG4gICAgICBzcGFjZTogbmV3IHBleHBycy5SYW5nZSgnXFx4MDAnLCAnICcpLFxuXG4gICAgICAvLyBUaGUgdW5pb24gb2YgTHQgKHRpdGxlY2FzZSksIExtIChtb2RpZmllciksIGFuZCBMbyAob3RoZXIpLCBpLmUuIGFueSBsZXR0ZXIgbm90XG4gICAgICAvLyBpbiBMbCBvciBMdS5cbiAgICAgIHVuaWNvZGVMdG1vOiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdG1vJyksXG5cbiAgICAgIHVwcGVyOiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdScpLFxuXG4gICAgICBCb29sZWFuOiBuZXcgcGV4cHJzLlR5cGVDaGVjaygnYm9vbGVhbicpLFxuICAgICAgTnVtYmVyOiBuZXcgcGV4cHJzLlR5cGVDaGVjaygnbnVtYmVyJyksXG4gICAgICBTdHJpbmc6IG5ldyBwZXhwcnMuVHlwZUNoZWNrKCdzdHJpbmcnKVxuICAgIH0sXG5cbiAgICAvLyBydWxlIGZvcm1hbCBhcmd1bWVudHNcbiAgICB7XG4gICAgICBhbnk6IFtdLFxuICAgICAgZW5kOiBbXSxcbiAgICAgIHNwYWNlczogW10sXG4gICAgICBzcGFjZTogW10sXG4gICAgICBsb3dlcjogW10sXG4gICAgICB1bmljb2RlTHRtbzogW10sXG4gICAgICB1cHBlcjogW10sXG4gICAgICBCb29sZWFuOiBbXSxcbiAgICAgIE51bWJlcjogW10sXG4gICAgICBTdHJpbmc6IFtdXG4gICAgfSxcblxuICAgIC8vIHJ1bGUgZGVzY3JpcHRpb25zXG4gICAge1xuICAgICAgYW55OiAnYW55IG9iamVjdCcsXG4gICAgICBlbmQ6ICdlbmQgb2YgaW5wdXQnLFxuICAgICAgc3BhY2U6ICdhIHNwYWNlJyxcbiAgICAgIGxvd2VyOiAnYSBsb3dlcmNhc2UgbGV0dGVyJyxcbiAgICAgIHVwcGVyOiAnYW4gdXBwZXJjYXNlIGxldHRlcidcbiAgICB9XG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuL0dyYW1tYXInKTtcbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0nKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIENvbnN0cnVjdG9yc1xuXG5mdW5jdGlvbiBHcmFtbWFyRGVjbChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG59XG5cbi8vIEhlbHBlcnNcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLnNvdXJjZUludGVydmFsID0gZnVuY3Rpb24oc3RhcnRJZHgsIGVuZElkeCkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSB0aGlzLmludGVydmFsLmlucHV0U3RyZWFtO1xuICByZXR1cm4gaW5wdXRTdHJlYW0uaW50ZXJ2YWwoc3RhcnRJZHgsIGVuZElkeCk7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZW5zdXJlU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aGlzLndpdGhTdXBlckdyYW1tYXIoXG4gICAgICAgIC8vIFRPRE86IFRoZSBjb25kaXRpb25hbCBleHByZXNzaW9uIGJlbG93IGlzIGFuIHVnbHkgaGFjay4gSXQncyBraW5kIG9mIG9rIGJlY2F1c2VcbiAgICAgICAgLy8gSSBkb3VidCBhbnlvbmUgd2lsbCBldmVyIHRyeSB0byBkZWNsYXJlIGEgZ3JhbW1hciBjYWxsZWQgYEJ1aWx0SW5SdWxlc2AuIFN0aWxsLFxuICAgICAgICAvLyB3ZSBzaG91bGQgdHJ5IHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMuXG4gICAgICAgIHRoaXMubmFtZSA9PT0gJ0J1aWx0SW5SdWxlcycgP1xuICAgICAgICAgICAgR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA6XG4gICAgICAgICAgICBHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5KSB7XG4gIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgYm9keSk7XG4gIH1cbiAgdmFyIGV4cGVjdGVkRm9ybWFscyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZUZvcm1hbHNbbmFtZV07XG4gIHZhciBleHBlY3RlZE51bUZvcm1hbHMgPSBleHBlY3RlZEZvcm1hbHMgPyBleHBlY3RlZEZvcm1hbHMubGVuZ3RoIDogMDtcbiAgaWYgKGZvcm1hbHMubGVuZ3RoICE9PSBleHBlY3RlZE51bUZvcm1hbHMpIHtcbiAgICB0aHJvdyBlcnJvcnMud3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMobmFtZSwgZXhwZWN0ZWROdW1Gb3JtYWxzLCBmb3JtYWxzLmxlbmd0aCwgYm9keSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5KTtcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSwgb3B0RGVzY3JpcHRpb24pIHtcbiAgYm9keSA9IGJvZHkuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICB0aGlzLnJ1bGVGb3JtYWxzW25hbWVdID0gZm9ybWFscztcbiAgaWYgKG9wdERlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5ydWxlRGVzY3JpcHRpb25zW25hbWVdID0gb3B0RGVzY3JpcHRpb247XG4gIH1cbiAgdGhpcy5ydWxlQm9kaWVzW25hbWVdID0gYm9keTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBTdHVmZiB0aGF0IHlvdSBzaG91bGQgb25seSBkbyBvbmNlXG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24oc3VwZXJHcmFtbWFyKSB7XG4gIGlmICh0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgIHRocm93IG5ldyBFcnJvcigndGhlIHN1cGVyIGdyYW1tYXIgb2YgYSBHcmFtbWFyRGVjbCBjYW5ub3QgYmUgc2V0IG1vcmUgdGhhbiBvbmNlJyk7XG4gIH1cbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gIHRoaXMucnVsZUJvZGllcyA9IE9iamVjdC5jcmVhdGUoc3VwZXJHcmFtbWFyLnJ1bGVCb2RpZXMpO1xuICB0aGlzLnJ1bGVGb3JtYWxzID0gT2JqZWN0LmNyZWF0ZShzdXBlckdyYW1tYXIucnVsZUZvcm1hbHMpO1xuICB0aGlzLnJ1bGVEZXNjcmlwdGlvbnMgPSBPYmplY3QuY3JlYXRlKHN1cGVyR3JhbW1hci5ydWxlRGVzY3JpcHRpb25zKTtcblxuICAvLyBHcmFtbWFycyB3aXRoIGFuIGV4cGxpY2l0IHN1cGVyZ3JhbW1hciBpbmhlcml0IGEgZGVmYXVsdCBzdGFydCBydWxlLlxuICBpZiAoIXN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IHN1cGVyR3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhEZWZhdWx0U3RhcnRSdWxlID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gcnVsZU5hbWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhTb3VyY2UgPSBmdW5jdGlvbihzb3VyY2UpIHtcbiAgdGhpcy5pbnRlcnZhbCA9IElucHV0U3RyZWFtLm5ld0Zvcihzb3VyY2UpLmludGVydmFsKDAsIHNvdXJjZS5sZW5ndGgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIENyZWF0ZXMgYSBHcmFtbWFyIGluc3RhbmNlLCBhbmQgaWYgaXQgcGFzc2VzIHRoZSBzYW5pdHkgY2hlY2tzLCByZXR1cm5zIGl0LlxuR3JhbW1hckRlY2wucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIoXG4gICAgICB0aGlzLm5hbWUsXG4gICAgICB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLFxuICAgICAgdGhpcy5ydWxlQm9kaWVzLFxuICAgICAgdGhpcy5ydWxlRm9ybWFscyxcbiAgICAgIHRoaXMucnVsZURlc2NyaXB0aW9ucyxcbiAgICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSk7XG4gIC8vIFRPRE86IGNoYW5nZSB0aGUgcGV4cHIucHJvdG90eXBlLmFzc2VydC4uLiBtZXRob2RzIHRvIG1ha2UgdGhlbSBhZGRcbiAgLy8gZXhjZXB0aW9ucyB0byBhbiBhcnJheSB0aGF0J3MgcHJvdmlkZWQgYXMgYW4gYXJnLiBUaGVuIHdlJ2xsIGJlIGFibGUgdG9cbiAgLy8gc2hvdyBtb3JlIHRoYW4gb25lIGVycm9yIG9mIHRoZSBzYW1lIHR5cGUgYXQgYSB0aW1lLlxuICAvLyBUT0RPOiBpbmNsdWRlIHRoZSBvZmZlbmRpbmcgcGV4cHIgaW4gdGhlIGVycm9ycywgdGhhdCB3YXkgd2UgY2FuIHNob3dcbiAgLy8gdGhlIHBhcnQgb2YgdGhlIHNvdXJjZSB0aGF0IGNhdXNlZCBpdC5cbiAgdmFyIGdyYW1tYXJFcnJvcnMgPSBbXTtcbiAgdmFyIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gZmFsc2U7XG4gIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZUJvZGllcykuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlQm9kaWVzW3J1bGVOYW1lXTtcbiAgICB0cnkge1xuICAgICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgYm9keS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmICghZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMpIHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGNhbiBvbmx5IGJlIGRvbmUgaWYgdGhlIGdyYW1tYXIgaGFzIG5vIGludmFsaWQgYXBwbGljYXRpb25zLlxuICAgIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZUJvZGllcykuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVCb2RpZXNbcnVsZU5hbWVdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgYm9keS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICB9XG4gICAgICAvLyBGb3Igbm93LCBvbmx5IGNoZWNrIHRoZSBib2RpZXMgb2YgdW5wYXJhbWV0ZXJpemVkIHJ1bGVzLCBiZWNhdXNlIHRoZSBjaGVja3MgY2FuJ3QgZGVhbFxuICAgICAgLy8gcHJvcGVybHkgd2l0aCBwYXJhbWV0ZXJzIHRoYXQgZG9uJ3QgaGF2ZSBhIGNvbmNyZXRlIHZhbHVlLlxuICAgICAgLy8gVE9ETzogRml4IHRoaXMuXG4gICAgICBpZiAoZ3JhbW1hci5ydWxlRm9ybWFsc1tydWxlTmFtZV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYm9keS5hc3NlcnRWYWx1ZXNBbmRTdHJpbmdzQXJlTm90TWl4ZWQoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgaWYgKGdyYW1tYXJFcnJvcnMubGVuZ3RoID4gMCkge1xuICAgIGVycm9ycy50aHJvd0Vycm9ycyhncmFtbWFyRXJyb3JzKTtcbiAgfVxuICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgIGdyYW1tYXIuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbDtcbiAgfVxuXG4gIHJldHVybiBncmFtbWFyO1xufTtcblxuLy8gUnVsZSBkZWNsYXJhdGlvbnNcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uKG5hbWUsIGZvcm1hbHMsIGJvZHksIG9wdERlc2NyKSB7XG4gIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCk7XG4gIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlQm9kaWVzW25hbWVdKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIGJvZHkpO1xuICB9IGVsc2UgaWYgKHRoaXMucnVsZUJvZGllc1tuYW1lXSkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLm5hbWUsIGJvZHkpO1xuICB9XG4gIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgYm9keSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5LCBvcHREZXNjcik7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5KSB7XG4gIHZhciBiYXNlUnVsZSA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZUJvZGllc1tuYW1lXTtcbiAgaWYgKCFiYXNlUnVsZSkge1xuICAgIHRocm93IGVycm9ycy5jYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIGJvZHkpO1xuICB9XG4gIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgZnJhZ21lbnQpIHtcbiAgdmFyIGJhc2VSdWxlID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlQm9kaWVzW25hbWVdO1xuICBpZiAoIWJhc2VSdWxlKSB7XG4gICAgdGhyb3cgZXJyb3JzLmNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIGZyYWdtZW50KTtcbiAgfVxuICB2YXIgYm9keSA9IG5ldyBwZXhwcnMuRXh0ZW5kKHRoaXMuc3VwZXJHcmFtbWFyLCBuYW1lLCBmcmFnbWVudCk7XG4gIGJvZHkuaW50ZXJ2YWwgPSBmcmFnbWVudC5pbnRlcnZhbDtcbiAgdGhpcy5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlKG5hbWUsIGZvcm1hbHMsIGJvZHkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXJEZWNsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbSgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdJbnB1dFN0cmVhbSBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0XFwncyBhYnN0cmFjdCcpO1xufVxuXG5JbnB1dFN0cmVhbS5uZXdGb3IgPSBmdW5jdGlvbihhcnJPclN0cikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcnJPclN0cikgPyBuZXcgTGlzdElucHV0U3RyZWFtKGFyck9yU3RyKSA6IG5ldyBTdHJpbmdJbnB1dFN0cmVhbShhcnJPclN0cik7XG59O1xuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMucG9zID0gMDtcbiAgICB0aGlzLnBvc0luZm9zID0gW107XG4gIH0sXG5cbiAgYXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmF0RW5kKCkpIHtcbiAgICAgIHJldHVybiBjb21tb24uZmFpbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlW3RoaXMucG9zKytdO1xuICAgIH1cbiAgfSxcblxuICBtYXRjaEV4YWN0bHk6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gdGhpcy5uZXh0KCkgPT09IHggPyB0cnVlIDogY29tbW9uLmZhaWw7XG4gIH0sXG5cbiAgc291cmNlU2xpY2U6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeCk7XG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBvcHRFbmRJZHgpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMsIHN0YXJ0SWR4LCBvcHRFbmRJZHggPyBvcHRFbmRJZHggOiB0aGlzLnBvcyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIFN0cmluZ0lucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cbmluaGVyaXRzKFN0cmluZ0lucHV0U3RyZWFtLCBJbnB1dFN0cmVhbSk7XG5cblN0cmluZ0lucHV0U3RyZWFtLnByb3RvdHlwZS5tYXRjaFN0cmluZyA9IGZ1bmN0aW9uKHMpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKHRoaXMubWF0Y2hFeGFjdGx5KHNbaWR4XSkgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgICByZXR1cm4gY29tbW9uLmZhaWw7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gTGlzdElucHV0U3RyZWFtKHNvdXJjZSkge1xuICB0aGlzLmluaXQoc291cmNlKTtcbn1cbmluaGVyaXRzKExpc3RJbnB1dFN0cmVhbSwgSW5wdXRTdHJlYW0pO1xuXG5MaXN0SW5wdXRTdHJlYW0ucHJvdG90eXBlLm1hdGNoU3RyaW5nID0gZnVuY3Rpb24ocykge1xuICByZXR1cm4gdGhpcy5tYXRjaEV4YWN0bHkocyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFN0cmVhbTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2NvbW1vbicpLmFzc2VydDtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEludGVydmFsKGlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4O1xuICB0aGlzLmVuZElkeCA9IGVuZElkeDtcbn1cblxuSW50ZXJ2YWwuY292ZXJhZ2UgPSBmdW5jdGlvbigvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IGFyZ3VtZW50c1swXS5pbnB1dFN0cmVhbTtcbiAgdmFyIHN0YXJ0SWR4ID0gYXJndW1lbnRzWzBdLnN0YXJ0SWR4O1xuICB2YXIgZW5kSWR4ID0gYXJndW1lbnRzWzBdLmVuZElkeDtcbiAgZm9yICh2YXIgaWR4ID0gMTsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBhcmd1bWVudHNbaWR4XTtcbiAgICBpZiAoaW50ZXJ2YWwuaW5wdXRTdHJlYW0gIT09IGlucHV0U3RyZWFtKSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0SWR4ID0gTWF0aC5taW4oc3RhcnRJZHgsIGFyZ3VtZW50c1tpZHhdLnN0YXJ0SWR4KTtcbiAgICAgIGVuZElkeCA9IE1hdGgubWF4KGVuZElkeCwgYXJndW1lbnRzW2lkeF0uZW5kSWR4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ldyBJbnRlcnZhbChpbnB1dFN0cmVhbSwgc3RhcnRJZHgsIGVuZElkeCk7XG59O1xuXG5JbnRlcnZhbC5wcm90b3R5cGUgPSB7XG4gIGNvdmVyYWdlV2l0aDogZnVuY3Rpb24oLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICAgIHZhciBpbnRlcnZhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGludGVydmFscy5wdXNoKHRoaXMpO1xuICAgIHJldHVybiBJbnRlcnZhbC5jb3ZlcmFnZS5hcHBseSh1bmRlZmluZWQsIGludGVydmFscyk7XG4gIH0sXG5cbiAgY29sbGFwc2VkTGVmdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLnN0YXJ0SWR4KTtcbiAgfSxcblxuICBjb2xsYXBzZWRSaWdodDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCB0aGlzLmVuZElkeCwgdGhpcy5lbmRJZHgpO1xuICB9LFxuXG4gIGdldExpbmVBbmRDb2x1bW5NZXNzYWdlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmFuZ2UgPSBbdGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHhdO1xuICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKHRoaXMuaW5wdXRTdHJlYW0uc291cmNlLCB0aGlzLnN0YXJ0SWR4LCByYW5nZSk7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhbiBhcnJheSBvZiAwLCAxLCBvciAyIGludGVydmFscyB0aGF0IHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiB0aGVcbiAgLy8gaW50ZXJ2YWwgZGlmZmVyZW5jZSBvcGVyYXRpb24uXG4gIG1pbnVzOiBmdW5jdGlvbih0aGF0KSB7XG4gICAgaWYgKHRoaXMuaW5wdXRTdHJlYW0gIT09IHRoYXQuaW5wdXRTdHJlYW0pIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPT09IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPT09IHRoYXQuZW5kSWR4KSB7XG4gICAgICAvLyBgdGhpc2AgYW5kIGB0aGF0YCBhcmUgdGhlIHNhbWUgaW50ZXJ2YWwhXG4gICAgICByZXR1cm4gW1xuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgIC8vIGB0aGF0YCBzcGxpdHMgYHRoaXNgIGludG8gdHdvIGludGVydmFsc1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgbmV3IEludGVydmFsKHRoaXMuaW5wdXRTdHJlYW0sIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpLFxuICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhhdC5lbmRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LmVuZElkeCAmJiB0aGF0LmVuZElkeCA8IHRoaXMuZW5kSWR4KSB7XG4gICAgICAvLyBgdGhhdGAgY29udGFpbnMgYSBwcmVmaXggb2YgYHRoaXNgXG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhhdC5lbmRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuc3RhcnRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgc3VmZml4IG9mIGB0aGlzYFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgbmV3IEludGVydmFsKHRoaXMuaW5wdXRTdHJlYW0sIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpXG4gICAgICBdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBgdGhhdGAgYW5kIGB0aGlzYCBkbyBub3Qgb3ZlcmxhcFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgdGhpc1xuICAgICAgXTtcbiAgICB9XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB0aGF0IGhhcyB0aGUgc2FtZSBleHRlbnQgYXMgdGhpcyBvbmUsIGJ1dCB3aGljaCBpcyByZWxhdGl2ZVxuICAvLyB0byBgdGhhdGAsIGFuIEludGVydmFsIHRoYXQgZnVsbHkgY292ZXJzIHRoaXMgb25lLlxuICByZWxhdGl2ZVRvOiBmdW5jdGlvbih0aGF0LCBuZXdJbnB1dFN0cmVhbSkge1xuICAgIGlmICh0aGlzLmlucHV0U3RyZWFtICE9PSB0aGF0LmlucHV0U3RyZWFtKSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgfVxuICAgIGFzc2VydCh0aGlzLnN0YXJ0SWR4ID49IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPD0gdGhhdC5lbmRJZHgsXG4gICAgICAgICAgICdvdGhlciBpbnRlcnZhbCBkb2VzIG5vdCBjb3ZlciB0aGlzIG9uZScpO1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwobmV3SW5wdXRTdHJlYW0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SWR4IC0gdGhhdC5zdGFydElkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kSWR4IC0gdGhhdC5zdGFydElkeCk7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB3aGljaCBjb250YWlucyB0aGUgc2FtZSBjb250ZW50cyBhcyB0aGlzIG9uZSxcbiAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgLy8gdGhlIGlucHV0IHN0cmVhbSBpcyBhIHN0cmluZy4pXG4gIHRyaW1tZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgdmFyIHN0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIGNvbnRlbnRzLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICB2YXIgZW5kSWR4ID0gdGhpcy5lbmRJZHggLSBjb250ZW50cy5tYXRjaCgvXFxzKiQvKVswXS5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KTtcbiAgfVxufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSW50ZXJ2YWwucHJvdG90eXBlLCB7XG4gIGNvbnRlbnRzOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9jb250ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRzID0gdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2VTbGljZSh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQ3JlYXRlIGEgc2hvcnQgZXJyb3IgbWVzc2FnZSBmb3IgYW4gZXJyb3IgdGhhdCBvY2N1cnJlZCBkdXJpbmcgbWF0Y2hpbmcuXG5mdW5jdGlvbiBnZXRTaG9ydE1hdGNoRXJyb3JNZXNzYWdlKHBvcywgc291cmNlLCBkZXRhaWwpIHtcbiAgdmFyIGVycm9ySW5mbyA9IHV0aWwuZ2V0TGluZUFuZENvbHVtbihzb3VyY2UsIHBvcyk7XG4gIHJldHVybiAnTGluZSAnICsgZXJyb3JJbmZvLmxpbmVOdW0gKyAnLCBjb2wgJyArIGVycm9ySW5mby5jb2xOdW0gKyAnOiAnICsgZGV0YWlsO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBNYXRjaEZhaWx1cmUgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTWF0Y2hSZXN1bHQoc3RhdGUpIHtcbiAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICB0aGlzLl9jc3QgPSBzdGF0ZS5iaW5kaW5nc1swXTtcbn1cblxuTWF0Y2hSZXN1bHQubmV3Rm9yID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIHN1Y2NlZWRlZCA9IHN0YXRlLmJpbmRpbmdzLmxlbmd0aCA+IDA7XG4gIHJldHVybiBzdWNjZWVkZWQgPyBuZXcgTWF0Y2hSZXN1bHQoc3RhdGUpIDogbmV3IE1hdGNoRmFpbHVyZShzdGF0ZSk7XG59O1xuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZmFpbGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5zdWNjZWVkZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLmZhaWxlZCgpO1xufTtcblxuLy8gUmV0dXJucyBhIGBNYXRjaFJlc3VsdGAgdGhhdCBjYW4gYmUgZmVkIGludG8gb3BlcmF0aW9ucyBvciBhdHRyaWJ1dGVzIHRoYXQgY2FyZVxuLy8gYWJvdXQgdGhlIHdoaXRlc3BhY2UgdGhhdCB3YXMgaW1wbGljaXRseSBza2lwcGVkIG92ZXIgYnkgc3ludGFjdGljIHJ1bGVzLiBUaGlzXG4vLyBpcyB1c2VmdWwgZm9yIGRvaW5nIHRoaW5ncyB3aXRoIGNvbW1lbnRzLCBlLmcuLCBzeW50YXggaGlnaGxpZ2h0aW5nLlxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldERpc2NhcmRlZFNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5mYWlsZWQoKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gIHZhciBncmFtbWFyID0gc3RhdGUuZ3JhbW1hcjtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG5cbiAgdmFyIGludGVydmFscyA9IFtuZXcgSW50ZXJ2YWwoaW5wdXRTdHJlYW0sIDAsIGlucHV0U3RyZWFtLnNvdXJjZS5sZW5ndGgpXTtcblxuICAvLyBTdWJ0cmFjdCB0aGUgaW50ZXJ2YWwgb2YgZWFjaCB0ZXJtaW5hbCBmcm9tIHRoZSBzZXQgb2YgaW50ZXJ2YWxzIGFib3ZlLlxuICB2YXIgcyA9IGdyYW1tYXIuc2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCdzdWJ0cmFjdFRlcm1pbmFscycsIHtcbiAgICBfbm9udGVybWluYWw6IGZ1bmN0aW9uKGNoaWxkcmVuKSB7XG4gICAgICBjaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLnN1YnRyYWN0VGVybWluYWxzKCk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIF90ZXJtaW5hbDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdCA9IHRoaXM7XG4gICAgICBpbnRlcnZhbHMgPSBpbnRlcnZhbHMuXG4gICAgICAgICAgbWFwKGZ1bmN0aW9uKGludGVydmFsKSB7IHJldHVybiBpbnRlcnZhbC5taW51cyh0LmludGVydmFsKTsgfSkuXG4gICAgICAgICAgcmVkdWNlKGZ1bmN0aW9uKHhzLCB5cykgeyByZXR1cm4geHMuY29uY2F0KHlzKTsgfSwgW10pO1xuICAgIH1cbiAgfSk7XG4gIHModGhpcykuc3VidHJhY3RUZXJtaW5hbHMoKTtcblxuICAvLyBOb3cgYGludGVydmFsc2AgaG9sZHMgdGhlIGludGVydmFscyBvZiB0aGUgaW5wdXQgc3RyZWFtIHRoYXQgd2VyZSBza2lwcGVkIG92ZXIgYnkgc3ludGFjdGljXG4gIC8vIHJ1bGVzLCBiZWNhdXNlIHRoZXkgY29udGFpbmVkIHNwYWNlcy5cblxuICAvLyBOZXh0LCB3ZSB3YW50IHRvIG1hdGNoIHRoZSBjb250ZW50cyBvZiBlYWNoIG9mIHRob3NlIGludGVydmFscyB3aXRoIHRoZSBncmFtbWFyJ3MgYHNwYWNlc2BcbiAgLy8gcnVsZSwgdG8gcmVjb25zdHJ1Y3QgdGhlIENTVCBub2RlcyB0aGF0IHdlcmUgZGlzY2FyZGVkIGJ5IHN5bnRhY3RpYyBydWxlcy4gQnV0IGlmIHdlIHNpbXBseVxuICAvLyBwYXNzIGVhY2ggaW50ZXJ2YWwncyBgY29udGVudHNgIHRvIHRoZSBncmFtbWFyJ3MgYG1hdGNoYCBtZXRob2QsIHRoZSByZXN1bHRpbmcgbm9kZXMgYW5kXG4gIC8vIHRoZWlyIGNoaWxkcmVuIHdpbGwgaGF2ZSBpbnRlcnZhbHMgdGhhdCBhcmUgYXNzb2NpYXRlZCB3aXRoIGEgZGlmZmVyZW50IGlucHV0LCBpLmUuLCBhXG4gIC8vIHN1YnN0cmluZyBvZiB0aGUgb3JpZ2luYWwgaW5wdXQuIFRoZSBmb2xsb3dpbmcgb3BlcmF0aW9uIHdpbGwgZml4IHRoaXMgcHJvYmxlbSBmb3IgdXMuXG4gIHMuYWRkT3BlcmF0aW9uKCdmaXhJbnRlcnZhbHMoaWR4T2Zmc2V0KScsIHtcbiAgICBfZGVmYXVsdDogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgIHZhciBpZHhPZmZzZXQgPSB0aGlzLmFyZ3MuaWR4T2Zmc2V0O1xuICAgICAgdGhpcy5pbnRlcnZhbC5pbnB1dFN0cmVhbSA9IGlucHV0U3RyZWFtO1xuICAgICAgdGhpcy5pbnRlcnZhbC5zdGFydElkeCArPSBpZHhPZmZzZXQ7XG4gICAgICB0aGlzLmludGVydmFsLmVuZElkeCArPSBpZHhPZmZzZXQ7XG4gICAgICBpZiAoIXRoaXMuaXNUZXJtaW5hbCgpKSB7XG4gICAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICBjaGlsZC5maXhJbnRlcnZhbHMoaWR4T2Zmc2V0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICAvLyBOb3cgd2UncmUgZmluYWxseSByZWFkeSB0byByZWNvbnN0cnVjdCB0aGUgZGlzY2FyZGVkIENTVCBub2Rlcy5cbiAgdmFyIGRpc2NhcmRlZE5vZGVzID0gaW50ZXJ2YWxzLm1hcChmdW5jdGlvbihpbnRlcnZhbCkge1xuICAgIHZhciByID0gZ3JhbW1hci5tYXRjaChpbnRlcnZhbC5jb250ZW50cywgJ3NwYWNlcycpO1xuICAgIHMocikuZml4SW50ZXJ2YWxzKGludGVydmFsLnN0YXJ0SWR4KTtcbiAgICByZXR1cm4gci5fY3N0O1xuICB9KTtcblxuICAvLyBSYXRoZXIgdGhhbiByZXR1cm4gYSBidW5jaCBvZiBDU1Qgbm9kZXMgYW5kIG1ha2UgdGhlIGNhbGxlciBvZiB0aGlzIG1ldGhvZCBsb29wIG92ZXIgdGhlbSxcbiAgLy8gd2UgY2FuIGNvbnN0cnVjdCBhIHNpbmdsZSBDU1Qgbm9kZSB0aGF0IGlzIHRoZSBwYXJlbnQgb2YgYWxsIG9mIHRoZSBkaXNjYXJkZWQgbm9kZXMuIEFuXG4gIC8vIGBJdGVyYXRpb25Ob2RlYCBpcyB0aGUgb2J2aW91cyBjaG9pY2UgZm9yIHRoaXMuXG4gIGRpc2NhcmRlZE5vZGVzID0gbmV3IG5vZGVzLkl0ZXJhdGlvbk5vZGUoXG4gICAgICBncmFtbWFyLFxuICAgICAgZGlzY2FyZGVkTm9kZXMsXG4gICAgICBkaXNjYXJkZWROb2Rlcy5sZW5ndGggPT09IDAgP1xuICAgICAgICAgIG5ldyBJbnRlcnZhbChpbnB1dFN0cmVhbSwgMCwgMCkgOlxuICAgICAgICAgIG5ldyBJbnRlcnZhbChcbiAgICAgICAgICAgICAgaW5wdXRTdHJlYW0sXG4gICAgICAgICAgICAgIGRpc2NhcmRlZE5vZGVzWzBdLmludGVydmFsLnN0YXJ0SWR4LFxuICAgICAgICAgICAgICBkaXNjYXJkZWROb2Rlc1tkaXNjYXJkZWROb2Rlcy5sZW5ndGggLSAxXS5pbnRlcnZhbC5lbmRJZHgpKTtcblxuICAvLyBCdXQgcmVtZW1iZXIgdGhhdCBhIENTVCBub2RlIGNhbid0IGJlIHVzZWQgZGlyZWN0bHkgYnkgY2xpZW50cy4gV2hhdCB3ZSByZWFsbHkgbmVlZCB0byByZXR1cm5cbiAgLy8gZnJvbSB0aGlzIG1ldGhvZCBpcyBhIHN1Y2Nlc3NmdWwgYE1hdGNoUmVzdWx0YCB0aGF0IGNhbiBiZSB1c2VkIHdpdGggdGhlIGNsaWVudHMnIHNlbWFudGljcy5cbiAgLy8gV2UgYWxyZWFkeSBoYXZlIG9uZSAtLSBgdGhpc2AgLS0gYnV0IGl0J3MgZ290IGEgZGlmZmVyZW50IENTVCBub2RlIGluc2lkZS4gU28gd2UgY3JlYXRlIGEgbmV3XG4gIC8vIG9iamVjdCB0aGF0IGRlbGVnYXRlcyB0byBgdGhpc2AsIGFuZCBvdmVycmlkZSBpdHMgYF9jc3RgIHByb3BlcnR5LlxuICB2YXIgciA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gIHIuX2NzdCA9IGRpc2NhcmRlZE5vZGVzO1xuXG4gIC8vIFdlIGFsc28gb3ZlcnJpZGUgaXRzIGBnZXREaXNjYXJkZWRTcGFjZXNgIG1ldGhvZCwgaW4gY2FzZSBzb21lb25lIGRlY2lkZXMgdG8gY2FsbCBpdC5cbiAgci5nZXREaXNjYXJkZWRTcGFjZXMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIHI7IH07XG5cbiAgcmV0dXJuIHI7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBNYXRjaEZhaWx1cmUgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTWF0Y2hGYWlsdXJlKHN0YXRlKSB7XG4gIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnX2ZhaWx1cmVzJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0RmFpbHVyZXMoKTtcbiAgfSk7XG4gIGNvbW1vbi5kZWZpbmVMYXp5UHJvcGVydHkodGhpcywgJ21lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICB2YXIgc291cmNlID0gdGhpcy5zdGF0ZS5pbnB1dFN0cmVhbS5zb3VyY2U7XG4gICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gJ21hdGNoIGZhaWxlZCBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKTtcbiAgICB9XG5cbiAgICB2YXIgZGV0YWlsID0gJ0V4cGVjdGVkICcgKyB0aGlzLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKHNvdXJjZSwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSkgKyBkZXRhaWw7XG4gIH0pO1xuICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdzaG9ydE1lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuICdtYXRjaCBmYWlsZWQgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCk7XG4gICAgfVxuICAgIHZhciBkZXRhaWwgPSAnZXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgcmV0dXJuIGdldFNob3J0TWF0Y2hFcnJvck1lc3NhZ2UoXG4gICAgICAgIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCksXG4gICAgICAgIHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0uc291cmNlLFxuICAgICAgICBkZXRhaWwpO1xuICB9KTtcbn1cbmluaGVyaXRzKE1hdGNoRmFpbHVyZSwgTWF0Y2hSZXN1bHQpO1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnW01hdGNoRmFpbHVyZSBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSArICddJztcbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZmFpbGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3RhdGUuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCk7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldFJpZ2h0bW9zdEZhaWx1cmVzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9mYWlsdXJlcztcbn07XG5cbi8vIFJldHVybiBhIHN0cmluZyBzdW1tYXJpemluZyB0aGUgZXhwZWN0ZWQgY29udGVudHMgb2YgdGhlIGlucHV0IHN0cmVhbSB3aGVuXG4vLyB0aGUgbWF0Y2ggZmFpbHVyZSBvY2N1cnJlZC5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0RXhwZWN0ZWRUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHZhciBmYWlsdXJlcyA9IHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZXMoKTtcblxuICAvLyBGaWx0ZXIgb3V0IHRoZSBmbHVmZnkgZmFpbHVyZXMgdG8gbWFrZSB0aGUgZGVmYXVsdCBlcnJvciBtZXNzYWdlcyBtb3JlIHVzZWZ1bFxuICBmYWlsdXJlcyA9IGZhaWx1cmVzLmZpbHRlcihmdW5jdGlvbihmYWlsdXJlKSB7XG4gICAgcmV0dXJuICFmYWlsdXJlLmlzRmx1ZmZ5KCk7XG4gIH0pO1xuXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGZhaWx1cmVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgaWYgKGlkeCA9PT0gZmFpbHVyZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICBzYi5hcHBlbmQoKGZhaWx1cmVzLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHNiLmFwcGVuZChmYWlsdXJlc1tpZHhdLnRvU3RyaW5nKCkpO1xuICB9XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgcG9zID0gdGhpcy5zdGF0ZS5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKTtcbiAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnN0YXRlLmlucHV0U3RyZWFtLCBwb3MsIHBvcyk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFJlc3VsdDtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTmFtZXNwYWNlKCkge1xufVxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbk5hbWVzcGFjZS5hc05hbWVzcGFjZSA9IGZ1bmN0aW9uKG9iak9yTmFtZXNwYWNlKSB7XG4gIGlmIChvYmpPck5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkge1xuICAgIHJldHVybiBvYmpPck5hbWVzcGFjZTtcbiAgfVxuICByZXR1cm4gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZShvYmpPck5hbWVzcGFjZSk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlLiBJZiBgb3B0UHJvcHNgIGlzIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzXG4vLyB3aWxsIGJlIGNvcGllZCB0byB0aGUgbmV3IG5hbWVzcGFjZS5cbk5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UgPSBmdW5jdGlvbihvcHRQcm9wcykge1xuICByZXR1cm4gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UucHJvdG90eXBlLCBvcHRQcm9wcyk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlIHdoaWNoIGV4dGVuZHMgYW5vdGhlciBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXNcbi8vIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmV4dGVuZCA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgb3B0UHJvcHMpIHtcbiAgaWYgKG5hbWVzcGFjZSAhPT0gTmFtZXNwYWNlLnByb3RvdHlwZSAmJiAhKG5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBOYW1lc3BhY2Ugb2JqZWN0OiAnICsgbmFtZXNwYWNlKTtcbiAgfVxuICB2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG5hbWVzcGFjZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogTmFtZXNwYWNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBleHRlbmQobnMsIG9wdFByb3BzKTtcbn07XG5cbi8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGEgcmVndWxhciBtZXRob2Q/XG5OYW1lc3BhY2UudG9TdHJpbmcgPSBmdW5jdGlvbihucykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5zKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVzcGFjZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFBvc0luZm8oc3RhdGUpIHtcbiAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gW107ICAvLyBhIHN0YWNrIG9mIFwibWVtbyBrZXlzXCIgb2YgdGhlIGFjdGl2ZSBhcHBsaWNhdGlvbnNcbiAgdGhpcy5tZW1vID0ge307XG4gIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSB1bmRlZmluZWQ7XG59XG5cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSA+PSAwO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihhcHBsaWNhdGlvbikge1xuICAgIHRoaXMuc3RhdGUuZW50ZXIoYXBwbGljYXRpb24pO1xuICAgIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sucHVzaChhcHBsaWNhdGlvbi50b01lbW9LZXkoKSk7XG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zdGF0ZS5leGl0KCk7XG4gICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wb3AoKTtcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKGhlYWRBcHBsaWNhdGlvbiwgbWVtb1JlYykge1xuICAgIG1lbW9SZWMuaXNMZWZ0UmVjdXJzaW9uID0gdHJ1ZTtcbiAgICBtZW1vUmVjLmhlYWRBcHBsaWNhdGlvbiA9IGhlYWRBcHBsaWNhdGlvbjtcbiAgICBtZW1vUmVjLm5leHRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gbWVtb1JlYztcblxuICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2s7XG4gICAgdmFyIGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmluZGV4T2YoaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSArIDE7XG4gICAgdmFyIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cyA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLnNsaWNlKGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZSk7XG5cbiAgICBtZW1vUmVjLmlzSW52b2x2ZWQgPSBmdW5jdGlvbihhcHBsaWNhdGlvbk1lbW9LZXkpIHtcbiAgICAgIHJldHVybiBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMuaW5kZXhPZihhcHBsaWNhdGlvbk1lbW9LZXkpID49IDA7XG4gICAgfTtcblxuICAgIG1lbW9SZWMudXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBpZHggPSBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGU7IGlkeCA8IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrW2lkeF07XG4gICAgICAgIGlmICghdGhpcy5pc0ludm9sdmVkKGFwcGxpY2F0aW9uTWVtb0tleSkpIHtcbiAgICAgICAgICBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMucHVzaChhcHBsaWNhdGlvbk1lbW9LZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBlbmRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbi5uZXh0TGVmdFJlY3Vyc2lvbjtcbiAgfSxcblxuICAvLyBOb3RlOiB0aGlzIG1ldGhvZCBkb2Vzbid0IGdldCBjYWxsZWQgZm9yIHRoZSBcImhlYWRcIiBvZiBhIGxlZnQgcmVjdXJzaW9uIC0tIGZvciBMUiBoZWFkcyxcbiAgLy8gdGhlIG1lbW9pemVkIHJlc3VsdCAod2hpY2ggc3RhcnRzIG91dCBiZWluZyBhIGZhaWx1cmUpIGlzIGFsd2F5cyB1c2VkLlxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIGlmICghbWVtb1JlYy5pc0xlZnRSZWN1cnNpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXkgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFja1tpZHhdO1xuICAgICAgaWYgKG1lbW9SZWMuaXNJbnZvbHZlZChhcHBsaWNhdGlvbk1lbW9LZXkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc0luZm87XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgU3ltYm9sID0gcmVxdWlyZSgnZXM2LXN5bWJvbCcpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSByZXF1aXJlKCcuL25vZGVzJykuSXRlcmF0aW9uTm9kZTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gV3JhcHBlcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gV3JhcHBlcnMgZGVjb3JhdGUgQ1NUIG5vZGVzIHdpdGggYWxsIG9mIHRoZSBmdW5jdGlvbmFsaXR5IChpLmUuLCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzKVxuLy8gcHJvdmlkZWQgYnkgYSBTZW1hbnRpY3MgKHNlZSBiZWxvdykuIGBXcmFwcGVyYCBpcyB0aGUgYWJzdHJhY3Qgc3VwZXJjbGFzcyBvZiBhbGwgd3JhcHBlcnMuIEFcbi8vIGBXcmFwcGVyYCBtdXN0IGhhdmUgYF9ub2RlYCBhbmQgYF9zZW1hbnRpY3NgIGluc3RhbmNlIHZhcmlhYmxlcywgd2hpY2ggcmVmZXIgdG8gdGhlIENTVCBub2RlIGFuZFxuLy8gU2VtYW50aWNzIChyZXNwLikgZm9yIHdoaWNoIGl0IHdhcyBjcmVhdGVkLCBhbmQgYSBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlIHdoaWNoIGlzXG4vLyB1c2VkIHRvIGNhY2hlIHRoZSB3cmFwcGVyIGluc3RhbmNlcyB0aGF0IGFyZSBjcmVhdGVkIGZvciBpdHMgY2hpbGQgbm9kZXMuIFNldHRpbmcgdGhlc2UgaW5zdGFuY2Vcbi8vIHZhcmlhYmxlcyBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNvbnN0cnVjdG9yIG9mIGVhY2ggU2VtYW50aWNzLXNwZWNpZmljIHN1YmNsYXNzIG9mXG4vLyBgV3JhcHBlcmAuXG5mdW5jdGlvbiBXcmFwcGVyKCkge31cblxuV3JhcHBlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbc2VtYW50aWNzIHdyYXBwZXIgZm9yICcgKyB0aGlzLl9ub2RlLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cbldyYXBwZXIucHJvdG90eXBlLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvciA9IGZ1bmN0aW9uKGF0dHJpYnV0ZU5hbWUpIHtcbiAgLy8gUmVtb3ZlIHRoZSBtZW1vaXplZCBhdHRyaWJ1dGUgZnJvbSB0aGUgY3N0Tm9kZSBhbmQgYWxsIGl0cyBjaGlsZHJlbi5cbiAgZGVsZXRlIHRoaXMuX25vZGVbdGhpcy5fc2VtYW50aWNzLmF0dHJpYnV0ZUtleXNbYXR0cmlidXRlTmFtZV1dO1xuICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBjaGlsZC5fZm9yZ2V0TWVtb2l6ZWRSZXN1bHRGb3IoYXR0cmlidXRlTmFtZSk7XG4gIH0pO1xufTtcblxuLy8gUmV0dXJucyB0aGUgd3JhcHBlciBvZiB0aGUgc3BlY2lmaWVkIGNoaWxkIG5vZGUuIENoaWxkIHdyYXBwZXJzIGFyZSBjcmVhdGVkIGxhemlseSBhbmQgY2FjaGVkIGluXG4vLyB0aGUgcGFyZW50IHdyYXBwZXIncyBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlLlxuV3JhcHBlci5wcm90b3R5cGUuY2hpbGQgPSBmdW5jdGlvbihpZHgpIHtcbiAgaWYgKCEoMCA8PSBpZHggJiYgaWR4IDwgdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpKSkge1xuICAgIC8vIFRPRE86IENvbnNpZGVyIHRocm93aW5nIGFuIGV4Y2VwdGlvbiBoZXJlLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGNoaWxkV3JhcHBlciA9IHRoaXMuX2NoaWxkV3JhcHBlcnNbaWR4XTtcbiAgaWYgKCFjaGlsZFdyYXBwZXIpIHtcbiAgICBjaGlsZFdyYXBwZXIgPSB0aGlzLl9jaGlsZFdyYXBwZXJzW2lkeF0gPSB0aGlzLl9zZW1hbnRpY3Mud3JhcCh0aGlzLl9ub2RlLmNoaWxkQXQoaWR4KSk7XG4gIH1cbiAgcmV0dXJuIGNoaWxkV3JhcHBlcjtcbn07XG5cbi8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgd3JhcHBlcnMgb2YgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpc1xuLy8gd3JhcHBlci5cbldyYXBwZXIucHJvdG90eXBlLl9jaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBGb3JjZSB0aGUgY3JlYXRpb24gb2YgYWxsIGNoaWxkIHdyYXBwZXJzXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgaWR4KyspIHtcbiAgICB0aGlzLmNoaWxkKGlkeCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2NoaWxkV3JhcHBlcnM7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBjb3JyZXNwb25kcyB0byBhbiBpdGVyYXRpb25cbi8vIGV4cHJlc3Npb24sIGkuZS4sIGEgS2xlZW5lLSosIEtsZWVuZS0rLCBvciBhbiBvcHRpb25hbC4gUmV0dXJucyBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlLmlzSXRlcmF0aW9uKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIHRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbi8vIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX25vZGUuaXNUZXJtaW5hbCgpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlLCBgZmFsc2VgXG4vLyBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlLmlzTm9udGVybWluYWwoKTtcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZVxuLy8gY29ycmVzcG9uZGluZyB0byBhIHN5bnRhY3RpYyBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmlzTm9udGVybWluYWwoKSAmJiB0aGlzLl9ub2RlLmlzU3ludGFjdGljKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGVcbi8vIGNvcnJlc3BvbmRpbmcgdG8gYSBsZXhpY2FsIHJ1bGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNMZXhpY2FsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmlzTm9udGVybWluYWwoKSAmJiB0aGlzLl9ub2RlLmlzTGV4aWNhbCgpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYW4gaXRlcmF0b3Igbm9kZVxuLy8gaGF2aW5nIGVpdGhlciBvbmUgb3Igbm8gY2hpbGQgKD8gb3BlcmF0b3IpLCBgZmFsc2VgIG90aGVyd2lzZS5cbi8vIE90aGVyd2lzZSwgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbldyYXBwZXIucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX25vZGUuaXNPcHRpb25hbCgpO1xufTtcblxuLy8gQ3JlYXRlIGEgbmV3IEl0ZXJhdGlvbk5vZGUgaW4gdGhlIHNhbWUgc2VtYW50aWNzIGFzIHRoaXMgd3JhcHBlci5cbldyYXBwZXIucHJvdG90eXBlLml0ZXJhdGlvbiA9IGZ1bmN0aW9uKG9wdEVsZW1lbnRzKSB7XG4gIHZhciBpdGVyID0gbmV3IEl0ZXJhdGlvbk5vZGUodGhpcy5fbm9kZS5ncmFtbWFyLCBvcHRFbGVtZW50cyB8fCBbXSwgdGhpcy5pbnRlcnZhbCwgZmFsc2UpO1xuICByZXR1cm4gdGhpcy5fc2VtYW50aWNzLndyYXAoaXRlcik7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcmFwcGVyLnByb3RvdHlwZSwge1xuICAvLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIGNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2NoaWxkcmVuKCk7IH19LFxuXG4gIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgZ3JhbW1hciBydWxlIHRoYXQgY3JlYXRlZCB0aGlzIENTVCBub2RlLlxuICBjdG9yTmFtZToge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9ub2RlLmN0b3JOYW1lOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBpbnRlcnZhbCBjb25zdW1lZCBieSB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlci5cbiAgaW50ZXJ2YWw6IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5pbnRlcnZhbDsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIG51bUNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgcHJpbWl0aXZlIHZhbHVlIG9mIHRoaXMgQ1NUIG5vZGUsIGlmIGl0J3MgYSB0ZXJtaW5hbCBub2RlLiBPdGhlcndpc2UsXG4gIC8vIHRocm93cyBhbiBleGNlcHRpb24uXG4gIHByaW1pdGl2ZVZhbHVlOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmlzVGVybWluYWwoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5wcmltaXRpdmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJ0cmllZCB0byBhY2Nlc3MgdGhlICdwcmltaXRpdmVWYWx1ZScgYXR0cmlidXRlIG9mIGEgbm9uLXRlcm1pbmFsIENTVCBub2RlXCIpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFNlbWFudGljcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBBIFNlbWFudGljcyBpcyBhIGNvbnRhaW5lciBmb3IgYSBmYW1pbHkgb2YgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBmb3IgYSBnaXZlbiBncmFtbWFyLlxuLy8gU2VtYW50aWNzIGVuYWJsZSBtb2R1bGFyaXR5IChkaWZmZXJlbnQgY2xpZW50cyBvZiBhIGdyYW1tYXIgY2FuIGNyZWF0ZSB0aGVpciBzZXQgb2Ygb3BlcmF0aW9uc1xuLy8gYW5kIGF0dHJpYnV0ZXMgaW4gaXNvbGF0aW9uKSBhbmQgZXh0ZW5zaWJpbGl0eSBldmVuIHdoZW4gb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBhcmUgbXV0dWFsbHktXG4vLyByZWN1cnNpdmUuIFRoaXMgY29uc3RydWN0b3Igc2hvdWxkIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgZXhjZXB0IGZyb21cbi8vIGBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzYC4gVGhlIG5vcm1hbCB3YXlzIHRvIGNyZWF0ZSBhIFNlbWFudGljcywgZ2l2ZW4gYSBncmFtbWFyICdnJywgYXJlXG4vLyBgZy5zZW1hbnRpY3MoKWAgYW5kIGBnLmV4dGVuZFNlbWFudGljcyhwYXJlbnRTZW1hbnRpY3MpYC5cbmZ1bmN0aW9uIFNlbWFudGljcyhncmFtbWFyLCBzdXBlclNlbWFudGljcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gZmFsc2U7XG5cbiAgLy8gQ29uc3RydWN0b3IgZm9yIHdyYXBwZXIgaW5zdGFuY2VzLCB3aGljaCBhcmUgcGFzc2VkIGFzIHRoZSBhcmd1bWVudHMgdG8gdGhlIHNlbWFudGljIGFjdGlvbnNcbiAgLy8gb2YgYW4gb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZS4gT3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyByZXF1aXJlIGRvdWJsZSBkaXNwYXRjaDogdGhlIHNlbWFudGljXG4gIC8vIGFjdGlvbiBpcyBjaG9zZW4gYmFzZWQgb24gYm90aCB0aGUgbm9kZSdzIHR5cGUgYW5kIHRoZSBzZW1hbnRpY3MuIFdyYXBwZXJzIGVuc3VyZSB0aGF0XG4gIC8vIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGlzIGNhbGxlZCB3aXRoIHRoZSBjb3JyZWN0IChtb3N0IHNwZWNpZmljKSBzZW1hbnRpY3Mgb2JqZWN0IGFzIGFuXG4gIC8vIGFyZ3VtZW50LlxuICB0aGlzLldyYXBwZXIgPSBmdW5jdGlvbihub2RlKSB7XG4gICAgc2VsZi5jaGVja0FjdGlvbkRpY3RzSWZIYXZlbnRBbHJlYWR5KCk7XG4gICAgdGhpcy5fc2VtYW50aWNzID0gc2VsZjtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLl9jaGlsZFdyYXBwZXJzID0gW107XG4gIH07XG5cbiAgdGhpcy5zdXBlciA9IHN1cGVyU2VtYW50aWNzO1xuICBpZiAoc3VwZXJTZW1hbnRpY3MpIHtcbiAgICBpZiAoZ3JhbW1hciAhPT0gdGhpcy5zdXBlci5ncmFtbWFyICYmICFncmFtbWFyLl9pbmhlcml0c0Zyb20odGhpcy5zdXBlci5ncmFtbWFyKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQ2Fubm90IGV4dGVuZCBhIHNlbWFudGljcyBmb3IgZ3JhbW1hciAnXCIgKyB0aGlzLnN1cGVyLmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgXCInIGZvciB1c2Ugd2l0aCBncmFtbWFyICdcIiArIGdyYW1tYXIubmFtZSArIFwiJyAobm90IGEgc3ViLWdyYW1tYXIpXCIpO1xuICAgIH1cbiAgICBpbmhlcml0cyh0aGlzLldyYXBwZXIsIHRoaXMuc3VwZXIuV3JhcHBlcik7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLm9wZXJhdGlvbnMpO1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IE9iamVjdC5jcmVhdGUodGhpcy5zdXBlci5hdHRyaWJ1dGVzKTtcbiAgICB0aGlzLmF0dHJpYnV0ZUtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gQXNzaWduIHVuaXF1ZSBzeW1ib2xzIGZvciBlYWNoIG9mIHRoZSBhdHRyaWJ1dGVzIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3Mgc28gdGhhdFxuICAgIC8vIHRoZXkgYXJlIG1lbW9pemVkIGluZGVwZW5kZW50bHkuXG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIHRoaXMuYXR0cmlidXRlS2V5c1thdHRyaWJ1dGVOYW1lXSA9IFN5bWJvbCgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpbmhlcml0cyh0aGlzLldyYXBwZXIsIFdyYXBwZXIpO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLmF0dHJpYnV0ZUtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG59XG5cblNlbWFudGljcy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbc2VtYW50aWNzIGZvciAnICsgdGhpcy5ncmFtbWFyLm5hbWUgKyAnXSc7XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cykge1xuICAgIHRoaXMuY2hlY2tBY3Rpb25EaWN0cygpO1xuICAgIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gdHJ1ZTtcbiAgfVxufTtcblxuLy8gQ2hlY2tzIHRoYXQgdGhlIGFjdGlvbiBkaWN0aW9uYXJpZXMgZm9yIGFsbCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGluIHRoaXMgc2VtYW50aWNzLFxuLy8gaW5jbHVkaW5nIHRoZSBvbmVzIHRoYXQgd2VyZSBpbmhlcml0ZWQgZnJvbSB0aGUgc3VwZXItc2VtYW50aWNzLCBhZ3JlZSB3aXRoIHRoZSBncmFtbWFyLlxuLy8gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBvbmUgb3IgbW9yZSBvZiB0aGVtIGRvZXNuJ3QuXG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHMgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm9wZXJhdGlvbnMpIHtcbiAgICB0aGlzLm9wZXJhdGlvbnNbbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG4gIH1cbiAgZm9yIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIHRoaXMuYXR0cmlidXRlc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgfVxufTtcblxudmFyIHByb3RvdHlwZUdyYW1tYXI7XG52YXIgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcztcblxuLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gbWFpbi5qcyBvbmNlIE9obSBoYXMgbG9hZGVkLlxuU2VtYW50aWNzLmluaXRQcm90b3R5cGVQYXJzZXIgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHByb3RvdHlwZUdyYW1tYXJTZW1hbnRpY3MgPSBncmFtbWFyLnNlbWFudGljcygpLmFkZE9wZXJhdGlvbigncGFyc2UnLCB7XG4gICAgQXR0cmlidXRlU2lnbmF0dXJlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgIGZvcm1hbHM6IFtdXG4gICAgICB9O1xuICAgIH0sXG4gICAgT3BlcmF0aW9uU2lnbmF0dXJlOiBmdW5jdGlvbihuYW1lLCBvcHRGb3JtYWxzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgIGZvcm1hbHM6IG9wdEZvcm1hbHMucGFyc2UoKVswXSB8fCBbXVxuICAgICAgfTtcbiAgICB9LFxuICAgIEZvcm1hbHM6IGZ1bmN0aW9uKG9wYXJlbiwgZnMsIGNwYXJlbikge1xuICAgICAgcmV0dXJuIGZzLmFzSXRlcmF0aW9uKCkucGFyc2UoKTtcbiAgICB9LFxuICAgIG5hbWU6IGZ1bmN0aW9uKGZpcnN0LCByZXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9XG4gIH0pO1xuICBwcm90b3R5cGVHcmFtbWFyID0gZ3JhbW1hcjtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSwgdHlwZSkge1xuICBpZiAoIXByb3RvdHlwZUdyYW1tYXIpIHtcbiAgICAvLyBUaGUgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBncmFtbWFyIHdvbid0IGJlIGF2YWlsYWJsZSB3aGlsZSBPaG0gaXMgbG9hZGluZyxcbiAgICAvLyBidXQgd2UgY2FuIGdldCBhd2F5IHRoZSBmb2xsb3dpbmcgc2ltcGxpZmljYXRpb24gYi9jIG5vbmUgb2YgdGhlIG9wZXJhdGlvbnNcbiAgICAvLyB0aGF0IGFyZSB1c2VkIHdoaWxlIGxvYWRpbmcgdGFrZSBhcmd1bWVudHMuXG4gICAgY29tbW9uLmFzc2VydChzaWduYXR1cmUuaW5kZXhPZignKCcpID09PSAtMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHNpZ25hdHVyZSxcbiAgICAgIGZvcm1hbHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHZhciByID0gcHJvdG90eXBlR3JhbW1hci5tYXRjaChcbiAgICAgIHNpZ25hdHVyZSxcbiAgICAgIHR5cGUgPT09ICdvcGVyYXRpb24nID8gJ09wZXJhdGlvblNpZ25hdHVyZScgOiAnQXR0cmlidXRlU2lnbmF0dXJlJyk7XG4gIGlmIChyLmZhaWxlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHIubWVzc2FnZSk7XG4gIH1cblxuICByZXR1cm4gcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyhyKS5wYXJzZSgpO1xufVxuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KSB7XG4gIHZhciB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcblxuICB2YXIgcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MgPSBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpO1xuICB2YXIgbmFtZSA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLm5hbWU7XG4gIHZhciBmb3JtYWxzID0gcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MuZm9ybWFscztcblxuICAvLyBUT0RPOiBjaGVjayB0aGF0IHRoZXJlIGFyZSBubyBkdXBsaWNhdGUgZm9ybWFsIGFyZ3VtZW50c1xuXG4gIHRoaXMuYXNzZXJ0TmV3TmFtZShuYW1lLCB0eXBlKTtcblxuICAvLyBDcmVhdGUgdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGZvciB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0aGF0IGNvbnRhaW5zIGEgYF9kZWZhdWx0YCBhY3Rpb25cbiAgLy8gd2hpY2ggZGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiBpdGVyYXRpb24sIHRlcm1pbmFsLCBhbmQgbm9uLXRlcm1pbmFsIG5vZGVzLi4uXG4gIHZhciByZWFsQWN0aW9uRGljdCA9IHtcbiAgICBfZGVmYXVsdDogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciB0aGlzVGhpbmcgPSB0aGlzLl9zZW1hbnRpY3NbdHlwZVBsdXJhbF1bbmFtZV07XG4gICAgICB2YXIgYXJncyA9IHRoaXNUaGluZy5mb3JtYWxzLm1hcChmdW5jdGlvbihmb3JtYWwpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuYXJnc1tmb3JtYWxdO1xuICAgICAgfSk7XG5cbiAgICAgIGlmICh0aGlzLmlzSXRlcmF0aW9uKCkpIHtcbiAgICAgICAgLy8gVGhpcyBDU1Qgbm9kZSBjb3JyZXNwb25kcyB0byBhbiBpdGVyYXRpb24gZXhwcmVzc2lvbiBpbiB0aGUgZ3JhbW1hciAoKiwgKywgb3IgPykuIFRoZVxuICAgICAgICAvLyBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIG1hcCB0aGlzIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgb3ZlciBhbGwgb2YgaXRzIGNoaWxkIG5vZGVzLlxuICAgICAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiBkb0l0LmFwcGx5KGNoaWxkLCBhcmdzKTsgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgQ1NUIG5vZGUgY29ycmVzcG9uZHMgdG8gYSBub24tdGVybWluYWwgaW4gdGhlIGdyYW1tYXIgKGUuZy4sIEFkZEV4cHIpLiBUaGUgZmFjdCB0aGF0XG4gICAgICAvLyB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoaXMgYWN0aW9uIGRpY3Rpb25hcnkgZG9lc24ndCBoYXZlIGFuIGFjdGlvbiBmb3IgdGhpcyBwYXJ0aWN1bGFyXG4gICAgICAvLyBub24tdGVybWluYWwgb3IgYSBnZW5lcmljIGBfbm9udGVybWluYWxgIGFjdGlvbi5cbiAgICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgLy8gQXMgYSBjb252ZW5pZW5jZSwgaWYgdGhpcyBub2RlIG9ubHkgaGFzIG9uZSBjaGlsZCwgd2UganVzdCByZXR1cm4gdGhlIHJlc3VsdCBvZlxuICAgICAgICAvLyBhcHBseWluZyB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgcmV0dXJuIGRvSXQuYXBwbHkoY2hpbGRyZW5bMF0sIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSB0aHJvdyBhbiBleGNlcHRpb24gdG8gbGV0IHRoZSBwcm9ncmFtbWVyIGtub3cgdGhhdCB3ZSBkb24ndCBrbm93IHdoYXRcbiAgICAgICAgLy8gdG8gZG8gd2l0aCB0aGlzIG5vZGUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICdNaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3IgJyArIHRoaXMuY3Rvck5hbWUgKyAnIGluICcgKyBuYW1lICsgJyAnICsgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuICAvLyAuLi4gYW5kIGFkZCBpbiB0aGUgYWN0aW9ucyBzdXBwbGllZCBieSB0aGUgcHJvZ3JhbW1lciwgd2hpY2ggbWF5IG92ZXJyaWRlIHNvbWUgb3IgYWxsIG9mIHRoZVxuICAvLyBkZWZhdWx0IG9uZXMuXG4gIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJlYWxBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgfSk7XG5cbiAgdmFyIGVudHJ5ID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgP1xuICAgICAgbmV3IE9wZXJhdGlvbihuYW1lLCBmb3JtYWxzLCByZWFsQWN0aW9uRGljdCkgOlxuICAgICAgbmV3IEF0dHJpYnV0ZShuYW1lLCByZWFsQWN0aW9uRGljdCk7XG5cbiAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gIGVudHJ5LmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSBlbnRyeTtcblxuICBmdW5jdGlvbiBkb0l0KCkge1xuICAgIC8vIERpc3BhdGNoIHRvIG1vc3Qgc3BlY2lmaWMgdmVyc2lvbiBvZiB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSAtLSBpdCBtYXkgaGF2ZSBiZWVuXG4gICAgLy8gb3ZlcnJpZGRlbiBieSBhIHN1Yi1zZW1hbnRpY3MuXG4gICAgdmFyIHRoaXNUaGluZyA9IHRoaXMuX3NlbWFudGljc1t0eXBlUGx1cmFsXVtuYW1lXTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGNhbGxlciBwYXNzZWQgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gdGhpc1RoaW5nLmZvcm1hbHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0ludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cyBwYXNzZWQgdG8gJyArIG5hbWUgKyAnICcgKyB0eXBlICsgJyAoZXhwZWN0ZWQgJyArXG4gICAgICAgICAgdGhpc1RoaW5nLmZvcm1hbHMubGVuZ3RoICsgJywgZ290ICcgKyBhcmd1bWVudHMubGVuZ3RoICsgJyknKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYW4gXCJhcmd1bWVudHMgb2JqZWN0XCIgZnJvbSB0aGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhpc1xuICAgIC8vIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZS5cbiAgICB2YXIgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBmb3JtYWwgPSB0aGlzVGhpbmcuZm9ybWFsc1tpZHhdO1xuICAgICAgYXJnc1tmb3JtYWxdID0gYXJndW1lbnRzW2lkeF07XG4gICAgfVxuXG4gICAgdmFyIG9sZEFyZ3MgPSB0aGlzLmFyZ3M7XG4gICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB2YXIgYW5zID0gdGhpc1RoaW5nLmV4ZWN1dGUodGhpcy5fc2VtYW50aWNzLCB0aGlzKTtcbiAgICB0aGlzLmFyZ3MgPSBvbGRBcmdzO1xuICAgIHJldHVybiBhbnM7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gJ29wZXJhdGlvbicpIHtcbiAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdID0gZG9JdDtcbiAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gJ1snICsgbmFtZSArICcgb3BlcmF0aW9uXSc7XG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5XcmFwcGVyLnByb3RvdHlwZSwgbmFtZSwge2dldDogZG9JdH0pO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5c1tuYW1lXSA9IFN5bWJvbCgpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgYWN0aW9uRGljdCkge1xuICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG5cbiAgLy8gTWFrZSBzdXJlIHRoYXQgYG5hbWVgIHJlYWxseSBpcyBqdXN0IGEgbmFtZSwgaS5lLiwgdGhhdCBpdCBkb2Vzbid0IGFsc28gY29udGFpbiBmb3JtYWxzLlxuICBwYXJzZVNpZ25hdHVyZShuYW1lLCAnYXR0cmlidXRlJyk7XG5cbiAgaWYgKCEodGhpcy5zdXBlciAmJiBuYW1lIGluIHRoaXMuc3VwZXJbdHlwZVBsdXJhbF0pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArXG4gICAgICAgIFwiJzogZGlkIG5vdCBpbmhlcml0IGFuIFwiICsgdHlwZSArICcgd2l0aCB0aGF0IG5hbWUnKTtcbiAgfVxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbdHlwZVBsdXJhbF0sIG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJyBhZ2FpblwiKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgd2hvc2UgYWN0aW9uRGljdCBkZWxlZ2F0ZXMgdG8gdGhlIHN1cGVyIG9wZXJhdGlvbiAvXG4gIC8vIGF0dHJpYnV0ZSdzIGFjdGlvbkRpY3QsIGFuZCB3aGljaCBoYXMgYWxsIHRoZSBrZXlzIGZyb20gYGluaGVyaXRlZEFjdGlvbkRpY3RgLlxuICB2YXIgaW5oZXJpdGVkRm9ybWFscyA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uZm9ybWFscztcbiAgdmFyIGluaGVyaXRlZEFjdGlvbkRpY3QgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmFjdGlvbkRpY3Q7XG4gIHZhciBuZXdBY3Rpb25EaWN0ID0gT2JqZWN0LmNyZWF0ZShpbmhlcml0ZWRBY3Rpb25EaWN0KTtcbiAgT2JqZWN0LmtleXMoYWN0aW9uRGljdCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgbmV3QWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gIH0pO1xuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSB0eXBlID09PSAnb3BlcmF0aW9uJyA/XG4gICAgICBuZXcgT3BlcmF0aW9uKG5hbWUsIGluaGVyaXRlZEZvcm1hbHMsIG5ld0FjdGlvbkRpY3QpIDpcbiAgICAgIG5ldyBBdHRyaWJ1dGUobmFtZSwgbmV3QWN0aW9uRGljdCk7XG5cbiAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFzc2VydE5ld05hbWUgPSBmdW5jdGlvbihuYW1lLCB0eXBlKSB7XG4gIGlmIChXcmFwcGVyLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiB0aGF0J3MgYSByZXNlcnZlZCBuYW1lXCIpO1xuICB9XG4gIGlmIChuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBvcGVyYXRpb24gd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gIH1cbiAgaWYgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IGFuIGF0dHJpYnV0ZSB3aXRoIHRoYXQgbmFtZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBhIHdyYXBwZXIgZm9yIHRoZSBnaXZlbiBDU1QgYG5vZGVgIGluIHRoaXMgc2VtYW50aWNzLlxuLy8gSWYgYG5vZGVgIGlzIGFscmVhZHkgYSB3cmFwcGVyLCByZXR1cm5zIGBub2RlYCBpdHNlbGYuICAvLyBUT0RPOiB3aHkgaXMgdGhpcyBuZWVkZWQ/XG5TZW1hbnRpY3MucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihub2RlKSB7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgdGhpcy5XcmFwcGVyID8gbm9kZSA6IG5ldyB0aGlzLldyYXBwZXIobm9kZSk7XG59O1xuXG4vLyBDcmVhdGVzIGEgbmV3IFNlbWFudGljcyBpbnN0YW5jZSBmb3IgYGdyYW1tYXJgLCBpbmhlcml0aW5nIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgZnJvbVxuLy8gYG9wdFN1cGVyU2VtYW50aWNzYCwgaWYgaXQgaXMgc3BlY2lmaWVkLiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHkgZm9yIHRoZSBuZXdcbi8vIFNlbWFudGljcyBpbnN0YW5jZS4gV2hlbiB0aGF0IGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBhIENTVCBub2RlIGFzIGFuIGFyZ3VtZW50LCBpdCByZXR1cm5zXG4vLyBhIHdyYXBwZXIgZm9yIHRoYXQgbm9kZSB3aGljaCBnaXZlcyBhY2Nlc3MgdG8gdGhlIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcHJvdmlkZWQgYnkgdGhpc1xuLy8gc2VtYW50aWNzLlxuU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyA9IGZ1bmN0aW9uKGdyYW1tYXIsIG9wdFN1cGVyU2VtYW50aWNzKSB7XG4gIHZhciBzID0gbmV3IFNlbWFudGljcyhcbiAgICAgIGdyYW1tYXIsXG4gICAgICBvcHRTdXBlclNlbWFudGljcyAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgICBvcHRTdXBlclNlbWFudGljcyA6XG4gICAgICAgICAgU2VtYW50aWNzLkJ1aWx0SW5TZW1hbnRpY3MuX2dldFNlbWFudGljcygpKTtcblxuICAvLyBUbyBlbmFibGUgY2xpZW50cyB0byBpbnZva2UgYSBzZW1hbnRpY3MgbGlrZSBhIGZ1bmN0aW9uLCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBwcm94eVxuICAvLyBmb3IgYHNgLCB3aGljaCBpcyB0aGUgcmVhbCBgU2VtYW50aWNzYCBpbnN0YW5jZS5cbiAgdmFyIHByb3h5ID0gZnVuY3Rpb24gQVNlbWFudGljcyhtYXRjaFJlc3VsdCkge1xuICAgIGlmICghKG1hdGNoUmVzdWx0IGluc3RhbmNlb2YgTWF0Y2hSZXN1bHQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICdTZW1hbnRpY3MgZXhwZWN0ZWQgYSBNYXRjaFJlc3VsdCwgYnV0IGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhtYXRjaFJlc3VsdCkpO1xuICAgIH1cbiAgICBpZiAoIW1hdGNoUmVzdWx0LnN1Y2NlZWRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICdjYW5ub3QgYXBwbHkgU2VtYW50aWNzIHRvICcgKyBtYXRjaFJlc3VsdC50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICB2YXIgY3N0ID0gbWF0Y2hSZXN1bHQuX2NzdDtcbiAgICBpZiAoY3N0LmdyYW1tYXIgIT09IGdyYW1tYXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIkNhbm5vdCB1c2UgYSBDU1Qgbm9kZSBjcmVhdGVkIGJ5IGdyYW1tYXIgJ1wiICsgY3N0LmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgXCInIHdpdGggYSBzZW1hbnRpY3MgZm9yICdcIiArIGdyYW1tYXIubmFtZSArIFwiJ1wiKTtcbiAgICB9XG4gICAgcmV0dXJuIHMud3JhcChjc3QpO1xuICB9O1xuXG4gIC8vIEZvcndhcmQgcHVibGljIG1ldGhvZHMgZnJvbSB0aGUgcHJveHkgdG8gdGhlIHNlbWFudGljcyBpbnN0YW5jZS5cbiAgcHJveHkuYWRkT3BlcmF0aW9uID0gZnVuY3Rpb24oc2lnbmF0dXJlLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZS5jYWxsKHMsICdvcGVyYXRpb24nLCBzaWduYXR1cmUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuZXh0ZW5kT3BlcmF0aW9uID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUuY2FsbChzLCAnb3BlcmF0aW9uJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZS5jYWxsKHMsICdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG4gIHByb3h5LmV4dGVuZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlLmNhbGwocywgJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuX2dldEFjdGlvbkRpY3QgPSBmdW5jdGlvbihvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUpIHtcbiAgICB2YXIgYWN0aW9uID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV0gfHwgcy5hdHRyaWJ1dGVzW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lICsgJ1wiIGlzIG5vdCBhIHZhbGlkIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgJyArXG4gICAgICAgICduYW1lIGluIHRoaXMgc2VtYW50aWNzIGZvciBcIicgKyBncmFtbWFyLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjdGlvbi5hY3Rpb25EaWN0O1xuICB9O1xuICBwcm94eS5fcmVtb3ZlQWN0aW9uID0gZnVuY3Rpb24ob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgdmFyIGFjdGlvbjtcbiAgICBpZiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lIGluIHMub3BlcmF0aW9ucykge1xuICAgICAgYWN0aW9uID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICBkZWxldGUgcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgaW4gcy5hdHRyaWJ1dGVzKSB7XG4gICAgICBhY3Rpb24gPSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgIGRlbGV0ZSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIGFjdGlvbjtcbiAgfTtcblxuICAvLyBNYWtlIHRoZSBwcm94eSdzIHRvU3RyaW5nKCkgd29yay5cbiAgcHJveHkudG9TdHJpbmcgPSBzLnRvU3RyaW5nLmJpbmQocyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgc2VtYW50aWNzIGZvciB0aGUgcHJveHkuXG4gIHByb3h5Ll9nZXRTZW1hbnRpY3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcztcbiAgfTtcblxuICByZXR1cm4gcHJveHk7XG59O1xuXG5TZW1hbnRpY3MuaW5pdEJ1aWx0SW5TZW1hbnRpY3MgPSBmdW5jdGlvbihidWlsdEluUnVsZXMpIHtcbiAgdmFyIGFjdGlvbnMgPSB7XG4gICAgZW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0aW9uKCk7XG4gICAgfSxcbiAgICBub25FbXB0eTogZnVuY3Rpb24oZmlyc3QsIF8sIHJlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZXJhdGlvbihbZmlyc3RdLmNvbmNhdChyZXN0LmNoaWxkcmVuKSk7XG4gICAgfVxuICB9O1xuXG4gIFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzID0gU2VtYW50aWNzXG4gICAgICAuY3JlYXRlU2VtYW50aWNzKGJ1aWx0SW5SdWxlcywgbnVsbClcbiAgICAgIC5hZGRPcGVyYXRpb24oJ2FzSXRlcmF0aW9uJywge1xuICAgICAgICBlbXB0eUxpc3RPZjogYWN0aW9ucy5lbXB0eSxcbiAgICAgICAgbm9uZW1wdHlMaXN0T2Y6IGFjdGlvbnMubm9uRW1wdHksXG4gICAgICAgIEVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBOb25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eVxuICAgICAgfSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBPcGVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQW4gT3BlcmF0aW9uIHJlcHJlc2VudHMgYSBmdW5jdGlvbiB0byBiZSBhcHBsaWVkIHRvIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgLS0gaXQncyB2ZXJ5XG4vLyBzaW1pbGFyIHRvIGEgVmlzaXRvciAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WaXNpdG9yX3BhdHRlcm4pLiBBbiBvcGVyYXRpb24gaXMgZXhlY3V0ZWQgYnlcbi8vIHJlY3Vyc2l2ZWx5IHdhbGtpbmcgdGhlIENTVCwgYW5kIGF0IGVhY2ggbm9kZSwgaW52b2tpbmcgdGhlIG1hdGNoaW5nIHNlbWFudGljIGFjdGlvbiBmcm9tXG4vLyBgYWN0aW9uRGljdGAuIFNlZSBgT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlYCBmb3IgZGV0YWlscyBvZiBob3cgYSBDU1Qgbm9kZSdzIG1hdGNoaW5nIHNlbWFudGljXG4vLyBhY3Rpb24gaXMgZm91bmQuXG5mdW5jdGlvbiBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgYWN0aW9uRGljdCkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmZvcm1hbHMgPSBmb3JtYWxzO1xuICB0aGlzLmFjdGlvbkRpY3QgPSBhY3Rpb25EaWN0O1xufVxuXG5PcGVyYXRpb24ucHJvdG90eXBlLnR5cGVOYW1lID0gJ29wZXJhdGlvbic7XG5cbk9wZXJhdGlvbi5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0ID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICBncmFtbWFyLl9jaGVja1RvcERvd25BY3Rpb25EaWN0KHRoaXMudHlwZU5hbWUsIHRoaXMubmFtZSwgdGhpcy5hY3Rpb25EaWN0KTtcbn07XG5cbi8vIEV4ZWN1dGUgdGhpcyBvcGVyYXRpb24gb24gdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCBgbm9kZVdyYXBwZXJgIGluIHRoZSBjb250ZXh0IG9mIHRoZSBnaXZlblxuLy8gU2VtYW50aWNzIGluc3RhbmNlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAvLyBMb29rIGZvciBhIHNlbWFudGljIGFjdGlvbiB3aG9zZSBuYW1lIG1hdGNoZXMgdGhlIG5vZGUncyBjb25zdHJ1Y3RvciBuYW1lLCB3aGljaCBpcyBlaXRoZXIgdGhlXG4gIC8vIG5hbWUgb2YgYSBydWxlIGluIHRoZSBncmFtbWFyLCBvciAnX3Rlcm1pbmFsJyAoZm9yIGEgdGVybWluYWwgbm9kZSksIG9yICdfaXRlcicgKGZvciBhblxuICAvLyBpdGVyYXRpb24gbm9kZSkuIEluIHRoZSBsYXR0ZXIgY2FzZSwgdGhlIGFjdGlvbiBmdW5jdGlvbiByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudCwgd2hpY2ggaXNcbiAgLy8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBDU1Qgbm9kZS5cbiAgdmFyIGFjdGlvbkZuID0gdGhpcy5hY3Rpb25EaWN0W25vZGVXcmFwcGVyLl9ub2RlLmN0b3JOYW1lXTtcbiAgaWYgKGFjdGlvbkZuKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9BY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG5vZGVXcmFwcGVyLmlzSXRlcmF0aW9uKCkpO1xuICB9XG5cbiAgLy8gVGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGRvZXMgbm90IGNvbnRhaW4gYSBzZW1hbnRpYyBhY3Rpb24gZm9yIHRoaXMgc3BlY2lmaWMgdHlwZSBvZiBub2RlLlxuICAvLyBJZiB0aGlzIGlzIGEgbm9udGVybWluYWwgbm9kZSBhbmQgdGhlIHByb2dyYW1tZXIgaGFzIHByb3ZpZGVkIGEgYF9ub250ZXJtaW5hbGAgc2VtYW50aWNcbiAgLy8gYWN0aW9uLCB3ZSBpbnZva2UgaXQ6XG4gIGlmIChub2RlV3JhcHBlci5pc05vbnRlcm1pbmFsKCkpIHtcbiAgICBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdC5fbm9udGVybWluYWw7XG4gICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25GbiwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCB3ZSBpbnZva2UgdGhlICdfZGVmYXVsdCcgc2VtYW50aWMgYWN0aW9uLlxuICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCB0aGlzLmFjdGlvbkRpY3QuX2RlZmF1bHQsIHRydWUpO1xufTtcblxuLy8gSW52b2tlIGBhY3Rpb25GbmAgb24gdGhlIENTVCBub2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gYG5vZGVXcmFwcGVyYCwgaW4gdGhlIGNvbnRleHQgb2Zcbi8vIGBzZW1hbnRpY3NgLiBJZiBgb3B0UGFzc0NoaWxkcmVuQXNBcnJheWAgaXMgdHJ1dGh5LCBgYWN0aW9uRm5gIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBzaW5nbGVcbi8vIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBhcnJheSBvZiB3cmFwcGVycy4gT3RoZXJ3aXNlLCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBgYWN0aW9uRm5gIHdpbGxcbi8vIGJlIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhlIENTVCBub2RlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5kb0FjdGlvbiA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5KSB7XG4gIHJldHVybiBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5ID9cbiAgICAgIGFjdGlvbkZuLmNhbGwobm9kZVdyYXBwZXIsIG5vZGVXcmFwcGVyLl9jaGlsZHJlbigpKSA6XG4gICAgICBhY3Rpb25Gbi5hcHBseShub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEF0dHJpYnV0ZXMgYXJlIE9wZXJhdGlvbnMgd2hvc2UgcmVzdWx0cyBhcmUgbWVtb2l6ZWQuIFRoaXMgbWVhbnMgdGhhdCwgZm9yIGFueSBnaXZlbiBzZW1hbnRpY3MsXG4vLyB0aGUgc2VtYW50aWMgYWN0aW9uIGZvciBhIENTVCBub2RlIHdpbGwgYmUgaW52b2tlZCBubyBtb3JlIHRoYW4gb25jZS5cbmZ1bmN0aW9uIEF0dHJpYnV0ZShuYW1lLCBhY3Rpb25EaWN0KSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuZm9ybWFscyA9IFtdO1xuICB0aGlzLmFjdGlvbkRpY3QgPSBhY3Rpb25EaWN0O1xufVxuaW5oZXJpdHMoQXR0cmlidXRlLCBPcGVyYXRpb24pO1xuXG5BdHRyaWJ1dGUucHJvdG90eXBlLnR5cGVOYW1lID0gJ2F0dHJpYnV0ZSc7XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgdmFyIG5vZGUgPSBub2RlV3JhcHBlci5fbm9kZTtcbiAgdmFyIGtleSA9IHNlbWFudGljcy5hdHRyaWJ1dGVLZXlzW3RoaXMubmFtZV07XG4gIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBpcyBhIHN1cGVyLXNlbmQgLS0gaXNuJ3QgSlMgYmVhdXRpZnVsPyA6L1xuICAgIG5vZGVba2V5XSA9IE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMsIHNlbWFudGljcywgbm9kZVdyYXBwZXIpO1xuICB9XG4gIHJldHVybiBub2RlW2tleV07XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTZW1hbnRpY3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgUG9zSW5mbyA9IHJlcXVpcmUoJy4vUG9zSW5mbycpO1xudmFyIFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04gPSAwO1xudmFyIFJNX1JJR0hUTU9TVF9GQUlMVVJFUyA9IDE7XG5cbnZhciBhcHBseVNwYWNlcyA9IG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlcycpO1xuXG5mdW5jdGlvbiBTdGF0ZShncmFtbWFyLCBpbnB1dCwgb3B0cykge1xuICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICB0aGlzLnN0YXJ0RXhwciA9IHRoaXMuX2dldFN0YXJ0RXhwcihncmFtbWFyLCBvcHRzLnN0YXJ0QXBwbGljYXRpb24pO1xuICB0aGlzLm9yaWdJbnB1dFN0cmVhbSA9IHRoaXMuc3RhcnRFeHByLm5ld0lucHV0U3RyZWFtRm9yKGlucHV0LCB0aGlzLmdyYW1tYXIpO1xuICB0aGlzLnRyYWNpbmdFbmFibGVkID0gb3B0cy50cmFjZSB8fCBmYWxzZTtcbiAgdGhpcy5tYXRjaE5vZGVzID0gb3B0cy5tYXRjaE5vZGVzIHx8IGZhbHNlO1xuICB0aGlzLmluaXQoUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04pO1xufVxuXG5TdGF0ZS5wcm90b3R5cGUgPSB7XG4gIGluaXQ6IGZ1bmN0aW9uKHJlY29yZGluZ01vZGUpIHtcbiAgICB0aGlzLmJpbmRpbmdzID0gW107XG5cbiAgICB0aGlzLmlucHV0U3RyZWFtU3RhY2sgPSBbXTtcbiAgICB0aGlzLnBvc0luZm9zU3RhY2sgPSBbXTtcbiAgICB0aGlzLnB1c2hJbnB1dFN0cmVhbSh0aGlzLm9yaWdJbnB1dFN0cmVhbSk7XG5cbiAgICB0aGlzLmFwcGxpY2F0aW9uU3RhY2sgPSBbXTtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sgPSBbZmFsc2VdO1xuXG4gICAgdGhpcy5yZWNvcmRpbmdNb2RlID0gcmVjb3JkaW5nTW9kZTtcbiAgICBpZiAocmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04pIHtcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gICAgfSBlbHNlIGlmIChyZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRVMpIHtcbiAgICAgIC8vIFdlIGFsd2F5cyBydW4gaW4gKnJpZ2h0bW9zdCBmYWlsdXJlIHBvc2l0aW9uKiByZWNvcmRpbmcgbW9kZSBiZWZvcmUgcnVubmluZyBpblxuICAgICAgLy8gKnJpZ2h0bW9zdCBmYWlsdXJlcyogcmVjb3JkaW5nIG1vZGUuIEFuZCBzaW5jZSB0aGUgdHJhY2VzIGdlbmVyYXRlZCBieSBlYWNoIG9mXG4gICAgICAvLyB0aGVzZSBwYXNzZXMgd291bGQgYmUgaWRlbnRpY2FsLCB0aGVyZSdzIG5vIG5lZWQgdG8gcmVjb3JkIGl0IG5vdyBpZiB3ZSBoYXZlXG4gICAgICAvLyBhbHJlYWR5IHJlY29yZGVkIGl0IGluIHRoZSBmaXJzdCBwYXNzLlxuICAgICAgdGhpcy50cmFjaW5nRW5hYmxlZCA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgcmVjb3JkaW5nIG1vZGU6ICcgKyByZWNvcmRpbmdNb2RlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1RyYWNpbmcoKSkge1xuICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIH1cbiAgfSxcblxuICBlbnRlcjogZnVuY3Rpb24oYXBwKSB7XG4gICAgdGhpcy5hcHBsaWNhdGlvblN0YWNrLnB1c2goYXBwKTtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaChmYWxzZSk7XG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBsaWNhdGlvblN0YWNrLnBvcCgpO1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgfSxcblxuICBlbnRlckxleGlmaWVkQ29udGV4dDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnB1c2godHJ1ZSk7XG4gIH0sXG5cbiAgZXhpdExleGlmaWVkQ29udGV4dDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnBvcCgpO1xuICB9LFxuXG4gIGN1cnJlbnRBcHBsaWNhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25TdGFja1t0aGlzLmFwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgaW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgY3VycmVudEFwcGxpY2F0aW9uID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICBpZiAoY3VycmVudEFwcGxpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gY3VycmVudEFwcGxpY2F0aW9uLmlzU3ludGFjdGljKCkgJiYgIXRoaXMuaW5MZXhpZmllZENvbnRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHRvcC1sZXZlbCBjb250ZXh0IGlzIHN5bnRhY3RpYyBpZiB0aGUgc3RhcnQgYXBwbGljYXRpb24gaXMuXG4gICAgICByZXR1cm4gdGhpcy5zdGFydEV4cHIuZmFjdG9yc1swXS5pc1N5bnRhY3RpYygpO1xuICAgIH1cbiAgfSxcblxuICBpbkxleGlmaWVkQ29udGV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFja1t0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgc2tpcFNwYWNlczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9yaWdGYWlsdXJlc0luZm8gPSB0aGlzLmdldEZhaWx1cmVzSW5mbygpO1xuICAgIHRoaXMuZXZhbChhcHBseVNwYWNlcyk7XG4gICAgdGhpcy5iaW5kaW5ncy5wb3AoKTtcbiAgICB0aGlzLnJlc3RvcmVGYWlsdXJlc0luZm8ob3JpZ0ZhaWx1cmVzSW5mbyk7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRTdHJlYW0ucG9zO1xuICB9LFxuXG4gIHNraXBTcGFjZXNJZkluU3ludGFjdGljQ29udGV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5TeW50YWN0aWNDb250ZXh0KCkgP1xuICAgICAgICB0aGlzLnNraXBTcGFjZXMoKSA6XG4gICAgICAgIHRoaXMuaW5wdXRTdHJlYW0ucG9zO1xuICB9LFxuXG4gIG1heWJlU2tpcFNwYWNlc0JlZm9yZTogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmIChleHByIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5ICYmIGV4cHIuaXNTeW50YWN0aWMoKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2tpcFNwYWNlcygpO1xuICAgIH0gZWxzZSBpZiAoZXhwci5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlKCkgJiYgZXhwciAhPT0gYXBwbHlTcGFjZXMpIHtcbiAgICAgIHJldHVybiB0aGlzLnNraXBTcGFjZXNJZkluU3ludGFjdGljQ29udGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gICAgfVxuICB9LFxuXG4gIHRydW5jYXRlQmluZGluZ3M6IGZ1bmN0aW9uKG5ld0xlbmd0aCkge1xuICAgIC8vIFRPRE86IGlzIHRoaXMgcmVhbGx5IGZhc3RlciB0aGFuIHNldHRpbmcgdGhlIGBsZW5ndGhgIHByb3BlcnR5P1xuICAgIHdoaWxlICh0aGlzLmJpbmRpbmdzLmxlbmd0aCA+IG5ld0xlbmd0aCkge1xuICAgICAgdGhpcy5iaW5kaW5ncy5wb3AoKTtcbiAgICB9XG4gIH0sXG5cbiAgcHVzaElucHV0U3RyZWFtOiBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICAgIHRoaXMuaW5wdXRTdHJlYW1TdGFjay5wdXNoKHRoaXMuaW5wdXRTdHJlYW0pO1xuICAgIHRoaXMucG9zSW5mb3NTdGFjay5wdXNoKHRoaXMucG9zSW5mb3MpO1xuICAgIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgICB0aGlzLnBvc0luZm9zID0gW107XG4gIH0sXG5cbiAgcG9wSW5wdXRTdHJlYW06IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5wdXRTdHJlYW0gPSB0aGlzLmlucHV0U3RyZWFtU3RhY2sucG9wKCk7XG4gICAgdGhpcy5wb3NJbmZvcyA9IHRoaXMucG9zSW5mb3NTdGFjay5wb3AoKTtcbiAgfSxcblxuICBnZXRDdXJyZW50UG9zSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0UG9zSW5mbyh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gIH0sXG5cbiAgZ2V0UG9zSW5mbzogZnVuY3Rpb24ocG9zKSB7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW3Bvc107XG4gICAgcmV0dXJuIHBvc0luZm8gfHwgKHRoaXMucG9zSW5mb3NbcG9zXSA9IG5ldyBQb3NJbmZvKHRoaXMpKTtcbiAgfSxcblxuICBwcm9jZXNzRmFpbHVyZTogZnVuY3Rpb24ocG9zLCBleHByKSB7XG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04pIHtcbiAgICAgIGlmIChwb3MgPiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbikge1xuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHBvcztcbiAgICAgIH1cbiAgICB9IGVsc2UgLyogaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVTKSAqL1xuICAgICAgICBpZiAocG9zID09PSB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbikge1xuICAgICAgICAgIC8vIFdlJ3JlIG9ubHkgaW50ZXJlc3RlZCBpbiBmYWlsdXJlcyBhdCB0aGUgcmlnaHRtb3N0IGZhaWx1cmUgcG9zaXRpb24gdGhhdCBoYXZlbid0XG4gICAgICAgICAgLy8gYWxyZWFkeSBiZWVuIHJlY29yZGVkLlxuXG4gICAgICAgICAgdGhpcy5hZGRSaWdodG1vc3RGYWlsdXJlKGV4cHIudG9GYWlsdXJlKHRoaXMuZ3JhbW1hciksIGZhbHNlKTtcbiAgICAgICAgfVxuICB9LFxuXG4gIGVuc3VyZVJpZ2h0bW9zdEZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmlnaHRtb3N0RmFpbHVyZXMpIHtcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbiAgfSxcblxuICBhZGRSaWdodG1vc3RGYWlsdXJlOiBmdW5jdGlvbihmYWlsdXJlLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgdGhpcy5lbnN1cmVSaWdodG1vc3RGYWlsdXJlcygpO1xuICAgIHZhciBrZXkgPSBmYWlsdXJlLnRvS2V5KCk7XG4gICAgaWYgKCF0aGlzLnJpZ2h0bW9zdEZhaWx1cmVzW2tleV0pIHtcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZXNba2V5XSA9IHNob3VsZENsb25lSWZOZXcgPyBmYWlsdXJlLmNsb25lKCkgOiBmYWlsdXJlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yaWdodG1vc3RGYWlsdXJlc1trZXldLmlzRmx1ZmZ5KCkgJiYgIWZhaWx1cmUuaXNGbHVmZnkoKSkge1xuICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlc1trZXldLmNsZWFyRmx1ZmZ5KCk7XG4gICAgfVxuICB9LFxuXG4gIGFkZFJpZ2h0bW9zdEZhaWx1cmVzOiBmdW5jdGlvbihmYWlsdXJlcywgc2hvdWxkQ2xvbmVJZk5ldykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyhmYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHNlbGYuYWRkUmlnaHRtb3N0RmFpbHVyZShmYWlsdXJlc1trZXldLCBzaG91bGRDbG9uZUlmTmV3KTtcbiAgICB9KTtcbiAgfSxcblxuICBjbG9uZVJpZ2h0bW9zdEZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmlnaHRtb3N0RmFpbHVyZXMpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIGFucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMucmlnaHRtb3N0RmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBhbnNba2V5XSA9IHNlbGYucmlnaHRtb3N0RmFpbHVyZXNba2V5XS5jbG9uZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiBhbnM7XG4gIH0sXG5cbiAgZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb247XG4gIH0sXG5cbiAgZ2V0RmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnJlY29yZGluZ01vZGUgPT09IFJNX1JJR0hUTU9TVF9GQUlMVVJFX1BPU0lUSU9OKSB7XG4gICAgICAvLyBSZXdpbmQsIHRoZW4gdHJ5IHRvIG1hdGNoIHRoZSBpbnB1dCBhZ2FpbiwgcmVjb3JkaW5nIGZhaWx1cmVzLlxuICAgICAgdGhpcy5pbml0KFJNX1JJR0hUTU9TVF9GQUlMVVJFUyk7XG4gICAgICB0aGlzLmV2YWxGcm9tU3RhcnQoKTtcbiAgICB9XG5cbiAgICB0aGlzLmVuc3VyZVJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVzKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gc2VsZi5yaWdodG1vc3RGYWlsdXJlc1trZXldO1xuICAgIH0pO1xuICB9LFxuXG4gIC8vIFJldHVybnMgdGhlIG1lbW9pemVkIHRyYWNlIGVudHJ5IGZvciBgZXhwcmAgYXQgYHBvc2AsIGlmIG9uZSBleGlzdHMsIGBudWxsYCBvdGhlcndpc2UuXG4gIGdldE1lbW9pemVkVHJhY2VFbnRyeTogZnVuY3Rpb24ocG9zLCBleHByKSB7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLnBvc0luZm9zW3Bvc107XG4gICAgaWYgKHBvc0luZm8gJiYgZXhwci5ydWxlTmFtZSkge1xuICAgICAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bZXhwci50b01lbW9LZXkoKV07XG4gICAgICBpZiAobWVtb1JlYykge1xuICAgICAgICByZXR1cm4gbWVtb1JlYy50cmFjZUVudHJ5O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IHRyYWNlIGVudHJ5LCB3aXRoIHRoZSBjdXJyZW50bHkgYWN0aXZlIHRyYWNlIGFycmF5IGFzIGl0cyBjaGlsZHJlbi5cbiAgZ2V0VHJhY2VFbnRyeTogZnVuY3Rpb24ocG9zLCBleHByLCBzdWNjZWVkZWQsIGJpbmRpbmdzKSB7XG4gICAgdmFyIG1lbW9FbnRyeSA9IHRoaXMuZ2V0TWVtb2l6ZWRUcmFjZUVudHJ5KHBvcywgZXhwcik7XG4gICAgcmV0dXJuIG1lbW9FbnRyeSA/IG1lbW9FbnRyeS5jbG9uZVdpdGhFeHByKGV4cHIpXG4gICAgICAgICAgICAgICAgICAgICA6IG5ldyBUcmFjZSh0aGlzLmlucHV0U3RyZWFtLCBwb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MsIHRoaXMudHJhY2UpO1xuICB9LFxuXG4gIGlzVHJhY2luZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2luZ0VuYWJsZWQ7XG4gIH0sXG5cbiAgdXNlTWVtb2l6ZWRSZXN1bHQ6IGZ1bmN0aW9uKG1lbW9SZWMpIHtcbiAgICBpZiAodGhpcy5pc1RyYWNpbmcoKSkge1xuICAgICAgdGhpcy50cmFjZS5wdXNoKG1lbW9SZWMudHJhY2VFbnRyeSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVTICYmIG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uKSB7XG4gICAgICB0aGlzLmFkZFJpZ2h0bW9zdEZhaWx1cmVzKG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uLCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAobWVtb1JlYy52YWx1ZSkge1xuICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgPSBtZW1vUmVjLnBvcztcbiAgICAgIHRoaXMuYmluZGluZ3MucHVzaChtZW1vUmVjLnZhbHVlKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLy8gRXZhbHVhdGUgYGV4cHJgIGFuZCByZXR1cm4gYHRydWVgIGlmIGl0IHN1Y2NlZWRlZCwgYGZhbHNlYCBvdGhlcndpc2UuIE9uIHN1Y2Nlc3MsIGBiaW5kaW5nc2BcbiAgLy8gd2lsbCBoYXZlIGBleHByLmdldEFyaXR5KClgIG1vcmUgZWxlbWVudHMgdGhhbiBiZWZvcmUsIGFuZCB0aGUgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gbWF5XG4gIC8vIGhhdmUgaW5jcmVhc2VkLiBPbiBmYWlsdXJlLCBgYmluZGluZ3NgIGFuZCBwb3NpdGlvbiB3aWxsIGJlIHVuY2hhbmdlZC5cbiAgZXZhbDogZnVuY3Rpb24oZXhwcikge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHRoaXMuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdOdW1CaW5kaW5ncyA9IHRoaXMuYmluZGluZ3MubGVuZ3RoO1xuXG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVTKSB7XG4gICAgICB2YXIgb3JpZ0ZhaWx1cmVzID0gdGhpcy5yaWdodG1vc3RGYWlsdXJlcztcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZXMgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIG1lbW9Qb3MgPSB0aGlzLm1heWJlU2tpcFNwYWNlc0JlZm9yZShleHByKTtcblxuICAgIGlmICh0aGlzLmlzVHJhY2luZygpKSB7XG4gICAgICB2YXIgb3JpZ1RyYWNlID0gdGhpcy50cmFjZTtcbiAgICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICB9XG5cbiAgICAvLyBEbyB0aGUgYWN0dWFsIGV2YWx1YXRpb24uXG4gICAgdmFyIGFucyA9IGV4cHIuZXZhbCh0aGlzKTtcblxuICAgIGlmICh0aGlzLmlzVHJhY2luZygpKSB7XG4gICAgICB2YXIgYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLnNsaWNlKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgICB2YXIgdHJhY2VFbnRyeSA9IHRoaXMuZ2V0VHJhY2VFbnRyeShtZW1vUG9zLCBleHByLCBhbnMsIGJpbmRpbmdzKTtcbiAgICAgIHRyYWNlRW50cnkuaXNJbXBsaWNpdFNwYWNlcyA9IGV4cHIgPT09IGFwcGx5U3BhY2VzO1xuICAgICAgdHJhY2VFbnRyeS5pc1Jvb3ROb2RlID0gZXhwciA9PT0gdGhpcy5zdGFydEV4cHI7XG4gICAgICBvcmlnVHJhY2UucHVzaCh0cmFjZUVudHJ5KTtcbiAgICAgIHRoaXMudHJhY2UgPSBvcmlnVHJhY2U7XG4gICAgfVxuXG4gICAgaWYgKGFucykge1xuICAgICAgaWYgKHRoaXMucmlnaHRtb3N0RmFpbHVyZXMgJiZcbiAgICAgICAgKGlucHV0U3RyZWFtLnBvcyA9PT0gdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gfHxcbiAgICAgICAgIHRoaXMuc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0KCkgPT09IHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKSkge1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMucmlnaHRtb3N0RmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgc2VsZi5yaWdodG1vc3RGYWlsdXJlc1trZXldLm1ha2VGbHVmZnkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBwb3NpdGlvbiBhbmQgdGhlIGJpbmRpbmdzLlxuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgIHRoaXMudHJ1bmNhdGVCaW5kaW5ncyhvcmlnTnVtQmluZGluZ3MpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlY29yZGluZ01vZGUgPT09IFJNX1JJR0hUTU9TVF9GQUlMVVJFUyAmJiBvcmlnRmFpbHVyZXMpIHtcbiAgICAgIHRoaXMuYWRkUmlnaHRtb3N0RmFpbHVyZXMob3JpZ0ZhaWx1cmVzLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFucztcbiAgfSxcblxuICAvLyBSZXR1cm4gdGhlIHN0YXJ0aW5nIGV4cHJlc3Npb24gZm9yIHRoaXMgZ3JhbW1hci4gSWYgYG9wdFN0YXJ0QXBwbGljYXRpb25gIGlzIHNwZWNpZmllZCwgaXRcbiAgLy8gaXMgYSBzdHJpbmcgZXhwcmVzc2luZyBhIHJ1bGUgYXBwbGljYXRpb24gaW4gdGhlIGdyYW1tYXIuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBncmFtbWFyJ3NcbiAgLy8gZGVmYXVsdCBzdGFydCBydWxlIHdpbGwgYmUgdXNlZC5cbiAgX2dldFN0YXJ0RXhwcjogZnVuY3Rpb24oZ3JhbW1hciwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgIHZhciBhcHBsaWNhdGlvblN0ciA9IG9wdFN0YXJ0QXBwbGljYXRpb24gfHwgZ3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICAgIGlmICghYXBwbGljYXRpb25TdHIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBzdGFydCBydWxlIGFyZ3VtZW50IC0tIHRoZSBncmFtbWFyIGhhcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUuJyk7XG4gICAgfVxuXG4gICAgdmFyIHN0YXJ0QXBwID0gZ3JhbW1hci5wYXJzZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uU3RyKTtcbiAgICByZXR1cm4gbmV3IHBleHBycy5TZXEoW3N0YXJ0QXBwLCBwZXhwcnMuZW5kXSk7XG4gIH0sXG5cbiAgZXZhbEZyb21TdGFydDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5ldmFsKHRoaXMuc3RhcnRFeHByKTtcbiAgfSxcblxuICBnZXRGYWlsdXJlc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnJlY29yZGluZ01vZGUgPT09IFJNX1JJR0hUTU9TVF9GQUlMVVJFX1BPU0lUSU9OKSB7XG4gICAgICByZXR1cm4gdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb247XG4gICAgfSBlbHNlIC8qIGlmICh0aGlzLnJlY29yZGluZ01vZGUgPT09IFJNX1JJR0hUTU9TVF9GQUlMVVJFUykgKi8ge1xuICAgICAgcmV0dXJuIHRoaXMucmlnaHRtb3N0RmFpbHVyZXM7XG4gICAgfVxuICB9LFxuXG4gIHJlc3RvcmVGYWlsdXJlc0luZm86IGZ1bmN0aW9uKGZhaWx1cmVzSW5mbykge1xuICAgIGlmICh0aGlzLnJlY29yZGluZ01vZGUgPT09IFJNX1JJR0hUTU9TVF9GQUlMVVJFX1BPU0lUSU9OKSB7XG4gICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IGZhaWx1cmVzSW5mbztcbiAgICB9IGVsc2UgLyogaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVTKSAqLyB7XG4gICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVzID0gZmFpbHVyZXNJbmZvO1xuICAgIH1cbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGU7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGFyZSB1c2VkIGluIHRoZSBgdG9TdHJpbmdgIG91dHB1dC5cbnZhciBCQUxMT1RfWCA9ICdcXHUyNzE3JztcbnZhciBDSEVDS19NQVJLID0gJ1xcdTI3MTMnO1xudmFyIERPVF9PUEVSQVRPUiA9ICdcXHUyMkM1JztcbnZhciBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyA9ICdcXHUyMUQyJztcbnZhciBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTiA9ICdcXHUyNDA5JztcbnZhciBTWU1CT0xfRk9SX0xJTkVfRkVFRCA9ICdcXHUyNDBBJztcbnZhciBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTiA9ICdcXHUyNDBEJztcblxuZnVuY3Rpb24gc3BhY2VzKG4pIHtcbiAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBuKS5qb2luKCcnKTtcbn1cblxuLy8gUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcG9ydGlvbiBvZiBgaW5wdXRTdHJlYW1gIGF0IG9mZnNldCBgcG9zYC5cbi8vIFRoZSByZXN1bHQgd2lsbCBjb250YWluIGV4YWN0bHkgYGxlbmAgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIGdldElucHV0RXhjZXJwdChpbnB1dFN0cmVhbSwgcG9zLCBsZW4pIHtcbiAgdmFyIGV4Y2VycHQgPSBhc0VzY2FwZWRTdHJpbmcoaW5wdXRTdHJlYW0uc291cmNlU2xpY2UocG9zLCBwb3MgKyBsZW4pKTtcblxuICAvLyBQYWQgdGhlIG91dHB1dCBpZiBuZWNlc3NhcnkuXG4gIGlmIChleGNlcnB0Lmxlbmd0aCA8IGxlbikge1xuICAgIHJldHVybiBleGNlcnB0ICsgY29tbW9uLnJlcGVhdCgnICcsIGxlbiAtIGV4Y2VycHQubGVuZ3RoKS5qb2luKCcnKTtcbiAgfVxuICByZXR1cm4gZXhjZXJwdDtcbn1cblxuZnVuY3Rpb24gYXNFc2NhcGVkU3RyaW5nKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBSZXBsYWNlIG5vbi1wcmludGFibGUgY2hhcmFjdGVycyB3aXRoIHZpc2libGUgc3ltYm9scy5cbiAgICByZXR1cm4gb2JqXG4gICAgICAgIC5yZXBsYWNlKC8gL2csIERPVF9PUEVSQVRPUilcbiAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTilcbiAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBTWU1CT0xfRk9SX0xJTkVfRkVFRClcbiAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTik7XG4gIH1cbiAgcmV0dXJuIFN0cmluZyhvYmopO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBUcmFjZSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBUcmFjZShpbnB1dFN0cmVhbSwgcG9zLCBleHByLCBzdWNjZWVkZWQsIGJpbmRpbmdzLCBvcHRDaGlsZHJlbikge1xuICB0aGlzLmlucHV0U3RyZWFtID0gaW5wdXRTdHJlYW07XG4gIHRoaXMucG9zID0gcG9zO1xuICB0aGlzLmludGVydmFsID0gbmV3IEludGVydmFsKGlucHV0U3RyZWFtLCBwb3MsIGlucHV0U3RyZWFtLnBvcyk7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG4gIHRoaXMuc3VjY2VlZGVkID0gc3VjY2VlZGVkO1xuICB0aGlzLmJpbmRpbmdzID0gYmluZGluZ3M7XG4gIHRoaXMuY2hpbGRyZW4gPSBvcHRDaGlsZHJlbiB8fCBbXTtcblxuICB0aGlzLmlzSW1wbGljaXRTcGFjZXMgPSBmYWxzZTtcbiAgdGhpcy5pc0xlZnRSZWN1cnNpdmUgPSBmYWxzZTtcbiAgdGhpcy5pc01lbW9pemVkID0gZmFsc2U7XG4gIHRoaXMuaXNSb290Tm9kZSA9IGZhbHNlO1xufVxuXG4vLyBBIHZhbHVlIHRoYXQgY2FuIGJlIHJldHVybmVkIGZyb20gdmlzaXRvciBmdW5jdGlvbnMgdG8gaW5kaWNhdGUgdGhhdCBhXG4vLyBub2RlIHNob3VsZCBub3QgYmUgcmVjdXJzZWQgaW50by5cblRyYWNlLnByb3RvdHlwZS5TS0lQID0ge307XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFjZS5wcm90b3R5cGUsICdkaXNwbGF5U3RyaW5nJywge1xuICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5leHByLnRvRGlzcGxheVN0cmluZygpOyB9XG59KTtcblxuVHJhY2UucHJvdG90eXBlLmNsb25lV2l0aEV4cHIgPSBmdW5jdGlvbihleHByKSB7XG4gIHZhciBhbnMgPSBuZXcgVHJhY2UoXG4gICAgICB0aGlzLmlucHV0U3RyZWFtLCB0aGlzLnBvcywgZXhwciwgdGhpcy5zdWNjZWVkZWQsIHRoaXMuYmluZGluZ3MsIHRoaXMuY2hpbGRyZW4pO1xuICBhbnMuaXNMZWZ0UmVjdXJzaXZlID0gdGhpcy5pc0xlZnRSZWN1cnNpdmU7XG4gIGFucy5pc1Jvb3ROb2RlID0gdGhpcy5pc1Jvb3ROb2RlO1xuICBhbnMuaXNNZW1vaXplZCA9IHRydWU7XG4gIHJldHVybiBhbnM7XG59O1xuXG4vLyBSZWN1cnNpdmVseSB0cmF2ZXJzZSB0aGlzIHRyYWNlIG5vZGUgYW5kIGFsbCBpdHMgZGVzY2VuZGVudHMsIGNhbGxpbmcgYSB2aXNpdG9yIGZ1bmN0aW9uXG4vLyBmb3IgZWFjaCBub2RlIHRoYXQgaXMgdmlzaXRlZC4gSWYgYHZpc3Rvck9iak9yRm5gIGlzIGFuIG9iamVjdCwgdGhlbiBpdHMgJ2VudGVyJyBwcm9wZXJ0eVxuLy8gaXMgYSBmdW5jdGlvbiB0byBjYWxsIGJlZm9yZSB2aXNpdGluZyB0aGUgY2hpbGRyZW4gb2YgYSBub2RlLCBhbmQgaXRzICdleGl0JyBwcm9wZXJ0eSBpc1xuLy8gYSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyd2FyZHMuIElmIGB2aXNpdG9yT2JqT3JGbmAgaXMgYSBmdW5jdGlvbiwgaXQgcmVwcmVzZW50cyB0aGUgJ2VudGVyJ1xuLy8gZnVuY3Rpb24uXG4vL1xuLy8gVGhlIGZ1bmN0aW9ucyBhcmUgY2FsbGVkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgVHJhY2Ugbm9kZSwgaXRzIHBhcmVudCBUcmFjZSwgYW5kIGEgbnVtYmVyXG4vLyByZXByZXNlbnRpbmcgdGhlIGRlcHRoIG9mIHRoZSBub2RlIGluIHRoZSB0cmVlLiAoVGhlIHJvb3Qgbm9kZSBoYXMgZGVwdGggMC4pIGBvcHRUaGlzQXJnYCwgaWZcbi8vIHNwZWNpZmllZCwgaXMgdGhlIHZhbHVlIHRvIHVzZSBmb3IgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIHRoZSB2aXNpdG9yIGZ1bmN0aW9ucy5cblRyYWNlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24odmlzaXRvck9iak9yRm4sIG9wdFRoaXNBcmcpIHtcbiAgdmFyIHZpc2l0b3IgPSB2aXNpdG9yT2JqT3JGbjtcbiAgaWYgKHR5cGVvZiB2aXNpdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmlzaXRvciA9IHtlbnRlcjogdmlzaXRvcn07XG4gIH1cblxuICBmdW5jdGlvbiBfd2Fsayhub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgdmFyIHJlY3Vyc2UgPSB0cnVlO1xuICAgIGlmICh2aXNpdG9yLmVudGVyKSB7XG4gICAgICBpZiAodmlzaXRvci5lbnRlci5jYWxsKG9wdFRoaXNBcmcsIG5vZGUsIHBhcmVudCwgZGVwdGgpID09PSBUcmFjZS5wcm90b3R5cGUuU0tJUCkge1xuICAgICAgICByZWN1cnNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZWN1cnNlKSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQsIGkpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IG5vZGUuY2hpbGRyZW5baSArIDFdO1xuICAgICAgICBpZiAobmV4dENoaWxkICYmIG5leHRDaGlsZC5leHByID09PSBjaGlsZC5leHByICYmIG5leHRDaGlsZC5wb3MgPT09IGNoaWxkLnBvcykge1xuICAgICAgICAgIC8vIFNraXAgdGhpcyBjaGlsZCAtLSBpdCBpcyBhbiBpbnRlcm1lZGlhdGUgbGVmdC1yZWN1cnNpdmUgcmVzdWx0LlxuICAgICAgICAgIGNvbW1vbi5hc3NlcnQobm9kZS5pc0xlZnRSZWN1cnNpdmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF93YWxrKGNoaWxkLCBub2RlLCBkZXB0aCArIDEpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICh2aXNpdG9yLmV4aXQpIHtcbiAgICAgICAgdmlzaXRvci5leGl0LmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0aGlzLmlzUm9vdE5vZGUpIHtcbiAgICAvLyBEb24ndCB2aXNpdCB0aGUgcm9vdCBub2RlIGl0c2VsZiwgb25seSBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGMpIHsgX3dhbGsoYywgbnVsbCwgMCk7IH0pO1xuICB9IGVsc2Uge1xuICAgIF93YWxrKHRoaXMsIG51bGwsIDApO1xuICB9XG59O1xuXG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYWNlLlxuLy8gU2FtcGxlOlxuLy8gICAgIDEy4ouFK+KLhTLii4Uq4ouFMyDinJMgZXhwIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAg4pyTIGFkZEV4cCAoTFIpIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAgICAgIOKclyBhZGRFeHBfcGx1c1xuVHJhY2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHRoaXMud2FsayhmdW5jdGlvbihub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy5TS0lQO1xuICAgIH1cbiAgICB2YXIgY3Rvck5hbWUgPSBub2RlLmV4cHIuY29uc3RydWN0b3IubmFtZTtcbiAgICAvLyBEb24ndCBwcmludCBhbnl0aGluZyBmb3IgQWx0IG5vZGVzLlxuICAgIGlmIChjdG9yTmFtZSA9PT0gJ0FsdCcpIHtcbiAgICAgIHJldHVybjsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICB9XG4gICAgc2IuYXBwZW5kKGdldElucHV0RXhjZXJwdChub2RlLmlucHV0U3RyZWFtLCBub2RlLnBvcywgMTApICsgc3BhY2VzKGRlcHRoICogMiArIDEpKTtcbiAgICBzYi5hcHBlbmQoKG5vZGUuc3VjY2VlZGVkID8gQ0hFQ0tfTUFSSyA6IEJBTExPVF9YKSArICcgJyArIG5vZGUuZGlzcGxheVN0cmluZyk7XG4gICAgaWYgKG5vZGUuaXNMZWZ0UmVjdXJzaXZlKSB7XG4gICAgICBzYi5hcHBlbmQoJyAoTFIpJyk7XG4gICAgfVxuICAgIGlmIChub2RlLnN1Y2NlZWRlZCkge1xuICAgICAgdmFyIGNvbnRlbnRzID0gYXNFc2NhcGVkU3RyaW5nKG5vZGUuaW50ZXJ2YWwuY29udGVudHMpO1xuICAgICAgc2IuYXBwZW5kKCcgJyArIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XICsgJyAgJyk7XG4gICAgICBzYi5hcHBlbmQodHlwZW9mIGNvbnRlbnRzID09PSAnc3RyaW5nJyA/ICdcIicgKyBjb250ZW50cyArICdcIicgOiBjb250ZW50cyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gIH0uYmluZCh0aGlzKSk7XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEhlbHBlcnNcblxudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9O1xuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKykge1xuICBlc2NhcGVTdHJpbmdGb3JbY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xufVxuZXNjYXBlU3RyaW5nRm9yW1wiJ1wiLmNoYXJDb2RlQXQoMCldICA9IFwiXFxcXCdcIjtcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldICA9ICdcXFxcXCInO1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCc7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInO1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInO1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0JztcbmVzY2FwZVN0cmluZ0ZvclsnXFx1MDAwYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0cy5hYnN0cmFjdCA9IGZ1bmN0aW9uKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAndGhpcyBtZXRob2QgaXMgYWJzdHJhY3QhICcgK1xuICAgICAgJyhpdCBoYXMgbm8gaW1wbGVtZW50YXRpb24gaW4gY2xhc3MgJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICcpJyk7XG59O1xuXG5leHBvcnRzLmFzc2VydCA9IGZ1bmN0aW9uKGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59O1xuXG4vLyBEZWZpbmUgYSBsYXppbHktY29tcHV0ZWQsIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVkIGBwcm9wTmFtZWBcbi8vIG9uIHRoZSBvYmplY3QgYG9iamAuIGBnZXR0ZXJGbmAgd2lsbCBiZSBjYWxsZWQgdG8gY29tcHV0ZSB0aGUgdmFsdWUgdGhlXG4vLyBmaXJzdCB0aW1lIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC5cbmV4cG9ydHMuZGVmaW5lTGF6eVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgZ2V0dGVyRm4pIHtcbiAgdmFyIG1lbW87XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbWVtbykge1xuICAgICAgICBtZW1vID0gZ2V0dGVyRm4uY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmopIHtcbiAgICByZXR1cm4gZXh0ZW5kKHt9LCBvYmopO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcblxuZXhwb3J0cy5yZXBlYXRGbiA9IGZ1bmN0aW9uKGZuLCBuKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgd2hpbGUgKG4tLSA+IDApIHtcbiAgICBhcnIucHVzaChmbigpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufTtcblxuZXhwb3J0cy5yZXBlYXRTdHIgPSBmdW5jdGlvbihzdHIsIG4pIHtcbiAgcmV0dXJuIG5ldyBBcnJheShuICsgMSkuam9pbihzdHIpO1xufTtcblxuZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbih4LCBuKSB7XG4gIHJldHVybiBleHBvcnRzLnJlcGVhdEZuKGZ1bmN0aW9uKCkgeyByZXR1cm4geDsgfSwgbik7XG59O1xuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmNvcHlXaXRob3V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHZhciBub0R1cGxpY2F0ZXMgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIGlmIChub0R1cGxpY2F0ZXMuaW5kZXhPZihlbnRyeSkgPCAwKSB7XG4gICAgICBub0R1cGxpY2F0ZXMucHVzaChlbnRyeSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG5vRHVwbGljYXRlcztcbn07XG5cbmV4cG9ydHMuZmFpbCA9IHt9O1xuXG5leHBvcnRzLmlzU3ludGFjdGljID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdmFyIGZpcnN0Q2hhciA9IHJ1bGVOYW1lWzBdO1xuICByZXR1cm4gZmlyc3RDaGFyID09PSBmaXJzdENoYXIudG9VcHBlckNhc2UoKTtcbn07XG5cbmV4cG9ydHMuaXNMZXhpY2FsID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgcmV0dXJuICFleHBvcnRzLmlzU3ludGFjdGljKHJ1bGVOYW1lKTtcbn07XG5cbmV4cG9ydHMucGFkTGVmdCA9IGZ1bmN0aW9uKHN0ciwgbGVuLCBvcHRDaGFyKSB7XG4gIHZhciBjaCA9IG9wdENoYXIgfHwgJyAnO1xuICBpZiAoc3RyLmxlbmd0aCA8IGxlbikge1xuICAgIHJldHVybiBleHBvcnRzLnJlcGVhdFN0cihjaCwgbGVuIC0gc3RyLmxlbmd0aCkgKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8vIFN0cmluZ0J1ZmZlclxuXG5leHBvcnRzLlN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0cmluZ3MgPSBbXTtcbn07XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihzdHIpIHtcbiAgdGhpcy5zdHJpbmdzLnB1c2goc3RyKTtcbn07XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5jb250ZW50cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdHJpbmdzLmpvaW4oJycpO1xufTtcblxuLy8gQ2hhcmFjdGVyIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nXG5cbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKGMsIG9wdERlbGltKSB7XG4gIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKTtcbiAgaWYgKChjID09PSAnXCInIHx8IGMgPT09IFwiJ1wiKSAmJiBvcHREZWxpbSAmJiBjICE9PSBvcHREZWxpbSkge1xuICAgIHJldHVybiBjO1xuICB9IGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KSB7XG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV07XG4gIH0gZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KSB7XG4gICAgcmV0dXJuICdcXFxceCcgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyLCAnMCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnXFxcXHUnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNCwgJzAnKTtcbiAgfVxufTtcblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6IHJldHVybiAnXFxiJztcbiAgICAgIGNhc2UgJ2YnOiByZXR1cm4gJ1xcZic7XG4gICAgICBjYXNlICduJzogcmV0dXJuICdcXG4nO1xuICAgICAgY2FzZSAncic6IHJldHVybiAnXFxyJztcbiAgICAgIGNhc2UgJ3QnOiByZXR1cm4gJ1xcdCc7XG4gICAgICBjYXNlICd2JzogcmV0dXJuICdcXHYnO1xuICAgICAgY2FzZSAneCc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpO1xuICAgICAgY2FzZSAndSc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDYpLCAxNikpO1xuICAgICAgZGVmYXVsdDogICByZXR1cm4gcy5jaGFyQXQoMSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59O1xuXG4vLyBIZWxwZXIgZm9yIHByb2R1Y2luZyBhIGRlc2NyaXB0aW9uIG9mIGFuIHVua25vd24gb2JqZWN0IGluIGEgc2FmZSB3YXkuXG4vLyBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgZXJyb3IgbWVzc2FnZXMgd2hlcmUgYW4gdW5leHBlY3RlZCB0eXBlIG9mIG9iamVjdCB3YXMgZW5jb3VudGVyZWQuXG5leHBvcnRzLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gIH1cbiAgdmFyIGJhc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICB0cnkge1xuICAgIHZhciB0eXBlTmFtZTtcbiAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICB0eXBlTmFtZSA9IG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIH0gZWxzZSBpZiAoYmFzZVRvU3RyaW5nLmluZGV4T2YoJ1tvYmplY3QgJykgPT09IDApIHtcbiAgICAgIHR5cGVOYW1lID0gYmFzZVRvU3RyaW5nLnNsaWNlKDgsIC0xKTsgIC8vIEV4dHJhY3QgZS5nLiBcIkFycmF5XCIgZnJvbSBcIltvYmplY3QgQXJyYXldXCIuXG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVOYW1lID0gdHlwZW9mIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVOYW1lICsgJzogJyArIEpTT04uc3RyaW5naWZ5KFN0cmluZyhvYmopKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBiYXNlVG9TdHJpbmc7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdEludGVydmFsKSB7XG4gIHZhciBlO1xuICBpZiAob3B0SW50ZXJ2YWwpIHtcbiAgICBlID0gbmV3IEVycm9yKG9wdEludGVydmFsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKCkgKyBtZXNzYWdlKTtcbiAgICBlLnNob3J0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgZS5pbnRlcnZhbCA9IG9wdEludGVydmFsO1xuICB9IGVsc2Uge1xuICAgIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBpbnRlcnZhbHMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXCJJbnRlcnZhbCBzb3VyY2VzIGRvbid0IG1hdGNoXCIpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgZ3JhbW1hcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR3JhbW1hciBzeW50YXggZXJyb3JcblxuZnVuY3Rpb24gZ3JhbW1hclN5bnRheEVycm9yKG1hdGNoRmFpbHVyZSkge1xuICB2YXIgZSA9IG5ldyBFcnJvcigpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ21lc3NhZ2UnLCB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1hdGNoRmFpbHVyZS5tZXNzYWdlOyB9fSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCAnc2hvcnRNZXNzYWdlJywge2dldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdFeHBlY3RlZCAnICsgbWF0Y2hGYWlsdXJlLmdldEV4cGVjdGVkVGV4dCgpO1xuICB9fSk7XG4gIGUuaW50ZXJ2YWwgPSBtYXRjaEZhaWx1cmUuZ2V0SW50ZXJ2YWwoKTtcbiAgcmV0dXJuIGU7XG59XG5cbi8vIFVuZGVjbGFyZWQgZ3JhbW1hclxuXG5mdW5jdGlvbiB1bmRlY2xhcmVkR3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBpbnRlcnZhbCkge1xuICB2YXIgbWVzc2FnZSA9IG5hbWVzcGFjZSA/XG4gICAgICAnR3JhbW1hciAnICsgZ3JhbW1hck5hbWUgKyAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyhuYW1lc3BhY2UpIDpcbiAgICAgICdVbmRlY2xhcmVkIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lO1xuICByZXR1cm4gY3JlYXRlRXJyb3IobWVzc2FnZSwgaW50ZXJ2YWwpO1xufVxuXG4vLyBEdXBsaWNhdGUgZ3JhbW1hciBkZWNsYXJhdGlvblxuXG5mdW5jdGlvbiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZ3JhbW1hciwgbmFtZXNwYWNlKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcignR3JhbW1hciAnICsgZ3JhbW1hci5uYW1lICsgJyBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIHRoaXMgbmFtZXNwYWNlJyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHJ1bGVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuZGVjbGFyZWQgcnVsZVxuXG5mdW5jdGlvbiB1bmRlY2xhcmVkUnVsZShydWxlTmFtZSwgZ3JhbW1hck5hbWUsIG9wdEludGVydmFsKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdSdWxlICcgKyBydWxlTmFtZSArICcgaXMgbm90IGRlY2xhcmVkIGluIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lLFxuICAgICAgb3B0SW50ZXJ2YWwpO1xufVxuXG4vLyBDYW5ub3Qgb3ZlcnJpZGUgdW5kZWNsYXJlZCBydWxlXG5cbmZ1bmN0aW9uIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBib2R5KSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdDYW5ub3Qgb3ZlcnJpZGUgcnVsZSAnICsgcnVsZU5hbWUgKyAnIGJlY2F1c2UgaXQgaXMgbm90IGRlY2xhcmVkIGluICcgKyBncmFtbWFyTmFtZSxcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsKTtcbn1cblxuLy8gQ2Fubm90IGV4dGVuZCB1bmRlY2xhcmVkIHJ1bGVcblxuZnVuY3Rpb24gY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBib2R5KSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdDYW5ub3QgZXh0ZW5kIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgZ3JhbW1hck5hbWUsXG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCk7XG59XG5cbi8vIER1cGxpY2F0ZSBydWxlIGRlY2xhcmF0aW9uXG5cbmZ1bmN0aW9uIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihydWxlTmFtZSwgb2ZmZW5kaW5nR3JhbW1hck5hbWUsIGRlY2xHcmFtbWFyTmFtZSwgYm9keSkge1xuICB2YXIgbWVzc2FnZSA9IFwiRHVwbGljYXRlIGRlY2xhcmF0aW9uIGZvciBydWxlICdcIiArIHJ1bGVOYW1lICtcbiAgICAgIFwiJyBpbiBncmFtbWFyICdcIiArIG9mZmVuZGluZ0dyYW1tYXJOYW1lICsgXCInXCI7XG4gIGlmIChvZmZlbmRpbmdHcmFtbWFyTmFtZSAhPT0gZGVjbEdyYW1tYXJOYW1lKSB7XG4gICAgbWVzc2FnZSArPSBcIiAob3JpZ2luYWxseSBkZWNsYXJlZCBpbiAnXCIgKyBkZWNsR3JhbW1hck5hbWUgKyBcIicpXCI7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGJvZHkuZGVmaW5pdGlvbkludGVydmFsKTtcbn1cblxuLy8gV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnNcblxuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGJvZHkpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ1dyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzIGZvciBydWxlICcgKyBydWxlTmFtZSArXG4gICAgICAgICAgJyAoZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwgKyAnKScsXG4gICAgICBib2R5ICYmIGJvZHkuZGVmaW5pdGlvbkludGVydmFsKTtcbn1cblxuLy8gV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1xuXG5mdW5jdGlvbiB3cm9uZ051bWJlck9mQXJndW1lbnRzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBleHByKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIGZvciBydWxlICcgKyBydWxlTmFtZSArXG4gICAgICAgICAgJyAoZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwgKyAnKScsXG4gICAgICBleHByLmludGVydmFsKTtcbn1cblxuLy8gRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lc1xuXG5mdW5jdGlvbiBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhydWxlTmFtZSwgZHVwbGljYXRlcywgYm9keSkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lcyBpbiBydWxlICcgKyBydWxlTmFtZSArICc6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywnKSxcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsKTtcbn1cblxuLy8gSW52YWxpZCBwYXJhbWV0ZXIgZXhwcmVzc2lvblxuXG5mdW5jdGlvbiBpbnZhbGlkUGFyYW1ldGVyKHJ1bGVOYW1lLCBleHByKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdJbnZhbGlkIHBhcmFtZXRlciB0byBydWxlICcgKyBydWxlTmFtZSArICc6ICcgKyBleHByICsgJyBoYXMgYXJpdHkgJyArIGV4cHIuZ2V0QXJpdHkoKSArXG4gICAgICAgICAgJywgYnV0IHBhcmFtZXRlciBleHByZXNzaW9ucyAnICsgJ211c3QgaGF2ZSBhcml0eSAxJyxcbiAgICAgIGV4cHIuaW50ZXJ2YWwpO1xufVxuXG4vLyBBcHBsaWNhdGlvbiBvZiBzeW50YWN0aWMgcnVsZSBmcm9tIGxleGljYWwgcnVsZVxuXG5mdW5jdGlvbiBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dChydWxlTmFtZSwgYXBwbHlFeHByKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdDYW5ub3QgYXBwbHkgc3ludGFjdGljIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBmcm9tIGhlcmUgKGluc2lkZSBhIGxleGljYWwgY29udGV4dCknLFxuICAgICAgYXBwbHlFeHByLmludGVydmFsKTtcbn1cblxuZnVuY3Rpb24gZXhwck1peGVzVmFsdWVBbmRTdHJpbmdFeHByZXNzaW9ucyhleHByLCBvcHRSdWxlTmFtZSkge1xuICAvLyBUT0RPOiBJbXByb3ZlIHRoZSByZXBvcnRpbmcgaGVyZS5cbiAgdmFyIGRlc2MgPVxuICAgICAgKG9wdFJ1bGVOYW1lID8gJ1J1bGUgJyArIG9wdFJ1bGVOYW1lIDogJ0V4cHJlc3Npb24nKSArICcgbWl4ZXMgdmFsdWUgYW5kIHN0cmluZyBleHByZXNzaW9ucyc7XG4gIHJldHVybiBjcmVhdGVFcnJvcihkZXNjLCBleHByLmludGVydmFsKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gS2xlZW5lIG9wZXJhdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKGtsZWVuZUV4cHIpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ051bGxhYmxlIGV4cHJlc3Npb24gJyArIGtsZWVuZUV4cHIuZXhwci5pbnRlcnZhbC5jb250ZW50cyArIFwiIGlzIG5vdCBhbGxvd2VkIGluc2lkZSAnXCIgK1xuICAgICAgICAgIGtsZWVuZUV4cHIub3BlcmF0b3IgKyBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCIsXG4gICAgICBrbGVlbmVFeHByLmV4cHIuaW50ZXJ2YWwpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBhcml0eSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgZXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnUnVsZSAnICsgcnVsZU5hbWUgKyAnIGludm9sdmVzIGFuIGFsdGVybmF0aW9uIHdoaWNoIGhhcyBpbmNvbnNpc3RlbnQgYXJpdHkgJyArXG4gICAgICAgICAgJyhleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCArICcpJyxcbiAgICAgIGV4cHIuaW50ZXJ2YWwpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGR1cGxpY2F0ZVByb3BlcnR5TmFtZXMoZHVwbGljYXRlcykge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoJ09iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJykpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBjb25zdHJ1Y3RvcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW52YWxpZENvbnN0cnVjdG9yQ2FsbChncmFtbWFyLCBjdG9yTmFtZSwgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0F0dGVtcHQgdG8gaW52b2tlIGNvbnN0cnVjdG9yICcgKyBjdG9yTmFtZSArICcgd2l0aCBpbnZhbGlkIG9yIHVuZXhwZWN0ZWQgYXJndW1lbnRzJyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnZlbmllbmNlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG11bHRpcGxlRXJyb3JzKGVycm9ycykge1xuICB2YXIgbWVzc2FnZXMgPSBlcnJvcnMubWFwKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUubWVzc2FnZTsgfSk7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgIFsnRXJyb3JzOiddLmNvbmNhdChtZXNzYWdlcykuam9pbignXFxuLSAnKSxcbiAgICAgIGVycm9yc1swXS5pbnRlcnZhbCk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQ6IGFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0LFxuICBjYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZTogY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUsXG4gIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUsXG4gIGR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbjogZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uLFxuICBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lczogZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMsXG4gIGR1cGxpY2F0ZVByb3BlcnR5TmFtZXM6IGR1cGxpY2F0ZVByb3BlcnR5TmFtZXMsXG4gIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbjogZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uLFxuICBleHByTWl4ZXNWYWx1ZUFuZFN0cmluZ0V4cHJlc3Npb25zOiBleHByTWl4ZXNWYWx1ZUFuZFN0cmluZ0V4cHJlc3Npb25zLFxuICBpbmNvbnNpc3RlbnRBcml0eTogaW5jb25zaXN0ZW50QXJpdHksXG4gIGludGVydmFsU291cmNlc0RvbnRNYXRjaDogaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoLFxuICBpbnZhbGlkQ29uc3RydWN0b3JDYWxsOiBpbnZhbGlkQ29uc3RydWN0b3JDYWxsLFxuICBpbnZhbGlkUGFyYW1ldGVyOiBpbnZhbGlkUGFyYW1ldGVyLFxuICBncmFtbWFyU3ludGF4RXJyb3I6IGdyYW1tYXJTeW50YXhFcnJvcixcbiAga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZDoga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCxcbiAgdW5kZWNsYXJlZEdyYW1tYXI6IHVuZGVjbGFyZWRHcmFtbWFyLFxuICB1bmRlY2xhcmVkUnVsZTogdW5kZWNsYXJlZFJ1bGUsXG4gIHdyb25nTnVtYmVyT2ZBcmd1bWVudHM6IHdyb25nTnVtYmVyT2ZBcmd1bWVudHMsXG4gIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzOiB3cm9uZ051bWJlck9mUGFyYW1ldGVycyxcblxuICB0aHJvd0Vycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRocm93IGVycm9yc1swXTtcbiAgICB9XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBtdWx0aXBsZUVycm9ycyhlcnJvcnMpO1xuICAgIH1cbiAgfVxufTtcbiIsIi8qIGdsb2JhbCBkb2N1bWVudCwgWE1MSHR0cFJlcXVlc3QgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXInKTtcbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVGhlIG1ldGFncmFtbWFyLCBpLmUuIHRoZSBncmFtbWFyIGZvciBPaG0gZ3JhbW1hcnMuIEluaXRpYWxpemVkIGF0IHRoZVxuLy8gYm90dG9tIG9mIHRoaXMgZmlsZSBiZWNhdXNlIGxvYWRpbmcgdGhlIGdyYW1tYXIgcmVxdWlyZXMgT2htIGl0c2VsZi5cbnZhciBvaG1HcmFtbWFyO1xuXG4vLyBBbiBvYmplY3Qgd2hpY2ggbWFrZXMgaXQgcG9zc2libGUgdG8gc3R1YiBvdXQgdGhlIGRvY3VtZW50IEFQSSBmb3IgdGVzdGluZy5cbnZhciBkb2N1bWVudEludGVyZmFjZSA9IHtcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpOyB9XG59O1xuXG4vLyBDaGVjayBpZiBgb2JqYCBpcyBhIERPTSBlbGVtZW50LlxuZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG59XG5cbnZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoO1xuICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbn1cblxuLy8gVE9ETzoganVzdCB1c2UgdGhlIGpRdWVyeSB0aGluZ1xuZnVuY3Rpb24gbG9hZCh1cmwpIHtcbiAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICByZXEub3BlbignR0VUJywgdXJsLCBmYWxzZSk7XG4gIHRyeSB7XG4gICAgcmVxLnNlbmQoKTtcbiAgICBpZiAocmVxLnN0YXR1cyA9PT0gMCB8fCByZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJldHVybiByZXEucmVzcG9uc2VUZXh0O1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge31cbiAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9hZCB1cmwgJyArIHVybCk7XG59XG5cbi8vIFJldHVybnMgYSBHcmFtbWFyIGluc3RhbmNlIChpLmUuLCBhbiBvYmplY3Qgd2l0aCBhIGBtYXRjaGAgbWV0aG9kKSBmb3Jcbi8vIGB0cmVlYCwgd2hpY2ggaXMgdGhlIGNvbmNyZXRlIHN5bnRheCB0cmVlIG9mIGEgdXNlci13cml0dGVuIGdyYW1tYXIuXG4vLyBUaGUgZ3JhbW1hciB3aWxsIGJlIGFzc2lnbmVkIGludG8gYG5hbWVzcGFjZWAgdW5kZXIgdGhlIG5hbWUgb2YgdGhlIGdyYW1tYXJcbi8vIGFzIHNwZWNpZmllZCBpbiB0aGUgc291cmNlLlxuZnVuY3Rpb24gYnVpbGRHcmFtbWFyKG1hdGNoLCBuYW1lc3BhY2UsIG9wdE9obUdyYW1tYXJGb3JUZXN0aW5nKSB7XG4gIHZhciBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgdmFyIGRlY2w7XG4gIHZhciBjdXJyZW50UnVsZU5hbWU7XG4gIHZhciBjdXJyZW50UnVsZUZvcm1hbHM7XG4gIHZhciBvdmVycmlkaW5nID0gZmFsc2U7XG4gIHZhciBtZXRhR3JhbW1hciA9IG9wdE9obUdyYW1tYXJGb3JUZXN0aW5nIHx8IG9obUdyYW1tYXI7XG5cbiAgLy8gQSB2aXNpdG9yIHRoYXQgcHJvZHVjZXMgYSBHcmFtbWFyIGluc3RhbmNlIGZyb20gdGhlIENTVC5cbiAgdmFyIGhlbHBlcnMgPSBtZXRhR3JhbW1hci5zZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3Zpc2l0Jywge1xuICAgIEdyYW1tYXI6IGZ1bmN0aW9uKG4sIHMsIG9wZW4sIHJzLCBjbG9zZSkge1xuICAgICAgdmFyIGdyYW1tYXJOYW1lID0gbi52aXNpdCgpO1xuICAgICAgZGVjbCA9IGJ1aWxkZXIubmV3R3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlKTtcbiAgICAgIHMudmlzaXQoKTtcbiAgICAgIHJzLnZpc2l0KCk7XG4gICAgICB2YXIgZyA9IGRlY2wuYnVpbGQoKTtcbiAgICAgIGcuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICBpZiAoZ3JhbW1hck5hbWUgaW4gbmFtZXNwYWNlKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZywgbmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICAgIG5hbWVzcGFjZVtncmFtbWFyTmFtZV0gPSBnO1xuICAgICAgcmV0dXJuIGc7XG4gICAgfSxcblxuICAgIFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oXywgbikge1xuICAgICAgdmFyIHN1cGVyR3JhbW1hck5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBpZiAoc3VwZXJHcmFtbWFyTmFtZSA9PT0gJ251bGwnKSB7XG4gICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlIHx8ICEoc3VwZXJHcmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRHcmFtbWFyKHN1cGVyR3JhbW1hck5hbWUsIG5hbWVzcGFjZSwgbi5pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG5hbWVzcGFjZVtzdXBlckdyYW1tYXJOYW1lXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIFJ1bGVfZGVmaW5lOiBmdW5jdGlvbihuLCBmcywgZCwgX2VxdWFscywgX29wdEJhciwgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZSB5ZXQsIHNldCBpdCBub3cuIFRoaXMgbXVzdCBiZSBkb25lIGJlZm9yZSB2aXNpdGluZ1xuICAgICAgLy8gdGhlIGJvZHksIGJlY2F1c2UgaXQgbWlnaHQgY29udGFpbiBhbiBpbmxpbmUgcnVsZSBkZWZpbml0aW9uLlxuICAgICAgaWYgKCFkZWNsLmRlZmF1bHRTdGFydFJ1bGUgJiYgZGVjbC5lbnN1cmVTdXBlckdyYW1tYXIoKSAhPT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcykge1xuICAgICAgICBkZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGN1cnJlbnRSdWxlTmFtZSk7XG4gICAgICB9XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICB2YXIgZGVzY3JpcHRpb24gPSBkLnZpc2l0KClbMF07XG4gICAgICByZXR1cm4gZGVjbC5kZWZpbmUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uKTtcbiAgICB9LFxuICAgIFJ1bGVfb3ZlcnJpZGU6IGZ1bmN0aW9uKG4sIGZzLCBfY29sb25FcXVhbHMsIF9vcHRCYXIsIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLnZpc2l0KClbMF0gfHwgW107XG4gICAgICBvdmVycmlkaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgYm9keS5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgIHZhciBhbnMgPSBkZWNsLm92ZXJyaWRlKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5KTtcbiAgICAgIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBSdWxlX2V4dGVuZDogZnVuY3Rpb24obiwgZnMsIF9wbHVzRXF1YWxzLCBfb3B0QmFyLCBiKSB7XG4gICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy52aXNpdCgpWzBdIHx8IFtdO1xuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICB2YXIgYW5zID0gZGVjbC5leHRlbmQoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHkpO1xuICAgICAgZGVjbC5ydWxlQm9kaWVzW2N1cnJlbnRSdWxlTmFtZV0uZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG5cbiAgICBGb3JtYWxzOiBmdW5jdGlvbihvcG9pbnR5LCBmcywgY3BvaW50eSkge1xuICAgICAgcmV0dXJuIGZzLnZpc2l0KCk7XG4gICAgfSxcblxuICAgIFBhcmFtczogZnVuY3Rpb24ob3BvaW50eSwgcHMsIGNwb2ludHkpIHtcbiAgICAgIHJldHVybiBwcy52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBBbHQ6IGZ1bmN0aW9uKHRlcm0sIF8sIHRlcm1zKSB7XG4gICAgICB2YXIgYXJncyA9IFt0ZXJtLnZpc2l0KCldLmNvbmNhdCh0ZXJtcy52aXNpdCgpKTtcbiAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIFRlcm1faW5saW5lOiBmdW5jdGlvbihiLCBuKSB7XG4gICAgICB2YXIgaW5saW5lUnVsZU5hbWUgPSBjdXJyZW50UnVsZU5hbWUgKyAnXycgKyBuLnZpc2l0KCk7XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICB2YXIgaXNOZXdSdWxlRGVjbGFyYXRpb24gPVxuICAgICAgICAgICEoZGVjbC5zdXBlckdyYW1tYXIgJiYgZGVjbC5zdXBlckdyYW1tYXIucnVsZUJvZGllc1tpbmxpbmVSdWxlTmFtZV0pO1xuICAgICAgaWYgKG92ZXJyaWRpbmcgJiYgIWlzTmV3UnVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgIGRlY2wub3ZlcnJpZGUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWNsLmRlZmluZShpbmxpbmVSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5KTtcbiAgICAgIH1cbiAgICAgIHZhciBwYXJhbXMgPSBjdXJyZW50UnVsZUZvcm1hbHMubWFwKGZ1bmN0aW9uKGZvcm1hbCkgeyByZXR1cm4gYnVpbGRlci5hcHAoZm9ybWFsKTsgfSk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcHAoaW5saW5lUnVsZU5hbWUsIHBhcmFtcykud2l0aEludGVydmFsKGJvZHkuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBTZXE6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCBleHByLnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgSXRlcl9zdGFyOiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5zdGFyKHgudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgSXRlcl9wbHVzOiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5wbHVzKHgudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgSXRlcl9vcHQ6IGZ1bmN0aW9uKHgsIF8pIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm9wdCh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgUHJlZF9ub3Q6IGZ1bmN0aW9uKF8sIHgpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm5vdCh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIFByZWRfbG9va2FoZWFkOiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5sYSh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgTW9kaWZpZXJfbGV4OiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5sZXgoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBNb2RpZmllcl92YWw6IGZ1bmN0aW9uKF8sIHgpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnZhbCh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgQmFzZV9hcHBsaWNhdGlvbjogZnVuY3Rpb24ocnVsZSwgcHMpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLmFwcChydWxlLnZpc2l0KCksIHBzLnZpc2l0KClbMF0gfHwgW10pLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEJhc2VfcmFuZ2U6IGZ1bmN0aW9uKGZyb20sIF8sIHRvKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5yYW5nZShmcm9tLnZpc2l0KCksIHRvLnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEJhc2VfcHJpbTogZnVuY3Rpb24oZXhwcikge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIucHJpbShleHByLnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEJhc2VfcGFyZW46IGZ1bmN0aW9uKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICByZXR1cm4geC52aXNpdCgpO1xuICAgIH0sXG4gICAgQmFzZV9hcnI6IGZ1bmN0aW9uKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcnIoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBCYXNlX29iajogZnVuY3Rpb24ob3BlbiwgbGVuaWVudCwgY2xvc2UpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm9iaihbXSwgbGVuaWVudC52aXNpdCgpWzBdKTtcbiAgICB9LFxuXG4gICAgQmFzZV9vYmpXaXRoUHJvcHM6IGZ1bmN0aW9uKG9wZW4sIHBzLCBfLCBsZW5pZW50LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIub2JqKHBzLnZpc2l0KCksIGxlbmllbnQudmlzaXQoKVswXSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBQcm9wczogZnVuY3Rpb24ocCwgXywgcHMpIHtcbiAgICAgIHJldHVybiBbcC52aXNpdCgpXS5jb25jYXQocHMudmlzaXQoKSk7XG4gICAgfSxcbiAgICBQcm9wOiBmdW5jdGlvbihuLCBfLCBwKSB7XG4gICAgICByZXR1cm4ge25hbWU6IG4udmlzaXQoKSwgcGF0dGVybjogcC52aXNpdCgpfTtcbiAgICB9LFxuXG4gICAgcnVsZURlc2NyOiBmdW5jdGlvbihvcGVuLCB0LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIHQudmlzaXQoKTtcbiAgICB9LFxuICAgIHJ1bGVEZXNjclRleHQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgY2FzZU5hbWU6IGZ1bmN0aW9uKF8sIHNwYWNlMSwgbiwgc3BhY2UyLCBlbmQpIHtcbiAgICAgIHJldHVybiBuLnZpc2l0KCk7XG4gICAgfSxcblxuICAgIG5hbWU6IGZ1bmN0aW9uKGZpcnN0LCByZXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuICAgIG5hbWVGaXJzdDogZnVuY3Rpb24oZXhwcikge30sXG4gICAgbmFtZVJlc3Q6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuXG4gICAga2V5d29yZF9udWxsOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIGtleXdvcmRfdHJ1ZTogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBrZXl3b3JkX2ZhbHNlOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIHN0cmluZzogZnVuY3Rpb24ob3BlbiwgY3MsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gY3MudmlzaXQoKS5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gY29tbW9uLnVuZXNjYXBlQ2hhcihjKTsgfSkuam9pbignJyk7XG4gICAgfSxcblxuICAgIHN0ckNoYXI6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzO1xuICAgIH0sXG5cbiAgICBlc2NhcGVDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuXG4gICAgbnVtYmVyOiBmdW5jdGlvbihfLCBkaWdpdHMpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh0aGlzLmludGVydmFsLmNvbnRlbnRzKTtcbiAgICB9LFxuXG4gICAgTm9uZW1wdHlMaXN0T2Y6IGZ1bmN0aW9uKHgsIF8sIHhzKSB7XG4gICAgICByZXR1cm4gW3gudmlzaXQoKV0uY29uY2F0KHhzLnZpc2l0KCkpO1xuICAgIH0sXG4gICAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG5cbiAgICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGhlbHBlcnMobWF0Y2gpLnZpc2l0KCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbmFtZXNwYWNlKSB7XG4gIHZhciBtID0gb2htR3JhbW1hci5tYXRjaChzb3VyY2UsICdHcmFtbWFycycpO1xuICBpZiAobS5mYWlsZWQoKSkge1xuICAgIHRocm93IGVycm9ycy5ncmFtbWFyU3ludGF4RXJyb3IobSk7XG4gIH1cbiAgcmV0dXJuIGJ1aWxkR3JhbW1hcihtLCBuYW1lc3BhY2UpO1xufVxuXG4vLyBSZXR1cm4gdGhlIGNvbnRlbnRzIG9mIGEgc2NyaXB0IGVsZW1lbnQsIGZldGNoaW5nIGl0IHZpYSBYSFIgaWYgbmVjZXNzYXJ5LlxuZnVuY3Rpb24gZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKGVsKSB7XG4gIGlmICghaXNFbGVtZW50KGVsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgRE9NIE5vZGUsIGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhlbCkpO1xuICB9XG4gIGlmIChlbC50eXBlICE9PSAndGV4dC9vaG0tanMnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZ290ICcgKyBlbCk7XG4gIH1cbiAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnc3JjJykgPyBsb2FkKGVsLmdldEF0dHJpYnV0ZSgnc3JjJykpIDogZWwuaW5uZXJIVE1MO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBucyA9IGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKTtcblxuICAvLyBFbnN1cmUgdGhhdCB0aGUgc291cmNlIGNvbnRhaW5lZCBubyBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbi5cbiAgdmFyIGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKG5zKTtcbiAgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZ3JhbW1hciBkZWZpbml0aW9uJyk7XG4gIH0gZWxzZSBpZiAoZ3JhbW1hck5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgc2Vjb25kR3JhbW1hciA9IG5zW2dyYW1tYXJOYW1lc1sxXV07XG4gICAgdmFyIGludGVydmFsID0gc2Vjb25kR3JhbW1hci5kZWZpbml0aW9uSW50ZXJ2YWw7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKGludGVydmFsLmlucHV0U3RyZWFtLnNvdXJjZSwgaW50ZXJ2YWwuc3RhcnRJZHgpICtcbiAgICAgICAgJ0ZvdW5kIG1vcmUgdGhhbiBvbmUgZ3JhbW1hciBkZWZpbml0aW9uIC0tIHVzZSBvaG0uZ3JhbW1hcnMoKSBpbnN0ZWFkLicpO1xuICB9XG4gIHJldHVybiBuc1tncmFtbWFyTmFtZXNbMF1dOyAgLy8gUmV0dXJuIHRoZSBvbmUgYW5kIG9ubHkgZ3JhbW1hci5cbn1cblxuZnVuY3Rpb24gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIG5zID0gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UuYXNOYW1lc3BhY2Uob3B0TmFtZXNwYWNlKSk7XG4gIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgIC8vIEZvciBjb252ZW5pZW5jZSwgZGV0ZWN0IE5vZGUuanMgQnVmZmVyIG9iamVjdHMgYW5kIGF1dG9tYXRpY2FsbHkgY2FsbCB0b1N0cmluZygpLlxuICAgIGlmIChpc0J1ZmZlcihzb3VyY2UpKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2UudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnRXhwZWN0ZWQgc3RyaW5nIGFzIGZpcnN0IGFyZ3VtZW50LCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoc291cmNlKSk7XG4gICAgfVxuICB9XG4gIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbnMpO1xuICByZXR1cm4gbnM7XG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudChvcHROb2RlKSB7XG4gIHZhciBub2RlID0gb3B0Tm9kZTtcbiAgaWYgKGlzVW5kZWZpbmVkKG5vZGUpKSB7XG4gICAgdmFyIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICAgIGlmIChub2RlTGlzdC5sZW5ndGggIT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnRXhwZWN0ZWQgZXhhY3RseSBvbmUgc2NyaXB0IHRhZyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLCBmb3VuZCAnICsgbm9kZUxpc3QubGVuZ3RoKTtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGVMaXN0WzBdO1xuICB9XG4gIHJldHVybiBncmFtbWFyKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlKSk7XG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzKG9wdE5vZGVPck5vZGVMaXN0KSB7XG4gIC8vIFNpbXBsZSBjYXNlOiB0aGUgYXJndW1lbnQgaXMgYSBET00gbm9kZS5cbiAgaWYgKGlzRWxlbWVudChvcHROb2RlT3JOb2RlTGlzdCkpIHtcbiAgICByZXR1cm4gZ3JhbW1hcnMob3B0Tm9kZU9yTm9kZUxpc3QpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgaXQgbXVzdCBiZSBlaXRoZXIgdW5kZWZpbmVkIG9yIGEgTm9kZUxpc3QuXG4gIHZhciBub2RlTGlzdCA9IG9wdE5vZGVPck5vZGVMaXN0O1xuICBpZiAoaXNVbmRlZmluZWQobm9kZUxpc3QpKSB7XG4gICAgLy8gRmluZCBhbGwgc2NyaXB0IGVsZW1lbnRzIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIuXG4gICAgbm9kZUxpc3QgPSBkb2N1bWVudEludGVyZmFjZS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvb2htLWpzXCJdJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5vZGVMaXN0ID09PSAnc3RyaW5nJyB8fCAoIWlzRWxlbWVudChub2RlTGlzdCkgJiYgIWlzQXJyYXlMaWtlKG5vZGVMaXN0KSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIE5vZGUsIE5vZGVMaXN0LCBvciBBcnJheSwgYnV0IGdvdCAnICsgbm9kZUxpc3QpO1xuICB9XG4gIHZhciBucyA9IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7ICsraSkge1xuICAgIC8vIENvcHkgdGhlIG5ldyBncmFtbWFycyBpbnRvIGBuc2AgdG8ga2VlcCB0aGUgbmFtZXNwYWNlIGZsYXQuXG4gICAgY29tbW9uLmV4dGVuZChucywgZ3JhbW1hcnMoZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKG5vZGVMaXN0W2ldKSwgbnMpKTtcbiAgfVxuICByZXR1cm4gbnM7XG59XG5cbmZ1bmN0aW9uIG1ha2VSZWNpcGUocmVjaXBlRm4pIHtcbiAgcmV0dXJuIHJlY2lwZUZuLmNhbGwobmV3IEJ1aWxkZXIoKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlTmFtZXNwYWNlOiBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlLFxuICBncmFtbWFyOiBncmFtbWFyLFxuICBncmFtbWFyczogZ3JhbW1hcnMsXG4gIGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudDogZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50LFxuICBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50czogZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMsXG4gIG1ha2VSZWNpcGU6IG1ha2VSZWNpcGUsXG4gIG9obUdyYW1tYXI6IG51bGwsICAvLyBJbml0aWFsaXplZCBiZWxvdywgYWZ0ZXIgR3JhbW1hci5CdWlsdEluUnVsZXMuXG4gIHBleHByczogcGV4cHJzLFxuICB1dGlsOiB1dGlsLFxuICBleHRyYXM6IHJlcXVpcmUoJy4uL2V4dHJhcycpXG59O1xuXG4vLyBTdHVmZiBmb3IgdGVzdGluZywgZXRjLlxubW9kdWxlLmV4cG9ydHMuX2J1aWxkR3JhbW1hciA9IGJ1aWxkR3JhbW1hcjtcbm1vZHVsZS5leHBvcnRzLl9zZXREb2N1bWVudEludGVyZmFjZUZvclRlc3RpbmcgPSBmdW5jdGlvbihkb2MpIHsgZG9jdW1lbnRJbnRlcmZhY2UgPSBkb2M7IH07XG5cbi8vIExhdGUgaW5pdGlhbGl6YXRpb24gZm9yIHN0dWZmIHRoYXQgaXMgYm9vdHN0cmFwcGVkLlxuXG5HcmFtbWFyLkJ1aWx0SW5SdWxlcyA9IHJlcXVpcmUoJy4uL2Rpc3QvYnVpbHQtaW4tcnVsZXMnKTtcblxudmFyIFNlbWFudGljcyA9IHJlcXVpcmUoJy4vU2VtYW50aWNzJyk7XG52YXIgb3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzJyk7XG5TZW1hbnRpY3MuaW5pdEJ1aWx0SW5TZW1hbnRpY3MoR3JhbW1hci5CdWlsdEluUnVsZXMpO1xuU2VtYW50aWNzLmluaXRQcm90b3R5cGVQYXJzZXIob3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyKTsgIC8vIHJlcXVpcmVzIEJ1aWx0SW5TZW1hbnRpY3NcblxubW9kdWxlLmV4cG9ydHMub2htR3JhbW1hciA9IG9obUdyYW1tYXIgPSByZXF1aXJlKCcuLi9kaXN0L29obS1ncmFtbWFyJyk7XG5HcmFtbWFyLmluaXRBcHBsaWNhdGlvblBhcnNlcihvaG1HcmFtbWFyLCBidWlsZEdyYW1tYXIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIGNoaWxkcmVuLCBpbnRlcnZhbCkge1xuICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICB0aGlzLmN0b3JOYW1lID0gY3Rvck5hbWU7XG4gIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5udW1DaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGg7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEF0ID0gZnVuY3Rpb24oaWR4KSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuW2lkeF07XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pbmRleE9mQ2hpbGQgPSBmdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhcmcpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoID4gMDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmhhc05vQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICF0aGlzLmhhc0NoaWxkcmVuKCk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5vbmx5Q2hpbGQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoICE9PSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnY2Fubm90IGdldCBvbmx5IGNoaWxkIG9mIGEgbm9kZSBvZiB0eXBlICcgKyB0aGlzLmN0b3JOYW1lICtcbiAgICAgICAgJyAoaXQgaGFzICcgKyB0aGlzLm51bUNoaWxkcmVuKCkgKyAnIGNoaWxkcmVuKScpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmZpcnN0Q2hpbGQoKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuZmlyc3RDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IGZpcnN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoMCk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmxhc3RDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IGxhc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdCh0aGlzLm51bUNoaWxkcmVuKCkgLSAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRCZWZvcmUgPSBmdW5jdGlvbihjaGlsZCkge1xuICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRCZWZvcmUoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICB9IGVsc2UgaWYgKGNoaWxkSWR4ID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGJlZm9yZSBmaXJzdCBjaGlsZCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggLSAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRBZnRlciA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEFmdGVyKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgfSBlbHNlIGlmIChjaGlsZElkeCA9PT0gdGhpcy5udW1DaGlsZHJlbigpIC0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBhZnRlciBsYXN0IGNoaWxkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCArIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmlzTm9udGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaXNJdGVyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaXNPcHRpb25hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHIgPSB7fTtcbiAgclt0aGlzLmN0b3JOYW1lXSA9IHRoaXMuY2hpbGRyZW47XG4gIHJldHVybiByO1xufTtcblxuLy8gVGVybWluYWxzXG5cbmZ1bmN0aW9uIFRlcm1pbmFsTm9kZShncmFtbWFyLCB2YWx1ZSwgaW50ZXJ2YWwpIHtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsICdfdGVybWluYWwnLCBbXSwgaW50ZXJ2YWwpO1xuICB0aGlzLnByaW1pdGl2ZVZhbHVlID0gdmFsdWU7XG59XG5pbmhlcml0cyhUZXJtaW5hbE5vZGUsIE5vZGUpO1xuXG5UZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vLyBOb250ZXJtaW5hbHNcblxuZnVuY3Rpb24gTm9udGVybWluYWxOb2RlKGdyYW1tYXIsIHJ1bGVOYW1lLCBjaGlsZHJlbiwgaW50ZXJ2YWwpIHtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsIHJ1bGVOYW1lLCBjaGlsZHJlbiwgaW50ZXJ2YWwpO1xufVxuaW5oZXJpdHMoTm9udGVybWluYWxOb2RlLCBOb2RlKTtcblxuTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc0xleGljYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGNvbW1vbi5pc0xleGljYWwodGhpcy5jdG9yTmFtZSk7XG59O1xuXG5Ob250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5jdG9yTmFtZSk7XG59O1xuXG4vLyBJdGVyYXRpb25zXG5cbmZ1bmN0aW9uIEl0ZXJhdGlvbk5vZGUoZ3JhbW1hciwgY2hpbGRyZW4sIGludGVydmFsLCBvcHRpb25hbCkge1xuICBOb2RlLmNhbGwodGhpcywgZ3JhbW1hciwgJ19pdGVyJywgY2hpbGRyZW4sIGludGVydmFsKTtcbiAgdGhpcy5vcHRpb25hbCA9IG9wdGlvbmFsO1xufVxuaW5oZXJpdHMoSXRlcmF0aW9uTm9kZSwgTm9kZSk7XG5cbkl0ZXJhdGlvbk5vZGUucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuSXRlcmF0aW9uTm9kZS5wcm90b3R5cGUuaXNPcHRpb25hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5vcHRpb25hbDtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgTm9kZTogTm9kZSxcbiAgVGVybWluYWxOb2RlOiBUZXJtaW5hbE5vZGUsXG4gIE5vbnRlcm1pbmFsTm9kZTogTm9udGVybWluYWxOb2RlLFxuICBJdGVyYXRpb25Ob2RlOiBJdGVyYXRpb25Ob2RlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIFJldHVybiB0cnVlIGlmIHdlIHNob3VsZCBza2lwIHNwYWNlcyBwcmVjZWRpbmcgdGhpcyBleHByZXNzaW9uIGluIGEgc3ludGFjdGljIGNvbnRleHQuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID0gY29tbW9uLmFic3RyYWN0O1xuXG4vKlxuICBHZW5lcmFsbHksIHRoZXNlIGFyZSBhbGwgZmlyc3Qtb3JkZXIgZXhwcmVzc2lvbnMgdGhhdCBvcGVyYXRlIG9uIHN0cmluZ3MgYW5kICh3aXRoIHRoZVxuICBleGNlcHRpb24gb2YgQXBwbHkpIGRpcmVjdGx5IHJlYWQgZnJvbSB0aGUgaW5wdXQgc3RyZWFtLlxuKi9cbnBleHBycy5hbnkuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuZW5kLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKlxuICBIaWdoZXItb3JkZXIgZXhwcmVzc2lvbnMgdGhhdCBkb24ndCBkaXJlY3RseSBjb25zdW1lIGlucHV0LCBhbmQgZXhwcmVzc2lvbnMgdGhhdFxuICBkb24ndCBvcGVyYXRlIG9uIHN0cmluZyBpbnB1dCBzdHJlYW1zIChlLmcuIE9iaiBhbmQgQXJyKS5cbiovXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5BcnIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLk9iai5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLlNlcS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuVHlwZUNoZWNrLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5WYWx1ZS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGxleGlmeUNvdW50O1xuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgbGV4aWZ5Q291bnQgPSAwO1xuICB0aGlzLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG59O1xuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLmVuZC5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlByaW0ucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuVHlwZUNoZWNrLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkxleC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgbGV4aWZ5Q291bnQrKztcbiAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gIGxleGlmeUNvdW50LS07XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnRlcm1zW2lkeF0uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5Ob3QucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlZhbHVlLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZUJvZGllc1t0aGlzLnJ1bGVOYW1lXTtcblxuICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcnVsZSBleGlzdHMuLi5cbiAgaWYgKCFib2R5KSB7XG4gICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRSdWxlKHRoaXMucnVsZU5hbWUsIGdyYW1tYXIubmFtZSwgdGhpcy5pbnRlcnZhbCk7XG4gIH1cblxuICAvLyAuLi5hbmQgdGhhdCB0aGlzIGFwcGxpY2F0aW9uIGlzIGFsbG93ZWRcbiAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSAmJiAoIWNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkgfHwgbGV4aWZ5Q291bnQgPiAwKSkge1xuICAgIHRocm93IGVycm9ycy5hcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCh0aGlzLnJ1bGVOYW1lLCB0aGlzKTtcbiAgfVxuXG4gIC8vIC4uLmFuZCB0aGF0IHRoaXMgYXBwbGljYXRpb24gaGFzIHRoZSBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHNcbiAgdmFyIGFjdHVhbCA9IHRoaXMuYXJncy5sZW5ndGg7XG4gIHZhciBleHBlY3RlZCA9IGdyYW1tYXIucnVsZUZvcm1hbHNbdGhpcy5ydWxlTmFtZV0ubGVuZ3RoO1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mQXJndW1lbnRzKHRoaXMucnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHRoaXMpO1xuICB9XG5cbiAgLy8gLi4uYW5kIHRoYXQgYWxsIG9mIHRoZSBhcmd1bWVudCBleHByZXNzaW9ucyBvbmx5IGhhdmUgdmFsaWQgYXBwbGljYXRpb25zIGFuZCBoYXZlIGFyaXR5IDEuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnKSB7XG4gICAgYXJnLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgaWYgKGFyZy5nZXRBcml0eSgpICE9PSAxKSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW52YWxpZFBhcmFtZXRlcihzZWxmLnJ1bGVOYW1lLCBhcmcpO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYXJpdHkgPSB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgIHRlcm0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkoKTtcbiAgICB2YXIgb3RoZXJBcml0eSA9IHRlcm0uZ2V0QXJpdHkoKTtcbiAgICBpZiAoYXJpdHkgIT09IG90aGVyQXJpdHkpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgYXJpdHksIG90aGVyQXJpdHksIHRlcm0pO1xuICAgIH1cbiAgfVxufTtcblxucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBFeHRlbmQgaXMgYSBzcGVjaWFsIGNhc2Ugb2YgQWx0IHRoYXQncyBndWFyYW50ZWVkIHRvIGhhdmUgZXhhY3RseSB0d29cbiAgLy8gY2FzZXM6IFtleHRlbnNpb25zLCBvcmlnQm9keV0uXG4gIHZhciBhY3R1YWxBcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgdmFyIGV4cGVjdGVkQXJpdHkgPSB0aGlzLnRlcm1zWzFdLmdldEFyaXR5KCk7XG4gIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgIHRocm93IGVycm9ycy5pbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgZXhwZWN0ZWRBcml0eSwgYWN0dWFsQXJpdHksIHRoaXMudGVybXNbMF0pO1xuICB9XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcCAobm90IHJlcXVpcmVkIGIvYyB0aGUgbmVzdGVkIGV4cHIgZG9lc24ndCBzaG93IHVwIGluIHRoZSBDU1QpXG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuVmFsdWUucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnByb3BlcnRpZXNbaWR4XS5wYXR0ZXJuLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIFRoZSBhcml0aWVzIG9mIHRoZSBwYXJhbWV0ZXIgZXhwcmVzc2lvbnMgaXMgcmVxdWlyZWQgdG8gYmUgMSBieVxuICAvLyBgYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoKWAuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5lbmQuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMudGVybXNbaWR4XS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICAvLyBOb3RlOiB0aGlzIGlzIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIG1ldGhvZCBmb3IgYFN0YXJgIGFuZCBgUGx1c2AgZXhwcmVzc2lvbnMuXG4gIC8vIEl0IGlzIG92ZXJyaWRkZW4gZm9yIGBPcHRgIGJlbG93LlxuICB0aGlzLmV4cHIuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgaWYgKHRoaXMuZXhwci5pc051bGxhYmxlKGdyYW1tYXIpKSB7XG4gICAgdGhyb3cgZXJyb3JzLmtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQodGhpcywgcnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlZhbHVlLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcpIHtcbiAgICBhcmcuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBDaGVja3MgdGhhdCBubyBQRXhwciBjb21iaW5lcyBhIHZhbHVlIGV4cHJlc3Npb24gKGUuZy4sIGBudWxsYCwgYDNgKSB3aXRoIGEgc3RyaW5nIGZyYWdtZW50XG4vLyBleHByZXNzaW9uIChlLmcuLCBgXCJibGFoXCJgKS5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0VmFsdWVzQW5kU3RyaW5nc0FyZU5vdE1peGVkID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgdmFyIG1lbW8gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBtZW1vW3J1bGVOYW1lXSA9IHBleHBycy5UWVBFX0FOWTsgIC8vIEluaXRpYWxpemUgbWVtbyB0YWJsZSBmb3IgdGhlIHJ1bGUgd2UgYXJlIGNoZWNraW5nLlxuICB0aGlzLmdldEV4cHJUeXBlKGdyYW1tYXIsIG1lbW8pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIG5vZGVzID0gcmVxdWlyZSgnLi9ub2RlcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmNoZWNrID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55LmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFscy5sZW5ndGggPj0gMTtcbn07XG5cbnBleHBycy5lbmQuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09IHVuZGVmaW5lZDtcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdGhpcy5vYmo7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB0eXBlb2YgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdHlwZW9mIHRoaXMuZnJvbTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzLmxlbmd0aCA+PSAxO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50ZXJtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpXTtcbiAgICBpZiAodGVybS5jaGVjayhncmFtbWFyLCB2YWxzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2ldO1xuICAgIGlmIChmYWN0b3IuY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IGZhY3Rvci5nZXRBcml0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIHZhciBjb2x1bW5zID0gdmFscy5zbGljZSgwLCBhcml0eSk7XG4gIGlmIChjb2x1bW5zLmxlbmd0aCAhPT0gYXJpdHkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHJvd0NvdW50ID0gY29sdW1uc1swXS5sZW5ndGg7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgYXJpdHk7IGkrKykge1xuICAgIGlmIChjb2x1bW5zW2ldLmxlbmd0aCAhPT0gcm93Q291bnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xuICAgIHZhciByb3cgPSBbXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFyaXR5OyBqKyspIHtcbiAgICAgIHJvdy5wdXNoKGNvbHVtbnNbal1baV0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhwci5jaGVjayhncmFtbWFyLCByb3cpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5jaGVjayA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5jaGVjayA9XG5wZXhwcnMuVmFsdWUucHJvdG90eXBlLmNoZWNrID1cbnBleHBycy5BcnIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdGhpcy5leHByLmNoZWNrKGdyYW1tYXIsIHZhbHMpO1xufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHZhciBmaXhlZEFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICBpZiAodGhpcy5pc0xlbmllbnQpIHtcbiAgICBmaXhlZEFyaXR5LS07XG4gIH1cblxuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaXhlZEFyaXR5OyBpKyspIHtcbiAgICB2YXIgcGF0dGVybiA9IHRoaXMucHJvcGVydGllc1tpXS5wYXR0ZXJuO1xuICAgIGlmIChwYXR0ZXJuLmNoZWNrKGdyYW1tYXIsIHZhbHMuc2xpY2UocG9zKSkpIHtcbiAgICAgIHBvcyArPSBwYXR0ZXJuLmdldEFyaXR5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcy5pc0xlbmllbnQgPyB0eXBlb2YgdmFsc1twb3NdID09PSAnb2JqZWN0JyAmJiB2YWxzW3Bvc10gOiB0cnVlO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgaWYgKCEodmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgdmFsc1swXS5ncmFtbWFyID09PSBncmFtbWFyICYmXG4gICAgICAgIHZhbHNbMF0uY3Rvck5hbWUgPT09IHRoaXMucnVsZU5hbWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVE9ETzogdGhpbmsgYWJvdXQgKm5vdCogZG9pbmcgdGhlIGZvbGxvd2luZyBjaGVja3MsIGkuZS4sIHRydXN0aW5nIHRoYXQgdGhlIHJ1bGVcbiAgLy8gd2FzIGNvcnJlY3RseSBjb25zdHJ1Y3RlZC5cbiAgdmFyIHJ1bGVOb2RlID0gdmFsc1swXTtcbiAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVCb2RpZXNbdGhpcy5ydWxlTmFtZV07XG4gIHJldHVybiBib2R5LmNoZWNrKGdyYW1tYXIsIHJ1bGVOb2RlLmNoaWxkcmVuKSAmJiBydWxlTm9kZS5udW1DaGlsZHJlbigpID09PSBib2R5LmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB0eXBlb2YgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gJ3N0cmluZyc7XG59O1xuXG5wZXhwcnMuVHlwZUNoZWNrLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB0eXBlb2YgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdGhpcy50eXBlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0nKTtcbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIG5vZGVzID0gcmVxdWlyZSgnLi9ub2RlcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbnZhciBUZXJtaW5hbE5vZGUgPSBub2Rlcy5UZXJtaW5hbE5vZGU7XG52YXIgTm9udGVybWluYWxOb2RlID0gbm9kZXMuTm9udGVybWluYWxOb2RlO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSBub2Rlcy5JdGVyYXRpb25Ob2RlO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQSBzYWZlciB2ZXJzaW9uIG9mIGhhc093blByb3BlcnR5LlxudmFyIGhhc093blByb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKlxuICBFdmFsdWF0ZSB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJuIGB0cnVlYCBpZiBpdCBzdWNjZWVkcywgYGZhbHNlYCBvdGhlcndpc2UuIFRoaXMgbWV0aG9kIHNob3VsZFxuICBvbmx5IGJlIGNhbGxlZCBkaXJlY3RseSBieSBgU3RhdGUucHJvdG90eXBlLmV2YWwoZXhwcilgLCB3aGljaCBhbHNvIHVwZGF0ZXMgdGhlIGRhdGEgc3RydWN0dXJlc1xuICB0aGF0IGFyZSB1c2VkIGZvciB0cmFjaW5nLiAoTWFraW5nIHRob3NlIHVwZGF0ZXMgaW4gYSBtZXRob2Qgb2YgYFN0YXRlYCBlbmFibGVzIHRoZSB0cmFjZS1zcGVjaWZpY1xuICBkYXRhIHN0cnVjdHVyZXMgdG8gYmUgXCJzZWNyZXRzXCIgb2YgdGhhdCBjbGFzcywgd2hpY2ggaXMgZ29vZCBmb3IgbW9kdWxhcml0eS4pXG5cbiAgVGhlIGNvbnRyYWN0IG9mIHRoaXMgbWV0aG9kIGlzIGFzIGZvbGxvd3M6XG4gICogV2hlbiB0aGUgcmV0dXJuIHZhbHVlIGlzIGB0cnVlYCxcbiAgICAtIHRoZSBzdGF0ZSBvYmplY3Qgd2lsbCBoYXZlIGBleHByLmdldEFyaXR5KClgIG1vcmUgYmluZGluZ3MgdGhhbiBpdCBkaWQgYmVmb3JlIHRoZSBjYWxsLlxuICAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBgZmFsc2VgLFxuICAgIC0gdGhlIHN0YXRlIG9iamVjdCBtYXkgaGF2ZSBtb3JlIGJpbmRpbmdzIHRoYW4gaXQgZGlkIGJlZm9yZSB0aGUgY2FsbCwgYW5kXG4gICAgLSBpdHMgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gbWF5IGJlIGFueXdoZXJlLlxuXG4gIE5vdGUgdGhhdCBgU3RhdGUucHJvdG90eXBlLmV2YWwoZXhwcilgLCB1bmxpa2UgdGhpcyBtZXRob2QsIGd1YXJhbnRlZXMgdGhhdCBuZWl0aGVyIHRoZSBzdGF0ZVxuICBvYmplY3QncyBiaW5kaW5ncyBub3IgaXRzIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIHdpbGwgY2hhbmdlIGlmIHRoZSBleHByZXNzaW9uIGZhaWxzIHRvIG1hdGNoLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZXZhbCA9IGNvbW1vbi5hYnN0cmFjdDsgIC8vIGZ1bmN0aW9uKHN0YXRlKSB7IC4uLiB9XG5cbnBleHBycy5hbnkuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MpO1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB2YWx1ZSwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLmVuZC5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAoaW5wdXRTdHJlYW0uYXRFbmQoKSkge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKGlucHV0U3RyZWFtLnBvcyk7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHVuZGVmaW5lZCwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAodGhpcy5tYXRjaChpbnB1dFN0cmVhbSkgPT09IGNvbW1vbi5mYWlsKSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MpO1xuICAgIHZhciBwcmltaXRpdmVWYWx1ZSA9IHRoaXMub2JqO1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBwcmltaXRpdmVWYWx1ZSwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24oaW5wdXRTdHJlYW0pIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycgP1xuICAgICAgaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopIDpcbiAgICAgIGlucHV0U3RyZWFtLm1hdGNoRXhhY3RseSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBvYmogPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmICh0eXBlb2Ygb2JqID09PSB0eXBlb2YgdGhpcy5mcm9tICYmIHRoaXMuZnJvbSA8PSBvYmogJiYgb2JqIDw9IHRoaXMudG8pIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBpbnB1dFN0cmVhbS5pbnRlcnZhbChvcmlnUG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgb2JqLCBpbnRlcnZhbCkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlLmV2YWwoc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLmluZGV4XSk7XG59O1xuXG5wZXhwcnMuTGV4LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgc3RhdGUuZW50ZXJMZXhpZmllZENvbnRleHQoKTtcbiAgdmFyIGFucyA9IHN0YXRlLmV2YWwodGhpcy5leHByKTtcbiAgc3RhdGUuZXhpdExleGlmaWVkQ29udGV4dCgpO1xuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChzdGF0ZS5ldmFsKHRoaXMudGVybXNbaWR4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgaWYgKCFzdGF0ZS5ldmFsKGZhY3RvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICB2YXIgY29scyA9IFtdO1xuICB3aGlsZSAoY29scy5sZW5ndGggPCBhcml0eSkge1xuICAgIGNvbHMucHVzaChbXSk7XG4gIH1cbiAgdmFyIG51bU1hdGNoZXMgPSAwO1xuICB2YXIgaWR4O1xuICB3aGlsZSAobnVtTWF0Y2hlcyA8IHRoaXMubWF4TnVtTWF0Y2hlcyAmJiBzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICBudW1NYXRjaGVzKys7XG4gICAgdmFyIHJvdyA9IHN0YXRlLmJpbmRpbmdzLnNwbGljZShzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcm93Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGNvbHNbaWR4XS5wdXNoKHJvd1tpZHhdKTtcbiAgICB9XG4gIH1cbiAgaWYgKG51bU1hdGNoZXMgPCB0aGlzLm1pbk51bU1hdGNoZXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGludGVydmFsO1xuICBpZiAobnVtTWF0Y2hlcyA9PT0gMCkge1xuICAgIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcywgb3JpZ1Bvcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGZpcnN0Q29sID0gY29sc1swXTtcbiAgICB2YXIgbGFzdENvbCA9IGNvbHNbY29scy5sZW5ndGggLSAxXTtcbiAgICBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKFxuICAgICAgICBmaXJzdENvbFswXS5pbnRlcnZhbC5zdGFydElkeCxcbiAgICAgICAgbGFzdENvbFtsYXN0Q29sLmxlbmd0aCAtIDFdLmludGVydmFsLmVuZElkeCk7XG4gIH1cbiAgZm9yIChpZHggPSAwOyBpZHggPCBjb2xzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBJdGVyYXRpb25Ob2RlKHN0YXRlLmdyYW1tYXIsIGNvbHNbaWR4XSwgaW50ZXJ2YWwsXG4gICAgICB0aGlzIGluc3RhbmNlb2YgcGV4cHJzLk9wdCkpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIC8qXG4gICAgVE9ETzpcbiAgICAtIFJpZ2h0IG5vdyB3ZSdyZSBqdXN0IHRocm93aW5nIGF3YXkgYWxsIG9mIHRoZSBmYWlsdXJlcyB0aGF0IGhhcHBlbiBpbnNpZGUgYSBgbm90YCwgYW5kXG4gICAgICByZWNvcmRpbmcgYHRoaXNgIGFzIGEgZmFpbGVkIGV4cHJlc3Npb24uXG4gICAgLSBEb3VibGUgbmVnYXRpb24gc2hvdWxkIGJlIGVxdWl2YWxlbnQgdG8gbG9va2FoZWFkLCBidXQgdGhhdCdzIG5vdCB0aGUgY2FzZSByaWdodCBub3cgd3J0XG4gICAgICBmYWlsdXJlcy4gRS5nLiwgfn4nZm9vJyBwcm9kdWNlcyBhIGZhaWx1cmUgZm9yIH5+J2ZvbycsIGJ1dCBtYXliZSBpdCBzaG91bGQgcHJvZHVjZVxuICAgICAgYSBmYWlsdXJlIGZvciAnZm9vJyBpbnN0ZWFkLlxuICAqL1xuXG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGZhaWx1cmVzSW5mbyA9IHN0YXRlLmdldEZhaWx1cmVzSW5mbygpO1xuXG4gIHZhciBhbnMgPSBzdGF0ZS5ldmFsKHRoaXMuZXhwcik7XG5cbiAgc3RhdGUucmVzdG9yZUZhaWx1cmVzSW5mbyhmYWlsdXJlc0luZm8pO1xuICBpZiAoYW5zKSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAoc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcnIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgb2JqID0gc3RhdGUuaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgc3RhdGUucHVzaElucHV0U3RyZWFtKElucHV0U3RyZWFtLm5ld0ZvcihvYmopKTtcbiAgICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpICYmIHN0YXRlLmlucHV0U3RyZWFtLmF0RW5kKCk7XG4gICAgc3RhdGUucG9wSW5wdXRTdHJlYW0oKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlZhbHVlLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIG9iaiA9IHN0YXRlLmlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgc3RhdGUucHVzaElucHV0U3RyZWFtKElucHV0U3RyZWFtLm5ld0ZvcihvYmopKTtcbiAgICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpICYmIHN0YXRlLmlucHV0U3RyZWFtLmF0RW5kKCk7XG4gICAgc3RhdGUucG9wSW5wdXRTdHJlYW0oKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLk9iai5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9iaiA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKG9iaiAhPT0gY29tbW9uLmZhaWwgJiYgb2JqICYmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyB8fCB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nKSkge1xuICAgIHZhciBudW1Pd25Qcm9wZXJ0aWVzTWF0Y2hlZCA9IDA7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMucHJvcGVydGllc1tpZHhdO1xuICAgICAgaWYgKCFoYXNPd25Qcm9wLmNhbGwob2JqLCBwcm9wZXJ0eS5uYW1lKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB2YXIgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XG4gICAgICB2YXIgZXhwciA9IHByb3BlcnR5LnBhdHRlcm47XG4gICAgICBzdGF0ZS5wdXNoSW5wdXRTdHJlYW0oZXhwci5uZXdJbnB1dFN0cmVhbUZvcihbdmFsdWVdLCBzdGF0ZS5ncmFtbWFyKSk7XG4gICAgICB2YXIgbWF0Y2hlZCA9IHN0YXRlLmV2YWwoZXhwcikgJiYgc3RhdGUuaW5wdXRTdHJlYW0uYXRFbmQoKTtcbiAgICAgIHN0YXRlLnBvcElucHV0U3RyZWFtKCk7XG4gICAgICBpZiAoIW1hdGNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgbnVtT3duUHJvcGVydGllc01hdGNoZWQrKztcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgICB2YXIgcmVtYWluZGVyID0ge307XG4gICAgICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgICAgICBpZiAoaGFzT3duUHJvcC5jYWxsKG9iaiwgcCkgJiYgdGhpcy5wcm9wZXJ0aWVzLmluZGV4T2YocCkgPCAwKSB7XG4gICAgICAgICAgcmVtYWluZGVyW3BdID0gb2JqW3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgaW50ZXJ2YWwgPSBpbnB1dFN0cmVhbS5pbnRlcnZhbChvcmlnUG9zKTtcbiAgICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCByZW1haW5kZXIsIGludGVydmFsKSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bU93blByb3BlcnRpZXNNYXRjaGVkID09PSBPYmplY3Qua2V5cyhvYmopLmxlbmd0aDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgY2FsbGVyID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gIHZhciBhY3R1YWxzID0gY2FsbGVyID8gY2FsbGVyLmFyZ3MgOiBbXTtcbiAgdmFyIGFwcCA9IHRoaXMuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcblxuICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gIGlmIChwb3NJbmZvLmlzQWN0aXZlKGFwcCkpIHtcbiAgICAvLyBUaGlzIHJ1bGUgaXMgYWxyZWFkeSBhY3RpdmUgYXQgdGhpcyBwb3NpdGlvbiwgaS5lLiwgaXQgaXMgbGVmdC1yZWN1cnNpdmUuXG4gICAgcmV0dXJuIGFwcC5oYW5kbGVDeWNsZShzdGF0ZSk7XG4gIH1cblxuICB2YXIgbWVtb0tleSA9IGFwcC50b01lbW9LZXkoKTtcbiAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gIHJldHVybiBtZW1vUmVjICYmIHBvc0luZm8uc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykgP1xuICAgICAgc3RhdGUudXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykgOlxuICAgICAgYXBwLnJlYWxseUV2YWwoc3RhdGUpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5oYW5kbGVDeWNsZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBwb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gcG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcblxuICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24gJiYgY3VycmVudExlZnRSZWN1cnNpb24uaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpID09PSBtZW1vS2V5KSB7XG4gICAgLy8gV2UgYWxyZWFkeSBrbm93IGFib3V0IHRoaXMgbGVmdCByZWN1cnNpb24sIGJ1dCBpdCdzIHBvc3NpYmxlIHRoZXJlIGFyZSBcImludm9sdmVkXG4gICAgLy8gYXBwbGljYXRpb25zXCIgdGhhdCB3ZSBkb24ndCBhbHJlYWR5IGtub3cgYWJvdXQsIHNvLi4uXG4gICAgbWVtb1JlYy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMoKTtcbiAgfSBlbHNlIGlmICghbWVtb1JlYykge1xuICAgIC8vIE5ldyBsZWZ0IHJlY3Vyc2lvbiBkZXRlY3RlZCEgTWVtb2l6ZSBhIGZhaWx1cmUgdG8gdHJ5IHRvIGdldCBhIHNlZWQgcGFyc2UuXG4gICAgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtwb3M6IC0xLCB2YWx1ZTogZmFsc2V9O1xuICAgIHBvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHRoaXMsIG1lbW9SZWMpO1xuICB9XG4gIHJldHVybiBzdGF0ZS51c2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUucmVhbGx5RXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9yaWdQb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgdmFyIGJvZHkgPSBzdGF0ZS5ncmFtbWFyLnJ1bGVCb2RpZXNbdGhpcy5ydWxlTmFtZV07XG4gIHZhciBkZXNjcmlwdGlvbiA9IHN0YXRlLmdyYW1tYXIucnVsZURlc2NyaXB0aW9uc1t0aGlzLnJ1bGVOYW1lXTtcblxuICBvcmlnUG9zSW5mby5lbnRlcih0aGlzKTtcblxuICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgb3JpZ0ZhaWx1cmVzSW5mbyA9IHN0YXRlLmdldEZhaWx1cmVzSW5mbygpO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICB2YXIgaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gY3VycmVudExSICYmIGN1cnJlbnRMUi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXk7XG4gIHZhciBtZW1vaXplZCA9IHRydWU7XG5cbiAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgIHZhbHVlID0gdGhpcy5ncm93U2VlZFJlc3VsdChib2R5LCBzdGF0ZSwgb3JpZ1BvcywgY3VycmVudExSLCB2YWx1ZSk7XG4gICAgb3JpZ1Bvc0luZm8uZW5kTGVmdFJlY3Vyc2lvbigpO1xuICB9IGVsc2UgaWYgKGN1cnJlbnRMUiAmJiBjdXJyZW50TFIuaXNJbnZvbHZlZChtZW1vS2V5KSkge1xuICAgIC8vIERvbid0IG1lbW9pemUgdGhlIHJlc3VsdFxuICAgIG1lbW9pemVkID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtcbiAgICAgIHBvczogaW5wdXRTdHJlYW0ucG9zLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uOiBzdGF0ZS5jbG9uZVJpZ2h0bW9zdEZhaWx1cmVzKClcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgc3RhdGUucmVzdG9yZUZhaWx1cmVzSW5mbyhvcmlnRmFpbHVyZXNJbmZvKTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAobWVtb2l6ZWQpIHtcbiAgICAgIG9yaWdQb3NJbmZvLm1lbW9bbWVtb0tleV0uZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uID0gc3RhdGUuY2xvbmVSaWdodG1vc3RGYWlsdXJlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlY29yZCB0cmFjZSBpbmZvcm1hdGlvbiBpbiB0aGUgbWVtbyB0YWJsZSwgc28gdGhhdCBpdCBpcyBhdmFpbGFibGUgaWYgdGhlIG1lbW9pemVkIHJlc3VsdFxuICAvLyBpcyB1c2VkIGxhdGVyLlxuICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkgJiYgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSkge1xuICAgIHZhciBzdWNjZWVkZWQgPSAhIXZhbHVlO1xuICAgIHZhciBlbnRyeSA9IHN0YXRlLmdldFRyYWNlRW50cnkob3JpZ1BvcywgdGhpcywgc3VjY2VlZGVkLCBzdWNjZWVkZWQgPyBbdmFsdWVdIDogW10pO1xuICAgIGVudHJ5LmlzTGVmdFJlY3Vyc2l2ZSA9IGlzSGVhZE9mTGVmdFJlY3Vyc2lvbjtcbiAgICBvcmlnUG9zSW5mby5tZW1vW21lbW9LZXldLnRyYWNlRW50cnkgPSBlbnRyeTtcbiAgfVxuXG4gIG9yaWdQb3NJbmZvLmV4aXQoKTtcblxuICBpZiAodmFsdWUpIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG5cbiAgLy8gSWYgYG1hdGNoTm9kZXNgIGlzIHRydWUgYW5kIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBpbnB1dCBzdHJlYW0gaXMgYSBOb2RlIHdob3NlIHR5cGUgbWF0Y2hlc1xuICAvLyB0aGlzIHJ1bGUsIHRoZW4gYWNjZXB0IHRoYXQgYXMgYSB2YWxpZCBtYXRjaCAtLSBidXQgbm90IGZvciB0aGUgdG9wLWxldmVsIGFwcGxpY2F0aW9uLlxuICBpZiAoc3RhdGUubWF0Y2hOb2RlcyAmJiBzdGF0ZS5hcHBsaWNhdGlvblN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgbm9kZSA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgbm9kZS5ncmFtbWFyID09PSBzdGF0ZS5ncmFtbWFyICYmXG4gICAgICAgIG5vZGUuY3Rvck5hbWUgPT09IHRoaXMucnVsZU5hbWUpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIH1cbiAgfVxuXG4gIGlmIChzdGF0ZS5ldmFsKGV4cHIpKSB7XG4gICAgdmFyIGFyaXR5ID0gZXhwci5nZXRBcml0eSgpO1xuICAgIHZhciBiaW5kaW5ncyA9IHN0YXRlLmJpbmRpbmdzLnNwbGljZShzdGF0ZS5iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIHZhciBhbnMgPVxuICAgICAgICBuZXcgTm9udGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHRoaXMucnVsZU5hbWUsIGJpbmRpbmdzLCBpbnB1dFN0cmVhbS5pbnRlcnZhbChvcmlnUG9zKSk7XG4gICAgcmV0dXJuIGFucztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ3Jvd1NlZWRSZXN1bHQgPSBmdW5jdGlvbihib2R5LCBzdGF0ZSwgb3JpZ1BvcywgbHJNZW1vUmVjLCBuZXdWYWx1ZSkge1xuICBpZiAoIW5ld1ZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBsck1lbW9SZWMucG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGxyTWVtb1JlYy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGxyTWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24gPSBzdGF0ZS5jbG9uZVJpZ2h0bW9zdEZhaWx1cmVzKCk7XG5cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgIC8vIEJlZm9yZSBldmFsdWF0aW5nIHRoZSBib2R5IGFnYWluLCBhZGQgYSB0cmFjZSBub2RlIGZvciB0aGlzIGFwcGxpY2F0aW9uIHRvIHRoZSBtZW1vIGVudHJ5LlxuICAgICAgLy8gSXRzIG9ubHkgY2hpbGQgaXMgdGhlIHRyYWNlIG5vZGUgZnJvbSBgbmV3VmFsdWVgLCB3aGljaCB3aWxsIGFsd2F5cyBiZSB0aGUgbGFzdCBlbGVtZW50XG4gICAgICAvLyBpbiBgc3RhdGUudHJhY2VgLlxuICAgICAgdmFyIGNoaWxkcmVuID0gc3RhdGUudHJhY2Uuc2xpY2UoLTEpO1xuICAgICAgbHJNZW1vUmVjLnRyYWNlRW50cnkgPSBuZXcgVHJhY2UoXG4gICAgICAgICAgc3RhdGUuaW5wdXRTdHJlYW0sIG9yaWdQb3MsIHRoaXMsIHRydWUsIFtuZXdWYWx1ZV0sIGNoaWxkcmVuKTtcbiAgICB9XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICBuZXdWYWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgc3RhdGUpO1xuICAgIGlmIChpbnB1dFN0cmVhbS5wb3MgPD0gbHJNZW1vUmVjLnBvcykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgIHN0YXRlLnRyYWNlLnBvcCgpOyAgLy8gRHJvcCBsYXN0IHRyYWNlIGVudHJ5IHNpbmNlIGB2YWx1ZWAgd2FzIHVudXNlZC5cbiAgICBsck1lbW9SZWMudHJhY2VFbnRyeSA9IG51bGw7XG4gIH1cbiAgaW5wdXRTdHJlYW0ucG9zID0gbHJNZW1vUmVjLnBvcztcbiAgcmV0dXJuIGxyTWVtb1JlYy52YWx1ZTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIHZhbHVlID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAodmFsdWUgPT09IGNvbW1vbi5mYWlsIHx8ICF0aGlzLnBhdHRlcm4udGVzdCh2YWx1ZSkpIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcyk7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHZhbHVlLCBpbnRlcnZhbCkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5wZXhwcnMuVHlwZUNoZWNrLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgdmFsdWUgPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09IHRoaXMudHlwZSkge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MpO1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB2YWx1ZSwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXRBcml0eSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5nZXRBcml0eSA9XG5wZXhwcnMuZW5kLmdldEFyaXR5ID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuVHlwZUNoZWNrLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAxO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBhcml0eSAtLSB0aGlzIHByb3BlcnR5IGlzXG4gIC8vIGNoZWNrZWQgYnkgdGhlIEdyYW1tYXIgY29uc3RydWN0b3IuXG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IDAgOiB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXJpdHkgPSAwO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIGFyaXR5ICs9IHRoaXMuZmFjdG9yc1tpZHhdLmdldEFyaXR5KCk7XG4gIH1cbiAgcmV0dXJuIGFyaXR5O1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAwO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLlZhbHVlLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXJpdHkgPSB0aGlzLmlzTGVuaWVudCA/IDEgOiAwO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGFyaXR5ICs9IHRoaXMucHJvcGVydGllc1tpZHhdLnBhdHRlcm4uZ2V0QXJpdHkoKTtcbiAgfVxuICByZXR1cm4gYXJpdHk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gdHlwZUZyb21QcmltaXRpdmUocHJpbSkge1xuICByZXR1cm4gdHlwZW9mIHByaW0gPT09ICdzdHJpbmcnID8gcGV4cHJzLlRZUEVfU1RSSU5HIDogcGV4cHJzLlRZUEVfVkFMVUU7XG59XG5cbi8qXG4gIFJldHVybnMgdGhlIHR5cGUgb2YgdGhpcyBQRXhwciAtLSBvbmUgb2YgYFRZUEVfU1RSSU5HYCwgYFRZUEVfVkFMVUVgLCBvciBgVFlQRV9BTllgLlxuICBTdHJpbmcgZXhwcmVzc2lvbnMgKGUuZy4gYFwiZm9vXCJgKSBhbmQgdmFsdWUgZXhwcmVzc2lvbnMgKGUuZy4sIGBudWxsYCwgYDNgKSBjYW5ub3QgYmUgY29tYmluZWRcbiAgd2l0aCBlYWNoIG90aGVyLCBidXQgdGhleSBtYXkgYmUgY29tYmluZWQgd2l0aCBUWVBFX0FOWSBleHByZXNzaW9ucy4gQW4gZXhjZXB0aW9uIGlzIHRocm93biBpZlxuICBhbiBleHByZXNzaW9uIHdpdGggaW5jb25zaXN0ZW50IHR5cGVzIGlzIGVuY291bnRlcmVkLlxuXG4gIFRoZSByZXN1bHQgb2YgdGhpcyBtZXRob2QgaXMgY2FjaGVkIGFzIGEgcHJvcGVydHkgb24gdGhlIG5vZGUuIEZvciBydWxlIGFwcGxpY2F0aW9ucywgdGhlXG4gIHJlc3VsdCBpcyBjYWNoZWQgaW4gYSBzZXBhcmF0ZSBtZW1vIHRhYmxlLCBzbyB0aGF0IHRoZSByZXN1bHQgY2FuIGJlIHNoYXJlZCBmb3IgYWxsIGBBcHBseWBcbiAgbm9kZXMgaGF2aW5nIHRoZSBzYW1lIHBhcmFtZXRlcnMuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXRFeHByVHlwZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG9wdE1lbW8pIHtcbiAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KCdfZXhwclR5cGUnKSkge1xuICAgIHZhciBtZW1vID0gb3B0TWVtbyB8fCBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2V4cHJUeXBlJywge1xuICAgICAgdmFsdWU6IHRoaXMuX2NhbGN1bGF0ZUV4cHJUeXBlKGdyYW1tYXIsIG1lbW8pXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2V4cHJUeXBlO1xufTtcblxuLypcbiAgVGhlIGFjdHVhbCBpbXBsZW1lbnRhdGlvbiBvZiBnZXRFeHByVHlwZSwgd2l0aCBubyBjYWNoaW5nIGxvZ2ljLiBUaGVzZSBpbXBsZW1lbnRhdGlvbnNcbiAgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCBkaXJlY3RseSBieSB0aGUgaW1wbGVtZW50YXRpb24gb2YgZ2V0RXhwclR5cGUgYWJvdmUuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5fY2FsY3VsYXRlRXhwclR5cGUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuX2NhbGN1bGF0ZUV4cHJUeXBlID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gcGV4cHJzLlRZUEVfU1RSSU5HO1xufTtcblxucGV4cHJzLmVuZC5fY2FsY3VsYXRlRXhwclR5cGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiBwZXhwcnMuVFlQRV9BTlk7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9jYWxjdWxhdGVFeHByVHlwZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHR5cGVGcm9tUHJpbWl0aXZlKHRoaXMuZnJvbSkgfCB0eXBlRnJvbVByaW1pdGl2ZSh0aGlzLnRvKTtcbn07XG5cbnBleHBycy5BcnIucHJvdG90eXBlLl9jYWxjdWxhdGVFeHByVHlwZSA9XG5wZXhwcnMuT2JqLnByb3RvdHlwZS5fY2FsY3VsYXRlRXhwclR5cGUgPVxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID1cbnBleHBycy5WYWx1ZS5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gcGV4cHJzLlRZUEVfVkFMVUU7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdHlwZUZyb21QcmltaXRpdmUodGhpcy5vYmopO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICB2YXIgYW5zID0gdGhpcy50ZXJtcy5yZWR1Y2UoZnVuY3Rpb24oYWNjLCB0KSB7XG4gICAgcmV0dXJuIGFjYyB8IHQuZ2V0RXhwclR5cGUoZ3JhbW1hciwgbWVtbyk7XG4gIH0sIDApO1xuICBpZiAoYW5zID09PSBwZXhwcnMuVFlQRV9JTkNPTlNJU1RFTlQpIHtcbiAgICB0aHJvdyBlcnJvcnMuZXhwck1peGVzVmFsdWVBbmRTdHJpbmdFeHByZXNzaW9ucyh0aGlzKTtcbiAgfVxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICB2YXIgYW5zID0gdGhpcy5mYWN0b3JzLnJlZHVjZShmdW5jdGlvbihhY2MsIGYpIHtcbiAgICByZXR1cm4gYWNjIHwgZi5nZXRFeHByVHlwZShncmFtbWFyLCBtZW1vKTtcbiAgfSwgMCk7XG4gIGlmIChhbnMgPT09IHBleHBycy5UWVBFX0lOQ09OU0lTVEVOVCkge1xuICAgIHRocm93IGVycm9ycy5leHByTWl4ZXNWYWx1ZUFuZFN0cmluZ0V4cHJlc3Npb25zKHRoaXMpO1xuICB9XG4gIHJldHVybiBhbnM7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLl9jYWxjdWxhdGVFeHByVHlwZSA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5fY2FsY3VsYXRlRXhwclR5cGUgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy5leHByLmdldEV4cHJUeXBlKGdyYW1tYXIsIG1lbW8pO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5fY2FsY3VsYXRlRXhwclR5cGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIC8vIFRocm93aW5nIGFuIGVycm9yIGhlcmUgZW5zdXJlcyB0aGF0IHdlIG5ldmVyIGNhbGN1bGF0ZSBhbmQgY2FjaGUgdGhlIHJlc3VsdCBvZiBhblxuICAvLyBleHByZXNzaW9uIGNvbnRhaW5pbmcgdW5ib3VuZCBwYXJhbWV0ZXJzLCBiZWNhdXNlIGl0IGNvdWxkIGJlIGluY29ycmVjdC5cbiAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgY2FsY3VsYXRlIF9jYWxjdWxhdGVFeHByVHlwZSBmb3IgdW5ib3VuZCBwYXJhbWV0ZXInKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2NhbGN1bGF0ZUV4cHJUeXBlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICB2YXIga2V5ID0gdGhpcy50b01lbW9LZXkoKTtcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtbywga2V5KSkge1xuICAgIHZhciBpbmxpbmVkQm9keSA9IGdyYW1tYXIucnVsZUJvZGllc1t0aGlzLnJ1bGVOYW1lXS5zdWJzdGl0dXRlUGFyYW1zKHRoaXMuYXJncyk7XG5cbiAgICAvLyBJbml0aWFsaXplIGEgbWVtbyB2YWx1ZSB0byBwcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvbiBmb3IgcmVjdXJzaXZlIHJ1bGVzLlxuICAgIC8vIFVzZSBUWVBFX0FOWSBiZWNhdXNlIGl0IGlzIHRoZSBpZGVudGl0eSBvZiB0aGUgYml0d2lzZSAnb3InIG9wZXJhdG9yLCBlbnN1cmluZyB0aGF0IGEgcnVsZVxuICAgIC8vIGxpa2UgJ3ggPSB4IHwgU3RyaW5nJyB3aWxsIHJldHVybiBgVFlQRV9TVFJJTkdgLlxuICAgIG1lbW9ba2V5XSA9IHBleHBycy5UWVBFX0FOWTtcblxuICAgIG1lbW9ba2V5XSA9IGlubGluZWRCb2R5LmdldEV4cHJUeXBlKGdyYW1tYXIsIG1lbW8pO1xuICB9XG4gIHJldHVybiBtZW1vW2tleV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIENhbGxlZCBhdCBncmFtbWFyIGNyZWF0aW9uIHRpbWUgdG8gcmV3cml0ZSBhIHJ1bGUgYm9keSwgcmVwbGFjaW5nIGVhY2ggcmVmZXJlbmNlIHRvIGEgZm9ybWFsXG4gIHBhcmFtZXRlciB3aXRoIGEgYFBhcmFtYCBub2RlLiBSZXR1cm5zIGEgUEV4cHIgLS0gZWl0aGVyIGEgbmV3IG9uZSwgb3IgdGhlIG9yaWdpbmFsIG9uZSBpZlxuICBpdCB3YXMgbW9kaWZpZWQgaW4gcGxhY2UuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5lbmQuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5QcmltLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy50ZXJtcy5mb3JFYWNoKGZ1bmN0aW9uKHRlcm0sIGlkeCwgdGVybXMpIHtcbiAgICB0ZXJtc1tpZHhdID0gdGVybS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy5mYWN0b3JzLmZvckVhY2goZnVuY3Rpb24oZmFjdG9yLCBpZHgsIGZhY3RvcnMpIHtcbiAgICBmYWN0b3JzW2lkeF0gPSBmYWN0b3IuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Ob3QucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5WYWx1ZS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5BcnIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy5leHByID0gdGhpcy5leHByLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuT2JqLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5LCBpZHgpIHtcbiAgICBwcm9wZXJ0eS5wYXR0ZXJuID0gcHJvcGVydHkucGF0dGVybi5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB2YXIgaW5kZXggPSBmb3JtYWxzLmluZGV4T2YodGhpcy5ydWxlTmFtZSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBUT0RPOiBTaG91bGQgdGhpcyBiZSBzdXBwb3J0ZWQ/IFNlZSBpc3N1ZSAjNjQuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlcml6ZWQgcnVsZXMgY2Fubm90IGJlIHBhc3NlZCBhcyBhcmd1bWVudHMgdG8gYW5vdGhlciBydWxlLicpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnLCBpZHgsIGFyZ3MpIHtcbiAgICAgIGFyZ3NbaWR4XSA9IGFyZy5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBwYXJzaW5nIGV4cHJlc3Npb24gbWF5IGFjY2VwdCB3aXRob3V0IGNvbnN1bWluZyBhbnkgaW5wdXQuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmlzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiB0aGlzLl9pc051bGxhYmxlKGdyYW1tYXIsIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlBsdXMucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5WYWx1ZS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLk9iai5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLmVuZC5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIGlmICh0eXBlb2YgdGhpcy5vYmogPT09ICdzdHJpbmcnKSB7XG4gICAgLy8gVGhpcyBpcyBhbiBvdmVyLXNpbXBsaWZpY2F0aW9uOiBpdCdzIG9ubHkgY29ycmVjdCBpZiB0aGUgaW5wdXQgaXMgYSBzdHJpbmcuIElmIGl0J3MgYW4gYXJyYXlcbiAgICAvLyBvciBhbiBvYmplY3QsIHRoZW4gdGhlIGVtcHR5IHN0cmluZyBwYXJzaW5nIGV4cHJlc3Npb24gaXMgbm90IG51bGxhYmxlLlxuICAgIHJldHVybiB0aGlzLm9iaiA9PT0gJyc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwIHx8XG4gICAgICB0aGlzLnRlcm1zLnNvbWUoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTsgfSk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRoaXMuZmFjdG9ycy5ldmVyeShmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTsgfSk7XG59O1xuXG5wZXhwcnMuU3Rhci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLk9wdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkxleC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICB2YXIga2V5ID0gdGhpcy50b01lbW9LZXkoKTtcbiAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtbywga2V5KSkge1xuICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlQm9kaWVzW3RoaXMucnVsZU5hbWVdO1xuICAgIHZhciBpbmxpbmVkID0gYm9keS5zdWJzdGl0dXRlUGFyYW1zKHRoaXMuYXJncyk7XG4gICAgbWVtb1trZXldID0gZmFsc2U7ICAvLyBQcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvbiBmb3IgcmVjdXJzaXZlIHJ1bGVzLlxuICAgIG1lbW9ba2V5XSA9IGlubGluZWQuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gIH1cbiAgcmV0dXJuIG1lbW9ba2V5XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gZXNjYXBlU3RyaW5nKHN0cikge1xuICB2YXIgb3V0cHV0ID0gSlNPTi5zdHJpbmdpZnkoc3RyKTtcbiAgb3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoL1tcXHUyMDI4XFx1MjAyOV0vZywgZnVuY3Rpb24oY2hhciwgcG9zLCBzdHIpIHtcbiAgICB2YXIgaGV4ID0gY2hhci5jb2RlUG9pbnRBdCgwKS50b1N0cmluZygxNik7XG4gICAgcmV0dXJuICdcXFxcdScgKyAnMDAwMCcuc2xpY2UoaGV4Lmxlbmd0aCkgKyBoZXg7XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5mdW5jdGlvbiBnZXRJbnRlcnZhbEluZm8oZXhwciwgZ3JhbW1hckludGVydmFsKSB7XG4gIGlmIChleHByLmludGVydmFsICYmIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHZhciBhZGp1c3RlZCA9IGV4cHIuaW50ZXJ2YWwucmVsYXRpdmVUbyhncmFtbWFySW50ZXJ2YWwpO1xuICAgIHZhciBzdGFydCA9IGFkanVzdGVkLnN0YXJ0SWR4O1xuICAgIHZhciBlbmQgPSBhZGp1c3RlZC5lbmRJZHg7XG4gICAgcmV0dXJuICcud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoJyArIHN0YXJ0ICsgJywgJyArIGVuZCArICcpKSc7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ3Nob3VsZCBuZXZlciBvdXRwdXQgYSByZWNpcGUgZm9yIGBhbnlgIGV4cHJlc3Npb24nKTtcbn07XG5cbnBleHBycy5lbmQub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ3Nob3VsZCBuZXZlciBvdXRwdXQgYSByZWNpcGUgZm9yIGBlbmRgIGV4cHJlc3Npb24nKTtcbn07XG5cbnBleHBycy5QcmltLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5wcmltKCcpO1xuICBzYi5hcHBlbmQodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJyA/IGVzY2FwZVN0cmluZyh0aGlzLm9iaikgOiAnJyArIHRoaXMub2JqKTtcbiAgc2IuYXBwZW5kKCcpJyArIGdldEludGVydmFsSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpKTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICBzYi5hcHBlbmQoJ3RoaXMucmFuZ2UoJyk7XG4gIHNiLmFwcGVuZChKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pKTtcbiAgc2IuYXBwZW5kKCcsICcpO1xuICBzYi5hcHBlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy50bykpO1xuICBzYi5hcHBlbmQoJyknICsgZ2V0SW50ZXJ2YWxJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCkpO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5wYXJhbSgnICsgdGhpcy5pbmRleCArICcpJyArIGdldEludGVydmFsSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpKTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLmFsdCgnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICB9XG4gICAgdGhpcy50ZXJtc1tpZHhdLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgfVxuICBzYi5hcHBlbmQoJyknICsgZ2V0SW50ZXJ2YWxJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCkpO1xufTtcblxucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICB2YXIgZXh0ZW5zaW9uID0gdGhpcy50ZXJtc1swXTsgLy8gW2V4dGVuc2lvbiwgb3JnaW5hbF1cbiAgZXh0ZW5zaW9uLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnNlcSgnKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgc2IuYXBwZW5kKCcsICcpO1xuICAgIH1cbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gIH1cbiAgc2IuYXBwZW5kKCcpJyArIGdldEludGVydmFsSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpKTtcbn07XG5cbnBleHBycy5TdGFyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxucGV4cHJzLlBsdXMucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuT3B0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbnBleHBycy5MZXgucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy4nICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLnRvTG93ZXJDYXNlKCkgKyAnKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xuICBzYi5hcHBlbmQoJyknICsgZ2V0SW50ZXJ2YWxJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCkpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICBzYi5hcHBlbmQoJ3RoaXMubGEoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gIHNiLmFwcGVuZCgnKScgKyBnZXRJbnRlcnZhbEluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSk7XG59O1xuXG5wZXhwcnMuVmFsdWUucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnZhbCgnKTtcbiAgdGhpcy5leHByLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgc2IuYXBwZW5kKCcpJyArIGdldEludGVydmFsSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgZnVuY3Rpb24gb3V0cHV0UHJvcGVydHlSZWNpcGUocHJvcCkge1xuICAgIHNiLmFwcGVuZCgne25hbWU6ICcpO1xuICAgIHNiLmFwcGVuZChKU09OLnN0cmluZ2lmeShwcm9wLm5hbWUpKTtcbiAgICBzYi5hcHBlbmQoJywgcGF0dGVybjogJyk7XG4gICAgcHJvcC5wYXR0ZXJuLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgICBzYi5hcHBlbmQoJ30nKTtcbiAgfVxuXG4gIHNiLmFwcGVuZCgndGhpcy5vYmooWycpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgfVxuICAgIG91dHB1dFByb3BlcnR5UmVjaXBlKHRoaXMucHJvcGVydGllc1tpZHhdKTtcbiAgfVxuICBzYi5hcHBlbmQoJ10sICcpO1xuICBzYi5hcHBlbmQoISF0aGlzLmlzTGVuaWVudCk7XG4gIHNiLmFwcGVuZCgnKScgKyBnZXRJbnRlcnZhbEluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLmFwcCgnKTtcbiAgc2IuYXBwZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMucnVsZU5hbWUpKTtcbiAgaWYgKHRoaXMucnVsZU5hbWUuaW5kZXhPZignXycpID49IDAgJiYgZm9ybWFscy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIGFwcHMgPSBmb3JtYWxzLlxuICAgICAgICBtYXAoZnVuY3Rpb24oXywgaWR4KSB7IHJldHVybiAndGhpcy5wYXJhbSgnICsgaWR4ICsgJyknOyB9KTtcbiAgICBzYi5hcHBlbmQoJywgWycgKyBhcHBzLmpvaW4oJywgJykgKyAnXScpO1xuICB9IGVsc2UgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgc2IuYXBwZW5kKCcsIFsnKTtcbiAgICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcsIGlkeCkge1xuICAgICAgaWYgKGlkeCA+IDApIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsICcpO1xuICAgICAgfVxuICAgICAgYXJnLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgICB9KTtcbiAgICBzYi5hcHBlbmQoJ10nKTtcbiAgfVxuICBzYi5hcHBlbmQoJyknICsgZ2V0SW50ZXJ2YWxJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCkpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBSZXR1cm5zIGEgUEV4cHIgdGhhdCByZXN1bHRzIGZyb20gcmVjdXJzaXZlbHkgcmVwbGFjaW5nIGV2ZXJ5IGZvcm1hbCBwYXJhbWV0ZXIgKGkuZS4sIGluc3RhbmNlXG4gIG9mIGBQYXJhbWApIGluc2lkZSB0aGlzIFBFeHByIHdpdGggaXRzIGFjdHVhbCB2YWx1ZSBmcm9tIGBhY3R1YWxzYCAoYW4gQXJyYXkpLlxuXG4gIFRoZSByZWNlaXZlciBtdXN0IG5vdCBiZSBtb2RpZmllZDsgYSBuZXcgUEV4cHIgbXVzdCBiZSByZXR1cm5lZCBpZiBhbnkgcmVwbGFjZW1lbnQgaXMgbmVjZXNzYXJ5LlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdDsgIC8vIGZ1bmN0aW9uKGFjdHVhbHMpIHsgLi4uIH1cblxucGV4cHJzLmFueS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5lbmQuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuUHJpbS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlByaW0ucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gYWN0dWFsc1t0aGlzLmluZGV4XTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBuZXcgcGV4cHJzLkFsdChcbiAgICAgIHRoaXMudGVybXMubWFwKGZ1bmN0aW9uKHRlcm0pIHsgcmV0dXJuIHRlcm0uc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSkpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyBwZXhwcnMuU2VxKFxuICAgICAgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KSk7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuVmFsdWUucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLkFyci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5wcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBwcm9wZXJ0eS5uYW1lLFxuICAgICAgcGF0dGVybjogcHJvcGVydHkucGF0dGVybi5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBuZXcgcGV4cHJzLk9iaihwcm9wZXJ0aWVzLCB0aGlzLmlzTGVuaWVudCk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIGlmICh0aGlzLmFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gQXZvaWQgbWFraW5nIGEgY29weSBvZiB0aGlzIGFwcGxpY2F0aW9uLCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICByZXR1cm4gdGhpcztcbiAgfSBlbHNlIHtcbiAgICB2YXIgYXJncyA9IHRoaXMuYXJncy5tYXAoZnVuY3Rpb24oYXJnKSB7IHJldHVybiBhcmcuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSk7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkodGhpcy5ydWxlTmFtZSwgYXJncyk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG52YXIgY29weVdpdGhvdXREdXBsaWNhdGVzID0gY29tbW9uLmNvcHlXaXRob3V0RHVwbGljYXRlcztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIFJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgYXJndW1lbnQgbmFtZXMgZm9yIGl0cyByZWNlaXZlclxuICAoYSBwZXhwcikgaW4gYSBzZW1hbnRpYyBhY3Rpb24uIFRoaXMgaXMgdXNlZCBleGNsdXNpdmVseSBieSB0aGUgU2VtYW50aWNzIEVkaXRvci5cblxuICBgZmlyc3RBcmdJbmRleGAgaXMgdGhlIDEtYmFzZWQgaW5kZXggb2YgdGhlIGZpcnN0IGFyZ3VtZW50IG5hbWUgdGhhdCB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgdGhpc1xuICBwZXhwci4gSXQgZW5hYmxlcyB1cyB0byBuYW1lIGFyZ3VtZW50cyBwb3NpdGlvbmFsbHksIGUuZy4sIGlmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgYVxuICBub24tYWxwaGFudW1lcmljIHRlcm1pbmFsIGxpa2UgXCIrXCIsIGl0IHdpbGwgYmUgbmFtZWQgJyQyJy5cblxuICBIZXJlIGlzIGEgbW9yZSBlbGFib3JhdGUgZXhhbXBsZSB0aGF0IGlsbHVzdHJhdGVzIGhvdyB0aGlzIG1ldGhvZCB3b3JrczpcbiAgYChhIFwiK1wiIGIpLnRvQXJndW1lbnROYW1lTGlzdCgxKWAgZXZhbHVhdGVzIHRvIGBbJ2EnLCAnJDInLCAnYiddYCB3aXRoIHRoZSBmb2xsb3dpbmcgcmVjdXJzaXZlXG4gIGNhbGxzOlxuXG4gICAgKGEpLnRvQXJndW1lbnROYW1lTGlzdCgxKSAtPiBbJ2EnXSxcbiAgICAoXCIrXCIpLnRvQXJndW1lbnROYW1lTGlzdCgyKSAtPiBbJyQyJ10sXG4gICAgKGIpLnRvQXJndW1lbnROYW1lTGlzdCgzKSAtPiBbJ2InXVxuXG4gIE5vdGVzOlxuICAqIFRoaXMgbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgb24gd2VsbC1mb3JtZWQgZXhwcmVzc2lvbnMsIGUuZy4sIHRoZSByZWNlaXZlciBtdXN0XG4gICAgbm90IGhhdmUgYW55IEFsdCBzdWItZXhwcmVzc2lvbnMgd2l0aCBpbmNvbnNpc3RlbnQgYXJpdGllcy5cbiAgKiBlLmdldEFyaXR5KCkgPT09IGUudG9Bcmd1bWVudE5hbWVMaXN0KDEpLmxlbmd0aFxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gY29tbW9uLmFic3RyYWN0OyAgLy8gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkgeyAuLi4gfVxuXG5wZXhwcnMuYW55LnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIFsnYW55J107XG59O1xuXG5wZXhwcnMuZW5kLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIFsnZW5kJ107XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJyAmJiAvXltfYS16QS1aMC05XSskLy50ZXN0KHRoaXMub2JqKSkge1xuICAgIC8vIElmIHRoaXMgdGVybWluYWwgaXMgYSB2YWxpZCBzdWZmaXggZm9yIGEgSlMgaWRlbnRpZmllciwganVzdCBwcmVwZW5kIGl0IHdpdGggJ18nXG4gICAgcmV0dXJuIFsnXycgKyB0aGlzLm9ial07XG4gIH0gZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlLCBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICByZXR1cm4gWyckJyArIGZpcnN0QXJnSW5kZXhdO1xuICB9XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgdmFyIGFyZ05hbWUgPSB0aGlzLmZyb20gKyAnX3RvXycgKyB0aGlzLnRvO1xuICAvLyBJZiB0aGUgYGFyZ05hbWVgIGRvZXNuJ3Qgc3RhcnQgd2l0aCBhbiB2YWxpZCBjaGFyYWN0ZXIsIGkuZS4gYWxwaGFiZXQgb3IgYF9gLFxuICAvLyB0aGVuIHByZXBlbmRpbmcgYSBgX2AgdG8gaXQuXG4gIGlmICghL1tfJGEtekEtWl0vLnRlc3QoYXJnTmFtZVswXSkpIHtcbiAgICBhcmdOYW1lID0gJ18nICsgYXJnTmFtZTtcbiAgfVxuICByZXR1cm4gW2FyZ05hbWVdO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICAvLyBgdGVybUFyZ05hbWVMaXN0c2AgaXMgYW4gYXJyYXkgb2YgYXJyYXlzIHdoZXJlIGVhY2ggcm93IGlzIHRoZVxuICAvLyBhcmd1bWVudCBuYW1lIGxpc3QgdGhhdCBjb3JyZXNwb25kcyB0byBhIHRlcm0gaW4gdGhpcyBhbHRlcm5hdGlvbi5cbiAgdmFyIHRlcm1BcmdOYW1lTGlzdHMgPSB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7XG4gICAgcmV0dXJuIHRlcm0udG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgpO1xuICB9KTtcblxuICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICB2YXIgbnVtQXJncyA9IHRlcm1BcmdOYW1lTGlzdHNbMF0ubGVuZ3RoO1xuICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBudW1BcmdzOyBjb2xJZHgrKykge1xuICAgIHZhciBjb2wgPSBbXTtcbiAgICBmb3IgKHZhciByb3dJZHggPSAwOyByb3dJZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgcm93SWR4KyspIHtcbiAgICAgIGNvbC5wdXNoKHRlcm1BcmdOYW1lTGlzdHNbcm93SWR4XVtjb2xJZHhdKTtcbiAgICB9XG4gICAgdmFyIHVuaXF1ZU5hbWVzID0gY29weVdpdGhvdXREdXBsaWNhdGVzKGNvbCk7XG4gICAgYXJndW1lbnROYW1lTGlzdC5wdXNoKHVuaXF1ZU5hbWVzLmpvaW4oJ19vcl8nKSk7XG4gIH1cblxuICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgLy8gR2VuZXJhdGUgdGhlIGFyZ3VtZW50IG5hbWUgbGlzdCwgd2l0aG91dCB3b3JyeWluZyBhYm91dCBkdXBsaWNhdGVzLlxuICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmdW5jdGlvbihmYWN0b3IpIHtcbiAgICB2YXIgZmFjdG9yQXJndW1lbnROYW1lTGlzdCA9IGZhY3Rvci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCk7XG4gICAgYXJndW1lbnROYW1lTGlzdCA9IGFyZ3VtZW50TmFtZUxpc3QuY29uY2F0KGZhY3RvckFyZ3VtZW50TmFtZUxpc3QpO1xuXG4gICAgLy8gU2hpZnQgdGhlIGZpcnN0QXJnSW5kZXggdG8gdGFrZSB0aGlzIGZhY3RvcidzIGFyZ3VtZW50IG5hbWVzIGludG8gYWNjb3VudC5cbiAgICBmaXJzdEFyZ0luZGV4ICs9IGZhY3RvckFyZ3VtZW50TmFtZUxpc3QubGVuZ3RoO1xuICB9KTtcblxuICAvLyBgY291bnRgIGlzIHVzZWQgdG8gcmVjb3JkIHRoZSBudW1iZXIgb2YgdGltZXMgZWFjaCBhcmd1bWVudCBuYW1lIG9jY3VycyBpbiB0aGUgbGlzdCxcbiAgLy8gdGhpcyBpcyB1c2VmdWwgZm9yIGNoZWNraW5nIGR1cGxpY2F0ZWQgYXJndW1lbnQgbmFtZS4gSXQgbWFwcyBhcmd1bWVudCBuYW1lcyB0byBpbnRzLlxuICB2YXIgY291bnQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICBhcmd1bWVudE5hbWVMaXN0LmZvckVhY2goZnVuY3Rpb24oYXJnTmFtZSkge1xuICAgIGNvdW50W2FyZ05hbWVdID0gKGNvdW50W2FyZ05hbWVdIHx8IDApICsgMTtcbiAgfSk7XG5cbiAgLy8gQXBwZW5kIHN1YnNjcmlwdHMgKCdfMScsICdfMicsIC4uLikgdG8gZHVwbGljYXRlIGFyZ3VtZW50IG5hbWVzLlxuICBPYmplY3Qua2V5cyhjb3VudCkuZm9yRWFjaChmdW5jdGlvbihkdXBBcmdOYW1lKSB7XG4gICAgaWYgKGNvdW50W2R1cEFyZ05hbWVdIDw9IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGlzIG5hbWUgc2hvd3MgdXAgbW9yZSB0aGFuIG9uY2UsIHNvIGFkZCBzdWJzY3JpcHRzLlxuICAgIHZhciBzdWJzY3JpcHQgPSAxO1xuICAgIGFyZ3VtZW50TmFtZUxpc3QuZm9yRWFjaChmdW5jdGlvbihhcmdOYW1lLCBpZHgpIHtcbiAgICAgIGlmIChhcmdOYW1lID09PSBkdXBBcmdOYW1lKSB7XG4gICAgICAgIGFyZ3VtZW50TmFtZUxpc3RbaWR4XSA9IGFyZ05hbWUgKyAnXycgKyBzdWJzY3JpcHQrKztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGFyZ3VtZW50TmFtZUxpc3Q7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4KS5tYXAoZnVuY3Rpb24oZXhwckFyZ3VtZW50U3RyaW5nKSB7XG4gICAgcmV0dXJuIGV4cHJBcmd1bWVudFN0cmluZ1tleHByQXJndW1lbnRTdHJpbmcubGVuZ3RoIC0gMV0gPT09ICdzJyA/XG4gICAgICAgIGV4cHJBcmd1bWVudFN0cmluZyArICdlcycgOlxuICAgICAgICBleHByQXJndW1lbnRTdHJpbmcgKyAncyc7XG4gIH0pO1xufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4KS5tYXAoZnVuY3Rpb24oYXJnTmFtZSkge1xuICAgIHJldHVybiAnb3B0JyArIGFyZ05hbWVbMF0udG9VcHBlckNhc2UoKSArIGFyZ05hbWUuc2xpY2UoMSk7XG4gIH0pO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gW107XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPVxucGV4cHJzLkxleC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4KTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gW3RoaXMucnVsZU5hbWVdO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4KSB7XG4gIHJldHVybiAnJCcgKyBmaXJzdEFyZ0luZGV4O1xufTtcblxuLy8gXCJWYWx1ZSBwZXhwcnNcIiAoVmFsdWUsIFN0ciwgQXJyLCBPYmopIGFyZSBnb2luZyBhd2F5IHNvb24sIHNvIHdlIGRvbid0IHdvcnJ5IGFib3V0IHRoZW0gaGVyZS5cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgUEV4cHIsIGZvciB1c2UgYXMgYSBVSSBsYWJlbCwgZXRjLlxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLkl0ZXIucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5MZXgucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuVmFsdWUucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuQXJyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLk9iai5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmludGVydmFsKSB7XG4gICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpLmNvbnRlbnRzO1xuICB9XG4gIHJldHVybiAnWycgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnXSc7XG59O1xuXG5wZXhwcnMuYW55LnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ2FueSc7XG59O1xuXG5wZXhwcnMuZW5kLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ2VuZCc7XG59O1xuXG5wZXhwcnMuUHJpbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIycgKyB0aGlzLmluZGV4O1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnVW5pY29kZSB7JyArIHRoaXMuY2F0ZWdvcnkgKyAnfSBjaGFyYWN0ZXInO1xufTtcblxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnVHlwZUNoZWNrKCcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnR5cGUpICsgJyknO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUoJ2FueSBvYmplY3QnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5lbmQudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUoJ2VuZCBvZiBpbnB1dCcsICdkZXNjcmlwdGlvbicpO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycgP1xuICAgIG5ldyBGYWlsdXJlKHRoaXMub2JqLCAnc3RyaW5nJykgOlxuICAgIG5ldyBGYWlsdXJlKEpTT04uc3RyaW5naWZ5KHRoaXMub2JqKSwgJ2NvZGUnKTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICAvLyBUT0RPOiBjb21lIHVwIHdpdGggc29tZXRoaW5nIGJldHRlclxuICByZXR1cm4gbmV3IEZhaWx1cmUoSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKSwgJ2NvZGUnKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5leHByID09PSBwZXhwcnMuYW55ID9cbiAgICAgICdub3RoaW5nJyA6XG4gICAgICAnbm90ICcgKyB0aGlzLmV4cHIudG9GYWlsdXJlKGdyYW1tYXIpO1xuICByZXR1cm4gbmV3IEZhaWx1cmUoZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcblxuLy8gVE9ETzogdGhpbmsgYWJvdXQgQXJyLCBTdHIsIGFuZCBPYmpcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBkZXNjcmlwdGlvbiA9IGdyYW1tYXIucnVsZURlc2NyaXB0aW9uc1t0aGlzLnJ1bGVOYW1lXTtcbiAgaWYgKCFkZXNjcmlwdGlvbikge1xuICAgIHZhciBhcnRpY2xlID0gKC9eW2FlaW91QUVJT1VdLy50ZXN0KHRoaXMucnVsZU5hbWUpID8gJ2FuJyA6ICdhJyk7XG4gICAgZGVzY3JpcHRpb24gPSBhcnRpY2xlICsgJyAnICsgdGhpcy5ydWxlTmFtZTtcbiAgfVxuICByZXR1cm4gbmV3IEZhaWx1cmUoZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLnRvRGlzcGxheVN0cmluZygpLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5UeXBlQ2hlY2sucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKCdhIHZhbHVlIG9mIHR5cGUgJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudHlwZSksICdkZXNjcmlwdGlvbicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBlMS50b1N0cmluZygpID09PSBlMi50b1N0cmluZygpID09PiBlMSBhbmQgZTIgYXJlIHNlbWFudGljYWxseSBlcXVpdmFsZW50LlxuICBOb3RlIHRoYXQgdGhpcyBpcyBub3QgYW4gaWZmICg8PT0+KTogZS5nLixcbiAgKH5cImJcIiBcImFcIikudG9TdHJpbmcoKSAhPT0gKFwiYVwiKS50b1N0cmluZygpLCBldmVuIHRob3VnaFxuICB+XCJiXCIgXCJhXCIgYW5kIFwiYVwiIGFyZSBpbnRlcmNoYW5nZWFibGUgaW4gYW55IGdyYW1tYXIsXG4gIGJvdGggaW4gdGVybXMgb2YgdGhlIGxhbmd1YWdlcyB0aGV5IGFjY2VwdCBhbmQgdGhlaXIgYXJpdGllcy5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvU3RyaW5nID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55LnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnYW55Jztcbn07XG5cbnBleHBycy5lbmQudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdlbmQnO1xufTtcblxucGV4cHJzLlByaW0ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyQnICsgdGhpcy5pbmRleDtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIygnICsgdGhpcy5leHByLnRvU3RyaW5nKCkgKyAnKSc7XG59O1xuXG5wZXhwcnMuVmFsdWUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJCgnICsgdGhpcy5leHByLnRvU3RyaW5nKCkgKyAnKSc7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDEgP1xuICAgIHRoaXMudGVybXNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS50b1N0cmluZygpOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMubGVuZ3RoID09PSAxID9cbiAgICB0aGlzLmZhY3RvcnNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci50b1N0cmluZygpOyB9KS5qb2luKCcgJykgKyAnKSc7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwciArIHRoaXMub3BlcmF0b3I7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ34nICsgdGhpcy5leHByO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcmJyArIHRoaXMuZXhwcjtcbn07XG5cbnBleHBycy5BcnIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnWycgKyB0aGlzLmV4cHIudG9TdHJpbmcoKSArICddJztcbn07XG5cbnBleHBycy5PYmoucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwYXJ0cyA9IFsneyddO1xuXG4gIHZhciBmaXJzdCA9IHRydWU7XG4gIGZ1bmN0aW9uIGVtaXQocGFydCkge1xuICAgIGlmIChmaXJzdCkge1xuICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHMucHVzaCgnLCAnKTtcbiAgICB9XG4gICAgcGFydHMucHVzaChwYXJ0KTtcbiAgfVxuXG4gIHRoaXMucHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgZW1pdChKU09OLnN0cmluZ2lmeShwcm9wZXJ0eS5uYW1lKSArICc6ICcgKyBwcm9wZXJ0eS5wYXR0ZXJuLnRvU3RyaW5nKCkpO1xuICB9KTtcbiAgaWYgKHRoaXMuaXNMZW5pZW50KSB7XG4gICAgZW1pdCgnLi4uJyk7XG4gIH1cblxuICBwYXJ0cy5wdXNoKCd9Jyk7XG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHBzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy50b1N0cmluZygpOyB9KTtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1xcXFxweycgKyB0aGlzLmNhdGVnb3J5ICsgJ30nO1xufTtcblxucGV4cHJzLlR5cGVDaGVjay5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdUeXBlQ2hlY2soJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudHlwZSkgKyAnKSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIFVuaWNvZGVDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi4vdGhpcmRfcGFydHkvVW5pY29kZUNhdGVnb3JpZXMnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR2VuZXJhbCBzdHVmZlxuXG4vLyBDb25zdGFudHMgcmVwcmVzZW50aW5nIHRoZSB0eXBlIG9mIGEgUEV4cHIuIFNlZSBwZXhwcnMtZ2V0RXhwclR5cGUuanMgZm9yXG4vLyBtb3JlIGluZm9ybWF0aW9uLlxudmFyIFRZUEVfQU5ZID0gMDtcbnZhciBUWVBFX1NUUklORyA9IDE7XG52YXIgVFlQRV9WQUxVRSA9IDI7XG5cbmZ1bmN0aW9uIFBFeHByKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoXCJQRXhwciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0J3MgYWJzdHJhY3RcIik7XG59XG5cbi8vIFNldCB0aGUgYGludGVydmFsYCBwcm9wZXJ0eSB0byB0aGUgaW50ZXJ2YWwgY29udGFpbmluZyB0aGUgc291cmNlIGZvciB0aGlzIGV4cHJlc3Npb24uXG5QRXhwci5wcm90b3R5cGUud2l0aEludGVydmFsID0gZnVuY3Rpb24oaW50ZXJ2YWwpIHtcbiAgaWYgKGludGVydmFsKSB7XG4gICAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsLnRyaW1tZWQoKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIEFsbG9jYXRlIHRoZSBhcHByb3ByaWF0ZSBpbnB1dCBzdHJlYW0gZm9yIHRoaXMgZXhwcmVzc2lvbiBhbmQgdGhlIGdpdmVuIHZhbHVlcy5cblBFeHByLnByb3RvdHlwZS5uZXdJbnB1dFN0cmVhbUZvciA9IGZ1bmN0aW9uKHZhbHVlcywgZ3JhbW1hcikge1xuICB2YXIgZXhwclR5cGUgPSB0aGlzLmdldEV4cHJUeXBlKGdyYW1tYXIpO1xuICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgdmFsdWVzWzBdID09PSAnc3RyaW5nJyAmJiBleHByVHlwZSAhPT0gVFlQRV9WQUxVRSkge1xuICAgIHJldHVybiBJbnB1dFN0cmVhbS5uZXdGb3IodmFsdWVzWzBdKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gSW5wdXRTdHJlYW0ubmV3Rm9yKHZhbHVlcyk7XG4gIH1cbn07XG5cbi8vIEFueVxuXG52YXIgYW55ID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBFbmRcblxudmFyIGVuZCA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcblxuLy8gUHJpbWl0aXZlc1xuXG5mdW5jdGlvbiBQcmltKG9iaikge1xuICB0aGlzLm9iaiA9IG9iajtcbn1cbmluaGVyaXRzKFByaW0sIFBFeHByKTtcblxuLy8gUmFuZ2VzXG5cbmZ1bmN0aW9uIFJhbmdlKGZyb20sIHRvKSB7XG4gIHRoaXMuZnJvbSA9IGZyb207XG4gIHRoaXMudG8gPSB0bztcbn1cbmluaGVyaXRzKFJhbmdlLCBQRXhwcik7XG5cbi8vIFBhcmFtZXRlcnNcblxuZnVuY3Rpb24gUGFyYW0oaW5kZXgpIHtcbiAgdGhpcy5pbmRleCA9IGluZGV4O1xufVxuaW5oZXJpdHMoUGFyYW0sIFBFeHByKTtcblxuLy8gQWx0ZXJuYXRpb25cblxuZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gIHRoaXMudGVybXMgPSB0ZXJtcztcbn1cbmluaGVyaXRzKEFsdCwgUEV4cHIpO1xuXG4vLyBFeHRlbmQgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIEV4dGVuZChzdXBlckdyYW1tYXIsIG5hbWUsIGJvZHkpIHtcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlQm9kaWVzW25hbWVdO1xuICB0aGlzLnRlcm1zID0gW2JvZHksIG9yaWdCb2R5XTtcbn1cbmluaGVyaXRzKEV4dGVuZCwgQWx0KTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5pbmhlcml0cyhTZXEsIFBFeHByKTtcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gSXRlcihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhJdGVyLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0YXIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RhciwgSXRlcik7XG5cbmZ1bmN0aW9uIFBsdXMoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoUGx1cywgSXRlcik7XG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhPcHQsIEl0ZXIpO1xuXG5TdGFyLnByb3RvdHlwZS5vcGVyYXRvciA9ICcqJztcblBsdXMucHJvdG90eXBlLm9wZXJhdG9yID0gJysnO1xuT3B0LnByb3RvdHlwZS5vcGVyYXRvciA9ICc/JztcblxuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5cblN0YXIucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5QbHVzLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuT3B0LnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gMTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTm90LCBQRXhwcik7XG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhMb29rYWhlYWQsIFBFeHByKTtcblxuLy8gXCJMZXhpZmljYXRpb25cIlxuXG5mdW5jdGlvbiBMZXgoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTGV4LCBQRXhwcik7XG5cbi8vIFwiVmFsdWUtaWZpY2F0aW9uXCJcblxuZnVuY3Rpb24gVmFsdWUoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoVmFsdWUsIFBFeHByKTtcblxuLy8gQXJyYXkgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBBcnIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoQXJyLCBQRXhwcik7XG5cbi8vIFN0cmluZyBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIFN0cihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhTdHIsIFBFeHByKTtcblxuLy8gT2JqZWN0IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gT2JqKHByb3BlcnRpZXMsIGlzTGVuaWVudCkge1xuICB2YXIgbmFtZXMgPSBwcm9wZXJ0aWVzLm1hcChmdW5jdGlvbihwcm9wZXJ0eSkgeyByZXR1cm4gcHJvcGVydHkubmFtZTsgfSk7XG4gIHZhciBkdXBsaWNhdGVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMobmFtZXMpO1xuICBpZiAoZHVwbGljYXRlcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVByb3BlcnR5TmFtZXMoZHVwbGljYXRlcyk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gcHJvcGVydGllcztcbiAgICB0aGlzLmlzTGVuaWVudCA9IGlzTGVuaWVudDtcbiAgfVxufVxuaW5oZXJpdHMoT2JqLCBQRXhwcik7XG5cbi8vIFJ1bGUgYXBwbGljYXRpb25cblxuZnVuY3Rpb24gQXBwbHkocnVsZU5hbWUsIG9wdEFyZ3MpIHtcbiAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICB0aGlzLmFyZ3MgPSBvcHRBcmdzIHx8IFtdO1xufVxuaW5oZXJpdHMoQXBwbHksIFBFeHByKTtcblxuQXBwbHkucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSk7XG59O1xuXG4vLyBUaGlzIG1ldGhvZCBqdXN0IGNhY2hlcyB0aGUgcmVzdWx0IG9mIGB0aGlzLnRvU3RyaW5nKClgIGluIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG5BcHBseS5wcm90b3R5cGUudG9NZW1vS2V5ID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5fbWVtb0tleSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX21lbW9LZXknLCB7dmFsdWU6IHRoaXMudG9TdHJpbmcoKX0pO1xuICB9XG4gIHJldHVybiB0aGlzLl9tZW1vS2V5O1xufTtcblxuLy8gVW5pY29kZSBjaGFyYWN0ZXJcbmZ1bmN0aW9uIFVuaWNvZGVDaGFyKGNhdGVnb3J5KSB7XG4gIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgdGhpcy5wYXR0ZXJuID0gVW5pY29kZUNhdGVnb3JpZXNbY2F0ZWdvcnldO1xufVxuaW5oZXJpdHMoVW5pY29kZUNoYXIsIFBFeHByKTtcblxuLy8gTWF0Y2hlcyBhIHZhbHVlIG9mIGEgcGFydGljdWxhciB0eXBlICh1c2luZyBgdHlwZW9mYCkuXG5mdW5jdGlvbiBUeXBlQ2hlY2sodCkge1xuICB0aGlzLnR5cGUgPSB0O1xufVxuaW5oZXJpdHMoVHlwZUNoZWNrLCBQRXhwcik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLlRZUEVfQU5ZID0gVFlQRV9BTlk7XG5leHBvcnRzLlRZUEVfU1RSSU5HID0gVFlQRV9TVFJJTkc7XG5leHBvcnRzLlRZUEVfVkFMVUUgPSBUWVBFX1ZBTFVFO1xuZXhwb3J0cy5UWVBFX0lOQ09OU0lTVEVOVCA9IFRZUEVfU1RSSU5HIHwgVFlQRV9WQUxVRTtcblxuZXhwb3J0cy5QRXhwciA9IFBFeHByO1xuZXhwb3J0cy5hbnkgPSBhbnk7XG5leHBvcnRzLmVuZCA9IGVuZDtcbmV4cG9ydHMuUHJpbSA9IFByaW07XG5leHBvcnRzLlJhbmdlID0gUmFuZ2U7XG5leHBvcnRzLlBhcmFtID0gUGFyYW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kID0gRXh0ZW5kO1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkl0ZXIgPSBJdGVyO1xuZXhwb3J0cy5TdGFyID0gU3RhcjtcbmV4cG9ydHMuUGx1cyA9IFBsdXM7XG5leHBvcnRzLk9wdCA9IE9wdDtcbmV4cG9ydHMuTm90ID0gTm90O1xuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWQ7XG5leHBvcnRzLkxleCA9IExleDtcbmV4cG9ydHMuVmFsdWUgPSBWYWx1ZTtcbmV4cG9ydHMuQXJyID0gQXJyO1xuZXhwb3J0cy5TdHIgPSBTdHI7XG5leHBvcnRzLk9iaiA9IE9iajtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcbmV4cG9ydHMuVW5pY29kZUNoYXIgPSBVbmljb2RlQ2hhcjtcbmV4cG9ydHMuVHlwZUNoZWNrID0gVHlwZUNoZWNrO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXh0ZW5zaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucmVxdWlyZSgnLi9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydFZhbHVlc0FuZFN0cmluZ3NBcmVOb3RNaXhlZCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtY2hlY2snKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWV2YWwnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdldEFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1nZXRFeHByVHlwZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWlzTnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0ZhaWx1cmUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvU3RyaW5nJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdpdmVuIGFuIGFycmF5IG9mIG51bWJlcnMgYGFycmAsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbnVtYmVycyBhcyBzdHJpbmdzLFxuLy8gcmlnaHQtanVzdGlmaWVkIGFuZCBwYWRkZWQgdG8gdGhlIHNhbWUgbGVuZ3RoLlxuZnVuY3Rpb24gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoYXJyKSB7XG4gIHZhciBtYXhMZW4gPSAwO1xuICB2YXIgc3RyaW5ncyA9IGFyci5tYXAoZnVuY3Rpb24obikge1xuICAgIHZhciBzdHIgPSBuLnRvU3RyaW5nKCk7XG4gICAgbWF4TGVuID0gTWF0aC5tYXgobWF4TGVuLCBzdHIubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyO1xuICB9KTtcbiAgcmV0dXJuIHN0cmluZ3MubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIGNvbW1vbi5wYWRMZWZ0KHMsIG1heExlbik7IH0pO1xufVxuXG4vLyBQcm9kdWNlIGEgbmV3IHN0cmluZyB0aGF0IHdvdWxkIGJlIHRoZSByZXN1bHQgb2YgY29weWluZyB0aGUgY29udGVudHNcbi8vIG9mIHRoZSBzdHJpbmcgYHNyY2Agb250byBgZGVzdGAgYXQgb2Zmc2V0IGBvZmZlc3RgLlxuZnVuY3Rpb24gc3RyY3B5KGRlc3QsIHNyYywgb2Zmc2V0KSB7XG4gIHZhciBvcmlnRGVzdExlbiA9IGRlc3QubGVuZ3RoO1xuICB2YXIgc3RhcnQgPSBkZXN0LnNsaWNlKDAsIG9mZnNldCk7XG4gIHZhciBlbmQgPSBkZXN0LnNsaWNlKG9mZnNldCArIHNyYy5sZW5ndGgpO1xuICByZXR1cm4gKHN0YXJ0ICsgc3JjICsgZW5kKS5zdWJzdHIoMCwgb3JpZ0Rlc3RMZW4pO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnaXZlblxuLy8gb2Zmc2V0IGluIGBzdHJgLlxuZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uID0gZnVuY3Rpb24oc3RyLCBvZmZzZXQpIHtcbiAgdmFyIGxpbmVOdW0gPSAxO1xuICB2YXIgY29sTnVtID0gMTtcblxuICB2YXIgY3Vyck9mZnNldCA9IDA7XG4gIHZhciBsaW5lU3RhcnRPZmZzZXQgPSAwO1xuXG4gIHZhciBuZXh0TGluZSA9IG51bGw7XG4gIHZhciBwcmV2TGluZSA9IG51bGw7XG4gIHZhciBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gLTE7XG5cbiAgd2hpbGUgKGN1cnJPZmZzZXQgPCBvZmZzZXQpIHtcbiAgICB2YXIgYyA9IHN0ci5jaGFyQXQoY3Vyck9mZnNldCsrKTtcbiAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgIGxpbmVOdW0rKztcbiAgICAgIGNvbE51bSA9IDE7XG4gICAgICBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gbGluZVN0YXJ0T2Zmc2V0O1xuICAgICAgbGluZVN0YXJ0T2Zmc2V0ID0gY3Vyck9mZnNldDtcbiAgICB9IGVsc2UgaWYgKGMgIT09ICdcXHInKSB7XG4gICAgICBjb2xOdW0rKztcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBlbmQgb2YgdGhlIHRhcmdldCBsaW5lLlxuICB2YXIgbGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lU3RhcnRPZmZzZXQpO1xuICBpZiAobGluZUVuZE9mZnNldCA9PT0gLTEpIHtcbiAgICBsaW5lRW5kT2Zmc2V0ID0gc3RyLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgbGluZS5cbiAgICB2YXIgbmV4dExpbmVFbmRPZmZzZXQgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZUVuZE9mZnNldCArIDEpO1xuICAgIG5leHRMaW5lID0gbmV4dExpbmVFbmRPZmZzZXQgPT09IC0xID8gc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHIuc2xpY2UobGluZUVuZE9mZnNldCwgbmV4dExpbmVFbmRPZmZzZXQpO1xuICAgIC8vIFN0cmlwIGxlYWRpbmcgYW5kIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICAgIG5leHRMaW5lID0gbmV4dExpbmUucmVwbGFjZSgvXlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyJC8sICcnKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgcHJldmlvdXMgbGluZS5cbiAgaWYgKHByZXZMaW5lU3RhcnRPZmZzZXQgPj0gMCkge1xuICAgIHByZXZMaW5lID0gc3RyLnNsaWNlKHByZXZMaW5lU3RhcnRPZmZzZXQsIGxpbmVTdGFydE9mZnNldClcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHI/XFxuJC8sICcnKTsgIC8vIFN0cmlwIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICB9XG5cbiAgLy8gR2V0IHRoZSB0YXJnZXQgbGluZSwgc3RyaXBwaW5nIGEgdHJhaWxpbmcgY2FycmlhZ2UgcmV0dXJuIGlmIG5lY2Vzc2FyeS5cbiAgdmFyIGxpbmUgPSBzdHIuc2xpY2UobGluZVN0YXJ0T2Zmc2V0LCBsaW5lRW5kT2Zmc2V0KS5yZXBsYWNlKC9cXHIkLywgJycpO1xuXG4gIHJldHVybiB7XG4gICAgbGluZU51bTogbGluZU51bSxcbiAgICBjb2xOdW06IGNvbE51bSxcbiAgICBsaW5lOiBsaW5lLFxuICAgIHByZXZMaW5lOiBwcmV2TGluZSxcbiAgICBuZXh0TGluZTogbmV4dExpbmVcbiAgfTtcbn07XG5cbi8vIFJldHVybiBhIG5pY2VseS1mb3JtYXR0ZWQgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGxpbmUgYW5kIGNvbHVtbiBmb3IgdGhlXG4vLyBnaXZlbiBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlID0gZnVuY3Rpb24oc3RyLCBvZmZzZXQgLyogLi4ucmFuZ2VzICovKSB7XG4gIHZhciByZXBlYXRTdHIgPSBjb21tb24ucmVwZWF0U3RyO1xuXG4gIHZhciBsaW5lQW5kQ29sID0gZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uKHN0ciwgb2Zmc2V0KTtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgc2IuYXBwZW5kKCdMaW5lICcgKyBsaW5lQW5kQ29sLmxpbmVOdW0gKyAnLCBjb2wgJyArIGxpbmVBbmRDb2wuY29sTnVtICsgJzpcXG4nKTtcblxuICAvLyBBbiBhcnJheSBvZiB0aGUgcHJldmlvdXMsIGN1cnJlbnQsIGFuZCBuZXh0IGxpbmUgbnVtYmVycyBhcyBzdHJpbmdzIG9mIGVxdWFsIGxlbmd0aC5cbiAgdmFyIGxpbmVOdW1iZXJzID0gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoW1xuICAgICAgbGluZUFuZENvbC5wcmV2TGluZSA9PSBudWxsID8gMCA6IGxpbmVBbmRDb2wubGluZU51bSAtIDEsXG4gICAgICBsaW5lQW5kQ29sLmxpbmVOdW0sXG4gICAgICBsaW5lQW5kQ29sLm5leHRMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtICsgMVxuICBdKTtcblxuICAvLyBIZWxwZXIgZm9yIGFwcGVuZGluZyBmb3JtYXR0aW5nIGlucHV0IGxpbmVzIHRvIHRoZSBidWZmZXIuXG4gIGZ1bmN0aW9uIGFwcGVuZExpbmUobnVtLCBjb250ZW50LCBwcmVmaXgpIHtcbiAgICBzYi5hcHBlbmQocHJlZml4ICsgbGluZU51bWJlcnNbbnVtXSArICcgfCAnICsgY29udGVudCArICdcXG4nKTtcbiAgfVxuXG4gIC8vIEluY2x1ZGUgdGhlIHByZXZpb3VzIGxpbmUgZm9yIGNvbnRleHQgaWYgcG9zc2libGUuXG4gIGlmIChsaW5lQW5kQ29sLnByZXZMaW5lICE9IG51bGwpIHtcbiAgICBhcHBlbmRMaW5lKDAsIGxpbmVBbmRDb2wucHJldkxpbmUsICcgICcpO1xuICB9XG4gIC8vIExpbmUgdGhhdCB0aGUgZXJyb3Igb2NjdXJyZWQgb24uXG4gIGFwcGVuZExpbmUoMSwgbGluZUFuZENvbC5saW5lLCAnPiAnKTtcblxuICAvLyBCdWlsZCB1cCB0aGUgbGluZSB0aGF0IHBvaW50cyB0byB0aGUgb2Zmc2V0IGFuZCBwb3NzaWJsZSBpbmRpY2F0ZXMgb25lIG9yIG1vcmUgcmFuZ2VzLlxuICAvLyBTdGFydCB3aXRoIGEgYmxhbmsgbGluZSwgYW5kIGluZGljYXRlIGVhY2ggcmFuZ2UgYnkgb3ZlcmxheWluZyBhIHN0cmluZyBvZiBgfmAgY2hhcnMuXG4gIHZhciBsaW5lTGVuID0gbGluZUFuZENvbC5saW5lLmxlbmd0aDtcbiAgdmFyIGluZGljYXRpb25MaW5lID0gcmVwZWF0U3RyKCcgJywgbGluZUxlbiArIDEpO1xuICB2YXIgcmFuZ2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgc3RhcnRJZHggPSByYW5nZXNbaV1bMF07XG4gICAgdmFyIGVuZElkeCA9IHJhbmdlc1tpXVsxXTtcbiAgICBjb21tb24uYXNzZXJ0KHN0YXJ0SWR4ID49IDAgJiYgc3RhcnRJZHggPD0gZW5kSWR4LCAncmFuZ2Ugc3RhcnQgbXVzdCBiZSA+PSAwIGFuZCA8PSBlbmQnKTtcblxuICAgIHZhciBsaW5lU3RhcnRPZmZzZXQgPSBvZmZzZXQgLSBsaW5lQW5kQ29sLmNvbE51bSArIDE7XG4gICAgc3RhcnRJZHggPSBNYXRoLm1heCgwLCBzdGFydElkeCAtIGxpbmVTdGFydE9mZnNldCk7XG4gICAgZW5kSWR4ID0gTWF0aC5taW4oZW5kSWR4IC0gbGluZVN0YXJ0T2Zmc2V0LCBsaW5lTGVuKTtcblxuICAgIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCByZXBlYXRTdHIoJ34nLCBlbmRJZHggLSBzdGFydElkeCksIHN0YXJ0SWR4KTtcbiAgfVxuICB2YXIgZ3V0dGVyV2lkdGggPSAyICsgbGluZU51bWJlcnNbMV0ubGVuZ3RoICsgMztcbiAgc2IuYXBwZW5kKHJlcGVhdFN0cignICcsIGd1dHRlcldpZHRoKSk7XG4gIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCAnXicsIGxpbmVBbmRDb2wuY29sTnVtIC0gMSk7XG4gIHNiLmFwcGVuZChpbmRpY2F0aW9uTGluZS5yZXBsYWNlKC8gKyQvLCAnJykgKyAnXFxuJyk7XG5cbiAgLy8gSW5jbHVkZSB0aGUgbmV4dCBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICBpZiAobGluZUFuZENvbC5uZXh0TGluZSAhPSBudWxsKSB7XG4gICAgYXBwZW5kTGluZSgyLCBsaW5lQW5kQ29sLm5leHRMaW5lLCAnICAnKTtcbiAgfVxuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG4iLCIvLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vdHZjdXRzZW0vZXMtbGFiL2Jsb2IvbWFzdGVyL3NyYy9wYXJzZXIvdW5pY29kZS5qcy5cbi8vIFRoZXNlIGFyZSBqdXN0IGNhdGVnb3JpZXMgdGhhdCBhcmUgdXNlZCBpbiBFUzUuXG4vLyBUaGUgZnVsbCBsaXN0IG9mIFVuaWNvZGUgY2F0ZWdvcmllcyBpcyBoZXJlOiBodHRwOi8vd3d3LmZpbGVmb3JtYXQuaW5mby9pbmZvL3VuaWNvZGUvY2F0ZWdvcnkvaW5kZXguaHRtLlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIExldHRlcnNcbiAgTHU6IC9bXFx1MDA0MS1cXHUwMDVBXXxbXFx1MDBDMC1cXHUwMEQ2XXxbXFx1MDBEOC1cXHUwMERFXXxbXFx1MDEwMC1cXHUwMTAwXXxbXFx1MDEwMi1cXHUwMTAyXXxbXFx1MDEwNC1cXHUwMTA0XXxbXFx1MDEwNi1cXHUwMTA2XXxbXFx1MDEwOC1cXHUwMTA4XXxbXFx1MDEwQS1cXHUwMTBBXXxbXFx1MDEwQy1cXHUwMTBDXXxbXFx1MDEwRS1cXHUwMTBFXXxbXFx1MDExMC1cXHUwMTEwXXxbXFx1MDExMi1cXHUwMTEyXXxbXFx1MDExNC1cXHUwMTE0XXxbXFx1MDExNi1cXHUwMTE2XXxbXFx1MDExOC1cXHUwMTE4XXxbXFx1MDExQS1cXHUwMTFBXXxbXFx1MDExQy1cXHUwMTFDXXxbXFx1MDExRS1cXHUwMTFFXXxbXFx1MDEyMC1cXHUwMTIwXXxbXFx1MDEyMi1cXHUwMTIyXXxbXFx1MDEyNC1cXHUwMTI0XXxbXFx1MDEyNi1cXHUwMTI2XXxbXFx1MDEyOC1cXHUwMTI4XXxbXFx1MDEyQS1cXHUwMTJBXXxbXFx1MDEyQy1cXHUwMTJDXXxbXFx1MDEyRS1cXHUwMTJFXXxbXFx1MDEzMC1cXHUwMTMwXXxbXFx1MDEzMi1cXHUwMTMyXXxbXFx1MDEzNC1cXHUwMTM0XXxbXFx1MDEzNi1cXHUwMTM2XXxbXFx1MDEzOS1cXHUwMTM5XXxbXFx1MDEzQi1cXHUwMTNCXXxbXFx1MDEzRC1cXHUwMTNEXXxbXFx1MDEzRi1cXHUwMTNGXXxbXFx1MDE0MS1cXHUwMTQxXXxbXFx1MDE0My1cXHUwMTQzXXxbXFx1MDE0NS1cXHUwMTQ1XXxbXFx1MDE0Ny1cXHUwMTQ3XXxbXFx1MDE0QS1cXHUwMTRBXXxbXFx1MDE0Qy1cXHUwMTRDXXxbXFx1MDE0RS1cXHUwMTRFXXxbXFx1MDE1MC1cXHUwMTUwXXxbXFx1MDE1Mi1cXHUwMTUyXXxbXFx1MDE1NC1cXHUwMTU0XXxbXFx1MDE1Ni1cXHUwMTU2XXxbXFx1MDE1OC1cXHUwMTU4XXxbXFx1MDE1QS1cXHUwMTVBXXxbXFx1MDE1Qy1cXHUwMTVDXXxbXFx1MDE1RS1cXHUwMTVFXXxbXFx1MDE2MC1cXHUwMTYwXXxbXFx1MDE2Mi1cXHUwMTYyXXxbXFx1MDE2NC1cXHUwMTY0XXxbXFx1MDE2Ni1cXHUwMTY2XXxbXFx1MDE2OC1cXHUwMTY4XXxbXFx1MDE2QS1cXHUwMTZBXXxbXFx1MDE2Qy1cXHUwMTZDXXxbXFx1MDE2RS1cXHUwMTZFXXxbXFx1MDE3MC1cXHUwMTcwXXxbXFx1MDE3Mi1cXHUwMTcyXXxbXFx1MDE3NC1cXHUwMTc0XXxbXFx1MDE3Ni1cXHUwMTc2XXxbXFx1MDE3OC1cXHUwMTc5XXxbXFx1MDE3Qi1cXHUwMTdCXXxbXFx1MDE3RC1cXHUwMTdEXXxbXFx1MDE4MS1cXHUwMTgyXXxbXFx1MDE4NC1cXHUwMTg0XXxbXFx1MDE4Ni1cXHUwMTg3XXxbXFx1MDE4OS1cXHUwMThCXXxbXFx1MDE4RS1cXHUwMTkxXXxbXFx1MDE5My1cXHUwMTk0XXxbXFx1MDE5Ni1cXHUwMTk4XXxbXFx1MDE5Qy1cXHUwMTlEXXxbXFx1MDE5Ri1cXHUwMUEwXXxbXFx1MDFBMi1cXHUwMUEyXXxbXFx1MDFBNC1cXHUwMUE0XXxbXFx1MDFBNi1cXHUwMUE3XXxbXFx1MDFBOS1cXHUwMUE5XXxbXFx1MDFBQy1cXHUwMUFDXXxbXFx1MDFBRS1cXHUwMUFGXXxbXFx1MDFCMS1cXHUwMUIzXXxbXFx1MDFCNS1cXHUwMUI1XXxbXFx1MDFCNy1cXHUwMUI4XXxbXFx1MDFCQy1cXHUwMUJDXXxbXFx1MDFDNC1cXHUwMUM0XXxbXFx1MDFDNy1cXHUwMUM3XXxbXFx1MDFDQS1cXHUwMUNBXXxbXFx1MDFDRC1cXHUwMUNEXXxbXFx1MDFDRi1cXHUwMUNGXXxbXFx1MDFEMS1cXHUwMUQxXXxbXFx1MDFEMy1cXHUwMUQzXXxbXFx1MDFENS1cXHUwMUQ1XXxbXFx1MDFENy1cXHUwMUQ3XXxbXFx1MDFEOS1cXHUwMUQ5XXxbXFx1MDFEQi1cXHUwMURCXXxbXFx1MDFERS1cXHUwMURFXXxbXFx1MDFFMC1cXHUwMUUwXXxbXFx1MDFFMi1cXHUwMUUyXXxbXFx1MDFFNC1cXHUwMUU0XXxbXFx1MDFFNi1cXHUwMUU2XXxbXFx1MDFFOC1cXHUwMUU4XXxbXFx1MDFFQS1cXHUwMUVBXXxbXFx1MDFFQy1cXHUwMUVDXXxbXFx1MDFFRS1cXHUwMUVFXXxbXFx1MDFGMS1cXHUwMUYxXXxbXFx1MDFGNC1cXHUwMUY0XXxbXFx1MDFGQS1cXHUwMUZBXXxbXFx1MDFGQy1cXHUwMUZDXXxbXFx1MDFGRS1cXHUwMUZFXXxbXFx1MDIwMC1cXHUwMjAwXXxbXFx1MDIwMi1cXHUwMjAyXXxbXFx1MDIwNC1cXHUwMjA0XXxbXFx1MDIwNi1cXHUwMjA2XXxbXFx1MDIwOC1cXHUwMjA4XXxbXFx1MDIwQS1cXHUwMjBBXXxbXFx1MDIwQy1cXHUwMjBDXXxbXFx1MDIwRS1cXHUwMjBFXXxbXFx1MDIxMC1cXHUwMjEwXXxbXFx1MDIxMi1cXHUwMjEyXXxbXFx1MDIxNC1cXHUwMjE0XXxbXFx1MDIxNi1cXHUwMjE2XXxbXFx1MDM4Ni1cXHUwMzg2XXxbXFx1MDM4OC1cXHUwMzhBXXxbXFx1MDM4Qy1cXHUwMzhDXXxbXFx1MDM4RS1cXHUwMzhGXXxbXFx1MDM5MS1cXHUwM0ExXXxbXFx1MDNBMy1cXHUwM0FCXXxbXFx1MDNEMi1cXHUwM0Q0XXxbXFx1MDNEQS1cXHUwM0RBXXxbXFx1MDNEQy1cXHUwM0RDXXxbXFx1MDNERS1cXHUwM0RFXXxbXFx1MDNFMC1cXHUwM0UwXXxbXFx1MDNFMi1cXHUwM0UyXXxbXFx1MDNFNC1cXHUwM0U0XXxbXFx1MDNFNi1cXHUwM0U2XXxbXFx1MDNFOC1cXHUwM0U4XXxbXFx1MDNFQS1cXHUwM0VBXXxbXFx1MDNFQy1cXHUwM0VDXXxbXFx1MDNFRS1cXHUwM0VFXXxbXFx1MDQwMS1cXHUwNDBDXXxbXFx1MDQwRS1cXHUwNDJGXXxbXFx1MDQ2MC1cXHUwNDYwXXxbXFx1MDQ2Mi1cXHUwNDYyXXxbXFx1MDQ2NC1cXHUwNDY0XXxbXFx1MDQ2Ni1cXHUwNDY2XXxbXFx1MDQ2OC1cXHUwNDY4XXxbXFx1MDQ2QS1cXHUwNDZBXXxbXFx1MDQ2Qy1cXHUwNDZDXXxbXFx1MDQ2RS1cXHUwNDZFXXxbXFx1MDQ3MC1cXHUwNDcwXXxbXFx1MDQ3Mi1cXHUwNDcyXXxbXFx1MDQ3NC1cXHUwNDc0XXxbXFx1MDQ3Ni1cXHUwNDc2XXxbXFx1MDQ3OC1cXHUwNDc4XXxbXFx1MDQ3QS1cXHUwNDdBXXxbXFx1MDQ3Qy1cXHUwNDdDXXxbXFx1MDQ3RS1cXHUwNDdFXXxbXFx1MDQ4MC1cXHUwNDgwXXxbXFx1MDQ5MC1cXHUwNDkwXXxbXFx1MDQ5Mi1cXHUwNDkyXXxbXFx1MDQ5NC1cXHUwNDk0XXxbXFx1MDQ5Ni1cXHUwNDk2XXxbXFx1MDQ5OC1cXHUwNDk4XXxbXFx1MDQ5QS1cXHUwNDlBXXxbXFx1MDQ5Qy1cXHUwNDlDXXxbXFx1MDQ5RS1cXHUwNDlFXXxbXFx1MDRBMC1cXHUwNEEwXXxbXFx1MDRBMi1cXHUwNEEyXXxbXFx1MDRBNC1cXHUwNEE0XXxbXFx1MDRBNi1cXHUwNEE2XXxbXFx1MDRBOC1cXHUwNEE4XXxbXFx1MDRBQS1cXHUwNEFBXXxbXFx1MDRBQy1cXHUwNEFDXXxbXFx1MDRBRS1cXHUwNEFFXXxbXFx1MDRCMC1cXHUwNEIwXXxbXFx1MDRCMi1cXHUwNEIyXXxbXFx1MDRCNC1cXHUwNEI0XXxbXFx1MDRCNi1cXHUwNEI2XXxbXFx1MDRCOC1cXHUwNEI4XXxbXFx1MDRCQS1cXHUwNEJBXXxbXFx1MDRCQy1cXHUwNEJDXXxbXFx1MDRCRS1cXHUwNEJFXXxbXFx1MDRDMS1cXHUwNEMxXXxbXFx1MDRDMy1cXHUwNEMzXXxbXFx1MDRDNy1cXHUwNEM3XXxbXFx1MDRDQi1cXHUwNENCXXxbXFx1MDREMC1cXHUwNEQwXXxbXFx1MDREMi1cXHUwNEQyXXxbXFx1MDRENC1cXHUwNEQ0XXxbXFx1MDRENi1cXHUwNEQ2XXxbXFx1MDREOC1cXHUwNEQ4XXxbXFx1MDREQS1cXHUwNERBXXxbXFx1MDREQy1cXHUwNERDXXxbXFx1MDRERS1cXHUwNERFXXxbXFx1MDRFMC1cXHUwNEUwXXxbXFx1MDRFMi1cXHUwNEUyXXxbXFx1MDRFNC1cXHUwNEU0XXxbXFx1MDRFNi1cXHUwNEU2XXxbXFx1MDRFOC1cXHUwNEU4XXxbXFx1MDRFQS1cXHUwNEVBXXxbXFx1MDRFRS1cXHUwNEVFXXxbXFx1MDRGMC1cXHUwNEYwXXxbXFx1MDRGMi1cXHUwNEYyXXxbXFx1MDRGNC1cXHUwNEY0XXxbXFx1MDRGOC1cXHUwNEY4XXxbXFx1MDUzMS1cXHUwNTU2XXxbXFx1MTBBMC1cXHUxMEM1XXxbXFx1MUUwMC1cXHUxRTAwXXxbXFx1MUUwMi1cXHUxRTAyXXxbXFx1MUUwNC1cXHUxRTA0XXxbXFx1MUUwNi1cXHUxRTA2XXxbXFx1MUUwOC1cXHUxRTA4XXxbXFx1MUUwQS1cXHUxRTBBXXxbXFx1MUUwQy1cXHUxRTBDXXxbXFx1MUUwRS1cXHUxRTBFXXxbXFx1MUUxMC1cXHUxRTEwXXxbXFx1MUUxMi1cXHUxRTEyXXxbXFx1MUUxNC1cXHUxRTE0XXxbXFx1MUUxNi1cXHUxRTE2XXxbXFx1MUUxOC1cXHUxRTE4XXxbXFx1MUUxQS1cXHUxRTFBXXxbXFx1MUUxQy1cXHUxRTFDXXxbXFx1MUUxRS1cXHUxRTFFXXxbXFx1MUUyMC1cXHUxRTIwXXxbXFx1MUUyMi1cXHUxRTIyXXxbXFx1MUUyNC1cXHUxRTI0XXxbXFx1MUUyNi1cXHUxRTI2XXxbXFx1MUUyOC1cXHUxRTI4XXxbXFx1MUUyQS1cXHUxRTJBXXxbXFx1MUUyQy1cXHUxRTJDXXxbXFx1MUUyRS1cXHUxRTJFXXxbXFx1MUUzMC1cXHUxRTMwXXxbXFx1MUUzMi1cXHUxRTMyXXxbXFx1MUUzNC1cXHUxRTM0XXxbXFx1MUUzNi1cXHUxRTM2XXxbXFx1MUUzOC1cXHUxRTM4XXxbXFx1MUUzQS1cXHUxRTNBXXxbXFx1MUUzQy1cXHUxRTNDXXxbXFx1MUUzRS1cXHUxRTNFXXxbXFx1MUU0MC1cXHUxRTQwXXxbXFx1MUU0Mi1cXHUxRTQyXXxbXFx1MUU0NC1cXHUxRTQ0XXxbXFx1MUU0Ni1cXHUxRTQ2XXxbXFx1MUU0OC1cXHUxRTQ4XXxbXFx1MUU0QS1cXHUxRTRBXXxbXFx1MUU0Qy1cXHUxRTRDXXxbXFx1MUU0RS1cXHUxRTRFXXxbXFx1MUU1MC1cXHUxRTUwXXxbXFx1MUU1Mi1cXHUxRTUyXXxbXFx1MUU1NC1cXHUxRTU0XXxbXFx1MUU1Ni1cXHUxRTU2XXxbXFx1MUU1OC1cXHUxRTU4XXxbXFx1MUU1QS1cXHUxRTVBXXxbXFx1MUU1Qy1cXHUxRTVDXXxbXFx1MUU1RS1cXHUxRTVFXXxbXFx1MUU2MC1cXHUxRTYwXXxbXFx1MUU2Mi1cXHUxRTYyXXxbXFx1MUU2NC1cXHUxRTY0XXxbXFx1MUU2Ni1cXHUxRTY2XXxbXFx1MUU2OC1cXHUxRTY4XXxbXFx1MUU2QS1cXHUxRTZBXXxbXFx1MUU2Qy1cXHUxRTZDXXxbXFx1MUU2RS1cXHUxRTZFXXxbXFx1MUU3MC1cXHUxRTcwXXxbXFx1MUU3Mi1cXHUxRTcyXXxbXFx1MUU3NC1cXHUxRTc0XXxbXFx1MUU3Ni1cXHUxRTc2XXxbXFx1MUU3OC1cXHUxRTc4XXxbXFx1MUU3QS1cXHUxRTdBXXxbXFx1MUU3Qy1cXHUxRTdDXXxbXFx1MUU3RS1cXHUxRTdFXXxbXFx1MUU4MC1cXHUxRTgwXXxbXFx1MUU4Mi1cXHUxRTgyXXxbXFx1MUU4NC1cXHUxRTg0XXxbXFx1MUU4Ni1cXHUxRTg2XXxbXFx1MUU4OC1cXHUxRTg4XXxbXFx1MUU4QS1cXHUxRThBXXxbXFx1MUU4Qy1cXHUxRThDXXxbXFx1MUU4RS1cXHUxRThFXXxbXFx1MUU5MC1cXHUxRTkwXXxbXFx1MUU5Mi1cXHUxRTkyXXxbXFx1MUU5NC1cXHUxRTk0XXxbXFx1MUVBMC1cXHUxRUEwXXxbXFx1MUVBMi1cXHUxRUEyXXxbXFx1MUVBNC1cXHUxRUE0XXxbXFx1MUVBNi1cXHUxRUE2XXxbXFx1MUVBOC1cXHUxRUE4XXxbXFx1MUVBQS1cXHUxRUFBXXxbXFx1MUVBQy1cXHUxRUFDXXxbXFx1MUVBRS1cXHUxRUFFXXxbXFx1MUVCMC1cXHUxRUIwXXxbXFx1MUVCMi1cXHUxRUIyXXxbXFx1MUVCNC1cXHUxRUI0XXxbXFx1MUVCNi1cXHUxRUI2XXxbXFx1MUVCOC1cXHUxRUI4XXxbXFx1MUVCQS1cXHUxRUJBXXxbXFx1MUVCQy1cXHUxRUJDXXxbXFx1MUVCRS1cXHUxRUJFXXxbXFx1MUVDMC1cXHUxRUMwXXxbXFx1MUVDMi1cXHUxRUMyXXxbXFx1MUVDNC1cXHUxRUM0XXxbXFx1MUVDNi1cXHUxRUM2XXxbXFx1MUVDOC1cXHUxRUM4XXxbXFx1MUVDQS1cXHUxRUNBXXxbXFx1MUVDQy1cXHUxRUNDXXxbXFx1MUVDRS1cXHUxRUNFXXxbXFx1MUVEMC1cXHUxRUQwXXxbXFx1MUVEMi1cXHUxRUQyXXxbXFx1MUVENC1cXHUxRUQ0XXxbXFx1MUVENi1cXHUxRUQ2XXxbXFx1MUVEOC1cXHUxRUQ4XXxbXFx1MUVEQS1cXHUxRURBXXxbXFx1MUVEQy1cXHUxRURDXXxbXFx1MUVERS1cXHUxRURFXXxbXFx1MUVFMC1cXHUxRUUwXXxbXFx1MUVFMi1cXHUxRUUyXXxbXFx1MUVFNC1cXHUxRUU0XXxbXFx1MUVFNi1cXHUxRUU2XXxbXFx1MUVFOC1cXHUxRUU4XXxbXFx1MUVFQS1cXHUxRUVBXXxbXFx1MUVFQy1cXHUxRUVDXXxbXFx1MUVFRS1cXHUxRUVFXXxbXFx1MUVGMC1cXHUxRUYwXXxbXFx1MUVGMi1cXHUxRUYyXXxbXFx1MUVGNC1cXHUxRUY0XXxbXFx1MUVGNi1cXHUxRUY2XXxbXFx1MUVGOC1cXHUxRUY4XXxbXFx1MUYwOC1cXHUxRjBGXXxbXFx1MUYxOC1cXHUxRjFEXXxbXFx1MUYyOC1cXHUxRjJGXXxbXFx1MUYzOC1cXHUxRjNGXXxbXFx1MUY0OC1cXHUxRjREXXxbXFx1MUY1OS1cXHUxRjU5XXxbXFx1MUY1Qi1cXHUxRjVCXXxbXFx1MUY1RC1cXHUxRjVEXXxbXFx1MUY1Ri1cXHUxRjVGXXxbXFx1MUY2OC1cXHUxRjZGXXxbXFx1MUY4OC1cXHUxRjhGXXxbXFx1MUY5OC1cXHUxRjlGXXxbXFx1MUZBOC1cXHUxRkFGXXxbXFx1MUZCOC1cXHUxRkJDXXxbXFx1MUZDOC1cXHUxRkNDXXxbXFx1MUZEOC1cXHUxRkRCXXxbXFx1MUZFOC1cXHUxRkVDXXxbXFx1MUZGOC1cXHUxRkZDXXxbXFx1MjEwMi1cXHUyMTAyXXxbXFx1MjEwNy1cXHUyMTA3XXxbXFx1MjEwQi1cXHUyMTBEXXxbXFx1MjExMC1cXHUyMTEyXXxbXFx1MjExNS1cXHUyMTE1XXxbXFx1MjExOS1cXHUyMTFEXXxbXFx1MjEyNC1cXHUyMTI0XXxbXFx1MjEyNi1cXHUyMTI2XXxbXFx1MjEyOC1cXHUyMTI4XXxbXFx1MjEyQS1cXHUyMTJEXXxbXFx1MjEzMC1cXHUyMTMxXXxbXFx1MjEzMy1cXHUyMTMzXXxbXFx1RkYyMS1cXHVGRjNBXS8sXG4gIExsOiAvW1xcdTAwNjEtXFx1MDA3QV18W1xcdTAwQUEtXFx1MDBBQV18W1xcdTAwQjUtXFx1MDBCNV18W1xcdTAwQkEtXFx1MDBCQV18W1xcdTAwREYtXFx1MDBGNl18W1xcdTAwRjgtXFx1MDBGRl18W1xcdTAxMDEtXFx1MDEwMV18W1xcdTAxMDMtXFx1MDEwM118W1xcdTAxMDUtXFx1MDEwNV18W1xcdTAxMDctXFx1MDEwN118W1xcdTAxMDktXFx1MDEwOV18W1xcdTAxMEItXFx1MDEwQl18W1xcdTAxMEQtXFx1MDEwRF18W1xcdTAxMEYtXFx1MDEwRl18W1xcdTAxMTEtXFx1MDExMV18W1xcdTAxMTMtXFx1MDExM118W1xcdTAxMTUtXFx1MDExNV18W1xcdTAxMTctXFx1MDExN118W1xcdTAxMTktXFx1MDExOV18W1xcdTAxMUItXFx1MDExQl18W1xcdTAxMUQtXFx1MDExRF18W1xcdTAxMUYtXFx1MDExRl18W1xcdTAxMjEtXFx1MDEyMV18W1xcdTAxMjMtXFx1MDEyM118W1xcdTAxMjUtXFx1MDEyNV18W1xcdTAxMjctXFx1MDEyN118W1xcdTAxMjktXFx1MDEyOV18W1xcdTAxMkItXFx1MDEyQl18W1xcdTAxMkQtXFx1MDEyRF18W1xcdTAxMkYtXFx1MDEyRl18W1xcdTAxMzEtXFx1MDEzMV18W1xcdTAxMzMtXFx1MDEzM118W1xcdTAxMzUtXFx1MDEzNV18W1xcdTAxMzctXFx1MDEzOF18W1xcdTAxM0EtXFx1MDEzQV18W1xcdTAxM0MtXFx1MDEzQ118W1xcdTAxM0UtXFx1MDEzRV18W1xcdTAxNDAtXFx1MDE0MF18W1xcdTAxNDItXFx1MDE0Ml18W1xcdTAxNDQtXFx1MDE0NF18W1xcdTAxNDYtXFx1MDE0Nl18W1xcdTAxNDgtXFx1MDE0OV18W1xcdTAxNEItXFx1MDE0Ql18W1xcdTAxNEQtXFx1MDE0RF18W1xcdTAxNEYtXFx1MDE0Rl18W1xcdTAxNTEtXFx1MDE1MV18W1xcdTAxNTMtXFx1MDE1M118W1xcdTAxNTUtXFx1MDE1NV18W1xcdTAxNTctXFx1MDE1N118W1xcdTAxNTktXFx1MDE1OV18W1xcdTAxNUItXFx1MDE1Ql18W1xcdTAxNUQtXFx1MDE1RF18W1xcdTAxNUYtXFx1MDE1Rl18W1xcdTAxNjEtXFx1MDE2MV18W1xcdTAxNjMtXFx1MDE2M118W1xcdTAxNjUtXFx1MDE2NV18W1xcdTAxNjctXFx1MDE2N118W1xcdTAxNjktXFx1MDE2OV18W1xcdTAxNkItXFx1MDE2Ql18W1xcdTAxNkQtXFx1MDE2RF18W1xcdTAxNkYtXFx1MDE2Rl18W1xcdTAxNzEtXFx1MDE3MV18W1xcdTAxNzMtXFx1MDE3M118W1xcdTAxNzUtXFx1MDE3NV18W1xcdTAxNzctXFx1MDE3N118W1xcdTAxN0EtXFx1MDE3QV18W1xcdTAxN0MtXFx1MDE3Q118W1xcdTAxN0UtXFx1MDE4MF18W1xcdTAxODMtXFx1MDE4M118W1xcdTAxODUtXFx1MDE4NV18W1xcdTAxODgtXFx1MDE4OF18W1xcdTAxOEMtXFx1MDE4RF18W1xcdTAxOTItXFx1MDE5Ml18W1xcdTAxOTUtXFx1MDE5NV18W1xcdTAxOTktXFx1MDE5Ql18W1xcdTAxOUUtXFx1MDE5RV18W1xcdTAxQTEtXFx1MDFBMV18W1xcdTAxQTMtXFx1MDFBM118W1xcdTAxQTUtXFx1MDFBNV18W1xcdTAxQTgtXFx1MDFBOF18W1xcdTAxQUItXFx1MDFBQl18W1xcdTAxQUQtXFx1MDFBRF18W1xcdTAxQjAtXFx1MDFCMF18W1xcdTAxQjQtXFx1MDFCNF18W1xcdTAxQjYtXFx1MDFCNl18W1xcdTAxQjktXFx1MDFCQV18W1xcdTAxQkQtXFx1MDFCRF18W1xcdTAxQzYtXFx1MDFDNl18W1xcdTAxQzktXFx1MDFDOV18W1xcdTAxQ0MtXFx1MDFDQ118W1xcdTAxQ0UtXFx1MDFDRV18W1xcdTAxRDAtXFx1MDFEMF18W1xcdTAxRDItXFx1MDFEMl18W1xcdTAxRDQtXFx1MDFENF18W1xcdTAxRDYtXFx1MDFENl18W1xcdTAxRDgtXFx1MDFEOF18W1xcdTAxREEtXFx1MDFEQV18W1xcdTAxREMtXFx1MDFERF18W1xcdTAxREYtXFx1MDFERl18W1xcdTAxRTEtXFx1MDFFMV18W1xcdTAxRTMtXFx1MDFFM118W1xcdTAxRTUtXFx1MDFFNV18W1xcdTAxRTctXFx1MDFFN118W1xcdTAxRTktXFx1MDFFOV18W1xcdTAxRUItXFx1MDFFQl18W1xcdTAxRUQtXFx1MDFFRF18W1xcdTAxRUYtXFx1MDFGMF18W1xcdTAxRjMtXFx1MDFGM118W1xcdTAxRjUtXFx1MDFGNV18W1xcdTAxRkItXFx1MDFGQl18W1xcdTAxRkQtXFx1MDFGRF18W1xcdTAxRkYtXFx1MDFGRl18W1xcdTAyMDEtXFx1MDIwMV18W1xcdTAyMDMtXFx1MDIwM118W1xcdTAyMDUtXFx1MDIwNV18W1xcdTAyMDctXFx1MDIwN118W1xcdTAyMDktXFx1MDIwOV18W1xcdTAyMEItXFx1MDIwQl18W1xcdTAyMEQtXFx1MDIwRF18W1xcdTAyMEYtXFx1MDIwRl18W1xcdTAyMTEtXFx1MDIxMV18W1xcdTAyMTMtXFx1MDIxM118W1xcdTAyMTUtXFx1MDIxNV18W1xcdTAyMTctXFx1MDIxN118W1xcdTAyNTAtXFx1MDJBOF18W1xcdTAzOTAtXFx1MDM5MF18W1xcdTAzQUMtXFx1MDNDRV18W1xcdTAzRDAtXFx1MDNEMV18W1xcdTAzRDUtXFx1MDNENl18W1xcdTAzRTMtXFx1MDNFM118W1xcdTAzRTUtXFx1MDNFNV18W1xcdTAzRTctXFx1MDNFN118W1xcdTAzRTktXFx1MDNFOV18W1xcdTAzRUItXFx1MDNFQl18W1xcdTAzRUQtXFx1MDNFRF18W1xcdTAzRUYtXFx1MDNGMl18W1xcdTA0MzAtXFx1MDQ0Rl18W1xcdTA0NTEtXFx1MDQ1Q118W1xcdTA0NUUtXFx1MDQ1Rl18W1xcdTA0NjEtXFx1MDQ2MV18W1xcdTA0NjMtXFx1MDQ2M118W1xcdTA0NjUtXFx1MDQ2NV18W1xcdTA0NjctXFx1MDQ2N118W1xcdTA0NjktXFx1MDQ2OV18W1xcdTA0NkItXFx1MDQ2Ql18W1xcdTA0NkQtXFx1MDQ2RF18W1xcdTA0NkYtXFx1MDQ2Rl18W1xcdTA0NzEtXFx1MDQ3MV18W1xcdTA0NzMtXFx1MDQ3M118W1xcdTA0NzUtXFx1MDQ3NV18W1xcdTA0NzctXFx1MDQ3N118W1xcdTA0NzktXFx1MDQ3OV18W1xcdTA0N0ItXFx1MDQ3Ql18W1xcdTA0N0QtXFx1MDQ3RF18W1xcdTA0N0YtXFx1MDQ3Rl18W1xcdTA0ODEtXFx1MDQ4MV18W1xcdTA0OTEtXFx1MDQ5MV18W1xcdTA0OTMtXFx1MDQ5M118W1xcdTA0OTUtXFx1MDQ5NV18W1xcdTA0OTctXFx1MDQ5N118W1xcdTA0OTktXFx1MDQ5OV18W1xcdTA0OUItXFx1MDQ5Ql18W1xcdTA0OUQtXFx1MDQ5RF18W1xcdTA0OUYtXFx1MDQ5Rl18W1xcdTA0QTEtXFx1MDRBMV18W1xcdTA0QTMtXFx1MDRBM118W1xcdTA0QTUtXFx1MDRBNV18W1xcdTA0QTctXFx1MDRBN118W1xcdTA0QTktXFx1MDRBOV18W1xcdTA0QUItXFx1MDRBQl18W1xcdTA0QUQtXFx1MDRBRF18W1xcdTA0QUYtXFx1MDRBRl18W1xcdTA0QjEtXFx1MDRCMV18W1xcdTA0QjMtXFx1MDRCM118W1xcdTA0QjUtXFx1MDRCNV18W1xcdTA0QjctXFx1MDRCN118W1xcdTA0QjktXFx1MDRCOV18W1xcdTA0QkItXFx1MDRCQl18W1xcdTA0QkQtXFx1MDRCRF18W1xcdTA0QkYtXFx1MDRCRl18W1xcdTA0QzItXFx1MDRDMl18W1xcdTA0QzQtXFx1MDRDNF18W1xcdTA0QzgtXFx1MDRDOF18W1xcdTA0Q0MtXFx1MDRDQ118W1xcdTA0RDEtXFx1MDREMV18W1xcdTA0RDMtXFx1MDREM118W1xcdTA0RDUtXFx1MDRENV18W1xcdTA0RDctXFx1MDREN118W1xcdTA0RDktXFx1MDREOV18W1xcdTA0REItXFx1MDREQl18W1xcdTA0REQtXFx1MDRERF18W1xcdTA0REYtXFx1MDRERl18W1xcdTA0RTEtXFx1MDRFMV18W1xcdTA0RTMtXFx1MDRFM118W1xcdTA0RTUtXFx1MDRFNV18W1xcdTA0RTctXFx1MDRFN118W1xcdTA0RTktXFx1MDRFOV18W1xcdTA0RUItXFx1MDRFQl18W1xcdTA0RUYtXFx1MDRFRl18W1xcdTA0RjEtXFx1MDRGMV18W1xcdTA0RjMtXFx1MDRGM118W1xcdTA0RjUtXFx1MDRGNV18W1xcdTA0RjktXFx1MDRGOV18W1xcdTA1NjEtXFx1MDU4N118W1xcdTEwRDAtXFx1MTBGNl18W1xcdTFFMDEtXFx1MUUwMV18W1xcdTFFMDMtXFx1MUUwM118W1xcdTFFMDUtXFx1MUUwNV18W1xcdTFFMDctXFx1MUUwN118W1xcdTFFMDktXFx1MUUwOV18W1xcdTFFMEItXFx1MUUwQl18W1xcdTFFMEQtXFx1MUUwRF18W1xcdTFFMEYtXFx1MUUwRl18W1xcdTFFMTEtXFx1MUUxMV18W1xcdTFFMTMtXFx1MUUxM118W1xcdTFFMTUtXFx1MUUxNV18W1xcdTFFMTctXFx1MUUxN118W1xcdTFFMTktXFx1MUUxOV18W1xcdTFFMUItXFx1MUUxQl18W1xcdTFFMUQtXFx1MUUxRF18W1xcdTFFMUYtXFx1MUUxRl18W1xcdTFFMjEtXFx1MUUyMV18W1xcdTFFMjMtXFx1MUUyM118W1xcdTFFMjUtXFx1MUUyNV18W1xcdTFFMjctXFx1MUUyN118W1xcdTFFMjktXFx1MUUyOV18W1xcdTFFMkItXFx1MUUyQl18W1xcdTFFMkQtXFx1MUUyRF18W1xcdTFFMkYtXFx1MUUyRl18W1xcdTFFMzEtXFx1MUUzMV18W1xcdTFFMzMtXFx1MUUzM118W1xcdTFFMzUtXFx1MUUzNV18W1xcdTFFMzctXFx1MUUzN118W1xcdTFFMzktXFx1MUUzOV18W1xcdTFFM0ItXFx1MUUzQl18W1xcdTFFM0QtXFx1MUUzRF18W1xcdTFFM0YtXFx1MUUzRl18W1xcdTFFNDEtXFx1MUU0MV18W1xcdTFFNDMtXFx1MUU0M118W1xcdTFFNDUtXFx1MUU0NV18W1xcdTFFNDctXFx1MUU0N118W1xcdTFFNDktXFx1MUU0OV18W1xcdTFFNEItXFx1MUU0Ql18W1xcdTFFNEQtXFx1MUU0RF18W1xcdTFFNEYtXFx1MUU0Rl18W1xcdTFFNTEtXFx1MUU1MV18W1xcdTFFNTMtXFx1MUU1M118W1xcdTFFNTUtXFx1MUU1NV18W1xcdTFFNTctXFx1MUU1N118W1xcdTFFNTktXFx1MUU1OV18W1xcdTFFNUItXFx1MUU1Ql18W1xcdTFFNUQtXFx1MUU1RF18W1xcdTFFNUYtXFx1MUU1Rl18W1xcdTFFNjEtXFx1MUU2MV18W1xcdTFFNjMtXFx1MUU2M118W1xcdTFFNjUtXFx1MUU2NV18W1xcdTFFNjctXFx1MUU2N118W1xcdTFFNjktXFx1MUU2OV18W1xcdTFFNkItXFx1MUU2Ql18W1xcdTFFNkQtXFx1MUU2RF18W1xcdTFFNkYtXFx1MUU2Rl18W1xcdTFFNzEtXFx1MUU3MV18W1xcdTFFNzMtXFx1MUU3M118W1xcdTFFNzUtXFx1MUU3NV18W1xcdTFFNzctXFx1MUU3N118W1xcdTFFNzktXFx1MUU3OV18W1xcdTFFN0ItXFx1MUU3Ql18W1xcdTFFN0QtXFx1MUU3RF18W1xcdTFFN0YtXFx1MUU3Rl18W1xcdTFFODEtXFx1MUU4MV18W1xcdTFFODMtXFx1MUU4M118W1xcdTFFODUtXFx1MUU4NV18W1xcdTFFODctXFx1MUU4N118W1xcdTFFODktXFx1MUU4OV18W1xcdTFFOEItXFx1MUU4Ql18W1xcdTFFOEQtXFx1MUU4RF18W1xcdTFFOEYtXFx1MUU4Rl18W1xcdTFFOTEtXFx1MUU5MV18W1xcdTFFOTMtXFx1MUU5M118W1xcdTFFOTUtXFx1MUU5Ql18W1xcdTFFQTEtXFx1MUVBMV18W1xcdTFFQTMtXFx1MUVBM118W1xcdTFFQTUtXFx1MUVBNV18W1xcdTFFQTctXFx1MUVBN118W1xcdTFFQTktXFx1MUVBOV18W1xcdTFFQUItXFx1MUVBQl18W1xcdTFFQUQtXFx1MUVBRF18W1xcdTFFQUYtXFx1MUVBRl18W1xcdTFFQjEtXFx1MUVCMV18W1xcdTFFQjMtXFx1MUVCM118W1xcdTFFQjUtXFx1MUVCNV18W1xcdTFFQjctXFx1MUVCN118W1xcdTFFQjktXFx1MUVCOV18W1xcdTFFQkItXFx1MUVCQl18W1xcdTFFQkQtXFx1MUVCRF18W1xcdTFFQkYtXFx1MUVCRl18W1xcdTFFQzEtXFx1MUVDMV18W1xcdTFFQzMtXFx1MUVDM118W1xcdTFFQzUtXFx1MUVDNV18W1xcdTFFQzctXFx1MUVDN118W1xcdTFFQzktXFx1MUVDOV18W1xcdTFFQ0ItXFx1MUVDQl18W1xcdTFFQ0QtXFx1MUVDRF18W1xcdTFFQ0YtXFx1MUVDRl18W1xcdTFFRDEtXFx1MUVEMV18W1xcdTFFRDMtXFx1MUVEM118W1xcdTFFRDUtXFx1MUVENV18W1xcdTFFRDctXFx1MUVEN118W1xcdTFFRDktXFx1MUVEOV18W1xcdTFFREItXFx1MUVEQl18W1xcdTFFREQtXFx1MUVERF18W1xcdTFFREYtXFx1MUVERl18W1xcdTFFRTEtXFx1MUVFMV18W1xcdTFFRTMtXFx1MUVFM118W1xcdTFFRTUtXFx1MUVFNV18W1xcdTFFRTctXFx1MUVFN118W1xcdTFFRTktXFx1MUVFOV18W1xcdTFFRUItXFx1MUVFQl18W1xcdTFFRUQtXFx1MUVFRF18W1xcdTFFRUYtXFx1MUVFRl18W1xcdTFFRjEtXFx1MUVGMV18W1xcdTFFRjMtXFx1MUVGM118W1xcdTFFRjUtXFx1MUVGNV18W1xcdTFFRjctXFx1MUVGN118W1xcdTFFRjktXFx1MUVGOV18W1xcdTFGMDAtXFx1MUYwN118W1xcdTFGMTAtXFx1MUYxNV18W1xcdTFGMjAtXFx1MUYyN118W1xcdTFGMzAtXFx1MUYzN118W1xcdTFGNDAtXFx1MUY0NV18W1xcdTFGNTAtXFx1MUY1N118W1xcdTFGNjAtXFx1MUY2N118W1xcdTFGNzAtXFx1MUY3RF18W1xcdTFGODAtXFx1MUY4N118W1xcdTFGOTAtXFx1MUY5N118W1xcdTFGQTAtXFx1MUZBN118W1xcdTFGQjAtXFx1MUZCNF18W1xcdTFGQjYtXFx1MUZCN118W1xcdTFGQkUtXFx1MUZCRV18W1xcdTFGQzItXFx1MUZDNF18W1xcdTFGQzYtXFx1MUZDN118W1xcdTFGRDAtXFx1MUZEM118W1xcdTFGRDYtXFx1MUZEN118W1xcdTFGRTAtXFx1MUZFN118W1xcdTFGRjItXFx1MUZGNF18W1xcdTFGRjYtXFx1MUZGN118W1xcdTIwN0YtXFx1MjA3Rl18W1xcdTIxMEEtXFx1MjEwQV18W1xcdTIxMEUtXFx1MjEwRl18W1xcdTIxMTMtXFx1MjExM118W1xcdTIxMTgtXFx1MjExOF18W1xcdTIxMkUtXFx1MjEyRl18W1xcdTIxMzQtXFx1MjEzNF18W1xcdUZCMDAtXFx1RkIwNl18W1xcdUZCMTMtXFx1RkIxN118W1xcdUZGNDEtXFx1RkY1QV0vLFxuICBMdDogL1tcXHUwMUM1LVxcdTAxQzVdfFtcXHUwMUM4LVxcdTAxQzhdfFtcXHUwMUNCLVxcdTAxQ0JdfFtcXHUwMUYyLVxcdTAxRjJdLyxcbiAgTG06IC9bXFx1MDJCMC1cXHUwMkI4XXxbXFx1MDJCQi1cXHUwMkMxXXxbXFx1MDJEMC1cXHUwMkQxXXxbXFx1MDJFMC1cXHUwMkU0XXxbXFx1MDM3QS1cXHUwMzdBXXxbXFx1MDU1OS1cXHUwNTU5XXxbXFx1MDY0MC1cXHUwNjQwXXxbXFx1MDZFNS1cXHUwNkU2XXxbXFx1MEU0Ni1cXHUwRTQ2XXxbXFx1MEVDNi1cXHUwRUM2XXxbXFx1MzAwNS1cXHUzMDA1XXxbXFx1MzAzMS1cXHUzMDM1XXxbXFx1MzA5RC1cXHUzMDlFXXxbXFx1MzBGQy1cXHUzMEZFXXxbXFx1RkY3MC1cXHVGRjcwXXxbXFx1RkY5RS1cXHVGRjlGXS8sXG4gIExvOiAvW1xcdTAxQUEtXFx1MDFBQV18W1xcdTAxQkItXFx1MDFCQl18W1xcdTAxQkUtXFx1MDFDM118W1xcdTAzRjMtXFx1MDNGM118W1xcdTA0QzAtXFx1MDRDMF18W1xcdTA1RDAtXFx1MDVFQV18W1xcdTA1RjAtXFx1MDVGMl18W1xcdTA2MjEtXFx1MDYzQV18W1xcdTA2NDEtXFx1MDY0QV18W1xcdTA2NzEtXFx1MDZCN118W1xcdTA2QkEtXFx1MDZCRV18W1xcdTA2QzAtXFx1MDZDRV18W1xcdTA2RDAtXFx1MDZEM118W1xcdTA2RDUtXFx1MDZENV18W1xcdTA5MDUtXFx1MDkzOV18W1xcdTA5M0QtXFx1MDkzRF18W1xcdTA5NTAtXFx1MDk1MF18W1xcdTA5NTgtXFx1MDk2MV18W1xcdTA5ODUtXFx1MDk4Q118W1xcdTA5OEYtXFx1MDk5MF18W1xcdTA5OTMtXFx1MDlBOF18W1xcdTA5QUEtXFx1MDlCMF18W1xcdTA5QjItXFx1MDlCMl18W1xcdTA5QjYtXFx1MDlCOV18W1xcdTA5REMtXFx1MDlERF18W1xcdTA5REYtXFx1MDlFMV18W1xcdTA5RjAtXFx1MDlGMV18W1xcdTBBMDUtXFx1MEEwQV18W1xcdTBBMEYtXFx1MEExMF18W1xcdTBBMTMtXFx1MEEyOF18W1xcdTBBMkEtXFx1MEEzMF18W1xcdTBBMzItXFx1MEEzM118W1xcdTBBMzUtXFx1MEEzNl18W1xcdTBBMzgtXFx1MEEzOV18W1xcdTBBNTktXFx1MEE1Q118W1xcdTBBNUUtXFx1MEE1RV18W1xcdTBBNzItXFx1MEE3NF18W1xcdTBBODUtXFx1MEE4Ql18W1xcdTBBOEQtXFx1MEE4RF18W1xcdTBBOEYtXFx1MEE5MV18W1xcdTBBOTMtXFx1MEFBOF18W1xcdTBBQUEtXFx1MEFCMF18W1xcdTBBQjItXFx1MEFCM118W1xcdTBBQjUtXFx1MEFCOV18W1xcdTBBQkQtXFx1MEFCRF18W1xcdTBBRDAtXFx1MEFEMF18W1xcdTBBRTAtXFx1MEFFMF18W1xcdTBCMDUtXFx1MEIwQ118W1xcdTBCMEYtXFx1MEIxMF18W1xcdTBCMTMtXFx1MEIyOF18W1xcdTBCMkEtXFx1MEIzMF18W1xcdTBCMzItXFx1MEIzM118W1xcdTBCMzYtXFx1MEIzOV18W1xcdTBCM0QtXFx1MEIzRF18W1xcdTBCNUMtXFx1MEI1RF18W1xcdTBCNUYtXFx1MEI2MV18W1xcdTBCODUtXFx1MEI4QV18W1xcdTBCOEUtXFx1MEI5MF18W1xcdTBCOTItXFx1MEI5NV18W1xcdTBCOTktXFx1MEI5QV18W1xcdTBCOUMtXFx1MEI5Q118W1xcdTBCOUUtXFx1MEI5Rl18W1xcdTBCQTMtXFx1MEJBNF18W1xcdTBCQTgtXFx1MEJBQV18W1xcdTBCQUUtXFx1MEJCNV18W1xcdTBCQjctXFx1MEJCOV18W1xcdTBDMDUtXFx1MEMwQ118W1xcdTBDMEUtXFx1MEMxMF18W1xcdTBDMTItXFx1MEMyOF18W1xcdTBDMkEtXFx1MEMzM118W1xcdTBDMzUtXFx1MEMzOV18W1xcdTBDNjAtXFx1MEM2MV18W1xcdTBDODUtXFx1MEM4Q118W1xcdTBDOEUtXFx1MEM5MF18W1xcdTBDOTItXFx1MENBOF18W1xcdTBDQUEtXFx1MENCM118W1xcdTBDQjUtXFx1MENCOV18W1xcdTBDREUtXFx1MENERV18W1xcdTBDRTAtXFx1MENFMV18W1xcdTBEMDUtXFx1MEQwQ118W1xcdTBEMEUtXFx1MEQxMF18W1xcdTBEMTItXFx1MEQyOF18W1xcdTBEMkEtXFx1MEQzOV18W1xcdTBENjAtXFx1MEQ2MV18W1xcdTBFMDEtXFx1MEUzMF18W1xcdTBFMzItXFx1MEUzM118W1xcdTBFNDAtXFx1MEU0NV18W1xcdTBFODEtXFx1MEU4Ml18W1xcdTBFODQtXFx1MEU4NF18W1xcdTBFODctXFx1MEU4OF18W1xcdTBFOEEtXFx1MEU4QV18W1xcdTBFOEQtXFx1MEU4RF18W1xcdTBFOTQtXFx1MEU5N118W1xcdTBFOTktXFx1MEU5Rl18W1xcdTBFQTEtXFx1MEVBM118W1xcdTBFQTUtXFx1MEVBNV18W1xcdTBFQTctXFx1MEVBN118W1xcdTBFQUEtXFx1MEVBQl18W1xcdTBFQUQtXFx1MEVCMF18W1xcdTBFQjItXFx1MEVCM118W1xcdTBFQkQtXFx1MEVCRF18W1xcdTBFQzAtXFx1MEVDNF18W1xcdTBFREMtXFx1MEVERF18W1xcdTBGMDAtXFx1MEYwMF18W1xcdTBGNDAtXFx1MEY0N118W1xcdTBGNDktXFx1MEY2OV18W1xcdTBGODgtXFx1MEY4Ql18W1xcdTExMDAtXFx1MTE1OV18W1xcdTExNUYtXFx1MTFBMl18W1xcdTExQTgtXFx1MTFGOV18W1xcdTIxMzUtXFx1MjEzOF18W1xcdTMwMDYtXFx1MzAwNl18W1xcdTMwNDEtXFx1MzA5NF18W1xcdTMwQTEtXFx1MzBGQV18W1xcdTMxMDUtXFx1MzEyQ118W1xcdTMxMzEtXFx1MzE4RV18W1xcdTRFMDAtXFx1OUZBNV18W1xcdUFDMDAtXFx1RDdBM118W1xcdUY5MDAtXFx1RkEyRF18W1xcdUZCMUYtXFx1RkIyOF18W1xcdUZCMkEtXFx1RkIzNl18W1xcdUZCMzgtXFx1RkIzQ118W1xcdUZCM0UtXFx1RkIzRV18W1xcdUZCNDAtXFx1RkI0MV18W1xcdUZCNDMtXFx1RkI0NF18W1xcdUZCNDYtXFx1RkJCMV18W1xcdUZCRDMtXFx1RkQzRF18W1xcdUZENTAtXFx1RkQ4Rl18W1xcdUZEOTItXFx1RkRDN118W1xcdUZERjAtXFx1RkRGQl18W1xcdUZFNzAtXFx1RkU3Ml18W1xcdUZFNzQtXFx1RkU3NF18W1xcdUZFNzYtXFx1RkVGQ118W1xcdUZGNjYtXFx1RkY2Rl18W1xcdUZGNzEtXFx1RkY5RF18W1xcdUZGQTAtXFx1RkZCRV18W1xcdUZGQzItXFx1RkZDN118W1xcdUZGQ0EtXFx1RkZDRl18W1xcdUZGRDItXFx1RkZEN118W1xcdUZGREEtXFx1RkZEQ10vLFxuXG4gIC8vIE51bWJlcnNcbiAgTmw6IC9bXFx1MjE2MC1cXHUyMTgyXXxbXFx1MzAwNy1cXHUzMDA3XXxbXFx1MzAyMS1cXHUzMDI5XS8sXG4gIE5kOiAvW1xcdTAwMzAtXFx1MDAzOV18W1xcdTA2NjAtXFx1MDY2OV18W1xcdTA2RjAtXFx1MDZGOV18W1xcdTA5NjYtXFx1MDk2Rl18W1xcdTA5RTYtXFx1MDlFRl18W1xcdTBBNjYtXFx1MEE2Rl18W1xcdTBBRTYtXFx1MEFFRl18W1xcdTBCNjYtXFx1MEI2Rl18W1xcdTBCRTctXFx1MEJFRl18W1xcdTBDNjYtXFx1MEM2Rl18W1xcdTBDRTYtXFx1MENFRl18W1xcdTBENjYtXFx1MEQ2Rl18W1xcdTBFNTAtXFx1MEU1OV18W1xcdTBFRDAtXFx1MEVEOV18W1xcdTBGMjAtXFx1MEYyOV18W1xcdUZGMTAtXFx1RkYxOV0vLFxuXG4gIC8vIE1hcmtzXG4gIE1uOiAvW1xcdTAzMDAtXFx1MDM0NV18W1xcdTAzNjAtXFx1MDM2MV18W1xcdTA0ODMtXFx1MDQ4Nl18W1xcdTA1OTEtXFx1MDVBMV18W1xcdTA1QTMtXFx1MDVCOV18W1xcdTA1QkItXFx1MDVCRF18W1xcdTA1QkYtXFx1MDVCRl18W1xcdTA1QzEtXFx1MDVDMl18W1xcdTA1QzQtXFx1MDVDNF18W1xcdTA2NEItXFx1MDY1Ml18W1xcdTA2NzAtXFx1MDY3MF18W1xcdTA2RDYtXFx1MDZEQ118W1xcdTA2REYtXFx1MDZFNF18W1xcdTA2RTctXFx1MDZFOF18W1xcdTA2RUEtXFx1MDZFRF18W1xcdTA5MDEtXFx1MDkwMl18W1xcdTA5M0MtXFx1MDkzQ118W1xcdTA5NDEtXFx1MDk0OF18W1xcdTA5NEQtXFx1MDk0RF18W1xcdTA5NTEtXFx1MDk1NF18W1xcdTA5NjItXFx1MDk2M118W1xcdTA5ODEtXFx1MDk4MV18W1xcdTA5QkMtXFx1MDlCQ118W1xcdTA5QzEtXFx1MDlDNF18W1xcdTA5Q0QtXFx1MDlDRF18W1xcdTA5RTItXFx1MDlFM118W1xcdTBBMDItXFx1MEEwMl18W1xcdTBBM0MtXFx1MEEzQ118W1xcdTBBNDEtXFx1MEE0Ml18W1xcdTBBNDctXFx1MEE0OF18W1xcdTBBNEItXFx1MEE0RF18W1xcdTBBNzAtXFx1MEE3MV18W1xcdTBBODEtXFx1MEE4Ml18W1xcdTBBQkMtXFx1MEFCQ118W1xcdTBBQzEtXFx1MEFDNV18W1xcdTBBQzctXFx1MEFDOF18W1xcdTBBQ0QtXFx1MEFDRF18W1xcdTBCMDEtXFx1MEIwMV18W1xcdTBCM0MtXFx1MEIzQ118W1xcdTBCM0YtXFx1MEIzRl18W1xcdTBCNDEtXFx1MEI0M118W1xcdTBCNEQtXFx1MEI0RF18W1xcdTBCNTYtXFx1MEI1Nl18W1xcdTBCODItXFx1MEI4Ml18W1xcdTBCQzAtXFx1MEJDMF18W1xcdTBCQ0QtXFx1MEJDRF18W1xcdTBDM0UtXFx1MEM0MF18W1xcdTBDNDYtXFx1MEM0OF18W1xcdTBDNEEtXFx1MEM0RF18W1xcdTBDNTUtXFx1MEM1Nl18W1xcdTBDQkYtXFx1MENCRl18W1xcdTBDQzYtXFx1MENDNl18W1xcdTBDQ0MtXFx1MENDRF18W1xcdTBENDEtXFx1MEQ0M118W1xcdTBENEQtXFx1MEQ0RF18W1xcdTBFMzEtXFx1MEUzMV18W1xcdTBFMzQtXFx1MEUzQV18W1xcdTBFNDctXFx1MEU0RV18W1xcdTBFQjEtXFx1MEVCMV18W1xcdTBFQjQtXFx1MEVCOV18W1xcdTBFQkItXFx1MEVCQ118W1xcdTBFQzgtXFx1MEVDRF18W1xcdTBGMTgtXFx1MEYxOV18W1xcdTBGMzUtXFx1MEYzNV18W1xcdTBGMzctXFx1MEYzN118W1xcdTBGMzktXFx1MEYzOV18W1xcdTBGNzEtXFx1MEY3RV18W1xcdTBGODAtXFx1MEY4NF18W1xcdTBGODYtXFx1MEY4N118W1xcdTBGOTAtXFx1MEY5NV18W1xcdTBGOTctXFx1MEY5N118W1xcdTBGOTktXFx1MEZBRF18W1xcdTBGQjEtXFx1MEZCN118W1xcdTBGQjktXFx1MEZCOV18W1xcdTIwRDAtXFx1MjBEQ118W1xcdTIwRTEtXFx1MjBFMV18W1xcdTMwMkEtXFx1MzAyRl18W1xcdTMwOTktXFx1MzA5QV18W1xcdUZCMUUtXFx1RkIxRV18W1xcdUZFMjAtXFx1RkUyM10vLFxuICBNYzogL1tcXHUwOTAzLVxcdTA5MDNdfFtcXHUwOTNFLVxcdTA5NDBdfFtcXHUwOTQ5LVxcdTA5NENdfFtcXHUwOTgyLVxcdTA5ODNdfFtcXHUwOUJFLVxcdTA5QzBdfFtcXHUwOUM3LVxcdTA5QzhdfFtcXHUwOUNCLVxcdTA5Q0NdfFtcXHUwOUQ3LVxcdTA5RDddfFtcXHUwQTNFLVxcdTBBNDBdfFtcXHUwQTgzLVxcdTBBODNdfFtcXHUwQUJFLVxcdTBBQzBdfFtcXHUwQUM5LVxcdTBBQzldfFtcXHUwQUNCLVxcdTBBQ0NdfFtcXHUwQjAyLVxcdTBCMDNdfFtcXHUwQjNFLVxcdTBCM0VdfFtcXHUwQjQwLVxcdTBCNDBdfFtcXHUwQjQ3LVxcdTBCNDhdfFtcXHUwQjRCLVxcdTBCNENdfFtcXHUwQjU3LVxcdTBCNTddfFtcXHUwQjgzLVxcdTBCODNdfFtcXHUwQkJFLVxcdTBCQkZdfFtcXHUwQkMxLVxcdTBCQzJdfFtcXHUwQkM2LVxcdTBCQzhdfFtcXHUwQkNBLVxcdTBCQ0NdfFtcXHUwQkQ3LVxcdTBCRDddfFtcXHUwQzAxLVxcdTBDMDNdfFtcXHUwQzQxLVxcdTBDNDRdfFtcXHUwQzgyLVxcdTBDODNdfFtcXHUwQ0JFLVxcdTBDQkVdfFtcXHUwQ0MwLVxcdTBDQzRdfFtcXHUwQ0M3LVxcdTBDQzhdfFtcXHUwQ0NBLVxcdTBDQ0JdfFtcXHUwQ0Q1LVxcdTBDRDZdfFtcXHUwRDAyLVxcdTBEMDNdfFtcXHUwRDNFLVxcdTBENDBdfFtcXHUwRDQ2LVxcdTBENDhdfFtcXHUwRDRBLVxcdTBENENdfFtcXHUwRDU3LVxcdTBENTddfFtcXHUwRjNFLVxcdTBGM0ZdfFtcXHUwRjdGLVxcdTBGN0ZdLyxcblxuICAvLyBQdW5jdHVhdGlvbiwgQ29ubmVjdG9yXG4gIFBjOiAvW1xcdTAwNUYtXFx1MDA1Rl18W1xcdTIwM0YtXFx1MjA0MF18W1xcdTMwRkItXFx1MzBGQl18W1xcdUZFMzMtXFx1RkUzNF18W1xcdUZFNEQtXFx1RkU0Rl18W1xcdUZGM0YtXFx1RkYzRl18W1xcdUZGNjUtXFx1RkY2NV0vLFxuXG4gIC8vIFNlcGFyYXRvciwgU3BhY2VcbiAgWnM6IC9bXFx1MjAwMC1cXHUyMDBCXXxbXFx1MzAwMC1cXHUzMDAwXS8sXG5cbiAgLy8gVGhlc2UgdHdvIGFyZSBub3QgcmVhbCBVbmljb2RlIGNhdGVnb3JpZXMsIGJ1dCBvdXIgdXNlZnVsIGZvciBPaG0uXG4gIC8vIEwgaXMgYSBjb21iaW5hdGlvbiBvZiBhbGwgdGhlIGxldHRlciBjYXRlZ29yaWVzLlxuICAvLyBMdG1vIGlzIGEgY29tYmluYXRpb24gb2YgTHQsIExtLCBhbmQgTG8uXG4gIEw6IC9bXFx1MDA0MS1cXHUwMDVBXXxbXFx1MDBDMC1cXHUwMEQ2XXxbXFx1MDBEOC1cXHUwMERFXXxbXFx1MDEwMC1cXHUwMTAwXXxbXFx1MDEwMi1cXHUwMTAyXXxbXFx1MDEwNC1cXHUwMTA0XXxbXFx1MDEwNi1cXHUwMTA2XXxbXFx1MDEwOC1cXHUwMTA4XXxbXFx1MDEwQS1cXHUwMTBBXXxbXFx1MDEwQy1cXHUwMTBDXXxbXFx1MDEwRS1cXHUwMTBFXXxbXFx1MDExMC1cXHUwMTEwXXxbXFx1MDExMi1cXHUwMTEyXXxbXFx1MDExNC1cXHUwMTE0XXxbXFx1MDExNi1cXHUwMTE2XXxbXFx1MDExOC1cXHUwMTE4XXxbXFx1MDExQS1cXHUwMTFBXXxbXFx1MDExQy1cXHUwMTFDXXxbXFx1MDExRS1cXHUwMTFFXXxbXFx1MDEyMC1cXHUwMTIwXXxbXFx1MDEyMi1cXHUwMTIyXXxbXFx1MDEyNC1cXHUwMTI0XXxbXFx1MDEyNi1cXHUwMTI2XXxbXFx1MDEyOC1cXHUwMTI4XXxbXFx1MDEyQS1cXHUwMTJBXXxbXFx1MDEyQy1cXHUwMTJDXXxbXFx1MDEyRS1cXHUwMTJFXXxbXFx1MDEzMC1cXHUwMTMwXXxbXFx1MDEzMi1cXHUwMTMyXXxbXFx1MDEzNC1cXHUwMTM0XXxbXFx1MDEzNi1cXHUwMTM2XXxbXFx1MDEzOS1cXHUwMTM5XXxbXFx1MDEzQi1cXHUwMTNCXXxbXFx1MDEzRC1cXHUwMTNEXXxbXFx1MDEzRi1cXHUwMTNGXXxbXFx1MDE0MS1cXHUwMTQxXXxbXFx1MDE0My1cXHUwMTQzXXxbXFx1MDE0NS1cXHUwMTQ1XXxbXFx1MDE0Ny1cXHUwMTQ3XXxbXFx1MDE0QS1cXHUwMTRBXXxbXFx1MDE0Qy1cXHUwMTRDXXxbXFx1MDE0RS1cXHUwMTRFXXxbXFx1MDE1MC1cXHUwMTUwXXxbXFx1MDE1Mi1cXHUwMTUyXXxbXFx1MDE1NC1cXHUwMTU0XXxbXFx1MDE1Ni1cXHUwMTU2XXxbXFx1MDE1OC1cXHUwMTU4XXxbXFx1MDE1QS1cXHUwMTVBXXxbXFx1MDE1Qy1cXHUwMTVDXXxbXFx1MDE1RS1cXHUwMTVFXXxbXFx1MDE2MC1cXHUwMTYwXXxbXFx1MDE2Mi1cXHUwMTYyXXxbXFx1MDE2NC1cXHUwMTY0XXxbXFx1MDE2Ni1cXHUwMTY2XXxbXFx1MDE2OC1cXHUwMTY4XXxbXFx1MDE2QS1cXHUwMTZBXXxbXFx1MDE2Qy1cXHUwMTZDXXxbXFx1MDE2RS1cXHUwMTZFXXxbXFx1MDE3MC1cXHUwMTcwXXxbXFx1MDE3Mi1cXHUwMTcyXXxbXFx1MDE3NC1cXHUwMTc0XXxbXFx1MDE3Ni1cXHUwMTc2XXxbXFx1MDE3OC1cXHUwMTc5XXxbXFx1MDE3Qi1cXHUwMTdCXXxbXFx1MDE3RC1cXHUwMTdEXXxbXFx1MDE4MS1cXHUwMTgyXXxbXFx1MDE4NC1cXHUwMTg0XXxbXFx1MDE4Ni1cXHUwMTg3XXxbXFx1MDE4OS1cXHUwMThCXXxbXFx1MDE4RS1cXHUwMTkxXXxbXFx1MDE5My1cXHUwMTk0XXxbXFx1MDE5Ni1cXHUwMTk4XXxbXFx1MDE5Qy1cXHUwMTlEXXxbXFx1MDE5Ri1cXHUwMUEwXXxbXFx1MDFBMi1cXHUwMUEyXXxbXFx1MDFBNC1cXHUwMUE0XXxbXFx1MDFBNi1cXHUwMUE3XXxbXFx1MDFBOS1cXHUwMUE5XXxbXFx1MDFBQy1cXHUwMUFDXXxbXFx1MDFBRS1cXHUwMUFGXXxbXFx1MDFCMS1cXHUwMUIzXXxbXFx1MDFCNS1cXHUwMUI1XXxbXFx1MDFCNy1cXHUwMUI4XXxbXFx1MDFCQy1cXHUwMUJDXXxbXFx1MDFDNC1cXHUwMUM0XXxbXFx1MDFDNy1cXHUwMUM3XXxbXFx1MDFDQS1cXHUwMUNBXXxbXFx1MDFDRC1cXHUwMUNEXXxbXFx1MDFDRi1cXHUwMUNGXXxbXFx1MDFEMS1cXHUwMUQxXXxbXFx1MDFEMy1cXHUwMUQzXXxbXFx1MDFENS1cXHUwMUQ1XXxbXFx1MDFENy1cXHUwMUQ3XXxbXFx1MDFEOS1cXHUwMUQ5XXxbXFx1MDFEQi1cXHUwMURCXXxbXFx1MDFERS1cXHUwMURFXXxbXFx1MDFFMC1cXHUwMUUwXXxbXFx1MDFFMi1cXHUwMUUyXXxbXFx1MDFFNC1cXHUwMUU0XXxbXFx1MDFFNi1cXHUwMUU2XXxbXFx1MDFFOC1cXHUwMUU4XXxbXFx1MDFFQS1cXHUwMUVBXXxbXFx1MDFFQy1cXHUwMUVDXXxbXFx1MDFFRS1cXHUwMUVFXXxbXFx1MDFGMS1cXHUwMUYxXXxbXFx1MDFGNC1cXHUwMUY0XXxbXFx1MDFGQS1cXHUwMUZBXXxbXFx1MDFGQy1cXHUwMUZDXXxbXFx1MDFGRS1cXHUwMUZFXXxbXFx1MDIwMC1cXHUwMjAwXXxbXFx1MDIwMi1cXHUwMjAyXXxbXFx1MDIwNC1cXHUwMjA0XXxbXFx1MDIwNi1cXHUwMjA2XXxbXFx1MDIwOC1cXHUwMjA4XXxbXFx1MDIwQS1cXHUwMjBBXXxbXFx1MDIwQy1cXHUwMjBDXXxbXFx1MDIwRS1cXHUwMjBFXXxbXFx1MDIxMC1cXHUwMjEwXXxbXFx1MDIxMi1cXHUwMjEyXXxbXFx1MDIxNC1cXHUwMjE0XXxbXFx1MDIxNi1cXHUwMjE2XXxbXFx1MDM4Ni1cXHUwMzg2XXxbXFx1MDM4OC1cXHUwMzhBXXxbXFx1MDM4Qy1cXHUwMzhDXXxbXFx1MDM4RS1cXHUwMzhGXXxbXFx1MDM5MS1cXHUwM0ExXXxbXFx1MDNBMy1cXHUwM0FCXXxbXFx1MDNEMi1cXHUwM0Q0XXxbXFx1MDNEQS1cXHUwM0RBXXxbXFx1MDNEQy1cXHUwM0RDXXxbXFx1MDNERS1cXHUwM0RFXXxbXFx1MDNFMC1cXHUwM0UwXXxbXFx1MDNFMi1cXHUwM0UyXXxbXFx1MDNFNC1cXHUwM0U0XXxbXFx1MDNFNi1cXHUwM0U2XXxbXFx1MDNFOC1cXHUwM0U4XXxbXFx1MDNFQS1cXHUwM0VBXXxbXFx1MDNFQy1cXHUwM0VDXXxbXFx1MDNFRS1cXHUwM0VFXXxbXFx1MDQwMS1cXHUwNDBDXXxbXFx1MDQwRS1cXHUwNDJGXXxbXFx1MDQ2MC1cXHUwNDYwXXxbXFx1MDQ2Mi1cXHUwNDYyXXxbXFx1MDQ2NC1cXHUwNDY0XXxbXFx1MDQ2Ni1cXHUwNDY2XXxbXFx1MDQ2OC1cXHUwNDY4XXxbXFx1MDQ2QS1cXHUwNDZBXXxbXFx1MDQ2Qy1cXHUwNDZDXXxbXFx1MDQ2RS1cXHUwNDZFXXxbXFx1MDQ3MC1cXHUwNDcwXXxbXFx1MDQ3Mi1cXHUwNDcyXXxbXFx1MDQ3NC1cXHUwNDc0XXxbXFx1MDQ3Ni1cXHUwNDc2XXxbXFx1MDQ3OC1cXHUwNDc4XXxbXFx1MDQ3QS1cXHUwNDdBXXxbXFx1MDQ3Qy1cXHUwNDdDXXxbXFx1MDQ3RS1cXHUwNDdFXXxbXFx1MDQ4MC1cXHUwNDgwXXxbXFx1MDQ5MC1cXHUwNDkwXXxbXFx1MDQ5Mi1cXHUwNDkyXXxbXFx1MDQ5NC1cXHUwNDk0XXxbXFx1MDQ5Ni1cXHUwNDk2XXxbXFx1MDQ5OC1cXHUwNDk4XXxbXFx1MDQ5QS1cXHUwNDlBXXxbXFx1MDQ5Qy1cXHUwNDlDXXxbXFx1MDQ5RS1cXHUwNDlFXXxbXFx1MDRBMC1cXHUwNEEwXXxbXFx1MDRBMi1cXHUwNEEyXXxbXFx1MDRBNC1cXHUwNEE0XXxbXFx1MDRBNi1cXHUwNEE2XXxbXFx1MDRBOC1cXHUwNEE4XXxbXFx1MDRBQS1cXHUwNEFBXXxbXFx1MDRBQy1cXHUwNEFDXXxbXFx1MDRBRS1cXHUwNEFFXXxbXFx1MDRCMC1cXHUwNEIwXXxbXFx1MDRCMi1cXHUwNEIyXXxbXFx1MDRCNC1cXHUwNEI0XXxbXFx1MDRCNi1cXHUwNEI2XXxbXFx1MDRCOC1cXHUwNEI4XXxbXFx1MDRCQS1cXHUwNEJBXXxbXFx1MDRCQy1cXHUwNEJDXXxbXFx1MDRCRS1cXHUwNEJFXXxbXFx1MDRDMS1cXHUwNEMxXXxbXFx1MDRDMy1cXHUwNEMzXXxbXFx1MDRDNy1cXHUwNEM3XXxbXFx1MDRDQi1cXHUwNENCXXxbXFx1MDREMC1cXHUwNEQwXXxbXFx1MDREMi1cXHUwNEQyXXxbXFx1MDRENC1cXHUwNEQ0XXxbXFx1MDRENi1cXHUwNEQ2XXxbXFx1MDREOC1cXHUwNEQ4XXxbXFx1MDREQS1cXHUwNERBXXxbXFx1MDREQy1cXHUwNERDXXxbXFx1MDRERS1cXHUwNERFXXxbXFx1MDRFMC1cXHUwNEUwXXxbXFx1MDRFMi1cXHUwNEUyXXxbXFx1MDRFNC1cXHUwNEU0XXxbXFx1MDRFNi1cXHUwNEU2XXxbXFx1MDRFOC1cXHUwNEU4XXxbXFx1MDRFQS1cXHUwNEVBXXxbXFx1MDRFRS1cXHUwNEVFXXxbXFx1MDRGMC1cXHUwNEYwXXxbXFx1MDRGMi1cXHUwNEYyXXxbXFx1MDRGNC1cXHUwNEY0XXxbXFx1MDRGOC1cXHUwNEY4XXxbXFx1MDUzMS1cXHUwNTU2XXxbXFx1MTBBMC1cXHUxMEM1XXxbXFx1MUUwMC1cXHUxRTAwXXxbXFx1MUUwMi1cXHUxRTAyXXxbXFx1MUUwNC1cXHUxRTA0XXxbXFx1MUUwNi1cXHUxRTA2XXxbXFx1MUUwOC1cXHUxRTA4XXxbXFx1MUUwQS1cXHUxRTBBXXxbXFx1MUUwQy1cXHUxRTBDXXxbXFx1MUUwRS1cXHUxRTBFXXxbXFx1MUUxMC1cXHUxRTEwXXxbXFx1MUUxMi1cXHUxRTEyXXxbXFx1MUUxNC1cXHUxRTE0XXxbXFx1MUUxNi1cXHUxRTE2XXxbXFx1MUUxOC1cXHUxRTE4XXxbXFx1MUUxQS1cXHUxRTFBXXxbXFx1MUUxQy1cXHUxRTFDXXxbXFx1MUUxRS1cXHUxRTFFXXxbXFx1MUUyMC1cXHUxRTIwXXxbXFx1MUUyMi1cXHUxRTIyXXxbXFx1MUUyNC1cXHUxRTI0XXxbXFx1MUUyNi1cXHUxRTI2XXxbXFx1MUUyOC1cXHUxRTI4XXxbXFx1MUUyQS1cXHUxRTJBXXxbXFx1MUUyQy1cXHUxRTJDXXxbXFx1MUUyRS1cXHUxRTJFXXxbXFx1MUUzMC1cXHUxRTMwXXxbXFx1MUUzMi1cXHUxRTMyXXxbXFx1MUUzNC1cXHUxRTM0XXxbXFx1MUUzNi1cXHUxRTM2XXxbXFx1MUUzOC1cXHUxRTM4XXxbXFx1MUUzQS1cXHUxRTNBXXxbXFx1MUUzQy1cXHUxRTNDXXxbXFx1MUUzRS1cXHUxRTNFXXxbXFx1MUU0MC1cXHUxRTQwXXxbXFx1MUU0Mi1cXHUxRTQyXXxbXFx1MUU0NC1cXHUxRTQ0XXxbXFx1MUU0Ni1cXHUxRTQ2XXxbXFx1MUU0OC1cXHUxRTQ4XXxbXFx1MUU0QS1cXHUxRTRBXXxbXFx1MUU0Qy1cXHUxRTRDXXxbXFx1MUU0RS1cXHUxRTRFXXxbXFx1MUU1MC1cXHUxRTUwXXxbXFx1MUU1Mi1cXHUxRTUyXXxbXFx1MUU1NC1cXHUxRTU0XXxbXFx1MUU1Ni1cXHUxRTU2XXxbXFx1MUU1OC1cXHUxRTU4XXxbXFx1MUU1QS1cXHUxRTVBXXxbXFx1MUU1Qy1cXHUxRTVDXXxbXFx1MUU1RS1cXHUxRTVFXXxbXFx1MUU2MC1cXHUxRTYwXXxbXFx1MUU2Mi1cXHUxRTYyXXxbXFx1MUU2NC1cXHUxRTY0XXxbXFx1MUU2Ni1cXHUxRTY2XXxbXFx1MUU2OC1cXHUxRTY4XXxbXFx1MUU2QS1cXHUxRTZBXXxbXFx1MUU2Qy1cXHUxRTZDXXxbXFx1MUU2RS1cXHUxRTZFXXxbXFx1MUU3MC1cXHUxRTcwXXxbXFx1MUU3Mi1cXHUxRTcyXXxbXFx1MUU3NC1cXHUxRTc0XXxbXFx1MUU3Ni1cXHUxRTc2XXxbXFx1MUU3OC1cXHUxRTc4XXxbXFx1MUU3QS1cXHUxRTdBXXxbXFx1MUU3Qy1cXHUxRTdDXXxbXFx1MUU3RS1cXHUxRTdFXXxbXFx1MUU4MC1cXHUxRTgwXXxbXFx1MUU4Mi1cXHUxRTgyXXxbXFx1MUU4NC1cXHUxRTg0XXxbXFx1MUU4Ni1cXHUxRTg2XXxbXFx1MUU4OC1cXHUxRTg4XXxbXFx1MUU4QS1cXHUxRThBXXxbXFx1MUU4Qy1cXHUxRThDXXxbXFx1MUU4RS1cXHUxRThFXXxbXFx1MUU5MC1cXHUxRTkwXXxbXFx1MUU5Mi1cXHUxRTkyXXxbXFx1MUU5NC1cXHUxRTk0XXxbXFx1MUVBMC1cXHUxRUEwXXxbXFx1MUVBMi1cXHUxRUEyXXxbXFx1MUVBNC1cXHUxRUE0XXxbXFx1MUVBNi1cXHUxRUE2XXxbXFx1MUVBOC1cXHUxRUE4XXxbXFx1MUVBQS1cXHUxRUFBXXxbXFx1MUVBQy1cXHUxRUFDXXxbXFx1MUVBRS1cXHUxRUFFXXxbXFx1MUVCMC1cXHUxRUIwXXxbXFx1MUVCMi1cXHUxRUIyXXxbXFx1MUVCNC1cXHUxRUI0XXxbXFx1MUVCNi1cXHUxRUI2XXxbXFx1MUVCOC1cXHUxRUI4XXxbXFx1MUVCQS1cXHUxRUJBXXxbXFx1MUVCQy1cXHUxRUJDXXxbXFx1MUVCRS1cXHUxRUJFXXxbXFx1MUVDMC1cXHUxRUMwXXxbXFx1MUVDMi1cXHUxRUMyXXxbXFx1MUVDNC1cXHUxRUM0XXxbXFx1MUVDNi1cXHUxRUM2XXxbXFx1MUVDOC1cXHUxRUM4XXxbXFx1MUVDQS1cXHUxRUNBXXxbXFx1MUVDQy1cXHUxRUNDXXxbXFx1MUVDRS1cXHUxRUNFXXxbXFx1MUVEMC1cXHUxRUQwXXxbXFx1MUVEMi1cXHUxRUQyXXxbXFx1MUVENC1cXHUxRUQ0XXxbXFx1MUVENi1cXHUxRUQ2XXxbXFx1MUVEOC1cXHUxRUQ4XXxbXFx1MUVEQS1cXHUxRURBXXxbXFx1MUVEQy1cXHUxRURDXXxbXFx1MUVERS1cXHUxRURFXXxbXFx1MUVFMC1cXHUxRUUwXXxbXFx1MUVFMi1cXHUxRUUyXXxbXFx1MUVFNC1cXHUxRUU0XXxbXFx1MUVFNi1cXHUxRUU2XXxbXFx1MUVFOC1cXHUxRUU4XXxbXFx1MUVFQS1cXHUxRUVBXXxbXFx1MUVFQy1cXHUxRUVDXXxbXFx1MUVFRS1cXHUxRUVFXXxbXFx1MUVGMC1cXHUxRUYwXXxbXFx1MUVGMi1cXHUxRUYyXXxbXFx1MUVGNC1cXHUxRUY0XXxbXFx1MUVGNi1cXHUxRUY2XXxbXFx1MUVGOC1cXHUxRUY4XXxbXFx1MUYwOC1cXHUxRjBGXXxbXFx1MUYxOC1cXHUxRjFEXXxbXFx1MUYyOC1cXHUxRjJGXXxbXFx1MUYzOC1cXHUxRjNGXXxbXFx1MUY0OC1cXHUxRjREXXxbXFx1MUY1OS1cXHUxRjU5XXxbXFx1MUY1Qi1cXHUxRjVCXXxbXFx1MUY1RC1cXHUxRjVEXXxbXFx1MUY1Ri1cXHUxRjVGXXxbXFx1MUY2OC1cXHUxRjZGXXxbXFx1MUY4OC1cXHUxRjhGXXxbXFx1MUY5OC1cXHUxRjlGXXxbXFx1MUZBOC1cXHUxRkFGXXxbXFx1MUZCOC1cXHUxRkJDXXxbXFx1MUZDOC1cXHUxRkNDXXxbXFx1MUZEOC1cXHUxRkRCXXxbXFx1MUZFOC1cXHUxRkVDXXxbXFx1MUZGOC1cXHUxRkZDXXxbXFx1MjEwMi1cXHUyMTAyXXxbXFx1MjEwNy1cXHUyMTA3XXxbXFx1MjEwQi1cXHUyMTBEXXxbXFx1MjExMC1cXHUyMTEyXXxbXFx1MjExNS1cXHUyMTE1XXxbXFx1MjExOS1cXHUyMTFEXXxbXFx1MjEyNC1cXHUyMTI0XXxbXFx1MjEyNi1cXHUyMTI2XXxbXFx1MjEyOC1cXHUyMTI4XXxbXFx1MjEyQS1cXHUyMTJEXXxbXFx1MjEzMC1cXHUyMTMxXXxbXFx1MjEzMy1cXHUyMTMzXXxbXFx1RkYyMS1cXHVGRjNBXXxbXFx1MDA2MS1cXHUwMDdBXXxbXFx1MDBBQS1cXHUwMEFBXXxbXFx1MDBCNS1cXHUwMEI1XXxbXFx1MDBCQS1cXHUwMEJBXXxbXFx1MDBERi1cXHUwMEY2XXxbXFx1MDBGOC1cXHUwMEZGXXxbXFx1MDEwMS1cXHUwMTAxXXxbXFx1MDEwMy1cXHUwMTAzXXxbXFx1MDEwNS1cXHUwMTA1XXxbXFx1MDEwNy1cXHUwMTA3XXxbXFx1MDEwOS1cXHUwMTA5XXxbXFx1MDEwQi1cXHUwMTBCXXxbXFx1MDEwRC1cXHUwMTBEXXxbXFx1MDEwRi1cXHUwMTBGXXxbXFx1MDExMS1cXHUwMTExXXxbXFx1MDExMy1cXHUwMTEzXXxbXFx1MDExNS1cXHUwMTE1XXxbXFx1MDExNy1cXHUwMTE3XXxbXFx1MDExOS1cXHUwMTE5XXxbXFx1MDExQi1cXHUwMTFCXXxbXFx1MDExRC1cXHUwMTFEXXxbXFx1MDExRi1cXHUwMTFGXXxbXFx1MDEyMS1cXHUwMTIxXXxbXFx1MDEyMy1cXHUwMTIzXXxbXFx1MDEyNS1cXHUwMTI1XXxbXFx1MDEyNy1cXHUwMTI3XXxbXFx1MDEyOS1cXHUwMTI5XXxbXFx1MDEyQi1cXHUwMTJCXXxbXFx1MDEyRC1cXHUwMTJEXXxbXFx1MDEyRi1cXHUwMTJGXXxbXFx1MDEzMS1cXHUwMTMxXXxbXFx1MDEzMy1cXHUwMTMzXXxbXFx1MDEzNS1cXHUwMTM1XXxbXFx1MDEzNy1cXHUwMTM4XXxbXFx1MDEzQS1cXHUwMTNBXXxbXFx1MDEzQy1cXHUwMTNDXXxbXFx1MDEzRS1cXHUwMTNFXXxbXFx1MDE0MC1cXHUwMTQwXXxbXFx1MDE0Mi1cXHUwMTQyXXxbXFx1MDE0NC1cXHUwMTQ0XXxbXFx1MDE0Ni1cXHUwMTQ2XXxbXFx1MDE0OC1cXHUwMTQ5XXxbXFx1MDE0Qi1cXHUwMTRCXXxbXFx1MDE0RC1cXHUwMTREXXxbXFx1MDE0Ri1cXHUwMTRGXXxbXFx1MDE1MS1cXHUwMTUxXXxbXFx1MDE1My1cXHUwMTUzXXxbXFx1MDE1NS1cXHUwMTU1XXxbXFx1MDE1Ny1cXHUwMTU3XXxbXFx1MDE1OS1cXHUwMTU5XXxbXFx1MDE1Qi1cXHUwMTVCXXxbXFx1MDE1RC1cXHUwMTVEXXxbXFx1MDE1Ri1cXHUwMTVGXXxbXFx1MDE2MS1cXHUwMTYxXXxbXFx1MDE2My1cXHUwMTYzXXxbXFx1MDE2NS1cXHUwMTY1XXxbXFx1MDE2Ny1cXHUwMTY3XXxbXFx1MDE2OS1cXHUwMTY5XXxbXFx1MDE2Qi1cXHUwMTZCXXxbXFx1MDE2RC1cXHUwMTZEXXxbXFx1MDE2Ri1cXHUwMTZGXXxbXFx1MDE3MS1cXHUwMTcxXXxbXFx1MDE3My1cXHUwMTczXXxbXFx1MDE3NS1cXHUwMTc1XXxbXFx1MDE3Ny1cXHUwMTc3XXxbXFx1MDE3QS1cXHUwMTdBXXxbXFx1MDE3Qy1cXHUwMTdDXXxbXFx1MDE3RS1cXHUwMTgwXXxbXFx1MDE4My1cXHUwMTgzXXxbXFx1MDE4NS1cXHUwMTg1XXxbXFx1MDE4OC1cXHUwMTg4XXxbXFx1MDE4Qy1cXHUwMThEXXxbXFx1MDE5Mi1cXHUwMTkyXXxbXFx1MDE5NS1cXHUwMTk1XXxbXFx1MDE5OS1cXHUwMTlCXXxbXFx1MDE5RS1cXHUwMTlFXXxbXFx1MDFBMS1cXHUwMUExXXxbXFx1MDFBMy1cXHUwMUEzXXxbXFx1MDFBNS1cXHUwMUE1XXxbXFx1MDFBOC1cXHUwMUE4XXxbXFx1MDFBQi1cXHUwMUFCXXxbXFx1MDFBRC1cXHUwMUFEXXxbXFx1MDFCMC1cXHUwMUIwXXxbXFx1MDFCNC1cXHUwMUI0XXxbXFx1MDFCNi1cXHUwMUI2XXxbXFx1MDFCOS1cXHUwMUJBXXxbXFx1MDFCRC1cXHUwMUJEXXxbXFx1MDFDNi1cXHUwMUM2XXxbXFx1MDFDOS1cXHUwMUM5XXxbXFx1MDFDQy1cXHUwMUNDXXxbXFx1MDFDRS1cXHUwMUNFXXxbXFx1MDFEMC1cXHUwMUQwXXxbXFx1MDFEMi1cXHUwMUQyXXxbXFx1MDFENC1cXHUwMUQ0XXxbXFx1MDFENi1cXHUwMUQ2XXxbXFx1MDFEOC1cXHUwMUQ4XXxbXFx1MDFEQS1cXHUwMURBXXxbXFx1MDFEQy1cXHUwMUREXXxbXFx1MDFERi1cXHUwMURGXXxbXFx1MDFFMS1cXHUwMUUxXXxbXFx1MDFFMy1cXHUwMUUzXXxbXFx1MDFFNS1cXHUwMUU1XXxbXFx1MDFFNy1cXHUwMUU3XXxbXFx1MDFFOS1cXHUwMUU5XXxbXFx1MDFFQi1cXHUwMUVCXXxbXFx1MDFFRC1cXHUwMUVEXXxbXFx1MDFFRi1cXHUwMUYwXXxbXFx1MDFGMy1cXHUwMUYzXXxbXFx1MDFGNS1cXHUwMUY1XXxbXFx1MDFGQi1cXHUwMUZCXXxbXFx1MDFGRC1cXHUwMUZEXXxbXFx1MDFGRi1cXHUwMUZGXXxbXFx1MDIwMS1cXHUwMjAxXXxbXFx1MDIwMy1cXHUwMjAzXXxbXFx1MDIwNS1cXHUwMjA1XXxbXFx1MDIwNy1cXHUwMjA3XXxbXFx1MDIwOS1cXHUwMjA5XXxbXFx1MDIwQi1cXHUwMjBCXXxbXFx1MDIwRC1cXHUwMjBEXXxbXFx1MDIwRi1cXHUwMjBGXXxbXFx1MDIxMS1cXHUwMjExXXxbXFx1MDIxMy1cXHUwMjEzXXxbXFx1MDIxNS1cXHUwMjE1XXxbXFx1MDIxNy1cXHUwMjE3XXxbXFx1MDI1MC1cXHUwMkE4XXxbXFx1MDM5MC1cXHUwMzkwXXxbXFx1MDNBQy1cXHUwM0NFXXxbXFx1MDNEMC1cXHUwM0QxXXxbXFx1MDNENS1cXHUwM0Q2XXxbXFx1MDNFMy1cXHUwM0UzXXxbXFx1MDNFNS1cXHUwM0U1XXxbXFx1MDNFNy1cXHUwM0U3XXxbXFx1MDNFOS1cXHUwM0U5XXxbXFx1MDNFQi1cXHUwM0VCXXxbXFx1MDNFRC1cXHUwM0VEXXxbXFx1MDNFRi1cXHUwM0YyXXxbXFx1MDQzMC1cXHUwNDRGXXxbXFx1MDQ1MS1cXHUwNDVDXXxbXFx1MDQ1RS1cXHUwNDVGXXxbXFx1MDQ2MS1cXHUwNDYxXXxbXFx1MDQ2My1cXHUwNDYzXXxbXFx1MDQ2NS1cXHUwNDY1XXxbXFx1MDQ2Ny1cXHUwNDY3XXxbXFx1MDQ2OS1cXHUwNDY5XXxbXFx1MDQ2Qi1cXHUwNDZCXXxbXFx1MDQ2RC1cXHUwNDZEXXxbXFx1MDQ2Ri1cXHUwNDZGXXxbXFx1MDQ3MS1cXHUwNDcxXXxbXFx1MDQ3My1cXHUwNDczXXxbXFx1MDQ3NS1cXHUwNDc1XXxbXFx1MDQ3Ny1cXHUwNDc3XXxbXFx1MDQ3OS1cXHUwNDc5XXxbXFx1MDQ3Qi1cXHUwNDdCXXxbXFx1MDQ3RC1cXHUwNDdEXXxbXFx1MDQ3Ri1cXHUwNDdGXXxbXFx1MDQ4MS1cXHUwNDgxXXxbXFx1MDQ5MS1cXHUwNDkxXXxbXFx1MDQ5My1cXHUwNDkzXXxbXFx1MDQ5NS1cXHUwNDk1XXxbXFx1MDQ5Ny1cXHUwNDk3XXxbXFx1MDQ5OS1cXHUwNDk5XXxbXFx1MDQ5Qi1cXHUwNDlCXXxbXFx1MDQ5RC1cXHUwNDlEXXxbXFx1MDQ5Ri1cXHUwNDlGXXxbXFx1MDRBMS1cXHUwNEExXXxbXFx1MDRBMy1cXHUwNEEzXXxbXFx1MDRBNS1cXHUwNEE1XXxbXFx1MDRBNy1cXHUwNEE3XXxbXFx1MDRBOS1cXHUwNEE5XXxbXFx1MDRBQi1cXHUwNEFCXXxbXFx1MDRBRC1cXHUwNEFEXXxbXFx1MDRBRi1cXHUwNEFGXXxbXFx1MDRCMS1cXHUwNEIxXXxbXFx1MDRCMy1cXHUwNEIzXXxbXFx1MDRCNS1cXHUwNEI1XXxbXFx1MDRCNy1cXHUwNEI3XXxbXFx1MDRCOS1cXHUwNEI5XXxbXFx1MDRCQi1cXHUwNEJCXXxbXFx1MDRCRC1cXHUwNEJEXXxbXFx1MDRCRi1cXHUwNEJGXXxbXFx1MDRDMi1cXHUwNEMyXXxbXFx1MDRDNC1cXHUwNEM0XXxbXFx1MDRDOC1cXHUwNEM4XXxbXFx1MDRDQy1cXHUwNENDXXxbXFx1MDREMS1cXHUwNEQxXXxbXFx1MDREMy1cXHUwNEQzXXxbXFx1MDRENS1cXHUwNEQ1XXxbXFx1MDRENy1cXHUwNEQ3XXxbXFx1MDREOS1cXHUwNEQ5XXxbXFx1MDREQi1cXHUwNERCXXxbXFx1MDRERC1cXHUwNEREXXxbXFx1MDRERi1cXHUwNERGXXxbXFx1MDRFMS1cXHUwNEUxXXxbXFx1MDRFMy1cXHUwNEUzXXxbXFx1MDRFNS1cXHUwNEU1XXxbXFx1MDRFNy1cXHUwNEU3XXxbXFx1MDRFOS1cXHUwNEU5XXxbXFx1MDRFQi1cXHUwNEVCXXxbXFx1MDRFRi1cXHUwNEVGXXxbXFx1MDRGMS1cXHUwNEYxXXxbXFx1MDRGMy1cXHUwNEYzXXxbXFx1MDRGNS1cXHUwNEY1XXxbXFx1MDRGOS1cXHUwNEY5XXxbXFx1MDU2MS1cXHUwNTg3XXxbXFx1MTBEMC1cXHUxMEY2XXxbXFx1MUUwMS1cXHUxRTAxXXxbXFx1MUUwMy1cXHUxRTAzXXxbXFx1MUUwNS1cXHUxRTA1XXxbXFx1MUUwNy1cXHUxRTA3XXxbXFx1MUUwOS1cXHUxRTA5XXxbXFx1MUUwQi1cXHUxRTBCXXxbXFx1MUUwRC1cXHUxRTBEXXxbXFx1MUUwRi1cXHUxRTBGXXxbXFx1MUUxMS1cXHUxRTExXXxbXFx1MUUxMy1cXHUxRTEzXXxbXFx1MUUxNS1cXHUxRTE1XXxbXFx1MUUxNy1cXHUxRTE3XXxbXFx1MUUxOS1cXHUxRTE5XXxbXFx1MUUxQi1cXHUxRTFCXXxbXFx1MUUxRC1cXHUxRTFEXXxbXFx1MUUxRi1cXHUxRTFGXXxbXFx1MUUyMS1cXHUxRTIxXXxbXFx1MUUyMy1cXHUxRTIzXXxbXFx1MUUyNS1cXHUxRTI1XXxbXFx1MUUyNy1cXHUxRTI3XXxbXFx1MUUyOS1cXHUxRTI5XXxbXFx1MUUyQi1cXHUxRTJCXXxbXFx1MUUyRC1cXHUxRTJEXXxbXFx1MUUyRi1cXHUxRTJGXXxbXFx1MUUzMS1cXHUxRTMxXXxbXFx1MUUzMy1cXHUxRTMzXXxbXFx1MUUzNS1cXHUxRTM1XXxbXFx1MUUzNy1cXHUxRTM3XXxbXFx1MUUzOS1cXHUxRTM5XXxbXFx1MUUzQi1cXHUxRTNCXXxbXFx1MUUzRC1cXHUxRTNEXXxbXFx1MUUzRi1cXHUxRTNGXXxbXFx1MUU0MS1cXHUxRTQxXXxbXFx1MUU0My1cXHUxRTQzXXxbXFx1MUU0NS1cXHUxRTQ1XXxbXFx1MUU0Ny1cXHUxRTQ3XXxbXFx1MUU0OS1cXHUxRTQ5XXxbXFx1MUU0Qi1cXHUxRTRCXXxbXFx1MUU0RC1cXHUxRTREXXxbXFx1MUU0Ri1cXHUxRTRGXXxbXFx1MUU1MS1cXHUxRTUxXXxbXFx1MUU1My1cXHUxRTUzXXxbXFx1MUU1NS1cXHUxRTU1XXxbXFx1MUU1Ny1cXHUxRTU3XXxbXFx1MUU1OS1cXHUxRTU5XXxbXFx1MUU1Qi1cXHUxRTVCXXxbXFx1MUU1RC1cXHUxRTVEXXxbXFx1MUU1Ri1cXHUxRTVGXXxbXFx1MUU2MS1cXHUxRTYxXXxbXFx1MUU2My1cXHUxRTYzXXxbXFx1MUU2NS1cXHUxRTY1XXxbXFx1MUU2Ny1cXHUxRTY3XXxbXFx1MUU2OS1cXHUxRTY5XXxbXFx1MUU2Qi1cXHUxRTZCXXxbXFx1MUU2RC1cXHUxRTZEXXxbXFx1MUU2Ri1cXHUxRTZGXXxbXFx1MUU3MS1cXHUxRTcxXXxbXFx1MUU3My1cXHUxRTczXXxbXFx1MUU3NS1cXHUxRTc1XXxbXFx1MUU3Ny1cXHUxRTc3XXxbXFx1MUU3OS1cXHUxRTc5XXxbXFx1MUU3Qi1cXHUxRTdCXXxbXFx1MUU3RC1cXHUxRTdEXXxbXFx1MUU3Ri1cXHUxRTdGXXxbXFx1MUU4MS1cXHUxRTgxXXxbXFx1MUU4My1cXHUxRTgzXXxbXFx1MUU4NS1cXHUxRTg1XXxbXFx1MUU4Ny1cXHUxRTg3XXxbXFx1MUU4OS1cXHUxRTg5XXxbXFx1MUU4Qi1cXHUxRThCXXxbXFx1MUU4RC1cXHUxRThEXXxbXFx1MUU4Ri1cXHUxRThGXXxbXFx1MUU5MS1cXHUxRTkxXXxbXFx1MUU5My1cXHUxRTkzXXxbXFx1MUU5NS1cXHUxRTlCXXxbXFx1MUVBMS1cXHUxRUExXXxbXFx1MUVBMy1cXHUxRUEzXXxbXFx1MUVBNS1cXHUxRUE1XXxbXFx1MUVBNy1cXHUxRUE3XXxbXFx1MUVBOS1cXHUxRUE5XXxbXFx1MUVBQi1cXHUxRUFCXXxbXFx1MUVBRC1cXHUxRUFEXXxbXFx1MUVBRi1cXHUxRUFGXXxbXFx1MUVCMS1cXHUxRUIxXXxbXFx1MUVCMy1cXHUxRUIzXXxbXFx1MUVCNS1cXHUxRUI1XXxbXFx1MUVCNy1cXHUxRUI3XXxbXFx1MUVCOS1cXHUxRUI5XXxbXFx1MUVCQi1cXHUxRUJCXXxbXFx1MUVCRC1cXHUxRUJEXXxbXFx1MUVCRi1cXHUxRUJGXXxbXFx1MUVDMS1cXHUxRUMxXXxbXFx1MUVDMy1cXHUxRUMzXXxbXFx1MUVDNS1cXHUxRUM1XXxbXFx1MUVDNy1cXHUxRUM3XXxbXFx1MUVDOS1cXHUxRUM5XXxbXFx1MUVDQi1cXHUxRUNCXXxbXFx1MUVDRC1cXHUxRUNEXXxbXFx1MUVDRi1cXHUxRUNGXXxbXFx1MUVEMS1cXHUxRUQxXXxbXFx1MUVEMy1cXHUxRUQzXXxbXFx1MUVENS1cXHUxRUQ1XXxbXFx1MUVENy1cXHUxRUQ3XXxbXFx1MUVEOS1cXHUxRUQ5XXxbXFx1MUVEQi1cXHUxRURCXXxbXFx1MUVERC1cXHUxRUREXXxbXFx1MUVERi1cXHUxRURGXXxbXFx1MUVFMS1cXHUxRUUxXXxbXFx1MUVFMy1cXHUxRUUzXXxbXFx1MUVFNS1cXHUxRUU1XXxbXFx1MUVFNy1cXHUxRUU3XXxbXFx1MUVFOS1cXHUxRUU5XXxbXFx1MUVFQi1cXHUxRUVCXXxbXFx1MUVFRC1cXHUxRUVEXXxbXFx1MUVFRi1cXHUxRUVGXXxbXFx1MUVGMS1cXHUxRUYxXXxbXFx1MUVGMy1cXHUxRUYzXXxbXFx1MUVGNS1cXHUxRUY1XXxbXFx1MUVGNy1cXHUxRUY3XXxbXFx1MUVGOS1cXHUxRUY5XXxbXFx1MUYwMC1cXHUxRjA3XXxbXFx1MUYxMC1cXHUxRjE1XXxbXFx1MUYyMC1cXHUxRjI3XXxbXFx1MUYzMC1cXHUxRjM3XXxbXFx1MUY0MC1cXHUxRjQ1XXxbXFx1MUY1MC1cXHUxRjU3XXxbXFx1MUY2MC1cXHUxRjY3XXxbXFx1MUY3MC1cXHUxRjdEXXxbXFx1MUY4MC1cXHUxRjg3XXxbXFx1MUY5MC1cXHUxRjk3XXxbXFx1MUZBMC1cXHUxRkE3XXxbXFx1MUZCMC1cXHUxRkI0XXxbXFx1MUZCNi1cXHUxRkI3XXxbXFx1MUZCRS1cXHUxRkJFXXxbXFx1MUZDMi1cXHUxRkM0XXxbXFx1MUZDNi1cXHUxRkM3XXxbXFx1MUZEMC1cXHUxRkQzXXxbXFx1MUZENi1cXHUxRkQ3XXxbXFx1MUZFMC1cXHUxRkU3XXxbXFx1MUZGMi1cXHUxRkY0XXxbXFx1MUZGNi1cXHUxRkY3XXxbXFx1MjA3Ri1cXHUyMDdGXXxbXFx1MjEwQS1cXHUyMTBBXXxbXFx1MjEwRS1cXHUyMTBGXXxbXFx1MjExMy1cXHUyMTEzXXxbXFx1MjExOC1cXHUyMTE4XXxbXFx1MjEyRS1cXHUyMTJGXXxbXFx1MjEzNC1cXHUyMTM0XXxbXFx1RkIwMC1cXHVGQjA2XXxbXFx1RkIxMy1cXHVGQjE3XXxbXFx1RkY0MS1cXHVGRjVBXXxbXFx1MDFDNS1cXHUwMUM1XXxbXFx1MDFDOC1cXHUwMUM4XXxbXFx1MDFDQi1cXHUwMUNCXXxbXFx1MDFGMi1cXHUwMUYyXXxbXFx1MDJCMC1cXHUwMkI4XXxbXFx1MDJCQi1cXHUwMkMxXXxbXFx1MDJEMC1cXHUwMkQxXXxbXFx1MDJFMC1cXHUwMkU0XXxbXFx1MDM3QS1cXHUwMzdBXXxbXFx1MDU1OS1cXHUwNTU5XXxbXFx1MDY0MC1cXHUwNjQwXXxbXFx1MDZFNS1cXHUwNkU2XXxbXFx1MEU0Ni1cXHUwRTQ2XXxbXFx1MEVDNi1cXHUwRUM2XXxbXFx1MzAwNS1cXHUzMDA1XXxbXFx1MzAzMS1cXHUzMDM1XXxbXFx1MzA5RC1cXHUzMDlFXXxbXFx1MzBGQy1cXHUzMEZFXXxbXFx1RkY3MC1cXHVGRjcwXXxbXFx1RkY5RS1cXHVGRjlGXXxbXFx1MDFBQS1cXHUwMUFBXXxbXFx1MDFCQi1cXHUwMUJCXXxbXFx1MDFCRS1cXHUwMUMzXXxbXFx1MDNGMy1cXHUwM0YzXXxbXFx1MDRDMC1cXHUwNEMwXXxbXFx1MDVEMC1cXHUwNUVBXXxbXFx1MDVGMC1cXHUwNUYyXXxbXFx1MDYyMS1cXHUwNjNBXXxbXFx1MDY0MS1cXHUwNjRBXXxbXFx1MDY3MS1cXHUwNkI3XXxbXFx1MDZCQS1cXHUwNkJFXXxbXFx1MDZDMC1cXHUwNkNFXXxbXFx1MDZEMC1cXHUwNkQzXXxbXFx1MDZENS1cXHUwNkQ1XXxbXFx1MDkwNS1cXHUwOTM5XXxbXFx1MDkzRC1cXHUwOTNEXXxbXFx1MDk1MC1cXHUwOTUwXXxbXFx1MDk1OC1cXHUwOTYxXXxbXFx1MDk4NS1cXHUwOThDXXxbXFx1MDk4Ri1cXHUwOTkwXXxbXFx1MDk5My1cXHUwOUE4XXxbXFx1MDlBQS1cXHUwOUIwXXxbXFx1MDlCMi1cXHUwOUIyXXxbXFx1MDlCNi1cXHUwOUI5XXxbXFx1MDlEQy1cXHUwOUREXXxbXFx1MDlERi1cXHUwOUUxXXxbXFx1MDlGMC1cXHUwOUYxXXxbXFx1MEEwNS1cXHUwQTBBXXxbXFx1MEEwRi1cXHUwQTEwXXxbXFx1MEExMy1cXHUwQTI4XXxbXFx1MEEyQS1cXHUwQTMwXXxbXFx1MEEzMi1cXHUwQTMzXXxbXFx1MEEzNS1cXHUwQTM2XXxbXFx1MEEzOC1cXHUwQTM5XXxbXFx1MEE1OS1cXHUwQTVDXXxbXFx1MEE1RS1cXHUwQTVFXXxbXFx1MEE3Mi1cXHUwQTc0XXxbXFx1MEE4NS1cXHUwQThCXXxbXFx1MEE4RC1cXHUwQThEXXxbXFx1MEE4Ri1cXHUwQTkxXXxbXFx1MEE5My1cXHUwQUE4XXxbXFx1MEFBQS1cXHUwQUIwXXxbXFx1MEFCMi1cXHUwQUIzXXxbXFx1MEFCNS1cXHUwQUI5XXxbXFx1MEFCRC1cXHUwQUJEXXxbXFx1MEFEMC1cXHUwQUQwXXxbXFx1MEFFMC1cXHUwQUUwXXxbXFx1MEIwNS1cXHUwQjBDXXxbXFx1MEIwRi1cXHUwQjEwXXxbXFx1MEIxMy1cXHUwQjI4XXxbXFx1MEIyQS1cXHUwQjMwXXxbXFx1MEIzMi1cXHUwQjMzXXxbXFx1MEIzNi1cXHUwQjM5XXxbXFx1MEIzRC1cXHUwQjNEXXxbXFx1MEI1Qy1cXHUwQjVEXXxbXFx1MEI1Ri1cXHUwQjYxXXxbXFx1MEI4NS1cXHUwQjhBXXxbXFx1MEI4RS1cXHUwQjkwXXxbXFx1MEI5Mi1cXHUwQjk1XXxbXFx1MEI5OS1cXHUwQjlBXXxbXFx1MEI5Qy1cXHUwQjlDXXxbXFx1MEI5RS1cXHUwQjlGXXxbXFx1MEJBMy1cXHUwQkE0XXxbXFx1MEJBOC1cXHUwQkFBXXxbXFx1MEJBRS1cXHUwQkI1XXxbXFx1MEJCNy1cXHUwQkI5XXxbXFx1MEMwNS1cXHUwQzBDXXxbXFx1MEMwRS1cXHUwQzEwXXxbXFx1MEMxMi1cXHUwQzI4XXxbXFx1MEMyQS1cXHUwQzMzXXxbXFx1MEMzNS1cXHUwQzM5XXxbXFx1MEM2MC1cXHUwQzYxXXxbXFx1MEM4NS1cXHUwQzhDXXxbXFx1MEM4RS1cXHUwQzkwXXxbXFx1MEM5Mi1cXHUwQ0E4XXxbXFx1MENBQS1cXHUwQ0IzXXxbXFx1MENCNS1cXHUwQ0I5XXxbXFx1MENERS1cXHUwQ0RFXXxbXFx1MENFMC1cXHUwQ0UxXXxbXFx1MEQwNS1cXHUwRDBDXXxbXFx1MEQwRS1cXHUwRDEwXXxbXFx1MEQxMi1cXHUwRDI4XXxbXFx1MEQyQS1cXHUwRDM5XXxbXFx1MEQ2MC1cXHUwRDYxXXxbXFx1MEUwMS1cXHUwRTMwXXxbXFx1MEUzMi1cXHUwRTMzXXxbXFx1MEU0MC1cXHUwRTQ1XXxbXFx1MEU4MS1cXHUwRTgyXXxbXFx1MEU4NC1cXHUwRTg0XXxbXFx1MEU4Ny1cXHUwRTg4XXxbXFx1MEU4QS1cXHUwRThBXXxbXFx1MEU4RC1cXHUwRThEXXxbXFx1MEU5NC1cXHUwRTk3XXxbXFx1MEU5OS1cXHUwRTlGXXxbXFx1MEVBMS1cXHUwRUEzXXxbXFx1MEVBNS1cXHUwRUE1XXxbXFx1MEVBNy1cXHUwRUE3XXxbXFx1MEVBQS1cXHUwRUFCXXxbXFx1MEVBRC1cXHUwRUIwXXxbXFx1MEVCMi1cXHUwRUIzXXxbXFx1MEVCRC1cXHUwRUJEXXxbXFx1MEVDMC1cXHUwRUM0XXxbXFx1MEVEQy1cXHUwRUREXXxbXFx1MEYwMC1cXHUwRjAwXXxbXFx1MEY0MC1cXHUwRjQ3XXxbXFx1MEY0OS1cXHUwRjY5XXxbXFx1MEY4OC1cXHUwRjhCXXxbXFx1MTEwMC1cXHUxMTU5XXxbXFx1MTE1Ri1cXHUxMUEyXXxbXFx1MTFBOC1cXHUxMUY5XXxbXFx1MjEzNS1cXHUyMTM4XXxbXFx1MzAwNi1cXHUzMDA2XXxbXFx1MzA0MS1cXHUzMDk0XXxbXFx1MzBBMS1cXHUzMEZBXXxbXFx1MzEwNS1cXHUzMTJDXXxbXFx1MzEzMS1cXHUzMThFXXxbXFx1NEUwMC1cXHU5RkE1XXxbXFx1QUMwMC1cXHVEN0EzXXxbXFx1RjkwMC1cXHVGQTJEXXxbXFx1RkIxRi1cXHVGQjI4XXxbXFx1RkIyQS1cXHVGQjM2XXxbXFx1RkIzOC1cXHVGQjNDXXxbXFx1RkIzRS1cXHVGQjNFXXxbXFx1RkI0MC1cXHVGQjQxXXxbXFx1RkI0My1cXHVGQjQ0XXxbXFx1RkI0Ni1cXHVGQkIxXXxbXFx1RkJEMy1cXHVGRDNEXXxbXFx1RkQ1MC1cXHVGRDhGXXxbXFx1RkQ5Mi1cXHVGREM3XXxbXFx1RkRGMC1cXHVGREZCXXxbXFx1RkU3MC1cXHVGRTcyXXxbXFx1RkU3NC1cXHVGRTc0XXxbXFx1RkU3Ni1cXHVGRUZDXXxbXFx1RkY2Ni1cXHVGRjZGXXxbXFx1RkY3MS1cXHVGRjlEXXxbXFx1RkZBMC1cXHVGRkJFXXxbXFx1RkZDMi1cXHVGRkM3XXxbXFx1RkZDQS1cXHVGRkNGXXxbXFx1RkZEMi1cXHVGRkQ3XXxbXFx1RkZEQS1cXHVGRkRDXS8sXG4gIEx0bW86IC9bXFx1MDFDNS1cXHUwMUM1XXxbXFx1MDFDOC1cXHUwMUM4XXxbXFx1MDFDQi1cXHUwMUNCXXxbXFx1MDFGMi1cXHUwMUYyXVtcXHUwMkIwLVxcdTAyQjhdfFtcXHUwMkJCLVxcdTAyQzFdfFtcXHUwMkQwLVxcdTAyRDFdfFtcXHUwMkUwLVxcdTAyRTRdfFtcXHUwMzdBLVxcdTAzN0FdfFtcXHUwNTU5LVxcdTA1NTldfFtcXHUwNjQwLVxcdTA2NDBdfFtcXHUwNkU1LVxcdTA2RTZdfFtcXHUwRTQ2LVxcdTBFNDZdfFtcXHUwRUM2LVxcdTBFQzZdfFtcXHUzMDA1LVxcdTMwMDVdfFtcXHUzMDMxLVxcdTMwMzVdfFtcXHUzMDlELVxcdTMwOUVdfFtcXHUzMEZDLVxcdTMwRkVdfFtcXHVGRjcwLVxcdUZGNzBdfFtcXHVGRjlFLVxcdUZGOUZdW1xcdTAxQUEtXFx1MDFBQV18W1xcdTAxQkItXFx1MDFCQl18W1xcdTAxQkUtXFx1MDFDM118W1xcdTAzRjMtXFx1MDNGM118W1xcdTA0QzAtXFx1MDRDMF18W1xcdTA1RDAtXFx1MDVFQV18W1xcdTA1RjAtXFx1MDVGMl18W1xcdTA2MjEtXFx1MDYzQV18W1xcdTA2NDEtXFx1MDY0QV18W1xcdTA2NzEtXFx1MDZCN118W1xcdTA2QkEtXFx1MDZCRV18W1xcdTA2QzAtXFx1MDZDRV18W1xcdTA2RDAtXFx1MDZEM118W1xcdTA2RDUtXFx1MDZENV18W1xcdTA5MDUtXFx1MDkzOV18W1xcdTA5M0QtXFx1MDkzRF18W1xcdTA5NTAtXFx1MDk1MF18W1xcdTA5NTgtXFx1MDk2MV18W1xcdTA5ODUtXFx1MDk4Q118W1xcdTA5OEYtXFx1MDk5MF18W1xcdTA5OTMtXFx1MDlBOF18W1xcdTA5QUEtXFx1MDlCMF18W1xcdTA5QjItXFx1MDlCMl18W1xcdTA5QjYtXFx1MDlCOV18W1xcdTA5REMtXFx1MDlERF18W1xcdTA5REYtXFx1MDlFMV18W1xcdTA5RjAtXFx1MDlGMV18W1xcdTBBMDUtXFx1MEEwQV18W1xcdTBBMEYtXFx1MEExMF18W1xcdTBBMTMtXFx1MEEyOF18W1xcdTBBMkEtXFx1MEEzMF18W1xcdTBBMzItXFx1MEEzM118W1xcdTBBMzUtXFx1MEEzNl18W1xcdTBBMzgtXFx1MEEzOV18W1xcdTBBNTktXFx1MEE1Q118W1xcdTBBNUUtXFx1MEE1RV18W1xcdTBBNzItXFx1MEE3NF18W1xcdTBBODUtXFx1MEE4Ql18W1xcdTBBOEQtXFx1MEE4RF18W1xcdTBBOEYtXFx1MEE5MV18W1xcdTBBOTMtXFx1MEFBOF18W1xcdTBBQUEtXFx1MEFCMF18W1xcdTBBQjItXFx1MEFCM118W1xcdTBBQjUtXFx1MEFCOV18W1xcdTBBQkQtXFx1MEFCRF18W1xcdTBBRDAtXFx1MEFEMF18W1xcdTBBRTAtXFx1MEFFMF18W1xcdTBCMDUtXFx1MEIwQ118W1xcdTBCMEYtXFx1MEIxMF18W1xcdTBCMTMtXFx1MEIyOF18W1xcdTBCMkEtXFx1MEIzMF18W1xcdTBCMzItXFx1MEIzM118W1xcdTBCMzYtXFx1MEIzOV18W1xcdTBCM0QtXFx1MEIzRF18W1xcdTBCNUMtXFx1MEI1RF18W1xcdTBCNUYtXFx1MEI2MV18W1xcdTBCODUtXFx1MEI4QV18W1xcdTBCOEUtXFx1MEI5MF18W1xcdTBCOTItXFx1MEI5NV18W1xcdTBCOTktXFx1MEI5QV18W1xcdTBCOUMtXFx1MEI5Q118W1xcdTBCOUUtXFx1MEI5Rl18W1xcdTBCQTMtXFx1MEJBNF18W1xcdTBCQTgtXFx1MEJBQV18W1xcdTBCQUUtXFx1MEJCNV18W1xcdTBCQjctXFx1MEJCOV18W1xcdTBDMDUtXFx1MEMwQ118W1xcdTBDMEUtXFx1MEMxMF18W1xcdTBDMTItXFx1MEMyOF18W1xcdTBDMkEtXFx1MEMzM118W1xcdTBDMzUtXFx1MEMzOV18W1xcdTBDNjAtXFx1MEM2MV18W1xcdTBDODUtXFx1MEM4Q118W1xcdTBDOEUtXFx1MEM5MF18W1xcdTBDOTItXFx1MENBOF18W1xcdTBDQUEtXFx1MENCM118W1xcdTBDQjUtXFx1MENCOV18W1xcdTBDREUtXFx1MENERV18W1xcdTBDRTAtXFx1MENFMV18W1xcdTBEMDUtXFx1MEQwQ118W1xcdTBEMEUtXFx1MEQxMF18W1xcdTBEMTItXFx1MEQyOF18W1xcdTBEMkEtXFx1MEQzOV18W1xcdTBENjAtXFx1MEQ2MV18W1xcdTBFMDEtXFx1MEUzMF18W1xcdTBFMzItXFx1MEUzM118W1xcdTBFNDAtXFx1MEU0NV18W1xcdTBFODEtXFx1MEU4Ml18W1xcdTBFODQtXFx1MEU4NF18W1xcdTBFODctXFx1MEU4OF18W1xcdTBFOEEtXFx1MEU4QV18W1xcdTBFOEQtXFx1MEU4RF18W1xcdTBFOTQtXFx1MEU5N118W1xcdTBFOTktXFx1MEU5Rl18W1xcdTBFQTEtXFx1MEVBM118W1xcdTBFQTUtXFx1MEVBNV18W1xcdTBFQTctXFx1MEVBN118W1xcdTBFQUEtXFx1MEVBQl18W1xcdTBFQUQtXFx1MEVCMF18W1xcdTBFQjItXFx1MEVCM118W1xcdTBFQkQtXFx1MEVCRF18W1xcdTBFQzAtXFx1MEVDNF18W1xcdTBFREMtXFx1MEVERF18W1xcdTBGMDAtXFx1MEYwMF18W1xcdTBGNDAtXFx1MEY0N118W1xcdTBGNDktXFx1MEY2OV18W1xcdTBGODgtXFx1MEY4Ql18W1xcdTExMDAtXFx1MTE1OV18W1xcdTExNUYtXFx1MTFBMl18W1xcdTExQTgtXFx1MTFGOV18W1xcdTIxMzUtXFx1MjEzOF18W1xcdTMwMDYtXFx1MzAwNl18W1xcdTMwNDEtXFx1MzA5NF18W1xcdTMwQTEtXFx1MzBGQV18W1xcdTMxMDUtXFx1MzEyQ118W1xcdTMxMzEtXFx1MzE4RV18W1xcdTRFMDAtXFx1OUZBNV18W1xcdUFDMDAtXFx1RDdBM118W1xcdUY5MDAtXFx1RkEyRF18W1xcdUZCMUYtXFx1RkIyOF18W1xcdUZCMkEtXFx1RkIzNl18W1xcdUZCMzgtXFx1RkIzQ118W1xcdUZCM0UtXFx1RkIzRV18W1xcdUZCNDAtXFx1RkI0MV18W1xcdUZCNDMtXFx1RkI0NF18W1xcdUZCNDYtXFx1RkJCMV18W1xcdUZCRDMtXFx1RkQzRF18W1xcdUZENTAtXFx1RkQ4Rl18W1xcdUZEOTItXFx1RkRDN118W1xcdUZERjAtXFx1RkRGQl18W1xcdUZFNzAtXFx1RkU3Ml18W1xcdUZFNzQtXFx1RkU3NF18W1xcdUZFNzYtXFx1RkVGQ118W1xcdUZGNjYtXFx1RkY2Rl18W1xcdUZGNzEtXFx1RkY5RF18W1xcdUZGQTAtXFx1RkZCRV18W1xcdUZGQzItXFx1RkZDN118W1xcdUZGQ0EtXFx1RkZDRl18W1xcdUZGRDItXFx1RkZEN118W1xcdUZGREEtXFx1RkZEQ10vXG59O1xuIl19
