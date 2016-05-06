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
    .withSource("Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  \"|\"? Alt  -- define\n    | ident Formals?            \":=\" \"|\"? Alt  -- override\n    | ident Formals?            \"+=\" \"|\"? Alt  -- extend\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = Term (\"|\" Term)*\n\n  Term\n    = Seq caseName -- inline\n    | Seq\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | terminal \"..\" terminal                         -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}")
    .withDefaultStartRule("Grammars")
  return decl
    .define("Grammars", [], this.star(this.app("Grammar").withInterval(decl.sourceInterval(24, 31))).withInterval(decl.sourceInterval(24, 32)))
    .define("Grammar", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(50, 55)), this.opt(this.app("SuperGrammar").withInterval(decl.sourceInterval(56, 68))).withInterval(decl.sourceInterval(56, 69)), this.terminal("{").withInterval(decl.sourceInterval(70, 73)), this.star(this.app("Rule").withInterval(decl.sourceInterval(74, 78))).withInterval(decl.sourceInterval(74, 79)), this.terminal("}").withInterval(decl.sourceInterval(80, 83))).withInterval(decl.sourceInterval(50, 83)))
    .define("SuperGrammar", [], this.seq(this.terminal("<:").withInterval(decl.sourceInterval(106, 110)), this.app("ident").withInterval(decl.sourceInterval(111, 116))).withInterval(decl.sourceInterval(106, 116)))
    .define("Rule_define", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(131, 136)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(137, 144))).withInterval(decl.sourceInterval(137, 145)), this.opt(this.app("ruleDescr").withInterval(decl.sourceInterval(146, 155))).withInterval(decl.sourceInterval(146, 156)), this.terminal("=").withInterval(decl.sourceInterval(157, 160)), this.opt(this.terminal("|").withInterval(decl.sourceInterval(162, 165))).withInterval(decl.sourceInterval(162, 166)), this.app("Alt").withInterval(decl.sourceInterval(167, 170))).withInterval(decl.sourceInterval(131, 170)))
    .define("Rule_override", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(188, 193)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(194, 201))).withInterval(decl.sourceInterval(194, 202)), this.terminal(":=").withInterval(decl.sourceInterval(214, 218)), this.opt(this.terminal("|").withInterval(decl.sourceInterval(219, 222))).withInterval(decl.sourceInterval(219, 223)), this.app("Alt").withInterval(decl.sourceInterval(224, 227))).withInterval(decl.sourceInterval(188, 227)))
    .define("Rule_extend", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(247, 252)), this.opt(this.app("Formals").withInterval(decl.sourceInterval(253, 260))).withInterval(decl.sourceInterval(253, 261)), this.terminal("+=").withInterval(decl.sourceInterval(273, 277)), this.opt(this.terminal("|").withInterval(decl.sourceInterval(278, 281))).withInterval(decl.sourceInterval(278, 282)), this.app("Alt").withInterval(decl.sourceInterval(283, 286))).withInterval(decl.sourceInterval(247, 286)))
    .define("Rule", [], this.alt(this.app("Rule_define").withInterval(decl.sourceInterval(131, 170)), this.app("Rule_override").withInterval(decl.sourceInterval(188, 227)), this.app("Rule_extend").withInterval(decl.sourceInterval(247, 286))).withInterval(decl.sourceInterval(131, 297)))
    .define("Formals", [], this.seq(this.terminal("<").withInterval(decl.sourceInterval(315, 318)), this.app("ListOf", [this.app("ident").withInterval(decl.sourceInterval(326, 331)), this.terminal(",").withInterval(decl.sourceInterval(333, 336))]).withInterval(decl.sourceInterval(319, 337)), this.terminal(">").withInterval(decl.sourceInterval(338, 341))).withInterval(decl.sourceInterval(315, 341)))
    .define("Params", [], this.seq(this.terminal("<").withInterval(decl.sourceInterval(358, 361)), this.app("ListOf", [this.app("Seq").withInterval(decl.sourceInterval(369, 372)), this.terminal(",").withInterval(decl.sourceInterval(374, 377))]).withInterval(decl.sourceInterval(362, 378)), this.terminal(">").withInterval(decl.sourceInterval(379, 382))).withInterval(decl.sourceInterval(358, 382)))
    .define("Alt", [], this.seq(this.app("Term").withInterval(decl.sourceInterval(396, 400)), this.star(this.seq(this.terminal("|").withInterval(decl.sourceInterval(402, 405)), this.app("Term").withInterval(decl.sourceInterval(406, 410))).withInterval(decl.sourceInterval(402, 410))).withInterval(decl.sourceInterval(401, 412))).withInterval(decl.sourceInterval(396, 412)))
    .define("Term_inline", [], this.seq(this.app("Seq").withInterval(decl.sourceInterval(427, 430)), this.app("caseName").withInterval(decl.sourceInterval(431, 439))).withInterval(decl.sourceInterval(427, 439)))
    .define("Term", [], this.alt(this.app("Term_inline").withInterval(decl.sourceInterval(427, 439)), this.app("Seq").withInterval(decl.sourceInterval(456, 459))).withInterval(decl.sourceInterval(427, 459)))
    .define("Seq", [], this.star(this.app("Iter").withInterval(decl.sourceInterval(473, 477))).withInterval(decl.sourceInterval(473, 478)))
    .define("Iter_star", [], this.seq(this.app("Pred").withInterval(decl.sourceInterval(493, 497)), this.terminal("*").withInterval(decl.sourceInterval(498, 501))).withInterval(decl.sourceInterval(493, 501)))
    .define("Iter_plus", [], this.seq(this.app("Pred").withInterval(decl.sourceInterval(517, 521)), this.terminal("+").withInterval(decl.sourceInterval(522, 525))).withInterval(decl.sourceInterval(517, 525)))
    .define("Iter_opt", [], this.seq(this.app("Pred").withInterval(decl.sourceInterval(541, 545)), this.terminal("?").withInterval(decl.sourceInterval(546, 549))).withInterval(decl.sourceInterval(541, 549)))
    .define("Iter", [], this.alt(this.app("Iter_star").withInterval(decl.sourceInterval(493, 501)), this.app("Iter_plus").withInterval(decl.sourceInterval(517, 525)), this.app("Iter_opt").withInterval(decl.sourceInterval(541, 549)), this.app("Pred").withInterval(decl.sourceInterval(564, 568))).withInterval(decl.sourceInterval(493, 568)))
    .define("Pred_not", [], this.seq(this.terminal("~").withInterval(decl.sourceInterval(583, 586)), this.app("Lex").withInterval(decl.sourceInterval(587, 590))).withInterval(decl.sourceInterval(583, 590)))
    .define("Pred_lookahead", [], this.seq(this.terminal("&").withInterval(decl.sourceInterval(605, 608)), this.app("Lex").withInterval(decl.sourceInterval(609, 612))).withInterval(decl.sourceInterval(605, 612)))
    .define("Pred", [], this.alt(this.app("Pred_not").withInterval(decl.sourceInterval(583, 590)), this.app("Pred_lookahead").withInterval(decl.sourceInterval(605, 612)), this.app("Lex").withInterval(decl.sourceInterval(633, 636))).withInterval(decl.sourceInterval(583, 636)))
    .define("Lex_lex", [], this.seq(this.terminal("#").withInterval(decl.sourceInterval(650, 653)), this.app("Base").withInterval(decl.sourceInterval(654, 658))).withInterval(decl.sourceInterval(650, 658)))
    .define("Lex", [], this.alt(this.app("Lex_lex").withInterval(decl.sourceInterval(650, 658)), this.app("Base").withInterval(decl.sourceInterval(673, 677))).withInterval(decl.sourceInterval(650, 677)))
    .define("Base_application", [], this.seq(this.app("ident").withInterval(decl.sourceInterval(692, 697)), this.opt(this.app("Params").withInterval(decl.sourceInterval(698, 704))).withInterval(decl.sourceInterval(698, 705)), this.not(this.alt(this.seq(this.opt(this.app("ruleDescr").withInterval(decl.sourceInterval(708, 717))).withInterval(decl.sourceInterval(708, 718)), this.terminal("=").withInterval(decl.sourceInterval(719, 722))).withInterval(decl.sourceInterval(708, 722)), this.terminal(":=").withInterval(decl.sourceInterval(725, 729)), this.terminal("+=").withInterval(decl.sourceInterval(732, 736))).withInterval(decl.sourceInterval(708, 736))).withInterval(decl.sourceInterval(706, 737))).withInterval(decl.sourceInterval(692, 737)))
    .define("Base_range", [], this.seq(this.app("terminal").withInterval(decl.sourceInterval(760, 768)), this.terminal("..").withInterval(decl.sourceInterval(769, 773)), this.app("terminal").withInterval(decl.sourceInterval(774, 782))).withInterval(decl.sourceInterval(760, 782)))
    .define("Base_terminal", [], this.app("terminal").withInterval(decl.sourceInterval(822, 830)))
    .define("Base_paren", [], this.seq(this.terminal("(").withInterval(decl.sourceInterval(887, 890)), this.app("Alt").withInterval(decl.sourceInterval(891, 894)), this.terminal(")").withInterval(decl.sourceInterval(895, 898))).withInterval(decl.sourceInterval(887, 898)))
    .define("Base", [], this.alt(this.app("Base_application").withInterval(decl.sourceInterval(692, 737)), this.app("Base_range").withInterval(decl.sourceInterval(760, 782)), this.app("Base_terminal").withInterval(decl.sourceInterval(822, 830)), this.app("Base_paren").withInterval(decl.sourceInterval(887, 898))).withInterval(decl.sourceInterval(692, 942)))
    .define("ruleDescr", [], this.seq(this.terminal("(").withInterval(decl.sourceInterval(984, 987)), this.app("ruleDescrText").withInterval(decl.sourceInterval(988, 1001)), this.terminal(")").withInterval(decl.sourceInterval(1002, 1005))).withInterval(decl.sourceInterval(984, 1005)), "a rule description")
    .define("ruleDescrText", [], this.star(this.seq(this.not(this.terminal(")").withInterval(decl.sourceInterval(1031, 1034))).withInterval(decl.sourceInterval(1030, 1034)), this.app("any").withInterval(decl.sourceInterval(1035, 1038))).withInterval(decl.sourceInterval(1030, 1038))).withInterval(decl.sourceInterval(1029, 1040)))
    .define("caseName", [], this.seq(this.terminal("--").withInterval(decl.sourceInterval(1059, 1063)), this.star(this.seq(this.not(this.terminal("\n").withInterval(decl.sourceInterval(1066, 1070))).withInterval(decl.sourceInterval(1065, 1070)), this.app("space").withInterval(decl.sourceInterval(1071, 1076))).withInterval(decl.sourceInterval(1065, 1076))).withInterval(decl.sourceInterval(1064, 1078)), this.app("name").withInterval(decl.sourceInterval(1079, 1083)), this.star(this.seq(this.not(this.terminal("\n").withInterval(decl.sourceInterval(1086, 1090))).withInterval(decl.sourceInterval(1085, 1090)), this.app("space").withInterval(decl.sourceInterval(1091, 1096))).withInterval(decl.sourceInterval(1085, 1096))).withInterval(decl.sourceInterval(1084, 1098)), this.alt(this.terminal("\n").withInterval(decl.sourceInterval(1100, 1104)), this.la(this.terminal("}").withInterval(decl.sourceInterval(1108, 1111))).withInterval(decl.sourceInterval(1107, 1111))).withInterval(decl.sourceInterval(1100, 1111))).withInterval(decl.sourceInterval(1059, 1112)))
    .define("name", [], this.seq(this.app("nameFirst").withInterval(decl.sourceInterval(1137, 1146)), this.star(this.app("nameRest").withInterval(decl.sourceInterval(1147, 1155))).withInterval(decl.sourceInterval(1147, 1156))).withInterval(decl.sourceInterval(1137, 1156)), "a name")
    .define("nameFirst", [], this.alt(this.terminal("_").withInterval(decl.sourceInterval(1176, 1179)), this.app("letter").withInterval(decl.sourceInterval(1186, 1192))).withInterval(decl.sourceInterval(1176, 1192)))
    .define("nameRest", [], this.alt(this.terminal("_").withInterval(decl.sourceInterval(1211, 1214)), this.app("alnum").withInterval(decl.sourceInterval(1221, 1226))).withInterval(decl.sourceInterval(1211, 1226)))
    .define("ident", [], this.app("name").withInterval(decl.sourceInterval(1259, 1263)), "an identifier")
    .define("terminal", [], this.seq(this.terminal("\"").withInterval(decl.sourceInterval(1282, 1286)), this.star(this.app("terminalChar").withInterval(decl.sourceInterval(1287, 1299))).withInterval(decl.sourceInterval(1287, 1300)), this.terminal("\"").withInterval(decl.sourceInterval(1301, 1305))).withInterval(decl.sourceInterval(1282, 1305)))
    .define("terminalChar", [], this.alt(this.app("escapeChar").withInterval(decl.sourceInterval(1328, 1338)), this.seq(this.not(this.terminal("\\").withInterval(decl.sourceInterval(1346, 1350))).withInterval(decl.sourceInterval(1345, 1350)), this.not(this.terminal("\"").withInterval(decl.sourceInterval(1352, 1356))).withInterval(decl.sourceInterval(1351, 1356)), this.not(this.terminal("\n").withInterval(decl.sourceInterval(1358, 1362))).withInterval(decl.sourceInterval(1357, 1362)), this.app("any").withInterval(decl.sourceInterval(1363, 1366))).withInterval(decl.sourceInterval(1345, 1366))).withInterval(decl.sourceInterval(1328, 1366)))
    .define("escapeChar_backslash", [], this.terminal("\\\\").withInterval(decl.sourceInterval(1409, 1415)))
    .define("escapeChar_doubleQuote", [], this.terminal("\\\"").withInterval(decl.sourceInterval(1471, 1477)))
    .define("escapeChar_singleQuote", [], this.terminal("\\'").withInterval(decl.sourceInterval(1535, 1541)))
    .define("escapeChar_backspace", [], this.terminal("\\b").withInterval(decl.sourceInterval(1599, 1604)))
    .define("escapeChar_lineFeed", [], this.terminal("\\n").withInterval(decl.sourceInterval(1661, 1666)))
    .define("escapeChar_carriageReturn", [], this.terminal("\\r").withInterval(decl.sourceInterval(1722, 1727)))
    .define("escapeChar_tab", [], this.terminal("\\t").withInterval(decl.sourceInterval(1789, 1794)))
    .define("escapeChar_unicodeEscape", [], this.seq(this.terminal("\\u").withInterval(decl.sourceInterval(1845, 1850)), this.app("hexDigit").withInterval(decl.sourceInterval(1851, 1859)), this.app("hexDigit").withInterval(decl.sourceInterval(1860, 1868)), this.app("hexDigit").withInterval(decl.sourceInterval(1869, 1877)), this.app("hexDigit").withInterval(decl.sourceInterval(1878, 1886))).withInterval(decl.sourceInterval(1845, 1886)))
    .define("escapeChar_hexEscape", [], this.seq(this.terminal("\\x").withInterval(decl.sourceInterval(1911, 1916)), this.app("hexDigit").withInterval(decl.sourceInterval(1917, 1925)), this.app("hexDigit").withInterval(decl.sourceInterval(1926, 1934))).withInterval(decl.sourceInterval(1911, 1934)))
    .define("escapeChar", [], this.alt(this.app("escapeChar_backslash").withInterval(decl.sourceInterval(1409, 1415)), this.app("escapeChar_doubleQuote").withInterval(decl.sourceInterval(1471, 1477)), this.app("escapeChar_singleQuote").withInterval(decl.sourceInterval(1535, 1541)), this.app("escapeChar_backspace").withInterval(decl.sourceInterval(1599, 1604)), this.app("escapeChar_lineFeed").withInterval(decl.sourceInterval(1661, 1666)), this.app("escapeChar_carriageReturn").withInterval(decl.sourceInterval(1722, 1727)), this.app("escapeChar_tab").withInterval(decl.sourceInterval(1789, 1794)), this.app("escapeChar_unicodeEscape").withInterval(decl.sourceInterval(1845, 1886)), this.app("escapeChar_hexEscape").withInterval(decl.sourceInterval(1911, 1934))).withInterval(decl.sourceInterval(1409, 1966)), "an escape sequence")
    .extend("space", [], this.app("comment").withInterval(decl.sourceInterval(1982, 1989)))
    .define("comment_singleLine", [], this.seq(this.terminal("//").withInterval(decl.sourceInterval(2007, 2011)), this.star(this.seq(this.not(this.terminal("\n").withInterval(decl.sourceInterval(2014, 2018))).withInterval(decl.sourceInterval(2013, 2018)), this.app("any").withInterval(decl.sourceInterval(2019, 2022))).withInterval(decl.sourceInterval(2013, 2022))).withInterval(decl.sourceInterval(2012, 2024)), this.terminal("\n").withInterval(decl.sourceInterval(2025, 2029))).withInterval(decl.sourceInterval(2007, 2029)))
    .define("comment_multiLine", [], this.seq(this.terminal("/*").withInterval(decl.sourceInterval(2051, 2055)), this.star(this.seq(this.not(this.terminal("*/").withInterval(decl.sourceInterval(2058, 2062))).withInterval(decl.sourceInterval(2057, 2062)), this.app("any").withInterval(decl.sourceInterval(2063, 2066))).withInterval(decl.sourceInterval(2057, 2066))).withInterval(decl.sourceInterval(2056, 2068)), this.terminal("*/").withInterval(decl.sourceInterval(2069, 2073))).withInterval(decl.sourceInterval(2051, 2073)))
    .define("comment", [], this.alt(this.app("comment_singleLine").withInterval(decl.sourceInterval(2007, 2029)), this.app("comment_multiLine").withInterval(decl.sourceInterval(2051, 2073))).withInterval(decl.sourceInterval(2007, 2087)))
    .define("tokens", [], this.star(this.app("token").withInterval(decl.sourceInterval(2100, 2105))).withInterval(decl.sourceInterval(2100, 2106)))
    .define("token", [], this.alt(this.app("caseName").withInterval(decl.sourceInterval(2118, 2126)), this.app("comment").withInterval(decl.sourceInterval(2129, 2136)), this.app("ident").withInterval(decl.sourceInterval(2139, 2144)), this.app("operator").withInterval(decl.sourceInterval(2147, 2155)), this.app("punctuation").withInterval(decl.sourceInterval(2158, 2169)), this.app("terminal").withInterval(decl.sourceInterval(2172, 2180)), this.app("any").withInterval(decl.sourceInterval(2183, 2186))).withInterval(decl.sourceInterval(2118, 2186)))
    .define("operator", [], this.alt(this.terminal("<:").withInterval(decl.sourceInterval(2201, 2205)), this.terminal("=").withInterval(decl.sourceInterval(2208, 2211)), this.terminal(":=").withInterval(decl.sourceInterval(2214, 2218)), this.terminal("+=").withInterval(decl.sourceInterval(2221, 2225)), this.terminal("*").withInterval(decl.sourceInterval(2228, 2231)), this.terminal("+").withInterval(decl.sourceInterval(2234, 2237)), this.terminal("?").withInterval(decl.sourceInterval(2240, 2243)), this.terminal("~").withInterval(decl.sourceInterval(2246, 2249)), this.terminal("&").withInterval(decl.sourceInterval(2252, 2255))).withInterval(decl.sourceInterval(2201, 2255)))
    .define("punctuation", [], this.alt(this.terminal("<").withInterval(decl.sourceInterval(2273, 2276)), this.terminal(">").withInterval(decl.sourceInterval(2279, 2282)), this.terminal(",").withInterval(decl.sourceInterval(2285, 2288)), this.terminal("--").withInterval(decl.sourceInterval(2291, 2295))).withInterval(decl.sourceInterval(2273, 2295)))
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
    .define("Formals", [], this.seq(this.terminal("(").withInterval(decl.sourceInterval(118, 121)), this.app("ListOf", [this.app("name").withInterval(decl.sourceInterval(129, 133)), this.terminal(",").withInterval(decl.sourceInterval(135, 138))]).withInterval(decl.sourceInterval(122, 139)), this.terminal(")").withInterval(decl.sourceInterval(140, 143))).withInterval(decl.sourceInterval(118, 143)))
    .define("name", [], this.seq(this.app("nameFirst").withInterval(decl.sourceInterval(168, 177)), this.star(this.app("nameRest").withInterval(decl.sourceInterval(178, 186))).withInterval(decl.sourceInterval(178, 187))).withInterval(decl.sourceInterval(168, 187)), "a name")
    .define("nameFirst", [], this.alt(this.terminal("_").withInterval(decl.sourceInterval(207, 210)), this.app("letter").withInterval(decl.sourceInterval(217, 223))).withInterval(decl.sourceInterval(207, 223)))
    .define("nameRest", [], this.alt(this.terminal("_").withInterval(decl.sourceInterval(242, 245)), this.app("alnum").withInterval(decl.sourceInterval(252, 257))).withInterval(decl.sourceInterval(242, 257)))
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

},{"../src/Grammar":29,"../src/MatchResult":33,"../src/pexprs":58,"util-extend":26}],6:[function(require,module,exports){
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

  terminal: function(x) {
    return new pexprs.Terminal(x);
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

  app: function(ruleName, optParams) {
    return new pexprs.Apply(ruleName, optParams);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;

},{"./GrammarDecl":30,"./pexprs":58}],28:[function(require,module,exports){
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
}

var ohmGrammar;
var buildGrammar;

// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function(grammar, builderFn) {
  ohmGrammar = grammar;
  buildGrammar = builderFn;
};

Grammar.prototype = {
  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn: function() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  _match: function(input, opts) {
    var state = new State(this, input, opts);
    state.evalFromStart();
    return state;
  },

  match: function(input, optStartApplication) {
    var state = this._match(input, {startApplication: optStartApplication});
    return MatchResult.newFor(state);
  },

  trace: function(input, optStartApplication) {
    var state = this._match(input, {startApplication: optStartApplication, trace: true});

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
      // The following rules can't be written in userland because they reference
      // `any` and `end` directly.
      any: pexprs.any,
      end: pexprs.end,

      // The following rule is invoked implicitly by syntactic rules to skip spaces.
      spaces: new pexprs.Star(new pexprs.Apply('space')),

      // The `space` rule must be defined here because it's referenced by `spaces`.
      space: new pexprs.Range('\x00', ' '),

      // These rules are implemented natively because they use UnicodeChar directly, which is
      // not part of the Ohm grammar.
      lower: new pexprs.UnicodeChar('Ll'),
      upper: new pexprs.UnicodeChar('Lu'),

      // The union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not
      // in Ll or Lu.
      unicodeLtmo: new pexprs.UnicodeChar('Ltmo')
    },

    // rule formal arguments
    {
      any: [],
      end: [],
      spaces: [],
      space: [],
      lower: [],
      upper: [],
      unicodeLtmo: []
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

},{"./MatchResult":33,"./Semantics":36,"./State":37,"./common":39,"./errors":40,"./pexprs":58}],30:[function(require,module,exports){
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
  this.interval = new InputStream(source).interval(0, source.length);
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

},{"./Grammar":29,"./InputStream":31,"./common":39,"./errors":40,"./pexprs":58}],31:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function InputStream(source) {
  this.source = source;
  this.pos = 0;
  this.posInfos = [];
}

InputStream.prototype = {
  atEnd: function() {
    return this.pos === this.source.length;
  },

  next: function() {
    return this.source[this.pos++];
  },

  matchString: function(s) {
    for (var idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) {
        return false;
      }
    }
    return true;
  },

  sourceSlice: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  interval: function(startIdx, optEndIdx) {
    return new Interval(this, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;

},{"./Interval":32}],32:[function(require,module,exports){
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


},{"./common":39,"./errors":40,"./util":59}],33:[function(require,module,exports){
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

},{"./Interval":32,"./common":39,"./nodes":42,"./util":59,"inherits":24}],34:[function(require,module,exports){
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

Semantics.prototype.toRecipe = function(semanticsOnly) {
  function hasSuperSemantics(s) {
    return s.super !== Semantics.BuiltInSemantics._getSemantics();
  }

  var str = '(function(g) {\n';
  if (hasSuperSemantics(this)) {
    str += '  var semantics = ' + this.super.toRecipe(true) + '(g';

    var superSemanticsGrammar = this.super.grammar;
    var relatedGrammar = this.grammar;
    while (relatedGrammar !== superSemanticsGrammar) {
      str += '.superGrammar';
      relatedGrammar = relatedGrammar.superGrammar;
    }

    str += ');\n';
    str += '  return g.extendSemantics(semantics)';
  } else {
    str += '  return g.semantics()';
  }
  ['Operation', 'Attribute'].forEach(function(type) {
    var semanticOperations = this[type.toLowerCase() + 's'];
    Object.keys(semanticOperations).forEach(function(name) {
      var signature = name;
      if (semanticOperations[name].formals.length > 0) {
        signature += '(' + semanticOperations[name].formals.join(', ') + ')';
      }

      var method;
      if (hasSuperSemantics(this) && this.super[type.toLowerCase() + 's'][name]) {
        method = 'extend' + type;
      } else {
        method = 'add' + type;
      }
      str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';

      var actions = semanticOperations[name].actionDict;
      var srcArray = [];
      Object.keys(actions).forEach(function(actionName) {
        if (semanticOperations[name].builtInDefault !== actions[actionName]) {
          srcArray.push('\n      ' + JSON.stringify(actionName) + ': ' +
            actions[actionName].toString());
        }
      });
      str += srcArray.join(',');

      str += '\n    })';
    }, this);
  }, this);
  str += ';\n  })';

  if (!semanticsOnly) {
    str =
      '(function() {\n' +
      '  var buildGrammar = ' + this.grammar.toRecipe() +
      '  var grammar = buildGrammar.call(this);\n' +
      '  var semantics = ' + str + '(grammar);\n' +
      '  return semantics;\n' +
      '});\n';
  }

  return str;
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

function newDefaultAction(type, name, doIt) {
  return function(children) {
    var self = this;
    var thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
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
  };
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
  var builtInDefault = newDefaultAction(type, name, doIt);
  var realActionDict = {_default: builtInDefault};
  // ... and add in the actions supplied by the programmer, which may override some or all of the
  // default ones.
  Object.keys(actionDict).forEach(function(name) {
    realActionDict[name] = actionDict[name];
  });

  var entry = type === 'operation' ?
      new Operation(name, formals, realActionDict, builtInDefault) :
      new Attribute(name, realActionDict, builtInDefault);

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
  proxy.getOperationNames = function() {
    return Object.keys(s.operations);
  };
  proxy.getAttributeNames = function() {
    return Object.keys(s.attributes);
  };
  proxy.getGrammar = function() {
    return s.grammar;
  };
  proxy.toRecipe = function(semanticsOnly) {
    return s.toRecipe(semanticsOnly);
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
function Operation(name, formals, actionDict, builtInDefault) {
  this.name = name;
  this.formals = formals;
  this.actionDict = actionDict;
  this.builtInDefault = builtInDefault;
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
function Attribute(name, actionDict, builtInDefault) {
  this.name = name;
  this.formals = [];
  this.actionDict = actionDict;
  this.builtInDefault = builtInDefault;
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

var InputStream = require('./InputStream');
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
  this.origInputStream = new InputStream(input);
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

},{"./InputStream":31,"./PosInfo":35,"./Trace":38,"./pexprs":58}],38:[function(require,module,exports){
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

    Lex_lex: function(_, x) {
      return builder.lex(x.visit()).withInterval(this.interval);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withInterval(this.interval);
    },
    Base_range: function(from, _, to) {
      return builder.range(from.visit(), to.visit()).withInterval(this.interval);
    },
    Base_terminal: function(expr) {
      return builder.terminal(expr.visit()).withInterval(this.interval);
    },
    Base_paren: function(open, x, close) {
      return x.visit();
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

    terminal: function(open, cs, close) {
      return cs.visit().map(function(c) { return common.unescapeChar(c); }).join('');
    },

    terminalChar: function(_) {
      return this.interval.contents;
    },

    escapeChar: function(_) {
      return this.interval.contents;
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

},{"../dist/built-in-rules":1,"../dist/ohm-grammar":2,"../dist/operations-and-attributes":3,"../extras":4,"./Builder":27,"./Grammar":29,"./Namespace":34,"./Semantics":36,"./common":39,"./errors":40,"./pexprs":58,"./util":59,"is-buffer":25}],42:[function(require,module,exports){
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
pexprs.Terminal.prototype.allowsSkippingPrecedingSpace =
pexprs.Range.prototype.allowsSkippingPrecedingSpace =
pexprs.UnicodeChar.prototype.allowsSkippingPrecedingSpace = function() {
  return true;
};

/*
  Higher-order expressions that don't directly consume input, and expressions that
  don't operate on string input streams (e.g. Obj and Arr).
*/
pexprs.Alt.prototype.allowsSkippingPrecedingSpace =
pexprs.Iter.prototype.allowsSkippingPrecedingSpace =
pexprs.Lex.prototype.allowsSkippingPrecedingSpace =
pexprs.Lookahead.prototype.allowsSkippingPrecedingSpace =
pexprs.Not.prototype.allowsSkippingPrecedingSpace =
pexprs.Param.prototype.allowsSkippingPrecedingSpace =
pexprs.Seq.prototype.allowsSkippingPrecedingSpace = function() {
  return false;
};

},{"./common":39,"./pexprs":58}],44:[function(require,module,exports){
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
pexprs.Terminal.prototype._assertAllApplicationsAreValid =
pexprs.Range.prototype._assertAllApplicationsAreValid =
pexprs.Param.prototype._assertAllApplicationsAreValid =
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
pexprs.Lookahead.prototype._assertAllApplicationsAreValid = function(ruleName, grammar) {
  this.expr._assertAllApplicationsAreValid(ruleName, grammar);
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

},{"./common":39,"./errors":40,"./pexprs":58}],45:[function(require,module,exports){
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
pexprs.Terminal.prototype.assertChoicesHaveUniformArity =
pexprs.Range.prototype.assertChoicesHaveUniformArity =
pexprs.Param.prototype.assertChoicesHaveUniformArity =
pexprs.Lex.prototype.assertChoicesHaveUniformArity =
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

pexprs.Lookahead.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  this.expr.assertChoicesHaveUniformArity(ruleName);
};

pexprs.Apply.prototype.assertChoicesHaveUniformArity = function(ruleName) {
  // The arities of the parameter expressions is required to be 1 by
  // `assertAllApplicationsAreValid()`.
};

},{"./common":39,"./errors":40,"./pexprs":58}],46:[function(require,module,exports){
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
pexprs.Terminal.prototype.assertIteratedExprsAreNotNullable =
pexprs.Range.prototype.assertIteratedExprsAreNotNullable =
pexprs.Param.prototype.assertIteratedExprsAreNotNullable =
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
pexprs.Lex.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.expr.assertIteratedExprsAreNotNullable(grammar, ruleName);
};

pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function(grammar, ruleName) {
  this.args.forEach(function(arg) {
    arg.assertIteratedExprsAreNotNullable(grammar, ruleName);
  });
};

},{"./common":39,"./errors":40,"./pexprs":58}],47:[function(require,module,exports){
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

pexprs.Terminal.prototype.check = function(grammar, vals) {
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
pexprs.Lex.prototype.check = function(grammar, vals) {
  return this.expr.check(grammar, vals);
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

},{"./common":39,"./nodes":42,"./pexprs":58}],48:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

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
  var ch = inputStream.next();
  if (ch) {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, ch, interval));
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
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

pexprs.Terminal.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (!this.match(inputStream)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    var interval = inputStream.interval(origPos);
    var primitiveValue = this.obj;
    state.bindings.push(new TerminalNode(state.grammar, primitiveValue, interval));
    return true;
  }
};

pexprs.Terminal.prototype.match = function(inputStream) {
  return inputStream.matchString(this.obj);
};

pexprs.Range.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
  if (ch && this.from <= ch && ch <= this.to) {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, ch, interval));
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
  var ch = inputStream.next();
  if (ch && this.pattern.test(ch)) {
    var interval = inputStream.interval(origPos);
    state.bindings.push(new TerminalNode(state.grammar, ch, interval));
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

},{"./Trace":38,"./common":39,"./nodes":42,"./pexprs":58}],49:[function(require,module,exports){
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
pexprs.Terminal.prototype.getArity =
pexprs.Range.prototype.getArity =
pexprs.Param.prototype.getArity =
pexprs.Apply.prototype.getArity =
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
pexprs.Lex.prototype.getArity = function() {
  return this.expr.getArity();
};

},{"./common":39,"./pexprs":58}],50:[function(require,module,exports){
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
pexprs.Terminal.prototype.introduceParams =
pexprs.Range.prototype.introduceParams =
pexprs.Param.prototype.introduceParams =
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
pexprs.Lex.prototype.introduceParams = function(formals) {
  this.expr = this.expr.introduceParams(formals);
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

},{"./common":39,"./pexprs":58}],51:[function(require,module,exports){
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
pexprs.UnicodeChar.prototype._isNullable = function(grammar, memo) {
  return false;
};

pexprs.end._isNullable = function(grammar, memo) {
  return true;
};

pexprs.Terminal.prototype._isNullable = function(grammar, memo) {
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

},{"./common":39,"./pexprs":58}],52:[function(require,module,exports){
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

pexprs.Terminal.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.terminal(');
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
pexprs.Lex.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.' + this.constructor.name.toLowerCase() + '(');
  this.expr.outputRecipe(sb, formals, grammarInterval);
  sb.append(')' + getIntervalInfo(this, grammarInterval));
};

pexprs.Lookahead.prototype.outputRecipe = function(sb, formals, grammarInterval) {
  sb.append('this.la(');
  this.expr.outputRecipe(sb, formals, grammarInterval);
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

},{"./common":39,"./pexprs":58}],53:[function(require,module,exports){
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
pexprs.Terminal.prototype.substituteParams =
pexprs.Range.prototype.substituteParams =
pexprs.Terminal.prototype.substituteParams =
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
pexprs.Lex.prototype.substituteParams = function(actuals) {
  return new this.constructor(this.expr.substituteParams(actuals));
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

},{"./common":39,"./pexprs":58}],54:[function(require,module,exports){
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

pexprs.Terminal.prototype.toArgumentNameList = function(firstArgIndex) {
  if (typeof this.obj === 'string' && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
    // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
    return ['_' + this.obj];
  } else {
    // Otherwise, name it positionally.
    return ['$' + firstArgIndex];
  }
};

pexprs.Range.prototype.toArgumentNameList = function(firstArgIndex) {
  return [this.from + '_to_' + this.to];
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

},{"./common":39,"./pexprs":58}],55:[function(require,module,exports){
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
pexprs.Lex.prototype.toDisplayString = function() {
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

pexprs.Terminal.prototype.toDisplayString = function() {
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

},{"./common":39,"./pexprs":58}],56:[function(require,module,exports){
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

pexprs.Terminal.prototype.toFailure = function(grammar) {
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

},{"./Failure":28,"./common":39,"./pexprs":58}],57:[function(require,module,exports){
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

pexprs.Terminal.prototype.toString = function() {
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

},{"./common":39,"./pexprs":58}],58:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var UnicodeCategories = require('../third_party/UnicodeCategories');
var common = require('./common');
var errors = require('./errors');
var inherits = require('inherits');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// General stuff

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

// Any

var any = Object.create(PExpr.prototype);

// End

var end = Object.create(PExpr.prototype);

// Terminals

function Terminal(obj) {
  this.obj = obj;
}
inherits(Terminal, PExpr);

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

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

exports.PExpr = PExpr;
exports.any = any;
exports.end = end;
exports.Terminal = Terminal;
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
exports.Arr = Arr;
exports.Str = Str;
exports.Obj = Obj;
exports.Apply = Apply;
exports.UnicodeChar = UnicodeChar;

// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------

require('./pexprs-allowsSkippingPrecedingSpace');
require('./pexprs-assertAllApplicationsAreValid');
require('./pexprs-assertChoicesHaveUniformArity');
require('./pexprs-assertIteratedExprsAreNotNullable');
require('./pexprs-check');
require('./pexprs-eval');
require('./pexprs-getArity');
require('./pexprs-outputRecipe');
require('./pexprs-introduceParams');
require('./pexprs-isNullable');
require('./pexprs-substituteParams');
require('./pexprs-toDisplayString');
require('./pexprs-toArgumentNameList');
require('./pexprs-toFailure');
require('./pexprs-toString');

},{"../third_party/UnicodeCategories":60,"./common":39,"./errors":40,"./pexprs-allowsSkippingPrecedingSpace":43,"./pexprs-assertAllApplicationsAreValid":44,"./pexprs-assertChoicesHaveUniformArity":45,"./pexprs-assertIteratedExprsAreNotNullable":46,"./pexprs-check":47,"./pexprs-eval":48,"./pexprs-getArity":49,"./pexprs-introduceParams":50,"./pexprs-isNullable":51,"./pexprs-outputRecipe":52,"./pexprs-substituteParams":53,"./pexprs-toArgumentNameList":54,"./pexprs-toDisplayString":55,"./pexprs-toFailure":56,"./pexprs-toString":57,"inherits":24}],59:[function(require,module,exports){
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

},{"./common":39}],60:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwiZGlzdC9vaG0tZ3JhbW1hci5qcyIsImRpc3Qvb3BlcmF0aW9ucy1hbmQtYXR0cmlidXRlcy5qcyIsImV4dHJhcy9pbmRleC5qcyIsImV4dHJhcy9zZW1hbnRpY3MtdG9BU1QuanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL2lzLWltcGxlbWVudGVkLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvaXMtc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9ub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3QvYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2Fzc2lnbi9pcy1pbXBsZW1lbnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9hc3NpZ24vc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9pcy1jYWxsYWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9rZXlzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2tleXMvaXMtaW1wbGVtZW50ZWQuanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9ub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3Qva2V5cy9zaGltLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L25vcm1hbGl6ZS1vcHRpb25zLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L3ZhbGlkLXZhbHVlLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvbm9kZV9tb2R1bGVzL2VzNS1leHQvc3RyaW5nLyMvY29udGFpbnMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9ub2RlX21vZHVsZXMvZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucy9pcy1pbXBsZW1lbnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL25vZGVfbW9kdWxlcy9lczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zL3NoaW0uanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9wb2x5ZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL3ZhbGlkYXRlLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9pbmhlcml0cy9pbmhlcml0c19icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2lzLWJ1ZmZlci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy91dGlsLWV4dGVuZC9leHRlbmQuanMiLCJzcmMvQnVpbGRlci5qcyIsInNyYy9GYWlsdXJlLmpzIiwic3JjL0dyYW1tYXIuanMiLCJzcmMvR3JhbW1hckRlY2wuanMiLCJzcmMvSW5wdXRTdHJlYW0uanMiLCJzcmMvSW50ZXJ2YWwuanMiLCJzcmMvTWF0Y2hSZXN1bHQuanMiLCJzcmMvTmFtZXNwYWNlLmpzIiwic3JjL1Bvc0luZm8uanMiLCJzcmMvU2VtYW50aWNzLmpzIiwic3JjL1N0YXRlLmpzIiwic3JjL1RyYWNlLmpzIiwic3JjL2NvbW1vbi5qcyIsInNyYy9lcnJvcnMuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9ub2Rlcy5qcyIsInNyYy9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZS5qcyIsInNyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJzcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzIiwic3JjL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUuanMiLCJzcmMvcGV4cHJzLWNoZWNrLmpzIiwic3JjL3BleHBycy1ldmFsLmpzIiwic3JjL3BleHBycy1nZXRBcml0eS5qcyIsInNyYy9wZXhwcnMtaW50cm9kdWNlUGFyYW1zLmpzIiwic3JjL3BleHBycy1pc051bGxhYmxlLmpzIiwic3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCJzcmMvcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMuanMiLCJzcmMvcGV4cHJzLXRvQXJndW1lbnROYW1lTGlzdC5qcyIsInNyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwic3JjL3BleHBycy10b0ZhaWx1cmUuanMiLCJzcmMvcGV4cHJzLXRvU3RyaW5nLmpzIiwic3JjL3BleHBycy5qcyIsInNyYy91dGlsLmpzIiwidGhpcmRfcGFydHkvVW5pY29kZUNhdGVnb3JpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6V0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoZnVuY3Rpb24oKSB7XG4gIHZhciBkZWNsID0gdGhpcy5uZXdHcmFtbWFyKFwiQnVpbHRJblJ1bGVzXCIpXG4gICAgLndpdGhTb3VyY2UoXCJCdWlsdEluUnVsZXMge1xcblxcbiAgYWxudW0gIChhbiBhbHBoYS1udW1lcmljIGNoYXJhY3RlcilcXG4gICAgPSBsZXR0ZXJcXG4gICAgfCBkaWdpdFxcblxcbiAgbGV0dGVyICAoYSBsZXR0ZXIpXFxuICAgID0gbG93ZXJcXG4gICAgfCB1cHBlclxcbiAgICB8IHVuaWNvZGVMdG1vXFxuXFxuICBkaWdpdCAgKGEgZGlnaXQpXFxuICAgID0gXFxcIjBcXFwiLi5cXFwiOVxcXCJcXG5cXG4gIGhleERpZ2l0ICAoYSBoZXhhZGVjaW1hbCBkaWdpdClcXG4gICAgPSBkaWdpdFxcbiAgICB8IFxcXCJhXFxcIi4uXFxcImZcXFwiXFxuICAgIHwgXFxcIkFcXFwiLi5cXFwiRlxcXCJcXG5cXG4gIExpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gTm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICB8IEVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG5cXG4gIE5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBlbGVtIChzZXAgZWxlbSkqXFxuXFxuICBFbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gLyogbm90aGluZyAqL1xcblxcbiAgbGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBub25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgIHwgZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcblxcbiAgbm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IGVsZW0gKHNlcCBlbGVtKSpcXG5cXG4gIGVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSAvKiBub3RoaW5nICovXFxuXFxufVwiKVxuICByZXR1cm4gZGVjbFxuICAgIC5kZWZpbmUoXCJhbG51bVwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJsZXR0ZXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjAsIDY2KSksIHRoaXMuYXBwKFwiZGlnaXRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzMsIDc4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDYwLCA3OCkpLCBcImFuIGFscGhhLW51bWVyaWMgY2hhcmFjdGVyXCIpXG4gICAgLmRlZmluZShcImxldHRlclwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJsb3dlclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDcsIDExMikpLCB0aGlzLmFwcChcInVwcGVyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExOSwgMTI0KSksIHRoaXMuYXBwKFwidW5pY29kZUx0bW9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTMxLCAxNDIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA3LCAxNDIpKSwgXCJhIGxldHRlclwiKVxuICAgIC5kZWZpbmUoXCJkaWdpdFwiLCBbXSwgdGhpcy5yYW5nZShcIjBcIiwgXCI5XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2OSwgMTc3KSksIFwiYSBkaWdpdFwiKVxuICAgIC5kZWZpbmUoXCJoZXhEaWdpdFwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJkaWdpdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTksIDIyNCkpLCB0aGlzLnJhbmdlKFwiYVwiLCBcImZcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjMxLCAyMzkpKSwgdGhpcy5yYW5nZShcIkFcIiwgXCJGXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0NiwgMjU0KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIxOSwgMjU0KSksIFwiYSBoZXhhZGVjaW1hbCBkaWdpdFwiKVxuICAgIC5kZWZpbmUoXCJMaXN0T2ZcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJOb25lbXB0eUxpc3RPZlwiLCBbdGhpcy5wYXJhbSgwKSwgdGhpcy5wYXJhbSgxKV0pLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI4MiwgMzA3KSksIHRoaXMuYXBwKFwiRW1wdHlMaXN0T2ZcIiwgW3RoaXMucGFyYW0oMCksIHRoaXMucGFyYW0oMSldKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMTQsIDMzNikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyODIsIDMzNikpKVxuICAgIC5kZWZpbmUoXCJOb25lbXB0eUxpc3RPZlwiLCBbXCJlbGVtXCIsIFwic2VwXCJdLCB0aGlzLnNlcSh0aGlzLnBhcmFtKDApLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5wYXJhbSgxKSwgdGhpcy5wYXJhbSgwKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzc4LCAzODYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzc3LCAzODgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzcyLCAzODgpKSlcbiAgICAuZGVmaW5lKFwiRW1wdHlMaXN0T2ZcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5zZXEoKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MzgsIDQzOCkpKVxuICAgIC5kZWZpbmUoXCJsaXN0T2ZcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJub25lbXB0eUxpc3RPZlwiLCBbdGhpcy5wYXJhbSgwKSwgdGhpcy5wYXJhbSgxKV0pLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ2MiwgNDg3KSksIHRoaXMuYXBwKFwiZW1wdHlMaXN0T2ZcIiwgW3RoaXMucGFyYW0oMCksIHRoaXMucGFyYW0oMSldKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0OTQsIDUxNikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0NjIsIDUxNikpKVxuICAgIC5kZWZpbmUoXCJub25lbXB0eUxpc3RPZlwiLCBbXCJlbGVtXCIsIFwic2VwXCJdLCB0aGlzLnNlcSh0aGlzLnBhcmFtKDApLCB0aGlzLnN0YXIodGhpcy5zZXEodGhpcy5wYXJhbSgxKSwgdGhpcy5wYXJhbSgwKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTU4LCA1NjYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTU3LCA1NjgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTUyLCA1NjgpKSlcbiAgICAuZGVmaW5lKFwiZW1wdHlMaXN0T2ZcIiwgW1wiZWxlbVwiLCBcInNlcFwiXSwgdGhpcy5zZXEoKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2MTYsIDYxNikpKVxuICAgIC5idWlsZCgpO1xufSk7XG5cbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShmdW5jdGlvbigpIHtcbiAgdmFyIGRlY2wgPSB0aGlzLm5ld0dyYW1tYXIoXCJPaG1cIilcbiAgICAud2l0aFNvdXJjZShcIk9obSB7XFxuXFxuICBHcmFtbWFyc1xcbiAgICA9IEdyYW1tYXIqXFxuXFxuICBHcmFtbWFyXFxuICAgID0gaWRlbnQgU3VwZXJHcmFtbWFyPyBcXFwie1xcXCIgUnVsZSogXFxcIn1cXFwiXFxuXFxuICBTdXBlckdyYW1tYXJcXG4gICAgPSBcXFwiPDpcXFwiIGlkZW50XFxuXFxuICBSdWxlXFxuICAgID0gaWRlbnQgRm9ybWFscz8gcnVsZURlc2NyPyBcXFwiPVxcXCIgIFxcXCJ8XFxcIj8gQWx0ICAtLSBkZWZpbmVcXG4gICAgfCBpZGVudCBGb3JtYWxzPyAgICAgICAgICAgIFxcXCI6PVxcXCIgXFxcInxcXFwiPyBBbHQgIC0tIG92ZXJyaWRlXFxuICAgIHwgaWRlbnQgRm9ybWFscz8gICAgICAgICAgICBcXFwiKz1cXFwiIFxcXCJ8XFxcIj8gQWx0ICAtLSBleHRlbmRcXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiPFxcXCIgTGlzdE9mPGlkZW50LCBcXFwiLFxcXCI+IFxcXCI+XFxcIlxcblxcbiAgUGFyYW1zXFxuICAgID0gXFxcIjxcXFwiIExpc3RPZjxTZXEsIFxcXCIsXFxcIj4gXFxcIj5cXFwiXFxuXFxuICBBbHRcXG4gICAgPSBUZXJtIChcXFwifFxcXCIgVGVybSkqXFxuXFxuICBUZXJtXFxuICAgID0gU2VxIGNhc2VOYW1lIC0tIGlubGluZVxcbiAgICB8IFNlcVxcblxcbiAgU2VxXFxuICAgID0gSXRlcipcXG5cXG4gIEl0ZXJcXG4gICAgPSBQcmVkIFxcXCIqXFxcIiAgLS0gc3RhclxcbiAgICB8IFByZWQgXFxcIitcXFwiICAtLSBwbHVzXFxuICAgIHwgUHJlZCBcXFwiP1xcXCIgIC0tIG9wdFxcbiAgICB8IFByZWRcXG5cXG4gIFByZWRcXG4gICAgPSBcXFwiflxcXCIgTGV4ICAtLSBub3RcXG4gICAgfCBcXFwiJlxcXCIgTGV4ICAtLSBsb29rYWhlYWRcXG4gICAgfCBMZXhcXG5cXG4gIExleFxcbiAgICA9IFxcXCIjXFxcIiBCYXNlICAtLSBsZXhcXG4gICAgfCBCYXNlXFxuXFxuICBCYXNlXFxuICAgID0gaWRlbnQgUGFyYW1zPyB+KHJ1bGVEZXNjcj8gXFxcIj1cXFwiIHwgXFxcIjo9XFxcIiB8IFxcXCIrPVxcXCIpICAtLSBhcHBsaWNhdGlvblxcbiAgICB8IHRlcm1pbmFsIFxcXCIuLlxcXCIgdGVybWluYWwgICAgICAgICAgICAgICAgICAgICAgICAgLS0gcmFuZ2VcXG4gICAgfCB0ZXJtaW5hbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHRlcm1pbmFsXFxuICAgIHwgXFxcIihcXFwiIEFsdCBcXFwiKVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBwYXJlblxcblxcbiAgcnVsZURlc2NyICAoYSBydWxlIGRlc2NyaXB0aW9uKVxcbiAgICA9IFxcXCIoXFxcIiBydWxlRGVzY3JUZXh0IFxcXCIpXFxcIlxcblxcbiAgcnVsZURlc2NyVGV4dFxcbiAgICA9ICh+XFxcIilcXFwiIGFueSkqXFxuXFxuICBjYXNlTmFtZVxcbiAgICA9IFxcXCItLVxcXCIgKH5cXFwiXFxcXG5cXFwiIHNwYWNlKSogbmFtZSAoflxcXCJcXFxcblxcXCIgc3BhY2UpKiAoXFxcIlxcXFxuXFxcIiB8ICZcXFwifVxcXCIpXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbiAgaWRlbnQgIChhbiBpZGVudGlmaWVyKVxcbiAgICA9IG5hbWVcXG5cXG4gIHRlcm1pbmFsXFxuICAgID0gXFxcIlxcXFxcXFwiXFxcIiB0ZXJtaW5hbENoYXIqIFxcXCJcXFxcXFxcIlxcXCJcXG5cXG4gIHRlcm1pbmFsQ2hhclxcbiAgICA9IGVzY2FwZUNoYXJcXG4gICAgfCB+XFxcIlxcXFxcXFxcXFxcIiB+XFxcIlxcXFxcXFwiXFxcIiB+XFxcIlxcXFxuXFxcIiBhbnlcXG5cXG4gIGVzY2FwZUNoYXIgIChhbiBlc2NhcGUgc2VxdWVuY2UpXFxuICAgID0gXFxcIlxcXFxcXFxcXFxcXFxcXFxcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGJhY2tzbGFzaFxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFxcXFwiXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBkb3VibGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFwnXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBzaW5nbGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXGJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBiYWNrc3BhY2VcXG4gICAgfCBcXFwiXFxcXFxcXFxuXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gbGluZUZlZWRcXG4gICAgfCBcXFwiXFxcXFxcXFxyXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gY2FycmlhZ2VSZXR1cm5cXG4gICAgfCBcXFwiXFxcXFxcXFx0XFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gdGFiXFxuICAgIHwgXFxcIlxcXFxcXFxcdVxcXCIgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgIC0tIHVuaWNvZGVFc2NhcGVcXG4gICAgfCBcXFwiXFxcXFxcXFx4XFxcIiBoZXhEaWdpdCBoZXhEaWdpdCAgICAgICAgICAgICAgICAgICAgLS0gaGV4RXNjYXBlXFxuXFxuICBzcGFjZVxcbiAgICs9IGNvbW1lbnRcXG5cXG4gIGNvbW1lbnRcXG4gICAgPSBcXFwiLy9cXFwiICh+XFxcIlxcXFxuXFxcIiBhbnkpKiBcXFwiXFxcXG5cXFwiICAtLSBzaW5nbGVMaW5lXFxuICAgIHwgXFxcIi8qXFxcIiAoflxcXCIqL1xcXCIgYW55KSogXFxcIiovXFxcIiAgLS0gbXVsdGlMaW5lXFxuXFxuICB0b2tlbnMgPSB0b2tlbipcXG5cXG4gIHRva2VuID0gY2FzZU5hbWUgfCBjb21tZW50IHwgaWRlbnQgfCBvcGVyYXRvciB8IHB1bmN0dWF0aW9uIHwgdGVybWluYWwgfCBhbnlcXG5cXG4gIG9wZXJhdG9yID0gXFxcIjw6XFxcIiB8IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiIHwgXFxcIipcXFwiIHwgXFxcIitcXFwiIHwgXFxcIj9cXFwiIHwgXFxcIn5cXFwiIHwgXFxcIiZcXFwiXFxuXFxuICBwdW5jdHVhdGlvbiA9IFxcXCI8XFxcIiB8IFxcXCI+XFxcIiB8IFxcXCIsXFxcIiB8IFxcXCItLVxcXCJcXG59XCIpXG4gICAgLndpdGhEZWZhdWx0U3RhcnRSdWxlKFwiR3JhbW1hcnNcIilcbiAgcmV0dXJuIGRlY2xcbiAgICAuZGVmaW5lKFwiR3JhbW1hcnNcIiwgW10sIHRoaXMuc3Rhcih0aGlzLmFwcChcIkdyYW1tYXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQsIDMxKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0LCAzMikpKVxuICAgIC5kZWZpbmUoXCJHcmFtbWFyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDUwLCA1NSkpLCB0aGlzLm9wdCh0aGlzLmFwcChcIlN1cGVyR3JhbW1hclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1NiwgNjgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTYsIDY5KSksIHRoaXMudGVybWluYWwoXCJ7XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDcwLCA3MykpLCB0aGlzLnN0YXIodGhpcy5hcHAoXCJSdWxlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDc0LCA3OCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3NCwgNzkpKSwgdGhpcy50ZXJtaW5hbChcIn1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODAsIDgzKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDUwLCA4MykpKVxuICAgIC5kZWZpbmUoXCJTdXBlckdyYW1tYXJcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCI8OlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDYsIDExMCkpLCB0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExMSwgMTE2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNiwgMTE2KSkpXG4gICAgLmRlZmluZShcIlJ1bGVfZGVmaW5lXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMTM2KSksIHRoaXMub3B0KHRoaXMuYXBwKFwiRm9ybWFsc1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzcsIDE0NCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzcsIDE0NSkpLCB0aGlzLm9wdCh0aGlzLmFwcChcInJ1bGVEZXNjclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDYsIDE1NSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDYsIDE1NikpLCB0aGlzLnRlcm1pbmFsKFwiPVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNTcsIDE2MCkpLCB0aGlzLm9wdCh0aGlzLnRlcm1pbmFsKFwifFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjIsIDE2NSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjIsIDE2NikpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjcsIDE3MCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzEsIDE3MCkpKVxuICAgIC5kZWZpbmUoXCJSdWxlX292ZXJyaWRlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE4OCwgMTkzKSksIHRoaXMub3B0KHRoaXMuYXBwKFwiRm9ybWFsc1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxOTQsIDIwMSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxOTQsIDIwMikpLCB0aGlzLnRlcm1pbmFsKFwiOj1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE0LCAyMTgpKSwgdGhpcy5vcHQodGhpcy50ZXJtaW5hbChcInxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE5LCAyMjIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE5LCAyMjMpKSwgdGhpcy5hcHAoXCJBbHRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI0LCAyMjcpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTg4LCAyMjcpKSlcbiAgICAuZGVmaW5lKFwiUnVsZV9leHRlbmRcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiaWRlbnRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQ3LCAyNTIpKSwgdGhpcy5vcHQodGhpcy5hcHAoXCJGb3JtYWxzXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1MywgMjYwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI1MywgMjYxKSksIHRoaXMudGVybWluYWwoXCIrPVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzMsIDI3NykpLCB0aGlzLm9wdCh0aGlzLnRlcm1pbmFsKFwifFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzgsIDI4MSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNzgsIDI4MikpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyODMsIDI4NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyNDcsIDI4NikpKVxuICAgIC5kZWZpbmUoXCJSdWxlXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcIlJ1bGVfZGVmaW5lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMTcwKSksIHRoaXMuYXBwKFwiUnVsZV9vdmVycmlkZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODgsIDIyNykpLCB0aGlzLmFwcChcIlJ1bGVfZXh0ZW5kXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0NywgMjg2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzMSwgMjk3KSkpXG4gICAgLmRlZmluZShcIkZvcm1hbHNcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCI8XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDMxNSwgMzE4KSksIHRoaXMuYXBwKFwiTGlzdE9mXCIsIFt0aGlzLmFwcChcImlkZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDMyNiwgMzMxKSksIHRoaXMudGVybWluYWwoXCIsXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDMzMywgMzM2KSldKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMTksIDMzNykpLCB0aGlzLnRlcm1pbmFsKFwiPlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMzgsIDM0MSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzMTUsIDM0MSkpKVxuICAgIC5kZWZpbmUoXCJQYXJhbXNcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCI8XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDM1OCwgMzYxKSksIHRoaXMuYXBwKFwiTGlzdE9mXCIsIFt0aGlzLmFwcChcIlNlcVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzNjksIDM3MikpLCB0aGlzLnRlcm1pbmFsKFwiLFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzNzQsIDM3NykpXSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzYyLCAzNzgpKSwgdGhpcy50ZXJtaW5hbChcIj5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzc5LCAzODIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzU4LCAzODIpKSlcbiAgICAuZGVmaW5lKFwiQWx0XCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIlRlcm1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMzk2LCA0MDApKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCJ8XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQwMiwgNDA1KSksIHRoaXMuYXBwKFwiVGVybVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MDYsIDQxMCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MDIsIDQxMCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MDEsIDQxMikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgzOTYsIDQxMikpKVxuICAgIC5kZWZpbmUoXCJUZXJtX2lubGluZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJTZXFcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNDI3LCA0MzApKSwgdGhpcy5hcHAoXCJjYXNlTmFtZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MzEsIDQzOSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0MjcsIDQzOSkpKVxuICAgIC5kZWZpbmUoXCJUZXJtXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcIlRlcm1faW5saW5lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQyNywgNDM5KSksIHRoaXMuYXBwKFwiU2VxXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ1NiwgNDU5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQyNywgNDU5KSkpXG4gICAgLmRlZmluZShcIlNlcVwiLCBbXSwgdGhpcy5zdGFyKHRoaXMuYXBwKFwiSXRlclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0NzMsIDQ3NykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0NzMsIDQ3OCkpKVxuICAgIC5kZWZpbmUoXCJJdGVyX3N0YXJcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJlZFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0OTMsIDQ5NykpLCB0aGlzLnRlcm1pbmFsKFwiKlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0OTgsIDUwMSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg0OTMsIDUwMSkpKVxuICAgIC5kZWZpbmUoXCJJdGVyX3BsdXNcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwiUHJlZFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1MTcsIDUyMSkpLCB0aGlzLnRlcm1pbmFsKFwiK1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1MjIsIDUyNSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1MTcsIDUyNSkpKVxuICAgIC5kZWZpbmUoXCJJdGVyX29wdFwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJQcmVkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU0MSwgNTQ1KSksIHRoaXMudGVybWluYWwoXCI/XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU0NiwgNTQ5KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU0MSwgNTQ5KSkpXG4gICAgLmRlZmluZShcIkl0ZXJcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiSXRlcl9zdGFyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ5MywgNTAxKSksIHRoaXMuYXBwKFwiSXRlcl9wbHVzXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDUxNywgNTI1KSksIHRoaXMuYXBwKFwiSXRlcl9vcHRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNTQxLCA1NDkpKSwgdGhpcy5hcHAoXCJQcmVkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU2NCwgNTY4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDQ5MywgNTY4KSkpXG4gICAgLmRlZmluZShcIlByZWRfbm90XCIsIFtdLCB0aGlzLnNlcSh0aGlzLnRlcm1pbmFsKFwiflwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1ODMsIDU4NikpLCB0aGlzLmFwcChcIkxleFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1ODcsIDU5MCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1ODMsIDU5MCkpKVxuICAgIC5kZWZpbmUoXCJQcmVkX2xvb2thaGVhZFwiLCBbXSwgdGhpcy5zZXEodGhpcy50ZXJtaW5hbChcIiZcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjA1LCA2MDgpKSwgdGhpcy5hcHAoXCJMZXhcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjA5LCA2MTIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjA1LCA2MTIpKSlcbiAgICAuZGVmaW5lKFwiUHJlZFwiLCBbXSwgdGhpcy5hbHQodGhpcy5hcHAoXCJQcmVkX25vdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1ODMsIDU5MCkpLCB0aGlzLmFwcChcIlByZWRfbG9va2FoZWFkXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDYwNSwgNjEyKSksIHRoaXMuYXBwKFwiTGV4XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDYzMywgNjM2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDU4MywgNjM2KSkpXG4gICAgLmRlZmluZShcIkxleF9sZXhcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCIjXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDY1MCwgNjUzKSksIHRoaXMuYXBwKFwiQmFzZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2NTQsIDY1OCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2NTAsIDY1OCkpKVxuICAgIC5kZWZpbmUoXCJMZXhcIiwgW10sIHRoaXMuYWx0KHRoaXMuYXBwKFwiTGV4X2xleFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2NTAsIDY1OCkpLCB0aGlzLmFwcChcIkJhc2VcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjczLCA2NzcpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjUwLCA2NzcpKSlcbiAgICAuZGVmaW5lKFwiQmFzZV9hcHBsaWNhdGlvblwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJpZGVudFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2OTIsIDY5NykpLCB0aGlzLm9wdCh0aGlzLmFwcChcIlBhcmFtc1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2OTgsIDcwNCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg2OTgsIDcwNSkpLCB0aGlzLm5vdCh0aGlzLmFsdCh0aGlzLnNlcSh0aGlzLm9wdCh0aGlzLmFwcChcInJ1bGVEZXNjclwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MDgsIDcxNykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MDgsIDcxOCkpLCB0aGlzLnRlcm1pbmFsKFwiPVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MTksIDcyMikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg3MDgsIDcyMikpLCB0aGlzLnRlcm1pbmFsKFwiOj1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzI1LCA3MjkpKSwgdGhpcy50ZXJtaW5hbChcIis9XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDczMiwgNzM2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDcwOCwgNzM2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDcwNiwgNzM3KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDY5MiwgNzM3KSkpXG4gICAgLmRlZmluZShcIkJhc2VfcmFuZ2VcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwidGVybWluYWxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzYwLCA3NjgpKSwgdGhpcy50ZXJtaW5hbChcIi4uXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDc2OSwgNzczKSksIHRoaXMuYXBwKFwidGVybWluYWxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzc0LCA3ODIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNzYwLCA3ODIpKSlcbiAgICAuZGVmaW5lKFwiQmFzZV90ZXJtaW5hbFwiLCBbXSwgdGhpcy5hcHAoXCJ0ZXJtaW5hbFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4MjIsIDgzMCkpKVxuICAgIC5kZWZpbmUoXCJCYXNlX3BhcmVuXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnRlcm1pbmFsKFwiKFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4ODcsIDg5MCkpLCB0aGlzLmFwcChcIkFsdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4OTEsIDg5NCkpLCB0aGlzLnRlcm1pbmFsKFwiKVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4OTUsIDg5OCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4ODcsIDg5OCkpKVxuICAgIC5kZWZpbmUoXCJCYXNlXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcIkJhc2VfYXBwbGljYXRpb25cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjkyLCA3MzcpKSwgdGhpcy5hcHAoXCJCYXNlX3JhbmdlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDc2MCwgNzgyKSksIHRoaXMuYXBwKFwiQmFzZV90ZXJtaW5hbFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4MjIsIDgzMCkpLCB0aGlzLmFwcChcIkJhc2VfcGFyZW5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODg3LCA4OTgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoNjkyLCA5NDIpKSlcbiAgICAuZGVmaW5lKFwicnVsZURlc2NyXCIsIFtdLCB0aGlzLnNlcSh0aGlzLnRlcm1pbmFsKFwiKFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg5ODQsIDk4NykpLCB0aGlzLmFwcChcInJ1bGVEZXNjclRleHRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTg4LCAxMDAxKSksIHRoaXMudGVybWluYWwoXCIpXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwMDIsIDEwMDUpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTg0LCAxMDA1KSksIFwiYSBydWxlIGRlc2NyaXB0aW9uXCIpXG4gICAgLmRlZmluZShcInJ1bGVEZXNjclRleHRcIiwgW10sIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnRlcm1pbmFsKFwiKVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDMxLCAxMDM0KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwMzAsIDEwMzQpKSwgdGhpcy5hcHAoXCJhbnlcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTAzNSwgMTAzOCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDMwLCAxMDM4KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwMjksIDEwNDApKSlcbiAgICAuZGVmaW5lKFwiY2FzZU5hbWVcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCItLVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDU5LCAxMDYzKSksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnRlcm1pbmFsKFwiXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNjYsIDEwNzApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA2NSwgMTA3MCkpLCB0aGlzLmFwcChcInNwYWNlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNzEsIDEwNzYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA2NSwgMTA3NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDY0LCAxMDc4KSksIHRoaXMuYXBwKFwibmFtZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDc5LCAxMDgzKSksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnRlcm1pbmFsKFwiXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwODYsIDEwOTApKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA4NSwgMTA5MCkpLCB0aGlzLmFwcChcInNwYWNlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwOTEsIDEwOTYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTA4NSwgMTA5NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMDg0LCAxMDk4KSksIHRoaXMuYWx0KHRoaXMudGVybWluYWwoXCJcXG5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTEwMCwgMTEwNCkpLCB0aGlzLmxhKHRoaXMudGVybWluYWwoXCJ9XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExMDgsIDExMTEpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTEwNywgMTExMSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTAwLCAxMTExKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEwNTksIDExMTIpKSlcbiAgICAuZGVmaW5lKFwibmFtZVwiLCBbXSwgdGhpcy5zZXEodGhpcy5hcHAoXCJuYW1lRmlyc3RcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTEzNywgMTE0NikpLCB0aGlzLnN0YXIodGhpcy5hcHAoXCJuYW1lUmVzdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTQ3LCAxMTU1KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExNDcsIDExNTYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTEzNywgMTE1NikpLCBcImEgbmFtZVwiKVxuICAgIC5kZWZpbmUoXCJuYW1lRmlyc3RcIiwgW10sIHRoaXMuYWx0KHRoaXMudGVybWluYWwoXCJfXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExNzYsIDExNzkpKSwgdGhpcy5hcHAoXCJsZXR0ZXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTE4NiwgMTE5MikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMTc2LCAxMTkyKSkpXG4gICAgLmRlZmluZShcIm5hbWVSZXN0XCIsIFtdLCB0aGlzLmFsdCh0aGlzLnRlcm1pbmFsKFwiX1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjExLCAxMjE0KSksIHRoaXMuYXBwKFwiYWxudW1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTIyMSwgMTIyNikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMjExLCAxMjI2KSkpXG4gICAgLmRlZmluZShcImlkZW50XCIsIFtdLCB0aGlzLmFwcChcIm5hbWVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI1OSwgMTI2MykpLCBcImFuIGlkZW50aWZpZXJcIilcbiAgICAuZGVmaW5lKFwidGVybWluYWxcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCJcXFwiXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyODIsIDEyODYpKSwgdGhpcy5zdGFyKHRoaXMuYXBwKFwidGVybWluYWxDaGFyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyODcsIDEyOTkpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI4NywgMTMwMCkpLCB0aGlzLnRlcm1pbmFsKFwiXFxcIlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzAxLCAxMzA1KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyODIsIDEzMDUpKSlcbiAgICAuZGVmaW5lKFwidGVybWluYWxDaGFyXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcImVzY2FwZUNoYXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTMyOCwgMTMzOCkpLCB0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnRlcm1pbmFsKFwiXFxcXFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzQ2LCAxMzUwKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzNDUsIDEzNTApKSwgdGhpcy5ub3QodGhpcy50ZXJtaW5hbChcIlxcXCJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTM1MiwgMTM1NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzUxLCAxMzU2KSksIHRoaXMubm90KHRoaXMudGVybWluYWwoXCJcXG5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTM1OCwgMTM2MikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzU3LCAxMzYyKSksIHRoaXMuYXBwKFwiYW55XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEzNjMsIDEzNjYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTM0NSwgMTM2NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxMzI4LCAxMzY2KSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfYmFja3NsYXNoXCIsIFtdLCB0aGlzLnRlcm1pbmFsKFwiXFxcXFxcXFxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQwOSwgMTQxNSkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2RvdWJsZVF1b3RlXCIsIFtdLCB0aGlzLnRlcm1pbmFsKFwiXFxcXFxcXCJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTQ3MSwgMTQ3NykpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIsIFtdLCB0aGlzLnRlcm1pbmFsKFwiXFxcXCdcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTUzNSwgMTU0MSkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiLCBbXSwgdGhpcy50ZXJtaW5hbChcIlxcXFxiXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE1OTksIDE2MDQpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9saW5lRmVlZFwiLCBbXSwgdGhpcy50ZXJtaW5hbChcIlxcXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2NjEsIDE2NjYpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiLCBbXSwgdGhpcy50ZXJtaW5hbChcIlxcXFxyXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3MjIsIDE3MjcpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl90YWJcIiwgW10sIHRoaXMudGVybWluYWwoXCJcXFxcdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzg5LCAxNzk0KSkpXG4gICAgLmRlZmluZShcImVzY2FwZUNoYXJfdW5pY29kZUVzY2FwZVwiLCBbXSwgdGhpcy5zZXEodGhpcy50ZXJtaW5hbChcIlxcXFx1XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE4NDUsIDE4NTApKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODUxLCAxODU5KSksIHRoaXMuYXBwKFwiaGV4RGlnaXRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTg2MCwgMTg2OCkpLCB0aGlzLmFwcChcImhleERpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE4NjksIDE4NzcpKSwgdGhpcy5hcHAoXCJoZXhEaWdpdFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODc4LCAxODg2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE4NDUsIDE4ODYpKSlcbiAgICAuZGVmaW5lKFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCJcXFxceFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxOTExLCAxOTE2KSksIHRoaXMuYXBwKFwiaGV4RGlnaXRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTkxNywgMTkyNSkpLCB0aGlzLmFwcChcImhleERpZ2l0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE5MjYsIDE5MzQpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTkxMSwgMTkzNCkpKVxuICAgIC5kZWZpbmUoXCJlc2NhcGVDaGFyXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcImVzY2FwZUNoYXJfYmFja3NsYXNoXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0MDksIDE0MTUpKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX2RvdWJsZVF1b3RlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0NzEsIDE0NzcpKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE1MzUsIDE1NDEpKSwgdGhpcy5hcHAoXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNTk5LCAxNjA0KSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9saW5lRmVlZFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNjYxLCAxNjY2KSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNzIyLCAxNzI3KSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl90YWJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTc4OSwgMTc5NCkpLCB0aGlzLmFwcChcImVzY2FwZUNoYXJfdW5pY29kZUVzY2FwZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxODQ1LCAxODg2KSksIHRoaXMuYXBwKFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTkxMSwgMTkzNCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgxNDA5LCAxOTY2KSksIFwiYW4gZXNjYXBlIHNlcXVlbmNlXCIpXG4gICAgLmV4dGVuZChcInNwYWNlXCIsIFtdLCB0aGlzLmFwcChcImNvbW1lbnRcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTk4MiwgMTk4OSkpKVxuICAgIC5kZWZpbmUoXCJjb21tZW50X3NpbmdsZUxpbmVcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCIvL1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMDA3LCAyMDExKSksIHRoaXMuc3Rhcih0aGlzLnNlcSh0aGlzLm5vdCh0aGlzLnRlcm1pbmFsKFwiXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwMTQsIDIwMTgpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjAxMywgMjAxOCkpLCB0aGlzLmFwcChcImFueVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMDE5LCAyMDIyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwMTMsIDIwMjIpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjAxMiwgMjAyNCkpLCB0aGlzLnRlcm1pbmFsKFwiXFxuXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwMjUsIDIwMjkpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjAwNywgMjAyOSkpKVxuICAgIC5kZWZpbmUoXCJjb21tZW50X211bHRpTGluZVwiLCBbXSwgdGhpcy5zZXEodGhpcy50ZXJtaW5hbChcIi8qXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwNTEsIDIwNTUpKSwgdGhpcy5zdGFyKHRoaXMuc2VxKHRoaXMubm90KHRoaXMudGVybWluYWwoXCIqL1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMDU4LCAyMDYyKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwNTcsIDIwNjIpKSwgdGhpcy5hcHAoXCJhbnlcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA2MywgMjA2NikpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMDU3LCAyMDY2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwNTYsIDIwNjgpKSwgdGhpcy50ZXJtaW5hbChcIiovXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIwNjksIDIwNzMpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA1MSwgMjA3MykpKVxuICAgIC5kZWZpbmUoXCJjb21tZW50XCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcImNvbW1lbnRfc2luZ2xlTGluZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMDA3LCAyMDI5KSksIHRoaXMuYXBwKFwiY29tbWVudF9tdWx0aUxpbmVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA1MSwgMjA3MykpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMDA3LCAyMDg3KSkpXG4gICAgLmRlZmluZShcInRva2Vuc1wiLCBbXSwgdGhpcy5zdGFyKHRoaXMuYXBwKFwidG9rZW5cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjEwMCwgMjEwNSkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTAwLCAyMTA2KSkpXG4gICAgLmRlZmluZShcInRva2VuXCIsIFtdLCB0aGlzLmFsdCh0aGlzLmFwcChcImNhc2VOYW1lXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIxMTgsIDIxMjYpKSwgdGhpcy5hcHAoXCJjb21tZW50XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIxMjksIDIxMzYpKSwgdGhpcy5hcHAoXCJpZGVudFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTM5LCAyMTQ0KSksIHRoaXMuYXBwKFwib3BlcmF0b3JcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE0NywgMjE1NSkpLCB0aGlzLmFwcChcInB1bmN0dWF0aW9uXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIxNTgsIDIxNjkpKSwgdGhpcy5hcHAoXCJ0ZXJtaW5hbFwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMTcyLCAyMTgwKSksIHRoaXMuYXBwKFwiYW55XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIxODMsIDIxODYpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjExOCwgMjE4NikpKVxuICAgIC5kZWZpbmUoXCJvcGVyYXRvclwiLCBbXSwgdGhpcy5hbHQodGhpcy50ZXJtaW5hbChcIjw6XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIyMDEsIDIyMDUpKSwgdGhpcy50ZXJtaW5hbChcIj1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjIwOCwgMjIxMSkpLCB0aGlzLnRlcm1pbmFsKFwiOj1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjIxNCwgMjIxOCkpLCB0aGlzLnRlcm1pbmFsKFwiKz1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjIyMSwgMjIyNSkpLCB0aGlzLnRlcm1pbmFsKFwiKlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMjI4LCAyMjMxKSksIHRoaXMudGVybWluYWwoXCIrXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIyMzQsIDIyMzcpKSwgdGhpcy50ZXJtaW5hbChcIj9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI0MCwgMjI0MykpLCB0aGlzLnRlcm1pbmFsKFwiflwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMjQ2LCAyMjQ5KSksIHRoaXMudGVybWluYWwoXCImXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIyNTIsIDIyNTUpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjIwMSwgMjI1NSkpKVxuICAgIC5kZWZpbmUoXCJwdW5jdHVhdGlvblwiLCBbXSwgdGhpcy5hbHQodGhpcy50ZXJtaW5hbChcIjxcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI3MywgMjI3NikpLCB0aGlzLnRlcm1pbmFsKFwiPlwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgyMjc5LCAyMjgyKSksIHRoaXMudGVybWluYWwoXCIsXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIyODUsIDIyODgpKSwgdGhpcy50ZXJtaW5hbChcIi0tXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDIyOTEsIDIyOTUpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjI3MywgMjI5NSkpKVxuICAgIC5idWlsZCgpO1xufSk7XG5cbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShmdW5jdGlvbigpIHtcbiAgdmFyIGRlY2wgPSB0aGlzLm5ld0dyYW1tYXIoXCJPcGVyYXRpb25zQW5kQXR0cmlidXRlc1wiKVxuICAgIC53aXRoU291cmNlKFwiT3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXMge1xcblxcbiAgQXR0cmlidXRlU2lnbmF0dXJlID1cXG4gICAgbmFtZVxcblxcbiAgT3BlcmF0aW9uU2lnbmF0dXJlID1cXG4gICAgbmFtZSBGb3JtYWxzP1xcblxcbiAgRm9ybWFsc1xcbiAgICA9IFxcXCIoXFxcIiBMaXN0T2Y8bmFtZSwgXFxcIixcXFwiPiBcXFwiKVxcXCJcXG5cXG4gIG5hbWUgIChhIG5hbWUpXFxuICAgID0gbmFtZUZpcnN0IG5hbWVSZXN0KlxcblxcbiAgbmFtZUZpcnN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgbGV0dGVyXFxuXFxuICBuYW1lUmVzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGFsbnVtXFxuXFxufVwiKVxuICAgIC53aXRoRGVmYXVsdFN0YXJ0UnVsZShcIkF0dHJpYnV0ZVNpZ25hdHVyZVwiKVxuICByZXR1cm4gZGVjbFxuICAgIC5kZWZpbmUoXCJBdHRyaWJ1dGVTaWduYXR1cmVcIiwgW10sIHRoaXMuYXBwKFwibmFtZVwiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg1NCwgNTgpKSlcbiAgICAuZGVmaW5lKFwiT3BlcmF0aW9uU2lnbmF0dXJlXCIsIFtdLCB0aGlzLnNlcSh0aGlzLmFwcChcIm5hbWVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoODcsIDkxKSksIHRoaXMub3B0KHRoaXMuYXBwKFwiRm9ybWFsc1wiKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg5MiwgOTkpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoOTIsIDEwMCkpKS53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCg4NywgMTAwKSkpXG4gICAgLmRlZmluZShcIkZvcm1hbHNcIiwgW10sIHRoaXMuc2VxKHRoaXMudGVybWluYWwoXCIoXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExOCwgMTIxKSksIHRoaXMuYXBwKFwiTGlzdE9mXCIsIFt0aGlzLmFwcChcIm5hbWVcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTI5LCAxMzMpKSwgdGhpcy50ZXJtaW5hbChcIixcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMTM1LCAxMzgpKV0pLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDEyMiwgMTM5KSksIHRoaXMudGVybWluYWwoXCIpXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE0MCwgMTQzKSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDExOCwgMTQzKSkpXG4gICAgLmRlZmluZShcIm5hbWVcIiwgW10sIHRoaXMuc2VxKHRoaXMuYXBwKFwibmFtZUZpcnN0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2OCwgMTc3KSksIHRoaXMuc3Rhcih0aGlzLmFwcChcIm5hbWVSZXN0XCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3OCwgMTg2KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE3OCwgMTg3KSkpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDE2OCwgMTg3KSksIFwiYSBuYW1lXCIpXG4gICAgLmRlZmluZShcIm5hbWVGaXJzdFwiLCBbXSwgdGhpcy5hbHQodGhpcy50ZXJtaW5hbChcIl9cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA3LCAyMTApKSwgdGhpcy5hcHAoXCJsZXR0ZXJcIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjE3LCAyMjMpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjA3LCAyMjMpKSlcbiAgICAuZGVmaW5lKFwibmFtZVJlc3RcIiwgW10sIHRoaXMuYWx0KHRoaXMudGVybWluYWwoXCJfXCIpLndpdGhJbnRlcnZhbChkZWNsLnNvdXJjZUludGVydmFsKDI0MiwgMjQ1KSksIHRoaXMuYXBwKFwiYWxudW1cIikud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjUyLCAyNTcpKSkud2l0aEludGVydmFsKGRlY2wuc291cmNlSW50ZXJ2YWwoMjQyLCAyNTcpKSlcbiAgICAuYnVpbGQoKTtcbn0pO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB0b0FTVDogcmVxdWlyZSgnLi9zZW1hbnRpY3MtdG9BU1QnKS5oZWxwZXIsXG4gIHNlbWFudGljc0ZvclRvQVNUOiByZXF1aXJlKCcuL3NlbWFudGljcy10b0FTVCcpLnNlbWFudGljc1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuLi9zcmMvcGV4cHJzJyk7XG52YXIgTWF0Y2hSZXN1bHQgPSByZXF1aXJlKCcuLi9zcmMvTWF0Y2hSZXN1bHQnKTtcbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi4vc3JjL0dyYW1tYXInKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGRlZmF1bHRPcGVyYXRpb24gPSB7XG4gIF90ZXJtaW5hbDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gIH0sXG5cbiAgX25vbnRlcm1pbmFsOiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgIHZhciBjdG9yTmFtZSA9IHRoaXMuX25vZGUuY3Rvck5hbWU7XG4gICAgdmFyIG1hcHBpbmcgPSB0aGlzLmFyZ3MubWFwcGluZztcblxuICAgIC8vIHdpdGhvdXQgY3VzdG9taXphdGlvblxuICAgIGlmICghbWFwcGluZy5oYXNPd25Qcm9wZXJ0eShjdG9yTmFtZSkpIHtcbiAgICAgIC8vIGludGVybWVkaWF0ZSBub2RlXG4gICAgICBpZiAodGhpcy5fbm9kZSBpbnN0YW5jZW9mIHBleHBycy5BbHQgfHwgdGhpcy5fbm9kZSBpbnN0YW5jZW9mIHBleHBycy5BcHBseSkge1xuICAgICAgICByZXR1cm4gY2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGxleGljYWwgcnVsZVxuICAgICAgaWYgKHRoaXMuaXNMZXhpY2FsKCkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7XG4gICAgICB9XG5cbiAgICAgIC8vIHNpbmd1bGFyIG5vZGUgKGUuZy4gb25seSBzdXJyb3VuZGVkIGJ5IGxpdGVyYWxzIG9yIGxvb2thaGVhZHMpXG4gICAgICB2YXIgcmVhbENoaWxkcmVuID0gY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiAhY2hpbGQuaXNUZXJtaW5hbCgpO1xuICAgICAgfSk7XG4gICAgICBpZiAocmVhbENoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmVhbENoaWxkcmVuWzBdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICAvLyByZXN0OiB0ZXJtcyB3aXRoIG11bHRpcGxlIGNoaWxkcmVuXG4gICAgfVxuXG4gICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICBpZiAodHlwZW9mIG1hcHBpbmdbY3Rvck5hbWVdID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGNoaWxkcmVuW21hcHBpbmdbY3Rvck5hbWVdXS50b0FTVChtYXBwaW5nKTtcbiAgICB9XG5cbiAgICAvLyBuYW1lZC9tYXBwZWQgY2hpbGRyZW4gb3IgdW5uYW1lZCBjaGlsZHJlbiAoJzAnLCAnMScsICcyJywgLi4uKVxuICAgIHZhciBwcm9wTWFwID0gbWFwcGluZ1tjdG9yTmFtZV0gfHwgY2hpbGRyZW47XG4gICAgdmFyIG5vZGUgPSB7XG4gICAgICB0eXBlOiBjdG9yTmFtZVxuICAgIH07XG4gICAgZm9yICh2YXIgcHJvcCBpbiBwcm9wTWFwKSB7XG4gICAgICB2YXIgbWFwcGVkUHJvcCA9IG1hcHBpbmdbY3Rvck5hbWVdICYmIG1hcHBpbmdbY3Rvck5hbWVdW3Byb3BdO1xuICAgICAgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgICAgICBub2RlW3Byb3BdID0gY2hpbGRyZW5bbWFwcGVkUHJvcF0udG9BU1QobWFwcGluZyk7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ3N0cmluZycpIHx8ICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ2Jvb2xlYW4nKSB8fFxuICAgICAgICAgIChtYXBwZWRQcm9wID09PSBudWxsKSkge1xuICAgICAgICAvLyBwcmltaXRpdmUgdmFsdWVcbiAgICAgICAgbm9kZVtwcm9wXSA9IG1hcHBlZFByb3A7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ29iamVjdCcpICYmIChtYXBwZWRQcm9wIGluc3RhbmNlb2YgTnVtYmVyKSkge1xuICAgICAgICAvLyBwcmltaXRpdmUgbnVtYmVyIChtdXN0IGJlIHVuYm94ZWQpXG4gICAgICAgIG5vZGVbcHJvcF0gPSBOdW1iZXIobWFwcGVkUHJvcCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGNvbXB1dGVkIHZhbHVlXG4gICAgICAgIG5vZGVbcHJvcF0gPSBtYXBwZWRQcm9wLmNhbGwodGhpcywgY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIGlmIChtYXBwZWRQcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGNoaWxkcmVuW3Byb3BdICYmICFjaGlsZHJlbltwcm9wXS5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgICBub2RlW3Byb3BdID0gY2hpbGRyZW5bcHJvcF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZGVsZXRlIHByZWRlZmluZWQgJ3R5cGUnIHByb3BlcnRpZXMsIGxpa2UgJ3R5cGUnLCBpZiBleHBsaWNpdGVseSByZW1vdmVkXG4gICAgICAgICAgZGVsZXRlIG5vZGVbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG5cbiAgX2l0ZXI6IGZ1bmN0aW9uKGNoaWxkcmVuKSB7XG4gICAgaWYgKHRoaXMuX25vZGUuaXNPcHRpb25hbCgpKSB7XG4gICAgICBpZiAodGhpcy5udW1DaGlsZHJlbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlblswXS50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmV0dXJuIGNoaWxkLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBOb25lbXB0eUxpc3RPZjogZnVuY3Rpb24oZmlyc3QsIHNlcCwgcmVzdCkge1xuICAgIHJldHVybiBbZmlyc3QudG9BU1QodGhpcy5hcmdzLm1hcHBpbmcpXS5jb25jYXQocmVzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZykpO1xuICB9LFxuXG4gIEVtcHR5TGlzdE9mOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn07XG5cbi8vIFJldHVybnMgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IGluY2x1ZGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIChBU1QpXG4vLyBmb3IgdGhlIGdpdmVuIG1hdGNoIHJlc3VsdCBgcmVzYCBjb250YWluZyBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIGFuZCBncmFtbWFyLlxuLy8gVGhlIG9wdGlvbmFsIGBtYXBwaW5nYCBwYXJhbWV0ZXIgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIGhvdyB0aGUgbm9kZXMgb2YgdGhlIENTVFxuLy8gYXJlIG1hcHBlZCB0byB0aGUgQVNUIChzZWUgL2RvYy9leHRyYXMubWQjdG9hc3RtYXRjaHJlc3VsdC1tYXBwaW5nKS5cbmZ1bmN0aW9uIHRvQVNUKHJlcywgbWFwcGluZykge1xuICBpZiAoIShyZXMgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkgfHwgcmVzLmZhaWxlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0b0FTVCgpIGV4cGVjdHMgYSBzdWNjZXNmdWxsIE1hdGNoUmVzdWx0IGFzIGZpcnN0IHBhcmFtZXRlcicpO1xuICB9XG5cbiAgbWFwcGluZyA9IGV4dGVuZCh7fSwgbWFwcGluZyk7XG4gIHZhciBvcGVyYXRpb24gPSBleHRlbmQoe30sIGRlZmF1bHRPcGVyYXRpb24pO1xuICBmb3IgKHZhciB0ZXJtTmFtZSBpbiBtYXBwaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBtYXBwaW5nW3Rlcm1OYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3BlcmF0aW9uW3Rlcm1OYW1lXSA9IG1hcHBpbmdbdGVybU5hbWVdO1xuICAgICAgZGVsZXRlIG1hcHBpbmdbdGVybU5hbWVdO1xuICAgIH1cbiAgfVxuICB2YXIgZyA9IHJlcy5fY3N0LmdyYW1tYXI7XG4gIHZhciBzID0gZy5zZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3RvQVNUKG1hcHBpbmcpJywgb3BlcmF0aW9uKTtcbiAgcmV0dXJuIHMocmVzKS50b0FTVChtYXBwaW5nKTtcbn1cblxuLy8gUmV0dXJucyBhIHNlbWFudGljcyBjb250YWluZyB0aGUgdG9BU1QobWFwcGluZykgb3BlcmF0aW9uIGZvciB0aGUgZ2l2ZW4gZ3JhbW1hciBnLlxuZnVuY3Rpb24gc2VtYW50aWNzRm9yVG9BU1QoZykge1xuICBpZiAoIShnIGluc3RhbmNlb2YgR3JhbW1hcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbWFudGljc1RvQVNUKCkgZXhwZWN0cyBhIEdyYW1tYXIgYXMgcGFyYW1ldGVyJyk7XG4gIH1cblxuICByZXR1cm4gZy5zZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3RvQVNUKG1hcHBpbmcpJywgZGVmYXVsdE9wZXJhdGlvbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBoZWxwZXI6IHRvQVNULFxuICBzZW1hbnRpY3M6IHNlbWFudGljc0ZvclRvQVNUXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpID8gU3ltYm9sIDogcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHN5bWJvbDtcblx0aWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblx0c3ltYm9sID0gU3ltYm9sKCd0ZXN0IHN5bWJvbCcpO1xuXHR0cnkgeyBTdHJpbmcoc3ltYm9sKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH1cblx0aWYgKHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09ICdzeW1ib2wnKSByZXR1cm4gdHJ1ZTtcblxuXHQvLyBSZXR1cm4gJ3RydWUnIGZvciBwb2x5ZmlsbHNcblx0aWYgKHR5cGVvZiBTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXHRpZiAodHlwZW9mIFN5bWJvbC5pdGVyYXRvciAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblx0aWYgKHR5cGVvZiBTeW1ib2wudG9QcmltaXRpdmUgIT09ICdvYmplY3QnKSByZXR1cm4gZmFsc2U7XG5cdGlmICh0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnICE9PSAnb2JqZWN0JykgcmV0dXJuIGZhbHNlO1xuXHRpZiAodHlwZW9mIFN5bWJvbC51bnNjb3BhYmxlcyAhPT0gJ29iamVjdCcpIHJldHVybiBmYWxzZTtcblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcblx0cmV0dXJuICh4ICYmICgodHlwZW9mIHggPT09ICdzeW1ib2wnKSB8fCAoeFsnQEB0b1N0cmluZ1RhZyddID09PSAnU3ltYm9sJykpKSB8fCBmYWxzZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gICAgICAgID0gcmVxdWlyZSgnZXM1LWV4dC9vYmplY3QvYXNzaWduJylcbiAgLCBub3JtYWxpemVPcHRzID0gcmVxdWlyZSgnZXM1LWV4dC9vYmplY3Qvbm9ybWFsaXplLW9wdGlvbnMnKVxuICAsIGlzQ2FsbGFibGUgICAgPSByZXF1aXJlKCdlczUtZXh0L29iamVjdC9pcy1jYWxsYWJsZScpXG4gICwgY29udGFpbnMgICAgICA9IHJlcXVpcmUoJ2VzNS1leHQvc3RyaW5nLyMvY29udGFpbnMnKVxuXG4gICwgZDtcblxuZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRzY3IsIHZhbHVlLyosIG9wdGlvbnMqLykge1xuXHR2YXIgYywgZSwgdywgb3B0aW9ucywgZGVzYztcblx0aWYgKChhcmd1bWVudHMubGVuZ3RoIDwgMikgfHwgKHR5cGVvZiBkc2NyICE9PSAnc3RyaW5nJykpIHtcblx0XHRvcHRpb25zID0gdmFsdWU7XG5cdFx0dmFsdWUgPSBkc2NyO1xuXHRcdGRzY3IgPSBudWxsO1xuXHR9IGVsc2Uge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG5cdH1cblx0aWYgKGRzY3IgPT0gbnVsbCkge1xuXHRcdGMgPSB3ID0gdHJ1ZTtcblx0XHRlID0gZmFsc2U7XG5cdH0gZWxzZSB7XG5cdFx0YyA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ2MnKTtcblx0XHRlID0gY29udGFpbnMuY2FsbChkc2NyLCAnZScpO1xuXHRcdHcgPSBjb250YWlucy5jYWxsKGRzY3IsICd3Jyk7XG5cdH1cblxuXHRkZXNjID0geyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogYywgZW51bWVyYWJsZTogZSwgd3JpdGFibGU6IHcgfTtcblx0cmV0dXJuICFvcHRpb25zID8gZGVzYyA6IGFzc2lnbihub3JtYWxpemVPcHRzKG9wdGlvbnMpLCBkZXNjKTtcbn07XG5cbmQuZ3MgPSBmdW5jdGlvbiAoZHNjciwgZ2V0LCBzZXQvKiwgb3B0aW9ucyovKSB7XG5cdHZhciBjLCBlLCBvcHRpb25zLCBkZXNjO1xuXHRpZiAodHlwZW9mIGRzY3IgIT09ICdzdHJpbmcnKSB7XG5cdFx0b3B0aW9ucyA9IHNldDtcblx0XHRzZXQgPSBnZXQ7XG5cdFx0Z2V0ID0gZHNjcjtcblx0XHRkc2NyID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzWzNdO1xuXHR9XG5cdGlmIChnZXQgPT0gbnVsbCkge1xuXHRcdGdldCA9IHVuZGVmaW5lZDtcblx0fSBlbHNlIGlmICghaXNDYWxsYWJsZShnZXQpKSB7XG5cdFx0b3B0aW9ucyA9IGdldDtcblx0XHRnZXQgPSBzZXQgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoc2V0ID09IG51bGwpIHtcblx0XHRzZXQgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoIWlzQ2FsbGFibGUoc2V0KSkge1xuXHRcdG9wdGlvbnMgPSBzZXQ7XG5cdFx0c2V0ID0gdW5kZWZpbmVkO1xuXHR9XG5cdGlmIChkc2NyID09IG51bGwpIHtcblx0XHRjID0gdHJ1ZTtcblx0XHRlID0gZmFsc2U7XG5cdH0gZWxzZSB7XG5cdFx0YyA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ2MnKTtcblx0XHRlID0gY29udGFpbnMuY2FsbChkc2NyLCAnZScpO1xuXHR9XG5cblx0ZGVzYyA9IHsgZ2V0OiBnZXQsIHNldDogc2V0LCBjb25maWd1cmFibGU6IGMsIGVudW1lcmFibGU6IGUgfTtcblx0cmV0dXJuICFvcHRpb25zID8gZGVzYyA6IGFzc2lnbihub3JtYWxpemVPcHRzKG9wdGlvbnMpLCBkZXNjKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pcy1pbXBsZW1lbnRlZCcpKClcblx0PyBPYmplY3QuYXNzaWduXG5cdDogcmVxdWlyZSgnLi9zaGltJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYXNzaWduID0gT2JqZWN0LmFzc2lnbiwgb2JqO1xuXHRpZiAodHlwZW9mIGFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXHRvYmogPSB7IGZvbzogJ3JheicgfTtcblx0YXNzaWduKG9iaiwgeyBiYXI6ICdkd2EnIH0sIHsgdHJ6eTogJ3RyenknIH0pO1xuXHRyZXR1cm4gKG9iai5mb28gKyBvYmouYmFyICsgb2JqLnRyenkpID09PSAncmF6ZHdhdHJ6eSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5cyAgPSByZXF1aXJlKCcuLi9rZXlzJylcbiAgLCB2YWx1ZSA9IHJlcXVpcmUoJy4uL3ZhbGlkLXZhbHVlJylcblxuICAsIG1heCA9IE1hdGgubWF4O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkZXN0LCBzcmMvKiwg4oCmc3JjbiovKSB7XG5cdHZhciBlcnJvciwgaSwgbCA9IG1heChhcmd1bWVudHMubGVuZ3RoLCAyKSwgYXNzaWduO1xuXHRkZXN0ID0gT2JqZWN0KHZhbHVlKGRlc3QpKTtcblx0YXNzaWduID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdHRyeSB7IGRlc3Rba2V5XSA9IHNyY1trZXldOyB9IGNhdGNoIChlKSB7XG5cdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGU7XG5cdFx0fVxuXHR9O1xuXHRmb3IgKGkgPSAxOyBpIDwgbDsgKytpKSB7XG5cdFx0c3JjID0gYXJndW1lbnRzW2ldO1xuXHRcdGtleXMoc3JjKS5mb3JFYWNoKGFzc2lnbik7XG5cdH1cblx0aWYgKGVycm9yICE9PSB1bmRlZmluZWQpIHRocm93IGVycm9yO1xuXHRyZXR1cm4gZGVzdDtcbn07XG4iLCIvLyBEZXByZWNhdGVkXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpXG5cdD8gT2JqZWN0LmtleXNcblx0OiByZXF1aXJlKCcuL3NoaW0nKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmtleXMoJ3ByaW1pdGl2ZScpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtleXMgPSBPYmplY3Qua2V5cztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cdHJldHVybiBrZXlzKG9iamVjdCA9PSBudWxsID8gb2JqZWN0IDogT2JqZWN0KG9iamVjdCkpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCwgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxudmFyIHByb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBvYmopIHtcblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gc3JjKSBvYmpba2V5XSA9IHNyY1trZXldO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucy8qLCDigKZvcHRpb25zKi8pIHtcblx0dmFyIHJlc3VsdCA9IGNyZWF0ZShudWxsKTtcblx0Zm9yRWFjaC5jYWxsKGFyZ3VtZW50cywgZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRpZiAob3B0aW9ucyA9PSBudWxsKSByZXR1cm47XG5cdFx0cHJvY2VzcyhPYmplY3Qob3B0aW9ucyksIHJlc3VsdCk7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0aWYgKHZhbHVlID09IG51bGwpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpXG5cdD8gU3RyaW5nLnByb3RvdHlwZS5jb250YWluc1xuXHQ6IHJlcXVpcmUoJy4vc2hpbScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyID0gJ3JhemR3YXRyenknO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKHR5cGVvZiBzdHIuY29udGFpbnMgIT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblx0cmV0dXJuICgoc3RyLmNvbnRhaW5zKCdkd2EnKSA9PT0gdHJ1ZSkgJiYgKHN0ci5jb250YWlucygnZm9vJykgPT09IGZhbHNlKSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VhcmNoU3RyaW5nLyosIHBvc2l0aW9uKi8pIHtcblx0cmV0dXJuIGluZGV4T2YuY2FsbCh0aGlzLCBzZWFyY2hTdHJpbmcsIGFyZ3VtZW50c1sxXSkgPiAtMTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBkICAgICAgICAgICAgICA9IHJlcXVpcmUoJ2QnKVxuICAsIHZhbGlkYXRlU3ltYm9sID0gcmVxdWlyZSgnLi92YWxpZGF0ZS1zeW1ib2wnKVxuXG4gICwgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSwgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gICwgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksIG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGVcbiAgLCBTeW1ib2wsIEhpZGRlblN5bWJvbCwgZ2xvYmFsU3ltYm9scyA9IGNyZWF0ZShudWxsKTtcblxudmFyIGdlbmVyYXRlTmFtZSA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciBjcmVhdGVkID0gY3JlYXRlKG51bGwpO1xuXHRyZXR1cm4gZnVuY3Rpb24gKGRlc2MpIHtcblx0XHR2YXIgcG9zdGZpeCA9IDAsIG5hbWU7XG5cdFx0d2hpbGUgKGNyZWF0ZWRbZGVzYyArIChwb3N0Zml4IHx8ICcnKV0pICsrcG9zdGZpeDtcblx0XHRkZXNjICs9IChwb3N0Zml4IHx8ICcnKTtcblx0XHRjcmVhdGVkW2Rlc2NdID0gdHJ1ZTtcblx0XHRuYW1lID0gJ0BAJyArIGRlc2M7XG5cdFx0ZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCBkLmdzKG51bGwsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0ZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgZCh2YWx1ZSkpO1xuXHRcdH0pKTtcblx0XHRyZXR1cm4gbmFtZTtcblx0fTtcbn0oKSk7XG5cbkhpZGRlblN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuXHRpZiAodGhpcyBpbnN0YW5jZW9mIEhpZGRlblN5bWJvbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0cmV0dXJuIFN5bWJvbChkZXNjcmlwdGlvbik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcblx0dmFyIHN5bWJvbDtcblx0aWYgKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cdHN5bWJvbCA9IGNyZWF0ZShIaWRkZW5TeW1ib2wucHJvdG90eXBlKTtcblx0ZGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKSk7XG5cdHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzKHN5bWJvbCwge1xuXHRcdF9fZGVzY3JpcHRpb25fXzogZCgnJywgZGVzY3JpcHRpb24pLFxuXHRcdF9fbmFtZV9fOiBkKCcnLCBnZW5lcmF0ZU5hbWUoZGVzY3JpcHRpb24pKVxuXHR9KTtcbn07XG5kZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbCwge1xuXHRmb3I6IGQoZnVuY3Rpb24gKGtleSkge1xuXHRcdGlmIChnbG9iYWxTeW1ib2xzW2tleV0pIHJldHVybiBnbG9iYWxTeW1ib2xzW2tleV07XG5cdFx0cmV0dXJuIChnbG9iYWxTeW1ib2xzW2tleV0gPSBTeW1ib2woU3RyaW5nKGtleSkpKTtcblx0fSksXG5cdGtleUZvcjogZChmdW5jdGlvbiAocykge1xuXHRcdHZhciBrZXk7XG5cdFx0dmFsaWRhdGVTeW1ib2wocyk7XG5cdFx0Zm9yIChrZXkgaW4gZ2xvYmFsU3ltYm9scykgaWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gcykgcmV0dXJuIGtleTtcblx0fSksXG5cdGhhc0luc3RhbmNlOiBkKCcnLCBTeW1ib2woJ2hhc0luc3RhbmNlJykpLFxuXHRpc0NvbmNhdFNwcmVhZGFibGU6IGQoJycsIFN5bWJvbCgnaXNDb25jYXRTcHJlYWRhYmxlJykpLFxuXHRpdGVyYXRvcjogZCgnJywgU3ltYm9sKCdpdGVyYXRvcicpKSxcblx0bWF0Y2g6IGQoJycsIFN5bWJvbCgnbWF0Y2gnKSksXG5cdHJlcGxhY2U6IGQoJycsIFN5bWJvbCgncmVwbGFjZScpKSxcblx0c2VhcmNoOiBkKCcnLCBTeW1ib2woJ3NlYXJjaCcpKSxcblx0c3BlY2llczogZCgnJywgU3ltYm9sKCdzcGVjaWVzJykpLFxuXHRzcGxpdDogZCgnJywgU3ltYm9sKCdzcGxpdCcpKSxcblx0dG9QcmltaXRpdmU6IGQoJycsIFN5bWJvbCgndG9QcmltaXRpdmUnKSksXG5cdHRvU3RyaW5nVGFnOiBkKCcnLCBTeW1ib2woJ3RvU3RyaW5nVGFnJykpLFxuXHR1bnNjb3BhYmxlczogZCgnJywgU3ltYm9sKCd1bnNjb3BhYmxlcycpKVxufSk7XG5kZWZpbmVQcm9wZXJ0aWVzKEhpZGRlblN5bWJvbC5wcm90b3R5cGUsIHtcblx0Y29uc3RydWN0b3I6IGQoU3ltYm9sKSxcblx0dG9TdHJpbmc6IGQoJycsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX19uYW1lX187IH0pXG59KTtcblxuZGVmaW5lUHJvcGVydGllcyhTeW1ib2wucHJvdG90eXBlLCB7XG5cdHRvU3RyaW5nOiBkKGZ1bmN0aW9uICgpIHsgcmV0dXJuICdTeW1ib2wgKCcgKyB2YWxpZGF0ZVN5bWJvbCh0aGlzKS5fX2Rlc2NyaXB0aW9uX18gKyAnKSc7IH0pLFxuXHR2YWx1ZU9mOiBkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpOyB9KVxufSk7XG5kZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCBTeW1ib2wudG9QcmltaXRpdmUsIGQoJycsXG5cdGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbGlkYXRlU3ltYm9sKHRoaXMpOyB9KSk7XG5kZWZpbmVQcm9wZXJ0eShTeW1ib2wucHJvdG90eXBlLCBTeW1ib2wudG9TdHJpbmdUYWcsIGQoJ2MnLCAnU3ltYm9sJykpO1xuXG5kZWZpbmVQcm9wZXJ0eShIaWRkZW5TeW1ib2wucHJvdG90eXBlLCBTeW1ib2wudG9QcmltaXRpdmUsXG5cdGQoJ2MnLCBTeW1ib2wucHJvdG90eXBlW1N5bWJvbC50b1ByaW1pdGl2ZV0pKTtcbmRlZmluZVByb3BlcnR5KEhpZGRlblN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbC50b1N0cmluZ1RhZyxcblx0ZCgnYycsIFN5bWJvbC5wcm90b3R5cGVbU3ltYm9sLnRvU3RyaW5nVGFnXSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzLXN5bWJvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAoIWlzU3ltYm9sKHZhbHVlKSkgdGhyb3cgbmV3IFR5cGVFcnJvcih2YWx1ZSArIFwiIGlzIG5vdCBhIHN5bWJvbFwiKTtcblx0cmV0dXJuIHZhbHVlO1xufTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyoqXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIEJ1ZmZlclxuICpcbiAqIEF1dGhvcjogICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogTGljZW5zZTogIE1JVFxuICpcbiAqIGBucG0gaW5zdGFsbCBpcy1idWZmZXJgXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiAhIShcbiAgICBvYmogIT0gbnVsbCAmJlxuICAgIG9iai5jb25zdHJ1Y3RvciAmJlxuICAgIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxuICApXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5mdW5jdGlvbiBleHRlbmQob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0JykgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyRGVjbCA9IHJlcXVpcmUoJy4vR3JhbW1hckRlY2wnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gQnVpbGRlcigpIHt9XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBuZXdHcmFtbWFyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgfSxcblxuICB0ZXJtaW5hbDogZnVuY3Rpb24oeCkge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlRlcm1pbmFsKHgpO1xuICB9LFxuXG4gIHJhbmdlOiBmdW5jdGlvbihmcm9tLCB0bykge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlJhbmdlKGZyb20sIHRvKTtcbiAgfSxcblxuICBwYXJhbTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gIH0sXG5cbiAgYWx0OiBmdW5jdGlvbigvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgIHZhciB0ZXJtcyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLkFsdCkge1xuICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVybXMubGVuZ3RoID09PSAxID8gdGVybXNbMF0gOiBuZXcgcGV4cHJzLkFsdCh0ZXJtcyk7XG4gIH0sXG5cbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICBmYWN0b3JzID0gZmFjdG9ycy5jb25jYXQoYXJnLmZhY3RvcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWN0b3JzLmxlbmd0aCA9PT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgcGV4cHJzLlNlcShmYWN0b3JzKTtcbiAgfSxcblxuICBzdGFyOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuU3RhcihleHByKTtcbiAgfSxcblxuICBwbHVzOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUGx1cyhleHByKTtcbiAgfSxcblxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5PcHQoZXhwcik7XG4gIH0sXG5cbiAgbm90OiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTm90KGV4cHIpO1xuICB9LFxuXG4gIGxhOiBmdW5jdGlvbihleHByKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTG9va2FoZWFkKGV4cHIpO1xuICB9LFxuXG4gIGxleDogZnVuY3Rpb24oZXhwcikge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkxleChleHByKTtcbiAgfSxcblxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBvcHRQYXJhbXMpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5BcHBseShydWxlTmFtZSwgb3B0UGFyYW1zKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIGBGYWlsdXJlYHMgcmVwcmVzZW50IGV4cHJlc3Npb25zIHRoYXQgd2VyZW4ndCBtYXRjaGVkIHdoaWxlIHBhcnNpbmcuIFRoZXkgYXJlIHVzZWQgdG8gZ2VuZXJhdGVcbiAgZXJyb3IgbWVzc2FnZXMgYXV0b21hdGljYWxseS4gVGhlIGludGVyZmFjZSBvZiBgRmFpbHVyZWBzIGluY2x1ZGVzIHRoZSBjb2xsb3dpbmcgbWV0aG9kczpcblxuICAtIGdldFRleHQoKSA6IFN0cmluZ1xuICAtIGdldFR5cGUoKSA6IFN0cmluZyAgKG9uZSBvZiB7XCJkZXNjcmlwdGlvblwiLCBcInN0cmluZ1wiLCBcImNvZGVcIn0pXG4gIC0gaXNEZXNjcmlwdGlvbigpIDogYm9vbFxuICAtIGlzU3RyaW5nVGVybWluYWwoKSA6IGJvb2xcbiAgLSBpc0NvZGUoKSA6IGJvb2xcbiAgLSBpc0ZsdWZmeSgpIDogYm9vbFxuICAtIG1ha2VGbHVmZnkoKSA6IHZvaWRcbiAgLSBzdWJzdW1lcyhGYWlsdXJlKSA6IGJvb2xcbiovXG5cbmZ1bmN0aW9uIGlzVmFsaWRUeXBlKHR5cGUpIHtcbiAgcmV0dXJuIHR5cGUgPT09ICdkZXNjcmlwdGlvbicgfHwgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ2NvZGUnO1xufVxuXG5mdW5jdGlvbiBGYWlsdXJlKHRleHQsIHR5cGUpIHtcbiAgaWYgKCFpc1ZhbGlkVHlwZSh0eXBlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBGYWlsdXJlIHR5cGU6ICcgKyB0eXBlKTtcbiAgfVxuXG4gIHRoaXMudGV4dCA9IHRleHQ7XG4gIHRoaXMudHlwZSA9IHR5cGU7XG4gIHRoaXMuZmx1ZmZ5ID0gZmFsc2U7XG59XG5cbkZhaWx1cmUucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudGV4dDtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmlzRGVzY3JpcHRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJztcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmlzU3RyaW5nVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZyc7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5pc0NvZGUgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2NvZGUnO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuaXNGbHVmZnkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZmx1ZmZ5O1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUubWFrZUZsdWZmeSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmZsdWZmeSA9IHRydWU7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5jbGVhckZsdWZmeSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmZsdWZmeSA9IGZhbHNlO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuc3Vic3VtZXMgPSBmdW5jdGlvbih0aGF0KSB7XG4gIHJldHVybiB0aGlzLmdldFRleHQoKSA9PT0gdGhhdC5nZXRUZXh0KCkgJiZcbiAgICAgIHRoaXMudHlwZSA9PT0gdGhhdC50eXBlICYmXG4gICAgICAoIXRoaXMuaXNGbHVmZnkoKSB8fCB0aGlzLmlzRmx1ZmZ5KCkgJiYgdGhhdC5pc0ZsdWZmeSgpKTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdzdHJpbmcnID9cbiAgICBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFRleHQoKSkgOlxuICAgIHRoaXMuZ2V0VGV4dCgpO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGZhaWx1cmUgPSBuZXcgRmFpbHVyZSh0aGlzLnRleHQsIHRoaXMudHlwZSk7XG4gIGlmICh0aGlzLmlzRmx1ZmZ5KCkpIHtcbiAgICBmYWlsdXJlLm1ha2VGbHVmZnkoKTtcbiAgfVxuICByZXR1cm4gZmFpbHVyZTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLnRvS2V5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCkgKyAnIycgKyB0aGlzLnR5cGU7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBGYWlsdXJlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIFNlbWFudGljcyA9IHJlcXVpcmUoJy4vU2VtYW50aWNzJyk7XG52YXIgU3RhdGUgPSByZXF1aXJlKCcuL1N0YXRlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBHcmFtbWFyKFxuICAgIG5hbWUsXG4gICAgc3VwZXJHcmFtbWFyLFxuICAgIHJ1bGVCb2RpZXMsXG4gICAgcnVsZUZvcm1hbHMsXG4gICAgcnVsZURlc2NyaXB0aW9ucyxcbiAgICBvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLnJ1bGVCb2RpZXMgPSBydWxlQm9kaWVzO1xuICB0aGlzLnJ1bGVGb3JtYWxzID0gcnVsZUZvcm1hbHM7XG4gIHRoaXMucnVsZURlc2NyaXB0aW9ucyA9IHJ1bGVEZXNjcmlwdGlvbnM7XG4gIGlmIChvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgaWYgKCEob3B0RGVmYXVsdFN0YXJ0UnVsZSBpbiBydWxlQm9kaWVzKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdGFydCBydWxlOiAnXCIgKyBvcHREZWZhdWx0U3RhcnRSdWxlICtcbiAgICAgICAgICAgICAgICAgICAgICBcIicgaXMgbm90IGEgcnVsZSBpbiBncmFtbWFyICdcIiArIG5hbWUgKyBcIidcIik7XG4gICAgfVxuICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IG9wdERlZmF1bHRTdGFydFJ1bGU7XG4gIH1cbn1cblxudmFyIG9obUdyYW1tYXI7XG52YXIgYnVpbGRHcmFtbWFyO1xuXG4vLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBtYWluLmpzIG9uY2UgT2htIGhhcyBsb2FkZWQuXG5HcmFtbWFyLmluaXRBcHBsaWNhdGlvblBhcnNlciA9IGZ1bmN0aW9uKGdyYW1tYXIsIGJ1aWxkZXJGbikge1xuICBvaG1HcmFtbWFyID0gZ3JhbW1hcjtcbiAgYnVpbGRHcmFtbWFyID0gYnVpbGRlckZuO1xufTtcblxuR3JhbW1hci5wcm90b3R5cGUgPSB7XG4gIC8vIFJldHVybiB0cnVlIGlmIHRoZSBncmFtbWFyIGlzIGEgYnVpbHQtaW4gZ3JhbW1hciwgb3RoZXJ3aXNlIGZhbHNlLlxuICAvLyBOT1RFOiBUaGlzIG1pZ2h0IGdpdmUgYW4gdW5leHBlY3RlZCByZXN1bHQgaWYgY2FsbGVkIGJlZm9yZSBCdWlsdEluUnVsZXMgaXMgZGVmaW5lZCFcbiAgaXNCdWlsdEluOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcyA9PT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyB8fCB0aGlzID09PSBHcmFtbWFyLkJ1aWx0SW5SdWxlcztcbiAgfSxcblxuICBfbWF0Y2g6IGZ1bmN0aW9uKGlucHV0LCBvcHRzKSB7XG4gICAgdmFyIHN0YXRlID0gbmV3IFN0YXRlKHRoaXMsIGlucHV0LCBvcHRzKTtcbiAgICBzdGF0ZS5ldmFsRnJvbVN0YXJ0KCk7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX21hdGNoKGlucHV0LCB7c3RhcnRBcHBsaWNhdGlvbjogb3B0U3RhcnRBcHBsaWNhdGlvbn0pO1xuICAgIHJldHVybiBNYXRjaFJlc3VsdC5uZXdGb3Ioc3RhdGUpO1xuICB9LFxuXG4gIHRyYWNlOiBmdW5jdGlvbihpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuX21hdGNoKGlucHV0LCB7c3RhcnRBcHBsaWNhdGlvbjogb3B0U3RhcnRBcHBsaWNhdGlvbiwgdHJhY2U6IHRydWV9KTtcblxuICAgIC8vIFRoZSB0cmFjZSBub2RlIGZvciB0aGUgc3RhcnQgcnVsZSBpcyBhbHdheXMgdGhlIGxhc3QgZW50cnkuIElmIGl0IGlzIGEgc3ludGFjdGljIHJ1bGUsXG4gICAgLy8gdGhlIGZpcnN0IGVudHJ5IGlzIGZvciBhbiBhcHBsaWNhdGlvbiBvZiAnc3BhY2VzJy5cbiAgICAvLyBUT0RPKHBkdWJyb3kpOiBDbGVhbiB0aGlzIHVwIGJ5IGludHJvZHVjaW5nIGEgc3BlY2lhbCBgTWF0Y2g8c3RhcnRBcHBsPmAgcnVsZSwgd2hpY2ggd2lsbFxuICAgIC8vIGVuc3VyZSB0aGF0IHRoZXJlIGlzIGFsd2F5cyBhIHNpbmdsZSByb290IHRyYWNlIG5vZGUuXG4gICAgdmFyIHJvb3RUcmFjZSA9IHN0YXRlLnRyYWNlW3N0YXRlLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgIHJvb3RUcmFjZS5zdGF0ZSA9IHN0YXRlO1xuICAgIHJvb3RUcmFjZS5yZXN1bHQgPSBNYXRjaFJlc3VsdC5uZXdGb3Ioc3RhdGUpO1xuICAgIHJldHVybiByb290VHJhY2U7XG4gIH0sXG5cbiAgc2VtYW50aWNzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzKTtcbiAgfSxcblxuICBleHRlbmRTZW1hbnRpY3M6IGZ1bmN0aW9uKHN1cGVyU2VtYW50aWNzKSB7XG4gICAgcmV0dXJuIFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3ModGhpcywgc3VwZXJTZW1hbnRpY3MuX2dldFNlbWFudGljcygpKTtcbiAgfSxcblxuICAvLyBDaGVjayB0aGF0IGV2ZXJ5IGtleSBpbiBgYWN0aW9uRGljdGAgY29ycmVzcG9uZHMgdG8gYSBzZW1hbnRpYyBhY3Rpb24sIGFuZCB0aGF0IGl0IG1hcHMgdG9cbiAgLy8gYSBmdW5jdGlvbiBvZiB0aGUgY29ycmVjdCBhcml0eS4gSWYgbm90LCB0aHJvdyBhbiBleGNlcHRpb24uXG4gIF9jaGVja1RvcERvd25BY3Rpb25EaWN0OiBmdW5jdGlvbih3aGF0LCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgZnVuY3Rpb24gaXNTcGVjaWFsQWN0aW9uKGEpIHtcbiAgICAgIHJldHVybiBhID09PSAnX2l0ZXInIHx8IGEgPT09ICdfdGVybWluYWwnIHx8IGEgPT09ICdfbm9udGVybWluYWwnIHx8IGEgPT09ICdfZGVmYXVsdCc7XG4gICAgfVxuXG4gICAgdmFyIHByb2JsZW1zID0gW107XG4gICAgZm9yICh2YXIgayBpbiBhY3Rpb25EaWN0KSB7XG4gICAgICB2YXIgdiA9IGFjdGlvbkRpY3Rba107XG4gICAgICBpZiAoIWlzU3BlY2lhbEFjdGlvbihrKSAmJiAhKGsgaW4gdGhpcy5ydWxlQm9kaWVzKSkge1xuICAgICAgICBwcm9ibGVtcy5wdXNoKFwiJ1wiICsgayArIFwiJyBpcyBub3QgYSB2YWxpZCBzZW1hbnRpYyBhY3Rpb24gZm9yICdcIiArIHRoaXMubmFtZSArIFwiJ1wiKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHYgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcHJvYmxlbXMucHVzaChcbiAgICAgICAgICAgIFwiJ1wiICsgayArIFwiJyBtdXN0IGJlIGEgZnVuY3Rpb24gaW4gYW4gYWN0aW9uIGRpY3Rpb25hcnkgZm9yICdcIiArIHRoaXMubmFtZSArIFwiJ1wiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBhY3R1YWwgPSB2Lmxlbmd0aDtcbiAgICAgICAgdmFyIGV4cGVjdGVkID0gdGhpcy5fdG9wRG93bkFjdGlvbkFyaXR5KGspO1xuICAgICAgICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgICAgICAgIHByb2JsZW1zLnB1c2goXG4gICAgICAgICAgICAgIFwiU2VtYW50aWMgYWN0aW9uICdcIiArIGsgKyBcIicgaGFzIHRoZSB3cm9uZyBhcml0eTogXCIgK1xuICAgICAgICAgICAgICAnZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChwcm9ibGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgcHJldHR5UHJvYmxlbXMgPSBwcm9ibGVtcy5tYXAoZnVuY3Rpb24ocHJvYmxlbSkgeyByZXR1cm4gJy0gJyArIHByb2JsZW07IH0pO1xuICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKFxuICAgICAgICAgIFwiRm91bmQgZXJyb3JzIGluIHRoZSBhY3Rpb24gZGljdGlvbmFyeSBvZiB0aGUgJ1wiICsgbmFtZSArIFwiJyBcIiArIHdoYXQgKyAnOlxcbicgK1xuICAgICAgICAgIHByZXR0eVByb2JsZW1zLmpvaW4oJ1xcbicpKTtcbiAgICAgIGVycm9yLnByb2JsZW1zID0gcHJvYmxlbXM7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0sXG5cbiAgLy8gUmV0dXJuIHRoZSBleHBlY3RlZCBhcml0eSBmb3IgYSBzZW1hbnRpYyBhY3Rpb24gbmFtZWQgYGFjdGlvbk5hbWVgLCB3aGljaFxuICAvLyBpcyBlaXRoZXIgYSBydWxlIG5hbWUgb3IgYSBzcGVjaWFsIGFjdGlvbiBuYW1lIGxpa2UgJ19ub250ZXJtaW5hbCcuXG4gIF90b3BEb3duQWN0aW9uQXJpdHk6IGZ1bmN0aW9uKGFjdGlvbk5hbWUpIHtcbiAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ19pdGVyJyB8fCBhY3Rpb25OYW1lID09PSAnX25vbnRlcm1pbmFsJyB8fCBhY3Rpb25OYW1lID09PSAnX2RlZmF1bHQnKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdfdGVybWluYWwnKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucnVsZUJvZGllc1thY3Rpb25OYW1lXS5nZXRBcml0eSgpO1xuICB9LFxuXG4gIF9pbmhlcml0c0Zyb206IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgICB2YXIgZyA9IHRoaXMuc3VwZXJHcmFtbWFyO1xuICAgIHdoaWxlIChnKSB7XG4gICAgICBpZiAoZyA9PT0gZ3JhbW1hcikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGcgPSBnLnN1cGVyR3JhbW1hcjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHRvUmVjaXBlOiBmdW5jdGlvbihvcHRWYXJOYW1lKSB7XG4gICAgaWYgKHRoaXMuaXNCdWlsdEluKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnV2h5IHdvdWxkIGFueW9uZSB3YW50IHRvIGdlbmVyYXRlIGEgcmVjaXBlIGZvciB0aGUgJyArIHRoaXMubmFtZSArICcgZ3JhbW1hcj8hPyEnKTtcbiAgICB9XG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICBpZiAob3B0VmFyTmFtZSkge1xuICAgICAgc2IuYXBwZW5kKCd2YXIgJyArIG9wdFZhck5hbWUgKyAnID0gJyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZCgnKGZ1bmN0aW9uKCkge1xcbicpO1xuXG4gICAgLy8gSW5jbHVkZSB0aGUgc3VwZXJncmFtbWFyIGluIHRoZSByZWNpcGUgaWYgaXQncyBub3QgYSBidWlsdC1pbiBncmFtbWFyLlxuICAgIHZhciBzdXBlckdyYW1tYXJEZWNsID0gJyc7XG4gICAgaWYgKCF0aGlzLnN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgICAgc2IuYXBwZW5kKHRoaXMuc3VwZXJHcmFtbWFyLnRvUmVjaXBlKCdidWlsZFN1cGVyR3JhbW1hcicpKTtcbiAgICAgIHN1cGVyR3JhbW1hckRlY2wgPSAnICAgIC53aXRoU3VwZXJHcmFtbWFyKGJ1aWxkU3VwZXJHcmFtbWFyLmNhbGwodGhpcykpXFxuJztcbiAgICB9XG4gICAgc2IuYXBwZW5kKCcgIHZhciBkZWNsID0gdGhpcy5uZXdHcmFtbWFyKCcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLm5hbWUpICsgJylcXG4nKTtcblxuICAgIC8vIEluY2x1ZGUgdGhlIGdyYW1tYXIgc291cmNlIGlmIGl0IGlzIGF2YWlsYWJsZS5cbiAgICBpZiAodGhpcy5kZWZpbml0aW9uSW50ZXJ2YWwpIHtcbiAgICAgIHNiLmFwcGVuZCgnICAgIC53aXRoU291cmNlKCcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmRlZmluaXRpb25JbnRlcnZhbC5jb250ZW50cykgKyAnKVxcbicpO1xuICAgIH1cbiAgICBzYi5hcHBlbmQoc3VwZXJHcmFtbWFyRGVjbCk7XG5cbiAgICBpZiAodGhpcy5kZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICBzYi5hcHBlbmQoJyAgICAud2l0aERlZmF1bHRTdGFydFJ1bGUoXCInICsgdGhpcy5kZWZhdWx0U3RhcnRSdWxlICsgJ1wiKVxcbicpO1xuICAgIH1cbiAgICBzYi5hcHBlbmQoJyAgcmV0dXJuIGRlY2xcXG4nKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJ1bGVCb2RpZXMpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBib2R5ID0gc2VsZi5ydWxlQm9kaWVzW3J1bGVOYW1lXTtcbiAgICAgIHNiLmFwcGVuZCgnICAgIC4nKTtcbiAgICAgIGlmIChzZWxmLnN1cGVyR3JhbW1hci5ydWxlQm9kaWVzW3J1bGVOYW1lXSkge1xuICAgICAgICBzYi5hcHBlbmQoYm9keSBpbnN0YW5jZW9mIHBleHBycy5FeHRlbmQgPyAnZXh0ZW5kJyA6ICdvdmVycmlkZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2IuYXBwZW5kKCdkZWZpbmUnKTtcbiAgICAgIH1cbiAgICAgIHZhciBmb3JtYWxzID0gc2VsZi5ydWxlRm9ybWFsc1tydWxlTmFtZV07XG4gICAgICB2YXIgZm9ybWFsc1N0cmluZyA9ICdbJyArIGZvcm1hbHMubWFwKEpTT04uc3RyaW5naWZ5KS5qb2luKCcsICcpICsgJ10nO1xuICAgICAgc2IuYXBwZW5kKCcoJyArIEpTT04uc3RyaW5naWZ5KHJ1bGVOYW1lKSArICcsICcgKyBmb3JtYWxzU3RyaW5nICsgJywgJyk7XG4gICAgICBib2R5Lm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgc2VsZi5kZWZpbml0aW9uSW50ZXJ2YWwpO1xuXG4gICAgICBpZiAoIXNlbGYuc3VwZXJHcmFtbWFyLnJ1bGVCb2RpZXNbcnVsZU5hbWVdICYmIHNlbGYucnVsZURlc2NyaXB0aW9uc1tydWxlTmFtZV0pIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsICcgKyBKU09OLnN0cmluZ2lmeShzZWxmLnJ1bGVEZXNjcmlwdGlvbnNbcnVsZU5hbWVdKSk7XG4gICAgICB9XG4gICAgICBzYi5hcHBlbmQoJylcXG4nKTtcbiAgICB9KTtcbiAgICBzYi5hcHBlbmQoJyAgICAuYnVpbGQoKTtcXG59KTtcXG4nKTtcbiAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbiAgfSxcblxuICAvLyBUT0RPOiBDb21lIHVwIHdpdGggYmV0dGVyIG5hbWVzIGZvciB0aGVzZSBtZXRob2RzLlxuICAvLyBUT0RPOiBXcml0ZSB0aGUgYW5hbG9nIG9mIHRoZXNlIG1ldGhvZHMgZm9yIGluaGVyaXRlZCBhdHRyaWJ1dGVzLlxuICB0b09wZXJhdGlvbkFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGUoKTtcbiAgfSxcbiAgdG9BdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gIH0sXG5cbiAgX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IGFkZCB0aGUgc3VwZXItZ3JhbW1hcidzIHRlbXBsYXRlcyBhdCB0aGUgcmlnaHQgcGxhY2UsIGUuZy4sIGEgY2FzZSBmb3IgQWRkRXhwcl9wbHVzXG4gICAgLy8gc2hvdWxkIGFwcGVhciBuZXh0IHRvIG90aGVyIGNhc2VzIG9mIEFkZEV4cHIuXG5cbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHNiLmFwcGVuZCgneycpO1xuXG4gICAgdmFyIGZpcnN0ID0gdHJ1ZTtcbiAgICBmb3IgKHZhciBydWxlTmFtZSBpbiB0aGlzLnJ1bGVCb2RpZXMpIHtcbiAgICAgIHZhciBib2R5ID0gdGhpcy5ydWxlQm9kaWVzW3J1bGVOYW1lXTtcbiAgICAgIGlmIChmaXJzdCkge1xuICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsJyk7XG4gICAgICB9XG4gICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgICAgc2IuYXBwZW5kKCcgICcpO1xuICAgICAgdGhpcy5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBzYik7XG4gICAgfVxuXG4gICAgc2IuYXBwZW5kKCdcXG59Jyk7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG4gIH0sXG5cbiAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24ocnVsZU5hbWUsIGJvZHksIHNiKSB7XG4gICAgc2IuYXBwZW5kKHJ1bGVOYW1lKTtcbiAgICBzYi5hcHBlbmQoJzogZnVuY3Rpb24oJyk7XG4gICAgdmFyIGFyaXR5ID0gdGhpcy5fdG9wRG93bkFjdGlvbkFyaXR5KHJ1bGVOYW1lKTtcbiAgICBzYi5hcHBlbmQoY29tbW9uLnJlcGVhdCgnXycsIGFyaXR5KS5qb2luKCcsICcpKTtcbiAgICBzYi5hcHBlbmQoJykge1xcbicpO1xuICAgIHNiLmFwcGVuZCgnICB9Jyk7XG4gIH0sXG5cbiAgLy8gUGFyc2UgYSBzdHJpbmcgd2hpY2ggZXhwcmVzc2VzIGEgcnVsZSBhcHBsaWNhdGlvbiBpbiB0aGlzIGdyYW1tYXIsIGFuZCByZXR1cm4gdGhlXG4gIC8vIHJlc3VsdGluZyBBcHBseSBub2RlLlxuICBwYXJzZUFwcGxpY2F0aW9uOiBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgYXBwO1xuICAgIGlmIChzdHIuaW5kZXhPZignPCcpID09PSAtMSkge1xuICAgICAgLy8gc2ltcGxlIGFwcGxpY2F0aW9uXG4gICAgICBhcHAgPSBuZXcgcGV4cHJzLkFwcGx5KHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHBhcmFtZXRlcml6ZWQgYXBwbGljYXRpb25cbiAgICAgIHZhciBjc3QgPSBvaG1HcmFtbWFyLm1hdGNoKHN0ciwgJ0Jhc2VfYXBwbGljYXRpb24nKTtcbiAgICAgIGFwcCA9IGJ1aWxkR3JhbW1hcihjc3QsIHt9KTtcbiAgICB9XG5cbiAgICAvLyBFbnN1cmUgdGhhdCB0aGUgYXBwbGljYXRpb24gaXMgdmFsaWQuXG4gICAgaWYgKCEoYXBwLnJ1bGVOYW1lIGluIHRoaXMucnVsZUJvZGllcykpIHtcbiAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkUnVsZShhcHAucnVsZU5hbWUsIHRoaXMubmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnJ1bGVGb3JtYWxzW2FwcC5ydWxlTmFtZV0ubGVuZ3RoICE9PSBhcHAuYXJncy5sZW5ndGgpIHtcbiAgICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mUGFyYW1ldGVycyhcbiAgICAgICAgICBhcHAucnVsZU5hbWUsIHRoaXMucnVsZUZvcm1hbHNbYXBwLnJ1bGVOYW1lXS5sZW5ndGgsIGFwcC5hcmdzLmxlbmd0aCk7XG4gICAgfVxuICAgIHJldHVybiBhcHA7XG4gIH1cbn07XG5cbi8vIFRoZSBmb2xsb3dpbmcgZ3JhbW1hciBjb250YWlucyBhIGZldyBydWxlcyB0aGF0IGNvdWxkbid0IGJlIHdyaXR0ZW4gIGluIFwidXNlcmxhbmRcIi5cbi8vIEF0IHRoZSBib3R0b20gb2Ygc3JjL21haW4uanMsIHdlIGNyZWF0ZSBhIHN1Yi1ncmFtbWFyIG9mIHRoaXMgZ3JhbW1hciB0aGF0J3MgY2FsbGVkXG4vLyBgQnVpbHRJblJ1bGVzYC4gVGhhdCBncmFtbWFyIGNvbnRhaW5zIHNldmVyYWwgY29udmVuaWVuY2UgcnVsZXMsIGUuZy4sIGBsZXR0ZXJgIGFuZFxuLy8gYGRpZ2l0YCwgYW5kIGlzIGltcGxpY2l0bHkgdGhlIHN1cGVyLWdyYW1tYXIgb2YgYW55IGdyYW1tYXIgd2hvc2Ugc3VwZXItZ3JhbW1hclxuLy8gaXNuJ3Qgc3BlY2lmaWVkLlxuR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA9IG5ldyBHcmFtbWFyKFxuICAgICdQcm90b0J1aWx0SW5SdWxlcycsICAvLyBuYW1lXG4gICAgdW5kZWZpbmVkLCAgLy8gc3VwZXJncmFtbWFyXG5cbiAgICAvLyBydWxlIGJvZGllc1xuICAgIHtcbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgcnVsZXMgY2FuJ3QgYmUgd3JpdHRlbiBpbiB1c2VybGFuZCBiZWNhdXNlIHRoZXkgcmVmZXJlbmNlXG4gICAgICAvLyBgYW55YCBhbmQgYGVuZGAgZGlyZWN0bHkuXG4gICAgICBhbnk6IHBleHBycy5hbnksXG4gICAgICBlbmQ6IHBleHBycy5lbmQsXG5cbiAgICAgIC8vIFRoZSBmb2xsb3dpbmcgcnVsZSBpcyBpbnZva2VkIGltcGxpY2l0bHkgYnkgc3ludGFjdGljIHJ1bGVzIHRvIHNraXAgc3BhY2VzLlxuICAgICAgc3BhY2VzOiBuZXcgcGV4cHJzLlN0YXIobmV3IHBleHBycy5BcHBseSgnc3BhY2UnKSksXG5cbiAgICAgIC8vIFRoZSBgc3BhY2VgIHJ1bGUgbXVzdCBiZSBkZWZpbmVkIGhlcmUgYmVjYXVzZSBpdCdzIHJlZmVyZW5jZWQgYnkgYHNwYWNlc2AuXG4gICAgICBzcGFjZTogbmV3IHBleHBycy5SYW5nZSgnXFx4MDAnLCAnICcpLFxuXG4gICAgICAvLyBUaGVzZSBydWxlcyBhcmUgaW1wbGVtZW50ZWQgbmF0aXZlbHkgYmVjYXVzZSB0aGV5IHVzZSBVbmljb2RlQ2hhciBkaXJlY3RseSwgd2hpY2ggaXNcbiAgICAgIC8vIG5vdCBwYXJ0IG9mIHRoZSBPaG0gZ3JhbW1hci5cbiAgICAgIGxvd2VyOiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMbCcpLFxuICAgICAgdXBwZXI6IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0x1JyksXG5cbiAgICAgIC8vIFRoZSB1bmlvbiBvZiBMdCAodGl0bGVjYXNlKSwgTG0gKG1vZGlmaWVyKSwgYW5kIExvIChvdGhlciksIGkuZS4gYW55IGxldHRlciBub3RcbiAgICAgIC8vIGluIExsIG9yIEx1LlxuICAgICAgdW5pY29kZUx0bW86IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0x0bW8nKVxuICAgIH0sXG5cbiAgICAvLyBydWxlIGZvcm1hbCBhcmd1bWVudHNcbiAgICB7XG4gICAgICBhbnk6IFtdLFxuICAgICAgZW5kOiBbXSxcbiAgICAgIHNwYWNlczogW10sXG4gICAgICBzcGFjZTogW10sXG4gICAgICBsb3dlcjogW10sXG4gICAgICB1cHBlcjogW10sXG4gICAgICB1bmljb2RlTHRtbzogW11cbiAgICB9LFxuXG4gICAgLy8gcnVsZSBkZXNjcmlwdGlvbnNcbiAgICB7XG4gICAgICBhbnk6ICdhbnkgb2JqZWN0JyxcbiAgICAgIGVuZDogJ2VuZCBvZiBpbnB1dCcsXG4gICAgICBzcGFjZTogJ2Egc3BhY2UnLFxuICAgICAgbG93ZXI6ICdhIGxvd2VyY2FzZSBsZXR0ZXInLFxuICAgICAgdXBwZXI6ICdhbiB1cHBlcmNhc2UgbGV0dGVyJ1xuICAgIH1cbik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hcicpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBTdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQ29uc3RydWN0b3JzXG5cbmZ1bmN0aW9uIEdyYW1tYXJEZWNsKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbn1cblxuLy8gSGVscGVyc1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuc291cmNlSW50ZXJ2YWwgPSBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHRoaXMuaW50ZXJ2YWwuaW5wdXRTdHJlYW07XG4gIHJldHVybiBpbnB1dFN0cmVhbS5pbnRlcnZhbChzdGFydElkeCwgZW5kSWR4KTtcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5lbnN1cmVTdXBlckdyYW1tYXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgIHRoaXMud2l0aFN1cGVyR3JhbW1hcihcbiAgICAgICAgLy8gVE9ETzogVGhlIGNvbmRpdGlvbmFsIGV4cHJlc3Npb24gYmVsb3cgaXMgYW4gdWdseSBoYWNrLiBJdCdzIGtpbmQgb2Ygb2sgYmVjYXVzZVxuICAgICAgICAvLyBJIGRvdWJ0IGFueW9uZSB3aWxsIGV2ZXIgdHJ5IHRvIGRlY2xhcmUgYSBncmFtbWFyIGNhbGxlZCBgQnVpbHRJblJ1bGVzYC4gU3RpbGwsXG4gICAgICAgIC8vIHdlIHNob3VsZCB0cnkgdG8gZmluZCBhIGJldHRlciB3YXkgdG8gZG8gdGhpcy5cbiAgICAgICAgdGhpcy5uYW1lID09PSAnQnVpbHRJblJ1bGVzJyA/XG4gICAgICAgICAgICBHcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzIDpcbiAgICAgICAgICAgIEdyYW1tYXIuQnVpbHRJblJ1bGVzKTtcbiAgfVxuICByZXR1cm4gdGhpcy5zdXBlckdyYW1tYXI7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZSA9IGZ1bmN0aW9uKG5hbWUsIGZvcm1hbHMsIGJvZHkpIHtcbiAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBib2R5KTtcbiAgfVxuICB2YXIgZXhwZWN0ZWRGb3JtYWxzID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlRm9ybWFsc1tuYW1lXTtcbiAgdmFyIGV4cGVjdGVkTnVtRm9ybWFscyA9IGV4cGVjdGVkRm9ybWFscyA/IGV4cGVjdGVkRm9ybWFscy5sZW5ndGggOiAwO1xuICBpZiAoZm9ybWFscy5sZW5ndGggIT09IGV4cGVjdGVkTnVtRm9ybWFscykge1xuICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mUGFyYW1ldGVycyhuYW1lLCBleHBlY3RlZE51bUZvcm1hbHMsIGZvcm1hbHMubGVuZ3RoLCBib2R5KTtcbiAgfVxuICByZXR1cm4gdGhpcy5pbnN0YWxsKG5hbWUsIGZvcm1hbHMsIGJvZHkpO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGwgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5LCBvcHREZXNjcmlwdGlvbikge1xuICBib2R5ID0gYm9keS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIHRoaXMucnVsZUZvcm1hbHNbbmFtZV0gPSBmb3JtYWxzO1xuICBpZiAob3B0RGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLnJ1bGVEZXNjcmlwdGlvbnNbbmFtZV0gPSBvcHREZXNjcmlwdGlvbjtcbiAgfVxuICB0aGlzLnJ1bGVCb2RpZXNbbmFtZV0gPSBib2R5O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFN0dWZmIHRoYXQgeW91IHNob3VsZCBvbmx5IGRvIG9uY2VcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhTdXBlckdyYW1tYXIgPSBmdW5jdGlvbihzdXBlckdyYW1tYXIpIHtcbiAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgc3VwZXIgZ3JhbW1hciBvZiBhIEdyYW1tYXJEZWNsIGNhbm5vdCBiZSBzZXQgbW9yZSB0aGFuIG9uY2UnKTtcbiAgfVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgdGhpcy5ydWxlQm9kaWVzID0gT2JqZWN0LmNyZWF0ZShzdXBlckdyYW1tYXIucnVsZUJvZGllcyk7XG4gIHRoaXMucnVsZUZvcm1hbHMgPSBPYmplY3QuY3JlYXRlKHN1cGVyR3JhbW1hci5ydWxlRm9ybWFscyk7XG4gIHRoaXMucnVsZURlc2NyaXB0aW9ucyA9IE9iamVjdC5jcmVhdGUoc3VwZXJHcmFtbWFyLnJ1bGVEZXNjcmlwdGlvbnMpO1xuXG4gIC8vIEdyYW1tYXJzIHdpdGggYW4gZXhwbGljaXQgc3VwZXJncmFtbWFyIGluaGVyaXQgYSBkZWZhdWx0IHN0YXJ0IHJ1bGUuXG4gIGlmICghc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gc3VwZXJHcmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aERlZmF1bHRTdGFydFJ1bGUgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBydWxlTmFtZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aFNvdXJjZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICB0aGlzLmludGVydmFsID0gbmV3IElucHV0U3RyZWFtKHNvdXJjZSkuaW50ZXJ2YWwoMCwgc291cmNlLmxlbmd0aCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gQ3JlYXRlcyBhIEdyYW1tYXIgaW5zdGFuY2UsIGFuZCBpZiBpdCBwYXNzZXMgdGhlIHNhbml0eSBjaGVja3MsIHJldHVybnMgaXQuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGdyYW1tYXIgPSBuZXcgR3JhbW1hcihcbiAgICAgIHRoaXMubmFtZSxcbiAgICAgIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCksXG4gICAgICB0aGlzLnJ1bGVCb2RpZXMsXG4gICAgICB0aGlzLnJ1bGVGb3JtYWxzLFxuICAgICAgdGhpcy5ydWxlRGVzY3JpcHRpb25zLFxuICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlKTtcbiAgLy8gVE9ETzogY2hhbmdlIHRoZSBwZXhwci5wcm90b3R5cGUuYXNzZXJ0Li4uIG1ldGhvZHMgdG8gbWFrZSB0aGVtIGFkZFxuICAvLyBleGNlcHRpb25zIHRvIGFuIGFycmF5IHRoYXQncyBwcm92aWRlZCBhcyBhbiBhcmcuIFRoZW4gd2UnbGwgYmUgYWJsZSB0b1xuICAvLyBzaG93IG1vcmUgdGhhbiBvbmUgZXJyb3Igb2YgdGhlIHNhbWUgdHlwZSBhdCBhIHRpbWUuXG4gIC8vIFRPRE86IGluY2x1ZGUgdGhlIG9mZmVuZGluZyBwZXhwciBpbiB0aGUgZXJyb3JzLCB0aGF0IHdheSB3ZSBjYW4gc2hvd1xuICAvLyB0aGUgcGFydCBvZiB0aGUgc291cmNlIHRoYXQgY2F1c2VkIGl0LlxuICB2YXIgZ3JhbW1hckVycm9ycyA9IFtdO1xuICB2YXIgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSBmYWxzZTtcbiAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlQm9kaWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVCb2RpZXNbcnVsZU5hbWVdO1xuICAgIHRyeSB7XG4gICAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICBib2R5LmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICBncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucyA9IHRydWU7XG4gICAgfVxuICB9KTtcbiAgaWYgKCFncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucykge1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgY2FuIG9ubHkgYmUgZG9uZSBpZiB0aGUgZ3JhbW1hciBoYXMgbm8gaW52YWxpZCBhcHBsaWNhdGlvbnMuXG4gICAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlQm9kaWVzKS5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZUJvZGllc1tydWxlTmFtZV07XG4gICAgICB0cnkge1xuICAgICAgICBib2R5LmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoZ3JhbW1hckVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgZXJyb3JzLnRocm93RXJyb3JzKGdyYW1tYXJFcnJvcnMpO1xuICB9XG4gIGlmICh0aGlzLmludGVydmFsKSB7XG4gICAgZ3JhbW1hci5kZWZpbml0aW9uSW50ZXJ2YWwgPSB0aGlzLmludGVydmFsO1xuICB9XG5cbiAgcmV0dXJuIGdyYW1tYXI7XG59O1xuXG4vLyBSdWxlIGRlY2xhcmF0aW9uc1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSwgb3B0RGVzY3IpIHtcbiAgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKTtcbiAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVCb2RpZXNbbmFtZV0pIHtcbiAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgYm9keSk7XG4gIH0gZWxzZSBpZiAodGhpcy5ydWxlQm9kaWVzW25hbWVdKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMubmFtZSwgYm9keSk7XG4gIH1cbiAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBib2R5KTtcbiAgfVxuICByZXR1cm4gdGhpcy5pbnN0YWxsKG5hbWUsIGZvcm1hbHMsIGJvZHksIG9wdERlc2NyKTtcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5vdmVycmlkZSA9IGZ1bmN0aW9uKG5hbWUsIGZvcm1hbHMsIGJvZHkpIHtcbiAgdmFyIGJhc2VSdWxlID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlQm9kaWVzW25hbWVdO1xuICBpZiAoIWJhc2VSdWxlKSB7XG4gICAgdGhyb3cgZXJyb3JzLmNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgYm9keSk7XG4gIH1cbiAgdGhpcy5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlKG5hbWUsIGZvcm1hbHMsIGJvZHkpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBmcmFnbWVudCkge1xuICB2YXIgYmFzZVJ1bGUgPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVCb2RpZXNbbmFtZV07XG4gIGlmICghYmFzZVJ1bGUpIHtcbiAgICB0aHJvdyBlcnJvcnMuY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgZnJhZ21lbnQpO1xuICB9XG4gIHZhciBib2R5ID0gbmV3IHBleHBycy5FeHRlbmQodGhpcy5zdXBlckdyYW1tYXIsIG5hbWUsIGZyYWdtZW50KTtcbiAgYm9keS5pbnRlcnZhbCA9IGZyYWdtZW50LmludGVydmFsO1xuICB0aGlzLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUobmFtZSwgZm9ybWFscywgYm9keSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hckRlY2w7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIHRoaXMucG9zID0gMDtcbiAgdGhpcy5wb3NJbmZvcyA9IFtdO1xufVxuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgfSxcblxuICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2VbdGhpcy5wb3MrK107XG4gIH0sXG5cbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGlmICh0aGlzLm5leHQoKSAhPT0gc1tpZHhdKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgc291cmNlU2xpY2U6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeCk7XG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBvcHRFbmRJZHgpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMsIHN0YXJ0SWR4LCBvcHRFbmRJZHggPyBvcHRFbmRJZHggOiB0aGlzLnBvcyk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0U3RyZWFtO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vY29tbW9uJykuYXNzZXJ0O1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW50ZXJ2YWwoaW5wdXRTdHJlYW0sIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5pbnB1dFN0cmVhbSA9IGlucHV0U3RyZWFtO1xuICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHg7XG4gIHRoaXMuZW5kSWR4ID0gZW5kSWR4O1xufVxuXG5JbnRlcnZhbC5jb3ZlcmFnZSA9IGZ1bmN0aW9uKC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gYXJndW1lbnRzWzBdLmlucHV0U3RyZWFtO1xuICB2YXIgc3RhcnRJZHggPSBhcmd1bWVudHNbMF0uc3RhcnRJZHg7XG4gIHZhciBlbmRJZHggPSBhcmd1bWVudHNbMF0uZW5kSWR4O1xuICBmb3IgKHZhciBpZHggPSAxOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBpbnRlcnZhbCA9IGFyZ3VtZW50c1tpZHhdO1xuICAgIGlmIChpbnRlcnZhbC5pbnB1dFN0cmVhbSAhPT0gaW5wdXRTdHJlYW0pIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRJZHggPSBNYXRoLm1pbihzdGFydElkeCwgYXJndW1lbnRzW2lkeF0uc3RhcnRJZHgpO1xuICAgICAgZW5kSWR4ID0gTWF0aC5tYXgoZW5kSWR4LCBhcmd1bWVudHNbaWR4XS5lbmRJZHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEludGVydmFsKGlucHV0U3RyZWFtLCBzdGFydElkeCwgZW5kSWR4KTtcbn07XG5cbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgY292ZXJhZ2VXaXRoOiBmdW5jdGlvbigvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gICAgdmFyIGludGVydmFscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgaW50ZXJ2YWxzLnB1c2godGhpcyk7XG4gICAgcmV0dXJuIEludGVydmFsLmNvdmVyYWdlLmFwcGx5KHVuZGVmaW5lZCwgaW50ZXJ2YWxzKTtcbiAgfSxcblxuICBjb2xsYXBzZWRMZWZ0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuaW5wdXRTdHJlYW0sIHRoaXMuc3RhcnRJZHgsIHRoaXMuc3RhcnRJZHgpO1xuICB9LFxuXG4gIGNvbGxhcHNlZFJpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuaW5wdXRTdHJlYW0sIHRoaXMuZW5kSWR4LCB0aGlzLmVuZElkeCk7XG4gIH0sXG5cbiAgZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYW5nZSA9IFt0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeF07XG4gICAgcmV0dXJuIHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UodGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UsIHRoaXMuc3RhcnRJZHgsIHJhbmdlKTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIDAsIDEsIG9yIDIgaW50ZXJ2YWxzIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIHRoZVxuICAvLyBpbnRlcnZhbCBkaWZmZXJlbmNlIG9wZXJhdGlvbi5cbiAgbWludXM6IGZ1bmN0aW9uKHRoYXQpIHtcbiAgICBpZiAodGhpcy5pbnB1dFN0cmVhbSAhPT0gdGhhdC5pbnB1dFN0cmVhbSkge1xuICAgICAgdGhyb3cgZXJyb3JzLmludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydElkeCA9PT0gdGhhdC5zdGFydElkeCAmJiB0aGlzLmVuZElkeCA9PT0gdGhhdC5lbmRJZHgpIHtcbiAgICAgIC8vIGB0aGlzYCBhbmQgYHRoYXRgIGFyZSB0aGUgc2FtZSBpbnRlcnZhbCFcbiAgICAgIHJldHVybiBbXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydElkeCA8IHRoYXQuc3RhcnRJZHggJiYgdGhhdC5lbmRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgLy8gYHRoYXRgIHNwbGl0cyBgdGhpc2AgaW50byB0d28gaW50ZXJ2YWxzXG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhpcy5zdGFydElkeCwgdGhhdC5zdGFydElkeCksXG4gICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCB0aGF0LmVuZElkeCwgdGhpcy5lbmRJZHgpXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydElkeCA8IHRoYXQuZW5kSWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgIC8vIGB0aGF0YCBjb250YWlucyBhIHByZWZpeCBvZiBgdGhpc2BcbiAgICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0U3RyZWFtLCB0aGF0LmVuZElkeCwgdGhpcy5lbmRJZHgpXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydElkeCA8IHRoYXQuc3RhcnRJZHggJiYgdGhhdC5zdGFydElkeCA8IHRoaXMuZW5kSWR4KSB7XG4gICAgICAvLyBgdGhhdGAgY29udGFpbnMgYSBzdWZmaXggb2YgYHRoaXNgXG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dFN0cmVhbSwgdGhpcy5zdGFydElkeCwgdGhhdC5zdGFydElkeClcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGB0aGF0YCBhbmQgYHRoaXNgIGRvIG5vdCBvdmVybGFwXG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzXG4gICAgICBdO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IEludGVydmFsIHRoYXQgaGFzIHRoZSBzYW1lIGV4dGVudCBhcyB0aGlzIG9uZSwgYnV0IHdoaWNoIGlzIHJlbGF0aXZlXG4gIC8vIHRvIGB0aGF0YCwgYW4gSW50ZXJ2YWwgdGhhdCBmdWxseSBjb3ZlcnMgdGhpcyBvbmUuXG4gIHJlbGF0aXZlVG86IGZ1bmN0aW9uKHRoYXQsIG5ld0lucHV0U3RyZWFtKSB7XG4gICAgaWYgKHRoaXMuaW5wdXRTdHJlYW0gIT09IHRoYXQuaW5wdXRTdHJlYW0pIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9XG4gICAgYXNzZXJ0KHRoaXMuc3RhcnRJZHggPj0gdGhhdC5zdGFydElkeCAmJiB0aGlzLmVuZElkeCA8PSB0aGF0LmVuZElkeCxcbiAgICAgICAgICAgJ290aGVyIGludGVydmFsIGRvZXMgbm90IGNvdmVyIHRoaXMgb25lJyk7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbChuZXdJbnB1dFN0cmVhbSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRJZHggLSB0aGF0LnN0YXJ0SWR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRJZHggLSB0aGF0LnN0YXJ0SWR4KTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IEludGVydmFsIHdoaWNoIGNvbnRhaW5zIHRoZSBzYW1lIGNvbnRlbnRzIGFzIHRoaXMgb25lLFxuICAvLyBidXQgd2l0aCB3aGl0ZXNwYWNlIHRyaW1tZWQgZnJvbSBib3RoIGVuZHMuIChUaGlzIG9ubHkgbWFrZXMgc2Vuc2Ugd2hlblxuICAvLyB0aGUgaW5wdXQgc3RyZWFtIGlzIGEgc3RyaW5nLilcbiAgdHJpbW1lZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRlbnRzID0gdGhpcy5jb250ZW50cztcbiAgICB2YXIgc3RhcnRJZHggPSB0aGlzLnN0YXJ0SWR4ICsgY29udGVudHMubWF0Y2goL15cXHMqLylbMF0ubGVuZ3RoO1xuICAgIHZhciBlbmRJZHggPSB0aGlzLmVuZElkeCAtIGNvbnRlbnRzLm1hdGNoKC9cXHMqJC8pWzBdLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuaW5wdXRTdHJlYW0sIHN0YXJ0SWR4LCBlbmRJZHgpO1xuICB9XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhJbnRlcnZhbC5wcm90b3R5cGUsIHtcbiAgY29udGVudHM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSB0aGlzLmlucHV0U3RyZWFtLnNvdXJjZVNsaWNlKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9jb250ZW50cztcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWVcbiAgfVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsO1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBub2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBDcmVhdGUgYSBzaG9ydCBlcnJvciBtZXNzYWdlIGZvciBhbiBlcnJvciB0aGF0IG9jY3VycmVkIGR1cmluZyBtYXRjaGluZy5cbmZ1bmN0aW9uIGdldFNob3J0TWF0Y2hFcnJvck1lc3NhZ2UocG9zLCBzb3VyY2UsIGRldGFpbCkge1xuICB2YXIgZXJyb3JJbmZvID0gdXRpbC5nZXRMaW5lQW5kQ29sdW1uKHNvdXJjZSwgcG9zKTtcbiAgcmV0dXJuICdMaW5lICcgKyBlcnJvckluZm8ubGluZU51bSArICcsIGNvbCAnICsgZXJyb3JJbmZvLmNvbE51bSArICc6ICcgKyBkZXRhaWw7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIE1hdGNoRmFpbHVyZSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBNYXRjaFJlc3VsdChzdGF0ZSkge1xuICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIHRoaXMuX2NzdCA9IHN0YXRlLmJpbmRpbmdzWzBdO1xufVxuXG5NYXRjaFJlc3VsdC5uZXdGb3IgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgc3VjY2VlZGVkID0gc3RhdGUuYmluZGluZ3MubGVuZ3RoID4gMDtcbiAgcmV0dXJuIHN1Y2NlZWRlZCA/IG5ldyBNYXRjaFJlc3VsdChzdGF0ZSkgOiBuZXcgTWF0Y2hGYWlsdXJlKHN0YXRlKTtcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5mYWlsZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnN1Y2NlZWRlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMuZmFpbGVkKCk7XG59O1xuXG4vLyBSZXR1cm5zIGEgYE1hdGNoUmVzdWx0YCB0aGF0IGNhbiBiZSBmZWQgaW50byBvcGVyYXRpb25zIG9yIGF0dHJpYnV0ZXMgdGhhdCBjYXJlXG4vLyBhYm91dCB0aGUgd2hpdGVzcGFjZSB0aGF0IHdhcyBpbXBsaWNpdGx5IHNraXBwZWQgb3ZlciBieSBzeW50YWN0aWMgcnVsZXMuIFRoaXNcbi8vIGlzIHVzZWZ1bCBmb3IgZG9pbmcgdGhpbmdzIHdpdGggY29tbWVudHMsIGUuZy4sIHN5bnRheCBoaWdobGlnaHRpbmcuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0RGlzY2FyZGVkU3BhY2VzID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmZhaWxlZCgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgdmFyIGdyYW1tYXIgPSBzdGF0ZS5ncmFtbWFyO1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcblxuICB2YXIgaW50ZXJ2YWxzID0gW25ldyBJbnRlcnZhbChpbnB1dFN0cmVhbSwgMCwgaW5wdXRTdHJlYW0uc291cmNlLmxlbmd0aCldO1xuXG4gIC8vIFN1YnRyYWN0IHRoZSBpbnRlcnZhbCBvZiBlYWNoIHRlcm1pbmFsIGZyb20gdGhlIHNldCBvZiBpbnRlcnZhbHMgYWJvdmUuXG4gIHZhciBzID0gZ3JhbW1hci5zZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3N1YnRyYWN0VGVybWluYWxzJywge1xuICAgIF9ub250ZXJtaW5hbDogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICAgIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgY2hpbGQuc3VidHJhY3RUZXJtaW5hbHMoKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgX3Rlcm1pbmFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB0ID0gdGhpcztcbiAgICAgIGludGVydmFscyA9IGludGVydmFscy5cbiAgICAgICAgICBtYXAoZnVuY3Rpb24oaW50ZXJ2YWwpIHsgcmV0dXJuIGludGVydmFsLm1pbnVzKHQuaW50ZXJ2YWwpOyB9KS5cbiAgICAgICAgICByZWR1Y2UoZnVuY3Rpb24oeHMsIHlzKSB7IHJldHVybiB4cy5jb25jYXQoeXMpOyB9LCBbXSk7XG4gICAgfVxuICB9KTtcbiAgcyh0aGlzKS5zdWJ0cmFjdFRlcm1pbmFscygpO1xuXG4gIC8vIE5vdyBgaW50ZXJ2YWxzYCBob2xkcyB0aGUgaW50ZXJ2YWxzIG9mIHRoZSBpbnB1dCBzdHJlYW0gdGhhdCB3ZXJlIHNraXBwZWQgb3ZlciBieSBzeW50YWN0aWNcbiAgLy8gcnVsZXMsIGJlY2F1c2UgdGhleSBjb250YWluZWQgc3BhY2VzLlxuXG4gIC8vIE5leHQsIHdlIHdhbnQgdG8gbWF0Y2ggdGhlIGNvbnRlbnRzIG9mIGVhY2ggb2YgdGhvc2UgaW50ZXJ2YWxzIHdpdGggdGhlIGdyYW1tYXIncyBgc3BhY2VzYFxuICAvLyBydWxlLCB0byByZWNvbnN0cnVjdCB0aGUgQ1NUIG5vZGVzIHRoYXQgd2VyZSBkaXNjYXJkZWQgYnkgc3ludGFjdGljIHJ1bGVzLiBCdXQgaWYgd2Ugc2ltcGx5XG4gIC8vIHBhc3MgZWFjaCBpbnRlcnZhbCdzIGBjb250ZW50c2AgdG8gdGhlIGdyYW1tYXIncyBgbWF0Y2hgIG1ldGhvZCwgdGhlIHJlc3VsdGluZyBub2RlcyBhbmRcbiAgLy8gdGhlaXIgY2hpbGRyZW4gd2lsbCBoYXZlIGludGVydmFscyB0aGF0IGFyZSBhc3NvY2lhdGVkIHdpdGggYSBkaWZmZXJlbnQgaW5wdXQsIGkuZS4sIGFcbiAgLy8gc3Vic3RyaW5nIG9mIHRoZSBvcmlnaW5hbCBpbnB1dC4gVGhlIGZvbGxvd2luZyBvcGVyYXRpb24gd2lsbCBmaXggdGhpcyBwcm9ibGVtIGZvciB1cy5cbiAgcy5hZGRPcGVyYXRpb24oJ2ZpeEludGVydmFscyhpZHhPZmZzZXQpJywge1xuICAgIF9kZWZhdWx0OiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgICAgdmFyIGlkeE9mZnNldCA9IHRoaXMuYXJncy5pZHhPZmZzZXQ7XG4gICAgICB0aGlzLmludGVydmFsLmlucHV0U3RyZWFtID0gaW5wdXRTdHJlYW07XG4gICAgICB0aGlzLmludGVydmFsLnN0YXJ0SWR4ICs9IGlkeE9mZnNldDtcbiAgICAgIHRoaXMuaW50ZXJ2YWwuZW5kSWR4ICs9IGlkeE9mZnNldDtcbiAgICAgIGlmICghdGhpcy5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGNoaWxkLmZpeEludGVydmFscyhpZHhPZmZzZXQpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8vIE5vdyB3ZSdyZSBmaW5hbGx5IHJlYWR5IHRvIHJlY29uc3RydWN0IHRoZSBkaXNjYXJkZWQgQ1NUIG5vZGVzLlxuICB2YXIgZGlzY2FyZGVkTm9kZXMgPSBpbnRlcnZhbHMubWFwKGZ1bmN0aW9uKGludGVydmFsKSB7XG4gICAgdmFyIHIgPSBncmFtbWFyLm1hdGNoKGludGVydmFsLmNvbnRlbnRzLCAnc3BhY2VzJyk7XG4gICAgcyhyKS5maXhJbnRlcnZhbHMoaW50ZXJ2YWwuc3RhcnRJZHgpO1xuICAgIHJldHVybiByLl9jc3Q7XG4gIH0pO1xuXG4gIC8vIFJhdGhlciB0aGFuIHJldHVybiBhIGJ1bmNoIG9mIENTVCBub2RlcyBhbmQgbWFrZSB0aGUgY2FsbGVyIG9mIHRoaXMgbWV0aG9kIGxvb3Agb3ZlciB0aGVtLFxuICAvLyB3ZSBjYW4gY29uc3RydWN0IGEgc2luZ2xlIENTVCBub2RlIHRoYXQgaXMgdGhlIHBhcmVudCBvZiBhbGwgb2YgdGhlIGRpc2NhcmRlZCBub2Rlcy4gQW5cbiAgLy8gYEl0ZXJhdGlvbk5vZGVgIGlzIHRoZSBvYnZpb3VzIGNob2ljZSBmb3IgdGhpcy5cbiAgZGlzY2FyZGVkTm9kZXMgPSBuZXcgbm9kZXMuSXRlcmF0aW9uTm9kZShcbiAgICAgIGdyYW1tYXIsXG4gICAgICBkaXNjYXJkZWROb2RlcyxcbiAgICAgIGRpc2NhcmRlZE5vZGVzLmxlbmd0aCA9PT0gMCA/XG4gICAgICAgICAgbmV3IEludGVydmFsKGlucHV0U3RyZWFtLCAwLCAwKSA6XG4gICAgICAgICAgbmV3IEludGVydmFsKFxuICAgICAgICAgICAgICBpbnB1dFN0cmVhbSxcbiAgICAgICAgICAgICAgZGlzY2FyZGVkTm9kZXNbMF0uaW50ZXJ2YWwuc3RhcnRJZHgsXG4gICAgICAgICAgICAgIGRpc2NhcmRlZE5vZGVzW2Rpc2NhcmRlZE5vZGVzLmxlbmd0aCAtIDFdLmludGVydmFsLmVuZElkeCkpO1xuXG4gIC8vIEJ1dCByZW1lbWJlciB0aGF0IGEgQ1NUIG5vZGUgY2FuJ3QgYmUgdXNlZCBkaXJlY3RseSBieSBjbGllbnRzLiBXaGF0IHdlIHJlYWxseSBuZWVkIHRvIHJldHVyblxuICAvLyBmcm9tIHRoaXMgbWV0aG9kIGlzIGEgc3VjY2Vzc2Z1bCBgTWF0Y2hSZXN1bHRgIHRoYXQgY2FuIGJlIHVzZWQgd2l0aCB0aGUgY2xpZW50cycgc2VtYW50aWNzLlxuICAvLyBXZSBhbHJlYWR5IGhhdmUgb25lIC0tIGB0aGlzYCAtLSBidXQgaXQncyBnb3QgYSBkaWZmZXJlbnQgQ1NUIG5vZGUgaW5zaWRlLiBTbyB3ZSBjcmVhdGUgYSBuZXdcbiAgLy8gb2JqZWN0IHRoYXQgZGVsZWdhdGVzIHRvIGB0aGlzYCwgYW5kIG92ZXJyaWRlIGl0cyBgX2NzdGAgcHJvcGVydHkuXG4gIHZhciByID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgci5fY3N0ID0gZGlzY2FyZGVkTm9kZXM7XG5cbiAgLy8gV2UgYWxzbyBvdmVycmlkZSBpdHMgYGdldERpc2NhcmRlZFNwYWNlc2AgbWV0aG9kLCBpbiBjYXNlIHNvbWVvbmUgZGVjaWRlcyB0byBjYWxsIGl0LlxuICByLmdldERpc2NhcmRlZFNwYWNlcyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gcjsgfTtcblxuICByZXR1cm4gcjtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIE1hdGNoRmFpbHVyZSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBNYXRjaEZhaWx1cmUoc3RhdGUpIHtcbiAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdfZmFpbHVyZXMnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5nZXRGYWlsdXJlcygpO1xuICB9KTtcbiAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb3VyY2UgPSB0aGlzLnN0YXRlLmlucHV0U3RyZWFtLnNvdXJjZTtcbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiAnbWF0Y2ggZmFpbGVkIGF0IHBvc2l0aW9uICcgKyB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpO1xuICAgIH1cblxuICAgIHZhciBkZXRhaWwgPSAnRXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgcmV0dXJuIHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2Uoc291cmNlLCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKSArIGRldGFpbDtcbiAgfSk7XG4gIGNvbW1vbi5kZWZpbmVMYXp5UHJvcGVydHkodGhpcywgJ3Nob3J0TWVzc2FnZScsIGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5zdGF0ZS5pbnB1dFN0cmVhbS5zb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gJ21hdGNoIGZhaWxlZCBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKTtcbiAgICB9XG4gICAgdmFyIGRldGFpbCA9ICdleHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICByZXR1cm4gZ2V0U2hvcnRNYXRjaEVycm9yTWVzc2FnZShcbiAgICAgICAgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSxcbiAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dFN0cmVhbS5zb3VyY2UsXG4gICAgICAgIGRldGFpbCk7XG4gIH0pO1xufVxuaW5oZXJpdHMoTWF0Y2hGYWlsdXJlLCBNYXRjaFJlc3VsdCk7XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbTWF0Y2hGYWlsdXJlIGF0IHBvc2l0aW9uICcgKyB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpICsgJ10nO1xufTtcblxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5mYWlsZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdGF0ZS5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKTtcbn07XG5cbk1hdGNoRmFpbHVyZS5wcm90b3R5cGUuZ2V0UmlnaHRtb3N0RmFpbHVyZXMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX2ZhaWx1cmVzO1xufTtcblxuLy8gUmV0dXJuIGEgc3RyaW5nIHN1bW1hcml6aW5nIHRoZSBleHBlY3RlZCBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIHdoZW5cbi8vIHRoZSBtYXRjaCBmYWlsdXJlIG9jY3VycmVkLlxuTWF0Y2hGYWlsdXJlLnByb3RvdHlwZS5nZXRFeHBlY3RlZFRleHQgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgdmFyIGZhaWx1cmVzID0gdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlcygpO1xuXG4gIC8vIEZpbHRlciBvdXQgdGhlIGZsdWZmeSBmYWlsdXJlcyB0byBtYWtlIHRoZSBkZWZhdWx0IGVycm9yIG1lc3NhZ2VzIG1vcmUgdXNlZnVsXG4gIGZhaWx1cmVzID0gZmFpbHVyZXMuZmlsdGVyKGZ1bmN0aW9uKGZhaWx1cmUpIHtcbiAgICByZXR1cm4gIWZhaWx1cmUuaXNGbHVmZnkoKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZmFpbHVyZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBpZiAoaWR4ID09PSBmYWlsdXJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHNiLmFwcGVuZCgoZmFpbHVyZXMubGVuZ3RoID4gMiA/ICcsIG9yICcgOiAnIG9yICcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2IuYXBwZW5kKGZhaWx1cmVzW2lkeF0udG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuXG5NYXRjaEZhaWx1cmUucHJvdG90eXBlLmdldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwb3MgPSB0aGlzLnN0YXRlLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpO1xuICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc3RhdGUuaW5wdXRTdHJlYW0sIHBvcywgcG9zKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoUmVzdWx0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBOYW1lc3BhY2UoKSB7XG59XG5OYW1lc3BhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuTmFtZXNwYWNlLmFzTmFtZXNwYWNlID0gZnVuY3Rpb24ob2JqT3JOYW1lc3BhY2UpIHtcbiAgaWYgKG9iak9yTmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSB7XG4gICAgcmV0dXJuIG9iak9yTmFtZXNwYWNlO1xuICB9XG4gIHJldHVybiBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlKG9iak9yTmFtZXNwYWNlKTtcbn07XG5cbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXMgc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXNcbi8vIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSA9IGZ1bmN0aW9uKG9wdFByb3BzKSB7XG4gIHJldHVybiBOYW1lc3BhY2UuZXh0ZW5kKE5hbWVzcGFjZS5wcm90b3R5cGUsIG9wdFByb3BzKTtcbn07XG5cbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2Ugd2hpY2ggZXh0ZW5kcyBhbm90aGVyIG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpc1xuLy8gc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuZXh0ZW5kID0gZnVuY3Rpb24obmFtZXNwYWNlLCBvcHRQcm9wcykge1xuICBpZiAobmFtZXNwYWNlICE9PSBOYW1lc3BhY2UucHJvdG90eXBlICYmICEobmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIE5hbWVzcGFjZSBvYmplY3Q6ICcgKyBuYW1lc3BhY2UpO1xuICB9XG4gIHZhciBucyA9IE9iamVjdC5jcmVhdGUobmFtZXNwYWNlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBOYW1lc3BhY2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGV4dGVuZChucywgb3B0UHJvcHMpO1xufTtcblxuLy8gVE9ETzogU2hvdWxkIHRoaXMgYmUgYSByZWd1bGFyIG1ldGhvZD9cbk5hbWVzcGFjZS50b1N0cmluZyA9IGZ1bmN0aW9uKG5zKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobnMpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTmFtZXNwYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUG9zSW5mbyhzdGF0ZSkge1xuICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSBbXTsgIC8vIGEgc3RhY2sgb2YgXCJtZW1vIGtleXNcIiBvZiB0aGUgYWN0aXZlIGFwcGxpY2F0aW9uc1xuICB0aGlzLm1lbW8gPSB7fTtcbiAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHVuZGVmaW5lZDtcbn1cblxuUG9zSW5mby5wcm90b3R5cGUgPSB7XG4gIGlzQWN0aXZlOiBmdW5jdGlvbihhcHBsaWNhdGlvbikge1xuICAgIHJldHVybiB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmluZGV4T2YoYXBwbGljYXRpb24udG9NZW1vS2V5KCkpID49IDA7XG4gIH0sXG5cbiAgZW50ZXI6IGZ1bmN0aW9uKGFwcGxpY2F0aW9uKSB7XG4gICAgdGhpcy5zdGF0ZS5lbnRlcihhcHBsaWNhdGlvbik7XG4gICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wdXNoKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKTtcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN0YXRlLmV4aXQoKTtcbiAgICB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLnBvcCgpO1xuICB9LFxuXG4gIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oaGVhZEFwcGxpY2F0aW9uLCBtZW1vUmVjKSB7XG4gICAgbWVtb1JlYy5pc0xlZnRSZWN1cnNpb24gPSB0cnVlO1xuICAgIG1lbW9SZWMuaGVhZEFwcGxpY2F0aW9uID0gaGVhZEFwcGxpY2F0aW9uO1xuICAgIG1lbW9SZWMubmV4dExlZnRSZWN1cnNpb24gPSB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uO1xuICAgIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSBtZW1vUmVjO1xuXG4gICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjaztcbiAgICB2YXIgaW5kZXhPZkZpcnN0SW52b2x2ZWRSdWxlID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2suaW5kZXhPZihoZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkpICsgMTtcbiAgICB2YXIgaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2suc2xpY2UoaW5kZXhPZkZpcnN0SW52b2x2ZWRSdWxlKTtcblxuICAgIG1lbW9SZWMuaXNJbnZvbHZlZCA9IGZ1bmN0aW9uKGFwcGxpY2F0aW9uTWVtb0tleSkge1xuICAgICAgcmV0dXJuIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cy5pbmRleE9mKGFwcGxpY2F0aW9uTWVtb0tleSkgPj0gMDtcbiAgICB9O1xuXG4gICAgbWVtb1JlYy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvciAodmFyIGlkeCA9IGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZTsgaWR4IDwgYXBwbGljYXRpb25NZW1vS2V5U3RhY2subGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5ID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2tbaWR4XTtcbiAgICAgICAgaWYgKCF0aGlzLmlzSW52b2x2ZWQoYXBwbGljYXRpb25NZW1vS2V5KSkge1xuICAgICAgICAgIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cy5wdXNoKGFwcGxpY2F0aW9uTWVtb0tleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9LFxuXG4gIGVuZExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5leHRMZWZ0UmVjdXJzaW9uO1xuICB9LFxuXG4gIC8vIE5vdGU6IHRoaXMgbWV0aG9kIGRvZXNuJ3QgZ2V0IGNhbGxlZCBmb3IgdGhlIFwiaGVhZFwiIG9mIGEgbGVmdCByZWN1cnNpb24gLS0gZm9yIExSIGhlYWRzLFxuICAvLyB0aGUgbWVtb2l6ZWQgcmVzdWx0ICh3aGljaCBzdGFydHMgb3V0IGJlaW5nIGEgZmFpbHVyZSkgaXMgYWx3YXlzIHVzZWQuXG4gIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbihtZW1vUmVjKSB7XG4gICAgaWYgKCFtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2s7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXBwbGljYXRpb25NZW1vS2V5U3RhY2subGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrW2lkeF07XG4gICAgICBpZiAobWVtb1JlYy5pc0ludm9sdmVkKGFwcGxpY2F0aW9uTWVtb0tleSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gUG9zSW5mbztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBTeW1ib2wgPSByZXF1aXJlKCdlczYtc3ltYm9sJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgTWF0Y2hSZXN1bHQgPSByZXF1aXJlKCcuL01hdGNoUmVzdWx0Jyk7XG52YXIgSXRlcmF0aW9uTm9kZSA9IHJlcXVpcmUoJy4vbm9kZXMnKS5JdGVyYXRpb25Ob2RlO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBXcmFwcGVycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBXcmFwcGVycyBkZWNvcmF0ZSBDU1Qgbm9kZXMgd2l0aCBhbGwgb2YgdGhlIGZ1bmN0aW9uYWxpdHkgKGkuZS4sIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMpXG4vLyBwcm92aWRlZCBieSBhIFNlbWFudGljcyAoc2VlIGJlbG93KS4gYFdyYXBwZXJgIGlzIHRoZSBhYnN0cmFjdCBzdXBlcmNsYXNzIG9mIGFsbCB3cmFwcGVycy4gQVxuLy8gYFdyYXBwZXJgIG11c3QgaGF2ZSBgX25vZGVgIGFuZCBgX3NlbWFudGljc2AgaW5zdGFuY2UgdmFyaWFibGVzLCB3aGljaCByZWZlciB0byB0aGUgQ1NUIG5vZGUgYW5kXG4vLyBTZW1hbnRpY3MgKHJlc3AuKSBmb3Igd2hpY2ggaXQgd2FzIGNyZWF0ZWQsIGFuZCBhIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUgd2hpY2ggaXNcbi8vIHVzZWQgdG8gY2FjaGUgdGhlIHdyYXBwZXIgaW5zdGFuY2VzIHRoYXQgYXJlIGNyZWF0ZWQgZm9yIGl0cyBjaGlsZCBub2Rlcy4gU2V0dGluZyB0aGVzZSBpbnN0YW5jZVxuLy8gdmFyaWFibGVzIGlzIHRoZSByZXNwb25zaWJpbGl0eSBvZiB0aGUgY29uc3RydWN0b3Igb2YgZWFjaCBTZW1hbnRpY3Mtc3BlY2lmaWMgc3ViY2xhc3Mgb2Zcbi8vIGBXcmFwcGVyYC5cbmZ1bmN0aW9uIFdyYXBwZXIoKSB7fVxuXG5XcmFwcGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tzZW1hbnRpY3Mgd3JhcHBlciBmb3IgJyArIHRoaXMuX25vZGUuZ3JhbW1hci5uYW1lICsgJ10nO1xufTtcblxuV3JhcHBlci5wcm90b3R5cGUuX2ZvcmdldE1lbW9pemVkUmVzdWx0Rm9yID0gZnVuY3Rpb24oYXR0cmlidXRlTmFtZSkge1xuICAvLyBSZW1vdmUgdGhlIG1lbW9pemVkIGF0dHJpYnV0ZSBmcm9tIHRoZSBjc3ROb2RlIGFuZCBhbGwgaXRzIGNoaWxkcmVuLlxuICBkZWxldGUgdGhpcy5fbm9kZVt0aGlzLl9zZW1hbnRpY3MuYXR0cmlidXRlS2V5c1thdHRyaWJ1dGVOYW1lXV07XG4gIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgIGNoaWxkLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvcihhdHRyaWJ1dGVOYW1lKTtcbiAgfSk7XG59O1xuXG4vLyBSZXR1cm5zIHRoZSB3cmFwcGVyIG9mIHRoZSBzcGVjaWZpZWQgY2hpbGQgbm9kZS4gQ2hpbGQgd3JhcHBlcnMgYXJlIGNyZWF0ZWQgbGF6aWx5IGFuZCBjYWNoZWQgaW5cbi8vIHRoZSBwYXJlbnQgd3JhcHBlcidzIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUuXG5XcmFwcGVyLnByb3RvdHlwZS5jaGlsZCA9IGZ1bmN0aW9uKGlkeCkge1xuICBpZiAoISgwIDw9IGlkeCAmJiBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCkpKSB7XG4gICAgLy8gVE9ETzogQ29uc2lkZXIgdGhyb3dpbmcgYW4gZXhjZXB0aW9uIGhlcmUuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdO1xuICBpZiAoIWNoaWxkV3JhcHBlcikge1xuICAgIGNoaWxkV3JhcHBlciA9IHRoaXMuX2NoaWxkV3JhcHBlcnNbaWR4XSA9IHRoaXMuX3NlbWFudGljcy53cmFwKHRoaXMuX25vZGUuY2hpbGRBdChpZHgpKTtcbiAgfVxuICByZXR1cm4gY2hpbGRXcmFwcGVyO1xufTtcblxuLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSB3cmFwcGVycyBvZiBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzXG4vLyB3cmFwcGVyLlxuV3JhcHBlci5wcm90b3R5cGUuX2NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIC8vIEZvcmNlIHRoZSBjcmVhdGlvbiBvZiBhbGwgY2hpbGQgd3JhcHBlcnNcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpOyBpZHgrKykge1xuICAgIHRoaXMuY2hpbGQoaWR4KTtcbiAgfVxuICByZXR1cm4gdGhpcy5fY2hpbGRXcmFwcGVycztcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGNvcnJlc3BvbmRzIHRvIGFuIGl0ZXJhdGlvblxuLy8gZXhwcmVzc2lvbiwgaS5lLiwgYSBLbGVlbmUtKiwgS2xlZW5lLSssIG9yIGFuIG9wdGlvbmFsLiBSZXR1cm5zIGBmYWxzZWAgb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNJdGVyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX25vZGUuaXNJdGVyYXRpb24oKTtcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgdGVybWluYWwgbm9kZSwgYGZhbHNlYFxuLy8gb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5pc1Rlcm1pbmFsKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbi8vIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzTm9udGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX25vZGUuaXNOb250ZXJtaW5hbCgpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlXG4vLyBjb3JyZXNwb25kaW5nIHRvIGEgc3ludGFjdGljIHJ1bGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNTeW50YWN0aWMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaXNOb250ZXJtaW5hbCgpICYmIHRoaXMuX25vZGUuaXNTeW50YWN0aWMoKTtcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZVxuLy8gY29ycmVzcG9uZGluZyB0byBhIGxleGljYWwgcnVsZSwgYGZhbHNlYCBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc0xleGljYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaXNOb250ZXJtaW5hbCgpICYmIHRoaXMuX25vZGUuaXNMZXhpY2FsKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhbiBpdGVyYXRvciBub2RlXG4vLyBoYXZpbmcgZWl0aGVyIG9uZSBvciBubyBjaGlsZCAoPyBvcGVyYXRvciksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuLy8gT3RoZXJ3aXNlLCB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuV3JhcHBlci5wcm90b3R5cGUuaXNPcHRpb25hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5pc09wdGlvbmFsKCk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgSXRlcmF0aW9uTm9kZSBpbiB0aGUgc2FtZSBzZW1hbnRpY3MgYXMgdGhpcyB3cmFwcGVyLlxuV3JhcHBlci5wcm90b3R5cGUuaXRlcmF0aW9uID0gZnVuY3Rpb24ob3B0RWxlbWVudHMpIHtcbiAgdmFyIGl0ZXIgPSBuZXcgSXRlcmF0aW9uTm9kZSh0aGlzLl9ub2RlLmdyYW1tYXIsIG9wdEVsZW1lbnRzIHx8IFtdLCB0aGlzLmludGVydmFsLCBmYWxzZSk7XG4gIHJldHVybiB0aGlzLl9zZW1hbnRpY3Mud3JhcChpdGVyKTtcbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyYXBwZXIucHJvdG90eXBlLCB7XG4gIC8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgY2hpbGRyZW4gb2YgdGhpcyBDU1Qgbm9kZS5cbiAgY2hpbGRyZW46IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fY2hpbGRyZW4oKTsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbmFtZSBvZiBncmFtbWFyIHJ1bGUgdGhhdCBjcmVhdGVkIHRoaXMgQ1NUIG5vZGUuXG4gIGN0b3JOYW1lOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX25vZGUuY3Rvck5hbWU7IH19LFxuXG4gIC8vIFJldHVybnMgdGhlIGludGVydmFsIGNvbnN1bWVkIGJ5IHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyLlxuICBpbnRlcnZhbDoge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9ub2RlLmludGVydmFsOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gb2YgdGhpcyBDU1Qgbm9kZS5cbiAgbnVtQ2hpbGRyZW46IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBwcmltaXRpdmUgdmFsdWUgb2YgdGhpcyBDU1Qgbm9kZSwgaWYgaXQncyBhIHRlcm1pbmFsIG5vZGUuIE90aGVyd2lzZSxcbiAgLy8gdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgcHJpbWl0aXZlVmFsdWU6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuaXNUZXJtaW5hbCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlLnByaW1pdGl2ZVZhbHVlO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcInRyaWVkIHRvIGFjY2VzcyB0aGUgJ3ByaW1pdGl2ZVZhbHVlJyBhdHRyaWJ1dGUgb2YgYSBub24tdGVybWluYWwgQ1NUIG5vZGVcIik7XG4gICAgfVxuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gU2VtYW50aWNzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEEgU2VtYW50aWNzIGlzIGEgY29udGFpbmVyIGZvciBhIGZhbWlseSBvZiBPcGVyYXRpb25zIGFuZCBBdHRyaWJ1dGVzIGZvciBhIGdpdmVuIGdyYW1tYXIuXG4vLyBTZW1hbnRpY3MgZW5hYmxlIG1vZHVsYXJpdHkgKGRpZmZlcmVudCBjbGllbnRzIG9mIGEgZ3JhbW1hciBjYW4gY3JlYXRlIHRoZWlyIHNldCBvZiBvcGVyYXRpb25zXG4vLyBhbmQgYXR0cmlidXRlcyBpbiBpc29sYXRpb24pIGFuZCBleHRlbnNpYmlsaXR5IGV2ZW4gd2hlbiBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGFyZSBtdXR1YWxseS1cbi8vIHJlY3Vyc2l2ZS4gVGhpcyBjb25zdHJ1Y3RvciBzaG91bGQgbm90IGJlIGNhbGxlZCBkaXJlY3RseSBleGNlcHQgZnJvbVxuLy8gYFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3NgLiBUaGUgbm9ybWFsIHdheXMgdG8gY3JlYXRlIGEgU2VtYW50aWNzLCBnaXZlbiBhIGdyYW1tYXIgJ2cnLCBhcmVcbi8vIGBnLnNlbWFudGljcygpYCBhbmQgYGcuZXh0ZW5kU2VtYW50aWNzKHBhcmVudFNlbWFudGljcylgLlxuZnVuY3Rpb24gU2VtYW50aWNzKGdyYW1tYXIsIHN1cGVyU2VtYW50aWNzKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSBmYWxzZTtcblxuICAvLyBDb25zdHJ1Y3RvciBmb3Igd3JhcHBlciBpbnN0YW5jZXMsIHdoaWNoIGFyZSBwYXNzZWQgYXMgdGhlIGFyZ3VtZW50cyB0byB0aGUgc2VtYW50aWMgYWN0aW9uc1xuICAvLyBvZiBhbiBvcGVyYXRpb24gb3IgYXR0cmlidXRlLiBPcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIHJlcXVpcmUgZG91YmxlIGRpc3BhdGNoOiB0aGUgc2VtYW50aWNcbiAgLy8gYWN0aW9uIGlzIGNob3NlbiBiYXNlZCBvbiBib3RoIHRoZSBub2RlJ3MgdHlwZSBhbmQgdGhlIHNlbWFudGljcy4gV3JhcHBlcnMgZW5zdXJlIHRoYXRcbiAgLy8gdGhlIGBleGVjdXRlYCBtZXRob2QgaXMgY2FsbGVkIHdpdGggdGhlIGNvcnJlY3QgKG1vc3Qgc3BlY2lmaWMpIHNlbWFudGljcyBvYmplY3QgYXMgYW5cbiAgLy8gYXJndW1lbnQuXG4gIHRoaXMuV3JhcHBlciA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICBzZWxmLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkoKTtcbiAgICB0aGlzLl9zZW1hbnRpY3MgPSBzZWxmO1xuICAgIHRoaXMuX25vZGUgPSBub2RlO1xuICAgIHRoaXMuX2NoaWxkV3JhcHBlcnMgPSBbXTtcbiAgfTtcblxuICB0aGlzLnN1cGVyID0gc3VwZXJTZW1hbnRpY3M7XG4gIGlmIChzdXBlclNlbWFudGljcykge1xuICAgIGlmIChncmFtbWFyICE9PSB0aGlzLnN1cGVyLmdyYW1tYXIgJiYgIWdyYW1tYXIuX2luaGVyaXRzRnJvbSh0aGlzLnN1cGVyLmdyYW1tYXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDYW5ub3QgZXh0ZW5kIGEgc2VtYW50aWNzIGZvciBncmFtbWFyICdcIiArIHRoaXMuc3VwZXIuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgZm9yIHVzZSB3aXRoIGdyYW1tYXIgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInIChub3QgYSBzdWItZ3JhbW1hcilcIik7XG4gICAgfVxuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgdGhpcy5zdXBlci5XcmFwcGVyKTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIub3BlcmF0aW9ucyk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBBc3NpZ24gdW5pcXVlIHN5bWJvbHMgZm9yIGVhY2ggb2YgdGhlIGF0dHJpYnV0ZXMgaW5oZXJpdGVkIGZyb20gdGhlIHN1cGVyLXNlbWFudGljcyBzbyB0aGF0XG4gICAgLy8gdGhleSBhcmUgbWVtb2l6ZWQgaW5kZXBlbmRlbnRseS5cbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdID0gU3ltYm9sKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgV3JhcHBlcik7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cbn1cblxuU2VtYW50aWNzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tzZW1hbnRpY3MgZm9yICcgKyB0aGlzLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzKSB7XG4gICAgdGhpcy5jaGVja0FjdGlvbkRpY3RzKCk7XG4gICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSB0cnVlO1xuICB9XG59O1xuXG4vLyBDaGVja3MgdGhhdCB0aGUgYWN0aW9uIGRpY3Rpb25hcmllcyBmb3IgYWxsIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgaW4gdGhpcyBzZW1hbnRpY3MsXG4vLyBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdCB3ZXJlIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3MsIGFncmVlIHdpdGggdGhlIGdyYW1tYXIuXG4vLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIG9uZSBvciBtb3JlIG9mIHRoZW0gZG9lc24ndC5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0cyA9IGZ1bmN0aW9uKCkge1xuICBmb3IgKHZhciBuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgfVxuICBmb3IgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLnRvUmVjaXBlID0gZnVuY3Rpb24oc2VtYW50aWNzT25seSkge1xuICBmdW5jdGlvbiBoYXNTdXBlclNlbWFudGljcyhzKSB7XG4gICAgcmV0dXJuIHMuc3VwZXIgIT09IFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKTtcbiAgfVxuXG4gIHZhciBzdHIgPSAnKGZ1bmN0aW9uKGcpIHtcXG4nO1xuICBpZiAoaGFzU3VwZXJTZW1hbnRpY3ModGhpcykpIHtcbiAgICBzdHIgKz0gJyAgdmFyIHNlbWFudGljcyA9ICcgKyB0aGlzLnN1cGVyLnRvUmVjaXBlKHRydWUpICsgJyhnJztcblxuICAgIHZhciBzdXBlclNlbWFudGljc0dyYW1tYXIgPSB0aGlzLnN1cGVyLmdyYW1tYXI7XG4gICAgdmFyIHJlbGF0ZWRHcmFtbWFyID0gdGhpcy5ncmFtbWFyO1xuICAgIHdoaWxlIChyZWxhdGVkR3JhbW1hciAhPT0gc3VwZXJTZW1hbnRpY3NHcmFtbWFyKSB7XG4gICAgICBzdHIgKz0gJy5zdXBlckdyYW1tYXInO1xuICAgICAgcmVsYXRlZEdyYW1tYXIgPSByZWxhdGVkR3JhbW1hci5zdXBlckdyYW1tYXI7XG4gICAgfVxuXG4gICAgc3RyICs9ICcpO1xcbic7XG4gICAgc3RyICs9ICcgIHJldHVybiBnLmV4dGVuZFNlbWFudGljcyhzZW1hbnRpY3MpJztcbiAgfSBlbHNlIHtcbiAgICBzdHIgKz0gJyAgcmV0dXJuIGcuc2VtYW50aWNzKCknO1xuICB9XG4gIFsnT3BlcmF0aW9uJywgJ0F0dHJpYnV0ZSddLmZvckVhY2goZnVuY3Rpb24odHlwZSkge1xuICAgIHZhciBzZW1hbnRpY09wZXJhdGlvbnMgPSB0aGlzW3R5cGUudG9Mb3dlckNhc2UoKSArICdzJ107XG4gICAgT2JqZWN0LmtleXMoc2VtYW50aWNPcGVyYXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBzaWduYXR1cmUgPSBuYW1lO1xuICAgICAgaWYgKHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5mb3JtYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2lnbmF0dXJlICs9ICcoJyArIHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5mb3JtYWxzLmpvaW4oJywgJykgKyAnKSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBtZXRob2Q7XG4gICAgICBpZiAoaGFzU3VwZXJTZW1hbnRpY3ModGhpcykgJiYgdGhpcy5zdXBlclt0eXBlLnRvTG93ZXJDYXNlKCkgKyAncyddW25hbWVdKSB7XG4gICAgICAgIG1ldGhvZCA9ICdleHRlbmQnICsgdHlwZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1ldGhvZCA9ICdhZGQnICsgdHlwZTtcbiAgICAgIH1cbiAgICAgIHN0ciArPSAnXFxuICAgIC4nICsgbWV0aG9kICsgJygnICsgSlNPTi5zdHJpbmdpZnkoc2lnbmF0dXJlKSArICcsIHsnO1xuXG4gICAgICB2YXIgYWN0aW9ucyA9IHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5hY3Rpb25EaWN0O1xuICAgICAgdmFyIHNyY0FycmF5ID0gW107XG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5idWlsdEluRGVmYXVsdCAhPT0gYWN0aW9uc1thY3Rpb25OYW1lXSkge1xuICAgICAgICAgIHNyY0FycmF5LnB1c2goJ1xcbiAgICAgICcgKyBKU09OLnN0cmluZ2lmeShhY3Rpb25OYW1lKSArICc6ICcgK1xuICAgICAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzdHIgKz0gc3JjQXJyYXkuam9pbignLCcpO1xuXG4gICAgICBzdHIgKz0gJ1xcbiAgICB9KSc7XG4gICAgfSwgdGhpcyk7XG4gIH0sIHRoaXMpO1xuICBzdHIgKz0gJztcXG4gIH0pJztcblxuICBpZiAoIXNlbWFudGljc09ubHkpIHtcbiAgICBzdHIgPVxuICAgICAgJyhmdW5jdGlvbigpIHtcXG4nICtcbiAgICAgICcgIHZhciBidWlsZEdyYW1tYXIgPSAnICsgdGhpcy5ncmFtbWFyLnRvUmVjaXBlKCkgK1xuICAgICAgJyAgdmFyIGdyYW1tYXIgPSBidWlsZEdyYW1tYXIuY2FsbCh0aGlzKTtcXG4nICtcbiAgICAgICcgIHZhciBzZW1hbnRpY3MgPSAnICsgc3RyICsgJyhncmFtbWFyKTtcXG4nICtcbiAgICAgICcgIHJldHVybiBzZW1hbnRpY3M7XFxuJyArXG4gICAgICAnfSk7XFxuJztcbiAgfVxuXG4gIHJldHVybiBzdHI7XG59O1xuXG52YXIgcHJvdG90eXBlR3JhbW1hcjtcbnZhciBwcm90b3R5cGVHcmFtbWFyU2VtYW50aWNzO1xuXG4vLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBtYWluLmpzIG9uY2UgT2htIGhhcyBsb2FkZWQuXG5TZW1hbnRpY3MuaW5pdFByb3RvdHlwZVBhcnNlciA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyA9IGdyYW1tYXIuc2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCdwYXJzZScsIHtcbiAgICBBdHRyaWJ1dGVTaWduYXR1cmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgZm9ybWFsczogW11cbiAgICAgIH07XG4gICAgfSxcbiAgICBPcGVyYXRpb25TaWduYXR1cmU6IGZ1bmN0aW9uKG5hbWUsIG9wdEZvcm1hbHMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgZm9ybWFsczogb3B0Rm9ybWFscy5wYXJzZSgpWzBdIHx8IFtdXG4gICAgICB9O1xuICAgIH0sXG4gICAgRm9ybWFsczogZnVuY3Rpb24ob3BhcmVuLCBmcywgY3BhcmVuKSB7XG4gICAgICByZXR1cm4gZnMuYXNJdGVyYXRpb24oKS5wYXJzZSgpO1xuICAgIH0sXG4gICAgbmFtZTogZnVuY3Rpb24oZmlyc3QsIHJlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLmludGVydmFsLmNvbnRlbnRzO1xuICAgIH1cbiAgfSk7XG4gIHByb3RvdHlwZUdyYW1tYXIgPSBncmFtbWFyO1xufTtcblxuZnVuY3Rpb24gcGFyc2VTaWduYXR1cmUoc2lnbmF0dXJlLCB0eXBlKSB7XG4gIGlmICghcHJvdG90eXBlR3JhbW1hcikge1xuICAgIC8vIFRoZSBPcGVyYXRpb25zIGFuZCBBdHRyaWJ1dGVzIGdyYW1tYXIgd29uJ3QgYmUgYXZhaWxhYmxlIHdoaWxlIE9obSBpcyBsb2FkaW5nLFxuICAgIC8vIGJ1dCB3ZSBjYW4gZ2V0IGF3YXkgdGhlIGZvbGxvd2luZyBzaW1wbGlmaWNhdGlvbiBiL2Mgbm9uZSBvZiB0aGUgb3BlcmF0aW9uc1xuICAgIC8vIHRoYXQgYXJlIHVzZWQgd2hpbGUgbG9hZGluZyB0YWtlIGFyZ3VtZW50cy5cbiAgICBjb21tb24uYXNzZXJ0KHNpZ25hdHVyZS5pbmRleE9mKCcoJykgPT09IC0xKTtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogc2lnbmF0dXJlLFxuICAgICAgZm9ybWFsczogW11cbiAgICB9O1xuICB9XG5cbiAgdmFyIHIgPSBwcm90b3R5cGVHcmFtbWFyLm1hdGNoKFxuICAgICAgc2lnbmF0dXJlLFxuICAgICAgdHlwZSA9PT0gJ29wZXJhdGlvbicgPyAnT3BlcmF0aW9uU2lnbmF0dXJlJyA6ICdBdHRyaWJ1dGVTaWduYXR1cmUnKTtcbiAgaWYgKHIuZmFpbGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioci5tZXNzYWdlKTtcbiAgfVxuXG4gIHJldHVybiBwcm90b3R5cGVHcmFtbWFyU2VtYW50aWNzKHIpLnBhcnNlKCk7XG59XG5cbmZ1bmN0aW9uIG5ld0RlZmF1bHRBY3Rpb24odHlwZSwgbmFtZSwgZG9JdCkge1xuICByZXR1cm4gZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHRoaXNUaGluZyA9IHRoaXMuX3NlbWFudGljcy5vcGVyYXRpb25zW25hbWVdIHx8IHRoaXMuX3NlbWFudGljcy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgIHZhciBhcmdzID0gdGhpc1RoaW5nLmZvcm1hbHMubWFwKGZ1bmN0aW9uKGZvcm1hbCkge1xuICAgICAgcmV0dXJuIHNlbGYuYXJnc1tmb3JtYWxdO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaXNJdGVyYXRpb24oKSkge1xuICAgICAgLy8gVGhpcyBDU1Qgbm9kZSBjb3JyZXNwb25kcyB0byBhbiBpdGVyYXRpb24gZXhwcmVzc2lvbiBpbiB0aGUgZ3JhbW1hciAoKiwgKywgb3IgPykuIFRoZVxuICAgICAgLy8gZGVmYXVsdCBiZWhhdmlvciBpcyB0byBtYXAgdGhpcyBvcGVyYXRpb24gb3IgYXR0cmlidXRlIG92ZXIgYWxsIG9mIGl0cyBjaGlsZCBub2Rlcy5cbiAgICAgIHJldHVybiBjaGlsZHJlbi5tYXAoZnVuY3Rpb24oY2hpbGQpIHsgcmV0dXJuIGRvSXQuYXBwbHkoY2hpbGQsIGFyZ3MpOyB9KTtcbiAgICB9XG5cbiAgICAvLyBUaGlzIENTVCBub2RlIGNvcnJlc3BvbmRzIHRvIGEgbm9uLXRlcm1pbmFsIGluIHRoZSBncmFtbWFyIChlLmcuLCBBZGRFeHByKS4gVGhlIGZhY3QgdGhhdFxuICAgIC8vIHdlIGdvdCBoZXJlIG1lYW5zIHRoYXQgdGhpcyBhY3Rpb24gZGljdGlvbmFyeSBkb2Vzbid0IGhhdmUgYW4gYWN0aW9uIGZvciB0aGlzIHBhcnRpY3VsYXJcbiAgICAvLyBub24tdGVybWluYWwgb3IgYSBnZW5lcmljIGBfbm9udGVybWluYWxgIGFjdGlvbi5cbiAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAvLyBBcyBhIGNvbnZlbmllbmNlLCBpZiB0aGlzIG5vZGUgb25seSBoYXMgb25lIGNoaWxkLCB3ZSBqdXN0IHJldHVybiB0aGUgcmVzdWx0IG9mXG4gICAgICAvLyBhcHBseWluZyB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgIHJldHVybiBkb0l0LmFwcGx5KGNoaWxkcmVuWzBdLCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSB0aHJvdyBhbiBleGNlcHRpb24gdG8gbGV0IHRoZSBwcm9ncmFtbWVyIGtub3cgdGhhdCB3ZSBkb24ndCBrbm93IHdoYXRcbiAgICAgIC8vIHRvIGRvIHdpdGggdGhpcyBub2RlLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdNaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3IgJyArIHRoaXMuY3Rvck5hbWUgKyAnIGluICcgKyBuYW1lICsgJyAnICsgdHlwZSk7XG4gICAgfVxuICB9O1xufVxuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KSB7XG4gIHZhciB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcblxuICB2YXIgcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MgPSBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpO1xuICB2YXIgbmFtZSA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLm5hbWU7XG4gIHZhciBmb3JtYWxzID0gcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MuZm9ybWFscztcblxuICAvLyBUT0RPOiBjaGVjayB0aGF0IHRoZXJlIGFyZSBubyBkdXBsaWNhdGUgZm9ybWFsIGFyZ3VtZW50c1xuXG4gIHRoaXMuYXNzZXJ0TmV3TmFtZShuYW1lLCB0eXBlKTtcblxuICAvLyBDcmVhdGUgdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGZvciB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0aGF0IGNvbnRhaW5zIGEgYF9kZWZhdWx0YCBhY3Rpb25cbiAgLy8gd2hpY2ggZGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiBpdGVyYXRpb24sIHRlcm1pbmFsLCBhbmQgbm9uLXRlcm1pbmFsIG5vZGVzLi4uXG4gIHZhciBidWlsdEluRGVmYXVsdCA9IG5ld0RlZmF1bHRBY3Rpb24odHlwZSwgbmFtZSwgZG9JdCk7XG4gIHZhciByZWFsQWN0aW9uRGljdCA9IHtfZGVmYXVsdDogYnVpbHRJbkRlZmF1bHR9O1xuICAvLyAuLi4gYW5kIGFkZCBpbiB0aGUgYWN0aW9ucyBzdXBwbGllZCBieSB0aGUgcHJvZ3JhbW1lciwgd2hpY2ggbWF5IG92ZXJyaWRlIHNvbWUgb3IgYWxsIG9mIHRoZVxuICAvLyBkZWZhdWx0IG9uZXMuXG4gIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJlYWxBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgfSk7XG5cbiAgdmFyIGVudHJ5ID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgP1xuICAgICAgbmV3IE9wZXJhdGlvbihuYW1lLCBmb3JtYWxzLCByZWFsQWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIDpcbiAgICAgIG5ldyBBdHRyaWJ1dGUobmFtZSwgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KTtcblxuICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgZW50cnkuY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG5cbiAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9IGVudHJ5O1xuXG4gIGZ1bmN0aW9uIGRvSXQoKSB7XG4gICAgLy8gRGlzcGF0Y2ggdG8gbW9zdCBzcGVjaWZpYyB2ZXJzaW9uIG9mIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIC0tIGl0IG1heSBoYXZlIGJlZW5cbiAgICAvLyBvdmVycmlkZGVuIGJ5IGEgc3ViLXNlbWFudGljcy5cbiAgICB2YXIgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzW3R5cGVQbHVyYWxdW25hbWVdO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgY2FsbGVyIHBhc3NlZCB0aGUgY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZCB0byAnICsgbmFtZSArICcgJyArIHR5cGUgKyAnIChleHBlY3RlZCAnICtcbiAgICAgICAgICB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGggKyAnLCBnb3QgJyArIGFyZ3VtZW50cy5sZW5ndGggKyAnKScpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhbiBcImFyZ3VtZW50cyBvYmplY3RcIiBmcm9tIHRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGlzXG4gICAgLy8gb3BlcmF0aW9uIC8gYXR0cmlidXRlLlxuICAgIHZhciBhcmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGZvcm1hbCA9IHRoaXNUaGluZy5mb3JtYWxzW2lkeF07XG4gICAgICBhcmdzW2Zvcm1hbF0gPSBhcmd1bWVudHNbaWR4XTtcbiAgICB9XG5cbiAgICB2YXIgb2xkQXJncyA9IHRoaXMuYXJncztcbiAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIHZhciBhbnMgPSB0aGlzVGhpbmcuZXhlY3V0ZSh0aGlzLl9zZW1hbnRpY3MsIHRoaXMpO1xuICAgIHRoaXMuYXJncyA9IG9sZEFyZ3M7XG4gICAgcmV0dXJuIGFucztcbiAgfVxuXG4gIGlmICh0eXBlID09PSAnb3BlcmF0aW9uJykge1xuICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0gPSBkb0l0O1xuICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0udG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnWycgKyBuYW1lICsgJyBvcGVyYXRpb25dJztcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLldyYXBwZXIucHJvdG90eXBlLCBuYW1lLCB7Z2V0OiBkb0l0fSk7XG4gICAgdGhpcy5hdHRyaWJ1dGVLZXlzW25hbWVdID0gU3ltYm9sKCk7XG4gIH1cbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gIHZhciB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcblxuICAvLyBNYWtlIHN1cmUgdGhhdCBgbmFtZWAgcmVhbGx5IGlzIGp1c3QgYSBuYW1lLCBpLmUuLCB0aGF0IGl0IGRvZXNuJ3QgYWxzbyBjb250YWluIGZvcm1hbHMuXG4gIHBhcnNlU2lnbmF0dXJlKG5hbWUsICdhdHRyaWJ1dGUnKTtcblxuICBpZiAoISh0aGlzLnN1cGVyICYmIG5hbWUgaW4gdGhpcy5zdXBlclt0eXBlUGx1cmFsXSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBleHRlbmQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICtcbiAgICAgICAgXCInOiBkaWQgbm90IGluaGVyaXQgYW4gXCIgKyB0eXBlICsgJyB3aXRoIHRoYXQgbmFtZScpO1xuICB9XG4gIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpc1t0eXBlUGx1cmFsXSwgbmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBleHRlbmQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInIGFnYWluXCIpO1xuICB9XG5cbiAgLy8gQ3JlYXRlIGEgbmV3IG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB3aG9zZSBhY3Rpb25EaWN0IGRlbGVnYXRlcyB0byB0aGUgc3VwZXIgb3BlcmF0aW9uIC9cbiAgLy8gYXR0cmlidXRlJ3MgYWN0aW9uRGljdCwgYW5kIHdoaWNoIGhhcyBhbGwgdGhlIGtleXMgZnJvbSBgaW5oZXJpdGVkQWN0aW9uRGljdGAuXG4gIHZhciBpbmhlcml0ZWRGb3JtYWxzID0gdGhpc1t0eXBlUGx1cmFsXVtuYW1lXS5mb3JtYWxzO1xuICB2YXIgaW5oZXJpdGVkQWN0aW9uRGljdCA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uYWN0aW9uRGljdDtcbiAgdmFyIG5ld0FjdGlvbkRpY3QgPSBPYmplY3QuY3JlYXRlKGluaGVyaXRlZEFjdGlvbkRpY3QpO1xuICBPYmplY3Qua2V5cyhhY3Rpb25EaWN0KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuZXdBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgfSk7XG5cbiAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9IHR5cGUgPT09ICdvcGVyYXRpb24nID9cbiAgICAgIG5ldyBPcGVyYXRpb24obmFtZSwgaW5oZXJpdGVkRm9ybWFscywgbmV3QWN0aW9uRGljdCkgOlxuICAgICAgbmV3IEF0dHJpYnV0ZShuYW1lLCBuZXdBY3Rpb25EaWN0KTtcblxuICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuYXNzZXJ0TmV3TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHR5cGUpIHtcbiAgaWYgKFdyYXBwZXIucHJvdG90eXBlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IHRoYXQncyBhIHJlc2VydmVkIG5hbWVcIik7XG4gIH1cbiAgaWYgKG5hbWUgaW4gdGhpcy5vcGVyYXRpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IGFuIG9wZXJhdGlvbiB3aXRoIHRoYXQgbmFtZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgfVxuICBpZiAobmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogYW4gYXR0cmlidXRlIHdpdGggdGhhdCBuYW1lIGFscmVhZHkgZXhpc3RzXCIpO1xuICB9XG59O1xuXG4vLyBSZXR1cm5zIGEgd3JhcHBlciBmb3IgdGhlIGdpdmVuIENTVCBgbm9kZWAgaW4gdGhpcyBzZW1hbnRpY3MuXG4vLyBJZiBgbm9kZWAgaXMgYWxyZWFkeSBhIHdyYXBwZXIsIHJldHVybnMgYG5vZGVgIGl0c2VsZi4gIC8vIFRPRE86IHdoeSBpcyB0aGlzIG5lZWRlZD9cblNlbWFudGljcy5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiB0aGlzLldyYXBwZXIgPyBub2RlIDogbmV3IHRoaXMuV3JhcHBlcihub2RlKTtcbn07XG5cbi8vIENyZWF0ZXMgYSBuZXcgU2VtYW50aWNzIGluc3RhbmNlIGZvciBgZ3JhbW1hcmAsIGluaGVyaXRpbmcgb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBmcm9tXG4vLyBgb3B0U3VwZXJTZW1hbnRpY3NgLCBpZiBpdCBpcyBzcGVjaWZpZWQuIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBwcm94eSBmb3IgdGhlIG5ld1xuLy8gU2VtYW50aWNzIGluc3RhbmNlLiBXaGVuIHRoYXQgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIGEgQ1NUIG5vZGUgYXMgYW4gYXJndW1lbnQsIGl0IHJldHVybnNcbi8vIGEgd3JhcHBlciBmb3IgdGhhdCBub2RlIHdoaWNoIGdpdmVzIGFjY2VzcyB0byB0aGUgb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBwcm92aWRlZCBieSB0aGlzXG4vLyBzZW1hbnRpY3MuXG5TZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzID0gZnVuY3Rpb24oZ3JhbW1hciwgb3B0U3VwZXJTZW1hbnRpY3MpIHtcbiAgdmFyIHMgPSBuZXcgU2VtYW50aWNzKFxuICAgICAgZ3JhbW1hcixcbiAgICAgIG9wdFN1cGVyU2VtYW50aWNzICE9PSB1bmRlZmluZWQgP1xuICAgICAgICAgIG9wdFN1cGVyU2VtYW50aWNzIDpcbiAgICAgICAgICBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCkpO1xuXG4gIC8vIFRvIGVuYWJsZSBjbGllbnRzIHRvIGludm9rZSBhIHNlbWFudGljcyBsaWtlIGEgZnVuY3Rpb24sIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIHByb3h5XG4gIC8vIGZvciBgc2AsIHdoaWNoIGlzIHRoZSByZWFsIGBTZW1hbnRpY3NgIGluc3RhbmNlLlxuICB2YXIgcHJveHkgPSBmdW5jdGlvbiBBU2VtYW50aWNzKG1hdGNoUmVzdWx0KSB7XG4gICAgaWYgKCEobWF0Y2hSZXN1bHQgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ1NlbWFudGljcyBleHBlY3RlZCBhIE1hdGNoUmVzdWx0LCBidXQgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKG1hdGNoUmVzdWx0KSk7XG4gICAgfVxuICAgIGlmICghbWF0Y2hSZXN1bHQuc3VjY2VlZGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ2Nhbm5vdCBhcHBseSBTZW1hbnRpY3MgdG8gJyArIG1hdGNoUmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHZhciBjc3QgPSBtYXRjaFJlc3VsdC5fY3N0O1xuICAgIGlmIChjc3QuZ3JhbW1hciAhPT0gZ3JhbW1hcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQ2Fubm90IHVzZSBhIENTVCBub2RlIGNyZWF0ZWQgYnkgZ3JhbW1hciAnXCIgKyBjc3QuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgd2l0aCBhIHNlbWFudGljcyBmb3IgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInXCIpO1xuICAgIH1cbiAgICByZXR1cm4gcy53cmFwKGNzdCk7XG4gIH07XG5cbiAgLy8gRm9yd2FyZCBwdWJsaWMgbWV0aG9kcyBmcm9tIHRoZSBwcm94eSB0byB0aGUgc2VtYW50aWNzIGluc3RhbmNlLlxuICBwcm94eS5hZGRPcGVyYXRpb24gPSBmdW5jdGlvbihzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlLmNhbGwocywgJ29wZXJhdGlvbicsIHNpZ25hdHVyZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5leHRlbmRPcGVyYXRpb24gPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZS5jYWxsKHMsICdvcGVyYXRpb24nLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICByZXR1cm4gcHJveHk7XG4gIH07XG4gIHByb3h5LmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlLmNhbGwocywgJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuZXh0ZW5kQXR0cmlidXRlID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUuY2FsbChzLCAnYXR0cmlidXRlJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5fZ2V0QWN0aW9uRGljdCA9IGZ1bmN0aW9uKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSkge1xuICAgIHZhciBhY3Rpb24gPSBzLm9wZXJhdGlvbnNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXSB8fCBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICBpZiAoIWFjdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgKyAnXCIgaXMgbm90IGEgdmFsaWQgb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZSAnICtcbiAgICAgICAgJ25hbWUgaW4gdGhpcyBzZW1hbnRpY3MgZm9yIFwiJyArIGdyYW1tYXIubmFtZSArICdcIicpO1xuICAgIH1cbiAgICByZXR1cm4gYWN0aW9uLmFjdGlvbkRpY3Q7XG4gIH07XG4gIHByb3h5LmdldE9wZXJhdGlvbk5hbWVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHMub3BlcmF0aW9ucyk7XG4gIH07XG4gIHByb3h5LmdldEF0dHJpYnV0ZU5hbWVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHMuYXR0cmlidXRlcyk7XG4gIH07XG4gIHByb3h5LmdldEdyYW1tYXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcy5ncmFtbWFyO1xuICB9O1xuICBwcm94eS50b1JlY2lwZSA9IGZ1bmN0aW9uKHNlbWFudGljc09ubHkpIHtcbiAgICByZXR1cm4gcy50b1JlY2lwZShzZW1hbnRpY3NPbmx5KTtcbiAgfTtcblxuICAvLyBNYWtlIHRoZSBwcm94eSdzIHRvU3RyaW5nKCkgd29yay5cbiAgcHJveHkudG9TdHJpbmcgPSBzLnRvU3RyaW5nLmJpbmQocyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgc2VtYW50aWNzIGZvciB0aGUgcHJveHkuXG4gIHByb3h5Ll9nZXRTZW1hbnRpY3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcztcbiAgfTtcblxuICByZXR1cm4gcHJveHk7XG59O1xuXG5TZW1hbnRpY3MuaW5pdEJ1aWx0SW5TZW1hbnRpY3MgPSBmdW5jdGlvbihidWlsdEluUnVsZXMpIHtcbiAgdmFyIGFjdGlvbnMgPSB7XG4gICAgZW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0aW9uKCk7XG4gICAgfSxcbiAgICBub25FbXB0eTogZnVuY3Rpb24oZmlyc3QsIF8sIHJlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZXJhdGlvbihbZmlyc3RdLmNvbmNhdChyZXN0LmNoaWxkcmVuKSk7XG4gICAgfVxuICB9O1xuXG4gIFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzID0gU2VtYW50aWNzXG4gICAgICAuY3JlYXRlU2VtYW50aWNzKGJ1aWx0SW5SdWxlcywgbnVsbClcbiAgICAgIC5hZGRPcGVyYXRpb24oJ2FzSXRlcmF0aW9uJywge1xuICAgICAgICBlbXB0eUxpc3RPZjogYWN0aW9ucy5lbXB0eSxcbiAgICAgICAgbm9uZW1wdHlMaXN0T2Y6IGFjdGlvbnMubm9uRW1wdHksXG4gICAgICAgIEVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBOb25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eVxuICAgICAgfSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBPcGVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQW4gT3BlcmF0aW9uIHJlcHJlc2VudHMgYSBmdW5jdGlvbiB0byBiZSBhcHBsaWVkIHRvIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgLS0gaXQncyB2ZXJ5XG4vLyBzaW1pbGFyIHRvIGEgVmlzaXRvciAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WaXNpdG9yX3BhdHRlcm4pLiBBbiBvcGVyYXRpb24gaXMgZXhlY3V0ZWQgYnlcbi8vIHJlY3Vyc2l2ZWx5IHdhbGtpbmcgdGhlIENTVCwgYW5kIGF0IGVhY2ggbm9kZSwgaW52b2tpbmcgdGhlIG1hdGNoaW5nIHNlbWFudGljIGFjdGlvbiBmcm9tXG4vLyBgYWN0aW9uRGljdGAuIFNlZSBgT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlYCBmb3IgZGV0YWlscyBvZiBob3cgYSBDU1Qgbm9kZSdzIG1hdGNoaW5nIHNlbWFudGljXG4vLyBhY3Rpb24gaXMgZm91bmQuXG5mdW5jdGlvbiBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgYWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5mb3JtYWxzID0gZm9ybWFscztcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbiAgdGhpcy5idWlsdEluRGVmYXVsdCA9IGJ1aWx0SW5EZWZhdWx0O1xufVxuXG5PcGVyYXRpb24ucHJvdG90eXBlLnR5cGVOYW1lID0gJ29wZXJhdGlvbic7XG5cbk9wZXJhdGlvbi5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0ID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICBncmFtbWFyLl9jaGVja1RvcERvd25BY3Rpb25EaWN0KHRoaXMudHlwZU5hbWUsIHRoaXMubmFtZSwgdGhpcy5hY3Rpb25EaWN0KTtcbn07XG5cbi8vIEV4ZWN1dGUgdGhpcyBvcGVyYXRpb24gb24gdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCBgbm9kZVdyYXBwZXJgIGluIHRoZSBjb250ZXh0IG9mIHRoZSBnaXZlblxuLy8gU2VtYW50aWNzIGluc3RhbmNlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAvLyBMb29rIGZvciBhIHNlbWFudGljIGFjdGlvbiB3aG9zZSBuYW1lIG1hdGNoZXMgdGhlIG5vZGUncyBjb25zdHJ1Y3RvciBuYW1lLCB3aGljaCBpcyBlaXRoZXIgdGhlXG4gIC8vIG5hbWUgb2YgYSBydWxlIGluIHRoZSBncmFtbWFyLCBvciAnX3Rlcm1pbmFsJyAoZm9yIGEgdGVybWluYWwgbm9kZSksIG9yICdfaXRlcicgKGZvciBhblxuICAvLyBpdGVyYXRpb24gbm9kZSkuIEluIHRoZSBsYXR0ZXIgY2FzZSwgdGhlIGFjdGlvbiBmdW5jdGlvbiByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudCwgd2hpY2ggaXNcbiAgLy8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBDU1Qgbm9kZS5cbiAgdmFyIGFjdGlvbkZuID0gdGhpcy5hY3Rpb25EaWN0W25vZGVXcmFwcGVyLl9ub2RlLmN0b3JOYW1lXTtcbiAgaWYgKGFjdGlvbkZuKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9BY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG5vZGVXcmFwcGVyLmlzSXRlcmF0aW9uKCkpO1xuICB9XG5cbiAgLy8gVGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGRvZXMgbm90IGNvbnRhaW4gYSBzZW1hbnRpYyBhY3Rpb24gZm9yIHRoaXMgc3BlY2lmaWMgdHlwZSBvZiBub2RlLlxuICAvLyBJZiB0aGlzIGlzIGEgbm9udGVybWluYWwgbm9kZSBhbmQgdGhlIHByb2dyYW1tZXIgaGFzIHByb3ZpZGVkIGEgYF9ub250ZXJtaW5hbGAgc2VtYW50aWNcbiAgLy8gYWN0aW9uLCB3ZSBpbnZva2UgaXQ6XG4gIGlmIChub2RlV3JhcHBlci5pc05vbnRlcm1pbmFsKCkpIHtcbiAgICBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdC5fbm9udGVybWluYWw7XG4gICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25GbiwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCB3ZSBpbnZva2UgdGhlICdfZGVmYXVsdCcgc2VtYW50aWMgYWN0aW9uLlxuICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCB0aGlzLmFjdGlvbkRpY3QuX2RlZmF1bHQsIHRydWUpO1xufTtcblxuLy8gSW52b2tlIGBhY3Rpb25GbmAgb24gdGhlIENTVCBub2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gYG5vZGVXcmFwcGVyYCwgaW4gdGhlIGNvbnRleHQgb2Zcbi8vIGBzZW1hbnRpY3NgLiBJZiBgb3B0UGFzc0NoaWxkcmVuQXNBcnJheWAgaXMgdHJ1dGh5LCBgYWN0aW9uRm5gIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBzaW5nbGVcbi8vIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBhcnJheSBvZiB3cmFwcGVycy4gT3RoZXJ3aXNlLCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBgYWN0aW9uRm5gIHdpbGxcbi8vIGJlIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhlIENTVCBub2RlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5kb0FjdGlvbiA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5KSB7XG4gIHJldHVybiBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5ID9cbiAgICAgIGFjdGlvbkZuLmNhbGwobm9kZVdyYXBwZXIsIG5vZGVXcmFwcGVyLl9jaGlsZHJlbigpKSA6XG4gICAgICBhY3Rpb25Gbi5hcHBseShub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEF0dHJpYnV0ZXMgYXJlIE9wZXJhdGlvbnMgd2hvc2UgcmVzdWx0cyBhcmUgbWVtb2l6ZWQuIFRoaXMgbWVhbnMgdGhhdCwgZm9yIGFueSBnaXZlbiBzZW1hbnRpY3MsXG4vLyB0aGUgc2VtYW50aWMgYWN0aW9uIGZvciBhIENTVCBub2RlIHdpbGwgYmUgaW52b2tlZCBubyBtb3JlIHRoYW4gb25jZS5cbmZ1bmN0aW9uIEF0dHJpYnV0ZShuYW1lLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmZvcm1hbHMgPSBbXTtcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbiAgdGhpcy5idWlsdEluRGVmYXVsdCA9IGJ1aWx0SW5EZWZhdWx0O1xufVxuaW5oZXJpdHMoQXR0cmlidXRlLCBPcGVyYXRpb24pO1xuXG5BdHRyaWJ1dGUucHJvdG90eXBlLnR5cGVOYW1lID0gJ2F0dHJpYnV0ZSc7XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgdmFyIG5vZGUgPSBub2RlV3JhcHBlci5fbm9kZTtcbiAgdmFyIGtleSA9IHNlbWFudGljcy5hdHRyaWJ1dGVLZXlzW3RoaXMubmFtZV07XG4gIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBpcyBhIHN1cGVyLXNlbmQgLS0gaXNuJ3QgSlMgYmVhdXRpZnVsPyA6L1xuICAgIG5vZGVba2V5XSA9IE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMsIHNlbWFudGljcywgbm9kZVdyYXBwZXIpO1xuICB9XG4gIHJldHVybiBub2RlW2tleV07XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTZW1hbnRpY3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgUG9zSW5mbyA9IHJlcXVpcmUoJy4vUG9zSW5mbycpO1xudmFyIFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04gPSAwO1xudmFyIFJNX1JJR0hUTU9TVF9GQUlMVVJFUyA9IDE7XG5cbnZhciBhcHBseVNwYWNlcyA9IG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlcycpO1xuXG5mdW5jdGlvbiBTdGF0ZShncmFtbWFyLCBpbnB1dCwgb3B0cykge1xuICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICB0aGlzLnN0YXJ0RXhwciA9IHRoaXMuX2dldFN0YXJ0RXhwcihncmFtbWFyLCBvcHRzLnN0YXJ0QXBwbGljYXRpb24pO1xuICB0aGlzLm9yaWdJbnB1dFN0cmVhbSA9IG5ldyBJbnB1dFN0cmVhbShpbnB1dCk7XG4gIHRoaXMudHJhY2luZ0VuYWJsZWQgPSBvcHRzLnRyYWNlIHx8IGZhbHNlO1xuICB0aGlzLm1hdGNoTm9kZXMgPSBvcHRzLm1hdGNoTm9kZXMgfHwgZmFsc2U7XG4gIHRoaXMuaW5pdChSTV9SSUdIVE1PU1RfRkFJTFVSRV9QT1NJVElPTik7XG59XG5cblN0YXRlLnByb3RvdHlwZSA9IHtcbiAgaW5pdDogZnVuY3Rpb24ocmVjb3JkaW5nTW9kZSkge1xuICAgIHRoaXMuYmluZGluZ3MgPSBbXTtcblxuICAgIHRoaXMuaW5wdXRTdHJlYW1TdGFjayA9IFtdO1xuICAgIHRoaXMucG9zSW5mb3NTdGFjayA9IFtdO1xuICAgIHRoaXMucHVzaElucHV0U3RyZWFtKHRoaXMub3JpZ0lucHV0U3RyZWFtKTtcblxuICAgIHRoaXMuYXBwbGljYXRpb25TdGFjayA9IFtdO1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjayA9IFtmYWxzZV07XG5cbiAgICB0aGlzLnJlY29yZGluZ01vZGUgPSByZWNvcmRpbmdNb2RlO1xuICAgIGlmIChyZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRV9QT1NJVElPTikge1xuICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSAtMTtcbiAgICB9IGVsc2UgaWYgKHJlY29yZGluZ01vZGUgPT09IFJNX1JJR0hUTU9TVF9GQUlMVVJFUykge1xuICAgICAgLy8gV2UgYWx3YXlzIHJ1biBpbiAqcmlnaHRtb3N0IGZhaWx1cmUgcG9zaXRpb24qIHJlY29yZGluZyBtb2RlIGJlZm9yZSBydW5uaW5nIGluXG4gICAgICAvLyAqcmlnaHRtb3N0IGZhaWx1cmVzKiByZWNvcmRpbmcgbW9kZS4gQW5kIHNpbmNlIHRoZSB0cmFjZXMgZ2VuZXJhdGVkIGJ5IGVhY2ggb2ZcbiAgICAgIC8vIHRoZXNlIHBhc3NlcyB3b3VsZCBiZSBpZGVudGljYWwsIHRoZXJlJ3Mgbm8gbmVlZCB0byByZWNvcmQgaXQgbm93IGlmIHdlIGhhdmVcbiAgICAgIC8vIGFscmVhZHkgcmVjb3JkZWQgaXQgaW4gdGhlIGZpcnN0IHBhc3MuXG4gICAgICB0aGlzLnRyYWNpbmdFbmFibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCByZWNvcmRpbmcgbW9kZTogJyArIHJlY29yZGluZ01vZGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmlzVHJhY2luZygpKSB7XG4gICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgfVxuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihhcHApIHtcbiAgICB0aGlzLmFwcGxpY2F0aW9uU3RhY2sucHVzaChhcHApO1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wdXNoKGZhbHNlKTtcbiAgfSxcblxuICBleGl0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmFwcGxpY2F0aW9uU3RhY2sucG9wKCk7XG4gICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnBvcCgpO1xuICB9LFxuXG4gIGVudGVyTGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaCh0cnVlKTtcbiAgfSxcblxuICBleGl0TGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgY3VycmVudEFwcGxpY2F0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvblN0YWNrW3RoaXMuYXBwbGljYXRpb25TdGFjay5sZW5ndGggLSAxXTtcbiAgfSxcblxuICBpblN5bnRhY3RpY0NvbnRleHQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBjdXJyZW50QXBwbGljYXRpb24gPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgIGlmIChjdXJyZW50QXBwbGljYXRpb24pIHtcbiAgICAgIHJldHVybiBjdXJyZW50QXBwbGljYXRpb24uaXNTeW50YWN0aWMoKSAmJiAhdGhpcy5pbkxleGlmaWVkQ29udGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUaGUgdG9wLWxldmVsIGNvbnRleHQgaXMgc3ludGFjdGljIGlmIHRoZSBzdGFydCBhcHBsaWNhdGlvbiBpcy5cbiAgICAgIHJldHVybiB0aGlzLnN0YXJ0RXhwci5mYWN0b3JzWzBdLmlzU3ludGFjdGljKCk7XG4gICAgfVxuICB9LFxuXG4gIGluTGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrW3RoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5sZW5ndGggLSAxXTtcbiAgfSxcblxuICBza2lwU3BhY2VzOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3JpZ0ZhaWx1cmVzSW5mbyA9IHRoaXMuZ2V0RmFpbHVyZXNJbmZvKCk7XG4gICAgdGhpcy5ldmFsKGFwcGx5U3BhY2VzKTtcbiAgICB0aGlzLmJpbmRpbmdzLnBvcCgpO1xuICAgIHRoaXMucmVzdG9yZUZhaWx1cmVzSW5mbyhvcmlnRmFpbHVyZXNJbmZvKTtcbiAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gIH0sXG5cbiAgc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pblN5bnRhY3RpY0NvbnRleHQoKSA/XG4gICAgICAgIHRoaXMuc2tpcFNwYWNlcygpIDpcbiAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gIH0sXG5cbiAgbWF5YmVTa2lwU3BhY2VzQmVmb3JlOiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkgJiYgZXhwci5pc1N5bnRhY3RpYygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5za2lwU3BhY2VzKCk7XG4gICAgfSBlbHNlIGlmIChleHByLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UoKSAmJiBleHByICE9PSBhcHBseVNwYWNlcykge1xuICAgICAgcmV0dXJuIHRoaXMuc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgICB9XG4gIH0sXG5cbiAgdHJ1bmNhdGVCaW5kaW5nczogZnVuY3Rpb24obmV3TGVuZ3RoKSB7XG4gICAgLy8gVE9ETzogaXMgdGhpcyByZWFsbHkgZmFzdGVyIHRoYW4gc2V0dGluZyB0aGUgYGxlbmd0aGAgcHJvcGVydHk/XG4gICAgd2hpbGUgKHRoaXMuYmluZGluZ3MubGVuZ3RoID4gbmV3TGVuZ3RoKSB7XG4gICAgICB0aGlzLmJpbmRpbmdzLnBvcCgpO1xuICAgIH1cbiAgfSxcblxuICBwdXNoSW5wdXRTdHJlYW06IGZ1bmN0aW9uKGlucHV0U3RyZWFtKSB7XG4gICAgdGhpcy5pbnB1dFN0cmVhbVN0YWNrLnB1c2godGhpcy5pbnB1dFN0cmVhbSk7XG4gICAgdGhpcy5wb3NJbmZvc1N0YWNrLnB1c2godGhpcy5wb3NJbmZvcyk7XG4gICAgdGhpcy5pbnB1dFN0cmVhbSA9IGlucHV0U3RyZWFtO1xuICAgIHRoaXMucG9zSW5mb3MgPSBbXTtcbiAgfSxcblxuICBwb3BJbnB1dFN0cmVhbTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5pbnB1dFN0cmVhbSA9IHRoaXMuaW5wdXRTdHJlYW1TdGFjay5wb3AoKTtcbiAgICB0aGlzLnBvc0luZm9zID0gdGhpcy5wb3NJbmZvc1N0YWNrLnBvcCgpO1xuICB9LFxuXG4gIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQb3NJbmZvKHRoaXMuaW5wdXRTdHJlYW0ucG9zKTtcbiAgfSxcblxuICBnZXRQb3NJbmZvOiBmdW5jdGlvbihwb3MpIHtcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMucG9zSW5mb3NbcG9zXTtcbiAgICByZXR1cm4gcG9zSW5mbyB8fCAodGhpcy5wb3NJbmZvc1twb3NdID0gbmV3IFBvc0luZm8odGhpcykpO1xuICB9LFxuXG4gIHByb2Nlc3NGYWlsdXJlOiBmdW5jdGlvbihwb3MsIGV4cHIpIHtcbiAgICBpZiAodGhpcy5yZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRV9QT1NJVElPTikge1xuICAgICAgaWYgKHBvcyA+IHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gcG9zO1xuICAgICAgfVxuICAgIH0gZWxzZSAvKiBpZiAodGhpcy5yZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRVMpICovXG4gICAgICAgIGlmIChwb3MgPT09IHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKSB7XG4gICAgICAgICAgLy8gV2UncmUgb25seSBpbnRlcmVzdGVkIGluIGZhaWx1cmVzIGF0IHRoZSByaWdodG1vc3QgZmFpbHVyZSBwb3NpdGlvbiB0aGF0IGhhdmVuJ3RcbiAgICAgICAgICAvLyBhbHJlYWR5IGJlZW4gcmVjb3JkZWQuXG5cbiAgICAgICAgICB0aGlzLmFkZFJpZ2h0bW9zdEZhaWx1cmUoZXhwci50b0ZhaWx1cmUodGhpcy5ncmFtbWFyKSwgZmFsc2UpO1xuICAgICAgICB9XG4gIH0sXG5cbiAgZW5zdXJlUmlnaHRtb3N0RmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5yaWdodG1vc3RGYWlsdXJlcykge1xuICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuICB9LFxuXG4gIGFkZFJpZ2h0bW9zdEZhaWx1cmU6IGZ1bmN0aW9uKGZhaWx1cmUsIHNob3VsZENsb25lSWZOZXcpIHtcbiAgICB0aGlzLmVuc3VyZVJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gICAgdmFyIGtleSA9IGZhaWx1cmUudG9LZXkoKTtcbiAgICBpZiAoIXRoaXMucmlnaHRtb3N0RmFpbHVyZXNba2V5XSkge1xuICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlc1trZXldID0gc2hvdWxkQ2xvbmVJZk5ldyA/IGZhaWx1cmUuY2xvbmUoKSA6IGZhaWx1cmU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVzW2tleV0uaXNGbHVmZnkoKSAmJiAhZmFpbHVyZS5pc0ZsdWZmeSgpKSB7XG4gICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVzW2tleV0uY2xlYXJGbHVmZnkoKTtcbiAgICB9XG4gIH0sXG5cbiAgYWRkUmlnaHRtb3N0RmFpbHVyZXM6IGZ1bmN0aW9uKGZhaWx1cmVzLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKGZhaWx1cmVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgc2VsZi5hZGRSaWdodG1vc3RGYWlsdXJlKGZhaWx1cmVzW2tleV0sIHNob3VsZENsb25lSWZOZXcpO1xuICAgIH0pO1xuICB9LFxuXG4gIGNsb25lUmlnaHRtb3N0RmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5yaWdodG1vc3RGYWlsdXJlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgYW5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXModGhpcy5yaWdodG1vc3RGYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIGFuc1trZXldID0gc2VsZi5yaWdodG1vc3RGYWlsdXJlc1trZXldLmNsb25lKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFucztcbiAgfSxcblxuICBnZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgfSxcblxuICBnZXRGYWlsdXJlczogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04pIHtcbiAgICAgIC8vIFJld2luZCwgdGhlbiB0cnkgdG8gbWF0Y2ggdGhlIGlucHV0IGFnYWluLCByZWNvcmRpbmcgZmFpbHVyZXMuXG4gICAgICB0aGlzLmluaXQoUk1fUklHSFRNT1NUX0ZBSUxVUkVTKTtcbiAgICAgIHRoaXMuZXZhbEZyb21TdGFydCgpO1xuICAgIH1cblxuICAgIHRoaXMuZW5zdXJlUmlnaHRtb3N0RmFpbHVyZXMoKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMucmlnaHRtb3N0RmFpbHVyZXMpLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBzZWxmLnJpZ2h0bW9zdEZhaWx1cmVzW2tleV07XG4gICAgfSk7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbWVtb2l6ZWQgdHJhY2UgZW50cnkgZm9yIGBleHByYCBhdCBgcG9zYCwgaWYgb25lIGV4aXN0cywgYG51bGxgIG90aGVyd2lzZS5cbiAgZ2V0TWVtb2l6ZWRUcmFjZUVudHJ5OiBmdW5jdGlvbihwb3MsIGV4cHIpIHtcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMucG9zSW5mb3NbcG9zXTtcbiAgICBpZiAocG9zSW5mbyAmJiBleHByLnJ1bGVOYW1lKSB7XG4gICAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1tleHByLnRvTWVtb0tleSgpXTtcbiAgICAgIGlmIChtZW1vUmVjKSB7XG4gICAgICAgIHJldHVybiBtZW1vUmVjLnRyYWNlRW50cnk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9LFxuXG4gIC8vIFJldHVybnMgYSBuZXcgdHJhY2UgZW50cnksIHdpdGggdGhlIGN1cnJlbnRseSBhY3RpdmUgdHJhY2UgYXJyYXkgYXMgaXRzIGNoaWxkcmVuLlxuICBnZXRUcmFjZUVudHJ5OiBmdW5jdGlvbihwb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MpIHtcbiAgICB2YXIgbWVtb0VudHJ5ID0gdGhpcy5nZXRNZW1vaXplZFRyYWNlRW50cnkocG9zLCBleHByKTtcbiAgICByZXR1cm4gbWVtb0VudHJ5ID8gbWVtb0VudHJ5LmNsb25lV2l0aEV4cHIoZXhwcilcbiAgICAgICAgICAgICAgICAgICAgIDogbmV3IFRyYWNlKHRoaXMuaW5wdXRTdHJlYW0sIHBvcywgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncywgdGhpcy50cmFjZSk7XG4gIH0sXG5cbiAgaXNUcmFjaW5nOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy50cmFjaW5nRW5hYmxlZDtcbiAgfSxcblxuICB1c2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIGlmICh0aGlzLmlzVHJhY2luZygpKSB7XG4gICAgICB0aGlzLnRyYWNlLnB1c2gobWVtb1JlYy50cmFjZUVudHJ5KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRVMgJiYgbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMuYWRkUmlnaHRtb3N0RmFpbHVyZXMobWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24sIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChtZW1vUmVjLnZhbHVlKSB7XG4gICAgICB0aGlzLmlucHV0U3RyZWFtLnBvcyA9IG1lbW9SZWMucG9zO1xuICAgICAgdGhpcy5iaW5kaW5ncy5wdXNoKG1lbW9SZWMudmFsdWUpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICAvLyBFdmFsdWF0ZSBgZXhwcmAgYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZGVkLCBgZmFsc2VgIG90aGVyd2lzZS4gT24gc3VjY2VzcywgYGJpbmRpbmdzYFxuICAvLyB3aWxsIGhhdmUgYGV4cHIuZ2V0QXJpdHkoKWAgbW9yZSBlbGVtZW50cyB0aGFuIGJlZm9yZSwgYW5kIHRoZSBpbnB1dCBzdHJlYW0ncyBwb3NpdGlvbiBtYXlcbiAgLy8gaGF2ZSBpbmNyZWFzZWQuIE9uIGZhaWx1cmUsIGBiaW5kaW5nc2AgYW5kIHBvc2l0aW9uIHdpbGwgYmUgdW5jaGFuZ2VkLlxuICBldmFsOiBmdW5jdGlvbihleHByKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gdGhpcy5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ051bUJpbmRpbmdzID0gdGhpcy5iaW5kaW5ncy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5yZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRVMpIHtcbiAgICAgIHZhciBvcmlnRmFpbHVyZXMgPSB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVzO1xuICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlcyA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgbWVtb1BvcyA9IHRoaXMubWF5YmVTa2lwU3BhY2VzQmVmb3JlKGV4cHIpO1xuXG4gICAgaWYgKHRoaXMuaXNUcmFjaW5nKCkpIHtcbiAgICAgIHZhciBvcmlnVHJhY2UgPSB0aGlzLnRyYWNlO1xuICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIH1cblxuICAgIC8vIERvIHRoZSBhY3R1YWwgZXZhbHVhdGlvbi5cbiAgICB2YXIgYW5zID0gZXhwci5ldmFsKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuaXNUcmFjaW5nKCkpIHtcbiAgICAgIHZhciBiaW5kaW5ncyA9IHRoaXMuYmluZGluZ3Muc2xpY2Uob3JpZ051bUJpbmRpbmdzKTtcbiAgICAgIHZhciB0cmFjZUVudHJ5ID0gdGhpcy5nZXRUcmFjZUVudHJ5KG1lbW9Qb3MsIGV4cHIsIGFucywgYmluZGluZ3MpO1xuICAgICAgdHJhY2VFbnRyeS5pc0ltcGxpY2l0U3BhY2VzID0gZXhwciA9PT0gYXBwbHlTcGFjZXM7XG4gICAgICB0cmFjZUVudHJ5LmlzUm9vdE5vZGUgPSBleHByID09PSB0aGlzLnN0YXJ0RXhwcjtcbiAgICAgIG9yaWdUcmFjZS5wdXNoKHRyYWNlRW50cnkpO1xuICAgICAgdGhpcy50cmFjZSA9IG9yaWdUcmFjZTtcbiAgICB9XG5cbiAgICBpZiAoYW5zKSB7XG4gICAgICBpZiAodGhpcy5yaWdodG1vc3RGYWlsdXJlcyAmJlxuICAgICAgICAoaW5wdXRTdHJlYW0ucG9zID09PSB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiB8fFxuICAgICAgICAgdGhpcy5za2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQoKSA9PT0gdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5yaWdodG1vc3RGYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgICBzZWxmLnJpZ2h0bW9zdEZhaWx1cmVzW2tleV0ubWFrZUZsdWZmeSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVzZXQgdGhlIHBvc2l0aW9uIGFuZCB0aGUgYmluZGluZ3MuXG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgdGhpcy50cnVuY2F0ZUJpbmRpbmdzKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVTICYmIG9yaWdGYWlsdXJlcykge1xuICAgICAgdGhpcy5hZGRSaWdodG1vc3RGYWlsdXJlcyhvcmlnRmFpbHVyZXMsIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5zO1xuICB9LFxuXG4gIC8vIFJldHVybiB0aGUgc3RhcnRpbmcgZXhwcmVzc2lvbiBmb3IgdGhpcyBncmFtbWFyLiBJZiBgb3B0U3RhcnRBcHBsaWNhdGlvbmAgaXMgc3BlY2lmaWVkLCBpdFxuICAvLyBpcyBhIHN0cmluZyBleHByZXNzaW5nIGEgcnVsZSBhcHBsaWNhdGlvbiBpbiB0aGUgZ3JhbW1hci4gSWYgbm90IHNwZWNpZmllZCwgdGhlIGdyYW1tYXInc1xuICAvLyBkZWZhdWx0IHN0YXJ0IHJ1bGUgd2lsbCBiZSB1c2VkLlxuICBfZ2V0U3RhcnRFeHByOiBmdW5jdGlvbihncmFtbWFyLCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgdmFyIGFwcGxpY2F0aW9uU3RyID0gb3B0U3RhcnRBcHBsaWNhdGlvbiB8fCBncmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgaWYgKCFhcHBsaWNhdGlvblN0cikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHN0YXJ0IHJ1bGUgYXJndW1lbnQgLS0gdGhlIGdyYW1tYXIgaGFzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZS4nKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnRBcHAgPSBncmFtbWFyLnBhcnNlQXBwbGljYXRpb24oYXBwbGljYXRpb25TdHIpO1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlNlcShbc3RhcnRBcHAsIHBleHBycy5lbmRdKTtcbiAgfSxcblxuICBldmFsRnJvbVN0YXJ0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmV2YWwodGhpcy5zdGFydEV4cHIpO1xuICB9LFxuXG4gIGdldEZhaWx1cmVzSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04pIHtcbiAgICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgICB9IGVsc2UgLyogaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVTKSAqLyB7XG4gICAgICByZXR1cm4gdGhpcy5yaWdodG1vc3RGYWlsdXJlcztcbiAgICB9XG4gIH0sXG5cbiAgcmVzdG9yZUZhaWx1cmVzSW5mbzogZnVuY3Rpb24oZmFpbHVyZXNJbmZvKSB7XG4gICAgaWYgKHRoaXMucmVjb3JkaW5nTW9kZSA9PT0gUk1fUklHSFRNT1NUX0ZBSUxVUkVfUE9TSVRJT04pIHtcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gZmFpbHVyZXNJbmZvO1xuICAgIH0gZWxzZSAvKiBpZiAodGhpcy5yZWNvcmRpbmdNb2RlID09PSBSTV9SSUdIVE1PU1RfRkFJTFVSRVMpICovIHtcbiAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZXMgPSBmYWlsdXJlc0luZm87XG4gICAgfVxuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGB0b1N0cmluZ2Agb3V0cHV0LlxudmFyIEJBTExPVF9YID0gJ1xcdTI3MTcnO1xudmFyIENIRUNLX01BUksgPSAnXFx1MjcxMyc7XG52YXIgRE9UX09QRVJBVE9SID0gJ1xcdTIyQzUnO1xudmFyIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XID0gJ1xcdTIxRDInO1xudmFyIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OID0gJ1xcdTI0MDknO1xudmFyIFNZTUJPTF9GT1JfTElORV9GRUVEID0gJ1xcdTI0MEEnO1xudmFyIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOID0gJ1xcdTI0MEQnO1xuXG5mdW5jdGlvbiBzcGFjZXMobikge1xuICByZXR1cm4gY29tbW9uLnJlcGVhdCgnICcsIG4pLmpvaW4oJycpO1xufVxuXG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBwb3J0aW9uIG9mIGBpbnB1dFN0cmVhbWAgYXQgb2Zmc2V0IGBwb3NgLlxuLy8gVGhlIHJlc3VsdCB3aWxsIGNvbnRhaW4gZXhhY3RseSBgbGVuYCBjaGFyYWN0ZXJzLlxuZnVuY3Rpb24gZ2V0SW5wdXRFeGNlcnB0KGlucHV0U3RyZWFtLCBwb3MsIGxlbikge1xuICB2YXIgZXhjZXJwdCA9IGFzRXNjYXBlZFN0cmluZyhpbnB1dFN0cmVhbS5zb3VyY2VTbGljZShwb3MsIHBvcyArIGxlbikpO1xuXG4gIC8vIFBhZCB0aGUgb3V0cHV0IGlmIG5lY2Vzc2FyeS5cbiAgaWYgKGV4Y2VycHQubGVuZ3RoIDwgbGVuKSB7XG4gICAgcmV0dXJuIGV4Y2VycHQgKyBjb21tb24ucmVwZWF0KCcgJywgbGVuIC0gZXhjZXJwdC5sZW5ndGgpLmpvaW4oJycpO1xuICB9XG4gIHJldHVybiBleGNlcnB0O1xufVxuXG5mdW5jdGlvbiBhc0VzY2FwZWRTdHJpbmcob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgIC8vIFJlcGxhY2Ugbm9uLXByaW50YWJsZSBjaGFyYWN0ZXJzIHdpdGggdmlzaWJsZSBzeW1ib2xzLlxuICAgIHJldHVybiBvYmpcbiAgICAgICAgLnJlcGxhY2UoLyAvZywgRE9UX09QRVJBVE9SKVxuICAgICAgICAucmVwbGFjZSgvXFx0L2csIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OKVxuICAgICAgICAucmVwbGFjZSgvXFxuL2csIFNZTUJPTF9GT1JfTElORV9GRUVEKVxuICAgICAgICAucmVwbGFjZSgvXFxyL2csIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOKTtcbiAgfVxuICByZXR1cm4gU3RyaW5nKG9iaik7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFRyYWNlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFRyYWNlKGlucHV0U3RyZWFtLCBwb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MsIG9wdENoaWxkcmVuKSB7XG4gIHRoaXMuaW5wdXRTdHJlYW0gPSBpbnB1dFN0cmVhbTtcbiAgdGhpcy5wb3MgPSBwb3M7XG4gIHRoaXMuaW50ZXJ2YWwgPSBuZXcgSW50ZXJ2YWwoaW5wdXRTdHJlYW0sIHBvcywgaW5wdXRTdHJlYW0ucG9zKTtcbiAgdGhpcy5leHByID0gZXhwcjtcbiAgdGhpcy5zdWNjZWVkZWQgPSBzdWNjZWVkZWQ7XG4gIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgdGhpcy5jaGlsZHJlbiA9IG9wdENoaWxkcmVuIHx8IFtdO1xuXG4gIHRoaXMuaXNJbXBsaWNpdFNwYWNlcyA9IGZhbHNlO1xuICB0aGlzLmlzTGVmdFJlY3Vyc2l2ZSA9IGZhbHNlO1xuICB0aGlzLmlzTWVtb2l6ZWQgPSBmYWxzZTtcbiAgdGhpcy5pc1Jvb3ROb2RlID0gZmFsc2U7XG59XG5cbi8vIEEgdmFsdWUgdGhhdCBjYW4gYmUgcmV0dXJuZWQgZnJvbSB2aXNpdG9yIGZ1bmN0aW9ucyB0byBpbmRpY2F0ZSB0aGF0IGFcbi8vIG5vZGUgc2hvdWxkIG5vdCBiZSByZWN1cnNlZCBpbnRvLlxuVHJhY2UucHJvdG90eXBlLlNLSVAgPSB7fTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYWNlLnByb3RvdHlwZSwgJ2Rpc3BsYXlTdHJpbmcnLCB7XG4gIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmV4cHIudG9EaXNwbGF5U3RyaW5nKCk7IH1cbn0pO1xuXG5UcmFjZS5wcm90b3R5cGUuY2xvbmVXaXRoRXhwciA9IGZ1bmN0aW9uKGV4cHIpIHtcbiAgdmFyIGFucyA9IG5ldyBUcmFjZShcbiAgICAgIHRoaXMuaW5wdXRTdHJlYW0sIHRoaXMucG9zLCBleHByLCB0aGlzLnN1Y2NlZWRlZCwgdGhpcy5iaW5kaW5ncywgdGhpcy5jaGlsZHJlbik7XG4gIGFucy5pc0xlZnRSZWN1cnNpdmUgPSB0aGlzLmlzTGVmdFJlY3Vyc2l2ZTtcbiAgYW5zLmlzUm9vdE5vZGUgPSB0aGlzLmlzUm9vdE5vZGU7XG4gIGFucy5pc01lbW9pemVkID0gdHJ1ZTtcbiAgcmV0dXJuIGFucztcbn07XG5cbi8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoaXMgdHJhY2Ugbm9kZSBhbmQgYWxsIGl0cyBkZXNjZW5kZW50cywgY2FsbGluZyBhIHZpc2l0b3IgZnVuY3Rpb25cbi8vIGZvciBlYWNoIG5vZGUgdGhhdCBpcyB2aXNpdGVkLiBJZiBgdmlzdG9yT2JqT3JGbmAgaXMgYW4gb2JqZWN0LCB0aGVuIGl0cyAnZW50ZXInIHByb3BlcnR5XG4vLyBpcyBhIGZ1bmN0aW9uIHRvIGNhbGwgYmVmb3JlIHZpc2l0aW5nIHRoZSBjaGlsZHJlbiBvZiBhIG5vZGUsIGFuZCBpdHMgJ2V4aXQnIHByb3BlcnR5IGlzXG4vLyBhIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXJ3YXJkcy4gSWYgYHZpc2l0b3JPYmpPckZuYCBpcyBhIGZ1bmN0aW9uLCBpdCByZXByZXNlbnRzIHRoZSAnZW50ZXInXG4vLyBmdW5jdGlvbi5cbi8vXG4vLyBUaGUgZnVuY3Rpb25zIGFyZSBjYWxsZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBUcmFjZSBub2RlLCBpdHMgcGFyZW50IFRyYWNlLCBhbmQgYSBudW1iZXJcbi8vIHJlcHJlc2VudGluZyB0aGUgZGVwdGggb2YgdGhlIG5vZGUgaW4gdGhlIHRyZWUuIChUaGUgcm9vdCBub2RlIGhhcyBkZXB0aCAwLikgYG9wdFRoaXNBcmdgLCBpZlxuLy8gc3BlY2lmaWVkLCBpcyB0aGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2Agd2hlbiBleGVjdXRpbmcgdGhlIHZpc2l0b3IgZnVuY3Rpb25zLlxuVHJhY2UucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbih2aXNpdG9yT2JqT3JGbiwgb3B0VGhpc0FyZykge1xuICB2YXIgdmlzaXRvciA9IHZpc2l0b3JPYmpPckZuO1xuICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2aXNpdG9yID0ge2VudGVyOiB2aXNpdG9yfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF93YWxrKG5vZGUsIHBhcmVudCwgZGVwdGgpIHtcbiAgICB2YXIgcmVjdXJzZSA9IHRydWU7XG4gICAgaWYgKHZpc2l0b3IuZW50ZXIpIHtcbiAgICAgIGlmICh2aXNpdG9yLmVudGVyLmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCkgPT09IFRyYWNlLnByb3RvdHlwZS5TS0lQKSB7XG4gICAgICAgIHJlY3Vyc2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlY3Vyc2UpIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCwgaSkge1xuICAgICAgICB2YXIgbmV4dENoaWxkID0gbm9kZS5jaGlsZHJlbltpICsgMV07XG4gICAgICAgIGlmIChuZXh0Q2hpbGQgJiYgbmV4dENoaWxkLmV4cHIgPT09IGNoaWxkLmV4cHIgJiYgbmV4dENoaWxkLnBvcyA9PT0gY2hpbGQucG9zKSB7XG4gICAgICAgICAgLy8gU2tpcCB0aGlzIGNoaWxkIC0tIGl0IGlzIGFuIGludGVybWVkaWF0ZSBsZWZ0LXJlY3Vyc2l2ZSByZXN1bHQuXG4gICAgICAgICAgY29tbW9uLmFzc2VydChub2RlLmlzTGVmdFJlY3Vyc2l2ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3dhbGsoY2hpbGQsIG5vZGUsIGRlcHRoICsgMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHZpc2l0b3IuZXhpdCkge1xuICAgICAgICB2aXNpdG9yLmV4aXQuY2FsbChvcHRUaGlzQXJnLCBub2RlLCBwYXJlbnQsIGRlcHRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHRoaXMuaXNSb290Tm9kZSkge1xuICAgIC8vIERvbid0IHZpc2l0IHRoZSByb290IG5vZGUgaXRzZWxmLCBvbmx5IGl0cyBjaGlsZHJlbi5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oYykgeyBfd2FsayhjLCBudWxsLCAwKTsgfSk7XG4gIH0gZWxzZSB7XG4gICAgX3dhbGsodGhpcywgbnVsbCwgMCk7XG4gIH1cbn07XG5cbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhY2UuXG4vLyBTYW1wbGU6XG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzIOKckyBleHAg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICDinJMgYWRkRXhwIChMUikg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICAgICAg4pyXIGFkZEV4cF9wbHVzXG5UcmFjZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgdGhpcy53YWxrKGZ1bmN0aW9uKG5vZGUsIHBhcmVudCwgZGVwdGgpIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLlNLSVA7XG4gICAgfVxuICAgIHZhciBjdG9yTmFtZSA9IG5vZGUuZXhwci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIC8vIERvbid0IHByaW50IGFueXRoaW5nIGZvciBBbHQgbm9kZXMuXG4gICAgaWYgKGN0b3JOYW1lID09PSAnQWx0Jykge1xuICAgICAgcmV0dXJuOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIH1cbiAgICBzYi5hcHBlbmQoZ2V0SW5wdXRFeGNlcnB0KG5vZGUuaW5wdXRTdHJlYW0sIG5vZGUucG9zLCAxMCkgKyBzcGFjZXMoZGVwdGggKiAyICsgMSkpO1xuICAgIHNiLmFwcGVuZCgobm9kZS5zdWNjZWVkZWQgPyBDSEVDS19NQVJLIDogQkFMTE9UX1gpICsgJyAnICsgbm9kZS5kaXNwbGF5U3RyaW5nKTtcbiAgICBpZiAobm9kZS5pc0xlZnRSZWN1cnNpdmUpIHtcbiAgICAgIHNiLmFwcGVuZCgnIChMUiknKTtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3VjY2VlZGVkKSB7XG4gICAgICB2YXIgY29udGVudHMgPSBhc0VzY2FwZWRTdHJpbmcobm9kZS5pbnRlcnZhbC5jb250ZW50cyk7XG4gICAgICBzYi5hcHBlbmQoJyAnICsgUklHSFRXQVJEU19ET1VCTEVfQVJST1cgKyAnICAnKTtcbiAgICAgIHNiLmFwcGVuZCh0eXBlb2YgY29udGVudHMgPT09ICdzdHJpbmcnID8gJ1wiJyArIGNvbnRlbnRzICsgJ1wiJyA6IGNvbnRlbnRzKTtcbiAgICB9XG4gICAgc2IuYXBwZW5kKCdcXG4nKTtcbiAgfS5iaW5kKHRoaXMpKTtcbiAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBTdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gSGVscGVyc1xuXG52YXIgZXNjYXBlU3RyaW5nRm9yID0ge307XG5mb3IgKHZhciBjID0gMDsgYyA8IDEyODsgYysrKSB7XG4gIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gID0gXCJcXFxcJ1wiO1xuZXNjYXBlU3RyaW5nRm9yWydcIicuY2hhckNvZGVBdCgwKV0gID0gJ1xcXFxcIic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcZicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGYnO1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcdCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHQnO1xuZXNjYXBlU3RyaW5nRm9yWydcXHUwMDBiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24oKSB7XG4gIHRocm93IG5ldyBFcnJvcihcbiAgICAgICd0aGlzIG1ldGhvZCBpcyBhYnN0cmFjdCEgJyArXG4gICAgICAnKGl0IGhhcyBubyBpbXBsZW1lbnRhdGlvbiBpbiBjbGFzcyAnICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJyknKTtcbn07XG5cbmV4cG9ydHMuYXNzZXJ0ID0gZnVuY3Rpb24oY29uZCwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH1cbn07XG5cbi8vIERlZmluZSBhIGxhemlseS1jb21wdXRlZCwgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgbmFtZWQgYHByb3BOYW1lYFxuLy8gb24gdGhlIG9iamVjdCBgb2JqYC4gYGdldHRlckZuYCB3aWxsIGJlIGNhbGxlZCB0byBjb21wdXRlIHRoZSB2YWx1ZSB0aGVcbi8vIGZpcnN0IHRpbWUgdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkLlxuZXhwb3J0cy5kZWZpbmVMYXp5UHJvcGVydHkgPSBmdW5jdGlvbihvYmosIHByb3BOYW1lLCBnZXR0ZXJGbikge1xuICB2YXIgbWVtbztcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFtZW1vKSB7XG4gICAgICAgIG1lbW8gPSBnZXR0ZXJGbi5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1lbW87XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKG9iaikge1xuICAgIHJldHVybiBleHRlbmQoe30sIG9iaik7XG4gIH1cbiAgcmV0dXJuIG9iajtcbn07XG5cbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuXG5leHBvcnRzLnJlcGVhdEZuID0gZnVuY3Rpb24oZm4sIG4pIHtcbiAgdmFyIGFyciA9IFtdO1xuICB3aGlsZSAobi0tID4gMCkge1xuICAgIGFyci5wdXNoKGZuKCkpO1xuICB9XG4gIHJldHVybiBhcnI7XG59O1xuXG5leHBvcnRzLnJlcGVhdFN0ciA9IGZ1bmN0aW9uKHN0ciwgbikge1xuICByZXR1cm4gbmV3IEFycmF5KG4gKyAxKS5qb2luKHN0cik7XG59O1xuXG5leHBvcnRzLnJlcGVhdCA9IGZ1bmN0aW9uKHgsIG4pIHtcbiAgcmV0dXJuIGV4cG9ydHMucmVwZWF0Rm4oZnVuY3Rpb24oKSB7IHJldHVybiB4OyB9LCBuKTtcbn07XG5cbmV4cG9ydHMuZ2V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHZhciBkdXBsaWNhdGVzID0gW107XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgeCA9IGFycmF5W2lkeF07XG4gICAgaWYgKGFycmF5Lmxhc3RJbmRleE9mKHgpICE9PSBpZHggJiYgZHVwbGljYXRlcy5pbmRleE9mKHgpIDwgMCkge1xuICAgICAgZHVwbGljYXRlcy5wdXNoKHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZHVwbGljYXRlcztcbn07XG5cbmV4cG9ydHMuY29weVdpdGhvdXREdXBsaWNhdGVzID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgdmFyIG5vRHVwbGljYXRlcyA9IFtdO1xuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgaWYgKG5vRHVwbGljYXRlcy5pbmRleE9mKGVudHJ5KSA8IDApIHtcbiAgICAgIG5vRHVwbGljYXRlcy5wdXNoKGVudHJ5KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbm9EdXBsaWNhdGVzO1xufTtcblxuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgcmV0dXJuIGZpcnN0Q2hhciA9PT0gZmlyc3RDaGFyLnRvVXBwZXJDYXNlKCk7XG59O1xuXG5leHBvcnRzLmlzTGV4aWNhbCA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHJldHVybiAhZXhwb3J0cy5pc1N5bnRhY3RpYyhydWxlTmFtZSk7XG59O1xuXG5leHBvcnRzLnBhZExlZnQgPSBmdW5jdGlvbihzdHIsIGxlbiwgb3B0Q2hhcikge1xuICB2YXIgY2ggPSBvcHRDaGFyIHx8ICcgJztcbiAgaWYgKHN0ci5sZW5ndGggPCBsZW4pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5yZXBlYXRTdHIoY2gsIGxlbiAtIHN0ci5sZW5ndGgpICsgc3RyO1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG4vLyBTdHJpbmdCdWZmZXJcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5zdHJpbmdzID0gW107XG59O1xuXG5leHBvcnRzLlN0cmluZ0J1ZmZlci5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24oc3RyKSB7XG4gIHRoaXMuc3RyaW5ncy5wdXNoKHN0cik7XG59O1xuXG5leHBvcnRzLlN0cmluZ0J1ZmZlci5wcm90b3R5cGUuY29udGVudHMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKTtcbn07XG5cbi8vIENoYXJhY3RlciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZ1xuXG5leHBvcnRzLmVzY2FwZUNoYXIgPSBmdW5jdGlvbihjLCBvcHREZWxpbSkge1xuICB2YXIgY2hhckNvZGUgPSBjLmNoYXJDb2RlQXQoMCk7XG4gIGlmICgoYyA9PT0gJ1wiJyB8fCBjID09PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pIHtcbiAgICByZXR1cm4gYztcbiAgfSBlbHNlIGlmIChjaGFyQ29kZSA8IDEyOCkge1xuICAgIHJldHVybiBlc2NhcGVTdHJpbmdGb3JbY2hhckNvZGVdO1xuICB9IGVsc2UgaWYgKDEyOCA8PSBjaGFyQ29kZSAmJiBjaGFyQ29kZSA8IDI1Nikge1xuICAgIHJldHVybiAnXFxcXHgnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMiwgJzAnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ1xcXFx1JyArIGV4cG9ydHMucGFkTGVmdChjaGFyQ29kZS50b1N0cmluZygxNiksIDQsICcwJyk7XG4gIH1cbn07XG5cbmV4cG9ydHMudW5lc2NhcGVDaGFyID0gZnVuY3Rpb24ocykge1xuICBpZiAocy5jaGFyQXQoMCkgPT09ICdcXFxcJykge1xuICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgIGNhc2UgJ2InOiByZXR1cm4gJ1xcYic7XG4gICAgICBjYXNlICdmJzogcmV0dXJuICdcXGYnO1xuICAgICAgY2FzZSAnbic6IHJldHVybiAnXFxuJztcbiAgICAgIGNhc2UgJ3InOiByZXR1cm4gJ1xccic7XG4gICAgICBjYXNlICd0JzogcmV0dXJuICdcXHQnO1xuICAgICAgY2FzZSAndic6IHJldHVybiAnXFx2JztcbiAgICAgIGNhc2UgJ3gnOiByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA0KSwgMTYpKTtcbiAgICAgIGNhc2UgJ3UnOiByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKTtcbiAgICAgIGRlZmF1bHQ6ICAgcmV0dXJuIHMuY2hhckF0KDEpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufTtcblxuLy8gSGVscGVyIGZvciBwcm9kdWNpbmcgYSBkZXNjcmlwdGlvbiBvZiBhbiB1bmtub3duIG9iamVjdCBpbiBhIHNhZmUgd2F5LlxuLy8gRXNwZWNpYWxseSB1c2VmdWwgZm9yIGVycm9yIG1lc3NhZ2VzIHdoZXJlIGFuIHVuZXhwZWN0ZWQgdHlwZSBvZiBvYmplY3Qgd2FzIGVuY291bnRlcmVkLlxuZXhwb3J0cy51bmV4cGVjdGVkT2JqVG9TdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICB9XG4gIHZhciBiYXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgdHJ5IHtcbiAgICB2YXIgdHlwZU5hbWU7XG4gICAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgdHlwZU5hbWUgPSBvYmouY29uc3RydWN0b3IubmFtZTtcbiAgICB9IGVsc2UgaWYgKGJhc2VUb1N0cmluZy5pbmRleE9mKCdbb2JqZWN0ICcpID09PSAwKSB7XG4gICAgICB0eXBlTmFtZSA9IGJhc2VUb1N0cmluZy5zbGljZSg4LCAtMSk7ICAvLyBFeHRyYWN0IGUuZy4gXCJBcnJheVwiIGZyb20gXCJbb2JqZWN0IEFycmF5XVwiLlxuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlTmFtZSA9IHR5cGVvZiBvYmo7XG4gICAgfVxuICAgIHJldHVybiB0eXBlTmFtZSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShTdHJpbmcob2JqKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gYmFzZVRvU3RyaW5nO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBvcHRJbnRlcnZhbCkge1xuICB2YXIgZTtcbiAgaWYgKG9wdEludGVydmFsKSB7XG4gICAgZSA9IG5ldyBFcnJvcihvcHRJbnRlcnZhbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSgpICsgbWVzc2FnZSk7XG4gICAgZS5zaG9ydE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGUuaW50ZXJ2YWwgPSBvcHRJbnRlcnZhbDtcbiAgfSBlbHNlIHtcbiAgICBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBlO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgaW50ZXJ2YWxzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGludGVydmFsU291cmNlc0RvbnRNYXRjaCgpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFwiSW50ZXJ2YWwgc291cmNlcyBkb24ndCBtYXRjaFwiKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGdyYW1tYXJzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdyYW1tYXIgc3ludGF4IGVycm9yXG5cbmZ1bmN0aW9uIGdyYW1tYXJTeW50YXhFcnJvcihtYXRjaEZhaWx1cmUpIHtcbiAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsICdtZXNzYWdlJywge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiBtYXRjaEZhaWx1cmUubWVzc2FnZTsgfX0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ3Nob3J0TWVzc2FnZScsIHtnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnRXhwZWN0ZWQgJyArIG1hdGNoRmFpbHVyZS5nZXRFeHBlY3RlZFRleHQoKTtcbiAgfX0pO1xuICBlLmludGVydmFsID0gbWF0Y2hGYWlsdXJlLmdldEludGVydmFsKCk7XG4gIHJldHVybiBlO1xufVxuXG4vLyBVbmRlY2xhcmVkIGdyYW1tYXJcblxuZnVuY3Rpb24gdW5kZWNsYXJlZEdyYW1tYXIoZ3JhbW1hck5hbWUsIG5hbWVzcGFjZSwgaW50ZXJ2YWwpIHtcbiAgdmFyIG1lc3NhZ2UgPSBuYW1lc3BhY2UgP1xuICAgICAgJ0dyYW1tYXIgJyArIGdyYW1tYXJOYW1lICsgJyBpcyBub3QgZGVjbGFyZWQgaW4gbmFtZXNwYWNlICcgKyBOYW1lc3BhY2UudG9TdHJpbmcobmFtZXNwYWNlKSA6XG4gICAgICAnVW5kZWNsYXJlZCBncmFtbWFyICcgKyBncmFtbWFyTmFtZTtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGludGVydmFsKTtcbn1cblxuLy8gRHVwbGljYXRlIGdyYW1tYXIgZGVjbGFyYXRpb25cblxuZnVuY3Rpb24gZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGdyYW1tYXIsIG5hbWVzcGFjZSkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoJ0dyYW1tYXIgJyArIGdyYW1tYXIubmFtZSArICcgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGlzIG5hbWVzcGFjZScpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBydWxlcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBVbmRlY2xhcmVkIHJ1bGVcblxuZnVuY3Rpb24gdW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBvcHRJbnRlcnZhbCkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnUnVsZSAnICsgcnVsZU5hbWUgKyAnIGlzIG5vdCBkZWNsYXJlZCBpbiBncmFtbWFyICcgKyBncmFtbWFyTmFtZSxcbiAgICAgIG9wdEludGVydmFsKTtcbn1cblxuLy8gQ2Fubm90IG92ZXJyaWRlIHVuZGVjbGFyZWQgcnVsZVxuXG5mdW5jdGlvbiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgYm9keSkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnQ2Fubm90IG92ZXJyaWRlIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgZ3JhbW1hck5hbWUsXG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCk7XG59XG5cbi8vIENhbm5vdCBleHRlbmQgdW5kZWNsYXJlZCBydWxlXG5cbmZ1bmN0aW9uIGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgYm9keSkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnQ2Fubm90IGV4dGVuZCBydWxlICcgKyBydWxlTmFtZSArICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIGdyYW1tYXJOYW1lLFxuICAgICAgYm9keS5kZWZpbml0aW9uSW50ZXJ2YWwpO1xufVxuXG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuXG5mdW5jdGlvbiBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24ocnVsZU5hbWUsIG9mZmVuZGluZ0dyYW1tYXJOYW1lLCBkZWNsR3JhbW1hck5hbWUsIGJvZHkpIHtcbiAgdmFyIG1lc3NhZ2UgPSBcIkR1cGxpY2F0ZSBkZWNsYXJhdGlvbiBmb3IgcnVsZSAnXCIgKyBydWxlTmFtZSArXG4gICAgICBcIicgaW4gZ3JhbW1hciAnXCIgKyBvZmZlbmRpbmdHcmFtbWFyTmFtZSArIFwiJ1wiO1xuICBpZiAob2ZmZW5kaW5nR3JhbW1hck5hbWUgIT09IGRlY2xHcmFtbWFyTmFtZSkge1xuICAgIG1lc3NhZ2UgKz0gXCIgKG9yaWdpbmFsbHkgZGVjbGFyZWQgaW4gJ1wiICsgZGVjbEdyYW1tYXJOYW1lICsgXCInKVwiO1xuICB9XG4gIHJldHVybiBjcmVhdGVFcnJvcihtZXNzYWdlLCBib2R5LmRlZmluaXRpb25JbnRlcnZhbCk7XG59XG5cbi8vIFdyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzXG5cbmZ1bmN0aW9uIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBib2R5KSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdXcm9uZyBudW1iZXIgb2YgcGFyYW1ldGVycyBmb3IgcnVsZSAnICsgcnVsZU5hbWUgK1xuICAgICAgICAgICcgKGV4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsICsgJyknLFxuICAgICAgYm9keSAmJiBib2R5LmRlZmluaXRpb25JbnRlcnZhbCk7XG59XG5cbi8vIFdyb25nIG51bWJlciBvZiBhcmd1bWVudHNcblxuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyhydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgZXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgcnVsZSAnICsgcnVsZU5hbWUgK1xuICAgICAgICAgICcgKGV4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsICsgJyknLFxuICAgICAgZXhwci5pbnRlcnZhbCk7XG59XG5cbi8vIER1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXNcblxuZnVuY3Rpb24gZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMocnVsZU5hbWUsIGR1cGxpY2F0ZXMsIGJvZHkpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0R1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXMgaW4gcnVsZSAnICsgcnVsZU5hbWUgKyAnOiAnICsgZHVwbGljYXRlcy5qb2luKCcsJyksXG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCk7XG59XG5cbi8vIEludmFsaWQgcGFyYW1ldGVyIGV4cHJlc3Npb25cblxuZnVuY3Rpb24gaW52YWxpZFBhcmFtZXRlcihydWxlTmFtZSwgZXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnSW52YWxpZCBwYXJhbWV0ZXIgdG8gcnVsZSAnICsgcnVsZU5hbWUgKyAnOiAnICsgZXhwciArICcgaGFzIGFyaXR5ICcgKyBleHByLmdldEFyaXR5KCkgK1xuICAgICAgICAgICcsIGJ1dCBwYXJhbWV0ZXIgZXhwcmVzc2lvbnMgJyArICdtdXN0IGhhdmUgYXJpdHkgMScsXG4gICAgICBleHByLmludGVydmFsKTtcbn1cblxuLy8gQXBwbGljYXRpb24gb2Ygc3ludGFjdGljIHJ1bGUgZnJvbSBsZXhpY2FsIHJ1bGVcblxuZnVuY3Rpb24gYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQocnVsZU5hbWUsIGFwcGx5RXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnQ2Fubm90IGFwcGx5IHN5bnRhY3RpYyBydWxlICcgKyBydWxlTmFtZSArICcgZnJvbSBoZXJlIChpbnNpZGUgYSBsZXhpY2FsIGNvbnRleHQpJyxcbiAgICAgIGFwcGx5RXhwci5pbnRlcnZhbCk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIEtsZWVuZSBvcGVyYXRvcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24ga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZChrbGVlbmVFeHByKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdOdWxsYWJsZSBleHByZXNzaW9uICcgKyBrbGVlbmVFeHByLmV4cHIuaW50ZXJ2YWwuY29udGVudHMgKyBcIiBpcyBub3QgYWxsb3dlZCBpbnNpZGUgJ1wiICtcbiAgICAgICAgICBrbGVlbmVFeHByLm9wZXJhdG9yICsgXCInIChwb3NzaWJsZSBpbmZpbml0ZSBsb29wKVwiLFxuICAgICAga2xlZW5lRXhwci5leHByLmludGVydmFsKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gYXJpdHkgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ1J1bGUgJyArIHJ1bGVOYW1lICsgJyBpbnZvbHZlcyBhbiBhbHRlcm5hdGlvbiB3aGljaCBoYXMgaW5jb25zaXN0ZW50IGFyaXR5ICcgK1xuICAgICAgICAgICcoZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwgKyAnKScsXG4gICAgICBleHByLmludGVydmFsKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKCdPYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOiAnICsgZHVwbGljYXRlcy5qb2luKCcsICcpKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gY29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGludmFsaWRDb25zdHJ1Y3RvckNhbGwoZ3JhbW1hciwgY3Rvck5hbWUsIGNoaWxkcmVuKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdBdHRlbXB0IHRvIGludm9rZSBjb25zdHJ1Y3RvciAnICsgY3Rvck5hbWUgKyAnIHdpdGggaW52YWxpZCBvciB1bmV4cGVjdGVkIGFyZ3VtZW50cycpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBjb252ZW5pZW5jZSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBtdWx0aXBsZUVycm9ycyhlcnJvcnMpIHtcbiAgdmFyIG1lc3NhZ2VzID0gZXJyb3JzLm1hcChmdW5jdGlvbihlKSB7IHJldHVybiBlLm1lc3NhZ2U7IH0pO1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICBbJ0Vycm9yczonXS5jb25jYXQobWVzc2FnZXMpLmpvaW4oJ1xcbi0gJyksXG4gICAgICBlcnJvcnNbMF0uaW50ZXJ2YWwpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0OiBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCxcbiAgY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlLFxuICBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlOiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlLFxuICBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb246IGR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbixcbiAgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXM6IGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLFxuICBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzOiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzLFxuICBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb246IGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbixcbiAgaW5jb25zaXN0ZW50QXJpdHk6IGluY29uc2lzdGVudEFyaXR5LFxuICBpbnRlcnZhbFNvdXJjZXNEb250TWF0Y2g6IGludGVydmFsU291cmNlc0RvbnRNYXRjaCxcbiAgaW52YWxpZENvbnN0cnVjdG9yQ2FsbDogaW52YWxpZENvbnN0cnVjdG9yQ2FsbCxcbiAgaW52YWxpZFBhcmFtZXRlcjogaW52YWxpZFBhcmFtZXRlcixcbiAgZ3JhbW1hclN5bnRheEVycm9yOiBncmFtbWFyU3ludGF4RXJyb3IsXG4gIGtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQ6IGtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQsXG4gIHVuZGVjbGFyZWRHcmFtbWFyOiB1bmRlY2xhcmVkR3JhbW1hcixcbiAgdW5kZWNsYXJlZFJ1bGU6IHVuZGVjbGFyZWRSdWxlLFxuICB3cm9uZ051bWJlck9mQXJndW1lbnRzOiB3cm9uZ051bWJlck9mQXJndW1lbnRzLFxuICB3cm9uZ051bWJlck9mUGFyYW1ldGVyczogd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMsXG5cbiAgdGhyb3dFcnJvcnM6IGZ1bmN0aW9uKGVycm9ycykge1xuICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICB0aHJvdyBlcnJvcnNbMF07XG4gICAgfVxuICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMSkge1xuICAgICAgdGhyb3cgbXVsdGlwbGVFcnJvcnMoZXJyb3JzKTtcbiAgICB9XG4gIH1cbn07XG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIFhNTEh0dHBSZXF1ZXN0ICovXG5cbid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBCdWlsZGVyID0gcmVxdWlyZSgnLi9CdWlsZGVyJyk7XG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hcicpO1xudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFRoZSBtZXRhZ3JhbW1hciwgaS5lLiB0aGUgZ3JhbW1hciBmb3IgT2htIGdyYW1tYXJzLiBJbml0aWFsaXplZCBhdCB0aGVcbi8vIGJvdHRvbSBvZiB0aGlzIGZpbGUgYmVjYXVzZSBsb2FkaW5nIHRoZSBncmFtbWFyIHJlcXVpcmVzIE9obSBpdHNlbGYuXG52YXIgb2htR3JhbW1hcjtcblxuLy8gQW4gb2JqZWN0IHdoaWNoIG1ha2VzIGl0IHBvc3NpYmxlIHRvIHN0dWIgb3V0IHRoZSBkb2N1bWVudCBBUEkgZm9yIHRlc3RpbmcuXG52YXIgZG9jdW1lbnRJbnRlcmZhY2UgPSB7XG4gIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uKHNlbCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpOyB9LFxuICBxdWVyeVNlbGVjdG9yQWxsOiBmdW5jdGlvbihzZWwpIHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKTsgfVxufTtcblxuLy8gQ2hlY2sgaWYgYG9iamAgaXMgYSBET00gZWxlbWVudC5cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmopIHtcbiAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwO1xufVxuXG52YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuZnVuY3Rpb24gaXNBcnJheUxpa2Uob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG59XG5cbi8vIFRPRE86IGp1c3QgdXNlIHRoZSBqUXVlcnkgdGhpbmdcbmZ1bmN0aW9uIGxvYWQodXJsKSB7XG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgZmFsc2UpO1xuICB0cnkge1xuICAgIHJlcS5zZW5kKCk7XG4gICAgaWYgKHJlcS5zdGF0dXMgPT09IDAgfHwgcmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICByZXR1cm4gcmVxLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvYWQgdXJsICcgKyB1cmwpO1xufVxuXG4vLyBSZXR1cm5zIGEgR3JhbW1hciBpbnN0YW5jZSAoaS5lLiwgYW4gb2JqZWN0IHdpdGggYSBgbWF0Y2hgIG1ldGhvZCkgZm9yXG4vLyBgdHJlZWAsIHdoaWNoIGlzIHRoZSBjb25jcmV0ZSBzeW50YXggdHJlZSBvZiBhIHVzZXItd3JpdHRlbiBncmFtbWFyLlxuLy8gVGhlIGdyYW1tYXIgd2lsbCBiZSBhc3NpZ25lZCBpbnRvIGBuYW1lc3BhY2VgIHVuZGVyIHRoZSBuYW1lIG9mIHRoZSBncmFtbWFyXG4vLyBhcyBzcGVjaWZpZWQgaW4gdGhlIHNvdXJjZS5cbmZ1bmN0aW9uIGJ1aWxkR3JhbW1hcihtYXRjaCwgbmFtZXNwYWNlLCBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZykge1xuICB2YXIgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gIHZhciBkZWNsO1xuICB2YXIgY3VycmVudFJ1bGVOYW1lO1xuICB2YXIgY3VycmVudFJ1bGVGb3JtYWxzO1xuICB2YXIgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICB2YXIgbWV0YUdyYW1tYXIgPSBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZyB8fCBvaG1HcmFtbWFyO1xuXG4gIC8vIEEgdmlzaXRvciB0aGF0IHByb2R1Y2VzIGEgR3JhbW1hciBpbnN0YW5jZSBmcm9tIHRoZSBDU1QuXG4gIHZhciBoZWxwZXJzID0gbWV0YUdyYW1tYXIuc2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCd2aXNpdCcsIHtcbiAgICBHcmFtbWFyOiBmdW5jdGlvbihuLCBzLCBvcGVuLCBycywgY2xvc2UpIHtcbiAgICAgIHZhciBncmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGRlY2wgPSBidWlsZGVyLm5ld0dyYW1tYXIoZ3JhbW1hck5hbWUsIG5hbWVzcGFjZSk7XG4gICAgICBzLnZpc2l0KCk7XG4gICAgICBycy52aXNpdCgpO1xuICAgICAgdmFyIGcgPSBkZWNsLmJ1aWxkKCk7XG4gICAgICBnLmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgaWYgKGdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGcsIG5hbWVzcGFjZSk7XG4gICAgICB9XG4gICAgICBuYW1lc3BhY2VbZ3JhbW1hck5hbWVdID0gZztcbiAgICAgIHJldHVybiBnO1xuICAgIH0sXG5cbiAgICBTdXBlckdyYW1tYXI6IGZ1bmN0aW9uKF8sIG4pIHtcbiAgICAgIHZhciBzdXBlckdyYW1tYXJOYW1lID0gbi52aXNpdCgpO1xuICAgICAgaWYgKHN1cGVyR3JhbW1hck5hbWUgPT09ICdudWxsJykge1xuICAgICAgICBkZWNsLndpdGhTdXBlckdyYW1tYXIobnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW5hbWVzcGFjZSB8fCAhKHN1cGVyR3JhbW1hck5hbWUgaW4gbmFtZXNwYWNlKSkge1xuICAgICAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkR3JhbW1hcihzdXBlckdyYW1tYXJOYW1lLCBuYW1lc3BhY2UsIG4uaW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihuYW1lc3BhY2Vbc3VwZXJHcmFtbWFyTmFtZV0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBSdWxlX2RlZmluZTogZnVuY3Rpb24obiwgZnMsIGQsIF9lcXVhbHMsIF9vcHRCYXIsIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLnZpc2l0KClbMF0gfHwgW107XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUgeWV0LCBzZXQgaXQgbm93LiBUaGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgdmlzaXRpbmdcbiAgICAgIC8vIHRoZSBib2R5LCBiZWNhdXNlIGl0IG1pZ2h0IGNvbnRhaW4gYW4gaW5saW5lIHJ1bGUgZGVmaW5pdGlvbi5cbiAgICAgIGlmICghZGVjbC5kZWZhdWx0U3RhcnRSdWxlICYmIGRlY2wuZW5zdXJlU3VwZXJHcmFtbWFyKCkgIT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMpIHtcbiAgICAgICAgZGVjbC53aXRoRGVmYXVsdFN0YXJ0UnVsZShjdXJyZW50UnVsZU5hbWUpO1xuICAgICAgfVxuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZC52aXNpdCgpWzBdO1xuICAgICAgcmV0dXJuIGRlY2wuZGVmaW5lKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbik7XG4gICAgfSxcbiAgICBSdWxlX292ZXJyaWRlOiBmdW5jdGlvbihuLCBmcywgX2NvbG9uRXF1YWxzLCBfb3B0QmFyLCBiKSB7XG4gICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy52aXNpdCgpWzBdIHx8IFtdO1xuICAgICAgb3ZlcnJpZGluZyA9IHRydWU7XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIGJvZHkuZGVmaW5pdGlvbkludGVydmFsID0gdGhpcy5pbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICB2YXIgYW5zID0gZGVjbC5vdmVycmlkZShjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSk7XG4gICAgICBvdmVycmlkaW5nID0gZmFsc2U7XG4gICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgUnVsZV9leHRlbmQ6IGZ1bmN0aW9uKG4sIGZzLCBfcGx1c0VxdWFscywgX29wdEJhciwgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgdmFyIGFucyA9IGRlY2wuZXh0ZW5kKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5KTtcbiAgICAgIGRlY2wucnVsZUJvZGllc1tjdXJyZW50UnVsZU5hbWVdLmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuXG4gICAgRm9ybWFsczogZnVuY3Rpb24ob3BvaW50eSwgZnMsIGNwb2ludHkpIHtcbiAgICAgIHJldHVybiBmcy52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBQYXJhbXM6IGZ1bmN0aW9uKG9wb2ludHksIHBzLCBjcG9pbnR5KSB7XG4gICAgICByZXR1cm4gcHMudmlzaXQoKTtcbiAgICB9LFxuXG4gICAgQWx0OiBmdW5jdGlvbih0ZXJtLCBfLCB0ZXJtcykge1xuICAgICAgdmFyIGFyZ3MgPSBbdGVybS52aXNpdCgpXS5jb25jYXQodGVybXMudmlzaXQoKSk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hbHQuYXBwbHkoYnVpbGRlciwgYXJncykud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG5cbiAgICBUZXJtX2lubGluZTogZnVuY3Rpb24oYiwgbikge1xuICAgICAgdmFyIGlubGluZVJ1bGVOYW1lID0gY3VycmVudFJ1bGVOYW1lICsgJ18nICsgbi52aXNpdCgpO1xuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICBib2R5LmRlZmluaXRpb25JbnRlcnZhbCA9IHRoaXMuaW50ZXJ2YWwudHJpbW1lZCgpO1xuICAgICAgdmFyIGlzTmV3UnVsZURlY2xhcmF0aW9uID1cbiAgICAgICAgICAhKGRlY2wuc3VwZXJHcmFtbWFyICYmIGRlY2wuc3VwZXJHcmFtbWFyLnJ1bGVCb2RpZXNbaW5saW5lUnVsZU5hbWVdKTtcbiAgICAgIGlmIChvdmVycmlkaW5nICYmICFpc05ld1J1bGVEZWNsYXJhdGlvbikge1xuICAgICAgICBkZWNsLm92ZXJyaWRlKGlubGluZVJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVjbC5kZWZpbmUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSk7XG4gICAgICB9XG4gICAgICB2YXIgcGFyYW1zID0gY3VycmVudFJ1bGVGb3JtYWxzLm1hcChmdW5jdGlvbihmb3JtYWwpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGZvcm1hbCk7IH0pO1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKGlubGluZVJ1bGVOYW1lLCBwYXJhbXMpLndpdGhJbnRlcnZhbChib2R5LmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgU2VxOiBmdW5jdGlvbihleHByKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5zZXEuYXBwbHkoYnVpbGRlciwgZXhwci52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIEl0ZXJfc3RhcjogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuc3Rhcih4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEl0ZXJfcGx1czogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIucGx1cyh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEl0ZXJfb3B0OiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5vcHQoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIFByZWRfbm90OiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5ub3QoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBQcmVkX2xvb2thaGVhZDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubGEoeC52aXNpdCgpKS53aXRoSW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcblxuICAgIExleF9sZXg6IGZ1bmN0aW9uKF8sIHgpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLmxleCh4LnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuXG4gICAgQmFzZV9hcHBsaWNhdGlvbjogZnVuY3Rpb24ocnVsZSwgcHMpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLmFwcChydWxlLnZpc2l0KCksIHBzLnZpc2l0KClbMF0gfHwgW10pLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEJhc2VfcmFuZ2U6IGZ1bmN0aW9uKGZyb20sIF8sIHRvKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5yYW5nZShmcm9tLnZpc2l0KCksIHRvLnZpc2l0KCkpLndpdGhJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICB9LFxuICAgIEJhc2VfdGVybWluYWw6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnRlcm1pbmFsKGV4cHIudmlzaXQoKSkud2l0aEludGVydmFsKHRoaXMuaW50ZXJ2YWwpO1xuICAgIH0sXG4gICAgQmFzZV9wYXJlbjogZnVuY3Rpb24ob3BlbiwgeCwgY2xvc2UpIHtcbiAgICAgIHJldHVybiB4LnZpc2l0KCk7XG4gICAgfSxcblxuICAgIHJ1bGVEZXNjcjogZnVuY3Rpb24ob3BlbiwgdCwgY2xvc2UpIHtcbiAgICAgIHJldHVybiB0LnZpc2l0KCk7XG4gICAgfSxcbiAgICBydWxlRGVzY3JUZXh0OiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cy50cmltKCk7XG4gICAgfSxcblxuICAgIGNhc2VOYW1lOiBmdW5jdGlvbihfLCBzcGFjZTEsIG4sIHNwYWNlMiwgZW5kKSB7XG4gICAgICByZXR1cm4gbi52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBuYW1lOiBmdW5jdGlvbihmaXJzdCwgcmVzdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7XG4gICAgfSxcbiAgICBuYW1lRmlyc3Q6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuICAgIG5hbWVSZXN0OiBmdW5jdGlvbihleHByKSB7fSxcblxuICAgIHRlcm1pbmFsOiBmdW5jdGlvbihvcGVuLCBjcywgY2xvc2UpIHtcbiAgICAgIHJldHVybiBjcy52aXNpdCgpLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiBjb21tb24udW5lc2NhcGVDaGFyKGMpOyB9KS5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgdGVybWluYWxDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC5jb250ZW50cztcbiAgICB9LFxuXG4gICAgZXNjYXBlQ2hhcjogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJ2YWwuY29udGVudHM7XG4gICAgfSxcblxuICAgIE5vbmVtcHR5TGlzdE9mOiBmdW5jdGlvbih4LCBfLCB4cykge1xuICAgICAgcmV0dXJuIFt4LnZpc2l0KCldLmNvbmNhdCh4cy52aXNpdCgpKTtcbiAgICB9LFxuICAgIEVtcHR5TGlzdE9mOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuXG4gICAgX3Rlcm1pbmFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByaW1pdGl2ZVZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBoZWxwZXJzKG1hdGNoKS52aXNpdCgpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5hbWVzcGFjZSkge1xuICB2YXIgbSA9IG9obUdyYW1tYXIubWF0Y2goc291cmNlLCAnR3JhbW1hcnMnKTtcbiAgaWYgKG0uZmFpbGVkKCkpIHtcbiAgICB0aHJvdyBlcnJvcnMuZ3JhbW1hclN5bnRheEVycm9yKG0pO1xuICB9XG4gIHJldHVybiBidWlsZEdyYW1tYXIobSwgbmFtZXNwYWNlKTtcbn1cblxuLy8gUmV0dXJuIHRoZSBjb250ZW50cyBvZiBhIHNjcmlwdCBlbGVtZW50LCBmZXRjaGluZyBpdCB2aWEgWEhSIGlmIG5lY2Vzc2FyeS5cbmZ1bmN0aW9uIGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhlbCkge1xuICBpZiAoIWlzRWxlbWVudChlbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIERPTSBOb2RlLCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoZWwpKTtcbiAgfVxuICBpZiAoZWwudHlwZSAhPT0gJ3RleHQvb2htLWpzJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzY3JpcHQgdGFnIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIsIGdvdCAnICsgZWwpO1xuICB9XG4gIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpID8gbG9hZChlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSA6IGVsLmlubmVySFRNTDtcbn1cblxuZnVuY3Rpb24gZ3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICB2YXIgbnMgPSBncmFtbWFycyhzb3VyY2UsIG9wdE5hbWVzcGFjZSk7XG5cbiAgLy8gRW5zdXJlIHRoYXQgdGhlIHNvdXJjZSBjb250YWluZWQgbm8gbW9yZSB0aGFuIG9uZSBncmFtbWFyIGRlZmluaXRpb24uXG4gIHZhciBncmFtbWFyTmFtZXMgPSBPYmplY3Qua2V5cyhucyk7XG4gIGlmIChncmFtbWFyTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGdyYW1tYXIgZGVmaW5pdGlvbicpO1xuICB9IGVsc2UgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIHNlY29uZEdyYW1tYXIgPSBuc1tncmFtbWFyTmFtZXNbMV1dO1xuICAgIHZhciBpbnRlcnZhbCA9IHNlY29uZEdyYW1tYXIuZGVmaW5pdGlvbkludGVydmFsO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZShpbnRlcnZhbC5pbnB1dFN0cmVhbS5zb3VyY2UsIGludGVydmFsLnN0YXJ0SWR4KSArXG4gICAgICAgICdGb3VuZCBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbiAtLSB1c2Ugb2htLmdyYW1tYXJzKCkgaW5zdGVhZC4nKTtcbiAgfVxuICByZXR1cm4gbnNbZ3JhbW1hck5hbWVzWzBdXTsgIC8vIFJldHVybiB0aGUgb25lIGFuZCBvbmx5IGdyYW1tYXIuXG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBucyA9IE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLmFzTmFtZXNwYWNlKG9wdE5hbWVzcGFjZSkpO1xuICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIGRldGVjdCBOb2RlLmpzIEJ1ZmZlciBvYmplY3RzIGFuZCBhdXRvbWF0aWNhbGx5IGNhbGwgdG9TdHJpbmcoKS5cbiAgICBpZiAoaXNCdWZmZXIoc291cmNlKSkge1xuICAgICAgc291cmNlID0gc291cmNlLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ0V4cGVjdGVkIHN0cmluZyBhcyBmaXJzdCBhcmd1bWVudCwgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKHNvdXJjZSkpO1xuICAgIH1cbiAgfVxuICBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5zKTtcbiAgcmV0dXJuIG5zO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQob3B0Tm9kZSkge1xuICB2YXIgbm9kZSA9IG9wdE5vZGU7XG4gIGlmIChpc1VuZGVmaW5lZChub2RlKSkge1xuICAgIHZhciBub2RlTGlzdCA9IGRvY3VtZW50SW50ZXJmYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9vaG0tanNcIl0nKTtcbiAgICBpZiAobm9kZUxpc3QubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0V4cGVjdGVkIGV4YWN0bHkgb25lIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZm91bmQgJyArIG5vZGVMaXN0Lmxlbmd0aCk7XG4gICAgfVxuICAgIG5vZGUgPSBub2RlTGlzdFswXTtcbiAgfVxuICByZXR1cm4gZ3JhbW1hcihnZXRTY3JpcHRFbGVtZW50Q29udGVudHMobm9kZSkpO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50cyhvcHROb2RlT3JOb2RlTGlzdCkge1xuICAvLyBTaW1wbGUgY2FzZTogdGhlIGFyZ3VtZW50IGlzIGEgRE9NIG5vZGUuXG4gIGlmIChpc0VsZW1lbnQob3B0Tm9kZU9yTm9kZUxpc3QpKSB7XG4gICAgcmV0dXJuIGdyYW1tYXJzKG9wdE5vZGVPck5vZGVMaXN0KTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIGl0IG11c3QgYmUgZWl0aGVyIHVuZGVmaW5lZCBvciBhIE5vZGVMaXN0LlxuICB2YXIgbm9kZUxpc3QgPSBvcHROb2RlT3JOb2RlTGlzdDtcbiAgaWYgKGlzVW5kZWZpbmVkKG5vZGVMaXN0KSkge1xuICAgIC8vIEZpbmQgYWxsIHNjcmlwdCBlbGVtZW50cyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLlxuICAgIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBub2RlTGlzdCA9PT0gJ3N0cmluZycgfHwgKCFpc0VsZW1lbnQobm9kZUxpc3QpICYmICFpc0FycmF5TGlrZShub2RlTGlzdCkpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBOb2RlLCBOb2RlTGlzdCwgb3IgQXJyYXksIGJ1dCBnb3QgJyArIG5vZGVMaXN0KTtcbiAgfVxuICB2YXIgbnMgPSBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBDb3B5IHRoZSBuZXcgZ3JhbW1hcnMgaW50byBgbnNgIHRvIGtlZXAgdGhlIG5hbWVzcGFjZSBmbGF0LlxuICAgIGNvbW1vbi5leHRlbmQobnMsIGdyYW1tYXJzKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlTGlzdFtpXSksIG5zKSk7XG4gIH1cbiAgcmV0dXJuIG5zO1xufVxuXG5mdW5jdGlvbiBtYWtlUmVjaXBlKHJlY2lwZUZuKSB7XG4gIHJldHVybiByZWNpcGVGbi5jYWxsKG5ldyBCdWlsZGVyKCkpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gU3R1ZmYgdGhhdCB1c2VycyBzaG91bGQga25vdyBhYm91dFxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNyZWF0ZU5hbWVzcGFjZTogTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSxcbiAgZ3JhbW1hcjogZ3JhbW1hcixcbiAgZ3JhbW1hcnM6IGdyYW1tYXJzLFxuICBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQ6IGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudCxcbiAgZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHM6IGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzLFxuICBtYWtlUmVjaXBlOiBtYWtlUmVjaXBlLFxuICBvaG1HcmFtbWFyOiBudWxsLCAgLy8gSW5pdGlhbGl6ZWQgYmVsb3csIGFmdGVyIEdyYW1tYXIuQnVpbHRJblJ1bGVzLlxuICBwZXhwcnM6IHBleHBycyxcbiAgdXRpbDogdXRpbCxcbiAgZXh0cmFzOiByZXF1aXJlKCcuLi9leHRyYXMnKVxufTtcblxuLy8gU3R1ZmYgZm9yIHRlc3RpbmcsIGV0Yy5cbm1vZHVsZS5leHBvcnRzLl9idWlsZEdyYW1tYXIgPSBidWlsZEdyYW1tYXI7XG5tb2R1bGUuZXhwb3J0cy5fc2V0RG9jdW1lbnRJbnRlcmZhY2VGb3JUZXN0aW5nID0gZnVuY3Rpb24oZG9jKSB7IGRvY3VtZW50SW50ZXJmYWNlID0gZG9jOyB9O1xuXG4vLyBMYXRlIGluaXRpYWxpemF0aW9uIGZvciBzdHVmZiB0aGF0IGlzIGJvb3RzdHJhcHBlZC5cblxuR3JhbW1hci5CdWlsdEluUnVsZXMgPSByZXF1aXJlKCcuLi9kaXN0L2J1aWx0LWluLXJ1bGVzJyk7XG5cbnZhciBTZW1hbnRpY3MgPSByZXF1aXJlKCcuL1NlbWFudGljcycpO1xudmFyIG9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzR3JhbW1hciA9IHJlcXVpcmUoJy4uL2Rpc3Qvb3BlcmF0aW9ucy1hbmQtYXR0cmlidXRlcycpO1xuU2VtYW50aWNzLmluaXRCdWlsdEluU2VtYW50aWNzKEdyYW1tYXIuQnVpbHRJblJ1bGVzKTtcblNlbWFudGljcy5pbml0UHJvdG90eXBlUGFyc2VyKG9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzR3JhbW1hcik7ICAvLyByZXF1aXJlcyBCdWlsdEluU2VtYW50aWNzXG5cbm1vZHVsZS5leHBvcnRzLm9obUdyYW1tYXIgPSBvaG1HcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hcicpO1xuR3JhbW1hci5pbml0QXBwbGljYXRpb25QYXJzZXIob2htR3JhbW1hciwgYnVpbGRHcmFtbWFyKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBOb2RlKGdyYW1tYXIsIGN0b3JOYW1lLCBjaGlsZHJlbiwgaW50ZXJ2YWwpIHtcbiAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgdGhpcy5jdG9yTmFtZSA9IGN0b3JOYW1lO1xuICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIHRoaXMuaW50ZXJ2YWwgPSBpbnRlcnZhbDtcbn1cblxuTm9kZS5wcm90b3R5cGUubnVtQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4ubGVuZ3RoO1xufTtcblxuTm9kZS5wcm90b3R5cGUuY2hpbGRBdCA9IGZ1bmN0aW9uKGlkeCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbltpZHhdO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaW5kZXhPZkNoaWxkID0gZnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYXJnKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmhhc0NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aCA+IDA7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5oYXNOb0NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5oYXNDaGlsZHJlbigpO1xufTtcblxuTm9kZS5wcm90b3R5cGUub25seUNoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmNoaWxkcmVuLmxlbmd0aCAhPT0gMSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2Nhbm5vdCBnZXQgb25seSBjaGlsZCBvZiBhIG5vZGUgb2YgdHlwZSAnICsgdGhpcy5jdG9yTmFtZSArXG4gICAgICAgICcgKGl0IGhhcyAnICsgdGhpcy5udW1DaGlsZHJlbigpICsgJyBjaGlsZHJlbiknKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5maXJzdENoaWxkKCk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmZpcnN0Q2hpbGQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnY2Fubm90IGdldCBmaXJzdCBjaGlsZCBvZiBhICcgKyB0aGlzLmN0b3JOYW1lICsgJyBub2RlLCB3aGljaCBoYXMgbm8gY2hpbGRyZW4nKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KDApO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5sYXN0Q2hpbGQgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnY2Fubm90IGdldCBsYXN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQodGhpcy5udW1DaGlsZHJlbigpIC0gMSk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQmVmb3JlID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgdmFyIGNoaWxkSWR4ID0gdGhpcy5pbmRleE9mQ2hpbGQoY2hpbGQpO1xuICBpZiAoY2hpbGRJZHggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmNoaWxkQmVmb3JlKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgfSBlbHNlIGlmIChjaGlsZElkeCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBiZWZvcmUgZmlyc3QgY2hpbGQnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4IC0gMSk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQWZ0ZXIgPSBmdW5jdGlvbihjaGlsZCkge1xuICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRBZnRlcigpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gIH0gZWxzZSBpZiAoY2hpbGRJZHggPT09IHRoaXMubnVtQ2hpbGRyZW4oKSAtIDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgY2hpbGQgYWZ0ZXIgbGFzdCBjaGlsZCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggKyAxKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTm9kZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gIHZhciByID0ge307XG4gIHJbdGhpcy5jdG9yTmFtZV0gPSB0aGlzLmNoaWxkcmVuO1xuICByZXR1cm4gcjtcbn07XG5cbi8vIFRlcm1pbmFsc1xuXG5mdW5jdGlvbiBUZXJtaW5hbE5vZGUoZ3JhbW1hciwgdmFsdWUsIGludGVydmFsKSB7XG4gIE5vZGUuY2FsbCh0aGlzLCBncmFtbWFyLCAnX3Rlcm1pbmFsJywgW10sIGludGVydmFsKTtcbiAgdGhpcy5wcmltaXRpdmVWYWx1ZSA9IHZhbHVlO1xufVxuaW5oZXJpdHMoVGVybWluYWxOb2RlLCBOb2RlKTtcblxuVGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLy8gTm9udGVybWluYWxzXG5cbmZ1bmN0aW9uIE5vbnRlcm1pbmFsTm9kZShncmFtbWFyLCBydWxlTmFtZSwgY2hpbGRyZW4sIGludGVydmFsKSB7XG4gIE5vZGUuY2FsbCh0aGlzLCBncmFtbWFyLCBydWxlTmFtZSwgY2hpbGRyZW4sIGludGVydmFsKTtcbn1cbmluaGVyaXRzKE5vbnRlcm1pbmFsTm9kZSwgTm9kZSk7XG5cbk5vbnRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbk5vbnRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNMZXhpY2FsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjb21tb24uaXNMZXhpY2FsKHRoaXMuY3Rvck5hbWUpO1xufTtcblxuTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY29tbW9uLmlzU3ludGFjdGljKHRoaXMuY3Rvck5hbWUpO1xufTtcblxuLy8gSXRlcmF0aW9uc1xuXG5mdW5jdGlvbiBJdGVyYXRpb25Ob2RlKGdyYW1tYXIsIGNoaWxkcmVuLCBpbnRlcnZhbCwgb3B0aW9uYWwpIHtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsICdfaXRlcicsIGNoaWxkcmVuLCBpbnRlcnZhbCk7XG4gIHRoaXMub3B0aW9uYWwgPSBvcHRpb25hbDtcbn1cbmluaGVyaXRzKEl0ZXJhdGlvbk5vZGUsIE5vZGUpO1xuXG5JdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkl0ZXJhdGlvbk5vZGUucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9uYWw7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE5vZGU6IE5vZGUsXG4gIFRlcm1pbmFsTm9kZTogVGVybWluYWxOb2RlLFxuICBOb250ZXJtaW5hbE5vZGU6IE5vbnRlcm1pbmFsTm9kZSxcbiAgSXRlcmF0aW9uTm9kZTogSXRlcmF0aW9uTm9kZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBSZXR1cm4gdHJ1ZSBpZiB3ZSBzaG91bGQgc2tpcCBzcGFjZXMgcHJlY2VkaW5nIHRoaXMgZXhwcmVzc2lvbiBpbiBhIHN5bnRhY3RpYyBjb250ZXh0LlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxuLypcbiAgR2VuZXJhbGx5LCB0aGVzZSBhcmUgYWxsIGZpcnN0LW9yZGVyIGV4cHJlc3Npb25zIHRoYXQgb3BlcmF0ZSBvbiBzdHJpbmdzIGFuZCAod2l0aCB0aGVcbiAgZXhjZXB0aW9uIG9mIEFwcGx5KSBkaXJlY3RseSByZWFkIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiovXG5wZXhwcnMuYW55LmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLmVuZC5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qXG4gIEhpZ2hlci1vcmRlciBleHByZXNzaW9ucyB0aGF0IGRvbid0IGRpcmVjdGx5IGNvbnN1bWUgaW5wdXQsIGFuZCBleHByZXNzaW9ucyB0aGF0XG4gIGRvbid0IG9wZXJhdGUgb24gc3RyaW5nIGlucHV0IHN0cmVhbXMgKGUuZy4gT2JqIGFuZCBBcnIpLlxuKi9cbnBleHBycy5BbHQucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5TZXEucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBsZXhpZnlDb3VudDtcblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGxleGlmeUNvdW50ID0gMDtcbiAgdGhpcy5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xufTtcblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5lbmQuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGxleGlmeUNvdW50Kys7XG4gIHRoaXMuZXhwci5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICBsZXhpZnlDb3VudC0tO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlQm9kaWVzW3RoaXMucnVsZU5hbWVdO1xuXG4gIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBydWxlIGV4aXN0cy4uLlxuICBpZiAoIWJvZHkpIHtcbiAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZFJ1bGUodGhpcy5ydWxlTmFtZSwgZ3JhbW1hci5uYW1lLCB0aGlzLmludGVydmFsKTtcbiAgfVxuXG4gIC8vIC4uLmFuZCB0aGF0IHRoaXMgYXBwbGljYXRpb24gaXMgYWxsb3dlZFxuICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpICYmICghY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSB8fCBsZXhpZnlDb3VudCA+IDApKSB7XG4gICAgdGhyb3cgZXJyb3JzLmFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0KHRoaXMucnVsZU5hbWUsIHRoaXMpO1xuICB9XG5cbiAgLy8gLi4uYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBoYXMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50c1xuICB2YXIgYWN0dWFsID0gdGhpcy5hcmdzLmxlbmd0aDtcbiAgdmFyIGV4cGVjdGVkID0gZ3JhbW1hci5ydWxlRm9ybWFsc1t0aGlzLnJ1bGVOYW1lXS5sZW5ndGg7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZBcmd1bWVudHModGhpcy5ydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgdGhpcyk7XG4gIH1cblxuICAvLyAuLi5hbmQgdGhhdCBhbGwgb2YgdGhlIGFyZ3VtZW50IGV4cHJlc3Npb25zIG9ubHkgaGF2ZSB2YWxpZCBhcHBsaWNhdGlvbnMgYW5kIGhhdmUgYXJpdHkgMS5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcpIHtcbiAgICBhcmcuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICBpZiAoYXJnLmdldEFyaXR5KCkgIT09IDEpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnZhbGlkUGFyYW1ldGVyKHNlbGYucnVsZU5hbWUsIGFyZyk7XG4gICAgfVxuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuYW55LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5lbmQuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgYXJpdHkgPSB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgIHRlcm0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkoKTtcbiAgICB2YXIgb3RoZXJBcml0eSA9IHRlcm0uZ2V0QXJpdHkoKTtcbiAgICBpZiAoYXJpdHkgIT09IG90aGVyQXJpdHkpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgYXJpdHksIG90aGVyQXJpdHksIHRlcm0pO1xuICAgIH1cbiAgfVxufTtcblxucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBFeHRlbmQgaXMgYSBzcGVjaWFsIGNhc2Ugb2YgQWx0IHRoYXQncyBndWFyYW50ZWVkIHRvIGhhdmUgZXhhY3RseSB0d29cbiAgLy8gY2FzZXM6IFtleHRlbnNpb25zLCBvcmlnQm9keV0uXG4gIHZhciBhY3R1YWxBcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgdmFyIGV4cGVjdGVkQXJpdHkgPSB0aGlzLnRlcm1zWzFdLmdldEFyaXR5KCk7XG4gIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgIHRocm93IGVycm9ycy5pbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgZXhwZWN0ZWRBcml0eSwgYWN0dWFsQXJpdHksIHRoaXMudGVybXNbMF0pO1xuICB9XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcCAobm90IHJlcXVpcmVkIGIvYyB0aGUgbmVzdGVkIGV4cHIgZG9lc24ndCBzaG93IHVwIGluIHRoZSBDU1QpXG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gVGhlIGFyaXRpZXMgb2YgdGhlIHBhcmFtZXRlciBleHByZXNzaW9ucyBpcyByZXF1aXJlZCB0byBiZSAxIGJ5XG4gIC8vIGBhc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCgpYC5cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLmVuZC5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIC8vIE5vdGU6IHRoaXMgaXMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGZvciBgU3RhcmAgYW5kIGBQbHVzYCBleHByZXNzaW9ucy5cbiAgLy8gSXQgaXMgb3ZlcnJpZGRlbiBmb3IgYE9wdGAgYmVsb3cuXG4gIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICBpZiAodGhpcy5leHByLmlzTnVsbGFibGUoZ3JhbW1hcikpIHtcbiAgICB0aHJvdyBlcnJvcnMua2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCh0aGlzLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5MZXgucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcpIHtcbiAgICBhcmcuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuY2hlY2sgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzLmxlbmd0aCA+PSAxO1xufTtcblxucGV4cHJzLmVuZC5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdW5kZWZpbmVkO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdGhpcy5vYmo7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB0eXBlb2YgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdHlwZW9mIHRoaXMuZnJvbTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzLmxlbmd0aCA+PSAxO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50ZXJtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpXTtcbiAgICBpZiAodGVybS5jaGVjayhncmFtbWFyLCB2YWxzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2ldO1xuICAgIGlmIChmYWN0b3IuY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IGZhY3Rvci5nZXRBcml0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIHZhciBjb2x1bW5zID0gdmFscy5zbGljZSgwLCBhcml0eSk7XG4gIGlmIChjb2x1bW5zLmxlbmd0aCAhPT0gYXJpdHkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHJvd0NvdW50ID0gY29sdW1uc1swXS5sZW5ndGg7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgYXJpdHk7IGkrKykge1xuICAgIGlmIChjb2x1bW5zW2ldLmxlbmd0aCAhPT0gcm93Q291bnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xuICAgIHZhciByb3cgPSBbXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFyaXR5OyBqKyspIHtcbiAgICAgIHJvdy5wdXNoKGNvbHVtbnNbal1baV0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhwci5jaGVjayhncmFtbWFyLCByb3cpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5jaGVjayA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5jaGVjayhncmFtbWFyLCB2YWxzKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGlmICghKHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgIHZhbHNbMF0uZ3JhbW1hciA9PT0gZ3JhbW1hciAmJlxuICAgICAgICB2YWxzWzBdLmN0b3JOYW1lID09PSB0aGlzLnJ1bGVOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFRPRE86IHRoaW5rIGFib3V0ICpub3QqIGRvaW5nIHRoZSBmb2xsb3dpbmcgY2hlY2tzLCBpLmUuLCB0cnVzdGluZyB0aGF0IHRoZSBydWxlXG4gIC8vIHdhcyBjb3JyZWN0bHkgY29uc3RydWN0ZWQuXG4gIHZhciBydWxlTm9kZSA9IHZhbHNbMF07XG4gIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlQm9kaWVzW3RoaXMucnVsZU5hbWVdO1xuICByZXR1cm4gYm9keS5jaGVjayhncmFtbWFyLCBydWxlTm9kZS5jaGlsZHJlbikgJiYgcnVsZU5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gYm9keS5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdHlwZW9mIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09ICdzdHJpbmcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIG5vZGVzID0gcmVxdWlyZSgnLi9ub2RlcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbnZhciBUZXJtaW5hbE5vZGUgPSBub2Rlcy5UZXJtaW5hbE5vZGU7XG52YXIgTm9udGVybWluYWxOb2RlID0gbm9kZXMuTm9udGVybWluYWxOb2RlO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSBub2Rlcy5JdGVyYXRpb25Ob2RlO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgRXZhbHVhdGUgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZHMsIGBmYWxzZWAgb3RoZXJ3aXNlLiBUaGlzIG1ldGhvZCBzaG91bGRcbiAgb25seSBiZSBjYWxsZWQgZGlyZWN0bHkgYnkgYFN0YXRlLnByb3RvdHlwZS5ldmFsKGV4cHIpYCwgd2hpY2ggYWxzbyB1cGRhdGVzIHRoZSBkYXRhIHN0cnVjdHVyZXNcbiAgdGhhdCBhcmUgdXNlZCBmb3IgdHJhY2luZy4gKE1ha2luZyB0aG9zZSB1cGRhdGVzIGluIGEgbWV0aG9kIG9mIGBTdGF0ZWAgZW5hYmxlcyB0aGUgdHJhY2Utc3BlY2lmaWNcbiAgZGF0YSBzdHJ1Y3R1cmVzIHRvIGJlIFwic2VjcmV0c1wiIG9mIHRoYXQgY2xhc3MsIHdoaWNoIGlzIGdvb2QgZm9yIG1vZHVsYXJpdHkuKVxuXG4gIFRoZSBjb250cmFjdCBvZiB0aGlzIG1ldGhvZCBpcyBhcyBmb2xsb3dzOlxuICAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBgdHJ1ZWAsXG4gICAgLSB0aGUgc3RhdGUgb2JqZWN0IHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGJpbmRpbmdzIHRoYW4gaXQgZGlkIGJlZm9yZSB0aGUgY2FsbC5cbiAgKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgYGZhbHNlYCxcbiAgICAtIHRoZSBzdGF0ZSBvYmplY3QgbWF5IGhhdmUgbW9yZSBiaW5kaW5ncyB0aGFuIGl0IGRpZCBiZWZvcmUgdGhlIGNhbGwsIGFuZFxuICAgIC0gaXRzIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heSBiZSBhbnl3aGVyZS5cblxuICBOb3RlIHRoYXQgYFN0YXRlLnByb3RvdHlwZS5ldmFsKGV4cHIpYCwgdW5saWtlIHRoaXMgbWV0aG9kLCBndWFyYW50ZWVzIHRoYXQgbmVpdGhlciB0aGUgc3RhdGVcbiAgb2JqZWN0J3MgYmluZGluZ3Mgbm9yIGl0cyBpbnB1dCBzdHJlYW0ncyBwb3NpdGlvbiB3aWxsIGNoYW5nZSBpZiB0aGUgZXhwcmVzc2lvbiBmYWlscyB0byBtYXRjaC5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmV2YWwgPSBjb21tb24uYWJzdHJhY3Q7ICAvLyBmdW5jdGlvbihzdGF0ZSkgeyAuLi4gfVxuXG5wZXhwcnMuYW55LmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBjaCA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKGNoKSB7XG4gICAgdmFyIGludGVydmFsID0gaW5wdXRTdHJlYW0uaW50ZXJ2YWwob3JpZ1Bvcyk7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoLCBpbnRlcnZhbCkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLmVuZC5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAoaW5wdXRTdHJlYW0uYXRFbmQoKSkge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKGlucHV0U3RyZWFtLnBvcyk7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHVuZGVmaW5lZCwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgaWYgKCF0aGlzLm1hdGNoKGlucHV0U3RyZWFtKSkge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBpbnB1dFN0cmVhbS5pbnRlcnZhbChvcmlnUG9zKTtcbiAgICB2YXIgcHJpbWl0aXZlVmFsdWUgPSB0aGlzLm9iajtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgcHJpbWl0aXZlVmFsdWUsIGludGVydmFsKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihpbnB1dFN0cmVhbSkge1xuICByZXR1cm4gaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopO1xufTtcblxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChjaCAmJiB0aGlzLmZyb20gPD0gY2ggJiYgY2ggPD0gdGhpcy50bykge1xuICAgIHZhciBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MpO1xuICAgIHN0YXRlLmJpbmRpbmdzLnB1c2gobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBjaCwgaW50ZXJ2YWwpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHJldHVybiBzdGF0ZS5ldmFsKHN0YXRlLmN1cnJlbnRBcHBsaWNhdGlvbigpLmFyZ3NbdGhpcy5pbmRleF0pO1xufTtcblxucGV4cHJzLkxleC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHN0YXRlLmVudGVyTGV4aWZpZWRDb250ZXh0KCk7XG4gIHZhciBhbnMgPSBzdGF0ZS5ldmFsKHRoaXMuZXhwcik7XG4gIHN0YXRlLmV4aXRMZXhpZmllZENvbnRleHQoKTtcbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICBpZiAoc3RhdGUuZXZhbCh0aGlzLnRlcm1zW2lkeF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdO1xuICAgIGlmICghc3RhdGUuZXZhbChmYWN0b3IpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBhcml0eSA9IHRoaXMuZ2V0QXJpdHkoKTtcbiAgdmFyIGNvbHMgPSBbXTtcbiAgd2hpbGUgKGNvbHMubGVuZ3RoIDwgYXJpdHkpIHtcbiAgICBjb2xzLnB1c2goW10pO1xuICB9XG4gIHZhciBudW1NYXRjaGVzID0gMDtcbiAgdmFyIGlkeDtcbiAgd2hpbGUgKG51bU1hdGNoZXMgPCB0aGlzLm1heE51bU1hdGNoZXMgJiYgc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgbnVtTWF0Y2hlcysrO1xuICAgIHZhciByb3cgPSBzdGF0ZS5iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuYmluZGluZ3MubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHJvdy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBjb2xzW2lkeF0ucHVzaChyb3dbaWR4XSk7XG4gICAgfVxuICB9XG4gIGlmIChudW1NYXRjaGVzIDwgdGhpcy5taW5OdW1NYXRjaGVzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBpbnRlcnZhbDtcbiAgaWYgKG51bU1hdGNoZXMgPT09IDApIHtcbiAgICBpbnRlcnZhbCA9IGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MsIG9yaWdQb3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBmaXJzdENvbCA9IGNvbHNbMF07XG4gICAgdmFyIGxhc3RDb2wgPSBjb2xzW2NvbHMubGVuZ3RoIC0gMV07XG4gICAgaW50ZXJ2YWwgPSBpbnB1dFN0cmVhbS5pbnRlcnZhbChcbiAgICAgICAgZmlyc3RDb2xbMF0uaW50ZXJ2YWwuc3RhcnRJZHgsXG4gICAgICAgIGxhc3RDb2xbbGFzdENvbC5sZW5ndGggLSAxXS5pbnRlcnZhbC5lbmRJZHgpO1xuICB9XG4gIGZvciAoaWR4ID0gMDsgaWR4IDwgY29scy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgc3RhdGUuYmluZGluZ3MucHVzaChuZXcgSXRlcmF0aW9uTm9kZShzdGF0ZS5ncmFtbWFyLCBjb2xzW2lkeF0sIGludGVydmFsLFxuICAgICAgdGhpcyBpbnN0YW5jZW9mIHBleHBycy5PcHQpKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAvKlxuICAgIFRPRE86XG4gICAgLSBSaWdodCBub3cgd2UncmUganVzdCB0aHJvd2luZyBhd2F5IGFsbCBvZiB0aGUgZmFpbHVyZXMgdGhhdCBoYXBwZW4gaW5zaWRlIGEgYG5vdGAsIGFuZFxuICAgICAgcmVjb3JkaW5nIGB0aGlzYCBhcyBhIGZhaWxlZCBleHByZXNzaW9uLlxuICAgIC0gRG91YmxlIG5lZ2F0aW9uIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvIGxvb2thaGVhZCwgYnV0IHRoYXQncyBub3QgdGhlIGNhc2UgcmlnaHQgbm93IHdydFxuICAgICAgZmFpbHVyZXMuIEUuZy4sIH5+J2ZvbycgcHJvZHVjZXMgYSBmYWlsdXJlIGZvciB+fidmb28nLCBidXQgbWF5YmUgaXQgc2hvdWxkIHByb2R1Y2VcbiAgICAgIGEgZmFpbHVyZSBmb3IgJ2ZvbycgaW5zdGVhZC5cbiAgKi9cblxuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBmYWlsdXJlc0luZm8gPSBzdGF0ZS5nZXRGYWlsdXJlc0luZm8oKTtcblxuICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpO1xuXG4gIHN0YXRlLnJlc3RvcmVGYWlsdXJlc0luZm8oZmFpbHVyZXNJbmZvKTtcbiAgaWYgKGFucykge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgaWYgKHN0YXRlLmV2YWwodGhpcy5leHByKSkge1xuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgY2FsbGVyID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gIHZhciBhY3R1YWxzID0gY2FsbGVyID8gY2FsbGVyLmFyZ3MgOiBbXTtcbiAgdmFyIGFwcCA9IHRoaXMuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcblxuICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gIGlmIChwb3NJbmZvLmlzQWN0aXZlKGFwcCkpIHtcbiAgICAvLyBUaGlzIHJ1bGUgaXMgYWxyZWFkeSBhY3RpdmUgYXQgdGhpcyBwb3NpdGlvbiwgaS5lLiwgaXQgaXMgbGVmdC1yZWN1cnNpdmUuXG4gICAgcmV0dXJuIGFwcC5oYW5kbGVDeWNsZShzdGF0ZSk7XG4gIH1cblxuICB2YXIgbWVtb0tleSA9IGFwcC50b01lbW9LZXkoKTtcbiAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gIHJldHVybiBtZW1vUmVjICYmIHBvc0luZm8uc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykgP1xuICAgICAgc3RhdGUudXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykgOlxuICAgICAgYXBwLnJlYWxseUV2YWwoc3RhdGUpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5oYW5kbGVDeWNsZSA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBwb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gcG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcblxuICBpZiAoY3VycmVudExlZnRSZWN1cnNpb24gJiYgY3VycmVudExlZnRSZWN1cnNpb24uaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpID09PSBtZW1vS2V5KSB7XG4gICAgLy8gV2UgYWxyZWFkeSBrbm93IGFib3V0IHRoaXMgbGVmdCByZWN1cnNpb24sIGJ1dCBpdCdzIHBvc3NpYmxlIHRoZXJlIGFyZSBcImludm9sdmVkXG4gICAgLy8gYXBwbGljYXRpb25zXCIgdGhhdCB3ZSBkb24ndCBhbHJlYWR5IGtub3cgYWJvdXQsIHNvLi4uXG4gICAgbWVtb1JlYy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMoKTtcbiAgfSBlbHNlIGlmICghbWVtb1JlYykge1xuICAgIC8vIE5ldyBsZWZ0IHJlY3Vyc2lvbiBkZXRlY3RlZCEgTWVtb2l6ZSBhIGZhaWx1cmUgdG8gdHJ5IHRvIGdldCBhIHNlZWQgcGFyc2UuXG4gICAgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtwb3M6IC0xLCB2YWx1ZTogZmFsc2V9O1xuICAgIHBvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHRoaXMsIG1lbW9SZWMpO1xuICB9XG4gIHJldHVybiBzdGF0ZS51c2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUucmVhbGx5RXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9yaWdQb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgdmFyIGJvZHkgPSBzdGF0ZS5ncmFtbWFyLnJ1bGVCb2RpZXNbdGhpcy5ydWxlTmFtZV07XG4gIHZhciBkZXNjcmlwdGlvbiA9IHN0YXRlLmdyYW1tYXIucnVsZURlc2NyaXB0aW9uc1t0aGlzLnJ1bGVOYW1lXTtcblxuICBvcmlnUG9zSW5mby5lbnRlcih0aGlzKTtcblxuICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgb3JpZ0ZhaWx1cmVzSW5mbyA9IHN0YXRlLmdldEZhaWx1cmVzSW5mbygpO1xuICB9XG5cbiAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICB2YXIgaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gY3VycmVudExSICYmIGN1cnJlbnRMUi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXk7XG4gIHZhciBtZW1vaXplZCA9IHRydWU7XG5cbiAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgIHZhbHVlID0gdGhpcy5ncm93U2VlZFJlc3VsdChib2R5LCBzdGF0ZSwgb3JpZ1BvcywgY3VycmVudExSLCB2YWx1ZSk7XG4gICAgb3JpZ1Bvc0luZm8uZW5kTGVmdFJlY3Vyc2lvbigpO1xuICB9IGVsc2UgaWYgKGN1cnJlbnRMUiAmJiBjdXJyZW50TFIuaXNJbnZvbHZlZChtZW1vS2V5KSkge1xuICAgIC8vIERvbid0IG1lbW9pemUgdGhlIHJlc3VsdFxuICAgIG1lbW9pemVkID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSA9IHtcbiAgICAgIHBvczogaW5wdXRTdHJlYW0ucG9zLFxuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uOiBzdGF0ZS5jbG9uZVJpZ2h0bW9zdEZhaWx1cmVzKClcbiAgICB9O1xuICB9XG5cbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgc3RhdGUucmVzdG9yZUZhaWx1cmVzSW5mbyhvcmlnRmFpbHVyZXNJbmZvKTtcbiAgICBpZiAoIXZhbHVlKSB7XG4gICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICB9XG5cbiAgICBpZiAobWVtb2l6ZWQpIHtcbiAgICAgIG9yaWdQb3NJbmZvLm1lbW9bbWVtb0tleV0uZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uID0gc3RhdGUuY2xvbmVSaWdodG1vc3RGYWlsdXJlcygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIFJlY29yZCB0cmFjZSBpbmZvcm1hdGlvbiBpbiB0aGUgbWVtbyB0YWJsZSwgc28gdGhhdCBpdCBpcyBhdmFpbGFibGUgaWYgdGhlIG1lbW9pemVkIHJlc3VsdFxuICAvLyBpcyB1c2VkIGxhdGVyLlxuICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkgJiYgb3JpZ1Bvc0luZm8ubWVtb1ttZW1vS2V5XSkge1xuICAgIHZhciBzdWNjZWVkZWQgPSAhIXZhbHVlO1xuICAgIHZhciBlbnRyeSA9IHN0YXRlLmdldFRyYWNlRW50cnkob3JpZ1BvcywgdGhpcywgc3VjY2VlZGVkLCBzdWNjZWVkZWQgPyBbdmFsdWVdIDogW10pO1xuICAgIGVudHJ5LmlzTGVmdFJlY3Vyc2l2ZSA9IGlzSGVhZE9mTGVmdFJlY3Vyc2lvbjtcbiAgICBvcmlnUG9zSW5mby5tZW1vW21lbW9LZXldLnRyYWNlRW50cnkgPSBlbnRyeTtcbiAgfVxuXG4gIG9yaWdQb3NJbmZvLmV4aXQoKTtcblxuICBpZiAodmFsdWUpIHtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG5cbiAgaWYgKHN0YXRlLmV2YWwoZXhwcikpIHtcbiAgICB2YXIgYXJpdHkgPSBleHByLmdldEFyaXR5KCk7XG4gICAgdmFyIGJpbmRpbmdzID0gc3RhdGUuYmluZGluZ3Muc3BsaWNlKHN0YXRlLmJpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgdmFyIGFucyA9XG4gICAgICAgIG5ldyBOb250ZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgdGhpcy5ydWxlTmFtZSwgYmluZGluZ3MsIGlucHV0U3RyZWFtLmludGVydmFsKG9yaWdQb3MpKTtcbiAgICByZXR1cm4gYW5zO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ncm93U2VlZFJlc3VsdCA9IGZ1bmN0aW9uKGJvZHksIHN0YXRlLCBvcmlnUG9zLCBsck1lbW9SZWMsIG5ld1ZhbHVlKSB7XG4gIGlmICghbmV3VmFsdWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGxyTWVtb1JlYy5wb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgbHJNZW1vUmVjLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgbHJNZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbiA9IHN0YXRlLmNsb25lUmlnaHRtb3N0RmFpbHVyZXMoKTtcblxuICAgIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgICAgLy8gQmVmb3JlIGV2YWx1YXRpbmcgdGhlIGJvZHkgYWdhaW4sIGFkZCBhIHRyYWNlIG5vZGUgZm9yIHRoaXMgYXBwbGljYXRpb24gdG8gdGhlIG1lbW8gZW50cnkuXG4gICAgICAvLyBJdHMgb25seSBjaGlsZCBpcyB0aGUgdHJhY2Ugbm9kZSBmcm9tIGBuZXdWYWx1ZWAsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHRoZSBsYXN0IGVsZW1lbnRcbiAgICAgIC8vIGluIGBzdGF0ZS50cmFjZWAuXG4gICAgICB2YXIgY2hpbGRyZW4gPSBzdGF0ZS50cmFjZS5zbGljZSgtMSk7XG4gICAgICBsck1lbW9SZWMudHJhY2VFbnRyeSA9IG5ldyBUcmFjZShcbiAgICAgICAgICBzdGF0ZS5pbnB1dFN0cmVhbSwgb3JpZ1BvcywgdGhpcywgdHJ1ZSwgW25ld1ZhbHVlXSwgY2hpbGRyZW4pO1xuICAgIH1cbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIG5ld1ZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gICAgaWYgKGlucHV0U3RyZWFtLnBvcyA8PSBsck1lbW9SZWMucG9zKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgc3RhdGUudHJhY2UucG9wKCk7ICAvLyBEcm9wIGxhc3QgdHJhY2UgZW50cnkgc2luY2UgYHZhbHVlYCB3YXMgdW51c2VkLlxuICAgIGxyTWVtb1JlYy50cmFjZUVudHJ5ID0gbnVsbDtcbiAgfVxuICBpbnB1dFN0cmVhbS5wb3MgPSBsck1lbW9SZWMucG9zO1xuICByZXR1cm4gbHJNZW1vUmVjLnZhbHVlO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChjaCAmJiB0aGlzLnBhdHRlcm4udGVzdChjaCkpIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBpbnB1dFN0cmVhbS5pbnRlcnZhbChvcmlnUG9zKTtcbiAgICBzdGF0ZS5iaW5kaW5ncy5wdXNoKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gsIGludGVydmFsKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuZ2V0QXJpdHkgPVxucGV4cHJzLmVuZC5nZXRBcml0eSA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDE7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGFyaXR5IC0tIHRoaXMgcHJvcGVydHkgaXNcbiAgLy8gY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwID8gMCA6IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBhcml0eSA9IDA7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgYXJpdHkgKz0gdGhpcy5mYWN0b3JzW2lkeF0uZ2V0QXJpdHkoKTtcbiAgfVxuICByZXR1cm4gYXJpdHk7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIDA7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIENhbGxlZCBhdCBncmFtbWFyIGNyZWF0aW9uIHRpbWUgdG8gcmV3cml0ZSBhIHJ1bGUgYm9keSwgcmVwbGFjaW5nIGVhY2ggcmVmZXJlbmNlIHRvIGEgZm9ybWFsXG4gIHBhcmFtZXRlciB3aXRoIGEgYFBhcmFtYCBub2RlLiBSZXR1cm5zIGEgUEV4cHIgLS0gZWl0aGVyIGEgbmV3IG9uZSwgb3IgdGhlIG9yaWdpbmFsIG9uZSBpZlxuICBpdCB3YXMgbW9kaWZpZWQgaW4gcGxhY2UuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5lbmQuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy50ZXJtcy5mb3JFYWNoKGZ1bmN0aW9uKHRlcm0sIGlkeCwgdGVybXMpIHtcbiAgICB0ZXJtc1tpZHhdID0gdGVybS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy5mYWN0b3JzLmZvckVhY2goZnVuY3Rpb24oZmFjdG9yLCBpZHgsIGZhY3RvcnMpIHtcbiAgICBmYWN0b3JzW2lkeF0gPSBmYWN0b3IuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Ob3QucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLmV4cHIgPSB0aGlzLmV4cHIuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB2YXIgaW5kZXggPSBmb3JtYWxzLmluZGV4T2YodGhpcy5ydWxlTmFtZSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBUT0RPOiBTaG91bGQgdGhpcyBiZSBzdXBwb3J0ZWQ/IFNlZSBpc3N1ZSAjNjQuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlcml6ZWQgcnVsZXMgY2Fubm90IGJlIHBhc3NlZCBhcyBhcmd1bWVudHMgdG8gYW5vdGhlciBydWxlLicpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnLCBpZHgsIGFyZ3MpIHtcbiAgICAgIGFyZ3NbaWR4XSA9IGFyZy5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBwYXJzaW5nIGV4cHJlc3Npb24gbWF5IGFjY2VwdCB3aXRob3V0IGNvbnN1bWluZyBhbnkgaW5wdXQuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmlzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiB0aGlzLl9pc051bGxhYmxlKGdyYW1tYXIsIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlBsdXMucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5lbmQuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgaWYgKHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBUaGlzIGlzIGFuIG92ZXItc2ltcGxpZmljYXRpb246IGl0J3Mgb25seSBjb3JyZWN0IGlmIHRoZSBpbnB1dCBpcyBhIHN0cmluZy4gSWYgaXQncyBhbiBhcnJheVxuICAgIC8vIG9yIGFuIG9iamVjdCwgdGhlbiB0aGUgZW1wdHkgc3RyaW5nIHBhcnNpbmcgZXhwcmVzc2lvbiBpcyBub3QgbnVsbGFibGUuXG4gICAgcmV0dXJuIHRoaXMub2JqID09PSAnJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgfHxcbiAgICAgIHRoaXMudGVybXMuc29tZShmdW5jdGlvbih0ZXJtKSB7IHJldHVybiB0ZXJtLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pOyB9KTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy5mYWN0b3JzLmV2ZXJ5KGZ1bmN0aW9uKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pOyB9KTtcbn07XG5cbnBleHBycy5TdGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuT3B0LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTGV4LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHZhciBrZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtZW1vLCBrZXkpKSB7XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVCb2RpZXNbdGhpcy5ydWxlTmFtZV07XG4gICAgdmFyIGlubGluZWQgPSBib2R5LnN1YnN0aXR1dGVQYXJhbXModGhpcy5hcmdzKTtcbiAgICBtZW1vW2tleV0gPSBmYWxzZTsgIC8vIFByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uIGZvciByZWN1cnNpdmUgcnVsZXMuXG4gICAgbWVtb1trZXldID0gaW5saW5lZC5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbiAgfVxuICByZXR1cm4gbWVtb1trZXldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBlc2NhcGVTdHJpbmcoc3RyKSB7XG4gIHZhciBvdXRwdXQgPSBKU09OLnN0cmluZ2lmeShzdHIpO1xuICBvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSgvW1xcdTIwMjhcXHUyMDI5XS9nLCBmdW5jdGlvbihjaGFyLCBwb3MsIHN0cikge1xuICAgIHZhciBoZXggPSBjaGFyLmNvZGVQb2ludEF0KDApLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gJ1xcXFx1JyArICcwMDAwJy5zbGljZShoZXgubGVuZ3RoKSArIGhleDtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbmZ1bmN0aW9uIGdldEludGVydmFsSW5mbyhleHByLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgaWYgKGV4cHIuaW50ZXJ2YWwgJiYgZ3JhbW1hckludGVydmFsKSB7XG4gICAgdmFyIGFkanVzdGVkID0gZXhwci5pbnRlcnZhbC5yZWxhdGl2ZVRvKGdyYW1tYXJJbnRlcnZhbCk7XG4gICAgdmFyIHN0YXJ0ID0gYWRqdXN0ZWQuc3RhcnRJZHg7XG4gICAgdmFyIGVuZCA9IGFkanVzdGVkLmVuZElkeDtcbiAgICByZXR1cm4gJy53aXRoSW50ZXJ2YWwoZGVjbC5zb3VyY2VJbnRlcnZhbCgnICsgc3RhcnQgKyAnLCAnICsgZW5kICsgJykpJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGNvbW1vbi5hYnN0cmFjdDtcblxucGV4cHJzLmFueS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHRocm93IG5ldyBFcnJvcignc2hvdWxkIG5ldmVyIG91dHB1dCBhIHJlY2lwZSBmb3IgYGFueWAgZXhwcmVzc2lvbicpO1xufTtcblxucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHRocm93IG5ldyBFcnJvcignc2hvdWxkIG5ldmVyIG91dHB1dCBhIHJlY2lwZSBmb3IgYGVuZGAgZXhwcmVzc2lvbicpO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy50ZXJtaW5hbCgnKTtcbiAgc2IuYXBwZW5kKHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycgPyBlc2NhcGVTdHJpbmcodGhpcy5vYmopIDogJycgKyB0aGlzLm9iaik7XG4gIHNiLmFwcGVuZCgnKScgKyBnZXRJbnRlcnZhbEluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSk7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLnJhbmdlKCcpO1xuICBzYi5hcHBlbmQoSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSk7XG4gIHNiLmFwcGVuZCgnLCAnKTtcbiAgc2IuYXBwZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMudG8pKTtcbiAgc2IuYXBwZW5kKCcpJyArIGdldEludGVydmFsSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpKTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICBzYi5hcHBlbmQoJ3RoaXMucGFyYW0oJyArIHRoaXMuaW5kZXggKyAnKScgKyBnZXRJbnRlcnZhbEluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSk7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5hbHQoJyk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgfVxuICAgIHRoaXMudGVybXNbaWR4XS5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gIH1cbiAgc2IuYXBwZW5kKCcpJyArIGdldEludGVydmFsSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpKTtcbn07XG5cbnBleHBycy5FeHRlbmQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgdmFyIGV4dGVuc2lvbiA9IHRoaXMudGVybXNbMF07IC8vIFtleHRlbnNpb24sIG9yZ2luYWxdXG4gIGV4dGVuc2lvbi5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy5zZXEoJyk7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICB9XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0ub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xuICB9XG4gIHNiLmFwcGVuZCgnKScgKyBnZXRJbnRlcnZhbEluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSk7XG59O1xuXG5wZXhwcnMuU3Rhci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbnBleHBycy5QbHVzLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxucGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHNiLmFwcGVuZCgndGhpcy4nICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLnRvTG93ZXJDYXNlKCkgKyAnKCcpO1xuICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xuICBzYi5hcHBlbmQoJyknICsgZ2V0SW50ZXJ2YWxJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCkpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICBzYi5hcHBlbmQoJ3RoaXMubGEoJyk7XG4gIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoc2IsIGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gIHNiLmFwcGVuZCgnKScgKyBnZXRJbnRlcnZhbEluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKHNiLCBmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgc2IuYXBwZW5kKCd0aGlzLmFwcCgnKTtcbiAgc2IuYXBwZW5kKEpTT04uc3RyaW5naWZ5KHRoaXMucnVsZU5hbWUpKTtcbiAgaWYgKHRoaXMucnVsZU5hbWUuaW5kZXhPZignXycpID49IDAgJiYgZm9ybWFscy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIGFwcHMgPSBmb3JtYWxzLlxuICAgICAgICBtYXAoZnVuY3Rpb24oXywgaWR4KSB7IHJldHVybiAndGhpcy5wYXJhbSgnICsgaWR4ICsgJyknOyB9KTtcbiAgICBzYi5hcHBlbmQoJywgWycgKyBhcHBzLmpvaW4oJywgJykgKyAnXScpO1xuICB9IGVsc2UgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgc2IuYXBwZW5kKCcsIFsnKTtcbiAgICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcsIGlkeCkge1xuICAgICAgaWYgKGlkeCA+IDApIHtcbiAgICAgICAgc2IuYXBwZW5kKCcsICcpO1xuICAgICAgfVxuICAgICAgYXJnLm91dHB1dFJlY2lwZShzYiwgZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgICB9KTtcbiAgICBzYi5hcHBlbmQoJ10nKTtcbiAgfVxuICBzYi5hcHBlbmQoJyknICsgZ2V0SW50ZXJ2YWxJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCkpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBSZXR1cm5zIGEgUEV4cHIgdGhhdCByZXN1bHRzIGZyb20gcmVjdXJzaXZlbHkgcmVwbGFjaW5nIGV2ZXJ5IGZvcm1hbCBwYXJhbWV0ZXIgKGkuZS4sIGluc3RhbmNlXG4gIG9mIGBQYXJhbWApIGluc2lkZSB0aGlzIFBFeHByIHdpdGggaXRzIGFjdHVhbCB2YWx1ZSBmcm9tIGBhY3R1YWxzYCAoYW4gQXJyYXkpLlxuXG4gIFRoZSByZWNlaXZlciBtdXN0IG5vdCBiZSBtb2RpZmllZDsgYSBuZXcgUEV4cHIgbXVzdCBiZSByZXR1cm5lZCBpZiBhbnkgcmVwbGFjZW1lbnQgaXMgbmVjZXNzYXJ5LlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdDsgIC8vIGZ1bmN0aW9uKGFjdHVhbHMpIHsgLi4uIH1cblxucGV4cHJzLmFueS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5lbmQuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gYWN0dWFsc1t0aGlzLmluZGV4XTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBuZXcgcGV4cHJzLkFsdChcbiAgICAgIHRoaXMudGVybXMubWFwKGZ1bmN0aW9uKHRlcm0pIHsgcmV0dXJuIHRlcm0uc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSkpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyBwZXhwcnMuU2VxKFxuICAgICAgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KSk7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgaWYgKHRoaXMuYXJncy5sZW5ndGggPT09IDApIHtcbiAgICAvLyBBdm9pZCBtYWtpbmcgYSBjb3B5IG9mIHRoaXMgYXBwbGljYXRpb24sIGFzIGFuIG9wdGltaXphdGlvblxuICAgIHJldHVybiB0aGlzO1xuICB9IGVsc2Uge1xuICAgIHZhciBhcmdzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KTtcbiAgICByZXR1cm4gbmV3IHBleHBycy5BcHBseSh0aGlzLnJ1bGVOYW1lLCBhcmdzKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbnZhciBjb3B5V2l0aG91dER1cGxpY2F0ZXMgPSBjb21tb24uY29weVdpdGhvdXREdXBsaWNhdGVzO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgUmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgYmUgdXNlZCBhcyB0aGUgZGVmYXVsdCBhcmd1bWVudCBuYW1lcyBmb3IgaXRzIHJlY2VpdmVyXG4gIChhIHBleHByKSBpbiBhIHNlbWFudGljIGFjdGlvbi4gVGhpcyBpcyB1c2VkIGV4Y2x1c2l2ZWx5IGJ5IHRoZSBTZW1hbnRpY3MgRWRpdG9yLlxuXG4gIGBmaXJzdEFyZ0luZGV4YCBpcyB0aGUgMS1iYXNlZCBpbmRleCBvZiB0aGUgZmlyc3QgYXJndW1lbnQgbmFtZSB0aGF0IHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB0aGlzXG4gIHBleHByLiBJdCBlbmFibGVzIHVzIHRvIG5hbWUgYXJndW1lbnRzIHBvc2l0aW9uYWxseSwgZS5nLiwgaWYgdGhlIHNlY29uZCBhcmd1bWVudCBpcyBhXG4gIG5vbi1hbHBoYW51bWVyaWMgdGVybWluYWwgbGlrZSBcIitcIiwgaXQgd2lsbCBiZSBuYW1lZCAnJDInLlxuXG4gIEhlcmUgaXMgYSBtb3JlIGVsYWJvcmF0ZSBleGFtcGxlIHRoYXQgaWxsdXN0cmF0ZXMgaG93IHRoaXMgbWV0aG9kIHdvcmtzOlxuICBgKGEgXCIrXCIgYikudG9Bcmd1bWVudE5hbWVMaXN0KDEpYCBldmFsdWF0ZXMgdG8gYFsnYScsICckMicsICdiJ11gIHdpdGggdGhlIGZvbGxvd2luZyByZWN1cnNpdmVcbiAgY2FsbHM6XG5cbiAgICAoYSkudG9Bcmd1bWVudE5hbWVMaXN0KDEpIC0+IFsnYSddLFxuICAgIChcIitcIikudG9Bcmd1bWVudE5hbWVMaXN0KDIpIC0+IFsnJDInXSxcbiAgICAoYikudG9Bcmd1bWVudE5hbWVMaXN0KDMpIC0+IFsnYiddXG5cbiAgTm90ZXM6XG4gICogVGhpcyBtZXRob2QgbXVzdCBvbmx5IGJlIGNhbGxlZCBvbiB3ZWxsLWZvcm1lZCBleHByZXNzaW9ucywgZS5nLiwgdGhlIHJlY2VpdmVyIG11c3RcbiAgICBub3QgaGF2ZSBhbnkgQWx0IHN1Yi1leHByZXNzaW9ucyB3aXRoIGluY29uc2lzdGVudCBhcml0aWVzLlxuICAqIGUuZ2V0QXJpdHkoKSA9PT0gZS50b0FyZ3VtZW50TmFtZUxpc3QoMSkubGVuZ3RoXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBjb21tb24uYWJzdHJhY3Q7ICAvLyBmdW5jdGlvbihmaXJzdEFyZ0luZGV4KSB7IC4uLiB9XG5cbnBleHBycy5hbnkudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gWydhbnknXTtcbn07XG5cbnBleHBycy5lbmQudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gWydlbmQnXTtcbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJyAmJiAvXltfYS16QS1aMC05XSskLy50ZXN0KHRoaXMub2JqKSkge1xuICAgIC8vIElmIHRoaXMgdGVybWluYWwgaXMgYSB2YWxpZCBzdWZmaXggZm9yIGEgSlMgaWRlbnRpZmllciwganVzdCBwcmVwZW5kIGl0IHdpdGggJ18nXG4gICAgcmV0dXJuIFsnXycgKyB0aGlzLm9ial07XG4gIH0gZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlLCBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICByZXR1cm4gWyckJyArIGZpcnN0QXJnSW5kZXhdO1xuICB9XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIFt0aGlzLmZyb20gKyAnX3RvXycgKyB0aGlzLnRvXTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgLy8gYHRlcm1BcmdOYW1lTGlzdHNgIGlzIGFuIGFycmF5IG9mIGFycmF5cyB3aGVyZSBlYWNoIHJvdyBpcyB0aGVcbiAgLy8gYXJndW1lbnQgbmFtZSBsaXN0IHRoYXQgY29ycmVzcG9uZHMgdG8gYSB0ZXJtIGluIHRoaXMgYWx0ZXJuYXRpb24uXG4gIHZhciB0ZXJtQXJnTmFtZUxpc3RzID0gdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkge1xuICAgIHJldHVybiB0ZXJtLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4KTtcbiAgfSk7XG5cbiAgdmFyIGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgdmFyIG51bUFyZ3MgPSB0ZXJtQXJnTmFtZUxpc3RzWzBdLmxlbmd0aDtcbiAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbnVtQXJnczsgY29sSWR4KyspIHtcbiAgICB2YXIgY29sID0gW107XG4gICAgZm9yICh2YXIgcm93SWR4ID0gMDsgcm93SWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IHJvd0lkeCsrKSB7XG4gICAgICBjb2wucHVzaCh0ZXJtQXJnTmFtZUxpc3RzW3Jvd0lkeF1bY29sSWR4XSk7XG4gICAgfVxuICAgIHZhciB1bmlxdWVOYW1lcyA9IGNvcHlXaXRob3V0RHVwbGljYXRlcyhjb2wpO1xuICAgIGFyZ3VtZW50TmFtZUxpc3QucHVzaCh1bmlxdWVOYW1lcy5qb2luKCdfb3JfJykpO1xuICB9XG5cbiAgcmV0dXJuIGFyZ3VtZW50TmFtZUxpc3Q7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4KSB7XG4gIC8vIEdlbmVyYXRlIHRoZSBhcmd1bWVudCBuYW1lIGxpc3QsIHdpdGhvdXQgd29ycnlpbmcgYWJvdXQgZHVwbGljYXRlcy5cbiAgdmFyIGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgdGhpcy5mYWN0b3JzLmZvckVhY2goZnVuY3Rpb24oZmFjdG9yKSB7XG4gICAgdmFyIGZhY3RvckFyZ3VtZW50TmFtZUxpc3QgPSBmYWN0b3IudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgpO1xuICAgIGFyZ3VtZW50TmFtZUxpc3QgPSBhcmd1bWVudE5hbWVMaXN0LmNvbmNhdChmYWN0b3JBcmd1bWVudE5hbWVMaXN0KTtcblxuICAgIC8vIFNoaWZ0IHRoZSBmaXJzdEFyZ0luZGV4IHRvIHRha2UgdGhpcyBmYWN0b3IncyBhcmd1bWVudCBuYW1lcyBpbnRvIGFjY291bnQuXG4gICAgZmlyc3RBcmdJbmRleCArPSBmYWN0b3JBcmd1bWVudE5hbWVMaXN0Lmxlbmd0aDtcbiAgfSk7XG5cbiAgLy8gYGNvdW50YCBpcyB1c2VkIHRvIHJlY29yZCB0aGUgbnVtYmVyIG9mIHRpbWVzIGVhY2ggYXJndW1lbnQgbmFtZSBvY2N1cnMgaW4gdGhlIGxpc3QsXG4gIC8vIHRoaXMgaXMgdXNlZnVsIGZvciBjaGVja2luZyBkdXBsaWNhdGVkIGFyZ3VtZW50IG5hbWUuIEl0IG1hcHMgYXJndW1lbnQgbmFtZXMgdG8gaW50cy5cbiAgdmFyIGNvdW50ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGFyZ05hbWUpIHtcbiAgICBjb3VudFthcmdOYW1lXSA9IChjb3VudFthcmdOYW1lXSB8fCAwKSArIDE7XG4gIH0pO1xuXG4gIC8vIEFwcGVuZCBzdWJzY3JpcHRzICgnXzEnLCAnXzInLCAuLi4pIHRvIGR1cGxpY2F0ZSBhcmd1bWVudCBuYW1lcy5cbiAgT2JqZWN0LmtleXMoY291bnQpLmZvckVhY2goZnVuY3Rpb24oZHVwQXJnTmFtZSkge1xuICAgIGlmIChjb3VudFtkdXBBcmdOYW1lXSA8PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhpcyBuYW1lIHNob3dzIHVwIG1vcmUgdGhhbiBvbmNlLCBzbyBhZGQgc3Vic2NyaXB0cy5cbiAgICB2YXIgc3Vic2NyaXB0ID0gMTtcbiAgICBhcmd1bWVudE5hbWVMaXN0LmZvckVhY2goZnVuY3Rpb24oYXJnTmFtZSwgaWR4KSB7XG4gICAgICBpZiAoYXJnTmFtZSA9PT0gZHVwQXJnTmFtZSkge1xuICAgICAgICBhcmd1bWVudE5hbWVMaXN0W2lkeF0gPSBhcmdOYW1lICsgJ18nICsgc3Vic2NyaXB0Kys7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCkubWFwKGZ1bmN0aW9uKGV4cHJBcmd1bWVudFN0cmluZykge1xuICAgIHJldHVybiBleHByQXJndW1lbnRTdHJpbmdbZXhwckFyZ3VtZW50U3RyaW5nLmxlbmd0aCAtIDFdID09PSAncycgP1xuICAgICAgICBleHByQXJndW1lbnRTdHJpbmcgKyAnZXMnIDpcbiAgICAgICAgZXhwckFyZ3VtZW50U3RyaW5nICsgJ3MnO1xuICB9KTtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCkubWFwKGZ1bmN0aW9uKGFyZ05hbWUpIHtcbiAgICByZXR1cm4gJ29wdCcgKyBhcmdOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBhcmdOYW1lLnNsaWNlKDEpO1xuICB9KTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIFtdO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID1cbnBleHBycy5MZXgucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgpIHtcbiAgcmV0dXJuIFt0aGlzLnJ1bGVOYW1lXTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCkge1xuICByZXR1cm4gJyQnICsgZmlyc3RBcmdJbmRleDtcbn07XG5cbi8vIFwiVmFsdWUgcGV4cHJzXCIgKFZhbHVlLCBTdHIsIEFyciwgT2JqKSBhcmUgZ29pbmcgYXdheSBzb29uLCBzbyB3ZSBkb24ndCB3b3JyeSBhYm91dCB0aGVtIGhlcmUuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFBFeHByLCBmb3IgdXNlIGFzIGEgVUkgbGFiZWwsIGV0Yy5cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gY29tbW9uLmFic3RyYWN0O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLlNlcS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gdGhpcy5pbnRlcnZhbC50cmltbWVkKCkuY29udGVudHM7XG4gIH1cbiAgcmV0dXJuICdbJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICddJztcbn07XG5cbnBleHBycy5hbnkudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnYW55Jztcbn07XG5cbnBleHBycy5lbmQudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnZW5kJztcbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIycgKyB0aGlzLmluZGV4O1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnVW5pY29kZSB7JyArIHRoaXMuY2F0ZWdvcnkgKyAnfSBjaGFyYWN0ZXInO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUoJ2FueSBvYmplY3QnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5lbmQudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUoJ2VuZCBvZiBpbnB1dCcsICdkZXNjcmlwdGlvbicpO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcy5vYmogPT09ICdzdHJpbmcnID9cbiAgICBuZXcgRmFpbHVyZSh0aGlzLm9iaiwgJ3N0cmluZycpIDpcbiAgICBuZXcgRmFpbHVyZShKU09OLnN0cmluZ2lmeSh0aGlzLm9iaiksICdjb2RlJyk7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgLy8gVE9ETzogY29tZSB1cCB3aXRoIHNvbWV0aGluZyBiZXR0ZXJcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byksICdjb2RlJyk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBkZXNjcmlwdGlvbiA9IHRoaXMuZXhwciA9PT0gcGV4cHJzLmFueSA/XG4gICAgICAnbm90aGluZycgOlxuICAgICAgJ25vdCAnICsgdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKTtcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbi8vIFRPRE86IHRoaW5rIGFib3V0IEFyciwgU3RyLCBhbmQgT2JqXG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICB2YXIgZGVzY3JpcHRpb24gPSBncmFtbWFyLnJ1bGVEZXNjcmlwdGlvbnNbdGhpcy5ydWxlTmFtZV07XG4gIGlmICghZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgYXJ0aWNsZSA9ICgvXlthZWlvdUFFSU9VXS8udGVzdCh0aGlzLnJ1bGVOYW1lKSA/ICdhbicgOiAnYScpO1xuICAgIGRlc2NyaXB0aW9uID0gYXJ0aWNsZSArICcgJyArIHRoaXMucnVsZU5hbWU7XG4gIH1cbiAgcmV0dXJuIG5ldyBGYWlsdXJlKGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcy50b0Rpc3BsYXlTdHJpbmcoKSwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIGUxLnRvU3RyaW5nKCkgPT09IGUyLnRvU3RyaW5nKCkgPT0+IGUxIGFuZCBlMiBhcmUgc2VtYW50aWNhbGx5IGVxdWl2YWxlbnQuXG4gIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBpZmYgKDw9PT4pOiBlLmcuLFxuICAoflwiYlwiIFwiYVwiKS50b1N0cmluZygpICE9PSAoXCJhXCIpLnRvU3RyaW5nKCksIGV2ZW4gdGhvdWdoXG4gIH5cImJcIiBcImFcIiBhbmQgXCJhXCIgYXJlIGludGVyY2hhbmdlYWJsZSBpbiBhbnkgZ3JhbW1hcixcbiAgYm90aCBpbiB0ZXJtcyBvZiB0aGUgbGFuZ3VhZ2VzIHRoZXkgYWNjZXB0IGFuZCB0aGVpciBhcml0aWVzLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9TdHJpbmcgPSBjb21tb24uYWJzdHJhY3Q7XG5cbnBleHBycy5hbnkudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdhbnknO1xufTtcblxucGV4cHJzLmVuZC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ2VuZCc7XG59O1xuXG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyQnICsgdGhpcy5pbmRleDtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIygnICsgdGhpcy5leHByLnRvU3RyaW5nKCkgKyAnKSc7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDEgP1xuICAgIHRoaXMudGVybXNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS50b1N0cmluZygpOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMubGVuZ3RoID09PSAxID9cbiAgICB0aGlzLmZhY3RvcnNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci50b1N0cmluZygpOyB9KS5qb2luKCcgJykgKyAnKSc7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwciArIHRoaXMub3BlcmF0b3I7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ34nICsgdGhpcy5leHByO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcmJyArIHRoaXMuZXhwcjtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHBzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy50b1N0cmluZygpOyB9KTtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1xcXFxweycgKyB0aGlzLmNhdGVnb3J5ICsgJ30nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBVbmljb2RlQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uL3RoaXJkX3BhcnR5L1VuaWNvZGVDYXRlZ29yaWVzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdlbmVyYWwgc3R1ZmZcblxuZnVuY3Rpb24gUEV4cHIoKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIlBFeHByIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXQncyBhYnN0cmFjdFwiKTtcbn1cblxuLy8gU2V0IHRoZSBgaW50ZXJ2YWxgIHByb3BlcnR5IHRvIHRoZSBpbnRlcnZhbCBjb250YWluaW5nIHRoZSBzb3VyY2UgZm9yIHRoaXMgZXhwcmVzc2lvbi5cblBFeHByLnByb3RvdHlwZS53aXRoSW50ZXJ2YWwgPSBmdW5jdGlvbihpbnRlcnZhbCkge1xuICBpZiAoaW50ZXJ2YWwpIHtcbiAgICB0aGlzLmludGVydmFsID0gaW50ZXJ2YWwudHJpbW1lZCgpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gQW55XG5cbnZhciBhbnkgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEVuZFxuXG52YXIgZW5kID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBUZXJtaW5hbHNcblxuZnVuY3Rpb24gVGVybWluYWwob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuaW5oZXJpdHMoVGVybWluYWwsIFBFeHByKTtcblxuLy8gUmFuZ2VzXG5cbmZ1bmN0aW9uIFJhbmdlKGZyb20sIHRvKSB7XG4gIHRoaXMuZnJvbSA9IGZyb207XG4gIHRoaXMudG8gPSB0bztcbn1cbmluaGVyaXRzKFJhbmdlLCBQRXhwcik7XG5cbi8vIFBhcmFtZXRlcnNcblxuZnVuY3Rpb24gUGFyYW0oaW5kZXgpIHtcbiAgdGhpcy5pbmRleCA9IGluZGV4O1xufVxuaW5oZXJpdHMoUGFyYW0sIFBFeHByKTtcblxuLy8gQWx0ZXJuYXRpb25cblxuZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gIHRoaXMudGVybXMgPSB0ZXJtcztcbn1cbmluaGVyaXRzKEFsdCwgUEV4cHIpO1xuXG4vLyBFeHRlbmQgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIEV4dGVuZChzdXBlckdyYW1tYXIsIG5hbWUsIGJvZHkpIHtcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlQm9kaWVzW25hbWVdO1xuICB0aGlzLnRlcm1zID0gW2JvZHksIG9yaWdCb2R5XTtcbn1cbmluaGVyaXRzKEV4dGVuZCwgQWx0KTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5pbmhlcml0cyhTZXEsIFBFeHByKTtcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gSXRlcihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhJdGVyLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0YXIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RhciwgSXRlcik7XG5cbmZ1bmN0aW9uIFBsdXMoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoUGx1cywgSXRlcik7XG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhPcHQsIEl0ZXIpO1xuXG5TdGFyLnByb3RvdHlwZS5vcGVyYXRvciA9ICcqJztcblBsdXMucHJvdG90eXBlLm9wZXJhdG9yID0gJysnO1xuT3B0LnByb3RvdHlwZS5vcGVyYXRvciA9ICc/JztcblxuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5cblN0YXIucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5QbHVzLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuT3B0LnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gMTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTm90LCBQRXhwcik7XG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhMb29rYWhlYWQsIFBFeHByKTtcblxuLy8gXCJMZXhpZmljYXRpb25cIlxuXG5mdW5jdGlvbiBMZXgoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTGV4LCBQRXhwcik7XG5cbi8vIEFycmF5IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gQXJyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKEFyciwgUEV4cHIpO1xuXG4vLyBTdHJpbmcgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBTdHIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RyLCBQRXhwcik7XG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWU7IH0pO1xuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKG5hbWVzKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5pc0xlbmllbnQgPSBpc0xlbmllbnQ7XG4gIH1cbn1cbmluaGVyaXRzKE9iaiwgUEV4cHIpO1xuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lLCBvcHRBcmdzKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5hcmdzID0gb3B0QXJncyB8fCBbXTtcbn1cbmluaGVyaXRzKEFwcGx5LCBQRXhwcik7XG5cbkFwcGx5LnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpO1xufTtcblxuLy8gVGhpcyBtZXRob2QganVzdCBjYWNoZXMgdGhlIHJlc3VsdCBvZiBgdGhpcy50b1N0cmluZygpYCBpbiBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5LlxuQXBwbHkucHJvdG90eXBlLnRvTWVtb0tleSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuX21lbW9LZXkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19tZW1vS2V5Jywge3ZhbHVlOiB0aGlzLnRvU3RyaW5nKCl9KTtcbiAgfVxuICByZXR1cm4gdGhpcy5fbWVtb0tleTtcbn07XG5cbi8vIFVuaWNvZGUgY2hhcmFjdGVyXG5cbmZ1bmN0aW9uIFVuaWNvZGVDaGFyKGNhdGVnb3J5KSB7XG4gIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgdGhpcy5wYXR0ZXJuID0gVW5pY29kZUNhdGVnb3JpZXNbY2F0ZWdvcnldO1xufVxuaW5oZXJpdHMoVW5pY29kZUNoYXIsIFBFeHByKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuUEV4cHIgPSBQRXhwcjtcbmV4cG9ydHMuYW55ID0gYW55O1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlRlcm1pbmFsID0gVGVybWluYWw7XG5leHBvcnRzLlJhbmdlID0gUmFuZ2U7XG5leHBvcnRzLlBhcmFtID0gUGFyYW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kID0gRXh0ZW5kO1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkl0ZXIgPSBJdGVyO1xuZXhwb3J0cy5TdGFyID0gU3RhcjtcbmV4cG9ydHMuUGx1cyA9IFBsdXM7XG5leHBvcnRzLk9wdCA9IE9wdDtcbmV4cG9ydHMuTm90ID0gTm90O1xuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWQ7XG5leHBvcnRzLkxleCA9IExleDtcbmV4cG9ydHMuQXJyID0gQXJyO1xuZXhwb3J0cy5TdHIgPSBTdHI7XG5leHBvcnRzLk9iaiA9IE9iajtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcbmV4cG9ydHMuVW5pY29kZUNoYXIgPSBVbmljb2RlQ2hhcjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4dGVuc2lvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4vcGV4cHJzLWFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1jaGVjaycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtZ2V0QXJpdHknKTtcbnJlcXVpcmUoJy4vcGV4cHJzLW91dHB1dFJlY2lwZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtaW50cm9kdWNlUGFyYW1zJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pc051bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1zdWJzdGl0dXRlUGFyYW1zJyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0Rpc3BsYXlTdHJpbmcnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvQXJndW1lbnROYW1lTGlzdCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9GYWlsdXJlJyk7XG5yZXF1aXJlKCcuL3BleHBycy10b1N0cmluZycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBHaXZlbiBhbiBhcnJheSBvZiBudW1iZXJzIGBhcnJgLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG51bWJlcnMgYXMgc3RyaW5ncyxcbi8vIHJpZ2h0LWp1c3RpZmllZCBhbmQgcGFkZGVkIHRvIHRoZSBzYW1lIGxlbmd0aC5cbmZ1bmN0aW9uIHBhZE51bWJlcnNUb0VxdWFsTGVuZ3RoKGFycikge1xuICB2YXIgbWF4TGVuID0gMDtcbiAgdmFyIHN0cmluZ3MgPSBhcnIubWFwKGZ1bmN0aW9uKG4pIHtcbiAgICB2YXIgc3RyID0gbi50b1N0cmluZygpO1xuICAgIG1heExlbiA9IE1hdGgubWF4KG1heExlbiwgc3RyLmxlbmd0aCk7XG4gICAgcmV0dXJuIHN0cjtcbiAgfSk7XG4gIHJldHVybiBzdHJpbmdzLm1hcChmdW5jdGlvbihzKSB7IHJldHVybiBjb21tb24ucGFkTGVmdChzLCBtYXhMZW4pOyB9KTtcbn1cblxuLy8gUHJvZHVjZSBhIG5ldyBzdHJpbmcgdGhhdCB3b3VsZCBiZSB0aGUgcmVzdWx0IG9mIGNvcHlpbmcgdGhlIGNvbnRlbnRzXG4vLyBvZiB0aGUgc3RyaW5nIGBzcmNgIG9udG8gYGRlc3RgIGF0IG9mZnNldCBgb2ZmZXN0YC5cbmZ1bmN0aW9uIHN0cmNweShkZXN0LCBzcmMsIG9mZnNldCkge1xuICB2YXIgb3JpZ0Rlc3RMZW4gPSBkZXN0Lmxlbmd0aDtcbiAgdmFyIHN0YXJ0ID0gZGVzdC5zbGljZSgwLCBvZmZzZXQpO1xuICB2YXIgZW5kID0gZGVzdC5zbGljZShvZmZzZXQgKyBzcmMubGVuZ3RoKTtcbiAgcmV0dXJuIChzdGFydCArIHNyYyArIGVuZCkuc3Vic3RyKDAsIG9yaWdEZXN0TGVuKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFJldHVybiBhbiBvYmplY3Qgd2l0aCB0aGUgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgZ2l2ZW5cbi8vIG9mZnNldCBpbiBgc3RyYC5cbmV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbiA9IGZ1bmN0aW9uKHN0ciwgb2Zmc2V0KSB7XG4gIHZhciBsaW5lTnVtID0gMTtcbiAgdmFyIGNvbE51bSA9IDE7XG5cbiAgdmFyIGN1cnJPZmZzZXQgPSAwO1xuICB2YXIgbGluZVN0YXJ0T2Zmc2V0ID0gMDtcblxuICB2YXIgbmV4dExpbmUgPSBudWxsO1xuICB2YXIgcHJldkxpbmUgPSBudWxsO1xuICB2YXIgcHJldkxpbmVTdGFydE9mZnNldCA9IC0xO1xuXG4gIHdoaWxlIChjdXJyT2Zmc2V0IDwgb2Zmc2V0KSB7XG4gICAgdmFyIGMgPSBzdHIuY2hhckF0KGN1cnJPZmZzZXQrKyk7XG4gICAgaWYgKGMgPT09ICdcXG4nKSB7XG4gICAgICBsaW5lTnVtKys7XG4gICAgICBjb2xOdW0gPSAxO1xuICAgICAgcHJldkxpbmVTdGFydE9mZnNldCA9IGxpbmVTdGFydE9mZnNldDtcbiAgICAgIGxpbmVTdGFydE9mZnNldCA9IGN1cnJPZmZzZXQ7XG4gICAgfSBlbHNlIGlmIChjICE9PSAnXFxyJykge1xuICAgICAgY29sTnVtKys7XG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgZW5kIG9mIHRoZSB0YXJnZXQgbGluZS5cbiAgdmFyIGxpbmVFbmRPZmZzZXQgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZVN0YXJ0T2Zmc2V0KTtcbiAgaWYgKGxpbmVFbmRPZmZzZXQgPT09IC0xKSB7XG4gICAgbGluZUVuZE9mZnNldCA9IHN0ci5sZW5ndGg7XG4gIH0gZWxzZSB7XG4gICAgLy8gR2V0IHRoZSBuZXh0IGxpbmUuXG4gICAgdmFyIG5leHRMaW5lRW5kT2Zmc2V0ID0gc3RyLmluZGV4T2YoJ1xcbicsIGxpbmVFbmRPZmZzZXQgKyAxKTtcbiAgICBuZXh0TGluZSA9IG5leHRMaW5lRW5kT2Zmc2V0ID09PSAtMSA/IHN0ci5zbGljZShsaW5lRW5kT2Zmc2V0KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQsIG5leHRMaW5lRW5kT2Zmc2V0KTtcbiAgICAvLyBTdHJpcCBsZWFkaW5nIGFuZCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgICBuZXh0TGluZSA9IG5leHRMaW5lLnJlcGxhY2UoL15cXHI/XFxuLywgJycpLnJlcGxhY2UoL1xcciQvLCAnJyk7XG4gIH1cblxuICAvLyBHZXQgdGhlIHByZXZpb3VzIGxpbmUuXG4gIGlmIChwcmV2TGluZVN0YXJ0T2Zmc2V0ID49IDApIHtcbiAgICBwcmV2TGluZSA9IHN0ci5zbGljZShwcmV2TGluZVN0YXJ0T2Zmc2V0LCBsaW5lU3RhcnRPZmZzZXQpXG4gICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxyP1xcbiQvLCAnJyk7ICAvLyBTdHJpcCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgfVxuXG4gIC8vIEdldCB0aGUgdGFyZ2V0IGxpbmUsIHN0cmlwcGluZyBhIHRyYWlsaW5nIGNhcnJpYWdlIHJldHVybiBpZiBuZWNlc3NhcnkuXG4gIHZhciBsaW5lID0gc3RyLnNsaWNlKGxpbmVTdGFydE9mZnNldCwgbGluZUVuZE9mZnNldCkucmVwbGFjZSgvXFxyJC8sICcnKTtcblxuICByZXR1cm4ge1xuICAgIGxpbmVOdW06IGxpbmVOdW0sXG4gICAgY29sTnVtOiBjb2xOdW0sXG4gICAgbGluZTogbGluZSxcbiAgICBwcmV2TGluZTogcHJldkxpbmUsXG4gICAgbmV4dExpbmU6IG5leHRMaW5lXG4gIH07XG59O1xuXG4vLyBSZXR1cm4gYSBuaWNlbHktZm9ybWF0dGVkIHN0cmluZyBkZXNjcmliaW5nIHRoZSBsaW5lIGFuZCBjb2x1bW4gZm9yIHRoZVxuLy8gZ2l2ZW4gb2Zmc2V0IGluIGBzdHJgLlxuZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSA9IGZ1bmN0aW9uKHN0ciwgb2Zmc2V0IC8qIC4uLnJhbmdlcyAqLykge1xuICB2YXIgcmVwZWF0U3RyID0gY29tbW9uLnJlcGVhdFN0cjtcblxuICB2YXIgbGluZUFuZENvbCA9IGV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbihzdHIsIG9mZnNldCk7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHNiLmFwcGVuZCgnTGluZSAnICsgbGluZUFuZENvbC5saW5lTnVtICsgJywgY29sICcgKyBsaW5lQW5kQ29sLmNvbE51bSArICc6XFxuJyk7XG5cbiAgLy8gQW4gYXJyYXkgb2YgdGhlIHByZXZpb3VzLCBjdXJyZW50LCBhbmQgbmV4dCBsaW5lIG51bWJlcnMgYXMgc3RyaW5ncyBvZiBlcXVhbCBsZW5ndGguXG4gIHZhciBsaW5lTnVtYmVycyA9IHBhZE51bWJlcnNUb0VxdWFsTGVuZ3RoKFtcbiAgICAgIGxpbmVBbmRDb2wucHJldkxpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gLSAxLFxuICAgICAgbGluZUFuZENvbC5saW5lTnVtLFxuICAgICAgbGluZUFuZENvbC5uZXh0TGluZSA9PSBudWxsID8gMCA6IGxpbmVBbmRDb2wubGluZU51bSArIDFcbiAgXSk7XG5cbiAgLy8gSGVscGVyIGZvciBhcHBlbmRpbmcgZm9ybWF0dGluZyBpbnB1dCBsaW5lcyB0byB0aGUgYnVmZmVyLlxuICBmdW5jdGlvbiBhcHBlbmRMaW5lKG51bSwgY29udGVudCwgcHJlZml4KSB7XG4gICAgc2IuYXBwZW5kKHByZWZpeCArIGxpbmVOdW1iZXJzW251bV0gKyAnIHwgJyArIGNvbnRlbnQgKyAnXFxuJyk7XG4gIH1cblxuICAvLyBJbmNsdWRlIHRoZSBwcmV2aW91cyBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICBpZiAobGluZUFuZENvbC5wcmV2TGluZSAhPSBudWxsKSB7XG4gICAgYXBwZW5kTGluZSgwLCBsaW5lQW5kQ29sLnByZXZMaW5lLCAnICAnKTtcbiAgfVxuICAvLyBMaW5lIHRoYXQgdGhlIGVycm9yIG9jY3VycmVkIG9uLlxuICBhcHBlbmRMaW5lKDEsIGxpbmVBbmRDb2wubGluZSwgJz4gJyk7XG5cbiAgLy8gQnVpbGQgdXAgdGhlIGxpbmUgdGhhdCBwb2ludHMgdG8gdGhlIG9mZnNldCBhbmQgcG9zc2libGUgaW5kaWNhdGVzIG9uZSBvciBtb3JlIHJhbmdlcy5cbiAgLy8gU3RhcnQgd2l0aCBhIGJsYW5rIGxpbmUsIGFuZCBpbmRpY2F0ZSBlYWNoIHJhbmdlIGJ5IG92ZXJsYXlpbmcgYSBzdHJpbmcgb2YgYH5gIGNoYXJzLlxuICB2YXIgbGluZUxlbiA9IGxpbmVBbmRDb2wubGluZS5sZW5ndGg7XG4gIHZhciBpbmRpY2F0aW9uTGluZSA9IHJlcGVhdFN0cignICcsIGxpbmVMZW4gKyAxKTtcbiAgdmFyIHJhbmdlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHN0YXJ0SWR4ID0gcmFuZ2VzW2ldWzBdO1xuICAgIHZhciBlbmRJZHggPSByYW5nZXNbaV1bMV07XG4gICAgY29tbW9uLmFzc2VydChzdGFydElkeCA+PSAwICYmIHN0YXJ0SWR4IDw9IGVuZElkeCwgJ3JhbmdlIHN0YXJ0IG11c3QgYmUgPj0gMCBhbmQgPD0gZW5kJyk7XG5cbiAgICB2YXIgbGluZVN0YXJ0T2Zmc2V0ID0gb2Zmc2V0IC0gbGluZUFuZENvbC5jb2xOdW0gKyAxO1xuICAgIHN0YXJ0SWR4ID0gTWF0aC5tYXgoMCwgc3RhcnRJZHggLSBsaW5lU3RhcnRPZmZzZXQpO1xuICAgIGVuZElkeCA9IE1hdGgubWluKGVuZElkeCAtIGxpbmVTdGFydE9mZnNldCwgbGluZUxlbik7XG5cbiAgICBpbmRpY2F0aW9uTGluZSA9IHN0cmNweShpbmRpY2F0aW9uTGluZSwgcmVwZWF0U3RyKCd+JywgZW5kSWR4IC0gc3RhcnRJZHgpLCBzdGFydElkeCk7XG4gIH1cbiAgdmFyIGd1dHRlcldpZHRoID0gMiArIGxpbmVOdW1iZXJzWzFdLmxlbmd0aCArIDM7XG4gIHNiLmFwcGVuZChyZXBlYXRTdHIoJyAnLCBndXR0ZXJXaWR0aCkpO1xuICBpbmRpY2F0aW9uTGluZSA9IHN0cmNweShpbmRpY2F0aW9uTGluZSwgJ14nLCBsaW5lQW5kQ29sLmNvbE51bSAtIDEpO1xuICBzYi5hcHBlbmQoaW5kaWNhdGlvbkxpbmUucmVwbGFjZSgvICskLywgJycpICsgJ1xcbicpO1xuXG4gIC8vIEluY2x1ZGUgdGhlIG5leHQgbGluZSBmb3IgY29udGV4dCBpZiBwb3NzaWJsZS5cbiAgaWYgKGxpbmVBbmRDb2wubmV4dExpbmUgIT0gbnVsbCkge1xuICAgIGFwcGVuZExpbmUoMiwgbGluZUFuZENvbC5uZXh0TGluZSwgJyAgJyk7XG4gIH1cbiAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuIiwiLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL3R2Y3V0c2VtL2VzLWxhYi9ibG9iL21hc3Rlci9zcmMvcGFyc2VyL3VuaWNvZGUuanMuXG4vLyBUaGVzZSBhcmUganVzdCBjYXRlZ29yaWVzIHRoYXQgYXJlIHVzZWQgaW4gRVM1LlxuLy8gVGhlIGZ1bGwgbGlzdCBvZiBVbmljb2RlIGNhdGVnb3JpZXMgaXMgaGVyZTogaHR0cDovL3d3dy5maWxlZm9ybWF0LmluZm8vaW5mby91bmljb2RlL2NhdGVnb3J5L2luZGV4Lmh0bS5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBMZXR0ZXJzXG4gIEx1OiAvW1xcdTAwNDEtXFx1MDA1QV18W1xcdTAwQzAtXFx1MDBENl18W1xcdTAwRDgtXFx1MDBERV18W1xcdTAxMDAtXFx1MDEwMF18W1xcdTAxMDItXFx1MDEwMl18W1xcdTAxMDQtXFx1MDEwNF18W1xcdTAxMDYtXFx1MDEwNl18W1xcdTAxMDgtXFx1MDEwOF18W1xcdTAxMEEtXFx1MDEwQV18W1xcdTAxMEMtXFx1MDEwQ118W1xcdTAxMEUtXFx1MDEwRV18W1xcdTAxMTAtXFx1MDExMF18W1xcdTAxMTItXFx1MDExMl18W1xcdTAxMTQtXFx1MDExNF18W1xcdTAxMTYtXFx1MDExNl18W1xcdTAxMTgtXFx1MDExOF18W1xcdTAxMUEtXFx1MDExQV18W1xcdTAxMUMtXFx1MDExQ118W1xcdTAxMUUtXFx1MDExRV18W1xcdTAxMjAtXFx1MDEyMF18W1xcdTAxMjItXFx1MDEyMl18W1xcdTAxMjQtXFx1MDEyNF18W1xcdTAxMjYtXFx1MDEyNl18W1xcdTAxMjgtXFx1MDEyOF18W1xcdTAxMkEtXFx1MDEyQV18W1xcdTAxMkMtXFx1MDEyQ118W1xcdTAxMkUtXFx1MDEyRV18W1xcdTAxMzAtXFx1MDEzMF18W1xcdTAxMzItXFx1MDEzMl18W1xcdTAxMzQtXFx1MDEzNF18W1xcdTAxMzYtXFx1MDEzNl18W1xcdTAxMzktXFx1MDEzOV18W1xcdTAxM0ItXFx1MDEzQl18W1xcdTAxM0QtXFx1MDEzRF18W1xcdTAxM0YtXFx1MDEzRl18W1xcdTAxNDEtXFx1MDE0MV18W1xcdTAxNDMtXFx1MDE0M118W1xcdTAxNDUtXFx1MDE0NV18W1xcdTAxNDctXFx1MDE0N118W1xcdTAxNEEtXFx1MDE0QV18W1xcdTAxNEMtXFx1MDE0Q118W1xcdTAxNEUtXFx1MDE0RV18W1xcdTAxNTAtXFx1MDE1MF18W1xcdTAxNTItXFx1MDE1Ml18W1xcdTAxNTQtXFx1MDE1NF18W1xcdTAxNTYtXFx1MDE1Nl18W1xcdTAxNTgtXFx1MDE1OF18W1xcdTAxNUEtXFx1MDE1QV18W1xcdTAxNUMtXFx1MDE1Q118W1xcdTAxNUUtXFx1MDE1RV18W1xcdTAxNjAtXFx1MDE2MF18W1xcdTAxNjItXFx1MDE2Ml18W1xcdTAxNjQtXFx1MDE2NF18W1xcdTAxNjYtXFx1MDE2Nl18W1xcdTAxNjgtXFx1MDE2OF18W1xcdTAxNkEtXFx1MDE2QV18W1xcdTAxNkMtXFx1MDE2Q118W1xcdTAxNkUtXFx1MDE2RV18W1xcdTAxNzAtXFx1MDE3MF18W1xcdTAxNzItXFx1MDE3Ml18W1xcdTAxNzQtXFx1MDE3NF18W1xcdTAxNzYtXFx1MDE3Nl18W1xcdTAxNzgtXFx1MDE3OV18W1xcdTAxN0ItXFx1MDE3Ql18W1xcdTAxN0QtXFx1MDE3RF18W1xcdTAxODEtXFx1MDE4Ml18W1xcdTAxODQtXFx1MDE4NF18W1xcdTAxODYtXFx1MDE4N118W1xcdTAxODktXFx1MDE4Ql18W1xcdTAxOEUtXFx1MDE5MV18W1xcdTAxOTMtXFx1MDE5NF18W1xcdTAxOTYtXFx1MDE5OF18W1xcdTAxOUMtXFx1MDE5RF18W1xcdTAxOUYtXFx1MDFBMF18W1xcdTAxQTItXFx1MDFBMl18W1xcdTAxQTQtXFx1MDFBNF18W1xcdTAxQTYtXFx1MDFBN118W1xcdTAxQTktXFx1MDFBOV18W1xcdTAxQUMtXFx1MDFBQ118W1xcdTAxQUUtXFx1MDFBRl18W1xcdTAxQjEtXFx1MDFCM118W1xcdTAxQjUtXFx1MDFCNV18W1xcdTAxQjctXFx1MDFCOF18W1xcdTAxQkMtXFx1MDFCQ118W1xcdTAxQzQtXFx1MDFDNF18W1xcdTAxQzctXFx1MDFDN118W1xcdTAxQ0EtXFx1MDFDQV18W1xcdTAxQ0QtXFx1MDFDRF18W1xcdTAxQ0YtXFx1MDFDRl18W1xcdTAxRDEtXFx1MDFEMV18W1xcdTAxRDMtXFx1MDFEM118W1xcdTAxRDUtXFx1MDFENV18W1xcdTAxRDctXFx1MDFEN118W1xcdTAxRDktXFx1MDFEOV18W1xcdTAxREItXFx1MDFEQl18W1xcdTAxREUtXFx1MDFERV18W1xcdTAxRTAtXFx1MDFFMF18W1xcdTAxRTItXFx1MDFFMl18W1xcdTAxRTQtXFx1MDFFNF18W1xcdTAxRTYtXFx1MDFFNl18W1xcdTAxRTgtXFx1MDFFOF18W1xcdTAxRUEtXFx1MDFFQV18W1xcdTAxRUMtXFx1MDFFQ118W1xcdTAxRUUtXFx1MDFFRV18W1xcdTAxRjEtXFx1MDFGMV18W1xcdTAxRjQtXFx1MDFGNF18W1xcdTAxRkEtXFx1MDFGQV18W1xcdTAxRkMtXFx1MDFGQ118W1xcdTAxRkUtXFx1MDFGRV18W1xcdTAyMDAtXFx1MDIwMF18W1xcdTAyMDItXFx1MDIwMl18W1xcdTAyMDQtXFx1MDIwNF18W1xcdTAyMDYtXFx1MDIwNl18W1xcdTAyMDgtXFx1MDIwOF18W1xcdTAyMEEtXFx1MDIwQV18W1xcdTAyMEMtXFx1MDIwQ118W1xcdTAyMEUtXFx1MDIwRV18W1xcdTAyMTAtXFx1MDIxMF18W1xcdTAyMTItXFx1MDIxMl18W1xcdTAyMTQtXFx1MDIxNF18W1xcdTAyMTYtXFx1MDIxNl18W1xcdTAzODYtXFx1MDM4Nl18W1xcdTAzODgtXFx1MDM4QV18W1xcdTAzOEMtXFx1MDM4Q118W1xcdTAzOEUtXFx1MDM4Rl18W1xcdTAzOTEtXFx1MDNBMV18W1xcdTAzQTMtXFx1MDNBQl18W1xcdTAzRDItXFx1MDNENF18W1xcdTAzREEtXFx1MDNEQV18W1xcdTAzREMtXFx1MDNEQ118W1xcdTAzREUtXFx1MDNERV18W1xcdTAzRTAtXFx1MDNFMF18W1xcdTAzRTItXFx1MDNFMl18W1xcdTAzRTQtXFx1MDNFNF18W1xcdTAzRTYtXFx1MDNFNl18W1xcdTAzRTgtXFx1MDNFOF18W1xcdTAzRUEtXFx1MDNFQV18W1xcdTAzRUMtXFx1MDNFQ118W1xcdTAzRUUtXFx1MDNFRV18W1xcdTA0MDEtXFx1MDQwQ118W1xcdTA0MEUtXFx1MDQyRl18W1xcdTA0NjAtXFx1MDQ2MF18W1xcdTA0NjItXFx1MDQ2Ml18W1xcdTA0NjQtXFx1MDQ2NF18W1xcdTA0NjYtXFx1MDQ2Nl18W1xcdTA0NjgtXFx1MDQ2OF18W1xcdTA0NkEtXFx1MDQ2QV18W1xcdTA0NkMtXFx1MDQ2Q118W1xcdTA0NkUtXFx1MDQ2RV18W1xcdTA0NzAtXFx1MDQ3MF18W1xcdTA0NzItXFx1MDQ3Ml18W1xcdTA0NzQtXFx1MDQ3NF18W1xcdTA0NzYtXFx1MDQ3Nl18W1xcdTA0NzgtXFx1MDQ3OF18W1xcdTA0N0EtXFx1MDQ3QV18W1xcdTA0N0MtXFx1MDQ3Q118W1xcdTA0N0UtXFx1MDQ3RV18W1xcdTA0ODAtXFx1MDQ4MF18W1xcdTA0OTAtXFx1MDQ5MF18W1xcdTA0OTItXFx1MDQ5Ml18W1xcdTA0OTQtXFx1MDQ5NF18W1xcdTA0OTYtXFx1MDQ5Nl18W1xcdTA0OTgtXFx1MDQ5OF18W1xcdTA0OUEtXFx1MDQ5QV18W1xcdTA0OUMtXFx1MDQ5Q118W1xcdTA0OUUtXFx1MDQ5RV18W1xcdTA0QTAtXFx1MDRBMF18W1xcdTA0QTItXFx1MDRBMl18W1xcdTA0QTQtXFx1MDRBNF18W1xcdTA0QTYtXFx1MDRBNl18W1xcdTA0QTgtXFx1MDRBOF18W1xcdTA0QUEtXFx1MDRBQV18W1xcdTA0QUMtXFx1MDRBQ118W1xcdTA0QUUtXFx1MDRBRV18W1xcdTA0QjAtXFx1MDRCMF18W1xcdTA0QjItXFx1MDRCMl18W1xcdTA0QjQtXFx1MDRCNF18W1xcdTA0QjYtXFx1MDRCNl18W1xcdTA0QjgtXFx1MDRCOF18W1xcdTA0QkEtXFx1MDRCQV18W1xcdTA0QkMtXFx1MDRCQ118W1xcdTA0QkUtXFx1MDRCRV18W1xcdTA0QzEtXFx1MDRDMV18W1xcdTA0QzMtXFx1MDRDM118W1xcdTA0QzctXFx1MDRDN118W1xcdTA0Q0ItXFx1MDRDQl18W1xcdTA0RDAtXFx1MDREMF18W1xcdTA0RDItXFx1MDREMl18W1xcdTA0RDQtXFx1MDRENF18W1xcdTA0RDYtXFx1MDRENl18W1xcdTA0RDgtXFx1MDREOF18W1xcdTA0REEtXFx1MDREQV18W1xcdTA0REMtXFx1MDREQ118W1xcdTA0REUtXFx1MDRERV18W1xcdTA0RTAtXFx1MDRFMF18W1xcdTA0RTItXFx1MDRFMl18W1xcdTA0RTQtXFx1MDRFNF18W1xcdTA0RTYtXFx1MDRFNl18W1xcdTA0RTgtXFx1MDRFOF18W1xcdTA0RUEtXFx1MDRFQV18W1xcdTA0RUUtXFx1MDRFRV18W1xcdTA0RjAtXFx1MDRGMF18W1xcdTA0RjItXFx1MDRGMl18W1xcdTA0RjQtXFx1MDRGNF18W1xcdTA0RjgtXFx1MDRGOF18W1xcdTA1MzEtXFx1MDU1Nl18W1xcdTEwQTAtXFx1MTBDNV18W1xcdTFFMDAtXFx1MUUwMF18W1xcdTFFMDItXFx1MUUwMl18W1xcdTFFMDQtXFx1MUUwNF18W1xcdTFFMDYtXFx1MUUwNl18W1xcdTFFMDgtXFx1MUUwOF18W1xcdTFFMEEtXFx1MUUwQV18W1xcdTFFMEMtXFx1MUUwQ118W1xcdTFFMEUtXFx1MUUwRV18W1xcdTFFMTAtXFx1MUUxMF18W1xcdTFFMTItXFx1MUUxMl18W1xcdTFFMTQtXFx1MUUxNF18W1xcdTFFMTYtXFx1MUUxNl18W1xcdTFFMTgtXFx1MUUxOF18W1xcdTFFMUEtXFx1MUUxQV18W1xcdTFFMUMtXFx1MUUxQ118W1xcdTFFMUUtXFx1MUUxRV18W1xcdTFFMjAtXFx1MUUyMF18W1xcdTFFMjItXFx1MUUyMl18W1xcdTFFMjQtXFx1MUUyNF18W1xcdTFFMjYtXFx1MUUyNl18W1xcdTFFMjgtXFx1MUUyOF18W1xcdTFFMkEtXFx1MUUyQV18W1xcdTFFMkMtXFx1MUUyQ118W1xcdTFFMkUtXFx1MUUyRV18W1xcdTFFMzAtXFx1MUUzMF18W1xcdTFFMzItXFx1MUUzMl18W1xcdTFFMzQtXFx1MUUzNF18W1xcdTFFMzYtXFx1MUUzNl18W1xcdTFFMzgtXFx1MUUzOF18W1xcdTFFM0EtXFx1MUUzQV18W1xcdTFFM0MtXFx1MUUzQ118W1xcdTFFM0UtXFx1MUUzRV18W1xcdTFFNDAtXFx1MUU0MF18W1xcdTFFNDItXFx1MUU0Ml18W1xcdTFFNDQtXFx1MUU0NF18W1xcdTFFNDYtXFx1MUU0Nl18W1xcdTFFNDgtXFx1MUU0OF18W1xcdTFFNEEtXFx1MUU0QV18W1xcdTFFNEMtXFx1MUU0Q118W1xcdTFFNEUtXFx1MUU0RV18W1xcdTFFNTAtXFx1MUU1MF18W1xcdTFFNTItXFx1MUU1Ml18W1xcdTFFNTQtXFx1MUU1NF18W1xcdTFFNTYtXFx1MUU1Nl18W1xcdTFFNTgtXFx1MUU1OF18W1xcdTFFNUEtXFx1MUU1QV18W1xcdTFFNUMtXFx1MUU1Q118W1xcdTFFNUUtXFx1MUU1RV18W1xcdTFFNjAtXFx1MUU2MF18W1xcdTFFNjItXFx1MUU2Ml18W1xcdTFFNjQtXFx1MUU2NF18W1xcdTFFNjYtXFx1MUU2Nl18W1xcdTFFNjgtXFx1MUU2OF18W1xcdTFFNkEtXFx1MUU2QV18W1xcdTFFNkMtXFx1MUU2Q118W1xcdTFFNkUtXFx1MUU2RV18W1xcdTFFNzAtXFx1MUU3MF18W1xcdTFFNzItXFx1MUU3Ml18W1xcdTFFNzQtXFx1MUU3NF18W1xcdTFFNzYtXFx1MUU3Nl18W1xcdTFFNzgtXFx1MUU3OF18W1xcdTFFN0EtXFx1MUU3QV18W1xcdTFFN0MtXFx1MUU3Q118W1xcdTFFN0UtXFx1MUU3RV18W1xcdTFFODAtXFx1MUU4MF18W1xcdTFFODItXFx1MUU4Ml18W1xcdTFFODQtXFx1MUU4NF18W1xcdTFFODYtXFx1MUU4Nl18W1xcdTFFODgtXFx1MUU4OF18W1xcdTFFOEEtXFx1MUU4QV18W1xcdTFFOEMtXFx1MUU4Q118W1xcdTFFOEUtXFx1MUU4RV18W1xcdTFFOTAtXFx1MUU5MF18W1xcdTFFOTItXFx1MUU5Ml18W1xcdTFFOTQtXFx1MUU5NF18W1xcdTFFQTAtXFx1MUVBMF18W1xcdTFFQTItXFx1MUVBMl18W1xcdTFFQTQtXFx1MUVBNF18W1xcdTFFQTYtXFx1MUVBNl18W1xcdTFFQTgtXFx1MUVBOF18W1xcdTFFQUEtXFx1MUVBQV18W1xcdTFFQUMtXFx1MUVBQ118W1xcdTFFQUUtXFx1MUVBRV18W1xcdTFFQjAtXFx1MUVCMF18W1xcdTFFQjItXFx1MUVCMl18W1xcdTFFQjQtXFx1MUVCNF18W1xcdTFFQjYtXFx1MUVCNl18W1xcdTFFQjgtXFx1MUVCOF18W1xcdTFFQkEtXFx1MUVCQV18W1xcdTFFQkMtXFx1MUVCQ118W1xcdTFFQkUtXFx1MUVCRV18W1xcdTFFQzAtXFx1MUVDMF18W1xcdTFFQzItXFx1MUVDMl18W1xcdTFFQzQtXFx1MUVDNF18W1xcdTFFQzYtXFx1MUVDNl18W1xcdTFFQzgtXFx1MUVDOF18W1xcdTFFQ0EtXFx1MUVDQV18W1xcdTFFQ0MtXFx1MUVDQ118W1xcdTFFQ0UtXFx1MUVDRV18W1xcdTFFRDAtXFx1MUVEMF18W1xcdTFFRDItXFx1MUVEMl18W1xcdTFFRDQtXFx1MUVENF18W1xcdTFFRDYtXFx1MUVENl18W1xcdTFFRDgtXFx1MUVEOF18W1xcdTFFREEtXFx1MUVEQV18W1xcdTFFREMtXFx1MUVEQ118W1xcdTFFREUtXFx1MUVERV18W1xcdTFFRTAtXFx1MUVFMF18W1xcdTFFRTItXFx1MUVFMl18W1xcdTFFRTQtXFx1MUVFNF18W1xcdTFFRTYtXFx1MUVFNl18W1xcdTFFRTgtXFx1MUVFOF18W1xcdTFFRUEtXFx1MUVFQV18W1xcdTFFRUMtXFx1MUVFQ118W1xcdTFFRUUtXFx1MUVFRV18W1xcdTFFRjAtXFx1MUVGMF18W1xcdTFFRjItXFx1MUVGMl18W1xcdTFFRjQtXFx1MUVGNF18W1xcdTFFRjYtXFx1MUVGNl18W1xcdTFFRjgtXFx1MUVGOF18W1xcdTFGMDgtXFx1MUYwRl18W1xcdTFGMTgtXFx1MUYxRF18W1xcdTFGMjgtXFx1MUYyRl18W1xcdTFGMzgtXFx1MUYzRl18W1xcdTFGNDgtXFx1MUY0RF18W1xcdTFGNTktXFx1MUY1OV18W1xcdTFGNUItXFx1MUY1Ql18W1xcdTFGNUQtXFx1MUY1RF18W1xcdTFGNUYtXFx1MUY1Rl18W1xcdTFGNjgtXFx1MUY2Rl18W1xcdTFGODgtXFx1MUY4Rl18W1xcdTFGOTgtXFx1MUY5Rl18W1xcdTFGQTgtXFx1MUZBRl18W1xcdTFGQjgtXFx1MUZCQ118W1xcdTFGQzgtXFx1MUZDQ118W1xcdTFGRDgtXFx1MUZEQl18W1xcdTFGRTgtXFx1MUZFQ118W1xcdTFGRjgtXFx1MUZGQ118W1xcdTIxMDItXFx1MjEwMl18W1xcdTIxMDctXFx1MjEwN118W1xcdTIxMEItXFx1MjEwRF18W1xcdTIxMTAtXFx1MjExMl18W1xcdTIxMTUtXFx1MjExNV18W1xcdTIxMTktXFx1MjExRF18W1xcdTIxMjQtXFx1MjEyNF18W1xcdTIxMjYtXFx1MjEyNl18W1xcdTIxMjgtXFx1MjEyOF18W1xcdTIxMkEtXFx1MjEyRF18W1xcdTIxMzAtXFx1MjEzMV18W1xcdTIxMzMtXFx1MjEzM118W1xcdUZGMjEtXFx1RkYzQV0vLFxuICBMbDogL1tcXHUwMDYxLVxcdTAwN0FdfFtcXHUwMEFBLVxcdTAwQUFdfFtcXHUwMEI1LVxcdTAwQjVdfFtcXHUwMEJBLVxcdTAwQkFdfFtcXHUwMERGLVxcdTAwRjZdfFtcXHUwMEY4LVxcdTAwRkZdfFtcXHUwMTAxLVxcdTAxMDFdfFtcXHUwMTAzLVxcdTAxMDNdfFtcXHUwMTA1LVxcdTAxMDVdfFtcXHUwMTA3LVxcdTAxMDddfFtcXHUwMTA5LVxcdTAxMDldfFtcXHUwMTBCLVxcdTAxMEJdfFtcXHUwMTBELVxcdTAxMERdfFtcXHUwMTBGLVxcdTAxMEZdfFtcXHUwMTExLVxcdTAxMTFdfFtcXHUwMTEzLVxcdTAxMTNdfFtcXHUwMTE1LVxcdTAxMTVdfFtcXHUwMTE3LVxcdTAxMTddfFtcXHUwMTE5LVxcdTAxMTldfFtcXHUwMTFCLVxcdTAxMUJdfFtcXHUwMTFELVxcdTAxMURdfFtcXHUwMTFGLVxcdTAxMUZdfFtcXHUwMTIxLVxcdTAxMjFdfFtcXHUwMTIzLVxcdTAxMjNdfFtcXHUwMTI1LVxcdTAxMjVdfFtcXHUwMTI3LVxcdTAxMjddfFtcXHUwMTI5LVxcdTAxMjldfFtcXHUwMTJCLVxcdTAxMkJdfFtcXHUwMTJELVxcdTAxMkRdfFtcXHUwMTJGLVxcdTAxMkZdfFtcXHUwMTMxLVxcdTAxMzFdfFtcXHUwMTMzLVxcdTAxMzNdfFtcXHUwMTM1LVxcdTAxMzVdfFtcXHUwMTM3LVxcdTAxMzhdfFtcXHUwMTNBLVxcdTAxM0FdfFtcXHUwMTNDLVxcdTAxM0NdfFtcXHUwMTNFLVxcdTAxM0VdfFtcXHUwMTQwLVxcdTAxNDBdfFtcXHUwMTQyLVxcdTAxNDJdfFtcXHUwMTQ0LVxcdTAxNDRdfFtcXHUwMTQ2LVxcdTAxNDZdfFtcXHUwMTQ4LVxcdTAxNDldfFtcXHUwMTRCLVxcdTAxNEJdfFtcXHUwMTRELVxcdTAxNERdfFtcXHUwMTRGLVxcdTAxNEZdfFtcXHUwMTUxLVxcdTAxNTFdfFtcXHUwMTUzLVxcdTAxNTNdfFtcXHUwMTU1LVxcdTAxNTVdfFtcXHUwMTU3LVxcdTAxNTddfFtcXHUwMTU5LVxcdTAxNTldfFtcXHUwMTVCLVxcdTAxNUJdfFtcXHUwMTVELVxcdTAxNURdfFtcXHUwMTVGLVxcdTAxNUZdfFtcXHUwMTYxLVxcdTAxNjFdfFtcXHUwMTYzLVxcdTAxNjNdfFtcXHUwMTY1LVxcdTAxNjVdfFtcXHUwMTY3LVxcdTAxNjddfFtcXHUwMTY5LVxcdTAxNjldfFtcXHUwMTZCLVxcdTAxNkJdfFtcXHUwMTZELVxcdTAxNkRdfFtcXHUwMTZGLVxcdTAxNkZdfFtcXHUwMTcxLVxcdTAxNzFdfFtcXHUwMTczLVxcdTAxNzNdfFtcXHUwMTc1LVxcdTAxNzVdfFtcXHUwMTc3LVxcdTAxNzddfFtcXHUwMTdBLVxcdTAxN0FdfFtcXHUwMTdDLVxcdTAxN0NdfFtcXHUwMTdFLVxcdTAxODBdfFtcXHUwMTgzLVxcdTAxODNdfFtcXHUwMTg1LVxcdTAxODVdfFtcXHUwMTg4LVxcdTAxODhdfFtcXHUwMThDLVxcdTAxOERdfFtcXHUwMTkyLVxcdTAxOTJdfFtcXHUwMTk1LVxcdTAxOTVdfFtcXHUwMTk5LVxcdTAxOUJdfFtcXHUwMTlFLVxcdTAxOUVdfFtcXHUwMUExLVxcdTAxQTFdfFtcXHUwMUEzLVxcdTAxQTNdfFtcXHUwMUE1LVxcdTAxQTVdfFtcXHUwMUE4LVxcdTAxQThdfFtcXHUwMUFCLVxcdTAxQUJdfFtcXHUwMUFELVxcdTAxQURdfFtcXHUwMUIwLVxcdTAxQjBdfFtcXHUwMUI0LVxcdTAxQjRdfFtcXHUwMUI2LVxcdTAxQjZdfFtcXHUwMUI5LVxcdTAxQkFdfFtcXHUwMUJELVxcdTAxQkRdfFtcXHUwMUM2LVxcdTAxQzZdfFtcXHUwMUM5LVxcdTAxQzldfFtcXHUwMUNDLVxcdTAxQ0NdfFtcXHUwMUNFLVxcdTAxQ0VdfFtcXHUwMUQwLVxcdTAxRDBdfFtcXHUwMUQyLVxcdTAxRDJdfFtcXHUwMUQ0LVxcdTAxRDRdfFtcXHUwMUQ2LVxcdTAxRDZdfFtcXHUwMUQ4LVxcdTAxRDhdfFtcXHUwMURBLVxcdTAxREFdfFtcXHUwMURDLVxcdTAxRERdfFtcXHUwMURGLVxcdTAxREZdfFtcXHUwMUUxLVxcdTAxRTFdfFtcXHUwMUUzLVxcdTAxRTNdfFtcXHUwMUU1LVxcdTAxRTVdfFtcXHUwMUU3LVxcdTAxRTddfFtcXHUwMUU5LVxcdTAxRTldfFtcXHUwMUVCLVxcdTAxRUJdfFtcXHUwMUVELVxcdTAxRURdfFtcXHUwMUVGLVxcdTAxRjBdfFtcXHUwMUYzLVxcdTAxRjNdfFtcXHUwMUY1LVxcdTAxRjVdfFtcXHUwMUZCLVxcdTAxRkJdfFtcXHUwMUZELVxcdTAxRkRdfFtcXHUwMUZGLVxcdTAxRkZdfFtcXHUwMjAxLVxcdTAyMDFdfFtcXHUwMjAzLVxcdTAyMDNdfFtcXHUwMjA1LVxcdTAyMDVdfFtcXHUwMjA3LVxcdTAyMDddfFtcXHUwMjA5LVxcdTAyMDldfFtcXHUwMjBCLVxcdTAyMEJdfFtcXHUwMjBELVxcdTAyMERdfFtcXHUwMjBGLVxcdTAyMEZdfFtcXHUwMjExLVxcdTAyMTFdfFtcXHUwMjEzLVxcdTAyMTNdfFtcXHUwMjE1LVxcdTAyMTVdfFtcXHUwMjE3LVxcdTAyMTddfFtcXHUwMjUwLVxcdTAyQThdfFtcXHUwMzkwLVxcdTAzOTBdfFtcXHUwM0FDLVxcdTAzQ0VdfFtcXHUwM0QwLVxcdTAzRDFdfFtcXHUwM0Q1LVxcdTAzRDZdfFtcXHUwM0UzLVxcdTAzRTNdfFtcXHUwM0U1LVxcdTAzRTVdfFtcXHUwM0U3LVxcdTAzRTddfFtcXHUwM0U5LVxcdTAzRTldfFtcXHUwM0VCLVxcdTAzRUJdfFtcXHUwM0VELVxcdTAzRURdfFtcXHUwM0VGLVxcdTAzRjJdfFtcXHUwNDMwLVxcdTA0NEZdfFtcXHUwNDUxLVxcdTA0NUNdfFtcXHUwNDVFLVxcdTA0NUZdfFtcXHUwNDYxLVxcdTA0NjFdfFtcXHUwNDYzLVxcdTA0NjNdfFtcXHUwNDY1LVxcdTA0NjVdfFtcXHUwNDY3LVxcdTA0NjddfFtcXHUwNDY5LVxcdTA0NjldfFtcXHUwNDZCLVxcdTA0NkJdfFtcXHUwNDZELVxcdTA0NkRdfFtcXHUwNDZGLVxcdTA0NkZdfFtcXHUwNDcxLVxcdTA0NzFdfFtcXHUwNDczLVxcdTA0NzNdfFtcXHUwNDc1LVxcdTA0NzVdfFtcXHUwNDc3LVxcdTA0NzddfFtcXHUwNDc5LVxcdTA0NzldfFtcXHUwNDdCLVxcdTA0N0JdfFtcXHUwNDdELVxcdTA0N0RdfFtcXHUwNDdGLVxcdTA0N0ZdfFtcXHUwNDgxLVxcdTA0ODFdfFtcXHUwNDkxLVxcdTA0OTFdfFtcXHUwNDkzLVxcdTA0OTNdfFtcXHUwNDk1LVxcdTA0OTVdfFtcXHUwNDk3LVxcdTA0OTddfFtcXHUwNDk5LVxcdTA0OTldfFtcXHUwNDlCLVxcdTA0OUJdfFtcXHUwNDlELVxcdTA0OURdfFtcXHUwNDlGLVxcdTA0OUZdfFtcXHUwNEExLVxcdTA0QTFdfFtcXHUwNEEzLVxcdTA0QTNdfFtcXHUwNEE1LVxcdTA0QTVdfFtcXHUwNEE3LVxcdTA0QTddfFtcXHUwNEE5LVxcdTA0QTldfFtcXHUwNEFCLVxcdTA0QUJdfFtcXHUwNEFELVxcdTA0QURdfFtcXHUwNEFGLVxcdTA0QUZdfFtcXHUwNEIxLVxcdTA0QjFdfFtcXHUwNEIzLVxcdTA0QjNdfFtcXHUwNEI1LVxcdTA0QjVdfFtcXHUwNEI3LVxcdTA0QjddfFtcXHUwNEI5LVxcdTA0QjldfFtcXHUwNEJCLVxcdTA0QkJdfFtcXHUwNEJELVxcdTA0QkRdfFtcXHUwNEJGLVxcdTA0QkZdfFtcXHUwNEMyLVxcdTA0QzJdfFtcXHUwNEM0LVxcdTA0QzRdfFtcXHUwNEM4LVxcdTA0QzhdfFtcXHUwNENDLVxcdTA0Q0NdfFtcXHUwNEQxLVxcdTA0RDFdfFtcXHUwNEQzLVxcdTA0RDNdfFtcXHUwNEQ1LVxcdTA0RDVdfFtcXHUwNEQ3LVxcdTA0RDddfFtcXHUwNEQ5LVxcdTA0RDldfFtcXHUwNERCLVxcdTA0REJdfFtcXHUwNERELVxcdTA0RERdfFtcXHUwNERGLVxcdTA0REZdfFtcXHUwNEUxLVxcdTA0RTFdfFtcXHUwNEUzLVxcdTA0RTNdfFtcXHUwNEU1LVxcdTA0RTVdfFtcXHUwNEU3LVxcdTA0RTddfFtcXHUwNEU5LVxcdTA0RTldfFtcXHUwNEVCLVxcdTA0RUJdfFtcXHUwNEVGLVxcdTA0RUZdfFtcXHUwNEYxLVxcdTA0RjFdfFtcXHUwNEYzLVxcdTA0RjNdfFtcXHUwNEY1LVxcdTA0RjVdfFtcXHUwNEY5LVxcdTA0RjldfFtcXHUwNTYxLVxcdTA1ODddfFtcXHUxMEQwLVxcdTEwRjZdfFtcXHUxRTAxLVxcdTFFMDFdfFtcXHUxRTAzLVxcdTFFMDNdfFtcXHUxRTA1LVxcdTFFMDVdfFtcXHUxRTA3LVxcdTFFMDddfFtcXHUxRTA5LVxcdTFFMDldfFtcXHUxRTBCLVxcdTFFMEJdfFtcXHUxRTBELVxcdTFFMERdfFtcXHUxRTBGLVxcdTFFMEZdfFtcXHUxRTExLVxcdTFFMTFdfFtcXHUxRTEzLVxcdTFFMTNdfFtcXHUxRTE1LVxcdTFFMTVdfFtcXHUxRTE3LVxcdTFFMTddfFtcXHUxRTE5LVxcdTFFMTldfFtcXHUxRTFCLVxcdTFFMUJdfFtcXHUxRTFELVxcdTFFMURdfFtcXHUxRTFGLVxcdTFFMUZdfFtcXHUxRTIxLVxcdTFFMjFdfFtcXHUxRTIzLVxcdTFFMjNdfFtcXHUxRTI1LVxcdTFFMjVdfFtcXHUxRTI3LVxcdTFFMjddfFtcXHUxRTI5LVxcdTFFMjldfFtcXHUxRTJCLVxcdTFFMkJdfFtcXHUxRTJELVxcdTFFMkRdfFtcXHUxRTJGLVxcdTFFMkZdfFtcXHUxRTMxLVxcdTFFMzFdfFtcXHUxRTMzLVxcdTFFMzNdfFtcXHUxRTM1LVxcdTFFMzVdfFtcXHUxRTM3LVxcdTFFMzddfFtcXHUxRTM5LVxcdTFFMzldfFtcXHUxRTNCLVxcdTFFM0JdfFtcXHUxRTNELVxcdTFFM0RdfFtcXHUxRTNGLVxcdTFFM0ZdfFtcXHUxRTQxLVxcdTFFNDFdfFtcXHUxRTQzLVxcdTFFNDNdfFtcXHUxRTQ1LVxcdTFFNDVdfFtcXHUxRTQ3LVxcdTFFNDddfFtcXHUxRTQ5LVxcdTFFNDldfFtcXHUxRTRCLVxcdTFFNEJdfFtcXHUxRTRELVxcdTFFNERdfFtcXHUxRTRGLVxcdTFFNEZdfFtcXHUxRTUxLVxcdTFFNTFdfFtcXHUxRTUzLVxcdTFFNTNdfFtcXHUxRTU1LVxcdTFFNTVdfFtcXHUxRTU3LVxcdTFFNTddfFtcXHUxRTU5LVxcdTFFNTldfFtcXHUxRTVCLVxcdTFFNUJdfFtcXHUxRTVELVxcdTFFNURdfFtcXHUxRTVGLVxcdTFFNUZdfFtcXHUxRTYxLVxcdTFFNjFdfFtcXHUxRTYzLVxcdTFFNjNdfFtcXHUxRTY1LVxcdTFFNjVdfFtcXHUxRTY3LVxcdTFFNjddfFtcXHUxRTY5LVxcdTFFNjldfFtcXHUxRTZCLVxcdTFFNkJdfFtcXHUxRTZELVxcdTFFNkRdfFtcXHUxRTZGLVxcdTFFNkZdfFtcXHUxRTcxLVxcdTFFNzFdfFtcXHUxRTczLVxcdTFFNzNdfFtcXHUxRTc1LVxcdTFFNzVdfFtcXHUxRTc3LVxcdTFFNzddfFtcXHUxRTc5LVxcdTFFNzldfFtcXHUxRTdCLVxcdTFFN0JdfFtcXHUxRTdELVxcdTFFN0RdfFtcXHUxRTdGLVxcdTFFN0ZdfFtcXHUxRTgxLVxcdTFFODFdfFtcXHUxRTgzLVxcdTFFODNdfFtcXHUxRTg1LVxcdTFFODVdfFtcXHUxRTg3LVxcdTFFODddfFtcXHUxRTg5LVxcdTFFODldfFtcXHUxRThCLVxcdTFFOEJdfFtcXHUxRThELVxcdTFFOERdfFtcXHUxRThGLVxcdTFFOEZdfFtcXHUxRTkxLVxcdTFFOTFdfFtcXHUxRTkzLVxcdTFFOTNdfFtcXHUxRTk1LVxcdTFFOUJdfFtcXHUxRUExLVxcdTFFQTFdfFtcXHUxRUEzLVxcdTFFQTNdfFtcXHUxRUE1LVxcdTFFQTVdfFtcXHUxRUE3LVxcdTFFQTddfFtcXHUxRUE5LVxcdTFFQTldfFtcXHUxRUFCLVxcdTFFQUJdfFtcXHUxRUFELVxcdTFFQURdfFtcXHUxRUFGLVxcdTFFQUZdfFtcXHUxRUIxLVxcdTFFQjFdfFtcXHUxRUIzLVxcdTFFQjNdfFtcXHUxRUI1LVxcdTFFQjVdfFtcXHUxRUI3LVxcdTFFQjddfFtcXHUxRUI5LVxcdTFFQjldfFtcXHUxRUJCLVxcdTFFQkJdfFtcXHUxRUJELVxcdTFFQkRdfFtcXHUxRUJGLVxcdTFFQkZdfFtcXHUxRUMxLVxcdTFFQzFdfFtcXHUxRUMzLVxcdTFFQzNdfFtcXHUxRUM1LVxcdTFFQzVdfFtcXHUxRUM3LVxcdTFFQzddfFtcXHUxRUM5LVxcdTFFQzldfFtcXHUxRUNCLVxcdTFFQ0JdfFtcXHUxRUNELVxcdTFFQ0RdfFtcXHUxRUNGLVxcdTFFQ0ZdfFtcXHUxRUQxLVxcdTFFRDFdfFtcXHUxRUQzLVxcdTFFRDNdfFtcXHUxRUQ1LVxcdTFFRDVdfFtcXHUxRUQ3LVxcdTFFRDddfFtcXHUxRUQ5LVxcdTFFRDldfFtcXHUxRURCLVxcdTFFREJdfFtcXHUxRURELVxcdTFFRERdfFtcXHUxRURGLVxcdTFFREZdfFtcXHUxRUUxLVxcdTFFRTFdfFtcXHUxRUUzLVxcdTFFRTNdfFtcXHUxRUU1LVxcdTFFRTVdfFtcXHUxRUU3LVxcdTFFRTddfFtcXHUxRUU5LVxcdTFFRTldfFtcXHUxRUVCLVxcdTFFRUJdfFtcXHUxRUVELVxcdTFFRURdfFtcXHUxRUVGLVxcdTFFRUZdfFtcXHUxRUYxLVxcdTFFRjFdfFtcXHUxRUYzLVxcdTFFRjNdfFtcXHUxRUY1LVxcdTFFRjVdfFtcXHUxRUY3LVxcdTFFRjddfFtcXHUxRUY5LVxcdTFFRjldfFtcXHUxRjAwLVxcdTFGMDddfFtcXHUxRjEwLVxcdTFGMTVdfFtcXHUxRjIwLVxcdTFGMjddfFtcXHUxRjMwLVxcdTFGMzddfFtcXHUxRjQwLVxcdTFGNDVdfFtcXHUxRjUwLVxcdTFGNTddfFtcXHUxRjYwLVxcdTFGNjddfFtcXHUxRjcwLVxcdTFGN0RdfFtcXHUxRjgwLVxcdTFGODddfFtcXHUxRjkwLVxcdTFGOTddfFtcXHUxRkEwLVxcdTFGQTddfFtcXHUxRkIwLVxcdTFGQjRdfFtcXHUxRkI2LVxcdTFGQjddfFtcXHUxRkJFLVxcdTFGQkVdfFtcXHUxRkMyLVxcdTFGQzRdfFtcXHUxRkM2LVxcdTFGQzddfFtcXHUxRkQwLVxcdTFGRDNdfFtcXHUxRkQ2LVxcdTFGRDddfFtcXHUxRkUwLVxcdTFGRTddfFtcXHUxRkYyLVxcdTFGRjRdfFtcXHUxRkY2LVxcdTFGRjddfFtcXHUyMDdGLVxcdTIwN0ZdfFtcXHUyMTBBLVxcdTIxMEFdfFtcXHUyMTBFLVxcdTIxMEZdfFtcXHUyMTEzLVxcdTIxMTNdfFtcXHUyMTE4LVxcdTIxMThdfFtcXHUyMTJFLVxcdTIxMkZdfFtcXHUyMTM0LVxcdTIxMzRdfFtcXHVGQjAwLVxcdUZCMDZdfFtcXHVGQjEzLVxcdUZCMTddfFtcXHVGRjQxLVxcdUZGNUFdLyxcbiAgTHQ6IC9bXFx1MDFDNS1cXHUwMUM1XXxbXFx1MDFDOC1cXHUwMUM4XXxbXFx1MDFDQi1cXHUwMUNCXXxbXFx1MDFGMi1cXHUwMUYyXS8sXG4gIExtOiAvW1xcdTAyQjAtXFx1MDJCOF18W1xcdTAyQkItXFx1MDJDMV18W1xcdTAyRDAtXFx1MDJEMV18W1xcdTAyRTAtXFx1MDJFNF18W1xcdTAzN0EtXFx1MDM3QV18W1xcdTA1NTktXFx1MDU1OV18W1xcdTA2NDAtXFx1MDY0MF18W1xcdTA2RTUtXFx1MDZFNl18W1xcdTBFNDYtXFx1MEU0Nl18W1xcdTBFQzYtXFx1MEVDNl18W1xcdTMwMDUtXFx1MzAwNV18W1xcdTMwMzEtXFx1MzAzNV18W1xcdTMwOUQtXFx1MzA5RV18W1xcdTMwRkMtXFx1MzBGRV18W1xcdUZGNzAtXFx1RkY3MF18W1xcdUZGOUUtXFx1RkY5Rl0vLFxuICBMbzogL1tcXHUwMUFBLVxcdTAxQUFdfFtcXHUwMUJCLVxcdTAxQkJdfFtcXHUwMUJFLVxcdTAxQzNdfFtcXHUwM0YzLVxcdTAzRjNdfFtcXHUwNEMwLVxcdTA0QzBdfFtcXHUwNUQwLVxcdTA1RUFdfFtcXHUwNUYwLVxcdTA1RjJdfFtcXHUwNjIxLVxcdTA2M0FdfFtcXHUwNjQxLVxcdTA2NEFdfFtcXHUwNjcxLVxcdTA2QjddfFtcXHUwNkJBLVxcdTA2QkVdfFtcXHUwNkMwLVxcdTA2Q0VdfFtcXHUwNkQwLVxcdTA2RDNdfFtcXHUwNkQ1LVxcdTA2RDVdfFtcXHUwOTA1LVxcdTA5MzldfFtcXHUwOTNELVxcdTA5M0RdfFtcXHUwOTUwLVxcdTA5NTBdfFtcXHUwOTU4LVxcdTA5NjFdfFtcXHUwOTg1LVxcdTA5OENdfFtcXHUwOThGLVxcdTA5OTBdfFtcXHUwOTkzLVxcdTA5QThdfFtcXHUwOUFBLVxcdTA5QjBdfFtcXHUwOUIyLVxcdTA5QjJdfFtcXHUwOUI2LVxcdTA5QjldfFtcXHUwOURDLVxcdTA5RERdfFtcXHUwOURGLVxcdTA5RTFdfFtcXHUwOUYwLVxcdTA5RjFdfFtcXHUwQTA1LVxcdTBBMEFdfFtcXHUwQTBGLVxcdTBBMTBdfFtcXHUwQTEzLVxcdTBBMjhdfFtcXHUwQTJBLVxcdTBBMzBdfFtcXHUwQTMyLVxcdTBBMzNdfFtcXHUwQTM1LVxcdTBBMzZdfFtcXHUwQTM4LVxcdTBBMzldfFtcXHUwQTU5LVxcdTBBNUNdfFtcXHUwQTVFLVxcdTBBNUVdfFtcXHUwQTcyLVxcdTBBNzRdfFtcXHUwQTg1LVxcdTBBOEJdfFtcXHUwQThELVxcdTBBOERdfFtcXHUwQThGLVxcdTBBOTFdfFtcXHUwQTkzLVxcdTBBQThdfFtcXHUwQUFBLVxcdTBBQjBdfFtcXHUwQUIyLVxcdTBBQjNdfFtcXHUwQUI1LVxcdTBBQjldfFtcXHUwQUJELVxcdTBBQkRdfFtcXHUwQUQwLVxcdTBBRDBdfFtcXHUwQUUwLVxcdTBBRTBdfFtcXHUwQjA1LVxcdTBCMENdfFtcXHUwQjBGLVxcdTBCMTBdfFtcXHUwQjEzLVxcdTBCMjhdfFtcXHUwQjJBLVxcdTBCMzBdfFtcXHUwQjMyLVxcdTBCMzNdfFtcXHUwQjM2LVxcdTBCMzldfFtcXHUwQjNELVxcdTBCM0RdfFtcXHUwQjVDLVxcdTBCNURdfFtcXHUwQjVGLVxcdTBCNjFdfFtcXHUwQjg1LVxcdTBCOEFdfFtcXHUwQjhFLVxcdTBCOTBdfFtcXHUwQjkyLVxcdTBCOTVdfFtcXHUwQjk5LVxcdTBCOUFdfFtcXHUwQjlDLVxcdTBCOUNdfFtcXHUwQjlFLVxcdTBCOUZdfFtcXHUwQkEzLVxcdTBCQTRdfFtcXHUwQkE4LVxcdTBCQUFdfFtcXHUwQkFFLVxcdTBCQjVdfFtcXHUwQkI3LVxcdTBCQjldfFtcXHUwQzA1LVxcdTBDMENdfFtcXHUwQzBFLVxcdTBDMTBdfFtcXHUwQzEyLVxcdTBDMjhdfFtcXHUwQzJBLVxcdTBDMzNdfFtcXHUwQzM1LVxcdTBDMzldfFtcXHUwQzYwLVxcdTBDNjFdfFtcXHUwQzg1LVxcdTBDOENdfFtcXHUwQzhFLVxcdTBDOTBdfFtcXHUwQzkyLVxcdTBDQThdfFtcXHUwQ0FBLVxcdTBDQjNdfFtcXHUwQ0I1LVxcdTBDQjldfFtcXHUwQ0RFLVxcdTBDREVdfFtcXHUwQ0UwLVxcdTBDRTFdfFtcXHUwRDA1LVxcdTBEMENdfFtcXHUwRDBFLVxcdTBEMTBdfFtcXHUwRDEyLVxcdTBEMjhdfFtcXHUwRDJBLVxcdTBEMzldfFtcXHUwRDYwLVxcdTBENjFdfFtcXHUwRTAxLVxcdTBFMzBdfFtcXHUwRTMyLVxcdTBFMzNdfFtcXHUwRTQwLVxcdTBFNDVdfFtcXHUwRTgxLVxcdTBFODJdfFtcXHUwRTg0LVxcdTBFODRdfFtcXHUwRTg3LVxcdTBFODhdfFtcXHUwRThBLVxcdTBFOEFdfFtcXHUwRThELVxcdTBFOERdfFtcXHUwRTk0LVxcdTBFOTddfFtcXHUwRTk5LVxcdTBFOUZdfFtcXHUwRUExLVxcdTBFQTNdfFtcXHUwRUE1LVxcdTBFQTVdfFtcXHUwRUE3LVxcdTBFQTddfFtcXHUwRUFBLVxcdTBFQUJdfFtcXHUwRUFELVxcdTBFQjBdfFtcXHUwRUIyLVxcdTBFQjNdfFtcXHUwRUJELVxcdTBFQkRdfFtcXHUwRUMwLVxcdTBFQzRdfFtcXHUwRURDLVxcdTBFRERdfFtcXHUwRjAwLVxcdTBGMDBdfFtcXHUwRjQwLVxcdTBGNDddfFtcXHUwRjQ5LVxcdTBGNjldfFtcXHUwRjg4LVxcdTBGOEJdfFtcXHUxMTAwLVxcdTExNTldfFtcXHUxMTVGLVxcdTExQTJdfFtcXHUxMUE4LVxcdTExRjldfFtcXHUyMTM1LVxcdTIxMzhdfFtcXHUzMDA2LVxcdTMwMDZdfFtcXHUzMDQxLVxcdTMwOTRdfFtcXHUzMEExLVxcdTMwRkFdfFtcXHUzMTA1LVxcdTMxMkNdfFtcXHUzMTMxLVxcdTMxOEVdfFtcXHU0RTAwLVxcdTlGQTVdfFtcXHVBQzAwLVxcdUQ3QTNdfFtcXHVGOTAwLVxcdUZBMkRdfFtcXHVGQjFGLVxcdUZCMjhdfFtcXHVGQjJBLVxcdUZCMzZdfFtcXHVGQjM4LVxcdUZCM0NdfFtcXHVGQjNFLVxcdUZCM0VdfFtcXHVGQjQwLVxcdUZCNDFdfFtcXHVGQjQzLVxcdUZCNDRdfFtcXHVGQjQ2LVxcdUZCQjFdfFtcXHVGQkQzLVxcdUZEM0RdfFtcXHVGRDUwLVxcdUZEOEZdfFtcXHVGRDkyLVxcdUZEQzddfFtcXHVGREYwLVxcdUZERkJdfFtcXHVGRTcwLVxcdUZFNzJdfFtcXHVGRTc0LVxcdUZFNzRdfFtcXHVGRTc2LVxcdUZFRkNdfFtcXHVGRjY2LVxcdUZGNkZdfFtcXHVGRjcxLVxcdUZGOURdfFtcXHVGRkEwLVxcdUZGQkVdfFtcXHVGRkMyLVxcdUZGQzddfFtcXHVGRkNBLVxcdUZGQ0ZdfFtcXHVGRkQyLVxcdUZGRDddfFtcXHVGRkRBLVxcdUZGRENdLyxcblxuICAvLyBOdW1iZXJzXG4gIE5sOiAvW1xcdTIxNjAtXFx1MjE4Ml18W1xcdTMwMDctXFx1MzAwN118W1xcdTMwMjEtXFx1MzAyOV0vLFxuICBOZDogL1tcXHUwMDMwLVxcdTAwMzldfFtcXHUwNjYwLVxcdTA2NjldfFtcXHUwNkYwLVxcdTA2RjldfFtcXHUwOTY2LVxcdTA5NkZdfFtcXHUwOUU2LVxcdTA5RUZdfFtcXHUwQTY2LVxcdTBBNkZdfFtcXHUwQUU2LVxcdTBBRUZdfFtcXHUwQjY2LVxcdTBCNkZdfFtcXHUwQkU3LVxcdTBCRUZdfFtcXHUwQzY2LVxcdTBDNkZdfFtcXHUwQ0U2LVxcdTBDRUZdfFtcXHUwRDY2LVxcdTBENkZdfFtcXHUwRTUwLVxcdTBFNTldfFtcXHUwRUQwLVxcdTBFRDldfFtcXHUwRjIwLVxcdTBGMjldfFtcXHVGRjEwLVxcdUZGMTldLyxcblxuICAvLyBNYXJrc1xuICBNbjogL1tcXHUwMzAwLVxcdTAzNDVdfFtcXHUwMzYwLVxcdTAzNjFdfFtcXHUwNDgzLVxcdTA0ODZdfFtcXHUwNTkxLVxcdTA1QTFdfFtcXHUwNUEzLVxcdTA1QjldfFtcXHUwNUJCLVxcdTA1QkRdfFtcXHUwNUJGLVxcdTA1QkZdfFtcXHUwNUMxLVxcdTA1QzJdfFtcXHUwNUM0LVxcdTA1QzRdfFtcXHUwNjRCLVxcdTA2NTJdfFtcXHUwNjcwLVxcdTA2NzBdfFtcXHUwNkQ2LVxcdTA2RENdfFtcXHUwNkRGLVxcdTA2RTRdfFtcXHUwNkU3LVxcdTA2RThdfFtcXHUwNkVBLVxcdTA2RURdfFtcXHUwOTAxLVxcdTA5MDJdfFtcXHUwOTNDLVxcdTA5M0NdfFtcXHUwOTQxLVxcdTA5NDhdfFtcXHUwOTRELVxcdTA5NERdfFtcXHUwOTUxLVxcdTA5NTRdfFtcXHUwOTYyLVxcdTA5NjNdfFtcXHUwOTgxLVxcdTA5ODFdfFtcXHUwOUJDLVxcdTA5QkNdfFtcXHUwOUMxLVxcdTA5QzRdfFtcXHUwOUNELVxcdTA5Q0RdfFtcXHUwOUUyLVxcdTA5RTNdfFtcXHUwQTAyLVxcdTBBMDJdfFtcXHUwQTNDLVxcdTBBM0NdfFtcXHUwQTQxLVxcdTBBNDJdfFtcXHUwQTQ3LVxcdTBBNDhdfFtcXHUwQTRCLVxcdTBBNERdfFtcXHUwQTcwLVxcdTBBNzFdfFtcXHUwQTgxLVxcdTBBODJdfFtcXHUwQUJDLVxcdTBBQkNdfFtcXHUwQUMxLVxcdTBBQzVdfFtcXHUwQUM3LVxcdTBBQzhdfFtcXHUwQUNELVxcdTBBQ0RdfFtcXHUwQjAxLVxcdTBCMDFdfFtcXHUwQjNDLVxcdTBCM0NdfFtcXHUwQjNGLVxcdTBCM0ZdfFtcXHUwQjQxLVxcdTBCNDNdfFtcXHUwQjRELVxcdTBCNERdfFtcXHUwQjU2LVxcdTBCNTZdfFtcXHUwQjgyLVxcdTBCODJdfFtcXHUwQkMwLVxcdTBCQzBdfFtcXHUwQkNELVxcdTBCQ0RdfFtcXHUwQzNFLVxcdTBDNDBdfFtcXHUwQzQ2LVxcdTBDNDhdfFtcXHUwQzRBLVxcdTBDNERdfFtcXHUwQzU1LVxcdTBDNTZdfFtcXHUwQ0JGLVxcdTBDQkZdfFtcXHUwQ0M2LVxcdTBDQzZdfFtcXHUwQ0NDLVxcdTBDQ0RdfFtcXHUwRDQxLVxcdTBENDNdfFtcXHUwRDRELVxcdTBENERdfFtcXHUwRTMxLVxcdTBFMzFdfFtcXHUwRTM0LVxcdTBFM0FdfFtcXHUwRTQ3LVxcdTBFNEVdfFtcXHUwRUIxLVxcdTBFQjFdfFtcXHUwRUI0LVxcdTBFQjldfFtcXHUwRUJCLVxcdTBFQkNdfFtcXHUwRUM4LVxcdTBFQ0RdfFtcXHUwRjE4LVxcdTBGMTldfFtcXHUwRjM1LVxcdTBGMzVdfFtcXHUwRjM3LVxcdTBGMzddfFtcXHUwRjM5LVxcdTBGMzldfFtcXHUwRjcxLVxcdTBGN0VdfFtcXHUwRjgwLVxcdTBGODRdfFtcXHUwRjg2LVxcdTBGODddfFtcXHUwRjkwLVxcdTBGOTVdfFtcXHUwRjk3LVxcdTBGOTddfFtcXHUwRjk5LVxcdTBGQURdfFtcXHUwRkIxLVxcdTBGQjddfFtcXHUwRkI5LVxcdTBGQjldfFtcXHUyMEQwLVxcdTIwRENdfFtcXHUyMEUxLVxcdTIwRTFdfFtcXHUzMDJBLVxcdTMwMkZdfFtcXHUzMDk5LVxcdTMwOUFdfFtcXHVGQjFFLVxcdUZCMUVdfFtcXHVGRTIwLVxcdUZFMjNdLyxcbiAgTWM6IC9bXFx1MDkwMy1cXHUwOTAzXXxbXFx1MDkzRS1cXHUwOTQwXXxbXFx1MDk0OS1cXHUwOTRDXXxbXFx1MDk4Mi1cXHUwOTgzXXxbXFx1MDlCRS1cXHUwOUMwXXxbXFx1MDlDNy1cXHUwOUM4XXxbXFx1MDlDQi1cXHUwOUNDXXxbXFx1MDlENy1cXHUwOUQ3XXxbXFx1MEEzRS1cXHUwQTQwXXxbXFx1MEE4My1cXHUwQTgzXXxbXFx1MEFCRS1cXHUwQUMwXXxbXFx1MEFDOS1cXHUwQUM5XXxbXFx1MEFDQi1cXHUwQUNDXXxbXFx1MEIwMi1cXHUwQjAzXXxbXFx1MEIzRS1cXHUwQjNFXXxbXFx1MEI0MC1cXHUwQjQwXXxbXFx1MEI0Ny1cXHUwQjQ4XXxbXFx1MEI0Qi1cXHUwQjRDXXxbXFx1MEI1Ny1cXHUwQjU3XXxbXFx1MEI4My1cXHUwQjgzXXxbXFx1MEJCRS1cXHUwQkJGXXxbXFx1MEJDMS1cXHUwQkMyXXxbXFx1MEJDNi1cXHUwQkM4XXxbXFx1MEJDQS1cXHUwQkNDXXxbXFx1MEJENy1cXHUwQkQ3XXxbXFx1MEMwMS1cXHUwQzAzXXxbXFx1MEM0MS1cXHUwQzQ0XXxbXFx1MEM4Mi1cXHUwQzgzXXxbXFx1MENCRS1cXHUwQ0JFXXxbXFx1MENDMC1cXHUwQ0M0XXxbXFx1MENDNy1cXHUwQ0M4XXxbXFx1MENDQS1cXHUwQ0NCXXxbXFx1MENENS1cXHUwQ0Q2XXxbXFx1MEQwMi1cXHUwRDAzXXxbXFx1MEQzRS1cXHUwRDQwXXxbXFx1MEQ0Ni1cXHUwRDQ4XXxbXFx1MEQ0QS1cXHUwRDRDXXxbXFx1MEQ1Ny1cXHUwRDU3XXxbXFx1MEYzRS1cXHUwRjNGXXxbXFx1MEY3Ri1cXHUwRjdGXS8sXG5cbiAgLy8gUHVuY3R1YXRpb24sIENvbm5lY3RvclxuICBQYzogL1tcXHUwMDVGLVxcdTAwNUZdfFtcXHUyMDNGLVxcdTIwNDBdfFtcXHUzMEZCLVxcdTMwRkJdfFtcXHVGRTMzLVxcdUZFMzRdfFtcXHVGRTRELVxcdUZFNEZdfFtcXHVGRjNGLVxcdUZGM0ZdfFtcXHVGRjY1LVxcdUZGNjVdLyxcblxuICAvLyBTZXBhcmF0b3IsIFNwYWNlXG4gIFpzOiAvW1xcdTIwMDAtXFx1MjAwQl18W1xcdTMwMDAtXFx1MzAwMF0vLFxuXG4gIC8vIFRoZXNlIHR3byBhcmUgbm90IHJlYWwgVW5pY29kZSBjYXRlZ29yaWVzLCBidXQgb3VyIHVzZWZ1bCBmb3IgT2htLlxuICAvLyBMIGlzIGEgY29tYmluYXRpb24gb2YgYWxsIHRoZSBsZXR0ZXIgY2F0ZWdvcmllcy5cbiAgLy8gTHRtbyBpcyBhIGNvbWJpbmF0aW9uIG9mIEx0LCBMbSwgYW5kIExvLlxuICBMOiAvW1xcdTAwNDEtXFx1MDA1QV18W1xcdTAwQzAtXFx1MDBENl18W1xcdTAwRDgtXFx1MDBERV18W1xcdTAxMDAtXFx1MDEwMF18W1xcdTAxMDItXFx1MDEwMl18W1xcdTAxMDQtXFx1MDEwNF18W1xcdTAxMDYtXFx1MDEwNl18W1xcdTAxMDgtXFx1MDEwOF18W1xcdTAxMEEtXFx1MDEwQV18W1xcdTAxMEMtXFx1MDEwQ118W1xcdTAxMEUtXFx1MDEwRV18W1xcdTAxMTAtXFx1MDExMF18W1xcdTAxMTItXFx1MDExMl18W1xcdTAxMTQtXFx1MDExNF18W1xcdTAxMTYtXFx1MDExNl18W1xcdTAxMTgtXFx1MDExOF18W1xcdTAxMUEtXFx1MDExQV18W1xcdTAxMUMtXFx1MDExQ118W1xcdTAxMUUtXFx1MDExRV18W1xcdTAxMjAtXFx1MDEyMF18W1xcdTAxMjItXFx1MDEyMl18W1xcdTAxMjQtXFx1MDEyNF18W1xcdTAxMjYtXFx1MDEyNl18W1xcdTAxMjgtXFx1MDEyOF18W1xcdTAxMkEtXFx1MDEyQV18W1xcdTAxMkMtXFx1MDEyQ118W1xcdTAxMkUtXFx1MDEyRV18W1xcdTAxMzAtXFx1MDEzMF18W1xcdTAxMzItXFx1MDEzMl18W1xcdTAxMzQtXFx1MDEzNF18W1xcdTAxMzYtXFx1MDEzNl18W1xcdTAxMzktXFx1MDEzOV18W1xcdTAxM0ItXFx1MDEzQl18W1xcdTAxM0QtXFx1MDEzRF18W1xcdTAxM0YtXFx1MDEzRl18W1xcdTAxNDEtXFx1MDE0MV18W1xcdTAxNDMtXFx1MDE0M118W1xcdTAxNDUtXFx1MDE0NV18W1xcdTAxNDctXFx1MDE0N118W1xcdTAxNEEtXFx1MDE0QV18W1xcdTAxNEMtXFx1MDE0Q118W1xcdTAxNEUtXFx1MDE0RV18W1xcdTAxNTAtXFx1MDE1MF18W1xcdTAxNTItXFx1MDE1Ml18W1xcdTAxNTQtXFx1MDE1NF18W1xcdTAxNTYtXFx1MDE1Nl18W1xcdTAxNTgtXFx1MDE1OF18W1xcdTAxNUEtXFx1MDE1QV18W1xcdTAxNUMtXFx1MDE1Q118W1xcdTAxNUUtXFx1MDE1RV18W1xcdTAxNjAtXFx1MDE2MF18W1xcdTAxNjItXFx1MDE2Ml18W1xcdTAxNjQtXFx1MDE2NF18W1xcdTAxNjYtXFx1MDE2Nl18W1xcdTAxNjgtXFx1MDE2OF18W1xcdTAxNkEtXFx1MDE2QV18W1xcdTAxNkMtXFx1MDE2Q118W1xcdTAxNkUtXFx1MDE2RV18W1xcdTAxNzAtXFx1MDE3MF18W1xcdTAxNzItXFx1MDE3Ml18W1xcdTAxNzQtXFx1MDE3NF18W1xcdTAxNzYtXFx1MDE3Nl18W1xcdTAxNzgtXFx1MDE3OV18W1xcdTAxN0ItXFx1MDE3Ql18W1xcdTAxN0QtXFx1MDE3RF18W1xcdTAxODEtXFx1MDE4Ml18W1xcdTAxODQtXFx1MDE4NF18W1xcdTAxODYtXFx1MDE4N118W1xcdTAxODktXFx1MDE4Ql18W1xcdTAxOEUtXFx1MDE5MV18W1xcdTAxOTMtXFx1MDE5NF18W1xcdTAxOTYtXFx1MDE5OF18W1xcdTAxOUMtXFx1MDE5RF18W1xcdTAxOUYtXFx1MDFBMF18W1xcdTAxQTItXFx1MDFBMl18W1xcdTAxQTQtXFx1MDFBNF18W1xcdTAxQTYtXFx1MDFBN118W1xcdTAxQTktXFx1MDFBOV18W1xcdTAxQUMtXFx1MDFBQ118W1xcdTAxQUUtXFx1MDFBRl18W1xcdTAxQjEtXFx1MDFCM118W1xcdTAxQjUtXFx1MDFCNV18W1xcdTAxQjctXFx1MDFCOF18W1xcdTAxQkMtXFx1MDFCQ118W1xcdTAxQzQtXFx1MDFDNF18W1xcdTAxQzctXFx1MDFDN118W1xcdTAxQ0EtXFx1MDFDQV18W1xcdTAxQ0QtXFx1MDFDRF18W1xcdTAxQ0YtXFx1MDFDRl18W1xcdTAxRDEtXFx1MDFEMV18W1xcdTAxRDMtXFx1MDFEM118W1xcdTAxRDUtXFx1MDFENV18W1xcdTAxRDctXFx1MDFEN118W1xcdTAxRDktXFx1MDFEOV18W1xcdTAxREItXFx1MDFEQl18W1xcdTAxREUtXFx1MDFERV18W1xcdTAxRTAtXFx1MDFFMF18W1xcdTAxRTItXFx1MDFFMl18W1xcdTAxRTQtXFx1MDFFNF18W1xcdTAxRTYtXFx1MDFFNl18W1xcdTAxRTgtXFx1MDFFOF18W1xcdTAxRUEtXFx1MDFFQV18W1xcdTAxRUMtXFx1MDFFQ118W1xcdTAxRUUtXFx1MDFFRV18W1xcdTAxRjEtXFx1MDFGMV18W1xcdTAxRjQtXFx1MDFGNF18W1xcdTAxRkEtXFx1MDFGQV18W1xcdTAxRkMtXFx1MDFGQ118W1xcdTAxRkUtXFx1MDFGRV18W1xcdTAyMDAtXFx1MDIwMF18W1xcdTAyMDItXFx1MDIwMl18W1xcdTAyMDQtXFx1MDIwNF18W1xcdTAyMDYtXFx1MDIwNl18W1xcdTAyMDgtXFx1MDIwOF18W1xcdTAyMEEtXFx1MDIwQV18W1xcdTAyMEMtXFx1MDIwQ118W1xcdTAyMEUtXFx1MDIwRV18W1xcdTAyMTAtXFx1MDIxMF18W1xcdTAyMTItXFx1MDIxMl18W1xcdTAyMTQtXFx1MDIxNF18W1xcdTAyMTYtXFx1MDIxNl18W1xcdTAzODYtXFx1MDM4Nl18W1xcdTAzODgtXFx1MDM4QV18W1xcdTAzOEMtXFx1MDM4Q118W1xcdTAzOEUtXFx1MDM4Rl18W1xcdTAzOTEtXFx1MDNBMV18W1xcdTAzQTMtXFx1MDNBQl18W1xcdTAzRDItXFx1MDNENF18W1xcdTAzREEtXFx1MDNEQV18W1xcdTAzREMtXFx1MDNEQ118W1xcdTAzREUtXFx1MDNERV18W1xcdTAzRTAtXFx1MDNFMF18W1xcdTAzRTItXFx1MDNFMl18W1xcdTAzRTQtXFx1MDNFNF18W1xcdTAzRTYtXFx1MDNFNl18W1xcdTAzRTgtXFx1MDNFOF18W1xcdTAzRUEtXFx1MDNFQV18W1xcdTAzRUMtXFx1MDNFQ118W1xcdTAzRUUtXFx1MDNFRV18W1xcdTA0MDEtXFx1MDQwQ118W1xcdTA0MEUtXFx1MDQyRl18W1xcdTA0NjAtXFx1MDQ2MF18W1xcdTA0NjItXFx1MDQ2Ml18W1xcdTA0NjQtXFx1MDQ2NF18W1xcdTA0NjYtXFx1MDQ2Nl18W1xcdTA0NjgtXFx1MDQ2OF18W1xcdTA0NkEtXFx1MDQ2QV18W1xcdTA0NkMtXFx1MDQ2Q118W1xcdTA0NkUtXFx1MDQ2RV18W1xcdTA0NzAtXFx1MDQ3MF18W1xcdTA0NzItXFx1MDQ3Ml18W1xcdTA0NzQtXFx1MDQ3NF18W1xcdTA0NzYtXFx1MDQ3Nl18W1xcdTA0NzgtXFx1MDQ3OF18W1xcdTA0N0EtXFx1MDQ3QV18W1xcdTA0N0MtXFx1MDQ3Q118W1xcdTA0N0UtXFx1MDQ3RV18W1xcdTA0ODAtXFx1MDQ4MF18W1xcdTA0OTAtXFx1MDQ5MF18W1xcdTA0OTItXFx1MDQ5Ml18W1xcdTA0OTQtXFx1MDQ5NF18W1xcdTA0OTYtXFx1MDQ5Nl18W1xcdTA0OTgtXFx1MDQ5OF18W1xcdTA0OUEtXFx1MDQ5QV18W1xcdTA0OUMtXFx1MDQ5Q118W1xcdTA0OUUtXFx1MDQ5RV18W1xcdTA0QTAtXFx1MDRBMF18W1xcdTA0QTItXFx1MDRBMl18W1xcdTA0QTQtXFx1MDRBNF18W1xcdTA0QTYtXFx1MDRBNl18W1xcdTA0QTgtXFx1MDRBOF18W1xcdTA0QUEtXFx1MDRBQV18W1xcdTA0QUMtXFx1MDRBQ118W1xcdTA0QUUtXFx1MDRBRV18W1xcdTA0QjAtXFx1MDRCMF18W1xcdTA0QjItXFx1MDRCMl18W1xcdTA0QjQtXFx1MDRCNF18W1xcdTA0QjYtXFx1MDRCNl18W1xcdTA0QjgtXFx1MDRCOF18W1xcdTA0QkEtXFx1MDRCQV18W1xcdTA0QkMtXFx1MDRCQ118W1xcdTA0QkUtXFx1MDRCRV18W1xcdTA0QzEtXFx1MDRDMV18W1xcdTA0QzMtXFx1MDRDM118W1xcdTA0QzctXFx1MDRDN118W1xcdTA0Q0ItXFx1MDRDQl18W1xcdTA0RDAtXFx1MDREMF18W1xcdTA0RDItXFx1MDREMl18W1xcdTA0RDQtXFx1MDRENF18W1xcdTA0RDYtXFx1MDRENl18W1xcdTA0RDgtXFx1MDREOF18W1xcdTA0REEtXFx1MDREQV18W1xcdTA0REMtXFx1MDREQ118W1xcdTA0REUtXFx1MDRERV18W1xcdTA0RTAtXFx1MDRFMF18W1xcdTA0RTItXFx1MDRFMl18W1xcdTA0RTQtXFx1MDRFNF18W1xcdTA0RTYtXFx1MDRFNl18W1xcdTA0RTgtXFx1MDRFOF18W1xcdTA0RUEtXFx1MDRFQV18W1xcdTA0RUUtXFx1MDRFRV18W1xcdTA0RjAtXFx1MDRGMF18W1xcdTA0RjItXFx1MDRGMl18W1xcdTA0RjQtXFx1MDRGNF18W1xcdTA0RjgtXFx1MDRGOF18W1xcdTA1MzEtXFx1MDU1Nl18W1xcdTEwQTAtXFx1MTBDNV18W1xcdTFFMDAtXFx1MUUwMF18W1xcdTFFMDItXFx1MUUwMl18W1xcdTFFMDQtXFx1MUUwNF18W1xcdTFFMDYtXFx1MUUwNl18W1xcdTFFMDgtXFx1MUUwOF18W1xcdTFFMEEtXFx1MUUwQV18W1xcdTFFMEMtXFx1MUUwQ118W1xcdTFFMEUtXFx1MUUwRV18W1xcdTFFMTAtXFx1MUUxMF18W1xcdTFFMTItXFx1MUUxMl18W1xcdTFFMTQtXFx1MUUxNF18W1xcdTFFMTYtXFx1MUUxNl18W1xcdTFFMTgtXFx1MUUxOF18W1xcdTFFMUEtXFx1MUUxQV18W1xcdTFFMUMtXFx1MUUxQ118W1xcdTFFMUUtXFx1MUUxRV18W1xcdTFFMjAtXFx1MUUyMF18W1xcdTFFMjItXFx1MUUyMl18W1xcdTFFMjQtXFx1MUUyNF18W1xcdTFFMjYtXFx1MUUyNl18W1xcdTFFMjgtXFx1MUUyOF18W1xcdTFFMkEtXFx1MUUyQV18W1xcdTFFMkMtXFx1MUUyQ118W1xcdTFFMkUtXFx1MUUyRV18W1xcdTFFMzAtXFx1MUUzMF18W1xcdTFFMzItXFx1MUUzMl18W1xcdTFFMzQtXFx1MUUzNF18W1xcdTFFMzYtXFx1MUUzNl18W1xcdTFFMzgtXFx1MUUzOF18W1xcdTFFM0EtXFx1MUUzQV18W1xcdTFFM0MtXFx1MUUzQ118W1xcdTFFM0UtXFx1MUUzRV18W1xcdTFFNDAtXFx1MUU0MF18W1xcdTFFNDItXFx1MUU0Ml18W1xcdTFFNDQtXFx1MUU0NF18W1xcdTFFNDYtXFx1MUU0Nl18W1xcdTFFNDgtXFx1MUU0OF18W1xcdTFFNEEtXFx1MUU0QV18W1xcdTFFNEMtXFx1MUU0Q118W1xcdTFFNEUtXFx1MUU0RV18W1xcdTFFNTAtXFx1MUU1MF18W1xcdTFFNTItXFx1MUU1Ml18W1xcdTFFNTQtXFx1MUU1NF18W1xcdTFFNTYtXFx1MUU1Nl18W1xcdTFFNTgtXFx1MUU1OF18W1xcdTFFNUEtXFx1MUU1QV18W1xcdTFFNUMtXFx1MUU1Q118W1xcdTFFNUUtXFx1MUU1RV18W1xcdTFFNjAtXFx1MUU2MF18W1xcdTFFNjItXFx1MUU2Ml18W1xcdTFFNjQtXFx1MUU2NF18W1xcdTFFNjYtXFx1MUU2Nl18W1xcdTFFNjgtXFx1MUU2OF18W1xcdTFFNkEtXFx1MUU2QV18W1xcdTFFNkMtXFx1MUU2Q118W1xcdTFFNkUtXFx1MUU2RV18W1xcdTFFNzAtXFx1MUU3MF18W1xcdTFFNzItXFx1MUU3Ml18W1xcdTFFNzQtXFx1MUU3NF18W1xcdTFFNzYtXFx1MUU3Nl18W1xcdTFFNzgtXFx1MUU3OF18W1xcdTFFN0EtXFx1MUU3QV18W1xcdTFFN0MtXFx1MUU3Q118W1xcdTFFN0UtXFx1MUU3RV18W1xcdTFFODAtXFx1MUU4MF18W1xcdTFFODItXFx1MUU4Ml18W1xcdTFFODQtXFx1MUU4NF18W1xcdTFFODYtXFx1MUU4Nl18W1xcdTFFODgtXFx1MUU4OF18W1xcdTFFOEEtXFx1MUU4QV18W1xcdTFFOEMtXFx1MUU4Q118W1xcdTFFOEUtXFx1MUU4RV18W1xcdTFFOTAtXFx1MUU5MF18W1xcdTFFOTItXFx1MUU5Ml18W1xcdTFFOTQtXFx1MUU5NF18W1xcdTFFQTAtXFx1MUVBMF18W1xcdTFFQTItXFx1MUVBMl18W1xcdTFFQTQtXFx1MUVBNF18W1xcdTFFQTYtXFx1MUVBNl18W1xcdTFFQTgtXFx1MUVBOF18W1xcdTFFQUEtXFx1MUVBQV18W1xcdTFFQUMtXFx1MUVBQ118W1xcdTFFQUUtXFx1MUVBRV18W1xcdTFFQjAtXFx1MUVCMF18W1xcdTFFQjItXFx1MUVCMl18W1xcdTFFQjQtXFx1MUVCNF18W1xcdTFFQjYtXFx1MUVCNl18W1xcdTFFQjgtXFx1MUVCOF18W1xcdTFFQkEtXFx1MUVCQV18W1xcdTFFQkMtXFx1MUVCQ118W1xcdTFFQkUtXFx1MUVCRV18W1xcdTFFQzAtXFx1MUVDMF18W1xcdTFFQzItXFx1MUVDMl18W1xcdTFFQzQtXFx1MUVDNF18W1xcdTFFQzYtXFx1MUVDNl18W1xcdTFFQzgtXFx1MUVDOF18W1xcdTFFQ0EtXFx1MUVDQV18W1xcdTFFQ0MtXFx1MUVDQ118W1xcdTFFQ0UtXFx1MUVDRV18W1xcdTFFRDAtXFx1MUVEMF18W1xcdTFFRDItXFx1MUVEMl18W1xcdTFFRDQtXFx1MUVENF18W1xcdTFFRDYtXFx1MUVENl18W1xcdTFFRDgtXFx1MUVEOF18W1xcdTFFREEtXFx1MUVEQV18W1xcdTFFREMtXFx1MUVEQ118W1xcdTFFREUtXFx1MUVERV18W1xcdTFFRTAtXFx1MUVFMF18W1xcdTFFRTItXFx1MUVFMl18W1xcdTFFRTQtXFx1MUVFNF18W1xcdTFFRTYtXFx1MUVFNl18W1xcdTFFRTgtXFx1MUVFOF18W1xcdTFFRUEtXFx1MUVFQV18W1xcdTFFRUMtXFx1MUVFQ118W1xcdTFFRUUtXFx1MUVFRV18W1xcdTFFRjAtXFx1MUVGMF18W1xcdTFFRjItXFx1MUVGMl18W1xcdTFFRjQtXFx1MUVGNF18W1xcdTFFRjYtXFx1MUVGNl18W1xcdTFFRjgtXFx1MUVGOF18W1xcdTFGMDgtXFx1MUYwRl18W1xcdTFGMTgtXFx1MUYxRF18W1xcdTFGMjgtXFx1MUYyRl18W1xcdTFGMzgtXFx1MUYzRl18W1xcdTFGNDgtXFx1MUY0RF18W1xcdTFGNTktXFx1MUY1OV18W1xcdTFGNUItXFx1MUY1Ql18W1xcdTFGNUQtXFx1MUY1RF18W1xcdTFGNUYtXFx1MUY1Rl18W1xcdTFGNjgtXFx1MUY2Rl18W1xcdTFGODgtXFx1MUY4Rl18W1xcdTFGOTgtXFx1MUY5Rl18W1xcdTFGQTgtXFx1MUZBRl18W1xcdTFGQjgtXFx1MUZCQ118W1xcdTFGQzgtXFx1MUZDQ118W1xcdTFGRDgtXFx1MUZEQl18W1xcdTFGRTgtXFx1MUZFQ118W1xcdTFGRjgtXFx1MUZGQ118W1xcdTIxMDItXFx1MjEwMl18W1xcdTIxMDctXFx1MjEwN118W1xcdTIxMEItXFx1MjEwRF18W1xcdTIxMTAtXFx1MjExMl18W1xcdTIxMTUtXFx1MjExNV18W1xcdTIxMTktXFx1MjExRF18W1xcdTIxMjQtXFx1MjEyNF18W1xcdTIxMjYtXFx1MjEyNl18W1xcdTIxMjgtXFx1MjEyOF18W1xcdTIxMkEtXFx1MjEyRF18W1xcdTIxMzAtXFx1MjEzMV18W1xcdTIxMzMtXFx1MjEzM118W1xcdUZGMjEtXFx1RkYzQV18W1xcdTAwNjEtXFx1MDA3QV18W1xcdTAwQUEtXFx1MDBBQV18W1xcdTAwQjUtXFx1MDBCNV18W1xcdTAwQkEtXFx1MDBCQV18W1xcdTAwREYtXFx1MDBGNl18W1xcdTAwRjgtXFx1MDBGRl18W1xcdTAxMDEtXFx1MDEwMV18W1xcdTAxMDMtXFx1MDEwM118W1xcdTAxMDUtXFx1MDEwNV18W1xcdTAxMDctXFx1MDEwN118W1xcdTAxMDktXFx1MDEwOV18W1xcdTAxMEItXFx1MDEwQl18W1xcdTAxMEQtXFx1MDEwRF18W1xcdTAxMEYtXFx1MDEwRl18W1xcdTAxMTEtXFx1MDExMV18W1xcdTAxMTMtXFx1MDExM118W1xcdTAxMTUtXFx1MDExNV18W1xcdTAxMTctXFx1MDExN118W1xcdTAxMTktXFx1MDExOV18W1xcdTAxMUItXFx1MDExQl18W1xcdTAxMUQtXFx1MDExRF18W1xcdTAxMUYtXFx1MDExRl18W1xcdTAxMjEtXFx1MDEyMV18W1xcdTAxMjMtXFx1MDEyM118W1xcdTAxMjUtXFx1MDEyNV18W1xcdTAxMjctXFx1MDEyN118W1xcdTAxMjktXFx1MDEyOV18W1xcdTAxMkItXFx1MDEyQl18W1xcdTAxMkQtXFx1MDEyRF18W1xcdTAxMkYtXFx1MDEyRl18W1xcdTAxMzEtXFx1MDEzMV18W1xcdTAxMzMtXFx1MDEzM118W1xcdTAxMzUtXFx1MDEzNV18W1xcdTAxMzctXFx1MDEzOF18W1xcdTAxM0EtXFx1MDEzQV18W1xcdTAxM0MtXFx1MDEzQ118W1xcdTAxM0UtXFx1MDEzRV18W1xcdTAxNDAtXFx1MDE0MF18W1xcdTAxNDItXFx1MDE0Ml18W1xcdTAxNDQtXFx1MDE0NF18W1xcdTAxNDYtXFx1MDE0Nl18W1xcdTAxNDgtXFx1MDE0OV18W1xcdTAxNEItXFx1MDE0Ql18W1xcdTAxNEQtXFx1MDE0RF18W1xcdTAxNEYtXFx1MDE0Rl18W1xcdTAxNTEtXFx1MDE1MV18W1xcdTAxNTMtXFx1MDE1M118W1xcdTAxNTUtXFx1MDE1NV18W1xcdTAxNTctXFx1MDE1N118W1xcdTAxNTktXFx1MDE1OV18W1xcdTAxNUItXFx1MDE1Ql18W1xcdTAxNUQtXFx1MDE1RF18W1xcdTAxNUYtXFx1MDE1Rl18W1xcdTAxNjEtXFx1MDE2MV18W1xcdTAxNjMtXFx1MDE2M118W1xcdTAxNjUtXFx1MDE2NV18W1xcdTAxNjctXFx1MDE2N118W1xcdTAxNjktXFx1MDE2OV18W1xcdTAxNkItXFx1MDE2Ql18W1xcdTAxNkQtXFx1MDE2RF18W1xcdTAxNkYtXFx1MDE2Rl18W1xcdTAxNzEtXFx1MDE3MV18W1xcdTAxNzMtXFx1MDE3M118W1xcdTAxNzUtXFx1MDE3NV18W1xcdTAxNzctXFx1MDE3N118W1xcdTAxN0EtXFx1MDE3QV18W1xcdTAxN0MtXFx1MDE3Q118W1xcdTAxN0UtXFx1MDE4MF18W1xcdTAxODMtXFx1MDE4M118W1xcdTAxODUtXFx1MDE4NV18W1xcdTAxODgtXFx1MDE4OF18W1xcdTAxOEMtXFx1MDE4RF18W1xcdTAxOTItXFx1MDE5Ml18W1xcdTAxOTUtXFx1MDE5NV18W1xcdTAxOTktXFx1MDE5Ql18W1xcdTAxOUUtXFx1MDE5RV18W1xcdTAxQTEtXFx1MDFBMV18W1xcdTAxQTMtXFx1MDFBM118W1xcdTAxQTUtXFx1MDFBNV18W1xcdTAxQTgtXFx1MDFBOF18W1xcdTAxQUItXFx1MDFBQl18W1xcdTAxQUQtXFx1MDFBRF18W1xcdTAxQjAtXFx1MDFCMF18W1xcdTAxQjQtXFx1MDFCNF18W1xcdTAxQjYtXFx1MDFCNl18W1xcdTAxQjktXFx1MDFCQV18W1xcdTAxQkQtXFx1MDFCRF18W1xcdTAxQzYtXFx1MDFDNl18W1xcdTAxQzktXFx1MDFDOV18W1xcdTAxQ0MtXFx1MDFDQ118W1xcdTAxQ0UtXFx1MDFDRV18W1xcdTAxRDAtXFx1MDFEMF18W1xcdTAxRDItXFx1MDFEMl18W1xcdTAxRDQtXFx1MDFENF18W1xcdTAxRDYtXFx1MDFENl18W1xcdTAxRDgtXFx1MDFEOF18W1xcdTAxREEtXFx1MDFEQV18W1xcdTAxREMtXFx1MDFERF18W1xcdTAxREYtXFx1MDFERl18W1xcdTAxRTEtXFx1MDFFMV18W1xcdTAxRTMtXFx1MDFFM118W1xcdTAxRTUtXFx1MDFFNV18W1xcdTAxRTctXFx1MDFFN118W1xcdTAxRTktXFx1MDFFOV18W1xcdTAxRUItXFx1MDFFQl18W1xcdTAxRUQtXFx1MDFFRF18W1xcdTAxRUYtXFx1MDFGMF18W1xcdTAxRjMtXFx1MDFGM118W1xcdTAxRjUtXFx1MDFGNV18W1xcdTAxRkItXFx1MDFGQl18W1xcdTAxRkQtXFx1MDFGRF18W1xcdTAxRkYtXFx1MDFGRl18W1xcdTAyMDEtXFx1MDIwMV18W1xcdTAyMDMtXFx1MDIwM118W1xcdTAyMDUtXFx1MDIwNV18W1xcdTAyMDctXFx1MDIwN118W1xcdTAyMDktXFx1MDIwOV18W1xcdTAyMEItXFx1MDIwQl18W1xcdTAyMEQtXFx1MDIwRF18W1xcdTAyMEYtXFx1MDIwRl18W1xcdTAyMTEtXFx1MDIxMV18W1xcdTAyMTMtXFx1MDIxM118W1xcdTAyMTUtXFx1MDIxNV18W1xcdTAyMTctXFx1MDIxN118W1xcdTAyNTAtXFx1MDJBOF18W1xcdTAzOTAtXFx1MDM5MF18W1xcdTAzQUMtXFx1MDNDRV18W1xcdTAzRDAtXFx1MDNEMV18W1xcdTAzRDUtXFx1MDNENl18W1xcdTAzRTMtXFx1MDNFM118W1xcdTAzRTUtXFx1MDNFNV18W1xcdTAzRTctXFx1MDNFN118W1xcdTAzRTktXFx1MDNFOV18W1xcdTAzRUItXFx1MDNFQl18W1xcdTAzRUQtXFx1MDNFRF18W1xcdTAzRUYtXFx1MDNGMl18W1xcdTA0MzAtXFx1MDQ0Rl18W1xcdTA0NTEtXFx1MDQ1Q118W1xcdTA0NUUtXFx1MDQ1Rl18W1xcdTA0NjEtXFx1MDQ2MV18W1xcdTA0NjMtXFx1MDQ2M118W1xcdTA0NjUtXFx1MDQ2NV18W1xcdTA0NjctXFx1MDQ2N118W1xcdTA0NjktXFx1MDQ2OV18W1xcdTA0NkItXFx1MDQ2Ql18W1xcdTA0NkQtXFx1MDQ2RF18W1xcdTA0NkYtXFx1MDQ2Rl18W1xcdTA0NzEtXFx1MDQ3MV18W1xcdTA0NzMtXFx1MDQ3M118W1xcdTA0NzUtXFx1MDQ3NV18W1xcdTA0NzctXFx1MDQ3N118W1xcdTA0NzktXFx1MDQ3OV18W1xcdTA0N0ItXFx1MDQ3Ql18W1xcdTA0N0QtXFx1MDQ3RF18W1xcdTA0N0YtXFx1MDQ3Rl18W1xcdTA0ODEtXFx1MDQ4MV18W1xcdTA0OTEtXFx1MDQ5MV18W1xcdTA0OTMtXFx1MDQ5M118W1xcdTA0OTUtXFx1MDQ5NV18W1xcdTA0OTctXFx1MDQ5N118W1xcdTA0OTktXFx1MDQ5OV18W1xcdTA0OUItXFx1MDQ5Ql18W1xcdTA0OUQtXFx1MDQ5RF18W1xcdTA0OUYtXFx1MDQ5Rl18W1xcdTA0QTEtXFx1MDRBMV18W1xcdTA0QTMtXFx1MDRBM118W1xcdTA0QTUtXFx1MDRBNV18W1xcdTA0QTctXFx1MDRBN118W1xcdTA0QTktXFx1MDRBOV18W1xcdTA0QUItXFx1MDRBQl18W1xcdTA0QUQtXFx1MDRBRF18W1xcdTA0QUYtXFx1MDRBRl18W1xcdTA0QjEtXFx1MDRCMV18W1xcdTA0QjMtXFx1MDRCM118W1xcdTA0QjUtXFx1MDRCNV18W1xcdTA0QjctXFx1MDRCN118W1xcdTA0QjktXFx1MDRCOV18W1xcdTA0QkItXFx1MDRCQl18W1xcdTA0QkQtXFx1MDRCRF18W1xcdTA0QkYtXFx1MDRCRl18W1xcdTA0QzItXFx1MDRDMl18W1xcdTA0QzQtXFx1MDRDNF18W1xcdTA0QzgtXFx1MDRDOF18W1xcdTA0Q0MtXFx1MDRDQ118W1xcdTA0RDEtXFx1MDREMV18W1xcdTA0RDMtXFx1MDREM118W1xcdTA0RDUtXFx1MDRENV18W1xcdTA0RDctXFx1MDREN118W1xcdTA0RDktXFx1MDREOV18W1xcdTA0REItXFx1MDREQl18W1xcdTA0REQtXFx1MDRERF18W1xcdTA0REYtXFx1MDRERl18W1xcdTA0RTEtXFx1MDRFMV18W1xcdTA0RTMtXFx1MDRFM118W1xcdTA0RTUtXFx1MDRFNV18W1xcdTA0RTctXFx1MDRFN118W1xcdTA0RTktXFx1MDRFOV18W1xcdTA0RUItXFx1MDRFQl18W1xcdTA0RUYtXFx1MDRFRl18W1xcdTA0RjEtXFx1MDRGMV18W1xcdTA0RjMtXFx1MDRGM118W1xcdTA0RjUtXFx1MDRGNV18W1xcdTA0RjktXFx1MDRGOV18W1xcdTA1NjEtXFx1MDU4N118W1xcdTEwRDAtXFx1MTBGNl18W1xcdTFFMDEtXFx1MUUwMV18W1xcdTFFMDMtXFx1MUUwM118W1xcdTFFMDUtXFx1MUUwNV18W1xcdTFFMDctXFx1MUUwN118W1xcdTFFMDktXFx1MUUwOV18W1xcdTFFMEItXFx1MUUwQl18W1xcdTFFMEQtXFx1MUUwRF18W1xcdTFFMEYtXFx1MUUwRl18W1xcdTFFMTEtXFx1MUUxMV18W1xcdTFFMTMtXFx1MUUxM118W1xcdTFFMTUtXFx1MUUxNV18W1xcdTFFMTctXFx1MUUxN118W1xcdTFFMTktXFx1MUUxOV18W1xcdTFFMUItXFx1MUUxQl18W1xcdTFFMUQtXFx1MUUxRF18W1xcdTFFMUYtXFx1MUUxRl18W1xcdTFFMjEtXFx1MUUyMV18W1xcdTFFMjMtXFx1MUUyM118W1xcdTFFMjUtXFx1MUUyNV18W1xcdTFFMjctXFx1MUUyN118W1xcdTFFMjktXFx1MUUyOV18W1xcdTFFMkItXFx1MUUyQl18W1xcdTFFMkQtXFx1MUUyRF18W1xcdTFFMkYtXFx1MUUyRl18W1xcdTFFMzEtXFx1MUUzMV18W1xcdTFFMzMtXFx1MUUzM118W1xcdTFFMzUtXFx1MUUzNV18W1xcdTFFMzctXFx1MUUzN118W1xcdTFFMzktXFx1MUUzOV18W1xcdTFFM0ItXFx1MUUzQl18W1xcdTFFM0QtXFx1MUUzRF18W1xcdTFFM0YtXFx1MUUzRl18W1xcdTFFNDEtXFx1MUU0MV18W1xcdTFFNDMtXFx1MUU0M118W1xcdTFFNDUtXFx1MUU0NV18W1xcdTFFNDctXFx1MUU0N118W1xcdTFFNDktXFx1MUU0OV18W1xcdTFFNEItXFx1MUU0Ql18W1xcdTFFNEQtXFx1MUU0RF18W1xcdTFFNEYtXFx1MUU0Rl18W1xcdTFFNTEtXFx1MUU1MV18W1xcdTFFNTMtXFx1MUU1M118W1xcdTFFNTUtXFx1MUU1NV18W1xcdTFFNTctXFx1MUU1N118W1xcdTFFNTktXFx1MUU1OV18W1xcdTFFNUItXFx1MUU1Ql18W1xcdTFFNUQtXFx1MUU1RF18W1xcdTFFNUYtXFx1MUU1Rl18W1xcdTFFNjEtXFx1MUU2MV18W1xcdTFFNjMtXFx1MUU2M118W1xcdTFFNjUtXFx1MUU2NV18W1xcdTFFNjctXFx1MUU2N118W1xcdTFFNjktXFx1MUU2OV18W1xcdTFFNkItXFx1MUU2Ql18W1xcdTFFNkQtXFx1MUU2RF18W1xcdTFFNkYtXFx1MUU2Rl18W1xcdTFFNzEtXFx1MUU3MV18W1xcdTFFNzMtXFx1MUU3M118W1xcdTFFNzUtXFx1MUU3NV18W1xcdTFFNzctXFx1MUU3N118W1xcdTFFNzktXFx1MUU3OV18W1xcdTFFN0ItXFx1MUU3Ql18W1xcdTFFN0QtXFx1MUU3RF18W1xcdTFFN0YtXFx1MUU3Rl18W1xcdTFFODEtXFx1MUU4MV18W1xcdTFFODMtXFx1MUU4M118W1xcdTFFODUtXFx1MUU4NV18W1xcdTFFODctXFx1MUU4N118W1xcdTFFODktXFx1MUU4OV18W1xcdTFFOEItXFx1MUU4Ql18W1xcdTFFOEQtXFx1MUU4RF18W1xcdTFFOEYtXFx1MUU4Rl18W1xcdTFFOTEtXFx1MUU5MV18W1xcdTFFOTMtXFx1MUU5M118W1xcdTFFOTUtXFx1MUU5Ql18W1xcdTFFQTEtXFx1MUVBMV18W1xcdTFFQTMtXFx1MUVBM118W1xcdTFFQTUtXFx1MUVBNV18W1xcdTFFQTctXFx1MUVBN118W1xcdTFFQTktXFx1MUVBOV18W1xcdTFFQUItXFx1MUVBQl18W1xcdTFFQUQtXFx1MUVBRF18W1xcdTFFQUYtXFx1MUVBRl18W1xcdTFFQjEtXFx1MUVCMV18W1xcdTFFQjMtXFx1MUVCM118W1xcdTFFQjUtXFx1MUVCNV18W1xcdTFFQjctXFx1MUVCN118W1xcdTFFQjktXFx1MUVCOV18W1xcdTFFQkItXFx1MUVCQl18W1xcdTFFQkQtXFx1MUVCRF18W1xcdTFFQkYtXFx1MUVCRl18W1xcdTFFQzEtXFx1MUVDMV18W1xcdTFFQzMtXFx1MUVDM118W1xcdTFFQzUtXFx1MUVDNV18W1xcdTFFQzctXFx1MUVDN118W1xcdTFFQzktXFx1MUVDOV18W1xcdTFFQ0ItXFx1MUVDQl18W1xcdTFFQ0QtXFx1MUVDRF18W1xcdTFFQ0YtXFx1MUVDRl18W1xcdTFFRDEtXFx1MUVEMV18W1xcdTFFRDMtXFx1MUVEM118W1xcdTFFRDUtXFx1MUVENV18W1xcdTFFRDctXFx1MUVEN118W1xcdTFFRDktXFx1MUVEOV18W1xcdTFFREItXFx1MUVEQl18W1xcdTFFREQtXFx1MUVERF18W1xcdTFFREYtXFx1MUVERl18W1xcdTFFRTEtXFx1MUVFMV18W1xcdTFFRTMtXFx1MUVFM118W1xcdTFFRTUtXFx1MUVFNV18W1xcdTFFRTctXFx1MUVFN118W1xcdTFFRTktXFx1MUVFOV18W1xcdTFFRUItXFx1MUVFQl18W1xcdTFFRUQtXFx1MUVFRF18W1xcdTFFRUYtXFx1MUVFRl18W1xcdTFFRjEtXFx1MUVGMV18W1xcdTFFRjMtXFx1MUVGM118W1xcdTFFRjUtXFx1MUVGNV18W1xcdTFFRjctXFx1MUVGN118W1xcdTFFRjktXFx1MUVGOV18W1xcdTFGMDAtXFx1MUYwN118W1xcdTFGMTAtXFx1MUYxNV18W1xcdTFGMjAtXFx1MUYyN118W1xcdTFGMzAtXFx1MUYzN118W1xcdTFGNDAtXFx1MUY0NV18W1xcdTFGNTAtXFx1MUY1N118W1xcdTFGNjAtXFx1MUY2N118W1xcdTFGNzAtXFx1MUY3RF18W1xcdTFGODAtXFx1MUY4N118W1xcdTFGOTAtXFx1MUY5N118W1xcdTFGQTAtXFx1MUZBN118W1xcdTFGQjAtXFx1MUZCNF18W1xcdTFGQjYtXFx1MUZCN118W1xcdTFGQkUtXFx1MUZCRV18W1xcdTFGQzItXFx1MUZDNF18W1xcdTFGQzYtXFx1MUZDN118W1xcdTFGRDAtXFx1MUZEM118W1xcdTFGRDYtXFx1MUZEN118W1xcdTFGRTAtXFx1MUZFN118W1xcdTFGRjItXFx1MUZGNF18W1xcdTFGRjYtXFx1MUZGN118W1xcdTIwN0YtXFx1MjA3Rl18W1xcdTIxMEEtXFx1MjEwQV18W1xcdTIxMEUtXFx1MjEwRl18W1xcdTIxMTMtXFx1MjExM118W1xcdTIxMTgtXFx1MjExOF18W1xcdTIxMkUtXFx1MjEyRl18W1xcdTIxMzQtXFx1MjEzNF18W1xcdUZCMDAtXFx1RkIwNl18W1xcdUZCMTMtXFx1RkIxN118W1xcdUZGNDEtXFx1RkY1QV18W1xcdTAxQzUtXFx1MDFDNV18W1xcdTAxQzgtXFx1MDFDOF18W1xcdTAxQ0ItXFx1MDFDQl18W1xcdTAxRjItXFx1MDFGMl18W1xcdTAyQjAtXFx1MDJCOF18W1xcdTAyQkItXFx1MDJDMV18W1xcdTAyRDAtXFx1MDJEMV18W1xcdTAyRTAtXFx1MDJFNF18W1xcdTAzN0EtXFx1MDM3QV18W1xcdTA1NTktXFx1MDU1OV18W1xcdTA2NDAtXFx1MDY0MF18W1xcdTA2RTUtXFx1MDZFNl18W1xcdTBFNDYtXFx1MEU0Nl18W1xcdTBFQzYtXFx1MEVDNl18W1xcdTMwMDUtXFx1MzAwNV18W1xcdTMwMzEtXFx1MzAzNV18W1xcdTMwOUQtXFx1MzA5RV18W1xcdTMwRkMtXFx1MzBGRV18W1xcdUZGNzAtXFx1RkY3MF18W1xcdUZGOUUtXFx1RkY5Rl18W1xcdTAxQUEtXFx1MDFBQV18W1xcdTAxQkItXFx1MDFCQl18W1xcdTAxQkUtXFx1MDFDM118W1xcdTAzRjMtXFx1MDNGM118W1xcdTA0QzAtXFx1MDRDMF18W1xcdTA1RDAtXFx1MDVFQV18W1xcdTA1RjAtXFx1MDVGMl18W1xcdTA2MjEtXFx1MDYzQV18W1xcdTA2NDEtXFx1MDY0QV18W1xcdTA2NzEtXFx1MDZCN118W1xcdTA2QkEtXFx1MDZCRV18W1xcdTA2QzAtXFx1MDZDRV18W1xcdTA2RDAtXFx1MDZEM118W1xcdTA2RDUtXFx1MDZENV18W1xcdTA5MDUtXFx1MDkzOV18W1xcdTA5M0QtXFx1MDkzRF18W1xcdTA5NTAtXFx1MDk1MF18W1xcdTA5NTgtXFx1MDk2MV18W1xcdTA5ODUtXFx1MDk4Q118W1xcdTA5OEYtXFx1MDk5MF18W1xcdTA5OTMtXFx1MDlBOF18W1xcdTA5QUEtXFx1MDlCMF18W1xcdTA5QjItXFx1MDlCMl18W1xcdTA5QjYtXFx1MDlCOV18W1xcdTA5REMtXFx1MDlERF18W1xcdTA5REYtXFx1MDlFMV18W1xcdTA5RjAtXFx1MDlGMV18W1xcdTBBMDUtXFx1MEEwQV18W1xcdTBBMEYtXFx1MEExMF18W1xcdTBBMTMtXFx1MEEyOF18W1xcdTBBMkEtXFx1MEEzMF18W1xcdTBBMzItXFx1MEEzM118W1xcdTBBMzUtXFx1MEEzNl18W1xcdTBBMzgtXFx1MEEzOV18W1xcdTBBNTktXFx1MEE1Q118W1xcdTBBNUUtXFx1MEE1RV18W1xcdTBBNzItXFx1MEE3NF18W1xcdTBBODUtXFx1MEE4Ql18W1xcdTBBOEQtXFx1MEE4RF18W1xcdTBBOEYtXFx1MEE5MV18W1xcdTBBOTMtXFx1MEFBOF18W1xcdTBBQUEtXFx1MEFCMF18W1xcdTBBQjItXFx1MEFCM118W1xcdTBBQjUtXFx1MEFCOV18W1xcdTBBQkQtXFx1MEFCRF18W1xcdTBBRDAtXFx1MEFEMF18W1xcdTBBRTAtXFx1MEFFMF18W1xcdTBCMDUtXFx1MEIwQ118W1xcdTBCMEYtXFx1MEIxMF18W1xcdTBCMTMtXFx1MEIyOF18W1xcdTBCMkEtXFx1MEIzMF18W1xcdTBCMzItXFx1MEIzM118W1xcdTBCMzYtXFx1MEIzOV18W1xcdTBCM0QtXFx1MEIzRF18W1xcdTBCNUMtXFx1MEI1RF18W1xcdTBCNUYtXFx1MEI2MV18W1xcdTBCODUtXFx1MEI4QV18W1xcdTBCOEUtXFx1MEI5MF18W1xcdTBCOTItXFx1MEI5NV18W1xcdTBCOTktXFx1MEI5QV18W1xcdTBCOUMtXFx1MEI5Q118W1xcdTBCOUUtXFx1MEI5Rl18W1xcdTBCQTMtXFx1MEJBNF18W1xcdTBCQTgtXFx1MEJBQV18W1xcdTBCQUUtXFx1MEJCNV18W1xcdTBCQjctXFx1MEJCOV18W1xcdTBDMDUtXFx1MEMwQ118W1xcdTBDMEUtXFx1MEMxMF18W1xcdTBDMTItXFx1MEMyOF18W1xcdTBDMkEtXFx1MEMzM118W1xcdTBDMzUtXFx1MEMzOV18W1xcdTBDNjAtXFx1MEM2MV18W1xcdTBDODUtXFx1MEM4Q118W1xcdTBDOEUtXFx1MEM5MF18W1xcdTBDOTItXFx1MENBOF18W1xcdTBDQUEtXFx1MENCM118W1xcdTBDQjUtXFx1MENCOV18W1xcdTBDREUtXFx1MENERV18W1xcdTBDRTAtXFx1MENFMV18W1xcdTBEMDUtXFx1MEQwQ118W1xcdTBEMEUtXFx1MEQxMF18W1xcdTBEMTItXFx1MEQyOF18W1xcdTBEMkEtXFx1MEQzOV18W1xcdTBENjAtXFx1MEQ2MV18W1xcdTBFMDEtXFx1MEUzMF18W1xcdTBFMzItXFx1MEUzM118W1xcdTBFNDAtXFx1MEU0NV18W1xcdTBFODEtXFx1MEU4Ml18W1xcdTBFODQtXFx1MEU4NF18W1xcdTBFODctXFx1MEU4OF18W1xcdTBFOEEtXFx1MEU4QV18W1xcdTBFOEQtXFx1MEU4RF18W1xcdTBFOTQtXFx1MEU5N118W1xcdTBFOTktXFx1MEU5Rl18W1xcdTBFQTEtXFx1MEVBM118W1xcdTBFQTUtXFx1MEVBNV18W1xcdTBFQTctXFx1MEVBN118W1xcdTBFQUEtXFx1MEVBQl18W1xcdTBFQUQtXFx1MEVCMF18W1xcdTBFQjItXFx1MEVCM118W1xcdTBFQkQtXFx1MEVCRF18W1xcdTBFQzAtXFx1MEVDNF18W1xcdTBFREMtXFx1MEVERF18W1xcdTBGMDAtXFx1MEYwMF18W1xcdTBGNDAtXFx1MEY0N118W1xcdTBGNDktXFx1MEY2OV18W1xcdTBGODgtXFx1MEY4Ql18W1xcdTExMDAtXFx1MTE1OV18W1xcdTExNUYtXFx1MTFBMl18W1xcdTExQTgtXFx1MTFGOV18W1xcdTIxMzUtXFx1MjEzOF18W1xcdTMwMDYtXFx1MzAwNl18W1xcdTMwNDEtXFx1MzA5NF18W1xcdTMwQTEtXFx1MzBGQV18W1xcdTMxMDUtXFx1MzEyQ118W1xcdTMxMzEtXFx1MzE4RV18W1xcdTRFMDAtXFx1OUZBNV18W1xcdUFDMDAtXFx1RDdBM118W1xcdUY5MDAtXFx1RkEyRF18W1xcdUZCMUYtXFx1RkIyOF18W1xcdUZCMkEtXFx1RkIzNl18W1xcdUZCMzgtXFx1RkIzQ118W1xcdUZCM0UtXFx1RkIzRV18W1xcdUZCNDAtXFx1RkI0MV18W1xcdUZCNDMtXFx1RkI0NF18W1xcdUZCNDYtXFx1RkJCMV18W1xcdUZCRDMtXFx1RkQzRF18W1xcdUZENTAtXFx1RkQ4Rl18W1xcdUZEOTItXFx1RkRDN118W1xcdUZERjAtXFx1RkRGQl18W1xcdUZFNzAtXFx1RkU3Ml18W1xcdUZFNzQtXFx1RkU3NF18W1xcdUZFNzYtXFx1RkVGQ118W1xcdUZGNjYtXFx1RkY2Rl18W1xcdUZGNzEtXFx1RkY5RF18W1xcdUZGQTAtXFx1RkZCRV18W1xcdUZGQzItXFx1RkZDN118W1xcdUZGQ0EtXFx1RkZDRl18W1xcdUZGRDItXFx1RkZEN118W1xcdUZGREEtXFx1RkZEQ10vLFxuICBMdG1vOiAvW1xcdTAxQzUtXFx1MDFDNV18W1xcdTAxQzgtXFx1MDFDOF18W1xcdTAxQ0ItXFx1MDFDQl18W1xcdTAxRjItXFx1MDFGMl1bXFx1MDJCMC1cXHUwMkI4XXxbXFx1MDJCQi1cXHUwMkMxXXxbXFx1MDJEMC1cXHUwMkQxXXxbXFx1MDJFMC1cXHUwMkU0XXxbXFx1MDM3QS1cXHUwMzdBXXxbXFx1MDU1OS1cXHUwNTU5XXxbXFx1MDY0MC1cXHUwNjQwXXxbXFx1MDZFNS1cXHUwNkU2XXxbXFx1MEU0Ni1cXHUwRTQ2XXxbXFx1MEVDNi1cXHUwRUM2XXxbXFx1MzAwNS1cXHUzMDA1XXxbXFx1MzAzMS1cXHUzMDM1XXxbXFx1MzA5RC1cXHUzMDlFXXxbXFx1MzBGQy1cXHUzMEZFXXxbXFx1RkY3MC1cXHVGRjcwXXxbXFx1RkY5RS1cXHVGRjlGXVtcXHUwMUFBLVxcdTAxQUFdfFtcXHUwMUJCLVxcdTAxQkJdfFtcXHUwMUJFLVxcdTAxQzNdfFtcXHUwM0YzLVxcdTAzRjNdfFtcXHUwNEMwLVxcdTA0QzBdfFtcXHUwNUQwLVxcdTA1RUFdfFtcXHUwNUYwLVxcdTA1RjJdfFtcXHUwNjIxLVxcdTA2M0FdfFtcXHUwNjQxLVxcdTA2NEFdfFtcXHUwNjcxLVxcdTA2QjddfFtcXHUwNkJBLVxcdTA2QkVdfFtcXHUwNkMwLVxcdTA2Q0VdfFtcXHUwNkQwLVxcdTA2RDNdfFtcXHUwNkQ1LVxcdTA2RDVdfFtcXHUwOTA1LVxcdTA5MzldfFtcXHUwOTNELVxcdTA5M0RdfFtcXHUwOTUwLVxcdTA5NTBdfFtcXHUwOTU4LVxcdTA5NjFdfFtcXHUwOTg1LVxcdTA5OENdfFtcXHUwOThGLVxcdTA5OTBdfFtcXHUwOTkzLVxcdTA5QThdfFtcXHUwOUFBLVxcdTA5QjBdfFtcXHUwOUIyLVxcdTA5QjJdfFtcXHUwOUI2LVxcdTA5QjldfFtcXHUwOURDLVxcdTA5RERdfFtcXHUwOURGLVxcdTA5RTFdfFtcXHUwOUYwLVxcdTA5RjFdfFtcXHUwQTA1LVxcdTBBMEFdfFtcXHUwQTBGLVxcdTBBMTBdfFtcXHUwQTEzLVxcdTBBMjhdfFtcXHUwQTJBLVxcdTBBMzBdfFtcXHUwQTMyLVxcdTBBMzNdfFtcXHUwQTM1LVxcdTBBMzZdfFtcXHUwQTM4LVxcdTBBMzldfFtcXHUwQTU5LVxcdTBBNUNdfFtcXHUwQTVFLVxcdTBBNUVdfFtcXHUwQTcyLVxcdTBBNzRdfFtcXHUwQTg1LVxcdTBBOEJdfFtcXHUwQThELVxcdTBBOERdfFtcXHUwQThGLVxcdTBBOTFdfFtcXHUwQTkzLVxcdTBBQThdfFtcXHUwQUFBLVxcdTBBQjBdfFtcXHUwQUIyLVxcdTBBQjNdfFtcXHUwQUI1LVxcdTBBQjldfFtcXHUwQUJELVxcdTBBQkRdfFtcXHUwQUQwLVxcdTBBRDBdfFtcXHUwQUUwLVxcdTBBRTBdfFtcXHUwQjA1LVxcdTBCMENdfFtcXHUwQjBGLVxcdTBCMTBdfFtcXHUwQjEzLVxcdTBCMjhdfFtcXHUwQjJBLVxcdTBCMzBdfFtcXHUwQjMyLVxcdTBCMzNdfFtcXHUwQjM2LVxcdTBCMzldfFtcXHUwQjNELVxcdTBCM0RdfFtcXHUwQjVDLVxcdTBCNURdfFtcXHUwQjVGLVxcdTBCNjFdfFtcXHUwQjg1LVxcdTBCOEFdfFtcXHUwQjhFLVxcdTBCOTBdfFtcXHUwQjkyLVxcdTBCOTVdfFtcXHUwQjk5LVxcdTBCOUFdfFtcXHUwQjlDLVxcdTBCOUNdfFtcXHUwQjlFLVxcdTBCOUZdfFtcXHUwQkEzLVxcdTBCQTRdfFtcXHUwQkE4LVxcdTBCQUFdfFtcXHUwQkFFLVxcdTBCQjVdfFtcXHUwQkI3LVxcdTBCQjldfFtcXHUwQzA1LVxcdTBDMENdfFtcXHUwQzBFLVxcdTBDMTBdfFtcXHUwQzEyLVxcdTBDMjhdfFtcXHUwQzJBLVxcdTBDMzNdfFtcXHUwQzM1LVxcdTBDMzldfFtcXHUwQzYwLVxcdTBDNjFdfFtcXHUwQzg1LVxcdTBDOENdfFtcXHUwQzhFLVxcdTBDOTBdfFtcXHUwQzkyLVxcdTBDQThdfFtcXHUwQ0FBLVxcdTBDQjNdfFtcXHUwQ0I1LVxcdTBDQjldfFtcXHUwQ0RFLVxcdTBDREVdfFtcXHUwQ0UwLVxcdTBDRTFdfFtcXHUwRDA1LVxcdTBEMENdfFtcXHUwRDBFLVxcdTBEMTBdfFtcXHUwRDEyLVxcdTBEMjhdfFtcXHUwRDJBLVxcdTBEMzldfFtcXHUwRDYwLVxcdTBENjFdfFtcXHUwRTAxLVxcdTBFMzBdfFtcXHUwRTMyLVxcdTBFMzNdfFtcXHUwRTQwLVxcdTBFNDVdfFtcXHUwRTgxLVxcdTBFODJdfFtcXHUwRTg0LVxcdTBFODRdfFtcXHUwRTg3LVxcdTBFODhdfFtcXHUwRThBLVxcdTBFOEFdfFtcXHUwRThELVxcdTBFOERdfFtcXHUwRTk0LVxcdTBFOTddfFtcXHUwRTk5LVxcdTBFOUZdfFtcXHUwRUExLVxcdTBFQTNdfFtcXHUwRUE1LVxcdTBFQTVdfFtcXHUwRUE3LVxcdTBFQTddfFtcXHUwRUFBLVxcdTBFQUJdfFtcXHUwRUFELVxcdTBFQjBdfFtcXHUwRUIyLVxcdTBFQjNdfFtcXHUwRUJELVxcdTBFQkRdfFtcXHUwRUMwLVxcdTBFQzRdfFtcXHUwRURDLVxcdTBFRERdfFtcXHUwRjAwLVxcdTBGMDBdfFtcXHUwRjQwLVxcdTBGNDddfFtcXHUwRjQ5LVxcdTBGNjldfFtcXHUwRjg4LVxcdTBGOEJdfFtcXHUxMTAwLVxcdTExNTldfFtcXHUxMTVGLVxcdTExQTJdfFtcXHUxMUE4LVxcdTExRjldfFtcXHUyMTM1LVxcdTIxMzhdfFtcXHUzMDA2LVxcdTMwMDZdfFtcXHUzMDQxLVxcdTMwOTRdfFtcXHUzMEExLVxcdTMwRkFdfFtcXHUzMTA1LVxcdTMxMkNdfFtcXHUzMTMxLVxcdTMxOEVdfFtcXHU0RTAwLVxcdTlGQTVdfFtcXHVBQzAwLVxcdUQ3QTNdfFtcXHVGOTAwLVxcdUZBMkRdfFtcXHVGQjFGLVxcdUZCMjhdfFtcXHVGQjJBLVxcdUZCMzZdfFtcXHVGQjM4LVxcdUZCM0NdfFtcXHVGQjNFLVxcdUZCM0VdfFtcXHVGQjQwLVxcdUZCNDFdfFtcXHVGQjQzLVxcdUZCNDRdfFtcXHVGQjQ2LVxcdUZCQjFdfFtcXHVGQkQzLVxcdUZEM0RdfFtcXHVGRDUwLVxcdUZEOEZdfFtcXHVGRDkyLVxcdUZEQzddfFtcXHVGREYwLVxcdUZERkJdfFtcXHVGRTcwLVxcdUZFNzJdfFtcXHVGRTc0LVxcdUZFNzRdfFtcXHVGRTc2LVxcdUZFRkNdfFtcXHVGRjY2LVxcdUZGNkZdfFtcXHVGRjcxLVxcdUZGOURdfFtcXHVGRkEwLVxcdUZGQkVdfFtcXHVGRkMyLVxcdUZGQzddfFtcXHVGRkNBLVxcdUZGQ0ZdfFtcXHVGRkQyLVxcdUZGRDddfFtcXHVGRkRBLVxcdUZGRENdL1xufTtcbiJdfQ==
