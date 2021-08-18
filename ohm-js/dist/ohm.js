(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ohm"] = factory();
	else
		root["ohm"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/util-extend/extend.js":
/*!*********************************************!*\
  !*** ../node_modules/util-extend/extend.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ }),

/***/ "./dist/built-in-rules.js":
/*!********************************!*\
  !*** ./dist/built-in-rules.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ohm = __webpack_require__(/*! .. */ "./src/main.js");
module.exports = ohm.makeRecipe(["grammar",{"source":"BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"},"BuiltInRules",null,null,{"alnum":["define",{"sourceInterval":[18,78]},"an alpha-numeric character",[],["alt",{"sourceInterval":[60,78]},["app",{"sourceInterval":[60,66]},"letter",[]],["app",{"sourceInterval":[73,78]},"digit",[]]]],"letter":["define",{"sourceInterval":[82,142]},"a letter",[],["alt",{"sourceInterval":[107,142]},["app",{"sourceInterval":[107,112]},"lower",[]],["app",{"sourceInterval":[119,124]},"upper",[]],["app",{"sourceInterval":[131,142]},"unicodeLtmo",[]]]],"digit":["define",{"sourceInterval":[146,177]},"a digit",[],["range",{"sourceInterval":[169,177]},"0","9"]],"hexDigit":["define",{"sourceInterval":[181,254]},"a hexadecimal digit",[],["alt",{"sourceInterval":[219,254]},["app",{"sourceInterval":[219,224]},"digit",[]],["range",{"sourceInterval":[231,239]},"a","f"],["range",{"sourceInterval":[246,254]},"A","F"]]],"ListOf":["define",{"sourceInterval":[258,336]},null,["elem","sep"],["alt",{"sourceInterval":[282,336]},["app",{"sourceInterval":[282,307]},"NonemptyListOf",[["param",{"sourceInterval":[297,301]},0],["param",{"sourceInterval":[303,306]},1]]],["app",{"sourceInterval":[314,336]},"EmptyListOf",[["param",{"sourceInterval":[326,330]},0],["param",{"sourceInterval":[332,335]},1]]]]],"NonemptyListOf":["define",{"sourceInterval":[340,388]},null,["elem","sep"],["seq",{"sourceInterval":[372,388]},["param",{"sourceInterval":[372,376]},0],["star",{"sourceInterval":[377,388]},["seq",{"sourceInterval":[378,386]},["param",{"sourceInterval":[378,381]},1],["param",{"sourceInterval":[382,386]},0]]]]],"EmptyListOf":["define",{"sourceInterval":[392,434]},null,["elem","sep"],["seq",{"sourceInterval":[438,438]}]],"listOf":["define",{"sourceInterval":[438,516]},null,["elem","sep"],["alt",{"sourceInterval":[462,516]},["app",{"sourceInterval":[462,487]},"nonemptyListOf",[["param",{"sourceInterval":[477,481]},0],["param",{"sourceInterval":[483,486]},1]]],["app",{"sourceInterval":[494,516]},"emptyListOf",[["param",{"sourceInterval":[506,510]},0],["param",{"sourceInterval":[512,515]},1]]]]],"nonemptyListOf":["define",{"sourceInterval":[520,568]},null,["elem","sep"],["seq",{"sourceInterval":[552,568]},["param",{"sourceInterval":[552,556]},0],["star",{"sourceInterval":[557,568]},["seq",{"sourceInterval":[558,566]},["param",{"sourceInterval":[558,561]},1],["param",{"sourceInterval":[562,566]},0]]]]],"emptyListOf":["define",{"sourceInterval":[572,614]},null,["elem","sep"],["seq",{"sourceInterval":[616,616]}]]}]);


/***/ }),

/***/ "./dist/ohm-grammar.js":
/*!*****************************!*\
  !*** ./dist/ohm-grammar.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ohm = __webpack_require__(/*! .. */ "./src/main.js");
module.exports = ohm.makeRecipe(["grammar",{"source":"Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" OverrideRuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  OverrideRuleBody\n    = \"|\"? NonemptyListOf<OverrideTopLevelTerm, \"|\">\n\n  OverrideTopLevelTerm\n    = \"...\"  -- superSplice\n    | TopLevelTerm\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | oneCharTerminal \"..\" oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  oneCharTerminal\n    = \"\\\"\" terminalChar \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* &(\"\\n\" | end)  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"},"Ohm",null,"Grammars",{"Grammars":["define",{"sourceInterval":[9,32]},null,[],["star",{"sourceInterval":[24,32]},["app",{"sourceInterval":[24,31]},"Grammar",[]]]],"Grammar":["define",{"sourceInterval":[36,83]},null,[],["seq",{"sourceInterval":[50,83]},["app",{"sourceInterval":[50,55]},"ident",[]],["opt",{"sourceInterval":[56,69]},["app",{"sourceInterval":[56,68]},"SuperGrammar",[]]],["terminal",{"sourceInterval":[70,73]},"{"],["star",{"sourceInterval":[74,79]},["app",{"sourceInterval":[74,78]},"Rule",[]]],["terminal",{"sourceInterval":[80,83]},"}"]]],"SuperGrammar":["define",{"sourceInterval":[87,116]},null,[],["seq",{"sourceInterval":[106,116]},["terminal",{"sourceInterval":[106,110]},"<:"],["app",{"sourceInterval":[111,116]},"ident",[]]]],"Rule_define":["define",{"sourceInterval":[131,181]},null,[],["seq",{"sourceInterval":[131,170]},["app",{"sourceInterval":[131,136]},"ident",[]],["opt",{"sourceInterval":[137,145]},["app",{"sourceInterval":[137,144]},"Formals",[]]],["opt",{"sourceInterval":[146,156]},["app",{"sourceInterval":[146,155]},"ruleDescr",[]]],["terminal",{"sourceInterval":[157,160]},"="],["app",{"sourceInterval":[162,170]},"RuleBody",[]]]],"Rule_override":["define",{"sourceInterval":[188,248]},null,[],["seq",{"sourceInterval":[188,235]},["app",{"sourceInterval":[188,193]},"ident",[]],["opt",{"sourceInterval":[194,202]},["app",{"sourceInterval":[194,201]},"Formals",[]]],["terminal",{"sourceInterval":[214,218]},":="],["app",{"sourceInterval":[219,235]},"OverrideRuleBody",[]]]],"Rule_extend":["define",{"sourceInterval":[255,305]},null,[],["seq",{"sourceInterval":[255,294]},["app",{"sourceInterval":[255,260]},"ident",[]],["opt",{"sourceInterval":[261,269]},["app",{"sourceInterval":[261,268]},"Formals",[]]],["terminal",{"sourceInterval":[281,285]},"+="],["app",{"sourceInterval":[286,294]},"RuleBody",[]]]],"Rule":["define",{"sourceInterval":[120,305]},null,[],["alt",{"sourceInterval":[131,305]},["app",{"sourceInterval":[131,170]},"Rule_define",[]],["app",{"sourceInterval":[188,235]},"Rule_override",[]],["app",{"sourceInterval":[255,294]},"Rule_extend",[]]]],"RuleBody":["define",{"sourceInterval":[309,362]},null,[],["seq",{"sourceInterval":[324,362]},["opt",{"sourceInterval":[324,328]},["terminal",{"sourceInterval":[324,327]},"|"]],["app",{"sourceInterval":[329,362]},"NonemptyListOf",[["app",{"sourceInterval":[344,356]},"TopLevelTerm",[]],["terminal",{"sourceInterval":[358,361]},"|"]]]]],"TopLevelTerm_inline":["define",{"sourceInterval":[385,408]},null,[],["seq",{"sourceInterval":[385,397]},["app",{"sourceInterval":[385,388]},"Seq",[]],["app",{"sourceInterval":[389,397]},"caseName",[]]]],"TopLevelTerm":["define",{"sourceInterval":[366,418]},null,[],["alt",{"sourceInterval":[385,418]},["app",{"sourceInterval":[385,397]},"TopLevelTerm_inline",[]],["app",{"sourceInterval":[415,418]},"Seq",[]]]],"OverrideRuleBody":["define",{"sourceInterval":[422,491]},null,[],["seq",{"sourceInterval":[445,491]},["opt",{"sourceInterval":[445,449]},["terminal",{"sourceInterval":[445,448]},"|"]],["app",{"sourceInterval":[450,491]},"NonemptyListOf",[["app",{"sourceInterval":[465,485]},"OverrideTopLevelTerm",[]],["terminal",{"sourceInterval":[487,490]},"|"]]]]],"OverrideTopLevelTerm_superSplice":["define",{"sourceInterval":[522,543]},null,[],["terminal",{"sourceInterval":[522,527]},"..."]],"OverrideTopLevelTerm":["define",{"sourceInterval":[495,562]},null,[],["alt",{"sourceInterval":[522,562]},["app",{"sourceInterval":[522,527]},"OverrideTopLevelTerm_superSplice",[]],["app",{"sourceInterval":[550,562]},"TopLevelTerm",[]]]],"Formals":["define",{"sourceInterval":[566,606]},null,[],["seq",{"sourceInterval":[580,606]},["terminal",{"sourceInterval":[580,583]},"<"],["app",{"sourceInterval":[584,602]},"ListOf",[["app",{"sourceInterval":[591,596]},"ident",[]],["terminal",{"sourceInterval":[598,601]},","]]],["terminal",{"sourceInterval":[603,606]},">"]]],"Params":["define",{"sourceInterval":[610,647]},null,[],["seq",{"sourceInterval":[623,647]},["terminal",{"sourceInterval":[623,626]},"<"],["app",{"sourceInterval":[627,643]},"ListOf",[["app",{"sourceInterval":[634,637]},"Seq",[]],["terminal",{"sourceInterval":[639,642]},","]]],["terminal",{"sourceInterval":[644,647]},">"]]],"Alt":["define",{"sourceInterval":[651,685]},null,[],["app",{"sourceInterval":[661,685]},"NonemptyListOf",[["app",{"sourceInterval":[676,679]},"Seq",[]],["terminal",{"sourceInterval":[681,684]},"|"]]]],"Seq":["define",{"sourceInterval":[689,704]},null,[],["star",{"sourceInterval":[699,704]},["app",{"sourceInterval":[699,703]},"Iter",[]]]],"Iter_star":["define",{"sourceInterval":[719,736]},null,[],["seq",{"sourceInterval":[719,727]},["app",{"sourceInterval":[719,723]},"Pred",[]],["terminal",{"sourceInterval":[724,727]},"*"]]],"Iter_plus":["define",{"sourceInterval":[743,760]},null,[],["seq",{"sourceInterval":[743,751]},["app",{"sourceInterval":[743,747]},"Pred",[]],["terminal",{"sourceInterval":[748,751]},"+"]]],"Iter_opt":["define",{"sourceInterval":[767,783]},null,[],["seq",{"sourceInterval":[767,775]},["app",{"sourceInterval":[767,771]},"Pred",[]],["terminal",{"sourceInterval":[772,775]},"?"]]],"Iter":["define",{"sourceInterval":[708,794]},null,[],["alt",{"sourceInterval":[719,794]},["app",{"sourceInterval":[719,727]},"Iter_star",[]],["app",{"sourceInterval":[743,751]},"Iter_plus",[]],["app",{"sourceInterval":[767,775]},"Iter_opt",[]],["app",{"sourceInterval":[790,794]},"Pred",[]]]],"Pred_not":["define",{"sourceInterval":[809,824]},null,[],["seq",{"sourceInterval":[809,816]},["terminal",{"sourceInterval":[809,812]},"~"],["app",{"sourceInterval":[813,816]},"Lex",[]]]],"Pred_lookahead":["define",{"sourceInterval":[831,852]},null,[],["seq",{"sourceInterval":[831,838]},["terminal",{"sourceInterval":[831,834]},"&"],["app",{"sourceInterval":[835,838]},"Lex",[]]]],"Pred":["define",{"sourceInterval":[798,862]},null,[],["alt",{"sourceInterval":[809,862]},["app",{"sourceInterval":[809,816]},"Pred_not",[]],["app",{"sourceInterval":[831,838]},"Pred_lookahead",[]],["app",{"sourceInterval":[859,862]},"Lex",[]]]],"Lex_lex":["define",{"sourceInterval":[876,892]},null,[],["seq",{"sourceInterval":[876,884]},["terminal",{"sourceInterval":[876,879]},"#"],["app",{"sourceInterval":[880,884]},"Base",[]]]],"Lex":["define",{"sourceInterval":[866,903]},null,[],["alt",{"sourceInterval":[876,903]},["app",{"sourceInterval":[876,884]},"Lex_lex",[]],["app",{"sourceInterval":[899,903]},"Base",[]]]],"Base_application":["define",{"sourceInterval":[918,979]},null,[],["seq",{"sourceInterval":[918,963]},["app",{"sourceInterval":[918,923]},"ident",[]],["opt",{"sourceInterval":[924,931]},["app",{"sourceInterval":[924,930]},"Params",[]]],["not",{"sourceInterval":[932,963]},["alt",{"sourceInterval":[934,962]},["seq",{"sourceInterval":[934,948]},["opt",{"sourceInterval":[934,944]},["app",{"sourceInterval":[934,943]},"ruleDescr",[]]],["terminal",{"sourceInterval":[945,948]},"="]],["terminal",{"sourceInterval":[951,955]},":="],["terminal",{"sourceInterval":[958,962]},"+="]]]]],"Base_range":["define",{"sourceInterval":[986,1041]},null,[],["seq",{"sourceInterval":[986,1022]},["app",{"sourceInterval":[986,1001]},"oneCharTerminal",[]],["terminal",{"sourceInterval":[1002,1006]},".."],["app",{"sourceInterval":[1007,1022]},"oneCharTerminal",[]]]],"Base_terminal":["define",{"sourceInterval":[1048,1106]},null,[],["app",{"sourceInterval":[1048,1056]},"terminal",[]]],"Base_paren":["define",{"sourceInterval":[1113,1168]},null,[],["seq",{"sourceInterval":[1113,1124]},["terminal",{"sourceInterval":[1113,1116]},"("],["app",{"sourceInterval":[1117,1120]},"Alt",[]],["terminal",{"sourceInterval":[1121,1124]},")"]]],"Base":["define",{"sourceInterval":[907,1168]},null,[],["alt",{"sourceInterval":[918,1168]},["app",{"sourceInterval":[918,963]},"Base_application",[]],["app",{"sourceInterval":[986,1022]},"Base_range",[]],["app",{"sourceInterval":[1048,1056]},"Base_terminal",[]],["app",{"sourceInterval":[1113,1124]},"Base_paren",[]]]],"ruleDescr":["define",{"sourceInterval":[1172,1231]},"a rule description",[],["seq",{"sourceInterval":[1210,1231]},["terminal",{"sourceInterval":[1210,1213]},"("],["app",{"sourceInterval":[1214,1227]},"ruleDescrText",[]],["terminal",{"sourceInterval":[1228,1231]},")"]]],"ruleDescrText":["define",{"sourceInterval":[1235,1266]},null,[],["star",{"sourceInterval":[1255,1266]},["seq",{"sourceInterval":[1256,1264]},["not",{"sourceInterval":[1256,1260]},["terminal",{"sourceInterval":[1257,1260]},")"]],["app",{"sourceInterval":[1261,1264]},"any",[]]]]],"caseName":["define",{"sourceInterval":[1270,1338]},null,[],["seq",{"sourceInterval":[1285,1338]},["terminal",{"sourceInterval":[1285,1289]},"--"],["star",{"sourceInterval":[1290,1304]},["seq",{"sourceInterval":[1291,1302]},["not",{"sourceInterval":[1291,1296]},["terminal",{"sourceInterval":[1292,1296]},"\n"]],["app",{"sourceInterval":[1297,1302]},"space",[]]]],["app",{"sourceInterval":[1305,1309]},"name",[]],["star",{"sourceInterval":[1310,1324]},["seq",{"sourceInterval":[1311,1322]},["not",{"sourceInterval":[1311,1316]},["terminal",{"sourceInterval":[1312,1316]},"\n"]],["app",{"sourceInterval":[1317,1322]},"space",[]]]],["alt",{"sourceInterval":[1326,1337]},["terminal",{"sourceInterval":[1326,1330]},"\n"],["lookahead",{"sourceInterval":[1333,1337]},["terminal",{"sourceInterval":[1334,1337]},"}"]]]]],"name":["define",{"sourceInterval":[1342,1382]},"a name",[],["seq",{"sourceInterval":[1363,1382]},["app",{"sourceInterval":[1363,1372]},"nameFirst",[]],["star",{"sourceInterval":[1373,1382]},["app",{"sourceInterval":[1373,1381]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[1386,1418]},null,[],["alt",{"sourceInterval":[1402,1418]},["terminal",{"sourceInterval":[1402,1405]},"_"],["app",{"sourceInterval":[1412,1418]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[1422,1452]},null,[],["alt",{"sourceInterval":[1437,1452]},["terminal",{"sourceInterval":[1437,1440]},"_"],["app",{"sourceInterval":[1447,1452]},"alnum",[]]]],"ident":["define",{"sourceInterval":[1456,1489]},"an identifier",[],["app",{"sourceInterval":[1485,1489]},"name",[]]],"terminal":["define",{"sourceInterval":[1493,1531]},null,[],["seq",{"sourceInterval":[1508,1531]},["terminal",{"sourceInterval":[1508,1512]},"\""],["star",{"sourceInterval":[1513,1526]},["app",{"sourceInterval":[1513,1525]},"terminalChar",[]]],["terminal",{"sourceInterval":[1527,1531]},"\""]]],"oneCharTerminal":["define",{"sourceInterval":[1535,1579]},null,[],["seq",{"sourceInterval":[1557,1579]},["terminal",{"sourceInterval":[1557,1561]},"\""],["app",{"sourceInterval":[1562,1574]},"terminalChar",[]],["terminal",{"sourceInterval":[1575,1579]},"\""]]],"terminalChar":["define",{"sourceInterval":[1583,1640]},null,[],["alt",{"sourceInterval":[1602,1640]},["app",{"sourceInterval":[1602,1612]},"escapeChar",[]],["seq",{"sourceInterval":[1619,1640]},["not",{"sourceInterval":[1619,1624]},["terminal",{"sourceInterval":[1620,1624]},"\\"]],["not",{"sourceInterval":[1625,1630]},["terminal",{"sourceInterval":[1626,1630]},"\""]],["not",{"sourceInterval":[1631,1636]},["terminal",{"sourceInterval":[1632,1636]},"\n"]],["app",{"sourceInterval":[1637,1640]},"any",[]]]]],"escapeChar_backslash":["define",{"sourceInterval":[1683,1738]},null,[],["terminal",{"sourceInterval":[1683,1689]},"\\\\"]],"escapeChar_doubleQuote":["define",{"sourceInterval":[1745,1802]},null,[],["terminal",{"sourceInterval":[1745,1751]},"\\\""]],"escapeChar_singleQuote":["define",{"sourceInterval":[1809,1866]},null,[],["terminal",{"sourceInterval":[1809,1815]},"\\'"]],"escapeChar_backspace":["define",{"sourceInterval":[1873,1928]},null,[],["terminal",{"sourceInterval":[1873,1878]},"\\b"]],"escapeChar_lineFeed":["define",{"sourceInterval":[1935,1989]},null,[],["terminal",{"sourceInterval":[1935,1940]},"\\n"]],"escapeChar_carriageReturn":["define",{"sourceInterval":[1996,2056]},null,[],["terminal",{"sourceInterval":[1996,2001]},"\\r"]],"escapeChar_tab":["define",{"sourceInterval":[2063,2112]},null,[],["terminal",{"sourceInterval":[2063,2068]},"\\t"]],"escapeChar_unicodeEscape":["define",{"sourceInterval":[2119,2178]},null,[],["seq",{"sourceInterval":[2119,2160]},["terminal",{"sourceInterval":[2119,2124]},"\\u"],["app",{"sourceInterval":[2125,2133]},"hexDigit",[]],["app",{"sourceInterval":[2134,2142]},"hexDigit",[]],["app",{"sourceInterval":[2143,2151]},"hexDigit",[]],["app",{"sourceInterval":[2152,2160]},"hexDigit",[]]]],"escapeChar_hexEscape":["define",{"sourceInterval":[2185,2240]},null,[],["seq",{"sourceInterval":[2185,2208]},["terminal",{"sourceInterval":[2185,2190]},"\\x"],["app",{"sourceInterval":[2191,2199]},"hexDigit",[]],["app",{"sourceInterval":[2200,2208]},"hexDigit",[]]]],"escapeChar":["define",{"sourceInterval":[1644,2240]},"an escape sequence",[],["alt",{"sourceInterval":[1683,2240]},["app",{"sourceInterval":[1683,1689]},"escapeChar_backslash",[]],["app",{"sourceInterval":[1745,1751]},"escapeChar_doubleQuote",[]],["app",{"sourceInterval":[1809,1815]},"escapeChar_singleQuote",[]],["app",{"sourceInterval":[1873,1878]},"escapeChar_backspace",[]],["app",{"sourceInterval":[1935,1940]},"escapeChar_lineFeed",[]],["app",{"sourceInterval":[1996,2001]},"escapeChar_carriageReturn",[]],["app",{"sourceInterval":[2063,2068]},"escapeChar_tab",[]],["app",{"sourceInterval":[2119,2160]},"escapeChar_unicodeEscape",[]],["app",{"sourceInterval":[2185,2208]},"escapeChar_hexEscape",[]]]],"space":["extend",{"sourceInterval":[2244,2263]},null,[],["app",{"sourceInterval":[2256,2263]},"comment",[]]],"comment_singleLine":["define",{"sourceInterval":[2281,2327]},null,[],["seq",{"sourceInterval":[2281,2312]},["terminal",{"sourceInterval":[2281,2285]},"//"],["star",{"sourceInterval":[2286,2298]},["seq",{"sourceInterval":[2287,2296]},["not",{"sourceInterval":[2287,2292]},["terminal",{"sourceInterval":[2288,2292]},"\n"]],["app",{"sourceInterval":[2293,2296]},"any",[]]]],["lookahead",{"sourceInterval":[2299,2312]},["alt",{"sourceInterval":[2301,2311]},["terminal",{"sourceInterval":[2301,2305]},"\n"],["app",{"sourceInterval":[2308,2311]},"end",[]]]]]],"comment_multiLine":["define",{"sourceInterval":[2334,2370]},null,[],["seq",{"sourceInterval":[2334,2356]},["terminal",{"sourceInterval":[2334,2338]},"/*"],["star",{"sourceInterval":[2339,2351]},["seq",{"sourceInterval":[2340,2349]},["not",{"sourceInterval":[2340,2345]},["terminal",{"sourceInterval":[2341,2345]},"*/"]],["app",{"sourceInterval":[2346,2349]},"any",[]]]],["terminal",{"sourceInterval":[2352,2356]},"*/"]]],"comment":["define",{"sourceInterval":[2267,2370]},null,[],["alt",{"sourceInterval":[2281,2370]},["app",{"sourceInterval":[2281,2312]},"comment_singleLine",[]],["app",{"sourceInterval":[2334,2356]},"comment_multiLine",[]]]],"tokens":["define",{"sourceInterval":[2374,2389]},null,[],["star",{"sourceInterval":[2383,2389]},["app",{"sourceInterval":[2383,2388]},"token",[]]]],"token":["define",{"sourceInterval":[2393,2469]},null,[],["alt",{"sourceInterval":[2401,2469]},["app",{"sourceInterval":[2401,2409]},"caseName",[]],["app",{"sourceInterval":[2412,2419]},"comment",[]],["app",{"sourceInterval":[2422,2427]},"ident",[]],["app",{"sourceInterval":[2430,2438]},"operator",[]],["app",{"sourceInterval":[2441,2452]},"punctuation",[]],["app",{"sourceInterval":[2455,2463]},"terminal",[]],["app",{"sourceInterval":[2466,2469]},"any",[]]]],"operator":["define",{"sourceInterval":[2473,2538]},null,[],["alt",{"sourceInterval":[2484,2538]},["terminal",{"sourceInterval":[2484,2488]},"<:"],["terminal",{"sourceInterval":[2491,2494]},"="],["terminal",{"sourceInterval":[2497,2501]},":="],["terminal",{"sourceInterval":[2504,2508]},"+="],["terminal",{"sourceInterval":[2511,2514]},"*"],["terminal",{"sourceInterval":[2517,2520]},"+"],["terminal",{"sourceInterval":[2523,2526]},"?"],["terminal",{"sourceInterval":[2529,2532]},"~"],["terminal",{"sourceInterval":[2535,2538]},"&"]]],"punctuation":["define",{"sourceInterval":[2542,2578]},null,[],["alt",{"sourceInterval":[2556,2578]},["terminal",{"sourceInterval":[2556,2559]},"<"],["terminal",{"sourceInterval":[2562,2565]},">"],["terminal",{"sourceInterval":[2568,2571]},","],["terminal",{"sourceInterval":[2574,2578]},"--"]]]}]);


/***/ }),

/***/ "./dist/operations-and-attributes.js":
/*!*******************************************!*\
  !*** ./dist/operations-and-attributes.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ohm = __webpack_require__(/*! .. */ "./src/main.js");
module.exports = ohm.makeRecipe(["grammar",{"source":"OperationsAndAttributes {\n\n  AttributeSignature =\n    name\n\n  OperationSignature =\n    name Formals?\n\n  Formals\n    = \"(\" ListOf<name, \",\"> \")\"\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n}"},"OperationsAndAttributes",null,"AttributeSignature",{"AttributeSignature":["define",{"sourceInterval":[29,58]},null,[],["app",{"sourceInterval":[54,58]},"name",[]]],"OperationSignature":["define",{"sourceInterval":[62,100]},null,[],["seq",{"sourceInterval":[87,100]},["app",{"sourceInterval":[87,91]},"name",[]],["opt",{"sourceInterval":[92,100]},["app",{"sourceInterval":[92,99]},"Formals",[]]]]],"Formals":["define",{"sourceInterval":[104,143]},null,[],["seq",{"sourceInterval":[118,143]},["terminal",{"sourceInterval":[118,121]},"("],["app",{"sourceInterval":[122,139]},"ListOf",[["app",{"sourceInterval":[129,133]},"name",[]],["terminal",{"sourceInterval":[135,138]},","]]],["terminal",{"sourceInterval":[140,143]},")"]]],"name":["define",{"sourceInterval":[147,187]},"a name",[],["seq",{"sourceInterval":[168,187]},["app",{"sourceInterval":[168,177]},"nameFirst",[]],["star",{"sourceInterval":[178,187]},["app",{"sourceInterval":[178,186]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[191,223]},null,[],["alt",{"sourceInterval":[207,223]},["terminal",{"sourceInterval":[207,210]},"_"],["app",{"sourceInterval":[217,223]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[227,257]},null,[],["alt",{"sourceInterval":[242,257]},["terminal",{"sourceInterval":[242,245]},"_"],["app",{"sourceInterval":[252,257]},"alnum",[]]]]}]);


/***/ }),

/***/ "./extras/VisitorFamily.js":
/*!*********************************!*\
  !*** ./extras/VisitorFamily.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const assert = __webpack_require__(/*! ../src/common */ "./src/common.js").assert;
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
    const parts = descriptor.split(/ ?\[\]/);
    if (parts.length === 2) {
        return mapProp.bind(null, parts[0]);
    }
    return getProp.bind(null, descriptor);
}
function getProps(walkFns, thing, fn) {
    return walkFns.map(walkFn => walkFn(thing, fn));
}
function getWalkFn(shape) {
    if (typeof shape === 'string') {
        return getProps.bind(null, [getPropWalkFn(shape)]);
    }
    else if (Array.isArray(shape)) {
        return getProps.bind(null, shape.map(getPropWalkFn));
    }
    else {
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
    const parts = sig.split(/[()]/).map(trim);
    if (parts.length === 3 && parts[2] === '') {
        const name = parts[0];
        let params = [];
        if (parts[1].length > 0) {
            params = parts[1].split(',').map(trim);
        }
        if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
            return { name, formals: params };
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
    this.Adapter = function (thing, family) {
        this._adaptee = thing;
        this._family = family;
    };
    this.Adapter.prototype.valueOf = function () {
        throw new Error('heeey!');
    };
    this.operations = {};
    this._arities = Object.create(null);
    this._getChildren = Object.create(null);
    Object.keys(this._shapes).forEach(k => {
        const shape = this._shapes[k];
        this._getChildren[k] = getWalkFn(shape);
        // A function means the arity isn't fixed, so don't put an entry in the arity map.
        if (typeof shape !== 'function') {
            this._arities[k] = Array.isArray(shape) ? shape.length : 1;
        }
    });
    this._wrap = thing => new this.Adapter(thing, this);
}
VisitorFamily.prototype.wrap = function (thing) {
    return this._wrap(thing);
};
VisitorFamily.prototype._checkActionDict = function (dict) {
    Object.keys(dict).forEach(k => {
        assert(k in this._getChildren, "Unrecognized action name '" + k + "'");
        const action = dict[k];
        assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);
        if (k in this._arities) {
            const expected = this._arities[k];
            const actual = dict[k].length;
            assert(actual === expected, "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual);
        }
    });
};
VisitorFamily.prototype.addOperation = function (signature, actions) {
    const sig = parseSignature(signature);
    const name = sig.name;
    this._checkActionDict(actions);
    this.operations[name] = {
        name,
        formals: sig.formals,
        actions
    };
    const family = this;
    this.Adapter.prototype[name] = function () {
        const tag = family._getTag(this._adaptee);
        assert(tag in family._getChildren, "getTag returned unrecognized tag '" + tag + "'");
        assert(tag in actions, "No action for '" + tag + "' in operation '" + name + "'");
        // Create an "arguments object" from the arguments that were passed to this
        // operation / attribute.
        const args = Object.create(null);
        for (let i = 0; i < arguments.length; i++) {
            args[sig.formals[i]] = arguments[i];
        }
        const oldArgs = this.args;
        this.args = args;
        const ans = actions[tag].apply(this, family._getChildren[tag](this._adaptee, family._wrap));
        this.args = oldArgs;
        return ans;
    };
    return this;
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = VisitorFamily;


/***/ }),

/***/ "./extras/index.js":
/*!*************************!*\
  !*** ./extras/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = {
    VisitorFamily: __webpack_require__(/*! ./VisitorFamily */ "./extras/VisitorFamily.js"),
    semanticsForToAST: __webpack_require__(/*! ./semantics-toAST */ "./extras/semantics-toAST.js").semantics,
    toAST: __webpack_require__(/*! ./semantics-toAST */ "./extras/semantics-toAST.js").helper
};


/***/ }),

/***/ "./extras/semantics-toAST.js":
/*!***********************************!*\
  !*** ./extras/semantics-toAST.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const pexprs = __webpack_require__(/*! ../src/pexprs */ "./src/pexprs.js");
const MatchResult = __webpack_require__(/*! ../src/MatchResult */ "./src/MatchResult.js");
const Grammar = __webpack_require__(/*! ../src/Grammar */ "./src/Grammar.js");
const extend = __webpack_require__(/*! util-extend */ "../node_modules/util-extend/extend.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
const defaultOperation = {
    _terminal() {
        return this.sourceString;
    },
    _nonterminal(children) {
        const ctorName = this._node.ctorName;
        const mapping = this.args.mapping;
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
            const realChildren = children.filter(child => !child.isTerminal());
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
        const propMap = mapping[ctorName] || children;
        const node = {
            type: ctorName
        };
        for (const prop in propMap) {
            const mappedProp = mapping[ctorName] && mapping[ctorName][prop];
            if (typeof mappedProp === 'number') {
                // direct forward
                node[prop] = children[mappedProp].toAST(mapping);
            }
            else if (typeof mappedProp === 'string' ||
                typeof mappedProp === 'boolean' ||
                mappedProp === null) {
                // primitive value
                node[prop] = mappedProp;
            }
            else if (typeof mappedProp === 'object' && mappedProp instanceof Number) {
                // primitive number (must be unboxed)
                node[prop] = Number(mappedProp);
            }
            else if (typeof mappedProp === 'function') {
                // computed value
                node[prop] = mappedProp.call(this, children);
            }
            else if (mappedProp === undefined) {
                if (children[prop] && !children[prop].isTerminal()) {
                    node[prop] = children[prop].toAST(mapping);
                }
                else {
                    // delete predefined 'type' properties, like 'type', if explicitely removed
                    delete node[prop];
                }
            }
        }
        return node;
    },
    _iter(children) {
        if (this._node.isOptional()) {
            if (this.numChildren === 0) {
                return null;
            }
            else {
                return children[0].toAST(this.args.mapping);
            }
        }
        return children.map(function (child) {
            return child.toAST(this.args.mapping);
        }, this);
    },
    NonemptyListOf(first, sep, rest) {
        return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
    },
    EmptyListOf() {
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
    const operation = extend({}, defaultOperation);
    for (const termName in mapping) {
        if (typeof mapping[termName] === 'function') {
            operation[termName] = mapping[termName];
            delete mapping[termName];
        }
    }
    const g = res._cst.grammar;
    const s = g.createSemantics().addOperation('toAST(mapping)', operation);
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


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

module.exports = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}


/***/ }),

/***/ "./src/Builder.js":
/*!************************!*\
  !*** ./src/Builder.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const GrammarDecl = __webpack_require__(/*! ./GrammarDecl */ "./src/GrammarDecl.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function Builder() { }
Builder.prototype = {
    currentDecl: null,
    currentRuleName: null,
    newGrammar(name) {
        return new GrammarDecl(name);
    },
    grammar(metaInfo, name, superGrammar, defaultStartRule, rules) {
        const gDecl = new GrammarDecl(name);
        if (superGrammar) {
            gDecl.withSuperGrammar(this.fromRecipe(superGrammar));
        }
        if (defaultStartRule) {
            gDecl.withDefaultStartRule(defaultStartRule);
        }
        if (metaInfo && metaInfo.source) {
            gDecl.withSource(metaInfo.source);
        }
        this.currentDecl = gDecl;
        Object.keys(rules).forEach(ruleName => {
            this.currentRuleName = ruleName;
            const ruleRecipe = rules[ruleName];
            const action = ruleRecipe[0]; // define/extend/override
            const metaInfo = ruleRecipe[1];
            const description = ruleRecipe[2];
            const formals = ruleRecipe[3];
            const body = this.fromRecipe(ruleRecipe[4]);
            let source;
            if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
                source = gDecl.source.subInterval(metaInfo.sourceInterval[0], metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
            }
            gDecl[action](ruleName, formals, body, description, source);
        });
        this.currentRuleName = this.currentDecl = null;
        return gDecl.build();
    },
    terminal(x) {
        return new pexprs.Terminal(x);
    },
    range(from, to) {
        return new pexprs.Range(from, to);
    },
    param(index) {
        return new pexprs.Param(index);
    },
    alt( /* term1, term2, ... */) {
        let terms = [];
        for (let idx = 0; idx < arguments.length; idx++) {
            let arg = arguments[idx];
            if (!(arg instanceof pexprs.PExpr)) {
                arg = this.fromRecipe(arg);
            }
            if (arg instanceof pexprs.Alt) {
                terms = terms.concat(arg.terms);
            }
            else {
                terms.push(arg);
            }
        }
        return terms.length === 1 ? terms[0] : new pexprs.Alt(terms);
    },
    seq( /* factor1, factor2, ... */) {
        let factors = [];
        for (let idx = 0; idx < arguments.length; idx++) {
            let arg = arguments[idx];
            if (!(arg instanceof pexprs.PExpr)) {
                arg = this.fromRecipe(arg);
            }
            if (arg instanceof pexprs.Seq) {
                factors = factors.concat(arg.factors);
            }
            else {
                factors.push(arg);
            }
        }
        return factors.length === 1 ? factors[0] : new pexprs.Seq(factors);
    },
    star(expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Star(expr);
    },
    plus(expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Plus(expr);
    },
    opt(expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Opt(expr);
    },
    not(expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Not(expr);
    },
    la(expr) {
        // TODO: temporary to still be able to read old recipes
        return this.lookahead(expr);
    },
    lookahead(expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Lookahead(expr);
    },
    lex(expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Lex(expr);
    },
    app(ruleName, optParams) {
        if (optParams && optParams.length > 0) {
            optParams = optParams.map(function (param) {
                return param instanceof pexprs.PExpr ? param : this.fromRecipe(param);
            }, this);
        }
        return new pexprs.Apply(ruleName, optParams);
    },
    // Note that unlike other methods in this class, this method cannot be used as a
    // convenience constructor. It only works with recipes, because it relies on
    // `this.currentDecl` and `this.currentRuleName` being set.
    splice(beforeTerms, afterTerms) {
        return new pexprs.Splice(this.currentDecl.superGrammar, this.currentRuleName, beforeTerms.map(term => this.fromRecipe(term)), afterTerms.map(term => this.fromRecipe(term)));
    },
    fromRecipe(recipe) {
        // the meta-info of 'grammar' is processed in Builder.grammar
        const result = this[recipe[0]].apply(this, recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2));
        const metaInfo = recipe[1];
        if (metaInfo) {
            if (metaInfo.sourceInterval && this.currentDecl) {
                result.withSource(this.currentDecl.sourceInterval.apply(this.currentDecl, metaInfo.sourceInterval));
            }
        }
        return result;
    }
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Builder;


/***/ }),

/***/ "./src/CaseInsensitiveTerminal.js":
/*!****************************************!*\
  !*** ./src/CaseInsensitiveTerminal.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Failure = __webpack_require__(/*! ./Failure */ "./src/Failure.js");
const TerminalNode = __webpack_require__(/*! ./nodes */ "./src/nodes.js").TerminalNode;
const assert = __webpack_require__(/*! ./common */ "./src/common.js").assert;
const { PExpr, Terminal } = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
class CaseInsensitiveTerminal extends PExpr {
    constructor(param) {
        super();
        this.obj = param;
    }
    _getString(state) {
        const terminal = state.currentApplication().args[this.obj.index];
        assert(terminal instanceof Terminal, 'expected a Terminal expression');
        return terminal.obj;
    }
    // Implementation of the PExpr API
    allowsSkippingPrecedingSpace() {
        return true;
    }
    eval(state) {
        const inputStream = state.inputStream;
        const origPos = inputStream.pos;
        const matchStr = this._getString(state);
        if (!inputStream.matchString(matchStr, true)) {
            state.processFailure(origPos, this);
            return false;
        }
        else {
            state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
            return true;
        }
    }
    getArity() {
        return 1;
    }
    substituteParams(actuals) {
        return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
    }
    toDisplayString() {
        return this.obj.toDisplayString() + ' (case-insensitive)';
    }
    toFailure(grammar) {
        return new Failure(this, this.obj.toFailure(grammar) + ' (case-insensitive)', 'description');
    }
    _isNullable(grammar, memo) {
        return this.obj._isNullable(grammar, memo);
    }
}
module.exports = CaseInsensitiveTerminal;


/***/ }),

/***/ "./src/Failure.js":
/*!************************!*\
  !*** ./src/Failure.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
Failure.prototype.getPExpr = function () {
    return this.pexpr;
};
Failure.prototype.getText = function () {
    return this.text;
};
Failure.prototype.getType = function () {
    return this.type;
};
Failure.prototype.isDescription = function () {
    return this.type === 'description';
};
Failure.prototype.isStringTerminal = function () {
    return this.type === 'string';
};
Failure.prototype.isCode = function () {
    return this.type === 'code';
};
Failure.prototype.isFluffy = function () {
    return this.fluffy;
};
Failure.prototype.makeFluffy = function () {
    this.fluffy = true;
};
Failure.prototype.clearFluffy = function () {
    this.fluffy = false;
};
Failure.prototype.subsumes = function (that) {
    return (this.getText() === that.getText() &&
        this.type === that.type &&
        (!this.isFluffy() || (this.isFluffy() && that.isFluffy())));
};
Failure.prototype.toString = function () {
    return this.type === 'string' ? JSON.stringify(this.getText()) : this.getText();
};
Failure.prototype.clone = function () {
    const failure = new Failure(this.pexpr, this.text, this.type);
    if (this.isFluffy()) {
        failure.makeFluffy();
    }
    return failure;
};
Failure.prototype.toKey = function () {
    return this.toString() + '#' + this.type;
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Failure;


/***/ }),

/***/ "./src/Grammar.js":
/*!************************!*\
  !*** ./src/Grammar.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const CaseInsensitiveTerminal = __webpack_require__(/*! ./CaseInsensitiveTerminal */ "./src/CaseInsensitiveTerminal.js");
const Matcher = __webpack_require__(/*! ./Matcher */ "./src/Matcher.js");
const Semantics = __webpack_require__(/*! ./Semantics */ "./src/Semantics.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function getSortedRuleValues(grammar) {
    return Object.keys(grammar.rules)
        .sort()
        .map(name => grammar.rules[name]);
}
function Grammar(name, superGrammar, rules, optDefaultStartRule) {
    this.name = name;
    this.superGrammar = superGrammar;
    this.rules = rules;
    if (optDefaultStartRule) {
        if (!(optDefaultStartRule in rules)) {
            throw new Error("Invalid start rule: '" +
                optDefaultStartRule +
                "' is not a rule in grammar '" +
                name +
                "'");
        }
        this.defaultStartRule = optDefaultStartRule;
    }
}
let ohmGrammar;
let buildGrammar;
// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function (grammar, builderFn) {
    ohmGrammar = grammar;
    buildGrammar = builderFn;
};
Grammar.prototype = {
    matcher() {
        return new Matcher(this);
    },
    // Return true if the grammar is a built-in grammar, otherwise false.
    // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
    isBuiltIn() {
        return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
    },
    equals(g) {
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
        const myRules = getSortedRuleValues(this);
        const otherRules = getSortedRuleValues(g);
        return (myRules.length === otherRules.length &&
            myRules.every((rule, i) => {
                return (rule.description === otherRules[i].description &&
                    rule.formals.join(',') === otherRules[i].formals.join(',') &&
                    rule.body.toString() === otherRules[i].body.toString());
            }));
    },
    match(input, optStartApplication) {
        const m = this.matcher();
        m.replaceInputRange(0, 0, input);
        return m.match(optStartApplication);
    },
    trace(input, optStartApplication) {
        const m = this.matcher();
        m.replaceInputRange(0, 0, input);
        return m.trace(optStartApplication);
    },
    createSemantics() {
        return Semantics.createSemantics(this);
    },
    extendSemantics(superSemantics) {
        return Semantics.createSemantics(this, superSemantics._getSemantics());
    },
    // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
    // a function of the correct arity. If not, throw an exception.
    _checkTopDownActionDict(what, name, actionDict) {
        function isSpecialAction(a) {
            return a === '_iter' || a === '_terminal' || a === '_nonterminal' || a === '_default';
        }
        const problems = [];
        for (const k in actionDict) {
            const v = actionDict[k];
            if (!isSpecialAction(k) && !(k in this.rules)) {
                problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
            }
            else if (typeof v !== 'function') {
                problems.push("'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
            }
            else {
                const actual = v.length;
                const expected = this._topDownActionArity(k);
                if (actual !== expected) {
                    problems.push("Semantic action '" +
                        k +
                        "' has the wrong arity: " +
                        'expected ' +
                        expected +
                        ', got ' +
                        actual);
                }
            }
        }
        if (problems.length > 0) {
            const prettyProblems = problems.map(problem => '- ' + problem);
            const error = new Error("Found errors in the action dictionary of the '" +
                name +
                "' " +
                what +
                ':\n' +
                prettyProblems.join('\n'));
            error.problems = problems;
            throw error;
        }
    },
    // Return the expected arity for a semantic action named `actionName`, which
    // is either a rule name or a special action name like '_nonterminal'.
    _topDownActionArity(actionName) {
        if (actionName === '_iter' || actionName === '_nonterminal' || actionName === '_default') {
            return 1;
        }
        else if (actionName === '_terminal') {
            return 0;
        }
        return this.rules[actionName].body.getArity();
    },
    _inheritsFrom(grammar) {
        let g = this.superGrammar;
        while (g) {
            if (g.equals(grammar, true)) {
                return true;
            }
            g = g.superGrammar;
        }
        return false;
    },
    toRecipe(optVarName) {
        const metaInfo = {};
        // Include the grammar source if it is available.
        if (this.source) {
            metaInfo.source = this.source.contents;
        }
        let superGrammar = null;
        if (this.superGrammar && !this.superGrammar.isBuiltIn()) {
            superGrammar = JSON.parse(this.superGrammar.toRecipe());
        }
        let startRule = null;
        if (this.defaultStartRule) {
            startRule = this.defaultStartRule;
        }
        const rules = {};
        Object.keys(this.rules).forEach(ruleName => {
            const ruleInfo = this.rules[ruleName];
            const body = ruleInfo.body;
            const isDefinition = !this.superGrammar || !this.superGrammar.rules[ruleName];
            let operation;
            if (isDefinition) {
                operation = 'define';
            }
            else {
                operation = body instanceof pexprs.Extend ? 'extend' : 'override';
            }
            const metaInfo = {};
            if (ruleInfo.source && this.source) {
                const adjusted = ruleInfo.source.relativeTo(this.source);
                metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
            }
            const description = isDefinition ? ruleInfo.description : null;
            const bodyRecipe = body.outputRecipe(ruleInfo.formals, this.source);
            rules[ruleName] = [
                operation,
                metaInfo,
                description,
                ruleInfo.formals,
                bodyRecipe
            ];
        });
        return JSON.stringify(['grammar', metaInfo, this.name, superGrammar, startRule, rules]);
    },
    // TODO: Come up with better names for these methods.
    // TODO: Write the analog of these methods for inherited attributes.
    toOperationActionDictionaryTemplate() {
        return this._toOperationOrAttributeActionDictionaryTemplate();
    },
    toAttributeActionDictionaryTemplate() {
        return this._toOperationOrAttributeActionDictionaryTemplate();
    },
    _toOperationOrAttributeActionDictionaryTemplate() {
        // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
        // should appear next to other cases of AddExpr.
        const sb = new common.StringBuffer();
        sb.append('{');
        let first = true;
        for (const ruleName in this.rules) {
            const body = this.rules[ruleName].body;
            if (first) {
                first = false;
            }
            else {
                sb.append(',');
            }
            sb.append('\n');
            sb.append('  ');
            this.addSemanticActionTemplate(ruleName, body, sb);
        }
        sb.append('\n}');
        return sb.contents();
    },
    addSemanticActionTemplate(ruleName, body, sb) {
        sb.append(ruleName);
        sb.append(': function(');
        const arity = this._topDownActionArity(ruleName);
        sb.append(common.repeat('_', arity).join(', '));
        sb.append(') {\n');
        sb.append('  }');
    },
    // Parse a string which expresses a rule application in this grammar, and return the
    // resulting Apply node.
    parseApplication(str) {
        let app;
        if (str.indexOf('<') === -1) {
            // simple application
            app = new pexprs.Apply(str);
        }
        else {
            // parameterized application
            const cst = ohmGrammar.match(str, 'Base_application');
            app = buildGrammar(cst, {});
        }
        // Ensure that the application is valid.
        if (!(app.ruleName in this.rules)) {
            throw errors.undeclaredRule(app.ruleName, this.name);
        }
        const formals = this.rules[app.ruleName].formals;
        if (formals.length !== app.args.length) {
            const source = this.rules[app.ruleName].source;
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
Grammar.ProtoBuiltInRules = new Grammar('ProtoBuiltInRules', // name
undefined, // supergrammar
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
    // Union of Lt (titlecase), Lm (modifier), and Lo (other), i.e. any letter not in Ll or Lu.
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
});
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Grammar;


/***/ }),

/***/ "./src/GrammarDecl.js":
/*!****************************!*\
  !*** ./src/GrammarDecl.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Grammar = __webpack_require__(/*! ./Grammar */ "./src/Grammar.js");
const InputStream = __webpack_require__(/*! ./InputStream */ "./src/InputStream.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------
// Constructors
function GrammarDecl(name) {
    this.name = name;
}
// Helpers
GrammarDecl.prototype.sourceInterval = function (startIdx, endIdx) {
    return this.source.subInterval(startIdx, endIdx - startIdx);
};
GrammarDecl.prototype.ensureSuperGrammar = function () {
    if (!this.superGrammar) {
        this.withSuperGrammar(
        // TODO: The conditional expression below is an ugly hack. It's kind of ok because
        // I doubt anyone will ever try to declare a grammar called `BuiltInRules`. Still,
        // we should try to find a better way to do this.
        this.name === 'BuiltInRules' ? Grammar.ProtoBuiltInRules : Grammar.BuiltInRules);
    }
    return this.superGrammar;
};
GrammarDecl.prototype.ensureSuperGrammarRuleForOverriding = function (name, source) {
    const ruleInfo = this.ensureSuperGrammar().rules[name];
    if (!ruleInfo) {
        throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
    }
    return ruleInfo;
};
GrammarDecl.prototype.installOverriddenOrExtendedRule = function (name, formals, body, source) {
    const duplicateParameterNames = common.getDuplicates(formals);
    if (duplicateParameterNames.length > 0) {
        throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
    }
    const ruleInfo = this.ensureSuperGrammar().rules[name];
    const expectedFormals = ruleInfo.formals;
    const expectedNumFormals = expectedFormals ? expectedFormals.length : 0;
    if (formals.length !== expectedNumFormals) {
        throw errors.wrongNumberOfParameters(name, expectedNumFormals, formals.length, source);
    }
    return this.install(name, formals, body, ruleInfo.description, source);
};
GrammarDecl.prototype.install = function (name, formals, body, description, source) {
    this.rules[name] = {
        body: body.introduceParams(formals),
        formals,
        description,
        source
    };
    return this;
};
// Stuff that you should only do once
GrammarDecl.prototype.withSuperGrammar = function (superGrammar) {
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
GrammarDecl.prototype.withDefaultStartRule = function (ruleName) {
    this.defaultStartRule = ruleName;
    return this;
};
GrammarDecl.prototype.withSource = function (source) {
    this.source = new InputStream(source).interval(0, source.length);
    return this;
};
// Creates a Grammar instance, and if it passes the sanity checks, returns it.
GrammarDecl.prototype.build = function () {
    const grammar = new Grammar(this.name, this.ensureSuperGrammar(), this.rules, this.defaultStartRule);
    // TODO: change the pexpr.prototype.assert... methods to make them add
    // exceptions to an array that's provided as an arg. Then we'll be able to
    // show more than one error of the same type at a time.
    // TODO: include the offending pexpr in the errors, that way we can show
    // the part of the source that caused it.
    const grammarErrors = [];
    let grammarHasInvalidApplications = false;
    Object.keys(grammar.rules).forEach(ruleName => {
        const body = grammar.rules[ruleName].body;
        try {
            body.assertChoicesHaveUniformArity(ruleName);
        }
        catch (e) {
            grammarErrors.push(e);
        }
        try {
            body.assertAllApplicationsAreValid(ruleName, grammar);
        }
        catch (e) {
            grammarErrors.push(e);
            grammarHasInvalidApplications = true;
        }
    });
    if (!grammarHasInvalidApplications) {
        // The following check can only be done if the grammar has no invalid applications.
        Object.keys(grammar.rules).forEach(ruleName => {
            const body = grammar.rules[ruleName].body;
            try {
                body.assertIteratedExprsAreNotNullable(grammar, []);
            }
            catch (e) {
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
GrammarDecl.prototype.define = function (name, formals, body, description, source) {
    this.ensureSuperGrammar();
    if (this.superGrammar.rules[name]) {
        throw errors.duplicateRuleDeclaration(name, this.name, this.superGrammar.name, source);
    }
    else if (this.rules[name]) {
        throw errors.duplicateRuleDeclaration(name, this.name, this.name, source);
    }
    const duplicateParameterNames = common.getDuplicates(formals);
    if (duplicateParameterNames.length > 0) {
        throw errors.duplicateParameterNames(name, duplicateParameterNames, source);
    }
    return this.install(name, formals, body, description, source);
};
GrammarDecl.prototype.override = function (name, formals, body, descIgnored, source) {
    this.ensureSuperGrammarRuleForOverriding(name, source);
    this.installOverriddenOrExtendedRule(name, formals, body, source);
    return this;
};
GrammarDecl.prototype.extend = function (name, formals, fragment, descIgnored, source) {
    const ruleInfo = this.ensureSuperGrammar().rules[name];
    if (!ruleInfo) {
        throw errors.cannotExtendUndeclaredRule(name, this.superGrammar.name, source);
    }
    const body = new pexprs.Extend(this.superGrammar, name, fragment);
    body.source = fragment.source;
    this.installOverriddenOrExtendedRule(name, formals, body, source);
    return this;
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = GrammarDecl;


/***/ }),

/***/ "./src/InputStream.js":
/*!****************************!*\
  !*** ./src/InputStream.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Interval = __webpack_require__(/*! ./Interval */ "./src/Interval.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function InputStream(source) {
    this.source = source;
    this.pos = 0;
    this.examinedLength = 0;
}
InputStream.prototype = {
    atEnd() {
        const ans = this.pos === this.source.length;
        this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
        return ans;
    },
    next() {
        const ans = this.source[this.pos++];
        this.examinedLength = Math.max(this.examinedLength, this.pos);
        return ans;
    },
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
    },
    sourceSlice(startIdx, endIdx) {
        return this.source.slice(startIdx, endIdx);
    },
    interval(startIdx, optEndIdx) {
        return new Interval(this.source, startIdx, optEndIdx ? optEndIdx : this.pos);
    }
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = InputStream;


/***/ }),

/***/ "./src/Interval.js":
/*!*************************!*\
  !*** ./src/Interval.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const assert = __webpack_require__(/*! ./common */ "./src/common.js").assert;
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const util = __webpack_require__(/*! ./util */ "./src/util.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function Interval(sourceString, startIdx, endIdx) {
    this.sourceString = sourceString;
    this.startIdx = startIdx;
    this.endIdx = endIdx;
}
Interval.coverage = function ( /* interval1, interval2, ... */) {
    const sourceString = arguments[0].sourceString;
    let startIdx = arguments[0].startIdx;
    let endIdx = arguments[0].endIdx;
    for (let idx = 1; idx < arguments.length; idx++) {
        const interval = arguments[idx];
        if (interval.sourceString !== sourceString) {
            throw errors.intervalSourcesDontMatch();
        }
        else {
            startIdx = Math.min(startIdx, arguments[idx].startIdx);
            endIdx = Math.max(endIdx, arguments[idx].endIdx);
        }
    }
    return new Interval(sourceString, startIdx, endIdx);
};
Interval.prototype = {
    coverageWith( /* interval1, interval2, ... */) {
        const intervals = Array.prototype.slice.call(arguments);
        intervals.push(this);
        return Interval.coverage.apply(undefined, intervals);
    },
    collapsedLeft() {
        return new Interval(this.sourceString, this.startIdx, this.startIdx);
    },
    collapsedRight() {
        return new Interval(this.sourceString, this.endIdx, this.endIdx);
    },
    getLineAndColumn() {
        return util.getLineAndColumn(this.sourceString, this.startIdx);
    },
    getLineAndColumnMessage() {
        const range = [this.startIdx, this.endIdx];
        return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
    },
    // Returns an array of 0, 1, or 2 intervals that represents the result of the
    // interval difference operation.
    minus(that) {
        if (this.sourceString !== that.sourceString) {
            throw errors.intervalSourcesDontMatch();
        }
        else if (this.startIdx === that.startIdx && this.endIdx === that.endIdx) {
            // `this` and `that` are the same interval!
            return [];
        }
        else if (this.startIdx < that.startIdx && that.endIdx < this.endIdx) {
            // `that` splits `this` into two intervals
            return [
                new Interval(this.sourceString, this.startIdx, that.startIdx),
                new Interval(this.sourceString, that.endIdx, this.endIdx)
            ];
        }
        else if (this.startIdx < that.endIdx && that.endIdx < this.endIdx) {
            // `that` contains a prefix of `this`
            return [new Interval(this.sourceString, that.endIdx, this.endIdx)];
        }
        else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
            // `that` contains a suffix of `this`
            return [new Interval(this.sourceString, this.startIdx, that.startIdx)];
        }
        else {
            // `that` and `this` do not overlap
            return [this];
        }
    },
    // Returns a new Interval that has the same extent as this one, but which is relative
    // to `that`, an Interval that fully covers this one.
    relativeTo(that) {
        if (this.sourceString !== that.sourceString) {
            throw errors.intervalSourcesDontMatch();
        }
        assert(this.startIdx >= that.startIdx && this.endIdx <= that.endIdx, 'other interval does not cover this one');
        return new Interval(this.sourceString, this.startIdx - that.startIdx, this.endIdx - that.startIdx);
    },
    // Returns a new Interval which contains the same contents as this one,
    // but with whitespace trimmed from both ends. (This only makes sense when
    // the input stream is a string.)
    trimmed() {
        const contents = this.contents;
        const startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
        const endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
        return new Interval(this.sourceString, startIdx, endIdx);
    },
    subInterval(offset, len) {
        const newStartIdx = this.startIdx + offset;
        return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
    }
};
Object.defineProperties(Interval.prototype, {
    contents: {
        get() {
            if (this._contents === undefined) {
                this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
            }
            return this._contents;
        },
        enumerable: true
    },
    length: {
        get() {
            return this.endIdx - this.startIdx;
        },
        enumerable: true
    }
});
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Interval;


/***/ }),

/***/ "./src/MatchResult.js":
/*!****************************!*\
  !*** ./src/MatchResult.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const util = __webpack_require__(/*! ./util */ "./src/util.js");
const Interval = __webpack_require__(/*! ./Interval */ "./src/Interval.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function MatchResult(matcher, input, startExpr, cst, cstOffset, rightmostFailurePosition, optRecordedFailures) {
    this.matcher = matcher;
    this.input = input;
    this.startExpr = startExpr;
    this._cst = cst;
    this._cstOffset = cstOffset;
    this._rightmostFailurePosition = rightmostFailurePosition;
    this._rightmostFailures = optRecordedFailures;
    if (this.failed()) {
        common.defineLazyProperty(this, 'message', function () {
            const detail = 'Expected ' + this.getExpectedText();
            return (util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail);
        });
        common.defineLazyProperty(this, 'shortMessage', function () {
            const detail = 'expected ' + this.getExpectedText();
            const errorInfo = util.getLineAndColumn(this.input, this.getRightmostFailurePosition());
            return 'Line ' + errorInfo.lineNum + ', col ' + errorInfo.colNum + ': ' + detail;
        });
    }
}
MatchResult.prototype.succeeded = function () {
    return !!this._cst;
};
MatchResult.prototype.failed = function () {
    return !this.succeeded();
};
MatchResult.prototype.getRightmostFailurePosition = function () {
    return this._rightmostFailurePosition;
};
MatchResult.prototype.getRightmostFailures = function () {
    if (!this._rightmostFailures) {
        this.matcher.setInput(this.input);
        const matchResultWithFailures = this.matcher._match(this.startExpr, false, this.getRightmostFailurePosition());
        this._rightmostFailures = matchResultWithFailures.getRightmostFailures();
    }
    return this._rightmostFailures;
};
MatchResult.prototype.toString = function () {
    return this.succeeded()
        ? '[match succeeded]'
        : '[match failed at position ' + this.getRightmostFailurePosition() + ']';
};
// Return a string summarizing the expected contents of the input stream when
// the match failure occurred.
MatchResult.prototype.getExpectedText = function () {
    if (this.succeeded()) {
        throw new Error('cannot get expected text of a successful MatchResult');
    }
    const sb = new common.StringBuffer();
    let failures = this.getRightmostFailures();
    // Filter out the fluffy failures to make the default error messages more useful
    failures = failures.filter(failure => !failure.isFluffy());
    for (let idx = 0; idx < failures.length; idx++) {
        if (idx > 0) {
            if (idx === failures.length - 1) {
                sb.append(failures.length > 2 ? ', or ' : ' or ');
            }
            else {
                sb.append(', ');
            }
        }
        sb.append(failures[idx].toString());
    }
    return sb.contents();
};
MatchResult.prototype.getInterval = function () {
    const pos = this.getRightmostFailurePosition();
    return new Interval(this.input, pos, pos);
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = MatchResult;


/***/ }),

/***/ "./src/MatchState.js":
/*!***************************!*\
  !*** ./src/MatchState.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const InputStream = __webpack_require__(/*! ./InputStream */ "./src/InputStream.js");
const MatchResult = __webpack_require__(/*! ./MatchResult */ "./src/MatchResult.js");
const PosInfo = __webpack_require__(/*! ./PosInfo */ "./src/PosInfo.js");
const Trace = __webpack_require__(/*! ./Trace */ "./src/Trace.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
const applySpaces = new pexprs.Apply('spaces');
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
    posToOffset(pos) {
        return pos - this._posStack[this._posStack.length - 1];
    },
    enterApplication(posInfo, app) {
        this._posStack.push(this.inputStream.pos);
        this._applicationStack.push(app);
        this.inLexifiedContextStack.push(false);
        posInfo.enter(app);
        this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
        this.rightmostFailurePosition = -1;
    },
    exitApplication(posInfo, optNode) {
        const origPos = this._posStack.pop();
        this._applicationStack.pop();
        this.inLexifiedContextStack.pop();
        posInfo.exit();
        this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, this._rightmostFailurePositionStack.pop());
        if (optNode) {
            this.pushBinding(optNode, origPos);
        }
    },
    enterLexifiedContext() {
        this.inLexifiedContextStack.push(true);
    },
    exitLexifiedContext() {
        this.inLexifiedContextStack.pop();
    },
    currentApplication() {
        return this._applicationStack[this._applicationStack.length - 1];
    },
    inSyntacticContext() {
        if (typeof this.inputStream.source !== 'string') {
            return false;
        }
        const currentApplication = this.currentApplication();
        if (currentApplication) {
            return currentApplication.isSyntactic() && !this.inLexifiedContext();
        }
        else {
            // The top-level context is syntactic if the start application is.
            return this.startExpr.factors[0].isSyntactic();
        }
    },
    inLexifiedContext() {
        return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
    },
    skipSpaces() {
        this.pushFailuresInfo();
        this.eval(applySpaces);
        this.popBinding();
        this.popFailuresInfo();
        return this.inputStream.pos;
    },
    skipSpacesIfInSyntacticContext() {
        return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
    },
    maybeSkipSpacesBefore(expr) {
        if (expr instanceof pexprs.Apply && expr.isSyntactic()) {
            return this.skipSpaces();
        }
        else if (expr.allowsSkippingPrecedingSpace() && expr !== applySpaces) {
            return this.skipSpacesIfInSyntacticContext();
        }
        else {
            return this.inputStream.pos;
        }
    },
    pushBinding(node, origPos) {
        this._bindings.push(node);
        this._bindingOffsets.push(this.posToOffset(origPos));
    },
    popBinding() {
        this._bindings.pop();
        this._bindingOffsets.pop();
    },
    numBindings() {
        return this._bindings.length;
    },
    truncateBindings(newLength) {
        // Yes, this is this really faster than setting the `length` property (tested with
        // bin/es5bench on Node v6.1.0).
        while (this._bindings.length > newLength) {
            this.popBinding();
        }
    },
    getCurrentPosInfo() {
        return this.getPosInfo(this.inputStream.pos);
    },
    getPosInfo(pos) {
        let posInfo = this.memoTable[pos];
        if (!posInfo) {
            posInfo = this.memoTable[pos] = new PosInfo();
        }
        return posInfo;
    },
    processFailure(pos, expr) {
        this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);
        if (this.recordedFailures && pos === this.positionToRecordFailures) {
            const app = this.currentApplication();
            if (app) {
                // Substitute parameters with the actual pexprs that were passed to
                // the current rule.
                expr = expr.substituteParams(app.args);
            }
            else {
                // This branch is only reached for the "end-check" that is
                // performed after the top-level application. In that case,
                // expr === pexprs.end so there is no need to substitute
                // parameters.
            }
            this.recordFailure(expr.toFailure(this.grammar), false);
        }
    },
    recordFailure(failure, shouldCloneIfNew) {
        const key = failure.toKey();
        if (!this.recordedFailures[key]) {
            this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
        }
        else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
            this.recordedFailures[key].clearFluffy();
        }
    },
    recordFailures(failures, shouldCloneIfNew) {
        Object.keys(failures).forEach(key => {
            this.recordFailure(failures[key], shouldCloneIfNew);
        });
    },
    cloneRecordedFailures() {
        if (!this.recordedFailures) {
            return undefined;
        }
        const ans = Object.create(null);
        Object.keys(this.recordedFailures).forEach(key => {
            ans[key] = this.recordedFailures[key].clone();
        });
        return ans;
    },
    getRightmostFailurePosition() {
        return this.rightmostFailurePosition;
    },
    _getRightmostFailureOffset() {
        return this.rightmostFailurePosition >= 0
            ? this.posToOffset(this.rightmostFailurePosition)
            : -1;
    },
    // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
    getMemoizedTraceEntry(pos, expr) {
        const posInfo = this.memoTable[pos];
        if (posInfo && expr.ruleName) {
            const memoRec = posInfo.memo[expr.toMemoKey()];
            if (memoRec && memoRec.traceEntry) {
                const entry = memoRec.traceEntry.cloneWithExpr(expr);
                entry.isMemoized = true;
                return entry;
            }
        }
        return null;
    },
    // Returns a new trace entry, with the currently active trace array as its children.
    getTraceEntry(pos, expr, succeeded, bindings) {
        if (expr instanceof pexprs.Apply) {
            const app = this.currentApplication();
            const actuals = app ? app.args : [];
            expr = expr.substituteParams(actuals);
        }
        return (this.getMemoizedTraceEntry(pos, expr) ||
            new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace));
    },
    isTracing() {
        return !!this.trace;
    },
    hasNecessaryInfo(memoRec) {
        if (this.trace && !memoRec.traceEntry) {
            return false;
        }
        if (this.recordedFailures &&
            this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
            return !!memoRec.failuresAtRightmostPosition;
        }
        return true;
    },
    useMemoizedResult(origPos, memoRec) {
        if (this.trace) {
            this.trace.push(memoRec.traceEntry);
        }
        const memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
        this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, memoRecRightmostFailurePosition);
        if (this.recordedFailures &&
            this.positionToRecordFailures === memoRecRightmostFailurePosition &&
            memoRec.failuresAtRightmostPosition) {
            this.recordFailures(memoRec.failuresAtRightmostPosition, true);
        }
        this.inputStream.examinedLength = Math.max(this.inputStream.examinedLength, memoRec.examinedLength + origPos);
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
    eval(expr) {
        const inputStream = this.inputStream;
        const origNumBindings = this._bindings.length;
        let origRecordedFailures;
        if (this.recordedFailures) {
            origRecordedFailures = this.recordedFailures;
            this.recordedFailures = Object.create(null);
        }
        const origPos = inputStream.pos;
        const memoPos = this.maybeSkipSpacesBefore(expr);
        let origTrace;
        if (this.trace) {
            origTrace = this.trace;
            this.trace = [];
        }
        // Do the actual evaluation.
        const ans = expr.eval(this);
        if (this.trace) {
            const bindings = this._bindings.slice(origNumBindings);
            const traceEntry = this.getTraceEntry(memoPos, expr, ans, bindings);
            traceEntry.isImplicitSpaces = expr === applySpaces;
            traceEntry.isRootNode = expr === this.startExpr;
            origTrace.push(traceEntry);
            this.trace = origTrace;
        }
        if (ans) {
            if (this.recordedFailures && inputStream.pos === this.positionToRecordFailures) {
                Object.keys(this.recordedFailures).forEach(key => {
                    this.recordedFailures[key].makeFluffy();
                });
            }
        }
        else {
            // Reset the position and the bindings.
            inputStream.pos = origPos;
            this.truncateBindings(origNumBindings);
        }
        if (this.recordedFailures) {
            this.recordFailures(origRecordedFailures, false);
        }
        return ans;
    },
    getMatchResult() {
        this.eval(this.startExpr);
        let rightmostFailures;
        if (this.recordedFailures) {
            rightmostFailures = Object.keys(this.recordedFailures).map(key => this.recordedFailures[key]);
        }
        return new MatchResult(this.matcher, this.input, this.startExpr, this._bindings[0], this._bindingOffsets[0], this.rightmostFailurePosition, rightmostFailures);
    },
    getTrace() {
        this.trace = [];
        const matchResult = this.getMatchResult();
        // The trace node for the start rule is always the last entry. If it is a syntactic rule,
        // the first entry is for an application of 'spaces'.
        // TODO(pdubroy): Clean this up by introducing a special `Match<startAppl>` rule, which will
        // ensure that there is always a single root trace node.
        const rootTrace = this.trace[this.trace.length - 1];
        rootTrace.result = matchResult;
        return rootTrace;
    },
    pushFailuresInfo() {
        this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
        this._recordedFailuresStack.push(this.recordedFailures);
    },
    popFailuresInfo() {
        this.rightmostFailurePosition = this._rightmostFailurePositionStack.pop();
        this.recordedFailures = this._recordedFailuresStack.pop();
    }
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = MatchState;


/***/ }),

/***/ "./src/Matcher.js":
/*!************************!*\
  !*** ./src/Matcher.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const MatchState = __webpack_require__(/*! ./MatchState */ "./src/MatchState.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function Matcher(grammar) {
    this.grammar = grammar;
    this.memoTable = [];
    this.input = '';
}
Matcher.prototype.getInput = function () {
    return this.input;
};
Matcher.prototype.setInput = function (str) {
    if (this.input !== str) {
        this.replaceInputRange(0, this.input.length, str);
    }
    return this;
};
Matcher.prototype.replaceInputRange = function (startIdx, endIdx, str) {
    const currentInput = this.input;
    if (startIdx < 0 ||
        startIdx > currentInput.length ||
        endIdx < 0 ||
        endIdx > currentInput.length ||
        startIdx > endIdx) {
        throw new Error('Invalid indices: ' + startIdx + ' and ' + endIdx);
    }
    // update input
    this.input = currentInput.slice(0, startIdx) + str + currentInput.slice(endIdx);
    // update memo table (similar to the above)
    const restOfMemoTable = this.memoTable.slice(endIdx);
    this.memoTable.length = startIdx;
    for (let idx = 0; idx < str.length; idx++) {
        this.memoTable.push(undefined);
    }
    restOfMemoTable.forEach(function (posInfo) {
        this.memoTable.push(posInfo);
    }, this);
    // Invalidate memoRecs
    for (let pos = 0; pos < startIdx; pos++) {
        const posInfo = this.memoTable[pos];
        if (posInfo) {
            posInfo.clearObsoleteEntries(pos, startIdx);
        }
    }
    return this;
};
Matcher.prototype.match = function (optStartApplicationStr) {
    return this._match(this._getStartExpr(optStartApplicationStr), false);
};
Matcher.prototype.trace = function (optStartApplicationStr) {
    return this._match(this._getStartExpr(optStartApplicationStr), true);
};
Matcher.prototype._match = function (startExpr, tracing, optPositionToRecordFailures) {
    const state = new MatchState(this, startExpr, optPositionToRecordFailures);
    return tracing ? state.getTrace() : state.getMatchResult();
};
/*
  Returns the starting expression for this Matcher's associated grammar. If `optStartApplicationStr`
  is specified, it is a string expressing a rule application in the grammar. If not specified, the
  grammar's default start rule will be used.
*/
Matcher.prototype._getStartExpr = function (optStartApplicationStr) {
    const applicationStr = optStartApplicationStr || this.grammar.defaultStartRule;
    if (!applicationStr) {
        throw new Error('Missing start rule argument -- the grammar has no default start rule.');
    }
    const startApp = this.grammar.parseApplication(applicationStr);
    return new pexprs.Seq([startApp, pexprs.end]);
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Matcher;


/***/ }),

/***/ "./src/Namespace.js":
/*!**************************!*\
  !*** ./src/Namespace.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const extend = __webpack_require__(/*! util-extend */ "../node_modules/util-extend/extend.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function Namespace() { }
Namespace.prototype = Object.create(null);
Namespace.asNamespace = function (objOrNamespace) {
    if (objOrNamespace instanceof Namespace) {
        return objOrNamespace;
    }
    return Namespace.createNamespace(objOrNamespace);
};
// Create a new namespace. If `optProps` is specified, all of its properties
// will be copied to the new namespace.
Namespace.createNamespace = function (optProps) {
    return Namespace.extend(Namespace.prototype, optProps);
};
// Create a new namespace which extends another namespace. If `optProps` is
// specified, all of its properties will be copied to the new namespace.
Namespace.extend = function (namespace, optProps) {
    if (namespace !== Namespace.prototype && !(namespace instanceof Namespace)) {
        throw new TypeError('not a Namespace object: ' + namespace);
    }
    const ns = Object.create(namespace, {
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
Namespace.toString = function (ns) {
    return Object.prototype.toString.call(ns);
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Namespace;


/***/ }),

/***/ "./src/PosInfo.js":
/*!************************!*\
  !*** ./src/PosInfo.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function PosInfo() {
    this.applicationMemoKeyStack = []; // active applications at this position
    this.memo = {};
    this.maxExaminedLength = 0;
    this.maxRightmostFailureOffset = -1;
    this.currentLeftRecursion = undefined;
}
PosInfo.prototype = {
    isActive(application) {
        return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
    },
    enter(application) {
        this.applicationMemoKeyStack.push(application.toMemoKey());
    },
    exit() {
        this.applicationMemoKeyStack.pop();
    },
    startLeftRecursion(headApplication, memoRec) {
        memoRec.isLeftRecursion = true;
        memoRec.headApplication = headApplication;
        memoRec.nextLeftRecursion = this.currentLeftRecursion;
        this.currentLeftRecursion = memoRec;
        const applicationMemoKeyStack = this.applicationMemoKeyStack;
        const indexOfFirstInvolvedRule = applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
        const involvedApplicationMemoKeys = applicationMemoKeyStack.slice(indexOfFirstInvolvedRule);
        memoRec.isInvolved = function (applicationMemoKey) {
            return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
        };
        memoRec.updateInvolvedApplicationMemoKeys = function () {
            for (let idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
                const applicationMemoKey = applicationMemoKeyStack[idx];
                if (!this.isInvolved(applicationMemoKey)) {
                    involvedApplicationMemoKeys.push(applicationMemoKey);
                }
            }
        };
    },
    endLeftRecursion() {
        this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
    },
    // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
    // the memoized result (which starts out being a failure) is always used.
    shouldUseMemoizedResult(memoRec) {
        if (!memoRec.isLeftRecursion) {
            return true;
        }
        const applicationMemoKeyStack = this.applicationMemoKeyStack;
        for (let idx = 0; idx < applicationMemoKeyStack.length; idx++) {
            const applicationMemoKey = applicationMemoKeyStack[idx];
            if (memoRec.isInvolved(applicationMemoKey)) {
                return false;
            }
        }
        return true;
    },
    memoize(memoKey, memoRec) {
        this.memo[memoKey] = memoRec;
        this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
        this.maxRightmostFailureOffset = Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
        return memoRec;
    },
    clearObsoleteEntries(pos, invalidatedIdx) {
        if (pos + this.maxExaminedLength <= invalidatedIdx) {
            // Optimization: none of the rule applications that were memoized here examined the
            // interval of the input that changed, so nothing has to be invalidated.
            return;
        }
        const memo = this.memo;
        this.maxExaminedLength = 0;
        this.maxRightmostFailureOffset = -1;
        Object.keys(memo).forEach(k => {
            const memoRec = memo[k];
            if (pos + memoRec.examinedLength > invalidatedIdx) {
                delete memo[k];
            }
            else {
                this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
                this.maxRightmostFailureOffset = Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
            }
        });
    }
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = PosInfo;


/***/ }),

/***/ "./src/Semantics.js":
/*!**************************!*\
  !*** ./src/Semantics.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const InputStream = __webpack_require__(/*! ./InputStream */ "./src/InputStream.js");
const IterationNode = __webpack_require__(/*! ./nodes */ "./src/nodes.js").IterationNode;
const MatchResult = __webpack_require__(/*! ./MatchResult */ "./src/MatchResult.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const util = __webpack_require__(/*! ./util */ "./src/util.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
const globalActionStack = [];
let prototypeGrammar;
let prototypeGrammarSemantics;
// JSON is not a valid subset of JavaScript because there are two possible line terminators,
// U+2028 (line separator) and U+2029 (paragraph separator) that are allowed in JSON strings
// but not in JavaScript strings.
// jsonToJS() properly encodes those two characters in JSON so that it can seamlessly be
// inserted into JavaScript code (plus the encoded version is still valid JSON)
function jsonToJS(str) {
    const output = str.replace(/[\u2028\u2029]/g, (char, pos, str) => {
        const hex = char.codePointAt(0).toString(16);
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
class Wrapper {
    constructor(node, sourceInterval, baseInterval) {
        this._node = node;
        this.source = sourceInterval;
        // The interval that the childOffsets of `node` are relative to. It should be the source
        // of the closest Nonterminal node.
        this._baseInterval = baseInterval;
        if (node.isNonterminal()) {
            common.assert(sourceInterval === baseInterval);
        }
        this._childWrappers = [];
    }
    toString() {
        return '[semantics wrapper for ' + this._node.grammar.name + ']';
    }
    // This is used by ohm editor to display a node wrapper appropriately.
    toJSON() {
        return this.toString();
    }
    _forgetMemoizedResultFor(attributeName) {
        // Remove the memoized attribute from the cstNode and all its children.
        delete this._node[this._semantics.attributeKeys[attributeName]];
        this.children.forEach(child => {
            child._forgetMemoizedResultFor(attributeName);
        });
    }
    // Returns the wrapper of the specified child node. Child wrappers are created lazily and
    // cached in the parent wrapper's `_childWrappers` instance variable.
    child(idx) {
        if (!(0 <= idx && idx < this._node.numChildren())) {
            // TODO: Consider throwing an exception here.
            return undefined;
        }
        let childWrapper = this._childWrappers[idx];
        if (!childWrapper) {
            const childNode = this._node.childAt(idx);
            const offset = this._node.childOffsets[idx];
            const source = this._baseInterval.subInterval(offset, childNode.matchLength);
            const base = childNode.isNonterminal() ? source : this._baseInterval;
            childWrapper = this._childWrappers[idx] = this._semantics.wrap(childNode, source, base);
        }
        return childWrapper;
    }
    // Returns an array containing the wrappers of all of the children of the node associated
    // with this wrapper.
    _children() {
        // Force the creation of all child wrappers
        for (let idx = 0; idx < this._node.numChildren(); idx++) {
            this.child(idx);
        }
        return this._childWrappers;
    }
    // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
    // expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
    isIteration() {
        return this._node.isIteration();
    }
    // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
    // otherwise.
    isTerminal() {
        return this._node.isTerminal();
    }
    // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
    // otherwise.
    isNonterminal() {
        return this._node.isNonterminal();
    }
    // Returns `true` if the CST node associated with this wrapper is a nonterminal node
    // corresponding to a syntactic rule, `false` otherwise.
    isSyntactic() {
        return this.isNonterminal() && this._node.isSyntactic();
    }
    // Returns `true` if the CST node associated with this wrapper is a nonterminal node
    // corresponding to a lexical rule, `false` otherwise.
    isLexical() {
        return this.isNonterminal() && this._node.isLexical();
    }
    // Returns `true` if the CST node associated with this wrapper is an iterator node
    // having either one or no child (? operator), `false` otherwise.
    // Otherwise, throws an exception.
    isOptional() {
        return this._node.isOptional();
    }
    // Create a new _iter wrapper in the same semantics as this wrapper.
    iteration(optChildWrappers) {
        const childWrappers = optChildWrappers || [];
        const childNodes = childWrappers.map(c => c._node);
        const iter = new IterationNode(this._node.grammar, childNodes, [], -1, false);
        const wrapper = this._semantics.wrap(iter, null, null);
        wrapper._childWrappers = childWrappers;
        return wrapper;
    }
    // Returns an array containing the children of this CST node.
    get children() {
        return this._children();
    }
    // Returns the name of grammar rule that created this CST node.
    get ctorName() {
        return this._node.ctorName;
    }
    // TODO: Remove this eventually (deprecated in v0.12).
    get interval() {
        throw new Error('The `interval` property is deprecated -- use `source` instead');
    }
    // Returns the number of children of this CST node.
    get numChildren() {
        return this._node.numChildren();
    }
    // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
    // throws an exception.
    // DEPRECATED: Use `sourceString` instead.
    get primitiveValue() {
        if (this.isTerminal()) {
            return this._node.primitiveValue;
        }
        throw new TypeError("tried to access the 'primitiveValue' attribute of a non-terminal CST node");
    }
    // Returns the contents of the input stream consumed by this CST node.
    get sourceString() {
        return this.source.contents;
    }
}
// ----------------- Semantics -----------------
// A Semantics is a container for a family of Operations and Attributes for a given grammar.
// Semantics enable modularity (different clients of a grammar can create their set of operations
// and attributes in isolation) and extensibility even when operations and attributes are mutually-
// recursive. This constructor should not be called directly except from
// `Semantics.createSemantics`. The normal ways to create a Semantics, given a grammar 'g', are
// `g.createSemantics()` and `g.extendSemantics(parentSemantics)`.
function Semantics(grammar, superSemantics) {
    const self = this;
    this.grammar = grammar;
    this.checkedActionDicts = false;
    // Constructor for wrapper instances, which are passed as the arguments to the semantic actions
    // of an operation or attribute. Operations and attributes require double dispatch: the semantic
    // action is chosen based on both the node's type and the semantics. Wrappers ensure that
    // the `execute` method is called with the correct (most specific) semantics object as an
    // argument.
    this.Wrapper = class extends (superSemantics ? superSemantics.Wrapper : Wrapper) {
        constructor(node, sourceInterval, baseInterval) {
            super(node, sourceInterval, baseInterval);
            self.checkActionDictsIfHaventAlready();
            this._semantics = self;
        }
    };
    this.super = superSemantics;
    if (superSemantics) {
        if (!(grammar.equals(this.super.grammar) || grammar._inheritsFrom(this.super.grammar))) {
            throw new Error("Cannot extend a semantics for grammar '" +
                this.super.grammar.name +
                "' for use with grammar '" +
                grammar.name +
                "' (not a sub-grammar)");
        }
        this.operations = Object.create(this.super.operations);
        this.attributes = Object.create(this.super.attributes);
        this.attributeKeys = Object.create(null);
        // Assign unique symbols for each of the attributes inherited from the super-semantics so that
        // they are memoized independently.
        for (const attributeName in this.attributes) {
            Object.defineProperty(this.attributeKeys, attributeName, {
                value: util.uniqueId(attributeName)
            });
        }
    }
    else {
        this.operations = Object.create(null);
        this.attributes = Object.create(null);
        this.attributeKeys = Object.create(null);
    }
}
Semantics.prototype.toString = function () {
    return '[semantics for ' + this.grammar.name + ']';
};
Semantics.prototype.checkActionDictsIfHaventAlready = function () {
    if (!this.checkedActionDicts) {
        this.checkActionDicts();
        this.checkedActionDicts = true;
    }
};
// Checks that the action dictionaries for all operations and attributes in this semantics,
// including the ones that were inherited from the super-semantics, agree with the grammar.
// Throws an exception if one or more of them doesn't.
Semantics.prototype.checkActionDicts = function () {
    let name;
    for (name in this.operations) {
        this.operations[name].checkActionDict(this.grammar);
    }
    for (name in this.attributes) {
        this.attributes[name].checkActionDict(this.grammar);
    }
};
Semantics.prototype.toRecipe = function (semanticsOnly) {
    function hasSuperSemantics(s) {
        return s.super !== Semantics.BuiltInSemantics._getSemantics();
    }
    let str = '(function(g) {\n';
    if (hasSuperSemantics(this)) {
        str += '  var semantics = ' + this.super.toRecipe(true) + '(g';
        const superSemanticsGrammar = this.super.grammar;
        let relatedGrammar = this.grammar;
        while (relatedGrammar !== superSemanticsGrammar) {
            str += '.superGrammar';
            relatedGrammar = relatedGrammar.superGrammar;
        }
        str += ');\n';
        str += '  return g.extendSemantics(semantics)';
    }
    else {
        str += '  return g.createSemantics()';
    }
    ['Operation', 'Attribute'].forEach(type => {
        const semanticOperations = this[type.toLowerCase() + 's'];
        Object.keys(semanticOperations).forEach(name => {
            const { actionDict, formals, builtInDefault } = semanticOperations[name];
            let signature = name;
            if (formals.length > 0) {
                signature += '(' + formals.join(', ') + ')';
            }
            let method;
            if (hasSuperSemantics(this) && this.super[type.toLowerCase() + 's'][name]) {
                method = 'extend' + type;
            }
            else {
                method = 'add' + type;
            }
            str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';
            const srcArray = [];
            Object.keys(actionDict).forEach(actionName => {
                if (actionDict[actionName] !== builtInDefault) {
                    let source = actionDict[actionName].toString().trim();
                    // Convert method shorthand to plain old function syntax.
                    // https://github.com/harc/ohm/issues/263
                    source = source.replace(/^.*\(/, 'function(');
                    srcArray.push('\n      ' + JSON.stringify(actionName) + ': ' + source);
                }
            });
            str += srcArray.join(',') + '\n    })';
        });
    });
    str += ';\n  })';
    if (!semanticsOnly) {
        str =
            '(function() {\n' +
                '  var grammar = this.fromRecipe(' +
                jsonToJS(this.grammar.toRecipe()) +
                ');\n' +
                '  var semantics = ' +
                str +
                '(grammar);\n' +
                '  return semantics;\n' +
                '});\n';
    }
    return str;
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
    const r = prototypeGrammar.match(signature, type === 'operation' ? 'OperationSignature' : 'AttributeSignature');
    if (r.failed()) {
        throw new Error(r.message);
    }
    return prototypeGrammarSemantics(r).parse();
}
function newDefaultAction(type, name, doIt) {
    return function (children) {
        const thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
        const args = thisThing.formals.map(formal => this.args[formal]);
        if (!this.isIteration() && children.length === 1) {
            // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
            // we got here means that this action dictionary doesn't have an action for this particular
            // non-terminal or a generic `_nonterminal` action.
            // As a convenience, if this node only has one child, we just return the result of applying
            // this operation / attribute to the child node.
            return doIt.apply(children[0], args);
        }
        else {
            // Otherwise, we throw an exception to let the programmer know that we don't know what
            // to do with this node.
            throw errors.missingSemanticAction(this.ctorName, name, type, globalActionStack);
        }
    };
}
Semantics.prototype.addOperationOrAttribute = function (type, signature, actionDict) {
    const typePlural = type + 's';
    const parsedNameAndFormalArgs = parseSignature(signature, type);
    const name = parsedNameAndFormalArgs.name;
    const formals = parsedNameAndFormalArgs.formals;
    // TODO: check that there are no duplicate formal arguments
    this.assertNewName(name, type);
    // Create the action dictionary for this operation / attribute that contains a `_default` action
    // which defines the default behavior of iteration, terminal, and non-terminal nodes...
    const builtInDefault = newDefaultAction(type, name, doIt);
    const realActionDict = { _default: builtInDefault };
    // ... and add in the actions supplied by the programmer, which may override some or all of the
    // default ones.
    Object.keys(actionDict).forEach(name => {
        realActionDict[name] = actionDict[name];
    });
    const entry = type === 'operation'
        ? new Operation(name, formals, realActionDict, builtInDefault)
        : new Attribute(name, realActionDict, builtInDefault);
    // The following check is not strictly necessary (it will happen later anyway) but it's better to
    // catch errors early.
    entry.checkActionDict(this.grammar);
    this[typePlural][name] = entry;
    function doIt() {
        // Dispatch to most specific version of this operation / attribute -- it may have been
        // overridden by a sub-semantics.
        const thisThing = this._semantics[typePlural][name];
        // Check that the caller passed the correct number of arguments.
        if (arguments.length !== thisThing.formals.length) {
            throw new Error('Invalid number of arguments passed to ' +
                name +
                ' ' +
                type +
                ' (expected ' +
                thisThing.formals.length +
                ', got ' +
                arguments.length +
                ')');
        }
        // Create an "arguments object" from the arguments that were passed to this
        // operation / attribute.
        const args = Object.create(null);
        for (let idx = 0; idx < arguments.length; idx++) {
            const formal = thisThing.formals[idx];
            args[formal] = arguments[idx];
        }
        const oldArgs = this.args;
        this.args = args;
        const ans = thisThing.execute(this._semantics, this);
        this.args = oldArgs;
        return ans;
    }
    if (type === 'operation') {
        this.Wrapper.prototype[name] = doIt;
        this.Wrapper.prototype[name].toString = function () {
            return '[' + name + ' operation]';
        };
    }
    else {
        Object.defineProperty(this.Wrapper.prototype, name, {
            get: doIt,
            configurable: true // So the property can be deleted.
        });
        Object.defineProperty(this.attributeKeys, name, {
            value: util.uniqueId(name)
        });
    }
};
Semantics.prototype.extendOperationOrAttribute = function (type, name, actionDict) {
    const typePlural = type + 's';
    // Make sure that `name` really is just a name, i.e., that it doesn't also contain formals.
    parseSignature(name, 'attribute');
    if (!(this.super && name in this.super[typePlural])) {
        throw new Error('Cannot extend ' +
            type +
            " '" +
            name +
            "': did not inherit an " +
            type +
            ' with that name');
    }
    if (Object.prototype.hasOwnProperty.call(this[typePlural], name)) {
        throw new Error('Cannot extend ' + type + " '" + name + "' again");
    }
    // Create a new operation / attribute whose actionDict delegates to the super operation /
    // attribute's actionDict, and which has all the keys from `inheritedActionDict`.
    const inheritedFormals = this[typePlural][name].formals;
    const inheritedActionDict = this[typePlural][name].actionDict;
    const newActionDict = Object.create(inheritedActionDict);
    Object.keys(actionDict).forEach(name => {
        newActionDict[name] = actionDict[name];
    });
    this[typePlural][name] =
        type === 'operation'
            ? new Operation(name, inheritedFormals, newActionDict)
            : new Attribute(name, newActionDict);
    // The following check is not strictly necessary (it will happen later anyway) but it's better to
    // catch errors early.
    this[typePlural][name].checkActionDict(this.grammar);
};
Semantics.prototype.assertNewName = function (name, type) {
    if (Wrapper.prototype.hasOwnProperty(name)) {
        throw new Error('Cannot add ' + type + " '" + name + "': that's a reserved name");
    }
    if (name in this.operations) {
        throw new Error('Cannot add ' + type + " '" + name + "': an operation with that name already exists");
    }
    if (name in this.attributes) {
        throw new Error('Cannot add ' + type + " '" + name + "': an attribute with that name already exists");
    }
};
// Returns a wrapper for the given CST `node` in this semantics.
// If `node` is already a wrapper, returns `node` itself.  // TODO: why is this needed?
Semantics.prototype.wrap = function (node, source, optBaseInterval) {
    const baseInterval = optBaseInterval || source;
    return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
};
// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
Semantics.createSemantics = function (grammar, optSuperSemantics) {
    const s = new Semantics(grammar, optSuperSemantics !== undefined
        ? optSuperSemantics
        : Semantics.BuiltInSemantics._getSemantics());
    // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
    // for `s`, which is the real `Semantics` instance.
    const proxy = function ASemantics(matchResult) {
        if (!(matchResult instanceof MatchResult)) {
            throw new TypeError('Semantics expected a MatchResult, but got ' +
                common.unexpectedObjToString(matchResult));
        }
        if (matchResult.failed()) {
            throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
        }
        const cst = matchResult._cst;
        if (cst.grammar !== grammar) {
            throw new Error("Cannot use a MatchResult from grammar '" +
                cst.grammar.name +
                "' with a semantics for '" +
                grammar.name +
                "'");
        }
        const inputStream = new InputStream(matchResult.input);
        return s.wrap(cst, inputStream.interval(matchResult._cstOffset, matchResult.input.length));
    };
    // Forward public methods from the proxy to the semantics instance.
    proxy.addOperation = function (signature, actionDict) {
        s.addOperationOrAttribute('operation', signature, actionDict);
        return proxy;
    };
    proxy.extendOperation = function (name, actionDict) {
        s.extendOperationOrAttribute('operation', name, actionDict);
        return proxy;
    };
    proxy.addAttribute = function (name, actionDict) {
        s.addOperationOrAttribute('attribute', name, actionDict);
        return proxy;
    };
    proxy.extendAttribute = function (name, actionDict) {
        s.extendOperationOrAttribute('attribute', name, actionDict);
        return proxy;
    };
    proxy._getActionDict = function (operationOrAttributeName) {
        const action = s.operations[operationOrAttributeName] || s.attributes[operationOrAttributeName];
        if (!action) {
            throw new Error('"' +
                operationOrAttributeName +
                '" is not a valid operation or attribute ' +
                'name in this semantics for "' +
                grammar.name +
                '"');
        }
        return action.actionDict;
    };
    proxy._remove = function (operationOrAttributeName) {
        let semantic;
        if (operationOrAttributeName in s.operations) {
            semantic = s.operations[operationOrAttributeName];
            delete s.operations[operationOrAttributeName];
        }
        else if (operationOrAttributeName in s.attributes) {
            semantic = s.attributes[operationOrAttributeName];
            delete s.attributes[operationOrAttributeName];
        }
        delete s.Wrapper.prototype[operationOrAttributeName];
        return semantic;
    };
    proxy.getOperationNames = function () {
        return Object.keys(s.operations);
    };
    proxy.getAttributeNames = function () {
        return Object.keys(s.attributes);
    };
    proxy.getGrammar = function () {
        return s.grammar;
    };
    proxy.toRecipe = function (semanticsOnly) {
        return s.toRecipe(semanticsOnly);
    };
    // Make the proxy's toString() work.
    proxy.toString = s.toString.bind(s);
    // Returns the semantics for the proxy.
    proxy._getSemantics = function () {
        return s;
    };
    return proxy;
};
// ----------------- Operation -----------------
// An Operation represents a function to be applied to a concrete syntax tree (CST) -- it's very
// similar to a Visitor (http://en.wikipedia.org/wiki/Visitor_pattern). An operation is executed by
// recursively walking the CST, and at each node, invoking the matching semantic action from
// `actionDict`. See `Operation.prototype.execute` for details of how a CST node's matching semantic
// action is found.
class Operation {
    constructor(name, formals, actionDict, builtInDefault) {
        this.name = name;
        this.formals = formals;
        this.actionDict = actionDict;
        this.builtInDefault = builtInDefault;
    }
    checkActionDict(grammar) {
        grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
    }
    // Execute this operation on the CST node associated with `nodeWrapper` in the context of the
    // given Semantics instance.
    execute(semantics, nodeWrapper) {
        try {
            // Look for a semantic action whose name matches the node's constructor name, which is either
            // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
            // iteration node). In the latter case, the action function receives a single argument, which
            // is an array containing all of the children of the CST node.
            const ctorName = nodeWrapper._node.ctorName;
            let actionFn = this.actionDict[ctorName];
            let ans;
            if (actionFn) {
                globalActionStack.push([this, ctorName]);
                ans = this.doAction(semantics, nodeWrapper, actionFn, nodeWrapper.isIteration());
                return ans;
            }
            // The action dictionary does not contain a semantic action for this specific type of node.
            // If this is a nonterminal node and the programmer has provided a `_nonterminal` semantic
            // action, we invoke it:
            if (nodeWrapper.isNonterminal()) {
                actionFn = this.actionDict._nonterminal;
                if (actionFn) {
                    globalActionStack.push([this, '_nonterminal', ctorName]);
                    ans = this.doAction(semantics, nodeWrapper, actionFn, true);
                    return ans;
                }
            }
            // Otherwise, we invoke the '_default' semantic action.
            globalActionStack.push([this, 'default action', ctorName]);
            ans = this.doAction(semantics, nodeWrapper, this.actionDict._default, true);
            return ans;
        }
        finally {
            globalActionStack.pop();
        }
    }
    // Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
    // `semantics`. If `optPassChildrenAsArray` is truthy, `actionFn` will be called with a single
    // argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
    // be equal to the number of children in the CST node.
    doAction(semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
        return optPassChildrenAsArray
            ? actionFn.call(nodeWrapper, nodeWrapper._children())
            : actionFn.apply(nodeWrapper, nodeWrapper._children());
    }
}
Operation.prototype.typeName = 'operation';
// ----------------- Attribute -----------------
// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
class Attribute extends Operation {
    constructor(name, actionDict, builtInDefault) {
        super(name, [], actionDict, builtInDefault);
    }
    execute(semantics, nodeWrapper) {
        const node = nodeWrapper._node;
        const key = semantics.attributeKeys[this.name];
        if (!node.hasOwnProperty(key)) {
            // The following is a super-send -- isn't JS beautiful? :/
            node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
        }
        return node[key];
    }
}
Attribute.prototype.typeName = 'attribute';
// ----------------- Deferred initialization -----------------
util.awaitBuiltInRules(builtInRules => {
    const operationsAndAttributesGrammar = __webpack_require__(/*! ../dist/operations-and-attributes */ "./dist/operations-and-attributes.js");
    initBuiltInSemantics(builtInRules);
    initPrototypeParser(operationsAndAttributesGrammar); // requires BuiltInSemantics
});
function initBuiltInSemantics(builtInRules) {
    const actions = {
        empty() {
            return this.iteration();
        },
        nonEmpty(first, _, rest) {
            return this.iteration([first].concat(rest.children));
        }
    };
    Semantics.BuiltInSemantics = Semantics.createSemantics(builtInRules, null).addOperation('asIteration', {
        emptyListOf: actions.empty,
        nonemptyListOf: actions.nonEmpty,
        EmptyListOf: actions.empty,
        NonemptyListOf: actions.nonEmpty
    });
}
function initPrototypeParser(grammar) {
    prototypeGrammarSemantics = grammar.createSemantics().addOperation('parse', {
        AttributeSignature(name) {
            return {
                name: name.parse(),
                formals: []
            };
        },
        OperationSignature(name, optFormals) {
            return {
                name: name.parse(),
                formals: optFormals.children.map(c => c.parse())[0] || []
            };
        },
        Formals(oparen, fs, cparen) {
            return fs.asIteration().children.map(c => c.parse());
        },
        name(first, rest) {
            return this.sourceString;
        }
    });
    prototypeGrammar = grammar;
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Semantics;


/***/ }),

/***/ "./src/Trace.js":
/*!**********************!*\
  !*** ./src/Trace.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Interval = __webpack_require__(/*! ./Interval */ "./src/Interval.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Unicode characters that are used in the `toString` output.
const BALLOT_X = '\u2717';
const CHECK_MARK = '\u2713';
const DOT_OPERATOR = '\u22C5';
const RIGHTWARDS_DOUBLE_ARROW = '\u21D2';
const SYMBOL_FOR_HORIZONTAL_TABULATION = '\u2409';
const SYMBOL_FOR_LINE_FEED = '\u240A';
const SYMBOL_FOR_CARRIAGE_RETURN = '\u240D';
const Flags = {
    succeeded: 1 << 0,
    isRootNode: 1 << 1,
    isImplicitSpaces: 1 << 2,
    isMemoized: 1 << 3,
    isHeadOfLeftRecursion: 1 << 4,
    terminatesLR: 1 << 5
};
function spaces(n) {
    return common.repeat(' ', n).join('');
}
// Return a string representation of a portion of `input` at offset `pos`.
// The result will contain exactly `len` characters.
function getInputExcerpt(input, pos, len) {
    const excerpt = asEscapedString(input.slice(pos, pos + len));
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
    this.bindings = bindings;
    this.children = optChildren || [];
    this.terminatingLREntry = null;
    this._flags = succeeded ? Flags.succeeded : 0;
}
// A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.
Trace.prototype.SKIP = {};
Object.defineProperty(Trace.prototype, 'displayString', {
    get() {
        return this.expr.toDisplayString();
    }
});
// For convenience, create a getter and setter for the boolean flags in `Flags`.
Object.keys(Flags).forEach(name => {
    const mask = Flags[name];
    Object.defineProperty(Trace.prototype, name, {
        get() {
            return (this._flags & mask) !== 0;
        },
        set(val) {
            if (val) {
                this._flags |= mask;
            }
            else {
                this._flags &= ~mask;
            }
        }
    });
});
Trace.prototype.clone = function () {
    return this.cloneWithExpr(this.expr);
};
Trace.prototype.cloneWithExpr = function (expr) {
    const ans = new Trace(this.input, this.pos, this.pos2, expr, this.succeeded, this.bindings, this.children);
    ans.isHeadOfLeftRecursion = this.isHeadOfLeftRecursion;
    ans.isImplicitSpaces = this.isImplicitSpaces;
    ans.isMemoized = this.isMemoized;
    ans.isRootNode = this.isRootNode;
    ans.terminatesLR = this.terminatesLR;
    ans.terminatingLREntry = this.terminatingLREntry;
    return ans;
};
// Record the trace information for the terminating condition of the LR loop.
Trace.prototype.recordLRTermination = function (ruleBodyTrace, value) {
    this.terminatingLREntry = new Trace(this.input, this.pos, this.pos2, this.expr, false, [value], [ruleBodyTrace]);
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
Trace.prototype.walk = function (visitorObjOrFn, optThisArg) {
    let visitor = visitorObjOrFn;
    if (typeof visitor === 'function') {
        visitor = { enter: visitor };
    }
    function _walk(node, parent, depth) {
        let recurse = true;
        if (visitor.enter) {
            if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
                recurse = false;
            }
        }
        if (recurse) {
            node.children.forEach(child => {
                _walk(child, node, depth + 1);
            });
            if (visitor.exit) {
                visitor.exit.call(optThisArg, node, parent, depth);
            }
        }
    }
    if (this.isRootNode) {
        // Don't visit the root node itself, only its children.
        this.children.forEach(c => {
            _walk(c, null, 0);
        });
    }
    else {
        _walk(this, null, 0);
    }
};
// Return a string representation of the trace.
// Sample:
//     12⋅+⋅2⋅*⋅3 ✓ exp ⇒  "12"
//     12⋅+⋅2⋅*⋅3   ✓ addExp (LR) ⇒  "12"
//     12⋅+⋅2⋅*⋅3       ✗ addExp_plus
Trace.prototype.toString = function () {
    const sb = new common.StringBuffer();
    this.walk((node, parent, depth) => {
        if (!node) {
            return this.SKIP;
        }
        const ctorName = node.expr.constructor.name;
        // Don't print anything for Alt nodes.
        if (ctorName === 'Alt') {
            return; // eslint-disable-line consistent-return
        }
        sb.append(getInputExcerpt(node.input, node.pos, 10) + spaces(depth * 2 + 1));
        sb.append((node.succeeded ? CHECK_MARK : BALLOT_X) + ' ' + node.displayString);
        if (node.isHeadOfLeftRecursion) {
            sb.append(' (LR)');
        }
        if (node.succeeded) {
            const contents = asEscapedString(node.source.contents);
            sb.append(' ' + RIGHTWARDS_DOUBLE_ARROW + '  ');
            sb.append(typeof contents === 'string' ? '"' + contents + '"' : contents);
        }
        sb.append('\n');
    });
    return sb.contents();
};
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = Trace;


/***/ }),

/***/ "./src/common.js":
/*!***********************!*\
  !*** ./src/common.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const extend = __webpack_require__(/*! util-extend */ "../node_modules/util-extend/extend.js");
// --------------------------------------------------------------------
// Private Stuff
// --------------------------------------------------------------------
// Helpers
const escapeStringFor = {};
for (let c = 0; c < 128; c++) {
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
exports.abstract = function (optMethodName) {
    const methodName = optMethodName || '';
    return function () {
        throw new Error('this method ' +
            methodName +
            ' is abstract! ' +
            '(it has no implementation in class ' +
            this.constructor.name +
            ')');
    };
};
exports.assert = function (cond, message) {
    if (!cond) {
        throw new Error(message);
    }
};
// Define a lazily-computed, non-enumerable property named `propName`
// on the object `obj`. `getterFn` will be called to compute the value the
// first time the property is accessed.
exports.defineLazyProperty = function (obj, propName, getterFn) {
    let memo;
    Object.defineProperty(obj, propName, {
        get() {
            if (!memo) {
                memo = getterFn.call(this);
            }
            return memo;
        }
    });
};
exports.clone = function (obj) {
    if (obj) {
        return extend({}, obj);
    }
    return obj;
};
exports.extend = extend;
exports.repeatFn = function (fn, n) {
    const arr = [];
    while (n-- > 0) {
        arr.push(fn());
    }
    return arr;
};
exports.repeatStr = function (str, n) {
    return new Array(n + 1).join(str);
};
exports.repeat = function (x, n) {
    return exports.repeatFn(() => x, n);
};
exports.getDuplicates = function (array) {
    const duplicates = [];
    for (let idx = 0; idx < array.length; idx++) {
        const x = array[idx];
        if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
            duplicates.push(x);
        }
    }
    return duplicates;
};
exports.copyWithoutDuplicates = function (array) {
    const noDuplicates = [];
    array.forEach(entry => {
        if (noDuplicates.indexOf(entry) < 0) {
            noDuplicates.push(entry);
        }
    });
    return noDuplicates;
};
exports.isSyntactic = function (ruleName) {
    const firstChar = ruleName[0];
    return firstChar === firstChar.toUpperCase();
};
exports.isLexical = function (ruleName) {
    return !exports.isSyntactic(ruleName);
};
exports.padLeft = function (str, len, optChar) {
    const ch = optChar || ' ';
    if (str.length < len) {
        return exports.repeatStr(ch, len - str.length) + str;
    }
    return str;
};
// StringBuffer
exports.StringBuffer = function () {
    this.strings = [];
};
exports.StringBuffer.prototype.append = function (str) {
    this.strings.push(str);
};
exports.StringBuffer.prototype.contents = function () {
    return this.strings.join('');
};
// Character escaping and unescaping
exports.escapeChar = function (c, optDelim) {
    const charCode = c.charCodeAt(0);
    if ((c === '"' || c === "'") && optDelim && c !== optDelim) {
        return c;
    }
    else if (charCode < 128) {
        return escapeStringFor[charCode];
    }
    else if (128 <= charCode && charCode < 256) {
        return '\\x' + exports.padLeft(charCode.toString(16), 2, '0');
    }
    else {
        return '\\u' + exports.padLeft(charCode.toString(16), 4, '0');
    }
};
exports.unescapeChar = function (s) {
    if (s.charAt(0) === '\\') {
        switch (s.charAt(1)) {
            case 'b':
                return '\b';
            case 'f':
                return '\f';
            case 'n':
                return '\n';
            case 'r':
                return '\r';
            case 't':
                return '\t';
            case 'v':
                return '\v';
            case 'x':
                return String.fromCharCode(parseInt(s.substring(2, 4), 16));
            case 'u':
                return String.fromCharCode(parseInt(s.substring(2, 6), 16));
            default:
                return s.charAt(1);
        }
    }
    else {
        return s;
    }
};
// Helper for producing a description of an unknown object in a safe way.
// Especially useful for error messages where an unexpected type of object was encountered.
exports.unexpectedObjToString = function (obj) {
    if (obj == null) {
        return String(obj);
    }
    const baseToString = Object.prototype.toString.call(obj);
    try {
        let typeName;
        if (obj.constructor && obj.constructor.name) {
            typeName = obj.constructor.name;
        }
        else if (baseToString.indexOf('[object ') === 0) {
            typeName = baseToString.slice(8, -1); // Extract e.g. "Array" from "[object Array]".
        }
        else {
            typeName = typeof obj;
        }
        return typeName + ': ' + JSON.stringify(String(obj));
    }
    catch (e) {
        return baseToString;
    }
};


/***/ }),

/***/ "./src/errors.js":
/*!***********************!*\
  !*** ./src/errors.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
const Namespace = __webpack_require__(/*! ./Namespace */ "./src/Namespace.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function createError(message, optInterval) {
    let e;
    if (optInterval) {
        e = new Error(optInterval.getLineAndColumnMessage() + message);
        e.shortMessage = message;
        e.interval = optInterval;
    }
    else {
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
    const e = new Error();
    Object.defineProperty(e, 'message', {
        enumerable: true,
        get() {
            return matchFailure.message;
        }
    });
    Object.defineProperty(e, 'shortMessage', {
        enumerable: true,
        get() {
            return 'Expected ' + matchFailure.getExpectedText();
        }
    });
    e.interval = matchFailure.getInterval();
    return e;
}
// Undeclared grammar
function undeclaredGrammar(grammarName, namespace, interval) {
    const message = namespace
        ? 'Grammar ' +
            grammarName +
            ' is not declared in namespace ' +
            Namespace.toString(namespace)
        : 'Undeclared grammar ' + grammarName;
    return createError(message, interval);
}
// Duplicate grammar declaration
function duplicateGrammarDeclaration(grammar, namespace) {
    return createError('Grammar ' + grammar.name + ' is already declared in this namespace');
}
// ----------------- rules -----------------
// Undeclared rule
function undeclaredRule(ruleName, grammarName, optInterval) {
    return createError('Rule ' + ruleName + ' is not declared in grammar ' + grammarName, optInterval);
}
// Cannot override undeclared rule
function cannotOverrideUndeclaredRule(ruleName, grammarName, optSource) {
    return createError('Cannot override rule ' + ruleName + ' because it is not declared in ' + grammarName, optSource);
}
// Cannot extend undeclared rule
function cannotExtendUndeclaredRule(ruleName, grammarName, optSource) {
    return createError('Cannot extend rule ' + ruleName + ' because it is not declared in ' + grammarName, optSource);
}
// Duplicate rule declaration
function duplicateRuleDeclaration(ruleName, grammarName, declGrammarName, optSource) {
    let message = "Duplicate declaration for rule '" + ruleName + "' in grammar '" + grammarName + "'";
    if (grammarName !== declGrammarName) {
        message += " (originally declared in '" + declGrammarName + "')";
    }
    return createError(message, optSource);
}
// Wrong number of parameters
function wrongNumberOfParameters(ruleName, expected, actual, source) {
    return createError('Wrong number of parameters for rule ' +
        ruleName +
        ' (expected ' +
        expected +
        ', got ' +
        actual +
        ')', source);
}
// Wrong number of arguments
function wrongNumberOfArguments(ruleName, expected, actual, expr) {
    return createError('Wrong number of arguments for rule ' +
        ruleName +
        ' (expected ' +
        expected +
        ', got ' +
        actual +
        ')', expr.source);
}
// Duplicate parameter names
function duplicateParameterNames(ruleName, duplicates, source) {
    return createError('Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(', '), source);
}
// Invalid parameter expression
function invalidParameter(ruleName, expr) {
    return createError('Invalid parameter to rule ' +
        ruleName +
        ': ' +
        expr +
        ' has arity ' +
        expr.getArity() +
        ', but parameter expressions must have arity 1', expr.source);
}
// Application of syntactic rule from lexical rule
function applicationOfSyntacticRuleFromLexicalContext(ruleName, applyExpr) {
    return createError('Cannot apply syntactic rule ' + ruleName + ' from here (inside a lexical context)', applyExpr.source);
}
// Incorrect argument type
function incorrectArgumentType(expectedType, expr) {
    return createError('Incorrect argument type: expected ' + expectedType, expr.source);
}
// Multiple instances of the super-splice operator (`...`) in the rule body.
function multipleSuperSplices(expr) {
    return createError("'...' can appear at most once in a rule body", expr.source);
}
// ----------------- Kleene operators -----------------
function kleeneExprHasNullableOperand(kleeneExpr, applicationStack) {
    const actuals = applicationStack.length > 0 ? applicationStack[applicationStack.length - 1].args : [];
    const expr = kleeneExpr.expr.substituteParams(actuals);
    let message = 'Nullable expression ' +
        expr +
        " is not allowed inside '" +
        kleeneExpr.operator +
        "' (possible infinite loop)";
    if (applicationStack.length > 0) {
        const stackTrace = applicationStack
            .map(app => new pexprs.Apply(app.ruleName, app.args))
            .join('\n');
        message += '\nApplication stack (most recent application last):\n' + stackTrace;
    }
    return createError(message, kleeneExpr.expr.source);
}
// ----------------- arity -----------------
function inconsistentArity(ruleName, expected, actual, expr) {
    return createError('Rule ' +
        ruleName +
        ' involves an alternation which has inconsistent arity ' +
        '(expected ' +
        expected +
        ', got ' +
        actual +
        ')', expr.source);
}
// ----------------- properties -----------------
function duplicatePropertyNames(duplicates) {
    return createError('Object pattern has duplicate property names: ' + duplicates.join(', '));
}
// ----------------- constructors -----------------
function invalidConstructorCall(grammar, ctorName, children) {
    return createError('Attempt to invoke constructor ' + ctorName + ' with invalid or unexpected arguments');
}
// ----------------- convenience -----------------
function multipleErrors(errors) {
    const messages = errors.map(e => e.message);
    return createError(['Errors:'].concat(messages).join('\n- '), errors[0].interval);
}
// ----------------- semantic -----------------
function missingSemanticAction(ctorName, name, type, stack) {
    let stackTrace = stack
        .slice(0, -1)
        .map(info => {
        const ans = '  ' + info[0].name + ' > ' + info[1];
        return info.length === 3 ? ans + " for '" + info[2] + "'" : ans;
    })
        .join('\n');
    stackTrace += '\n  ' + name + ' > ' + ctorName;
    let moreInfo = '';
    if (ctorName === '_iter') {
        moreInfo = [
            '\nNOTE: as of Ohm v16, there is no default action for iteration nodes — see ',
            '  https://git.io/JRwtG for details.'
        ].join('\n');
    }
    const message = [
        `Missing semantic action for '${ctorName}' in ${type} '${name}'.${moreInfo}`,
        'Action stack (most recent call last):',
        stackTrace
    ].join('\n');
    const e = createError(message);
    e.name = 'missingSemanticAction';
    return e;
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = {
    applicationOfSyntacticRuleFromLexicalContext,
    cannotExtendUndeclaredRule,
    cannotOverrideUndeclaredRule,
    duplicateGrammarDeclaration,
    duplicateParameterNames,
    duplicatePropertyNames,
    duplicateRuleDeclaration,
    inconsistentArity,
    incorrectArgumentType,
    intervalSourcesDontMatch,
    invalidConstructorCall,
    invalidParameter,
    grammarSyntaxError,
    kleeneExprHasNullableOperand,
    missingSemanticAction,
    multipleSuperSplices,
    undeclaredGrammar,
    undeclaredRule,
    wrongNumberOfArguments,
    wrongNumberOfParameters,
    throwErrors(errors) {
        if (errors.length === 1) {
            throw errors[0];
        }
        if (errors.length > 1) {
            throw multipleErrors(errors);
        }
    }
};


/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Builder = __webpack_require__(/*! ./Builder */ "./src/Builder.js");
const Grammar = __webpack_require__(/*! ./Grammar */ "./src/Grammar.js");
const Namespace = __webpack_require__(/*! ./Namespace */ "./src/Namespace.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
const util = __webpack_require__(/*! ./util */ "./src/util.js");
const version = __webpack_require__(/*! ./version */ "./src/version.js");
const isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
let ohmGrammar;
const superSplicePlaceholder = Object.create(pexprs.PExpr.prototype);
// Returns a Grammar instance (i.e., an object with a `match` method) for
// `tree`, which is the concrete syntax tree of a user-written grammar.
// The grammar will be assigned into `namespace` under the name of the grammar
// as specified in the source.
function buildGrammar(match, namespace, optOhmGrammarForTesting) {
    const builder = new Builder();
    let decl;
    let currentRuleName;
    let currentRuleFormals;
    let overriding = false;
    const metaGrammar = optOhmGrammarForTesting || ohmGrammar;
    // A visitor that produces a Grammar instance from the CST.
    const helpers = metaGrammar.createSemantics().addOperation('visit', {
        Grammars(grammarIter) {
            return grammarIter.children.map(c => c.visit());
        },
        Grammar(id, s, _open, rules, _close) {
            const grammarName = id.visit();
            decl = builder.newGrammar(grammarName, namespace);
            s.child(0) && s.child(0).visit();
            rules.children.map(c => c.visit());
            const g = decl.build();
            g.source = this.source.trimmed();
            if (grammarName in namespace) {
                throw errors.duplicateGrammarDeclaration(g, namespace);
            }
            namespace[grammarName] = g;
            return g;
        },
        SuperGrammar(_, n) {
            const superGrammarName = n.visit();
            if (superGrammarName === 'null') {
                decl.withSuperGrammar(null);
            }
            else {
                if (!namespace || !(superGrammarName in namespace)) {
                    throw errors.undeclaredGrammar(superGrammarName, namespace, n.source);
                }
                decl.withSuperGrammar(namespace[superGrammarName]);
            }
        },
        Rule_define(n, fs, d, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.children.map(c => c.visit())[0] || [];
            // If there is no default start rule yet, set it now. This must be done before visiting
            // the body, because it might contain an inline rule definition.
            if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
                decl.withDefaultStartRule(currentRuleName);
            }
            const body = b.visit();
            const description = d.children.map(c => c.visit())[0];
            const source = this.source.trimmed();
            return decl.define(currentRuleName, currentRuleFormals, body, description, source);
        },
        Rule_override(n, fs, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.children.map(c => c.visit())[0] || [];
            const source = this.source.trimmed();
            decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);
            overriding = true;
            const body = b.visit();
            overriding = false;
            return decl.override(currentRuleName, currentRuleFormals, body, null, source);
        },
        Rule_extend(n, fs, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.children.map(c => c.visit())[0] || [];
            const body = b.visit();
            const source = this.source.trimmed();
            return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
        },
        RuleBody(_, terms) {
            const args = terms.visit();
            return builder.alt.apply(builder, args).withSource(this.source);
        },
        OverrideRuleBody(_, terms) {
            const args = terms.visit();
            // Check if the super-splice operator (`...`) appears in the terms.
            const expansionPos = args.indexOf(superSplicePlaceholder);
            if (expansionPos >= 0) {
                const beforeTerms = args.slice(0, expansionPos);
                const afterTerms = args.slice(expansionPos + 1);
                // Ensure it appears no more than once.
                afterTerms.forEach(t => {
                    if (t === superSplicePlaceholder)
                        throw errors.multipleSuperSplices(t);
                });
                return new pexprs.Splice(decl.superGrammar, currentRuleName, beforeTerms, afterTerms).withSource(this.source);
            }
            else {
                return builder.alt.apply(builder, args).withSource(this.source);
            }
        },
        Formals(opointy, fs, cpointy) {
            return fs.visit();
        },
        Params(opointy, ps, cpointy) {
            return ps.visit();
        },
        Alt(seqs) {
            const args = seqs.visit();
            return builder.alt.apply(builder, args).withSource(this.source);
        },
        TopLevelTerm_inline(b, n) {
            const inlineRuleName = currentRuleName + '_' + n.visit();
            const body = b.visit();
            const source = this.source.trimmed();
            const isNewRuleDeclaration = !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
            if (overriding && !isNewRuleDeclaration) {
                decl.override(inlineRuleName, currentRuleFormals, body, null, source);
            }
            else {
                decl.define(inlineRuleName, currentRuleFormals, body, null, source);
            }
            const params = currentRuleFormals.map(formal => builder.app(formal));
            return builder.app(inlineRuleName, params).withSource(body.source);
        },
        OverrideTopLevelTerm_superSplice(_) {
            return superSplicePlaceholder;
        },
        Seq(expr) {
            return builder.seq
                .apply(builder, expr.children.map(c => c.visit()))
                .withSource(this.source);
        },
        Iter_star(x, _) {
            return builder.star(x.visit()).withSource(this.source);
        },
        Iter_plus(x, _) {
            return builder.plus(x.visit()).withSource(this.source);
        },
        Iter_opt(x, _) {
            return builder.opt(x.visit()).withSource(this.source);
        },
        Pred_not(_, x) {
            return builder.not(x.visit()).withSource(this.source);
        },
        Pred_lookahead(_, x) {
            return builder.lookahead(x.visit()).withSource(this.source);
        },
        Lex_lex(_, x) {
            return builder.lex(x.visit()).withSource(this.source);
        },
        Base_application(rule, ps) {
            const params = ps.children.map(c => c.visit())[0] || [];
            return builder.app(rule.visit(), params).withSource(this.source);
        },
        Base_range(from, _, to) {
            return builder.range(from.visit(), to.visit()).withSource(this.source);
        },
        Base_terminal(expr) {
            return builder.terminal(expr.visit()).withSource(this.source);
        },
        Base_paren(open, x, close) {
            return x.visit();
        },
        ruleDescr(open, t, close) {
            return t.visit();
        },
        ruleDescrText(_) {
            return this.sourceString.trim();
        },
        caseName(_, space1, n, space2, end) {
            return n.visit();
        },
        name(first, rest) {
            return this.sourceString;
        },
        nameFirst(expr) { },
        nameRest(expr) { },
        terminal(open, cs, close) {
            return cs.children.map(c => c.visit()).join('');
        },
        oneCharTerminal(open, c, close) {
            return c.visit();
        },
        terminalChar(_) {
            return common.unescapeChar(this.sourceString);
        },
        escapeChar(_) {
            return this.sourceString;
        },
        NonemptyListOf(x, _, xs) {
            return [x.visit()].concat(xs.children.map(c => c.visit()));
        },
        EmptyListOf() {
            return [];
        },
        _terminal() {
            return this.sourceString;
        }
    });
    return helpers(match).visit();
}
function compileAndLoad(source, namespace) {
    const m = ohmGrammar.match(source, 'Grammars');
    if (m.failed()) {
        throw errors.grammarSyntaxError(m);
    }
    return buildGrammar(m, namespace);
}
function grammar(source, optNamespace) {
    const ns = grammars(source, optNamespace);
    // Ensure that the source contained no more than one grammar definition.
    const grammarNames = Object.keys(ns);
    if (grammarNames.length === 0) {
        throw new Error('Missing grammar definition');
    }
    else if (grammarNames.length > 1) {
        const secondGrammar = ns[grammarNames[1]];
        const interval = secondGrammar.source;
        throw new Error(util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
            'Found more than one grammar definition -- use ohm.grammars() instead.');
    }
    return ns[grammarNames[0]]; // Return the one and only grammar.
}
function grammars(source, optNamespace) {
    const ns = Namespace.extend(Namespace.asNamespace(optNamespace));
    if (typeof source !== 'string') {
        // For convenience, detect Node.js Buffer objects and automatically call toString().
        if (isBuffer(source)) {
            source = source.toString();
        }
        else {
            throw new TypeError('Expected string as first argument, got ' + common.unexpectedObjToString(source));
        }
    }
    compileAndLoad(source, ns);
    return ns;
}
function grammarFromScriptElement(optNode) {
    throw new Error('grammarFromScriptElement was removed in Ohm v16.0. See https://git.io/J0gnK for more info.');
}
function grammarsFromScriptElements(optNodeOrNodeList) {
    throw new Error('grammarsFromScriptElements was removed in Ohm v16.0. See https://git.io/J0gnK for more info.');
}
function makeRecipe(recipe) {
    if (typeof recipe === 'function') {
        return recipe.call(new Builder());
    }
    else {
        if (typeof recipe === 'string') {
            // stringified JSON recipe
            recipe = JSON.parse(recipe);
        }
        return new Builder().fromRecipe(recipe);
    }
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
// Stuff that users should know about
module.exports = {
    createNamespace: Namespace.createNamespace,
    grammar,
    grammars,
    grammarFromScriptElement,
    grammarsFromScriptElements,
    makeRecipe,
    ohmGrammar: null,
    pexprs,
    util,
    extras: __webpack_require__(/*! ../extras */ "./extras/index.js"),
    version
};
// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
// Late initialization for stuff that is bootstrapped.
Grammar.BuiltInRules = __webpack_require__(/*! ../dist/built-in-rules */ "./dist/built-in-rules.js");
util.announceBuiltInRules(Grammar.BuiltInRules);
module.exports.ohmGrammar = ohmGrammar = __webpack_require__(/*! ../dist/ohm-grammar */ "./dist/ohm-grammar.js");
Grammar.initApplicationParser(ohmGrammar, buildGrammar);


/***/ }),

/***/ "./src/nodes.js":
/*!**********************!*\
  !*** ./src/nodes.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const common = __webpack_require__(/*! ./common */ "./src/common.js");
// Ensures that the deprecation warning for `primitiveValue` only appears once.
let didWarnForPrimitiveValue = false;
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
class Node {
    constructor(grammar, ctorName, matchLength) {
        this.grammar = grammar;
        this.ctorName = ctorName;
        this.matchLength = matchLength;
    }
    numChildren() {
        return this.children ? this.children.length : 0;
    }
    childAt(idx) {
        if (this.children) {
            return this.children[idx];
        }
    }
    indexOfChild(arg) {
        return this.children.indexOf(arg);
    }
    hasChildren() {
        return this.numChildren() > 0;
    }
    hasNoChildren() {
        return !this.hasChildren();
    }
    onlyChild() {
        if (this.numChildren() !== 1) {
            throw new Error('cannot get only child of a node of type ' +
                this.ctorName +
                ' (it has ' +
                this.numChildren() +
                ' children)');
        }
        else {
            return this.firstChild();
        }
    }
    firstChild() {
        if (this.hasNoChildren()) {
            throw new Error('cannot get first child of a ' + this.ctorName + ' node, which has no children');
        }
        else {
            return this.childAt(0);
        }
    }
    lastChild() {
        if (this.hasNoChildren()) {
            throw new Error('cannot get last child of a ' + this.ctorName + ' node, which has no children');
        }
        else {
            return this.childAt(this.numChildren() - 1);
        }
    }
    childBefore(child) {
        const childIdx = this.indexOfChild(child);
        if (childIdx < 0) {
            throw new Error('Node.childBefore() called w/ an argument that is not a child');
        }
        else if (childIdx === 0) {
            throw new Error('cannot get child before first child');
        }
        else {
            return this.childAt(childIdx - 1);
        }
    }
    childAfter(child) {
        const childIdx = this.indexOfChild(child);
        if (childIdx < 0) {
            throw new Error('Node.childAfter() called w/ an argument that is not a child');
        }
        else if (childIdx === this.numChildren() - 1) {
            throw new Error('cannot get child after last child');
        }
        else {
            return this.childAt(childIdx + 1);
        }
    }
    isTerminal() {
        return false;
    }
    isNonterminal() {
        return false;
    }
    isIteration() {
        return false;
    }
    isOptional() {
        return false;
    }
    toJSON() {
        return { [this.ctorName]: this.children };
    }
}
// Terminals
class TerminalNode extends Node {
    constructor(grammar, value) {
        const matchLength = value ? value.length : 0;
        super(grammar, '_terminal', matchLength);
        this._value = value;
    }
    isTerminal() {
        return true;
    }
    toJSON() {
        return { [this.ctorName]: this._value };
    }
    get primitiveValue() {
        if (!didWarnForPrimitiveValue) {
            // eslint-disable-next-line no-console
            console.warn('Warning: primitiveValue is deprecated and will be removed in a future version of Ohm. ' +
                'Use sourceString instead.');
            didWarnForPrimitiveValue = true;
        }
        return this._value;
    }
}
// Nonterminals
class NonterminalNode extends Node {
    constructor(grammar, ruleName, children, childOffsets, matchLength) {
        super(grammar, ruleName, matchLength);
        this.children = children;
        this.childOffsets = childOffsets;
    }
    isNonterminal() {
        return true;
    }
    isLexical() {
        return common.isLexical(this.ctorName);
    }
    isSyntactic() {
        return common.isSyntactic(this.ctorName);
    }
}
// Iterations
class IterationNode extends Node {
    constructor(grammar, children, childOffsets, matchLength, isOptional) {
        super(grammar, '_iter', matchLength);
        this.children = children;
        this.childOffsets = childOffsets;
        this.optional = isOptional;
    }
    isIteration() {
        return true;
    }
    isOptional() {
        return this.optional;
    }
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = {
    Node,
    TerminalNode,
    NonterminalNode,
    IterationNode
};


/***/ }),

/***/ "./src/pexprs-allowsSkippingPrecedingSpace.js":
/*!****************************************************!*\
  !*** ./src/pexprs-allowsSkippingPrecedingSpace.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
/*
  Return true if we should skip spaces preceding this expression in a syntactic context.
*/
pexprs.PExpr.prototype.allowsSkippingPrecedingSpace = common.abstract('allowsSkippingPrecedingSpace');
/*
  Generally, these are all first-order expressions and (with the exception of Apply)
  directly read from the input stream.
*/
pexprs.any.allowsSkippingPrecedingSpace =
    pexprs.end.allowsSkippingPrecedingSpace =
        pexprs.Apply.prototype.allowsSkippingPrecedingSpace =
            pexprs.Terminal.prototype.allowsSkippingPrecedingSpace =
                pexprs.Range.prototype.allowsSkippingPrecedingSpace =
                    pexprs.UnicodeChar.prototype.allowsSkippingPrecedingSpace =
                        function () {
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
                        pexprs.Seq.prototype.allowsSkippingPrecedingSpace =
                            function () {
                                return false;
                            };


/***/ }),

/***/ "./src/pexprs-assertAllApplicationsAreValid.js":
/*!*****************************************************!*\
  !*** ./src/pexprs-assertAllApplicationsAreValid.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
const util = __webpack_require__(/*! ./util */ "./src/util.js");
let BuiltInRules;
util.awaitBuiltInRules(g => {
    BuiltInRules = g;
});
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
let lexifyCount;
pexprs.PExpr.prototype.assertAllApplicationsAreValid = function (ruleName, grammar) {
    lexifyCount = 0;
    this._assertAllApplicationsAreValid(ruleName, grammar);
};
pexprs.PExpr.prototype._assertAllApplicationsAreValid = common.abstract('_assertAllApplicationsAreValid');
pexprs.any._assertAllApplicationsAreValid =
    pexprs.end._assertAllApplicationsAreValid =
        pexprs.Terminal.prototype._assertAllApplicationsAreValid =
            pexprs.Range.prototype._assertAllApplicationsAreValid =
                pexprs.Param.prototype._assertAllApplicationsAreValid =
                    pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid =
                        function (ruleName, grammar) {
                            // no-op
                        };
pexprs.Lex.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
    lexifyCount++;
    this.expr._assertAllApplicationsAreValid(ruleName, grammar);
    lexifyCount--;
};
pexprs.Alt.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
    for (let idx = 0; idx < this.terms.length; idx++) {
        this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
    }
};
pexprs.Seq.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
    for (let idx = 0; idx < this.factors.length; idx++) {
        this.factors[idx]._assertAllApplicationsAreValid(ruleName, grammar);
    }
};
pexprs.Iter.prototype._assertAllApplicationsAreValid =
    pexprs.Not.prototype._assertAllApplicationsAreValid =
        pexprs.Lookahead.prototype._assertAllApplicationsAreValid =
            function (ruleName, grammar) {
                this.expr._assertAllApplicationsAreValid(ruleName, grammar);
            };
pexprs.Apply.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
    const ruleInfo = grammar.rules[this.ruleName];
    // Make sure that the rule exists...
    if (!ruleInfo) {
        throw errors.undeclaredRule(this.ruleName, grammar.name, this.source);
    }
    // ...and that this application is allowed
    if (common.isSyntactic(this.ruleName) &&
        (!common.isSyntactic(ruleName) || lexifyCount > 0)) {
        throw errors.applicationOfSyntacticRuleFromLexicalContext(this.ruleName, this);
    }
    // ...and that this application has the correct number of arguments
    const actual = this.args.length;
    const expected = ruleInfo.formals.length;
    if (actual !== expected) {
        throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
    }
    // ...and that all of the argument expressions only have valid applications and have arity 1.
    this.args.forEach(arg => {
        arg._assertAllApplicationsAreValid(ruleName, grammar);
        if (arg.getArity() !== 1) {
            throw errors.invalidParameter(this.ruleName, arg);
        }
    });
    // Extra checks for "special" applications
    // If it's an application of 'caseInsensitive', ensure that the argument is a Terminal.
    if (BuiltInRules && ruleInfo === BuiltInRules.rules.caseInsensitive) {
        if (!(this.args[0] instanceof pexprs.Terminal)) {
            throw errors.incorrectArgumentType('a Terminal (e.g. "abc")', this.args[0]);
        }
    }
};


/***/ }),

/***/ "./src/pexprs-assertChoicesHaveUniformArity.js":
/*!*****************************************************!*\
  !*** ./src/pexprs-assertChoicesHaveUniformArity.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
pexprs.PExpr.prototype.assertChoicesHaveUniformArity = common.abstract('assertChoicesHaveUniformArity');
pexprs.any.assertChoicesHaveUniformArity =
    pexprs.end.assertChoicesHaveUniformArity =
        pexprs.Terminal.prototype.assertChoicesHaveUniformArity =
            pexprs.Range.prototype.assertChoicesHaveUniformArity =
                pexprs.Param.prototype.assertChoicesHaveUniformArity =
                    pexprs.Lex.prototype.assertChoicesHaveUniformArity =
                        pexprs.UnicodeChar.prototype.assertChoicesHaveUniformArity =
                            function (ruleName) {
                                // no-op
                            };
pexprs.Alt.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    if (this.terms.length === 0) {
        return;
    }
    const arity = this.terms[0].getArity();
    for (let idx = 0; idx < this.terms.length; idx++) {
        const term = this.terms[idx];
        term.assertChoicesHaveUniformArity();
        const otherArity = term.getArity();
        if (arity !== otherArity) {
            throw errors.inconsistentArity(ruleName, arity, otherArity, term);
        }
    }
};
pexprs.Extend.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    // Extend is a special case of Alt that's guaranteed to have exactly two
    // cases: [extensions, origBody].
    const actualArity = this.terms[0].getArity();
    const expectedArity = this.terms[1].getArity();
    if (actualArity !== expectedArity) {
        throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
    }
};
pexprs.Seq.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    for (let idx = 0; idx < this.factors.length; idx++) {
        this.factors[idx].assertChoicesHaveUniformArity(ruleName);
    }
};
pexprs.Iter.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    this.expr.assertChoicesHaveUniformArity(ruleName);
};
pexprs.Not.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    // no-op (not required b/c the nested expr doesn't show up in the CST)
};
pexprs.Lookahead.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    this.expr.assertChoicesHaveUniformArity(ruleName);
};
pexprs.Apply.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    // The arities of the parameter expressions is required to be 1 by
    // `assertAllApplicationsAreValid()`.
};


/***/ }),

/***/ "./src/pexprs-assertIteratedExprsAreNotNullable.js":
/*!*********************************************************!*\
  !*** ./src/pexprs-assertIteratedExprsAreNotNullable.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
pexprs.PExpr.prototype.assertIteratedExprsAreNotNullable = common.abstract('assertIteratedExprsAreNotNullable');
pexprs.any.assertIteratedExprsAreNotNullable =
    pexprs.end.assertIteratedExprsAreNotNullable =
        pexprs.Terminal.prototype.assertIteratedExprsAreNotNullable =
            pexprs.Range.prototype.assertIteratedExprsAreNotNullable =
                pexprs.Param.prototype.assertIteratedExprsAreNotNullable =
                    pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable =
                        function (grammar) {
                            // no-op
                        };
pexprs.Alt.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
    for (let idx = 0; idx < this.terms.length; idx++) {
        this.terms[idx].assertIteratedExprsAreNotNullable(grammar);
    }
};
pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
    for (let idx = 0; idx < this.factors.length; idx++) {
        this.factors[idx].assertIteratedExprsAreNotNullable(grammar);
    }
};
pexprs.Iter.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
    // Note: this is the implementation of this method for `Star` and `Plus` expressions.
    // It is overridden for `Opt` below.
    this.expr.assertIteratedExprsAreNotNullable(grammar);
    if (this.expr.isNullable(grammar)) {
        throw errors.kleeneExprHasNullableOperand(this, []);
    }
};
pexprs.Opt.prototype.assertIteratedExprsAreNotNullable =
    pexprs.Not.prototype.assertIteratedExprsAreNotNullable =
        pexprs.Lookahead.prototype.assertIteratedExprsAreNotNullable =
            pexprs.Lex.prototype.assertIteratedExprsAreNotNullable =
                function (grammar) {
                    this.expr.assertIteratedExprsAreNotNullable(grammar);
                };
pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
    this.args.forEach(arg => {
        arg.assertIteratedExprsAreNotNullable(grammar);
    });
};


/***/ }),

/***/ "./src/pexprs-eval.js":
/*!****************************!*\
  !*** ./src/pexprs-eval.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Trace = __webpack_require__(/*! ./Trace */ "./src/Trace.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
const nodes = __webpack_require__(/*! ./nodes */ "./src/nodes.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
const TerminalNode = nodes.TerminalNode;
const NonterminalNode = nodes.NonterminalNode;
const IterationNode = nodes.IterationNode;
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
pexprs.PExpr.prototype.eval = common.abstract('eval'); // function(state) { ... }
pexprs.any.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const ch = inputStream.next();
    if (ch) {
        state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
        return true;
    }
    else {
        state.processFailure(origPos, this);
        return false;
    }
};
pexprs.end.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    if (inputStream.atEnd()) {
        state.pushBinding(new TerminalNode(state.grammar, undefined), origPos);
        return true;
    }
    else {
        state.processFailure(origPos, this);
        return false;
    }
};
pexprs.Terminal.prototype.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    if (!inputStream.matchString(this.obj)) {
        state.processFailure(origPos, this);
        return false;
    }
    else {
        state.pushBinding(new TerminalNode(state.grammar, this.obj), origPos);
        return true;
    }
};
pexprs.Range.prototype.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const ch = inputStream.next();
    if (ch && this.from <= ch && ch <= this.to) {
        state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
        return true;
    }
    else {
        state.processFailure(origPos, this);
        return false;
    }
};
pexprs.Param.prototype.eval = function (state) {
    return state.eval(state.currentApplication().args[this.index]);
};
pexprs.Lex.prototype.eval = function (state) {
    state.enterLexifiedContext();
    const ans = state.eval(this.expr);
    state.exitLexifiedContext();
    return ans;
};
pexprs.Alt.prototype.eval = function (state) {
    for (let idx = 0; idx < this.terms.length; idx++) {
        if (state.eval(this.terms[idx])) {
            return true;
        }
    }
    return false;
};
pexprs.Seq.prototype.eval = function (state) {
    for (let idx = 0; idx < this.factors.length; idx++) {
        const factor = this.factors[idx];
        if (!state.eval(factor)) {
            return false;
        }
    }
    return true;
};
pexprs.Iter.prototype.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const arity = this.getArity();
    const cols = [];
    const colOffsets = [];
    while (cols.length < arity) {
        cols.push([]);
        colOffsets.push([]);
    }
    let numMatches = 0;
    let prevPos = origPos;
    let idx;
    while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
        if (inputStream.pos === prevPos) {
            throw errors.kleeneExprHasNullableOperand(this, state._applicationStack);
        }
        prevPos = inputStream.pos;
        numMatches++;
        const row = state._bindings.splice(state._bindings.length - arity, arity);
        const rowOffsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
        for (idx = 0; idx < row.length; idx++) {
            cols[idx].push(row[idx]);
            colOffsets[idx].push(rowOffsets[idx]);
        }
    }
    if (numMatches < this.minNumMatches) {
        return false;
    }
    let offset = state.posToOffset(origPos);
    let matchLength = 0;
    if (numMatches > 0) {
        const lastCol = cols[arity - 1];
        const lastColOffsets = colOffsets[arity - 1];
        const endOffset = lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
        offset = colOffsets[0][0];
        matchLength = endOffset - offset;
    }
    const isOptional = this instanceof pexprs.Opt;
    for (idx = 0; idx < cols.length; idx++) {
        state._bindings.push(new IterationNode(state.grammar, cols[idx], colOffsets[idx], matchLength, isOptional));
        state._bindingOffsets.push(offset);
    }
    return true;
};
pexprs.Not.prototype.eval = function (state) {
    /*
      TODO:
      - Right now we're just throwing away all of the failures that happen inside a `not`, and
        recording `this` as a failed expression.
      - Double negation should be equivalent to lookahead, but that's not the case right now wrt
        failures. E.g., ~~'foo' produces a failure for ~~'foo', but maybe it should produce
        a failure for 'foo' instead.
    */
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    state.pushFailuresInfo();
    const ans = state.eval(this.expr);
    state.popFailuresInfo();
    if (ans) {
        state.processFailure(origPos, this);
        return false;
    }
    inputStream.pos = origPos;
    return true;
};
pexprs.Lookahead.prototype.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    if (state.eval(this.expr)) {
        inputStream.pos = origPos;
        return true;
    }
    else {
        return false;
    }
};
pexprs.Apply.prototype.eval = function (state) {
    const caller = state.currentApplication();
    const actuals = caller ? caller.args : [];
    const app = this.substituteParams(actuals);
    const posInfo = state.getCurrentPosInfo();
    if (posInfo.isActive(app)) {
        // This rule is already active at this position, i.e., it is left-recursive.
        return app.handleCycle(state);
    }
    const memoKey = app.toMemoKey();
    const memoRec = posInfo.memo[memoKey];
    if (memoRec && posInfo.shouldUseMemoizedResult(memoRec)) {
        if (state.hasNecessaryInfo(memoRec)) {
            return state.useMemoizedResult(state.inputStream.pos, memoRec);
        }
        delete posInfo.memo[memoKey];
    }
    return app.reallyEval(state);
};
pexprs.Apply.prototype.handleCycle = function (state) {
    const posInfo = state.getCurrentPosInfo();
    const currentLeftRecursion = posInfo.currentLeftRecursion;
    const memoKey = this.toMemoKey();
    let memoRec = posInfo.memo[memoKey];
    if (currentLeftRecursion && currentLeftRecursion.headApplication.toMemoKey() === memoKey) {
        // We already know about this left recursion, but it's possible there are "involved
        // applications" that we don't already know about, so...
        memoRec.updateInvolvedApplicationMemoKeys();
    }
    else if (!memoRec) {
        // New left recursion detected! Memoize a failure to try to get a seed parse.
        memoRec = posInfo.memoize(memoKey, {
            matchLength: 0,
            examinedLength: 0,
            value: false,
            rightmostFailureOffset: -1
        });
        posInfo.startLeftRecursion(this, memoRec);
    }
    return state.useMemoizedResult(state.inputStream.pos, memoRec);
};
pexprs.Apply.prototype.reallyEval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const origPosInfo = state.getCurrentPosInfo();
    const ruleInfo = state.grammar.rules[this.ruleName];
    const body = ruleInfo.body;
    const description = ruleInfo.description;
    state.enterApplication(origPosInfo, this);
    if (description) {
        state.pushFailuresInfo();
    }
    // Reset the input stream's examinedLength property so that we can track
    // the examined length of this particular application.
    const origInputStreamExaminedLength = inputStream.examinedLength;
    inputStream.examinedLength = 0;
    let value = this.evalOnce(body, state);
    const currentLR = origPosInfo.currentLeftRecursion;
    const memoKey = this.toMemoKey();
    const isHeadOfLeftRecursion = currentLR && currentLR.headApplication.toMemoKey() === memoKey;
    let memoRec;
    if (isHeadOfLeftRecursion) {
        value = this.growSeedResult(body, state, origPos, currentLR, value);
        origPosInfo.endLeftRecursion();
        memoRec = currentLR;
        memoRec.examinedLength = inputStream.examinedLength - origPos;
        memoRec.rightmostFailureOffset = state._getRightmostFailureOffset();
        origPosInfo.memoize(memoKey, memoRec); // updates origPosInfo's maxExaminedLength
    }
    else if (!currentLR || !currentLR.isInvolved(memoKey)) {
        // This application is not involved in left recursion, so it's ok to memoize it.
        memoRec = origPosInfo.memoize(memoKey, {
            matchLength: inputStream.pos - origPos,
            examinedLength: inputStream.examinedLength - origPos,
            value,
            failuresAtRightmostPosition: state.cloneRecordedFailures(),
            rightmostFailureOffset: state._getRightmostFailureOffset()
        });
    }
    const succeeded = !!value;
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
        const entry = state.getTraceEntry(origPos, this, succeeded, succeeded ? [value] : []);
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
pexprs.Apply.prototype.evalOnce = function (expr, state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    if (state.eval(expr)) {
        const arity = expr.getArity();
        const bindings = state._bindings.splice(state._bindings.length - arity, arity);
        const offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
        return new NonterminalNode(state.grammar, this.ruleName, bindings, offsets, inputStream.pos - origPos);
    }
    else {
        return false;
    }
};
pexprs.Apply.prototype.growSeedResult = function (body, state, origPos, lrMemoRec, newValue) {
    if (!newValue) {
        return false;
    }
    const inputStream = state.inputStream;
    while (true) {
        lrMemoRec.matchLength = inputStream.pos - origPos;
        lrMemoRec.value = newValue;
        lrMemoRec.failuresAtRightmostPosition = state.cloneRecordedFailures();
        if (state.isTracing()) {
            // Before evaluating the body again, add a trace node for this application to the memo entry.
            // Its only child is a copy of the trace node from `newValue`, which will always be the last
            // element in `state.trace`.
            const seedTrace = state.trace[state.trace.length - 1];
            lrMemoRec.traceEntry = new Trace(state.input, origPos, inputStream.pos, this, true, [newValue], [seedTrace.clone()]);
        }
        inputStream.pos = origPos;
        newValue = this.evalOnce(body, state);
        if (inputStream.pos - origPos <= lrMemoRec.matchLength) {
            break;
        }
        if (state.isTracing()) {
            state.trace.splice(-2, 1); // Drop the trace for the old seed.
        }
    }
    if (state.isTracing()) {
        // The last entry is for an unused result -- pop it and save it in the "real" entry.
        lrMemoRec.traceEntry.recordLRTermination(state.trace.pop(), newValue);
    }
    inputStream.pos = origPos + lrMemoRec.matchLength;
    return lrMemoRec.value;
};
pexprs.UnicodeChar.prototype.eval = function (state) {
    const inputStream = state.inputStream;
    const origPos = inputStream.pos;
    const ch = inputStream.next();
    if (ch && this.pattern.test(ch)) {
        state.pushBinding(new TerminalNode(state.grammar, ch), origPos);
        return true;
    }
    else {
        state.processFailure(origPos, this);
        return false;
    }
};


/***/ }),

/***/ "./src/pexprs-getArity.js":
/*!********************************!*\
  !*** ./src/pexprs-getArity.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
                        pexprs.UnicodeChar.prototype.getArity =
                            function () {
                                return 1;
                            };
pexprs.Alt.prototype.getArity = function () {
    // This is ok b/c all terms must have the same arity -- this property is
    // checked by the Grammar constructor.
    return this.terms.length === 0 ? 0 : this.terms[0].getArity();
};
pexprs.Seq.prototype.getArity = function () {
    let arity = 0;
    for (let idx = 0; idx < this.factors.length; idx++) {
        arity += this.factors[idx].getArity();
    }
    return arity;
};
pexprs.Iter.prototype.getArity = function () {
    return this.expr.getArity();
};
pexprs.Not.prototype.getArity = function () {
    return 0;
};
pexprs.Lookahead.prototype.getArity = pexprs.Lex.prototype.getArity = function () {
    return this.expr.getArity();
};


/***/ }),

/***/ "./src/pexprs-introduceParams.js":
/*!***************************************!*\
  !*** ./src/pexprs-introduceParams.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
                    pexprs.UnicodeChar.prototype.introduceParams =
                        function (formals) {
                            return this;
                        };
pexprs.Alt.prototype.introduceParams = function (formals) {
    this.terms.forEach((term, idx, terms) => {
        terms[idx] = term.introduceParams(formals);
    });
    return this;
};
pexprs.Seq.prototype.introduceParams = function (formals) {
    this.factors.forEach((factor, idx, factors) => {
        factors[idx] = factor.introduceParams(formals);
    });
    return this;
};
pexprs.Iter.prototype.introduceParams =
    pexprs.Not.prototype.introduceParams =
        pexprs.Lookahead.prototype.introduceParams =
            pexprs.Lex.prototype.introduceParams =
                function (formals) {
                    this.expr = this.expr.introduceParams(formals);
                    return this;
                };
pexprs.Apply.prototype.introduceParams = function (formals) {
    const index = formals.indexOf(this.ruleName);
    if (index >= 0) {
        if (this.args.length > 0) {
            // TODO: Should this be supported? See issue #64.
            throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
        }
        return new pexprs.Param(index).withSource(this.source);
    }
    else {
        this.args.forEach((arg, idx, args) => {
            args[idx] = arg.introduceParams(formals);
        });
        return this;
    }
};


/***/ }),

/***/ "./src/pexprs-isNullable.js":
/*!**********************************!*\
  !*** ./src/pexprs-isNullable.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
// Returns `true` if this parsing expression may accept without consuming any input.
pexprs.PExpr.prototype.isNullable = function (grammar) {
    return this._isNullable(grammar, Object.create(null));
};
pexprs.PExpr.prototype._isNullable = common.abstract('_isNullable');
pexprs.any._isNullable =
    pexprs.Range.prototype._isNullable =
        pexprs.Param.prototype._isNullable =
            pexprs.Plus.prototype._isNullable =
                pexprs.UnicodeChar.prototype._isNullable =
                    function (grammar, memo) {
                        return false;
                    };
pexprs.end._isNullable = function (grammar, memo) {
    return true;
};
pexprs.Terminal.prototype._isNullable = function (grammar, memo) {
    if (typeof this.obj === 'string') {
        // This is an over-simplification: it's only correct if the input is a string. If it's an array
        // or an object, then the empty string parsing expression is not nullable.
        return this.obj === '';
    }
    else {
        return false;
    }
};
pexprs.Alt.prototype._isNullable = function (grammar, memo) {
    return this.terms.length === 0 || this.terms.some(term => term._isNullable(grammar, memo));
};
pexprs.Seq.prototype._isNullable = function (grammar, memo) {
    return this.factors.every(factor => factor._isNullable(grammar, memo));
};
pexprs.Star.prototype._isNullable =
    pexprs.Opt.prototype._isNullable =
        pexprs.Not.prototype._isNullable =
            pexprs.Lookahead.prototype._isNullable =
                function (grammar, memo) {
                    return true;
                };
pexprs.Lex.prototype._isNullable = function (grammar, memo) {
    return this.expr._isNullable(grammar, memo);
};
pexprs.Apply.prototype._isNullable = function (grammar, memo) {
    const key = this.toMemoKey();
    if (!Object.prototype.hasOwnProperty.call(memo, key)) {
        const body = grammar.rules[this.ruleName].body;
        const inlined = body.substituteParams(this.args);
        memo[key] = false; // Prevent infinite recursion for recursive rules.
        memo[key] = inlined._isNullable(grammar, memo);
    }
    return memo[key];
};


/***/ }),

/***/ "./src/pexprs-outputRecipe.js":
/*!************************************!*\
  !*** ./src/pexprs-outputRecipe.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function getMetaInfo(expr, grammarInterval) {
    const metaInfo = {};
    if (expr.source && grammarInterval) {
        const adjusted = expr.source.relativeTo(grammarInterval);
        metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
    }
    return metaInfo;
}
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
pexprs.PExpr.prototype.outputRecipe = common.abstract('outputRecipe');
pexprs.any.outputRecipe = function (formals, grammarInterval) {
    return ['any', getMetaInfo(this, grammarInterval)];
};
pexprs.end.outputRecipe = function (formals, grammarInterval) {
    return ['end', getMetaInfo(this, grammarInterval)];
};
pexprs.Terminal.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['terminal', getMetaInfo(this, grammarInterval), this.obj];
};
pexprs.Range.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['range', getMetaInfo(this, grammarInterval), this.from, this.to];
};
pexprs.Param.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['param', getMetaInfo(this, grammarInterval), this.index];
};
pexprs.Alt.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['alt', getMetaInfo(this, grammarInterval)].concat(this.terms.map(term => term.outputRecipe(formals, grammarInterval)));
};
pexprs.Extend.prototype.outputRecipe = function (formals, grammarInterval) {
    const extension = this.terms[0]; // [extension, original]
    return extension.outputRecipe(formals, grammarInterval);
};
pexprs.Splice.prototype.outputRecipe = function (formals, grammarInterval) {
    const beforeTerms = this.terms.slice(0, this.expansionPos);
    const afterTerms = this.terms.slice(this.expansionPos + 1);
    return [
        'splice',
        getMetaInfo(this, grammarInterval),
        beforeTerms.map(term => term.outputRecipe(formals, grammarInterval)),
        afterTerms.map(term => term.outputRecipe(formals, grammarInterval))
    ];
};
pexprs.Seq.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['seq', getMetaInfo(this, grammarInterval)].concat(this.factors.map(factor => factor.outputRecipe(formals, grammarInterval)));
};
pexprs.Star.prototype.outputRecipe =
    pexprs.Plus.prototype.outputRecipe =
        pexprs.Opt.prototype.outputRecipe =
            pexprs.Not.prototype.outputRecipe =
                pexprs.Lookahead.prototype.outputRecipe =
                    pexprs.Lex.prototype.outputRecipe =
                        function (formals, grammarInterval) {
                            return [
                                this.constructor.name.toLowerCase(),
                                getMetaInfo(this, grammarInterval),
                                this.expr.outputRecipe(formals, grammarInterval)
                            ];
                        };
pexprs.Apply.prototype.outputRecipe = function (formals, grammarInterval) {
    return [
        'app',
        getMetaInfo(this, grammarInterval),
        this.ruleName,
        this.args.map(arg => arg.outputRecipe(formals, grammarInterval))
    ];
};
pexprs.UnicodeChar.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['unicodeChar', getMetaInfo(this, grammarInterval), this.category];
};


/***/ }),

/***/ "./src/pexprs-substituteParams.js":
/*!****************************************!*\
  !*** ./src/pexprs-substituteParams.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
                pexprs.UnicodeChar.prototype.substituteParams =
                    function (actuals) {
                        return this;
                    };
pexprs.Param.prototype.substituteParams = function (actuals) {
    return actuals[this.index];
};
pexprs.Alt.prototype.substituteParams = function (actuals) {
    return new pexprs.Alt(this.terms.map(term => term.substituteParams(actuals)));
};
pexprs.Seq.prototype.substituteParams = function (actuals) {
    return new pexprs.Seq(this.factors.map(factor => factor.substituteParams(actuals)));
};
pexprs.Iter.prototype.substituteParams =
    pexprs.Not.prototype.substituteParams =
        pexprs.Lookahead.prototype.substituteParams =
            pexprs.Lex.prototype.substituteParams =
                function (actuals) {
                    return new this.constructor(this.expr.substituteParams(actuals));
                };
pexprs.Apply.prototype.substituteParams = function (actuals) {
    if (this.args.length === 0) {
        // Avoid making a copy of this application, as an optimization
        return this;
    }
    else {
        const args = this.args.map(arg => arg.substituteParams(actuals));
        return new pexprs.Apply(this.ruleName, args);
    }
};


/***/ }),

/***/ "./src/pexprs-toArgumentNameList.js":
/*!******************************************!*\
  !*** ./src/pexprs-toArgumentNameList.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
const { copyWithoutDuplicates } = common;
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function isRestrictedJSIdentifier(str) {
    return /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(str);
}
function resolveDuplicatedNames(argumentNameList) {
    // `count` is used to record the number of times each argument name occurs in the list,
    // this is useful for checking duplicated argument name. It maps argument names to ints.
    const count = Object.create(null);
    argumentNameList.forEach(argName => {
        count[argName] = (count[argName] || 0) + 1;
    });
    // Append subscripts ('_1', '_2', ...) to duplicate argument names.
    Object.keys(count).forEach(dupArgName => {
        if (count[dupArgName] <= 1) {
            return;
        }
        // This name shows up more than once, so add subscripts.
        let subscript = 1;
        argumentNameList.forEach((argName, idx) => {
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
pexprs.any.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return ['any'];
};
pexprs.end.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return ['end'];
};
pexprs.Terminal.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    if (typeof this.obj === 'string' && /^[_a-zA-Z0-9]+$/.test(this.obj)) {
        // If this terminal is a valid suffix for a JS identifier, just prepend it with '_'
        return ['_' + this.obj];
    }
    else {
        // Otherwise, name it positionally.
        return ['$' + firstArgIndex];
    }
};
pexprs.Range.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    let argName = this.from + '_to_' + this.to;
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
pexprs.Alt.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    // `termArgNameLists` is an array of arrays where each row is the
    // argument name list that corresponds to a term in this alternation.
    const termArgNameLists = this.terms.map(term => term.toArgumentNameList(firstArgIndex, true));
    const argumentNameList = [];
    const numArgs = termArgNameLists[0].length;
    for (let colIdx = 0; colIdx < numArgs; colIdx++) {
        const col = [];
        for (let rowIdx = 0; rowIdx < this.terms.length; rowIdx++) {
            col.push(termArgNameLists[rowIdx][colIdx]);
        }
        const uniqueNames = copyWithoutDuplicates(col);
        argumentNameList.push(uniqueNames.join('_or_'));
    }
    if (!noDupCheck) {
        resolveDuplicatedNames(argumentNameList);
    }
    return argumentNameList;
};
pexprs.Seq.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    // Generate the argument name list, without worrying about duplicates.
    let argumentNameList = [];
    this.factors.forEach(factor => {
        const factorArgumentNameList = factor.toArgumentNameList(firstArgIndex, true);
        argumentNameList = argumentNameList.concat(factorArgumentNameList);
        // Shift the firstArgIndex to take this factor's argument names into account.
        firstArgIndex += factorArgumentNameList.length;
    });
    if (!noDupCheck) {
        resolveDuplicatedNames(argumentNameList);
    }
    return argumentNameList;
};
pexprs.Iter.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    const argumentNameList = this.expr
        .toArgumentNameList(firstArgIndex, noDupCheck)
        .map(exprArgumentString => exprArgumentString[exprArgumentString.length - 1] === 's'
        ? exprArgumentString + 'es'
        : exprArgumentString + 's');
    if (!noDupCheck) {
        resolveDuplicatedNames(argumentNameList);
    }
    return argumentNameList;
};
pexprs.Opt.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(argName => {
        return 'opt' + argName[0].toUpperCase() + argName.slice(1);
    });
};
pexprs.Not.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return [];
};
pexprs.Lookahead.prototype.toArgumentNameList = pexprs.Lex.prototype.toArgumentNameList =
    function (firstArgIndex, noDupCheck) {
        return this.expr.toArgumentNameList(firstArgIndex, noDupCheck);
    };
pexprs.Apply.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return [this.ruleName];
};
pexprs.UnicodeChar.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return ['$' + firstArgIndex];
};
pexprs.Param.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return ['param' + this.index];
};


/***/ }),

/***/ "./src/pexprs-toDisplayString.js":
/*!***************************************!*\
  !*** ./src/pexprs-toDisplayString.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
// Returns a string representing the PExpr, for use as a UI label, etc.
pexprs.PExpr.prototype.toDisplayString = common.abstract('toDisplayString');
pexprs.Alt.prototype.toDisplayString = pexprs.Seq.prototype.toDisplayString = function () {
    if (this.source) {
        return this.source.trimmed().contents;
    }
    return '[' + this.constructor.name + ']';
};
pexprs.any.toDisplayString =
    pexprs.end.toDisplayString =
        pexprs.Iter.prototype.toDisplayString =
            pexprs.Not.prototype.toDisplayString =
                pexprs.Lookahead.prototype.toDisplayString =
                    pexprs.Lex.prototype.toDisplayString =
                        pexprs.Terminal.prototype.toDisplayString =
                            pexprs.Range.prototype.toDisplayString =
                                pexprs.Param.prototype.toDisplayString =
                                    function () {
                                        return this.toString();
                                    };
pexprs.Apply.prototype.toDisplayString = function () {
    if (this.args.length > 0) {
        const ps = this.args.map(arg => arg.toDisplayString());
        return this.ruleName + '<' + ps.join(',') + '>';
    }
    else {
        return this.ruleName;
    }
};
pexprs.UnicodeChar.prototype.toDisplayString = function () {
    return 'Unicode [' + this.category + '] character';
};


/***/ }),

/***/ "./src/pexprs-toFailure.js":
/*!*********************************!*\
  !*** ./src/pexprs-toFailure.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const Failure = __webpack_require__(/*! ./Failure */ "./src/Failure.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
pexprs.PExpr.prototype.toFailure = common.abstract('toFailure');
pexprs.any.toFailure = function (grammar) {
    return new Failure(this, 'any object', 'description');
};
pexprs.end.toFailure = function (grammar) {
    return new Failure(this, 'end of input', 'description');
};
pexprs.Terminal.prototype.toFailure = function (grammar) {
    return new Failure(this, this.obj, 'string');
};
pexprs.Range.prototype.toFailure = function (grammar) {
    // TODO: come up with something better
    return new Failure(this, JSON.stringify(this.from) + '..' + JSON.stringify(this.to), 'code');
};
pexprs.Not.prototype.toFailure = function (grammar) {
    const description = this.expr === pexprs.any ? 'nothing' : 'not ' + this.expr.toFailure(grammar);
    return new Failure(this, description, 'description');
};
pexprs.Lookahead.prototype.toFailure = function (grammar) {
    return this.expr.toFailure(grammar);
};
pexprs.Apply.prototype.toFailure = function (grammar) {
    let description = grammar.rules[this.ruleName].description;
    if (!description) {
        const article = /^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a';
        description = article + ' ' + this.ruleName;
    }
    return new Failure(this, description, 'description');
};
pexprs.UnicodeChar.prototype.toFailure = function (grammar) {
    return new Failure(this, 'a Unicode [' + this.category + '] character', 'description');
};
pexprs.Alt.prototype.toFailure = function (grammar) {
    const fs = this.terms.map(t => t.toFailure(grammar));
    const description = '(' + fs.join(' or ') + ')';
    return new Failure(this, description, 'description');
};
pexprs.Seq.prototype.toFailure = function (grammar) {
    const fs = this.factors.map(f => f.toFailure(grammar));
    const description = '(' + fs.join(' ') + ')';
    return new Failure(this, description, 'description');
};
pexprs.Iter.prototype.toFailure = function (grammar) {
    const description = '(' + this.expr.toFailure(grammar) + this.operator + ')';
    return new Failure(this, description, 'description');
};


/***/ }),

/***/ "./src/pexprs-toString.js":
/*!********************************!*\
  !*** ./src/pexprs-toString.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
const pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
pexprs.any.toString = function () {
    return 'any';
};
pexprs.end.toString = function () {
    return 'end';
};
pexprs.Terminal.prototype.toString = function () {
    return JSON.stringify(this.obj);
};
pexprs.Range.prototype.toString = function () {
    return JSON.stringify(this.from) + '..' + JSON.stringify(this.to);
};
pexprs.Param.prototype.toString = function () {
    return '$' + this.index;
};
pexprs.Lex.prototype.toString = function () {
    return '#(' + this.expr.toString() + ')';
};
pexprs.Alt.prototype.toString = function () {
    return this.terms.length === 1
        ? this.terms[0].toString()
        : '(' + this.terms.map(term => term.toString()).join(' | ') + ')';
};
pexprs.Seq.prototype.toString = function () {
    return this.factors.length === 1
        ? this.factors[0].toString()
        : '(' + this.factors.map(factor => factor.toString()).join(' ') + ')';
};
pexprs.Iter.prototype.toString = function () {
    return this.expr + this.operator;
};
pexprs.Not.prototype.toString = function () {
    return '~' + this.expr;
};
pexprs.Lookahead.prototype.toString = function () {
    return '&' + this.expr;
};
pexprs.Apply.prototype.toString = function () {
    if (this.args.length > 0) {
        const ps = this.args.map(arg => arg.toString());
        return this.ruleName + '<' + ps.join(',') + '>';
    }
    else {
        return this.ruleName;
    }
};
pexprs.UnicodeChar.prototype.toString = function () {
    return '\\p{' + this.category + '}';
};


/***/ }),

/***/ "./src/pexprs.js":
/*!***********************!*\
  !*** ./src/pexprs.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const UnicodeCategories = __webpack_require__(/*! ../third_party/UnicodeCategories */ "./third_party/UnicodeCategories.js");
const common = __webpack_require__(/*! ./common */ "./src/common.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// General stuff
class PExpr {
    constructor() {
        if (this.constructor === PExpr) {
            throw new Error("PExpr cannot be instantiated -- it's abstract");
        }
    }
    // Set the `source` property to the interval containing the source for this expression.
    withSource(interval) {
        if (interval) {
            this.source = interval.trimmed();
        }
        return this;
    }
}
// Any
const any = Object.create(PExpr.prototype);
// End
const end = Object.create(PExpr.prototype);
// Terminals
class Terminal extends PExpr {
    constructor(obj) {
        super();
        this.obj = obj;
    }
}
// Ranges
class Range extends PExpr {
    constructor(from, to) {
        super();
        this.from = from;
        this.to = to;
    }
}
// Parameters
class Param extends PExpr {
    constructor(index) {
        super();
        this.index = index;
    }
}
// Alternation
class Alt extends PExpr {
    constructor(terms) {
        super();
        this.terms = terms;
    }
}
// Extend is an implementation detail of rule extension
class Extend extends Alt {
    constructor(superGrammar, name, body) {
        const origBody = superGrammar.rules[name].body;
        super([body, origBody]);
        this.superGrammar = superGrammar;
        this.name = name;
        this.body = body;
    }
}
// Splice is an implementation detail of rule overriding with the `...` operator.
class Splice extends Alt {
    constructor(superGrammar, ruleName, beforeTerms, afterTerms) {
        const origBody = superGrammar.rules[ruleName].body;
        super([...beforeTerms, origBody, ...afterTerms]);
        this.superGrammar = superGrammar;
        this.ruleName = ruleName;
        this.expansionPos = beforeTerms.length;
    }
}
// Sequences
class Seq extends PExpr {
    constructor(factors) {
        super();
        this.factors = factors;
    }
}
// Iterators and optionals
class Iter extends PExpr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}
class Star extends Iter {
}
class Plus extends Iter {
}
class Opt extends Iter {
}
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
class Not extends PExpr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}
class Lookahead extends PExpr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}
// "Lexification"
class Lex extends PExpr {
    constructor(expr) {
        super();
        this.expr = expr;
    }
}
// Rule application
class Apply extends PExpr {
    constructor(ruleName, args = []) {
        super();
        this.ruleName = ruleName;
        this.args = args;
    }
    isSyntactic() {
        return common.isSyntactic(this.ruleName);
    }
    // This method just caches the result of `this.toString()` in a non-enumerable property.
    toMemoKey() {
        if (!this._memoKey) {
            Object.defineProperty(this, '_memoKey', { value: this.toString() });
        }
        return this._memoKey;
    }
}
// Unicode character
class UnicodeChar extends PExpr {
    constructor(category) {
        super();
        this.category = category;
        this.pattern = UnicodeCategories[category];
    }
}
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
exports.Splice = Splice;
exports.Seq = Seq;
exports.Iter = Iter;
exports.Star = Star;
exports.Plus = Plus;
exports.Opt = Opt;
exports.Not = Not;
exports.Lookahead = Lookahead;
exports.Lex = Lex;
exports.Apply = Apply;
exports.UnicodeChar = UnicodeChar;
// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------
__webpack_require__(/*! ./pexprs-allowsSkippingPrecedingSpace */ "./src/pexprs-allowsSkippingPrecedingSpace.js");
__webpack_require__(/*! ./pexprs-assertAllApplicationsAreValid */ "./src/pexprs-assertAllApplicationsAreValid.js");
__webpack_require__(/*! ./pexprs-assertChoicesHaveUniformArity */ "./src/pexprs-assertChoicesHaveUniformArity.js");
__webpack_require__(/*! ./pexprs-assertIteratedExprsAreNotNullable */ "./src/pexprs-assertIteratedExprsAreNotNullable.js");
__webpack_require__(/*! ./pexprs-eval */ "./src/pexprs-eval.js");
__webpack_require__(/*! ./pexprs-getArity */ "./src/pexprs-getArity.js");
__webpack_require__(/*! ./pexprs-outputRecipe */ "./src/pexprs-outputRecipe.js");
__webpack_require__(/*! ./pexprs-introduceParams */ "./src/pexprs-introduceParams.js");
__webpack_require__(/*! ./pexprs-isNullable */ "./src/pexprs-isNullable.js");
__webpack_require__(/*! ./pexprs-substituteParams */ "./src/pexprs-substituteParams.js");
__webpack_require__(/*! ./pexprs-toArgumentNameList */ "./src/pexprs-toArgumentNameList.js");
__webpack_require__(/*! ./pexprs-toDisplayString */ "./src/pexprs-toDisplayString.js");
__webpack_require__(/*! ./pexprs-toFailure */ "./src/pexprs-toFailure.js");
__webpack_require__(/*! ./pexprs-toString */ "./src/pexprs-toString.js");


/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
const common = __webpack_require__(/*! ./common */ "./src/common.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function padNumbersToEqualLength(arr) {
    let maxLen = 0;
    const strings = arr.map(n => {
        const str = n.toString();
        maxLen = Math.max(maxLen, str.length);
        return str;
    });
    return strings.map(s => common.padLeft(s, maxLen));
}
// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function strcpy(dest, src, offset) {
    const origDestLen = dest.length;
    const start = dest.slice(0, offset);
    const end = dest.slice(offset + src.length);
    return (start + src + end).substr(0, origDestLen);
}
// Casts the underlying lineAndCol object to a formatted message string,
// highlighting `ranges`.
function lineAndColumnToMessage(...ranges) {
    const lineAndCol = this;
    const offset = lineAndCol.offset;
    const repeatStr = common.repeatStr;
    const sb = new common.StringBuffer();
    sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n');
    // An array of the previous, current, and next line numbers as strings of equal length.
    const lineNumbers = padNumbersToEqualLength([
        lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
        lineAndCol.lineNum,
        lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
    ]);
    // Helper for appending formatting input lines to the buffer.
    const appendLine = (num, content, prefix) => {
        sb.append(prefix + lineNumbers[num] + ' | ' + content + '\n');
    };
    // Include the previous line for context if possible.
    if (lineAndCol.prevLine != null) {
        appendLine(0, lineAndCol.prevLine, '  ');
    }
    // Line that the error occurred on.
    appendLine(1, lineAndCol.line, '> ');
    // Build up the line that points to the offset and possible indicates one or more ranges.
    // Start with a blank line, and indicate each range by overlaying a string of `~` chars.
    const lineLen = lineAndCol.line.length;
    let indicationLine = repeatStr(' ', lineLen + 1);
    for (let i = 0; i < ranges.length; ++i) {
        let startIdx = ranges[i][0];
        let endIdx = ranges[i][1];
        common.assert(startIdx >= 0 && startIdx <= endIdx, 'range start must be >= 0 and <= end');
        const lineStartOffset = offset - lineAndCol.colNum + 1;
        startIdx = Math.max(0, startIdx - lineStartOffset);
        endIdx = Math.min(endIdx - lineStartOffset, lineLen);
        indicationLine = strcpy(indicationLine, repeatStr('~', endIdx - startIdx), startIdx);
    }
    const gutterWidth = 2 + lineNumbers[1].length + 3;
    sb.append(repeatStr(' ', gutterWidth));
    indicationLine = strcpy(indicationLine, '^', lineAndCol.colNum - 1);
    sb.append(indicationLine.replace(/ +$/, '') + '\n');
    // Include the next line for context if possible.
    if (lineAndCol.nextLine != null) {
        appendLine(2, lineAndCol.nextLine, '  ');
    }
    return sb.contents();
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
let builtInRulesCallbacks = [];
// Since Grammar.BuiltInRules is bootstrapped, most of Ohm can't directly depend it.
// This function allows modules that do depend on the built-in rules to register a callback
// that will be called later in the initialization process.
exports.awaitBuiltInRules = cb => {
    builtInRulesCallbacks.push(cb);
};
exports.announceBuiltInRules = grammar => {
    builtInRulesCallbacks.forEach(cb => {
        cb(grammar);
    });
    builtInRulesCallbacks = null;
};
// Return an object with the line and column information for the given
// offset in `str`.
exports.getLineAndColumn = (str, offset) => {
    let lineNum = 1;
    let colNum = 1;
    let currOffset = 0;
    let lineStartOffset = 0;
    let nextLine = null;
    let prevLine = null;
    let prevLineStartOffset = -1;
    while (currOffset < offset) {
        const c = str.charAt(currOffset++);
        if (c === '\n') {
            lineNum++;
            colNum = 1;
            prevLineStartOffset = lineStartOffset;
            lineStartOffset = currOffset;
        }
        else if (c !== '\r') {
            colNum++;
        }
    }
    // Find the end of the target line.
    let lineEndOffset = str.indexOf('\n', lineStartOffset);
    if (lineEndOffset === -1) {
        lineEndOffset = str.length;
    }
    else {
        // Get the next line.
        const nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
        nextLine =
            nextLineEndOffset === -1
                ? str.slice(lineEndOffset)
                : str.slice(lineEndOffset, nextLineEndOffset);
        // Strip leading and trailing EOL char(s).
        nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
    }
    // Get the previous line.
    if (prevLineStartOffset >= 0) {
        // Strip trailing EOL char(s).
        prevLine = str.slice(prevLineStartOffset, lineStartOffset).replace(/\r?\n$/, '');
    }
    // Get the target line, stripping a trailing carriage return if necessary.
    const line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');
    return {
        offset,
        lineNum,
        colNum,
        line,
        prevLine,
        nextLine,
        toString: lineAndColumnToMessage
    };
};
// Return a nicely-formatted string describing the line and column for the
// given offset in `str` highlighting `ranges`.
exports.getLineAndColumnMessage = function (str, offset, ...ranges) {
    return exports.getLineAndColumn(str, offset).toString(...ranges);
};
exports.uniqueId = (() => {
    let idCounter = 0;
    return prefix => '' + prefix + idCounter++;
})();


/***/ }),

/***/ "./src/version.js":
/*!************************!*\
  !*** ./src/version.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* global __GLOBAL_OHM_VERSION__ */

// When running under Node, read the version from package.json. For the browser,
// use a special global variable defined in the build process (see webpack.config.js).
module.exports =
     true
        ? "15.5.0"
        : undefined;


/***/ }),

/***/ "./third_party/UnicodeCategories.js":
/*!******************************************!*\
  !*** ./third_party/UnicodeCategories.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vaG0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL29obS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vaG0vLi4vbm9kZV9tb2R1bGVzL3V0aWwtZXh0ZW5kL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9kaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwid2VicGFjazovL29obS8uL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29obS8uL2V4dHJhcy9WaXNpdG9yRmFtaWx5LmpzIiwid2VicGFjazovL29obS8uL2V4dHJhcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9leHRyYXMvc2VtYW50aWNzLXRvQVNULmpzIiwid2VicGFjazovL29obS8uL25vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0J1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLmpzIiwid2VicGFjazovL29obS8uL3NyYy9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9HcmFtbWFyLmpzIiwid2VicGFjazovL29obS8uL3NyYy9HcmFtbWFyRGVjbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvSW5wdXRTdHJlYW0uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0ludGVydmFsLmpzIiwid2VicGFjazovL29obS8uL3NyYy9NYXRjaFJlc3VsdC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hTdGF0ZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hlci5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTmFtZXNwYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9Qb3NJbmZvLmpzIiwid2VicGFjazovL29obS8uL3NyYy9TZW1hbnRpY3MuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL1RyYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvbm9kZXMuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWV2YWwuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZXRBcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWludHJvZHVjZVBhcmFtcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1zdWJzdGl0dXRlUGFyYW1zLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0LmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi90aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2hDQSxVQUFVLG1CQUFPLENBQUMseUJBQUk7QUFDdEIsNENBQTRDLHdCQUF3Qiw4b0JBQThvQixFQUFFLDJCQUEyQixtQkFBbUIseUJBQXlCLHlDQUF5Qyx5QkFBeUIsU0FBUyx5QkFBeUIsc0JBQXNCLHlCQUF5QixtQ0FBbUMsMEJBQTBCLHVCQUF1QiwyQkFBMkIsU0FBUywyQkFBMkIscUJBQXFCLDJCQUEyQixxQkFBcUIsMkJBQTJCLHdDQUF3QywyQkFBMkIsd0JBQXdCLDJCQUEyQixpQ0FBaUMsMkJBQTJCLGtDQUFrQywyQkFBMkIsU0FBUywyQkFBMkIsdUJBQXVCLDJCQUEyQixvQkFBb0IsMkJBQTJCLGdDQUFnQywyQkFBMkIsNkJBQTZCLDJCQUEyQixTQUFTLDJCQUEyQiw2QkFBNkIsMkJBQTJCLGNBQWMsMkJBQTJCLGNBQWMsMkJBQTJCLDBCQUEwQiwyQkFBMkIsY0FBYywyQkFBMkIsb0NBQW9DLDJCQUEyQiw2QkFBNkIsMkJBQTJCLFdBQVcsMkJBQTJCLGFBQWEsMkJBQTJCLFNBQVMsMkJBQTJCLFdBQVcsMkJBQTJCLGNBQWMsMkJBQTJCLGlDQUFpQywyQkFBMkIsNkJBQTZCLDJCQUEyQix1QkFBdUIsMkJBQTJCLDZCQUE2QiwyQkFBMkIsU0FBUywyQkFBMkIsNkJBQTZCLDJCQUEyQixjQUFjLDJCQUEyQixjQUFjLDJCQUEyQiwwQkFBMEIsMkJBQTJCLGNBQWMsMkJBQTJCLG9DQUFvQywyQkFBMkIsNkJBQTZCLDJCQUEyQixXQUFXLDJCQUEyQixhQUFhLDJCQUEyQixTQUFTLDJCQUEyQixXQUFXLDJCQUEyQixjQUFjLDJCQUEyQixpQ0FBaUMsMkJBQTJCLDZCQUE2QiwyQkFBMkIsR0FBRzs7Ozs7Ozs7Ozs7O0FDRHJtRyxVQUFVLG1CQUFPLENBQUMseUJBQUk7QUFDdEIsNENBQTRDLGVBQWUsMEVBQTBFLFlBQVksaTNDQUFpM0MsZzRDQUFnNEMsRUFBRSx3QkFBd0Isc0JBQXNCLHdCQUF3QixrQkFBa0IseUJBQXlCLFNBQVMseUJBQXlCLHNDQUFzQyx5QkFBeUIsaUJBQWlCLHlCQUF5QixTQUFTLHlCQUF5QixxQkFBcUIseUJBQXlCLFNBQVMseUJBQXlCLGtDQUFrQyx5QkFBeUIsR0FBRyxZQUFZLHlCQUF5QixTQUFTLHlCQUF5QiwwQkFBMEIseUJBQXlCLEdBQUcsK0JBQStCLDBCQUEwQixpQkFBaUIsMkJBQTJCLGNBQWMsMkJBQTJCLGVBQWUsMkJBQTJCLHdDQUF3QywyQkFBMkIsaUJBQWlCLDJCQUEyQixTQUFTLDJCQUEyQixxQkFBcUIsMkJBQTJCLFNBQVMsMkJBQTJCLHdCQUF3QiwyQkFBMkIsU0FBUywyQkFBMkIsK0JBQStCLDJCQUEyQixjQUFjLDJCQUEyQiw2Q0FBNkMsMkJBQTJCLGlCQUFpQiwyQkFBMkIsU0FBUywyQkFBMkIscUJBQXFCLDJCQUEyQixTQUFTLDJCQUEyQiw2QkFBNkIsMkJBQTJCLGVBQWUsMkJBQTJCLG1EQUFtRCwyQkFBMkIsaUJBQWlCLDJCQUEyQixTQUFTLDJCQUEyQixxQkFBcUIsMkJBQTJCLFNBQVMsMkJBQTJCLDZCQUE2QiwyQkFBMkIsZUFBZSwyQkFBMkIsb0NBQW9DLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLDJCQUEyQiwyQkFBMkIsNkJBQTZCLDJCQUEyQiwyQ0FBMkMsMkJBQTJCLGlCQUFpQiwyQkFBMkIsU0FBUywyQkFBMkIsY0FBYywyQkFBMkIsZUFBZSwyQkFBMkIsMkJBQTJCLDJCQUEyQixpQ0FBaUMsMkJBQTJCLDJDQUEyQywyQkFBMkIsaUJBQWlCLDJCQUEyQixTQUFTLDJCQUEyQixtQkFBbUIsMkJBQTJCLDRDQUE0QywyQkFBMkIsaUJBQWlCLDJCQUEyQixTQUFTLDJCQUEyQixtQ0FBbUMsMkJBQTJCLDJDQUEyQywyQkFBMkIsaUJBQWlCLDJCQUEyQixTQUFTLDJCQUEyQixjQUFjLDJCQUEyQixlQUFlLDJCQUEyQiwyQkFBMkIsMkJBQTJCLHlDQUF5QywyQkFBMkIsd0RBQXdELDJCQUEyQixzQkFBc0IsMkJBQTJCLDJDQUEyQywyQkFBMkIsaUJBQWlCLDJCQUEyQixTQUFTLDJCQUEyQixnREFBZ0QsMkJBQTJCLDJDQUEyQywyQkFBMkIsaUJBQWlCLDJCQUEyQixjQUFjLDJCQUEyQixjQUFjLDJCQUEyQixtQkFBbUIsMkJBQTJCLDBCQUEwQiwyQkFBMkIscUJBQXFCLDJCQUEyQiw0QkFBNEIsMkJBQTJCLGlCQUFpQiwyQkFBMkIsY0FBYywyQkFBMkIsY0FBYywyQkFBMkIsbUJBQW1CLDJCQUEyQix3QkFBd0IsMkJBQTJCLHFCQUFxQiwyQkFBMkIseUJBQXlCLDJCQUEyQixpQkFBaUIsMkJBQTJCLDJCQUEyQiwyQkFBMkIsd0JBQXdCLDJCQUEyQiwwQkFBMEIsMkJBQTJCLGtCQUFrQiwyQkFBMkIsU0FBUywyQkFBMkIscUNBQXFDLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHlCQUF5QiwyQkFBMkIsK0JBQStCLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHlCQUF5QiwyQkFBMkIsOEJBQThCLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHlCQUF5QiwyQkFBMkIsMEJBQTBCLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHlCQUF5QiwyQkFBMkIseUJBQXlCLDJCQUEyQix3QkFBd0IsMkJBQTJCLG9DQUFvQywyQkFBMkIsaUJBQWlCLDJCQUEyQixjQUFjLDJCQUEyQixjQUFjLDJCQUEyQix5Q0FBeUMsMkJBQTJCLGlCQUFpQiwyQkFBMkIsY0FBYywyQkFBMkIsY0FBYywyQkFBMkIsK0JBQStCLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHdCQUF3QiwyQkFBMkIsOEJBQThCLDJCQUEyQixrQ0FBa0MsMkJBQTJCLGlCQUFpQiwyQkFBMkIsY0FBYywyQkFBMkIsY0FBYywyQkFBMkIsK0JBQStCLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHVCQUF1QiwyQkFBMkIsNENBQTRDLDJCQUEyQixpQkFBaUIsMkJBQTJCLFNBQVMsMkJBQTJCLHFCQUFxQiwyQkFBMkIsU0FBUywyQkFBMkIsdUJBQXVCLDJCQUEyQixTQUFTLDJCQUEyQixTQUFTLDJCQUEyQixTQUFTLDJCQUEyQixTQUFTLDJCQUEyQiwrQkFBK0IsMkJBQTJCLG9CQUFvQiwyQkFBMkIsb0JBQW9CLDJCQUEyQixtQ0FBbUMsNEJBQTRCLGlCQUFpQiw0QkFBNEIsU0FBUyw0QkFBNEIsb0NBQW9DLDZCQUE2QixlQUFlLDZCQUE2QixvREFBb0QsNkJBQTZCLGlCQUFpQiw2QkFBNkIseUNBQXlDLDZCQUE2QixpQkFBaUIsNkJBQTZCLGNBQWMsNkJBQTZCLGNBQWMsNkJBQTZCLHdCQUF3Qiw2QkFBNkIsMEJBQTBCLDRCQUE0QixpQkFBaUIsNEJBQTRCLFNBQVMsMkJBQTJCLGdDQUFnQyw0QkFBNEIsMEJBQTBCLDZCQUE2Qiw2QkFBNkIsNkJBQTZCLDJDQUEyQyw2QkFBNkIsaUNBQWlDLDZCQUE2QixjQUFjLDZCQUE2QixjQUFjLDZCQUE2QixrQ0FBa0MsNkJBQTZCLG1DQUFtQyw2QkFBNkIsa0JBQWtCLDZCQUE2QixTQUFTLDZCQUE2QixTQUFTLDZCQUE2QixjQUFjLDZCQUE2QixlQUFlLDZCQUE2QixvQ0FBb0MsNkJBQTZCLGlCQUFpQiw2QkFBNkIsY0FBYyw2QkFBNkIsZ0JBQWdCLDZCQUE2QixTQUFTLDZCQUE2QixTQUFTLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLHVCQUF1Qiw2QkFBNkIscUJBQXFCLDZCQUE2QixTQUFTLDZCQUE2QixTQUFTLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLHVCQUF1Qiw2QkFBNkIsY0FBYyw2QkFBNkIscUJBQXFCLDZCQUE2QixjQUFjLDZCQUE2QixHQUFHLHlCQUF5Qiw2QkFBNkIscUJBQXFCLDZCQUE2QixTQUFTLDZCQUE2QiwwQkFBMEIsNkJBQTZCLFNBQVMsNkJBQTZCLDBDQUEwQyw2QkFBNkIsaUJBQWlCLDZCQUE2QixjQUFjLDZCQUE2QixjQUFjLDZCQUE2QixzQ0FBc0MsNkJBQTZCLGlCQUFpQiw2QkFBNkIsY0FBYyw2QkFBNkIsY0FBYyw2QkFBNkIsa0NBQWtDLDZCQUE2Qiw0QkFBNEIsNkJBQTZCLG1DQUFtQyw2QkFBNkIsaUJBQWlCLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLFNBQVMsNkJBQTZCLGtDQUFrQyw2QkFBNkIsc0NBQXNDLDZCQUE2QixpQkFBaUIsNkJBQTZCLGNBQWMsNkJBQTZCLGVBQWUsNkJBQTZCLGlDQUFpQyw2QkFBNkIsbUNBQW1DLDZCQUE2QixpQkFBaUIsNkJBQTZCLFNBQVMsNkJBQTZCLDBCQUEwQiw2QkFBNkIsU0FBUyw2QkFBNkIsY0FBYyw2QkFBNkIsZ0JBQWdCLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLGNBQWMsNkJBQTZCLGdCQUFnQiw2QkFBNkIsZ0RBQWdELDZCQUE2QixzQkFBc0IsNkJBQTZCLDhDQUE4Qyw2QkFBNkIsc0JBQXNCLDZCQUE2Qiw4Q0FBOEMsNkJBQTZCLHNCQUFzQiw2QkFBNkIsMkNBQTJDLDZCQUE2QixzQkFBc0IsNkJBQTZCLDBDQUEwQyw2QkFBNkIsc0JBQXNCLDZCQUE2QixnREFBZ0QsNkJBQTZCLHNCQUFzQiw2QkFBNkIscUNBQXFDLDZCQUE2QixzQkFBc0IsNkJBQTZCLCtDQUErQyw2QkFBNkIsaUJBQWlCLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLHdCQUF3Qiw2QkFBNkIsd0JBQXdCLDZCQUE2Qix3QkFBd0IsNkJBQTZCLG9EQUFvRCw2QkFBNkIsaUJBQWlCLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLHdCQUF3Qiw2QkFBNkIsMENBQTBDLDZCQUE2QixpQ0FBaUMsNkJBQTZCLFNBQVMsNkJBQTZCLG9DQUFvQyw2QkFBNkIsc0NBQXNDLDZCQUE2QixzQ0FBc0MsNkJBQTZCLG9DQUFvQyw2QkFBNkIsbUNBQW1DLDZCQUE2Qix5Q0FBeUMsNkJBQTZCLDhCQUE4Qiw2QkFBNkIsd0NBQXdDLDZCQUE2QixpREFBaUQsNkJBQTZCLGlCQUFpQiw2QkFBNkIsZ0RBQWdELDZCQUE2QixpQkFBaUIsNkJBQTZCLGNBQWMsNkJBQTZCLGdCQUFnQiw2QkFBNkIsU0FBUyw2QkFBNkIsU0FBUyw2QkFBNkIsY0FBYyw2QkFBNkIsZ0JBQWdCLDZCQUE2QiwyQkFBMkIsNkJBQTZCLFNBQVMsNkJBQTZCLGNBQWMsNkJBQTZCLGVBQWUsNkJBQTZCLDhDQUE4Qyw2QkFBNkIsaUJBQWlCLDZCQUE2QixjQUFjLDZCQUE2QixnQkFBZ0IsNkJBQTZCLFNBQVMsNkJBQTZCLFNBQVMsNkJBQTZCLGNBQWMsNkJBQTZCLGdCQUFnQiw2QkFBNkIsMEJBQTBCLDZCQUE2Qiw4QkFBOEIsNkJBQTZCLGlCQUFpQiw2QkFBNkIsU0FBUyw2QkFBNkIsa0NBQWtDLDZCQUE2QiwrQ0FBK0MsNkJBQTZCLGtCQUFrQiw2QkFBNkIsU0FBUyw2QkFBNkIsa0NBQWtDLDZCQUE2QixpQkFBaUIsNkJBQTZCLFNBQVMsNkJBQTZCLHdCQUF3Qiw2QkFBNkIsdUJBQXVCLDZCQUE2QixxQkFBcUIsNkJBQTZCLHdCQUF3Qiw2QkFBNkIsMkJBQTJCLDZCQUE2Qix3QkFBd0IsNkJBQTZCLG1DQUFtQyw2QkFBNkIsaUJBQWlCLDZCQUE2QixjQUFjLDZCQUE2QixvQkFBb0IsNkJBQTZCLG1CQUFtQiw2QkFBNkIsb0JBQW9CLDZCQUE2QixvQkFBb0IsNkJBQTZCLG1CQUFtQiw2QkFBNkIsbUJBQW1CLDZCQUE2QixtQkFBbUIsNkJBQTZCLG1CQUFtQiw2QkFBNkIsaUNBQWlDLDZCQUE2QixpQkFBaUIsNkJBQTZCLGNBQWMsNkJBQTZCLG1CQUFtQiw2QkFBNkIsbUJBQW1CLDZCQUE2QixtQkFBbUIsNkJBQTZCLFNBQVM7Ozs7Ozs7Ozs7OztBQ0R4b2xCLFVBQVUsbUJBQU8sQ0FBQyx5QkFBSTtBQUN0Qiw0Q0FBNEMsbUNBQW1DLDJRQUEyUSxFQUFFLHNEQUFzRCxnQ0FBZ0MseUJBQXlCLGlCQUFpQix5QkFBeUIsNkNBQTZDLDBCQUEwQixpQkFBaUIsMEJBQTBCLFNBQVMseUJBQXlCLG9CQUFvQiwwQkFBMEIsU0FBUyx5QkFBeUIsdUNBQXVDLDJCQUEyQixpQkFBaUIsMkJBQTJCLGNBQWMsMkJBQTJCLGNBQWMsMkJBQTJCLG1CQUFtQiwyQkFBMkIseUJBQXlCLDJCQUEyQixxQkFBcUIsMkJBQTJCLDBCQUEwQiwyQkFBMkIscUJBQXFCLDJCQUEyQixTQUFTLDJCQUEyQiwwQkFBMEIsMkJBQTJCLFNBQVMsMkJBQTJCLDBDQUEwQywyQkFBMkIsaUJBQWlCLDJCQUEyQixjQUFjLDJCQUEyQixjQUFjLDJCQUEyQixzQ0FBc0MsMkJBQTJCLGlCQUFpQiwyQkFBMkIsY0FBYywyQkFBMkIsY0FBYywyQkFBMkIsZUFBZTs7Ozs7Ozs7Ozs7OztBQ0RqcEQ7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsc0NBQWU7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdJYTtBQUNiO0FBQ0EsbUJBQW1CLG1CQUFPLENBQUMsa0RBQWlCO0FBQzVDLHVCQUF1QixtQkFBTyxDQUFDLHNEQUFtQjtBQUNsRCxXQUFXLG1CQUFPLENBQUMsc0RBQW1CO0FBQ3RDOzs7Ozs7Ozs7Ozs7O0FDTGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsc0NBQWU7QUFDdEMsb0JBQW9CLG1CQUFPLENBQUMsZ0RBQW9CO0FBQ2hELGdCQUFnQixtQkFBTyxDQUFDLHdDQUFnQjtBQUN4QyxlQUFlLG1CQUFPLENBQUMsMERBQWE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QiwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDVmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUJBQU8sQ0FBQywyQ0FBZTtBQUMzQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSx5QkFBeUIsd0JBQXdCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EseUJBQXlCLHdCQUF3QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzNKYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixtQkFBTyxDQUFDLG1DQUFXO0FBQ25DLHFCQUFxQixtQkFBTyxDQUFDLCtCQUFTO0FBQ3RDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxPQUFPLGtCQUFrQixHQUFHLG1CQUFPLENBQUMsaUNBQVU7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25EYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlDQUFpQyxnQ0FBZ0M7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzdFYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxtQkFBTyxDQUFDLG1FQUEyQjtBQUNuRSxnQkFBZ0IsbUJBQU8sQ0FBQyxtQ0FBVztBQUNuQyxrQkFBa0IsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN2QyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdlRhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsbUNBQVc7QUFDbkMsb0JBQW9CLG1CQUFPLENBQUMsMkNBQWU7QUFDM0MsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDL0phO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG1CQUFPLENBQUMscUNBQVk7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGdCQUFnQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsZ0JBQWdCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDOURhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxhQUFhLG1CQUFPLENBQUMsNkJBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHdCQUF3QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDM0hhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGFBQWEsbUJBQU8sQ0FBQyw2QkFBUTtBQUM3QixpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsbUJBQU8sQ0FBQywyQ0FBZTtBQUMzQyxvQkFBb0IsbUJBQU8sQ0FBQywyQ0FBZTtBQUMzQyxnQkFBZ0IsbUJBQU8sQ0FBQyxtQ0FBVztBQUNuQyxjQUFjLG1CQUFPLENBQUMsK0JBQVM7QUFDL0IsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdFRhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLG1CQUFPLENBQUMseUNBQWM7QUFDekMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLGtCQUFrQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLHFCQUFxQixnQkFBZ0I7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM5RWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsMERBQWE7QUFDcEM7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDNUNhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELHNDQUFzQztBQUMxRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixzQ0FBc0M7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pGYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixtQkFBTyxDQUFDLDJDQUFlO0FBQzNDLHNCQUFzQixtQkFBTyxDQUFDLCtCQUFTO0FBQ3ZDLG9CQUFvQixtQkFBTyxDQUFDLDJDQUFlO0FBQzNDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixnQ0FBZ0M7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsc0NBQXNDO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGdEQUFnRDtBQUNoRCxTQUFTO0FBQ1QsS0FBSztBQUNMLGFBQWEsS0FBSztBQUNsQjtBQUNBO0FBQ0EsMEJBQTBCO0FBQzFCO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQixvQ0FBb0M7QUFDcEMsa0JBQWtCLEVBQUU7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qix3QkFBd0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLG1CQUFPLENBQUMsOEVBQW1DO0FBQ3RGO0FBQ0Esd0RBQXdEO0FBQ3hELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3pwQmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNyQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNqTGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsMERBQWE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLG9CQUFvQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3hMYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxrQkFBa0IsbUJBQU8sQ0FBQyx1Q0FBYTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxTQUFTLE9BQU8sS0FBSyxJQUFJLEtBQUssSUFBSSxTQUFTO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDaE9hO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsbUNBQVc7QUFDbkMsZ0JBQWdCLG1CQUFPLENBQUMsbUNBQVc7QUFDbkMsa0JBQWtCLG1CQUFPLENBQUMsdUNBQWE7QUFDdkMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsYUFBYSxtQkFBTyxDQUFDLDZCQUFRO0FBQzdCLGdCQUFnQixtQkFBTyxDQUFDLG1DQUFXO0FBQ25DLGlCQUFpQixtQkFBTyxDQUFDLG9EQUFXO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULHlCQUF5QixFQUFFO0FBQzNCLHdCQUF3QixFQUFFO0FBQzFCO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLG9DQUFXO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbUJBQU8sQ0FBQyx3REFBd0I7QUFDdkQ7QUFDQSx5Q0FBeUMsbUJBQU8sQ0FBQyxrREFBcUI7QUFDdEU7Ozs7Ozs7Ozs7Ozs7QUNuU2E7QUFDYixlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDakthO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN0Q2E7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxhQUFhLG1CQUFPLENBQUMsNkJBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHlCQUF5QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0RhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7OztBQ2pEYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWMsbUJBQU8sQ0FBQywrQkFBUztBQUMvQixlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGNBQWMsbUJBQU8sQ0FBQywrQkFBUztBQUMvQixlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIseUJBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDM1ZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeENhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMzRGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUM1RGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9FYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9DQUFvQztBQUNwQztBQUNBLHNCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbERhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxPQUFPLHdCQUF3QjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixrQkFBa0I7QUFDMUM7QUFDQSw0QkFBNEIsNEJBQTRCO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDNUphO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeENhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFPLENBQUMsbUNBQVc7QUFDbkMsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ3ZEYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQyxlQUFlLG1CQUFPLENBQUMsaUNBQVU7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isc0JBQXNCO0FBQ3RDOzs7Ozs7Ozs7Ozs7O0FDakVhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLG1CQUFPLENBQUMsNEVBQWtDO0FBQ3BFLGVBQWUsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCx5QkFBeUI7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBTyxDQUFDLDJGQUF1QztBQUMvQyxtQkFBTyxDQUFDLDZGQUF3QztBQUNoRCxtQkFBTyxDQUFDLDZGQUF3QztBQUNoRCxtQkFBTyxDQUFDLHFHQUE0QztBQUNwRCxtQkFBTyxDQUFDLDJDQUFlO0FBQ3ZCLG1CQUFPLENBQUMsbURBQW1CO0FBQzNCLG1CQUFPLENBQUMsMkRBQXVCO0FBQy9CLG1CQUFPLENBQUMsaUVBQTBCO0FBQ2xDLG1CQUFPLENBQUMsdURBQXFCO0FBQzdCLG1CQUFPLENBQUMsbUVBQTJCO0FBQ25DLG1CQUFPLENBQUMsdUVBQTZCO0FBQ3JDLG1CQUFPLENBQUMsaUVBQTBCO0FBQ2xDLG1CQUFPLENBQUMscURBQW9CO0FBQzVCLG1CQUFPLENBQUMsbURBQW1COzs7Ozs7Ozs7Ozs7O0FDOUxkO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLGlDQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDeEpEO0FBQ2E7QUFDYjtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQTBDO0FBQzlDLFVBQVUsUUFBc0I7QUFDaEMsVUFBVSxTQUFrQzs7Ozs7Ozs7Ozs7O0FDUDVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJvaG0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJvaG1cIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wib2htXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9tYWluLmpzXCIpO1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbm1vZHVsZS5leHBvcnRzID0gZXh0ZW5kO1xuZnVuY3Rpb24gZXh0ZW5kKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgdHlwZW9mIGFkZCAhPT0gJ29iamVjdCcpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59XG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoW1wiZ3JhbW1hclwiLHtcInNvdXJjZVwiOlwiQnVpbHRJblJ1bGVzIHtcXG5cXG4gIGFsbnVtICAoYW4gYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXIpXFxuICAgID0gbGV0dGVyXFxuICAgIHwgZGlnaXRcXG5cXG4gIGxldHRlciAgKGEgbGV0dGVyKVxcbiAgICA9IGxvd2VyXFxuICAgIHwgdXBwZXJcXG4gICAgfCB1bmljb2RlTHRtb1xcblxcbiAgZGlnaXQgIChhIGRpZ2l0KVxcbiAgICA9IFxcXCIwXFxcIi4uXFxcIjlcXFwiXFxuXFxuICBoZXhEaWdpdCAgKGEgaGV4YWRlY2ltYWwgZGlnaXQpXFxuICAgID0gZGlnaXRcXG4gICAgfCBcXFwiYVxcXCIuLlxcXCJmXFxcIlxcbiAgICB8IFxcXCJBXFxcIi4uXFxcIkZcXFwiXFxuXFxuICBMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IE5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgfCBFbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuXFxuICBOb25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gZWxlbSAoc2VwIGVsZW0pKlxcblxcbiAgRW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IC8qIG5vdGhpbmcgKi9cXG5cXG4gIGxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gbm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICB8IGVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG5cXG4gIG5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBlbGVtIChzZXAgZWxlbSkqXFxuXFxuICBlbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gLyogbm90aGluZyAqL1xcblxcbn1cIn0sXCJCdWlsdEluUnVsZXNcIixudWxsLG51bGwse1wiYWxudW1cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOCw3OF19LFwiYW4gYWxwaGEtbnVtZXJpYyBjaGFyYWN0ZXJcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MCw3OF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYwLDY2XX0sXCJsZXR0ZXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzMsNzhdfSxcImRpZ2l0XCIsW11dXV0sXCJsZXR0ZXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MiwxNDJdfSxcImEgbGV0dGVyXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA3LDE0Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNywxMTJdfSxcImxvd2VyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExOSwxMjRdfSxcInVwcGVyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxNDJdfSxcInVuaWNvZGVMdG1vXCIsW11dXV0sXCJkaWdpdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NiwxNzddfSxcImEgZGlnaXRcIixbXSxbXCJyYW5nZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OSwxNzddfSxcIjBcIixcIjlcIl1dLFwiaGV4RGlnaXRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODEsMjU0XX0sXCJhIGhleGFkZWNpbWFsIGRpZ2l0XCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5LDI1NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOSwyMjRdfSxcImRpZ2l0XCIsW11dLFtcInJhbmdlXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMxLDIzOV19LFwiYVwiLFwiZlwiXSxbXCJyYW5nZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NiwyNTRdfSxcIkFcIixcIkZcIl1dXSxcIkxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1OCwzMzZdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyODIsMzM2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjgyLDMwN119LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyOTcsMzAxXX0sMF0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMDMsMzA2XX0sMV1dXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMTQsMzM2XX0sXCJFbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMyNiwzMzBdfSwwXSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMzMiwzMzVdfSwxXV1dXV0sXCJOb25lbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM0MCwzODhdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzIsMzg4XX0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzIsMzc2XX0sMF0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3NywzODhdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzgsMzg2XX0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzgsMzgxXX0sMV0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODIsMzg2XX0sMF1dXV1dLFwiRW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszOTIsNDM0XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDM4LDQzOF19XV0sXCJsaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MzgsNTE2XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDYyLDUxNl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ2Miw0ODddfSxcIm5vbmVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDc3LDQ4MV19LDBdLFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDgzLDQ4Nl19LDFdXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDk0LDUxNl19LFwiZW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MDYsNTEwXX0sMF0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MTIsNTE1XX0sMV1dXV1dLFwibm9uZW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjAsNTY4XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTUyLDU2OF19LFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTUyLDU1Nl19LDBdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTcsNTY4XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTU4LDU2Nl19LFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTU4LDU2MV19LDFdLFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTYyLDU2Nl19LDBdXV1dXSxcImVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTcyLDYxNF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxNiw2MTZdfV1dfV0pO1xuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIk9obSB7XFxuXFxuICBHcmFtbWFyc1xcbiAgICA9IEdyYW1tYXIqXFxuXFxuICBHcmFtbWFyXFxuICAgID0gaWRlbnQgU3VwZXJHcmFtbWFyPyBcXFwie1xcXCIgUnVsZSogXFxcIn1cXFwiXFxuXFxuICBTdXBlckdyYW1tYXJcXG4gICAgPSBcXFwiPDpcXFwiIGlkZW50XFxuXFxuICBSdWxlXFxuICAgID0gaWRlbnQgRm9ybWFscz8gcnVsZURlc2NyPyBcXFwiPVxcXCIgIFJ1bGVCb2R5ICAtLSBkZWZpbmVcXG4gICAgfCBpZGVudCBGb3JtYWxzPyAgICAgICAgICAgIFxcXCI6PVxcXCIgT3ZlcnJpZGVSdWxlQm9keSAgLS0gb3ZlcnJpZGVcXG4gICAgfCBpZGVudCBGb3JtYWxzPyAgICAgICAgICAgIFxcXCIrPVxcXCIgUnVsZUJvZHkgIC0tIGV4dGVuZFxcblxcbiAgUnVsZUJvZHlcXG4gICAgPSBcXFwifFxcXCI/IE5vbmVtcHR5TGlzdE9mPFRvcExldmVsVGVybSwgXFxcInxcXFwiPlxcblxcbiAgVG9wTGV2ZWxUZXJtXFxuICAgID0gU2VxIGNhc2VOYW1lICAtLSBpbmxpbmVcXG4gICAgfCBTZXFcXG5cXG4gIE92ZXJyaWRlUnVsZUJvZHlcXG4gICAgPSBcXFwifFxcXCI/IE5vbmVtcHR5TGlzdE9mPE92ZXJyaWRlVG9wTGV2ZWxUZXJtLCBcXFwifFxcXCI+XFxuXFxuICBPdmVycmlkZVRvcExldmVsVGVybVxcbiAgICA9IFxcXCIuLi5cXFwiICAtLSBzdXBlclNwbGljZVxcbiAgICB8IFRvcExldmVsVGVybVxcblxcbiAgRm9ybWFsc1xcbiAgICA9IFxcXCI8XFxcIiBMaXN0T2Y8aWRlbnQsIFxcXCIsXFxcIj4gXFxcIj5cXFwiXFxuXFxuICBQYXJhbXNcXG4gICAgPSBcXFwiPFxcXCIgTGlzdE9mPFNlcSwgXFxcIixcXFwiPiBcXFwiPlxcXCJcXG5cXG4gIEFsdFxcbiAgICA9IE5vbmVtcHR5TGlzdE9mPFNlcSwgXFxcInxcXFwiPlxcblxcbiAgU2VxXFxuICAgID0gSXRlcipcXG5cXG4gIEl0ZXJcXG4gICAgPSBQcmVkIFxcXCIqXFxcIiAgLS0gc3RhclxcbiAgICB8IFByZWQgXFxcIitcXFwiICAtLSBwbHVzXFxuICAgIHwgUHJlZCBcXFwiP1xcXCIgIC0tIG9wdFxcbiAgICB8IFByZWRcXG5cXG4gIFByZWRcXG4gICAgPSBcXFwiflxcXCIgTGV4ICAtLSBub3RcXG4gICAgfCBcXFwiJlxcXCIgTGV4ICAtLSBsb29rYWhlYWRcXG4gICAgfCBMZXhcXG5cXG4gIExleFxcbiAgICA9IFxcXCIjXFxcIiBCYXNlICAtLSBsZXhcXG4gICAgfCBCYXNlXFxuXFxuICBCYXNlXFxuICAgID0gaWRlbnQgUGFyYW1zPyB+KHJ1bGVEZXNjcj8gXFxcIj1cXFwiIHwgXFxcIjo9XFxcIiB8IFxcXCIrPVxcXCIpICAtLSBhcHBsaWNhdGlvblxcbiAgICB8IG9uZUNoYXJUZXJtaW5hbCBcXFwiLi5cXFwiIG9uZUNoYXJUZXJtaW5hbCAgICAgICAgICAgLS0gcmFuZ2VcXG4gICAgfCB0ZXJtaW5hbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHRlcm1pbmFsXFxuICAgIHwgXFxcIihcXFwiIEFsdCBcXFwiKVxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBwYXJlblxcblxcbiAgcnVsZURlc2NyICAoYSBydWxlIGRlc2NyaXB0aW9uKVxcbiAgICA9IFxcXCIoXFxcIiBydWxlRGVzY3JUZXh0IFxcXCIpXFxcIlxcblxcbiAgcnVsZURlc2NyVGV4dFxcbiAgICA9ICh+XFxcIilcXFwiIGFueSkqXFxuXFxuICBjYXNlTmFtZVxcbiAgICA9IFxcXCItLVxcXCIgKH5cXFwiXFxcXG5cXFwiIHNwYWNlKSogbmFtZSAoflxcXCJcXFxcblxcXCIgc3BhY2UpKiAoXFxcIlxcXFxuXFxcIiB8ICZcXFwifVxcXCIpXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbiAgaWRlbnQgIChhbiBpZGVudGlmaWVyKVxcbiAgICA9IG5hbWVcXG5cXG4gIHRlcm1pbmFsXFxuICAgID0gXFxcIlxcXFxcXFwiXFxcIiB0ZXJtaW5hbENoYXIqIFxcXCJcXFxcXFxcIlxcXCJcXG5cXG4gIG9uZUNoYXJUZXJtaW5hbFxcbiAgICA9IFxcXCJcXFxcXFxcIlxcXCIgdGVybWluYWxDaGFyIFxcXCJcXFxcXFxcIlxcXCJcXG5cXG4gIHRlcm1pbmFsQ2hhclxcbiAgICA9IGVzY2FwZUNoYXJcXG4gICAgfCB+XFxcIlxcXFxcXFxcXFxcIiB+XFxcIlxcXFxcXFwiXFxcIiB+XFxcIlxcXFxuXFxcIiBhbnlcXG5cXG4gIGVzY2FwZUNoYXIgIChhbiBlc2NhcGUgc2VxdWVuY2UpXFxuICAgID0gXFxcIlxcXFxcXFxcXFxcXFxcXFxcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGJhY2tzbGFzaFxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFxcXFwiXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBkb3VibGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXFxcXFwnXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBzaW5nbGVRdW90ZVxcbiAgICB8IFxcXCJcXFxcXFxcXGJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBiYWNrc3BhY2VcXG4gICAgfCBcXFwiXFxcXFxcXFxuXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gbGluZUZlZWRcXG4gICAgfCBcXFwiXFxcXFxcXFxyXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gY2FycmlhZ2VSZXR1cm5cXG4gICAgfCBcXFwiXFxcXFxcXFx0XFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gdGFiXFxuICAgIHwgXFxcIlxcXFxcXFxcdVxcXCIgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgaGV4RGlnaXQgIC0tIHVuaWNvZGVFc2NhcGVcXG4gICAgfCBcXFwiXFxcXFxcXFx4XFxcIiBoZXhEaWdpdCBoZXhEaWdpdCAgICAgICAgICAgICAgICAgICAgLS0gaGV4RXNjYXBlXFxuXFxuICBzcGFjZVxcbiAgICs9IGNvbW1lbnRcXG5cXG4gIGNvbW1lbnRcXG4gICAgPSBcXFwiLy9cXFwiICh+XFxcIlxcXFxuXFxcIiBhbnkpKiAmKFxcXCJcXFxcblxcXCIgfCBlbmQpICAtLSBzaW5nbGVMaW5lXFxuICAgIHwgXFxcIi8qXFxcIiAoflxcXCIqL1xcXCIgYW55KSogXFxcIiovXFxcIiAgLS0gbXVsdGlMaW5lXFxuXFxuICB0b2tlbnMgPSB0b2tlbipcXG5cXG4gIHRva2VuID0gY2FzZU5hbWUgfCBjb21tZW50IHwgaWRlbnQgfCBvcGVyYXRvciB8IHB1bmN0dWF0aW9uIHwgdGVybWluYWwgfCBhbnlcXG5cXG4gIG9wZXJhdG9yID0gXFxcIjw6XFxcIiB8IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiIHwgXFxcIipcXFwiIHwgXFxcIitcXFwiIHwgXFxcIj9cXFwiIHwgXFxcIn5cXFwiIHwgXFxcIiZcXFwiXFxuXFxuICBwdW5jdHVhdGlvbiA9IFxcXCI8XFxcIiB8IFxcXCI+XFxcIiB8IFxcXCIsXFxcIiB8IFxcXCItLVxcXCJcXG59XCJ9LFwiT2htXCIsbnVsbCxcIkdyYW1tYXJzXCIse1wiR3JhbW1hcnNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5LDMyXX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQsMzJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNCwzMV19LFwiR3JhbW1hclwiLFtdXV1dLFwiR3JhbW1hclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM2LDgzXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MCw4M119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUwLDU1XX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1Niw2OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2LDY4XX0sXCJTdXBlckdyYW1tYXJcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzAsNzNdfSxcIntcIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0LDc5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQsNzhdfSxcIlJ1bGVcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODAsODNdfSxcIn1cIl1dXSxcIlN1cGVyR3JhbW1hclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3LDExNl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA2LDExNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA2LDExMF19LFwiPDpcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExLDExNl19LFwiaWRlbnRcIixbXV1dXSxcIlJ1bGVfZGVmaW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE4MV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE3MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxMzZdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNywxNDVdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzcsMTQ0XX0sXCJGb3JtYWxzXCIsW11dXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDYsMTU2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2LDE1NV19LFwicnVsZURlc2NyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NywxNjBdfSxcIj1cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYyLDE3MF19LFwiUnVsZUJvZHlcIixbXV1dXSxcIlJ1bGVfb3ZlcnJpZGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMjQ4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMjM1XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDE5M119LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk0LDIwMl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NCwyMDFdfSxcIkZvcm1hbHNcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE0LDIxOF19LFwiOj1cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5LDIzNV19LFwiT3ZlcnJpZGVSdWxlQm9keVwiLFtdXV1dLFwiUnVsZV9leHRlbmRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTUsMzA1XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTUsMjk0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU1LDI2MF19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjYxLDI2OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI2MSwyNjhdfSxcIkZvcm1hbHNcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjgxLDI4NV19LFwiKz1cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjg2LDI5NF19LFwiUnVsZUJvZHlcIixbXV1dXSxcIlJ1bGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjAsMzA1XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMzA1XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE3MF19LFwiUnVsZV9kZWZpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDIzNV19LFwiUnVsZV9vdmVycmlkZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTUsMjk0XX0sXCJSdWxlX2V4dGVuZFwiLFtdXV1dLFwiUnVsZUJvZHlcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMDksMzYyXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMjQsMzYyXX0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzI0LDMyOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzI0LDMyN119LFwifFwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzI5LDM2Ml19LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzQ0LDM1Nl19LFwiVG9wTGV2ZWxUZXJtXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzU4LDM2MV19LFwifFwiXV1dXV0sXCJUb3BMZXZlbFRlcm1faW5saW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzg1LDQwOF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzg1LDM5N119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4NSwzODhdfSxcIlNlcVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODksMzk3XX0sXCJjYXNlTmFtZVwiLFtdXV1dLFwiVG9wTGV2ZWxUZXJtXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzY2LDQxOF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzg1LDQxOF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4NSwzOTddfSxcIlRvcExldmVsVGVybV9pbmxpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDE1LDQxOF19LFwiU2VxXCIsW11dXV0sXCJPdmVycmlkZVJ1bGVCb2R5XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDIyLDQ5MV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDQ1LDQ5MV19LFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ0NSw0NDldfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ0NSw0NDhdfSxcInxcIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ1MCw0OTFdfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ2NSw0ODVdfSxcIk92ZXJyaWRlVG9wTGV2ZWxUZXJtXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDg3LDQ5MF19LFwifFwiXV1dXV0sXCJPdmVycmlkZVRvcExldmVsVGVybV9zdXBlclNwbGljZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyMiw1NDNdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTIyLDUyN119LFwiLi4uXCJdXSxcIk92ZXJyaWRlVG9wTGV2ZWxUZXJtXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDk1LDU2Ml19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTIyLDU2Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyMiw1MjddfSxcIk92ZXJyaWRlVG9wTGV2ZWxUZXJtX3N1cGVyU3BsaWNlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1MCw1NjJdfSxcIlRvcExldmVsVGVybVwiLFtdXV1dLFwiRm9ybWFsc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Niw2MDZdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU4MCw2MDZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU4MCw1ODNdfSxcIjxcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTg0LDYwMl19LFwiTGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5MSw1OTZdfSxcImlkZW50XCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTk4LDYwMV19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjAzLDYwNl19LFwiPlwiXV1dLFwiUGFyYW1zXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjEwLDY0N119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjIzLDY0N119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjIzLDYyNl19LFwiPFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MjcsNjQzXX0sXCJMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjM0LDYzN119LFwiU2VxXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjM5LDY0Ml19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjQ0LDY0N119LFwiPlwiXV1dLFwiQWx0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjUxLDY4NV19LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjYxLDY4NV19LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjc2LDY3OV19LFwiU2VxXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjgxLDY4NF19LFwifFwiXV1dXSxcIlNlcVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY4OSw3MDRdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2OTksNzA0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjk5LDcwM119LFwiSXRlclwiLFtdXV1dLFwiSXRlcl9zdGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzE5LDczNl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzE5LDcyN119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcxOSw3MjNdfSxcIlByZWRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MjQsNzI3XX0sXCIqXCJdXV0sXCJJdGVyX3BsdXNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NDMsNzYwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NDMsNzUxXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQzLDc0N119LFwiUHJlZFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0OCw3NTFdfSxcIitcIl1dXSxcIkl0ZXJfb3B0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY3LDc4M119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY3LDc3NV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Nyw3NzFdfSxcIlByZWRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NzIsNzc1XX0sXCI/XCJdXV0sXCJJdGVyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzA4LDc5NF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzE5LDc5NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcxOSw3MjddfSxcIkl0ZXJfc3RhclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NDMsNzUxXX0sXCJJdGVyX3BsdXNcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY3LDc3NV19LFwiSXRlcl9vcHRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzkwLDc5NF19LFwiUHJlZFwiLFtdXV1dLFwiUHJlZF9ub3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MDksODI0XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MDksODE2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MDksODEyXX0sXCJ+XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgxMyw4MTZdfSxcIkxleFwiLFtdXV1dLFwiUHJlZF9sb29rYWhlYWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzEsODUyXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzEsODM4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzEsODM0XX0sXCImXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzNSw4MzhdfSxcIkxleFwiLFtdXV1dLFwiUHJlZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc5OCw4NjJdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwOSw4NjJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MDksODE2XX0sXCJQcmVkX25vdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzEsODM4XX0sXCJQcmVkX2xvb2thaGVhZFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NTksODYyXX0sXCJMZXhcIixbXV1dXSxcIkxleF9sZXhcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NzYsODkyXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NzYsODg0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NzYsODc5XX0sXCIjXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg4MCw4ODRdfSxcIkJhc2VcIixbXV1dXSxcIkxleFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg2Niw5MDNdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3Niw5MDNdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NzYsODg0XX0sXCJMZXhfbGV4XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5OSw5MDNdfSxcIkJhc2VcIixbXV1dXSxcIkJhc2VfYXBwbGljYXRpb25cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MTgsOTc5XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MTgsOTYzXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTE4LDkyM119LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTI0LDkzMV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkyNCw5MzBdfSxcIlBhcmFtc1wiLFtdXV0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTMyLDk2M119LFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkzNCw5NjJdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MzQsOTQ4XX0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTM0LDk0NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkzNCw5NDNdfSxcInJ1bGVEZXNjclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NDUsOTQ4XX0sXCI9XCJdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk1MSw5NTVdfSxcIjo9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTU4LDk2Ml19LFwiKz1cIl1dXV1dLFwiQmFzZV9yYW5nZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk4NiwxMDQxXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5ODYsMTAyMl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk4NiwxMDAxXX0sXCJvbmVDaGFyVGVybWluYWxcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDAyLDEwMDZdfSxcIi4uXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwMDcsMTAyMl19LFwib25lQ2hhclRlcm1pbmFsXCIsW11dXV0sXCJCYXNlX3Rlcm1pbmFsXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA0OCwxMTA2XX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDQ4LDEwNTZdfSxcInRlcm1pbmFsXCIsW11dXSxcIkJhc2VfcGFyZW5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTEzLDExNjhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTMsMTEyNF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExMywxMTE2XX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTcsMTEyMF19LFwiQWx0XCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTEyMSwxMTI0XX0sXCIpXCJdXV0sXCJCYXNlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTA3LDExNjhdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkxOCwxMTY4XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTE4LDk2M119LFwiQmFzZV9hcHBsaWNhdGlvblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5ODYsMTAyMl19LFwiQmFzZV9yYW5nZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDQ4LDEwNTZdfSxcIkJhc2VfdGVybWluYWxcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExMywxMTI0XX0sXCJCYXNlX3BhcmVuXCIsW11dXV0sXCJydWxlRGVzY3JcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTcyLDEyMzFdfSxcImEgcnVsZSBkZXNjcmlwdGlvblwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMTAsMTIzMV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIxMCwxMjEzXX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMTQsMTIyN119LFwicnVsZURlc2NyVGV4dFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMjgsMTIzMV19LFwiKVwiXV1dLFwicnVsZURlc2NyVGV4dFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMzUsMTI2Nl19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNTUsMTI2Nl19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNTYsMTI2NF19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNTYsMTI2MF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI1NywxMjYwXX0sXCIpXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjYxLDEyNjRdfSxcImFueVwiLFtdXV1dXSxcImNhc2VOYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI3MCwxMzM4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjg1LDEzMzhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyODUsMTI4OV19LFwiLS1cIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOTAsMTMwNF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOTEsMTMwMl19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOTEsMTI5Nl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI5MiwxMjk2XX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOTcsMTMwMl19LFwic3BhY2VcIixbXV1dXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzA1LDEzMDldfSxcIm5hbWVcIixbXV0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMTAsMTMyNF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMTEsMTMyMl19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMTEsMTMxNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxMiwxMzE2XX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMTcsMTMyMl19LFwic3BhY2VcIixbXV1dXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzI2LDEzMzddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMjYsMTMzMF19LFwiXFxuXCJdLFtcImxvb2thaGVhZFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMzMsMTMzN119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMzNCwxMzM3XX0sXCJ9XCJdXV1dXSxcIm5hbWVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzQyLDEzODJdfSxcImEgbmFtZVwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNjMsMTM4Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNjMsMTM3Ml19LFwibmFtZUZpcnN0XCIsW11dLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzczLDEzODJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzczLDEzODFdfSxcIm5hbWVSZXN0XCIsW11dXV1dLFwibmFtZUZpcnN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM4NiwxNDE4XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDAyLDE0MThdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MDIsMTQwNV19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDEyLDE0MThdfSxcImxldHRlclwiLFtdXV1dLFwibmFtZVJlc3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDIyLDE0NTJdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MzcsMTQ1Ml19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQzNywxNDQwXX0sXCJfXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NDcsMTQ1Ml19LFwiYWxudW1cIixbXV1dXSxcImlkZW50XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ1NiwxNDg5XX0sXCJhbiBpZGVudGlmaWVyXCIsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ4NSwxNDg5XX0sXCJuYW1lXCIsW11dXSxcInRlcm1pbmFsXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ5MywxNTMxXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTA4LDE1MzFdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MDgsMTUxMl19LFwiXFxcIlwiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUxMywxNTI2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUxMywxNTI1XX0sXCJ0ZXJtaW5hbENoYXJcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUyNywxNTMxXX0sXCJcXFwiXCJdXV0sXCJvbmVDaGFyVGVybWluYWxcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTM1LDE1NzldfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NTcsMTU3OV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU1NywxNTYxXX0sXCJcXFwiXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NjIsMTU3NF19LFwidGVybWluYWxDaGFyXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU3NSwxNTc5XX0sXCJcXFwiXCJdXV0sXCJ0ZXJtaW5hbENoYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTgzLDE2NDBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MDIsMTY0MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MDIsMTYxMl19LFwiZXNjYXBlQ2hhclwiLFtdXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjE5LDE2NDBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjE5LDE2MjRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MjAsMTYyNF19LFwiXFxcXFwiXV0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYyNSwxNjMwXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjI2LDE2MzBdfSxcIlxcXCJcIl1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MzEsMTYzNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYzMiwxNjM2XX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MzcsMTY0MF19LFwiYW55XCIsW11dXV1dLFwiZXNjYXBlQ2hhcl9iYWNrc2xhc2hcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgzLDE3MzhdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4MywxNjg5XX0sXCJcXFxcXFxcXFwiXV0sXCJlc2NhcGVDaGFyX2RvdWJsZVF1b3RlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc0NSwxODAyXX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3NDUsMTc1MV19LFwiXFxcXFxcXCJcIl1dLFwiZXNjYXBlQ2hhcl9zaW5nbGVRdW90ZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4MDksMTg2Nl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODA5LDE4MTVdfSxcIlxcXFwnXCJdXSxcImVzY2FwZUNoYXJfYmFja3NwYWNlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg3MywxOTI4XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NzMsMTg3OF19LFwiXFxcXGJcIl1dLFwiZXNjYXBlQ2hhcl9saW5lRmVlZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MzUsMTk4OV19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTM1LDE5NDBdfSxcIlxcXFxuXCJdXSxcImVzY2FwZUNoYXJfY2FycmlhZ2VSZXR1cm5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTk2LDIwNTZdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk5NiwyMDAxXX0sXCJcXFxcclwiXV0sXCJlc2NhcGVDaGFyX3RhYlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNjMsMjExMl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDYzLDIwNjhdfSxcIlxcXFx0XCJdXSxcImVzY2FwZUNoYXJfdW5pY29kZUVzY2FwZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMTksMjE3OF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjExOSwyMTYwXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTE5LDIxMjRdfSxcIlxcXFx1XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMjUsMjEzM119LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEzNCwyMTQyXX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTQzLDIxNTFdfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNTIsMjE2MF19LFwiaGV4RGlnaXRcIixbXV1dXSxcImVzY2FwZUNoYXJfaGV4RXNjYXBlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE4NSwyMjQwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTg1LDIyMDhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxODUsMjE5MF19LFwiXFxcXHhcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5MSwyMTk5XX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjAwLDIyMDhdfSxcImhleERpZ2l0XCIsW11dXV0sXCJlc2NhcGVDaGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY0NCwyMjQwXX0sXCJhbiBlc2NhcGUgc2VxdWVuY2VcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgzLDIyNDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgzLDE2ODldfSxcImVzY2FwZUNoYXJfYmFja3NsYXNoXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3NDUsMTc1MV19LFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODA5LDE4MTVdfSxcImVzY2FwZUNoYXJfc2luZ2xlUXVvdGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg3MywxODc4XX0sXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTM1LDE5NDBdfSxcImVzY2FwZUNoYXJfbGluZUZlZWRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk5NiwyMDAxXX0sXCJlc2NhcGVDaGFyX2NhcnJpYWdlUmV0dXJuXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNjMsMjA2OF19LFwiZXNjYXBlQ2hhcl90YWJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjExOSwyMTYwXX0sXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE4NSwyMjA4XX0sXCJlc2NhcGVDaGFyX2hleEVzY2FwZVwiLFtdXV1dLFwic3BhY2VcIjpbXCJleHRlbmRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjQ0LDIyNjNdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNTYsMjI2M119LFwiY29tbWVudFwiLFtdXV0sXCJjb21tZW50X3NpbmdsZUxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgxLDIzMjddfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODEsMjMxMl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4MSwyMjg1XX0sXCIvL1wiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4NiwyMjk4XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4NywyMjk2XX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4NywyMjkyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjg4LDIyOTJdfSxcIlxcblwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI5MywyMjk2XX0sXCJhbnlcIixbXV1dXSxbXCJsb29rYWhlYWRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjk5LDIzMTJdfSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzAxLDIzMTFdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMDEsMjMwNV19LFwiXFxuXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMDgsMjMxMV19LFwiZW5kXCIsW11dXV1dXSxcImNvbW1lbnRfbXVsdGlMaW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMzNCwyMzcwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzM0LDIzNTZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMzQsMjMzOF19LFwiLypcIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMzksMjM1MV19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNDAsMjM0OV19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNDAsMjM0NV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0MSwyMzQ1XX0sXCIqL1wiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0NiwyMzQ5XX0sXCJhbnlcIixbXV1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNTIsMjM1Nl19LFwiKi9cIl1dXSxcImNvbW1lbnRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjY3LDIzNzBdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODEsMjM3MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODEsMjMxMl19LFwiY29tbWVudF9zaW5nbGVMaW5lXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMzQsMjM1Nl19LFwiY29tbWVudF9tdWx0aUxpbmVcIixbXV1dXSxcInRva2Vuc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNzQsMjM4OV19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzODMsMjM4OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzODMsMjM4OF19LFwidG9rZW5cIixbXV1dXSxcInRva2VuXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM5MywyNDY5XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDAxLDI0NjldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDAxLDI0MDldfSxcImNhc2VOYW1lXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MTIsMjQxOV19LFwiY29tbWVudFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDIyLDI0MjddfSxcImlkZW50XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MzAsMjQzOF19LFwib3BlcmF0b3JcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ0MSwyNDUyXX0sXCJwdW5jdHVhdGlvblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDU1LDI0NjNdfSxcInRlcm1pbmFsXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NjYsMjQ2OV19LFwiYW55XCIsW11dXV0sXCJvcGVyYXRvclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NzMsMjUzOF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ4NCwyNTM4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDg0LDI0ODhdfSxcIjw6XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ5MSwyNDk0XX0sXCI9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ5NywyNTAxXX0sXCI6PVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MDQsMjUwOF19LFwiKz1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTExLDI1MTRdfSxcIipcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTE3LDI1MjBdfSxcIitcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTIzLDI1MjZdfSxcIj9cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTI5LDI1MzJdfSxcIn5cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTM1LDI1MzhdfSxcIiZcIl1dXSxcInB1bmN0dWF0aW9uXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU0MiwyNTc4XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTU2LDI1NzhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NTYsMjU1OV19LFwiPFwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NjIsMjU2NV19LFwiPlwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NjgsMjU3MV19LFwiLFwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NzQsMjU3OF19LFwiLS1cIl1dXX1dKTtcbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShbXCJncmFtbWFyXCIse1wic291cmNlXCI6XCJPcGVyYXRpb25zQW5kQXR0cmlidXRlcyB7XFxuXFxuICBBdHRyaWJ1dGVTaWduYXR1cmUgPVxcbiAgICBuYW1lXFxuXFxuICBPcGVyYXRpb25TaWduYXR1cmUgPVxcbiAgICBuYW1lIEZvcm1hbHM/XFxuXFxuICBGb3JtYWxzXFxuICAgID0gXFxcIihcXFwiIExpc3RPZjxuYW1lLCBcXFwiLFxcXCI+IFxcXCIpXFxcIlxcblxcbiAgbmFtZSAgKGEgbmFtZSlcXG4gICAgPSBuYW1lRmlyc3QgbmFtZVJlc3QqXFxuXFxuICBuYW1lRmlyc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBsZXR0ZXJcXG5cXG4gIG5hbWVSZXN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgYWxudW1cXG5cXG59XCJ9LFwiT3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNcIixudWxsLFwiQXR0cmlidXRlU2lnbmF0dXJlXCIse1wiQXR0cmlidXRlU2lnbmF0dXJlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjksNThdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU0LDU4XX0sXCJuYW1lXCIsW11dXSxcIk9wZXJhdGlvblNpZ25hdHVyZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYyLDEwMF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODcsMTAwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODcsOTFdfSxcIm5hbWVcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTIsMTAwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTIsOTldfSxcIkZvcm1hbHNcIixbXV1dXV0sXCJGb3JtYWxzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA0LDE0M119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE4LDE0M119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE4LDEyMV19LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjIsMTM5XX0sXCJMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI5LDEzM119LFwibmFtZVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNSwxMzhdfSxcIixcIl1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MCwxNDNdfSxcIilcIl1dXSxcIm5hbWVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDcsMTg3XX0sXCJhIG5hbWVcIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgsMTg3XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4LDE3N119LFwibmFtZUZpcnN0XCIsW11dLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzgsMTg3XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc4LDE4Nl19LFwibmFtZVJlc3RcIixbXV1dXV0sXCJuYW1lRmlyc3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTEsMjIzXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDcsMjIzXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDcsMjEwXX0sXCJfXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNywyMjNdfSxcImxldHRlclwiLFtdXV1dLFwibmFtZVJlc3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjcsMjU3XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDIsMjU3XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDIsMjQ1XX0sXCJfXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MiwyNTddfSxcImFsbnVtXCIsW11dXV19XSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJy4uL3NyYy9jb21tb24nKS5hc3NlcnQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnNcbmZ1bmN0aW9uIGdldFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gICAgcmV0dXJuIGZuKHRoaW5nW25hbWVdKTtcbn1cbmZ1bmN0aW9uIG1hcFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gICAgcmV0dXJuIHRoaW5nW25hbWVdLm1hcChmbik7XG59XG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHdhbGsgYSBzaW5nbGUgcHJvcGVydHkgb2YgYSBub2RlLlxuLy8gYGRlc2NyaXB0b3JgIGlzIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIHByb3BlcnR5IG5hbWUsIG9wdGlvbmFsbHkgZW5kaW5nXG4vLyB3aXRoICdbXScgKGUuZy4sICdjaGlsZHJlbltdJykuXG5mdW5jdGlvbiBnZXRQcm9wV2Fsa0ZuKGRlc2NyaXB0b3IpIHtcbiAgICBjb25zdCBwYXJ0cyA9IGRlc2NyaXB0b3Iuc3BsaXQoLyA/XFxbXFxdLyk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gbWFwUHJvcC5iaW5kKG51bGwsIHBhcnRzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldFByb3AuYmluZChudWxsLCBkZXNjcmlwdG9yKTtcbn1cbmZ1bmN0aW9uIGdldFByb3BzKHdhbGtGbnMsIHRoaW5nLCBmbikge1xuICAgIHJldHVybiB3YWxrRm5zLm1hcCh3YWxrRm4gPT4gd2Fsa0ZuKHRoaW5nLCBmbikpO1xufVxuZnVuY3Rpb24gZ2V0V2Fsa0ZuKHNoYXBlKSB7XG4gICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGdldFByb3BzLmJpbmQobnVsbCwgW2dldFByb3BXYWxrRm4oc2hhcGUpXSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2hhcGUpKSB7XG4gICAgICAgIHJldHVybiBnZXRQcm9wcy5iaW5kKG51bGwsIHNoYXBlLm1hcChnZXRQcm9wV2Fsa0ZuKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhc3NlcnQodHlwZW9mIHNoYXBlID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgYSBzdHJpbmcsIEFycmF5LCBvciBmdW5jdGlvbicpO1xuICAgICAgICBhc3NlcnQoc2hhcGUubGVuZ3RoID09PSAyLCAnRXhwZWN0ZWQgYSBmdW5jdGlvbiBvZiBhcml0eSAyLCBnb3QgJyArIHNoYXBlLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBzaGFwZTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKHN0cikge1xuICAgIHJldHVybiAvXlthLXpBLVpfXVswLTlhLXpBLVpfXSokLy50ZXN0KHN0cik7XG59XG5mdW5jdGlvbiB0cmltKHMpIHtcbiAgICByZXR1cm4gcy50cmltKCk7XG59XG5mdW5jdGlvbiBwYXJzZVNpZ25hdHVyZShzaWcpIHtcbiAgICBjb25zdCBwYXJ0cyA9IHNpZy5zcGxpdCgvWygpXS8pLm1hcCh0cmltKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAzICYmIHBhcnRzWzJdID09PSAnJykge1xuICAgICAgICBjb25zdCBuYW1lID0gcGFydHNbMF07XG4gICAgICAgIGxldCBwYXJhbXMgPSBbXTtcbiAgICAgICAgaWYgKHBhcnRzWzFdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHBhcmFtcyA9IHBhcnRzWzFdLnNwbGl0KCcsJykubWFwKHRyaW0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKG5hbWUpICYmIHBhcmFtcy5ldmVyeShpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgbmFtZSwgZm9ybWFsczogcGFyYW1zIH07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG9wZXJhdGlvbiBzaWduYXR1cmU6ICcgKyBzaWcpO1xufVxuLypcbiAgQSBWaXNpdG9yRmFtaWx5IGNvbnRhaW5zIGEgc2V0IG9mIHJlY3Vyc2l2ZSBvcGVyYXRpb25zIHRoYXQgYXJlIGRlZmluZWQgb3ZlciBzb21lIGtpbmQgb2ZcbiAgdHJlZSBzdHJ1Y3R1cmUuIFRoZSBgY29uZmlnYCBwYXJhbWV0ZXIgc3BlY2lmaWVzIGhvdyB0byB3YWxrIHRoZSB0cmVlOlxuICAtICdnZXRUYWcnIGlzIGZ1bmN0aW9uIHdoaWNoLCBnaXZlbiBhIG5vZGUgaW4gdGhlIHRyZWUsIHJldHVybnMgdGhlIG5vZGUncyAndGFnJyAodHlwZSlcbiAgLSAnc2hhcGVzJyBhbiBvYmplY3QgdGhhdCBtYXBzIGZyb20gYSB0YWcgdG8gYSB2YWx1ZSB0aGF0IGRlc2NyaWJlcyBob3cgdG8gcmVjdXJzaXZlbHlcbiAgICBldmFsdWF0ZSB0aGUgb3BlcmF0aW9uIGZvciBub2RlcyBvZiB0aGF0IHR5cGUuIFRoZSB2YWx1ZSBjYW4gYmU6XG4gICAgKiBhIHN0cmluZyBpbmRpY2F0aW5nIHRoZSBwcm9wZXJ0eSBuYW1lIHRoYXQgaG9sZHMgdGhhdCBub2RlJ3Mgb25seSBjaGlsZFxuICAgICogYW4gQXJyYXkgb2YgcHJvcGVydHkgbmFtZXMgKG9yIGFuIGVtcHR5IGFycmF5IGluZGljYXRpbmcgYSBsZWFmIHR5cGUpLCBvclxuICAgICogYSBmdW5jdGlvbiB0YWtpbmcgdHdvIGFyZ3VtZW50cyAobm9kZSwgZm4pLCBhbmQgcmV0dXJuaW5nIGFuIEFycmF5IHdoaWNoIGlzIHRoZSByZXN1bHRcbiAgICAgIG9mIGFwcGx5IGBmbmAgdG8gZWFjaCBvZiB0aGUgbm9kZSdzIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiBWaXNpdG9yRmFtaWx5KGNvbmZpZykge1xuICAgIHRoaXMuX3NoYXBlcyA9IGNvbmZpZy5zaGFwZXM7XG4gICAgdGhpcy5fZ2V0VGFnID0gY29uZmlnLmdldFRhZztcbiAgICB0aGlzLkFkYXB0ZXIgPSBmdW5jdGlvbiAodGhpbmcsIGZhbWlseSkge1xuICAgICAgICB0aGlzLl9hZGFwdGVlID0gdGhpbmc7XG4gICAgICAgIHRoaXMuX2ZhbWlseSA9IGZhbWlseTtcbiAgICB9O1xuICAgIHRoaXMuQWRhcHRlci5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdoZWVleSEnKTtcbiAgICB9O1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IHt9O1xuICAgIHRoaXMuX2FyaXRpZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2dldENoaWxkcmVuID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9zaGFwZXMpLmZvckVhY2goayA9PiB7XG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5fc2hhcGVzW2tdO1xuICAgICAgICB0aGlzLl9nZXRDaGlsZHJlbltrXSA9IGdldFdhbGtGbihzaGFwZSk7XG4gICAgICAgIC8vIEEgZnVuY3Rpb24gbWVhbnMgdGhlIGFyaXR5IGlzbid0IGZpeGVkLCBzbyBkb24ndCBwdXQgYW4gZW50cnkgaW4gdGhlIGFyaXR5IG1hcC5cbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5fYXJpdGllc1trXSA9IEFycmF5LmlzQXJyYXkoc2hhcGUpID8gc2hhcGUubGVuZ3RoIDogMTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX3dyYXAgPSB0aGluZyA9PiBuZXcgdGhpcy5BZGFwdGVyKHRoaW5nLCB0aGlzKTtcbn1cblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbiAodGhpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5fd3JhcCh0aGluZyk7XG59O1xuVmlzaXRvckZhbWlseS5wcm90b3R5cGUuX2NoZWNrQWN0aW9uRGljdCA9IGZ1bmN0aW9uIChkaWN0KSB7XG4gICAgT2JqZWN0LmtleXMoZGljdCkuZm9yRWFjaChrID0+IHtcbiAgICAgICAgYXNzZXJ0KGsgaW4gdGhpcy5fZ2V0Q2hpbGRyZW4sIFwiVW5yZWNvZ25pemVkIGFjdGlvbiBuYW1lICdcIiArIGsgKyBcIidcIik7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IGRpY3Rba107XG4gICAgICAgIGFzc2VydCh0eXBlb2YgYWN0aW9uID09PSAnZnVuY3Rpb24nLCBcIktleSAnXCIgKyBrICsgXCInOiBleHBlY3RlZCBmdW5jdGlvbiwgZ290IFwiICsgYWN0aW9uKTtcbiAgICAgICAgaWYgKGsgaW4gdGhpcy5fYXJpdGllcykge1xuICAgICAgICAgICAgY29uc3QgZXhwZWN0ZWQgPSB0aGlzLl9hcml0aWVzW2tdO1xuICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gZGljdFtrXS5sZW5ndGg7XG4gICAgICAgICAgICBhc3NlcnQoYWN0dWFsID09PSBleHBlY3RlZCwgXCJBY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBleHBlY3RlZCBcIiArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuVmlzaXRvckZhbWlseS5wcm90b3R5cGUuYWRkT3BlcmF0aW9uID0gZnVuY3Rpb24gKHNpZ25hdHVyZSwgYWN0aW9ucykge1xuICAgIGNvbnN0IHNpZyA9IHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSk7XG4gICAgY29uc3QgbmFtZSA9IHNpZy5uYW1lO1xuICAgIHRoaXMuX2NoZWNrQWN0aW9uRGljdChhY3Rpb25zKTtcbiAgICB0aGlzLm9wZXJhdGlvbnNbbmFtZV0gPSB7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIGZvcm1hbHM6IHNpZy5mb3JtYWxzLFxuICAgICAgICBhY3Rpb25zXG4gICAgfTtcbiAgICBjb25zdCBmYW1pbHkgPSB0aGlzO1xuICAgIHRoaXMuQWRhcHRlci5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IHRhZyA9IGZhbWlseS5fZ2V0VGFnKHRoaXMuX2FkYXB0ZWUpO1xuICAgICAgICBhc3NlcnQodGFnIGluIGZhbWlseS5fZ2V0Q2hpbGRyZW4sIFwiZ2V0VGFnIHJldHVybmVkIHVucmVjb2duaXplZCB0YWcgJ1wiICsgdGFnICsgXCInXCIpO1xuICAgICAgICBhc3NlcnQodGFnIGluIGFjdGlvbnMsIFwiTm8gYWN0aW9uIGZvciAnXCIgKyB0YWcgKyBcIicgaW4gb3BlcmF0aW9uICdcIiArIG5hbWUgKyBcIidcIik7XG4gICAgICAgIC8vIENyZWF0ZSBhbiBcImFyZ3VtZW50cyBvYmplY3RcIiBmcm9tIHRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGlzXG4gICAgICAgIC8vIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZS5cbiAgICAgICAgY29uc3QgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW3NpZy5mb3JtYWxzW2ldXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRBcmdzID0gdGhpcy5hcmdzO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICBjb25zdCBhbnMgPSBhY3Rpb25zW3RhZ10uYXBwbHkodGhpcywgZmFtaWx5Ll9nZXRDaGlsZHJlblt0YWddKHRoaXMuX2FkYXB0ZWUsIGZhbWlseS5fd3JhcCkpO1xuICAgICAgICB0aGlzLmFyZ3MgPSBvbGRBcmdzO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFZpc2l0b3JGYW1pbHk7XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBWaXNpdG9yRmFtaWx5OiByZXF1aXJlKCcuL1Zpc2l0b3JGYW1pbHknKSxcbiAgICBzZW1hbnRpY3NGb3JUb0FTVDogcmVxdWlyZSgnLi9zZW1hbnRpY3MtdG9BU1QnKS5zZW1hbnRpY3MsXG4gICAgdG9BU1Q6IHJlcXVpcmUoJy4vc2VtYW50aWNzLXRvQVNUJykuaGVscGVyXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuLi9zcmMvcGV4cHJzJyk7XG5jb25zdCBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4uL3NyYy9NYXRjaFJlc3VsdCcpO1xuY29uc3QgR3JhbW1hciA9IHJlcXVpcmUoJy4uL3NyYy9HcmFtbWFyJyk7XG5jb25zdCBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBkZWZhdWx0T3BlcmF0aW9uID0ge1xuICAgIF90ZXJtaW5hbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgIH0sXG4gICAgX25vbnRlcm1pbmFsKGNoaWxkcmVuKSB7XG4gICAgICAgIGNvbnN0IGN0b3JOYW1lID0gdGhpcy5fbm9kZS5jdG9yTmFtZTtcbiAgICAgICAgY29uc3QgbWFwcGluZyA9IHRoaXMuYXJncy5tYXBwaW5nO1xuICAgICAgICAvLyB3aXRob3V0IGN1c3RvbWl6YXRpb25cbiAgICAgICAgaWYgKCFtYXBwaW5nLmhhc093blByb3BlcnR5KGN0b3JOYW1lKSkge1xuICAgICAgICAgICAgLy8gaW50ZXJtZWRpYXRlIG5vZGVcbiAgICAgICAgICAgIGlmICh0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFsdCB8fCB0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbGV4aWNhbCBydWxlXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xleGljYWwoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNpbmd1bGFyIG5vZGUgKGUuZy4gb25seSBzdXJyb3VuZGVkIGJ5IGxpdGVyYWxzIG9yIGxvb2thaGVhZHMpXG4gICAgICAgICAgICBjb25zdCByZWFsQ2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4gIWNoaWxkLmlzVGVybWluYWwoKSk7XG4gICAgICAgICAgICBpZiAocmVhbENoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsQ2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXN0OiB0ZXJtcyB3aXRoIG11bHRpcGxlIGNoaWxkcmVuXG4gICAgICAgIH1cbiAgICAgICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nW2N0b3JOYW1lXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlblttYXBwaW5nW2N0b3JOYW1lXV0udG9BU1QobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmFtZWQvbWFwcGVkIGNoaWxkcmVuIG9yIHVubmFtZWQgY2hpbGRyZW4gKCcwJywgJzEnLCAnMicsIC4uLilcbiAgICAgICAgY29uc3QgcHJvcE1hcCA9IG1hcHBpbmdbY3Rvck5hbWVdIHx8IGNoaWxkcmVuO1xuICAgICAgICBjb25zdCBub2RlID0ge1xuICAgICAgICAgICAgdHlwZTogY3Rvck5hbWVcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIHByb3BNYXApIHtcbiAgICAgICAgICAgIGNvbnN0IG1hcHBlZFByb3AgPSBtYXBwaW5nW2N0b3JOYW1lXSAmJiBtYXBwaW5nW2N0b3JOYW1lXVtwcm9wXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlblttYXBwZWRQcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXBwZWRQcm9wID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgICAgICAgICBtYXBwZWRQcm9wID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJpbWl0aXZlIHZhbHVlXG4gICAgICAgICAgICAgICAgbm9kZVtwcm9wXSA9IG1hcHBlZFByb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ29iamVjdCcgJiYgbWFwcGVkUHJvcCBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgICAgIC8vIHByaW1pdGl2ZSBudW1iZXIgKG11c3QgYmUgdW5ib3hlZClcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gTnVtYmVyKG1hcHBlZFByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlZCB2YWx1ZVxuICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBtYXBwZWRQcm9wLmNhbGwodGhpcywgY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWFwcGVkUHJvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuW3Byb3BdICYmICFjaGlsZHJlbltwcm9wXS5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVtwcm9wXSA9IGNoaWxkcmVuW3Byb3BdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsZXRlIHByZWRlZmluZWQgJ3R5cGUnIHByb3BlcnRpZXMsIGxpa2UgJ3R5cGUnLCBpZiBleHBsaWNpdGVseSByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuICAgIF9pdGVyKGNoaWxkcmVuKSB7XG4gICAgICAgIGlmICh0aGlzLl9ub2RlLmlzT3B0aW9uYWwoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubnVtQ2hpbGRyZW4gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlblswXS50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgTm9uZW1wdHlMaXN0T2YoZmlyc3QsIHNlcCwgcmVzdCkge1xuICAgICAgICByZXR1cm4gW2ZpcnN0LnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKV0uY29uY2F0KHJlc3QudG9BU1QodGhpcy5hcmdzLm1hcHBpbmcpKTtcbiAgICB9LFxuICAgIEVtcHR5TGlzdE9mKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufTtcbi8vIFJldHVybnMgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IGluY2x1ZGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIChBU1QpXG4vLyBmb3IgdGhlIGdpdmVuIG1hdGNoIHJlc3VsdCBgcmVzYCBjb250YWluZyBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIGFuZCBncmFtbWFyLlxuLy8gVGhlIG9wdGlvbmFsIGBtYXBwaW5nYCBwYXJhbWV0ZXIgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIGhvdyB0aGUgbm9kZXMgb2YgdGhlIENTVFxuLy8gYXJlIG1hcHBlZCB0byB0aGUgQVNUIChzZWUgL2RvYy9leHRyYXMubWQjdG9hc3RtYXRjaHJlc3VsdC1tYXBwaW5nKS5cbmZ1bmN0aW9uIHRvQVNUKHJlcywgbWFwcGluZykge1xuICAgIGlmICghKHJlcyBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSB8fCByZXMuZmFpbGVkKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0b0FTVCgpIGV4cGVjdHMgYSBzdWNjZXNmdWxsIE1hdGNoUmVzdWx0IGFzIGZpcnN0IHBhcmFtZXRlcicpO1xuICAgIH1cbiAgICBtYXBwaW5nID0gZXh0ZW5kKHt9LCBtYXBwaW5nKTtcbiAgICBjb25zdCBvcGVyYXRpb24gPSBleHRlbmQoe30sIGRlZmF1bHRPcGVyYXRpb24pO1xuICAgIGZvciAoY29uc3QgdGVybU5hbWUgaW4gbWFwcGluZykge1xuICAgICAgICBpZiAodHlwZW9mIG1hcHBpbmdbdGVybU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBvcGVyYXRpb25bdGVybU5hbWVdID0gbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgICAgICAgICBkZWxldGUgbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgZyA9IHJlcy5fY3N0LmdyYW1tYXI7XG4gICAgY29uc3QgcyA9IGcuY3JlYXRlU2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCd0b0FTVChtYXBwaW5nKScsIG9wZXJhdGlvbik7XG4gICAgcmV0dXJuIHMocmVzKS50b0FTVChtYXBwaW5nKTtcbn1cbi8vIFJldHVybnMgYSBzZW1hbnRpY3MgY29udGFpbmcgdGhlIHRvQVNUKG1hcHBpbmcpIG9wZXJhdGlvbiBmb3IgdGhlIGdpdmVuIGdyYW1tYXIgZy5cbmZ1bmN0aW9uIHNlbWFudGljc0ZvclRvQVNUKGcpIHtcbiAgICBpZiAoIShnIGluc3RhbmNlb2YgR3JhbW1hcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzZW1hbnRpY3NUb0FTVCgpIGV4cGVjdHMgYSBHcmFtbWFyIGFzIHBhcmFtZXRlcicpO1xuICAgIH1cbiAgICByZXR1cm4gZy5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3RvQVNUKG1hcHBpbmcpJywgZGVmYXVsdE9wZXJhdGlvbik7XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBoZWxwZXI6IHRvQVNULFxuICAgIHNlbWFudGljczogc2VtYW50aWNzRm9yVG9BU1Rcbn07XG4iLCIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIgKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqLmNvbnN0cnVjdG9yICE9IG51bGwgJiZcbiAgICB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IEdyYW1tYXJEZWNsID0gcmVxdWlyZSgnLi9HcmFtbWFyRGVjbCcpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gQnVpbGRlcigpIHsgfVxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gICAgY3VycmVudERlY2w6IG51bGwsXG4gICAgY3VycmVudFJ1bGVOYW1lOiBudWxsLFxuICAgIG5ld0dyYW1tYXIobmFtZSkge1xuICAgICAgICByZXR1cm4gbmV3IEdyYW1tYXJEZWNsKG5hbWUpO1xuICAgIH0sXG4gICAgZ3JhbW1hcihtZXRhSW5mbywgbmFtZSwgc3VwZXJHcmFtbWFyLCBkZWZhdWx0U3RhcnRSdWxlLCBydWxlcykge1xuICAgICAgICBjb25zdCBnRGVjbCA9IG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgICAgICAgaWYgKHN1cGVyR3JhbW1hcikge1xuICAgICAgICAgICAgZ0RlY2wud2l0aFN1cGVyR3JhbW1hcih0aGlzLmZyb21SZWNpcGUoc3VwZXJHcmFtbWFyKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgICAgICAgIGdEZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGRlZmF1bHRTdGFydFJ1bGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXRhSW5mbyAmJiBtZXRhSW5mby5zb3VyY2UpIHtcbiAgICAgICAgICAgIGdEZWNsLndpdGhTb3VyY2UobWV0YUluZm8uc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnREZWNsID0gZ0RlY2w7XG4gICAgICAgIE9iamVjdC5rZXlzKHJ1bGVzKS5mb3JFYWNoKHJ1bGVOYW1lID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICAgICAgICBjb25zdCBydWxlUmVjaXBlID0gcnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gcnVsZVJlY2lwZVswXTsgLy8gZGVmaW5lL2V4dGVuZC9vdmVycmlkZVxuICAgICAgICAgICAgY29uc3QgbWV0YUluZm8gPSBydWxlUmVjaXBlWzFdO1xuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBydWxlUmVjaXBlWzJdO1xuICAgICAgICAgICAgY29uc3QgZm9ybWFscyA9IHJ1bGVSZWNpcGVbM107XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy5mcm9tUmVjaXBlKHJ1bGVSZWNpcGVbNF0pO1xuICAgICAgICAgICAgbGV0IHNvdXJjZTtcbiAgICAgICAgICAgIGlmIChnRGVjbC5zb3VyY2UgJiYgbWV0YUluZm8gJiYgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBnRGVjbC5zb3VyY2Uuc3ViSW50ZXJ2YWwobWV0YUluZm8uc291cmNlSW50ZXJ2YWxbMF0sIG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzFdIC0gbWV0YUluZm8uc291cmNlSW50ZXJ2YWxbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ0RlY2xbYWN0aW9uXShydWxlTmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRSdWxlTmFtZSA9IHRoaXMuY3VycmVudERlY2wgPSBudWxsO1xuICAgICAgICByZXR1cm4gZ0RlY2wuYnVpbGQoKTtcbiAgICB9LFxuICAgIHRlcm1pbmFsKHgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuVGVybWluYWwoeCk7XG4gICAgfSxcbiAgICByYW5nZShmcm9tLCB0bykge1xuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5SYW5nZShmcm9tLCB0byk7XG4gICAgfSxcbiAgICBwYXJhbShpbmRleCkge1xuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gICAgfSxcbiAgICBhbHQoIC8qIHRlcm0xLCB0ZXJtMiwgLi4uICovKSB7XG4gICAgICAgIGxldCB0ZXJtcyA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgbGV0IGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgICAgICAgaWYgKCEoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgICAgIGFyZyA9IHRoaXMuZnJvbVJlY2lwZShhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5BbHQpIHtcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBwZXhwcnMuQWx0KHRlcm1zKTtcbiAgICB9LFxuICAgIHNlcSggLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgICAgIGxldCBmYWN0b3JzID0gW107XG4gICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICBsZXQgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICAgICAgICBpZiAoIShhcmcgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICAgICAgYXJnID0gdGhpcy5mcm9tUmVjaXBlKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICAgICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmYWN0b3JzLnB1c2goYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IHBleHBycy5TZXEoZmFjdG9ycyk7XG4gICAgfSxcbiAgICBzdGFyKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuU3RhcihleHByKTtcbiAgICB9LFxuICAgIHBsdXMoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5QbHVzKGV4cHIpO1xuICAgIH0sXG4gICAgb3B0KGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuT3B0KGV4cHIpO1xuICAgIH0sXG4gICAgbm90KGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuTm90KGV4cHIpO1xuICAgIH0sXG4gICAgbGEoZXhwcikge1xuICAgICAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgdG8gc3RpbGwgYmUgYWJsZSB0byByZWFkIG9sZCByZWNpcGVzXG4gICAgICAgIHJldHVybiB0aGlzLmxvb2thaGVhZChleHByKTtcbiAgICB9LFxuICAgIGxvb2thaGVhZChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLkxvb2thaGVhZChleHByKTtcbiAgICB9LFxuICAgIGxleChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLkxleChleHByKTtcbiAgICB9LFxuICAgIGFwcChydWxlTmFtZSwgb3B0UGFyYW1zKSB7XG4gICAgICAgIGlmIChvcHRQYXJhbXMgJiYgb3B0UGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG9wdFBhcmFtcyA9IG9wdFBhcmFtcy5tYXAoZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByID8gcGFyYW0gOiB0aGlzLmZyb21SZWNpcGUocGFyYW0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUsIG9wdFBhcmFtcyk7XG4gICAgfSxcbiAgICAvLyBOb3RlIHRoYXQgdW5saWtlIG90aGVyIG1ldGhvZHMgaW4gdGhpcyBjbGFzcywgdGhpcyBtZXRob2QgY2Fubm90IGJlIHVzZWQgYXMgYVxuICAgIC8vIGNvbnZlbmllbmNlIGNvbnN0cnVjdG9yLiBJdCBvbmx5IHdvcmtzIHdpdGggcmVjaXBlcywgYmVjYXVzZSBpdCByZWxpZXMgb25cbiAgICAvLyBgdGhpcy5jdXJyZW50RGVjbGAgYW5kIGB0aGlzLmN1cnJlbnRSdWxlTmFtZWAgYmVpbmcgc2V0LlxuICAgIHNwbGljZShiZWZvcmVUZXJtcywgYWZ0ZXJUZXJtcykge1xuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5TcGxpY2UodGhpcy5jdXJyZW50RGVjbC5zdXBlckdyYW1tYXIsIHRoaXMuY3VycmVudFJ1bGVOYW1lLCBiZWZvcmVUZXJtcy5tYXAodGVybSA9PiB0aGlzLmZyb21SZWNpcGUodGVybSkpLCBhZnRlclRlcm1zLm1hcCh0ZXJtID0+IHRoaXMuZnJvbVJlY2lwZSh0ZXJtKSkpO1xuICAgIH0sXG4gICAgZnJvbVJlY2lwZShyZWNpcGUpIHtcbiAgICAgICAgLy8gdGhlIG1ldGEtaW5mbyBvZiAnZ3JhbW1hcicgaXMgcHJvY2Vzc2VkIGluIEJ1aWxkZXIuZ3JhbW1hclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzW3JlY2lwZVswXV0uYXBwbHkodGhpcywgcmVjaXBlWzBdID09PSAnZ3JhbW1hcicgPyByZWNpcGUuc2xpY2UoMSkgOiByZWNpcGUuc2xpY2UoMikpO1xuICAgICAgICBjb25zdCBtZXRhSW5mbyA9IHJlY2lwZVsxXTtcbiAgICAgICAgaWYgKG1ldGFJbmZvKSB7XG4gICAgICAgICAgICBpZiAobWV0YUluZm8uc291cmNlSW50ZXJ2YWwgJiYgdGhpcy5jdXJyZW50RGVjbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC53aXRoU291cmNlKHRoaXMuY3VycmVudERlY2wuc291cmNlSW50ZXJ2YWwuYXBwbHkodGhpcy5jdXJyZW50RGVjbCwgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgRmFpbHVyZSA9IHJlcXVpcmUoJy4vRmFpbHVyZScpO1xuY29uc3QgVGVybWluYWxOb2RlID0gcmVxdWlyZSgnLi9ub2RlcycpLlRlcm1pbmFsTm9kZTtcbmNvbnN0IGFzc2VydCA9IHJlcXVpcmUoJy4vY29tbW9uJykuYXNzZXJ0O1xuY29uc3QgeyBQRXhwciwgVGVybWluYWwgfSA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5jbGFzcyBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCBleHRlbmRzIFBFeHByIHtcbiAgICBjb25zdHJ1Y3RvcihwYXJhbSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm9iaiA9IHBhcmFtO1xuICAgIH1cbiAgICBfZ2V0U3RyaW5nKHN0YXRlKSB7XG4gICAgICAgIGNvbnN0IHRlcm1pbmFsID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLm9iai5pbmRleF07XG4gICAgICAgIGFzc2VydCh0ZXJtaW5hbCBpbnN0YW5jZW9mIFRlcm1pbmFsLCAnZXhwZWN0ZWQgYSBUZXJtaW5hbCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbC5vYmo7XG4gICAgfVxuICAgIC8vIEltcGxlbWVudGF0aW9uIG9mIHRoZSBQRXhwciBBUElcbiAgICBhbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZXZhbChzdGF0ZSkge1xuICAgICAgICBjb25zdCBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgICAgICBjb25zdCBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgICBjb25zdCBtYXRjaFN0ciA9IHRoaXMuX2dldFN0cmluZyhzdGF0ZSk7XG4gICAgICAgIGlmICghaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcobWF0Y2hTdHIsIHRydWUpKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgbWF0Y2hTdHIpLCBvcmlnUG9zKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldEFyaXR5KCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwodGhpcy5vYmouc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSk7XG4gICAgfVxuICAgIHRvRGlzcGxheVN0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLnRvRGlzcGxheVN0cmluZygpICsgJyAoY2FzZS1pbnNlbnNpdGl2ZSknO1xuICAgIH1cbiAgICB0b0ZhaWx1cmUoZ3JhbW1hcikge1xuICAgICAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgdGhpcy5vYmoudG9GYWlsdXJlKGdyYW1tYXIpICsgJyAoY2FzZS1pbnNlbnNpdGl2ZSknLCAnZGVzY3JpcHRpb24nKTtcbiAgICB9XG4gICAgX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbykge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gICAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgYEZhaWx1cmVgcyByZXByZXNlbnQgZXhwcmVzc2lvbnMgdGhhdCB3ZXJlbid0IG1hdGNoZWQgd2hpbGUgcGFyc2luZy4gVGhleSBhcmUgdXNlZCB0byBnZW5lcmF0ZVxuICBlcnJvciBtZXNzYWdlcyBhdXRvbWF0aWNhbGx5LiBUaGUgaW50ZXJmYWNlIG9mIGBGYWlsdXJlYHMgaW5jbHVkZXMgdGhlIGNvbGxvd2luZyBtZXRob2RzOlxuXG4gIC0gZ2V0VGV4dCgpIDogU3RyaW5nXG4gIC0gZ2V0VHlwZSgpIDogU3RyaW5nICAob25lIG9mIHtcImRlc2NyaXB0aW9uXCIsIFwic3RyaW5nXCIsIFwiY29kZVwifSlcbiAgLSBpc0Rlc2NyaXB0aW9uKCkgOiBib29sXG4gIC0gaXNTdHJpbmdUZXJtaW5hbCgpIDogYm9vbFxuICAtIGlzQ29kZSgpIDogYm9vbFxuICAtIGlzRmx1ZmZ5KCkgOiBib29sXG4gIC0gbWFrZUZsdWZmeSgpIDogdm9pZFxuICAtIHN1YnN1bWVzKEZhaWx1cmUpIDogYm9vbFxuKi9cbmZ1bmN0aW9uIGlzVmFsaWRUeXBlKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJyB8fCB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnY29kZSc7XG59XG5mdW5jdGlvbiBGYWlsdXJlKHBleHByLCB0ZXh0LCB0eXBlKSB7XG4gICAgaWYgKCFpc1ZhbGlkVHlwZSh0eXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgRmFpbHVyZSB0eXBlOiAnICsgdHlwZSk7XG4gICAgfVxuICAgIHRoaXMucGV4cHIgPSBwZXhwcjtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn1cbkZhaWx1cmUucHJvdG90eXBlLmdldFBFeHByID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnBleHByO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dDtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGU7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuaXNEZXNjcmlwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSAnZGVzY3JpcHRpb24nO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmlzU3RyaW5nVGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZyc7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuaXNDb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdjb2RlJztcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5pc0ZsdWZmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5mbHVmZnk7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUubWFrZUZsdWZmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZsdWZmeSA9IHRydWU7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuY2xlYXJGbHVmZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5zdWJzdW1lcyA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgcmV0dXJuICh0aGlzLmdldFRleHQoKSA9PT0gdGhhdC5nZXRUZXh0KCkgJiZcbiAgICAgICAgdGhpcy50eXBlID09PSB0aGF0LnR5cGUgJiZcbiAgICAgICAgKCF0aGlzLmlzRmx1ZmZ5KCkgfHwgKHRoaXMuaXNGbHVmZnkoKSAmJiB0aGF0LmlzRmx1ZmZ5KCkpKSk7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFRleHQoKSkgOiB0aGlzLmdldFRleHQoKTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBmYWlsdXJlID0gbmV3IEZhaWx1cmUodGhpcy5wZXhwciwgdGhpcy50ZXh0LCB0aGlzLnR5cGUpO1xuICAgIGlmICh0aGlzLmlzRmx1ZmZ5KCkpIHtcbiAgICAgICAgZmFpbHVyZS5tYWtlRmx1ZmZ5KCk7XG4gICAgfVxuICAgIHJldHVybiBmYWlsdXJlO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLnRvS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCkgKyAnIycgKyB0aGlzLnR5cGU7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEZhaWx1cmU7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsID0gcmVxdWlyZSgnLi9DYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCcpO1xuY29uc3QgTWF0Y2hlciA9IHJlcXVpcmUoJy4vTWF0Y2hlcicpO1xuY29uc3QgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0U29ydGVkUnVsZVZhbHVlcyhncmFtbWFyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZXMpXG4gICAgICAgIC5zb3J0KClcbiAgICAgICAgLm1hcChuYW1lID0+IGdyYW1tYXIucnVsZXNbbmFtZV0pO1xufVxuZnVuY3Rpb24gR3JhbW1hcihuYW1lLCBzdXBlckdyYW1tYXIsIHJ1bGVzLCBvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gICAgaWYgKG9wdERlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgICAgaWYgKCEob3B0RGVmYXVsdFN0YXJ0UnVsZSBpbiBydWxlcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3RhcnQgcnVsZTogJ1wiICtcbiAgICAgICAgICAgICAgICBvcHREZWZhdWx0U3RhcnRSdWxlICtcbiAgICAgICAgICAgICAgICBcIicgaXMgbm90IGEgcnVsZSBpbiBncmFtbWFyICdcIiArXG4gICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IG9wdERlZmF1bHRTdGFydFJ1bGU7XG4gICAgfVxufVxubGV0IG9obUdyYW1tYXI7XG5sZXQgYnVpbGRHcmFtbWFyO1xuLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gbWFpbi5qcyBvbmNlIE9obSBoYXMgbG9hZGVkLlxuR3JhbW1hci5pbml0QXBwbGljYXRpb25QYXJzZXIgPSBmdW5jdGlvbiAoZ3JhbW1hciwgYnVpbGRlckZuKSB7XG4gICAgb2htR3JhbW1hciA9IGdyYW1tYXI7XG4gICAgYnVpbGRHcmFtbWFyID0gYnVpbGRlckZuO1xufTtcbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICAgIG1hdGNoZXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0Y2hlcih0aGlzKTtcbiAgICB9LFxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBncmFtbWFyIGlzIGEgYnVpbHQtaW4gZ3JhbW1hciwgb3RoZXJ3aXNlIGZhbHNlLlxuICAgIC8vIE5PVEU6IFRoaXMgbWlnaHQgZ2l2ZSBhbiB1bmV4cGVjdGVkIHJlc3VsdCBpZiBjYWxsZWQgYmVmb3JlIEJ1aWx0SW5SdWxlcyBpcyBkZWZpbmVkIVxuICAgIGlzQnVpbHRJbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgPT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgfHwgdGhpcyA9PT0gR3JhbW1hci5CdWlsdEluUnVsZXM7XG4gICAgfSxcbiAgICBlcXVhbHMoZykge1xuICAgICAgICBpZiAodGhpcyA9PT0gZykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gdGhlIGNoZWFwZXN0IGNvbXBhcmlzb25zIGZpcnN0LlxuICAgICAgICBpZiAoZyA9PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLm5hbWUgIT09IGcubmFtZSB8fFxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlICE9PSBnLmRlZmF1bHRTdGFydFJ1bGUgfHxcbiAgICAgICAgICAgICEodGhpcy5zdXBlckdyYW1tYXIgPT09IGcuc3VwZXJHcmFtbWFyIHx8IHRoaXMuc3VwZXJHcmFtbWFyLmVxdWFscyhnLnN1cGVyR3JhbW1hcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbXlSdWxlcyA9IGdldFNvcnRlZFJ1bGVWYWx1ZXModGhpcyk7XG4gICAgICAgIGNvbnN0IG90aGVyUnVsZXMgPSBnZXRTb3J0ZWRSdWxlVmFsdWVzKGcpO1xuICAgICAgICByZXR1cm4gKG15UnVsZXMubGVuZ3RoID09PSBvdGhlclJ1bGVzLmxlbmd0aCAmJlxuICAgICAgICAgICAgbXlSdWxlcy5ldmVyeSgocnVsZSwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAocnVsZS5kZXNjcmlwdGlvbiA9PT0gb3RoZXJSdWxlc1tpXS5kZXNjcmlwdGlvbiAmJlxuICAgICAgICAgICAgICAgICAgICBydWxlLmZvcm1hbHMuam9pbignLCcpID09PSBvdGhlclJ1bGVzW2ldLmZvcm1hbHMuam9pbignLCcpICYmXG4gICAgICAgICAgICAgICAgICAgIHJ1bGUuYm9keS50b1N0cmluZygpID09PSBvdGhlclJ1bGVzW2ldLmJvZHkudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICB9KSk7XG4gICAgfSxcbiAgICBtYXRjaChpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgICAgICBjb25zdCBtID0gdGhpcy5tYXRjaGVyKCk7XG4gICAgICAgIG0ucmVwbGFjZUlucHV0UmFuZ2UoMCwgMCwgaW5wdXQpO1xuICAgICAgICByZXR1cm4gbS5tYXRjaChvcHRTdGFydEFwcGxpY2F0aW9uKTtcbiAgICB9LFxuICAgIHRyYWNlKGlucHV0LCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgICAgIGNvbnN0IG0gPSB0aGlzLm1hdGNoZXIoKTtcbiAgICAgICAgbS5yZXBsYWNlSW5wdXRSYW5nZSgwLCAwLCBpbnB1dCk7XG4gICAgICAgIHJldHVybiBtLnRyYWNlKG9wdFN0YXJ0QXBwbGljYXRpb24pO1xuICAgIH0sXG4gICAgY3JlYXRlU2VtYW50aWNzKCkge1xuICAgICAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzKTtcbiAgICB9LFxuICAgIGV4dGVuZFNlbWFudGljcyhzdXBlclNlbWFudGljcykge1xuICAgICAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzLCBzdXBlclNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCkpO1xuICAgIH0sXG4gICAgLy8gQ2hlY2sgdGhhdCBldmVyeSBrZXkgaW4gYGFjdGlvbkRpY3RgIGNvcnJlc3BvbmRzIHRvIGEgc2VtYW50aWMgYWN0aW9uLCBhbmQgdGhhdCBpdCBtYXBzIHRvXG4gICAgLy8gYSBmdW5jdGlvbiBvZiB0aGUgY29ycmVjdCBhcml0eS4gSWYgbm90LCB0aHJvdyBhbiBleGNlcHRpb24uXG4gICAgX2NoZWNrVG9wRG93bkFjdGlvbkRpY3Qod2hhdCwgbmFtZSwgYWN0aW9uRGljdCkge1xuICAgICAgICBmdW5jdGlvbiBpc1NwZWNpYWxBY3Rpb24oYSkge1xuICAgICAgICAgICAgcmV0dXJuIGEgPT09ICdfaXRlcicgfHwgYSA9PT0gJ190ZXJtaW5hbCcgfHwgYSA9PT0gJ19ub250ZXJtaW5hbCcgfHwgYSA9PT0gJ19kZWZhdWx0JztcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBwcm9ibGVtcyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGsgaW4gYWN0aW9uRGljdCkge1xuICAgICAgICAgICAgY29uc3QgdiA9IGFjdGlvbkRpY3Rba107XG4gICAgICAgICAgICBpZiAoIWlzU3BlY2lhbEFjdGlvbihrKSAmJiAhKGsgaW4gdGhpcy5ydWxlcykpIHtcbiAgICAgICAgICAgICAgICBwcm9ibGVtcy5wdXNoKFwiJ1wiICsgayArIFwiJyBpcyBub3QgYSB2YWxpZCBzZW1hbnRpYyBhY3Rpb24gZm9yICdcIiArIHRoaXMubmFtZSArIFwiJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgcHJvYmxlbXMucHVzaChcIidcIiArIGsgKyBcIicgbXVzdCBiZSBhIGZ1bmN0aW9uIGluIGFuIGFjdGlvbiBkaWN0aW9uYXJ5IGZvciAnXCIgKyB0aGlzLm5hbWUgKyBcIidcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWwgPSB2Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBleHBlY3RlZCA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShrKTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ibGVtcy5wdXNoKFwiU2VtYW50aWMgYWN0aW9uICdcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBrICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAnZXhwZWN0ZWQgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAnLCBnb3QgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvYmxlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3QgcHJldHR5UHJvYmxlbXMgPSBwcm9ibGVtcy5tYXAocHJvYmxlbSA9PiAnLSAnICsgcHJvYmxlbSk7XG4gICAgICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBFcnJvcihcIkZvdW5kIGVycm9ycyBpbiB0aGUgYWN0aW9uIGRpY3Rpb25hcnkgb2YgdGhlICdcIiArXG4gICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgXCInIFwiICtcbiAgICAgICAgICAgICAgICB3aGF0ICtcbiAgICAgICAgICAgICAgICAnOlxcbicgK1xuICAgICAgICAgICAgICAgIHByZXR0eVByb2JsZW1zLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgICAgIGVycm9yLnByb2JsZW1zID0gcHJvYmxlbXM7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gUmV0dXJuIHRoZSBleHBlY3RlZCBhcml0eSBmb3IgYSBzZW1hbnRpYyBhY3Rpb24gbmFtZWQgYGFjdGlvbk5hbWVgLCB3aGljaFxuICAgIC8vIGlzIGVpdGhlciBhIHJ1bGUgbmFtZSBvciBhIHNwZWNpYWwgYWN0aW9uIG5hbWUgbGlrZSAnX25vbnRlcm1pbmFsJy5cbiAgICBfdG9wRG93bkFjdGlvbkFyaXR5KGFjdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdfaXRlcicgfHwgYWN0aW9uTmFtZSA9PT0gJ19ub250ZXJtaW5hbCcgfHwgYWN0aW9uTmFtZSA9PT0gJ19kZWZhdWx0Jykge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ190ZXJtaW5hbCcpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVzW2FjdGlvbk5hbWVdLmJvZHkuZ2V0QXJpdHkoKTtcbiAgICB9LFxuICAgIF9pbmhlcml0c0Zyb20oZ3JhbW1hcikge1xuICAgICAgICBsZXQgZyA9IHRoaXMuc3VwZXJHcmFtbWFyO1xuICAgICAgICB3aGlsZSAoZykge1xuICAgICAgICAgICAgaWYgKGcuZXF1YWxzKGdyYW1tYXIsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnID0gZy5zdXBlckdyYW1tYXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgdG9SZWNpcGUob3B0VmFyTmFtZSkge1xuICAgICAgICBjb25zdCBtZXRhSW5mbyA9IHt9O1xuICAgICAgICAvLyBJbmNsdWRlIHRoZSBncmFtbWFyIHNvdXJjZSBpZiBpdCBpcyBhdmFpbGFibGUuXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgICAgICAgbWV0YUluZm8uc291cmNlID0gdGhpcy5zb3VyY2UuY29udGVudHM7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN1cGVyR3JhbW1hciA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiAhdGhpcy5zdXBlckdyYW1tYXIuaXNCdWlsdEluKCkpIHtcbiAgICAgICAgICAgIHN1cGVyR3JhbW1hciA9IEpTT04ucGFyc2UodGhpcy5zdXBlckdyYW1tYXIudG9SZWNpcGUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0UnVsZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgICAgICAgIHN0YXJ0UnVsZSA9IHRoaXMuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBydWxlcyA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJ1bGVzKS5mb3JFYWNoKHJ1bGVOYW1lID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJ1bGVJbmZvID0gdGhpcy5ydWxlc1tydWxlTmFtZV07XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gcnVsZUluZm8uYm9keTtcbiAgICAgICAgICAgIGNvbnN0IGlzRGVmaW5pdGlvbiA9ICF0aGlzLnN1cGVyR3JhbW1hciB8fCAhdGhpcy5zdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgbGV0IG9wZXJhdGlvbjtcbiAgICAgICAgICAgIGlmIChpc0RlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAnZGVmaW5lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9IGJvZHkgaW5zdGFuY2VvZiBwZXhwcnMuRXh0ZW5kID8gJ2V4dGVuZCcgOiAnb3ZlcnJpZGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWV0YUluZm8gPSB7fTtcbiAgICAgICAgICAgIGlmIChydWxlSW5mby5zb3VyY2UgJiYgdGhpcy5zb3VyY2UpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhZGp1c3RlZCA9IHJ1bGVJbmZvLnNvdXJjZS5yZWxhdGl2ZVRvKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCA9IFthZGp1c3RlZC5zdGFydElkeCwgYWRqdXN0ZWQuZW5kSWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gaXNEZWZpbml0aW9uID8gcnVsZUluZm8uZGVzY3JpcHRpb24gOiBudWxsO1xuICAgICAgICAgICAgY29uc3QgYm9keVJlY2lwZSA9IGJvZHkub3V0cHV0UmVjaXBlKHJ1bGVJbmZvLmZvcm1hbHMsIHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIHJ1bGVzW3J1bGVOYW1lXSA9IFtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgbWV0YUluZm8sXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgcnVsZUluZm8uZm9ybWFscyxcbiAgICAgICAgICAgICAgICBib2R5UmVjaXBlXG4gICAgICAgICAgICBdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFsnZ3JhbW1hcicsIG1ldGFJbmZvLCB0aGlzLm5hbWUsIHN1cGVyR3JhbW1hciwgc3RhcnRSdWxlLCBydWxlc10pO1xuICAgIH0sXG4gICAgLy8gVE9ETzogQ29tZSB1cCB3aXRoIGJldHRlciBuYW1lcyBmb3IgdGhlc2UgbWV0aG9kcy5cbiAgICAvLyBUT0RPOiBXcml0ZSB0aGUgYW5hbG9nIG9mIHRoZXNlIG1ldGhvZHMgZm9yIGluaGVyaXRlZCBhdHRyaWJ1dGVzLlxuICAgIHRvT3BlcmF0aW9uQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICAgIH0sXG4gICAgdG9BdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gICAgfSxcbiAgICBfdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpIHtcbiAgICAgICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByX3BsdXNcbiAgICAgICAgLy8gc2hvdWxkIGFwcGVhciBuZXh0IHRvIG90aGVyIGNhc2VzIG9mIEFkZEV4cHIuXG4gICAgICAgIGNvbnN0IHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICAgICAgc2IuYXBwZW5kKCd7Jyk7XG4gICAgICAgIGxldCBmaXJzdCA9IHRydWU7XG4gICAgICAgIGZvciAoY29uc3QgcnVsZU5hbWUgaW4gdGhpcy5ydWxlcykge1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IHRoaXMucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2IuYXBwZW5kKCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgICAgICAgICAgc2IuYXBwZW5kKCcgICcpO1xuICAgICAgICAgICAgdGhpcy5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBzYik7XG4gICAgICAgIH1cbiAgICAgICAgc2IuYXBwZW5kKCdcXG59Jyk7XG4gICAgICAgIHJldHVybiBzYi5jb250ZW50cygpO1xuICAgIH0sXG4gICAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZShydWxlTmFtZSwgYm9keSwgc2IpIHtcbiAgICAgICAgc2IuYXBwZW5kKHJ1bGVOYW1lKTtcbiAgICAgICAgc2IuYXBwZW5kKCc6IGZ1bmN0aW9uKCcpO1xuICAgICAgICBjb25zdCBhcml0eSA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShydWxlTmFtZSk7XG4gICAgICAgIHNiLmFwcGVuZChjb21tb24ucmVwZWF0KCdfJywgYXJpdHkpLmpvaW4oJywgJykpO1xuICAgICAgICBzYi5hcHBlbmQoJykge1xcbicpO1xuICAgICAgICBzYi5hcHBlbmQoJyAgfScpO1xuICAgIH0sXG4gICAgLy8gUGFyc2UgYSBzdHJpbmcgd2hpY2ggZXhwcmVzc2VzIGEgcnVsZSBhcHBsaWNhdGlvbiBpbiB0aGlzIGdyYW1tYXIsIGFuZCByZXR1cm4gdGhlXG4gICAgLy8gcmVzdWx0aW5nIEFwcGx5IG5vZGUuXG4gICAgcGFyc2VBcHBsaWNhdGlvbihzdHIpIHtcbiAgICAgICAgbGV0IGFwcDtcbiAgICAgICAgaWYgKHN0ci5pbmRleE9mKCc8JykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBzaW1wbGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgIGFwcCA9IG5ldyBwZXhwcnMuQXBwbHkoc3RyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlcml6ZWQgYXBwbGljYXRpb25cbiAgICAgICAgICAgIGNvbnN0IGNzdCA9IG9obUdyYW1tYXIubWF0Y2goc3RyLCAnQmFzZV9hcHBsaWNhdGlvbicpO1xuICAgICAgICAgICAgYXBwID0gYnVpbGRHcmFtbWFyKGNzdCwge30pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHBsaWNhdGlvbiBpcyB2YWxpZC5cbiAgICAgICAgaWYgKCEoYXBwLnJ1bGVOYW1lIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZFJ1bGUoYXBwLnJ1bGVOYW1lLCB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZvcm1hbHMgPSB0aGlzLnJ1bGVzW2FwcC5ydWxlTmFtZV0uZm9ybWFscztcbiAgICAgICAgaWYgKGZvcm1hbHMubGVuZ3RoICE9PSBhcHAuYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMucnVsZXNbYXBwLnJ1bGVOYW1lXS5zb3VyY2U7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMud3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMoYXBwLnJ1bGVOYW1lLCBmb3JtYWxzLmxlbmd0aCwgYXBwLmFyZ3MubGVuZ3RoLCBzb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHA7XG4gICAgfVxufTtcbi8vIFRoZSBmb2xsb3dpbmcgZ3JhbW1hciBjb250YWlucyBhIGZldyBydWxlcyB0aGF0IGNvdWxkbid0IGJlIHdyaXR0ZW4gIGluIFwidXNlcmxhbmRcIi5cbi8vIEF0IHRoZSBib3R0b20gb2Ygc3JjL21haW4uanMsIHdlIGNyZWF0ZSBhIHN1Yi1ncmFtbWFyIG9mIHRoaXMgZ3JhbW1hciB0aGF0J3MgY2FsbGVkXG4vLyBgQnVpbHRJblJ1bGVzYC4gVGhhdCBncmFtbWFyIGNvbnRhaW5zIHNldmVyYWwgY29udmVuaWVuY2UgcnVsZXMsIGUuZy4sIGBsZXR0ZXJgIGFuZFxuLy8gYGRpZ2l0YCwgYW5kIGlzIGltcGxpY2l0bHkgdGhlIHN1cGVyLWdyYW1tYXIgb2YgYW55IGdyYW1tYXIgd2hvc2Ugc3VwZXItZ3JhbW1hclxuLy8gaXNuJ3Qgc3BlY2lmaWVkLlxuR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA9IG5ldyBHcmFtbWFyKCdQcm90b0J1aWx0SW5SdWxlcycsIC8vIG5hbWVcbnVuZGVmaW5lZCwgLy8gc3VwZXJncmFtbWFyXG57XG4gICAgYW55OiB7XG4gICAgICAgIGJvZHk6IHBleHBycy5hbnksXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2FueSBjaGFyYWN0ZXInLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIGVuZDoge1xuICAgICAgICBib2R5OiBwZXhwcnMuZW5kLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdlbmQgb2YgaW5wdXQnLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIGNhc2VJbnNlbnNpdGl2ZToge1xuICAgICAgICBib2R5OiBuZXcgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwobmV3IHBleHBycy5QYXJhbSgwKSksXG4gICAgICAgIGZvcm1hbHM6IFsnc3RyJ10sXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgbG93ZXI6IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5Vbmljb2RlQ2hhcignTGwnKSxcbiAgICAgICAgZm9ybWFsczogW10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYSBsb3dlcmNhc2UgbGV0dGVyJyxcbiAgICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICB1cHBlcjoge1xuICAgICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdScpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhbiB1cHBlcmNhc2UgbGV0dGVyJyxcbiAgICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICAvLyBVbmlvbiBvZiBMdCAodGl0bGVjYXNlKSwgTG0gKG1vZGlmaWVyKSwgYW5kIExvIChvdGhlciksIGkuZS4gYW55IGxldHRlciBub3QgaW4gTGwgb3IgTHUuXG4gICAgdW5pY29kZUx0bW86IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5Vbmljb2RlQ2hhcignTHRtbycpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhIFVuaWNvZGUgY2hhcmFjdGVyIGluIEx0LCBMbSwgb3IgTG8nLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIC8vIFRoZXNlIHJ1bGVzIGFyZSBub3QgdHJ1bHkgcHJpbWl0aXZlICh0aGV5IGNvdWxkIGJlIHdyaXR0ZW4gaW4gdXNlcmxhbmQpIGJ1dCBhcmUgZGVmaW5lZFxuICAgIC8vIGhlcmUgZm9yIGJvb3RzdHJhcHBpbmcgcHVycG9zZXMuXG4gICAgc3BhY2VzOiB7XG4gICAgICAgIGJvZHk6IG5ldyBwZXhwcnMuU3RhcihuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZScpKSxcbiAgICAgICAgZm9ybWFsczogW11cbiAgICB9LFxuICAgIHNwYWNlOiB7XG4gICAgICAgIGJvZHk6IG5ldyBwZXhwcnMuUmFuZ2UoJ1xceDAwJywgJyAnKSxcbiAgICAgICAgZm9ybWFsczogW10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYSBzcGFjZSdcbiAgICB9XG59KTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG5jb25zdCBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0nKTtcbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gQ29uc3RydWN0b3JzXG5mdW5jdGlvbiBHcmFtbWFyRGVjbChuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbn1cbi8vIEhlbHBlcnNcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5zb3VyY2VJbnRlcnZhbCA9IGZ1bmN0aW9uIChzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgcmV0dXJuIHRoaXMuc291cmNlLnN1YkludGVydmFsKHN0YXJ0SWR4LCBlbmRJZHggLSBzdGFydElkeCk7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLmVuc3VyZVN1cGVyR3JhbW1hciA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuc3VwZXJHcmFtbWFyKSB7XG4gICAgICAgIHRoaXMud2l0aFN1cGVyR3JhbW1hcihcbiAgICAgICAgLy8gVE9ETzogVGhlIGNvbmRpdGlvbmFsIGV4cHJlc3Npb24gYmVsb3cgaXMgYW4gdWdseSBoYWNrLiBJdCdzIGtpbmQgb2Ygb2sgYmVjYXVzZVxuICAgICAgICAvLyBJIGRvdWJ0IGFueW9uZSB3aWxsIGV2ZXIgdHJ5IHRvIGRlY2xhcmUgYSBncmFtbWFyIGNhbGxlZCBgQnVpbHRJblJ1bGVzYC4gU3RpbGwsXG4gICAgICAgIC8vIHdlIHNob3VsZCB0cnkgdG8gZmluZCBhIGJldHRlciB3YXkgdG8gZG8gdGhpcy5cbiAgICAgICAgdGhpcy5uYW1lID09PSAnQnVpbHRJblJ1bGVzJyA/IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgOiBHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hcjtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZW5zdXJlU3VwZXJHcmFtbWFyUnVsZUZvck92ZXJyaWRpbmcgPSBmdW5jdGlvbiAobmFtZSwgc291cmNlKSB7XG4gICAgY29uc3QgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICAgIGlmICghcnVsZUluZm8pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVJbmZvO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGJvZHksIHNvdXJjZSkge1xuICAgIGNvbnN0IGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gICAgaWYgKGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBzb3VyY2UpO1xuICAgIH1cbiAgICBjb25zdCBydWxlSW5mbyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZXNbbmFtZV07XG4gICAgY29uc3QgZXhwZWN0ZWRGb3JtYWxzID0gcnVsZUluZm8uZm9ybWFscztcbiAgICBjb25zdCBleHBlY3RlZE51bUZvcm1hbHMgPSBleHBlY3RlZEZvcm1hbHMgPyBleHBlY3RlZEZvcm1hbHMubGVuZ3RoIDogMDtcbiAgICBpZiAoZm9ybWFscy5sZW5ndGggIT09IGV4cGVjdGVkTnVtRm9ybWFscykge1xuICAgICAgICB0aHJvdyBlcnJvcnMud3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMobmFtZSwgZXhwZWN0ZWROdW1Gb3JtYWxzLCBmb3JtYWxzLmxlbmd0aCwgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5LCBydWxlSW5mby5kZXNjcmlwdGlvbiwgc291cmNlKTtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbCA9IGZ1bmN0aW9uIChuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKSB7XG4gICAgdGhpcy5ydWxlc1tuYW1lXSA9IHtcbiAgICAgICAgYm9keTogYm9keS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyksXG4gICAgICAgIGZvcm1hbHMsXG4gICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICBzb3VyY2VcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIFN0dWZmIHRoYXQgeW91IHNob3VsZCBvbmx5IGRvIG9uY2VcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24gKHN1cGVyR3JhbW1hcikge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBzdXBlciBncmFtbWFyIG9mIGEgR3JhbW1hckRlY2wgY2Fubm90IGJlIHNldCBtb3JlIHRoYW4gb25jZScpO1xuICAgIH1cbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICB0aGlzLnJ1bGVzID0gT2JqZWN0LmNyZWF0ZShzdXBlckdyYW1tYXIucnVsZXMpO1xuICAgIC8vIEdyYW1tYXJzIHdpdGggYW4gZXhwbGljaXQgc3VwZXJncmFtbWFyIGluaGVyaXQgYSBkZWZhdWx0IHN0YXJ0IHJ1bGUuXG4gICAgaWYgKCFzdXBlckdyYW1tYXIuaXNCdWlsdEluKCkpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gc3VwZXJHcmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoRGVmYXVsdFN0YXJ0UnVsZSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IHJ1bGVOYW1lO1xuICAgIHJldHVybiB0aGlzO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU291cmNlID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gbmV3IElucHV0U3RyZWFtKHNvdXJjZSkuaW50ZXJ2YWwoMCwgc291cmNlLmxlbmd0aCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuLy8gQ3JlYXRlcyBhIEdyYW1tYXIgaW5zdGFuY2UsIGFuZCBpZiBpdCBwYXNzZXMgdGhlIHNhbml0eSBjaGVja3MsIHJldHVybnMgaXQuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKHRoaXMubmFtZSwgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKSwgdGhpcy5ydWxlcywgdGhpcy5kZWZhdWx0U3RhcnRSdWxlKTtcbiAgICAvLyBUT0RPOiBjaGFuZ2UgdGhlIHBleHByLnByb3RvdHlwZS5hc3NlcnQuLi4gbWV0aG9kcyB0byBtYWtlIHRoZW0gYWRkXG4gICAgLy8gZXhjZXB0aW9ucyB0byBhbiBhcnJheSB0aGF0J3MgcHJvdmlkZWQgYXMgYW4gYXJnLiBUaGVuIHdlJ2xsIGJlIGFibGUgdG9cbiAgICAvLyBzaG93IG1vcmUgdGhhbiBvbmUgZXJyb3Igb2YgdGhlIHNhbWUgdHlwZSBhdCBhIHRpbWUuXG4gICAgLy8gVE9ETzogaW5jbHVkZSB0aGUgb2ZmZW5kaW5nIHBleHByIGluIHRoZSBlcnJvcnMsIHRoYXQgd2F5IHdlIGNhbiBzaG93XG4gICAgLy8gdGhlIHBhcnQgb2YgdGhlIHNvdXJjZSB0aGF0IGNhdXNlZCBpdC5cbiAgICBjb25zdCBncmFtbWFyRXJyb3JzID0gW107XG4gICAgbGV0IGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gZmFsc2U7XG4gICAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuZm9yRWFjaChydWxlTmFtZSA9PiB7XG4gICAgICAgIGNvbnN0IGJvZHkgPSBncmFtbWFyLnJ1bGVzW3J1bGVOYW1lXS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYm9keS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMpIHtcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBjYW4gb25seSBiZSBkb25lIGlmIHRoZSBncmFtbWFyIGhhcyBubyBpbnZhbGlkIGFwcGxpY2F0aW9ucy5cbiAgICAgICAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuZm9yRWFjaChydWxlTmFtZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gZ3JhbW1hci5ydWxlc1tydWxlTmFtZV0uYm9keTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZ3JhbW1hckVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9ycy50aHJvd0Vycm9ycyhncmFtbWFyRXJyb3JzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICAgIGdyYW1tYXIuc291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgfVxuICAgIHJldHVybiBncmFtbWFyO1xufTtcbi8vIFJ1bGUgZGVjbGFyYXRpb25zXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpIHtcbiAgICB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpO1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlc1tuYW1lXSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgc291cmNlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5ydWxlc1tuYW1lXSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5uYW1lLCBzb3VyY2UpO1xuICAgIH1cbiAgICBjb25zdCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICAgIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKTtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbiAobmFtZSwgZm9ybWFscywgYm9keSwgZGVzY0lnbm9yZWQsIHNvdXJjZSkge1xuICAgIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyUnVsZUZvck92ZXJyaWRpbmcobmFtZSwgc291cmNlKTtcbiAgICB0aGlzLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUobmFtZSwgZm9ybWFscywgYm9keSwgc291cmNlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGZyYWdtZW50LCBkZXNjSWdub3JlZCwgc291cmNlKSB7XG4gICAgY29uc3QgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICAgIGlmICghcnVsZUluZm8pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIHNvdXJjZSk7XG4gICAgfVxuICAgIGNvbnN0IGJvZHkgPSBuZXcgcGV4cHJzLkV4dGVuZCh0aGlzLnN1cGVyR3JhbW1hciwgbmFtZSwgZnJhZ21lbnQpO1xuICAgIGJvZHkuc291cmNlID0gZnJhZ21lbnQuc291cmNlO1xuICAgIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpO1xuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyRGVjbDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIElucHV0U3RyZWFtKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMucG9zID0gMDtcbiAgICB0aGlzLmV4YW1pbmVkTGVuZ3RoID0gMDtcbn1cbklucHV0U3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgICBhdEVuZCgpIHtcbiAgICAgICAgY29uc3QgYW5zID0gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgICAgICAgdGhpcy5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KHRoaXMuZXhhbWluZWRMZW5ndGgsIHRoaXMucG9zICsgMSk7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBuZXh0KCkge1xuICAgICAgICBjb25zdCBhbnMgPSB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXTtcbiAgICAgICAgdGhpcy5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KHRoaXMuZXhhbWluZWRMZW5ndGgsIHRoaXMucG9zKTtcbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuICAgIG1hdGNoU3RyaW5nKHMsIG9wdElnbm9yZUNhc2UpIHtcbiAgICAgICAgbGV0IGlkeDtcbiAgICAgICAgaWYgKG9wdElnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgIENhc2UtaW5zZW5zaXRpdmUgY29tcGFyaXNvbiBpcyBhIHRyaWNreSBidXNpbmVzcy4gU29tZSBub3RhYmxlIGdvdGNoYXMgaW5jbHVkZSB0aGVcbiAgICAgICAgICAgICAgXCJUdXJraXNoIElcIiBwcm9ibGVtIChodHRwOi8vd3d3LmkxOG5ndXkuY29tL3VuaWNvZGUvdHVya2lzaC1pMThuLmh0bWwpIGFuZCB0aGUgZmFjdFxuICAgICAgICAgICAgICB0aGF0IHRoZSBHZXJtYW4gRXNzemV0ICjDnykgdHVybnMgaW50byBcIlNTXCIgaW4gdXBwZXIgY2FzZS5cbiAgICAgIFxuICAgICAgICAgICAgICBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbG9jYWxlLWludmFyaWFudCBjb21wYXJpc29uLCB3aGljaCBtZWFucyBpdCBtYXkgbm90IG9iZXlcbiAgICAgICAgICAgICAgbG9jYWxlLXNwZWNpZmljIGV4cGVjdGF0aW9ucyAoZS5nLiBcImlcIiA9PiBcIsSwXCIpLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9IHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGV4cGVjdGVkID0gc1tpZHhdO1xuICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPT0gbnVsbCB8fCBhY3R1YWwudG9VcHBlckNhc2UoKSAhPT0gZXhwZWN0ZWQudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGVmYXVsdCBpcyBjYXNlLXNlbnNpdGl2ZSBjb21wYXJpc29uLlxuICAgICAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubmV4dCgpICE9PSBzW2lkeF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBzb3VyY2VTbGljZShzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydElkeCwgZW5kSWR4KTtcbiAgICB9LFxuICAgIGludGVydmFsKHN0YXJ0SWR4LCBvcHRFbmRJZHgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZSwgc3RhcnRJZHgsIG9wdEVuZElkeCA/IG9wdEVuZElkeCA6IHRoaXMucG9zKTtcbiAgICB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0U3RyZWFtO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBhc3NlcnQgPSByZXF1aXJlKCcuL2NvbW1vbicpLmFzc2VydDtcbmNvbnN0IGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIEludGVydmFsKHNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHRoaXMuc291cmNlU3RyaW5nID0gc291cmNlU3RyaW5nO1xuICAgIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeDtcbiAgICB0aGlzLmVuZElkeCA9IGVuZElkeDtcbn1cbkludGVydmFsLmNvdmVyYWdlID0gZnVuY3Rpb24gKCAvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gICAgY29uc3Qgc291cmNlU3RyaW5nID0gYXJndW1lbnRzWzBdLnNvdXJjZVN0cmluZztcbiAgICBsZXQgc3RhcnRJZHggPSBhcmd1bWVudHNbMF0uc3RhcnRJZHg7XG4gICAgbGV0IGVuZElkeCA9IGFyZ3VtZW50c1swXS5lbmRJZHg7XG4gICAgZm9yIChsZXQgaWR4ID0gMTsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgY29uc3QgaW50ZXJ2YWwgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgICAgaWYgKGludGVydmFsLnNvdXJjZVN0cmluZyAhPT0gc291cmNlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdGFydElkeCA9IE1hdGgubWluKHN0YXJ0SWR4LCBhcmd1bWVudHNbaWR4XS5zdGFydElkeCk7XG4gICAgICAgICAgICBlbmRJZHggPSBNYXRoLm1heChlbmRJZHgsIGFyZ3VtZW50c1tpZHhdLmVuZElkeCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbChzb3VyY2VTdHJpbmcsIHN0YXJ0SWR4LCBlbmRJZHgpO1xufTtcbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgICBjb3ZlcmFnZVdpdGgoIC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgICAgICAgY29uc3QgaW50ZXJ2YWxzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgaW50ZXJ2YWxzLnB1c2godGhpcyk7XG4gICAgICAgIHJldHVybiBJbnRlcnZhbC5jb3ZlcmFnZS5hcHBseSh1bmRlZmluZWQsIGludGVydmFscyk7XG4gICAgfSxcbiAgICBjb2xsYXBzZWRMZWZ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLnN0YXJ0SWR4KTtcbiAgICB9LFxuICAgIGNvbGxhcHNlZFJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLmVuZElkeCwgdGhpcy5lbmRJZHgpO1xuICAgIH0sXG4gICAgZ2V0TGluZUFuZENvbHVtbigpIHtcbiAgICAgICAgcmV0dXJuIHV0aWwuZ2V0TGluZUFuZENvbHVtbih0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCk7XG4gICAgfSxcbiAgICBnZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSgpIHtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBbdGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHhdO1xuICAgICAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCwgcmFuZ2UpO1xuICAgIH0sXG4gICAgLy8gUmV0dXJucyBhbiBhcnJheSBvZiAwLCAxLCBvciAyIGludGVydmFscyB0aGF0IHJlcHJlc2VudHMgdGhlIHJlc3VsdCBvZiB0aGVcbiAgICAvLyBpbnRlcnZhbCBkaWZmZXJlbmNlIG9wZXJhdGlvbi5cbiAgICBtaW51cyh0aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZVN0cmluZyAhPT0gdGhhdC5zb3VyY2VTdHJpbmcpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4ID09PSB0aGF0LnN0YXJ0SWR4ICYmIHRoaXMuZW5kSWR4ID09PSB0aGF0LmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoaXNgIGFuZCBgdGhhdGAgYXJlIHRoZSBzYW1lIGludGVydmFsIVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBzcGxpdHMgYHRoaXNgIGludG8gdHdvIGludGVydmFsc1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpLFxuICAgICAgICAgICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhhdC5lbmRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5lbmRJZHggJiYgdGhhdC5lbmRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgcHJlZml4IG9mIGB0aGlzYFxuICAgICAgICAgICAgcmV0dXJuIFtuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoYXQuZW5kSWR4LCB0aGlzLmVuZElkeCldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuc3RhcnRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgc3VmZml4IG9mIGB0aGlzYFxuICAgICAgICAgICAgcmV0dXJuIFtuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBhbmQgYHRoaXNgIGRvIG5vdCBvdmVybGFwXG4gICAgICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBSZXR1cm5zIGEgbmV3IEludGVydmFsIHRoYXQgaGFzIHRoZSBzYW1lIGV4dGVudCBhcyB0aGlzIG9uZSwgYnV0IHdoaWNoIGlzIHJlbGF0aXZlXG4gICAgLy8gdG8gYHRoYXRgLCBhbiBJbnRlcnZhbCB0aGF0IGZ1bGx5IGNvdmVycyB0aGlzIG9uZS5cbiAgICByZWxhdGl2ZVRvKHRoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc291cmNlU3RyaW5nICE9PSB0aGF0LnNvdXJjZVN0cmluZykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCh0aGlzLnN0YXJ0SWR4ID49IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPD0gdGhhdC5lbmRJZHgsICdvdGhlciBpbnRlcnZhbCBkb2VzIG5vdCBjb3ZlciB0aGlzIG9uZScpO1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4IC0gdGhhdC5zdGFydElkeCwgdGhpcy5lbmRJZHggLSB0aGF0LnN0YXJ0SWR4KTtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgYSBuZXcgSW50ZXJ2YWwgd2hpY2ggY29udGFpbnMgdGhlIHNhbWUgY29udGVudHMgYXMgdGhpcyBvbmUsXG4gICAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgICAvLyB0aGUgaW5wdXQgc3RyZWFtIGlzIGEgc3RyaW5nLilcbiAgICB0cmltbWVkKCkge1xuICAgICAgICBjb25zdCBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgICAgIGNvbnN0IHN0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIGNvbnRlbnRzLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICAgICAgY29uc3QgZW5kSWR4ID0gdGhpcy5lbmRJZHggLSBjb250ZW50cy5tYXRjaCgvXFxzKiQvKVswXS5sZW5ndGg7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHN0YXJ0SWR4LCBlbmRJZHgpO1xuICAgIH0sXG4gICAgc3ViSW50ZXJ2YWwob2Zmc2V0LCBsZW4pIHtcbiAgICAgICAgY29uc3QgbmV3U3RhcnRJZHggPSB0aGlzLnN0YXJ0SWR4ICsgb2Zmc2V0O1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCBuZXdTdGFydElkeCwgbmV3U3RhcnRJZHggKyBsZW4pO1xuICAgIH1cbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyhJbnRlcnZhbC5wcm90b3R5cGUsIHtcbiAgICBjb250ZW50czoge1xuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29udGVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRzID0gdGhpcy5zb3VyY2VTdHJpbmcuc2xpY2UodGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBsZW5ndGg6IHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5kSWR4IC0gdGhpcy5zdGFydElkeDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1cbn0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE1hdGNoUmVzdWx0KG1hdGNoZXIsIGlucHV0LCBzdGFydEV4cHIsIGNzdCwgY3N0T2Zmc2V0LCByaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIG9wdFJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLnN0YXJ0RXhwciA9IHN0YXJ0RXhwcjtcbiAgICB0aGlzLl9jc3QgPSBjc3Q7XG4gICAgdGhpcy5fY3N0T2Zmc2V0ID0gY3N0T2Zmc2V0O1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcyA9IG9wdFJlY29yZGVkRmFpbHVyZXM7XG4gICAgaWYgKHRoaXMuZmFpbGVkKCkpIHtcbiAgICAgICAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9ICdFeHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICAgICAgICAgIHJldHVybiAodXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLmlucHV0LCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKSArIGRldGFpbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdzaG9ydE1lc3NhZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBkZXRhaWwgPSAnZXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgICAgICAgICBjb25zdCBlcnJvckluZm8gPSB1dGlsLmdldExpbmVBbmRDb2x1bW4odGhpcy5pbnB1dCwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSk7XG4gICAgICAgICAgICByZXR1cm4gJ0xpbmUgJyArIGVycm9ySW5mby5saW5lTnVtICsgJywgY29sICcgKyBlcnJvckluZm8uY29sTnVtICsgJzogJyArIGRldGFpbDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnN1Y2NlZWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jc3Q7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmZhaWxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gIXRoaXMuc3VjY2VlZGVkKCk7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xufTtcbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5nZXRSaWdodG1vc3RGYWlsdXJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzKSB7XG4gICAgICAgIHRoaXMubWF0Y2hlci5zZXRJbnB1dCh0aGlzLmlucHV0KTtcbiAgICAgICAgY29uc3QgbWF0Y2hSZXN1bHRXaXRoRmFpbHVyZXMgPSB0aGlzLm1hdGNoZXIuX21hdGNoKHRoaXMuc3RhcnRFeHByLCBmYWxzZSwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSk7XG4gICAgICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzID0gbWF0Y2hSZXN1bHRXaXRoRmFpbHVyZXMuZ2V0UmlnaHRtb3N0RmFpbHVyZXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzO1xufTtcbk1hdGNoUmVzdWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdWNjZWVkZWQoKVxuICAgICAgICA/ICdbbWF0Y2ggc3VjY2VlZGVkXSdcbiAgICAgICAgOiAnW21hdGNoIGZhaWxlZCBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSArICddJztcbn07XG4vLyBSZXR1cm4gYSBzdHJpbmcgc3VtbWFyaXppbmcgdGhlIGV4cGVjdGVkIGNvbnRlbnRzIG9mIHRoZSBpbnB1dCBzdHJlYW0gd2hlblxuLy8gdGhlIG1hdGNoIGZhaWx1cmUgb2NjdXJyZWQuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0RXhwZWN0ZWRUZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN1Y2NlZWRlZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBleHBlY3RlZCB0ZXh0IG9mIGEgc3VjY2Vzc2Z1bCBNYXRjaFJlc3VsdCcpO1xuICAgIH1cbiAgICBjb25zdCBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gICAgbGV0IGZhaWx1cmVzID0gdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlcygpO1xuICAgIC8vIEZpbHRlciBvdXQgdGhlIGZsdWZmeSBmYWlsdXJlcyB0byBtYWtlIHRoZSBkZWZhdWx0IGVycm9yIG1lc3NhZ2VzIG1vcmUgdXNlZnVsXG4gICAgZmFpbHVyZXMgPSBmYWlsdXJlcy5maWx0ZXIoZmFpbHVyZSA9PiAhZmFpbHVyZS5pc0ZsdWZmeSgpKTtcbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBmYWlsdXJlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGlmIChpZHggPiAwKSB7XG4gICAgICAgICAgICBpZiAoaWR4ID09PSBmYWlsdXJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgc2IuYXBwZW5kKGZhaWx1cmVzLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoZmFpbHVyZXNbaWR4XS50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEludGVydmFsID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHBvcyA9IHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCk7XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLmlucHV0LCBwb3MsIHBvcyk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoUmVzdWx0O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0nKTtcbmNvbnN0IE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xuY29uc3QgUG9zSW5mbyA9IHJlcXVpcmUoJy4vUG9zSW5mbycpO1xuY29uc3QgVHJhY2UgPSByZXF1aXJlKCcuL1RyYWNlJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBhcHBseVNwYWNlcyA9IG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlcycpO1xuZnVuY3Rpb24gTWF0Y2hTdGF0ZShtYXRjaGVyLCBzdGFydEV4cHIsIG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgIHRoaXMubWF0Y2hlciA9IG1hdGNoZXI7XG4gICAgdGhpcy5zdGFydEV4cHIgPSBzdGFydEV4cHI7XG4gICAgdGhpcy5ncmFtbWFyID0gbWF0Y2hlci5ncmFtbWFyO1xuICAgIHRoaXMuaW5wdXQgPSBtYXRjaGVyLmlucHV0O1xuICAgIHRoaXMuaW5wdXRTdHJlYW0gPSBuZXcgSW5wdXRTdHJlYW0obWF0Y2hlci5pbnB1dCk7XG4gICAgdGhpcy5tZW1vVGFibGUgPSBtYXRjaGVyLm1lbW9UYWJsZTtcbiAgICB0aGlzLl9iaW5kaW5ncyA9IFtdO1xuICAgIHRoaXMuX2JpbmRpbmdPZmZzZXRzID0gW107XG4gICAgdGhpcy5fYXBwbGljYXRpb25TdGFjayA9IFtdO1xuICAgIHRoaXMuX3Bvc1N0YWNrID0gWzBdO1xuICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjayA9IFtmYWxzZV07XG4gICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSAtMTtcbiAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjayA9IFtdO1xuICAgIHRoaXMuX3JlY29yZGVkRmFpbHVyZXNTdGFjayA9IFtdO1xuICAgIGlmIChvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyA9IG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcztcbiAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG59XG5NYXRjaFN0YXRlLnByb3RvdHlwZSA9IHtcbiAgICBwb3NUb09mZnNldChwb3MpIHtcbiAgICAgICAgcmV0dXJuIHBvcyAtIHRoaXMuX3Bvc1N0YWNrW3RoaXMuX3Bvc1N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH0sXG4gICAgZW50ZXJBcHBsaWNhdGlvbihwb3NJbmZvLCBhcHApIHtcbiAgICAgICAgdGhpcy5fcG9zU3RhY2sucHVzaCh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gICAgICAgIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sucHVzaChhcHApO1xuICAgICAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaChmYWxzZSk7XG4gICAgICAgIHBvc0luZm8uZW50ZXIoYXBwKTtcbiAgICAgICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucHVzaCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbik7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gICAgfSxcbiAgICBleGl0QXBwbGljYXRpb24ocG9zSW5mbywgb3B0Tm9kZSkge1xuICAgICAgICBjb25zdCBvcmlnUG9zID0gdGhpcy5fcG9zU3RhY2sucG9wKCk7XG4gICAgICAgIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sucG9wKCk7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgICAgICAgcG9zSW5mby5leGl0KCk7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnBvcCgpKTtcbiAgICAgICAgaWYgKG9wdE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaEJpbmRpbmcob3B0Tm9kZSwgb3JpZ1Bvcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVudGVyTGV4aWZpZWRDb250ZXh0KCkge1xuICAgICAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaCh0cnVlKTtcbiAgICB9LFxuICAgIGV4aXRMZXhpZmllZENvbnRleHQoKSB7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgICB9LFxuICAgIGN1cnJlbnRBcHBsaWNhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2tbdGhpcy5fYXBwbGljYXRpb25TdGFjay5sZW5ndGggLSAxXTtcbiAgICB9LFxuICAgIGluU3ludGFjdGljQ29udGV4dCgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLmlucHV0U3RyZWFtLnNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjdXJyZW50QXBwbGljYXRpb24gPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgICBpZiAoY3VycmVudEFwcGxpY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEFwcGxpY2F0aW9uLmlzU3ludGFjdGljKCkgJiYgIXRoaXMuaW5MZXhpZmllZENvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoZSB0b3AtbGV2ZWwgY29udGV4dCBpcyBzeW50YWN0aWMgaWYgdGhlIHN0YXJ0IGFwcGxpY2F0aW9uIGlzLlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRFeHByLmZhY3RvcnNbMF0uaXNTeW50YWN0aWMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5MZXhpZmllZENvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2tbdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH0sXG4gICAgc2tpcFNwYWNlcygpIHtcbiAgICAgICAgdGhpcy5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgICAgIHRoaXMuZXZhbChhcHBseVNwYWNlcyk7XG4gICAgICAgIHRoaXMucG9wQmluZGluZygpO1xuICAgICAgICB0aGlzLnBvcEZhaWx1cmVzSW5mbygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gICAgfSxcbiAgICBza2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluU3ludGFjdGljQ29udGV4dCgpID8gdGhpcy5za2lwU3BhY2VzKCkgOiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgICB9LFxuICAgIG1heWJlU2tpcFNwYWNlc0JlZm9yZShleHByKSB7XG4gICAgICAgIGlmIChleHByIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5ICYmIGV4cHIuaXNTeW50YWN0aWMoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2tpcFNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV4cHIuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSgpICYmIGV4cHIgIT09IGFwcGx5U3BhY2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5za2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcHVzaEJpbmRpbmcobm9kZSwgb3JpZ1Bvcykge1xuICAgICAgICB0aGlzLl9iaW5kaW5ncy5wdXNoKG5vZGUpO1xuICAgICAgICB0aGlzLl9iaW5kaW5nT2Zmc2V0cy5wdXNoKHRoaXMucG9zVG9PZmZzZXQob3JpZ1BvcykpO1xuICAgIH0sXG4gICAgcG9wQmluZGluZygpIHtcbiAgICAgICAgdGhpcy5fYmluZGluZ3MucG9wKCk7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdPZmZzZXRzLnBvcCgpO1xuICAgIH0sXG4gICAgbnVtQmluZGluZ3MoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgfSxcbiAgICB0cnVuY2F0ZUJpbmRpbmdzKG5ld0xlbmd0aCkge1xuICAgICAgICAvLyBZZXMsIHRoaXMgaXMgdGhpcyByZWFsbHkgZmFzdGVyIHRoYW4gc2V0dGluZyB0aGUgYGxlbmd0aGAgcHJvcGVydHkgKHRlc3RlZCB3aXRoXG4gICAgICAgIC8vIGJpbi9lczViZW5jaCBvbiBOb2RlIHY2LjEuMCkuXG4gICAgICAgIHdoaWxlICh0aGlzLl9iaW5kaW5ncy5sZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucG9wQmluZGluZygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRDdXJyZW50UG9zSW5mbygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9zSW5mbyh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gICAgfSxcbiAgICBnZXRQb3NJbmZvKHBvcykge1xuICAgICAgICBsZXQgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgICAgIGlmICghcG9zSW5mbykge1xuICAgICAgICAgICAgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc10gPSBuZXcgUG9zSW5mbygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3NJbmZvO1xuICAgIH0sXG4gICAgcHJvY2Vzc0ZhaWx1cmUocG9zLCBleHByKSB7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIHBvcyk7XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMgJiYgcG9zID09PSB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgICAgICAgICAgY29uc3QgYXBwID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICAgICAgICAgIGlmIChhcHApIHtcbiAgICAgICAgICAgICAgICAvLyBTdWJzdGl0dXRlIHBhcmFtZXRlcnMgd2l0aCB0aGUgYWN0dWFsIHBleHBycyB0aGF0IHdlcmUgcGFzc2VkIHRvXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgcnVsZS5cbiAgICAgICAgICAgICAgICBleHByID0gZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFwcC5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgYnJhbmNoIGlzIG9ubHkgcmVhY2hlZCBmb3IgdGhlIFwiZW5kLWNoZWNrXCIgdGhhdCBpc1xuICAgICAgICAgICAgICAgIC8vIHBlcmZvcm1lZCBhZnRlciB0aGUgdG9wLWxldmVsIGFwcGxpY2F0aW9uLiBJbiB0aGF0IGNhc2UsXG4gICAgICAgICAgICAgICAgLy8gZXhwciA9PT0gcGV4cHJzLmVuZCBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIHN1YnN0aXR1dGVcbiAgICAgICAgICAgICAgICAvLyBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZWNvcmRGYWlsdXJlKGV4cHIudG9GYWlsdXJlKHRoaXMuZ3JhbW1hciksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVjb3JkRmFpbHVyZShmYWlsdXJlLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGZhaWx1cmUudG9LZXkoKTtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0gPSBzaG91bGRDbG9uZUlmTmV3ID8gZmFpbHVyZS5jbG9uZSgpIDogZmFpbHVyZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XS5pc0ZsdWZmeSgpICYmICFmYWlsdXJlLmlzRmx1ZmZ5KCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldLmNsZWFyRmx1ZmZ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlY29yZEZhaWx1cmVzKGZhaWx1cmVzLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGZhaWx1cmVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZEZhaWx1cmUoZmFpbHVyZXNba2V5XSwgc2hvdWxkQ2xvbmVJZk5ldyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCkge1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBhbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgIGFuc1trZXldID0gdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0uY2xvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBnZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgICB9LFxuICAgIF9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPj0gMFxuICAgICAgICAgICAgPyB0aGlzLnBvc1RvT2Zmc2V0KHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKVxuICAgICAgICAgICAgOiAtMTtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgdGhlIG1lbW9pemVkIHRyYWNlIGVudHJ5IGZvciBgZXhwcmAgYXQgYHBvc2AsIGlmIG9uZSBleGlzdHMsIGBudWxsYCBvdGhlcndpc2UuXG4gICAgZ2V0TWVtb2l6ZWRUcmFjZUVudHJ5KHBvcywgZXhwcikge1xuICAgICAgICBjb25zdCBwb3NJbmZvID0gdGhpcy5tZW1vVGFibGVbcG9zXTtcbiAgICAgICAgaWYgKHBvc0luZm8gJiYgZXhwci5ydWxlTmFtZSkge1xuICAgICAgICAgICAgY29uc3QgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1tleHByLnRvTWVtb0tleSgpXTtcbiAgICAgICAgICAgIGlmIChtZW1vUmVjICYmIG1lbW9SZWMudHJhY2VFbnRyeSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gbWVtb1JlYy50cmFjZUVudHJ5LmNsb25lV2l0aEV4cHIoZXhwcik7XG4gICAgICAgICAgICAgICAgZW50cnkuaXNNZW1vaXplZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLy8gUmV0dXJucyBhIG5ldyB0cmFjZSBlbnRyeSwgd2l0aCB0aGUgY3VycmVudGx5IGFjdGl2ZSB0cmFjZSBhcnJheSBhcyBpdHMgY2hpbGRyZW4uXG4gICAgZ2V0VHJhY2VFbnRyeShwb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MpIHtcbiAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkpIHtcbiAgICAgICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgICAgICAgICBjb25zdCBhY3R1YWxzID0gYXBwID8gYXBwLmFyZ3MgOiBbXTtcbiAgICAgICAgICAgIGV4cHIgPSBleHByLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLmdldE1lbW9pemVkVHJhY2VFbnRyeShwb3MsIGV4cHIpIHx8XG4gICAgICAgICAgICBuZXcgVHJhY2UodGhpcy5pbnB1dCwgcG9zLCB0aGlzLmlucHV0U3RyZWFtLnBvcywgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncywgdGhpcy50cmFjZSkpO1xuICAgIH0sXG4gICAgaXNUcmFjaW5nKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLnRyYWNlO1xuICAgIH0sXG4gICAgaGFzTmVjZXNzYXJ5SW5mbyhtZW1vUmVjKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYWNlICYmICFtZW1vUmVjLnRyYWNlRW50cnkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmXG4gICAgICAgICAgICB0aGlzLmlucHV0U3RyZWFtLnBvcyArIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAhIW1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXNlTWVtb2l6ZWRSZXN1bHQob3JpZ1BvcywgbWVtb1JlYykge1xuICAgICAgICBpZiAodGhpcy50cmFjZSkge1xuICAgICAgICAgICAgdGhpcy50cmFjZS5wdXNoKG1lbW9SZWMudHJhY2VFbnRyeSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHRoaXMuaW5wdXRTdHJlYW0ucG9zICsgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0O1xuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IE1hdGgubWF4KHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLCBtZW1vUmVjUmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJlxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgPT09IG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gJiZcbiAgICAgICAgICAgIG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZEZhaWx1cmVzKG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5pbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCArIG9yaWdQb3MpO1xuICAgICAgICBpZiAobWVtb1JlYy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgKz0gbWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgICAgICAgICAgIHRoaXMucHVzaEJpbmRpbmcobWVtb1JlYy52YWx1ZSwgb3JpZ1Bvcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBFdmFsdWF0ZSBgZXhwcmAgYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZGVkLCBgZmFsc2VgIG90aGVyd2lzZS4gT24gc3VjY2VzcywgYGJpbmRpbmdzYFxuICAgIC8vIHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGVsZW1lbnRzIHRoYW4gYmVmb3JlLCBhbmQgdGhlIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heVxuICAgIC8vIGhhdmUgaW5jcmVhc2VkLiBPbiBmYWlsdXJlLCBgYmluZGluZ3NgIGFuZCBwb3NpdGlvbiB3aWxsIGJlIHVuY2hhbmdlZC5cbiAgICBldmFsKGV4cHIpIHtcbiAgICAgICAgY29uc3QgaW5wdXRTdHJlYW0gPSB0aGlzLmlucHV0U3RyZWFtO1xuICAgICAgICBjb25zdCBvcmlnTnVtQmluZGluZ3MgPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgICAgIGxldCBvcmlnUmVjb3JkZWRGYWlsdXJlcztcbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgb3JpZ1JlY29yZGVkRmFpbHVyZXMgPSB0aGlzLnJlY29yZGVkRmFpbHVyZXM7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgICAgIGNvbnN0IG1lbW9Qb3MgPSB0aGlzLm1heWJlU2tpcFNwYWNlc0JlZm9yZShleHByKTtcbiAgICAgICAgbGV0IG9yaWdUcmFjZTtcbiAgICAgICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgICAgICAgIG9yaWdUcmFjZSA9IHRoaXMudHJhY2U7XG4gICAgICAgICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gdGhlIGFjdHVhbCBldmFsdWF0aW9uLlxuICAgICAgICBjb25zdCBhbnMgPSBleHByLmV2YWwodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnRyYWNlKSB7XG4gICAgICAgICAgICBjb25zdCBiaW5kaW5ncyA9IHRoaXMuX2JpbmRpbmdzLnNsaWNlKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgICAgICAgICBjb25zdCB0cmFjZUVudHJ5ID0gdGhpcy5nZXRUcmFjZUVudHJ5KG1lbW9Qb3MsIGV4cHIsIGFucywgYmluZGluZ3MpO1xuICAgICAgICAgICAgdHJhY2VFbnRyeS5pc0ltcGxpY2l0U3BhY2VzID0gZXhwciA9PT0gYXBwbHlTcGFjZXM7XG4gICAgICAgICAgICB0cmFjZUVudHJ5LmlzUm9vdE5vZGUgPSBleHByID09PSB0aGlzLnN0YXJ0RXhwcjtcbiAgICAgICAgICAgIG9yaWdUcmFjZS5wdXNoKHRyYWNlRW50cnkpO1xuICAgICAgICAgICAgdGhpcy50cmFjZSA9IG9yaWdUcmFjZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmIGlucHV0U3RyZWFtLnBvcyA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0ubWFrZUZsdWZmeSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHBvc2l0aW9uIGFuZCB0aGUgYmluZGluZ3MuXG4gICAgICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgICAgICAgdGhpcy50cnVuY2F0ZUJpbmRpbmdzKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRGYWlsdXJlcyhvcmlnUmVjb3JkZWRGYWlsdXJlcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBnZXRNYXRjaFJlc3VsdCgpIHtcbiAgICAgICAgdGhpcy5ldmFsKHRoaXMuc3RhcnRFeHByKTtcbiAgICAgICAgbGV0IHJpZ2h0bW9zdEZhaWx1cmVzO1xuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICByaWdodG1vc3RGYWlsdXJlcyA9IE9iamVjdC5rZXlzKHRoaXMucmVjb3JkZWRGYWlsdXJlcykubWFwKGtleSA9PiB0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdCh0aGlzLm1hdGNoZXIsIHRoaXMuaW5wdXQsIHRoaXMuc3RhcnRFeHByLCB0aGlzLl9iaW5kaW5nc1swXSwgdGhpcy5fYmluZGluZ09mZnNldHNbMF0sIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLCByaWdodG1vc3RGYWlsdXJlcyk7XG4gICAgfSxcbiAgICBnZXRUcmFjZSgpIHtcbiAgICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgICAgICBjb25zdCBtYXRjaFJlc3VsdCA9IHRoaXMuZ2V0TWF0Y2hSZXN1bHQoKTtcbiAgICAgICAgLy8gVGhlIHRyYWNlIG5vZGUgZm9yIHRoZSBzdGFydCBydWxlIGlzIGFsd2F5cyB0aGUgbGFzdCBlbnRyeS4gSWYgaXQgaXMgYSBzeW50YWN0aWMgcnVsZSxcbiAgICAgICAgLy8gdGhlIGZpcnN0IGVudHJ5IGlzIGZvciBhbiBhcHBsaWNhdGlvbiBvZiAnc3BhY2VzJy5cbiAgICAgICAgLy8gVE9ETyhwZHVicm95KTogQ2xlYW4gdGhpcyB1cCBieSBpbnRyb2R1Y2luZyBhIHNwZWNpYWwgYE1hdGNoPHN0YXJ0QXBwbD5gIHJ1bGUsIHdoaWNoIHdpbGxcbiAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlcmUgaXMgYWx3YXlzIGEgc2luZ2xlIHJvb3QgdHJhY2Ugbm9kZS5cbiAgICAgICAgY29uc3Qgcm9vdFRyYWNlID0gdGhpcy50cmFjZVt0aGlzLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgICAgICByb290VHJhY2UucmVzdWx0ID0gbWF0Y2hSZXN1bHQ7XG4gICAgICAgIHJldHVybiByb290VHJhY2U7XG4gICAgfSxcbiAgICBwdXNoRmFpbHVyZXNJbmZvKCkge1xuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wdXNoKHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrLnB1c2godGhpcy5yZWNvcmRlZEZhaWx1cmVzKTtcbiAgICB9LFxuICAgIHBvcEZhaWx1cmVzSW5mbygpIHtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrLnBvcCgpO1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hTdGF0ZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgTWF0Y2hTdGF0ZSA9IHJlcXVpcmUoJy4vTWF0Y2hTdGF0ZScpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gTWF0Y2hlcihncmFtbWFyKSB7XG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICB0aGlzLm1lbW9UYWJsZSA9IFtdO1xuICAgIHRoaXMuaW5wdXQgPSAnJztcbn1cbk1hdGNoZXIucHJvdG90eXBlLmdldElucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0O1xufTtcbk1hdGNoZXIucHJvdG90eXBlLnNldElucHV0ID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICh0aGlzLmlucHV0ICE9PSBzdHIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlSW5wdXRSYW5nZSgwLCB0aGlzLmlucHV0Lmxlbmd0aCwgc3RyKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTWF0Y2hlci5wcm90b3R5cGUucmVwbGFjZUlucHV0UmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnRJZHgsIGVuZElkeCwgc3RyKSB7XG4gICAgY29uc3QgY3VycmVudElucHV0ID0gdGhpcy5pbnB1dDtcbiAgICBpZiAoc3RhcnRJZHggPCAwIHx8XG4gICAgICAgIHN0YXJ0SWR4ID4gY3VycmVudElucHV0Lmxlbmd0aCB8fFxuICAgICAgICBlbmRJZHggPCAwIHx8XG4gICAgICAgIGVuZElkeCA+IGN1cnJlbnRJbnB1dC5sZW5ndGggfHxcbiAgICAgICAgc3RhcnRJZHggPiBlbmRJZHgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGluZGljZXM6ICcgKyBzdGFydElkeCArICcgYW5kICcgKyBlbmRJZHgpO1xuICAgIH1cbiAgICAvLyB1cGRhdGUgaW5wdXRcbiAgICB0aGlzLmlucHV0ID0gY3VycmVudElucHV0LnNsaWNlKDAsIHN0YXJ0SWR4KSArIHN0ciArIGN1cnJlbnRJbnB1dC5zbGljZShlbmRJZHgpO1xuICAgIC8vIHVwZGF0ZSBtZW1vIHRhYmxlIChzaW1pbGFyIHRvIHRoZSBhYm92ZSlcbiAgICBjb25zdCByZXN0T2ZNZW1vVGFibGUgPSB0aGlzLm1lbW9UYWJsZS5zbGljZShlbmRJZHgpO1xuICAgIHRoaXMubWVtb1RhYmxlLmxlbmd0aCA9IHN0YXJ0SWR4O1xuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHN0ci5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMubWVtb1RhYmxlLnB1c2godW5kZWZpbmVkKTtcbiAgICB9XG4gICAgcmVzdE9mTWVtb1RhYmxlLmZvckVhY2goZnVuY3Rpb24gKHBvc0luZm8pIHtcbiAgICAgICAgdGhpcy5tZW1vVGFibGUucHVzaChwb3NJbmZvKTtcbiAgICB9LCB0aGlzKTtcbiAgICAvLyBJbnZhbGlkYXRlIG1lbW9SZWNzXG4gICAgZm9yIChsZXQgcG9zID0gMDsgcG9zIDwgc3RhcnRJZHg7IHBvcysrKSB7XG4gICAgICAgIGNvbnN0IHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgICAgICBpZiAocG9zSW5mbykge1xuICAgICAgICAgICAgcG9zSW5mby5jbGVhck9ic29sZXRlRW50cmllcyhwb3MsIHN0YXJ0SWR4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5NYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIChvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoKHRoaXMuX2dldFN0YXJ0RXhwcihvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSwgZmFsc2UpO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2godGhpcy5fZ2V0U3RhcnRFeHByKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpLCB0cnVlKTtcbn07XG5NYXRjaGVyLnByb3RvdHlwZS5fbWF0Y2ggPSBmdW5jdGlvbiAoc3RhcnRFeHByLCB0cmFjaW5nLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICBjb25zdCBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKHRoaXMsIHN0YXJ0RXhwciwgb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKTtcbiAgICByZXR1cm4gdHJhY2luZyA/IHN0YXRlLmdldFRyYWNlKCkgOiBzdGF0ZS5nZXRNYXRjaFJlc3VsdCgpO1xufTtcbi8qXG4gIFJldHVybnMgdGhlIHN0YXJ0aW5nIGV4cHJlc3Npb24gZm9yIHRoaXMgTWF0Y2hlcidzIGFzc29jaWF0ZWQgZ3JhbW1hci4gSWYgYG9wdFN0YXJ0QXBwbGljYXRpb25TdHJgXG4gIGlzIHNwZWNpZmllZCwgaXQgaXMgYSBzdHJpbmcgZXhwcmVzc2luZyBhIHJ1bGUgYXBwbGljYXRpb24gaW4gdGhlIGdyYW1tYXIuIElmIG5vdCBzcGVjaWZpZWQsIHRoZVxuICBncmFtbWFyJ3MgZGVmYXVsdCBzdGFydCBydWxlIHdpbGwgYmUgdXNlZC5cbiovXG5NYXRjaGVyLnByb3RvdHlwZS5fZ2V0U3RhcnRFeHByID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICBjb25zdCBhcHBsaWNhdGlvblN0ciA9IG9wdFN0YXJ0QXBwbGljYXRpb25TdHIgfHwgdGhpcy5ncmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgaWYgKCFhcHBsaWNhdGlvblN0cikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmcgc3RhcnQgcnVsZSBhcmd1bWVudCAtLSB0aGUgZ3JhbW1hciBoYXMgbm8gZGVmYXVsdCBzdGFydCBydWxlLicpO1xuICAgIH1cbiAgICBjb25zdCBzdGFydEFwcCA9IHRoaXMuZ3JhbW1hci5wYXJzZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uU3RyKTtcbiAgICByZXR1cm4gbmV3IHBleHBycy5TZXEoW3N0YXJ0QXBwLCBwZXhwcnMuZW5kXSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoZXI7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE5hbWVzcGFjZSgpIHsgfVxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5OYW1lc3BhY2UuYXNOYW1lc3BhY2UgPSBmdW5jdGlvbiAob2JqT3JOYW1lc3BhY2UpIHtcbiAgICBpZiAob2JqT3JOYW1lc3BhY2UgaW5zdGFuY2VvZiBOYW1lc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIG9iak9yTmFtZXNwYWNlO1xuICAgIH1cbiAgICByZXR1cm4gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZShvYmpPck5hbWVzcGFjZSk7XG59O1xuLy8gQ3JlYXRlIGEgbmV3IG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpcyBzcGVjaWZpZWQsIGFsbCBvZiBpdHMgcHJvcGVydGllc1xuLy8gd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlID0gZnVuY3Rpb24gKG9wdFByb3BzKSB7XG4gICAgcmV0dXJuIE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLnByb3RvdHlwZSwgb3B0UHJvcHMpO1xufTtcbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2Ugd2hpY2ggZXh0ZW5kcyBhbm90aGVyIG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpc1xuLy8gc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuZXh0ZW5kID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgb3B0UHJvcHMpIHtcbiAgICBpZiAobmFtZXNwYWNlICE9PSBOYW1lc3BhY2UucHJvdG90eXBlICYmICEobmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBOYW1lc3BhY2Ugb2JqZWN0OiAnICsgbmFtZXNwYWNlKTtcbiAgICB9XG4gICAgY29uc3QgbnMgPSBPYmplY3QuY3JlYXRlKG5hbWVzcGFjZSwge1xuICAgICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICAgICAgdmFsdWU6IE5hbWVzcGFjZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBleHRlbmQobnMsIG9wdFByb3BzKTtcbn07XG4vLyBUT0RPOiBTaG91bGQgdGhpcyBiZSBhIHJlZ3VsYXIgbWV0aG9kP1xuTmFtZXNwYWNlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG5zKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChucyk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IE5hbWVzcGFjZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gUG9zSW5mbygpIHtcbiAgICB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gW107IC8vIGFjdGl2ZSBhcHBsaWNhdGlvbnMgYXQgdGhpcyBwb3NpdGlvblxuICAgIHRoaXMubWVtbyA9IHt9O1xuICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSAwO1xuICAgIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IC0xO1xuICAgIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSB1bmRlZmluZWQ7XG59XG5Qb3NJbmZvLnByb3RvdHlwZSA9IHtcbiAgICBpc0FjdGl2ZShhcHBsaWNhdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSA+PSAwO1xuICAgIH0sXG4gICAgZW50ZXIoYXBwbGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wdXNoKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKTtcbiAgICB9LFxuICAgIGV4aXQoKSB7XG4gICAgICAgIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sucG9wKCk7XG4gICAgfSxcbiAgICBzdGFydExlZnRSZWN1cnNpb24oaGVhZEFwcGxpY2F0aW9uLCBtZW1vUmVjKSB7XG4gICAgICAgIG1lbW9SZWMuaXNMZWZ0UmVjdXJzaW9uID0gdHJ1ZTtcbiAgICAgICAgbWVtb1JlYy5oZWFkQXBwbGljYXRpb24gPSBoZWFkQXBwbGljYXRpb247XG4gICAgICAgIG1lbW9SZWMubmV4dExlZnRSZWN1cnNpb24gPSB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uO1xuICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gbWVtb1JlYztcbiAgICAgICAgY29uc3QgYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrO1xuICAgICAgICBjb25zdCBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgKyAxO1xuICAgICAgICBjb25zdCBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5zbGljZShpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUpO1xuICAgICAgICBtZW1vUmVjLmlzSW52b2x2ZWQgPSBmdW5jdGlvbiAoYXBwbGljYXRpb25NZW1vS2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzLmluZGV4T2YoYXBwbGljYXRpb25NZW1vS2V5KSA+PSAwO1xuICAgICAgICB9O1xuICAgICAgICBtZW1vUmVjLnVwZGF0ZUludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGlkeCA9IGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZTsgaWR4IDwgYXBwbGljYXRpb25NZW1vS2V5U3RhY2subGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFwcGxpY2F0aW9uTWVtb0tleSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrW2lkeF07XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzSW52b2x2ZWQoYXBwbGljYXRpb25NZW1vS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMucHVzaChhcHBsaWNhdGlvbk1lbW9LZXkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGVuZExlZnRSZWN1cnNpb24oKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5leHRMZWZ0UmVjdXJzaW9uO1xuICAgIH0sXG4gICAgLy8gTm90ZTogdGhpcyBtZXRob2QgZG9lc24ndCBnZXQgY2FsbGVkIGZvciB0aGUgXCJoZWFkXCIgb2YgYSBsZWZ0IHJlY3Vyc2lvbiAtLSBmb3IgTFIgaGVhZHMsXG4gICAgLy8gdGhlIG1lbW9pemVkIHJlc3VsdCAod2hpY2ggc3RhcnRzIG91dCBiZWluZyBhIGZhaWx1cmUpIGlzIGFsd2F5cyB1c2VkLlxuICAgIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpIHtcbiAgICAgICAgaWYgKCFtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrO1xuICAgICAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICBjb25zdCBhcHBsaWNhdGlvbk1lbW9LZXkgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFja1tpZHhdO1xuICAgICAgICAgICAgaWYgKG1lbW9SZWMuaXNJbnZvbHZlZChhcHBsaWNhdGlvbk1lbW9LZXkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgbWVtb2l6ZShtZW1vS2V5LCBtZW1vUmVjKSB7XG4gICAgICAgIHRoaXMubWVtb1ttZW1vS2V5XSA9IG1lbW9SZWM7XG4gICAgICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLm1heEV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gTWF0aC5tYXgodGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0LCBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQpO1xuICAgICAgICByZXR1cm4gbWVtb1JlYztcbiAgICB9LFxuICAgIGNsZWFyT2Jzb2xldGVFbnRyaWVzKHBvcywgaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgaWYgKHBvcyArIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPD0gaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgICAgIC8vIE9wdGltaXphdGlvbjogbm9uZSBvZiB0aGUgcnVsZSBhcHBsaWNhdGlvbnMgdGhhdCB3ZXJlIG1lbW9pemVkIGhlcmUgZXhhbWluZWQgdGhlXG4gICAgICAgICAgICAvLyBpbnRlcnZhbCBvZiB0aGUgaW5wdXQgdGhhdCBjaGFuZ2VkLCBzbyBub3RoaW5nIGhhcyB0byBiZSBpbnZhbGlkYXRlZC5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtZW1vID0gdGhpcy5tZW1vO1xuICAgICAgICB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gLTE7XG4gICAgICAgIE9iamVjdC5rZXlzKG1lbW8pLmZvckVhY2goayA9PiB7XG4gICAgICAgICAgICBjb25zdCBtZW1vUmVjID0gbWVtb1trXTtcbiAgICAgICAgICAgIGlmIChwb3MgKyBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoID4gaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbWVtb1trXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLm1heEV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPSBNYXRoLm1heCh0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQsIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gUG9zSW5mbztcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG5jb25zdCBJdGVyYXRpb25Ob2RlID0gcmVxdWlyZSgnLi9ub2RlcycpLkl0ZXJhdGlvbk5vZGU7XG5jb25zdCBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4vTWF0Y2hSZXN1bHQnKTtcbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBnbG9iYWxBY3Rpb25TdGFjayA9IFtdO1xubGV0IHByb3RvdHlwZUdyYW1tYXI7XG5sZXQgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcztcbi8vIEpTT04gaXMgbm90IGEgdmFsaWQgc3Vic2V0IG9mIEphdmFTY3JpcHQgYmVjYXVzZSB0aGVyZSBhcmUgdHdvIHBvc3NpYmxlIGxpbmUgdGVybWluYXRvcnMsXG4vLyBVKzIwMjggKGxpbmUgc2VwYXJhdG9yKSBhbmQgVSsyMDI5IChwYXJhZ3JhcGggc2VwYXJhdG9yKSB0aGF0IGFyZSBhbGxvd2VkIGluIEpTT04gc3RyaW5nc1xuLy8gYnV0IG5vdCBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXG4vLyBqc29uVG9KUygpIHByb3Blcmx5IGVuY29kZXMgdGhvc2UgdHdvIGNoYXJhY3RlcnMgaW4gSlNPTiBzbyB0aGF0IGl0IGNhbiBzZWFtbGVzc2x5IGJlXG4vLyBpbnNlcnRlZCBpbnRvIEphdmFTY3JpcHQgY29kZSAocGx1cyB0aGUgZW5jb2RlZCB2ZXJzaW9uIGlzIHN0aWxsIHZhbGlkIEpTT04pXG5mdW5jdGlvbiBqc29uVG9KUyhzdHIpIHtcbiAgICBjb25zdCBvdXRwdXQgPSBzdHIucmVwbGFjZSgvW1xcdTIwMjhcXHUyMDI5XS9nLCAoY2hhciwgcG9zLCBzdHIpID0+IHtcbiAgICAgICAgY29uc3QgaGV4ID0gY2hhci5jb2RlUG9pbnRBdCgwKS50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiAnXFxcXHUnICsgJzAwMDAnLnNsaWNlKGhleC5sZW5ndGgpICsgaGV4O1xuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBXcmFwcGVycyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gV3JhcHBlcnMgZGVjb3JhdGUgQ1NUIG5vZGVzIHdpdGggYWxsIG9mIHRoZSBmdW5jdGlvbmFsaXR5IChpLmUuLCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzKVxuLy8gcHJvdmlkZWQgYnkgYSBTZW1hbnRpY3MgKHNlZSBiZWxvdykuIGBXcmFwcGVyYCBpcyB0aGUgYWJzdHJhY3Qgc3VwZXJjbGFzcyBvZiBhbGwgd3JhcHBlcnMuIEFcbi8vIGBXcmFwcGVyYCBtdXN0IGhhdmUgYF9ub2RlYCBhbmQgYF9zZW1hbnRpY3NgIGluc3RhbmNlIHZhcmlhYmxlcywgd2hpY2ggcmVmZXIgdG8gdGhlIENTVCBub2RlIGFuZFxuLy8gU2VtYW50aWNzIChyZXNwLikgZm9yIHdoaWNoIGl0IHdhcyBjcmVhdGVkLCBhbmQgYSBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlIHdoaWNoIGlzXG4vLyB1c2VkIHRvIGNhY2hlIHRoZSB3cmFwcGVyIGluc3RhbmNlcyB0aGF0IGFyZSBjcmVhdGVkIGZvciBpdHMgY2hpbGQgbm9kZXMuIFNldHRpbmcgdGhlc2UgaW5zdGFuY2Vcbi8vIHZhcmlhYmxlcyBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNvbnN0cnVjdG9yIG9mIGVhY2ggU2VtYW50aWNzLXNwZWNpZmljIHN1YmNsYXNzIG9mXG4vLyBgV3JhcHBlcmAuXG5jbGFzcyBXcmFwcGVyIHtcbiAgICBjb25zdHJ1Y3Rvcihub2RlLCBzb3VyY2VJbnRlcnZhbCwgYmFzZUludGVydmFsKSB7XG4gICAgICAgIHRoaXMuX25vZGUgPSBub2RlO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZUludGVydmFsO1xuICAgICAgICAvLyBUaGUgaW50ZXJ2YWwgdGhhdCB0aGUgY2hpbGRPZmZzZXRzIG9mIGBub2RlYCBhcmUgcmVsYXRpdmUgdG8uIEl0IHNob3VsZCBiZSB0aGUgc291cmNlXG4gICAgICAgIC8vIG9mIHRoZSBjbG9zZXN0IE5vbnRlcm1pbmFsIG5vZGUuXG4gICAgICAgIHRoaXMuX2Jhc2VJbnRlcnZhbCA9IGJhc2VJbnRlcnZhbDtcbiAgICAgICAgaWYgKG5vZGUuaXNOb250ZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICBjb21tb24uYXNzZXJ0KHNvdXJjZUludGVydmFsID09PSBiYXNlSW50ZXJ2YWwpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2NoaWxkV3JhcHBlcnMgPSBbXTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiAnW3NlbWFudGljcyB3cmFwcGVyIGZvciAnICsgdGhpcy5fbm9kZS5ncmFtbWFyLm5hbWUgKyAnXSc7XG4gICAgfVxuICAgIC8vIFRoaXMgaXMgdXNlZCBieSBvaG0gZWRpdG9yIHRvIGRpc3BsYXkgYSBub2RlIHdyYXBwZXIgYXBwcm9wcmlhdGVseS5cbiAgICB0b0pTT04oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfVxuICAgIF9mb3JnZXRNZW1vaXplZFJlc3VsdEZvcihhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbWVtb2l6ZWQgYXR0cmlidXRlIGZyb20gdGhlIGNzdE5vZGUgYW5kIGFsbCBpdHMgY2hpbGRyZW4uXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ub2RlW3RoaXMuX3NlbWFudGljcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdXTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgICAgICAgIGNoaWxkLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvcihhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8vIFJldHVybnMgdGhlIHdyYXBwZXIgb2YgdGhlIHNwZWNpZmllZCBjaGlsZCBub2RlLiBDaGlsZCB3cmFwcGVycyBhcmUgY3JlYXRlZCBsYXppbHkgYW5kXG4gICAgLy8gY2FjaGVkIGluIHRoZSBwYXJlbnQgd3JhcHBlcidzIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUuXG4gICAgY2hpbGQoaWR4KSB7XG4gICAgICAgIGlmICghKDAgPD0gaWR4ICYmIGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKSkpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IENvbnNpZGVyIHRocm93aW5nIGFuIGV4Y2VwdGlvbiBoZXJlLlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdO1xuICAgICAgICBpZiAoIWNoaWxkV3JhcHBlcikge1xuICAgICAgICAgICAgY29uc3QgY2hpbGROb2RlID0gdGhpcy5fbm9kZS5jaGlsZEF0KGlkeCk7XG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLl9ub2RlLmNoaWxkT2Zmc2V0c1tpZHhdO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5fYmFzZUludGVydmFsLnN1YkludGVydmFsKG9mZnNldCwgY2hpbGROb2RlLm1hdGNoTGVuZ3RoKTtcbiAgICAgICAgICAgIGNvbnN0IGJhc2UgPSBjaGlsZE5vZGUuaXNOb250ZXJtaW5hbCgpID8gc291cmNlIDogdGhpcy5fYmFzZUludGVydmFsO1xuICAgICAgICAgICAgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdID0gdGhpcy5fc2VtYW50aWNzLndyYXAoY2hpbGROb2RlLCBzb3VyY2UsIGJhc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZFdyYXBwZXI7XG4gICAgfVxuICAgIC8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgd3JhcHBlcnMgb2YgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgbm9kZSBhc3NvY2lhdGVkXG4gICAgLy8gd2l0aCB0aGlzIHdyYXBwZXIuXG4gICAgX2NoaWxkcmVuKCkge1xuICAgICAgICAvLyBGb3JjZSB0aGUgY3JlYXRpb24gb2YgYWxsIGNoaWxkIHdyYXBwZXJzXG4gICAgICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgaWR4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGQoaWR4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRXcmFwcGVycztcbiAgICB9XG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uXG4gICAgLy8gZXhwcmVzc2lvbiwgaS5lLiwgYSBLbGVlbmUtKiwgS2xlZW5lLSssIG9yIGFuIG9wdGlvbmFsLiBSZXR1cm5zIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIGlzSXRlcmF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5pc0l0ZXJhdGlvbigpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIHRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbiAgICAvLyBvdGhlcndpc2UuXG4gICAgaXNUZXJtaW5hbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuaXNUZXJtaW5hbCgpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbiAgICAvLyBvdGhlcndpc2UuXG4gICAgaXNOb250ZXJtaW5hbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuaXNOb250ZXJtaW5hbCgpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIGEgc3ludGFjdGljIHJ1bGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIGlzU3ludGFjdGljKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc05vbnRlcm1pbmFsKCkgJiYgdGhpcy5fbm9kZS5pc1N5bnRhY3RpYygpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIGEgbGV4aWNhbCBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICBpc0xleGljYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzTm9udGVybWluYWwoKSAmJiB0aGlzLl9ub2RlLmlzTGV4aWNhbCgpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhbiBpdGVyYXRvciBub2RlXG4gICAgLy8gaGF2aW5nIGVpdGhlciBvbmUgb3Igbm8gY2hpbGQgKD8gb3BlcmF0b3IpLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAvLyBPdGhlcndpc2UsIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgaXNPcHRpb25hbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuaXNPcHRpb25hbCgpO1xuICAgIH1cbiAgICAvLyBDcmVhdGUgYSBuZXcgX2l0ZXIgd3JhcHBlciBpbiB0aGUgc2FtZSBzZW1hbnRpY3MgYXMgdGhpcyB3cmFwcGVyLlxuICAgIGl0ZXJhdGlvbihvcHRDaGlsZFdyYXBwZXJzKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkV3JhcHBlcnMgPSBvcHRDaGlsZFdyYXBwZXJzIHx8IFtdO1xuICAgICAgICBjb25zdCBjaGlsZE5vZGVzID0gY2hpbGRXcmFwcGVycy5tYXAoYyA9PiBjLl9ub2RlKTtcbiAgICAgICAgY29uc3QgaXRlciA9IG5ldyBJdGVyYXRpb25Ob2RlKHRoaXMuX25vZGUuZ3JhbW1hciwgY2hpbGROb2RlcywgW10sIC0xLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSB0aGlzLl9zZW1hbnRpY3Mud3JhcChpdGVyLCBudWxsLCBudWxsKTtcbiAgICAgICAgd3JhcHBlci5fY2hpbGRXcmFwcGVycyA9IGNoaWxkV3JhcHBlcnM7XG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4oKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0aGUgbmFtZSBvZiBncmFtbWFyIHJ1bGUgdGhhdCBjcmVhdGVkIHRoaXMgQ1NUIG5vZGUuXG4gICAgZ2V0IGN0b3JOYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5jdG9yTmFtZTtcbiAgICB9XG4gICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgZXZlbnR1YWxseSAoZGVwcmVjYXRlZCBpbiB2MC4xMikuXG4gICAgZ2V0IGludGVydmFsKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgaW50ZXJ2YWxgIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgLS0gdXNlIGBzb3VyY2VgIGluc3RlYWQnKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIG9mIHRoaXMgQ1NUIG5vZGUuXG4gICAgZ2V0IG51bUNoaWxkcmVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpO1xuICAgIH1cbiAgICAvLyBSZXR1cm5zIHRoZSBwcmltaXRpdmUgdmFsdWUgb2YgdGhpcyBDU1Qgbm9kZSwgaWYgaXQncyBhIHRlcm1pbmFsIG5vZGUuIE90aGVyd2lzZSxcbiAgICAvLyB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuICAgIC8vIERFUFJFQ0FURUQ6IFVzZSBgc291cmNlU3RyaW5nYCBpbnN0ZWFkLlxuICAgIGdldCBwcmltaXRpdmVWYWx1ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNUZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5wcmltaXRpdmVWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwidHJpZWQgdG8gYWNjZXNzIHRoZSAncHJpbWl0aXZlVmFsdWUnIGF0dHJpYnV0ZSBvZiBhIG5vbi10ZXJtaW5hbCBDU1Qgbm9kZVwiKTtcbiAgICB9XG4gICAgLy8gUmV0dXJucyB0aGUgY29udGVudHMgb2YgdGhlIGlucHV0IHN0cmVhbSBjb25zdW1lZCBieSB0aGlzIENTVCBub2RlLlxuICAgIGdldCBzb3VyY2VTdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5jb250ZW50cztcbiAgICB9XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBTZW1hbnRpY3MgLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEEgU2VtYW50aWNzIGlzIGEgY29udGFpbmVyIGZvciBhIGZhbWlseSBvZiBPcGVyYXRpb25zIGFuZCBBdHRyaWJ1dGVzIGZvciBhIGdpdmVuIGdyYW1tYXIuXG4vLyBTZW1hbnRpY3MgZW5hYmxlIG1vZHVsYXJpdHkgKGRpZmZlcmVudCBjbGllbnRzIG9mIGEgZ3JhbW1hciBjYW4gY3JlYXRlIHRoZWlyIHNldCBvZiBvcGVyYXRpb25zXG4vLyBhbmQgYXR0cmlidXRlcyBpbiBpc29sYXRpb24pIGFuZCBleHRlbnNpYmlsaXR5IGV2ZW4gd2hlbiBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGFyZSBtdXR1YWxseS1cbi8vIHJlY3Vyc2l2ZS4gVGhpcyBjb25zdHJ1Y3RvciBzaG91bGQgbm90IGJlIGNhbGxlZCBkaXJlY3RseSBleGNlcHQgZnJvbVxuLy8gYFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3NgLiBUaGUgbm9ybWFsIHdheXMgdG8gY3JlYXRlIGEgU2VtYW50aWNzLCBnaXZlbiBhIGdyYW1tYXIgJ2cnLCBhcmVcbi8vIGBnLmNyZWF0ZVNlbWFudGljcygpYCBhbmQgYGcuZXh0ZW5kU2VtYW50aWNzKHBhcmVudFNlbWFudGljcylgLlxuZnVuY3Rpb24gU2VtYW50aWNzKGdyYW1tYXIsIHN1cGVyU2VtYW50aWNzKSB7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICB0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cyA9IGZhbHNlO1xuICAgIC8vIENvbnN0cnVjdG9yIGZvciB3cmFwcGVyIGluc3RhbmNlcywgd2hpY2ggYXJlIHBhc3NlZCBhcyB0aGUgYXJndW1lbnRzIHRvIHRoZSBzZW1hbnRpYyBhY3Rpb25zXG4gICAgLy8gb2YgYW4gb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZS4gT3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyByZXF1aXJlIGRvdWJsZSBkaXNwYXRjaDogdGhlIHNlbWFudGljXG4gICAgLy8gYWN0aW9uIGlzIGNob3NlbiBiYXNlZCBvbiBib3RoIHRoZSBub2RlJ3MgdHlwZSBhbmQgdGhlIHNlbWFudGljcy4gV3JhcHBlcnMgZW5zdXJlIHRoYXRcbiAgICAvLyB0aGUgYGV4ZWN1dGVgIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCB0aGUgY29ycmVjdCAobW9zdCBzcGVjaWZpYykgc2VtYW50aWNzIG9iamVjdCBhcyBhblxuICAgIC8vIGFyZ3VtZW50LlxuICAgIHRoaXMuV3JhcHBlciA9IGNsYXNzIGV4dGVuZHMgKHN1cGVyU2VtYW50aWNzID8gc3VwZXJTZW1hbnRpY3MuV3JhcHBlciA6IFdyYXBwZXIpIHtcbiAgICAgICAgY29uc3RydWN0b3Iobm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCkge1xuICAgICAgICAgICAgc3VwZXIobm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCk7XG4gICAgICAgICAgICBzZWxmLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkoKTtcbiAgICAgICAgICAgIHRoaXMuX3NlbWFudGljcyA9IHNlbGY7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMuc3VwZXIgPSBzdXBlclNlbWFudGljcztcbiAgICBpZiAoc3VwZXJTZW1hbnRpY3MpIHtcbiAgICAgICAgaWYgKCEoZ3JhbW1hci5lcXVhbHModGhpcy5zdXBlci5ncmFtbWFyKSB8fCBncmFtbWFyLl9pbmhlcml0c0Zyb20odGhpcy5zdXBlci5ncmFtbWFyKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBleHRlbmQgYSBzZW1hbnRpY3MgZm9yIGdyYW1tYXIgJ1wiICtcbiAgICAgICAgICAgICAgICB0aGlzLnN1cGVyLmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInIGZvciB1c2Ugd2l0aCBncmFtbWFyICdcIiArXG4gICAgICAgICAgICAgICAgZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICAgICAgICBcIicgKG5vdCBhIHN1Yi1ncmFtbWFyKVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIub3BlcmF0aW9ucyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IE9iamVjdC5jcmVhdGUodGhpcy5zdXBlci5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgLy8gQXNzaWduIHVuaXF1ZSBzeW1ib2xzIGZvciBlYWNoIG9mIHRoZSBhdHRyaWJ1dGVzIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3Mgc28gdGhhdFxuICAgICAgICAvLyB0aGV5IGFyZSBtZW1vaXplZCBpbmRlcGVuZGVudGx5LlxuICAgICAgICBmb3IgKGNvbnN0IGF0dHJpYnV0ZU5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5hdHRyaWJ1dGVLZXlzLCBhdHRyaWJ1dGVOYW1lLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHV0aWwudW5pcXVlSWQoYXR0cmlidXRlTmFtZSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZUtleXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbn1cblNlbWFudGljcy5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdbc2VtYW50aWNzIGZvciAnICsgdGhpcy5ncmFtbWFyLm5hbWUgKyAnXSc7XG59O1xuU2VtYW50aWNzLnByb3RvdHlwZS5jaGVja0FjdGlvbkRpY3RzSWZIYXZlbnRBbHJlYWR5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5jaGVja2VkQWN0aW9uRGljdHMpIHtcbiAgICAgICAgdGhpcy5jaGVja0FjdGlvbkRpY3RzKCk7XG4gICAgICAgIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gdHJ1ZTtcbiAgICB9XG59O1xuLy8gQ2hlY2tzIHRoYXQgdGhlIGFjdGlvbiBkaWN0aW9uYXJpZXMgZm9yIGFsbCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGluIHRoaXMgc2VtYW50aWNzLFxuLy8gaW5jbHVkaW5nIHRoZSBvbmVzIHRoYXQgd2VyZSBpbmhlcml0ZWQgZnJvbSB0aGUgc3VwZXItc2VtYW50aWNzLCBhZ3JlZSB3aXRoIHRoZSBncmFtbWFyLlxuLy8gVGhyb3dzIGFuIGV4Y2VwdGlvbiBpZiBvbmUgb3IgbW9yZSBvZiB0aGVtIGRvZXNuJ3QuXG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgbGV0IG5hbWU7XG4gICAgZm9yIChuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgICAgICB0aGlzLm9wZXJhdGlvbnNbbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG4gICAgfVxuICAgIGZvciAobmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICAgIH1cbn07XG5TZW1hbnRpY3MucHJvdG90eXBlLnRvUmVjaXBlID0gZnVuY3Rpb24gKHNlbWFudGljc09ubHkpIHtcbiAgICBmdW5jdGlvbiBoYXNTdXBlclNlbWFudGljcyhzKSB7XG4gICAgICAgIHJldHVybiBzLnN1cGVyICE9PSBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCk7XG4gICAgfVxuICAgIGxldCBzdHIgPSAnKGZ1bmN0aW9uKGcpIHtcXG4nO1xuICAgIGlmIChoYXNTdXBlclNlbWFudGljcyh0aGlzKSkge1xuICAgICAgICBzdHIgKz0gJyAgdmFyIHNlbWFudGljcyA9ICcgKyB0aGlzLnN1cGVyLnRvUmVjaXBlKHRydWUpICsgJyhnJztcbiAgICAgICAgY29uc3Qgc3VwZXJTZW1hbnRpY3NHcmFtbWFyID0gdGhpcy5zdXBlci5ncmFtbWFyO1xuICAgICAgICBsZXQgcmVsYXRlZEdyYW1tYXIgPSB0aGlzLmdyYW1tYXI7XG4gICAgICAgIHdoaWxlIChyZWxhdGVkR3JhbW1hciAhPT0gc3VwZXJTZW1hbnRpY3NHcmFtbWFyKSB7XG4gICAgICAgICAgICBzdHIgKz0gJy5zdXBlckdyYW1tYXInO1xuICAgICAgICAgICAgcmVsYXRlZEdyYW1tYXIgPSByZWxhdGVkR3JhbW1hci5zdXBlckdyYW1tYXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RyICs9ICcpO1xcbic7XG4gICAgICAgIHN0ciArPSAnICByZXR1cm4gZy5leHRlbmRTZW1hbnRpY3Moc2VtYW50aWNzKSc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdHIgKz0gJyAgcmV0dXJuIGcuY3JlYXRlU2VtYW50aWNzKCknO1xuICAgIH1cbiAgICBbJ09wZXJhdGlvbicsICdBdHRyaWJ1dGUnXS5mb3JFYWNoKHR5cGUgPT4ge1xuICAgICAgICBjb25zdCBzZW1hbnRpY09wZXJhdGlvbnMgPSB0aGlzW3R5cGUudG9Mb3dlckNhc2UoKSArICdzJ107XG4gICAgICAgIE9iamVjdC5rZXlzKHNlbWFudGljT3BlcmF0aW9ucykuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYWN0aW9uRGljdCwgZm9ybWFscywgYnVpbHRJbkRlZmF1bHQgfSA9IHNlbWFudGljT3BlcmF0aW9uc1tuYW1lXTtcbiAgICAgICAgICAgIGxldCBzaWduYXR1cmUgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKGZvcm1hbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNpZ25hdHVyZSArPSAnKCcgKyBmb3JtYWxzLmpvaW4oJywgJykgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWV0aG9kO1xuICAgICAgICAgICAgaWYgKGhhc1N1cGVyU2VtYW50aWNzKHRoaXMpICYmIHRoaXMuc3VwZXJbdHlwZS50b0xvd2VyQ2FzZSgpICsgJ3MnXVtuYW1lXSkge1xuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICdleHRlbmQnICsgdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICdhZGQnICsgdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ciArPSAnXFxuICAgIC4nICsgbWV0aG9kICsgJygnICsgSlNPTi5zdHJpbmdpZnkoc2lnbmF0dXJlKSArICcsIHsnO1xuICAgICAgICAgICAgY29uc3Qgc3JjQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goYWN0aW9uTmFtZSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbkRpY3RbYWN0aW9uTmFtZV0gIT09IGJ1aWx0SW5EZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgPSBhY3Rpb25EaWN0W2FjdGlvbk5hbWVdLnRvU3RyaW5nKCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IG1ldGhvZCBzaG9ydGhhbmQgdG8gcGxhaW4gb2xkIGZ1bmN0aW9uIHN5bnRheC5cbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hhcmMvb2htL2lzc3Vlcy8yNjNcbiAgICAgICAgICAgICAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoL14uKlxcKC8sICdmdW5jdGlvbignKTtcbiAgICAgICAgICAgICAgICAgICAgc3JjQXJyYXkucHVzaCgnXFxuICAgICAgJyArIEpTT04uc3RyaW5naWZ5KGFjdGlvbk5hbWUpICsgJzogJyArIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdHIgKz0gc3JjQXJyYXkuam9pbignLCcpICsgJ1xcbiAgICB9KSc7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHN0ciArPSAnO1xcbiAgfSknO1xuICAgIGlmICghc2VtYW50aWNzT25seSkge1xuICAgICAgICBzdHIgPVxuICAgICAgICAgICAgJyhmdW5jdGlvbigpIHtcXG4nICtcbiAgICAgICAgICAgICAgICAnICB2YXIgZ3JhbW1hciA9IHRoaXMuZnJvbVJlY2lwZSgnICtcbiAgICAgICAgICAgICAgICBqc29uVG9KUyh0aGlzLmdyYW1tYXIudG9SZWNpcGUoKSkgK1xuICAgICAgICAgICAgICAgICcpO1xcbicgK1xuICAgICAgICAgICAgICAgICcgIHZhciBzZW1hbnRpY3MgPSAnICtcbiAgICAgICAgICAgICAgICBzdHIgK1xuICAgICAgICAgICAgICAgICcoZ3JhbW1hcik7XFxuJyArXG4gICAgICAgICAgICAgICAgJyAgcmV0dXJuIHNlbWFudGljcztcXG4nICtcbiAgICAgICAgICAgICAgICAnfSk7XFxuJztcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG5mdW5jdGlvbiBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpIHtcbiAgICBpZiAoIXByb3RvdHlwZUdyYW1tYXIpIHtcbiAgICAgICAgLy8gVGhlIE9wZXJhdGlvbnMgYW5kIEF0dHJpYnV0ZXMgZ3JhbW1hciB3b24ndCBiZSBhdmFpbGFibGUgd2hpbGUgT2htIGlzIGxvYWRpbmcsXG4gICAgICAgIC8vIGJ1dCB3ZSBjYW4gZ2V0IGF3YXkgdGhlIGZvbGxvd2luZyBzaW1wbGlmaWNhdGlvbiBiL2Mgbm9uZSBvZiB0aGUgb3BlcmF0aW9uc1xuICAgICAgICAvLyB0aGF0IGFyZSB1c2VkIHdoaWxlIGxvYWRpbmcgdGFrZSBhcmd1bWVudHMuXG4gICAgICAgIGNvbW1vbi5hc3NlcnQoc2lnbmF0dXJlLmluZGV4T2YoJygnKSA9PT0gLTEpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogc2lnbmF0dXJlLFxuICAgICAgICAgICAgZm9ybWFsczogW11cbiAgICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgciA9IHByb3RvdHlwZUdyYW1tYXIubWF0Y2goc2lnbmF0dXJlLCB0eXBlID09PSAnb3BlcmF0aW9uJyA/ICdPcGVyYXRpb25TaWduYXR1cmUnIDogJ0F0dHJpYnV0ZVNpZ25hdHVyZScpO1xuICAgIGlmIChyLmZhaWxlZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyLm1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyhyKS5wYXJzZSgpO1xufVxuZnVuY3Rpb24gbmV3RGVmYXVsdEFjdGlvbih0eXBlLCBuYW1lLCBkb0l0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICBjb25zdCB0aGlzVGhpbmcgPSB0aGlzLl9zZW1hbnRpY3Mub3BlcmF0aW9uc1tuYW1lXSB8fCB0aGlzLl9zZW1hbnRpY3MuYXR0cmlidXRlc1tuYW1lXTtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXNUaGluZy5mb3JtYWxzLm1hcChmb3JtYWwgPT4gdGhpcy5hcmdzW2Zvcm1hbF0pO1xuICAgICAgICBpZiAoIXRoaXMuaXNJdGVyYXRpb24oKSAmJiBjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgQ1NUIG5vZGUgY29ycmVzcG9uZHMgdG8gYSBub24tdGVybWluYWwgaW4gdGhlIGdyYW1tYXIgKGUuZy4sIEFkZEV4cHIpLiBUaGUgZmFjdCB0aGF0XG4gICAgICAgICAgICAvLyB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoaXMgYWN0aW9uIGRpY3Rpb25hcnkgZG9lc24ndCBoYXZlIGFuIGFjdGlvbiBmb3IgdGhpcyBwYXJ0aWN1bGFyXG4gICAgICAgICAgICAvLyBub24tdGVybWluYWwgb3IgYSBnZW5lcmljIGBfbm9udGVybWluYWxgIGFjdGlvbi5cbiAgICAgICAgICAgIC8vIEFzIGEgY29udmVuaWVuY2UsIGlmIHRoaXMgbm9kZSBvbmx5IGhhcyBvbmUgY2hpbGQsIHdlIGp1c3QgcmV0dXJuIHRoZSByZXN1bHQgb2YgYXBwbHlpbmdcbiAgICAgICAgICAgIC8vIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIHRvIHRoZSBjaGlsZCBub2RlLlxuICAgICAgICAgICAgcmV0dXJuIGRvSXQuYXBwbHkoY2hpbGRyZW5bMF0sIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSB0aHJvdyBhbiBleGNlcHRpb24gdG8gbGV0IHRoZSBwcm9ncmFtbWVyIGtub3cgdGhhdCB3ZSBkb24ndCBrbm93IHdoYXRcbiAgICAgICAgICAgIC8vIHRvIGRvIHdpdGggdGhpcyBub2RlLlxuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLm1pc3NpbmdTZW1hbnRpY0FjdGlvbih0aGlzLmN0b3JOYW1lLCBuYW1lLCB0eXBlLCBnbG9iYWxBY3Rpb25TdGFjayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuU2VtYW50aWNzLnByb3RvdHlwZS5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uICh0eXBlLCBzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICBjb25zdCB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcbiAgICBjb25zdCBwYXJzZWROYW1lQW5kRm9ybWFsQXJncyA9IHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSwgdHlwZSk7XG4gICAgY29uc3QgbmFtZSA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLm5hbWU7XG4gICAgY29uc3QgZm9ybWFscyA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLmZvcm1hbHM7XG4gICAgLy8gVE9ETzogY2hlY2sgdGhhdCB0aGVyZSBhcmUgbm8gZHVwbGljYXRlIGZvcm1hbCBhcmd1bWVudHNcbiAgICB0aGlzLmFzc2VydE5ld05hbWUobmFtZSwgdHlwZSk7XG4gICAgLy8gQ3JlYXRlIHRoZSBhY3Rpb24gZGljdGlvbmFyeSBmb3IgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgdGhhdCBjb250YWlucyBhIGBfZGVmYXVsdGAgYWN0aW9uXG4gICAgLy8gd2hpY2ggZGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiBpdGVyYXRpb24sIHRlcm1pbmFsLCBhbmQgbm9uLXRlcm1pbmFsIG5vZGVzLi4uXG4gICAgY29uc3QgYnVpbHRJbkRlZmF1bHQgPSBuZXdEZWZhdWx0QWN0aW9uKHR5cGUsIG5hbWUsIGRvSXQpO1xuICAgIGNvbnN0IHJlYWxBY3Rpb25EaWN0ID0geyBfZGVmYXVsdDogYnVpbHRJbkRlZmF1bHQgfTtcbiAgICAvLyAuLi4gYW5kIGFkZCBpbiB0aGUgYWN0aW9ucyBzdXBwbGllZCBieSB0aGUgcHJvZ3JhbW1lciwgd2hpY2ggbWF5IG92ZXJyaWRlIHNvbWUgb3IgYWxsIG9mIHRoZVxuICAgIC8vIGRlZmF1bHQgb25lcy5cbiAgICBPYmplY3Qua2V5cyhhY3Rpb25EaWN0KS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICByZWFsQWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gICAgfSk7XG4gICAgY29uc3QgZW50cnkgPSB0eXBlID09PSAnb3BlcmF0aW9uJ1xuICAgICAgICA/IG5ldyBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KVxuICAgICAgICA6IG5ldyBBdHRyaWJ1dGUobmFtZSwgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KTtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gICAgLy8gY2F0Y2ggZXJyb3JzIGVhcmx5LlxuICAgIGVudHJ5LmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICAgIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSBlbnRyeTtcbiAgICBmdW5jdGlvbiBkb0l0KCkge1xuICAgICAgICAvLyBEaXNwYXRjaCB0byBtb3N0IHNwZWNpZmljIHZlcnNpb24gb2YgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgLS0gaXQgbWF5IGhhdmUgYmVlblxuICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGEgc3ViLXNlbWFudGljcy5cbiAgICAgICAgY29uc3QgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzW3R5cGVQbHVyYWxdW25hbWVdO1xuICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBjYWxsZXIgcGFzc2VkIHRoZSBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZCB0byAnICtcbiAgICAgICAgICAgICAgICBuYW1lICtcbiAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgIHR5cGUgK1xuICAgICAgICAgICAgICAgICcgKGV4cGVjdGVkICcgK1xuICAgICAgICAgICAgICAgIHRoaXNUaGluZy5mb3JtYWxzLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgJywgZ290ICcgK1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICcpJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGFuIFwiYXJndW1lbnRzIG9iamVjdFwiIGZyb20gdGhlIGFyZ3VtZW50cyB0aGF0IHdlcmUgcGFzc2VkIHRvIHRoaXNcbiAgICAgICAgLy8gb3BlcmF0aW9uIC8gYXR0cmlidXRlLlxuICAgICAgICBjb25zdCBhcmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm1hbCA9IHRoaXNUaGluZy5mb3JtYWxzW2lkeF07XG4gICAgICAgICAgICBhcmdzW2Zvcm1hbF0gPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBvbGRBcmdzID0gdGhpcy5hcmdzO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICBjb25zdCBhbnMgPSB0aGlzVGhpbmcuZXhlY3V0ZSh0aGlzLl9zZW1hbnRpY3MsIHRoaXMpO1xuICAgICAgICB0aGlzLmFyZ3MgPSBvbGRBcmdzO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gJ29wZXJhdGlvbicpIHtcbiAgICAgICAgdGhpcy5XcmFwcGVyLnByb3RvdHlwZVtuYW1lXSA9IGRvSXQ7XG4gICAgICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ1snICsgbmFtZSArICcgb3BlcmF0aW9uXSc7XG4gICAgICAgIH07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5XcmFwcGVyLnByb3RvdHlwZSwgbmFtZSwge1xuICAgICAgICAgICAgZ2V0OiBkb0l0LFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlIC8vIFNvIHRoZSBwcm9wZXJ0eSBjYW4gYmUgZGVsZXRlZC5cbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmF0dHJpYnV0ZUtleXMsIG5hbWUsIHtcbiAgICAgICAgICAgIHZhbHVlOiB1dGlsLnVuaXF1ZUlkKG5hbWUpXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5TZW1hbnRpY3MucHJvdG90eXBlLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICBjb25zdCB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBgbmFtZWAgcmVhbGx5IGlzIGp1c3QgYSBuYW1lLCBpLmUuLCB0aGF0IGl0IGRvZXNuJ3QgYWxzbyBjb250YWluIGZvcm1hbHMuXG4gICAgcGFyc2VTaWduYXR1cmUobmFtZSwgJ2F0dHJpYnV0ZScpO1xuICAgIGlmICghKHRoaXMuc3VwZXIgJiYgbmFtZSBpbiB0aGlzLnN1cGVyW3R5cGVQbHVyYWxdKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBleHRlbmQgJyArXG4gICAgICAgICAgICB0eXBlICtcbiAgICAgICAgICAgIFwiICdcIiArXG4gICAgICAgICAgICBuYW1lICtcbiAgICAgICAgICAgIFwiJzogZGlkIG5vdCBpbmhlcml0IGFuIFwiICtcbiAgICAgICAgICAgIHR5cGUgK1xuICAgICAgICAgICAgJyB3aXRoIHRoYXQgbmFtZScpO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbdHlwZVBsdXJhbF0sIG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIicgYWdhaW5cIik7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBhIG5ldyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgd2hvc2UgYWN0aW9uRGljdCBkZWxlZ2F0ZXMgdG8gdGhlIHN1cGVyIG9wZXJhdGlvbiAvXG4gICAgLy8gYXR0cmlidXRlJ3MgYWN0aW9uRGljdCwgYW5kIHdoaWNoIGhhcyBhbGwgdGhlIGtleXMgZnJvbSBgaW5oZXJpdGVkQWN0aW9uRGljdGAuXG4gICAgY29uc3QgaW5oZXJpdGVkRm9ybWFscyA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uZm9ybWFscztcbiAgICBjb25zdCBpbmhlcml0ZWRBY3Rpb25EaWN0ID0gdGhpc1t0eXBlUGx1cmFsXVtuYW1lXS5hY3Rpb25EaWN0O1xuICAgIGNvbnN0IG5ld0FjdGlvbkRpY3QgPSBPYmplY3QuY3JlYXRlKGluaGVyaXRlZEFjdGlvbkRpY3QpO1xuICAgIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgIG5ld0FjdGlvbkRpY3RbbmFtZV0gPSBhY3Rpb25EaWN0W25hbWVdO1xuICAgIH0pO1xuICAgIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPVxuICAgICAgICB0eXBlID09PSAnb3BlcmF0aW9uJ1xuICAgICAgICAgICAgPyBuZXcgT3BlcmF0aW9uKG5hbWUsIGluaGVyaXRlZEZvcm1hbHMsIG5ld0FjdGlvbkRpY3QpXG4gICAgICAgICAgICA6IG5ldyBBdHRyaWJ1dGUobmFtZSwgbmV3QWN0aW9uRGljdCk7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAgIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xufTtcblNlbWFudGljcy5wcm90b3R5cGUuYXNzZXJ0TmV3TmFtZSA9IGZ1bmN0aW9uIChuYW1lLCB0eXBlKSB7XG4gICAgaWYgKFdyYXBwZXIucHJvdG90eXBlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IHRoYXQncyBhIHJlc2VydmVkIG5hbWVcIik7XG4gICAgfVxuICAgIGlmIChuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBvcGVyYXRpb24gd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgfVxuICAgIGlmIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBhdHRyaWJ1dGUgd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgfVxufTtcbi8vIFJldHVybnMgYSB3cmFwcGVyIGZvciB0aGUgZ2l2ZW4gQ1NUIGBub2RlYCBpbiB0aGlzIHNlbWFudGljcy5cbi8vIElmIGBub2RlYCBpcyBhbHJlYWR5IGEgd3JhcHBlciwgcmV0dXJucyBgbm9kZWAgaXRzZWxmLiAgLy8gVE9ETzogd2h5IGlzIHRoaXMgbmVlZGVkP1xuU2VtYW50aWNzLnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24gKG5vZGUsIHNvdXJjZSwgb3B0QmFzZUludGVydmFsKSB7XG4gICAgY29uc3QgYmFzZUludGVydmFsID0gb3B0QmFzZUludGVydmFsIHx8IHNvdXJjZTtcbiAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIHRoaXMuV3JhcHBlciA/IG5vZGUgOiBuZXcgdGhpcy5XcmFwcGVyKG5vZGUsIHNvdXJjZSwgYmFzZUludGVydmFsKTtcbn07XG4vLyBDcmVhdGVzIGEgbmV3IFNlbWFudGljcyBpbnN0YW5jZSBmb3IgYGdyYW1tYXJgLCBpbmhlcml0aW5nIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgZnJvbVxuLy8gYG9wdFN1cGVyU2VtYW50aWNzYCwgaWYgaXQgaXMgc3BlY2lmaWVkLiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHkgZm9yIHRoZSBuZXdcbi8vIFNlbWFudGljcyBpbnN0YW5jZS4gV2hlbiB0aGF0IGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBhIENTVCBub2RlIGFzIGFuIGFyZ3VtZW50LCBpdCByZXR1cm5zXG4vLyBhIHdyYXBwZXIgZm9yIHRoYXQgbm9kZSB3aGljaCBnaXZlcyBhY2Nlc3MgdG8gdGhlIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcHJvdmlkZWQgYnkgdGhpc1xuLy8gc2VtYW50aWNzLlxuU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyA9IGZ1bmN0aW9uIChncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcykge1xuICAgIGNvbnN0IHMgPSBuZXcgU2VtYW50aWNzKGdyYW1tYXIsIG9wdFN1cGVyU2VtYW50aWNzICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHRTdXBlclNlbWFudGljc1xuICAgICAgICA6IFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG4gICAgLy8gVG8gZW5hYmxlIGNsaWVudHMgdG8gaW52b2tlIGEgc2VtYW50aWNzIGxpa2UgYSBmdW5jdGlvbiwgcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHlcbiAgICAvLyBmb3IgYHNgLCB3aGljaCBpcyB0aGUgcmVhbCBgU2VtYW50aWNzYCBpbnN0YW5jZS5cbiAgICBjb25zdCBwcm94eSA9IGZ1bmN0aW9uIEFTZW1hbnRpY3MobWF0Y2hSZXN1bHQpIHtcbiAgICAgICAgaWYgKCEobWF0Y2hSZXN1bHQgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NlbWFudGljcyBleHBlY3RlZCBhIE1hdGNoUmVzdWx0LCBidXQgZ290ICcgK1xuICAgICAgICAgICAgICAgIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcobWF0Y2hSZXN1bHQpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWF0Y2hSZXN1bHQuZmFpbGVkKCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Nhbm5vdCBhcHBseSBTZW1hbnRpY3MgdG8gJyArIG1hdGNoUmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNzdCA9IG1hdGNoUmVzdWx0Ll9jc3Q7XG4gICAgICAgIGlmIChjc3QuZ3JhbW1hciAhPT0gZ3JhbW1hcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVzZSBhIE1hdGNoUmVzdWx0IGZyb20gZ3JhbW1hciAnXCIgK1xuICAgICAgICAgICAgICAgIGNzdC5ncmFtbWFyLm5hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyB3aXRoIGEgc2VtYW50aWNzIGZvciAnXCIgK1xuICAgICAgICAgICAgICAgIGdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoUmVzdWx0LmlucHV0KTtcbiAgICAgICAgcmV0dXJuIHMud3JhcChjc3QsIGlucHV0U3RyZWFtLmludGVydmFsKG1hdGNoUmVzdWx0Ll9jc3RPZmZzZXQsIG1hdGNoUmVzdWx0LmlucHV0Lmxlbmd0aCkpO1xuICAgIH07XG4gICAgLy8gRm9yd2FyZCBwdWJsaWMgbWV0aG9kcyBmcm9tIHRoZSBwcm94eSB0byB0aGUgc2VtYW50aWNzIGluc3RhbmNlLlxuICAgIHByb3h5LmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uIChzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuZXh0ZW5kT3BlcmF0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9O1xuICAgIHByb3h5LmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfTtcbiAgICBwcm94eS5leHRlbmRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYWN0aW9uRGljdCkge1xuICAgICAgICBzLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuX2dldEFjdGlvbkRpY3QgPSBmdW5jdGlvbiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHMub3BlcmF0aW9uc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdIHx8IHMuYXR0cmlidXRlc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICBpZiAoIWFjdGlvbikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcIicgK1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSArXG4gICAgICAgICAgICAgICAgJ1wiIGlzIG5vdCBhIHZhbGlkIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgJyArXG4gICAgICAgICAgICAgICAgJ25hbWUgaW4gdGhpcyBzZW1hbnRpY3MgZm9yIFwiJyArXG4gICAgICAgICAgICAgICAgZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICAgICAgICAnXCInKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWN0aW9uLmFjdGlvbkRpY3Q7XG4gICAgfTtcbiAgICBwcm94eS5fcmVtb3ZlID0gZnVuY3Rpb24gKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSkge1xuICAgICAgICBsZXQgc2VtYW50aWM7XG4gICAgICAgIGlmIChvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgaW4gcy5vcGVyYXRpb25zKSB7XG4gICAgICAgICAgICBzZW1hbnRpYyA9IHMub3BlcmF0aW9uc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICAgICAgZGVsZXRlIHMub3BlcmF0aW9uc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSBpbiBzLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIHNlbWFudGljID0gcy5hdHRyaWJ1dGVzW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgICAgICBkZWxldGUgcy5hdHRyaWJ1dGVzW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHMuV3JhcHBlci5wcm90b3R5cGVbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgcmV0dXJuIHNlbWFudGljO1xuICAgIH07XG4gICAgcHJveHkuZ2V0T3BlcmF0aW9uTmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhzLm9wZXJhdGlvbnMpO1xuICAgIH07XG4gICAgcHJveHkuZ2V0QXR0cmlidXRlTmFtZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhzLmF0dHJpYnV0ZXMpO1xuICAgIH07XG4gICAgcHJveHkuZ2V0R3JhbW1hciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHMuZ3JhbW1hcjtcbiAgICB9O1xuICAgIHByb3h5LnRvUmVjaXBlID0gZnVuY3Rpb24gKHNlbWFudGljc09ubHkpIHtcbiAgICAgICAgcmV0dXJuIHMudG9SZWNpcGUoc2VtYW50aWNzT25seSk7XG4gICAgfTtcbiAgICAvLyBNYWtlIHRoZSBwcm94eSdzIHRvU3RyaW5nKCkgd29yay5cbiAgICBwcm94eS50b1N0cmluZyA9IHMudG9TdHJpbmcuYmluZChzKTtcbiAgICAvLyBSZXR1cm5zIHRoZSBzZW1hbnRpY3MgZm9yIHRoZSBwcm94eS5cbiAgICBwcm94eS5fZ2V0U2VtYW50aWNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcztcbiAgICB9O1xuICAgIHJldHVybiBwcm94eTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBPcGVyYXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFuIE9wZXJhdGlvbiByZXByZXNlbnRzIGEgZnVuY3Rpb24gdG8gYmUgYXBwbGllZCB0byBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIC0tIGl0J3MgdmVyeVxuLy8gc2ltaWxhciB0byBhIFZpc2l0b3IgKGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvVmlzaXRvcl9wYXR0ZXJuKS4gQW4gb3BlcmF0aW9uIGlzIGV4ZWN1dGVkIGJ5XG4vLyByZWN1cnNpdmVseSB3YWxraW5nIHRoZSBDU1QsIGFuZCBhdCBlYWNoIG5vZGUsIGludm9raW5nIHRoZSBtYXRjaGluZyBzZW1hbnRpYyBhY3Rpb24gZnJvbVxuLy8gYGFjdGlvbkRpY3RgLiBTZWUgYE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZWAgZm9yIGRldGFpbHMgb2YgaG93IGEgQ1NUIG5vZGUncyBtYXRjaGluZyBzZW1hbnRpY1xuLy8gYWN0aW9uIGlzIGZvdW5kLlxuY2xhc3MgT3BlcmF0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBmb3JtYWxzLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmZvcm1hbHMgPSBmb3JtYWxzO1xuICAgICAgICB0aGlzLmFjdGlvbkRpY3QgPSBhY3Rpb25EaWN0O1xuICAgICAgICB0aGlzLmJ1aWx0SW5EZWZhdWx0ID0gYnVpbHRJbkRlZmF1bHQ7XG4gICAgfVxuICAgIGNoZWNrQWN0aW9uRGljdChncmFtbWFyKSB7XG4gICAgICAgIGdyYW1tYXIuX2NoZWNrVG9wRG93bkFjdGlvbkRpY3QodGhpcy50eXBlTmFtZSwgdGhpcy5uYW1lLCB0aGlzLmFjdGlvbkRpY3QpO1xuICAgIH1cbiAgICAvLyBFeGVjdXRlIHRoaXMgb3BlcmF0aW9uIG9uIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggYG5vZGVXcmFwcGVyYCBpbiB0aGUgY29udGV4dCBvZiB0aGVcbiAgICAvLyBnaXZlbiBTZW1hbnRpY3MgaW5zdGFuY2UuXG4gICAgZXhlY3V0ZShzZW1hbnRpY3MsIG5vZGVXcmFwcGVyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBMb29rIGZvciBhIHNlbWFudGljIGFjdGlvbiB3aG9zZSBuYW1lIG1hdGNoZXMgdGhlIG5vZGUncyBjb25zdHJ1Y3RvciBuYW1lLCB3aGljaCBpcyBlaXRoZXJcbiAgICAgICAgICAgIC8vIHRoZSBuYW1lIG9mIGEgcnVsZSBpbiB0aGUgZ3JhbW1hciwgb3IgJ190ZXJtaW5hbCcgKGZvciBhIHRlcm1pbmFsIG5vZGUpLCBvciAnX2l0ZXInIChmb3IgYW5cbiAgICAgICAgICAgIC8vIGl0ZXJhdGlvbiBub2RlKS4gSW4gdGhlIGxhdHRlciBjYXNlLCB0aGUgYWN0aW9uIGZ1bmN0aW9uIHJlY2VpdmVzIGEgc2luZ2xlIGFyZ3VtZW50LCB3aGljaFxuICAgICAgICAgICAgLy8gaXMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBDU1Qgbm9kZS5cbiAgICAgICAgICAgIGNvbnN0IGN0b3JOYW1lID0gbm9kZVdyYXBwZXIuX25vZGUuY3Rvck5hbWU7XG4gICAgICAgICAgICBsZXQgYWN0aW9uRm4gPSB0aGlzLmFjdGlvbkRpY3RbY3Rvck5hbWVdO1xuICAgICAgICAgICAgbGV0IGFucztcbiAgICAgICAgICAgIGlmIChhY3Rpb25Gbikge1xuICAgICAgICAgICAgICAgIGdsb2JhbEFjdGlvblN0YWNrLnB1c2goW3RoaXMsIGN0b3JOYW1lXSk7XG4gICAgICAgICAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25Gbiwgbm9kZVdyYXBwZXIuaXNJdGVyYXRpb24oKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoZSBhY3Rpb24gZGljdGlvbmFyeSBkb2VzIG5vdCBjb250YWluIGEgc2VtYW50aWMgYWN0aW9uIGZvciB0aGlzIHNwZWNpZmljIHR5cGUgb2Ygbm9kZS5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBub250ZXJtaW5hbCBub2RlIGFuZCB0aGUgcHJvZ3JhbW1lciBoYXMgcHJvdmlkZWQgYSBgX25vbnRlcm1pbmFsYCBzZW1hbnRpY1xuICAgICAgICAgICAgLy8gYWN0aW9uLCB3ZSBpbnZva2UgaXQ6XG4gICAgICAgICAgICBpZiAobm9kZVdyYXBwZXIuaXNOb250ZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uRm4gPSB0aGlzLmFjdGlvbkRpY3QuX25vbnRlcm1pbmFsO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb25Gbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wdXNoKFt0aGlzLCAnX25vbnRlcm1pbmFsJywgY3Rvck5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25GbiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBpbnZva2UgdGhlICdfZGVmYXVsdCcgc2VtYW50aWMgYWN0aW9uLlxuICAgICAgICAgICAgZ2xvYmFsQWN0aW9uU3RhY2sucHVzaChbdGhpcywgJ2RlZmF1bHQgYWN0aW9uJywgY3Rvck5hbWVdKTtcbiAgICAgICAgICAgIGFucyA9IHRoaXMuZG9BY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgdGhpcy5hY3Rpb25EaWN0Ll9kZWZhdWx0LCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBhbnM7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wb3AoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBJbnZva2UgYGFjdGlvbkZuYCBvbiB0aGUgQ1NUIG5vZGUgdGhhdCBjb3JyZXNwb25kcyB0byBgbm9kZVdyYXBwZXJgLCBpbiB0aGUgY29udGV4dCBvZlxuICAgIC8vIGBzZW1hbnRpY3NgLiBJZiBgb3B0UGFzc0NoaWxkcmVuQXNBcnJheWAgaXMgdHJ1dGh5LCBgYWN0aW9uRm5gIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBzaW5nbGVcbiAgICAvLyBhcmd1bWVudCwgd2hpY2ggaXMgYW4gYXJyYXkgb2Ygd3JhcHBlcnMuIE90aGVyd2lzZSwgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYGFjdGlvbkZuYCB3aWxsXG4gICAgLy8gYmUgZXF1YWwgdG8gdGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGUgQ1NUIG5vZGUuXG4gICAgZG9BY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXlcbiAgICAgICAgICAgID8gYWN0aW9uRm4uY2FsbChub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpXG4gICAgICAgICAgICA6IGFjdGlvbkZuLmFwcGx5KG5vZGVXcmFwcGVyLCBub2RlV3JhcHBlci5fY2hpbGRyZW4oKSk7XG4gICAgfVxufVxuT3BlcmF0aW9uLnByb3RvdHlwZS50eXBlTmFtZSA9ICdvcGVyYXRpb24nO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdHRyaWJ1dGVzIGFyZSBPcGVyYXRpb25zIHdob3NlIHJlc3VsdHMgYXJlIG1lbW9pemVkLiBUaGlzIG1lYW5zIHRoYXQsIGZvciBhbnkgZ2l2ZW4gc2VtYW50aWNzLFxuLy8gdGhlIHNlbWFudGljIGFjdGlvbiBmb3IgYSBDU1Qgbm9kZSB3aWxsIGJlIGludm9rZWQgbm8gbW9yZSB0aGFuIG9uY2UuXG5jbGFzcyBBdHRyaWJ1dGUgZXh0ZW5kcyBPcGVyYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KSB7XG4gICAgICAgIHN1cGVyKG5hbWUsIFtdLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCk7XG4gICAgfVxuICAgIGV4ZWN1dGUoc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAgICAgICBjb25zdCBub2RlID0gbm9kZVdyYXBwZXIuX25vZGU7XG4gICAgICAgIGNvbnN0IGtleSA9IHNlbWFudGljcy5hdHRyaWJ1dGVLZXlzW3RoaXMubmFtZV07XG4gICAgICAgIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGlzIGEgc3VwZXItc2VuZCAtLSBpc24ndCBKUyBiZWF1dGlmdWw/IDovXG4gICAgICAgICAgICBub2RlW2tleV0gPSBPcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzLCBzZW1hbnRpY3MsIG5vZGVXcmFwcGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZVtrZXldO1xuICAgIH1cbn1cbkF0dHJpYnV0ZS5wcm90b3R5cGUudHlwZU5hbWUgPSAnYXR0cmlidXRlJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tIERlZmVycmVkIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tXG51dGlsLmF3YWl0QnVpbHRJblJ1bGVzKGJ1aWx0SW5SdWxlcyA9PiB7XG4gICAgY29uc3Qgb3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzJyk7XG4gICAgaW5pdEJ1aWx0SW5TZW1hbnRpY3MoYnVpbHRJblJ1bGVzKTtcbiAgICBpbml0UHJvdG90eXBlUGFyc2VyKG9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzR3JhbW1hcik7IC8vIHJlcXVpcmVzIEJ1aWx0SW5TZW1hbnRpY3Ncbn0pO1xuZnVuY3Rpb24gaW5pdEJ1aWx0SW5TZW1hbnRpY3MoYnVpbHRJblJ1bGVzKSB7XG4gICAgY29uc3QgYWN0aW9ucyA9IHtcbiAgICAgICAgZW1wdHkoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVyYXRpb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm9uRW1wdHkoZmlyc3QsIF8sIHJlc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLml0ZXJhdGlvbihbZmlyc3RdLmNvbmNhdChyZXN0LmNoaWxkcmVuKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzID0gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyhidWlsdEluUnVsZXMsIG51bGwpLmFkZE9wZXJhdGlvbignYXNJdGVyYXRpb24nLCB7XG4gICAgICAgIGVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBub25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eSxcbiAgICAgICAgRW1wdHlMaXN0T2Y6IGFjdGlvbnMuZW1wdHksXG4gICAgICAgIE5vbmVtcHR5TGlzdE9mOiBhY3Rpb25zLm5vbkVtcHR5XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpbml0UHJvdG90eXBlUGFyc2VyKGdyYW1tYXIpIHtcbiAgICBwcm90b3R5cGVHcmFtbWFyU2VtYW50aWNzID0gZ3JhbW1hci5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3BhcnNlJywge1xuICAgICAgICBBdHRyaWJ1dGVTaWduYXR1cmUobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgICAgICAgICAgZm9ybWFsczogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIE9wZXJhdGlvblNpZ25hdHVyZShuYW1lLCBvcHRGb3JtYWxzKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBmb3JtYWxzOiBvcHRGb3JtYWxzLmNoaWxkcmVuLm1hcChjID0+IGMucGFyc2UoKSlbMF0gfHwgW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIEZvcm1hbHMob3BhcmVuLCBmcywgY3BhcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuYXNJdGVyYXRpb24oKS5jaGlsZHJlbi5tYXAoYyA9PiBjLnBhcnNlKCkpO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lKGZpcnN0LCByZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBwcm90b3R5cGVHcmFtbWFyID0gZ3JhbW1hcjtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBTZW1hbnRpY3M7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbCcpO1xuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGB0b1N0cmluZ2Agb3V0cHV0LlxuY29uc3QgQkFMTE9UX1ggPSAnXFx1MjcxNyc7XG5jb25zdCBDSEVDS19NQVJLID0gJ1xcdTI3MTMnO1xuY29uc3QgRE9UX09QRVJBVE9SID0gJ1xcdTIyQzUnO1xuY29uc3QgUklHSFRXQVJEU19ET1VCTEVfQVJST1cgPSAnXFx1MjFEMic7XG5jb25zdCBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTiA9ICdcXHUyNDA5JztcbmNvbnN0IFNZTUJPTF9GT1JfTElORV9GRUVEID0gJ1xcdTI0MEEnO1xuY29uc3QgU1lNQk9MX0ZPUl9DQVJSSUFHRV9SRVRVUk4gPSAnXFx1MjQwRCc7XG5jb25zdCBGbGFncyA9IHtcbiAgICBzdWNjZWVkZWQ6IDEgPDwgMCxcbiAgICBpc1Jvb3ROb2RlOiAxIDw8IDEsXG4gICAgaXNJbXBsaWNpdFNwYWNlczogMSA8PCAyLFxuICAgIGlzTWVtb2l6ZWQ6IDEgPDwgMyxcbiAgICBpc0hlYWRPZkxlZnRSZWN1cnNpb246IDEgPDwgNCxcbiAgICB0ZXJtaW5hdGVzTFI6IDEgPDwgNVxufTtcbmZ1bmN0aW9uIHNwYWNlcyhuKSB7XG4gICAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBuKS5qb2luKCcnKTtcbn1cbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHBvcnRpb24gb2YgYGlucHV0YCBhdCBvZmZzZXQgYHBvc2AuXG4vLyBUaGUgcmVzdWx0IHdpbGwgY29udGFpbiBleGFjdGx5IGBsZW5gIGNoYXJhY3RlcnMuXG5mdW5jdGlvbiBnZXRJbnB1dEV4Y2VycHQoaW5wdXQsIHBvcywgbGVuKSB7XG4gICAgY29uc3QgZXhjZXJwdCA9IGFzRXNjYXBlZFN0cmluZyhpbnB1dC5zbGljZShwb3MsIHBvcyArIGxlbikpO1xuICAgIC8vIFBhZCB0aGUgb3V0cHV0IGlmIG5lY2Vzc2FyeS5cbiAgICBpZiAoZXhjZXJwdC5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIGV4Y2VycHQgKyBjb21tb24ucmVwZWF0KCcgJywgbGVuIC0gZXhjZXJwdC5sZW5ndGgpLmpvaW4oJycpO1xuICAgIH1cbiAgICByZXR1cm4gZXhjZXJwdDtcbn1cbmZ1bmN0aW9uIGFzRXNjYXBlZFN0cmluZyhvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gUmVwbGFjZSBub24tcHJpbnRhYmxlIGNoYXJhY3RlcnMgd2l0aCB2aXNpYmxlIHN5bWJvbHMuXG4gICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csIERPVF9PUEVSQVRPUilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgU1lNQk9MX0ZPUl9IT1JJWk9OVEFMX1RBQlVMQVRJT04pXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIFNZTUJPTF9GT1JfTElORV9GRUVEKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTik7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcob2JqKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFRyYWNlIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBUcmFjZShpbnB1dCwgcG9zMSwgcG9zMiwgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncywgb3B0Q2hpbGRyZW4pIHtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5wb3MgPSB0aGlzLnBvczEgPSBwb3MxO1xuICAgIHRoaXMucG9zMiA9IHBvczI7XG4gICAgdGhpcy5zb3VyY2UgPSBuZXcgSW50ZXJ2YWwoaW5wdXQsIHBvczEsIHBvczIpO1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBvcHRDaGlsZHJlbiB8fCBbXTtcbiAgICB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeSA9IG51bGw7XG4gICAgdGhpcy5fZmxhZ3MgPSBzdWNjZWVkZWQgPyBGbGFncy5zdWNjZWVkZWQgOiAwO1xufVxuLy8gQSB2YWx1ZSB0aGF0IGNhbiBiZSByZXR1cm5lZCBmcm9tIHZpc2l0b3IgZnVuY3Rpb25zIHRvIGluZGljYXRlIHRoYXQgYVxuLy8gbm9kZSBzaG91bGQgbm90IGJlIHJlY3Vyc2VkIGludG8uXG5UcmFjZS5wcm90b3R5cGUuU0tJUCA9IHt9O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYWNlLnByb3RvdHlwZSwgJ2Rpc3BsYXlTdHJpbmcnLCB7XG4gICAgZ2V0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5leHByLnRvRGlzcGxheVN0cmluZygpO1xuICAgIH1cbn0pO1xuLy8gRm9yIGNvbnZlbmllbmNlLCBjcmVhdGUgYSBnZXR0ZXIgYW5kIHNldHRlciBmb3IgdGhlIGJvb2xlYW4gZmxhZ3MgaW4gYEZsYWdzYC5cbk9iamVjdC5rZXlzKEZsYWdzKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGNvbnN0IG1hc2sgPSBGbGFnc1tuYW1lXTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVHJhY2UucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fZmxhZ3MgJiBtYXNrKSAhPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzIHw9IG1hc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyAmPSB+bWFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5UcmFjZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmVXaXRoRXhwcih0aGlzLmV4cHIpO1xufTtcblRyYWNlLnByb3RvdHlwZS5jbG9uZVdpdGhFeHByID0gZnVuY3Rpb24gKGV4cHIpIHtcbiAgICBjb25zdCBhbnMgPSBuZXcgVHJhY2UodGhpcy5pbnB1dCwgdGhpcy5wb3MsIHRoaXMucG9zMiwgZXhwciwgdGhpcy5zdWNjZWVkZWQsIHRoaXMuYmluZGluZ3MsIHRoaXMuY2hpbGRyZW4pO1xuICAgIGFucy5pc0hlYWRPZkxlZnRSZWN1cnNpb24gPSB0aGlzLmlzSGVhZE9mTGVmdFJlY3Vyc2lvbjtcbiAgICBhbnMuaXNJbXBsaWNpdFNwYWNlcyA9IHRoaXMuaXNJbXBsaWNpdFNwYWNlcztcbiAgICBhbnMuaXNNZW1vaXplZCA9IHRoaXMuaXNNZW1vaXplZDtcbiAgICBhbnMuaXNSb290Tm9kZSA9IHRoaXMuaXNSb290Tm9kZTtcbiAgICBhbnMudGVybWluYXRlc0xSID0gdGhpcy50ZXJtaW5hdGVzTFI7XG4gICAgYW5zLnRlcm1pbmF0aW5nTFJFbnRyeSA9IHRoaXMudGVybWluYXRpbmdMUkVudHJ5O1xuICAgIHJldHVybiBhbnM7XG59O1xuLy8gUmVjb3JkIHRoZSB0cmFjZSBpbmZvcm1hdGlvbiBmb3IgdGhlIHRlcm1pbmF0aW5nIGNvbmRpdGlvbiBvZiB0aGUgTFIgbG9vcC5cblRyYWNlLnByb3RvdHlwZS5yZWNvcmRMUlRlcm1pbmF0aW9uID0gZnVuY3Rpb24gKHJ1bGVCb2R5VHJhY2UsIHZhbHVlKSB7XG4gICAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkgPSBuZXcgVHJhY2UodGhpcy5pbnB1dCwgdGhpcy5wb3MsIHRoaXMucG9zMiwgdGhpcy5leHByLCBmYWxzZSwgW3ZhbHVlXSwgW3J1bGVCb2R5VHJhY2VdKTtcbiAgICB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeS50ZXJtaW5hdGVzTFIgPSB0cnVlO1xufTtcbi8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoaXMgdHJhY2Ugbm9kZSBhbmQgYWxsIGl0cyBkZXNjZW5kZW50cywgY2FsbGluZyBhIHZpc2l0b3IgZnVuY3Rpb25cbi8vIGZvciBlYWNoIG5vZGUgdGhhdCBpcyB2aXNpdGVkLiBJZiBgdmlzdG9yT2JqT3JGbmAgaXMgYW4gb2JqZWN0LCB0aGVuIGl0cyAnZW50ZXInIHByb3BlcnR5XG4vLyBpcyBhIGZ1bmN0aW9uIHRvIGNhbGwgYmVmb3JlIHZpc2l0aW5nIHRoZSBjaGlsZHJlbiBvZiBhIG5vZGUsIGFuZCBpdHMgJ2V4aXQnIHByb3BlcnR5IGlzXG4vLyBhIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXJ3YXJkcy4gSWYgYHZpc2l0b3JPYmpPckZuYCBpcyBhIGZ1bmN0aW9uLCBpdCByZXByZXNlbnRzIHRoZSAnZW50ZXInXG4vLyBmdW5jdGlvbi5cbi8vXG4vLyBUaGUgZnVuY3Rpb25zIGFyZSBjYWxsZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBUcmFjZSBub2RlLCBpdHMgcGFyZW50IFRyYWNlLCBhbmQgYSBudW1iZXJcbi8vIHJlcHJlc2VudGluZyB0aGUgZGVwdGggb2YgdGhlIG5vZGUgaW4gdGhlIHRyZWUuIChUaGUgcm9vdCBub2RlIGhhcyBkZXB0aCAwLikgYG9wdFRoaXNBcmdgLCBpZlxuLy8gc3BlY2lmaWVkLCBpcyB0aGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2Agd2hlbiBleGVjdXRpbmcgdGhlIHZpc2l0b3IgZnVuY3Rpb25zLlxuVHJhY2UucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiAodmlzaXRvck9iak9yRm4sIG9wdFRoaXNBcmcpIHtcbiAgICBsZXQgdmlzaXRvciA9IHZpc2l0b3JPYmpPckZuO1xuICAgIGlmICh0eXBlb2YgdmlzaXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2aXNpdG9yID0geyBlbnRlcjogdmlzaXRvciB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBfd2Fsayhub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgICAgIGxldCByZWN1cnNlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHZpc2l0b3IuZW50ZXIpIHtcbiAgICAgICAgICAgIGlmICh2aXNpdG9yLmVudGVyLmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCkgPT09IFRyYWNlLnByb3RvdHlwZS5TS0lQKSB7XG4gICAgICAgICAgICAgICAgcmVjdXJzZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZWN1cnNlKSB7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIF93YWxrKGNoaWxkLCBub2RlLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodmlzaXRvci5leGl0KSB7XG4gICAgICAgICAgICAgICAgdmlzaXRvci5leGl0LmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNSb290Tm9kZSkge1xuICAgICAgICAvLyBEb24ndCB2aXNpdCB0aGUgcm9vdCBub2RlIGl0c2VsZiwgb25seSBpdHMgY2hpbGRyZW4uXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChjID0+IHtcbiAgICAgICAgICAgIF93YWxrKGMsIG51bGwsIDApO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIF93YWxrKHRoaXMsIG51bGwsIDApO1xuICAgIH1cbn07XG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYWNlLlxuLy8gU2FtcGxlOlxuLy8gICAgIDEy4ouFK+KLhTLii4Uq4ouFMyDinJMgZXhwIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAg4pyTIGFkZEV4cCAoTFIpIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAgICAgIOKclyBhZGRFeHBfcGx1c1xuVHJhY2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICB0aGlzLndhbGsoKG5vZGUsIHBhcmVudCwgZGVwdGgpID0+IHtcbiAgICAgICAgaWYgKCFub2RlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5TS0lQO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN0b3JOYW1lID0gbm9kZS5leHByLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIC8vIERvbid0IHByaW50IGFueXRoaW5nIGZvciBBbHQgbm9kZXMuXG4gICAgICAgIGlmIChjdG9yTmFtZSA9PT0gJ0FsdCcpIHtcbiAgICAgICAgICAgIHJldHVybjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBjb25zaXN0ZW50LXJldHVyblxuICAgICAgICB9XG4gICAgICAgIHNiLmFwcGVuZChnZXRJbnB1dEV4Y2VycHQobm9kZS5pbnB1dCwgbm9kZS5wb3MsIDEwKSArIHNwYWNlcyhkZXB0aCAqIDIgKyAxKSk7XG4gICAgICAgIHNiLmFwcGVuZCgobm9kZS5zdWNjZWVkZWQgPyBDSEVDS19NQVJLIDogQkFMTE9UX1gpICsgJyAnICsgbm9kZS5kaXNwbGF5U3RyaW5nKTtcbiAgICAgICAgaWYgKG5vZGUuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICAgICAgICBzYi5hcHBlbmQoJyAoTFIpJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuc3VjY2VlZGVkKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZW50cyA9IGFzRXNjYXBlZFN0cmluZyhub2RlLnNvdXJjZS5jb250ZW50cyk7XG4gICAgICAgICAgICBzYi5hcHBlbmQoJyAnICsgUklHSFRXQVJEU19ET1VCTEVfQVJST1cgKyAnICAnKTtcbiAgICAgICAgICAgIHNiLmFwcGVuZCh0eXBlb2YgY29udGVudHMgPT09ICdzdHJpbmcnID8gJ1wiJyArIGNvbnRlbnRzICsgJ1wiJyA6IGNvbnRlbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgIH0pO1xuICAgIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xuY29uc3QgZXNjYXBlU3RyaW5nRm9yID0ge307XG5mb3IgKGxldCBjID0gMDsgYyA8IDEyODsgYysrKSB7XG4gICAgZXNjYXBlU3RyaW5nRm9yW2NdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbn1cbmVzY2FwZVN0cmluZ0ZvcltcIidcIi5jaGFyQ29kZUF0KDApXSA9IFwiXFxcXCdcIjtcbmVzY2FwZVN0cmluZ0ZvclsnXCInLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcIic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcXFwnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxcXFxcJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcYic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcZicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGYnO1xuZXNjYXBlU3RyaW5nRm9yWydcXG4nLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxuJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxyJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxccic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcdCcuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHQnO1xuZXNjYXBlU3RyaW5nRm9yWydcXHUwMDBiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcdic7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydHMuYWJzdHJhY3QgPSBmdW5jdGlvbiAob3B0TWV0aG9kTmFtZSkge1xuICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBvcHRNZXRob2ROYW1lIHx8ICcnO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndGhpcyBtZXRob2QgJyArXG4gICAgICAgICAgICBtZXRob2ROYW1lICtcbiAgICAgICAgICAgICcgaXMgYWJzdHJhY3QhICcgK1xuICAgICAgICAgICAgJyhpdCBoYXMgbm8gaW1wbGVtZW50YXRpb24gaW4gY2xhc3MgJyArXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgK1xuICAgICAgICAgICAgJyknKTtcbiAgICB9O1xufTtcbmV4cG9ydHMuYXNzZXJ0ID0gZnVuY3Rpb24gKGNvbmQsIG1lc3NhZ2UpIHtcbiAgICBpZiAoIWNvbmQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICAgIH1cbn07XG4vLyBEZWZpbmUgYSBsYXppbHktY29tcHV0ZWQsIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVkIGBwcm9wTmFtZWBcbi8vIG9uIHRoZSBvYmplY3QgYG9iamAuIGBnZXR0ZXJGbmAgd2lsbCBiZSBjYWxsZWQgdG8gY29tcHV0ZSB0aGUgdmFsdWUgdGhlXG4vLyBmaXJzdCB0aW1lIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZC5cbmV4cG9ydHMuZGVmaW5lTGF6eVByb3BlcnR5ID0gZnVuY3Rpb24gKG9iaiwgcHJvcE5hbWUsIGdldHRlckZuKSB7XG4gICAgbGV0IG1lbW87XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcE5hbWUsIHtcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgaWYgKCFtZW1vKSB7XG4gICAgICAgICAgICAgICAgbWVtbyA9IGdldHRlckZuLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9iaikge1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy5yZXBlYXRGbiA9IGZ1bmN0aW9uIChmbiwgbikge1xuICAgIGNvbnN0IGFyciA9IFtdO1xuICAgIHdoaWxlIChuLS0gPiAwKSB7XG4gICAgICAgIGFyci5wdXNoKGZuKCkpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufTtcbmV4cG9ydHMucmVwZWF0U3RyID0gZnVuY3Rpb24gKHN0ciwgbikge1xuICAgIHJldHVybiBuZXcgQXJyYXkobiArIDEpLmpvaW4oc3RyKTtcbn07XG5leHBvcnRzLnJlcGVhdCA9IGZ1bmN0aW9uICh4LCBuKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMucmVwZWF0Rm4oKCkgPT4geCwgbik7XG59O1xuZXhwb3J0cy5nZXREdXBsaWNhdGVzID0gZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgY29uc3QgZHVwbGljYXRlcyA9IFtdO1xuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgY29uc3QgeCA9IGFycmF5W2lkeF07XG4gICAgICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgICAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZHVwbGljYXRlcztcbn07XG5leHBvcnRzLmNvcHlXaXRob3V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgIGNvbnN0IG5vRHVwbGljYXRlcyA9IFtdO1xuICAgIGFycmF5LmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICBpZiAobm9EdXBsaWNhdGVzLmluZGV4T2YoZW50cnkpIDwgMCkge1xuICAgICAgICAgICAgbm9EdXBsaWNhdGVzLnB1c2goZW50cnkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG5vRHVwbGljYXRlcztcbn07XG5leHBvcnRzLmlzU3ludGFjdGljID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgY29uc3QgZmlyc3RDaGFyID0gcnVsZU5hbWVbMF07XG4gICAgcmV0dXJuIGZpcnN0Q2hhciA9PT0gZmlyc3RDaGFyLnRvVXBwZXJDYXNlKCk7XG59O1xuZXhwb3J0cy5pc0xleGljYWwgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICByZXR1cm4gIWV4cG9ydHMuaXNTeW50YWN0aWMocnVsZU5hbWUpO1xufTtcbmV4cG9ydHMucGFkTGVmdCA9IGZ1bmN0aW9uIChzdHIsIGxlbiwgb3B0Q2hhcikge1xuICAgIGNvbnN0IGNoID0gb3B0Q2hhciB8fCAnICc7XG4gICAgaWYgKHN0ci5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucmVwZWF0U3RyKGNoLCBsZW4gLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG4vLyBTdHJpbmdCdWZmZXJcbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RyaW5ncyA9IFtdO1xufTtcbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgdGhpcy5zdHJpbmdzLnB1c2goc3RyKTtcbn07XG5leHBvcnRzLlN0cmluZ0J1ZmZlci5wcm90b3R5cGUuY29udGVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKTtcbn07XG4vLyBDaGFyYWN0ZXIgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmdcbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uIChjLCBvcHREZWxpbSkge1xuICAgIGNvbnN0IGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApO1xuICAgIGlmICgoYyA9PT0gJ1wiJyB8fCBjID09PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pIHtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KSB7XG4gICAgICAgIHJldHVybiBlc2NhcGVTdHJpbmdGb3JbY2hhckNvZGVdO1xuICAgIH1cbiAgICBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpIHtcbiAgICAgICAgcmV0dXJuICdcXFxceCcgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyLCAnMCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdcXFxcdScgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCA0LCAnMCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHMuY2hhckF0KDApID09PSAnXFxcXCcpIHtcbiAgICAgICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgICAgICAgY2FzZSAnYic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXGInO1xuICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXGYnO1xuICAgICAgICAgICAgY2FzZSAnbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXG4nO1xuICAgICAgICAgICAgY2FzZSAncic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXHInO1xuICAgICAgICAgICAgY2FzZSAndCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXHQnO1xuICAgICAgICAgICAgY2FzZSAndic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICdcXHYnO1xuICAgICAgICAgICAgY2FzZSAneCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNCksIDE2KSk7XG4gICAgICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChzLnN1YnN0cmluZygyLCA2KSwgMTYpKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHMuY2hhckF0KDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG59O1xuLy8gSGVscGVyIGZvciBwcm9kdWNpbmcgYSBkZXNjcmlwdGlvbiBvZiBhbiB1bmtub3duIG9iamVjdCBpbiBhIHNhZmUgd2F5LlxuLy8gRXNwZWNpYWxseSB1c2VmdWwgZm9yIGVycm9yIG1lc3NhZ2VzIHdoZXJlIGFuIHVuZXhwZWN0ZWQgdHlwZSBvZiBvYmplY3Qgd2FzIGVuY291bnRlcmVkLlxuZXhwb3J0cy51bmV4cGVjdGVkT2JqVG9TdHJpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICB9XG4gICAgY29uc3QgYmFzZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IHR5cGVOYW1lO1xuICAgICAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lKSB7XG4gICAgICAgICAgICB0eXBlTmFtZSA9IG9iai5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGJhc2VUb1N0cmluZy5pbmRleE9mKCdbb2JqZWN0ICcpID09PSAwKSB7XG4gICAgICAgICAgICB0eXBlTmFtZSA9IGJhc2VUb1N0cmluZy5zbGljZSg4LCAtMSk7IC8vIEV4dHJhY3QgZS5nLiBcIkFycmF5XCIgZnJvbSBcIltvYmplY3QgQXJyYXldXCIuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0eXBlTmFtZSA9IHR5cGVvZiBvYmo7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR5cGVOYW1lICsgJzogJyArIEpTT04uc3RyaW5naWZ5KFN0cmluZyhvYmopKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGJhc2VUb1N0cmluZztcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuY29uc3QgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgb3B0SW50ZXJ2YWwpIHtcbiAgICBsZXQgZTtcbiAgICBpZiAob3B0SW50ZXJ2YWwpIHtcbiAgICAgICAgZSA9IG5ldyBFcnJvcihvcHRJbnRlcnZhbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSgpICsgbWVzc2FnZSk7XG4gICAgICAgIGUuc2hvcnRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgZS5pbnRlcnZhbCA9IG9wdEludGVydmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgaW50ZXJ2YWxzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKFwiSW50ZXJ2YWwgc291cmNlcyBkb24ndCBtYXRjaFwiKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBncmFtbWFycyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gR3JhbW1hciBzeW50YXggZXJyb3JcbmZ1bmN0aW9uIGdyYW1tYXJTeW50YXhFcnJvcihtYXRjaEZhaWx1cmUpIHtcbiAgICBjb25zdCBlID0gbmV3IEVycm9yKCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsICdtZXNzYWdlJywge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hGYWlsdXJlLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ3Nob3J0TWVzc2FnZScsIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuICdFeHBlY3RlZCAnICsgbWF0Y2hGYWlsdXJlLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZS5pbnRlcnZhbCA9IG1hdGNoRmFpbHVyZS5nZXRJbnRlcnZhbCgpO1xuICAgIHJldHVybiBlO1xufVxuLy8gVW5kZWNsYXJlZCBncmFtbWFyXG5mdW5jdGlvbiB1bmRlY2xhcmVkR3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBpbnRlcnZhbCkge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBuYW1lc3BhY2VcbiAgICAgICAgPyAnR3JhbW1hciAnICtcbiAgICAgICAgICAgIGdyYW1tYXJOYW1lICtcbiAgICAgICAgICAgICcgaXMgbm90IGRlY2xhcmVkIGluIG5hbWVzcGFjZSAnICtcbiAgICAgICAgICAgIE5hbWVzcGFjZS50b1N0cmluZyhuYW1lc3BhY2UpXG4gICAgICAgIDogJ1VuZGVjbGFyZWQgZ3JhbW1hciAnICsgZ3JhbW1hck5hbWU7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGludGVydmFsKTtcbn1cbi8vIER1cGxpY2F0ZSBncmFtbWFyIGRlY2xhcmF0aW9uXG5mdW5jdGlvbiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZ3JhbW1hciwgbmFtZXNwYWNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdHcmFtbWFyICcgKyBncmFtbWFyLm5hbWUgKyAnIGlzIGFscmVhZHkgZGVjbGFyZWQgaW4gdGhpcyBuYW1lc3BhY2UnKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHJ1bGVzIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBVbmRlY2xhcmVkIHJ1bGVcbmZ1bmN0aW9uIHVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0SW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1J1bGUgJyArIHJ1bGVOYW1lICsgJyBpcyBub3QgZGVjbGFyZWQgaW4gZ3JhbW1hciAnICsgZ3JhbW1hck5hbWUsIG9wdEludGVydmFsKTtcbn1cbi8vIENhbm5vdCBvdmVycmlkZSB1bmRlY2xhcmVkIHJ1bGVcbmZ1bmN0aW9uIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ0Nhbm5vdCBvdmVycmlkZSBydWxlICcgKyBydWxlTmFtZSArICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpO1xufVxuLy8gQ2Fubm90IGV4dGVuZCB1bmRlY2xhcmVkIHJ1bGVcbmZ1bmN0aW9uIGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdDYW5ub3QgZXh0ZW5kIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgZ3JhbW1hck5hbWUsIG9wdFNvdXJjZSk7XG59XG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuZnVuY3Rpb24gZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgZGVjbEdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpIHtcbiAgICBsZXQgbWVzc2FnZSA9IFwiRHVwbGljYXRlIGRlY2xhcmF0aW9uIGZvciBydWxlICdcIiArIHJ1bGVOYW1lICsgXCInIGluIGdyYW1tYXIgJ1wiICsgZ3JhbW1hck5hbWUgKyBcIidcIjtcbiAgICBpZiAoZ3JhbW1hck5hbWUgIT09IGRlY2xHcmFtbWFyTmFtZSkge1xuICAgICAgICBtZXNzYWdlICs9IFwiIChvcmlnaW5hbGx5IGRlY2xhcmVkIGluICdcIiArIGRlY2xHcmFtbWFyTmFtZSArIFwiJylcIjtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdFNvdXJjZSk7XG59XG4vLyBXcm9uZyBudW1iZXIgb2YgcGFyYW1ldGVyc1xuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHNvdXJjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnMgZm9yIHJ1bGUgJyArXG4gICAgICAgIHJ1bGVOYW1lICtcbiAgICAgICAgJyAoZXhwZWN0ZWQgJyArXG4gICAgICAgIGV4cGVjdGVkICtcbiAgICAgICAgJywgZ290ICcgK1xuICAgICAgICBhY3R1YWwgK1xuICAgICAgICAnKScsIHNvdXJjZSk7XG59XG4vLyBXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXG5mdW5jdGlvbiB3cm9uZ051bWJlck9mQXJndW1lbnRzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIGZvciBydWxlICcgK1xuICAgICAgICBydWxlTmFtZSArXG4gICAgICAgICcgKGV4cGVjdGVkICcgK1xuICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgYWN0dWFsICtcbiAgICAgICAgJyknLCBleHByLnNvdXJjZSk7XG59XG4vLyBEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzXG5mdW5jdGlvbiBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhydWxlTmFtZSwgZHVwbGljYXRlcywgc291cmNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzIGluIHJ1bGUgJyArIHJ1bGVOYW1lICsgJzogJyArIGR1cGxpY2F0ZXMuam9pbignLCAnKSwgc291cmNlKTtcbn1cbi8vIEludmFsaWQgcGFyYW1ldGVyIGV4cHJlc3Npb25cbmZ1bmN0aW9uIGludmFsaWRQYXJhbWV0ZXIocnVsZU5hbWUsIGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyIHRvIHJ1bGUgJyArXG4gICAgICAgIHJ1bGVOYW1lICtcbiAgICAgICAgJzogJyArXG4gICAgICAgIGV4cHIgK1xuICAgICAgICAnIGhhcyBhcml0eSAnICtcbiAgICAgICAgZXhwci5nZXRBcml0eSgpICtcbiAgICAgICAgJywgYnV0IHBhcmFtZXRlciBleHByZXNzaW9ucyBtdXN0IGhhdmUgYXJpdHkgMScsIGV4cHIuc291cmNlKTtcbn1cbi8vIEFwcGxpY2F0aW9uIG9mIHN5bnRhY3RpYyBydWxlIGZyb20gbGV4aWNhbCBydWxlXG5mdW5jdGlvbiBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dChydWxlTmFtZSwgYXBwbHlFeHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdDYW5ub3QgYXBwbHkgc3ludGFjdGljIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBmcm9tIGhlcmUgKGluc2lkZSBhIGxleGljYWwgY29udGV4dCknLCBhcHBseUV4cHIuc291cmNlKTtcbn1cbi8vIEluY29ycmVjdCBhcmd1bWVudCB0eXBlXG5mdW5jdGlvbiBpbmNvcnJlY3RBcmd1bWVudFR5cGUoZXhwZWN0ZWRUeXBlLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdJbmNvcnJlY3QgYXJndW1lbnQgdHlwZTogZXhwZWN0ZWQgJyArIGV4cGVjdGVkVHlwZSwgZXhwci5zb3VyY2UpO1xufVxuLy8gTXVsdGlwbGUgaW5zdGFuY2VzIG9mIHRoZSBzdXBlci1zcGxpY2Ugb3BlcmF0b3IgKGAuLi5gKSBpbiB0aGUgcnVsZSBib2R5LlxuZnVuY3Rpb24gbXVsdGlwbGVTdXBlclNwbGljZXMoZXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihcIicuLi4nIGNhbiBhcHBlYXIgYXQgbW9zdCBvbmNlIGluIGEgcnVsZSBib2R5XCIsIGV4cHIuc291cmNlKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIEtsZWVuZSBvcGVyYXRvcnMgLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQoa2xlZW5lRXhwciwgYXBwbGljYXRpb25TdGFjaykge1xuICAgIGNvbnN0IGFjdHVhbHMgPSBhcHBsaWNhdGlvblN0YWNrLmxlbmd0aCA+IDAgPyBhcHBsaWNhdGlvblN0YWNrW2FwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMV0uYXJncyA6IFtdO1xuICAgIGNvbnN0IGV4cHIgPSBrbGVlbmVFeHByLmV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICBsZXQgbWVzc2FnZSA9ICdOdWxsYWJsZSBleHByZXNzaW9uICcgK1xuICAgICAgICBleHByICtcbiAgICAgICAgXCIgaXMgbm90IGFsbG93ZWQgaW5zaWRlICdcIiArXG4gICAgICAgIGtsZWVuZUV4cHIub3BlcmF0b3IgK1xuICAgICAgICBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCI7XG4gICAgaWYgKGFwcGxpY2F0aW9uU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBzdGFja1RyYWNlID0gYXBwbGljYXRpb25TdGFja1xuICAgICAgICAgICAgLm1hcChhcHAgPT4gbmV3IHBleHBycy5BcHBseShhcHAucnVsZU5hbWUsIGFwcC5hcmdzKSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICAgICAgbWVzc2FnZSArPSAnXFxuQXBwbGljYXRpb24gc3RhY2sgKG1vc3QgcmVjZW50IGFwcGxpY2F0aW9uIGxhc3QpOlxcbicgKyBzdGFja1RyYWNlO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlRXJyb3IobWVzc2FnZSwga2xlZW5lRXhwci5leHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBhcml0eSAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1J1bGUgJyArXG4gICAgICAgIHJ1bGVOYW1lICtcbiAgICAgICAgJyBpbnZvbHZlcyBhbiBhbHRlcm5hdGlvbiB3aGljaCBoYXMgaW5jb25zaXN0ZW50IGFyaXR5ICcgK1xuICAgICAgICAnKGV4cGVjdGVkICcgK1xuICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgYWN0dWFsICtcbiAgICAgICAgJyknLCBleHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ09iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJykpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gY29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpbnZhbGlkQ29uc3RydWN0b3JDYWxsKGdyYW1tYXIsIGN0b3JOYW1lLCBjaGlsZHJlbikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQXR0ZW1wdCB0byBpbnZva2UgY29uc3RydWN0b3IgJyArIGN0b3JOYW1lICsgJyB3aXRoIGludmFsaWQgb3IgdW5leHBlY3RlZCBhcmd1bWVudHMnKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnZlbmllbmNlIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBtdWx0aXBsZUVycm9ycyhlcnJvcnMpIHtcbiAgICBjb25zdCBtZXNzYWdlcyA9IGVycm9ycy5tYXAoZSA9PiBlLm1lc3NhZ2UpO1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihbJ0Vycm9yczonXS5jb25jYXQobWVzc2FnZXMpLmpvaW4oJ1xcbi0gJyksIGVycm9yc1swXS5pbnRlcnZhbCk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBzZW1hbnRpYyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gbWlzc2luZ1NlbWFudGljQWN0aW9uKGN0b3JOYW1lLCBuYW1lLCB0eXBlLCBzdGFjaykge1xuICAgIGxldCBzdGFja1RyYWNlID0gc3RhY2tcbiAgICAgICAgLnNsaWNlKDAsIC0xKVxuICAgICAgICAubWFwKGluZm8gPT4ge1xuICAgICAgICBjb25zdCBhbnMgPSAnICAnICsgaW5mb1swXS5uYW1lICsgJyA+ICcgKyBpbmZvWzFdO1xuICAgICAgICByZXR1cm4gaW5mby5sZW5ndGggPT09IDMgPyBhbnMgKyBcIiBmb3IgJ1wiICsgaW5mb1syXSArIFwiJ1wiIDogYW5zO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICBzdGFja1RyYWNlICs9ICdcXG4gICcgKyBuYW1lICsgJyA+ICcgKyBjdG9yTmFtZTtcbiAgICBsZXQgbW9yZUluZm8gPSAnJztcbiAgICBpZiAoY3Rvck5hbWUgPT09ICdfaXRlcicpIHtcbiAgICAgICAgbW9yZUluZm8gPSBbXG4gICAgICAgICAgICAnXFxuTk9URTogYXMgb2YgT2htIHYxNiwgdGhlcmUgaXMgbm8gZGVmYXVsdCBhY3Rpb24gZm9yIGl0ZXJhdGlvbiBub2RlcyDigJQgc2VlICcsXG4gICAgICAgICAgICAnICBodHRwczovL2dpdC5pby9KUnd0RyBmb3IgZGV0YWlscy4nXG4gICAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2UgPSBbXG4gICAgICAgIGBNaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3IgJyR7Y3Rvck5hbWV9JyBpbiAke3R5cGV9ICcke25hbWV9Jy4ke21vcmVJbmZvfWAsXG4gICAgICAgICdBY3Rpb24gc3RhY2sgKG1vc3QgcmVjZW50IGNhbGwgbGFzdCk6JyxcbiAgICAgICAgc3RhY2tUcmFjZVxuICAgIF0uam9pbignXFxuJyk7XG4gICAgY29uc3QgZSA9IGNyZWF0ZUVycm9yKG1lc3NhZ2UpO1xuICAgIGUubmFtZSA9ICdtaXNzaW5nU2VtYW50aWNBY3Rpb24nO1xuICAgIHJldHVybiBlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCxcbiAgICBjYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZSxcbiAgICBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlLFxuICAgIGR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbixcbiAgICBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyxcbiAgICBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzLFxuICAgIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbixcbiAgICBpbmNvbnNpc3RlbnRBcml0eSxcbiAgICBpbmNvcnJlY3RBcmd1bWVudFR5cGUsXG4gICAgaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoLFxuICAgIGludmFsaWRDb25zdHJ1Y3RvckNhbGwsXG4gICAgaW52YWxpZFBhcmFtZXRlcixcbiAgICBncmFtbWFyU3ludGF4RXJyb3IsXG4gICAga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCxcbiAgICBtaXNzaW5nU2VtYW50aWNBY3Rpb24sXG4gICAgbXVsdGlwbGVTdXBlclNwbGljZXMsXG4gICAgdW5kZWNsYXJlZEdyYW1tYXIsXG4gICAgdW5kZWNsYXJlZFJ1bGUsXG4gICAgd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyxcbiAgICB3cm9uZ051bWJlck9mUGFyYW1ldGVycyxcbiAgICB0aHJvd0Vycm9ycyhlcnJvcnMpIHtcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yc1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG11bHRpcGxlRXJyb3JzKGVycm9ycyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBCdWlsZGVyID0gcmVxdWlyZSgnLi9CdWlsZGVyJyk7XG5jb25zdCBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG5jb25zdCBOYW1lc3BhY2UgPSByZXF1aXJlKCcuL05hbWVzcGFjZScpO1xuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbmNvbnN0IGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgdmVyc2lvbiA9IHJlcXVpcmUoJy4vdmVyc2lvbicpO1xuY29uc3QgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhlIG1ldGFncmFtbWFyLCBpLmUuIHRoZSBncmFtbWFyIGZvciBPaG0gZ3JhbW1hcnMuIEluaXRpYWxpemVkIGF0IHRoZVxuLy8gYm90dG9tIG9mIHRoaXMgZmlsZSBiZWNhdXNlIGxvYWRpbmcgdGhlIGdyYW1tYXIgcmVxdWlyZXMgT2htIGl0c2VsZi5cbmxldCBvaG1HcmFtbWFyO1xuY29uc3Qgc3VwZXJTcGxpY2VQbGFjZWhvbGRlciA9IE9iamVjdC5jcmVhdGUocGV4cHJzLlBFeHByLnByb3RvdHlwZSk7XG4vLyBSZXR1cm5zIGEgR3JhbW1hciBpbnN0YW5jZSAoaS5lLiwgYW4gb2JqZWN0IHdpdGggYSBgbWF0Y2hgIG1ldGhvZCkgZm9yXG4vLyBgdHJlZWAsIHdoaWNoIGlzIHRoZSBjb25jcmV0ZSBzeW50YXggdHJlZSBvZiBhIHVzZXItd3JpdHRlbiBncmFtbWFyLlxuLy8gVGhlIGdyYW1tYXIgd2lsbCBiZSBhc3NpZ25lZCBpbnRvIGBuYW1lc3BhY2VgIHVuZGVyIHRoZSBuYW1lIG9mIHRoZSBncmFtbWFyXG4vLyBhcyBzcGVjaWZpZWQgaW4gdGhlIHNvdXJjZS5cbmZ1bmN0aW9uIGJ1aWxkR3JhbW1hcihtYXRjaCwgbmFtZXNwYWNlLCBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZykge1xuICAgIGNvbnN0IGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuICAgIGxldCBkZWNsO1xuICAgIGxldCBjdXJyZW50UnVsZU5hbWU7XG4gICAgbGV0IGN1cnJlbnRSdWxlRm9ybWFscztcbiAgICBsZXQgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IG1ldGFHcmFtbWFyID0gb3B0T2htR3JhbW1hckZvclRlc3RpbmcgfHwgb2htR3JhbW1hcjtcbiAgICAvLyBBIHZpc2l0b3IgdGhhdCBwcm9kdWNlcyBhIEdyYW1tYXIgaW5zdGFuY2UgZnJvbSB0aGUgQ1NULlxuICAgIGNvbnN0IGhlbHBlcnMgPSBtZXRhR3JhbW1hci5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3Zpc2l0Jywge1xuICAgICAgICBHcmFtbWFycyhncmFtbWFySXRlcikge1xuICAgICAgICAgICAgcmV0dXJuIGdyYW1tYXJJdGVyLmNoaWxkcmVuLm1hcChjID0+IGMudmlzaXQoKSk7XG4gICAgICAgIH0sXG4gICAgICAgIEdyYW1tYXIoaWQsIHMsIF9vcGVuLCBydWxlcywgX2Nsb3NlKSB7XG4gICAgICAgICAgICBjb25zdCBncmFtbWFyTmFtZSA9IGlkLnZpc2l0KCk7XG4gICAgICAgICAgICBkZWNsID0gYnVpbGRlci5uZXdHcmFtbWFyKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgICAgICAgcy5jaGlsZCgwKSAmJiBzLmNoaWxkKDApLnZpc2l0KCk7XG4gICAgICAgICAgICBydWxlcy5jaGlsZHJlbi5tYXAoYyA9PiBjLnZpc2l0KCkpO1xuICAgICAgICAgICAgY29uc3QgZyA9IGRlY2wuYnVpbGQoKTtcbiAgICAgICAgICAgIGcuc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgaWYgKGdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZywgbmFtZXNwYWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hbWVzcGFjZVtncmFtbWFyTmFtZV0gPSBnO1xuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgIH0sXG4gICAgICAgIFN1cGVyR3JhbW1hcihfLCBuKSB7XG4gICAgICAgICAgICBjb25zdCBzdXBlckdyYW1tYXJOYW1lID0gbi52aXNpdCgpO1xuICAgICAgICAgICAgaWYgKHN1cGVyR3JhbW1hck5hbWUgPT09ICdudWxsJykge1xuICAgICAgICAgICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbmFtZXNwYWNlIHx8ICEoc3VwZXJHcmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkR3JhbW1hcihzdXBlckdyYW1tYXJOYW1lLCBuYW1lc3BhY2UsIG4uc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG5hbWVzcGFjZVtzdXBlckdyYW1tYXJOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVfZGVmaW5lKG4sIGZzLCBkLCBfLCBiKSB7XG4gICAgICAgICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy5jaGlsZHJlbi5tYXAoYyA9PiBjLnZpc2l0KCkpWzBdIHx8IFtdO1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgbm8gZGVmYXVsdCBzdGFydCBydWxlIHlldCwgc2V0IGl0IG5vdy4gVGhpcyBtdXN0IGJlIGRvbmUgYmVmb3JlIHZpc2l0aW5nXG4gICAgICAgICAgICAvLyB0aGUgYm9keSwgYmVjYXVzZSBpdCBtaWdodCBjb250YWluIGFuIGlubGluZSBydWxlIGRlZmluaXRpb24uXG4gICAgICAgICAgICBpZiAoIWRlY2wuZGVmYXVsdFN0YXJ0UnVsZSAmJiBkZWNsLmVuc3VyZVN1cGVyR3JhbW1hcigpICE9PSBHcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzKSB7XG4gICAgICAgICAgICAgICAgZGVjbC53aXRoRGVmYXVsdFN0YXJ0UnVsZShjdXJyZW50UnVsZU5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZC5jaGlsZHJlbi5tYXAoYyA9PiBjLnZpc2l0KCkpWzBdO1xuICAgICAgICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgcmV0dXJuIGRlY2wuZGVmaW5lKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUnVsZV9vdmVycmlkZShuLCBmcywgXywgYikge1xuICAgICAgICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMuY2hpbGRyZW4ubWFwKGMgPT4gYy52aXNpdCgpKVswXSB8fCBbXTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIGRlY2wuZW5zdXJlU3VwZXJHcmFtbWFyUnVsZUZvck92ZXJyaWRpbmcoY3VycmVudFJ1bGVOYW1lLCBzb3VyY2UpO1xuICAgICAgICAgICAgb3ZlcnJpZGluZyA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgICAgICAgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGRlY2wub3ZlcnJpZGUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVfZXh0ZW5kKG4sIGZzLCBfLCBiKSB7XG4gICAgICAgICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy5jaGlsZHJlbi5tYXAoYyA9PiBjLnZpc2l0KCkpWzBdIHx8IFtdO1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIHJldHVybiBkZWNsLmV4dGVuZChjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUnVsZUJvZHkoXywgdGVybXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB0ZXJtcy52aXNpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBPdmVycmlkZVJ1bGVCb2R5KF8sIHRlcm1zKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gdGVybXMudmlzaXQoKTtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzdXBlci1zcGxpY2Ugb3BlcmF0b3IgKGAuLi5gKSBhcHBlYXJzIGluIHRoZSB0ZXJtcy5cbiAgICAgICAgICAgIGNvbnN0IGV4cGFuc2lvblBvcyA9IGFyZ3MuaW5kZXhPZihzdXBlclNwbGljZVBsYWNlaG9sZGVyKTtcbiAgICAgICAgICAgIGlmIChleHBhbnNpb25Qb3MgPj0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGJlZm9yZVRlcm1zID0gYXJncy5zbGljZSgwLCBleHBhbnNpb25Qb3MpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFmdGVyVGVybXMgPSBhcmdzLnNsaWNlKGV4cGFuc2lvblBvcyArIDEpO1xuICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBpdCBhcHBlYXJzIG5vIG1vcmUgdGhhbiBvbmNlLlxuICAgICAgICAgICAgICAgIGFmdGVyVGVybXMuZm9yRWFjaCh0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT09IHN1cGVyU3BsaWNlUGxhY2Vob2xkZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcnMubXVsdGlwbGVTdXBlclNwbGljZXModCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuU3BsaWNlKGRlY2wuc3VwZXJHcmFtbWFyLCBjdXJyZW50UnVsZU5hbWUsIGJlZm9yZVRlcm1zLCBhZnRlclRlcm1zKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgRm9ybWFscyhvcG9pbnR5LCBmcywgY3BvaW50eSkge1xuICAgICAgICAgICAgcmV0dXJuIGZzLnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIFBhcmFtcyhvcG9pbnR5LCBwcywgY3BvaW50eSkge1xuICAgICAgICAgICAgcmV0dXJuIHBzLnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIEFsdChzZXFzKSB7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gc2Vxcy52aXNpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBUb3BMZXZlbFRlcm1faW5saW5lKGIsIG4pIHtcbiAgICAgICAgICAgIGNvbnN0IGlubGluZVJ1bGVOYW1lID0gY3VycmVudFJ1bGVOYW1lICsgJ18nICsgbi52aXNpdCgpO1xuICAgICAgICAgICAgY29uc3QgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIGNvbnN0IGlzTmV3UnVsZURlY2xhcmF0aW9uID0gIShkZWNsLnN1cGVyR3JhbW1hciAmJiBkZWNsLnN1cGVyR3JhbW1hci5ydWxlc1tpbmxpbmVSdWxlTmFtZV0pO1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRpbmcgJiYgIWlzTmV3UnVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVjbC5vdmVycmlkZShpbmxpbmVSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVjbC5kZWZpbmUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IGN1cnJlbnRSdWxlRm9ybWFscy5tYXAoZm9ybWFsID0+IGJ1aWxkZXIuYXBwKGZvcm1hbCkpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKGlubGluZVJ1bGVOYW1lLCBwYXJhbXMpLndpdGhTb3VyY2UoYm9keS5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBPdmVycmlkZVRvcExldmVsVGVybV9zdXBlclNwbGljZShfKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXJTcGxpY2VQbGFjZWhvbGRlcjtcbiAgICAgICAgfSxcbiAgICAgICAgU2VxKGV4cHIpIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLnNlcVxuICAgICAgICAgICAgICAgIC5hcHBseShidWlsZGVyLCBleHByLmNoaWxkcmVuLm1hcChjID0+IGMudmlzaXQoKSkpXG4gICAgICAgICAgICAgICAgLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBJdGVyX3N0YXIoeCwgXykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuc3Rhcih4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBJdGVyX3BsdXMoeCwgXykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIucGx1cyh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBJdGVyX29wdCh4LCBfKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5vcHQoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUHJlZF9ub3QoXywgeCkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIubm90KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFByZWRfbG9va2FoZWFkKF8sIHgpIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmxvb2thaGVhZCh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBMZXhfbGV4KF8sIHgpIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmxleCh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX2FwcGxpY2F0aW9uKHJ1bGUsIHBzKSB7XG4gICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBwcy5jaGlsZHJlbi5tYXAoYyA9PiBjLnZpc2l0KCkpWzBdIHx8IFtdO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKHJ1bGUudmlzaXQoKSwgcGFyYW1zKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9yYW5nZShmcm9tLCBfLCB0bykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIucmFuZ2UoZnJvbS52aXNpdCgpLCB0by52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV90ZXJtaW5hbChleHByKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci50ZXJtaW5hbChleHByLnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX3BhcmVuKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4geC52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBydWxlRGVzY3Iob3BlbiwgdCwgY2xvc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB0LnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bGVEZXNjclRleHQoXykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nLnRyaW0oKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FzZU5hbWUoXywgc3BhY2UxLCBuLCBzcGFjZTIsIGVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIG4udmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZShmaXJzdCwgcmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lRmlyc3QoZXhwcikgeyB9LFxuICAgICAgICBuYW1lUmVzdChleHByKSB7IH0sXG4gICAgICAgIHRlcm1pbmFsKG9wZW4sIGNzLCBjbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGNzLmNoaWxkcmVuLm1hcChjID0+IGMudmlzaXQoKSkuam9pbignJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uZUNoYXJUZXJtaW5hbChvcGVuLCBjLCBjbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMudmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVybWluYWxDaGFyKF8pIHtcbiAgICAgICAgICAgIHJldHVybiBjb21tb24udW5lc2NhcGVDaGFyKHRoaXMuc291cmNlU3RyaW5nKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBlQ2hhcihfKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIE5vbmVtcHR5TGlzdE9mKHgsIF8sIHhzKSB7XG4gICAgICAgICAgICByZXR1cm4gW3gudmlzaXQoKV0uY29uY2F0KHhzLmNoaWxkcmVuLm1hcChjID0+IGMudmlzaXQoKSkpO1xuICAgICAgICB9LFxuICAgICAgICBFbXB0eUxpc3RPZigpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSxcbiAgICAgICAgX3Rlcm1pbmFsKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlbHBlcnMobWF0Y2gpLnZpc2l0KCk7XG59XG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5hbWVzcGFjZSkge1xuICAgIGNvbnN0IG0gPSBvaG1HcmFtbWFyLm1hdGNoKHNvdXJjZSwgJ0dyYW1tYXJzJyk7XG4gICAgaWYgKG0uZmFpbGVkKCkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmdyYW1tYXJTeW50YXhFcnJvcihtKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1aWxkR3JhbW1hcihtLCBuYW1lc3BhY2UpO1xufVxuZnVuY3Rpb24gZ3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICAgIGNvbnN0IG5zID0gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpO1xuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBzb3VyY2UgY29udGFpbmVkIG5vIG1vcmUgdGhhbiBvbmUgZ3JhbW1hciBkZWZpbml0aW9uLlxuICAgIGNvbnN0IGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKG5zKTtcbiAgICBpZiAoZ3JhbW1hck5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZ3JhbW1hciBkZWZpbml0aW9uJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IHNlY29uZEdyYW1tYXIgPSBuc1tncmFtbWFyTmFtZXNbMV1dO1xuICAgICAgICBjb25zdCBpbnRlcnZhbCA9IHNlY29uZEdyYW1tYXIuc291cmNlO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZShpbnRlcnZhbC5zb3VyY2VTdHJpbmcsIGludGVydmFsLnN0YXJ0SWR4KSArXG4gICAgICAgICAgICAnRm91bmQgbW9yZSB0aGFuIG9uZSBncmFtbWFyIGRlZmluaXRpb24gLS0gdXNlIG9obS5ncmFtbWFycygpIGluc3RlYWQuJyk7XG4gICAgfVxuICAgIHJldHVybiBuc1tncmFtbWFyTmFtZXNbMF1dOyAvLyBSZXR1cm4gdGhlIG9uZSBhbmQgb25seSBncmFtbWFyLlxufVxuZnVuY3Rpb24gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgICBjb25zdCBucyA9IE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLmFzTmFtZXNwYWNlKG9wdE5hbWVzcGFjZSkpO1xuICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBGb3IgY29udmVuaWVuY2UsIGRldGVjdCBOb2RlLmpzIEJ1ZmZlciBvYmplY3RzIGFuZCBhdXRvbWF0aWNhbGx5IGNhbGwgdG9TdHJpbmcoKS5cbiAgICAgICAgaWYgKGlzQnVmZmVyKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgc3RyaW5nIGFzIGZpcnN0IGFyZ3VtZW50LCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoc291cmNlKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGlsZUFuZExvYWQoc291cmNlLCBucyk7XG4gICAgcmV0dXJuIG5zO1xufVxuZnVuY3Rpb24gZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50KG9wdE5vZGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dyYW1tYXJGcm9tU2NyaXB0RWxlbWVudCB3YXMgcmVtb3ZlZCBpbiBPaG0gdjE2LjAuIFNlZSBodHRwczovL2dpdC5pby9KMGduSyBmb3IgbW9yZSBpbmZvLicpO1xufVxuZnVuY3Rpb24gZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMob3B0Tm9kZU9yTm9kZUxpc3QpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2dyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzIHdhcyByZW1vdmVkIGluIE9obSB2MTYuMC4gU2VlIGh0dHBzOi8vZ2l0LmlvL0owZ25LIGZvciBtb3JlIGluZm8uJyk7XG59XG5mdW5jdGlvbiBtYWtlUmVjaXBlKHJlY2lwZSkge1xuICAgIGlmICh0eXBlb2YgcmVjaXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiByZWNpcGUuY2FsbChuZXcgQnVpbGRlcigpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVjaXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gc3RyaW5naWZpZWQgSlNPTiByZWNpcGVcbiAgICAgICAgICAgIHJlY2lwZSA9IEpTT04ucGFyc2UocmVjaXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJ1aWxkZXIoKS5mcm9tUmVjaXBlKHJlY2lwZSk7XG4gICAgfVxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVOYW1lc3BhY2U6IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UsXG4gICAgZ3JhbW1hcixcbiAgICBncmFtbWFycyxcbiAgICBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQsXG4gICAgZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMsXG4gICAgbWFrZVJlY2lwZSxcbiAgICBvaG1HcmFtbWFyOiBudWxsLFxuICAgIHBleHBycyxcbiAgICB1dGlsLFxuICAgIGV4dHJhczogcmVxdWlyZSgnLi4vZXh0cmFzJyksXG4gICAgdmVyc2lvblxufTtcbi8vIFN0dWZmIGZvciB0ZXN0aW5nLCBldGMuXG5tb2R1bGUuZXhwb3J0cy5fYnVpbGRHcmFtbWFyID0gYnVpbGRHcmFtbWFyO1xuLy8gTGF0ZSBpbml0aWFsaXphdGlvbiBmb3Igc3R1ZmYgdGhhdCBpcyBib290c3RyYXBwZWQuXG5HcmFtbWFyLkJ1aWx0SW5SdWxlcyA9IHJlcXVpcmUoJy4uL2Rpc3QvYnVpbHQtaW4tcnVsZXMnKTtcbnV0aWwuYW5ub3VuY2VCdWlsdEluUnVsZXMoR3JhbW1hci5CdWlsdEluUnVsZXMpO1xubW9kdWxlLmV4cG9ydHMub2htR3JhbW1hciA9IG9obUdyYW1tYXIgPSByZXF1aXJlKCcuLi9kaXN0L29obS1ncmFtbWFyJyk7XG5HcmFtbWFyLmluaXRBcHBsaWNhdGlvblBhcnNlcihvaG1HcmFtbWFyLCBidWlsZEdyYW1tYXIpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIEVuc3VyZXMgdGhhdCB0aGUgZGVwcmVjYXRpb24gd2FybmluZyBmb3IgYHByaW1pdGl2ZVZhbHVlYCBvbmx5IGFwcGVhcnMgb25jZS5cbmxldCBkaWRXYXJuRm9yUHJpbWl0aXZlVmFsdWUgPSBmYWxzZTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY2xhc3MgTm9kZSB7XG4gICAgY29uc3RydWN0b3IoZ3JhbW1hciwgY3Rvck5hbWUsIG1hdGNoTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgICAgIHRoaXMuY3Rvck5hbWUgPSBjdG9yTmFtZTtcbiAgICAgICAgdGhpcy5tYXRjaExlbmd0aCA9IG1hdGNoTGVuZ3RoO1xuICAgIH1cbiAgICBudW1DaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4gPyB0aGlzLmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgfVxuICAgIGNoaWxkQXQoaWR4KSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpZHhdO1xuICAgICAgICB9XG4gICAgfVxuICAgIGluZGV4T2ZDaGlsZChhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhcmcpO1xuICAgIH1cbiAgICBoYXNDaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtQ2hpbGRyZW4oKSA+IDA7XG4gICAgfVxuICAgIGhhc05vQ2hpbGRyZW4oKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5oYXNDaGlsZHJlbigpO1xuICAgIH1cbiAgICBvbmx5Q2hpbGQoKSB7XG4gICAgICAgIGlmICh0aGlzLm51bUNoaWxkcmVuKCkgIT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBvbmx5IGNoaWxkIG9mIGEgbm9kZSBvZiB0eXBlICcgK1xuICAgICAgICAgICAgICAgIHRoaXMuY3Rvck5hbWUgK1xuICAgICAgICAgICAgICAgICcgKGl0IGhhcyAnICtcbiAgICAgICAgICAgICAgICB0aGlzLm51bUNoaWxkcmVuKCkgK1xuICAgICAgICAgICAgICAgICcgY2hpbGRyZW4pJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5maXJzdENoaWxkKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlyc3RDaGlsZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgZmlyc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxhc3RDaGlsZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgbGFzdCBjaGlsZCBvZiBhICcgKyB0aGlzLmN0b3JOYW1lICsgJyBub2RlLCB3aGljaCBoYXMgbm8gY2hpbGRyZW4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkQXQodGhpcy5udW1DaGlsZHJlbigpIC0gMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2hpbGRCZWZvcmUoY2hpbGQpIHtcbiAgICAgICAgY29uc3QgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEJlZm9yZSgpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGRJZHggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBiZWZvcmUgZmlyc3QgY2hpbGQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggLSAxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjaGlsZEFmdGVyKGNoaWxkKSB7XG4gICAgICAgIGNvbnN0IGNoaWxkSWR4ID0gdGhpcy5pbmRleE9mQ2hpbGQoY2hpbGQpO1xuICAgICAgICBpZiAoY2hpbGRJZHggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRBZnRlcigpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGRJZHggPT09IHRoaXMubnVtQ2hpbGRyZW4oKSAtIDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBhZnRlciBsYXN0IGNoaWxkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4ICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaXNUZXJtaW5hbCgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpc05vbnRlcm1pbmFsKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlzSXRlcmF0aW9uKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlzT3B0aW9uYWwoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdG9KU09OKCkge1xuICAgICAgICByZXR1cm4geyBbdGhpcy5jdG9yTmFtZV06IHRoaXMuY2hpbGRyZW4gfTtcbiAgICB9XG59XG4vLyBUZXJtaW5hbHNcbmNsYXNzIFRlcm1pbmFsTm9kZSBleHRlbmRzIE5vZGUge1xuICAgIGNvbnN0cnVjdG9yKGdyYW1tYXIsIHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG1hdGNoTGVuZ3RoID0gdmFsdWUgPyB2YWx1ZS5sZW5ndGggOiAwO1xuICAgICAgICBzdXBlcihncmFtbWFyLCAnX3Rlcm1pbmFsJywgbWF0Y2hMZW5ndGgpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICBpc1Rlcm1pbmFsKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdG9KU09OKCkge1xuICAgICAgICByZXR1cm4geyBbdGhpcy5jdG9yTmFtZV06IHRoaXMuX3ZhbHVlIH07XG4gICAgfVxuICAgIGdldCBwcmltaXRpdmVWYWx1ZSgpIHtcbiAgICAgICAgaWYgKCFkaWRXYXJuRm9yUHJpbWl0aXZlVmFsdWUpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHByaW1pdGl2ZVZhbHVlIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIE9obS4gJyArXG4gICAgICAgICAgICAgICAgJ1VzZSBzb3VyY2VTdHJpbmcgaW5zdGVhZC4nKTtcbiAgICAgICAgICAgIGRpZFdhcm5Gb3JQcmltaXRpdmVWYWx1ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbn1cbi8vIE5vbnRlcm1pbmFsc1xuY2xhc3MgTm9udGVybWluYWxOb2RlIGV4dGVuZHMgTm9kZSB7XG4gICAgY29uc3RydWN0b3IoZ3JhbW1hciwgcnVsZU5hbWUsIGNoaWxkcmVuLCBjaGlsZE9mZnNldHMsIG1hdGNoTGVuZ3RoKSB7XG4gICAgICAgIHN1cGVyKGdyYW1tYXIsIHJ1bGVOYW1lLCBtYXRjaExlbmd0aCk7XG4gICAgICAgIHRoaXMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgICAgdGhpcy5jaGlsZE9mZnNldHMgPSBjaGlsZE9mZnNldHM7XG4gICAgfVxuICAgIGlzTm9udGVybWluYWwoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpc0xleGljYWwoKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uaXNMZXhpY2FsKHRoaXMuY3Rvck5hbWUpO1xuICAgIH1cbiAgICBpc1N5bnRhY3RpYygpIHtcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLmN0b3JOYW1lKTtcbiAgICB9XG59XG4vLyBJdGVyYXRpb25zXG5jbGFzcyBJdGVyYXRpb25Ob2RlIGV4dGVuZHMgTm9kZSB7XG4gICAgY29uc3RydWN0b3IoZ3JhbW1hciwgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgsIGlzT3B0aW9uYWwpIHtcbiAgICAgICAgc3VwZXIoZ3JhbW1hciwgJ19pdGVyJywgbWF0Y2hMZW5ndGgpO1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIHRoaXMuY2hpbGRPZmZzZXRzID0gY2hpbGRPZmZzZXRzO1xuICAgICAgICB0aGlzLm9wdGlvbmFsID0gaXNPcHRpb25hbDtcbiAgICB9XG4gICAgaXNJdGVyYXRpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpc09wdGlvbmFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbDtcbiAgICB9XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIE5vZGUsXG4gICAgVGVybWluYWxOb2RlLFxuICAgIE5vbnRlcm1pbmFsTm9kZSxcbiAgICBJdGVyYXRpb25Ob2RlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgUmV0dXJuIHRydWUgaWYgd2Ugc2hvdWxkIHNraXAgc3BhY2VzIHByZWNlZGluZyB0aGlzIGV4cHJlc3Npb24gaW4gYSBzeW50YWN0aWMgY29udGV4dC5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPSBjb21tb24uYWJzdHJhY3QoJ2FsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnKTtcbi8qXG4gIEdlbmVyYWxseSwgdGhlc2UgYXJlIGFsbCBmaXJzdC1vcmRlciBleHByZXNzaW9ucyBhbmQgKHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBBcHBseSlcbiAgZGlyZWN0bHkgcmVhZCBmcm9tIHRoZSBpbnB1dCBzdHJlYW0uXG4qL1xucGV4cHJzLmFueS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICBwZXhwcnMuZW5kLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICBwZXhwcnMuQXBwbHkucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbi8qXG4gIEhpZ2hlci1vcmRlciBleHByZXNzaW9ucyB0aGF0IGRvbid0IGRpcmVjdGx5IGNvbnN1bWUgaW5wdXQuXG4qL1xucGV4cHJzLkFsdC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgcGV4cHJzLkl0ZXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICAgICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlNlcS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbmNvbnN0IGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xubGV0IEJ1aWx0SW5SdWxlcztcbnV0aWwuYXdhaXRCdWlsdEluUnVsZXMoZyA9PiB7XG4gICAgQnVpbHRJblJ1bGVzID0gZztcbn0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5sZXQgbGV4aWZ5Q291bnQ7XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gICAgbGV4aWZ5Q291bnQgPSAwO1xuICAgIHRoaXMuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbn07XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGNvbW1vbi5hYnN0cmFjdCgnX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5wZXhwcnMuYW55Ll9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgcGV4cHJzLmVuZC5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuby1vcFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5MZXgucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGxleGlmeUNvdW50Kys7XG4gICAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgbGV4aWZ5Q291bnQtLTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdGhpcy50ZXJtc1tpZHhdLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgfVxufTtcbnBleHBycy5TZXEucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgfVxufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgIHBleHBycy5Ob3QucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cHIuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGNvbnN0IHJ1bGVJbmZvID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXTtcbiAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcnVsZSBleGlzdHMuLi5cbiAgICBpZiAoIXJ1bGVJbmZvKSB7XG4gICAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkUnVsZSh0aGlzLnJ1bGVOYW1lLCBncmFtbWFyLm5hbWUsIHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBpcyBhbGxvd2VkXG4gICAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSAmJlxuICAgICAgICAoIWNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkgfHwgbGV4aWZ5Q291bnQgPiAwKSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQodGhpcy5ydWxlTmFtZSwgdGhpcyk7XG4gICAgfVxuICAgIC8vIC4uLmFuZCB0aGF0IHRoaXMgYXBwbGljYXRpb24gaGFzIHRoZSBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHNcbiAgICBjb25zdCBhY3R1YWwgPSB0aGlzLmFyZ3MubGVuZ3RoO1xuICAgIGNvbnN0IGV4cGVjdGVkID0gcnVsZUluZm8uZm9ybWFscy5sZW5ndGg7XG4gICAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZBcmd1bWVudHModGhpcy5ydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgdGhpcy5zb3VyY2UpO1xuICAgIH1cbiAgICAvLyAuLi5hbmQgdGhhdCBhbGwgb2YgdGhlIGFyZ3VtZW50IGV4cHJlc3Npb25zIG9ubHkgaGF2ZSB2YWxpZCBhcHBsaWNhdGlvbnMgYW5kIGhhdmUgYXJpdHkgMS5cbiAgICB0aGlzLmFyZ3MuZm9yRWFjaChhcmcgPT4ge1xuICAgICAgICBhcmcuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICAgICAgaWYgKGFyZy5nZXRBcml0eSgpICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW52YWxpZFBhcmFtZXRlcih0aGlzLnJ1bGVOYW1lLCBhcmcpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gRXh0cmEgY2hlY2tzIGZvciBcInNwZWNpYWxcIiBhcHBsaWNhdGlvbnNcbiAgICAvLyBJZiBpdCdzIGFuIGFwcGxpY2F0aW9uIG9mICdjYXNlSW5zZW5zaXRpdmUnLCBlbnN1cmUgdGhhdCB0aGUgYXJndW1lbnQgaXMgYSBUZXJtaW5hbC5cbiAgICBpZiAoQnVpbHRJblJ1bGVzICYmIHJ1bGVJbmZvID09PSBCdWlsdEluUnVsZXMucnVsZXMuY2FzZUluc2Vuc2l0aXZlKSB7XG4gICAgICAgIGlmICghKHRoaXMuYXJnc1swXSBpbnN0YW5jZW9mIHBleHBycy5UZXJtaW5hbCkpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5pbmNvcnJlY3RBcmd1bWVudFR5cGUoJ2EgVGVybWluYWwgKGUuZy4gXCJhYmNcIiknLCB0aGlzLmFyZ3NbMF0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbmNvbnN0IGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gY29tbW9uLmFic3RyYWN0KCdhc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eScpO1xucGV4cHJzLmFueS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgcGV4cHJzLmVuZC5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5MZXgucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuby1vcFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIGlmICh0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBjb25zdCB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgICAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KCk7XG4gICAgICAgIGNvbnN0IG90aGVyQXJpdHkgPSB0ZXJtLmdldEFyaXR5KCk7XG4gICAgICAgIGlmIChhcml0eSAhPT0gb3RoZXJBcml0eSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBhcml0eSwgb3RoZXJBcml0eSwgdGVybSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBFeHRlbmQgaXMgYSBzcGVjaWFsIGNhc2Ugb2YgQWx0IHRoYXQncyBndWFyYW50ZWVkIHRvIGhhdmUgZXhhY3RseSB0d29cbiAgICAvLyBjYXNlczogW2V4dGVuc2lvbnMsIG9yaWdCb2R5XS5cbiAgICBjb25zdCBhY3R1YWxBcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgICBjb25zdCBleHBlY3RlZEFyaXR5ID0gdGhpcy50ZXJtc1sxXS5nZXRBcml0eSgpO1xuICAgIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkQXJpdHksIGFjdHVhbEFyaXR5LCB0aGlzLnRlcm1zWzBdKTtcbiAgICB9XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgfVxufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBuby1vcCAobm90IHJlcXVpcmVkIGIvYyB0aGUgbmVzdGVkIGV4cHIgZG9lc24ndCBzaG93IHVwIGluIHRoZSBDU1QpXG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBUaGUgYXJpdGllcyBvZiB0aGUgcGFyYW1ldGVyIGV4cHJlc3Npb25zIGlzIHJlcXVpcmVkIHRvIGJlIDEgYnlcbiAgICAvLyBgYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoKWAuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuY29uc3QgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbmNvbnN0IHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gY29tbW9uLmFic3RyYWN0KCdhc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnBleHBycy5hbnkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICBwZXhwcnMuZW5kLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8tb3BcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgIH1cbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGZvciAobGV0IGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICB9XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgLy8gTm90ZTogdGhpcyBpcyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgZm9yIGBTdGFyYCBhbmQgYFBsdXNgIGV4cHJlc3Npb25zLlxuICAgIC8vIEl0IGlzIG92ZXJyaWRkZW4gZm9yIGBPcHRgIGJlbG93LlxuICAgIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hcik7XG4gICAgaWYgKHRoaXMuZXhwci5pc051bGxhYmxlKGdyYW1tYXIpKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5rbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKHRoaXMsIFtdKTtcbiAgICB9XG59O1xucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHIuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdGhpcy5hcmdzLmZvckVhY2goYXJnID0+IHtcbiAgICAgICAgYXJnLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbmNvbnN0IGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG5jb25zdCBub2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMnKTtcbmNvbnN0IHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5jb25zdCBUZXJtaW5hbE5vZGUgPSBub2Rlcy5UZXJtaW5hbE5vZGU7XG5jb25zdCBOb250ZXJtaW5hbE5vZGUgPSBub2Rlcy5Ob250ZXJtaW5hbE5vZGU7XG5jb25zdCBJdGVyYXRpb25Ob2RlID0gbm9kZXMuSXRlcmF0aW9uTm9kZTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgRXZhbHVhdGUgdGhlIGV4cHJlc3Npb24gYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZHMsIGBmYWxzZWAgb3RoZXJ3aXNlLiBUaGlzIG1ldGhvZCBzaG91bGRcbiAgb25seSBiZSBjYWxsZWQgZGlyZWN0bHkgYnkgYFN0YXRlLnByb3RvdHlwZS5ldmFsKGV4cHIpYCwgd2hpY2ggYWxzbyB1cGRhdGVzIHRoZSBkYXRhIHN0cnVjdHVyZXNcbiAgdGhhdCBhcmUgdXNlZCBmb3IgdHJhY2luZy4gKE1ha2luZyB0aG9zZSB1cGRhdGVzIGluIGEgbWV0aG9kIG9mIGBTdGF0ZWAgZW5hYmxlcyB0aGUgdHJhY2Utc3BlY2lmaWNcbiAgZGF0YSBzdHJ1Y3R1cmVzIHRvIGJlIFwic2VjcmV0c1wiIG9mIHRoYXQgY2xhc3MsIHdoaWNoIGlzIGdvb2QgZm9yIG1vZHVsYXJpdHkuKVxuXG4gIFRoZSBjb250cmFjdCBvZiB0aGlzIG1ldGhvZCBpcyBhcyBmb2xsb3dzOlxuICAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBgdHJ1ZWAsXG4gICAgLSB0aGUgc3RhdGUgb2JqZWN0IHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGJpbmRpbmdzIHRoYW4gaXQgZGlkIGJlZm9yZSB0aGUgY2FsbC5cbiAgKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgYGZhbHNlYCxcbiAgICAtIHRoZSBzdGF0ZSBvYmplY3QgbWF5IGhhdmUgbW9yZSBiaW5kaW5ncyB0aGFuIGl0IGRpZCBiZWZvcmUgdGhlIGNhbGwsIGFuZFxuICAgIC0gaXRzIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heSBiZSBhbnl3aGVyZS5cblxuICBOb3RlIHRoYXQgYFN0YXRlLnByb3RvdHlwZS5ldmFsKGV4cHIpYCwgdW5saWtlIHRoaXMgbWV0aG9kLCBndWFyYW50ZWVzIHRoYXQgbmVpdGhlciB0aGUgc3RhdGVcbiAgb2JqZWN0J3MgYmluZGluZ3Mgbm9yIGl0cyBpbnB1dCBzdHJlYW0ncyBwb3NpdGlvbiB3aWxsIGNoYW5nZSBpZiB0aGUgZXhwcmVzc2lvbiBmYWlscyB0byBtYXRjaC5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmV2YWwgPSBjb21tb24uYWJzdHJhY3QoJ2V2YWwnKTsgLy8gZnVuY3Rpb24oc3RhdGUpIHsgLi4uIH1cbnBleHBycy5hbnkuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBjb25zdCBjaCA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgICBpZiAoY2gpIHtcbiAgICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBjaCksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5lbmQuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoaW5wdXRTdHJlYW0uYXRFbmQoKSkge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHVuZGVmaW5lZCksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoIWlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKSkge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLm9iaiksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgY29uc3QgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICBjb25zdCBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGNvbnN0IGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICAgIGlmIChjaCAmJiB0aGlzLmZyb20gPD0gY2ggJiYgY2ggPD0gdGhpcy50bykge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlLmV2YWwoc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLmluZGV4XSk7XG59O1xucGV4cHJzLkxleC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHN0YXRlLmVudGVyTGV4aWZpZWRDb250ZXh0KCk7XG4gICAgY29uc3QgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpO1xuICAgIHN0YXRlLmV4aXRMZXhpZmllZENvbnRleHQoKTtcbiAgICByZXR1cm4gYW5zO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgaWYgKHN0YXRlLmV2YWwodGhpcy50ZXJtc1tpZHhdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBjb25zdCBmYWN0b3IgPSB0aGlzLmZhY3RvcnNbaWR4XTtcbiAgICAgICAgaWYgKCFzdGF0ZS5ldmFsKGZhY3RvcikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBjb25zdCBhcml0eSA9IHRoaXMuZ2V0QXJpdHkoKTtcbiAgICBjb25zdCBjb2xzID0gW107XG4gICAgY29uc3QgY29sT2Zmc2V0cyA9IFtdO1xuICAgIHdoaWxlIChjb2xzLmxlbmd0aCA8IGFyaXR5KSB7XG4gICAgICAgIGNvbHMucHVzaChbXSk7XG4gICAgICAgIGNvbE9mZnNldHMucHVzaChbXSk7XG4gICAgfVxuICAgIGxldCBudW1NYXRjaGVzID0gMDtcbiAgICBsZXQgcHJldlBvcyA9IG9yaWdQb3M7XG4gICAgbGV0IGlkeDtcbiAgICB3aGlsZSAobnVtTWF0Y2hlcyA8IHRoaXMubWF4TnVtTWF0Y2hlcyAmJiBzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLnBvcyA9PT0gcHJldlBvcykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQodGhpcywgc3RhdGUuX2FwcGxpY2F0aW9uU3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgICAgIG51bU1hdGNoZXMrKztcbiAgICAgICAgY29uc3Qgcm93ID0gc3RhdGUuX2JpbmRpbmdzLnNwbGljZShzdGF0ZS5fYmluZGluZ3MubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICAgICAgY29uc3Qgcm93T2Zmc2V0cyA9IHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdPZmZzZXRzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcm93Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGNvbHNbaWR4XS5wdXNoKHJvd1tpZHhdKTtcbiAgICAgICAgICAgIGNvbE9mZnNldHNbaWR4XS5wdXNoKHJvd09mZnNldHNbaWR4XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG51bU1hdGNoZXMgPCB0aGlzLm1pbk51bU1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBsZXQgb2Zmc2V0ID0gc3RhdGUucG9zVG9PZmZzZXQob3JpZ1Bvcyk7XG4gICAgbGV0IG1hdGNoTGVuZ3RoID0gMDtcbiAgICBpZiAobnVtTWF0Y2hlcyA+IDApIHtcbiAgICAgICAgY29uc3QgbGFzdENvbCA9IGNvbHNbYXJpdHkgLSAxXTtcbiAgICAgICAgY29uc3QgbGFzdENvbE9mZnNldHMgPSBjb2xPZmZzZXRzW2FyaXR5IC0gMV07XG4gICAgICAgIGNvbnN0IGVuZE9mZnNldCA9IGxhc3RDb2xPZmZzZXRzW2xhc3RDb2xPZmZzZXRzLmxlbmd0aCAtIDFdICsgbGFzdENvbFtsYXN0Q29sLmxlbmd0aCAtIDFdLm1hdGNoTGVuZ3RoO1xuICAgICAgICBvZmZzZXQgPSBjb2xPZmZzZXRzWzBdWzBdO1xuICAgICAgICBtYXRjaExlbmd0aCA9IGVuZE9mZnNldCAtIG9mZnNldDtcbiAgICB9XG4gICAgY29uc3QgaXNPcHRpb25hbCA9IHRoaXMgaW5zdGFuY2VvZiBwZXhwcnMuT3B0O1xuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgY29scy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHN0YXRlLl9iaW5kaW5ncy5wdXNoKG5ldyBJdGVyYXRpb25Ob2RlKHN0YXRlLmdyYW1tYXIsIGNvbHNbaWR4XSwgY29sT2Zmc2V0c1tpZHhdLCBtYXRjaExlbmd0aCwgaXNPcHRpb25hbCkpO1xuICAgICAgICBzdGF0ZS5fYmluZGluZ09mZnNldHMucHVzaChvZmZzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgLypcbiAgICAgIFRPRE86XG4gICAgICAtIFJpZ2h0IG5vdyB3ZSdyZSBqdXN0IHRocm93aW5nIGF3YXkgYWxsIG9mIHRoZSBmYWlsdXJlcyB0aGF0IGhhcHBlbiBpbnNpZGUgYSBgbm90YCwgYW5kXG4gICAgICAgIHJlY29yZGluZyBgdGhpc2AgYXMgYSBmYWlsZWQgZXhwcmVzc2lvbi5cbiAgICAgIC0gRG91YmxlIG5lZ2F0aW9uIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvIGxvb2thaGVhZCwgYnV0IHRoYXQncyBub3QgdGhlIGNhc2UgcmlnaHQgbm93IHdydFxuICAgICAgICBmYWlsdXJlcy4gRS5nLiwgfn4nZm9vJyBwcm9kdWNlcyBhIGZhaWx1cmUgZm9yIH5+J2ZvbycsIGJ1dCBtYXliZSBpdCBzaG91bGQgcHJvZHVjZVxuICAgICAgICBhIGZhaWx1cmUgZm9yICdmb28nIGluc3RlYWQuXG4gICAgKi9cbiAgICBjb25zdCBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIGNvbnN0IG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgc3RhdGUucHVzaEZhaWx1cmVzSW5mbygpO1xuICAgIGNvbnN0IGFucyA9IHN0YXRlLmV2YWwodGhpcy5leHByKTtcbiAgICBzdGF0ZS5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICBpZiAoYW5zKSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBjb25zdCBjYWxsZXIgPSBzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICBjb25zdCBhY3R1YWxzID0gY2FsbGVyID8gY2FsbGVyLmFyZ3MgOiBbXTtcbiAgICBjb25zdCBhcHAgPSB0aGlzLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG4gICAgY29uc3QgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgaWYgKHBvc0luZm8uaXNBY3RpdmUoYXBwKSkge1xuICAgICAgICAvLyBUaGlzIHJ1bGUgaXMgYWxyZWFkeSBhY3RpdmUgYXQgdGhpcyBwb3NpdGlvbiwgaS5lLiwgaXQgaXMgbGVmdC1yZWN1cnNpdmUuXG4gICAgICAgIHJldHVybiBhcHAuaGFuZGxlQ3ljbGUoc3RhdGUpO1xuICAgIH1cbiAgICBjb25zdCBtZW1vS2V5ID0gYXBwLnRvTWVtb0tleSgpO1xuICAgIGNvbnN0IG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gICAgaWYgKG1lbW9SZWMgJiYgcG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgICAgICBpZiAoc3RhdGUuaGFzTmVjZXNzYXJ5SW5mbyhtZW1vUmVjKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLmlucHV0U3RyZWFtLnBvcywgbWVtb1JlYyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcC5yZWFsbHlFdmFsKHN0YXRlKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUN5Y2xlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgY29uc3QgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgY29uc3QgY3VycmVudExlZnRSZWN1cnNpb24gPSBwb3NJbmZvLmN1cnJlbnRMZWZ0UmVjdXJzaW9uO1xuICAgIGNvbnN0IG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICAgIGxldCBtZW1vUmVjID0gcG9zSW5mby5tZW1vW21lbW9LZXldO1xuICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbiAmJiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXkpIHtcbiAgICAgICAgLy8gV2UgYWxyZWFkeSBrbm93IGFib3V0IHRoaXMgbGVmdCByZWN1cnNpb24sIGJ1dCBpdCdzIHBvc3NpYmxlIHRoZXJlIGFyZSBcImludm9sdmVkXG4gICAgICAgIC8vIGFwcGxpY2F0aW9uc1wiIHRoYXQgd2UgZG9uJ3QgYWxyZWFkeSBrbm93IGFib3V0LCBzby4uLlxuICAgICAgICBtZW1vUmVjLnVwZGF0ZUludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cygpO1xuICAgIH1cbiAgICBlbHNlIGlmICghbWVtb1JlYykge1xuICAgICAgICAvLyBOZXcgbGVmdCByZWN1cnNpb24gZGV0ZWN0ZWQhIE1lbW9pemUgYSBmYWlsdXJlIHRvIHRyeSB0byBnZXQgYSBzZWVkIHBhcnNlLlxuICAgICAgICBtZW1vUmVjID0gcG9zSW5mby5tZW1vaXplKG1lbW9LZXksIHtcbiAgICAgICAgICAgIG1hdGNoTGVuZ3RoOiAwLFxuICAgICAgICAgICAgZXhhbWluZWRMZW5ndGg6IDAsXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICByaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiAtMVxuICAgICAgICB9KTtcbiAgICAgICAgcG9zSW5mby5zdGFydExlZnRSZWN1cnNpb24odGhpcywgbWVtb1JlYyk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZS51c2VNZW1vaXplZFJlc3VsdChzdGF0ZS5pbnB1dFN0cmVhbS5wb3MsIG1lbW9SZWMpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUucmVhbGx5RXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBjb25zdCBvcmlnUG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgY29uc3QgcnVsZUluZm8gPSBzdGF0ZS5ncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdO1xuICAgIGNvbnN0IGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gcnVsZUluZm8uZGVzY3JpcHRpb247XG4gICAgc3RhdGUuZW50ZXJBcHBsaWNhdGlvbihvcmlnUG9zSW5mbywgdGhpcyk7XG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN0YXRlLnB1c2hGYWlsdXJlc0luZm8oKTtcbiAgICB9XG4gICAgLy8gUmVzZXQgdGhlIGlucHV0IHN0cmVhbSdzIGV4YW1pbmVkTGVuZ3RoIHByb3BlcnR5IHNvIHRoYXQgd2UgY2FuIHRyYWNrXG4gICAgLy8gdGhlIGV4YW1pbmVkIGxlbmd0aCBvZiB0aGlzIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gICAgY29uc3Qgb3JpZ0lucHV0U3RyZWFtRXhhbWluZWRMZW5ndGggPSBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aDtcbiAgICBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9IDA7XG4gICAgbGV0IHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gICAgY29uc3QgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uY3VycmVudExlZnRSZWN1cnNpb247XG4gICAgY29uc3QgbWVtb0tleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgY29uc3QgaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gY3VycmVudExSICYmIGN1cnJlbnRMUi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXk7XG4gICAgbGV0IG1lbW9SZWM7XG4gICAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ3Jvd1NlZWRSZXN1bHQoYm9keSwgc3RhdGUsIG9yaWdQb3MsIGN1cnJlbnRMUiwgdmFsdWUpO1xuICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgICAgIG1lbW9SZWMgPSBjdXJyZW50TFI7XG4gICAgICAgIG1lbW9SZWMuZXhhbWluZWRMZW5ndGggPSBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCAtIG9yaWdQb3M7XG4gICAgICAgIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IHN0YXRlLl9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0KCk7XG4gICAgICAgIG9yaWdQb3NJbmZvLm1lbW9pemUobWVtb0tleSwgbWVtb1JlYyk7IC8vIHVwZGF0ZXMgb3JpZ1Bvc0luZm8ncyBtYXhFeGFtaW5lZExlbmd0aFxuICAgIH1cbiAgICBlbHNlIGlmICghY3VycmVudExSIHx8ICFjdXJyZW50TFIuaXNJbnZvbHZlZChtZW1vS2V5KSkge1xuICAgICAgICAvLyBUaGlzIGFwcGxpY2F0aW9uIGlzIG5vdCBpbnZvbHZlZCBpbiBsZWZ0IHJlY3Vyc2lvbiwgc28gaXQncyBvayB0byBtZW1vaXplIGl0LlxuICAgICAgICBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb2l6ZShtZW1vS2V5LCB7XG4gICAgICAgICAgICBtYXRjaExlbmd0aDogaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcyxcbiAgICAgICAgICAgIGV4YW1pbmVkTGVuZ3RoOiBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCAtIG9yaWdQb3MsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIGZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbjogc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCksXG4gICAgICAgICAgICByaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiBzdGF0ZS5fZ2V0UmlnaHRtb3N0RmFpbHVyZU9mZnNldCgpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjb25zdCBzdWNjZWVkZWQgPSAhIXZhbHVlO1xuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICBzdGF0ZS5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICAgICAgaWYgKCFzdWNjZWVkZWQpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZW1vUmVjKSB7XG4gICAgICAgICAgICBtZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbiA9IHN0YXRlLmNsb25lUmVjb3JkZWRGYWlsdXJlcygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFJlY29yZCB0cmFjZSBpbmZvcm1hdGlvbiBpbiB0aGUgbWVtbyB0YWJsZSwgc28gdGhhdCBpdCBpcyBhdmFpbGFibGUgaWYgdGhlIG1lbW9pemVkIHJlc3VsdFxuICAgIC8vIGlzIHVzZWQgbGF0ZXIuXG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpICYmIG1lbW9SZWMpIHtcbiAgICAgICAgY29uc3QgZW50cnkgPSBzdGF0ZS5nZXRUcmFjZUVudHJ5KG9yaWdQb3MsIHRoaXMsIHN1Y2NlZWRlZCwgc3VjY2VlZGVkID8gW3ZhbHVlXSA6IFtdKTtcbiAgICAgICAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgY29tbW9uLmFzc2VydChlbnRyeS50ZXJtaW5hdGluZ0xSRW50cnkgIT0gbnVsbCB8fCAhc3VjY2VlZGVkKTtcbiAgICAgICAgICAgIGVudHJ5LmlzSGVhZE9mTGVmdFJlY3Vyc2lvbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbWVtb1JlYy50cmFjZUVudHJ5ID0gZW50cnk7XG4gICAgfVxuICAgIC8vIEZpeCB0aGUgaW5wdXQgc3RyZWFtJ3MgZXhhbWluZWRMZW5ndGggLS0gaXQgc2hvdWxkIGJlIHRoZSBtYXhpbXVtIGV4YW1pbmVkIGxlbmd0aFxuICAgIC8vIGFjcm9zcyBhbGwgYXBwbGljYXRpb25zLCBub3QganVzdCB0aGlzIG9uZS5cbiAgICBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoLCBvcmlnSW5wdXRTdHJlYW1FeGFtaW5lZExlbmd0aCk7XG4gICAgc3RhdGUuZXhpdEFwcGxpY2F0aW9uKG9yaWdQb3NJbmZvLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHN1Y2NlZWRlZDtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWxPbmNlID0gZnVuY3Rpb24gKGV4cHIsIHN0YXRlKSB7XG4gICAgY29uc3QgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICBjb25zdCBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmIChzdGF0ZS5ldmFsKGV4cHIpKSB7XG4gICAgICAgIGNvbnN0IGFyaXR5ID0gZXhwci5nZXRBcml0eSgpO1xuICAgICAgICBjb25zdCBiaW5kaW5ncyA9IHN0YXRlLl9iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIGNvbnN0IG9mZnNldHMgPSBzdGF0ZS5fYmluZGluZ09mZnNldHMuc3BsaWNlKHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgICAgICByZXR1cm4gbmV3IE5vbnRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLnJ1bGVOYW1lLCBiaW5kaW5ncywgb2Zmc2V0cywgaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1Bvcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ3Jvd1NlZWRSZXN1bHQgPSBmdW5jdGlvbiAoYm9keSwgc3RhdGUsIG9yaWdQb3MsIGxyTWVtb1JlYywgbmV3VmFsdWUpIHtcbiAgICBpZiAoIW5ld1ZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsck1lbW9SZWMubWF0Y2hMZW5ndGggPSBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zO1xuICAgICAgICBsck1lbW9SZWMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgbHJNZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbiA9IHN0YXRlLmNsb25lUmVjb3JkZWRGYWlsdXJlcygpO1xuICAgICAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgICAgICAgIC8vIEJlZm9yZSBldmFsdWF0aW5nIHRoZSBib2R5IGFnYWluLCBhZGQgYSB0cmFjZSBub2RlIGZvciB0aGlzIGFwcGxpY2F0aW9uIHRvIHRoZSBtZW1vIGVudHJ5LlxuICAgICAgICAgICAgLy8gSXRzIG9ubHkgY2hpbGQgaXMgYSBjb3B5IG9mIHRoZSB0cmFjZSBub2RlIGZyb20gYG5ld1ZhbHVlYCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgdGhlIGxhc3RcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgaW4gYHN0YXRlLnRyYWNlYC5cbiAgICAgICAgICAgIGNvbnN0IHNlZWRUcmFjZSA9IHN0YXRlLnRyYWNlW3N0YXRlLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgbHJNZW1vUmVjLnRyYWNlRW50cnkgPSBuZXcgVHJhY2Uoc3RhdGUuaW5wdXQsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdGhpcywgdHJ1ZSwgW25ld1ZhbHVlXSwgW3NlZWRUcmFjZS5jbG9uZSgpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHN0YXRlKTtcbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLnBvcyAtIG9yaWdQb3MgPD0gbHJNZW1vUmVjLm1hdGNoTGVuZ3RoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgICAgICAgIHN0YXRlLnRyYWNlLnNwbGljZSgtMiwgMSk7IC8vIERyb3AgdGhlIHRyYWNlIGZvciB0aGUgb2xkIHNlZWQuXG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICAgIC8vIFRoZSBsYXN0IGVudHJ5IGlzIGZvciBhbiB1bnVzZWQgcmVzdWx0IC0tIHBvcCBpdCBhbmQgc2F2ZSBpdCBpbiB0aGUgXCJyZWFsXCIgZW50cnkuXG4gICAgICAgIGxyTWVtb1JlYy50cmFjZUVudHJ5LnJlY29yZExSVGVybWluYXRpb24oc3RhdGUudHJhY2UucG9wKCksIG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcyArIGxyTWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgICByZXR1cm4gbHJNZW1vUmVjLnZhbHVlO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIGNvbnN0IGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgY29uc3Qgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBjb25zdCBjaCA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgICBpZiAoY2ggJiYgdGhpcy5wYXR0ZXJuLnRlc3QoY2gpKSB7XG4gICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmdldEFyaXR5ID0gY29tbW9uLmFic3RyYWN0KCdnZXRBcml0eScpO1xucGV4cHJzLmFueS5nZXRBcml0eSA9XG4gICAgcGV4cHJzLmVuZC5nZXRBcml0eSA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5BcHBseS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBhcml0eSAtLSB0aGlzIHByb3BlcnR5IGlzXG4gICAgLy8gY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyAwIDogdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIGxldCBhcml0eSA9IDA7XG4gICAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgYXJpdHkgKz0gdGhpcy5mYWN0b3JzW2lkeF0uZ2V0QXJpdHkoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyaXR5O1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDA7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBwZXhwcnMuTGV4LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgQ2FsbGVkIGF0IGdyYW1tYXIgY3JlYXRpb24gdGltZSB0byByZXdyaXRlIGEgcnVsZSBib2R5LCByZXBsYWNpbmcgZWFjaCByZWZlcmVuY2UgdG8gYSBmb3JtYWxcbiAgcGFyYW1ldGVyIHdpdGggYSBgUGFyYW1gIG5vZGUuIFJldHVybnMgYSBQRXhwciAtLSBlaXRoZXIgYSBuZXcgb25lLCBvciB0aGUgb3JpZ2luYWwgb25lIGlmXG4gIGl0IHdhcyBtb2RpZmllZCBpbiBwbGFjZS5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnaW50cm9kdWNlUGFyYW1zJyk7XG5wZXhwcnMuYW55LmludHJvZHVjZVBhcmFtcyA9XG4gICAgcGV4cHJzLmVuZC5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BbHQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgdGhpcy50ZXJtcy5mb3JFYWNoKCh0ZXJtLCBpZHgsIHRlcm1zKSA9PiB7XG4gICAgICAgIHRlcm1zW2lkeF0gPSB0ZXJtLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgIHRoaXMuZmFjdG9ycy5mb3JFYWNoKChmYWN0b3IsIGlkeCwgZmFjdG9ycykgPT4ge1xuICAgICAgICBmYWN0b3JzW2lkeF0gPSBmYWN0b3IuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgIHBleHBycy5Ob3QucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwciA9IHRoaXMuZXhwci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgY29uc3QgaW5kZXggPSBmb3JtYWxzLmluZGV4T2YodGhpcy5ydWxlTmFtZSk7XG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBTaG91bGQgdGhpcyBiZSBzdXBwb3J0ZWQ/IFNlZSBpc3N1ZSAjNjQuXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlcml6ZWQgcnVsZXMgY2Fubm90IGJlIHBhc3NlZCBhcyBhcmd1bWVudHMgdG8gYW5vdGhlciBydWxlLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlBhcmFtKGluZGV4KS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMuYXJncy5mb3JFYWNoKChhcmcsIGlkeCwgYXJncykgPT4ge1xuICAgICAgICAgICAgYXJnc1tpZHhdID0gYXJnLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHBhcnNpbmcgZXhwcmVzc2lvbiBtYXkgYWNjZXB0IHdpdGhvdXQgY29uc3VtaW5nIGFueSBpbnB1dC5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuaXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzTnVsbGFibGUoZ3JhbW1hciwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG59O1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdCgnX2lzTnVsbGFibGUnKTtcbnBleHBycy5hbnkuX2lzTnVsbGFibGUgPVxuICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5QbHVzLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuZW5kLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG92ZXItc2ltcGxpZmljYXRpb246IGl0J3Mgb25seSBjb3JyZWN0IGlmIHRoZSBpbnB1dCBpcyBhIHN0cmluZy4gSWYgaXQncyBhbiBhcnJheVxuICAgICAgICAvLyBvciBhbiBvYmplY3QsIHRoZW4gdGhlIGVtcHR5IHN0cmluZyBwYXJzaW5nIGV4cHJlc3Npb24gaXMgbm90IG51bGxhYmxlLlxuICAgICAgICByZXR1cm4gdGhpcy5vYmogPT09ICcnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwIHx8IHRoaXMudGVybXMuc29tZSh0ZXJtID0+IHRlcm0uX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbykpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy5mYWN0b3JzLmV2ZXJ5KGZhY3RvciA9PiBmYWN0b3IuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbykpO1xufTtcbnBleHBycy5TdGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgcGV4cHJzLk9wdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfTtcbnBleHBycy5MZXgucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy5leHByLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIGNvbnN0IGtleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtbywga2V5KSkge1xuICAgICAgICBjb25zdCBib2R5ID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXS5ib2R5O1xuICAgICAgICBjb25zdCBpbmxpbmVkID0gYm9keS5zdWJzdGl0dXRlUGFyYW1zKHRoaXMuYXJncyk7XG4gICAgICAgIG1lbW9ba2V5XSA9IGZhbHNlOyAvLyBQcmV2ZW50IGluZmluaXRlIHJlY3Vyc2lvbiBmb3IgcmVjdXJzaXZlIHJ1bGVzLlxuICAgICAgICBtZW1vW2tleV0gPSBpbmxpbmVkLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xuICAgIH1cbiAgICByZXR1cm4gbWVtb1trZXldO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbmNvbnN0IHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldE1ldGFJbmZvKGV4cHIsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIGNvbnN0IG1ldGFJbmZvID0ge307XG4gICAgaWYgKGV4cHIuc291cmNlICYmIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgICAgICBjb25zdCBhZGp1c3RlZCA9IGV4cHIuc291cmNlLnJlbGF0aXZlVG8oZ3JhbW1hckludGVydmFsKTtcbiAgICAgICAgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwgPSBbYWRqdXN0ZWQuc3RhcnRJZHgsIGFkanVzdGVkLmVuZElkeF07XG4gICAgfVxuICAgIHJldHVybiBtZXRhSW5mbztcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3QoJ291dHB1dFJlY2lwZScpO1xucGV4cHJzLmFueS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnYW55JywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnZW5kJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsndGVybWluYWwnLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLm9ial07XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsncmFuZ2UnLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLmZyb20sIHRoaXMudG9dO1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ3BhcmFtJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSwgdGhpcy5pbmRleF07XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ2FsdCcsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCldLmNvbmNhdCh0aGlzLnRlcm1zLm1hcCh0ZXJtID0+IHRlcm0ub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkpKTtcbn07XG5wZXhwcnMuRXh0ZW5kLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgY29uc3QgZXh0ZW5zaW9uID0gdGhpcy50ZXJtc1swXTsgLy8gW2V4dGVuc2lvbiwgb3JpZ2luYWxdXG4gICAgcmV0dXJuIGV4dGVuc2lvbi5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbn07XG5wZXhwcnMuU3BsaWNlLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgY29uc3QgYmVmb3JlVGVybXMgPSB0aGlzLnRlcm1zLnNsaWNlKDAsIHRoaXMuZXhwYW5zaW9uUG9zKTtcbiAgICBjb25zdCBhZnRlclRlcm1zID0gdGhpcy50ZXJtcy5zbGljZSh0aGlzLmV4cGFuc2lvblBvcyArIDEpO1xuICAgIHJldHVybiBbXG4gICAgICAgICdzcGxpY2UnLFxuICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgICAgICBiZWZvcmVUZXJtcy5tYXAodGVybSA9PiB0ZXJtLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpKSxcbiAgICAgICAgYWZ0ZXJUZXJtcy5tYXAodGVybSA9PiB0ZXJtLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpKVxuICAgIF07XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ3NlcScsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCldLmNvbmNhdCh0aGlzLmZhY3RvcnMubWFwKGZhY3RvciA9PiBmYWN0b3Iub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkpKTtcbn07XG5wZXhwcnMuU3Rhci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICBwZXhwcnMuUGx1cy5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgcGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnYXBwJyxcbiAgICAgICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICAgICAgdGhpcy5ydWxlTmFtZSxcbiAgICAgICAgdGhpcy5hcmdzLm1hcChhcmcgPT4gYXJnLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpKVxuICAgIF07XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsndW5pY29kZUNoYXInLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLmNhdGVnb3J5XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBSZXR1cm5zIGEgUEV4cHIgdGhhdCByZXN1bHRzIGZyb20gcmVjdXJzaXZlbHkgcmVwbGFjaW5nIGV2ZXJ5IGZvcm1hbCBwYXJhbWV0ZXIgKGkuZS4sIGluc3RhbmNlXG4gIG9mIGBQYXJhbWApIGluc2lkZSB0aGlzIFBFeHByIHdpdGggaXRzIGFjdHVhbCB2YWx1ZSBmcm9tIGBhY3R1YWxzYCAoYW4gQXJyYXkpLlxuXG4gIFRoZSByZWNlaXZlciBtdXN0IG5vdCBiZSBtb2RpZmllZDsgYSBuZXcgUEV4cHIgbXVzdCBiZSByZXR1cm5lZCBpZiBhbnkgcmVwbGFjZW1lbnQgaXMgbmVjZXNzYXJ5LlxuKi9cbi8vIGZ1bmN0aW9uKGFjdHVhbHMpIHsgLi4uIH1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnc3Vic3RpdHV0ZVBhcmFtcycpO1xucGV4cHJzLmFueS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICBwZXhwcnMuZW5kLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFsdCh0aGlzLnRlcm1zLm1hcCh0ZXJtID0+IHRlcm0uc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSkpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlNlcSh0aGlzLmZhY3RvcnMubWFwKGZhY3RvciA9PiBmYWN0b3Iuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSkpO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5leHByLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscykpO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEF2b2lkIG1ha2luZyBhIGNvcHkgb2YgdGhpcyBhcHBsaWNhdGlvbiwgYXMgYW4gb3B0aW1pemF0aW9uXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuYXJncy5tYXAoYXJnID0+IGFyZy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkodGhpcy5ydWxlTmFtZSwgYXJncyk7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbmNvbnN0IHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5jb25zdCB7IGNvcHlXaXRob3V0RHVwbGljYXRlcyB9ID0gY29tbW9uO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRKU0lkZW50aWZpZXIoc3RyKSB7XG4gICAgcmV0dXJuIC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8udGVzdChzdHIpO1xufVxuZnVuY3Rpb24gcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KSB7XG4gICAgLy8gYGNvdW50YCBpcyB1c2VkIHRvIHJlY29yZCB0aGUgbnVtYmVyIG9mIHRpbWVzIGVhY2ggYXJndW1lbnQgbmFtZSBvY2N1cnMgaW4gdGhlIGxpc3QsXG4gICAgLy8gdGhpcyBpcyB1c2VmdWwgZm9yIGNoZWNraW5nIGR1cGxpY2F0ZWQgYXJndW1lbnQgbmFtZS4gSXQgbWFwcyBhcmd1bWVudCBuYW1lcyB0byBpbnRzLlxuICAgIGNvbnN0IGNvdW50ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBhcmd1bWVudE5hbWVMaXN0LmZvckVhY2goYXJnTmFtZSA9PiB7XG4gICAgICAgIGNvdW50W2FyZ05hbWVdID0gKGNvdW50W2FyZ05hbWVdIHx8IDApICsgMTtcbiAgICB9KTtcbiAgICAvLyBBcHBlbmQgc3Vic2NyaXB0cyAoJ18xJywgJ18yJywgLi4uKSB0byBkdXBsaWNhdGUgYXJndW1lbnQgbmFtZXMuXG4gICAgT2JqZWN0LmtleXMoY291bnQpLmZvckVhY2goZHVwQXJnTmFtZSA9PiB7XG4gICAgICAgIGlmIChjb3VudFtkdXBBcmdOYW1lXSA8PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBuYW1lIHNob3dzIHVwIG1vcmUgdGhhbiBvbmNlLCBzbyBhZGQgc3Vic2NyaXB0cy5cbiAgICAgICAgbGV0IHN1YnNjcmlwdCA9IDE7XG4gICAgICAgIGFyZ3VtZW50TmFtZUxpc3QuZm9yRWFjaCgoYXJnTmFtZSwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZiAoYXJnTmFtZSA9PT0gZHVwQXJnTmFtZSkge1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50TmFtZUxpc3RbaWR4XSA9IGFyZ05hbWUgKyAnXycgKyBzdWJzY3JpcHQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIFJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgYXJndW1lbnQgbmFtZXMgZm9yIGl0cyByZWNlaXZlclxuICAoYSBwZXhwcikgaW4gYSBzZW1hbnRpYyBhY3Rpb24uIFRoaXMgaXMgdXNlZCBleGNsdXNpdmVseSBieSB0aGUgU2VtYW50aWNzIEVkaXRvci5cblxuICBgZmlyc3RBcmdJbmRleGAgaXMgdGhlIDEtYmFzZWQgaW5kZXggb2YgdGhlIGZpcnN0IGFyZ3VtZW50IG5hbWUgdGhhdCB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgdGhpc1xuICBwZXhwci4gSXQgZW5hYmxlcyB1cyB0byBuYW1lIGFyZ3VtZW50cyBwb3NpdGlvbmFsbHksIGUuZy4sIGlmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgYVxuICBub24tYWxwaGFudW1lcmljIHRlcm1pbmFsIGxpa2UgXCIrXCIsIGl0IHdpbGwgYmUgbmFtZWQgJyQyJy5cblxuICBgbm9EdXBDaGVja2AgaXMgdHJ1ZSBpZiB0aGUgY2FsbGVyIG9mIGB0b0FyZ3VtZW50TmFtZUxpc3RgIGlzIG5vdCBhIHRvcCBsZXZlbCBjYWxsZXIuIEl0IGVuYWJsZXNcbiAgdXMgdG8gYXZvaWQgbmVzdGVkIGR1cGxpY2F0aW9uIHN1YnNjcmlwdHMgYXBwZW5kaW5nLCBlLmcuLCAnXzFfMScsICdfMV8yJywgYnkgb25seSBjaGVja2luZ1xuICBkdXBsaWNhdGVzIGF0IHRoZSB0b3AgbGV2ZWwuXG5cbiAgSGVyZSBpcyBhIG1vcmUgZWxhYm9yYXRlIGV4YW1wbGUgdGhhdCBpbGx1c3RyYXRlcyBob3cgdGhpcyBtZXRob2Qgd29ya3M6XG4gIGAoYSBcIitcIiBiKS50b0FyZ3VtZW50TmFtZUxpc3QoMSlgIGV2YWx1YXRlcyB0byBgWydhJywgJyQyJywgJ2InXWAgd2l0aCB0aGUgZm9sbG93aW5nIHJlY3Vyc2l2ZVxuICBjYWxsczpcblxuICAgIChhKS50b0FyZ3VtZW50TmFtZUxpc3QoMSkgLT4gWydhJ10sXG4gICAgKFwiK1wiKS50b0FyZ3VtZW50TmFtZUxpc3QoMikgLT4gWyckMiddLFxuICAgIChiKS50b0FyZ3VtZW50TmFtZUxpc3QoMykgLT4gWydiJ11cblxuICBOb3RlczpcbiAgKiBUaGlzIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIG9uIHdlbGwtZm9ybWVkIGV4cHJlc3Npb25zLCBlLmcuLCB0aGUgcmVjZWl2ZXIgbXVzdFxuICAgIG5vdCBoYXZlIGFueSBBbHQgc3ViLWV4cHJlc3Npb25zIHdpdGggaW5jb25zaXN0ZW50IGFyaXRpZXMuXG4gICogZS5nZXRBcml0eSgpID09PSBlLnRvQXJndW1lbnROYW1lTGlzdCgxKS5sZW5ndGhcbiovXG4vLyBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7IC4uLiB9XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGNvbW1vbi5hYnN0cmFjdCgndG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5wZXhwcnMuYW55LnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFsnYW55J107XG59O1xucGV4cHJzLmVuZC50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiBbJ2VuZCddO1xufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJyAmJiAvXltfYS16QS1aMC05XSskLy50ZXN0KHRoaXMub2JqKSkge1xuICAgICAgICAvLyBJZiB0aGlzIHRlcm1pbmFsIGlzIGEgdmFsaWQgc3VmZml4IGZvciBhIEpTIGlkZW50aWZpZXIsIGp1c3QgcHJlcGVuZCBpdCB3aXRoICdfJ1xuICAgICAgICByZXR1cm4gWydfJyArIHRoaXMub2JqXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgbmFtZSBpdCBwb3NpdGlvbmFsbHkuXG4gICAgICAgIHJldHVybiBbJyQnICsgZmlyc3RBcmdJbmRleF07XG4gICAgfVxufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICBsZXQgYXJnTmFtZSA9IHRoaXMuZnJvbSArICdfdG9fJyArIHRoaXMudG87XG4gICAgLy8gSWYgdGhlIGBhcmdOYW1lYCBpcyBub3QgdmFsaWQgdGhlbiB0cnkgdG8gcHJlcGVuZCBhIGBfYC5cbiAgICBpZiAoIWlzUmVzdHJpY3RlZEpTSWRlbnRpZmllcihhcmdOYW1lKSkge1xuICAgICAgICBhcmdOYW1lID0gJ18nICsgYXJnTmFtZTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGBhcmdOYW1lYCBzdGlsbCBub3QgdmFsaWQgYWZ0ZXIgcHJlcGVuZGluZyBhIGBfYCwgdGhlbiBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICBpZiAoIWlzUmVzdHJpY3RlZEpTSWRlbnRpZmllcihhcmdOYW1lKSkge1xuICAgICAgICBhcmdOYW1lID0gJyQnICsgZmlyc3RBcmdJbmRleDtcbiAgICB9XG4gICAgcmV0dXJuIFthcmdOYW1lXTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIC8vIGB0ZXJtQXJnTmFtZUxpc3RzYCBpcyBhbiBhcnJheSBvZiBhcnJheXMgd2hlcmUgZWFjaCByb3cgaXMgdGhlXG4gICAgLy8gYXJndW1lbnQgbmFtZSBsaXN0IHRoYXQgY29ycmVzcG9uZHMgdG8gYSB0ZXJtIGluIHRoaXMgYWx0ZXJuYXRpb24uXG4gICAgY29uc3QgdGVybUFyZ05hbWVMaXN0cyA9IHRoaXMudGVybXMubWFwKHRlcm0gPT4gdGVybS50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgdHJ1ZSkpO1xuICAgIGNvbnN0IGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgICBjb25zdCBudW1BcmdzID0gdGVybUFyZ05hbWVMaXN0c1swXS5sZW5ndGg7XG4gICAgZm9yIChsZXQgY29sSWR4ID0gMDsgY29sSWR4IDwgbnVtQXJnczsgY29sSWR4KyspIHtcbiAgICAgICAgY29uc3QgY29sID0gW107XG4gICAgICAgIGZvciAobGV0IHJvd0lkeCA9IDA7IHJvd0lkeCA8IHRoaXMudGVybXMubGVuZ3RoOyByb3dJZHgrKykge1xuICAgICAgICAgICAgY29sLnB1c2godGVybUFyZ05hbWVMaXN0c1tyb3dJZHhdW2NvbElkeF0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVuaXF1ZU5hbWVzID0gY29weVdpdGhvdXREdXBsaWNhdGVzKGNvbCk7XG4gICAgICAgIGFyZ3VtZW50TmFtZUxpc3QucHVzaCh1bmlxdWVOYW1lcy5qb2luKCdfb3JfJykpO1xuICAgIH1cbiAgICBpZiAoIW5vRHVwQ2hlY2spIHtcbiAgICAgICAgcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3VtZW50TmFtZUxpc3Q7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICAvLyBHZW5lcmF0ZSB0aGUgYXJndW1lbnQgbmFtZSBsaXN0LCB3aXRob3V0IHdvcnJ5aW5nIGFib3V0IGR1cGxpY2F0ZXMuXG4gICAgbGV0IGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmYWN0b3IgPT4ge1xuICAgICAgICBjb25zdCBmYWN0b3JBcmd1bWVudE5hbWVMaXN0ID0gZmFjdG9yLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCB0cnVlKTtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdCA9IGFyZ3VtZW50TmFtZUxpc3QuY29uY2F0KGZhY3RvckFyZ3VtZW50TmFtZUxpc3QpO1xuICAgICAgICAvLyBTaGlmdCB0aGUgZmlyc3RBcmdJbmRleCB0byB0YWtlIHRoaXMgZmFjdG9yJ3MgYXJndW1lbnQgbmFtZXMgaW50byBhY2NvdW50LlxuICAgICAgICBmaXJzdEFyZ0luZGV4ICs9IGZhY3RvckFyZ3VtZW50TmFtZUxpc3QubGVuZ3RoO1xuICAgIH0pO1xuICAgIGlmICghbm9EdXBDaGVjaykge1xuICAgICAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICBjb25zdCBhcmd1bWVudE5hbWVMaXN0ID0gdGhpcy5leHByXG4gICAgICAgIC50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaylcbiAgICAgICAgLm1hcChleHByQXJndW1lbnRTdHJpbmcgPT4gZXhwckFyZ3VtZW50U3RyaW5nW2V4cHJBcmd1bWVudFN0cmluZy5sZW5ndGggLSAxXSA9PT0gJ3MnXG4gICAgICAgID8gZXhwckFyZ3VtZW50U3RyaW5nICsgJ2VzJ1xuICAgICAgICA6IGV4cHJBcmd1bWVudFN0cmluZyArICdzJyk7XG4gICAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgICAgIHJlc29sdmVEdXBsaWNhdGVkTmFtZXMoYXJndW1lbnROYW1lTGlzdCk7XG4gICAgfVxuICAgIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcbnBleHBycy5PcHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykubWFwKGFyZ05hbWUgPT4ge1xuICAgICAgICByZXR1cm4gJ29wdCcgKyBhcmdOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBhcmdOYW1lLnNsaWNlKDEpO1xuICAgIH0pO1xufTtcbnBleHBycy5Ob3QucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFtdO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IHBleHBycy5MZXgucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9XG4gICAgZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjayk7XG4gICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gW3RoaXMucnVsZU5hbWVdO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gWyckJyArIGZpcnN0QXJnSW5kZXhdO1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gWydwYXJhbScgKyB0aGlzLmluZGV4XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgUEV4cHIsIGZvciB1c2UgYXMgYSBVSSBsYWJlbCwgZXRjLlxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBjb21tb24uYWJzdHJhY3QoJ3RvRGlzcGxheVN0cmluZycpO1xucGV4cHJzLkFsdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gcGV4cHJzLlNlcS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2UudHJpbW1lZCgpLmNvbnRlbnRzO1xuICAgIH1cbiAgICByZXR1cm4gJ1snICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJ10nO1xufTtcbnBleHBycy5hbnkudG9EaXNwbGF5U3RyaW5nID1cbiAgICBwZXhwcnMuZW5kLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgIHBleHBycy5JdGVyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgcGV4cHJzLk5vdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBzID0gdGhpcy5hcmdzLm1hcChhcmcgPT4gYXJnLnRvRGlzcGxheVN0cmluZygpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZU5hbWUgKyAnPCcgKyBwcy5qb2luKCcsJykgKyAnPic7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlTmFtZTtcbiAgICB9XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdVbmljb2RlIFsnICsgdGhpcy5jYXRlZ29yeSArICddIGNoYXJhY3Rlcic7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG5jb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuY29uc3QgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBjb21tb24uYWJzdHJhY3QoJ3RvRmFpbHVyZScpO1xucGV4cHJzLmFueS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCAnYW55IG9iamVjdCcsICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5lbmQudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2VuZCBvZiBpbnB1dCcsICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgdGhpcy5vYmosICdzdHJpbmcnKTtcbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgLy8gVE9ETzogY29tZSB1cCB3aXRoIHNvbWV0aGluZyBiZXR0ZXJcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKSwgJ2NvZGUnKTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdGhpcy5leHByID09PSBwZXhwcnMuYW55ID8gJ25vdGhpbmcnIDogJ25vdCAnICsgdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKTtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci50b0ZhaWx1cmUoZ3JhbW1hcik7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGxldCBkZXNjcmlwdGlvbiA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV0uZGVzY3JpcHRpb247XG4gICAgaWYgKCFkZXNjcmlwdGlvbikge1xuICAgICAgICBjb25zdCBhcnRpY2xlID0gL15bYWVpb3VBRUlPVV0vLnRlc3QodGhpcy5ydWxlTmFtZSkgPyAnYW4nIDogJ2EnO1xuICAgICAgICBkZXNjcmlwdGlvbiA9IGFydGljbGUgKyAnICcgKyB0aGlzLnJ1bGVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2EgVW5pY29kZSBbJyArIHRoaXMuY2F0ZWdvcnkgKyAnXSBjaGFyYWN0ZXInLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGNvbnN0IGZzID0gdGhpcy50ZXJtcy5tYXAodCA9PiB0LnRvRmFpbHVyZShncmFtbWFyKSk7XG4gICAgY29uc3QgZGVzY3JpcHRpb24gPSAnKCcgKyBmcy5qb2luKCcgb3IgJykgKyAnKSc7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGNvbnN0IGZzID0gdGhpcy5mYWN0b3JzLm1hcChmID0+IGYudG9GYWlsdXJlKGdyYW1tYXIpKTtcbiAgICBjb25zdCBkZXNjcmlwdGlvbiA9ICcoJyArIGZzLmpvaW4oJyAnKSArICcpJztcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gJygnICsgdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKSArIHRoaXMub3BlcmF0b3IgKyAnKSc7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmNvbnN0IGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG5jb25zdCBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBlMS50b1N0cmluZygpID09PSBlMi50b1N0cmluZygpID09PiBlMSBhbmQgZTIgYXJlIHNlbWFudGljYWxseSBlcXVpdmFsZW50LlxuICBOb3RlIHRoYXQgdGhpcyBpcyBub3QgYW4gaWZmICg8PT0+KTogZS5nLixcbiAgKH5cImJcIiBcImFcIikudG9TdHJpbmcoKSAhPT0gKFwiYVwiKS50b1N0cmluZygpLCBldmVuIHRob3VnaFxuICB+XCJiXCIgXCJhXCIgYW5kIFwiYVwiIGFyZSBpbnRlcmNoYW5nZWFibGUgaW4gYW55IGdyYW1tYXIsXG4gIGJvdGggaW4gdGVybXMgb2YgdGhlIGxhbmd1YWdlcyB0aGV5IGFjY2VwdCBhbmQgdGhlaXIgYXJpdGllcy5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvU3RyaW5nID0gY29tbW9uLmFic3RyYWN0KCd0b1N0cmluZycpO1xucGV4cHJzLmFueS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ2FueSc7XG59O1xucGV4cHJzLmVuZC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ2VuZCc7XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5vYmopO1xufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byk7XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyQnICsgdGhpcy5pbmRleDtcbn07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyMoJyArIHRoaXMuZXhwci50b1N0cmluZygpICsgJyknO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IHRoaXMudGVybXNbMF0udG9TdHJpbmcoKVxuICAgICAgICA6ICcoJyArIHRoaXMudGVybXMubWFwKHRlcm0gPT4gdGVybS50b1N0cmluZygpKS5qb2luKCcgfCAnKSArICcpJztcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5mYWN0b3JzLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IHRoaXMuZmFjdG9yc1swXS50b1N0cmluZygpXG4gICAgICAgIDogJygnICsgdGhpcy5mYWN0b3JzLm1hcChmYWN0b3IgPT4gZmFjdG9yLnRvU3RyaW5nKCkpLmpvaW4oJyAnKSArICcpJztcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwciArIHRoaXMub3BlcmF0b3I7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICd+JyArIHRoaXMuZXhwcjtcbn07XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyYnICsgdGhpcy5leHByO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBzID0gdGhpcy5hcmdzLm1hcChhcmcgPT4gYXJnLnRvU3RyaW5nKCkpO1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xuICAgIH1cbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnXFxcXHB7JyArIHRoaXMuY2F0ZWdvcnkgKyAnfSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5jb25zdCBVbmljb2RlQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uL3RoaXJkX3BhcnR5L1VuaWNvZGVDYXRlZ29yaWVzJyk7XG5jb25zdCBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHZW5lcmFsIHN0dWZmXG5jbGFzcyBQRXhwciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yID09PSBQRXhwcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUEV4cHIgY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdCdzIGFic3RyYWN0XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFNldCB0aGUgYHNvdXJjZWAgcHJvcGVydHkgdG8gdGhlIGludGVydmFsIGNvbnRhaW5pbmcgdGhlIHNvdXJjZSBmb3IgdGhpcyBleHByZXNzaW9uLlxuICAgIHdpdGhTb3VyY2UoaW50ZXJ2YWwpIHtcbiAgICAgICAgaWYgKGludGVydmFsKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IGludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4vLyBBbnlcbmNvbnN0IGFueSA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcbi8vIEVuZFxuY29uc3QgZW5kID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuLy8gVGVybWluYWxzXG5jbGFzcyBUZXJtaW5hbCBleHRlbmRzIFBFeHByIHtcbiAgICBjb25zdHJ1Y3RvcihvYmopIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5vYmogPSBvYmo7XG4gICAgfVxufVxuLy8gUmFuZ2VzXG5jbGFzcyBSYW5nZSBleHRlbmRzIFBFeHByIHtcbiAgICBjb25zdHJ1Y3Rvcihmcm9tLCB0bykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmZyb20gPSBmcm9tO1xuICAgICAgICB0aGlzLnRvID0gdG87XG4gICAgfVxufVxuLy8gUGFyYW1ldGVyc1xuY2xhc3MgUGFyYW0gZXh0ZW5kcyBQRXhwciB7XG4gICAgY29uc3RydWN0b3IoaW5kZXgpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgIH1cbn1cbi8vIEFsdGVybmF0aW9uXG5jbGFzcyBBbHQgZXh0ZW5kcyBQRXhwciB7XG4gICAgY29uc3RydWN0b3IodGVybXMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50ZXJtcyA9IHRlcm1zO1xuICAgIH1cbn1cbi8vIEV4dGVuZCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cbmNsYXNzIEV4dGVuZCBleHRlbmRzIEFsdCB7XG4gICAgY29uc3RydWN0b3Ioc3VwZXJHcmFtbWFyLCBuYW1lLCBib2R5KSB7XG4gICAgICAgIGNvbnN0IG9yaWdCb2R5ID0gc3VwZXJHcmFtbWFyLnJ1bGVzW25hbWVdLmJvZHk7XG4gICAgICAgIHN1cGVyKFtib2R5LCBvcmlnQm9keV0pO1xuICAgICAgICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy5ib2R5ID0gYm9keTtcbiAgICB9XG59XG4vLyBTcGxpY2UgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgb3ZlcnJpZGluZyB3aXRoIHRoZSBgLi4uYCBvcGVyYXRvci5cbmNsYXNzIFNwbGljZSBleHRlbmRzIEFsdCB7XG4gICAgY29uc3RydWN0b3Ioc3VwZXJHcmFtbWFyLCBydWxlTmFtZSwgYmVmb3JlVGVybXMsIGFmdGVyVGVybXMpIHtcbiAgICAgICAgY29uc3Qgb3JpZ0JvZHkgPSBzdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgIHN1cGVyKFsuLi5iZWZvcmVUZXJtcywgb3JpZ0JvZHksIC4uLmFmdGVyVGVybXNdKTtcbiAgICAgICAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gICAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgICAgdGhpcy5leHBhbnNpb25Qb3MgPSBiZWZvcmVUZXJtcy5sZW5ndGg7XG4gICAgfVxufVxuLy8gU2VxdWVuY2VzXG5jbGFzcyBTZXEgZXh0ZW5kcyBQRXhwciB7XG4gICAgY29uc3RydWN0b3IoZmFjdG9ycykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmZhY3RvcnMgPSBmYWN0b3JzO1xuICAgIH1cbn1cbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG5jbGFzcyBJdGVyIGV4dGVuZHMgUEV4cHIge1xuICAgIGNvbnN0cnVjdG9yKGV4cHIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByID0gZXhwcjtcbiAgICB9XG59XG5jbGFzcyBTdGFyIGV4dGVuZHMgSXRlciB7XG59XG5jbGFzcyBQbHVzIGV4dGVuZHMgSXRlciB7XG59XG5jbGFzcyBPcHQgZXh0ZW5kcyBJdGVyIHtcbn1cblN0YXIucHJvdG90eXBlLm9wZXJhdG9yID0gJyonO1xuUGx1cy5wcm90b3R5cGUub3BlcmF0b3IgPSAnKyc7XG5PcHQucHJvdG90eXBlLm9wZXJhdG9yID0gJz8nO1xuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5TdGFyLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuUGx1cy5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbk9wdC5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IDE7XG4vLyBQcmVkaWNhdGVzXG5jbGFzcyBOb3QgZXh0ZW5kcyBQRXhwciB7XG4gICAgY29uc3RydWN0b3IoZXhwcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmV4cHIgPSBleHByO1xuICAgIH1cbn1cbmNsYXNzIExvb2thaGVhZCBleHRlbmRzIFBFeHByIHtcbiAgICBjb25zdHJ1Y3RvcihleHByKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgfVxufVxuLy8gXCJMZXhpZmljYXRpb25cIlxuY2xhc3MgTGV4IGV4dGVuZHMgUEV4cHIge1xuICAgIGNvbnN0cnVjdG9yKGV4cHIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5leHByID0gZXhwcjtcbiAgICB9XG59XG4vLyBSdWxlIGFwcGxpY2F0aW9uXG5jbGFzcyBBcHBseSBleHRlbmRzIFBFeHByIHtcbiAgICBjb25zdHJ1Y3RvcihydWxlTmFtZSwgYXJncyA9IFtdKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICB9XG4gICAgaXNTeW50YWN0aWMoKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSk7XG4gICAgfVxuICAgIC8vIFRoaXMgbWV0aG9kIGp1c3QgY2FjaGVzIHRoZSByZXN1bHQgb2YgYHRoaXMudG9TdHJpbmcoKWAgaW4gYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eS5cbiAgICB0b01lbW9LZXkoKSB7XG4gICAgICAgIGlmICghdGhpcy5fbWVtb0tleSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbWVtb0tleScsIHsgdmFsdWU6IHRoaXMudG9TdHJpbmcoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbWVtb0tleTtcbiAgICB9XG59XG4vLyBVbmljb2RlIGNoYXJhY3RlclxuY2xhc3MgVW5pY29kZUNoYXIgZXh0ZW5kcyBQRXhwciB7XG4gICAgY29uc3RydWN0b3IoY2F0ZWdvcnkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgICAgICB0aGlzLnBhdHRlcm4gPSBVbmljb2RlQ2F0ZWdvcmllc1tjYXRlZ29yeV07XG4gICAgfVxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnRzLlBFeHByID0gUEV4cHI7XG5leHBvcnRzLmFueSA9IGFueTtcbmV4cG9ydHMuZW5kID0gZW5kO1xuZXhwb3J0cy5UZXJtaW5hbCA9IFRlcm1pbmFsO1xuZXhwb3J0cy5SYW5nZSA9IFJhbmdlO1xuZXhwb3J0cy5QYXJhbSA9IFBhcmFtO1xuZXhwb3J0cy5BbHQgPSBBbHQ7XG5leHBvcnRzLkV4dGVuZCA9IEV4dGVuZDtcbmV4cG9ydHMuU3BsaWNlID0gU3BsaWNlO1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkl0ZXIgPSBJdGVyO1xuZXhwb3J0cy5TdGFyID0gU3RhcjtcbmV4cG9ydHMuUGx1cyA9IFBsdXM7XG5leHBvcnRzLk9wdCA9IE9wdDtcbmV4cG9ydHMuTm90ID0gTm90O1xuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWQ7XG5leHBvcnRzLkxleCA9IExleDtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcbmV4cG9ydHMuVW5pY29kZUNoYXIgPSBVbmljb2RlQ2hhcjtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHRlbnNpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucmVxdWlyZSgnLi9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWV2YWwnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdldEFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1vdXRwdXRSZWNpcGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWludHJvZHVjZVBhcmFtcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtaXNOdWxsYWJsZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtc3Vic3RpdHV0ZVBhcmFtcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0Rpc3BsYXlTdHJpbmcnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRmFpbHVyZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9TdHJpbmcnKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2l2ZW4gYW4gYXJyYXkgb2YgbnVtYmVycyBgYXJyYCwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBudW1iZXJzIGFzIHN0cmluZ3MsXG4vLyByaWdodC1qdXN0aWZpZWQgYW5kIHBhZGRlZCB0byB0aGUgc2FtZSBsZW5ndGguXG5mdW5jdGlvbiBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChhcnIpIHtcbiAgICBsZXQgbWF4TGVuID0gMDtcbiAgICBjb25zdCBzdHJpbmdzID0gYXJyLm1hcChuID0+IHtcbiAgICAgICAgY29uc3Qgc3RyID0gbi50b1N0cmluZygpO1xuICAgICAgICBtYXhMZW4gPSBNYXRoLm1heChtYXhMZW4sIHN0ci5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH0pO1xuICAgIHJldHVybiBzdHJpbmdzLm1hcChzID0+IGNvbW1vbi5wYWRMZWZ0KHMsIG1heExlbikpO1xufVxuLy8gUHJvZHVjZSBhIG5ldyBzdHJpbmcgdGhhdCB3b3VsZCBiZSB0aGUgcmVzdWx0IG9mIGNvcHlpbmcgdGhlIGNvbnRlbnRzXG4vLyBvZiB0aGUgc3RyaW5nIGBzcmNgIG9udG8gYGRlc3RgIGF0IG9mZnNldCBgb2ZmZXN0YC5cbmZ1bmN0aW9uIHN0cmNweShkZXN0LCBzcmMsIG9mZnNldCkge1xuICAgIGNvbnN0IG9yaWdEZXN0TGVuID0gZGVzdC5sZW5ndGg7XG4gICAgY29uc3Qgc3RhcnQgPSBkZXN0LnNsaWNlKDAsIG9mZnNldCk7XG4gICAgY29uc3QgZW5kID0gZGVzdC5zbGljZShvZmZzZXQgKyBzcmMubGVuZ3RoKTtcbiAgICByZXR1cm4gKHN0YXJ0ICsgc3JjICsgZW5kKS5zdWJzdHIoMCwgb3JpZ0Rlc3RMZW4pO1xufVxuLy8gQ2FzdHMgdGhlIHVuZGVybHlpbmcgbGluZUFuZENvbCBvYmplY3QgdG8gYSBmb3JtYXR0ZWQgbWVzc2FnZSBzdHJpbmcsXG4vLyBoaWdobGlnaHRpbmcgYHJhbmdlc2AuXG5mdW5jdGlvbiBsaW5lQW5kQ29sdW1uVG9NZXNzYWdlKC4uLnJhbmdlcykge1xuICAgIGNvbnN0IGxpbmVBbmRDb2wgPSB0aGlzO1xuICAgIGNvbnN0IG9mZnNldCA9IGxpbmVBbmRDb2wub2Zmc2V0O1xuICAgIGNvbnN0IHJlcGVhdFN0ciA9IGNvbW1vbi5yZXBlYXRTdHI7XG4gICAgY29uc3Qgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHNiLmFwcGVuZCgnTGluZSAnICsgbGluZUFuZENvbC5saW5lTnVtICsgJywgY29sICcgKyBsaW5lQW5kQ29sLmNvbE51bSArICc6XFxuJyk7XG4gICAgLy8gQW4gYXJyYXkgb2YgdGhlIHByZXZpb3VzLCBjdXJyZW50LCBhbmQgbmV4dCBsaW5lIG51bWJlcnMgYXMgc3RyaW5ncyBvZiBlcXVhbCBsZW5ndGguXG4gICAgY29uc3QgbGluZU51bWJlcnMgPSBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChbXG4gICAgICAgIGxpbmVBbmRDb2wucHJldkxpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gLSAxLFxuICAgICAgICBsaW5lQW5kQ29sLmxpbmVOdW0sXG4gICAgICAgIGxpbmVBbmRDb2wubmV4dExpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gKyAxXG4gICAgXSk7XG4gICAgLy8gSGVscGVyIGZvciBhcHBlbmRpbmcgZm9ybWF0dGluZyBpbnB1dCBsaW5lcyB0byB0aGUgYnVmZmVyLlxuICAgIGNvbnN0IGFwcGVuZExpbmUgPSAobnVtLCBjb250ZW50LCBwcmVmaXgpID0+IHtcbiAgICAgICAgc2IuYXBwZW5kKHByZWZpeCArIGxpbmVOdW1iZXJzW251bV0gKyAnIHwgJyArIGNvbnRlbnQgKyAnXFxuJyk7XG4gICAgfTtcbiAgICAvLyBJbmNsdWRlIHRoZSBwcmV2aW91cyBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICAgIGlmIChsaW5lQW5kQ29sLnByZXZMaW5lICE9IG51bGwpIHtcbiAgICAgICAgYXBwZW5kTGluZSgwLCBsaW5lQW5kQ29sLnByZXZMaW5lLCAnICAnKTtcbiAgICB9XG4gICAgLy8gTGluZSB0aGF0IHRoZSBlcnJvciBvY2N1cnJlZCBvbi5cbiAgICBhcHBlbmRMaW5lKDEsIGxpbmVBbmRDb2wubGluZSwgJz4gJyk7XG4gICAgLy8gQnVpbGQgdXAgdGhlIGxpbmUgdGhhdCBwb2ludHMgdG8gdGhlIG9mZnNldCBhbmQgcG9zc2libGUgaW5kaWNhdGVzIG9uZSBvciBtb3JlIHJhbmdlcy5cbiAgICAvLyBTdGFydCB3aXRoIGEgYmxhbmsgbGluZSwgYW5kIGluZGljYXRlIGVhY2ggcmFuZ2UgYnkgb3ZlcmxheWluZyBhIHN0cmluZyBvZiBgfmAgY2hhcnMuXG4gICAgY29uc3QgbGluZUxlbiA9IGxpbmVBbmRDb2wubGluZS5sZW5ndGg7XG4gICAgbGV0IGluZGljYXRpb25MaW5lID0gcmVwZWF0U3RyKCcgJywgbGluZUxlbiArIDEpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGxldCBzdGFydElkeCA9IHJhbmdlc1tpXVswXTtcbiAgICAgICAgbGV0IGVuZElkeCA9IHJhbmdlc1tpXVsxXTtcbiAgICAgICAgY29tbW9uLmFzc2VydChzdGFydElkeCA+PSAwICYmIHN0YXJ0SWR4IDw9IGVuZElkeCwgJ3JhbmdlIHN0YXJ0IG11c3QgYmUgPj0gMCBhbmQgPD0gZW5kJyk7XG4gICAgICAgIGNvbnN0IGxpbmVTdGFydE9mZnNldCA9IG9mZnNldCAtIGxpbmVBbmRDb2wuY29sTnVtICsgMTtcbiAgICAgICAgc3RhcnRJZHggPSBNYXRoLm1heCgwLCBzdGFydElkeCAtIGxpbmVTdGFydE9mZnNldCk7XG4gICAgICAgIGVuZElkeCA9IE1hdGgubWluKGVuZElkeCAtIGxpbmVTdGFydE9mZnNldCwgbGluZUxlbik7XG4gICAgICAgIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCByZXBlYXRTdHIoJ34nLCBlbmRJZHggLSBzdGFydElkeCksIHN0YXJ0SWR4KTtcbiAgICB9XG4gICAgY29uc3QgZ3V0dGVyV2lkdGggPSAyICsgbGluZU51bWJlcnNbMV0ubGVuZ3RoICsgMztcbiAgICBzYi5hcHBlbmQocmVwZWF0U3RyKCcgJywgZ3V0dGVyV2lkdGgpKTtcbiAgICBpbmRpY2F0aW9uTGluZSA9IHN0cmNweShpbmRpY2F0aW9uTGluZSwgJ14nLCBsaW5lQW5kQ29sLmNvbE51bSAtIDEpO1xuICAgIHNiLmFwcGVuZChpbmRpY2F0aW9uTGluZS5yZXBsYWNlKC8gKyQvLCAnJykgKyAnXFxuJyk7XG4gICAgLy8gSW5jbHVkZSB0aGUgbmV4dCBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICAgIGlmIChsaW5lQW5kQ29sLm5leHRMaW5lICE9IG51bGwpIHtcbiAgICAgICAgYXBwZW5kTGluZSgyLCBsaW5lQW5kQ29sLm5leHRMaW5lLCAnICAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmxldCBidWlsdEluUnVsZXNDYWxsYmFja3MgPSBbXTtcbi8vIFNpbmNlIEdyYW1tYXIuQnVpbHRJblJ1bGVzIGlzIGJvb3RzdHJhcHBlZCwgbW9zdCBvZiBPaG0gY2FuJ3QgZGlyZWN0bHkgZGVwZW5kIGl0LlxuLy8gVGhpcyBmdW5jdGlvbiBhbGxvd3MgbW9kdWxlcyB0aGF0IGRvIGRlcGVuZCBvbiB0aGUgYnVpbHQtaW4gcnVsZXMgdG8gcmVnaXN0ZXIgYSBjYWxsYmFja1xuLy8gdGhhdCB3aWxsIGJlIGNhbGxlZCBsYXRlciBpbiB0aGUgaW5pdGlhbGl6YXRpb24gcHJvY2Vzcy5cbmV4cG9ydHMuYXdhaXRCdWlsdEluUnVsZXMgPSBjYiA9PiB7XG4gICAgYnVpbHRJblJ1bGVzQ2FsbGJhY2tzLnB1c2goY2IpO1xufTtcbmV4cG9ydHMuYW5ub3VuY2VCdWlsdEluUnVsZXMgPSBncmFtbWFyID0+IHtcbiAgICBidWlsdEluUnVsZXNDYWxsYmFja3MuZm9yRWFjaChjYiA9PiB7XG4gICAgICAgIGNiKGdyYW1tYXIpO1xuICAgIH0pO1xuICAgIGJ1aWx0SW5SdWxlc0NhbGxiYWNrcyA9IG51bGw7XG59O1xuLy8gUmV0dXJuIGFuIG9iamVjdCB3aXRoIHRoZSBsaW5lIGFuZCBjb2x1bW4gaW5mb3JtYXRpb24gZm9yIHRoZSBnaXZlblxuLy8gb2Zmc2V0IGluIGBzdHJgLlxuZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uID0gKHN0ciwgb2Zmc2V0KSA9PiB7XG4gICAgbGV0IGxpbmVOdW0gPSAxO1xuICAgIGxldCBjb2xOdW0gPSAxO1xuICAgIGxldCBjdXJyT2Zmc2V0ID0gMDtcbiAgICBsZXQgbGluZVN0YXJ0T2Zmc2V0ID0gMDtcbiAgICBsZXQgbmV4dExpbmUgPSBudWxsO1xuICAgIGxldCBwcmV2TGluZSA9IG51bGw7XG4gICAgbGV0IHByZXZMaW5lU3RhcnRPZmZzZXQgPSAtMTtcbiAgICB3aGlsZSAoY3Vyck9mZnNldCA8IG9mZnNldCkge1xuICAgICAgICBjb25zdCBjID0gc3RyLmNoYXJBdChjdXJyT2Zmc2V0KyspO1xuICAgICAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGxpbmVOdW0rKztcbiAgICAgICAgICAgIGNvbE51bSA9IDE7XG4gICAgICAgICAgICBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gbGluZVN0YXJ0T2Zmc2V0O1xuICAgICAgICAgICAgbGluZVN0YXJ0T2Zmc2V0ID0gY3Vyck9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjICE9PSAnXFxyJykge1xuICAgICAgICAgICAgY29sTnVtKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRmluZCB0aGUgZW5kIG9mIHRoZSB0YXJnZXQgbGluZS5cbiAgICBsZXQgbGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lU3RhcnRPZmZzZXQpO1xuICAgIGlmIChsaW5lRW5kT2Zmc2V0ID09PSAtMSkge1xuICAgICAgICBsaW5lRW5kT2Zmc2V0ID0gc3RyLmxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBsaW5lLlxuICAgICAgICBjb25zdCBuZXh0TGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lRW5kT2Zmc2V0ICsgMSk7XG4gICAgICAgIG5leHRMaW5lID1cbiAgICAgICAgICAgIG5leHRMaW5lRW5kT2Zmc2V0ID09PSAtMVxuICAgICAgICAgICAgICAgID8gc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQpXG4gICAgICAgICAgICAgICAgOiBzdHIuc2xpY2UobGluZUVuZE9mZnNldCwgbmV4dExpbmVFbmRPZmZzZXQpO1xuICAgICAgICAvLyBTdHJpcCBsZWFkaW5nIGFuZCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgICAgICAgbmV4dExpbmUgPSBuZXh0TGluZS5yZXBsYWNlKC9eXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHIkLywgJycpO1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIHByZXZpb3VzIGxpbmUuXG4gICAgaWYgKHByZXZMaW5lU3RhcnRPZmZzZXQgPj0gMCkge1xuICAgICAgICAvLyBTdHJpcCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgICAgICAgcHJldkxpbmUgPSBzdHIuc2xpY2UocHJldkxpbmVTdGFydE9mZnNldCwgbGluZVN0YXJ0T2Zmc2V0KS5yZXBsYWNlKC9cXHI/XFxuJC8sICcnKTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSB0YXJnZXQgbGluZSwgc3RyaXBwaW5nIGEgdHJhaWxpbmcgY2FycmlhZ2UgcmV0dXJuIGlmIG5lY2Vzc2FyeS5cbiAgICBjb25zdCBsaW5lID0gc3RyLnNsaWNlKGxpbmVTdGFydE9mZnNldCwgbGluZUVuZE9mZnNldCkucmVwbGFjZSgvXFxyJC8sICcnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBvZmZzZXQsXG4gICAgICAgIGxpbmVOdW0sXG4gICAgICAgIGNvbE51bSxcbiAgICAgICAgbGluZSxcbiAgICAgICAgcHJldkxpbmUsXG4gICAgICAgIG5leHRMaW5lLFxuICAgICAgICB0b1N0cmluZzogbGluZUFuZENvbHVtblRvTWVzc2FnZVxuICAgIH07XG59O1xuLy8gUmV0dXJuIGEgbmljZWx5LWZvcm1hdHRlZCBzdHJpbmcgZGVzY3JpYmluZyB0aGUgbGluZSBhbmQgY29sdW1uIGZvciB0aGVcbi8vIGdpdmVuIG9mZnNldCBpbiBgc3RyYCBoaWdobGlnaHRpbmcgYHJhbmdlc2AuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlID0gZnVuY3Rpb24gKHN0ciwgb2Zmc2V0LCAuLi5yYW5nZXMpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uKHN0ciwgb2Zmc2V0KS50b1N0cmluZyguLi5yYW5nZXMpO1xufTtcbmV4cG9ydHMudW5pcXVlSWQgPSAoKCkgPT4ge1xuICAgIGxldCBpZENvdW50ZXIgPSAwO1xuICAgIHJldHVybiBwcmVmaXggPT4gJycgKyBwcmVmaXggKyBpZENvdW50ZXIrKztcbn0pKCk7XG4iLCIvKiBnbG9iYWwgX19HTE9CQUxfT0hNX1ZFUlNJT05fXyAqL1xuJ3VzZSBzdHJpY3QnO1xuLy8gV2hlbiBydW5uaW5nIHVuZGVyIE5vZGUsIHJlYWQgdGhlIHZlcnNpb24gZnJvbSBwYWNrYWdlLmpzb24uIEZvciB0aGUgYnJvd3Nlcixcbi8vIHVzZSBhIHNwZWNpYWwgZ2xvYmFsIHZhcmlhYmxlIGRlZmluZWQgaW4gdGhlIGJ1aWxkIHByb2Nlc3MgKHNlZSB3ZWJwYWNrLmNvbmZpZy5qcykuXG5tb2R1bGUuZXhwb3J0cyA9XG4gICAgdHlwZW9mIF9fR0xPQkFMX09ITV9WRVJTSU9OX18gPT09ICdzdHJpbmcnXG4gICAgICAgID8gX19HTE9CQUxfT0hNX1ZFUlNJT05fX1xuICAgICAgICA6IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG4iLCIvLyBCYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy91bmljb2RlLTkuMC4wLlxuLy8gVGhlc2UgYXJlIGp1c3QgY2F0ZWdvcmllcyB0aGF0IGFyZSB1c2VkIGluIEVTNS9FUzIwMTUuXG4vLyBUaGUgZnVsbCBsaXN0IG9mIFVuaWNvZGUgY2F0ZWdvcmllcyBpcyBoZXJlOiBodHRwOi8vd3d3LmZpbGVmb3JtYXQuaW5mby9pbmZvL3VuaWNvZGUvY2F0ZWdvcnkvaW5kZXguaHRtLlxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIExldHRlcnNcbiAgTHU6IC9bQS1aXFx4QzAtXFx4RDZcXHhEOC1cXHhERVxcdTAxMDBcXHUwMTAyXFx1MDEwNFxcdTAxMDZcXHUwMTA4XFx1MDEwQVxcdTAxMENcXHUwMTBFXFx1MDExMFxcdTAxMTJcXHUwMTE0XFx1MDExNlxcdTAxMThcXHUwMTFBXFx1MDExQ1xcdTAxMUVcXHUwMTIwXFx1MDEyMlxcdTAxMjRcXHUwMTI2XFx1MDEyOFxcdTAxMkFcXHUwMTJDXFx1MDEyRVxcdTAxMzBcXHUwMTMyXFx1MDEzNFxcdTAxMzZcXHUwMTM5XFx1MDEzQlxcdTAxM0RcXHUwMTNGXFx1MDE0MVxcdTAxNDNcXHUwMTQ1XFx1MDE0N1xcdTAxNEFcXHUwMTRDXFx1MDE0RVxcdTAxNTBcXHUwMTUyXFx1MDE1NFxcdTAxNTZcXHUwMTU4XFx1MDE1QVxcdTAxNUNcXHUwMTVFXFx1MDE2MFxcdTAxNjJcXHUwMTY0XFx1MDE2NlxcdTAxNjhcXHUwMTZBXFx1MDE2Q1xcdTAxNkVcXHUwMTcwXFx1MDE3MlxcdTAxNzRcXHUwMTc2XFx1MDE3OFxcdTAxNzlcXHUwMTdCXFx1MDE3RFxcdTAxODFcXHUwMTgyXFx1MDE4NFxcdTAxODZcXHUwMTg3XFx1MDE4OS1cXHUwMThCXFx1MDE4RS1cXHUwMTkxXFx1MDE5M1xcdTAxOTRcXHUwMTk2LVxcdTAxOThcXHUwMTlDXFx1MDE5RFxcdTAxOUZcXHUwMUEwXFx1MDFBMlxcdTAxQTRcXHUwMUE2XFx1MDFBN1xcdTAxQTlcXHUwMUFDXFx1MDFBRVxcdTAxQUZcXHUwMUIxLVxcdTAxQjNcXHUwMUI1XFx1MDFCN1xcdTAxQjhcXHUwMUJDXFx1MDFDNFxcdTAxQzdcXHUwMUNBXFx1MDFDRFxcdTAxQ0ZcXHUwMUQxXFx1MDFEM1xcdTAxRDVcXHUwMUQ3XFx1MDFEOVxcdTAxREJcXHUwMURFXFx1MDFFMFxcdTAxRTJcXHUwMUU0XFx1MDFFNlxcdTAxRThcXHUwMUVBXFx1MDFFQ1xcdTAxRUVcXHUwMUYxXFx1MDFGNFxcdTAxRjYtXFx1MDFGOFxcdTAxRkFcXHUwMUZDXFx1MDFGRVxcdTAyMDBcXHUwMjAyXFx1MDIwNFxcdTAyMDZcXHUwMjA4XFx1MDIwQVxcdTAyMENcXHUwMjBFXFx1MDIxMFxcdTAyMTJcXHUwMjE0XFx1MDIxNlxcdTAyMThcXHUwMjFBXFx1MDIxQ1xcdTAyMUVcXHUwMjIwXFx1MDIyMlxcdTAyMjRcXHUwMjI2XFx1MDIyOFxcdTAyMkFcXHUwMjJDXFx1MDIyRVxcdTAyMzBcXHUwMjMyXFx1MDIzQVxcdTAyM0JcXHUwMjNEXFx1MDIzRVxcdTAyNDFcXHUwMjQzLVxcdTAyNDZcXHUwMjQ4XFx1MDI0QVxcdTAyNENcXHUwMjRFXFx1MDM3MFxcdTAzNzJcXHUwMzc2XFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RVxcdTAzOEZcXHUwMzkxLVxcdTAzQTFcXHUwM0EzLVxcdTAzQUJcXHUwM0NGXFx1MDNEMi1cXHUwM0Q0XFx1MDNEOFxcdTAzREFcXHUwM0RDXFx1MDNERVxcdTAzRTBcXHUwM0UyXFx1MDNFNFxcdTAzRTZcXHUwM0U4XFx1MDNFQVxcdTAzRUNcXHUwM0VFXFx1MDNGNFxcdTAzRjdcXHUwM0Y5XFx1MDNGQVxcdTAzRkQtXFx1MDQyRlxcdTA0NjBcXHUwNDYyXFx1MDQ2NFxcdTA0NjZcXHUwNDY4XFx1MDQ2QVxcdTA0NkNcXHUwNDZFXFx1MDQ3MFxcdTA0NzJcXHUwNDc0XFx1MDQ3NlxcdTA0NzhcXHUwNDdBXFx1MDQ3Q1xcdTA0N0VcXHUwNDgwXFx1MDQ4QVxcdTA0OENcXHUwNDhFXFx1MDQ5MFxcdTA0OTJcXHUwNDk0XFx1MDQ5NlxcdTA0OThcXHUwNDlBXFx1MDQ5Q1xcdTA0OUVcXHUwNEEwXFx1MDRBMlxcdTA0QTRcXHUwNEE2XFx1MDRBOFxcdTA0QUFcXHUwNEFDXFx1MDRBRVxcdTA0QjBcXHUwNEIyXFx1MDRCNFxcdTA0QjZcXHUwNEI4XFx1MDRCQVxcdTA0QkNcXHUwNEJFXFx1MDRDMFxcdTA0QzFcXHUwNEMzXFx1MDRDNVxcdTA0QzdcXHUwNEM5XFx1MDRDQlxcdTA0Q0RcXHUwNEQwXFx1MDREMlxcdTA0RDRcXHUwNEQ2XFx1MDREOFxcdTA0REFcXHUwNERDXFx1MDRERVxcdTA0RTBcXHUwNEUyXFx1MDRFNFxcdTA0RTZcXHUwNEU4XFx1MDRFQVxcdTA0RUNcXHUwNEVFXFx1MDRGMFxcdTA0RjJcXHUwNEY0XFx1MDRGNlxcdTA0RjhcXHUwNEZBXFx1MDRGQ1xcdTA0RkVcXHUwNTAwXFx1MDUwMlxcdTA1MDRcXHUwNTA2XFx1MDUwOFxcdTA1MEFcXHUwNTBDXFx1MDUwRVxcdTA1MTBcXHUwNTEyXFx1MDUxNFxcdTA1MTZcXHUwNTE4XFx1MDUxQVxcdTA1MUNcXHUwNTFFXFx1MDUyMFxcdTA1MjJcXHUwNTI0XFx1MDUyNlxcdTA1MjhcXHUwNTJBXFx1MDUyQ1xcdTA1MkVcXHUwNTMxLVxcdTA1NTZcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEzQTAtXFx1MTNGNVxcdTFFMDBcXHUxRTAyXFx1MUUwNFxcdTFFMDZcXHUxRTA4XFx1MUUwQVxcdTFFMENcXHUxRTBFXFx1MUUxMFxcdTFFMTJcXHUxRTE0XFx1MUUxNlxcdTFFMThcXHUxRTFBXFx1MUUxQ1xcdTFFMUVcXHUxRTIwXFx1MUUyMlxcdTFFMjRcXHUxRTI2XFx1MUUyOFxcdTFFMkFcXHUxRTJDXFx1MUUyRVxcdTFFMzBcXHUxRTMyXFx1MUUzNFxcdTFFMzZcXHUxRTM4XFx1MUUzQVxcdTFFM0NcXHUxRTNFXFx1MUU0MFxcdTFFNDJcXHUxRTQ0XFx1MUU0NlxcdTFFNDhcXHUxRTRBXFx1MUU0Q1xcdTFFNEVcXHUxRTUwXFx1MUU1MlxcdTFFNTRcXHUxRTU2XFx1MUU1OFxcdTFFNUFcXHUxRTVDXFx1MUU1RVxcdTFFNjBcXHUxRTYyXFx1MUU2NFxcdTFFNjZcXHUxRTY4XFx1MUU2QVxcdTFFNkNcXHUxRTZFXFx1MUU3MFxcdTFFNzJcXHUxRTc0XFx1MUU3NlxcdTFFNzhcXHUxRTdBXFx1MUU3Q1xcdTFFN0VcXHUxRTgwXFx1MUU4MlxcdTFFODRcXHUxRTg2XFx1MUU4OFxcdTFFOEFcXHUxRThDXFx1MUU4RVxcdTFFOTBcXHUxRTkyXFx1MUU5NFxcdTFFOUVcXHUxRUEwXFx1MUVBMlxcdTFFQTRcXHUxRUE2XFx1MUVBOFxcdTFFQUFcXHUxRUFDXFx1MUVBRVxcdTFFQjBcXHUxRUIyXFx1MUVCNFxcdTFFQjZcXHUxRUI4XFx1MUVCQVxcdTFFQkNcXHUxRUJFXFx1MUVDMFxcdTFFQzJcXHUxRUM0XFx1MUVDNlxcdTFFQzhcXHUxRUNBXFx1MUVDQ1xcdTFFQ0VcXHUxRUQwXFx1MUVEMlxcdTFFRDRcXHUxRUQ2XFx1MUVEOFxcdTFFREFcXHUxRURDXFx1MUVERVxcdTFFRTBcXHUxRUUyXFx1MUVFNFxcdTFFRTZcXHUxRUU4XFx1MUVFQVxcdTFFRUNcXHUxRUVFXFx1MUVGMFxcdTFFRjJcXHUxRUY0XFx1MUVGNlxcdTFFRjhcXHUxRUZBXFx1MUVGQ1xcdTFFRkVcXHUxRjA4LVxcdTFGMEZcXHUxRjE4LVxcdTFGMURcXHUxRjI4LVxcdTFGMkZcXHUxRjM4LVxcdTFGM0ZcXHUxRjQ4LVxcdTFGNERcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGXFx1MUY2OC1cXHUxRjZGXFx1MUZCOC1cXHUxRkJCXFx1MUZDOC1cXHUxRkNCXFx1MUZEOC1cXHUxRkRCXFx1MUZFOC1cXHUxRkVDXFx1MUZGOC1cXHUxRkZCXFx1MjEwMlxcdTIxMDdcXHUyMTBCLVxcdTIxMERcXHUyMTEwLVxcdTIxMTJcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEzMC1cXHUyMTMzXFx1MjEzRVxcdTIxM0ZcXHUyMTQ1XFx1MjE4M1xcdTJDMDAtXFx1MkMyRVxcdTJDNjBcXHUyQzYyLVxcdTJDNjRcXHUyQzY3XFx1MkM2OVxcdTJDNkJcXHUyQzZELVxcdTJDNzBcXHUyQzcyXFx1MkM3NVxcdTJDN0UtXFx1MkM4MFxcdTJDODJcXHUyQzg0XFx1MkM4NlxcdTJDODhcXHUyQzhBXFx1MkM4Q1xcdTJDOEVcXHUyQzkwXFx1MkM5MlxcdTJDOTRcXHUyQzk2XFx1MkM5OFxcdTJDOUFcXHUyQzlDXFx1MkM5RVxcdTJDQTBcXHUyQ0EyXFx1MkNBNFxcdTJDQTZcXHUyQ0E4XFx1MkNBQVxcdTJDQUNcXHUyQ0FFXFx1MkNCMFxcdTJDQjJcXHUyQ0I0XFx1MkNCNlxcdTJDQjhcXHUyQ0JBXFx1MkNCQ1xcdTJDQkVcXHUyQ0MwXFx1MkNDMlxcdTJDQzRcXHUyQ0M2XFx1MkNDOFxcdTJDQ0FcXHUyQ0NDXFx1MkNDRVxcdTJDRDBcXHUyQ0QyXFx1MkNENFxcdTJDRDZcXHUyQ0Q4XFx1MkNEQVxcdTJDRENcXHUyQ0RFXFx1MkNFMFxcdTJDRTJcXHUyQ0VCXFx1MkNFRFxcdTJDRjJcXHVBNjQwXFx1QTY0MlxcdUE2NDRcXHVBNjQ2XFx1QTY0OFxcdUE2NEFcXHVBNjRDXFx1QTY0RVxcdUE2NTBcXHVBNjUyXFx1QTY1NFxcdUE2NTZcXHVBNjU4XFx1QTY1QVxcdUE2NUNcXHVBNjVFXFx1QTY2MFxcdUE2NjJcXHVBNjY0XFx1QTY2NlxcdUE2NjhcXHVBNjZBXFx1QTY2Q1xcdUE2ODBcXHVBNjgyXFx1QTY4NFxcdUE2ODZcXHVBNjg4XFx1QTY4QVxcdUE2OENcXHVBNjhFXFx1QTY5MFxcdUE2OTJcXHVBNjk0XFx1QTY5NlxcdUE2OThcXHVBNjlBXFx1QTcyMlxcdUE3MjRcXHVBNzI2XFx1QTcyOFxcdUE3MkFcXHVBNzJDXFx1QTcyRVxcdUE3MzJcXHVBNzM0XFx1QTczNlxcdUE3MzhcXHVBNzNBXFx1QTczQ1xcdUE3M0VcXHVBNzQwXFx1QTc0MlxcdUE3NDRcXHVBNzQ2XFx1QTc0OFxcdUE3NEFcXHVBNzRDXFx1QTc0RVxcdUE3NTBcXHVBNzUyXFx1QTc1NFxcdUE3NTZcXHVBNzU4XFx1QTc1QVxcdUE3NUNcXHVBNzVFXFx1QTc2MFxcdUE3NjJcXHVBNzY0XFx1QTc2NlxcdUE3NjhcXHVBNzZBXFx1QTc2Q1xcdUE3NkVcXHVBNzc5XFx1QTc3QlxcdUE3N0RcXHVBNzdFXFx1QTc4MFxcdUE3ODJcXHVBNzg0XFx1QTc4NlxcdUE3OEJcXHVBNzhEXFx1QTc5MFxcdUE3OTJcXHVBNzk2XFx1QTc5OFxcdUE3OUFcXHVBNzlDXFx1QTc5RVxcdUE3QTBcXHVBN0EyXFx1QTdBNFxcdUE3QTZcXHVBN0E4XFx1QTdBQS1cXHVBN0FFXFx1QTdCMC1cXHVBN0I0XFx1QTdCNlxcdUZGMjEtXFx1RkYzQV18XFx1RDgwMVtcXHVEQzAwLVxcdURDMjdcXHVEQ0IwLVxcdURDRDNdfFxcdUQ4MDNbXFx1REM4MC1cXHVEQ0IyXXxcXHVEODA2W1xcdURDQTAtXFx1RENCRl18XFx1RDgzNVtcXHVEQzAwLVxcdURDMTlcXHVEQzM0LVxcdURDNERcXHVEQzY4LVxcdURDODFcXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjVcXHVEQ0QwLVxcdURDRTlcXHVERDA0XFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMzhcXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENkMtXFx1REQ4NVxcdUREQTAtXFx1RERCOVxcdURERDQtXFx1RERFRFxcdURFMDgtXFx1REUyMVxcdURFM0MtXFx1REU1NVxcdURFNzAtXFx1REU4OVxcdURFQTgtXFx1REVDMFxcdURFRTItXFx1REVGQVxcdURGMUMtXFx1REYzNFxcdURGNTYtXFx1REY2RVxcdURGOTAtXFx1REZBOFxcdURGQ0FdfFxcdUQ4M0FbXFx1REQwMC1cXHVERDIxXS8sXG4gIExsOiAvW2EtelxceEI1XFx4REYtXFx4RjZcXHhGOC1cXHhGRlxcdTAxMDFcXHUwMTAzXFx1MDEwNVxcdTAxMDdcXHUwMTA5XFx1MDEwQlxcdTAxMERcXHUwMTBGXFx1MDExMVxcdTAxMTNcXHUwMTE1XFx1MDExN1xcdTAxMTlcXHUwMTFCXFx1MDExRFxcdTAxMUZcXHUwMTIxXFx1MDEyM1xcdTAxMjVcXHUwMTI3XFx1MDEyOVxcdTAxMkJcXHUwMTJEXFx1MDEyRlxcdTAxMzFcXHUwMTMzXFx1MDEzNVxcdTAxMzdcXHUwMTM4XFx1MDEzQVxcdTAxM0NcXHUwMTNFXFx1MDE0MFxcdTAxNDJcXHUwMTQ0XFx1MDE0NlxcdTAxNDhcXHUwMTQ5XFx1MDE0QlxcdTAxNERcXHUwMTRGXFx1MDE1MVxcdTAxNTNcXHUwMTU1XFx1MDE1N1xcdTAxNTlcXHUwMTVCXFx1MDE1RFxcdTAxNUZcXHUwMTYxXFx1MDE2M1xcdTAxNjVcXHUwMTY3XFx1MDE2OVxcdTAxNkJcXHUwMTZEXFx1MDE2RlxcdTAxNzFcXHUwMTczXFx1MDE3NVxcdTAxNzdcXHUwMTdBXFx1MDE3Q1xcdTAxN0UtXFx1MDE4MFxcdTAxODNcXHUwMTg1XFx1MDE4OFxcdTAxOENcXHUwMThEXFx1MDE5MlxcdTAxOTVcXHUwMTk5LVxcdTAxOUJcXHUwMTlFXFx1MDFBMVxcdTAxQTNcXHUwMUE1XFx1MDFBOFxcdTAxQUFcXHUwMUFCXFx1MDFBRFxcdTAxQjBcXHUwMUI0XFx1MDFCNlxcdTAxQjlcXHUwMUJBXFx1MDFCRC1cXHUwMUJGXFx1MDFDNlxcdTAxQzlcXHUwMUNDXFx1MDFDRVxcdTAxRDBcXHUwMUQyXFx1MDFENFxcdTAxRDZcXHUwMUQ4XFx1MDFEQVxcdTAxRENcXHUwMUREXFx1MDFERlxcdTAxRTFcXHUwMUUzXFx1MDFFNVxcdTAxRTdcXHUwMUU5XFx1MDFFQlxcdTAxRURcXHUwMUVGXFx1MDFGMFxcdTAxRjNcXHUwMUY1XFx1MDFGOVxcdTAxRkJcXHUwMUZEXFx1MDFGRlxcdTAyMDFcXHUwMjAzXFx1MDIwNVxcdTAyMDdcXHUwMjA5XFx1MDIwQlxcdTAyMERcXHUwMjBGXFx1MDIxMVxcdTAyMTNcXHUwMjE1XFx1MDIxN1xcdTAyMTlcXHUwMjFCXFx1MDIxRFxcdTAyMUZcXHUwMjIxXFx1MDIyM1xcdTAyMjVcXHUwMjI3XFx1MDIyOVxcdTAyMkJcXHUwMjJEXFx1MDIyRlxcdTAyMzFcXHUwMjMzLVxcdTAyMzlcXHUwMjNDXFx1MDIzRlxcdTAyNDBcXHUwMjQyXFx1MDI0N1xcdTAyNDlcXHUwMjRCXFx1MDI0RFxcdTAyNEYtXFx1MDI5M1xcdTAyOTUtXFx1MDJBRlxcdTAzNzFcXHUwMzczXFx1MDM3N1xcdTAzN0ItXFx1MDM3RFxcdTAzOTBcXHUwM0FDLVxcdTAzQ0VcXHUwM0QwXFx1MDNEMVxcdTAzRDUtXFx1MDNEN1xcdTAzRDlcXHUwM0RCXFx1MDNERFxcdTAzREZcXHUwM0UxXFx1MDNFM1xcdTAzRTVcXHUwM0U3XFx1MDNFOVxcdTAzRUJcXHUwM0VEXFx1MDNFRi1cXHUwM0YzXFx1MDNGNVxcdTAzRjhcXHUwM0ZCXFx1MDNGQ1xcdTA0MzAtXFx1MDQ1RlxcdTA0NjFcXHUwNDYzXFx1MDQ2NVxcdTA0NjdcXHUwNDY5XFx1MDQ2QlxcdTA0NkRcXHUwNDZGXFx1MDQ3MVxcdTA0NzNcXHUwNDc1XFx1MDQ3N1xcdTA0NzlcXHUwNDdCXFx1MDQ3RFxcdTA0N0ZcXHUwNDgxXFx1MDQ4QlxcdTA0OERcXHUwNDhGXFx1MDQ5MVxcdTA0OTNcXHUwNDk1XFx1MDQ5N1xcdTA0OTlcXHUwNDlCXFx1MDQ5RFxcdTA0OUZcXHUwNEExXFx1MDRBM1xcdTA0QTVcXHUwNEE3XFx1MDRBOVxcdTA0QUJcXHUwNEFEXFx1MDRBRlxcdTA0QjFcXHUwNEIzXFx1MDRCNVxcdTA0QjdcXHUwNEI5XFx1MDRCQlxcdTA0QkRcXHUwNEJGXFx1MDRDMlxcdTA0QzRcXHUwNEM2XFx1MDRDOFxcdTA0Q0FcXHUwNENDXFx1MDRDRVxcdTA0Q0ZcXHUwNEQxXFx1MDREM1xcdTA0RDVcXHUwNEQ3XFx1MDREOVxcdTA0REJcXHUwNEREXFx1MDRERlxcdTA0RTFcXHUwNEUzXFx1MDRFNVxcdTA0RTdcXHUwNEU5XFx1MDRFQlxcdTA0RURcXHUwNEVGXFx1MDRGMVxcdTA0RjNcXHUwNEY1XFx1MDRGN1xcdTA0RjlcXHUwNEZCXFx1MDRGRFxcdTA0RkZcXHUwNTAxXFx1MDUwM1xcdTA1MDVcXHUwNTA3XFx1MDUwOVxcdTA1MEJcXHUwNTBEXFx1MDUwRlxcdTA1MTFcXHUwNTEzXFx1MDUxNVxcdTA1MTdcXHUwNTE5XFx1MDUxQlxcdTA1MURcXHUwNTFGXFx1MDUyMVxcdTA1MjNcXHUwNTI1XFx1MDUyN1xcdTA1MjlcXHUwNTJCXFx1MDUyRFxcdTA1MkZcXHUwNTYxLVxcdTA1ODdcXHUxM0Y4LVxcdTEzRkRcXHUxQzgwLVxcdTFDODhcXHUxRDAwLVxcdTFEMkJcXHUxRDZCLVxcdTFENzdcXHUxRDc5LVxcdTFEOUFcXHUxRTAxXFx1MUUwM1xcdTFFMDVcXHUxRTA3XFx1MUUwOVxcdTFFMEJcXHUxRTBEXFx1MUUwRlxcdTFFMTFcXHUxRTEzXFx1MUUxNVxcdTFFMTdcXHUxRTE5XFx1MUUxQlxcdTFFMURcXHUxRTFGXFx1MUUyMVxcdTFFMjNcXHUxRTI1XFx1MUUyN1xcdTFFMjlcXHUxRTJCXFx1MUUyRFxcdTFFMkZcXHUxRTMxXFx1MUUzM1xcdTFFMzVcXHUxRTM3XFx1MUUzOVxcdTFFM0JcXHUxRTNEXFx1MUUzRlxcdTFFNDFcXHUxRTQzXFx1MUU0NVxcdTFFNDdcXHUxRTQ5XFx1MUU0QlxcdTFFNERcXHUxRTRGXFx1MUU1MVxcdTFFNTNcXHUxRTU1XFx1MUU1N1xcdTFFNTlcXHUxRTVCXFx1MUU1RFxcdTFFNUZcXHUxRTYxXFx1MUU2M1xcdTFFNjVcXHUxRTY3XFx1MUU2OVxcdTFFNkJcXHUxRTZEXFx1MUU2RlxcdTFFNzFcXHUxRTczXFx1MUU3NVxcdTFFNzdcXHUxRTc5XFx1MUU3QlxcdTFFN0RcXHUxRTdGXFx1MUU4MVxcdTFFODNcXHUxRTg1XFx1MUU4N1xcdTFFODlcXHUxRThCXFx1MUU4RFxcdTFFOEZcXHUxRTkxXFx1MUU5M1xcdTFFOTUtXFx1MUU5RFxcdTFFOUZcXHUxRUExXFx1MUVBM1xcdTFFQTVcXHUxRUE3XFx1MUVBOVxcdTFFQUJcXHUxRUFEXFx1MUVBRlxcdTFFQjFcXHUxRUIzXFx1MUVCNVxcdTFFQjdcXHUxRUI5XFx1MUVCQlxcdTFFQkRcXHUxRUJGXFx1MUVDMVxcdTFFQzNcXHUxRUM1XFx1MUVDN1xcdTFFQzlcXHUxRUNCXFx1MUVDRFxcdTFFQ0ZcXHUxRUQxXFx1MUVEM1xcdTFFRDVcXHUxRUQ3XFx1MUVEOVxcdTFFREJcXHUxRUREXFx1MUVERlxcdTFFRTFcXHUxRUUzXFx1MUVFNVxcdTFFRTdcXHUxRUU5XFx1MUVFQlxcdTFFRURcXHUxRUVGXFx1MUVGMVxcdTFFRjNcXHUxRUY1XFx1MUVGN1xcdTFFRjlcXHUxRUZCXFx1MUVGRFxcdTFFRkYtXFx1MUYwN1xcdTFGMTAtXFx1MUYxNVxcdTFGMjAtXFx1MUYyN1xcdTFGMzAtXFx1MUYzN1xcdTFGNDAtXFx1MUY0NVxcdTFGNTAtXFx1MUY1N1xcdTFGNjAtXFx1MUY2N1xcdTFGNzAtXFx1MUY3RFxcdTFGODAtXFx1MUY4N1xcdTFGOTAtXFx1MUY5N1xcdTFGQTAtXFx1MUZBN1xcdTFGQjAtXFx1MUZCNFxcdTFGQjZcXHUxRkI3XFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzZcXHUxRkM3XFx1MUZEMC1cXHUxRkQzXFx1MUZENlxcdTFGRDdcXHUxRkUwLVxcdTFGRTdcXHUxRkYyLVxcdTFGRjRcXHUxRkY2XFx1MUZGN1xcdTIxMEFcXHUyMTBFXFx1MjEwRlxcdTIxMTNcXHUyMTJGXFx1MjEzNFxcdTIxMzlcXHUyMTNDXFx1MjEzRFxcdTIxNDYtXFx1MjE0OVxcdTIxNEVcXHUyMTg0XFx1MkMzMC1cXHUyQzVFXFx1MkM2MVxcdTJDNjVcXHUyQzY2XFx1MkM2OFxcdTJDNkFcXHUyQzZDXFx1MkM3MVxcdTJDNzNcXHUyQzc0XFx1MkM3Ni1cXHUyQzdCXFx1MkM4MVxcdTJDODNcXHUyQzg1XFx1MkM4N1xcdTJDODlcXHUyQzhCXFx1MkM4RFxcdTJDOEZcXHUyQzkxXFx1MkM5M1xcdTJDOTVcXHUyQzk3XFx1MkM5OVxcdTJDOUJcXHUyQzlEXFx1MkM5RlxcdTJDQTFcXHUyQ0EzXFx1MkNBNVxcdTJDQTdcXHUyQ0E5XFx1MkNBQlxcdTJDQURcXHUyQ0FGXFx1MkNCMVxcdTJDQjNcXHUyQ0I1XFx1MkNCN1xcdTJDQjlcXHUyQ0JCXFx1MkNCRFxcdTJDQkZcXHUyQ0MxXFx1MkNDM1xcdTJDQzVcXHUyQ0M3XFx1MkNDOVxcdTJDQ0JcXHUyQ0NEXFx1MkNDRlxcdTJDRDFcXHUyQ0QzXFx1MkNENVxcdTJDRDdcXHUyQ0Q5XFx1MkNEQlxcdTJDRERcXHUyQ0RGXFx1MkNFMVxcdTJDRTNcXHUyQ0U0XFx1MkNFQ1xcdTJDRUVcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHVBNjQxXFx1QTY0M1xcdUE2NDVcXHVBNjQ3XFx1QTY0OVxcdUE2NEJcXHVBNjREXFx1QTY0RlxcdUE2NTFcXHVBNjUzXFx1QTY1NVxcdUE2NTdcXHVBNjU5XFx1QTY1QlxcdUE2NURcXHVBNjVGXFx1QTY2MVxcdUE2NjNcXHVBNjY1XFx1QTY2N1xcdUE2NjlcXHVBNjZCXFx1QTY2RFxcdUE2ODFcXHVBNjgzXFx1QTY4NVxcdUE2ODdcXHVBNjg5XFx1QTY4QlxcdUE2OERcXHVBNjhGXFx1QTY5MVxcdUE2OTNcXHVBNjk1XFx1QTY5N1xcdUE2OTlcXHVBNjlCXFx1QTcyM1xcdUE3MjVcXHVBNzI3XFx1QTcyOVxcdUE3MkJcXHVBNzJEXFx1QTcyRi1cXHVBNzMxXFx1QTczM1xcdUE3MzVcXHVBNzM3XFx1QTczOVxcdUE3M0JcXHVBNzNEXFx1QTczRlxcdUE3NDFcXHVBNzQzXFx1QTc0NVxcdUE3NDdcXHVBNzQ5XFx1QTc0QlxcdUE3NERcXHVBNzRGXFx1QTc1MVxcdUE3NTNcXHVBNzU1XFx1QTc1N1xcdUE3NTlcXHVBNzVCXFx1QTc1RFxcdUE3NUZcXHVBNzYxXFx1QTc2M1xcdUE3NjVcXHVBNzY3XFx1QTc2OVxcdUE3NkJcXHVBNzZEXFx1QTc2RlxcdUE3NzEtXFx1QTc3OFxcdUE3N0FcXHVBNzdDXFx1QTc3RlxcdUE3ODFcXHVBNzgzXFx1QTc4NVxcdUE3ODdcXHVBNzhDXFx1QTc4RVxcdUE3OTFcXHVBNzkzLVxcdUE3OTVcXHVBNzk3XFx1QTc5OVxcdUE3OUJcXHVBNzlEXFx1QTc5RlxcdUE3QTFcXHVBN0EzXFx1QTdBNVxcdUE3QTdcXHVBN0E5XFx1QTdCNVxcdUE3QjdcXHVBN0ZBXFx1QUIzMC1cXHVBQjVBXFx1QUI2MC1cXHVBQjY1XFx1QUI3MC1cXHVBQkJGXFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkY0MS1cXHVGRjVBXXxcXHVEODAxW1xcdURDMjgtXFx1REM0RlxcdURDRDgtXFx1RENGQl18XFx1RDgwM1tcXHVEQ0MwLVxcdURDRjJdfFxcdUQ4MDZbXFx1RENDMC1cXHVEQ0RGXXxcXHVEODM1W1xcdURDMUEtXFx1REMzM1xcdURDNEUtXFx1REM1NFxcdURDNTYtXFx1REM2N1xcdURDODItXFx1REM5QlxcdURDQjYtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdURDQ0ZcXHVEQ0VBLVxcdUREMDNcXHVERDFFLVxcdUREMzdcXHVERDUyLVxcdURENkJcXHVERDg2LVxcdUREOUZcXHVEREJBLVxcdURERDNcXHVEREVFLVxcdURFMDdcXHVERTIyLVxcdURFM0JcXHVERTU2LVxcdURFNkZcXHVERThBLVxcdURFQTVcXHVERUMyLVxcdURFREFcXHVERURDLVxcdURFRTFcXHVERUZDLVxcdURGMTRcXHVERjE2LVxcdURGMUJcXHVERjM2LVxcdURGNEVcXHVERjUwLVxcdURGNTVcXHVERjcwLVxcdURGODhcXHVERjhBLVxcdURGOEZcXHVERkFBLVxcdURGQzJcXHVERkM0LVxcdURGQzlcXHVERkNCXXxcXHVEODNBW1xcdUREMjItXFx1REQ0M10vLFxuICBMdDogL1tcXHUwMUM1XFx1MDFDOFxcdTAxQ0JcXHUwMUYyXFx1MUY4OC1cXHUxRjhGXFx1MUY5OC1cXHUxRjlGXFx1MUZBOC1cXHUxRkFGXFx1MUZCQ1xcdTFGQ0NcXHUxRkZDXS8sXG4gIExtOiAvW1xcdTAyQjAtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3NFxcdTAzN0FcXHUwNTU5XFx1MDY0MFxcdTA2RTVcXHUwNkU2XFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDk3MVxcdTBFNDZcXHUwRUM2XFx1MTBGQ1xcdTE3RDdcXHUxODQzXFx1MUFBN1xcdTFDNzgtXFx1MUM3RFxcdTFEMkMtXFx1MUQ2QVxcdTFENzhcXHUxRDlCLVxcdTFEQkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTJDN0NcXHUyQzdEXFx1MkQ2RlxcdTJFMkZcXHUzMDA1XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwOURcXHUzMDlFXFx1MzBGQy1cXHUzMEZFXFx1QTAxNVxcdUE0RjgtXFx1QTRGRFxcdUE2MENcXHVBNjdGXFx1QTY5Q1xcdUE2OURcXHVBNzE3LVxcdUE3MUZcXHVBNzcwXFx1QTc4OFxcdUE3RjhcXHVBN0Y5XFx1QTlDRlxcdUE5RTZcXHVBQTcwXFx1QUFERFxcdUFBRjNcXHVBQUY0XFx1QUI1Qy1cXHVBQjVGXFx1RkY3MFxcdUZGOUVcXHVGRjlGXXxcXHVEODFBW1xcdURGNDAtXFx1REY0M118XFx1RDgxQltcXHVERjkzLVxcdURGOUZcXHVERkUwXS8sXG4gIExvOiAvW1xceEFBXFx4QkFcXHUwMUJCXFx1MDFDMC1cXHUwMUMzXFx1MDI5NFxcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDYzRlxcdTA2NDEtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDgwMC1cXHUwODE1XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDhCNi1cXHUwOEJEXFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcyLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzgwXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDU0LVxcdTBENTZcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDVcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwRDAtXFx1MTBGQVxcdTEwRkQtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEQ1xcdTE4MjAtXFx1MTg0MlxcdTE4NDQtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3N1xcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MjEzNS1cXHUyMTM4XFx1MkQzMC1cXHUyRDY3XFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MzAwNlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTAxNFxcdUEwMTYtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGN1xcdUE1MDAtXFx1QTYwQlxcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY2RVxcdUE2QTAtXFx1QTZFNVxcdUE3OEZcXHVBN0Y3XFx1QTdGQi1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUUwLVxcdUE5RTRcXHVBOUU3LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNkZcXHVBQTcxLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCXFx1QUFEQ1xcdUFBRTAtXFx1QUFFQVxcdUFBRjJcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjY2LVxcdUZGNkZcXHVGRjcxLVxcdUZGOURcXHVGRkEwLVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERTgwLVxcdURFOUNcXHVERUEwLVxcdURFRDBcXHVERjAwLVxcdURGMUZcXHVERjMwLVxcdURGNDBcXHVERjQyLVxcdURGNDlcXHVERjUwLVxcdURGNzVcXHVERjgwLVxcdURGOURcXHVERkEwLVxcdURGQzNcXHVERkM4LVxcdURGQ0ZdfFxcdUQ4MDFbXFx1REM1MC1cXHVEQzlEXFx1REQwMC1cXHVERDI3XFx1REQzMC1cXHVERDYzXFx1REUwMC1cXHVERjM2XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjY3XXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzYwLVxcdURDNzZcXHVEQzgwLVxcdURDOUVcXHVEQ0UwLVxcdURDRjJcXHVEQ0Y0XFx1RENGNVxcdUREMDAtXFx1REQxNVxcdUREMjAtXFx1REQzOVxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNjAtXFx1REU3Q1xcdURFODAtXFx1REU5Q1xcdURFQzAtXFx1REVDN1xcdURFQzktXFx1REVFNFxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY3MlxcdURGODAtXFx1REY5MV18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhdfFxcdUQ4MDRbXFx1REMwMy1cXHVEQzM3XFx1REM4My1cXHVEQ0FGXFx1RENEMC1cXHVEQ0U4XFx1REQwMy1cXHVERDI2XFx1REQ1MC1cXHVERDcyXFx1REQ3NlxcdUREODMtXFx1RERCMlxcdUREQzEtXFx1RERDNFxcdUREREFcXHVERERDXFx1REUwMC1cXHVERTExXFx1REUxMy1cXHVERTJCXFx1REU4MC1cXHVERTg2XFx1REU4OFxcdURFOEEtXFx1REU4RFxcdURFOEYtXFx1REU5RFxcdURFOUYtXFx1REVBOFxcdURFQjAtXFx1REVERVxcdURGMDUtXFx1REYwQ1xcdURGMEZcXHVERjEwXFx1REYxMy1cXHVERjI4XFx1REYyQS1cXHVERjMwXFx1REYzMlxcdURGMzNcXHVERjM1LVxcdURGMzlcXHVERjNEXFx1REY1MFxcdURGNUQtXFx1REY2MV18XFx1RDgwNVtcXHVEQzAwLVxcdURDMzRcXHVEQzQ3LVxcdURDNEFcXHVEQzgwLVxcdURDQUZcXHVEQ0M0XFx1RENDNVxcdURDQzdcXHVERDgwLVxcdUREQUVcXHVEREQ4LVxcdUREREJcXHVERTAwLVxcdURFMkZcXHVERTQ0XFx1REU4MC1cXHVERUFBXFx1REYwMC1cXHVERjE5XXxcXHVEODA2W1xcdURDRkZcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDdbXFx1REMwMC1cXHVEQzA4XFx1REMwQS1cXHVEQzJFXFx1REM0MFxcdURDNzItXFx1REM4Rl18XFx1RDgwOFtcXHVEQzAwLVxcdURGOTldfFxcdUQ4MDlbXFx1REM4MC1cXHVERDQzXXxbXFx1RDgwQ1xcdUQ4MUMtXFx1RDgyMFxcdUQ4NDAtXFx1RDg2OFxcdUQ4NkEtXFx1RDg2Q1xcdUQ4NkYtXFx1RDg3Ml1bXFx1REMwMC1cXHVERkZGXXxcXHVEODBEW1xcdURDMDAtXFx1REMyRV18XFx1RDgxMVtcXHVEQzAwLVxcdURFNDZdfFxcdUQ4MUFbXFx1REMwMC1cXHVERTM4XFx1REU0MC1cXHVERTVFXFx1REVEMC1cXHVERUVEXFx1REYwMC1cXHVERjJGXFx1REY2My1cXHVERjc3XFx1REY3RC1cXHVERjhGXXxcXHVEODFCW1xcdURGMDAtXFx1REY0NFxcdURGNTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4NjlbXFx1REMwMC1cXHVERUQ2XFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF0vLFxuXG4gIC8vIE51bWJlcnNcbiAgTmw6IC9bXFx1MTZFRS1cXHUxNkYwXFx1MjE2MC1cXHUyMTgyXFx1MjE4NS1cXHUyMTg4XFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzgtXFx1MzAzQVxcdUE2RTYtXFx1QTZFRl18XFx1RDgwMFtcXHVERDQwLVxcdURENzRcXHVERjQxXFx1REY0QVxcdURGRDEtXFx1REZENV18XFx1RDgwOVtcXHVEQzAwLVxcdURDNkVdLyxcbiAgTmQ6IC9bMC05XFx1MDY2MC1cXHUwNjY5XFx1MDZGMC1cXHUwNkY5XFx1MDdDMC1cXHUwN0M5XFx1MDk2Ni1cXHUwOTZGXFx1MDlFNi1cXHUwOUVGXFx1MEE2Ni1cXHUwQTZGXFx1MEFFNi1cXHUwQUVGXFx1MEI2Ni1cXHUwQjZGXFx1MEJFNi1cXHUwQkVGXFx1MEM2Ni1cXHUwQzZGXFx1MENFNi1cXHUwQ0VGXFx1MEQ2Ni1cXHUwRDZGXFx1MERFNi1cXHUwREVGXFx1MEU1MC1cXHUwRTU5XFx1MEVEMC1cXHUwRUQ5XFx1MEYyMC1cXHUwRjI5XFx1MTA0MC1cXHUxMDQ5XFx1MTA5MC1cXHUxMDk5XFx1MTdFMC1cXHUxN0U5XFx1MTgxMC1cXHUxODE5XFx1MTk0Ni1cXHUxOTRGXFx1MTlEMC1cXHUxOUQ5XFx1MUE4MC1cXHUxQTg5XFx1MUE5MC1cXHUxQTk5XFx1MUI1MC1cXHUxQjU5XFx1MUJCMC1cXHUxQkI5XFx1MUM0MC1cXHUxQzQ5XFx1MUM1MC1cXHUxQzU5XFx1QTYyMC1cXHVBNjI5XFx1QThEMC1cXHVBOEQ5XFx1QTkwMC1cXHVBOTA5XFx1QTlEMC1cXHVBOUQ5XFx1QTlGMC1cXHVBOUY5XFx1QUE1MC1cXHVBQTU5XFx1QUJGMC1cXHVBQkY5XFx1RkYxMC1cXHVGRjE5XXxcXHVEODAxW1xcdURDQTAtXFx1RENBOV18XFx1RDgwNFtcXHVEQzY2LVxcdURDNkZcXHVEQ0YwLVxcdURDRjlcXHVERDM2LVxcdUREM0ZcXHVEREQwLVxcdURERDlcXHVERUYwLVxcdURFRjldfFtcXHVEODA1XFx1RDgwN11bXFx1REM1MC1cXHVEQzU5XFx1RENEMC1cXHVEQ0Q5XFx1REU1MC1cXHVERTU5XFx1REVDMC1cXHVERUM5XFx1REYzMC1cXHVERjM5XXxcXHVEODA2W1xcdURDRTAtXFx1RENFOV18XFx1RDgxQVtcXHVERTYwLVxcdURFNjlcXHVERjUwLVxcdURGNTldfFxcdUQ4MzVbXFx1REZDRS1cXHVERkZGXXxcXHVEODNBW1xcdURENTAtXFx1REQ1OV0vLFxuXG4gIC8vIE1hcmtzXG4gIE1uOiAvW1xcdTAzMDAtXFx1MDM2RlxcdTA0ODMtXFx1MDQ4N1xcdTA1OTEtXFx1MDVCRFxcdTA1QkZcXHUwNUMxXFx1MDVDMlxcdTA1QzRcXHUwNUM1XFx1MDVDN1xcdTA2MTAtXFx1MDYxQVxcdTA2NEItXFx1MDY1RlxcdTA2NzBcXHUwNkQ2LVxcdTA2RENcXHUwNkRGLVxcdTA2RTRcXHUwNkU3XFx1MDZFOFxcdTA2RUEtXFx1MDZFRFxcdTA3MTFcXHUwNzMwLVxcdTA3NEFcXHUwN0E2LVxcdTA3QjBcXHUwN0VCLVxcdTA3RjNcXHUwODE2LVxcdTA4MTlcXHUwODFCLVxcdTA4MjNcXHUwODI1LVxcdTA4MjdcXHUwODI5LVxcdTA4MkRcXHUwODU5LVxcdTA4NUJcXHUwOEQ0LVxcdTA4RTFcXHUwOEUzLVxcdTA5MDJcXHUwOTNBXFx1MDkzQ1xcdTA5NDEtXFx1MDk0OFxcdTA5NERcXHUwOTUxLVxcdTA5NTdcXHUwOTYyXFx1MDk2M1xcdTA5ODFcXHUwOUJDXFx1MDlDMS1cXHUwOUM0XFx1MDlDRFxcdTA5RTJcXHUwOUUzXFx1MEEwMVxcdTBBMDJcXHUwQTNDXFx1MEE0MVxcdTBBNDJcXHUwQTQ3XFx1MEE0OFxcdTBBNEItXFx1MEE0RFxcdTBBNTFcXHUwQTcwXFx1MEE3MVxcdTBBNzVcXHUwQTgxXFx1MEE4MlxcdTBBQkNcXHUwQUMxLVxcdTBBQzVcXHUwQUM3XFx1MEFDOFxcdTBBQ0RcXHUwQUUyXFx1MEFFM1xcdTBCMDFcXHUwQjNDXFx1MEIzRlxcdTBCNDEtXFx1MEI0NFxcdTBCNERcXHUwQjU2XFx1MEI2MlxcdTBCNjNcXHUwQjgyXFx1MEJDMFxcdTBCQ0RcXHUwQzAwXFx1MEMzRS1cXHUwQzQwXFx1MEM0Ni1cXHUwQzQ4XFx1MEM0QS1cXHUwQzREXFx1MEM1NVxcdTBDNTZcXHUwQzYyXFx1MEM2M1xcdTBDODFcXHUwQ0JDXFx1MENCRlxcdTBDQzZcXHUwQ0NDXFx1MENDRFxcdTBDRTJcXHUwQ0UzXFx1MEQwMVxcdTBENDEtXFx1MEQ0NFxcdTBENERcXHUwRDYyXFx1MEQ2M1xcdTBEQ0FcXHUwREQyLVxcdTBERDRcXHUwREQ2XFx1MEUzMVxcdTBFMzQtXFx1MEUzQVxcdTBFNDctXFx1MEU0RVxcdTBFQjFcXHUwRUI0LVxcdTBFQjlcXHUwRUJCXFx1MEVCQ1xcdTBFQzgtXFx1MEVDRFxcdTBGMThcXHUwRjE5XFx1MEYzNVxcdTBGMzdcXHUwRjM5XFx1MEY3MS1cXHUwRjdFXFx1MEY4MC1cXHUwRjg0XFx1MEY4NlxcdTBGODdcXHUwRjhELVxcdTBGOTdcXHUwRjk5LVxcdTBGQkNcXHUwRkM2XFx1MTAyRC1cXHUxMDMwXFx1MTAzMi1cXHUxMDM3XFx1MTAzOVxcdTEwM0FcXHUxMDNEXFx1MTAzRVxcdTEwNThcXHUxMDU5XFx1MTA1RS1cXHUxMDYwXFx1MTA3MS1cXHUxMDc0XFx1MTA4MlxcdTEwODVcXHUxMDg2XFx1MTA4RFxcdTEwOURcXHUxMzVELVxcdTEzNUZcXHUxNzEyLVxcdTE3MTRcXHUxNzMyLVxcdTE3MzRcXHUxNzUyXFx1MTc1M1xcdTE3NzJcXHUxNzczXFx1MTdCNFxcdTE3QjVcXHUxN0I3LVxcdTE3QkRcXHUxN0M2XFx1MTdDOS1cXHUxN0QzXFx1MTdERFxcdTE4MEItXFx1MTgwRFxcdTE4ODVcXHUxODg2XFx1MThBOVxcdTE5MjAtXFx1MTkyMlxcdTE5MjdcXHUxOTI4XFx1MTkzMlxcdTE5MzktXFx1MTkzQlxcdTFBMTdcXHUxQTE4XFx1MUExQlxcdTFBNTZcXHUxQTU4LVxcdTFBNUVcXHUxQTYwXFx1MUE2MlxcdTFBNjUtXFx1MUE2Q1xcdTFBNzMtXFx1MUE3Q1xcdTFBN0ZcXHUxQUIwLVxcdTFBQkRcXHUxQjAwLVxcdTFCMDNcXHUxQjM0XFx1MUIzNi1cXHUxQjNBXFx1MUIzQ1xcdTFCNDJcXHUxQjZCLVxcdTFCNzNcXHUxQjgwXFx1MUI4MVxcdTFCQTItXFx1MUJBNVxcdTFCQThcXHUxQkE5XFx1MUJBQi1cXHUxQkFEXFx1MUJFNlxcdTFCRThcXHUxQkU5XFx1MUJFRFxcdTFCRUYtXFx1MUJGMVxcdTFDMkMtXFx1MUMzM1xcdTFDMzZcXHUxQzM3XFx1MUNEMC1cXHUxQ0QyXFx1MUNENC1cXHUxQ0UwXFx1MUNFMi1cXHUxQ0U4XFx1MUNFRFxcdTFDRjRcXHUxQ0Y4XFx1MUNGOVxcdTFEQzAtXFx1MURGNVxcdTFERkItXFx1MURGRlxcdTIwRDAtXFx1MjBEQ1xcdTIwRTFcXHUyMEU1LVxcdTIwRjBcXHUyQ0VGLVxcdTJDRjFcXHUyRDdGXFx1MkRFMC1cXHUyREZGXFx1MzAyQS1cXHUzMDJEXFx1MzA5OVxcdTMwOUFcXHVBNjZGXFx1QTY3NC1cXHVBNjdEXFx1QTY5RVxcdUE2OUZcXHVBNkYwXFx1QTZGMVxcdUE4MDJcXHVBODA2XFx1QTgwQlxcdUE4MjVcXHVBODI2XFx1QThDNFxcdUE4QzVcXHVBOEUwLVxcdUE4RjFcXHVBOTI2LVxcdUE5MkRcXHVBOTQ3LVxcdUE5NTFcXHVBOTgwLVxcdUE5ODJcXHVBOUIzXFx1QTlCNi1cXHVBOUI5XFx1QTlCQ1xcdUE5RTVcXHVBQTI5LVxcdUFBMkVcXHVBQTMxXFx1QUEzMlxcdUFBMzVcXHVBQTM2XFx1QUE0M1xcdUFBNENcXHVBQTdDXFx1QUFCMFxcdUFBQjItXFx1QUFCNFxcdUFBQjdcXHVBQUI4XFx1QUFCRVxcdUFBQkZcXHVBQUMxXFx1QUFFQ1xcdUFBRURcXHVBQUY2XFx1QUJFNVxcdUFCRThcXHVBQkVEXFx1RkIxRVxcdUZFMDAtXFx1RkUwRlxcdUZFMjAtXFx1RkUyRl18XFx1RDgwMFtcXHVEREZEXFx1REVFMFxcdURGNzYtXFx1REY3QV18XFx1RDgwMltcXHVERTAxLVxcdURFMDNcXHVERTA1XFx1REUwNlxcdURFMEMtXFx1REUwRlxcdURFMzgtXFx1REUzQVxcdURFM0ZcXHVERUU1XFx1REVFNl18XFx1RDgwNFtcXHVEQzAxXFx1REMzOC1cXHVEQzQ2XFx1REM3Ri1cXHVEQzgxXFx1RENCMy1cXHVEQ0I2XFx1RENCOVxcdURDQkFcXHVERDAwLVxcdUREMDJcXHVERDI3LVxcdUREMkJcXHVERDJELVxcdUREMzRcXHVERDczXFx1REQ4MFxcdUREODFcXHVEREI2LVxcdUREQkVcXHVERENBLVxcdUREQ0NcXHVERTJGLVxcdURFMzFcXHVERTM0XFx1REUzNlxcdURFMzdcXHVERTNFXFx1REVERlxcdURFRTMtXFx1REVFQVxcdURGMDBcXHVERjAxXFx1REYzQ1xcdURGNDBcXHVERjY2LVxcdURGNkNcXHVERjcwLVxcdURGNzRdfFxcdUQ4MDVbXFx1REMzOC1cXHVEQzNGXFx1REM0Mi1cXHVEQzQ0XFx1REM0NlxcdURDQjMtXFx1RENCOFxcdURDQkFcXHVEQ0JGXFx1RENDMFxcdURDQzJcXHVEQ0MzXFx1RERCMi1cXHVEREI1XFx1RERCQ1xcdUREQkRcXHVEREJGXFx1RERDMFxcdURERENcXHVEREREXFx1REUzMy1cXHVERTNBXFx1REUzRFxcdURFM0ZcXHVERTQwXFx1REVBQlxcdURFQURcXHVERUIwLVxcdURFQjVcXHVERUI3XFx1REYxRC1cXHVERjFGXFx1REYyMi1cXHVERjI1XFx1REYyNy1cXHVERjJCXXxcXHVEODA3W1xcdURDMzAtXFx1REMzNlxcdURDMzgtXFx1REMzRFxcdURDM0ZcXHVEQzkyLVxcdURDQTdcXHVEQ0FBLVxcdURDQjBcXHVEQ0IyXFx1RENCM1xcdURDQjVcXHVEQ0I2XXxcXHVEODFBW1xcdURFRjAtXFx1REVGNFxcdURGMzAtXFx1REYzNl18XFx1RDgxQltcXHVERjhGLVxcdURGOTJdfFxcdUQ4MkZbXFx1REM5RFxcdURDOUVdfFxcdUQ4MzRbXFx1REQ2Ny1cXHVERDY5XFx1REQ3Qi1cXHVERDgyXFx1REQ4NS1cXHVERDhCXFx1RERBQS1cXHVEREFEXFx1REU0Mi1cXHVERTQ0XXxcXHVEODM2W1xcdURFMDAtXFx1REUzNlxcdURFM0ItXFx1REU2Q1xcdURFNzVcXHVERTg0XFx1REU5Qi1cXHVERTlGXFx1REVBMS1cXHVERUFGXXxcXHVEODM4W1xcdURDMDAtXFx1REMwNlxcdURDMDgtXFx1REMxOFxcdURDMUItXFx1REMyMVxcdURDMjNcXHVEQzI0XFx1REMyNi1cXHVEQzJBXXxcXHVEODNBW1xcdURDRDAtXFx1RENENlxcdURENDQtXFx1REQ0QV18XFx1REI0MFtcXHVERDAwLVxcdURERUZdLyxcbiAgTWM6IC9bXFx1MDkwMy1cXHUwOTAzXXxbXFx1MDkzRS1cXHUwOTQwXXxbXFx1MDk0OS1cXHUwOTRDXXxbXFx1MDk4Mi1cXHUwOTgzXXxbXFx1MDlCRS1cXHUwOUMwXXxbXFx1MDlDNy1cXHUwOUM4XXxbXFx1MDlDQi1cXHUwOUNDXXxbXFx1MDlENy1cXHUwOUQ3XXxbXFx1MEEzRS1cXHUwQTQwXXxbXFx1MEE4My1cXHUwQTgzXXxbXFx1MEFCRS1cXHUwQUMwXXxbXFx1MEFDOS1cXHUwQUM5XXxbXFx1MEFDQi1cXHUwQUNDXXxbXFx1MEIwMi1cXHUwQjAzXXxbXFx1MEIzRS1cXHUwQjNFXXxbXFx1MEI0MC1cXHUwQjQwXXxbXFx1MEI0Ny1cXHUwQjQ4XXxbXFx1MEI0Qi1cXHUwQjRDXXxbXFx1MEI1Ny1cXHUwQjU3XXxbXFx1MEI4My1cXHUwQjgzXXxbXFx1MEJCRS1cXHUwQkJGXXxbXFx1MEJDMS1cXHUwQkMyXXxbXFx1MEJDNi1cXHUwQkM4XXxbXFx1MEJDQS1cXHUwQkNDXXxbXFx1MEJENy1cXHUwQkQ3XXxbXFx1MEMwMS1cXHUwQzAzXXxbXFx1MEM0MS1cXHUwQzQ0XXxbXFx1MEM4Mi1cXHUwQzgzXXxbXFx1MENCRS1cXHUwQ0JFXXxbXFx1MENDMC1cXHUwQ0M0XXxbXFx1MENDNy1cXHUwQ0M4XXxbXFx1MENDQS1cXHUwQ0NCXXxbXFx1MENENS1cXHUwQ0Q2XXxbXFx1MEQwMi1cXHUwRDAzXXxbXFx1MEQzRS1cXHUwRDQwXXxbXFx1MEQ0Ni1cXHUwRDQ4XXxbXFx1MEQ0QS1cXHUwRDRDXXxbXFx1MEQ1Ny1cXHUwRDU3XXxbXFx1MEYzRS1cXHUwRjNGXXxbXFx1MEY3Ri1cXHUwRjdGXS8sXG5cbiAgLy8gUHVuY3R1YXRpb24sIENvbm5lY3RvclxuICBQYzogL1tfXFx1MjAzRlxcdTIwNDBcXHUyMDU0XFx1RkUzM1xcdUZFMzRcXHVGRTRELVxcdUZFNEZcXHVGRjNGXS8sXG5cbiAgLy8gU2VwYXJhdG9yLCBTcGFjZVxuICBaczogL1sgXFx4QTBcXHUxNjgwXFx1MjAwMC1cXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXS8sXG5cbiAgLy8gVGhlc2UgdHdvIGFyZSBub3QgcmVhbCBVbmljb2RlIGNhdGVnb3JpZXMsIGJ1dCBvdXIgdXNlZnVsIGZvciBPaG0uXG4gIC8vIEwgaXMgYSBjb21iaW5hdGlvbiBvZiBhbGwgdGhlIGxldHRlciBjYXRlZ29yaWVzLlxuICAvLyBMdG1vIGlzIGEgY29tYmluYXRpb24gb2YgTHQsIExtLCBhbmQgTG8uXG4gIEw6IC9bQS1aYS16XFx4QUFcXHhCNVxceEJBXFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxceEY4LVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3QS1cXHUwMzdEXFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RS1cXHUwM0ExXFx1MDNBMy1cXHUwM0Y1XFx1MDNGNy1cXHUwNDgxXFx1MDQ4QS1cXHUwNTJGXFx1MDUzMS1cXHUwNTU2XFx1MDU1OVxcdTA1NjEtXFx1MDU4N1xcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzEtXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NlxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVDNlxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0Q3XFx1MTdEQ1xcdTE4MjAtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQUE3XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDN0RcXHUxQzgwLVxcdTFDODhcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTFEMDAtXFx1MURCRlxcdTFFMDAtXFx1MUYxNVxcdTFGMTgtXFx1MUYxRFxcdTFGMjAtXFx1MUY0NVxcdTFGNDgtXFx1MUY0RFxcdTFGNTAtXFx1MUY1N1xcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUYtXFx1MUY3RFxcdTFGODAtXFx1MUZCNFxcdTFGQjYtXFx1MUZCQ1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2LVxcdTFGQ0NcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2LVxcdTFGREJcXHUxRkUwLVxcdTFGRUNcXHUxRkYyLVxcdTFGRjRcXHUxRkY2LVxcdTFGRkNcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTIxMDJcXHUyMTA3XFx1MjEwQS1cXHUyMTEzXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMkYtXFx1MjEzOVxcdTIxM0MtXFx1MjEzRlxcdTIxNDUtXFx1MjE0OVxcdTIxNEVcXHUyMTgzXFx1MjE4NFxcdTJDMDAtXFx1MkMyRVxcdTJDMzAtXFx1MkM1RVxcdTJDNjAtXFx1MkNFNFxcdTJDRUItXFx1MkNFRVxcdTJDRjJcXHUyQ0YzXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHUyRDMwLVxcdTJENjdcXHUyRDZGXFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MkUyRlxcdTMwMDVcXHUzMDA2XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NDAtXFx1QTY2RVxcdUE2N0YtXFx1QTY5RFxcdUE2QTAtXFx1QTZFNVxcdUE3MTctXFx1QTcxRlxcdUE3MjItXFx1QTc4OFxcdUE3OEItXFx1QTdBRVxcdUE3QjAtXFx1QTdCN1xcdUE3RjctXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlDRlxcdUE5RTAtXFx1QTlFNFxcdUE5RTYtXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI2NVxcdUFCNzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzAwLVxcdURDOURcXHVEQ0IwLVxcdURDRDNcXHVEQ0Q4LVxcdURDRkJcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OFxcdURDODAtXFx1RENCMlxcdURDQzAtXFx1RENGMl18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENBMC1cXHVEQ0RGXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjQwLVxcdURGNDNcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MFxcdURGOTMtXFx1REY5RlxcdURGRTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4MzVbXFx1REMwMC1cXHVEQzU0XFx1REM1Ni1cXHVEQzlDXFx1REM5RVxcdURDOUZcXHVEQ0EyXFx1RENBNVxcdURDQTZcXHVEQ0E5LVxcdURDQUNcXHVEQ0FFLVxcdURDQjlcXHVEQ0JCXFx1RENCRC1cXHVEQ0MzXFx1RENDNS1cXHVERDA1XFx1REQwNy1cXHVERDBBXFx1REQwRC1cXHVERDE0XFx1REQxNi1cXHVERDFDXFx1REQxRS1cXHVERDM5XFx1REQzQi1cXHVERDNFXFx1REQ0MC1cXHVERDQ0XFx1REQ0NlxcdURENEEtXFx1REQ1MFxcdURENTItXFx1REVBNVxcdURFQTgtXFx1REVDMFxcdURFQzItXFx1REVEQVxcdURFREMtXFx1REVGQVxcdURFRkMtXFx1REYxNFxcdURGMTYtXFx1REYzNFxcdURGMzYtXFx1REY0RVxcdURGNTAtXFx1REY2RVxcdURGNzAtXFx1REY4OFxcdURGOEEtXFx1REZBOFxcdURGQUEtXFx1REZDMlxcdURGQzQtXFx1REZDQl18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRcXHVERDAwLVxcdURENDNdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS8sXG4gIEx0bW86IC9bXFx1MDFDNVxcdTAxQzhcXHUwMUNCXFx1MDFGMlxcdTFGODgtXFx1MUY4RlxcdTFGOTgtXFx1MUY5RlxcdTFGQTgtXFx1MUZBRlxcdTFGQkNcXHUxRkNDXFx1MUZGQ118W1xcdTAyQjAtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3NFxcdTAzN0FcXHUwNTU5XFx1MDY0MFxcdTA2RTVcXHUwNkU2XFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDk3MVxcdTBFNDZcXHUwRUM2XFx1MTBGQ1xcdTE3RDdcXHUxODQzXFx1MUFBN1xcdTFDNzgtXFx1MUM3RFxcdTFEMkMtXFx1MUQ2QVxcdTFENzhcXHUxRDlCLVxcdTFEQkZcXHUyMDcxXFx1MjA3RlxcdTIwOTAtXFx1MjA5Q1xcdTJDN0NcXHUyQzdEXFx1MkQ2RlxcdTJFMkZcXHUzMDA1XFx1MzAzMS1cXHUzMDM1XFx1MzAzQlxcdTMwOURcXHUzMDlFXFx1MzBGQy1cXHUzMEZFXFx1QTAxNVxcdUE0RjgtXFx1QTRGRFxcdUE2MENcXHVBNjdGXFx1QTY5Q1xcdUE2OURcXHVBNzE3LVxcdUE3MUZcXHVBNzcwXFx1QTc4OFxcdUE3RjhcXHVBN0Y5XFx1QTlDRlxcdUE5RTZcXHVBQTcwXFx1QUFERFxcdUFBRjNcXHVBQUY0XFx1QUI1Qy1cXHVBQjVGXFx1RkY3MFxcdUZGOUVcXHVGRjlGXXxcXHVEODFBW1xcdURGNDAtXFx1REY0M118XFx1RDgxQltcXHVERjkzLVxcdURGOUZcXHVERkUwXXxbXFx4QUFcXHhCQVxcdTAxQkJcXHUwMUMwLVxcdTAxQzNcXHUwMjk0XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjNGXFx1MDY0MS1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwODAwLVxcdTA4MTVcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzItXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NVxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBEMC1cXHUxMEZBXFx1MTBGRC1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0RDXFx1MTgyMC1cXHUxODQyXFx1MTg0NC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzc3XFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUyMTM1LVxcdTIxMzhcXHUyRDMwLVxcdTJENjdcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUzMDA2XFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBMDE0XFx1QTAxNi1cXHVBNDhDXFx1QTREMC1cXHVBNEY3XFx1QTUwMC1cXHVBNjBCXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjZFXFx1QTZBMC1cXHVBNkU1XFx1QTc4RlxcdUE3RjdcXHVBN0ZCLVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5RTAtXFx1QTlFNFxcdUE5RTctXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE2RlxcdUFBNzEtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREJcXHVBQURDXFx1QUFFMC1cXHVBQUVBXFx1QUFGMlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGNjYtXFx1RkY2RlxcdUZGNzEtXFx1RkY5RFxcdUZGQTAtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzUwLVxcdURDOURcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS9cbn07XG4iXSwic291cmNlUm9vdCI6IiJ9