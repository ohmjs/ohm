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
var assert = __webpack_require__(/*! ../src/common */ "./src/common.js").assert;
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
    return walkFns.map(function (walkFn) { return walkFn(thing, fn); });
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
    var parts = sig.split(/[()]/).map(trim);
    if (parts.length === 3 && parts[2] === '') {
        var name = parts[0];
        var params = [];
        if (parts[1].length > 0) {
            params = parts[1].split(',').map(trim);
        }
        if (isRestrictedIdentifier(name) && params.every(isRestrictedIdentifier)) {
            return { name: name, formals: params };
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
    var _this = this;
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
    Object.keys(this._shapes).forEach(function (k) {
        var shape = _this._shapes[k];
        _this._getChildren[k] = getWalkFn(shape);
        // A function means the arity isn't fixed, so don't put an entry in the arity map.
        if (typeof shape !== 'function') {
            _this._arities[k] = Array.isArray(shape) ? shape.length : 1;
        }
    });
    this._wrap = function (thing) { return new _this.Adapter(thing, _this); };
}
VisitorFamily.prototype.wrap = function (thing) {
    return this._wrap(thing);
};
VisitorFamily.prototype._checkActionDict = function (dict) {
    var _this = this;
    Object.keys(dict).forEach(function (k) {
        assert(k in _this._getChildren, "Unrecognized action name '" + k + "'");
        var action = dict[k];
        assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);
        if (k in _this._arities) {
            var expected = _this._arities[k];
            var actual = dict[k].length;
            assert(actual === expected, "Action '" + k + "' has the wrong arity: expected " + expected + ', got ' + actual);
        }
    });
};
VisitorFamily.prototype.addOperation = function (signature, actions) {
    var sig = parseSignature(signature);
    var name = sig.name;
    this._checkActionDict(actions);
    this.operations[name] = {
        name: name,
        formals: sig.formals,
        actions: actions
    };
    var family = this;
    this.Adapter.prototype[name] = function () {
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
var pexprs = __webpack_require__(/*! ../src/pexprs */ "./src/pexprs.js");
var MatchResult = __webpack_require__(/*! ../src/MatchResult */ "./src/MatchResult.js");
var Grammar = __webpack_require__(/*! ../src/Grammar */ "./src/Grammar.js");
var extend = __webpack_require__(/*! util-extend */ "../node_modules/util-extend/extend.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
var defaultOperation = {
    _terminal: function () {
        return this.sourceString;
    },
    _nonterminal: function (children) {
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
            var realChildren = children.filter(function (child) { return !child.isTerminal(); });
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
    _iter: function (children) {
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
    NonemptyListOf: function (first, sep, rest) {
        return [first.toAST(this.args.mapping)].concat(rest.toAST(this.args.mapping));
    },
    EmptyListOf: function () {
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
var GrammarDecl = __webpack_require__(/*! ./GrammarDecl */ "./src/GrammarDecl.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function Builder() { }
Builder.prototype = {
    currentDecl: null,
    currentRuleName: null,
    newGrammar: function (name) {
        return new GrammarDecl(name);
    },
    grammar: function (metaInfo, name, superGrammar, defaultStartRule, rules) {
        var _this = this;
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
        this.currentDecl = gDecl;
        Object.keys(rules).forEach(function (ruleName) {
            _this.currentRuleName = ruleName;
            var ruleRecipe = rules[ruleName];
            var action = ruleRecipe[0]; // define/extend/override
            var metaInfo = ruleRecipe[1];
            var description = ruleRecipe[2];
            var formals = ruleRecipe[3];
            var body = _this.fromRecipe(ruleRecipe[4]);
            var source;
            if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
                source = gDecl.source.subInterval(metaInfo.sourceInterval[0], metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
            }
            gDecl[action](ruleName, formals, body, description, source);
        });
        this.currentRuleName = this.currentDecl = null;
        return gDecl.build();
    },
    terminal: function (x) {
        return new pexprs.Terminal(x);
    },
    range: function (from, to) {
        return new pexprs.Range(from, to);
    },
    param: function (index) {
        return new pexprs.Param(index);
    },
    alt: function ( /* term1, term2, ... */) {
        var terms = [];
        for (var idx = 0; idx < arguments.length; idx++) {
            var arg = arguments[idx];
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
    seq: function ( /* factor1, factor2, ... */) {
        var factors = [];
        for (var idx = 0; idx < arguments.length; idx++) {
            var arg = arguments[idx];
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
    star: function (expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Star(expr);
    },
    plus: function (expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Plus(expr);
    },
    opt: function (expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Opt(expr);
    },
    not: function (expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Not(expr);
    },
    la: function (expr) {
        // TODO: temporary to still be able to read old recipes
        return this.lookahead(expr);
    },
    lookahead: function (expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Lookahead(expr);
    },
    lex: function (expr) {
        if (!(expr instanceof pexprs.PExpr)) {
            expr = this.fromRecipe(expr);
        }
        return new pexprs.Lex(expr);
    },
    app: function (ruleName, optParams) {
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
    splice: function (beforeTerms, afterTerms) {
        var _this = this;
        return new pexprs.Splice(this.currentDecl.superGrammar, this.currentRuleName, beforeTerms.map(function (term) { return _this.fromRecipe(term); }), afterTerms.map(function (term) { return _this.fromRecipe(term); }));
    },
    fromRecipe: function (recipe) {
        // the meta-info of 'grammar' is processed in Builder.grammar
        var result = this[recipe[0]].apply(this, recipe[0] === 'grammar' ? recipe.slice(1) : recipe.slice(2));
        var metaInfo = recipe[1];
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var Failure = __webpack_require__(/*! ./Failure */ "./src/Failure.js");
var TerminalNode = __webpack_require__(/*! ./nodes */ "./src/nodes.js").TerminalNode;
var assert = __webpack_require__(/*! ./common */ "./src/common.js").assert;
var _a = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js"), PExpr = _a.PExpr, Terminal = _a.Terminal;
var CaseInsensitiveTerminal = /** @class */ (function (_super) {
    __extends(CaseInsensitiveTerminal, _super);
    function CaseInsensitiveTerminal(param) {
        var _this = _super.call(this) || this;
        _this.obj = param;
        return _this;
    }
    CaseInsensitiveTerminal.prototype._getString = function (state) {
        var terminal = state.currentApplication().args[this.obj.index];
        assert(terminal instanceof Terminal, 'expected a Terminal expression');
        return terminal.obj;
    };
    // Implementation of the PExpr API
    CaseInsensitiveTerminal.prototype.allowsSkippingPrecedingSpace = function () {
        return true;
    };
    CaseInsensitiveTerminal.prototype.eval = function (state) {
        var inputStream = state.inputStream;
        var origPos = inputStream.pos;
        var matchStr = this._getString(state);
        if (!inputStream.matchString(matchStr, true)) {
            state.processFailure(origPos, this);
            return false;
        }
        else {
            state.pushBinding(new TerminalNode(state.grammar, matchStr), origPos);
            return true;
        }
    };
    CaseInsensitiveTerminal.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
        // Start with a example generated from the Terminal...
        var str = this.obj.generateExample(grammar, examples, inSyntacticContext, actuals).value;
        // ...and randomly switch characters to uppercase/lowercase.
        var value = '';
        for (var i = 0; i < str.length; ++i) {
            value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
        }
        return { value: value };
    };
    CaseInsensitiveTerminal.prototype.getArity = function () {
        return 1;
    };
    CaseInsensitiveTerminal.prototype.substituteParams = function (actuals) {
        return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
    };
    CaseInsensitiveTerminal.prototype.toDisplayString = function () {
        return this.obj.toDisplayString() + ' (case-insensitive)';
    };
    CaseInsensitiveTerminal.prototype.toFailure = function (grammar) {
        return new Failure(this, this.obj.toFailure(grammar) + ' (case-insensitive)', 'description');
    };
    CaseInsensitiveTerminal.prototype._isNullable = function (grammar, memo) {
        return this.obj._isNullable(grammar, memo);
    };
    return CaseInsensitiveTerminal;
}(PExpr));
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
    var failure = new Failure(this.pexpr, this.text, this.type);
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
var CaseInsensitiveTerminal = __webpack_require__(/*! ./CaseInsensitiveTerminal */ "./src/CaseInsensitiveTerminal.js");
var Matcher = __webpack_require__(/*! ./Matcher */ "./src/Matcher.js");
var Semantics = __webpack_require__(/*! ./Semantics */ "./src/Semantics.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function getSortedRuleValues(grammar) {
    return Object.keys(grammar.rules)
        .sort()
        .map(function (name) { return grammar.rules[name]; });
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
var ohmGrammar;
var buildGrammar;
// This method is called from main.js once Ohm has loaded.
Grammar.initApplicationParser = function (grammar, builderFn) {
    ohmGrammar = grammar;
    buildGrammar = builderFn;
};
Grammar.prototype = {
    matcher: function () {
        return new Matcher(this);
    },
    // Return true if the grammar is a built-in grammar, otherwise false.
    // NOTE: This might give an unexpected result if called before BuiltInRules is defined!
    isBuiltIn: function () {
        return this === Grammar.ProtoBuiltInRules || this === Grammar.BuiltInRules;
    },
    equals: function (g) {
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
        return (myRules.length === otherRules.length &&
            myRules.every(function (rule, i) {
                return (rule.description === otherRules[i].description &&
                    rule.formals.join(',') === otherRules[i].formals.join(',') &&
                    rule.body.toString() === otherRules[i].body.toString());
            }));
    },
    match: function (input, optStartApplication) {
        var m = this.matcher();
        m.replaceInputRange(0, 0, input);
        return m.match(optStartApplication);
    },
    trace: function (input, optStartApplication) {
        var m = this.matcher();
        m.replaceInputRange(0, 0, input);
        return m.trace(optStartApplication);
    },
    createSemantics: function () {
        return Semantics.createSemantics(this);
    },
    extendSemantics: function (superSemantics) {
        return Semantics.createSemantics(this, superSemantics._getSemantics());
    },
    // Check that every key in `actionDict` corresponds to a semantic action, and that it maps to
    // a function of the correct arity. If not, throw an exception.
    _checkTopDownActionDict: function (what, name, actionDict) {
        function isSpecialAction(a) {
            return a === '_iter' || a === '_terminal' || a === '_nonterminal' || a === '_default';
        }
        var problems = [];
        for (var k in actionDict) {
            var v = actionDict[k];
            if (!isSpecialAction(k) && !(k in this.rules)) {
                problems.push("'" + k + "' is not a valid semantic action for '" + this.name + "'");
            }
            else if (typeof v !== 'function') {
                problems.push("'" + k + "' must be a function in an action dictionary for '" + this.name + "'");
            }
            else {
                var actual = v.length;
                var expected = this._topDownActionArity(k);
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
            var prettyProblems = problems.map(function (problem) { return '- ' + problem; });
            var error = new Error("Found errors in the action dictionary of the '" +
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
    _topDownActionArity: function (actionName) {
        if (actionName === '_iter' || actionName === '_nonterminal' || actionName === '_default') {
            return 1;
        }
        else if (actionName === '_terminal') {
            return 0;
        }
        return this.rules[actionName].body.getArity();
    },
    _inheritsFrom: function (grammar) {
        var g = this.superGrammar;
        while (g) {
            if (g.equals(grammar, true)) {
                return true;
            }
            g = g.superGrammar;
        }
        return false;
    },
    toRecipe: function (optVarName) {
        var _this = this;
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
        Object.keys(this.rules).forEach(function (ruleName) {
            var ruleInfo = _this.rules[ruleName];
            var body = ruleInfo.body;
            var isDefinition = !_this.superGrammar || !_this.superGrammar.rules[ruleName];
            var operation;
            if (isDefinition) {
                operation = 'define';
            }
            else {
                operation = body instanceof pexprs.Extend ? 'extend' : 'override';
            }
            var metaInfo = {};
            if (ruleInfo.source && _this.source) {
                var adjusted = ruleInfo.source.relativeTo(_this.source);
                metaInfo.sourceInterval = [adjusted.startIdx, adjusted.endIdx];
            }
            var description = isDefinition ? ruleInfo.description : null;
            var bodyRecipe = body.outputRecipe(ruleInfo.formals, _this.source);
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
    toOperationActionDictionaryTemplate: function () {
        return this._toOperationOrAttributeActionDictionaryTemplate();
    },
    toAttributeActionDictionaryTemplate: function () {
        return this._toOperationOrAttributeActionDictionaryTemplate();
    },
    _toOperationOrAttributeActionDictionaryTemplate: function () {
        // TODO: add the super-grammar's templates at the right place, e.g., a case for AddExpr_plus
        // should appear next to other cases of AddExpr.
        var sb = new common.StringBuffer();
        sb.append('{');
        var first = true;
        for (var ruleName in this.rules) {
            var body = this.rules[ruleName].body;
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
    addSemanticActionTemplate: function (ruleName, body, sb) {
        sb.append(ruleName);
        sb.append(': function(');
        var arity = this._topDownActionArity(ruleName);
        sb.append(common.repeat('_', arity).join(', '));
        sb.append(') {\n');
        sb.append('  }');
    },
    // Parse a string which expresses a rule application in this grammar, and return the
    // resulting Apply node.
    parseApplication: function (str) {
        var app;
        if (str.indexOf('<') === -1) {
            // simple application
            app = new pexprs.Apply(str);
        }
        else {
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
var Grammar = __webpack_require__(/*! ./Grammar */ "./src/Grammar.js");
var InputStream = __webpack_require__(/*! ./InputStream */ "./src/InputStream.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    var ruleInfo = this.ensureSuperGrammar().rules[name];
    if (!ruleInfo) {
        throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
    }
    return ruleInfo;
};
GrammarDecl.prototype.installOverriddenOrExtendedRule = function (name, formals, body, source) {
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
GrammarDecl.prototype.install = function (name, formals, body, description, source) {
    this.rules[name] = {
        body: body.introduceParams(formals),
        formals: formals,
        description: description,
        source: source
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
    var grammar = new Grammar(this.name, this.ensureSuperGrammar(), this.rules, this.defaultStartRule);
    // TODO: change the pexpr.prototype.assert... methods to make them add
    // exceptions to an array that's provided as an arg. Then we'll be able to
    // show more than one error of the same type at a time.
    // TODO: include the offending pexpr in the errors, that way we can show
    // the part of the source that caused it.
    var grammarErrors = [];
    var grammarHasInvalidApplications = false;
    Object.keys(grammar.rules).forEach(function (ruleName) {
        var body = grammar.rules[ruleName].body;
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
        Object.keys(grammar.rules).forEach(function (ruleName) {
            var body = grammar.rules[ruleName].body;
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
    var duplicateParameterNames = common.getDuplicates(formals);
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
var Interval = __webpack_require__(/*! ./Interval */ "./src/Interval.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function InputStream(source) {
    this.source = source;
    this.pos = 0;
    this.examinedLength = 0;
}
InputStream.prototype = {
    atEnd: function () {
        var ans = this.pos === this.source.length;
        this.examinedLength = Math.max(this.examinedLength, this.pos + 1);
        return ans;
    },
    next: function () {
        var ans = this.source[this.pos++];
        this.examinedLength = Math.max(this.examinedLength, this.pos);
        return ans;
    },
    matchString: function (s, optIgnoreCase) {
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
            if (this.next() !== s[idx]) {
                return false;
            }
        }
        return true;
    },
    sourceSlice: function (startIdx, endIdx) {
        return this.source.slice(startIdx, endIdx);
    },
    interval: function (startIdx, optEndIdx) {
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
var assert = __webpack_require__(/*! ./common */ "./src/common.js").assert;
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var util = __webpack_require__(/*! ./util */ "./src/util.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function Interval(sourceString, startIdx, endIdx) {
    this.sourceString = sourceString;
    this.startIdx = startIdx;
    this.endIdx = endIdx;
}
Interval.coverage = function ( /* interval1, interval2, ... */) {
    var sourceString = arguments[0].sourceString;
    var startIdx = arguments[0].startIdx;
    var endIdx = arguments[0].endIdx;
    for (var idx = 1; idx < arguments.length; idx++) {
        var interval = arguments[idx];
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
    coverageWith: function ( /* interval1, interval2, ... */) {
        var intervals = Array.prototype.slice.call(arguments);
        intervals.push(this);
        return Interval.coverage.apply(undefined, intervals);
    },
    collapsedLeft: function () {
        return new Interval(this.sourceString, this.startIdx, this.startIdx);
    },
    collapsedRight: function () {
        return new Interval(this.sourceString, this.endIdx, this.endIdx);
    },
    getLineAndColumn: function () {
        return util.getLineAndColumn(this.sourceString, this.startIdx);
    },
    getLineAndColumnMessage: function () {
        var range = [this.startIdx, this.endIdx];
        return util.getLineAndColumnMessage(this.sourceString, this.startIdx, range);
    },
    // Returns an array of 0, 1, or 2 intervals that represents the result of the
    // interval difference operation.
    minus: function (that) {
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
    relativeTo: function (that) {
        if (this.sourceString !== that.sourceString) {
            throw errors.intervalSourcesDontMatch();
        }
        assert(this.startIdx >= that.startIdx && this.endIdx <= that.endIdx, 'other interval does not cover this one');
        return new Interval(this.sourceString, this.startIdx - that.startIdx, this.endIdx - that.startIdx);
    },
    // Returns a new Interval which contains the same contents as this one,
    // but with whitespace trimmed from both ends. (This only makes sense when
    // the input stream is a string.)
    trimmed: function () {
        var contents = this.contents;
        var startIdx = this.startIdx + contents.match(/^\s*/)[0].length;
        var endIdx = this.endIdx - contents.match(/\s*$/)[0].length;
        return new Interval(this.sourceString, startIdx, endIdx);
    },
    subInterval: function (offset, len) {
        var newStartIdx = this.startIdx + offset;
        return new Interval(this.sourceString, newStartIdx, newStartIdx + len);
    }
};
Object.defineProperties(Interval.prototype, {
    contents: {
        get: function () {
            if (this._contents === undefined) {
                this._contents = this.sourceString.slice(this.startIdx, this.endIdx);
            }
            return this._contents;
        },
        enumerable: true
    },
    length: {
        get: function () {
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var util = __webpack_require__(/*! ./util */ "./src/util.js");
var Interval = __webpack_require__(/*! ./Interval */ "./src/Interval.js");
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
            var detail = 'Expected ' + this.getExpectedText();
            return (util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail);
        });
        common.defineLazyProperty(this, 'shortMessage', function () {
            var detail = 'expected ' + this.getExpectedText();
            var errorInfo = util.getLineAndColumn(this.input, this.getRightmostFailurePosition());
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
        var matchResultWithFailures = this.matcher._match(this.startExpr, false, this.getRightmostFailurePosition());
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
    var sb = new common.StringBuffer();
    var failures = this.getRightmostFailures();
    // Filter out the fluffy failures to make the default error messages more useful
    failures = failures.filter(function (failure) { return !failure.isFluffy(); });
    for (var idx = 0; idx < failures.length; idx++) {
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
    var pos = this.getRightmostFailurePosition();
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
var InputStream = __webpack_require__(/*! ./InputStream */ "./src/InputStream.js");
var MatchResult = __webpack_require__(/*! ./MatchResult */ "./src/MatchResult.js");
var PosInfo = __webpack_require__(/*! ./PosInfo */ "./src/PosInfo.js");
var Trace = __webpack_require__(/*! ./Trace */ "./src/Trace.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    posToOffset: function (pos) {
        return pos - this._posStack[this._posStack.length - 1];
    },
    enterApplication: function (posInfo, app) {
        this._posStack.push(this.inputStream.pos);
        this._applicationStack.push(app);
        this.inLexifiedContextStack.push(false);
        posInfo.enter(app);
        this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
        this.rightmostFailurePosition = -1;
    },
    exitApplication: function (posInfo, optNode) {
        var origPos = this._posStack.pop();
        this._applicationStack.pop();
        this.inLexifiedContextStack.pop();
        posInfo.exit();
        this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, this._rightmostFailurePositionStack.pop());
        if (optNode) {
            this.pushBinding(optNode, origPos);
        }
    },
    enterLexifiedContext: function () {
        this.inLexifiedContextStack.push(true);
    },
    exitLexifiedContext: function () {
        this.inLexifiedContextStack.pop();
    },
    currentApplication: function () {
        return this._applicationStack[this._applicationStack.length - 1];
    },
    inSyntacticContext: function () {
        if (typeof this.inputStream.source !== 'string') {
            return false;
        }
        var currentApplication = this.currentApplication();
        if (currentApplication) {
            return currentApplication.isSyntactic() && !this.inLexifiedContext();
        }
        else {
            // The top-level context is syntactic if the start application is.
            return this.startExpr.factors[0].isSyntactic();
        }
    },
    inLexifiedContext: function () {
        return this.inLexifiedContextStack[this.inLexifiedContextStack.length - 1];
    },
    skipSpaces: function () {
        this.pushFailuresInfo();
        this.eval(applySpaces);
        this.popBinding();
        this.popFailuresInfo();
        return this.inputStream.pos;
    },
    skipSpacesIfInSyntacticContext: function () {
        return this.inSyntacticContext() ? this.skipSpaces() : this.inputStream.pos;
    },
    maybeSkipSpacesBefore: function (expr) {
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
    pushBinding: function (node, origPos) {
        this._bindings.push(node);
        this._bindingOffsets.push(this.posToOffset(origPos));
    },
    popBinding: function () {
        this._bindings.pop();
        this._bindingOffsets.pop();
    },
    numBindings: function () {
        return this._bindings.length;
    },
    truncateBindings: function (newLength) {
        // Yes, this is this really faster than setting the `length` property (tested with
        // bin/es5bench on Node v6.1.0).
        while (this._bindings.length > newLength) {
            this.popBinding();
        }
    },
    getCurrentPosInfo: function () {
        return this.getPosInfo(this.inputStream.pos);
    },
    getPosInfo: function (pos) {
        var posInfo = this.memoTable[pos];
        if (!posInfo) {
            posInfo = this.memoTable[pos] = new PosInfo();
        }
        return posInfo;
    },
    processFailure: function (pos, expr) {
        this.rightmostFailurePosition = Math.max(this.rightmostFailurePosition, pos);
        if (this.recordedFailures && pos === this.positionToRecordFailures) {
            var app = this.currentApplication();
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
    recordFailure: function (failure, shouldCloneIfNew) {
        var key = failure.toKey();
        if (!this.recordedFailures[key]) {
            this.recordedFailures[key] = shouldCloneIfNew ? failure.clone() : failure;
        }
        else if (this.recordedFailures[key].isFluffy() && !failure.isFluffy()) {
            this.recordedFailures[key].clearFluffy();
        }
    },
    recordFailures: function (failures, shouldCloneIfNew) {
        var _this = this;
        Object.keys(failures).forEach(function (key) {
            _this.recordFailure(failures[key], shouldCloneIfNew);
        });
    },
    cloneRecordedFailures: function () {
        var _this = this;
        if (!this.recordedFailures) {
            return undefined;
        }
        var ans = Object.create(null);
        Object.keys(this.recordedFailures).forEach(function (key) {
            ans[key] = _this.recordedFailures[key].clone();
        });
        return ans;
    },
    getRightmostFailurePosition: function () {
        return this.rightmostFailurePosition;
    },
    _getRightmostFailureOffset: function () {
        return this.rightmostFailurePosition >= 0
            ? this.posToOffset(this.rightmostFailurePosition)
            : -1;
    },
    // Returns the memoized trace entry for `expr` at `pos`, if one exists, `null` otherwise.
    getMemoizedTraceEntry: function (pos, expr) {
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
    getTraceEntry: function (pos, expr, succeeded, bindings) {
        if (expr instanceof pexprs.Apply) {
            var app = this.currentApplication();
            var actuals = app ? app.args : [];
            expr = expr.substituteParams(actuals);
        }
        return (this.getMemoizedTraceEntry(pos, expr) ||
            new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace));
    },
    isTracing: function () {
        return !!this.trace;
    },
    hasNecessaryInfo: function (memoRec) {
        if (this.trace && !memoRec.traceEntry) {
            return false;
        }
        if (this.recordedFailures &&
            this.inputStream.pos + memoRec.rightmostFailureOffset === this.positionToRecordFailures) {
            return !!memoRec.failuresAtRightmostPosition;
        }
        return true;
    },
    useMemoizedResult: function (origPos, memoRec) {
        if (this.trace) {
            this.trace.push(memoRec.traceEntry);
        }
        var memoRecRightmostFailurePosition = this.inputStream.pos + memoRec.rightmostFailureOffset;
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
    eval: function (expr) {
        var _this = this;
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
                Object.keys(this.recordedFailures).forEach(function (key) {
                    _this.recordedFailures[key].makeFluffy();
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
    getMatchResult: function () {
        var _this = this;
        this.eval(this.startExpr);
        var rightmostFailures;
        if (this.recordedFailures) {
            rightmostFailures = Object.keys(this.recordedFailures).map(function (key) { return _this.recordedFailures[key]; });
        }
        return new MatchResult(this.matcher, this.input, this.startExpr, this._bindings[0], this._bindingOffsets[0], this.rightmostFailurePosition, rightmostFailures);
    },
    getTrace: function () {
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
    pushFailuresInfo: function () {
        this._rightmostFailurePositionStack.push(this.rightmostFailurePosition);
        this._recordedFailuresStack.push(this.recordedFailures);
    },
    popFailuresInfo: function () {
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
var MatchState = __webpack_require__(/*! ./MatchState */ "./src/MatchState.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    var currentInput = this.input;
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
    var restOfMemoTable = this.memoTable.slice(endIdx);
    this.memoTable.length = startIdx;
    for (var idx = 0; idx < str.length; idx++) {
        this.memoTable.push(undefined);
    }
    restOfMemoTable.forEach(function (posInfo) {
        this.memoTable.push(posInfo);
    }, this);
    // Invalidate memoRecs
    for (var pos = 0; pos < startIdx; pos++) {
        var posInfo = this.memoTable[pos];
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
    var state = new MatchState(this, startExpr, optPositionToRecordFailures);
    return tracing ? state.getTrace() : state.getMatchResult();
};
/*
  Returns the starting expression for this Matcher's associated grammar. If `optStartApplicationStr`
  is specified, it is a string expressing a rule application in the grammar. If not specified, the
  grammar's default start rule will be used.
*/
Matcher.prototype._getStartExpr = function (optStartApplicationStr) {
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
var extend = __webpack_require__(/*! util-extend */ "../node_modules/util-extend/extend.js");
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
    isActive: function (application) {
        return this.applicationMemoKeyStack.indexOf(application.toMemoKey()) >= 0;
    },
    enter: function (application) {
        this.applicationMemoKeyStack.push(application.toMemoKey());
    },
    exit: function () {
        this.applicationMemoKeyStack.pop();
    },
    startLeftRecursion: function (headApplication, memoRec) {
        memoRec.isLeftRecursion = true;
        memoRec.headApplication = headApplication;
        memoRec.nextLeftRecursion = this.currentLeftRecursion;
        this.currentLeftRecursion = memoRec;
        var applicationMemoKeyStack = this.applicationMemoKeyStack;
        var indexOfFirstInvolvedRule = applicationMemoKeyStack.indexOf(headApplication.toMemoKey()) + 1;
        var involvedApplicationMemoKeys = applicationMemoKeyStack.slice(indexOfFirstInvolvedRule);
        memoRec.isInvolved = function (applicationMemoKey) {
            return involvedApplicationMemoKeys.indexOf(applicationMemoKey) >= 0;
        };
        memoRec.updateInvolvedApplicationMemoKeys = function () {
            for (var idx = indexOfFirstInvolvedRule; idx < applicationMemoKeyStack.length; idx++) {
                var applicationMemoKey = applicationMemoKeyStack[idx];
                if (!this.isInvolved(applicationMemoKey)) {
                    involvedApplicationMemoKeys.push(applicationMemoKey);
                }
            }
        };
    },
    endLeftRecursion: function () {
        this.currentLeftRecursion = this.currentLeftRecursion.nextLeftRecursion;
    },
    // Note: this method doesn't get called for the "head" of a left recursion -- for LR heads,
    // the memoized result (which starts out being a failure) is always used.
    shouldUseMemoizedResult: function (memoRec) {
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
    memoize: function (memoKey, memoRec) {
        this.memo[memoKey] = memoRec;
        this.maxExaminedLength = Math.max(this.maxExaminedLength, memoRec.examinedLength);
        this.maxRightmostFailureOffset = Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
        return memoRec;
    },
    clearObsoleteEntries: function (pos, invalidatedIdx) {
        var _this = this;
        if (pos + this.maxExaminedLength <= invalidatedIdx) {
            // Optimization: none of the rule applications that were memoized here examined the
            // interval of the input that changed, so nothing has to be invalidated.
            return;
        }
        var memo = this.memo;
        this.maxExaminedLength = 0;
        this.maxRightmostFailureOffset = -1;
        Object.keys(memo).forEach(function (k) {
            var memoRec = memo[k];
            if (pos + memoRec.examinedLength > invalidatedIdx) {
                delete memo[k];
            }
            else {
                _this.maxExaminedLength = Math.max(_this.maxExaminedLength, memoRec.examinedLength);
                _this.maxRightmostFailureOffset = Math.max(_this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var InputStream = __webpack_require__(/*! ./InputStream */ "./src/InputStream.js");
var IterationNode = __webpack_require__(/*! ./nodes */ "./src/nodes.js").IterationNode;
var MatchResult = __webpack_require__(/*! ./MatchResult */ "./src/MatchResult.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var util = __webpack_require__(/*! ./util */ "./src/util.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
var globalActionStack = [];
var prototypeGrammar;
var prototypeGrammarSemantics;
// JSON is not a valid subset of JavaScript because there are two possible line terminators,
// U+2028 (line separator) and U+2029 (paragraph separator) that are allowed in JSON strings
// but not in JavaScript strings.
// jsonToJS() properly encodes those two characters in JSON so that it can seamlessly be
// inserted into JavaScript code (plus the encoded version is still valid JSON)
function jsonToJS(str) {
    var output = str.replace(/[\u2028\u2029]/g, function (char, pos, str) {
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
var Wrapper = /** @class */ (function () {
    function Wrapper(node, sourceInterval, baseInterval) {
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
    Wrapper.prototype.toString = function () {
        return '[semantics wrapper for ' + this._node.grammar.name + ']';
    };
    // This is used by ohm editor to display a node wrapper appropriately.
    Wrapper.prototype.toJSON = function () {
        return this.toString();
    };
    Wrapper.prototype._forgetMemoizedResultFor = function (attributeName) {
        // Remove the memoized attribute from the cstNode and all its children.
        delete this._node[this._semantics.attributeKeys[attributeName]];
        this.children.forEach(function (child) {
            child._forgetMemoizedResultFor(attributeName);
        });
    };
    // Returns the wrapper of the specified child node. Child wrappers are created lazily and
    // cached in the parent wrapper's `_childWrappers` instance variable.
    Wrapper.prototype.child = function (idx) {
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
    // Returns an array containing the wrappers of all of the children of the node associated
    // with this wrapper.
    Wrapper.prototype._children = function () {
        // Force the creation of all child wrappers
        for (var idx = 0; idx < this._node.numChildren(); idx++) {
            this.child(idx);
        }
        return this._childWrappers;
    };
    // Returns `true` if the CST node associated with this wrapper corresponds to an iteration
    // expression, i.e., a Kleene-*, Kleene-+, or an optional. Returns `false` otherwise.
    Wrapper.prototype.isIteration = function () {
        return this._node.isIteration();
    };
    // Returns `true` if the CST node associated with this wrapper is a terminal node, `false`
    // otherwise.
    Wrapper.prototype.isTerminal = function () {
        return this._node.isTerminal();
    };
    // Returns `true` if the CST node associated with this wrapper is a nonterminal node, `false`
    // otherwise.
    Wrapper.prototype.isNonterminal = function () {
        return this._node.isNonterminal();
    };
    // Returns `true` if the CST node associated with this wrapper is a nonterminal node
    // corresponding to a syntactic rule, `false` otherwise.
    Wrapper.prototype.isSyntactic = function () {
        return this.isNonterminal() && this._node.isSyntactic();
    };
    // Returns `true` if the CST node associated with this wrapper is a nonterminal node
    // corresponding to a lexical rule, `false` otherwise.
    Wrapper.prototype.isLexical = function () {
        return this.isNonterminal() && this._node.isLexical();
    };
    // Returns `true` if the CST node associated with this wrapper is an iterator node
    // having either one or no child (? operator), `false` otherwise.
    // Otherwise, throws an exception.
    Wrapper.prototype.isOptional = function () {
        return this._node.isOptional();
    };
    // Create a new _iter wrapper in the same semantics as this wrapper.
    Wrapper.prototype.iteration = function (optChildWrappers) {
        var childWrappers = optChildWrappers || [];
        var childNodes = childWrappers.map(function (c) { return c._node; });
        var iter = new IterationNode(this._node.grammar, childNodes, [], -1, false);
        var wrapper = this._semantics.wrap(iter, null, null);
        wrapper._childWrappers = childWrappers;
        return wrapper;
    };
    Object.defineProperty(Wrapper.prototype, "children", {
        // Returns an array containing the children of this CST node.
        get: function () {
            return this._children();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wrapper.prototype, "ctorName", {
        // Returns the name of grammar rule that created this CST node.
        get: function () {
            return this._node.ctorName;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wrapper.prototype, "interval", {
        // TODO: Remove this eventually (deprecated in v0.12).
        get: function () {
            throw new Error('The `interval` property is deprecated -- use `source` instead');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wrapper.prototype, "numChildren", {
        // Returns the number of children of this CST node.
        get: function () {
            return this._node.numChildren();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wrapper.prototype, "primitiveValue", {
        // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
        // throws an exception.
        // DEPRECATED: Use `sourceString` instead.
        get: function () {
            if (this.isTerminal()) {
                return this._node.primitiveValue;
            }
            throw new TypeError("tried to access the 'primitiveValue' attribute of a non-terminal CST node");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wrapper.prototype, "sourceString", {
        // Returns the contents of the input stream consumed by this CST node.
        get: function () {
            return this.source.contents;
        },
        enumerable: false,
        configurable: true
    });
    return Wrapper;
}());
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
    this.Wrapper = /** @class */ (function (_super) {
        __extends(Wrapper, _super);
        function Wrapper(node, sourceInterval, baseInterval) {
            var _this = _super.call(this, node, sourceInterval, baseInterval) || this;
            self.checkActionDictsIfHaventAlready();
            _this._semantics = self;
            return _this;
        }
        return Wrapper;
    }((superSemantics ? superSemantics.Wrapper : Wrapper)));
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
        for (var attributeName in this.attributes) {
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
    var name;
    for (name in this.operations) {
        this.operations[name].checkActionDict(this.grammar);
    }
    for (name in this.attributes) {
        this.attributes[name].checkActionDict(this.grammar);
    }
};
Semantics.prototype.toRecipe = function (semanticsOnly) {
    var _this = this;
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
    }
    else {
        str += '  return g.createSemantics()';
    }
    ['Operation', 'Attribute'].forEach(function (type) {
        var semanticOperations = _this[type.toLowerCase() + 's'];
        Object.keys(semanticOperations).forEach(function (name) {
            var _a = semanticOperations[name], actionDict = _a.actionDict, formals = _a.formals, builtInDefault = _a.builtInDefault;
            var signature = name;
            if (formals.length > 0) {
                signature += '(' + formals.join(', ') + ')';
            }
            var method;
            if (hasSuperSemantics(_this) && _this.super[type.toLowerCase() + 's'][name]) {
                method = 'extend' + type;
            }
            else {
                method = 'add' + type;
            }
            str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';
            var srcArray = [];
            Object.keys(actionDict).forEach(function (actionName) {
                if (actionDict[actionName] !== builtInDefault) {
                    var source = actionDict[actionName].toString().trim();
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
    var r = prototypeGrammar.match(signature, type === 'operation' ? 'OperationSignature' : 'AttributeSignature');
    if (r.failed()) {
        throw new Error(r.message);
    }
    return prototypeGrammarSemantics(r).parse();
}
function newDefaultAction(type, name, doIt) {
    return function (children) {
        var _this = this;
        var thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
        var args = thisThing.formals.map(function (formal) { return _this.args[formal]; });
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
    var typePlural = type + 's';
    var parsedNameAndFormalArgs = parseSignature(signature, type);
    var name = parsedNameAndFormalArgs.name;
    var formals = parsedNameAndFormalArgs.formals;
    // TODO: check that there are no duplicate formal arguments
    this.assertNewName(name, type);
    // Create the action dictionary for this operation / attribute that contains a `_default` action
    // which defines the default behavior of iteration, terminal, and non-terminal nodes...
    var builtInDefault = newDefaultAction(type, name, doIt);
    var realActionDict = { _default: builtInDefault };
    // ... and add in the actions supplied by the programmer, which may override some or all of the
    // default ones.
    Object.keys(actionDict).forEach(function (name) {
        realActionDict[name] = actionDict[name];
    });
    var entry = type === 'operation'
        ? new Operation(name, formals, realActionDict, builtInDefault)
        : new Attribute(name, realActionDict, builtInDefault);
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
    var typePlural = type + 's';
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
    var inheritedFormals = this[typePlural][name].formals;
    var inheritedActionDict = this[typePlural][name].actionDict;
    var newActionDict = Object.create(inheritedActionDict);
    Object.keys(actionDict).forEach(function (name) {
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
    var baseInterval = optBaseInterval || source;
    return node instanceof this.Wrapper ? node : new this.Wrapper(node, source, baseInterval);
};
// Creates a new Semantics instance for `grammar`, inheriting operations and attributes from
// `optSuperSemantics`, if it is specified. Returns a function that acts as a proxy for the new
// Semantics instance. When that function is invoked with a CST node as an argument, it returns
// a wrapper for that node which gives access to the operations and attributes provided by this
// semantics.
Semantics.createSemantics = function (grammar, optSuperSemantics) {
    var s = new Semantics(grammar, optSuperSemantics !== undefined
        ? optSuperSemantics
        : Semantics.BuiltInSemantics._getSemantics());
    // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
    // for `s`, which is the real `Semantics` instance.
    var proxy = function ASemantics(matchResult) {
        if (!(matchResult instanceof MatchResult)) {
            throw new TypeError('Semantics expected a MatchResult, but got ' +
                common.unexpectedObjToString(matchResult));
        }
        if (matchResult.failed()) {
            throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
        }
        var cst = matchResult._cst;
        if (cst.grammar !== grammar) {
            throw new Error("Cannot use a MatchResult from grammar '" +
                cst.grammar.name +
                "' with a semantics for '" +
                grammar.name +
                "'");
        }
        var inputStream = new InputStream(matchResult.input);
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
        var action = s.operations[operationOrAttributeName] || s.attributes[operationOrAttributeName];
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
        var semantic;
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
var Operation = /** @class */ (function () {
    function Operation(name, formals, actionDict, builtInDefault) {
        this.name = name;
        this.formals = formals;
        this.actionDict = actionDict;
        this.builtInDefault = builtInDefault;
    }
    Operation.prototype.checkActionDict = function (grammar) {
        grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
    };
    // Execute this operation on the CST node associated with `nodeWrapper` in the context of the
    // given Semantics instance.
    Operation.prototype.execute = function (semantics, nodeWrapper) {
        try {
            // Look for a semantic action whose name matches the node's constructor name, which is either
            // the name of a rule in the grammar, or '_terminal' (for a terminal node), or '_iter' (for an
            // iteration node). In the latter case, the action function receives a single argument, which
            // is an array containing all of the children of the CST node.
            var ctorName = nodeWrapper._node.ctorName;
            var actionFn = this.actionDict[ctorName];
            var ans = void 0;
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
    };
    // Invoke `actionFn` on the CST node that corresponds to `nodeWrapper`, in the context of
    // `semantics`. If `optPassChildrenAsArray` is truthy, `actionFn` will be called with a single
    // argument, which is an array of wrappers. Otherwise, the number of arguments to `actionFn` will
    // be equal to the number of children in the CST node.
    Operation.prototype.doAction = function (semantics, nodeWrapper, actionFn, optPassChildrenAsArray) {
        return optPassChildrenAsArray
            ? actionFn.call(nodeWrapper, nodeWrapper._children())
            : actionFn.apply(nodeWrapper, nodeWrapper._children());
    };
    return Operation;
}());
Operation.prototype.typeName = 'operation';
// ----------------- Attribute -----------------
// Attributes are Operations whose results are memoized. This means that, for any given semantics,
// the semantic action for a CST node will be invoked no more than once.
var Attribute = /** @class */ (function (_super) {
    __extends(Attribute, _super);
    function Attribute(name, actionDict, builtInDefault) {
        return _super.call(this, name, [], actionDict, builtInDefault) || this;
    }
    Attribute.prototype.execute = function (semantics, nodeWrapper) {
        var node = nodeWrapper._node;
        var key = semantics.attributeKeys[this.name];
        if (!node.hasOwnProperty(key)) {
            // The following is a super-send -- isn't JS beautiful? :/
            node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
        }
        return node[key];
    };
    return Attribute;
}(Operation));
Attribute.prototype.typeName = 'attribute';
// ----------------- Deferred initialization -----------------
util.awaitBuiltInRules(function (builtInRules) {
    var operationsAndAttributesGrammar = __webpack_require__(/*! ../dist/operations-and-attributes */ "./dist/operations-and-attributes.js");
    initBuiltInSemantics(builtInRules);
    initPrototypeParser(operationsAndAttributesGrammar); // requires BuiltInSemantics
});
function initBuiltInSemantics(builtInRules) {
    var actions = {
        empty: function () {
            return this.iteration();
        },
        nonEmpty: function (first, _, rest) {
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
        AttributeSignature: function (name) {
            return {
                name: name.parse(),
                formals: []
            };
        },
        OperationSignature: function (name, optFormals) {
            return {
                name: name.parse(),
                formals: optFormals.children.map(function (c) { return c.parse(); })[0] || []
            };
        },
        Formals: function (oparen, fs, cparen) {
            return fs.asIteration().children.map(function (c) { return c.parse(); });
        },
        name: function (first, rest) {
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
var Interval = __webpack_require__(/*! ./Interval */ "./src/Interval.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
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
var Flags = {
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
    this.bindings = bindings;
    this.children = optChildren || [];
    this.terminatingLREntry = null;
    this._flags = succeeded ? Flags.succeeded : 0;
}
// A value that can be returned from visitor functions to indicate that a
// node should not be recursed into.
Trace.prototype.SKIP = {};
Object.defineProperty(Trace.prototype, 'displayString', {
    get: function () {
        return this.expr.toDisplayString();
    }
});
// For convenience, create a getter and setter for the boolean flags in `Flags`.
Object.keys(Flags).forEach(function (name) {
    var mask = Flags[name];
    Object.defineProperty(Trace.prototype, name, {
        get: function () {
            return (this._flags & mask) !== 0;
        },
        set: function (val) {
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
    var ans = new Trace(this.input, this.pos, this.pos2, expr, this.succeeded, this.bindings, this.children);
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
    var visitor = visitorObjOrFn;
    if (typeof visitor === 'function') {
        visitor = { enter: visitor };
    }
    function _walk(node, parent, depth) {
        var recurse = true;
        if (visitor.enter) {
            if (visitor.enter.call(optThisArg, node, parent, depth) === Trace.prototype.SKIP) {
                recurse = false;
            }
        }
        if (recurse) {
            node.children.forEach(function (child) {
                _walk(child, node, depth + 1);
            });
            if (visitor.exit) {
                visitor.exit.call(optThisArg, node, parent, depth);
            }
        }
    }
    if (this.isRootNode) {
        // Don't visit the root node itself, only its children.
        this.children.forEach(function (c) {
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
    var _this = this;
    var sb = new common.StringBuffer();
    this.walk(function (node, parent, depth) {
        if (!node) {
            return _this.SKIP;
        }
        var ctorName = node.expr.constructor.name;
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
            var contents = asEscapedString(node.source.contents);
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
var extend = __webpack_require__(/*! util-extend */ "../node_modules/util-extend/extend.js");
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
exports.abstract = function (optMethodName) {
    var methodName = optMethodName || '';
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
    var memo;
    Object.defineProperty(obj, propName, {
        get: function () {
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
    var arr = [];
    while (n-- > 0) {
        arr.push(fn());
    }
    return arr;
};
exports.repeatStr = function (str, n) {
    return new Array(n + 1).join(str);
};
exports.repeat = function (x, n) {
    return exports.repeatFn(function () { return x; }, n);
};
exports.getDuplicates = function (array) {
    var duplicates = [];
    for (var idx = 0; idx < array.length; idx++) {
        var x = array[idx];
        if (array.lastIndexOf(x) !== idx && duplicates.indexOf(x) < 0) {
            duplicates.push(x);
        }
    }
    return duplicates;
};
exports.copyWithoutDuplicates = function (array) {
    var noDuplicates = [];
    array.forEach(function (entry) {
        if (noDuplicates.indexOf(entry) < 0) {
            noDuplicates.push(entry);
        }
    });
    return noDuplicates;
};
exports.isSyntactic = function (ruleName) {
    var firstChar = ruleName[0];
    return firstChar === firstChar.toUpperCase();
};
exports.isLexical = function (ruleName) {
    return !exports.isSyntactic(ruleName);
};
exports.padLeft = function (str, len, optChar) {
    var ch = optChar || ' ';
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
    var charCode = c.charCodeAt(0);
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
    var baseToString = Object.prototype.toString.call(obj);
    try {
        var typeName = void 0;
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
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
var Namespace = __webpack_require__(/*! ./Namespace */ "./src/Namespace.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
function createError(message, optInterval) {
    var e;
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
    var e = new Error();
    Object.defineProperty(e, 'message', {
        enumerable: true,
        get: function () {
            return matchFailure.message;
        }
    });
    Object.defineProperty(e, 'shortMessage', {
        enumerable: true,
        get: function () {
            return 'Expected ' + matchFailure.getExpectedText();
        }
    });
    e.interval = matchFailure.getInterval();
    return e;
}
// Undeclared grammar
function undeclaredGrammar(grammarName, namespace, interval) {
    var message = namespace
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
    var message = "Duplicate declaration for rule '" + ruleName + "' in grammar '" + grammarName + "'";
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
    var actuals = applicationStack.length > 0 ? applicationStack[applicationStack.length - 1].args : [];
    var expr = kleeneExpr.expr.substituteParams(actuals);
    var message = 'Nullable expression ' +
        expr +
        " is not allowed inside '" +
        kleeneExpr.operator +
        "' (possible infinite loop)";
    if (applicationStack.length > 0) {
        var stackTrace = applicationStack
            .map(function (app) { return new pexprs.Apply(app.ruleName, app.args); })
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
    var messages = errors.map(function (e) { return e.message; });
    return createError(['Errors:'].concat(messages).join('\n- '), errors[0].interval);
}
// ----------------- semantic -----------------
function missingSemanticAction(ctorName, name, type, stack) {
    var stackTrace = stack
        .slice(0, -1)
        .map(function (info) {
        var ans = '  ' + info[0].name + ' > ' + info[1];
        return info.length === 3 ? ans + " for '" + info[2] + "'" : ans;
    })
        .join('\n');
    stackTrace += '\n  ' + name + ' > ' + ctorName;
    var moreInfo = '';
    if (ctorName === '_iter') {
        moreInfo = [
            '\nNOTE: as of Ohm v16, there is no default action for iteration nodes — see ',
            '  https://git.io/JRwtG for details.'
        ].join('\n');
    }
    var message = [
        "Missing semantic action for '" + ctorName + "' in " + type + " '" + name + "'." + moreInfo,
        'Action stack (most recent call last):',
        stackTrace
    ].join('\n');
    var e = createError(message);
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
    incorrectArgumentType: incorrectArgumentType,
    intervalSourcesDontMatch: intervalSourcesDontMatch,
    invalidConstructorCall: invalidConstructorCall,
    invalidParameter: invalidParameter,
    grammarSyntaxError: grammarSyntaxError,
    kleeneExprHasNullableOperand: kleeneExprHasNullableOperand,
    missingSemanticAction: missingSemanticAction,
    multipleSuperSplices: multipleSuperSplices,
    undeclaredGrammar: undeclaredGrammar,
    undeclaredRule: undeclaredRule,
    wrongNumberOfArguments: wrongNumberOfArguments,
    wrongNumberOfParameters: wrongNumberOfParameters,
    throwErrors: function (errors) {
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
/* global document, XMLHttpRequest */

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var Builder = __webpack_require__(/*! ./Builder */ "./src/Builder.js");
var Grammar = __webpack_require__(/*! ./Grammar */ "./src/Grammar.js");
var Namespace = __webpack_require__(/*! ./Namespace */ "./src/Namespace.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
var util = __webpack_require__(/*! ./util */ "./src/util.js");
var version = __webpack_require__(/*! ./version */ "./src/version.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// The metagrammar, i.e. the grammar for Ohm grammars. Initialized at the
// bottom of this file because loading the grammar requires Ohm itself.
var ohmGrammar;
// An object which makes it possible to stub out the document API for testing.
var documentInterface = {
    querySelector: function (sel) {
        return document.querySelector(sel);
    },
    querySelectorAll: function (sel) {
        return document.querySelectorAll(sel);
    }
};
var superSplicePlaceholder = Object.create(pexprs.PExpr.prototype);
// Check if `obj` is a DOM element.
function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
}
function isUndefined(obj) {
    return obj === void 0; // eslint-disable-line no-void
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
    }
    catch (e) { }
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
        Grammars: function (grammarIter) {
            return grammarIter.children.map(function (c) { return c.visit(); });
        },
        Grammar: function (id, s, _open, rules, _close) {
            var grammarName = id.visit();
            decl = builder.newGrammar(grammarName, namespace);
            s.child(0) && s.child(0).visit();
            rules.children.map(function (c) { return c.visit(); });
            var g = decl.build();
            g.source = this.source.trimmed();
            if (grammarName in namespace) {
                throw errors.duplicateGrammarDeclaration(g, namespace);
            }
            namespace[grammarName] = g;
            return g;
        },
        SuperGrammar: function (_, n) {
            var superGrammarName = n.visit();
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
        Rule_define: function (n, fs, d, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.children.map(function (c) { return c.visit(); })[0] || [];
            // If there is no default start rule yet, set it now. This must be done before visiting
            // the body, because it might contain an inline rule definition.
            if (!decl.defaultStartRule && decl.ensureSuperGrammar() !== Grammar.ProtoBuiltInRules) {
                decl.withDefaultStartRule(currentRuleName);
            }
            var body = b.visit();
            var description = d.children.map(function (c) { return c.visit(); })[0];
            var source = this.source.trimmed();
            return decl.define(currentRuleName, currentRuleFormals, body, description, source);
        },
        Rule_override: function (n, fs, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.children.map(function (c) { return c.visit(); })[0] || [];
            var source = this.source.trimmed();
            decl.ensureSuperGrammarRuleForOverriding(currentRuleName, source);
            overriding = true;
            var body = b.visit();
            overriding = false;
            return decl.override(currentRuleName, currentRuleFormals, body, null, source);
        },
        Rule_extend: function (n, fs, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.children.map(function (c) { return c.visit(); })[0] || [];
            var body = b.visit();
            var source = this.source.trimmed();
            return decl.extend(currentRuleName, currentRuleFormals, body, null, source);
        },
        RuleBody: function (_, terms) {
            var args = terms.visit();
            return builder.alt.apply(builder, args).withSource(this.source);
        },
        OverrideRuleBody: function (_, terms) {
            var args = terms.visit();
            // Check if the super-splice operator (`...`) appears in the terms.
            var expansionPos = args.indexOf(superSplicePlaceholder);
            if (expansionPos >= 0) {
                var beforeTerms = args.slice(0, expansionPos);
                var afterTerms = args.slice(expansionPos + 1);
                // Ensure it appears no more than once.
                afterTerms.forEach(function (t) {
                    if (t === superSplicePlaceholder)
                        throw errors.multipleSuperSplices(t);
                });
                return new pexprs.Splice(decl.superGrammar, currentRuleName, beforeTerms, afterTerms).withSource(this.source);
            }
            else {
                return builder.alt.apply(builder, args).withSource(this.source);
            }
        },
        Formals: function (opointy, fs, cpointy) {
            return fs.visit();
        },
        Params: function (opointy, ps, cpointy) {
            return ps.visit();
        },
        Alt: function (seqs) {
            var args = seqs.visit();
            return builder.alt.apply(builder, args).withSource(this.source);
        },
        TopLevelTerm_inline: function (b, n) {
            var inlineRuleName = currentRuleName + '_' + n.visit();
            var body = b.visit();
            var source = this.source.trimmed();
            var isNewRuleDeclaration = !(decl.superGrammar && decl.superGrammar.rules[inlineRuleName]);
            if (overriding && !isNewRuleDeclaration) {
                decl.override(inlineRuleName, currentRuleFormals, body, null, source);
            }
            else {
                decl.define(inlineRuleName, currentRuleFormals, body, null, source);
            }
            var params = currentRuleFormals.map(function (formal) { return builder.app(formal); });
            return builder.app(inlineRuleName, params).withSource(body.source);
        },
        OverrideTopLevelTerm_superSplice: function (_) {
            return superSplicePlaceholder;
        },
        Seq: function (expr) {
            return builder.seq
                .apply(builder, expr.children.map(function (c) { return c.visit(); }))
                .withSource(this.source);
        },
        Iter_star: function (x, _) {
            return builder.star(x.visit()).withSource(this.source);
        },
        Iter_plus: function (x, _) {
            return builder.plus(x.visit()).withSource(this.source);
        },
        Iter_opt: function (x, _) {
            return builder.opt(x.visit()).withSource(this.source);
        },
        Pred_not: function (_, x) {
            return builder.not(x.visit()).withSource(this.source);
        },
        Pred_lookahead: function (_, x) {
            return builder.lookahead(x.visit()).withSource(this.source);
        },
        Lex_lex: function (_, x) {
            return builder.lex(x.visit()).withSource(this.source);
        },
        Base_application: function (rule, ps) {
            var params = ps.children.map(function (c) { return c.visit(); })[0] || [];
            return builder.app(rule.visit(), params).withSource(this.source);
        },
        Base_range: function (from, _, to) {
            return builder.range(from.visit(), to.visit()).withSource(this.source);
        },
        Base_terminal: function (expr) {
            return builder.terminal(expr.visit()).withSource(this.source);
        },
        Base_paren: function (open, x, close) {
            return x.visit();
        },
        ruleDescr: function (open, t, close) {
            return t.visit();
        },
        ruleDescrText: function (_) {
            return this.sourceString.trim();
        },
        caseName: function (_, space1, n, space2, end) {
            return n.visit();
        },
        name: function (first, rest) {
            return this.sourceString;
        },
        nameFirst: function (expr) { },
        nameRest: function (expr) { },
        terminal: function (open, cs, close) {
            return cs.children.map(function (c) { return c.visit(); }).join('');
        },
        oneCharTerminal: function (open, c, close) {
            return c.visit();
        },
        terminalChar: function (_) {
            return common.unescapeChar(this.sourceString);
        },
        escapeChar: function (_) {
            return this.sourceString;
        },
        NonemptyListOf: function (x, _, xs) {
            return [x.visit()].concat(xs.children.map(function (c) { return c.visit(); }));
        },
        EmptyListOf: function () {
            return [];
        },
        _terminal: function () {
            return this.sourceString;
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
    }
    else if (grammarNames.length > 1) {
        var secondGrammar = ns[grammarNames[1]];
        var interval = secondGrammar.source;
        throw new Error(util.getLineAndColumnMessage(interval.sourceString, interval.startIdx) +
            'Found more than one grammar definition -- use ohm.grammars() instead.');
    }
    return ns[grammarNames[0]]; // Return the one and only grammar.
}
function grammars(source, optNamespace) {
    var ns = Namespace.extend(Namespace.asNamespace(optNamespace));
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
    var node = optNode;
    if (isUndefined(node)) {
        var nodeList = documentInterface.querySelectorAll('script[type="text/ohm-js"]');
        if (nodeList.length !== 1) {
            throw new Error('Expected exactly one script tag with type="text/ohm-js", found ' + nodeList.length);
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
    }
    else if (typeof nodeList === 'string' ||
        (!isElement(nodeList) && !isArrayLike(nodeList))) {
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
    grammar: grammar,
    grammars: grammars,
    grammarFromScriptElement: grammarFromScriptElement,
    grammarsFromScriptElements: grammarsFromScriptElements,
    makeRecipe: makeRecipe,
    ohmGrammar: null,
    pexprs: pexprs,
    util: util,
    extras: __webpack_require__(/*! ../extras */ "./extras/index.js"),
    version: version
};
// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function (doc) {
    documentInterface = doc;
};
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var common = __webpack_require__(/*! ./common */ "./src/common.js");
// Ensures that the deprecation warning for `primitiveValue` only appears once.
var didWarnForPrimitiveValue = false;
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
var Node = /** @class */ (function () {
    function Node(grammar, ctorName, matchLength) {
        this.grammar = grammar;
        this.ctorName = ctorName;
        this.matchLength = matchLength;
    }
    Node.prototype.numChildren = function () {
        return this.children ? this.children.length : 0;
    };
    Node.prototype.childAt = function (idx) {
        if (this.children) {
            return this.children[idx];
        }
    };
    Node.prototype.indexOfChild = function (arg) {
        return this.children.indexOf(arg);
    };
    Node.prototype.hasChildren = function () {
        return this.numChildren() > 0;
    };
    Node.prototype.hasNoChildren = function () {
        return !this.hasChildren();
    };
    Node.prototype.onlyChild = function () {
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
    };
    Node.prototype.firstChild = function () {
        if (this.hasNoChildren()) {
            throw new Error('cannot get first child of a ' + this.ctorName + ' node, which has no children');
        }
        else {
            return this.childAt(0);
        }
    };
    Node.prototype.lastChild = function () {
        if (this.hasNoChildren()) {
            throw new Error('cannot get last child of a ' + this.ctorName + ' node, which has no children');
        }
        else {
            return this.childAt(this.numChildren() - 1);
        }
    };
    Node.prototype.childBefore = function (child) {
        var childIdx = this.indexOfChild(child);
        if (childIdx < 0) {
            throw new Error('Node.childBefore() called w/ an argument that is not a child');
        }
        else if (childIdx === 0) {
            throw new Error('cannot get child before first child');
        }
        else {
            return this.childAt(childIdx - 1);
        }
    };
    Node.prototype.childAfter = function (child) {
        var childIdx = this.indexOfChild(child);
        if (childIdx < 0) {
            throw new Error('Node.childAfter() called w/ an argument that is not a child');
        }
        else if (childIdx === this.numChildren() - 1) {
            throw new Error('cannot get child after last child');
        }
        else {
            return this.childAt(childIdx + 1);
        }
    };
    Node.prototype.isTerminal = function () {
        return false;
    };
    Node.prototype.isNonterminal = function () {
        return false;
    };
    Node.prototype.isIteration = function () {
        return false;
    };
    Node.prototype.isOptional = function () {
        return false;
    };
    Node.prototype.toJSON = function () {
        var _a;
        return _a = {}, _a[this.ctorName] = this.children, _a;
    };
    return Node;
}());
// Terminals
var TerminalNode = /** @class */ (function (_super) {
    __extends(TerminalNode, _super);
    function TerminalNode(grammar, value) {
        var _this = this;
        var matchLength = value ? value.length : 0;
        _this = _super.call(this, grammar, '_terminal', matchLength) || this;
        _this._value = value;
        return _this;
    }
    TerminalNode.prototype.isTerminal = function () {
        return true;
    };
    TerminalNode.prototype.toJSON = function () {
        var _a;
        return _a = {}, _a[this.ctorName] = this._value, _a;
    };
    Object.defineProperty(TerminalNode.prototype, "primitiveValue", {
        get: function () {
            if (!didWarnForPrimitiveValue) {
                // eslint-disable-next-line no-console
                console.warn('Warning: primitiveValue is deprecated and will be removed in a future version of Ohm. ' +
                    'Use sourceString instead.');
                didWarnForPrimitiveValue = true;
            }
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    return TerminalNode;
}(Node));
// Nonterminals
var NonterminalNode = /** @class */ (function (_super) {
    __extends(NonterminalNode, _super);
    function NonterminalNode(grammar, ruleName, children, childOffsets, matchLength) {
        var _this = _super.call(this, grammar, ruleName, matchLength) || this;
        _this.children = children;
        _this.childOffsets = childOffsets;
        return _this;
    }
    NonterminalNode.prototype.isNonterminal = function () {
        return true;
    };
    NonterminalNode.prototype.isLexical = function () {
        return common.isLexical(this.ctorName);
    };
    NonterminalNode.prototype.isSyntactic = function () {
        return common.isSyntactic(this.ctorName);
    };
    return NonterminalNode;
}(Node));
// Iterations
var IterationNode = /** @class */ (function (_super) {
    __extends(IterationNode, _super);
    function IterationNode(grammar, children, childOffsets, matchLength, isOptional) {
        var _this = _super.call(this, grammar, '_iter', matchLength) || this;
        _this.children = children;
        _this.childOffsets = childOffsets;
        _this.optional = isOptional;
        return _this;
    }
    IterationNode.prototype.isIteration = function () {
        return true;
    };
    IterationNode.prototype.isOptional = function () {
        return this.optional;
    };
    return IterationNode;
}(Node));
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
module.exports = {
    Node: Node,
    TerminalNode: TerminalNode,
    NonterminalNode: NonterminalNode,
    IterationNode: IterationNode
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
var util = __webpack_require__(/*! ./util */ "./src/util.js");
var BuiltInRules;
util.awaitBuiltInRules(function (g) {
    BuiltInRules = g;
});
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
var lexifyCount;
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
    for (var idx = 0; idx < this.terms.length; idx++) {
        this.terms[idx]._assertAllApplicationsAreValid(ruleName, grammar);
    }
};
pexprs.Seq.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
    for (var idx = 0; idx < this.factors.length; idx++) {
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
    var _this = this;
    var ruleInfo = grammar.rules[this.ruleName];
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
    var actual = this.args.length;
    var expected = ruleInfo.formals.length;
    if (actual !== expected) {
        throw errors.wrongNumberOfArguments(this.ruleName, expected, actual, this.source);
    }
    // ...and that all of the argument expressions only have valid applications and have arity 1.
    this.args.forEach(function (arg) {
        arg._assertAllApplicationsAreValid(ruleName, grammar);
        if (arg.getArity() !== 1) {
            throw errors.invalidParameter(_this.ruleName, arg);
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
pexprs.Extend.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    // Extend is a special case of Alt that's guaranteed to have exactly two
    // cases: [extensions, origBody].
    var actualArity = this.terms[0].getArity();
    var expectedArity = this.terms[1].getArity();
    if (actualArity !== expectedArity) {
        throw errors.inconsistentArity(ruleName, expectedArity, actualArity, this.terms[0]);
    }
};
pexprs.Seq.prototype.assertChoicesHaveUniformArity = function (ruleName) {
    for (var idx = 0; idx < this.factors.length; idx++) {
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    for (var idx = 0; idx < this.terms.length; idx++) {
        this.terms[idx].assertIteratedExprsAreNotNullable(grammar);
    }
};
pexprs.Seq.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
    for (var idx = 0; idx < this.factors.length; idx++) {
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
    this.args.forEach(function (arg) {
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
var Trace = __webpack_require__(/*! ./Trace */ "./src/Trace.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var errors = __webpack_require__(/*! ./errors */ "./src/errors.js");
var nodes = __webpack_require__(/*! ./nodes */ "./src/nodes.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
pexprs.PExpr.prototype.eval = common.abstract('eval'); // function(state) { ... }
pexprs.any.eval = function (state) {
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    var ch = inputStream.next();
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
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
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
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
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
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    var ch = inputStream.next();
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
    var ans = state.eval(this.expr);
    state.exitLexifiedContext();
    return ans;
};
pexprs.Alt.prototype.eval = function (state) {
    for (var idx = 0; idx < this.terms.length; idx++) {
        if (state.eval(this.terms[idx])) {
            return true;
        }
    }
    return false;
};
pexprs.Seq.prototype.eval = function (state) {
    for (var idx = 0; idx < this.factors.length; idx++) {
        var factor = this.factors[idx];
        if (!state.eval(factor)) {
            return false;
        }
    }
    return true;
};
pexprs.Iter.prototype.eval = function (state) {
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
    var prevPos = origPos;
    var idx;
    while (numMatches < this.maxNumMatches && state.eval(this.expr)) {
        if (inputStream.pos === prevPos) {
            throw errors.kleeneExprHasNullableOperand(this, state._applicationStack);
        }
        prevPos = inputStream.pos;
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
    var offset = state.posToOffset(origPos);
    var matchLength = 0;
    if (numMatches > 0) {
        var lastCol = cols[arity - 1];
        var lastColOffsets = colOffsets[arity - 1];
        var endOffset = lastColOffsets[lastColOffsets.length - 1] + lastCol[lastCol.length - 1].matchLength;
        offset = colOffsets[0][0];
        matchLength = endOffset - offset;
    }
    var isOptional = this instanceof pexprs.Opt;
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
pexprs.Lookahead.prototype.eval = function (state) {
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    if (state.eval(this.expr)) {
        inputStream.pos = origPos;
        return true;
    }
    else {
        return false;
    }
};
pexprs.Apply.prototype.eval = function (state) {
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
pexprs.Apply.prototype.handleCycle = function (state) {
    var posInfo = state.getCurrentPosInfo();
    var currentLeftRecursion = posInfo.currentLeftRecursion;
    var memoKey = this.toMemoKey();
    var memoRec = posInfo.memo[memoKey];
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
        origPosInfo.memoize(memoKey, memoRec); // updates origPosInfo's maxExaminedLength
    }
    else if (!currentLR || !currentLR.isInvolved(memoKey)) {
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
pexprs.Apply.prototype.evalOnce = function (expr, state) {
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    if (state.eval(expr)) {
        var arity = expr.getArity();
        var bindings = state._bindings.splice(state._bindings.length - arity, arity);
        var offsets = state._bindingOffsets.splice(state._bindingOffsets.length - arity, arity);
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
    var inputStream = state.inputStream;
    var origPos = inputStream.pos;
    var ch = inputStream.next();
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

/***/ "./src/pexprs-generateExample.js":
/*!***************************************!*\
  !*** ./src/pexprs-generateExample.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    var examplesNeeded = examples
        .filter(function (example) { return example.hasOwnProperty('examplesNeeded'); })
        .map(function (example) { return example.examplesNeeded; });
    examplesNeeded = flatten(examplesNeeded);
    var uniqueExamplesNeeded = {};
    for (var i = 0; i < examplesNeeded.length; i++) {
        var currentExampleNeeded = examplesNeeded[i];
        uniqueExamplesNeeded[currentExampleNeeded] = true;
    }
    examplesNeeded = Object.keys(uniqueExamplesNeeded);
    // A list of successfully generated examples
    var successfulExamples = examples
        .filter(function (example) { return example.hasOwnProperty('value'); })
        .map(function (item) { return item.value; });
    // This flag returns true if the system cannot generate the rule it is currently
    //   attempting to generate, regardless of whether or not it has the examples it needs.
    //   Currently, this is only used in overriding generators to prevent the system from
    //   generating examples for certain rules (e.g. 'ident').
    var needHelp = examples.some(function (item) { return item.needHelp; });
    return {
        examplesNeeded: examplesNeeded,
        successfulExamples: successfulExamples,
        needHelp: needHelp
    };
}
pexprs.any.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    return { value: String.fromCharCode(Math.floor(Math.random() * 255)) };
};
// Assumes that terminal's object is always a string
pexprs.Terminal.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
    return { value: this.obj };
};
pexprs.Range.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
    var rangeSize = this.to.charCodeAt(0) - this.from.charCodeAt(0);
    return {
        value: String.fromCharCode(this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random()))
    };
};
pexprs.Param.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    return actuals[this.index].generateExample(grammar, examples, inSyntacticContext, actuals);
};
pexprs.Alt.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    // items -> termExamples
    var termExamples = this.terms.map(function (term) {
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
pexprs.Seq.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    var factorExamples = this.factors.map(function (factor) {
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
    }
    else {
        ans.value = successfulExamples.join(inSyntacticContext ? ' ' : '');
    }
    return ans;
};
pexprs.Iter.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
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
pexprs.Not.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
    return { value: '' };
};
pexprs.Lookahead.prototype.generateExample = function (grammar, examples, inSyntacticContext) {
    return { value: '' };
};
pexprs.Lex.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    return this.expr.generateExample(grammar, examples, false, actuals);
};
pexprs.Apply.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    var ans = {};
    var ruleName = this.substituteParams(actuals).toString();
    if (!examples.hasOwnProperty(ruleName)) {
        ans.examplesNeeded = [ruleName];
    }
    else {
        var relevantExamples = examples[ruleName];
        var i = Math.floor(Math.random() * relevantExamples.length);
        ans.value = relevantExamples[i];
    }
    return ans;
};
pexprs.UnicodeChar.prototype.generateExample = function (grammar, examples, inSyntacticContext, actuals) {
    var char;
    switch (this.category) {
        case 'Lu':
            char = 'Á';
            break;
        case 'Ll':
            char = 'ŏ';
            break;
        case 'Lt':
            char = 'ǅ';
            break;
        case 'Lm':
            char = 'ˮ';
            break;
        case 'Lo':
            char = 'ƻ';
            break;
        case 'Nl':
            char = 'ↂ';
            break;
        case 'Nd':
            char = '½';
            break;
        case 'Mn':
            char = '\u0487';
            break;
        case 'Mc':
            char = 'ि';
            break;
        case 'Pc':
            char = '⁀';
            break;
        case 'Zs':
            char = '\u2001';
            break;
        case 'L':
            char = 'Á';
            break;
        case 'Ltmo':
            char = 'ǅ';
            break;
    }
    return { value: char }; // 💩
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    var arity = 0;
    for (var idx = 0; idx < this.factors.length; idx++) {
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

/***/ "./src/pexprs-getNodeTypes.js":
/*!************************************!*\
  !*** ./src/pexprs-getNodeTypes.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------
var NodeType = /** @class */ (function () {
    function NodeType() {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        this._types = new Set();
        this.add.apply(this, types);
    }
    NodeType.prototype.add = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var _a = 0, types_1 = types; _a < types_1.length; _a++) {
            var t = types_1[_a];
            this._types.add(t);
        }
    };
    NodeType.prototype.toString = function () {
        if (this._types.has('Node') || this._types.size >= 3) {
            return 'Node';
        }
        return Array.from(this._types).sort().join(' | ');
    };
    NodeType.prototype[Symbol.iterator] = function () {
        var _i, _a, t;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = this._types;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    t = _a[_i];
                    return [4 /*yield*/, t];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    return NodeType;
}());
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
pexprs.PExpr.prototype.getNodeTypes = common.abstract('getNodeTypes');
pexprs.any.getNodeTypes =
    pexprs.end.getNodeTypes =
        pexprs.Terminal.prototype.getNodeTypes =
            pexprs.Range.prototype.getNodeTypes =
                pexprs.UnicodeChar.prototype.getNodeTypes =
                    function () {
                        return [new NodeType('TerminalNode')];
                    };
pexprs.Apply.prototype.getNodeTypes = function () {
    return [new NodeType('NonterminalNode')];
};
pexprs.Param.prototype.getNodeTypes = function () {
    return [new NodeType('Node')];
};
pexprs.Alt.prototype.getNodeTypes = function () {
    var _a;
    if (this.terms.length === 0)
        return [];
    var result = this.terms[0].getNodeTypes();
    for (var _i = 0, _b = this.terms.slice(1); _i < _b.length; _i++) {
        var term = _b[_i];
        for (var _c = 0, _d = term.getNodeTypes().entries(); _c < _d.length; _c++) {
            var _e = _d[_c], i = _e[0], termType = _e[1];
            (_a = result[i]).add.apply(_a, termType);
        }
    }
    return result;
};
pexprs.Seq.prototype.getNodeTypes = function () {
    return this.factors.map(function (f) { return f.getNodeTypes(); });
};
pexprs.Iter.prototype.getNodeTypes = function () {
    // TODO(pdubroy): Should IterationNode have a type parameter?
    return this.expr.getNodeTypes().map(function (_) { return new NodeType('IterationNode'); });
};
pexprs.Not.prototype.getNodeTypes = function () {
    return [];
};
pexprs.Lookahead.prototype.getNodeTypes = pexprs.Lex.prototype.getNodeTypes = function () {
    return this.expr.getNodeTypes();
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    this.terms.forEach(function (term, idx, terms) {
        terms[idx] = term.introduceParams(formals);
    });
    return this;
};
pexprs.Seq.prototype.introduceParams = function (formals) {
    this.factors.forEach(function (factor, idx, factors) {
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
    var index = formals.indexOf(this.ruleName);
    if (index >= 0) {
        if (this.args.length > 0) {
            // TODO: Should this be supported? See issue #64.
            throw new Error('Parameterized rules cannot be passed as arguments to another rule.');
        }
        return new pexprs.Param(index).withSource(this.source);
    }
    else {
        this.args.forEach(function (arg, idx, args) {
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    return this.terms.length === 0 || this.terms.some(function (term) { return term._isNullable(grammar, memo); });
};
pexprs.Seq.prototype._isNullable = function (grammar, memo) {
    return this.factors.every(function (factor) { return factor._isNullable(grammar, memo); });
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
    var key = this.toMemoKey();
    if (!Object.prototype.hasOwnProperty.call(memo, key)) {
        var body = grammar.rules[this.ruleName].body;
        var inlined = body.substituteParams(this.args);
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    return ['alt', getMetaInfo(this, grammarInterval)].concat(this.terms.map(function (term) { return term.outputRecipe(formals, grammarInterval); }));
};
pexprs.Extend.prototype.outputRecipe = function (formals, grammarInterval) {
    var extension = this.terms[0]; // [extension, original]
    return extension.outputRecipe(formals, grammarInterval);
};
pexprs.Splice.prototype.outputRecipe = function (formals, grammarInterval) {
    var beforeTerms = this.terms.slice(0, this.expansionPos);
    var afterTerms = this.terms.slice(this.expansionPos + 1);
    return [
        'splice',
        getMetaInfo(this, grammarInterval),
        beforeTerms.map(function (term) { return term.outputRecipe(formals, grammarInterval); }),
        afterTerms.map(function (term) { return term.outputRecipe(formals, grammarInterval); })
    ];
};
pexprs.Seq.prototype.outputRecipe = function (formals, grammarInterval) {
    return ['seq', getMetaInfo(this, grammarInterval)].concat(this.factors.map(function (factor) { return factor.outputRecipe(formals, grammarInterval); }));
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
        this.args.map(function (arg) { return arg.outputRecipe(formals, grammarInterval); })
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    return new pexprs.Alt(this.terms.map(function (term) { return term.substituteParams(actuals); }));
};
pexprs.Seq.prototype.substituteParams = function (actuals) {
    return new pexprs.Seq(this.factors.map(function (factor) { return factor.substituteParams(actuals); }));
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
        var args = this.args.map(function (arg) { return arg.substituteParams(actuals); });
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    argumentNameList.forEach(function (argName) {
        count[argName] = (count[argName] || 0) + 1;
    });
    // Append subscripts ('_1', '_2', ...) to duplicate argument names.
    Object.keys(count).forEach(function (dupArgName) {
        if (count[dupArgName] <= 1) {
            return;
        }
        // This name shows up more than once, so add subscripts.
        var subscript = 1;
        argumentNameList.forEach(function (argName, idx) {
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
pexprs.Alt.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    // `termArgNameLists` is an array of arrays where each row is the
    // argument name list that corresponds to a term in this alternation.
    var termArgNameLists = this.terms.map(function (term) {
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
pexprs.Seq.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    // Generate the argument name list, without worrying about duplicates.
    var argumentNameList = [];
    this.factors.forEach(function (factor) {
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
pexprs.Iter.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    var argumentNameList = this.expr
        .toArgumentNameList(firstArgIndex, noDupCheck)
        .map(function (exprArgumentString) {
        return exprArgumentString[exprArgumentString.length - 1] === 's'
            ? exprArgumentString + 'es'
            : exprArgumentString + 's';
    });
    if (!noDupCheck) {
        resolveDuplicatedNames(argumentNameList);
    }
    return argumentNameList;
};
pexprs.Opt.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
    return this.expr.toArgumentNameList(firstArgIndex, noDupCheck).map(function (argName) {
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
        var ps = this.args.map(function (arg) { return arg.toDisplayString(); });
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
var Failure = __webpack_require__(/*! ./Failure */ "./src/Failure.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
    var description = this.expr === pexprs.any ? 'nothing' : 'not ' + this.expr.toFailure(grammar);
    return new Failure(this, description, 'description');
};
pexprs.Lookahead.prototype.toFailure = function (grammar) {
    return this.expr.toFailure(grammar);
};
pexprs.Apply.prototype.toFailure = function (grammar) {
    var description = grammar.rules[this.ruleName].description;
    if (!description) {
        var article = /^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a';
        description = article + ' ' + this.ruleName;
    }
    return new Failure(this, description, 'description');
};
pexprs.UnicodeChar.prototype.toFailure = function (grammar) {
    return new Failure(this, 'a Unicode [' + this.category + '] character', 'description');
};
pexprs.Alt.prototype.toFailure = function (grammar) {
    var fs = this.terms.map(function (t) { return t.toFailure(grammar); });
    var description = '(' + fs.join(' or ') + ')';
    return new Failure(this, description, 'description');
};
pexprs.Seq.prototype.toFailure = function (grammar) {
    var fs = this.factors.map(function (f) { return f.toFailure(grammar); });
    var description = '(' + fs.join(' ') + ')';
    return new Failure(this, description, 'description');
};
pexprs.Iter.prototype.toFailure = function (grammar) {
    var description = '(' + this.expr.toFailure(grammar) + this.operator + ')';
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
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
        : '(' + this.terms.map(function (term) { return term.toString(); }).join(' | ') + ')';
};
pexprs.Seq.prototype.toString = function () {
    return this.factors.length === 1
        ? this.factors[0].toString()
        : '(' + this.factors.map(function (factor) { return factor.toString(); }).join(' ') + ')';
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
        var ps = this.args.map(function (arg) { return arg.toString(); });
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var UnicodeCategories = __webpack_require__(/*! ../third_party/UnicodeCategories */ "./third_party/UnicodeCategories.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// General stuff
var PExpr = /** @class */ (function () {
    function PExpr() {
        if (this.constructor === PExpr) {
            throw new Error("PExpr cannot be instantiated -- it's abstract");
        }
    }
    // Set the `source` property to the interval containing the source for this expression.
    PExpr.prototype.withSource = function (interval) {
        if (interval) {
            this.source = interval.trimmed();
        }
        return this;
    };
    return PExpr;
}());
// Any
var any = Object.create(PExpr.prototype);
// End
var end = Object.create(PExpr.prototype);
// Terminals
var Terminal = /** @class */ (function (_super) {
    __extends(Terminal, _super);
    function Terminal(obj) {
        var _this = _super.call(this) || this;
        _this.obj = obj;
        return _this;
    }
    return Terminal;
}(PExpr));
// Ranges
var Range = /** @class */ (function (_super) {
    __extends(Range, _super);
    function Range(from, to) {
        var _this = _super.call(this) || this;
        _this.from = from;
        _this.to = to;
        return _this;
    }
    return Range;
}(PExpr));
// Parameters
var Param = /** @class */ (function (_super) {
    __extends(Param, _super);
    function Param(index) {
        var _this = _super.call(this) || this;
        _this.index = index;
        return _this;
    }
    return Param;
}(PExpr));
// Alternation
var Alt = /** @class */ (function (_super) {
    __extends(Alt, _super);
    function Alt(terms) {
        var _this = _super.call(this) || this;
        _this.terms = terms;
        return _this;
    }
    return Alt;
}(PExpr));
// Extend is an implementation detail of rule extension
var Extend = /** @class */ (function (_super) {
    __extends(Extend, _super);
    function Extend(superGrammar, name, body) {
        var _this = this;
        var origBody = superGrammar.rules[name].body;
        _this = _super.call(this, [body, origBody]) || this;
        _this.superGrammar = superGrammar;
        _this.name = name;
        _this.body = body;
        return _this;
    }
    return Extend;
}(Alt));
// Splice is an implementation detail of rule overriding with the `...` operator.
var Splice = /** @class */ (function (_super) {
    __extends(Splice, _super);
    function Splice(superGrammar, ruleName, beforeTerms, afterTerms) {
        var _this = this;
        var origBody = superGrammar.rules[ruleName].body;
        _this = _super.call(this, __spreadArrays(beforeTerms, [origBody], afterTerms)) || this;
        _this.superGrammar = superGrammar;
        _this.ruleName = ruleName;
        _this.expansionPos = beforeTerms.length;
        return _this;
    }
    return Splice;
}(Alt));
// Sequences
var Seq = /** @class */ (function (_super) {
    __extends(Seq, _super);
    function Seq(factors) {
        var _this = _super.call(this) || this;
        _this.factors = factors;
        return _this;
    }
    return Seq;
}(PExpr));
// Iterators and optionals
var Iter = /** @class */ (function (_super) {
    __extends(Iter, _super);
    function Iter(expr) {
        var _this = _super.call(this) || this;
        _this.expr = expr;
        return _this;
    }
    return Iter;
}(PExpr));
var Star = /** @class */ (function (_super) {
    __extends(Star, _super);
    function Star() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Star;
}(Iter));
var Plus = /** @class */ (function (_super) {
    __extends(Plus, _super);
    function Plus() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Plus;
}(Iter));
var Opt = /** @class */ (function (_super) {
    __extends(Opt, _super);
    function Opt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Opt;
}(Iter));
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
var Not = /** @class */ (function (_super) {
    __extends(Not, _super);
    function Not(expr) {
        var _this = _super.call(this) || this;
        _this.expr = expr;
        return _this;
    }
    return Not;
}(PExpr));
var Lookahead = /** @class */ (function (_super) {
    __extends(Lookahead, _super);
    function Lookahead(expr) {
        var _this = _super.call(this) || this;
        _this.expr = expr;
        return _this;
    }
    return Lookahead;
}(PExpr));
// "Lexification"
var Lex = /** @class */ (function (_super) {
    __extends(Lex, _super);
    function Lex(expr) {
        var _this = _super.call(this) || this;
        _this.expr = expr;
        return _this;
    }
    return Lex;
}(PExpr));
// Rule application
var Apply = /** @class */ (function (_super) {
    __extends(Apply, _super);
    function Apply(ruleName, args) {
        if (args === void 0) { args = []; }
        var _this = _super.call(this) || this;
        _this.ruleName = ruleName;
        _this.args = args;
        return _this;
    }
    Apply.prototype.isSyntactic = function () {
        return common.isSyntactic(this.ruleName);
    };
    // This method just caches the result of `this.toString()` in a non-enumerable property.
    Apply.prototype.toMemoKey = function () {
        if (!this._memoKey) {
            Object.defineProperty(this, '_memoKey', { value: this.toString() });
        }
        return this._memoKey;
    };
    return Apply;
}(PExpr));
// Unicode character
var UnicodeChar = /** @class */ (function (_super) {
    __extends(UnicodeChar, _super);
    function UnicodeChar(category) {
        var _this = _super.call(this) || this;
        _this.category = category;
        _this.pattern = UnicodeCategories[category];
        return _this;
    }
    return UnicodeChar;
}(PExpr));
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
__webpack_require__(/*! ./pexprs-generateExample */ "./src/pexprs-generateExample.js");
__webpack_require__(/*! ./pexprs-getArity */ "./src/pexprs-getArity.js");
__webpack_require__(/*! ./pexprs-getNodeTypes */ "./src/pexprs-getNodeTypes.js");
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
var common = __webpack_require__(/*! ./common */ "./src/common.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// Given an array of numbers `arr`, return an array of the numbers as strings,
// right-justified and padded to the same length.
function padNumbersToEqualLength(arr) {
    var maxLen = 0;
    var strings = arr.map(function (n) {
        var str = n.toString();
        maxLen = Math.max(maxLen, str.length);
        return str;
    });
    return strings.map(function (s) { return common.padLeft(s, maxLen); });
}
// Produce a new string that would be the result of copying the contents
// of the string `src` onto `dest` at offset `offest`.
function strcpy(dest, src, offset) {
    var origDestLen = dest.length;
    var start = dest.slice(0, offset);
    var end = dest.slice(offset + src.length);
    return (start + src + end).substr(0, origDestLen);
}
// Casts the underlying lineAndCol object to a formatted message string,
// highlighting `ranges`.
function lineAndColumnToMessage() {
    var ranges = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ranges[_i] = arguments[_i];
    }
    var lineAndCol = this;
    var offset = lineAndCol.offset;
    var repeatStr = common.repeatStr;
    var sb = new common.StringBuffer();
    sb.append('Line ' + lineAndCol.lineNum + ', col ' + lineAndCol.colNum + ':\n');
    // An array of the previous, current, and next line numbers as strings of equal length.
    var lineNumbers = padNumbersToEqualLength([
        lineAndCol.prevLine == null ? 0 : lineAndCol.lineNum - 1,
        lineAndCol.lineNum,
        lineAndCol.nextLine == null ? 0 : lineAndCol.lineNum + 1
    ]);
    // Helper for appending formatting input lines to the buffer.
    var appendLine = function (num, content, prefix) {
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
    var lineLen = lineAndCol.line.length;
    var indicationLine = repeatStr(' ', lineLen + 1);
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
}
// --------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------
var builtInRulesCallbacks = [];
// Since Grammar.BuiltInRules is bootstrapped, most of Ohm can't directly depend it.
// This function allows modules that do depend on the built-in rules to register a callback
// that will be called later in the initialization process.
exports.awaitBuiltInRules = function (cb) {
    builtInRulesCallbacks.push(cb);
};
exports.announceBuiltInRules = function (grammar) {
    builtInRulesCallbacks.forEach(function (cb) {
        cb(grammar);
    });
    builtInRulesCallbacks = null;
};
// Return an object with the line and column information for the given
// offset in `str`.
exports.getLineAndColumn = function (str, offset) {
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
        }
        else if (c !== '\r') {
            colNum++;
        }
    }
    // Find the end of the target line.
    var lineEndOffset = str.indexOf('\n', lineStartOffset);
    if (lineEndOffset === -1) {
        lineEndOffset = str.length;
    }
    else {
        // Get the next line.
        var nextLineEndOffset = str.indexOf('\n', lineEndOffset + 1);
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
    var line = str.slice(lineStartOffset, lineEndOffset).replace(/\r$/, '');
    return {
        offset: offset,
        lineNum: lineNum,
        colNum: colNum,
        line: line,
        prevLine: prevLine,
        nextLine: nextLine,
        toString: lineAndColumnToMessage
    };
};
// Return a nicely-formatted string describing the line and column for the
// given offset in `str` highlighting `ranges`.
exports.getLineAndColumnMessage = function (str, offset) {
    var _a;
    var ranges = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        ranges[_i - 2] = arguments[_i];
    }
    return (_a = exports.getLineAndColumn(str, offset)).toString.apply(_a, ranges);
};
exports.uniqueId = (function () {
    var idCounter = 0;
    return function (prefix) { return '' + prefix + idCounter++; };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vaG0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL29obS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vaG0vLi4vbm9kZV9tb2R1bGVzL3V0aWwtZXh0ZW5kL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9kaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwid2VicGFjazovL29obS8uL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29obS8uL2V4dHJhcy9WaXNpdG9yRmFtaWx5LmpzIiwid2VicGFjazovL29obS8uL2V4dHJhcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9leHRyYXMvc2VtYW50aWNzLXRvQVNULmpzIiwid2VicGFjazovL29obS8uL25vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0J1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLmpzIiwid2VicGFjazovL29obS8uL3NyYy9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9HcmFtbWFyLmpzIiwid2VicGFjazovL29obS8uL3NyYy9HcmFtbWFyRGVjbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvSW5wdXRTdHJlYW0uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0ludGVydmFsLmpzIiwid2VicGFjazovL29obS8uL3NyYy9NYXRjaFJlc3VsdC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hTdGF0ZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hlci5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTmFtZXNwYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9Qb3NJbmZvLmpzIiwid2VicGFjazovL29obS8uL3NyYy9TZW1hbnRpY3MuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL1RyYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvbm9kZXMuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWV2YWwuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZW5lcmF0ZUV4YW1wbGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZXRBcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWdldE5vZGVUeXBlcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWludHJvZHVjZVBhcmFtcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1zdWJzdGl0dXRlUGFyYW1zLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0LmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi90aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0UsdUJBQXVCLEVBQUU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeFRhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBYyxtQkFBTyxDQUFDLG1DQUFXO0FBQ2pDLGtCQUFrQixtQkFBTyxDQUFDLDJDQUFlO0FBQ3pDLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9KYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsZ0JBQWdC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QUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixnQ0FBZ0M7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxnQkFBZ0IsRUFBRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixnREFBZ0Q7QUFDaEQsU0FBUztBQUNULEtBQUs7QUFDTCxhQUFhLEtBQUs7QUFDbEI7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0Isb0NBQW9DO0FBQ3BDLGtCQUFrQixFQUFFO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCwyQkFBMkIsRUFBRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHdCQUF3QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLG1CQUFPLENBQUMsOEVBQW1DO0FBQ3BGO0FBQ0Esd0RBQXdEO0FBQ3hELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSwrREFBK0Qsa0JBQWtCLEVBQUU7QUFDbkY7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwrREFBK0Qsa0JBQWtCLEVBQUU7QUFDbkYsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN2c0JhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHFDQUFZO0FBQ25DLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbExhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLDBEQUFhO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsVUFBVSxFQUFFO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN4TGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0IsZ0JBQWdCLG1CQUFPLENBQUMsdUNBQWE7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGlEQUFpRCxFQUFFO0FB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIseUJBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDM1ZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGlEQUFpRCxFQUFFO0FBQ3ZGLGlDQUFpQywrQkFBK0IsRUFBRTtBQUNsRTtBQUNBO0FBQ0EsbUJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msd0NBQXdDLEVBQUU7QUFDOUUsOEJBQThCLG1CQUFtQixFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELHNCQUFzQixFQUFFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZUFBZTtBQUMzQjs7Ozs7Ozs7Ozs7OztBQzNMYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1C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QUFrQztBQUNsRSxhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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a0M7Ozs7Ozs7Ozs7OztBQ1A1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoib2htLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wib2htXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIm9obVwiXSA9IGZhY3RvcnkoKTtcbn0pKHdpbmRvdywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvbWFpbi5qc1wiKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZDtcbmZ1bmN0aW9uIGV4dGVuZChvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8IHR5cGVvZiBhZGQgIT09ICdvYmplY3QnKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufVxuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIkJ1aWx0SW5SdWxlcyB7XFxuXFxuICBhbG51bSAgKGFuIGFscGhhLW51bWVyaWMgY2hhcmFjdGVyKVxcbiAgICA9IGxldHRlclxcbiAgICB8IGRpZ2l0XFxuXFxuICBsZXR0ZXIgIChhIGxldHRlcilcXG4gICAgPSBsb3dlclxcbiAgICB8IHVwcGVyXFxuICAgIHwgdW5pY29kZUx0bW9cXG5cXG4gIGRpZ2l0ICAoYSBkaWdpdClcXG4gICAgPSBcXFwiMFxcXCIuLlxcXCI5XFxcIlxcblxcbiAgaGV4RGlnaXQgIChhIGhleGFkZWNpbWFsIGRpZ2l0KVxcbiAgICA9IGRpZ2l0XFxuICAgIHwgXFxcImFcXFwiLi5cXFwiZlxcXCJcXG4gICAgfCBcXFwiQVxcXCIuLlxcXCJGXFxcIlxcblxcbiAgTGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBOb25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgIHwgRW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcblxcbiAgTm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IGVsZW0gKHNlcCBlbGVtKSpcXG5cXG4gIEVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSAvKiBub3RoaW5nICovXFxuXFxuICBsaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IG5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgfCBlbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuXFxuICBub25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gZWxlbSAoc2VwIGVsZW0pKlxcblxcbiAgZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IC8qIG5vdGhpbmcgKi9cXG5cXG59XCJ9LFwiQnVpbHRJblJ1bGVzXCIsbnVsbCxudWxsLHtcImFsbnVtXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgsNzhdfSxcImFuIGFscGhhLW51bWVyaWMgY2hhcmFjdGVyXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjAsNzhdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MCw2Nl19LFwibGV0dGVyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzczLDc4XX0sXCJkaWdpdFwiLFtdXV1dLFwibGV0dGVyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODIsMTQyXX0sXCJhIGxldHRlclwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNywxNDJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDcsMTEyXX0sXCJsb3dlclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTksMTI0XX0sXCJ1cHBlclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTQyXX0sXCJ1bmljb2RlTHRtb1wiLFtdXV1dLFwiZGlnaXRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDYsMTc3XX0sXCJhIGRpZ2l0XCIsW10sW1wicmFuZ2VcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjksMTc3XX0sXCIwXCIsXCI5XCJdXSxcImhleERpZ2l0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgxLDI1NF19LFwiYSBoZXhhZGVjaW1hbCBkaWdpdFwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOSwyNTRdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTksMjI0XX0sXCJkaWdpdFwiLFtdXSxbXCJyYW5nZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMSwyMzldfSxcImFcIixcImZcIl0sW1wicmFuZ2VcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDYsMjU0XX0sXCJBXCIsXCJGXCJdXV0sXCJMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTgsMzM2XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjgyLDMzNl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI4MiwzMDddfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjk3LDMwMV19LDBdLFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzAzLDMwNl19LDFdXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzE0LDMzNl19LFwiRW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMjYsMzMwXX0sMF0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMzIsMzM1XX0sMV1dXV1dLFwiTm9uZW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNDAsMzg4XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzcyLDM4OF19LFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzcyLDM3Nl19LDBdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzcsMzg4XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc4LDM4Nl19LFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc4LDM4MV19LDFdLFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzgyLDM4Nl19LDBdXV1dXSxcIkVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzkyLDQzNF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQzOCw0MzhdfV1dLFwibGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDM4LDUxNl19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ2Miw1MTZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NjIsNDg3XX0sXCJub25lbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ3Nyw0ODFdfSwwXSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ4Myw0ODZdfSwxXV1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ5NCw1MTZdfSxcImVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTA2LDUxMF19LDBdLFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTEyLDUxNV19LDFdXV1dXSxcIm5vbmVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTIwLDU2OF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1Miw1NjhdfSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1Miw1NTZdfSwwXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTU3LDU2OF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1OCw1NjZdfSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1OCw1NjFdfSwxXSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2Miw1NjZdfSwwXV1dXV0sXCJlbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU3Miw2MTRdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTYsNjE2XX1dXX1dKTtcbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShbXCJncmFtbWFyXCIse1wic291cmNlXCI6XCJPaG0ge1xcblxcbiAgR3JhbW1hcnNcXG4gICAgPSBHcmFtbWFyKlxcblxcbiAgR3JhbW1hclxcbiAgICA9IGlkZW50IFN1cGVyR3JhbW1hcj8gXFxcIntcXFwiIFJ1bGUqIFxcXCJ9XFxcIlxcblxcbiAgU3VwZXJHcmFtbWFyXFxuICAgID0gXFxcIjw6XFxcIiBpZGVudFxcblxcbiAgUnVsZVxcbiAgICA9IGlkZW50IEZvcm1hbHM/IHJ1bGVEZXNjcj8gXFxcIj1cXFwiICBSdWxlQm9keSAgLS0gZGVmaW5lXFxuICAgIHwgaWRlbnQgRm9ybWFscz8gICAgICAgICAgICBcXFwiOj1cXFwiIE92ZXJyaWRlUnVsZUJvZHkgIC0tIG92ZXJyaWRlXFxuICAgIHwgaWRlbnQgRm9ybWFscz8gICAgICAgICAgICBcXFwiKz1cXFwiIFJ1bGVCb2R5ICAtLSBleHRlbmRcXG5cXG4gIFJ1bGVCb2R5XFxuICAgID0gXFxcInxcXFwiPyBOb25lbXB0eUxpc3RPZjxUb3BMZXZlbFRlcm0sIFxcXCJ8XFxcIj5cXG5cXG4gIFRvcExldmVsVGVybVxcbiAgICA9IFNlcSBjYXNlTmFtZSAgLS0gaW5saW5lXFxuICAgIHwgU2VxXFxuXFxuICBPdmVycmlkZVJ1bGVCb2R5XFxuICAgID0gXFxcInxcXFwiPyBOb25lbXB0eUxpc3RPZjxPdmVycmlkZVRvcExldmVsVGVybSwgXFxcInxcXFwiPlxcblxcbiAgT3ZlcnJpZGVUb3BMZXZlbFRlcm1cXG4gICAgPSBcXFwiLi4uXFxcIiAgLS0gc3VwZXJTcGxpY2VcXG4gICAgfCBUb3BMZXZlbFRlcm1cXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiPFxcXCIgTGlzdE9mPGlkZW50LCBcXFwiLFxcXCI+IFxcXCI+XFxcIlxcblxcbiAgUGFyYW1zXFxuICAgID0gXFxcIjxcXFwiIExpc3RPZjxTZXEsIFxcXCIsXFxcIj4gXFxcIj5cXFwiXFxuXFxuICBBbHRcXG4gICAgPSBOb25lbXB0eUxpc3RPZjxTZXEsIFxcXCJ8XFxcIj5cXG5cXG4gIFNlcVxcbiAgICA9IEl0ZXIqXFxuXFxuICBJdGVyXFxuICAgID0gUHJlZCBcXFwiKlxcXCIgIC0tIHN0YXJcXG4gICAgfCBQcmVkIFxcXCIrXFxcIiAgLS0gcGx1c1xcbiAgICB8IFByZWQgXFxcIj9cXFwiICAtLSBvcHRcXG4gICAgfCBQcmVkXFxuXFxuICBQcmVkXFxuICAgID0gXFxcIn5cXFwiIExleCAgLS0gbm90XFxuICAgIHwgXFxcIiZcXFwiIExleCAgLS0gbG9va2FoZWFkXFxuICAgIHwgTGV4XFxuXFxuICBMZXhcXG4gICAgPSBcXFwiI1xcXCIgQmFzZSAgLS0gbGV4XFxuICAgIHwgQmFzZVxcblxcbiAgQmFzZVxcbiAgICA9IGlkZW50IFBhcmFtcz8gfihydWxlRGVzY3I/IFxcXCI9XFxcIiB8IFxcXCI6PVxcXCIgfCBcXFwiKz1cXFwiKSAgLS0gYXBwbGljYXRpb25cXG4gICAgfCBvbmVDaGFyVGVybWluYWwgXFxcIi4uXFxcIiBvbmVDaGFyVGVybWluYWwgICAgICAgICAgIC0tIHJhbmdlXFxuICAgIHwgdGVybWluYWwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSB0ZXJtaW5hbFxcbiAgICB8IFxcXCIoXFxcIiBBbHQgXFxcIilcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gcGFyZW5cXG5cXG4gIHJ1bGVEZXNjciAgKGEgcnVsZSBkZXNjcmlwdGlvbilcXG4gICAgPSBcXFwiKFxcXCIgcnVsZURlc2NyVGV4dCBcXFwiKVxcXCJcXG5cXG4gIHJ1bGVEZXNjclRleHRcXG4gICAgPSAoflxcXCIpXFxcIiBhbnkpKlxcblxcbiAgY2FzZU5hbWVcXG4gICAgPSBcXFwiLS1cXFwiICh+XFxcIlxcXFxuXFxcIiBzcGFjZSkqIG5hbWUgKH5cXFwiXFxcXG5cXFwiIHNwYWNlKSogKFxcXCJcXFxcblxcXCIgfCAmXFxcIn1cXFwiKVxcblxcbiAgbmFtZSAgKGEgbmFtZSlcXG4gICAgPSBuYW1lRmlyc3QgbmFtZVJlc3QqXFxuXFxuICBuYW1lRmlyc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBsZXR0ZXJcXG5cXG4gIG5hbWVSZXN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgYWxudW1cXG5cXG4gIGlkZW50ICAoYW4gaWRlbnRpZmllcilcXG4gICAgPSBuYW1lXFxuXFxuICB0ZXJtaW5hbFxcbiAgICA9IFxcXCJcXFxcXFxcIlxcXCIgdGVybWluYWxDaGFyKiBcXFwiXFxcXFxcXCJcXFwiXFxuXFxuICBvbmVDaGFyVGVybWluYWxcXG4gICAgPSBcXFwiXFxcXFxcXCJcXFwiIHRlcm1pbmFsQ2hhciBcXFwiXFxcXFxcXCJcXFwiXFxuXFxuICB0ZXJtaW5hbENoYXJcXG4gICAgPSBlc2NhcGVDaGFyXFxuICAgIHwgflxcXCJcXFxcXFxcXFxcXCIgflxcXCJcXFxcXFxcIlxcXCIgflxcXCJcXFxcblxcXCIgYW55XFxuXFxuICBlc2NhcGVDaGFyICAoYW4gZXNjYXBlIHNlcXVlbmNlKVxcbiAgICA9IFxcXCJcXFxcXFxcXFxcXFxcXFxcXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBiYWNrc2xhc2hcXG4gICAgfCBcXFwiXFxcXFxcXFxcXFxcXFxcIlxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gZG91YmxlUXVvdGVcXG4gICAgfCBcXFwiXFxcXFxcXFxcXFxcJ1xcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gc2luZ2xlUXVvdGVcXG4gICAgfCBcXFwiXFxcXFxcXFxiXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gYmFja3NwYWNlXFxuICAgIHwgXFxcIlxcXFxcXFxcblxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGxpbmVGZWVkXFxuICAgIHwgXFxcIlxcXFxcXFxcclxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGNhcnJpYWdlUmV0dXJuXFxuICAgIHwgXFxcIlxcXFxcXFxcdFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHRhYlxcbiAgICB8IFxcXCJcXFxcXFxcXHVcXFwiIGhleERpZ2l0IGhleERpZ2l0IGhleERpZ2l0IGhleERpZ2l0ICAtLSB1bmljb2RlRXNjYXBlXFxuICAgIHwgXFxcIlxcXFxcXFxceFxcXCIgaGV4RGlnaXQgaGV4RGlnaXQgICAgICAgICAgICAgICAgICAgIC0tIGhleEVzY2FwZVxcblxcbiAgc3BhY2VcXG4gICArPSBjb21tZW50XFxuXFxuICBjb21tZW50XFxuICAgID0gXFxcIi8vXFxcIiAoflxcXCJcXFxcblxcXCIgYW55KSogJihcXFwiXFxcXG5cXFwiIHwgZW5kKSAgLS0gc2luZ2xlTGluZVxcbiAgICB8IFxcXCIvKlxcXCIgKH5cXFwiKi9cXFwiIGFueSkqIFxcXCIqL1xcXCIgIC0tIG11bHRpTGluZVxcblxcbiAgdG9rZW5zID0gdG9rZW4qXFxuXFxuICB0b2tlbiA9IGNhc2VOYW1lIHwgY29tbWVudCB8IGlkZW50IHwgb3BlcmF0b3IgfCBwdW5jdHVhdGlvbiB8IHRlcm1pbmFsIHwgYW55XFxuXFxuICBvcGVyYXRvciA9IFxcXCI8OlxcXCIgfCBcXFwiPVxcXCIgfCBcXFwiOj1cXFwiIHwgXFxcIis9XFxcIiB8IFxcXCIqXFxcIiB8IFxcXCIrXFxcIiB8IFxcXCI/XFxcIiB8IFxcXCJ+XFxcIiB8IFxcXCImXFxcIlxcblxcbiAgcHVuY3R1YXRpb24gPSBcXFwiPFxcXCIgfCBcXFwiPlxcXCIgfCBcXFwiLFxcXCIgfCBcXFwiLS1cXFwiXFxufVwifSxcIk9obVwiLG51bGwsXCJHcmFtbWFyc1wiLHtcIkdyYW1tYXJzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOSwzMl19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0LDMyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQsMzFdfSxcIkdyYW1tYXJcIixbXV1dXSxcIkdyYW1tYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNiw4M119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTAsODNdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MCw1NV19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTYsNjldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1Niw2OF19LFwiU3VwZXJHcmFtbWFyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcwLDczXX0sXCJ7XCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NCw3OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0LDc4XX0sXCJSdWxlXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwLDgzXX0sXCJ9XCJdXV0sXCJTdXBlckdyYW1tYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NywxMTZdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNiwxMTZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNiwxMTBdfSxcIjw6XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMSwxMTZdfSxcImlkZW50XCIsW11dXV0sXCJSdWxlX2RlZmluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxODFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxNzBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTM2XX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzcsMTQ1XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3LDE0NF19LFwiRm9ybWFsc1wiLFtdXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2LDE1Nl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NiwxNTVdfSxcInJ1bGVEZXNjclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTcsMTYwXX0sXCI9XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MiwxNzBdfSxcIlJ1bGVCb2R5XCIsW11dXV0sXCJSdWxlX292ZXJyaWRlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDI0OF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDIzNV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwxOTNdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NCwyMDJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTQsMjAxXX0sXCJGb3JtYWxzXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNCwyMThdfSxcIjo9XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOSwyMzVdfSxcIk92ZXJyaWRlUnVsZUJvZHlcIixbXV1dXSxcIlJ1bGVfZXh0ZW5kXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU1LDMwNV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU1LDI5NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NSwyNjBdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI2MSwyNjldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNjEsMjY4XX0sXCJGb3JtYWxzXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI4MSwyODVdfSxcIis9XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI4NiwyOTRdfSxcIlJ1bGVCb2R5XCIsW11dXV0sXCJSdWxlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIwLDMwNV19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDMwNV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwxNzBdfSxcIlJ1bGVfZGVmaW5lXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwyMzVdfSxcIlJ1bGVfb3ZlcnJpZGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU1LDI5NF19LFwiUnVsZV9leHRlbmRcIixbXV1dXSxcIlJ1bGVCb2R5XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzA5LDM2Ml19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzI0LDM2Ml19LFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMyNCwzMjhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMyNCwzMjddfSxcInxcIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMyOSwzNjJdfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM0NCwzNTZdfSxcIlRvcExldmVsVGVybVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM1OCwzNjFdfSxcInxcIl1dXV1dLFwiVG9wTGV2ZWxUZXJtX2lubGluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4NSw0MDhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4NSwzOTddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODUsMzg4XX0sXCJTZXFcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzg5LDM5N119LFwiY2FzZU5hbWVcIixbXV1dXSxcIlRvcExldmVsVGVybVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM2Niw0MThdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4NSw0MThdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODUsMzk3XX0sXCJUb3BMZXZlbFRlcm1faW5saW5lXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQxNSw0MThdfSxcIlNlcVwiLFtdXV1dLFwiT3ZlcnJpZGVSdWxlQm9keVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQyMiw0OTFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ0NSw0OTFdfSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NDUsNDQ5XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NDUsNDQ4XX0sXCJ8XCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NTAsNDkxXX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NjUsNDg1XX0sXCJPdmVycmlkZVRvcExldmVsVGVybVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ4Nyw0OTBdfSxcInxcIl1dXV1dLFwiT3ZlcnJpZGVUb3BMZXZlbFRlcm1fc3VwZXJTcGxpY2VcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjIsNTQzXX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyMiw1MjddfSxcIi4uLlwiXV0sXCJPdmVycmlkZVRvcExldmVsVGVybVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ5NSw1NjJdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyMiw1NjJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjIsNTI3XX0sXCJPdmVycmlkZVRvcExldmVsVGVybV9zdXBlclNwbGljZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTAsNTYyXX0sXCJUb3BMZXZlbFRlcm1cIixbXV1dXSxcIkZvcm1hbHNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjYsNjA2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1ODAsNjA2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1ODAsNTgzXX0sXCI8XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU4NCw2MDJdfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTEsNTk2XX0sXCJpZGVudFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5OCw2MDFdfSxcIixcIl1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYwMyw2MDZdfSxcIj5cIl1dXSxcIlBhcmFtc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxMCw2NDddfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYyMyw2NDddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYyMyw2MjZdfSxcIjxcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjI3LDY0M119LFwiTGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYzNCw2MzddfSxcIlNlcVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYzOSw2NDJdfSxcIixcIl1dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY0NCw2NDddfSxcIj5cIl1dXSxcIkFsdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY1MSw2ODVdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY2MSw2ODVdfSxcIk5vbmVtcHR5TGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY3Niw2NzldfSxcIlNlcVwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY4MSw2ODRdfSxcInxcIl1dXV0sXCJTZXFcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2ODksNzA0XX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjk5LDcwNF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY5OSw3MDNdfSxcIkl0ZXJcIixbXV1dXSxcIkl0ZXJfc3RhclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzcxOSw3MzZdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzcxOSw3MjddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MTksNzIzXX0sXCJQcmVkXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI0LDcyN119LFwiKlwiXV1dLFwiSXRlcl9wbHVzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQzLDc2MF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQzLDc1MV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0Myw3NDddfSxcIlByZWRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NDgsNzUxXX0sXCIrXCJdXV0sXCJJdGVyX29wdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Nyw3ODNdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Nyw3NzVdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjcsNzcxXX0sXCJQcmVkXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzcyLDc3NV19LFwiP1wiXV1dLFwiSXRlclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzcwOCw3OTRdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcxOSw3OTRdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MTksNzI3XX0sXCJJdGVyX3N0YXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQzLDc1MV19LFwiSXRlcl9wbHVzXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Nyw3NzVdfSxcIkl0ZXJfb3B0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc5MCw3OTRdfSxcIlByZWRcIixbXV1dXSxcIlByZWRfbm90XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODA5LDgyNF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODA5LDgxNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODA5LDgxMl19LFwiflwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MTMsODE2XX0sXCJMZXhcIixbXV1dXSxcIlByZWRfbG9va2FoZWFkXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODMxLDg1Ml19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODMxLDgzOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODMxLDgzNF19LFwiJlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzUsODM4XX0sXCJMZXhcIixbXV1dXSxcIlByZWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3OTgsODYyXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MDksODYyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODA5LDgxNl19LFwiUHJlZF9ub3RcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODMxLDgzOF19LFwiUHJlZF9sb29rYWhlYWRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODU5LDg2Ml19LFwiTGV4XCIsW11dXV0sXCJMZXhfbGV4XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODc2LDg5Ml19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODc2LDg4NF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODc2LDg3OV19LFwiI1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4ODAsODg0XX0sXCJCYXNlXCIsW11dXV0sXCJMZXhcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NjYsOTAzXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NzYsOTAzXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODc2LDg4NF19LFwiTGV4X2xleFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4OTksOTAzXX0sXCJCYXNlXCIsW11dXV0sXCJCYXNlX2FwcGxpY2F0aW9uXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTE4LDk3OV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTE4LDk2M119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkxOCw5MjNdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkyNCw5MzFdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MjQsOTMwXX0sXCJQYXJhbXNcIixbXV1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkzMiw5NjNdfSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MzQsOTYyXX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTM0LDk0OF19LFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkzNCw5NDRdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MzQsOTQzXX0sXCJydWxlRGVzY3JcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTQ1LDk0OF19LFwiPVwiXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NTEsOTU1XX0sXCI6PVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk1OCw5NjJdfSxcIis9XCJdXV1dXSxcIkJhc2VfcmFuZ2VcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5ODYsMTA0MV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTg2LDEwMjJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5ODYsMTAwMV19LFwib25lQ2hhclRlcm1pbmFsXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTAwMiwxMDA2XX0sXCIuLlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDA3LDEwMjJdfSxcIm9uZUNoYXJUZXJtaW5hbFwiLFtdXV1dLFwiQmFzZV90ZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNDgsMTEwNl19LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA0OCwxMDU2XX0sXCJ0ZXJtaW5hbFwiLFtdXV0sXCJCYXNlX3BhcmVuXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExMywxMTY4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTEzLDExMjRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTMsMTExNl19LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTE3LDExMjBdfSxcIkFsdFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMjEsMTEyNF19LFwiKVwiXV1dLFwiQmFzZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzkwNywxMTY4XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MTgsMTE2OF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkxOCw5NjNdfSxcIkJhc2VfYXBwbGljYXRpb25cIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTg2LDEwMjJdfSxcIkJhc2VfcmFuZ2VcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA0OCwxMDU2XX0sXCJCYXNlX3Rlcm1pbmFsXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTMsMTEyNF19LFwiQmFzZV9wYXJlblwiLFtdXV1dLFwicnVsZURlc2NyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE3MiwxMjMxXX0sXCJhIHJ1bGUgZGVzY3JpcHRpb25cIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjEwLDEyMzFdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMTAsMTIxM119LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjE0LDEyMjddfSxcInJ1bGVEZXNjclRleHRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjI4LDEyMzFdfSxcIilcIl1dXSxcInJ1bGVEZXNjclRleHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjM1LDEyNjZdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjU1LDEyNjZdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjU2LDEyNjRdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjU2LDEyNjBdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNTcsMTI2MF19LFwiKVwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI2MSwxMjY0XX0sXCJhbnlcIixbXV1dXV0sXCJjYXNlTmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNzAsMTMzOF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI4NSwxMzM4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjg1LDEyODldfSxcIi0tXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjkwLDEzMDRdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjkxLDEzMDJdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjkxLDEyOTZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOTIsMTI5Nl19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjk3LDEzMDJdfSxcInNwYWNlXCIsW11dXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMwNSwxMzA5XX0sXCJuYW1lXCIsW11dLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEwLDEzMjRdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzExLDEzMjJdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzExLDEzMTZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMTIsMTMxNl19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzE3LDEzMjJdfSxcInNwYWNlXCIsW11dXV0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMyNiwxMzM3XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzI2LDEzMzBdfSxcIlxcblwiXSxbXCJsb29rYWhlYWRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzMzLDEzMzddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMzQsMTMzN119LFwifVwiXV1dXV0sXCJuYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM0MiwxMzgyXX0sXCJhIG5hbWVcIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzYzLDEzODJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzYzLDEzNzJdfSxcIm5hbWVGaXJzdFwiLFtdXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3MywxMzgyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3MywxMzgxXX0sXCJuYW1lUmVzdFwiLFtdXV1dXSxcIm5hbWVGaXJzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzODYsMTQxOF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQwMiwxNDE4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDAyLDE0MDVdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQxMiwxNDE4XX0sXCJsZXR0ZXJcIixbXV1dXSxcIm5hbWVSZXN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQyMiwxNDUyXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDM3LDE0NTJdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MzcsMTQ0MF19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDQ3LDE0NTJdfSxcImFsbnVtXCIsW11dXV0sXCJpZGVudFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NTYsMTQ4OV19LFwiYW4gaWRlbnRpZmllclwiLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0ODUsMTQ4OV19LFwibmFtZVwiLFtdXV0sXCJ0ZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0OTMsMTUzMV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUwOCwxNTMxXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTA4LDE1MTJdfSxcIlxcXCJcIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MTMsMTUyNl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MTMsMTUyNV19LFwidGVybWluYWxDaGFyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MjcsMTUzMV19LFwiXFxcIlwiXV1dLFwib25lQ2hhclRlcm1pbmFsXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUzNSwxNTc5XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTU3LDE1NzldfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NTcsMTU2MV19LFwiXFxcIlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTYyLDE1NzRdfSxcInRlcm1pbmFsQ2hhclwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1NzUsMTU3OV19LFwiXFxcIlwiXV1dLFwidGVybWluYWxDaGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU4MywxNjQwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjAyLDE2NDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjAyLDE2MTJdfSxcImVzY2FwZUNoYXJcIixbXV0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYxOSwxNjQwXX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYxOSwxNjI0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjIwLDE2MjRdfSxcIlxcXFxcIl1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MjUsMTYzMF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYyNiwxNjMwXX0sXCJcXFwiXCJdXSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjMxLDE2MzZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MzIsMTYzNl19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjM3LDE2NDBdfSxcImFueVwiLFtdXV1dXSxcImVzY2FwZUNoYXJfYmFja3NsYXNoXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4MywxNzM4XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2ODMsMTY4OV19LFwiXFxcXFxcXFxcIl1dLFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3NDUsMTgwMl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzQ1LDE3NTFdfSxcIlxcXFxcXFwiXCJdXSxcImVzY2FwZUNoYXJfc2luZ2xlUXVvdGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODA5LDE4NjZdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgwOSwxODE1XX0sXCJcXFxcJ1wiXV0sXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NzMsMTkyOF19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODczLDE4NzhdfSxcIlxcXFxiXCJdXSxcImVzY2FwZUNoYXJfbGluZUZlZWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTM1LDE5ODldfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkzNSwxOTQwXX0sXCJcXFxcblwiXV0sXCJlc2NhcGVDaGFyX2NhcnJpYWdlUmV0dXJuXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk5NiwyMDU2XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5OTYsMjAwMV19LFwiXFxcXHJcIl1dLFwiZXNjYXBlQ2hhcl90YWJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDYzLDIxMTJdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA2MywyMDY4XX0sXCJcXFxcdFwiXV0sXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTE5LDIxNzhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMTksMjE2MF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjExOSwyMTI0XX0sXCJcXFxcdVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTI1LDIxMzNdfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMzQsMjE0Ml19LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE0MywyMTUxXX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTUyLDIxNjBdfSxcImhleERpZ2l0XCIsW11dXV0sXCJlc2NhcGVDaGFyX2hleEVzY2FwZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxODUsMjI0MF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE4NSwyMjA4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTg1LDIxOTBdfSxcIlxcXFx4XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxOTEsMjE5OV19LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIwMCwyMjA4XX0sXCJoZXhEaWdpdFwiLFtdXV1dLFwiZXNjYXBlQ2hhclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2NDQsMjI0MF19LFwiYW4gZXNjYXBlIHNlcXVlbmNlXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4MywyMjQwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4MywxNjg5XX0sXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzQ1LDE3NTFdfSxcImVzY2FwZUNoYXJfZG91YmxlUXVvdGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgwOSwxODE1XX0sXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NzMsMTg3OF19LFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkzNSwxOTQwXX0sXCJlc2NhcGVDaGFyX2xpbmVGZWVkXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5OTYsMjAwMV19LFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDYzLDIwNjhdfSxcImVzY2FwZUNoYXJfdGFiXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMTksMjE2MF19LFwiZXNjYXBlQ2hhcl91bmljb2RlRXNjYXBlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxODUsMjIwOF19LFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIixbXV1dXSxcInNwYWNlXCI6W1wiZXh0ZW5kXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI0NCwyMjYzXX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjU2LDIyNjNdfSxcImNvbW1lbnRcIixbXV1dLFwiY29tbWVudF9zaW5nbGVMaW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4MSwyMzI3XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgxLDIzMTJdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODEsMjI4NV19LFwiLy9cIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODYsMjI5OF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODcsMjI5Nl19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODcsMjI5Ml19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4OCwyMjkyXX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyOTMsMjI5Nl19LFwiYW55XCIsW11dXV0sW1wibG9va2FoZWFkXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI5OSwyMzEyXX0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMwMSwyMzExXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzAxLDIzMDVdfSxcIlxcblwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzA4LDIzMTFdfSxcImVuZFwiLFtdXV1dXV0sXCJjb21tZW50X211bHRpTGluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMzQsMjM3MF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMzNCwyMzU2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzM0LDIzMzhdfSxcIi8qXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzM5LDIzNTFdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzQwLDIzNDldfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzQwLDIzNDVdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNDEsMjM0NV19LFwiKi9cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNDYsMjM0OV19LFwiYW55XCIsW11dXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzUyLDIzNTZdfSxcIiovXCJdXV0sXCJjb21tZW50XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI2NywyMzcwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgxLDIzNzBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgxLDIzMTJdfSxcImNvbW1lbnRfc2luZ2xlTGluZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzM0LDIzNTZdfSxcImNvbW1lbnRfbXVsdGlMaW5lXCIsW11dXV0sXCJ0b2tlbnNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzc0LDIzODldfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzgzLDIzODldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzgzLDIzODhdfSxcInRva2VuXCIsW11dXV0sXCJ0b2tlblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzOTMsMjQ2OV19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQwMSwyNDY5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQwMSwyNDA5XX0sXCJjYXNlTmFtZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDEyLDI0MTldfSxcImNvbW1lbnRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQyMiwyNDI3XX0sXCJpZGVudFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDMwLDI0MzhdfSxcIm9wZXJhdG9yXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NDEsMjQ1Ml19LFwicHVuY3R1YXRpb25cIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ1NSwyNDYzXX0sXCJ0ZXJtaW5hbFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDY2LDI0NjldfSxcImFueVwiLFtdXV1dLFwib3BlcmF0b3JcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDczLDI1MzhdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0ODQsMjUzOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ4NCwyNDg4XX0sXCI8OlwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0OTEsMjQ5NF19LFwiPVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0OTcsMjUwMV19LFwiOj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTA0LDI1MDhdfSxcIis9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUxMSwyNTE0XX0sXCIqXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUxNywyNTIwXX0sXCIrXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUyMywyNTI2XX0sXCI/XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUyOSwyNTMyXX0sXCJ+XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUzNSwyNTM4XX0sXCImXCJdXV0sXCJwdW5jdHVhdGlvblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NDIsMjU3OF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU1NiwyNTc4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTU2LDI1NTldfSxcIjxcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTYyLDI1NjVdfSxcIj5cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTY4LDI1NzFdfSxcIixcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTc0LDI1NzhdfSxcIi0tXCJdXV19XSk7XG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoW1wiZ3JhbW1hclwiLHtcInNvdXJjZVwiOlwiT3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXMge1xcblxcbiAgQXR0cmlidXRlU2lnbmF0dXJlID1cXG4gICAgbmFtZVxcblxcbiAgT3BlcmF0aW9uU2lnbmF0dXJlID1cXG4gICAgbmFtZSBGb3JtYWxzP1xcblxcbiAgRm9ybWFsc1xcbiAgICA9IFxcXCIoXFxcIiBMaXN0T2Y8bmFtZSwgXFxcIixcXFwiPiBcXFwiKVxcXCJcXG5cXG4gIG5hbWUgIChhIG5hbWUpXFxuICAgID0gbmFtZUZpcnN0IG5hbWVSZXN0KlxcblxcbiAgbmFtZUZpcnN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgbGV0dGVyXFxuXFxuICBuYW1lUmVzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGFsbnVtXFxuXFxufVwifSxcIk9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzXCIsbnVsbCxcIkF0dHJpYnV0ZVNpZ25hdHVyZVwiLHtcIkF0dHJpYnV0ZVNpZ25hdHVyZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI5LDU4XX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NCw1OF19LFwibmFtZVwiLFtdXV0sXCJPcGVyYXRpb25TaWduYXR1cmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MiwxMDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3LDEwMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3LDkxXX0sXCJuYW1lXCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkyLDEwMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzkyLDk5XX0sXCJGb3JtYWxzXCIsW11dXV1dLFwiRm9ybWFsc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNCwxNDNdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExOCwxNDNdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExOCwxMjFdfSxcIihcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyLDEzOV19LFwiTGlzdE9mXCIsW1tcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyOSwxMzNdfSxcIm5hbWVcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzUsMTM4XX0sXCIsXCJdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDAsMTQzXX0sXCIpXCJdXV0sXCJuYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ3LDE4N119LFwiYSBuYW1lXCIsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY4LDE4N119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OCwxNzddfSxcIm5hbWVGaXJzdFwiLFtdXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc4LDE4N119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OCwxODZdfSxcIm5hbWVSZXN0XCIsW11dXV1dLFwibmFtZUZpcnN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkxLDIyM119LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA3LDIyM119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA3LDIxMF19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTcsMjIzXX0sXCJsZXR0ZXJcIixbXV1dXSxcIm5hbWVSZXN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI3LDI1N119LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQyLDI1N119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQyLDI0NV19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTIsMjU3XX0sXCJhbG51bVwiLFtdXV1dfV0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi4vc3JjL2NvbW1vbicpLmFzc2VydDtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xuZnVuY3Rpb24gZ2V0UHJvcChuYW1lLCB0aGluZywgZm4pIHtcbiAgICByZXR1cm4gZm4odGhpbmdbbmFtZV0pO1xufVxuZnVuY3Rpb24gbWFwUHJvcChuYW1lLCB0aGluZywgZm4pIHtcbiAgICByZXR1cm4gdGhpbmdbbmFtZV0ubWFwKGZuKTtcbn1cbi8vIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgd2FsayBhIHNpbmdsZSBwcm9wZXJ0eSBvZiBhIG5vZGUuXG4vLyBgZGVzY3JpcHRvcmAgaXMgYSBzdHJpbmcgaW5kaWNhdGluZyB0aGUgcHJvcGVydHkgbmFtZSwgb3B0aW9uYWxseSBlbmRpbmdcbi8vIHdpdGggJ1tdJyAoZS5nLiwgJ2NoaWxkcmVuW10nKS5cbmZ1bmN0aW9uIGdldFByb3BXYWxrRm4oZGVzY3JpcHRvcikge1xuICAgIHZhciBwYXJ0cyA9IGRlc2NyaXB0b3Iuc3BsaXQoLyA/XFxbXFxdLyk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICByZXR1cm4gbWFwUHJvcC5iaW5kKG51bGwsIHBhcnRzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIGdldFByb3AuYmluZChudWxsLCBkZXNjcmlwdG9yKTtcbn1cbmZ1bmN0aW9uIGdldFByb3BzKHdhbGtGbnMsIHRoaW5nLCBmbikge1xuICAgIHJldHVybiB3YWxrRm5zLm1hcChmdW5jdGlvbiAod2Fsa0ZuKSB7IHJldHVybiB3YWxrRm4odGhpbmcsIGZuKTsgfSk7XG59XG5mdW5jdGlvbiBnZXRXYWxrRm4oc2hhcGUpIHtcbiAgICBpZiAodHlwZW9mIHNoYXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gZ2V0UHJvcHMuYmluZChudWxsLCBbZ2V0UHJvcFdhbGtGbihzaGFwZSldKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzaGFwZSkpIHtcbiAgICAgICAgcmV0dXJuIGdldFByb3BzLmJpbmQobnVsbCwgc2hhcGUubWFwKGdldFByb3BXYWxrRm4pKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFzc2VydCh0eXBlb2Ygc2hhcGUgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBhIHN0cmluZywgQXJyYXksIG9yIGZ1bmN0aW9uJyk7XG4gICAgICAgIGFzc2VydChzaGFwZS5sZW5ndGggPT09IDIsICdFeHBlY3RlZCBhIGZ1bmN0aW9uIG9mIGFyaXR5IDIsIGdvdCAnICsgc2hhcGUubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzUmVzdHJpY3RlZElkZW50aWZpZXIoc3RyKSB7XG4gICAgcmV0dXJuIC9eW2EtekEtWl9dWzAtOWEtekEtWl9dKiQvLnRlc3Qoc3RyKTtcbn1cbmZ1bmN0aW9uIHRyaW0ocykge1xuICAgIHJldHVybiBzLnRyaW0oKTtcbn1cbmZ1bmN0aW9uIHBhcnNlU2lnbmF0dXJlKHNpZykge1xuICAgIHZhciBwYXJ0cyA9IHNpZy5zcGxpdCgvWygpXS8pLm1hcCh0cmltKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAzICYmIHBhcnRzWzJdID09PSAnJykge1xuICAgICAgICB2YXIgbmFtZSA9IHBhcnRzWzBdO1xuICAgICAgICB2YXIgcGFyYW1zID0gW107XG4gICAgICAgIGlmIChwYXJ0c1sxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJ0c1sxXS5zcGxpdCgnLCcpLm1hcCh0cmltKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNSZXN0cmljdGVkSWRlbnRpZmllcihuYW1lKSAmJiBwYXJhbXMuZXZlcnkoaXNSZXN0cmljdGVkSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IG5hbWUsIGZvcm1hbHM6IHBhcmFtcyB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBvcGVyYXRpb24gc2lnbmF0dXJlOiAnICsgc2lnKTtcbn1cbi8qXG4gIEEgVmlzaXRvckZhbWlseSBjb250YWlucyBhIHNldCBvZiByZWN1cnNpdmUgb3BlcmF0aW9ucyB0aGF0IGFyZSBkZWZpbmVkIG92ZXIgc29tZSBraW5kIG9mXG4gIHRyZWUgc3RydWN0dXJlLiBUaGUgYGNvbmZpZ2AgcGFyYW1ldGVyIHNwZWNpZmllcyBob3cgdG8gd2FsayB0aGUgdHJlZTpcbiAgLSAnZ2V0VGFnJyBpcyBmdW5jdGlvbiB3aGljaCwgZ2l2ZW4gYSBub2RlIGluIHRoZSB0cmVlLCByZXR1cm5zIHRoZSBub2RlJ3MgJ3RhZycgKHR5cGUpXG4gIC0gJ3NoYXBlcycgYW4gb2JqZWN0IHRoYXQgbWFwcyBmcm9tIGEgdGFnIHRvIGEgdmFsdWUgdGhhdCBkZXNjcmliZXMgaG93IHRvIHJlY3Vyc2l2ZWx5XG4gICAgZXZhbHVhdGUgdGhlIG9wZXJhdGlvbiBmb3Igbm9kZXMgb2YgdGhhdCB0eXBlLiBUaGUgdmFsdWUgY2FuIGJlOlxuICAgICogYSBzdHJpbmcgaW5kaWNhdGluZyB0aGUgcHJvcGVydHkgbmFtZSB0aGF0IGhvbGRzIHRoYXQgbm9kZSdzIG9ubHkgY2hpbGRcbiAgICAqIGFuIEFycmF5IG9mIHByb3BlcnR5IG5hbWVzIChvciBhbiBlbXB0eSBhcnJheSBpbmRpY2F0aW5nIGEgbGVhZiB0eXBlKSwgb3JcbiAgICAqIGEgZnVuY3Rpb24gdGFraW5nIHR3byBhcmd1bWVudHMgKG5vZGUsIGZuKSwgYW5kIHJldHVybmluZyBhbiBBcnJheSB3aGljaCBpcyB0aGUgcmVzdWx0XG4gICAgICBvZiBhcHBseSBgZm5gIHRvIGVhY2ggb2YgdGhlIG5vZGUncyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gVmlzaXRvckZhbWlseShjb25maWcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHRoaXMuX3NoYXBlcyA9IGNvbmZpZy5zaGFwZXM7XG4gICAgdGhpcy5fZ2V0VGFnID0gY29uZmlnLmdldFRhZztcbiAgICB0aGlzLkFkYXB0ZXIgPSBmdW5jdGlvbiAodGhpbmcsIGZhbWlseSkge1xuICAgICAgICB0aGlzLl9hZGFwdGVlID0gdGhpbmc7XG4gICAgICAgIHRoaXMuX2ZhbWlseSA9IGZhbWlseTtcbiAgICB9O1xuICAgIHRoaXMuQWRhcHRlci5wcm90b3R5cGUudmFsdWVPZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdoZWVleSEnKTtcbiAgICB9O1xuICAgIHRoaXMub3BlcmF0aW9ucyA9IHt9O1xuICAgIHRoaXMuX2FyaXRpZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2dldENoaWxkcmVuID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLl9zaGFwZXMpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgdmFyIHNoYXBlID0gX3RoaXMuX3NoYXBlc1trXTtcbiAgICAgICAgX3RoaXMuX2dldENoaWxkcmVuW2tdID0gZ2V0V2Fsa0ZuKHNoYXBlKTtcbiAgICAgICAgLy8gQSBmdW5jdGlvbiBtZWFucyB0aGUgYXJpdHkgaXNuJ3QgZml4ZWQsIHNvIGRvbid0IHB1dCBhbiBlbnRyeSBpbiB0aGUgYXJpdHkgbWFwLlxuICAgICAgICBpZiAodHlwZW9mIHNoYXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBfdGhpcy5fYXJpdGllc1trXSA9IEFycmF5LmlzQXJyYXkoc2hhcGUpID8gc2hhcGUubGVuZ3RoIDogMTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX3dyYXAgPSBmdW5jdGlvbiAodGhpbmcpIHsgcmV0dXJuIG5ldyBfdGhpcy5BZGFwdGVyKHRoaW5nLCBfdGhpcyk7IH07XG59XG5WaXNpdG9yRmFtaWx5LnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24gKHRoaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXAodGhpbmcpO1xufTtcblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLl9jaGVja0FjdGlvbkRpY3QgPSBmdW5jdGlvbiAoZGljdCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgT2JqZWN0LmtleXMoZGljdCkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBhc3NlcnQoayBpbiBfdGhpcy5fZ2V0Q2hpbGRyZW4sIFwiVW5yZWNvZ25pemVkIGFjdGlvbiBuYW1lICdcIiArIGsgKyBcIidcIik7XG4gICAgICAgIHZhciBhY3Rpb24gPSBkaWN0W2tdO1xuICAgICAgICBhc3NlcnQodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJywgXCJLZXkgJ1wiICsgayArIFwiJzogZXhwZWN0ZWQgZnVuY3Rpb24sIGdvdCBcIiArIGFjdGlvbik7XG4gICAgICAgIGlmIChrIGluIF90aGlzLl9hcml0aWVzKSB7XG4gICAgICAgICAgICB2YXIgZXhwZWN0ZWQgPSBfdGhpcy5fYXJpdGllc1trXTtcbiAgICAgICAgICAgIHZhciBhY3R1YWwgPSBkaWN0W2tdLmxlbmd0aDtcbiAgICAgICAgICAgIGFzc2VydChhY3R1YWwgPT09IGV4cGVjdGVkLCBcIkFjdGlvbiAnXCIgKyBrICsgXCInIGhhcyB0aGUgd3JvbmcgYXJpdHk6IGV4cGVjdGVkIFwiICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5WaXNpdG9yRmFtaWx5LnByb3RvdHlwZS5hZGRPcGVyYXRpb24gPSBmdW5jdGlvbiAoc2lnbmF0dXJlLCBhY3Rpb25zKSB7XG4gICAgdmFyIHNpZyA9IHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSk7XG4gICAgdmFyIG5hbWUgPSBzaWcubmFtZTtcbiAgICB0aGlzLl9jaGVja0FjdGlvbkRpY3QoYWN0aW9ucyk7XG4gICAgdGhpcy5vcGVyYXRpb25zW25hbWVdID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBmb3JtYWxzOiBzaWcuZm9ybWFscyxcbiAgICAgICAgYWN0aW9uczogYWN0aW9uc1xuICAgIH07XG4gICAgdmFyIGZhbWlseSA9IHRoaXM7XG4gICAgdGhpcy5BZGFwdGVyLnByb3RvdHlwZVtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRhZyA9IGZhbWlseS5fZ2V0VGFnKHRoaXMuX2FkYXB0ZWUpO1xuICAgICAgICBhc3NlcnQodGFnIGluIGZhbWlseS5fZ2V0Q2hpbGRyZW4sIFwiZ2V0VGFnIHJldHVybmVkIHVucmVjb2duaXplZCB0YWcgJ1wiICsgdGFnICsgXCInXCIpO1xuICAgICAgICBhc3NlcnQodGFnIGluIGFjdGlvbnMsIFwiTm8gYWN0aW9uIGZvciAnXCIgKyB0YWcgKyBcIicgaW4gb3BlcmF0aW9uICdcIiArIG5hbWUgKyBcIidcIik7XG4gICAgICAgIC8vIENyZWF0ZSBhbiBcImFyZ3VtZW50cyBvYmplY3RcIiBmcm9tIHRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGlzXG4gICAgICAgIC8vIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZS5cbiAgICAgICAgdmFyIGFyZ3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tzaWcuZm9ybWFsc1tpXV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9sZEFyZ3MgPSB0aGlzLmFyZ3M7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3M7XG4gICAgICAgIHZhciBhbnMgPSBhY3Rpb25zW3RhZ10uYXBwbHkodGhpcywgZmFtaWx5Ll9nZXRDaGlsZHJlblt0YWddKHRoaXMuX2FkYXB0ZWUsIGZhbWlseS5fd3JhcCkpO1xuICAgICAgICB0aGlzLmFyZ3MgPSBvbGRBcmdzO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFZpc2l0b3JGYW1pbHk7XG4iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBWaXNpdG9yRmFtaWx5OiByZXF1aXJlKCcuL1Zpc2l0b3JGYW1pbHknKSxcbiAgICBzZW1hbnRpY3NGb3JUb0FTVDogcmVxdWlyZSgnLi9zZW1hbnRpY3MtdG9BU1QnKS5zZW1hbnRpY3MsXG4gICAgdG9BU1Q6IHJlcXVpcmUoJy4vc2VtYW50aWNzLXRvQVNUJykuaGVscGVyXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi4vc3JjL3BleHBycycpO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi4vc3JjL01hdGNoUmVzdWx0Jyk7XG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4uL3NyYy9HcmFtbWFyJyk7XG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGRlZmF1bHRPcGVyYXRpb24gPSB7XG4gICAgX3Rlcm1pbmFsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICB9LFxuICAgIF9ub250ZXJtaW5hbDogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICAgIHZhciBjdG9yTmFtZSA9IHRoaXMuX25vZGUuY3Rvck5hbWU7XG4gICAgICAgIHZhciBtYXBwaW5nID0gdGhpcy5hcmdzLm1hcHBpbmc7XG4gICAgICAgIC8vIHdpdGhvdXQgY3VzdG9taXphdGlvblxuICAgICAgICBpZiAoIW1hcHBpbmcuaGFzT3duUHJvcGVydHkoY3Rvck5hbWUpKSB7XG4gICAgICAgICAgICAvLyBpbnRlcm1lZGlhdGUgbm9kZVxuICAgICAgICAgICAgaWYgKHRoaXMuX25vZGUgaW5zdGFuY2VvZiBwZXhwcnMuQWx0IHx8IHRoaXMuX25vZGUgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBsZXhpY2FsIHJ1bGVcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGV4aWNhbCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gc2luZ3VsYXIgbm9kZSAoZS5nLiBvbmx5IHN1cnJvdW5kZWQgYnkgbGl0ZXJhbHMgb3IgbG9va2FoZWFkcylcbiAgICAgICAgICAgIHZhciByZWFsQ2hpbGRyZW4gPSBjaGlsZHJlbi5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkKSB7IHJldHVybiAhY2hpbGQuaXNUZXJtaW5hbCgpOyB9KTtcbiAgICAgICAgICAgIGlmIChyZWFsQ2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWxDaGlsZHJlblswXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJlc3Q6IHRlcm1zIHdpdGggbXVsdGlwbGUgY2hpbGRyZW5cbiAgICAgICAgfVxuICAgICAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgICAgICBpZiAodHlwZW9mIG1hcHBpbmdbY3Rvck5hbWVdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuW21hcHBpbmdbY3Rvck5hbWVdXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBuYW1lZC9tYXBwZWQgY2hpbGRyZW4gb3IgdW5uYW1lZCBjaGlsZHJlbiAoJzAnLCAnMScsICcyJywgLi4uKVxuICAgICAgICB2YXIgcHJvcE1hcCA9IG1hcHBpbmdbY3Rvck5hbWVdIHx8IGNoaWxkcmVuO1xuICAgICAgICB2YXIgbm9kZSA9IHtcbiAgICAgICAgICAgIHR5cGU6IGN0b3JOYW1lXG4gICAgICAgIH07XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gcHJvcE1hcCkge1xuICAgICAgICAgICAgdmFyIG1hcHBlZFByb3AgPSBtYXBwaW5nW2N0b3JOYW1lXSAmJiBtYXBwaW5nW2N0b3JOYW1lXVtwcm9wXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAvLyBkaXJlY3QgZm9yd2FyZFxuICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlblttYXBwZWRQcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgICAgICAgIHR5cGVvZiBtYXBwZWRQcm9wID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgICAgICAgICBtYXBwZWRQcm9wID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gcHJpbWl0aXZlIHZhbHVlXG4gICAgICAgICAgICAgICAgbm9kZVtwcm9wXSA9IG1hcHBlZFByb3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ29iamVjdCcgJiYgbWFwcGVkUHJvcCBpbnN0YW5jZW9mIE51bWJlcikge1xuICAgICAgICAgICAgICAgIC8vIHByaW1pdGl2ZSBudW1iZXIgKG11c3QgYmUgdW5ib3hlZClcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gTnVtYmVyKG1hcHBlZFByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlZCB2YWx1ZVxuICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBtYXBwZWRQcm9wLmNhbGwodGhpcywgY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWFwcGVkUHJvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuW3Byb3BdICYmICFjaGlsZHJlbltwcm9wXS5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVtwcm9wXSA9IGNoaWxkcmVuW3Byb3BdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsZXRlIHByZWRlZmluZWQgJ3R5cGUnIHByb3BlcnRpZXMsIGxpa2UgJ3R5cGUnLCBpZiBleHBsaWNpdGVseSByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuICAgIF9pdGVyOiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHRoaXMuX25vZGUuaXNPcHRpb25hbCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5udW1DaGlsZHJlbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBOb25lbXB0eUxpc3RPZjogZnVuY3Rpb24gKGZpcnN0LCBzZXAsIHJlc3QpIHtcbiAgICAgICAgcmV0dXJuIFtmaXJzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyldLmNvbmNhdChyZXN0LnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKSk7XG4gICAgfSxcbiAgICBFbXB0eUxpc3RPZjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufTtcbi8vIFJldHVybnMgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IGluY2x1ZGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIChBU1QpXG4vLyBmb3IgdGhlIGdpdmVuIG1hdGNoIHJlc3VsdCBgcmVzYCBjb250YWluZyBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIGFuZCBncmFtbWFyLlxuLy8gVGhlIG9wdGlvbmFsIGBtYXBwaW5nYCBwYXJhbWV0ZXIgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIGhvdyB0aGUgbm9kZXMgb2YgdGhlIENTVFxuLy8gYXJlIG1hcHBlZCB0byB0aGUgQVNUIChzZWUgL2RvYy9leHRyYXMubWQjdG9hc3RtYXRjaHJlc3VsdC1tYXBwaW5nKS5cbmZ1bmN0aW9uIHRvQVNUKHJlcywgbWFwcGluZykge1xuICAgIGlmICghKHJlcyBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSB8fCByZXMuZmFpbGVkKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0b0FTVCgpIGV4cGVjdHMgYSBzdWNjZXNmdWxsIE1hdGNoUmVzdWx0IGFzIGZpcnN0IHBhcmFtZXRlcicpO1xuICAgIH1cbiAgICBtYXBwaW5nID0gZXh0ZW5kKHt9LCBtYXBwaW5nKTtcbiAgICB2YXIgb3BlcmF0aW9uID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3BlcmF0aW9uKTtcbiAgICBmb3IgKHZhciB0ZXJtTmFtZSBpbiBtYXBwaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbWFwcGluZ1t0ZXJtTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wZXJhdGlvblt0ZXJtTmFtZV0gPSBtYXBwaW5nW3Rlcm1OYW1lXTtcbiAgICAgICAgICAgIGRlbGV0ZSBtYXBwaW5nW3Rlcm1OYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgZyA9IHJlcy5fY3N0LmdyYW1tYXI7XG4gICAgdmFyIHMgPSBnLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBvcGVyYXRpb24pO1xuICAgIHJldHVybiBzKHJlcykudG9BU1QobWFwcGluZyk7XG59XG4vLyBSZXR1cm5zIGEgc2VtYW50aWNzIGNvbnRhaW5nIHRoZSB0b0FTVChtYXBwaW5nKSBvcGVyYXRpb24gZm9yIHRoZSBnaXZlbiBncmFtbWFyIGcuXG5mdW5jdGlvbiBzZW1hbnRpY3NGb3JUb0FTVChnKSB7XG4gICAgaWYgKCEoZyBpbnN0YW5jZW9mIEdyYW1tYXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2VtYW50aWNzVG9BU1QoKSBleHBlY3RzIGEgR3JhbW1hciBhcyBwYXJhbWV0ZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIGcuY3JlYXRlU2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCd0b0FTVChtYXBwaW5nKScsIGRlZmF1bHRPcGVyYXRpb24pO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaGVscGVyOiB0b0FTVCxcbiAgICBzZW1hbnRpY3M6IHNlbWFudGljc0ZvclRvQVNUXG59O1xuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmXG4gICAgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgR3JhbW1hckRlY2wgPSByZXF1aXJlKCcuL0dyYW1tYXJEZWNsJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gQnVpbGRlcigpIHsgfVxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gICAgY3VycmVudERlY2w6IG51bGwsXG4gICAgY3VycmVudFJ1bGVOYW1lOiBudWxsLFxuICAgIG5ld0dyYW1tYXI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiBuZXcgR3JhbW1hckRlY2wobmFtZSk7XG4gICAgfSxcbiAgICBncmFtbWFyOiBmdW5jdGlvbiAobWV0YUluZm8sIG5hbWUsIHN1cGVyR3JhbW1hciwgZGVmYXVsdFN0YXJ0UnVsZSwgcnVsZXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIGdEZWNsID0gbmV3IEdyYW1tYXJEZWNsKG5hbWUpO1xuICAgICAgICBpZiAoc3VwZXJHcmFtbWFyKSB7XG4gICAgICAgICAgICBnRGVjbC53aXRoU3VwZXJHcmFtbWFyKHRoaXMuZnJvbVJlY2lwZShzdXBlckdyYW1tYXIpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgICAgICAgICAgZ0RlY2wud2l0aERlZmF1bHRTdGFydFJ1bGUoZGVmYXVsdFN0YXJ0UnVsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1ldGFJbmZvICYmIG1ldGFJbmZvLnNvdXJjZSkge1xuICAgICAgICAgICAgZ0RlY2wud2l0aFNvdXJjZShtZXRhSW5mby5zb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3VycmVudERlY2wgPSBnRGVjbDtcbiAgICAgICAgT2JqZWN0LmtleXMocnVsZXMpLmZvckVhY2goZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgICAgICAgICBfdGhpcy5jdXJyZW50UnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgICAgICAgIHZhciBydWxlUmVjaXBlID0gcnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgdmFyIGFjdGlvbiA9IHJ1bGVSZWNpcGVbMF07IC8vIGRlZmluZS9leHRlbmQvb3ZlcnJpZGVcbiAgICAgICAgICAgIHZhciBtZXRhSW5mbyA9IHJ1bGVSZWNpcGVbMV07XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBydWxlUmVjaXBlWzJdO1xuICAgICAgICAgICAgdmFyIGZvcm1hbHMgPSBydWxlUmVjaXBlWzNdO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBfdGhpcy5mcm9tUmVjaXBlKHJ1bGVSZWNpcGVbNF0pO1xuICAgICAgICAgICAgdmFyIHNvdXJjZTtcbiAgICAgICAgICAgIGlmIChnRGVjbC5zb3VyY2UgJiYgbWV0YUluZm8gJiYgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2UgPSBnRGVjbC5zb3VyY2Uuc3ViSW50ZXJ2YWwobWV0YUluZm8uc291cmNlSW50ZXJ2YWxbMF0sIG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzFdIC0gbWV0YUluZm8uc291cmNlSW50ZXJ2YWxbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ0RlY2xbYWN0aW9uXShydWxlTmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRSdWxlTmFtZSA9IHRoaXMuY3VycmVudERlY2wgPSBudWxsO1xuICAgICAgICByZXR1cm4gZ0RlY2wuYnVpbGQoKTtcbiAgICB9LFxuICAgIHRlcm1pbmFsOiBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5UZXJtaW5hbCh4KTtcbiAgICB9LFxuICAgIHJhbmdlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuUmFuZ2UoZnJvbSwgdG8pO1xuICAgIH0sXG4gICAgcGFyYW06IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCk7XG4gICAgfSxcbiAgICBhbHQ6IGZ1bmN0aW9uICggLyogdGVybTEsIHRlcm0yLCAuLi4gKi8pIHtcbiAgICAgICAgdmFyIHRlcm1zID0gW107XG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICAgICAgICBpZiAoIShhcmcgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICAgICAgYXJnID0gdGhpcy5mcm9tUmVjaXBlKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLkFsdCkge1xuICAgICAgICAgICAgICAgIHRlcm1zID0gdGVybXMuY29uY2F0KGFyZy50ZXJtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0ZXJtcy5wdXNoKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRlcm1zLmxlbmd0aCA9PT0gMSA/IHRlcm1zWzBdIDogbmV3IHBleHBycy5BbHQodGVybXMpO1xuICAgIH0sXG4gICAgc2VxOiBmdW5jdGlvbiAoIC8qIGZhY3RvcjEsIGZhY3RvcjIsIC4uLiAqLykge1xuICAgICAgICB2YXIgZmFjdG9ycyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgICAgICAgaWYgKCEoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgICAgIGFyZyA9IHRoaXMuZnJvbVJlY2lwZShhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5TZXEpIHtcbiAgICAgICAgICAgICAgICBmYWN0b3JzID0gZmFjdG9ycy5jb25jYXQoYXJnLmZhY3RvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmFjdG9ycy5wdXNoKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhY3RvcnMubGVuZ3RoID09PSAxID8gZmFjdG9yc1swXSA6IG5ldyBwZXhwcnMuU2VxKGZhY3RvcnMpO1xuICAgIH0sXG4gICAgc3RhcjogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuU3RhcihleHByKTtcbiAgICB9LFxuICAgIHBsdXM6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlBsdXMoZXhwcik7XG4gICAgfSxcbiAgICBvcHQ6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLk9wdChleHByKTtcbiAgICB9LFxuICAgIG5vdDogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuTm90KGV4cHIpO1xuICAgIH0sXG4gICAgbGE6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIC8vIFRPRE86IHRlbXBvcmFyeSB0byBzdGlsbCBiZSBhYmxlIHRvIHJlYWQgb2xkIHJlY2lwZXNcbiAgICAgICAgcmV0dXJuIHRoaXMubG9va2FoZWFkKGV4cHIpO1xuICAgIH0sXG4gICAgbG9va2FoZWFkOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5Mb29rYWhlYWQoZXhwcik7XG4gICAgfSxcbiAgICBsZXg6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLkxleChleHByKTtcbiAgICB9LFxuICAgIGFwcDogZnVuY3Rpb24gKHJ1bGVOYW1lLCBvcHRQYXJhbXMpIHtcbiAgICAgICAgaWYgKG9wdFBhcmFtcyAmJiBvcHRQYXJhbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgb3B0UGFyYW1zID0gb3B0UGFyYW1zLm1hcChmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW0gaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIgPyBwYXJhbSA6IHRoaXMuZnJvbVJlY2lwZShwYXJhbSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5BcHBseShydWxlTmFtZSwgb3B0UGFyYW1zKTtcbiAgICB9LFxuICAgIC8vIE5vdGUgdGhhdCB1bmxpa2Ugb3RoZXIgbWV0aG9kcyBpbiB0aGlzIGNsYXNzLCB0aGlzIG1ldGhvZCBjYW5ub3QgYmUgdXNlZCBhcyBhXG4gICAgLy8gY29udmVuaWVuY2UgY29uc3RydWN0b3IuIEl0IG9ubHkgd29ya3Mgd2l0aCByZWNpcGVzLCBiZWNhdXNlIGl0IHJlbGllcyBvblxuICAgIC8vIGB0aGlzLmN1cnJlbnREZWNsYCBhbmQgYHRoaXMuY3VycmVudFJ1bGVOYW1lYCBiZWluZyBzZXQuXG4gICAgc3BsaWNlOiBmdW5jdGlvbiAoYmVmb3JlVGVybXMsIGFmdGVyVGVybXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuU3BsaWNlKHRoaXMuY3VycmVudERlY2wuc3VwZXJHcmFtbWFyLCB0aGlzLmN1cnJlbnRSdWxlTmFtZSwgYmVmb3JlVGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiBfdGhpcy5mcm9tUmVjaXBlKHRlcm0pOyB9KSwgYWZ0ZXJUZXJtcy5tYXAoZnVuY3Rpb24gKHRlcm0pIHsgcmV0dXJuIF90aGlzLmZyb21SZWNpcGUodGVybSk7IH0pKTtcbiAgICB9LFxuICAgIGZyb21SZWNpcGU6IGZ1bmN0aW9uIChyZWNpcGUpIHtcbiAgICAgICAgLy8gdGhlIG1ldGEtaW5mbyBvZiAnZ3JhbW1hcicgaXMgcHJvY2Vzc2VkIGluIEJ1aWxkZXIuZ3JhbW1hclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpc1tyZWNpcGVbMF1dLmFwcGx5KHRoaXMsIHJlY2lwZVswXSA9PT0gJ2dyYW1tYXInID8gcmVjaXBlLnNsaWNlKDEpIDogcmVjaXBlLnNsaWNlKDIpKTtcbiAgICAgICAgdmFyIG1ldGFJbmZvID0gcmVjaXBlWzFdO1xuICAgICAgICBpZiAobWV0YUluZm8pIHtcbiAgICAgICAgICAgIGlmIChtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCAmJiB0aGlzLmN1cnJlbnREZWNsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LndpdGhTb3VyY2UodGhpcy5jdXJyZW50RGVjbC5zb3VyY2VJbnRlcnZhbC5hcHBseSh0aGlzLmN1cnJlbnREZWNsLCBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEZhaWx1cmUgPSByZXF1aXJlKCcuL0ZhaWx1cmUnKTtcbnZhciBUZXJtaW5hbE5vZGUgPSByZXF1aXJlKCcuL25vZGVzJykuVGVybWluYWxOb2RlO1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vY29tbW9uJykuYXNzZXJ0O1xudmFyIF9hID0gcmVxdWlyZSgnLi9wZXhwcnMnKSwgUEV4cHIgPSBfYS5QRXhwciwgVGVybWluYWwgPSBfYS5UZXJtaW5hbDtcbnZhciBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwocGFyYW0pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMub2JqID0gcGFyYW07XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLl9nZXRTdHJpbmcgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIHRlcm1pbmFsID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLm9iai5pbmRleF07XG4gICAgICAgIGFzc2VydCh0ZXJtaW5hbCBpbnN0YW5jZW9mIFRlcm1pbmFsLCAnZXhwZWN0ZWQgYSBUZXJtaW5hbCBleHByZXNzaW9uJyk7XG4gICAgICAgIHJldHVybiB0ZXJtaW5hbC5vYmo7XG4gICAgfTtcbiAgICAvLyBJbXBsZW1lbnRhdGlvbiBvZiB0aGUgUEV4cHIgQVBJXG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSB0aGlzLl9nZXRTdHJpbmcoc3RhdGUpO1xuICAgICAgICBpZiAoIWlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKG1hdGNoU3RyLCB0cnVlKSkge1xuICAgICAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIG1hdGNoU3RyKSwgb3JpZ1Bvcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgICAgIC8vIFN0YXJ0IHdpdGggYSBleGFtcGxlIGdlbmVyYXRlZCBmcm9tIHRoZSBUZXJtaW5hbC4uLlxuICAgICAgICB2YXIgc3RyID0gdGhpcy5vYmouZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpLnZhbHVlO1xuICAgICAgICAvLyAuLi5hbmQgcmFuZG9tbHkgc3dpdGNoIGNoYXJhY3RlcnMgdG8gdXBwZXJjYXNlL2xvd2VyY2FzZS5cbiAgICAgICAgdmFyIHZhbHVlID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICB2YWx1ZSArPSBNYXRoLnJhbmRvbSgpIDwgMC41ID8gc3RyW2ldLnRvTG9jYWxlTG93ZXJDYXNlKCkgOiBzdHJbaV0udG9Mb2NhbGVVcHBlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyB2YWx1ZTogdmFsdWUgfTtcbiAgICB9O1xuICAgIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgfTtcbiAgICBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwodGhpcy5vYmouc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSk7XG4gICAgfTtcbiAgICBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmoudG9EaXNwbGF5U3RyaW5nKCkgKyAnIChjYXNlLWluc2Vuc2l0aXZlKSc7XG4gICAgfTtcbiAgICBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIHRoaXMub2JqLnRvRmFpbHVyZShncmFtbWFyKSArICcgKGNhc2UtaW5zZW5zaXRpdmUpJywgJ2Rlc2NyaXB0aW9uJyk7XG4gICAgfTtcbiAgICBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FzZUluc2Vuc2l0aXZlVGVybWluYWw7XG59KFBFeHByKSk7XG5tb2R1bGUuZXhwb3J0cyA9IENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBgRmFpbHVyZWBzIHJlcHJlc2VudCBleHByZXNzaW9ucyB0aGF0IHdlcmVuJ3QgbWF0Y2hlZCB3aGlsZSBwYXJzaW5nLiBUaGV5IGFyZSB1c2VkIHRvIGdlbmVyYXRlXG4gIGVycm9yIG1lc3NhZ2VzIGF1dG9tYXRpY2FsbHkuIFRoZSBpbnRlcmZhY2Ugb2YgYEZhaWx1cmVgcyBpbmNsdWRlcyB0aGUgY29sbG93aW5nIG1ldGhvZHM6XG5cbiAgLSBnZXRUZXh0KCkgOiBTdHJpbmdcbiAgLSBnZXRUeXBlKCkgOiBTdHJpbmcgIChvbmUgb2Yge1wiZGVzY3JpcHRpb25cIiwgXCJzdHJpbmdcIiwgXCJjb2RlXCJ9KVxuICAtIGlzRGVzY3JpcHRpb24oKSA6IGJvb2xcbiAgLSBpc1N0cmluZ1Rlcm1pbmFsKCkgOiBib29sXG4gIC0gaXNDb2RlKCkgOiBib29sXG4gIC0gaXNGbHVmZnkoKSA6IGJvb2xcbiAgLSBtYWtlRmx1ZmZ5KCkgOiB2b2lkXG4gIC0gc3Vic3VtZXMoRmFpbHVyZSkgOiBib29sXG4qL1xuZnVuY3Rpb24gaXNWYWxpZFR5cGUodHlwZSkge1xuICAgIHJldHVybiB0eXBlID09PSAnZGVzY3JpcHRpb24nIHx8IHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdjb2RlJztcbn1cbmZ1bmN0aW9uIEZhaWx1cmUocGV4cHIsIHRleHQsIHR5cGUpIHtcbiAgICBpZiAoIWlzVmFsaWRUeXBlKHR5cGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBGYWlsdXJlIHR5cGU6ICcgKyB0eXBlKTtcbiAgICB9XG4gICAgdGhpcy5wZXhwciA9IHBleHByO1xuICAgIHRoaXMudGV4dCA9IHRleHQ7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLmZsdWZmeSA9IGZhbHNlO1xufVxuRmFpbHVyZS5wcm90b3R5cGUuZ2V0UEV4cHIgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucGV4cHI7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuZ2V0VGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXh0O1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmdldFR5cGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5pc0Rlc2NyaXB0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdkZXNjcmlwdGlvbic7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuaXNTdHJpbmdUZXJtaW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSAnc3RyaW5nJztcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5pc0NvZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2NvZGUnO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmlzRmx1ZmZ5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmZsdWZmeTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5tYWtlRmx1ZmZ5ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmx1ZmZ5ID0gdHJ1ZTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5jbGVhckZsdWZmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZsdWZmeSA9IGZhbHNlO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLnN1YnN1bWVzID0gZnVuY3Rpb24gKHRoYXQpIHtcbiAgICByZXR1cm4gKHRoaXMuZ2V0VGV4dCgpID09PSB0aGF0LmdldFRleHQoKSAmJlxuICAgICAgICB0aGlzLnR5cGUgPT09IHRoYXQudHlwZSAmJlxuICAgICAgICAoIXRoaXMuaXNGbHVmZnkoKSB8fCAodGhpcy5pc0ZsdWZmeSgpICYmIHRoYXQuaXNGbHVmZnkoKSkpKTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KHRoaXMuZ2V0VGV4dCgpKSA6IHRoaXMuZ2V0VGV4dCgpO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBmYWlsdXJlID0gbmV3IEZhaWx1cmUodGhpcy5wZXhwciwgdGhpcy50ZXh0LCB0aGlzLnR5cGUpO1xuICAgIGlmICh0aGlzLmlzRmx1ZmZ5KCkpIHtcbiAgICAgICAgZmFpbHVyZS5tYWtlRmx1ZmZ5KCk7XG4gICAgfVxuICAgIHJldHVybiBmYWlsdXJlO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLnRvS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCkgKyAnIycgKyB0aGlzLnR5cGU7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEZhaWx1cmU7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCA9IHJlcXVpcmUoJy4vQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwnKTtcbnZhciBNYXRjaGVyID0gcmVxdWlyZSgnLi9NYXRjaGVyJyk7XG52YXIgU2VtYW50aWNzID0gcmVxdWlyZSgnLi9TZW1hbnRpY3MnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZ2V0U29ydGVkUnVsZVZhbHVlcyhncmFtbWFyKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZXMpXG4gICAgICAgIC5zb3J0KClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gZ3JhbW1hci5ydWxlc1tuYW1lXTsgfSk7XG59XG5mdW5jdGlvbiBHcmFtbWFyKG5hbWUsIHN1cGVyR3JhbW1hciwgcnVsZXMsIG9wdERlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICAgIHRoaXMucnVsZXMgPSBydWxlcztcbiAgICBpZiAob3B0RGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgICAgICBpZiAoIShvcHREZWZhdWx0U3RhcnRSdWxlIGluIHJ1bGVzKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdGFydCBydWxlOiAnXCIgK1xuICAgICAgICAgICAgICAgIG9wdERlZmF1bHRTdGFydFJ1bGUgK1xuICAgICAgICAgICAgICAgIFwiJyBpcyBub3QgYSBydWxlIGluIGdyYW1tYXIgJ1wiICtcbiAgICAgICAgICAgICAgICBuYW1lICtcbiAgICAgICAgICAgICAgICBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gb3B0RGVmYXVsdFN0YXJ0UnVsZTtcbiAgICB9XG59XG52YXIgb2htR3JhbW1hcjtcbnZhciBidWlsZEdyYW1tYXI7XG4vLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgZnJvbSBtYWluLmpzIG9uY2UgT2htIGhhcyBsb2FkZWQuXG5HcmFtbWFyLmluaXRBcHBsaWNhdGlvblBhcnNlciA9IGZ1bmN0aW9uIChncmFtbWFyLCBidWlsZGVyRm4pIHtcbiAgICBvaG1HcmFtbWFyID0gZ3JhbW1hcjtcbiAgICBidWlsZEdyYW1tYXIgPSBidWlsZGVyRm47XG59O1xuR3JhbW1hci5wcm90b3R5cGUgPSB7XG4gICAgbWF0Y2hlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IE1hdGNoZXIodGhpcyk7XG4gICAgfSxcbiAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGUgZ3JhbW1hciBpcyBhIGJ1aWx0LWluIGdyYW1tYXIsIG90aGVyd2lzZSBmYWxzZS5cbiAgICAvLyBOT1RFOiBUaGlzIG1pZ2h0IGdpdmUgYW4gdW5leHBlY3RlZCByZXN1bHQgaWYgY2FsbGVkIGJlZm9yZSBCdWlsdEluUnVsZXMgaXMgZGVmaW5lZCFcbiAgICBpc0J1aWx0SW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMgPT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMgfHwgdGhpcyA9PT0gR3JhbW1hci5CdWlsdEluUnVsZXM7XG4gICAgfSxcbiAgICBlcXVhbHM6IGZ1bmN0aW9uIChnKSB7XG4gICAgICAgIGlmICh0aGlzID09PSBnKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyB0aGUgY2hlYXBlc3QgY29tcGFyaXNvbnMgZmlyc3QuXG4gICAgICAgIGlmIChnID09IG51bGwgfHxcbiAgICAgICAgICAgIHRoaXMubmFtZSAhPT0gZy5uYW1lIHx8XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgIT09IGcuZGVmYXVsdFN0YXJ0UnVsZSB8fFxuICAgICAgICAgICAgISh0aGlzLnN1cGVyR3JhbW1hciA9PT0gZy5zdXBlckdyYW1tYXIgfHwgdGhpcy5zdXBlckdyYW1tYXIuZXF1YWxzKGcuc3VwZXJHcmFtbWFyKSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbXlSdWxlcyA9IGdldFNvcnRlZFJ1bGVWYWx1ZXModGhpcyk7XG4gICAgICAgIHZhciBvdGhlclJ1bGVzID0gZ2V0U29ydGVkUnVsZVZhbHVlcyhnKTtcbiAgICAgICAgcmV0dXJuIChteVJ1bGVzLmxlbmd0aCA9PT0gb3RoZXJSdWxlcy5sZW5ndGggJiZcbiAgICAgICAgICAgIG15UnVsZXMuZXZlcnkoZnVuY3Rpb24gKHJ1bGUsIGkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHJ1bGUuZGVzY3JpcHRpb24gPT09IG90aGVyUnVsZXNbaV0uZGVzY3JpcHRpb24gJiZcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5mb3JtYWxzLmpvaW4oJywnKSA9PT0gb3RoZXJSdWxlc1tpXS5mb3JtYWxzLmpvaW4oJywnKSAmJlxuICAgICAgICAgICAgICAgICAgICBydWxlLmJvZHkudG9TdHJpbmcoKSA9PT0gb3RoZXJSdWxlc1tpXS5ib2R5LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgfSkpO1xuICAgIH0sXG4gICAgbWF0Y2g6IGZ1bmN0aW9uIChpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgICAgICB2YXIgbSA9IHRoaXMubWF0Y2hlcigpO1xuICAgICAgICBtLnJlcGxhY2VJbnB1dFJhbmdlKDAsIDAsIGlucHV0KTtcbiAgICAgICAgcmV0dXJuIG0ubWF0Y2gob3B0U3RhcnRBcHBsaWNhdGlvbik7XG4gICAgfSxcbiAgICB0cmFjZTogZnVuY3Rpb24gKGlucHV0LCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYXRjaGVyKCk7XG4gICAgICAgIG0ucmVwbGFjZUlucHV0UmFuZ2UoMCwgMCwgaW5wdXQpO1xuICAgICAgICByZXR1cm4gbS50cmFjZShvcHRTdGFydEFwcGxpY2F0aW9uKTtcbiAgICB9LFxuICAgIGNyZWF0ZVNlbWFudGljczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzKTtcbiAgICB9LFxuICAgIGV4dGVuZFNlbWFudGljczogZnVuY3Rpb24gKHN1cGVyU2VtYW50aWNzKSB7XG4gICAgICAgIHJldHVybiBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzKHRoaXMsIHN1cGVyU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG4gICAgfSxcbiAgICAvLyBDaGVjayB0aGF0IGV2ZXJ5IGtleSBpbiBgYWN0aW9uRGljdGAgY29ycmVzcG9uZHMgdG8gYSBzZW1hbnRpYyBhY3Rpb24sIGFuZCB0aGF0IGl0IG1hcHMgdG9cbiAgICAvLyBhIGZ1bmN0aW9uIG9mIHRoZSBjb3JyZWN0IGFyaXR5LiBJZiBub3QsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAgICBfY2hlY2tUb3BEb3duQWN0aW9uRGljdDogZnVuY3Rpb24gKHdoYXQsIG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gaXNTcGVjaWFsQWN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSAnX2l0ZXInIHx8IGEgPT09ICdfdGVybWluYWwnIHx8IGEgPT09ICdfbm9udGVybWluYWwnIHx8IGEgPT09ICdfZGVmYXVsdCc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb2JsZW1zID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gYWN0aW9uRGljdCkge1xuICAgICAgICAgICAgdmFyIHYgPSBhY3Rpb25EaWN0W2tdO1xuICAgICAgICAgICAgaWYgKCFpc1NwZWNpYWxBY3Rpb24oaykgJiYgIShrIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgICAgICAgICAgcHJvYmxlbXMucHVzaChcIidcIiArIGsgKyBcIicgaXMgbm90IGEgdmFsaWQgc2VtYW50aWMgYWN0aW9uIGZvciAnXCIgKyB0aGlzLm5hbWUgKyBcIidcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIG11c3QgYmUgYSBmdW5jdGlvbiBpbiBhbiBhY3Rpb24gZGljdGlvbmFyeSBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdHVhbCA9IHYubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBleHBlY3RlZCA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShrKTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ibGVtcy5wdXNoKFwiU2VtYW50aWMgYWN0aW9uICdcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBrICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBcIiArXG4gICAgICAgICAgICAgICAgICAgICAgICAnZXhwZWN0ZWQgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICAgICAgICAgICAgICAgICAnLCBnb3QgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWwpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvYmxlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHByZXR0eVByb2JsZW1zID0gcHJvYmxlbXMubWFwKGZ1bmN0aW9uIChwcm9ibGVtKSB7IHJldHVybiAnLSAnICsgcHJvYmxlbTsgfSk7XG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IoXCJGb3VuZCBlcnJvcnMgaW4gdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IG9mIHRoZSAnXCIgK1xuICAgICAgICAgICAgICAgIG5hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyBcIiArXG4gICAgICAgICAgICAgICAgd2hhdCArXG4gICAgICAgICAgICAgICAgJzpcXG4nICtcbiAgICAgICAgICAgICAgICBwcmV0dHlQcm9ibGVtcy5qb2luKCdcXG4nKSk7XG4gICAgICAgICAgICBlcnJvci5wcm9ibGVtcyA9IHByb2JsZW1zO1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vIFJldHVybiB0aGUgZXhwZWN0ZWQgYXJpdHkgZm9yIGEgc2VtYW50aWMgYWN0aW9uIG5hbWVkIGBhY3Rpb25OYW1lYCwgd2hpY2hcbiAgICAvLyBpcyBlaXRoZXIgYSBydWxlIG5hbWUgb3IgYSBzcGVjaWFsIGFjdGlvbiBuYW1lIGxpa2UgJ19ub250ZXJtaW5hbCcuXG4gICAgX3RvcERvd25BY3Rpb25Bcml0eTogZnVuY3Rpb24gKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgaWYgKGFjdGlvbk5hbWUgPT09ICdfaXRlcicgfHwgYWN0aW9uTmFtZSA9PT0gJ19ub250ZXJtaW5hbCcgfHwgYWN0aW9uTmFtZSA9PT0gJ19kZWZhdWx0Jykge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uTmFtZSA9PT0gJ190ZXJtaW5hbCcpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVzW2FjdGlvbk5hbWVdLmJvZHkuZ2V0QXJpdHkoKTtcbiAgICB9LFxuICAgIF9pbmhlcml0c0Zyb206IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgICAgIHZhciBnID0gdGhpcy5zdXBlckdyYW1tYXI7XG4gICAgICAgIHdoaWxlIChnKSB7XG4gICAgICAgICAgICBpZiAoZy5lcXVhbHMoZ3JhbW1hciwgdHJ1ZSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGcgPSBnLnN1cGVyR3JhbW1hcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICB0b1JlY2lwZTogZnVuY3Rpb24gKG9wdFZhck5hbWUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIG1ldGFJbmZvID0ge307XG4gICAgICAgIC8vIEluY2x1ZGUgdGhlIGdyYW1tYXIgc291cmNlIGlmIGl0IGlzIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICAgICAgICBtZXRhSW5mby5zb3VyY2UgPSB0aGlzLnNvdXJjZS5jb250ZW50cztcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3VwZXJHcmFtbWFyID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyICYmICF0aGlzLnN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgICAgICAgICAgc3VwZXJHcmFtbWFyID0gSlNPTi5wYXJzZSh0aGlzLnN1cGVyR3JhbW1hci50b1JlY2lwZSgpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RhcnRSdWxlID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgICAgICAgICAgc3RhcnRSdWxlID0gdGhpcy5kZWZhdWx0U3RhcnRSdWxlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBydWxlcyA9IHt9O1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICAgICAgdmFyIHJ1bGVJbmZvID0gX3RoaXMucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICAgICAgICAgICAgdmFyIGlzRGVmaW5pdGlvbiA9ICFfdGhpcy5zdXBlckdyYW1tYXIgfHwgIV90aGlzLnN1cGVyR3JhbW1hci5ydWxlc1tydWxlTmFtZV07XG4gICAgICAgICAgICB2YXIgb3BlcmF0aW9uO1xuICAgICAgICAgICAgaWYgKGlzRGVmaW5pdGlvbikge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9ICdkZWZpbmUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uID0gYm9keSBpbnN0YW5jZW9mIHBleHBycy5FeHRlbmQgPyAnZXh0ZW5kJyA6ICdvdmVycmlkZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgICAgICAgICAgIGlmIChydWxlSW5mby5zb3VyY2UgJiYgX3RoaXMuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkID0gcnVsZUluZm8uc291cmNlLnJlbGF0aXZlVG8oX3RoaXMuc291cmNlKTtcbiAgICAgICAgICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCA9IFthZGp1c3RlZC5zdGFydElkeCwgYWRqdXN0ZWQuZW5kSWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IGlzRGVmaW5pdGlvbiA/IHJ1bGVJbmZvLmRlc2NyaXB0aW9uIDogbnVsbDtcbiAgICAgICAgICAgIHZhciBib2R5UmVjaXBlID0gYm9keS5vdXRwdXRSZWNpcGUocnVsZUluZm8uZm9ybWFscywgX3RoaXMuc291cmNlKTtcbiAgICAgICAgICAgIHJ1bGVzW3J1bGVOYW1lXSA9IFtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24sXG4gICAgICAgICAgICAgICAgbWV0YUluZm8sXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgcnVsZUluZm8uZm9ybWFscyxcbiAgICAgICAgICAgICAgICBib2R5UmVjaXBlXG4gICAgICAgICAgICBdO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KFsnZ3JhbW1hcicsIG1ldGFJbmZvLCB0aGlzLm5hbWUsIHN1cGVyR3JhbW1hciwgc3RhcnRSdWxlLCBydWxlc10pO1xuICAgIH0sXG4gICAgLy8gVE9ETzogQ29tZSB1cCB3aXRoIGJldHRlciBuYW1lcyBmb3IgdGhlc2UgbWV0aG9kcy5cbiAgICAvLyBUT0RPOiBXcml0ZSB0aGUgYW5hbG9nIG9mIHRoZXNlIG1ldGhvZHMgZm9yIGluaGVyaXRlZCBhdHRyaWJ1dGVzLlxuICAgIHRvT3BlcmF0aW9uQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gICAgfSxcbiAgICB0b0F0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICAgIH0sXG4gICAgX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByX3BsdXNcbiAgICAgICAgLy8gc2hvdWxkIGFwcGVhciBuZXh0IHRvIG90aGVyIGNhc2VzIG9mIEFkZEV4cHIuXG4gICAgICAgIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gICAgICAgIHNiLmFwcGVuZCgneycpO1xuICAgICAgICB2YXIgZmlyc3QgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBydWxlTmFtZSBpbiB0aGlzLnJ1bGVzKSB7XG4gICAgICAgICAgICB2YXIgYm9keSA9IHRoaXMucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2IuYXBwZW5kKCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgICAgICAgICAgc2IuYXBwZW5kKCcgICcpO1xuICAgICAgICAgICAgdGhpcy5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBzYik7XG4gICAgICAgIH1cbiAgICAgICAgc2IuYXBwZW5kKCdcXG59Jyk7XG4gICAgICAgIHJldHVybiBzYi5jb250ZW50cygpO1xuICAgIH0sXG4gICAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24gKHJ1bGVOYW1lLCBib2R5LCBzYikge1xuICAgICAgICBzYi5hcHBlbmQocnVsZU5hbWUpO1xuICAgICAgICBzYi5hcHBlbmQoJzogZnVuY3Rpb24oJyk7XG4gICAgICAgIHZhciBhcml0eSA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShydWxlTmFtZSk7XG4gICAgICAgIHNiLmFwcGVuZChjb21tb24ucmVwZWF0KCdfJywgYXJpdHkpLmpvaW4oJywgJykpO1xuICAgICAgICBzYi5hcHBlbmQoJykge1xcbicpO1xuICAgICAgICBzYi5hcHBlbmQoJyAgfScpO1xuICAgIH0sXG4gICAgLy8gUGFyc2UgYSBzdHJpbmcgd2hpY2ggZXhwcmVzc2VzIGEgcnVsZSBhcHBsaWNhdGlvbiBpbiB0aGlzIGdyYW1tYXIsIGFuZCByZXR1cm4gdGhlXG4gICAgLy8gcmVzdWx0aW5nIEFwcGx5IG5vZGUuXG4gICAgcGFyc2VBcHBsaWNhdGlvbjogZnVuY3Rpb24gKHN0cikge1xuICAgICAgICB2YXIgYXBwO1xuICAgICAgICBpZiAoc3RyLmluZGV4T2YoJzwnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIHNpbXBsZSBhcHBsaWNhdGlvblxuICAgICAgICAgICAgYXBwID0gbmV3IHBleHBycy5BcHBseShzdHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gcGFyYW1ldGVyaXplZCBhcHBsaWNhdGlvblxuICAgICAgICAgICAgdmFyIGNzdCA9IG9obUdyYW1tYXIubWF0Y2goc3RyLCAnQmFzZV9hcHBsaWNhdGlvbicpO1xuICAgICAgICAgICAgYXBwID0gYnVpbGRHcmFtbWFyKGNzdCwge30pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHBsaWNhdGlvbiBpcyB2YWxpZC5cbiAgICAgICAgaWYgKCEoYXBwLnJ1bGVOYW1lIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZFJ1bGUoYXBwLnJ1bGVOYW1lLCB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmb3JtYWxzID0gdGhpcy5ydWxlc1thcHAucnVsZU5hbWVdLmZvcm1hbHM7XG4gICAgICAgIGlmIChmb3JtYWxzLmxlbmd0aCAhPT0gYXBwLmFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5ydWxlc1thcHAucnVsZU5hbWVdLnNvdXJjZTtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mUGFyYW1ldGVycyhhcHAucnVsZU5hbWUsIGZvcm1hbHMubGVuZ3RoLCBhcHAuYXJncy5sZW5ndGgsIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcDtcbiAgICB9XG59O1xuLy8gVGhlIGZvbGxvd2luZyBncmFtbWFyIGNvbnRhaW5zIGEgZmV3IHJ1bGVzIHRoYXQgY291bGRuJ3QgYmUgd3JpdHRlbiAgaW4gXCJ1c2VybGFuZFwiLlxuLy8gQXQgdGhlIGJvdHRvbSBvZiBzcmMvbWFpbi5qcywgd2UgY3JlYXRlIGEgc3ViLWdyYW1tYXIgb2YgdGhpcyBncmFtbWFyIHRoYXQncyBjYWxsZWRcbi8vIGBCdWlsdEluUnVsZXNgLiBUaGF0IGdyYW1tYXIgY29udGFpbnMgc2V2ZXJhbCBjb252ZW5pZW5jZSBydWxlcywgZS5nLiwgYGxldHRlcmAgYW5kXG4vLyBgZGlnaXRgLCBhbmQgaXMgaW1wbGljaXRseSB0aGUgc3VwZXItZ3JhbW1hciBvZiBhbnkgZ3JhbW1hciB3aG9zZSBzdXBlci1ncmFtbWFyXG4vLyBpc24ndCBzcGVjaWZpZWQuXG5HcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzID0gbmV3IEdyYW1tYXIoJ1Byb3RvQnVpbHRJblJ1bGVzJywgLy8gbmFtZVxudW5kZWZpbmVkLCAvLyBzdXBlcmdyYW1tYXJcbntcbiAgICBhbnk6IHtcbiAgICAgICAgYm9keTogcGV4cHJzLmFueSxcbiAgICAgICAgZm9ybWFsczogW10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYW55IGNoYXJhY3RlcicsXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgZW5kOiB7XG4gICAgICAgIGJvZHk6IHBleHBycy5lbmQsXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2VuZCBvZiBpbnB1dCcsXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgY2FzZUluc2Vuc2l0aXZlOiB7XG4gICAgICAgIGJvZHk6IG5ldyBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbChuZXcgcGV4cHJzLlBhcmFtKDApKSxcbiAgICAgICAgZm9ybWFsczogWydzdHInXSxcbiAgICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICBsb3dlcjoge1xuICAgICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMbCcpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhIGxvd2VyY2FzZSBsZXR0ZXInLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIHVwcGVyOiB7XG4gICAgICAgIGJvZHk6IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0x1JyksXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2FuIHVwcGVyY2FzZSBsZXR0ZXInLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIC8vIFVuaW9uIG9mIEx0ICh0aXRsZWNhc2UpLCBMbSAobW9kaWZpZXIpLCBhbmQgTG8gKG90aGVyKSwgaS5lLiBhbnkgbGV0dGVyIG5vdCBpbiBMbCBvciBMdS5cbiAgICB1bmljb2RlTHRtbzoge1xuICAgICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdG1vJyksXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2EgVW5pY29kZSBjaGFyYWN0ZXIgaW4gTHQsIExtLCBvciBMbycsXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgLy8gVGhlc2UgcnVsZXMgYXJlIG5vdCB0cnVseSBwcmltaXRpdmUgKHRoZXkgY291bGQgYmUgd3JpdHRlbiBpbiB1c2VybGFuZCkgYnV0IGFyZSBkZWZpbmVkXG4gICAgLy8gaGVyZSBmb3IgYm9vdHN0cmFwcGluZyBwdXJwb3Nlcy5cbiAgICBzcGFjZXM6IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5TdGFyKG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlJykpLFxuICAgICAgICBmb3JtYWxzOiBbXVxuICAgIH0sXG4gICAgc3BhY2U6IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5SYW5nZSgnXFx4MDAnLCAnICcpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhIHNwYWNlJ1xuICAgIH1cbn0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXI7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBTdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENvbnN0cnVjdG9yc1xuZnVuY3Rpb24gR3JhbW1hckRlY2wobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG59XG4vLyBIZWxwZXJzXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuc291cmNlSW50ZXJ2YWwgPSBmdW5jdGlvbiAoc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJJbnRlcnZhbChzdGFydElkeCwgZW5kSWR4IC0gc3RhcnRJZHgpO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5lbnN1cmVTdXBlckdyYW1tYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgICAgICB0aGlzLndpdGhTdXBlckdyYW1tYXIoXG4gICAgICAgIC8vIFRPRE86IFRoZSBjb25kaXRpb25hbCBleHByZXNzaW9uIGJlbG93IGlzIGFuIHVnbHkgaGFjay4gSXQncyBraW5kIG9mIG9rIGJlY2F1c2VcbiAgICAgICAgLy8gSSBkb3VidCBhbnlvbmUgd2lsbCBldmVyIHRyeSB0byBkZWNsYXJlIGEgZ3JhbW1hciBjYWxsZWQgYEJ1aWx0SW5SdWxlc2AuIFN0aWxsLFxuICAgICAgICAvLyB3ZSBzaG91bGQgdHJ5IHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMuXG4gICAgICAgIHRoaXMubmFtZSA9PT0gJ0J1aWx0SW5SdWxlcycgPyBHcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzIDogR3JhbW1hci5CdWlsdEluUnVsZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zdXBlckdyYW1tYXI7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLmVuc3VyZVN1cGVyR3JhbW1hclJ1bGVGb3JPdmVycmlkaW5nID0gZnVuY3Rpb24gKG5hbWUsIHNvdXJjZSkge1xuICAgIHZhciBydWxlSW5mbyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZXNbbmFtZV07XG4gICAgaWYgKCFydWxlSW5mbykge1xuICAgICAgICB0aHJvdyBlcnJvcnMuY2Fubm90T3ZlcnJpZGVVbmRlY2xhcmVkUnVsZShuYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lLCBzb3VyY2UpO1xuICAgIH1cbiAgICByZXR1cm4gcnVsZUluZm87XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUgPSBmdW5jdGlvbiAobmFtZSwgZm9ybWFscywgYm9keSwgc291cmNlKSB7XG4gICAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gICAgaWYgKGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBzb3VyY2UpO1xuICAgIH1cbiAgICB2YXIgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICAgIHZhciBleHBlY3RlZEZvcm1hbHMgPSBydWxlSW5mby5mb3JtYWxzO1xuICAgIHZhciBleHBlY3RlZE51bUZvcm1hbHMgPSBleHBlY3RlZEZvcm1hbHMgPyBleHBlY3RlZEZvcm1hbHMubGVuZ3RoIDogMDtcbiAgICBpZiAoZm9ybWFscy5sZW5ndGggIT09IGV4cGVjdGVkTnVtRm9ybWFscykge1xuICAgICAgICB0aHJvdyBlcnJvcnMud3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMobmFtZSwgZXhwZWN0ZWROdW1Gb3JtYWxzLCBmb3JtYWxzLmxlbmd0aCwgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5LCBydWxlSW5mby5kZXNjcmlwdGlvbiwgc291cmNlKTtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbCA9IGZ1bmN0aW9uIChuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKSB7XG4gICAgdGhpcy5ydWxlc1tuYW1lXSA9IHtcbiAgICAgICAgYm9keTogYm9keS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyksXG4gICAgICAgIGZvcm1hbHM6IGZvcm1hbHMsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcbiAgICAgICAgc291cmNlOiBzb3VyY2VcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIFN0dWZmIHRoYXQgeW91IHNob3VsZCBvbmx5IGRvIG9uY2VcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24gKHN1cGVyR3JhbW1hcikge1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3RoZSBzdXBlciBncmFtbWFyIG9mIGEgR3JhbW1hckRlY2wgY2Fubm90IGJlIHNldCBtb3JlIHRoYW4gb25jZScpO1xuICAgIH1cbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICB0aGlzLnJ1bGVzID0gT2JqZWN0LmNyZWF0ZShzdXBlckdyYW1tYXIucnVsZXMpO1xuICAgIC8vIEdyYW1tYXJzIHdpdGggYW4gZXhwbGljaXQgc3VwZXJncmFtbWFyIGluaGVyaXQgYSBkZWZhdWx0IHN0YXJ0IHJ1bGUuXG4gICAgaWYgKCFzdXBlckdyYW1tYXIuaXNCdWlsdEluKCkpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gc3VwZXJHcmFtbWFyLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoRGVmYXVsdFN0YXJ0UnVsZSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IHJ1bGVOYW1lO1xuICAgIHJldHVybiB0aGlzO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS53aXRoU291cmNlID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gbmV3IElucHV0U3RyZWFtKHNvdXJjZSkuaW50ZXJ2YWwoMCwgc291cmNlLmxlbmd0aCk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuLy8gQ3JlYXRlcyBhIEdyYW1tYXIgaW5zdGFuY2UsIGFuZCBpZiBpdCBwYXNzZXMgdGhlIHNhbml0eSBjaGVja3MsIHJldHVybnMgaXQuXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuYnVpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGdyYW1tYXIgPSBuZXcgR3JhbW1hcih0aGlzLm5hbWUsIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCksIHRoaXMucnVsZXMsIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSk7XG4gICAgLy8gVE9ETzogY2hhbmdlIHRoZSBwZXhwci5wcm90b3R5cGUuYXNzZXJ0Li4uIG1ldGhvZHMgdG8gbWFrZSB0aGVtIGFkZFxuICAgIC8vIGV4Y2VwdGlvbnMgdG8gYW4gYXJyYXkgdGhhdCdzIHByb3ZpZGVkIGFzIGFuIGFyZy4gVGhlbiB3ZSdsbCBiZSBhYmxlIHRvXG4gICAgLy8gc2hvdyBtb3JlIHRoYW4gb25lIGVycm9yIG9mIHRoZSBzYW1lIHR5cGUgYXQgYSB0aW1lLlxuICAgIC8vIFRPRE86IGluY2x1ZGUgdGhlIG9mZmVuZGluZyBwZXhwciBpbiB0aGUgZXJyb3JzLCB0aGF0IHdheSB3ZSBjYW4gc2hvd1xuICAgIC8vIHRoZSBwYXJ0IG9mIHRoZSBzb3VyY2UgdGhhdCBjYXVzZWQgaXQuXG4gICAgdmFyIGdyYW1tYXJFcnJvcnMgPSBbXTtcbiAgICB2YXIgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSBmYWxzZTtcbiAgICBPYmplY3Qua2V5cyhncmFtbWFyLnJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBib2R5LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBib2R5LmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgICAgICAgZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucykge1xuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGNhbiBvbmx5IGJlIGRvbmUgaWYgdGhlIGdyYW1tYXIgaGFzIG5vIGludmFsaWQgYXBwbGljYXRpb25zLlxuICAgICAgICBPYmplY3Qua2V5cyhncmFtbWFyLnJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVzW3J1bGVOYW1lXS5ib2R5O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBib2R5LmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyLCBbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChncmFtbWFyRXJyb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZXJyb3JzLnRocm93RXJyb3JzKGdyYW1tYXJFcnJvcnMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgICAgZ3JhbW1hci5zb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICB9XG4gICAgcmV0dXJuIGdyYW1tYXI7XG59O1xuLy8gUnVsZSBkZWNsYXJhdGlvbnNcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5kZWZpbmUgPSBmdW5jdGlvbiAobmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSkge1xuICAgIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCk7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyLnJ1bGVzW25hbWVdKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lLCBzb3VyY2UpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnJ1bGVzW25hbWVdKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24obmFtZSwgdGhpcy5uYW1lLCB0aGlzLm5hbWUsIHNvdXJjZSk7XG4gICAgfVxuICAgIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICAgIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuaW5zdGFsbChuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKTtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUub3ZlcnJpZGUgPSBmdW5jdGlvbiAobmFtZSwgZm9ybWFscywgYm9keSwgZGVzY0lnbm9yZWQsIHNvdXJjZSkge1xuICAgIHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyUnVsZUZvck92ZXJyaWRpbmcobmFtZSwgc291cmNlKTtcbiAgICB0aGlzLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUobmFtZSwgZm9ybWFscywgYm9keSwgc291cmNlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZXh0ZW5kID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGZyYWdtZW50LCBkZXNjSWdub3JlZCwgc291cmNlKSB7XG4gICAgdmFyIHJ1bGVJbmZvID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlc1tuYW1lXTtcbiAgICBpZiAoIXJ1bGVJbmZvKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5jYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZShuYW1lLCB0aGlzLnN1cGVyR3JhbW1hci5uYW1lLCBzb3VyY2UpO1xuICAgIH1cbiAgICB2YXIgYm9keSA9IG5ldyBwZXhwcnMuRXh0ZW5kKHRoaXMuc3VwZXJHcmFtbWFyLCBuYW1lLCBmcmFnbWVudCk7XG4gICAgYm9keS5zb3VyY2UgPSBmcmFnbWVudC5zb3VyY2U7XG4gICAgdGhpcy5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlKG5hbWUsIGZvcm1hbHMsIGJvZHksIHNvdXJjZSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXJEZWNsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIElucHV0U3RyZWFtKHNvdXJjZSkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMucG9zID0gMDtcbiAgICB0aGlzLmV4YW1pbmVkTGVuZ3RoID0gMDtcbn1cbklucHV0U3RyZWFtLnByb3RvdHlwZSA9IHtcbiAgICBhdEVuZDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5zID0gdGhpcy5wb3MgPT09IHRoaXMuc291cmNlLmxlbmd0aDtcbiAgICAgICAgdGhpcy5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KHRoaXMuZXhhbWluZWRMZW5ndGgsIHRoaXMucG9zICsgMSk7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbnMgPSB0aGlzLnNvdXJjZVt0aGlzLnBvcysrXTtcbiAgICAgICAgdGhpcy5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KHRoaXMuZXhhbWluZWRMZW5ndGgsIHRoaXMucG9zKTtcbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuICAgIG1hdGNoU3RyaW5nOiBmdW5jdGlvbiAocywgb3B0SWdub3JlQ2FzZSkge1xuICAgICAgICB2YXIgaWR4O1xuICAgICAgICBpZiAob3B0SWdub3JlQ2FzZSkge1xuICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgQ2FzZS1pbnNlbnNpdGl2ZSBjb21wYXJpc29uIGlzIGEgdHJpY2t5IGJ1c2luZXNzLiBTb21lIG5vdGFibGUgZ290Y2hhcyBpbmNsdWRlIHRoZVxuICAgICAgICAgICAgICBcIlR1cmtpc2ggSVwiIHByb2JsZW0gKGh0dHA6Ly93d3cuaTE4bmd1eS5jb20vdW5pY29kZS90dXJraXNoLWkxOG4uaHRtbCkgYW5kIHRoZSBmYWN0XG4gICAgICAgICAgICAgIHRoYXQgdGhlIEdlcm1hbiBFc3N6ZXQgKMOfKSB0dXJucyBpbnRvIFwiU1NcIiBpbiB1cHBlciBjYXNlLlxuICAgICAgXG4gICAgICAgICAgICAgIFRoaXMgaXMgaW50ZW5kZWQgdG8gYmUgYSBsb2NhbGUtaW52YXJpYW50IGNvbXBhcmlzb24sIHdoaWNoIG1lYW5zIGl0IG1heSBub3Qgb2JleVxuICAgICAgICAgICAgICBsb2NhbGUtc3BlY2lmaWMgZXhwZWN0YXRpb25zIChlLmcuIFwiaVwiID0+IFwixLBcIikuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdHVhbCA9IHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgIHZhciBleHBlY3RlZCA9IHNbaWR4XTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsID09IG51bGwgfHwgYWN0dWFsLnRvVXBwZXJDYXNlKCkgIT09IGV4cGVjdGVkLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERlZmF1bHQgaXMgY2FzZS1zZW5zaXRpdmUgY29tcGFyaXNvbi5cbiAgICAgICAgZm9yIChpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLm5leHQoKSAhPT0gc1tpZHhdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgc291cmNlU2xpY2U6IGZ1bmN0aW9uIChzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zbGljZShzdGFydElkeCwgZW5kSWR4KTtcbiAgICB9LFxuICAgIGludGVydmFsOiBmdW5jdGlvbiAoc3RhcnRJZHgsIG9wdEVuZElkeCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlLCBzdGFydElkeCwgb3B0RW5kSWR4ID8gb3B0RW5kSWR4IDogdGhpcy5wb3MpO1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gSW5wdXRTdHJlYW07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2NvbW1vbicpLmFzc2VydDtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gSW50ZXJ2YWwoc291cmNlU3RyaW5nLCBzdGFydElkeCwgZW5kSWR4KSB7XG4gICAgdGhpcy5zb3VyY2VTdHJpbmcgPSBzb3VyY2VTdHJpbmc7XG4gICAgdGhpcy5zdGFydElkeCA9IHN0YXJ0SWR4O1xuICAgIHRoaXMuZW5kSWR4ID0gZW5kSWR4O1xufVxuSW50ZXJ2YWwuY292ZXJhZ2UgPSBmdW5jdGlvbiAoIC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgICB2YXIgc291cmNlU3RyaW5nID0gYXJndW1lbnRzWzBdLnNvdXJjZVN0cmluZztcbiAgICB2YXIgc3RhcnRJZHggPSBhcmd1bWVudHNbMF0uc3RhcnRJZHg7XG4gICAgdmFyIGVuZElkeCA9IGFyZ3VtZW50c1swXS5lbmRJZHg7XG4gICAgZm9yICh2YXIgaWR4ID0gMTsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gYXJndW1lbnRzW2lkeF07XG4gICAgICAgIGlmIChpbnRlcnZhbC5zb3VyY2VTdHJpbmcgIT09IHNvdXJjZVN0cmluZykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhcnRJZHggPSBNYXRoLm1pbihzdGFydElkeCwgYXJndW1lbnRzW2lkeF0uc3RhcnRJZHgpO1xuICAgICAgICAgICAgZW5kSWR4ID0gTWF0aC5tYXgoZW5kSWR4LCBhcmd1bWVudHNbaWR4XS5lbmRJZHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwoc291cmNlU3RyaW5nLCBzdGFydElkeCwgZW5kSWR4KTtcbn07XG5JbnRlcnZhbC5wcm90b3R5cGUgPSB7XG4gICAgY292ZXJhZ2VXaXRoOiBmdW5jdGlvbiAoIC8qIGludGVydmFsMSwgaW50ZXJ2YWwyLCAuLi4gKi8pIHtcbiAgICAgICAgdmFyIGludGVydmFscyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIGludGVydmFscy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gSW50ZXJ2YWwuY292ZXJhZ2UuYXBwbHkodW5kZWZpbmVkLCBpbnRlcnZhbHMpO1xuICAgIH0sXG4gICAgY29sbGFwc2VkTGVmdDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGlzLnN0YXJ0SWR4KTtcbiAgICB9LFxuICAgIGNvbGxhcHNlZFJpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuZW5kSWR4LCB0aGlzLmVuZElkeCk7XG4gICAgfSxcbiAgICBnZXRMaW5lQW5kQ29sdW1uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW4odGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgpO1xuICAgIH0sXG4gICAgZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJhbmdlID0gW3RoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4XTtcbiAgICAgICAgcmV0dXJuIHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHJhbmdlKTtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgYW4gYXJyYXkgb2YgMCwgMSwgb3IgMiBpbnRlcnZhbHMgdGhhdCByZXByZXNlbnRzIHRoZSByZXN1bHQgb2YgdGhlXG4gICAgLy8gaW50ZXJ2YWwgZGlmZmVyZW5jZSBvcGVyYXRpb24uXG4gICAgbWludXM6IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZVN0cmluZyAhPT0gdGhhdC5zb3VyY2VTdHJpbmcpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4ID09PSB0aGF0LnN0YXJ0SWR4ICYmIHRoaXMuZW5kSWR4ID09PSB0aGF0LmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoaXNgIGFuZCBgdGhhdGAgYXJlIHRoZSBzYW1lIGludGVydmFsIVxuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBzcGxpdHMgYHRoaXNgIGludG8gdHdvIGludGVydmFsc1xuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpLFxuICAgICAgICAgICAgICAgIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhhdC5lbmRJZHgsIHRoaXMuZW5kSWR4KVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5lbmRJZHggJiYgdGhhdC5lbmRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgcHJlZml4IG9mIGB0aGlzYFxuICAgICAgICAgICAgcmV0dXJuIFtuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoYXQuZW5kSWR4LCB0aGlzLmVuZElkeCldO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuc3RhcnRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgc3VmZml4IG9mIGB0aGlzYFxuICAgICAgICAgICAgcmV0dXJuIFtuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBhbmQgYHRoaXNgIGRvIG5vdCBvdmVybGFwXG4gICAgICAgICAgICByZXR1cm4gW3RoaXNdO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBSZXR1cm5zIGEgbmV3IEludGVydmFsIHRoYXQgaGFzIHRoZSBzYW1lIGV4dGVudCBhcyB0aGlzIG9uZSwgYnV0IHdoaWNoIGlzIHJlbGF0aXZlXG4gICAgLy8gdG8gYHRoYXRgLCBhbiBJbnRlcnZhbCB0aGF0IGZ1bGx5IGNvdmVycyB0aGlzIG9uZS5cbiAgICByZWxhdGl2ZVRvOiBmdW5jdGlvbiAodGhhdCkge1xuICAgICAgICBpZiAodGhpcy5zb3VyY2VTdHJpbmcgIT09IHRoYXQuc291cmNlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgYXNzZXJ0KHRoaXMuc3RhcnRJZHggPj0gdGhhdC5zdGFydElkeCAmJiB0aGlzLmVuZElkeCA8PSB0aGF0LmVuZElkeCwgJ290aGVyIGludGVydmFsIGRvZXMgbm90IGNvdmVyIHRoaXMgb25lJyk7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHggLSB0aGF0LnN0YXJ0SWR4LCB0aGlzLmVuZElkeCAtIHRoYXQuc3RhcnRJZHgpO1xuICAgIH0sXG4gICAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB3aGljaCBjb250YWlucyB0aGUgc2FtZSBjb250ZW50cyBhcyB0aGlzIG9uZSxcbiAgICAvLyBidXQgd2l0aCB3aGl0ZXNwYWNlIHRyaW1tZWQgZnJvbSBib3RoIGVuZHMuIChUaGlzIG9ubHkgbWFrZXMgc2Vuc2Ugd2hlblxuICAgIC8vIHRoZSBpbnB1dCBzdHJlYW0gaXMgYSBzdHJpbmcuKVxuICAgIHRyaW1tZWQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbnRlbnRzID0gdGhpcy5jb250ZW50cztcbiAgICAgICAgdmFyIHN0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIGNvbnRlbnRzLm1hdGNoKC9eXFxzKi8pWzBdLmxlbmd0aDtcbiAgICAgICAgdmFyIGVuZElkeCA9IHRoaXMuZW5kSWR4IC0gY29udGVudHMubWF0Y2goL1xccyokLylbMF0ubGVuZ3RoO1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCBzdGFydElkeCwgZW5kSWR4KTtcbiAgICB9LFxuICAgIHN1YkludGVydmFsOiBmdW5jdGlvbiAob2Zmc2V0LCBsZW4pIHtcbiAgICAgICAgdmFyIG5ld1N0YXJ0SWR4ID0gdGhpcy5zdGFydElkeCArIG9mZnNldDtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgbmV3U3RhcnRJZHgsIG5ld1N0YXJ0SWR4ICsgbGVuKTtcbiAgICB9XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoSW50ZXJ2YWwucHJvdG90eXBlLCB7XG4gICAgY29udGVudHM6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fY29udGVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnRzID0gdGhpcy5zb3VyY2VTdHJpbmcuc2xpY2UodGhpcy5zdGFydElkeCwgdGhpcy5lbmRJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBsZW5ndGg6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbmRJZHggLSB0aGlzLnN0YXJ0SWR4O1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxufSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWw7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gTWF0Y2hSZXN1bHQobWF0Y2hlciwgaW5wdXQsIHN0YXJ0RXhwciwgY3N0LCBjc3RPZmZzZXQsIHJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgb3B0UmVjb3JkZWRGYWlsdXJlcykge1xuICAgIHRoaXMubWF0Y2hlciA9IG1hdGNoZXI7XG4gICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuc3RhcnRFeHByID0gc3RhcnRFeHByO1xuICAgIHRoaXMuX2NzdCA9IGNzdDtcbiAgICB0aGlzLl9jc3RPZmZzZXQgPSBjc3RPZmZzZXQ7XG4gICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzID0gb3B0UmVjb3JkZWRGYWlsdXJlcztcbiAgICBpZiAodGhpcy5mYWlsZWQoKSkge1xuICAgICAgICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRldGFpbCA9ICdFeHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICAgICAgICAgIHJldHVybiAodXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSh0aGlzLmlucHV0LCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKSArIGRldGFpbCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdzaG9ydE1lc3NhZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgZGV0YWlsID0gJ2V4cGVjdGVkICcgKyB0aGlzLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgICAgICAgdmFyIGVycm9ySW5mbyA9IHV0aWwuZ2V0TGluZUFuZENvbHVtbih0aGlzLmlucHV0LCB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIHJldHVybiAnTGluZSAnICsgZXJyb3JJbmZvLmxpbmVOdW0gKyAnLCBjb2wgJyArIGVycm9ySW5mby5jb2xOdW0gKyAnOiAnICsgZGV0YWlsO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuc3VjY2VlZGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhIXRoaXMuX2NzdDtcbn07XG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZmFpbGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhdGhpcy5zdWNjZWVkZWQoKTtcbn07XG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb247XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldFJpZ2h0bW9zdEZhaWx1cmVzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fcmlnaHRtb3N0RmFpbHVyZXMpIHtcbiAgICAgICAgdGhpcy5tYXRjaGVyLnNldElucHV0KHRoaXMuaW5wdXQpO1xuICAgICAgICB2YXIgbWF0Y2hSZXN1bHRXaXRoRmFpbHVyZXMgPSB0aGlzLm1hdGNoZXIuX21hdGNoKHRoaXMuc3RhcnRFeHByLCBmYWxzZSwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSk7XG4gICAgICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzID0gbWF0Y2hSZXN1bHRXaXRoRmFpbHVyZXMuZ2V0UmlnaHRtb3N0RmFpbHVyZXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzO1xufTtcbk1hdGNoUmVzdWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdWNjZWVkZWQoKVxuICAgICAgICA/ICdbbWF0Y2ggc3VjY2VlZGVkXSdcbiAgICAgICAgOiAnW21hdGNoIGZhaWxlZCBhdCBwb3NpdGlvbiAnICsgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSArICddJztcbn07XG4vLyBSZXR1cm4gYSBzdHJpbmcgc3VtbWFyaXppbmcgdGhlIGV4cGVjdGVkIGNvbnRlbnRzIG9mIHRoZSBpbnB1dCBzdHJlYW0gd2hlblxuLy8gdGhlIG1hdGNoIGZhaWx1cmUgb2NjdXJyZWQuXG5NYXRjaFJlc3VsdC5wcm90b3R5cGUuZ2V0RXhwZWN0ZWRUZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN1Y2NlZWRlZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBleHBlY3RlZCB0ZXh0IG9mIGEgc3VjY2Vzc2Z1bCBNYXRjaFJlc3VsdCcpO1xuICAgIH1cbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHZhciBmYWlsdXJlcyA9IHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZXMoKTtcbiAgICAvLyBGaWx0ZXIgb3V0IHRoZSBmbHVmZnkgZmFpbHVyZXMgdG8gbWFrZSB0aGUgZGVmYXVsdCBlcnJvciBtZXNzYWdlcyBtb3JlIHVzZWZ1bFxuICAgIGZhaWx1cmVzID0gZmFpbHVyZXMuZmlsdGVyKGZ1bmN0aW9uIChmYWlsdXJlKSB7IHJldHVybiAhZmFpbHVyZS5pc0ZsdWZmeSgpOyB9KTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBmYWlsdXJlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGlmIChpZHggPiAwKSB7XG4gICAgICAgICAgICBpZiAoaWR4ID09PSBmYWlsdXJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgc2IuYXBwZW5kKGZhaWx1cmVzLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoZmFpbHVyZXNbaWR4XS50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEludGVydmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3MgPSB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpO1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dCwgcG9zLCBwb3MpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFJlc3VsdDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIFBvc0luZm8gPSByZXF1aXJlKCcuL1Bvc0luZm8nKTtcbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgYXBwbHlTcGFjZXMgPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXMnKTtcbmZ1bmN0aW9uIE1hdGNoU3RhdGUobWF0Y2hlciwgc3RhcnRFeHByLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuICAgIHRoaXMuc3RhcnRFeHByID0gc3RhcnRFeHByO1xuICAgIHRoaXMuZ3JhbW1hciA9IG1hdGNoZXIuZ3JhbW1hcjtcbiAgICB0aGlzLmlucHV0ID0gbWF0Y2hlci5pbnB1dDtcbiAgICB0aGlzLmlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoZXIuaW5wdXQpO1xuICAgIHRoaXMubWVtb1RhYmxlID0gbWF0Y2hlci5tZW1vVGFibGU7XG4gICAgdGhpcy5fYmluZGluZ3MgPSBbXTtcbiAgICB0aGlzLl9iaW5kaW5nT2Zmc2V0cyA9IFtdO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sgPSBbXTtcbiAgICB0aGlzLl9wb3NTdGFjayA9IFswXTtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sgPSBbZmFsc2VdO1xuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sgPSBbXTtcbiAgICB0aGlzLl9yZWNvcmRlZEZhaWx1cmVzU3RhY2sgPSBbXTtcbiAgICBpZiAob3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgPSBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXM7XG4gICAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxufVxuTWF0Y2hTdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgcG9zVG9PZmZzZXQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgcmV0dXJuIHBvcyAtIHRoaXMuX3Bvc1N0YWNrW3RoaXMuX3Bvc1N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH0sXG4gICAgZW50ZXJBcHBsaWNhdGlvbjogZnVuY3Rpb24gKHBvc0luZm8sIGFwcCkge1xuICAgICAgICB0aGlzLl9wb3NTdGFjay5wdXNoKHRoaXMuaW5wdXRTdHJlYW0ucG9zKTtcbiAgICAgICAgdGhpcy5fYXBwbGljYXRpb25TdGFjay5wdXNoKGFwcCk7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wdXNoKGZhbHNlKTtcbiAgICAgICAgcG9zSW5mby5lbnRlcihhcHApO1xuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wdXNoKHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSAtMTtcbiAgICB9LFxuICAgIGV4aXRBcHBsaWNhdGlvbjogZnVuY3Rpb24gKHBvc0luZm8sIG9wdE5vZGUpIHtcbiAgICAgICAgdmFyIG9yaWdQb3MgPSB0aGlzLl9wb3NTdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5fYXBwbGljYXRpb25TdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnBvcCgpO1xuICAgICAgICBwb3NJbmZvLmV4aXQoKTtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSBNYXRoLm1heCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucG9wKCkpO1xuICAgICAgICBpZiAob3B0Tm9kZSkge1xuICAgICAgICAgICAgdGhpcy5wdXNoQmluZGluZyhvcHROb2RlLCBvcmlnUG9zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW50ZXJMZXhpZmllZENvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnB1c2godHJ1ZSk7XG4gICAgfSxcbiAgICBleGl0TGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgICB9LFxuICAgIGN1cnJlbnRBcHBsaWNhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbGljYXRpb25TdGFja1t0aGlzLl9hcHBsaWNhdGlvblN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH0sXG4gICAgaW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN1cnJlbnRBcHBsaWNhdGlvbiA9IHRoaXMuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgICAgIGlmIChjdXJyZW50QXBwbGljYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50QXBwbGljYXRpb24uaXNTeW50YWN0aWMoKSAmJiAhdGhpcy5pbkxleGlmaWVkQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIHRvcC1sZXZlbCBjb250ZXh0IGlzIHN5bnRhY3RpYyBpZiB0aGUgc3RhcnQgYXBwbGljYXRpb24gaXMuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydEV4cHIuZmFjdG9yc1swXS5pc1N5bnRhY3RpYygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpbkxleGlmaWVkQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrW3RoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5sZW5ndGggLSAxXTtcbiAgICB9LFxuICAgIHNraXBTcGFjZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgICAgIHRoaXMuZXZhbChhcHBseVNwYWNlcyk7XG4gICAgICAgIHRoaXMucG9wQmluZGluZygpO1xuICAgICAgICB0aGlzLnBvcEZhaWx1cmVzSW5mbygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gICAgfSxcbiAgICBza2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5TeW50YWN0aWNDb250ZXh0KCkgPyB0aGlzLnNraXBTcGFjZXMoKSA6IHRoaXMuaW5wdXRTdHJlYW0ucG9zO1xuICAgIH0sXG4gICAgbWF5YmVTa2lwU3BhY2VzQmVmb3JlOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIHBleHBycy5BcHBseSAmJiBleHByLmlzU3ludGFjdGljKCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNraXBTcGFjZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChleHByLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UoKSAmJiBleHByICE9PSBhcHBseVNwYWNlcykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHB1c2hCaW5kaW5nOiBmdW5jdGlvbiAobm9kZSwgb3JpZ1Bvcykge1xuICAgICAgICB0aGlzLl9iaW5kaW5ncy5wdXNoKG5vZGUpO1xuICAgICAgICB0aGlzLl9iaW5kaW5nT2Zmc2V0cy5wdXNoKHRoaXMucG9zVG9PZmZzZXQob3JpZ1BvcykpO1xuICAgIH0sXG4gICAgcG9wQmluZGluZzogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9iaW5kaW5ncy5wb3AoKTtcbiAgICAgICAgdGhpcy5fYmluZGluZ09mZnNldHMucG9wKCk7XG4gICAgfSxcbiAgICBudW1CaW5kaW5nczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgIH0sXG4gICAgdHJ1bmNhdGVCaW5kaW5nczogZnVuY3Rpb24gKG5ld0xlbmd0aCkge1xuICAgICAgICAvLyBZZXMsIHRoaXMgaXMgdGhpcyByZWFsbHkgZmFzdGVyIHRoYW4gc2V0dGluZyB0aGUgYGxlbmd0aGAgcHJvcGVydHkgKHRlc3RlZCB3aXRoXG4gICAgICAgIC8vIGJpbi9lczViZW5jaCBvbiBOb2RlIHY2LjEuMCkuXG4gICAgICAgIHdoaWxlICh0aGlzLl9iaW5kaW5ncy5sZW5ndGggPiBuZXdMZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucG9wQmluZGluZygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRDdXJyZW50UG9zSW5mbzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQb3NJbmZvKHRoaXMuaW5wdXRTdHJlYW0ucG9zKTtcbiAgICB9LFxuICAgIGdldFBvc0luZm86IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgICAgICBpZiAoIXBvc0luZm8pIHtcbiAgICAgICAgICAgIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdID0gbmV3IFBvc0luZm8oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9zSW5mbztcbiAgICB9LFxuICAgIHByb2Nlc3NGYWlsdXJlOiBmdW5jdGlvbiAocG9zLCBleHByKSB7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIHBvcyk7XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMgJiYgcG9zID09PSB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgICAgICAgICAgdmFyIGFwcCA9IHRoaXMuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgICAgICAgICBpZiAoYXBwKSB7XG4gICAgICAgICAgICAgICAgLy8gU3Vic3RpdHV0ZSBwYXJhbWV0ZXJzIHdpdGggdGhlIGFjdHVhbCBwZXhwcnMgdGhhdCB3ZXJlIHBhc3NlZCB0b1xuICAgICAgICAgICAgICAgIC8vIHRoZSBjdXJyZW50IHJ1bGUuXG4gICAgICAgICAgICAgICAgZXhwciA9IGV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhcHAuYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGJyYW5jaCBpcyBvbmx5IHJlYWNoZWQgZm9yIHRoZSBcImVuZC1jaGVja1wiIHRoYXQgaXNcbiAgICAgICAgICAgICAgICAvLyBwZXJmb3JtZWQgYWZ0ZXIgdGhlIHRvcC1sZXZlbCBhcHBsaWNhdGlvbi4gSW4gdGhhdCBjYXNlLFxuICAgICAgICAgICAgICAgIC8vIGV4cHIgPT09IHBleHBycy5lbmQgc28gdGhlcmUgaXMgbm8gbmVlZCB0byBzdWJzdGl0dXRlXG4gICAgICAgICAgICAgICAgLy8gcGFyYW1ldGVycy5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVjb3JkRmFpbHVyZShleHByLnRvRmFpbHVyZSh0aGlzLmdyYW1tYXIpLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlY29yZEZhaWx1cmU6IGZ1bmN0aW9uIChmYWlsdXJlLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgICAgIHZhciBrZXkgPSBmYWlsdXJlLnRvS2V5KCk7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldID0gc2hvdWxkQ2xvbmVJZk5ldyA/IGZhaWx1cmUuY2xvbmUoKSA6IGZhaWx1cmU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0uaXNGbHVmZnkoKSAmJiAhZmFpbHVyZS5pc0ZsdWZmeSgpKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XS5jbGVhckZsdWZmeSgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWNvcmRGYWlsdXJlczogZnVuY3Rpb24gKGZhaWx1cmVzLCBzaG91bGRDbG9uZUlmTmV3KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5rZXlzKGZhaWx1cmVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIF90aGlzLnJlY29yZEZhaWx1cmUoZmFpbHVyZXNba2V5XSwgc2hvdWxkQ2xvbmVJZk5ldyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY2xvbmVSZWNvcmRlZEZhaWx1cmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgYW5zW2tleV0gPSBfdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0uY2xvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBnZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xuICAgIH0sXG4gICAgX2dldFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID49IDBcbiAgICAgICAgICAgID8gdGhpcy5wb3NUb09mZnNldCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbilcbiAgICAgICAgICAgIDogLTE7XG4gICAgfSxcbiAgICAvLyBSZXR1cm5zIHRoZSBtZW1vaXplZCB0cmFjZSBlbnRyeSBmb3IgYGV4cHJgIGF0IGBwb3NgLCBpZiBvbmUgZXhpc3RzLCBgbnVsbGAgb3RoZXJ3aXNlLlxuICAgIGdldE1lbW9pemVkVHJhY2VFbnRyeTogZnVuY3Rpb24gKHBvcywgZXhwcikge1xuICAgICAgICB2YXIgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgICAgIGlmIChwb3NJbmZvICYmIGV4cHIucnVsZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBtZW1vUmVjID0gcG9zSW5mby5tZW1vW2V4cHIudG9NZW1vS2V5KCldO1xuICAgICAgICAgICAgaWYgKG1lbW9SZWMgJiYgbWVtb1JlYy50cmFjZUVudHJ5KSB7XG4gICAgICAgICAgICAgICAgdmFyIGVudHJ5ID0gbWVtb1JlYy50cmFjZUVudHJ5LmNsb25lV2l0aEV4cHIoZXhwcik7XG4gICAgICAgICAgICAgICAgZW50cnkuaXNNZW1vaXplZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG4gICAgLy8gUmV0dXJucyBhIG5ldyB0cmFjZSBlbnRyeSwgd2l0aCB0aGUgY3VycmVudGx5IGFjdGl2ZSB0cmFjZSBhcnJheSBhcyBpdHMgY2hpbGRyZW4uXG4gICAgZ2V0VHJhY2VFbnRyeTogZnVuY3Rpb24gKHBvcywgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncykge1xuICAgICAgICBpZiAoZXhwciBpbnN0YW5jZW9mIHBleHBycy5BcHBseSkge1xuICAgICAgICAgICAgdmFyIGFwcCA9IHRoaXMuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgICAgICAgICB2YXIgYWN0dWFscyA9IGFwcCA/IGFwcC5hcmdzIDogW107XG4gICAgICAgICAgICBleHByID0gZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5nZXRNZW1vaXplZFRyYWNlRW50cnkocG9zLCBleHByKSB8fFxuICAgICAgICAgICAgbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHBvcywgdGhpcy5pbnB1dFN0cmVhbS5wb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MsIHRoaXMudHJhY2UpKTtcbiAgICB9LFxuICAgIGlzVHJhY2luZzogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gISF0aGlzLnRyYWNlO1xuICAgIH0sXG4gICAgaGFzTmVjZXNzYXJ5SW5mbzogZnVuY3Rpb24gKG1lbW9SZWMpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhY2UgJiYgIW1lbW9SZWMudHJhY2VFbnRyeSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMgJiZcbiAgICAgICAgICAgIHRoaXMuaW5wdXRTdHJlYW0ucG9zICsgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID09PSB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgICAgICAgICAgcmV0dXJuICEhbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICB1c2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24gKG9yaWdQb3MsIG1lbW9SZWMpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgICAgICAgIHRoaXMudHJhY2UucHVzaChtZW1vUmVjLnRyYWNlRW50cnkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZW1vUmVjUmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gdGhpcy5pbnB1dFN0cmVhbS5wb3MgKyBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pO1xuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyA9PT0gbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiAmJlxuICAgICAgICAgICAgbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkRmFpbHVyZXMobWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24sIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLmlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoICsgb3JpZ1Bvcyk7XG4gICAgICAgIGlmIChtZW1vUmVjLnZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0U3RyZWFtLnBvcyArPSBtZW1vUmVjLm1hdGNoTGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5wdXNoQmluZGluZyhtZW1vUmVjLnZhbHVlLCBvcmlnUG9zKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIC8vIEV2YWx1YXRlIGBleHByYCBhbmQgcmV0dXJuIGB0cnVlYCBpZiBpdCBzdWNjZWVkZWQsIGBmYWxzZWAgb3RoZXJ3aXNlLiBPbiBzdWNjZXNzLCBgYmluZGluZ3NgXG4gICAgLy8gd2lsbCBoYXZlIGBleHByLmdldEFyaXR5KClgIG1vcmUgZWxlbWVudHMgdGhhbiBiZWZvcmUsIGFuZCB0aGUgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gbWF5XG4gICAgLy8gaGF2ZSBpbmNyZWFzZWQuIE9uIGZhaWx1cmUsIGBiaW5kaW5nc2AgYW5kIHBvc2l0aW9uIHdpbGwgYmUgdW5jaGFuZ2VkLlxuICAgIGV2YWw6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBpbnB1dFN0cmVhbSA9IHRoaXMuaW5wdXRTdHJlYW07XG4gICAgICAgIHZhciBvcmlnTnVtQmluZGluZ3MgPSB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgICAgIHZhciBvcmlnUmVjb3JkZWRGYWlsdXJlcztcbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgb3JpZ1JlY29yZGVkRmFpbHVyZXMgPSB0aGlzLnJlY29yZGVkRmFpbHVyZXM7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgICB2YXIgbWVtb1BvcyA9IHRoaXMubWF5YmVTa2lwU3BhY2VzQmVmb3JlKGV4cHIpO1xuICAgICAgICB2YXIgb3JpZ1RyYWNlO1xuICAgICAgICBpZiAodGhpcy50cmFjZSkge1xuICAgICAgICAgICAgb3JpZ1RyYWNlID0gdGhpcy50cmFjZTtcbiAgICAgICAgICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEbyB0aGUgYWN0dWFsIGV2YWx1YXRpb24uXG4gICAgICAgIHZhciBhbnMgPSBleHByLmV2YWwodGhpcyk7XG4gICAgICAgIGlmICh0aGlzLnRyYWNlKSB7XG4gICAgICAgICAgICB2YXIgYmluZGluZ3MgPSB0aGlzLl9iaW5kaW5ncy5zbGljZShvcmlnTnVtQmluZGluZ3MpO1xuICAgICAgICAgICAgdmFyIHRyYWNlRW50cnkgPSB0aGlzLmdldFRyYWNlRW50cnkobWVtb1BvcywgZXhwciwgYW5zLCBiaW5kaW5ncyk7XG4gICAgICAgICAgICB0cmFjZUVudHJ5LmlzSW1wbGljaXRTcGFjZXMgPSBleHByID09PSBhcHBseVNwYWNlcztcbiAgICAgICAgICAgIHRyYWNlRW50cnkuaXNSb290Tm9kZSA9IGV4cHIgPT09IHRoaXMuc3RhcnRFeHByO1xuICAgICAgICAgICAgb3JpZ1RyYWNlLnB1c2godHJhY2VFbnRyeSk7XG4gICAgICAgICAgICB0aGlzLnRyYWNlID0gb3JpZ1RyYWNlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhbnMpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMgJiYgaW5wdXRTdHJlYW0ucG9zID09PSB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMucmVjb3JkZWRGYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XS5tYWtlRmx1ZmZ5KCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBSZXNldCB0aGUgcG9zaXRpb24gYW5kIHRoZSBiaW5kaW5ncy5cbiAgICAgICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICAgICAgICB0aGlzLnRydW5jYXRlQmluZGluZ3Mob3JpZ051bUJpbmRpbmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZEZhaWx1cmVzKG9yaWdSZWNvcmRlZEZhaWx1cmVzLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuICAgIGdldE1hdGNoUmVzdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuZXZhbCh0aGlzLnN0YXJ0RXhwcik7XG4gICAgICAgIHZhciByaWdodG1vc3RGYWlsdXJlcztcbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgcmlnaHRtb3N0RmFpbHVyZXMgPSBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBfdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV07IH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgTWF0Y2hSZXN1bHQodGhpcy5tYXRjaGVyLCB0aGlzLmlucHV0LCB0aGlzLnN0YXJ0RXhwciwgdGhpcy5fYmluZGluZ3NbMF0sIHRoaXMuX2JpbmRpbmdPZmZzZXRzWzBdLCB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgcmlnaHRtb3N0RmFpbHVyZXMpO1xuICAgIH0sXG4gICAgZ2V0VHJhY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy50cmFjZSA9IFtdO1xuICAgICAgICB2YXIgbWF0Y2hSZXN1bHQgPSB0aGlzLmdldE1hdGNoUmVzdWx0KCk7XG4gICAgICAgIC8vIFRoZSB0cmFjZSBub2RlIGZvciB0aGUgc3RhcnQgcnVsZSBpcyBhbHdheXMgdGhlIGxhc3QgZW50cnkuIElmIGl0IGlzIGEgc3ludGFjdGljIHJ1bGUsXG4gICAgICAgIC8vIHRoZSBmaXJzdCBlbnRyeSBpcyBmb3IgYW4gYXBwbGljYXRpb24gb2YgJ3NwYWNlcycuXG4gICAgICAgIC8vIFRPRE8ocGR1YnJveSk6IENsZWFuIHRoaXMgdXAgYnkgaW50cm9kdWNpbmcgYSBzcGVjaWFsIGBNYXRjaDxzdGFydEFwcGw+YCBydWxlLCB3aGljaCB3aWxsXG4gICAgICAgIC8vIGVuc3VyZSB0aGF0IHRoZXJlIGlzIGFsd2F5cyBhIHNpbmdsZSByb290IHRyYWNlIG5vZGUuXG4gICAgICAgIHZhciByb290VHJhY2UgPSB0aGlzLnRyYWNlW3RoaXMudHJhY2UubGVuZ3RoIC0gMV07XG4gICAgICAgIHJvb3RUcmFjZS5yZXN1bHQgPSBtYXRjaFJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHJvb3RUcmFjZTtcbiAgICB9LFxuICAgIHB1c2hGYWlsdXJlc0luZm86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucHVzaCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbik7XG4gICAgICAgIHRoaXMuX3JlY29yZGVkRmFpbHVyZXNTdGFjay5wdXNoKHRoaXMucmVjb3JkZWRGYWlsdXJlcyk7XG4gICAgfSxcbiAgICBwb3BGYWlsdXJlc0luZm86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrLnBvcCgpO1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hTdGF0ZTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIE1hdGNoU3RhdGUgPSByZXF1aXJlKCcuL01hdGNoU3RhdGUnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBNYXRjaGVyKGdyYW1tYXIpIHtcbiAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICAgIHRoaXMubWVtb1RhYmxlID0gW107XG4gICAgdGhpcy5pbnB1dCA9ICcnO1xufVxuTWF0Y2hlci5wcm90b3R5cGUuZ2V0SW5wdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXQ7XG59O1xuTWF0Y2hlci5wcm90b3R5cGUuc2V0SW5wdXQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgaWYgKHRoaXMuaW5wdXQgIT09IHN0cikge1xuICAgICAgICB0aGlzLnJlcGxhY2VJbnB1dFJhbmdlKDAsIHRoaXMuaW5wdXQubGVuZ3RoLCBzdHIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5NYXRjaGVyLnByb3RvdHlwZS5yZXBsYWNlSW5wdXRSYW5nZSA9IGZ1bmN0aW9uIChzdGFydElkeCwgZW5kSWR4LCBzdHIpIHtcbiAgICB2YXIgY3VycmVudElucHV0ID0gdGhpcy5pbnB1dDtcbiAgICBpZiAoc3RhcnRJZHggPCAwIHx8XG4gICAgICAgIHN0YXJ0SWR4ID4gY3VycmVudElucHV0Lmxlbmd0aCB8fFxuICAgICAgICBlbmRJZHggPCAwIHx8XG4gICAgICAgIGVuZElkeCA+IGN1cnJlbnRJbnB1dC5sZW5ndGggfHxcbiAgICAgICAgc3RhcnRJZHggPiBlbmRJZHgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGluZGljZXM6ICcgKyBzdGFydElkeCArICcgYW5kICcgKyBlbmRJZHgpO1xuICAgIH1cbiAgICAvLyB1cGRhdGUgaW5wdXRcbiAgICB0aGlzLmlucHV0ID0gY3VycmVudElucHV0LnNsaWNlKDAsIHN0YXJ0SWR4KSArIHN0ciArIGN1cnJlbnRJbnB1dC5zbGljZShlbmRJZHgpO1xuICAgIC8vIHVwZGF0ZSBtZW1vIHRhYmxlIChzaW1pbGFyIHRvIHRoZSBhYm92ZSlcbiAgICB2YXIgcmVzdE9mTWVtb1RhYmxlID0gdGhpcy5tZW1vVGFibGUuc2xpY2UoZW5kSWR4KTtcbiAgICB0aGlzLm1lbW9UYWJsZS5sZW5ndGggPSBzdGFydElkeDtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBzdHIubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLm1lbW9UYWJsZS5wdXNoKHVuZGVmaW5lZCk7XG4gICAgfVxuICAgIHJlc3RPZk1lbW9UYWJsZS5mb3JFYWNoKGZ1bmN0aW9uIChwb3NJbmZvKSB7XG4gICAgICAgIHRoaXMubWVtb1RhYmxlLnB1c2gocG9zSW5mbyk7XG4gICAgfSwgdGhpcyk7XG4gICAgLy8gSW52YWxpZGF0ZSBtZW1vUmVjc1xuICAgIGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IHN0YXJ0SWR4OyBwb3MrKykge1xuICAgICAgICB2YXIgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgICAgIGlmIChwb3NJbmZvKSB7XG4gICAgICAgICAgICBwb3NJbmZvLmNsZWFyT2Jzb2xldGVFbnRyaWVzKHBvcywgc3RhcnRJZHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2godGhpcy5fZ2V0U3RhcnRFeHByKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpLCBmYWxzZSk7XG59O1xuTWF0Y2hlci5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbiAob3B0U3RhcnRBcHBsaWNhdGlvblN0cikge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaCh0aGlzLl9nZXRTdGFydEV4cHIob3B0U3RhcnRBcHBsaWNhdGlvblN0ciksIHRydWUpO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLl9tYXRjaCA9IGZ1bmN0aW9uIChzdGFydEV4cHIsIHRyYWNpbmcsIG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgIHZhciBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKHRoaXMsIHN0YXJ0RXhwciwgb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKTtcbiAgICByZXR1cm4gdHJhY2luZyA/IHN0YXRlLmdldFRyYWNlKCkgOiBzdGF0ZS5nZXRNYXRjaFJlc3VsdCgpO1xufTtcbi8qXG4gIFJldHVybnMgdGhlIHN0YXJ0aW5nIGV4cHJlc3Npb24gZm9yIHRoaXMgTWF0Y2hlcidzIGFzc29jaWF0ZWQgZ3JhbW1hci4gSWYgYG9wdFN0YXJ0QXBwbGljYXRpb25TdHJgXG4gIGlzIHNwZWNpZmllZCwgaXQgaXMgYSBzdHJpbmcgZXhwcmVzc2luZyBhIHJ1bGUgYXBwbGljYXRpb24gaW4gdGhlIGdyYW1tYXIuIElmIG5vdCBzcGVjaWZpZWQsIHRoZVxuICBncmFtbWFyJ3MgZGVmYXVsdCBzdGFydCBydWxlIHdpbGwgYmUgdXNlZC5cbiovXG5NYXRjaGVyLnByb3RvdHlwZS5fZ2V0U3RhcnRFeHByID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICB2YXIgYXBwbGljYXRpb25TdHIgPSBvcHRTdGFydEFwcGxpY2F0aW9uU3RyIHx8IHRoaXMuZ3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICAgIGlmICghYXBwbGljYXRpb25TdHIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHN0YXJ0IHJ1bGUgYXJndW1lbnQgLS0gdGhlIGdyYW1tYXIgaGFzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZS4nKTtcbiAgICB9XG4gICAgdmFyIHN0YXJ0QXBwID0gdGhpcy5ncmFtbWFyLnBhcnNlQXBwbGljYXRpb24oYXBwbGljYXRpb25TdHIpO1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlNlcShbc3RhcnRBcHAsIHBleHBycy5lbmRdKTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE5hbWVzcGFjZSgpIHsgfVxuTmFtZXNwYWNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5OYW1lc3BhY2UuYXNOYW1lc3BhY2UgPSBmdW5jdGlvbiAob2JqT3JOYW1lc3BhY2UpIHtcbiAgICBpZiAob2JqT3JOYW1lc3BhY2UgaW5zdGFuY2VvZiBOYW1lc3BhY2UpIHtcbiAgICAgICAgcmV0dXJuIG9iak9yTmFtZXNwYWNlO1xuICAgIH1cbiAgICByZXR1cm4gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZShvYmpPck5hbWVzcGFjZSk7XG59O1xuLy8gQ3JlYXRlIGEgbmV3IG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpcyBzcGVjaWZpZWQsIGFsbCBvZiBpdHMgcHJvcGVydGllc1xuLy8gd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlID0gZnVuY3Rpb24gKG9wdFByb3BzKSB7XG4gICAgcmV0dXJuIE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLnByb3RvdHlwZSwgb3B0UHJvcHMpO1xufTtcbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2Ugd2hpY2ggZXh0ZW5kcyBhbm90aGVyIG5hbWVzcGFjZS4gSWYgYG9wdFByb3BzYCBpc1xuLy8gc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXMgd2lsbCBiZSBjb3BpZWQgdG8gdGhlIG5ldyBuYW1lc3BhY2UuXG5OYW1lc3BhY2UuZXh0ZW5kID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgb3B0UHJvcHMpIHtcbiAgICBpZiAobmFtZXNwYWNlICE9PSBOYW1lc3BhY2UucHJvdG90eXBlICYmICEobmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdub3QgYSBOYW1lc3BhY2Ugb2JqZWN0OiAnICsgbmFtZXNwYWNlKTtcbiAgICB9XG4gICAgdmFyIG5zID0gT2JqZWN0LmNyZWF0ZShuYW1lc3BhY2UsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICAgIHZhbHVlOiBOYW1lc3BhY2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZXh0ZW5kKG5zLCBvcHRQcm9wcyk7XG59O1xuLy8gVE9ETzogU2hvdWxkIHRoaXMgYmUgYSByZWd1bGFyIG1ldGhvZD9cbk5hbWVzcGFjZS50b1N0cmluZyA9IGZ1bmN0aW9uIChucykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobnMpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBOYW1lc3BhY2U7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIFBvc0luZm8oKSB7XG4gICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IFtdOyAvLyBhY3RpdmUgYXBwbGljYXRpb25zIGF0IHRoaXMgcG9zaXRpb25cbiAgICB0aGlzLm1lbW8gPSB7fTtcbiAgICB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gMDtcbiAgICB0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPSAtMTtcbiAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdW5kZWZpbmVkO1xufVxuUG9zSW5mby5wcm90b3R5cGUgPSB7XG4gICAgaXNBY3RpdmU6IGZ1bmN0aW9uIChhcHBsaWNhdGlvbikge1xuICAgICAgICByZXR1cm4gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSA+PSAwO1xuICAgIH0sXG4gICAgZW50ZXI6IGZ1bmN0aW9uIChhcHBsaWNhdGlvbikge1xuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLnB1c2goYXBwbGljYXRpb24udG9NZW1vS2V5KCkpO1xuICAgIH0sXG4gICAgZXhpdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLnBvcCgpO1xuICAgIH0sXG4gICAgc3RhcnRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbiAoaGVhZEFwcGxpY2F0aW9uLCBtZW1vUmVjKSB7XG4gICAgICAgIG1lbW9SZWMuaXNMZWZ0UmVjdXJzaW9uID0gdHJ1ZTtcbiAgICAgICAgbWVtb1JlYy5oZWFkQXBwbGljYXRpb24gPSBoZWFkQXBwbGljYXRpb247XG4gICAgICAgIG1lbW9SZWMubmV4dExlZnRSZWN1cnNpb24gPSB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uO1xuICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gbWVtb1JlYztcbiAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjaztcbiAgICAgICAgdmFyIGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmluZGV4T2YoaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKSArIDE7XG4gICAgICAgIHZhciBpbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5zbGljZShpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUpO1xuICAgICAgICBtZW1vUmVjLmlzSW52b2x2ZWQgPSBmdW5jdGlvbiAoYXBwbGljYXRpb25NZW1vS2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzLmluZGV4T2YoYXBwbGljYXRpb25NZW1vS2V5KSA+PSAwO1xuICAgICAgICB9O1xuICAgICAgICBtZW1vUmVjLnVwZGF0ZUludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGlkeCA9IGluZGV4T2ZGaXJzdEludm9sdmVkUnVsZTsgaWR4IDwgYXBwbGljYXRpb25NZW1vS2V5U3RhY2subGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXkgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFja1tpZHhdO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc0ludm9sdmVkKGFwcGxpY2F0aW9uTWVtb0tleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzLnB1c2goYXBwbGljYXRpb25NZW1vS2V5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSxcbiAgICBlbmRMZWZ0UmVjdXJzaW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudExlZnRSZWN1cnNpb24gPSB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uLm5leHRMZWZ0UmVjdXJzaW9uO1xuICAgIH0sXG4gICAgLy8gTm90ZTogdGhpcyBtZXRob2QgZG9lc24ndCBnZXQgY2FsbGVkIGZvciB0aGUgXCJoZWFkXCIgb2YgYSBsZWZ0IHJlY3Vyc2lvbiAtLSBmb3IgTFIgaGVhZHMsXG4gICAgLy8gdGhlIG1lbW9pemVkIHJlc3VsdCAod2hpY2ggc3RhcnRzIG91dCBiZWluZyBhIGZhaWx1cmUpIGlzIGFsd2F5cyB1c2VkLlxuICAgIHNob3VsZFVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbiAobWVtb1JlYykge1xuICAgICAgICBpZiAoIW1lbW9SZWMuaXNMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSB0aGlzLmFwcGxpY2F0aW9uTWVtb0tleVN0YWNrO1xuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5ID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2tbaWR4XTtcbiAgICAgICAgICAgIGlmIChtZW1vUmVjLmlzSW52b2x2ZWQoYXBwbGljYXRpb25NZW1vS2V5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIG1lbW9pemU6IGZ1bmN0aW9uIChtZW1vS2V5LCBtZW1vUmVjKSB7XG4gICAgICAgIHRoaXMubWVtb1ttZW1vS2V5XSA9IG1lbW9SZWM7XG4gICAgICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLm1heEV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoKTtcbiAgICAgICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gTWF0aC5tYXgodGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0LCBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQpO1xuICAgICAgICByZXR1cm4gbWVtb1JlYztcbiAgICB9LFxuICAgIGNsZWFyT2Jzb2xldGVFbnRyaWVzOiBmdW5jdGlvbiAocG9zLCBpbnZhbGlkYXRlZElkeCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAocG9zICsgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA8PSBpbnZhbGlkYXRlZElkeCkge1xuICAgICAgICAgICAgLy8gT3B0aW1pemF0aW9uOiBub25lIG9mIHRoZSBydWxlIGFwcGxpY2F0aW9ucyB0aGF0IHdlcmUgbWVtb2l6ZWQgaGVyZSBleGFtaW5lZCB0aGVcbiAgICAgICAgICAgIC8vIGludGVydmFsIG9mIHRoZSBpbnB1dCB0aGF0IGNoYW5nZWQsIHNvIG5vdGhpbmcgaGFzIHRvIGJlIGludmFsaWRhdGVkLlxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBtZW1vID0gdGhpcy5tZW1vO1xuICAgICAgICB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gLTE7XG4gICAgICAgIE9iamVjdC5rZXlzKG1lbW8pLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgICAgIHZhciBtZW1vUmVjID0gbWVtb1trXTtcbiAgICAgICAgICAgIGlmIChwb3MgKyBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoID4gaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgbWVtb1trXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgoX3RoaXMubWF4RXhhbWluZWRMZW5ndGgsIG1lbW9SZWMuZXhhbWluZWRMZW5ndGgpO1xuICAgICAgICAgICAgICAgIF90aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPSBNYXRoLm1heChfdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0LCBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFBvc0luZm87XG4iLCIndXNlIHN0cmljdCc7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgSXRlcmF0aW9uTm9kZSA9IHJlcXVpcmUoJy4vbm9kZXMnKS5JdGVyYXRpb25Ob2RlO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBnbG9iYWxBY3Rpb25TdGFjayA9IFtdO1xudmFyIHByb3RvdHlwZUdyYW1tYXI7XG52YXIgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcztcbi8vIEpTT04gaXMgbm90IGEgdmFsaWQgc3Vic2V0IG9mIEphdmFTY3JpcHQgYmVjYXVzZSB0aGVyZSBhcmUgdHdvIHBvc3NpYmxlIGxpbmUgdGVybWluYXRvcnMsXG4vLyBVKzIwMjggKGxpbmUgc2VwYXJhdG9yKSBhbmQgVSsyMDI5IChwYXJhZ3JhcGggc2VwYXJhdG9yKSB0aGF0IGFyZSBhbGxvd2VkIGluIEpTT04gc3RyaW5nc1xuLy8gYnV0IG5vdCBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXG4vLyBqc29uVG9KUygpIHByb3Blcmx5IGVuY29kZXMgdGhvc2UgdHdvIGNoYXJhY3RlcnMgaW4gSlNPTiBzbyB0aGF0IGl0IGNhbiBzZWFtbGVzc2x5IGJlXG4vLyBpbnNlcnRlZCBpbnRvIEphdmFTY3JpcHQgY29kZSAocGx1cyB0aGUgZW5jb2RlZCB2ZXJzaW9uIGlzIHN0aWxsIHZhbGlkIEpTT04pXG5mdW5jdGlvbiBqc29uVG9KUyhzdHIpIHtcbiAgICB2YXIgb3V0cHV0ID0gc3RyLnJlcGxhY2UoL1tcXHUyMDI4XFx1MjAyOV0vZywgZnVuY3Rpb24gKGNoYXIsIHBvcywgc3RyKSB7XG4gICAgICAgIHZhciBoZXggPSBjaGFyLmNvZGVQb2ludEF0KDApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgcmV0dXJuICdcXFxcdScgKyAnMDAwMCcuc2xpY2UoaGV4Lmxlbmd0aCkgKyBoZXg7XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFdyYXBwZXJzIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBXcmFwcGVycyBkZWNvcmF0ZSBDU1Qgbm9kZXMgd2l0aCBhbGwgb2YgdGhlIGZ1bmN0aW9uYWxpdHkgKGkuZS4sIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMpXG4vLyBwcm92aWRlZCBieSBhIFNlbWFudGljcyAoc2VlIGJlbG93KS4gYFdyYXBwZXJgIGlzIHRoZSBhYnN0cmFjdCBzdXBlcmNsYXNzIG9mIGFsbCB3cmFwcGVycy4gQVxuLy8gYFdyYXBwZXJgIG11c3QgaGF2ZSBgX25vZGVgIGFuZCBgX3NlbWFudGljc2AgaW5zdGFuY2UgdmFyaWFibGVzLCB3aGljaCByZWZlciB0byB0aGUgQ1NUIG5vZGUgYW5kXG4vLyBTZW1hbnRpY3MgKHJlc3AuKSBmb3Igd2hpY2ggaXQgd2FzIGNyZWF0ZWQsIGFuZCBhIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUgd2hpY2ggaXNcbi8vIHVzZWQgdG8gY2FjaGUgdGhlIHdyYXBwZXIgaW5zdGFuY2VzIHRoYXQgYXJlIGNyZWF0ZWQgZm9yIGl0cyBjaGlsZCBub2Rlcy4gU2V0dGluZyB0aGVzZSBpbnN0YW5jZVxuLy8gdmFyaWFibGVzIGlzIHRoZSByZXNwb25zaWJpbGl0eSBvZiB0aGUgY29uc3RydWN0b3Igb2YgZWFjaCBTZW1hbnRpY3Mtc3BlY2lmaWMgc3ViY2xhc3Mgb2Zcbi8vIGBXcmFwcGVyYC5cbnZhciBXcmFwcGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFdyYXBwZXIobm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCkge1xuICAgICAgICB0aGlzLl9ub2RlID0gbm9kZTtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2VJbnRlcnZhbDtcbiAgICAgICAgLy8gVGhlIGludGVydmFsIHRoYXQgdGhlIGNoaWxkT2Zmc2V0cyBvZiBgbm9kZWAgYXJlIHJlbGF0aXZlIHRvLiBJdCBzaG91bGQgYmUgdGhlIHNvdXJjZVxuICAgICAgICAvLyBvZiB0aGUgY2xvc2VzdCBOb250ZXJtaW5hbCBub2RlLlxuICAgICAgICB0aGlzLl9iYXNlSW50ZXJ2YWwgPSBiYXNlSW50ZXJ2YWw7XG4gICAgICAgIGlmIChub2RlLmlzTm9udGVybWluYWwoKSkge1xuICAgICAgICAgICAgY29tbW9uLmFzc2VydChzb3VyY2VJbnRlcnZhbCA9PT0gYmFzZUludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jaGlsZFdyYXBwZXJzID0gW107XG4gICAgfVxuICAgIFdyYXBwZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJ1tzZW1hbnRpY3Mgd3JhcHBlciBmb3IgJyArIHRoaXMuX25vZGUuZ3JhbW1hci5uYW1lICsgJ10nO1xuICAgIH07XG4gICAgLy8gVGhpcyBpcyB1c2VkIGJ5IG9obSBlZGl0b3IgdG8gZGlzcGxheSBhIG5vZGUgd3JhcHBlciBhcHByb3ByaWF0ZWx5LlxuICAgIFdyYXBwZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICB9O1xuICAgIFdyYXBwZXIucHJvdG90eXBlLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvciA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgbWVtb2l6ZWQgYXR0cmlidXRlIGZyb20gdGhlIGNzdE5vZGUgYW5kIGFsbCBpdHMgY2hpbGRyZW4uXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9ub2RlW3RoaXMuX3NlbWFudGljcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdXTtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgY2hpbGQuX2ZvcmdldE1lbW9pemVkUmVzdWx0Rm9yKGF0dHJpYnV0ZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIC8vIFJldHVybnMgdGhlIHdyYXBwZXIgb2YgdGhlIHNwZWNpZmllZCBjaGlsZCBub2RlLiBDaGlsZCB3cmFwcGVycyBhcmUgY3JlYXRlZCBsYXppbHkgYW5kXG4gICAgLy8gY2FjaGVkIGluIHRoZSBwYXJlbnQgd3JhcHBlcidzIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUuXG4gICAgV3JhcHBlci5wcm90b3R5cGUuY2hpbGQgPSBmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgIGlmICghKDAgPD0gaWR4ICYmIGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKSkpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IENvbnNpZGVyIHRocm93aW5nIGFuIGV4Y2VwdGlvbiBoZXJlLlxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdO1xuICAgICAgICBpZiAoIWNoaWxkV3JhcHBlcikge1xuICAgICAgICAgICAgdmFyIGNoaWxkTm9kZSA9IHRoaXMuX25vZGUuY2hpbGRBdChpZHgpO1xuICAgICAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX25vZGUuY2hpbGRPZmZzZXRzW2lkeF07XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5fYmFzZUludGVydmFsLnN1YkludGVydmFsKG9mZnNldCwgY2hpbGROb2RlLm1hdGNoTGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBiYXNlID0gY2hpbGROb2RlLmlzTm9udGVybWluYWwoKSA/IHNvdXJjZSA6IHRoaXMuX2Jhc2VJbnRlcnZhbDtcbiAgICAgICAgICAgIGNoaWxkV3JhcHBlciA9IHRoaXMuX2NoaWxkV3JhcHBlcnNbaWR4XSA9IHRoaXMuX3NlbWFudGljcy53cmFwKGNoaWxkTm9kZSwgc291cmNlLCBiYXNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGRXcmFwcGVyO1xuICAgIH07XG4gICAgLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSB3cmFwcGVycyBvZiBhbGwgb2YgdGhlIGNoaWxkcmVuIG9mIHRoZSBub2RlIGFzc29jaWF0ZWRcbiAgICAvLyB3aXRoIHRoaXMgd3JhcHBlci5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5fY2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEZvcmNlIHRoZSBjcmVhdGlvbiBvZiBhbGwgY2hpbGQgd3JhcHBlcnNcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpOyBpZHgrKykge1xuICAgICAgICAgICAgdGhpcy5jaGlsZChpZHgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZFdyYXBwZXJzO1xuICAgIH07XG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgY29ycmVzcG9uZHMgdG8gYW4gaXRlcmF0aW9uXG4gICAgLy8gZXhwcmVzc2lvbiwgaS5lLiwgYSBLbGVlbmUtKiwgS2xlZW5lLSssIG9yIGFuIG9wdGlvbmFsLiBSZXR1cm5zIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIFdyYXBwZXIucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5pc0l0ZXJhdGlvbigpO1xuICAgIH07XG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSB0ZXJtaW5hbCBub2RlLCBgZmFsc2VgXG4gICAgLy8gb3RoZXJ3aXNlLlxuICAgIFdyYXBwZXIucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ub2RlLmlzVGVybWluYWwoKTtcbiAgICB9O1xuICAgIC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZSwgYGZhbHNlYFxuICAgIC8vIG90aGVyd2lzZS5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5pc05vbnRlcm1pbmFsKCk7XG4gICAgfTtcbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGVcbiAgICAvLyBjb3JyZXNwb25kaW5nIHRvIGEgc3ludGFjdGljIHJ1bGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIFdyYXBwZXIucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc05vbnRlcm1pbmFsKCkgJiYgdGhpcy5fbm9kZS5pc1N5bnRhY3RpYygpO1xuICAgIH07XG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlXG4gICAgLy8gY29ycmVzcG9uZGluZyB0byBhIGxleGljYWwgcnVsZSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAgV3JhcHBlci5wcm90b3R5cGUuaXNMZXhpY2FsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc05vbnRlcm1pbmFsKCkgJiYgdGhpcy5fbm9kZS5pc0xleGljYWwoKTtcbiAgICB9O1xuICAgIC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGFuIGl0ZXJhdG9yIG5vZGVcbiAgICAvLyBoYXZpbmcgZWl0aGVyIG9uZSBvciBubyBjaGlsZCAoPyBvcGVyYXRvciksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIC8vIE90aGVyd2lzZSwgdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5pc09wdGlvbmFsKCk7XG4gICAgfTtcbiAgICAvLyBDcmVhdGUgYSBuZXcgX2l0ZXIgd3JhcHBlciBpbiB0aGUgc2FtZSBzZW1hbnRpY3MgYXMgdGhpcyB3cmFwcGVyLlxuICAgIFdyYXBwZXIucHJvdG90eXBlLml0ZXJhdGlvbiA9IGZ1bmN0aW9uIChvcHRDaGlsZFdyYXBwZXJzKSB7XG4gICAgICAgIHZhciBjaGlsZFdyYXBwZXJzID0gb3B0Q2hpbGRXcmFwcGVycyB8fCBbXTtcbiAgICAgICAgdmFyIGNoaWxkTm9kZXMgPSBjaGlsZFdyYXBwZXJzLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy5fbm9kZTsgfSk7XG4gICAgICAgIHZhciBpdGVyID0gbmV3IEl0ZXJhdGlvbk5vZGUodGhpcy5fbm9kZS5ncmFtbWFyLCBjaGlsZE5vZGVzLCBbXSwgLTEsIGZhbHNlKTtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB0aGlzLl9zZW1hbnRpY3Mud3JhcChpdGVyLCBudWxsLCBudWxsKTtcbiAgICAgICAgd3JhcHBlci5fY2hpbGRXcmFwcGVycyA9IGNoaWxkV3JhcHBlcnM7XG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyYXBwZXIucHJvdG90eXBlLCBcImNoaWxkcmVuXCIsIHtcbiAgICAgICAgLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBjaGlsZHJlbiBvZiB0aGlzIENTVCBub2RlLlxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbigpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyYXBwZXIucHJvdG90eXBlLCBcImN0b3JOYW1lXCIsIHtcbiAgICAgICAgLy8gUmV0dXJucyB0aGUgbmFtZSBvZiBncmFtbWFyIHJ1bGUgdGhhdCBjcmVhdGVkIHRoaXMgQ1NUIG5vZGUuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuY3Rvck5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JhcHBlci5wcm90b3R5cGUsIFwiaW50ZXJ2YWxcIiwge1xuICAgICAgICAvLyBUT0RPOiBSZW1vdmUgdGhpcyBldmVudHVhbGx5IChkZXByZWNhdGVkIGluIHYwLjEyKS5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBgaW50ZXJ2YWxgIHByb3BlcnR5IGlzIGRlcHJlY2F0ZWQgLS0gdXNlIGBzb3VyY2VgIGluc3RlYWQnKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcmFwcGVyLnByb3RvdHlwZSwgXCJudW1DaGlsZHJlblwiLCB7XG4gICAgICAgIC8vIFJldHVybnMgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBvZiB0aGlzIENTVCBub2RlLlxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JhcHBlci5wcm90b3R5cGUsIFwicHJpbWl0aXZlVmFsdWVcIiwge1xuICAgICAgICAvLyBSZXR1cm5zIHRoZSBwcmltaXRpdmUgdmFsdWUgb2YgdGhpcyBDU1Qgbm9kZSwgaWYgaXQncyBhIHRlcm1pbmFsIG5vZGUuIE90aGVyd2lzZSxcbiAgICAgICAgLy8gdGhyb3dzIGFuIGV4Y2VwdGlvbi5cbiAgICAgICAgLy8gREVQUkVDQVRFRDogVXNlIGBzb3VyY2VTdHJpbmdgIGluc3RlYWQuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNUZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUucHJpbWl0aXZlVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwidHJpZWQgdG8gYWNjZXNzIHRoZSAncHJpbWl0aXZlVmFsdWUnIGF0dHJpYnV0ZSBvZiBhIG5vbi10ZXJtaW5hbCBDU1Qgbm9kZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcmFwcGVyLnByb3RvdHlwZSwgXCJzb3VyY2VTdHJpbmdcIiwge1xuICAgICAgICAvLyBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIGNvbnN1bWVkIGJ5IHRoaXMgQ1NUIG5vZGUuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLmNvbnRlbnRzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIFdyYXBwZXI7XG59KCkpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gU2VtYW50aWNzIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBIFNlbWFudGljcyBpcyBhIGNvbnRhaW5lciBmb3IgYSBmYW1pbHkgb2YgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBmb3IgYSBnaXZlbiBncmFtbWFyLlxuLy8gU2VtYW50aWNzIGVuYWJsZSBtb2R1bGFyaXR5IChkaWZmZXJlbnQgY2xpZW50cyBvZiBhIGdyYW1tYXIgY2FuIGNyZWF0ZSB0aGVpciBzZXQgb2Ygb3BlcmF0aW9uc1xuLy8gYW5kIGF0dHJpYnV0ZXMgaW4gaXNvbGF0aW9uKSBhbmQgZXh0ZW5zaWJpbGl0eSBldmVuIHdoZW4gb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBhcmUgbXV0dWFsbHktXG4vLyByZWN1cnNpdmUuIFRoaXMgY29uc3RydWN0b3Igc2hvdWxkIG5vdCBiZSBjYWxsZWQgZGlyZWN0bHkgZXhjZXB0IGZyb21cbi8vIGBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzYC4gVGhlIG5vcm1hbCB3YXlzIHRvIGNyZWF0ZSBhIFNlbWFudGljcywgZ2l2ZW4gYSBncmFtbWFyICdnJywgYXJlXG4vLyBgZy5jcmVhdGVTZW1hbnRpY3MoKWAgYW5kIGBnLmV4dGVuZFNlbWFudGljcyhwYXJlbnRTZW1hbnRpY3MpYC5cbmZ1bmN0aW9uIFNlbWFudGljcyhncmFtbWFyLCBzdXBlclNlbWFudGljcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB0aGlzLmdyYW1tYXIgPSBncmFtbWFyO1xuICAgIHRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzID0gZmFsc2U7XG4gICAgLy8gQ29uc3RydWN0b3IgZm9yIHdyYXBwZXIgaW5zdGFuY2VzLCB3aGljaCBhcmUgcGFzc2VkIGFzIHRoZSBhcmd1bWVudHMgdG8gdGhlIHNlbWFudGljIGFjdGlvbnNcbiAgICAvLyBvZiBhbiBvcGVyYXRpb24gb3IgYXR0cmlidXRlLiBPcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIHJlcXVpcmUgZG91YmxlIGRpc3BhdGNoOiB0aGUgc2VtYW50aWNcbiAgICAvLyBhY3Rpb24gaXMgY2hvc2VuIGJhc2VkIG9uIGJvdGggdGhlIG5vZGUncyB0eXBlIGFuZCB0aGUgc2VtYW50aWNzLiBXcmFwcGVycyBlbnN1cmUgdGhhdFxuICAgIC8vIHRoZSBgZXhlY3V0ZWAgbWV0aG9kIGlzIGNhbGxlZCB3aXRoIHRoZSBjb3JyZWN0IChtb3N0IHNwZWNpZmljKSBzZW1hbnRpY3Mgb2JqZWN0IGFzIGFuXG4gICAgLy8gYXJndW1lbnQuXG4gICAgdGhpcy5XcmFwcGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoV3JhcHBlciwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gV3JhcHBlcihub2RlLCBzb3VyY2VJbnRlcnZhbCwgYmFzZUludGVydmFsKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBub2RlLCBzb3VyY2VJbnRlcnZhbCwgYmFzZUludGVydmFsKSB8fCB0aGlzO1xuICAgICAgICAgICAgc2VsZi5jaGVja0FjdGlvbkRpY3RzSWZIYXZlbnRBbHJlYWR5KCk7XG4gICAgICAgICAgICBfdGhpcy5fc2VtYW50aWNzID0gc2VsZjtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gV3JhcHBlcjtcbiAgICB9KChzdXBlclNlbWFudGljcyA/IHN1cGVyU2VtYW50aWNzLldyYXBwZXIgOiBXcmFwcGVyKSkpO1xuICAgIHRoaXMuc3VwZXIgPSBzdXBlclNlbWFudGljcztcbiAgICBpZiAoc3VwZXJTZW1hbnRpY3MpIHtcbiAgICAgICAgaWYgKCEoZ3JhbW1hci5lcXVhbHModGhpcy5zdXBlci5ncmFtbWFyKSB8fCBncmFtbWFyLl9pbmhlcml0c0Zyb20odGhpcy5zdXBlci5ncmFtbWFyKSkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBleHRlbmQgYSBzZW1hbnRpY3MgZm9yIGdyYW1tYXIgJ1wiICtcbiAgICAgICAgICAgICAgICB0aGlzLnN1cGVyLmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInIGZvciB1c2Ugd2l0aCBncmFtbWFyICdcIiArXG4gICAgICAgICAgICAgICAgZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICAgICAgICBcIicgKG5vdCBhIHN1Yi1ncmFtbWFyKVwiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wZXJhdGlvbnMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIub3BlcmF0aW9ucyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IE9iamVjdC5jcmVhdGUodGhpcy5zdXBlci5hdHRyaWJ1dGVzKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgLy8gQXNzaWduIHVuaXF1ZSBzeW1ib2xzIGZvciBlYWNoIG9mIHRoZSBhdHRyaWJ1dGVzIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3Mgc28gdGhhdFxuICAgICAgICAvLyB0aGV5IGFyZSBtZW1vaXplZCBpbmRlcGVuZGVudGx5LlxuICAgICAgICBmb3IgKHZhciBhdHRyaWJ1dGVOYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuYXR0cmlidXRlS2V5cywgYXR0cmlidXRlTmFtZSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB1dGlsLnVuaXF1ZUlkKGF0dHJpYnV0ZU5hbWUpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVLZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB9XG59XG5TZW1hbnRpY3MucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnW3NlbWFudGljcyBmb3IgJyArIHRoaXMuZ3JhbW1hci5uYW1lICsgJ10nO1xufTtcblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuY2hlY2tlZEFjdGlvbkRpY3RzKSB7XG4gICAgICAgIHRoaXMuY2hlY2tBY3Rpb25EaWN0cygpO1xuICAgICAgICB0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cyA9IHRydWU7XG4gICAgfVxufTtcbi8vIENoZWNrcyB0aGF0IHRoZSBhY3Rpb24gZGljdGlvbmFyaWVzIGZvciBhbGwgb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBpbiB0aGlzIHNlbWFudGljcyxcbi8vIGluY2x1ZGluZyB0aGUgb25lcyB0aGF0IHdlcmUgaW5oZXJpdGVkIGZyb20gdGhlIHN1cGVyLXNlbWFudGljcywgYWdyZWUgd2l0aCB0aGUgZ3JhbW1hci5cbi8vIFRocm93cyBhbiBleGNlcHRpb24gaWYgb25lIG9yIG1vcmUgb2YgdGhlbSBkb2Vzbid0LlxuU2VtYW50aWNzLnByb3RvdHlwZS5jaGVja0FjdGlvbkRpY3RzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuYW1lO1xuICAgIGZvciAobmFtZSBpbiB0aGlzLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgdGhpcy5vcGVyYXRpb25zW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICAgIH1cbiAgICBmb3IgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgICB9XG59O1xuU2VtYW50aWNzLnByb3RvdHlwZS50b1JlY2lwZSA9IGZ1bmN0aW9uIChzZW1hbnRpY3NPbmx5KSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBmdW5jdGlvbiBoYXNTdXBlclNlbWFudGljcyhzKSB7XG4gICAgICAgIHJldHVybiBzLnN1cGVyICE9PSBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCk7XG4gICAgfVxuICAgIHZhciBzdHIgPSAnKGZ1bmN0aW9uKGcpIHtcXG4nO1xuICAgIGlmIChoYXNTdXBlclNlbWFudGljcyh0aGlzKSkge1xuICAgICAgICBzdHIgKz0gJyAgdmFyIHNlbWFudGljcyA9ICcgKyB0aGlzLnN1cGVyLnRvUmVjaXBlKHRydWUpICsgJyhnJztcbiAgICAgICAgdmFyIHN1cGVyU2VtYW50aWNzR3JhbW1hciA9IHRoaXMuc3VwZXIuZ3JhbW1hcjtcbiAgICAgICAgdmFyIHJlbGF0ZWRHcmFtbWFyID0gdGhpcy5ncmFtbWFyO1xuICAgICAgICB3aGlsZSAocmVsYXRlZEdyYW1tYXIgIT09IHN1cGVyU2VtYW50aWNzR3JhbW1hcikge1xuICAgICAgICAgICAgc3RyICs9ICcuc3VwZXJHcmFtbWFyJztcbiAgICAgICAgICAgIHJlbGF0ZWRHcmFtbWFyID0gcmVsYXRlZEdyYW1tYXIuc3VwZXJHcmFtbWFyO1xuICAgICAgICB9XG4gICAgICAgIHN0ciArPSAnKTtcXG4nO1xuICAgICAgICBzdHIgKz0gJyAgcmV0dXJuIGcuZXh0ZW5kU2VtYW50aWNzKHNlbWFudGljcyknO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RyICs9ICcgIHJldHVybiBnLmNyZWF0ZVNlbWFudGljcygpJztcbiAgICB9XG4gICAgWydPcGVyYXRpb24nLCAnQXR0cmlidXRlJ10uZm9yRWFjaChmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICB2YXIgc2VtYW50aWNPcGVyYXRpb25zID0gX3RoaXNbdHlwZS50b0xvd2VyQ2FzZSgpICsgJ3MnXTtcbiAgICAgICAgT2JqZWN0LmtleXMoc2VtYW50aWNPcGVyYXRpb25zKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB2YXIgX2EgPSBzZW1hbnRpY09wZXJhdGlvbnNbbmFtZV0sIGFjdGlvbkRpY3QgPSBfYS5hY3Rpb25EaWN0LCBmb3JtYWxzID0gX2EuZm9ybWFscywgYnVpbHRJbkRlZmF1bHQgPSBfYS5idWlsdEluRGVmYXVsdDtcbiAgICAgICAgICAgIHZhciBzaWduYXR1cmUgPSBuYW1lO1xuICAgICAgICAgICAgaWYgKGZvcm1hbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNpZ25hdHVyZSArPSAnKCcgKyBmb3JtYWxzLmpvaW4oJywgJykgKyAnKSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbWV0aG9kO1xuICAgICAgICAgICAgaWYgKGhhc1N1cGVyU2VtYW50aWNzKF90aGlzKSAmJiBfdGhpcy5zdXBlclt0eXBlLnRvTG93ZXJDYXNlKCkgKyAncyddW25hbWVdKSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gJ2V4dGVuZCcgKyB0eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gJ2FkZCcgKyB0eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RyICs9ICdcXG4gICAgLicgKyBtZXRob2QgKyAnKCcgKyBKU09OLnN0cmluZ2lmeShzaWduYXR1cmUpICsgJywgeyc7XG4gICAgICAgICAgICB2YXIgc3JjQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aW9uRGljdFthY3Rpb25OYW1lXSAhPT0gYnVpbHRJbkRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGFjdGlvbkRpY3RbYWN0aW9uTmFtZV0udG9TdHJpbmcoKS50cmltKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgbWV0aG9kIHNob3J0aGFuZCB0byBwbGFpbiBvbGQgZnVuY3Rpb24gc3ludGF4LlxuICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaGFyYy9vaG0vaXNzdWVzLzI2M1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSgvXi4qXFwoLywgJ2Z1bmN0aW9uKCcpO1xuICAgICAgICAgICAgICAgICAgICBzcmNBcnJheS5wdXNoKCdcXG4gICAgICAnICsgSlNPTi5zdHJpbmdpZnkoYWN0aW9uTmFtZSkgKyAnOiAnICsgc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN0ciArPSBzcmNBcnJheS5qb2luKCcsJykgKyAnXFxuICAgIH0pJztcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgc3RyICs9ICc7XFxuICB9KSc7XG4gICAgaWYgKCFzZW1hbnRpY3NPbmx5KSB7XG4gICAgICAgIHN0ciA9XG4gICAgICAgICAgICAnKGZ1bmN0aW9uKCkge1xcbicgK1xuICAgICAgICAgICAgICAgICcgIHZhciBncmFtbWFyID0gdGhpcy5mcm9tUmVjaXBlKCcgK1xuICAgICAgICAgICAgICAgIGpzb25Ub0pTKHRoaXMuZ3JhbW1hci50b1JlY2lwZSgpKSArXG4gICAgICAgICAgICAgICAgJyk7XFxuJyArXG4gICAgICAgICAgICAgICAgJyAgdmFyIHNlbWFudGljcyA9ICcgK1xuICAgICAgICAgICAgICAgIHN0ciArXG4gICAgICAgICAgICAgICAgJyhncmFtbWFyKTtcXG4nICtcbiAgICAgICAgICAgICAgICAnICByZXR1cm4gc2VtYW50aWNzO1xcbicgK1xuICAgICAgICAgICAgICAgICd9KTtcXG4nO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufTtcbmZ1bmN0aW9uIHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSwgdHlwZSkge1xuICAgIGlmICghcHJvdG90eXBlR3JhbW1hcikge1xuICAgICAgICAvLyBUaGUgT3BlcmF0aW9ucyBhbmQgQXR0cmlidXRlcyBncmFtbWFyIHdvbid0IGJlIGF2YWlsYWJsZSB3aGlsZSBPaG0gaXMgbG9hZGluZyxcbiAgICAgICAgLy8gYnV0IHdlIGNhbiBnZXQgYXdheSB0aGUgZm9sbG93aW5nIHNpbXBsaWZpY2F0aW9uIGIvYyBub25lIG9mIHRoZSBvcGVyYXRpb25zXG4gICAgICAgIC8vIHRoYXQgYXJlIHVzZWQgd2hpbGUgbG9hZGluZyB0YWtlIGFyZ3VtZW50cy5cbiAgICAgICAgY29tbW9uLmFzc2VydChzaWduYXR1cmUuaW5kZXhPZignKCcpID09PSAtMSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiBzaWduYXR1cmUsXG4gICAgICAgICAgICBmb3JtYWxzOiBbXVxuICAgICAgICB9O1xuICAgIH1cbiAgICB2YXIgciA9IHByb3RvdHlwZUdyYW1tYXIubWF0Y2goc2lnbmF0dXJlLCB0eXBlID09PSAnb3BlcmF0aW9uJyA/ICdPcGVyYXRpb25TaWduYXR1cmUnIDogJ0F0dHJpYnV0ZVNpZ25hdHVyZScpO1xuICAgIGlmIChyLmZhaWxlZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihyLm1lc3NhZ2UpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyhyKS5wYXJzZSgpO1xufVxuZnVuY3Rpb24gbmV3RGVmYXVsdEFjdGlvbih0eXBlLCBuYW1lLCBkb0l0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzLm9wZXJhdGlvbnNbbmFtZV0gfHwgdGhpcy5fc2VtYW50aWNzLmF0dHJpYnV0ZXNbbmFtZV07XG4gICAgICAgIHZhciBhcmdzID0gdGhpc1RoaW5nLmZvcm1hbHMubWFwKGZ1bmN0aW9uIChmb3JtYWwpIHsgcmV0dXJuIF90aGlzLmFyZ3NbZm9ybWFsXTsgfSk7XG4gICAgICAgIGlmICghdGhpcy5pc0l0ZXJhdGlvbigpICYmIGNoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgLy8gVGhpcyBDU1Qgbm9kZSBjb3JyZXNwb25kcyB0byBhIG5vbi10ZXJtaW5hbCBpbiB0aGUgZ3JhbW1hciAoZS5nLiwgQWRkRXhwcikuIFRoZSBmYWN0IHRoYXRcbiAgICAgICAgICAgIC8vIHdlIGdvdCBoZXJlIG1lYW5zIHRoYXQgdGhpcyBhY3Rpb24gZGljdGlvbmFyeSBkb2Vzbid0IGhhdmUgYW4gYWN0aW9uIGZvciB0aGlzIHBhcnRpY3VsYXJcbiAgICAgICAgICAgIC8vIG5vbi10ZXJtaW5hbCBvciBhIGdlbmVyaWMgYF9ub250ZXJtaW5hbGAgYWN0aW9uLlxuICAgICAgICAgICAgLy8gQXMgYSBjb252ZW5pZW5jZSwgaWYgdGhpcyBub2RlIG9ubHkgaGFzIG9uZSBjaGlsZCwgd2UganVzdCByZXR1cm4gdGhlIHJlc3VsdCBvZiBhcHBseWluZ1xuICAgICAgICAgICAgLy8gdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgdG8gdGhlIGNoaWxkIG5vZGUuXG4gICAgICAgICAgICByZXR1cm4gZG9JdC5hcHBseShjaGlsZHJlblswXSwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIHRocm93IGFuIGV4Y2VwdGlvbiB0byBsZXQgdGhlIHByb2dyYW1tZXIga25vdyB0aGF0IHdlIGRvbid0IGtub3cgd2hhdFxuICAgICAgICAgICAgLy8gdG8gZG8gd2l0aCB0aGlzIG5vZGUuXG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMubWlzc2luZ1NlbWFudGljQWN0aW9uKHRoaXMuY3Rvck5hbWUsIG5hbWUsIHR5cGUsIGdsb2JhbEFjdGlvblN0YWNrKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5TZW1hbnRpY3MucHJvdG90eXBlLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlID0gZnVuY3Rpb24gKHR5cGUsIHNpZ25hdHVyZSwgYWN0aW9uRGljdCkge1xuICAgIHZhciB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcbiAgICB2YXIgcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MgPSBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpO1xuICAgIHZhciBuYW1lID0gcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MubmFtZTtcbiAgICB2YXIgZm9ybWFscyA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLmZvcm1hbHM7XG4gICAgLy8gVE9ETzogY2hlY2sgdGhhdCB0aGVyZSBhcmUgbm8gZHVwbGljYXRlIGZvcm1hbCBhcmd1bWVudHNcbiAgICB0aGlzLmFzc2VydE5ld05hbWUobmFtZSwgdHlwZSk7XG4gICAgLy8gQ3JlYXRlIHRoZSBhY3Rpb24gZGljdGlvbmFyeSBmb3IgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgdGhhdCBjb250YWlucyBhIGBfZGVmYXVsdGAgYWN0aW9uXG4gICAgLy8gd2hpY2ggZGVmaW5lcyB0aGUgZGVmYXVsdCBiZWhhdmlvciBvZiBpdGVyYXRpb24sIHRlcm1pbmFsLCBhbmQgbm9uLXRlcm1pbmFsIG5vZGVzLi4uXG4gICAgdmFyIGJ1aWx0SW5EZWZhdWx0ID0gbmV3RGVmYXVsdEFjdGlvbih0eXBlLCBuYW1lLCBkb0l0KTtcbiAgICB2YXIgcmVhbEFjdGlvbkRpY3QgPSB7IF9kZWZhdWx0OiBidWlsdEluRGVmYXVsdCB9O1xuICAgIC8vIC4uLiBhbmQgYWRkIGluIHRoZSBhY3Rpb25zIHN1cHBsaWVkIGJ5IHRoZSBwcm9ncmFtbWVyLCB3aGljaCBtYXkgb3ZlcnJpZGUgc29tZSBvciBhbGwgb2YgdGhlXG4gICAgLy8gZGVmYXVsdCBvbmVzLlxuICAgIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmVhbEFjdGlvbkRpY3RbbmFtZV0gPSBhY3Rpb25EaWN0W25hbWVdO1xuICAgIH0pO1xuICAgIHZhciBlbnRyeSA9IHR5cGUgPT09ICdvcGVyYXRpb24nXG4gICAgICAgID8gbmV3IE9wZXJhdGlvbihuYW1lLCBmb3JtYWxzLCByZWFsQWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpXG4gICAgICAgIDogbmV3IEF0dHJpYnV0ZShuYW1lLCByZWFsQWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpO1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgaXMgbm90IHN0cmljdGx5IG5lY2Vzc2FyeSAoaXQgd2lsbCBoYXBwZW4gbGF0ZXIgYW55d2F5KSBidXQgaXQncyBiZXR0ZXIgdG9cbiAgICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gICAgZW50cnkuY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG4gICAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9IGVudHJ5O1xuICAgIGZ1bmN0aW9uIGRvSXQoKSB7XG4gICAgICAgIC8vIERpc3BhdGNoIHRvIG1vc3Qgc3BlY2lmaWMgdmVyc2lvbiBvZiB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSAtLSBpdCBtYXkgaGF2ZSBiZWVuXG4gICAgICAgIC8vIG92ZXJyaWRkZW4gYnkgYSBzdWItc2VtYW50aWNzLlxuICAgICAgICB2YXIgdGhpc1RoaW5nID0gdGhpcy5fc2VtYW50aWNzW3R5cGVQbHVyYWxdW25hbWVdO1xuICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBjYWxsZXIgcGFzc2VkIHRoZSBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMuXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBudW1iZXIgb2YgYXJndW1lbnRzIHBhc3NlZCB0byAnICtcbiAgICAgICAgICAgICAgICBuYW1lICtcbiAgICAgICAgICAgICAgICAnICcgK1xuICAgICAgICAgICAgICAgIHR5cGUgK1xuICAgICAgICAgICAgICAgICcgKGV4cGVjdGVkICcgK1xuICAgICAgICAgICAgICAgIHRoaXNUaGluZy5mb3JtYWxzLmxlbmd0aCArXG4gICAgICAgICAgICAgICAgJywgZ290ICcgK1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50cy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICcpJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGFuIFwiYXJndW1lbnRzIG9iamVjdFwiIGZyb20gdGhlIGFyZ3VtZW50cyB0aGF0IHdlcmUgcGFzc2VkIHRvIHRoaXNcbiAgICAgICAgLy8gb3BlcmF0aW9uIC8gYXR0cmlidXRlLlxuICAgICAgICB2YXIgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICB2YXIgZm9ybWFsID0gdGhpc1RoaW5nLmZvcm1hbHNbaWR4XTtcbiAgICAgICAgICAgIGFyZ3NbZm9ybWFsXSA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvbGRBcmdzID0gdGhpcy5hcmdzO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB2YXIgYW5zID0gdGhpc1RoaW5nLmV4ZWN1dGUodGhpcy5fc2VtYW50aWNzLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hcmdzID0gb2xkQXJncztcbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdvcGVyYXRpb24nKSB7XG4gICAgICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0gPSBkb0l0O1xuICAgICAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIG5hbWUgKyAnIG9wZXJhdGlvbl0nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuV3JhcHBlci5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZG9JdCxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSAvLyBTbyB0aGUgcHJvcGVydHkgY2FuIGJlIGRlbGV0ZWQuXG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5hdHRyaWJ1dGVLZXlzLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogdXRpbC51bmlxdWVJZChuYW1lKVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuU2VtYW50aWNzLnByb3RvdHlwZS5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHR5cGVQbHVyYWwgPSB0eXBlICsgJ3MnO1xuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGBuYW1lYCByZWFsbHkgaXMganVzdCBhIG5hbWUsIGkuZS4sIHRoYXQgaXQgZG9lc24ndCBhbHNvIGNvbnRhaW4gZm9ybWFscy5cbiAgICBwYXJzZVNpZ25hdHVyZShuYW1lLCAnYXR0cmlidXRlJyk7XG4gICAgaWYgKCEodGhpcy5zdXBlciAmJiBuYW1lIGluIHRoaXMuc3VwZXJbdHlwZVBsdXJhbF0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICtcbiAgICAgICAgICAgIHR5cGUgK1xuICAgICAgICAgICAgXCIgJ1wiICtcbiAgICAgICAgICAgIG5hbWUgK1xuICAgICAgICAgICAgXCInOiBkaWQgbm90IGluaGVyaXQgYW4gXCIgK1xuICAgICAgICAgICAgdHlwZSArXG4gICAgICAgICAgICAnIHdpdGggdGhhdCBuYW1lJyk7XG4gICAgfVxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGhpc1t0eXBlUGx1cmFsXSwgbmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZXh0ZW5kICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJyBhZ2FpblwiKTtcbiAgICB9XG4gICAgLy8gQ3JlYXRlIGEgbmV3IG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB3aG9zZSBhY3Rpb25EaWN0IGRlbGVnYXRlcyB0byB0aGUgc3VwZXIgb3BlcmF0aW9uIC9cbiAgICAvLyBhdHRyaWJ1dGUncyBhY3Rpb25EaWN0LCBhbmQgd2hpY2ggaGFzIGFsbCB0aGUga2V5cyBmcm9tIGBpbmhlcml0ZWRBY3Rpb25EaWN0YC5cbiAgICB2YXIgaW5oZXJpdGVkRm9ybWFscyA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uZm9ybWFscztcbiAgICB2YXIgaW5oZXJpdGVkQWN0aW9uRGljdCA9IHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uYWN0aW9uRGljdDtcbiAgICB2YXIgbmV3QWN0aW9uRGljdCA9IE9iamVjdC5jcmVhdGUoaW5oZXJpdGVkQWN0aW9uRGljdCk7XG4gICAgT2JqZWN0LmtleXMoYWN0aW9uRGljdCkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICBuZXdBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgICB9KTtcbiAgICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdID1cbiAgICAgICAgdHlwZSA9PT0gJ29wZXJhdGlvbidcbiAgICAgICAgICAgID8gbmV3IE9wZXJhdGlvbihuYW1lLCBpbmhlcml0ZWRGb3JtYWxzLCBuZXdBY3Rpb25EaWN0KVxuICAgICAgICAgICAgOiBuZXcgQXR0cmlidXRlKG5hbWUsIG5ld0FjdGlvbkRpY3QpO1xuICAgIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgaXMgbm90IHN0cmljdGx5IG5lY2Vzc2FyeSAoaXQgd2lsbCBoYXBwZW4gbGF0ZXIgYW55d2F5KSBidXQgaXQncyBiZXR0ZXIgdG9cbiAgICAvLyBjYXRjaCBlcnJvcnMgZWFybHkuXG4gICAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbn07XG5TZW1hbnRpY3MucHJvdG90eXBlLmFzc2VydE5ld05hbWUgPSBmdW5jdGlvbiAobmFtZSwgdHlwZSkge1xuICAgIGlmIChXcmFwcGVyLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiB0aGF0J3MgYSByZXNlcnZlZCBuYW1lXCIpO1xuICAgIH1cbiAgICBpZiAobmFtZSBpbiB0aGlzLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogYW4gb3BlcmF0aW9uIHdpdGggdGhhdCBuYW1lIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgIH1cbiAgICBpZiAobmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogYW4gYXR0cmlidXRlIHdpdGggdGhhdCBuYW1lIGFscmVhZHkgZXhpc3RzXCIpO1xuICAgIH1cbn07XG4vLyBSZXR1cm5zIGEgd3JhcHBlciBmb3IgdGhlIGdpdmVuIENTVCBgbm9kZWAgaW4gdGhpcyBzZW1hbnRpY3MuXG4vLyBJZiBgbm9kZWAgaXMgYWxyZWFkeSBhIHdyYXBwZXIsIHJldHVybnMgYG5vZGVgIGl0c2VsZi4gIC8vIFRPRE86IHdoeSBpcyB0aGlzIG5lZWRlZD9cblNlbWFudGljcy5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uIChub2RlLCBzb3VyY2UsIG9wdEJhc2VJbnRlcnZhbCkge1xuICAgIHZhciBiYXNlSW50ZXJ2YWwgPSBvcHRCYXNlSW50ZXJ2YWwgfHwgc291cmNlO1xuICAgIHJldHVybiBub2RlIGluc3RhbmNlb2YgdGhpcy5XcmFwcGVyID8gbm9kZSA6IG5ldyB0aGlzLldyYXBwZXIobm9kZSwgc291cmNlLCBiYXNlSW50ZXJ2YWwpO1xufTtcbi8vIENyZWF0ZXMgYSBuZXcgU2VtYW50aWNzIGluc3RhbmNlIGZvciBgZ3JhbW1hcmAsIGluaGVyaXRpbmcgb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBmcm9tXG4vLyBgb3B0U3VwZXJTZW1hbnRpY3NgLCBpZiBpdCBpcyBzcGVjaWZpZWQuIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBwcm94eSBmb3IgdGhlIG5ld1xuLy8gU2VtYW50aWNzIGluc3RhbmNlLiBXaGVuIHRoYXQgZnVuY3Rpb24gaXMgaW52b2tlZCB3aXRoIGEgQ1NUIG5vZGUgYXMgYW4gYXJndW1lbnQsIGl0IHJldHVybnNcbi8vIGEgd3JhcHBlciBmb3IgdGhhdCBub2RlIHdoaWNoIGdpdmVzIGFjY2VzcyB0byB0aGUgb3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyBwcm92aWRlZCBieSB0aGlzXG4vLyBzZW1hbnRpY3MuXG5TZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzID0gZnVuY3Rpb24gKGdyYW1tYXIsIG9wdFN1cGVyU2VtYW50aWNzKSB7XG4gICAgdmFyIHMgPSBuZXcgU2VtYW50aWNzKGdyYW1tYXIsIG9wdFN1cGVyU2VtYW50aWNzICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBvcHRTdXBlclNlbWFudGljc1xuICAgICAgICA6IFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG4gICAgLy8gVG8gZW5hYmxlIGNsaWVudHMgdG8gaW52b2tlIGEgc2VtYW50aWNzIGxpa2UgYSBmdW5jdGlvbiwgcmV0dXJuIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHlcbiAgICAvLyBmb3IgYHNgLCB3aGljaCBpcyB0aGUgcmVhbCBgU2VtYW50aWNzYCBpbnN0YW5jZS5cbiAgICB2YXIgcHJveHkgPSBmdW5jdGlvbiBBU2VtYW50aWNzKG1hdGNoUmVzdWx0KSB7XG4gICAgICAgIGlmICghKG1hdGNoUmVzdWx0IGluc3RhbmNlb2YgTWF0Y2hSZXN1bHQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTZW1hbnRpY3MgZXhwZWN0ZWQgYSBNYXRjaFJlc3VsdCwgYnV0IGdvdCAnICtcbiAgICAgICAgICAgICAgICBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKG1hdGNoUmVzdWx0KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoUmVzdWx0LmZhaWxlZCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3QgYXBwbHkgU2VtYW50aWNzIHRvICcgKyBtYXRjaFJlc3VsdC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3N0ID0gbWF0Y2hSZXN1bHQuX2NzdDtcbiAgICAgICAgaWYgKGNzdC5ncmFtbWFyICE9PSBncmFtbWFyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdXNlIGEgTWF0Y2hSZXN1bHQgZnJvbSBncmFtbWFyICdcIiArXG4gICAgICAgICAgICAgICAgY3N0LmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInIHdpdGggYSBzZW1hbnRpY3MgZm9yICdcIiArXG4gICAgICAgICAgICAgICAgZ3JhbW1hci5uYW1lICtcbiAgICAgICAgICAgICAgICBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoUmVzdWx0LmlucHV0KTtcbiAgICAgICAgcmV0dXJuIHMud3JhcChjc3QsIGlucHV0U3RyZWFtLmludGVydmFsKG1hdGNoUmVzdWx0Ll9jc3RPZmZzZXQsIG1hdGNoUmVzdWx0LmlucHV0Lmxlbmd0aCkpO1xuICAgIH07XG4gICAgLy8gRm9yd2FyZCBwdWJsaWMgbWV0aG9kcyBmcm9tIHRoZSBwcm94eSB0byB0aGUgc2VtYW50aWNzIGluc3RhbmNlLlxuICAgIHByb3h5LmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uIChzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuZXh0ZW5kT3BlcmF0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9O1xuICAgIHByb3h5LmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfTtcbiAgICBwcm94eS5leHRlbmRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYWN0aW9uRGljdCkge1xuICAgICAgICBzLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuX2dldEFjdGlvbkRpY3QgPSBmdW5jdGlvbiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBzLm9wZXJhdGlvbnNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXSB8fCBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCInICtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgK1xuICAgICAgICAgICAgICAgICdcIiBpcyBub3QgYSB2YWxpZCBvcGVyYXRpb24gb3IgYXR0cmlidXRlICcgK1xuICAgICAgICAgICAgICAgICduYW1lIGluIHRoaXMgc2VtYW50aWNzIGZvciBcIicgK1xuICAgICAgICAgICAgICAgIGdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgJ1wiJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjdGlvbi5hY3Rpb25EaWN0O1xuICAgIH07XG4gICAgcHJveHkuX3JlbW92ZSA9IGZ1bmN0aW9uIChvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUpIHtcbiAgICAgICAgdmFyIHNlbWFudGljO1xuICAgICAgICBpZiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lIGluIHMub3BlcmF0aW9ucykge1xuICAgICAgICAgICAgc2VtYW50aWMgPSBzLm9wZXJhdGlvbnNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgICAgIGRlbGV0ZSBzLm9wZXJhdGlvbnNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWUgaW4gcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBzZW1hbnRpYyA9IHMuYXR0cmlidXRlc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICAgICAgZGVsZXRlIHMuYXR0cmlidXRlc1tvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGRlbGV0ZSBzLldyYXBwZXIucHJvdG90eXBlW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgIHJldHVybiBzZW1hbnRpYztcbiAgICB9O1xuICAgIHByb3h5LmdldE9wZXJhdGlvbk5hbWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocy5vcGVyYXRpb25zKTtcbiAgICB9O1xuICAgIHByb3h5LmdldEF0dHJpYnV0ZU5hbWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMocy5hdHRyaWJ1dGVzKTtcbiAgICB9O1xuICAgIHByb3h5LmdldEdyYW1tYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzLmdyYW1tYXI7XG4gICAgfTtcbiAgICBwcm94eS50b1JlY2lwZSA9IGZ1bmN0aW9uIChzZW1hbnRpY3NPbmx5KSB7XG4gICAgICAgIHJldHVybiBzLnRvUmVjaXBlKHNlbWFudGljc09ubHkpO1xuICAgIH07XG4gICAgLy8gTWFrZSB0aGUgcHJveHkncyB0b1N0cmluZygpIHdvcmsuXG4gICAgcHJveHkudG9TdHJpbmcgPSBzLnRvU3RyaW5nLmJpbmQocyk7XG4gICAgLy8gUmV0dXJucyB0aGUgc2VtYW50aWNzIGZvciB0aGUgcHJveHkuXG4gICAgcHJveHkuX2dldFNlbWFudGljcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfTtcbiAgICByZXR1cm4gcHJveHk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gT3BlcmF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBbiBPcGVyYXRpb24gcmVwcmVzZW50cyBhIGZ1bmN0aW9uIHRvIGJlIGFwcGxpZWQgdG8gYSBjb25jcmV0ZSBzeW50YXggdHJlZSAoQ1NUKSAtLSBpdCdzIHZlcnlcbi8vIHNpbWlsYXIgdG8gYSBWaXNpdG9yIChodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1Zpc2l0b3JfcGF0dGVybikuIEFuIG9wZXJhdGlvbiBpcyBleGVjdXRlZCBieVxuLy8gcmVjdXJzaXZlbHkgd2Fsa2luZyB0aGUgQ1NULCBhbmQgYXQgZWFjaCBub2RlLCBpbnZva2luZyB0aGUgbWF0Y2hpbmcgc2VtYW50aWMgYWN0aW9uIGZyb21cbi8vIGBhY3Rpb25EaWN0YC4gU2VlIGBPcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGVgIGZvciBkZXRhaWxzIG9mIGhvdyBhIENTVCBub2RlJ3MgbWF0Y2hpbmcgc2VtYW50aWNcbi8vIGFjdGlvbiBpcyBmb3VuZC5cbnZhciBPcGVyYXRpb24gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gT3BlcmF0aW9uKG5hbWUsIGZvcm1hbHMsIGFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZm9ybWFscyA9IGZvcm1hbHM7XG4gICAgICAgIHRoaXMuYWN0aW9uRGljdCA9IGFjdGlvbkRpY3Q7XG4gICAgICAgIHRoaXMuYnVpbHRJbkRlZmF1bHQgPSBidWlsdEluRGVmYXVsdDtcbiAgICB9XG4gICAgT3BlcmF0aW9uLnByb3RvdHlwZS5jaGVja0FjdGlvbkRpY3QgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgICAgICBncmFtbWFyLl9jaGVja1RvcERvd25BY3Rpb25EaWN0KHRoaXMudHlwZU5hbWUsIHRoaXMubmFtZSwgdGhpcy5hY3Rpb25EaWN0KTtcbiAgICB9O1xuICAgIC8vIEV4ZWN1dGUgdGhpcyBvcGVyYXRpb24gb24gdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCBgbm9kZVdyYXBwZXJgIGluIHRoZSBjb250ZXh0IG9mIHRoZVxuICAgIC8vIGdpdmVuIFNlbWFudGljcyBpbnN0YW5jZS5cbiAgICBPcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gTG9vayBmb3IgYSBzZW1hbnRpYyBhY3Rpb24gd2hvc2UgbmFtZSBtYXRjaGVzIHRoZSBub2RlJ3MgY29uc3RydWN0b3IgbmFtZSwgd2hpY2ggaXMgZWl0aGVyXG4gICAgICAgICAgICAvLyB0aGUgbmFtZSBvZiBhIHJ1bGUgaW4gdGhlIGdyYW1tYXIsIG9yICdfdGVybWluYWwnIChmb3IgYSB0ZXJtaW5hbCBub2RlKSwgb3IgJ19pdGVyJyAoZm9yIGFuXG4gICAgICAgICAgICAvLyBpdGVyYXRpb24gbm9kZSkuIEluIHRoZSBsYXR0ZXIgY2FzZSwgdGhlIGFjdGlvbiBmdW5jdGlvbiByZWNlaXZlcyBhIHNpbmdsZSBhcmd1bWVudCwgd2hpY2hcbiAgICAgICAgICAgIC8vIGlzIGFuIGFycmF5IGNvbnRhaW5pbmcgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgQ1NUIG5vZGUuXG4gICAgICAgICAgICB2YXIgY3Rvck5hbWUgPSBub2RlV3JhcHBlci5fbm9kZS5jdG9yTmFtZTtcbiAgICAgICAgICAgIHZhciBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdFtjdG9yTmFtZV07XG4gICAgICAgICAgICB2YXIgYW5zID0gdm9pZCAwO1xuICAgICAgICAgICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICAgICAgICAgICAgZ2xvYmFsQWN0aW9uU3RhY2sucHVzaChbdGhpcywgY3Rvck5hbWVdKTtcbiAgICAgICAgICAgICAgICBhbnMgPSB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCBub2RlV3JhcHBlci5pc0l0ZXJhdGlvbigpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5zO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGRvZXMgbm90IGNvbnRhaW4gYSBzZW1hbnRpYyBhY3Rpb24gZm9yIHRoaXMgc3BlY2lmaWMgdHlwZSBvZiBub2RlLlxuICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIG5vbnRlcm1pbmFsIG5vZGUgYW5kIHRoZSBwcm9ncmFtbWVyIGhhcyBwcm92aWRlZCBhIGBfbm9udGVybWluYWxgIHNlbWFudGljXG4gICAgICAgICAgICAvLyBhY3Rpb24sIHdlIGludm9rZSBpdDpcbiAgICAgICAgICAgIGlmIChub2RlV3JhcHBlci5pc05vbnRlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdC5fbm9udGVybWluYWw7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbEFjdGlvblN0YWNrLnB1c2goW3RoaXMsICdfbm9udGVybWluYWwnLCBjdG9yTmFtZV0pO1xuICAgICAgICAgICAgICAgICAgICBhbnMgPSB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFucztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBPdGhlcndpc2UsIHdlIGludm9rZSB0aGUgJ19kZWZhdWx0JyBzZW1hbnRpYyBhY3Rpb24uXG4gICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wdXNoKFt0aGlzLCAnZGVmYXVsdCBhY3Rpb24nLCBjdG9yTmFtZV0pO1xuICAgICAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCB0aGlzLmFjdGlvbkRpY3QuX2RlZmF1bHQsIHRydWUpO1xuICAgICAgICAgICAgcmV0dXJuIGFucztcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIGdsb2JhbEFjdGlvblN0YWNrLnBvcCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvLyBJbnZva2UgYGFjdGlvbkZuYCBvbiB0aGUgQ1NUIG5vZGUgdGhhdCBjb3JyZXNwb25kcyB0byBgbm9kZVdyYXBwZXJgLCBpbiB0aGUgY29udGV4dCBvZlxuICAgIC8vIGBzZW1hbnRpY3NgLiBJZiBgb3B0UGFzc0NoaWxkcmVuQXNBcnJheWAgaXMgdHJ1dGh5LCBgYWN0aW9uRm5gIHdpbGwgYmUgY2FsbGVkIHdpdGggYSBzaW5nbGVcbiAgICAvLyBhcmd1bWVudCwgd2hpY2ggaXMgYW4gYXJyYXkgb2Ygd3JhcHBlcnMuIE90aGVyd2lzZSwgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYGFjdGlvbkZuYCB3aWxsXG4gICAgLy8gYmUgZXF1YWwgdG8gdGhlIG51bWJlciBvZiBjaGlsZHJlbiBpbiB0aGUgQ1NUIG5vZGUuXG4gICAgT3BlcmF0aW9uLnByb3RvdHlwZS5kb0FjdGlvbiA9IGZ1bmN0aW9uIChzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25Gbiwgb3B0UGFzc0NoaWxkcmVuQXNBcnJheSkge1xuICAgICAgICByZXR1cm4gb3B0UGFzc0NoaWxkcmVuQXNBcnJheVxuICAgICAgICAgICAgPyBhY3Rpb25Gbi5jYWxsKG5vZGVXcmFwcGVyLCBub2RlV3JhcHBlci5fY2hpbGRyZW4oKSlcbiAgICAgICAgICAgIDogYWN0aW9uRm4uYXBwbHkobm9kZVdyYXBwZXIsIG5vZGVXcmFwcGVyLl9jaGlsZHJlbigpKTtcbiAgICB9O1xuICAgIHJldHVybiBPcGVyYXRpb247XG59KCkpO1xuT3BlcmF0aW9uLnByb3RvdHlwZS50eXBlTmFtZSA9ICdvcGVyYXRpb24nO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdHRyaWJ1dGVzIGFyZSBPcGVyYXRpb25zIHdob3NlIHJlc3VsdHMgYXJlIG1lbW9pemVkLiBUaGlzIG1lYW5zIHRoYXQsIGZvciBhbnkgZ2l2ZW4gc2VtYW50aWNzLFxuLy8gdGhlIHNlbWFudGljIGFjdGlvbiBmb3IgYSBDU1Qgbm9kZSB3aWxsIGJlIGludm9rZWQgbm8gbW9yZSB0aGFuIG9uY2UuXG52YXIgQXR0cmlidXRlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBdHRyaWJ1dGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQXR0cmlidXRlKG5hbWUsIGFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBuYW1lLCBbXSwgYWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIHx8IHRoaXM7XG4gICAgfVxuICAgIEF0dHJpYnV0ZS5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uIChzZW1hbnRpY3MsIG5vZGVXcmFwcGVyKSB7XG4gICAgICAgIHZhciBub2RlID0gbm9kZVdyYXBwZXIuX25vZGU7XG4gICAgICAgIHZhciBrZXkgPSBzZW1hbnRpY3MuYXR0cmlidXRlS2V5c1t0aGlzLm5hbWVdO1xuICAgICAgICBpZiAoIW5vZGUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBpcyBhIHN1cGVyLXNlbmQgLS0gaXNuJ3QgSlMgYmVhdXRpZnVsPyA6L1xuICAgICAgICAgICAgbm9kZVtrZXldID0gT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlLmNhbGwodGhpcywgc2VtYW50aWNzLCBub2RlV3JhcHBlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVba2V5XTtcbiAgICB9O1xuICAgIHJldHVybiBBdHRyaWJ1dGU7XG59KE9wZXJhdGlvbikpO1xuQXR0cmlidXRlLnByb3RvdHlwZS50eXBlTmFtZSA9ICdhdHRyaWJ1dGUnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gRGVmZXJyZWQgaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cbnV0aWwuYXdhaXRCdWlsdEluUnVsZXMoZnVuY3Rpb24gKGJ1aWx0SW5SdWxlcykge1xuICAgIHZhciBvcGVyYXRpb25zQW5kQXR0cmlidXRlc0dyYW1tYXIgPSByZXF1aXJlKCcuLi9kaXN0L29wZXJhdGlvbnMtYW5kLWF0dHJpYnV0ZXMnKTtcbiAgICBpbml0QnVpbHRJblNlbWFudGljcyhidWlsdEluUnVsZXMpO1xuICAgIGluaXRQcm90b3R5cGVQYXJzZXIob3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyKTsgLy8gcmVxdWlyZXMgQnVpbHRJblNlbWFudGljc1xufSk7XG5mdW5jdGlvbiBpbml0QnVpbHRJblNlbWFudGljcyhidWlsdEluUnVsZXMpIHtcbiAgICB2YXIgYWN0aW9ucyA9IHtcbiAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLml0ZXJhdGlvbigpO1xuICAgICAgICB9LFxuICAgICAgICBub25FbXB0eTogZnVuY3Rpb24gKGZpcnN0LCBfLCByZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVyYXRpb24oW2ZpcnN0XS5jb25jYXQocmVzdC5jaGlsZHJlbikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcyA9IFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3MoYnVpbHRJblJ1bGVzLCBudWxsKS5hZGRPcGVyYXRpb24oJ2FzSXRlcmF0aW9uJywge1xuICAgICAgICBlbXB0eUxpc3RPZjogYWN0aW9ucy5lbXB0eSxcbiAgICAgICAgbm9uZW1wdHlMaXN0T2Y6IGFjdGlvbnMubm9uRW1wdHksXG4gICAgICAgIEVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBOb25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eVxuICAgIH0pO1xufVxuZnVuY3Rpb24gaW5pdFByb3RvdHlwZVBhcnNlcihncmFtbWFyKSB7XG4gICAgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcyA9IGdyYW1tYXIuY3JlYXRlU2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCdwYXJzZScsIHtcbiAgICAgICAgQXR0cmlidXRlU2lnbmF0dXJlOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgICAgICAgICAgZm9ybWFsczogW11cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG4gICAgICAgIE9wZXJhdGlvblNpZ25hdHVyZTogZnVuY3Rpb24gKG5hbWUsIG9wdEZvcm1hbHMpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZS5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIGZvcm1hbHM6IG9wdEZvcm1hbHMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnBhcnNlKCk7IH0pWzBdIHx8IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBGb3JtYWxzOiBmdW5jdGlvbiAob3BhcmVuLCBmcywgY3BhcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuYXNJdGVyYXRpb24oKS5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMucGFyc2UoKTsgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6IGZ1bmN0aW9uIChmaXJzdCwgcmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcHJvdG90eXBlR3JhbW1hciA9IGdyYW1tYXI7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gU2VtYW50aWNzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGB0b1N0cmluZ2Agb3V0cHV0LlxudmFyIEJBTExPVF9YID0gJ1xcdTI3MTcnO1xudmFyIENIRUNLX01BUksgPSAnXFx1MjcxMyc7XG52YXIgRE9UX09QRVJBVE9SID0gJ1xcdTIyQzUnO1xudmFyIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XID0gJ1xcdTIxRDInO1xudmFyIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OID0gJ1xcdTI0MDknO1xudmFyIFNZTUJPTF9GT1JfTElORV9GRUVEID0gJ1xcdTI0MEEnO1xudmFyIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOID0gJ1xcdTI0MEQnO1xudmFyIEZsYWdzID0ge1xuICAgIHN1Y2NlZWRlZDogMSA8PCAwLFxuICAgIGlzUm9vdE5vZGU6IDEgPDwgMSxcbiAgICBpc0ltcGxpY2l0U3BhY2VzOiAxIDw8IDIsXG4gICAgaXNNZW1vaXplZDogMSA8PCAzLFxuICAgIGlzSGVhZE9mTGVmdFJlY3Vyc2lvbjogMSA8PCA0LFxuICAgIHRlcm1pbmF0ZXNMUjogMSA8PCA1XG59O1xuZnVuY3Rpb24gc3BhY2VzKG4pIHtcbiAgICByZXR1cm4gY29tbW9uLnJlcGVhdCgnICcsIG4pLmpvaW4oJycpO1xufVxuLy8gUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcG9ydGlvbiBvZiBgaW5wdXRgIGF0IG9mZnNldCBgcG9zYC5cbi8vIFRoZSByZXN1bHQgd2lsbCBjb250YWluIGV4YWN0bHkgYGxlbmAgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIGdldElucHV0RXhjZXJwdChpbnB1dCwgcG9zLCBsZW4pIHtcbiAgICB2YXIgZXhjZXJwdCA9IGFzRXNjYXBlZFN0cmluZyhpbnB1dC5zbGljZShwb3MsIHBvcyArIGxlbikpO1xuICAgIC8vIFBhZCB0aGUgb3V0cHV0IGlmIG5lY2Vzc2FyeS5cbiAgICBpZiAoZXhjZXJwdC5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIGV4Y2VycHQgKyBjb21tb24ucmVwZWF0KCcgJywgbGVuIC0gZXhjZXJwdC5sZW5ndGgpLmpvaW4oJycpO1xuICAgIH1cbiAgICByZXR1cm4gZXhjZXJwdDtcbn1cbmZ1bmN0aW9uIGFzRXNjYXBlZFN0cmluZyhvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gUmVwbGFjZSBub24tcHJpbnRhYmxlIGNoYXJhY3RlcnMgd2l0aCB2aXNpYmxlIHN5bWJvbHMuXG4gICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csIERPVF9PUEVSQVRPUilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgU1lNQk9MX0ZPUl9IT1JJWk9OVEFMX1RBQlVMQVRJT04pXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIFNZTUJPTF9GT1JfTElORV9GRUVEKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTik7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcob2JqKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFRyYWNlIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBUcmFjZShpbnB1dCwgcG9zMSwgcG9zMiwgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncywgb3B0Q2hpbGRyZW4pIHtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5wb3MgPSB0aGlzLnBvczEgPSBwb3MxO1xuICAgIHRoaXMucG9zMiA9IHBvczI7XG4gICAgdGhpcy5zb3VyY2UgPSBuZXcgSW50ZXJ2YWwoaW5wdXQsIHBvczEsIHBvczIpO1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBvcHRDaGlsZHJlbiB8fCBbXTtcbiAgICB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeSA9IG51bGw7XG4gICAgdGhpcy5fZmxhZ3MgPSBzdWNjZWVkZWQgPyBGbGFncy5zdWNjZWVkZWQgOiAwO1xufVxuLy8gQSB2YWx1ZSB0aGF0IGNhbiBiZSByZXR1cm5lZCBmcm9tIHZpc2l0b3IgZnVuY3Rpb25zIHRvIGluZGljYXRlIHRoYXQgYVxuLy8gbm9kZSBzaG91bGQgbm90IGJlIHJlY3Vyc2VkIGludG8uXG5UcmFjZS5wcm90b3R5cGUuU0tJUCA9IHt9O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYWNlLnByb3RvdHlwZSwgJ2Rpc3BsYXlTdHJpbmcnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cHIudG9EaXNwbGF5U3RyaW5nKCk7XG4gICAgfVxufSk7XG4vLyBGb3IgY29udmVuaWVuY2UsIGNyZWF0ZSBhIGdldHRlciBhbmQgc2V0dGVyIGZvciB0aGUgYm9vbGVhbiBmbGFncyBpbiBgRmxhZ3NgLlxuT2JqZWN0LmtleXMoRmxhZ3MpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgbWFzayA9IEZsYWdzW25hbWVdO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFjZS5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZsYWdzICYgbWFzaykgIT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzIHw9IG1hc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyAmPSB+bWFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5UcmFjZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmVXaXRoRXhwcih0aGlzLmV4cHIpO1xufTtcblRyYWNlLnByb3RvdHlwZS5jbG9uZVdpdGhFeHByID0gZnVuY3Rpb24gKGV4cHIpIHtcbiAgICB2YXIgYW5zID0gbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHRoaXMucG9zLCB0aGlzLnBvczIsIGV4cHIsIHRoaXMuc3VjY2VlZGVkLCB0aGlzLmJpbmRpbmdzLCB0aGlzLmNoaWxkcmVuKTtcbiAgICBhbnMuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gdGhpcy5pc0hlYWRPZkxlZnRSZWN1cnNpb247XG4gICAgYW5zLmlzSW1wbGljaXRTcGFjZXMgPSB0aGlzLmlzSW1wbGljaXRTcGFjZXM7XG4gICAgYW5zLmlzTWVtb2l6ZWQgPSB0aGlzLmlzTWVtb2l6ZWQ7XG4gICAgYW5zLmlzUm9vdE5vZGUgPSB0aGlzLmlzUm9vdE5vZGU7XG4gICAgYW5zLnRlcm1pbmF0ZXNMUiA9IHRoaXMudGVybWluYXRlc0xSO1xuICAgIGFucy50ZXJtaW5hdGluZ0xSRW50cnkgPSB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeTtcbiAgICByZXR1cm4gYW5zO1xufTtcbi8vIFJlY29yZCB0aGUgdHJhY2UgaW5mb3JtYXRpb24gZm9yIHRoZSB0ZXJtaW5hdGluZyBjb25kaXRpb24gb2YgdGhlIExSIGxvb3AuXG5UcmFjZS5wcm90b3R5cGUucmVjb3JkTFJUZXJtaW5hdGlvbiA9IGZ1bmN0aW9uIChydWxlQm9keVRyYWNlLCB2YWx1ZSkge1xuICAgIHRoaXMudGVybWluYXRpbmdMUkVudHJ5ID0gbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHRoaXMucG9zLCB0aGlzLnBvczIsIHRoaXMuZXhwciwgZmFsc2UsIFt2YWx1ZV0sIFtydWxlQm9keVRyYWNlXSk7XG4gICAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkudGVybWluYXRlc0xSID0gdHJ1ZTtcbn07XG4vLyBSZWN1cnNpdmVseSB0cmF2ZXJzZSB0aGlzIHRyYWNlIG5vZGUgYW5kIGFsbCBpdHMgZGVzY2VuZGVudHMsIGNhbGxpbmcgYSB2aXNpdG9yIGZ1bmN0aW9uXG4vLyBmb3IgZWFjaCBub2RlIHRoYXQgaXMgdmlzaXRlZC4gSWYgYHZpc3Rvck9iak9yRm5gIGlzIGFuIG9iamVjdCwgdGhlbiBpdHMgJ2VudGVyJyBwcm9wZXJ0eVxuLy8gaXMgYSBmdW5jdGlvbiB0byBjYWxsIGJlZm9yZSB2aXNpdGluZyB0aGUgY2hpbGRyZW4gb2YgYSBub2RlLCBhbmQgaXRzICdleGl0JyBwcm9wZXJ0eSBpc1xuLy8gYSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyd2FyZHMuIElmIGB2aXNpdG9yT2JqT3JGbmAgaXMgYSBmdW5jdGlvbiwgaXQgcmVwcmVzZW50cyB0aGUgJ2VudGVyJ1xuLy8gZnVuY3Rpb24uXG4vL1xuLy8gVGhlIGZ1bmN0aW9ucyBhcmUgY2FsbGVkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgVHJhY2Ugbm9kZSwgaXRzIHBhcmVudCBUcmFjZSwgYW5kIGEgbnVtYmVyXG4vLyByZXByZXNlbnRpbmcgdGhlIGRlcHRoIG9mIHRoZSBub2RlIGluIHRoZSB0cmVlLiAoVGhlIHJvb3Qgbm9kZSBoYXMgZGVwdGggMC4pIGBvcHRUaGlzQXJnYCwgaWZcbi8vIHNwZWNpZmllZCwgaXMgdGhlIHZhbHVlIHRvIHVzZSBmb3IgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIHRoZSB2aXNpdG9yIGZ1bmN0aW9ucy5cblRyYWNlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24gKHZpc2l0b3JPYmpPckZuLCBvcHRUaGlzQXJnKSB7XG4gICAgdmFyIHZpc2l0b3IgPSB2aXNpdG9yT2JqT3JGbjtcbiAgICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmlzaXRvciA9IHsgZW50ZXI6IHZpc2l0b3IgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gX3dhbGsobm9kZSwgcGFyZW50LCBkZXB0aCkge1xuICAgICAgICB2YXIgcmVjdXJzZSA9IHRydWU7XG4gICAgICAgIGlmICh2aXNpdG9yLmVudGVyKSB7XG4gICAgICAgICAgICBpZiAodmlzaXRvci5lbnRlci5jYWxsKG9wdFRoaXNBcmcsIG5vZGUsIHBhcmVudCwgZGVwdGgpID09PSBUcmFjZS5wcm90b3R5cGUuU0tJUCkge1xuICAgICAgICAgICAgICAgIHJlY3Vyc2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjdXJzZSkge1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIF93YWxrKGNoaWxkLCBub2RlLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodmlzaXRvci5leGl0KSB7XG4gICAgICAgICAgICAgICAgdmlzaXRvci5leGl0LmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNSb290Tm9kZSkge1xuICAgICAgICAvLyBEb24ndCB2aXNpdCB0aGUgcm9vdCBub2RlIGl0c2VsZiwgb25seSBpdHMgY2hpbGRyZW4uXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgX3dhbGsoYywgbnVsbCwgMCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX3dhbGsodGhpcywgbnVsbCwgMCk7XG4gICAgfVxufTtcbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhY2UuXG4vLyBTYW1wbGU6XG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzIOKckyBleHAg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICDinJMgYWRkRXhwIChMUikg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICAgICAg4pyXIGFkZEV4cF9wbHVzXG5UcmFjZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHRoaXMud2FsayhmdW5jdGlvbiAobm9kZSwgcGFyZW50LCBkZXB0aCkge1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5TS0lQO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdG9yTmFtZSA9IG5vZGUuZXhwci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAvLyBEb24ndCBwcmludCBhbnl0aGluZyBmb3IgQWx0IG5vZGVzLlxuICAgICAgICBpZiAoY3Rvck5hbWUgPT09ICdBbHQnKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoZ2V0SW5wdXRFeGNlcnB0KG5vZGUuaW5wdXQsIG5vZGUucG9zLCAxMCkgKyBzcGFjZXMoZGVwdGggKiAyICsgMSkpO1xuICAgICAgICBzYi5hcHBlbmQoKG5vZGUuc3VjY2VlZGVkID8gQ0hFQ0tfTUFSSyA6IEJBTExPVF9YKSArICcgJyArIG5vZGUuZGlzcGxheVN0cmluZyk7XG4gICAgICAgIGlmIChub2RlLmlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgc2IuYXBwZW5kKCcgKExSKScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnN1Y2NlZWRlZCkge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRzID0gYXNFc2NhcGVkU3RyaW5nKG5vZGUuc291cmNlLmNvbnRlbnRzKTtcbiAgICAgICAgICAgIHNiLmFwcGVuZCgnICcgKyBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyArICcgICcpO1xuICAgICAgICAgICAgc2IuYXBwZW5kKHR5cGVvZiBjb250ZW50cyA9PT0gJ3N0cmluZycgPyAnXCInICsgY29udGVudHMgKyAnXCInIDogY29udGVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9O1xuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKykge1xuICAgIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gPSBcIlxcXFwnXCI7XG5lc2NhcGVTdHJpbmdGb3JbJ1wiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXCInO1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCc7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInO1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInO1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0JztcbmVzY2FwZVN0cmluZ0ZvclsnXFx1MDAwYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24gKG9wdE1ldGhvZE5hbWUpIHtcbiAgICB2YXIgbWV0aG9kTmFtZSA9IG9wdE1ldGhvZE5hbWUgfHwgJyc7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGlzIG1ldGhvZCAnICtcbiAgICAgICAgICAgIG1ldGhvZE5hbWUgK1xuICAgICAgICAgICAgJyBpcyBhYnN0cmFjdCEgJyArXG4gICAgICAgICAgICAnKGl0IGhhcyBubyBpbXBsZW1lbnRhdGlvbiBpbiBjbGFzcyAnICtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IubmFtZSArXG4gICAgICAgICAgICAnKScpO1xuICAgIH07XG59O1xuZXhwb3J0cy5hc3NlcnQgPSBmdW5jdGlvbiAoY29uZCwgbWVzc2FnZSkge1xuICAgIGlmICghY29uZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxufTtcbi8vIERlZmluZSBhIGxhemlseS1jb21wdXRlZCwgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgbmFtZWQgYHByb3BOYW1lYFxuLy8gb24gdGhlIG9iamVjdCBgb2JqYC4gYGdldHRlckZuYCB3aWxsIGJlIGNhbGxlZCB0byBjb21wdXRlIHRoZSB2YWx1ZSB0aGVcbi8vIGZpcnN0IHRpbWUgdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkLlxuZXhwb3J0cy5kZWZpbmVMYXp5UHJvcGVydHkgPSBmdW5jdGlvbiAob2JqLCBwcm9wTmFtZSwgZ2V0dGVyRm4pIHtcbiAgICB2YXIgbWVtbztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghbWVtbykge1xuICAgICAgICAgICAgICAgIG1lbW8gPSBnZXR0ZXJGbi5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmopIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMucmVwZWF0Rm4gPSBmdW5jdGlvbiAoZm4sIG4pIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgd2hpbGUgKG4tLSA+IDApIHtcbiAgICAgICAgYXJyLnB1c2goZm4oKSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59O1xuZXhwb3J0cy5yZXBlYXRTdHIgPSBmdW5jdGlvbiAoc3RyLCBuKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheShuICsgMSkuam9pbihzdHIpO1xufTtcbmV4cG9ydHMucmVwZWF0ID0gZnVuY3Rpb24gKHgsIG4pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5yZXBlYXRGbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9LCBuKTtcbn07XG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgICAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKSB7XG4gICAgICAgICAgICBkdXBsaWNhdGVzLnB1c2goeCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuZXhwb3J0cy5jb3B5V2l0aG91dER1cGxpY2F0ZXMgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICB2YXIgbm9EdXBsaWNhdGVzID0gW107XG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgaWYgKG5vRHVwbGljYXRlcy5pbmRleE9mKGVudHJ5KSA8IDApIHtcbiAgICAgICAgICAgIG5vRHVwbGljYXRlcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBub0R1cGxpY2F0ZXM7XG59O1xuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgICByZXR1cm4gZmlyc3RDaGFyID09PSBmaXJzdENoYXIudG9VcHBlckNhc2UoKTtcbn07XG5leHBvcnRzLmlzTGV4aWNhbCA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHJldHVybiAhZXhwb3J0cy5pc1N5bnRhY3RpYyhydWxlTmFtZSk7XG59O1xuZXhwb3J0cy5wYWRMZWZ0ID0gZnVuY3Rpb24gKHN0ciwgbGVuLCBvcHRDaGFyKSB7XG4gICAgdmFyIGNoID0gb3B0Q2hhciB8fCAnICc7XG4gICAgaWYgKHN0ci5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucmVwZWF0U3RyKGNoLCBsZW4gLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG4vLyBTdHJpbmdCdWZmZXJcbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RyaW5ncyA9IFtdO1xufTtcbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgdGhpcy5zdHJpbmdzLnB1c2goc3RyKTtcbn07XG5leHBvcnRzLlN0cmluZ0J1ZmZlci5wcm90b3R5cGUuY29udGVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKTtcbn07XG4vLyBDaGFyYWN0ZXIgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmdcbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uIChjLCBvcHREZWxpbSkge1xuICAgIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICBpZiAoKGMgPT09ICdcIicgfHwgYyA9PT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKSB7XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cbiAgICBlbHNlIGlmIChjaGFyQ29kZSA8IDEyOCkge1xuICAgICAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KSB7XG4gICAgICAgIHJldHVybiAnXFxcXHgnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMiwgJzAnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAnXFxcXHUnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNCwgJzAnKTtcbiAgICB9XG59O1xuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbiAocykge1xuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxiJztcbiAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxmJztcbiAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxuJztcbiAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxyJztcbiAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFx0JztcbiAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFx2JztcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpO1xuICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBzLmNoYXJBdCgxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxufTtcbi8vIEhlbHBlciBmb3IgcHJvZHVjaW5nIGEgZGVzY3JpcHRpb24gb2YgYW4gdW5rbm93biBvYmplY3QgaW4gYSBzYWZlIHdheS5cbi8vIEVzcGVjaWFsbHkgdXNlZnVsIGZvciBlcnJvciBtZXNzYWdlcyB3aGVyZSBhbiB1bmV4cGVjdGVkIHR5cGUgb2Ygb2JqZWN0IHdhcyBlbmNvdW50ZXJlZC5cbmV4cG9ydHMudW5leHBlY3RlZE9ialRvU3RyaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIHZhciBiYXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZU5hbWUgPSB2b2lkIDA7XG4gICAgICAgIGlmIChvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgICAgICAgIHR5cGVOYW1lID0gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYmFzZVRvU3RyaW5nLmluZGV4T2YoJ1tvYmplY3QgJykgPT09IDApIHtcbiAgICAgICAgICAgIHR5cGVOYW1lID0gYmFzZVRvU3RyaW5nLnNsaWNlKDgsIC0xKTsgLy8gRXh0cmFjdCBlLmcuIFwiQXJyYXlcIiBmcm9tIFwiW29iamVjdCBBcnJheV1cIi5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHR5cGVOYW1lID0gdHlwZW9mIG9iajtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZU5hbWUgKyAnOiAnICsgSlNPTi5zdHJpbmdpZnkoU3RyaW5nKG9iaikpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gYmFzZVRvU3RyaW5nO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdEludGVydmFsKSB7XG4gICAgdmFyIGU7XG4gICAgaWYgKG9wdEludGVydmFsKSB7XG4gICAgICAgIGUgPSBuZXcgRXJyb3Iob3B0SW50ZXJ2YWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UoKSArIG1lc3NhZ2UpO1xuICAgICAgICBlLnNob3J0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIGUuaW50ZXJ2YWwgPSBvcHRJbnRlcnZhbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGludGVydmFscyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihcIkludGVydmFsIHNvdXJjZXMgZG9uJ3QgbWF0Y2hcIik7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgZ3JhbW1hcnMgLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdyYW1tYXIgc3ludGF4IGVycm9yXG5mdW5jdGlvbiBncmFtbWFyU3ludGF4RXJyb3IobWF0Y2hGYWlsdXJlKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ21lc3NhZ2UnLCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoRmFpbHVyZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsICdzaG9ydE1lc3NhZ2UnLCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdFeHBlY3RlZCAnICsgbWF0Y2hGYWlsdXJlLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZS5pbnRlcnZhbCA9IG1hdGNoRmFpbHVyZS5nZXRJbnRlcnZhbCgpO1xuICAgIHJldHVybiBlO1xufVxuLy8gVW5kZWNsYXJlZCBncmFtbWFyXG5mdW5jdGlvbiB1bmRlY2xhcmVkR3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBpbnRlcnZhbCkge1xuICAgIHZhciBtZXNzYWdlID0gbmFtZXNwYWNlXG4gICAgICAgID8gJ0dyYW1tYXIgJyArXG4gICAgICAgICAgICBncmFtbWFyTmFtZSArXG4gICAgICAgICAgICAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArXG4gICAgICAgICAgICBOYW1lc3BhY2UudG9TdHJpbmcobmFtZXNwYWNlKVxuICAgICAgICA6ICdVbmRlY2xhcmVkIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lO1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihtZXNzYWdlLCBpbnRlcnZhbCk7XG59XG4vLyBEdXBsaWNhdGUgZ3JhbW1hciBkZWNsYXJhdGlvblxuZnVuY3Rpb24gZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGdyYW1tYXIsIG5hbWVzcGFjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignR3JhbW1hciAnICsgZ3JhbW1hci5uYW1lICsgJyBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIHRoaXMgbmFtZXNwYWNlJyk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBydWxlcyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gVW5kZWNsYXJlZCBydWxlXG5mdW5jdGlvbiB1bmRlY2xhcmVkUnVsZShydWxlTmFtZSwgZ3JhbW1hck5hbWUsIG9wdEludGVydmFsKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdSdWxlICcgKyBydWxlTmFtZSArICcgaXMgbm90IGRlY2xhcmVkIGluIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lLCBvcHRJbnRlcnZhbCk7XG59XG4vLyBDYW5ub3Qgb3ZlcnJpZGUgdW5kZWNsYXJlZCBydWxlXG5mdW5jdGlvbiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdDYW5ub3Qgb3ZlcnJpZGUgcnVsZSAnICsgcnVsZU5hbWUgKyAnIGJlY2F1c2UgaXQgaXMgbm90IGRlY2xhcmVkIGluICcgKyBncmFtbWFyTmFtZSwgb3B0U291cmNlKTtcbn1cbi8vIENhbm5vdCBleHRlbmQgdW5kZWNsYXJlZCBydWxlXG5mdW5jdGlvbiBjYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZShydWxlTmFtZSwgZ3JhbW1hck5hbWUsIG9wdFNvdXJjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQ2Fubm90IGV4dGVuZCBydWxlICcgKyBydWxlTmFtZSArICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpO1xufVxuLy8gRHVwbGljYXRlIHJ1bGUgZGVjbGFyYXRpb25cbmZ1bmN0aW9uIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUsIGRlY2xHcmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBcIkR1cGxpY2F0ZSBkZWNsYXJhdGlvbiBmb3IgcnVsZSAnXCIgKyBydWxlTmFtZSArIFwiJyBpbiBncmFtbWFyICdcIiArIGdyYW1tYXJOYW1lICsgXCInXCI7XG4gICAgaWYgKGdyYW1tYXJOYW1lICE9PSBkZWNsR3JhbW1hck5hbWUpIHtcbiAgICAgICAgbWVzc2FnZSArPSBcIiAob3JpZ2luYWxseSBkZWNsYXJlZCBpbiAnXCIgKyBkZWNsR3JhbW1hck5hbWUgKyBcIicpXCI7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVFcnJvcihtZXNzYWdlLCBvcHRTb3VyY2UpO1xufVxuLy8gV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnNcbmZ1bmN0aW9uIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBzb3VyY2UpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1dyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzIGZvciBydWxlICcgK1xuICAgICAgICBydWxlTmFtZSArXG4gICAgICAgICcgKGV4cGVjdGVkICcgK1xuICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgYWN0dWFsICtcbiAgICAgICAgJyknLCBzb3VyY2UpO1xufVxuLy8gV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1xuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyhydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgZXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgcnVsZSAnICtcbiAgICAgICAgcnVsZU5hbWUgK1xuICAgICAgICAnIChleHBlY3RlZCAnICtcbiAgICAgICAgZXhwZWN0ZWQgK1xuICAgICAgICAnLCBnb3QgJyArXG4gICAgICAgIGFjdHVhbCArXG4gICAgICAgICcpJywgZXhwci5zb3VyY2UpO1xufVxuLy8gRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lc1xuZnVuY3Rpb24gZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMocnVsZU5hbWUsIGR1cGxpY2F0ZXMsIHNvdXJjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lcyBpbiBydWxlICcgKyBydWxlTmFtZSArICc6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJyksIHNvdXJjZSk7XG59XG4vLyBJbnZhbGlkIHBhcmFtZXRlciBleHByZXNzaW9uXG5mdW5jdGlvbiBpbnZhbGlkUGFyYW1ldGVyKHJ1bGVOYW1lLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdJbnZhbGlkIHBhcmFtZXRlciB0byBydWxlICcgK1xuICAgICAgICBydWxlTmFtZSArXG4gICAgICAgICc6ICcgK1xuICAgICAgICBleHByICtcbiAgICAgICAgJyBoYXMgYXJpdHkgJyArXG4gICAgICAgIGV4cHIuZ2V0QXJpdHkoKSArXG4gICAgICAgICcsIGJ1dCBwYXJhbWV0ZXIgZXhwcmVzc2lvbnMgbXVzdCBoYXZlIGFyaXR5IDEnLCBleHByLnNvdXJjZSk7XG59XG4vLyBBcHBsaWNhdGlvbiBvZiBzeW50YWN0aWMgcnVsZSBmcm9tIGxleGljYWwgcnVsZVxuZnVuY3Rpb24gYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQocnVsZU5hbWUsIGFwcGx5RXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQ2Fubm90IGFwcGx5IHN5bnRhY3RpYyBydWxlICcgKyBydWxlTmFtZSArICcgZnJvbSBoZXJlIChpbnNpZGUgYSBsZXhpY2FsIGNvbnRleHQpJywgYXBwbHlFeHByLnNvdXJjZSk7XG59XG4vLyBJbmNvcnJlY3QgYXJndW1lbnQgdHlwZVxuZnVuY3Rpb24gaW5jb3JyZWN0QXJndW1lbnRUeXBlKGV4cGVjdGVkVHlwZSwgZXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignSW5jb3JyZWN0IGFyZ3VtZW50IHR5cGU6IGV4cGVjdGVkICcgKyBleHBlY3RlZFR5cGUsIGV4cHIuc291cmNlKTtcbn1cbi8vIE11bHRpcGxlIGluc3RhbmNlcyBvZiB0aGUgc3VwZXItc3BsaWNlIG9wZXJhdG9yIChgLi4uYCkgaW4gdGhlIHJ1bGUgYm9keS5cbmZ1bmN0aW9uIG11bHRpcGxlU3VwZXJTcGxpY2VzKGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoXCInLi4uJyBjYW4gYXBwZWFyIGF0IG1vc3Qgb25jZSBpbiBhIHJ1bGUgYm9keVwiLCBleHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBLbGVlbmUgb3BlcmF0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKGtsZWVuZUV4cHIsIGFwcGxpY2F0aW9uU3RhY2spIHtcbiAgICB2YXIgYWN0dWFscyA9IGFwcGxpY2F0aW9uU3RhY2subGVuZ3RoID4gMCA/IGFwcGxpY2F0aW9uU3RhY2tbYXBwbGljYXRpb25TdGFjay5sZW5ndGggLSAxXS5hcmdzIDogW107XG4gICAgdmFyIGV4cHIgPSBrbGVlbmVFeHByLmV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICB2YXIgbWVzc2FnZSA9ICdOdWxsYWJsZSBleHByZXNzaW9uICcgK1xuICAgICAgICBleHByICtcbiAgICAgICAgXCIgaXMgbm90IGFsbG93ZWQgaW5zaWRlICdcIiArXG4gICAgICAgIGtsZWVuZUV4cHIub3BlcmF0b3IgK1xuICAgICAgICBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCI7XG4gICAgaWYgKGFwcGxpY2F0aW9uU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgc3RhY2tUcmFjZSA9IGFwcGxpY2F0aW9uU3RhY2tcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGFwcCkgeyByZXR1cm4gbmV3IHBleHBycy5BcHBseShhcHAucnVsZU5hbWUsIGFwcC5hcmdzKTsgfSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICAgICAgbWVzc2FnZSArPSAnXFxuQXBwbGljYXRpb24gc3RhY2sgKG1vc3QgcmVjZW50IGFwcGxpY2F0aW9uIGxhc3QpOlxcbicgKyBzdGFja1RyYWNlO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlRXJyb3IobWVzc2FnZSwga2xlZW5lRXhwci5leHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBhcml0eSAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1J1bGUgJyArXG4gICAgICAgIHJ1bGVOYW1lICtcbiAgICAgICAgJyBpbnZvbHZlcyBhbiBhbHRlcm5hdGlvbiB3aGljaCBoYXMgaW5jb25zaXN0ZW50IGFyaXR5ICcgK1xuICAgICAgICAnKGV4cGVjdGVkICcgK1xuICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgYWN0dWFsICtcbiAgICAgICAgJyknLCBleHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ09iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJykpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gY29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpbnZhbGlkQ29uc3RydWN0b3JDYWxsKGdyYW1tYXIsIGN0b3JOYW1lLCBjaGlsZHJlbikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQXR0ZW1wdCB0byBpbnZva2UgY29uc3RydWN0b3IgJyArIGN0b3JOYW1lICsgJyB3aXRoIGludmFsaWQgb3IgdW5leHBlY3RlZCBhcmd1bWVudHMnKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnZlbmllbmNlIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBtdWx0aXBsZUVycm9ycyhlcnJvcnMpIHtcbiAgICB2YXIgbWVzc2FnZXMgPSBlcnJvcnMubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLm1lc3NhZ2U7IH0pO1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihbJ0Vycm9yczonXS5jb25jYXQobWVzc2FnZXMpLmpvaW4oJ1xcbi0gJyksIGVycm9yc1swXS5pbnRlcnZhbCk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBzZW1hbnRpYyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gbWlzc2luZ1NlbWFudGljQWN0aW9uKGN0b3JOYW1lLCBuYW1lLCB0eXBlLCBzdGFjaykge1xuICAgIHZhciBzdGFja1RyYWNlID0gc3RhY2tcbiAgICAgICAgLnNsaWNlKDAsIC0xKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgIHZhciBhbnMgPSAnICAnICsgaW5mb1swXS5uYW1lICsgJyA+ICcgKyBpbmZvWzFdO1xuICAgICAgICByZXR1cm4gaW5mby5sZW5ndGggPT09IDMgPyBhbnMgKyBcIiBmb3IgJ1wiICsgaW5mb1syXSArIFwiJ1wiIDogYW5zO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICBzdGFja1RyYWNlICs9ICdcXG4gICcgKyBuYW1lICsgJyA+ICcgKyBjdG9yTmFtZTtcbiAgICB2YXIgbW9yZUluZm8gPSAnJztcbiAgICBpZiAoY3Rvck5hbWUgPT09ICdfaXRlcicpIHtcbiAgICAgICAgbW9yZUluZm8gPSBbXG4gICAgICAgICAgICAnXFxuTk9URTogYXMgb2YgT2htIHYxNiwgdGhlcmUgaXMgbm8gZGVmYXVsdCBhY3Rpb24gZm9yIGl0ZXJhdGlvbiBub2RlcyDigJQgc2VlICcsXG4gICAgICAgICAgICAnICBodHRwczovL2dpdC5pby9KUnd0RyBmb3IgZGV0YWlscy4nXG4gICAgICAgIF0uam9pbignXFxuJyk7XG4gICAgfVxuICAgIHZhciBtZXNzYWdlID0gW1xuICAgICAgICBcIk1pc3Npbmcgc2VtYW50aWMgYWN0aW9uIGZvciAnXCIgKyBjdG9yTmFtZSArIFwiJyBpbiBcIiArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInLlwiICsgbW9yZUluZm8sXG4gICAgICAgICdBY3Rpb24gc3RhY2sgKG1vc3QgcmVjZW50IGNhbGwgbGFzdCk6JyxcbiAgICAgICAgc3RhY2tUcmFjZVxuICAgIF0uam9pbignXFxuJyk7XG4gICAgdmFyIGUgPSBjcmVhdGVFcnJvcihtZXNzYWdlKTtcbiAgICBlLm5hbWUgPSAnbWlzc2luZ1NlbWFudGljQWN0aW9uJztcbiAgICByZXR1cm4gZTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQ6IGFwcGxpY2F0aW9uT2ZTeW50YWN0aWNSdWxlRnJvbUxleGljYWxDb250ZXh0LFxuICAgIGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlOiBjYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZSxcbiAgICBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlOiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlLFxuICAgIGR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbjogZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uLFxuICAgIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzOiBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyxcbiAgICBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzOiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzLFxuICAgIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbjogZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uLFxuICAgIGluY29uc2lzdGVudEFyaXR5OiBpbmNvbnNpc3RlbnRBcml0eSxcbiAgICBpbmNvcnJlY3RBcmd1bWVudFR5cGU6IGluY29ycmVjdEFyZ3VtZW50VHlwZSxcbiAgICBpbnRlcnZhbFNvdXJjZXNEb250TWF0Y2g6IGludGVydmFsU291cmNlc0RvbnRNYXRjaCxcbiAgICBpbnZhbGlkQ29uc3RydWN0b3JDYWxsOiBpbnZhbGlkQ29uc3RydWN0b3JDYWxsLFxuICAgIGludmFsaWRQYXJhbWV0ZXI6IGludmFsaWRQYXJhbWV0ZXIsXG4gICAgZ3JhbW1hclN5bnRheEVycm9yOiBncmFtbWFyU3ludGF4RXJyb3IsXG4gICAga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZDoga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCxcbiAgICBtaXNzaW5nU2VtYW50aWNBY3Rpb246IG1pc3NpbmdTZW1hbnRpY0FjdGlvbixcbiAgICBtdWx0aXBsZVN1cGVyU3BsaWNlczogbXVsdGlwbGVTdXBlclNwbGljZXMsXG4gICAgdW5kZWNsYXJlZEdyYW1tYXI6IHVuZGVjbGFyZWRHcmFtbWFyLFxuICAgIHVuZGVjbGFyZWRSdWxlOiB1bmRlY2xhcmVkUnVsZSxcbiAgICB3cm9uZ051bWJlck9mQXJndW1lbnRzOiB3cm9uZ051bWJlck9mQXJndW1lbnRzLFxuICAgIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzOiB3cm9uZ051bWJlck9mUGFyYW1ldGVycyxcbiAgICB0aHJvd0Vycm9yczogZnVuY3Rpb24gKGVycm9ycykge1xuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhyb3cgbXVsdGlwbGVFcnJvcnMoZXJyb3JzKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIvKiBnbG9iYWwgZG9jdW1lbnQsIFhNTEh0dHBSZXF1ZXN0ICovXG4ndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBCdWlsZGVyID0gcmVxdWlyZSgnLi9CdWlsZGVyJyk7XG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hcicpO1xudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIHZlcnNpb24gPSByZXF1aXJlKCcuL3ZlcnNpb24nKTtcbnZhciBpc0J1ZmZlciA9IHJlcXVpcmUoJ2lzLWJ1ZmZlcicpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUaGUgbWV0YWdyYW1tYXIsIGkuZS4gdGhlIGdyYW1tYXIgZm9yIE9obSBncmFtbWFycy4gSW5pdGlhbGl6ZWQgYXQgdGhlXG4vLyBib3R0b20gb2YgdGhpcyBmaWxlIGJlY2F1c2UgbG9hZGluZyB0aGUgZ3JhbW1hciByZXF1aXJlcyBPaG0gaXRzZWxmLlxudmFyIG9obUdyYW1tYXI7XG4vLyBBbiBvYmplY3Qgd2hpY2ggbWFrZXMgaXQgcG9zc2libGUgdG8gc3R1YiBvdXQgdGhlIGRvY3VtZW50IEFQSSBmb3IgdGVzdGluZy5cbnZhciBkb2N1bWVudEludGVyZmFjZSA9IHtcbiAgICBxdWVyeVNlbGVjdG9yOiBmdW5jdGlvbiAoc2VsKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgfSxcbiAgICBxdWVyeVNlbGVjdG9yQWxsOiBmdW5jdGlvbiAoc2VsKSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCk7XG4gICAgfVxufTtcbnZhciBzdXBlclNwbGljZVBsYWNlaG9sZGVyID0gT2JqZWN0LmNyZWF0ZShwZXhwcnMuUEV4cHIucHJvdG90eXBlKTtcbi8vIENoZWNrIGlmIGBvYmpgIGlzIGEgRE9NIGVsZW1lbnQuXG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufVxuZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXZvaWRcbn1cbnZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuZnVuY3Rpb24gaXNBcnJheUxpa2Uob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG59XG4vLyBUT0RPOiBqdXN0IHVzZSB0aGUgalF1ZXJ5IHRoaW5nXG5mdW5jdGlvbiBsb2FkKHVybCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgdXJsLCBmYWxzZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVxLnNlbmQoKTtcbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDAgfHwgcmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkgeyB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9hZCB1cmwgJyArIHVybCk7XG59XG4vLyBSZXR1cm5zIGEgR3JhbW1hciBpbnN0YW5jZSAoaS5lLiwgYW4gb2JqZWN0IHdpdGggYSBgbWF0Y2hgIG1ldGhvZCkgZm9yXG4vLyBgdHJlZWAsIHdoaWNoIGlzIHRoZSBjb25jcmV0ZSBzeW50YXggdHJlZSBvZiBhIHVzZXItd3JpdHRlbiBncmFtbWFyLlxuLy8gVGhlIGdyYW1tYXIgd2lsbCBiZSBhc3NpZ25lZCBpbnRvIGBuYW1lc3BhY2VgIHVuZGVyIHRoZSBuYW1lIG9mIHRoZSBncmFtbWFyXG4vLyBhcyBzcGVjaWZpZWQgaW4gdGhlIHNvdXJjZS5cbmZ1bmN0aW9uIGJ1aWxkR3JhbW1hcihtYXRjaCwgbmFtZXNwYWNlLCBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZykge1xuICAgIHZhciBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICB2YXIgZGVjbDtcbiAgICB2YXIgY3VycmVudFJ1bGVOYW1lO1xuICAgIHZhciBjdXJyZW50UnVsZUZvcm1hbHM7XG4gICAgdmFyIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgICB2YXIgbWV0YUdyYW1tYXIgPSBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZyB8fCBvaG1HcmFtbWFyO1xuICAgIC8vIEEgdmlzaXRvciB0aGF0IHByb2R1Y2VzIGEgR3JhbW1hciBpbnN0YW5jZSBmcm9tIHRoZSBDU1QuXG4gICAgdmFyIGhlbHBlcnMgPSBtZXRhR3JhbW1hci5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3Zpc2l0Jywge1xuICAgICAgICBHcmFtbWFyczogZnVuY3Rpb24gKGdyYW1tYXJJdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gZ3JhbW1hckl0ZXIuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pO1xuICAgICAgICB9LFxuICAgICAgICBHcmFtbWFyOiBmdW5jdGlvbiAoaWQsIHMsIF9vcGVuLCBydWxlcywgX2Nsb3NlKSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hck5hbWUgPSBpZC52aXNpdCgpO1xuICAgICAgICAgICAgZGVjbCA9IGJ1aWxkZXIubmV3R3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlKTtcbiAgICAgICAgICAgIHMuY2hpbGQoMCkgJiYgcy5jaGlsZCgwKS52aXNpdCgpO1xuICAgICAgICAgICAgcnVsZXMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pO1xuICAgICAgICAgICAgdmFyIGcgPSBkZWNsLmJ1aWxkKCk7XG4gICAgICAgICAgICBnLnNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIGlmIChncmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGcsIG5hbWVzcGFjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuYW1lc3BhY2VbZ3JhbW1hck5hbWVdID0gZztcbiAgICAgICAgICAgIHJldHVybiBnO1xuICAgICAgICB9LFxuICAgICAgICBTdXBlckdyYW1tYXI6IGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgICAgICAgICB2YXIgc3VwZXJHcmFtbWFyTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgICAgICAgIGlmIChzdXBlckdyYW1tYXJOYW1lID09PSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICBkZWNsLndpdGhTdXBlckdyYW1tYXIobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoIW5hbWVzcGFjZSB8fCAhKHN1cGVyR3JhbW1hck5hbWUgaW4gbmFtZXNwYWNlKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZEdyYW1tYXIoc3VwZXJHcmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBuLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihuYW1lc3BhY2Vbc3VwZXJHcmFtbWFyTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBSdWxlX2RlZmluZTogZnVuY3Rpb24gKG4sIGZzLCBkLCBfLCBiKSB7XG4gICAgICAgICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSlbMF0gfHwgW107XG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUgeWV0LCBzZXQgaXQgbm93LiBUaGlzIG11c3QgYmUgZG9uZSBiZWZvcmUgdmlzaXRpbmdcbiAgICAgICAgICAgIC8vIHRoZSBib2R5LCBiZWNhdXNlIGl0IG1pZ2h0IGNvbnRhaW4gYW4gaW5saW5lIHJ1bGUgZGVmaW5pdGlvbi5cbiAgICAgICAgICAgIGlmICghZGVjbC5kZWZhdWx0U3RhcnRSdWxlICYmIGRlY2wuZW5zdXJlU3VwZXJHcmFtbWFyKCkgIT09IEdyYW1tYXIuUHJvdG9CdWlsdEluUnVsZXMpIHtcbiAgICAgICAgICAgICAgICBkZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGN1cnJlbnRSdWxlTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IGQuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pWzBdO1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIHJldHVybiBkZWNsLmRlZmluZShjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVfb3ZlcnJpZGU6IGZ1bmN0aW9uIChuLCBmcywgXywgYikge1xuICAgICAgICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pWzBdIHx8IFtdO1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIGRlY2wuZW5zdXJlU3VwZXJHcmFtbWFyUnVsZUZvck92ZXJyaWRpbmcoY3VycmVudFJ1bGVOYW1lLCBzb3VyY2UpO1xuICAgICAgICAgICAgb3ZlcnJpZGluZyA9IHRydWU7XG4gICAgICAgICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgICAgICAgIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiBkZWNsLm92ZXJyaWRlKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBSdWxlX2V4dGVuZDogZnVuY3Rpb24gKG4sIGZzLCBfLCBiKSB7XG4gICAgICAgICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSlbMF0gfHwgW107XG4gICAgICAgICAgICB2YXIgYm9keSA9IGIudmlzaXQoKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltbWVkKCk7XG4gICAgICAgICAgICByZXR1cm4gZGVjbC5leHRlbmQoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVCb2R5OiBmdW5jdGlvbiAoXywgdGVybXMpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gdGVybXMudmlzaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgT3ZlcnJpZGVSdWxlQm9keTogZnVuY3Rpb24gKF8sIHRlcm1zKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IHRlcm1zLnZpc2l0KCk7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgc3VwZXItc3BsaWNlIG9wZXJhdG9yIChgLi4uYCkgYXBwZWFycyBpbiB0aGUgdGVybXMuXG4gICAgICAgICAgICB2YXIgZXhwYW5zaW9uUG9zID0gYXJncy5pbmRleE9mKHN1cGVyU3BsaWNlUGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgaWYgKGV4cGFuc2lvblBvcyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJlZm9yZVRlcm1zID0gYXJncy5zbGljZSgwLCBleHBhbnNpb25Qb3MpO1xuICAgICAgICAgICAgICAgIHZhciBhZnRlclRlcm1zID0gYXJncy5zbGljZShleHBhbnNpb25Qb3MgKyAxKTtcbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgaXQgYXBwZWFycyBubyBtb3JlIHRoYW4gb25jZS5cbiAgICAgICAgICAgICAgICBhZnRlclRlcm1zLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT09IHN1cGVyU3BsaWNlUGxhY2Vob2xkZXIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcnMubXVsdGlwbGVTdXBlclNwbGljZXModCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuU3BsaWNlKGRlY2wuc3VwZXJHcmFtbWFyLCBjdXJyZW50UnVsZU5hbWUsIGJlZm9yZVRlcm1zLCBhZnRlclRlcm1zKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgRm9ybWFsczogZnVuY3Rpb24gKG9wb2ludHksIGZzLCBjcG9pbnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gZnMudmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgUGFyYW1zOiBmdW5jdGlvbiAob3BvaW50eSwgcHMsIGNwb2ludHkpIHtcbiAgICAgICAgICAgIHJldHVybiBwcy52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBBbHQ6IGZ1bmN0aW9uIChzZXFzKSB7XG4gICAgICAgICAgICB2YXIgYXJncyA9IHNlcXMudmlzaXQoKTtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmFsdC5hcHBseShidWlsZGVyLCBhcmdzKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgVG9wTGV2ZWxUZXJtX2lubGluZTogZnVuY3Rpb24gKGIsIG4pIHtcbiAgICAgICAgICAgIHZhciBpbmxpbmVSdWxlTmFtZSA9IGN1cnJlbnRSdWxlTmFtZSArICdfJyArIG4udmlzaXQoKTtcbiAgICAgICAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIHZhciBpc05ld1J1bGVEZWNsYXJhdGlvbiA9ICEoZGVjbC5zdXBlckdyYW1tYXIgJiYgZGVjbC5zdXBlckdyYW1tYXIucnVsZXNbaW5saW5lUnVsZU5hbWVdKTtcbiAgICAgICAgICAgIGlmIChvdmVycmlkaW5nICYmICFpc05ld1J1bGVEZWNsYXJhdGlvbikge1xuICAgICAgICAgICAgICAgIGRlY2wub3ZlcnJpZGUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlY2wuZGVmaW5lKGlubGluZVJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gY3VycmVudFJ1bGVGb3JtYWxzLm1hcChmdW5jdGlvbiAoZm9ybWFsKSB7IHJldHVybiBidWlsZGVyLmFwcChmb3JtYWwpOyB9KTtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmFwcChpbmxpbmVSdWxlTmFtZSwgcGFyYW1zKS53aXRoU291cmNlKGJvZHkuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgT3ZlcnJpZGVUb3BMZXZlbFRlcm1fc3VwZXJTcGxpY2U6IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXJTcGxpY2VQbGFjZWhvbGRlcjtcbiAgICAgICAgfSxcbiAgICAgICAgU2VxOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuc2VxXG4gICAgICAgICAgICAgICAgLmFwcGx5KGJ1aWxkZXIsIGV4cHIuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pKVxuICAgICAgICAgICAgICAgIC53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgSXRlcl9zdGFyOiBmdW5jdGlvbiAoeCwgXykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuc3Rhcih4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBJdGVyX3BsdXM6IGZ1bmN0aW9uICh4LCBfKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5wbHVzKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIEl0ZXJfb3B0OiBmdW5jdGlvbiAoeCwgXykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIub3B0KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFByZWRfbm90OiBmdW5jdGlvbiAoXywgeCkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIubm90KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFByZWRfbG9va2FoZWFkOiBmdW5jdGlvbiAoXywgeCkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIubG9va2FoZWFkKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIExleF9sZXg6IGZ1bmN0aW9uIChfLCB4KSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5sZXgoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9hcHBsaWNhdGlvbjogZnVuY3Rpb24gKHJ1bGUsIHBzKSB7XG4gICAgICAgICAgICB2YXIgcGFyYW1zID0gcHMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pWzBdIHx8IFtdO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKHJ1bGUudmlzaXQoKSwgcGFyYW1zKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9yYW5nZTogZnVuY3Rpb24gKGZyb20sIF8sIHRvKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5yYW5nZShmcm9tLnZpc2l0KCksIHRvLnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX3Rlcm1pbmFsOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIudGVybWluYWwoZXhwci52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9wYXJlbjogZnVuY3Rpb24gKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4geC52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBydWxlRGVzY3I6IGZ1bmN0aW9uIChvcGVuLCB0LCBjbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHQudmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcnVsZURlc2NyVGV4dDogZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZy50cmltKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhc2VOYW1lOiBmdW5jdGlvbiAoXywgc3BhY2UxLCBuLCBzcGFjZTIsIGVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIG4udmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogZnVuY3Rpb24gKGZpcnN0LCByZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVGaXJzdDogZnVuY3Rpb24gKGV4cHIpIHsgfSxcbiAgICAgICAgbmFtZVJlc3Q6IGZ1bmN0aW9uIChleHByKSB7IH0sXG4gICAgICAgIHRlcm1pbmFsOiBmdW5jdGlvbiAob3BlbiwgY3MsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4gY3MuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pLmpvaW4oJycpO1xuICAgICAgICB9LFxuICAgICAgICBvbmVDaGFyVGVybWluYWw6IGZ1bmN0aW9uIChvcGVuLCBjLCBjbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIGMudmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgdGVybWluYWxDaGFyOiBmdW5jdGlvbiAoXykge1xuICAgICAgICAgICAgcmV0dXJuIGNvbW1vbi51bmVzY2FwZUNoYXIodGhpcy5zb3VyY2VTdHJpbmcpO1xuICAgICAgICB9LFxuICAgICAgICBlc2NhcGVDaGFyOiBmdW5jdGlvbiAoXykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICB9LFxuICAgICAgICBOb25lbXB0eUxpc3RPZjogZnVuY3Rpb24gKHgsIF8sIHhzKSB7XG4gICAgICAgICAgICByZXR1cm4gW3gudmlzaXQoKV0uY29uY2F0KHhzLmNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy52aXNpdCgpOyB9KSk7XG4gICAgICAgIH0sXG4gICAgICAgIEVtcHR5TGlzdE9mOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH0sXG4gICAgICAgIF90ZXJtaW5hbDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGhlbHBlcnMobWF0Y2gpLnZpc2l0KCk7XG59XG5mdW5jdGlvbiBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5hbWVzcGFjZSkge1xuICAgIHZhciBtID0gb2htR3JhbW1hci5tYXRjaChzb3VyY2UsICdHcmFtbWFycycpO1xuICAgIGlmIChtLmZhaWxlZCgpKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5ncmFtbWFyU3ludGF4RXJyb3IobSk7XG4gICAgfVxuICAgIHJldHVybiBidWlsZEdyYW1tYXIobSwgbmFtZXNwYWNlKTtcbn1cbi8vIFJldHVybiB0aGUgY29udGVudHMgb2YgYSBzY3JpcHQgZWxlbWVudCwgZmV0Y2hpbmcgaXQgdmlhIFhIUiBpZiBuZWNlc3NhcnkuXG5mdW5jdGlvbiBnZXRTY3JpcHRFbGVtZW50Q29udGVudHMoZWwpIHtcbiAgICBpZiAoIWlzRWxlbWVudChlbCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBET00gTm9kZSwgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKGVsKSk7XG4gICAgfVxuICAgIGlmIChlbC50eXBlICE9PSAndGV4dC9vaG0tanMnKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgYSBzY3JpcHQgdGFnIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIsIGdvdCAnICsgZWwpO1xuICAgIH1cbiAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKCdzcmMnKSA/IGxvYWQoZWwuZ2V0QXR0cmlidXRlKCdzcmMnKSkgOiBlbC5pbm5lckhUTUw7XG59XG5mdW5jdGlvbiBncmFtbWFyKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gICAgdmFyIG5zID0gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpO1xuICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBzb3VyY2UgY29udGFpbmVkIG5vIG1vcmUgdGhhbiBvbmUgZ3JhbW1hciBkZWZpbml0aW9uLlxuICAgIHZhciBncmFtbWFyTmFtZXMgPSBPYmplY3Qua2V5cyhucyk7XG4gICAgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGdyYW1tYXIgZGVmaW5pdGlvbicpO1xuICAgIH1cbiAgICBlbHNlIGlmIChncmFtbWFyTmFtZXMubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgc2Vjb25kR3JhbW1hciA9IG5zW2dyYW1tYXJOYW1lc1sxXV07XG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHNlY29uZEdyYW1tYXIuc291cmNlO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IodXRpbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZShpbnRlcnZhbC5zb3VyY2VTdHJpbmcsIGludGVydmFsLnN0YXJ0SWR4KSArXG4gICAgICAgICAgICAnRm91bmQgbW9yZSB0aGFuIG9uZSBncmFtbWFyIGRlZmluaXRpb24gLS0gdXNlIG9obS5ncmFtbWFycygpIGluc3RlYWQuJyk7XG4gICAgfVxuICAgIHJldHVybiBuc1tncmFtbWFyTmFtZXNbMF1dOyAvLyBSZXR1cm4gdGhlIG9uZSBhbmQgb25seSBncmFtbWFyLlxufVxuZnVuY3Rpb24gZ3JhbW1hcnMoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgICB2YXIgbnMgPSBOYW1lc3BhY2UuZXh0ZW5kKE5hbWVzcGFjZS5hc05hbWVzcGFjZShvcHROYW1lc3BhY2UpKTtcbiAgICBpZiAodHlwZW9mIHNvdXJjZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gRm9yIGNvbnZlbmllbmNlLCBkZXRlY3QgTm9kZS5qcyBCdWZmZXIgb2JqZWN0cyBhbmQgYXV0b21hdGljYWxseSBjYWxsIHRvU3RyaW5nKCkuXG4gICAgICAgIGlmIChpc0J1ZmZlcihzb3VyY2UpKSB7XG4gICAgICAgICAgICBzb3VyY2UgPSBzb3VyY2UudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIHN0cmluZyBhcyBmaXJzdCBhcmd1bWVudCwgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKHNvdXJjZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbnMpO1xuICAgIHJldHVybiBucztcbn1cbmZ1bmN0aW9uIGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudChvcHROb2RlKSB7XG4gICAgdmFyIG5vZGUgPSBvcHROb2RlO1xuICAgIGlmIChpc1VuZGVmaW5lZChub2RlKSkge1xuICAgICAgICB2YXIgbm9kZUxpc3QgPSBkb2N1bWVudEludGVyZmFjZS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvb2htLWpzXCJdJyk7XG4gICAgICAgIGlmIChub2RlTGlzdC5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgZXhhY3RseSBvbmUgc2NyaXB0IHRhZyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLCBmb3VuZCAnICsgbm9kZUxpc3QubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBub2RlID0gbm9kZUxpc3RbMF07XG4gICAgfVxuICAgIHJldHVybiBncmFtbWFyKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlKSk7XG59XG5mdW5jdGlvbiBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50cyhvcHROb2RlT3JOb2RlTGlzdCkge1xuICAgIC8vIFNpbXBsZSBjYXNlOiB0aGUgYXJndW1lbnQgaXMgYSBET00gbm9kZS5cbiAgICBpZiAoaXNFbGVtZW50KG9wdE5vZGVPck5vZGVMaXN0KSkge1xuICAgICAgICByZXR1cm4gZ3JhbW1hcnMob3B0Tm9kZU9yTm9kZUxpc3QpO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UsIGl0IG11c3QgYmUgZWl0aGVyIHVuZGVmaW5lZCBvciBhIE5vZGVMaXN0LlxuICAgIHZhciBub2RlTGlzdCA9IG9wdE5vZGVPck5vZGVMaXN0O1xuICAgIGlmIChpc1VuZGVmaW5lZChub2RlTGlzdCkpIHtcbiAgICAgICAgLy8gRmluZCBhbGwgc2NyaXB0IGVsZW1lbnRzIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIuXG4gICAgICAgIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2Ygbm9kZUxpc3QgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICghaXNFbGVtZW50KG5vZGVMaXN0KSAmJiAhaXNBcnJheUxpa2Uobm9kZUxpc3QpKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIE5vZGUsIE5vZGVMaXN0LCBvciBBcnJheSwgYnV0IGdvdCAnICsgbm9kZUxpc3QpO1xuICAgIH1cbiAgICB2YXIgbnMgPSBOYW1lc3BhY2UuY3JlYXRlTmFtZXNwYWNlKCk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlTGlzdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAvLyBDb3B5IHRoZSBuZXcgZ3JhbW1hcnMgaW50byBgbnNgIHRvIGtlZXAgdGhlIG5hbWVzcGFjZSBmbGF0LlxuICAgICAgICBjb21tb24uZXh0ZW5kKG5zLCBncmFtbWFycyhnZXRTY3JpcHRFbGVtZW50Q29udGVudHMobm9kZUxpc3RbaV0pLCBucykpO1xuICAgIH1cbiAgICByZXR1cm4gbnM7XG59XG5mdW5jdGlvbiBtYWtlUmVjaXBlKHJlY2lwZSkge1xuICAgIGlmICh0eXBlb2YgcmVjaXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiByZWNpcGUuY2FsbChuZXcgQnVpbGRlcigpKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmVjaXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgLy8gc3RyaW5naWZpZWQgSlNPTiByZWNpcGVcbiAgICAgICAgICAgIHJlY2lwZSA9IEpTT04ucGFyc2UocmVjaXBlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEJ1aWxkZXIoKS5mcm9tUmVjaXBlKHJlY2lwZSk7XG4gICAgfVxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVOYW1lc3BhY2U6IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UsXG4gICAgZ3JhbW1hcjogZ3JhbW1hcixcbiAgICBncmFtbWFyczogZ3JhbW1hcnMsXG4gICAgZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50OiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQsXG4gICAgZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHM6IGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzLFxuICAgIG1ha2VSZWNpcGU6IG1ha2VSZWNpcGUsXG4gICAgb2htR3JhbW1hcjogbnVsbCxcbiAgICBwZXhwcnM6IHBleHBycyxcbiAgICB1dGlsOiB1dGlsLFxuICAgIGV4dHJhczogcmVxdWlyZSgnLi4vZXh0cmFzJyksXG4gICAgdmVyc2lvbjogdmVyc2lvblxufTtcbi8vIFN0dWZmIGZvciB0ZXN0aW5nLCBldGMuXG5tb2R1bGUuZXhwb3J0cy5fYnVpbGRHcmFtbWFyID0gYnVpbGRHcmFtbWFyO1xubW9kdWxlLmV4cG9ydHMuX3NldERvY3VtZW50SW50ZXJmYWNlRm9yVGVzdGluZyA9IGZ1bmN0aW9uIChkb2MpIHtcbiAgICBkb2N1bWVudEludGVyZmFjZSA9IGRvYztcbn07XG4vLyBMYXRlIGluaXRpYWxpemF0aW9uIGZvciBzdHVmZiB0aGF0IGlzIGJvb3RzdHJhcHBlZC5cbkdyYW1tYXIuQnVpbHRJblJ1bGVzID0gcmVxdWlyZSgnLi4vZGlzdC9idWlsdC1pbi1ydWxlcycpO1xudXRpbC5hbm5vdW5jZUJ1aWx0SW5SdWxlcyhHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG5tb2R1bGUuZXhwb3J0cy5vaG1HcmFtbWFyID0gb2htR3JhbW1hciA9IHJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXInKTtcbkdyYW1tYXIuaW5pdEFwcGxpY2F0aW9uUGFyc2VyKG9obUdyYW1tYXIsIGJ1aWxkR3JhbW1hcik7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG4vLyBFbnN1cmVzIHRoYXQgdGhlIGRlcHJlY2F0aW9uIHdhcm5pbmcgZm9yIGBwcmltaXRpdmVWYWx1ZWAgb25seSBhcHBlYXJzIG9uY2UuXG52YXIgZGlkV2FybkZvclByaW1pdGl2ZVZhbHVlID0gZmFsc2U7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBOb2RlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIG1hdGNoTGVuZ3RoKSB7XG4gICAgICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgICAgIHRoaXMuY3Rvck5hbWUgPSBjdG9yTmFtZTtcbiAgICAgICAgdGhpcy5tYXRjaExlbmd0aCA9IG1hdGNoTGVuZ3RoO1xuICAgIH1cbiAgICBOb2RlLnByb3RvdHlwZS5udW1DaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4gPyB0aGlzLmNoaWxkcmVuLmxlbmd0aCA6IDA7XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5jaGlsZEF0ID0gZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICBpZiAodGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baWR4XTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuaW5kZXhPZkNoaWxkID0gZnVuY3Rpb24gKGFyZykge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGFyZyk7XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5oYXNDaGlsZHJlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubnVtQ2hpbGRyZW4oKSA+IDA7XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5oYXNOb0NoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuaGFzQ2hpbGRyZW4oKTtcbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLm9ubHlDaGlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMubnVtQ2hpbGRyZW4oKSAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IG9ubHkgY2hpbGQgb2YgYSBub2RlIG9mIHR5cGUgJyArXG4gICAgICAgICAgICAgICAgdGhpcy5jdG9yTmFtZSArXG4gICAgICAgICAgICAgICAgJyAoaXQgaGFzICcgK1xuICAgICAgICAgICAgICAgIHRoaXMubnVtQ2hpbGRyZW4oKSArXG4gICAgICAgICAgICAgICAgJyBjaGlsZHJlbiknKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpcnN0Q2hpbGQoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuZmlyc3RDaGlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgZmlyc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KDApO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5sYXN0Q2hpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGxhc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KHRoaXMubnVtQ2hpbGRyZW4oKSAtIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5jaGlsZEJlZm9yZSA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEJlZm9yZSgpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGRJZHggPT09IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBiZWZvcmUgZmlyc3QgY2hpbGQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggLSAxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuY2hpbGRBZnRlciA9IGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gICAgICAgIGlmIChjaGlsZElkeCA8IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm9kZS5jaGlsZEFmdGVyKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaGlsZElkeCA9PT0gdGhpcy5udW1DaGlsZHJlbigpIC0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGFmdGVyIGxhc3QgY2hpbGQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkQXQoY2hpbGRJZHggKyAxKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuaXNJdGVyYXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX2EgPSB7fSwgX2FbdGhpcy5jdG9yTmFtZV0gPSB0aGlzLmNoaWxkcmVuLCBfYTtcbiAgICB9O1xuICAgIHJldHVybiBOb2RlO1xufSgpKTtcbi8vIFRlcm1pbmFsc1xudmFyIFRlcm1pbmFsTm9kZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVGVybWluYWxOb2RlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRlcm1pbmFsTm9kZShncmFtbWFyLCB2YWx1ZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgbWF0Y2hMZW5ndGggPSB2YWx1ZSA/IHZhbHVlLmxlbmd0aCA6IDA7XG4gICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZ3JhbW1hciwgJ190ZXJtaW5hbCcsIG1hdGNoTGVuZ3RoKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBUZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgVGVybWluYWxOb2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuIF9hID0ge30sIF9hW3RoaXMuY3Rvck5hbWVdID0gdGhpcy5fdmFsdWUsIF9hO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRlcm1pbmFsTm9kZS5wcm90b3R5cGUsIFwicHJpbWl0aXZlVmFsdWVcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghZGlkV2FybkZvclByaW1pdGl2ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHByaW1pdGl2ZVZhbHVlIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBhIGZ1dHVyZSB2ZXJzaW9uIG9mIE9obS4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2Ugc291cmNlU3RyaW5nIGluc3RlYWQuJyk7XG4gICAgICAgICAgICAgICAgZGlkV2FybkZvclByaW1pdGl2ZVZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBUZXJtaW5hbE5vZGU7XG59KE5vZGUpKTtcbi8vIE5vbnRlcm1pbmFsc1xudmFyIE5vbnRlcm1pbmFsTm9kZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTm9udGVybWluYWxOb2RlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE5vbnRlcm1pbmFsTm9kZShncmFtbWFyLCBydWxlTmFtZSwgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZ3JhbW1hciwgcnVsZU5hbWUsIG1hdGNoTGVuZ3RoKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICBfdGhpcy5jaGlsZE9mZnNldHMgPSBjaGlsZE9mZnNldHM7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIE5vbnRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNMZXhpY2FsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY29tbW9uLmlzTGV4aWNhbCh0aGlzLmN0b3JOYW1lKTtcbiAgICB9O1xuICAgIE5vbnRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNTeW50YWN0aWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5jdG9yTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gTm9udGVybWluYWxOb2RlO1xufShOb2RlKSk7XG4vLyBJdGVyYXRpb25zXG52YXIgSXRlcmF0aW9uTm9kZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSXRlcmF0aW9uTm9kZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJdGVyYXRpb25Ob2RlKGdyYW1tYXIsIGNoaWxkcmVuLCBjaGlsZE9mZnNldHMsIG1hdGNoTGVuZ3RoLCBpc09wdGlvbmFsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGdyYW1tYXIsICdfaXRlcicsIG1hdGNoTGVuZ3RoKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgICBfdGhpcy5jaGlsZE9mZnNldHMgPSBjaGlsZE9mZnNldHM7XG4gICAgICAgIF90aGlzLm9wdGlvbmFsID0gaXNPcHRpb25hbDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBJdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBJdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25hbDtcbiAgICB9O1xuICAgIHJldHVybiBJdGVyYXRpb25Ob2RlO1xufShOb2RlKSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIE5vZGU6IE5vZGUsXG4gICAgVGVybWluYWxOb2RlOiBUZXJtaW5hbE5vZGUsXG4gICAgTm9udGVybWluYWxOb2RlOiBOb250ZXJtaW5hbE5vZGUsXG4gICAgSXRlcmF0aW9uTm9kZTogSXRlcmF0aW9uTm9kZVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgUmV0dXJuIHRydWUgaWYgd2Ugc2hvdWxkIHNraXAgc3BhY2VzIHByZWNlZGluZyB0aGlzIGV4cHJlc3Npb24gaW4gYSBzeW50YWN0aWMgY29udGV4dC5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPSBjb21tb24uYWJzdHJhY3QoJ2FsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnKTtcbi8qXG4gIEdlbmVyYWxseSwgdGhlc2UgYXJlIGFsbCBmaXJzdC1vcmRlciBleHByZXNzaW9ucyBhbmQgKHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBBcHBseSlcbiAgZGlyZWN0bHkgcmVhZCBmcm9tIHRoZSBpbnB1dCBzdHJlYW0uXG4qL1xucGV4cHJzLmFueS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICBwZXhwcnMuZW5kLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICBwZXhwcnMuQXBwbHkucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbi8qXG4gIEhpZ2hlci1vcmRlciBleHByZXNzaW9ucyB0aGF0IGRvbid0IGRpcmVjdGx5IGNvbnN1bWUgaW5wdXQuXG4qL1xucGV4cHJzLkFsdC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgcGV4cHJzLkl0ZXIucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICAgICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlNlcS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBCdWlsdEluUnVsZXM7XG51dGlsLmF3YWl0QnVpbHRJblJ1bGVzKGZ1bmN0aW9uIChnKSB7XG4gICAgQnVpbHRJblJ1bGVzID0gZztcbn0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgbGV4aWZ5Q291bnQ7XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gICAgbGV4aWZ5Q291bnQgPSAwO1xuICAgIHRoaXMuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbn07XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGNvbW1vbi5hYnN0cmFjdCgnX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5wZXhwcnMuYW55Ll9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgcGV4cHJzLmVuZC5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBuby1vcFxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5MZXgucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGxleGlmeUNvdW50Kys7XG4gICAgdGhpcy5leHByLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgbGV4aWZ5Q291bnQtLTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdGhpcy50ZXJtc1tpZHhdLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgfVxufTtcbnBleHBycy5TZXEucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgfVxufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgIHBleHBycy5Ob3QucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cHIuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHJ1bGVJbmZvID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXTtcbiAgICAvLyBNYWtlIHN1cmUgdGhhdCB0aGUgcnVsZSBleGlzdHMuLi5cbiAgICBpZiAoIXJ1bGVJbmZvKSB7XG4gICAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkUnVsZSh0aGlzLnJ1bGVOYW1lLCBncmFtbWFyLm5hbWUsIHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBpcyBhbGxvd2VkXG4gICAgaWYgKGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKSAmJlxuICAgICAgICAoIWNvbW1vbi5pc1N5bnRhY3RpYyhydWxlTmFtZSkgfHwgbGV4aWZ5Q291bnQgPiAwKSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQodGhpcy5ydWxlTmFtZSwgdGhpcyk7XG4gICAgfVxuICAgIC8vIC4uLmFuZCB0aGF0IHRoaXMgYXBwbGljYXRpb24gaGFzIHRoZSBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHNcbiAgICB2YXIgYWN0dWFsID0gdGhpcy5hcmdzLmxlbmd0aDtcbiAgICB2YXIgZXhwZWN0ZWQgPSBydWxlSW5mby5mb3JtYWxzLmxlbmd0aDtcbiAgICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgICAgICB0aHJvdyBlcnJvcnMud3JvbmdOdW1iZXJPZkFyZ3VtZW50cyh0aGlzLnJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCB0aGlzLnNvdXJjZSk7XG4gICAgfVxuICAgIC8vIC4uLmFuZCB0aGF0IGFsbCBvZiB0aGUgYXJndW1lbnQgZXhwcmVzc2lvbnMgb25seSBoYXZlIHZhbGlkIGFwcGxpY2F0aW9ucyBhbmQgaGF2ZSBhcml0eSAxLlxuICAgIHRoaXMuYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgYXJnLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgICAgIGlmIChhcmcuZ2V0QXJpdHkoKSAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmludmFsaWRQYXJhbWV0ZXIoX3RoaXMucnVsZU5hbWUsIGFyZyk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBFeHRyYSBjaGVja3MgZm9yIFwic3BlY2lhbFwiIGFwcGxpY2F0aW9uc1xuICAgIC8vIElmIGl0J3MgYW4gYXBwbGljYXRpb24gb2YgJ2Nhc2VJbnNlbnNpdGl2ZScsIGVuc3VyZSB0aGF0IHRoZSBhcmd1bWVudCBpcyBhIFRlcm1pbmFsLlxuICAgIGlmIChCdWlsdEluUnVsZXMgJiYgcnVsZUluZm8gPT09IEJ1aWx0SW5SdWxlcy5ydWxlcy5jYXNlSW5zZW5zaXRpdmUpIHtcbiAgICAgICAgaWYgKCEodGhpcy5hcmdzWzBdIGluc3RhbmNlb2YgcGV4cHJzLlRlcm1pbmFsKSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmluY29ycmVjdEFyZ3VtZW50VHlwZSgnYSBUZXJtaW5hbCAoZS5nLiBcImFiY1wiKScsIHRoaXMuYXJnc1swXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBjb21tb24uYWJzdHJhY3QoJ2Fzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5Jyk7XG5wZXhwcnMuYW55LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICBwZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vLW9wXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BbHQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgaWYgKHRoaXMudGVybXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgdGVybSA9IHRoaXMudGVybXNbaWR4XTtcbiAgICAgICAgdGVybS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSgpO1xuICAgICAgICB2YXIgb3RoZXJBcml0eSA9IHRlcm0uZ2V0QXJpdHkoKTtcbiAgICAgICAgaWYgKGFyaXR5ICE9PSBvdGhlckFyaXR5KSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGFyaXR5LCBvdGhlckFyaXR5LCB0ZXJtKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5wZXhwcnMuRXh0ZW5kLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIC8vIEV4dGVuZCBpcyBhIHNwZWNpYWwgY2FzZSBvZiBBbHQgdGhhdCdzIGd1YXJhbnRlZWQgdG8gaGF2ZSBleGFjdGx5IHR3b1xuICAgIC8vIGNhc2VzOiBbZXh0ZW5zaW9ucywgb3JpZ0JvZHldLlxuICAgIHZhciBhY3R1YWxBcml0eSA9IHRoaXMudGVybXNbMF0uZ2V0QXJpdHkoKTtcbiAgICB2YXIgZXhwZWN0ZWRBcml0eSA9IHRoaXMudGVybXNbMV0uZ2V0QXJpdHkoKTtcbiAgICBpZiAoYWN0dWFsQXJpdHkgIT09IGV4cGVjdGVkQXJpdHkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBleHBlY3RlZEFyaXR5LCBhY3R1YWxBcml0eSwgdGhpcy50ZXJtc1swXSk7XG4gICAgfVxufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdGhpcy5mYWN0b3JzW2lkeF0uYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICAgIH1cbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcbnBleHBycy5Ob3QucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgLy8gbm8tb3AgKG5vdCByZXF1aXJlZCBiL2MgdGhlIG5lc3RlZCBleHByIGRvZXNuJ3Qgc2hvdyB1cCBpbiB0aGUgQ1NUKVxufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5leHByLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KHJ1bGVOYW1lKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgLy8gVGhlIGFyaXRpZXMgb2YgdGhlIHBhcmFtZXRlciBleHByZXNzaW9ucyBpcyByZXF1aXJlZCB0byBiZSAxIGJ5XG4gICAgLy8gYGFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKClgLlxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdCgnYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJyk7XG5wZXhwcnMuYW55LmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgcGV4cHJzLmVuZC5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vLW9wXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdGhpcy50ZXJtc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICB9XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hcik7XG4gICAgfVxufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIC8vIE5vdGU6IHRoaXMgaXMgdGhlIGltcGxlbWVudGF0aW9uIG9mIHRoaXMgbWV0aG9kIGZvciBgU3RhcmAgYW5kIGBQbHVzYCBleHByZXNzaW9ucy5cbiAgICAvLyBJdCBpcyBvdmVycmlkZGVuIGZvciBgT3B0YCBiZWxvdy5cbiAgICB0aGlzLmV4cHIuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgIGlmICh0aGlzLmV4cHIuaXNOdWxsYWJsZShncmFtbWFyKSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMua2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZCh0aGlzLCBbXSk7XG4gICAgfVxufTtcbnBleHBycy5PcHQucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5MZXgucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5leHByLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHRoaXMuYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgYXJnLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgbm9kZXMgPSByZXF1aXJlKCcuL25vZGVzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciBUZXJtaW5hbE5vZGUgPSBub2Rlcy5UZXJtaW5hbE5vZGU7XG52YXIgTm9udGVybWluYWxOb2RlID0gbm9kZXMuTm9udGVybWluYWxOb2RlO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSBub2Rlcy5JdGVyYXRpb25Ob2RlO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBFdmFsdWF0ZSB0aGUgZXhwcmVzc2lvbiBhbmQgcmV0dXJuIGB0cnVlYCBpZiBpdCBzdWNjZWVkcywgYGZhbHNlYCBvdGhlcndpc2UuIFRoaXMgbWV0aG9kIHNob3VsZFxuICBvbmx5IGJlIGNhbGxlZCBkaXJlY3RseSBieSBgU3RhdGUucHJvdG90eXBlLmV2YWwoZXhwcilgLCB3aGljaCBhbHNvIHVwZGF0ZXMgdGhlIGRhdGEgc3RydWN0dXJlc1xuICB0aGF0IGFyZSB1c2VkIGZvciB0cmFjaW5nLiAoTWFraW5nIHRob3NlIHVwZGF0ZXMgaW4gYSBtZXRob2Qgb2YgYFN0YXRlYCBlbmFibGVzIHRoZSB0cmFjZS1zcGVjaWZpY1xuICBkYXRhIHN0cnVjdHVyZXMgdG8gYmUgXCJzZWNyZXRzXCIgb2YgdGhhdCBjbGFzcywgd2hpY2ggaXMgZ29vZCBmb3IgbW9kdWxhcml0eS4pXG5cbiAgVGhlIGNvbnRyYWN0IG9mIHRoaXMgbWV0aG9kIGlzIGFzIGZvbGxvd3M6XG4gICogV2hlbiB0aGUgcmV0dXJuIHZhbHVlIGlzIGB0cnVlYCxcbiAgICAtIHRoZSBzdGF0ZSBvYmplY3Qgd2lsbCBoYXZlIGBleHByLmdldEFyaXR5KClgIG1vcmUgYmluZGluZ3MgdGhhbiBpdCBkaWQgYmVmb3JlIHRoZSBjYWxsLlxuICAqIFdoZW4gdGhlIHJldHVybiB2YWx1ZSBpcyBgZmFsc2VgLFxuICAgIC0gdGhlIHN0YXRlIG9iamVjdCBtYXkgaGF2ZSBtb3JlIGJpbmRpbmdzIHRoYW4gaXQgZGlkIGJlZm9yZSB0aGUgY2FsbCwgYW5kXG4gICAgLSBpdHMgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gbWF5IGJlIGFueXdoZXJlLlxuXG4gIE5vdGUgdGhhdCBgU3RhdGUucHJvdG90eXBlLmV2YWwoZXhwcilgLCB1bmxpa2UgdGhpcyBtZXRob2QsIGd1YXJhbnRlZXMgdGhhdCBuZWl0aGVyIHRoZSBzdGF0ZVxuICBvYmplY3QncyBiaW5kaW5ncyBub3IgaXRzIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIHdpbGwgY2hhbmdlIGlmIHRoZSBleHByZXNzaW9uIGZhaWxzIHRvIG1hdGNoLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZXZhbCA9IGNvbW1vbi5hYnN0cmFjdCgnZXZhbCcpOyAvLyBmdW5jdGlvbihzdGF0ZSkgeyAuLi4gfVxucGV4cHJzLmFueS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICAgIGlmIChjaCkge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xucGV4cHJzLmVuZC5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgaWYgKGlucHV0U3RyZWFtLmF0RW5kKCkpIHtcbiAgICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB1bmRlZmluZWQpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoIWlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKHRoaXMub2JqKSkge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLm9iaiksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICAgIGlmIChjaCAmJiB0aGlzLmZyb20gPD0gY2ggJiYgY2ggPD0gdGhpcy50bykge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgcmV0dXJuIHN0YXRlLmV2YWwoc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLmluZGV4XSk7XG59O1xucGV4cHJzLkxleC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHN0YXRlLmVudGVyTGV4aWZpZWRDb250ZXh0KCk7XG4gICAgdmFyIGFucyA9IHN0YXRlLmV2YWwodGhpcy5leHByKTtcbiAgICBzdGF0ZS5leGl0TGV4aWZpZWRDb250ZXh0KCk7XG4gICAgcmV0dXJuIGFucztcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGlmIChzdGF0ZS5ldmFsKHRoaXMudGVybXNbaWR4XSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIGZhY3RvciA9IHRoaXMuZmFjdG9yc1tpZHhdO1xuICAgICAgICBpZiAoIXN0YXRlLmV2YWwoZmFjdG9yKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIGFyaXR5ID0gdGhpcy5nZXRBcml0eSgpO1xuICAgIHZhciBjb2xzID0gW107XG4gICAgdmFyIGNvbE9mZnNldHMgPSBbXTtcbiAgICB3aGlsZSAoY29scy5sZW5ndGggPCBhcml0eSkge1xuICAgICAgICBjb2xzLnB1c2goW10pO1xuICAgICAgICBjb2xPZmZzZXRzLnB1c2goW10pO1xuICAgIH1cbiAgICB2YXIgbnVtTWF0Y2hlcyA9IDA7XG4gICAgdmFyIHByZXZQb3MgPSBvcmlnUG9zO1xuICAgIHZhciBpZHg7XG4gICAgd2hpbGUgKG51bU1hdGNoZXMgPCB0aGlzLm1heE51bU1hdGNoZXMgJiYgc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgICAgIGlmIChpbnB1dFN0cmVhbS5wb3MgPT09IHByZXZQb3MpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5rbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKHRoaXMsIHN0YXRlLl9hcHBsaWNhdGlvblN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgICBwcmV2UG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgICBudW1NYXRjaGVzKys7XG4gICAgICAgIHZhciByb3cgPSBzdGF0ZS5fYmluZGluZ3Muc3BsaWNlKHN0YXRlLl9iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgICAgICB2YXIgcm93T2Zmc2V0cyA9IHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdPZmZzZXRzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcm93Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIGNvbHNbaWR4XS5wdXNoKHJvd1tpZHhdKTtcbiAgICAgICAgICAgIGNvbE9mZnNldHNbaWR4XS5wdXNoKHJvd09mZnNldHNbaWR4XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG51bU1hdGNoZXMgPCB0aGlzLm1pbk51bU1hdGNoZXMpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgb2Zmc2V0ID0gc3RhdGUucG9zVG9PZmZzZXQob3JpZ1Bvcyk7XG4gICAgdmFyIG1hdGNoTGVuZ3RoID0gMDtcbiAgICBpZiAobnVtTWF0Y2hlcyA+IDApIHtcbiAgICAgICAgdmFyIGxhc3RDb2wgPSBjb2xzW2FyaXR5IC0gMV07XG4gICAgICAgIHZhciBsYXN0Q29sT2Zmc2V0cyA9IGNvbE9mZnNldHNbYXJpdHkgLSAxXTtcbiAgICAgICAgdmFyIGVuZE9mZnNldCA9IGxhc3RDb2xPZmZzZXRzW2xhc3RDb2xPZmZzZXRzLmxlbmd0aCAtIDFdICsgbGFzdENvbFtsYXN0Q29sLmxlbmd0aCAtIDFdLm1hdGNoTGVuZ3RoO1xuICAgICAgICBvZmZzZXQgPSBjb2xPZmZzZXRzWzBdWzBdO1xuICAgICAgICBtYXRjaExlbmd0aCA9IGVuZE9mZnNldCAtIG9mZnNldDtcbiAgICB9XG4gICAgdmFyIGlzT3B0aW9uYWwgPSB0aGlzIGluc3RhbmNlb2YgcGV4cHJzLk9wdDtcbiAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IGNvbHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBzdGF0ZS5fYmluZGluZ3MucHVzaChuZXcgSXRlcmF0aW9uTm9kZShzdGF0ZS5ncmFtbWFyLCBjb2xzW2lkeF0sIGNvbE9mZnNldHNbaWR4XSwgbWF0Y2hMZW5ndGgsIGlzT3B0aW9uYWwpKTtcbiAgICAgICAgc3RhdGUuX2JpbmRpbmdPZmZzZXRzLnB1c2gob2Zmc2V0KTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIC8qXG4gICAgICBUT0RPOlxuICAgICAgLSBSaWdodCBub3cgd2UncmUganVzdCB0aHJvd2luZyBhd2F5IGFsbCBvZiB0aGUgZmFpbHVyZXMgdGhhdCBoYXBwZW4gaW5zaWRlIGEgYG5vdGAsIGFuZFxuICAgICAgICByZWNvcmRpbmcgYHRoaXNgIGFzIGEgZmFpbGVkIGV4cHJlc3Npb24uXG4gICAgICAtIERvdWJsZSBuZWdhdGlvbiBzaG91bGQgYmUgZXF1aXZhbGVudCB0byBsb29rYWhlYWQsIGJ1dCB0aGF0J3Mgbm90IHRoZSBjYXNlIHJpZ2h0IG5vdyB3cnRcbiAgICAgICAgZmFpbHVyZXMuIEUuZy4sIH5+J2ZvbycgcHJvZHVjZXMgYSBmYWlsdXJlIGZvciB+fidmb28nLCBidXQgbWF5YmUgaXQgc2hvdWxkIHByb2R1Y2VcbiAgICAgICAgYSBmYWlsdXJlIGZvciAnZm9vJyBpbnN0ZWFkLlxuICAgICovXG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgc3RhdGUucHVzaEZhaWx1cmVzSW5mbygpO1xuICAgIHZhciBhbnMgPSBzdGF0ZS5ldmFsKHRoaXMuZXhwcik7XG4gICAgc3RhdGUucG9wRmFpbHVyZXNJbmZvKCk7XG4gICAgaWYgKGFucykge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgIHJldHVybiB0cnVlO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoc3RhdGUuZXZhbCh0aGlzLmV4cHIpKSB7XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgY2FsbGVyID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgdmFyIGFjdHVhbHMgPSBjYWxsZXIgPyBjYWxsZXIuYXJncyA6IFtdO1xuICAgIHZhciBhcHAgPSB0aGlzLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG4gICAgdmFyIHBvc0luZm8gPSBzdGF0ZS5nZXRDdXJyZW50UG9zSW5mbygpO1xuICAgIGlmIChwb3NJbmZvLmlzQWN0aXZlKGFwcCkpIHtcbiAgICAgICAgLy8gVGhpcyBydWxlIGlzIGFscmVhZHkgYWN0aXZlIGF0IHRoaXMgcG9zaXRpb24sIGkuZS4sIGl0IGlzIGxlZnQtcmVjdXJzaXZlLlxuICAgICAgICByZXR1cm4gYXBwLmhhbmRsZUN5Y2xlKHN0YXRlKTtcbiAgICB9XG4gICAgdmFyIG1lbW9LZXkgPSBhcHAudG9NZW1vS2V5KCk7XG4gICAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gICAgaWYgKG1lbW9SZWMgJiYgcG9zSW5mby5zaG91bGRVc2VNZW1vaXplZFJlc3VsdChtZW1vUmVjKSkge1xuICAgICAgICBpZiAoc3RhdGUuaGFzTmVjZXNzYXJ5SW5mbyhtZW1vUmVjKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLnVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLmlucHV0U3RyZWFtLnBvcywgbWVtb1JlYyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIGFwcC5yZWFsbHlFdmFsKHN0YXRlKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmhhbmRsZUN5Y2xlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIHBvc0luZm8gPSBzdGF0ZS5nZXRDdXJyZW50UG9zSW5mbygpO1xuICAgIHZhciBjdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHBvc0luZm8uY3VycmVudExlZnRSZWN1cnNpb247XG4gICAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICAgIHZhciBtZW1vUmVjID0gcG9zSW5mby5tZW1vW21lbW9LZXldO1xuICAgIGlmIChjdXJyZW50TGVmdFJlY3Vyc2lvbiAmJiBjdXJyZW50TGVmdFJlY3Vyc2lvbi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXkpIHtcbiAgICAgICAgLy8gV2UgYWxyZWFkeSBrbm93IGFib3V0IHRoaXMgbGVmdCByZWN1cnNpb24sIGJ1dCBpdCdzIHBvc3NpYmxlIHRoZXJlIGFyZSBcImludm9sdmVkXG4gICAgICAgIC8vIGFwcGxpY2F0aW9uc1wiIHRoYXQgd2UgZG9uJ3QgYWxyZWFkeSBrbm93IGFib3V0LCBzby4uLlxuICAgICAgICBtZW1vUmVjLnVwZGF0ZUludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cygpO1xuICAgIH1cbiAgICBlbHNlIGlmICghbWVtb1JlYykge1xuICAgICAgICAvLyBOZXcgbGVmdCByZWN1cnNpb24gZGV0ZWN0ZWQhIE1lbW9pemUgYSBmYWlsdXJlIHRvIHRyeSB0byBnZXQgYSBzZWVkIHBhcnNlLlxuICAgICAgICBtZW1vUmVjID0gcG9zSW5mby5tZW1vaXplKG1lbW9LZXksIHtcbiAgICAgICAgICAgIG1hdGNoTGVuZ3RoOiAwLFxuICAgICAgICAgICAgZXhhbWluZWRMZW5ndGg6IDAsXG4gICAgICAgICAgICB2YWx1ZTogZmFsc2UsXG4gICAgICAgICAgICByaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiAtMVxuICAgICAgICB9KTtcbiAgICAgICAgcG9zSW5mby5zdGFydExlZnRSZWN1cnNpb24odGhpcywgbWVtb1JlYyk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZS51c2VNZW1vaXplZFJlc3VsdChzdGF0ZS5pbnB1dFN0cmVhbS5wb3MsIG1lbW9SZWMpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUucmVhbGx5RXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIHZhciBvcmlnUG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgdmFyIHJ1bGVJbmZvID0gc3RhdGUuZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXTtcbiAgICB2YXIgYm9keSA9IHJ1bGVJbmZvLmJvZHk7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gcnVsZUluZm8uZGVzY3JpcHRpb247XG4gICAgc3RhdGUuZW50ZXJBcHBsaWNhdGlvbihvcmlnUG9zSW5mbywgdGhpcyk7XG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN0YXRlLnB1c2hGYWlsdXJlc0luZm8oKTtcbiAgICB9XG4gICAgLy8gUmVzZXQgdGhlIGlucHV0IHN0cmVhbSdzIGV4YW1pbmVkTGVuZ3RoIHByb3BlcnR5IHNvIHRoYXQgd2UgY2FuIHRyYWNrXG4gICAgLy8gdGhlIGV4YW1pbmVkIGxlbmd0aCBvZiB0aGlzIHBhcnRpY3VsYXIgYXBwbGljYXRpb24uXG4gICAgdmFyIG9yaWdJbnB1dFN0cmVhbUV4YW1pbmVkTGVuZ3RoID0gaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGg7XG4gICAgaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPSAwO1xuICAgIHZhciB2YWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgc3RhdGUpO1xuICAgIHZhciBjdXJyZW50TFIgPSBvcmlnUG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICB2YXIgbWVtb0tleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgdmFyIGlzSGVhZE9mTGVmdFJlY3Vyc2lvbiA9IGN1cnJlbnRMUiAmJiBjdXJyZW50TFIuaGVhZEFwcGxpY2F0aW9uLnRvTWVtb0tleSgpID09PSBtZW1vS2V5O1xuICAgIHZhciBtZW1vUmVjO1xuICAgIGlmIChpc0hlYWRPZkxlZnRSZWN1cnNpb24pIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmdyb3dTZWVkUmVzdWx0KGJvZHksIHN0YXRlLCBvcmlnUG9zLCBjdXJyZW50TFIsIHZhbHVlKTtcbiAgICAgICAgb3JpZ1Bvc0luZm8uZW5kTGVmdFJlY3Vyc2lvbigpO1xuICAgICAgICBtZW1vUmVjID0gY3VycmVudExSO1xuICAgICAgICBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoID0gaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggLSBvcmlnUG9zO1xuICAgICAgICBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPSBzdGF0ZS5fZ2V0UmlnaHRtb3N0RmFpbHVyZU9mZnNldCgpO1xuICAgICAgICBvcmlnUG9zSW5mby5tZW1vaXplKG1lbW9LZXksIG1lbW9SZWMpOyAvLyB1cGRhdGVzIG9yaWdQb3NJbmZvJ3MgbWF4RXhhbWluZWRMZW5ndGhcbiAgICB9XG4gICAgZWxzZSBpZiAoIWN1cnJlbnRMUiB8fCAhY3VycmVudExSLmlzSW52b2x2ZWQobWVtb0tleSkpIHtcbiAgICAgICAgLy8gVGhpcyBhcHBsaWNhdGlvbiBpcyBub3QgaW52b2x2ZWQgaW4gbGVmdCByZWN1cnNpb24sIHNvIGl0J3Mgb2sgdG8gbWVtb2l6ZSBpdC5cbiAgICAgICAgbWVtb1JlYyA9IG9yaWdQb3NJbmZvLm1lbW9pemUobWVtb0tleSwge1xuICAgICAgICAgICAgbWF0Y2hMZW5ndGg6IGlucHV0U3RyZWFtLnBvcyAtIG9yaWdQb3MsXG4gICAgICAgICAgICBleGFtaW5lZExlbmd0aDogaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggLSBvcmlnUG9zLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uOiBzdGF0ZS5jbG9uZVJlY29yZGVkRmFpbHVyZXMoKSxcbiAgICAgICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ6IHN0YXRlLl9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0KClcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBzdWNjZWVkZWQgPSAhIXZhbHVlO1xuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICBzdGF0ZS5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICAgICAgaWYgKCFzdWNjZWVkZWQpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZW1vUmVjKSB7XG4gICAgICAgICAgICBtZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbiA9IHN0YXRlLmNsb25lUmVjb3JkZWRGYWlsdXJlcygpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFJlY29yZCB0cmFjZSBpbmZvcm1hdGlvbiBpbiB0aGUgbWVtbyB0YWJsZSwgc28gdGhhdCBpdCBpcyBhdmFpbGFibGUgaWYgdGhlIG1lbW9pemVkIHJlc3VsdFxuICAgIC8vIGlzIHVzZWQgbGF0ZXIuXG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpICYmIG1lbW9SZWMpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gc3RhdGUuZ2V0VHJhY2VFbnRyeShvcmlnUG9zLCB0aGlzLCBzdWNjZWVkZWQsIHN1Y2NlZWRlZCA/IFt2YWx1ZV0gOiBbXSk7XG4gICAgICAgIGlmIChpc0hlYWRPZkxlZnRSZWN1cnNpb24pIHtcbiAgICAgICAgICAgIGNvbW1vbi5hc3NlcnQoZW50cnkudGVybWluYXRpbmdMUkVudHJ5ICE9IG51bGwgfHwgIXN1Y2NlZWRlZCk7XG4gICAgICAgICAgICBlbnRyeS5pc0hlYWRPZkxlZnRSZWN1cnNpb24gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG1lbW9SZWMudHJhY2VFbnRyeSA9IGVudHJ5O1xuICAgIH1cbiAgICAvLyBGaXggdGhlIGlucHV0IHN0cmVhbSdzIGV4YW1pbmVkTGVuZ3RoIC0tIGl0IHNob3VsZCBiZSB0aGUgbWF4aW11bSBleGFtaW5lZCBsZW5ndGhcbiAgICAvLyBhY3Jvc3MgYWxsIGFwcGxpY2F0aW9ucywgbm90IGp1c3QgdGhpcyBvbmUuXG4gICAgaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heChpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCwgb3JpZ0lucHV0U3RyZWFtRXhhbWluZWRMZW5ndGgpO1xuICAgIHN0YXRlLmV4aXRBcHBsaWNhdGlvbihvcmlnUG9zSW5mbywgdmFsdWUpO1xuICAgIHJldHVybiBzdWNjZWVkZWQ7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ldmFsT25jZSA9IGZ1bmN0aW9uIChleHByLCBzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmIChzdGF0ZS5ldmFsKGV4cHIpKSB7XG4gICAgICAgIHZhciBhcml0eSA9IGV4cHIuZ2V0QXJpdHkoKTtcbiAgICAgICAgdmFyIGJpbmRpbmdzID0gc3RhdGUuX2JpbmRpbmdzLnNwbGljZShzdGF0ZS5fYmluZGluZ3MubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICAgICAgdmFyIG9mZnNldHMgPSBzdGF0ZS5fYmluZGluZ09mZnNldHMuc3BsaWNlKHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgICAgICByZXR1cm4gbmV3IE5vbnRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCB0aGlzLnJ1bGVOYW1lLCBiaW5kaW5ncywgb2Zmc2V0cywgaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1Bvcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ3Jvd1NlZWRSZXN1bHQgPSBmdW5jdGlvbiAoYm9keSwgc3RhdGUsIG9yaWdQb3MsIGxyTWVtb1JlYywgbmV3VmFsdWUpIHtcbiAgICBpZiAoIW5ld1ZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgbHJNZW1vUmVjLm1hdGNoTGVuZ3RoID0gaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcztcbiAgICAgICAgbHJNZW1vUmVjLnZhbHVlID0gbmV3VmFsdWU7XG4gICAgICAgIGxyTWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24gPSBzdGF0ZS5jbG9uZVJlY29yZGVkRmFpbHVyZXMoKTtcbiAgICAgICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICAgICAgICAvLyBCZWZvcmUgZXZhbHVhdGluZyB0aGUgYm9keSBhZ2FpbiwgYWRkIGEgdHJhY2Ugbm9kZSBmb3IgdGhpcyBhcHBsaWNhdGlvbiB0byB0aGUgbWVtbyBlbnRyeS5cbiAgICAgICAgICAgIC8vIEl0cyBvbmx5IGNoaWxkIGlzIGEgY29weSBvZiB0aGUgdHJhY2Ugbm9kZSBmcm9tIGBuZXdWYWx1ZWAsIHdoaWNoIHdpbGwgYWx3YXlzIGJlIHRoZSBsYXN0XG4gICAgICAgICAgICAvLyBlbGVtZW50IGluIGBzdGF0ZS50cmFjZWAuXG4gICAgICAgICAgICB2YXIgc2VlZFRyYWNlID0gc3RhdGUudHJhY2Vbc3RhdGUudHJhY2UubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBsck1lbW9SZWMudHJhY2VFbnRyeSA9IG5ldyBUcmFjZShzdGF0ZS5pbnB1dCwgb3JpZ1BvcywgaW5wdXRTdHJlYW0ucG9zLCB0aGlzLCB0cnVlLCBbbmV3VmFsdWVdLCBbc2VlZFRyYWNlLmNsb25lKCldKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuZXZhbE9uY2UoYm9keSwgc3RhdGUpO1xuICAgICAgICBpZiAoaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcyA8PSBsck1lbW9SZWMubWF0Y2hMZW5ndGgpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgICAgICAgICAgc3RhdGUudHJhY2Uuc3BsaWNlKC0yLCAxKTsgLy8gRHJvcCB0aGUgdHJhY2UgZm9yIHRoZSBvbGQgc2VlZC5cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgICAgLy8gVGhlIGxhc3QgZW50cnkgaXMgZm9yIGFuIHVudXNlZCByZXN1bHQgLS0gcG9wIGl0IGFuZCBzYXZlIGl0IGluIHRoZSBcInJlYWxcIiBlbnRyeS5cbiAgICAgICAgbHJNZW1vUmVjLnRyYWNlRW50cnkucmVjb3JkTFJUZXJtaW5hdGlvbihzdGF0ZS50cmFjZS5wb3AoKSwgbmV3VmFsdWUpO1xuICAgIH1cbiAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zICsgbHJNZW1vUmVjLm1hdGNoTGVuZ3RoO1xuICAgIHJldHVybiBsck1lbW9SZWMudmFsdWU7XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIGNoID0gaW5wdXRTdHJlYW0ubmV4dCgpO1xuICAgIGlmIChjaCAmJiB0aGlzLnBhdHRlcm4udGVzdChjaCkpIHtcbiAgICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBjaCksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBIZWxwZXJzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZmxhdHRlbihsaXN0T2ZMaXN0cykge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuY29uY2F0LmFwcGx5KFtdLCBsaXN0T2ZMaXN0cyk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gY29tbW9uLmFic3RyYWN0KCdnZW5lcmF0ZUV4YW1wbGUnKTtcbmZ1bmN0aW9uIGNhdGVnb3JpemVFeGFtcGxlcyhleGFtcGxlcykge1xuICAgIC8vIEEgbGlzdCBvZiBydWxlcyB0aGF0IHRoZSBzeXN0ZW0gbmVlZHMgZXhhbXBsZXMgb2YsIGluIG9yZGVyIHRvIGdlbmVyYXRlIGFuIGV4YW1wbGVcbiAgICAvLyAgIGZvciB0aGUgY3VycmVudCBydWxlXG4gICAgdmFyIGV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXNcbiAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZXhhbXBsZSkgeyByZXR1cm4gZXhhbXBsZS5oYXNPd25Qcm9wZXJ0eSgnZXhhbXBsZXNOZWVkZWQnKTsgfSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoZXhhbXBsZSkgeyByZXR1cm4gZXhhbXBsZS5leGFtcGxlc05lZWRlZDsgfSk7XG4gICAgZXhhbXBsZXNOZWVkZWQgPSBmbGF0dGVuKGV4YW1wbGVzTmVlZGVkKTtcbiAgICB2YXIgdW5pcXVlRXhhbXBsZXNOZWVkZWQgPSB7fTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV4YW1wbGVzTmVlZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjdXJyZW50RXhhbXBsZU5lZWRlZCA9IGV4YW1wbGVzTmVlZGVkW2ldO1xuICAgICAgICB1bmlxdWVFeGFtcGxlc05lZWRlZFtjdXJyZW50RXhhbXBsZU5lZWRlZF0gPSB0cnVlO1xuICAgIH1cbiAgICBleGFtcGxlc05lZWRlZCA9IE9iamVjdC5rZXlzKHVuaXF1ZUV4YW1wbGVzTmVlZGVkKTtcbiAgICAvLyBBIGxpc3Qgb2Ygc3VjY2Vzc2Z1bGx5IGdlbmVyYXRlZCBleGFtcGxlc1xuICAgIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBleGFtcGxlc1xuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChleGFtcGxlKSB7IHJldHVybiBleGFtcGxlLmhhc093blByb3BlcnR5KCd2YWx1ZScpOyB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLnZhbHVlOyB9KTtcbiAgICAvLyBUaGlzIGZsYWcgcmV0dXJucyB0cnVlIGlmIHRoZSBzeXN0ZW0gY2Fubm90IGdlbmVyYXRlIHRoZSBydWxlIGl0IGlzIGN1cnJlbnRseVxuICAgIC8vICAgYXR0ZW1wdGluZyB0byBnZW5lcmF0ZSwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIG9yIG5vdCBpdCBoYXMgdGhlIGV4YW1wbGVzIGl0IG5lZWRzLlxuICAgIC8vICAgQ3VycmVudGx5LCB0aGlzIGlzIG9ubHkgdXNlZCBpbiBvdmVycmlkaW5nIGdlbmVyYXRvcnMgdG8gcHJldmVudCB0aGUgc3lzdGVtIGZyb21cbiAgICAvLyAgIGdlbmVyYXRpbmcgZXhhbXBsZXMgZm9yIGNlcnRhaW4gcnVsZXMgKGUuZy4gJ2lkZW50JykuXG4gICAgdmFyIG5lZWRIZWxwID0gZXhhbXBsZXMuc29tZShmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbS5uZWVkSGVscDsgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXhhbXBsZXNOZWVkZWQ6IGV4YW1wbGVzTmVlZGVkLFxuICAgICAgICBzdWNjZXNzZnVsRXhhbXBsZXM6IHN1Y2Nlc3NmdWxFeGFtcGxlcyxcbiAgICAgICAgbmVlZEhlbHA6IG5lZWRIZWxwXG4gICAgfTtcbn1cbnBleHBycy5hbnkuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogU3RyaW5nLmZyb21DaGFyQ29kZShNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpKSB9O1xufTtcbi8vIEFzc3VtZXMgdGhhdCB0ZXJtaW5hbCdzIG9iamVjdCBpcyBhbHdheXMgYSBzdHJpbmdcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdGhpcy5vYmogfTtcbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0KSB7XG4gICAgdmFyIHJhbmdlU2l6ZSA9IHRoaXMudG8uY2hhckNvZGVBdCgwKSAtIHRoaXMuZnJvbS5jaGFyQ29kZUF0KDApO1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZnJvbS5jaGFyQ29kZUF0KDApICsgTWF0aC5mbG9vcihyYW5nZVNpemUgKiBNYXRoLnJhbmRvbSgpKSlcbiAgICB9O1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICByZXR1cm4gYWN0dWFsc1t0aGlzLmluZGV4XS5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscyk7XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICAvLyBpdGVtcyAtPiB0ZXJtRXhhbXBsZXNcbiAgICB2YXIgdGVybUV4YW1wbGVzID0gdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24gKHRlcm0pIHtcbiAgICAgICAgcmV0dXJuIHRlcm0uZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpO1xuICAgIH0pO1xuICAgIHZhciBjYXRlZ29yaXplZEV4YW1wbGVzID0gY2F0ZWdvcml6ZUV4YW1wbGVzKHRlcm1FeGFtcGxlcyk7XG4gICAgdmFyIGV4YW1wbGVzTmVlZGVkID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5leGFtcGxlc05lZWRlZDtcbiAgICB2YXIgc3VjY2Vzc2Z1bEV4YW1wbGVzID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5zdWNjZXNzZnVsRXhhbXBsZXM7XG4gICAgdmFyIG5lZWRIZWxwID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5uZWVkSGVscDtcbiAgICB2YXIgYW5zID0ge307XG4gICAgLy8gQWx0IGNhbiBjb250YWluIGJvdGggYW4gZXhhbXBsZSBhbmQgYSByZXF1ZXN0IGZvciBleGFtcGxlc1xuICAgIGlmIChzdWNjZXNzZnVsRXhhbXBsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHN1Y2Nlc3NmdWxFeGFtcGxlcy5sZW5ndGgpO1xuICAgICAgICBhbnMudmFsdWUgPSBzdWNjZXNzZnVsRXhhbXBsZXNbaV07XG4gICAgfVxuICAgIGlmIChleGFtcGxlc05lZWRlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFucy5leGFtcGxlc05lZWRlZCA9IGV4YW1wbGVzTmVlZGVkO1xuICAgIH1cbiAgICBhbnMubmVlZEhlbHAgPSBuZWVkSGVscDtcbiAgICByZXR1cm4gYW5zO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgdmFyIGZhY3RvckV4YW1wbGVzID0gdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbiAoZmFjdG9yKSB7XG4gICAgICAgIHJldHVybiBmYWN0b3IuZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpO1xuICAgIH0pO1xuICAgIHZhciBjYXRlZ29yaXplZEV4YW1wbGVzID0gY2F0ZWdvcml6ZUV4YW1wbGVzKGZhY3RvckV4YW1wbGVzKTtcbiAgICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBjYXRlZ29yaXplZEV4YW1wbGVzLmV4YW1wbGVzTmVlZGVkO1xuICAgIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBjYXRlZ29yaXplZEV4YW1wbGVzLnN1Y2Nlc3NmdWxFeGFtcGxlcztcbiAgICB2YXIgbmVlZEhlbHAgPSBjYXRlZ29yaXplZEV4YW1wbGVzLm5lZWRIZWxwO1xuICAgIHZhciBhbnMgPSB7fTtcbiAgICAvLyBJbiBhIFNlcSwgYWxsIHBpZWNlcyBtdXN0IHN1Y2NlZWQgaW4gb3JkZXIgdG8gaGF2ZSBhIHN1Y2Nlc3NmdWwgZXhhbXBsZS5cbiAgICBpZiAoZXhhbXBsZXNOZWVkZWQubGVuZ3RoID4gMCB8fCBuZWVkSGVscCkge1xuICAgICAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlc05lZWRlZDtcbiAgICAgICAgYW5zLm5lZWRIZWxwID0gbmVlZEhlbHA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhbnMudmFsdWUgPSBzdWNjZXNzZnVsRXhhbXBsZXMuam9pbihpblN5bnRhY3RpY0NvbnRleHQgPyAnICcgOiAnJyk7XG4gICAgfVxuICAgIHJldHVybiBhbnM7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgdmFyIHJhbmdlVGltZXMgPSBNYXRoLm1pbih0aGlzLm1heE51bU1hdGNoZXMgLSB0aGlzLm1pbk51bU1hdGNoZXMsIDMpO1xuICAgIHZhciBudW1UaW1lcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChyYW5nZVRpbWVzICsgMSkgKyB0aGlzLm1pbk51bU1hdGNoZXMpO1xuICAgIHZhciBpdGVtcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtVGltZXM7IGkrKykge1xuICAgICAgICBpdGVtcy5wdXNoKHRoaXMuZXhwci5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykpO1xuICAgIH1cbiAgICB2YXIgY2F0ZWdvcml6ZWRFeGFtcGxlcyA9IGNhdGVnb3JpemVFeGFtcGxlcyhpdGVtcyk7XG4gICAgdmFyIGV4YW1wbGVzTmVlZGVkID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5leGFtcGxlc05lZWRlZDtcbiAgICB2YXIgc3VjY2Vzc2Z1bEV4YW1wbGVzID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5zdWNjZXNzZnVsRXhhbXBsZXM7XG4gICAgdmFyIGFucyA9IHt9O1xuICAgIC8vIEl0J3MgYWx3YXlzIGVpdGhlciBvbmUgb3IgdGhlIG90aGVyLlxuICAgIC8vIFRPRE86IGluc3RlYWQgb2YgJyAnLCBjYWxsICdzcGFjZXMuZ2VuZXJhdGVFeGFtcGxlKCknXG4gICAgYW5zLnZhbHVlID0gc3VjY2Vzc2Z1bEV4YW1wbGVzLmpvaW4oaW5TeW50YWN0aWNDb250ZXh0ID8gJyAnIDogJycpO1xuICAgIGlmIChleGFtcGxlc05lZWRlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGFucy5leGFtcGxlc05lZWRlZCA9IGV4YW1wbGVzTmVlZGVkO1xuICAgIH1cbiAgICByZXR1cm4gYW5zO1xufTtcbi8vIFJpZ2h0IG5vdywgJ05vdCcgYW5kICdMb29rYWhlYWQnIGdlbmVyYXRlIG5vdGhpbmcgYW5kIGFzc3VtZSB0aGF0IHdoYXRldmVyIGZvbGxvd3Mgd2lsbFxuLy8gICB3b3JrIGFjY29yZGluZyB0byB0aGUgZW5jb2RlZCBjb25zdHJhaW50cy5cbnBleHBycy5Ob3QucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0KSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6ICcnIH07XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogJycgfTtcbn07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBmYWxzZSwgYWN0dWFscyk7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHZhciBhbnMgPSB7fTtcbiAgICB2YXIgcnVsZU5hbWUgPSB0aGlzLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscykudG9TdHJpbmcoKTtcbiAgICBpZiAoIWV4YW1wbGVzLmhhc093blByb3BlcnR5KHJ1bGVOYW1lKSkge1xuICAgICAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBbcnVsZU5hbWVdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHJlbGV2YW50RXhhbXBsZXMgPSBleGFtcGxlc1tydWxlTmFtZV07XG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVsZXZhbnRFeGFtcGxlcy5sZW5ndGgpO1xuICAgICAgICBhbnMudmFsdWUgPSByZWxldmFudEV4YW1wbGVzW2ldO1xuICAgIH1cbiAgICByZXR1cm4gYW5zO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICB2YXIgY2hhcjtcbiAgICBzd2l0Y2ggKHRoaXMuY2F0ZWdvcnkpIHtcbiAgICAgICAgY2FzZSAnTHUnOlxuICAgICAgICAgICAgY2hhciA9ICfDgSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTGwnOlxuICAgICAgICAgICAgY2hhciA9ICfFjyc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTHQnOlxuICAgICAgICAgICAgY2hhciA9ICfHhSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTG0nOlxuICAgICAgICAgICAgY2hhciA9ICfLric7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTG8nOlxuICAgICAgICAgICAgY2hhciA9ICfGuyc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTmwnOlxuICAgICAgICAgICAgY2hhciA9ICfihoInO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ05kJzpcbiAgICAgICAgICAgIGNoYXIgPSAnwr0nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01uJzpcbiAgICAgICAgICAgIGNoYXIgPSAnXFx1MDQ4Nyc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTWMnOlxuICAgICAgICAgICAgY2hhciA9ICfgpL8nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1BjJzpcbiAgICAgICAgICAgIGNoYXIgPSAn4oGAJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdacyc6XG4gICAgICAgICAgICBjaGFyID0gJ1xcdTIwMDEnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0wnOlxuICAgICAgICAgICAgY2hhciA9ICfDgSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTHRtbyc6XG4gICAgICAgICAgICBjaGFyID0gJ8eFJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4geyB2YWx1ZTogY2hhciB9OyAvLyDwn5KpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmdldEFyaXR5ID0gY29tbW9uLmFic3RyYWN0KCdnZXRBcml0eScpO1xucGV4cHJzLmFueS5nZXRBcml0eSA9XG4gICAgcGV4cHJzLmVuZC5nZXRBcml0eSA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5BcHBseS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBhcml0eSAtLSB0aGlzIHByb3BlcnR5IGlzXG4gICAgLy8gY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyAwIDogdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcml0eSA9IDA7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgYXJpdHkgKz0gdGhpcy5mYWN0b3JzW2lkeF0uZ2V0QXJpdHkoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyaXR5O1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDA7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBwZXhwcnMuTGV4LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBOb2RlVHlwZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBOb2RlVHlwZSgpIHtcbiAgICAgICAgdmFyIHR5cGVzID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB0eXBlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3R5cGVzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLmFkZC5hcHBseSh0aGlzLCB0eXBlcyk7XG4gICAgfVxuICAgIE5vZGVUeXBlLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0eXBlcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdHlwZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfYSA9IDAsIHR5cGVzXzEgPSB0eXBlczsgX2EgPCB0eXBlc18xLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgdmFyIHQgPSB0eXBlc18xW19hXTtcbiAgICAgICAgICAgIHRoaXMuX3R5cGVzLmFkZCh0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTm9kZVR5cGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fdHlwZXMuaGFzKCdOb2RlJykgfHwgdGhpcy5fdHlwZXMuc2l6ZSA+PSAzKSB7XG4gICAgICAgICAgICByZXR1cm4gJ05vZGUnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuX3R5cGVzKS5zb3J0KCkuam9pbignIHwgJyk7XG4gICAgfTtcbiAgICBOb2RlVHlwZS5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9pLCBfYSwgdDtcbiAgICAgICAgcmV0dXJuIF9fZ2VuZXJhdG9yKHRoaXMsIGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgICAgc3dpdGNoIChfYi5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICAgICAgX2kgPSAwLCBfYSA9IHRoaXMuX3R5cGVzO1xuICAgICAgICAgICAgICAgICAgICBfYi5sYWJlbCA9IDE7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIShfaSA8IF9hLmxlbmd0aCkpIHJldHVybiBbMyAvKmJyZWFrKi8sIDRdO1xuICAgICAgICAgICAgICAgICAgICB0ID0gX2FbX2ldO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQgLyp5aWVsZCovLCB0XTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIF9iLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgX2IubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgX2krKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszIC8qYnJlYWsqLywgMV07XG4gICAgICAgICAgICAgICAgY2FzZSA0OiByZXR1cm4gWzIgLypyZXR1cm4qL107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE5vZGVUeXBlO1xufSgpKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXROb2RlVHlwZXMgPSBjb21tb24uYWJzdHJhY3QoJ2dldE5vZGVUeXBlcycpO1xucGV4cHJzLmFueS5nZXROb2RlVHlwZXMgPVxuICAgIHBleHBycy5lbmQuZ2V0Tm9kZVR5cGVzID1cbiAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5nZXROb2RlVHlwZXMgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5nZXROb2RlVHlwZXMgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZ2V0Tm9kZVR5cGVzID1cbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtuZXcgTm9kZVR5cGUoJ1Rlcm1pbmFsTm9kZScpXTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ2V0Tm9kZVR5cGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBbbmV3IE5vZGVUeXBlKCdOb250ZXJtaW5hbE5vZGUnKV07XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5nZXROb2RlVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtuZXcgTm9kZVR5cGUoJ05vZGUnKV07XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0Tm9kZVR5cGVzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBfYTtcbiAgICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy50ZXJtc1swXS5nZXROb2RlVHlwZXMoKTtcbiAgICBmb3IgKHZhciBfaSA9IDAsIF9iID0gdGhpcy50ZXJtcy5zbGljZSgxKTsgX2kgPCBfYi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHRlcm0gPSBfYltfaV07XG4gICAgICAgIGZvciAodmFyIF9jID0gMCwgX2QgPSB0ZXJtLmdldE5vZGVUeXBlcygpLmVudHJpZXMoKTsgX2MgPCBfZC5sZW5ndGg7IF9jKyspIHtcbiAgICAgICAgICAgIHZhciBfZSA9IF9kW19jXSwgaSA9IF9lWzBdLCB0ZXJtVHlwZSA9IF9lWzFdO1xuICAgICAgICAgICAgKF9hID0gcmVzdWx0W2ldKS5hZGQuYXBwbHkoX2EsIHRlcm1UeXBlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmdldE5vZGVUeXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbiAoZikgeyByZXR1cm4gZi5nZXROb2RlVHlwZXMoKTsgfSk7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmdldE5vZGVUeXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUT0RPKHBkdWJyb3kpOiBTaG91bGQgSXRlcmF0aW9uTm9kZSBoYXZlIGEgdHlwZSBwYXJhbWV0ZXI/XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZXROb2RlVHlwZXMoKS5tYXAoZnVuY3Rpb24gKF8pIHsgcmV0dXJuIG5ldyBOb2RlVHlwZSgnSXRlcmF0aW9uTm9kZScpOyB9KTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS5nZXROb2RlVHlwZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFtdO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmdldE5vZGVUeXBlcyA9IHBleHBycy5MZXgucHJvdG90eXBlLmdldE5vZGVUeXBlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldE5vZGVUeXBlcygpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgQ2FsbGVkIGF0IGdyYW1tYXIgY3JlYXRpb24gdGltZSB0byByZXdyaXRlIGEgcnVsZSBib2R5LCByZXBsYWNpbmcgZWFjaCByZWZlcmVuY2UgdG8gYSBmb3JtYWxcbiAgcGFyYW1ldGVyIHdpdGggYSBgUGFyYW1gIG5vZGUuIFJldHVybnMgYSBQRXhwciAtLSBlaXRoZXIgYSBuZXcgb25lLCBvciB0aGUgb3JpZ2luYWwgb25lIGlmXG4gIGl0IHdhcyBtb2RpZmllZCBpbiBwbGFjZS5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnaW50cm9kdWNlUGFyYW1zJyk7XG5wZXhwcnMuYW55LmludHJvZHVjZVBhcmFtcyA9XG4gICAgcGV4cHJzLmVuZC5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BbHQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgdGhpcy50ZXJtcy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXJtLCBpZHgsIHRlcm1zKSB7XG4gICAgICAgIHRlcm1zW2lkeF0gPSB0ZXJtLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgIHRoaXMuZmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmYWN0b3IsIGlkeCwgZmFjdG9ycykge1xuICAgICAgICBmYWN0b3JzW2lkeF0gPSBmYWN0b3IuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgIHBleHBycy5Ob3QucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwciA9IHRoaXMuZXhwci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgdmFyIGluZGV4ID0gZm9ybWFscy5pbmRleE9mKHRoaXMucnVsZU5hbWUpO1xuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgLy8gVE9ETzogU2hvdWxkIHRoaXMgYmUgc3VwcG9ydGVkPyBTZWUgaXNzdWUgIzY0LlxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXJpemVkIHJ1bGVzIGNhbm5vdCBiZSBwYXNzZWQgYXMgYXJndW1lbnRzIHRvIGFub3RoZXIgcnVsZS4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5QYXJhbShpbmRleCkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoYXJnLCBpZHgsIGFyZ3MpIHtcbiAgICAgICAgICAgIGFyZ3NbaWR4XSA9IGFyZy5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGlzIHBhcnNpbmcgZXhwcmVzc2lvbiBtYXkgYWNjZXB0IHdpdGhvdXQgY29uc3VtaW5nIGFueSBpbnB1dC5cbnBleHBycy5QRXhwci5wcm90b3R5cGUuaXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIHRoaXMuX2lzTnVsbGFibGUoZ3JhbW1hciwgT2JqZWN0LmNyZWF0ZShudWxsKSk7XG59O1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGNvbW1vbi5hYnN0cmFjdCgnX2lzTnVsbGFibGUnKTtcbnBleHBycy5hbnkuX2lzTnVsbGFibGUgPVxuICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5QbHVzLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuZW5kLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBUaGlzIGlzIGFuIG92ZXItc2ltcGxpZmljYXRpb246IGl0J3Mgb25seSBjb3JyZWN0IGlmIHRoZSBpbnB1dCBpcyBhIHN0cmluZy4gSWYgaXQncyBhbiBhcnJheVxuICAgICAgICAvLyBvciBhbiBvYmplY3QsIHRoZW4gdGhlIGVtcHR5IHN0cmluZyBwYXJzaW5nIGV4cHJlc3Npb24gaXMgbm90IG51bGxhYmxlLlxuICAgICAgICByZXR1cm4gdGhpcy5vYmogPT09ICcnO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAwIHx8IHRoaXMudGVybXMuc29tZShmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gdGVybS5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTsgfSk7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLmZhY3RvcnMuZXZlcnkoZnVuY3Rpb24gKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pOyB9KTtcbn07XG5wZXhwcnMuU3Rhci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgIHBleHBycy5PcHQucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICB2YXIga2V5ID0gdGhpcy50b01lbW9LZXkoKTtcbiAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtZW1vLCBrZXkpKSB7XG4gICAgICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXS5ib2R5O1xuICAgICAgICB2YXIgaW5saW5lZCA9IGJvZHkuc3Vic3RpdHV0ZVBhcmFtcyh0aGlzLmFyZ3MpO1xuICAgICAgICBtZW1vW2tleV0gPSBmYWxzZTsgLy8gUHJldmVudCBpbmZpbml0ZSByZWN1cnNpb24gZm9yIHJlY3Vyc2l2ZSBydWxlcy5cbiAgICAgICAgbWVtb1trZXldID0gaW5saW5lZC5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW9ba2V5XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldE1ldGFJbmZvKGV4cHIsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHZhciBtZXRhSW5mbyA9IHt9O1xuICAgIGlmIChleHByLnNvdXJjZSAmJiBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkanVzdGVkID0gZXhwci5zb3VyY2UucmVsYXRpdmVUbyhncmFtbWFySW50ZXJ2YWwpO1xuICAgICAgICBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCA9IFthZGp1c3RlZC5zdGFydElkeCwgYWRqdXN0ZWQuZW5kSWR4XTtcbiAgICB9XG4gICAgcmV0dXJuIG1ldGFJbmZvO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGNvbW1vbi5hYnN0cmFjdCgnb3V0cHV0UmVjaXBlJyk7XG5wZXhwcnMuYW55Lm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gWydhbnknLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpXTtcbn07XG5wZXhwcnMuZW5kLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gWydlbmQnLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpXTtcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gWyd0ZXJtaW5hbCcsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksIHRoaXMub2JqXTtcbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gWydyYW5nZScsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksIHRoaXMuZnJvbSwgdGhpcy50b107XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsncGFyYW0nLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLmluZGV4XTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnYWx0JywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV0uY29uY2F0KHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiB0ZXJtLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpOyB9KSk7XG59O1xucGV4cHJzLkV4dGVuZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHZhciBleHRlbnNpb24gPSB0aGlzLnRlcm1zWzBdOyAvLyBbZXh0ZW5zaW9uLCBvcmlnaW5hbF1cbiAgICByZXR1cm4gZXh0ZW5zaW9uLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xufTtcbnBleHBycy5TcGxpY2UucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICB2YXIgYmVmb3JlVGVybXMgPSB0aGlzLnRlcm1zLnNsaWNlKDAsIHRoaXMuZXhwYW5zaW9uUG9zKTtcbiAgICB2YXIgYWZ0ZXJUZXJtcyA9IHRoaXMudGVybXMuc2xpY2UodGhpcy5leHBhbnNpb25Qb3MgKyAxKTtcbiAgICByZXR1cm4gW1xuICAgICAgICAnc3BsaWNlJyxcbiAgICAgICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICAgICAgYmVmb3JlVGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiB0ZXJtLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpOyB9KSxcbiAgICAgICAgYWZ0ZXJUZXJtcy5tYXAoZnVuY3Rpb24gKHRlcm0pIHsgcmV0dXJuIHRlcm0ub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7IH0pXG4gICAgXTtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnc2VxJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV0uY29uY2F0KHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpOyB9KSk7XG59O1xucGV4cHJzLlN0YXIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgcGV4cHJzLlBsdXMucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgICAgIHBleHBycy5PcHQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgICAgICAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5MZXgucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgJ2FwcCcsXG4gICAgICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgICAgIHRoaXMucnVsZU5hbWUsXG4gICAgICAgIHRoaXMuYXJncy5tYXAoZnVuY3Rpb24gKGFyZykgeyByZXR1cm4gYXJnLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpOyB9KVxuICAgIF07XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsndW5pY29kZUNoYXInLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLmNhdGVnb3J5XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIFJldHVybnMgYSBQRXhwciB0aGF0IHJlc3VsdHMgZnJvbSByZWN1cnNpdmVseSByZXBsYWNpbmcgZXZlcnkgZm9ybWFsIHBhcmFtZXRlciAoaS5lLiwgaW5zdGFuY2VcbiAgb2YgYFBhcmFtYCkgaW5zaWRlIHRoaXMgUEV4cHIgd2l0aCBpdHMgYWN0dWFsIHZhbHVlIGZyb20gYGFjdHVhbHNgIChhbiBBcnJheSkuXG5cbiAgVGhlIHJlY2VpdmVyIG11c3Qgbm90IGJlIG1vZGlmaWVkOyBhIG5ldyBQRXhwciBtdXN0IGJlIHJldHVybmVkIGlmIGFueSByZXBsYWNlbWVudCBpcyBuZWNlc3NhcnkuXG4qL1xuLy8gZnVuY3Rpb24oYWN0dWFscykgeyAuLi4gfVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gY29tbW9uLmFic3RyYWN0KCdzdWJzdGl0dXRlUGFyYW1zJyk7XG5wZXhwcnMuYW55LnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgIHBleHBycy5lbmQuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgcmV0dXJuIGFjdHVhbHNbdGhpcy5pbmRleF07XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuQWx0KHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiB0ZXJtLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24gKGFjdHVhbHMpIHtcbiAgICByZXR1cm4gbmV3IHBleHBycy5TZXEodGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbiAoZmFjdG9yKSB7IHJldHVybiBmYWN0b3Iuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSkpO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy5leHByLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscykpO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEF2b2lkIG1ha2luZyBhIGNvcHkgb2YgdGhpcyBhcHBsaWNhdGlvbiwgYXMgYW4gb3B0aW1pemF0aW9uXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkodGhpcy5ydWxlTmFtZSwgYXJncyk7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciBjb3B5V2l0aG91dER1cGxpY2F0ZXMgPSBjb21tb24uY29weVdpdGhvdXREdXBsaWNhdGVzO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRKU0lkZW50aWZpZXIoc3RyKSB7XG4gICAgcmV0dXJuIC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8udGVzdChzdHIpO1xufVxuZnVuY3Rpb24gcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KSB7XG4gICAgLy8gYGNvdW50YCBpcyB1c2VkIHRvIHJlY29yZCB0aGUgbnVtYmVyIG9mIHRpbWVzIGVhY2ggYXJndW1lbnQgbmFtZSBvY2N1cnMgaW4gdGhlIGxpc3QsXG4gICAgLy8gdGhpcyBpcyB1c2VmdWwgZm9yIGNoZWNraW5nIGR1cGxpY2F0ZWQgYXJndW1lbnQgbmFtZS4gSXQgbWFwcyBhcmd1bWVudCBuYW1lcyB0byBpbnRzLlxuICAgIHZhciBjb3VudCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChhcmdOYW1lKSB7XG4gICAgICAgIGNvdW50W2FyZ05hbWVdID0gKGNvdW50W2FyZ05hbWVdIHx8IDApICsgMTtcbiAgICB9KTtcbiAgICAvLyBBcHBlbmQgc3Vic2NyaXB0cyAoJ18xJywgJ18yJywgLi4uKSB0byBkdXBsaWNhdGUgYXJndW1lbnQgbmFtZXMuXG4gICAgT2JqZWN0LmtleXMoY291bnQpLmZvckVhY2goZnVuY3Rpb24gKGR1cEFyZ05hbWUpIHtcbiAgICAgICAgaWYgKGNvdW50W2R1cEFyZ05hbWVdIDw9IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIG5hbWUgc2hvd3MgdXAgbW9yZSB0aGFuIG9uY2UsIHNvIGFkZCBzdWJzY3JpcHRzLlxuICAgICAgICB2YXIgc3Vic2NyaXB0ID0gMTtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChhcmdOYW1lLCBpZHgpIHtcbiAgICAgICAgICAgIGlmIChhcmdOYW1lID09PSBkdXBBcmdOYW1lKSB7XG4gICAgICAgICAgICAgICAgYXJndW1lbnROYW1lTGlzdFtpZHhdID0gYXJnTmFtZSArICdfJyArIHN1YnNjcmlwdCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgUmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgYmUgdXNlZCBhcyB0aGUgZGVmYXVsdCBhcmd1bWVudCBuYW1lcyBmb3IgaXRzIHJlY2VpdmVyXG4gIChhIHBleHByKSBpbiBhIHNlbWFudGljIGFjdGlvbi4gVGhpcyBpcyB1c2VkIGV4Y2x1c2l2ZWx5IGJ5IHRoZSBTZW1hbnRpY3MgRWRpdG9yLlxuXG4gIGBmaXJzdEFyZ0luZGV4YCBpcyB0aGUgMS1iYXNlZCBpbmRleCBvZiB0aGUgZmlyc3QgYXJndW1lbnQgbmFtZSB0aGF0IHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB0aGlzXG4gIHBleHByLiBJdCBlbmFibGVzIHVzIHRvIG5hbWUgYXJndW1lbnRzIHBvc2l0aW9uYWxseSwgZS5nLiwgaWYgdGhlIHNlY29uZCBhcmd1bWVudCBpcyBhXG4gIG5vbi1hbHBoYW51bWVyaWMgdGVybWluYWwgbGlrZSBcIitcIiwgaXQgd2lsbCBiZSBuYW1lZCAnJDInLlxuXG4gIGBub0R1cENoZWNrYCBpcyB0cnVlIGlmIHRoZSBjYWxsZXIgb2YgYHRvQXJndW1lbnROYW1lTGlzdGAgaXMgbm90IGEgdG9wIGxldmVsIGNhbGxlci4gSXQgZW5hYmxlc1xuICB1cyB0byBhdm9pZCBuZXN0ZWQgZHVwbGljYXRpb24gc3Vic2NyaXB0cyBhcHBlbmRpbmcsIGUuZy4sICdfMV8xJywgJ18xXzInLCBieSBvbmx5IGNoZWNraW5nXG4gIGR1cGxpY2F0ZXMgYXQgdGhlIHRvcCBsZXZlbC5cblxuICBIZXJlIGlzIGEgbW9yZSBlbGFib3JhdGUgZXhhbXBsZSB0aGF0IGlsbHVzdHJhdGVzIGhvdyB0aGlzIG1ldGhvZCB3b3JrczpcbiAgYChhIFwiK1wiIGIpLnRvQXJndW1lbnROYW1lTGlzdCgxKWAgZXZhbHVhdGVzIHRvIGBbJ2EnLCAnJDInLCAnYiddYCB3aXRoIHRoZSBmb2xsb3dpbmcgcmVjdXJzaXZlXG4gIGNhbGxzOlxuXG4gICAgKGEpLnRvQXJndW1lbnROYW1lTGlzdCgxKSAtPiBbJ2EnXSxcbiAgICAoXCIrXCIpLnRvQXJndW1lbnROYW1lTGlzdCgyKSAtPiBbJyQyJ10sXG4gICAgKGIpLnRvQXJndW1lbnROYW1lTGlzdCgzKSAtPiBbJ2InXVxuXG4gIE5vdGVzOlxuICAqIFRoaXMgbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgb24gd2VsbC1mb3JtZWQgZXhwcmVzc2lvbnMsIGUuZy4sIHRoZSByZWNlaXZlciBtdXN0XG4gICAgbm90IGhhdmUgYW55IEFsdCBzdWItZXhwcmVzc2lvbnMgd2l0aCBpbmNvbnNpc3RlbnQgYXJpdGllcy5cbiAgKiBlLmdldEFyaXR5KCkgPT09IGUudG9Bcmd1bWVudE5hbWVMaXN0KDEpLmxlbmd0aFxuKi9cbi8vIGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHsgLi4uIH1cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gY29tbW9uLmFic3RyYWN0KCd0b0FyZ3VtZW50TmFtZUxpc3QnKTtcbnBleHBycy5hbnkudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gWydhbnknXTtcbn07XG5wZXhwcnMuZW5kLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFsnZW5kJ107XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vYmogPT09ICdzdHJpbmcnICYmIC9eW19hLXpBLVowLTldKyQvLnRlc3QodGhpcy5vYmopKSB7XG4gICAgICAgIC8vIElmIHRoaXMgdGVybWluYWwgaXMgYSB2YWxpZCBzdWZmaXggZm9yIGEgSlMgaWRlbnRpZmllciwganVzdCBwcmVwZW5kIGl0IHdpdGggJ18nXG4gICAgICAgIHJldHVybiBbJ18nICsgdGhpcy5vYmpdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICAgICAgcmV0dXJuIFsnJCcgKyBmaXJzdEFyZ0luZGV4XTtcbiAgICB9XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHZhciBhcmdOYW1lID0gdGhpcy5mcm9tICsgJ190b18nICsgdGhpcy50bztcbiAgICAvLyBJZiB0aGUgYGFyZ05hbWVgIGlzIG5vdCB2YWxpZCB0aGVuIHRyeSB0byBwcmVwZW5kIGEgYF9gLlxuICAgIGlmICghaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKGFyZ05hbWUpKSB7XG4gICAgICAgIGFyZ05hbWUgPSAnXycgKyBhcmdOYW1lO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgYGFyZ05hbWVgIHN0aWxsIG5vdCB2YWxpZCBhZnRlciBwcmVwZW5kaW5nIGEgYF9gLCB0aGVuIG5hbWUgaXQgcG9zaXRpb25hbGx5LlxuICAgIGlmICghaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKGFyZ05hbWUpKSB7XG4gICAgICAgIGFyZ05hbWUgPSAnJCcgKyBmaXJzdEFyZ0luZGV4O1xuICAgIH1cbiAgICByZXR1cm4gW2FyZ05hbWVdO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgLy8gYHRlcm1BcmdOYW1lTGlzdHNgIGlzIGFuIGFycmF5IG9mIGFycmF5cyB3aGVyZSBlYWNoIHJvdyBpcyB0aGVcbiAgICAvLyBhcmd1bWVudCBuYW1lIGxpc3QgdGhhdCBjb3JyZXNwb25kcyB0byBhIHRlcm0gaW4gdGhpcyBhbHRlcm5hdGlvbi5cbiAgICB2YXIgdGVybUFyZ05hbWVMaXN0cyA9IHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7XG4gICAgICAgIHJldHVybiB0ZXJtLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCB0cnVlKTtcbiAgICB9KTtcbiAgICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICAgIHZhciBudW1BcmdzID0gdGVybUFyZ05hbWVMaXN0c1swXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbnVtQXJnczsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciByb3dJZHggPSAwOyByb3dJZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgcm93SWR4KyspIHtcbiAgICAgICAgICAgIGNvbC5wdXNoKHRlcm1BcmdOYW1lTGlzdHNbcm93SWR4XVtjb2xJZHhdKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdW5pcXVlTmFtZXMgPSBjb3B5V2l0aG91dER1cGxpY2F0ZXMoY29sKTtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdC5wdXNoKHVuaXF1ZU5hbWVzLmpvaW4oJ19vcl8nKSk7XG4gICAgfVxuICAgIGlmICghbm9EdXBDaGVjaykge1xuICAgICAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIC8vIEdlbmVyYXRlIHRoZSBhcmd1bWVudCBuYW1lIGxpc3QsIHdpdGhvdXQgd29ycnlpbmcgYWJvdXQgZHVwbGljYXRlcy5cbiAgICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICAgIHRoaXMuZmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmYWN0b3IpIHtcbiAgICAgICAgdmFyIGZhY3RvckFyZ3VtZW50TmFtZUxpc3QgPSBmYWN0b3IudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIHRydWUpO1xuICAgICAgICBhcmd1bWVudE5hbWVMaXN0ID0gYXJndW1lbnROYW1lTGlzdC5jb25jYXQoZmFjdG9yQXJndW1lbnROYW1lTGlzdCk7XG4gICAgICAgIC8vIFNoaWZ0IHRoZSBmaXJzdEFyZ0luZGV4IHRvIHRha2UgdGhpcyBmYWN0b3IncyBhcmd1bWVudCBuYW1lcyBpbnRvIGFjY291bnQuXG4gICAgICAgIGZpcnN0QXJnSW5kZXggKz0gZmFjdG9yQXJndW1lbnROYW1lTGlzdC5sZW5ndGg7XG4gICAgfSk7XG4gICAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgICAgIHJlc29sdmVEdXBsaWNhdGVkTmFtZXMoYXJndW1lbnROYW1lTGlzdCk7XG4gICAgfVxuICAgIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHZhciBhcmd1bWVudE5hbWVMaXN0ID0gdGhpcy5leHByXG4gICAgICAgIC50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaylcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoZXhwckFyZ3VtZW50U3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBleHByQXJndW1lbnRTdHJpbmdbZXhwckFyZ3VtZW50U3RyaW5nLmxlbmd0aCAtIDFdID09PSAncydcbiAgICAgICAgICAgID8gZXhwckFyZ3VtZW50U3RyaW5nICsgJ2VzJ1xuICAgICAgICAgICAgOiBleHByQXJndW1lbnRTdHJpbmcgKyAncyc7XG4gICAgfSk7XG4gICAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgICAgIHJlc29sdmVEdXBsaWNhdGVkTmFtZXMoYXJndW1lbnROYW1lTGlzdCk7XG4gICAgfVxuICAgIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcbnBleHBycy5PcHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykubWFwKGZ1bmN0aW9uIChhcmdOYW1lKSB7XG4gICAgICAgIHJldHVybiAnb3B0JyArIGFyZ05hbWVbMF0udG9VcHBlckNhc2UoKSArIGFyZ05hbWUuc2xpY2UoMSk7XG4gICAgfSk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gW107XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gcGV4cHJzLkxleC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID1cbiAgICBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgICAgICByZXR1cm4gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKTtcbiAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiBbdGhpcy5ydWxlTmFtZV07XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiBbJyQnICsgZmlyc3RBcmdJbmRleF07XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiBbJ3BhcmFtJyArIHRoaXMuaW5kZXhdO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBhIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIFBFeHByLCBmb3IgdXNlIGFzIGEgVUkgbGFiZWwsIGV0Yy5cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gY29tbW9uLmFic3RyYWN0KCd0b0Rpc3BsYXlTdHJpbmcnKTtcbnBleHBycy5BbHQucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IHBleHBycy5TZXEucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnRyaW1tZWQoKS5jb250ZW50cztcbiAgICB9XG4gICAgcmV0dXJuICdbJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICddJztcbn07XG5wZXhwcnMuYW55LnRvRGlzcGxheVN0cmluZyA9XG4gICAgcGV4cHJzLmVuZC50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICBwZXhwcnMuSXRlci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgcHMgPSB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy50b0Rpc3BsYXlTdHJpbmcoKTsgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lICsgJzwnICsgcHMuam9pbignLCcpICsgJz4nO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZU5hbWU7XG4gICAgfVxufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnVW5pY29kZSBbJyArIHRoaXMuY2F0ZWdvcnkgKyAnXSBjaGFyYWN0ZXInO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEZhaWx1cmUgPSByZXF1aXJlKCcuL0ZhaWx1cmUnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9GYWlsdXJlID0gY29tbW9uLmFic3RyYWN0KCd0b0ZhaWx1cmUnKTtcbnBleHBycy5hbnkudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2FueSBvYmplY3QnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuZW5kLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdlbmQgb2YgaW5wdXQnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIHRoaXMub2JqLCAnc3RyaW5nJyk7XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIC8vIFRPRE86IGNvbWUgdXAgd2l0aCBzb21ldGhpbmcgYmV0dGVyXG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byksICdjb2RlJyk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmV4cHIgPT09IHBleHBycy5hbnkgPyAnbm90aGluZycgOiAnbm90ICcgKyB0aGlzLmV4cHIudG9GYWlsdXJlKGdyYW1tYXIpO1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXS5kZXNjcmlwdGlvbjtcbiAgICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHZhciBhcnRpY2xlID0gL15bYWVpb3VBRUlPVV0vLnRlc3QodGhpcy5ydWxlTmFtZSkgPyAnYW4nIDogJ2EnO1xuICAgICAgICBkZXNjcmlwdGlvbiA9IGFydGljbGUgKyAnICcgKyB0aGlzLnJ1bGVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2EgVW5pY29kZSBbJyArIHRoaXMuY2F0ZWdvcnkgKyAnXSBjaGFyYWN0ZXInLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHZhciBmcyA9IHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0KSB7IHJldHVybiB0LnRvRmFpbHVyZShncmFtbWFyKTsgfSk7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gJygnICsgZnMuam9pbignIG9yICcpICsgJyknO1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICB2YXIgZnMgPSB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uIChmKSB7IHJldHVybiBmLnRvRmFpbHVyZShncmFtbWFyKTsgfSk7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gJygnICsgZnMuam9pbignICcpICsgJyknO1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gJygnICsgdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKSArIHRoaXMub3BlcmF0b3IgKyAnKSc7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIGUxLnRvU3RyaW5nKCkgPT09IGUyLnRvU3RyaW5nKCkgPT0+IGUxIGFuZCBlMiBhcmUgc2VtYW50aWNhbGx5IGVxdWl2YWxlbnQuXG4gIE5vdGUgdGhhdCB0aGlzIGlzIG5vdCBhbiBpZmYgKDw9PT4pOiBlLmcuLFxuICAoflwiYlwiIFwiYVwiKS50b1N0cmluZygpICE9PSAoXCJhXCIpLnRvU3RyaW5nKCksIGV2ZW4gdGhvdWdoXG4gIH5cImJcIiBcImFcIiBhbmQgXCJhXCIgYXJlIGludGVyY2hhbmdlYWJsZSBpbiBhbnkgZ3JhbW1hcixcbiAgYm90aCBpbiB0ZXJtcyBvZiB0aGUgbGFuZ3VhZ2VzIHRoZXkgYWNjZXB0IGFuZCB0aGVpciBhcml0aWVzLlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9TdHJpbmcgPSBjb21tb24uYWJzdHJhY3QoJ3RvU3RyaW5nJyk7XG5wZXhwcnMuYW55LnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnYW55Jztcbn07XG5wZXhwcnMuZW5kLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnZW5kJztcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLm9iaik7XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5mcm9tKSArICcuLicgKyBKU09OLnN0cmluZ2lmeSh0aGlzLnRvKTtcbn07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnJCcgKyB0aGlzLmluZGV4O1xufTtcbnBleHBycy5MZXgucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnIygnICsgdGhpcy5leHByLnRvU3RyaW5nKCkgKyAnKSc7XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGVybXMubGVuZ3RoID09PSAxXG4gICAgICAgID8gdGhpcy50ZXJtc1swXS50b1N0cmluZygpXG4gICAgICAgIDogJygnICsgdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24gKHRlcm0pIHsgcmV0dXJuIHRlcm0udG9TdHJpbmcoKTsgfSkuam9pbignIHwgJykgKyAnKSc7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmFjdG9ycy5sZW5ndGggPT09IDFcbiAgICAgICAgPyB0aGlzLmZhY3RvcnNbMF0udG9TdHJpbmcoKVxuICAgICAgICA6ICcoJyArIHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnRvU3RyaW5nKCk7IH0pLmpvaW4oJyAnKSArICcpJztcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwciArIHRoaXMub3BlcmF0b3I7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICd+JyArIHRoaXMuZXhwcjtcbn07XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyYnICsgdGhpcy5leHByO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBwcyA9IHRoaXMuYXJncy5tYXAoZnVuY3Rpb24gKGFyZykgeyByZXR1cm4gYXJnLnRvU3RyaW5nKCk7IH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xuICAgIH1cbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnXFxcXHB7JyArIHRoaXMuY2F0ZWdvcnkgKyAnfSc7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX3NwcmVhZEFycmF5cyA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheXMpIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBzID0gMCwgaSA9IDAsIGlsID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGlsOyBpKyspIHMgKz0gYXJndW1lbnRzW2ldLmxlbmd0aDtcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxuICAgICAgICAgICAgcltrXSA9IGFbal07XG4gICAgcmV0dXJuIHI7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgVW5pY29kZUNhdGVnb3JpZXMgPSByZXF1aXJlKCcuLi90aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcycpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdlbmVyYWwgc3R1ZmZcbnZhciBQRXhwciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQRXhwcigpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uc3RydWN0b3IgPT09IFBFeHByKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQRXhwciBjYW5ub3QgYmUgaW5zdGFudGlhdGVkIC0tIGl0J3MgYWJzdHJhY3RcIik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gU2V0IHRoZSBgc291cmNlYCBwcm9wZXJ0eSB0byB0aGUgaW50ZXJ2YWwgY29udGFpbmluZyB0aGUgc291cmNlIGZvciB0aGlzIGV4cHJlc3Npb24uXG4gICAgUEV4cHIucHJvdG90eXBlLndpdGhTb3VyY2UgPSBmdW5jdGlvbiAoaW50ZXJ2YWwpIHtcbiAgICAgICAgaWYgKGludGVydmFsKSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IGludGVydmFsLnRyaW1tZWQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBQRXhwcjtcbn0oKSk7XG4vLyBBbnlcbnZhciBhbnkgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG4vLyBFbmRcbnZhciBlbmQgPSBPYmplY3QuY3JlYXRlKFBFeHByLnByb3RvdHlwZSk7XG4vLyBUZXJtaW5hbHNcbnZhciBUZXJtaW5hbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVGVybWluYWwsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVGVybWluYWwob2JqKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm9iaiA9IG9iajtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gVGVybWluYWw7XG59KFBFeHByKSk7XG4vLyBSYW5nZXNcbnZhciBSYW5nZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUmFuZ2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUmFuZ2UoZnJvbSwgdG8pIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZnJvbSA9IGZyb207XG4gICAgICAgIF90aGlzLnRvID0gdG87XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFJhbmdlO1xufShQRXhwcikpO1xuLy8gUGFyYW1ldGVyc1xudmFyIFBhcmFtID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhQYXJhbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBQYXJhbShpbmRleCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBQYXJhbTtcbn0oUEV4cHIpKTtcbi8vIEFsdGVybmF0aW9uXG52YXIgQWx0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBbHQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQWx0KHRlcm1zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnRlcm1zID0gdGVybXM7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEFsdDtcbn0oUEV4cHIpKTtcbi8vIEV4dGVuZCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cbnZhciBFeHRlbmQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEV4dGVuZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFeHRlbmQoc3VwZXJHcmFtbWFyLCBuYW1lLCBib2R5KSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlc1tuYW1lXS5ib2R5O1xuICAgICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIFtib2R5LCBvcmlnQm9keV0pIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICAgICAgX3RoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIF90aGlzLmJvZHkgPSBib2R5O1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBFeHRlbmQ7XG59KEFsdCkpO1xuLy8gU3BsaWNlIGlzIGFuIGltcGxlbWVudGF0aW9uIGRldGFpbCBvZiBydWxlIG92ZXJyaWRpbmcgd2l0aCB0aGUgYC4uLmAgb3BlcmF0b3IuXG52YXIgU3BsaWNlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTcGxpY2UsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3BsaWNlKHN1cGVyR3JhbW1hciwgcnVsZU5hbWUsIGJlZm9yZVRlcm1zLCBhZnRlclRlcm1zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBvcmlnQm9keSA9IHN1cGVyR3JhbW1hci5ydWxlc1tydWxlTmFtZV0uYm9keTtcbiAgICAgICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBfX3NwcmVhZEFycmF5cyhiZWZvcmVUZXJtcywgW29yaWdCb2R5XSwgYWZ0ZXJUZXJtcykpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICAgICAgX3RoaXMucnVsZU5hbWUgPSBydWxlTmFtZTtcbiAgICAgICAgX3RoaXMuZXhwYW5zaW9uUG9zID0gYmVmb3JlVGVybXMubGVuZ3RoO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBTcGxpY2U7XG59KEFsdCkpO1xuLy8gU2VxdWVuY2VzXG52YXIgU2VxID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTZXEsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU2VxKGZhY3RvcnMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZmFjdG9ycyA9IGZhY3RvcnM7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFNlcTtcbn0oUEV4cHIpKTtcbi8vIEl0ZXJhdG9ycyBhbmQgb3B0aW9uYWxzXG52YXIgSXRlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoSXRlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJdGVyKGV4cHIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZXhwciA9IGV4cHI7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIEl0ZXI7XG59KFBFeHByKSk7XG52YXIgU3RhciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3RhciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTdGFyKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBTdGFyO1xufShJdGVyKSk7XG52YXIgUGx1cyA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUGx1cywgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBQbHVzKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBQbHVzO1xufShJdGVyKSk7XG52YXIgT3B0ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhPcHQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gT3B0KCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBPcHQ7XG59KEl0ZXIpKTtcblN0YXIucHJvdG90eXBlLm9wZXJhdG9yID0gJyonO1xuUGx1cy5wcm90b3R5cGUub3BlcmF0b3IgPSAnKyc7XG5PcHQucHJvdG90eXBlLm9wZXJhdG9yID0gJz8nO1xuU3Rhci5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5QbHVzLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMTtcbk9wdC5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDA7XG5TdGFyLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuUGx1cy5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbk9wdC5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IDE7XG4vLyBQcmVkaWNhdGVzXG52YXIgTm90ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTm90KGV4cHIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZXhwciA9IGV4cHI7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIE5vdDtcbn0oUEV4cHIpKTtcbnZhciBMb29rYWhlYWQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKExvb2thaGVhZCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMb29rYWhlYWQoZXhwcikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5leHByID0gZXhwcjtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gTG9va2FoZWFkO1xufShQRXhwcikpO1xuLy8gXCJMZXhpZmljYXRpb25cIlxudmFyIExleCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTGV4LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIExleChleHByKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmV4cHIgPSBleHByO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBMZXg7XG59KFBFeHByKSk7XG4vLyBSdWxlIGFwcGxpY2F0aW9uXG52YXIgQXBwbHkgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEFwcGx5LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lLCBhcmdzKSB7XG4gICAgICAgIGlmIChhcmdzID09PSB2b2lkIDApIHsgYXJncyA9IFtdOyB9XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICAgIF90aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEFwcGx5LnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLnJ1bGVOYW1lKTtcbiAgICB9O1xuICAgIC8vIFRoaXMgbWV0aG9kIGp1c3QgY2FjaGVzIHRoZSByZXN1bHQgb2YgYHRoaXMudG9TdHJpbmcoKWAgaW4gYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eS5cbiAgICBBcHBseS5wcm90b3R5cGUudG9NZW1vS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuX21lbW9LZXkpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX21lbW9LZXknLCB7IHZhbHVlOiB0aGlzLnRvU3RyaW5nKCkgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX21lbW9LZXk7XG4gICAgfTtcbiAgICByZXR1cm4gQXBwbHk7XG59KFBFeHByKSk7XG4vLyBVbmljb2RlIGNoYXJhY3RlclxudmFyIFVuaWNvZGVDaGFyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhVbmljb2RlQ2hhciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBVbmljb2RlQ2hhcihjYXRlZ29yeSkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgICAgICBfdGhpcy5wYXR0ZXJuID0gVW5pY29kZUNhdGVnb3JpZXNbY2F0ZWdvcnldO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBVbmljb2RlQ2hhcjtcbn0oUEV4cHIpKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZXhwb3J0cy5QRXhwciA9IFBFeHByO1xuZXhwb3J0cy5hbnkgPSBhbnk7XG5leHBvcnRzLmVuZCA9IGVuZDtcbmV4cG9ydHMuVGVybWluYWwgPSBUZXJtaW5hbDtcbmV4cG9ydHMuUmFuZ2UgPSBSYW5nZTtcbmV4cG9ydHMuUGFyYW0gPSBQYXJhbTtcbmV4cG9ydHMuQWx0ID0gQWx0O1xuZXhwb3J0cy5FeHRlbmQgPSBFeHRlbmQ7XG5leHBvcnRzLlNwbGljZSA9IFNwbGljZTtcbmV4cG9ydHMuU2VxID0gU2VxO1xuZXhwb3J0cy5JdGVyID0gSXRlcjtcbmV4cG9ydHMuU3RhciA9IFN0YXI7XG5leHBvcnRzLlBsdXMgPSBQbHVzO1xuZXhwb3J0cy5PcHQgPSBPcHQ7XG5leHBvcnRzLk5vdCA9IE5vdDtcbmV4cG9ydHMuTG9va2FoZWFkID0gTG9va2FoZWFkO1xuZXhwb3J0cy5MZXggPSBMZXg7XG5leHBvcnRzLkFwcGx5ID0gQXBwbHk7XG5leHBvcnRzLlVuaWNvZGVDaGFyID0gVW5pY29kZUNoYXI7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXh0ZW5zaW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnJlcXVpcmUoJy4vcGV4cHJzLWFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1ldmFsJyk7XG5yZXF1aXJlKCcuL3BleHBycy1nZW5lcmF0ZUV4YW1wbGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdldEFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1nZXROb2RlVHlwZXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLW91dHB1dFJlY2lwZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtaW50cm9kdWNlUGFyYW1zJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pc051bGxhYmxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1zdWJzdGl0dXRlUGFyYW1zJyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0FyZ3VtZW50TmFtZUxpc3QnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9GYWlsdXJlJyk7XG5yZXF1aXJlKCcuL3BleHBycy10b1N0cmluZycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gR2l2ZW4gYW4gYXJyYXkgb2YgbnVtYmVycyBgYXJyYCwgcmV0dXJuIGFuIGFycmF5IG9mIHRoZSBudW1iZXJzIGFzIHN0cmluZ3MsXG4vLyByaWdodC1qdXN0aWZpZWQgYW5kIHBhZGRlZCB0byB0aGUgc2FtZSBsZW5ndGguXG5mdW5jdGlvbiBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChhcnIpIHtcbiAgICB2YXIgbWF4TGVuID0gMDtcbiAgICB2YXIgc3RyaW5ncyA9IGFyci5tYXAoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgdmFyIHN0ciA9IG4udG9TdHJpbmcoKTtcbiAgICAgICAgbWF4TGVuID0gTWF0aC5tYXgobWF4TGVuLCBzdHIubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9KTtcbiAgICByZXR1cm4gc3RyaW5ncy5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIGNvbW1vbi5wYWRMZWZ0KHMsIG1heExlbik7IH0pO1xufVxuLy8gUHJvZHVjZSBhIG5ldyBzdHJpbmcgdGhhdCB3b3VsZCBiZSB0aGUgcmVzdWx0IG9mIGNvcHlpbmcgdGhlIGNvbnRlbnRzXG4vLyBvZiB0aGUgc3RyaW5nIGBzcmNgIG9udG8gYGRlc3RgIGF0IG9mZnNldCBgb2ZmZXN0YC5cbmZ1bmN0aW9uIHN0cmNweShkZXN0LCBzcmMsIG9mZnNldCkge1xuICAgIHZhciBvcmlnRGVzdExlbiA9IGRlc3QubGVuZ3RoO1xuICAgIHZhciBzdGFydCA9IGRlc3Quc2xpY2UoMCwgb2Zmc2V0KTtcbiAgICB2YXIgZW5kID0gZGVzdC5zbGljZShvZmZzZXQgKyBzcmMubGVuZ3RoKTtcbiAgICByZXR1cm4gKHN0YXJ0ICsgc3JjICsgZW5kKS5zdWJzdHIoMCwgb3JpZ0Rlc3RMZW4pO1xufVxuLy8gQ2FzdHMgdGhlIHVuZGVybHlpbmcgbGluZUFuZENvbCBvYmplY3QgdG8gYSBmb3JtYXR0ZWQgbWVzc2FnZSBzdHJpbmcsXG4vLyBoaWdobGlnaHRpbmcgYHJhbmdlc2AuXG5mdW5jdGlvbiBsaW5lQW5kQ29sdW1uVG9NZXNzYWdlKCkge1xuICAgIHZhciByYW5nZXMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICByYW5nZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdmFyIGxpbmVBbmRDb2wgPSB0aGlzO1xuICAgIHZhciBvZmZzZXQgPSBsaW5lQW5kQ29sLm9mZnNldDtcbiAgICB2YXIgcmVwZWF0U3RyID0gY29tbW9uLnJlcGVhdFN0cjtcbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHNiLmFwcGVuZCgnTGluZSAnICsgbGluZUFuZENvbC5saW5lTnVtICsgJywgY29sICcgKyBsaW5lQW5kQ29sLmNvbE51bSArICc6XFxuJyk7XG4gICAgLy8gQW4gYXJyYXkgb2YgdGhlIHByZXZpb3VzLCBjdXJyZW50LCBhbmQgbmV4dCBsaW5lIG51bWJlcnMgYXMgc3RyaW5ncyBvZiBlcXVhbCBsZW5ndGguXG4gICAgdmFyIGxpbmVOdW1iZXJzID0gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoW1xuICAgICAgICBsaW5lQW5kQ29sLnByZXZMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtIC0gMSxcbiAgICAgICAgbGluZUFuZENvbC5saW5lTnVtLFxuICAgICAgICBsaW5lQW5kQ29sLm5leHRMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtICsgMVxuICAgIF0pO1xuICAgIC8vIEhlbHBlciBmb3IgYXBwZW5kaW5nIGZvcm1hdHRpbmcgaW5wdXQgbGluZXMgdG8gdGhlIGJ1ZmZlci5cbiAgICB2YXIgYXBwZW5kTGluZSA9IGZ1bmN0aW9uIChudW0sIGNvbnRlbnQsIHByZWZpeCkge1xuICAgICAgICBzYi5hcHBlbmQocHJlZml4ICsgbGluZU51bWJlcnNbbnVtXSArICcgfCAnICsgY29udGVudCArICdcXG4nKTtcbiAgICB9O1xuICAgIC8vIEluY2x1ZGUgdGhlIHByZXZpb3VzIGxpbmUgZm9yIGNvbnRleHQgaWYgcG9zc2libGUuXG4gICAgaWYgKGxpbmVBbmRDb2wucHJldkxpbmUgIT0gbnVsbCkge1xuICAgICAgICBhcHBlbmRMaW5lKDAsIGxpbmVBbmRDb2wucHJldkxpbmUsICcgICcpO1xuICAgIH1cbiAgICAvLyBMaW5lIHRoYXQgdGhlIGVycm9yIG9jY3VycmVkIG9uLlxuICAgIGFwcGVuZExpbmUoMSwgbGluZUFuZENvbC5saW5lLCAnPiAnKTtcbiAgICAvLyBCdWlsZCB1cCB0aGUgbGluZSB0aGF0IHBvaW50cyB0byB0aGUgb2Zmc2V0IGFuZCBwb3NzaWJsZSBpbmRpY2F0ZXMgb25lIG9yIG1vcmUgcmFuZ2VzLlxuICAgIC8vIFN0YXJ0IHdpdGggYSBibGFuayBsaW5lLCBhbmQgaW5kaWNhdGUgZWFjaCByYW5nZSBieSBvdmVybGF5aW5nIGEgc3RyaW5nIG9mIGB+YCBjaGFycy5cbiAgICB2YXIgbGluZUxlbiA9IGxpbmVBbmRDb2wubGluZS5sZW5ndGg7XG4gICAgdmFyIGluZGljYXRpb25MaW5lID0gcmVwZWF0U3RyKCcgJywgbGluZUxlbiArIDEpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmFuZ2VzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHZhciBzdGFydElkeCA9IHJhbmdlc1tpXVswXTtcbiAgICAgICAgdmFyIGVuZElkeCA9IHJhbmdlc1tpXVsxXTtcbiAgICAgICAgY29tbW9uLmFzc2VydChzdGFydElkeCA+PSAwICYmIHN0YXJ0SWR4IDw9IGVuZElkeCwgJ3JhbmdlIHN0YXJ0IG11c3QgYmUgPj0gMCBhbmQgPD0gZW5kJyk7XG4gICAgICAgIHZhciBsaW5lU3RhcnRPZmZzZXQgPSBvZmZzZXQgLSBsaW5lQW5kQ29sLmNvbE51bSArIDE7XG4gICAgICAgIHN0YXJ0SWR4ID0gTWF0aC5tYXgoMCwgc3RhcnRJZHggLSBsaW5lU3RhcnRPZmZzZXQpO1xuICAgICAgICBlbmRJZHggPSBNYXRoLm1pbihlbmRJZHggLSBsaW5lU3RhcnRPZmZzZXQsIGxpbmVMZW4pO1xuICAgICAgICBpbmRpY2F0aW9uTGluZSA9IHN0cmNweShpbmRpY2F0aW9uTGluZSwgcmVwZWF0U3RyKCd+JywgZW5kSWR4IC0gc3RhcnRJZHgpLCBzdGFydElkeCk7XG4gICAgfVxuICAgIHZhciBndXR0ZXJXaWR0aCA9IDIgKyBsaW5lTnVtYmVyc1sxXS5sZW5ndGggKyAzO1xuICAgIHNiLmFwcGVuZChyZXBlYXRTdHIoJyAnLCBndXR0ZXJXaWR0aCkpO1xuICAgIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCAnXicsIGxpbmVBbmRDb2wuY29sTnVtIC0gMSk7XG4gICAgc2IuYXBwZW5kKGluZGljYXRpb25MaW5lLnJlcGxhY2UoLyArJC8sICcnKSArICdcXG4nKTtcbiAgICAvLyBJbmNsdWRlIHRoZSBuZXh0IGxpbmUgZm9yIGNvbnRleHQgaWYgcG9zc2libGUuXG4gICAgaWYgKGxpbmVBbmRDb2wubmV4dExpbmUgIT0gbnVsbCkge1xuICAgICAgICBhcHBlbmRMaW5lKDIsIGxpbmVBbmRDb2wubmV4dExpbmUsICcgICcpO1xuICAgIH1cbiAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGJ1aWx0SW5SdWxlc0NhbGxiYWNrcyA9IFtdO1xuLy8gU2luY2UgR3JhbW1hci5CdWlsdEluUnVsZXMgaXMgYm9vdHN0cmFwcGVkLCBtb3N0IG9mIE9obSBjYW4ndCBkaXJlY3RseSBkZXBlbmQgaXQuXG4vLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyBtb2R1bGVzIHRoYXQgZG8gZGVwZW5kIG9uIHRoZSBidWlsdC1pbiBydWxlcyB0byByZWdpc3RlciBhIGNhbGxiYWNrXG4vLyB0aGF0IHdpbGwgYmUgY2FsbGVkIGxhdGVyIGluIHRoZSBpbml0aWFsaXphdGlvbiBwcm9jZXNzLlxuZXhwb3J0cy5hd2FpdEJ1aWx0SW5SdWxlcyA9IGZ1bmN0aW9uIChjYikge1xuICAgIGJ1aWx0SW5SdWxlc0NhbGxiYWNrcy5wdXNoKGNiKTtcbn07XG5leHBvcnRzLmFubm91bmNlQnVpbHRJblJ1bGVzID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICBidWlsdEluUnVsZXNDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgY2IoZ3JhbW1hcik7XG4gICAgfSk7XG4gICAgYnVpbHRJblJ1bGVzQ2FsbGJhY2tzID0gbnVsbDtcbn07XG4vLyBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdpdmVuXG4vLyBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW4gPSBmdW5jdGlvbiAoc3RyLCBvZmZzZXQpIHtcbiAgICB2YXIgbGluZU51bSA9IDE7XG4gICAgdmFyIGNvbE51bSA9IDE7XG4gICAgdmFyIGN1cnJPZmZzZXQgPSAwO1xuICAgIHZhciBsaW5lU3RhcnRPZmZzZXQgPSAwO1xuICAgIHZhciBuZXh0TGluZSA9IG51bGw7XG4gICAgdmFyIHByZXZMaW5lID0gbnVsbDtcbiAgICB2YXIgcHJldkxpbmVTdGFydE9mZnNldCA9IC0xO1xuICAgIHdoaWxlIChjdXJyT2Zmc2V0IDwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJBdChjdXJyT2Zmc2V0KyspO1xuICAgICAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGxpbmVOdW0rKztcbiAgICAgICAgICAgIGNvbE51bSA9IDE7XG4gICAgICAgICAgICBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gbGluZVN0YXJ0T2Zmc2V0O1xuICAgICAgICAgICAgbGluZVN0YXJ0T2Zmc2V0ID0gY3Vyck9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjICE9PSAnXFxyJykge1xuICAgICAgICAgICAgY29sTnVtKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRmluZCB0aGUgZW5kIG9mIHRoZSB0YXJnZXQgbGluZS5cbiAgICB2YXIgbGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lU3RhcnRPZmZzZXQpO1xuICAgIGlmIChsaW5lRW5kT2Zmc2V0ID09PSAtMSkge1xuICAgICAgICBsaW5lRW5kT2Zmc2V0ID0gc3RyLmxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBsaW5lLlxuICAgICAgICB2YXIgbmV4dExpbmVFbmRPZmZzZXQgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZUVuZE9mZnNldCArIDEpO1xuICAgICAgICBuZXh0TGluZSA9XG4gICAgICAgICAgICBuZXh0TGluZUVuZE9mZnNldCA9PT0gLTFcbiAgICAgICAgICAgICAgICA/IHN0ci5zbGljZShsaW5lRW5kT2Zmc2V0KVxuICAgICAgICAgICAgICAgIDogc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQsIG5leHRMaW5lRW5kT2Zmc2V0KTtcbiAgICAgICAgLy8gU3RyaXAgbGVhZGluZyBhbmQgdHJhaWxpbmcgRU9MIGNoYXIocykuXG4gICAgICAgIG5leHRMaW5lID0gbmV4dExpbmUucmVwbGFjZSgvXlxccj9cXG4vLCAnJykucmVwbGFjZSgvXFxyJC8sICcnKTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSBwcmV2aW91cyBsaW5lLlxuICAgIGlmIChwcmV2TGluZVN0YXJ0T2Zmc2V0ID49IDApIHtcbiAgICAgICAgLy8gU3RyaXAgdHJhaWxpbmcgRU9MIGNoYXIocykuXG4gICAgICAgIHByZXZMaW5lID0gc3RyLnNsaWNlKHByZXZMaW5lU3RhcnRPZmZzZXQsIGxpbmVTdGFydE9mZnNldCkucmVwbGFjZSgvXFxyP1xcbiQvLCAnJyk7XG4gICAgfVxuICAgIC8vIEdldCB0aGUgdGFyZ2V0IGxpbmUsIHN0cmlwcGluZyBhIHRyYWlsaW5nIGNhcnJpYWdlIHJldHVybiBpZiBuZWNlc3NhcnkuXG4gICAgdmFyIGxpbmUgPSBzdHIuc2xpY2UobGluZVN0YXJ0T2Zmc2V0LCBsaW5lRW5kT2Zmc2V0KS5yZXBsYWNlKC9cXHIkLywgJycpO1xuICAgIHJldHVybiB7XG4gICAgICAgIG9mZnNldDogb2Zmc2V0LFxuICAgICAgICBsaW5lTnVtOiBsaW5lTnVtLFxuICAgICAgICBjb2xOdW06IGNvbE51bSxcbiAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgcHJldkxpbmU6IHByZXZMaW5lLFxuICAgICAgICBuZXh0TGluZTogbmV4dExpbmUsXG4gICAgICAgIHRvU3RyaW5nOiBsaW5lQW5kQ29sdW1uVG9NZXNzYWdlXG4gICAgfTtcbn07XG4vLyBSZXR1cm4gYSBuaWNlbHktZm9ybWF0dGVkIHN0cmluZyBkZXNjcmliaW5nIHRoZSBsaW5lIGFuZCBjb2x1bW4gZm9yIHRoZVxuLy8gZ2l2ZW4gb2Zmc2V0IGluIGBzdHJgIGhpZ2hsaWdodGluZyBgcmFuZ2VzYC5cbmV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UgPSBmdW5jdGlvbiAoc3RyLCBvZmZzZXQpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHJhbmdlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHJhbmdlc1tfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgcmV0dXJuIChfYSA9IGV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbihzdHIsIG9mZnNldCkpLnRvU3RyaW5nLmFwcGx5KF9hLCByYW5nZXMpO1xufTtcbmV4cG9ydHMudW5pcXVlSWQgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBpZENvdW50ZXIgPSAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJlZml4KSB7IHJldHVybiAnJyArIHByZWZpeCArIGlkQ291bnRlcisrOyB9O1xufSkoKTtcbiIsIi8qIGdsb2JhbCBfX0dMT0JBTF9PSE1fVkVSU0lPTl9fICovXG4ndXNlIHN0cmljdCc7XG4vLyBXaGVuIHJ1bm5pbmcgdW5kZXIgTm9kZSwgcmVhZCB0aGUgdmVyc2lvbiBmcm9tIHBhY2thZ2UuanNvbi4gRm9yIHRoZSBicm93c2VyLFxuLy8gdXNlIGEgc3BlY2lhbCBnbG9iYWwgdmFyaWFibGUgZGVmaW5lZCBpbiB0aGUgYnVpbGQgcHJvY2VzcyAoc2VlIHdlYnBhY2suY29uZmlnLmpzKS5cbm1vZHVsZS5leHBvcnRzID1cbiAgICB0eXBlb2YgX19HTE9CQUxfT0hNX1ZFUlNJT05fXyA9PT0gJ3N0cmluZydcbiAgICAgICAgPyBfX0dMT0JBTF9PSE1fVkVSU0lPTl9fXG4gICAgICAgIDogcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjtcbiIsIi8vIEJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL3VuaWNvZGUtOS4wLjAuXG4vLyBUaGVzZSBhcmUganVzdCBjYXRlZ29yaWVzIHRoYXQgYXJlIHVzZWQgaW4gRVM1L0VTMjAxNS5cbi8vIFRoZSBmdWxsIGxpc3Qgb2YgVW5pY29kZSBjYXRlZ29yaWVzIGlzIGhlcmU6IGh0dHA6Ly93d3cuZmlsZWZvcm1hdC5pbmZvL2luZm8vdW5pY29kZS9jYXRlZ29yeS9pbmRleC5odG0uXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gTGV0dGVyc1xuICBMdTogL1tBLVpcXHhDMC1cXHhENlxceEQ4LVxceERFXFx1MDEwMFxcdTAxMDJcXHUwMTA0XFx1MDEwNlxcdTAxMDhcXHUwMTBBXFx1MDEwQ1xcdTAxMEVcXHUwMTEwXFx1MDExMlxcdTAxMTRcXHUwMTE2XFx1MDExOFxcdTAxMUFcXHUwMTFDXFx1MDExRVxcdTAxMjBcXHUwMTIyXFx1MDEyNFxcdTAxMjZcXHUwMTI4XFx1MDEyQVxcdTAxMkNcXHUwMTJFXFx1MDEzMFxcdTAxMzJcXHUwMTM0XFx1MDEzNlxcdTAxMzlcXHUwMTNCXFx1MDEzRFxcdTAxM0ZcXHUwMTQxXFx1MDE0M1xcdTAxNDVcXHUwMTQ3XFx1MDE0QVxcdTAxNENcXHUwMTRFXFx1MDE1MFxcdTAxNTJcXHUwMTU0XFx1MDE1NlxcdTAxNThcXHUwMTVBXFx1MDE1Q1xcdTAxNUVcXHUwMTYwXFx1MDE2MlxcdTAxNjRcXHUwMTY2XFx1MDE2OFxcdTAxNkFcXHUwMTZDXFx1MDE2RVxcdTAxNzBcXHUwMTcyXFx1MDE3NFxcdTAxNzZcXHUwMTc4XFx1MDE3OVxcdTAxN0JcXHUwMTdEXFx1MDE4MVxcdTAxODJcXHUwMTg0XFx1MDE4NlxcdTAxODdcXHUwMTg5LVxcdTAxOEJcXHUwMThFLVxcdTAxOTFcXHUwMTkzXFx1MDE5NFxcdTAxOTYtXFx1MDE5OFxcdTAxOUNcXHUwMTlEXFx1MDE5RlxcdTAxQTBcXHUwMUEyXFx1MDFBNFxcdTAxQTZcXHUwMUE3XFx1MDFBOVxcdTAxQUNcXHUwMUFFXFx1MDFBRlxcdTAxQjEtXFx1MDFCM1xcdTAxQjVcXHUwMUI3XFx1MDFCOFxcdTAxQkNcXHUwMUM0XFx1MDFDN1xcdTAxQ0FcXHUwMUNEXFx1MDFDRlxcdTAxRDFcXHUwMUQzXFx1MDFENVxcdTAxRDdcXHUwMUQ5XFx1MDFEQlxcdTAxREVcXHUwMUUwXFx1MDFFMlxcdTAxRTRcXHUwMUU2XFx1MDFFOFxcdTAxRUFcXHUwMUVDXFx1MDFFRVxcdTAxRjFcXHUwMUY0XFx1MDFGNi1cXHUwMUY4XFx1MDFGQVxcdTAxRkNcXHUwMUZFXFx1MDIwMFxcdTAyMDJcXHUwMjA0XFx1MDIwNlxcdTAyMDhcXHUwMjBBXFx1MDIwQ1xcdTAyMEVcXHUwMjEwXFx1MDIxMlxcdTAyMTRcXHUwMjE2XFx1MDIxOFxcdTAyMUFcXHUwMjFDXFx1MDIxRVxcdTAyMjBcXHUwMjIyXFx1MDIyNFxcdTAyMjZcXHUwMjI4XFx1MDIyQVxcdTAyMkNcXHUwMjJFXFx1MDIzMFxcdTAyMzJcXHUwMjNBXFx1MDIzQlxcdTAyM0RcXHUwMjNFXFx1MDI0MVxcdTAyNDMtXFx1MDI0NlxcdTAyNDhcXHUwMjRBXFx1MDI0Q1xcdTAyNEVcXHUwMzcwXFx1MDM3MlxcdTAzNzZcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFXFx1MDM4RlxcdTAzOTEtXFx1MDNBMVxcdTAzQTMtXFx1MDNBQlxcdTAzQ0ZcXHUwM0QyLVxcdTAzRDRcXHUwM0Q4XFx1MDNEQVxcdTAzRENcXHUwM0RFXFx1MDNFMFxcdTAzRTJcXHUwM0U0XFx1MDNFNlxcdTAzRThcXHUwM0VBXFx1MDNFQ1xcdTAzRUVcXHUwM0Y0XFx1MDNGN1xcdTAzRjlcXHUwM0ZBXFx1MDNGRC1cXHUwNDJGXFx1MDQ2MFxcdTA0NjJcXHUwNDY0XFx1MDQ2NlxcdTA0NjhcXHUwNDZBXFx1MDQ2Q1xcdTA0NkVcXHUwNDcwXFx1MDQ3MlxcdTA0NzRcXHUwNDc2XFx1MDQ3OFxcdTA0N0FcXHUwNDdDXFx1MDQ3RVxcdTA0ODBcXHUwNDhBXFx1MDQ4Q1xcdTA0OEVcXHUwNDkwXFx1MDQ5MlxcdTA0OTRcXHUwNDk2XFx1MDQ5OFxcdTA0OUFcXHUwNDlDXFx1MDQ5RVxcdTA0QTBcXHUwNEEyXFx1MDRBNFxcdTA0QTZcXHUwNEE4XFx1MDRBQVxcdTA0QUNcXHUwNEFFXFx1MDRCMFxcdTA0QjJcXHUwNEI0XFx1MDRCNlxcdTA0QjhcXHUwNEJBXFx1MDRCQ1xcdTA0QkVcXHUwNEMwXFx1MDRDMVxcdTA0QzNcXHUwNEM1XFx1MDRDN1xcdTA0QzlcXHUwNENCXFx1MDRDRFxcdTA0RDBcXHUwNEQyXFx1MDRENFxcdTA0RDZcXHUwNEQ4XFx1MDREQVxcdTA0RENcXHUwNERFXFx1MDRFMFxcdTA0RTJcXHUwNEU0XFx1MDRFNlxcdTA0RThcXHUwNEVBXFx1MDRFQ1xcdTA0RUVcXHUwNEYwXFx1MDRGMlxcdTA0RjRcXHUwNEY2XFx1MDRGOFxcdTA0RkFcXHUwNEZDXFx1MDRGRVxcdTA1MDBcXHUwNTAyXFx1MDUwNFxcdTA1MDZcXHUwNTA4XFx1MDUwQVxcdTA1MENcXHUwNTBFXFx1MDUxMFxcdTA1MTJcXHUwNTE0XFx1MDUxNlxcdTA1MThcXHUwNTFBXFx1MDUxQ1xcdTA1MUVcXHUwNTIwXFx1MDUyMlxcdTA1MjRcXHUwNTI2XFx1MDUyOFxcdTA1MkFcXHUwNTJDXFx1MDUyRVxcdTA1MzEtXFx1MDU1NlxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTNBMC1cXHUxM0Y1XFx1MUUwMFxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTFFMDhcXHUxRTBBXFx1MUUwQ1xcdTFFMEVcXHUxRTEwXFx1MUUxMlxcdTFFMTRcXHUxRTE2XFx1MUUxOFxcdTFFMUFcXHUxRTFDXFx1MUUxRVxcdTFFMjBcXHUxRTIyXFx1MUUyNFxcdTFFMjZcXHUxRTI4XFx1MUUyQVxcdTFFMkNcXHUxRTJFXFx1MUUzMFxcdTFFMzJcXHUxRTM0XFx1MUUzNlxcdTFFMzhcXHUxRTNBXFx1MUUzQ1xcdTFFM0VcXHUxRTQwXFx1MUU0MlxcdTFFNDRcXHUxRTQ2XFx1MUU0OFxcdTFFNEFcXHUxRTRDXFx1MUU0RVxcdTFFNTBcXHUxRTUyXFx1MUU1NFxcdTFFNTZcXHUxRTU4XFx1MUU1QVxcdTFFNUNcXHUxRTVFXFx1MUU2MFxcdTFFNjJcXHUxRTY0XFx1MUU2NlxcdTFFNjhcXHUxRTZBXFx1MUU2Q1xcdTFFNkVcXHUxRTcwXFx1MUU3MlxcdTFFNzRcXHUxRTc2XFx1MUU3OFxcdTFFN0FcXHUxRTdDXFx1MUU3RVxcdTFFODBcXHUxRTgyXFx1MUU4NFxcdTFFODZcXHUxRTg4XFx1MUU4QVxcdTFFOENcXHUxRThFXFx1MUU5MFxcdTFFOTJcXHUxRTk0XFx1MUU5RVxcdTFFQTBcXHUxRUEyXFx1MUVBNFxcdTFFQTZcXHUxRUE4XFx1MUVBQVxcdTFFQUNcXHUxRUFFXFx1MUVCMFxcdTFFQjJcXHUxRUI0XFx1MUVCNlxcdTFFQjhcXHUxRUJBXFx1MUVCQ1xcdTFFQkVcXHUxRUMwXFx1MUVDMlxcdTFFQzRcXHUxRUM2XFx1MUVDOFxcdTFFQ0FcXHUxRUNDXFx1MUVDRVxcdTFFRDBcXHUxRUQyXFx1MUVENFxcdTFFRDZcXHUxRUQ4XFx1MUVEQVxcdTFFRENcXHUxRURFXFx1MUVFMFxcdTFFRTJcXHUxRUU0XFx1MUVFNlxcdTFFRThcXHUxRUVBXFx1MUVFQ1xcdTFFRUVcXHUxRUYwXFx1MUVGMlxcdTFFRjRcXHUxRUY2XFx1MUVGOFxcdTFFRkFcXHUxRUZDXFx1MUVGRVxcdTFGMDgtXFx1MUYwRlxcdTFGMTgtXFx1MUYxRFxcdTFGMjgtXFx1MUYyRlxcdTFGMzgtXFx1MUYzRlxcdTFGNDgtXFx1MUY0RFxcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUZcXHUxRjY4LVxcdTFGNkZcXHUxRkI4LVxcdTFGQkJcXHUxRkM4LVxcdTFGQ0JcXHUxRkQ4LVxcdTFGREJcXHUxRkU4LVxcdTFGRUNcXHUxRkY4LVxcdTFGRkJcXHUyMTAyXFx1MjEwN1xcdTIxMEItXFx1MjEwRFxcdTIxMTAtXFx1MjExMlxcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTMwLVxcdTIxMzNcXHUyMTNFXFx1MjEzRlxcdTIxNDVcXHUyMTgzXFx1MkMwMC1cXHUyQzJFXFx1MkM2MFxcdTJDNjItXFx1MkM2NFxcdTJDNjdcXHUyQzY5XFx1MkM2QlxcdTJDNkQtXFx1MkM3MFxcdTJDNzJcXHUyQzc1XFx1MkM3RS1cXHUyQzgwXFx1MkM4MlxcdTJDODRcXHUyQzg2XFx1MkM4OFxcdTJDOEFcXHUyQzhDXFx1MkM4RVxcdTJDOTBcXHUyQzkyXFx1MkM5NFxcdTJDOTZcXHUyQzk4XFx1MkM5QVxcdTJDOUNcXHUyQzlFXFx1MkNBMFxcdTJDQTJcXHUyQ0E0XFx1MkNBNlxcdTJDQThcXHUyQ0FBXFx1MkNBQ1xcdTJDQUVcXHUyQ0IwXFx1MkNCMlxcdTJDQjRcXHUyQ0I2XFx1MkNCOFxcdTJDQkFcXHUyQ0JDXFx1MkNCRVxcdTJDQzBcXHUyQ0MyXFx1MkNDNFxcdTJDQzZcXHUyQ0M4XFx1MkNDQVxcdTJDQ0NcXHUyQ0NFXFx1MkNEMFxcdTJDRDJcXHUyQ0Q0XFx1MkNENlxcdTJDRDhcXHUyQ0RBXFx1MkNEQ1xcdTJDREVcXHUyQ0UwXFx1MkNFMlxcdTJDRUJcXHUyQ0VEXFx1MkNGMlxcdUE2NDBcXHVBNjQyXFx1QTY0NFxcdUE2NDZcXHVBNjQ4XFx1QTY0QVxcdUE2NENcXHVBNjRFXFx1QTY1MFxcdUE2NTJcXHVBNjU0XFx1QTY1NlxcdUE2NThcXHVBNjVBXFx1QTY1Q1xcdUE2NUVcXHVBNjYwXFx1QTY2MlxcdUE2NjRcXHVBNjY2XFx1QTY2OFxcdUE2NkFcXHVBNjZDXFx1QTY4MFxcdUE2ODJcXHVBNjg0XFx1QTY4NlxcdUE2ODhcXHVBNjhBXFx1QTY4Q1xcdUE2OEVcXHVBNjkwXFx1QTY5MlxcdUE2OTRcXHVBNjk2XFx1QTY5OFxcdUE2OUFcXHVBNzIyXFx1QTcyNFxcdUE3MjZcXHVBNzI4XFx1QTcyQVxcdUE3MkNcXHVBNzJFXFx1QTczMlxcdUE3MzRcXHVBNzM2XFx1QTczOFxcdUE3M0FcXHVBNzNDXFx1QTczRVxcdUE3NDBcXHVBNzQyXFx1QTc0NFxcdUE3NDZcXHVBNzQ4XFx1QTc0QVxcdUE3NENcXHVBNzRFXFx1QTc1MFxcdUE3NTJcXHVBNzU0XFx1QTc1NlxcdUE3NThcXHVBNzVBXFx1QTc1Q1xcdUE3NUVcXHVBNzYwXFx1QTc2MlxcdUE3NjRcXHVBNzY2XFx1QTc2OFxcdUE3NkFcXHVBNzZDXFx1QTc2RVxcdUE3NzlcXHVBNzdCXFx1QTc3RFxcdUE3N0VcXHVBNzgwXFx1QTc4MlxcdUE3ODRcXHVBNzg2XFx1QTc4QlxcdUE3OERcXHVBNzkwXFx1QTc5MlxcdUE3OTZcXHVBNzk4XFx1QTc5QVxcdUE3OUNcXHVBNzlFXFx1QTdBMFxcdUE3QTJcXHVBN0E0XFx1QTdBNlxcdUE3QThcXHVBN0FBLVxcdUE3QUVcXHVBN0IwLVxcdUE3QjRcXHVBN0I2XFx1RkYyMS1cXHVGRjNBXXxcXHVEODAxW1xcdURDMDAtXFx1REMyN1xcdURDQjAtXFx1RENEM118XFx1RDgwM1tcXHVEQzgwLVxcdURDQjJdfFxcdUQ4MDZbXFx1RENBMC1cXHVEQ0JGXXxcXHVEODM1W1xcdURDMDAtXFx1REMxOVxcdURDMzQtXFx1REM0RFxcdURDNjgtXFx1REM4MVxcdURDOUNcXHVEQzlFXFx1REM5RlxcdURDQTJcXHVEQ0E1XFx1RENBNlxcdURDQTktXFx1RENBQ1xcdURDQUUtXFx1RENCNVxcdURDRDAtXFx1RENFOVxcdUREMDRcXHVERDA1XFx1REQwNy1cXHVERDBBXFx1REQwRC1cXHVERDE0XFx1REQxNi1cXHVERDFDXFx1REQzOFxcdUREMzlcXHVERDNCLVxcdUREM0VcXHVERDQwLVxcdURENDRcXHVERDQ2XFx1REQ0QS1cXHVERDUwXFx1REQ2Qy1cXHVERDg1XFx1RERBMC1cXHVEREI5XFx1RERENC1cXHVEREVEXFx1REUwOC1cXHVERTIxXFx1REUzQy1cXHVERTU1XFx1REU3MC1cXHVERTg5XFx1REVBOC1cXHVERUMwXFx1REVFMi1cXHVERUZBXFx1REYxQy1cXHVERjM0XFx1REY1Ni1cXHVERjZFXFx1REY5MC1cXHVERkE4XFx1REZDQV18XFx1RDgzQVtcXHVERDAwLVxcdUREMjFdLyxcbiAgTGw6IC9bYS16XFx4QjVcXHhERi1cXHhGNlxceEY4LVxceEZGXFx1MDEwMVxcdTAxMDNcXHUwMTA1XFx1MDEwN1xcdTAxMDlcXHUwMTBCXFx1MDEwRFxcdTAxMEZcXHUwMTExXFx1MDExM1xcdTAxMTVcXHUwMTE3XFx1MDExOVxcdTAxMUJcXHUwMTFEXFx1MDExRlxcdTAxMjFcXHUwMTIzXFx1MDEyNVxcdTAxMjdcXHUwMTI5XFx1MDEyQlxcdTAxMkRcXHUwMTJGXFx1MDEzMVxcdTAxMzNcXHUwMTM1XFx1MDEzN1xcdTAxMzhcXHUwMTNBXFx1MDEzQ1xcdTAxM0VcXHUwMTQwXFx1MDE0MlxcdTAxNDRcXHUwMTQ2XFx1MDE0OFxcdTAxNDlcXHUwMTRCXFx1MDE0RFxcdTAxNEZcXHUwMTUxXFx1MDE1M1xcdTAxNTVcXHUwMTU3XFx1MDE1OVxcdTAxNUJcXHUwMTVEXFx1MDE1RlxcdTAxNjFcXHUwMTYzXFx1MDE2NVxcdTAxNjdcXHUwMTY5XFx1MDE2QlxcdTAxNkRcXHUwMTZGXFx1MDE3MVxcdTAxNzNcXHUwMTc1XFx1MDE3N1xcdTAxN0FcXHUwMTdDXFx1MDE3RS1cXHUwMTgwXFx1MDE4M1xcdTAxODVcXHUwMTg4XFx1MDE4Q1xcdTAxOERcXHUwMTkyXFx1MDE5NVxcdTAxOTktXFx1MDE5QlxcdTAxOUVcXHUwMUExXFx1MDFBM1xcdTAxQTVcXHUwMUE4XFx1MDFBQVxcdTAxQUJcXHUwMUFEXFx1MDFCMFxcdTAxQjRcXHUwMUI2XFx1MDFCOVxcdTAxQkFcXHUwMUJELVxcdTAxQkZcXHUwMUM2XFx1MDFDOVxcdTAxQ0NcXHUwMUNFXFx1MDFEMFxcdTAxRDJcXHUwMUQ0XFx1MDFENlxcdTAxRDhcXHUwMURBXFx1MDFEQ1xcdTAxRERcXHUwMURGXFx1MDFFMVxcdTAxRTNcXHUwMUU1XFx1MDFFN1xcdTAxRTlcXHUwMUVCXFx1MDFFRFxcdTAxRUZcXHUwMUYwXFx1MDFGM1xcdTAxRjVcXHUwMUY5XFx1MDFGQlxcdTAxRkRcXHUwMUZGXFx1MDIwMVxcdTAyMDNcXHUwMjA1XFx1MDIwN1xcdTAyMDlcXHUwMjBCXFx1MDIwRFxcdTAyMEZcXHUwMjExXFx1MDIxM1xcdTAyMTVcXHUwMjE3XFx1MDIxOVxcdTAyMUJcXHUwMjFEXFx1MDIxRlxcdTAyMjFcXHUwMjIzXFx1MDIyNVxcdTAyMjdcXHUwMjI5XFx1MDIyQlxcdTAyMkRcXHUwMjJGXFx1MDIzMVxcdTAyMzMtXFx1MDIzOVxcdTAyM0NcXHUwMjNGXFx1MDI0MFxcdTAyNDJcXHUwMjQ3XFx1MDI0OVxcdTAyNEJcXHUwMjREXFx1MDI0Ri1cXHUwMjkzXFx1MDI5NS1cXHUwMkFGXFx1MDM3MVxcdTAzNzNcXHUwMzc3XFx1MDM3Qi1cXHUwMzdEXFx1MDM5MFxcdTAzQUMtXFx1MDNDRVxcdTAzRDBcXHUwM0QxXFx1MDNENS1cXHUwM0Q3XFx1MDNEOVxcdTAzREJcXHUwM0REXFx1MDNERlxcdTAzRTFcXHUwM0UzXFx1MDNFNVxcdTAzRTdcXHUwM0U5XFx1MDNFQlxcdTAzRURcXHUwM0VGLVxcdTAzRjNcXHUwM0Y1XFx1MDNGOFxcdTAzRkJcXHUwM0ZDXFx1MDQzMC1cXHUwNDVGXFx1MDQ2MVxcdTA0NjNcXHUwNDY1XFx1MDQ2N1xcdTA0NjlcXHUwNDZCXFx1MDQ2RFxcdTA0NkZcXHUwNDcxXFx1MDQ3M1xcdTA0NzVcXHUwNDc3XFx1MDQ3OVxcdTA0N0JcXHUwNDdEXFx1MDQ3RlxcdTA0ODFcXHUwNDhCXFx1MDQ4RFxcdTA0OEZcXHUwNDkxXFx1MDQ5M1xcdTA0OTVcXHUwNDk3XFx1MDQ5OVxcdTA0OUJcXHUwNDlEXFx1MDQ5RlxcdTA0QTFcXHUwNEEzXFx1MDRBNVxcdTA0QTdcXHUwNEE5XFx1MDRBQlxcdTA0QURcXHUwNEFGXFx1MDRCMVxcdTA0QjNcXHUwNEI1XFx1MDRCN1xcdTA0QjlcXHUwNEJCXFx1MDRCRFxcdTA0QkZcXHUwNEMyXFx1MDRDNFxcdTA0QzZcXHUwNEM4XFx1MDRDQVxcdTA0Q0NcXHUwNENFXFx1MDRDRlxcdTA0RDFcXHUwNEQzXFx1MDRENVxcdTA0RDdcXHUwNEQ5XFx1MDREQlxcdTA0RERcXHUwNERGXFx1MDRFMVxcdTA0RTNcXHUwNEU1XFx1MDRFN1xcdTA0RTlcXHUwNEVCXFx1MDRFRFxcdTA0RUZcXHUwNEYxXFx1MDRGM1xcdTA0RjVcXHUwNEY3XFx1MDRGOVxcdTA0RkJcXHUwNEZEXFx1MDRGRlxcdTA1MDFcXHUwNTAzXFx1MDUwNVxcdTA1MDdcXHUwNTA5XFx1MDUwQlxcdTA1MERcXHUwNTBGXFx1MDUxMVxcdTA1MTNcXHUwNTE1XFx1MDUxN1xcdTA1MTlcXHUwNTFCXFx1MDUxRFxcdTA1MUZcXHUwNTIxXFx1MDUyM1xcdTA1MjVcXHUwNTI3XFx1MDUyOVxcdTA1MkJcXHUwNTJEXFx1MDUyRlxcdTA1NjEtXFx1MDU4N1xcdTEzRjgtXFx1MTNGRFxcdTFDODAtXFx1MUM4OFxcdTFEMDAtXFx1MUQyQlxcdTFENkItXFx1MUQ3N1xcdTFENzktXFx1MUQ5QVxcdTFFMDFcXHUxRTAzXFx1MUUwNVxcdTFFMDdcXHUxRTA5XFx1MUUwQlxcdTFFMERcXHUxRTBGXFx1MUUxMVxcdTFFMTNcXHUxRTE1XFx1MUUxN1xcdTFFMTlcXHUxRTFCXFx1MUUxRFxcdTFFMUZcXHUxRTIxXFx1MUUyM1xcdTFFMjVcXHUxRTI3XFx1MUUyOVxcdTFFMkJcXHUxRTJEXFx1MUUyRlxcdTFFMzFcXHUxRTMzXFx1MUUzNVxcdTFFMzdcXHUxRTM5XFx1MUUzQlxcdTFFM0RcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUxRTQ1XFx1MUU0N1xcdTFFNDlcXHUxRTRCXFx1MUU0RFxcdTFFNEZcXHUxRTUxXFx1MUU1M1xcdTFFNTVcXHUxRTU3XFx1MUU1OVxcdTFFNUJcXHUxRTVEXFx1MUU1RlxcdTFFNjFcXHUxRTYzXFx1MUU2NVxcdTFFNjdcXHUxRTY5XFx1MUU2QlxcdTFFNkRcXHUxRTZGXFx1MUU3MVxcdTFFNzNcXHUxRTc1XFx1MUU3N1xcdTFFNzlcXHUxRTdCXFx1MUU3RFxcdTFFN0ZcXHUxRTgxXFx1MUU4M1xcdTFFODVcXHUxRTg3XFx1MUU4OVxcdTFFOEJcXHUxRThEXFx1MUU4RlxcdTFFOTFcXHUxRTkzXFx1MUU5NS1cXHUxRTlEXFx1MUU5RlxcdTFFQTFcXHUxRUEzXFx1MUVBNVxcdTFFQTdcXHUxRUE5XFx1MUVBQlxcdTFFQURcXHUxRUFGXFx1MUVCMVxcdTFFQjNcXHUxRUI1XFx1MUVCN1xcdTFFQjlcXHUxRUJCXFx1MUVCRFxcdTFFQkZcXHUxRUMxXFx1MUVDM1xcdTFFQzVcXHUxRUM3XFx1MUVDOVxcdTFFQ0JcXHUxRUNEXFx1MUVDRlxcdTFFRDFcXHUxRUQzXFx1MUVENVxcdTFFRDdcXHUxRUQ5XFx1MUVEQlxcdTFFRERcXHUxRURGXFx1MUVFMVxcdTFFRTNcXHUxRUU1XFx1MUVFN1xcdTFFRTlcXHUxRUVCXFx1MUVFRFxcdTFFRUZcXHUxRUYxXFx1MUVGM1xcdTFFRjVcXHUxRUY3XFx1MUVGOVxcdTFFRkJcXHUxRUZEXFx1MUVGRi1cXHUxRjA3XFx1MUYxMC1cXHUxRjE1XFx1MUYyMC1cXHUxRjI3XFx1MUYzMC1cXHUxRjM3XFx1MUY0MC1cXHUxRjQ1XFx1MUY1MC1cXHUxRjU3XFx1MUY2MC1cXHUxRjY3XFx1MUY3MC1cXHUxRjdEXFx1MUY4MC1cXHUxRjg3XFx1MUY5MC1cXHUxRjk3XFx1MUZBMC1cXHUxRkE3XFx1MUZCMC1cXHUxRkI0XFx1MUZCNlxcdTFGQjdcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNlxcdTFGQzdcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2XFx1MUZEN1xcdTFGRTAtXFx1MUZFN1xcdTFGRjItXFx1MUZGNFxcdTFGRjZcXHUxRkY3XFx1MjEwQVxcdTIxMEVcXHUyMTBGXFx1MjExM1xcdTIxMkZcXHUyMTM0XFx1MjEzOVxcdTIxM0NcXHUyMTNEXFx1MjE0Ni1cXHUyMTQ5XFx1MjE0RVxcdTIxODRcXHUyQzMwLVxcdTJDNUVcXHUyQzYxXFx1MkM2NVxcdTJDNjZcXHUyQzY4XFx1MkM2QVxcdTJDNkNcXHUyQzcxXFx1MkM3M1xcdTJDNzRcXHUyQzc2LVxcdTJDN0JcXHUyQzgxXFx1MkM4M1xcdTJDODVcXHUyQzg3XFx1MkM4OVxcdTJDOEJcXHUyQzhEXFx1MkM4RlxcdTJDOTFcXHUyQzkzXFx1MkM5NVxcdTJDOTdcXHUyQzk5XFx1MkM5QlxcdTJDOURcXHUyQzlGXFx1MkNBMVxcdTJDQTNcXHUyQ0E1XFx1MkNBN1xcdTJDQTlcXHUyQ0FCXFx1MkNBRFxcdTJDQUZcXHUyQ0IxXFx1MkNCM1xcdTJDQjVcXHUyQ0I3XFx1MkNCOVxcdTJDQkJcXHUyQ0JEXFx1MkNCRlxcdTJDQzFcXHUyQ0MzXFx1MkNDNVxcdTJDQzdcXHUyQ0M5XFx1MkNDQlxcdTJDQ0RcXHUyQ0NGXFx1MkNEMVxcdTJDRDNcXHUyQ0Q1XFx1MkNEN1xcdTJDRDlcXHUyQ0RCXFx1MkNERFxcdTJDREZcXHUyQ0UxXFx1MkNFM1xcdTJDRTRcXHUyQ0VDXFx1MkNFRVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdUE2NDFcXHVBNjQzXFx1QTY0NVxcdUE2NDdcXHVBNjQ5XFx1QTY0QlxcdUE2NERcXHVBNjRGXFx1QTY1MVxcdUE2NTNcXHVBNjU1XFx1QTY1N1xcdUE2NTlcXHVBNjVCXFx1QTY1RFxcdUE2NUZcXHVBNjYxXFx1QTY2M1xcdUE2NjVcXHVBNjY3XFx1QTY2OVxcdUE2NkJcXHVBNjZEXFx1QTY4MVxcdUE2ODNcXHVBNjg1XFx1QTY4N1xcdUE2ODlcXHVBNjhCXFx1QTY4RFxcdUE2OEZcXHVBNjkxXFx1QTY5M1xcdUE2OTVcXHVBNjk3XFx1QTY5OVxcdUE2OUJcXHVBNzIzXFx1QTcyNVxcdUE3MjdcXHVBNzI5XFx1QTcyQlxcdUE3MkRcXHVBNzJGLVxcdUE3MzFcXHVBNzMzXFx1QTczNVxcdUE3MzdcXHVBNzM5XFx1QTczQlxcdUE3M0RcXHVBNzNGXFx1QTc0MVxcdUE3NDNcXHVBNzQ1XFx1QTc0N1xcdUE3NDlcXHVBNzRCXFx1QTc0RFxcdUE3NEZcXHVBNzUxXFx1QTc1M1xcdUE3NTVcXHVBNzU3XFx1QTc1OVxcdUE3NUJcXHVBNzVEXFx1QTc1RlxcdUE3NjFcXHVBNzYzXFx1QTc2NVxcdUE3NjdcXHVBNzY5XFx1QTc2QlxcdUE3NkRcXHVBNzZGXFx1QTc3MS1cXHVBNzc4XFx1QTc3QVxcdUE3N0NcXHVBNzdGXFx1QTc4MVxcdUE3ODNcXHVBNzg1XFx1QTc4N1xcdUE3OENcXHVBNzhFXFx1QTc5MVxcdUE3OTMtXFx1QTc5NVxcdUE3OTdcXHVBNzk5XFx1QTc5QlxcdUE3OURcXHVBNzlGXFx1QTdBMVxcdUE3QTNcXHVBN0E1XFx1QTdBN1xcdUE3QTlcXHVBN0I1XFx1QTdCN1xcdUE3RkFcXHVBQjMwLVxcdUFCNUFcXHVBQjYwLVxcdUFCNjVcXHVBQjcwLVxcdUFCQkZcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGRjQxLVxcdUZGNUFdfFxcdUQ4MDFbXFx1REMyOC1cXHVEQzRGXFx1RENEOC1cXHVEQ0ZCXXxcXHVEODAzW1xcdURDQzAtXFx1RENGMl18XFx1RDgwNltcXHVEQ0MwLVxcdURDREZdfFxcdUQ4MzVbXFx1REMxQS1cXHVEQzMzXFx1REM0RS1cXHVEQzU0XFx1REM1Ni1cXHVEQzY3XFx1REM4Mi1cXHVEQzlCXFx1RENCNi1cXHVEQ0I5XFx1RENCQlxcdURDQkQtXFx1RENDM1xcdURDQzUtXFx1RENDRlxcdURDRUEtXFx1REQwM1xcdUREMUUtXFx1REQzN1xcdURENTItXFx1REQ2QlxcdUREODYtXFx1REQ5RlxcdUREQkEtXFx1REREM1xcdURERUUtXFx1REUwN1xcdURFMjItXFx1REUzQlxcdURFNTYtXFx1REU2RlxcdURFOEEtXFx1REVBNVxcdURFQzItXFx1REVEQVxcdURFREMtXFx1REVFMVxcdURFRkMtXFx1REYxNFxcdURGMTYtXFx1REYxQlxcdURGMzYtXFx1REY0RVxcdURGNTAtXFx1REY1NVxcdURGNzAtXFx1REY4OFxcdURGOEEtXFx1REY4RlxcdURGQUEtXFx1REZDMlxcdURGQzQtXFx1REZDOVxcdURGQ0JdfFxcdUQ4M0FbXFx1REQyMi1cXHVERDQzXS8sXG4gIEx0OiAvW1xcdTAxQzVcXHUwMUM4XFx1MDFDQlxcdTAxRjJcXHUxRjg4LVxcdTFGOEZcXHUxRjk4LVxcdTFGOUZcXHUxRkE4LVxcdTFGQUZcXHUxRkJDXFx1MUZDQ1xcdTFGRkNdLyxcbiAgTG06IC9bXFx1MDJCMC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzc0XFx1MDM3QVxcdTA1NTlcXHUwNjQwXFx1MDZFNVxcdTA2RTZcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwOTcxXFx1MEU0NlxcdTBFQzZcXHUxMEZDXFx1MTdEN1xcdTE4NDNcXHUxQUE3XFx1MUM3OC1cXHUxQzdEXFx1MUQyQy1cXHUxRDZBXFx1MUQ3OFxcdTFEOUItXFx1MURCRlxcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MkM3Q1xcdTJDN0RcXHUyRDZGXFx1MkUyRlxcdTMwMDVcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzA5RFxcdTMwOUVcXHUzMEZDLVxcdTMwRkVcXHVBMDE1XFx1QTRGOC1cXHVBNEZEXFx1QTYwQ1xcdUE2N0ZcXHVBNjlDXFx1QTY5RFxcdUE3MTctXFx1QTcxRlxcdUE3NzBcXHVBNzg4XFx1QTdGOFxcdUE3RjlcXHVBOUNGXFx1QTlFNlxcdUFBNzBcXHVBQUREXFx1QUFGM1xcdUFBRjRcXHVBQjVDLVxcdUFCNUZcXHVGRjcwXFx1RkY5RVxcdUZGOUZdfFxcdUQ4MUFbXFx1REY0MC1cXHVERjQzXXxcXHVEODFCW1xcdURGOTMtXFx1REY5RlxcdURGRTBdLyxcbiAgTG86IC9bXFx4QUFcXHhCQVxcdTAxQkJcXHUwMUMwLVxcdTAxQzNcXHUwMjk0XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjNGXFx1MDY0MS1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwODAwLVxcdTA4MTVcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzItXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NVxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBEMC1cXHUxMEZBXFx1MTBGRC1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0RDXFx1MTgyMC1cXHUxODQyXFx1MTg0NC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzc3XFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUyMTM1LVxcdTIxMzhcXHUyRDMwLVxcdTJENjdcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUzMDA2XFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBMDE0XFx1QTAxNi1cXHVBNDhDXFx1QTREMC1cXHVBNEY3XFx1QTUwMC1cXHVBNjBCXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjZFXFx1QTZBMC1cXHVBNkU1XFx1QTc4RlxcdUE3RjdcXHVBN0ZCLVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5RTAtXFx1QTlFNFxcdUE5RTctXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE2RlxcdUFBNzEtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREJcXHVBQURDXFx1QUFFMC1cXHVBQUVBXFx1QUFGMlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGNjYtXFx1RkY2RlxcdUZGNzEtXFx1RkY5RFxcdUZGQTAtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzUwLVxcdURDOURcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS8sXG5cbiAgLy8gTnVtYmVyc1xuICBObDogL1tcXHUxNkVFLVxcdTE2RjBcXHUyMTYwLVxcdTIxODJcXHUyMTg1LVxcdTIxODhcXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAzOC1cXHUzMDNBXFx1QTZFNi1cXHVBNkVGXXxcXHVEODAwW1xcdURENDAtXFx1REQ3NFxcdURGNDFcXHVERjRBXFx1REZEMS1cXHVERkQ1XXxcXHVEODA5W1xcdURDMDAtXFx1REM2RV0vLFxuICBOZDogL1swLTlcXHUwNjYwLVxcdTA2NjlcXHUwNkYwLVxcdTA2RjlcXHUwN0MwLVxcdTA3QzlcXHUwOTY2LVxcdTA5NkZcXHUwOUU2LVxcdTA5RUZcXHUwQTY2LVxcdTBBNkZcXHUwQUU2LVxcdTBBRUZcXHUwQjY2LVxcdTBCNkZcXHUwQkU2LVxcdTBCRUZcXHUwQzY2LVxcdTBDNkZcXHUwQ0U2LVxcdTBDRUZcXHUwRDY2LVxcdTBENkZcXHUwREU2LVxcdTBERUZcXHUwRTUwLVxcdTBFNTlcXHUwRUQwLVxcdTBFRDlcXHUwRjIwLVxcdTBGMjlcXHUxMDQwLVxcdTEwNDlcXHUxMDkwLVxcdTEwOTlcXHUxN0UwLVxcdTE3RTlcXHUxODEwLVxcdTE4MTlcXHUxOTQ2LVxcdTE5NEZcXHUxOUQwLVxcdTE5RDlcXHUxQTgwLVxcdTFBODlcXHUxQTkwLVxcdTFBOTlcXHUxQjUwLVxcdTFCNTlcXHUxQkIwLVxcdTFCQjlcXHUxQzQwLVxcdTFDNDlcXHUxQzUwLVxcdTFDNTlcXHVBNjIwLVxcdUE2MjlcXHVBOEQwLVxcdUE4RDlcXHVBOTAwLVxcdUE5MDlcXHVBOUQwLVxcdUE5RDlcXHVBOUYwLVxcdUE5RjlcXHVBQTUwLVxcdUFBNTlcXHVBQkYwLVxcdUFCRjlcXHVGRjEwLVxcdUZGMTldfFxcdUQ4MDFbXFx1RENBMC1cXHVEQ0E5XXxcXHVEODA0W1xcdURDNjYtXFx1REM2RlxcdURDRjAtXFx1RENGOVxcdUREMzYtXFx1REQzRlxcdURERDAtXFx1REREOVxcdURFRjAtXFx1REVGOV18W1xcdUQ4MDVcXHVEODA3XVtcXHVEQzUwLVxcdURDNTlcXHVEQ0QwLVxcdURDRDlcXHVERTUwLVxcdURFNTlcXHVERUMwLVxcdURFQzlcXHVERjMwLVxcdURGMzldfFxcdUQ4MDZbXFx1RENFMC1cXHVEQ0U5XXxcXHVEODFBW1xcdURFNjAtXFx1REU2OVxcdURGNTAtXFx1REY1OV18XFx1RDgzNVtcXHVERkNFLVxcdURGRkZdfFxcdUQ4M0FbXFx1REQ1MC1cXHVERDU5XS8sXG5cbiAgLy8gTWFya3NcbiAgTW46IC9bXFx1MDMwMC1cXHUwMzZGXFx1MDQ4My1cXHUwNDg3XFx1MDU5MS1cXHUwNUJEXFx1MDVCRlxcdTA1QzFcXHUwNUMyXFx1MDVDNFxcdTA1QzVcXHUwNUM3XFx1MDYxMC1cXHUwNjFBXFx1MDY0Qi1cXHUwNjVGXFx1MDY3MFxcdTA2RDYtXFx1MDZEQ1xcdTA2REYtXFx1MDZFNFxcdTA2RTdcXHUwNkU4XFx1MDZFQS1cXHUwNkVEXFx1MDcxMVxcdTA3MzAtXFx1MDc0QVxcdTA3QTYtXFx1MDdCMFxcdTA3RUItXFx1MDdGM1xcdTA4MTYtXFx1MDgxOVxcdTA4MUItXFx1MDgyM1xcdTA4MjUtXFx1MDgyN1xcdTA4MjktXFx1MDgyRFxcdTA4NTktXFx1MDg1QlxcdTA4RDQtXFx1MDhFMVxcdTA4RTMtXFx1MDkwMlxcdTA5M0FcXHUwOTNDXFx1MDk0MS1cXHUwOTQ4XFx1MDk0RFxcdTA5NTEtXFx1MDk1N1xcdTA5NjJcXHUwOTYzXFx1MDk4MVxcdTA5QkNcXHUwOUMxLVxcdTA5QzRcXHUwOUNEXFx1MDlFMlxcdTA5RTNcXHUwQTAxXFx1MEEwMlxcdTBBM0NcXHUwQTQxXFx1MEE0MlxcdTBBNDdcXHUwQTQ4XFx1MEE0Qi1cXHUwQTREXFx1MEE1MVxcdTBBNzBcXHUwQTcxXFx1MEE3NVxcdTBBODFcXHUwQTgyXFx1MEFCQ1xcdTBBQzEtXFx1MEFDNVxcdTBBQzdcXHUwQUM4XFx1MEFDRFxcdTBBRTJcXHUwQUUzXFx1MEIwMVxcdTBCM0NcXHUwQjNGXFx1MEI0MS1cXHUwQjQ0XFx1MEI0RFxcdTBCNTZcXHUwQjYyXFx1MEI2M1xcdTBCODJcXHUwQkMwXFx1MEJDRFxcdTBDMDBcXHUwQzNFLVxcdTBDNDBcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNjJcXHUwQzYzXFx1MEM4MVxcdTBDQkNcXHUwQ0JGXFx1MENDNlxcdTBDQ0NcXHUwQ0NEXFx1MENFMlxcdTBDRTNcXHUwRDAxXFx1MEQ0MS1cXHUwRDQ0XFx1MEQ0RFxcdTBENjJcXHUwRDYzXFx1MERDQVxcdTBERDItXFx1MERENFxcdTBERDZcXHUwRTMxXFx1MEUzNC1cXHUwRTNBXFx1MEU0Ny1cXHUwRTRFXFx1MEVCMVxcdTBFQjQtXFx1MEVCOVxcdTBFQkJcXHUwRUJDXFx1MEVDOC1cXHUwRUNEXFx1MEYxOFxcdTBGMTlcXHUwRjM1XFx1MEYzN1xcdTBGMzlcXHUwRjcxLVxcdTBGN0VcXHUwRjgwLVxcdTBGODRcXHUwRjg2XFx1MEY4N1xcdTBGOEQtXFx1MEY5N1xcdTBGOTktXFx1MEZCQ1xcdTBGQzZcXHUxMDJELVxcdTEwMzBcXHUxMDMyLVxcdTEwMzdcXHUxMDM5XFx1MTAzQVxcdTEwM0RcXHUxMDNFXFx1MTA1OFxcdTEwNTlcXHUxMDVFLVxcdTEwNjBcXHUxMDcxLVxcdTEwNzRcXHUxMDgyXFx1MTA4NVxcdTEwODZcXHUxMDhEXFx1MTA5RFxcdTEzNUQtXFx1MTM1RlxcdTE3MTItXFx1MTcxNFxcdTE3MzItXFx1MTczNFxcdTE3NTJcXHUxNzUzXFx1MTc3MlxcdTE3NzNcXHUxN0I0XFx1MTdCNVxcdTE3QjctXFx1MTdCRFxcdTE3QzZcXHUxN0M5LVxcdTE3RDNcXHUxN0REXFx1MTgwQi1cXHUxODBEXFx1MTg4NVxcdTE4ODZcXHUxOEE5XFx1MTkyMC1cXHUxOTIyXFx1MTkyN1xcdTE5MjhcXHUxOTMyXFx1MTkzOS1cXHUxOTNCXFx1MUExN1xcdTFBMThcXHUxQTFCXFx1MUE1NlxcdTFBNTgtXFx1MUE1RVxcdTFBNjBcXHUxQTYyXFx1MUE2NS1cXHUxQTZDXFx1MUE3My1cXHUxQTdDXFx1MUE3RlxcdTFBQjAtXFx1MUFCRFxcdTFCMDAtXFx1MUIwM1xcdTFCMzRcXHUxQjM2LVxcdTFCM0FcXHUxQjNDXFx1MUI0MlxcdTFCNkItXFx1MUI3M1xcdTFCODBcXHUxQjgxXFx1MUJBMi1cXHUxQkE1XFx1MUJBOFxcdTFCQTlcXHUxQkFCLVxcdTFCQURcXHUxQkU2XFx1MUJFOFxcdTFCRTlcXHUxQkVEXFx1MUJFRi1cXHUxQkYxXFx1MUMyQy1cXHUxQzMzXFx1MUMzNlxcdTFDMzdcXHUxQ0QwLVxcdTFDRDJcXHUxQ0Q0LVxcdTFDRTBcXHUxQ0UyLVxcdTFDRThcXHUxQ0VEXFx1MUNGNFxcdTFDRjhcXHUxQ0Y5XFx1MURDMC1cXHUxREY1XFx1MURGQi1cXHUxREZGXFx1MjBEMC1cXHUyMERDXFx1MjBFMVxcdTIwRTUtXFx1MjBGMFxcdTJDRUYtXFx1MkNGMVxcdTJEN0ZcXHUyREUwLVxcdTJERkZcXHUzMDJBLVxcdTMwMkRcXHUzMDk5XFx1MzA5QVxcdUE2NkZcXHVBNjc0LVxcdUE2N0RcXHVBNjlFXFx1QTY5RlxcdUE2RjBcXHVBNkYxXFx1QTgwMlxcdUE4MDZcXHVBODBCXFx1QTgyNVxcdUE4MjZcXHVBOEM0XFx1QThDNVxcdUE4RTAtXFx1QThGMVxcdUE5MjYtXFx1QTkyRFxcdUE5NDctXFx1QTk1MVxcdUE5ODAtXFx1QTk4MlxcdUE5QjNcXHVBOUI2LVxcdUE5QjlcXHVBOUJDXFx1QTlFNVxcdUFBMjktXFx1QUEyRVxcdUFBMzFcXHVBQTMyXFx1QUEzNVxcdUFBMzZcXHVBQTQzXFx1QUE0Q1xcdUFBN0NcXHVBQUIwXFx1QUFCMi1cXHVBQUI0XFx1QUFCN1xcdUFBQjhcXHVBQUJFXFx1QUFCRlxcdUFBQzFcXHVBQUVDXFx1QUFFRFxcdUFBRjZcXHVBQkU1XFx1QUJFOFxcdUFCRURcXHVGQjFFXFx1RkUwMC1cXHVGRTBGXFx1RkUyMC1cXHVGRTJGXXxcXHVEODAwW1xcdURERkRcXHVERUUwXFx1REY3Ni1cXHVERjdBXXxcXHVEODAyW1xcdURFMDEtXFx1REUwM1xcdURFMDVcXHVERTA2XFx1REUwQy1cXHVERTBGXFx1REUzOC1cXHVERTNBXFx1REUzRlxcdURFRTVcXHVERUU2XXxcXHVEODA0W1xcdURDMDFcXHVEQzM4LVxcdURDNDZcXHVEQzdGLVxcdURDODFcXHVEQ0IzLVxcdURDQjZcXHVEQ0I5XFx1RENCQVxcdUREMDAtXFx1REQwMlxcdUREMjctXFx1REQyQlxcdUREMkQtXFx1REQzNFxcdURENzNcXHVERDgwXFx1REQ4MVxcdUREQjYtXFx1RERCRVxcdUREQ0EtXFx1RERDQ1xcdURFMkYtXFx1REUzMVxcdURFMzRcXHVERTM2XFx1REUzN1xcdURFM0VcXHVERURGXFx1REVFMy1cXHVERUVBXFx1REYwMFxcdURGMDFcXHVERjNDXFx1REY0MFxcdURGNjYtXFx1REY2Q1xcdURGNzAtXFx1REY3NF18XFx1RDgwNVtcXHVEQzM4LVxcdURDM0ZcXHVEQzQyLVxcdURDNDRcXHVEQzQ2XFx1RENCMy1cXHVEQ0I4XFx1RENCQVxcdURDQkZcXHVEQ0MwXFx1RENDMlxcdURDQzNcXHVEREIyLVxcdUREQjVcXHVEREJDXFx1RERCRFxcdUREQkZcXHVEREMwXFx1REREQ1xcdURERERcXHVERTMzLVxcdURFM0FcXHVERTNEXFx1REUzRlxcdURFNDBcXHVERUFCXFx1REVBRFxcdURFQjAtXFx1REVCNVxcdURFQjdcXHVERjFELVxcdURGMUZcXHVERjIyLVxcdURGMjVcXHVERjI3LVxcdURGMkJdfFxcdUQ4MDdbXFx1REMzMC1cXHVEQzM2XFx1REMzOC1cXHVEQzNEXFx1REMzRlxcdURDOTItXFx1RENBN1xcdURDQUEtXFx1RENCMFxcdURDQjJcXHVEQ0IzXFx1RENCNVxcdURDQjZdfFxcdUQ4MUFbXFx1REVGMC1cXHVERUY0XFx1REYzMC1cXHVERjM2XXxcXHVEODFCW1xcdURGOEYtXFx1REY5Ml18XFx1RDgyRltcXHVEQzlEXFx1REM5RV18XFx1RDgzNFtcXHVERDY3LVxcdURENjlcXHVERDdCLVxcdUREODJcXHVERDg1LVxcdUREOEJcXHVEREFBLVxcdUREQURcXHVERTQyLVxcdURFNDRdfFxcdUQ4MzZbXFx1REUwMC1cXHVERTM2XFx1REUzQi1cXHVERTZDXFx1REU3NVxcdURFODRcXHVERTlCLVxcdURFOUZcXHVERUExLVxcdURFQUZdfFxcdUQ4MzhbXFx1REMwMC1cXHVEQzA2XFx1REMwOC1cXHVEQzE4XFx1REMxQi1cXHVEQzIxXFx1REMyM1xcdURDMjRcXHVEQzI2LVxcdURDMkFdfFxcdUQ4M0FbXFx1RENEMC1cXHVEQ0Q2XFx1REQ0NC1cXHVERDRBXXxcXHVEQjQwW1xcdUREMDAtXFx1RERFRl0vLFxuICBNYzogL1tcXHUwOTAzLVxcdTA5MDNdfFtcXHUwOTNFLVxcdTA5NDBdfFtcXHUwOTQ5LVxcdTA5NENdfFtcXHUwOTgyLVxcdTA5ODNdfFtcXHUwOUJFLVxcdTA5QzBdfFtcXHUwOUM3LVxcdTA5QzhdfFtcXHUwOUNCLVxcdTA5Q0NdfFtcXHUwOUQ3LVxcdTA5RDddfFtcXHUwQTNFLVxcdTBBNDBdfFtcXHUwQTgzLVxcdTBBODNdfFtcXHUwQUJFLVxcdTBBQzBdfFtcXHUwQUM5LVxcdTBBQzldfFtcXHUwQUNCLVxcdTBBQ0NdfFtcXHUwQjAyLVxcdTBCMDNdfFtcXHUwQjNFLVxcdTBCM0VdfFtcXHUwQjQwLVxcdTBCNDBdfFtcXHUwQjQ3LVxcdTBCNDhdfFtcXHUwQjRCLVxcdTBCNENdfFtcXHUwQjU3LVxcdTBCNTddfFtcXHUwQjgzLVxcdTBCODNdfFtcXHUwQkJFLVxcdTBCQkZdfFtcXHUwQkMxLVxcdTBCQzJdfFtcXHUwQkM2LVxcdTBCQzhdfFtcXHUwQkNBLVxcdTBCQ0NdfFtcXHUwQkQ3LVxcdTBCRDddfFtcXHUwQzAxLVxcdTBDMDNdfFtcXHUwQzQxLVxcdTBDNDRdfFtcXHUwQzgyLVxcdTBDODNdfFtcXHUwQ0JFLVxcdTBDQkVdfFtcXHUwQ0MwLVxcdTBDQzRdfFtcXHUwQ0M3LVxcdTBDQzhdfFtcXHUwQ0NBLVxcdTBDQ0JdfFtcXHUwQ0Q1LVxcdTBDRDZdfFtcXHUwRDAyLVxcdTBEMDNdfFtcXHUwRDNFLVxcdTBENDBdfFtcXHUwRDQ2LVxcdTBENDhdfFtcXHUwRDRBLVxcdTBENENdfFtcXHUwRDU3LVxcdTBENTddfFtcXHUwRjNFLVxcdTBGM0ZdfFtcXHUwRjdGLVxcdTBGN0ZdLyxcblxuICAvLyBQdW5jdHVhdGlvbiwgQ29ubmVjdG9yXG4gIFBjOiAvW19cXHUyMDNGXFx1MjA0MFxcdTIwNTRcXHVGRTMzXFx1RkUzNFxcdUZFNEQtXFx1RkU0RlxcdUZGM0ZdLyxcblxuICAvLyBTZXBhcmF0b3IsIFNwYWNlXG4gIFpzOiAvWyBcXHhBMFxcdTE2ODBcXHUyMDAwLVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBdLyxcblxuICAvLyBUaGVzZSB0d28gYXJlIG5vdCByZWFsIFVuaWNvZGUgY2F0ZWdvcmllcywgYnV0IG91ciB1c2VmdWwgZm9yIE9obS5cbiAgLy8gTCBpcyBhIGNvbWJpbmF0aW9uIG9mIGFsbCB0aGUgbGV0dGVyIGNhdGVnb3JpZXMuXG4gIC8vIEx0bW8gaXMgYSBjb21iaW5hdGlvbiBvZiBMdCwgTG0sIGFuZCBMby5cbiAgTDogL1tBLVphLXpcXHhBQVxceEI1XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA4QjYtXFx1MDhCRFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4MFxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1NC1cXHUwRDU2XFx1MEQ1Ri1cXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ2XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRUM2XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNVxcdTEzRjgtXFx1MTNGRFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RjEtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RDdcXHUxN0RDXFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFBQTdcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3RFxcdTFDODAtXFx1MUM4OFxcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MUQwMC1cXHUxREJGXFx1MUUwMC1cXHUxRjE1XFx1MUYxOC1cXHUxRjFEXFx1MUYyMC1cXHUxRjQ1XFx1MUY0OC1cXHUxRjREXFx1MUY1MC1cXHUxRjU3XFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1Ri1cXHUxRjdEXFx1MUY4MC1cXHUxRkI0XFx1MUZCNi1cXHUxRkJDXFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzYtXFx1MUZDQ1xcdTFGRDAtXFx1MUZEM1xcdTFGRDYtXFx1MUZEQlxcdTFGRTAtXFx1MUZFQ1xcdTFGRjItXFx1MUZGNFxcdTFGRjYtXFx1MUZGQ1xcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MjEwMlxcdTIxMDdcXHUyMTBBLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEyRi1cXHUyMTM5XFx1MjEzQy1cXHUyMTNGXFx1MjE0NS1cXHUyMTQ5XFx1MjE0RVxcdTIxODNcXHUyMTg0XFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNVxcdTMwMDZcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUQtXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY0MC1cXHVBNjZFXFx1QTY3Ri1cXHVBNjlEXFx1QTZBMC1cXHVBNkU1XFx1QTcxNy1cXHVBNzFGXFx1QTcyMi1cXHVBNzg4XFx1QTc4Qi1cXHVBN0FFXFx1QTdCMC1cXHVBN0I3XFx1QTdGNy1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUNGXFx1QTlFMC1cXHVBOUU0XFx1QTlFNi1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQi1cXHVBQUREXFx1QUFFMC1cXHVBQUVBXFx1QUFGMi1cXHVBQUY0XFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUIzMC1cXHVBQjVBXFx1QUI1Qy1cXHVBQjY1XFx1QUI3MC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkYyMS1cXHVGRjNBXFx1RkY0MS1cXHVGRjVBXFx1RkY2Ni1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXXxcXHVEODAwW1xcdURDMDAtXFx1REMwQlxcdURDMEQtXFx1REMyNlxcdURDMjgtXFx1REMzQVxcdURDM0NcXHVEQzNEXFx1REMzRi1cXHVEQzREXFx1REM1MC1cXHVEQzVEXFx1REM4MC1cXHVEQ0ZBXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REYwMC1cXHVERjFGXFx1REYzMC1cXHVERjQwXFx1REY0Mi1cXHVERjQ5XFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXXxcXHVEODAxW1xcdURDMDAtXFx1REM5RFxcdURDQjAtXFx1RENEM1xcdURDRDgtXFx1RENGQlxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM2MC1cXHVEQzc2XFx1REM4MC1cXHVEQzlFXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVERDAwLVxcdUREMTVcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XFx1REM4MC1cXHVEQ0IyXFx1RENDMC1cXHVEQ0YyXXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdUREMDMtXFx1REQyNlxcdURENTAtXFx1REQ3MlxcdURENzZcXHVERDgzLVxcdUREQjJcXHVEREMxLVxcdUREQzRcXHVERERBXFx1REREQ1xcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REMwMC1cXHVEQzM0XFx1REM0Ny1cXHVEQzRBXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFODAtXFx1REVBQVxcdURGMDAtXFx1REYxOV18XFx1RDgwNltcXHVEQ0EwLVxcdURDREZcXHVEQ0ZGXFx1REVDMC1cXHVERUY4XXxcXHVEODA3W1xcdURDMDAtXFx1REMwOFxcdURDMEEtXFx1REMyRVxcdURDNDBcXHVEQzcyLVxcdURDOEZdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODFDLVxcdUQ4MjBcXHVEODQwLVxcdUQ4NjhcXHVEODZBLVxcdUQ4NkNcXHVEODZGLVxcdUQ4NzJdW1xcdURDMDAtXFx1REZGRl18XFx1RDgwRFtcXHVEQzAwLVxcdURDMkVdfFxcdUQ4MTFbXFx1REMwMC1cXHVERTQ2XXxcXHVEODFBW1xcdURDMDAtXFx1REUzOFxcdURFNDAtXFx1REU1RVxcdURFRDAtXFx1REVFRFxcdURGMDAtXFx1REYyRlxcdURGNDAtXFx1REY0M1xcdURGNjMtXFx1REY3N1xcdURGN0QtXFx1REY4Rl18XFx1RDgxQltcXHVERjAwLVxcdURGNDRcXHVERjUwXFx1REY5My1cXHVERjlGXFx1REZFMF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzNVtcXHVEQzAwLVxcdURDNTRcXHVEQzU2LVxcdURDOUNcXHVEQzlFXFx1REM5RlxcdURDQTJcXHVEQ0E1XFx1RENBNlxcdURDQTktXFx1RENBQ1xcdURDQUUtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdUREMDVcXHVERDA3LVxcdUREMEFcXHVERDBELVxcdUREMTRcXHVERDE2LVxcdUREMUNcXHVERDFFLVxcdUREMzlcXHVERDNCLVxcdUREM0VcXHVERDQwLVxcdURENDRcXHVERDQ2XFx1REQ0QS1cXHVERDUwXFx1REQ1Mi1cXHVERUE1XFx1REVBOC1cXHVERUMwXFx1REVDMi1cXHVERURBXFx1REVEQy1cXHVERUZBXFx1REVGQy1cXHVERjE0XFx1REYxNi1cXHVERjM0XFx1REYzNi1cXHVERjRFXFx1REY1MC1cXHVERjZFXFx1REY3MC1cXHVERjg4XFx1REY4QS1cXHVERkE4XFx1REZBQS1cXHVERkMyXFx1REZDNC1cXHVERkNCXXxcXHVEODNBW1xcdURDMDAtXFx1RENDNFxcdUREMDAtXFx1REQ0M118XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXXxcXHVEODY5W1xcdURDMDAtXFx1REVENlxcdURGMDAtXFx1REZGRl18XFx1RDg2RFtcXHVEQzAwLVxcdURGMzRcXHVERjQwLVxcdURGRkZdfFxcdUQ4NkVbXFx1REMwMC1cXHVEQzFEXFx1REMyMC1cXHVERkZGXXxcXHVEODczW1xcdURDMDAtXFx1REVBMV18XFx1RDg3RVtcXHVEQzAwLVxcdURFMURdLyxcbiAgTHRtbzogL1tcXHUwMUM1XFx1MDFDOFxcdTAxQ0JcXHUwMUYyXFx1MUY4OC1cXHUxRjhGXFx1MUY5OC1cXHUxRjlGXFx1MUZBOC1cXHUxRkFGXFx1MUZCQ1xcdTFGQ0NcXHUxRkZDXXxbXFx1MDJCMC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzc0XFx1MDM3QVxcdTA1NTlcXHUwNjQwXFx1MDZFNVxcdTA2RTZcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwOTcxXFx1MEU0NlxcdTBFQzZcXHUxMEZDXFx1MTdEN1xcdTE4NDNcXHUxQUE3XFx1MUM3OC1cXHUxQzdEXFx1MUQyQy1cXHUxRDZBXFx1MUQ3OFxcdTFEOUItXFx1MURCRlxcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MkM3Q1xcdTJDN0RcXHUyRDZGXFx1MkUyRlxcdTMwMDVcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzA5RFxcdTMwOUVcXHUzMEZDLVxcdTMwRkVcXHVBMDE1XFx1QTRGOC1cXHVBNEZEXFx1QTYwQ1xcdUE2N0ZcXHVBNjlDXFx1QTY5RFxcdUE3MTctXFx1QTcxRlxcdUE3NzBcXHVBNzg4XFx1QTdGOFxcdUE3RjlcXHVBOUNGXFx1QTlFNlxcdUFBNzBcXHVBQUREXFx1QUFGM1xcdUFBRjRcXHVBQjVDLVxcdUFCNUZcXHVGRjcwXFx1RkY5RVxcdUZGOUZdfFxcdUQ4MUFbXFx1REY0MC1cXHVERjQzXXxcXHVEODFCW1xcdURGOTMtXFx1REY5RlxcdURGRTBdfFtcXHhBQVxceEJBXFx1MDFCQlxcdTAxQzAtXFx1MDFDM1xcdTAyOTRcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2M0ZcXHUwNjQxLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA4MDAtXFx1MDgxNVxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA4QjYtXFx1MDhCRFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3Mi1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4MFxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1NC1cXHUwRDU2XFx1MEQ1Ri1cXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ1XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEQwLVxcdTEwRkFcXHUxMEZELVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RjEtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RENcXHUxODIwLVxcdTE4NDJcXHUxODQ0LVxcdTE4NzdcXHUxODgwLVxcdTE4ODRcXHUxODg3LVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDNzdcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTIxMzUtXFx1MjEzOFxcdTJEMzAtXFx1MkQ2N1xcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTMwMDZcXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUEwMTRcXHVBMDE2LVxcdUE0OENcXHVBNEQwLVxcdUE0RjdcXHVBNTAwLVxcdUE2MEJcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NkVcXHVBNkEwLVxcdUE2RTVcXHVBNzhGXFx1QTdGN1xcdUE3RkItXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlFMC1cXHVBOUU0XFx1QTlFNy1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTZGXFx1QUE3MS1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQlxcdUFBRENcXHVBQUUwLVxcdUFBRUFcXHVBQUYyXFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUJDMC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkY2Ni1cXHVGRjZGXFx1RkY3MS1cXHVGRjlEXFx1RkZBMC1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXXxcXHVEODAwW1xcdURDMDAtXFx1REMwQlxcdURDMEQtXFx1REMyNlxcdURDMjgtXFx1REMzQVxcdURDM0NcXHVEQzNEXFx1REMzRi1cXHVEQzREXFx1REM1MC1cXHVEQzVEXFx1REM4MC1cXHVEQ0ZBXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REYwMC1cXHVERjFGXFx1REYzMC1cXHVERjQwXFx1REY0Mi1cXHVERjQ5XFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXXxcXHVEODAxW1xcdURDNTAtXFx1REM5RFxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM2MC1cXHVEQzc2XFx1REM4MC1cXHVEQzlFXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVERDAwLVxcdUREMTVcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdUREMDMtXFx1REQyNlxcdURENTAtXFx1REQ3MlxcdURENzZcXHVERDgzLVxcdUREQjJcXHVEREMxLVxcdUREQzRcXHVERERBXFx1REREQ1xcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REMwMC1cXHVEQzM0XFx1REM0Ny1cXHVEQzRBXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFODAtXFx1REVBQVxcdURGMDAtXFx1REYxOV18XFx1RDgwNltcXHVEQ0ZGXFx1REVDMC1cXHVERUY4XXxcXHVEODA3W1xcdURDMDAtXFx1REMwOFxcdURDMEEtXFx1REMyRVxcdURDNDBcXHVEQzcyLVxcdURDOEZdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODFDLVxcdUQ4MjBcXHVEODQwLVxcdUQ4NjhcXHVEODZBLVxcdUQ4NkNcXHVEODZGLVxcdUQ4NzJdW1xcdURDMDAtXFx1REZGRl18XFx1RDgwRFtcXHVEQzAwLVxcdURDMkVdfFxcdUQ4MTFbXFx1REMwMC1cXHVERTQ2XXxcXHVEODFBW1xcdURDMDAtXFx1REUzOFxcdURFNDAtXFx1REU1RVxcdURFRDAtXFx1REVFRFxcdURGMDAtXFx1REYyRlxcdURGNjMtXFx1REY3N1xcdURGN0QtXFx1REY4Rl18XFx1RDgxQltcXHVERjAwLVxcdURGNDRcXHVERjUwXXxcXHVEODIxW1xcdURDMDAtXFx1REZFQ118XFx1RDgyMltcXHVEQzAwLVxcdURFRjJdfFxcdUQ4MkNbXFx1REMwMFxcdURDMDFdfFxcdUQ4MkZbXFx1REMwMC1cXHVEQzZBXFx1REM3MC1cXHVEQzdDXFx1REM4MC1cXHVEQzg4XFx1REM5MC1cXHVEQzk5XXxcXHVEODNBW1xcdURDMDAtXFx1RENDNF18XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXXxcXHVEODY5W1xcdURDMDAtXFx1REVENlxcdURGMDAtXFx1REZGRl18XFx1RDg2RFtcXHVEQzAwLVxcdURGMzRcXHVERjQwLVxcdURGRkZdfFxcdUQ4NkVbXFx1REMwMC1cXHVEQzFEXFx1REMyMC1cXHVERkZGXXxcXHVEODczW1xcdURDMDAtXFx1REVBMV18XFx1RDg3RVtcXHVEQzAwLVxcdURFMURdL1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=