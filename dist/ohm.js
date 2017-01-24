(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ohm = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"},"BuiltInRules",null,null,{"alnum":["define",{"sourceInterval":[18,78]},"an alpha-numeric character",[],["alt",{"sourceInterval":[60,78]},["app",{"sourceInterval":[60,66]},"letter",[]],["app",{"sourceInterval":[73,78]},"digit",[]]]],"letter":["define",{"sourceInterval":[82,142]},"a letter",[],["alt",{"sourceInterval":[107,142]},["app",{"sourceInterval":[107,112]},"lower",[]],["app",{"sourceInterval":[119,124]},"upper",[]],["app",{"sourceInterval":[131,142]},"unicodeLtmo",[]]]],"digit":["define",{"sourceInterval":[146,177]},"a digit",[],["range",{"sourceInterval":[169,177]},"0","9"]],"hexDigit":["define",{"sourceInterval":[181,254]},"a hexadecimal digit",[],["alt",{"sourceInterval":[219,254]},["app",{"sourceInterval":[219,224]},"digit",[]],["range",{"sourceInterval":[231,239]},"a","f"],["range",{"sourceInterval":[246,254]},"A","F"]]],"ListOf":["define",{"sourceInterval":[258,336]},null,["elem","sep"],["alt",{"sourceInterval":[282,336]},["app",{"sourceInterval":[282,307]},"NonemptyListOf",[["param",{},0],["param",{},1]]],["app",{"sourceInterval":[314,336]},"EmptyListOf",[["param",{},0],["param",{},1]]]]],"NonemptyListOf":["define",{"sourceInterval":[340,388]},null,["elem","sep"],["seq",{"sourceInterval":[372,388]},["param",{},0],["star",{"sourceInterval":[377,388]},["seq",{"sourceInterval":[378,386]},["param",{},1],["param",{},0]]]]],"EmptyListOf":["define",{"sourceInterval":[392,434]},null,["elem","sep"],["seq",{"sourceInterval":[438,438]}]],"listOf":["define",{"sourceInterval":[438,516]},null,["elem","sep"],["alt",{"sourceInterval":[462,516]},["app",{"sourceInterval":[462,487]},"nonemptyListOf",[["param",{},0],["param",{},1]]],["app",{"sourceInterval":[494,516]},"emptyListOf",[["param",{},0],["param",{},1]]]]],"nonemptyListOf":["define",{"sourceInterval":[520,568]},null,["elem","sep"],["seq",{"sourceInterval":[552,568]},["param",{},0],["star",{"sourceInterval":[557,568]},["seq",{"sourceInterval":[558,566]},["param",{},1],["param",{},0]]]]],"emptyListOf":["define",{"sourceInterval":[572,614]},null,["elem","sep"],["seq",{"sourceInterval":[616,616]}]]}]);

},{"..":44}],2:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" RuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | terminal \"..\" terminal                         -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"},"Ohm",null,"Grammars",{"Grammars":["define",{"sourceInterval":[9,32]},null,[],["star",{"sourceInterval":[24,32]},["app",{"sourceInterval":[24,31]},"Grammar",[]]]],"Grammar":["define",{"sourceInterval":[36,83]},null,[],["seq",{"sourceInterval":[50,83]},["app",{"sourceInterval":[50,55]},"ident",[]],["opt",{"sourceInterval":[56,69]},["app",{"sourceInterval":[56,68]},"SuperGrammar",[]]],["terminal",{"sourceInterval":[70,73]},"{"],["star",{"sourceInterval":[74,79]},["app",{"sourceInterval":[74,78]},"Rule",[]]],["terminal",{"sourceInterval":[80,83]},"}"]]],"SuperGrammar":["define",{"sourceInterval":[87,116]},null,[],["seq",{"sourceInterval":[106,116]},["terminal",{"sourceInterval":[106,110]},"<:"],["app",{"sourceInterval":[111,116]},"ident",[]]]],"Rule_define":["define",{"sourceInterval":[131,181]},null,[],["seq",{"sourceInterval":[131,170]},["app",{"sourceInterval":[131,136]},"ident",[]],["opt",{"sourceInterval":[137,145]},["app",{"sourceInterval":[137,144]},"Formals",[]]],["opt",{"sourceInterval":[146,156]},["app",{"sourceInterval":[146,155]},"ruleDescr",[]]],["terminal",{"sourceInterval":[157,160]},"="],["app",{"sourceInterval":[162,170]},"RuleBody",[]]]],"Rule_override":["define",{"sourceInterval":[188,240]},null,[],["seq",{"sourceInterval":[188,227]},["app",{"sourceInterval":[188,193]},"ident",[]],["opt",{"sourceInterval":[194,202]},["app",{"sourceInterval":[194,201]},"Formals",[]]],["terminal",{"sourceInterval":[214,218]},":="],["app",{"sourceInterval":[219,227]},"RuleBody",[]]]],"Rule_extend":["define",{"sourceInterval":[247,297]},null,[],["seq",{"sourceInterval":[247,286]},["app",{"sourceInterval":[247,252]},"ident",[]],["opt",{"sourceInterval":[253,261]},["app",{"sourceInterval":[253,260]},"Formals",[]]],["terminal",{"sourceInterval":[273,277]},"+="],["app",{"sourceInterval":[278,286]},"RuleBody",[]]]],"Rule":["define",{"sourceInterval":[120,297]},null,[],["alt",{"sourceInterval":[131,297]},["app",{"sourceInterval":[131,170]},"Rule_define",[]],["app",{"sourceInterval":[188,227]},"Rule_override",[]],["app",{"sourceInterval":[247,286]},"Rule_extend",[]]]],"RuleBody":["define",{"sourceInterval":[301,354]},null,[],["seq",{"sourceInterval":[316,354]},["opt",{"sourceInterval":[316,320]},["terminal",{"sourceInterval":[316,319]},"|"]],["app",{"sourceInterval":[321,354]},"NonemptyListOf",[["app",{"sourceInterval":[336,348]},"TopLevelTerm",[]],["terminal",{"sourceInterval":[350,353]},"|"]]]]],"TopLevelTerm_inline":["define",{"sourceInterval":[377,400]},null,[],["seq",{"sourceInterval":[377,389]},["app",{"sourceInterval":[377,380]},"Seq",[]],["app",{"sourceInterval":[381,389]},"caseName",[]]]],"TopLevelTerm":["define",{"sourceInterval":[358,410]},null,[],["alt",{"sourceInterval":[377,410]},["app",{"sourceInterval":[377,389]},"TopLevelTerm_inline",[]],["app",{"sourceInterval":[407,410]},"Seq",[]]]],"Formals":["define",{"sourceInterval":[414,454]},null,[],["seq",{"sourceInterval":[428,454]},["terminal",{"sourceInterval":[428,431]},"<"],["app",{"sourceInterval":[432,450]},"ListOf",[["app",{"sourceInterval":[439,444]},"ident",[]],["terminal",{"sourceInterval":[446,449]},","]]],["terminal",{"sourceInterval":[451,454]},">"]]],"Params":["define",{"sourceInterval":[458,495]},null,[],["seq",{"sourceInterval":[471,495]},["terminal",{"sourceInterval":[471,474]},"<"],["app",{"sourceInterval":[475,491]},"ListOf",[["app",{"sourceInterval":[482,485]},"Seq",[]],["terminal",{"sourceInterval":[487,490]},","]]],["terminal",{"sourceInterval":[492,495]},">"]]],"Alt":["define",{"sourceInterval":[499,533]},null,[],["app",{"sourceInterval":[509,533]},"NonemptyListOf",[["app",{"sourceInterval":[524,527]},"Seq",[]],["terminal",{"sourceInterval":[529,532]},"|"]]]],"Seq":["define",{"sourceInterval":[537,552]},null,[],["star",{"sourceInterval":[547,552]},["app",{"sourceInterval":[547,551]},"Iter",[]]]],"Iter_star":["define",{"sourceInterval":[567,584]},null,[],["seq",{"sourceInterval":[567,575]},["app",{"sourceInterval":[567,571]},"Pred",[]],["terminal",{"sourceInterval":[572,575]},"*"]]],"Iter_plus":["define",{"sourceInterval":[591,608]},null,[],["seq",{"sourceInterval":[591,599]},["app",{"sourceInterval":[591,595]},"Pred",[]],["terminal",{"sourceInterval":[596,599]},"+"]]],"Iter_opt":["define",{"sourceInterval":[615,631]},null,[],["seq",{"sourceInterval":[615,623]},["app",{"sourceInterval":[615,619]},"Pred",[]],["terminal",{"sourceInterval":[620,623]},"?"]]],"Iter":["define",{"sourceInterval":[556,642]},null,[],["alt",{"sourceInterval":[567,642]},["app",{"sourceInterval":[567,575]},"Iter_star",[]],["app",{"sourceInterval":[591,599]},"Iter_plus",[]],["app",{"sourceInterval":[615,623]},"Iter_opt",[]],["app",{"sourceInterval":[638,642]},"Pred",[]]]],"Pred_not":["define",{"sourceInterval":[657,672]},null,[],["seq",{"sourceInterval":[657,664]},["terminal",{"sourceInterval":[657,660]},"~"],["app",{"sourceInterval":[661,664]},"Lex",[]]]],"Pred_lookahead":["define",{"sourceInterval":[679,700]},null,[],["seq",{"sourceInterval":[679,686]},["terminal",{"sourceInterval":[679,682]},"&"],["app",{"sourceInterval":[683,686]},"Lex",[]]]],"Pred":["define",{"sourceInterval":[646,710]},null,[],["alt",{"sourceInterval":[657,710]},["app",{"sourceInterval":[657,664]},"Pred_not",[]],["app",{"sourceInterval":[679,686]},"Pred_lookahead",[]],["app",{"sourceInterval":[707,710]},"Lex",[]]]],"Lex_lex":["define",{"sourceInterval":[724,740]},null,[],["seq",{"sourceInterval":[724,732]},["terminal",{"sourceInterval":[724,727]},"#"],["app",{"sourceInterval":[728,732]},"Base",[]]]],"Lex":["define",{"sourceInterval":[714,751]},null,[],["alt",{"sourceInterval":[724,751]},["app",{"sourceInterval":[724,732]},"Lex_lex",[]],["app",{"sourceInterval":[747,751]},"Base",[]]]],"Base_application":["define",{"sourceInterval":[766,827]},null,[],["seq",{"sourceInterval":[766,811]},["app",{"sourceInterval":[766,771]},"ident",[]],["opt",{"sourceInterval":[772,779]},["app",{"sourceInterval":[772,778]},"Params",[]]],["not",{"sourceInterval":[780,811]},["alt",{"sourceInterval":[782,810]},["seq",{"sourceInterval":[782,796]},["opt",{"sourceInterval":[782,792]},["app",{"sourceInterval":[782,791]},"ruleDescr",[]]],["terminal",{"sourceInterval":[793,796]},"="]],["terminal",{"sourceInterval":[799,803]},":="],["terminal",{"sourceInterval":[806,810]},"+="]]]]],"Base_range":["define",{"sourceInterval":[834,889]},null,[],["seq",{"sourceInterval":[834,856]},["app",{"sourceInterval":[834,842]},"terminal",[]],["terminal",{"sourceInterval":[843,847]},".."],["app",{"sourceInterval":[848,856]},"terminal",[]]]],"Base_terminal":["define",{"sourceInterval":[896,954]},null,[],["app",{"sourceInterval":[896,904]},"terminal",[]]],"Base_paren":["define",{"sourceInterval":[961,1016]},null,[],["seq",{"sourceInterval":[961,972]},["terminal",{"sourceInterval":[961,964]},"("],["app",{"sourceInterval":[965,968]},"Alt",[]],["terminal",{"sourceInterval":[969,972]},")"]]],"Base":["define",{"sourceInterval":[755,1016]},null,[],["alt",{"sourceInterval":[766,1016]},["app",{"sourceInterval":[766,811]},"Base_application",[]],["app",{"sourceInterval":[834,856]},"Base_range",[]],["app",{"sourceInterval":[896,904]},"Base_terminal",[]],["app",{"sourceInterval":[961,972]},"Base_paren",[]]]],"ruleDescr":["define",{"sourceInterval":[1020,1079]},"a rule description",[],["seq",{"sourceInterval":[1058,1079]},["terminal",{"sourceInterval":[1058,1061]},"("],["app",{"sourceInterval":[1062,1075]},"ruleDescrText",[]],["terminal",{"sourceInterval":[1076,1079]},")"]]],"ruleDescrText":["define",{"sourceInterval":[1083,1114]},null,[],["star",{"sourceInterval":[1103,1114]},["seq",{"sourceInterval":[1104,1112]},["not",{"sourceInterval":[1104,1108]},["terminal",{"sourceInterval":[1105,1108]},")"]],["app",{"sourceInterval":[1109,1112]},"any",[]]]]],"caseName":["define",{"sourceInterval":[1118,1186]},null,[],["seq",{"sourceInterval":[1133,1186]},["terminal",{"sourceInterval":[1133,1137]},"--"],["star",{"sourceInterval":[1138,1152]},["seq",{"sourceInterval":[1139,1150]},["not",{"sourceInterval":[1139,1144]},["terminal",{"sourceInterval":[1140,1144]},"\n"]],["app",{"sourceInterval":[1145,1150]},"space",[]]]],["app",{"sourceInterval":[1153,1157]},"name",[]],["star",{"sourceInterval":[1158,1172]},["seq",{"sourceInterval":[1159,1170]},["not",{"sourceInterval":[1159,1164]},["terminal",{"sourceInterval":[1160,1164]},"\n"]],["app",{"sourceInterval":[1165,1170]},"space",[]]]],["alt",{"sourceInterval":[1174,1185]},["terminal",{"sourceInterval":[1174,1178]},"\n"],["lookahead",{"sourceInterval":[1181,1185]},["terminal",{"sourceInterval":[1182,1185]},"}"]]]]],"name":["define",{"sourceInterval":[1190,1230]},"a name",[],["seq",{"sourceInterval":[1211,1230]},["app",{"sourceInterval":[1211,1220]},"nameFirst",[]],["star",{"sourceInterval":[1221,1230]},["app",{"sourceInterval":[1221,1229]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[1234,1266]},null,[],["alt",{"sourceInterval":[1250,1266]},["terminal",{"sourceInterval":[1250,1253]},"_"],["app",{"sourceInterval":[1260,1266]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[1270,1300]},null,[],["alt",{"sourceInterval":[1285,1300]},["terminal",{"sourceInterval":[1285,1288]},"_"],["app",{"sourceInterval":[1295,1300]},"alnum",[]]]],"ident":["define",{"sourceInterval":[1304,1337]},"an identifier",[],["app",{"sourceInterval":[1333,1337]},"name",[]]],"terminal":["define",{"sourceInterval":[1341,1379]},null,[],["seq",{"sourceInterval":[1356,1379]},["terminal",{"sourceInterval":[1356,1360]},"\""],["star",{"sourceInterval":[1361,1374]},["app",{"sourceInterval":[1361,1373]},"terminalChar",[]]],["terminal",{"sourceInterval":[1375,1379]},"\""]]],"terminalChar":["define",{"sourceInterval":[1383,1440]},null,[],["alt",{"sourceInterval":[1402,1440]},["app",{"sourceInterval":[1402,1412]},"escapeChar",[]],["seq",{"sourceInterval":[1419,1440]},["not",{"sourceInterval":[1419,1424]},["terminal",{"sourceInterval":[1420,1424]},"\\"]],["not",{"sourceInterval":[1425,1430]},["terminal",{"sourceInterval":[1426,1430]},"\""]],["not",{"sourceInterval":[1431,1436]},["terminal",{"sourceInterval":[1432,1436]},"\n"]],["app",{"sourceInterval":[1437,1440]},"any",[]]]]],"escapeChar_backslash":["define",{"sourceInterval":[1483,1538]},null,[],["terminal",{"sourceInterval":[1483,1489]},"\\\\"]],"escapeChar_doubleQuote":["define",{"sourceInterval":[1545,1602]},null,[],["terminal",{"sourceInterval":[1545,1551]},"\\\""]],"escapeChar_singleQuote":["define",{"sourceInterval":[1609,1666]},null,[],["terminal",{"sourceInterval":[1609,1615]},"\\'"]],"escapeChar_backspace":["define",{"sourceInterval":[1673,1728]},null,[],["terminal",{"sourceInterval":[1673,1678]},"\\b"]],"escapeChar_lineFeed":["define",{"sourceInterval":[1735,1789]},null,[],["terminal",{"sourceInterval":[1735,1740]},"\\n"]],"escapeChar_carriageReturn":["define",{"sourceInterval":[1796,1856]},null,[],["terminal",{"sourceInterval":[1796,1801]},"\\r"]],"escapeChar_tab":["define",{"sourceInterval":[1863,1912]},null,[],["terminal",{"sourceInterval":[1863,1868]},"\\t"]],"escapeChar_unicodeEscape":["define",{"sourceInterval":[1919,1978]},null,[],["seq",{"sourceInterval":[1919,1960]},["terminal",{"sourceInterval":[1919,1924]},"\\u"],["app",{"sourceInterval":[1925,1933]},"hexDigit",[]],["app",{"sourceInterval":[1934,1942]},"hexDigit",[]],["app",{"sourceInterval":[1943,1951]},"hexDigit",[]],["app",{"sourceInterval":[1952,1960]},"hexDigit",[]]]],"escapeChar_hexEscape":["define",{"sourceInterval":[1985,2040]},null,[],["seq",{"sourceInterval":[1985,2008]},["terminal",{"sourceInterval":[1985,1990]},"\\x"],["app",{"sourceInterval":[1991,1999]},"hexDigit",[]],["app",{"sourceInterval":[2000,2008]},"hexDigit",[]]]],"escapeChar":["define",{"sourceInterval":[1444,2040]},"an escape sequence",[],["alt",{"sourceInterval":[1483,2040]},["app",{"sourceInterval":[1483,1489]},"escapeChar_backslash",[]],["app",{"sourceInterval":[1545,1551]},"escapeChar_doubleQuote",[]],["app",{"sourceInterval":[1609,1615]},"escapeChar_singleQuote",[]],["app",{"sourceInterval":[1673,1678]},"escapeChar_backspace",[]],["app",{"sourceInterval":[1735,1740]},"escapeChar_lineFeed",[]],["app",{"sourceInterval":[1796,1801]},"escapeChar_carriageReturn",[]],["app",{"sourceInterval":[1863,1868]},"escapeChar_tab",[]],["app",{"sourceInterval":[1919,1960]},"escapeChar_unicodeEscape",[]],["app",{"sourceInterval":[1985,2008]},"escapeChar_hexEscape",[]]]],"space":["extend",{"sourceInterval":[2044,2063]},null,[],["app",{"sourceInterval":[2056,2063]},"comment",[]]],"comment_singleLine":["define",{"sourceInterval":[2081,2118]},null,[],["seq",{"sourceInterval":[2081,2103]},["terminal",{"sourceInterval":[2081,2085]},"//"],["star",{"sourceInterval":[2086,2098]},["seq",{"sourceInterval":[2087,2096]},["not",{"sourceInterval":[2087,2092]},["terminal",{"sourceInterval":[2088,2092]},"\n"]],["app",{"sourceInterval":[2093,2096]},"any",[]]]],["terminal",{"sourceInterval":[2099,2103]},"\n"]]],"comment_multiLine":["define",{"sourceInterval":[2125,2161]},null,[],["seq",{"sourceInterval":[2125,2147]},["terminal",{"sourceInterval":[2125,2129]},"/*"],["star",{"sourceInterval":[2130,2142]},["seq",{"sourceInterval":[2131,2140]},["not",{"sourceInterval":[2131,2136]},["terminal",{"sourceInterval":[2132,2136]},"*/"]],["app",{"sourceInterval":[2137,2140]},"any",[]]]],["terminal",{"sourceInterval":[2143,2147]},"*/"]]],"comment":["define",{"sourceInterval":[2067,2161]},null,[],["alt",{"sourceInterval":[2081,2161]},["app",{"sourceInterval":[2081,2103]},"comment_singleLine",[]],["app",{"sourceInterval":[2125,2147]},"comment_multiLine",[]]]],"tokens":["define",{"sourceInterval":[2165,2180]},null,[],["star",{"sourceInterval":[2174,2180]},["app",{"sourceInterval":[2174,2179]},"token",[]]]],"token":["define",{"sourceInterval":[2184,2260]},null,[],["alt",{"sourceInterval":[2192,2260]},["app",{"sourceInterval":[2192,2200]},"caseName",[]],["app",{"sourceInterval":[2203,2210]},"comment",[]],["app",{"sourceInterval":[2213,2218]},"ident",[]],["app",{"sourceInterval":[2221,2229]},"operator",[]],["app",{"sourceInterval":[2232,2243]},"punctuation",[]],["app",{"sourceInterval":[2246,2254]},"terminal",[]],["app",{"sourceInterval":[2257,2260]},"any",[]]]],"operator":["define",{"sourceInterval":[2264,2329]},null,[],["alt",{"sourceInterval":[2275,2329]},["terminal",{"sourceInterval":[2275,2279]},"<:"],["terminal",{"sourceInterval":[2282,2285]},"="],["terminal",{"sourceInterval":[2288,2292]},":="],["terminal",{"sourceInterval":[2295,2299]},"+="],["terminal",{"sourceInterval":[2302,2305]},"*"],["terminal",{"sourceInterval":[2308,2311]},"+"],["terminal",{"sourceInterval":[2314,2317]},"?"],["terminal",{"sourceInterval":[2320,2323]},"~"],["terminal",{"sourceInterval":[2326,2329]},"&"]]],"punctuation":["define",{"sourceInterval":[2333,2369]},null,[],["alt",{"sourceInterval":[2347,2369]},["terminal",{"sourceInterval":[2347,2350]},"<"],["terminal",{"sourceInterval":[2353,2356]},">"],["terminal",{"sourceInterval":[2359,2362]},","],["terminal",{"sourceInterval":[2365,2369]},"--"]]]}]);

},{"..":44}],3:[function(require,module,exports){
var ohm = require('..');
module.exports = ohm.makeRecipe(["grammar",{"source":"OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}"},"OperationsAndAttributes",null,"AttributeSignature",{"AttributeSignature":["define",{"sourceInterval":[29,58]},null,[],["app",{"sourceInterval":[54,58]},"name",[]]],"OperationSignature":["define",{"sourceInterval":[62,100]},null,[],["seq",{"sourceInterval":[87,100]},["app",{"sourceInterval":[87,91]},"name",[]],["opt",{"sourceInterval":[92,100]},["app",{"sourceInterval":[92,99]},"Formals",[]]]]],"Formals":["define",{"sourceInterval":[104,143]},null,[],["seq",{"sourceInterval":[118,143]},["terminal",{"sourceInterval":[118,121]},"("],["app",{"sourceInterval":[122,139]},"ListOf",[["app",{"sourceInterval":[129,133]},"name",[]],["terminal",{"sourceInterval":[135,138]},","]]],["terminal",{"sourceInterval":[140,143]},")"]]],"name":["define",{"sourceInterval":[147,187]},"a name",[],["seq",{"sourceInterval":[168,187]},["app",{"sourceInterval":[168,177]},"nameFirst",[]],["star",{"sourceInterval":[178,187]},["app",{"sourceInterval":[178,186]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[191,223]},null,[],["alt",{"sourceInterval":[207,223]},["terminal",{"sourceInterval":[207,210]},"_"],["app",{"sourceInterval":[217,223]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[227,257]},null,[],["alt",{"sourceInterval":[242,257]},["terminal",{"sourceInterval":[242,245]},"_"],["app",{"sourceInterval":[252,257]},"alnum",[]]]]}]);

},{"..":44}],4:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var assert = require('../src/common').assert;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// Helpers

function getProp(name, thing, fn) {
  return fn(thing[name]);
}

function mapProp(name, thing, fn) {
  return thing[name].map(fn);
}

// Returns a function that will walk a single property of a node.
// `descriptor` is a string indicating the property name, optionally ending
// with '[]' (e.g., 'children[]').
function getPropWalkFn(descriptor) {
  var parts = descriptor.split(/ ?\[\]/);
  if (parts.length === 2) {
    return mapProp.bind(null, parts[0]);
  }
  return getProp.bind(null, descriptor);
}

function getProps(walkFns, thing, fn) {
  return walkFns.map(function(walkFn) {
    return walkFn(thing, fn);
  });
}

function getWalkFn(shape) {
  if (typeof shape === 'string') {
    return getProps.bind(null, [getPropWalkFn(shape)]);
  } else if (Array.isArray(shape)) {
    return getProps.bind(null, shape.map(getPropWalkFn));
  } else {
    assert(typeof shape === 'function', 'Expected a string, Array, or function');
    assert(shape.length === 2, 'Expected a function of arity 2, got ' + shape.length);
    return shape;
  }
}

function isRestrictedIdentifier(str) {
  return /^[a-zA-Z_][0-9a-zA-Z_]*$/.test(str);
}

function trim(s) {
  return s.trim();
}

function parseSignature(sig) {
  var parts = sig.split(/[()]/).map(trim);
  if (parts.length === 3 && parts[2] === '') {
    var name = parts[0];
    var params = [];
    if (parts[1].length > 0) {
      params = parts[1].split(',').map(trim);
    }
    if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
      return {name: name, formals: params};
    }
  }
  throw new Error('Invalid operation signature: ' + sig);
}

/*
  A VisitorFamily contains a set of recursive operations that are defined over some kind of
  tree structure. The `config` parameter specifies how to walk the tree:
  - 'getTag' is function which, given a node in the tree, returns the node's 'tag' (type)
  - 'shapes' an object that maps from a tag to a value that describes how to recursively
    evaluate the operation for nodes of that type. The value can be:
    * a string indicating the property name that holds that node's only child
    * an Array of property names (or an empty array indicating a leaf type), or
    * a function taking two arguments (node, fn), and returning an Array which is the result
      of apply `fn` to each of the node's children.
 */
function VisitorFamily(config) {
  this._shapes = config.shapes;
  this._getTag = config.getTag;

  this.Adapter = function(thing, family) {
    this._adaptee = thing;
    this._family = family;
  };
  this.Adapter.prototype.valueOf = function() {
    throw new Error('heeey!');
  };
  this.operations = {};

  this._arities = Object.create(null);
  this._getChildren = Object.create(null);

  var self = this;
  Object.keys(this._shapes).forEach(function(k) {
    var shape = self._shapes[k];
    self._getChildren[k] = getWalkFn(shape);

    // A function means the arity isn't fixed, so don't put an entry in the arity map.
    if (typeof shape !== 'function') {
      self._arities[k] = Array.isArray(shape) ? shape.length : 1;
    }
  });
  this._wrap = function(thing) { return new self.Adapter(thing, self); };
}

VisitorFamily.prototype.wrap = function(thing) {
  return this._wrap(thing);
};

VisitorFamily.prototype._checkActionDict = function(dict) {
  var self = this;
  Object.keys(dict).forEach(function(k) {
    assert(k in self._getChildren, "Unrecognized action name '" + k + "'");
    var action = dict[k];
    assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);
    if (k in self._arities) {
      var expected = self._arities[k];
      var actual = dict[k].length;
      assert(actual === expected,
             "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual);
    }
  });
};

VisitorFamily.prototype.addOperation = function(signature, actions) {
  var sig = parseSignature(signature);
  var name = sig.name;
  this._checkActionDict(actions);
  this.operations[name] = {
    name: name,
    formals: sig.formals,
    actions: actions
  };

  var family = this;
  this.Adapter.prototype[name] = function() {
    var tag = family._getTag(this._adaptee);
    assert(tag in family._getChildren, "getTag returned unrecognized tag '" + tag + "'");
    assert(tag in actions, "No action for '" + tag + "' in operation '" + name + "'");

    // Create an "arguments object" from the arguments that were passed to this
    // operation / attribute.
    var args = Object.create(null);
    for (var i = 0; i < arguments.length; i++) {
      args[sig.formals[i]] = arguments[i];
    }

    var oldArgs = this.args;
    this.args = args;
    var ans = actions[tag].apply(this, family._getChildren[tag](this._adaptee, family._wrap));
    this.args = oldArgs;
    return ans;
  };
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = VisitorFamily;

},{"../src/common":42}],5:[function(require,module,exports){
'use strict';

module.exports = {
  VisitorFamily: require('./VisitorFamily'),
  semanticsForToAST: require('./semantics-toAST').semantics,
  toAST: require('./semantics-toAST').helper
};

},{"./VisitorFamily":4,"./semantics-toAST":6}],6:[function(require,module,exports){
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
        return this.sourceString;
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
  var s = g.createSemantics().addOperation('toAST(mapping)', operation);
  return s(res).toAST(mapping);
}

// Returns a semantics containg the toAST(mapping) operation for the given grammar g.
function semanticsForToAST(g) {
  if (!(g instanceof Grammar)) {
    throw new Error('semanticsToAST() expects a Grammar as parameter');
  }

  return g.createSemantics().addOperation('toAST(mapping)', defaultOperation);
}

module.exports = {
  helper: toAST,
  semantics: semanticsForToAST
};

},{"../src/Grammar":31,"../src/MatchResult":35,"../src/pexprs":62,"util-extend":27}],7:[function(require,module,exports){
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

},{"es5-ext/object/assign":8,"es5-ext/object/is-callable":11,"es5-ext/object/normalize-options":15,"es5-ext/string/#/contains":17}],8:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":9,"./shim":10}],9:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],10:[function(require,module,exports){
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

},{"../keys":12,"../valid-value":16}],11:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],12:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":13,"./shim":14}],13:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],14:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],17:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":18,"./shim":19}],18:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],19:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],20:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":21,"./polyfill":23}],21:[function(require,module,exports){
'use strict';

var validTypes = { object: true, symbol: true };

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }

	// Return 'true' also for polyfills
	if (!validTypes[typeof Symbol.iterator]) return false;
	if (!validTypes[typeof Symbol.toPrimitive]) return false;
	if (!validTypes[typeof Symbol.toStringTag]) return false;

	return true;
};

},{}],22:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	if (!x) return false;
	if (typeof x === 'symbol') return true;
	if (!x.constructor) return false;
	if (x.constructor.name !== 'Symbol') return false;
	return (x[x.constructor.toStringTag] === 'Symbol');
};

},{}],23:[function(require,module,exports){
// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
  , isNativeSafe;

if (typeof Symbol === 'function') {
	NativeSymbol = Symbol;
	try {
		String(NativeSymbol());
		isNativeSafe = true;
	} catch (ignore) {}
}

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name, ie11BugWorkaround;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			// For IE11 issue see:
			// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
			//    ie11-broken-getters-on-dom-objects
			// https://github.com/medikoo/es6-symbol/issues/12
			if (ie11BugWorkaround) return;
			ie11BugWorkaround = true;
			defineProperty(this, name, d(value));
			ie11BugWorkaround = false;
		}));
		return name;
	};
}());

// Internal constructor (not one exposed) for creating Symbol instances.
// This one is used to ensure that `someSymbol instanceof Symbol` always return false
HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
	return SymbolPolyfill(description);
};

// Exposed `Symbol` constructor
// (returns instances of HiddenSymbol)
module.exports = SymbolPolyfill = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
	if (isNativeSafe) return NativeSymbol(description);
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(SymbolPolyfill, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = SymbolPolyfill(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),

	// If there's native implementation of given symbol, let's fallback to it
	// to ensure proper interoperability with other native functions e.g. Array.from
	hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
	isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
		SymbolPolyfill('isConcatSpreadable')),
	iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
	match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
	replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
	search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
	species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
	split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
	toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
	toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
	unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
});

// Internal tweaks for real symbol producer
defineProperties(HiddenSymbol.prototype, {
	constructor: d(SymbolPolyfill),
	toString: d('', function () { return this.__name__; })
});

// Proper implementation of methods exposed on Symbol.prototype
// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
defineProperties(SymbolPolyfill.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
	var symbol = validateSymbol(this);
	if (typeof symbol === 'symbol') return symbol;
	return symbol.toString();
}));
defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

// Note: It's important to define `toPrimitive` as last one, as some implementations
// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
// And that may invoke error in definition flow:
// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
	d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));

},{"./validate-symbol":24,"d":7}],24:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":22}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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
  currentDecl: null,

  newGrammar: function(name) {
    return new GrammarDecl(name);
  },

  grammar: function(metaInfo, name, superGrammar, defaultStartRule, rules) {
    var gDecl = new GrammarDecl(name);
    if (superGrammar) {
      gDecl.withSuperGrammar(this.fromRecipe(superGrammar));
    }
    if (defaultStartRule) {
      gDecl.withDefaultStartRule(defaultStartRule);
    }
    if (metaInfo && metaInfo.source) {
      gDecl.withSource(metaInfo.source);
    }

    var self = this;
    this.currentDecl = gDecl;
    Object.keys(rules).forEach(function(ruleName) {
      var ruleRecipe = rules[ruleName];

      var action = ruleRecipe[0]; // define/extend/override
      var metaInfo = ruleRecipe[1];
      var description = ruleRecipe[2];
      var formals = ruleRecipe[3];
      var body = self.fromRecipe(ruleRecipe[4]);

      var source;
      if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
        source = gDecl.source.subInterval(
            metaInfo.sourceInterval[0],
            metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
      }
      gDecl[action](ruleName, formals, body, description, source);
    });
    this.currentDecl = null;
    return gDecl.build();
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
      if (!(arg instanceof pexprs.PExpr)) {
        arg = this.fromRecipe(arg);
      }
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
      if (!(arg instanceof pexprs.PExpr)) {
        arg = this.fromRecipe(arg);
      }
      if (arg instanceof pexprs.Seq) {
        factors = factors.concat(arg.factors);
      } else {
        factors.push(arg);
      }
    }
    return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
  },

  star: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Star(expr);
  },

  plus: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Plus(expr);
  },

  opt: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Opt(expr);
  },

  not: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Not(expr);
  },

  la: function(expr) {
    // TODO: temporary to still be able to read old recipes
    return this.lookahead(expr);
  },

  lookahead: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Lookahead(expr);
  },

  lex: function(expr) {
    if (!(expr instanceof pexprs.PExpr)) {
      expr = this.fromRecipe(expr);
    }
    return new pexprs.Lex(expr);
  },

  app: function(ruleName, optParams) {
    if (optParams && optParams.length > 0) {
      optParams = optParams.map(function(param) {
        return param instanceof pexprs.PExpr ? param :
          this.fromRecipe(param);
      }, this);
    }
    return new pexprs.Apply(ruleName, optParams);
  },

  fromRecipe: function(recipe) {
    // the meta-info of 'grammar' is proccessed in Builder.grammar
    var result = this[recipe[0]].apply(this,
      recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2));

    var metaInfo = recipe[1];
    if (metaInfo) {
      if (metaInfo.sourceInterval && this.currentDecl) {
        result.withSource(
          this.currentDecl.sourceInterval.apply(this.currentDecl, metaInfo.sourceInterval)
        );
      }
    }
    return result;
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Builder;

},{"./GrammarDecl":32,"./pexprs":62}],29:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Failure = require('./Failure');
var TerminalNode = require('./nodes').TerminalNode;
var assert = require('./common').assert;
var inherits = require('inherits');
var pexprs = require('./pexprs');

function CaseInsensitiveTerminal(param) {
  this.obj = param;
}
inherits(CaseInsensitiveTerminal, pexprs.PExpr);

CaseInsensitiveTerminal.prototype = {
  _getString: function(state) {
    var terminal = state.currentApplication().args[this.obj.index];
    assert(terminal instanceof pexprs.Terminal, 'expected a Terminal expression');
    return terminal.obj;
  },

  // Implementation of the PExpr API

  allowsSkippingPrecedingSpace: function() {
    return true;
  },

  eval: function(state) {
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    var matchStr = this._getString(state);
    if (!inputStream.matchString(matchStr, true)) {
      state.processFailure(origPos, this);
      return false;
    } else {
      state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
      return true;
    }
  },

  generateExample: function(grammar, examples, inSyntacticContext, actuals) {
    // Start with a example generated from the Terminal...
    var str = this.obj.generateExample(grammar, examples, inSyntacticContext, actuals).value;

    // ...and randomly switch characters to uppercase/lowercase.
    var value = '';
    for (var i = 0; i < str.length; ++i) {
      value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
    }
    return {value: value};
  },

  getArity: function() {
    return 1;
  },

  substituteParams: function(actuals) {
    return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
  },

  toDisplayString: function() {
    return this.obj.toDisplayString() + ' (case-insensitive)';
  },

  toFailure: function() {
    return new Failure(this, this.obj.toFailure() + ' (case-insensitive)', 'description');
  },

  _isNullable: function(grammar, memo) {
    return this.obj._isNullable(grammar, memo);
  }
};

module.exports = CaseInsensitiveTerminal;

},{"./Failure":30,"./common":42,"./nodes":45,"./pexprs":62,"inherits":25}],30:[function(require,module,exports){
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

function Failure(pexpr, text, type) {
  if (!isValidType(type)) {
    throw new Error('invalid Failure type: ' + type);
  }
  this.pexpr = pexpr;
  this.text = text;
  this.type = type;
  this.fluffy = false;
}

Failure.prototype.getPExpr = function() {
  return this.pexpr;
};

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
  var failure = new Failure(this.pexpr, this.text, this.type);
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

},{}],31:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var CaseInsensitiveTerminal = require('./CaseInsensitiveTerminal');
var Matcher = require('./Matcher');
var Semantics = require('./Semantics');
var common = require('./common');
var errors = require('./errors');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getSortedRuleValues(grammar) {
  return Object.keys(grammar.rules).sort().map(function(name) { return grammar.rules[name]; });
}

function Grammar(
    name,
    superGrammar,
    rules,
    optDefaultStartRule) {
  this.name = name;
  this.superGrammar = superGrammar;
  this.rules = rules;
  if (optDefaultStartRule) {
    if (!(optDefaultStartRule in rules)) {
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
  matcher: function() {
    return new Matcher(this);
  },

  // Return true if the grammar is a built-in grammar, otherwise false.
  // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
  isBuiltIn: function() {
    return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
  },

  equals: function(g) {
    if (this === g) {
      return true;
    }
    // Do the cheapest comparisons first.
    if (g == null ||
        this.name !== g.name ||
        this.defaultStartRule !== g.defaultStartRule ||
        !(this.superGrammar === g.superGrammar || this.superGrammar.equals(g.superGrammar))) {
      return false;
    }
    var myRules = getSortedRuleValues(this);
    var otherRules = getSortedRuleValues(g);
    return myRules.length === otherRules.length && myRules.every(function(rule, i) {
      return rule.description === otherRules[i].description &&
             rule.formals.join(',') === otherRules[i].formals.join(',') &&
             rule.body.toString() === otherRules[i].body.toString();
    });
  },

  match: function(input, optStartApplication) {
    var m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.match(optStartApplication);
  },

  trace: function(input, optStartApplication) {
    var m = this.matcher();
    m.replaceInputRange(0, 0, input);
    return m.trace(optStartApplication);
  },

  semantics: function() {
    // TODO: Remove this eventually! Deprecated in v0.12.
    throw new Error('semantics() is deprecated -- use createSemantics() instead.');
  },

  createSemantics: function() {
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
      if (!isSpecialAction(k) && !(k in this.rules)) {
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
    return this.rules[actionName].body.getArity();
  },

  _inheritsFrom: function(grammar) {
    var g = this.superGrammar;
    while (g) {
      if (g.equals(grammar, true)) {
        return true;
      }
      g = g.superGrammar;
    }
    return false;
  },

  toRecipe: function(optVarName) {
    var metaInfo = {};
    // Include the grammar source if it is available.
    if (this.source) {
      metaInfo.source = this.source.contents;
    }

    var superGrammar = null;
    if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
      superGrammar = JSON.parse(this.superGrammar.toRecipe());
    }

    var startRule = null;
    if (this.defaultStartRule) {
      startRule = this.defaultStartRule;
    }

    var rules = {};
    var self = this;
    Object.keys(this.rules).forEach(function(ruleName) {
      var ruleInfo = self.rules[ruleName];
      var body = ruleInfo.body;
      var isDefinition = !self.superGrammar || !self.superGrammar.rules[ruleName];

      var operation;
      if (isDefinition) {
        operation = 'define';
      } else {
        operation = body instanceof pexprs.Extend ? 'extend' : 'override';
      }

      var metaInfo = {};
      if (ruleInfo.source && self.source) {
        var adjusted = ruleInfo.source.relativeTo(self.source);
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
      }

      var description = isDefinition ? ruleInfo.description : null;
      var bodyRecipe = body.outputRecipe(ruleInfo.formals, self.source);

      rules[ruleName] = [
        operation, // "define"/"extend"/"override"
        metaInfo,
        description,
        ruleInfo.formals,
        bodyRecipe
      ];
    });

    return JSON.stringify([
      'grammar',
      metaInfo,
      this.name,
      superGrammar,
      startRule,
      rules
    ]);
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
    for (var ruleName in this.rules) {
      var body = this.rules[ruleName].body;
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
    if (!(app.ruleName in this.rules)) {
      throw errors.undeclaredRule(app.ruleName, this.name);
    }
    var formals = this.rules[app.ruleName].formals;
    if (formals.length !== app.args.length) {
      var source = this.rules[app.ruleName].source;
      throw errors.wrongNumberOfParameters(app.ruleName, formals.length, app.args.length, source);
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
  {
    any: {
      body: pexprs.any,
      formals: [],
      description: 'any character',
      primitive: true
    },
    end: {
      body: pexprs.end,
      formals: [],
      description: 'end of input',
      primitive: true
    },

    caseInsensitive: {
      body: new CaseInsensitiveTerminal(new pexprs.Param(0)),
      formals: ['str'],
      primitive: true
    },
    lower: {
      body: new pexprs.UnicodeChar('Ll'),
      formals: [],
      description: 'a lowercase letter',
      primitive: true
    },
    upper: {
      body: new pexprs.UnicodeChar('Lu'),
      formals: [],
      description: 'an uppercase letter',
      primitive: true
    },
    // The union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
    unicodeLtmo: {
      body: new pexprs.UnicodeChar('Ltmo'),
      formals: [],
      description: 'a Unicode character in Lt, Lm, or Lo',
      primitive: true
    },

    // These rules are not truly primitive (they could be written in userland) but are defined
    // here for bootstrapping purposes.
    spaces: {
      body: new pexprs.Star(new pexprs.Apply('space')),
      formals: []
    },
    space: {
      body: new pexprs.Range('\x00', ' '),
      formals: [],
      description: 'a space'
    }
  }
);

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Grammar;

},{"./CaseInsensitiveTerminal":29,"./Matcher":37,"./Semantics":40,"./common":42,"./errors":43,"./pexprs":62}],32:[function(require,module,exports){
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
  return this.source.subInterval(startIdx, endIdx - startIdx);
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

GrammarDecl.prototype.installOverriddenOrExtendedRule = function(name, formals, body, source) {
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }
  var ruleInfo = this.ensureSuperGrammar().rules[name];
  var expectedFormals = ruleInfo.formals;
  var expectedNumFormals = expectedFormals ? expectedFormals.length : 0;
  if (formals.length !== expectedNumFormals) {
    throw errors.wrongNumberOfParameters(name, expectedNumFormals, formals.length, source);
  }
  return this.install(name, formals, body, ruleInfo.description, source);
};

GrammarDecl.prototype.install = function(name, formals, body, description, source) {
  this.rules[name] = {
    body: body.introduceParams(formals),
    formals: formals,
    description: description,
    source: source
  };
  return this;
};

// Stuff that you should only do once

GrammarDecl.prototype.withSuperGrammar = function(superGrammar) {
  if (this.superGrammar) {
    throw new Error('the super grammar of a GrammarDecl cannot be set more than once');
  }
  this.superGrammar = superGrammar;
  this.rules = Object.create(superGrammar.rules);

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
  this.source = new InputStream(source).interval(0, source.length);
  return this;
};

// Creates a Grammar instance, and if it passes the sanity checks, returns it.
GrammarDecl.prototype.build = function() {
  var grammar = new Grammar(
      this.name,
      this.ensureSuperGrammar(),
      this.rules,
      this.defaultStartRule);

  // TODO: change the pexpr.prototype.assert... methods to make them add
  // exceptions to an array that's provided as an arg. Then we'll be able to
  // show more than one error of the same type at a time.
  // TODO: include the offending pexpr in the errors, that way we can show
  // the part of the source that caused it.
  var grammarErrors = [];
  var grammarHasInvalidApplications = false;
  Object.keys(grammar.rules).forEach(function(ruleName) {
    var body = grammar.rules[ruleName].body;
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
    Object.keys(grammar.rules).forEach(function(ruleName) {
      var body = grammar.rules[ruleName].body;
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
  if (this.source) {
    grammar.source = this.source;
  }

  return grammar;
};

// Rule declarations

GrammarDecl.prototype.define = function(name, formals, body, description, source) {
  this.ensureSuperGrammar();
  if (this.superGrammar.rules[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.superGrammar.name, source);
  } else if (this.rules[name]) {
    throw errors.duplicateRuleDeclaration(name, this.name, this.name, source);
  }
  var duplicateParameterNames = common.getDuplicates(formals);
  if (duplicateParameterNames.length > 0) {
    throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
  }
  return this.install(name, formals, body, description, source);
};

GrammarDecl.prototype.override = function(name, formals, body, descIgnored, source) {
  var ruleInfo = this.ensureSuperGrammar().rules[name];
  if (!ruleInfo) {
    throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
  }
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

GrammarDecl.prototype.extend = function(name, formals, fragment, descIgnored, source) {
  var ruleInfo = this.ensureSuperGrammar().rules[name];
  if (!ruleInfo) {
    throw errors.cannotExtendUndeclaredRule(name, this.superGrammar.name, source);
  }
  var body = new pexprs.Extend(this.superGrammar, name, fragment);
  body.source = fragment.source;
  this.installOverriddenOrExtendedRule(name, formals, body, source);
  return this;
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = GrammarDecl;

},{"./Grammar":31,"./InputStream":33,"./common":42,"./errors":43,"./pexprs":62}],33:[function(require,module,exports){
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
  this.examinedLength = 0;
}

InputStream.prototype = {
  atEnd: function() {
    var ans = this.pos === this.source.length;
    this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
    return ans;
  },

  next: function() {
    var ans = this.source[this.pos++];
    this.examinedLength = Math.max(this.examinedLength, this.pos);
    return ans;
  },

  matchString: function(s, optIgnoreCase) {
    var idx;
    if (optIgnoreCase) {
      /*
        Case-insensitive comparison is a tricky business. Some notable gotchas include the
        "Turkish I" problem (http://www.i18nguy.com/unicode/turkish-i18n.html) and the fact
        that the German Esszet (ß) turns into "SS" in upper case.

        This is intended to be a locale-invariant comparison, which means it may not obey
        locale-specific expectations (e.g. "i" => "İ").
       */
      for (idx = 0; idx < s.length; idx++) {
        var actual = this.next();
        var expected = s[idx];
        if (actual == null || actual.toUpperCase() !== expected.toUpperCase()) {
          return false;
        }
      }
      return true;
    }
    // Default is case-sensitive comparison.
    for (idx = 0; idx < s.length; idx++) {
      if (this.next() !== s[idx]) { return false; }
    }
    return true;
  },

  sourceSlice: function(startIdx, endIdx) {
    return this.source.slice(startIdx, endIdx);
  },

  interval: function(startIdx, optEndIdx) {
    return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = InputStream;

},{"./Interval":34}],34:[function(require,module,exports){
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

function Interval(sourceString, startIdx, endIdx) {
  this.sourceString = sourceString;
  this.startIdx = startIdx;
  this.endIdx = endIdx;
}

Interval.coverage = function(/* interval1, interval2, ... */) {
  var sourceString = arguments[0].sourceString;
  var startIdx = arguments[0].startIdx;
  var endIdx = arguments[0].endIdx;
  for (var idx = 1; idx < arguments.length; idx++) {
    var interval = arguments[idx];
    if (interval.sourceString !== sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else {
      startIdx = Math.min(startIdx, arguments[idx].startIdx);
      endIdx = Math.max(endIdx, arguments[idx].endIdx);
    }
  }
  return new Interval(sourceString, startIdx, endIdx);
};

Interval.prototype = {
  coverageWith: function(/* interval1, interval2, ... */) {
    var intervals = Array.prototype.slice.call(arguments);
    intervals.push(this);
    return Interval.coverage.apply(undefined, intervals);
  },

  collapsedLeft: function() {
    return new Interval(this.sourceString, this.startIdx, this.startIdx);
  },

  collapsedRight: function() {
    return new Interval(this.sourceString, this.endIdx, this.endIdx);
  },

  getLineAndColumnMessage: function() {
    var range = [this.startIdx, this.endIdx];
    return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
  },

  // Returns an array of 0, 1, or 2 intervals that represents the result of the
  // interval difference operation.
  minus: function(that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    } else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
      // `this` and `that` are the same interval!
      return [
      ];
    } else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
      // `that` splits `this` into two intervals
      return [
        new Interval(this.sourceString, this.startIdx, that.startIdx),
        new Interval(this.sourceString, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
      // `that` contains a prefix of `this`
      return [
        new Interval(this.sourceString, that.endIdx, this.endIdx)
      ];
    } else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
      // `that` contains a suffix of `this`
      return [
        new Interval(this.sourceString, this.startIdx, that.startIdx)
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
  relativeTo: function(that) {
    if (this.sourceString !== that.sourceString) {
      throw errors.intervalSourcesDontMatch();
    }
    assert(this.startIdx >= that.startIdx && this.endIdx <= that.endIdx,
           'other interval does not cover this one');
    return new Interval(this.sourceString,
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
    return new Interval(this.sourceString, startIdx, endIdx);
  },

  subInterval: function(offset, len) {
    var newStartIdx = this.startIdx + offset;
    return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
  }
};

Object.defineProperties(Interval.prototype, {
  contents: {
    get: function() {
      if (this._contents === undefined) {
        this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
      }
      return this._contents;
    },
    enumerable: true
  },
  length: {
    get: function() { return this.endIdx - this.startIdx; },
    enumerable: true
  }
});

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Interval;


},{"./common":42,"./errors":43,"./util":63}],35:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var util = require('./util');
var Interval = require('./Interval');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function MatchResult(
    matcher,
    input,
    startExpr,
    cst,
    cstOffset,
    rightmostFailurePosition,
    optRecordedFailures) {

  this.matcher = matcher;
  this.input = input;
  this.startExpr = startExpr;
  this._cst = cst;
  this._cstOffset = cstOffset;
  this._rightmostFailurePosition = rightmostFailurePosition;
  this._rightmostFailures = optRecordedFailures;

  if (this.failed()) {
    common.defineLazyProperty(this, 'message', function() {
      var detail = 'Expected ' + this.getExpectedText();
      return util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
    });
    common.defineLazyProperty(this, 'shortMessage', function() {
      var detail = 'expected ' + this.getExpectedText();
      var errorInfo = util.getLineAndColumn(this.input, this.getRightmostFailurePosition());
      return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
    });
  }
}

MatchResult.prototype.succeeded = function() {
  return !!this._cst;
};

MatchResult.prototype.failed = function() {
  return !this.succeeded();
};

MatchResult.prototype.getRightmostFailurePosition = function() {
  return this._rightmostFailurePosition;
};

MatchResult.prototype.getRightmostFailures = function() {
  if (!this._rightmostFailures) {
    this.matcher.setInput(this.input);
    var matchResultWithFailures =
        this.matcher._match(this.startExpr, false, this.getRightmostFailurePosition());
    this._rightmostFailures = matchResultWithFailures.getRightmostFailures();
  }
  return this._rightmostFailures;
};

MatchResult.prototype.toString = function() {
  return this.succeeded() ?
      '[match succeeded]' :
      '[match failed at position ' + this.getRightmostFailurePosition() + ']';
};

// Return a string summarizing the expected contents of the input stream when
// the match failure occurred.
MatchResult.prototype.getExpectedText = function() {
  if (this.succeeded()) {
    throw new Error('cannot get expected text of a successful MatchResult');
  }

  var sb = new common.StringBuffer();
  var failures = this.getRightmostFailures();

  // Filter out the fluffy failures to make the default error messages more useful
  failures = failures.filter(function(failure) {
    return !failure.isFluffy();
  });

  for (var idx = 0; idx < failures.length; idx++) {
    if (idx > 0) {
      if (idx === failures.length - 1) {
        sb.append(failures.length > 2 ? ', or ' : ' or ');
      } else {
        sb.append(', ');
      }
    }
    sb.append(failures[idx].toString());
  }
  return sb.contents();
};

MatchResult.prototype.getInterval = function() {
  var pos = this.getRightmostFailurePosition();
  return new Interval(this.input, pos, pos);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchResult;

},{"./Interval":34,"./common":42,"./util":63}],36:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var InputStream = require('./InputStream');
var MatchResult = require('./MatchResult');
var PosInfo = require('./PosInfo');
var Trace = require('./Trace');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

var applySpaces = new pexprs.Apply('spaces');

function MatchState(matcher, startExpr, optPositionToRecordFailures) {
  this.matcher = matcher;
  this.startExpr = startExpr;

  this.grammar = matcher.grammar;
  this.input = matcher.input;
  this.inputStream = new InputStream(matcher.input);
  this.memoTable = matcher.memoTable;

  this._bindings = [];
  this._bindingOffsets = [];
  this._applicationStack = [];
  this._posStack = [0];
  this.inLexifiedContextStack = [false];

  this.rightmostFailurePosition = -1;
  this._rightmostFailurePositionStack = [];
  this._recordedFailuresStack = [];

  if (optPositionToRecordFailures !== undefined) {
    this.positionToRecordFailures = optPositionToRecordFailures;
    this.recordedFailures = Object.create(null);
  }
}

MatchState.prototype = {
  posToOffset: function(pos) {
    return pos - this._posStack[this._posStack.length - 1];
  },

  enterApplication: function(posInfo, app) {
    this._posStack.push(this.inputStream.pos);
    this._applicationStack.push(app);
    this.inLexifiedContextStack.push(false);
    posInfo.enter(app);
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this.rightmostFailurePosition = -1;
  },

  exitApplication: function(posInfo, optNode) {
    var origPos = this._posStack.pop();
    this._applicationStack.pop();
    this.inLexifiedContextStack.pop();
    posInfo.exit();

    this.rightmostFailurePosition = Math.max(
        this.rightmostFailurePosition,
        this._rightmostFailurePositionStack.pop());

    if (optNode) {
      this.pushBinding(optNode, origPos);
    }
  },

  enterLexifiedContext: function() {
    this.inLexifiedContextStack.push(true);
  },

  exitLexifiedContext: function() {
    this.inLexifiedContextStack.pop();
  },

  currentApplication: function() {
    return this._applicationStack[this._applicationStack.length - 1];
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
    this.pushFailuresInfo();
    this.eval(applySpaces);
    this.popBinding();
    this.popFailuresInfo();
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

  pushBinding: function(node, origPos) {
    this._bindings.push(node);
    this._bindingOffsets.push(this.posToOffset(origPos));
  },

  popBinding: function() {
    this._bindings.pop();
    this._bindingOffsets.pop();
  },

  numBindings: function() {
    return this._bindings.length;
  },

  truncateBindings: function(newLength) {
    // Yes, this is this really faster than setting the `length` property (tested with
    // bin/es5bench on Node v6.1.0).
    while (this._bindings.length > newLength) {
      this.popBinding();
    }
  },

  getCurrentPosInfo: function() {
    return this.getPosInfo(this.inputStream.pos);
  },

  getPosInfo: function(pos) {
    var posInfo = this.memoTable[pos];
    if (!posInfo) {
      posInfo = this.memoTable[pos] = new PosInfo();
    }
    return posInfo;
  },

  processFailure: function(pos, expr) {
    this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);

    if (this.recordedFailures && pos === this.positionToRecordFailures) {
      var app = this.currentApplication();
      if (app) {
        // Substitute parameters with the actual pexprs that were passed to
        // the current rule.
        expr = expr.substituteParams(app.args);
      } else {
        // This branch is only reached for the "end-check" that is
        // performed after the top-level application. In that case,
        // expr === pexprs.end so there is no need to substitute
        // parameters.
      }

      this.recordFailure(expr.toFailure(this.grammar), false);
    }
  },

  recordFailure: function(failure, shouldCloneIfNew) {
    var key = failure.toKey();
    if (!this.recordedFailures[key]) {
      this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
    } else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
      this.recordedFailures[key].clearFluffy();
    }
  },

  recordFailures: function(failures, shouldCloneIfNew) {
    var self = this;
    Object.keys(failures).forEach(function(key) {
      self.recordFailure(failures[key], shouldCloneIfNew);
    });
  },

  cloneRecordedFailures: function() {
    if (!this.recordedFailures) {
      return undefined;
    }

    var ans = Object.create(null);
    var self = this;
    Object.keys(this.recordedFailures).forEach(function(key) {
      ans[key] = self.recordedFailures[key].clone();
    });
    return ans;
  },

  getRightmostFailurePosition: function() {
    return this.rightmostFailurePosition;
  },

  _getRightmostFailureOffset: function() {
    return this.rightmostFailurePosition >= 0 ?
        this.posToOffset(this.rightmostFailurePosition) :
        -1;
  },

  // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
  getMemoizedTraceEntry: function(pos, expr) {
    var posInfo = this.memoTable[pos];
    if (posInfo && expr.ruleName) {
      var memoRec = posInfo.memo[expr.toMemoKey()];
      if (memoRec && memoRec.traceEntry) {
        var entry = memoRec.traceEntry.cloneWithExpr(expr);
        entry.isMemoized = true;
        return entry;
      }
    }
    return null;
  },

  // Returns a new trace entry, with the currently active trace array as its children.
  getTraceEntry: function(pos, expr, succeeded, bindings) {
    if (expr instanceof pexprs.Apply) {
      var app = this.currentApplication();
      var actuals = app ? app.args : [];
      expr = expr.substituteParams(actuals);
    }
    return this.getMemoizedTraceEntry(pos, expr) ||
           new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace);
  },

  isTracing: function() {
    return !!this.trace;
  },

  hasNecessaryInfo: function(memoRec) {
    if (this.trace && !memoRec.traceEntry) {
      return false;
    }

    if (this.recordedFailures &&
        this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
      return !!memoRec.failuresAtRightmostPosition;
    }

    return true;
  },


  useMemoizedResult: function(origPos, memoRec) {
    if (this.trace) {
      this.trace.push(memoRec.traceEntry);
    }

    var memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
    this.rightmostFailurePosition =
        Math.max(this.rightmostFailurePosition, memoRecRightmostFailurePosition);
    if (this.recordedFailures &&
        this.positionToRecordFailures === memoRecRightmostFailurePosition &&
        memoRec.failuresAtRightmostPosition) {
      this.recordFailures(memoRec.failuresAtRightmostPosition, true);
    }

    this.inputStream.examinedLength =
        Math.max(this.inputStream.examinedLength, memoRec.examinedLength + origPos);

    if (memoRec.value) {
      this.inputStream.pos += memoRec.matchLength;
      this.pushBinding(memoRec.value, origPos);
      return true;
    }
    return false;
  },

  // Evaluate `expr` and return `true` if it succeeded, `false` otherwise. On success, `bindings`
  // will have `expr.getArity()` more elements than before, and the input stream's position may
  // have increased. On failure, `bindings` and position will be unchanged.
  eval: function(expr) {
    var inputStream = this.inputStream;
    var origNumBindings = this._bindings.length;

    var origRecordedFailures;
    if (this.recordedFailures) {
      origRecordedFailures = this.recordedFailures;
      this.recordedFailures = Object.create(null);
    }

    var origPos = inputStream.pos;
    var memoPos = this.maybeSkipSpacesBefore(expr);

    var origTrace;
    if (this.trace) {
      origTrace = this.trace;
      this.trace = [];
    }

    // Do the actual evaluation.
    var ans = expr.eval(this);

    if (this.trace) {
      var bindings = this._bindings.slice(origNumBindings);
      var traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
      traceEntry.isImplicitSpaces = expr === applySpaces;
      traceEntry.isRootNode = expr === this.startExpr;
      origTrace.push(traceEntry);
      this.trace = origTrace;
    }

    if (ans) {
      if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
        var self = this;
        Object.keys(this.recordedFailures).forEach(function(key) {
          self.recordedFailures[key].makeFluffy();
        });
      }
    } else {
      // Reset the position and the bindings.
      inputStream.pos = origPos;
      this.truncateBindings(origNumBindings);
    }

    if (this.recordedFailures) {
      this.recordFailures(origRecordedFailures, false);
    }

    return ans;
  },

  getMatchResult: function() {
    this.eval(this.startExpr);
    var rightmostFailures;
    if (this.recordedFailures) {
      var self = this;
      rightmostFailures = Object.keys(this.recordedFailures).map(function(key) {
        return self.recordedFailures[key];
      });
    }
    return new MatchResult(
        this.matcher,
        this.input,
        this.startExpr,
        this._bindings[0],
        this._bindingOffsets[0],
        this.rightmostFailurePosition,
        rightmostFailures);
  },

  getTrace: function() {
    this.trace = [];
    var matchResult = this.getMatchResult();

    // The trace node for the start rule is always the last entry. If it is a syntactic rule,
    // the first entry is for an application of 'spaces'.
    // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
    // ensure that there is always a single root trace node.
    var rootTrace = this.trace[this.trace.length - 1];
    rootTrace.result = matchResult;
    return rootTrace;
  },

  pushFailuresInfo: function() {
    this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
    this._recordedFailuresStack.push(this.recordedFailures);
  },

  popFailuresInfo: function() {
    this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
    this.recordedFailures = this._recordedFailuresStack.pop();
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = MatchState;

},{"./InputStream":33,"./MatchResult":35,"./PosInfo":39,"./Trace":41,"./pexprs":62}],37:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var MatchState = require('./MatchState');

var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Matcher(grammar) {
  this.grammar = grammar;
  this.memoTable = [];
  this.input = '';
}

Matcher.prototype.getInput = function() {
  return this.input;
};

Matcher.prototype.setInput = function(str) {
  if (this.input !== str) {
    this.replaceInputRange(0, this.input.length, str);
  }
  return this;
};

Matcher.prototype.replaceInputRange = function(startIdx, endIdx, str) {
  var currentInput = this.input;
  if (startIdx < 0 || startIdx > currentInput.length ||
      endIdx < 0 || endIdx > currentInput.length ||
      startIdx > endIdx) {
    throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx);
  }

  // update input
  this.input = currentInput.slice(0, startIdx) + str + currentInput.slice(endIdx);

  // update memo table (similar to the above)
  var restOfMemoTable = this.memoTable.slice(endIdx);
  this.memoTable.length = startIdx;
  for (var idx = 0; idx < str.length; idx++) {
    this.memoTable.push(undefined);
  }
  restOfMemoTable.forEach(
      function(posInfo) { this.memoTable.push(posInfo); },
      this);

  // Invalidate memoRecs
  for (var pos = 0; pos < startIdx; pos++) {
    var posInfo = this.memoTable[pos];
    if (posInfo) {
      posInfo.clearObsoleteEntries(pos, startIdx);
    }
  }

  return this;
};

Matcher.prototype.match = function(optStartApplicationStr) {
  return this._match(this._getStartExpr(optStartApplicationStr), false);
};

Matcher.prototype.trace = function(optStartApplicationStr) {
  return this._match(this._getStartExpr(optStartApplicationStr), true);
};

Matcher.prototype._match = function(startExpr, tracing, optPositionToRecordFailures) {
  var state = new MatchState(this, startExpr, optPositionToRecordFailures);
  return tracing ? state.getTrace() : state.getMatchResult();
};

/*
  Returns the starting expression for this Matcher's associated grammar. If `optStartApplicationStr`
  is specified, it is a string expressing a rule application in the grammar. If not specified, the
  grammar's default start rule will be used.
*/
Matcher.prototype._getStartExpr = function(optStartApplicationStr) {
  var applicationStr = optStartApplicationStr || this.grammar.defaultStartRule;
  if (!applicationStr) {
    throw new Error('Missing start rule argument -- the grammar has no default start rule.');
  }

  var startApp = this.grammar.parseApplication(applicationStr);
  return new pexprs.Seq([startApp, pexprs.end]);
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = Matcher;

},{"./MatchState":36,"./pexprs":62}],38:[function(require,module,exports){
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

},{"util-extend":27}],39:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function PosInfo() {
  this.applicationMemoKeyStack = [];  // active applications at this position
  this.memo = {};
  this.maxExaminedLength = 0;
  this.maxRightmostFailureOffset = -1;
  this.currentLeftRecursion = undefined;
}

PosInfo.prototype = {
  isActive: function(application) {
    return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
  },

  enter: function(application) {
    this.applicationMemoKeyStack.push(application.toMemoKey());
  },

  exit: function() {
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
  },

  memoize: function(memoKey, memoRec) {
    this.memo[memoKey] = memoRec;
    this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
    this.maxRightmostFailureOffset =
        Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
    return memoRec;
  },

  clearObsoleteEntries: function(pos, invalidatedIdx) {
    if (pos + this.maxExaminedLength <= invalidatedIdx) {
      // Optimization: none of the rule applications that were memoized here examined the
      // interval of the input that changed, so nothing has to be invalidated.
      return;
    }

    var memo = this.memo;
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    var self = this;
    Object.keys(memo).forEach(function(k) {
      var memoRec = memo[k];
      if (pos + memoRec.examinedLength > invalidatedIdx) {
        delete memo[k];
      } else {
        self.maxExaminedLength = Math.max(self.maxExaminedLength, memoRec.examinedLength);
        self.maxRightmostFailureOffset =
            Math.max(self.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
      }
    });
  }
};

// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------

module.exports = PosInfo;

},{}],40:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var Symbol = require('es6-symbol');  // eslint-disable-line no-undef
var inherits = require('inherits');

var InputStream = require('./InputStream');
var IterationNode = require('./nodes').IterationNode;
var MatchResult = require('./MatchResult');
var common = require('./common');
var errors = require('./errors');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

// JSON is not a valid subset of JavaScript because there are two possible line terminators,
// U+2028 (line separator) and U+2029 (paragraph separator) that are allowed in JSON strings
// but not in JavaScript strings.
// jsonToJS() properly encodes those two characters in JSON so that it can seamlessly be
// inserted into JavaScript code (plus the encoded version is still valid JSON)
function jsonToJS(str) {
  var output = str.replace(/[\u2028\u2029]/g, function(char, pos, str) {
    var hex = char.codePointAt(0).toString(16);
    return '\\u' + '0000'.slice(hex.length) + hex;
  });
  return output;
}

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

// This is used by ohm editor to display a node wrapper appropriately.
Wrapper.prototype.toJSON = function() {
  return this.toString();
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
    var childNode = this._node.childAt(idx);
    var offset = this._node.childOffsets[idx];

    var source = this._baseInterval.subInterval(offset, childNode.matchLength);
    var base = childNode.isNonterminal() ? source : this._baseInterval;
    childWrapper = this._childWrappers[idx] = this._semantics.wrap(childNode, source, base);
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

// Create a new _iter wrapper in the same semantics as this wrapper.
Wrapper.prototype.iteration = function(optChildWrappers) {
  var childWrappers = optChildWrappers || [];

  var childNodes = childWrappers.map(function(c) { return c._node; });
  var iter = new IterationNode(this._node.grammar, childNodes, [], -1, false);

  var wrapper = this._semantics.wrap(iter, null, null);
  wrapper._childWrappers = childWrappers;
  return wrapper;
};

Object.defineProperties(Wrapper.prototype, {
  // Returns an array containing the children of this CST node.
  children: {get: function() { return this._children(); }},

  // Returns the name of grammar rule that created this CST node.
  ctorName: {get: function() { return this._node.ctorName; }},

  // TODO: Remove this eventually (deprecated in v0.12).
  interval: {get: function() {
    throw new Error('The `interval` property is deprecated -- use `source` instead');
  }},

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
  },

  // Returns the contents of the input stream consumed by this CST node.
  sourceString: {get: function() { return this.source.contents; }}
});

// ----------------- Semantics -----------------

// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.createSemantics()` and `g.extendSemantics(parentSemantics)`.
function Semantics(grammar, superSemantics) {
  var self = this;
  this.grammar = grammar;
  this.checkedActionDicts = false;

  // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
  // of an operation or attribute. Operations and attributes require double dispatch: the semantic
  // action is chosen based on both the node's type and the semantics. Wrappers ensure that
  // the `execute` method is called with the correct (most specific) semantics object as an
  // argument.
  this.Wrapper = function(node, sourceInterval, baseInterval) {
    self.checkActionDictsIfHaventAlready();
    this._semantics = self;
    this._node = node;
    this.source = sourceInterval;

    // The interval that the childOffsets of `node` are relative to. It should be the source
    // of the closest Nonterminal node.
    this._baseInterval = baseInterval;

    if (node.isNonterminal()) {
      common.assert(sourceInterval === baseInterval);
    }

    this._childWrappers = [];
  };

  this.super = superSemantics;
  if (superSemantics) {
    if (!(grammar.equals(this.super.grammar) || grammar._inheritsFrom(this.super.grammar))) {
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
  var name;
  for (name in this.operations) {
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
    str += '  return g.createSemantics()';
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
      '  var grammar = this.fromRecipe(' + jsonToJS(this.grammar.toRecipe()) + ');\n' +
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
  prototypeGrammarSemantics = grammar.createSemantics().addOperation('parse', {
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
      return this.sourceString;
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
      throw errors.missingSemanticAction(
          this.ctorName, name, type);
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
    try {
      var ans = thisThing.execute(this._semantics, this);

      this.args = oldArgs;
      return ans;
    } catch (e) {
      if (e.name === 'missingSemanticAction') {
        e.message += '\n' + this.ctorName;
      }
      throw e;
    }
  }

  if (type === 'operation') {
    this.Wrapper.prototype[name] = doIt;
    this.Wrapper.prototype[name].toString = function() {
      return '[' + name + ' operation]';
    };
  } else {
    Object.defineProperty(this.Wrapper.prototype, name, {
      get: doIt,
      configurable: true  // So the property can be deleted.
    });
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
Semantics.prototype.wrap = function(node, source, optBaseInterval) {
  var baseInterval = optBaseInterval || source;
  return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
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
    if (matchResult.failed()) {
      throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
    }

    var cst = matchResult._cst;
    if (cst.grammar !== grammar) {
      throw new Error(
          "Cannot use a MatchResult from grammar '" + cst.grammar.name +
          "' with a semantics for '" + grammar.name + "'");
    }
    var inputStream = new InputStream(matchResult.input);
    return s.wrap(cst, inputStream.interval(matchResult._cstOffset, matchResult.input.length));
  };

  // Forward public methods from the proxy to the semantics instance.
  proxy.addOperation = function(signature, actionDict) {
    s.addOperationOrAttribute('operation', signature, actionDict);
    return proxy;
  };
  proxy.extendOperation = function(name, actionDict) {
    s.extendOperationOrAttribute('operation', name, actionDict);
    return proxy;
  };
  proxy.addAttribute = function(name, actionDict) {
    s.addOperationOrAttribute('attribute', name, actionDict);
    return proxy;
  };
  proxy.extendAttribute = function(name, actionDict) {
    s.extendOperationOrAttribute('attribute', name, actionDict);
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
  proxy._remove = function(operationOrAttributeName) {
    var semantic;
    if (operationOrAttributeName in s.operations) {
      semantic = s.operations[operationOrAttributeName];
      delete s.operations[operationOrAttributeName];
    } else if (operationOrAttributeName in s.attributes) {
      semantic = s.attributes[operationOrAttributeName];
      delete s.attributes[operationOrAttributeName];
    }
    delete s.Wrapper.prototype[operationOrAttributeName];
    return semantic;
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

},{"./InputStream":33,"./MatchResult":35,"./common":42,"./errors":43,"./nodes":45,"es6-symbol":20,"inherits":25}],41:[function(require,module,exports){
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

// Return a string representation of a portion of `input` at offset `pos`.
// The result will contain exactly `len` characters.
function getInputExcerpt(input, pos, len) {
  var excerpt = asEscapedString(input.slice(pos, pos + len));

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

function Trace(input, pos1, pos2, expr, succeeded, bindings, optChildren) {
  this.input = input;
  this.pos = this.pos1 = pos1;
  this.pos2 = pos2;
  this.source = new Interval(input, pos1, pos2);
  this.expr = expr;
  this.succeeded = succeeded;
  this.bindings = bindings;
  this.children = optChildren || [];

  this.isHeadOfLeftRecursion = false;  // Is this the outermost LR application?
  this.isImplicitSpaces = false;
  this.isMemoized = false;
  this.isRootNode = false;
  this.terminatesLR = false;
  this.terminatingLREntry = null;
}

// A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.
Trace.prototype.SKIP = {};

Object.defineProperty(Trace.prototype, 'displayString', {
  get: function() { return this.expr.toDisplayString(); }
});

Trace.prototype.clone = function() {
  return this.cloneWithExpr(this.expr);
};

Trace.prototype.cloneWithExpr = function(expr) {
  var ans = new Trace(
      this.input, this.pos, this.pos2, expr, this.succeeded, this.bindings, this.children);

  ans.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion;
  ans.isImplicitSpaces = this.isImplicitSpaces;
  ans.isMemoized = this.isMemoized;
  ans.isRootNode = this.isRootNode;
  ans.terminatesLR = this.terminatesLR;
  ans.terminatingLREntry = this.terminatingLREntry;
  return ans;
};

// Record the trace information for the terminating condition of the LR loop.
Trace.prototype.recordLRTermination = function(ruleBodyTrace, value) {
  this.terminatingLREntry =
      new Trace(this.input, this.pos, this.pos2, this.expr, false, [value], [ruleBodyTrace]);
  this.terminatingLREntry.terminatesLR = true;
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
      node.children.forEach(function(child) {
        _walk(child, node, depth + 1);
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
    sb.append(getInputExcerpt(node.input, node.pos, 10) + spaces(depth * 2 + 1));
    sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);
    if (node.isHeadOfLeftRecursion) {
      sb.append(' (LR)');
    }
    if (node.succeeded) {
      var contents = asEscapedString(node.source.contents);
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

},{"./Interval":34,"./common":42}],42:[function(require,module,exports){
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
escapeStringFor["'".charCodeAt(0)] = "\\'";
escapeStringFor['"'.charCodeAt(0)] = '\\"';
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

exports.abstract = function(optMethodName) {
  var methodName = optMethodName || '';
  return function() {
    throw new Error(
      'this method ' + methodName + ' is abstract! ' +
      '(it has no implementation in class ' + this.constructor.name + ')');
  };
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
      default: return s.charAt(1);
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

},{"util-extend":27}],43:[function(require,module,exports){
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

function cannotOverrideUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
      'Cannot override rule ' + ruleName + ' because it is not declared in ' + grammarName,
      optSource);
}

// Cannot extend undeclared rule

function cannotExtendUndeclaredRule(ruleName, grammarName, optSource) {
  return createError(
      'Cannot extend rule ' + ruleName + ' because it is not declared in ' + grammarName,
      optSource);
}

// Duplicate rule declaration

function duplicateRuleDeclaration(ruleName, grammarName, declGrammarName, optSource) {
  var message = "Duplicate declaration for rule '" + ruleName +
      "' in grammar '" + grammarName + "'";
  if (grammarName !== declGrammarName) {
    message += " (originally declared in '" + declGrammarName + "')";
  }
  return createError(message, optSource);
}

// Wrong number of parameters

function wrongNumberOfParameters(ruleName, expected, actual, source) {
  return createError(
      'Wrong number of parameters for rule ' + ruleName +
          ' (expected ' + expected + ', got ' + actual + ')',
      source);
}

// Wrong number of arguments

function wrongNumberOfArguments(ruleName, expected, actual, expr) {
  return createError(
      'Wrong number of arguments for rule ' + ruleName +
          ' (expected ' + expected + ', got ' + actual + ')',
      expr.source);
}

// Duplicate parameter names

function duplicateParameterNames(ruleName, duplicates, source) {
  return createError(
      'Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(', '),
      source);
}

// Invalid parameter expression

function invalidParameter(ruleName, expr) {
  return createError(
      'Invalid parameter to rule ' + ruleName + ': ' + expr + ' has arity ' + expr.getArity() +
         ', but parameter expressions must have arity 1',
      expr.source);
}

// Application of syntactic rule from lexical rule

function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
  return createError(
      'Cannot apply syntactic rule ' + ruleName + ' from here (inside a lexical context)',
      applyExpr.source);
}

// ----------------- Kleene operators -----------------

function kleeneExprHasNullableOperand(kleeneExpr) {
  return createError(
      'Nullable expression ' + kleeneExpr.expr.source.contents + " is not allowed inside '" +
          kleeneExpr.operator + "' (possible infinite loop)",
      kleeneExpr.expr.source);
}

// ----------------- arity -----------------

function inconsistentArity(ruleName, expected, actual, expr) {
  return createError(
      'Rule ' + ruleName + ' involves an alternation which has inconsistent arity ' +
          '(expected ' + expected + ', got ' + actual + ')',
      expr.source);
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

// ----------------- semantic -----------------

function missingSemanticAction(ctorName, name, type) {
  var e = createError(
      'Missing semantic action for ' + ctorName + ' in ' + name + ' ' + type);
  e.name = 'missingSemanticAction';
  return e;
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
  missingSemanticAction: missingSemanticAction,
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

},{"./Namespace":38}],44:[function(require,module,exports){
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
  return obj === void 0;  // eslint-disable-line no-void
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
  var helpers = metaGrammar.createSemantics().addOperation('visit', {
    Grammar: function(n, s, open, rs, close) {
      var grammarName = n.visit();
      decl = builder.newGrammar(grammarName, namespace);
      s.visit();
      rs.visit();
      var g = decl.build();
      g.source = this.source.trimmed();
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
          throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
        }
        decl.withSuperGrammar(namespace[superGrammarName]);
      }
    },

    Rule_define: function(n, fs, d, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      // If there is no default start rule yet, set it now. This must be done before visiting
      // the body, because it might contain an inline rule definition.
      if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
        decl.withDefaultStartRule(currentRuleName);
      }
      var body = b.visit();
      var description = d.visit()[0];
      var source = this.source.trimmed();
      return decl.define(currentRuleName, currentRuleFormals, body, description, source);
    },
    Rule_override: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      overriding = true;
      var body = b.visit();
      var source = this.source.trimmed();
      var ans = decl.override(currentRuleName, currentRuleFormals, body, null, source);
      overriding = false;
      return ans;
    },
    Rule_extend: function(n, fs, _, b) {
      currentRuleName = n.visit();
      currentRuleFormals = fs.visit()[0] || [];
      var body = b.visit();
      var source = this.source.trimmed();
      var ans = decl.extend(currentRuleName, currentRuleFormals, body, null, source);
      return ans;
    },
    RuleBody: function(_, terms) {
      var args = terms.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },

    Formals: function(opointy, fs, cpointy) {
      return fs.visit();
    },

    Params: function(opointy, ps, cpointy) {
      return ps.visit();
    },

    Alt: function(seqs) {
      var args = seqs.visit();
      return builder.alt.apply(builder, args).withSource(this.source);
    },

    TopLevelTerm_inline: function(b, n) {
      var inlineRuleName = currentRuleName + '_' + n.visit();
      var body = b.visit();
      var source = this.source.trimmed();
      var isNewRuleDeclaration =
          !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
      if (overriding && !isNewRuleDeclaration) {
        decl.override(inlineRuleName, currentRuleFormals, body, null, source);
      } else {
        decl.define(inlineRuleName, currentRuleFormals, body, null, source);
      }
      var params = currentRuleFormals.map(function(formal) { return builder.app(formal); });
      return builder.app(inlineRuleName, params).withSource(body.source);
    },

    Seq: function(expr) {
      return builder.seq.apply(builder, expr.visit()).withSource(this.source);
    },

    Iter_star: function(x, _) {
      return builder.star(x.visit()).withSource(this.source);
    },
    Iter_plus: function(x, _) {
      return builder.plus(x.visit()).withSource(this.source);
    },
    Iter_opt: function(x, _) {
      return builder.opt(x.visit()).withSource(this.source);
    },

    Pred_not: function(_, x) {
      return builder.not(x.visit()).withSource(this.source);
    },
    Pred_lookahead: function(_, x) {
      return builder.lookahead(x.visit()).withSource(this.source);
    },

    Lex_lex: function(_, x) {
      return builder.lex(x.visit()).withSource(this.source);
    },

    Base_application: function(rule, ps) {
      return builder.app(rule.visit(), ps.visit()[0] || []).withSource(this.source);
    },
    Base_range: function(from, _, to) {
      return builder.range(from.visit(), to.visit()).withSource(this.source);
    },
    Base_terminal: function(expr) {
      return builder.terminal(expr.visit()).withSource(this.source);
    },
    Base_paren: function(open, x, close) {
      return x.visit();
    },

    ruleDescr: function(open, t, close) {
      return t.visit();
    },
    ruleDescrText: function(_) {
      return this.sourceString.trim();
    },

    caseName: function(_, space1, n, space2, end) {
      return n.visit();
    },

    name: function(first, rest) {
      return this.sourceString;
    },
    nameFirst: function(expr) {},
    nameRest: function(expr) {},

    terminal: function(open, cs, close) {
      return cs.visit().map(function(c) { return common.unescapeChar(c); }).join('');
    },

    terminalChar: function(_) {
      return this.sourceString;
    },

    escapeChar: function(_) {
      return this.sourceString;
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
    var interval = secondGrammar.source;
    throw new Error(
        util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
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

function makeRecipe(recipe) {
  if (typeof recipe === 'function') {
    return recipe.call(new Builder());
  } else {
    if (typeof recipe === 'string') {
      // stringified JSON recipe
      recipe = JSON.parse(recipe);
    }
    return (new Builder()).fromRecipe(recipe);
  }
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

},{"../dist/built-in-rules":1,"../dist/ohm-grammar":2,"../dist/operations-and-attributes":3,"../extras":5,"./Builder":28,"./Grammar":31,"./Namespace":38,"./Semantics":40,"./common":42,"./errors":43,"./pexprs":62,"./util":63,"is-buffer":26}],45:[function(require,module,exports){
'use strict';

var inherits = require('inherits');

var common = require('./common');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function Node(grammar, ctorName, matchLength) {
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.matchLength = matchLength;
}

Node.prototype.numChildren = function() {
  return this.children ? this.children.length : 0;
};

Node.prototype.childAt = function(idx) {
  if (this.children) {
    return this.children[idx];
  }
};

Node.prototype.indexOfChild = function(arg) {
  return this.children.indexOf(arg);
};

Node.prototype.hasChildren = function() {
  return this.numChildren() > 1;
};

Node.prototype.hasNoChildren = function() {
  return !this.hasChildren();
};

Node.prototype.onlyChild = function() {
  if (this.numChildren() !== 1) {
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

function TerminalNode(grammar, value) {
  var matchLength = value ? value.length : 0;
  Node.call(this, grammar, '_terminal', matchLength);
  this.primitiveValue = value;
}
inherits(TerminalNode, Node);

TerminalNode.prototype.isTerminal = function() {
  return true;
};

TerminalNode.prototype.toJSON = function() {
  var r = {};
  r[this.ctorName] = this.primitiveValue;
  return r;
};

// Nonterminals

function NonterminalNode(grammar, ruleName, children, childOffsets, matchLength) {
  Node.call(this, grammar, ruleName, matchLength);
  this.children = children;
  this.childOffsets = childOffsets;
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

function IterationNode(grammar, children, childOffsets, matchLength, isOptional) {
  Node.call(this, grammar, '_iter', matchLength);
  this.children = children;
  this.childOffsets = childOffsets;
  this.optional = isOptional;
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

},{"./common":42,"inherits":25}],46:[function(require,module,exports){
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
pexprs.PExpr.prototype.allowsSkippingPrecedingSpace = common.abstract(
  'allowsSkippingPrecedingSpace'
);

/*
  Generally, these are all first-order expressions and (with the exception of Apply)
  directly read from the input stream.
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
  Higher-order expressions that don't directly consume input.
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

},{"./common":42,"./pexprs":62}],47:[function(require,module,exports){
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

pexprs.PExpr.prototype._assertAllApplicationsAreValid = common.abstract(
  '_assertAllApplicationsAreValid'
);

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
  var ruleInfo = grammar.rules[this.ruleName];

  // Make sure that the rule exists...
  if (!ruleInfo) {
    throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
  }

  // ...and that this application is allowed
  if (common.isSyntactic(this.ruleName) && (!common.isSyntactic(ruleName) || lexifyCount > 0)) {
    throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
  }

  // ...and that this application has the correct number of arguments
  var actual = this.args.length;
  var expected = ruleInfo.formals.length;
  if (actual !== expected) {
    throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
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

},{"./common":42,"./errors":43,"./pexprs":62}],48:[function(require,module,exports){
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

pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract(
  'assertChoicesHaveUniformArity'
);

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

},{"./common":42,"./errors":43,"./pexprs":62}],49:[function(require,module,exports){
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

pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = common.abstract(
  'assertIteratedExprsAreNotNullable'
);

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

},{"./common":42,"./errors":43,"./pexprs":62}],50:[function(require,module,exports){
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

pexprs.PExpr.prototype.check = common.abstract('check');

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
  var body = grammar.rules[this.ruleName].body;
  return body.check(grammar, ruleNode.children) && ruleNode.numChildren() === body.getArity();
};

pexprs.UnicodeChar.prototype.check = function(grammar, vals) {
  return vals[0] instanceof nodes.Node &&
         vals[0].isTerminal() &&
         typeof vals[0].primitiveValue === 'string';
};

},{"./common":42,"./nodes":45,"./pexprs":62}],51:[function(require,module,exports){
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
pexprs.PExpr.prototype.eval = common.abstract('eval');  // function(state) { ... }

pexprs.any.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
  if (ch) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
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
    state.pushBinding(new TerminalNode(state.grammar, undefined), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

pexprs.Terminal.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  if (!inputStream.matchString(this.obj)) {
    state.processFailure(origPos, this);
    return false;
  } else {
    state.pushBinding(new TerminalNode(state.grammar, this.obj), origPos);
    return true;
  }
};

pexprs.Range.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
  if (ch && this.from <= ch && ch <= this.to) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
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
  var colOffsets = [];
  while (cols.length < arity) {
    cols.push([]);
    colOffsets.push([]);
  }

  var numMatches = 0;
  var idx;
  while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
    numMatches++;
    var row = state._bindings.splice(state._bindings.length - arity, arity);
    var rowOffsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
    for (idx = 0; idx < row.length; idx++) {
      cols[idx].push(row[idx]);
      colOffsets[idx].push(rowOffsets[idx]);
    }
  }
  if (numMatches < this.minNumMatches) {
    return false;
  }
  var startIdx = origPos;
  var matchLength = 0;
  if (numMatches > 0) {
    var lastCol = cols[arity - 1];
    var lastColOffsets = colOffsets[arity - 1];

    var endIdx =
        lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
    startIdx = colOffsets[0][0];
    matchLength = endIdx - startIdx;
  }
  var isOptional = this instanceof pexprs.Opt;
  for (idx = 0; idx < cols.length; idx++) {
    state._bindings.push(
        new IterationNode(state.grammar, cols[idx], colOffsets[idx], matchLength, isOptional));
    state._bindingOffsets.push(state.posToOffset(startIdx));
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
  state.pushFailuresInfo();

  var ans = state.eval(this.expr);

  state.popFailuresInfo();
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

  if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
    if (state.hasNecessaryInfo(memoRec)) {
      return state.useMemoizedResult(state.inputStream.pos, memoRec);
    }
    delete posInfo.memo[memoKey];
  }
  return app.reallyEval(state);
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
    memoRec = posInfo.memoize(
        memoKey,
        {matchLength: 0, examinedLength: 0, value: false, rightmostFailureOffset: -1});
    posInfo.startLeftRecursion(this, memoRec);
  }
  return state.useMemoizedResult(state.inputStream.pos, memoRec);
};

pexprs.Apply.prototype.reallyEval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var origPosInfo = state.getCurrentPosInfo();
  var ruleInfo = state.grammar.rules[this.ruleName];
  var body = ruleInfo.body;
  var description = ruleInfo.description;

  state.enterApplication(origPosInfo, this);

  if (description) {
    state.pushFailuresInfo();
  }

  // Reset the input stream's examinedLength property so that we can track
  // the examined length of this particular application.
  var origInputStreamExaminedLength = inputStream.examinedLength;
  inputStream.examinedLength = 0;

  var value = this.evalOnce(body, state);
  var currentLR = origPosInfo.currentLeftRecursion;
  var memoKey = this.toMemoKey();
  var isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
  var memoRec;

  if (isHeadOfLeftRecursion) {
    value = this.growSeedResult(body, state, origPos, currentLR, value);
    origPosInfo.endLeftRecursion();
    memoRec = currentLR;
    memoRec.examinedLength = inputStream.examinedLength - origPos;
    memoRec.rightmostFailureOffset = state._getRightmostFailureOffset();
    origPosInfo.memoize(memoKey, memoRec);  // updates origPosInfo's maxExaminedLength
  } else if (!currentLR || !currentLR.isInvolved(memoKey)) {
    // This application is not involved in left recursion, so it's ok to memoize it.
    memoRec = origPosInfo.memoize(memoKey, {
      matchLength: inputStream.pos - origPos,
      examinedLength: inputStream.examinedLength - origPos,
      value: value,
      failuresAtRightmostPosition: state.cloneRecordedFailures(),
      rightmostFailureOffset: state._getRightmostFailureOffset()
    });
  }
  var succeeded = !!value;

  if (description) {
    state.popFailuresInfo();
    if (!succeeded) {
      state.processFailure(origPos, this);
    }
    if (memoRec) {
      memoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();
    }
  }

  // Record trace information in the memo table, so that it is available if the memoized result
  // is used later.
  if (state.isTracing() && memoRec) {
    var entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);
    if (isHeadOfLeftRecursion) {
      common.assert(entry.terminatingLREntry != null || !succeeded);
      entry.isHeadOfLeftRecursion = true;
    }
    memoRec.traceEntry = entry;
  }

  // Fix the input stream's examinedLength -- it should be the maximum examined length
  // across all applications, not just this one.
  inputStream.examinedLength = Math.max(inputStream.examinedLength, origInputStreamExaminedLength);

  state.exitApplication(origPosInfo, value);

  return succeeded;
};

pexprs.Apply.prototype.evalOnce = function(expr, state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;

  if (state.eval(expr)) {
    var arity = expr.getArity();
    var bindings = state._bindings.splice(state._bindings.length - arity, arity);
    var offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
    return new NonterminalNode(
        state.grammar, this.ruleName, bindings, offsets, inputStream.pos - origPos);
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
    lrMemoRec.matchLength = inputStream.pos - origPos;
    lrMemoRec.value = newValue;
    lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();

    if (state.isTracing()) {
      // Before evaluating the body again, add a trace node for this application to the memo entry.
      // Its only child is a copy of the trace node from `newValue`, which will always be the last
      // element in `state.trace`.
      var seedTrace = state.trace[state.trace.length - 1];
      lrMemoRec.traceEntry = new Trace(
          state.input, origPos, inputStream.pos, this, true, [newValue], [seedTrace.clone()]);
    }
    inputStream.pos = origPos;
    newValue = this.evalOnce(body, state);
    if (inputStream.pos - origPos <= lrMemoRec.matchLength) {
      break;
    }
    if (state.isTracing()) {
      state.trace.splice(-2, 1);  // Drop the trace for the old seed.
    }
  }
  if (state.isTracing()) {
    // The last entry is for an unused result -- pop it and save it in the "real" entry.
    lrMemoRec.traceEntry.recordLRTermination(state.trace.pop(), newValue);
  }
  inputStream.pos = origPos + lrMemoRec.matchLength;
  return lrMemoRec.value;
};

pexprs.UnicodeChar.prototype.eval = function(state) {
  var inputStream = state.inputStream;
  var origPos = inputStream.pos;
  var ch = inputStream.next();
  if (ch && this.pattern.test(ch)) {
    state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
    return true;
  } else {
    state.processFailure(origPos, this);
    return false;
  }
};

},{"./Trace":41,"./common":42,"./nodes":45,"./pexprs":62}],52:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------

function flatten(listOfLists) {
  return Array.prototype.concat.apply([], listOfLists);
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.generateExample = common.abstract('generateExample');

function categorizeExamples(examples) {
  // A list of rules that the system needs examples of, in order to generate an example
  //   for the current rule
  var examplesNeeded = examples.filter(function(example) {
    return example.hasOwnProperty('examplesNeeded');
  })
  .map(function(example) { return example.examplesNeeded; });

  examplesNeeded = flatten(examplesNeeded);

  var uniqueExamplesNeeded = {};
  for (var i = 0; i < examplesNeeded.length; i++) {
    var currentExampleNeeded = examplesNeeded[i];
    uniqueExamplesNeeded[currentExampleNeeded] = true;
  }
  examplesNeeded = Object.keys(uniqueExamplesNeeded);

  // A list of successfully generated examples
  var successfulExamples = examples.filter(function(example) {
    return example.hasOwnProperty('value');
  })
  .map(function(item) { return item.value; });

  // This flag returns true if the system cannot generate the rule it is currently
  //   attempting to generate, regardless of whether or not it has the examples it needs.
  //   Currently, this is only used in overriding generators to prevent the system from
  //   generating examples for certain rules (e.g. 'ident').
  var needHelp = examples.some(function(item) { return item.needHelp; });

  return {
    examplesNeeded: examplesNeeded,
    successfulExamples: successfulExamples,
    needHelp: needHelp
  };
}

pexprs.any.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return {value: String.fromCharCode(Math.floor(Math.random() * 255))};
};

// Assumes that terminal's object is always a string
pexprs.Terminal.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {value: this.obj};
};

pexprs.Range.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  var rangeSize = this.to.charCodeAt(0) - this.from.charCodeAt(0);
  return {value: String.fromCharCode(
    this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random())
  )};
};

pexprs.Param.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return actuals[this.index].generateExample(grammar, examples, inSyntacticContext, actuals);
};

pexprs.Alt.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  // items -> termExamples
  var termExamples = this.terms.map(function(term) {
    return term.generateExample(grammar, examples, inSyntacticContext, actuals);
  });

  var categorizedExamples = categorizeExamples(termExamples);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHelp = categorizedExamples.needHelp;

  var ans = {};

  // Alt can contain both an example and a request for examples
  if (successfulExamples.length > 0) {
    var i = Math.floor(Math.random() * successfulExamples.length);
    ans.value = successfulExamples[i];
  }
  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }
  ans.needHelp = needHelp;

  return ans;
};

pexprs.Seq.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  var factorExamples = this.factors.map(function(factor) {
    return factor.generateExample(grammar, examples, inSyntacticContext, actuals);
  });
  var categorizedExamples = categorizeExamples(factorExamples);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;
  var needHelp = categorizedExamples.needHelp;

  var ans = {};

  // In a Seq, all pieces must succeed in order to have a successful example.
  if (examplesNeeded.length > 0 || needHelp) {
    ans.examplesNeeded = examplesNeeded;
    ans.needHelp = needHelp;
  } else {
    ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');
  }

  return ans;
};

pexprs.Iter.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  var rangeTimes = Math.min(this.maxNumMatches - this.minNumMatches, 3);
  var numTimes = Math.floor(Math.random() * (rangeTimes + 1) + this.minNumMatches);
  var items = [];

  for (var i = 0; i < numTimes; i++) {
    items.push(this.expr.generateExample(grammar, examples, inSyntacticContext, actuals));
  }

  var categorizedExamples = categorizeExamples(items);

  var examplesNeeded = categorizedExamples.examplesNeeded;
  var successfulExamples = categorizedExamples.successfulExamples;

  var ans = {};

  // It's always either one or the other.
  // TODO: instead of ' ', call 'spaces.generateExample()'
  ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');
  if (examplesNeeded.length > 0) {
    ans.examplesNeeded = examplesNeeded;
  }

  return ans;
};

// Right now, 'Not' and 'Lookahead' generate nothing and assume that whatever follows will
//   work according to the encoded constraints.
pexprs.Not.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {value: ''};
};

pexprs.Lookahead.prototype.generateExample = function(grammar, examples, inSyntacticContext) {
  return {value: ''};
};

pexprs.Lex.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  return this.expr.generateExample(grammar, examples, false, actuals);
};

pexprs.Apply.prototype.generateExample = function(grammar, examples, inSyntacticContext, actuals) {
  var ans = {};

  var ruleName = this.substituteParams(actuals).toString();

  if (!examples.hasOwnProperty(ruleName)) {
    ans.examplesNeeded = [ruleName];
  } else {
    var relevantExamples = examples[ruleName];
    var i = Math.floor(Math.random() * relevantExamples.length);
    ans.value = relevantExamples[i];
  }

  return ans;
};

pexprs.UnicodeChar.prototype.generateExample = function(
    grammar, examples, inSyntacticContext, actuals) {
  var char;
  switch (this.category) {
    case 'Lu': char = 'Á'; break;
    case 'Ll': char = 'ŏ'; break;
    case 'Lt': char = 'ǅ'; break;
    case 'Lm': char = 'ˮ'; break;
    case 'Lo': char = 'ƻ'; break;

    case 'Nl': char = 'ↂ'; break;
    case 'Nd': char = '½'; break;

    case 'Mn': char = '\u0487'; break;
    case 'Mc': char = 'ि'; break;

    case 'Pc': char = '⁀'; break;

    case 'Zs': char = '\u2001'; break;

    case 'L': char = 'Á'; break;
    case 'Ltmo': char = 'ǅ'; break;
  }
  return {value: char}; // 💩
};

},{"./common":42,"./pexprs":62}],53:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.getArity = common.abstract('getArity');

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

},{"./common":42,"./pexprs":62}],54:[function(require,module,exports){
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
pexprs.PExpr.prototype.introduceParams = common.abstract('introduceParams');

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

},{"./common":42,"./pexprs":62}],55:[function(require,module,exports){
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

pexprs.PExpr.prototype._isNullable = common.abstract('_isNullable');

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
    var body = grammar.rules[this.ruleName].body;
    var inlined = body.substituteParams(this.args);
    memo[key] = false;  // Prevent infinite recursion for recursive rules.
    memo[key] = inlined._isNullable(grammar, memo);
  }
  return memo[key];
};

},{"./common":42,"./pexprs":62}],56:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function getMetaInfo(expr, grammarInterval) {
  var metaInfo = {};
  if (expr.source && grammarInterval) {
    var adjusted = expr.source.relativeTo(grammarInterval);
    metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
  }
  return metaInfo;
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

pexprs.PExpr.prototype.outputRecipe = common.abstract('outputRecipe');

pexprs.any.outputRecipe = function(formals, grammarInterval) {
  return ['any', getMetaInfo(this, grammarInterval)];
};

pexprs.end.outputRecipe = function(formals, grammarInterval) {
  return ['end', getMetaInfo(this, grammarInterval)];
};

pexprs.Terminal.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'terminal',
    getMetaInfo(this, grammarInterval),
    this.obj
  ];
};

pexprs.Range.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'range',
    getMetaInfo(this, grammarInterval),
    this.from,
    this.to
  ];
};

pexprs.Param.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'param',
    getMetaInfo(this, grammarInterval),
    this.index
  ];
};

pexprs.Alt.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'alt',
    getMetaInfo(this, grammarInterval)
  ].concat(this.terms.map(function(term) {
    return term.outputRecipe(formals, grammarInterval);
  }));
};

pexprs.Extend.prototype.outputRecipe = function(formals, grammarInterval) {
  var extension = this.terms[0]; // [extension, orginal]
  return extension.outputRecipe(formals, grammarInterval);
};

pexprs.Seq.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'seq',
    getMetaInfo(this, grammarInterval)
  ].concat(this.factors.map(function(factor) {
    return factor.outputRecipe(formals, grammarInterval);
  }));
};

pexprs.Star.prototype.outputRecipe =
pexprs.Plus.prototype.outputRecipe =
pexprs.Opt.prototype.outputRecipe =
pexprs.Not.prototype.outputRecipe =
pexprs.Lookahead.prototype.outputRecipe =
pexprs.Lex.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    this.constructor.name.toLowerCase(),
    getMetaInfo(this, grammarInterval),
    this.expr.outputRecipe(formals, grammarInterval)
  ];
};

pexprs.Apply.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'app',
    getMetaInfo(this, grammarInterval),
    this.ruleName,
    this.args.map(function(arg) {
      return arg.outputRecipe(formals, grammarInterval);
    })
  ];
};

pexprs.UnicodeChar.prototype.outputRecipe = function(formals, grammarInterval) {
  return [
    'unicodeChar',
    getMetaInfo(this, grammarInterval),
    this.category
  ];
};

},{"./common":42,"./pexprs":62}],57:[function(require,module,exports){
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
// function(actuals) { ... }
pexprs.PExpr.prototype.substituteParams = common.abstract('substituteParams');

pexprs.any.substituteParams =
pexprs.end.substituteParams =
pexprs.Terminal.prototype.substituteParams =
pexprs.Range.prototype.substituteParams =
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

},{"./common":42,"./pexprs":62}],58:[function(require,module,exports){
'use strict';

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------

var common = require('./common');
var pexprs = require('./pexprs');

var copyWithoutDuplicates = common.copyWithoutDuplicates;

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------

function isRestrictedJSIdentifier(str) {
  return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str);
}

function resolveDuplicatedNames(argumentNameList) {
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
}

// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------

/*
  Returns a list of strings that will be used as the default argument names for its receiver
  (a pexpr) in a semantic action. This is used exclusively by the Semantics Editor.

  `firstArgIndex` is the 1-based index of the first argument name that will be generated for this
  pexpr. It enables us to name arguments positionally, e.g., if the second argument is a
  non-alphanumeric terminal like "+", it will be named '$2'.

  `noDupCheck` is true if the caller of `toArgumentNameList` is not a top level caller. It enables
  us to avoid nested duplication subscripts appending, e.g., '_1_1', '_1_2', by only checking
  duplicates at the top level.

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
// function(firstArgIndex, noDupCheck) { ... }
pexprs.PExpr.prototype.toArgumentNameList = common.abstract('toArgumentNameList');

pexprs.any.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['any'];
};

pexprs.end.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['end'];
};

pexprs.Terminal.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  if (typeof this.obj === 'string' && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
    // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
    return ['_' + this.obj];
  } else {
    // Otherwise, name it positionally.
    return ['$' + firstArgIndex];
  }
};

pexprs.Range.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  var argName = this.from + '_to_' + this.to;
  // If the `argName` is not valid then try to prepend a `_`.
  if (!isRestrictedJSIdentifier(argName)) {
    argName = '_' + argName;
  }
  // If the `argName` still not valid after prepending a `_`, then name it positionally.
  if (!isRestrictedJSIdentifier(argName)) {
    argName = '$' + firstArgIndex;
  }
  return [argName];
};

pexprs.Alt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  // `termArgNameLists` is an array of arrays where each row is the
  // argument name list that corresponds to a term in this alternation.
  var termArgNameLists = this.terms.map(function(term) {
    return term.toArgumentNameList(firstArgIndex, true);
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

  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Seq.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  // Generate the argument name list, without worrying about duplicates.
  var argumentNameList = [];
  this.factors.forEach(function(factor) {
    var factorArgumentNameList = factor.toArgumentNameList(firstArgIndex, true);
    argumentNameList = argumentNameList.concat(factorArgumentNameList);

    // Shift the firstArgIndex to take this factor's argument names into account.
    firstArgIndex += factorArgumentNameList.length;
  });
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Iter.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  var argumentNameList = this.expr.toArgumentNameList(firstArgIndex, noDupCheck)
    .map(function(exprArgumentString) {
      return exprArgumentString[exprArgumentString.length - 1] === 's' ?
          exprArgumentString + 'es' :
          exprArgumentString + 's';
    });
  if (!noDupCheck) {
    resolveDuplicatedNames(argumentNameList);
  }
  return argumentNameList;
};

pexprs.Opt.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(function(argName) {
    return 'opt' + argName[0].toUpperCase() + argName.slice(1);
  });
};

pexprs.Not.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return [];
};

pexprs.Lookahead.prototype.toArgumentNameList =
pexprs.Lex.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return this.expr.toArgumentNameList(firstArgIndex, noDupCheck);
};

pexprs.Apply.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return [this.ruleName];
};

pexprs.UnicodeChar.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['$' + firstArgIndex];
};

pexprs.Param.prototype.toArgumentNameList = function(firstArgIndex, noDupCheck) {
  return ['param' + this.index];
};

// "Value pexprs" (Value, Str, Arr, Obj) are going away soon, so we don't worry about them here.

},{"./common":42,"./pexprs":62}],59:[function(require,module,exports){
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
pexprs.PExpr.prototype.toDisplayString = common.abstract('toDisplayString');

pexprs.Alt.prototype.toDisplayString =
pexprs.Seq.prototype.toDisplayString =
pexprs.Iter.prototype.toDisplayString =
pexprs.Not.prototype.toDisplayString =
pexprs.Lookahead.prototype.toDisplayString =
pexprs.Lex.prototype.toDisplayString = function() {
  if (this.source) {
    return this.source.trimmed().contents;
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

},{"./common":42,"./pexprs":62}],60:[function(require,module,exports){
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

pexprs.PExpr.prototype.toFailure = common.abstract('toFailure');

pexprs.any.toFailure = function(grammar) {
  return new Failure(this, 'any object', 'description');
};

pexprs.end.toFailure = function(grammar) {
  return new Failure(this, 'end of input', 'description');
};

pexprs.Terminal.prototype.toFailure = function(grammar) {
  return new Failure(this, this.obj, 'string');
};

pexprs.Range.prototype.toFailure = function(grammar) {
  // TODO: come up with something better
  return new Failure(this, JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};

pexprs.Not.prototype.toFailure = function(grammar) {
  var description = this.expr === pexprs.any ?
      'nothing' :
      'not ' + this.expr.toFailure(grammar);
  return new Failure(this, description, 'description');
};

pexprs.Lookahead.prototype.toFailure = function(grammar) {
  return this.expr.toFailure(grammar);
};

pexprs.Apply.prototype.toFailure = function(grammar) {
  var description = grammar.rules[this.ruleName].description;
  if (!description) {
    var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
    description = article + ' ' + this.ruleName;
  }
  return new Failure(this, description, 'description');
};

pexprs.UnicodeChar.prototype.toFailure = function(grammar) {
  return new Failure(this, 'a Unicode [' + this.category + '] character', 'description');
};

pexprs.Alt.prototype.toFailure = function(grammar) {
  var fs = this.terms.map(function(t) { return t.toFailure(); });
  var description = '(' + fs.join(' or ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Seq.prototype.toFailure = function(grammar) {
  var fs = this.factors.map(function(f) { return f.toFailure(); });
  var description = '(' + fs.join(' ') + ')';
  return new Failure(this, description, 'description');
};

pexprs.Iter.prototype.toFailure = function(grammar) {
  var description = '(' + this.expr.toFailure() + this.operator + ')';
  return new Failure(this, description, 'description');
};

},{"./Failure":30,"./common":42,"./pexprs":62}],61:[function(require,module,exports){
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
pexprs.PExpr.prototype.toString = common.abstract('toString');

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

},{"./common":42,"./pexprs":62}],62:[function(require,module,exports){
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

// Set the `source` property to the interval containing the source for this expression.
PExpr.prototype.withSource = function(interval) {
  if (interval) {
    this.source = interval.trimmed();
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
  var origBody = superGrammar.rules[name].body;
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
require('./pexprs-generateExample');
require('./pexprs-outputRecipe');
require('./pexprs-introduceParams');
require('./pexprs-isNullable');
require('./pexprs-substituteParams');
require('./pexprs-toDisplayString');
require('./pexprs-toArgumentNameList');
require('./pexprs-toFailure');
require('./pexprs-toString');

},{"../third_party/UnicodeCategories":64,"./common":42,"./errors":43,"./pexprs-allowsSkippingPrecedingSpace":46,"./pexprs-assertAllApplicationsAreValid":47,"./pexprs-assertChoicesHaveUniformArity":48,"./pexprs-assertIteratedExprsAreNotNullable":49,"./pexprs-check":50,"./pexprs-eval":51,"./pexprs-generateExample":52,"./pexprs-getArity":53,"./pexprs-introduceParams":54,"./pexprs-isNullable":55,"./pexprs-outputRecipe":56,"./pexprs-substituteParams":57,"./pexprs-toArgumentNameList":58,"./pexprs-toDisplayString":59,"./pexprs-toFailure":60,"./pexprs-toString":61,"inherits":25}],63:[function(require,module,exports){
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

},{"./common":42}],64:[function(require,module,exports){
// Based on https://github.com/mathiasbynens/unicode-9.0.0.
// These are just categories that are used in ES5/ES2015.
// The full list of Unicode categories is here: http://www.fileformat.info/info/unicode/category/index.htm.
module.exports = {
  // Letters
  Lu: /[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]|\uD801[\uDC00-\uDC27\uDCB0-\uDCD3]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21]/,
  Ll: /[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD83A[\uDD22-\uDD43]/,
  Lt: /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/,
  Lm: /[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]/,
  Lo: /[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,

  // Numbers
  Nl: /[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]|\uD800[\uDD40-\uDD74\uDF41\uDF4A\uDFD1-\uDFD5]|\uD809[\uDC00-\uDC6E]/,
  Nd: /[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]|\uD801[\uDCA0-\uDCA9]|\uD804[\uDC66-\uDC6F\uDCF0-\uDCF9\uDD36-\uDD3F\uDDD0-\uDDD9\uDEF0-\uDEF9]|[\uD805\uD807][\uDC50-\uDC59\uDCD0-\uDCD9\uDE50-\uDE59\uDEC0-\uDEC9\uDF30-\uDF39]|\uD806[\uDCE0-\uDCE9]|\uD81A[\uDE60-\uDE69\uDF50-\uDF59]|\uD835[\uDFCE-\uDFFF]|\uD83A[\uDD50-\uDD59]/,

  // Marks
  Mn: /[\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D4-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D01\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABD\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFB-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC01\uDC38-\uDC46\uDC7F-\uDC81\uDCB3-\uDCB6\uDCB9\uDCBA\uDD00-\uDD02\uDD27-\uDD2B\uDD2D-\uDD34\uDD73\uDD80\uDD81\uDDB6-\uDDBE\uDDCA-\uDDCC\uDE2F-\uDE31\uDE34\uDE36\uDE37\uDE3E\uDEDF\uDEE3-\uDEEA\uDF00\uDF01\uDF3C\uDF40\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC38-\uDC3F\uDC42-\uDC44\uDC46\uDCB3-\uDCB8\uDCBA\uDCBF\uDCC0\uDCC2\uDCC3\uDDB2-\uDDB5\uDDBC\uDDBD\uDDBF\uDDC0\uDDDC\uDDDD\uDE33-\uDE3A\uDE3D\uDE3F\uDE40\uDEAB\uDEAD\uDEB0-\uDEB5\uDEB7\uDF1D-\uDF1F\uDF22-\uDF25\uDF27-\uDF2B]|\uD807[\uDC30-\uDC36\uDC38-\uDC3D\uDC3F\uDC92-\uDCA7\uDCAA-\uDCB0\uDCB2\uDCB3\uDCB5\uDCB6]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD67-\uDD69\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A]|\uDB40[\uDD00-\uDDEF]/,
  Mc: /[\u0903-\u0903]|[\u093E-\u0940]|[\u0949-\u094C]|[\u0982-\u0983]|[\u09BE-\u09C0]|[\u09C7-\u09C8]|[\u09CB-\u09CC]|[\u09D7-\u09D7]|[\u0A3E-\u0A40]|[\u0A83-\u0A83]|[\u0ABE-\u0AC0]|[\u0AC9-\u0AC9]|[\u0ACB-\u0ACC]|[\u0B02-\u0B03]|[\u0B3E-\u0B3E]|[\u0B40-\u0B40]|[\u0B47-\u0B48]|[\u0B4B-\u0B4C]|[\u0B57-\u0B57]|[\u0B83-\u0B83]|[\u0BBE-\u0BBF]|[\u0BC1-\u0BC2]|[\u0BC6-\u0BC8]|[\u0BCA-\u0BCC]|[\u0BD7-\u0BD7]|[\u0C01-\u0C03]|[\u0C41-\u0C44]|[\u0C82-\u0C83]|[\u0CBE-\u0CBE]|[\u0CC0-\u0CC4]|[\u0CC7-\u0CC8]|[\u0CCA-\u0CCB]|[\u0CD5-\u0CD6]|[\u0D02-\u0D03]|[\u0D3E-\u0D40]|[\u0D46-\u0D48]|[\u0D4A-\u0D4C]|[\u0D57-\u0D57]|[\u0F3E-\u0F3F]|[\u0F7F-\u0F7F]/,

  // Punctuation, Connector
  Pc: /[_\u203F\u2040\u2054\uFE33\uFE34\uFE4D-\uFE4F\uFF3F]/,

  // Separator, Space
  Zs: /[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,

  // These two are not real Unicode categories, but our useful for Ohm.
  // L is a combination of all the letter categories.
  // Ltmo is a combination of Lt, Lm, and Lo.
  L: /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
  Ltmo: /[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]|[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5\u06E6\u07F4\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA69C\uA69D\uA717-\uA71F\uA770\uA788\uA7F8\uA7F9\uA9CF\uA9E6\uAA70\uAADD\uAAF3\uAAF4\uAB5C-\uAB5F\uFF70\uFF9E\uFF9F]|\uD81A[\uDF40-\uDF43]|\uD81B[\uDF93-\uDF9F\uDFE0]|[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E45\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A\uA62B\uA66E\uA6A0-\uA6E5\uA78F\uA7F7\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9E0-\uA9E4\uA9E7-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC50-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/
};

},{}]},{},[44])(44)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwiZGlzdC9vaG0tZ3JhbW1hci5qcyIsImRpc3Qvb3BlcmF0aW9ucy1hbmQtYXR0cmlidXRlcy5qcyIsImV4dHJhcy9WaXNpdG9yRmFtaWx5LmpzIiwiZXh0cmFzL2luZGV4LmpzIiwiZXh0cmFzL3NlbWFudGljcy10b0FTVC5qcyIsIm5vZGVfbW9kdWxlcy9kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2Fzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9hc3NpZ24vaXMtaW1wbGVtZW50ZWQuanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3QvYXNzaWduL3NoaW0uanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3QvaXMtY2FsbGFibGUuanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3Qva2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9rZXlzL2lzLWltcGxlbWVudGVkLmpzIiwibm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2tleXMvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9ub3JtYWxpemUtb3B0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC92YWxpZC12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNS1leHQvc3RyaW5nLyMvY29udGFpbnMvaXMtaW1wbGVtZW50ZWQuanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucy9zaGltLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9pcy1pbXBsZW1lbnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL2lzLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvdmFsaWRhdGUtc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3V0aWwtZXh0ZW5kL2V4dGVuZC5qcyIsInNyYy9CdWlsZGVyLmpzIiwic3JjL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLmpzIiwic3JjL0ZhaWx1cmUuanMiLCJzcmMvR3JhbW1hci5qcyIsInNyYy9HcmFtbWFyRGVjbC5qcyIsInNyYy9JbnB1dFN0cmVhbS5qcyIsInNyYy9JbnRlcnZhbC5qcyIsInNyYy9NYXRjaFJlc3VsdC5qcyIsInNyYy9NYXRjaFN0YXRlLmpzIiwic3JjL01hdGNoZXIuanMiLCJzcmMvTmFtZXNwYWNlLmpzIiwic3JjL1Bvc0luZm8uanMiLCJzcmMvU2VtYW50aWNzLmpzIiwic3JjL1RyYWNlLmpzIiwic3JjL2NvbW1vbi5qcyIsInNyYy9lcnJvcnMuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9ub2Rlcy5qcyIsInNyYy9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZS5qcyIsInNyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJzcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzIiwic3JjL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUuanMiLCJzcmMvcGV4cHJzLWNoZWNrLmpzIiwic3JjL3BleHBycy1ldmFsLmpzIiwic3JjL3BleHBycy1nZW5lcmF0ZUV4YW1wbGUuanMiLCJzcmMvcGV4cHJzLWdldEFyaXR5LmpzIiwic3JjL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMuanMiLCJzcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCJzcmMvcGV4cHJzLW91dHB1dFJlY2lwZS5qcyIsInNyYy9wZXhwcnMtc3Vic3RpdHV0ZVBhcmFtcy5qcyIsInNyYy9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0LmpzIiwic3JjL3BleHBycy10b0Rpc3BsYXlTdHJpbmcuanMiLCJzcmMvcGV4cHJzLXRvRmFpbHVyZS5qcyIsInNyYy9wZXhwcnMtdG9TdHJpbmcuanMiLCJzcmMvcGV4cHJzLmpzIiwic3JjL3V0aWwuanMiLCJ0aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaldBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoW1wiZ3JhbW1hclwiLHtcInNvdXJjZVwiOlwiQnVpbHRJblJ1bGVzIHtcXG5cXG4gIGFsbnVtICAoYW4gYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXIpXFxuICAgID0gbGV0dGVyXFxuICAgIHwgZGlnaXRcXG5cXG4gIGxldHRlciAgKGEgbGV0dGVyKVxcbiAgICA9IGxvd2VyXFxuICAgIHwgdXBwZXJcXG4gICAgfCB1bmljb2RlTHRtb1xcblxcbiAgZGlnaXQgIChhIGRpZ2l0KVxcbiAgICA9IFxcXCIwXFxcIi4uXFxcIjlcXFwiXFxuXFxuICBoZXhEaWdpdCAgKGEgaGV4YWRlY2ltYWwgZGlnaXQpXFxuICAgID0gZGlnaXRcXG4gICAgfCBcXFwiYVxcXCIuLlxcXCJmXFxcIlxcbiAgICB8IFxcXCJBXFxcIi4uXFxcIkZcXFwiXFxuXFxuICBMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IE5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgfCBFbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuXFxuICBOb25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gZWxlbSAoc2VwIGVsZW0pKlxcblxcbiAgRW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IC8qIG5vdGhpbmcgKi9cXG5cXG4gIGxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gbm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICB8IGVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG5cXG4gIG5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBlbGVtIChzZXAgZWxlbSkqXFxuXFxuICBlbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gLyogbm90aGluZyAqL1xcblxcbn1cIn0sXCJCdWlsdEluUnVsZXNcIixudWxsLG51bGwse1wiYWxudW1cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOCw3OF19LFwiYW4gYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXJcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MCw3OF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYwLDY2XX0sXCJsZXR0ZXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzMsNzhdfSxcImRpZ2l0XCIsW11dXV0sXCJsZXR0ZXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MiwxNDJdfSxcImEgbGV0dGVyXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA3LDE0Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNywxMTJdfSxcImxvd2VyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExOSwxMjRdfSxcInVwcGVyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxNDJdfSxcInVuaWNvZGVMdG1vXCIsW11dXV0sXCJkaWdpdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NiwxNzddfSxcImEgZGlnaXRcIixbXSxbXCJyYW5nZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OSwxNzddfSxcIjBcIixcIjlcIl1dLFwiaGV4RGlnaXRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODEsMjU0XX0sXCJhIGhleGFkZWNpbWFsIGRpZ2l0XCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5LDI1NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOSwyMjRdfSxcImRpZ2l0XCIsW11dLFtcInJhbmdlXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMxLDIzOV19LFwiYVwiLFwiZlwiXSxbXCJyYW5nZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NiwyNTRdfSxcIkFcIixcIkZcIl1dXSxcIkxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1OCwzMzZdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyODIsMzM2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjgyLDMwN119LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7fSwwXSxbXCJwYXJhbVwiLHt9LDFdXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzE0LDMzNl19LFwiRW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7fSwwXSxbXCJwYXJhbVwiLHt9LDFdXV1dXSxcIk5vbmVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzQwLDM4OF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3MiwzODhdfSxbXCJwYXJhbVwiLHt9LDBdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsMzg4XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc4LDM4Nl19LFtcInBhcmFtXCIse30sMV0sW1wicGFyYW1cIix7fSwwXV1dXV0sXCJFbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM5Miw0MzRdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MzgsNDM4XX1dXSxcImxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQzOCw1MTZdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NjIsNTE2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDYyLDQ4N119LFwibm9uZW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7fSwwXSxbXCJwYXJhbVwiLHt9LDFdXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDk0LDUxNl19LFwiZW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7fSwwXSxbXCJwYXJhbVwiLHt9LDFdXV1dXSxcIm5vbmVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTIwLDU2OF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1Miw1NjhdfSxbXCJwYXJhbVwiLHt9LDBdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTcsNTY4XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTU4LDU2Nl19LFtcInBhcmFtXCIse30sMV0sW1wicGFyYW1cIix7fSwwXV1dXV0sXCJlbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU3Miw2MTRdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTYsNjE2XX1dXX1dKTtcbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShbXCJncmFtbWFyXCIse1wic291cmNlXCI6XCJPaG0ge1xcblxcbiAgR3JhbW1hcnNcXG4gICAgPSBHcmFtbWFyKlxcblxcbiAgR3JhbW1hclxcbiAgICA9IGlkZW50IFN1cGVyR3JhbW1hcj8gXFxcIntcXFwiIFJ1bGUqIFxcXCJ9XFxcIlxcblxcbiAgU3VwZXJHcmFtbWFyXFxuICAgID0gXFxcIjw6XFxcIiBpZGVudFxcblxcbiAgUnVsZVxcbiAgICA9IGlkZW50IEZvcm1hbHM/IHJ1bGVEZXNjcj8gXFxcIj1cXFwiICBSdWxlQm9keSAgLS0gZGVmaW5lXFxuICAgIHwgaWRlbnQgRm9ybWFscz8gICAgICAgICAgICBcXFwiOj1cXFwiIFJ1bGVCb2R5ICAtLSBvdmVycmlkZVxcbiAgICB8IGlkZW50IEZvcm1hbHM/ICAgICAgICAgICAgXFxcIis9XFxcIiBSdWxlQm9keSAgLS0gZXh0ZW5kXFxuXFxuICBSdWxlQm9keVxcbiAgICA9IFxcXCJ8XFxcIj8gTm9uZW1wdHlMaXN0T2Y8VG9wTGV2ZWxUZXJtLCBcXFwifFxcXCI+XFxuXFxuICBUb3BMZXZlbFRlcm1cXG4gICAgPSBTZXEgY2FzZU5hbWUgIC0tIGlubGluZVxcbiAgICB8IFNlcVxcblxcbiAgRm9ybWFsc1xcbiAgICA9IFxcXCI8XFxcIiBMaXN0T2Y8aWRlbnQsIFxcXCIsXFxcIj4gXFxcIj5cXFwiXFxuXFxuICBQYXJhbXNcXG4gICAgPSBcXFwiPFxcXCIgTGlzdE9mPFNlcSwgXFxcIixcXFwiPiBcXFwiPlxcXCJcXG5cXG4gIEFsdFxcbiAgICA9IE5vbmVtcHR5TGlzdE9mPFNlcSwgXFxcInxcXFwiPlxcblxcbiAgU2VxXFxuICAgID0gSXRlcipcXG5cXG4gIEl0ZXJcXG4gICAgPSBQcmVkIFxcXCIqXFxcIiAgLS0gc3RhclxcbiAgICB8IFByZWQgXFxcIitcXFwiICAtLSBwbHVzXFxuICAgIHwgUHJlZCBcXFwiP1xcXCIgIC0tIG9wdFxcbiAgICB8IFByZWRcXG5cXG4gIFByZWRcXG4gICAgPSBcXFwiflxcXCIgTGV4ICAtLSBub3RcXG4gICAgfCBcXFwiJlxcXCIgTGV4ICAtLSBsb29rYWhlYWRcXG4gICAgfCBMZXhcXG5cXG4gIExleFxcbiAgICA9IFxcXCIjXFxcIiBCYXNlICAtLSBsZXhcXG4gICAgfCBCYXNlXFxuXFxuICBCYXNlXFxuICAgID0gaWRlbnQgUGFyYW1zPyB+KHJ1bGVEZXNjcj8gXFxcIj1cXFwiIHwgXFxcIjo9XFxcIiB8IFxcXCIrPVxcXCIpICAtLSBhcHBsaWNhdGlvblxcbiAgICB8IHRlcm1pbmFsIFxcXCIuLlxcXCIgdGVybWluYWwgICAgICAgICAgICAgICAgICAgICAgICAgLS0gcmFuZ2VcXG4gICAgfCB0ZXJtaW5hbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHRlcm1pbmFsXFxuICAgIHwgXFxcIihcXFwiIEFsdCBcXFwiKVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBwYXJlblxcblxcbiAgcnVsZURlc2NyICAoYSBydWxlIGRlc2NyaXB0aW9uKVxcbiAgICA9IFxcXCIoXFxcIiBydWxlRGVzY3JUZXh0IFxcXCIpXFxcIlxcblxcbiAgcnVsZURlc2NyVGV4dFxcbiAgICA9ICh+XFxcIilcXFwiIGFueSkqXFxuXFxuICBjYXNlTmFtZVxcbiAgICA9IFxcXCItLVxcXCIgKH5cXFwiXFxcXG5cXFwiIHNwYWNlKSogbmFtZSAoflxcXCJcXFxcblxcXCIgc3BhY2UpKiAoXFxcIlxcXFxuXFxcIiB8ICZcXFwifVxcXCIpXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbiAgaWRlbnQgIChhbiBpZGVudGlmaWVyKVxcbiAgICA9IG5hbWVcXG5cXG4gIHRlcm1pbmFsXFxuICAgID0gXFxcIlxcXFxcXFwiXFxcIiB0ZXJtaW5hbENoYXIqIFxcXCJcXFxcXFxcIlxcXCJcXG5cXG4gIHRlcm1pbmFsQ2hhclxcbiAgICA9IGVzY2FwZUNoYXJcXG4gICAgfCB+XFxcIlxcXFxcXFxcXFxcIiB+XFxcIlxcXFxcXFwiXFxcIiB+XFxcIlxcXFxuXFxcIiBhbnlcXG5cXG4gIGVzY2FwZUNoYXIgIChhbiBlc2NhcGUgc2VxdWVuY2UpXFxuICAgID0gXFxcIlxcXFxcXFxcXFxcXFxcXFxcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGJhY2tzbGFzaFxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFxcXFwiXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBkb3VibGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFwnXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBzaW5nbGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXGJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBiYWNrc3BhY2VcXG4gICAgfCBcXFwiXFxcXFxcXFxuXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gbGluZUZlZWRcXG4gICAgfCBcXFwiXFxcXFxcXFxyXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gY2FycmlhZ2VSZXR1cm5cXG4gICAgfCBcXFwiXFxcXFxcXFx0XFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gdGFiXFxuICAgIHwgXFxcIlxcXFxcXFxcdVxcXCIgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgIC0tIHVuaWNvZGVFc2NhcGVcXG4gICAgfCBcXFwiXFxcXFxcXFx4XFxcIiBoZXhEaWdpdCBoZXhEaWdpdCAgICAgICAgICAgICAgICAgICAgLS0gaGV4RXNjYXBlXFxuXFxuICBzcGFjZVxcbiAgICs9IGNvbW1lbnRcXG5cXG4gIGNvbW1lbnRcXG4gICAgPSBcXFwiLy9cXFwiICh+XFxcIlxcXFxuXFxcIiBhbnkpKiBcXFwiXFxcXG5cXFwiICAtLSBzaW5nbGVMaW5lXFxuICAgIHwgXFxcIi8qXFxcIiAoflxcXCIqL1xcXCIgYW55KSogXFxcIiovXFxcIiAgLS0gbXVsdGlMaW5lXFxuXFxuICB0b2tlbnMgPSB0b2tlbipcXG5cXG4gIHRva2VuID0gY2FzZU5hbWUgfCBjb21tZW50IHwgaWRlbnQgfCBvcGVyYXRvciB8IHB1bmN0dWF0aW9uIHwgdGVybWluYWwgfCBhbnlcXG5cXG4gIG9wZXJhdG9yID0gXFxcIjw6XFxcIiB8IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiIHwgXFxcIipcXFwiIHwgXFxcIitcXFwiIHwgXFxcIj9cXFwiIHwgXFxcIn5cXFwiIHwgXFxcIiZcXFwiXFxuXFxuICBwdW5jdHVhdGlvbiA9IFxcXCI8XFxcIiB8IFxcXCI+XFxcIiB8IFxcXCIsXFxcIiB8IFxcXCItLVxcXCJcXG59XCJ9LFwiT2htXCIsbnVsbCxcIkdyYW1tYXJzXCIse1wiR3JhbW1hcnNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5LDMyXX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQsMzJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNCwzMV19LFwiR3JhbW1hclwiLFtdXV1dLFwiR3JhbW1hclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM2LDgzXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MCw4M119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUwLDU1XX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1Niw2OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2LDY4XX0sXCJTdXBlckdyYW1tYXJcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzAsNzNdfSxcIntcIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0LDc5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQsNzhdfSxcIlJ1bGVcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODAsODNdfSxcIn1cIl1dXSxcIlN1cGVyR3JhbW1hclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3LDExNl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA2LDExNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA2LDExMF19LFwiPDpcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExLDExNl19LFwiaWRlbnRcIixbXV1dXSxcIlJ1bGVfZGVmaW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE4MV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE3MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxMzZdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNywxNDVdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzcsMTQ0XX0sXCJGb3JtYWxzXCIsW11dXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDYsMTU2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2LDE1NV19LFwicnVsZURlc2NyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NywxNjBdfSxcIj1cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYyLDE3MF19LFwiUnVsZUJvZHlcIixbXV1dXSxcIlJ1bGVfb3ZlcnJpZGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMjQwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMjI3XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDE5M119LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk0LDIwMl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NCwyMDFdfSxcIkZvcm1hbHNcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE0LDIxOF19LFwiOj1cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5LDIyN119LFwiUnVsZUJvZHlcIixbXV1dXSxcIlJ1bGVfZXh0ZW5kXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ3LDI5N119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ3LDI4Nl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NywyNTJdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MywyNjFdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTMsMjYwXX0sXCJGb3JtYWxzXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI3MywyNzddfSxcIis9XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI3OCwyODZdfSxcIlJ1bGVCb2R5XCIsW11dXV0sXCJSdWxlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIwLDI5N119LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDI5N119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxNzBdfSxcIlJ1bGVfZGVmaW5lXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwyMjddfSxcIlJ1bGVfb3ZlcnJpZGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ3LDI4Nl19LFwiUnVsZV9leHRlbmRcIixbXV1dXSxcIlJ1bGVCb2R5XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzAxLDM1NF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzE2LDM1NF19LFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMxNiwzMjBdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMxNiwzMTldfSxcInxcIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMyMSwzNTRdfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMzNiwzNDhdfSxcIlRvcExldmVsVGVybVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM1MCwzNTNdfSxcInxcIl1dXV1dLFwiVG9wTGV2ZWxUZXJtX2lubGluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3Nyw0MDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3NywzODldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsMzgwXX0sXCJTZXFcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzgxLDM4OV19LFwiY2FzZU5hbWVcIixbXV1dXSxcIlRvcExldmVsVGVybVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM1OCw0MTBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3Nyw0MTBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsMzg5XX0sXCJUb3BMZXZlbFRlcm1faW5saW5lXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQwNyw0MTBdfSxcIlNlcVwiLFtdXV1dLFwiRm9ybWFsc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQxNCw0NTRdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQyOCw0NTRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQyOCw0MzFdfSxcIjxcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDMyLDQ1MF19LFwiTGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQzOSw0NDRdfSxcImlkZW50XCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDQ2LDQ0OV19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDUxLDQ1NF19LFwiPlwiXV1dLFwiUGFyYW1zXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDU4LDQ5NV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDcxLDQ5NV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDcxLDQ3NF19LFwiPFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NzUsNDkxXX0sXCJMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDgyLDQ4NV19LFwiU2VxXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDg3LDQ5MF19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDkyLDQ5NV19LFwiPlwiXV1dLFwiQWx0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDk5LDUzM119LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTA5LDUzM119LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTI0LDUyN119LFwiU2VxXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTI5LDUzMl19LFwifFwiXV1dXSxcIlNlcVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUzNyw1NTJdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NDcsNTUyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTQ3LDU1MV19LFwiSXRlclwiLFtdXV1dLFwiSXRlcl9zdGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTY3LDU4NF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTY3LDU3NV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Nyw1NzFdfSxcIlByZWRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NzIsNTc1XX0sXCIqXCJdXV0sXCJJdGVyX3BsdXNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTEsNjA4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTEsNTk5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTkxLDU5NV19LFwiUHJlZFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5Niw1OTldfSxcIitcIl1dXSxcIkl0ZXJfb3B0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjE1LDYzMV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjE1LDYyM119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxNSw2MTldfSxcIlByZWRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MjAsNjIzXX0sXCI/XCJdXV0sXCJJdGVyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTU2LDY0Ml19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTY3LDY0Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Nyw1NzVdfSxcIkl0ZXJfc3RhclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTEsNTk5XX0sXCJJdGVyX3BsdXNcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjE1LDYyM119LFwiSXRlcl9vcHRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjM4LDY0Ml19LFwiUHJlZFwiLFtdXV1dLFwiUHJlZF9ub3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NTcsNjcyXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NTcsNjY0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NTcsNjYwXX0sXCJ+XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY2MSw2NjRdfSxcIkxleFwiLFtdXV1dLFwiUHJlZF9sb29rYWhlYWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NzksNzAwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NzksNjg2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NzksNjgyXX0sXCImXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY4Myw2ODZdfSxcIkxleFwiLFtdXV1dLFwiUHJlZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY0Niw3MTBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY1Nyw3MTBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NTcsNjY0XX0sXCJQcmVkX25vdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NzksNjg2XX0sXCJQcmVkX2xvb2thaGVhZFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MDcsNzEwXX0sXCJMZXhcIixbXV1dXSxcIkxleF9sZXhcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjQsNzQwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjQsNzMyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjQsNzI3XX0sXCIjXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyOCw3MzJdfSxcIkJhc2VcIixbXV1dXSxcIkxleFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzcxNCw3NTFdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyNCw3NTFdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjQsNzMyXX0sXCJMZXhfbGV4XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0Nyw3NTFdfSxcIkJhc2VcIixbXV1dXSxcIkJhc2VfYXBwbGljYXRpb25cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjYsODI3XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjYsODExXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY2LDc3MV19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzcyLDc3OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc3Miw3NzhdfSxcIlBhcmFtc1wiLFtdXV0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzgwLDgxMV19LFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc4Miw4MTBdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3ODIsNzk2XX0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzgyLDc5Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc4Miw3OTFdfSxcInJ1bGVEZXNjclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3OTMsNzk2XX0sXCI9XCJdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc5OSw4MDNdfSxcIjo9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODA2LDgxMF19LFwiKz1cIl1dXV1dLFwiQmFzZV9yYW5nZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzNCw4ODldfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzNCw4NTZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzQsODQyXX0sXCJ0ZXJtaW5hbFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg0Myw4NDddfSxcIi4uXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg0OCw4NTZdfSxcInRlcm1pbmFsXCIsW11dXV0sXCJCYXNlX3Rlcm1pbmFsXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODk2LDk1NF19LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODk2LDkwNF19LFwidGVybWluYWxcIixbXV1dLFwiQmFzZV9wYXJlblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk2MSwxMDE2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjEsOTcyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjEsOTY0XX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk2NSw5NjhdfSxcIkFsdFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk2OSw5NzJdfSxcIilcIl1dXSxcIkJhc2VcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NTUsMTAxNl19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY2LDEwMTZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjYsODExXX0sXCJCYXNlX2FwcGxpY2F0aW9uXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzNCw4NTZdfSxcIkJhc2VfcmFuZ2VcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODk2LDkwNF19LFwiQmFzZV90ZXJtaW5hbFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjEsOTcyXX0sXCJCYXNlX3BhcmVuXCIsW11dXV0sXCJydWxlRGVzY3JcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDIwLDEwNzldfSxcImEgcnVsZSBkZXNjcmlwdGlvblwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNTgsMTA3OV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA1OCwxMDYxXX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNjIsMTA3NV19LFwicnVsZURlc2NyVGV4dFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNzYsMTA3OV19LFwiKVwiXV1dLFwicnVsZURlc2NyVGV4dFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwODMsMTExNF19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMDMsMTExNF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMDQsMTExMl19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMDQsMTEwOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTEwNSwxMTA4XX0sXCIpXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTA5LDExMTJdfSxcImFueVwiLFtdXV1dXSxcImNhc2VOYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExOCwxMTg2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTMzLDExODZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMzMsMTEzN119LFwiLS1cIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMzgsMTE1Ml19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMzksMTE1MF19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMzksMTE0NF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE0MCwxMTQ0XX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNDUsMTE1MF19LFwic3BhY2VcIixbXV1dXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTUzLDExNTddfSxcIm5hbWVcIixbXV0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNTgsMTE3Ml19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNTksMTE3MF19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNTksMTE2NF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE2MCwxMTY0XX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNjUsMTE3MF19LFwic3BhY2VcIixbXV1dXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTc0LDExODVdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNzQsMTE3OF19LFwiXFxuXCJdLFtcImxvb2thaGVhZFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExODEsMTE4NV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE4MiwxMTg1XX0sXCJ9XCJdXV1dXSxcIm5hbWVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTkwLDEyMzBdfSxcImEgbmFtZVwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMTEsMTIzMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMTEsMTIyMF19LFwibmFtZUZpcnN0XCIsW11dLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjIxLDEyMzBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjIxLDEyMjldfSxcIm5hbWVSZXN0XCIsW11dXV1dLFwibmFtZUZpcnN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIzNCwxMjY2XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjUwLDEyNjZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNTAsMTI1M119LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjYwLDEyNjZdfSxcImxldHRlclwiLFtdXV1dLFwibmFtZVJlc3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjcwLDEzMDBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyODUsMTMwMF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI4NSwxMjg4XX0sXCJfXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOTUsMTMwMF19LFwiYWxudW1cIixbXV1dXSxcImlkZW50XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMwNCwxMzM3XX0sXCJhbiBpZGVudGlmaWVyXCIsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMzMywxMzM3XX0sXCJuYW1lXCIsW11dXSxcInRlcm1pbmFsXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM0MSwxMzc5XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzU2LDEzNzldfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNTYsMTM2MF19LFwiXFxcIlwiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM2MSwxMzc0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM2MSwxMzczXX0sXCJ0ZXJtaW5hbENoYXJcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3NSwxMzc5XX0sXCJcXFwiXCJdXV0sXCJ0ZXJtaW5hbENoYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzgzLDE0NDBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MDIsMTQ0MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MDIsMTQxMl19LFwiZXNjYXBlQ2hhclwiLFtdXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDE5LDE0NDBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDE5LDE0MjRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MjAsMTQyNF19LFwiXFxcXFwiXV0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQyNSwxNDMwXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDI2LDE0MzBdfSxcIlxcXCJcIl1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MzEsMTQzNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQzMiwxNDM2XX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MzcsMTQ0MF19LFwiYW55XCIsW11dXV1dLFwiZXNjYXBlQ2hhcl9iYWNrc2xhc2hcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDgzLDE1MzhdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ4MywxNDg5XX0sXCJcXFxcXFxcXFwiXV0sXCJlc2NhcGVDaGFyX2RvdWJsZVF1b3RlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU0NSwxNjAyXX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NDUsMTU1MV19LFwiXFxcXFxcXCJcIl1dLFwiZXNjYXBlQ2hhcl9zaW5nbGVRdW90ZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MDksMTY2Nl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjA5LDE2MTVdfSxcIlxcXFwnXCJdXSxcImVzY2FwZUNoYXJfYmFja3NwYWNlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY3MywxNzI4XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2NzMsMTY3OF19LFwiXFxcXGJcIl1dLFwiZXNjYXBlQ2hhcl9saW5lRmVlZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3MzUsMTc4OV19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzM1LDE3NDBdfSxcIlxcXFxuXCJdXSxcImVzY2FwZUNoYXJfY2FycmlhZ2VSZXR1cm5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzk2LDE4NTZdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc5NiwxODAxXX0sXCJcXFxcclwiXV0sXCJlc2NhcGVDaGFyX3RhYlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NjMsMTkxMl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODYzLDE4NjhdfSxcIlxcXFx0XCJdXSxcImVzY2FwZUNoYXJfdW5pY29kZUVzY2FwZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MTksMTk3OF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkxOSwxOTYwXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTE5LDE5MjRdfSxcIlxcXFx1XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MjUsMTkzM119LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkzNCwxOTQyXX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTQzLDE5NTFdfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NTIsMTk2MF19LFwiaGV4RGlnaXRcIixbXV1dXSxcImVzY2FwZUNoYXJfaGV4RXNjYXBlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk4NSwyMDQwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTg1LDIwMDhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5ODUsMTk5MF19LFwiXFxcXHhcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk5MSwxOTk5XX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDAwLDIwMDhdfSxcImhleERpZ2l0XCIsW11dXV0sXCJlc2NhcGVDaGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ0NCwyMDQwXX0sXCJhbiBlc2NhcGUgc2VxdWVuY2VcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDgzLDIwNDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDgzLDE0ODldfSxcImVzY2FwZUNoYXJfYmFja3NsYXNoXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NDUsMTU1MV19LFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjA5LDE2MTVdfSxcImVzY2FwZUNoYXJfc2luZ2xlUXVvdGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY3MywxNjc4XX0sXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzM1LDE3NDBdfSxcImVzY2FwZUNoYXJfbGluZUZlZWRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc5NiwxODAxXX0sXCJlc2NhcGVDaGFyX2NhcnJpYWdlUmV0dXJuXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NjMsMTg2OF19LFwiZXNjYXBlQ2hhcl90YWJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkxOSwxOTYwXX0sXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk4NSwyMDA4XX0sXCJlc2NhcGVDaGFyX2hleEVzY2FwZVwiLFtdXV1dLFwic3BhY2VcIjpbXCJleHRlbmRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDQ0LDIwNjNdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNTYsMjA2M119LFwiY29tbWVudFwiLFtdXV0sXCJjb21tZW50X3NpbmdsZUxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDgxLDIxMThdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwODEsMjEwM119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4MSwyMDg1XX0sXCIvL1wiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4NiwyMDk4XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4NywyMDk2XX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4NywyMDkyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDg4LDIwOTJdfSxcIlxcblwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA5MywyMDk2XX0sXCJhbnlcIixbXV1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwOTksMjEwM119LFwiXFxuXCJdXV0sXCJjb21tZW50X211bHRpTGluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMjUsMjE2MV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyNSwyMTQ3XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTI1LDIxMjldfSxcIi8qXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTMwLDIxNDJdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTMxLDIxNDBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTMxLDIxMzZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMzIsMjEzNl19LFwiKi9cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMzcsMjE0MF19LFwiYW55XCIsW11dXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTQzLDIxNDddfSxcIiovXCJdXV0sXCJjb21tZW50XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA2NywyMTYxXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDgxLDIxNjFdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDgxLDIxMDNdfSxcImNvbW1lbnRfc2luZ2xlTGluZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTI1LDIxNDddfSxcImNvbW1lbnRfbXVsdGlMaW5lXCIsW11dXV0sXCJ0b2tlbnNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTY1LDIxODBdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTc0LDIxODBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTc0LDIxNzldfSxcInRva2VuXCIsW11dXV0sXCJ0b2tlblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxODQsMjI2MF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5MiwyMjYwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5MiwyMjAwXX0sXCJjYXNlTmFtZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjAzLDIyMTBdfSxcImNvbW1lbnRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIxMywyMjE4XX0sXCJpZGVudFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjIxLDIyMjldfSxcIm9wZXJhdG9yXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyMzIsMjI0M119LFwicHVuY3R1YXRpb25cIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI0NiwyMjU0XX0sXCJ0ZXJtaW5hbFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjU3LDIyNjBdfSxcImFueVwiLFtdXV1dLFwib3BlcmF0b3JcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjY0LDIzMjldfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNzUsMjMyOV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI3NSwyMjc5XX0sXCI8OlwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODIsMjI4NV19LFwiPVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODgsMjI5Ml19LFwiOj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjk1LDIyOTldfSxcIis9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMwMiwyMzA1XX0sXCIqXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMwOCwyMzExXX0sXCIrXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMxNCwyMzE3XX0sXCI/XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMyMCwyMzIzXX0sXCJ+XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMyNiwyMzI5XX0sXCImXCJdXV0sXCJwdW5jdHVhdGlvblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMzMsMjM2OV19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0NywyMzY5XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzQ3LDIzNTBdfSxcIjxcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzUzLDIzNTZdfSxcIj5cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzU5LDIzNjJdfSxcIixcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzY1LDIzNjldfSxcIi0tXCJdXV19XSk7XG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoW1wiZ3JhbW1hclwiLHtcInNvdXJjZVwiOlwiT3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXMge1xcblxcbiAgQXR0cmlidXRlU2lnbmF0dXJlID1cXG4gICAgbmFtZVxcblxcbiAgT3BlcmF0aW9uU2lnbmF0dXJlID1cXG4gICAgbmFtZSBGb3JtYWxzP1xcblxcbiAgRm9ybWFsc1xcbiAgICA9IFxcXCIoXFxcIiBMaXN0T2Y8bmFtZSwgXFxcIixcXFwiPiBcXFwiKVxcXCJcXG5cXG4gIG5hbWUgIChhIG5hbWUpXFxuICAgID0gbmFtZUZpcnN0IG5hbWVSZXN0KlxcblxcbiAgbmFtZUZpcnN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgbGV0dGVyXFxuXFxuICBuYW1lUmVzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGFsbnVtXFxuXFxufVwifSxcIk9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzXCIsbnVsbCxcIkF0dHJpYnV0ZVNpZ25hdHVyZVwiLHtcIkF0dHJpYnV0ZVNpZ25hdHVyZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI5LDU4XX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NCw1OF19LFwibmFtZVwiLFtdXV0sXCJPcGVyYXRpb25TaWduYXR1cmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MiwxMDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3LDEwMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3LDkxXX0sXCJuYW1lXCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkyLDEwMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkyLDk5XX0sXCJGb3JtYWxzXCIsW11dXV1dLFwiRm9ybWFsc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNCwxNDNdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExOCwxNDNdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExOCwxMjFdfSxcIihcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyLDEzOV19LFwiTGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOSwxMzNdfSxcIm5hbWVcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzUsMTM4XX0sXCIsXCJdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDAsMTQzXX0sXCIpXCJdXV0sXCJuYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ3LDE4N119LFwiYSBuYW1lXCIsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4LDE4N119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OCwxNzddfSxcIm5hbWVGaXJzdFwiLFtdXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc4LDE4N119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OCwxODZdfSxcIm5hbWVSZXN0XCIsW11dXV1dLFwibmFtZUZpcnN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkxLDIyM119LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA3LDIyM119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA3LDIxMF19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTcsMjIzXX0sXCJsZXR0ZXJcIixbXV1dXSxcIm5hbWVSZXN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI3LDI1N119LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQyLDI1N119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQyLDI0NV19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTIsMjU3XX0sXCJhbG51bVwiLFtdXV1dfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4uL3NyYy9jb21tb24nKS5hc3NlcnQ7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBIZWxwZXJzXG5cbmZ1bmN0aW9uIGdldFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gIHJldHVybiBmbih0aGluZ1tuYW1lXSk7XG59XG5cbmZ1bmN0aW9uIG1hcFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gIHJldHVybiB0aGluZ1tuYW1lXS5tYXAoZm4pO1xufVxuXG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHdhbGsgYSBzaW5nbGUgcHJvcGVydHkgb2YgYSBub2RlLlxuLy8gYGRlc2NyaXB0b3JgIGlzIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIHByb3BlcnR5IG5hbWUsIG9wdGlvbmFsbHkgZW5kaW5nXG4vLyB3aXRoICdbXScgKGUuZy4sICdjaGlsZHJlbltdJykuXG5mdW5jdGlvbiBnZXRQcm9wV2Fsa0ZuKGRlc2NyaXB0b3IpIHtcbiAgdmFyIHBhcnRzID0gZGVzY3JpcHRvci5zcGxpdCgvID9cXFtcXF0vKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiBtYXBQcm9wLmJpbmQobnVsbCwgcGFydHNbMF0pO1xuICB9XG4gIHJldHVybiBnZXRQcm9wLmJpbmQobnVsbCwgZGVzY3JpcHRvcik7XG59XG5cbmZ1bmN0aW9uIGdldFByb3BzKHdhbGtGbnMsIHRoaW5nLCBmbikge1xuICByZXR1cm4gd2Fsa0Zucy5tYXAoZnVuY3Rpb24od2Fsa0ZuKSB7XG4gICAgcmV0dXJuIHdhbGtGbih0aGluZywgZm4pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0V2Fsa0ZuKHNoYXBlKSB7XG4gIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGdldFByb3BzLmJpbmQobnVsbCwgW2dldFByb3BXYWxrRm4oc2hhcGUpXSk7XG4gIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzaGFwZSkpIHtcbiAgICByZXR1cm4gZ2V0UHJvcHMuYmluZChudWxsLCBzaGFwZS5tYXAoZ2V0UHJvcFdhbGtGbikpO1xuICB9IGVsc2Uge1xuICAgIGFzc2VydCh0eXBlb2Ygc2hhcGUgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBhIHN0cmluZywgQXJyYXksIG9yIGZ1bmN0aW9uJyk7XG4gICAgYXNzZXJ0KHNoYXBlLmxlbmd0aCA9PT0gMiwgJ0V4cGVjdGVkIGEgZnVuY3Rpb24gb2YgYXJpdHkgMiwgZ290ICcgKyBzaGFwZS5sZW5ndGgpO1xuICAgIHJldHVybiBzaGFwZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKHN0cikge1xuICByZXR1cm4gL15bYS16QS1aX11bMC05YS16QS1aX10qJC8udGVzdChzdHIpO1xufVxuXG5mdW5jdGlvbiB0cmltKHMpIHtcbiAgcmV0dXJuIHMudHJpbSgpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpZ25hdHVyZShzaWcpIHtcbiAgdmFyIHBhcnRzID0gc2lnLnNwbGl0KC9bKCldLykubWFwKHRyaW0pO1xuICBpZiAocGFydHMubGVuZ3RoID09PSAzICYmIHBhcnRzWzJdID09PSAnJykge1xuICAgIHZhciBuYW1lID0gcGFydHNbMF07XG4gICAgdmFyIHBhcmFtcyA9IFtdO1xuICAgIGlmIChwYXJ0c1sxXS5sZW5ndGggPiAwKSB7XG4gICAgICBwYXJhbXMgPSBwYXJ0c1sxXS5zcGxpdCgnLCcpLm1hcCh0cmltKTtcbiAgICB9XG4gICAgaWYgKGlzUmVzdHJpY3RlZElkZW50aWZpZXIobmFtZSkgJiYgcGFyYW1zLmV2ZXJ5KGlzUmVzdHJpY3RlZElkZW50aWZpZXIpKSB7XG4gICAgICByZXR1cm4ge25hbWU6IG5hbWUsIGZvcm1hbHM6IHBhcmFtc307XG4gICAgfVxuICB9XG4gIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBvcGVyYXRpb24gc2lnbmF0dXJlOiAnICsgc2lnKTtcbn1cblxuLypcbiAgQSBWaXNpdG9yRmFtaWx5IGNvbnRhaW5zIGEgc2V0IG9mIHJlY3Vyc2l2ZSBvcGVyYXRpb25zIHRoYXQgYXJlIGRlZmluZWQgb3ZlciBzb21lIGtpbmQgb2ZcbiAgdHJlZSBzdHJ1Y3R1cmUuIFRoZSBgY29uZmlnYCBwYXJhbWV0ZXIgc3BlY2lmaWVzIGhvdyB0byB3YWxrIHRoZSB0cmVlOlxuICAtICdnZXRUYWcnIGlzIGZ1bmN0aW9uIHdoaWNoLCBnaXZlbiBhIG5vZGUgaW4gdGhlIHRyZWUsIHJldHVybnMgdGhlIG5vZGUncyAndGFnJyAodHlwZSlcbiAgLSAnc2hhcGVzJyBhbiBvYmplY3QgdGhhdCBtYXBzIGZyb20gYSB0YWcgdG8gYSB2YWx1ZSB0aGF0IGRlc2NyaWJlcyBob3cgdG8gcmVjdXJzaXZlbHlcbiAgICBldmFsdWF0ZSB0aGUgb3BlcmF0aW9uIGZvciBub2RlcyBvZiB0aGF0IHR5cGUuIFRoZSB2YWx1ZSBjYW4gYmU6XG4gICAgKiBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBwcm9wZXJ0eSBuYW1lIHRoYXQgaG9sZHMgdGhhdCBub2RlJ3Mgb25seSBjaGlsZFxuICAgICogYW4gQXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgKG9yIGFuIGVtcHR5IGFycmF5IGluZGljYXRpbmcgYSBsZWFmIHR5cGUpLCBvclxuICAgICogYSBmdW5jdGlvbiB0YWtpbmcgdHdvIGFyZ3VtZW50cyAobm9kZSwgZm4pLCBhbmQgcmV0dXJuaW5nIGFuIEFycmF5IHdoaWNoIGlzIHRoZSByZXN1bHRcbiAgICAgIG9mIGFwcGx5IGBmbmAgdG8gZWFjaCBvZiB0aGUgbm9kZSdzIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiBWaXNpdG9yRmFtaWx5KGNvbmZpZykge1xuICB0aGlzLl9zaGFwZXMgPSBjb25maWcuc2hhcGVzO1xuICB0aGlzLl9nZXRUYWcgPSBjb25maWcuZ2V0VGFnO1xuXG4gIHRoaXMuQWRhcHRlciA9IGZ1bmN0aW9uKHRoaW5nLCBmYW1pbHkpIHtcbiAgICB0aGlzLl9hZGFwdGVlID0gdGhpbmc7XG4gICAgdGhpcy5fZmFtaWx5ID0gZmFtaWx5O1xuICB9O1xuICB0aGlzLkFkYXB0ZXIucHJvdG90eXBlLnZhbHVlT2YgPSBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2hlZWV5IScpO1xuICB9O1xuICB0aGlzLm9wZXJhdGlvbnMgPSB7fTtcblxuICB0aGlzLl9hcml0aWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgdGhpcy5fZ2V0Q2hpbGRyZW4gPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgT2JqZWN0LmtleXModGhpcy5fc2hhcGVzKS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICB2YXIgc2hhcGUgPSBzZWxmLl9zaGFwZXNba107XG4gICAgc2VsZi5fZ2V0Q2hpbGRyZW5ba10gPSBnZXRXYWxrRm4oc2hhcGUpO1xuXG4gICAgLy8gQSBmdW5jdGlvbiBtZWFucyB0aGUgYXJpdHkgaXNuJ3QgZml4ZWQsIHNvIGRvbid0IHB1dCBhbiBlbnRyeSBpbiB0aGUgYXJpdHkgbWFwLlxuICAgIGlmICh0eXBlb2Ygc2hhcGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHNlbGYuX2FyaXRpZXNba10gPSBBcnJheS5pc0FycmF5KHNoYXBlKSA/IHNoYXBlLmxlbmd0aCA6IDE7XG4gICAgfVxuICB9KTtcbiAgdGhpcy5fd3JhcCA9IGZ1bmN0aW9uKHRoaW5nKSB7IHJldHVybiBuZXcgc2VsZi5BZGFwdGVyKHRoaW5nLCBzZWxmKTsgfTtcbn1cblxuVmlzaXRvckZhbWlseS5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uKHRoaW5nKSB7XG4gIHJldHVybiB0aGlzLl93cmFwKHRoaW5nKTtcbn07XG5cblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLl9jaGVja0FjdGlvbkRpY3QgPSBmdW5jdGlvbihkaWN0KSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgT2JqZWN0LmtleXMoZGljdCkuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgYXNzZXJ0KGsgaW4gc2VsZi5fZ2V0Q2hpbGRyZW4sIFwiVW5yZWNvZ25pemVkIGFjdGlvbiBuYW1lICdcIiArIGsgKyBcIidcIik7XG4gICAgdmFyIGFjdGlvbiA9IGRpY3Rba107XG4gICAgYXNzZXJ0KHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicsIFwiS2V5ICdcIiArIGsgKyBcIic6IGV4cGVjdGVkIGZ1bmN0aW9uLCBnb3QgXCIgKyBhY3Rpb24pO1xuICAgIGlmIChrIGluIHNlbGYuX2FyaXRpZXMpIHtcbiAgICAgIHZhciBleHBlY3RlZCA9IHNlbGYuX2FyaXRpZXNba107XG4gICAgICB2YXIgYWN0dWFsID0gZGljdFtrXS5sZW5ndGg7XG4gICAgICBhc3NlcnQoYWN0dWFsID09PSBleHBlY3RlZCxcbiAgICAgICAgICAgICBcIkFjdGlvbiAnXCIgKyBrICsgXCInIGhhcyB0aGUgd3JvbmcgYXJpdHk6IGV4cGVjdGVkIFwiICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCk7XG4gICAgfVxuICB9KTtcbn07XG5cblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKHNpZ25hdHVyZSwgYWN0aW9ucykge1xuICB2YXIgc2lnID0gcGFyc2VTaWduYXR1cmUoc2lnbmF0dXJlKTtcbiAgdmFyIG5hbWUgPSBzaWcubmFtZTtcbiAgdGhpcy5fY2hlY2tBY3Rpb25EaWN0KGFjdGlvbnMpO1xuICB0aGlzLm9wZXJhdGlvbnNbbmFtZV0gPSB7XG4gICAgbmFtZTogbmFtZSxcbiAgICBmb3JtYWxzOiBzaWcuZm9ybWFscyxcbiAgICBhY3Rpb25zOiBhY3Rpb25zXG4gIH07XG5cbiAgdmFyIGZhbWlseSA9IHRoaXM7XG4gIHRoaXMuQWRhcHRlci5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGFnID0gZmFtaWx5Ll9nZXRUYWcodGhpcy5fYWRhcHRlZSk7XG4gICAgYXNzZXJ0KHRhZyBpbiBmYW1pbHkuX2dldENoaWxkcmVuLCBcImdldFRhZyByZXR1cm5lZCB1bnJlY29nbml6ZWQgdGFnICdcIiArIHRhZyArIFwiJ1wiKTtcbiAgICBhc3NlcnQodGFnIGluIGFjdGlvbnMsIFwiTm8gYWN0aW9uIGZvciAnXCIgKyB0YWcgKyBcIicgaW4gb3BlcmF0aW9uICdcIiArIG5hbWUgKyBcIidcIik7XG5cbiAgICAvLyBDcmVhdGUgYW4gXCJhcmd1bWVudHMgb2JqZWN0XCIgZnJvbSB0aGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhpc1xuICAgIC8vIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZS5cbiAgICB2YXIgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGFyZ3Nbc2lnLmZvcm1hbHNbaV1dID0gYXJndW1lbnRzW2ldO1xuICAgIH1cblxuICAgIHZhciBvbGRBcmdzID0gdGhpcy5hcmdzO1xuICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgdmFyIGFucyA9IGFjdGlvbnNbdGFnXS5hcHBseSh0aGlzLCBmYW1pbHkuX2dldENoaWxkcmVuW3RhZ10odGhpcy5fYWRhcHRlZSwgZmFtaWx5Ll93cmFwKSk7XG4gICAgdGhpcy5hcmdzID0gb2xkQXJncztcbiAgICByZXR1cm4gYW5zO1xuICB9O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpc2l0b3JGYW1pbHk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBWaXNpdG9yRmFtaWx5OiByZXF1aXJlKCcuL1Zpc2l0b3JGYW1pbHknKSxcbiAgc2VtYW50aWNzRm9yVG9BU1Q6IHJlcXVpcmUoJy4vc2VtYW50aWNzLXRvQVNUJykuc2VtYW50aWNzLFxuICB0b0FTVDogcmVxdWlyZSgnLi9zZW1hbnRpY3MtdG9BU1QnKS5oZWxwZXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi4vc3JjL3BleHBycycpO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi4vc3JjL01hdGNoUmVzdWx0Jyk7XG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4uL3NyYy9HcmFtbWFyJyk7XG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBkZWZhdWx0T3BlcmF0aW9uID0ge1xuICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnByaW1pdGl2ZVZhbHVlO1xuICB9LFxuXG4gIF9ub250ZXJtaW5hbDogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICB2YXIgY3Rvck5hbWUgPSB0aGlzLl9ub2RlLmN0b3JOYW1lO1xuICAgIHZhciBtYXBwaW5nID0gdGhpcy5hcmdzLm1hcHBpbmc7XG5cbiAgICAvLyB3aXRob3V0IGN1c3RvbWl6YXRpb25cbiAgICBpZiAoIW1hcHBpbmcuaGFzT3duUHJvcGVydHkoY3Rvck5hbWUpKSB7XG4gICAgICAvLyBpbnRlcm1lZGlhdGUgbm9kZVxuICAgICAgaWYgKHRoaXMuX25vZGUgaW5zdGFuY2VvZiBwZXhwcnMuQWx0IHx8IHRoaXMuX25vZGUgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkpIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICAvLyBsZXhpY2FsIHJ1bGVcbiAgICAgIGlmICh0aGlzLmlzTGV4aWNhbCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgIH1cblxuICAgICAgLy8gc2luZ3VsYXIgbm9kZSAoZS5nLiBvbmx5IHN1cnJvdW5kZWQgYnkgbGl0ZXJhbHMgb3IgbG9va2FoZWFkcylcbiAgICAgIHZhciByZWFsQ2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgcmV0dXJuICFjaGlsZC5pc1Rlcm1pbmFsKCk7XG4gICAgICB9KTtcbiAgICAgIGlmIChyZWFsQ2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiByZWFsQ2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlc3Q6IHRlcm1zIHdpdGggbXVsdGlwbGUgY2hpbGRyZW5cbiAgICB9XG5cbiAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgIGlmICh0eXBlb2YgbWFwcGluZ1tjdG9yTmFtZV0gPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gY2hpbGRyZW5bbWFwcGluZ1tjdG9yTmFtZV1dLnRvQVNUKG1hcHBpbmcpO1xuICAgIH1cblxuICAgIC8vIG5hbWVkL21hcHBlZCBjaGlsZHJlbiBvciB1bm5hbWVkIGNoaWxkcmVuICgnMCcsICcxJywgJzInLCAuLi4pXG4gICAgdmFyIHByb3BNYXAgPSBtYXBwaW5nW2N0b3JOYW1lXSB8fCBjaGlsZHJlbjtcbiAgICB2YXIgbm9kZSA9IHtcbiAgICAgIHR5cGU6IGN0b3JOYW1lXG4gICAgfTtcbiAgICBmb3IgKHZhciBwcm9wIGluIHByb3BNYXApIHtcbiAgICAgIHZhciBtYXBwZWRQcm9wID0gbWFwcGluZ1tjdG9yTmFtZV0gJiYgbWFwcGluZ1tjdG9yTmFtZV1bcHJvcF07XG4gICAgICBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdudW1iZXInKSB7XG4gICAgICAgIC8vIGRpcmVjdCBmb3J3YXJkXG4gICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlblttYXBwZWRQcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnc3RyaW5nJykgfHwgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnYm9vbGVhbicpIHx8XG4gICAgICAgICAgKG1hcHBlZFByb3AgPT09IG51bGwpKSB7XG4gICAgICAgIC8vIHByaW1pdGl2ZSB2YWx1ZVxuICAgICAgICBub2RlW3Byb3BdID0gbWFwcGVkUHJvcDtcbiAgICAgIH0gZWxzZSBpZiAoKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnb2JqZWN0JykgJiYgKG1hcHBlZFByb3AgaW5zdGFuY2VvZiBOdW1iZXIpKSB7XG4gICAgICAgIC8vIHByaW1pdGl2ZSBudW1iZXIgKG11c3QgYmUgdW5ib3hlZClcbiAgICAgICAgbm9kZVtwcm9wXSA9IE51bWJlcihtYXBwZWRQcm9wKTtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gY29tcHV0ZWQgdmFsdWVcbiAgICAgICAgbm9kZVtwcm9wXSA9IG1hcHBlZFByb3AuY2FsbCh0aGlzLCBjaGlsZHJlbik7XG4gICAgICB9IGVsc2UgaWYgKG1hcHBlZFByb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoY2hpbGRyZW5bcHJvcF0gJiYgIWNoaWxkcmVuW3Byb3BdLmlzVGVybWluYWwoKSkge1xuICAgICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlbltwcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkZWxldGUgcHJlZGVmaW5lZCAndHlwZScgcHJvcGVydGllcywgbGlrZSAndHlwZScsIGlmIGV4cGxpY2l0ZWx5IHJlbW92ZWRcbiAgICAgICAgICBkZWxldGUgbm9kZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfSxcblxuICBfaXRlcjogZnVuY3Rpb24oY2hpbGRyZW4pIHtcbiAgICBpZiAodGhpcy5fbm9kZS5pc09wdGlvbmFsKCkpIHtcbiAgICAgIGlmICh0aGlzLm51bUNoaWxkcmVuID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICByZXR1cm4gY2hpbGQudG9BU1QodGhpcy5hcmdzLm1hcHBpbmcpO1xuICAgIH0sIHRoaXMpO1xuICB9LFxuXG4gIE5vbmVtcHR5TGlzdE9mOiBmdW5jdGlvbihmaXJzdCwgc2VwLCByZXN0KSB7XG4gICAgcmV0dXJuIFtmaXJzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyldLmNvbmNhdChyZXN0LnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKSk7XG4gIH0sXG5cbiAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBhIHBsYWluIEphdmFTY3JpcHQgb2JqZWN0IHRoYXQgaW5jbHVkZXMgYW4gYWJzdHJhY3Qgc3ludGF4IHRyZWUgKEFTVClcbi8vIGZvciB0aGUgZ2l2ZW4gbWF0Y2ggcmVzdWx0IGByZXNgIGNvbnRhaW5nIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgYW5kIGdyYW1tYXIuXG4vLyBUaGUgb3B0aW9uYWwgYG1hcHBpbmdgIHBhcmFtZXRlciBjYW4gYmUgdXNlZCB0byBjdXN0b21pemUgaG93IHRoZSBub2RlcyBvZiB0aGUgQ1NUXG4vLyBhcmUgbWFwcGVkIHRvIHRoZSBBU1QgKHNlZSAvZG9jL2V4dHJhcy5tZCN0b2FzdG1hdGNocmVzdWx0LW1hcHBpbmcpLlxuZnVuY3Rpb24gdG9BU1QocmVzLCBtYXBwaW5nKSB7XG4gIGlmICghKHJlcyBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSB8fCByZXMuZmFpbGVkKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RvQVNUKCkgZXhwZWN0cyBhIHN1Y2Nlc2Z1bGwgTWF0Y2hSZXN1bHQgYXMgZmlyc3QgcGFyYW1ldGVyJyk7XG4gIH1cblxuICBtYXBwaW5nID0gZXh0ZW5kKHt9LCBtYXBwaW5nKTtcbiAgdmFyIG9wZXJhdGlvbiA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wZXJhdGlvbik7XG4gIGZvciAodmFyIHRlcm1OYW1lIGluIG1hcHBpbmcpIHtcbiAgICBpZiAodHlwZW9mIG1hcHBpbmdbdGVybU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvcGVyYXRpb25bdGVybU5hbWVdID0gbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgICBkZWxldGUgbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgfVxuICB9XG4gIHZhciBnID0gcmVzLl9jc3QuZ3JhbW1hcjtcbiAgdmFyIHMgPSBnLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBvcGVyYXRpb24pO1xuICByZXR1cm4gcyhyZXMpLnRvQVNUKG1hcHBpbmcpO1xufVxuXG4vLyBSZXR1cm5zIGEgc2VtYW50aWNzIGNvbnRhaW5nIHRoZSB0b0FTVChtYXBwaW5nKSBvcGVyYXRpb24gZm9yIHRoZSBnaXZlbiBncmFtbWFyIGcuXG5mdW5jdGlvbiBzZW1hbnRpY3NGb3JUb0FTVChnKSB7XG4gIGlmICghKGcgaW5zdGFuY2VvZiBHcmFtbWFyKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2VtYW50aWNzVG9BU1QoKSBleHBlY3RzIGEgR3JhbW1hciBhcyBwYXJhbWV0ZXInKTtcbiAgfVxuXG4gIHJldHVybiBnLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBkZWZhdWx0T3BlcmF0aW9uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGhlbHBlcjogdG9BU1QsXG4gIHNlbWFudGljczogc2VtYW50aWNzRm9yVG9BU1Rcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhc3NpZ24gICAgICAgID0gcmVxdWlyZSgnZXM1LWV4dC9vYmplY3QvYXNzaWduJylcbiAgLCBub3JtYWxpemVPcHRzID0gcmVxdWlyZSgnZXM1LWV4dC9vYmplY3Qvbm9ybWFsaXplLW9wdGlvbnMnKVxuICAsIGlzQ2FsbGFibGUgICAgPSByZXF1aXJlKCdlczUtZXh0L29iamVjdC9pcy1jYWxsYWJsZScpXG4gICwgY29udGFpbnMgICAgICA9IHJlcXVpcmUoJ2VzNS1leHQvc3RyaW5nLyMvY29udGFpbnMnKVxuXG4gICwgZDtcblxuZCA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRzY3IsIHZhbHVlLyosIG9wdGlvbnMqLykge1xuXHR2YXIgYywgZSwgdywgb3B0aW9ucywgZGVzYztcblx0aWYgKChhcmd1bWVudHMubGVuZ3RoIDwgMikgfHwgKHR5cGVvZiBkc2NyICE9PSAnc3RyaW5nJykpIHtcblx0XHRvcHRpb25zID0gdmFsdWU7XG5cdFx0dmFsdWUgPSBkc2NyO1xuXHRcdGRzY3IgPSBudWxsO1xuXHR9IGVsc2Uge1xuXHRcdG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG5cdH1cblx0aWYgKGRzY3IgPT0gbnVsbCkge1xuXHRcdGMgPSB3ID0gdHJ1ZTtcblx0XHRlID0gZmFsc2U7XG5cdH0gZWxzZSB7XG5cdFx0YyA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ2MnKTtcblx0XHRlID0gY29udGFpbnMuY2FsbChkc2NyLCAnZScpO1xuXHRcdHcgPSBjb250YWlucy5jYWxsKGRzY3IsICd3Jyk7XG5cdH1cblxuXHRkZXNjID0geyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogYywgZW51bWVyYWJsZTogZSwgd3JpdGFibGU6IHcgfTtcblx0cmV0dXJuICFvcHRpb25zID8gZGVzYyA6IGFzc2lnbihub3JtYWxpemVPcHRzKG9wdGlvbnMpLCBkZXNjKTtcbn07XG5cbmQuZ3MgPSBmdW5jdGlvbiAoZHNjciwgZ2V0LCBzZXQvKiwgb3B0aW9ucyovKSB7XG5cdHZhciBjLCBlLCBvcHRpb25zLCBkZXNjO1xuXHRpZiAodHlwZW9mIGRzY3IgIT09ICdzdHJpbmcnKSB7XG5cdFx0b3B0aW9ucyA9IHNldDtcblx0XHRzZXQgPSBnZXQ7XG5cdFx0Z2V0ID0gZHNjcjtcblx0XHRkc2NyID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzWzNdO1xuXHR9XG5cdGlmIChnZXQgPT0gbnVsbCkge1xuXHRcdGdldCA9IHVuZGVmaW5lZDtcblx0fSBlbHNlIGlmICghaXNDYWxsYWJsZShnZXQpKSB7XG5cdFx0b3B0aW9ucyA9IGdldDtcblx0XHRnZXQgPSBzZXQgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoc2V0ID09IG51bGwpIHtcblx0XHRzZXQgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoIWlzQ2FsbGFibGUoc2V0KSkge1xuXHRcdG9wdGlvbnMgPSBzZXQ7XG5cdFx0c2V0ID0gdW5kZWZpbmVkO1xuXHR9XG5cdGlmIChkc2NyID09IG51bGwpIHtcblx0XHRjID0gdHJ1ZTtcblx0XHRlID0gZmFsc2U7XG5cdH0gZWxzZSB7XG5cdFx0YyA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ2MnKTtcblx0XHRlID0gY29udGFpbnMuY2FsbChkc2NyLCAnZScpO1xuXHR9XG5cblx0ZGVzYyA9IHsgZ2V0OiBnZXQsIHNldDogc2V0LCBjb25maWd1cmFibGU6IGMsIGVudW1lcmFibGU6IGUgfTtcblx0cmV0dXJuICFvcHRpb25zID8gZGVzYyA6IGFzc2lnbihub3JtYWxpemVPcHRzKG9wdGlvbnMpLCBkZXNjKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pcy1pbXBsZW1lbnRlZCcpKClcblx0PyBPYmplY3QuYXNzaWduXG5cdDogcmVxdWlyZSgnLi9zaGltJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYXNzaWduID0gT2JqZWN0LmFzc2lnbiwgb2JqO1xuXHRpZiAodHlwZW9mIGFzc2lnbiAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXHRvYmogPSB7IGZvbzogJ3JheicgfTtcblx0YXNzaWduKG9iaiwgeyBiYXI6ICdkd2EnIH0sIHsgdHJ6eTogJ3RyenknIH0pO1xuXHRyZXR1cm4gKG9iai5mb28gKyBvYmouYmFyICsgb2JqLnRyenkpID09PSAncmF6ZHdhdHJ6eSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIga2V5cyAgPSByZXF1aXJlKCcuLi9rZXlzJylcbiAgLCB2YWx1ZSA9IHJlcXVpcmUoJy4uL3ZhbGlkLXZhbHVlJylcblxuICAsIG1heCA9IE1hdGgubWF4O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkZXN0LCBzcmMvKiwg4oCmc3JjbiovKSB7XG5cdHZhciBlcnJvciwgaSwgbCA9IG1heChhcmd1bWVudHMubGVuZ3RoLCAyKSwgYXNzaWduO1xuXHRkZXN0ID0gT2JqZWN0KHZhbHVlKGRlc3QpKTtcblx0YXNzaWduID0gZnVuY3Rpb24gKGtleSkge1xuXHRcdHRyeSB7IGRlc3Rba2V5XSA9IHNyY1trZXldOyB9IGNhdGNoIChlKSB7XG5cdFx0XHRpZiAoIWVycm9yKSBlcnJvciA9IGU7XG5cdFx0fVxuXHR9O1xuXHRmb3IgKGkgPSAxOyBpIDwgbDsgKytpKSB7XG5cdFx0c3JjID0gYXJndW1lbnRzW2ldO1xuXHRcdGtleXMoc3JjKS5mb3JFYWNoKGFzc2lnbik7XG5cdH1cblx0aWYgKGVycm9yICE9PSB1bmRlZmluZWQpIHRocm93IGVycm9yO1xuXHRyZXR1cm4gZGVzdDtcbn07XG4iLCIvLyBEZXByZWNhdGVkXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqID09PSAnZnVuY3Rpb24nOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpXG5cdD8gT2JqZWN0LmtleXNcblx0OiByZXF1aXJlKCcuL3NoaW0nKTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmtleXMoJ3ByaW1pdGl2ZScpO1xuXHRcdHJldHVybiB0cnVlO1xuXHR9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtleXMgPSBPYmplY3Qua2V5cztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG5cdHJldHVybiBrZXlzKG9iamVjdCA9PSBudWxsID8gb2JqZWN0IDogT2JqZWN0KG9iamVjdCkpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGZvckVhY2ggPSBBcnJheS5wcm90b3R5cGUuZm9yRWFjaCwgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcblxudmFyIHByb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBvYmopIHtcblx0dmFyIGtleTtcblx0Zm9yIChrZXkgaW4gc3JjKSBvYmpba2V5XSA9IHNyY1trZXldO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucy8qLCDigKZvcHRpb25zKi8pIHtcblx0dmFyIHJlc3VsdCA9IGNyZWF0ZShudWxsKTtcblx0Zm9yRWFjaC5jYWxsKGFyZ3VtZW50cywgZnVuY3Rpb24gKG9wdGlvbnMpIHtcblx0XHRpZiAob3B0aW9ucyA9PSBudWxsKSByZXR1cm47XG5cdFx0cHJvY2VzcyhPYmplY3Qob3B0aW9ucyksIHJlc3VsdCk7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0aWYgKHZhbHVlID09IG51bGwpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpXG5cdD8gU3RyaW5nLnByb3RvdHlwZS5jb250YWluc1xuXHQ6IHJlcXVpcmUoJy4vc2hpbScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc3RyID0gJ3JhemR3YXRyenknO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0aWYgKHR5cGVvZiBzdHIuY29udGFpbnMgIT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblx0cmV0dXJuICgoc3RyLmNvbnRhaW5zKCdkd2EnKSA9PT0gdHJ1ZSkgJiYgKHN0ci5jb250YWlucygnZm9vJykgPT09IGZhbHNlKSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5kZXhPZiA9IFN0cmluZy5wcm90b3R5cGUuaW5kZXhPZjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc2VhcmNoU3RyaW5nLyosIHBvc2l0aW9uKi8pIHtcblx0cmV0dXJuIGluZGV4T2YuY2FsbCh0aGlzLCBzZWFyY2hTdHJpbmcsIGFyZ3VtZW50c1sxXSkgPiAtMTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9pcy1pbXBsZW1lbnRlZCcpKCkgPyBTeW1ib2wgOiByZXF1aXJlKCcuL3BvbHlmaWxsJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2YWxpZFR5cGVzID0geyBvYmplY3Q6IHRydWUsIHN5bWJvbDogdHJ1ZSB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIHN5bWJvbDtcblx0aWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblx0c3ltYm9sID0gU3ltYm9sKCd0ZXN0IHN5bWJvbCcpO1xuXHR0cnkgeyBTdHJpbmcoc3ltYm9sKTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH1cblxuXHQvLyBSZXR1cm4gJ3RydWUnIGFsc28gZm9yIHBvbHlmaWxsc1xuXHRpZiAoIXZhbGlkVHlwZXNbdHlwZW9mIFN5bWJvbC5pdGVyYXRvcl0pIHJldHVybiBmYWxzZTtcblx0aWYgKCF2YWxpZFR5cGVzW3R5cGVvZiBTeW1ib2wudG9QcmltaXRpdmVdKSByZXR1cm4gZmFsc2U7XG5cdGlmICghdmFsaWRUeXBlc1t0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnXSkgcmV0dXJuIGZhbHNlO1xuXG5cdHJldHVybiB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeCkge1xuXHRpZiAoIXgpIHJldHVybiBmYWxzZTtcblx0aWYgKHR5cGVvZiB4ID09PSAnc3ltYm9sJykgcmV0dXJuIHRydWU7XG5cdGlmICgheC5jb25zdHJ1Y3RvcikgcmV0dXJuIGZhbHNlO1xuXHRpZiAoeC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnU3ltYm9sJykgcmV0dXJuIGZhbHNlO1xuXHRyZXR1cm4gKHhbeC5jb25zdHJ1Y3Rvci50b1N0cmluZ1RhZ10gPT09ICdTeW1ib2wnKTtcbn07XG4iLCIvLyBFUzIwMTUgU3ltYm9sIHBvbHlmaWxsIGZvciBlbnZpcm9ubWVudHMgdGhhdCBkbyBub3Qgc3VwcG9ydCBpdCAob3IgcGFydGlhbGx5IHN1cHBvcnQgaXQpXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGQgICAgICAgICAgICAgID0gcmVxdWlyZSgnZCcpXG4gICwgdmFsaWRhdGVTeW1ib2wgPSByZXF1aXJlKCcuL3ZhbGlkYXRlLXN5bWJvbCcpXG5cbiAgLCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlLCBkZWZpbmVQcm9wZXJ0aWVzID0gT2JqZWN0LmRlZmluZVByb3BlcnRpZXNcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSwgb2JqUHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZVxuICAsIE5hdGl2ZVN5bWJvbCwgU3ltYm9sUG9seWZpbGwsIEhpZGRlblN5bWJvbCwgZ2xvYmFsU3ltYm9scyA9IGNyZWF0ZShudWxsKVxuICAsIGlzTmF0aXZlU2FmZTtcblxuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcblx0TmF0aXZlU3ltYm9sID0gU3ltYm9sO1xuXHR0cnkge1xuXHRcdFN0cmluZyhOYXRpdmVTeW1ib2woKSk7XG5cdFx0aXNOYXRpdmVTYWZlID0gdHJ1ZTtcblx0fSBjYXRjaCAoaWdub3JlKSB7fVxufVxuXG52YXIgZ2VuZXJhdGVOYW1lID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIGNyZWF0ZWQgPSBjcmVhdGUobnVsbCk7XG5cdHJldHVybiBmdW5jdGlvbiAoZGVzYykge1xuXHRcdHZhciBwb3N0Zml4ID0gMCwgbmFtZSwgaWUxMUJ1Z1dvcmthcm91bmQ7XG5cdFx0d2hpbGUgKGNyZWF0ZWRbZGVzYyArIChwb3N0Zml4IHx8ICcnKV0pICsrcG9zdGZpeDtcblx0XHRkZXNjICs9IChwb3N0Zml4IHx8ICcnKTtcblx0XHRjcmVhdGVkW2Rlc2NdID0gdHJ1ZTtcblx0XHRuYW1lID0gJ0BAJyArIGRlc2M7XG5cdFx0ZGVmaW5lUHJvcGVydHkob2JqUHJvdG90eXBlLCBuYW1lLCBkLmdzKG51bGwsIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0Ly8gRm9yIElFMTEgaXNzdWUgc2VlOlxuXHRcdFx0Ly8gaHR0cHM6Ly9jb25uZWN0Lm1pY3Jvc29mdC5jb20vSUUvZmVlZGJhY2tkZXRhaWwvdmlldy8xOTI4NTA4L1xuXHRcdFx0Ly8gICAgaWUxMS1icm9rZW4tZ2V0dGVycy1vbi1kb20tb2JqZWN0c1xuXHRcdFx0Ly8gaHR0cHM6Ly9naXRodWIuY29tL21lZGlrb28vZXM2LXN5bWJvbC9pc3N1ZXMvMTJcblx0XHRcdGlmIChpZTExQnVnV29ya2Fyb3VuZCkgcmV0dXJuO1xuXHRcdFx0aWUxMUJ1Z1dvcmthcm91bmQgPSB0cnVlO1xuXHRcdFx0ZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwgZCh2YWx1ZSkpO1xuXHRcdFx0aWUxMUJ1Z1dvcmthcm91bmQgPSBmYWxzZTtcblx0XHR9KSk7XG5cdFx0cmV0dXJuIG5hbWU7XG5cdH07XG59KCkpO1xuXG4vLyBJbnRlcm5hbCBjb25zdHJ1Y3RvciAobm90IG9uZSBleHBvc2VkKSBmb3IgY3JlYXRpbmcgU3ltYm9sIGluc3RhbmNlcy5cbi8vIFRoaXMgb25lIGlzIHVzZWQgdG8gZW5zdXJlIHRoYXQgYHNvbWVTeW1ib2wgaW5zdGFuY2VvZiBTeW1ib2xgIGFsd2F5cyByZXR1cm4gZmFsc2VcbkhpZGRlblN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuXHRpZiAodGhpcyBpbnN0YW5jZW9mIEhpZGRlblN5bWJvbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0cmV0dXJuIFN5bWJvbFBvbHlmaWxsKGRlc2NyaXB0aW9uKTtcbn07XG5cbi8vIEV4cG9zZWQgYFN5bWJvbGAgY29uc3RydWN0b3Jcbi8vIChyZXR1cm5zIGluc3RhbmNlcyBvZiBIaWRkZW5TeW1ib2wpXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbFBvbHlmaWxsID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKSB7XG5cdHZhciBzeW1ib2w7XG5cdGlmICh0aGlzIGluc3RhbmNlb2YgU3ltYm9sKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdUeXBlRXJyb3I6IFN5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuXHRpZiAoaXNOYXRpdmVTYWZlKSByZXR1cm4gTmF0aXZlU3ltYm9sKGRlc2NyaXB0aW9uKTtcblx0c3ltYm9sID0gY3JlYXRlKEhpZGRlblN5bWJvbC5wcm90b3R5cGUpO1xuXHRkZXNjcmlwdGlvbiA9IChkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBTdHJpbmcoZGVzY3JpcHRpb24pKTtcblx0cmV0dXJuIGRlZmluZVByb3BlcnRpZXMoc3ltYm9sLCB7XG5cdFx0X19kZXNjcmlwdGlvbl9fOiBkKCcnLCBkZXNjcmlwdGlvbiksXG5cdFx0X19uYW1lX186IGQoJycsIGdlbmVyYXRlTmFtZShkZXNjcmlwdGlvbikpXG5cdH0pO1xufTtcbmRlZmluZVByb3BlcnRpZXMoU3ltYm9sUG9seWZpbGwsIHtcblx0Zm9yOiBkKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRpZiAoZ2xvYmFsU3ltYm9sc1trZXldKSByZXR1cm4gZ2xvYmFsU3ltYm9sc1trZXldO1xuXHRcdHJldHVybiAoZ2xvYmFsU3ltYm9sc1trZXldID0gU3ltYm9sUG9seWZpbGwoU3RyaW5nKGtleSkpKTtcblx0fSksXG5cdGtleUZvcjogZChmdW5jdGlvbiAocykge1xuXHRcdHZhciBrZXk7XG5cdFx0dmFsaWRhdGVTeW1ib2wocyk7XG5cdFx0Zm9yIChrZXkgaW4gZ2xvYmFsU3ltYm9scykgaWYgKGdsb2JhbFN5bWJvbHNba2V5XSA9PT0gcykgcmV0dXJuIGtleTtcblx0fSksXG5cblx0Ly8gSWYgdGhlcmUncyBuYXRpdmUgaW1wbGVtZW50YXRpb24gb2YgZ2l2ZW4gc3ltYm9sLCBsZXQncyBmYWxsYmFjayB0byBpdFxuXHQvLyB0byBlbnN1cmUgcHJvcGVyIGludGVyb3BlcmFiaWxpdHkgd2l0aCBvdGhlciBuYXRpdmUgZnVuY3Rpb25zIGUuZy4gQXJyYXkuZnJvbVxuXHRoYXNJbnN0YW5jZTogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wuaGFzSW5zdGFuY2UpIHx8IFN5bWJvbFBvbHlmaWxsKCdoYXNJbnN0YW5jZScpKSxcblx0aXNDb25jYXRTcHJlYWRhYmxlOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGUpIHx8XG5cdFx0U3ltYm9sUG9seWZpbGwoJ2lzQ29uY2F0U3ByZWFkYWJsZScpKSxcblx0aXRlcmF0b3I6IGQoJycsIChOYXRpdmVTeW1ib2wgJiYgTmF0aXZlU3ltYm9sLml0ZXJhdG9yKSB8fCBTeW1ib2xQb2x5ZmlsbCgnaXRlcmF0b3InKSksXG5cdG1hdGNoOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5tYXRjaCkgfHwgU3ltYm9sUG9seWZpbGwoJ21hdGNoJykpLFxuXHRyZXBsYWNlOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5yZXBsYWNlKSB8fCBTeW1ib2xQb2x5ZmlsbCgncmVwbGFjZScpKSxcblx0c2VhcmNoOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5zZWFyY2gpIHx8IFN5bWJvbFBvbHlmaWxsKCdzZWFyY2gnKSksXG5cdHNwZWNpZXM6IGQoJycsIChOYXRpdmVTeW1ib2wgJiYgTmF0aXZlU3ltYm9sLnNwZWNpZXMpIHx8IFN5bWJvbFBvbHlmaWxsKCdzcGVjaWVzJykpLFxuXHRzcGxpdDogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wuc3BsaXQpIHx8IFN5bWJvbFBvbHlmaWxsKCdzcGxpdCcpKSxcblx0dG9QcmltaXRpdmU6IGQoJycsIChOYXRpdmVTeW1ib2wgJiYgTmF0aXZlU3ltYm9sLnRvUHJpbWl0aXZlKSB8fCBTeW1ib2xQb2x5ZmlsbCgndG9QcmltaXRpdmUnKSksXG5cdHRvU3RyaW5nVGFnOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC50b1N0cmluZ1RhZykgfHwgU3ltYm9sUG9seWZpbGwoJ3RvU3RyaW5nVGFnJykpLFxuXHR1bnNjb3BhYmxlczogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wudW5zY29wYWJsZXMpIHx8IFN5bWJvbFBvbHlmaWxsKCd1bnNjb3BhYmxlcycpKVxufSk7XG5cbi8vIEludGVybmFsIHR3ZWFrcyBmb3IgcmVhbCBzeW1ib2wgcHJvZHVjZXJcbmRlZmluZVByb3BlcnRpZXMoSGlkZGVuU3ltYm9sLnByb3RvdHlwZSwge1xuXHRjb25zdHJ1Y3RvcjogZChTeW1ib2xQb2x5ZmlsbCksXG5cdHRvU3RyaW5nOiBkKCcnLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzLl9fbmFtZV9fOyB9KVxufSk7XG5cbi8vIFByb3BlciBpbXBsZW1lbnRhdGlvbiBvZiBtZXRob2RzIGV4cG9zZWQgb24gU3ltYm9sLnByb3RvdHlwZVxuLy8gVGhleSB3b24ndCBiZSBhY2Nlc3NpYmxlIG9uIHByb2R1Y2VkIHN5bWJvbCBpbnN0YW5jZXMgYXMgdGhleSBkZXJpdmUgZnJvbSBIaWRkZW5TeW1ib2wucHJvdG90eXBlXG5kZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbFBvbHlmaWxsLnByb3RvdHlwZSwge1xuXHR0b1N0cmluZzogZChmdW5jdGlvbiAoKSB7IHJldHVybiAnU3ltYm9sICgnICsgdmFsaWRhdGVTeW1ib2wodGhpcykuX19kZXNjcmlwdGlvbl9fICsgJyknOyB9KSxcblx0dmFsdWVPZjogZChmdW5jdGlvbiAoKSB7IHJldHVybiB2YWxpZGF0ZVN5bWJvbCh0aGlzKTsgfSlcbn0pO1xuZGVmaW5lUHJvcGVydHkoU3ltYm9sUG9seWZpbGwucHJvdG90eXBlLCBTeW1ib2xQb2x5ZmlsbC50b1ByaW1pdGl2ZSwgZCgnJywgZnVuY3Rpb24gKCkge1xuXHR2YXIgc3ltYm9sID0gdmFsaWRhdGVTeW1ib2wodGhpcyk7XG5cdGlmICh0eXBlb2Ygc3ltYm9sID09PSAnc3ltYm9sJykgcmV0dXJuIHN5bWJvbDtcblx0cmV0dXJuIHN5bWJvbC50b1N0cmluZygpO1xufSkpO1xuZGVmaW5lUHJvcGVydHkoU3ltYm9sUG9seWZpbGwucHJvdG90eXBlLCBTeW1ib2xQb2x5ZmlsbC50b1N0cmluZ1RhZywgZCgnYycsICdTeW1ib2wnKSk7XG5cbi8vIFByb3BlciBpbXBsZW1lbnRhdG9uIG9mIHRvUHJpbWl0aXZlIGFuZCB0b1N0cmluZ1RhZyBmb3IgcmV0dXJuZWQgc3ltYm9sIGluc3RhbmNlc1xuZGVmaW5lUHJvcGVydHkoSGlkZGVuU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sUG9seWZpbGwudG9TdHJpbmdUYWcsXG5cdGQoJ2MnLCBTeW1ib2xQb2x5ZmlsbC5wcm90b3R5cGVbU3ltYm9sUG9seWZpbGwudG9TdHJpbmdUYWddKSk7XG5cbi8vIE5vdGU6IEl0J3MgaW1wb3J0YW50IHRvIGRlZmluZSBgdG9QcmltaXRpdmVgIGFzIGxhc3Qgb25lLCBhcyBzb21lIGltcGxlbWVudGF0aW9uc1xuLy8gaW1wbGVtZW50IGB0b1ByaW1pdGl2ZWAgbmF0aXZlbHkgd2l0aG91dCBpbXBsZW1lbnRpbmcgYHRvU3RyaW5nVGFnYCAob3Igb3RoZXIgc3BlY2lmaWVkIHN5bWJvbHMpXG4vLyBBbmQgdGhhdCBtYXkgaW52b2tlIGVycm9yIGluIGRlZmluaXRpb24gZmxvdzpcbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL21lZGlrb28vZXM2LXN5bWJvbC9pc3N1ZXMvMTMjaXNzdWVjb21tZW50LTE2NDE0NjE0OVxuZGVmaW5lUHJvcGVydHkoSGlkZGVuU3ltYm9sLnByb3RvdHlwZSwgU3ltYm9sUG9seWZpbGwudG9QcmltaXRpdmUsXG5cdGQoJ2MnLCBTeW1ib2xQb2x5ZmlsbC5wcm90b3R5cGVbU3ltYm9sUG9seWZpbGwudG9QcmltaXRpdmVdKSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXMtc3ltYm9sJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdGlmICghaXNTeW1ib2wodmFsdWUpKSB0aHJvdyBuZXcgVHlwZUVycm9yKHZhbHVlICsgXCIgaXMgbm90IGEgc3ltYm9sXCIpO1xuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG4vLyBUaGUgX2lzQnVmZmVyIGNoZWNrIGlzIGZvciBTYWZhcmkgNS03IHN1cHBvcnQsIGJlY2F1c2UgaXQncyBtaXNzaW5nXG4vLyBPYmplY3QucHJvdG90eXBlLmNvbnN0cnVjdG9yLiBSZW1vdmUgdGhpcyBldmVudHVhbGx5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIChpc0J1ZmZlcihvYmopIHx8IGlzU2xvd0J1ZmZlcihvYmopIHx8ICEhb2JqLl9pc0J1ZmZlcilcbn1cblxuZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gISFvYmouY29uc3RydWN0b3IgJiYgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuXG4vLyBGb3IgTm9kZSB2MC4xMCBzdXBwb3J0LiBSZW1vdmUgdGhpcyBldmVudHVhbGx5LlxuZnVuY3Rpb24gaXNTbG93QnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmoucmVhZEZsb2F0TEUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIG9iai5zbGljZSA9PT0gJ2Z1bmN0aW9uJyAmJiBpc0J1ZmZlcihvYmouc2xpY2UoMCwgMCkpXG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5mdW5jdGlvbiBleHRlbmQob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0JykgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyRGVjbCA9IHJlcXVpcmUoJy4vR3JhbW1hckRlY2wnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gQnVpbGRlcigpIHt9XG5cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICBjdXJyZW50RGVjbDogbnVsbCxcblxuICBuZXdHcmFtbWFyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgfSxcblxuICBncmFtbWFyOiBmdW5jdGlvbihtZXRhSW5mbywgbmFtZSwgc3VwZXJHcmFtbWFyLCBkZWZhdWx0U3RhcnRSdWxlLCBydWxlcykge1xuICAgIHZhciBnRGVjbCA9IG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgICBpZiAoc3VwZXJHcmFtbWFyKSB7XG4gICAgICBnRGVjbC53aXRoU3VwZXJHcmFtbWFyKHRoaXMuZnJvbVJlY2lwZShzdXBlckdyYW1tYXIpKTtcbiAgICB9XG4gICAgaWYgKGRlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgIGdEZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGRlZmF1bHRTdGFydFJ1bGUpO1xuICAgIH1cbiAgICBpZiAobWV0YUluZm8gJiYgbWV0YUluZm8uc291cmNlKSB7XG4gICAgICBnRGVjbC53aXRoU291cmNlKG1ldGFJbmZvLnNvdXJjZSk7XG4gICAgfVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuY3VycmVudERlY2wgPSBnRGVjbDtcbiAgICBPYmplY3Qua2V5cyhydWxlcykuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgICAgdmFyIHJ1bGVSZWNpcGUgPSBydWxlc1tydWxlTmFtZV07XG5cbiAgICAgIHZhciBhY3Rpb24gPSBydWxlUmVjaXBlWzBdOyAvLyBkZWZpbmUvZXh0ZW5kL292ZXJyaWRlXG4gICAgICB2YXIgbWV0YUluZm8gPSBydWxlUmVjaXBlWzFdO1xuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gcnVsZVJlY2lwZVsyXTtcbiAgICAgIHZhciBmb3JtYWxzID0gcnVsZVJlY2lwZVszXTtcbiAgICAgIHZhciBib2R5ID0gc2VsZi5mcm9tUmVjaXBlKHJ1bGVSZWNpcGVbNF0pO1xuXG4gICAgICB2YXIgc291cmNlO1xuICAgICAgaWYgKGdEZWNsLnNvdXJjZSAmJiBtZXRhSW5mbyAmJiBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCkge1xuICAgICAgICBzb3VyY2UgPSBnRGVjbC5zb3VyY2Uuc3ViSW50ZXJ2YWwoXG4gICAgICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbFswXSxcbiAgICAgICAgICAgIG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzFdIC0gbWV0YUluZm8uc291cmNlSW50ZXJ2YWxbMF0pO1xuICAgICAgfVxuICAgICAgZ0RlY2xbYWN0aW9uXShydWxlTmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG4gICAgfSk7XG4gICAgdGhpcy5jdXJyZW50RGVjbCA9IG51bGw7XG4gICAgcmV0dXJuIGdEZWNsLmJ1aWxkKCk7XG4gIH0sXG5cbiAgdGVybWluYWw6IGZ1bmN0aW9uKHgpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5UZXJtaW5hbCh4KTtcbiAgfSxcblxuICByYW5nZTogZnVuY3Rpb24oZnJvbSwgdG8pIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5SYW5nZShmcm9tLCB0byk7XG4gIH0sXG5cbiAgcGFyYW06IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUGFyYW0oaW5kZXgpO1xuICB9LFxuXG4gIGFsdDogZnVuY3Rpb24oLyogdGVybTEsIHRlcm0xLCAuLi4gKi8pIHtcbiAgICB2YXIgdGVybXMgPSBbXTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgaWYgKCEoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICBhcmcgPSB0aGlzLmZyb21SZWNpcGUoYXJnKTtcbiAgICAgIH1cbiAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuQWx0KSB7XG4gICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXJtcy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBwZXhwcnMuQWx0KHRlcm1zKTtcbiAgfSxcblxuICBzZXE6IGZ1bmN0aW9uKC8qIGZhY3RvcjEsIGZhY3RvcjIsIC4uLiAqLykge1xuICAgIHZhciBmYWN0b3JzID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgIGlmICghKGFyZyBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgYXJnID0gdGhpcy5mcm9tUmVjaXBlKGFyZyk7XG4gICAgICB9XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICBmYWN0b3JzID0gZmFjdG9ycy5jb25jYXQoYXJnLmZhY3RvcnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9ycy5wdXNoKGFyZyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWN0b3JzLmxlbmd0aCA9PT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgcGV4cHJzLlNlcShmYWN0b3JzKTtcbiAgfSxcblxuICBzdGFyOiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLlN0YXIoZXhwcik7XG4gIH0sXG5cbiAgcGx1czogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5QbHVzKGV4cHIpO1xuICB9LFxuXG4gIG9wdDogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5PcHQoZXhwcik7XG4gIH0sXG5cbiAgbm90OiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLk5vdChleHByKTtcbiAgfSxcblxuICBsYTogZnVuY3Rpb24oZXhwcikge1xuICAgIC8vIFRPRE86IHRlbXBvcmFyeSB0byBzdGlsbCBiZSBhYmxlIHRvIHJlYWQgb2xkIHJlY2lwZXNcbiAgICByZXR1cm4gdGhpcy5sb29rYWhlYWQoZXhwcik7XG4gIH0sXG5cbiAgbG9va2FoZWFkOiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLkxvb2thaGVhZChleHByKTtcbiAgfSxcblxuICBsZXg6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuTGV4KGV4cHIpO1xuICB9LFxuXG4gIGFwcDogZnVuY3Rpb24ocnVsZU5hbWUsIG9wdFBhcmFtcykge1xuICAgIGlmIChvcHRQYXJhbXMgJiYgb3B0UGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIG9wdFBhcmFtcyA9IG9wdFBhcmFtcy5tYXAoZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByID8gcGFyYW0gOlxuICAgICAgICAgIHRoaXMuZnJvbVJlY2lwZShwYXJhbSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUsIG9wdFBhcmFtcyk7XG4gIH0sXG5cbiAgZnJvbVJlY2lwZTogZnVuY3Rpb24ocmVjaXBlKSB7XG4gICAgLy8gdGhlIG1ldGEtaW5mbyBvZiAnZ3JhbW1hcicgaXMgcHJvY2Nlc3NlZCBpbiBCdWlsZGVyLmdyYW1tYXJcbiAgICB2YXIgcmVzdWx0ID0gdGhpc1tyZWNpcGVbMF1dLmFwcGx5KHRoaXMsXG4gICAgICByZWNpcGVbMF0gPT09ICdncmFtbWFyJyA/IHJlY2lwZS5zbGljZSgxKSA6IHJlY2lwZS5zbGljZSgyKSk7XG5cbiAgICB2YXIgbWV0YUluZm8gPSByZWNpcGVbMV07XG4gICAgaWYgKG1ldGFJbmZvKSB7XG4gICAgICBpZiAobWV0YUluZm8uc291cmNlSW50ZXJ2YWwgJiYgdGhpcy5jdXJyZW50RGVjbCkge1xuICAgICAgICByZXN1bHQud2l0aFNvdXJjZShcbiAgICAgICAgICB0aGlzLmN1cnJlbnREZWNsLnNvdXJjZUludGVydmFsLmFwcGx5KHRoaXMuY3VycmVudERlY2wsIG1ldGFJbmZvLnNvdXJjZUludGVydmFsKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEZhaWx1cmUgPSByZXF1aXJlKCcuL0ZhaWx1cmUnKTtcbnZhciBUZXJtaW5hbE5vZGUgPSByZXF1aXJlKCcuL25vZGVzJykuVGVybWluYWxOb2RlO1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vY29tbW9uJykuYXNzZXJ0O1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG5mdW5jdGlvbiBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbChwYXJhbSkge1xuICB0aGlzLm9iaiA9IHBhcmFtO1xufVxuaW5oZXJpdHMoQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwsIHBleHBycy5QRXhwcik7XG5cbkNhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZSA9IHtcbiAgX2dldFN0cmluZzogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICB2YXIgdGVybWluYWwgPSBzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKS5hcmdzW3RoaXMub2JqLmluZGV4XTtcbiAgICBhc3NlcnQodGVybWluYWwgaW5zdGFuY2VvZiBwZXhwcnMuVGVybWluYWwsICdleHBlY3RlZCBhIFRlcm1pbmFsIGV4cHJlc3Npb24nKTtcbiAgICByZXR1cm4gdGVybWluYWwub2JqO1xuICB9LFxuXG4gIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBQRXhwciBBUElcblxuICBhbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICBldmFsOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIHZhciBtYXRjaFN0ciA9IHRoaXMuX2dldFN0cmluZyhzdGF0ZSk7XG4gICAgaWYgKCFpbnB1dFN0cmVhbS5tYXRjaFN0cmluZyhtYXRjaFN0ciwgdHJ1ZSkpIHtcbiAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIG1hdGNoU3RyKSwgb3JpZ1Bvcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgZ2VuZXJhdGVFeGFtcGxlOiBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgLy8gU3RhcnQgd2l0aCBhIGV4YW1wbGUgZ2VuZXJhdGVkIGZyb20gdGhlIFRlcm1pbmFsLi4uXG4gICAgdmFyIHN0ciA9IHRoaXMub2JqLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKS52YWx1ZTtcblxuICAgIC8vIC4uLmFuZCByYW5kb21seSBzd2l0Y2ggY2hhcmFjdGVycyB0byB1cHBlcmNhc2UvbG93ZXJjYXNlLlxuICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YWx1ZSArPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gc3RyW2ldLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiBzdHJbaV0udG9Mb2NhbGVVcHBlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHt2YWx1ZTogdmFsdWV9O1xuICB9LFxuXG4gIGdldEFyaXR5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gMTtcbiAgfSxcblxuICBzdWJzdGl0dXRlUGFyYW1zOiBmdW5jdGlvbihhY3R1YWxzKSB7XG4gICAgcmV0dXJuIG5ldyBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCh0aGlzLm9iai5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbiAgfSxcblxuICB0b0Rpc3BsYXlTdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm9iai50b0Rpc3BsYXlTdHJpbmcoKSArICcgKGNhc2UtaW5zZW5zaXRpdmUpJztcbiAgfSxcblxuICB0b0ZhaWx1cmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCB0aGlzLm9iai50b0ZhaWx1cmUoKSArICcgKGNhc2UtaW5zZW5zaXRpdmUpJywgJ2Rlc2NyaXB0aW9uJyk7XG4gIH0sXG5cbiAgX2lzTnVsbGFibGU6IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy5vYmouX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzZUluc2Vuc2l0aXZlVGVybWluYWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBgRmFpbHVyZWBzIHJlcHJlc2VudCBleHByZXNzaW9ucyB0aGF0IHdlcmVuJ3QgbWF0Y2hlZCB3aGlsZSBwYXJzaW5nLiBUaGV5IGFyZSB1c2VkIHRvIGdlbmVyYXRlXG4gIGVycm9yIG1lc3NhZ2VzIGF1dG9tYXRpY2FsbHkuIFRoZSBpbnRlcmZhY2Ugb2YgYEZhaWx1cmVgcyBpbmNsdWRlcyB0aGUgY29sbG93aW5nIG1ldGhvZHM6XG5cbiAgLSBnZXRUZXh0KCkgOiBTdHJpbmdcbiAgLSBnZXRUeXBlKCkgOiBTdHJpbmcgIChvbmUgb2Yge1wiZGVzY3JpcHRpb25cIiwgXCJzdHJpbmdcIiwgXCJjb2RlXCJ9KVxuICAtIGlzRGVzY3JpcHRpb24oKSA6IGJvb2xcbiAgLSBpc1N0cmluZ1Rlcm1pbmFsKCkgOiBib29sXG4gIC0gaXNDb2RlKCkgOiBib29sXG4gIC0gaXNGbHVmZnkoKSA6IGJvb2xcbiAgLSBtYWtlRmx1ZmZ5KCkgOiB2b2lkXG4gIC0gc3Vic3VtZXMoRmFpbHVyZSkgOiBib29sXG4qL1xuXG5mdW5jdGlvbiBpc1ZhbGlkVHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlID09PSAnZGVzY3JpcHRpb24nIHx8IHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdjb2RlJztcbn1cblxuZnVuY3Rpb24gRmFpbHVyZShwZXhwciwgdGV4dCwgdHlwZSkge1xuICBpZiAoIWlzVmFsaWRUeXBlKHR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIEZhaWx1cmUgdHlwZTogJyArIHR5cGUpO1xuICB9XG4gIHRoaXMucGV4cHIgPSBwZXhwcjtcbiAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgdGhpcy50eXBlID0gdHlwZTtcbiAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn1cblxuRmFpbHVyZS5wcm90b3R5cGUuZ2V0UEV4cHIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucGV4cHI7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRleHQ7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGU7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5pc0Rlc2NyaXB0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdkZXNjcmlwdGlvbic7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5pc1N0cmluZ1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdzdHJpbmcnO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuaXNDb2RlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdjb2RlJztcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmlzRmx1ZmZ5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZsdWZmeTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLm1ha2VGbHVmZnkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5mbHVmZnkgPSB0cnVlO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuY2xlYXJGbHVmZnkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLnN1YnN1bWVzID0gZnVuY3Rpb24odGhhdCkge1xuICByZXR1cm4gdGhpcy5nZXRUZXh0KCkgPT09IHRoYXQuZ2V0VGV4dCgpICYmXG4gICAgICB0aGlzLnR5cGUgPT09IHRoYXQudHlwZSAmJlxuICAgICAgKCF0aGlzLmlzRmx1ZmZ5KCkgfHwgdGhpcy5pc0ZsdWZmeSgpICYmIHRoYXQuaXNGbHVmZnkoKSk7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50eXBlID09PSAnc3RyaW5nJyA/XG4gICAgSlNPTi5zdHJpbmdpZnkodGhpcy5nZXRUZXh0KCkpIDpcbiAgICB0aGlzLmdldFRleHQoKTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBmYWlsdXJlID0gbmV3IEZhaWx1cmUodGhpcy5wZXhwciwgdGhpcy50ZXh0LCB0aGlzLnR5cGUpO1xuICBpZiAodGhpcy5pc0ZsdWZmeSgpKSB7XG4gICAgZmFpbHVyZS5tYWtlRmx1ZmZ5KCk7XG4gIH1cbiAgcmV0dXJuIGZhaWx1cmU7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS50b0tleSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygpICsgJyMnICsgdGhpcy50eXBlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gRmFpbHVyZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCA9IHJlcXVpcmUoJy4vQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwnKTtcbnZhciBNYXRjaGVyID0gcmVxdWlyZSgnLi9NYXRjaGVyJyk7XG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGdldFNvcnRlZFJ1bGVWYWx1ZXMoZ3JhbW1hcikge1xuICByZXR1cm4gT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuc29ydCgpLm1hcChmdW5jdGlvbihuYW1lKSB7IHJldHVybiBncmFtbWFyLnJ1bGVzW25hbWVdOyB9KTtcbn1cblxuZnVuY3Rpb24gR3JhbW1hcihcbiAgICBuYW1lLFxuICAgIHN1cGVyR3JhbW1hcixcbiAgICBydWxlcyxcbiAgICBvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gIGlmIChvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgaWYgKCEob3B0RGVmYXVsdFN0YXJ0UnVsZSBpbiBydWxlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3RhcnQgcnVsZTogJ1wiICsgb3B0RGVmYXVsdFN0YXJ0UnVsZSArXG4gICAgICAgICAgICAgICAgICAgICAgXCInIGlzIG5vdCBhIHJ1bGUgaW4gZ3JhbW1hciAnXCIgKyBuYW1lICsgXCInXCIpO1xuICAgIH1cbiAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBvcHREZWZhdWx0U3RhcnRSdWxlO1xuICB9XG59XG5cbnZhciBvaG1HcmFtbWFyO1xudmFyIGJ1aWxkR3JhbW1hcjtcblxuLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gbWFpbi5qcyBvbmNlIE9obSBoYXMgbG9hZGVkLlxuR3JhbW1hci5pbml0QXBwbGljYXRpb25QYXJzZXIgPSBmdW5jdGlvbihncmFtbWFyLCBidWlsZGVyRm4pIHtcbiAgb2htR3JhbW1hciA9IGdyYW1tYXI7XG4gIGJ1aWxkR3JhbW1hciA9IGJ1aWxkZXJGbjtcbn07XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBtYXRjaGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IE1hdGNoZXIodGhpcyk7XG4gIH0sXG5cbiAgLy8gUmV0dXJuIHRydWUgaWYgdGhlIGdyYW1tYXIgaXMgYSBidWlsdC1pbiBncmFtbWFyLCBvdGhlcndpc2UgZmFsc2UuXG4gIC8vIE5PVEU6IFRoaXMgbWlnaHQgZ2l2ZSBhbiB1bmV4cGVjdGVkIHJlc3VsdCBpZiBjYWxsZWQgYmVmb3JlIEJ1aWx0SW5SdWxlcyBpcyBkZWZpbmVkIVxuICBpc0J1aWx0SW46IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzID09PSBHcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzIHx8IHRoaXMgPT09IEdyYW1tYXIuQnVpbHRJblJ1bGVzO1xuICB9LFxuXG4gIGVxdWFsczogZnVuY3Rpb24oZykge1xuICAgIGlmICh0aGlzID09PSBnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRG8gdGhlIGNoZWFwZXN0IGNvbXBhcmlzb25zIGZpcnN0LlxuICAgIGlmIChnID09IG51bGwgfHxcbiAgICAgICAgdGhpcy5uYW1lICE9PSBnLm5hbWUgfHxcbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlICE9PSBnLmRlZmF1bHRTdGFydFJ1bGUgfHxcbiAgICAgICAgISh0aGlzLnN1cGVyR3JhbW1hciA9PT0gZy5zdXBlckdyYW1tYXIgfHwgdGhpcy5zdXBlckdyYW1tYXIuZXF1YWxzKGcuc3VwZXJHcmFtbWFyKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG15UnVsZXMgPSBnZXRTb3J0ZWRSdWxlVmFsdWVzKHRoaXMpO1xuICAgIHZhciBvdGhlclJ1bGVzID0gZ2V0U29ydGVkUnVsZVZhbHVlcyhnKTtcbiAgICByZXR1cm4gbXlSdWxlcy5sZW5ndGggPT09IG90aGVyUnVsZXMubGVuZ3RoICYmIG15UnVsZXMuZXZlcnkoZnVuY3Rpb24ocnVsZSwgaSkge1xuICAgICAgcmV0dXJuIHJ1bGUuZGVzY3JpcHRpb24gPT09IG90aGVyUnVsZXNbaV0uZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICBydWxlLmZvcm1hbHMuam9pbignLCcpID09PSBvdGhlclJ1bGVzW2ldLmZvcm1hbHMuam9pbignLCcpICYmXG4gICAgICAgICAgICAgcnVsZS5ib2R5LnRvU3RyaW5nKCkgPT09IG90aGVyUnVsZXNbaV0uYm9keS50b1N0cmluZygpO1xuICAgIH0pO1xuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgIHZhciBtID0gdGhpcy5tYXRjaGVyKCk7XG4gICAgbS5yZXBsYWNlSW5wdXRSYW5nZSgwLCAwLCBpbnB1dCk7XG4gICAgcmV0dXJuIG0ubWF0Y2gob3B0U3RhcnRBcHBsaWNhdGlvbik7XG4gIH0sXG5cbiAgdHJhY2U6IGZ1bmN0aW9uKGlucHV0LCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgdmFyIG0gPSB0aGlzLm1hdGNoZXIoKTtcbiAgICBtLnJlcGxhY2VJbnB1dFJhbmdlKDAsIDAsIGlucHV0KTtcbiAgICByZXR1cm4gbS50cmFjZShvcHRTdGFydEFwcGxpY2F0aW9uKTtcbiAgfSxcblxuICBzZW1hbnRpY3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkhIERlcHJlY2F0ZWQgaW4gdjAuMTIuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZW1hbnRpY3MoKSBpcyBkZXByZWNhdGVkIC0tIHVzZSBjcmVhdGVTZW1hbnRpY3MoKSBpbnN0ZWFkLicpO1xuICB9LFxuXG4gIGNyZWF0ZVNlbWFudGljczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3ModGhpcyk7XG4gIH0sXG5cbiAgZXh0ZW5kU2VtYW50aWNzOiBmdW5jdGlvbihzdXBlclNlbWFudGljcykge1xuICAgIHJldHVybiBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzKHRoaXMsIHN1cGVyU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG4gIH0sXG5cbiAgLy8gQ2hlY2sgdGhhdCBldmVyeSBrZXkgaW4gYGFjdGlvbkRpY3RgIGNvcnJlc3BvbmRzIHRvIGEgc2VtYW50aWMgYWN0aW9uLCBhbmQgdGhhdCBpdCBtYXBzIHRvXG4gIC8vIGEgZnVuY3Rpb24gb2YgdGhlIGNvcnJlY3QgYXJpdHkuIElmIG5vdCwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICBfY2hlY2tUb3BEb3duQWN0aW9uRGljdDogZnVuY3Rpb24od2hhdCwgbmFtZSwgYWN0aW9uRGljdCkge1xuICAgIGZ1bmN0aW9uIGlzU3BlY2lhbEFjdGlvbihhKSB7XG4gICAgICByZXR1cm4gYSA9PT0gJ19pdGVyJyB8fCBhID09PSAnX3Rlcm1pbmFsJyB8fCBhID09PSAnX25vbnRlcm1pbmFsJyB8fCBhID09PSAnX2RlZmF1bHQnO1xuICAgIH1cblxuICAgIHZhciBwcm9ibGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gYWN0aW9uRGljdCkge1xuICAgICAgdmFyIHYgPSBhY3Rpb25EaWN0W2tdO1xuICAgICAgaWYgKCFpc1NwZWNpYWxBY3Rpb24oaykgJiYgIShrIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIGlzIG5vdCBhIHZhbGlkIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9ibGVtcy5wdXNoKFxuICAgICAgICAgICAgXCInXCIgKyBrICsgXCInIG11c3QgYmUgYSBmdW5jdGlvbiBpbiBhbiBhY3Rpb24gZGljdGlvbmFyeSBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGFjdHVhbCA9IHYubGVuZ3RoO1xuICAgICAgICB2YXIgZXhwZWN0ZWQgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkoayk7XG4gICAgICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgICAgcHJvYmxlbXMucHVzaChcbiAgICAgICAgICAgICAgXCJTZW1hbnRpYyBhY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBcIiArXG4gICAgICAgICAgICAgICdleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb2JsZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBwcmV0dHlQcm9ibGVtcyA9IHByb2JsZW1zLm1hcChmdW5jdGlvbihwcm9ibGVtKSB7IHJldHVybiAnLSAnICsgcHJvYmxlbTsgfSk7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJGb3VuZCBlcnJvcnMgaW4gdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IG9mIHRoZSAnXCIgKyBuYW1lICsgXCInIFwiICsgd2hhdCArICc6XFxuJyArXG4gICAgICAgICAgcHJldHR5UHJvYmxlbXMuam9pbignXFxuJykpO1xuICAgICAgZXJyb3IucHJvYmxlbXMgPSBwcm9ibGVtcztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm4gdGhlIGV4cGVjdGVkIGFyaXR5IGZvciBhIHNlbWFudGljIGFjdGlvbiBuYW1lZCBgYWN0aW9uTmFtZWAsIHdoaWNoXG4gIC8vIGlzIGVpdGhlciBhIHJ1bGUgbmFtZSBvciBhIHNwZWNpYWwgYWN0aW9uIG5hbWUgbGlrZSAnX25vbnRlcm1pbmFsJy5cbiAgX3RvcERvd25BY3Rpb25Bcml0eTogZnVuY3Rpb24oYWN0aW9uTmFtZSkge1xuICAgIGlmIChhY3Rpb25OYW1lID09PSAnX2l0ZXInIHx8IGFjdGlvbk5hbWUgPT09ICdfbm9udGVybWluYWwnIHx8IGFjdGlvbk5hbWUgPT09ICdfZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ190ZXJtaW5hbCcpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ydWxlc1thY3Rpb25OYW1lXS5ib2R5LmdldEFyaXR5KCk7XG4gIH0sXG5cbiAgX2luaGVyaXRzRnJvbTogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHZhciBnID0gdGhpcy5zdXBlckdyYW1tYXI7XG4gICAgd2hpbGUgKGcpIHtcbiAgICAgIGlmIChnLmVxdWFscyhncmFtbWFyLCB0cnVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGcgPSBnLnN1cGVyR3JhbW1hcjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHRvUmVjaXBlOiBmdW5jdGlvbihvcHRWYXJOYW1lKSB7XG4gICAgdmFyIG1ldGFJbmZvID0ge307XG4gICAgLy8gSW5jbHVkZSB0aGUgZ3JhbW1hciBzb3VyY2UgaWYgaXQgaXMgYXZhaWxhYmxlLlxuICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgbWV0YUluZm8uc291cmNlID0gdGhpcy5zb3VyY2UuY29udGVudHM7XG4gICAgfVxuXG4gICAgdmFyIHN1cGVyR3JhbW1hciA9IG51bGw7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyICYmICF0aGlzLnN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgICAgc3VwZXJHcmFtbWFyID0gSlNPTi5wYXJzZSh0aGlzLnN1cGVyR3JhbW1hci50b1JlY2lwZSgpKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnRSdWxlID0gbnVsbDtcbiAgICBpZiAodGhpcy5kZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICBzdGFydFJ1bGUgPSB0aGlzLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgfVxuXG4gICAgdmFyIHJ1bGVzID0ge307XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMucnVsZXMpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBydWxlSW5mbyA9IHNlbGYucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgdmFyIGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICAgICAgdmFyIGlzRGVmaW5pdGlvbiA9ICFzZWxmLnN1cGVyR3JhbW1hciB8fCAhc2VsZi5zdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdO1xuXG4gICAgICB2YXIgb3BlcmF0aW9uO1xuICAgICAgaWYgKGlzRGVmaW5pdGlvbikge1xuICAgICAgICBvcGVyYXRpb24gPSAnZGVmaW5lJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wZXJhdGlvbiA9IGJvZHkgaW5zdGFuY2VvZiBwZXhwcnMuRXh0ZW5kID8gJ2V4dGVuZCcgOiAnb3ZlcnJpZGUnO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgICAgIGlmIChydWxlSW5mby5zb3VyY2UgJiYgc2VsZi5zb3VyY2UpIHtcbiAgICAgICAgdmFyIGFkanVzdGVkID0gcnVsZUluZm8uc291cmNlLnJlbGF0aXZlVG8oc2VsZi5zb3VyY2UpO1xuICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCA9IFthZGp1c3RlZC5zdGFydElkeCwgYWRqdXN0ZWQuZW5kSWR4XTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gaXNEZWZpbml0aW9uID8gcnVsZUluZm8uZGVzY3JpcHRpb24gOiBudWxsO1xuICAgICAgdmFyIGJvZHlSZWNpcGUgPSBib2R5Lm91dHB1dFJlY2lwZShydWxlSW5mby5mb3JtYWxzLCBzZWxmLnNvdXJjZSk7XG5cbiAgICAgIHJ1bGVzW3J1bGVOYW1lXSA9IFtcbiAgICAgICAgb3BlcmF0aW9uLCAvLyBcImRlZmluZVwiL1wiZXh0ZW5kXCIvXCJvdmVycmlkZVwiXG4gICAgICAgIG1ldGFJbmZvLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgcnVsZUluZm8uZm9ybWFscyxcbiAgICAgICAgYm9keVJlY2lwZVxuICAgICAgXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbXG4gICAgICAnZ3JhbW1hcicsXG4gICAgICBtZXRhSW5mbyxcbiAgICAgIHRoaXMubmFtZSxcbiAgICAgIHN1cGVyR3JhbW1hcixcbiAgICAgIHN0YXJ0UnVsZSxcbiAgICAgIHJ1bGVzXG4gICAgXSk7XG4gIH0sXG5cbiAgLy8gVE9ETzogQ29tZSB1cCB3aXRoIGJldHRlciBuYW1lcyBmb3IgdGhlc2UgbWV0aG9kcy5cbiAgLy8gVE9ETzogV3JpdGUgdGhlIGFuYWxvZyBvZiB0aGVzZSBtZXRob2RzIGZvciBpbmhlcml0ZWQgYXR0cmlidXRlcy5cbiAgdG9PcGVyYXRpb25BY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gIH0sXG4gIHRvQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICB9LFxuXG4gIF90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBhZGQgdGhlIHN1cGVyLWdyYW1tYXIncyB0ZW1wbGF0ZXMgYXQgdGhlIHJpZ2h0IHBsYWNlLCBlLmcuLCBhIGNhc2UgZm9yIEFkZEV4cHJfcGx1c1xuICAgIC8vIHNob3VsZCBhcHBlYXIgbmV4dCB0byBvdGhlciBjYXNlcyBvZiBBZGRFeHByLlxuXG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICBzYi5hcHBlbmQoJ3snKTtcblxuICAgIHZhciBmaXJzdCA9IHRydWU7XG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gdGhpcy5ydWxlcykge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVzW3J1bGVOYW1lXS5ib2R5O1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJywnKTtcbiAgICAgIH1cbiAgICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gICAgICBzYi5hcHBlbmQoJyAgJyk7XG4gICAgICB0aGlzLmFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGUocnVsZU5hbWUsIGJvZHksIHNiKTtcbiAgICB9XG5cbiAgICBzYi5hcHBlbmQoJ1xcbn0nKTtcbiAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbiAgfSxcblxuICBhZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSwgc2IpIHtcbiAgICBzYi5hcHBlbmQocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZCgnOiBmdW5jdGlvbignKTtcbiAgICB2YXIgYXJpdHkgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZChjb21tb24ucmVwZWF0KCdfJywgYXJpdHkpLmpvaW4oJywgJykpO1xuICAgIHNiLmFwcGVuZCgnKSB7XFxuJyk7XG4gICAgc2IuYXBwZW5kKCcgIH0nKTtcbiAgfSxcblxuICAvLyBQYXJzZSBhIHN0cmluZyB3aGljaCBleHByZXNzZXMgYSBydWxlIGFwcGxpY2F0aW9uIGluIHRoaXMgZ3JhbW1hciwgYW5kIHJldHVybiB0aGVcbiAgLy8gcmVzdWx0aW5nIEFwcGx5IG5vZGUuXG4gIHBhcnNlQXBwbGljYXRpb246IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBhcHA7XG4gICAgaWYgKHN0ci5pbmRleE9mKCc8JykgPT09IC0xKSB7XG4gICAgICAvLyBzaW1wbGUgYXBwbGljYXRpb25cbiAgICAgIGFwcCA9IG5ldyBwZXhwcnMuQXBwbHkoc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGFyYW1ldGVyaXplZCBhcHBsaWNhdGlvblxuICAgICAgdmFyIGNzdCA9IG9obUdyYW1tYXIubWF0Y2goc3RyLCAnQmFzZV9hcHBsaWNhdGlvbicpO1xuICAgICAgYXBwID0gYnVpbGRHcmFtbWFyKGNzdCwge30pO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHBsaWNhdGlvbiBpcyB2YWxpZC5cbiAgICBpZiAoIShhcHAucnVsZU5hbWUgaW4gdGhpcy5ydWxlcykpIHtcbiAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkUnVsZShhcHAucnVsZU5hbWUsIHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHZhciBmb3JtYWxzID0gdGhpcy5ydWxlc1thcHAucnVsZU5hbWVdLmZvcm1hbHM7XG4gICAgaWYgKGZvcm1hbHMubGVuZ3RoICE9PSBhcHAuYXJncy5sZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnJ1bGVzW2FwcC5ydWxlTmFtZV0uc291cmNlO1xuICAgICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKGFwcC5ydWxlTmFtZSwgZm9ybWFscy5sZW5ndGgsIGFwcC5hcmdzLmxlbmd0aCwgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcDtcbiAgfVxufTtcblxuLy8gVGhlIGZvbGxvd2luZyBncmFtbWFyIGNvbnRhaW5zIGEgZmV3IHJ1bGVzIHRoYXQgY291bGRuJ3QgYmUgd3JpdHRlbiAgaW4gXCJ1c2VybGFuZFwiLlxuLy8gQXQgdGhlIGJvdHRvbSBvZiBzcmMvbWFpbi5qcywgd2UgY3JlYXRlIGEgc3ViLWdyYW1tYXIgb2YgdGhpcyBncmFtbWFyIHRoYXQncyBjYWxsZWRcbi8vIGBCdWlsdEluUnVsZXNgLiBUaGF0IGdyYW1tYXIgY29udGFpbnMgc2V2ZXJhbCBjb252ZW5pZW5jZSBydWxlcywgZS5nLiwgYGxldHRlcmAgYW5kXG4vLyBgZGlnaXRgLCBhbmQgaXMgaW1wbGljaXRseSB0aGUgc3VwZXItZ3JhbW1hciBvZiBhbnkgZ3JhbW1hciB3aG9zZSBzdXBlci1ncmFtbWFyXG4vLyBpc24ndCBzcGVjaWZpZWQuXG5HcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzID0gbmV3IEdyYW1tYXIoXG4gICdQcm90b0J1aWx0SW5SdWxlcycsICAvLyBuYW1lXG4gIHVuZGVmaW5lZCwgIC8vIHN1cGVyZ3JhbW1hclxuICB7XG4gICAgYW55OiB7XG4gICAgICBib2R5OiBwZXhwcnMuYW55LFxuICAgICAgZm9ybWFsczogW10sXG4gICAgICBkZXNjcmlwdGlvbjogJ2FueSBjaGFyYWN0ZXInLFxuICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICBlbmQ6IHtcbiAgICAgIGJvZHk6IHBleHBycy5lbmQsXG4gICAgICBmb3JtYWxzOiBbXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnZW5kIG9mIGlucHV0JyxcbiAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBjYXNlSW5zZW5zaXRpdmU6IHtcbiAgICAgIGJvZHk6IG5ldyBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbChuZXcgcGV4cHJzLlBhcmFtKDApKSxcbiAgICAgIGZvcm1hbHM6IFsnc3RyJ10sXG4gICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIGxvd2VyOiB7XG4gICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMbCcpLFxuICAgICAgZm9ybWFsczogW10sXG4gICAgICBkZXNjcmlwdGlvbjogJ2EgbG93ZXJjYXNlIGxldHRlcicsXG4gICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIHVwcGVyOiB7XG4gICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdScpLFxuICAgICAgZm9ybWFsczogW10sXG4gICAgICBkZXNjcmlwdGlvbjogJ2FuIHVwcGVyY2FzZSBsZXR0ZXInLFxuICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICAvLyBUaGUgdW5pb24gb2YgTHQgKHRpdGxlY2FzZSksIExtIChtb2RpZmllciksIGFuZCBMbyAob3RoZXIpLCBpLmUuIGFueSBsZXR0ZXIgbm90IGluIExsIG9yIEx1LlxuICAgIHVuaWNvZGVMdG1vOiB7XG4gICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdG1vJyksXG4gICAgICBmb3JtYWxzOiBbXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnYSBVbmljb2RlIGNoYXJhY3RlciBpbiBMdCwgTG0sIG9yIExvJyxcbiAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyBUaGVzZSBydWxlcyBhcmUgbm90IHRydWx5IHByaW1pdGl2ZSAodGhleSBjb3VsZCBiZSB3cml0dGVuIGluIHVzZXJsYW5kKSBidXQgYXJlIGRlZmluZWRcbiAgICAvLyBoZXJlIGZvciBib290c3RyYXBwaW5nIHB1cnBvc2VzLlxuICAgIHNwYWNlczoge1xuICAgICAgYm9keTogbmV3IHBleHBycy5TdGFyKG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlJykpLFxuICAgICAgZm9ybWFsczogW11cbiAgICB9LFxuICAgIHNwYWNlOiB7XG4gICAgICBib2R5OiBuZXcgcGV4cHJzLlJhbmdlKCdcXHgwMCcsICcgJyksXG4gICAgICBmb3JtYWxzOiBbXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnYSBzcGFjZSdcbiAgICB9XG4gIH1cbik7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXI7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hcicpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBTdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQ29uc3RydWN0b3JzXG5cbmZ1bmN0aW9uIEdyYW1tYXJEZWNsKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbn1cblxuLy8gSGVscGVyc1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuc291cmNlSW50ZXJ2YWwgPSBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gIHJldHVybiB0aGlzLnNvdXJjZS5zdWJJbnRlcnZhbChzdGFydElkeCwgZW5kSWR4IC0gc3RhcnRJZHgpO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmVuc3VyZVN1cGVyR3JhbW1hciA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyKSB7XG4gICAgdGhpcy53aXRoU3VwZXJHcmFtbWFyKFxuICAgICAgICAvLyBUT0RPOiBUaGUgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiBiZWxvdyBpcyBhbiB1Z2x5IGhhY2suIEl0J3Mga2luZCBvZiBvayBiZWNhdXNlXG4gICAgICAgIC8vIEkgZG91YnQgYW55b25lIHdpbGwgZXZlciB0cnkgdG8gZGVjbGFyZSBhIGdyYW1tYXIgY2FsbGVkIGBCdWlsdEluUnVsZXNgLiBTdGlsbCxcbiAgICAgICAgLy8gd2Ugc2hvdWxkIHRyeSB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLlxuICAgICAgICB0aGlzLm5hbWUgPT09ICdCdWlsdEluUnVsZXMnID9cbiAgICAgICAgICAgIEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgOlxuICAgICAgICAgICAgR3JhbW1hci5CdWlsdEluUnVsZXMpO1xuICB9XG4gIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hcjtcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSwgc291cmNlKSB7XG4gIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgc291cmNlKTtcbiAgfVxuICB2YXIgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICB2YXIgZXhwZWN0ZWRGb3JtYWxzID0gcnVsZUluZm8uZm9ybWFscztcbiAgdmFyIGV4cGVjdGVkTnVtRm9ybWFscyA9IGV4cGVjdGVkRm9ybWFscyA/IGV4cGVjdGVkRm9ybWFscy5sZW5ndGggOiAwO1xuICBpZiAoZm9ybWFscy5sZW5ndGggIT09IGV4cGVjdGVkTnVtRm9ybWFscykge1xuICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mUGFyYW1ldGVycyhuYW1lLCBleHBlY3RlZE51bUZvcm1hbHMsIGZvcm1hbHMubGVuZ3RoLCBzb3VyY2UpO1xuICB9XG4gIHJldHVybiB0aGlzLmluc3RhbGwobmFtZSwgZm9ybWFscywgYm9keSwgcnVsZUluZm8uZGVzY3JpcHRpb24sIHNvdXJjZSk7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbCA9IGZ1bmN0aW9uKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpIHtcbiAgdGhpcy5ydWxlc1tuYW1lXSA9IHtcbiAgICBib2R5OiBib2R5LmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKSxcbiAgICBmb3JtYWxzOiBmb3JtYWxzLFxuICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICBzb3VyY2U6IHNvdXJjZVxuICB9O1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIFN0dWZmIHRoYXQgeW91IHNob3VsZCBvbmx5IGRvIG9uY2VcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhTdXBlckdyYW1tYXIgPSBmdW5jdGlvbihzdXBlckdyYW1tYXIpIHtcbiAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgc3VwZXIgZ3JhbW1hciBvZiBhIEdyYW1tYXJEZWNsIGNhbm5vdCBiZSBzZXQgbW9yZSB0aGFuIG9uY2UnKTtcbiAgfVxuICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgdGhpcy5ydWxlcyA9IE9iamVjdC5jcmVhdGUoc3VwZXJHcmFtbWFyLnJ1bGVzKTtcblxuICAvLyBHcmFtbWFycyB3aXRoIGFuIGV4cGxpY2l0IHN1cGVyZ3JhbW1hciBpbmhlcml0IGEgZGVmYXVsdCBzdGFydCBydWxlLlxuICBpZiAoIXN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IHN1cGVyR3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhEZWZhdWx0U3RhcnRSdWxlID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gcnVsZU5hbWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhTb3VyY2UgPSBmdW5jdGlvbihzb3VyY2UpIHtcbiAgdGhpcy5zb3VyY2UgPSBuZXcgSW5wdXRTdHJlYW0oc291cmNlKS5pbnRlcnZhbCgwLCBzb3VyY2UubGVuZ3RoKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBDcmVhdGVzIGEgR3JhbW1hciBpbnN0YW5jZSwgYW5kIGlmIGl0IHBhc3NlcyB0aGUgc2FuaXR5IGNoZWNrcywgcmV0dXJucyBpdC5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKFxuICAgICAgdGhpcy5uYW1lLFxuICAgICAgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKSxcbiAgICAgIHRoaXMucnVsZXMsXG4gICAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUpO1xuXG4gIC8vIFRPRE86IGNoYW5nZSB0aGUgcGV4cHIucHJvdG90eXBlLmFzc2VydC4uLiBtZXRob2RzIHRvIG1ha2UgdGhlbSBhZGRcbiAgLy8gZXhjZXB0aW9ucyB0byBhbiBhcnJheSB0aGF0J3MgcHJvdmlkZWQgYXMgYW4gYXJnLiBUaGVuIHdlJ2xsIGJlIGFibGUgdG9cbiAgLy8gc2hvdyBtb3JlIHRoYW4gb25lIGVycm9yIG9mIHRoZSBzYW1lIHR5cGUgYXQgYSB0aW1lLlxuICAvLyBUT0RPOiBpbmNsdWRlIHRoZSBvZmZlbmRpbmcgcGV4cHIgaW4gdGhlIGVycm9ycywgdGhhdCB3YXkgd2UgY2FuIHNob3dcbiAgLy8gdGhlIHBhcnQgb2YgdGhlIHNvdXJjZSB0aGF0IGNhdXNlZCBpdC5cbiAgdmFyIGdyYW1tYXJFcnJvcnMgPSBbXTtcbiAgdmFyIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gZmFsc2U7XG4gIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZXMpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgdHJ5IHtcbiAgICAgIGJvZHkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIGJvZHkuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICBpZiAoIWdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zKSB7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBjYW4gb25seSBiZSBkb25lIGlmIHRoZSBncmFtbWFyIGhhcyBubyBpbnZhbGlkIGFwcGxpY2F0aW9ucy5cbiAgICBPYmplY3Qua2V5cyhncmFtbWFyLnJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gICAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICB0cnkge1xuICAgICAgICBib2R5LmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAoZ3JhbW1hckVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgZXJyb3JzLnRocm93RXJyb3JzKGdyYW1tYXJFcnJvcnMpO1xuICB9XG4gIGlmICh0aGlzLnNvdXJjZSkge1xuICAgIGdyYW1tYXIuc291cmNlID0gdGhpcy5zb3VyY2U7XG4gIH1cblxuICByZXR1cm4gZ3JhbW1hcjtcbn07XG5cbi8vIFJ1bGUgZGVjbGFyYXRpb25zXG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKSB7XG4gIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCk7XG4gIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlc1tuYW1lXSkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lLCBzb3VyY2UpO1xuICB9IGVsc2UgaWYgKHRoaXMucnVsZXNbbmFtZV0pIHtcbiAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5uYW1lLCBzb3VyY2UpO1xuICB9XG4gIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgc291cmNlKTtcbiAgfVxuICByZXR1cm4gdGhpcy5pbnN0YWxsKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLm92ZXJyaWRlID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSwgZGVzY0lnbm9yZWQsIHNvdXJjZSkge1xuICB2YXIgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICBpZiAoIXJ1bGVJbmZvKSB7XG4gICAgdGhyb3cgZXJyb3JzLmNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgc291cmNlKTtcbiAgfVxuICB0aGlzLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUobmFtZSwgZm9ybWFscywgYm9keSwgc291cmNlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgZnJhZ21lbnQsIGRlc2NJZ25vcmVkLCBzb3VyY2UpIHtcbiAgdmFyIHJ1bGVJbmZvID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlc1tuYW1lXTtcbiAgaWYgKCFydWxlSW5mbykge1xuICAgIHRocm93IGVycm9ycy5jYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZShuYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lLCBzb3VyY2UpO1xuICB9XG4gIHZhciBib2R5ID0gbmV3IHBleHBycy5FeHRlbmQodGhpcy5zdXBlckdyYW1tYXIsIG5hbWUsIGZyYWdtZW50KTtcbiAgYm9keS5zb3VyY2UgPSBmcmFnbWVudC5zb3VyY2U7XG4gIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXJEZWNsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gSW5wdXRTdHJlYW0oc291cmNlKSB7XG4gIHRoaXMuc291cmNlID0gc291cmNlO1xuICB0aGlzLnBvcyA9IDA7XG4gIHRoaXMuZXhhbWluZWRMZW5ndGggPSAwO1xufVxuXG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gIGF0RW5kOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYW5zID0gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgICB0aGlzLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5leGFtaW5lZExlbmd0aCwgdGhpcy5wb3MgKyAxKTtcbiAgICByZXR1cm4gYW5zO1xuICB9LFxuXG4gIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbnMgPSB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXTtcbiAgICB0aGlzLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5leGFtaW5lZExlbmd0aCwgdGhpcy5wb3MpO1xuICAgIHJldHVybiBhbnM7XG4gIH0sXG5cbiAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uKHMsIG9wdElnbm9yZUNhc2UpIHtcbiAgICB2YXIgaWR4O1xuICAgIGlmIChvcHRJZ25vcmVDYXNlKSB7XG4gICAgICAvKlxuICAgICAgICBDYXNlLWluc2Vuc2l0aXZlIGNvbXBhcmlzb24gaXMgYSB0cmlja3kgYnVzaW5lc3MuIFNvbWUgbm90YWJsZSBnb3RjaGFzIGluY2x1ZGUgdGhlXG4gICAgICAgIFwiVHVya2lzaCBJXCIgcHJvYmxlbSAoaHR0cDovL3d3dy5pMThuZ3V5LmNvbS91bmljb2RlL3R1cmtpc2gtaTE4bi5odG1sKSBhbmQgdGhlIGZhY3RcbiAgICAgICAgdGhhdCB0aGUgR2VybWFuIEVzc3pldCAow58pIHR1cm5zIGludG8gXCJTU1wiIGluIHVwcGVyIGNhc2UuXG5cbiAgICAgICAgVGhpcyBpcyBpbnRlbmRlZCB0byBiZSBhIGxvY2FsZS1pbnZhcmlhbnQgY29tcGFyaXNvbiwgd2hpY2ggbWVhbnMgaXQgbWF5IG5vdCBvYmV5XG4gICAgICAgIGxvY2FsZS1zcGVjaWZpYyBleHBlY3RhdGlvbnMgKGUuZy4gXCJpXCIgPT4gXCLEsFwiKS5cbiAgICAgICAqL1xuICAgICAgZm9yIChpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIGFjdHVhbCA9IHRoaXMubmV4dCgpO1xuICAgICAgICB2YXIgZXhwZWN0ZWQgPSBzW2lkeF07XG4gICAgICAgIGlmIChhY3R1YWwgPT0gbnVsbCB8fCBhY3R1YWwudG9VcHBlckNhc2UoKSAhPT0gZXhwZWN0ZWQudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vIERlZmF1bHQgaXMgY2FzZS1zZW5zaXRpdmUgY29tcGFyaXNvbi5cbiAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgaWYgKHRoaXMubmV4dCgpICE9PSBzW2lkeF0pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIHNvdXJjZVNsaWNlOiBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0SWR4LCBlbmRJZHgpO1xuICB9LFxuXG4gIGludGVydmFsOiBmdW5jdGlvbihzdGFydElkeCwgb3B0RW5kSWR4KSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZSwgc3RhcnRJZHgsIG9wdEVuZElkeCA/IG9wdEVuZElkeCA6IHRoaXMucG9zKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRTdHJlYW07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9jb21tb24nKS5hc3NlcnQ7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnRlcnZhbChzb3VyY2VTdHJpbmcsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgdGhpcy5zb3VyY2VTdHJpbmcgPSBzb3VyY2VTdHJpbmc7XG4gIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeDtcbiAgdGhpcy5lbmRJZHggPSBlbmRJZHg7XG59XG5cbkludGVydmFsLmNvdmVyYWdlID0gZnVuY3Rpb24oLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICB2YXIgc291cmNlU3RyaW5nID0gYXJndW1lbnRzWzBdLnNvdXJjZVN0cmluZztcbiAgdmFyIHN0YXJ0SWR4ID0gYXJndW1lbnRzWzBdLnN0YXJ0SWR4O1xuICB2YXIgZW5kSWR4ID0gYXJndW1lbnRzWzBdLmVuZElkeDtcbiAgZm9yICh2YXIgaWR4ID0gMTsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgaW50ZXJ2YWwgPSBhcmd1bWVudHNbaWR4XTtcbiAgICBpZiAoaW50ZXJ2YWwuc291cmNlU3RyaW5nICE9PSBzb3VyY2VTdHJpbmcpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhcnRJZHggPSBNYXRoLm1pbihzdGFydElkeCwgYXJndW1lbnRzW2lkeF0uc3RhcnRJZHgpO1xuICAgICAgZW5kSWR4ID0gTWF0aC5tYXgoZW5kSWR4LCBhcmd1bWVudHNbaWR4XS5lbmRJZHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEludGVydmFsKHNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCk7XG59O1xuXG5JbnRlcnZhbC5wcm90b3R5cGUgPSB7XG4gIGNvdmVyYWdlV2l0aDogZnVuY3Rpb24oLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICAgIHZhciBpbnRlcnZhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgIGludGVydmFscy5wdXNoKHRoaXMpO1xuICAgIHJldHVybiBJbnRlcnZhbC5jb3ZlcmFnZS5hcHBseSh1bmRlZmluZWQsIGludGVydmFscyk7XG4gIH0sXG5cbiAgY29sbGFwc2VkTGVmdDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCwgdGhpcy5zdGFydElkeCk7XG4gIH0sXG5cbiAgY29sbGFwc2VkUmlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuZW5kSWR4LCB0aGlzLmVuZElkeCk7XG4gIH0sXG5cbiAgZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2U6IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYW5nZSA9IFt0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeF07XG4gICAgcmV0dXJuIHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHJhbmdlKTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIDAsIDEsIG9yIDIgaW50ZXJ2YWxzIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIHRoZVxuICAvLyBpbnRlcnZhbCBkaWZmZXJlbmNlIG9wZXJhdGlvbi5cbiAgbWludXM6IGZ1bmN0aW9uKHRoYXQpIHtcbiAgICBpZiAodGhpcy5zb3VyY2VTdHJpbmcgIT09IHRoYXQuc291cmNlU3RyaW5nKSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4ID09PSB0aGF0LnN0YXJ0SWR4ICYmIHRoaXMuZW5kSWR4ID09PSB0aGF0LmVuZElkeCkge1xuICAgICAgLy8gYHRoaXNgIGFuZCBgdGhhdGAgYXJlIHRoZSBzYW1lIGludGVydmFsIVxuICAgICAgcmV0dXJuIFtcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5zdGFydElkeCAmJiB0aGF0LmVuZElkeCA8IHRoaXMuZW5kSWR4KSB7XG4gICAgICAvLyBgdGhhdGAgc3BsaXRzIGB0aGlzYCBpbnRvIHR3byBpbnRlcnZhbHNcbiAgICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCwgdGhhdC5zdGFydElkeCksXG4gICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhhdC5lbmRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LmVuZElkeCAmJiB0aGF0LmVuZElkeCA8IHRoaXMuZW5kSWR4KSB7XG4gICAgICAvLyBgdGhhdGAgY29udGFpbnMgYSBwcmVmaXggb2YgYHRoaXNgXG4gICAgICByZXR1cm4gW1xuICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoYXQuZW5kSWR4LCB0aGlzLmVuZElkeClcbiAgICAgIF07XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5zdGFydElkeCAmJiB0aGF0LnN0YXJ0SWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgIC8vIGB0aGF0YCBjb250YWlucyBhIHN1ZmZpeCBvZiBgdGhpc2BcbiAgICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCwgdGhhdC5zdGFydElkeClcbiAgICAgIF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGB0aGF0YCBhbmQgYHRoaXNgIGRvIG5vdCBvdmVybGFwXG4gICAgICByZXR1cm4gW1xuICAgICAgICB0aGlzXG4gICAgICBdO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IEludGVydmFsIHRoYXQgaGFzIHRoZSBzYW1lIGV4dGVudCBhcyB0aGlzIG9uZSwgYnV0IHdoaWNoIGlzIHJlbGF0aXZlXG4gIC8vIHRvIGB0aGF0YCwgYW4gSW50ZXJ2YWwgdGhhdCBmdWxseSBjb3ZlcnMgdGhpcyBvbmUuXG4gIHJlbGF0aXZlVG86IGZ1bmN0aW9uKHRoYXQpIHtcbiAgICBpZiAodGhpcy5zb3VyY2VTdHJpbmcgIT09IHRoYXQuc291cmNlU3RyaW5nKSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgfVxuICAgIGFzc2VydCh0aGlzLnN0YXJ0SWR4ID49IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPD0gdGhhdC5lbmRJZHgsXG4gICAgICAgICAgICdvdGhlciBpbnRlcnZhbCBkb2VzIG5vdCBjb3ZlciB0aGlzIG9uZScpO1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0SWR4IC0gdGhhdC5zdGFydElkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kSWR4IC0gdGhhdC5zdGFydElkeCk7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB3aGljaCBjb250YWlucyB0aGUgc2FtZSBjb250ZW50cyBhcyB0aGlzIG9uZSxcbiAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgLy8gdGhlIGlucHV0IHN0cmVhbSBpcyBhIHN0cmluZy4pXG4gIHRyaW1tZWQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgdmFyIHN0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIGNvbnRlbnRzLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICB2YXIgZW5kSWR4ID0gdGhpcy5lbmRJZHggLSBjb250ZW50cy5tYXRjaCgvXFxzKiQvKVswXS5sZW5ndGg7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCk7XG4gIH0sXG5cbiAgc3ViSW50ZXJ2YWw6IGZ1bmN0aW9uKG9mZnNldCwgbGVuKSB7XG4gICAgdmFyIG5ld1N0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIG9mZnNldDtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCBuZXdTdGFydElkeCwgbmV3U3RhcnRJZHggKyBsZW4pO1xuICB9XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhJbnRlcnZhbC5wcm90b3R5cGUsIHtcbiAgY29udGVudHM6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuX2NvbnRlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fY29udGVudHMgPSB0aGlzLnNvdXJjZVN0cmluZy5zbGljZSh0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudHM7XG4gICAgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH0sXG4gIGxlbmd0aDoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLmVuZElkeCAtIHRoaXMuc3RhcnRJZHg7IH0sXG4gICAgZW51bWVyYWJsZTogdHJ1ZVxuICB9XG59KTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWw7XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE1hdGNoUmVzdWx0KFxuICAgIG1hdGNoZXIsXG4gICAgaW5wdXQsXG4gICAgc3RhcnRFeHByLFxuICAgIGNzdCxcbiAgICBjc3RPZmZzZXQsXG4gICAgcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLFxuICAgIG9wdFJlY29yZGVkRmFpbHVyZXMpIHtcblxuICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gIHRoaXMuc3RhcnRFeHByID0gc3RhcnRFeHByO1xuICB0aGlzLl9jc3QgPSBjc3Q7XG4gIHRoaXMuX2NzdE9mZnNldCA9IGNzdE9mZnNldDtcbiAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xuICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcyA9IG9wdFJlY29yZGVkRmFpbHVyZXM7XG5cbiAgaWYgKHRoaXMuZmFpbGVkKCkpIHtcbiAgICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGV0YWlsID0gJ0V4cGVjdGVkICcgKyB0aGlzLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgcmV0dXJuIHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UodGhpcy5pbnB1dCwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSkgKyBkZXRhaWw7XG4gICAgfSk7XG4gICAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnc2hvcnRNZXNzYWdlJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZGV0YWlsID0gJ2V4cGVjdGVkICcgKyB0aGlzLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgdmFyIGVycm9ySW5mbyA9IHV0aWwuZ2V0TGluZUFuZENvbHVtbih0aGlzLmlucHV0LCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKTtcbiAgICAgIHJldHVybiAnTGluZSAnICsgZXJyb3JJbmZvLmxpbmVOdW0gKyAnLCBjb2wgJyArIGVycm9ySW5mby5jb2xOdW0gKyAnOiAnICsgZGV0YWlsO1xuICAgIH0pO1xuICB9XG59XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5zdWNjZWVkZWQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICEhdGhpcy5fY3N0O1xufTtcblxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmZhaWxlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMuc3VjY2VlZGVkKCk7XG59O1xuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb247XG59O1xuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0UmlnaHRtb3N0RmFpbHVyZXMgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLl9yaWdodG1vc3RGYWlsdXJlcykge1xuICAgIHRoaXMubWF0Y2hlci5zZXRJbnB1dCh0aGlzLmlucHV0KTtcbiAgICB2YXIgbWF0Y2hSZXN1bHRXaXRoRmFpbHVyZXMgPVxuICAgICAgICB0aGlzLm1hdGNoZXIuX21hdGNoKHRoaXMuc3RhcnRFeHByLCBmYWxzZSwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSk7XG4gICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZXMgPSBtYXRjaFJlc3VsdFdpdGhGYWlsdXJlcy5nZXRSaWdodG1vc3RGYWlsdXJlcygpO1xuICB9XG4gIHJldHVybiB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcztcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdWNjZWVkZWQoKSA/XG4gICAgICAnW21hdGNoIHN1Y2NlZWRlZF0nIDpcbiAgICAgICdbbWF0Y2ggZmFpbGVkIGF0IHBvc2l0aW9uICcgKyB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpICsgJ10nO1xufTtcblxuLy8gUmV0dXJuIGEgc3RyaW5nIHN1bW1hcml6aW5nIHRoZSBleHBlY3RlZCBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIHdoZW5cbi8vIHRoZSBtYXRjaCBmYWlsdXJlIG9jY3VycmVkLlxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEV4cGVjdGVkVGV4dCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5zdWNjZWVkZWQoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBleHBlY3RlZCB0ZXh0IG9mIGEgc3VjY2Vzc2Z1bCBNYXRjaFJlc3VsdCcpO1xuICB9XG5cbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgdmFyIGZhaWx1cmVzID0gdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlcygpO1xuXG4gIC8vIEZpbHRlciBvdXQgdGhlIGZsdWZmeSBmYWlsdXJlcyB0byBtYWtlIHRoZSBkZWZhdWx0IGVycm9yIG1lc3NhZ2VzIG1vcmUgdXNlZnVsXG4gIGZhaWx1cmVzID0gZmFpbHVyZXMuZmlsdGVyKGZ1bmN0aW9uKGZhaWx1cmUpIHtcbiAgICByZXR1cm4gIWZhaWx1cmUuaXNGbHVmZnkoKTtcbiAgfSk7XG5cbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZmFpbHVyZXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChpZHggPiAwKSB7XG4gICAgICBpZiAoaWR4ID09PSBmYWlsdXJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgIHNiLmFwcGVuZChmYWlsdXJlcy5sZW5ndGggPiAyID8gJywgb3IgJyA6ICcgb3IgJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHNiLmFwcGVuZChmYWlsdXJlc1tpZHhdLnRvU3RyaW5nKCkpO1xuICB9XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEludGVydmFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwb3MgPSB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpO1xuICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuaW5wdXQsIHBvcywgcG9zKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoUmVzdWx0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIFBvc0luZm8gPSByZXF1aXJlKCcuL1Bvc0luZm8nKTtcbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGFwcGx5U3BhY2VzID0gbmV3IHBleHBycy5BcHBseSgnc3BhY2VzJyk7XG5cbmZ1bmN0aW9uIE1hdGNoU3RhdGUobWF0Y2hlciwgc3RhcnRFeHByLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgdGhpcy5tYXRjaGVyID0gbWF0Y2hlcjtcbiAgdGhpcy5zdGFydEV4cHIgPSBzdGFydEV4cHI7XG5cbiAgdGhpcy5ncmFtbWFyID0gbWF0Y2hlci5ncmFtbWFyO1xuICB0aGlzLmlucHV0ID0gbWF0Y2hlci5pbnB1dDtcbiAgdGhpcy5pbnB1dFN0cmVhbSA9IG5ldyBJbnB1dFN0cmVhbShtYXRjaGVyLmlucHV0KTtcbiAgdGhpcy5tZW1vVGFibGUgPSBtYXRjaGVyLm1lbW9UYWJsZTtcblxuICB0aGlzLl9iaW5kaW5ncyA9IFtdO1xuICB0aGlzLl9iaW5kaW5nT2Zmc2V0cyA9IFtdO1xuICB0aGlzLl9hcHBsaWNhdGlvblN0YWNrID0gW107XG4gIHRoaXMuX3Bvc1N0YWNrID0gWzBdO1xuICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sgPSBbZmFsc2VdO1xuXG4gIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrID0gW107XG4gIHRoaXMuX3JlY29yZGVkRmFpbHVyZXNTdGFjayA9IFtdO1xuXG4gIGlmIChvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzID0gb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzO1xuICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cbn1cblxuTWF0Y2hTdGF0ZS5wcm90b3R5cGUgPSB7XG4gIHBvc1RvT2Zmc2V0OiBmdW5jdGlvbihwb3MpIHtcbiAgICByZXR1cm4gcG9zIC0gdGhpcy5fcG9zU3RhY2tbdGhpcy5fcG9zU3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgZW50ZXJBcHBsaWNhdGlvbjogZnVuY3Rpb24ocG9zSW5mbywgYXBwKSB7XG4gICAgdGhpcy5fcG9zU3RhY2sucHVzaCh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gICAgdGhpcy5fYXBwbGljYXRpb25TdGFjay5wdXNoKGFwcCk7XG4gICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnB1c2goZmFsc2UpO1xuICAgIHBvc0luZm8uZW50ZXIoYXBwKTtcbiAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wdXNoKHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IC0xO1xuICB9LFxuXG4gIGV4aXRBcHBsaWNhdGlvbjogZnVuY3Rpb24ocG9zSW5mbywgb3B0Tm9kZSkge1xuICAgIHZhciBvcmlnUG9zID0gdGhpcy5fcG9zU3RhY2sucG9wKCk7XG4gICAgdGhpcy5fYXBwbGljYXRpb25TdGFjay5wb3AoKTtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucG9wKCk7XG4gICAgcG9zSW5mby5leGl0KCk7XG5cbiAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IE1hdGgubWF4KFxuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbixcbiAgICAgICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucG9wKCkpO1xuXG4gICAgaWYgKG9wdE5vZGUpIHtcbiAgICAgIHRoaXMucHVzaEJpbmRpbmcob3B0Tm9kZSwgb3JpZ1Bvcyk7XG4gICAgfVxuICB9LFxuXG4gIGVudGVyTGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaCh0cnVlKTtcbiAgfSxcblxuICBleGl0TGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgY3VycmVudEFwcGxpY2F0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fYXBwbGljYXRpb25TdGFja1t0aGlzLl9hcHBsaWNhdGlvblN0YWNrLmxlbmd0aCAtIDFdO1xuICB9LFxuXG4gIGluU3ludGFjdGljQ29udGV4dDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGN1cnJlbnRBcHBsaWNhdGlvbiA9IHRoaXMuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgaWYgKGN1cnJlbnRBcHBsaWNhdGlvbikge1xuICAgICAgcmV0dXJuIGN1cnJlbnRBcHBsaWNhdGlvbi5pc1N5bnRhY3RpYygpICYmICF0aGlzLmluTGV4aWZpZWRDb250ZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSB0b3AtbGV2ZWwgY29udGV4dCBpcyBzeW50YWN0aWMgaWYgdGhlIHN0YXJ0IGFwcGxpY2F0aW9uIGlzLlxuICAgICAgcmV0dXJuIHRoaXMuc3RhcnRFeHByLmZhY3RvcnNbMF0uaXNTeW50YWN0aWMoKTtcbiAgICB9XG4gIH0sXG5cbiAgaW5MZXhpZmllZENvbnRleHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2tbdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLmxlbmd0aCAtIDFdO1xuICB9LFxuXG4gIHNraXBTcGFjZXM6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHVzaEZhaWx1cmVzSW5mbygpO1xuICAgIHRoaXMuZXZhbChhcHBseVNwYWNlcyk7XG4gICAgdGhpcy5wb3BCaW5kaW5nKCk7XG4gICAgdGhpcy5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gIH0sXG5cbiAgc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pblN5bnRhY3RpY0NvbnRleHQoKSA/XG4gICAgICAgIHRoaXMuc2tpcFNwYWNlcygpIDpcbiAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gIH0sXG5cbiAgbWF5YmVTa2lwU3BhY2VzQmVmb3JlOiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkgJiYgZXhwci5pc1N5bnRhY3RpYygpKSB7XG4gICAgICByZXR1cm4gdGhpcy5za2lwU3BhY2VzKCk7XG4gICAgfSBlbHNlIGlmIChleHByLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UoKSAmJiBleHByICE9PSBhcHBseVNwYWNlcykge1xuICAgICAgcmV0dXJuIHRoaXMuc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgICB9XG4gIH0sXG5cbiAgcHVzaEJpbmRpbmc6IGZ1bmN0aW9uKG5vZGUsIG9yaWdQb3MpIHtcbiAgICB0aGlzLl9iaW5kaW5ncy5wdXNoKG5vZGUpO1xuICAgIHRoaXMuX2JpbmRpbmdPZmZzZXRzLnB1c2godGhpcy5wb3NUb09mZnNldChvcmlnUG9zKSk7XG4gIH0sXG5cbiAgcG9wQmluZGluZzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fYmluZGluZ3MucG9wKCk7XG4gICAgdGhpcy5fYmluZGluZ09mZnNldHMucG9wKCk7XG4gIH0sXG5cbiAgbnVtQmluZGluZ3M6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gIH0sXG5cbiAgdHJ1bmNhdGVCaW5kaW5nczogZnVuY3Rpb24obmV3TGVuZ3RoKSB7XG4gICAgLy8gWWVzLCB0aGlzIGlzIHRoaXMgcmVhbGx5IGZhc3RlciB0aGFuIHNldHRpbmcgdGhlIGBsZW5ndGhgIHByb3BlcnR5ICh0ZXN0ZWQgd2l0aFxuICAgIC8vIGJpbi9lczViZW5jaCBvbiBOb2RlIHY2LjEuMCkuXG4gICAgd2hpbGUgKHRoaXMuX2JpbmRpbmdzLmxlbmd0aCA+IG5ld0xlbmd0aCkge1xuICAgICAgdGhpcy5wb3BCaW5kaW5nKCk7XG4gICAgfVxuICB9LFxuXG4gIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRQb3NJbmZvKHRoaXMuaW5wdXRTdHJlYW0ucG9zKTtcbiAgfSxcblxuICBnZXRQb3NJbmZvOiBmdW5jdGlvbihwb3MpIHtcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgaWYgKCFwb3NJbmZvKSB7XG4gICAgICBwb3NJbmZvID0gdGhpcy5tZW1vVGFibGVbcG9zXSA9IG5ldyBQb3NJbmZvKCk7XG4gICAgfVxuICAgIHJldHVybiBwb3NJbmZvO1xuICB9LFxuXG4gIHByb2Nlc3NGYWlsdXJlOiBmdW5jdGlvbihwb3MsIGV4cHIpIHtcbiAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IE1hdGgubWF4KHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLCBwb3MpO1xuXG4gICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJiBwb3MgPT09IHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gICAgICB2YXIgYXBwID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICAgIGlmIChhcHApIHtcbiAgICAgICAgLy8gU3Vic3RpdHV0ZSBwYXJhbWV0ZXJzIHdpdGggdGhlIGFjdHVhbCBwZXhwcnMgdGhhdCB3ZXJlIHBhc3NlZCB0b1xuICAgICAgICAvLyB0aGUgY3VycmVudCBydWxlLlxuICAgICAgICBleHByID0gZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFwcC5hcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRoaXMgYnJhbmNoIGlzIG9ubHkgcmVhY2hlZCBmb3IgdGhlIFwiZW5kLWNoZWNrXCIgdGhhdCBpc1xuICAgICAgICAvLyBwZXJmb3JtZWQgYWZ0ZXIgdGhlIHRvcC1sZXZlbCBhcHBsaWNhdGlvbi4gSW4gdGhhdCBjYXNlLFxuICAgICAgICAvLyBleHByID09PSBwZXhwcnMuZW5kIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gc3Vic3RpdHV0ZVxuICAgICAgICAvLyBwYXJhbWV0ZXJzLlxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlY29yZEZhaWx1cmUoZXhwci50b0ZhaWx1cmUodGhpcy5ncmFtbWFyKSwgZmFsc2UpO1xuICAgIH1cbiAgfSxcblxuICByZWNvcmRGYWlsdXJlOiBmdW5jdGlvbihmYWlsdXJlLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgdmFyIGtleSA9IGZhaWx1cmUudG9LZXkoKTtcbiAgICBpZiAoIXRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldKSB7XG4gICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XSA9IHNob3VsZENsb25lSWZOZXcgPyBmYWlsdXJlLmNsb25lKCkgOiBmYWlsdXJlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0uaXNGbHVmZnkoKSAmJiAhZmFpbHVyZS5pc0ZsdWZmeSgpKSB7XG4gICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XS5jbGVhckZsdWZmeSgpO1xuICAgIH1cbiAgfSxcblxuICByZWNvcmRGYWlsdXJlczogZnVuY3Rpb24oZmFpbHVyZXMsIHNob3VsZENsb25lSWZOZXcpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMoZmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBzZWxmLnJlY29yZEZhaWx1cmUoZmFpbHVyZXNba2V5XSwgc2hvdWxkQ2xvbmVJZk5ldyk7XG4gICAgfSk7XG4gIH0sXG5cbiAgY2xvbmVSZWNvcmRlZEZhaWx1cmVzOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB2YXIgYW5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXModGhpcy5yZWNvcmRlZEZhaWx1cmVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgYW5zW2tleV0gPSBzZWxmLnJlY29yZGVkRmFpbHVyZXNba2V5XS5jbG9uZSgpO1xuICAgIH0pO1xuICAgIHJldHVybiBhbnM7XG4gIH0sXG5cbiAgZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb247XG4gIH0sXG5cbiAgX2dldFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA+PSAwID9cbiAgICAgICAgdGhpcy5wb3NUb09mZnNldCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbikgOlxuICAgICAgICAtMTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIHRoZSBtZW1vaXplZCB0cmFjZSBlbnRyeSBmb3IgYGV4cHJgIGF0IGBwb3NgLCBpZiBvbmUgZXhpc3RzLCBgbnVsbGAgb3RoZXJ3aXNlLlxuICBnZXRNZW1vaXplZFRyYWNlRW50cnk6IGZ1bmN0aW9uKHBvcywgZXhwcikge1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5tZW1vVGFibGVbcG9zXTtcbiAgICBpZiAocG9zSW5mbyAmJiBleHByLnJ1bGVOYW1lKSB7XG4gICAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1tleHByLnRvTWVtb0tleSgpXTtcbiAgICAgIGlmIChtZW1vUmVjICYmIG1lbW9SZWMudHJhY2VFbnRyeSkge1xuICAgICAgICB2YXIgZW50cnkgPSBtZW1vUmVjLnRyYWNlRW50cnkuY2xvbmVXaXRoRXhwcihleHByKTtcbiAgICAgICAgZW50cnkuaXNNZW1vaXplZCA9IHRydWU7XG4gICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgLy8gUmV0dXJucyBhIG5ldyB0cmFjZSBlbnRyeSwgd2l0aCB0aGUgY3VycmVudGx5IGFjdGl2ZSB0cmFjZSBhcnJheSBhcyBpdHMgY2hpbGRyZW4uXG4gIGdldFRyYWNlRW50cnk6IGZ1bmN0aW9uKHBvcywgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncykge1xuICAgIGlmIChleHByIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5KSB7XG4gICAgICB2YXIgYXBwID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICAgIHZhciBhY3R1YWxzID0gYXBwID8gYXBwLmFyZ3MgOiBbXTtcbiAgICAgIGV4cHIgPSBleHByLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldE1lbW9pemVkVHJhY2VFbnRyeShwb3MsIGV4cHIpIHx8XG4gICAgICAgICAgIG5ldyBUcmFjZSh0aGlzLmlucHV0LCBwb3MsIHRoaXMuaW5wdXRTdHJlYW0ucG9zLCBleHByLCBzdWNjZWVkZWQsIGJpbmRpbmdzLCB0aGlzLnRyYWNlKTtcbiAgfSxcblxuICBpc1RyYWNpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhIXRoaXMudHJhY2U7XG4gIH0sXG5cbiAgaGFzTmVjZXNzYXJ5SW5mbzogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIGlmICh0aGlzLnRyYWNlICYmICFtZW1vUmVjLnRyYWNlRW50cnkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmXG4gICAgICAgIHRoaXMuaW5wdXRTdHJlYW0ucG9zICsgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID09PSB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgICAgcmV0dXJuICEhbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cblxuICB1c2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24ob3JpZ1BvcywgbWVtb1JlYykge1xuICAgIGlmICh0aGlzLnRyYWNlKSB7XG4gICAgICB0aGlzLnRyYWNlLnB1c2gobWVtb1JlYy50cmFjZUVudHJ5KTtcbiAgICB9XG5cbiAgICB2YXIgbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHRoaXMuaW5wdXRTdHJlYW0ucG9zICsgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0O1xuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID1cbiAgICAgICAgTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pO1xuICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMgJiZcbiAgICAgICAgdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgPT09IG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gJiZcbiAgICAgICAgbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24pIHtcbiAgICAgIHRoaXMucmVjb3JkRmFpbHVyZXMobWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24sIHRydWUpO1xuICAgIH1cblxuICAgIHRoaXMuaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPVxuICAgICAgICBNYXRoLm1heCh0aGlzLmlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoICsgb3JpZ1Bvcyk7XG5cbiAgICBpZiAobWVtb1JlYy52YWx1ZSkge1xuICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgKz0gbWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgICAgIHRoaXMucHVzaEJpbmRpbmcobWVtb1JlYy52YWx1ZSwgb3JpZ1Bvcyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIC8vIEV2YWx1YXRlIGBleHByYCBhbmQgcmV0dXJuIGB0cnVlYCBpZiBpdCBzdWNjZWVkZWQsIGBmYWxzZWAgb3RoZXJ3aXNlLiBPbiBzdWNjZXNzLCBgYmluZGluZ3NgXG4gIC8vIHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGVsZW1lbnRzIHRoYW4gYmVmb3JlLCBhbmQgdGhlIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heVxuICAvLyBoYXZlIGluY3JlYXNlZC4gT24gZmFpbHVyZSwgYGJpbmRpbmdzYCBhbmQgcG9zaXRpb24gd2lsbCBiZSB1bmNoYW5nZWQuXG4gIGV2YWw6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSB0aGlzLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnTnVtQmluZGluZ3MgPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG5cbiAgICB2YXIgb3JpZ1JlY29yZGVkRmFpbHVyZXM7XG4gICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgb3JpZ1JlY29yZGVkRmFpbHVyZXMgPSB0aGlzLnJlY29yZGVkRmFpbHVyZXM7XG4gICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cblxuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIHZhciBtZW1vUG9zID0gdGhpcy5tYXliZVNraXBTcGFjZXNCZWZvcmUoZXhwcik7XG5cbiAgICB2YXIgb3JpZ1RyYWNlO1xuICAgIGlmICh0aGlzLnRyYWNlKSB7XG4gICAgICBvcmlnVHJhY2UgPSB0aGlzLnRyYWNlO1xuICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgIH1cblxuICAgIC8vIERvIHRoZSBhY3R1YWwgZXZhbHVhdGlvbi5cbiAgICB2YXIgYW5zID0gZXhwci5ldmFsKHRoaXMpO1xuXG4gICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgIHZhciBiaW5kaW5ncyA9IHRoaXMuX2JpbmRpbmdzLnNsaWNlKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgICB2YXIgdHJhY2VFbnRyeSA9IHRoaXMuZ2V0VHJhY2VFbnRyeShtZW1vUG9zLCBleHByLCBhbnMsIGJpbmRpbmdzKTtcbiAgICAgIHRyYWNlRW50cnkuaXNJbXBsaWNpdFNwYWNlcyA9IGV4cHIgPT09IGFwcGx5U3BhY2VzO1xuICAgICAgdHJhY2VFbnRyeS5pc1Jvb3ROb2RlID0gZXhwciA9PT0gdGhpcy5zdGFydEV4cHI7XG4gICAgICBvcmlnVHJhY2UucHVzaCh0cmFjZUVudHJ5KTtcbiAgICAgIHRoaXMudHJhY2UgPSBvcmlnVHJhY2U7XG4gICAgfVxuXG4gICAgaWYgKGFucykge1xuICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJiBpbnB1dFN0cmVhbS5wb3MgPT09IHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5yZWNvcmRlZEZhaWx1cmVzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgIHNlbGYucmVjb3JkZWRGYWlsdXJlc1trZXldLm1ha2VGbHVmZnkoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlc2V0IHRoZSBwb3NpdGlvbiBhbmQgdGhlIGJpbmRpbmdzLlxuICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgIHRoaXMudHJ1bmNhdGVCaW5kaW5ncyhvcmlnTnVtQmluZGluZ3MpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICAgIHRoaXMucmVjb3JkRmFpbHVyZXMob3JpZ1JlY29yZGVkRmFpbHVyZXMsIGZhbHNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYW5zO1xuICB9LFxuXG4gIGdldE1hdGNoUmVzdWx0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmV2YWwodGhpcy5zdGFydEV4cHIpO1xuICAgIHZhciByaWdodG1vc3RGYWlsdXJlcztcbiAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICByaWdodG1vc3RGYWlsdXJlcyA9IE9iamVjdC5rZXlzKHRoaXMucmVjb3JkZWRGYWlsdXJlcykubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICByZXR1cm4gc2VsZi5yZWNvcmRlZEZhaWx1cmVzW2tleV07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdChcbiAgICAgICAgdGhpcy5tYXRjaGVyLFxuICAgICAgICB0aGlzLmlucHV0LFxuICAgICAgICB0aGlzLnN0YXJ0RXhwcixcbiAgICAgICAgdGhpcy5fYmluZGluZ3NbMF0sXG4gICAgICAgIHRoaXMuX2JpbmRpbmdPZmZzZXRzWzBdLFxuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbixcbiAgICAgICAgcmlnaHRtb3N0RmFpbHVyZXMpO1xuICB9LFxuXG4gIGdldFRyYWNlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRyYWNlID0gW107XG4gICAgdmFyIG1hdGNoUmVzdWx0ID0gdGhpcy5nZXRNYXRjaFJlc3VsdCgpO1xuXG4gICAgLy8gVGhlIHRyYWNlIG5vZGUgZm9yIHRoZSBzdGFydCBydWxlIGlzIGFsd2F5cyB0aGUgbGFzdCBlbnRyeS4gSWYgaXQgaXMgYSBzeW50YWN0aWMgcnVsZSxcbiAgICAvLyB0aGUgZmlyc3QgZW50cnkgaXMgZm9yIGFuIGFwcGxpY2F0aW9uIG9mICdzcGFjZXMnLlxuICAgIC8vIFRPRE8ocGR1YnJveSk6IENsZWFuIHRoaXMgdXAgYnkgaW50cm9kdWNpbmcgYSBzcGVjaWFsIGBNYXRjaDxzdGFydEFwcGw+YCBydWxlLCB3aGljaCB3aWxsXG4gICAgLy8gZW5zdXJlIHRoYXQgdGhlcmUgaXMgYWx3YXlzIGEgc2luZ2xlIHJvb3QgdHJhY2Ugbm9kZS5cbiAgICB2YXIgcm9vdFRyYWNlID0gdGhpcy50cmFjZVt0aGlzLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgIHJvb3RUcmFjZS5yZXN1bHQgPSBtYXRjaFJlc3VsdDtcbiAgICByZXR1cm4gcm9vdFRyYWNlO1xuICB9LFxuXG4gIHB1c2hGYWlsdXJlc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnB1c2godGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pO1xuICAgIHRoaXMuX3JlY29yZGVkRmFpbHVyZXNTdGFjay5wdXNoKHRoaXMucmVjb3JkZWRGYWlsdXJlcyk7XG4gIH0sXG5cbiAgcG9wRmFpbHVyZXNJbmZvOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnBvcCgpO1xuICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlcyA9IHRoaXMuX3JlY29yZGVkRmFpbHVyZXNTdGFjay5wb3AoKTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hTdGF0ZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBNYXRjaFN0YXRlID0gcmVxdWlyZSgnLi9NYXRjaFN0YXRlJyk7XG5cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTWF0Y2hlcihncmFtbWFyKSB7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMubWVtb1RhYmxlID0gW107XG4gIHRoaXMuaW5wdXQgPSAnJztcbn1cblxuTWF0Y2hlci5wcm90b3R5cGUuZ2V0SW5wdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuaW5wdXQ7XG59O1xuXG5NYXRjaGVyLnByb3RvdHlwZS5zZXRJbnB1dCA9IGZ1bmN0aW9uKHN0cikge1xuICBpZiAodGhpcy5pbnB1dCAhPT0gc3RyKSB7XG4gICAgdGhpcy5yZXBsYWNlSW5wdXRSYW5nZSgwLCB0aGlzLmlucHV0Lmxlbmd0aCwgc3RyKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbk1hdGNoZXIucHJvdG90eXBlLnJlcGxhY2VJbnB1dFJhbmdlID0gZnVuY3Rpb24oc3RhcnRJZHgsIGVuZElkeCwgc3RyKSB7XG4gIHZhciBjdXJyZW50SW5wdXQgPSB0aGlzLmlucHV0O1xuICBpZiAoc3RhcnRJZHggPCAwIHx8IHN0YXJ0SWR4ID4gY3VycmVudElucHV0Lmxlbmd0aCB8fFxuICAgICAgZW5kSWR4IDwgMCB8fCBlbmRJZHggPiBjdXJyZW50SW5wdXQubGVuZ3RoIHx8XG4gICAgICBzdGFydElkeCA+IGVuZElkeCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbmRpY2VzOiAnICsgc3RhcnRJZHggKyAnIGFuZCAnICsgZW5kSWR4KTtcbiAgfVxuXG4gIC8vIHVwZGF0ZSBpbnB1dFxuICB0aGlzLmlucHV0ID0gY3VycmVudElucHV0LnNsaWNlKDAsIHN0YXJ0SWR4KSArIHN0ciArIGN1cnJlbnRJbnB1dC5zbGljZShlbmRJZHgpO1xuXG4gIC8vIHVwZGF0ZSBtZW1vIHRhYmxlIChzaW1pbGFyIHRvIHRoZSBhYm92ZSlcbiAgdmFyIHJlc3RPZk1lbW9UYWJsZSA9IHRoaXMubWVtb1RhYmxlLnNsaWNlKGVuZElkeCk7XG4gIHRoaXMubWVtb1RhYmxlLmxlbmd0aCA9IHN0YXJ0SWR4O1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzdHIubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMubWVtb1RhYmxlLnB1c2godW5kZWZpbmVkKTtcbiAgfVxuICByZXN0T2ZNZW1vVGFibGUuZm9yRWFjaChcbiAgICAgIGZ1bmN0aW9uKHBvc0luZm8pIHsgdGhpcy5tZW1vVGFibGUucHVzaChwb3NJbmZvKTsgfSxcbiAgICAgIHRoaXMpO1xuXG4gIC8vIEludmFsaWRhdGUgbWVtb1JlY3NcbiAgZm9yICh2YXIgcG9zID0gMDsgcG9zIDwgc3RhcnRJZHg7IHBvcysrKSB7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgIGlmIChwb3NJbmZvKSB7XG4gICAgICBwb3NJbmZvLmNsZWFyT2Jzb2xldGVFbnRyaWVzKHBvcywgc3RhcnRJZHgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuTWF0Y2hlci5wcm90b3R5cGUubWF0Y2ggPSBmdW5jdGlvbihvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSB7XG4gIHJldHVybiB0aGlzLl9tYXRjaCh0aGlzLl9nZXRTdGFydEV4cHIob3B0U3RhcnRBcHBsaWNhdGlvblN0ciksIGZhbHNlKTtcbn07XG5cbk1hdGNoZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24ob3B0U3RhcnRBcHBsaWNhdGlvblN0cikge1xuICByZXR1cm4gdGhpcy5fbWF0Y2godGhpcy5fZ2V0U3RhcnRFeHByKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpLCB0cnVlKTtcbn07XG5cbk1hdGNoZXIucHJvdG90eXBlLl9tYXRjaCA9IGZ1bmN0aW9uKHN0YXJ0RXhwciwgdHJhY2luZywgb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gIHZhciBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKHRoaXMsIHN0YXJ0RXhwciwgb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKTtcbiAgcmV0dXJuIHRyYWNpbmcgPyBzdGF0ZS5nZXRUcmFjZSgpIDogc3RhdGUuZ2V0TWF0Y2hSZXN1bHQoKTtcbn07XG5cbi8qXG4gIFJldHVybnMgdGhlIHN0YXJ0aW5nIGV4cHJlc3Npb24gZm9yIHRoaXMgTWF0Y2hlcidzIGFzc29jaWF0ZWQgZ3JhbW1hci4gSWYgYG9wdFN0YXJ0QXBwbGljYXRpb25TdHJgXG4gIGlzIHNwZWNpZmllZCwgaXQgaXMgYSBzdHJpbmcgZXhwcmVzc2luZyBhIHJ1bGUgYXBwbGljYXRpb24gaW4gdGhlIGdyYW1tYXIuIElmIG5vdCBzcGVjaWZpZWQsIHRoZVxuICBncmFtbWFyJ3MgZGVmYXVsdCBzdGFydCBydWxlIHdpbGwgYmUgdXNlZC5cbiovXG5NYXRjaGVyLnByb3RvdHlwZS5fZ2V0U3RhcnRFeHByID0gZnVuY3Rpb24ob3B0U3RhcnRBcHBsaWNhdGlvblN0cikge1xuICB2YXIgYXBwbGljYXRpb25TdHIgPSBvcHRTdGFydEFwcGxpY2F0aW9uU3RyIHx8IHRoaXMuZ3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICBpZiAoIWFwcGxpY2F0aW9uU3RyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHN0YXJ0IHJ1bGUgYXJndW1lbnQgLS0gdGhlIGdyYW1tYXIgaGFzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZS4nKTtcbiAgfVxuXG4gIHZhciBzdGFydEFwcCA9IHRoaXMuZ3JhbW1hci5wYXJzZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uU3RyKTtcbiAgcmV0dXJuIG5ldyBwZXhwcnMuU2VxKFtzdGFydEFwcCwgcGV4cHJzLmVuZF0pO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTmFtZXNwYWNlKCkge1xufVxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbk5hbWVzcGFjZS5hc05hbWVzcGFjZSA9IGZ1bmN0aW9uKG9iak9yTmFtZXNwYWNlKSB7XG4gIGlmIChvYmpPck5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkge1xuICAgIHJldHVybiBvYmpPck5hbWVzcGFjZTtcbiAgfVxuICByZXR1cm4gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZShvYmpPck5hbWVzcGFjZSk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlLiBJZiBgb3B0UHJvcHNgIGlzIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzXG4vLyB3aWxsIGJlIGNvcGllZCB0byB0aGUgbmV3IG5hbWVzcGFjZS5cbk5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UgPSBmdW5jdGlvbihvcHRQcm9wcykge1xuICByZXR1cm4gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UucHJvdG90eXBlLCBvcHRQcm9wcyk7XG59O1xuXG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlIHdoaWNoIGV4dGVuZHMgYW5vdGhlciBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXNcbi8vIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmV4dGVuZCA9IGZ1bmN0aW9uKG5hbWVzcGFjZSwgb3B0UHJvcHMpIHtcbiAgaWYgKG5hbWVzcGFjZSAhPT0gTmFtZXNwYWNlLnByb3RvdHlwZSAmJiAhKG5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBOYW1lc3BhY2Ugb2JqZWN0OiAnICsgbmFtZXNwYWNlKTtcbiAgfVxuICB2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG5hbWVzcGFjZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogTmFtZXNwYWNlLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBleHRlbmQobnMsIG9wdFByb3BzKTtcbn07XG5cbi8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGEgcmVndWxhciBtZXRob2Q/XG5OYW1lc3BhY2UudG9TdHJpbmcgPSBmdW5jdGlvbihucykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5zKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVzcGFjZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFBvc0luZm8oKSB7XG4gIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSBbXTsgIC8vIGFjdGl2ZSBhcHBsaWNhdGlvbnMgYXQgdGhpcyBwb3NpdGlvblxuICB0aGlzLm1lbW8gPSB7fTtcbiAgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IDA7XG4gIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IC0xO1xuICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdW5kZWZpbmVkO1xufVxuXG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uKGFwcGxpY2F0aW9uKSB7XG4gICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2suaW5kZXhPZihhcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgPj0gMDtcbiAgfSxcblxuICBlbnRlcjogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLnB1c2goYXBwbGljYXRpb24udG9NZW1vS2V5KCkpO1xuICB9LFxuXG4gIGV4aXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sucG9wKCk7XG4gIH0sXG5cbiAgc3RhcnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbihoZWFkQXBwbGljYXRpb24sIG1lbW9SZWMpIHtcbiAgICBtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbiA9IHRydWU7XG4gICAgbWVtb1JlYy5oZWFkQXBwbGljYXRpb24gPSBoZWFkQXBwbGljYXRpb247XG4gICAgbWVtb1JlYy5uZXh0TGVmdFJlY3Vyc2lvbiA9IHRoaXMuY3VycmVudExlZnRSZWN1cnNpb247XG4gICAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG1lbW9SZWM7XG5cbiAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrO1xuICAgIHZhciBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgKyAxO1xuICAgIHZhciBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5zbGljZShpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUpO1xuXG4gICAgbWVtb1JlYy5pc0ludm9sdmVkID0gZnVuY3Rpb24oYXBwbGljYXRpb25NZW1vS2V5KSB7XG4gICAgICByZXR1cm4gaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzLmluZGV4T2YoYXBwbGljYXRpb25NZW1vS2V5KSA+PSAwO1xuICAgIH07XG5cbiAgICBtZW1vUmVjLnVwZGF0ZUludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgZm9yICh2YXIgaWR4ID0gaW5kZXhPZkZpcnN0SW52b2x2ZWRSdWxlOyBpZHggPCBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXkgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFja1tpZHhdO1xuICAgICAgICBpZiAoIXRoaXMuaXNJbnZvbHZlZChhcHBsaWNhdGlvbk1lbW9LZXkpKSB7XG4gICAgICAgICAgaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzLnB1c2goYXBwbGljYXRpb25NZW1vS2V5KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0sXG5cbiAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24ubmV4dExlZnRSZWN1cnNpb247XG4gIH0sXG5cbiAgLy8gTm90ZTogdGhpcyBtZXRob2QgZG9lc24ndCBnZXQgY2FsbGVkIGZvciB0aGUgXCJoZWFkXCIgb2YgYSBsZWZ0IHJlY3Vyc2lvbiAtLSBmb3IgTFIgaGVhZHMsXG4gIC8vIHRoZSBtZW1vaXplZCByZXN1bHQgKHdoaWNoIHN0YXJ0cyBvdXQgYmVpbmcgYSBmYWlsdXJlKSBpcyBhbHdheXMgdXNlZC5cbiAgc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQ6IGZ1bmN0aW9uKG1lbW9SZWMpIHtcbiAgICBpZiAoIW1lbW9SZWMuaXNMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjaztcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5ID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2tbaWR4XTtcbiAgICAgIGlmIChtZW1vUmVjLmlzSW52b2x2ZWQoYXBwbGljYXRpb25NZW1vS2V5KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9LFxuXG4gIG1lbW9pemU6IGZ1bmN0aW9uKG1lbW9LZXksIG1lbW9SZWMpIHtcbiAgICB0aGlzLm1lbW9bbWVtb0tleV0gPSBtZW1vUmVjO1xuICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLm1heEV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoKTtcbiAgICB0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPVxuICAgICAgICBNYXRoLm1heCh0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQsIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCk7XG4gICAgcmV0dXJuIG1lbW9SZWM7XG4gIH0sXG5cbiAgY2xlYXJPYnNvbGV0ZUVudHJpZXM6IGZ1bmN0aW9uKHBvcywgaW52YWxpZGF0ZWRJZHgpIHtcbiAgICBpZiAocG9zICsgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA8PSBpbnZhbGlkYXRlZElkeCkge1xuICAgICAgLy8gT3B0aW1pemF0aW9uOiBub25lIG9mIHRoZSBydWxlIGFwcGxpY2F0aW9ucyB0aGF0IHdlcmUgbWVtb2l6ZWQgaGVyZSBleGFtaW5lZCB0aGVcbiAgICAgIC8vIGludGVydmFsIG9mIHRoZSBpbnB1dCB0aGF0IGNoYW5nZWQsIHNvIG5vdGhpbmcgaGFzIHRvIGJlIGludmFsaWRhdGVkLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBtZW1vID0gdGhpcy5tZW1vO1xuICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSAwO1xuICAgIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IC0xO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyhtZW1vKS5mb3JFYWNoKGZ1bmN0aW9uKGspIHtcbiAgICAgIHZhciBtZW1vUmVjID0gbWVtb1trXTtcbiAgICAgIGlmIChwb3MgKyBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoID4gaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgZGVsZXRlIG1lbW9ba107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLm1heEV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgoc2VsZi5tYXhFeGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCk7XG4gICAgICAgIHNlbGYubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9XG4gICAgICAgICAgICBNYXRoLm1heChzZWxmLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQsIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc0luZm87XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgU3ltYm9sID0gcmVxdWlyZSgnZXM2LXN5bWJvbCcpOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSByZXF1aXJlKCcuL25vZGVzJykuSXRlcmF0aW9uTm9kZTtcbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4vTWF0Y2hSZXN1bHQnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBKU09OIGlzIG5vdCBhIHZhbGlkIHN1YnNldCBvZiBKYXZhU2NyaXB0IGJlY2F1c2UgdGhlcmUgYXJlIHR3byBwb3NzaWJsZSBsaW5lIHRlcm1pbmF0b3JzLFxuLy8gVSsyMDI4IChsaW5lIHNlcGFyYXRvcikgYW5kIFUrMjAyOSAocGFyYWdyYXBoIHNlcGFyYXRvcikgdGhhdCBhcmUgYWxsb3dlZCBpbiBKU09OIHN0cmluZ3Ncbi8vIGJ1dCBub3QgaW4gSmF2YVNjcmlwdCBzdHJpbmdzLlxuLy8ganNvblRvSlMoKSBwcm9wZXJseSBlbmNvZGVzIHRob3NlIHR3byBjaGFyYWN0ZXJzIGluIEpTT04gc28gdGhhdCBpdCBjYW4gc2VhbWxlc3NseSBiZVxuLy8gaW5zZXJ0ZWQgaW50byBKYXZhU2NyaXB0IGNvZGUgKHBsdXMgdGhlIGVuY29kZWQgdmVyc2lvbiBpcyBzdGlsbCB2YWxpZCBKU09OKVxuZnVuY3Rpb24ganNvblRvSlMoc3RyKSB7XG4gIHZhciBvdXRwdXQgPSBzdHIucmVwbGFjZSgvW1xcdTIwMjhcXHUyMDI5XS9nLCBmdW5jdGlvbihjaGFyLCBwb3MsIHN0cikge1xuICAgIHZhciBoZXggPSBjaGFyLmNvZGVQb2ludEF0KDApLnRvU3RyaW5nKDE2KTtcbiAgICByZXR1cm4gJ1xcXFx1JyArICcwMDAwJy5zbGljZShoZXgubGVuZ3RoKSArIGhleDtcbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFdyYXBwZXJzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFdyYXBwZXJzIGRlY29yYXRlIENTVCBub2RlcyB3aXRoIGFsbCBvZiB0aGUgZnVuY3Rpb25hbGl0eSAoaS5lLiwgb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcylcbi8vIHByb3ZpZGVkIGJ5IGEgU2VtYW50aWNzIChzZWUgYmVsb3cpLiBgV3JhcHBlcmAgaXMgdGhlIGFic3RyYWN0IHN1cGVyY2xhc3Mgb2YgYWxsIHdyYXBwZXJzLiBBXG4vLyBgV3JhcHBlcmAgbXVzdCBoYXZlIGBfbm9kZWAgYW5kIGBfc2VtYW50aWNzYCBpbnN0YW5jZSB2YXJpYWJsZXMsIHdoaWNoIHJlZmVyIHRvIHRoZSBDU1Qgbm9kZSBhbmRcbi8vIFNlbWFudGljcyAocmVzcC4pIGZvciB3aGljaCBpdCB3YXMgY3JlYXRlZCwgYW5kIGEgYF9jaGlsZFdyYXBwZXJzYCBpbnN0YW5jZSB2YXJpYWJsZSB3aGljaCBpc1xuLy8gdXNlZCB0byBjYWNoZSB0aGUgd3JhcHBlciBpbnN0YW5jZXMgdGhhdCBhcmUgY3JlYXRlZCBmb3IgaXRzIGNoaWxkIG5vZGVzLiBTZXR0aW5nIHRoZXNlIGluc3RhbmNlXG4vLyB2YXJpYWJsZXMgaXMgdGhlIHJlc3BvbnNpYmlsaXR5IG9mIHRoZSBjb25zdHJ1Y3RvciBvZiBlYWNoIFNlbWFudGljcy1zcGVjaWZpYyBzdWJjbGFzcyBvZlxuLy8gYFdyYXBwZXJgLlxuZnVuY3Rpb24gV3JhcHBlcigpIHt9XG5cbldyYXBwZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnW3NlbWFudGljcyB3cmFwcGVyIGZvciAnICsgdGhpcy5fbm9kZS5ncmFtbWFyLm5hbWUgKyAnXSc7XG59O1xuXG4vLyBUaGlzIGlzIHVzZWQgYnkgb2htIGVkaXRvciB0byBkaXNwbGF5IGEgbm9kZSB3cmFwcGVyIGFwcHJvcHJpYXRlbHkuXG5XcmFwcGVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5cbldyYXBwZXIucHJvdG90eXBlLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvciA9IGZ1bmN0aW9uKGF0dHJpYnV0ZU5hbWUpIHtcbiAgLy8gUmVtb3ZlIHRoZSBtZW1vaXplZCBhdHRyaWJ1dGUgZnJvbSB0aGUgY3N0Tm9kZSBhbmQgYWxsIGl0cyBjaGlsZHJlbi5cbiAgZGVsZXRlIHRoaXMuX25vZGVbdGhpcy5fc2VtYW50aWNzLmF0dHJpYnV0ZUtleXNbYXR0cmlidXRlTmFtZV1dO1xuICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICBjaGlsZC5fZm9yZ2V0TWVtb2l6ZWRSZXN1bHRGb3IoYXR0cmlidXRlTmFtZSk7XG4gIH0pO1xufTtcblxuLy8gUmV0dXJucyB0aGUgd3JhcHBlciBvZiB0aGUgc3BlY2lmaWVkIGNoaWxkIG5vZGUuIENoaWxkIHdyYXBwZXJzIGFyZSBjcmVhdGVkIGxhemlseSBhbmQgY2FjaGVkIGluXG4vLyB0aGUgcGFyZW50IHdyYXBwZXIncyBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlLlxuV3JhcHBlci5wcm90b3R5cGUuY2hpbGQgPSBmdW5jdGlvbihpZHgpIHtcbiAgaWYgKCEoMCA8PSBpZHggJiYgaWR4IDwgdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpKSkge1xuICAgIC8vIFRPRE86IENvbnNpZGVyIHRocm93aW5nIGFuIGV4Y2VwdGlvbiBoZXJlLlxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgdmFyIGNoaWxkV3JhcHBlciA9IHRoaXMuX2NoaWxkV3JhcHBlcnNbaWR4XTtcbiAgaWYgKCFjaGlsZFdyYXBwZXIpIHtcbiAgICB2YXIgY2hpbGROb2RlID0gdGhpcy5fbm9kZS5jaGlsZEF0KGlkeCk7XG4gICAgdmFyIG9mZnNldCA9IHRoaXMuX25vZGUuY2hpbGRPZmZzZXRzW2lkeF07XG5cbiAgICB2YXIgc291cmNlID0gdGhpcy5fYmFzZUludGVydmFsLnN1YkludGVydmFsKG9mZnNldCwgY2hpbGROb2RlLm1hdGNoTGVuZ3RoKTtcbiAgICB2YXIgYmFzZSA9IGNoaWxkTm9kZS5pc05vbnRlcm1pbmFsKCkgPyBzb3VyY2UgOiB0aGlzLl9iYXNlSW50ZXJ2YWw7XG4gICAgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdID0gdGhpcy5fc2VtYW50aWNzLndyYXAoY2hpbGROb2RlLCBzb3VyY2UsIGJhc2UpO1xuICB9XG4gIHJldHVybiBjaGlsZFdyYXBwZXI7XG59O1xuXG4vLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHdyYXBwZXJzIG9mIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXNcbi8vIHdyYXBwZXIuXG5XcmFwcGVyLnByb3RvdHlwZS5fY2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgLy8gRm9yY2UgdGhlIGNyZWF0aW9uIG9mIGFsbCBjaGlsZCB3cmFwcGVyc1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCk7IGlkeCsrKSB7XG4gICAgdGhpcy5jaGlsZChpZHgpO1xuICB9XG4gIHJldHVybiB0aGlzLl9jaGlsZFdyYXBwZXJzO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uXG4vLyBleHByZXNzaW9uLCBpLmUuLCBhIEtsZWVuZS0qLCBLbGVlbmUtKywgb3IgYW4gb3B0aW9uYWwuIFJldHVybnMgYGZhbHNlYCBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5pc0l0ZXJhdGlvbigpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSB0ZXJtaW5hbCBub2RlLCBgZmFsc2VgXG4vLyBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlLmlzVGVybWluYWwoKTtcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZSwgYGZhbHNlYFxuLy8gb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5fbm9kZS5pc05vbnRlcm1pbmFsKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGVcbi8vIGNvcnJlc3BvbmRpbmcgdG8gYSBzeW50YWN0aWMgcnVsZSwgYGZhbHNlYCBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5pc05vbnRlcm1pbmFsKCkgJiYgdGhpcy5fbm9kZS5pc1N5bnRhY3RpYygpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlXG4vLyBjb3JyZXNwb25kaW5nIHRvIGEgbGV4aWNhbCBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzTGV4aWNhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5pc05vbnRlcm1pbmFsKCkgJiYgdGhpcy5fbm9kZS5pc0xleGljYWwoKTtcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGFuIGl0ZXJhdG9yIG5vZGVcbi8vIGhhdmluZyBlaXRoZXIgb25lIG9yIG5vIGNoaWxkICg/IG9wZXJhdG9yKSwgYGZhbHNlYCBvdGhlcndpc2UuXG4vLyBPdGhlcndpc2UsIHRocm93cyBhbiBleGNlcHRpb24uXG5XcmFwcGVyLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlLmlzT3B0aW9uYWwoKTtcbn07XG5cbi8vIENyZWF0ZSBhIG5ldyBfaXRlciB3cmFwcGVyIGluIHRoZSBzYW1lIHNlbWFudGljcyBhcyB0aGlzIHdyYXBwZXIuXG5XcmFwcGVyLnByb3RvdHlwZS5pdGVyYXRpb24gPSBmdW5jdGlvbihvcHRDaGlsZFdyYXBwZXJzKSB7XG4gIHZhciBjaGlsZFdyYXBwZXJzID0gb3B0Q2hpbGRXcmFwcGVycyB8fCBbXTtcblxuICB2YXIgY2hpbGROb2RlcyA9IGNoaWxkV3JhcHBlcnMubWFwKGZ1bmN0aW9uKGMpIHsgcmV0dXJuIGMuX25vZGU7IH0pO1xuICB2YXIgaXRlciA9IG5ldyBJdGVyYXRpb25Ob2RlKHRoaXMuX25vZGUuZ3JhbW1hciwgY2hpbGROb2RlcywgW10sIC0xLCBmYWxzZSk7XG5cbiAgdmFyIHdyYXBwZXIgPSB0aGlzLl9zZW1hbnRpY3Mud3JhcChpdGVyLCBudWxsLCBudWxsKTtcbiAgd3JhcHBlci5fY2hpbGRXcmFwcGVycyA9IGNoaWxkV3JhcHBlcnM7XG4gIHJldHVybiB3cmFwcGVyO1xufTtcblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoV3JhcHBlci5wcm90b3R5cGUsIHtcbiAgLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBjaGlsZHJlbiBvZiB0aGlzIENTVCBub2RlLlxuICBjaGlsZHJlbjoge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9jaGlsZHJlbigpOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBuYW1lIG9mIGdyYW1tYXIgcnVsZSB0aGF0IGNyZWF0ZWQgdGhpcyBDU1Qgbm9kZS5cbiAgY3Rvck5hbWU6IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5jdG9yTmFtZTsgfX0sXG5cbiAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgZXZlbnR1YWxseSAoZGVwcmVjYXRlZCBpbiB2MC4xMikuXG4gIGludGVydmFsOiB7Z2V0OiBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgaW50ZXJ2YWxgIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgLS0gdXNlIGBzb3VyY2VgIGluc3RlYWQnKTtcbiAgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIG51bUNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgfX0sXG5cbiAgLy8gUmV0dXJucyB0aGUgcHJpbWl0aXZlIHZhbHVlIG9mIHRoaXMgQ1NUIG5vZGUsIGlmIGl0J3MgYSB0ZXJtaW5hbCBub2RlLiBPdGhlcndpc2UsXG4gIC8vIHRocm93cyBhbiBleGNlcHRpb24uXG4gIHByaW1pdGl2ZVZhbHVlOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmlzVGVybWluYWwoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5wcmltaXRpdmVWYWx1ZTtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJ0cmllZCB0byBhY2Nlc3MgdGhlICdwcmltaXRpdmVWYWx1ZScgYXR0cmlidXRlIG9mIGEgbm9uLXRlcm1pbmFsIENTVCBub2RlXCIpO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIGNvbnN1bWVkIGJ5IHRoaXMgQ1NUIG5vZGUuXG4gIHNvdXJjZVN0cmluZzoge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLnNvdXJjZS5jb250ZW50czsgfX1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBTZW1hbnRpY3MgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQSBTZW1hbnRpY3MgaXMgYSBjb250YWluZXIgZm9yIGEgZmFtaWx5IG9mIE9wZXJhdGlvbnMgYW5kIEF0dHJpYnV0ZXMgZm9yIGEgZ2l2ZW4gZ3JhbW1hci5cbi8vIFNlbWFudGljcyBlbmFibGUgbW9kdWxhcml0eSAoZGlmZmVyZW50IGNsaWVudHMgb2YgYSBncmFtbWFyIGNhbiBjcmVhdGUgdGhlaXIgc2V0IG9mIG9wZXJhdGlvbnNcbi8vIGFuZCBhdHRyaWJ1dGVzIGluIGlzb2xhdGlvbikgYW5kIGV4dGVuc2liaWxpdHkgZXZlbiB3aGVuIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgYXJlIG11dHVhbGx5LVxuLy8gcmVjdXJzaXZlLiBUaGlzIGNvbnN0cnVjdG9yIHNob3VsZCBub3QgYmUgY2FsbGVkIGRpcmVjdGx5IGV4Y2VwdCBmcm9tXG4vLyBgU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljc2AuIFRoZSBub3JtYWwgd2F5cyB0byBjcmVhdGUgYSBTZW1hbnRpY3MsIGdpdmVuIGEgZ3JhbW1hciAnZycsIGFyZVxuLy8gYGcuY3JlYXRlU2VtYW50aWNzKClgIGFuZCBgZy5leHRlbmRTZW1hbnRpY3MocGFyZW50U2VtYW50aWNzKWAuXG5mdW5jdGlvbiBTZW1hbnRpY3MoZ3JhbW1hciwgc3VwZXJTZW1hbnRpY3MpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICB0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cyA9IGZhbHNlO1xuXG4gIC8vIENvbnN0cnVjdG9yIGZvciB3cmFwcGVyIGluc3RhbmNlcywgd2hpY2ggYXJlIHBhc3NlZCBhcyB0aGUgYXJndW1lbnRzIHRvIHRoZSBzZW1hbnRpYyBhY3Rpb25zXG4gIC8vIG9mIGFuIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUuIE9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcmVxdWlyZSBkb3VibGUgZGlzcGF0Y2g6IHRoZSBzZW1hbnRpY1xuICAvLyBhY3Rpb24gaXMgY2hvc2VuIGJhc2VkIG9uIGJvdGggdGhlIG5vZGUncyB0eXBlIGFuZCB0aGUgc2VtYW50aWNzLiBXcmFwcGVycyBlbnN1cmUgdGhhdFxuICAvLyB0aGUgYGV4ZWN1dGVgIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCB0aGUgY29ycmVjdCAobW9zdCBzcGVjaWZpYykgc2VtYW50aWNzIG9iamVjdCBhcyBhblxuICAvLyBhcmd1bWVudC5cbiAgdGhpcy5XcmFwcGVyID0gZnVuY3Rpb24obm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCkge1xuICAgIHNlbGYuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSgpO1xuICAgIHRoaXMuX3NlbWFudGljcyA9IHNlbGY7XG4gICAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2VJbnRlcnZhbDtcblxuICAgIC8vIFRoZSBpbnRlcnZhbCB0aGF0IHRoZSBjaGlsZE9mZnNldHMgb2YgYG5vZGVgIGFyZSByZWxhdGl2ZSB0by4gSXQgc2hvdWxkIGJlIHRoZSBzb3VyY2VcbiAgICAvLyBvZiB0aGUgY2xvc2VzdCBOb250ZXJtaW5hbCBub2RlLlxuICAgIHRoaXMuX2Jhc2VJbnRlcnZhbCA9IGJhc2VJbnRlcnZhbDtcblxuICAgIGlmIChub2RlLmlzTm9udGVybWluYWwoKSkge1xuICAgICAgY29tbW9uLmFzc2VydChzb3VyY2VJbnRlcnZhbCA9PT0gYmFzZUludGVydmFsKTtcbiAgICB9XG5cbiAgICB0aGlzLl9jaGlsZFdyYXBwZXJzID0gW107XG4gIH07XG5cbiAgdGhpcy5zdXBlciA9IHN1cGVyU2VtYW50aWNzO1xuICBpZiAoc3VwZXJTZW1hbnRpY3MpIHtcbiAgICBpZiAoIShncmFtbWFyLmVxdWFscyh0aGlzLnN1cGVyLmdyYW1tYXIpIHx8IGdyYW1tYXIuX2luaGVyaXRzRnJvbSh0aGlzLnN1cGVyLmdyYW1tYXIpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQ2Fubm90IGV4dGVuZCBhIHNlbWFudGljcyBmb3IgZ3JhbW1hciAnXCIgKyB0aGlzLnN1cGVyLmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgXCInIGZvciB1c2Ugd2l0aCBncmFtbWFyICdcIiArIGdyYW1tYXIubmFtZSArIFwiJyAobm90IGEgc3ViLWdyYW1tYXIpXCIpO1xuICAgIH1cbiAgICBpbmhlcml0cyh0aGlzLldyYXBwZXIsIHRoaXMuc3VwZXIuV3JhcHBlcik7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLm9wZXJhdGlvbnMpO1xuICAgIHRoaXMuYXR0cmlidXRlcyA9IE9iamVjdC5jcmVhdGUodGhpcy5zdXBlci5hdHRyaWJ1dGVzKTtcbiAgICB0aGlzLmF0dHJpYnV0ZUtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4gICAgLy8gQXNzaWduIHVuaXF1ZSBzeW1ib2xzIGZvciBlYWNoIG9mIHRoZSBhdHRyaWJ1dGVzIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3Mgc28gdGhhdFxuICAgIC8vIHRoZXkgYXJlIG1lbW9pemVkIGluZGVwZW5kZW50bHkuXG4gICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIHRoaXMuYXR0cmlidXRlS2V5c1thdHRyaWJ1dGVOYW1lXSA9IFN5bWJvbCgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpbmhlcml0cyh0aGlzLldyYXBwZXIsIFdyYXBwZXIpO1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLmF0dHJpYnV0ZUtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICB9XG59XG5cblNlbWFudGljcy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbc2VtYW50aWNzIGZvciAnICsgdGhpcy5ncmFtbWFyLm5hbWUgKyAnXSc7XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkgPSBmdW5jdGlvbigpIHtcbiAgaWYgKCF0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cykge1xuICAgIHRoaXMuY2hlY2tBY3Rpb25EaWN0cygpO1xuICAgIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gdHJ1ZTtcbiAgfVxufTtcblxuLy8gQ2hlY2tzIHRoYXQgdGhlIGFjdGlvbiBkaWN0aW9uYXJpZXMgZm9yIGFsbCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGluIHRoaXMgc2VtYW50aWNzLFxuLy8gaW5jbHVkaW5nIHRoZSBvbmVzIHRoYXQgd2VyZSBpbmhlcml0ZWQgZnJvbSB0aGUgc3VwZXItc2VtYW50aWNzLCBhZ3JlZSB3aXRoIHRoZSBncmFtbWFyLlxuLy8gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBvbmUgb3IgbW9yZSBvZiB0aGVtIGRvZXNuJ3QuXG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5hbWU7XG4gIGZvciAobmFtZSBpbiB0aGlzLm9wZXJhdGlvbnMpIHtcbiAgICB0aGlzLm9wZXJhdGlvbnNbbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG4gIH1cbiAgZm9yIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIHRoaXMuYXR0cmlidXRlc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgfVxufTtcblxuU2VtYW50aWNzLnByb3RvdHlwZS50b1JlY2lwZSA9IGZ1bmN0aW9uKHNlbWFudGljc09ubHkpIHtcbiAgZnVuY3Rpb24gaGFzU3VwZXJTZW1hbnRpY3Mocykge1xuICAgIHJldHVybiBzLnN1cGVyICE9PSBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCk7XG4gIH1cblxuICB2YXIgc3RyID0gJyhmdW5jdGlvbihnKSB7XFxuJztcbiAgaWYgKGhhc1N1cGVyU2VtYW50aWNzKHRoaXMpKSB7XG4gICAgc3RyICs9ICcgIHZhciBzZW1hbnRpY3MgPSAnICsgdGhpcy5zdXBlci50b1JlY2lwZSh0cnVlKSArICcoZyc7XG5cbiAgICB2YXIgc3VwZXJTZW1hbnRpY3NHcmFtbWFyID0gdGhpcy5zdXBlci5ncmFtbWFyO1xuICAgIHZhciByZWxhdGVkR3JhbW1hciA9IHRoaXMuZ3JhbW1hcjtcbiAgICB3aGlsZSAocmVsYXRlZEdyYW1tYXIgIT09IHN1cGVyU2VtYW50aWNzR3JhbW1hcikge1xuICAgICAgc3RyICs9ICcuc3VwZXJHcmFtbWFyJztcbiAgICAgIHJlbGF0ZWRHcmFtbWFyID0gcmVsYXRlZEdyYW1tYXIuc3VwZXJHcmFtbWFyO1xuICAgIH1cblxuICAgIHN0ciArPSAnKTtcXG4nO1xuICAgIHN0ciArPSAnICByZXR1cm4gZy5leHRlbmRTZW1hbnRpY3Moc2VtYW50aWNzKSc7XG4gIH0gZWxzZSB7XG4gICAgc3RyICs9ICcgIHJldHVybiBnLmNyZWF0ZVNlbWFudGljcygpJztcbiAgfVxuICBbJ09wZXJhdGlvbicsICdBdHRyaWJ1dGUnXS5mb3JFYWNoKGZ1bmN0aW9uKHR5cGUpIHtcbiAgICB2YXIgc2VtYW50aWNPcGVyYXRpb25zID0gdGhpc1t0eXBlLnRvTG93ZXJDYXNlKCkgKyAncyddO1xuICAgIE9iamVjdC5rZXlzKHNlbWFudGljT3BlcmF0aW9ucykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB2YXIgc2lnbmF0dXJlID0gbmFtZTtcbiAgICAgIGlmIChzZW1hbnRpY09wZXJhdGlvbnNbbmFtZV0uZm9ybWFscy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNpZ25hdHVyZSArPSAnKCcgKyBzZW1hbnRpY09wZXJhdGlvbnNbbmFtZV0uZm9ybWFscy5qb2luKCcsICcpICsgJyknO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWV0aG9kO1xuICAgICAgaWYgKGhhc1N1cGVyU2VtYW50aWNzKHRoaXMpICYmIHRoaXMuc3VwZXJbdHlwZS50b0xvd2VyQ2FzZSgpICsgJ3MnXVtuYW1lXSkge1xuICAgICAgICBtZXRob2QgPSAnZXh0ZW5kJyArIHR5cGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtZXRob2QgPSAnYWRkJyArIHR5cGU7XG4gICAgICB9XG4gICAgICBzdHIgKz0gJ1xcbiAgICAuJyArIG1ldGhvZCArICcoJyArIEpTT04uc3RyaW5naWZ5KHNpZ25hdHVyZSkgKyAnLCB7JztcblxuICAgICAgdmFyIGFjdGlvbnMgPSBzZW1hbnRpY09wZXJhdGlvbnNbbmFtZV0uYWN0aW9uRGljdDtcbiAgICAgIHZhciBzcmNBcnJheSA9IFtdO1xuICAgICAgT2JqZWN0LmtleXMoYWN0aW9ucykuZm9yRWFjaChmdW5jdGlvbihhY3Rpb25OYW1lKSB7XG4gICAgICAgIGlmIChzZW1hbnRpY09wZXJhdGlvbnNbbmFtZV0uYnVpbHRJbkRlZmF1bHQgIT09IGFjdGlvbnNbYWN0aW9uTmFtZV0pIHtcbiAgICAgICAgICBzcmNBcnJheS5wdXNoKCdcXG4gICAgICAnICsgSlNPTi5zdHJpbmdpZnkoYWN0aW9uTmFtZSkgKyAnOiAnICtcbiAgICAgICAgICAgIGFjdGlvbnNbYWN0aW9uTmFtZV0udG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgc3RyICs9IHNyY0FycmF5LmpvaW4oJywnKTtcblxuICAgICAgc3RyICs9ICdcXG4gICAgfSknO1xuICAgIH0sIHRoaXMpO1xuICB9LCB0aGlzKTtcbiAgc3RyICs9ICc7XFxuICB9KSc7XG5cbiAgaWYgKCFzZW1hbnRpY3NPbmx5KSB7XG4gICAgc3RyID1cbiAgICAgICcoZnVuY3Rpb24oKSB7XFxuJyArXG4gICAgICAnICB2YXIgZ3JhbW1hciA9IHRoaXMuZnJvbVJlY2lwZSgnICsganNvblRvSlModGhpcy5ncmFtbWFyLnRvUmVjaXBlKCkpICsgJyk7XFxuJyArXG4gICAgICAnICB2YXIgc2VtYW50aWNzID0gJyArIHN0ciArICcoZ3JhbW1hcik7XFxuJyArXG4gICAgICAnICByZXR1cm4gc2VtYW50aWNzO1xcbicgK1xuICAgICAgJ30pO1xcbic7XG4gIH1cblxuICByZXR1cm4gc3RyO1xufTtcblxudmFyIHByb3RvdHlwZUdyYW1tYXI7XG52YXIgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcztcblxuLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gbWFpbi5qcyBvbmNlIE9obSBoYXMgbG9hZGVkLlxuU2VtYW50aWNzLmluaXRQcm90b3R5cGVQYXJzZXIgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHByb3RvdHlwZUdyYW1tYXJTZW1hbnRpY3MgPSBncmFtbWFyLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigncGFyc2UnLCB7XG4gICAgQXR0cmlidXRlU2lnbmF0dXJlOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgIGZvcm1hbHM6IFtdXG4gICAgICB9O1xuICAgIH0sXG4gICAgT3BlcmF0aW9uU2lnbmF0dXJlOiBmdW5jdGlvbihuYW1lLCBvcHRGb3JtYWxzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgIGZvcm1hbHM6IG9wdEZvcm1hbHMucGFyc2UoKVswXSB8fCBbXVxuICAgICAgfTtcbiAgICB9LFxuICAgIEZvcm1hbHM6IGZ1bmN0aW9uKG9wYXJlbiwgZnMsIGNwYXJlbikge1xuICAgICAgcmV0dXJuIGZzLmFzSXRlcmF0aW9uKCkucGFyc2UoKTtcbiAgICB9LFxuICAgIG5hbWU6IGZ1bmN0aW9uKGZpcnN0LCByZXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgfVxuICB9KTtcbiAgcHJvdG90eXBlR3JhbW1hciA9IGdyYW1tYXI7XG59O1xuXG5mdW5jdGlvbiBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpIHtcbiAgaWYgKCFwcm90b3R5cGVHcmFtbWFyKSB7XG4gICAgLy8gVGhlIE9wZXJhdGlvbnMgYW5kIEF0dHJpYnV0ZXMgZ3JhbW1hciB3b24ndCBiZSBhdmFpbGFibGUgd2hpbGUgT2htIGlzIGxvYWRpbmcsXG4gICAgLy8gYnV0IHdlIGNhbiBnZXQgYXdheSB0aGUgZm9sbG93aW5nIHNpbXBsaWZpY2F0aW9uIGIvYyBub25lIG9mIHRoZSBvcGVyYXRpb25zXG4gICAgLy8gdGhhdCBhcmUgdXNlZCB3aGlsZSBsb2FkaW5nIHRha2UgYXJndW1lbnRzLlxuICAgIGNvbW1vbi5hc3NlcnQoc2lnbmF0dXJlLmluZGV4T2YoJygnKSA9PT0gLTEpO1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiBzaWduYXR1cmUsXG4gICAgICBmb3JtYWxzOiBbXVxuICAgIH07XG4gIH1cblxuICB2YXIgciA9IHByb3RvdHlwZUdyYW1tYXIubWF0Y2goXG4gICAgICBzaWduYXR1cmUsXG4gICAgICB0eXBlID09PSAnb3BlcmF0aW9uJyA/ICdPcGVyYXRpb25TaWduYXR1cmUnIDogJ0F0dHJpYnV0ZVNpZ25hdHVyZScpO1xuICBpZiAoci5mYWlsZWQoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihyLm1lc3NhZ2UpO1xuICB9XG5cbiAgcmV0dXJuIHByb3RvdHlwZUdyYW1tYXJTZW1hbnRpY3MocikucGFyc2UoKTtcbn1cblxuZnVuY3Rpb24gbmV3RGVmYXVsdEFjdGlvbih0eXBlLCBuYW1lLCBkb0l0KSB7XG4gIHJldHVybiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzLm9wZXJhdGlvbnNbbmFtZV0gfHwgdGhpcy5fc2VtYW50aWNzLmF0dHJpYnV0ZXNbbmFtZV07XG4gICAgdmFyIGFyZ3MgPSB0aGlzVGhpbmcuZm9ybWFscy5tYXAoZnVuY3Rpb24oZm9ybWFsKSB7XG4gICAgICByZXR1cm4gc2VsZi5hcmdzW2Zvcm1hbF07XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pc0l0ZXJhdGlvbigpKSB7XG4gICAgICAvLyBUaGlzIENTVCBub2RlIGNvcnJlc3BvbmRzIHRvIGFuIGl0ZXJhdGlvbiBleHByZXNzaW9uIGluIHRoZSBncmFtbWFyICgqLCArLCBvciA/KS4gVGhlXG4gICAgICAvLyBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIG1hcCB0aGlzIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgb3ZlciBhbGwgb2YgaXRzIGNoaWxkIG5vZGVzLlxuICAgICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCkgeyByZXR1cm4gZG9JdC5hcHBseShjaGlsZCwgYXJncyk7IH0pO1xuICAgIH1cblxuICAgIC8vIFRoaXMgQ1NUIG5vZGUgY29ycmVzcG9uZHMgdG8gYSBub24tdGVybWluYWwgaW4gdGhlIGdyYW1tYXIgKGUuZy4sIEFkZEV4cHIpLiBUaGUgZmFjdCB0aGF0XG4gICAgLy8gd2UgZ290IGhlcmUgbWVhbnMgdGhhdCB0aGlzIGFjdGlvbiBkaWN0aW9uYXJ5IGRvZXNuJ3QgaGF2ZSBhbiBhY3Rpb24gZm9yIHRoaXMgcGFydGljdWxhclxuICAgIC8vIG5vbi10ZXJtaW5hbCBvciBhIGdlbmVyaWMgYF9ub250ZXJtaW5hbGAgYWN0aW9uLlxuICAgIGlmIChjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgIC8vIEFzIGEgY29udmVuaWVuY2UsIGlmIHRoaXMgbm9kZSBvbmx5IGhhcyBvbmUgY2hpbGQsIHdlIGp1c3QgcmV0dXJuIHRoZSByZXN1bHQgb2ZcbiAgICAgIC8vIGFwcGx5aW5nIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIHRvIHRoZSBjaGlsZCBub2RlLlxuICAgICAgcmV0dXJuIGRvSXQuYXBwbHkoY2hpbGRyZW5bMF0sIGFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBPdGhlcndpc2UsIHdlIHRocm93IGFuIGV4Y2VwdGlvbiB0byBsZXQgdGhlIHByb2dyYW1tZXIga25vdyB0aGF0IHdlIGRvbid0IGtub3cgd2hhdFxuICAgICAgLy8gdG8gZG8gd2l0aCB0aGlzIG5vZGUuXG4gICAgICB0aHJvdyBlcnJvcnMubWlzc2luZ1NlbWFudGljQWN0aW9uKFxuICAgICAgICAgIHRoaXMuY3Rvck5hbWUsIG5hbWUsIHR5cGUpO1xuICAgIH1cbiAgfTtcbn1cblxuU2VtYW50aWNzLnByb3RvdHlwZS5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uKHR5cGUsIHNpZ25hdHVyZSwgYWN0aW9uRGljdCkge1xuICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG5cbiAgdmFyIHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzID0gcGFyc2VTaWduYXR1cmUoc2lnbmF0dXJlLCB0eXBlKTtcbiAgdmFyIG5hbWUgPSBwYXJzZWROYW1lQW5kRm9ybWFsQXJncy5uYW1lO1xuICB2YXIgZm9ybWFscyA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLmZvcm1hbHM7XG5cbiAgLy8gVE9ETzogY2hlY2sgdGhhdCB0aGVyZSBhcmUgbm8gZHVwbGljYXRlIGZvcm1hbCBhcmd1bWVudHNcblxuICB0aGlzLmFzc2VydE5ld05hbWUobmFtZSwgdHlwZSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBhY3Rpb24gZGljdGlvbmFyeSBmb3IgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgdGhhdCBjb250YWlucyBhIGBfZGVmYXVsdGAgYWN0aW9uXG4gIC8vIHdoaWNoIGRlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgaXRlcmF0aW9uLCB0ZXJtaW5hbCwgYW5kIG5vbi10ZXJtaW5hbCBub2Rlcy4uLlxuICB2YXIgYnVpbHRJbkRlZmF1bHQgPSBuZXdEZWZhdWx0QWN0aW9uKHR5cGUsIG5hbWUsIGRvSXQpO1xuICB2YXIgcmVhbEFjdGlvbkRpY3QgPSB7X2RlZmF1bHQ6IGJ1aWx0SW5EZWZhdWx0fTtcbiAgLy8gLi4uIGFuZCBhZGQgaW4gdGhlIGFjdGlvbnMgc3VwcGxpZWQgYnkgdGhlIHByb2dyYW1tZXIsIHdoaWNoIG1heSBvdmVycmlkZSBzb21lIG9yIGFsbCBvZiB0aGVcbiAgLy8gZGVmYXVsdCBvbmVzLlxuICBPYmplY3Qua2V5cyhhY3Rpb25EaWN0KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICByZWFsQWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gIH0pO1xuXG4gIHZhciBlbnRyeSA9IHR5cGUgPT09ICdvcGVyYXRpb24nID9cbiAgICAgIG5ldyBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KSA6XG4gICAgICBuZXcgQXR0cmlidXRlKG5hbWUsIHJlYWxBY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCk7XG5cbiAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gIGVudHJ5LmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSBlbnRyeTtcblxuICBmdW5jdGlvbiBkb0l0KCkge1xuICAgIC8vIERpc3BhdGNoIHRvIG1vc3Qgc3BlY2lmaWMgdmVyc2lvbiBvZiB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSAtLSBpdCBtYXkgaGF2ZSBiZWVuXG4gICAgLy8gb3ZlcnJpZGRlbiBieSBhIHN1Yi1zZW1hbnRpY3MuXG4gICAgdmFyIHRoaXNUaGluZyA9IHRoaXMuX3NlbWFudGljc1t0eXBlUGx1cmFsXVtuYW1lXTtcblxuICAgIC8vIENoZWNrIHRoYXQgdGhlIGNhbGxlciBwYXNzZWQgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gdGhpc1RoaW5nLmZvcm1hbHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0ludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cyBwYXNzZWQgdG8gJyArIG5hbWUgKyAnICcgKyB0eXBlICsgJyAoZXhwZWN0ZWQgJyArXG4gICAgICAgICAgdGhpc1RoaW5nLmZvcm1hbHMubGVuZ3RoICsgJywgZ290ICcgKyBhcmd1bWVudHMubGVuZ3RoICsgJyknKTtcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgYW4gXCJhcmd1bWVudHMgb2JqZWN0XCIgZnJvbSB0aGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhpc1xuICAgIC8vIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZS5cbiAgICB2YXIgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBmb3JtYWwgPSB0aGlzVGhpbmcuZm9ybWFsc1tpZHhdO1xuICAgICAgYXJnc1tmb3JtYWxdID0gYXJndW1lbnRzW2lkeF07XG4gICAgfVxuXG4gICAgdmFyIG9sZEFyZ3MgPSB0aGlzLmFyZ3M7XG4gICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB0cnkge1xuICAgICAgdmFyIGFucyA9IHRoaXNUaGluZy5leGVjdXRlKHRoaXMuX3NlbWFudGljcywgdGhpcyk7XG5cbiAgICAgIHRoaXMuYXJncyA9IG9sZEFyZ3M7XG4gICAgICByZXR1cm4gYW5zO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGlmIChlLm5hbWUgPT09ICdtaXNzaW5nU2VtYW50aWNBY3Rpb24nKSB7XG4gICAgICAgIGUubWVzc2FnZSArPSAnXFxuJyArIHRoaXMuY3Rvck5hbWU7XG4gICAgICB9XG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0eXBlID09PSAnb3BlcmF0aW9uJykge1xuICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0gPSBkb0l0O1xuICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0udG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiAnWycgKyBuYW1lICsgJyBvcGVyYXRpb25dJztcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLldyYXBwZXIucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgICBnZXQ6IGRvSXQsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUgIC8vIFNvIHRoZSBwcm9wZXJ0eSBjYW4gYmUgZGVsZXRlZC5cbiAgICB9KTtcbiAgICB0aGlzLmF0dHJpYnV0ZUtleXNbbmFtZV0gPSBTeW1ib2woKTtcbiAgfVxufTtcblxuU2VtYW50aWNzLnByb3RvdHlwZS5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgdmFyIHR5cGVQbHVyYWwgPSB0eXBlICsgJ3MnO1xuXG4gIC8vIE1ha2Ugc3VyZSB0aGF0IGBuYW1lYCByZWFsbHkgaXMganVzdCBhIG5hbWUsIGkuZS4sIHRoYXQgaXQgZG9lc24ndCBhbHNvIGNvbnRhaW4gZm9ybWFscy5cbiAgcGFyc2VTaWduYXR1cmUobmFtZSwgJ2F0dHJpYnV0ZScpO1xuXG4gIGlmICghKHRoaXMuc3VwZXIgJiYgbmFtZSBpbiB0aGlzLnN1cGVyW3R5cGVQbHVyYWxdKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgK1xuICAgICAgICBcIic6IGRpZCBub3QgaW5oZXJpdCBhbiBcIiArIHR5cGUgKyAnIHdpdGggdGhhdCBuYW1lJyk7XG4gIH1cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzW3R5cGVQbHVyYWxdLCBuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIicgYWdhaW5cIik7XG4gIH1cblxuICAvLyBDcmVhdGUgYSBuZXcgb3BlcmF0aW9uIC8gYXR0cmlidXRlIHdob3NlIGFjdGlvbkRpY3QgZGVsZWdhdGVzIHRvIHRoZSBzdXBlciBvcGVyYXRpb24gL1xuICAvLyBhdHRyaWJ1dGUncyBhY3Rpb25EaWN0LCBhbmQgd2hpY2ggaGFzIGFsbCB0aGUga2V5cyBmcm9tIGBpbmhlcml0ZWRBY3Rpb25EaWN0YC5cbiAgdmFyIGluaGVyaXRlZEZvcm1hbHMgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmZvcm1hbHM7XG4gIHZhciBpbmhlcml0ZWRBY3Rpb25EaWN0ID0gdGhpc1t0eXBlUGx1cmFsXVtuYW1lXS5hY3Rpb25EaWN0O1xuICB2YXIgbmV3QWN0aW9uRGljdCA9IE9iamVjdC5jcmVhdGUoaW5oZXJpdGVkQWN0aW9uRGljdCk7XG4gIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIG5ld0FjdGlvbkRpY3RbbmFtZV0gPSBhY3Rpb25EaWN0W25hbWVdO1xuICB9KTtcblxuICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgP1xuICAgICAgbmV3IE9wZXJhdGlvbihuYW1lLCBpbmhlcml0ZWRGb3JtYWxzLCBuZXdBY3Rpb25EaWN0KSA6XG4gICAgICBuZXcgQXR0cmlidXRlKG5hbWUsIG5ld0FjdGlvbkRpY3QpO1xuXG4gIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgaXMgbm90IHN0cmljdGx5IG5lY2Vzc2FyeSAoaXQgd2lsbCBoYXBwZW4gbGF0ZXIgYW55d2F5KSBidXQgaXQncyBiZXR0ZXIgdG9cbiAgLy8gY2F0Y2ggZXJyb3JzIGVhcmx5LlxuICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xufTtcblxuU2VtYW50aWNzLnByb3RvdHlwZS5hc3NlcnROZXdOYW1lID0gZnVuY3Rpb24obmFtZSwgdHlwZSkge1xuICBpZiAoV3JhcHBlci5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogdGhhdCdzIGEgcmVzZXJ2ZWQgbmFtZVwiKTtcbiAgfVxuICBpZiAobmFtZSBpbiB0aGlzLm9wZXJhdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogYW4gb3BlcmF0aW9uIHdpdGggdGhhdCBuYW1lIGFscmVhZHkgZXhpc3RzXCIpO1xuICB9XG4gIGlmIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBhdHRyaWJ1dGUgd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gIH1cbn07XG5cbi8vIFJldHVybnMgYSB3cmFwcGVyIGZvciB0aGUgZ2l2ZW4gQ1NUIGBub2RlYCBpbiB0aGlzIHNlbWFudGljcy5cbi8vIElmIGBub2RlYCBpcyBhbHJlYWR5IGEgd3JhcHBlciwgcmV0dXJucyBgbm9kZWAgaXRzZWxmLiAgLy8gVE9ETzogd2h5IGlzIHRoaXMgbmVlZGVkP1xuU2VtYW50aWNzLnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24obm9kZSwgc291cmNlLCBvcHRCYXNlSW50ZXJ2YWwpIHtcbiAgdmFyIGJhc2VJbnRlcnZhbCA9IG9wdEJhc2VJbnRlcnZhbCB8fCBzb3VyY2U7XG4gIHJldHVybiBub2RlIGluc3RhbmNlb2YgdGhpcy5XcmFwcGVyID8gbm9kZSA6IG5ldyB0aGlzLldyYXBwZXIobm9kZSwgc291cmNlLCBiYXNlSW50ZXJ2YWwpO1xufTtcblxuLy8gQ3JlYXRlcyBhIG5ldyBTZW1hbnRpY3MgaW5zdGFuY2UgZm9yIGBncmFtbWFyYCwgaW5oZXJpdGluZyBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGZyb21cbi8vIGBvcHRTdXBlclNlbWFudGljc2AsIGlmIGl0IGlzIHNwZWNpZmllZC4gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIHByb3h5IGZvciB0aGUgbmV3XG4vLyBTZW1hbnRpY3MgaW5zdGFuY2UuIFdoZW4gdGhhdCBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggYSBDU1Qgbm9kZSBhcyBhbiBhcmd1bWVudCwgaXQgcmV0dXJuc1xuLy8gYSB3cmFwcGVyIGZvciB0aGF0IG5vZGUgd2hpY2ggZ2l2ZXMgYWNjZXNzIHRvIHRoZSBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIHByb3ZpZGVkIGJ5IHRoaXNcbi8vIHNlbWFudGljcy5cblNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3MgPSBmdW5jdGlvbihncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcykge1xuICB2YXIgcyA9IG5ldyBTZW1hbnRpY3MoXG4gICAgICBncmFtbWFyLFxuICAgICAgb3B0U3VwZXJTZW1hbnRpY3MgIT09IHVuZGVmaW5lZCA/XG4gICAgICAgICAgb3B0U3VwZXJTZW1hbnRpY3MgOlxuICAgICAgICAgIFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG5cbiAgLy8gVG8gZW5hYmxlIGNsaWVudHMgdG8gaW52b2tlIGEgc2VtYW50aWNzIGxpa2UgYSBmdW5jdGlvbiwgcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHlcbiAgLy8gZm9yIGBzYCwgd2hpY2ggaXMgdGhlIHJlYWwgYFNlbWFudGljc2AgaW5zdGFuY2UuXG4gIHZhciBwcm94eSA9IGZ1bmN0aW9uIEFTZW1hbnRpY3MobWF0Y2hSZXN1bHQpIHtcbiAgICBpZiAoIShtYXRjaFJlc3VsdCBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnU2VtYW50aWNzIGV4cGVjdGVkIGEgTWF0Y2hSZXN1bHQsIGJ1dCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcobWF0Y2hSZXN1bHQpKTtcbiAgICB9XG4gICAgaWYgKG1hdGNoUmVzdWx0LmZhaWxlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3QgYXBwbHkgU2VtYW50aWNzIHRvICcgKyBtYXRjaFJlc3VsdC50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICB2YXIgY3N0ID0gbWF0Y2hSZXN1bHQuX2NzdDtcbiAgICBpZiAoY3N0LmdyYW1tYXIgIT09IGdyYW1tYXIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBcIkNhbm5vdCB1c2UgYSBNYXRjaFJlc3VsdCBmcm9tIGdyYW1tYXIgJ1wiICsgY3N0LmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgXCInIHdpdGggYSBzZW1hbnRpY3MgZm9yICdcIiArIGdyYW1tYXIubmFtZSArIFwiJ1wiKTtcbiAgICB9XG4gICAgdmFyIGlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoUmVzdWx0LmlucHV0KTtcbiAgICByZXR1cm4gcy53cmFwKGNzdCwgaW5wdXRTdHJlYW0uaW50ZXJ2YWwobWF0Y2hSZXN1bHQuX2NzdE9mZnNldCwgbWF0Y2hSZXN1bHQuaW5wdXQubGVuZ3RoKSk7XG4gIH07XG5cbiAgLy8gRm9yd2FyZCBwdWJsaWMgbWV0aG9kcyBmcm9tIHRoZSBwcm94eSB0byB0aGUgc2VtYW50aWNzIGluc3RhbmNlLlxuICBwcm94eS5hZGRPcGVyYXRpb24gPSBmdW5jdGlvbihzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICBzLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlKCdvcGVyYXRpb24nLCBzaWduYXR1cmUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuZXh0ZW5kT3BlcmF0aW9uID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ29wZXJhdGlvbicsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuYWRkQXR0cmlidXRlID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuZXh0ZW5kQXR0cmlidXRlID0gZnVuY3Rpb24obmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHMuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgIHJldHVybiBwcm94eTtcbiAgfTtcbiAgcHJveHkuX2dldEFjdGlvbkRpY3QgPSBmdW5jdGlvbihvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUpIHtcbiAgICB2YXIgYWN0aW9uID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV0gfHwgcy5hdHRyaWJ1dGVzW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lICsgJ1wiIGlzIG5vdCBhIHZhbGlkIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgJyArXG4gICAgICAgICduYW1lIGluIHRoaXMgc2VtYW50aWNzIGZvciBcIicgKyBncmFtbWFyLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gICAgcmV0dXJuIGFjdGlvbi5hY3Rpb25EaWN0O1xuICB9O1xuICBwcm94eS5fcmVtb3ZlID0gZnVuY3Rpb24ob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgdmFyIHNlbWFudGljO1xuICAgIGlmIChvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgaW4gcy5vcGVyYXRpb25zKSB7XG4gICAgICBzZW1hbnRpYyA9IHMub3BlcmF0aW9uc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgZGVsZXRlIHMub3BlcmF0aW9uc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lIGluIHMuYXR0cmlidXRlcykge1xuICAgICAgc2VtYW50aWMgPSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgIGRlbGV0ZSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICB9XG4gICAgZGVsZXRlIHMuV3JhcHBlci5wcm90b3R5cGVbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICByZXR1cm4gc2VtYW50aWM7XG4gIH07XG4gIHByb3h5LmdldE9wZXJhdGlvbk5hbWVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHMub3BlcmF0aW9ucyk7XG4gIH07XG4gIHByb3h5LmdldEF0dHJpYnV0ZU5hbWVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHMuYXR0cmlidXRlcyk7XG4gIH07XG4gIHByb3h5LmdldEdyYW1tYXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcy5ncmFtbWFyO1xuICB9O1xuICBwcm94eS50b1JlY2lwZSA9IGZ1bmN0aW9uKHNlbWFudGljc09ubHkpIHtcbiAgICByZXR1cm4gcy50b1JlY2lwZShzZW1hbnRpY3NPbmx5KTtcbiAgfTtcblxuICAvLyBNYWtlIHRoZSBwcm94eSdzIHRvU3RyaW5nKCkgd29yay5cbiAgcHJveHkudG9TdHJpbmcgPSBzLnRvU3RyaW5nLmJpbmQocyk7XG5cbiAgLy8gUmV0dXJucyB0aGUgc2VtYW50aWNzIGZvciB0aGUgcHJveHkuXG4gIHByb3h5Ll9nZXRTZW1hbnRpY3MgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gcztcbiAgfTtcblxuICByZXR1cm4gcHJveHk7XG59O1xuXG5TZW1hbnRpY3MuaW5pdEJ1aWx0SW5TZW1hbnRpY3MgPSBmdW5jdGlvbihidWlsdEluUnVsZXMpIHtcbiAgdmFyIGFjdGlvbnMgPSB7XG4gICAgZW1wdHk6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0aW9uKCk7XG4gICAgfSxcbiAgICBub25FbXB0eTogZnVuY3Rpb24oZmlyc3QsIF8sIHJlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLml0ZXJhdGlvbihbZmlyc3RdLmNvbmNhdChyZXN0LmNoaWxkcmVuKSk7XG4gICAgfVxuICB9O1xuXG4gIFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzID0gU2VtYW50aWNzXG4gICAgICAuY3JlYXRlU2VtYW50aWNzKGJ1aWx0SW5SdWxlcywgbnVsbClcbiAgICAgIC5hZGRPcGVyYXRpb24oJ2FzSXRlcmF0aW9uJywge1xuICAgICAgICBlbXB0eUxpc3RPZjogYWN0aW9ucy5lbXB0eSxcbiAgICAgICAgbm9uZW1wdHlMaXN0T2Y6IGFjdGlvbnMubm9uRW1wdHksXG4gICAgICAgIEVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBOb25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eVxuICAgICAgfSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBPcGVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQW4gT3BlcmF0aW9uIHJlcHJlc2VudHMgYSBmdW5jdGlvbiB0byBiZSBhcHBsaWVkIHRvIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgLS0gaXQncyB2ZXJ5XG4vLyBzaW1pbGFyIHRvIGEgVmlzaXRvciAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WaXNpdG9yX3BhdHRlcm4pLiBBbiBvcGVyYXRpb24gaXMgZXhlY3V0ZWQgYnlcbi8vIHJlY3Vyc2l2ZWx5IHdhbGtpbmcgdGhlIENTVCwgYW5kIGF0IGVhY2ggbm9kZSwgaW52b2tpbmcgdGhlIG1hdGNoaW5nIHNlbWFudGljIGFjdGlvbiBmcm9tXG4vLyBgYWN0aW9uRGljdGAuIFNlZSBgT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlYCBmb3IgZGV0YWlscyBvZiBob3cgYSBDU1Qgbm9kZSdzIG1hdGNoaW5nIHNlbWFudGljXG4vLyBhY3Rpb24gaXMgZm91bmQuXG5mdW5jdGlvbiBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgYWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5mb3JtYWxzID0gZm9ybWFscztcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbiAgdGhpcy5idWlsdEluRGVmYXVsdCA9IGJ1aWx0SW5EZWZhdWx0O1xufVxuXG5PcGVyYXRpb24ucHJvdG90eXBlLnR5cGVOYW1lID0gJ29wZXJhdGlvbic7XG5cbk9wZXJhdGlvbi5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0ID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICBncmFtbWFyLl9jaGVja1RvcERvd25BY3Rpb25EaWN0KHRoaXMudHlwZU5hbWUsIHRoaXMubmFtZSwgdGhpcy5hY3Rpb25EaWN0KTtcbn07XG5cbi8vIEV4ZWN1dGUgdGhpcyBvcGVyYXRpb24gb24gdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCBgbm9kZVdyYXBwZXJgIGluIHRoZSBjb250ZXh0IG9mIHRoZSBnaXZlblxuLy8gU2VtYW50aWNzIGluc3RhbmNlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAvLyBMb29rIGZvciBhIHNlbWFudGljIGFjdGlvbiB3aG9zZSBuYW1lIG1hdGNoZXMgdGhlIG5vZGUncyBjb25zdHJ1Y3RvciBuYW1lLCB3aGljaCBpcyBlaXRoZXIgdGhlXG4gIC8vIG5hbWUgb2YgYSBydWxlIGluIHRoZSBncmFtbWFyLCBvciAnX3Rlcm1pbmFsJyAoZm9yIGEgdGVybWluYWwgbm9kZSksIG9yICdfaXRlcicgKGZvciBhblxuICAvLyBpdGVyYXRpb24gbm9kZSkuIEluIHRoZSBsYXR0ZXIgY2FzZSwgdGhlIGFjdGlvbiBmdW5jdGlvbiByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudCwgd2hpY2ggaXNcbiAgLy8gYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBDU1Qgbm9kZS5cbiAgdmFyIGFjdGlvbkZuID0gdGhpcy5hY3Rpb25EaWN0W25vZGVXcmFwcGVyLl9ub2RlLmN0b3JOYW1lXTtcbiAgaWYgKGFjdGlvbkZuKSB7XG4gICAgcmV0dXJuIHRoaXMuZG9BY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG5vZGVXcmFwcGVyLmlzSXRlcmF0aW9uKCkpO1xuICB9XG5cbiAgLy8gVGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGRvZXMgbm90IGNvbnRhaW4gYSBzZW1hbnRpYyBhY3Rpb24gZm9yIHRoaXMgc3BlY2lmaWMgdHlwZSBvZiBub2RlLlxuICAvLyBJZiB0aGlzIGlzIGEgbm9udGVybWluYWwgbm9kZSBhbmQgdGhlIHByb2dyYW1tZXIgaGFzIHByb3ZpZGVkIGEgYF9ub250ZXJtaW5hbGAgc2VtYW50aWNcbiAgLy8gYWN0aW9uLCB3ZSBpbnZva2UgaXQ6XG4gIGlmIChub2RlV3JhcHBlci5pc05vbnRlcm1pbmFsKCkpIHtcbiAgICBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdC5fbm9udGVybWluYWw7XG4gICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25GbiwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlLCB3ZSBpbnZva2UgdGhlICdfZGVmYXVsdCcgc2VtYW50aWMgYWN0aW9uLlxuICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCB0aGlzLmFjdGlvbkRpY3QuX2RlZmF1bHQsIHRydWUpO1xufTtcblxuLy8gSW52b2tlIGBhY3Rpb25GbmAgb24gdGhlIENTVCBub2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gYG5vZGVXcmFwcGVyYCwgaW4gdGhlIGNvbnRleHQgb2Zcbi8vIGBzZW1hbnRpY3NgLiBJZiBgb3B0UGFzc0NoaWxkcmVuQXNBcnJheWAgaXMgdHJ1dGh5LCBgYWN0aW9uRm5gIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBzaW5nbGVcbi8vIGFyZ3VtZW50LCB3aGljaCBpcyBhbiBhcnJheSBvZiB3cmFwcGVycy4gT3RoZXJ3aXNlLCB0aGUgbnVtYmVyIG9mIGFyZ3VtZW50cyB0byBgYWN0aW9uRm5gIHdpbGxcbi8vIGJlIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhlIENTVCBub2RlLlxuT3BlcmF0aW9uLnByb3RvdHlwZS5kb0FjdGlvbiA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5KSB7XG4gIHJldHVybiBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5ID9cbiAgICAgIGFjdGlvbkZuLmNhbGwobm9kZVdyYXBwZXIsIG5vZGVXcmFwcGVyLl9jaGlsZHJlbigpKSA6XG4gICAgICBhY3Rpb25Gbi5hcHBseShub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEF0dHJpYnV0ZXMgYXJlIE9wZXJhdGlvbnMgd2hvc2UgcmVzdWx0cyBhcmUgbWVtb2l6ZWQuIFRoaXMgbWVhbnMgdGhhdCwgZm9yIGFueSBnaXZlbiBzZW1hbnRpY3MsXG4vLyB0aGUgc2VtYW50aWMgYWN0aW9uIGZvciBhIENTVCBub2RlIHdpbGwgYmUgaW52b2tlZCBubyBtb3JlIHRoYW4gb25jZS5cbmZ1bmN0aW9uIEF0dHJpYnV0ZShuYW1lLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmZvcm1hbHMgPSBbXTtcbiAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbiAgdGhpcy5idWlsdEluRGVmYXVsdCA9IGJ1aWx0SW5EZWZhdWx0O1xufVxuaW5oZXJpdHMoQXR0cmlidXRlLCBPcGVyYXRpb24pO1xuXG5BdHRyaWJ1dGUucHJvdG90eXBlLnR5cGVOYW1lID0gJ2F0dHJpYnV0ZSc7XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgdmFyIG5vZGUgPSBub2RlV3JhcHBlci5fbm9kZTtcbiAgdmFyIGtleSA9IHNlbWFudGljcy5hdHRyaWJ1dGVLZXlzW3RoaXMubmFtZV07XG4gIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBpcyBhIHN1cGVyLXNlbmQgLS0gaXNuJ3QgSlMgYmVhdXRpZnVsPyA6L1xuICAgIG5vZGVba2V5XSA9IE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMsIHNlbWFudGljcywgbm9kZVdyYXBwZXIpO1xuICB9XG4gIHJldHVybiBub2RlW2tleV07XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBTZW1hbnRpY3M7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGFyZSB1c2VkIGluIHRoZSBgdG9TdHJpbmdgIG91dHB1dC5cbnZhciBCQUxMT1RfWCA9ICdcXHUyNzE3JztcbnZhciBDSEVDS19NQVJLID0gJ1xcdTI3MTMnO1xudmFyIERPVF9PUEVSQVRPUiA9ICdcXHUyMkM1JztcbnZhciBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyA9ICdcXHUyMUQyJztcbnZhciBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTiA9ICdcXHUyNDA5JztcbnZhciBTWU1CT0xfRk9SX0xJTkVfRkVFRCA9ICdcXHUyNDBBJztcbnZhciBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTiA9ICdcXHUyNDBEJztcblxuZnVuY3Rpb24gc3BhY2VzKG4pIHtcbiAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBuKS5qb2luKCcnKTtcbn1cblxuLy8gUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcG9ydGlvbiBvZiBgaW5wdXRgIGF0IG9mZnNldCBgcG9zYC5cbi8vIFRoZSByZXN1bHQgd2lsbCBjb250YWluIGV4YWN0bHkgYGxlbmAgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIGdldElucHV0RXhjZXJwdChpbnB1dCwgcG9zLCBsZW4pIHtcbiAgdmFyIGV4Y2VycHQgPSBhc0VzY2FwZWRTdHJpbmcoaW5wdXQuc2xpY2UocG9zLCBwb3MgKyBsZW4pKTtcblxuICAvLyBQYWQgdGhlIG91dHB1dCBpZiBuZWNlc3NhcnkuXG4gIGlmIChleGNlcnB0Lmxlbmd0aCA8IGxlbikge1xuICAgIHJldHVybiBleGNlcnB0ICsgY29tbW9uLnJlcGVhdCgnICcsIGxlbiAtIGV4Y2VycHQubGVuZ3RoKS5qb2luKCcnKTtcbiAgfVxuICByZXR1cm4gZXhjZXJwdDtcbn1cblxuZnVuY3Rpb24gYXNFc2NhcGVkU3RyaW5nKG9iaikge1xuICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBSZXBsYWNlIG5vbi1wcmludGFibGUgY2hhcmFjdGVycyB3aXRoIHZpc2libGUgc3ltYm9scy5cbiAgICByZXR1cm4gb2JqXG4gICAgICAgIC5yZXBsYWNlKC8gL2csIERPVF9PUEVSQVRPUilcbiAgICAgICAgLnJlcGxhY2UoL1xcdC9nLCBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTilcbiAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBTWU1CT0xfRk9SX0xJTkVfRkVFRClcbiAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTik7XG4gIH1cbiAgcmV0dXJuIFN0cmluZyhvYmopO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBUcmFjZSAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBUcmFjZShpbnB1dCwgcG9zMSwgcG9zMiwgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncywgb3B0Q2hpbGRyZW4pIHtcbiAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICB0aGlzLnBvcyA9IHRoaXMucG9zMSA9IHBvczE7XG4gIHRoaXMucG9zMiA9IHBvczI7XG4gIHRoaXMuc291cmNlID0gbmV3IEludGVydmFsKGlucHV0LCBwb3MxLCBwb3MyKTtcbiAgdGhpcy5leHByID0gZXhwcjtcbiAgdGhpcy5zdWNjZWVkZWQgPSBzdWNjZWVkZWQ7XG4gIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgdGhpcy5jaGlsZHJlbiA9IG9wdENoaWxkcmVuIHx8IFtdO1xuXG4gIHRoaXMuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gZmFsc2U7ICAvLyBJcyB0aGlzIHRoZSBvdXRlcm1vc3QgTFIgYXBwbGljYXRpb24/XG4gIHRoaXMuaXNJbXBsaWNpdFNwYWNlcyA9IGZhbHNlO1xuICB0aGlzLmlzTWVtb2l6ZWQgPSBmYWxzZTtcbiAgdGhpcy5pc1Jvb3ROb2RlID0gZmFsc2U7XG4gIHRoaXMudGVybWluYXRlc0xSID0gZmFsc2U7XG4gIHRoaXMudGVybWluYXRpbmdMUkVudHJ5ID0gbnVsbDtcbn1cblxuLy8gQSB2YWx1ZSB0aGF0IGNhbiBiZSByZXR1cm5lZCBmcm9tIHZpc2l0b3IgZnVuY3Rpb25zIHRvIGluZGljYXRlIHRoYXQgYVxuLy8gbm9kZSBzaG91bGQgbm90IGJlIHJlY3Vyc2VkIGludG8uXG5UcmFjZS5wcm90b3R5cGUuU0tJUCA9IHt9O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhY2UucHJvdG90eXBlLCAnZGlzcGxheVN0cmluZycsIHtcbiAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuZXhwci50b0Rpc3BsYXlTdHJpbmcoKTsgfVxufSk7XG5cblRyYWNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jbG9uZVdpdGhFeHByKHRoaXMuZXhwcik7XG59O1xuXG5UcmFjZS5wcm90b3R5cGUuY2xvbmVXaXRoRXhwciA9IGZ1bmN0aW9uKGV4cHIpIHtcbiAgdmFyIGFucyA9IG5ldyBUcmFjZShcbiAgICAgIHRoaXMuaW5wdXQsIHRoaXMucG9zLCB0aGlzLnBvczIsIGV4cHIsIHRoaXMuc3VjY2VlZGVkLCB0aGlzLmJpbmRpbmdzLCB0aGlzLmNoaWxkcmVuKTtcblxuICBhbnMuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gdGhpcy5pc0hlYWRPZkxlZnRSZWN1cnNpb247XG4gIGFucy5pc0ltcGxpY2l0U3BhY2VzID0gdGhpcy5pc0ltcGxpY2l0U3BhY2VzO1xuICBhbnMuaXNNZW1vaXplZCA9IHRoaXMuaXNNZW1vaXplZDtcbiAgYW5zLmlzUm9vdE5vZGUgPSB0aGlzLmlzUm9vdE5vZGU7XG4gIGFucy50ZXJtaW5hdGVzTFIgPSB0aGlzLnRlcm1pbmF0ZXNMUjtcbiAgYW5zLnRlcm1pbmF0aW5nTFJFbnRyeSA9IHRoaXMudGVybWluYXRpbmdMUkVudHJ5O1xuICByZXR1cm4gYW5zO1xufTtcblxuLy8gUmVjb3JkIHRoZSB0cmFjZSBpbmZvcm1hdGlvbiBmb3IgdGhlIHRlcm1pbmF0aW5nIGNvbmRpdGlvbiBvZiB0aGUgTFIgbG9vcC5cblRyYWNlLnByb3RvdHlwZS5yZWNvcmRMUlRlcm1pbmF0aW9uID0gZnVuY3Rpb24ocnVsZUJvZHlUcmFjZSwgdmFsdWUpIHtcbiAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkgPVxuICAgICAgbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHRoaXMucG9zLCB0aGlzLnBvczIsIHRoaXMuZXhwciwgZmFsc2UsIFt2YWx1ZV0sIFtydWxlQm9keVRyYWNlXSk7XG4gIHRoaXMudGVybWluYXRpbmdMUkVudHJ5LnRlcm1pbmF0ZXNMUiA9IHRydWU7XG59O1xuXG4vLyBSZWN1cnNpdmVseSB0cmF2ZXJzZSB0aGlzIHRyYWNlIG5vZGUgYW5kIGFsbCBpdHMgZGVzY2VuZGVudHMsIGNhbGxpbmcgYSB2aXNpdG9yIGZ1bmN0aW9uXG4vLyBmb3IgZWFjaCBub2RlIHRoYXQgaXMgdmlzaXRlZC4gSWYgYHZpc3Rvck9iak9yRm5gIGlzIGFuIG9iamVjdCwgdGhlbiBpdHMgJ2VudGVyJyBwcm9wZXJ0eVxuLy8gaXMgYSBmdW5jdGlvbiB0byBjYWxsIGJlZm9yZSB2aXNpdGluZyB0aGUgY2hpbGRyZW4gb2YgYSBub2RlLCBhbmQgaXRzICdleGl0JyBwcm9wZXJ0eSBpc1xuLy8gYSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyd2FyZHMuIElmIGB2aXNpdG9yT2JqT3JGbmAgaXMgYSBmdW5jdGlvbiwgaXQgcmVwcmVzZW50cyB0aGUgJ2VudGVyJ1xuLy8gZnVuY3Rpb24uXG4vL1xuLy8gVGhlIGZ1bmN0aW9ucyBhcmUgY2FsbGVkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgVHJhY2Ugbm9kZSwgaXRzIHBhcmVudCBUcmFjZSwgYW5kIGEgbnVtYmVyXG4vLyByZXByZXNlbnRpbmcgdGhlIGRlcHRoIG9mIHRoZSBub2RlIGluIHRoZSB0cmVlLiAoVGhlIHJvb3Qgbm9kZSBoYXMgZGVwdGggMC4pIGBvcHRUaGlzQXJnYCwgaWZcbi8vIHNwZWNpZmllZCwgaXMgdGhlIHZhbHVlIHRvIHVzZSBmb3IgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIHRoZSB2aXNpdG9yIGZ1bmN0aW9ucy5cblRyYWNlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24odmlzaXRvck9iak9yRm4sIG9wdFRoaXNBcmcpIHtcbiAgdmFyIHZpc2l0b3IgPSB2aXNpdG9yT2JqT3JGbjtcbiAgaWYgKHR5cGVvZiB2aXNpdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmlzaXRvciA9IHtlbnRlcjogdmlzaXRvcn07XG4gIH1cblxuICBmdW5jdGlvbiBfd2Fsayhub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgdmFyIHJlY3Vyc2UgPSB0cnVlO1xuICAgIGlmICh2aXNpdG9yLmVudGVyKSB7XG4gICAgICBpZiAodmlzaXRvci5lbnRlci5jYWxsKG9wdFRoaXNBcmcsIG5vZGUsIHBhcmVudCwgZGVwdGgpID09PSBUcmFjZS5wcm90b3R5cGUuU0tJUCkge1xuICAgICAgICByZWN1cnNlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyZWN1cnNlKSB7XG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgX3dhbGsoY2hpbGQsIG5vZGUsIGRlcHRoICsgMSk7XG4gICAgICB9KTtcbiAgICAgIGlmICh2aXNpdG9yLmV4aXQpIHtcbiAgICAgICAgdmlzaXRvci5leGl0LmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGlmICh0aGlzLmlzUm9vdE5vZGUpIHtcbiAgICAvLyBEb24ndCB2aXNpdCB0aGUgcm9vdCBub2RlIGl0c2VsZiwgb25seSBpdHMgY2hpbGRyZW4uXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGMpIHsgX3dhbGsoYywgbnVsbCwgMCk7IH0pO1xuICB9IGVsc2Uge1xuICAgIF93YWxrKHRoaXMsIG51bGwsIDApO1xuICB9XG59O1xuXG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYWNlLlxuLy8gU2FtcGxlOlxuLy8gICAgIDEy4ouFK+KLhTLii4Uq4ouFMyDinJMgZXhwIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAg4pyTIGFkZEV4cCAoTFIpIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAgICAgIOKclyBhZGRFeHBfcGx1c1xuVHJhY2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gIHRoaXMud2FsayhmdW5jdGlvbihub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm4gdGhpcy5TS0lQO1xuICAgIH1cbiAgICB2YXIgY3Rvck5hbWUgPSBub2RlLmV4cHIuY29uc3RydWN0b3IubmFtZTtcbiAgICAvLyBEb24ndCBwcmludCBhbnl0aGluZyBmb3IgQWx0IG5vZGVzLlxuICAgIGlmIChjdG9yTmFtZSA9PT0gJ0FsdCcpIHtcbiAgICAgIHJldHVybjsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICB9XG4gICAgc2IuYXBwZW5kKGdldElucHV0RXhjZXJwdChub2RlLmlucHV0LCBub2RlLnBvcywgMTApICsgc3BhY2VzKGRlcHRoICogMiArIDEpKTtcbiAgICBzYi5hcHBlbmQoKG5vZGUuc3VjY2VlZGVkID8gQ0hFQ0tfTUFSSyA6IEJBTExPVF9YKSArICcgJyArIG5vZGUuZGlzcGxheVN0cmluZyk7XG4gICAgaWYgKG5vZGUuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICBzYi5hcHBlbmQoJyAoTFIpJyk7XG4gICAgfVxuICAgIGlmIChub2RlLnN1Y2NlZWRlZCkge1xuICAgICAgdmFyIGNvbnRlbnRzID0gYXNFc2NhcGVkU3RyaW5nKG5vZGUuc291cmNlLmNvbnRlbnRzKTtcbiAgICAgIHNiLmFwcGVuZCgnICcgKyBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyArICcgICcpO1xuICAgICAgc2IuYXBwZW5kKHR5cGVvZiBjb250ZW50cyA9PT0gJ3N0cmluZycgPyAnXCInICsgY29udGVudHMgKyAnXCInIDogY29udGVudHMpO1xuICAgIH1cbiAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICB9LmJpbmQodGhpcykpO1xuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBIZWxwZXJzXG5cbnZhciBlc2NhcGVTdHJpbmdGb3IgPSB7fTtcbmZvciAodmFyIGMgPSAwOyBjIDwgMTI4OyBjKyspIHtcbiAgZXNjYXBlU3RyaW5nRm9yW2NdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbn1cbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSA9IFwiXFxcXCdcIjtcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcIic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcZicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGYnO1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcdCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHQnO1xuZXNjYXBlU3RyaW5nRm9yWydcXHUwMDBiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdic7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24ob3B0TWV0aG9kTmFtZSkge1xuICB2YXIgbWV0aG9kTmFtZSA9IG9wdE1ldGhvZE5hbWUgfHwgJyc7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAndGhpcyBtZXRob2QgJyArIG1ldGhvZE5hbWUgKyAnIGlzIGFic3RyYWN0ISAnICtcbiAgICAgICcoaXQgaGFzIG5vIGltcGxlbWVudGF0aW9uIGluIGNsYXNzICcgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnKScpO1xuICB9O1xufTtcblxuZXhwb3J0cy5hc3NlcnQgPSBmdW5jdGlvbihjb25kLCBtZXNzYWdlKSB7XG4gIGlmICghY29uZCkge1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfVxufTtcblxuLy8gRGVmaW5lIGEgbGF6aWx5LWNvbXB1dGVkLCBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lZCBgcHJvcE5hbWVgXG4vLyBvbiB0aGUgb2JqZWN0IGBvYmpgLiBgZ2V0dGVyRm5gIHdpbGwgYmUgY2FsbGVkIHRvIGNvbXB1dGUgdGhlIHZhbHVlIHRoZVxuLy8gZmlyc3QgdGltZSB0aGUgcHJvcGVydHkgaXMgYWNjZXNzZWQuXG5leHBvcnRzLmRlZmluZUxhenlQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9iaiwgcHJvcE5hbWUsIGdldHRlckZuKSB7XG4gIHZhciBtZW1vO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIW1lbW8pIHtcbiAgICAgICAgbWVtbyA9IGdldHRlckZuLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWVtbztcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0cy5jbG9uZSA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqKSB7XG4gICAgcmV0dXJuIGV4dGVuZCh7fSwgb2JqKTtcbiAgfVxuICByZXR1cm4gb2JqO1xufTtcblxuZXhwb3J0cy5leHRlbmQgPSBleHRlbmQ7XG5cbmV4cG9ydHMucmVwZWF0Rm4gPSBmdW5jdGlvbihmbiwgbikge1xuICB2YXIgYXJyID0gW107XG4gIHdoaWxlIChuLS0gPiAwKSB7XG4gICAgYXJyLnB1c2goZm4oKSk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn07XG5cbmV4cG9ydHMucmVwZWF0U3RyID0gZnVuY3Rpb24oc3RyLCBuKSB7XG4gIHJldHVybiBuZXcgQXJyYXkobiArIDEpLmpvaW4oc3RyKTtcbn07XG5cbmV4cG9ydHMucmVwZWF0ID0gZnVuY3Rpb24oeCwgbikge1xuICByZXR1cm4gZXhwb3J0cy5yZXBlYXRGbihmdW5jdGlvbigpIHsgcmV0dXJuIHg7IH0sIG4pO1xufTtcblxuZXhwb3J0cy5nZXREdXBsaWNhdGVzID0gZnVuY3Rpb24oYXJyYXkpIHtcbiAgdmFyIGR1cGxpY2F0ZXMgPSBbXTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyYXkubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciB4ID0gYXJyYXlbaWR4XTtcbiAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKSB7XG4gICAgICBkdXBsaWNhdGVzLnB1c2goeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBkdXBsaWNhdGVzO1xufTtcblxuZXhwb3J0cy5jb3B5V2l0aG91dER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgbm9EdXBsaWNhdGVzID0gW107XG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHtcbiAgICBpZiAobm9EdXBsaWNhdGVzLmluZGV4T2YoZW50cnkpIDwgMCkge1xuICAgICAgbm9EdXBsaWNhdGVzLnB1c2goZW50cnkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBub0R1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmlzU3ludGFjdGljID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdmFyIGZpcnN0Q2hhciA9IHJ1bGVOYW1lWzBdO1xuICByZXR1cm4gZmlyc3RDaGFyID09PSBmaXJzdENoYXIudG9VcHBlckNhc2UoKTtcbn07XG5cbmV4cG9ydHMuaXNMZXhpY2FsID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgcmV0dXJuICFleHBvcnRzLmlzU3ludGFjdGljKHJ1bGVOYW1lKTtcbn07XG5cbmV4cG9ydHMucGFkTGVmdCA9IGZ1bmN0aW9uKHN0ciwgbGVuLCBvcHRDaGFyKSB7XG4gIHZhciBjaCA9IG9wdENoYXIgfHwgJyAnO1xuICBpZiAoc3RyLmxlbmd0aCA8IGxlbikge1xuICAgIHJldHVybiBleHBvcnRzLnJlcGVhdFN0cihjaCwgbGVuIC0gc3RyLmxlbmd0aCkgKyBzdHI7XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cbi8vIFN0cmluZ0J1ZmZlclxuXG5leHBvcnRzLlN0cmluZ0J1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnN0cmluZ3MgPSBbXTtcbn07XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihzdHIpIHtcbiAgdGhpcy5zdHJpbmdzLnB1c2goc3RyKTtcbn07XG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5jb250ZW50cyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5zdHJpbmdzLmpvaW4oJycpO1xufTtcblxuLy8gQ2hhcmFjdGVyIGVzY2FwaW5nIGFuZCB1bmVzY2FwaW5nXG5cbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKGMsIG9wdERlbGltKSB7XG4gIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKTtcbiAgaWYgKChjID09PSAnXCInIHx8IGMgPT09IFwiJ1wiKSAmJiBvcHREZWxpbSAmJiBjICE9PSBvcHREZWxpbSkge1xuICAgIHJldHVybiBjO1xuICB9IGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KSB7XG4gICAgcmV0dXJuIGVzY2FwZVN0cmluZ0ZvcltjaGFyQ29kZV07XG4gIH0gZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KSB7XG4gICAgcmV0dXJuICdcXFxceCcgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyLCAnMCcpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnXFxcXHUnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNCwgJzAnKTtcbiAgfVxufTtcblxuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbihzKSB7XG4gIGlmIChzLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG4gICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgY2FzZSAnYic6IHJldHVybiAnXFxiJztcbiAgICAgIGNhc2UgJ2YnOiByZXR1cm4gJ1xcZic7XG4gICAgICBjYXNlICduJzogcmV0dXJuICdcXG4nO1xuICAgICAgY2FzZSAncic6IHJldHVybiAnXFxyJztcbiAgICAgIGNhc2UgJ3QnOiByZXR1cm4gJ1xcdCc7XG4gICAgICBjYXNlICd2JzogcmV0dXJuICdcXHYnO1xuICAgICAgY2FzZSAneCc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpO1xuICAgICAgY2FzZSAndSc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDYpLCAxNikpO1xuICAgICAgZGVmYXVsdDogcmV0dXJuIHMuY2hhckF0KDEpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufTtcblxuLy8gSGVscGVyIGZvciBwcm9kdWNpbmcgYSBkZXNjcmlwdGlvbiBvZiBhbiB1bmtub3duIG9iamVjdCBpbiBhIHNhZmUgd2F5LlxuLy8gRXNwZWNpYWxseSB1c2VmdWwgZm9yIGVycm9yIG1lc3NhZ2VzIHdoZXJlIGFuIHVuZXhwZWN0ZWQgdHlwZSBvZiBvYmplY3Qgd2FzIGVuY291bnRlcmVkLlxuZXhwb3J0cy51bmV4cGVjdGVkT2JqVG9TdHJpbmcgPSBmdW5jdGlvbihvYmopIHtcbiAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIFN0cmluZyhvYmopO1xuICB9XG4gIHZhciBiYXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgdHJ5IHtcbiAgICB2YXIgdHlwZU5hbWU7XG4gICAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgdHlwZU5hbWUgPSBvYmouY29uc3RydWN0b3IubmFtZTtcbiAgICB9IGVsc2UgaWYgKGJhc2VUb1N0cmluZy5pbmRleE9mKCdbb2JqZWN0ICcpID09PSAwKSB7XG4gICAgICB0eXBlTmFtZSA9IGJhc2VUb1N0cmluZy5zbGljZSg4LCAtMSk7ICAvLyBFeHRyYWN0IGUuZy4gXCJBcnJheVwiIGZyb20gXCJbb2JqZWN0IEFycmF5XVwiLlxuICAgIH0gZWxzZSB7XG4gICAgICB0eXBlTmFtZSA9IHR5cGVvZiBvYmo7XG4gICAgfVxuICAgIHJldHVybiB0eXBlTmFtZSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShTdHJpbmcob2JqKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gYmFzZVRvU3RyaW5nO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBjcmVhdGVFcnJvcihtZXNzYWdlLCBvcHRJbnRlcnZhbCkge1xuICB2YXIgZTtcbiAgaWYgKG9wdEludGVydmFsKSB7XG4gICAgZSA9IG5ldyBFcnJvcihvcHRJbnRlcnZhbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSgpICsgbWVzc2FnZSk7XG4gICAgZS5zaG9ydE1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIGUuaW50ZXJ2YWwgPSBvcHRJbnRlcnZhbDtcbiAgfSBlbHNlIHtcbiAgICBlID0gbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG4gIHJldHVybiBlO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgaW50ZXJ2YWxzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGludGVydmFsU291cmNlc0RvbnRNYXRjaCgpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFwiSW50ZXJ2YWwgc291cmNlcyBkb24ndCBtYXRjaFwiKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGdyYW1tYXJzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdyYW1tYXIgc3ludGF4IGVycm9yXG5cbmZ1bmN0aW9uIGdyYW1tYXJTeW50YXhFcnJvcihtYXRjaEZhaWx1cmUpIHtcbiAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsICdtZXNzYWdlJywge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiBtYXRjaEZhaWx1cmUubWVzc2FnZTsgfX0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ3Nob3J0TWVzc2FnZScsIHtnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnRXhwZWN0ZWQgJyArIG1hdGNoRmFpbHVyZS5nZXRFeHBlY3RlZFRleHQoKTtcbiAgfX0pO1xuICBlLmludGVydmFsID0gbWF0Y2hGYWlsdXJlLmdldEludGVydmFsKCk7XG4gIHJldHVybiBlO1xufVxuXG4vLyBVbmRlY2xhcmVkIGdyYW1tYXJcblxuZnVuY3Rpb24gdW5kZWNsYXJlZEdyYW1tYXIoZ3JhbW1hck5hbWUsIG5hbWVzcGFjZSwgaW50ZXJ2YWwpIHtcbiAgdmFyIG1lc3NhZ2UgPSBuYW1lc3BhY2UgP1xuICAgICAgJ0dyYW1tYXIgJyArIGdyYW1tYXJOYW1lICsgJyBpcyBub3QgZGVjbGFyZWQgaW4gbmFtZXNwYWNlICcgKyBOYW1lc3BhY2UudG9TdHJpbmcobmFtZXNwYWNlKSA6XG4gICAgICAnVW5kZWNsYXJlZCBncmFtbWFyICcgKyBncmFtbWFyTmFtZTtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGludGVydmFsKTtcbn1cblxuLy8gRHVwbGljYXRlIGdyYW1tYXIgZGVjbGFyYXRpb25cblxuZnVuY3Rpb24gZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGdyYW1tYXIsIG5hbWVzcGFjZSkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoJ0dyYW1tYXIgJyArIGdyYW1tYXIubmFtZSArICcgaXMgYWxyZWFkeSBkZWNsYXJlZCBpbiB0aGlzIG5hbWVzcGFjZScpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBydWxlcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBVbmRlY2xhcmVkIHJ1bGVcblxuZnVuY3Rpb24gdW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBvcHRJbnRlcnZhbCkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnUnVsZSAnICsgcnVsZU5hbWUgKyAnIGlzIG5vdCBkZWNsYXJlZCBpbiBncmFtbWFyICcgKyBncmFtbWFyTmFtZSxcbiAgICAgIG9wdEludGVydmFsKTtcbn1cblxuLy8gQ2Fubm90IG92ZXJyaWRlIHVuZGVjbGFyZWQgcnVsZVxuXG5mdW5jdGlvbiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdDYW5ub3Qgb3ZlcnJpZGUgcnVsZSAnICsgcnVsZU5hbWUgKyAnIGJlY2F1c2UgaXQgaXMgbm90IGRlY2xhcmVkIGluICcgKyBncmFtbWFyTmFtZSxcbiAgICAgIG9wdFNvdXJjZSk7XG59XG5cbi8vIENhbm5vdCBleHRlbmQgdW5kZWNsYXJlZCBydWxlXG5cbmZ1bmN0aW9uIGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdDYW5ub3QgZXh0ZW5kIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgZ3JhbW1hck5hbWUsXG4gICAgICBvcHRTb3VyY2UpO1xufVxuXG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuXG5mdW5jdGlvbiBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24ocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBkZWNsR3JhbW1hck5hbWUsIG9wdFNvdXJjZSkge1xuICB2YXIgbWVzc2FnZSA9IFwiRHVwbGljYXRlIGRlY2xhcmF0aW9uIGZvciBydWxlICdcIiArIHJ1bGVOYW1lICtcbiAgICAgIFwiJyBpbiBncmFtbWFyICdcIiArIGdyYW1tYXJOYW1lICsgXCInXCI7XG4gIGlmIChncmFtbWFyTmFtZSAhPT0gZGVjbEdyYW1tYXJOYW1lKSB7XG4gICAgbWVzc2FnZSArPSBcIiAob3JpZ2luYWxseSBkZWNsYXJlZCBpbiAnXCIgKyBkZWNsR3JhbW1hck5hbWUgKyBcIicpXCI7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdFNvdXJjZSk7XG59XG5cbi8vIFdyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzXG5cbmZ1bmN0aW9uIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBzb3VyY2UpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ1dyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzIGZvciBydWxlICcgKyBydWxlTmFtZSArXG4gICAgICAgICAgJyAoZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwgKyAnKScsXG4gICAgICBzb3VyY2UpO1xufVxuXG4vLyBXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXG5cbmZ1bmN0aW9uIHdyb25nTnVtYmVyT2ZBcmd1bWVudHMocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ1dyb25nIG51bWJlciBvZiBhcmd1bWVudHMgZm9yIHJ1bGUgJyArIHJ1bGVOYW1lICtcbiAgICAgICAgICAnIChleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCArICcpJyxcbiAgICAgIGV4cHIuc291cmNlKTtcbn1cblxuLy8gRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lc1xuXG5mdW5jdGlvbiBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhydWxlTmFtZSwgZHVwbGljYXRlcywgc291cmNlKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzIGluIHJ1bGUgJyArIHJ1bGVOYW1lICsgJzogJyArIGR1cGxpY2F0ZXMuam9pbignLCAnKSxcbiAgICAgIHNvdXJjZSk7XG59XG5cbi8vIEludmFsaWQgcGFyYW1ldGVyIGV4cHJlc3Npb25cblxuZnVuY3Rpb24gaW52YWxpZFBhcmFtZXRlcihydWxlTmFtZSwgZXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnSW52YWxpZCBwYXJhbWV0ZXIgdG8gcnVsZSAnICsgcnVsZU5hbWUgKyAnOiAnICsgZXhwciArICcgaGFzIGFyaXR5ICcgKyBleHByLmdldEFyaXR5KCkgK1xuICAgICAgICAgJywgYnV0IHBhcmFtZXRlciBleHByZXNzaW9ucyBtdXN0IGhhdmUgYXJpdHkgMScsXG4gICAgICBleHByLnNvdXJjZSk7XG59XG5cbi8vIEFwcGxpY2F0aW9uIG9mIHN5bnRhY3RpYyBydWxlIGZyb20gbGV4aWNhbCBydWxlXG5cbmZ1bmN0aW9uIGFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0KHJ1bGVOYW1lLCBhcHBseUV4cHIpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0Nhbm5vdCBhcHBseSBzeW50YWN0aWMgcnVsZSAnICsgcnVsZU5hbWUgKyAnIGZyb20gaGVyZSAoaW5zaWRlIGEgbGV4aWNhbCBjb250ZXh0KScsXG4gICAgICBhcHBseUV4cHIuc291cmNlKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gS2xlZW5lIG9wZXJhdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKGtsZWVuZUV4cHIpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ051bGxhYmxlIGV4cHJlc3Npb24gJyArIGtsZWVuZUV4cHIuZXhwci5zb3VyY2UuY29udGVudHMgKyBcIiBpcyBub3QgYWxsb3dlZCBpbnNpZGUgJ1wiICtcbiAgICAgICAgICBrbGVlbmVFeHByLm9wZXJhdG9yICsgXCInIChwb3NzaWJsZSBpbmZpbml0ZSBsb29wKVwiLFxuICAgICAga2xlZW5lRXhwci5leHByLnNvdXJjZSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGFyaXR5IC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBleHByKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdSdWxlICcgKyBydWxlTmFtZSArICcgaW52b2x2ZXMgYW4gYWx0ZXJuYXRpb24gd2hpY2ggaGFzIGluY29uc2lzdGVudCBhcml0eSAnICtcbiAgICAgICAgICAnKGV4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsICsgJyknLFxuICAgICAgZXhwci5zb3VyY2UpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGR1cGxpY2F0ZVByb3BlcnR5TmFtZXMoZHVwbGljYXRlcykge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoJ09iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJykpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBjb25zdHJ1Y3RvcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW52YWxpZENvbnN0cnVjdG9yQ2FsbChncmFtbWFyLCBjdG9yTmFtZSwgY2hpbGRyZW4pIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0F0dGVtcHQgdG8gaW52b2tlIGNvbnN0cnVjdG9yICcgKyBjdG9yTmFtZSArICcgd2l0aCBpbnZhbGlkIG9yIHVuZXhwZWN0ZWQgYXJndW1lbnRzJyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnZlbmllbmNlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG11bHRpcGxlRXJyb3JzKGVycm9ycykge1xuICB2YXIgbWVzc2FnZXMgPSBlcnJvcnMubWFwKGZ1bmN0aW9uKGUpIHsgcmV0dXJuIGUubWVzc2FnZTsgfSk7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgIFsnRXJyb3JzOiddLmNvbmNhdChtZXNzYWdlcykuam9pbignXFxuLSAnKSxcbiAgICAgIGVycm9yc1swXS5pbnRlcnZhbCk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHNlbWFudGljIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIG1pc3NpbmdTZW1hbnRpY0FjdGlvbihjdG9yTmFtZSwgbmFtZSwgdHlwZSkge1xuICB2YXIgZSA9IGNyZWF0ZUVycm9yKFxuICAgICAgJ01pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvciAnICsgY3Rvck5hbWUgKyAnIGluICcgKyBuYW1lICsgJyAnICsgdHlwZSk7XG4gIGUubmFtZSA9ICdtaXNzaW5nU2VtYW50aWNBY3Rpb24nO1xuICByZXR1cm4gZTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dDogYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQsXG4gIGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlOiBjYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZSxcbiAgY2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZTogY2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZSxcbiAgZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uOiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24sXG4gIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzOiBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyxcbiAgZHVwbGljYXRlUHJvcGVydHlOYW1lczogZHVwbGljYXRlUHJvcGVydHlOYW1lcyxcbiAgZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uOiBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24sXG4gIGluY29uc2lzdGVudEFyaXR5OiBpbmNvbnNpc3RlbnRBcml0eSxcbiAgaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoOiBpbnRlcnZhbFNvdXJjZXNEb250TWF0Y2gsXG4gIGludmFsaWRDb25zdHJ1Y3RvckNhbGw6IGludmFsaWRDb25zdHJ1Y3RvckNhbGwsXG4gIGludmFsaWRQYXJhbWV0ZXI6IGludmFsaWRQYXJhbWV0ZXIsXG4gIGdyYW1tYXJTeW50YXhFcnJvcjogZ3JhbW1hclN5bnRheEVycm9yLFxuICBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kOiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kLFxuICBtaXNzaW5nU2VtYW50aWNBY3Rpb246IG1pc3NpbmdTZW1hbnRpY0FjdGlvbixcbiAgdW5kZWNsYXJlZEdyYW1tYXI6IHVuZGVjbGFyZWRHcmFtbWFyLFxuICB1bmRlY2xhcmVkUnVsZTogdW5kZWNsYXJlZFJ1bGUsXG4gIHdyb25nTnVtYmVyT2ZBcmd1bWVudHM6IHdyb25nTnVtYmVyT2ZBcmd1bWVudHMsXG4gIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzOiB3cm9uZ051bWJlck9mUGFyYW1ldGVycyxcblxuICB0aHJvd0Vycm9yczogZnVuY3Rpb24oZXJyb3JzKSB7XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHRocm93IGVycm9yc1swXTtcbiAgICB9XG4gICAgaWYgKGVycm9ycy5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBtdWx0aXBsZUVycm9ycyhlcnJvcnMpO1xuICAgIH1cbiAgfVxufTtcbiIsIi8qIGdsb2JhbCBkb2N1bWVudCwgWE1MSHR0cFJlcXVlc3QgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXInKTtcbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVGhlIG1ldGFncmFtbWFyLCBpLmUuIHRoZSBncmFtbWFyIGZvciBPaG0gZ3JhbW1hcnMuIEluaXRpYWxpemVkIGF0IHRoZVxuLy8gYm90dG9tIG9mIHRoaXMgZmlsZSBiZWNhdXNlIGxvYWRpbmcgdGhlIGdyYW1tYXIgcmVxdWlyZXMgT2htIGl0c2VsZi5cbnZhciBvaG1HcmFtbWFyO1xuXG4vLyBBbiBvYmplY3Qgd2hpY2ggbWFrZXMgaXQgcG9zc2libGUgdG8gc3R1YiBvdXQgdGhlIGRvY3VtZW50IEFQSSBmb3IgdGVzdGluZy5cbnZhciBkb2N1bWVudEludGVyZmFjZSA9IHtcbiAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24oc2VsKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7IH0sXG4gIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uKHNlbCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpOyB9XG59O1xuXG4vLyBDaGVjayBpZiBgb2JqYCBpcyBhIERPTSBlbGVtZW50LlxuZnVuY3Rpb24gaXNFbGVtZW50KG9iaikge1xuICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICByZXR1cm4gb2JqID09PSB2b2lkIDA7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXZvaWRcbn1cblxudmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gIHJldHVybiB0eXBlb2YgbGVuZ3RoID09PSAnbnVtYmVyJyAmJiBsZW5ndGggPj0gMCAmJiBsZW5ndGggPD0gTUFYX0FSUkFZX0lOREVYO1xufVxuXG4vLyBUT0RPOiBqdXN0IHVzZSB0aGUgalF1ZXJ5IHRoaW5nXG5mdW5jdGlvbiBsb2FkKHVybCkge1xuICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcS5vcGVuKCdHRVQnLCB1cmwsIGZhbHNlKTtcbiAgdHJ5IHtcbiAgICByZXEuc2VuZCgpO1xuICAgIGlmIChyZXEuc3RhdHVzID09PSAwIHx8IHJlcS5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgcmV0dXJuIHJlcS5yZXNwb25zZVRleHQ7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7fVxuICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBsb2FkIHVybCAnICsgdXJsKTtcbn1cblxuLy8gUmV0dXJucyBhIEdyYW1tYXIgaW5zdGFuY2UgKGkuZS4sIGFuIG9iamVjdCB3aXRoIGEgYG1hdGNoYCBtZXRob2QpIGZvclxuLy8gYHRyZWVgLCB3aGljaCBpcyB0aGUgY29uY3JldGUgc3ludGF4IHRyZWUgb2YgYSB1c2VyLXdyaXR0ZW4gZ3JhbW1hci5cbi8vIFRoZSBncmFtbWFyIHdpbGwgYmUgYXNzaWduZWQgaW50byBgbmFtZXNwYWNlYCB1bmRlciB0aGUgbmFtZSBvZiB0aGUgZ3JhbW1hclxuLy8gYXMgc3BlY2lmaWVkIGluIHRoZSBzb3VyY2UuXG5mdW5jdGlvbiBidWlsZEdyYW1tYXIobWF0Y2gsIG5hbWVzcGFjZSwgb3B0T2htR3JhbW1hckZvclRlc3RpbmcpIHtcbiAgdmFyIGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuICB2YXIgZGVjbDtcbiAgdmFyIGN1cnJlbnRSdWxlTmFtZTtcbiAgdmFyIGN1cnJlbnRSdWxlRm9ybWFscztcbiAgdmFyIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgdmFyIG1ldGFHcmFtbWFyID0gb3B0T2htR3JhbW1hckZvclRlc3RpbmcgfHwgb2htR3JhbW1hcjtcblxuICAvLyBBIHZpc2l0b3IgdGhhdCBwcm9kdWNlcyBhIEdyYW1tYXIgaW5zdGFuY2UgZnJvbSB0aGUgQ1NULlxuICB2YXIgaGVscGVycyA9IG1ldGFHcmFtbWFyLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndmlzaXQnLCB7XG4gICAgR3JhbW1hcjogZnVuY3Rpb24obiwgcywgb3BlbiwgcnMsIGNsb3NlKSB7XG4gICAgICB2YXIgZ3JhbW1hck5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBkZWNsID0gYnVpbGRlci5uZXdHcmFtbWFyKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgcy52aXNpdCgpO1xuICAgICAgcnMudmlzaXQoKTtcbiAgICAgIHZhciBnID0gZGVjbC5idWlsZCgpO1xuICAgICAgZy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltbWVkKCk7XG4gICAgICBpZiAoZ3JhbW1hck5hbWUgaW4gbmFtZXNwYWNlKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZywgbmFtZXNwYWNlKTtcbiAgICAgIH1cbiAgICAgIG5hbWVzcGFjZVtncmFtbWFyTmFtZV0gPSBnO1xuICAgICAgcmV0dXJuIGc7XG4gICAgfSxcblxuICAgIFN1cGVyR3JhbW1hcjogZnVuY3Rpb24oXywgbikge1xuICAgICAgdmFyIHN1cGVyR3JhbW1hck5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBpZiAoc3VwZXJHcmFtbWFyTmFtZSA9PT0gJ251bGwnKSB7XG4gICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghbmFtZXNwYWNlIHx8ICEoc3VwZXJHcmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRHcmFtbWFyKHN1cGVyR3JhbW1hck5hbWUsIG5hbWVzcGFjZSwgbi5zb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihuYW1lc3BhY2Vbc3VwZXJHcmFtbWFyTmFtZV0pO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBSdWxlX2RlZmluZTogZnVuY3Rpb24obiwgZnMsIGQsIF8sIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLnZpc2l0KClbMF0gfHwgW107XG4gICAgICAvLyBJZiB0aGVyZSBpcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUgeWV0LCBzZXQgaXQgbm93LiBUaGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgdmlzaXRpbmdcbiAgICAgIC8vIHRoZSBib2R5LCBiZWNhdXNlIGl0IG1pZ2h0IGNvbnRhaW4gYW4gaW5saW5lIHJ1bGUgZGVmaW5pdGlvbi5cbiAgICAgIGlmICghZGVjbC5kZWZhdWx0U3RhcnRSdWxlICYmIGRlY2wuZW5zdXJlU3VwZXJHcmFtbWFyKCkgIT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMpIHtcbiAgICAgICAgZGVjbC53aXRoRGVmYXVsdFN0YXJ0UnVsZShjdXJyZW50UnVsZU5hbWUpO1xuICAgICAgfVxuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICB2YXIgZGVzY3JpcHRpb24gPSBkLnZpc2l0KClbMF07XG4gICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgcmV0dXJuIGRlY2wuZGVmaW5lKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKTtcbiAgICB9LFxuICAgIFJ1bGVfb3ZlcnJpZGU6IGZ1bmN0aW9uKG4sIGZzLCBfLCBiKSB7XG4gICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy52aXNpdCgpWzBdIHx8IFtdO1xuICAgICAgb3ZlcnJpZGluZyA9IHRydWU7XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltbWVkKCk7XG4gICAgICB2YXIgYW5zID0gZGVjbC5vdmVycmlkZShjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBSdWxlX2V4dGVuZDogZnVuY3Rpb24obiwgZnMsIF8sIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLnZpc2l0KClbMF0gfHwgW107XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltbWVkKCk7XG4gICAgICB2YXIgYW5zID0gZGVjbC5leHRlbmQoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgUnVsZUJvZHk6IGZ1bmN0aW9uKF8sIHRlcm1zKSB7XG4gICAgICB2YXIgYXJncyA9IHRlcm1zLnZpc2l0KCk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hbHQuYXBwbHkoYnVpbGRlciwgYXJncykud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIEZvcm1hbHM6IGZ1bmN0aW9uKG9wb2ludHksIGZzLCBjcG9pbnR5KSB7XG4gICAgICByZXR1cm4gZnMudmlzaXQoKTtcbiAgICB9LFxuXG4gICAgUGFyYW1zOiBmdW5jdGlvbihvcG9pbnR5LCBwcywgY3BvaW50eSkge1xuICAgICAgcmV0dXJuIHBzLnZpc2l0KCk7XG4gICAgfSxcblxuICAgIEFsdDogZnVuY3Rpb24oc2Vxcykge1xuICAgICAgdmFyIGFyZ3MgPSBzZXFzLnZpc2l0KCk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hbHQuYXBwbHkoYnVpbGRlciwgYXJncykud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIFRvcExldmVsVGVybV9pbmxpbmU6IGZ1bmN0aW9uKGIsIG4pIHtcbiAgICAgIHZhciBpbmxpbmVSdWxlTmFtZSA9IGN1cnJlbnRSdWxlTmFtZSArICdfJyArIG4udmlzaXQoKTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgIHZhciBpc05ld1J1bGVEZWNsYXJhdGlvbiA9XG4gICAgICAgICAgIShkZWNsLnN1cGVyR3JhbW1hciAmJiBkZWNsLnN1cGVyR3JhbW1hci5ydWxlc1tpbmxpbmVSdWxlTmFtZV0pO1xuICAgICAgaWYgKG92ZXJyaWRpbmcgJiYgIWlzTmV3UnVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgIGRlY2wub3ZlcnJpZGUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlY2wuZGVmaW5lKGlubGluZVJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICB9XG4gICAgICB2YXIgcGFyYW1zID0gY3VycmVudFJ1bGVGb3JtYWxzLm1hcChmdW5jdGlvbihmb3JtYWwpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGZvcm1hbCk7IH0pO1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKGlubGluZVJ1bGVOYW1lLCBwYXJhbXMpLndpdGhTb3VyY2UoYm9keS5zb3VyY2UpO1xuICAgIH0sXG5cbiAgICBTZXE6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnNlcS5hcHBseShidWlsZGVyLCBleHByLnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG5cbiAgICBJdGVyX3N0YXI6IGZ1bmN0aW9uKHgsIF8pIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnN0YXIoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuICAgIEl0ZXJfcGx1czogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIucGx1cyh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG4gICAgSXRlcl9vcHQ6IGZ1bmN0aW9uKHgsIF8pIHtcbiAgICAgIHJldHVybiBidWlsZGVyLm9wdCh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG5cbiAgICBQcmVkX25vdDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubm90KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcbiAgICBQcmVkX2xvb2thaGVhZDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubG9va2FoZWFkKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIExleF9sZXg6IGZ1bmN0aW9uKF8sIHgpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLmxleCh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG5cbiAgICBCYXNlX2FwcGxpY2F0aW9uOiBmdW5jdGlvbihydWxlLCBwcykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKHJ1bGUudmlzaXQoKSwgcHMudmlzaXQoKVswXSB8fCBbXSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcbiAgICBCYXNlX3JhbmdlOiBmdW5jdGlvbihmcm9tLCBfLCB0bykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIucmFuZ2UoZnJvbS52aXNpdCgpLCB0by52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuICAgIEJhc2VfdGVybWluYWw6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAgIHJldHVybiBidWlsZGVyLnRlcm1pbmFsKGV4cHIudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcbiAgICBCYXNlX3BhcmVuOiBmdW5jdGlvbihvcGVuLCB4LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIHgudmlzaXQoKTtcbiAgICB9LFxuXG4gICAgcnVsZURlc2NyOiBmdW5jdGlvbihvcGVuLCB0LCBjbG9zZSkge1xuICAgICAgcmV0dXJuIHQudmlzaXQoKTtcbiAgICB9LFxuICAgIHJ1bGVEZXNjclRleHQ6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZy50cmltKCk7XG4gICAgfSxcblxuICAgIGNhc2VOYW1lOiBmdW5jdGlvbihfLCBzcGFjZTEsIG4sIHNwYWNlMiwgZW5kKSB7XG4gICAgICByZXR1cm4gbi52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBuYW1lOiBmdW5jdGlvbihmaXJzdCwgcmVzdCkge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgIH0sXG4gICAgbmFtZUZpcnN0OiBmdW5jdGlvbihleHByKSB7fSxcbiAgICBuYW1lUmVzdDogZnVuY3Rpb24oZXhwcikge30sXG5cbiAgICB0ZXJtaW5hbDogZnVuY3Rpb24ob3BlbiwgY3MsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gY3MudmlzaXQoKS5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gY29tbW9uLnVuZXNjYXBlQ2hhcihjKTsgfSkuam9pbignJyk7XG4gICAgfSxcblxuICAgIHRlcm1pbmFsQ2hhcjogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgIH0sXG5cbiAgICBlc2NhcGVDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgfSxcblxuICAgIE5vbmVtcHR5TGlzdE9mOiBmdW5jdGlvbih4LCBfLCB4cykge1xuICAgICAgcmV0dXJuIFt4LnZpc2l0KCldLmNvbmNhdCh4cy52aXNpdCgpKTtcbiAgICB9LFxuICAgIEVtcHR5TGlzdE9mOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9LFxuXG4gICAgX3Rlcm1pbmFsOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnByaW1pdGl2ZVZhbHVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBoZWxwZXJzKG1hdGNoKS52aXNpdCgpO1xufVxuXG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5hbWVzcGFjZSkge1xuICB2YXIgbSA9IG9obUdyYW1tYXIubWF0Y2goc291cmNlLCAnR3JhbW1hcnMnKTtcbiAgaWYgKG0uZmFpbGVkKCkpIHtcbiAgICB0aHJvdyBlcnJvcnMuZ3JhbW1hclN5bnRheEVycm9yKG0pO1xuICB9XG4gIHJldHVybiBidWlsZEdyYW1tYXIobSwgbmFtZXNwYWNlKTtcbn1cblxuLy8gUmV0dXJuIHRoZSBjb250ZW50cyBvZiBhIHNjcmlwdCBlbGVtZW50LCBmZXRjaGluZyBpdCB2aWEgWEhSIGlmIG5lY2Vzc2FyeS5cbmZ1bmN0aW9uIGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhlbCkge1xuICBpZiAoIWlzRWxlbWVudChlbCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIERPTSBOb2RlLCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoZWwpKTtcbiAgfVxuICBpZiAoZWwudHlwZSAhPT0gJ3RleHQvb2htLWpzJykge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzY3JpcHQgdGFnIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIsIGdvdCAnICsgZWwpO1xuICB9XG4gIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpID8gbG9hZChlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSA6IGVsLmlubmVySFRNTDtcbn1cblxuZnVuY3Rpb24gZ3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICB2YXIgbnMgPSBncmFtbWFycyhzb3VyY2UsIG9wdE5hbWVzcGFjZSk7XG5cbiAgLy8gRW5zdXJlIHRoYXQgdGhlIHNvdXJjZSBjb250YWluZWQgbm8gbW9yZSB0aGFuIG9uZSBncmFtbWFyIGRlZmluaXRpb24uXG4gIHZhciBncmFtbWFyTmFtZXMgPSBPYmplY3Qua2V5cyhucyk7XG4gIGlmIChncmFtbWFyTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGdyYW1tYXIgZGVmaW5pdGlvbicpO1xuICB9IGVsc2UgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIHNlY29uZEdyYW1tYXIgPSBuc1tncmFtbWFyTmFtZXNbMV1dO1xuICAgIHZhciBpbnRlcnZhbCA9IHNlY29uZEdyYW1tYXIuc291cmNlO1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZShpbnRlcnZhbC5zb3VyY2VTdHJpbmcsIGludGVydmFsLnN0YXJ0SWR4KSArXG4gICAgICAgICdGb3VuZCBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbiAtLSB1c2Ugb2htLmdyYW1tYXJzKCkgaW5zdGVhZC4nKTtcbiAgfVxuICByZXR1cm4gbnNbZ3JhbW1hck5hbWVzWzBdXTsgIC8vIFJldHVybiB0aGUgb25lIGFuZCBvbmx5IGdyYW1tYXIuXG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBucyA9IE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLmFzTmFtZXNwYWNlKG9wdE5hbWVzcGFjZSkpO1xuICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAvLyBGb3IgY29udmVuaWVuY2UsIGRldGVjdCBOb2RlLmpzIEJ1ZmZlciBvYmplY3RzIGFuZCBhdXRvbWF0aWNhbGx5IGNhbGwgdG9TdHJpbmcoKS5cbiAgICBpZiAoaXNCdWZmZXIoc291cmNlKSkge1xuICAgICAgc291cmNlID0gc291cmNlLnRvU3RyaW5nKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgJ0V4cGVjdGVkIHN0cmluZyBhcyBmaXJzdCBhcmd1bWVudCwgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKHNvdXJjZSkpO1xuICAgIH1cbiAgfVxuICBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5zKTtcbiAgcmV0dXJuIG5zO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQob3B0Tm9kZSkge1xuICB2YXIgbm9kZSA9IG9wdE5vZGU7XG4gIGlmIChpc1VuZGVmaW5lZChub2RlKSkge1xuICAgIHZhciBub2RlTGlzdCA9IGRvY3VtZW50SW50ZXJmYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9vaG0tanNcIl0nKTtcbiAgICBpZiAobm9kZUxpc3QubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0V4cGVjdGVkIGV4YWN0bHkgb25lIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZm91bmQgJyArIG5vZGVMaXN0Lmxlbmd0aCk7XG4gICAgfVxuICAgIG5vZGUgPSBub2RlTGlzdFswXTtcbiAgfVxuICByZXR1cm4gZ3JhbW1hcihnZXRTY3JpcHRFbGVtZW50Q29udGVudHMobm9kZSkpO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50cyhvcHROb2RlT3JOb2RlTGlzdCkge1xuICAvLyBTaW1wbGUgY2FzZTogdGhlIGFyZ3VtZW50IGlzIGEgRE9NIG5vZGUuXG4gIGlmIChpc0VsZW1lbnQob3B0Tm9kZU9yTm9kZUxpc3QpKSB7XG4gICAgcmV0dXJuIGdyYW1tYXJzKG9wdE5vZGVPck5vZGVMaXN0KTtcbiAgfVxuICAvLyBPdGhlcndpc2UsIGl0IG11c3QgYmUgZWl0aGVyIHVuZGVmaW5lZCBvciBhIE5vZGVMaXN0LlxuICB2YXIgbm9kZUxpc3QgPSBvcHROb2RlT3JOb2RlTGlzdDtcbiAgaWYgKGlzVW5kZWZpbmVkKG5vZGVMaXN0KSkge1xuICAgIC8vIEZpbmQgYWxsIHNjcmlwdCBlbGVtZW50cyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLlxuICAgIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBub2RlTGlzdCA9PT0gJ3N0cmluZycgfHwgKCFpc0VsZW1lbnQobm9kZUxpc3QpICYmICFpc0FycmF5TGlrZShub2RlTGlzdCkpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBOb2RlLCBOb2RlTGlzdCwgb3IgQXJyYXksIGJ1dCBnb3QgJyArIG5vZGVMaXN0KTtcbiAgfVxuICB2YXIgbnMgPSBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlKCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBDb3B5IHRoZSBuZXcgZ3JhbW1hcnMgaW50byBgbnNgIHRvIGtlZXAgdGhlIG5hbWVzcGFjZSBmbGF0LlxuICAgIGNvbW1vbi5leHRlbmQobnMsIGdyYW1tYXJzKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlTGlzdFtpXSksIG5zKSk7XG4gIH1cbiAgcmV0dXJuIG5zO1xufVxuXG5mdW5jdGlvbiBtYWtlUmVjaXBlKHJlY2lwZSkge1xuICBpZiAodHlwZW9mIHJlY2lwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiByZWNpcGUuY2FsbChuZXcgQnVpbGRlcigpKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIHJlY2lwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIHN0cmluZ2lmaWVkIEpTT04gcmVjaXBlXG4gICAgICByZWNpcGUgPSBKU09OLnBhcnNlKHJlY2lwZSk7XG4gICAgfVxuICAgIHJldHVybiAobmV3IEJ1aWxkZXIoKSkuZnJvbVJlY2lwZShyZWNpcGUpO1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY3JlYXRlTmFtZXNwYWNlOiBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlLFxuICBncmFtbWFyOiBncmFtbWFyLFxuICBncmFtbWFyczogZ3JhbW1hcnMsXG4gIGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudDogZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50LFxuICBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50czogZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMsXG4gIG1ha2VSZWNpcGU6IG1ha2VSZWNpcGUsXG4gIG9obUdyYW1tYXI6IG51bGwsICAvLyBJbml0aWFsaXplZCBiZWxvdywgYWZ0ZXIgR3JhbW1hci5CdWlsdEluUnVsZXMuXG4gIHBleHByczogcGV4cHJzLFxuICB1dGlsOiB1dGlsLFxuICBleHRyYXM6IHJlcXVpcmUoJy4uL2V4dHJhcycpXG59O1xuXG4vLyBTdHVmZiBmb3IgdGVzdGluZywgZXRjLlxubW9kdWxlLmV4cG9ydHMuX2J1aWxkR3JhbW1hciA9IGJ1aWxkR3JhbW1hcjtcbm1vZHVsZS5leHBvcnRzLl9zZXREb2N1bWVudEludGVyZmFjZUZvclRlc3RpbmcgPSBmdW5jdGlvbihkb2MpIHsgZG9jdW1lbnRJbnRlcmZhY2UgPSBkb2M7IH07XG5cbi8vIExhdGUgaW5pdGlhbGl6YXRpb24gZm9yIHN0dWZmIHRoYXQgaXMgYm9vdHN0cmFwcGVkLlxuXG5HcmFtbWFyLkJ1aWx0SW5SdWxlcyA9IHJlcXVpcmUoJy4uL2Rpc3QvYnVpbHQtaW4tcnVsZXMnKTtcblxudmFyIFNlbWFudGljcyA9IHJlcXVpcmUoJy4vU2VtYW50aWNzJyk7XG52YXIgb3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzJyk7XG5TZW1hbnRpY3MuaW5pdEJ1aWx0SW5TZW1hbnRpY3MoR3JhbW1hci5CdWlsdEluUnVsZXMpO1xuU2VtYW50aWNzLmluaXRQcm90b3R5cGVQYXJzZXIob3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyKTsgIC8vIHJlcXVpcmVzIEJ1aWx0SW5TZW1hbnRpY3NcblxubW9kdWxlLmV4cG9ydHMub2htR3JhbW1hciA9IG9obUdyYW1tYXIgPSByZXF1aXJlKCcuLi9kaXN0L29obS1ncmFtbWFyJyk7XG5HcmFtbWFyLmluaXRBcHBsaWNhdGlvblBhcnNlcihvaG1HcmFtbWFyLCBidWlsZEdyYW1tYXIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIG1hdGNoTGVuZ3RoKSB7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuY3Rvck5hbWUgPSBjdG9yTmFtZTtcbiAgdGhpcy5tYXRjaExlbmd0aCA9IG1hdGNoTGVuZ3RoO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5udW1DaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbiA/IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIDogMDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQXQgPSBmdW5jdGlvbihpZHgpIHtcbiAgaWYgKHRoaXMuY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpZHhdO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pbmRleE9mQ2hpbGQgPSBmdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhcmcpO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubnVtQ2hpbGRyZW4oKSA+IDE7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5oYXNOb0NoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5oYXNDaGlsZHJlbigpO1xufTtcblxuTm9kZS5wcm90b3R5cGUub25seUNoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLm51bUNoaWxkcmVuKCkgIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IG9ubHkgY2hpbGQgb2YgYSBub2RlIG9mIHR5cGUgJyArIHRoaXMuY3Rvck5hbWUgK1xuICAgICAgICAnIChpdCBoYXMgJyArIHRoaXMubnVtQ2hpbGRyZW4oKSArICcgY2hpbGRyZW4pJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuZmlyc3RDaGlsZCgpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5maXJzdENoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2Nhbm5vdCBnZXQgZmlyc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdCgwKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUubGFzdENoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2Nhbm5vdCBnZXQgbGFzdCBjaGlsZCBvZiBhICcgKyB0aGlzLmN0b3JOYW1lICsgJyBub2RlLCB3aGljaCBoYXMgbm8gY2hpbGRyZW4nKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KHRoaXMubnVtQ2hpbGRyZW4oKSAtIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEJlZm9yZSA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEJlZm9yZSgpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gIH0gZWxzZSBpZiAoY2hpbGRJZHggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgY2hpbGQgYmVmb3JlIGZpcnN0IGNoaWxkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCAtIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEFmdGVyID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgdmFyIGNoaWxkSWR4ID0gdGhpcy5pbmRleE9mQ2hpbGQoY2hpbGQpO1xuICBpZiAoY2hpbGRJZHggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmNoaWxkQWZ0ZXIoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICB9IGVsc2UgaWYgKGNoaWxkSWR4ID09PSB0aGlzLm51bUNoaWxkcmVuKCkgLSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGFmdGVyIGxhc3QgY2hpbGQnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4ICsgMSk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgciA9IHt9O1xuICByW3RoaXMuY3Rvck5hbWVdID0gdGhpcy5jaGlsZHJlbjtcbiAgcmV0dXJuIHI7XG59O1xuXG4vLyBUZXJtaW5hbHNcblxuZnVuY3Rpb24gVGVybWluYWxOb2RlKGdyYW1tYXIsIHZhbHVlKSB7XG4gIHZhciBtYXRjaExlbmd0aCA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsICdfdGVybWluYWwnLCBtYXRjaExlbmd0aCk7XG4gIHRoaXMucHJpbWl0aXZlVmFsdWUgPSB2YWx1ZTtcbn1cbmluaGVyaXRzKFRlcm1pbmFsTm9kZSwgTm9kZSk7XG5cblRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cblRlcm1pbmFsTm9kZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24oKSB7XG4gIHZhciByID0ge307XG4gIHJbdGhpcy5jdG9yTmFtZV0gPSB0aGlzLnByaW1pdGl2ZVZhbHVlO1xuICByZXR1cm4gcjtcbn07XG5cbi8vIE5vbnRlcm1pbmFsc1xuXG5mdW5jdGlvbiBOb250ZXJtaW5hbE5vZGUoZ3JhbW1hciwgcnVsZU5hbWUsIGNoaWxkcmVuLCBjaGlsZE9mZnNldHMsIG1hdGNoTGVuZ3RoKSB7XG4gIE5vZGUuY2FsbCh0aGlzLCBncmFtbWFyLCBydWxlTmFtZSwgbWF0Y2hMZW5ndGgpO1xuICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gIHRoaXMuY2hpbGRPZmZzZXRzID0gY2hpbGRPZmZzZXRzO1xufVxuaW5oZXJpdHMoTm9udGVybWluYWxOb2RlLCBOb2RlKTtcblxuTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc0xleGljYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGNvbW1vbi5pc0xleGljYWwodGhpcy5jdG9yTmFtZSk7XG59O1xuXG5Ob250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5jdG9yTmFtZSk7XG59O1xuXG4vLyBJdGVyYXRpb25zXG5cbmZ1bmN0aW9uIEl0ZXJhdGlvbk5vZGUoZ3JhbW1hciwgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgsIGlzT3B0aW9uYWwpIHtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsICdfaXRlcicsIG1hdGNoTGVuZ3RoKTtcbiAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICB0aGlzLmNoaWxkT2Zmc2V0cyA9IGNoaWxkT2Zmc2V0cztcbiAgdGhpcy5vcHRpb25hbCA9IGlzT3B0aW9uYWw7XG59XG5pbmhlcml0cyhJdGVyYXRpb25Ob2RlLCBOb2RlKTtcblxuSXRlcmF0aW9uTm9kZS5wcm90b3R5cGUuaXNJdGVyYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5JdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLm9wdGlvbmFsO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBOb2RlOiBOb2RlLFxuICBUZXJtaW5hbE5vZGU6IFRlcm1pbmFsTm9kZSxcbiAgTm9udGVybWluYWxOb2RlOiBOb250ZXJtaW5hbE5vZGUsXG4gIEl0ZXJhdGlvbk5vZGU6IEl0ZXJhdGlvbk5vZGVcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgUmV0dXJuIHRydWUgaWYgd2Ugc2hvdWxkIHNraXAgc3BhY2VzIHByZWNlZGluZyB0aGlzIGV4cHJlc3Npb24gaW4gYSBzeW50YWN0aWMgY29udGV4dC5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPSBjb21tb24uYWJzdHJhY3QoXG4gICdhbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlJ1xuKTtcblxuLypcbiAgR2VuZXJhbGx5LCB0aGVzZSBhcmUgYWxsIGZpcnN0LW9yZGVyIGV4cHJlc3Npb25zIGFuZCAod2l0aCB0aGUgZXhjZXB0aW9uIG9mIEFwcGx5KVxuICBkaXJlY3RseSByZWFkIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiovXG5wZXhwcnMuYW55LmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLmVuZC5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qXG4gIEhpZ2hlci1vcmRlciBleHByZXNzaW9ucyB0aGF0IGRvbid0IGRpcmVjdGx5IGNvbnN1bWUgaW5wdXQuXG4qL1xucGV4cHJzLkFsdC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLlNlcS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGxleGlmeUNvdW50O1xuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgbGV4aWZ5Q291bnQgPSAwO1xuICB0aGlzLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG59O1xuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGNvbW1vbi5hYnN0cmFjdChcbiAgJ19hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCdcbik7XG5cbnBleHBycy5hbnkuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5lbmQuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGxleGlmeUNvdW50Kys7XG4gIHRoaXMuZXhwci5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICBsZXhpZnlDb3VudC0tO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gIHZhciBydWxlSW5mbyA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV07XG5cbiAgLy8gTWFrZSBzdXJlIHRoYXQgdGhlIHJ1bGUgZXhpc3RzLi4uXG4gIGlmICghcnVsZUluZm8pIHtcbiAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZFJ1bGUodGhpcy5ydWxlTmFtZSwgZ3JhbW1hci5uYW1lLCB0aGlzLnNvdXJjZSk7XG4gIH1cblxuICAvLyAuLi5hbmQgdGhhdCB0aGlzIGFwcGxpY2F0aW9uIGlzIGFsbG93ZWRcbiAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSAmJiAoIWNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkgfHwgbGV4aWZ5Q291bnQgPiAwKSkge1xuICAgIHRocm93IGVycm9ycy5hcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCh0aGlzLnJ1bGVOYW1lLCB0aGlzKTtcbiAgfVxuXG4gIC8vIC4uLmFuZCB0aGF0IHRoaXMgYXBwbGljYXRpb24gaGFzIHRoZSBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHNcbiAgdmFyIGFjdHVhbCA9IHRoaXMuYXJncy5sZW5ndGg7XG4gIHZhciBleHBlY3RlZCA9IHJ1bGVJbmZvLmZvcm1hbHMubGVuZ3RoO1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mQXJndW1lbnRzKHRoaXMucnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHRoaXMuc291cmNlKTtcbiAgfVxuXG4gIC8vIC4uLmFuZCB0aGF0IGFsbCBvZiB0aGUgYXJndW1lbnQgZXhwcmVzc2lvbnMgb25seSBoYXZlIHZhbGlkIGFwcGxpY2F0aW9ucyBhbmQgaGF2ZSBhcml0eSAxLlxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuYXJncy5mb3JFYWNoKGZ1bmN0aW9uKGFyZykge1xuICAgIGFyZy5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgIGlmIChhcmcuZ2V0QXJpdHkoKSAhPT0gMSkge1xuICAgICAgdGhyb3cgZXJyb3JzLmludmFsaWRQYXJhbWV0ZXIoc2VsZi5ydWxlTmFtZSwgYXJnKTtcbiAgICB9XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBjb21tb24uYWJzdHJhY3QoXG4gICdhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSdcbik7XG5cbnBleHBycy5hbnkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLmVuZC5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3Bcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBhcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2lkeF07XG4gICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSgpO1xuICAgIHZhciBvdGhlckFyaXR5ID0gdGVybS5nZXRBcml0eSgpO1xuICAgIGlmIChhcml0eSAhPT0gb3RoZXJBcml0eSkge1xuICAgICAgdGhyb3cgZXJyb3JzLmluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBhcml0eSwgb3RoZXJBcml0eSwgdGVybSk7XG4gICAgfVxuICB9XG59O1xuXG5wZXhwcnMuRXh0ZW5kLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIEV4dGVuZCBpcyBhIHNwZWNpYWwgY2FzZSBvZiBBbHQgdGhhdCdzIGd1YXJhbnRlZWQgdG8gaGF2ZSBleGFjdGx5IHR3b1xuICAvLyBjYXNlczogW2V4dGVuc2lvbnMsIG9yaWdCb2R5XS5cbiAgdmFyIGFjdHVhbEFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICB2YXIgZXhwZWN0ZWRBcml0eSA9IHRoaXMudGVybXNbMV0uZ2V0QXJpdHkoKTtcbiAgaWYgKGFjdHVhbEFyaXR5ICE9PSBleHBlY3RlZEFyaXR5KSB7XG4gICAgdGhyb3cgZXJyb3JzLmluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBleHBlY3RlZEFyaXR5LCBhY3R1YWxBcml0eSwgdGhpcy50ZXJtc1swXSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wIChub3QgcmVxdWlyZWQgYi9jIHRoZSBuZXN0ZWQgZXhwciBkb2Vzbid0IHNob3cgdXAgaW4gdGhlIENTVClcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBUaGUgYXJpdGllcyBvZiB0aGUgcGFyYW1ldGVyIGV4cHJlc3Npb25zIGlzIHJlcXVpcmVkIHRvIGJlIDEgYnlcbiAgLy8gYGFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKClgLlxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gY29tbW9uLmFic3RyYWN0KFxuICAnYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJ1xuKTtcblxucGV4cHJzLmFueS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLmVuZC5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIC8vIE5vdGU6IHRoaXMgaXMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGZvciBgU3RhcmAgYW5kIGBQbHVzYCBleHByZXNzaW9ucy5cbiAgLy8gSXQgaXMgb3ZlcnJpZGRlbiBmb3IgYE9wdGAgYmVsb3cuXG4gIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICBpZiAodGhpcy5leHByLmlzTnVsbGFibGUoZ3JhbW1hcikpIHtcbiAgICB0aHJvdyBlcnJvcnMua2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCh0aGlzLCBydWxlTmFtZSk7XG4gIH1cbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5MZXgucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcpIHtcbiAgICBhcmcuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuY2hlY2sgPSBjb21tb24uYWJzdHJhY3QoJ2NoZWNrJyk7XG5cbnBleHBycy5hbnkuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzLmxlbmd0aCA+PSAxO1xufTtcblxucGV4cHJzLmVuZC5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdW5kZWZpbmVkO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdGhpcy5vYmo7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB0eXBlb2YgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdHlwZW9mIHRoaXMuZnJvbTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzLmxlbmd0aCA+PSAxO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50ZXJtcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpXTtcbiAgICBpZiAodGVybS5jaGVjayhncmFtbWFyLCB2YWxzKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgcG9zID0gMDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2ldO1xuICAgIGlmIChmYWN0b3IuY2hlY2soZ3JhbW1hciwgdmFscy5zbGljZShwb3MpKSkge1xuICAgICAgcG9zICs9IGZhY3Rvci5nZXRBcml0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIHZhciBjb2x1bW5zID0gdmFscy5zbGljZSgwLCBhcml0eSk7XG4gIGlmIChjb2x1bW5zLmxlbmd0aCAhPT0gYXJpdHkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHJvd0NvdW50ID0gY29sdW1uc1swXS5sZW5ndGg7XG4gIHZhciBpO1xuICBmb3IgKGkgPSAxOyBpIDwgYXJpdHk7IGkrKykge1xuICAgIGlmIChjb2x1bW5zW2ldLmxlbmd0aCAhPT0gcm93Q291bnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgcm93Q291bnQ7IGkrKykge1xuICAgIHZhciByb3cgPSBbXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFyaXR5OyBqKyspIHtcbiAgICAgIHJvdy5wdXNoKGNvbHVtbnNbal1baV0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuZXhwci5jaGVjayhncmFtbWFyLCByb3cpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5jaGVjayA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5jaGVjayhncmFtbWFyLCB2YWxzKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIGlmICghKHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgIHZhbHNbMF0uZ3JhbW1hciA9PT0gZ3JhbW1hciAmJlxuICAgICAgICB2YWxzWzBdLmN0b3JOYW1lID09PSB0aGlzLnJ1bGVOYW1lKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vIFRPRE86IHRoaW5rIGFib3V0ICpub3QqIGRvaW5nIHRoZSBmb2xsb3dpbmcgY2hlY2tzLCBpLmUuLCB0cnVzdGluZyB0aGF0IHRoZSBydWxlXG4gIC8vIHdhcyBjb3JyZWN0bHkgY29uc3RydWN0ZWQuXG4gIHZhciBydWxlTm9kZSA9IHZhbHNbMF07XG4gIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXS5ib2R5O1xuICByZXR1cm4gYm9keS5jaGVjayhncmFtbWFyLCBydWxlTm9kZS5jaGlsZHJlbikgJiYgcnVsZU5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gYm9keS5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgICB2YWxzWzBdLmlzVGVybWluYWwoKSAmJlxuICAgICAgICAgdHlwZW9mIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09ICdzdHJpbmcnO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIG5vZGVzID0gcmVxdWlyZSgnLi9ub2RlcycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbnZhciBUZXJtaW5hbE5vZGUgPSBub2Rlcy5UZXJtaW5hbE5vZGU7XG52YXIgTm9udGVybWluYWxOb2RlID0gbm9kZXMuTm9udGVybWluYWxOb2RlO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSBub2Rlcy5JdGVyYXRpb25Ob2RlO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgRXZhbHVhdGUgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZHMsIGBmYWxzZWAgb3RoZXJ3aXNlLiBUaGlzIG1ldGhvZCBzaG91bGRcbiAgb25seSBiZSBjYWxsZWQgZGlyZWN0bHkgYnkgYFN0YXRlLnByb3RvdHlwZS5ldmFsKGV4cHIpYCwgd2hpY2ggYWxzbyB1cGRhdGVzIHRoZSBkYXRhIHN0cnVjdHVyZXNcbiAgdGhhdCBhcmUgdXNlZCBmb3IgdHJhY2luZy4gKE1ha2luZyB0aG9zZSB1cGRhdGVzIGluIGEgbWV0aG9kIG9mIGBTdGF0ZWAgZW5hYmxlcyB0aGUgdHJhY2Utc3BlY2lmaWNcbiAgZGF0YSBzdHJ1Y3R1cmVzIHRvIGJlIFwic2VjcmV0c1wiIG9mIHRoYXQgY2xhc3MsIHdoaWNoIGlzIGdvb2QgZm9yIG1vZHVsYXJpdHkuKVxuXG4gIFRoZSBjb250cmFjdCBvZiB0aGlzIG1ldGhvZCBpcyBhcyBmb2xsb3dzOlxuICAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBgdHJ1ZWAsXG4gICAgLSB0aGUgc3RhdGUgb2JqZWN0IHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGJpbmRpbmdzIHRoYW4gaXQgZGlkIGJlZm9yZSB0aGUgY2FsbC5cbiAgKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgYGZhbHNlYCxcbiAgICAtIHRoZSBzdGF0ZSBvYmplY3QgbWF5IGhhdmUgbW9yZSBiaW5kaW5ncyB0aGFuIGl0IGRpZCBiZWZvcmUgdGhlIGNhbGwsIGFuZFxuICAgIC0gaXRzIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heSBiZSBhbnl3aGVyZS5cblxuICBOb3RlIHRoYXQgYFN0YXRlLnByb3RvdHlwZS5ldmFsKGV4cHIpYCwgdW5saWtlIHRoaXMgbWV0aG9kLCBndWFyYW50ZWVzIHRoYXQgbmVpdGhlciB0aGUgc3RhdGVcbiAgb2JqZWN0J3MgYmluZGluZ3Mgbm9yIGl0cyBpbnB1dCBzdHJlYW0ncyBwb3NpdGlvbiB3aWxsIGNoYW5nZSBpZiB0aGUgZXhwcmVzc2lvbiBmYWlscyB0byBtYXRjaC5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmV2YWwgPSBjb21tb24uYWJzdHJhY3QoJ2V2YWwnKTsgIC8vIGZ1bmN0aW9uKHN0YXRlKSB7IC4uLiB9XG5cbnBleHBycy5hbnkuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAoY2gpIHtcbiAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuZW5kLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmIChpbnB1dFN0cmVhbS5hdEVuZCgpKSB7XG4gICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB1bmRlZmluZWQpLCBvcmlnUG9zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgaWYgKCFpbnB1dFN0cmVhbS5tYXRjaFN0cmluZyh0aGlzLm9iaikpIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLm9iaiksIG9yaWdQb3MpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBjaCA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgaWYgKGNoICYmIHRoaXMuZnJvbSA8PSBjaCAmJiBjaCA8PSB0aGlzLnRvKSB7XG4gICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBjaCksIG9yaWdQb3MpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgcmV0dXJuIHN0YXRlLmV2YWwoc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLmluZGV4XSk7XG59O1xuXG5wZXhwcnMuTGV4LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgc3RhdGUuZW50ZXJMZXhpZmllZENvbnRleHQoKTtcbiAgdmFyIGFucyA9IHN0YXRlLmV2YWwodGhpcy5leHByKTtcbiAgc3RhdGUuZXhpdExleGlmaWVkQ29udGV4dCgpO1xuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgIGlmIChzdGF0ZS5ldmFsKHRoaXMudGVybXNbaWR4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgaWYgKCFzdGF0ZS5ldmFsKGZhY3RvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICB2YXIgY29scyA9IFtdO1xuICB2YXIgY29sT2Zmc2V0cyA9IFtdO1xuICB3aGlsZSAoY29scy5sZW5ndGggPCBhcml0eSkge1xuICAgIGNvbHMucHVzaChbXSk7XG4gICAgY29sT2Zmc2V0cy5wdXNoKFtdKTtcbiAgfVxuXG4gIHZhciBudW1NYXRjaGVzID0gMDtcbiAgdmFyIGlkeDtcbiAgd2hpbGUgKG51bU1hdGNoZXMgPCB0aGlzLm1heE51bU1hdGNoZXMgJiYgc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgbnVtTWF0Y2hlcysrO1xuICAgIHZhciByb3cgPSBzdGF0ZS5fYmluZGluZ3Muc3BsaWNlKHN0YXRlLl9iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIHZhciByb3dPZmZzZXRzID0gc3RhdGUuX2JpbmRpbmdPZmZzZXRzLnNwbGljZShzdGF0ZS5fYmluZGluZ09mZnNldHMubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHJvdy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBjb2xzW2lkeF0ucHVzaChyb3dbaWR4XSk7XG4gICAgICBjb2xPZmZzZXRzW2lkeF0ucHVzaChyb3dPZmZzZXRzW2lkeF0pO1xuICAgIH1cbiAgfVxuICBpZiAobnVtTWF0Y2hlcyA8IHRoaXMubWluTnVtTWF0Y2hlcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgc3RhcnRJZHggPSBvcmlnUG9zO1xuICB2YXIgbWF0Y2hMZW5ndGggPSAwO1xuICBpZiAobnVtTWF0Y2hlcyA+IDApIHtcbiAgICB2YXIgbGFzdENvbCA9IGNvbHNbYXJpdHkgLSAxXTtcbiAgICB2YXIgbGFzdENvbE9mZnNldHMgPSBjb2xPZmZzZXRzW2FyaXR5IC0gMV07XG5cbiAgICB2YXIgZW5kSWR4ID1cbiAgICAgICAgbGFzdENvbE9mZnNldHNbbGFzdENvbE9mZnNldHMubGVuZ3RoIC0gMV0gKyBsYXN0Q29sW2xhc3RDb2wubGVuZ3RoIC0gMV0ubWF0Y2hMZW5ndGg7XG4gICAgc3RhcnRJZHggPSBjb2xPZmZzZXRzWzBdWzBdO1xuICAgIG1hdGNoTGVuZ3RoID0gZW5kSWR4IC0gc3RhcnRJZHg7XG4gIH1cbiAgdmFyIGlzT3B0aW9uYWwgPSB0aGlzIGluc3RhbmNlb2YgcGV4cHJzLk9wdDtcbiAgZm9yIChpZHggPSAwOyBpZHggPCBjb2xzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBzdGF0ZS5fYmluZGluZ3MucHVzaChcbiAgICAgICAgbmV3IEl0ZXJhdGlvbk5vZGUoc3RhdGUuZ3JhbW1hciwgY29sc1tpZHhdLCBjb2xPZmZzZXRzW2lkeF0sIG1hdGNoTGVuZ3RoLCBpc09wdGlvbmFsKSk7XG4gICAgc3RhdGUuX2JpbmRpbmdPZmZzZXRzLnB1c2goc3RhdGUucG9zVG9PZmZzZXQoc3RhcnRJZHgpKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICAvKlxuICAgIFRPRE86XG4gICAgLSBSaWdodCBub3cgd2UncmUganVzdCB0aHJvd2luZyBhd2F5IGFsbCBvZiB0aGUgZmFpbHVyZXMgdGhhdCBoYXBwZW4gaW5zaWRlIGEgYG5vdGAsIGFuZFxuICAgICAgcmVjb3JkaW5nIGB0aGlzYCBhcyBhIGZhaWxlZCBleHByZXNzaW9uLlxuICAgIC0gRG91YmxlIG5lZ2F0aW9uIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvIGxvb2thaGVhZCwgYnV0IHRoYXQncyBub3QgdGhlIGNhc2UgcmlnaHQgbm93IHdydFxuICAgICAgZmFpbHVyZXMuIEUuZy4sIH5+J2ZvbycgcHJvZHVjZXMgYSBmYWlsdXJlIGZvciB+fidmb28nLCBidXQgbWF5YmUgaXQgc2hvdWxkIHByb2R1Y2VcbiAgICAgIGEgZmFpbHVyZSBmb3IgJ2ZvbycgaW5zdGVhZC5cbiAgKi9cblxuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHN0YXRlLnB1c2hGYWlsdXJlc0luZm8oKTtcblxuICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpO1xuXG4gIHN0YXRlLnBvcEZhaWx1cmVzSW5mbygpO1xuICBpZiAoYW5zKSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAoc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBjYWxsZXIgPSBzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgdmFyIGFjdHVhbHMgPSBjYWxsZXIgPyBjYWxsZXIuYXJncyA6IFtdO1xuICB2YXIgYXBwID0gdGhpcy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpO1xuXG4gIHZhciBwb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgaWYgKHBvc0luZm8uaXNBY3RpdmUoYXBwKSkge1xuICAgIC8vIFRoaXMgcnVsZSBpcyBhbHJlYWR5IGFjdGl2ZSBhdCB0aGlzIHBvc2l0aW9uLCBpLmUuLCBpdCBpcyBsZWZ0LXJlY3Vyc2l2ZS5cbiAgICByZXR1cm4gYXBwLmhhbmRsZUN5Y2xlKHN0YXRlKTtcbiAgfVxuXG4gIHZhciBtZW1vS2V5ID0gYXBwLnRvTWVtb0tleSgpO1xuICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcblxuICBpZiAobWVtb1JlYyAmJiBwb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpKSB7XG4gICAgaWYgKHN0YXRlLmhhc05lY2Vzc2FyeUluZm8obWVtb1JlYykpIHtcbiAgICAgIHJldHVybiBzdGF0ZS51c2VNZW1vaXplZFJlc3VsdChzdGF0ZS5pbnB1dFN0cmVhbS5wb3MsIG1lbW9SZWMpO1xuICAgIH1cbiAgICBkZWxldGUgcG9zSW5mby5tZW1vW21lbW9LZXldO1xuICB9XG4gIHJldHVybiBhcHAucmVhbGx5RXZhbChzdGF0ZSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUN5Y2xlID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIHBvc0luZm8gPSBzdGF0ZS5nZXRDdXJyZW50UG9zSW5mbygpO1xuICB2YXIgY3VycmVudExlZnRSZWN1cnNpb24gPSBwb3NJbmZvLmN1cnJlbnRMZWZ0UmVjdXJzaW9uO1xuICB2YXIgbWVtb0tleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gIHZhciBtZW1vUmVjID0gcG9zSW5mby5tZW1vW21lbW9LZXldO1xuXG4gIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbiAmJiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXkpIHtcbiAgICAvLyBXZSBhbHJlYWR5IGtub3cgYWJvdXQgdGhpcyBsZWZ0IHJlY3Vyc2lvbiwgYnV0IGl0J3MgcG9zc2libGUgdGhlcmUgYXJlIFwiaW52b2x2ZWRcbiAgICAvLyBhcHBsaWNhdGlvbnNcIiB0aGF0IHdlIGRvbid0IGFscmVhZHkga25vdyBhYm91dCwgc28uLi5cbiAgICBtZW1vUmVjLnVwZGF0ZUludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cygpO1xuICB9IGVsc2UgaWYgKCFtZW1vUmVjKSB7XG4gICAgLy8gTmV3IGxlZnQgcmVjdXJzaW9uIGRldGVjdGVkISBNZW1vaXplIGEgZmFpbHVyZSB0byB0cnkgdG8gZ2V0IGEgc2VlZCBwYXJzZS5cbiAgICBtZW1vUmVjID0gcG9zSW5mby5tZW1vaXplKFxuICAgICAgICBtZW1vS2V5LFxuICAgICAgICB7bWF0Y2hMZW5ndGg6IDAsIGV4YW1pbmVkTGVuZ3RoOiAwLCB2YWx1ZTogZmFsc2UsIHJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ6IC0xfSk7XG4gICAgcG9zSW5mby5zdGFydExlZnRSZWN1cnNpb24odGhpcywgbWVtb1JlYyk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlLnVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLmlucHV0U3RyZWFtLnBvcywgbWVtb1JlYyk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnJlYWxseUV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIHZhciBvcmlnUG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gIHZhciBydWxlSW5mbyA9IHN0YXRlLmdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV07XG4gIHZhciBib2R5ID0gcnVsZUluZm8uYm9keTtcbiAgdmFyIGRlc2NyaXB0aW9uID0gcnVsZUluZm8uZGVzY3JpcHRpb247XG5cbiAgc3RhdGUuZW50ZXJBcHBsaWNhdGlvbihvcmlnUG9zSW5mbywgdGhpcyk7XG5cbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgc3RhdGUucHVzaEZhaWx1cmVzSW5mbygpO1xuICB9XG5cbiAgLy8gUmVzZXQgdGhlIGlucHV0IHN0cmVhbSdzIGV4YW1pbmVkTGVuZ3RoIHByb3BlcnR5IHNvIHRoYXQgd2UgY2FuIHRyYWNrXG4gIC8vIHRoZSBleGFtaW5lZCBsZW5ndGggb2YgdGhpcyBwYXJ0aWN1bGFyIGFwcGxpY2F0aW9uLlxuICB2YXIgb3JpZ0lucHV0U3RyZWFtRXhhbWluZWRMZW5ndGggPSBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aDtcbiAgaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPSAwO1xuXG4gIHZhciB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgc3RhdGUpO1xuICB2YXIgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uY3VycmVudExlZnRSZWN1cnNpb247XG4gIHZhciBtZW1vS2V5ID0gdGhpcy50b01lbW9LZXkoKTtcbiAgdmFyIGlzSGVhZE9mTGVmdFJlY3Vyc2lvbiA9IGN1cnJlbnRMUiAmJiBjdXJyZW50TFIuaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpID09PSBtZW1vS2V5O1xuICB2YXIgbWVtb1JlYztcblxuICBpZiAoaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uKSB7XG4gICAgdmFsdWUgPSB0aGlzLmdyb3dTZWVkUmVzdWx0KGJvZHksIHN0YXRlLCBvcmlnUG9zLCBjdXJyZW50TFIsIHZhbHVlKTtcbiAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgbWVtb1JlYyA9IGN1cnJlbnRMUjtcbiAgICBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoID0gaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggLSBvcmlnUG9zO1xuICAgIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IHN0YXRlLl9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0KCk7XG4gICAgb3JpZ1Bvc0luZm8ubWVtb2l6ZShtZW1vS2V5LCBtZW1vUmVjKTsgIC8vIHVwZGF0ZXMgb3JpZ1Bvc0luZm8ncyBtYXhFeGFtaW5lZExlbmd0aFxuICB9IGVsc2UgaWYgKCFjdXJyZW50TFIgfHwgIWN1cnJlbnRMUi5pc0ludm9sdmVkKG1lbW9LZXkpKSB7XG4gICAgLy8gVGhpcyBhcHBsaWNhdGlvbiBpcyBub3QgaW52b2x2ZWQgaW4gbGVmdCByZWN1cnNpb24sIHNvIGl0J3Mgb2sgdG8gbWVtb2l6ZSBpdC5cbiAgICBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb2l6ZShtZW1vS2V5LCB7XG4gICAgICBtYXRjaExlbmd0aDogaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcyxcbiAgICAgIGV4YW1pbmVkTGVuZ3RoOiBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCAtIG9yaWdQb3MsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBmYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb246IHN0YXRlLmNsb25lUmVjb3JkZWRGYWlsdXJlcygpLFxuICAgICAgcmlnaHRtb3N0RmFpbHVyZU9mZnNldDogc3RhdGUuX2dldFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQoKVxuICAgIH0pO1xuICB9XG4gIHZhciBzdWNjZWVkZWQgPSAhIXZhbHVlO1xuXG4gIGlmIChkZXNjcmlwdGlvbikge1xuICAgIHN0YXRlLnBvcEZhaWx1cmVzSW5mbygpO1xuICAgIGlmICghc3VjY2VlZGVkKSB7XG4gICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICB9XG4gICAgaWYgKG1lbW9SZWMpIHtcbiAgICAgIG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uID0gc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCk7XG4gICAgfVxuICB9XG5cbiAgLy8gUmVjb3JkIHRyYWNlIGluZm9ybWF0aW9uIGluIHRoZSBtZW1vIHRhYmxlLCBzbyB0aGF0IGl0IGlzIGF2YWlsYWJsZSBpZiB0aGUgbWVtb2l6ZWQgcmVzdWx0XG4gIC8vIGlzIHVzZWQgbGF0ZXIuXG4gIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSAmJiBtZW1vUmVjKSB7XG4gICAgdmFyIGVudHJ5ID0gc3RhdGUuZ2V0VHJhY2VFbnRyeShvcmlnUG9zLCB0aGlzLCBzdWNjZWVkZWQsIHN1Y2NlZWRlZCA/IFt2YWx1ZV0gOiBbXSk7XG4gICAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgY29tbW9uLmFzc2VydChlbnRyeS50ZXJtaW5hdGluZ0xSRW50cnkgIT0gbnVsbCB8fCAhc3VjY2VlZGVkKTtcbiAgICAgIGVudHJ5LmlzSGVhZE9mTGVmdFJlY3Vyc2lvbiA9IHRydWU7XG4gICAgfVxuICAgIG1lbW9SZWMudHJhY2VFbnRyeSA9IGVudHJ5O1xuICB9XG5cbiAgLy8gRml4IHRoZSBpbnB1dCBzdHJlYW0ncyBleGFtaW5lZExlbmd0aCAtLSBpdCBzaG91bGQgYmUgdGhlIG1heGltdW0gZXhhbWluZWQgbGVuZ3RoXG4gIC8vIGFjcm9zcyBhbGwgYXBwbGljYXRpb25zLCBub3QganVzdCB0aGlzIG9uZS5cbiAgaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heChpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCwgb3JpZ0lucHV0U3RyZWFtRXhhbWluZWRMZW5ndGgpO1xuXG4gIHN0YXRlLmV4aXRBcHBsaWNhdGlvbihvcmlnUG9zSW5mbywgdmFsdWUpO1xuXG4gIHJldHVybiBzdWNjZWVkZWQ7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWxPbmNlID0gZnVuY3Rpb24oZXhwciwgc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuXG4gIGlmIChzdGF0ZS5ldmFsKGV4cHIpKSB7XG4gICAgdmFyIGFyaXR5ID0gZXhwci5nZXRBcml0eSgpO1xuICAgIHZhciBiaW5kaW5ncyA9IHN0YXRlLl9iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgdmFyIG9mZnNldHMgPSBzdGF0ZS5fYmluZGluZ09mZnNldHMuc3BsaWNlKHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIHJldHVybiBuZXcgTm9udGVybWluYWxOb2RlKFxuICAgICAgICBzdGF0ZS5ncmFtbWFyLCB0aGlzLnJ1bGVOYW1lLCBiaW5kaW5ncywgb2Zmc2V0cywgaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1Bvcyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmdyb3dTZWVkUmVzdWx0ID0gZnVuY3Rpb24oYm9keSwgc3RhdGUsIG9yaWdQb3MsIGxyTWVtb1JlYywgbmV3VmFsdWUpIHtcbiAgaWYgKCFuZXdWYWx1ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgbHJNZW1vUmVjLm1hdGNoTGVuZ3RoID0gaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcztcbiAgICBsck1lbW9SZWMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICBsck1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uID0gc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCk7XG5cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgIC8vIEJlZm9yZSBldmFsdWF0aW5nIHRoZSBib2R5IGFnYWluLCBhZGQgYSB0cmFjZSBub2RlIGZvciB0aGlzIGFwcGxpY2F0aW9uIHRvIHRoZSBtZW1vIGVudHJ5LlxuICAgICAgLy8gSXRzIG9ubHkgY2hpbGQgaXMgYSBjb3B5IG9mIHRoZSB0cmFjZSBub2RlIGZyb20gYG5ld1ZhbHVlYCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgdGhlIGxhc3RcbiAgICAgIC8vIGVsZW1lbnQgaW4gYHN0YXRlLnRyYWNlYC5cbiAgICAgIHZhciBzZWVkVHJhY2UgPSBzdGF0ZS50cmFjZVtzdGF0ZS50cmFjZS5sZW5ndGggLSAxXTtcbiAgICAgIGxyTWVtb1JlYy50cmFjZUVudHJ5ID0gbmV3IFRyYWNlKFxuICAgICAgICAgIHN0YXRlLmlucHV0LCBvcmlnUG9zLCBpbnB1dFN0cmVhbS5wb3MsIHRoaXMsIHRydWUsIFtuZXdWYWx1ZV0sIFtzZWVkVHJhY2UuY2xvbmUoKV0pO1xuICAgIH1cbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIG5ld1ZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gICAgaWYgKGlucHV0U3RyZWFtLnBvcyAtIG9yaWdQb3MgPD0gbHJNZW1vUmVjLm1hdGNoTGVuZ3RoKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICBzdGF0ZS50cmFjZS5zcGxpY2UoLTIsIDEpOyAgLy8gRHJvcCB0aGUgdHJhY2UgZm9yIHRoZSBvbGQgc2VlZC5cbiAgICB9XG4gIH1cbiAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgLy8gVGhlIGxhc3QgZW50cnkgaXMgZm9yIGFuIHVudXNlZCByZXN1bHQgLS0gcG9wIGl0IGFuZCBzYXZlIGl0IGluIHRoZSBcInJlYWxcIiBlbnRyeS5cbiAgICBsck1lbW9SZWMudHJhY2VFbnRyeS5yZWNvcmRMUlRlcm1pbmF0aW9uKHN0YXRlLnRyYWNlLnBvcCgpLCBuZXdWYWx1ZSk7XG4gIH1cbiAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcyArIGxyTWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgcmV0dXJuIGxyTWVtb1JlYy52YWx1ZTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAoY2ggJiYgdGhpcy5wYXR0ZXJuLnRlc3QoY2gpKSB7XG4gICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBjaCksIG9yaWdQb3MpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIZWxwZXJzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBmbGF0dGVuKGxpc3RPZkxpc3RzKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBsaXN0T2ZMaXN0cyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGNvbW1vbi5hYnN0cmFjdCgnZ2VuZXJhdGVFeGFtcGxlJyk7XG5cbmZ1bmN0aW9uIGNhdGVnb3JpemVFeGFtcGxlcyhleGFtcGxlcykge1xuICAvLyBBIGxpc3Qgb2YgcnVsZXMgdGhhdCB0aGUgc3lzdGVtIG5lZWRzIGV4YW1wbGVzIG9mLCBpbiBvcmRlciB0byBnZW5lcmF0ZSBhbiBleGFtcGxlXG4gIC8vICAgZm9yIHRoZSBjdXJyZW50IHJ1bGVcbiAgdmFyIGV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXMuZmlsdGVyKGZ1bmN0aW9uKGV4YW1wbGUpIHtcbiAgICByZXR1cm4gZXhhbXBsZS5oYXNPd25Qcm9wZXJ0eSgnZXhhbXBsZXNOZWVkZWQnKTtcbiAgfSlcbiAgLm1hcChmdW5jdGlvbihleGFtcGxlKSB7IHJldHVybiBleGFtcGxlLmV4YW1wbGVzTmVlZGVkOyB9KTtcblxuICBleGFtcGxlc05lZWRlZCA9IGZsYXR0ZW4oZXhhbXBsZXNOZWVkZWQpO1xuXG4gIHZhciB1bmlxdWVFeGFtcGxlc05lZWRlZCA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGV4YW1wbGVzTmVlZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGN1cnJlbnRFeGFtcGxlTmVlZGVkID0gZXhhbXBsZXNOZWVkZWRbaV07XG4gICAgdW5pcXVlRXhhbXBsZXNOZWVkZWRbY3VycmVudEV4YW1wbGVOZWVkZWRdID0gdHJ1ZTtcbiAgfVxuICBleGFtcGxlc05lZWRlZCA9IE9iamVjdC5rZXlzKHVuaXF1ZUV4YW1wbGVzTmVlZGVkKTtcblxuICAvLyBBIGxpc3Qgb2Ygc3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCBleGFtcGxlc1xuICB2YXIgc3VjY2Vzc2Z1bEV4YW1wbGVzID0gZXhhbXBsZXMuZmlsdGVyKGZ1bmN0aW9uKGV4YW1wbGUpIHtcbiAgICByZXR1cm4gZXhhbXBsZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKTtcbiAgfSlcbiAgLm1hcChmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLnZhbHVlOyB9KTtcblxuICAvLyBUaGlzIGZsYWcgcmV0dXJucyB0cnVlIGlmIHRoZSBzeXN0ZW0gY2Fubm90IGdlbmVyYXRlIHRoZSBydWxlIGl0IGlzIGN1cnJlbnRseVxuICAvLyAgIGF0dGVtcHRpbmcgdG8gZ2VuZXJhdGUsIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciBvciBub3QgaXQgaGFzIHRoZSBleGFtcGxlcyBpdCBuZWVkcy5cbiAgLy8gICBDdXJyZW50bHksIHRoaXMgaXMgb25seSB1c2VkIGluIG92ZXJyaWRpbmcgZ2VuZXJhdG9ycyB0byBwcmV2ZW50IHRoZSBzeXN0ZW0gZnJvbVxuICAvLyAgIGdlbmVyYXRpbmcgZXhhbXBsZXMgZm9yIGNlcnRhaW4gcnVsZXMgKGUuZy4gJ2lkZW50JykuXG4gIHZhciBuZWVkSGVscCA9IGV4YW1wbGVzLnNvbWUoZnVuY3Rpb24oaXRlbSkgeyByZXR1cm4gaXRlbS5uZWVkSGVscDsgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBleGFtcGxlc05lZWRlZDogZXhhbXBsZXNOZWVkZWQsXG4gICAgc3VjY2Vzc2Z1bEV4YW1wbGVzOiBzdWNjZXNzZnVsRXhhbXBsZXMsXG4gICAgbmVlZEhlbHA6IG5lZWRIZWxwXG4gIH07XG59XG5cbnBleHBycy5hbnkuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICByZXR1cm4ge3ZhbHVlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSkpfTtcbn07XG5cbi8vIEFzc3VtZXMgdGhhdCB0ZXJtaW5hbCdzIG9iamVjdCBpcyBhbHdheXMgYSBzdHJpbmdcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICByZXR1cm4ge3ZhbHVlOiB0aGlzLm9ian07XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgdmFyIHJhbmdlU2l6ZSA9IHRoaXMudG8uY2hhckNvZGVBdCgwKSAtIHRoaXMuZnJvbS5jaGFyQ29kZUF0KDApO1xuICByZXR1cm4ge3ZhbHVlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKFxuICAgIHRoaXMuZnJvbS5jaGFyQ29kZUF0KDApICsgTWF0aC5mbG9vcihyYW5nZVNpemUgKiBNYXRoLnJhbmRvbSgpKVxuICApfTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICByZXR1cm4gYWN0dWFsc1t0aGlzLmluZGV4XS5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscyk7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIC8vIGl0ZW1zIC0+IHRlcm1FeGFtcGxlc1xuICB2YXIgdGVybUV4YW1wbGVzID0gdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkge1xuICAgIHJldHVybiB0ZXJtLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKTtcbiAgfSk7XG5cbiAgdmFyIGNhdGVnb3JpemVkRXhhbXBsZXMgPSBjYXRlZ29yaXplRXhhbXBsZXModGVybUV4YW1wbGVzKTtcblxuICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBjYXRlZ29yaXplZEV4YW1wbGVzLmV4YW1wbGVzTmVlZGVkO1xuICB2YXIgc3VjY2Vzc2Z1bEV4YW1wbGVzID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5zdWNjZXNzZnVsRXhhbXBsZXM7XG4gIHZhciBuZWVkSGVscCA9IGNhdGVnb3JpemVkRXhhbXBsZXMubmVlZEhlbHA7XG5cbiAgdmFyIGFucyA9IHt9O1xuXG4gIC8vIEFsdCBjYW4gY29udGFpbiBib3RoIGFuIGV4YW1wbGUgYW5kIGEgcmVxdWVzdCBmb3IgZXhhbXBsZXNcbiAgaWYgKHN1Y2Nlc3NmdWxFeGFtcGxlcy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzdWNjZXNzZnVsRXhhbXBsZXMubGVuZ3RoKTtcbiAgICBhbnMudmFsdWUgPSBzdWNjZXNzZnVsRXhhbXBsZXNbaV07XG4gIH1cbiAgaWYgKGV4YW1wbGVzTmVlZGVkLmxlbmd0aCA+IDApIHtcbiAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlc05lZWRlZDtcbiAgfVxuICBhbnMubmVlZEhlbHAgPSBuZWVkSGVscDtcblxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICB2YXIgZmFjdG9yRXhhbXBsZXMgPSB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uKGZhY3Rvcikge1xuICAgIHJldHVybiBmYWN0b3IuZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpO1xuICB9KTtcbiAgdmFyIGNhdGVnb3JpemVkRXhhbXBsZXMgPSBjYXRlZ29yaXplRXhhbXBsZXMoZmFjdG9yRXhhbXBsZXMpO1xuXG4gIHZhciBleGFtcGxlc05lZWRlZCA9IGNhdGVnb3JpemVkRXhhbXBsZXMuZXhhbXBsZXNOZWVkZWQ7XG4gIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBjYXRlZ29yaXplZEV4YW1wbGVzLnN1Y2Nlc3NmdWxFeGFtcGxlcztcbiAgdmFyIG5lZWRIZWxwID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5uZWVkSGVscDtcblxuICB2YXIgYW5zID0ge307XG5cbiAgLy8gSW4gYSBTZXEsIGFsbCBwaWVjZXMgbXVzdCBzdWNjZWVkIGluIG9yZGVyIHRvIGhhdmUgYSBzdWNjZXNzZnVsIGV4YW1wbGUuXG4gIGlmIChleGFtcGxlc05lZWRlZC5sZW5ndGggPiAwIHx8IG5lZWRIZWxwKSB7XG4gICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXNOZWVkZWQ7XG4gICAgYW5zLm5lZWRIZWxwID0gbmVlZEhlbHA7XG4gIH0gZWxzZSB7XG4gICAgYW5zLnZhbHVlID0gc3VjY2Vzc2Z1bEV4YW1wbGVzLmpvaW4oaW5TeW50YWN0aWNDb250ZXh0ID8gJyAnIDogJycpO1xuICB9XG5cbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIHZhciByYW5nZVRpbWVzID0gTWF0aC5taW4odGhpcy5tYXhOdW1NYXRjaGVzIC0gdGhpcy5taW5OdW1NYXRjaGVzLCAzKTtcbiAgdmFyIG51bVRpbWVzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJhbmdlVGltZXMgKyAxKSArIHRoaXMubWluTnVtTWF0Y2hlcyk7XG4gIHZhciBpdGVtcyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtVGltZXM7IGkrKykge1xuICAgIGl0ZW1zLnB1c2godGhpcy5leHByLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSk7XG4gIH1cblxuICB2YXIgY2F0ZWdvcml6ZWRFeGFtcGxlcyA9IGNhdGVnb3JpemVFeGFtcGxlcyhpdGVtcyk7XG5cbiAgdmFyIGV4YW1wbGVzTmVlZGVkID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5leGFtcGxlc05lZWRlZDtcbiAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGNhdGVnb3JpemVkRXhhbXBsZXMuc3VjY2Vzc2Z1bEV4YW1wbGVzO1xuXG4gIHZhciBhbnMgPSB7fTtcblxuICAvLyBJdCdzIGFsd2F5cyBlaXRoZXIgb25lIG9yIHRoZSBvdGhlci5cbiAgLy8gVE9ETzogaW5zdGVhZCBvZiAnICcsIGNhbGwgJ3NwYWNlcy5nZW5lcmF0ZUV4YW1wbGUoKSdcbiAgYW5zLnZhbHVlID0gc3VjY2Vzc2Z1bEV4YW1wbGVzLmpvaW4oaW5TeW50YWN0aWNDb250ZXh0ID8gJyAnIDogJycpO1xuICBpZiAoZXhhbXBsZXNOZWVkZWQubGVuZ3RoID4gMCkge1xuICAgIGFucy5leGFtcGxlc05lZWRlZCA9IGV4YW1wbGVzTmVlZGVkO1xuICB9XG5cbiAgcmV0dXJuIGFucztcbn07XG5cbi8vIFJpZ2h0IG5vdywgJ05vdCcgYW5kICdMb29rYWhlYWQnIGdlbmVyYXRlIG5vdGhpbmcgYW5kIGFzc3VtZSB0aGF0IHdoYXRldmVyIGZvbGxvd3Mgd2lsbFxuLy8gICB3b3JrIGFjY29yZGluZyB0byB0aGUgZW5jb2RlZCBjb25zdHJhaW50cy5cbnBleHBycy5Ob3QucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgcmV0dXJuIHt2YWx1ZTogJyd9O1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICByZXR1cm4ge3ZhbHVlOiAnJ307XG59O1xuXG5wZXhwcnMuTGV4LnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBmYWxzZSwgYWN0dWFscyk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgdmFyIGFucyA9IHt9O1xuXG4gIHZhciBydWxlTmFtZSA9IHRoaXMuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKS50b1N0cmluZygpO1xuXG4gIGlmICghZXhhbXBsZXMuaGFzT3duUHJvcGVydHkocnVsZU5hbWUpKSB7XG4gICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gW3J1bGVOYW1lXTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmVsZXZhbnRFeGFtcGxlcyA9IGV4YW1wbGVzW3J1bGVOYW1lXTtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbGV2YW50RXhhbXBsZXMubGVuZ3RoKTtcbiAgICBhbnMudmFsdWUgPSByZWxldmFudEV4YW1wbGVzW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFucztcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oXG4gICAgZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICB2YXIgY2hhcjtcbiAgc3dpdGNoICh0aGlzLmNhdGVnb3J5KSB7XG4gICAgY2FzZSAnTHUnOiBjaGFyID0gJ8OBJzsgYnJlYWs7XG4gICAgY2FzZSAnTGwnOiBjaGFyID0gJ8WPJzsgYnJlYWs7XG4gICAgY2FzZSAnTHQnOiBjaGFyID0gJ8eFJzsgYnJlYWs7XG4gICAgY2FzZSAnTG0nOiBjaGFyID0gJ8uuJzsgYnJlYWs7XG4gICAgY2FzZSAnTG8nOiBjaGFyID0gJ8a7JzsgYnJlYWs7XG5cbiAgICBjYXNlICdObCc6IGNoYXIgPSAn4oaCJzsgYnJlYWs7XG4gICAgY2FzZSAnTmQnOiBjaGFyID0gJ8K9JzsgYnJlYWs7XG5cbiAgICBjYXNlICdNbic6IGNoYXIgPSAnXFx1MDQ4Nyc7IGJyZWFrO1xuICAgIGNhc2UgJ01jJzogY2hhciA9ICfgpL8nOyBicmVhaztcblxuICAgIGNhc2UgJ1BjJzogY2hhciA9ICfigYAnOyBicmVhaztcblxuICAgIGNhc2UgJ1pzJzogY2hhciA9ICdcXHUyMDAxJzsgYnJlYWs7XG5cbiAgICBjYXNlICdMJzogY2hhciA9ICfDgSc7IGJyZWFrO1xuICAgIGNhc2UgJ0x0bW8nOiBjaGFyID0gJ8eFJzsgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIHt2YWx1ZTogY2hhcn07IC8vIPCfkqlcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXRBcml0eSA9IGNvbW1vbi5hYnN0cmFjdCgnZ2V0QXJpdHknKTtcblxucGV4cHJzLmFueS5nZXRBcml0eSA9XG5wZXhwcnMuZW5kLmdldEFyaXR5ID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gMTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIC8vIFRoaXMgaXMgb2sgYi9jIGFsbCB0ZXJtcyBtdXN0IGhhdmUgdGhlIHNhbWUgYXJpdHkgLS0gdGhpcyBwcm9wZXJ0eSBpc1xuICAvLyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyAwIDogdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGFyaXR5ID0gMDtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICBhcml0eSArPSB0aGlzLmZhY3RvcnNbaWR4XS5nZXRBcml0eSgpO1xuICB9XG4gIHJldHVybiBhcml0eTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gMDtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5MZXgucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgQ2FsbGVkIGF0IGdyYW1tYXIgY3JlYXRpb24gdGltZSB0byByZXdyaXRlIGEgcnVsZSBib2R5LCByZXBsYWNpbmcgZWFjaCByZWZlcmVuY2UgdG8gYSBmb3JtYWxcbiAgcGFyYW1ldGVyIHdpdGggYSBgUGFyYW1gIG5vZGUuIFJldHVybnMgYSBQRXhwciAtLSBlaXRoZXIgYSBuZXcgb25lLCBvciB0aGUgb3JpZ2luYWwgb25lIGlmXG4gIGl0IHdhcyBtb2RpZmllZCBpbiBwbGFjZS5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnaW50cm9kdWNlUGFyYW1zJyk7XG5cbnBleHBycy5hbnkuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5lbmQuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy50ZXJtcy5mb3JFYWNoKGZ1bmN0aW9uKHRlcm0sIGlkeCwgdGVybXMpIHtcbiAgICB0ZXJtc1tpZHhdID0gdGVybS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uKGZvcm1hbHMpIHtcbiAgdGhpcy5mYWN0b3JzLmZvckVhY2goZnVuY3Rpb24oZmFjdG9yLCBpZHgsIGZhY3RvcnMpIHtcbiAgICBmYWN0b3JzW2lkeF0gPSBmYWN0b3IuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Ob3QucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLmV4cHIgPSB0aGlzLmV4cHIuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB2YXIgaW5kZXggPSBmb3JtYWxzLmluZGV4T2YodGhpcy5ydWxlTmFtZSk7XG4gIGlmIChpbmRleCA+PSAwKSB7XG4gICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAvLyBUT0RPOiBTaG91bGQgdGhpcyBiZSBzdXBwb3J0ZWQ/IFNlZSBpc3N1ZSAjNjQuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlcml6ZWQgcnVsZXMgY2Fubm90IGJlIHBhc3NlZCBhcyBhcmd1bWVudHMgdG8gYW5vdGhlciBydWxlLicpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnLCBpZHgsIGFyZ3MpIHtcbiAgICAgIGFyZ3NbaWR4XSA9IGFyZy5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBwYXJzaW5nIGV4cHJlc3Npb24gbWF5IGFjY2VwdCB3aXRob3V0IGNvbnN1bWluZyBhbnkgaW5wdXQuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmlzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiB0aGlzLl9pc051bGxhYmxlKGdyYW1tYXIsIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdCgnX2lzTnVsbGFibGUnKTtcblxucGV4cHJzLmFueS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlBsdXMucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5lbmQuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgaWYgKHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAvLyBUaGlzIGlzIGFuIG92ZXItc2ltcGxpZmljYXRpb246IGl0J3Mgb25seSBjb3JyZWN0IGlmIHRoZSBpbnB1dCBpcyBhIHN0cmluZy4gSWYgaXQncyBhbiBhcnJheVxuICAgIC8vIG9yIGFuIG9iamVjdCwgdGhlbiB0aGUgZW1wdHkgc3RyaW5nIHBhcnNpbmcgZXhwcmVzc2lvbiBpcyBub3QgbnVsbGFibGUuXG4gICAgcmV0dXJuIHRoaXMub2JqID09PSAnJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgfHxcbiAgICAgIHRoaXMudGVybXMuc29tZShmdW5jdGlvbih0ZXJtKSB7IHJldHVybiB0ZXJtLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pOyB9KTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy5mYWN0b3JzLmV2ZXJ5KGZ1bmN0aW9uKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pOyB9KTtcbn07XG5cbnBleHBycy5TdGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuT3B0LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuTGV4LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHZhciBrZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtZW1vLCBrZXkpKSB7XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdLmJvZHk7XG4gICAgdmFyIGlubGluZWQgPSBib2R5LnN1YnN0aXR1dGVQYXJhbXModGhpcy5hcmdzKTtcbiAgICBtZW1vW2tleV0gPSBmYWxzZTsgIC8vIFByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uIGZvciByZWN1cnNpdmUgcnVsZXMuXG4gICAgbWVtb1trZXldID0gaW5saW5lZC5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbiAgfVxuICByZXR1cm4gbWVtb1trZXldO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBnZXRNZXRhSW5mbyhleHByLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgdmFyIG1ldGFJbmZvID0ge307XG4gIGlmIChleHByLnNvdXJjZSAmJiBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICB2YXIgYWRqdXN0ZWQgPSBleHByLnNvdXJjZS5yZWxhdGl2ZVRvKGdyYW1tYXJJbnRlcnZhbCk7XG4gICAgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwgPSBbYWRqdXN0ZWQuc3RhcnRJZHgsIGFkanVzdGVkLmVuZElkeF07XG4gIH1cbiAgcmV0dXJuIG1ldGFJbmZvO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3QoJ291dHB1dFJlY2lwZScpO1xuXG5wZXhwcnMuYW55Lm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICByZXR1cm4gWydhbnknLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpXTtcbn07XG5cbnBleHBycy5lbmQub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHJldHVybiBbJ2VuZCcsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCldO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICAndGVybWluYWwnLFxuICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgdGhpcy5vYmpcbiAgXTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHJldHVybiBbXG4gICAgJ3JhbmdlJyxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgIHRoaXMuZnJvbSxcbiAgICB0aGlzLnRvXG4gIF07XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICByZXR1cm4gW1xuICAgICdwYXJhbScsXG4gICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICB0aGlzLmluZGV4XG4gIF07XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICAnYWx0JyxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpXG4gIF0uY29uY2F0KHRoaXMudGVybXMubWFwKGZ1bmN0aW9uKHRlcm0pIHtcbiAgICByZXR1cm4gdGVybS5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgfSkpO1xufTtcblxucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHZhciBleHRlbnNpb24gPSB0aGlzLnRlcm1zWzBdOyAvLyBbZXh0ZW5zaW9uLCBvcmdpbmFsXVxuICByZXR1cm4gZXh0ZW5zaW9uLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHJldHVybiBbXG4gICAgJ3NlcScsXG4gICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKVxuICBdLmNvbmNhdCh0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uKGZhY3Rvcikge1xuICAgIHJldHVybiBmYWN0b3Iub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gIH0pKTtcbn07XG5cbnBleHBycy5TdGFyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxucGV4cHJzLlBsdXMucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuT3B0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICB0aGlzLmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKVxuICBdO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICAnYXBwJyxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgIHRoaXMucnVsZU5hbWUsXG4gICAgdGhpcy5hcmdzLm1hcChmdW5jdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBhcmcub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gICAgfSlcbiAgXTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHJldHVybiBbXG4gICAgJ3VuaWNvZGVDaGFyJyxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgIHRoaXMuY2F0ZWdvcnlcbiAgXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgUmV0dXJucyBhIFBFeHByIHRoYXQgcmVzdWx0cyBmcm9tIHJlY3Vyc2l2ZWx5IHJlcGxhY2luZyBldmVyeSBmb3JtYWwgcGFyYW1ldGVyIChpLmUuLCBpbnN0YW5jZVxuICBvZiBgUGFyYW1gKSBpbnNpZGUgdGhpcyBQRXhwciB3aXRoIGl0cyBhY3R1YWwgdmFsdWUgZnJvbSBgYWN0dWFsc2AgKGFuIEFycmF5KS5cblxuICBUaGUgcmVjZWl2ZXIgbXVzdCBub3QgYmUgbW9kaWZpZWQ7IGEgbmV3IFBFeHByIG11c3QgYmUgcmV0dXJuZWQgaWYgYW55IHJlcGxhY2VtZW50IGlzIG5lY2Vzc2FyeS5cbiovXG4vLyBmdW5jdGlvbihhY3R1YWxzKSB7IC4uLiB9XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBjb21tb24uYWJzdHJhY3QoJ3N1YnN0aXR1dGVQYXJhbXMnKTtcblxucGV4cHJzLmFueS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5lbmQuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIG5ldyBwZXhwcnMuQWx0KFxuICAgICAgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KSk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gbmV3IHBleHBycy5TZXEoXG4gICAgICB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5Ob3QucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5leHByLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscykpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICBpZiAodGhpcy5hcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgIC8vIEF2b2lkIG1ha2luZyBhIGNvcHkgb2YgdGhpcyBhcHBsaWNhdGlvbiwgYXMgYW4gb3B0aW1pemF0aW9uXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uKGFyZykgeyByZXR1cm4gYXJnLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pO1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHRoaXMucnVsZU5hbWUsIGFyZ3MpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxudmFyIGNvcHlXaXRob3V0RHVwbGljYXRlcyA9IGNvbW1vbi5jb3B5V2l0aG91dER1cGxpY2F0ZXM7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRKU0lkZW50aWZpZXIoc3RyKSB7XG4gIHJldHVybiAvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KSB7XG4gIC8vIGBjb3VudGAgaXMgdXNlZCB0byByZWNvcmQgdGhlIG51bWJlciBvZiB0aW1lcyBlYWNoIGFyZ3VtZW50IG5hbWUgb2NjdXJzIGluIHRoZSBsaXN0LFxuICAvLyB0aGlzIGlzIHVzZWZ1bCBmb3IgY2hlY2tpbmcgZHVwbGljYXRlZCBhcmd1bWVudCBuYW1lLiBJdCBtYXBzIGFyZ3VtZW50IG5hbWVzIHRvIGludHMuXG4gIHZhciBjb3VudCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGFyZ3VtZW50TmFtZUxpc3QuZm9yRWFjaChmdW5jdGlvbihhcmdOYW1lKSB7XG4gICAgY291bnRbYXJnTmFtZV0gPSAoY291bnRbYXJnTmFtZV0gfHwgMCkgKyAxO1xuICB9KTtcblxuICAvLyBBcHBlbmQgc3Vic2NyaXB0cyAoJ18xJywgJ18yJywgLi4uKSB0byBkdXBsaWNhdGUgYXJndW1lbnQgbmFtZXMuXG4gIE9iamVjdC5rZXlzKGNvdW50KS5mb3JFYWNoKGZ1bmN0aW9uKGR1cEFyZ05hbWUpIHtcbiAgICBpZiAoY291bnRbZHVwQXJnTmFtZV0gPD0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoaXMgbmFtZSBzaG93cyB1cCBtb3JlIHRoYW4gb25jZSwgc28gYWRkIHN1YnNjcmlwdHMuXG4gICAgdmFyIHN1YnNjcmlwdCA9IDE7XG4gICAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGFyZ05hbWUsIGlkeCkge1xuICAgICAgaWYgKGFyZ05hbWUgPT09IGR1cEFyZ05hbWUpIHtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdFtpZHhdID0gYXJnTmFtZSArICdfJyArIHN1YnNjcmlwdCsrO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIFJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgYXJndW1lbnQgbmFtZXMgZm9yIGl0cyByZWNlaXZlclxuICAoYSBwZXhwcikgaW4gYSBzZW1hbnRpYyBhY3Rpb24uIFRoaXMgaXMgdXNlZCBleGNsdXNpdmVseSBieSB0aGUgU2VtYW50aWNzIEVkaXRvci5cblxuICBgZmlyc3RBcmdJbmRleGAgaXMgdGhlIDEtYmFzZWQgaW5kZXggb2YgdGhlIGZpcnN0IGFyZ3VtZW50IG5hbWUgdGhhdCB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgdGhpc1xuICBwZXhwci4gSXQgZW5hYmxlcyB1cyB0byBuYW1lIGFyZ3VtZW50cyBwb3NpdGlvbmFsbHksIGUuZy4sIGlmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgYVxuICBub24tYWxwaGFudW1lcmljIHRlcm1pbmFsIGxpa2UgXCIrXCIsIGl0IHdpbGwgYmUgbmFtZWQgJyQyJy5cblxuICBgbm9EdXBDaGVja2AgaXMgdHJ1ZSBpZiB0aGUgY2FsbGVyIG9mIGB0b0FyZ3VtZW50TmFtZUxpc3RgIGlzIG5vdCBhIHRvcCBsZXZlbCBjYWxsZXIuIEl0IGVuYWJsZXNcbiAgdXMgdG8gYXZvaWQgbmVzdGVkIGR1cGxpY2F0aW9uIHN1YnNjcmlwdHMgYXBwZW5kaW5nLCBlLmcuLCAnXzFfMScsICdfMV8yJywgYnkgb25seSBjaGVja2luZ1xuICBkdXBsaWNhdGVzIGF0IHRoZSB0b3AgbGV2ZWwuXG5cbiAgSGVyZSBpcyBhIG1vcmUgZWxhYm9yYXRlIGV4YW1wbGUgdGhhdCBpbGx1c3RyYXRlcyBob3cgdGhpcyBtZXRob2Qgd29ya3M6XG4gIGAoYSBcIitcIiBiKS50b0FyZ3VtZW50TmFtZUxpc3QoMSlgIGV2YWx1YXRlcyB0byBgWydhJywgJyQyJywgJ2InXWAgd2l0aCB0aGUgZm9sbG93aW5nIHJlY3Vyc2l2ZVxuICBjYWxsczpcblxuICAgIChhKS50b0FyZ3VtZW50TmFtZUxpc3QoMSkgLT4gWydhJ10sXG4gICAgKFwiK1wiKS50b0FyZ3VtZW50TmFtZUxpc3QoMikgLT4gWyckMiddLFxuICAgIChiKS50b0FyZ3VtZW50TmFtZUxpc3QoMykgLT4gWydiJ11cblxuICBOb3RlczpcbiAgKiBUaGlzIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIG9uIHdlbGwtZm9ybWVkIGV4cHJlc3Npb25zLCBlLmcuLCB0aGUgcmVjZWl2ZXIgbXVzdFxuICAgIG5vdCBoYXZlIGFueSBBbHQgc3ViLWV4cHJlc3Npb25zIHdpdGggaW5jb25zaXN0ZW50IGFyaXRpZXMuXG4gICogZS5nZXRBcml0eSgpID09PSBlLnRvQXJndW1lbnROYW1lTGlzdCgxKS5sZW5ndGhcbiovXG4vLyBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7IC4uLiB9XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGNvbW1vbi5hYnN0cmFjdCgndG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5cbnBleHBycy5hbnkudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICByZXR1cm4gWydhbnknXTtcbn07XG5cbnBleHBycy5lbmQudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICByZXR1cm4gWydlbmQnXTtcbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJyAmJiAvXltfYS16QS1aMC05XSskLy50ZXN0KHRoaXMub2JqKSkge1xuICAgIC8vIElmIHRoaXMgdGVybWluYWwgaXMgYSB2YWxpZCBzdWZmaXggZm9yIGEgSlMgaWRlbnRpZmllciwganVzdCBwcmVwZW5kIGl0IHdpdGggJ18nXG4gICAgcmV0dXJuIFsnXycgKyB0aGlzLm9ial07XG4gIH0gZWxzZSB7XG4gICAgLy8gT3RoZXJ3aXNlLCBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICByZXR1cm4gWyckJyArIGZpcnN0QXJnSW5kZXhdO1xuICB9XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgdmFyIGFyZ05hbWUgPSB0aGlzLmZyb20gKyAnX3RvXycgKyB0aGlzLnRvO1xuICAvLyBJZiB0aGUgYGFyZ05hbWVgIGlzIG5vdCB2YWxpZCB0aGVuIHRyeSB0byBwcmVwZW5kIGEgYF9gLlxuICBpZiAoIWlzUmVzdHJpY3RlZEpTSWRlbnRpZmllcihhcmdOYW1lKSkge1xuICAgIGFyZ05hbWUgPSAnXycgKyBhcmdOYW1lO1xuICB9XG4gIC8vIElmIHRoZSBgYXJnTmFtZWAgc3RpbGwgbm90IHZhbGlkIGFmdGVyIHByZXBlbmRpbmcgYSBgX2AsIHRoZW4gbmFtZSBpdCBwb3NpdGlvbmFsbHkuXG4gIGlmICghaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKGFyZ05hbWUpKSB7XG4gICAgYXJnTmFtZSA9ICckJyArIGZpcnN0QXJnSW5kZXg7XG4gIH1cbiAgcmV0dXJuIFthcmdOYW1lXTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgLy8gYHRlcm1BcmdOYW1lTGlzdHNgIGlzIGFuIGFycmF5IG9mIGFycmF5cyB3aGVyZSBlYWNoIHJvdyBpcyB0aGVcbiAgLy8gYXJndW1lbnQgbmFtZSBsaXN0IHRoYXQgY29ycmVzcG9uZHMgdG8gYSB0ZXJtIGluIHRoaXMgYWx0ZXJuYXRpb24uXG4gIHZhciB0ZXJtQXJnTmFtZUxpc3RzID0gdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkge1xuICAgIHJldHVybiB0ZXJtLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCB0cnVlKTtcbiAgfSk7XG5cbiAgdmFyIGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgdmFyIG51bUFyZ3MgPSB0ZXJtQXJnTmFtZUxpc3RzWzBdLmxlbmd0aDtcbiAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbnVtQXJnczsgY29sSWR4KyspIHtcbiAgICB2YXIgY29sID0gW107XG4gICAgZm9yICh2YXIgcm93SWR4ID0gMDsgcm93SWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IHJvd0lkeCsrKSB7XG4gICAgICBjb2wucHVzaCh0ZXJtQXJnTmFtZUxpc3RzW3Jvd0lkeF1bY29sSWR4XSk7XG4gICAgfVxuICAgIHZhciB1bmlxdWVOYW1lcyA9IGNvcHlXaXRob3V0RHVwbGljYXRlcyhjb2wpO1xuICAgIGFyZ3VtZW50TmFtZUxpc3QucHVzaCh1bmlxdWVOYW1lcy5qb2luKCdfb3JfJykpO1xuICB9XG5cbiAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KTtcbiAgfVxuICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgLy8gR2VuZXJhdGUgdGhlIGFyZ3VtZW50IG5hbWUgbGlzdCwgd2l0aG91dCB3b3JyeWluZyBhYm91dCBkdXBsaWNhdGVzLlxuICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmdW5jdGlvbihmYWN0b3IpIHtcbiAgICB2YXIgZmFjdG9yQXJndW1lbnROYW1lTGlzdCA9IGZhY3Rvci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgdHJ1ZSk7XG4gICAgYXJndW1lbnROYW1lTGlzdCA9IGFyZ3VtZW50TmFtZUxpc3QuY29uY2F0KGZhY3RvckFyZ3VtZW50TmFtZUxpc3QpO1xuXG4gICAgLy8gU2hpZnQgdGhlIGZpcnN0QXJnSW5kZXggdG8gdGFrZSB0aGlzIGZhY3RvcidzIGFyZ3VtZW50IG5hbWVzIGludG8gYWNjb3VudC5cbiAgICBmaXJzdEFyZ0luZGV4ICs9IGZhY3RvckFyZ3VtZW50TmFtZUxpc3QubGVuZ3RoO1xuICB9KTtcbiAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KTtcbiAgfVxuICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHZhciBhcmd1bWVudE5hbWVMaXN0ID0gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKVxuICAgIC5tYXAoZnVuY3Rpb24oZXhwckFyZ3VtZW50U3RyaW5nKSB7XG4gICAgICByZXR1cm4gZXhwckFyZ3VtZW50U3RyaW5nW2V4cHJBcmd1bWVudFN0cmluZy5sZW5ndGggLSAxXSA9PT0gJ3MnID9cbiAgICAgICAgICBleHByQXJndW1lbnRTdHJpbmcgKyAnZXMnIDpcbiAgICAgICAgICBleHByQXJndW1lbnRTdHJpbmcgKyAncyc7XG4gICAgfSk7XG4gIGlmICghbm9EdXBDaGVjaykge1xuICAgIHJlc29sdmVEdXBsaWNhdGVkTmFtZXMoYXJndW1lbnROYW1lTGlzdCk7XG4gIH1cbiAgcmV0dXJuIGFyZ3VtZW50TmFtZUxpc3Q7XG59O1xuXG5wZXhwcnMuT3B0LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiB0aGlzLmV4cHIudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spLm1hcChmdW5jdGlvbihhcmdOYW1lKSB7XG4gICAgcmV0dXJuICdvcHQnICsgYXJnTmFtZVswXS50b1VwcGVyQ2FzZSgpICsgYXJnTmFtZS5zbGljZSgxKTtcbiAgfSk7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiBbXTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiB0aGlzLmV4cHIudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiBbdGhpcy5ydWxlTmFtZV07XG59O1xuXG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgcmV0dXJuIFsnJCcgKyBmaXJzdEFyZ0luZGV4XTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICByZXR1cm4gWydwYXJhbScgKyB0aGlzLmluZGV4XTtcbn07XG5cbi8vIFwiVmFsdWUgcGV4cHJzXCIgKFZhbHVlLCBTdHIsIEFyciwgT2JqKSBhcmUgZ29pbmcgYXdheSBzb29uLCBzbyB3ZSBkb24ndCB3b3JyeSBhYm91dCB0aGVtIGhlcmUuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFBFeHByLCBmb3IgdXNlIGFzIGEgVUkgbGFiZWwsIGV0Yy5cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gY29tbW9uLmFic3RyYWN0KCd0b0Rpc3BsYXlTdHJpbmcnKTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5TZXEucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLkxleC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnNvdXJjZSkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS50cmltbWVkKCkuY29udGVudHM7XG4gIH1cbiAgcmV0dXJuICdbJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICddJztcbn07XG5cbnBleHBycy5hbnkudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnYW55Jztcbn07XG5cbnBleHBycy5lbmQudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnZW5kJztcbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIycgKyB0aGlzLmluZGV4O1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnVW5pY29kZSB7JyArIHRoaXMuY2F0ZWdvcnkgKyAnfSBjaGFyYWN0ZXInO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBjb21tb24uYWJzdHJhY3QoJ3RvRmFpbHVyZScpO1xuXG5wZXhwcnMuYW55LnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdhbnkgb2JqZWN0JywgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuZW5kLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdlbmQgb2YgaW5wdXQnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgdGhpcy5vYmosICdzdHJpbmcnKTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICAvLyBUT0RPOiBjb21lIHVwIHdpdGggc29tZXRoaW5nIGJldHRlclxuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKSwgJ2NvZGUnKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5leHByID09PSBwZXhwcnMuYW55ID9cbiAgICAgICdub3RoaW5nJyA6XG4gICAgICAnbm90ICcgKyB0aGlzLmV4cHIudG9GYWlsdXJlKGdyYW1tYXIpO1xuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICB2YXIgZGVzY3JpcHRpb24gPSBncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdLmRlc2NyaXB0aW9uO1xuICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgdmFyIGFydGljbGUgPSAoL15bYWVpb3VBRUlPVV0vLnRlc3QodGhpcy5ydWxlTmFtZSkgPyAnYW4nIDogJ2EnKTtcbiAgICBkZXNjcmlwdGlvbiA9IGFydGljbGUgKyAnICcgKyB0aGlzLnJ1bGVOYW1lO1xuICB9XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdhIFVuaWNvZGUgWycgKyB0aGlzLmNhdGVnb3J5ICsgJ10gY2hhcmFjdGVyJywgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBmcyA9IHRoaXMudGVybXMubWFwKGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQudG9GYWlsdXJlKCk7IH0pO1xuICB2YXIgZGVzY3JpcHRpb24gPSAnKCcgKyBmcy5qb2luKCcgb3IgJykgKyAnKSc7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBmcyA9IHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24oZikgeyByZXR1cm4gZi50b0ZhaWx1cmUoKTsgfSk7XG4gIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIGZzLmpvaW4oJyAnKSArICcpJztcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIHRoaXMuZXhwci50b0ZhaWx1cmUoKSArIHRoaXMub3BlcmF0b3IgKyAnKSc7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIGUxLnRvU3RyaW5nKCkgPT09IGUyLnRvU3RyaW5nKCkgPT0+IGUxIGFuZCBlMiBhcmUgc2VtYW50aWNhbGx5IGVxdWl2YWxlbnQuXG4gIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBpZmYgKDw9PT4pOiBlLmcuLFxuICAoflwiYlwiIFwiYVwiKS50b1N0cmluZygpICE9PSAoXCJhXCIpLnRvU3RyaW5nKCksIGV2ZW4gdGhvdWdoXG4gIH5cImJcIiBcImFcIiBhbmQgXCJhXCIgYXJlIGludGVyY2hhbmdlYWJsZSBpbiBhbnkgZ3JhbW1hcixcbiAgYm90aCBpbiB0ZXJtcyBvZiB0aGUgbGFuZ3VhZ2VzIHRoZXkgYWNjZXB0IGFuZCB0aGVpciBhcml0aWVzLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9TdHJpbmcgPSBjb21tb24uYWJzdHJhY3QoJ3RvU3RyaW5nJyk7XG5cbnBleHBycy5hbnkudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdhbnknO1xufTtcblxucGV4cHJzLmVuZC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ2VuZCc7XG59O1xuXG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyQnICsgdGhpcy5pbmRleDtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIygnICsgdGhpcy5leHByLnRvU3RyaW5nKCkgKyAnKSc7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDEgP1xuICAgIHRoaXMudGVybXNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS50b1N0cmluZygpOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMubGVuZ3RoID09PSAxID9cbiAgICB0aGlzLmZhY3RvcnNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci50b1N0cmluZygpOyB9KS5qb2luKCcgJykgKyAnKSc7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwciArIHRoaXMub3BlcmF0b3I7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ34nICsgdGhpcy5leHByO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcmJyArIHRoaXMuZXhwcjtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHBzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy50b1N0cmluZygpOyB9KTtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1xcXFxweycgKyB0aGlzLmNhdGVnb3J5ICsgJ30nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBVbmljb2RlQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uL3RoaXJkX3BhcnR5L1VuaWNvZGVDYXRlZ29yaWVzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdlbmVyYWwgc3R1ZmZcblxuZnVuY3Rpb24gUEV4cHIoKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIlBFeHByIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXQncyBhYnN0cmFjdFwiKTtcbn1cblxuLy8gU2V0IHRoZSBgc291cmNlYCBwcm9wZXJ0eSB0byB0aGUgaW50ZXJ2YWwgY29udGFpbmluZyB0aGUgc291cmNlIGZvciB0aGlzIGV4cHJlc3Npb24uXG5QRXhwci5wcm90b3R5cGUud2l0aFNvdXJjZSA9IGZ1bmN0aW9uKGludGVydmFsKSB7XG4gIGlmIChpbnRlcnZhbCkge1xuICAgIHRoaXMuc291cmNlID0gaW50ZXJ2YWwudHJpbW1lZCgpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gQW55XG5cbnZhciBhbnkgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEVuZFxuXG52YXIgZW5kID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBUZXJtaW5hbHNcblxuZnVuY3Rpb24gVGVybWluYWwob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuaW5oZXJpdHMoVGVybWluYWwsIFBFeHByKTtcblxuLy8gUmFuZ2VzXG5cbmZ1bmN0aW9uIFJhbmdlKGZyb20sIHRvKSB7XG4gIHRoaXMuZnJvbSA9IGZyb207XG4gIHRoaXMudG8gPSB0bztcbn1cbmluaGVyaXRzKFJhbmdlLCBQRXhwcik7XG5cbi8vIFBhcmFtZXRlcnNcblxuZnVuY3Rpb24gUGFyYW0oaW5kZXgpIHtcbiAgdGhpcy5pbmRleCA9IGluZGV4O1xufVxuaW5oZXJpdHMoUGFyYW0sIFBFeHByKTtcblxuLy8gQWx0ZXJuYXRpb25cblxuZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gIHRoaXMudGVybXMgPSB0ZXJtcztcbn1cbmluaGVyaXRzKEFsdCwgUEV4cHIpO1xuXG4vLyBFeHRlbmQgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIEV4dGVuZChzdXBlckdyYW1tYXIsIG5hbWUsIGJvZHkpIHtcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlc1tuYW1lXS5ib2R5O1xuICB0aGlzLnRlcm1zID0gW2JvZHksIG9yaWdCb2R5XTtcbn1cbmluaGVyaXRzKEV4dGVuZCwgQWx0KTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5pbmhlcml0cyhTZXEsIFBFeHByKTtcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gSXRlcihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhJdGVyLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0YXIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RhciwgSXRlcik7XG5cbmZ1bmN0aW9uIFBsdXMoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoUGx1cywgSXRlcik7XG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhPcHQsIEl0ZXIpO1xuXG5TdGFyLnByb3RvdHlwZS5vcGVyYXRvciA9ICcqJztcblBsdXMucHJvdG90eXBlLm9wZXJhdG9yID0gJysnO1xuT3B0LnByb3RvdHlwZS5vcGVyYXRvciA9ICc/JztcblxuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5cblN0YXIucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5QbHVzLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuT3B0LnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gMTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTm90LCBQRXhwcik7XG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhMb29rYWhlYWQsIFBFeHByKTtcblxuLy8gXCJMZXhpZmljYXRpb25cIlxuXG5mdW5jdGlvbiBMZXgoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTGV4LCBQRXhwcik7XG5cbi8vIEFycmF5IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gQXJyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKEFyciwgUEV4cHIpO1xuXG4vLyBTdHJpbmcgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBTdHIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RyLCBQRXhwcik7XG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWU7IH0pO1xuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKG5hbWVzKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5pc0xlbmllbnQgPSBpc0xlbmllbnQ7XG4gIH1cbn1cbmluaGVyaXRzKE9iaiwgUEV4cHIpO1xuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lLCBvcHRBcmdzKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5hcmdzID0gb3B0QXJncyB8fCBbXTtcbn1cbmluaGVyaXRzKEFwcGx5LCBQRXhwcik7XG5cbkFwcGx5LnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpO1xufTtcblxuLy8gVGhpcyBtZXRob2QganVzdCBjYWNoZXMgdGhlIHJlc3VsdCBvZiBgdGhpcy50b1N0cmluZygpYCBpbiBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5LlxuQXBwbHkucHJvdG90eXBlLnRvTWVtb0tleSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuX21lbW9LZXkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19tZW1vS2V5Jywge3ZhbHVlOiB0aGlzLnRvU3RyaW5nKCl9KTtcbiAgfVxuICByZXR1cm4gdGhpcy5fbWVtb0tleTtcbn07XG5cbi8vIFVuaWNvZGUgY2hhcmFjdGVyXG5cbmZ1bmN0aW9uIFVuaWNvZGVDaGFyKGNhdGVnb3J5KSB7XG4gIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgdGhpcy5wYXR0ZXJuID0gVW5pY29kZUNhdGVnb3JpZXNbY2F0ZWdvcnldO1xufVxuaW5oZXJpdHMoVW5pY29kZUNoYXIsIFBFeHByKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuUEV4cHIgPSBQRXhwcjtcbmV4cG9ydHMuYW55ID0gYW55O1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlRlcm1pbmFsID0gVGVybWluYWw7XG5leHBvcnRzLlJhbmdlID0gUmFuZ2U7XG5leHBvcnRzLlBhcmFtID0gUGFyYW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kID0gRXh0ZW5kO1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkl0ZXIgPSBJdGVyO1xuZXhwb3J0cy5TdGFyID0gU3RhcjtcbmV4cG9ydHMuUGx1cyA9IFBsdXM7XG5leHBvcnRzLk9wdCA9IE9wdDtcbmV4cG9ydHMuTm90ID0gTm90O1xuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWQ7XG5leHBvcnRzLkxleCA9IExleDtcbmV4cG9ydHMuQXJyID0gQXJyO1xuZXhwb3J0cy5TdHIgPSBTdHI7XG5leHBvcnRzLk9iaiA9IE9iajtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcbmV4cG9ydHMuVW5pY29kZUNoYXIgPSBVbmljb2RlQ2hhcjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4dGVuc2lvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4vcGV4cHJzLWFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1jaGVjaycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtZ2V0QXJpdHknKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdlbmVyYXRlRXhhbXBsZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWlzTnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0ZhaWx1cmUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvU3RyaW5nJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdpdmVuIGFuIGFycmF5IG9mIG51bWJlcnMgYGFycmAsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbnVtYmVycyBhcyBzdHJpbmdzLFxuLy8gcmlnaHQtanVzdGlmaWVkIGFuZCBwYWRkZWQgdG8gdGhlIHNhbWUgbGVuZ3RoLlxuZnVuY3Rpb24gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoYXJyKSB7XG4gIHZhciBtYXhMZW4gPSAwO1xuICB2YXIgc3RyaW5ncyA9IGFyci5tYXAoZnVuY3Rpb24obikge1xuICAgIHZhciBzdHIgPSBuLnRvU3RyaW5nKCk7XG4gICAgbWF4TGVuID0gTWF0aC5tYXgobWF4TGVuLCBzdHIubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyO1xuICB9KTtcbiAgcmV0dXJuIHN0cmluZ3MubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIGNvbW1vbi5wYWRMZWZ0KHMsIG1heExlbik7IH0pO1xufVxuXG4vLyBQcm9kdWNlIGEgbmV3IHN0cmluZyB0aGF0IHdvdWxkIGJlIHRoZSByZXN1bHQgb2YgY29weWluZyB0aGUgY29udGVudHNcbi8vIG9mIHRoZSBzdHJpbmcgYHNyY2Agb250byBgZGVzdGAgYXQgb2Zmc2V0IGBvZmZlc3RgLlxuZnVuY3Rpb24gc3RyY3B5KGRlc3QsIHNyYywgb2Zmc2V0KSB7XG4gIHZhciBvcmlnRGVzdExlbiA9IGRlc3QubGVuZ3RoO1xuICB2YXIgc3RhcnQgPSBkZXN0LnNsaWNlKDAsIG9mZnNldCk7XG4gIHZhciBlbmQgPSBkZXN0LnNsaWNlKG9mZnNldCArIHNyYy5sZW5ndGgpO1xuICByZXR1cm4gKHN0YXJ0ICsgc3JjICsgZW5kKS5zdWJzdHIoMCwgb3JpZ0Rlc3RMZW4pO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnaXZlblxuLy8gb2Zmc2V0IGluIGBzdHJgLlxuZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uID0gZnVuY3Rpb24oc3RyLCBvZmZzZXQpIHtcbiAgdmFyIGxpbmVOdW0gPSAxO1xuICB2YXIgY29sTnVtID0gMTtcblxuICB2YXIgY3Vyck9mZnNldCA9IDA7XG4gIHZhciBsaW5lU3RhcnRPZmZzZXQgPSAwO1xuXG4gIHZhciBuZXh0TGluZSA9IG51bGw7XG4gIHZhciBwcmV2TGluZSA9IG51bGw7XG4gIHZhciBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gLTE7XG5cbiAgd2hpbGUgKGN1cnJPZmZzZXQgPCBvZmZzZXQpIHtcbiAgICB2YXIgYyA9IHN0ci5jaGFyQXQoY3Vyck9mZnNldCsrKTtcbiAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgIGxpbmVOdW0rKztcbiAgICAgIGNvbE51bSA9IDE7XG4gICAgICBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gbGluZVN0YXJ0T2Zmc2V0O1xuICAgICAgbGluZVN0YXJ0T2Zmc2V0ID0gY3Vyck9mZnNldDtcbiAgICB9IGVsc2UgaWYgKGMgIT09ICdcXHInKSB7XG4gICAgICBjb2xOdW0rKztcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBlbmQgb2YgdGhlIHRhcmdldCBsaW5lLlxuICB2YXIgbGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lU3RhcnRPZmZzZXQpO1xuICBpZiAobGluZUVuZE9mZnNldCA9PT0gLTEpIHtcbiAgICBsaW5lRW5kT2Zmc2V0ID0gc3RyLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgbGluZS5cbiAgICB2YXIgbmV4dExpbmVFbmRPZmZzZXQgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZUVuZE9mZnNldCArIDEpO1xuICAgIG5leHRMaW5lID0gbmV4dExpbmVFbmRPZmZzZXQgPT09IC0xID8gc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHIuc2xpY2UobGluZUVuZE9mZnNldCwgbmV4dExpbmVFbmRPZmZzZXQpO1xuICAgIC8vIFN0cmlwIGxlYWRpbmcgYW5kIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICAgIG5leHRMaW5lID0gbmV4dExpbmUucmVwbGFjZSgvXlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyJC8sICcnKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgcHJldmlvdXMgbGluZS5cbiAgaWYgKHByZXZMaW5lU3RhcnRPZmZzZXQgPj0gMCkge1xuICAgIHByZXZMaW5lID0gc3RyLnNsaWNlKHByZXZMaW5lU3RhcnRPZmZzZXQsIGxpbmVTdGFydE9mZnNldClcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHI/XFxuJC8sICcnKTsgIC8vIFN0cmlwIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICB9XG5cbiAgLy8gR2V0IHRoZSB0YXJnZXQgbGluZSwgc3RyaXBwaW5nIGEgdHJhaWxpbmcgY2FycmlhZ2UgcmV0dXJuIGlmIG5lY2Vzc2FyeS5cbiAgdmFyIGxpbmUgPSBzdHIuc2xpY2UobGluZVN0YXJ0T2Zmc2V0LCBsaW5lRW5kT2Zmc2V0KS5yZXBsYWNlKC9cXHIkLywgJycpO1xuXG4gIHJldHVybiB7XG4gICAgbGluZU51bTogbGluZU51bSxcbiAgICBjb2xOdW06IGNvbE51bSxcbiAgICBsaW5lOiBsaW5lLFxuICAgIHByZXZMaW5lOiBwcmV2TGluZSxcbiAgICBuZXh0TGluZTogbmV4dExpbmVcbiAgfTtcbn07XG5cbi8vIFJldHVybiBhIG5pY2VseS1mb3JtYXR0ZWQgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGxpbmUgYW5kIGNvbHVtbiBmb3IgdGhlXG4vLyBnaXZlbiBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlID0gZnVuY3Rpb24oc3RyLCBvZmZzZXQgLyogLi4ucmFuZ2VzICovKSB7XG4gIHZhciByZXBlYXRTdHIgPSBjb21tb24ucmVwZWF0U3RyO1xuXG4gIHZhciBsaW5lQW5kQ29sID0gZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uKHN0ciwgb2Zmc2V0KTtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgc2IuYXBwZW5kKCdMaW5lICcgKyBsaW5lQW5kQ29sLmxpbmVOdW0gKyAnLCBjb2wgJyArIGxpbmVBbmRDb2wuY29sTnVtICsgJzpcXG4nKTtcblxuICAvLyBBbiBhcnJheSBvZiB0aGUgcHJldmlvdXMsIGN1cnJlbnQsIGFuZCBuZXh0IGxpbmUgbnVtYmVycyBhcyBzdHJpbmdzIG9mIGVxdWFsIGxlbmd0aC5cbiAgdmFyIGxpbmVOdW1iZXJzID0gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoW1xuICAgIGxpbmVBbmRDb2wucHJldkxpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gLSAxLFxuICAgIGxpbmVBbmRDb2wubGluZU51bSxcbiAgICBsaW5lQW5kQ29sLm5leHRMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtICsgMVxuICBdKTtcblxuICAvLyBIZWxwZXIgZm9yIGFwcGVuZGluZyBmb3JtYXR0aW5nIGlucHV0IGxpbmVzIHRvIHRoZSBidWZmZXIuXG4gIGZ1bmN0aW9uIGFwcGVuZExpbmUobnVtLCBjb250ZW50LCBwcmVmaXgpIHtcbiAgICBzYi5hcHBlbmQocHJlZml4ICsgbGluZU51bWJlcnNbbnVtXSArICcgfCAnICsgY29udGVudCArICdcXG4nKTtcbiAgfVxuXG4gIC8vIEluY2x1ZGUgdGhlIHByZXZpb3VzIGxpbmUgZm9yIGNvbnRleHQgaWYgcG9zc2libGUuXG4gIGlmIChsaW5lQW5kQ29sLnByZXZMaW5lICE9IG51bGwpIHtcbiAgICBhcHBlbmRMaW5lKDAsIGxpbmVBbmRDb2wucHJldkxpbmUsICcgICcpO1xuICB9XG4gIC8vIExpbmUgdGhhdCB0aGUgZXJyb3Igb2NjdXJyZWQgb24uXG4gIGFwcGVuZExpbmUoMSwgbGluZUFuZENvbC5saW5lLCAnPiAnKTtcblxuICAvLyBCdWlsZCB1cCB0aGUgbGluZSB0aGF0IHBvaW50cyB0byB0aGUgb2Zmc2V0IGFuZCBwb3NzaWJsZSBpbmRpY2F0ZXMgb25lIG9yIG1vcmUgcmFuZ2VzLlxuICAvLyBTdGFydCB3aXRoIGEgYmxhbmsgbGluZSwgYW5kIGluZGljYXRlIGVhY2ggcmFuZ2UgYnkgb3ZlcmxheWluZyBhIHN0cmluZyBvZiBgfmAgY2hhcnMuXG4gIHZhciBsaW5lTGVuID0gbGluZUFuZENvbC5saW5lLmxlbmd0aDtcbiAgdmFyIGluZGljYXRpb25MaW5lID0gcmVwZWF0U3RyKCcgJywgbGluZUxlbiArIDEpO1xuICB2YXIgcmFuZ2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgc3RhcnRJZHggPSByYW5nZXNbaV1bMF07XG4gICAgdmFyIGVuZElkeCA9IHJhbmdlc1tpXVsxXTtcbiAgICBjb21tb24uYXNzZXJ0KHN0YXJ0SWR4ID49IDAgJiYgc3RhcnRJZHggPD0gZW5kSWR4LCAncmFuZ2Ugc3RhcnQgbXVzdCBiZSA+PSAwIGFuZCA8PSBlbmQnKTtcblxuICAgIHZhciBsaW5lU3RhcnRPZmZzZXQgPSBvZmZzZXQgLSBsaW5lQW5kQ29sLmNvbE51bSArIDE7XG4gICAgc3RhcnRJZHggPSBNYXRoLm1heCgwLCBzdGFydElkeCAtIGxpbmVTdGFydE9mZnNldCk7XG4gICAgZW5kSWR4ID0gTWF0aC5taW4oZW5kSWR4IC0gbGluZVN0YXJ0T2Zmc2V0LCBsaW5lTGVuKTtcblxuICAgIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCByZXBlYXRTdHIoJ34nLCBlbmRJZHggLSBzdGFydElkeCksIHN0YXJ0SWR4KTtcbiAgfVxuICB2YXIgZ3V0dGVyV2lkdGggPSAyICsgbGluZU51bWJlcnNbMV0ubGVuZ3RoICsgMztcbiAgc2IuYXBwZW5kKHJlcGVhdFN0cignICcsIGd1dHRlcldpZHRoKSk7XG4gIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCAnXicsIGxpbmVBbmRDb2wuY29sTnVtIC0gMSk7XG4gIHNiLmFwcGVuZChpbmRpY2F0aW9uTGluZS5yZXBsYWNlKC8gKyQvLCAnJykgKyAnXFxuJyk7XG5cbiAgLy8gSW5jbHVkZSB0aGUgbmV4dCBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICBpZiAobGluZUFuZENvbC5uZXh0TGluZSAhPSBudWxsKSB7XG4gICAgYXBwZW5kTGluZSgyLCBsaW5lQW5kQ29sLm5leHRMaW5lLCAnICAnKTtcbiAgfVxuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG4iLCIvLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy91bmljb2RlLTkuMC4wLlxuLy8gVGhlc2UgYXJlIGp1c3QgY2F0ZWdvcmllcyB0aGF0IGFyZSB1c2VkIGluIEVTNS9FUzIwMTUuXG4vLyBUaGUgZnVsbCBsaXN0IG9mIFVuaWNvZGUgY2F0ZWdvcmllcyBpcyBoZXJlOiBodHRwOi8vd3d3LmZpbGVmb3JtYXQuaW5mby9pbmZvL3VuaWNvZGUvY2F0ZWdvcnkvaW5kZXguaHRtLlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIExldHRlcnNcbiAgTHU6IC9bQS1aXFx4QzAtXFx4RDZcXHhEOC1cXHhERVxcdTAxMDBcXHUwMTAyXFx1MDEwNFxcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMTBFXFx1MDExMFxcdTAxMTJcXHUwMTE0XFx1MDExNlxcdTAxMThcXHUwMTFBXFx1MDExQ1xcdTAxMUVcXHUwMTIwXFx1MDEyMlxcdTAxMjRcXHUwMTI2XFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEyRVxcdTAxMzBcXHUwMTMyXFx1MDEzNFxcdTAxMzZcXHUwMTM5XFx1MDEzQlxcdTAxM0RcXHUwMTNGXFx1MDE0MVxcdTAxNDNcXHUwMTQ1XFx1MDE0N1xcdTAxNEFcXHUwMTRDXFx1MDE0RVxcdTAxNTBcXHUwMTUyXFx1MDE1NFxcdTAxNTZcXHUwMTU4XFx1MDE1QVxcdTAxNUNcXHUwMTVFXFx1MDE2MFxcdTAxNjJcXHUwMTY0XFx1MDE2NlxcdTAxNjhcXHUwMTZBXFx1MDE2Q1xcdTAxNkVcXHUwMTcwXFx1MDE3MlxcdTAxNzRcXHUwMTc2XFx1MDE3OFxcdTAxNzlcXHUwMTdCXFx1MDE3RFxcdTAxODFcXHUwMTgyXFx1MDE4NFxcdTAxODZcXHUwMTg3XFx1MDE4OS1cXHUwMThCXFx1MDE4RS1cXHUwMTkxXFx1MDE5M1xcdTAxOTRcXHUwMTk2LVxcdTAxOThcXHUwMTlDXFx1MDE5RFxcdTAxOUZcXHUwMUEwXFx1MDFBMlxcdTAxQTRcXHUwMUE2XFx1MDFBN1xcdTAxQTlcXHUwMUFDXFx1MDFBRVxcdTAxQUZcXHUwMUIxLVxcdTAxQjNcXHUwMUI1XFx1MDFCN1xcdTAxQjhcXHUwMUJDXFx1MDFDNFxcdTAxQzdcXHUwMUNBXFx1MDFDRFxcdTAxQ0ZcXHUwMUQxXFx1MDFEM1xcdTAxRDVcXHUwMUQ3XFx1MDFEOVxcdTAxREJcXHUwMURFXFx1MDFFMFxcdTAxRTJcXHUwMUU0XFx1MDFFNlxcdTAxRThcXHUwMUVBXFx1MDFFQ1xcdTAxRUVcXHUwMUYxXFx1MDFGNFxcdTAxRjYtXFx1MDFGOFxcdTAxRkFcXHUwMUZDXFx1MDFGRVxcdTAyMDBcXHUwMjAyXFx1MDIwNFxcdTAyMDZcXHUwMjA4XFx1MDIwQVxcdTAyMENcXHUwMjBFXFx1MDIxMFxcdTAyMTJcXHUwMjE0XFx1MDIxNlxcdTAyMThcXHUwMjFBXFx1MDIxQ1xcdTAyMUVcXHUwMjIwXFx1MDIyMlxcdTAyMjRcXHUwMjI2XFx1MDIyOFxcdTAyMkFcXHUwMjJDXFx1MDIyRVxcdTAyMzBcXHUwMjMyXFx1MDIzQVxcdTAyM0JcXHUwMjNEXFx1MDIzRVxcdTAyNDFcXHUwMjQzLVxcdTAyNDZcXHUwMjQ4XFx1MDI0QVxcdTAyNENcXHUwMjRFXFx1MDM3MFxcdTAzNzJcXHUwMzc2XFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RVxcdTAzOEZcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQUJcXHUwM0NGXFx1MDNEMi1cXHUwM0Q0XFx1MDNEOFxcdTAzREFcXHUwM0RDXFx1MDNERVxcdTAzRTBcXHUwM0UyXFx1MDNFNFxcdTAzRTZcXHUwM0U4XFx1MDNFQVxcdTAzRUNcXHUwM0VFXFx1MDNGNFxcdTAzRjdcXHUwM0Y5XFx1MDNGQVxcdTAzRkQtXFx1MDQyRlxcdTA0NjBcXHUwNDYyXFx1MDQ2NFxcdTA0NjZcXHUwNDY4XFx1MDQ2QVxcdTA0NkNcXHUwNDZFXFx1MDQ3MFxcdTA0NzJcXHUwNDc0XFx1MDQ3NlxcdTA0NzhcXHUwNDdBXFx1MDQ3Q1xcdTA0N0VcXHUwNDgwXFx1MDQ4QVxcdTA0OENcXHUwNDhFXFx1MDQ5MFxcdTA0OTJcXHUwNDk0XFx1MDQ5NlxcdTA0OThcXHUwNDlBXFx1MDQ5Q1xcdTA0OUVcXHUwNEEwXFx1MDRBMlxcdTA0QTRcXHUwNEE2XFx1MDRBOFxcdTA0QUFcXHUwNEFDXFx1MDRBRVxcdTA0QjBcXHUwNEIyXFx1MDRCNFxcdTA0QjZcXHUwNEI4XFx1MDRCQVxcdTA0QkNcXHUwNEJFXFx1MDRDMFxcdTA0QzFcXHUwNEMzXFx1MDRDNVxcdTA0QzdcXHUwNEM5XFx1MDRDQlxcdTA0Q0RcXHUwNEQwXFx1MDREMlxcdTA0RDRcXHUwNEQ2XFx1MDREOFxcdTA0REFcXHUwNERDXFx1MDRERVxcdTA0RTBcXHUwNEUyXFx1MDRFNFxcdTA0RTZcXHUwNEU4XFx1MDRFQVxcdTA0RUNcXHUwNEVFXFx1MDRGMFxcdTA0RjJcXHUwNEY0XFx1MDRGNlxcdTA0RjhcXHUwNEZBXFx1MDRGQ1xcdTA0RkVcXHUwNTAwXFx1MDUwMlxcdTA1MDRcXHUwNTA2XFx1MDUwOFxcdTA1MEFcXHUwNTBDXFx1MDUwRVxcdTA1MTBcXHUwNTEyXFx1MDUxNFxcdTA1MTZcXHUwNTE4XFx1MDUxQVxcdTA1MUNcXHUwNTFFXFx1MDUyMFxcdTA1MjJcXHUwNTI0XFx1MDUyNlxcdTA1MjhcXHUwNTJBXFx1MDUyQ1xcdTA1MkVcXHUwNTMxLVxcdTA1NTZcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEzQTAtXFx1MTNGNVxcdTFFMDBcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUxRTA4XFx1MUUwQVxcdTFFMENcXHUxRTBFXFx1MUUxMFxcdTFFMTJcXHUxRTE0XFx1MUUxNlxcdTFFMThcXHUxRTFBXFx1MUUxQ1xcdTFFMUVcXHUxRTIwXFx1MUUyMlxcdTFFMjRcXHUxRTI2XFx1MUUyOFxcdTFFMkFcXHUxRTJDXFx1MUUyRVxcdTFFMzBcXHUxRTMyXFx1MUUzNFxcdTFFMzZcXHUxRTM4XFx1MUUzQVxcdTFFM0NcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUxRTQ0XFx1MUU0NlxcdTFFNDhcXHUxRTRBXFx1MUU0Q1xcdTFFNEVcXHUxRTUwXFx1MUU1MlxcdTFFNTRcXHUxRTU2XFx1MUU1OFxcdTFFNUFcXHUxRTVDXFx1MUU1RVxcdTFFNjBcXHUxRTYyXFx1MUU2NFxcdTFFNjZcXHUxRTY4XFx1MUU2QVxcdTFFNkNcXHUxRTZFXFx1MUU3MFxcdTFFNzJcXHUxRTc0XFx1MUU3NlxcdTFFNzhcXHUxRTdBXFx1MUU3Q1xcdTFFN0VcXHUxRTgwXFx1MUU4MlxcdTFFODRcXHUxRTg2XFx1MUU4OFxcdTFFOEFcXHUxRThDXFx1MUU4RVxcdTFFOTBcXHUxRTkyXFx1MUU5NFxcdTFFOUVcXHUxRUEwXFx1MUVBMlxcdTFFQTRcXHUxRUE2XFx1MUVBOFxcdTFFQUFcXHUxRUFDXFx1MUVBRVxcdTFFQjBcXHUxRUIyXFx1MUVCNFxcdTFFQjZcXHUxRUI4XFx1MUVCQVxcdTFFQkNcXHUxRUJFXFx1MUVDMFxcdTFFQzJcXHUxRUM0XFx1MUVDNlxcdTFFQzhcXHUxRUNBXFx1MUVDQ1xcdTFFQ0VcXHUxRUQwXFx1MUVEMlxcdTFFRDRcXHUxRUQ2XFx1MUVEOFxcdTFFREFcXHUxRURDXFx1MUVERVxcdTFFRTBcXHUxRUUyXFx1MUVFNFxcdTFFRTZcXHUxRUU4XFx1MUVFQVxcdTFFRUNcXHUxRUVFXFx1MUVGMFxcdTFFRjJcXHUxRUY0XFx1MUVGNlxcdTFFRjhcXHUxRUZBXFx1MUVGQ1xcdTFFRkVcXHUxRjA4LVxcdTFGMEZcXHUxRjE4LVxcdTFGMURcXHUxRjI4LVxcdTFGMkZcXHUxRjM4LVxcdTFGM0ZcXHUxRjQ4LVxcdTFGNERcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGXFx1MUY2OC1cXHUxRjZGXFx1MUZCOC1cXHUxRkJCXFx1MUZDOC1cXHUxRkNCXFx1MUZEOC1cXHUxRkRCXFx1MUZFOC1cXHUxRkVDXFx1MUZGOC1cXHUxRkZCXFx1MjEwMlxcdTIxMDdcXHUyMTBCLVxcdTIxMERcXHUyMTEwLVxcdTIxMTJcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEzMC1cXHUyMTMzXFx1MjEzRVxcdTIxM0ZcXHUyMTQ1XFx1MjE4M1xcdTJDMDAtXFx1MkMyRVxcdTJDNjBcXHUyQzYyLVxcdTJDNjRcXHUyQzY3XFx1MkM2OVxcdTJDNkJcXHUyQzZELVxcdTJDNzBcXHUyQzcyXFx1MkM3NVxcdTJDN0UtXFx1MkM4MFxcdTJDODJcXHUyQzg0XFx1MkM4NlxcdTJDODhcXHUyQzhBXFx1MkM4Q1xcdTJDOEVcXHUyQzkwXFx1MkM5MlxcdTJDOTRcXHUyQzk2XFx1MkM5OFxcdTJDOUFcXHUyQzlDXFx1MkM5RVxcdTJDQTBcXHUyQ0EyXFx1MkNBNFxcdTJDQTZcXHUyQ0E4XFx1MkNBQVxcdTJDQUNcXHUyQ0FFXFx1MkNCMFxcdTJDQjJcXHUyQ0I0XFx1MkNCNlxcdTJDQjhcXHUyQ0JBXFx1MkNCQ1xcdTJDQkVcXHUyQ0MwXFx1MkNDMlxcdTJDQzRcXHUyQ0M2XFx1MkNDOFxcdTJDQ0FcXHUyQ0NDXFx1MkNDRVxcdTJDRDBcXHUyQ0QyXFx1MkNENFxcdTJDRDZcXHUyQ0Q4XFx1MkNEQVxcdTJDRENcXHUyQ0RFXFx1MkNFMFxcdTJDRTJcXHUyQ0VCXFx1MkNFRFxcdTJDRjJcXHVBNjQwXFx1QTY0MlxcdUE2NDRcXHVBNjQ2XFx1QTY0OFxcdUE2NEFcXHVBNjRDXFx1QTY0RVxcdUE2NTBcXHVBNjUyXFx1QTY1NFxcdUE2NTZcXHVBNjU4XFx1QTY1QVxcdUE2NUNcXHVBNjVFXFx1QTY2MFxcdUE2NjJcXHVBNjY0XFx1QTY2NlxcdUE2NjhcXHVBNjZBXFx1QTY2Q1xcdUE2ODBcXHVBNjgyXFx1QTY4NFxcdUE2ODZcXHVBNjg4XFx1QTY4QVxcdUE2OENcXHVBNjhFXFx1QTY5MFxcdUE2OTJcXHVBNjk0XFx1QTY5NlxcdUE2OThcXHVBNjlBXFx1QTcyMlxcdUE3MjRcXHVBNzI2XFx1QTcyOFxcdUE3MkFcXHVBNzJDXFx1QTcyRVxcdUE3MzJcXHVBNzM0XFx1QTczNlxcdUE3MzhcXHVBNzNBXFx1QTczQ1xcdUE3M0VcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBNzQ2XFx1QTc0OFxcdUE3NEFcXHVBNzRDXFx1QTc0RVxcdUE3NTBcXHVBNzUyXFx1QTc1NFxcdUE3NTZcXHVBNzU4XFx1QTc1QVxcdUE3NUNcXHVBNzVFXFx1QTc2MFxcdUE3NjJcXHVBNzY0XFx1QTc2NlxcdUE3NjhcXHVBNzZBXFx1QTc2Q1xcdUE3NkVcXHVBNzc5XFx1QTc3QlxcdUE3N0RcXHVBNzdFXFx1QTc4MFxcdUE3ODJcXHVBNzg0XFx1QTc4NlxcdUE3OEJcXHVBNzhEXFx1QTc5MFxcdUE3OTJcXHVBNzk2XFx1QTc5OFxcdUE3OUFcXHVBNzlDXFx1QTc5RVxcdUE3QTBcXHVBN0EyXFx1QTdBNFxcdUE3QTZcXHVBN0E4XFx1QTdBQS1cXHVBN0FFXFx1QTdCMC1cXHVBN0I0XFx1QTdCNlxcdUZGMjEtXFx1RkYzQV18XFx1RDgwMVtcXHVEQzAwLVxcdURDMjdcXHVEQ0IwLVxcdURDRDNdfFxcdUQ4MDNbXFx1REM4MC1cXHVEQ0IyXXxcXHVEODA2W1xcdURDQTAtXFx1RENCRl18XFx1RDgzNVtcXHVEQzAwLVxcdURDMTlcXHVEQzM0LVxcdURDNERcXHVEQzY4LVxcdURDODFcXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjVcXHVEQ0QwLVxcdURDRTlcXHVERDA0XFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMzhcXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENkMtXFx1REQ4NVxcdUREQTAtXFx1RERCOVxcdURERDQtXFx1RERFRFxcdURFMDgtXFx1REUyMVxcdURFM0MtXFx1REU1NVxcdURFNzAtXFx1REU4OVxcdURFQTgtXFx1REVDMFxcdURFRTItXFx1REVGQVxcdURGMUMtXFx1REYzNFxcdURGNTYtXFx1REY2RVxcdURGOTAtXFx1REZBOFxcdURGQ0FdfFxcdUQ4M0FbXFx1REQwMC1cXHVERDIxXS8sXG4gIExsOiAvW2EtelxceEI1XFx4REYtXFx4RjZcXHhGOC1cXHhGRlxcdTAxMDFcXHUwMTAzXFx1MDEwNVxcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMTBGXFx1MDExMVxcdTAxMTNcXHUwMTE1XFx1MDExN1xcdTAxMTlcXHUwMTFCXFx1MDExRFxcdTAxMUZcXHUwMTIxXFx1MDEyM1xcdTAxMjVcXHUwMTI3XFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDEyRlxcdTAxMzFcXHUwMTMzXFx1MDEzNVxcdTAxMzdcXHUwMTM4XFx1MDEzQVxcdTAxM0NcXHUwMTNFXFx1MDE0MFxcdTAxNDJcXHUwMTQ0XFx1MDE0NlxcdTAxNDhcXHUwMTQ5XFx1MDE0QlxcdTAxNERcXHUwMTRGXFx1MDE1MVxcdTAxNTNcXHUwMTU1XFx1MDE1N1xcdTAxNTlcXHUwMTVCXFx1MDE1RFxcdTAxNUZcXHUwMTYxXFx1MDE2M1xcdTAxNjVcXHUwMTY3XFx1MDE2OVxcdTAxNkJcXHUwMTZEXFx1MDE2RlxcdTAxNzFcXHUwMTczXFx1MDE3NVxcdTAxNzdcXHUwMTdBXFx1MDE3Q1xcdTAxN0UtXFx1MDE4MFxcdTAxODNcXHUwMTg1XFx1MDE4OFxcdTAxOENcXHUwMThEXFx1MDE5MlxcdTAxOTVcXHUwMTk5LVxcdTAxOUJcXHUwMTlFXFx1MDFBMVxcdTAxQTNcXHUwMUE1XFx1MDFBOFxcdTAxQUFcXHUwMUFCXFx1MDFBRFxcdTAxQjBcXHUwMUI0XFx1MDFCNlxcdTAxQjlcXHUwMUJBXFx1MDFCRC1cXHUwMUJGXFx1MDFDNlxcdTAxQzlcXHUwMUNDXFx1MDFDRVxcdTAxRDBcXHUwMUQyXFx1MDFENFxcdTAxRDZcXHUwMUQ4XFx1MDFEQVxcdTAxRENcXHUwMUREXFx1MDFERlxcdTAxRTFcXHUwMUUzXFx1MDFFNVxcdTAxRTdcXHUwMUU5XFx1MDFFQlxcdTAxRURcXHUwMUVGXFx1MDFGMFxcdTAxRjNcXHUwMUY1XFx1MDFGOVxcdTAxRkJcXHUwMUZEXFx1MDFGRlxcdTAyMDFcXHUwMjAzXFx1MDIwNVxcdTAyMDdcXHUwMjA5XFx1MDIwQlxcdTAyMERcXHUwMjBGXFx1MDIxMVxcdTAyMTNcXHUwMjE1XFx1MDIxN1xcdTAyMTlcXHUwMjFCXFx1MDIxRFxcdTAyMUZcXHUwMjIxXFx1MDIyM1xcdTAyMjVcXHUwMjI3XFx1MDIyOVxcdTAyMkJcXHUwMjJEXFx1MDIyRlxcdTAyMzFcXHUwMjMzLVxcdTAyMzlcXHUwMjNDXFx1MDIzRlxcdTAyNDBcXHUwMjQyXFx1MDI0N1xcdTAyNDlcXHUwMjRCXFx1MDI0RFxcdTAyNEYtXFx1MDI5M1xcdTAyOTUtXFx1MDJBRlxcdTAzNzFcXHUwMzczXFx1MDM3N1xcdTAzN0ItXFx1MDM3RFxcdTAzOTBcXHUwM0FDLVxcdTAzQ0VcXHUwM0QwXFx1MDNEMVxcdTAzRDUtXFx1MDNEN1xcdTAzRDlcXHUwM0RCXFx1MDNERFxcdTAzREZcXHUwM0UxXFx1MDNFM1xcdTAzRTVcXHUwM0U3XFx1MDNFOVxcdTAzRUJcXHUwM0VEXFx1MDNFRi1cXHUwM0YzXFx1MDNGNVxcdTAzRjhcXHUwM0ZCXFx1MDNGQ1xcdTA0MzAtXFx1MDQ1RlxcdTA0NjFcXHUwNDYzXFx1MDQ2NVxcdTA0NjdcXHUwNDY5XFx1MDQ2QlxcdTA0NkRcXHUwNDZGXFx1MDQ3MVxcdTA0NzNcXHUwNDc1XFx1MDQ3N1xcdTA0NzlcXHUwNDdCXFx1MDQ3RFxcdTA0N0ZcXHUwNDgxXFx1MDQ4QlxcdTA0OERcXHUwNDhGXFx1MDQ5MVxcdTA0OTNcXHUwNDk1XFx1MDQ5N1xcdTA0OTlcXHUwNDlCXFx1MDQ5RFxcdTA0OUZcXHUwNEExXFx1MDRBM1xcdTA0QTVcXHUwNEE3XFx1MDRBOVxcdTA0QUJcXHUwNEFEXFx1MDRBRlxcdTA0QjFcXHUwNEIzXFx1MDRCNVxcdTA0QjdcXHUwNEI5XFx1MDRCQlxcdTA0QkRcXHUwNEJGXFx1MDRDMlxcdTA0QzRcXHUwNEM2XFx1MDRDOFxcdTA0Q0FcXHUwNENDXFx1MDRDRVxcdTA0Q0ZcXHUwNEQxXFx1MDREM1xcdTA0RDVcXHUwNEQ3XFx1MDREOVxcdTA0REJcXHUwNEREXFx1MDRERlxcdTA0RTFcXHUwNEUzXFx1MDRFNVxcdTA0RTdcXHUwNEU5XFx1MDRFQlxcdTA0RURcXHUwNEVGXFx1MDRGMVxcdTA0RjNcXHUwNEY1XFx1MDRGN1xcdTA0RjlcXHUwNEZCXFx1MDRGRFxcdTA0RkZcXHUwNTAxXFx1MDUwM1xcdTA1MDVcXHUwNTA3XFx1MDUwOVxcdTA1MEJcXHUwNTBEXFx1MDUwRlxcdTA1MTFcXHUwNTEzXFx1MDUxNVxcdTA1MTdcXHUwNTE5XFx1MDUxQlxcdTA1MURcXHUwNTFGXFx1MDUyMVxcdTA1MjNcXHUwNTI1XFx1MDUyN1xcdTA1MjlcXHUwNTJCXFx1MDUyRFxcdTA1MkZcXHUwNTYxLVxcdTA1ODdcXHUxM0Y4LVxcdTEzRkRcXHUxQzgwLVxcdTFDODhcXHUxRDAwLVxcdTFEMkJcXHUxRDZCLVxcdTFENzdcXHUxRDc5LVxcdTFEOUFcXHUxRTAxXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MUUwOVxcdTFFMEJcXHUxRTBEXFx1MUUwRlxcdTFFMTFcXHUxRTEzXFx1MUUxNVxcdTFFMTdcXHUxRTE5XFx1MUUxQlxcdTFFMURcXHUxRTFGXFx1MUUyMVxcdTFFMjNcXHUxRTI1XFx1MUUyN1xcdTFFMjlcXHUxRTJCXFx1MUUyRFxcdTFFMkZcXHUxRTMxXFx1MUUzM1xcdTFFMzVcXHUxRTM3XFx1MUUzOVxcdTFFM0JcXHUxRTNEXFx1MUUzRlxcdTFFNDFcXHUxRTQzXFx1MUU0NVxcdTFFNDdcXHUxRTQ5XFx1MUU0QlxcdTFFNERcXHUxRTRGXFx1MUU1MVxcdTFFNTNcXHUxRTU1XFx1MUU1N1xcdTFFNTlcXHUxRTVCXFx1MUU1RFxcdTFFNUZcXHUxRTYxXFx1MUU2M1xcdTFFNjVcXHUxRTY3XFx1MUU2OVxcdTFFNkJcXHUxRTZEXFx1MUU2RlxcdTFFNzFcXHUxRTczXFx1MUU3NVxcdTFFNzdcXHUxRTc5XFx1MUU3QlxcdTFFN0RcXHUxRTdGXFx1MUU4MVxcdTFFODNcXHUxRTg1XFx1MUU4N1xcdTFFODlcXHUxRThCXFx1MUU4RFxcdTFFOEZcXHUxRTkxXFx1MUU5M1xcdTFFOTUtXFx1MUU5RFxcdTFFOUZcXHUxRUExXFx1MUVBM1xcdTFFQTVcXHUxRUE3XFx1MUVBOVxcdTFFQUJcXHUxRUFEXFx1MUVBRlxcdTFFQjFcXHUxRUIzXFx1MUVCNVxcdTFFQjdcXHUxRUI5XFx1MUVCQlxcdTFFQkRcXHUxRUJGXFx1MUVDMVxcdTFFQzNcXHUxRUM1XFx1MUVDN1xcdTFFQzlcXHUxRUNCXFx1MUVDRFxcdTFFQ0ZcXHUxRUQxXFx1MUVEM1xcdTFFRDVcXHUxRUQ3XFx1MUVEOVxcdTFFREJcXHUxRUREXFx1MUVERlxcdTFFRTFcXHUxRUUzXFx1MUVFNVxcdTFFRTdcXHUxRUU5XFx1MUVFQlxcdTFFRURcXHUxRUVGXFx1MUVGMVxcdTFFRjNcXHUxRUY1XFx1MUVGN1xcdTFFRjlcXHUxRUZCXFx1MUVGRFxcdTFFRkYtXFx1MUYwN1xcdTFGMTAtXFx1MUYxNVxcdTFGMjAtXFx1MUYyN1xcdTFGMzAtXFx1MUYzN1xcdTFGNDAtXFx1MUY0NVxcdTFGNTAtXFx1MUY1N1xcdTFGNjAtXFx1MUY2N1xcdTFGNzAtXFx1MUY3RFxcdTFGODAtXFx1MUY4N1xcdTFGOTAtXFx1MUY5N1xcdTFGQTAtXFx1MUZBN1xcdTFGQjAtXFx1MUZCNFxcdTFGQjZcXHUxRkI3XFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzZcXHUxRkM3XFx1MUZEMC1cXHUxRkQzXFx1MUZENlxcdTFGRDdcXHUxRkUwLVxcdTFGRTdcXHUxRkYyLVxcdTFGRjRcXHUxRkY2XFx1MUZGN1xcdTIxMEFcXHUyMTBFXFx1MjEwRlxcdTIxMTNcXHUyMTJGXFx1MjEzNFxcdTIxMzlcXHUyMTNDXFx1MjEzRFxcdTIxNDYtXFx1MjE0OVxcdTIxNEVcXHUyMTg0XFx1MkMzMC1cXHUyQzVFXFx1MkM2MVxcdTJDNjVcXHUyQzY2XFx1MkM2OFxcdTJDNkFcXHUyQzZDXFx1MkM3MVxcdTJDNzNcXHUyQzc0XFx1MkM3Ni1cXHUyQzdCXFx1MkM4MVxcdTJDODNcXHUyQzg1XFx1MkM4N1xcdTJDODlcXHUyQzhCXFx1MkM4RFxcdTJDOEZcXHUyQzkxXFx1MkM5M1xcdTJDOTVcXHUyQzk3XFx1MkM5OVxcdTJDOUJcXHUyQzlEXFx1MkM5RlxcdTJDQTFcXHUyQ0EzXFx1MkNBNVxcdTJDQTdcXHUyQ0E5XFx1MkNBQlxcdTJDQURcXHUyQ0FGXFx1MkNCMVxcdTJDQjNcXHUyQ0I1XFx1MkNCN1xcdTJDQjlcXHUyQ0JCXFx1MkNCRFxcdTJDQkZcXHUyQ0MxXFx1MkNDM1xcdTJDQzVcXHUyQ0M3XFx1MkNDOVxcdTJDQ0JcXHUyQ0NEXFx1MkNDRlxcdTJDRDFcXHUyQ0QzXFx1MkNENVxcdTJDRDdcXHUyQ0Q5XFx1MkNEQlxcdTJDRERcXHUyQ0RGXFx1MkNFMVxcdTJDRTNcXHUyQ0U0XFx1MkNFQ1xcdTJDRUVcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHVBNjQxXFx1QTY0M1xcdUE2NDVcXHVBNjQ3XFx1QTY0OVxcdUE2NEJcXHVBNjREXFx1QTY0RlxcdUE2NTFcXHVBNjUzXFx1QTY1NVxcdUE2NTdcXHVBNjU5XFx1QTY1QlxcdUE2NURcXHVBNjVGXFx1QTY2MVxcdUE2NjNcXHVBNjY1XFx1QTY2N1xcdUE2NjlcXHVBNjZCXFx1QTY2RFxcdUE2ODFcXHVBNjgzXFx1QTY4NVxcdUE2ODdcXHVBNjg5XFx1QTY4QlxcdUE2OERcXHVBNjhGXFx1QTY5MVxcdUE2OTNcXHVBNjk1XFx1QTY5N1xcdUE2OTlcXHVBNjlCXFx1QTcyM1xcdUE3MjVcXHVBNzI3XFx1QTcyOVxcdUE3MkJcXHVBNzJEXFx1QTcyRi1cXHVBNzMxXFx1QTczM1xcdUE3MzVcXHVBNzM3XFx1QTczOVxcdUE3M0JcXHVBNzNEXFx1QTczRlxcdUE3NDFcXHVBNzQzXFx1QTc0NVxcdUE3NDdcXHVBNzQ5XFx1QTc0QlxcdUE3NERcXHVBNzRGXFx1QTc1MVxcdUE3NTNcXHVBNzU1XFx1QTc1N1xcdUE3NTlcXHVBNzVCXFx1QTc1RFxcdUE3NUZcXHVBNzYxXFx1QTc2M1xcdUE3NjVcXHVBNzY3XFx1QTc2OVxcdUE3NkJcXHVBNzZEXFx1QTc2RlxcdUE3NzEtXFx1QTc3OFxcdUE3N0FcXHVBNzdDXFx1QTc3RlxcdUE3ODFcXHVBNzgzXFx1QTc4NVxcdUE3ODdcXHVBNzhDXFx1QTc4RVxcdUE3OTFcXHVBNzkzLVxcdUE3OTVcXHVBNzk3XFx1QTc5OVxcdUE3OUJcXHVBNzlEXFx1QTc5RlxcdUE3QTFcXHVBN0EzXFx1QTdBNVxcdUE3QTdcXHVBN0E5XFx1QTdCNVxcdUE3QjdcXHVBN0ZBXFx1QUIzMC1cXHVBQjVBXFx1QUI2MC1cXHVBQjY1XFx1QUI3MC1cXHVBQkJGXFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkY0MS1cXHVGRjVBXXxcXHVEODAxW1xcdURDMjgtXFx1REM0RlxcdURDRDgtXFx1RENGQl18XFx1RDgwM1tcXHVEQ0MwLVxcdURDRjJdfFxcdUQ4MDZbXFx1RENDMC1cXHVEQ0RGXXxcXHVEODM1W1xcdURDMUEtXFx1REMzM1xcdURDNEUtXFx1REM1NFxcdURDNTYtXFx1REM2N1xcdURDODItXFx1REM5QlxcdURDQjYtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdURDQ0ZcXHVEQ0VBLVxcdUREMDNcXHVERDFFLVxcdUREMzdcXHVERDUyLVxcdURENkJcXHVERDg2LVxcdUREOUZcXHVEREJBLVxcdURERDNcXHVEREVFLVxcdURFMDdcXHVERTIyLVxcdURFM0JcXHVERTU2LVxcdURFNkZcXHVERThBLVxcdURFQTVcXHVERUMyLVxcdURFREFcXHVERURDLVxcdURFRTFcXHVERUZDLVxcdURGMTRcXHVERjE2LVxcdURGMUJcXHVERjM2LVxcdURGNEVcXHVERjUwLVxcdURGNTVcXHVERjcwLVxcdURGODhcXHVERjhBLVxcdURGOEZcXHVERkFBLVxcdURGQzJcXHVERkM0LVxcdURGQzlcXHVERkNCXXxcXHVEODNBW1xcdUREMjItXFx1REQ0M10vLFxuICBMdDogL1tcXHUwMUM1XFx1MDFDOFxcdTAxQ0JcXHUwMUYyXFx1MUY4OC1cXHUxRjhGXFx1MUY5OC1cXHUxRjlGXFx1MUZBOC1cXHUxRkFGXFx1MUZCQ1xcdTFGQ0NcXHUxRkZDXS8sXG4gIExtOiAvW1xcdTAyQjAtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3NFxcdTAzN0FcXHUwNTU5XFx1MDY0MFxcdTA2RTVcXHUwNkU2XFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDk3MVxcdTBFNDZcXHUwRUM2XFx1MTBGQ1xcdTE3RDdcXHUxODQzXFx1MUFBN1xcdTFDNzgtXFx1MUM3RFxcdTFEMkMtXFx1MUQ2QVxcdTFENzhcXHUxRDlCLVxcdTFEQkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTJDN0NcXHUyQzdEXFx1MkQ2RlxcdTJFMkZcXHUzMDA1XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwOURcXHUzMDlFXFx1MzBGQy1cXHUzMEZFXFx1QTAxNVxcdUE0RjgtXFx1QTRGRFxcdUE2MENcXHVBNjdGXFx1QTY5Q1xcdUE2OURcXHVBNzE3LVxcdUE3MUZcXHVBNzcwXFx1QTc4OFxcdUE3RjhcXHVBN0Y5XFx1QTlDRlxcdUE5RTZcXHVBQTcwXFx1QUFERFxcdUFBRjNcXHVBQUY0XFx1QUI1Qy1cXHVBQjVGXFx1RkY3MFxcdUZGOUVcXHVGRjlGXXxcXHVEODFBW1xcdURGNDAtXFx1REY0M118XFx1RDgxQltcXHVERjkzLVxcdURGOUZcXHVERkUwXS8sXG4gIExvOiAvW1xceEFBXFx4QkFcXHUwMUJCXFx1MDFDMC1cXHUwMUMzXFx1MDI5NFxcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDYzRlxcdTA2NDEtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDgwMC1cXHUwODE1XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDhCNi1cXHUwOEJEXFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcyLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzgwXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDU0LVxcdTBENTZcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDVcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwRDAtXFx1MTBGQVxcdTEwRkQtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEQ1xcdTE4MjAtXFx1MTg0MlxcdTE4NDQtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3N1xcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MjEzNS1cXHUyMTM4XFx1MkQzMC1cXHUyRDY3XFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MzAwNlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTAxNFxcdUEwMTYtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGN1xcdUE1MDAtXFx1QTYwQlxcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY2RVxcdUE2QTAtXFx1QTZFNVxcdUE3OEZcXHVBN0Y3XFx1QTdGQi1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUUwLVxcdUE5RTRcXHVBOUU3LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNkZcXHVBQTcxLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCXFx1QUFEQ1xcdUFBRTAtXFx1QUFFQVxcdUFBRjJcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjY2LVxcdUZGNkZcXHVGRjcxLVxcdUZGOURcXHVGRkEwLVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERTgwLVxcdURFOUNcXHVERUEwLVxcdURFRDBcXHVERjAwLVxcdURGMUZcXHVERjMwLVxcdURGNDBcXHVERjQyLVxcdURGNDlcXHVERjUwLVxcdURGNzVcXHVERjgwLVxcdURGOURcXHVERkEwLVxcdURGQzNcXHVERkM4LVxcdURGQ0ZdfFxcdUQ4MDFbXFx1REM1MC1cXHVEQzlEXFx1REQwMC1cXHVERDI3XFx1REQzMC1cXHVERDYzXFx1REUwMC1cXHVERjM2XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjY3XXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzYwLVxcdURDNzZcXHVEQzgwLVxcdURDOUVcXHVEQ0UwLVxcdURDRjJcXHVEQ0Y0XFx1RENGNVxcdUREMDAtXFx1REQxNVxcdUREMjAtXFx1REQzOVxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNjAtXFx1REU3Q1xcdURFODAtXFx1REU5Q1xcdURFQzAtXFx1REVDN1xcdURFQzktXFx1REVFNFxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY3MlxcdURGODAtXFx1REY5MV18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhdfFxcdUQ4MDRbXFx1REMwMy1cXHVEQzM3XFx1REM4My1cXHVEQ0FGXFx1RENEMC1cXHVEQ0U4XFx1REQwMy1cXHVERDI2XFx1REQ1MC1cXHVERDcyXFx1REQ3NlxcdUREODMtXFx1RERCMlxcdUREQzEtXFx1RERDNFxcdUREREFcXHVERERDXFx1REUwMC1cXHVERTExXFx1REUxMy1cXHVERTJCXFx1REU4MC1cXHVERTg2XFx1REU4OFxcdURFOEEtXFx1REU4RFxcdURFOEYtXFx1REU5RFxcdURFOUYtXFx1REVBOFxcdURFQjAtXFx1REVERVxcdURGMDUtXFx1REYwQ1xcdURGMEZcXHVERjEwXFx1REYxMy1cXHVERjI4XFx1REYyQS1cXHVERjMwXFx1REYzMlxcdURGMzNcXHVERjM1LVxcdURGMzlcXHVERjNEXFx1REY1MFxcdURGNUQtXFx1REY2MV18XFx1RDgwNVtcXHVEQzAwLVxcdURDMzRcXHVEQzQ3LVxcdURDNEFcXHVEQzgwLVxcdURDQUZcXHVEQ0M0XFx1RENDNVxcdURDQzdcXHVERDgwLVxcdUREQUVcXHVEREQ4LVxcdUREREJcXHVERTAwLVxcdURFMkZcXHVERTQ0XFx1REU4MC1cXHVERUFBXFx1REYwMC1cXHVERjE5XXxcXHVEODA2W1xcdURDRkZcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDdbXFx1REMwMC1cXHVEQzA4XFx1REMwQS1cXHVEQzJFXFx1REM0MFxcdURDNzItXFx1REM4Rl18XFx1RDgwOFtcXHVEQzAwLVxcdURGOTldfFxcdUQ4MDlbXFx1REM4MC1cXHVERDQzXXxbXFx1RDgwQ1xcdUQ4MUMtXFx1RDgyMFxcdUQ4NDAtXFx1RDg2OFxcdUQ4NkEtXFx1RDg2Q1xcdUQ4NkYtXFx1RDg3Ml1bXFx1REMwMC1cXHVERkZGXXxcXHVEODBEW1xcdURDMDAtXFx1REMyRV18XFx1RDgxMVtcXHVEQzAwLVxcdURFNDZdfFxcdUQ4MUFbXFx1REMwMC1cXHVERTM4XFx1REU0MC1cXHVERTVFXFx1REVEMC1cXHVERUVEXFx1REYwMC1cXHVERjJGXFx1REY2My1cXHVERjc3XFx1REY3RC1cXHVERjhGXXxcXHVEODFCW1xcdURGMDAtXFx1REY0NFxcdURGNTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4NjlbXFx1REMwMC1cXHVERUQ2XFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF0vLFxuXG4gIC8vIE51bWJlcnNcbiAgTmw6IC9bXFx1MTZFRS1cXHUxNkYwXFx1MjE2MC1cXHUyMTgyXFx1MjE4NS1cXHUyMTg4XFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzgtXFx1MzAzQVxcdUE2RTYtXFx1QTZFRl18XFx1RDgwMFtcXHVERDQwLVxcdURENzRcXHVERjQxXFx1REY0QVxcdURGRDEtXFx1REZENV18XFx1RDgwOVtcXHVEQzAwLVxcdURDNkVdLyxcbiAgTmQ6IC9bMC05XFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XFx1MDdDMC1cXHUwN0M5XFx1MDk2Ni1cXHUwOTZGXFx1MDlFNi1cXHUwOUVGXFx1MEE2Ni1cXHUwQTZGXFx1MEFFNi1cXHUwQUVGXFx1MEI2Ni1cXHUwQjZGXFx1MEJFNi1cXHUwQkVGXFx1MEM2Ni1cXHUwQzZGXFx1MENFNi1cXHUwQ0VGXFx1MEQ2Ni1cXHUwRDZGXFx1MERFNi1cXHUwREVGXFx1MEU1MC1cXHUwRTU5XFx1MEVEMC1cXHUwRUQ5XFx1MEYyMC1cXHUwRjI5XFx1MTA0MC1cXHUxMDQ5XFx1MTA5MC1cXHUxMDk5XFx1MTdFMC1cXHUxN0U5XFx1MTgxMC1cXHUxODE5XFx1MTk0Ni1cXHUxOTRGXFx1MTlEMC1cXHUxOUQ5XFx1MUE4MC1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUI1MC1cXHUxQjU5XFx1MUJCMC1cXHUxQkI5XFx1MUM0MC1cXHUxQzQ5XFx1MUM1MC1cXHUxQzU5XFx1QTYyMC1cXHVBNjI5XFx1QThEMC1cXHVBOEQ5XFx1QTkwMC1cXHVBOTA5XFx1QTlEMC1cXHVBOUQ5XFx1QTlGMC1cXHVBOUY5XFx1QUE1MC1cXHVBQTU5XFx1QUJGMC1cXHVBQkY5XFx1RkYxMC1cXHVGRjE5XXxcXHVEODAxW1xcdURDQTAtXFx1RENBOV18XFx1RDgwNFtcXHVEQzY2LVxcdURDNkZcXHVEQ0YwLVxcdURDRjlcXHVERDM2LVxcdUREM0ZcXHVEREQwLVxcdURERDlcXHVERUYwLVxcdURFRjldfFtcXHVEODA1XFx1RDgwN11bXFx1REM1MC1cXHVEQzU5XFx1RENEMC1cXHVEQ0Q5XFx1REU1MC1cXHVERTU5XFx1REVDMC1cXHVERUM5XFx1REYzMC1cXHVERjM5XXxcXHVEODA2W1xcdURDRTAtXFx1RENFOV18XFx1RDgxQVtcXHVERTYwLVxcdURFNjlcXHVERjUwLVxcdURGNTldfFxcdUQ4MzVbXFx1REZDRS1cXHVERkZGXXxcXHVEODNBW1xcdURENTAtXFx1REQ1OV0vLFxuXG4gIC8vIE1hcmtzXG4gIE1uOiAvW1xcdTAzMDAtXFx1MDM2RlxcdTA0ODMtXFx1MDQ4N1xcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MTAtXFx1MDYxQVxcdTA2NEItXFx1MDY1RlxcdTA2NzBcXHUwNkQ2LVxcdTA2RENcXHUwNkRGLVxcdTA2RTRcXHUwNkU3XFx1MDZFOFxcdTA2RUEtXFx1MDZFRFxcdTA3MTFcXHUwNzMwLVxcdTA3NEFcXHUwN0E2LVxcdTA3QjBcXHUwN0VCLVxcdTA3RjNcXHUwODE2LVxcdTA4MTlcXHUwODFCLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MkRcXHUwODU5LVxcdTA4NUJcXHUwOEQ0LVxcdTA4RTFcXHUwOEUzLVxcdTA5MDJcXHUwOTNBXFx1MDkzQ1xcdTA5NDEtXFx1MDk0OFxcdTA5NERcXHUwOTUxLVxcdTA5NTdcXHUwOTYyXFx1MDk2M1xcdTA5ODFcXHUwOUJDXFx1MDlDMS1cXHUwOUM0XFx1MDlDRFxcdTA5RTJcXHUwOUUzXFx1MEEwMVxcdTBBMDJcXHUwQTNDXFx1MEE0MVxcdTBBNDJcXHUwQTQ3XFx1MEE0OFxcdTBBNEItXFx1MEE0RFxcdTBBNTFcXHUwQTcwXFx1MEE3MVxcdTBBNzVcXHUwQTgxXFx1MEE4MlxcdTBBQkNcXHUwQUMxLVxcdTBBQzVcXHUwQUM3XFx1MEFDOFxcdTBBQ0RcXHUwQUUyXFx1MEFFM1xcdTBCMDFcXHUwQjNDXFx1MEIzRlxcdTBCNDEtXFx1MEI0NFxcdTBCNERcXHUwQjU2XFx1MEI2MlxcdTBCNjNcXHUwQjgyXFx1MEJDMFxcdTBCQ0RcXHUwQzAwXFx1MEMzRS1cXHUwQzQwXFx1MEM0Ni1cXHUwQzQ4XFx1MEM0QS1cXHUwQzREXFx1MEM1NVxcdTBDNTZcXHUwQzYyXFx1MEM2M1xcdTBDODFcXHUwQ0JDXFx1MENCRlxcdTBDQzZcXHUwQ0NDXFx1MENDRFxcdTBDRTJcXHUwQ0UzXFx1MEQwMVxcdTBENDEtXFx1MEQ0NFxcdTBENERcXHUwRDYyXFx1MEQ2M1xcdTBEQ0FcXHUwREQyLVxcdTBERDRcXHUwREQ2XFx1MEUzMVxcdTBFMzQtXFx1MEUzQVxcdTBFNDctXFx1MEU0RVxcdTBFQjFcXHUwRUI0LVxcdTBFQjlcXHUwRUJCXFx1MEVCQ1xcdTBFQzgtXFx1MEVDRFxcdTBGMThcXHUwRjE5XFx1MEYzNVxcdTBGMzdcXHUwRjM5XFx1MEY3MS1cXHUwRjdFXFx1MEY4MC1cXHUwRjg0XFx1MEY4NlxcdTBGODdcXHUwRjhELVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAyRC1cXHUxMDMwXFx1MTAzMi1cXHUxMDM3XFx1MTAzOVxcdTEwM0FcXHUxMDNEXFx1MTAzRVxcdTEwNThcXHUxMDU5XFx1MTA1RS1cXHUxMDYwXFx1MTA3MS1cXHUxMDc0XFx1MTA4MlxcdTEwODVcXHUxMDg2XFx1MTA4RFxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdCNFxcdTE3QjVcXHUxN0I3LVxcdTE3QkRcXHUxN0M2XFx1MTdDOS1cXHUxN0QzXFx1MTdERFxcdTE4MEItXFx1MTgwRFxcdTE4ODVcXHUxODg2XFx1MThBOVxcdTE5MjAtXFx1MTkyMlxcdTE5MjdcXHUxOTI4XFx1MTkzMlxcdTE5MzktXFx1MTkzQlxcdTFBMTdcXHUxQTE4XFx1MUExQlxcdTFBNTZcXHUxQTU4LVxcdTFBNUVcXHUxQTYwXFx1MUE2MlxcdTFBNjUtXFx1MUE2Q1xcdTFBNzMtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkRcXHUxQjAwLVxcdTFCMDNcXHUxQjM0XFx1MUIzNi1cXHUxQjNBXFx1MUIzQ1xcdTFCNDJcXHUxQjZCLVxcdTFCNzNcXHUxQjgwXFx1MUI4MVxcdTFCQTItXFx1MUJBNVxcdTFCQThcXHUxQkE5XFx1MUJBQi1cXHUxQkFEXFx1MUJFNlxcdTFCRThcXHUxQkU5XFx1MUJFRFxcdTFCRUYtXFx1MUJGMVxcdTFDMkMtXFx1MUMzM1xcdTFDMzZcXHUxQzM3XFx1MUNEMC1cXHUxQ0QyXFx1MUNENC1cXHUxQ0UwXFx1MUNFMi1cXHUxQ0U4XFx1MUNFRFxcdTFDRjRcXHUxQ0Y4XFx1MUNGOVxcdTFEQzAtXFx1MURGNVxcdTFERkItXFx1MURGRlxcdTIwRDAtXFx1MjBEQ1xcdTIwRTFcXHUyMEU1LVxcdTIwRjBcXHUyQ0VGLVxcdTJDRjFcXHUyRDdGXFx1MkRFMC1cXHUyREZGXFx1MzAyQS1cXHUzMDJEXFx1MzA5OVxcdTMwOUFcXHVBNjZGXFx1QTY3NC1cXHVBNjdEXFx1QTY5RVxcdUE2OUZcXHVBNkYwXFx1QTZGMVxcdUE4MDJcXHVBODA2XFx1QTgwQlxcdUE4MjVcXHVBODI2XFx1QThDNFxcdUE4QzVcXHVBOEUwLVxcdUE4RjFcXHVBOTI2LVxcdUE5MkRcXHVBOTQ3LVxcdUE5NTFcXHVBOTgwLVxcdUE5ODJcXHVBOUIzXFx1QTlCNi1cXHVBOUI5XFx1QTlCQ1xcdUE5RTVcXHVBQTI5LVxcdUFBMkVcXHVBQTMxXFx1QUEzMlxcdUFBMzVcXHVBQTM2XFx1QUE0M1xcdUFBNENcXHVBQTdDXFx1QUFCMFxcdUFBQjItXFx1QUFCNFxcdUFBQjdcXHVBQUI4XFx1QUFCRVxcdUFBQkZcXHVBQUMxXFx1QUFFQ1xcdUFBRURcXHVBQUY2XFx1QUJFNVxcdUFCRThcXHVBQkVEXFx1RkIxRVxcdUZFMDAtXFx1RkUwRlxcdUZFMjAtXFx1RkUyRl18XFx1RDgwMFtcXHVEREZEXFx1REVFMFxcdURGNzYtXFx1REY3QV18XFx1RDgwMltcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNl18XFx1RDgwNFtcXHVEQzAxXFx1REMzOC1cXHVEQzQ2XFx1REM3Ri1cXHVEQzgxXFx1RENCMy1cXHVEQ0I2XFx1RENCOVxcdURDQkFcXHVERDAwLVxcdUREMDJcXHVERDI3LVxcdUREMkJcXHVERDJELVxcdUREMzRcXHVERDczXFx1REQ4MFxcdUREODFcXHVEREI2LVxcdUREQkVcXHVERENBLVxcdUREQ0NcXHVERTJGLVxcdURFMzFcXHVERTM0XFx1REUzNlxcdURFMzdcXHVERTNFXFx1REVERlxcdURFRTMtXFx1REVFQVxcdURGMDBcXHVERjAxXFx1REYzQ1xcdURGNDBcXHVERjY2LVxcdURGNkNcXHVERjcwLVxcdURGNzRdfFxcdUQ4MDVbXFx1REMzOC1cXHVEQzNGXFx1REM0Mi1cXHVEQzQ0XFx1REM0NlxcdURDQjMtXFx1RENCOFxcdURDQkFcXHVEQ0JGXFx1RENDMFxcdURDQzJcXHVEQ0MzXFx1RERCMi1cXHVEREI1XFx1RERCQ1xcdUREQkRcXHVEREJGXFx1RERDMFxcdURERENcXHVEREREXFx1REUzMy1cXHVERTNBXFx1REUzRFxcdURFM0ZcXHVERTQwXFx1REVBQlxcdURFQURcXHVERUIwLVxcdURFQjVcXHVERUI3XFx1REYxRC1cXHVERjFGXFx1REYyMi1cXHVERjI1XFx1REYyNy1cXHVERjJCXXxcXHVEODA3W1xcdURDMzAtXFx1REMzNlxcdURDMzgtXFx1REMzRFxcdURDM0ZcXHVEQzkyLVxcdURDQTdcXHVEQ0FBLVxcdURDQjBcXHVEQ0IyXFx1RENCM1xcdURDQjVcXHVEQ0I2XXxcXHVEODFBW1xcdURFRjAtXFx1REVGNFxcdURGMzAtXFx1REYzNl18XFx1RDgxQltcXHVERjhGLVxcdURGOTJdfFxcdUQ4MkZbXFx1REM5RFxcdURDOUVdfFxcdUQ4MzRbXFx1REQ2Ny1cXHVERDY5XFx1REQ3Qi1cXHVERDgyXFx1REQ4NS1cXHVERDhCXFx1RERBQS1cXHVEREFEXFx1REU0Mi1cXHVERTQ0XXxcXHVEODM2W1xcdURFMDAtXFx1REUzNlxcdURFM0ItXFx1REU2Q1xcdURFNzVcXHVERTg0XFx1REU5Qi1cXHVERTlGXFx1REVBMS1cXHVERUFGXXxcXHVEODM4W1xcdURDMDAtXFx1REMwNlxcdURDMDgtXFx1REMxOFxcdURDMUItXFx1REMyMVxcdURDMjNcXHVEQzI0XFx1REMyNi1cXHVEQzJBXXxcXHVEODNBW1xcdURDRDAtXFx1RENENlxcdURENDQtXFx1REQ0QV18XFx1REI0MFtcXHVERDAwLVxcdURERUZdLyxcbiAgTWM6IC9bXFx1MDkwMy1cXHUwOTAzXXxbXFx1MDkzRS1cXHUwOTQwXXxbXFx1MDk0OS1cXHUwOTRDXXxbXFx1MDk4Mi1cXHUwOTgzXXxbXFx1MDlCRS1cXHUwOUMwXXxbXFx1MDlDNy1cXHUwOUM4XXxbXFx1MDlDQi1cXHUwOUNDXXxbXFx1MDlENy1cXHUwOUQ3XXxbXFx1MEEzRS1cXHUwQTQwXXxbXFx1MEE4My1cXHUwQTgzXXxbXFx1MEFCRS1cXHUwQUMwXXxbXFx1MEFDOS1cXHUwQUM5XXxbXFx1MEFDQi1cXHUwQUNDXXxbXFx1MEIwMi1cXHUwQjAzXXxbXFx1MEIzRS1cXHUwQjNFXXxbXFx1MEI0MC1cXHUwQjQwXXxbXFx1MEI0Ny1cXHUwQjQ4XXxbXFx1MEI0Qi1cXHUwQjRDXXxbXFx1MEI1Ny1cXHUwQjU3XXxbXFx1MEI4My1cXHUwQjgzXXxbXFx1MEJCRS1cXHUwQkJGXXxbXFx1MEJDMS1cXHUwQkMyXXxbXFx1MEJDNi1cXHUwQkM4XXxbXFx1MEJDQS1cXHUwQkNDXXxbXFx1MEJENy1cXHUwQkQ3XXxbXFx1MEMwMS1cXHUwQzAzXXxbXFx1MEM0MS1cXHUwQzQ0XXxbXFx1MEM4Mi1cXHUwQzgzXXxbXFx1MENCRS1cXHUwQ0JFXXxbXFx1MENDMC1cXHUwQ0M0XXxbXFx1MENDNy1cXHUwQ0M4XXxbXFx1MENDQS1cXHUwQ0NCXXxbXFx1MENENS1cXHUwQ0Q2XXxbXFx1MEQwMi1cXHUwRDAzXXxbXFx1MEQzRS1cXHUwRDQwXXxbXFx1MEQ0Ni1cXHUwRDQ4XXxbXFx1MEQ0QS1cXHUwRDRDXXxbXFx1MEQ1Ny1cXHUwRDU3XXxbXFx1MEYzRS1cXHUwRjNGXXxbXFx1MEY3Ri1cXHUwRjdGXS8sXG5cbiAgLy8gUHVuY3R1YXRpb24sIENvbm5lY3RvclxuICBQYzogL1tfXFx1MjAzRlxcdTIwNDBcXHUyMDU0XFx1RkUzM1xcdUZFMzRcXHVGRTRELVxcdUZFNEZcXHVGRjNGXS8sXG5cbiAgLy8gU2VwYXJhdG9yLCBTcGFjZVxuICBaczogL1sgXFx4QTBcXHUxNjgwXFx1MjAwMC1cXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXS8sXG5cbiAgLy8gVGhlc2UgdHdvIGFyZSBub3QgcmVhbCBVbmljb2RlIGNhdGVnb3JpZXMsIGJ1dCBvdXIgdXNlZnVsIGZvciBPaG0uXG4gIC8vIEwgaXMgYSBjb21iaW5hdGlvbiBvZiBhbGwgdGhlIGxldHRlciBjYXRlZ29yaWVzLlxuICAvLyBMdG1vIGlzIGEgY29tYmluYXRpb24gb2YgTHQsIExtLCBhbmQgTG8uXG4gIEw6IC9bQS1aYS16XFx4QUFcXHhCNVxceEJBXFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxceEY4LVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3QS1cXHUwMzdEXFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RS1cXHUwM0ExXFx1MDNBMy1cXHUwM0Y1XFx1MDNGNy1cXHUwNDgxXFx1MDQ4QS1cXHUwNTJGXFx1MDUzMS1cXHUwNTU2XFx1MDU1OVxcdTA1NjEtXFx1MDU4N1xcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzEtXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NlxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVDNlxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0Q3XFx1MTdEQ1xcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQUE3XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDN0RcXHUxQzgwLVxcdTFDODhcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTFEMDAtXFx1MURCRlxcdTFFMDAtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMkYtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTgzXFx1MjE4NFxcdTJDMDAtXFx1MkMyRVxcdTJDMzAtXFx1MkM1RVxcdTJDNjAtXFx1MkNFNFxcdTJDRUItXFx1MkNFRVxcdTJDRjJcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHUyRDMwLVxcdTJENjdcXHUyRDZGXFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MkUyRlxcdTMwMDVcXHUzMDA2XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NDAtXFx1QTY2RVxcdUE2N0YtXFx1QTY5RFxcdUE2QTAtXFx1QTZFNVxcdUE3MTctXFx1QTcxRlxcdUE3MjItXFx1QTc4OFxcdUE3OEItXFx1QTdBRVxcdUE3QjAtXFx1QTdCN1xcdUE3RjctXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlDRlxcdUE5RTAtXFx1QTlFNFxcdUE5RTYtXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI2NVxcdUFCNzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzAwLVxcdURDOURcXHVEQ0IwLVxcdURDRDNcXHVEQ0Q4LVxcdURDRkJcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OFxcdURDODAtXFx1RENCMlxcdURDQzAtXFx1RENGMl18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENBMC1cXHVEQ0RGXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjQwLVxcdURGNDNcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MFxcdURGOTMtXFx1REY5RlxcdURGRTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4MzVbXFx1REMwMC1cXHVEQzU0XFx1REM1Ni1cXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjlcXHVEQ0JCXFx1RENCRC1cXHVEQ0MzXFx1RENDNS1cXHVERDA1XFx1REQwNy1cXHVERDBBXFx1REQwRC1cXHVERDE0XFx1REQxNi1cXHVERDFDXFx1REQxRS1cXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENTItXFx1REVBNVxcdURFQTgtXFx1REVDMFxcdURFQzItXFx1REVEQVxcdURFREMtXFx1REVGQVxcdURFRkMtXFx1REYxNFxcdURGMTYtXFx1REYzNFxcdURGMzYtXFx1REY0RVxcdURGNTAtXFx1REY2RVxcdURGNzAtXFx1REY4OFxcdURGOEEtXFx1REZBOFxcdURGQUEtXFx1REZDMlxcdURGQzQtXFx1REZDQl18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRcXHVERDAwLVxcdURENDNdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS8sXG4gIEx0bW86IC9bXFx1MDFDNVxcdTAxQzhcXHUwMUNCXFx1MDFGMlxcdTFGODgtXFx1MUY4RlxcdTFGOTgtXFx1MUY5RlxcdTFGQTgtXFx1MUZBRlxcdTFGQkNcXHUxRkNDXFx1MUZGQ118W1xcdTAyQjAtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3NFxcdTAzN0FcXHUwNTU5XFx1MDY0MFxcdTA2RTVcXHUwNkU2XFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDk3MVxcdTBFNDZcXHUwRUM2XFx1MTBGQ1xcdTE3RDdcXHUxODQzXFx1MUFBN1xcdTFDNzgtXFx1MUM3RFxcdTFEMkMtXFx1MUQ2QVxcdTFENzhcXHUxRDlCLVxcdTFEQkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTJDN0NcXHUyQzdEXFx1MkQ2RlxcdTJFMkZcXHUzMDA1XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwOURcXHUzMDlFXFx1MzBGQy1cXHUzMEZFXFx1QTAxNVxcdUE0RjgtXFx1QTRGRFxcdUE2MENcXHVBNjdGXFx1QTY5Q1xcdUE2OURcXHVBNzE3LVxcdUE3MUZcXHVBNzcwXFx1QTc4OFxcdUE3RjhcXHVBN0Y5XFx1QTlDRlxcdUE5RTZcXHVBQTcwXFx1QUFERFxcdUFBRjNcXHVBQUY0XFx1QUI1Qy1cXHVBQjVGXFx1RkY3MFxcdUZGOUVcXHVGRjlGXXxcXHVEODFBW1xcdURGNDAtXFx1REY0M118XFx1RDgxQltcXHVERjkzLVxcdURGOUZcXHVERkUwXXxbXFx4QUFcXHhCQVxcdTAxQkJcXHUwMUMwLVxcdTAxQzNcXHUwMjk0XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjNGXFx1MDY0MS1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwODAwLVxcdTA4MTVcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzItXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NVxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBEMC1cXHUxMEZBXFx1MTBGRC1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0RDXFx1MTgyMC1cXHUxODQyXFx1MTg0NC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzc3XFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUyMTM1LVxcdTIxMzhcXHUyRDMwLVxcdTJENjdcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUzMDA2XFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBMDE0XFx1QTAxNi1cXHVBNDhDXFx1QTREMC1cXHVBNEY3XFx1QTUwMC1cXHVBNjBCXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjZFXFx1QTZBMC1cXHVBNkU1XFx1QTc4RlxcdUE3RjdcXHVBN0ZCLVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5RTAtXFx1QTlFNFxcdUE5RTctXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE2RlxcdUFBNzEtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREJcXHVBQURDXFx1QUFFMC1cXHVBQUVBXFx1QUFGMlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGNjYtXFx1RkY2RlxcdUZGNzEtXFx1RkY5RFxcdUZGQTAtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzUwLVxcdURDOURcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS9cbn07XG4iXX0=
