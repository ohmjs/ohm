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

  generateExamples: function(grammar, examples, inSyntacticContext, actuals) {
    // Start with a example generated from the Terminal...
    var str = this.obj.generateExamples(grammar, examples, inSyntacticContext, actuals).value;

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
    // The following rules can't be written in userland because they reference
    // `any` and `end` directly.
    any: {body: pexprs.any, formals: [], description: 'any object'},
    end: {body: pexprs.end, formals: [], description: 'end of input'},

    caseInsensitive: {
      body: new CaseInsensitiveTerminal(new pexprs.Param(0)),
      formals: ['expr']
    },

    // The following rule is invoked implicitly by syntactic rules to skip spaces.
    spaces: {
      body: new pexprs.Star(new pexprs.Apply('space')),
      formals: []
    },

    // The `space` rule must be defined here because it's referenced by `spaces`.
    space: {
      body: new pexprs.Range('\x00', ' '),
      formals: [],
      description: 'a space'
    },

    // These rules are implemented natively because they use UnicodeChar directly, which is
    // not part of the Ohm grammar.
    lower: {
      body: new pexprs.UnicodeChar('Ll'),
      formals: [],
      description: 'a lowercase letter'
    },
    upper: {
      body: new pexprs.UnicodeChar('Lu'),
      formals: [],
      description: 'an uppercase letter'
    },

    // The union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not
    // in Ll or Lu.
    unicodeLtmo: {
      body: new pexprs.UnicodeChar('Ltmo'),
      formals: []
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
var nodes = require('./nodes');
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

// Returns a `MatchResult` that can be fed into operations or attributes that care
// about the whitespace that was implicitly skipped over by syntactic rules. This
// is useful for doing things with comments, e.g., syntax highlighting.
MatchResult.prototype.getDiscardedSpaces = function() {
  if (this.failed()) {
    throw new Error('Cannot get discarded spaces of failed match result');
  }

  // Populate the memo table with the info for this match result, in case
  // it's been invalidated by subsequent matches.
  this.matcher.setInput(this.input);
  this.matcher._match(this.startExpr, false);

  var grammar = this.matcher.grammar;
  var memoTable = this.matcher.memoTable;

  var intervals = [new Interval(this.input, 0, this.input.length)];

  // Subtract the interval of each terminal from the set of intervals above.
  var s = grammar.createSemantics().addOperation('subtractTerminals', {
    _nonterminal: function(children) {
      children.forEach(function(child) {
        child.subtractTerminals();
      });
    },
    _terminal: function() {
      var t = this;
      intervals = intervals
          .map(function(interval) { return interval.minus(t.source); })
          .reduce(function(xs, ys) { return xs.concat(ys); }, []);
    }
  });
  s(this).subtractTerminals();

  // Now, at the beginning of each interval, there should be a memo table entry for the 'spaces'
  // rule, representing the node that was discarded. Collect those along with their offsets.
  var offsets = intervals.map(function(interval) {
    return interval.startIdx;
  });
  var discardedNodes = offsets.map(function(pos) {
    var posInfo = memoTable[pos];
    var memoRec = posInfo.memo.spaces;
    return memoRec.value;
  });

  // Rather than return a bunch of CST nodes and make the caller of this method loop over them,
  // we can construct a single CST node that is the parent of all of the discarded nodes. An
  // `IterationNode` is the obvious choice for this.
  var iter = new nodes.IterationNode(grammar, discardedNodes, offsets, -1, false);

  // But remember that a CST node can't be used directly by clients. What we really need to return
  // from this method is a successful `MatchResult` that can be used with the clients' semantics.
  // We already have one -- `this` -- but it's got a different CST node inside. So we create a new
  // object that delegates to `this`, and override its `_cst` and `_cstOffset` properties.
  var r = Object.create(this);
  r._cst = iter;
  r._cstOffset = 0;

  // We also override its `getDiscardedSpaces` method, in case someone decides to call it.
  r.getDiscardedSpaces = function() { return r; };

  return r;
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

},{"./Interval":34,"./common":42,"./nodes":45,"./util":63}],36:[function(require,module,exports){
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

function Node(grammar, ctorName, children, childOffsets, matchLength) {
  this.grammar = grammar;
  this.ctorName = ctorName;
  this.children = children || [];
  this.childOffsets = childOffsets || [];
  this.matchLength = matchLength;
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

function TerminalNode(grammar, value) {
  var matchLength = value ? value.length : 0;
  Node.call(this, grammar, '_terminal', [], [], matchLength);
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
  Node.call(this, grammar, ruleName, children, childOffsets, matchLength);
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
  Node.call(this, grammar, '_iter', children, childOffsets, matchLength);
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
  return new Failure(this, this.toDisplayString(), 'description');
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
// These are just categories that are used in ES5/ES6.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwiZGlzdC9vaG0tZ3JhbW1hci5qcyIsImRpc3Qvb3BlcmF0aW9ucy1hbmQtYXR0cmlidXRlcy5qcyIsImV4dHJhcy9WaXNpdG9yRmFtaWx5LmpzIiwiZXh0cmFzL2luZGV4LmpzIiwiZXh0cmFzL3NlbWFudGljcy10b0FTVC5qcyIsIm5vZGVfbW9kdWxlcy9kL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2Fzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9hc3NpZ24vaXMtaW1wbGVtZW50ZWQuanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3QvYXNzaWduL3NoaW0uanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3QvaXMtY2FsbGFibGUuanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3Qva2V5cy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9rZXlzL2lzLWltcGxlbWVudGVkLmpzIiwibm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2tleXMvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9ub3JtYWxpemUtb3B0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC92YWxpZC12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9lczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2VzNS1leHQvc3RyaW5nLyMvY29udGFpbnMvaXMtaW1wbGVtZW50ZWQuanMiLCJub2RlX21vZHVsZXMvZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucy9zaGltLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZXM2LXN5bWJvbC9pcy1pbXBsZW1lbnRlZC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL2lzLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9lczYtc3ltYm9sL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2VzNi1zeW1ib2wvdmFsaWRhdGUtc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3V0aWwtZXh0ZW5kL2V4dGVuZC5qcyIsInNyYy9CdWlsZGVyLmpzIiwic3JjL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLmpzIiwic3JjL0ZhaWx1cmUuanMiLCJzcmMvR3JhbW1hci5qcyIsInNyYy9HcmFtbWFyRGVjbC5qcyIsInNyYy9JbnB1dFN0cmVhbS5qcyIsInNyYy9JbnRlcnZhbC5qcyIsInNyYy9NYXRjaFJlc3VsdC5qcyIsInNyYy9NYXRjaFN0YXRlLmpzIiwic3JjL01hdGNoZXIuanMiLCJzcmMvTmFtZXNwYWNlLmpzIiwic3JjL1Bvc0luZm8uanMiLCJzcmMvU2VtYW50aWNzLmpzIiwic3JjL1RyYWNlLmpzIiwic3JjL2NvbW1vbi5qcyIsInNyYy9lcnJvcnMuanMiLCJzcmMvbWFpbi5qcyIsInNyYy9ub2Rlcy5qcyIsInNyYy9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZS5qcyIsInNyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJzcmMvcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5LmpzIiwic3JjL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUuanMiLCJzcmMvcGV4cHJzLWNoZWNrLmpzIiwic3JjL3BleHBycy1ldmFsLmpzIiwic3JjL3BleHBycy1nZW5lcmF0ZUV4YW1wbGUuanMiLCJzcmMvcGV4cHJzLWdldEFyaXR5LmpzIiwic3JjL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMuanMiLCJzcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCJzcmMvcGV4cHJzLW91dHB1dFJlY2lwZS5qcyIsInNyYy9wZXhwcnMtc3Vic3RpdHV0ZVBhcmFtcy5qcyIsInNyYy9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0LmpzIiwic3JjL3BleHBycy10b0Rpc3BsYXlTdHJpbmcuanMiLCJzcmMvcGV4cHJzLXRvRmFpbHVyZS5qcyIsInNyYy9wZXhwcnMtdG9TdHJpbmcuanMiLCJzcmMvcGV4cHJzLmpzIiwic3JjL3V0aWwuanMiLCJ0aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1WEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIkJ1aWx0SW5SdWxlcyB7XFxuXFxuICBhbG51bSAgKGFuIGFscGhhLW51bWVyaWMgY2hhcmFjdGVyKVxcbiAgICA9IGxldHRlclxcbiAgICB8IGRpZ2l0XFxuXFxuICBsZXR0ZXIgIChhIGxldHRlcilcXG4gICAgPSBsb3dlclxcbiAgICB8IHVwcGVyXFxuICAgIHwgdW5pY29kZUx0bW9cXG5cXG4gIGRpZ2l0ICAoYSBkaWdpdClcXG4gICAgPSBcXFwiMFxcXCIuLlxcXCI5XFxcIlxcblxcbiAgaGV4RGlnaXQgIChhIGhleGFkZWNpbWFsIGRpZ2l0KVxcbiAgICA9IGRpZ2l0XFxuICAgIHwgXFxcImFcXFwiLi5cXFwiZlxcXCJcXG4gICAgfCBcXFwiQVxcXCIuLlxcXCJGXFxcIlxcblxcbiAgTGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBOb25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgIHwgRW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcblxcbiAgTm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IGVsZW0gKHNlcCBlbGVtKSpcXG5cXG4gIEVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSAvKiBub3RoaW5nICovXFxuXFxuICBsaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IG5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgfCBlbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuXFxuICBub25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gZWxlbSAoc2VwIGVsZW0pKlxcblxcbiAgZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IC8qIG5vdGhpbmcgKi9cXG5cXG59XCJ9LFwiQnVpbHRJblJ1bGVzXCIsbnVsbCxudWxsLHtcImFsbnVtXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgsNzhdfSxcImFuIGFscGhhLW51bWVyaWMgY2hhcmFjdGVyXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjAsNzhdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MCw2Nl19LFwibGV0dGVyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzczLDc4XX0sXCJkaWdpdFwiLFtdXV1dLFwibGV0dGVyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODIsMTQyXX0sXCJhIGxldHRlclwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNywxNDJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDcsMTEyXX0sXCJsb3dlclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTksMTI0XX0sXCJ1cHBlclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTQyXX0sXCJ1bmljb2RlTHRtb1wiLFtdXV1dLFwiZGlnaXRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDYsMTc3XX0sXCJhIGRpZ2l0XCIsW10sW1wicmFuZ2VcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjksMTc3XX0sXCIwXCIsXCI5XCJdXSxcImhleERpZ2l0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgxLDI1NF19LFwiYSBoZXhhZGVjaW1hbCBkaWdpdFwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOSwyNTRdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTksMjI0XX0sXCJkaWdpdFwiLFtdXSxbXCJyYW5nZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMSwyMzldfSxcImFcIixcImZcIl0sW1wicmFuZ2VcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDYsMjU0XX0sXCJBXCIsXCJGXCJdXV0sXCJMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTgsMzM2XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjgyLDMzNl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI4MiwzMDddfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse30sMF0sW1wicGFyYW1cIix7fSwxXV1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMxNCwzMzZdfSxcIkVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse30sMF0sW1wicGFyYW1cIix7fSwxXV1dXV0sXCJOb25lbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM0MCwzODhdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzIsMzg4XX0sW1wicGFyYW1cIix7fSwwXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDM4OF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3OCwzODZdfSxbXCJwYXJhbVwiLHt9LDFdLFtcInBhcmFtXCIse30sMF1dXV1dLFwiRW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszOTIsNDM0XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDM4LDQzOF19XV0sXCJsaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MzgsNTE2XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDYyLDUxNl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ2Miw0ODddfSxcIm5vbmVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse30sMF0sW1wicGFyYW1cIix7fSwxXV1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ5NCw1MTZdfSxcImVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse30sMF0sW1wicGFyYW1cIix7fSwxXV1dXV0sXCJub25lbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyMCw1NjhdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTIsNTY4XX0sW1wicGFyYW1cIix7fSwwXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTU3LDU2OF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1OCw1NjZdfSxbXCJwYXJhbVwiLHt9LDFdLFtcInBhcmFtXCIse30sMF1dXV1dLFwiZW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NzIsNjE0XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjE2LDYxNl19XV19XSk7XG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoW1wiZ3JhbW1hclwiLHtcInNvdXJjZVwiOlwiT2htIHtcXG5cXG4gIEdyYW1tYXJzXFxuICAgID0gR3JhbW1hcipcXG5cXG4gIEdyYW1tYXJcXG4gICAgPSBpZGVudCBTdXBlckdyYW1tYXI/IFxcXCJ7XFxcIiBSdWxlKiBcXFwifVxcXCJcXG5cXG4gIFN1cGVyR3JhbW1hclxcbiAgICA9IFxcXCI8OlxcXCIgaWRlbnRcXG5cXG4gIFJ1bGVcXG4gICAgPSBpZGVudCBGb3JtYWxzPyBydWxlRGVzY3I/IFxcXCI9XFxcIiAgUnVsZUJvZHkgIC0tIGRlZmluZVxcbiAgICB8IGlkZW50IEZvcm1hbHM/ICAgICAgICAgICAgXFxcIjo9XFxcIiBSdWxlQm9keSAgLS0gb3ZlcnJpZGVcXG4gICAgfCBpZGVudCBGb3JtYWxzPyAgICAgICAgICAgIFxcXCIrPVxcXCIgUnVsZUJvZHkgIC0tIGV4dGVuZFxcblxcbiAgUnVsZUJvZHlcXG4gICAgPSBcXFwifFxcXCI/IE5vbmVtcHR5TGlzdE9mPFRvcExldmVsVGVybSwgXFxcInxcXFwiPlxcblxcbiAgVG9wTGV2ZWxUZXJtXFxuICAgID0gU2VxIGNhc2VOYW1lICAtLSBpbmxpbmVcXG4gICAgfCBTZXFcXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiPFxcXCIgTGlzdE9mPGlkZW50LCBcXFwiLFxcXCI+IFxcXCI+XFxcIlxcblxcbiAgUGFyYW1zXFxuICAgID0gXFxcIjxcXFwiIExpc3RPZjxTZXEsIFxcXCIsXFxcIj4gXFxcIj5cXFwiXFxuXFxuICBBbHRcXG4gICAgPSBOb25lbXB0eUxpc3RPZjxTZXEsIFxcXCJ8XFxcIj5cXG5cXG4gIFNlcVxcbiAgICA9IEl0ZXIqXFxuXFxuICBJdGVyXFxuICAgID0gUHJlZCBcXFwiKlxcXCIgIC0tIHN0YXJcXG4gICAgfCBQcmVkIFxcXCIrXFxcIiAgLS0gcGx1c1xcbiAgICB8IFByZWQgXFxcIj9cXFwiICAtLSBvcHRcXG4gICAgfCBQcmVkXFxuXFxuICBQcmVkXFxuICAgID0gXFxcIn5cXFwiIExleCAgLS0gbm90XFxuICAgIHwgXFxcIiZcXFwiIExleCAgLS0gbG9va2FoZWFkXFxuICAgIHwgTGV4XFxuXFxuICBMZXhcXG4gICAgPSBcXFwiI1xcXCIgQmFzZSAgLS0gbGV4XFxuICAgIHwgQmFzZVxcblxcbiAgQmFzZVxcbiAgICA9IGlkZW50IFBhcmFtcz8gfihydWxlRGVzY3I/IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiKSAgLS0gYXBwbGljYXRpb25cXG4gICAgfCB0ZXJtaW5hbCBcXFwiLi5cXFwiIHRlcm1pbmFsICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHJhbmdlXFxuICAgIHwgdGVybWluYWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSB0ZXJtaW5hbFxcbiAgICB8IFxcXCIoXFxcIiBBbHQgXFxcIilcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gcGFyZW5cXG5cXG4gIHJ1bGVEZXNjciAgKGEgcnVsZSBkZXNjcmlwdGlvbilcXG4gICAgPSBcXFwiKFxcXCIgcnVsZURlc2NyVGV4dCBcXFwiKVxcXCJcXG5cXG4gIHJ1bGVEZXNjclRleHRcXG4gICAgPSAoflxcXCIpXFxcIiBhbnkpKlxcblxcbiAgY2FzZU5hbWVcXG4gICAgPSBcXFwiLS1cXFwiICh+XFxcIlxcXFxuXFxcIiBzcGFjZSkqIG5hbWUgKH5cXFwiXFxcXG5cXFwiIHNwYWNlKSogKFxcXCJcXFxcblxcXCIgfCAmXFxcIn1cXFwiKVxcblxcbiAgbmFtZSAgKGEgbmFtZSlcXG4gICAgPSBuYW1lRmlyc3QgbmFtZVJlc3QqXFxuXFxuICBuYW1lRmlyc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBsZXR0ZXJcXG5cXG4gIG5hbWVSZXN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgYWxudW1cXG5cXG4gIGlkZW50ICAoYW4gaWRlbnRpZmllcilcXG4gICAgPSBuYW1lXFxuXFxuICB0ZXJtaW5hbFxcbiAgICA9IFxcXCJcXFxcXFxcIlxcXCIgdGVybWluYWxDaGFyKiBcXFwiXFxcXFxcXCJcXFwiXFxuXFxuICB0ZXJtaW5hbENoYXJcXG4gICAgPSBlc2NhcGVDaGFyXFxuICAgIHwgflxcXCJcXFxcXFxcXFxcXCIgflxcXCJcXFxcXFxcIlxcXCIgflxcXCJcXFxcblxcXCIgYW55XFxuXFxuICBlc2NhcGVDaGFyICAoYW4gZXNjYXBlIHNlcXVlbmNlKVxcbiAgICA9IFxcXCJcXFxcXFxcXFxcXFxcXFxcXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBiYWNrc2xhc2hcXG4gICAgfCBcXFwiXFxcXFxcXFxcXFxcXFxcIlxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gZG91YmxlUXVvdGVcXG4gICAgfCBcXFwiXFxcXFxcXFxcXFxcJ1xcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gc2luZ2xlUXVvdGVcXG4gICAgfCBcXFwiXFxcXFxcXFxiXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gYmFja3NwYWNlXFxuICAgIHwgXFxcIlxcXFxcXFxcblxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGxpbmVGZWVkXFxuICAgIHwgXFxcIlxcXFxcXFxcclxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGNhcnJpYWdlUmV0dXJuXFxuICAgIHwgXFxcIlxcXFxcXFxcdFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHRhYlxcbiAgICB8IFxcXCJcXFxcXFxcXHVcXFwiIGhleERpZ2l0IGhleERpZ2l0IGhleERpZ2l0IGhleERpZ2l0ICAtLSB1bmljb2RlRXNjYXBlXFxuICAgIHwgXFxcIlxcXFxcXFxceFxcXCIgaGV4RGlnaXQgaGV4RGlnaXQgICAgICAgICAgICAgICAgICAgIC0tIGhleEVzY2FwZVxcblxcbiAgc3BhY2VcXG4gICArPSBjb21tZW50XFxuXFxuICBjb21tZW50XFxuICAgID0gXFxcIi8vXFxcIiAoflxcXCJcXFxcblxcXCIgYW55KSogXFxcIlxcXFxuXFxcIiAgLS0gc2luZ2xlTGluZVxcbiAgICB8IFxcXCIvKlxcXCIgKH5cXFwiKi9cXFwiIGFueSkqIFxcXCIqL1xcXCIgIC0tIG11bHRpTGluZVxcblxcbiAgdG9rZW5zID0gdG9rZW4qXFxuXFxuICB0b2tlbiA9IGNhc2VOYW1lIHwgY29tbWVudCB8IGlkZW50IHwgb3BlcmF0b3IgfCBwdW5jdHVhdGlvbiB8IHRlcm1pbmFsIHwgYW55XFxuXFxuICBvcGVyYXRvciA9IFxcXCI8OlxcXCIgfCBcXFwiPVxcXCIgfCBcXFwiOj1cXFwiIHwgXFxcIis9XFxcIiB8IFxcXCIqXFxcIiB8IFxcXCIrXFxcIiB8IFxcXCI/XFxcIiB8IFxcXCJ+XFxcIiB8IFxcXCImXFxcIlxcblxcbiAgcHVuY3R1YXRpb24gPSBcXFwiPFxcXCIgfCBcXFwiPlxcXCIgfCBcXFwiLFxcXCIgfCBcXFwiLS1cXFwiXFxufVwifSxcIk9obVwiLG51bGwsXCJHcmFtbWFyc1wiLHtcIkdyYW1tYXJzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOSwzMl19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0LDMyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQsMzFdfSxcIkdyYW1tYXJcIixbXV1dXSxcIkdyYW1tYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNiw4M119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTAsODNdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MCw1NV19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTYsNjldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1Niw2OF19LFwiU3VwZXJHcmFtbWFyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcwLDczXX0sXCJ7XCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NCw3OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0LDc4XX0sXCJSdWxlXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwLDgzXX0sXCJ9XCJdXV0sXCJTdXBlckdyYW1tYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NywxMTZdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNiwxMTZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNiwxMTBdfSxcIjw6XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMSwxMTZdfSxcImlkZW50XCIsW11dXV0sXCJSdWxlX2RlZmluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxODFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxNzBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTM2XX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzcsMTQ1XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3LDE0NF19LFwiRm9ybWFsc1wiLFtdXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2LDE1Nl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NiwxNTVdfSxcInJ1bGVEZXNjclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTcsMTYwXX0sXCI9XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MiwxNzBdfSxcIlJ1bGVCb2R5XCIsW11dXV0sXCJSdWxlX292ZXJyaWRlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDI0MF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDIyN119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwxOTNdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NCwyMDJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTQsMjAxXX0sXCJGb3JtYWxzXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNCwyMThdfSxcIjo9XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOSwyMjddfSxcIlJ1bGVCb2R5XCIsW11dXV0sXCJSdWxlX2V4dGVuZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NywyOTddfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NywyODZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDcsMjUyXX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTMsMjYxXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUzLDI2MF19LFwiRm9ybWFsc1wiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNzMsMjc3XX0sXCIrPVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNzgsMjg2XX0sXCJSdWxlQm9keVwiLFtdXV1dLFwiUnVsZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMCwyOTddfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwyOTddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTcwXX0sXCJSdWxlX2RlZmluZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMjI3XX0sXCJSdWxlX292ZXJyaWRlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NywyODZdfSxcIlJ1bGVfZXh0ZW5kXCIsW11dXV0sXCJSdWxlQm9keVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMwMSwzNTRdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMxNiwzNTRdfSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMTYsMzIwXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMTYsMzE5XX0sXCJ8XCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMjEsMzU0XX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMzYsMzQ4XX0sXCJUb3BMZXZlbFRlcm1cIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNTAsMzUzXX0sXCJ8XCJdXV1dXSxcIlRvcExldmVsVGVybV9pbmxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsNDAwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsMzg5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDM4MF19LFwiU2VxXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4MSwzODldfSxcImNhc2VOYW1lXCIsW11dXV0sXCJUb3BMZXZlbFRlcm1cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNTgsNDEwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsNDEwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDM4OV19LFwiVG9wTGV2ZWxUZXJtX2lubGluZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MDcsNDEwXX0sXCJTZXFcIixbXV1dXSxcIkZvcm1hbHNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MTQsNDU0XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MjgsNDU0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MjgsNDMxXX0sXCI8XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQzMiw0NTBdfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MzksNDQ0XX0sXCJpZGVudFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ0Niw0NDldfSxcIixcIl1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ1MSw0NTRdfSxcIj5cIl1dXSxcIlBhcmFtc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ1OCw0OTVdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ3MSw0OTVdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ3MSw0NzRdfSxcIjxcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDc1LDQ5MV19LFwiTGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ4Miw0ODVdfSxcIlNlcVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ4Nyw0OTBdfSxcIixcIl1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ5Miw0OTVdfSxcIj5cIl1dXSxcIkFsdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ5OSw1MzNdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUwOSw1MzNdfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyNCw1MjddfSxcIlNlcVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyOSw1MzJdfSxcInxcIl1dXV0sXCJTZXFcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MzcsNTUyXX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTQ3LDU1Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU0Nyw1NTFdfSxcIkl0ZXJcIixbXV1dXSxcIkl0ZXJfc3RhclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Nyw1ODRdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Nyw1NzVdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjcsNTcxXX0sXCJQcmVkXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTcyLDU3NV19LFwiKlwiXV1dLFwiSXRlcl9wbHVzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTkxLDYwOF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTkxLDU5OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5MSw1OTVdfSxcIlByZWRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTYsNTk5XX0sXCIrXCJdXV0sXCJJdGVyX29wdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxNSw2MzFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxNSw2MjNdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTUsNjE5XX0sXCJQcmVkXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjIwLDYyM119LFwiP1wiXV1dLFwiSXRlclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1Niw2NDJdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Nyw2NDJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjcsNTc1XX0sXCJJdGVyX3N0YXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTkxLDU5OV19LFwiSXRlcl9wbHVzXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxNSw2MjNdfSxcIkl0ZXJfb3B0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYzOCw2NDJdfSxcIlByZWRcIixbXV1dXSxcIlByZWRfbm90XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjU3LDY3Ml19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjU3LDY2NF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjU3LDY2MF19LFwiflwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NjEsNjY0XX0sXCJMZXhcIixbXV1dXSxcIlByZWRfbG9va2FoZWFkXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjc5LDcwMF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjc5LDY4Nl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjc5LDY4Ml19LFwiJlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2ODMsNjg2XX0sXCJMZXhcIixbXV1dXSxcIlByZWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NDYsNzEwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NTcsNzEwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjU3LDY2NF19LFwiUHJlZF9ub3RcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjc5LDY4Nl19LFwiUHJlZF9sb29rYWhlYWRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzA3LDcxMF19LFwiTGV4XCIsW11dXV0sXCJMZXhfbGV4XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI0LDc0MF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI0LDczMl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI0LDcyN119LFwiI1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjgsNzMyXX0sXCJCYXNlXCIsW11dXV0sXCJMZXhcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MTQsNzUxXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjQsNzUxXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI0LDczMl19LFwiTGV4X2xleFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NDcsNzUxXX0sXCJCYXNlXCIsW11dXV0sXCJCYXNlX2FwcGxpY2F0aW9uXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY2LDgyN119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY2LDgxMV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Niw3NzFdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc3Miw3NzldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NzIsNzc4XX0sXCJQYXJhbXNcIixbXV1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc4MCw4MTFdfSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3ODIsODEwXX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzgyLDc5Nl19LFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc4Miw3OTJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3ODIsNzkxXX0sXCJydWxlRGVzY3JcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzkzLDc5Nl19LFwiPVwiXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3OTksODAzXX0sXCI6PVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwNiw4MTBdfSxcIis9XCJdXV1dXSxcIkJhc2VfcmFuZ2VcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzQsODg5XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzQsODU2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODM0LDg0Ml19LFwidGVybWluYWxcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NDMsODQ3XX0sXCIuLlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NDgsODU2XX0sXCJ0ZXJtaW5hbFwiLFtdXV1dLFwiQmFzZV90ZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5Niw5NTRdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5Niw5MDRdfSxcInRlcm1pbmFsXCIsW11dXSxcIkJhc2VfcGFyZW5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjEsMTAxNl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTYxLDk3Ml19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTYxLDk2NF19LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjUsOTY4XX0sXCJBbHRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjksOTcyXX0sXCIpXCJdXV0sXCJCYXNlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzU1LDEwMTZdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2NiwxMDE2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY2LDgxMV19LFwiQmFzZV9hcHBsaWNhdGlvblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzQsODU2XX0sXCJCYXNlX3JhbmdlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5Niw5MDRdfSxcIkJhc2VfdGVybWluYWxcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTYxLDk3Ml19LFwiQmFzZV9wYXJlblwiLFtdXV1dLFwicnVsZURlc2NyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTAyMCwxMDc5XX0sXCJhIHJ1bGUgZGVzY3JpcHRpb25cIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDU4LDEwNzldfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNTgsMTA2MV19LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDYyLDEwNzVdfSxcInJ1bGVEZXNjclRleHRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDc2LDEwNzldfSxcIilcIl1dXSxcInJ1bGVEZXNjclRleHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDgzLDExMTRdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTAzLDExMTRdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTA0LDExMTJdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTA0LDExMDhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMDUsMTEwOF19LFwiKVwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTEwOSwxMTEyXX0sXCJhbnlcIixbXV1dXV0sXCJjYXNlTmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTgsMTE4Nl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTEzMywxMTg2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTMzLDExMzddfSxcIi0tXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTM4LDExNTJdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTM5LDExNTBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTM5LDExNDRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNDAsMTE0NF19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTQ1LDExNTBdfSxcInNwYWNlXCIsW11dXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE1MywxMTU3XX0sXCJuYW1lXCIsW11dLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTU4LDExNzJdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTU5LDExNzBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTU5LDExNjRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNjAsMTE2NF19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTY1LDExNzBdfSxcInNwYWNlXCIsW11dXV0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE3NCwxMTg1XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTc0LDExNzhdfSxcIlxcblwiXSxbXCJsb29rYWhlYWRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgxLDExODVdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExODIsMTE4NV19LFwifVwiXV1dXV0sXCJuYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE5MCwxMjMwXX0sXCJhIG5hbWVcIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjExLDEyMzBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjExLDEyMjBdfSxcIm5hbWVGaXJzdFwiLFtdXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyMSwxMjMwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyMSwxMjI5XX0sXCJuYW1lUmVzdFwiLFtdXV1dXSxcIm5hbWVGaXJzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMzQsMTI2Nl19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI1MCwxMjY2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjUwLDEyNTNdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI2MCwxMjY2XX0sXCJsZXR0ZXJcIixbXV1dXSxcIm5hbWVSZXN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI3MCwxMzAwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjg1LDEzMDBdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyODUsMTI4OF19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjk1LDEzMDBdfSxcImFsbnVtXCIsW11dXV0sXCJpZGVudFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMDQsMTMzN119LFwiYW4gaWRlbnRpZmllclwiLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMzMsMTMzN119LFwibmFtZVwiLFtdXV0sXCJ0ZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNDEsMTM3OV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM1NiwxMzc5XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzU2LDEzNjBdfSxcIlxcXCJcIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNjEsMTM3NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNjEsMTM3M119LFwidGVybWluYWxDaGFyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNzUsMTM3OV19LFwiXFxcIlwiXV1dLFwidGVybWluYWxDaGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM4MywxNDQwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDAyLDE0NDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDAyLDE0MTJdfSxcImVzY2FwZUNoYXJcIixbXV0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQxOSwxNDQwXX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQxOSwxNDI0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDIwLDE0MjRdfSxcIlxcXFxcIl1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MjUsMTQzMF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQyNiwxNDMwXX0sXCJcXFwiXCJdXSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDMxLDE0MzZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MzIsMTQzNl19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDM3LDE0NDBdfSxcImFueVwiLFtdXV1dXSxcImVzY2FwZUNoYXJfYmFja3NsYXNoXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ4MywxNTM4XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0ODMsMTQ4OV19LFwiXFxcXFxcXFxcIl1dLFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NDUsMTYwMl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTQ1LDE1NTFdfSxcIlxcXFxcXFwiXCJdXSxcImVzY2FwZUNoYXJfc2luZ2xlUXVvdGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjA5LDE2NjZdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYwOSwxNjE1XX0sXCJcXFxcJ1wiXV0sXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2NzMsMTcyOF19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjczLDE2NzhdfSxcIlxcXFxiXCJdXSxcImVzY2FwZUNoYXJfbGluZUZlZWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzM1LDE3ODldfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTczNSwxNzQwXX0sXCJcXFxcblwiXV0sXCJlc2NhcGVDaGFyX2NhcnJpYWdlUmV0dXJuXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc5NiwxODU2XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OTYsMTgwMV19LFwiXFxcXHJcIl1dLFwiZXNjYXBlQ2hhcl90YWJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODYzLDE5MTJdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg2MywxODY4XX0sXCJcXFxcdFwiXV0sXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTE5LDE5NzhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MTksMTk2MF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkxOSwxOTI0XX0sXCJcXFxcdVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTI1LDE5MzNdfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MzQsMTk0Ml19LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk0MywxOTUxXX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTUyLDE5NjBdfSxcImhleERpZ2l0XCIsW11dXV0sXCJlc2NhcGVDaGFyX2hleEVzY2FwZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5ODUsMjA0MF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk4NSwyMDA4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTg1LDE5OTBdfSxcIlxcXFx4XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5OTEsMTk5OV19LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjAwMCwyMDA4XX0sXCJoZXhEaWdpdFwiLFtdXV1dLFwiZXNjYXBlQ2hhclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NDQsMjA0MF19LFwiYW4gZXNjYXBlIHNlcXVlbmNlXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ4MywyMDQwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ4MywxNDg5XX0sXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTQ1LDE1NTFdfSxcImVzY2FwZUNoYXJfZG91YmxlUXVvdGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYwOSwxNjE1XX0sXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2NzMsMTY3OF19LFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTczNSwxNzQwXX0sXCJlc2NhcGVDaGFyX2xpbmVGZWVkXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OTYsMTgwMV19LFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODYzLDE4NjhdfSxcImVzY2FwZUNoYXJfdGFiXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MTksMTk2MF19LFwiZXNjYXBlQ2hhcl91bmljb2RlRXNjYXBlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5ODUsMjAwOF19LFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIixbXV1dXSxcInNwYWNlXCI6W1wiZXh0ZW5kXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA0NCwyMDYzXX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDU2LDIwNjNdfSxcImNvbW1lbnRcIixbXV1dLFwiY29tbWVudF9zaW5nbGVMaW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4MSwyMTE4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDgxLDIxMDNdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwODEsMjA4NV19LFwiLy9cIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwODYsMjA5OF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwODcsMjA5Nl19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwODcsMjA5Ml19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4OCwyMDkyXX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwOTMsMjA5Nl19LFwiYW55XCIsW11dXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDk5LDIxMDNdfSxcIlxcblwiXV1dLFwiY29tbWVudF9tdWx0aUxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTI1LDIxNjFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMjUsMjE0N119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyNSwyMTI5XX0sXCIvKlwiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEzMCwyMTQyXX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEzMSwyMTQwXX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEzMSwyMTM2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTMyLDIxMzZdfSxcIiovXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTM3LDIxNDBdfSxcImFueVwiLFtdXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE0MywyMTQ3XX0sXCIqL1wiXV1dLFwiY29tbWVudFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNjcsMjE2MV19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4MSwyMTYxXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA4MSwyMTAzXX0sXCJjb21tZW50X3NpbmdsZUxpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyNSwyMTQ3XX0sXCJjb21tZW50X211bHRpTGluZVwiLFtdXV1dLFwidG9rZW5zXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE2NSwyMTgwXX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3NCwyMTgwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3NCwyMTc5XX0sXCJ0b2tlblwiLFtdXV1dLFwidG9rZW5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTg0LDIyNjBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOTIsMjI2MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOTIsMjIwMF19LFwiY2FzZU5hbWVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIwMywyMjEwXX0sXCJjb21tZW50XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyMTMsMjIxOF19LFwiaWRlbnRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIyMSwyMjI5XX0sXCJvcGVyYXRvclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjMyLDIyNDNdfSxcInB1bmN0dWF0aW9uXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNDYsMjI1NF19LFwidGVybWluYWxcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI1NywyMjYwXX0sXCJhbnlcIixbXV1dXSxcIm9wZXJhdG9yXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI2NCwyMzI5XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjc1LDIzMjldfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNzUsMjI3OV19LFwiPDpcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgyLDIyODVdfSxcIj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjg4LDIyOTJdfSxcIjo9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI5NSwyMjk5XX0sXCIrPVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMDIsMjMwNV19LFwiKlwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMDgsMjMxMV19LFwiK1wiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMTQsMjMxN119LFwiP1wiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMjAsMjMyM119LFwiflwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMjYsMjMyOV19LFwiJlwiXV1dLFwicHVuY3R1YXRpb25cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzMzLDIzNjldfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNDcsMjM2OV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0NywyMzUwXX0sXCI8XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM1MywyMzU2XX0sXCI+XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM1OSwyMzYyXX0sXCIsXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM2NSwyMzY5XX0sXCItLVwiXV1dfV0pO1xuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIk9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzIHtcXG5cXG4gIEF0dHJpYnV0ZVNpZ25hdHVyZSA9XFxuICAgIG5hbWVcXG5cXG4gIE9wZXJhdGlvblNpZ25hdHVyZSA9XFxuICAgIG5hbWUgRm9ybWFscz9cXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiKFxcXCIgTGlzdE9mPG5hbWUsIFxcXCIsXFxcIj4gXFxcIilcXFwiXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbn1cIn0sXCJPcGVyYXRpb25zQW5kQXR0cmlidXRlc1wiLG51bGwsXCJBdHRyaWJ1dGVTaWduYXR1cmVcIix7XCJBdHRyaWJ1dGVTaWduYXR1cmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyOSw1OF19LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTQsNThdfSxcIm5hbWVcIixbXV1dLFwiT3BlcmF0aW9uU2lnbmF0dXJlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjIsMTAwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NywxMDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4Nyw5MV19LFwibmFtZVwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MiwxMDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5Miw5OV19LFwiRm9ybWFsc1wiLFtdXV1dXSxcIkZvcm1hbHNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDQsMTQzXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgsMTQzXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgsMTIxXX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMiwxMzldfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjksMTMzXX0sXCJuYW1lXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM1LDEzOF19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQwLDE0M119LFwiKVwiXV1dLFwibmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NywxODddfSxcImEgbmFtZVwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OCwxODddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgsMTc3XX0sXCJuYW1lRmlyc3RcIixbXV0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OCwxODddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzgsMTg2XX0sXCJuYW1lUmVzdFwiLFtdXV1dXSxcIm5hbWVGaXJzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MSwyMjNdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNywyMjNdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNywyMTBdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3LDIyM119LFwibGV0dGVyXCIsW11dXV0sXCJuYW1lUmVzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNywyNTddfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MiwyNTddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MiwyNDVdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUyLDI1N119LFwiYWxudW1cIixbXV1dXX1dKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuLi9zcmMvY29tbW9uJykuYXNzZXJ0O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gSGVscGVyc1xuXG5mdW5jdGlvbiBnZXRQcm9wKG5hbWUsIHRoaW5nLCBmbikge1xuICByZXR1cm4gZm4odGhpbmdbbmFtZV0pO1xufVxuXG5mdW5jdGlvbiBtYXBQcm9wKG5hbWUsIHRoaW5nLCBmbikge1xuICByZXR1cm4gdGhpbmdbbmFtZV0ubWFwKGZuKTtcbn1cblxuLy8gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCB3YWxrIGEgc2luZ2xlIHByb3BlcnR5IG9mIGEgbm9kZS5cbi8vIGBkZXNjcmlwdG9yYCBpcyBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBwcm9wZXJ0eSBuYW1lLCBvcHRpb25hbGx5IGVuZGluZ1xuLy8gd2l0aCAnW10nIChlLmcuLCAnY2hpbGRyZW5bXScpLlxuZnVuY3Rpb24gZ2V0UHJvcFdhbGtGbihkZXNjcmlwdG9yKSB7XG4gIHZhciBwYXJ0cyA9IGRlc2NyaXB0b3Iuc3BsaXQoLyA/XFxbXFxdLyk7XG4gIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4gbWFwUHJvcC5iaW5kKG51bGwsIHBhcnRzWzBdKTtcbiAgfVxuICByZXR1cm4gZ2V0UHJvcC5iaW5kKG51bGwsIGRlc2NyaXB0b3IpO1xufVxuXG5mdW5jdGlvbiBnZXRQcm9wcyh3YWxrRm5zLCB0aGluZywgZm4pIHtcbiAgcmV0dXJuIHdhbGtGbnMubWFwKGZ1bmN0aW9uKHdhbGtGbikge1xuICAgIHJldHVybiB3YWxrRm4odGhpbmcsIGZuKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldFdhbGtGbihzaGFwZSkge1xuICBpZiAodHlwZW9mIHNoYXBlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBnZXRQcm9wcy5iaW5kKG51bGwsIFtnZXRQcm9wV2Fsa0ZuKHNoYXBlKV0pO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2hhcGUpKSB7XG4gICAgcmV0dXJuIGdldFByb3BzLmJpbmQobnVsbCwgc2hhcGUubWFwKGdldFByb3BXYWxrRm4pKTtcbiAgfSBlbHNlIHtcbiAgICBhc3NlcnQodHlwZW9mIHNoYXBlID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgYSBzdHJpbmcsIEFycmF5LCBvciBmdW5jdGlvbicpO1xuICAgIGFzc2VydChzaGFwZS5sZW5ndGggPT09IDIsICdFeHBlY3RlZCBhIGZ1bmN0aW9uIG9mIGFyaXR5IDIsIGdvdCAnICsgc2hhcGUubGVuZ3RoKTtcbiAgICByZXR1cm4gc2hhcGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNSZXN0cmljdGVkSWRlbnRpZmllcihzdHIpIHtcbiAgcmV0dXJuIC9eW2EtekEtWl9dWzAtOWEtekEtWl9dKiQvLnRlc3Qoc3RyKTtcbn1cblxuZnVuY3Rpb24gdHJpbShzKSB7XG4gIHJldHVybiBzLnRyaW0oKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTaWduYXR1cmUoc2lnKSB7XG4gIHZhciBwYXJ0cyA9IHNpZy5zcGxpdCgvWygpXS8pLm1hcCh0cmltKTtcbiAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiBwYXJ0c1syXSA9PT0gJycpIHtcbiAgICB2YXIgbmFtZSA9IHBhcnRzWzBdO1xuICAgIHZhciBwYXJhbXMgPSBbXTtcbiAgICBpZiAocGFydHNbMV0ubGVuZ3RoID4gMCkge1xuICAgICAgcGFyYW1zID0gcGFydHNbMV0uc3BsaXQoJywnKS5tYXAodHJpbSk7XG4gICAgfVxuICAgIGlmIChpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKG5hbWUpICYmIHBhcmFtcy5ldmVyeShpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKSkge1xuICAgICAgcmV0dXJuIHtuYW1lOiBuYW1lLCBmb3JtYWxzOiBwYXJhbXN9O1xuICAgIH1cbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb3BlcmF0aW9uIHNpZ25hdHVyZTogJyArIHNpZyk7XG59XG5cbi8qXG4gIEEgVmlzaXRvckZhbWlseSBjb250YWlucyBhIHNldCBvZiByZWN1cnNpdmUgb3BlcmF0aW9ucyB0aGF0IGFyZSBkZWZpbmVkIG92ZXIgc29tZSBraW5kIG9mXG4gIHRyZWUgc3RydWN0dXJlLiBUaGUgYGNvbmZpZ2AgcGFyYW1ldGVyIHNwZWNpZmllcyBob3cgdG8gd2FsayB0aGUgdHJlZTpcbiAgLSAnZ2V0VGFnJyBpcyBmdW5jdGlvbiB3aGljaCwgZ2l2ZW4gYSBub2RlIGluIHRoZSB0cmVlLCByZXR1cm5zIHRoZSBub2RlJ3MgJ3RhZycgKHR5cGUpXG4gIC0gJ3NoYXBlcycgYW4gb2JqZWN0IHRoYXQgbWFwcyBmcm9tIGEgdGFnIHRvIGEgdmFsdWUgdGhhdCBkZXNjcmliZXMgaG93IHRvIHJlY3Vyc2l2ZWx5XG4gICAgZXZhbHVhdGUgdGhlIG9wZXJhdGlvbiBmb3Igbm9kZXMgb2YgdGhhdCB0eXBlLiBUaGUgdmFsdWUgY2FuIGJlOlxuICAgICogYSBzdHJpbmcgaW5kaWNhdGluZyB0aGUgcHJvcGVydHkgbmFtZSB0aGF0IGhvbGRzIHRoYXQgbm9kZSdzIG9ubHkgY2hpbGRcbiAgICAqIGFuIEFycmF5IG9mIHByb3BlcnR5IG5hbWVzIChvciBhbiBlbXB0eSBhcnJheSBpbmRpY2F0aW5nIGEgbGVhZiB0eXBlKSwgb3JcbiAgICAqIGEgZnVuY3Rpb24gdGFraW5nIHR3byBhcmd1bWVudHMgKG5vZGUsIGZuKSwgYW5kIHJldHVybmluZyBhbiBBcnJheSB3aGljaCBpcyB0aGUgcmVzdWx0XG4gICAgICBvZiBhcHBseSBgZm5gIHRvIGVhY2ggb2YgdGhlIG5vZGUncyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gVmlzaXRvckZhbWlseShjb25maWcpIHtcbiAgdGhpcy5fc2hhcGVzID0gY29uZmlnLnNoYXBlcztcbiAgdGhpcy5fZ2V0VGFnID0gY29uZmlnLmdldFRhZztcblxuICB0aGlzLkFkYXB0ZXIgPSBmdW5jdGlvbih0aGluZywgZmFtaWx5KSB7XG4gICAgdGhpcy5fYWRhcHRlZSA9IHRoaW5nO1xuICAgIHRoaXMuX2ZhbWlseSA9IGZhbWlseTtcbiAgfTtcbiAgdGhpcy5BZGFwdGVyLnByb3RvdHlwZS52YWx1ZU9mID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdoZWVleSEnKTtcbiAgfTtcbiAgdGhpcy5vcGVyYXRpb25zID0ge307XG5cbiAgdGhpcy5fYXJpdGllcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIHRoaXMuX2dldENoaWxkcmVuID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG4gIE9iamVjdC5rZXlzKHRoaXMuX3NoYXBlcykuZm9yRWFjaChmdW5jdGlvbihrKSB7XG4gICAgdmFyIHNoYXBlID0gc2VsZi5fc2hhcGVzW2tdO1xuICAgIHNlbGYuX2dldENoaWxkcmVuW2tdID0gZ2V0V2Fsa0ZuKHNoYXBlKTtcblxuICAgIC8vIEEgZnVuY3Rpb24gbWVhbnMgdGhlIGFyaXR5IGlzbid0IGZpeGVkLCBzbyBkb24ndCBwdXQgYW4gZW50cnkgaW4gdGhlIGFyaXR5IG1hcC5cbiAgICBpZiAodHlwZW9mIHNoYXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBzZWxmLl9hcml0aWVzW2tdID0gQXJyYXkuaXNBcnJheShzaGFwZSkgPyBzaGFwZS5sZW5ndGggOiAxO1xuICAgIH1cbiAgfSk7XG4gIHRoaXMuX3dyYXAgPSBmdW5jdGlvbih0aGluZykgeyByZXR1cm4gbmV3IHNlbGYuQWRhcHRlcih0aGluZywgc2VsZik7IH07XG59XG5cblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbih0aGluZykge1xuICByZXR1cm4gdGhpcy5fd3JhcCh0aGluZyk7XG59O1xuXG5WaXNpdG9yRmFtaWx5LnByb3RvdHlwZS5fY2hlY2tBY3Rpb25EaWN0ID0gZnVuY3Rpb24oZGljdCkge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIE9iamVjdC5rZXlzKGRpY3QpLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgIGFzc2VydChrIGluIHNlbGYuX2dldENoaWxkcmVuLCBcIlVucmVjb2duaXplZCBhY3Rpb24gbmFtZSAnXCIgKyBrICsgXCInXCIpO1xuICAgIHZhciBhY3Rpb24gPSBkaWN0W2tdO1xuICAgIGFzc2VydCh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nLCBcIktleSAnXCIgKyBrICsgXCInOiBleHBlY3RlZCBmdW5jdGlvbiwgZ290IFwiICsgYWN0aW9uKTtcbiAgICBpZiAoayBpbiBzZWxmLl9hcml0aWVzKSB7XG4gICAgICB2YXIgZXhwZWN0ZWQgPSBzZWxmLl9hcml0aWVzW2tdO1xuICAgICAgdmFyIGFjdHVhbCA9IGRpY3Rba10ubGVuZ3RoO1xuICAgICAgYXNzZXJ0KGFjdHVhbCA9PT0gZXhwZWN0ZWQsXG4gICAgICAgICAgICAgXCJBY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBleHBlY3RlZCBcIiArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5WaXNpdG9yRmFtaWx5LnByb3RvdHlwZS5hZGRPcGVyYXRpb24gPSBmdW5jdGlvbihzaWduYXR1cmUsIGFjdGlvbnMpIHtcbiAgdmFyIHNpZyA9IHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSk7XG4gIHZhciBuYW1lID0gc2lnLm5hbWU7XG4gIHRoaXMuX2NoZWNrQWN0aW9uRGljdChhY3Rpb25zKTtcbiAgdGhpcy5vcGVyYXRpb25zW25hbWVdID0ge1xuICAgIG5hbWU6IG5hbWUsXG4gICAgZm9ybWFsczogc2lnLmZvcm1hbHMsXG4gICAgYWN0aW9uczogYWN0aW9uc1xuICB9O1xuXG4gIHZhciBmYW1pbHkgPSB0aGlzO1xuICB0aGlzLkFkYXB0ZXIucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRhZyA9IGZhbWlseS5fZ2V0VGFnKHRoaXMuX2FkYXB0ZWUpO1xuICAgIGFzc2VydCh0YWcgaW4gZmFtaWx5Ll9nZXRDaGlsZHJlbiwgXCJnZXRUYWcgcmV0dXJuZWQgdW5yZWNvZ25pemVkIHRhZyAnXCIgKyB0YWcgKyBcIidcIik7XG4gICAgYXNzZXJ0KHRhZyBpbiBhY3Rpb25zLCBcIk5vIGFjdGlvbiBmb3IgJ1wiICsgdGFnICsgXCInIGluIG9wZXJhdGlvbiAnXCIgKyBuYW1lICsgXCInXCIpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIFwiYXJndW1lbnRzIG9iamVjdFwiIGZyb20gdGhlIGFyZ3VtZW50cyB0aGF0IHdlcmUgcGFzc2VkIHRvIHRoaXNcbiAgICAvLyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUuXG4gICAgdmFyIGFyZ3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhcmdzW3NpZy5mb3JtYWxzW2ldXSA9IGFyZ3VtZW50c1tpXTtcbiAgICB9XG5cbiAgICB2YXIgb2xkQXJncyA9IHRoaXMuYXJncztcbiAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIHZhciBhbnMgPSBhY3Rpb25zW3RhZ10uYXBwbHkodGhpcywgZmFtaWx5Ll9nZXRDaGlsZHJlblt0YWddKHRoaXMuX2FkYXB0ZWUsIGZhbWlseS5fd3JhcCkpO1xuICAgIHRoaXMuYXJncyA9IG9sZEFyZ3M7XG4gICAgcmV0dXJuIGFucztcbiAgfTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBWaXNpdG9yRmFtaWx5O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVmlzaXRvckZhbWlseTogcmVxdWlyZSgnLi9WaXNpdG9yRmFtaWx5JyksXG4gIHNlbWFudGljc0ZvclRvQVNUOiByZXF1aXJlKCcuL3NlbWFudGljcy10b0FTVCcpLnNlbWFudGljcyxcbiAgdG9BU1Q6IHJlcXVpcmUoJy4vc2VtYW50aWNzLXRvQVNUJykuaGVscGVyXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4uL3NyYy9wZXhwcnMnKTtcbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4uL3NyYy9NYXRjaFJlc3VsdCcpO1xudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuLi9zcmMvR3JhbW1hcicpO1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZGVmYXVsdE9wZXJhdGlvbiA9IHtcbiAgX3Rlcm1pbmFsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVWYWx1ZTtcbiAgfSxcblxuICBfbm9udGVybWluYWw6IGZ1bmN0aW9uKGNoaWxkcmVuKSB7XG4gICAgdmFyIGN0b3JOYW1lID0gdGhpcy5fbm9kZS5jdG9yTmFtZTtcbiAgICB2YXIgbWFwcGluZyA9IHRoaXMuYXJncy5tYXBwaW5nO1xuXG4gICAgLy8gd2l0aG91dCBjdXN0b21pemF0aW9uXG4gICAgaWYgKCFtYXBwaW5nLmhhc093blByb3BlcnR5KGN0b3JOYW1lKSkge1xuICAgICAgLy8gaW50ZXJtZWRpYXRlIG5vZGVcbiAgICAgIGlmICh0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFsdCB8fCB0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5KSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlblswXS50b0FTVChtYXBwaW5nKTtcbiAgICAgIH1cblxuICAgICAgLy8gbGV4aWNhbCBydWxlXG4gICAgICBpZiAodGhpcy5pc0xleGljYWwoKSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICB9XG5cbiAgICAgIC8vIHNpbmd1bGFyIG5vZGUgKGUuZy4gb25seSBzdXJyb3VuZGVkIGJ5IGxpdGVyYWxzIG9yIGxvb2thaGVhZHMpXG4gICAgICB2YXIgcmVhbENoaWxkcmVuID0gY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiAhY2hpbGQuaXNUZXJtaW5hbCgpO1xuICAgICAgfSk7XG4gICAgICBpZiAocmVhbENoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmVhbENoaWxkcmVuWzBdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgfVxuXG4gICAgICAvLyByZXN0OiB0ZXJtcyB3aXRoIG11bHRpcGxlIGNoaWxkcmVuXG4gICAgfVxuXG4gICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICBpZiAodHlwZW9mIG1hcHBpbmdbY3Rvck5hbWVdID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIGNoaWxkcmVuW21hcHBpbmdbY3Rvck5hbWVdXS50b0FTVChtYXBwaW5nKTtcbiAgICB9XG5cbiAgICAvLyBuYW1lZC9tYXBwZWQgY2hpbGRyZW4gb3IgdW5uYW1lZCBjaGlsZHJlbiAoJzAnLCAnMScsICcyJywgLi4uKVxuICAgIHZhciBwcm9wTWFwID0gbWFwcGluZ1tjdG9yTmFtZV0gfHwgY2hpbGRyZW47XG4gICAgdmFyIG5vZGUgPSB7XG4gICAgICB0eXBlOiBjdG9yTmFtZVxuICAgIH07XG4gICAgZm9yICh2YXIgcHJvcCBpbiBwcm9wTWFwKSB7XG4gICAgICB2YXIgbWFwcGVkUHJvcCA9IG1hcHBpbmdbY3Rvck5hbWVdICYmIG1hcHBpbmdbY3Rvck5hbWVdW3Byb3BdO1xuICAgICAgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnbnVtYmVyJykge1xuICAgICAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgICAgICBub2RlW3Byb3BdID0gY2hpbGRyZW5bbWFwcGVkUHJvcF0udG9BU1QobWFwcGluZyk7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ3N0cmluZycpIHx8ICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ2Jvb2xlYW4nKSB8fFxuICAgICAgICAgIChtYXBwZWRQcm9wID09PSBudWxsKSkge1xuICAgICAgICAvLyBwcmltaXRpdmUgdmFsdWVcbiAgICAgICAgbm9kZVtwcm9wXSA9IG1hcHBlZFByb3A7XG4gICAgICB9IGVsc2UgaWYgKCh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ29iamVjdCcpICYmIChtYXBwZWRQcm9wIGluc3RhbmNlb2YgTnVtYmVyKSkge1xuICAgICAgICAvLyBwcmltaXRpdmUgbnVtYmVyIChtdXN0IGJlIHVuYm94ZWQpXG4gICAgICAgIG5vZGVbcHJvcF0gPSBOdW1iZXIobWFwcGVkUHJvcCk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGNvbXB1dGVkIHZhbHVlXG4gICAgICAgIG5vZGVbcHJvcF0gPSBtYXBwZWRQcm9wLmNhbGwodGhpcywgY2hpbGRyZW4pO1xuICAgICAgfSBlbHNlIGlmIChtYXBwZWRQcm9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGNoaWxkcmVuW3Byb3BdICYmICFjaGlsZHJlbltwcm9wXS5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgICBub2RlW3Byb3BdID0gY2hpbGRyZW5bcHJvcF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZGVsZXRlIHByZWRlZmluZWQgJ3R5cGUnIHByb3BlcnRpZXMsIGxpa2UgJ3R5cGUnLCBpZiBleHBsaWNpdGVseSByZW1vdmVkXG4gICAgICAgICAgZGVsZXRlIG5vZGVbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5vZGU7XG4gIH0sXG5cbiAgX2l0ZXI6IGZ1bmN0aW9uKGNoaWxkcmVuKSB7XG4gICAgaWYgKHRoaXMuX25vZGUuaXNPcHRpb25hbCgpKSB7XG4gICAgICBpZiAodGhpcy5udW1DaGlsZHJlbiA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjaGlsZHJlblswXS50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgcmV0dXJuIGNoaWxkLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICB9LCB0aGlzKTtcbiAgfSxcblxuICBOb25lbXB0eUxpc3RPZjogZnVuY3Rpb24oZmlyc3QsIHNlcCwgcmVzdCkge1xuICAgIHJldHVybiBbZmlyc3QudG9BU1QodGhpcy5hcmdzLm1hcHBpbmcpXS5jb25jYXQocmVzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZykpO1xuICB9LFxuXG4gIEVtcHR5TGlzdE9mOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbn07XG5cbi8vIFJldHVybnMgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IGluY2x1ZGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIChBU1QpXG4vLyBmb3IgdGhlIGdpdmVuIG1hdGNoIHJlc3VsdCBgcmVzYCBjb250YWluZyBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIGFuZCBncmFtbWFyLlxuLy8gVGhlIG9wdGlvbmFsIGBtYXBwaW5nYCBwYXJhbWV0ZXIgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIGhvdyB0aGUgbm9kZXMgb2YgdGhlIENTVFxuLy8gYXJlIG1hcHBlZCB0byB0aGUgQVNUIChzZWUgL2RvYy9leHRyYXMubWQjdG9hc3RtYXRjaHJlc3VsdC1tYXBwaW5nKS5cbmZ1bmN0aW9uIHRvQVNUKHJlcywgbWFwcGluZykge1xuICBpZiAoIShyZXMgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkgfHwgcmVzLmZhaWxlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCd0b0FTVCgpIGV4cGVjdHMgYSBzdWNjZXNmdWxsIE1hdGNoUmVzdWx0IGFzIGZpcnN0IHBhcmFtZXRlcicpO1xuICB9XG5cbiAgbWFwcGluZyA9IGV4dGVuZCh7fSwgbWFwcGluZyk7XG4gIHZhciBvcGVyYXRpb24gPSBleHRlbmQoe30sIGRlZmF1bHRPcGVyYXRpb24pO1xuICBmb3IgKHZhciB0ZXJtTmFtZSBpbiBtYXBwaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBtYXBwaW5nW3Rlcm1OYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgb3BlcmF0aW9uW3Rlcm1OYW1lXSA9IG1hcHBpbmdbdGVybU5hbWVdO1xuICAgICAgZGVsZXRlIG1hcHBpbmdbdGVybU5hbWVdO1xuICAgIH1cbiAgfVxuICB2YXIgZyA9IHJlcy5fY3N0LmdyYW1tYXI7XG4gIHZhciBzID0gZy5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3RvQVNUKG1hcHBpbmcpJywgb3BlcmF0aW9uKTtcbiAgcmV0dXJuIHMocmVzKS50b0FTVChtYXBwaW5nKTtcbn1cblxuLy8gUmV0dXJucyBhIHNlbWFudGljcyBjb250YWluZyB0aGUgdG9BU1QobWFwcGluZykgb3BlcmF0aW9uIGZvciB0aGUgZ2l2ZW4gZ3JhbW1hciBnLlxuZnVuY3Rpb24gc2VtYW50aWNzRm9yVG9BU1QoZykge1xuICBpZiAoIShnIGluc3RhbmNlb2YgR3JhbW1hcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbWFudGljc1RvQVNUKCkgZXhwZWN0cyBhIEdyYW1tYXIgYXMgcGFyYW1ldGVyJyk7XG4gIH1cblxuICByZXR1cm4gZy5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3RvQVNUKG1hcHBpbmcpJywgZGVmYXVsdE9wZXJhdGlvbik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBoZWxwZXI6IHRvQVNULFxuICBzZW1hbnRpY3M6IHNlbWFudGljc0ZvclRvQVNUXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXNzaWduICAgICAgICA9IHJlcXVpcmUoJ2VzNS1leHQvb2JqZWN0L2Fzc2lnbicpXG4gICwgbm9ybWFsaXplT3B0cyA9IHJlcXVpcmUoJ2VzNS1leHQvb2JqZWN0L25vcm1hbGl6ZS1vcHRpb25zJylcbiAgLCBpc0NhbGxhYmxlICAgID0gcmVxdWlyZSgnZXM1LWV4dC9vYmplY3QvaXMtY2FsbGFibGUnKVxuICAsIGNvbnRhaW5zICAgICAgPSByZXF1aXJlKCdlczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zJylcblxuICAsIGQ7XG5cbmQgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkc2NyLCB2YWx1ZS8qLCBvcHRpb25zKi8pIHtcblx0dmFyIGMsIGUsIHcsIG9wdGlvbnMsIGRlc2M7XG5cdGlmICgoYXJndW1lbnRzLmxlbmd0aCA8IDIpIHx8ICh0eXBlb2YgZHNjciAhPT0gJ3N0cmluZycpKSB7XG5cdFx0b3B0aW9ucyA9IHZhbHVlO1xuXHRcdHZhbHVlID0gZHNjcjtcblx0XHRkc2NyID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzWzJdO1xuXHR9XG5cdGlmIChkc2NyID09IG51bGwpIHtcblx0XHRjID0gdyA9IHRydWU7XG5cdFx0ZSA9IGZhbHNlO1xuXHR9IGVsc2Uge1xuXHRcdGMgPSBjb250YWlucy5jYWxsKGRzY3IsICdjJyk7XG5cdFx0ZSA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ2UnKTtcblx0XHR3ID0gY29udGFpbnMuY2FsbChkc2NyLCAndycpO1xuXHR9XG5cblx0ZGVzYyA9IHsgdmFsdWU6IHZhbHVlLCBjb25maWd1cmFibGU6IGMsIGVudW1lcmFibGU6IGUsIHdyaXRhYmxlOiB3IH07XG5cdHJldHVybiAhb3B0aW9ucyA/IGRlc2MgOiBhc3NpZ24obm9ybWFsaXplT3B0cyhvcHRpb25zKSwgZGVzYyk7XG59O1xuXG5kLmdzID0gZnVuY3Rpb24gKGRzY3IsIGdldCwgc2V0LyosIG9wdGlvbnMqLykge1xuXHR2YXIgYywgZSwgb3B0aW9ucywgZGVzYztcblx0aWYgKHR5cGVvZiBkc2NyICE9PSAnc3RyaW5nJykge1xuXHRcdG9wdGlvbnMgPSBzZXQ7XG5cdFx0c2V0ID0gZ2V0O1xuXHRcdGdldCA9IGRzY3I7XG5cdFx0ZHNjciA9IG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1szXTtcblx0fVxuXHRpZiAoZ2V0ID09IG51bGwpIHtcblx0XHRnZXQgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoIWlzQ2FsbGFibGUoZ2V0KSkge1xuXHRcdG9wdGlvbnMgPSBnZXQ7XG5cdFx0Z2V0ID0gc2V0ID0gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKHNldCA9PSBudWxsKSB7XG5cdFx0c2V0ID0gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKCFpc0NhbGxhYmxlKHNldCkpIHtcblx0XHRvcHRpb25zID0gc2V0O1xuXHRcdHNldCA9IHVuZGVmaW5lZDtcblx0fVxuXHRpZiAoZHNjciA9PSBudWxsKSB7XG5cdFx0YyA9IHRydWU7XG5cdFx0ZSA9IGZhbHNlO1xuXHR9IGVsc2Uge1xuXHRcdGMgPSBjb250YWlucy5jYWxsKGRzY3IsICdjJyk7XG5cdFx0ZSA9IGNvbnRhaW5zLmNhbGwoZHNjciwgJ2UnKTtcblx0fVxuXG5cdGRlc2MgPSB7IGdldDogZ2V0LCBzZXQ6IHNldCwgY29uZmlndXJhYmxlOiBjLCBlbnVtZXJhYmxlOiBlIH07XG5cdHJldHVybiAhb3B0aW9ucyA/IGRlc2MgOiBhc3NpZ24obm9ybWFsaXplT3B0cyhvcHRpb25zKSwgZGVzYyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpXG5cdD8gT2JqZWN0LmFzc2lnblxuXHQ6IHJlcXVpcmUoJy4vc2hpbScpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcblx0dmFyIGFzc2lnbiA9IE9iamVjdC5hc3NpZ24sIG9iajtcblx0aWYgKHR5cGVvZiBhc3NpZ24gIT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblx0b2JqID0geyBmb286ICdyYXonIH07XG5cdGFzc2lnbihvYmosIHsgYmFyOiAnZHdhJyB9LCB7IHRyenk6ICd0cnp5JyB9KTtcblx0cmV0dXJuIChvYmouZm9vICsgb2JqLmJhciArIG9iai50cnp5KSA9PT0gJ3JhemR3YXRyenknO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtleXMgID0gcmVxdWlyZSgnLi4va2V5cycpXG4gICwgdmFsdWUgPSByZXF1aXJlKCcuLi92YWxpZC12YWx1ZScpXG5cbiAgLCBtYXggPSBNYXRoLm1heDtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZGVzdCwgc3JjLyosIOKApnNyY24qLykge1xuXHR2YXIgZXJyb3IsIGksIGwgPSBtYXgoYXJndW1lbnRzLmxlbmd0aCwgMiksIGFzc2lnbjtcblx0ZGVzdCA9IE9iamVjdCh2YWx1ZShkZXN0KSk7XG5cdGFzc2lnbiA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHR0cnkgeyBkZXN0W2tleV0gPSBzcmNba2V5XTsgfSBjYXRjaCAoZSkge1xuXHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlO1xuXHRcdH1cblx0fTtcblx0Zm9yIChpID0gMTsgaSA8IGw7ICsraSkge1xuXHRcdHNyYyA9IGFyZ3VtZW50c1tpXTtcblx0XHRrZXlzKHNyYykuZm9yRWFjaChhc3NpZ24pO1xuXHR9XG5cdGlmIChlcnJvciAhPT0gdW5kZWZpbmVkKSB0aHJvdyBlcnJvcjtcblx0cmV0dXJuIGRlc3Q7XG59O1xuIiwiLy8gRGVwcmVjYXRlZFxuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJzsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2lzLWltcGxlbWVudGVkJykoKVxuXHQ/IE9iamVjdC5rZXlzXG5cdDogcmVxdWlyZSgnLi9zaGltJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR0cnkge1xuXHRcdE9iamVjdC5rZXlzKCdwcmltaXRpdmUnKTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBrZXlzID0gT2JqZWN0LmtleXM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCkge1xuXHRyZXR1cm4ga2V5cyhvYmplY3QgPT0gbnVsbCA/IG9iamVjdCA6IE9iamVjdChvYmplY3QpKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2gsIGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbnZhciBwcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgb2JqKSB7XG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIHNyYykgb2JqW2tleV0gPSBzcmNba2V5XTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9wdGlvbnMvKiwg4oCmb3B0aW9ucyovKSB7XG5cdHZhciByZXN1bHQgPSBjcmVhdGUobnVsbCk7XG5cdGZvckVhY2guY2FsbChhcmd1bWVudHMsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0aWYgKG9wdGlvbnMgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdHByb2Nlc3MoT2JqZWN0KG9wdGlvbnMpLCByZXN1bHQpO1xuXHR9KTtcblx0cmV0dXJuIHJlc3VsdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdGlmICh2YWx1ZSA9PSBudWxsKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IHVzZSBudWxsIG9yIHVuZGVmaW5lZFwiKTtcblx0cmV0dXJuIHZhbHVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2lzLWltcGxlbWVudGVkJykoKVxuXHQ/IFN0cmluZy5wcm90b3R5cGUuY29udGFpbnNcblx0OiByZXF1aXJlKCcuL3NoaW0nKTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHN0ciA9ICdyYXpkd2F0cnp5JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdGlmICh0eXBlb2Ygc3RyLmNvbnRhaW5zICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2U7XG5cdHJldHVybiAoKHN0ci5jb250YWlucygnZHdhJykgPT09IHRydWUpICYmIChzdHIuY29udGFpbnMoJ2ZvbycpID09PSBmYWxzZSkpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmluZGV4T2Y7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNlYXJjaFN0cmluZy8qLCBwb3NpdGlvbiovKSB7XG5cdHJldHVybiBpbmRleE9mLmNhbGwodGhpcywgc2VhcmNoU3RyaW5nLCBhcmd1bWVudHNbMV0pID4gLTE7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vaXMtaW1wbGVtZW50ZWQnKSgpID8gU3ltYm9sIDogcmVxdWlyZSgnLi9wb2x5ZmlsbCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmFsaWRUeXBlcyA9IHsgb2JqZWN0OiB0cnVlLCBzeW1ib2w6IHRydWUgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHZhciBzeW1ib2w7XG5cdGlmICh0eXBlb2YgU3ltYm9sICE9PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2U7XG5cdHN5bWJvbCA9IFN5bWJvbCgndGVzdCBzeW1ib2wnKTtcblx0dHJ5IHsgU3RyaW5nKHN5bWJvbCk7IH0gY2F0Y2ggKGUpIHsgcmV0dXJuIGZhbHNlOyB9XG5cblx0Ly8gUmV0dXJuICd0cnVlJyBhbHNvIGZvciBwb2x5ZmlsbHNcblx0aWYgKCF2YWxpZFR5cGVzW3R5cGVvZiBTeW1ib2wuaXRlcmF0b3JdKSByZXR1cm4gZmFsc2U7XG5cdGlmICghdmFsaWRUeXBlc1t0eXBlb2YgU3ltYm9sLnRvUHJpbWl0aXZlXSkgcmV0dXJuIGZhbHNlO1xuXHRpZiAoIXZhbGlkVHlwZXNbdHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZ10pIHJldHVybiBmYWxzZTtcblxuXHRyZXR1cm4gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHgpIHtcblx0aWYgKCF4KSByZXR1cm4gZmFsc2U7XG5cdGlmICh0eXBlb2YgeCA9PT0gJ3N5bWJvbCcpIHJldHVybiB0cnVlO1xuXHRpZiAoIXguY29uc3RydWN0b3IpIHJldHVybiBmYWxzZTtcblx0aWYgKHguY29uc3RydWN0b3IubmFtZSAhPT0gJ1N5bWJvbCcpIHJldHVybiBmYWxzZTtcblx0cmV0dXJuICh4W3guY29uc3RydWN0b3IudG9TdHJpbmdUYWddID09PSAnU3ltYm9sJyk7XG59O1xuIiwiLy8gRVMyMDE1IFN5bWJvbCBwb2x5ZmlsbCBmb3IgZW52aXJvbm1lbnRzIHRoYXQgZG8gbm90IHN1cHBvcnQgaXQgKG9yIHBhcnRpYWxseSBzdXBwb3J0IGl0KVxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBkICAgICAgICAgICAgICA9IHJlcXVpcmUoJ2QnKVxuICAsIHZhbGlkYXRlU3ltYm9sID0gcmVxdWlyZSgnLi92YWxpZGF0ZS1zeW1ib2wnKVxuXG4gICwgY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSwgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXG4gICwgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHksIG9ialByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGVcbiAgLCBOYXRpdmVTeW1ib2wsIFN5bWJvbFBvbHlmaWxsLCBIaWRkZW5TeW1ib2wsIGdsb2JhbFN5bWJvbHMgPSBjcmVhdGUobnVsbClcbiAgLCBpc05hdGl2ZVNhZmU7XG5cbmlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nKSB7XG5cdE5hdGl2ZVN5bWJvbCA9IFN5bWJvbDtcblx0dHJ5IHtcblx0XHRTdHJpbmcoTmF0aXZlU3ltYm9sKCkpO1xuXHRcdGlzTmF0aXZlU2FmZSA9IHRydWU7XG5cdH0gY2F0Y2ggKGlnbm9yZSkge31cbn1cblxudmFyIGdlbmVyYXRlTmFtZSA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciBjcmVhdGVkID0gY3JlYXRlKG51bGwpO1xuXHRyZXR1cm4gZnVuY3Rpb24gKGRlc2MpIHtcblx0XHR2YXIgcG9zdGZpeCA9IDAsIG5hbWUsIGllMTFCdWdXb3JrYXJvdW5kO1xuXHRcdHdoaWxlIChjcmVhdGVkW2Rlc2MgKyAocG9zdGZpeCB8fCAnJyldKSArK3Bvc3RmaXg7XG5cdFx0ZGVzYyArPSAocG9zdGZpeCB8fCAnJyk7XG5cdFx0Y3JlYXRlZFtkZXNjXSA9IHRydWU7XG5cdFx0bmFtZSA9ICdAQCcgKyBkZXNjO1xuXHRcdGRlZmluZVByb3BlcnR5KG9ialByb3RvdHlwZSwgbmFtZSwgZC5ncyhudWxsLCBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdC8vIEZvciBJRTExIGlzc3VlIHNlZTpcblx0XHRcdC8vIGh0dHBzOi8vY29ubmVjdC5taWNyb3NvZnQuY29tL0lFL2ZlZWRiYWNrZGV0YWlsL3ZpZXcvMTkyODUwOC9cblx0XHRcdC8vICAgIGllMTEtYnJva2VuLWdldHRlcnMtb24tZG9tLW9iamVjdHNcblx0XHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpa29vL2VzNi1zeW1ib2wvaXNzdWVzLzEyXG5cdFx0XHRpZiAoaWUxMUJ1Z1dvcmthcm91bmQpIHJldHVybjtcblx0XHRcdGllMTFCdWdXb3JrYXJvdW5kID0gdHJ1ZTtcblx0XHRcdGRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIGQodmFsdWUpKTtcblx0XHRcdGllMTFCdWdXb3JrYXJvdW5kID0gZmFsc2U7XG5cdFx0fSkpO1xuXHRcdHJldHVybiBuYW1lO1xuXHR9O1xufSgpKTtcblxuLy8gSW50ZXJuYWwgY29uc3RydWN0b3IgKG5vdCBvbmUgZXhwb3NlZCkgZm9yIGNyZWF0aW5nIFN5bWJvbCBpbnN0YW5jZXMuXG4vLyBUaGlzIG9uZSBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0IGBzb21lU3ltYm9sIGluc3RhbmNlb2YgU3ltYm9sYCBhbHdheXMgcmV0dXJuIGZhbHNlXG5IaWRkZW5TeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woZGVzY3JpcHRpb24pIHtcblx0aWYgKHRoaXMgaW5zdGFuY2VvZiBIaWRkZW5TeW1ib2wpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1R5cGVFcnJvcjogU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG5cdHJldHVybiBTeW1ib2xQb2x5ZmlsbChkZXNjcmlwdGlvbik7XG59O1xuXG4vLyBFeHBvc2VkIGBTeW1ib2xgIGNvbnN0cnVjdG9yXG4vLyAocmV0dXJucyBpbnN0YW5jZXMgb2YgSGlkZGVuU3ltYm9sKVxubW9kdWxlLmV4cG9ydHMgPSBTeW1ib2xQb2x5ZmlsbCA9IGZ1bmN0aW9uIFN5bWJvbChkZXNjcmlwdGlvbikge1xuXHR2YXIgc3ltYm9sO1xuXHRpZiAodGhpcyBpbnN0YW5jZW9mIFN5bWJvbCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVHlwZUVycm9yOiBTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcblx0aWYgKGlzTmF0aXZlU2FmZSkgcmV0dXJuIE5hdGl2ZVN5bWJvbChkZXNjcmlwdGlvbik7XG5cdHN5bWJvbCA9IGNyZWF0ZShIaWRkZW5TeW1ib2wucHJvdG90eXBlKTtcblx0ZGVzY3JpcHRpb24gPSAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogU3RyaW5nKGRlc2NyaXB0aW9uKSk7XG5cdHJldHVybiBkZWZpbmVQcm9wZXJ0aWVzKHN5bWJvbCwge1xuXHRcdF9fZGVzY3JpcHRpb25fXzogZCgnJywgZGVzY3JpcHRpb24pLFxuXHRcdF9fbmFtZV9fOiBkKCcnLCBnZW5lcmF0ZU5hbWUoZGVzY3JpcHRpb24pKVxuXHR9KTtcbn07XG5kZWZpbmVQcm9wZXJ0aWVzKFN5bWJvbFBvbHlmaWxsLCB7XG5cdGZvcjogZChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0aWYgKGdsb2JhbFN5bWJvbHNba2V5XSkgcmV0dXJuIGdsb2JhbFN5bWJvbHNba2V5XTtcblx0XHRyZXR1cm4gKGdsb2JhbFN5bWJvbHNba2V5XSA9IFN5bWJvbFBvbHlmaWxsKFN0cmluZyhrZXkpKSk7XG5cdH0pLFxuXHRrZXlGb3I6IGQoZnVuY3Rpb24gKHMpIHtcblx0XHR2YXIga2V5O1xuXHRcdHZhbGlkYXRlU3ltYm9sKHMpO1xuXHRcdGZvciAoa2V5IGluIGdsb2JhbFN5bWJvbHMpIGlmIChnbG9iYWxTeW1ib2xzW2tleV0gPT09IHMpIHJldHVybiBrZXk7XG5cdH0pLFxuXG5cdC8vIElmIHRoZXJlJ3MgbmF0aXZlIGltcGxlbWVudGF0aW9uIG9mIGdpdmVuIHN5bWJvbCwgbGV0J3MgZmFsbGJhY2sgdG8gaXRcblx0Ly8gdG8gZW5zdXJlIHByb3BlciBpbnRlcm9wZXJhYmlsaXR5IHdpdGggb3RoZXIgbmF0aXZlIGZ1bmN0aW9ucyBlLmcuIEFycmF5LmZyb21cblx0aGFzSW5zdGFuY2U6IGQoJycsIChOYXRpdmVTeW1ib2wgJiYgTmF0aXZlU3ltYm9sLmhhc0luc3RhbmNlKSB8fCBTeW1ib2xQb2x5ZmlsbCgnaGFzSW5zdGFuY2UnKSksXG5cdGlzQ29uY2F0U3ByZWFkYWJsZTogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wuaXNDb25jYXRTcHJlYWRhYmxlKSB8fFxuXHRcdFN5bWJvbFBvbHlmaWxsKCdpc0NvbmNhdFNwcmVhZGFibGUnKSksXG5cdGl0ZXJhdG9yOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5pdGVyYXRvcikgfHwgU3ltYm9sUG9seWZpbGwoJ2l0ZXJhdG9yJykpLFxuXHRtYXRjaDogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wubWF0Y2gpIHx8IFN5bWJvbFBvbHlmaWxsKCdtYXRjaCcpKSxcblx0cmVwbGFjZTogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wucmVwbGFjZSkgfHwgU3ltYm9sUG9seWZpbGwoJ3JlcGxhY2UnKSksXG5cdHNlYXJjaDogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wuc2VhcmNoKSB8fCBTeW1ib2xQb2x5ZmlsbCgnc2VhcmNoJykpLFxuXHRzcGVjaWVzOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC5zcGVjaWVzKSB8fCBTeW1ib2xQb2x5ZmlsbCgnc3BlY2llcycpKSxcblx0c3BsaXQ6IGQoJycsIChOYXRpdmVTeW1ib2wgJiYgTmF0aXZlU3ltYm9sLnNwbGl0KSB8fCBTeW1ib2xQb2x5ZmlsbCgnc3BsaXQnKSksXG5cdHRvUHJpbWl0aXZlOiBkKCcnLCAoTmF0aXZlU3ltYm9sICYmIE5hdGl2ZVN5bWJvbC50b1ByaW1pdGl2ZSkgfHwgU3ltYm9sUG9seWZpbGwoJ3RvUHJpbWl0aXZlJykpLFxuXHR0b1N0cmluZ1RhZzogZCgnJywgKE5hdGl2ZVN5bWJvbCAmJiBOYXRpdmVTeW1ib2wudG9TdHJpbmdUYWcpIHx8IFN5bWJvbFBvbHlmaWxsKCd0b1N0cmluZ1RhZycpKSxcblx0dW5zY29wYWJsZXM6IGQoJycsIChOYXRpdmVTeW1ib2wgJiYgTmF0aXZlU3ltYm9sLnVuc2NvcGFibGVzKSB8fCBTeW1ib2xQb2x5ZmlsbCgndW5zY29wYWJsZXMnKSlcbn0pO1xuXG4vLyBJbnRlcm5hbCB0d2Vha3MgZm9yIHJlYWwgc3ltYm9sIHByb2R1Y2VyXG5kZWZpbmVQcm9wZXJ0aWVzKEhpZGRlblN5bWJvbC5wcm90b3R5cGUsIHtcblx0Y29uc3RydWN0b3I6IGQoU3ltYm9sUG9seWZpbGwpLFxuXHR0b1N0cmluZzogZCgnJywgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fX25hbWVfXzsgfSlcbn0pO1xuXG4vLyBQcm9wZXIgaW1wbGVtZW50YXRpb24gb2YgbWV0aG9kcyBleHBvc2VkIG9uIFN5bWJvbC5wcm90b3R5cGVcbi8vIFRoZXkgd29uJ3QgYmUgYWNjZXNzaWJsZSBvbiBwcm9kdWNlZCBzeW1ib2wgaW5zdGFuY2VzIGFzIHRoZXkgZGVyaXZlIGZyb20gSGlkZGVuU3ltYm9sLnByb3RvdHlwZVxuZGVmaW5lUHJvcGVydGllcyhTeW1ib2xQb2x5ZmlsbC5wcm90b3R5cGUsIHtcblx0dG9TdHJpbmc6IGQoZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1N5bWJvbCAoJyArIHZhbGlkYXRlU3ltYm9sKHRoaXMpLl9fZGVzY3JpcHRpb25fXyArICcpJzsgfSksXG5cdHZhbHVlT2Y6IGQoZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsaWRhdGVTeW1ib2wodGhpcyk7IH0pXG59KTtcbmRlZmluZVByb3BlcnR5KFN5bWJvbFBvbHlmaWxsLnByb3RvdHlwZSwgU3ltYm9sUG9seWZpbGwudG9QcmltaXRpdmUsIGQoJycsIGZ1bmN0aW9uICgpIHtcblx0dmFyIHN5bWJvbCA9IHZhbGlkYXRlU3ltYm9sKHRoaXMpO1xuXHRpZiAodHlwZW9mIHN5bWJvbCA9PT0gJ3N5bWJvbCcpIHJldHVybiBzeW1ib2w7XG5cdHJldHVybiBzeW1ib2wudG9TdHJpbmcoKTtcbn0pKTtcbmRlZmluZVByb3BlcnR5KFN5bWJvbFBvbHlmaWxsLnByb3RvdHlwZSwgU3ltYm9sUG9seWZpbGwudG9TdHJpbmdUYWcsIGQoJ2MnLCAnU3ltYm9sJykpO1xuXG4vLyBQcm9wZXIgaW1wbGVtZW50YXRvbiBvZiB0b1ByaW1pdGl2ZSBhbmQgdG9TdHJpbmdUYWcgZm9yIHJldHVybmVkIHN5bWJvbCBpbnN0YW5jZXNcbmRlZmluZVByb3BlcnR5KEhpZGRlblN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbFBvbHlmaWxsLnRvU3RyaW5nVGFnLFxuXHRkKCdjJywgU3ltYm9sUG9seWZpbGwucHJvdG90eXBlW1N5bWJvbFBvbHlmaWxsLnRvU3RyaW5nVGFnXSkpO1xuXG4vLyBOb3RlOiBJdCdzIGltcG9ydGFudCB0byBkZWZpbmUgYHRvUHJpbWl0aXZlYCBhcyBsYXN0IG9uZSwgYXMgc29tZSBpbXBsZW1lbnRhdGlvbnNcbi8vIGltcGxlbWVudCBgdG9QcmltaXRpdmVgIG5hdGl2ZWx5IHdpdGhvdXQgaW1wbGVtZW50aW5nIGB0b1N0cmluZ1RhZ2AgKG9yIG90aGVyIHNwZWNpZmllZCBzeW1ib2xzKVxuLy8gQW5kIHRoYXQgbWF5IGludm9rZSBlcnJvciBpbiBkZWZpbml0aW9uIGZsb3c6XG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9tZWRpa29vL2VzNi1zeW1ib2wvaXNzdWVzLzEzI2lzc3VlY29tbWVudC0xNjQxNDYxNDlcbmRlZmluZVByb3BlcnR5KEhpZGRlblN5bWJvbC5wcm90b3R5cGUsIFN5bWJvbFBvbHlmaWxsLnRvUHJpbWl0aXZlLFxuXHRkKCdjJywgU3ltYm9sUG9seWZpbGwucHJvdG90eXBlW1N5bWJvbFBvbHlmaWxsLnRvUHJpbWl0aXZlXSkpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuL2lzLXN5bWJvbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAoIWlzU3ltYm9sKHZhbHVlKSkgdGhyb3cgbmV3IFR5cGVFcnJvcih2YWx1ZSArIFwiIGlzIG5vdCBhIHN5bWJvbFwiKTtcblx0cmV0dXJuIHZhbHVlO1xufTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxuLy8gVGhlIF9pc0J1ZmZlciBjaGVjayBpcyBmb3IgU2FmYXJpIDUtNyBzdXBwb3J0LCBiZWNhdXNlIGl0J3MgbWlzc2luZ1xuLy8gT2JqZWN0LnByb3RvdHlwZS5jb25zdHJ1Y3Rvci4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiAoaXNCdWZmZXIob2JqKSB8fCBpc1Nsb3dCdWZmZXIob2JqKSB8fCAhIW9iai5faXNCdWZmZXIpXG59XG5cbmZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuICEhb2JqLmNvbnN0cnVjdG9yICYmIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cblxuLy8gRm9yIE5vZGUgdjAuMTAgc3VwcG9ydC4gUmVtb3ZlIHRoaXMgZXZlbnR1YWxseS5cbmZ1bmN0aW9uIGlzU2xvd0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqLnJlYWRGbG9hdExFID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBvYmouc2xpY2UgPT09ICdmdW5jdGlvbicgJiYgaXNCdWZmZXIob2JqLnNsaWNlKDAsIDApKVxufVxuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kO1xuZnVuY3Rpb24gZXh0ZW5kKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgdHlwZW9mIGFkZCAhPT0gJ29iamVjdCcpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgR3JhbW1hckRlY2wgPSByZXF1aXJlKCcuL0dyYW1tYXJEZWNsJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEJ1aWxkZXIoKSB7fVxuXG5CdWlsZGVyLnByb3RvdHlwZSA9IHtcbiAgY3VycmVudERlY2w6IG51bGwsXG5cbiAgbmV3R3JhbW1hcjogZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiBuZXcgR3JhbW1hckRlY2wobmFtZSk7XG4gIH0sXG5cbiAgZ3JhbW1hcjogZnVuY3Rpb24obWV0YUluZm8sIG5hbWUsIHN1cGVyR3JhbW1hciwgZGVmYXVsdFN0YXJ0UnVsZSwgcnVsZXMpIHtcbiAgICB2YXIgZ0RlY2wgPSBuZXcgR3JhbW1hckRlY2wobmFtZSk7XG4gICAgaWYgKHN1cGVyR3JhbW1hcikge1xuICAgICAgZ0RlY2wud2l0aFN1cGVyR3JhbW1hcih0aGlzLmZyb21SZWNpcGUoc3VwZXJHcmFtbWFyKSk7XG4gICAgfVxuICAgIGlmIChkZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICBnRGVjbC53aXRoRGVmYXVsdFN0YXJ0UnVsZShkZWZhdWx0U3RhcnRSdWxlKTtcbiAgICB9XG4gICAgaWYgKG1ldGFJbmZvICYmIG1ldGFJbmZvLnNvdXJjZSkge1xuICAgICAgZ0RlY2wud2l0aFNvdXJjZShtZXRhSW5mby5zb3VyY2UpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmN1cnJlbnREZWNsID0gZ0RlY2w7XG4gICAgT2JqZWN0LmtleXMocnVsZXMpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBydWxlUmVjaXBlID0gcnVsZXNbcnVsZU5hbWVdO1xuXG4gICAgICB2YXIgYWN0aW9uID0gcnVsZVJlY2lwZVswXTsgLy8gZGVmaW5lL2V4dGVuZC9vdmVycmlkZVxuICAgICAgdmFyIG1ldGFJbmZvID0gcnVsZVJlY2lwZVsxXTtcbiAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHJ1bGVSZWNpcGVbMl07XG4gICAgICB2YXIgZm9ybWFscyA9IHJ1bGVSZWNpcGVbM107XG4gICAgICB2YXIgYm9keSA9IHNlbGYuZnJvbVJlY2lwZShydWxlUmVjaXBlWzRdKTtcblxuICAgICAgdmFyIHNvdXJjZTtcbiAgICAgIGlmIChnRGVjbC5zb3VyY2UgJiYgbWV0YUluZm8gJiYgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwpIHtcbiAgICAgICAgc291cmNlID0gZ0RlY2wuc291cmNlLnN1YkludGVydmFsKFxuICAgICAgICAgICAgbWV0YUluZm8uc291cmNlSW50ZXJ2YWxbMF0sXG4gICAgICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbFsxXSAtIG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzBdKTtcbiAgICAgIH1cbiAgICAgIGdEZWNsW2FjdGlvbl0ocnVsZU5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpO1xuICAgIH0pO1xuICAgIHRoaXMuY3VycmVudERlY2wgPSBudWxsO1xuICAgIHJldHVybiBnRGVjbC5idWlsZCgpO1xuICB9LFxuXG4gIHRlcm1pbmFsOiBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuVGVybWluYWwoeCk7XG4gIH0sXG5cbiAgcmFuZ2U6IGZ1bmN0aW9uKGZyb20sIHRvKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUmFuZ2UoZnJvbSwgdG8pO1xuICB9LFxuXG4gIHBhcmFtOiBmdW5jdGlvbihpbmRleCkge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlBhcmFtKGluZGV4KTtcbiAgfSxcblxuICBhbHQ6IGZ1bmN0aW9uKC8qIHRlcm0xLCB0ZXJtMSwgLi4uICovKSB7XG4gICAgdmFyIHRlcm1zID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgIGlmICghKGFyZyBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgYXJnID0gdGhpcy5mcm9tUmVjaXBlKGFyZyk7XG4gICAgICB9XG4gICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLkFsdCkge1xuICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGVybXMubGVuZ3RoID09PSAxID8gdGVybXNbMF0gOiBuZXcgcGV4cHJzLkFsdCh0ZXJtcyk7XG4gIH0sXG5cbiAgc2VxOiBmdW5jdGlvbigvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICB2YXIgZmFjdG9ycyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICBpZiAoIShhcmcgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgIGFyZyA9IHRoaXMuZnJvbVJlY2lwZShhcmcpO1xuICAgICAgfVxuICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5TZXEpIHtcbiAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZhY3RvcnMucHVzaChhcmcpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IHBleHBycy5TZXEoZmFjdG9ycyk7XG4gIH0sXG5cbiAgc3RhcjogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5TdGFyKGV4cHIpO1xuICB9LFxuXG4gIHBsdXM6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuUGx1cyhleHByKTtcbiAgfSxcblxuICBvcHQ6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuT3B0KGV4cHIpO1xuICB9LFxuXG4gIG5vdDogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5Ob3QoZXhwcik7XG4gIH0sXG5cbiAgbGE6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgdG8gc3RpbGwgYmUgYWJsZSB0byByZWFkIG9sZCByZWNpcGVzXG4gICAgcmV0dXJuIHRoaXMubG9va2FoZWFkKGV4cHIpO1xuICB9LFxuXG4gIGxvb2thaGVhZDogZnVuY3Rpb24oZXhwcikge1xuICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IHBleHBycy5Mb29rYWhlYWQoZXhwcik7XG4gIH0sXG5cbiAgbGV4OiBmdW5jdGlvbihleHByKSB7XG4gICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLkxleChleHByKTtcbiAgfSxcblxuICBhcHA6IGZ1bmN0aW9uKHJ1bGVOYW1lLCBvcHRQYXJhbXMpIHtcbiAgICBpZiAob3B0UGFyYW1zICYmIG9wdFBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICBvcHRQYXJhbXMgPSBvcHRQYXJhbXMubWFwKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHJldHVybiBwYXJhbSBpbnN0YW5jZW9mIHBleHBycy5QRXhwciA/IHBhcmFtIDpcbiAgICAgICAgICB0aGlzLmZyb21SZWNpcGUocGFyYW0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHJ1bGVOYW1lLCBvcHRQYXJhbXMpO1xuICB9LFxuXG4gIGZyb21SZWNpcGU6IGZ1bmN0aW9uKHJlY2lwZSkge1xuICAgIC8vIHRoZSBtZXRhLWluZm8gb2YgJ2dyYW1tYXInIGlzIHByb2NjZXNzZWQgaW4gQnVpbGRlci5ncmFtbWFyXG4gICAgdmFyIHJlc3VsdCA9IHRoaXNbcmVjaXBlWzBdXS5hcHBseSh0aGlzLFxuICAgICAgcmVjaXBlWzBdID09PSAnZ3JhbW1hcicgPyByZWNpcGUuc2xpY2UoMSkgOiByZWNpcGUuc2xpY2UoMikpO1xuXG4gICAgdmFyIG1ldGFJbmZvID0gcmVjaXBlWzFdO1xuICAgIGlmIChtZXRhSW5mbykge1xuICAgICAgaWYgKG1ldGFJbmZvLnNvdXJjZUludGVydmFsICYmIHRoaXMuY3VycmVudERlY2wpIHtcbiAgICAgICAgcmVzdWx0LndpdGhTb3VyY2UoXG4gICAgICAgICAgdGhpcy5jdXJyZW50RGVjbC5zb3VyY2VJbnRlcnZhbC5hcHBseSh0aGlzLmN1cnJlbnREZWNsLCBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG52YXIgVGVybWluYWxOb2RlID0gcmVxdWlyZSgnLi9ub2RlcycpLlRlcm1pbmFsTm9kZTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2NvbW1vbicpLmFzc2VydDtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuZnVuY3Rpb24gQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwocGFyYW0pIHtcbiAgdGhpcy5vYmogPSBwYXJhbTtcbn1cbmluaGVyaXRzKENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLCBwZXhwcnMuUEV4cHIpO1xuXG5DYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5wcm90b3R5cGUgPSB7XG4gIF9nZXRTdHJpbmc6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgdmFyIHRlcm1pbmFsID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLm9iai5pbmRleF07XG4gICAgYXNzZXJ0KHRlcm1pbmFsIGluc3RhbmNlb2YgcGV4cHJzLlRlcm1pbmFsLCAnZXhwZWN0ZWQgYSBUZXJtaW5hbCBleHByZXNzaW9uJyk7XG4gICAgcmV0dXJuIHRlcm1pbmFsLm9iajtcbiAgfSxcblxuICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgUEV4cHIgQVBJXG5cbiAgYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgZXZhbDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgbWF0Y2hTdHIgPSB0aGlzLl9nZXRTdHJpbmcoc3RhdGUpO1xuICAgIGlmICghaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcobWF0Y2hTdHIsIHRydWUpKSB7XG4gICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBtYXRjaFN0ciksIG9yaWdQb3MpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LFxuXG4gIGdlbmVyYXRlRXhhbXBsZXM6IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICAvLyBTdGFydCB3aXRoIGEgZXhhbXBsZSBnZW5lcmF0ZWQgZnJvbSB0aGUgVGVybWluYWwuLi5cbiAgICB2YXIgc3RyID0gdGhpcy5vYmouZ2VuZXJhdGVFeGFtcGxlcyhncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKS52YWx1ZTtcblxuICAgIC8vIC4uLmFuZCByYW5kb21seSBzd2l0Y2ggY2hhcmFjdGVycyB0byB1cHBlcmNhc2UvbG93ZXJjYXNlLlxuICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgICB2YWx1ZSArPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gc3RyW2ldLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiBzdHJbaV0udG9Mb2NhbGVVcHBlckNhc2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIHt2YWx1ZTogdmFsdWV9O1xuICB9LFxuXG4gIGdldEFyaXR5OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gMTtcbiAgfSxcblxuICBzdWJzdGl0dXRlUGFyYW1zOiBmdW5jdGlvbihhY3R1YWxzKSB7XG4gICAgcmV0dXJuIG5ldyBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCh0aGlzLm9iai5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbiAgfSxcblxuICB0b0ZhaWx1cmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCB0aGlzLm9iai50b0ZhaWx1cmUoKSArICcgKGNhc2UtaW5zZW5zaXRpdmUpJywgJ2Rlc2NyaXB0aW9uJyk7XG4gIH0sXG5cbiAgX2lzTnVsbGFibGU6IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy5vYmouX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FzZUluc2Vuc2l0aXZlVGVybWluYWw7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBgRmFpbHVyZWBzIHJlcHJlc2VudCBleHByZXNzaW9ucyB0aGF0IHdlcmVuJ3QgbWF0Y2hlZCB3aGlsZSBwYXJzaW5nLiBUaGV5IGFyZSB1c2VkIHRvIGdlbmVyYXRlXG4gIGVycm9yIG1lc3NhZ2VzIGF1dG9tYXRpY2FsbHkuIFRoZSBpbnRlcmZhY2Ugb2YgYEZhaWx1cmVgcyBpbmNsdWRlcyB0aGUgY29sbG93aW5nIG1ldGhvZHM6XG5cbiAgLSBnZXRUZXh0KCkgOiBTdHJpbmdcbiAgLSBnZXRUeXBlKCkgOiBTdHJpbmcgIChvbmUgb2Yge1wiZGVzY3JpcHRpb25cIiwgXCJzdHJpbmdcIiwgXCJjb2RlXCJ9KVxuICAtIGlzRGVzY3JpcHRpb24oKSA6IGJvb2xcbiAgLSBpc1N0cmluZ1Rlcm1pbmFsKCkgOiBib29sXG4gIC0gaXNDb2RlKCkgOiBib29sXG4gIC0gaXNGbHVmZnkoKSA6IGJvb2xcbiAgLSBtYWtlRmx1ZmZ5KCkgOiB2b2lkXG4gIC0gc3Vic3VtZXMoRmFpbHVyZSkgOiBib29sXG4qL1xuXG5mdW5jdGlvbiBpc1ZhbGlkVHlwZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlID09PSAnZGVzY3JpcHRpb24nIHx8IHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdjb2RlJztcbn1cblxuZnVuY3Rpb24gRmFpbHVyZShwZXhwciwgdGV4dCwgdHlwZSkge1xuICBpZiAoIWlzVmFsaWRUeXBlKHR5cGUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIEZhaWx1cmUgdHlwZTogJyArIHR5cGUpO1xuICB9XG4gIHRoaXMucGV4cHIgPSBwZXhwcjtcbiAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgdGhpcy50eXBlID0gdHlwZTtcbiAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn1cblxuRmFpbHVyZS5wcm90b3R5cGUuZ2V0UEV4cHIgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMucGV4cHI7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnRleHQ7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGU7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5pc0Rlc2NyaXB0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdkZXNjcmlwdGlvbic7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS5pc1N0cmluZ1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdzdHJpbmcnO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuaXNDb2RlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnR5cGUgPT09ICdjb2RlJztcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmlzRmx1ZmZ5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZsdWZmeTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLm1ha2VGbHVmZnkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5mbHVmZnkgPSB0cnVlO1xufTtcblxuRmFpbHVyZS5wcm90b3R5cGUuY2xlYXJGbHVmZnkgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLnN1YnN1bWVzID0gZnVuY3Rpb24odGhhdCkge1xuICByZXR1cm4gdGhpcy5nZXRUZXh0KCkgPT09IHRoYXQuZ2V0VGV4dCgpICYmXG4gICAgICB0aGlzLnR5cGUgPT09IHRoYXQudHlwZSAmJlxuICAgICAgKCF0aGlzLmlzRmx1ZmZ5KCkgfHwgdGhpcy5pc0ZsdWZmeSgpICYmIHRoYXQuaXNGbHVmZnkoKSk7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50eXBlID09PSAnc3RyaW5nJyA/XG4gICAgSlNPTi5zdHJpbmdpZnkodGhpcy5nZXRUZXh0KCkpIDpcbiAgICB0aGlzLmdldFRleHQoKTtcbn07XG5cbkZhaWx1cmUucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHZhciBmYWlsdXJlID0gbmV3IEZhaWx1cmUodGhpcy5wZXhwciwgdGhpcy50ZXh0LCB0aGlzLnR5cGUpO1xuICBpZiAodGhpcy5pc0ZsdWZmeSgpKSB7XG4gICAgZmFpbHVyZS5tYWtlRmx1ZmZ5KCk7XG4gIH1cbiAgcmV0dXJuIGZhaWx1cmU7XG59O1xuXG5GYWlsdXJlLnByb3RvdHlwZS50b0tleSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygpICsgJyMnICsgdGhpcy50eXBlO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gRmFpbHVyZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCA9IHJlcXVpcmUoJy4vQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwnKTtcbnZhciBNYXRjaGVyID0gcmVxdWlyZSgnLi9NYXRjaGVyJyk7XG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGdldFNvcnRlZFJ1bGVWYWx1ZXMoZ3JhbW1hcikge1xuICByZXR1cm4gT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuc29ydCgpLm1hcChmdW5jdGlvbihuYW1lKSB7IHJldHVybiBncmFtbWFyLnJ1bGVzW25hbWVdOyB9KTtcbn1cblxuZnVuY3Rpb24gR3JhbW1hcihcbiAgICBuYW1lLFxuICAgIHN1cGVyR3JhbW1hcixcbiAgICBydWxlcyxcbiAgICBvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gIGlmIChvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgaWYgKCEob3B0RGVmYXVsdFN0YXJ0UnVsZSBpbiBydWxlcykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3RhcnQgcnVsZTogJ1wiICsgb3B0RGVmYXVsdFN0YXJ0UnVsZSArXG4gICAgICAgICAgICAgICAgICAgICAgXCInIGlzIG5vdCBhIHJ1bGUgaW4gZ3JhbW1hciAnXCIgKyBuYW1lICsgXCInXCIpO1xuICAgIH1cbiAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBvcHREZWZhdWx0U3RhcnRSdWxlO1xuICB9XG59XG5cbnZhciBvaG1HcmFtbWFyO1xudmFyIGJ1aWxkR3JhbW1hcjtcblxuLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gbWFpbi5qcyBvbmNlIE9obSBoYXMgbG9hZGVkLlxuR3JhbW1hci5pbml0QXBwbGljYXRpb25QYXJzZXIgPSBmdW5jdGlvbihncmFtbWFyLCBidWlsZGVyRm4pIHtcbiAgb2htR3JhbW1hciA9IGdyYW1tYXI7XG4gIGJ1aWxkR3JhbW1hciA9IGJ1aWxkZXJGbjtcbn07XG5cbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICBtYXRjaGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IE1hdGNoZXIodGhpcyk7XG4gIH0sXG5cbiAgLy8gUmV0dXJuIHRydWUgaWYgdGhlIGdyYW1tYXIgaXMgYSBidWlsdC1pbiBncmFtbWFyLCBvdGhlcndpc2UgZmFsc2UuXG4gIC8vIE5PVEU6IFRoaXMgbWlnaHQgZ2l2ZSBhbiB1bmV4cGVjdGVkIHJlc3VsdCBpZiBjYWxsZWQgYmVmb3JlIEJ1aWx0SW5SdWxlcyBpcyBkZWZpbmVkIVxuICBpc0J1aWx0SW46IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzID09PSBHcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzIHx8IHRoaXMgPT09IEdyYW1tYXIuQnVpbHRJblJ1bGVzO1xuICB9LFxuXG4gIGVxdWFsczogZnVuY3Rpb24oZykge1xuICAgIGlmICh0aGlzID09PSBnKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRG8gdGhlIGNoZWFwZXN0IGNvbXBhcmlzb25zIGZpcnN0LlxuICAgIGlmIChnID09IG51bGwgfHxcbiAgICAgICAgdGhpcy5uYW1lICE9PSBnLm5hbWUgfHxcbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlICE9PSBnLmRlZmF1bHRTdGFydFJ1bGUgfHxcbiAgICAgICAgISh0aGlzLnN1cGVyR3JhbW1hciA9PT0gZy5zdXBlckdyYW1tYXIgfHwgdGhpcy5zdXBlckdyYW1tYXIuZXF1YWxzKGcuc3VwZXJHcmFtbWFyKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG15UnVsZXMgPSBnZXRTb3J0ZWRSdWxlVmFsdWVzKHRoaXMpO1xuICAgIHZhciBvdGhlclJ1bGVzID0gZ2V0U29ydGVkUnVsZVZhbHVlcyhnKTtcbiAgICByZXR1cm4gbXlSdWxlcy5sZW5ndGggPT09IG90aGVyUnVsZXMubGVuZ3RoICYmIG15UnVsZXMuZXZlcnkoZnVuY3Rpb24ocnVsZSwgaSkge1xuICAgICAgcmV0dXJuIHJ1bGUuZGVzY3JpcHRpb24gPT09IG90aGVyUnVsZXNbaV0uZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICBydWxlLmZvcm1hbHMuam9pbignLCcpID09PSBvdGhlclJ1bGVzW2ldLmZvcm1hbHMuam9pbignLCcpICYmXG4gICAgICAgICAgICAgcnVsZS5ib2R5LnRvU3RyaW5nKCkgPT09IG90aGVyUnVsZXNbaV0uYm9keS50b1N0cmluZygpO1xuICAgIH0pO1xuICB9LFxuXG4gIG1hdGNoOiBmdW5jdGlvbihpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgIHZhciBtID0gdGhpcy5tYXRjaGVyKCk7XG4gICAgbS5yZXBsYWNlSW5wdXRSYW5nZSgwLCAwLCBpbnB1dCk7XG4gICAgcmV0dXJuIG0ubWF0Y2gob3B0U3RhcnRBcHBsaWNhdGlvbik7XG4gIH0sXG5cbiAgdHJhY2U6IGZ1bmN0aW9uKGlucHV0LCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgdmFyIG0gPSB0aGlzLm1hdGNoZXIoKTtcbiAgICBtLnJlcGxhY2VJbnB1dFJhbmdlKDAsIDAsIGlucHV0KTtcbiAgICByZXR1cm4gbS50cmFjZShvcHRTdGFydEFwcGxpY2F0aW9uKTtcbiAgfSxcblxuICBzZW1hbnRpY3M6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkhIERlcHJlY2F0ZWQgaW4gdjAuMTIuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZW1hbnRpY3MoKSBpcyBkZXByZWNhdGVkIC0tIHVzZSBjcmVhdGVTZW1hbnRpY3MoKSBpbnN0ZWFkLicpO1xuICB9LFxuXG4gIGNyZWF0ZVNlbWFudGljczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3ModGhpcyk7XG4gIH0sXG5cbiAgZXh0ZW5kU2VtYW50aWNzOiBmdW5jdGlvbihzdXBlclNlbWFudGljcykge1xuICAgIHJldHVybiBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzKHRoaXMsIHN1cGVyU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG4gIH0sXG5cbiAgLy8gQ2hlY2sgdGhhdCBldmVyeSBrZXkgaW4gYGFjdGlvbkRpY3RgIGNvcnJlc3BvbmRzIHRvIGEgc2VtYW50aWMgYWN0aW9uLCBhbmQgdGhhdCBpdCBtYXBzIHRvXG4gIC8vIGEgZnVuY3Rpb24gb2YgdGhlIGNvcnJlY3QgYXJpdHkuIElmIG5vdCwgdGhyb3cgYW4gZXhjZXB0aW9uLlxuICBfY2hlY2tUb3BEb3duQWN0aW9uRGljdDogZnVuY3Rpb24od2hhdCwgbmFtZSwgYWN0aW9uRGljdCkge1xuICAgIGZ1bmN0aW9uIGlzU3BlY2lhbEFjdGlvbihhKSB7XG4gICAgICByZXR1cm4gYSA9PT0gJ19pdGVyJyB8fCBhID09PSAnX3Rlcm1pbmFsJyB8fCBhID09PSAnX25vbnRlcm1pbmFsJyB8fCBhID09PSAnX2RlZmF1bHQnO1xuICAgIH1cblxuICAgIHZhciBwcm9ibGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGsgaW4gYWN0aW9uRGljdCkge1xuICAgICAgdmFyIHYgPSBhY3Rpb25EaWN0W2tdO1xuICAgICAgaWYgKCFpc1NwZWNpYWxBY3Rpb24oaykgJiYgIShrIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIGlzIG5vdCBhIHZhbGlkIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwcm9ibGVtcy5wdXNoKFxuICAgICAgICAgICAgXCInXCIgKyBrICsgXCInIG11c3QgYmUgYSBmdW5jdGlvbiBpbiBhbiBhY3Rpb24gZGljdGlvbmFyeSBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGFjdHVhbCA9IHYubGVuZ3RoO1xuICAgICAgICB2YXIgZXhwZWN0ZWQgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkoayk7XG4gICAgICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgICAgcHJvYmxlbXMucHVzaChcbiAgICAgICAgICAgICAgXCJTZW1hbnRpYyBhY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBcIiArXG4gICAgICAgICAgICAgICdleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb2JsZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBwcmV0dHlQcm9ibGVtcyA9IHByb2JsZW1zLm1hcChmdW5jdGlvbihwcm9ibGVtKSB7IHJldHVybiAnLSAnICsgcHJvYmxlbTsgfSk7XG4gICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJGb3VuZCBlcnJvcnMgaW4gdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IG9mIHRoZSAnXCIgKyBuYW1lICsgXCInIFwiICsgd2hhdCArICc6XFxuJyArXG4gICAgICAgICAgcHJldHR5UHJvYmxlbXMuam9pbignXFxuJykpO1xuICAgICAgZXJyb3IucHJvYmxlbXMgPSBwcm9ibGVtcztcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSxcblxuICAvLyBSZXR1cm4gdGhlIGV4cGVjdGVkIGFyaXR5IGZvciBhIHNlbWFudGljIGFjdGlvbiBuYW1lZCBgYWN0aW9uTmFtZWAsIHdoaWNoXG4gIC8vIGlzIGVpdGhlciBhIHJ1bGUgbmFtZSBvciBhIHNwZWNpYWwgYWN0aW9uIG5hbWUgbGlrZSAnX25vbnRlcm1pbmFsJy5cbiAgX3RvcERvd25BY3Rpb25Bcml0eTogZnVuY3Rpb24oYWN0aW9uTmFtZSkge1xuICAgIGlmIChhY3Rpb25OYW1lID09PSAnX2l0ZXInIHx8IGFjdGlvbk5hbWUgPT09ICdfbm9udGVybWluYWwnIHx8IGFjdGlvbk5hbWUgPT09ICdfZGVmYXVsdCcpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ190ZXJtaW5hbCcpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5ydWxlc1thY3Rpb25OYW1lXS5ib2R5LmdldEFyaXR5KCk7XG4gIH0sXG5cbiAgX2luaGVyaXRzRnJvbTogZnVuY3Rpb24oZ3JhbW1hcikge1xuICAgIHZhciBnID0gdGhpcy5zdXBlckdyYW1tYXI7XG4gICAgd2hpbGUgKGcpIHtcbiAgICAgIGlmIChnLmVxdWFscyhncmFtbWFyLCB0cnVlKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGcgPSBnLnN1cGVyR3JhbW1hcjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIHRvUmVjaXBlOiBmdW5jdGlvbihvcHRWYXJOYW1lKSB7XG4gICAgdmFyIG1ldGFJbmZvID0ge307XG4gICAgLy8gSW5jbHVkZSB0aGUgZ3JhbW1hciBzb3VyY2UgaWYgaXQgaXMgYXZhaWxhYmxlLlxuICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgbWV0YUluZm8uc291cmNlID0gdGhpcy5zb3VyY2UuY29udGVudHM7XG4gICAgfVxuXG4gICAgdmFyIHN1cGVyR3JhbW1hciA9IG51bGw7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyICYmICF0aGlzLnN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgICAgc3VwZXJHcmFtbWFyID0gSlNPTi5wYXJzZSh0aGlzLnN1cGVyR3JhbW1hci50b1JlY2lwZSgpKTtcbiAgICB9XG5cbiAgICB2YXIgc3RhcnRSdWxlID0gbnVsbDtcbiAgICBpZiAodGhpcy5kZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICBzdGFydFJ1bGUgPSB0aGlzLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgfVxuXG4gICAgdmFyIHJ1bGVzID0ge307XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMucnVsZXMpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBydWxlSW5mbyA9IHNlbGYucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgdmFyIGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICAgICAgdmFyIGlzRGVmaW5pdGlvbiA9ICFzZWxmLnN1cGVyR3JhbW1hciB8fCAhc2VsZi5zdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdO1xuXG4gICAgICB2YXIgb3BlcmF0aW9uO1xuICAgICAgaWYgKGlzRGVmaW5pdGlvbikge1xuICAgICAgICBvcGVyYXRpb24gPSAnZGVmaW5lJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9wZXJhdGlvbiA9IGJvZHkgaW5zdGFuY2VvZiBwZXhwcnMuRXh0ZW5kID8gJ2V4dGVuZCcgOiAnb3ZlcnJpZGUnO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgICAgIGlmIChydWxlSW5mby5zb3VyY2UgJiYgc2VsZi5zb3VyY2UpIHtcbiAgICAgICAgdmFyIGFkanVzdGVkID0gcnVsZUluZm8uc291cmNlLnJlbGF0aXZlVG8oc2VsZi5zb3VyY2UpO1xuICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCA9IFthZGp1c3RlZC5zdGFydElkeCwgYWRqdXN0ZWQuZW5kSWR4XTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRlc2NyaXB0aW9uID0gaXNEZWZpbml0aW9uID8gcnVsZUluZm8uZGVzY3JpcHRpb24gOiBudWxsO1xuICAgICAgdmFyIGJvZHlSZWNpcGUgPSBib2R5Lm91dHB1dFJlY2lwZShydWxlSW5mby5mb3JtYWxzLCBzZWxmLnNvdXJjZSk7XG5cbiAgICAgIHJ1bGVzW3J1bGVOYW1lXSA9IFtcbiAgICAgICAgb3BlcmF0aW9uLCAvLyBcImRlZmluZVwiL1wiZXh0ZW5kXCIvXCJvdmVycmlkZVwiXG4gICAgICAgIG1ldGFJbmZvLFxuICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgcnVsZUluZm8uZm9ybWFscyxcbiAgICAgICAgYm9keVJlY2lwZVxuICAgICAgXTtcbiAgICB9KTtcblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbXG4gICAgICAnZ3JhbW1hcicsXG4gICAgICBtZXRhSW5mbyxcbiAgICAgIHRoaXMubmFtZSxcbiAgICAgIHN1cGVyR3JhbW1hcixcbiAgICAgIHN0YXJ0UnVsZSxcbiAgICAgIHJ1bGVzXG4gICAgXSk7XG4gIH0sXG5cbiAgLy8gVE9ETzogQ29tZSB1cCB3aXRoIGJldHRlciBuYW1lcyBmb3IgdGhlc2UgbWV0aG9kcy5cbiAgLy8gVE9ETzogV3JpdGUgdGhlIGFuYWxvZyBvZiB0aGVzZSBtZXRob2RzIGZvciBpbmhlcml0ZWQgYXR0cmlidXRlcy5cbiAgdG9PcGVyYXRpb25BY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gIH0sXG4gIHRvQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICB9LFxuXG4gIF90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbigpIHtcbiAgICAvLyBUT0RPOiBhZGQgdGhlIHN1cGVyLWdyYW1tYXIncyB0ZW1wbGF0ZXMgYXQgdGhlIHJpZ2h0IHBsYWNlLCBlLmcuLCBhIGNhc2UgZm9yIEFkZEV4cHJfcGx1c1xuICAgIC8vIHNob3VsZCBhcHBlYXIgbmV4dCB0byBvdGhlciBjYXNlcyBvZiBBZGRFeHByLlxuXG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICBzYi5hcHBlbmQoJ3snKTtcblxuICAgIHZhciBmaXJzdCA9IHRydWU7XG4gICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gdGhpcy5ydWxlcykge1xuICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVzW3J1bGVOYW1lXS5ib2R5O1xuICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgIGZpcnN0ID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzYi5hcHBlbmQoJywnKTtcbiAgICAgIH1cbiAgICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gICAgICBzYi5hcHBlbmQoJyAgJyk7XG4gICAgICB0aGlzLmFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGUocnVsZU5hbWUsIGJvZHksIHNiKTtcbiAgICB9XG5cbiAgICBzYi5hcHBlbmQoJ1xcbn0nKTtcbiAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbiAgfSxcblxuICBhZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlOiBmdW5jdGlvbihydWxlTmFtZSwgYm9keSwgc2IpIHtcbiAgICBzYi5hcHBlbmQocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZCgnOiBmdW5jdGlvbignKTtcbiAgICB2YXIgYXJpdHkgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkocnVsZU5hbWUpO1xuICAgIHNiLmFwcGVuZChjb21tb24ucmVwZWF0KCdfJywgYXJpdHkpLmpvaW4oJywgJykpO1xuICAgIHNiLmFwcGVuZCgnKSB7XFxuJyk7XG4gICAgc2IuYXBwZW5kKCcgIH0nKTtcbiAgfSxcblxuICAvLyBQYXJzZSBhIHN0cmluZyB3aGljaCBleHByZXNzZXMgYSBydWxlIGFwcGxpY2F0aW9uIGluIHRoaXMgZ3JhbW1hciwgYW5kIHJldHVybiB0aGVcbiAgLy8gcmVzdWx0aW5nIEFwcGx5IG5vZGUuXG4gIHBhcnNlQXBwbGljYXRpb246IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBhcHA7XG4gICAgaWYgKHN0ci5pbmRleE9mKCc8JykgPT09IC0xKSB7XG4gICAgICAvLyBzaW1wbGUgYXBwbGljYXRpb25cbiAgICAgIGFwcCA9IG5ldyBwZXhwcnMuQXBwbHkoc3RyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGFyYW1ldGVyaXplZCBhcHBsaWNhdGlvblxuICAgICAgdmFyIGNzdCA9IG9obUdyYW1tYXIubWF0Y2goc3RyLCAnQmFzZV9hcHBsaWNhdGlvbicpO1xuICAgICAgYXBwID0gYnVpbGRHcmFtbWFyKGNzdCwge30pO1xuICAgIH1cblxuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHBsaWNhdGlvbiBpcyB2YWxpZC5cbiAgICBpZiAoIShhcHAucnVsZU5hbWUgaW4gdGhpcy5ydWxlcykpIHtcbiAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkUnVsZShhcHAucnVsZU5hbWUsIHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHZhciBmb3JtYWxzID0gdGhpcy5ydWxlc1thcHAucnVsZU5hbWVdLmZvcm1hbHM7XG4gICAgaWYgKGZvcm1hbHMubGVuZ3RoICE9PSBhcHAuYXJncy5sZW5ndGgpIHtcbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnJ1bGVzW2FwcC5ydWxlTmFtZV0uc291cmNlO1xuICAgICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKGFwcC5ydWxlTmFtZSwgZm9ybWFscy5sZW5ndGgsIGFwcC5hcmdzLmxlbmd0aCwgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcDtcbiAgfVxufTtcblxuLy8gVGhlIGZvbGxvd2luZyBncmFtbWFyIGNvbnRhaW5zIGEgZmV3IHJ1bGVzIHRoYXQgY291bGRuJ3QgYmUgd3JpdHRlbiAgaW4gXCJ1c2VybGFuZFwiLlxuLy8gQXQgdGhlIGJvdHRvbSBvZiBzcmMvbWFpbi5qcywgd2UgY3JlYXRlIGEgc3ViLWdyYW1tYXIgb2YgdGhpcyBncmFtbWFyIHRoYXQncyBjYWxsZWRcbi8vIGBCdWlsdEluUnVsZXNgLiBUaGF0IGdyYW1tYXIgY29udGFpbnMgc2V2ZXJhbCBjb252ZW5pZW5jZSBydWxlcywgZS5nLiwgYGxldHRlcmAgYW5kXG4vLyBgZGlnaXRgLCBhbmQgaXMgaW1wbGljaXRseSB0aGUgc3VwZXItZ3JhbW1hciBvZiBhbnkgZ3JhbW1hciB3aG9zZSBzdXBlci1ncmFtbWFyXG4vLyBpc24ndCBzcGVjaWZpZWQuXG5HcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzID0gbmV3IEdyYW1tYXIoXG4gICdQcm90b0J1aWx0SW5SdWxlcycsICAvLyBuYW1lXG4gIHVuZGVmaW5lZCwgIC8vIHN1cGVyZ3JhbW1hclxuICB7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBydWxlcyBjYW4ndCBiZSB3cml0dGVuIGluIHVzZXJsYW5kIGJlY2F1c2UgdGhleSByZWZlcmVuY2VcbiAgICAvLyBgYW55YCBhbmQgYGVuZGAgZGlyZWN0bHkuXG4gICAgYW55OiB7Ym9keTogcGV4cHJzLmFueSwgZm9ybWFsczogW10sIGRlc2NyaXB0aW9uOiAnYW55IG9iamVjdCd9LFxuICAgIGVuZDoge2JvZHk6IHBleHBycy5lbmQsIGZvcm1hbHM6IFtdLCBkZXNjcmlwdGlvbjogJ2VuZCBvZiBpbnB1dCd9LFxuXG4gICAgY2FzZUluc2Vuc2l0aXZlOiB7XG4gICAgICBib2R5OiBuZXcgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwobmV3IHBleHBycy5QYXJhbSgwKSksXG4gICAgICBmb3JtYWxzOiBbJ2V4cHInXVxuICAgIH0sXG5cbiAgICAvLyBUaGUgZm9sbG93aW5nIHJ1bGUgaXMgaW52b2tlZCBpbXBsaWNpdGx5IGJ5IHN5bnRhY3RpYyBydWxlcyB0byBza2lwIHNwYWNlcy5cbiAgICBzcGFjZXM6IHtcbiAgICAgIGJvZHk6IG5ldyBwZXhwcnMuU3RhcihuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZScpKSxcbiAgICAgIGZvcm1hbHM6IFtdXG4gICAgfSxcblxuICAgIC8vIFRoZSBgc3BhY2VgIHJ1bGUgbXVzdCBiZSBkZWZpbmVkIGhlcmUgYmVjYXVzZSBpdCdzIHJlZmVyZW5jZWQgYnkgYHNwYWNlc2AuXG4gICAgc3BhY2U6IHtcbiAgICAgIGJvZHk6IG5ldyBwZXhwcnMuUmFuZ2UoJ1xceDAwJywgJyAnKSxcbiAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgZGVzY3JpcHRpb246ICdhIHNwYWNlJ1xuICAgIH0sXG5cbiAgICAvLyBUaGVzZSBydWxlcyBhcmUgaW1wbGVtZW50ZWQgbmF0aXZlbHkgYmVjYXVzZSB0aGV5IHVzZSBVbmljb2RlQ2hhciBkaXJlY3RseSwgd2hpY2ggaXNcbiAgICAvLyBub3QgcGFydCBvZiB0aGUgT2htIGdyYW1tYXIuXG4gICAgbG93ZXI6IHtcbiAgICAgIGJvZHk6IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0xsJyksXG4gICAgICBmb3JtYWxzOiBbXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnYSBsb3dlcmNhc2UgbGV0dGVyJ1xuICAgIH0sXG4gICAgdXBwZXI6IHtcbiAgICAgIGJvZHk6IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0x1JyksXG4gICAgICBmb3JtYWxzOiBbXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnYW4gdXBwZXJjYXNlIGxldHRlcidcbiAgICB9LFxuXG4gICAgLy8gVGhlIHVuaW9uIG9mIEx0ICh0aXRsZWNhc2UpLCBMbSAobW9kaWZpZXIpLCBhbmQgTG8gKG90aGVyKSwgaS5lLiBhbnkgbGV0dGVyIG5vdFxuICAgIC8vIGluIExsIG9yIEx1LlxuICAgIHVuaWNvZGVMdG1vOiB7XG4gICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdG1vJyksXG4gICAgICBmb3JtYWxzOiBbXVxuICAgIH1cbiAgfVxuKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hcjtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBDb25zdHJ1Y3RvcnNcblxuZnVuY3Rpb24gR3JhbW1hckRlY2wobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xufVxuXG4vLyBIZWxwZXJzXG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5zb3VyY2VJbnRlcnZhbCA9IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgcmV0dXJuIHRoaXMuc291cmNlLnN1YkludGVydmFsKHN0YXJ0SWR4LCBlbmRJZHggLSBzdGFydElkeCk7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZW5zdXJlU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24oKSB7XG4gIGlmICghdGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aGlzLndpdGhTdXBlckdyYW1tYXIoXG4gICAgICAgIC8vIFRPRE86IFRoZSBjb25kaXRpb25hbCBleHByZXNzaW9uIGJlbG93IGlzIGFuIHVnbHkgaGFjay4gSXQncyBraW5kIG9mIG9rIGJlY2F1c2VcbiAgICAgICAgLy8gSSBkb3VidCBhbnlvbmUgd2lsbCBldmVyIHRyeSB0byBkZWNsYXJlIGEgZ3JhbW1hciBjYWxsZWQgYEJ1aWx0SW5SdWxlc2AuIFN0aWxsLFxuICAgICAgICAvLyB3ZSBzaG91bGQgdHJ5IHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMuXG4gICAgICAgIHRoaXMubmFtZSA9PT0gJ0J1aWx0SW5SdWxlcycgP1xuICAgICAgICAgICAgR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA6XG4gICAgICAgICAgICBHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyO1xufTtcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpIHtcbiAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBzb3VyY2UpO1xuICB9XG4gIHZhciBydWxlSW5mbyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZXNbbmFtZV07XG4gIHZhciBleHBlY3RlZEZvcm1hbHMgPSBydWxlSW5mby5mb3JtYWxzO1xuICB2YXIgZXhwZWN0ZWROdW1Gb3JtYWxzID0gZXhwZWN0ZWRGb3JtYWxzID8gZXhwZWN0ZWRGb3JtYWxzLmxlbmd0aCA6IDA7XG4gIGlmIChmb3JtYWxzLmxlbmd0aCAhPT0gZXhwZWN0ZWROdW1Gb3JtYWxzKSB7XG4gICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKG5hbWUsIGV4cGVjdGVkTnVtRm9ybWFscywgZm9ybWFscy5sZW5ndGgsIHNvdXJjZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5LCBydWxlSW5mby5kZXNjcmlwdGlvbiwgc291cmNlKTtcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsID0gZnVuY3Rpb24obmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSkge1xuICB0aGlzLnJ1bGVzW25hbWVdID0ge1xuICAgIGJvZHk6IGJvZHkuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpLFxuICAgIGZvcm1hbHM6IGZvcm1hbHMsXG4gICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgIHNvdXJjZTogc291cmNlXG4gIH07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gU3R1ZmYgdGhhdCB5b3Ugc2hvdWxkIG9ubHkgZG8gb25jZVxuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aFN1cGVyR3JhbW1hciA9IGZ1bmN0aW9uKHN1cGVyR3JhbW1hcikge1xuICBpZiAodGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBzdXBlciBncmFtbWFyIG9mIGEgR3JhbW1hckRlY2wgY2Fubm90IGJlIHNldCBtb3JlIHRoYW4gb25jZScpO1xuICB9XG4gIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICB0aGlzLnJ1bGVzID0gT2JqZWN0LmNyZWF0ZShzdXBlckdyYW1tYXIucnVsZXMpO1xuXG4gIC8vIEdyYW1tYXJzIHdpdGggYW4gZXhwbGljaXQgc3VwZXJncmFtbWFyIGluaGVyaXQgYSBkZWZhdWx0IHN0YXJ0IHJ1bGUuXG4gIGlmICghc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gc3VwZXJHcmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aERlZmF1bHRTdGFydFJ1bGUgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBydWxlTmFtZTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aFNvdXJjZSA9IGZ1bmN0aW9uKHNvdXJjZSkge1xuICB0aGlzLnNvdXJjZSA9IG5ldyBJbnB1dFN0cmVhbShzb3VyY2UpLmludGVydmFsKDAsIHNvdXJjZS5sZW5ndGgpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIENyZWF0ZXMgYSBHcmFtbWFyIGluc3RhbmNlLCBhbmQgaWYgaXQgcGFzc2VzIHRoZSBzYW5pdHkgY2hlY2tzLCByZXR1cm5zIGl0LlxuR3JhbW1hckRlY2wucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIoXG4gICAgICB0aGlzLm5hbWUsXG4gICAgICB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLFxuICAgICAgdGhpcy5ydWxlcyxcbiAgICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSk7XG5cbiAgLy8gVE9ETzogY2hhbmdlIHRoZSBwZXhwci5wcm90b3R5cGUuYXNzZXJ0Li4uIG1ldGhvZHMgdG8gbWFrZSB0aGVtIGFkZFxuICAvLyBleGNlcHRpb25zIHRvIGFuIGFycmF5IHRoYXQncyBwcm92aWRlZCBhcyBhbiBhcmcuIFRoZW4gd2UnbGwgYmUgYWJsZSB0b1xuICAvLyBzaG93IG1vcmUgdGhhbiBvbmUgZXJyb3Igb2YgdGhlIHNhbWUgdHlwZSBhdCBhIHRpbWUuXG4gIC8vIFRPRE86IGluY2x1ZGUgdGhlIG9mZmVuZGluZyBwZXhwciBpbiB0aGUgZXJyb3JzLCB0aGF0IHdheSB3ZSBjYW4gc2hvd1xuICAvLyB0aGUgcGFydCBvZiB0aGUgc291cmNlIHRoYXQgY2F1c2VkIGl0LlxuICB2YXIgZ3JhbW1hckVycm9ycyA9IFtdO1xuICB2YXIgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSBmYWxzZTtcbiAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuZm9yRWFjaChmdW5jdGlvbihydWxlTmFtZSkge1xuICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlc1tydWxlTmFtZV0uYm9keTtcbiAgICB0cnkge1xuICAgICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgYm9keS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIGlmICghZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMpIHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGNhbiBvbmx5IGJlIGRvbmUgaWYgdGhlIGdyYW1tYXIgaGFzIG5vIGludmFsaWQgYXBwbGljYXRpb25zLlxuICAgIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZXMpLmZvckVhY2goZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlc1tydWxlTmFtZV0uYm9keTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGJvZHkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChncmFtbWFyRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICBlcnJvcnMudGhyb3dFcnJvcnMoZ3JhbW1hckVycm9ycyk7XG4gIH1cbiAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgZ3JhbW1hci5zb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgfVxuXG4gIHJldHVybiBncmFtbWFyO1xufTtcblxuLy8gUnVsZSBkZWNsYXJhdGlvbnNcblxuR3JhbW1hckRlY2wucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpIHtcbiAgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKTtcbiAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVzW25hbWVdKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIHNvdXJjZSk7XG4gIH0gZWxzZSBpZiAodGhpcy5ydWxlc1tuYW1lXSkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLm5hbWUsIHNvdXJjZSk7XG4gIH1cbiAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBzb3VyY2UpO1xuICB9XG4gIHJldHVybiB0aGlzLmluc3RhbGwobmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG59O1xuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjSWdub3JlZCwgc291cmNlKSB7XG4gIHZhciBydWxlSW5mbyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZXNbbmFtZV07XG4gIGlmICghcnVsZUluZm8pIHtcbiAgICB0aHJvdyBlcnJvcnMuY2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZShuYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lLCBzb3VyY2UpO1xuICB9XG4gIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihuYW1lLCBmb3JtYWxzLCBmcmFnbWVudCwgZGVzY0lnbm9yZWQsIHNvdXJjZSkge1xuICB2YXIgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICBpZiAoIXJ1bGVJbmZvKSB7XG4gICAgdGhyb3cgZXJyb3JzLmNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIHNvdXJjZSk7XG4gIH1cbiAgdmFyIGJvZHkgPSBuZXcgcGV4cHJzLkV4dGVuZCh0aGlzLnN1cGVyR3JhbW1hciwgbmFtZSwgZnJhZ21lbnQpO1xuICBib2R5LnNvdXJjZSA9IGZyYWdtZW50LnNvdXJjZTtcbiAgdGhpcy5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlKG5hbWUsIGZvcm1hbHMsIGJvZHksIHNvdXJjZSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hckRlY2w7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIHRoaXMucG9zID0gMDtcbiAgdGhpcy5leGFtaW5lZExlbmd0aCA9IDA7XG59XG5cbklucHV0U3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgYXRFbmQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBhbnMgPSB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICAgIHRoaXMuZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLmV4YW1pbmVkTGVuZ3RoLCB0aGlzLnBvcyArIDEpO1xuICAgIHJldHVybiBhbnM7XG4gIH0sXG5cbiAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGFucyA9IHRoaXMuc291cmNlW3RoaXMucG9zKytdO1xuICAgIHRoaXMuZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLmV4YW1pbmVkTGVuZ3RoLCB0aGlzLnBvcyk7XG4gICAgcmV0dXJuIGFucztcbiAgfSxcblxuICBtYXRjaFN0cmluZzogZnVuY3Rpb24ocywgb3B0SWdub3JlQ2FzZSkge1xuICAgIHZhciBpZHg7XG4gICAgaWYgKG9wdElnbm9yZUNhc2UpIHtcbiAgICAgIC8qXG4gICAgICAgIENhc2UtaW5zZW5zaXRpdmUgY29tcGFyaXNvbiBpcyBhIHRyaWNreSBidXNpbmVzcy4gU29tZSBub3RhYmxlIGdvdGNoYXMgaW5jbHVkZSB0aGVcbiAgICAgICAgXCJUdXJraXNoIElcIiBwcm9ibGVtIChodHRwOi8vd3d3LmkxOG5ndXkuY29tL3VuaWNvZGUvdHVya2lzaC1pMThuLmh0bWwpIGFuZCB0aGUgZmFjdFxuICAgICAgICB0aGF0IHRoZSBHZXJtYW4gRXNzemV0ICjDnykgdHVybnMgaW50byBcIlNTXCIgaW4gdXBwZXIgY2FzZS5cblxuICAgICAgICBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbG9jYWxlLWludmFyaWFudCBjb21wYXJpc29uLCB3aGljaCBtZWFucyBpdCBtYXkgbm90IG9iZXlcbiAgICAgICAgbG9jYWxlLXNwZWNpZmljIGV4cGVjdGF0aW9ucyAoZS5nLiBcImlcIiA9PiBcIsSwXCIpLlxuICAgICAgICovXG4gICAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgYWN0dWFsID0gdGhpcy5uZXh0KCk7XG4gICAgICAgIHZhciBleHBlY3RlZCA9IHNbaWR4XTtcbiAgICAgICAgaWYgKGFjdHVhbCA9PSBudWxsIHx8IGFjdHVhbC50b1VwcGVyQ2FzZSgpICE9PSBleHBlY3RlZC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRGVmYXVsdCBpcyBjYXNlLXNlbnNpdGl2ZSBjb21wYXJpc29uLlxuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICBpZiAodGhpcy5uZXh0KCkgIT09IHNbaWR4XSkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgc291cmNlU2xpY2U6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeCk7XG4gIH0sXG5cbiAgaW50ZXJ2YWw6IGZ1bmN0aW9uKHN0YXJ0SWR4LCBvcHRFbmRJZHgpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlLCBzdGFydElkeCwgb3B0RW5kSWR4ID8gb3B0RW5kSWR4IDogdGhpcy5wb3MpO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFN0cmVhbTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2NvbW1vbicpLmFzc2VydDtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIEludGVydmFsKHNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCkge1xuICB0aGlzLnNvdXJjZVN0cmluZyA9IHNvdXJjZVN0cmluZztcbiAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4O1xuICB0aGlzLmVuZElkeCA9IGVuZElkeDtcbn1cblxuSW50ZXJ2YWwuY292ZXJhZ2UgPSBmdW5jdGlvbigvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gIHZhciBzb3VyY2VTdHJpbmcgPSBhcmd1bWVudHNbMF0uc291cmNlU3RyaW5nO1xuICB2YXIgc3RhcnRJZHggPSBhcmd1bWVudHNbMF0uc3RhcnRJZHg7XG4gIHZhciBlbmRJZHggPSBhcmd1bWVudHNbMF0uZW5kSWR4O1xuICBmb3IgKHZhciBpZHggPSAxOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBpbnRlcnZhbCA9IGFyZ3VtZW50c1tpZHhdO1xuICAgIGlmIChpbnRlcnZhbC5zb3VyY2VTdHJpbmcgIT09IHNvdXJjZVN0cmluZykge1xuICAgICAgdGhyb3cgZXJyb3JzLmludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGFydElkeCA9IE1hdGgubWluKHN0YXJ0SWR4LCBhcmd1bWVudHNbaWR4XS5zdGFydElkeCk7XG4gICAgICBlbmRJZHggPSBNYXRoLm1heChlbmRJZHgsIGFyZ3VtZW50c1tpZHhdLmVuZElkeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgSW50ZXJ2YWwoc291cmNlU3RyaW5nLCBzdGFydElkeCwgZW5kSWR4KTtcbn07XG5cbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgY292ZXJhZ2VXaXRoOiBmdW5jdGlvbigvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gICAgdmFyIGludGVydmFscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgaW50ZXJ2YWxzLnB1c2godGhpcyk7XG4gICAgcmV0dXJuIEludGVydmFsLmNvdmVyYWdlLmFwcGx5KHVuZGVmaW5lZCwgaW50ZXJ2YWxzKTtcbiAgfSxcblxuICBjb2xsYXBzZWRMZWZ0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLnN0YXJ0SWR4KTtcbiAgfSxcblxuICBjb2xsYXBzZWRSaWdodDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5lbmRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgfSxcblxuICBnZXRMaW5lQW5kQ29sdW1uTWVzc2FnZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJhbmdlID0gW3RoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4XTtcbiAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCwgcmFuZ2UpO1xuICB9LFxuXG4gIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgMCwgMSwgb3IgMiBpbnRlcnZhbHMgdGhhdCByZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgdGhlXG4gIC8vIGludGVydmFsIGRpZmZlcmVuY2Ugb3BlcmF0aW9uLlxuICBtaW51czogZnVuY3Rpb24odGhhdCkge1xuICAgIGlmICh0aGlzLnNvdXJjZVN0cmluZyAhPT0gdGhhdC5zb3VyY2VTdHJpbmcpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPT09IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPT09IHRoYXQuZW5kSWR4KSB7XG4gICAgICAvLyBgdGhpc2AgYW5kIGB0aGF0YCBhcmUgdGhlIHNhbWUgaW50ZXJ2YWwhXG4gICAgICByZXR1cm4gW1xuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgIC8vIGB0aGF0YCBzcGxpdHMgYHRoaXNgIGludG8gdHdvIGludGVydmFsc1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGF0LnN0YXJ0SWR4KSxcbiAgICAgICAgbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGF0LmVuZElkeCwgdGhpcy5lbmRJZHgpXG4gICAgICBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGFydElkeCA8IHRoYXQuZW5kSWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgIC8vIGB0aGF0YCBjb250YWlucyBhIHByZWZpeCBvZiBgdGhpc2BcbiAgICAgIHJldHVybiBbXG4gICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhhdC5lbmRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuc3RhcnRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgc3VmZml4IG9mIGB0aGlzYFxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGF0LnN0YXJ0SWR4KVxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gYHRoYXRgIGFuZCBgdGhpc2AgZG8gbm90IG92ZXJsYXBcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHRoaXNcbiAgICAgIF07XG4gICAgfVxuICB9LFxuXG4gIC8vIFJldHVybnMgYSBuZXcgSW50ZXJ2YWwgdGhhdCBoYXMgdGhlIHNhbWUgZXh0ZW50IGFzIHRoaXMgb25lLCBidXQgd2hpY2ggaXMgcmVsYXRpdmVcbiAgLy8gdG8gYHRoYXRgLCBhbiBJbnRlcnZhbCB0aGF0IGZ1bGx5IGNvdmVycyB0aGlzIG9uZS5cbiAgcmVsYXRpdmVUbzogZnVuY3Rpb24odGhhdCkge1xuICAgIGlmICh0aGlzLnNvdXJjZVN0cmluZyAhPT0gdGhhdC5zb3VyY2VTdHJpbmcpIHtcbiAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICB9XG4gICAgYXNzZXJ0KHRoaXMuc3RhcnRJZHggPj0gdGhhdC5zdGFydElkeCAmJiB0aGlzLmVuZElkeCA8PSB0aGF0LmVuZElkeCxcbiAgICAgICAgICAgJ290aGVyIGludGVydmFsIGRvZXMgbm90IGNvdmVyIHRoaXMgb25lJyk7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRJZHggLSB0aGF0LnN0YXJ0SWR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmRJZHggLSB0aGF0LnN0YXJ0SWR4KTtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IEludGVydmFsIHdoaWNoIGNvbnRhaW5zIHRoZSBzYW1lIGNvbnRlbnRzIGFzIHRoaXMgb25lLFxuICAvLyBidXQgd2l0aCB3aGl0ZXNwYWNlIHRyaW1tZWQgZnJvbSBib3RoIGVuZHMuIChUaGlzIG9ubHkgbWFrZXMgc2Vuc2Ugd2hlblxuICAvLyB0aGUgaW5wdXQgc3RyZWFtIGlzIGEgc3RyaW5nLilcbiAgdHJpbW1lZDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbnRlbnRzID0gdGhpcy5jb250ZW50cztcbiAgICB2YXIgc3RhcnRJZHggPSB0aGlzLnN0YXJ0SWR4ICsgY29udGVudHMubWF0Y2goL15cXHMqLylbMF0ubGVuZ3RoO1xuICAgIHZhciBlbmRJZHggPSB0aGlzLmVuZElkeCAtIGNvbnRlbnRzLm1hdGNoKC9cXHMqJC8pWzBdLmxlbmd0aDtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCBzdGFydElkeCwgZW5kSWR4KTtcbiAgfSxcblxuICBzdWJJbnRlcnZhbDogZnVuY3Rpb24ob2Zmc2V0LCBsZW4pIHtcbiAgICB2YXIgbmV3U3RhcnRJZHggPSB0aGlzLnN0YXJ0SWR4ICsgb2Zmc2V0O1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIG5ld1N0YXJ0SWR4LCBuZXdTdGFydElkeCArIGxlbik7XG4gIH1cbn07XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEludGVydmFsLnByb3RvdHlwZSwge1xuICBjb250ZW50czoge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICBpZiAodGhpcy5fY29udGVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9jb250ZW50cyA9IHRoaXMuc291cmNlU3RyaW5nLnNsaWNlKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9jb250ZW50cztcbiAgICB9LFxuICAgIGVudW1lcmFibGU6IHRydWVcbiAgfSxcbiAgbGVuZ3RoOiB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuZW5kSWR4IC0gdGhpcy5zdGFydElkeDsgfSxcbiAgICBlbnVtZXJhYmxlOiB0cnVlXG4gIH1cbn0pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbDtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbCcpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTWF0Y2hSZXN1bHQoXG4gICAgbWF0Y2hlcixcbiAgICBpbnB1dCxcbiAgICBzdGFydEV4cHIsXG4gICAgY3N0LFxuICAgIGNzdE9mZnNldCxcbiAgICByaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sXG4gICAgb3B0UmVjb3JkZWRGYWlsdXJlcykge1xuXG4gIHRoaXMubWF0Y2hlciA9IG1hdGNoZXI7XG4gIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgdGhpcy5zdGFydEV4cHIgPSBzdGFydEV4cHI7XG4gIHRoaXMuX2NzdCA9IGNzdDtcbiAgdGhpcy5fY3N0T2Zmc2V0ID0gY3N0T2Zmc2V0O1xuICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSByaWdodG1vc3RGYWlsdXJlUG9zaXRpb247XG4gIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzID0gb3B0UmVjb3JkZWRGYWlsdXJlcztcblxuICBpZiAodGhpcy5mYWlsZWQoKSkge1xuICAgIGNvbW1vbi5kZWZpbmVMYXp5UHJvcGVydHkodGhpcywgJ21lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZXRhaWwgPSAnRXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLmlucHV0LCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKSArIGRldGFpbDtcbiAgICB9KTtcbiAgICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdzaG9ydE1lc3NhZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBkZXRhaWwgPSAnZXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgICB2YXIgZXJyb3JJbmZvID0gdXRpbC5nZXRMaW5lQW5kQ29sdW1uKHRoaXMuaW5wdXQsIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkpO1xuICAgICAgcmV0dXJuICdMaW5lICcgKyBlcnJvckluZm8ubGluZU51bSArICcsIGNvbCAnICsgZXJyb3JJbmZvLmNvbE51bSArICc6ICcgKyBkZXRhaWw7XG4gICAgfSk7XG4gIH1cbn1cblxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnN1Y2NlZWRlZCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gISF0aGlzLl9jc3Q7XG59O1xuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZmFpbGVkID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhdGhpcy5zdWNjZWVkZWQoKTtcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbn07XG5cbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5nZXRSaWdodG1vc3RGYWlsdXJlcyA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzKSB7XG4gICAgdGhpcy5tYXRjaGVyLnNldElucHV0KHRoaXMuaW5wdXQpO1xuICAgIHZhciBtYXRjaFJlc3VsdFdpdGhGYWlsdXJlcyA9XG4gICAgICAgIHRoaXMubWF0Y2hlci5fbWF0Y2godGhpcy5zdGFydEV4cHIsIGZhbHNlLCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKTtcbiAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcyA9IG1hdGNoUmVzdWx0V2l0aEZhaWx1cmVzLmdldFJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzO1xufTtcblxuLy8gUmV0dXJucyBhIGBNYXRjaFJlc3VsdGAgdGhhdCBjYW4gYmUgZmVkIGludG8gb3BlcmF0aW9ucyBvciBhdHRyaWJ1dGVzIHRoYXQgY2FyZVxuLy8gYWJvdXQgdGhlIHdoaXRlc3BhY2UgdGhhdCB3YXMgaW1wbGljaXRseSBza2lwcGVkIG92ZXIgYnkgc3ludGFjdGljIHJ1bGVzLiBUaGlzXG4vLyBpcyB1c2VmdWwgZm9yIGRvaW5nIHRoaW5ncyB3aXRoIGNvbW1lbnRzLCBlLmcuLCBzeW50YXggaGlnaGxpZ2h0aW5nLlxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldERpc2NhcmRlZFNwYWNlcyA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5mYWlsZWQoKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGdldCBkaXNjYXJkZWQgc3BhY2VzIG9mIGZhaWxlZCBtYXRjaCByZXN1bHQnKTtcbiAgfVxuXG4gIC8vIFBvcHVsYXRlIHRoZSBtZW1vIHRhYmxlIHdpdGggdGhlIGluZm8gZm9yIHRoaXMgbWF0Y2ggcmVzdWx0LCBpbiBjYXNlXG4gIC8vIGl0J3MgYmVlbiBpbnZhbGlkYXRlZCBieSBzdWJzZXF1ZW50IG1hdGNoZXMuXG4gIHRoaXMubWF0Y2hlci5zZXRJbnB1dCh0aGlzLmlucHV0KTtcbiAgdGhpcy5tYXRjaGVyLl9tYXRjaCh0aGlzLnN0YXJ0RXhwciwgZmFsc2UpO1xuXG4gIHZhciBncmFtbWFyID0gdGhpcy5tYXRjaGVyLmdyYW1tYXI7XG4gIHZhciBtZW1vVGFibGUgPSB0aGlzLm1hdGNoZXIubWVtb1RhYmxlO1xuXG4gIHZhciBpbnRlcnZhbHMgPSBbbmV3IEludGVydmFsKHRoaXMuaW5wdXQsIDAsIHRoaXMuaW5wdXQubGVuZ3RoKV07XG5cbiAgLy8gU3VidHJhY3QgdGhlIGludGVydmFsIG9mIGVhY2ggdGVybWluYWwgZnJvbSB0aGUgc2V0IG9mIGludGVydmFscyBhYm92ZS5cbiAgdmFyIHMgPSBncmFtbWFyLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbignc3VidHJhY3RUZXJtaW5hbHMnLCB7XG4gICAgX25vbnRlcm1pbmFsOiBmdW5jdGlvbihjaGlsZHJlbikge1xuICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBjaGlsZC5zdWJ0cmFjdFRlcm1pbmFscygpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHQgPSB0aGlzO1xuICAgICAgaW50ZXJ2YWxzID0gaW50ZXJ2YWxzXG4gICAgICAgICAgLm1hcChmdW5jdGlvbihpbnRlcnZhbCkgeyByZXR1cm4gaW50ZXJ2YWwubWludXModC5zb3VyY2UpOyB9KVxuICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24oeHMsIHlzKSB7IHJldHVybiB4cy5jb25jYXQoeXMpOyB9LCBbXSk7XG4gICAgfVxuICB9KTtcbiAgcyh0aGlzKS5zdWJ0cmFjdFRlcm1pbmFscygpO1xuXG4gIC8vIE5vdywgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoIGludGVydmFsLCB0aGVyZSBzaG91bGQgYmUgYSBtZW1vIHRhYmxlIGVudHJ5IGZvciB0aGUgJ3NwYWNlcydcbiAgLy8gcnVsZSwgcmVwcmVzZW50aW5nIHRoZSBub2RlIHRoYXQgd2FzIGRpc2NhcmRlZC4gQ29sbGVjdCB0aG9zZSBhbG9uZyB3aXRoIHRoZWlyIG9mZnNldHMuXG4gIHZhciBvZmZzZXRzID0gaW50ZXJ2YWxzLm1hcChmdW5jdGlvbihpbnRlcnZhbCkge1xuICAgIHJldHVybiBpbnRlcnZhbC5zdGFydElkeDtcbiAgfSk7XG4gIHZhciBkaXNjYXJkZWROb2RlcyA9IG9mZnNldHMubWFwKGZ1bmN0aW9uKHBvcykge1xuICAgIHZhciBwb3NJbmZvID0gbWVtb1RhYmxlW3Bvc107XG4gICAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW8uc3BhY2VzO1xuICAgIHJldHVybiBtZW1vUmVjLnZhbHVlO1xuICB9KTtcblxuICAvLyBSYXRoZXIgdGhhbiByZXR1cm4gYSBidW5jaCBvZiBDU1Qgbm9kZXMgYW5kIG1ha2UgdGhlIGNhbGxlciBvZiB0aGlzIG1ldGhvZCBsb29wIG92ZXIgdGhlbSxcbiAgLy8gd2UgY2FuIGNvbnN0cnVjdCBhIHNpbmdsZSBDU1Qgbm9kZSB0aGF0IGlzIHRoZSBwYXJlbnQgb2YgYWxsIG9mIHRoZSBkaXNjYXJkZWQgbm9kZXMuIEFuXG4gIC8vIGBJdGVyYXRpb25Ob2RlYCBpcyB0aGUgb2J2aW91cyBjaG9pY2UgZm9yIHRoaXMuXG4gIHZhciBpdGVyID0gbmV3IG5vZGVzLkl0ZXJhdGlvbk5vZGUoZ3JhbW1hciwgZGlzY2FyZGVkTm9kZXMsIG9mZnNldHMsIC0xLCBmYWxzZSk7XG5cbiAgLy8gQnV0IHJlbWVtYmVyIHRoYXQgYSBDU1Qgbm9kZSBjYW4ndCBiZSB1c2VkIGRpcmVjdGx5IGJ5IGNsaWVudHMuIFdoYXQgd2UgcmVhbGx5IG5lZWQgdG8gcmV0dXJuXG4gIC8vIGZyb20gdGhpcyBtZXRob2QgaXMgYSBzdWNjZXNzZnVsIGBNYXRjaFJlc3VsdGAgdGhhdCBjYW4gYmUgdXNlZCB3aXRoIHRoZSBjbGllbnRzJyBzZW1hbnRpY3MuXG4gIC8vIFdlIGFscmVhZHkgaGF2ZSBvbmUgLS0gYHRoaXNgIC0tIGJ1dCBpdCdzIGdvdCBhIGRpZmZlcmVudCBDU1Qgbm9kZSBpbnNpZGUuIFNvIHdlIGNyZWF0ZSBhIG5ld1xuICAvLyBvYmplY3QgdGhhdCBkZWxlZ2F0ZXMgdG8gYHRoaXNgLCBhbmQgb3ZlcnJpZGUgaXRzIGBfY3N0YCBhbmQgYF9jc3RPZmZzZXRgIHByb3BlcnRpZXMuXG4gIHZhciByID0gT2JqZWN0LmNyZWF0ZSh0aGlzKTtcbiAgci5fY3N0ID0gaXRlcjtcbiAgci5fY3N0T2Zmc2V0ID0gMDtcblxuICAvLyBXZSBhbHNvIG92ZXJyaWRlIGl0cyBgZ2V0RGlzY2FyZGVkU3BhY2VzYCBtZXRob2QsIGluIGNhc2Ugc29tZW9uZSBkZWNpZGVzIHRvIGNhbGwgaXQuXG4gIHIuZ2V0RGlzY2FyZGVkU3BhY2VzID0gZnVuY3Rpb24oKSB7IHJldHVybiByOyB9O1xuXG4gIHJldHVybiByO1xufTtcblxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnN1Y2NlZWRlZCgpID9cbiAgICAgICdbbWF0Y2ggc3VjY2VlZGVkXScgOlxuICAgICAgJ1ttYXRjaCBmYWlsZWQgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkgKyAnXSc7XG59O1xuXG4vLyBSZXR1cm4gYSBzdHJpbmcgc3VtbWFyaXppbmcgdGhlIGV4cGVjdGVkIGNvbnRlbnRzIG9mIHRoZSBpbnB1dCBzdHJlYW0gd2hlblxuLy8gdGhlIG1hdGNoIGZhaWx1cmUgb2NjdXJyZWQuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0RXhwZWN0ZWRUZXh0ID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLnN1Y2NlZWRlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGV4cGVjdGVkIHRleHQgb2YgYSBzdWNjZXNzZnVsIE1hdGNoUmVzdWx0Jyk7XG4gIH1cblxuICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICB2YXIgZmFpbHVyZXMgPSB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVzKCk7XG5cbiAgLy8gRmlsdGVyIG91dCB0aGUgZmx1ZmZ5IGZhaWx1cmVzIHRvIG1ha2UgdGhlIGRlZmF1bHQgZXJyb3IgbWVzc2FnZXMgbW9yZSB1c2VmdWxcbiAgZmFpbHVyZXMgPSBmYWlsdXJlcy5maWx0ZXIoZnVuY3Rpb24oZmFpbHVyZSkge1xuICAgIHJldHVybiAhZmFpbHVyZS5pc0ZsdWZmeSgpO1xuICB9KTtcblxuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBmYWlsdXJlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKGlkeCA+IDApIHtcbiAgICAgIGlmIChpZHggPT09IGZhaWx1cmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgc2IuYXBwZW5kKGZhaWx1cmVzLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc2IuYXBwZW5kKGZhaWx1cmVzW2lkeF0udG9TdHJpbmcoKSk7XG4gIH1cbiAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBvcyA9IHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCk7XG4gIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dCwgcG9zLCBwb3MpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hSZXN1bHQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgTWF0Y2hSZXN1bHQgPSByZXF1aXJlKCcuL01hdGNoUmVzdWx0Jyk7XG52YXIgUG9zSW5mbyA9IHJlcXVpcmUoJy4vUG9zSW5mbycpO1xudmFyIFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgYXBwbHlTcGFjZXMgPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXMnKTtcblxuZnVuY3Rpb24gTWF0Y2hTdGF0ZShtYXRjaGVyLCBzdGFydEV4cHIsIG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuICB0aGlzLnN0YXJ0RXhwciA9IHN0YXJ0RXhwcjtcblxuICB0aGlzLmdyYW1tYXIgPSBtYXRjaGVyLmdyYW1tYXI7XG4gIHRoaXMuaW5wdXQgPSBtYXRjaGVyLmlucHV0O1xuICB0aGlzLmlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoZXIuaW5wdXQpO1xuICB0aGlzLm1lbW9UYWJsZSA9IG1hdGNoZXIubWVtb1RhYmxlO1xuXG4gIHRoaXMuX2JpbmRpbmdzID0gW107XG4gIHRoaXMuX2JpbmRpbmdPZmZzZXRzID0gW107XG4gIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sgPSBbXTtcbiAgdGhpcy5fcG9zU3RhY2sgPSBbMF07XG4gIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjayA9IFtmYWxzZV07XG5cbiAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSAtMTtcbiAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sgPSBbXTtcbiAgdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrID0gW107XG5cbiAgaWYgKG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgPSBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXM7XG4gICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgfVxufVxuXG5NYXRjaFN0YXRlLnByb3RvdHlwZSA9IHtcbiAgcG9zVG9PZmZzZXQ6IGZ1bmN0aW9uKHBvcykge1xuICAgIHJldHVybiBwb3MgLSB0aGlzLl9wb3NTdGFja1t0aGlzLl9wb3NTdGFjay5sZW5ndGggLSAxXTtcbiAgfSxcblxuICBlbnRlckFwcGxpY2F0aW9uOiBmdW5jdGlvbihwb3NJbmZvLCBhcHApIHtcbiAgICB0aGlzLl9wb3NTdGFjay5wdXNoKHRoaXMuaW5wdXRTdHJlYW0ucG9zKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblN0YWNrLnB1c2goYXBwKTtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaChmYWxzZSk7XG4gICAgcG9zSW5mby5lbnRlcihhcHApO1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnB1c2godGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pO1xuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gIH0sXG5cbiAgZXhpdEFwcGxpY2F0aW9uOiBmdW5jdGlvbihwb3NJbmZvLCBvcHROb2RlKSB7XG4gICAgdmFyIG9yaWdQb3MgPSB0aGlzLl9wb3NTdGFjay5wb3AoKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblN0YWNrLnBvcCgpO1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgICBwb3NJbmZvLmV4aXQoKTtcblxuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgoXG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLFxuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wb3AoKSk7XG5cbiAgICBpZiAob3B0Tm9kZSkge1xuICAgICAgdGhpcy5wdXNoQmluZGluZyhvcHROb2RlLCBvcmlnUG9zKTtcbiAgICB9XG4gIH0sXG5cbiAgZW50ZXJMZXhpZmllZENvbnRleHQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wdXNoKHRydWUpO1xuICB9LFxuXG4gIGV4aXRMZXhpZmllZENvbnRleHQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgfSxcblxuICBjdXJyZW50QXBwbGljYXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9hcHBsaWNhdGlvblN0YWNrW3RoaXMuX2FwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgaW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgY3VycmVudEFwcGxpY2F0aW9uID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICBpZiAoY3VycmVudEFwcGxpY2F0aW9uKSB7XG4gICAgICByZXR1cm4gY3VycmVudEFwcGxpY2F0aW9uLmlzU3ludGFjdGljKCkgJiYgIXRoaXMuaW5MZXhpZmllZENvbnRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHRvcC1sZXZlbCBjb250ZXh0IGlzIHN5bnRhY3RpYyBpZiB0aGUgc3RhcnQgYXBwbGljYXRpb24gaXMuXG4gICAgICByZXR1cm4gdGhpcy5zdGFydEV4cHIuZmFjdG9yc1swXS5pc1N5bnRhY3RpYygpO1xuICAgIH1cbiAgfSxcblxuICBpbkxleGlmaWVkQ29udGV4dDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFja1t0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2subGVuZ3RoIC0gMV07XG4gIH0sXG5cbiAgc2tpcFNwYWNlczogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgdGhpcy5ldmFsKGFwcGx5U3BhY2VzKTtcbiAgICB0aGlzLnBvcEJpbmRpbmcoKTtcbiAgICB0aGlzLnBvcEZhaWx1cmVzSW5mbygpO1xuICAgIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgfSxcblxuICBza2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmluU3ludGFjdGljQ29udGV4dCgpID9cbiAgICAgICAgdGhpcy5za2lwU3BhY2VzKCkgOlxuICAgICAgICB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgfSxcblxuICBtYXliZVNraXBTcGFjZXNCZWZvcmU6IGZ1bmN0aW9uKGV4cHIpIHtcbiAgICBpZiAoZXhwciBpbnN0YW5jZW9mIHBleHBycy5BcHBseSAmJiBleHByLmlzU3ludGFjdGljKCkpIHtcbiAgICAgIHJldHVybiB0aGlzLnNraXBTcGFjZXMoKTtcbiAgICB9IGVsc2UgaWYgKGV4cHIuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSgpICYmIGV4cHIgIT09IGFwcGx5U3BhY2VzKSB7XG4gICAgICByZXR1cm4gdGhpcy5za2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuaW5wdXRTdHJlYW0ucG9zO1xuICAgIH1cbiAgfSxcblxuICBwdXNoQmluZGluZzogZnVuY3Rpb24obm9kZSwgb3JpZ1Bvcykge1xuICAgIHRoaXMuX2JpbmRpbmdzLnB1c2gobm9kZSk7XG4gICAgdGhpcy5fYmluZGluZ09mZnNldHMucHVzaCh0aGlzLnBvc1RvT2Zmc2V0KG9yaWdQb3MpKTtcbiAgfSxcblxuICBwb3BCaW5kaW5nOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9iaW5kaW5ncy5wb3AoKTtcbiAgICB0aGlzLl9iaW5kaW5nT2Zmc2V0cy5wb3AoKTtcbiAgfSxcblxuICBudW1CaW5kaW5nczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcbiAgfSxcblxuICB0cnVuY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbihuZXdMZW5ndGgpIHtcbiAgICAvLyBZZXMsIHRoaXMgaXMgdGhpcyByZWFsbHkgZmFzdGVyIHRoYW4gc2V0dGluZyB0aGUgYGxlbmd0aGAgcHJvcGVydHkgKHRlc3RlZCB3aXRoXG4gICAgLy8gYmluL2VzNWJlbmNoIG9uIE5vZGUgdjYuMS4wKS5cbiAgICB3aGlsZSAodGhpcy5fYmluZGluZ3MubGVuZ3RoID4gbmV3TGVuZ3RoKSB7XG4gICAgICB0aGlzLnBvcEJpbmRpbmcoKTtcbiAgICB9XG4gIH0sXG5cbiAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBvc0luZm8odGhpcy5pbnB1dFN0cmVhbS5wb3MpO1xuICB9LFxuXG4gIGdldFBvc0luZm86IGZ1bmN0aW9uKHBvcykge1xuICAgIHZhciBwb3NJbmZvID0gdGhpcy5tZW1vVGFibGVbcG9zXTtcbiAgICBpZiAoIXBvc0luZm8pIHtcbiAgICAgIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdID0gbmV3IFBvc0luZm8oKTtcbiAgICB9XG4gICAgcmV0dXJuIHBvc0luZm87XG4gIH0sXG5cbiAgcHJvY2Vzc0ZhaWx1cmU6IGZ1bmN0aW9uKHBvcywgZXhwcikge1xuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIHBvcyk7XG5cbiAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmIHBvcyA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgIHZhciBhcHAgPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgaWYgKGFwcCkge1xuICAgICAgICAvLyBTdWJzdGl0dXRlIHBhcmFtZXRlcnMgd2l0aCB0aGUgYWN0dWFsIHBleHBycyB0aGF0IHdlcmUgcGFzc2VkIHRvXG4gICAgICAgIC8vIHRoZSBjdXJyZW50IHJ1bGUuXG4gICAgICAgIGV4cHIgPSBleHByLnN1YnN0aXR1dGVQYXJhbXMoYXBwLmFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGhpcyBicmFuY2ggaXMgb25seSByZWFjaGVkIGZvciB0aGUgXCJlbmQtY2hlY2tcIiB0aGF0IGlzXG4gICAgICAgIC8vIHBlcmZvcm1lZCBhZnRlciB0aGUgdG9wLWxldmVsIGFwcGxpY2F0aW9uLiBJbiB0aGF0IGNhc2UsXG4gICAgICAgIC8vIGV4cHIgPT09IHBleHBycy5lbmQgc28gdGhlcmUgaXMgbm8gbmVlZCB0byBzdWJzdGl0dXRlXG4gICAgICAgIC8vIHBhcmFtZXRlcnMuXG4gICAgICB9XG5cbiAgICAgIHRoaXMucmVjb3JkRmFpbHVyZShleHByLnRvRmFpbHVyZSh0aGlzLmdyYW1tYXIpLCBmYWxzZSk7XG4gICAgfVxuICB9LFxuXG4gIHJlY29yZEZhaWx1cmU6IGZ1bmN0aW9uKGZhaWx1cmUsIHNob3VsZENsb25lSWZOZXcpIHtcbiAgICB2YXIga2V5ID0gZmFpbHVyZS50b0tleSgpO1xuICAgIGlmICghdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0pIHtcbiAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldID0gc2hvdWxkQ2xvbmVJZk5ldyA/IGZhaWx1cmUuY2xvbmUoKSA6IGZhaWx1cmU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XS5pc0ZsdWZmeSgpICYmICFmYWlsdXJlLmlzRmx1ZmZ5KCkpIHtcbiAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldLmNsZWFyRmx1ZmZ5KCk7XG4gICAgfVxuICB9LFxuXG4gIHJlY29yZEZhaWx1cmVzOiBmdW5jdGlvbihmYWlsdXJlcywgc2hvdWxkQ2xvbmVJZk5ldykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyhmYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHNlbGYucmVjb3JkRmFpbHVyZShmYWlsdXJlc1trZXldLCBzaG91bGRDbG9uZUlmTmV3KTtcbiAgICB9KTtcbiAgfSxcblxuICBjbG9uZVJlY29yZGVkRmFpbHVyZXM6IGZ1bmN0aW9uKCkge1xuICAgIGlmICghdGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHZhciBhbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBhbnNba2V5XSA9IHNlbGYucmVjb3JkZWRGYWlsdXJlc1trZXldLmNsb25lKCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGFucztcbiAgfSxcblxuICBnZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgfSxcblxuICBfZ2V0UmlnaHRtb3N0RmFpbHVyZU9mZnNldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID49IDAgP1xuICAgICAgICB0aGlzLnBvc1RvT2Zmc2V0KHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKSA6XG4gICAgICAgIC0xO1xuICB9LFxuXG4gIC8vIFJldHVybnMgdGhlIG1lbW9pemVkIHRyYWNlIGVudHJ5IGZvciBgZXhwcmAgYXQgYHBvc2AsIGlmIG9uZSBleGlzdHMsIGBudWxsYCBvdGhlcndpc2UuXG4gIGdldE1lbW9pemVkVHJhY2VFbnRyeTogZnVuY3Rpb24ocG9zLCBleHByKSB7XG4gICAgdmFyIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgIGlmIChwb3NJbmZvICYmIGV4cHIucnVsZU5hbWUpIHtcbiAgICAgIHZhciBtZW1vUmVjID0gcG9zSW5mby5tZW1vW2V4cHIudG9NZW1vS2V5KCldO1xuICAgICAgaWYgKG1lbW9SZWMgJiYgbWVtb1JlYy50cmFjZUVudHJ5KSB7XG4gICAgICAgIHZhciBlbnRyeSA9IG1lbW9SZWMudHJhY2VFbnRyeS5jbG9uZVdpdGhFeHByKGV4cHIpO1xuICAgICAgICBlbnRyeS5pc01lbW9pemVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIGVudHJ5O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICAvLyBSZXR1cm5zIGEgbmV3IHRyYWNlIGVudHJ5LCB3aXRoIHRoZSBjdXJyZW50bHkgYWN0aXZlIHRyYWNlIGFycmF5IGFzIGl0cyBjaGlsZHJlbi5cbiAgZ2V0VHJhY2VFbnRyeTogZnVuY3Rpb24ocG9zLCBleHByLCBzdWNjZWVkZWQsIGJpbmRpbmdzKSB7XG4gICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkpIHtcbiAgICAgIHZhciBhcHAgPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgdmFyIGFjdHVhbHMgPSBhcHAgPyBhcHAuYXJncyA6IFtdO1xuICAgICAgZXhwciA9IGV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2V0TWVtb2l6ZWRUcmFjZUVudHJ5KHBvcywgZXhwcikgfHxcbiAgICAgICAgICAgbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHBvcywgdGhpcy5pbnB1dFN0cmVhbS5wb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MsIHRoaXMudHJhY2UpO1xuICB9LFxuXG4gIGlzVHJhY2luZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICEhdGhpcy50cmFjZTtcbiAgfSxcblxuICBoYXNOZWNlc3NhcnlJbmZvOiBmdW5jdGlvbihtZW1vUmVjKSB7XG4gICAgaWYgKHRoaXMudHJhY2UgJiYgIW1lbW9SZWMudHJhY2VFbnRyeSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMgJiZcbiAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgKyBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPT09IHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gICAgICByZXR1cm4gISFtZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuXG4gIHVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbihvcmlnUG9zLCBtZW1vUmVjKSB7XG4gICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgIHRoaXMudHJhY2UucHVzaChtZW1vUmVjLnRyYWNlRW50cnkpO1xuICAgIH1cblxuICAgIHZhciBtZW1vUmVjUmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gdGhpcy5pbnB1dFN0cmVhbS5wb3MgKyBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ7XG4gICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPVxuICAgICAgICBNYXRoLm1heCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbik7XG4gICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJlxuICAgICAgICB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyA9PT0gbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiAmJlxuICAgICAgICBtZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbikge1xuICAgICAgdGhpcy5yZWNvcmRGYWlsdXJlcyhtZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgdGhpcy5pbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9XG4gICAgICAgIE1hdGgubWF4KHRoaXMuaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGgsIG1lbW9SZWMuZXhhbWluZWRMZW5ndGggKyBvcmlnUG9zKTtcblxuICAgIGlmIChtZW1vUmVjLnZhbHVlKSB7XG4gICAgICB0aGlzLmlucHV0U3RyZWFtLnBvcyArPSBtZW1vUmVjLm1hdGNoTGVuZ3RoO1xuICAgICAgdGhpcy5wdXNoQmluZGluZyhtZW1vUmVjLnZhbHVlLCBvcmlnUG9zKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLy8gRXZhbHVhdGUgYGV4cHJgIGFuZCByZXR1cm4gYHRydWVgIGlmIGl0IHN1Y2NlZWRlZCwgYGZhbHNlYCBvdGhlcndpc2UuIE9uIHN1Y2Nlc3MsIGBiaW5kaW5nc2BcbiAgLy8gd2lsbCBoYXZlIGBleHByLmdldEFyaXR5KClgIG1vcmUgZWxlbWVudHMgdGhhbiBiZWZvcmUsIGFuZCB0aGUgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gbWF5XG4gIC8vIGhhdmUgaW5jcmVhc2VkLiBPbiBmYWlsdXJlLCBgYmluZGluZ3NgIGFuZCBwb3NpdGlvbiB3aWxsIGJlIHVuY2hhbmdlZC5cbiAgZXZhbDogZnVuY3Rpb24oZXhwcikge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHRoaXMuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdOdW1CaW5kaW5ncyA9IHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcblxuICAgIHZhciBvcmlnUmVjb3JkZWRGYWlsdXJlcztcbiAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICBvcmlnUmVjb3JkZWRGYWlsdXJlcyA9IHRoaXMucmVjb3JkZWRGYWlsdXJlcztcbiAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxuXG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIG1lbW9Qb3MgPSB0aGlzLm1heWJlU2tpcFNwYWNlc0JlZm9yZShleHByKTtcblxuICAgIHZhciBvcmlnVHJhY2U7XG4gICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgIG9yaWdUcmFjZSA9IHRoaXMudHJhY2U7XG4gICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgfVxuXG4gICAgLy8gRG8gdGhlIGFjdHVhbCBldmFsdWF0aW9uLlxuICAgIHZhciBhbnMgPSBleHByLmV2YWwodGhpcyk7XG5cbiAgICBpZiAodGhpcy50cmFjZSkge1xuICAgICAgdmFyIGJpbmRpbmdzID0gdGhpcy5fYmluZGluZ3Muc2xpY2Uob3JpZ051bUJpbmRpbmdzKTtcbiAgICAgIHZhciB0cmFjZUVudHJ5ID0gdGhpcy5nZXRUcmFjZUVudHJ5KG1lbW9Qb3MsIGV4cHIsIGFucywgYmluZGluZ3MpO1xuICAgICAgdHJhY2VFbnRyeS5pc0ltcGxpY2l0U3BhY2VzID0gZXhwciA9PT0gYXBwbHlTcGFjZXM7XG4gICAgICB0cmFjZUVudHJ5LmlzUm9vdE5vZGUgPSBleHByID09PSB0aGlzLnN0YXJ0RXhwcjtcbiAgICAgIG9yaWdUcmFjZS5wdXNoKHRyYWNlRW50cnkpO1xuICAgICAgdGhpcy50cmFjZSA9IG9yaWdUcmFjZTtcbiAgICB9XG5cbiAgICBpZiAoYW5zKSB7XG4gICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmIGlucHV0U3RyZWFtLnBvcyA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgICAgc2VsZi5yZWNvcmRlZEZhaWx1cmVzW2tleV0ubWFrZUZsdWZmeSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVzZXQgdGhlIHBvc2l0aW9uIGFuZCB0aGUgYmluZGluZ3MuXG4gICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgdGhpcy50cnVuY2F0ZUJpbmRpbmdzKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgdGhpcy5yZWNvcmRGYWlsdXJlcyhvcmlnUmVjb3JkZWRGYWlsdXJlcywgZmFsc2UpO1xuICAgIH1cblxuICAgIHJldHVybiBhbnM7XG4gIH0sXG5cbiAgZ2V0TWF0Y2hSZXN1bHQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZXZhbCh0aGlzLnN0YXJ0RXhwcik7XG4gICAgdmFyIHJpZ2h0bW9zdEZhaWx1cmVzO1xuICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHJpZ2h0bW9zdEZhaWx1cmVzID0gT2JqZWN0LmtleXModGhpcy5yZWNvcmRlZEZhaWx1cmVzKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiBzZWxmLnJlY29yZGVkRmFpbHVyZXNba2V5XTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE1hdGNoUmVzdWx0KFxuICAgICAgICB0aGlzLm1hdGNoZXIsXG4gICAgICAgIHRoaXMuaW5wdXQsXG4gICAgICAgIHRoaXMuc3RhcnRFeHByLFxuICAgICAgICB0aGlzLl9iaW5kaW5nc1swXSxcbiAgICAgICAgdGhpcy5fYmluZGluZ09mZnNldHNbMF0sXG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLFxuICAgICAgICByaWdodG1vc3RGYWlsdXJlcyk7XG4gIH0sXG5cbiAgZ2V0VHJhY2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICB2YXIgbWF0Y2hSZXN1bHQgPSB0aGlzLmdldE1hdGNoUmVzdWx0KCk7XG5cbiAgICAvLyBUaGUgdHJhY2Ugbm9kZSBmb3IgdGhlIHN0YXJ0IHJ1bGUgaXMgYWx3YXlzIHRoZSBsYXN0IGVudHJ5LiBJZiBpdCBpcyBhIHN5bnRhY3RpYyBydWxlLFxuICAgIC8vIHRoZSBmaXJzdCBlbnRyeSBpcyBmb3IgYW4gYXBwbGljYXRpb24gb2YgJ3NwYWNlcycuXG4gICAgLy8gVE9ETyhwZHVicm95KTogQ2xlYW4gdGhpcyB1cCBieSBpbnRyb2R1Y2luZyBhIHNwZWNpYWwgYE1hdGNoPHN0YXJ0QXBwbD5gIHJ1bGUsIHdoaWNoIHdpbGxcbiAgICAvLyBlbnN1cmUgdGhhdCB0aGVyZSBpcyBhbHdheXMgYSBzaW5nbGUgcm9vdCB0cmFjZSBub2RlLlxuICAgIHZhciByb290VHJhY2UgPSB0aGlzLnRyYWNlW3RoaXMudHJhY2UubGVuZ3RoIC0gMV07XG4gICAgcm9vdFRyYWNlLnJlc3VsdCA9IG1hdGNoUmVzdWx0O1xuICAgIHJldHVybiByb290VHJhY2U7XG4gIH0sXG5cbiAgcHVzaEZhaWx1cmVzSW5mbzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucHVzaCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbik7XG4gICAgdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrLnB1c2godGhpcy5yZWNvcmRlZEZhaWx1cmVzKTtcbiAgfSxcblxuICBwb3BGYWlsdXJlc0luZm86IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucG9wKCk7XG4gICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrLnBvcCgpO1xuICB9XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFN0YXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIE1hdGNoU3RhdGUgPSByZXF1aXJlKCcuL01hdGNoU3RhdGUnKTtcblxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBNYXRjaGVyKGdyYW1tYXIpIHtcbiAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgdGhpcy5tZW1vVGFibGUgPSBbXTtcbiAgdGhpcy5pbnB1dCA9ICcnO1xufVxuXG5NYXRjaGVyLnByb3RvdHlwZS5nZXRJbnB1dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5pbnB1dDtcbn07XG5cbk1hdGNoZXIucHJvdG90eXBlLnNldElucHV0ID0gZnVuY3Rpb24oc3RyKSB7XG4gIGlmICh0aGlzLmlucHV0ICE9PSBzdHIpIHtcbiAgICB0aGlzLnJlcGxhY2VJbnB1dFJhbmdlKDAsIHRoaXMuaW5wdXQubGVuZ3RoLCBzdHIpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuTWF0Y2hlci5wcm90b3R5cGUucmVwbGFjZUlucHV0UmFuZ2UgPSBmdW5jdGlvbihzdGFydElkeCwgZW5kSWR4LCBzdHIpIHtcbiAgdmFyIGN1cnJlbnRJbnB1dCA9IHRoaXMuaW5wdXQ7XG4gIGlmIChzdGFydElkeCA8IDAgfHwgc3RhcnRJZHggPiBjdXJyZW50SW5wdXQubGVuZ3RoIHx8XG4gICAgICBlbmRJZHggPCAwIHx8IGVuZElkeCA+IGN1cnJlbnRJbnB1dC5sZW5ndGggfHxcbiAgICAgIHN0YXJ0SWR4ID4gZW5kSWR4KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGluZGljZXM6ICcgKyBzdGFydElkeCArICcgYW5kICcgKyBlbmRJZHgpO1xuICB9XG5cbiAgLy8gdXBkYXRlIGlucHV0XG4gIHRoaXMuaW5wdXQgPSBjdXJyZW50SW5wdXQuc2xpY2UoMCwgc3RhcnRJZHgpICsgc3RyICsgY3VycmVudElucHV0LnNsaWNlKGVuZElkeCk7XG5cbiAgLy8gdXBkYXRlIG1lbW8gdGFibGUgKHNpbWlsYXIgdG8gdGhlIGFib3ZlKVxuICB2YXIgcmVzdE9mTWVtb1RhYmxlID0gdGhpcy5tZW1vVGFibGUuc2xpY2UoZW5kSWR4KTtcbiAgdGhpcy5tZW1vVGFibGUubGVuZ3RoID0gc3RhcnRJZHg7XG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHN0ci5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpcy5tZW1vVGFibGUucHVzaCh1bmRlZmluZWQpO1xuICB9XG4gIHJlc3RPZk1lbW9UYWJsZS5mb3JFYWNoKFxuICAgICAgZnVuY3Rpb24ocG9zSW5mbykgeyB0aGlzLm1lbW9UYWJsZS5wdXNoKHBvc0luZm8pOyB9LFxuICAgICAgdGhpcyk7XG5cbiAgLy8gSW52YWxpZGF0ZSBtZW1vUmVjc1xuICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzdGFydElkeDsgcG9zKyspIHtcbiAgICB2YXIgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgaWYgKHBvc0luZm8pIHtcbiAgICAgIHBvc0luZm8uY2xlYXJPYnNvbGV0ZUVudHJpZXMocG9zLCBzdGFydElkeCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5NYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgcmV0dXJuIHRoaXMuX21hdGNoKHRoaXMuX2dldFN0YXJ0RXhwcihvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSwgZmFsc2UpO1xufTtcblxuTWF0Y2hlci5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbihvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSB7XG4gIHJldHVybiB0aGlzLl9tYXRjaCh0aGlzLl9nZXRTdGFydEV4cHIob3B0U3RhcnRBcHBsaWNhdGlvblN0ciksIHRydWUpO1xufTtcblxuTWF0Y2hlci5wcm90b3R5cGUuX21hdGNoID0gZnVuY3Rpb24oc3RhcnRFeHByLCB0cmFjaW5nLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgdmFyIHN0YXRlID0gbmV3IE1hdGNoU3RhdGUodGhpcywgc3RhcnRFeHByLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpO1xuICByZXR1cm4gdHJhY2luZyA/IHN0YXRlLmdldFRyYWNlKCkgOiBzdGF0ZS5nZXRNYXRjaFJlc3VsdCgpO1xufTtcblxuLypcbiAgUmV0dXJucyB0aGUgc3RhcnRpbmcgZXhwcmVzc2lvbiBmb3IgdGhpcyBNYXRjaGVyJ3MgYXNzb2NpYXRlZCBncmFtbWFyLiBJZiBgb3B0U3RhcnRBcHBsaWNhdGlvblN0cmBcbiAgaXMgc3BlY2lmaWVkLCBpdCBpcyBhIHN0cmluZyBleHByZXNzaW5nIGEgcnVsZSBhcHBsaWNhdGlvbiBpbiB0aGUgZ3JhbW1hci4gSWYgbm90IHNwZWNpZmllZCwgdGhlXG4gIGdyYW1tYXIncyBkZWZhdWx0IHN0YXJ0IHJ1bGUgd2lsbCBiZSB1c2VkLlxuKi9cbk1hdGNoZXIucHJvdG90eXBlLl9nZXRTdGFydEV4cHIgPSBmdW5jdGlvbihvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSB7XG4gIHZhciBhcHBsaWNhdGlvblN0ciA9IG9wdFN0YXJ0QXBwbGljYXRpb25TdHIgfHwgdGhpcy5ncmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gIGlmICghYXBwbGljYXRpb25TdHIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmcgc3RhcnQgcnVsZSBhcmd1bWVudCAtLSB0aGUgZ3JhbW1hciBoYXMgbm8gZGVmYXVsdCBzdGFydCBydWxlLicpO1xuICB9XG5cbiAgdmFyIHN0YXJ0QXBwID0gdGhpcy5ncmFtbWFyLnBhcnNlQXBwbGljYXRpb24oYXBwbGljYXRpb25TdHIpO1xuICByZXR1cm4gbmV3IHBleHBycy5TZXEoW3N0YXJ0QXBwLCBwZXhwcnMuZW5kXSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBOYW1lc3BhY2UoKSB7XG59XG5OYW1lc3BhY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuTmFtZXNwYWNlLmFzTmFtZXNwYWNlID0gZnVuY3Rpb24ob2JqT3JOYW1lc3BhY2UpIHtcbiAgaWYgKG9iak9yTmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSB7XG4gICAgcmV0dXJuIG9iak9yTmFtZXNwYWNlO1xuICB9XG4gIHJldHVybiBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlKG9iak9yTmFtZXNwYWNlKTtcbn07XG5cbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXMgc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXNcbi8vIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSA9IGZ1bmN0aW9uKG9wdFByb3BzKSB7XG4gIHJldHVybiBOYW1lc3BhY2UuZXh0ZW5kKE5hbWVzcGFjZS5wcm90b3R5cGUsIG9wdFByb3BzKTtcbn07XG5cbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2Ugd2hpY2ggZXh0ZW5kcyBhbm90aGVyIG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpc1xuLy8gc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuZXh0ZW5kID0gZnVuY3Rpb24obmFtZXNwYWNlLCBvcHRQcm9wcykge1xuICBpZiAobmFtZXNwYWNlICE9PSBOYW1lc3BhY2UucHJvdG90eXBlICYmICEobmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIE5hbWVzcGFjZSBvYmplY3Q6ICcgKyBuYW1lc3BhY2UpO1xuICB9XG4gIHZhciBucyA9IE9iamVjdC5jcmVhdGUobmFtZXNwYWNlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBOYW1lc3BhY2UsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGV4dGVuZChucywgb3B0UHJvcHMpO1xufTtcblxuLy8gVE9ETzogU2hvdWxkIHRoaXMgYmUgYSByZWd1bGFyIG1ldGhvZD9cbk5hbWVzcGFjZS50b1N0cmluZyA9IGZ1bmN0aW9uKG5zKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobnMpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gTmFtZXNwYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gUG9zSW5mbygpIHtcbiAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IFtdOyAgLy8gYWN0aXZlIGFwcGxpY2F0aW9ucyBhdCB0aGlzIHBvc2l0aW9uXG4gIHRoaXMubWVtbyA9IHt9O1xuICB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gMDtcbiAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gLTE7XG4gIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSB1bmRlZmluZWQ7XG59XG5cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICBpc0FjdGl2ZTogZnVuY3Rpb24oYXBwbGljYXRpb24pIHtcbiAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSA+PSAwO1xuICB9LFxuXG4gIGVudGVyOiBmdW5jdGlvbihhcHBsaWNhdGlvbikge1xuICAgIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sucHVzaChhcHBsaWNhdGlvbi50b01lbW9LZXkoKSk7XG4gIH0sXG5cbiAgZXhpdDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wb3AoKTtcbiAgfSxcblxuICBzdGFydExlZnRSZWN1cnNpb246IGZ1bmN0aW9uKGhlYWRBcHBsaWNhdGlvbiwgbWVtb1JlYykge1xuICAgIG1lbW9SZWMuaXNMZWZ0UmVjdXJzaW9uID0gdHJ1ZTtcbiAgICBtZW1vUmVjLmhlYWRBcHBsaWNhdGlvbiA9IGhlYWRBcHBsaWNhdGlvbjtcbiAgICBtZW1vUmVjLm5leHRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gbWVtb1JlYztcblxuICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2s7XG4gICAgdmFyIGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmluZGV4T2YoaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSArIDE7XG4gICAgdmFyIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cyA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLnNsaWNlKGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZSk7XG5cbiAgICBtZW1vUmVjLmlzSW52b2x2ZWQgPSBmdW5jdGlvbihhcHBsaWNhdGlvbk1lbW9LZXkpIHtcbiAgICAgIHJldHVybiBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMuaW5kZXhPZihhcHBsaWNhdGlvbk1lbW9LZXkpID49IDA7XG4gICAgfTtcblxuICAgIG1lbW9SZWMudXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgICBmb3IgKHZhciBpZHggPSBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGU7IGlkeCA8IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrW2lkeF07XG4gICAgICAgIGlmICghdGhpcy5pc0ludm9sdmVkKGFwcGxpY2F0aW9uTWVtb0tleSkpIHtcbiAgICAgICAgICBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMucHVzaChhcHBsaWNhdGlvbk1lbW9LZXkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfSxcblxuICBlbmRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbi5uZXh0TGVmdFJlY3Vyc2lvbjtcbiAgfSxcblxuICAvLyBOb3RlOiB0aGlzIG1ldGhvZCBkb2Vzbid0IGdldCBjYWxsZWQgZm9yIHRoZSBcImhlYWRcIiBvZiBhIGxlZnQgcmVjdXJzaW9uIC0tIGZvciBMUiBoZWFkcyxcbiAgLy8gdGhlIG1lbW9pemVkIHJlc3VsdCAod2hpY2ggc3RhcnRzIG91dCBiZWluZyBhIGZhaWx1cmUpIGlzIGFsd2F5cyB1c2VkLlxuICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24obWVtb1JlYykge1xuICAgIGlmICghbWVtb1JlYy5pc0xlZnRSZWN1cnNpb24pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXkgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFja1tpZHhdO1xuICAgICAgaWYgKG1lbW9SZWMuaXNJbnZvbHZlZChhcHBsaWNhdGlvbk1lbW9LZXkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG5cbiAgbWVtb2l6ZTogZnVuY3Rpb24obWVtb0tleSwgbWVtb1JlYykge1xuICAgIHRoaXMubWVtb1ttZW1vS2V5XSA9IG1lbW9SZWM7XG4gICAgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KHRoaXMubWF4RXhhbWluZWRMZW5ndGgsIG1lbW9SZWMuZXhhbWluZWRMZW5ndGgpO1xuICAgIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9XG4gICAgICAgIE1hdGgubWF4KHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCwgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0KTtcbiAgICByZXR1cm4gbWVtb1JlYztcbiAgfSxcblxuICBjbGVhck9ic29sZXRlRW50cmllczogZnVuY3Rpb24ocG9zLCBpbnZhbGlkYXRlZElkeCkge1xuICAgIGlmIChwb3MgKyB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoIDw9IGludmFsaWRhdGVkSWR4KSB7XG4gICAgICAvLyBPcHRpbWl6YXRpb246IG5vbmUgb2YgdGhlIHJ1bGUgYXBwbGljYXRpb25zIHRoYXQgd2VyZSBtZW1vaXplZCBoZXJlIGV4YW1pbmVkIHRoZVxuICAgICAgLy8gaW50ZXJ2YWwgb2YgdGhlIGlucHV0IHRoYXQgY2hhbmdlZCwgc28gbm90aGluZyBoYXMgdG8gYmUgaW52YWxpZGF0ZWQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1lbW8gPSB0aGlzLm1lbW87XG4gICAgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IDA7XG4gICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gLTE7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKG1lbW8pLmZvckVhY2goZnVuY3Rpb24oaykge1xuICAgICAgdmFyIG1lbW9SZWMgPSBtZW1vW2tdO1xuICAgICAgaWYgKHBvcyArIG1lbW9SZWMuZXhhbWluZWRMZW5ndGggPiBpbnZhbGlkYXRlZElkeCkge1xuICAgICAgICBkZWxldGUgbWVtb1trXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNlbGYubWF4RXhhbWluZWRMZW5ndGggPSBNYXRoLm1heChzZWxmLm1heEV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoKTtcbiAgICAgICAgc2VsZi5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID1cbiAgICAgICAgICAgIE1hdGgubWF4KHNlbGYubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCwgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gUG9zSW5mbztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBTeW1ib2wgPSByZXF1aXJlKCdlczYtc3ltYm9sJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgSXRlcmF0aW9uTm9kZSA9IHJlcXVpcmUoJy4vbm9kZXMnKS5JdGVyYXRpb25Ob2RlO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEpTT04gaXMgbm90IGEgdmFsaWQgc3Vic2V0IG9mIEphdmFTY3JpcHQgYmVjYXVzZSB0aGVyZSBhcmUgdHdvIHBvc3NpYmxlIGxpbmUgdGVybWluYXRvcnMsXG4vLyBVKzIwMjggKGxpbmUgc2VwYXJhdG9yKSBhbmQgVSsyMDI5IChwYXJhZ3JhcGggc2VwYXJhdG9yKSB0aGF0IGFyZSBhbGxvd2VkIGluIEpTT04gc3RyaW5nc1xuLy8gYnV0IG5vdCBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXG4vLyBqc29uVG9KUygpIHByb3Blcmx5IGVuY29kZXMgdGhvc2UgdHdvIGNoYXJhY3RlcnMgaW4gSlNPTiBzbyB0aGF0IGl0IGNhbiBzZWFtbGVzc2x5IGJlXG4vLyBpbnNlcnRlZCBpbnRvIEphdmFTY3JpcHQgY29kZSAocGx1cyB0aGUgZW5jb2RlZCB2ZXJzaW9uIGlzIHN0aWxsIHZhbGlkIEpTT04pXG5mdW5jdGlvbiBqc29uVG9KUyhzdHIpIHtcbiAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKC9bXFx1MjAyOFxcdTIwMjldL2csIGZ1bmN0aW9uKGNoYXIsIHBvcywgc3RyKSB7XG4gICAgdmFyIGhleCA9IGNoYXIuY29kZVBvaW50QXQoMCkudG9TdHJpbmcoMTYpO1xuICAgIHJldHVybiAnXFxcXHUnICsgJzAwMDAnLnNsaWNlKGhleC5sZW5ndGgpICsgaGV4O1xuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gV3JhcHBlcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gV3JhcHBlcnMgZGVjb3JhdGUgQ1NUIG5vZGVzIHdpdGggYWxsIG9mIHRoZSBmdW5jdGlvbmFsaXR5IChpLmUuLCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzKVxuLy8gcHJvdmlkZWQgYnkgYSBTZW1hbnRpY3MgKHNlZSBiZWxvdykuIGBXcmFwcGVyYCBpcyB0aGUgYWJzdHJhY3Qgc3VwZXJjbGFzcyBvZiBhbGwgd3JhcHBlcnMuIEFcbi8vIGBXcmFwcGVyYCBtdXN0IGhhdmUgYF9ub2RlYCBhbmQgYF9zZW1hbnRpY3NgIGluc3RhbmNlIHZhcmlhYmxlcywgd2hpY2ggcmVmZXIgdG8gdGhlIENTVCBub2RlIGFuZFxuLy8gU2VtYW50aWNzIChyZXNwLikgZm9yIHdoaWNoIGl0IHdhcyBjcmVhdGVkLCBhbmQgYSBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlIHdoaWNoIGlzXG4vLyB1c2VkIHRvIGNhY2hlIHRoZSB3cmFwcGVyIGluc3RhbmNlcyB0aGF0IGFyZSBjcmVhdGVkIGZvciBpdHMgY2hpbGQgbm9kZXMuIFNldHRpbmcgdGhlc2UgaW5zdGFuY2Vcbi8vIHZhcmlhYmxlcyBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNvbnN0cnVjdG9yIG9mIGVhY2ggU2VtYW50aWNzLXNwZWNpZmljIHN1YmNsYXNzIG9mXG4vLyBgV3JhcHBlcmAuXG5mdW5jdGlvbiBXcmFwcGVyKCkge31cblxuV3JhcHBlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdbc2VtYW50aWNzIHdyYXBwZXIgZm9yICcgKyB0aGlzLl9ub2RlLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cbi8vIFRoaXMgaXMgdXNlZCBieSBvaG0gZWRpdG9yIHRvIGRpc3BsYXkgYSBub2RlIHdyYXBwZXIgYXBwcm9wcmlhdGVseS5cbldyYXBwZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xufTtcblxuV3JhcHBlci5wcm90b3R5cGUuX2ZvcmdldE1lbW9pemVkUmVzdWx0Rm9yID0gZnVuY3Rpb24oYXR0cmlidXRlTmFtZSkge1xuICAvLyBSZW1vdmUgdGhlIG1lbW9pemVkIGF0dHJpYnV0ZSBmcm9tIHRoZSBjc3ROb2RlIGFuZCBhbGwgaXRzIGNoaWxkcmVuLlxuICBkZWxldGUgdGhpcy5fbm9kZVt0aGlzLl9zZW1hbnRpY3MuYXR0cmlidXRlS2V5c1thdHRyaWJ1dGVOYW1lXV07XG4gIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgIGNoaWxkLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvcihhdHRyaWJ1dGVOYW1lKTtcbiAgfSk7XG59O1xuXG4vLyBSZXR1cm5zIHRoZSB3cmFwcGVyIG9mIHRoZSBzcGVjaWZpZWQgY2hpbGQgbm9kZS4gQ2hpbGQgd3JhcHBlcnMgYXJlIGNyZWF0ZWQgbGF6aWx5IGFuZCBjYWNoZWQgaW5cbi8vIHRoZSBwYXJlbnQgd3JhcHBlcidzIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUuXG5XcmFwcGVyLnByb3RvdHlwZS5jaGlsZCA9IGZ1bmN0aW9uKGlkeCkge1xuICBpZiAoISgwIDw9IGlkeCAmJiBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCkpKSB7XG4gICAgLy8gVE9ETzogQ29uc2lkZXIgdGhyb3dpbmcgYW4gZXhjZXB0aW9uIGhlcmUuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICB2YXIgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdO1xuICBpZiAoIWNoaWxkV3JhcHBlcikge1xuICAgIHZhciBjaGlsZE5vZGUgPSB0aGlzLl9ub2RlLmNoaWxkQXQoaWR4KTtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5fbm9kZS5jaGlsZE9mZnNldHNbaWR4XTtcblxuICAgIHZhciBzb3VyY2UgPSB0aGlzLl9iYXNlSW50ZXJ2YWwuc3ViSW50ZXJ2YWwob2Zmc2V0LCBjaGlsZE5vZGUubWF0Y2hMZW5ndGgpO1xuICAgIHZhciBiYXNlID0gY2hpbGROb2RlLmlzTm9udGVybWluYWwoKSA/IHNvdXJjZSA6IHRoaXMuX2Jhc2VJbnRlcnZhbDtcbiAgICBjaGlsZFdyYXBwZXIgPSB0aGlzLl9jaGlsZFdyYXBwZXJzW2lkeF0gPSB0aGlzLl9zZW1hbnRpY3Mud3JhcChjaGlsZE5vZGUsIHNvdXJjZSwgYmFzZSk7XG4gIH1cbiAgcmV0dXJuIGNoaWxkV3JhcHBlcjtcbn07XG5cbi8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgd3JhcHBlcnMgb2YgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpc1xuLy8gd3JhcHBlci5cbldyYXBwZXIucHJvdG90eXBlLl9jaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICAvLyBGb3JjZSB0aGUgY3JlYXRpb24gb2YgYWxsIGNoaWxkIHdyYXBwZXJzXG4gIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgaWR4KyspIHtcbiAgICB0aGlzLmNoaWxkKGlkeCk7XG4gIH1cbiAgcmV0dXJuIHRoaXMuX2NoaWxkV3JhcHBlcnM7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBjb3JyZXNwb25kcyB0byBhbiBpdGVyYXRpb25cbi8vIGV4cHJlc3Npb24sIGkuZS4sIGEgS2xlZW5lLSosIEtsZWVuZS0rLCBvciBhbiBvcHRpb25hbC4gUmV0dXJucyBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlLmlzSXRlcmF0aW9uKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIHRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbi8vIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX25vZGUuaXNUZXJtaW5hbCgpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlLCBgZmFsc2VgXG4vLyBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLl9ub2RlLmlzTm9udGVybWluYWwoKTtcbn07XG5cbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZVxuLy8gY29ycmVzcG9uZGluZyB0byBhIHN5bnRhY3RpYyBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmlzTm9udGVybWluYWwoKSAmJiB0aGlzLl9ub2RlLmlzU3ludGFjdGljKCk7XG59O1xuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGVcbi8vIGNvcnJlc3BvbmRpbmcgdG8gYSBsZXhpY2FsIHJ1bGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuV3JhcHBlci5wcm90b3R5cGUuaXNMZXhpY2FsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmlzTm9udGVybWluYWwoKSAmJiB0aGlzLl9ub2RlLmlzTGV4aWNhbCgpO1xufTtcblxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYW4gaXRlcmF0b3Igbm9kZVxuLy8gaGF2aW5nIGVpdGhlciBvbmUgb3Igbm8gY2hpbGQgKD8gb3BlcmF0b3IpLCBgZmFsc2VgIG90aGVyd2lzZS5cbi8vIE90aGVyd2lzZSwgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbldyYXBwZXIucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuX25vZGUuaXNPcHRpb25hbCgpO1xufTtcblxuLy8gQ3JlYXRlIGEgbmV3IF9pdGVyIHdyYXBwZXIgaW4gdGhlIHNhbWUgc2VtYW50aWNzIGFzIHRoaXMgd3JhcHBlci5cbldyYXBwZXIucHJvdG90eXBlLml0ZXJhdGlvbiA9IGZ1bmN0aW9uKG9wdENoaWxkV3JhcHBlcnMpIHtcbiAgdmFyIGNoaWxkV3JhcHBlcnMgPSBvcHRDaGlsZFdyYXBwZXJzIHx8IFtdO1xuXG4gIHZhciBjaGlsZE5vZGVzID0gY2hpbGRXcmFwcGVycy5tYXAoZnVuY3Rpb24oYykgeyByZXR1cm4gYy5fbm9kZTsgfSk7XG4gIHZhciBpdGVyID0gbmV3IEl0ZXJhdGlvbk5vZGUodGhpcy5fbm9kZS5ncmFtbWFyLCBjaGlsZE5vZGVzLCBbXSwgLTEsIGZhbHNlKTtcblxuICB2YXIgd3JhcHBlciA9IHRoaXMuX3NlbWFudGljcy53cmFwKGl0ZXIsIG51bGwsIG51bGwpO1xuICB3cmFwcGVyLl9jaGlsZFdyYXBwZXJzID0gY2hpbGRXcmFwcGVycztcbiAgcmV0dXJuIHdyYXBwZXI7XG59O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhXcmFwcGVyLnByb3RvdHlwZSwge1xuICAvLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gIGNoaWxkcmVuOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuX2NoaWxkcmVuKCk7IH19LFxuXG4gIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgZ3JhbW1hciBydWxlIHRoYXQgY3JlYXRlZCB0aGlzIENTVCBub2RlLlxuICBjdG9yTmFtZToge2dldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLl9ub2RlLmN0b3JOYW1lOyB9fSxcblxuICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBldmVudHVhbGx5IChkZXByZWNhdGVkIGluIHYwLjEyKS5cbiAgaW50ZXJ2YWw6IHtnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGBpbnRlcnZhbGAgcHJvcGVydHkgaXMgZGVwcmVjYXRlZCAtLSB1c2UgYHNvdXJjZWAgaW5zdGVhZCcpO1xuICB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gb2YgdGhpcyBDU1Qgbm9kZS5cbiAgbnVtQ2hpbGRyZW46IHtnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpOyB9fSxcblxuICAvLyBSZXR1cm5zIHRoZSBwcmltaXRpdmUgdmFsdWUgb2YgdGhpcyBDU1Qgbm9kZSwgaWYgaXQncyBhIHRlcm1pbmFsIG5vZGUuIE90aGVyd2lzZSxcbiAgLy8gdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgcHJpbWl0aXZlVmFsdWU6IHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHRoaXMuaXNUZXJtaW5hbCgpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlLnByaW1pdGl2ZVZhbHVlO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcInRyaWVkIHRvIGFjY2VzcyB0aGUgJ3ByaW1pdGl2ZVZhbHVlJyBhdHRyaWJ1dGUgb2YgYSBub24tdGVybWluYWwgQ1NUIG5vZGVcIik7XG4gICAgfVxuICB9LFxuXG4gIC8vIFJldHVybnMgdGhlIGNvbnRlbnRzIG9mIHRoZSBpbnB1dCBzdHJlYW0gY29uc3VtZWQgYnkgdGhpcyBDU1Qgbm9kZS5cbiAgc291cmNlU3RyaW5nOiB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMuc291cmNlLmNvbnRlbnRzOyB9fVxufSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFNlbWFudGljcyAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBBIFNlbWFudGljcyBpcyBhIGNvbnRhaW5lciBmb3IgYSBmYW1pbHkgb2YgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBmb3IgYSBnaXZlbiBncmFtbWFyLlxuLy8gU2VtYW50aWNzIGVuYWJsZSBtb2R1bGFyaXR5IChkaWZmZXJlbnQgY2xpZW50cyBvZiBhIGdyYW1tYXIgY2FuIGNyZWF0ZSB0aGVpciBzZXQgb2Ygb3BlcmF0aW9uc1xuLy8gYW5kIGF0dHJpYnV0ZXMgaW4gaXNvbGF0aW9uKSBhbmQgZXh0ZW5zaWJpbGl0eSBldmVuIHdoZW4gb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBhcmUgbXV0dWFsbHktXG4vLyByZWN1cnNpdmUuIFRoaXMgY29uc3RydWN0b3Igc2hvdWxkIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgZXhjZXB0IGZyb21cbi8vIGBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzYC4gVGhlIG5vcm1hbCB3YXlzIHRvIGNyZWF0ZSBhIFNlbWFudGljcywgZ2l2ZW4gYSBncmFtbWFyICdnJywgYXJlXG4vLyBgZy5jcmVhdGVTZW1hbnRpY3MoKWAgYW5kIGBnLmV4dGVuZFNlbWFudGljcyhwYXJlbnRTZW1hbnRpY3MpYC5cbmZ1bmN0aW9uIFNlbWFudGljcyhncmFtbWFyLCBzdXBlclNlbWFudGljcykge1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gZmFsc2U7XG5cbiAgLy8gQ29uc3RydWN0b3IgZm9yIHdyYXBwZXIgaW5zdGFuY2VzLCB3aGljaCBhcmUgcGFzc2VkIGFzIHRoZSBhcmd1bWVudHMgdG8gdGhlIHNlbWFudGljIGFjdGlvbnNcbiAgLy8gb2YgYW4gb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZS4gT3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyByZXF1aXJlIGRvdWJsZSBkaXNwYXRjaDogdGhlIHNlbWFudGljXG4gIC8vIGFjdGlvbiBpcyBjaG9zZW4gYmFzZWQgb24gYm90aCB0aGUgbm9kZSdzIHR5cGUgYW5kIHRoZSBzZW1hbnRpY3MuIFdyYXBwZXJzIGVuc3VyZSB0aGF0XG4gIC8vIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGlzIGNhbGxlZCB3aXRoIHRoZSBjb3JyZWN0IChtb3N0IHNwZWNpZmljKSBzZW1hbnRpY3Mgb2JqZWN0IGFzIGFuXG4gIC8vIGFyZ3VtZW50LlxuICB0aGlzLldyYXBwZXIgPSBmdW5jdGlvbihub2RlLCBzb3VyY2VJbnRlcnZhbCwgYmFzZUludGVydmFsKSB7XG4gICAgc2VsZi5jaGVja0FjdGlvbkRpY3RzSWZIYXZlbnRBbHJlYWR5KCk7XG4gICAgdGhpcy5fc2VtYW50aWNzID0gc2VsZjtcbiAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZUludGVydmFsO1xuXG4gICAgLy8gVGhlIGludGVydmFsIHRoYXQgdGhlIGNoaWxkT2Zmc2V0cyBvZiBgbm9kZWAgYXJlIHJlbGF0aXZlIHRvLiBJdCBzaG91bGQgYmUgdGhlIHNvdXJjZVxuICAgIC8vIG9mIHRoZSBjbG9zZXN0IE5vbnRlcm1pbmFsIG5vZGUuXG4gICAgdGhpcy5fYmFzZUludGVydmFsID0gYmFzZUludGVydmFsO1xuXG4gICAgaWYgKG5vZGUuaXNOb250ZXJtaW5hbCgpKSB7XG4gICAgICBjb21tb24uYXNzZXJ0KHNvdXJjZUludGVydmFsID09PSBiYXNlSW50ZXJ2YWwpO1xuICAgIH1cblxuICAgIHRoaXMuX2NoaWxkV3JhcHBlcnMgPSBbXTtcbiAgfTtcblxuICB0aGlzLnN1cGVyID0gc3VwZXJTZW1hbnRpY3M7XG4gIGlmIChzdXBlclNlbWFudGljcykge1xuICAgIGlmICghKGdyYW1tYXIuZXF1YWxzKHRoaXMuc3VwZXIuZ3JhbW1hcikgfHwgZ3JhbW1hci5faW5oZXJpdHNGcm9tKHRoaXMuc3VwZXIuZ3JhbW1hcikpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDYW5ub3QgZXh0ZW5kIGEgc2VtYW50aWNzIGZvciBncmFtbWFyICdcIiArIHRoaXMuc3VwZXIuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgZm9yIHVzZSB3aXRoIGdyYW1tYXIgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInIChub3QgYSBzdWItZ3JhbW1hcilcIik7XG4gICAgfVxuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgdGhpcy5zdXBlci5XcmFwcGVyKTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIub3BlcmF0aW9ucyk7XG4gICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLmF0dHJpYnV0ZXMpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbiAgICAvLyBBc3NpZ24gdW5pcXVlIHN5bWJvbHMgZm9yIGVhY2ggb2YgdGhlIGF0dHJpYnV0ZXMgaW5oZXJpdGVkIGZyb20gdGhlIHN1cGVyLXNlbWFudGljcyBzbyB0aGF0XG4gICAgLy8gdGhleSBhcmUgbWVtb2l6ZWQgaW5kZXBlbmRlbnRseS5cbiAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdID0gU3ltYm9sKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgV3JhcHBlcik7XG4gICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIH1cbn1cblxuU2VtYW50aWNzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1tzZW1hbnRpY3MgZm9yICcgKyB0aGlzLmdyYW1tYXIubmFtZSArICddJztcbn07XG5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzKSB7XG4gICAgdGhpcy5jaGVja0FjdGlvbkRpY3RzKCk7XG4gICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSB0cnVlO1xuICB9XG59O1xuXG4vLyBDaGVja3MgdGhhdCB0aGUgYWN0aW9uIGRpY3Rpb25hcmllcyBmb3IgYWxsIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgaW4gdGhpcyBzZW1hbnRpY3MsXG4vLyBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdCB3ZXJlIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3MsIGFncmVlIHdpdGggdGhlIGdyYW1tYXIuXG4vLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIG9uZSBvciBtb3JlIG9mIHRoZW0gZG9lc24ndC5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgbmFtZTtcbiAgZm9yIChuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgfVxuICBmb3IgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5hdHRyaWJ1dGVzW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLnRvUmVjaXBlID0gZnVuY3Rpb24oc2VtYW50aWNzT25seSkge1xuICBmdW5jdGlvbiBoYXNTdXBlclNlbWFudGljcyhzKSB7XG4gICAgcmV0dXJuIHMuc3VwZXIgIT09IFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKTtcbiAgfVxuXG4gIHZhciBzdHIgPSAnKGZ1bmN0aW9uKGcpIHtcXG4nO1xuICBpZiAoaGFzU3VwZXJTZW1hbnRpY3ModGhpcykpIHtcbiAgICBzdHIgKz0gJyAgdmFyIHNlbWFudGljcyA9ICcgKyB0aGlzLnN1cGVyLnRvUmVjaXBlKHRydWUpICsgJyhnJztcblxuICAgIHZhciBzdXBlclNlbWFudGljc0dyYW1tYXIgPSB0aGlzLnN1cGVyLmdyYW1tYXI7XG4gICAgdmFyIHJlbGF0ZWRHcmFtbWFyID0gdGhpcy5ncmFtbWFyO1xuICAgIHdoaWxlIChyZWxhdGVkR3JhbW1hciAhPT0gc3VwZXJTZW1hbnRpY3NHcmFtbWFyKSB7XG4gICAgICBzdHIgKz0gJy5zdXBlckdyYW1tYXInO1xuICAgICAgcmVsYXRlZEdyYW1tYXIgPSByZWxhdGVkR3JhbW1hci5zdXBlckdyYW1tYXI7XG4gICAgfVxuXG4gICAgc3RyICs9ICcpO1xcbic7XG4gICAgc3RyICs9ICcgIHJldHVybiBnLmV4dGVuZFNlbWFudGljcyhzZW1hbnRpY3MpJztcbiAgfSBlbHNlIHtcbiAgICBzdHIgKz0gJyAgcmV0dXJuIGcuY3JlYXRlU2VtYW50aWNzKCknO1xuICB9XG4gIFsnT3BlcmF0aW9uJywgJ0F0dHJpYnV0ZSddLmZvckVhY2goZnVuY3Rpb24odHlwZSkge1xuICAgIHZhciBzZW1hbnRpY09wZXJhdGlvbnMgPSB0aGlzW3R5cGUudG9Mb3dlckNhc2UoKSArICdzJ107XG4gICAgT2JqZWN0LmtleXMoc2VtYW50aWNPcGVyYXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHZhciBzaWduYXR1cmUgPSBuYW1lO1xuICAgICAgaWYgKHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5mb3JtYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2lnbmF0dXJlICs9ICcoJyArIHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5mb3JtYWxzLmpvaW4oJywgJykgKyAnKSc7XG4gICAgICB9XG5cbiAgICAgIHZhciBtZXRob2Q7XG4gICAgICBpZiAoaGFzU3VwZXJTZW1hbnRpY3ModGhpcykgJiYgdGhpcy5zdXBlclt0eXBlLnRvTG93ZXJDYXNlKCkgKyAncyddW25hbWVdKSB7XG4gICAgICAgIG1ldGhvZCA9ICdleHRlbmQnICsgdHlwZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1ldGhvZCA9ICdhZGQnICsgdHlwZTtcbiAgICAgIH1cbiAgICAgIHN0ciArPSAnXFxuICAgIC4nICsgbWV0aG9kICsgJygnICsgSlNPTi5zdHJpbmdpZnkoc2lnbmF0dXJlKSArICcsIHsnO1xuXG4gICAgICB2YXIgYWN0aW9ucyA9IHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5hY3Rpb25EaWN0O1xuICAgICAgdmFyIHNyY0FycmF5ID0gW107XG4gICAgICBPYmplY3Qua2V5cyhhY3Rpb25zKS5mb3JFYWNoKGZ1bmN0aW9uKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXS5idWlsdEluRGVmYXVsdCAhPT0gYWN0aW9uc1thY3Rpb25OYW1lXSkge1xuICAgICAgICAgIHNyY0FycmF5LnB1c2goJ1xcbiAgICAgICcgKyBKU09OLnN0cmluZ2lmeShhY3Rpb25OYW1lKSArICc6ICcgK1xuICAgICAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXS50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBzdHIgKz0gc3JjQXJyYXkuam9pbignLCcpO1xuXG4gICAgICBzdHIgKz0gJ1xcbiAgICB9KSc7XG4gICAgfSwgdGhpcyk7XG4gIH0sIHRoaXMpO1xuICBzdHIgKz0gJztcXG4gIH0pJztcblxuICBpZiAoIXNlbWFudGljc09ubHkpIHtcbiAgICBzdHIgPVxuICAgICAgJyhmdW5jdGlvbigpIHtcXG4nICtcbiAgICAgICcgIHZhciBncmFtbWFyID0gdGhpcy5mcm9tUmVjaXBlKCcgKyBqc29uVG9KUyh0aGlzLmdyYW1tYXIudG9SZWNpcGUoKSkgKyAnKTtcXG4nICtcbiAgICAgICcgIHZhciBzZW1hbnRpY3MgPSAnICsgc3RyICsgJyhncmFtbWFyKTtcXG4nICtcbiAgICAgICcgIHJldHVybiBzZW1hbnRpY3M7XFxuJyArXG4gICAgICAnfSk7XFxuJztcbiAgfVxuXG4gIHJldHVybiBzdHI7XG59O1xuXG52YXIgcHJvdG90eXBlR3JhbW1hcjtcbnZhciBwcm90b3R5cGVHcmFtbWFyU2VtYW50aWNzO1xuXG4vLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBtYWluLmpzIG9uY2UgT2htIGhhcyBsb2FkZWQuXG5TZW1hbnRpY3MuaW5pdFByb3RvdHlwZVBhcnNlciA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyA9IGdyYW1tYXIuY3JlYXRlU2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCdwYXJzZScsIHtcbiAgICBBdHRyaWJ1dGVTaWduYXR1cmU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgZm9ybWFsczogW11cbiAgICAgIH07XG4gICAgfSxcbiAgICBPcGVyYXRpb25TaWduYXR1cmU6IGZ1bmN0aW9uKG5hbWUsIG9wdEZvcm1hbHMpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgZm9ybWFsczogb3B0Rm9ybWFscy5wYXJzZSgpWzBdIHx8IFtdXG4gICAgICB9O1xuICAgIH0sXG4gICAgRm9ybWFsczogZnVuY3Rpb24ob3BhcmVuLCBmcywgY3BhcmVuKSB7XG4gICAgICByZXR1cm4gZnMuYXNJdGVyYXRpb24oKS5wYXJzZSgpO1xuICAgIH0sXG4gICAgbmFtZTogZnVuY3Rpb24oZmlyc3QsIHJlc3QpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICB9XG4gIH0pO1xuICBwcm90b3R5cGVHcmFtbWFyID0gZ3JhbW1hcjtcbn07XG5cbmZ1bmN0aW9uIHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSwgdHlwZSkge1xuICBpZiAoIXByb3RvdHlwZUdyYW1tYXIpIHtcbiAgICAvLyBUaGUgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBncmFtbWFyIHdvbid0IGJlIGF2YWlsYWJsZSB3aGlsZSBPaG0gaXMgbG9hZGluZyxcbiAgICAvLyBidXQgd2UgY2FuIGdldCBhd2F5IHRoZSBmb2xsb3dpbmcgc2ltcGxpZmljYXRpb24gYi9jIG5vbmUgb2YgdGhlIG9wZXJhdGlvbnNcbiAgICAvLyB0aGF0IGFyZSB1c2VkIHdoaWxlIGxvYWRpbmcgdGFrZSBhcmd1bWVudHMuXG4gICAgY29tbW9uLmFzc2VydChzaWduYXR1cmUuaW5kZXhPZignKCcpID09PSAtMSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5hbWU6IHNpZ25hdHVyZSxcbiAgICAgIGZvcm1hbHM6IFtdXG4gICAgfTtcbiAgfVxuXG4gIHZhciByID0gcHJvdG90eXBlR3JhbW1hci5tYXRjaChcbiAgICAgIHNpZ25hdHVyZSxcbiAgICAgIHR5cGUgPT09ICdvcGVyYXRpb24nID8gJ09wZXJhdGlvblNpZ25hdHVyZScgOiAnQXR0cmlidXRlU2lnbmF0dXJlJyk7XG4gIGlmIChyLmZhaWxlZCgpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHIubWVzc2FnZSk7XG4gIH1cblxuICByZXR1cm4gcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyhyKS5wYXJzZSgpO1xufVxuXG5mdW5jdGlvbiBuZXdEZWZhdWx0QWN0aW9uKHR5cGUsIG5hbWUsIGRvSXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNoaWxkcmVuKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciB0aGlzVGhpbmcgPSB0aGlzLl9zZW1hbnRpY3Mub3BlcmF0aW9uc1tuYW1lXSB8fCB0aGlzLl9zZW1hbnRpY3MuYXR0cmlidXRlc1tuYW1lXTtcbiAgICB2YXIgYXJncyA9IHRoaXNUaGluZy5mb3JtYWxzLm1hcChmdW5jdGlvbihmb3JtYWwpIHtcbiAgICAgIHJldHVybiBzZWxmLmFyZ3NbZm9ybWFsXTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmlzSXRlcmF0aW9uKCkpIHtcbiAgICAgIC8vIFRoaXMgQ1NUIG5vZGUgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uIGV4cHJlc3Npb24gaW4gdGhlIGdyYW1tYXIgKCosICssIG9yID8pLiBUaGVcbiAgICAgIC8vIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gbWFwIHRoaXMgb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZSBvdmVyIGFsbCBvZiBpdHMgY2hpbGQgbm9kZXMuXG4gICAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uKGNoaWxkKSB7IHJldHVybiBkb0l0LmFwcGx5KGNoaWxkLCBhcmdzKTsgfSk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBDU1Qgbm9kZSBjb3JyZXNwb25kcyB0byBhIG5vbi10ZXJtaW5hbCBpbiB0aGUgZ3JhbW1hciAoZS5nLiwgQWRkRXhwcikuIFRoZSBmYWN0IHRoYXRcbiAgICAvLyB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoaXMgYWN0aW9uIGRpY3Rpb25hcnkgZG9lc24ndCBoYXZlIGFuIGFjdGlvbiBmb3IgdGhpcyBwYXJ0aWN1bGFyXG4gICAgLy8gbm9uLXRlcm1pbmFsIG9yIGEgZ2VuZXJpYyBgX25vbnRlcm1pbmFsYCBhY3Rpb24uXG4gICAgaWYgKGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQXMgYSBjb252ZW5pZW5jZSwgaWYgdGhpcyBub2RlIG9ubHkgaGFzIG9uZSBjaGlsZCwgd2UganVzdCByZXR1cm4gdGhlIHJlc3VsdCBvZlxuICAgICAgLy8gYXBwbHlpbmcgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgdG8gdGhlIGNoaWxkIG5vZGUuXG4gICAgICByZXR1cm4gZG9JdC5hcHBseShjaGlsZHJlblswXSwgYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE90aGVyd2lzZSwgd2UgdGhyb3cgYW4gZXhjZXB0aW9uIHRvIGxldCB0aGUgcHJvZ3JhbW1lciBrbm93IHRoYXQgd2UgZG9uJ3Qga25vdyB3aGF0XG4gICAgICAvLyB0byBkbyB3aXRoIHRoaXMgbm9kZS5cbiAgICAgIHRocm93IGVycm9ycy5taXNzaW5nU2VtYW50aWNBY3Rpb24oXG4gICAgICAgICAgdGhpcy5jdG9yTmFtZSwgbmFtZSwgdHlwZSk7XG4gICAgfVxuICB9O1xufVxuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KSB7XG4gIHZhciB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcblxuICB2YXIgcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MgPSBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpO1xuICB2YXIgbmFtZSA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLm5hbWU7XG4gIHZhciBmb3JtYWxzID0gcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MuZm9ybWFscztcblxuICAvLyBUT0RPOiBjaGVjayB0aGF0IHRoZXJlIGFyZSBubyBkdXBsaWNhdGUgZm9ybWFsIGFyZ3VtZW50c1xuXG4gIHRoaXMuYXNzZXJ0TmV3TmFtZShuYW1lLCB0eXBlKTtcblxuICAvLyBDcmVhdGUgdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGZvciB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0aGF0IGNvbnRhaW5zIGEgYF9kZWZhdWx0YCBhY3Rpb25cbiAgLy8gd2hpY2ggZGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiBpdGVyYXRpb24sIHRlcm1pbmFsLCBhbmQgbm9uLXRlcm1pbmFsIG5vZGVzLi4uXG4gIHZhciBidWlsdEluRGVmYXVsdCA9IG5ld0RlZmF1bHRBY3Rpb24odHlwZSwgbmFtZSwgZG9JdCk7XG4gIHZhciByZWFsQWN0aW9uRGljdCA9IHtfZGVmYXVsdDogYnVpbHRJbkRlZmF1bHR9O1xuICAvLyAuLi4gYW5kIGFkZCBpbiB0aGUgYWN0aW9ucyBzdXBwbGllZCBieSB0aGUgcHJvZ3JhbW1lciwgd2hpY2ggbWF5IG92ZXJyaWRlIHNvbWUgb3IgYWxsIG9mIHRoZVxuICAvLyBkZWZhdWx0IG9uZXMuXG4gIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgIHJlYWxBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgfSk7XG5cbiAgdmFyIGVudHJ5ID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgP1xuICAgICAgbmV3IE9wZXJhdGlvbihuYW1lLCBmb3JtYWxzLCByZWFsQWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIDpcbiAgICAgIG5ldyBBdHRyaWJ1dGUobmFtZSwgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KTtcblxuICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgZW50cnkuY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG5cbiAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9IGVudHJ5O1xuXG4gIGZ1bmN0aW9uIGRvSXQoKSB7XG4gICAgLy8gRGlzcGF0Y2ggdG8gbW9zdCBzcGVjaWZpYyB2ZXJzaW9uIG9mIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIC0tIGl0IG1heSBoYXZlIGJlZW5cbiAgICAvLyBvdmVycmlkZGVuIGJ5IGEgc3ViLXNlbWFudGljcy5cbiAgICB2YXIgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzW3R5cGVQbHVyYWxdW25hbWVdO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgY2FsbGVyIHBhc3NlZCB0aGUgY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZCB0byAnICsgbmFtZSArICcgJyArIHR5cGUgKyAnIChleHBlY3RlZCAnICtcbiAgICAgICAgICB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGggKyAnLCBnb3QgJyArIGFyZ3VtZW50cy5sZW5ndGggKyAnKScpO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhbiBcImFyZ3VtZW50cyBvYmplY3RcIiBmcm9tIHRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGlzXG4gICAgLy8gb3BlcmF0aW9uIC8gYXR0cmlidXRlLlxuICAgIHZhciBhcmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgdmFyIGZvcm1hbCA9IHRoaXNUaGluZy5mb3JtYWxzW2lkeF07XG4gICAgICBhcmdzW2Zvcm1hbF0gPSBhcmd1bWVudHNbaWR4XTtcbiAgICB9XG5cbiAgICB2YXIgb2xkQXJncyA9IHRoaXMuYXJncztcbiAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgIHRyeSB7XG4gICAgICB2YXIgYW5zID0gdGhpc1RoaW5nLmV4ZWN1dGUodGhpcy5fc2VtYW50aWNzLCB0aGlzKTtcblxuICAgICAgdGhpcy5hcmdzID0gb2xkQXJncztcbiAgICAgIHJldHVybiBhbnM7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUubmFtZSA9PT0gJ21pc3NpbmdTZW1hbnRpY0FjdGlvbicpIHtcbiAgICAgICAgZS5tZXNzYWdlICs9ICdcXG4nICsgdGhpcy5jdG9yTmFtZTtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHR5cGUgPT09ICdvcGVyYXRpb24nKSB7XG4gICAgdGhpcy5XcmFwcGVyLnByb3RvdHlwZVtuYW1lXSA9IGRvSXQ7XG4gICAgdGhpcy5XcmFwcGVyLnByb3RvdHlwZVtuYW1lXS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuICdbJyArIG5hbWUgKyAnIG9wZXJhdGlvbl0nO1xuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuV3JhcHBlci5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICAgIGdldDogZG9JdCxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSAgLy8gU28gdGhlIHByb3BlcnR5IGNhbiBiZSBkZWxldGVkLlxuICAgIH0pO1xuICAgIHRoaXMuYXR0cmlidXRlS2V5c1tuYW1lXSA9IFN5bWJvbCgpO1xuICB9XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgYWN0aW9uRGljdCkge1xuICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG5cbiAgLy8gTWFrZSBzdXJlIHRoYXQgYG5hbWVgIHJlYWxseSBpcyBqdXN0IGEgbmFtZSwgaS5lLiwgdGhhdCBpdCBkb2Vzbid0IGFsc28gY29udGFpbiBmb3JtYWxzLlxuICBwYXJzZVNpZ25hdHVyZShuYW1lLCAnYXR0cmlidXRlJyk7XG5cbiAgaWYgKCEodGhpcy5zdXBlciAmJiBuYW1lIGluIHRoaXMuc3VwZXJbdHlwZVBsdXJhbF0pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArXG4gICAgICAgIFwiJzogZGlkIG5vdCBpbmhlcml0IGFuIFwiICsgdHlwZSArICcgd2l0aCB0aGF0IG5hbWUnKTtcbiAgfVxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbdHlwZVBsdXJhbF0sIG5hbWUpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJyBhZ2FpblwiKTtcbiAgfVxuXG4gIC8vIENyZWF0ZSBhIG5ldyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgd2hvc2UgYWN0aW9uRGljdCBkZWxlZ2F0ZXMgdG8gdGhlIHN1cGVyIG9wZXJhdGlvbiAvXG4gIC8vIGF0dHJpYnV0ZSdzIGFjdGlvbkRpY3QsIGFuZCB3aGljaCBoYXMgYWxsIHRoZSBrZXlzIGZyb20gYGluaGVyaXRlZEFjdGlvbkRpY3RgLlxuICB2YXIgaW5oZXJpdGVkRm9ybWFscyA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uZm9ybWFscztcbiAgdmFyIGluaGVyaXRlZEFjdGlvbkRpY3QgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmFjdGlvbkRpY3Q7XG4gIHZhciBuZXdBY3Rpb25EaWN0ID0gT2JqZWN0LmNyZWF0ZShpbmhlcml0ZWRBY3Rpb25EaWN0KTtcbiAgT2JqZWN0LmtleXMoYWN0aW9uRGljdCkuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgbmV3QWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gIH0pO1xuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSB0eXBlID09PSAnb3BlcmF0aW9uJyA/XG4gICAgICBuZXcgT3BlcmF0aW9uKG5hbWUsIGluaGVyaXRlZEZvcm1hbHMsIG5ld0FjdGlvbkRpY3QpIDpcbiAgICAgIG5ldyBBdHRyaWJ1dGUobmFtZSwgbmV3QWN0aW9uRGljdCk7XG5cbiAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG59O1xuXG5TZW1hbnRpY3MucHJvdG90eXBlLmFzc2VydE5ld05hbWUgPSBmdW5jdGlvbihuYW1lLCB0eXBlKSB7XG4gIGlmIChXcmFwcGVyLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiB0aGF0J3MgYSByZXNlcnZlZCBuYW1lXCIpO1xuICB9XG4gIGlmIChuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBvcGVyYXRpb24gd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gIH1cbiAgaWYgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IGFuIGF0dHJpYnV0ZSB3aXRoIHRoYXQgbmFtZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgfVxufTtcblxuLy8gUmV0dXJucyBhIHdyYXBwZXIgZm9yIHRoZSBnaXZlbiBDU1QgYG5vZGVgIGluIHRoaXMgc2VtYW50aWNzLlxuLy8gSWYgYG5vZGVgIGlzIGFscmVhZHkgYSB3cmFwcGVyLCByZXR1cm5zIGBub2RlYCBpdHNlbGYuICAvLyBUT0RPOiB3aHkgaXMgdGhpcyBuZWVkZWQ/XG5TZW1hbnRpY3MucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbihub2RlLCBzb3VyY2UsIG9wdEJhc2VJbnRlcnZhbCkge1xuICB2YXIgYmFzZUludGVydmFsID0gb3B0QmFzZUludGVydmFsIHx8IHNvdXJjZTtcbiAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiB0aGlzLldyYXBwZXIgPyBub2RlIDogbmV3IHRoaXMuV3JhcHBlcihub2RlLCBzb3VyY2UsIGJhc2VJbnRlcnZhbCk7XG59O1xuXG4vLyBDcmVhdGVzIGEgbmV3IFNlbWFudGljcyBpbnN0YW5jZSBmb3IgYGdyYW1tYXJgLCBpbmhlcml0aW5nIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgZnJvbVxuLy8gYG9wdFN1cGVyU2VtYW50aWNzYCwgaWYgaXQgaXMgc3BlY2lmaWVkLiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHkgZm9yIHRoZSBuZXdcbi8vIFNlbWFudGljcyBpbnN0YW5jZS4gV2hlbiB0aGF0IGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBhIENTVCBub2RlIGFzIGFuIGFyZ3VtZW50LCBpdCByZXR1cm5zXG4vLyBhIHdyYXBwZXIgZm9yIHRoYXQgbm9kZSB3aGljaCBnaXZlcyBhY2Nlc3MgdG8gdGhlIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcHJvdmlkZWQgYnkgdGhpc1xuLy8gc2VtYW50aWNzLlxuU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyA9IGZ1bmN0aW9uKGdyYW1tYXIsIG9wdFN1cGVyU2VtYW50aWNzKSB7XG4gIHZhciBzID0gbmV3IFNlbWFudGljcyhcbiAgICAgIGdyYW1tYXIsXG4gICAgICBvcHRTdXBlclNlbWFudGljcyAhPT0gdW5kZWZpbmVkID9cbiAgICAgICAgICBvcHRTdXBlclNlbWFudGljcyA6XG4gICAgICAgICAgU2VtYW50aWNzLkJ1aWx0SW5TZW1hbnRpY3MuX2dldFNlbWFudGljcygpKTtcblxuICAvLyBUbyBlbmFibGUgY2xpZW50cyB0byBpbnZva2UgYSBzZW1hbnRpY3MgbGlrZSBhIGZ1bmN0aW9uLCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBwcm94eVxuICAvLyBmb3IgYHNgLCB3aGljaCBpcyB0aGUgcmVhbCBgU2VtYW50aWNzYCBpbnN0YW5jZS5cbiAgdmFyIHByb3h5ID0gZnVuY3Rpb24gQVNlbWFudGljcyhtYXRjaFJlc3VsdCkge1xuICAgIGlmICghKG1hdGNoUmVzdWx0IGluc3RhbmNlb2YgTWF0Y2hSZXN1bHQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICdTZW1hbnRpY3MgZXhwZWN0ZWQgYSBNYXRjaFJlc3VsdCwgYnV0IGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhtYXRjaFJlc3VsdCkpO1xuICAgIH1cbiAgICBpZiAobWF0Y2hSZXN1bHQuZmFpbGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nhbm5vdCBhcHBseSBTZW1hbnRpY3MgdG8gJyArIG1hdGNoUmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIHZhciBjc3QgPSBtYXRjaFJlc3VsdC5fY3N0O1xuICAgIGlmIChjc3QuZ3JhbW1hciAhPT0gZ3JhbW1hcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiQ2Fubm90IHVzZSBhIE1hdGNoUmVzdWx0IGZyb20gZ3JhbW1hciAnXCIgKyBjc3QuZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICBcIicgd2l0aCBhIHNlbWFudGljcyBmb3IgJ1wiICsgZ3JhbW1hci5uYW1lICsgXCInXCIpO1xuICAgIH1cbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBuZXcgSW5wdXRTdHJlYW0obWF0Y2hSZXN1bHQuaW5wdXQpO1xuICAgIHJldHVybiBzLndyYXAoY3N0LCBpbnB1dFN0cmVhbS5pbnRlcnZhbChtYXRjaFJlc3VsdC5fY3N0T2Zmc2V0LCBtYXRjaFJlc3VsdC5pbnB1dC5sZW5ndGgpKTtcbiAgfTtcblxuICAvLyBGb3J3YXJkIHB1YmxpYyBtZXRob2RzIGZyb20gdGhlIHByb3h5IHRvIHRoZSBzZW1hbnRpY3MgaW5zdGFuY2UuXG4gIHByb3h5LmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uKHNpZ25hdHVyZSwgYWN0aW9uRGljdCkge1xuICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ29wZXJhdGlvbicsIHNpZ25hdHVyZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5leHRlbmRPcGVyYXRpb24gPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSgnYXR0cmlidXRlJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5leHRlbmRBdHRyaWJ1dGUgPSBmdW5jdGlvbihuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSgnYXR0cmlidXRlJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgcmV0dXJuIHByb3h5O1xuICB9O1xuICBwcm94eS5fZ2V0QWN0aW9uRGljdCA9IGZ1bmN0aW9uKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSkge1xuICAgIHZhciBhY3Rpb24gPSBzLm9wZXJhdGlvbnNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXSB8fCBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICBpZiAoIWFjdGlvbikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgKyBvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgKyAnXCIgaXMgbm90IGEgdmFsaWQgb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZSAnICtcbiAgICAgICAgJ25hbWUgaW4gdGhpcyBzZW1hbnRpY3MgZm9yIFwiJyArIGdyYW1tYXIubmFtZSArICdcIicpO1xuICAgIH1cbiAgICByZXR1cm4gYWN0aW9uLmFjdGlvbkRpY3Q7XG4gIH07XG4gIHByb3h5Ll9yZW1vdmUgPSBmdW5jdGlvbihvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUpIHtcbiAgICB2YXIgc2VtYW50aWM7XG4gICAgaWYgKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSBpbiBzLm9wZXJhdGlvbnMpIHtcbiAgICAgIHNlbWFudGljID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICBkZWxldGUgcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgaW4gcy5hdHRyaWJ1dGVzKSB7XG4gICAgICBzZW1hbnRpYyA9IHMuYXR0cmlidXRlc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgZGVsZXRlIHMuYXR0cmlidXRlc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgIH1cbiAgICBkZWxldGUgcy5XcmFwcGVyLnByb3RvdHlwZVtvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgIHJldHVybiBzZW1hbnRpYztcbiAgfTtcbiAgcHJveHkuZ2V0T3BlcmF0aW9uTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMocy5vcGVyYXRpb25zKTtcbiAgfTtcbiAgcHJveHkuZ2V0QXR0cmlidXRlTmFtZXMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMocy5hdHRyaWJ1dGVzKTtcbiAgfTtcbiAgcHJveHkuZ2V0R3JhbW1hciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzLmdyYW1tYXI7XG4gIH07XG4gIHByb3h5LnRvUmVjaXBlID0gZnVuY3Rpb24oc2VtYW50aWNzT25seSkge1xuICAgIHJldHVybiBzLnRvUmVjaXBlKHNlbWFudGljc09ubHkpO1xuICB9O1xuXG4gIC8vIE1ha2UgdGhlIHByb3h5J3MgdG9TdHJpbmcoKSB3b3JrLlxuICBwcm94eS50b1N0cmluZyA9IHMudG9TdHJpbmcuYmluZChzKTtcblxuICAvLyBSZXR1cm5zIHRoZSBzZW1hbnRpY3MgZm9yIHRoZSBwcm94eS5cbiAgcHJveHkuX2dldFNlbWFudGljcyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBzO1xuICB9O1xuXG4gIHJldHVybiBwcm94eTtcbn07XG5cblNlbWFudGljcy5pbml0QnVpbHRJblNlbWFudGljcyA9IGZ1bmN0aW9uKGJ1aWx0SW5SdWxlcykge1xuICB2YXIgYWN0aW9ucyA9IHtcbiAgICBlbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pdGVyYXRpb24oKTtcbiAgICB9LFxuICAgIG5vbkVtcHR5OiBmdW5jdGlvbihmaXJzdCwgXywgcmVzdCkge1xuICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0aW9uKFtmaXJzdF0uY29uY2F0KHJlc3QuY2hpbGRyZW4pKTtcbiAgICB9XG4gIH07XG5cbiAgU2VtYW50aWNzLkJ1aWx0SW5TZW1hbnRpY3MgPSBTZW1hbnRpY3NcbiAgICAgIC5jcmVhdGVTZW1hbnRpY3MoYnVpbHRJblJ1bGVzLCBudWxsKVxuICAgICAgLmFkZE9wZXJhdGlvbignYXNJdGVyYXRpb24nLCB7XG4gICAgICAgIGVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBub25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eSxcbiAgICAgICAgRW1wdHlMaXN0T2Y6IGFjdGlvbnMuZW1wdHksXG4gICAgICAgIE5vbmVtcHR5TGlzdE9mOiBhY3Rpb25zLm5vbkVtcHR5XG4gICAgICB9KTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIE9wZXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBBbiBPcGVyYXRpb24gcmVwcmVzZW50cyBhIGZ1bmN0aW9uIHRvIGJlIGFwcGxpZWQgdG8gYSBjb25jcmV0ZSBzeW50YXggdHJlZSAoQ1NUKSAtLSBpdCdzIHZlcnlcbi8vIHNpbWlsYXIgdG8gYSBWaXNpdG9yIChodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Zpc2l0b3JfcGF0dGVybikuIEFuIG9wZXJhdGlvbiBpcyBleGVjdXRlZCBieVxuLy8gcmVjdXJzaXZlbHkgd2Fsa2luZyB0aGUgQ1NULCBhbmQgYXQgZWFjaCBub2RlLCBpbnZva2luZyB0aGUgbWF0Y2hpbmcgc2VtYW50aWMgYWN0aW9uIGZyb21cbi8vIGBhY3Rpb25EaWN0YC4gU2VlIGBPcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGVgIGZvciBkZXRhaWxzIG9mIGhvdyBhIENTVCBub2RlJ3MgbWF0Y2hpbmcgc2VtYW50aWNcbi8vIGFjdGlvbiBpcyBmb3VuZC5cbmZ1bmN0aW9uIE9wZXJhdGlvbihuYW1lLCBmb3JtYWxzLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmZvcm1hbHMgPSBmb3JtYWxzO1xuICB0aGlzLmFjdGlvbkRpY3QgPSBhY3Rpb25EaWN0O1xuICB0aGlzLmJ1aWx0SW5EZWZhdWx0ID0gYnVpbHRJbkRlZmF1bHQ7XG59XG5cbk9wZXJhdGlvbi5wcm90b3R5cGUudHlwZU5hbWUgPSAnb3BlcmF0aW9uJztcblxuT3BlcmF0aW9uLnByb3RvdHlwZS5jaGVja0FjdGlvbkRpY3QgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIGdyYW1tYXIuX2NoZWNrVG9wRG93bkFjdGlvbkRpY3QodGhpcy50eXBlTmFtZSwgdGhpcy5uYW1lLCB0aGlzLmFjdGlvbkRpY3QpO1xufTtcblxuLy8gRXhlY3V0ZSB0aGlzIG9wZXJhdGlvbiBvbiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIGBub2RlV3JhcHBlcmAgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGdpdmVuXG4vLyBTZW1hbnRpY3MgaW5zdGFuY2UuXG5PcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyKSB7XG4gIC8vIExvb2sgZm9yIGEgc2VtYW50aWMgYWN0aW9uIHdob3NlIG5hbWUgbWF0Y2hlcyB0aGUgbm9kZSdzIGNvbnN0cnVjdG9yIG5hbWUsIHdoaWNoIGlzIGVpdGhlciB0aGVcbiAgLy8gbmFtZSBvZiBhIHJ1bGUgaW4gdGhlIGdyYW1tYXIsIG9yICdfdGVybWluYWwnIChmb3IgYSB0ZXJtaW5hbCBub2RlKSwgb3IgJ19pdGVyJyAoZm9yIGFuXG4gIC8vIGl0ZXJhdGlvbiBub2RlKS4gSW4gdGhlIGxhdHRlciBjYXNlLCB0aGUgYWN0aW9uIGZ1bmN0aW9uIHJlY2VpdmVzIGEgc2luZ2xlIGFyZ3VtZW50LCB3aGljaCBpc1xuICAvLyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIENTVCBub2RlLlxuICB2YXIgYWN0aW9uRm4gPSB0aGlzLmFjdGlvbkRpY3Rbbm9kZVdyYXBwZXIuX25vZGUuY3Rvck5hbWVdO1xuICBpZiAoYWN0aW9uRm4pIHtcbiAgICByZXR1cm4gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25Gbiwgbm9kZVdyYXBwZXIuaXNJdGVyYXRpb24oKSk7XG4gIH1cblxuICAvLyBUaGUgYWN0aW9uIGRpY3Rpb25hcnkgZG9lcyBub3QgY29udGFpbiBhIHNlbWFudGljIGFjdGlvbiBmb3IgdGhpcyBzcGVjaWZpYyB0eXBlIG9mIG5vZGUuXG4gIC8vIElmIHRoaXMgaXMgYSBub250ZXJtaW5hbCBub2RlIGFuZCB0aGUgcHJvZ3JhbW1lciBoYXMgcHJvdmlkZWQgYSBgX25vbnRlcm1pbmFsYCBzZW1hbnRpY1xuICAvLyBhY3Rpb24sIHdlIGludm9rZSBpdDpcbiAgaWYgKG5vZGVXcmFwcGVyLmlzTm9udGVybWluYWwoKSkge1xuICAgIGFjdGlvbkZuID0gdGhpcy5hY3Rpb25EaWN0Ll9ub250ZXJtaW5hbDtcbiAgICBpZiAoYWN0aW9uRm4pIHtcbiAgICAgIHJldHVybiB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCB0cnVlKTtcbiAgICB9XG4gIH1cblxuICAvLyBPdGhlcndpc2UsIHdlIGludm9rZSB0aGUgJ19kZWZhdWx0JyBzZW1hbnRpYyBhY3Rpb24uXG4gIHJldHVybiB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIHRoaXMuYWN0aW9uRGljdC5fZGVmYXVsdCwgdHJ1ZSk7XG59O1xuXG4vLyBJbnZva2UgYGFjdGlvbkZuYCBvbiB0aGUgQ1NUIG5vZGUgdGhhdCBjb3JyZXNwb25kcyB0byBgbm9kZVdyYXBwZXJgLCBpbiB0aGUgY29udGV4dCBvZlxuLy8gYHNlbWFudGljc2AuIElmIGBvcHRQYXNzQ2hpbGRyZW5Bc0FycmF5YCBpcyB0cnV0aHksIGBhY3Rpb25GbmAgd2lsbCBiZSBjYWxsZWQgd2l0aCBhIHNpbmdsZVxuLy8gYXJndW1lbnQsIHdoaWNoIGlzIGFuIGFycmF5IG9mIHdyYXBwZXJzLiBPdGhlcndpc2UsIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGBhY3Rpb25GbmAgd2lsbFxuLy8gYmUgZXF1YWwgdG8gdGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGUgQ1NUIG5vZGUuXG5PcGVyYXRpb24ucHJvdG90eXBlLmRvQWN0aW9uID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkpIHtcbiAgcmV0dXJuIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkgP1xuICAgICAgYWN0aW9uRm4uY2FsbChub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpIDpcbiAgICAgIGFjdGlvbkZuLmFwcGx5KG5vZGVXcmFwcGVyLCBub2RlV3JhcHBlci5fY2hpbGRyZW4oKSk7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBBdHRyaWJ1dGUgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gQXR0cmlidXRlcyBhcmUgT3BlcmF0aW9ucyB3aG9zZSByZXN1bHRzIGFyZSBtZW1vaXplZC4gVGhpcyBtZWFucyB0aGF0LCBmb3IgYW55IGdpdmVuIHNlbWFudGljcyxcbi8vIHRoZSBzZW1hbnRpYyBhY3Rpb24gZm9yIGEgQ1NUIG5vZGUgd2lsbCBiZSBpbnZva2VkIG5vIG1vcmUgdGhhbiBvbmNlLlxuZnVuY3Rpb24gQXR0cmlidXRlKG5hbWUsIGFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuZm9ybWFscyA9IFtdO1xuICB0aGlzLmFjdGlvbkRpY3QgPSBhY3Rpb25EaWN0O1xuICB0aGlzLmJ1aWx0SW5EZWZhdWx0ID0gYnVpbHRJbkRlZmF1bHQ7XG59XG5pbmhlcml0cyhBdHRyaWJ1dGUsIE9wZXJhdGlvbik7XG5cbkF0dHJpYnV0ZS5wcm90b3R5cGUudHlwZU5hbWUgPSAnYXR0cmlidXRlJztcblxuQXR0cmlidXRlLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICB2YXIgbm9kZSA9IG5vZGVXcmFwcGVyLl9ub2RlO1xuICB2YXIga2V5ID0gc2VtYW50aWNzLmF0dHJpYnV0ZUtleXNbdGhpcy5uYW1lXTtcbiAgaWYgKCFub2RlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGEgc3VwZXItc2VuZCAtLSBpc24ndCBKUyBiZWF1dGlmdWw/IDovXG4gICAgbm9kZVtrZXldID0gT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlLmNhbGwodGhpcywgc2VtYW50aWNzLCBub2RlV3JhcHBlcik7XG4gIH1cbiAgcmV0dXJuIG5vZGVba2V5XTtcbn07XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbWFudGljcztcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGB0b1N0cmluZ2Agb3V0cHV0LlxudmFyIEJBTExPVF9YID0gJ1xcdTI3MTcnO1xudmFyIENIRUNLX01BUksgPSAnXFx1MjcxMyc7XG52YXIgRE9UX09QRVJBVE9SID0gJ1xcdTIyQzUnO1xudmFyIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XID0gJ1xcdTIxRDInO1xudmFyIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OID0gJ1xcdTI0MDknO1xudmFyIFNZTUJPTF9GT1JfTElORV9GRUVEID0gJ1xcdTI0MEEnO1xudmFyIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOID0gJ1xcdTI0MEQnO1xuXG5mdW5jdGlvbiBzcGFjZXMobikge1xuICByZXR1cm4gY29tbW9uLnJlcGVhdCgnICcsIG4pLmpvaW4oJycpO1xufVxuXG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBwb3J0aW9uIG9mIGBpbnB1dGAgYXQgb2Zmc2V0IGBwb3NgLlxuLy8gVGhlIHJlc3VsdCB3aWxsIGNvbnRhaW4gZXhhY3RseSBgbGVuYCBjaGFyYWN0ZXJzLlxuZnVuY3Rpb24gZ2V0SW5wdXRFeGNlcnB0KGlucHV0LCBwb3MsIGxlbikge1xuICB2YXIgZXhjZXJwdCA9IGFzRXNjYXBlZFN0cmluZyhpbnB1dC5zbGljZShwb3MsIHBvcyArIGxlbikpO1xuXG4gIC8vIFBhZCB0aGUgb3V0cHV0IGlmIG5lY2Vzc2FyeS5cbiAgaWYgKGV4Y2VycHQubGVuZ3RoIDwgbGVuKSB7XG4gICAgcmV0dXJuIGV4Y2VycHQgKyBjb21tb24ucmVwZWF0KCcgJywgbGVuIC0gZXhjZXJwdC5sZW5ndGgpLmpvaW4oJycpO1xuICB9XG4gIHJldHVybiBleGNlcnB0O1xufVxuXG5mdW5jdGlvbiBhc0VzY2FwZWRTdHJpbmcob2JqKSB7XG4gIGlmICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykge1xuICAgIC8vIFJlcGxhY2Ugbm9uLXByaW50YWJsZSBjaGFyYWN0ZXJzIHdpdGggdmlzaWJsZSBzeW1ib2xzLlxuICAgIHJldHVybiBvYmpcbiAgICAgICAgLnJlcGxhY2UoLyAvZywgRE9UX09QRVJBVE9SKVxuICAgICAgICAucmVwbGFjZSgvXFx0L2csIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OKVxuICAgICAgICAucmVwbGFjZSgvXFxuL2csIFNZTUJPTF9GT1JfTElORV9GRUVEKVxuICAgICAgICAucmVwbGFjZSgvXFxyL2csIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOKTtcbiAgfVxuICByZXR1cm4gU3RyaW5nKG9iaik7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFRyYWNlIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIFRyYWNlKGlucHV0LCBwb3MxLCBwb3MyLCBleHByLCBzdWNjZWVkZWQsIGJpbmRpbmdzLCBvcHRDaGlsZHJlbikge1xuICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gIHRoaXMucG9zID0gdGhpcy5wb3MxID0gcG9zMTtcbiAgdGhpcy5wb3MyID0gcG9zMjtcbiAgdGhpcy5zb3VyY2UgPSBuZXcgSW50ZXJ2YWwoaW5wdXQsIHBvczEsIHBvczIpO1xuICB0aGlzLmV4cHIgPSBleHByO1xuICB0aGlzLnN1Y2NlZWRlZCA9IHN1Y2NlZWRlZDtcbiAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICB0aGlzLmNoaWxkcmVuID0gb3B0Q2hpbGRyZW4gfHwgW107XG5cbiAgdGhpcy5pc0hlYWRPZkxlZnRSZWN1cnNpb24gPSBmYWxzZTsgIC8vIElzIHRoaXMgdGhlIG91dGVybW9zdCBMUiBhcHBsaWNhdGlvbj9cbiAgdGhpcy5pc0ltcGxpY2l0U3BhY2VzID0gZmFsc2U7XG4gIHRoaXMuaXNNZW1vaXplZCA9IGZhbHNlO1xuICB0aGlzLmlzUm9vdE5vZGUgPSBmYWxzZTtcbiAgdGhpcy50ZXJtaW5hdGVzTFIgPSBmYWxzZTtcbiAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkgPSBudWxsO1xufVxuXG4vLyBBIHZhbHVlIHRoYXQgY2FuIGJlIHJldHVybmVkIGZyb20gdmlzaXRvciBmdW5jdGlvbnMgdG8gaW5kaWNhdGUgdGhhdCBhXG4vLyBub2RlIHNob3VsZCBub3QgYmUgcmVjdXJzZWQgaW50by5cblRyYWNlLnByb3RvdHlwZS5TS0lQID0ge307XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFjZS5wcm90b3R5cGUsICdkaXNwbGF5U3RyaW5nJywge1xuICBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5leHByLnRvRGlzcGxheVN0cmluZygpOyB9XG59KTtcblxuVHJhY2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNsb25lV2l0aEV4cHIodGhpcy5leHByKTtcbn07XG5cblRyYWNlLnByb3RvdHlwZS5jbG9uZVdpdGhFeHByID0gZnVuY3Rpb24oZXhwcikge1xuICB2YXIgYW5zID0gbmV3IFRyYWNlKFxuICAgICAgdGhpcy5pbnB1dCwgdGhpcy5wb3MsIHRoaXMucG9zMiwgZXhwciwgdGhpcy5zdWNjZWVkZWQsIHRoaXMuYmluZGluZ3MsIHRoaXMuY2hpbGRyZW4pO1xuXG4gIGFucy5pc0hlYWRPZkxlZnRSZWN1cnNpb24gPSB0aGlzLmlzSGVhZE9mTGVmdFJlY3Vyc2lvbjtcbiAgYW5zLmlzSW1wbGljaXRTcGFjZXMgPSB0aGlzLmlzSW1wbGljaXRTcGFjZXM7XG4gIGFucy5pc01lbW9pemVkID0gdGhpcy5pc01lbW9pemVkO1xuICBhbnMuaXNSb290Tm9kZSA9IHRoaXMuaXNSb290Tm9kZTtcbiAgYW5zLnRlcm1pbmF0ZXNMUiA9IHRoaXMudGVybWluYXRlc0xSO1xuICBhbnMudGVybWluYXRpbmdMUkVudHJ5ID0gdGhpcy50ZXJtaW5hdGluZ0xSRW50cnk7XG4gIHJldHVybiBhbnM7XG59O1xuXG4vLyBSZWNvcmQgdGhlIHRyYWNlIGluZm9ybWF0aW9uIGZvciB0aGUgdGVybWluYXRpbmcgY29uZGl0aW9uIG9mIHRoZSBMUiBsb29wLlxuVHJhY2UucHJvdG90eXBlLnJlY29yZExSVGVybWluYXRpb24gPSBmdW5jdGlvbihydWxlQm9keVRyYWNlLCB2YWx1ZSkge1xuICB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeSA9XG4gICAgICBuZXcgVHJhY2UodGhpcy5pbnB1dCwgdGhpcy5wb3MsIHRoaXMucG9zMiwgdGhpcy5leHByLCBmYWxzZSwgW3ZhbHVlXSwgW3J1bGVCb2R5VHJhY2VdKTtcbiAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkudGVybWluYXRlc0xSID0gdHJ1ZTtcbn07XG5cbi8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoaXMgdHJhY2Ugbm9kZSBhbmQgYWxsIGl0cyBkZXNjZW5kZW50cywgY2FsbGluZyBhIHZpc2l0b3IgZnVuY3Rpb25cbi8vIGZvciBlYWNoIG5vZGUgdGhhdCBpcyB2aXNpdGVkLiBJZiBgdmlzdG9yT2JqT3JGbmAgaXMgYW4gb2JqZWN0LCB0aGVuIGl0cyAnZW50ZXInIHByb3BlcnR5XG4vLyBpcyBhIGZ1bmN0aW9uIHRvIGNhbGwgYmVmb3JlIHZpc2l0aW5nIHRoZSBjaGlsZHJlbiBvZiBhIG5vZGUsIGFuZCBpdHMgJ2V4aXQnIHByb3BlcnR5IGlzXG4vLyBhIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXJ3YXJkcy4gSWYgYHZpc2l0b3JPYmpPckZuYCBpcyBhIGZ1bmN0aW9uLCBpdCByZXByZXNlbnRzIHRoZSAnZW50ZXInXG4vLyBmdW5jdGlvbi5cbi8vXG4vLyBUaGUgZnVuY3Rpb25zIGFyZSBjYWxsZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBUcmFjZSBub2RlLCBpdHMgcGFyZW50IFRyYWNlLCBhbmQgYSBudW1iZXJcbi8vIHJlcHJlc2VudGluZyB0aGUgZGVwdGggb2YgdGhlIG5vZGUgaW4gdGhlIHRyZWUuIChUaGUgcm9vdCBub2RlIGhhcyBkZXB0aCAwLikgYG9wdFRoaXNBcmdgLCBpZlxuLy8gc3BlY2lmaWVkLCBpcyB0aGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2Agd2hlbiBleGVjdXRpbmcgdGhlIHZpc2l0b3IgZnVuY3Rpb25zLlxuVHJhY2UucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbih2aXNpdG9yT2JqT3JGbiwgb3B0VGhpc0FyZykge1xuICB2YXIgdmlzaXRvciA9IHZpc2l0b3JPYmpPckZuO1xuICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2aXNpdG9yID0ge2VudGVyOiB2aXNpdG9yfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF93YWxrKG5vZGUsIHBhcmVudCwgZGVwdGgpIHtcbiAgICB2YXIgcmVjdXJzZSA9IHRydWU7XG4gICAgaWYgKHZpc2l0b3IuZW50ZXIpIHtcbiAgICAgIGlmICh2aXNpdG9yLmVudGVyLmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCkgPT09IFRyYWNlLnByb3RvdHlwZS5TS0lQKSB7XG4gICAgICAgIHJlY3Vyc2UgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlY3Vyc2UpIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBfd2FsayhjaGlsZCwgbm9kZSwgZGVwdGggKyAxKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHZpc2l0b3IuZXhpdCkge1xuICAgICAgICB2aXNpdG9yLmV4aXQuY2FsbChvcHRUaGlzQXJnLCBub2RlLCBwYXJlbnQsIGRlcHRoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHRoaXMuaXNSb290Tm9kZSkge1xuICAgIC8vIERvbid0IHZpc2l0IHRoZSByb290IG5vZGUgaXRzZWxmLCBvbmx5IGl0cyBjaGlsZHJlbi5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oYykgeyBfd2FsayhjLCBudWxsLCAwKTsgfSk7XG4gIH0gZWxzZSB7XG4gICAgX3dhbGsodGhpcywgbnVsbCwgMCk7XG4gIH1cbn07XG5cbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhY2UuXG4vLyBTYW1wbGU6XG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzIOKckyBleHAg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICDinJMgYWRkRXhwIChMUikg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICAgICAg4pyXIGFkZEV4cF9wbHVzXG5UcmFjZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgdGhpcy53YWxrKGZ1bmN0aW9uKG5vZGUsIHBhcmVudCwgZGVwdGgpIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgIHJldHVybiB0aGlzLlNLSVA7XG4gICAgfVxuICAgIHZhciBjdG9yTmFtZSA9IG5vZGUuZXhwci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIC8vIERvbid0IHByaW50IGFueXRoaW5nIGZvciBBbHQgbm9kZXMuXG4gICAgaWYgKGN0b3JOYW1lID09PSAnQWx0Jykge1xuICAgICAgcmV0dXJuOyAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgIH1cbiAgICBzYi5hcHBlbmQoZ2V0SW5wdXRFeGNlcnB0KG5vZGUuaW5wdXQsIG5vZGUucG9zLCAxMCkgKyBzcGFjZXMoZGVwdGggKiAyICsgMSkpO1xuICAgIHNiLmFwcGVuZCgobm9kZS5zdWNjZWVkZWQgPyBDSEVDS19NQVJLIDogQkFMTE9UX1gpICsgJyAnICsgbm9kZS5kaXNwbGF5U3RyaW5nKTtcbiAgICBpZiAobm9kZS5pc0hlYWRPZkxlZnRSZWN1cnNpb24pIHtcbiAgICAgIHNiLmFwcGVuZCgnIChMUiknKTtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3VjY2VlZGVkKSB7XG4gICAgICB2YXIgY29udGVudHMgPSBhc0VzY2FwZWRTdHJpbmcobm9kZS5zb3VyY2UuY29udGVudHMpO1xuICAgICAgc2IuYXBwZW5kKCcgJyArIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XICsgJyAgJyk7XG4gICAgICBzYi5hcHBlbmQodHlwZW9mIGNvbnRlbnRzID09PSAnc3RyaW5nJyA/ICdcIicgKyBjb250ZW50cyArICdcIicgOiBjb250ZW50cyk7XG4gICAgfVxuICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gIH0uYmluZCh0aGlzKSk7XG4gIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2U7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEhlbHBlcnNcblxudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9O1xuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKykge1xuICBlc2NhcGVTdHJpbmdGb3JbY10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xufVxuZXNjYXBlU3RyaW5nRm9yW1wiJ1wiLmNoYXJDb2RlQXQoMCldID0gXCJcXFxcJ1wiO1xuZXNjYXBlU3RyaW5nRm9yWydcIicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXFwiJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxcXCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXFxcXFwnO1xuZXNjYXBlU3RyaW5nRm9yWydcXGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxiJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxmJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcZic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcbicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXG4nO1xuZXNjYXBlU3RyaW5nRm9yWydcXHInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxyJztcbmVzY2FwZVN0cmluZ0ZvclsnXFx0Jy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdCc7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcdTAwMGInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx2JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuYWJzdHJhY3QgPSBmdW5jdGlvbihvcHRNZXRob2ROYW1lKSB7XG4gIHZhciBtZXRob2ROYW1lID0gb3B0TWV0aG9kTmFtZSB8fCAnJztcbiAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICd0aGlzIG1ldGhvZCAnICsgbWV0aG9kTmFtZSArICcgaXMgYWJzdHJhY3QhICcgK1xuICAgICAgJyhpdCBoYXMgbm8gaW1wbGVtZW50YXRpb24gaW4gY2xhc3MgJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICcpJyk7XG4gIH07XG59O1xuXG5leHBvcnRzLmFzc2VydCA9IGZ1bmN0aW9uKGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59O1xuXG4vLyBEZWZpbmUgYSBsYXppbHktY29tcHV0ZWQsIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVkIGBwcm9wTmFtZWBcbi8vIG9uIHRoZSBvYmplY3QgYG9iamAuIGBnZXR0ZXJGbmAgd2lsbCBiZSBjYWxsZWQgdG8gY29tcHV0ZSB0aGUgdmFsdWUgdGhlXG4vLyBmaXJzdCB0aW1lIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC5cbmV4cG9ydHMuZGVmaW5lTGF6eVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqLCBwcm9wTmFtZSwgZ2V0dGVyRm4pIHtcbiAgdmFyIG1lbW87XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghbWVtbykge1xuICAgICAgICBtZW1vID0gZ2V0dGVyRm4uY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtZW1vO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24ob2JqKSB7XG4gIGlmIChvYmopIHtcbiAgICByZXR1cm4gZXh0ZW5kKHt9LCBvYmopO1xuICB9XG4gIHJldHVybiBvYmo7XG59O1xuXG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcblxuZXhwb3J0cy5yZXBlYXRGbiA9IGZ1bmN0aW9uKGZuLCBuKSB7XG4gIHZhciBhcnIgPSBbXTtcbiAgd2hpbGUgKG4tLSA+IDApIHtcbiAgICBhcnIucHVzaChmbigpKTtcbiAgfVxuICByZXR1cm4gYXJyO1xufTtcblxuZXhwb3J0cy5yZXBlYXRTdHIgPSBmdW5jdGlvbihzdHIsIG4pIHtcbiAgcmV0dXJuIG5ldyBBcnJheShuICsgMSkuam9pbihzdHIpO1xufTtcblxuZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbih4LCBuKSB7XG4gIHJldHVybiBleHBvcnRzLnJlcGVhdEZuKGZ1bmN0aW9uKCkgeyByZXR1cm4geDsgfSwgbik7XG59O1xuXG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbihhcnJheSkge1xuICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcnJheS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuXG5leHBvcnRzLmNvcHlXaXRob3V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gIHZhciBub0R1cGxpY2F0ZXMgPSBbXTtcbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIGlmIChub0R1cGxpY2F0ZXMuaW5kZXhPZihlbnRyeSkgPCAwKSB7XG4gICAgICBub0R1cGxpY2F0ZXMucHVzaChlbnRyeSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG5vRHVwbGljYXRlcztcbn07XG5cbmV4cG9ydHMuaXNTeW50YWN0aWMgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB2YXIgZmlyc3RDaGFyID0gcnVsZU5hbWVbMF07XG4gIHJldHVybiBmaXJzdENoYXIgPT09IGZpcnN0Q2hhci50b1VwcGVyQ2FzZSgpO1xufTtcblxuZXhwb3J0cy5pc0xleGljYWwgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICByZXR1cm4gIWV4cG9ydHMuaXNTeW50YWN0aWMocnVsZU5hbWUpO1xufTtcblxuZXhwb3J0cy5wYWRMZWZ0ID0gZnVuY3Rpb24oc3RyLCBsZW4sIG9wdENoYXIpIHtcbiAgdmFyIGNoID0gb3B0Q2hhciB8fCAnICc7XG4gIGlmIChzdHIubGVuZ3RoIDwgbGVuKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMucmVwZWF0U3RyKGNoLCBsZW4gLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuLy8gU3RyaW5nQnVmZmVyXG5cbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuc3RyaW5ncyA9IFtdO1xufTtcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uKHN0cikge1xuICB0aGlzLnN0cmluZ3MucHVzaChzdHIpO1xufTtcblxuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmNvbnRlbnRzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnN0cmluZ3Muam9pbignJyk7XG59O1xuXG4vLyBDaGFyYWN0ZXIgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmdcblxuZXhwb3J0cy5lc2NhcGVDaGFyID0gZnVuY3Rpb24oYywgb3B0RGVsaW0pIHtcbiAgdmFyIGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApO1xuICBpZiAoKGMgPT09ICdcIicgfHwgYyA9PT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKSB7XG4gICAgcmV0dXJuIGM7XG4gIH0gZWxzZSBpZiAoY2hhckNvZGUgPCAxMjgpIHtcbiAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXTtcbiAgfSBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpIHtcbiAgICByZXR1cm4gJ1xcXFx4JyArIGV4cG9ydHMucGFkTGVmdChjaGFyQ29kZS50b1N0cmluZygxNiksIDIsICcwJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICdcXFxcdScgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCA0LCAnMCcpO1xuICB9XG59O1xuXG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uKHMpIHtcbiAgaWYgKHMuY2hhckF0KDApID09PSAnXFxcXCcpIHtcbiAgICBzd2l0Y2ggKHMuY2hhckF0KDEpKSB7XG4gICAgICBjYXNlICdiJzogcmV0dXJuICdcXGInO1xuICAgICAgY2FzZSAnZic6IHJldHVybiAnXFxmJztcbiAgICAgIGNhc2UgJ24nOiByZXR1cm4gJ1xcbic7XG4gICAgICBjYXNlICdyJzogcmV0dXJuICdcXHInO1xuICAgICAgY2FzZSAndCc6IHJldHVybiAnXFx0JztcbiAgICAgIGNhc2UgJ3YnOiByZXR1cm4gJ1xcdic7XG4gICAgICBjYXNlICd4JzogcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNCksIDE2KSk7XG4gICAgICBjYXNlICd1JzogcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSk7XG4gICAgICBkZWZhdWx0OiByZXR1cm4gcy5jaGFyQXQoMSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59O1xuXG4vLyBIZWxwZXIgZm9yIHByb2R1Y2luZyBhIGRlc2NyaXB0aW9uIG9mIGFuIHVua25vd24gb2JqZWN0IGluIGEgc2FmZSB3YXkuXG4vLyBFc3BlY2lhbGx5IHVzZWZ1bCBmb3IgZXJyb3IgbWVzc2FnZXMgd2hlcmUgYW4gdW5leHBlY3RlZCB0eXBlIG9mIG9iamVjdCB3YXMgZW5jb3VudGVyZWQuXG5leHBvcnRzLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyA9IGZ1bmN0aW9uKG9iaikge1xuICBpZiAob2JqID09IG51bGwpIHtcbiAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gIH1cbiAgdmFyIGJhc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICB0cnkge1xuICAgIHZhciB0eXBlTmFtZTtcbiAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICB0eXBlTmFtZSA9IG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIH0gZWxzZSBpZiAoYmFzZVRvU3RyaW5nLmluZGV4T2YoJ1tvYmplY3QgJykgPT09IDApIHtcbiAgICAgIHR5cGVOYW1lID0gYmFzZVRvU3RyaW5nLnNsaWNlKDgsIC0xKTsgIC8vIEV4dHJhY3QgZS5nLiBcIkFycmF5XCIgZnJvbSBcIltvYmplY3QgQXJyYXldXCIuXG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVOYW1lID0gdHlwZW9mIG9iajtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVOYW1lICsgJzogJyArIEpTT04uc3RyaW5naWZ5KFN0cmluZyhvYmopKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBiYXNlVG9TdHJpbmc7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdEludGVydmFsKSB7XG4gIHZhciBlO1xuICBpZiAob3B0SW50ZXJ2YWwpIHtcbiAgICBlID0gbmV3IEVycm9yKG9wdEludGVydmFsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKCkgKyBtZXNzYWdlKTtcbiAgICBlLnNob3J0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgZS5pbnRlcnZhbCA9IG9wdEludGVydmFsO1xuICB9IGVsc2Uge1xuICAgIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH1cbiAgcmV0dXJuIGU7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBpbnRlcnZhbHMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXCJJbnRlcnZhbCBzb3VyY2VzIGRvbid0IG1hdGNoXCIpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgZ3JhbW1hcnMgLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gR3JhbW1hciBzeW50YXggZXJyb3JcblxuZnVuY3Rpb24gZ3JhbW1hclN5bnRheEVycm9yKG1hdGNoRmFpbHVyZSkge1xuICB2YXIgZSA9IG5ldyBFcnJvcigpO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ21lc3NhZ2UnLCB7Z2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1hdGNoRmFpbHVyZS5tZXNzYWdlOyB9fSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCAnc2hvcnRNZXNzYWdlJywge2dldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdFeHBlY3RlZCAnICsgbWF0Y2hGYWlsdXJlLmdldEV4cGVjdGVkVGV4dCgpO1xuICB9fSk7XG4gIGUuaW50ZXJ2YWwgPSBtYXRjaEZhaWx1cmUuZ2V0SW50ZXJ2YWwoKTtcbiAgcmV0dXJuIGU7XG59XG5cbi8vIFVuZGVjbGFyZWQgZ3JhbW1hclxuXG5mdW5jdGlvbiB1bmRlY2xhcmVkR3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBpbnRlcnZhbCkge1xuICB2YXIgbWVzc2FnZSA9IG5hbWVzcGFjZSA/XG4gICAgICAnR3JhbW1hciAnICsgZ3JhbW1hck5hbWUgKyAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyhuYW1lc3BhY2UpIDpcbiAgICAgICdVbmRlY2xhcmVkIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lO1xuICByZXR1cm4gY3JlYXRlRXJyb3IobWVzc2FnZSwgaW50ZXJ2YWwpO1xufVxuXG4vLyBEdXBsaWNhdGUgZ3JhbW1hciBkZWNsYXJhdGlvblxuXG5mdW5jdGlvbiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZ3JhbW1hciwgbmFtZXNwYWNlKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcignR3JhbW1hciAnICsgZ3JhbW1hci5uYW1lICsgJyBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIHRoaXMgbmFtZXNwYWNlJyk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHJ1bGVzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFVuZGVjbGFyZWQgcnVsZVxuXG5mdW5jdGlvbiB1bmRlY2xhcmVkUnVsZShydWxlTmFtZSwgZ3JhbW1hck5hbWUsIG9wdEludGVydmFsKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdSdWxlICcgKyBydWxlTmFtZSArICcgaXMgbm90IGRlY2xhcmVkIGluIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lLFxuICAgICAgb3B0SW50ZXJ2YWwpO1xufVxuXG4vLyBDYW5ub3Qgb3ZlcnJpZGUgdW5kZWNsYXJlZCBydWxlXG5cbmZ1bmN0aW9uIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0Nhbm5vdCBvdmVycmlkZSBydWxlICcgKyBydWxlTmFtZSArICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIGdyYW1tYXJOYW1lLFxuICAgICAgb3B0U291cmNlKTtcbn1cblxuLy8gQ2Fubm90IGV4dGVuZCB1bmRlY2xhcmVkIHJ1bGVcblxuZnVuY3Rpb24gY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0Nhbm5vdCBleHRlbmQgcnVsZSAnICsgcnVsZU5hbWUgKyAnIGJlY2F1c2UgaXQgaXMgbm90IGRlY2xhcmVkIGluICcgKyBncmFtbWFyTmFtZSxcbiAgICAgIG9wdFNvdXJjZSk7XG59XG5cbi8vIER1cGxpY2F0ZSBydWxlIGRlY2xhcmF0aW9uXG5cbmZ1bmN0aW9uIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUsIGRlY2xHcmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gIHZhciBtZXNzYWdlID0gXCJEdXBsaWNhdGUgZGVjbGFyYXRpb24gZm9yIHJ1bGUgJ1wiICsgcnVsZU5hbWUgK1xuICAgICAgXCInIGluIGdyYW1tYXIgJ1wiICsgZ3JhbW1hck5hbWUgKyBcIidcIjtcbiAgaWYgKGdyYW1tYXJOYW1lICE9PSBkZWNsR3JhbW1hck5hbWUpIHtcbiAgICBtZXNzYWdlICs9IFwiIChvcmlnaW5hbGx5IGRlY2xhcmVkIGluICdcIiArIGRlY2xHcmFtbWFyTmFtZSArIFwiJylcIjtcbiAgfVxuICByZXR1cm4gY3JlYXRlRXJyb3IobWVzc2FnZSwgb3B0U291cmNlKTtcbn1cblxuLy8gV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnNcblxuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHNvdXJjZSkge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnMgZm9yIHJ1bGUgJyArIHJ1bGVOYW1lICtcbiAgICAgICAgICAnIChleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCArICcpJyxcbiAgICAgIHNvdXJjZSk7XG59XG5cbi8vIFdyb25nIG51bWJlciBvZiBhcmd1bWVudHNcblxuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyhydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgZXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgcnVsZSAnICsgcnVsZU5hbWUgK1xuICAgICAgICAgICcgKGV4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsICsgJyknLFxuICAgICAgZXhwci5zb3VyY2UpO1xufVxuXG4vLyBEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzXG5cbmZ1bmN0aW9uIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKHJ1bGVOYW1lLCBkdXBsaWNhdGVzLCBzb3VyY2UpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ0R1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZXMgaW4gcnVsZSAnICsgcnVsZU5hbWUgKyAnOiAnICsgZHVwbGljYXRlcy5qb2luKCcsICcpLFxuICAgICAgc291cmNlKTtcbn1cblxuLy8gSW52YWxpZCBwYXJhbWV0ZXIgZXhwcmVzc2lvblxuXG5mdW5jdGlvbiBpbnZhbGlkUGFyYW1ldGVyKHJ1bGVOYW1lLCBleHByKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcihcbiAgICAgICdJbnZhbGlkIHBhcmFtZXRlciB0byBydWxlICcgKyBydWxlTmFtZSArICc6ICcgKyBleHByICsgJyBoYXMgYXJpdHkgJyArIGV4cHIuZ2V0QXJpdHkoKSArXG4gICAgICAgICAnLCBidXQgcGFyYW1ldGVyIGV4cHJlc3Npb25zIG11c3QgaGF2ZSBhcml0eSAxJyxcbiAgICAgIGV4cHIuc291cmNlKTtcbn1cblxuLy8gQXBwbGljYXRpb24gb2Ygc3ludGFjdGljIHJ1bGUgZnJvbSBsZXhpY2FsIHJ1bGVcblxuZnVuY3Rpb24gYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQocnVsZU5hbWUsIGFwcGx5RXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnQ2Fubm90IGFwcGx5IHN5bnRhY3RpYyBydWxlICcgKyBydWxlTmFtZSArICcgZnJvbSBoZXJlIChpbnNpZGUgYSBsZXhpY2FsIGNvbnRleHQpJyxcbiAgICAgIGFwcGx5RXhwci5zb3VyY2UpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBLbGVlbmUgb3BlcmF0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQoa2xlZW5lRXhwcikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnTnVsbGFibGUgZXhwcmVzc2lvbiAnICsga2xlZW5lRXhwci5leHByLnNvdXJjZS5jb250ZW50cyArIFwiIGlzIG5vdCBhbGxvd2VkIGluc2lkZSAnXCIgK1xuICAgICAgICAgIGtsZWVuZUV4cHIub3BlcmF0b3IgKyBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCIsXG4gICAgICBrbGVlbmVFeHByLmV4cHIuc291cmNlKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gYXJpdHkgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgJ1J1bGUgJyArIHJ1bGVOYW1lICsgJyBpbnZvbHZlcyBhbiBhbHRlcm5hdGlvbiB3aGljaCBoYXMgaW5jb25zaXN0ZW50IGFyaXR5ICcgK1xuICAgICAgICAgICcoZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwgKyAnKScsXG4gICAgICBleHByLnNvdXJjZSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHByb3BlcnRpZXMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gZHVwbGljYXRlUHJvcGVydHlOYW1lcyhkdXBsaWNhdGVzKSB7XG4gIHJldHVybiBjcmVhdGVFcnJvcignT2JqZWN0IHBhdHRlcm4gaGFzIGR1cGxpY2F0ZSBwcm9wZXJ0eSBuYW1lczogJyArIGR1cGxpY2F0ZXMuam9pbignLCAnKSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbnZhbGlkQ29uc3RydWN0b3JDYWxsKGdyYW1tYXIsIGN0b3JOYW1lLCBjaGlsZHJlbikge1xuICByZXR1cm4gY3JlYXRlRXJyb3IoXG4gICAgICAnQXR0ZW1wdCB0byBpbnZva2UgY29uc3RydWN0b3IgJyArIGN0b3JOYW1lICsgJyB3aXRoIGludmFsaWQgb3IgdW5leHBlY3RlZCBhcmd1bWVudHMnKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gY29udmVuaWVuY2UgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gbXVsdGlwbGVFcnJvcnMoZXJyb3JzKSB7XG4gIHZhciBtZXNzYWdlcyA9IGVycm9ycy5tYXAoZnVuY3Rpb24oZSkgeyByZXR1cm4gZS5tZXNzYWdlOyB9KTtcbiAgcmV0dXJuIGNyZWF0ZUVycm9yKFxuICAgICAgWydFcnJvcnM6J10uY29uY2F0KG1lc3NhZ2VzKS5qb2luKCdcXG4tICcpLFxuICAgICAgZXJyb3JzWzBdLmludGVydmFsKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gc2VtYW50aWMgLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gbWlzc2luZ1NlbWFudGljQWN0aW9uKGN0b3JOYW1lLCBuYW1lLCB0eXBlKSB7XG4gIHZhciBlID0gY3JlYXRlRXJyb3IoXG4gICAgICAnTWlzc2luZyBzZW1hbnRpYyBhY3Rpb24gZm9yICcgKyBjdG9yTmFtZSArICcgaW4gJyArIG5hbWUgKyAnICcgKyB0eXBlKTtcbiAgZS5uYW1lID0gJ21pc3NpbmdTZW1hbnRpY0FjdGlvbic7XG4gIHJldHVybiBlO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0OiBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCxcbiAgY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlLFxuICBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlOiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlLFxuICBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb246IGR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbixcbiAgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXM6IGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLFxuICBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzOiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzLFxuICBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb246IGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbixcbiAgaW5jb25zaXN0ZW50QXJpdHk6IGluY29uc2lzdGVudEFyaXR5LFxuICBpbnRlcnZhbFNvdXJjZXNEb250TWF0Y2g6IGludGVydmFsU291cmNlc0RvbnRNYXRjaCxcbiAgaW52YWxpZENvbnN0cnVjdG9yQ2FsbDogaW52YWxpZENvbnN0cnVjdG9yQ2FsbCxcbiAgaW52YWxpZFBhcmFtZXRlcjogaW52YWxpZFBhcmFtZXRlcixcbiAgZ3JhbW1hclN5bnRheEVycm9yOiBncmFtbWFyU3ludGF4RXJyb3IsXG4gIGtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQ6IGtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQsXG4gIG1pc3NpbmdTZW1hbnRpY0FjdGlvbjogbWlzc2luZ1NlbWFudGljQWN0aW9uLFxuICB1bmRlY2xhcmVkR3JhbW1hcjogdW5kZWNsYXJlZEdyYW1tYXIsXG4gIHVuZGVjbGFyZWRSdWxlOiB1bmRlY2xhcmVkUnVsZSxcbiAgd3JvbmdOdW1iZXJPZkFyZ3VtZW50czogd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyxcbiAgd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnM6IHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzLFxuXG4gIHRocm93RXJyb3JzOiBmdW5jdGlvbihlcnJvcnMpIHtcbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdGhyb3cgZXJyb3JzWzBdO1xuICAgIH1cbiAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRocm93IG11bHRpcGxlRXJyb3JzKGVycm9ycyk7XG4gICAgfVxuICB9XG59O1xuIiwiLyogZ2xvYmFsIGRvY3VtZW50LCBYTUxIdHRwUmVxdWVzdCAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgQnVpbGRlciA9IHJlcXVpcmUoJy4vQnVpbGRlcicpO1xudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuL0dyYW1tYXInKTtcbnZhciBOYW1lc3BhY2UgPSByZXF1aXJlKCcuL05hbWVzcGFjZScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBUaGUgbWV0YWdyYW1tYXIsIGkuZS4gdGhlIGdyYW1tYXIgZm9yIE9obSBncmFtbWFycy4gSW5pdGlhbGl6ZWQgYXQgdGhlXG4vLyBib3R0b20gb2YgdGhpcyBmaWxlIGJlY2F1c2UgbG9hZGluZyB0aGUgZ3JhbW1hciByZXF1aXJlcyBPaG0gaXRzZWxmLlxudmFyIG9obUdyYW1tYXI7XG5cbi8vIEFuIG9iamVjdCB3aGljaCBtYWtlcyBpdCBwb3NzaWJsZSB0byBzdHViIG91dCB0aGUgZG9jdW1lbnQgQVBJIGZvciB0ZXN0aW5nLlxudmFyIGRvY3VtZW50SW50ZXJmYWNlID0ge1xuICBxdWVyeVNlbGVjdG9yOiBmdW5jdGlvbihzZWwpIHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKTsgfSxcbiAgcXVlcnlTZWxlY3RvckFsbDogZnVuY3Rpb24oc2VsKSB7IHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCk7IH1cbn07XG5cbi8vIENoZWNrIGlmIGBvYmpgIGlzIGEgRE9NIGVsZW1lbnQuXG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqKSB7XG4gIHJldHVybiAhIShvYmogJiYgb2JqLm5vZGVUeXBlID09PSAxKTtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gIHJldHVybiBvYmogPT09IHZvaWQgMDsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdm9pZFxufVxuXG52YXIgTUFYX0FSUkFZX0lOREVYID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcblxuZnVuY3Rpb24gaXNBcnJheUxpa2Uob2JqKSB7XG4gIGlmIChvYmogPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG59XG5cbi8vIFRPRE86IGp1c3QgdXNlIHRoZSBqUXVlcnkgdGhpbmdcbmZ1bmN0aW9uIGxvYWQodXJsKSB7XG4gIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxLm9wZW4oJ0dFVCcsIHVybCwgZmFsc2UpO1xuICB0cnkge1xuICAgIHJlcS5zZW5kKCk7XG4gICAgaWYgKHJlcS5zdGF0dXMgPT09IDAgfHwgcmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICByZXR1cm4gcmVxLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHt9XG4gIHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvYWQgdXJsICcgKyB1cmwpO1xufVxuXG4vLyBSZXR1cm5zIGEgR3JhbW1hciBpbnN0YW5jZSAoaS5lLiwgYW4gb2JqZWN0IHdpdGggYSBgbWF0Y2hgIG1ldGhvZCkgZm9yXG4vLyBgdHJlZWAsIHdoaWNoIGlzIHRoZSBjb25jcmV0ZSBzeW50YXggdHJlZSBvZiBhIHVzZXItd3JpdHRlbiBncmFtbWFyLlxuLy8gVGhlIGdyYW1tYXIgd2lsbCBiZSBhc3NpZ25lZCBpbnRvIGBuYW1lc3BhY2VgIHVuZGVyIHRoZSBuYW1lIG9mIHRoZSBncmFtbWFyXG4vLyBhcyBzcGVjaWZpZWQgaW4gdGhlIHNvdXJjZS5cbmZ1bmN0aW9uIGJ1aWxkR3JhbW1hcihtYXRjaCwgbmFtZXNwYWNlLCBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZykge1xuICB2YXIgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gIHZhciBkZWNsO1xuICB2YXIgY3VycmVudFJ1bGVOYW1lO1xuICB2YXIgY3VycmVudFJ1bGVGb3JtYWxzO1xuICB2YXIgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICB2YXIgbWV0YUdyYW1tYXIgPSBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZyB8fCBvaG1HcmFtbWFyO1xuXG4gIC8vIEEgdmlzaXRvciB0aGF0IHByb2R1Y2VzIGEgR3JhbW1hciBpbnN0YW5jZSBmcm9tIHRoZSBDU1QuXG4gIHZhciBoZWxwZXJzID0gbWV0YUdyYW1tYXIuY3JlYXRlU2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCd2aXNpdCcsIHtcbiAgICBHcmFtbWFyOiBmdW5jdGlvbihuLCBzLCBvcGVuLCBycywgY2xvc2UpIHtcbiAgICAgIHZhciBncmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGRlY2wgPSBidWlsZGVyLm5ld0dyYW1tYXIoZ3JhbW1hck5hbWUsIG5hbWVzcGFjZSk7XG4gICAgICBzLnZpc2l0KCk7XG4gICAgICBycy52aXNpdCgpO1xuICAgICAgdmFyIGcgPSBkZWNsLmJ1aWxkKCk7XG4gICAgICBnLnNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgIGlmIChncmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbihnLCBuYW1lc3BhY2UpO1xuICAgICAgfVxuICAgICAgbmFtZXNwYWNlW2dyYW1tYXJOYW1lXSA9IGc7XG4gICAgICByZXR1cm4gZztcbiAgICB9LFxuXG4gICAgU3VwZXJHcmFtbWFyOiBmdW5jdGlvbihfLCBuKSB7XG4gICAgICB2YXIgc3VwZXJHcmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGlmIChzdXBlckdyYW1tYXJOYW1lID09PSAnbnVsbCcpIHtcbiAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFuYW1lc3BhY2UgfHwgIShzdXBlckdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkpIHtcbiAgICAgICAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZEdyYW1tYXIoc3VwZXJHcmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBuLnNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG5hbWVzcGFjZVtzdXBlckdyYW1tYXJOYW1lXSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIFJ1bGVfZGVmaW5lOiBmdW5jdGlvbihuLCBmcywgZCwgXywgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZSB5ZXQsIHNldCBpdCBub3cuIFRoaXMgbXVzdCBiZSBkb25lIGJlZm9yZSB2aXNpdGluZ1xuICAgICAgLy8gdGhlIGJvZHksIGJlY2F1c2UgaXQgbWlnaHQgY29udGFpbiBhbiBpbmxpbmUgcnVsZSBkZWZpbml0aW9uLlxuICAgICAgaWYgKCFkZWNsLmRlZmF1bHRTdGFydFJ1bGUgJiYgZGVjbC5lbnN1cmVTdXBlckdyYW1tYXIoKSAhPT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcykge1xuICAgICAgICBkZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGN1cnJlbnRSdWxlTmFtZSk7XG4gICAgICB9XG4gICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgIHZhciBkZXNjcmlwdGlvbiA9IGQudmlzaXQoKVswXTtcbiAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltbWVkKCk7XG4gICAgICByZXR1cm4gZGVjbC5kZWZpbmUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpO1xuICAgIH0sXG4gICAgUnVsZV9vdmVycmlkZTogZnVuY3Rpb24obiwgZnMsIF8sIGIpIHtcbiAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLnZpc2l0KClbMF0gfHwgW107XG4gICAgICBvdmVycmlkaW5nID0gdHJ1ZTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgIHZhciBhbnMgPSBkZWNsLm92ZXJyaWRlKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuICAgIFJ1bGVfZXh0ZW5kOiBmdW5jdGlvbihuLCBmcywgXywgYikge1xuICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgIHZhciBhbnMgPSBkZWNsLmV4dGVuZChjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBSdWxlQm9keTogZnVuY3Rpb24oXywgdGVybXMpIHtcbiAgICAgIHZhciBhcmdzID0gdGVybXMudmlzaXQoKTtcbiAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuXG4gICAgRm9ybWFsczogZnVuY3Rpb24ob3BvaW50eSwgZnMsIGNwb2ludHkpIHtcbiAgICAgIHJldHVybiBmcy52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBQYXJhbXM6IGZ1bmN0aW9uKG9wb2ludHksIHBzLCBjcG9pbnR5KSB7XG4gICAgICByZXR1cm4gcHMudmlzaXQoKTtcbiAgICB9LFxuXG4gICAgQWx0OiBmdW5jdGlvbihzZXFzKSB7XG4gICAgICB2YXIgYXJncyA9IHNlcXMudmlzaXQoKTtcbiAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuXG4gICAgVG9wTGV2ZWxUZXJtX2lubGluZTogZnVuY3Rpb24oYiwgbikge1xuICAgICAgdmFyIGlubGluZVJ1bGVOYW1lID0gY3VycmVudFJ1bGVOYW1lICsgJ18nICsgbi52aXNpdCgpO1xuICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgdmFyIGlzTmV3UnVsZURlY2xhcmF0aW9uID1cbiAgICAgICAgICAhKGRlY2wuc3VwZXJHcmFtbWFyICYmIGRlY2wuc3VwZXJHcmFtbWFyLnJ1bGVzW2lubGluZVJ1bGVOYW1lXSk7XG4gICAgICBpZiAob3ZlcnJpZGluZyAmJiAhaXNOZXdSdWxlRGVjbGFyYXRpb24pIHtcbiAgICAgICAgZGVjbC5vdmVycmlkZShpbmxpbmVSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVjbC5kZWZpbmUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBwYXJhbXMgPSBjdXJyZW50UnVsZUZvcm1hbHMubWFwKGZ1bmN0aW9uKGZvcm1hbCkgeyByZXR1cm4gYnVpbGRlci5hcHAoZm9ybWFsKTsgfSk7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcHAoaW5saW5lUnVsZU5hbWUsIHBhcmFtcykud2l0aFNvdXJjZShib2R5LnNvdXJjZSk7XG4gICAgfSxcblxuICAgIFNlcTogZnVuY3Rpb24oZXhwcikge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuc2VxLmFwcGx5KGJ1aWxkZXIsIGV4cHIudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIEl0ZXJfc3RhcjogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIuc3Rhcih4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG4gICAgSXRlcl9wbHVzOiBmdW5jdGlvbih4LCBfKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5wbHVzKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcbiAgICBJdGVyX29wdDogZnVuY3Rpb24oeCwgXykge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIub3B0KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIFByZWRfbm90OiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5ub3QoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuICAgIFByZWRfbG9va2FoZWFkOiBmdW5jdGlvbihfLCB4KSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5sb29rYWhlYWQoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuXG4gICAgTGV4X2xleDogZnVuY3Rpb24oXywgeCkge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIubGV4KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfSxcblxuICAgIEJhc2VfYXBwbGljYXRpb246IGZ1bmN0aW9uKHJ1bGUsIHBzKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5hcHAocnVsZS52aXNpdCgpLCBwcy52aXNpdCgpWzBdIHx8IFtdKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuICAgIEJhc2VfcmFuZ2U6IGZ1bmN0aW9uKGZyb20sIF8sIHRvKSB7XG4gICAgICByZXR1cm4gYnVpbGRlci5yYW5nZShmcm9tLnZpc2l0KCksIHRvLnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH0sXG4gICAgQmFzZV90ZXJtaW5hbDogZnVuY3Rpb24oZXhwcikge1xuICAgICAgcmV0dXJuIGJ1aWxkZXIudGVybWluYWwoZXhwci52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9LFxuICAgIEJhc2VfcGFyZW46IGZ1bmN0aW9uKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICByZXR1cm4geC52aXNpdCgpO1xuICAgIH0sXG5cbiAgICBydWxlRGVzY3I6IGZ1bmN0aW9uKG9wZW4sIHQsIGNsb3NlKSB7XG4gICAgICByZXR1cm4gdC52aXNpdCgpO1xuICAgIH0sXG4gICAgcnVsZURlc2NyVGV4dDogZnVuY3Rpb24oXykge1xuICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nLnRyaW0oKTtcbiAgICB9LFxuXG4gICAgY2FzZU5hbWU6IGZ1bmN0aW9uKF8sIHNwYWNlMSwgbiwgc3BhY2UyLCBlbmQpIHtcbiAgICAgIHJldHVybiBuLnZpc2l0KCk7XG4gICAgfSxcblxuICAgIG5hbWU6IGZ1bmN0aW9uKGZpcnN0LCByZXN0KSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgfSxcbiAgICBuYW1lRmlyc3Q6IGZ1bmN0aW9uKGV4cHIpIHt9LFxuICAgIG5hbWVSZXN0OiBmdW5jdGlvbihleHByKSB7fSxcblxuICAgIHRlcm1pbmFsOiBmdW5jdGlvbihvcGVuLCBjcywgY2xvc2UpIHtcbiAgICAgIHJldHVybiBjcy52aXNpdCgpLm1hcChmdW5jdGlvbihjKSB7IHJldHVybiBjb21tb24udW5lc2NhcGVDaGFyKGMpOyB9KS5qb2luKCcnKTtcbiAgICB9LFxuXG4gICAgdGVybWluYWxDaGFyOiBmdW5jdGlvbihfKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgfSxcblxuICAgIGVzY2FwZUNoYXI6IGZ1bmN0aW9uKF8pIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICB9LFxuXG4gICAgTm9uZW1wdHlMaXN0T2Y6IGZ1bmN0aW9uKHgsIF8sIHhzKSB7XG4gICAgICByZXR1cm4gW3gudmlzaXQoKV0uY29uY2F0KHhzLnZpc2l0KCkpO1xuICAgIH0sXG4gICAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH0sXG5cbiAgICBfdGVybWluYWw6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGhlbHBlcnMobWF0Y2gpLnZpc2l0KCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbmFtZXNwYWNlKSB7XG4gIHZhciBtID0gb2htR3JhbW1hci5tYXRjaChzb3VyY2UsICdHcmFtbWFycycpO1xuICBpZiAobS5mYWlsZWQoKSkge1xuICAgIHRocm93IGVycm9ycy5ncmFtbWFyU3ludGF4RXJyb3IobSk7XG4gIH1cbiAgcmV0dXJuIGJ1aWxkR3JhbW1hcihtLCBuYW1lc3BhY2UpO1xufVxuXG4vLyBSZXR1cm4gdGhlIGNvbnRlbnRzIG9mIGEgc2NyaXB0IGVsZW1lbnQsIGZldGNoaW5nIGl0IHZpYSBYSFIgaWYgbmVjZXNzYXJ5LlxuZnVuY3Rpb24gZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKGVsKSB7XG4gIGlmICghaXNFbGVtZW50KGVsKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgRE9NIE5vZGUsIGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhlbCkpO1xuICB9XG4gIGlmIChlbC50eXBlICE9PSAndGV4dC9vaG0tanMnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZ290ICcgKyBlbCk7XG4gIH1cbiAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnc3JjJykgPyBsb2FkKGVsLmdldEF0dHJpYnV0ZSgnc3JjJykpIDogZWwuaW5uZXJIVE1MO1xufVxuXG5mdW5jdGlvbiBncmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gIHZhciBucyA9IGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKTtcblxuICAvLyBFbnN1cmUgdGhhdCB0aGUgc291cmNlIGNvbnRhaW5lZCBubyBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbi5cbiAgdmFyIGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKG5zKTtcbiAgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZ3JhbW1hciBkZWZpbml0aW9uJyk7XG4gIH0gZWxzZSBpZiAoZ3JhbW1hck5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgc2Vjb25kR3JhbW1hciA9IG5zW2dyYW1tYXJOYW1lc1sxXV07XG4gICAgdmFyIGludGVydmFsID0gc2Vjb25kR3JhbW1hci5zb3VyY2U7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKGludGVydmFsLnNvdXJjZVN0cmluZywgaW50ZXJ2YWwuc3RhcnRJZHgpICtcbiAgICAgICAgJ0ZvdW5kIG1vcmUgdGhhbiBvbmUgZ3JhbW1hciBkZWZpbml0aW9uIC0tIHVzZSBvaG0uZ3JhbW1hcnMoKSBpbnN0ZWFkLicpO1xuICB9XG4gIHJldHVybiBuc1tncmFtbWFyTmFtZXNbMF1dOyAgLy8gUmV0dXJuIHRoZSBvbmUgYW5kIG9ubHkgZ3JhbW1hci5cbn1cblxuZnVuY3Rpb24gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgdmFyIG5zID0gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UuYXNOYW1lc3BhY2Uob3B0TmFtZXNwYWNlKSk7XG4gIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgIC8vIEZvciBjb252ZW5pZW5jZSwgZGV0ZWN0IE5vZGUuanMgQnVmZmVyIG9iamVjdHMgYW5kIGF1dG9tYXRpY2FsbHkgY2FsbCB0b1N0cmluZygpLlxuICAgIGlmIChpc0J1ZmZlcihzb3VyY2UpKSB7XG4gICAgICBzb3VyY2UgPSBzb3VyY2UudG9TdHJpbmcoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICAnRXhwZWN0ZWQgc3RyaW5nIGFzIGZpcnN0IGFyZ3VtZW50LCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoc291cmNlKSk7XG4gICAgfVxuICB9XG4gIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbnMpO1xuICByZXR1cm4gbnM7XG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudChvcHROb2RlKSB7XG4gIHZhciBub2RlID0gb3B0Tm9kZTtcbiAgaWYgKGlzVW5kZWZpbmVkKG5vZGUpKSB7XG4gICAgdmFyIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICAgIGlmIChub2RlTGlzdC5sZW5ndGggIT09IDEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnRXhwZWN0ZWQgZXhhY3RseSBvbmUgc2NyaXB0IHRhZyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLCBmb3VuZCAnICsgbm9kZUxpc3QubGVuZ3RoKTtcbiAgICB9XG4gICAgbm9kZSA9IG5vZGVMaXN0WzBdO1xuICB9XG4gIHJldHVybiBncmFtbWFyKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlKSk7XG59XG5cbmZ1bmN0aW9uIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzKG9wdE5vZGVPck5vZGVMaXN0KSB7XG4gIC8vIFNpbXBsZSBjYXNlOiB0aGUgYXJndW1lbnQgaXMgYSBET00gbm9kZS5cbiAgaWYgKGlzRWxlbWVudChvcHROb2RlT3JOb2RlTGlzdCkpIHtcbiAgICByZXR1cm4gZ3JhbW1hcnMob3B0Tm9kZU9yTm9kZUxpc3QpO1xuICB9XG4gIC8vIE90aGVyd2lzZSwgaXQgbXVzdCBiZSBlaXRoZXIgdW5kZWZpbmVkIG9yIGEgTm9kZUxpc3QuXG4gIHZhciBub2RlTGlzdCA9IG9wdE5vZGVPck5vZGVMaXN0O1xuICBpZiAoaXNVbmRlZmluZWQobm9kZUxpc3QpKSB7XG4gICAgLy8gRmluZCBhbGwgc2NyaXB0IGVsZW1lbnRzIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIuXG4gICAgbm9kZUxpc3QgPSBkb2N1bWVudEludGVyZmFjZS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvb2htLWpzXCJdJyk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5vZGVMaXN0ID09PSAnc3RyaW5nJyB8fCAoIWlzRWxlbWVudChub2RlTGlzdCkgJiYgIWlzQXJyYXlMaWtlKG5vZGVMaXN0KSkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIE5vZGUsIE5vZGVMaXN0LCBvciBBcnJheSwgYnV0IGdvdCAnICsgbm9kZUxpc3QpO1xuICB9XG4gIHZhciBucyA9IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7ICsraSkge1xuICAgIC8vIENvcHkgdGhlIG5ldyBncmFtbWFycyBpbnRvIGBuc2AgdG8ga2VlcCB0aGUgbmFtZXNwYWNlIGZsYXQuXG4gICAgY29tbW9uLmV4dGVuZChucywgZ3JhbW1hcnMoZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKG5vZGVMaXN0W2ldKSwgbnMpKTtcbiAgfVxuICByZXR1cm4gbnM7XG59XG5cbmZ1bmN0aW9uIG1ha2VSZWNpcGUocmVjaXBlKSB7XG4gIGlmICh0eXBlb2YgcmVjaXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHJlY2lwZS5jYWxsKG5ldyBCdWlsZGVyKCkpO1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgcmVjaXBlID09PSAnc3RyaW5nJykge1xuICAgICAgLy8gc3RyaW5naWZpZWQgSlNPTiByZWNpcGVcbiAgICAgIHJlY2lwZSA9IEpTT04ucGFyc2UocmVjaXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIChuZXcgQnVpbGRlcigpKS5mcm9tUmVjaXBlKHJlY2lwZSk7XG4gIH1cbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGVOYW1lc3BhY2U6IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UsXG4gIGdyYW1tYXI6IGdyYW1tYXIsXG4gIGdyYW1tYXJzOiBncmFtbWFycyxcbiAgZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50OiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQsXG4gIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzOiBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50cyxcbiAgbWFrZVJlY2lwZTogbWFrZVJlY2lwZSxcbiAgb2htR3JhbW1hcjogbnVsbCwgIC8vIEluaXRpYWxpemVkIGJlbG93LCBhZnRlciBHcmFtbWFyLkJ1aWx0SW5SdWxlcy5cbiAgcGV4cHJzOiBwZXhwcnMsXG4gIHV0aWw6IHV0aWwsXG4gIGV4dHJhczogcmVxdWlyZSgnLi4vZXh0cmFzJylcbn07XG5cbi8vIFN0dWZmIGZvciB0ZXN0aW5nLCBldGMuXG5tb2R1bGUuZXhwb3J0cy5fYnVpbGRHcmFtbWFyID0gYnVpbGRHcmFtbWFyO1xubW9kdWxlLmV4cG9ydHMuX3NldERvY3VtZW50SW50ZXJmYWNlRm9yVGVzdGluZyA9IGZ1bmN0aW9uKGRvYykgeyBkb2N1bWVudEludGVyZmFjZSA9IGRvYzsgfTtcblxuLy8gTGF0ZSBpbml0aWFsaXphdGlvbiBmb3Igc3R1ZmYgdGhhdCBpcyBib290c3RyYXBwZWQuXG5cbkdyYW1tYXIuQnVpbHRJblJ1bGVzID0gcmVxdWlyZSgnLi4vZGlzdC9idWlsdC1pbi1ydWxlcycpO1xuXG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBvcGVyYXRpb25zQW5kQXR0cmlidXRlc0dyYW1tYXIgPSByZXF1aXJlKCcuLi9kaXN0L29wZXJhdGlvbnMtYW5kLWF0dHJpYnV0ZXMnKTtcblNlbWFudGljcy5pbml0QnVpbHRJblNlbWFudGljcyhHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG5TZW1hbnRpY3MuaW5pdFByb3RvdHlwZVBhcnNlcihvcGVyYXRpb25zQW5kQXR0cmlidXRlc0dyYW1tYXIpOyAgLy8gcmVxdWlyZXMgQnVpbHRJblNlbWFudGljc1xuXG5tb2R1bGUuZXhwb3J0cy5vaG1HcmFtbWFyID0gb2htR3JhbW1hciA9IHJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXInKTtcbkdyYW1tYXIuaW5pdEFwcGxpY2F0aW9uUGFyc2VyKG9obUdyYW1tYXIsIGJ1aWxkR3JhbW1hcik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZnVuY3Rpb24gTm9kZShncmFtbWFyLCBjdG9yTmFtZSwgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgpIHtcbiAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgdGhpcy5jdG9yTmFtZSA9IGN0b3JOYW1lO1xuICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW4gfHwgW107XG4gIHRoaXMuY2hpbGRPZmZzZXRzID0gY2hpbGRPZmZzZXRzIHx8IFtdO1xuICB0aGlzLm1hdGNoTGVuZ3RoID0gbWF0Y2hMZW5ndGg7XG59XG5cbk5vZGUucHJvdG90eXBlLm51bUNoaWxkcmVuID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNoaWxkcmVuLmxlbmd0aDtcbn07XG5cbk5vZGUucHJvdG90eXBlLmNoaWxkQXQgPSBmdW5jdGlvbihpZHgpIHtcbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baWR4XTtcbn07XG5cbk5vZGUucHJvdG90eXBlLmluZGV4T2ZDaGlsZCA9IGZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGFyZyk7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5oYXNDaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5jaGlsZHJlbi5sZW5ndGggPiAwO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaGFzTm9DaGlsZHJlbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gIXRoaXMuaGFzQ2hpbGRyZW4oKTtcbn07XG5cbk5vZGUucHJvdG90eXBlLm9ubHlDaGlsZCA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5jaGlsZHJlbi5sZW5ndGggIT09IDEpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdjYW5ub3QgZ2V0IG9ubHkgY2hpbGQgb2YgYSBub2RlIG9mIHR5cGUgJyArIHRoaXMuY3Rvck5hbWUgK1xuICAgICAgICAnIChpdCBoYXMgJyArIHRoaXMubnVtQ2hpbGRyZW4oKSArICcgY2hpbGRyZW4pJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuZmlyc3RDaGlsZCgpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5maXJzdENoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2Nhbm5vdCBnZXQgZmlyc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdCgwKTtcbiAgfVxufTtcblxuTm9kZS5wcm90b3R5cGUubGFzdENoaWxkID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2Nhbm5vdCBnZXQgbGFzdCBjaGlsZCBvZiBhICcgKyB0aGlzLmN0b3JOYW1lICsgJyBub2RlLCB3aGljaCBoYXMgbm8gY2hpbGRyZW4nKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KHRoaXMubnVtQ2hpbGRyZW4oKSAtIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEJlZm9yZSA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEJlZm9yZSgpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gIH0gZWxzZSBpZiAoY2hpbGRJZHggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgY2hpbGQgYmVmb3JlIGZpcnN0IGNoaWxkJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCAtIDEpO1xuICB9XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5jaGlsZEFmdGVyID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgdmFyIGNoaWxkSWR4ID0gdGhpcy5pbmRleE9mQ2hpbGQoY2hpbGQpO1xuICBpZiAoY2hpbGRJZHggPCAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmNoaWxkQWZ0ZXIoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICB9IGVsc2UgaWYgKGNoaWxkSWR4ID09PSB0aGlzLm51bUNoaWxkcmVuKCkgLSAxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGFmdGVyIGxhc3QgY2hpbGQnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4ICsgMSk7XG4gIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxuTm9kZS5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbk5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgciA9IHt9O1xuICByW3RoaXMuY3Rvck5hbWVdID0gdGhpcy5jaGlsZHJlbjtcbiAgcmV0dXJuIHI7XG59O1xuXG4vLyBUZXJtaW5hbHNcblxuZnVuY3Rpb24gVGVybWluYWxOb2RlKGdyYW1tYXIsIHZhbHVlKSB7XG4gIHZhciBtYXRjaExlbmd0aCA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsICdfdGVybWluYWwnLCBbXSwgW10sIG1hdGNoTGVuZ3RoKTtcbiAgdGhpcy5wcmltaXRpdmVWYWx1ZSA9IHZhbHVlO1xufVxuaW5oZXJpdHMoVGVybWluYWxOb2RlLCBOb2RlKTtcblxuVGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuVGVybWluYWxOb2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHIgPSB7fTtcbiAgclt0aGlzLmN0b3JOYW1lXSA9IHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gIHJldHVybiByO1xufTtcblxuLy8gTm9udGVybWluYWxzXG5cbmZ1bmN0aW9uIE5vbnRlcm1pbmFsTm9kZShncmFtbWFyLCBydWxlTmFtZSwgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgpIHtcbiAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsIHJ1bGVOYW1lLCBjaGlsZHJlbiwgY2hpbGRPZmZzZXRzLCBtYXRjaExlbmd0aCk7XG59XG5pbmhlcml0cyhOb250ZXJtaW5hbE5vZGUsIE5vZGUpO1xuXG5Ob250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzTm9udGVybWluYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5Ob250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzTGV4aWNhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY29tbW9uLmlzTGV4aWNhbCh0aGlzLmN0b3JOYW1lKTtcbn07XG5cbk5vbnRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNTeW50YWN0aWMgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLmN0b3JOYW1lKTtcbn07XG5cbi8vIEl0ZXJhdGlvbnNcblxuZnVuY3Rpb24gSXRlcmF0aW9uTm9kZShncmFtbWFyLCBjaGlsZHJlbiwgY2hpbGRPZmZzZXRzLCBtYXRjaExlbmd0aCwgaXNPcHRpb25hbCkge1xuICBOb2RlLmNhbGwodGhpcywgZ3JhbW1hciwgJ19pdGVyJywgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgpO1xuICB0aGlzLm9wdGlvbmFsID0gaXNPcHRpb25hbDtcbn1cbmluaGVyaXRzKEl0ZXJhdGlvbk5vZGUsIE5vZGUpO1xuXG5JdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkl0ZXJhdGlvbk5vZGUucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMub3B0aW9uYWw7XG59O1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIE5vZGU6IE5vZGUsXG4gIFRlcm1pbmFsTm9kZTogVGVybWluYWxOb2RlLFxuICBOb250ZXJtaW5hbE5vZGU6IE5vbnRlcm1pbmFsTm9kZSxcbiAgSXRlcmF0aW9uTm9kZTogSXRlcmF0aW9uTm9kZVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBSZXR1cm4gdHJ1ZSBpZiB3ZSBzaG91bGQgc2tpcCBzcGFjZXMgcHJlY2VkaW5nIHRoaXMgZXhwcmVzc2lvbiBpbiBhIHN5bnRhY3RpYyBjb250ZXh0LlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGNvbW1vbi5hYnN0cmFjdChcbiAgJ2FsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnXG4pO1xuXG4vKlxuICBHZW5lcmFsbHksIHRoZXNlIGFyZSBhbGwgZmlyc3Qtb3JkZXIgZXhwcmVzc2lvbnMgYW5kICh3aXRoIHRoZSBleGNlcHRpb24gb2YgQXBwbHkpXG4gIGRpcmVjdGx5IHJlYWQgZnJvbSB0aGUgaW5wdXQgc3RyZWFtLlxuKi9cbnBleHBycy5hbnkuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuZW5kLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0cnVlO1xufTtcblxuLypcbiAgSGlnaGVyLW9yZGVyIGV4cHJlc3Npb25zIHRoYXQgZG9uJ3QgZGlyZWN0bHkgY29uc3VtZSBpbnB1dC5cbiovXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5JdGVyLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5MZXgucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmYWxzZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgbGV4aWZ5Q291bnQ7XG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICBsZXhpZnlDb3VudCA9IDA7XG4gIHRoaXMuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbn07XG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gY29tbW9uLmFic3RyYWN0KFxuICAnX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJ1xuKTtcblxucGV4cHJzLmFueS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLmVuZC5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkxleC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgbGV4aWZ5Q291bnQrKztcbiAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gIGxleGlmeUNvdW50LS07XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnRlcm1zW2lkeF0uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbnBleHBycy5Ob3QucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbihydWxlTmFtZSwgZ3JhbW1hcikge1xuICB0aGlzLmV4cHIuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24ocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgdmFyIHJ1bGVJbmZvID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXTtcblxuICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcnVsZSBleGlzdHMuLi5cbiAgaWYgKCFydWxlSW5mbykge1xuICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkUnVsZSh0aGlzLnJ1bGVOYW1lLCBncmFtbWFyLm5hbWUsIHRoaXMuc291cmNlKTtcbiAgfVxuXG4gIC8vIC4uLmFuZCB0aGF0IHRoaXMgYXBwbGljYXRpb24gaXMgYWxsb3dlZFxuICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpICYmICghY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSB8fCBsZXhpZnlDb3VudCA+IDApKSB7XG4gICAgdGhyb3cgZXJyb3JzLmFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0KHRoaXMucnVsZU5hbWUsIHRoaXMpO1xuICB9XG5cbiAgLy8gLi4uYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBoYXMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50c1xuICB2YXIgYWN0dWFsID0gdGhpcy5hcmdzLmxlbmd0aDtcbiAgdmFyIGV4cGVjdGVkID0gcnVsZUluZm8uZm9ybWFscy5sZW5ndGg7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZBcmd1bWVudHModGhpcy5ydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgdGhpcy5zb3VyY2UpO1xuICB9XG5cbiAgLy8gLi4uYW5kIHRoYXQgYWxsIG9mIHRoZSBhcmd1bWVudCBleHByZXNzaW9ucyBvbmx5IGhhdmUgdmFsaWQgYXBwbGljYXRpb25zIGFuZCBoYXZlIGFyaXR5IDEuXG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnKSB7XG4gICAgYXJnLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgaWYgKGFyZy5nZXRBcml0eSgpICE9PSAxKSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW52YWxpZFBhcmFtZXRlcihzZWxmLnJ1bGVOYW1lLCBhcmcpO1xuICAgIH1cbiAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGNvbW1vbi5hYnN0cmFjdChcbiAgJ2Fzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5J1xuKTtcblxucGV4cHJzLmFueS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5MZXgucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICAvLyBuby1vcFxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XTtcbiAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KCk7XG4gICAgdmFyIG90aGVyQXJpdHkgPSB0ZXJtLmdldEFyaXR5KCk7XG4gICAgaWYgKGFyaXR5ICE9PSBvdGhlckFyaXR5KSB7XG4gICAgICB0aHJvdyBlcnJvcnMuaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGFyaXR5LCBvdGhlckFyaXR5LCB0ZXJtKTtcbiAgICB9XG4gIH1cbn07XG5cbnBleHBycy5FeHRlbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gRXh0ZW5kIGlzIGEgc3BlY2lhbCBjYXNlIG9mIEFsdCB0aGF0J3MgZ3VhcmFudGVlZCB0byBoYXZlIGV4YWN0bHkgdHdvXG4gIC8vIGNhc2VzOiBbZXh0ZW5zaW9ucywgb3JpZ0JvZHldLlxuICB2YXIgYWN0dWFsQXJpdHkgPSB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG4gIHZhciBleHBlY3RlZEFyaXR5ID0gdGhpcy50ZXJtc1sxXS5nZXRBcml0eSgpO1xuICBpZiAoYWN0dWFsQXJpdHkgIT09IGV4cGVjdGVkQXJpdHkpIHtcbiAgICB0aHJvdyBlcnJvcnMuaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkQXJpdHksIGFjdHVhbEFyaXR5LCB0aGlzLnRlcm1zWzBdKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24ocnVsZU5hbWUpIHtcbiAgLy8gbm8tb3AgKG5vdCByZXF1aXJlZCBiL2MgdGhlIG5lc3RlZCBleHByIGRvZXNuJ3Qgc2hvdyB1cCBpbiB0aGUgQ1NUKVxufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbihydWxlTmFtZSkge1xuICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uKHJ1bGVOYW1lKSB7XG4gIC8vIFRoZSBhcml0aWVzIG9mIHRoZSBwYXJhbWV0ZXIgZXhwcmVzc2lvbnMgaXMgcmVxdWlyZWQgdG8gYmUgMSBieVxuICAvLyBgYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoKWAuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBjb21tb24uYWJzdHJhY3QoXG4gICdhc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnXG4pO1xuXG5wZXhwcnMuYW55LmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuZW5kLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIC8vIG5vLW9wXG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBydWxlTmFtZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICB9XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgLy8gTm90ZTogdGhpcyBpcyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgZm9yIGBTdGFyYCBhbmQgYFBsdXNgIGV4cHJlc3Npb25zLlxuICAvLyBJdCBpcyBvdmVycmlkZGVuIGZvciBgT3B0YCBiZWxvdy5cbiAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG4gIGlmICh0aGlzLmV4cHIuaXNOdWxsYWJsZShncmFtbWFyKSkge1xuICAgIHRocm93IGVycm9ycy5rbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKHRoaXMsIHJ1bGVOYW1lKTtcbiAgfVxufTtcblxucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgcnVsZU5hbWUpIHtcbiAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBydWxlTmFtZSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIHJ1bGVOYW1lKSB7XG4gIHRoaXMuYXJncy5mb3JFYWNoKGZ1bmN0aW9uKGFyZykge1xuICAgIGFyZy5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgcnVsZU5hbWUpO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBub2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5jaGVjayA9IGNvbW1vbi5hYnN0cmFjdCgnY2hlY2snKTtcblxucGV4cHJzLmFueS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xuXG5wZXhwcnMuZW5kLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSB1bmRlZmluZWQ7XG59O1xuXG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSB0aGlzLm9iajtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHJldHVybiB2YWxzWzBdIGluc3RhbmNlb2Ygbm9kZXMuTm9kZSAmJlxuICAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgIHR5cGVvZiB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSB0eXBlb2YgdGhpcy5mcm9tO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnRlcm1zLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2ldO1xuICAgIGlmICh0ZXJtLmNoZWNrKGdyYW1tYXIsIHZhbHMpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHZhciBwb3MgPSAwO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaV07XG4gICAgaWYgKGZhY3Rvci5jaGVjayhncmFtbWFyLCB2YWxzLnNsaWNlKHBvcykpKSB7XG4gICAgICBwb3MgKz0gZmFjdG9yLmdldEFyaXR5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbihncmFtbWFyLCB2YWxzKSB7XG4gIHZhciBhcml0eSA9IHRoaXMuZ2V0QXJpdHkoKTtcbiAgdmFyIGNvbHVtbnMgPSB2YWxzLnNsaWNlKDAsIGFyaXR5KTtcbiAgaWYgKGNvbHVtbnMubGVuZ3RoICE9PSBhcml0eSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcm93Q291bnQgPSBjb2x1bW5zWzBdLmxlbmd0aDtcbiAgdmFyIGk7XG4gIGZvciAoaSA9IDE7IGkgPCBhcml0eTsgaSsrKSB7XG4gICAgaWYgKGNvbHVtbnNbaV0ubGVuZ3RoICE9PSByb3dDb3VudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCByb3dDb3VudDsgaSsrKSB7XG4gICAgdmFyIHJvdyA9IFtdO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgYXJpdHk7IGorKykge1xuICAgICAgcm93LnB1c2goY29sdW1uc1tqXVtpXSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5leHByLmNoZWNrKGdyYW1tYXIsIHJvdykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmNoZWNrID1cbnBleHBycy5MZXgucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdGhpcy5leHByLmNoZWNrKGdyYW1tYXIsIHZhbHMpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uKGdyYW1tYXIsIHZhbHMpIHtcbiAgaWYgKCEodmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgdmFsc1swXS5ncmFtbWFyID09PSBncmFtbWFyICYmXG4gICAgICAgIHZhbHNbMF0uY3Rvck5hbWUgPT09IHRoaXMucnVsZU5hbWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy8gVE9ETzogdGhpbmsgYWJvdXQgKm5vdCogZG9pbmcgdGhlIGZvbGxvd2luZyBjaGVja3MsIGkuZS4sIHRydXN0aW5nIHRoYXQgdGhlIHJ1bGVcbiAgLy8gd2FzIGNvcnJlY3RseSBjb25zdHJ1Y3RlZC5cbiAgdmFyIHJ1bGVOb2RlID0gdmFsc1swXTtcbiAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdLmJvZHk7XG4gIHJldHVybiBib2R5LmNoZWNrKGdyYW1tYXIsIHJ1bGVOb2RlLmNoaWxkcmVuKSAmJiBydWxlTm9kZS5udW1DaGlsZHJlbigpID09PSBib2R5LmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24oZ3JhbW1hciwgdmFscykge1xuICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgICB0eXBlb2YgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gJ3N0cmluZyc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxudmFyIFRlcm1pbmFsTm9kZSA9IG5vZGVzLlRlcm1pbmFsTm9kZTtcbnZhciBOb250ZXJtaW5hbE5vZGUgPSBub2Rlcy5Ob250ZXJtaW5hbE5vZGU7XG52YXIgSXRlcmF0aW9uTm9kZSA9IG5vZGVzLkl0ZXJhdGlvbk5vZGU7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBFdmFsdWF0ZSB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJuIGB0cnVlYCBpZiBpdCBzdWNjZWVkcywgYGZhbHNlYCBvdGhlcndpc2UuIFRoaXMgbWV0aG9kIHNob3VsZFxuICBvbmx5IGJlIGNhbGxlZCBkaXJlY3RseSBieSBgU3RhdGUucHJvdG90eXBlLmV2YWwoZXhwcilgLCB3aGljaCBhbHNvIHVwZGF0ZXMgdGhlIGRhdGEgc3RydWN0dXJlc1xuICB0aGF0IGFyZSB1c2VkIGZvciB0cmFjaW5nLiAoTWFraW5nIHRob3NlIHVwZGF0ZXMgaW4gYSBtZXRob2Qgb2YgYFN0YXRlYCBlbmFibGVzIHRoZSB0cmFjZS1zcGVjaWZpY1xuICBkYXRhIHN0cnVjdHVyZXMgdG8gYmUgXCJzZWNyZXRzXCIgb2YgdGhhdCBjbGFzcywgd2hpY2ggaXMgZ29vZCBmb3IgbW9kdWxhcml0eS4pXG5cbiAgVGhlIGNvbnRyYWN0IG9mIHRoaXMgbWV0aG9kIGlzIGFzIGZvbGxvd3M6XG4gICogV2hlbiB0aGUgcmV0dXJuIHZhbHVlIGlzIGB0cnVlYCxcbiAgICAtIHRoZSBzdGF0ZSBvYmplY3Qgd2lsbCBoYXZlIGBleHByLmdldEFyaXR5KClgIG1vcmUgYmluZGluZ3MgdGhhbiBpdCBkaWQgYmVmb3JlIHRoZSBjYWxsLlxuICAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBgZmFsc2VgLFxuICAgIC0gdGhlIHN0YXRlIG9iamVjdCBtYXkgaGF2ZSBtb3JlIGJpbmRpbmdzIHRoYW4gaXQgZGlkIGJlZm9yZSB0aGUgY2FsbCwgYW5kXG4gICAgLSBpdHMgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gbWF5IGJlIGFueXdoZXJlLlxuXG4gIE5vdGUgdGhhdCBgU3RhdGUucHJvdG90eXBlLmV2YWwoZXhwcilgLCB1bmxpa2UgdGhpcyBtZXRob2QsIGd1YXJhbnRlZXMgdGhhdCBuZWl0aGVyIHRoZSBzdGF0ZVxuICBvYmplY3QncyBiaW5kaW5ncyBub3IgaXRzIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIHdpbGwgY2hhbmdlIGlmIHRoZSBleHByZXNzaW9uIGZhaWxzIHRvIG1hdGNoLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZXZhbCA9IGNvbW1vbi5hYnN0cmFjdCgnZXZhbCcpOyAgLy8gZnVuY3Rpb24oc3RhdGUpIHsgLi4uIH1cblxucGV4cHJzLmFueS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChjaCkge1xuICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5lbmQuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgaWYgKGlucHV0U3RyZWFtLmF0RW5kKCkpIHtcbiAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHVuZGVmaW5lZCksIG9yaWdQb3MpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICBpZiAoIWlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKSkge1xuICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHRoaXMub2JqKSwgb3JpZ1Bvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICBpZiAoY2ggJiYgdGhpcy5mcm9tIDw9IGNoICYmIGNoIDw9IHRoaXMudG8pIHtcbiAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICByZXR1cm4gc3RhdGUuZXZhbChzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKS5hcmdzW3RoaXMuaW5kZXhdKTtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICBzdGF0ZS5lbnRlckxleGlmaWVkQ29udGV4dCgpO1xuICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpO1xuICBzdGF0ZS5leGl0TGV4aWZpZWRDb250ZXh0KCk7XG4gIHJldHVybiBhbnM7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgaWYgKHN0YXRlLmV2YWwodGhpcy50ZXJtc1tpZHhdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIHZhciBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XTtcbiAgICBpZiAoIXN0YXRlLmV2YWwoZmFjdG9yKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gIHZhciBjb2xzID0gW107XG4gIHZhciBjb2xPZmZzZXRzID0gW107XG4gIHdoaWxlIChjb2xzLmxlbmd0aCA8IGFyaXR5KSB7XG4gICAgY29scy5wdXNoKFtdKTtcbiAgICBjb2xPZmZzZXRzLnB1c2goW10pO1xuICB9XG5cbiAgdmFyIG51bU1hdGNoZXMgPSAwO1xuICB2YXIgaWR4O1xuICB3aGlsZSAobnVtTWF0Y2hlcyA8IHRoaXMubWF4TnVtTWF0Y2hlcyAmJiBzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICBudW1NYXRjaGVzKys7XG4gICAgdmFyIHJvdyA9IHN0YXRlLl9iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgdmFyIHJvd09mZnNldHMgPSBzdGF0ZS5fYmluZGluZ09mZnNldHMuc3BsaWNlKHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcm93Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgIGNvbHNbaWR4XS5wdXNoKHJvd1tpZHhdKTtcbiAgICAgIGNvbE9mZnNldHNbaWR4XS5wdXNoKHJvd09mZnNldHNbaWR4XSk7XG4gICAgfVxuICB9XG4gIGlmIChudW1NYXRjaGVzIDwgdGhpcy5taW5OdW1NYXRjaGVzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBzdGFydElkeCA9IG9yaWdQb3M7XG4gIHZhciBtYXRjaExlbmd0aCA9IDA7XG4gIGlmIChudW1NYXRjaGVzID4gMCkge1xuICAgIHZhciBsYXN0Q29sID0gY29sc1thcml0eSAtIDFdO1xuICAgIHZhciBsYXN0Q29sT2Zmc2V0cyA9IGNvbE9mZnNldHNbYXJpdHkgLSAxXTtcblxuICAgIHZhciBlbmRJZHggPVxuICAgICAgICBsYXN0Q29sT2Zmc2V0c1tsYXN0Q29sT2Zmc2V0cy5sZW5ndGggLSAxXSArIGxhc3RDb2xbbGFzdENvbC5sZW5ndGggLSAxXS5tYXRjaExlbmd0aDtcbiAgICBzdGFydElkeCA9IGNvbE9mZnNldHNbMF1bMF07XG4gICAgbWF0Y2hMZW5ndGggPSBlbmRJZHggLSBzdGFydElkeDtcbiAgfVxuICB2YXIgaXNPcHRpb25hbCA9IHRoaXMgaW5zdGFuY2VvZiBwZXhwcnMuT3B0O1xuICBmb3IgKGlkeCA9IDA7IGlkeCA8IGNvbHMubGVuZ3RoOyBpZHgrKykge1xuICAgIHN0YXRlLl9iaW5kaW5ncy5wdXNoKFxuICAgICAgICBuZXcgSXRlcmF0aW9uTm9kZShzdGF0ZS5ncmFtbWFyLCBjb2xzW2lkeF0sIGNvbE9mZnNldHNbaWR4XSwgbWF0Y2hMZW5ndGgsIGlzT3B0aW9uYWwpKTtcbiAgICBzdGF0ZS5fYmluZGluZ09mZnNldHMucHVzaChzdGF0ZS5wb3NUb09mZnNldChzdGFydElkeCkpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIC8qXG4gICAgVE9ETzpcbiAgICAtIFJpZ2h0IG5vdyB3ZSdyZSBqdXN0IHRocm93aW5nIGF3YXkgYWxsIG9mIHRoZSBmYWlsdXJlcyB0aGF0IGhhcHBlbiBpbnNpZGUgYSBgbm90YCwgYW5kXG4gICAgICByZWNvcmRpbmcgYHRoaXNgIGFzIGEgZmFpbGVkIGV4cHJlc3Npb24uXG4gICAgLSBEb3VibGUgbmVnYXRpb24gc2hvdWxkIGJlIGVxdWl2YWxlbnQgdG8gbG9va2FoZWFkLCBidXQgdGhhdCdzIG5vdCB0aGUgY2FzZSByaWdodCBub3cgd3J0XG4gICAgICBmYWlsdXJlcy4gRS5nLiwgfn4nZm9vJyBwcm9kdWNlcyBhIGZhaWx1cmUgZm9yIH5+J2ZvbycsIGJ1dCBtYXliZSBpdCBzaG91bGQgcHJvZHVjZVxuICAgICAgYSBmYWlsdXJlIGZvciAnZm9vJyBpbnN0ZWFkLlxuICAqL1xuXG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgc3RhdGUucHVzaEZhaWx1cmVzSW5mbygpO1xuXG4gIHZhciBhbnMgPSBzdGF0ZS5ldmFsKHRoaXMuZXhwcik7XG5cbiAgc3RhdGUucG9wRmFpbHVyZXNJbmZvKCk7XG4gIGlmIChhbnMpIHtcbiAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gIGlmIChzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGNhbGxlciA9IHN0YXRlLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICB2YXIgYWN0dWFscyA9IGNhbGxlciA/IGNhbGxlci5hcmdzIDogW107XG4gIHZhciBhcHAgPSB0aGlzLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG5cbiAgdmFyIHBvc0luZm8gPSBzdGF0ZS5nZXRDdXJyZW50UG9zSW5mbygpO1xuICBpZiAocG9zSW5mby5pc0FjdGl2ZShhcHApKSB7XG4gICAgLy8gVGhpcyBydWxlIGlzIGFscmVhZHkgYWN0aXZlIGF0IHRoaXMgcG9zaXRpb24sIGkuZS4sIGl0IGlzIGxlZnQtcmVjdXJzaXZlLlxuICAgIHJldHVybiBhcHAuaGFuZGxlQ3ljbGUoc3RhdGUpO1xuICB9XG5cbiAgdmFyIG1lbW9LZXkgPSBhcHAudG9NZW1vS2V5KCk7XG4gIHZhciBtZW1vUmVjID0gcG9zSW5mby5tZW1vW21lbW9LZXldO1xuXG4gIGlmIChtZW1vUmVjICYmIHBvc0luZm8uc2hvdWxkVXNlTWVtb2l6ZWRSZXN1bHQobWVtb1JlYykpIHtcbiAgICBpZiAoc3RhdGUuaGFzTmVjZXNzYXJ5SW5mbyhtZW1vUmVjKSkge1xuICAgICAgcmV0dXJuIHN0YXRlLnVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLmlucHV0U3RyZWFtLnBvcywgbWVtb1JlYyk7XG4gICAgfVxuICAgIGRlbGV0ZSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gIH1cbiAgcmV0dXJuIGFwcC5yZWFsbHlFdmFsKHN0YXRlKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuaGFuZGxlQ3ljbGUgPSBmdW5jdGlvbihzdGF0ZSkge1xuICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHBvc0luZm8uY3VycmVudExlZnRSZWN1cnNpb247XG4gIHZhciBtZW1vS2V5ID0gdGhpcy50b01lbW9LZXkoKTtcbiAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG5cbiAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uICYmIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSA9PT0gbWVtb0tleSkge1xuICAgIC8vIFdlIGFscmVhZHkga25vdyBhYm91dCB0aGlzIGxlZnQgcmVjdXJzaW9uLCBidXQgaXQncyBwb3NzaWJsZSB0aGVyZSBhcmUgXCJpbnZvbHZlZFxuICAgIC8vIGFwcGxpY2F0aW9uc1wiIHRoYXQgd2UgZG9uJ3QgYWxyZWFkeSBrbm93IGFib3V0LCBzby4uLlxuICAgIG1lbW9SZWMudXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzKCk7XG4gIH0gZWxzZSBpZiAoIW1lbW9SZWMpIHtcbiAgICAvLyBOZXcgbGVmdCByZWN1cnNpb24gZGV0ZWN0ZWQhIE1lbW9pemUgYSBmYWlsdXJlIHRvIHRyeSB0byBnZXQgYSBzZWVkIHBhcnNlLlxuICAgIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9pemUoXG4gICAgICAgIG1lbW9LZXksXG4gICAgICAgIHttYXRjaExlbmd0aDogMCwgZXhhbWluZWRMZW5ndGg6IDAsIHZhbHVlOiBmYWxzZSwgcmlnaHRtb3N0RmFpbHVyZU9mZnNldDogLTF9KTtcbiAgICBwb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbih0aGlzLCBtZW1vUmVjKTtcbiAgfVxuICByZXR1cm4gc3RhdGUudXNlTWVtb2l6ZWRSZXN1bHQoc3RhdGUuaW5wdXRTdHJlYW0ucG9zLCBtZW1vUmVjKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUucmVhbGx5RXZhbCA9IGZ1bmN0aW9uKHN0YXRlKSB7XG4gIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgdmFyIG9yaWdQb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgdmFyIHJ1bGVJbmZvID0gc3RhdGUuZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXTtcbiAgdmFyIGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICB2YXIgZGVzY3JpcHRpb24gPSBydWxlSW5mby5kZXNjcmlwdGlvbjtcblxuICBzdGF0ZS5lbnRlckFwcGxpY2F0aW9uKG9yaWdQb3NJbmZvLCB0aGlzKTtcblxuICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICBzdGF0ZS5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gIH1cblxuICAvLyBSZXNldCB0aGUgaW5wdXQgc3RyZWFtJ3MgZXhhbWluZWRMZW5ndGggcHJvcGVydHkgc28gdGhhdCB3ZSBjYW4gdHJhY2tcbiAgLy8gdGhlIGV4YW1pbmVkIGxlbmd0aCBvZiB0aGlzIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gIHZhciBvcmlnSW5wdXRTdHJlYW1FeGFtaW5lZExlbmd0aCA9IGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoO1xuICBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9IDA7XG5cbiAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICB2YXIgaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gY3VycmVudExSICYmIGN1cnJlbnRMUi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXk7XG4gIHZhciBtZW1vUmVjO1xuXG4gIGlmIChpc0hlYWRPZkxlZnRSZWN1cnNpb24pIHtcbiAgICB2YWx1ZSA9IHRoaXMuZ3Jvd1NlZWRSZXN1bHQoYm9keSwgc3RhdGUsIG9yaWdQb3MsIGN1cnJlbnRMUiwgdmFsdWUpO1xuICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24oKTtcbiAgICBtZW1vUmVjID0gY3VycmVudExSO1xuICAgIG1lbW9SZWMuZXhhbWluZWRMZW5ndGggPSBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCAtIG9yaWdQb3M7XG4gICAgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gc3RhdGUuX2dldFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQoKTtcbiAgICBvcmlnUG9zSW5mby5tZW1vaXplKG1lbW9LZXksIG1lbW9SZWMpOyAgLy8gdXBkYXRlcyBvcmlnUG9zSW5mbydzIG1heEV4YW1pbmVkTGVuZ3RoXG4gIH0gZWxzZSBpZiAoIWN1cnJlbnRMUiB8fCAhY3VycmVudExSLmlzSW52b2x2ZWQobWVtb0tleSkpIHtcbiAgICAvLyBUaGlzIGFwcGxpY2F0aW9uIGlzIG5vdCBpbnZvbHZlZCBpbiBsZWZ0IHJlY3Vyc2lvbiwgc28gaXQncyBvayB0byBtZW1vaXplIGl0LlxuICAgIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vaXplKG1lbW9LZXksIHtcbiAgICAgIG1hdGNoTGVuZ3RoOiBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zLFxuICAgICAgZXhhbWluZWRMZW5ndGg6IGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoIC0gb3JpZ1BvcyxcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIGZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbjogc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCksXG4gICAgICByaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiBzdGF0ZS5fZ2V0UmlnaHRtb3N0RmFpbHVyZU9mZnNldCgpXG4gICAgfSk7XG4gIH1cbiAgdmFyIHN1Y2NlZWRlZCA9ICEhdmFsdWU7XG5cbiAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgc3RhdGUucG9wRmFpbHVyZXNJbmZvKCk7XG4gICAgaWYgKCFzdWNjZWVkZWQpIHtcbiAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgIH1cbiAgICBpZiAobWVtb1JlYykge1xuICAgICAgbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24gPSBzdGF0ZS5jbG9uZVJlY29yZGVkRmFpbHVyZXMoKTtcbiAgICB9XG4gIH1cblxuICAvLyBSZWNvcmQgdHJhY2UgaW5mb3JtYXRpb24gaW4gdGhlIG1lbW8gdGFibGUsIHNvIHRoYXQgaXQgaXMgYXZhaWxhYmxlIGlmIHRoZSBtZW1vaXplZCByZXN1bHRcbiAgLy8gaXMgdXNlZCBsYXRlci5cbiAgaWYgKHN0YXRlLmlzVHJhY2luZygpICYmIG1lbW9SZWMpIHtcbiAgICB2YXIgZW50cnkgPSBzdGF0ZS5nZXRUcmFjZUVudHJ5KG9yaWdQb3MsIHRoaXMsIHN1Y2NlZWRlZCwgc3VjY2VlZGVkID8gW3ZhbHVlXSA6IFtdKTtcbiAgICBpZiAoaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICBjb21tb24uYXNzZXJ0KGVudHJ5LnRlcm1pbmF0aW5nTFJFbnRyeSAhPSBudWxsIHx8ICFzdWNjZWVkZWQpO1xuICAgICAgZW50cnkuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgbWVtb1JlYy50cmFjZUVudHJ5ID0gZW50cnk7XG4gIH1cblxuICAvLyBGaXggdGhlIGlucHV0IHN0cmVhbSdzIGV4YW1pbmVkTGVuZ3RoIC0tIGl0IHNob3VsZCBiZSB0aGUgbWF4aW11bSBleGFtaW5lZCBsZW5ndGhcbiAgLy8gYWNyb3NzIGFsbCBhcHBsaWNhdGlvbnMsIG5vdCBqdXN0IHRoaXMgb25lLlxuICBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoLCBvcmlnSW5wdXRTdHJlYW1FeGFtaW5lZExlbmd0aCk7XG5cbiAgc3RhdGUuZXhpdEFwcGxpY2F0aW9uKG9yaWdQb3NJbmZvLCB2YWx1ZSk7XG5cbiAgcmV0dXJuIHN1Y2NlZWRlZDtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbihleHByLCBzdGF0ZSkge1xuICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG5cbiAgaWYgKHN0YXRlLmV2YWwoZXhwcikpIHtcbiAgICB2YXIgYXJpdHkgPSBleHByLmdldEFyaXR5KCk7XG4gICAgdmFyIGJpbmRpbmdzID0gc3RhdGUuX2JpbmRpbmdzLnNwbGljZShzdGF0ZS5fYmluZGluZ3MubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICB2YXIgb2Zmc2V0cyA9IHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdPZmZzZXRzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgcmV0dXJuIG5ldyBOb250ZXJtaW5hbE5vZGUoXG4gICAgICAgIHN0YXRlLmdyYW1tYXIsIHRoaXMucnVsZU5hbWUsIGJpbmRpbmdzLCBvZmZzZXRzLCBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ3Jvd1NlZWRSZXN1bHQgPSBmdW5jdGlvbihib2R5LCBzdGF0ZSwgb3JpZ1BvcywgbHJNZW1vUmVjLCBuZXdWYWx1ZSkge1xuICBpZiAoIW5ld1ZhbHVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICBsck1lbW9SZWMubWF0Y2hMZW5ndGggPSBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zO1xuICAgIGxyTWVtb1JlYy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgIGxyTWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24gPSBzdGF0ZS5jbG9uZVJlY29yZGVkRmFpbHVyZXMoKTtcblxuICAgIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgICAgLy8gQmVmb3JlIGV2YWx1YXRpbmcgdGhlIGJvZHkgYWdhaW4sIGFkZCBhIHRyYWNlIG5vZGUgZm9yIHRoaXMgYXBwbGljYXRpb24gdG8gdGhlIG1lbW8gZW50cnkuXG4gICAgICAvLyBJdHMgb25seSBjaGlsZCBpcyBhIGNvcHkgb2YgdGhlIHRyYWNlIG5vZGUgZnJvbSBgbmV3VmFsdWVgLCB3aGljaCB3aWxsIGFsd2F5cyBiZSB0aGUgbGFzdFxuICAgICAgLy8gZWxlbWVudCBpbiBgc3RhdGUudHJhY2VgLlxuICAgICAgdmFyIHNlZWRUcmFjZSA9IHN0YXRlLnRyYWNlW3N0YXRlLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgICAgbHJNZW1vUmVjLnRyYWNlRW50cnkgPSBuZXcgVHJhY2UoXG4gICAgICAgICAgc3RhdGUuaW5wdXQsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdGhpcywgdHJ1ZSwgW25ld1ZhbHVlXSwgW3NlZWRUcmFjZS5jbG9uZSgpXSk7XG4gICAgfVxuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgbmV3VmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHN0YXRlKTtcbiAgICBpZiAoaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcyA8PSBsck1lbW9SZWMubWF0Y2hMZW5ndGgpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgIHN0YXRlLnRyYWNlLnNwbGljZSgtMiwgMSk7ICAvLyBEcm9wIHRoZSB0cmFjZSBmb3IgdGhlIG9sZCBzZWVkLlxuICAgIH1cbiAgfVxuICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAvLyBUaGUgbGFzdCBlbnRyeSBpcyBmb3IgYW4gdW51c2VkIHJlc3VsdCAtLSBwb3AgaXQgYW5kIHNhdmUgaXQgaW4gdGhlIFwicmVhbFwiIGVudHJ5LlxuICAgIGxyTWVtb1JlYy50cmFjZUVudHJ5LnJlY29yZExSVGVybWluYXRpb24oc3RhdGUudHJhY2UucG9wKCksIG5ld1ZhbHVlKTtcbiAgfVxuICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zICsgbHJNZW1vUmVjLm1hdGNoTGVuZ3RoO1xuICByZXR1cm4gbHJNZW1vUmVjLnZhbHVlO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24oc3RhdGUpIHtcbiAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gIGlmIChjaCAmJiB0aGlzLnBhdHRlcm4udGVzdChjaCkpIHtcbiAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSB7XG4gICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGZsYXR0ZW4obGlzdE9mTGlzdHMpIHtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIGxpc3RPZkxpc3RzKTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gY29tbW9uLmFic3RyYWN0KCdnZW5lcmF0ZUV4YW1wbGUnKTtcblxuZnVuY3Rpb24gY2F0ZWdvcml6ZUV4YW1wbGVzKGV4YW1wbGVzKSB7XG4gIC8vIEEgbGlzdCBvZiBydWxlcyB0aGF0IHRoZSBzeXN0ZW0gbmVlZHMgZXhhbXBsZXMgb2YsIGluIG9yZGVyIHRvIGdlbmVyYXRlIGFuIGV4YW1wbGVcbiAgLy8gICBmb3IgdGhlIGN1cnJlbnQgcnVsZVxuICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlcy5maWx0ZXIoZnVuY3Rpb24oZXhhbXBsZSkge1xuICAgIHJldHVybiBleGFtcGxlLmhhc093blByb3BlcnR5KCdleGFtcGxlc05lZWRlZCcpO1xuICB9KVxuICAubWFwKGZ1bmN0aW9uKGV4YW1wbGUpIHsgcmV0dXJuIGV4YW1wbGUuZXhhbXBsZXNOZWVkZWQ7IH0pO1xuXG4gIGV4YW1wbGVzTmVlZGVkID0gZmxhdHRlbihleGFtcGxlc05lZWRlZCk7XG5cbiAgdmFyIHVuaXF1ZUV4YW1wbGVzTmVlZGVkID0ge307XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZXhhbXBsZXNOZWVkZWQubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY3VycmVudEV4YW1wbGVOZWVkZWQgPSBleGFtcGxlc05lZWRlZFtpXTtcbiAgICB1bmlxdWVFeGFtcGxlc05lZWRlZFtjdXJyZW50RXhhbXBsZU5lZWRlZF0gPSB0cnVlO1xuICB9XG4gIGV4YW1wbGVzTmVlZGVkID0gT2JqZWN0LmtleXModW5pcXVlRXhhbXBsZXNOZWVkZWQpO1xuXG4gIC8vIEEgbGlzdCBvZiBzdWNjZXNzZnVsbHkgZ2VuZXJhdGVkIGV4YW1wbGVzXG4gIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBleGFtcGxlcy5maWx0ZXIoZnVuY3Rpb24oZXhhbXBsZSkge1xuICAgIHJldHVybiBleGFtcGxlLmhhc093blByb3BlcnR5KCd2YWx1ZScpO1xuICB9KVxuICAubWFwKGZ1bmN0aW9uKGl0ZW0pIHsgcmV0dXJuIGl0ZW0udmFsdWU7IH0pO1xuXG4gIC8vIFRoaXMgZmxhZyByZXR1cm5zIHRydWUgaWYgdGhlIHN5c3RlbSBjYW5ub3QgZ2VuZXJhdGUgdGhlIHJ1bGUgaXQgaXMgY3VycmVudGx5XG4gIC8vICAgYXR0ZW1wdGluZyB0byBnZW5lcmF0ZSwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIG9yIG5vdCBpdCBoYXMgdGhlIGV4YW1wbGVzIGl0IG5lZWRzLlxuICAvLyAgIEN1cnJlbnRseSwgdGhpcyBpcyBvbmx5IHVzZWQgaW4gb3ZlcnJpZGluZyBnZW5lcmF0b3JzIHRvIHByZXZlbnQgdGhlIHN5c3RlbSBmcm9tXG4gIC8vICAgZ2VuZXJhdGluZyBleGFtcGxlcyBmb3IgY2VydGFpbiBydWxlcyAoZS5nLiAnaWRlbnQnKS5cbiAgdmFyIG5lZWRIZWxwID0gZXhhbXBsZXMuc29tZShmdW5jdGlvbihpdGVtKSB7IHJldHVybiBpdGVtLm5lZWRIZWxwOyB9KTtcblxuICByZXR1cm4ge1xuICAgIGV4YW1wbGVzTmVlZGVkOiBleGFtcGxlc05lZWRlZCxcbiAgICBzdWNjZXNzZnVsRXhhbXBsZXM6IHN1Y2Nlc3NmdWxFeGFtcGxlcyxcbiAgICBuZWVkSGVscDogbmVlZEhlbHBcbiAgfTtcbn1cblxucGV4cHJzLmFueS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIHJldHVybiB7dmFsdWU6IFN0cmluZy5mcm9tQ2hhckNvZGUoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU1KSl9O1xufTtcblxuLy8gQXNzdW1lcyB0aGF0IHRlcm1pbmFsJ3Mgb2JqZWN0IGlzIGFsd2F5cyBhIHN0cmluZ1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0KSB7XG4gIHJldHVybiB7dmFsdWU6IHRoaXMub2JqfTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICB2YXIgcmFuZ2VTaXplID0gdGhpcy50by5jaGFyQ29kZUF0KDApIC0gdGhpcy5mcm9tLmNoYXJDb2RlQXQoMCk7XG4gIHJldHVybiB7dmFsdWU6IFN0cmluZy5mcm9tQ2hhckNvZGUoXG4gICAgdGhpcy5mcm9tLmNoYXJDb2RlQXQoMCkgKyBNYXRoLmZsb29yKHJhbmdlU2l6ZSAqIE1hdGgucmFuZG9tKCkpXG4gICl9O1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgLy8gaXRlbXMgLT4gdGVybUV4YW1wbGVzXG4gIHZhciB0ZXJtRXhhbXBsZXMgPSB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7XG4gICAgcmV0dXJuIHRlcm0uZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpO1xuICB9KTtcblxuICB2YXIgY2F0ZWdvcml6ZWRFeGFtcGxlcyA9IGNhdGVnb3JpemVFeGFtcGxlcyh0ZXJtRXhhbXBsZXMpO1xuXG4gIHZhciBleGFtcGxlc05lZWRlZCA9IGNhdGVnb3JpemVkRXhhbXBsZXMuZXhhbXBsZXNOZWVkZWQ7XG4gIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBjYXRlZ29yaXplZEV4YW1wbGVzLnN1Y2Nlc3NmdWxFeGFtcGxlcztcbiAgdmFyIG5lZWRIZWxwID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5uZWVkSGVscDtcblxuICB2YXIgYW5zID0ge307XG5cbiAgLy8gQWx0IGNhbiBjb250YWluIGJvdGggYW4gZXhhbXBsZSBhbmQgYSByZXF1ZXN0IGZvciBleGFtcGxlc1xuICBpZiAoc3VjY2Vzc2Z1bEV4YW1wbGVzLmxlbmd0aCA+IDApIHtcbiAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN1Y2Nlc3NmdWxFeGFtcGxlcy5sZW5ndGgpO1xuICAgIGFucy52YWx1ZSA9IHN1Y2Nlc3NmdWxFeGFtcGxlc1tpXTtcbiAgfVxuICBpZiAoZXhhbXBsZXNOZWVkZWQubGVuZ3RoID4gMCkge1xuICAgIGFucy5leGFtcGxlc05lZWRlZCA9IGV4YW1wbGVzTmVlZGVkO1xuICB9XG4gIGFucy5uZWVkSGVscCA9IG5lZWRIZWxwO1xuXG4gIHJldHVybiBhbnM7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIHZhciBmYWN0b3JFeGFtcGxlcyA9IHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24oZmFjdG9yKSB7XG4gICAgcmV0dXJuIGZhY3Rvci5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscyk7XG4gIH0pO1xuICB2YXIgY2F0ZWdvcml6ZWRFeGFtcGxlcyA9IGNhdGVnb3JpemVFeGFtcGxlcyhmYWN0b3JFeGFtcGxlcyk7XG5cbiAgdmFyIGV4YW1wbGVzTmVlZGVkID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5leGFtcGxlc05lZWRlZDtcbiAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGNhdGVnb3JpemVkRXhhbXBsZXMuc3VjY2Vzc2Z1bEV4YW1wbGVzO1xuICB2YXIgbmVlZEhlbHAgPSBjYXRlZ29yaXplZEV4YW1wbGVzLm5lZWRIZWxwO1xuXG4gIHZhciBhbnMgPSB7fTtcblxuICAvLyBJbiBhIFNlcSwgYWxsIHBpZWNlcyBtdXN0IHN1Y2NlZWQgaW4gb3JkZXIgdG8gaGF2ZSBhIHN1Y2Nlc3NmdWwgZXhhbXBsZS5cbiAgaWYgKGV4YW1wbGVzTmVlZGVkLmxlbmd0aCA+IDAgfHwgbmVlZEhlbHApIHtcbiAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlc05lZWRlZDtcbiAgICBhbnMubmVlZEhlbHAgPSBuZWVkSGVscDtcbiAgfSBlbHNlIHtcbiAgICBhbnMudmFsdWUgPSBzdWNjZXNzZnVsRXhhbXBsZXMuam9pbihpblN5bnRhY3RpY0NvbnRleHQgPyAnICcgOiAnJyk7XG4gIH1cblxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgdmFyIHJhbmdlVGltZXMgPSBNYXRoLm1pbih0aGlzLm1heE51bU1hdGNoZXMgLSB0aGlzLm1pbk51bU1hdGNoZXMsIDMpO1xuICB2YXIgbnVtVGltZXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocmFuZ2VUaW1lcyArIDEpICsgdGhpcy5taW5OdW1NYXRjaGVzKTtcbiAgdmFyIGl0ZW1zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1UaW1lczsgaSsrKSB7XG4gICAgaXRlbXMucHVzaCh0aGlzLmV4cHIuZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpKTtcbiAgfVxuXG4gIHZhciBjYXRlZ29yaXplZEV4YW1wbGVzID0gY2F0ZWdvcml6ZUV4YW1wbGVzKGl0ZW1zKTtcblxuICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBjYXRlZ29yaXplZEV4YW1wbGVzLmV4YW1wbGVzTmVlZGVkO1xuICB2YXIgc3VjY2Vzc2Z1bEV4YW1wbGVzID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5zdWNjZXNzZnVsRXhhbXBsZXM7XG5cbiAgdmFyIGFucyA9IHt9O1xuXG4gIC8vIEl0J3MgYWx3YXlzIGVpdGhlciBvbmUgb3IgdGhlIG90aGVyLlxuICAvLyBUT0RPOiBpbnN0ZWFkIG9mICcgJywgY2FsbCAnc3BhY2VzLmdlbmVyYXRlRXhhbXBsZSgpJ1xuICBhbnMudmFsdWUgPSBzdWNjZXNzZnVsRXhhbXBsZXMuam9pbihpblN5bnRhY3RpY0NvbnRleHQgPyAnICcgOiAnJyk7XG4gIGlmIChleGFtcGxlc05lZWRlZC5sZW5ndGggPiAwKSB7XG4gICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXNOZWVkZWQ7XG4gIH1cblxuICByZXR1cm4gYW5zO1xufTtcblxuLy8gUmlnaHQgbm93LCAnTm90JyBhbmQgJ0xvb2thaGVhZCcgZ2VuZXJhdGUgbm90aGluZyBhbmQgYXNzdW1lIHRoYXQgd2hhdGV2ZXIgZm9sbG93cyB3aWxsXG4vLyAgIHdvcmsgYWNjb3JkaW5nIHRvIHRoZSBlbmNvZGVkIGNvbnN0cmFpbnRzLlxucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICByZXR1cm4ge3ZhbHVlOiAnJ307XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0KSB7XG4gIHJldHVybiB7dmFsdWU6ICcnfTtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGZhbHNlLCBhY3R1YWxzKTtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24oZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICB2YXIgYW5zID0ge307XG5cbiAgdmFyIHJ1bGVOYW1lID0gdGhpcy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpLnRvU3RyaW5nKCk7XG5cbiAgaWYgKCFleGFtcGxlcy5oYXNPd25Qcm9wZXJ0eShydWxlTmFtZSkpIHtcbiAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBbcnVsZU5hbWVdO1xuICB9IGVsc2Uge1xuICAgIHZhciByZWxldmFudEV4YW1wbGVzID0gZXhhbXBsZXNbcnVsZU5hbWVdO1xuICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVsZXZhbnRFeGFtcGxlcy5sZW5ndGgpO1xuICAgIGFucy52YWx1ZSA9IHJlbGV2YW50RXhhbXBsZXNbaV07XG4gIH1cblxuICByZXR1cm4gYW5zO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbihcbiAgICBncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gIHZhciBjaGFyO1xuICBzd2l0Y2ggKHRoaXMuY2F0ZWdvcnkpIHtcbiAgICBjYXNlICdMdSc6IGNoYXIgPSAnw4EnOyBicmVhaztcbiAgICBjYXNlICdMbCc6IGNoYXIgPSAnxY8nOyBicmVhaztcbiAgICBjYXNlICdMdCc6IGNoYXIgPSAnx4UnOyBicmVhaztcbiAgICBjYXNlICdMbSc6IGNoYXIgPSAny64nOyBicmVhaztcbiAgICBjYXNlICdMbyc6IGNoYXIgPSAnxrsnOyBicmVhaztcblxuICAgIGNhc2UgJ05sJzogY2hhciA9ICfihoInOyBicmVhaztcbiAgICBjYXNlICdOZCc6IGNoYXIgPSAnwr0nOyBicmVhaztcblxuICAgIGNhc2UgJ01uJzogY2hhciA9ICdcXHUwNDg3JzsgYnJlYWs7XG4gICAgY2FzZSAnTWMnOiBjaGFyID0gJ+Ckvyc7IGJyZWFrO1xuXG4gICAgY2FzZSAnUGMnOiBjaGFyID0gJ+KBgCc7IGJyZWFrO1xuXG4gICAgY2FzZSAnWnMnOiBjaGFyID0gJ1xcdTIwMDEnOyBicmVhaztcblxuICAgIGNhc2UgJ0wnOiBjaGFyID0gJ8OBJzsgYnJlYWs7XG4gICAgY2FzZSAnTHRtbyc6IGNoYXIgPSAnx4UnOyBicmVhaztcbiAgfVxuICByZXR1cm4ge3ZhbHVlOiBjaGFyfTsgLy8g8J+SqVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmdldEFyaXR5ID0gY29tbW9uLmFic3RyYWN0KCdnZXRBcml0eScpO1xuXG5wZXhwcnMuYW55LmdldEFyaXR5ID1cbnBleHBycy5lbmQuZ2V0QXJpdHkgPVxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdldEFyaXR5ID1cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5nZXRBcml0eSA9XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAxO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBhcml0eSAtLSB0aGlzIHByb3BlcnR5IGlzXG4gIC8vIGNoZWNrZWQgYnkgdGhlIEdyYW1tYXIgY29uc3RydWN0b3IuXG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IDAgOiB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYXJpdHkgPSAwO1xuICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgIGFyaXR5ICs9IHRoaXMuZmFjdG9yc1tpZHhdLmdldEFyaXR5KCk7XG4gIH1cbiAgcmV0dXJuIGFyaXR5O1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAwO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxucGV4cHJzLkxleC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwci5nZXRBcml0eSgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBDYWxsZWQgYXQgZ3JhbW1hciBjcmVhdGlvbiB0aW1lIHRvIHJld3JpdGUgYSBydWxlIGJvZHksIHJlcGxhY2luZyBlYWNoIHJlZmVyZW5jZSB0byBhIGZvcm1hbFxuICBwYXJhbWV0ZXIgd2l0aCBhIGBQYXJhbWAgbm9kZS4gUmV0dXJucyBhIFBFeHByIC0tIGVpdGhlciBhIG5ldyBvbmUsIG9yIHRoZSBvcmlnaW5hbCBvbmUgaWZcbiAgaXQgd2FzIG1vZGlmaWVkIGluIHBsYWNlLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gY29tbW9uLmFic3RyYWN0KCdpbnRyb2R1Y2VQYXJhbXMnKTtcblxucGV4cHJzLmFueS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLmVuZC5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLnRlcm1zLmZvckVhY2goZnVuY3Rpb24odGVybSwgaWR4LCB0ZXJtcykge1xuICAgIHRlcm1zW2lkeF0gPSB0ZXJtLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgfSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24oZm9ybWFscykge1xuICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmdW5jdGlvbihmYWN0b3IsIGlkeCwgZmFjdG9ycykge1xuICAgIGZhY3RvcnNbaWR4XSA9IGZhY3Rvci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHRoaXMuZXhwciA9IHRoaXMuZXhwci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gIHJldHVybiB0aGlzO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbihmb3JtYWxzKSB7XG4gIHZhciBpbmRleCA9IGZvcm1hbHMuaW5kZXhPZih0aGlzLnJ1bGVOYW1lKTtcbiAgaWYgKGluZGV4ID49IDApIHtcbiAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIHN1cHBvcnRlZD8gU2VlIGlzc3VlICM2NC5cbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyaXplZCBydWxlcyBjYW5ub3QgYmUgcGFzc2VkIGFzIGFyZ3VtZW50cyB0byBhbm90aGVyIHJ1bGUuJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGV4cHJzLlBhcmFtKGluZGV4KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbihhcmcsIGlkeCwgYXJncykge1xuICAgICAgYXJnc1tpZHhdID0gYXJnLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHBhcnNpbmcgZXhwcmVzc2lvbiBtYXkgYWNjZXB0IHdpdGhvdXQgY29uc3VtaW5nIGFueSBpbnB1dC5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuaXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIpIHtcbiAgcmV0dXJuIHRoaXMuX2lzTnVsbGFibGUoZ3JhbW1hciwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG59O1xuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9pc051bGxhYmxlID0gY29tbW9uLmFic3RyYWN0KCdfaXNOdWxsYWJsZScpO1xuXG5wZXhwcnMuYW55Ll9pc051bGxhYmxlID1cbnBleHBycy5SYW5nZS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG5wZXhwcnMuUGx1cy5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxucGV4cHJzLmVuZC5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgcmV0dXJuIHRydWU7XG59O1xuXG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJykge1xuICAgIC8vIFRoaXMgaXMgYW4gb3Zlci1zaW1wbGlmaWNhdGlvbjogaXQncyBvbmx5IGNvcnJlY3QgaWYgdGhlIGlucHV0IGlzIGEgc3RyaW5nLiBJZiBpdCdzIGFuIGFycmF5XG4gICAgLy8gb3IgYW4gb2JqZWN0LCB0aGVuIHRoZSBlbXB0eSBzdHJpbmcgcGFyc2luZyBleHByZXNzaW9uIGlzIG5vdCBudWxsYWJsZS5cbiAgICByZXR1cm4gdGhpcy5vYmogPT09ICcnO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCB8fFxuICAgICAgdGhpcy50ZXJtcy5zb21lKGZ1bmN0aW9uKHRlcm0pIHsgcmV0dXJuIHRlcm0uX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbihncmFtbWFyLCBtZW1vKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMuZXZlcnkoZnVuY3Rpb24oZmFjdG9yKSB7IHJldHVybiBmYWN0b3IuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcblxucGV4cHJzLlN0YXIucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5PcHQucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Ob3QucHJvdG90eXBlLl9pc051bGxhYmxlID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24oZ3JhbW1hciwgbWVtbykge1xuICByZXR1cm4gdGhpcy5leHByLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uKGdyYW1tYXIsIG1lbW8pIHtcbiAgdmFyIGtleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1lbW8sIGtleSkpIHtcbiAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV0uYm9keTtcbiAgICB2YXIgaW5saW5lZCA9IGJvZHkuc3Vic3RpdHV0ZVBhcmFtcyh0aGlzLmFyZ3MpO1xuICAgIG1lbW9ba2V5XSA9IGZhbHNlOyAgLy8gUHJldmVudCBpbmZpbml0ZSByZWN1cnNpb24gZm9yIHJlY3Vyc2l2ZSBydWxlcy5cbiAgICBtZW1vW2tleV0gPSBpbmxpbmVkLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xuICB9XG4gIHJldHVybiBtZW1vW2tleV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGdldE1ldGFJbmZvKGV4cHIsIGdyYW1tYXJJbnRlcnZhbCkge1xuICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgaWYgKGV4cHIuc291cmNlICYmIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHZhciBhZGp1c3RlZCA9IGV4cHIuc291cmNlLnJlbGF0aXZlVG8oZ3JhbW1hckludGVydmFsKTtcbiAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCA9IFthZGp1c3RlZC5zdGFydElkeCwgYWRqdXN0ZWQuZW5kSWR4XTtcbiAgfVxuICByZXR1cm4gbWV0YUluZm87XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGNvbW1vbi5hYnN0cmFjdCgnb3V0cHV0UmVjaXBlJyk7XG5cbnBleHBycy5hbnkub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHJldHVybiBbJ2FueScsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCldO1xufTtcblxucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFsnZW5kJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xuXG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICByZXR1cm4gW1xuICAgICd0ZXJtaW5hbCcsXG4gICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICB0aGlzLm9ialxuICBdO1xufTtcblxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICAncmFuZ2UnLFxuICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgdGhpcy5mcm9tLFxuICAgIHRoaXMudG9cbiAgXTtcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24oZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gIHJldHVybiBbXG4gICAgJ3BhcmFtJyxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgIHRoaXMuaW5kZXhcbiAgXTtcbn07XG5cbnBleHBycy5BbHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICByZXR1cm4gW1xuICAgICdhbHQnLFxuICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbClcbiAgXS5jb25jYXQodGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkge1xuICAgIHJldHVybiB0ZXJtLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xuICB9KSk7XG59O1xuXG5wZXhwcnMuRXh0ZW5kLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgdmFyIGV4dGVuc2lvbiA9IHRoaXMudGVybXNbMF07IC8vIFtleHRlbnNpb24sIG9yZ2luYWxdXG4gIHJldHVybiBleHRlbnNpb24ub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICAnc2VxJyxcbiAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpXG4gIF0uY29uY2F0KHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24oZmFjdG9yKSB7XG4gICAgcmV0dXJuIGZhY3Rvci5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgfSkpO1xufTtcblxucGV4cHJzLlN0YXIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuUGx1cy5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbnBleHBycy5PcHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG5wZXhwcnMuTm90LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbnBleHBycy5MZXgucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICByZXR1cm4gW1xuICAgIHRoaXMuY29uc3RydWN0b3IubmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgdGhpcy5leHByLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpXG4gIF07XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICByZXR1cm4gW1xuICAgICdhcHAnLFxuICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgdGhpcy5ydWxlTmFtZSxcbiAgICB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uKGFyZykge1xuICAgICAgcmV0dXJuIGFyZy5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbiAgICB9KVxuICBdO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbihmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgcmV0dXJuIFtcbiAgICAndW5pY29kZUNoYXInLFxuICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgdGhpcy5jYXRlZ29yeVxuICBdO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKlxuICBSZXR1cm5zIGEgUEV4cHIgdGhhdCByZXN1bHRzIGZyb20gcmVjdXJzaXZlbHkgcmVwbGFjaW5nIGV2ZXJ5IGZvcm1hbCBwYXJhbWV0ZXIgKGkuZS4sIGluc3RhbmNlXG4gIG9mIGBQYXJhbWApIGluc2lkZSB0aGlzIFBFeHByIHdpdGggaXRzIGFjdHVhbCB2YWx1ZSBmcm9tIGBhY3R1YWxzYCAoYW4gQXJyYXkpLlxuXG4gIFRoZSByZWNlaXZlciBtdXN0IG5vdCBiZSBtb2RpZmllZDsgYSBuZXcgUEV4cHIgbXVzdCBiZSByZXR1cm5lZCBpZiBhbnkgcmVwbGFjZW1lbnQgaXMgbmVjZXNzYXJ5LlxuKi9cbi8vIGZ1bmN0aW9uKGFjdHVhbHMpIHsgLi4uIH1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnc3Vic3RpdHV0ZVBhcmFtcycpO1xuXG5wZXhwcnMuYW55LnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLmVuZC5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gdGhpcztcbn07XG5cbnBleHBycy5QYXJhbS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uKGFjdHVhbHMpIHtcbiAgcmV0dXJuIGFjdHVhbHNbdGhpcy5pbmRleF07XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24oYWN0dWFscykge1xuICByZXR1cm4gbmV3IHBleHBycy5BbHQoXG4gICAgICB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7IHJldHVybiB0ZXJtLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBuZXcgcGV4cHJzLlNlcShcbiAgICAgIHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24oZmFjdG9yKSB7IHJldHVybiBmYWN0b3Iuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSkpO1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbnBleHBycy5MZXgucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLmV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbihhY3R1YWxzKSB7XG4gIGlmICh0aGlzLmFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgLy8gQXZvaWQgbWFraW5nIGEgY29weSBvZiB0aGlzIGFwcGxpY2F0aW9uLCBhcyBhbiBvcHRpbWl6YXRpb25cbiAgICByZXR1cm4gdGhpcztcbiAgfSBlbHNlIHtcbiAgICB2YXIgYXJncyA9IHRoaXMuYXJncy5tYXAoZnVuY3Rpb24oYXJnKSB7IHJldHVybiBhcmcuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSk7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkodGhpcy5ydWxlTmFtZSwgYXJncyk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuXG52YXIgY29weVdpdGhvdXREdXBsaWNhdGVzID0gY29tbW9uLmNvcHlXaXRob3V0RHVwbGljYXRlcztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGlzUmVzdHJpY3RlZEpTSWRlbnRpZmllcihzdHIpIHtcbiAgcmV0dXJuIC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8udGVzdChzdHIpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpIHtcbiAgLy8gYGNvdW50YCBpcyB1c2VkIHRvIHJlY29yZCB0aGUgbnVtYmVyIG9mIHRpbWVzIGVhY2ggYXJndW1lbnQgbmFtZSBvY2N1cnMgaW4gdGhlIGxpc3QsXG4gIC8vIHRoaXMgaXMgdXNlZnVsIGZvciBjaGVja2luZyBkdXBsaWNhdGVkIGFyZ3VtZW50IG5hbWUuIEl0IG1hcHMgYXJndW1lbnQgbmFtZXMgdG8gaW50cy5cbiAgdmFyIGNvdW50ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGFyZ05hbWUpIHtcbiAgICBjb3VudFthcmdOYW1lXSA9IChjb3VudFthcmdOYW1lXSB8fCAwKSArIDE7XG4gIH0pO1xuXG4gIC8vIEFwcGVuZCBzdWJzY3JpcHRzICgnXzEnLCAnXzInLCAuLi4pIHRvIGR1cGxpY2F0ZSBhcmd1bWVudCBuYW1lcy5cbiAgT2JqZWN0LmtleXMoY291bnQpLmZvckVhY2goZnVuY3Rpb24oZHVwQXJnTmFtZSkge1xuICAgIGlmIChjb3VudFtkdXBBcmdOYW1lXSA8PSAxKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhpcyBuYW1lIHNob3dzIHVwIG1vcmUgdGhhbiBvbmNlLCBzbyBhZGQgc3Vic2NyaXB0cy5cbiAgICB2YXIgc3Vic2NyaXB0ID0gMTtcbiAgICBhcmd1bWVudE5hbWVMaXN0LmZvckVhY2goZnVuY3Rpb24oYXJnTmFtZSwgaWR4KSB7XG4gICAgICBpZiAoYXJnTmFtZSA9PT0gZHVwQXJnTmFtZSkge1xuICAgICAgICBhcmd1bWVudE5hbWVMaXN0W2lkeF0gPSBhcmdOYW1lICsgJ18nICsgc3Vic2NyaXB0Kys7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLypcbiAgUmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgYmUgdXNlZCBhcyB0aGUgZGVmYXVsdCBhcmd1bWVudCBuYW1lcyBmb3IgaXRzIHJlY2VpdmVyXG4gIChhIHBleHByKSBpbiBhIHNlbWFudGljIGFjdGlvbi4gVGhpcyBpcyB1c2VkIGV4Y2x1c2l2ZWx5IGJ5IHRoZSBTZW1hbnRpY3MgRWRpdG9yLlxuXG4gIGBmaXJzdEFyZ0luZGV4YCBpcyB0aGUgMS1iYXNlZCBpbmRleCBvZiB0aGUgZmlyc3QgYXJndW1lbnQgbmFtZSB0aGF0IHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB0aGlzXG4gIHBleHByLiBJdCBlbmFibGVzIHVzIHRvIG5hbWUgYXJndW1lbnRzIHBvc2l0aW9uYWxseSwgZS5nLiwgaWYgdGhlIHNlY29uZCBhcmd1bWVudCBpcyBhXG4gIG5vbi1hbHBoYW51bWVyaWMgdGVybWluYWwgbGlrZSBcIitcIiwgaXQgd2lsbCBiZSBuYW1lZCAnJDInLlxuXG4gIGBub0R1cENoZWNrYCBpcyB0cnVlIGlmIHRoZSBjYWxsZXIgb2YgYHRvQXJndW1lbnROYW1lTGlzdGAgaXMgbm90IGEgdG9wIGxldmVsIGNhbGxlci4gSXQgZW5hYmxlc1xuICB1cyB0byBhdm9pZCBuZXN0ZWQgZHVwbGljYXRpb24gc3Vic2NyaXB0cyBhcHBlbmRpbmcsIGUuZy4sICdfMV8xJywgJ18xXzInLCBieSBvbmx5IGNoZWNraW5nXG4gIGR1cGxpY2F0ZXMgYXQgdGhlIHRvcCBsZXZlbC5cblxuICBIZXJlIGlzIGEgbW9yZSBlbGFib3JhdGUgZXhhbXBsZSB0aGF0IGlsbHVzdHJhdGVzIGhvdyB0aGlzIG1ldGhvZCB3b3JrczpcbiAgYChhIFwiK1wiIGIpLnRvQXJndW1lbnROYW1lTGlzdCgxKWAgZXZhbHVhdGVzIHRvIGBbJ2EnLCAnJDInLCAnYiddYCB3aXRoIHRoZSBmb2xsb3dpbmcgcmVjdXJzaXZlXG4gIGNhbGxzOlxuXG4gICAgKGEpLnRvQXJndW1lbnROYW1lTGlzdCgxKSAtPiBbJ2EnXSxcbiAgICAoXCIrXCIpLnRvQXJndW1lbnROYW1lTGlzdCgyKSAtPiBbJyQyJ10sXG4gICAgKGIpLnRvQXJndW1lbnROYW1lTGlzdCgzKSAtPiBbJ2InXVxuXG4gIE5vdGVzOlxuICAqIFRoaXMgbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgb24gd2VsbC1mb3JtZWQgZXhwcmVzc2lvbnMsIGUuZy4sIHRoZSByZWNlaXZlciBtdXN0XG4gICAgbm90IGhhdmUgYW55IEFsdCBzdWItZXhwcmVzc2lvbnMgd2l0aCBpbmNvbnNpc3RlbnQgYXJpdGllcy5cbiAgKiBlLmdldEFyaXR5KCkgPT09IGUudG9Bcmd1bWVudE5hbWVMaXN0KDEpLmxlbmd0aFxuKi9cbi8vIGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHsgLi4uIH1cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gY29tbW9uLmFic3RyYWN0KCd0b0FyZ3VtZW50TmFtZUxpc3QnKTtcblxucGV4cHJzLmFueS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiBbJ2FueSddO1xufTtcblxucGV4cHJzLmVuZC50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiBbJ2VuZCddO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIGlmICh0eXBlb2YgdGhpcy5vYmogPT09ICdzdHJpbmcnICYmIC9eW19hLXpBLVowLTldKyQvLnRlc3QodGhpcy5vYmopKSB7XG4gICAgLy8gSWYgdGhpcyB0ZXJtaW5hbCBpcyBhIHZhbGlkIHN1ZmZpeCBmb3IgYSBKUyBpZGVudGlmaWVyLCBqdXN0IHByZXBlbmQgaXQgd2l0aCAnXydcbiAgICByZXR1cm4gWydfJyArIHRoaXMub2JqXTtcbiAgfSBlbHNlIHtcbiAgICAvLyBPdGhlcndpc2UsIG5hbWUgaXQgcG9zaXRpb25hbGx5LlxuICAgIHJldHVybiBbJyQnICsgZmlyc3RBcmdJbmRleF07XG4gIH1cbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICB2YXIgYXJnTmFtZSA9IHRoaXMuZnJvbSArICdfdG9fJyArIHRoaXMudG87XG4gIC8vIElmIHRoZSBgYXJnTmFtZWAgaXMgbm90IHZhbGlkIHRoZW4gdHJ5IHRvIHByZXBlbmQgYSBgX2AuXG4gIGlmICghaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKGFyZ05hbWUpKSB7XG4gICAgYXJnTmFtZSA9ICdfJyArIGFyZ05hbWU7XG4gIH1cbiAgLy8gSWYgdGhlIGBhcmdOYW1lYCBzdGlsbCBub3QgdmFsaWQgYWZ0ZXIgcHJlcGVuZGluZyBhIGBfYCwgdGhlbiBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgaWYgKCFpc1Jlc3RyaWN0ZWRKU0lkZW50aWZpZXIoYXJnTmFtZSkpIHtcbiAgICBhcmdOYW1lID0gJyQnICsgZmlyc3RBcmdJbmRleDtcbiAgfVxuICByZXR1cm4gW2FyZ05hbWVdO1xufTtcblxucGV4cHJzLkFsdC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAvLyBgdGVybUFyZ05hbWVMaXN0c2AgaXMgYW4gYXJyYXkgb2YgYXJyYXlzIHdoZXJlIGVhY2ggcm93IGlzIHRoZVxuICAvLyBhcmd1bWVudCBuYW1lIGxpc3QgdGhhdCBjb3JyZXNwb25kcyB0byBhIHRlcm0gaW4gdGhpcyBhbHRlcm5hdGlvbi5cbiAgdmFyIHRlcm1BcmdOYW1lTGlzdHMgPSB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbih0ZXJtKSB7XG4gICAgcmV0dXJuIHRlcm0udG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIHRydWUpO1xuICB9KTtcblxuICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICB2YXIgbnVtQXJncyA9IHRlcm1BcmdOYW1lTGlzdHNbMF0ubGVuZ3RoO1xuICBmb3IgKHZhciBjb2xJZHggPSAwOyBjb2xJZHggPCBudW1BcmdzOyBjb2xJZHgrKykge1xuICAgIHZhciBjb2wgPSBbXTtcbiAgICBmb3IgKHZhciByb3dJZHggPSAwOyByb3dJZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgcm93SWR4KyspIHtcbiAgICAgIGNvbC5wdXNoKHRlcm1BcmdOYW1lTGlzdHNbcm93SWR4XVtjb2xJZHhdKTtcbiAgICB9XG4gICAgdmFyIHVuaXF1ZU5hbWVzID0gY29weVdpdGhvdXREdXBsaWNhdGVzKGNvbCk7XG4gICAgYXJndW1lbnROYW1lTGlzdC5wdXNoKHVuaXF1ZU5hbWVzLmpvaW4oJ19vcl8nKSk7XG4gIH1cblxuICBpZiAoIW5vRHVwQ2hlY2spIHtcbiAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICB9XG4gIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcblxucGV4cHJzLlNlcS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAvLyBHZW5lcmF0ZSB0aGUgYXJndW1lbnQgbmFtZSBsaXN0LCB3aXRob3V0IHdvcnJ5aW5nIGFib3V0IGR1cGxpY2F0ZXMuXG4gIHZhciBhcmd1bWVudE5hbWVMaXN0ID0gW107XG4gIHRoaXMuZmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uKGZhY3Rvcikge1xuICAgIHZhciBmYWN0b3JBcmd1bWVudE5hbWVMaXN0ID0gZmFjdG9yLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCB0cnVlKTtcbiAgICBhcmd1bWVudE5hbWVMaXN0ID0gYXJndW1lbnROYW1lTGlzdC5jb25jYXQoZmFjdG9yQXJndW1lbnROYW1lTGlzdCk7XG5cbiAgICAvLyBTaGlmdCB0aGUgZmlyc3RBcmdJbmRleCB0byB0YWtlIHRoaXMgZmFjdG9yJ3MgYXJndW1lbnQgbmFtZXMgaW50byBhY2NvdW50LlxuICAgIGZpcnN0QXJnSW5kZXggKz0gZmFjdG9yQXJndW1lbnROYW1lTGlzdC5sZW5ndGg7XG4gIH0pO1xuICBpZiAoIW5vRHVwQ2hlY2spIHtcbiAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICB9XG4gIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcblxucGV4cHJzLkl0ZXIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgdmFyIGFyZ3VtZW50TmFtZUxpc3QgPSB0aGlzLmV4cHIudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spXG4gICAgLm1hcChmdW5jdGlvbihleHByQXJndW1lbnRTdHJpbmcpIHtcbiAgICAgIHJldHVybiBleHByQXJndW1lbnRTdHJpbmdbZXhwckFyZ3VtZW50U3RyaW5nLmxlbmd0aCAtIDFdID09PSAncycgP1xuICAgICAgICAgIGV4cHJBcmd1bWVudFN0cmluZyArICdlcycgOlxuICAgICAgICAgIGV4cHJBcmd1bWVudFN0cmluZyArICdzJztcbiAgICB9KTtcbiAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KTtcbiAgfVxuICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5cbnBleHBycy5PcHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykubWFwKGZ1bmN0aW9uKGFyZ05hbWUpIHtcbiAgICByZXR1cm4gJ29wdCcgKyBhcmdOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBhcmdOYW1lLnNsaWNlKDEpO1xuICB9KTtcbn07XG5cbnBleHBycy5Ob3QucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgcmV0dXJuIFtdO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID1cbnBleHBycy5MZXgucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjayk7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgcmV0dXJuIFt0aGlzLnJ1bGVOYW1lXTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24oZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICByZXR1cm4gWyckJyArIGZpcnN0QXJnSW5kZXhdO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gIHJldHVybiBbJ3BhcmFtJyArIHRoaXMuaW5kZXhdO1xufTtcblxuLy8gXCJWYWx1ZSBwZXhwcnNcIiAoVmFsdWUsIFN0ciwgQXJyLCBPYmopIGFyZSBnb2luZyBhd2F5IHNvb24sIHNvIHdlIGRvbid0IHdvcnJ5IGFib3V0IHRoZW0gaGVyZS5cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgUEV4cHIsIGZvciB1c2UgYXMgYSBVSSBsYWJlbCwgZXRjLlxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBjb21tb24uYWJzdHJhY3QoJ3RvRGlzcGxheVN0cmluZycpO1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLlNlcS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG5wZXhwcnMuTGV4LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnRyaW1tZWQoKS5jb250ZW50cztcbiAgfVxuICByZXR1cm4gJ1snICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJ10nO1xufTtcblxucGV4cHJzLmFueS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdhbnknO1xufTtcblxucGV4cHJzLmVuZC50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdlbmQnO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMub2JqKTtcbn07XG5cbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcjJyArIHRoaXMuaW5kZXg7XG59O1xuXG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdVbmljb2RlIHsnICsgdGhpcy5jYXRlZ29yeSArICd9IGNoYXJhY3Rlcic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIEZhaWx1cmUgPSByZXF1aXJlKCcuL0ZhaWx1cmUnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRmFpbHVyZSA9IGNvbW1vbi5hYnN0cmFjdCgndG9GYWlsdXJlJyk7XG5cbnBleHBycy5hbnkudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2FueSBvYmplY3QnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5lbmQudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2VuZCBvZiBpbnB1dCcsICdkZXNjcmlwdGlvbicpO1xufTtcblxucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCB0aGlzLm9iaiwgJ3N0cmluZycpO1xufTtcblxucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIC8vIFRPRE86IGNvbWUgdXAgd2l0aCBzb21ldGhpbmcgYmV0dGVyXG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pLCAnY29kZScpO1xufTtcblxucGV4cHJzLk5vdC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmV4cHIgPT09IHBleHBycy5hbnkgP1xuICAgICAgJ25vdGhpbmcnIDpcbiAgICAgICdub3QgJyArIHRoaXMuZXhwci50b0ZhaWx1cmUoZ3JhbW1hcik7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHJldHVybiB0aGlzLmV4cHIudG9GYWlsdXJlKGdyYW1tYXIpO1xufTtcblxucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBkZXNjcmlwdGlvbiA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV0uZGVzY3JpcHRpb247XG4gIGlmICghZGVzY3JpcHRpb24pIHtcbiAgICB2YXIgYXJ0aWNsZSA9ICgvXlthZWlvdUFFSU9VXS8udGVzdCh0aGlzLnJ1bGVOYW1lKSA/ICdhbicgOiAnYScpO1xuICAgIGRlc2NyaXB0aW9uID0gYXJ0aWNsZSArICcgJyArIHRoaXMucnVsZU5hbWU7XG4gIH1cbiAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24oZ3JhbW1hcikge1xuICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgdGhpcy50b0Rpc3BsYXlTdHJpbmcoKSwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBmcyA9IHRoaXMudGVybXMubWFwKGZ1bmN0aW9uKHQpIHsgcmV0dXJuIHQudG9GYWlsdXJlKCk7IH0pO1xuICB2YXIgZGVzY3JpcHRpb24gPSAnKCcgKyBmcy5qb2luKCcgb3IgJykgKyAnKSc7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuXG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBmcyA9IHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24oZikgeyByZXR1cm4gZi50b0ZhaWx1cmUoKTsgfSk7XG4gIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIGZzLmpvaW4oJyAnKSArICcpJztcbiAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5cbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbihncmFtbWFyKSB7XG4gIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIHRoaXMuZXhwci50b0ZhaWx1cmUoKSArIHRoaXMub3BlcmF0b3IgKyAnKSc7XG4gIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qXG4gIGUxLnRvU3RyaW5nKCkgPT09IGUyLnRvU3RyaW5nKCkgPT0+IGUxIGFuZCBlMiBhcmUgc2VtYW50aWNhbGx5IGVxdWl2YWxlbnQuXG4gIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBpZmYgKDw9PT4pOiBlLmcuLFxuICAoflwiYlwiIFwiYVwiKS50b1N0cmluZygpICE9PSAoXCJhXCIpLnRvU3RyaW5nKCksIGV2ZW4gdGhvdWdoXG4gIH5cImJcIiBcImFcIiBhbmQgXCJhXCIgYXJlIGludGVyY2hhbmdlYWJsZSBpbiBhbnkgZ3JhbW1hcixcbiAgYm90aCBpbiB0ZXJtcyBvZiB0aGUgbGFuZ3VhZ2VzIHRoZXkgYWNjZXB0IGFuZCB0aGVpciBhcml0aWVzLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9TdHJpbmcgPSBjb21tb24uYWJzdHJhY3QoJ3RvU3RyaW5nJyk7XG5cbnBleHBycy5hbnkudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICdhbnknO1xufTtcblxucGV4cHJzLmVuZC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ2VuZCc7XG59O1xuXG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xuXG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcblxucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJyQnICsgdGhpcy5pbmRleDtcbn07XG5cbnBleHBycy5MZXgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnIygnICsgdGhpcy5leHByLnRvU3RyaW5nKCkgKyAnKSc7XG59O1xuXG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDEgP1xuICAgIHRoaXMudGVybXNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24odGVybSkgeyByZXR1cm4gdGVybS50b1N0cmluZygpOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG5cbnBleHBycy5TZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmZhY3RvcnMubGVuZ3RoID09PSAxID9cbiAgICB0aGlzLmZhY3RvcnNbMF0udG9TdHJpbmcoKSA6XG4gICAgJygnICsgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbihmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci50b1N0cmluZygpOyB9KS5qb2luKCcgJykgKyAnKSc7XG59O1xuXG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMuZXhwciArIHRoaXMub3BlcmF0b3I7XG59O1xuXG5wZXhwcnMuTm90LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ34nICsgdGhpcy5leHByO1xufTtcblxucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuICcmJyArIHRoaXMuZXhwcjtcbn07XG5cbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgdmFyIHBzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbihhcmcpIHsgcmV0dXJuIGFyZy50b1N0cmluZygpOyB9KTtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlTmFtZTtcbiAgfVxufTtcblxucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gJ1xcXFxweycgKyB0aGlzLmNhdGVnb3J5ICsgJ30nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnZhciBVbmljb2RlQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uL3RoaXJkX3BhcnR5L1VuaWNvZGVDYXRlZ29yaWVzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIGluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdlbmVyYWwgc3R1ZmZcblxuZnVuY3Rpb24gUEV4cHIoKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIlBFeHByIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXQncyBhYnN0cmFjdFwiKTtcbn1cblxuLy8gU2V0IHRoZSBgc291cmNlYCBwcm9wZXJ0eSB0byB0aGUgaW50ZXJ2YWwgY29udGFpbmluZyB0aGUgc291cmNlIGZvciB0aGlzIGV4cHJlc3Npb24uXG5QRXhwci5wcm90b3R5cGUud2l0aFNvdXJjZSA9IGZ1bmN0aW9uKGludGVydmFsKSB7XG4gIGlmIChpbnRlcnZhbCkge1xuICAgIHRoaXMuc291cmNlID0gaW50ZXJ2YWwudHJpbW1lZCgpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gQW55XG5cbnZhciBhbnkgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG5cbi8vIEVuZFxuXG52YXIgZW5kID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuXG4vLyBUZXJtaW5hbHNcblxuZnVuY3Rpb24gVGVybWluYWwob2JqKSB7XG4gIHRoaXMub2JqID0gb2JqO1xufVxuaW5oZXJpdHMoVGVybWluYWwsIFBFeHByKTtcblxuLy8gUmFuZ2VzXG5cbmZ1bmN0aW9uIFJhbmdlKGZyb20sIHRvKSB7XG4gIHRoaXMuZnJvbSA9IGZyb207XG4gIHRoaXMudG8gPSB0bztcbn1cbmluaGVyaXRzKFJhbmdlLCBQRXhwcik7XG5cbi8vIFBhcmFtZXRlcnNcblxuZnVuY3Rpb24gUGFyYW0oaW5kZXgpIHtcbiAgdGhpcy5pbmRleCA9IGluZGV4O1xufVxuaW5oZXJpdHMoUGFyYW0sIFBFeHByKTtcblxuLy8gQWx0ZXJuYXRpb25cblxuZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gIHRoaXMudGVybXMgPSB0ZXJtcztcbn1cbmluaGVyaXRzKEFsdCwgUEV4cHIpO1xuXG4vLyBFeHRlbmQgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG5cbmZ1bmN0aW9uIEV4dGVuZChzdXBlckdyYW1tYXIsIG5hbWUsIGJvZHkpIHtcbiAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYm9keSA9IGJvZHk7XG4gIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlc1tuYW1lXS5ib2R5O1xuICB0aGlzLnRlcm1zID0gW2JvZHksIG9yaWdCb2R5XTtcbn1cbmluaGVyaXRzKEV4dGVuZCwgQWx0KTtcblxuLy8gU2VxdWVuY2VzXG5cbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gIHRoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG59XG5pbmhlcml0cyhTZXEsIFBFeHByKTtcblxuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcblxuZnVuY3Rpb24gSXRlcihleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhJdGVyLCBQRXhwcik7XG5cbmZ1bmN0aW9uIFN0YXIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RhciwgSXRlcik7XG5cbmZ1bmN0aW9uIFBsdXMoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoUGx1cywgSXRlcik7XG5cbmZ1bmN0aW9uIE9wdChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhPcHQsIEl0ZXIpO1xuXG5TdGFyLnByb3RvdHlwZS5vcGVyYXRvciA9ICcqJztcblBsdXMucHJvdG90eXBlLm9wZXJhdG9yID0gJysnO1xuT3B0LnByb3RvdHlwZS5vcGVyYXRvciA9ICc/JztcblxuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5cblN0YXIucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5QbHVzLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuT3B0LnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gMTtcblxuLy8gUHJlZGljYXRlc1xuXG5mdW5jdGlvbiBOb3QoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTm90LCBQRXhwcik7XG5cbmZ1bmN0aW9uIExvb2thaGVhZChleHByKSB7XG4gIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhMb29rYWhlYWQsIFBFeHByKTtcblxuLy8gXCJMZXhpZmljYXRpb25cIlxuXG5mdW5jdGlvbiBMZXgoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTGV4LCBQRXhwcik7XG5cbi8vIEFycmF5IGRlY29tcG9zaXRpb25cblxuZnVuY3Rpb24gQXJyKGV4cHIpIHtcbiAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKEFyciwgUEV4cHIpO1xuXG4vLyBTdHJpbmcgZGVjb21wb3NpdGlvblxuXG5mdW5jdGlvbiBTdHIoZXhwcikge1xuICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RyLCBQRXhwcik7XG5cbi8vIE9iamVjdCBkZWNvbXBvc2l0aW9uXG5cbmZ1bmN0aW9uIE9iaihwcm9wZXJ0aWVzLCBpc0xlbmllbnQpIHtcbiAgdmFyIG5hbWVzID0gcHJvcGVydGllcy5tYXAoZnVuY3Rpb24ocHJvcGVydHkpIHsgcmV0dXJuIHByb3BlcnR5Lm5hbWU7IH0pO1xuICB2YXIgZHVwbGljYXRlcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKG5hbWVzKTtcbiAgaWYgKGR1cGxpY2F0ZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMucHJvcGVydGllcyA9IHByb3BlcnRpZXM7XG4gICAgdGhpcy5pc0xlbmllbnQgPSBpc0xlbmllbnQ7XG4gIH1cbn1cbmluaGVyaXRzKE9iaiwgUEV4cHIpO1xuXG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lLCBvcHRBcmdzKSB7XG4gIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgdGhpcy5hcmdzID0gb3B0QXJncyB8fCBbXTtcbn1cbmluaGVyaXRzKEFwcGx5LCBQRXhwcik7XG5cbkFwcGx5LnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpO1xufTtcblxuLy8gVGhpcyBtZXRob2QganVzdCBjYWNoZXMgdGhlIHJlc3VsdCBvZiBgdGhpcy50b1N0cmluZygpYCBpbiBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5LlxuQXBwbHkucHJvdG90eXBlLnRvTWVtb0tleSA9IGZ1bmN0aW9uKCkge1xuICBpZiAoIXRoaXMuX21lbW9LZXkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19tZW1vS2V5Jywge3ZhbHVlOiB0aGlzLnRvU3RyaW5nKCl9KTtcbiAgfVxuICByZXR1cm4gdGhpcy5fbWVtb0tleTtcbn07XG5cbi8vIFVuaWNvZGUgY2hhcmFjdGVyXG5cbmZ1bmN0aW9uIFVuaWNvZGVDaGFyKGNhdGVnb3J5KSB7XG4gIHRoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgdGhpcy5wYXR0ZXJuID0gVW5pY29kZUNhdGVnb3JpZXNbY2F0ZWdvcnldO1xufVxuaW5oZXJpdHMoVW5pY29kZUNoYXIsIFBFeHByKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmV4cG9ydHMuUEV4cHIgPSBQRXhwcjtcbmV4cG9ydHMuYW55ID0gYW55O1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlRlcm1pbmFsID0gVGVybWluYWw7XG5leHBvcnRzLlJhbmdlID0gUmFuZ2U7XG5leHBvcnRzLlBhcmFtID0gUGFyYW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kID0gRXh0ZW5kO1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkl0ZXIgPSBJdGVyO1xuZXhwb3J0cy5TdGFyID0gU3RhcjtcbmV4cG9ydHMuUGx1cyA9IFBsdXM7XG5leHBvcnRzLk9wdCA9IE9wdDtcbmV4cG9ydHMuTm90ID0gTm90O1xuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWQ7XG5leHBvcnRzLkxleCA9IExleDtcbmV4cG9ydHMuQXJyID0gQXJyO1xuZXhwb3J0cy5TdHIgPSBTdHI7XG5leHBvcnRzLk9iaiA9IE9iajtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcbmV4cG9ydHMuVW5pY29kZUNoYXIgPSBVbmljb2RlQ2hhcjtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4dGVuc2lvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbnJlcXVpcmUoJy4vcGV4cHJzLWFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1jaGVjaycpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtZ2V0QXJpdHknKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdlbmVyYXRlRXhhbXBsZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWlzTnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0ZhaWx1cmUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvU3RyaW5nJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vIEdpdmVuIGFuIGFycmF5IG9mIG51bWJlcnMgYGFycmAsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbnVtYmVycyBhcyBzdHJpbmdzLFxuLy8gcmlnaHQtanVzdGlmaWVkIGFuZCBwYWRkZWQgdG8gdGhlIHNhbWUgbGVuZ3RoLlxuZnVuY3Rpb24gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoYXJyKSB7XG4gIHZhciBtYXhMZW4gPSAwO1xuICB2YXIgc3RyaW5ncyA9IGFyci5tYXAoZnVuY3Rpb24obikge1xuICAgIHZhciBzdHIgPSBuLnRvU3RyaW5nKCk7XG4gICAgbWF4TGVuID0gTWF0aC5tYXgobWF4TGVuLCBzdHIubGVuZ3RoKTtcbiAgICByZXR1cm4gc3RyO1xuICB9KTtcbiAgcmV0dXJuIHN0cmluZ3MubWFwKGZ1bmN0aW9uKHMpIHsgcmV0dXJuIGNvbW1vbi5wYWRMZWZ0KHMsIG1heExlbik7IH0pO1xufVxuXG4vLyBQcm9kdWNlIGEgbmV3IHN0cmluZyB0aGF0IHdvdWxkIGJlIHRoZSByZXN1bHQgb2YgY29weWluZyB0aGUgY29udGVudHNcbi8vIG9mIHRoZSBzdHJpbmcgYHNyY2Agb250byBgZGVzdGAgYXQgb2Zmc2V0IGBvZmZlc3RgLlxuZnVuY3Rpb24gc3RyY3B5KGRlc3QsIHNyYywgb2Zmc2V0KSB7XG4gIHZhciBvcmlnRGVzdExlbiA9IGRlc3QubGVuZ3RoO1xuICB2YXIgc3RhcnQgPSBkZXN0LnNsaWNlKDAsIG9mZnNldCk7XG4gIHZhciBlbmQgPSBkZXN0LnNsaWNlKG9mZnNldCArIHNyYy5sZW5ndGgpO1xuICByZXR1cm4gKHN0YXJ0ICsgc3JjICsgZW5kKS5zdWJzdHIoMCwgb3JpZ0Rlc3RMZW4pO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnaXZlblxuLy8gb2Zmc2V0IGluIGBzdHJgLlxuZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uID0gZnVuY3Rpb24oc3RyLCBvZmZzZXQpIHtcbiAgdmFyIGxpbmVOdW0gPSAxO1xuICB2YXIgY29sTnVtID0gMTtcblxuICB2YXIgY3Vyck9mZnNldCA9IDA7XG4gIHZhciBsaW5lU3RhcnRPZmZzZXQgPSAwO1xuXG4gIHZhciBuZXh0TGluZSA9IG51bGw7XG4gIHZhciBwcmV2TGluZSA9IG51bGw7XG4gIHZhciBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gLTE7XG5cbiAgd2hpbGUgKGN1cnJPZmZzZXQgPCBvZmZzZXQpIHtcbiAgICB2YXIgYyA9IHN0ci5jaGFyQXQoY3Vyck9mZnNldCsrKTtcbiAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgIGxpbmVOdW0rKztcbiAgICAgIGNvbE51bSA9IDE7XG4gICAgICBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gbGluZVN0YXJ0T2Zmc2V0O1xuICAgICAgbGluZVN0YXJ0T2Zmc2V0ID0gY3Vyck9mZnNldDtcbiAgICB9IGVsc2UgaWYgKGMgIT09ICdcXHInKSB7XG4gICAgICBjb2xOdW0rKztcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBlbmQgb2YgdGhlIHRhcmdldCBsaW5lLlxuICB2YXIgbGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lU3RhcnRPZmZzZXQpO1xuICBpZiAobGluZUVuZE9mZnNldCA9PT0gLTEpIHtcbiAgICBsaW5lRW5kT2Zmc2V0ID0gc3RyLmxlbmd0aDtcbiAgfSBlbHNlIHtcbiAgICAvLyBHZXQgdGhlIG5leHQgbGluZS5cbiAgICB2YXIgbmV4dExpbmVFbmRPZmZzZXQgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZUVuZE9mZnNldCArIDEpO1xuICAgIG5leHRMaW5lID0gbmV4dExpbmVFbmRPZmZzZXQgPT09IC0xID8gc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBzdHIuc2xpY2UobGluZUVuZE9mZnNldCwgbmV4dExpbmVFbmRPZmZzZXQpO1xuICAgIC8vIFN0cmlwIGxlYWRpbmcgYW5kIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICAgIG5leHRMaW5lID0gbmV4dExpbmUucmVwbGFjZSgvXlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyJC8sICcnKTtcbiAgfVxuXG4gIC8vIEdldCB0aGUgcHJldmlvdXMgbGluZS5cbiAgaWYgKHByZXZMaW5lU3RhcnRPZmZzZXQgPj0gMCkge1xuICAgIHByZXZMaW5lID0gc3RyLnNsaWNlKHByZXZMaW5lU3RhcnRPZmZzZXQsIGxpbmVTdGFydE9mZnNldClcbiAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHI/XFxuJC8sICcnKTsgIC8vIFN0cmlwIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICB9XG5cbiAgLy8gR2V0IHRoZSB0YXJnZXQgbGluZSwgc3RyaXBwaW5nIGEgdHJhaWxpbmcgY2FycmlhZ2UgcmV0dXJuIGlmIG5lY2Vzc2FyeS5cbiAgdmFyIGxpbmUgPSBzdHIuc2xpY2UobGluZVN0YXJ0T2Zmc2V0LCBsaW5lRW5kT2Zmc2V0KS5yZXBsYWNlKC9cXHIkLywgJycpO1xuXG4gIHJldHVybiB7XG4gICAgbGluZU51bTogbGluZU51bSxcbiAgICBjb2xOdW06IGNvbE51bSxcbiAgICBsaW5lOiBsaW5lLFxuICAgIHByZXZMaW5lOiBwcmV2TGluZSxcbiAgICBuZXh0TGluZTogbmV4dExpbmVcbiAgfTtcbn07XG5cbi8vIFJldHVybiBhIG5pY2VseS1mb3JtYXR0ZWQgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGxpbmUgYW5kIGNvbHVtbiBmb3IgdGhlXG4vLyBnaXZlbiBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlID0gZnVuY3Rpb24oc3RyLCBvZmZzZXQgLyogLi4ucmFuZ2VzICovKSB7XG4gIHZhciByZXBlYXRTdHIgPSBjb21tb24ucmVwZWF0U3RyO1xuXG4gIHZhciBsaW5lQW5kQ29sID0gZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uKHN0ciwgb2Zmc2V0KTtcbiAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgc2IuYXBwZW5kKCdMaW5lICcgKyBsaW5lQW5kQ29sLmxpbmVOdW0gKyAnLCBjb2wgJyArIGxpbmVBbmRDb2wuY29sTnVtICsgJzpcXG4nKTtcblxuICAvLyBBbiBhcnJheSBvZiB0aGUgcHJldmlvdXMsIGN1cnJlbnQsIGFuZCBuZXh0IGxpbmUgbnVtYmVycyBhcyBzdHJpbmdzIG9mIGVxdWFsIGxlbmd0aC5cbiAgdmFyIGxpbmVOdW1iZXJzID0gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoW1xuICAgIGxpbmVBbmRDb2wucHJldkxpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gLSAxLFxuICAgIGxpbmVBbmRDb2wubGluZU51bSxcbiAgICBsaW5lQW5kQ29sLm5leHRMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtICsgMVxuICBdKTtcblxuICAvLyBIZWxwZXIgZm9yIGFwcGVuZGluZyBmb3JtYXR0aW5nIGlucHV0IGxpbmVzIHRvIHRoZSBidWZmZXIuXG4gIGZ1bmN0aW9uIGFwcGVuZExpbmUobnVtLCBjb250ZW50LCBwcmVmaXgpIHtcbiAgICBzYi5hcHBlbmQocHJlZml4ICsgbGluZU51bWJlcnNbbnVtXSArICcgfCAnICsgY29udGVudCArICdcXG4nKTtcbiAgfVxuXG4gIC8vIEluY2x1ZGUgdGhlIHByZXZpb3VzIGxpbmUgZm9yIGNvbnRleHQgaWYgcG9zc2libGUuXG4gIGlmIChsaW5lQW5kQ29sLnByZXZMaW5lICE9IG51bGwpIHtcbiAgICBhcHBlbmRMaW5lKDAsIGxpbmVBbmRDb2wucHJldkxpbmUsICcgICcpO1xuICB9XG4gIC8vIExpbmUgdGhhdCB0aGUgZXJyb3Igb2NjdXJyZWQgb24uXG4gIGFwcGVuZExpbmUoMSwgbGluZUFuZENvbC5saW5lLCAnPiAnKTtcblxuICAvLyBCdWlsZCB1cCB0aGUgbGluZSB0aGF0IHBvaW50cyB0byB0aGUgb2Zmc2V0IGFuZCBwb3NzaWJsZSBpbmRpY2F0ZXMgb25lIG9yIG1vcmUgcmFuZ2VzLlxuICAvLyBTdGFydCB3aXRoIGEgYmxhbmsgbGluZSwgYW5kIGluZGljYXRlIGVhY2ggcmFuZ2UgYnkgb3ZlcmxheWluZyBhIHN0cmluZyBvZiBgfmAgY2hhcnMuXG4gIHZhciBsaW5lTGVuID0gbGluZUFuZENvbC5saW5lLmxlbmd0aDtcbiAgdmFyIGluZGljYXRpb25MaW5lID0gcmVwZWF0U3RyKCcgJywgbGluZUxlbiArIDEpO1xuICB2YXIgcmFuZ2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgc3RhcnRJZHggPSByYW5nZXNbaV1bMF07XG4gICAgdmFyIGVuZElkeCA9IHJhbmdlc1tpXVsxXTtcbiAgICBjb21tb24uYXNzZXJ0KHN0YXJ0SWR4ID49IDAgJiYgc3RhcnRJZHggPD0gZW5kSWR4LCAncmFuZ2Ugc3RhcnQgbXVzdCBiZSA+PSAwIGFuZCA8PSBlbmQnKTtcblxuICAgIHZhciBsaW5lU3RhcnRPZmZzZXQgPSBvZmZzZXQgLSBsaW5lQW5kQ29sLmNvbE51bSArIDE7XG4gICAgc3RhcnRJZHggPSBNYXRoLm1heCgwLCBzdGFydElkeCAtIGxpbmVTdGFydE9mZnNldCk7XG4gICAgZW5kSWR4ID0gTWF0aC5taW4oZW5kSWR4IC0gbGluZVN0YXJ0T2Zmc2V0LCBsaW5lTGVuKTtcblxuICAgIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCByZXBlYXRTdHIoJ34nLCBlbmRJZHggLSBzdGFydElkeCksIHN0YXJ0SWR4KTtcbiAgfVxuICB2YXIgZ3V0dGVyV2lkdGggPSAyICsgbGluZU51bWJlcnNbMV0ubGVuZ3RoICsgMztcbiAgc2IuYXBwZW5kKHJlcGVhdFN0cignICcsIGd1dHRlcldpZHRoKSk7XG4gIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCAnXicsIGxpbmVBbmRDb2wuY29sTnVtIC0gMSk7XG4gIHNiLmFwcGVuZChpbmRpY2F0aW9uTGluZS5yZXBsYWNlKC8gKyQvLCAnJykgKyAnXFxuJyk7XG5cbiAgLy8gSW5jbHVkZSB0aGUgbmV4dCBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICBpZiAobGluZUFuZENvbC5uZXh0TGluZSAhPSBudWxsKSB7XG4gICAgYXBwZW5kTGluZSgyLCBsaW5lQW5kQ29sLm5leHRMaW5lLCAnICAnKTtcbiAgfVxuICByZXR1cm4gc2IuY29udGVudHMoKTtcbn07XG4iLCIvLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy91bmljb2RlLTkuMC4wLlxuLy8gVGhlc2UgYXJlIGp1c3QgY2F0ZWdvcmllcyB0aGF0IGFyZSB1c2VkIGluIEVTNS9FUzYuXG4vLyBUaGUgZnVsbCBsaXN0IG9mIFVuaWNvZGUgY2F0ZWdvcmllcyBpcyBoZXJlOiBodHRwOi8vd3d3LmZpbGVmb3JtYXQuaW5mby9pbmZvL3VuaWNvZGUvY2F0ZWdvcnkvaW5kZXguaHRtLlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIExldHRlcnNcbiAgTHU6IC9bQS1aXFx4QzAtXFx4RDZcXHhEOC1cXHhERVxcdTAxMDBcXHUwMTAyXFx1MDEwNFxcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMTBFXFx1MDExMFxcdTAxMTJcXHUwMTE0XFx1MDExNlxcdTAxMThcXHUwMTFBXFx1MDExQ1xcdTAxMUVcXHUwMTIwXFx1MDEyMlxcdTAxMjRcXHUwMTI2XFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEyRVxcdTAxMzBcXHUwMTMyXFx1MDEzNFxcdTAxMzZcXHUwMTM5XFx1MDEzQlxcdTAxM0RcXHUwMTNGXFx1MDE0MVxcdTAxNDNcXHUwMTQ1XFx1MDE0N1xcdTAxNEFcXHUwMTRDXFx1MDE0RVxcdTAxNTBcXHUwMTUyXFx1MDE1NFxcdTAxNTZcXHUwMTU4XFx1MDE1QVxcdTAxNUNcXHUwMTVFXFx1MDE2MFxcdTAxNjJcXHUwMTY0XFx1MDE2NlxcdTAxNjhcXHUwMTZBXFx1MDE2Q1xcdTAxNkVcXHUwMTcwXFx1MDE3MlxcdTAxNzRcXHUwMTc2XFx1MDE3OFxcdTAxNzlcXHUwMTdCXFx1MDE3RFxcdTAxODFcXHUwMTgyXFx1MDE4NFxcdTAxODZcXHUwMTg3XFx1MDE4OS1cXHUwMThCXFx1MDE4RS1cXHUwMTkxXFx1MDE5M1xcdTAxOTRcXHUwMTk2LVxcdTAxOThcXHUwMTlDXFx1MDE5RFxcdTAxOUZcXHUwMUEwXFx1MDFBMlxcdTAxQTRcXHUwMUE2XFx1MDFBN1xcdTAxQTlcXHUwMUFDXFx1MDFBRVxcdTAxQUZcXHUwMUIxLVxcdTAxQjNcXHUwMUI1XFx1MDFCN1xcdTAxQjhcXHUwMUJDXFx1MDFDNFxcdTAxQzdcXHUwMUNBXFx1MDFDRFxcdTAxQ0ZcXHUwMUQxXFx1MDFEM1xcdTAxRDVcXHUwMUQ3XFx1MDFEOVxcdTAxREJcXHUwMURFXFx1MDFFMFxcdTAxRTJcXHUwMUU0XFx1MDFFNlxcdTAxRThcXHUwMUVBXFx1MDFFQ1xcdTAxRUVcXHUwMUYxXFx1MDFGNFxcdTAxRjYtXFx1MDFGOFxcdTAxRkFcXHUwMUZDXFx1MDFGRVxcdTAyMDBcXHUwMjAyXFx1MDIwNFxcdTAyMDZcXHUwMjA4XFx1MDIwQVxcdTAyMENcXHUwMjBFXFx1MDIxMFxcdTAyMTJcXHUwMjE0XFx1MDIxNlxcdTAyMThcXHUwMjFBXFx1MDIxQ1xcdTAyMUVcXHUwMjIwXFx1MDIyMlxcdTAyMjRcXHUwMjI2XFx1MDIyOFxcdTAyMkFcXHUwMjJDXFx1MDIyRVxcdTAyMzBcXHUwMjMyXFx1MDIzQVxcdTAyM0JcXHUwMjNEXFx1MDIzRVxcdTAyNDFcXHUwMjQzLVxcdTAyNDZcXHUwMjQ4XFx1MDI0QVxcdTAyNENcXHUwMjRFXFx1MDM3MFxcdTAzNzJcXHUwMzc2XFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RVxcdTAzOEZcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQUJcXHUwM0NGXFx1MDNEMi1cXHUwM0Q0XFx1MDNEOFxcdTAzREFcXHUwM0RDXFx1MDNERVxcdTAzRTBcXHUwM0UyXFx1MDNFNFxcdTAzRTZcXHUwM0U4XFx1MDNFQVxcdTAzRUNcXHUwM0VFXFx1MDNGNFxcdTAzRjdcXHUwM0Y5XFx1MDNGQVxcdTAzRkQtXFx1MDQyRlxcdTA0NjBcXHUwNDYyXFx1MDQ2NFxcdTA0NjZcXHUwNDY4XFx1MDQ2QVxcdTA0NkNcXHUwNDZFXFx1MDQ3MFxcdTA0NzJcXHUwNDc0XFx1MDQ3NlxcdTA0NzhcXHUwNDdBXFx1MDQ3Q1xcdTA0N0VcXHUwNDgwXFx1MDQ4QVxcdTA0OENcXHUwNDhFXFx1MDQ5MFxcdTA0OTJcXHUwNDk0XFx1MDQ5NlxcdTA0OThcXHUwNDlBXFx1MDQ5Q1xcdTA0OUVcXHUwNEEwXFx1MDRBMlxcdTA0QTRcXHUwNEE2XFx1MDRBOFxcdTA0QUFcXHUwNEFDXFx1MDRBRVxcdTA0QjBcXHUwNEIyXFx1MDRCNFxcdTA0QjZcXHUwNEI4XFx1MDRCQVxcdTA0QkNcXHUwNEJFXFx1MDRDMFxcdTA0QzFcXHUwNEMzXFx1MDRDNVxcdTA0QzdcXHUwNEM5XFx1MDRDQlxcdTA0Q0RcXHUwNEQwXFx1MDREMlxcdTA0RDRcXHUwNEQ2XFx1MDREOFxcdTA0REFcXHUwNERDXFx1MDRERVxcdTA0RTBcXHUwNEUyXFx1MDRFNFxcdTA0RTZcXHUwNEU4XFx1MDRFQVxcdTA0RUNcXHUwNEVFXFx1MDRGMFxcdTA0RjJcXHUwNEY0XFx1MDRGNlxcdTA0RjhcXHUwNEZBXFx1MDRGQ1xcdTA0RkVcXHUwNTAwXFx1MDUwMlxcdTA1MDRcXHUwNTA2XFx1MDUwOFxcdTA1MEFcXHUwNTBDXFx1MDUwRVxcdTA1MTBcXHUwNTEyXFx1MDUxNFxcdTA1MTZcXHUwNTE4XFx1MDUxQVxcdTA1MUNcXHUwNTFFXFx1MDUyMFxcdTA1MjJcXHUwNTI0XFx1MDUyNlxcdTA1MjhcXHUwNTJBXFx1MDUyQ1xcdTA1MkVcXHUwNTMxLVxcdTA1NTZcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEzQTAtXFx1MTNGNVxcdTFFMDBcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUxRTA4XFx1MUUwQVxcdTFFMENcXHUxRTBFXFx1MUUxMFxcdTFFMTJcXHUxRTE0XFx1MUUxNlxcdTFFMThcXHUxRTFBXFx1MUUxQ1xcdTFFMUVcXHUxRTIwXFx1MUUyMlxcdTFFMjRcXHUxRTI2XFx1MUUyOFxcdTFFMkFcXHUxRTJDXFx1MUUyRVxcdTFFMzBcXHUxRTMyXFx1MUUzNFxcdTFFMzZcXHUxRTM4XFx1MUUzQVxcdTFFM0NcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUxRTQ0XFx1MUU0NlxcdTFFNDhcXHUxRTRBXFx1MUU0Q1xcdTFFNEVcXHUxRTUwXFx1MUU1MlxcdTFFNTRcXHUxRTU2XFx1MUU1OFxcdTFFNUFcXHUxRTVDXFx1MUU1RVxcdTFFNjBcXHUxRTYyXFx1MUU2NFxcdTFFNjZcXHUxRTY4XFx1MUU2QVxcdTFFNkNcXHUxRTZFXFx1MUU3MFxcdTFFNzJcXHUxRTc0XFx1MUU3NlxcdTFFNzhcXHUxRTdBXFx1MUU3Q1xcdTFFN0VcXHUxRTgwXFx1MUU4MlxcdTFFODRcXHUxRTg2XFx1MUU4OFxcdTFFOEFcXHUxRThDXFx1MUU4RVxcdTFFOTBcXHUxRTkyXFx1MUU5NFxcdTFFOUVcXHUxRUEwXFx1MUVBMlxcdTFFQTRcXHUxRUE2XFx1MUVBOFxcdTFFQUFcXHUxRUFDXFx1MUVBRVxcdTFFQjBcXHUxRUIyXFx1MUVCNFxcdTFFQjZcXHUxRUI4XFx1MUVCQVxcdTFFQkNcXHUxRUJFXFx1MUVDMFxcdTFFQzJcXHUxRUM0XFx1MUVDNlxcdTFFQzhcXHUxRUNBXFx1MUVDQ1xcdTFFQ0VcXHUxRUQwXFx1MUVEMlxcdTFFRDRcXHUxRUQ2XFx1MUVEOFxcdTFFREFcXHUxRURDXFx1MUVERVxcdTFFRTBcXHUxRUUyXFx1MUVFNFxcdTFFRTZcXHUxRUU4XFx1MUVFQVxcdTFFRUNcXHUxRUVFXFx1MUVGMFxcdTFFRjJcXHUxRUY0XFx1MUVGNlxcdTFFRjhcXHUxRUZBXFx1MUVGQ1xcdTFFRkVcXHUxRjA4LVxcdTFGMEZcXHUxRjE4LVxcdTFGMURcXHUxRjI4LVxcdTFGMkZcXHUxRjM4LVxcdTFGM0ZcXHUxRjQ4LVxcdTFGNERcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGXFx1MUY2OC1cXHUxRjZGXFx1MUZCOC1cXHUxRkJCXFx1MUZDOC1cXHUxRkNCXFx1MUZEOC1cXHUxRkRCXFx1MUZFOC1cXHUxRkVDXFx1MUZGOC1cXHUxRkZCXFx1MjEwMlxcdTIxMDdcXHUyMTBCLVxcdTIxMERcXHUyMTEwLVxcdTIxMTJcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEzMC1cXHUyMTMzXFx1MjEzRVxcdTIxM0ZcXHUyMTQ1XFx1MjE4M1xcdTJDMDAtXFx1MkMyRVxcdTJDNjBcXHUyQzYyLVxcdTJDNjRcXHUyQzY3XFx1MkM2OVxcdTJDNkJcXHUyQzZELVxcdTJDNzBcXHUyQzcyXFx1MkM3NVxcdTJDN0UtXFx1MkM4MFxcdTJDODJcXHUyQzg0XFx1MkM4NlxcdTJDODhcXHUyQzhBXFx1MkM4Q1xcdTJDOEVcXHUyQzkwXFx1MkM5MlxcdTJDOTRcXHUyQzk2XFx1MkM5OFxcdTJDOUFcXHUyQzlDXFx1MkM5RVxcdTJDQTBcXHUyQ0EyXFx1MkNBNFxcdTJDQTZcXHUyQ0E4XFx1MkNBQVxcdTJDQUNcXHUyQ0FFXFx1MkNCMFxcdTJDQjJcXHUyQ0I0XFx1MkNCNlxcdTJDQjhcXHUyQ0JBXFx1MkNCQ1xcdTJDQkVcXHUyQ0MwXFx1MkNDMlxcdTJDQzRcXHUyQ0M2XFx1MkNDOFxcdTJDQ0FcXHUyQ0NDXFx1MkNDRVxcdTJDRDBcXHUyQ0QyXFx1MkNENFxcdTJDRDZcXHUyQ0Q4XFx1MkNEQVxcdTJDRENcXHUyQ0RFXFx1MkNFMFxcdTJDRTJcXHUyQ0VCXFx1MkNFRFxcdTJDRjJcXHVBNjQwXFx1QTY0MlxcdUE2NDRcXHVBNjQ2XFx1QTY0OFxcdUE2NEFcXHVBNjRDXFx1QTY0RVxcdUE2NTBcXHVBNjUyXFx1QTY1NFxcdUE2NTZcXHVBNjU4XFx1QTY1QVxcdUE2NUNcXHVBNjVFXFx1QTY2MFxcdUE2NjJcXHVBNjY0XFx1QTY2NlxcdUE2NjhcXHVBNjZBXFx1QTY2Q1xcdUE2ODBcXHVBNjgyXFx1QTY4NFxcdUE2ODZcXHVBNjg4XFx1QTY4QVxcdUE2OENcXHVBNjhFXFx1QTY5MFxcdUE2OTJcXHVBNjk0XFx1QTY5NlxcdUE2OThcXHVBNjlBXFx1QTcyMlxcdUE3MjRcXHVBNzI2XFx1QTcyOFxcdUE3MkFcXHVBNzJDXFx1QTcyRVxcdUE3MzJcXHVBNzM0XFx1QTczNlxcdUE3MzhcXHVBNzNBXFx1QTczQ1xcdUE3M0VcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBNzQ2XFx1QTc0OFxcdUE3NEFcXHVBNzRDXFx1QTc0RVxcdUE3NTBcXHVBNzUyXFx1QTc1NFxcdUE3NTZcXHVBNzU4XFx1QTc1QVxcdUE3NUNcXHVBNzVFXFx1QTc2MFxcdUE3NjJcXHVBNzY0XFx1QTc2NlxcdUE3NjhcXHVBNzZBXFx1QTc2Q1xcdUE3NkVcXHVBNzc5XFx1QTc3QlxcdUE3N0RcXHVBNzdFXFx1QTc4MFxcdUE3ODJcXHVBNzg0XFx1QTc4NlxcdUE3OEJcXHVBNzhEXFx1QTc5MFxcdUE3OTJcXHVBNzk2XFx1QTc5OFxcdUE3OUFcXHVBNzlDXFx1QTc5RVxcdUE3QTBcXHVBN0EyXFx1QTdBNFxcdUE3QTZcXHVBN0E4XFx1QTdBQS1cXHVBN0FFXFx1QTdCMC1cXHVBN0I0XFx1QTdCNlxcdUZGMjEtXFx1RkYzQV18XFx1RDgwMVtcXHVEQzAwLVxcdURDMjdcXHVEQ0IwLVxcdURDRDNdfFxcdUQ4MDNbXFx1REM4MC1cXHVEQ0IyXXxcXHVEODA2W1xcdURDQTAtXFx1RENCRl18XFx1RDgzNVtcXHVEQzAwLVxcdURDMTlcXHVEQzM0LVxcdURDNERcXHVEQzY4LVxcdURDODFcXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjVcXHVEQ0QwLVxcdURDRTlcXHVERDA0XFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMzhcXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENkMtXFx1REQ4NVxcdUREQTAtXFx1RERCOVxcdURERDQtXFx1RERFRFxcdURFMDgtXFx1REUyMVxcdURFM0MtXFx1REU1NVxcdURFNzAtXFx1REU4OVxcdURFQTgtXFx1REVDMFxcdURFRTItXFx1REVGQVxcdURGMUMtXFx1REYzNFxcdURGNTYtXFx1REY2RVxcdURGOTAtXFx1REZBOFxcdURGQ0FdfFxcdUQ4M0FbXFx1REQwMC1cXHVERDIxXS8sXG4gIExsOiAvW2EtelxceEI1XFx4REYtXFx4RjZcXHhGOC1cXHhGRlxcdTAxMDFcXHUwMTAzXFx1MDEwNVxcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMTBGXFx1MDExMVxcdTAxMTNcXHUwMTE1XFx1MDExN1xcdTAxMTlcXHUwMTFCXFx1MDExRFxcdTAxMUZcXHUwMTIxXFx1MDEyM1xcdTAxMjVcXHUwMTI3XFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDEyRlxcdTAxMzFcXHUwMTMzXFx1MDEzNVxcdTAxMzdcXHUwMTM4XFx1MDEzQVxcdTAxM0NcXHUwMTNFXFx1MDE0MFxcdTAxNDJcXHUwMTQ0XFx1MDE0NlxcdTAxNDhcXHUwMTQ5XFx1MDE0QlxcdTAxNERcXHUwMTRGXFx1MDE1MVxcdTAxNTNcXHUwMTU1XFx1MDE1N1xcdTAxNTlcXHUwMTVCXFx1MDE1RFxcdTAxNUZcXHUwMTYxXFx1MDE2M1xcdTAxNjVcXHUwMTY3XFx1MDE2OVxcdTAxNkJcXHUwMTZEXFx1MDE2RlxcdTAxNzFcXHUwMTczXFx1MDE3NVxcdTAxNzdcXHUwMTdBXFx1MDE3Q1xcdTAxN0UtXFx1MDE4MFxcdTAxODNcXHUwMTg1XFx1MDE4OFxcdTAxOENcXHUwMThEXFx1MDE5MlxcdTAxOTVcXHUwMTk5LVxcdTAxOUJcXHUwMTlFXFx1MDFBMVxcdTAxQTNcXHUwMUE1XFx1MDFBOFxcdTAxQUFcXHUwMUFCXFx1MDFBRFxcdTAxQjBcXHUwMUI0XFx1MDFCNlxcdTAxQjlcXHUwMUJBXFx1MDFCRC1cXHUwMUJGXFx1MDFDNlxcdTAxQzlcXHUwMUNDXFx1MDFDRVxcdTAxRDBcXHUwMUQyXFx1MDFENFxcdTAxRDZcXHUwMUQ4XFx1MDFEQVxcdTAxRENcXHUwMUREXFx1MDFERlxcdTAxRTFcXHUwMUUzXFx1MDFFNVxcdTAxRTdcXHUwMUU5XFx1MDFFQlxcdTAxRURcXHUwMUVGXFx1MDFGMFxcdTAxRjNcXHUwMUY1XFx1MDFGOVxcdTAxRkJcXHUwMUZEXFx1MDFGRlxcdTAyMDFcXHUwMjAzXFx1MDIwNVxcdTAyMDdcXHUwMjA5XFx1MDIwQlxcdTAyMERcXHUwMjBGXFx1MDIxMVxcdTAyMTNcXHUwMjE1XFx1MDIxN1xcdTAyMTlcXHUwMjFCXFx1MDIxRFxcdTAyMUZcXHUwMjIxXFx1MDIyM1xcdTAyMjVcXHUwMjI3XFx1MDIyOVxcdTAyMkJcXHUwMjJEXFx1MDIyRlxcdTAyMzFcXHUwMjMzLVxcdTAyMzlcXHUwMjNDXFx1MDIzRlxcdTAyNDBcXHUwMjQyXFx1MDI0N1xcdTAyNDlcXHUwMjRCXFx1MDI0RFxcdTAyNEYtXFx1MDI5M1xcdTAyOTUtXFx1MDJBRlxcdTAzNzFcXHUwMzczXFx1MDM3N1xcdTAzN0ItXFx1MDM3RFxcdTAzOTBcXHUwM0FDLVxcdTAzQ0VcXHUwM0QwXFx1MDNEMVxcdTAzRDUtXFx1MDNEN1xcdTAzRDlcXHUwM0RCXFx1MDNERFxcdTAzREZcXHUwM0UxXFx1MDNFM1xcdTAzRTVcXHUwM0U3XFx1MDNFOVxcdTAzRUJcXHUwM0VEXFx1MDNFRi1cXHUwM0YzXFx1MDNGNVxcdTAzRjhcXHUwM0ZCXFx1MDNGQ1xcdTA0MzAtXFx1MDQ1RlxcdTA0NjFcXHUwNDYzXFx1MDQ2NVxcdTA0NjdcXHUwNDY5XFx1MDQ2QlxcdTA0NkRcXHUwNDZGXFx1MDQ3MVxcdTA0NzNcXHUwNDc1XFx1MDQ3N1xcdTA0NzlcXHUwNDdCXFx1MDQ3RFxcdTA0N0ZcXHUwNDgxXFx1MDQ4QlxcdTA0OERcXHUwNDhGXFx1MDQ5MVxcdTA0OTNcXHUwNDk1XFx1MDQ5N1xcdTA0OTlcXHUwNDlCXFx1MDQ5RFxcdTA0OUZcXHUwNEExXFx1MDRBM1xcdTA0QTVcXHUwNEE3XFx1MDRBOVxcdTA0QUJcXHUwNEFEXFx1MDRBRlxcdTA0QjFcXHUwNEIzXFx1MDRCNVxcdTA0QjdcXHUwNEI5XFx1MDRCQlxcdTA0QkRcXHUwNEJGXFx1MDRDMlxcdTA0QzRcXHUwNEM2XFx1MDRDOFxcdTA0Q0FcXHUwNENDXFx1MDRDRVxcdTA0Q0ZcXHUwNEQxXFx1MDREM1xcdTA0RDVcXHUwNEQ3XFx1MDREOVxcdTA0REJcXHUwNEREXFx1MDRERlxcdTA0RTFcXHUwNEUzXFx1MDRFNVxcdTA0RTdcXHUwNEU5XFx1MDRFQlxcdTA0RURcXHUwNEVGXFx1MDRGMVxcdTA0RjNcXHUwNEY1XFx1MDRGN1xcdTA0RjlcXHUwNEZCXFx1MDRGRFxcdTA0RkZcXHUwNTAxXFx1MDUwM1xcdTA1MDVcXHUwNTA3XFx1MDUwOVxcdTA1MEJcXHUwNTBEXFx1MDUwRlxcdTA1MTFcXHUwNTEzXFx1MDUxNVxcdTA1MTdcXHUwNTE5XFx1MDUxQlxcdTA1MURcXHUwNTFGXFx1MDUyMVxcdTA1MjNcXHUwNTI1XFx1MDUyN1xcdTA1MjlcXHUwNTJCXFx1MDUyRFxcdTA1MkZcXHUwNTYxLVxcdTA1ODdcXHUxM0Y4LVxcdTEzRkRcXHUxQzgwLVxcdTFDODhcXHUxRDAwLVxcdTFEMkJcXHUxRDZCLVxcdTFENzdcXHUxRDc5LVxcdTFEOUFcXHUxRTAxXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MUUwOVxcdTFFMEJcXHUxRTBEXFx1MUUwRlxcdTFFMTFcXHUxRTEzXFx1MUUxNVxcdTFFMTdcXHUxRTE5XFx1MUUxQlxcdTFFMURcXHUxRTFGXFx1MUUyMVxcdTFFMjNcXHUxRTI1XFx1MUUyN1xcdTFFMjlcXHUxRTJCXFx1MUUyRFxcdTFFMkZcXHUxRTMxXFx1MUUzM1xcdTFFMzVcXHUxRTM3XFx1MUUzOVxcdTFFM0JcXHUxRTNEXFx1MUUzRlxcdTFFNDFcXHUxRTQzXFx1MUU0NVxcdTFFNDdcXHUxRTQ5XFx1MUU0QlxcdTFFNERcXHUxRTRGXFx1MUU1MVxcdTFFNTNcXHUxRTU1XFx1MUU1N1xcdTFFNTlcXHUxRTVCXFx1MUU1RFxcdTFFNUZcXHUxRTYxXFx1MUU2M1xcdTFFNjVcXHUxRTY3XFx1MUU2OVxcdTFFNkJcXHUxRTZEXFx1MUU2RlxcdTFFNzFcXHUxRTczXFx1MUU3NVxcdTFFNzdcXHUxRTc5XFx1MUU3QlxcdTFFN0RcXHUxRTdGXFx1MUU4MVxcdTFFODNcXHUxRTg1XFx1MUU4N1xcdTFFODlcXHUxRThCXFx1MUU4RFxcdTFFOEZcXHUxRTkxXFx1MUU5M1xcdTFFOTUtXFx1MUU5RFxcdTFFOUZcXHUxRUExXFx1MUVBM1xcdTFFQTVcXHUxRUE3XFx1MUVBOVxcdTFFQUJcXHUxRUFEXFx1MUVBRlxcdTFFQjFcXHUxRUIzXFx1MUVCNVxcdTFFQjdcXHUxRUI5XFx1MUVCQlxcdTFFQkRcXHUxRUJGXFx1MUVDMVxcdTFFQzNcXHUxRUM1XFx1MUVDN1xcdTFFQzlcXHUxRUNCXFx1MUVDRFxcdTFFQ0ZcXHUxRUQxXFx1MUVEM1xcdTFFRDVcXHUxRUQ3XFx1MUVEOVxcdTFFREJcXHUxRUREXFx1MUVERlxcdTFFRTFcXHUxRUUzXFx1MUVFNVxcdTFFRTdcXHUxRUU5XFx1MUVFQlxcdTFFRURcXHUxRUVGXFx1MUVGMVxcdTFFRjNcXHUxRUY1XFx1MUVGN1xcdTFFRjlcXHUxRUZCXFx1MUVGRFxcdTFFRkYtXFx1MUYwN1xcdTFGMTAtXFx1MUYxNVxcdTFGMjAtXFx1MUYyN1xcdTFGMzAtXFx1MUYzN1xcdTFGNDAtXFx1MUY0NVxcdTFGNTAtXFx1MUY1N1xcdTFGNjAtXFx1MUY2N1xcdTFGNzAtXFx1MUY3RFxcdTFGODAtXFx1MUY4N1xcdTFGOTAtXFx1MUY5N1xcdTFGQTAtXFx1MUZBN1xcdTFGQjAtXFx1MUZCNFxcdTFGQjZcXHUxRkI3XFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzZcXHUxRkM3XFx1MUZEMC1cXHUxRkQzXFx1MUZENlxcdTFGRDdcXHUxRkUwLVxcdTFGRTdcXHUxRkYyLVxcdTFGRjRcXHUxRkY2XFx1MUZGN1xcdTIxMEFcXHUyMTBFXFx1MjEwRlxcdTIxMTNcXHUyMTJGXFx1MjEzNFxcdTIxMzlcXHUyMTNDXFx1MjEzRFxcdTIxNDYtXFx1MjE0OVxcdTIxNEVcXHUyMTg0XFx1MkMzMC1cXHUyQzVFXFx1MkM2MVxcdTJDNjVcXHUyQzY2XFx1MkM2OFxcdTJDNkFcXHUyQzZDXFx1MkM3MVxcdTJDNzNcXHUyQzc0XFx1MkM3Ni1cXHUyQzdCXFx1MkM4MVxcdTJDODNcXHUyQzg1XFx1MkM4N1xcdTJDODlcXHUyQzhCXFx1MkM4RFxcdTJDOEZcXHUyQzkxXFx1MkM5M1xcdTJDOTVcXHUyQzk3XFx1MkM5OVxcdTJDOUJcXHUyQzlEXFx1MkM5RlxcdTJDQTFcXHUyQ0EzXFx1MkNBNVxcdTJDQTdcXHUyQ0E5XFx1MkNBQlxcdTJDQURcXHUyQ0FGXFx1MkNCMVxcdTJDQjNcXHUyQ0I1XFx1MkNCN1xcdTJDQjlcXHUyQ0JCXFx1MkNCRFxcdTJDQkZcXHUyQ0MxXFx1MkNDM1xcdTJDQzVcXHUyQ0M3XFx1MkNDOVxcdTJDQ0JcXHUyQ0NEXFx1MkNDRlxcdTJDRDFcXHUyQ0QzXFx1MkNENVxcdTJDRDdcXHUyQ0Q5XFx1MkNEQlxcdTJDRERcXHUyQ0RGXFx1MkNFMVxcdTJDRTNcXHUyQ0U0XFx1MkNFQ1xcdTJDRUVcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHVBNjQxXFx1QTY0M1xcdUE2NDVcXHVBNjQ3XFx1QTY0OVxcdUE2NEJcXHVBNjREXFx1QTY0RlxcdUE2NTFcXHVBNjUzXFx1QTY1NVxcdUE2NTdcXHVBNjU5XFx1QTY1QlxcdUE2NURcXHVBNjVGXFx1QTY2MVxcdUE2NjNcXHVBNjY1XFx1QTY2N1xcdUE2NjlcXHVBNjZCXFx1QTY2RFxcdUE2ODFcXHVBNjgzXFx1QTY4NVxcdUE2ODdcXHVBNjg5XFx1QTY4QlxcdUE2OERcXHVBNjhGXFx1QTY5MVxcdUE2OTNcXHVBNjk1XFx1QTY5N1xcdUE2OTlcXHVBNjlCXFx1QTcyM1xcdUE3MjVcXHVBNzI3XFx1QTcyOVxcdUE3MkJcXHVBNzJEXFx1QTcyRi1cXHVBNzMxXFx1QTczM1xcdUE3MzVcXHVBNzM3XFx1QTczOVxcdUE3M0JcXHVBNzNEXFx1QTczRlxcdUE3NDFcXHVBNzQzXFx1QTc0NVxcdUE3NDdcXHVBNzQ5XFx1QTc0QlxcdUE3NERcXHVBNzRGXFx1QTc1MVxcdUE3NTNcXHVBNzU1XFx1QTc1N1xcdUE3NTlcXHVBNzVCXFx1QTc1RFxcdUE3NUZcXHVBNzYxXFx1QTc2M1xcdUE3NjVcXHVBNzY3XFx1QTc2OVxcdUE3NkJcXHVBNzZEXFx1QTc2RlxcdUE3NzEtXFx1QTc3OFxcdUE3N0FcXHVBNzdDXFx1QTc3RlxcdUE3ODFcXHVBNzgzXFx1QTc4NVxcdUE3ODdcXHVBNzhDXFx1QTc4RVxcdUE3OTFcXHVBNzkzLVxcdUE3OTVcXHVBNzk3XFx1QTc5OVxcdUE3OUJcXHVBNzlEXFx1QTc5RlxcdUE3QTFcXHVBN0EzXFx1QTdBNVxcdUE3QTdcXHVBN0E5XFx1QTdCNVxcdUE3QjdcXHVBN0ZBXFx1QUIzMC1cXHVBQjVBXFx1QUI2MC1cXHVBQjY1XFx1QUI3MC1cXHVBQkJGXFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkY0MS1cXHVGRjVBXXxcXHVEODAxW1xcdURDMjgtXFx1REM0RlxcdURDRDgtXFx1RENGQl18XFx1RDgwM1tcXHVEQ0MwLVxcdURDRjJdfFxcdUQ4MDZbXFx1RENDMC1cXHVEQ0RGXXxcXHVEODM1W1xcdURDMUEtXFx1REMzM1xcdURDNEUtXFx1REM1NFxcdURDNTYtXFx1REM2N1xcdURDODItXFx1REM5QlxcdURDQjYtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdURDQ0ZcXHVEQ0VBLVxcdUREMDNcXHVERDFFLVxcdUREMzdcXHVERDUyLVxcdURENkJcXHVERDg2LVxcdUREOUZcXHVEREJBLVxcdURERDNcXHVEREVFLVxcdURFMDdcXHVERTIyLVxcdURFM0JcXHVERTU2LVxcdURFNkZcXHVERThBLVxcdURFQTVcXHVERUMyLVxcdURFREFcXHVERURDLVxcdURFRTFcXHVERUZDLVxcdURGMTRcXHVERjE2LVxcdURGMUJcXHVERjM2LVxcdURGNEVcXHVERjUwLVxcdURGNTVcXHVERjcwLVxcdURGODhcXHVERjhBLVxcdURGOEZcXHVERkFBLVxcdURGQzJcXHVERkM0LVxcdURGQzlcXHVERkNCXXxcXHVEODNBW1xcdUREMjItXFx1REQ0M10vLFxuICBMdDogL1tcXHUwMUM1XFx1MDFDOFxcdTAxQ0JcXHUwMUYyXFx1MUY4OC1cXHUxRjhGXFx1MUY5OC1cXHUxRjlGXFx1MUZBOC1cXHUxRkFGXFx1MUZCQ1xcdTFGQ0NcXHUxRkZDXS8sXG4gIExtOiAvW1xcdTAyQjAtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3NFxcdTAzN0FcXHUwNTU5XFx1MDY0MFxcdTA2RTVcXHUwNkU2XFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDk3MVxcdTBFNDZcXHUwRUM2XFx1MTBGQ1xcdTE3RDdcXHUxODQzXFx1MUFBN1xcdTFDNzgtXFx1MUM3RFxcdTFEMkMtXFx1MUQ2QVxcdTFENzhcXHUxRDlCLVxcdTFEQkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTJDN0NcXHUyQzdEXFx1MkQ2RlxcdTJFMkZcXHUzMDA1XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwOURcXHUzMDlFXFx1MzBGQy1cXHUzMEZFXFx1QTAxNVxcdUE0RjgtXFx1QTRGRFxcdUE2MENcXHVBNjdGXFx1QTY5Q1xcdUE2OURcXHVBNzE3LVxcdUE3MUZcXHVBNzcwXFx1QTc4OFxcdUE3RjhcXHVBN0Y5XFx1QTlDRlxcdUE5RTZcXHVBQTcwXFx1QUFERFxcdUFBRjNcXHVBQUY0XFx1QUI1Qy1cXHVBQjVGXFx1RkY3MFxcdUZGOUVcXHVGRjlGXXxcXHVEODFBW1xcdURGNDAtXFx1REY0M118XFx1RDgxQltcXHVERjkzLVxcdURGOUZcXHVERkUwXS8sXG4gIExvOiAvW1xceEFBXFx4QkFcXHUwMUJCXFx1MDFDMC1cXHUwMUMzXFx1MDI5NFxcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDYzRlxcdTA2NDEtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDgwMC1cXHUwODE1XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDhCNi1cXHUwOEJEXFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcyLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzgwXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDU0LVxcdTBENTZcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDVcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwRDAtXFx1MTBGQVxcdTEwRkQtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEQ1xcdTE4MjAtXFx1MTg0MlxcdTE4NDQtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3N1xcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MjEzNS1cXHUyMTM4XFx1MkQzMC1cXHUyRDY3XFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MzAwNlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTAxNFxcdUEwMTYtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGN1xcdUE1MDAtXFx1QTYwQlxcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY2RVxcdUE2QTAtXFx1QTZFNVxcdUE3OEZcXHVBN0Y3XFx1QTdGQi1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUUwLVxcdUE5RTRcXHVBOUU3LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNkZcXHVBQTcxLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCXFx1QUFEQ1xcdUFBRTAtXFx1QUFFQVxcdUFBRjJcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjY2LVxcdUZGNkZcXHVGRjcxLVxcdUZGOURcXHVGRkEwLVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERTgwLVxcdURFOUNcXHVERUEwLVxcdURFRDBcXHVERjAwLVxcdURGMUZcXHVERjMwLVxcdURGNDBcXHVERjQyLVxcdURGNDlcXHVERjUwLVxcdURGNzVcXHVERjgwLVxcdURGOURcXHVERkEwLVxcdURGQzNcXHVERkM4LVxcdURGQ0ZdfFxcdUQ4MDFbXFx1REM1MC1cXHVEQzlEXFx1REQwMC1cXHVERDI3XFx1REQzMC1cXHVERDYzXFx1REUwMC1cXHVERjM2XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjY3XXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzYwLVxcdURDNzZcXHVEQzgwLVxcdURDOUVcXHVEQ0UwLVxcdURDRjJcXHVEQ0Y0XFx1RENGNVxcdUREMDAtXFx1REQxNVxcdUREMjAtXFx1REQzOVxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNjAtXFx1REU3Q1xcdURFODAtXFx1REU5Q1xcdURFQzAtXFx1REVDN1xcdURFQzktXFx1REVFNFxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY3MlxcdURGODAtXFx1REY5MV18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhdfFxcdUQ4MDRbXFx1REMwMy1cXHVEQzM3XFx1REM4My1cXHVEQ0FGXFx1RENEMC1cXHVEQ0U4XFx1REQwMy1cXHVERDI2XFx1REQ1MC1cXHVERDcyXFx1REQ3NlxcdUREODMtXFx1RERCMlxcdUREQzEtXFx1RERDNFxcdUREREFcXHVERERDXFx1REUwMC1cXHVERTExXFx1REUxMy1cXHVERTJCXFx1REU4MC1cXHVERTg2XFx1REU4OFxcdURFOEEtXFx1REU4RFxcdURFOEYtXFx1REU5RFxcdURFOUYtXFx1REVBOFxcdURFQjAtXFx1REVERVxcdURGMDUtXFx1REYwQ1xcdURGMEZcXHVERjEwXFx1REYxMy1cXHVERjI4XFx1REYyQS1cXHVERjMwXFx1REYzMlxcdURGMzNcXHVERjM1LVxcdURGMzlcXHVERjNEXFx1REY1MFxcdURGNUQtXFx1REY2MV18XFx1RDgwNVtcXHVEQzAwLVxcdURDMzRcXHVEQzQ3LVxcdURDNEFcXHVEQzgwLVxcdURDQUZcXHVEQ0M0XFx1RENDNVxcdURDQzdcXHVERDgwLVxcdUREQUVcXHVEREQ4LVxcdUREREJcXHVERTAwLVxcdURFMkZcXHVERTQ0XFx1REU4MC1cXHVERUFBXFx1REYwMC1cXHVERjE5XXxcXHVEODA2W1xcdURDRkZcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDdbXFx1REMwMC1cXHVEQzA4XFx1REMwQS1cXHVEQzJFXFx1REM0MFxcdURDNzItXFx1REM4Rl18XFx1RDgwOFtcXHVEQzAwLVxcdURGOTldfFxcdUQ4MDlbXFx1REM4MC1cXHVERDQzXXxbXFx1RDgwQ1xcdUQ4MUMtXFx1RDgyMFxcdUQ4NDAtXFx1RDg2OFxcdUQ4NkEtXFx1RDg2Q1xcdUQ4NkYtXFx1RDg3Ml1bXFx1REMwMC1cXHVERkZGXXxcXHVEODBEW1xcdURDMDAtXFx1REMyRV18XFx1RDgxMVtcXHVEQzAwLVxcdURFNDZdfFxcdUQ4MUFbXFx1REMwMC1cXHVERTM4XFx1REU0MC1cXHVERTVFXFx1REVEMC1cXHVERUVEXFx1REYwMC1cXHVERjJGXFx1REY2My1cXHVERjc3XFx1REY3RC1cXHVERjhGXXxcXHVEODFCW1xcdURGMDAtXFx1REY0NFxcdURGNTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4NjlbXFx1REMwMC1cXHVERUQ2XFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF0vLFxuXG4gIC8vIE51bWJlcnNcbiAgTmw6IC9bXFx1MTZFRS1cXHUxNkYwXFx1MjE2MC1cXHUyMTgyXFx1MjE4NS1cXHUyMTg4XFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzgtXFx1MzAzQVxcdUE2RTYtXFx1QTZFRl18XFx1RDgwMFtcXHVERDQwLVxcdURENzRcXHVERjQxXFx1REY0QVxcdURGRDEtXFx1REZENV18XFx1RDgwOVtcXHVEQzAwLVxcdURDNkVdLyxcbiAgTmQ6IC9bMC05XFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XFx1MDdDMC1cXHUwN0M5XFx1MDk2Ni1cXHUwOTZGXFx1MDlFNi1cXHUwOUVGXFx1MEE2Ni1cXHUwQTZGXFx1MEFFNi1cXHUwQUVGXFx1MEI2Ni1cXHUwQjZGXFx1MEJFNi1cXHUwQkVGXFx1MEM2Ni1cXHUwQzZGXFx1MENFNi1cXHUwQ0VGXFx1MEQ2Ni1cXHUwRDZGXFx1MERFNi1cXHUwREVGXFx1MEU1MC1cXHUwRTU5XFx1MEVEMC1cXHUwRUQ5XFx1MEYyMC1cXHUwRjI5XFx1MTA0MC1cXHUxMDQ5XFx1MTA5MC1cXHUxMDk5XFx1MTdFMC1cXHUxN0U5XFx1MTgxMC1cXHUxODE5XFx1MTk0Ni1cXHUxOTRGXFx1MTlEMC1cXHUxOUQ5XFx1MUE4MC1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUI1MC1cXHUxQjU5XFx1MUJCMC1cXHUxQkI5XFx1MUM0MC1cXHUxQzQ5XFx1MUM1MC1cXHUxQzU5XFx1QTYyMC1cXHVBNjI5XFx1QThEMC1cXHVBOEQ5XFx1QTkwMC1cXHVBOTA5XFx1QTlEMC1cXHVBOUQ5XFx1QTlGMC1cXHVBOUY5XFx1QUE1MC1cXHVBQTU5XFx1QUJGMC1cXHVBQkY5XFx1RkYxMC1cXHVGRjE5XXxcXHVEODAxW1xcdURDQTAtXFx1RENBOV18XFx1RDgwNFtcXHVEQzY2LVxcdURDNkZcXHVEQ0YwLVxcdURDRjlcXHVERDM2LVxcdUREM0ZcXHVEREQwLVxcdURERDlcXHVERUYwLVxcdURFRjldfFtcXHVEODA1XFx1RDgwN11bXFx1REM1MC1cXHVEQzU5XFx1RENEMC1cXHVEQ0Q5XFx1REU1MC1cXHVERTU5XFx1REVDMC1cXHVERUM5XFx1REYzMC1cXHVERjM5XXxcXHVEODA2W1xcdURDRTAtXFx1RENFOV18XFx1RDgxQVtcXHVERTYwLVxcdURFNjlcXHVERjUwLVxcdURGNTldfFxcdUQ4MzVbXFx1REZDRS1cXHVERkZGXXxcXHVEODNBW1xcdURENTAtXFx1REQ1OV0vLFxuXG4gIC8vIE1hcmtzXG4gIE1uOiAvW1xcdTAzMDAtXFx1MDM2RlxcdTA0ODMtXFx1MDQ4N1xcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MTAtXFx1MDYxQVxcdTA2NEItXFx1MDY1RlxcdTA2NzBcXHUwNkQ2LVxcdTA2RENcXHUwNkRGLVxcdTA2RTRcXHUwNkU3XFx1MDZFOFxcdTA2RUEtXFx1MDZFRFxcdTA3MTFcXHUwNzMwLVxcdTA3NEFcXHUwN0E2LVxcdTA3QjBcXHUwN0VCLVxcdTA3RjNcXHUwODE2LVxcdTA4MTlcXHUwODFCLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MkRcXHUwODU5LVxcdTA4NUJcXHUwOEQ0LVxcdTA4RTFcXHUwOEUzLVxcdTA5MDJcXHUwOTNBXFx1MDkzQ1xcdTA5NDEtXFx1MDk0OFxcdTA5NERcXHUwOTUxLVxcdTA5NTdcXHUwOTYyXFx1MDk2M1xcdTA5ODFcXHUwOUJDXFx1MDlDMS1cXHUwOUM0XFx1MDlDRFxcdTA5RTJcXHUwOUUzXFx1MEEwMVxcdTBBMDJcXHUwQTNDXFx1MEE0MVxcdTBBNDJcXHUwQTQ3XFx1MEE0OFxcdTBBNEItXFx1MEE0RFxcdTBBNTFcXHUwQTcwXFx1MEE3MVxcdTBBNzVcXHUwQTgxXFx1MEE4MlxcdTBBQkNcXHUwQUMxLVxcdTBBQzVcXHUwQUM3XFx1MEFDOFxcdTBBQ0RcXHUwQUUyXFx1MEFFM1xcdTBCMDFcXHUwQjNDXFx1MEIzRlxcdTBCNDEtXFx1MEI0NFxcdTBCNERcXHUwQjU2XFx1MEI2MlxcdTBCNjNcXHUwQjgyXFx1MEJDMFxcdTBCQ0RcXHUwQzAwXFx1MEMzRS1cXHUwQzQwXFx1MEM0Ni1cXHUwQzQ4XFx1MEM0QS1cXHUwQzREXFx1MEM1NVxcdTBDNTZcXHUwQzYyXFx1MEM2M1xcdTBDODFcXHUwQ0JDXFx1MENCRlxcdTBDQzZcXHUwQ0NDXFx1MENDRFxcdTBDRTJcXHUwQ0UzXFx1MEQwMVxcdTBENDEtXFx1MEQ0NFxcdTBENERcXHUwRDYyXFx1MEQ2M1xcdTBEQ0FcXHUwREQyLVxcdTBERDRcXHUwREQ2XFx1MEUzMVxcdTBFMzQtXFx1MEUzQVxcdTBFNDctXFx1MEU0RVxcdTBFQjFcXHUwRUI0LVxcdTBFQjlcXHUwRUJCXFx1MEVCQ1xcdTBFQzgtXFx1MEVDRFxcdTBGMThcXHUwRjE5XFx1MEYzNVxcdTBGMzdcXHUwRjM5XFx1MEY3MS1cXHUwRjdFXFx1MEY4MC1cXHUwRjg0XFx1MEY4NlxcdTBGODdcXHUwRjhELVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAyRC1cXHUxMDMwXFx1MTAzMi1cXHUxMDM3XFx1MTAzOVxcdTEwM0FcXHUxMDNEXFx1MTAzRVxcdTEwNThcXHUxMDU5XFx1MTA1RS1cXHUxMDYwXFx1MTA3MS1cXHUxMDc0XFx1MTA4MlxcdTEwODVcXHUxMDg2XFx1MTA4RFxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdCNFxcdTE3QjVcXHUxN0I3LVxcdTE3QkRcXHUxN0M2XFx1MTdDOS1cXHUxN0QzXFx1MTdERFxcdTE4MEItXFx1MTgwRFxcdTE4ODVcXHUxODg2XFx1MThBOVxcdTE5MjAtXFx1MTkyMlxcdTE5MjdcXHUxOTI4XFx1MTkzMlxcdTE5MzktXFx1MTkzQlxcdTFBMTdcXHUxQTE4XFx1MUExQlxcdTFBNTZcXHUxQTU4LVxcdTFBNUVcXHUxQTYwXFx1MUE2MlxcdTFBNjUtXFx1MUE2Q1xcdTFBNzMtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkRcXHUxQjAwLVxcdTFCMDNcXHUxQjM0XFx1MUIzNi1cXHUxQjNBXFx1MUIzQ1xcdTFCNDJcXHUxQjZCLVxcdTFCNzNcXHUxQjgwXFx1MUI4MVxcdTFCQTItXFx1MUJBNVxcdTFCQThcXHUxQkE5XFx1MUJBQi1cXHUxQkFEXFx1MUJFNlxcdTFCRThcXHUxQkU5XFx1MUJFRFxcdTFCRUYtXFx1MUJGMVxcdTFDMkMtXFx1MUMzM1xcdTFDMzZcXHUxQzM3XFx1MUNEMC1cXHUxQ0QyXFx1MUNENC1cXHUxQ0UwXFx1MUNFMi1cXHUxQ0U4XFx1MUNFRFxcdTFDRjRcXHUxQ0Y4XFx1MUNGOVxcdTFEQzAtXFx1MURGNVxcdTFERkItXFx1MURGRlxcdTIwRDAtXFx1MjBEQ1xcdTIwRTFcXHUyMEU1LVxcdTIwRjBcXHUyQ0VGLVxcdTJDRjFcXHUyRDdGXFx1MkRFMC1cXHUyREZGXFx1MzAyQS1cXHUzMDJEXFx1MzA5OVxcdTMwOUFcXHVBNjZGXFx1QTY3NC1cXHVBNjdEXFx1QTY5RVxcdUE2OUZcXHVBNkYwXFx1QTZGMVxcdUE4MDJcXHVBODA2XFx1QTgwQlxcdUE4MjVcXHVBODI2XFx1QThDNFxcdUE4QzVcXHVBOEUwLVxcdUE4RjFcXHVBOTI2LVxcdUE5MkRcXHVBOTQ3LVxcdUE5NTFcXHVBOTgwLVxcdUE5ODJcXHVBOUIzXFx1QTlCNi1cXHVBOUI5XFx1QTlCQ1xcdUE5RTVcXHVBQTI5LVxcdUFBMkVcXHVBQTMxXFx1QUEzMlxcdUFBMzVcXHVBQTM2XFx1QUE0M1xcdUFBNENcXHVBQTdDXFx1QUFCMFxcdUFBQjItXFx1QUFCNFxcdUFBQjdcXHVBQUI4XFx1QUFCRVxcdUFBQkZcXHVBQUMxXFx1QUFFQ1xcdUFBRURcXHVBQUY2XFx1QUJFNVxcdUFCRThcXHVBQkVEXFx1RkIxRVxcdUZFMDAtXFx1RkUwRlxcdUZFMjAtXFx1RkUyRl18XFx1RDgwMFtcXHVEREZEXFx1REVFMFxcdURGNzYtXFx1REY3QV18XFx1RDgwMltcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNl18XFx1RDgwNFtcXHVEQzAxXFx1REMzOC1cXHVEQzQ2XFx1REM3Ri1cXHVEQzgxXFx1RENCMy1cXHVEQ0I2XFx1RENCOVxcdURDQkFcXHVERDAwLVxcdUREMDJcXHVERDI3LVxcdUREMkJcXHVERDJELVxcdUREMzRcXHVERDczXFx1REQ4MFxcdUREODFcXHVEREI2LVxcdUREQkVcXHVERENBLVxcdUREQ0NcXHVERTJGLVxcdURFMzFcXHVERTM0XFx1REUzNlxcdURFMzdcXHVERTNFXFx1REVERlxcdURFRTMtXFx1REVFQVxcdURGMDBcXHVERjAxXFx1REYzQ1xcdURGNDBcXHVERjY2LVxcdURGNkNcXHVERjcwLVxcdURGNzRdfFxcdUQ4MDVbXFx1REMzOC1cXHVEQzNGXFx1REM0Mi1cXHVEQzQ0XFx1REM0NlxcdURDQjMtXFx1RENCOFxcdURDQkFcXHVEQ0JGXFx1RENDMFxcdURDQzJcXHVEQ0MzXFx1RERCMi1cXHVEREI1XFx1RERCQ1xcdUREQkRcXHVEREJGXFx1RERDMFxcdURERENcXHVEREREXFx1REUzMy1cXHVERTNBXFx1REUzRFxcdURFM0ZcXHVERTQwXFx1REVBQlxcdURFQURcXHVERUIwLVxcdURFQjVcXHVERUI3XFx1REYxRC1cXHVERjFGXFx1REYyMi1cXHVERjI1XFx1REYyNy1cXHVERjJCXXxcXHVEODA3W1xcdURDMzAtXFx1REMzNlxcdURDMzgtXFx1REMzRFxcdURDM0ZcXHVEQzkyLVxcdURDQTdcXHVEQ0FBLVxcdURDQjBcXHVEQ0IyXFx1RENCM1xcdURDQjVcXHVEQ0I2XXxcXHVEODFBW1xcdURFRjAtXFx1REVGNFxcdURGMzAtXFx1REYzNl18XFx1RDgxQltcXHVERjhGLVxcdURGOTJdfFxcdUQ4MkZbXFx1REM5RFxcdURDOUVdfFxcdUQ4MzRbXFx1REQ2Ny1cXHVERDY5XFx1REQ3Qi1cXHVERDgyXFx1REQ4NS1cXHVERDhCXFx1RERBQS1cXHVEREFEXFx1REU0Mi1cXHVERTQ0XXxcXHVEODM2W1xcdURFMDAtXFx1REUzNlxcdURFM0ItXFx1REU2Q1xcdURFNzVcXHVERTg0XFx1REU5Qi1cXHVERTlGXFx1REVBMS1cXHVERUFGXXxcXHVEODM4W1xcdURDMDAtXFx1REMwNlxcdURDMDgtXFx1REMxOFxcdURDMUItXFx1REMyMVxcdURDMjNcXHVEQzI0XFx1REMyNi1cXHVEQzJBXXxcXHVEODNBW1xcdURDRDAtXFx1RENENlxcdURENDQtXFx1REQ0QV18XFx1REI0MFtcXHVERDAwLVxcdURERUZdLyxcbiAgTWM6IC9bXFx1MDkwMy1cXHUwOTAzXXxbXFx1MDkzRS1cXHUwOTQwXXxbXFx1MDk0OS1cXHUwOTRDXXxbXFx1MDk4Mi1cXHUwOTgzXXxbXFx1MDlCRS1cXHUwOUMwXXxbXFx1MDlDNy1cXHUwOUM4XXxbXFx1MDlDQi1cXHUwOUNDXXxbXFx1MDlENy1cXHUwOUQ3XXxbXFx1MEEzRS1cXHUwQTQwXXxbXFx1MEE4My1cXHUwQTgzXXxbXFx1MEFCRS1cXHUwQUMwXXxbXFx1MEFDOS1cXHUwQUM5XXxbXFx1MEFDQi1cXHUwQUNDXXxbXFx1MEIwMi1cXHUwQjAzXXxbXFx1MEIzRS1cXHUwQjNFXXxbXFx1MEI0MC1cXHUwQjQwXXxbXFx1MEI0Ny1cXHUwQjQ4XXxbXFx1MEI0Qi1cXHUwQjRDXXxbXFx1MEI1Ny1cXHUwQjU3XXxbXFx1MEI4My1cXHUwQjgzXXxbXFx1MEJCRS1cXHUwQkJGXXxbXFx1MEJDMS1cXHUwQkMyXXxbXFx1MEJDNi1cXHUwQkM4XXxbXFx1MEJDQS1cXHUwQkNDXXxbXFx1MEJENy1cXHUwQkQ3XXxbXFx1MEMwMS1cXHUwQzAzXXxbXFx1MEM0MS1cXHUwQzQ0XXxbXFx1MEM4Mi1cXHUwQzgzXXxbXFx1MENCRS1cXHUwQ0JFXXxbXFx1MENDMC1cXHUwQ0M0XXxbXFx1MENDNy1cXHUwQ0M4XXxbXFx1MENDQS1cXHUwQ0NCXXxbXFx1MENENS1cXHUwQ0Q2XXxbXFx1MEQwMi1cXHUwRDAzXXxbXFx1MEQzRS1cXHUwRDQwXXxbXFx1MEQ0Ni1cXHUwRDQ4XXxbXFx1MEQ0QS1cXHUwRDRDXXxbXFx1MEQ1Ny1cXHUwRDU3XXxbXFx1MEYzRS1cXHUwRjNGXXxbXFx1MEY3Ri1cXHUwRjdGXS8sXG5cbiAgLy8gUHVuY3R1YXRpb24sIENvbm5lY3RvclxuICBQYzogL1tfXFx1MjAzRlxcdTIwNDBcXHUyMDU0XFx1RkUzM1xcdUZFMzRcXHVGRTRELVxcdUZFNEZcXHVGRjNGXS8sXG5cbiAgLy8gU2VwYXJhdG9yLCBTcGFjZVxuICBaczogL1sgXFx4QTBcXHUxNjgwXFx1MjAwMC1cXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXS8sXG5cbiAgLy8gVGhlc2UgdHdvIGFyZSBub3QgcmVhbCBVbmljb2RlIGNhdGVnb3JpZXMsIGJ1dCBvdXIgdXNlZnVsIGZvciBPaG0uXG4gIC8vIEwgaXMgYSBjb21iaW5hdGlvbiBvZiBhbGwgdGhlIGxldHRlciBjYXRlZ29yaWVzLlxuICAvLyBMdG1vIGlzIGEgY29tYmluYXRpb24gb2YgTHQsIExtLCBhbmQgTG8uXG4gIEw6IC9bQS1aYS16XFx4QUFcXHhCNVxceEJBXFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxceEY4LVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3QS1cXHUwMzdEXFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RS1cXHUwM0ExXFx1MDNBMy1cXHUwM0Y1XFx1MDNGNy1cXHUwNDgxXFx1MDQ4QS1cXHUwNTJGXFx1MDUzMS1cXHUwNTU2XFx1MDU1OVxcdTA1NjEtXFx1MDU4N1xcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzEtXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NlxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVDNlxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0Q3XFx1MTdEQ1xcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQUE3XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDN0RcXHUxQzgwLVxcdTFDODhcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTFEMDAtXFx1MURCRlxcdTFFMDAtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMkYtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTgzXFx1MjE4NFxcdTJDMDAtXFx1MkMyRVxcdTJDMzAtXFx1MkM1RVxcdTJDNjAtXFx1MkNFNFxcdTJDRUItXFx1MkNFRVxcdTJDRjJcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHUyRDMwLVxcdTJENjdcXHUyRDZGXFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MkUyRlxcdTMwMDVcXHUzMDA2XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NDAtXFx1QTY2RVxcdUE2N0YtXFx1QTY5RFxcdUE2QTAtXFx1QTZFNVxcdUE3MTctXFx1QTcxRlxcdUE3MjItXFx1QTc4OFxcdUE3OEItXFx1QTdBRVxcdUE3QjAtXFx1QTdCN1xcdUE3RjctXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlDRlxcdUE5RTAtXFx1QTlFNFxcdUE5RTYtXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI2NVxcdUFCNzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzAwLVxcdURDOURcXHVEQ0IwLVxcdURDRDNcXHVEQ0Q4LVxcdURDRkJcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OFxcdURDODAtXFx1RENCMlxcdURDQzAtXFx1RENGMl18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENBMC1cXHVEQ0RGXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjQwLVxcdURGNDNcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MFxcdURGOTMtXFx1REY5RlxcdURGRTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4MzVbXFx1REMwMC1cXHVEQzU0XFx1REM1Ni1cXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjlcXHVEQ0JCXFx1RENCRC1cXHVEQ0MzXFx1RENDNS1cXHVERDA1XFx1REQwNy1cXHVERDBBXFx1REQwRC1cXHVERDE0XFx1REQxNi1cXHVERDFDXFx1REQxRS1cXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENTItXFx1REVBNVxcdURFQTgtXFx1REVDMFxcdURFQzItXFx1REVEQVxcdURFREMtXFx1REVGQVxcdURFRkMtXFx1REYxNFxcdURGMTYtXFx1REYzNFxcdURGMzYtXFx1REY0RVxcdURGNTAtXFx1REY2RVxcdURGNzAtXFx1REY4OFxcdURGOEEtXFx1REZBOFxcdURGQUEtXFx1REZDMlxcdURGQzQtXFx1REZDQl18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRcXHVERDAwLVxcdURENDNdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS8sXG4gIEx0bW86IC9bXFx1MDFDNVxcdTAxQzhcXHUwMUNCXFx1MDFGMlxcdTFGODgtXFx1MUY4RlxcdTFGOTgtXFx1MUY5RlxcdTFGQTgtXFx1MUZBRlxcdTFGQkNcXHUxRkNDXFx1MUZGQ118W1xcdTAyQjAtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3NFxcdTAzN0FcXHUwNTU5XFx1MDY0MFxcdTA2RTVcXHUwNkU2XFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDk3MVxcdTBFNDZcXHUwRUM2XFx1MTBGQ1xcdTE3RDdcXHUxODQzXFx1MUFBN1xcdTFDNzgtXFx1MUM3RFxcdTFEMkMtXFx1MUQ2QVxcdTFENzhcXHUxRDlCLVxcdTFEQkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTJDN0NcXHUyQzdEXFx1MkQ2RlxcdTJFMkZcXHUzMDA1XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwOURcXHUzMDlFXFx1MzBGQy1cXHUzMEZFXFx1QTAxNVxcdUE0RjgtXFx1QTRGRFxcdUE2MENcXHVBNjdGXFx1QTY5Q1xcdUE2OURcXHVBNzE3LVxcdUE3MUZcXHVBNzcwXFx1QTc4OFxcdUE3RjhcXHVBN0Y5XFx1QTlDRlxcdUE5RTZcXHVBQTcwXFx1QUFERFxcdUFBRjNcXHVBQUY0XFx1QUI1Qy1cXHVBQjVGXFx1RkY3MFxcdUZGOUVcXHVGRjlGXXxcXHVEODFBW1xcdURGNDAtXFx1REY0M118XFx1RDgxQltcXHVERjkzLVxcdURGOUZcXHVERkUwXXxbXFx4QUFcXHhCQVxcdTAxQkJcXHUwMUMwLVxcdTAxQzNcXHUwMjk0XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjNGXFx1MDY0MS1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwODAwLVxcdTA4MTVcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzItXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NVxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBEMC1cXHUxMEZBXFx1MTBGRC1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0RDXFx1MTgyMC1cXHUxODQyXFx1MTg0NC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzc3XFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUyMTM1LVxcdTIxMzhcXHUyRDMwLVxcdTJENjdcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUzMDA2XFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBMDE0XFx1QTAxNi1cXHVBNDhDXFx1QTREMC1cXHVBNEY3XFx1QTUwMC1cXHVBNjBCXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjZFXFx1QTZBMC1cXHVBNkU1XFx1QTc4RlxcdUE3RjdcXHVBN0ZCLVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5RTAtXFx1QTlFNFxcdUE5RTctXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE2RlxcdUFBNzEtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREJcXHVBQURDXFx1QUFFMC1cXHVBQUVBXFx1QUFGMlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGNjYtXFx1RkY2RlxcdUZGNzEtXFx1RkY5RFxcdUZGQTAtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzUwLVxcdURDOURcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS9cbn07XG4iXX0=
