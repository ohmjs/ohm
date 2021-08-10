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
            var _a;
            return {
                name: name.parse(),
                formals: ((_a = optFormals.child(0)) === null || _a === void 0 ? void 0 : _a.parse()) || []
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
    var where = type + " '" + name + "'";
    var message = "Missing semantic action for '" +
        ctorName +
        "' in " +
        where +
        '\n' +
        'Action stack (most recent call last):\n' +
        stackTrace;
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
            var _a;
            var grammarName = id.visit();
            decl = builder.newGrammar(grammarName, namespace);
            (_a = s.child(0)) === null || _a === void 0 ? void 0 : _a.visit();
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
__webpack_require__(/*! ./pexprs-getArity */ "./src/pexprs-getArity.js");
__webpack_require__(/*! ./pexprs-generateExample */ "./src/pexprs-generateExample.js");
__webpack_require__(/*! ./pexprs-outputRecipe */ "./src/pexprs-outputRecipe.js");
__webpack_require__(/*! ./pexprs-introduceParams */ "./src/pexprs-introduceParams.js");
__webpack_require__(/*! ./pexprs-isNullable */ "./src/pexprs-isNullable.js");
__webpack_require__(/*! ./pexprs-substituteParams */ "./src/pexprs-substituteParams.js");
__webpack_require__(/*! ./pexprs-toDisplayString */ "./src/pexprs-toDisplayString.js");
__webpack_require__(/*! ./pexprs-toArgumentNameList */ "./src/pexprs-toArgumentNameList.js");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vaG0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL29obS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vaG0vLi4vbm9kZV9tb2R1bGVzL3V0aWwtZXh0ZW5kL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9kaXN0L2J1aWx0LWluLXJ1bGVzLmpzIiwid2VicGFjazovL29obS8uL2Rpc3Qvb2htLWdyYW1tYXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29obS8uL2V4dHJhcy9WaXNpdG9yRmFtaWx5LmpzIiwid2VicGFjazovL29obS8uL2V4dHJhcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9leHRyYXMvc2VtYW50aWNzLXRvQVNULmpzIiwid2VicGFjazovL29obS8uL25vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0J1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLmpzIiwid2VicGFjazovL29obS8uL3NyYy9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9HcmFtbWFyLmpzIiwid2VicGFjazovL29obS8uL3NyYy9HcmFtbWFyRGVjbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvSW5wdXRTdHJlYW0uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0ludGVydmFsLmpzIiwid2VicGFjazovL29obS8uL3NyYy9NYXRjaFJlc3VsdC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hTdGF0ZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hlci5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTmFtZXNwYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9Qb3NJbmZvLmpzIiwid2VicGFjazovL29obS8uL3NyYy9TZW1hbnRpY3MuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL1RyYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9jb21tb24uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvbWFpbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvbm9kZXMuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWV2YWwuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZW5lcmF0ZUV4YW1wbGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZXRBcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWludHJvZHVjZVBhcmFtcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1zdWJzdGl0dXRlUGFyYW1zLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0LmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi90aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0UsdUJBQXVCLEVBQUU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDeFRhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBYyxtQkFBTyxDQUFDLG1DQUFXO0FBQ2pDLGtCQUFrQixtQkFBTyxDQUFDLDJDQUFlO0FBQ3pDLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9KYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyxxQ0FBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsZ0JBQWdCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxnQkFBZ0IsRUFBRTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixnREFBZ0Q7QUFDaEQsU0FBUztBQUNULEtBQUs7QUFDTCxhQUFhLEtBQUs7QUFDbEI7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0Isb0NBQW9DO0FBQ3BDLGtCQUFrQixFQUFFO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDREQUE0RCwyQkFBMkIsRUFBRTtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHdCQUF3QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLG1CQUFPLENBQUMsOEVBQW1DO0FBQ3BGO0FBQ0Esd0RBQXdEO0FBQ3hELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwrREFBK0Qsa0JBQWtCLEVBQUU7QUFDbkYsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN4c0JhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHFDQUFZO0FBQ25DLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbExhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLDBEQUFhO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsVUFBVSxFQUFFO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixvQkFBb0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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UztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLHVEQUF1RCxrQkFBa0IsRUFBRTtBQUMzRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULG9DQUFvQyxFQUFFO0FBQ3RDLG1DQUFtQyxFQUFFO0FBQ3JDO0FBQ0EsaURBQWlELGtCQUFrQixFQUFFO0FBQ3JFLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLG9FQUFvRSxrQkFBa0IsRUFBRTtBQUN4RixTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIscUJBQXFCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLG9DQUFXO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbUJBQU8sQ0FBQyx3REFBd0I7QUFDdkQ7QUFDQSx5Q0FBeUMsbUJBQU8sQ0FBQyxrREFBcUI7QUFDdEU7Ozs7Ozs7Ozs7Ozs7QUNsWGE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxjQUFjLGdCQUFnQixzQ0FBc0MsaUJBQWlCLEVBQUU7QUFDdkYsNkJBQTZCLDhFQUE4RTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBc0I7QUFDN0M7QUFDQTtBQUNBLENBQUM7QUFDRCxhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQy9MYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDdENhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0IsV0FBVyxtQkFBTyxDQUFDLDZCQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIseUJBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ25GYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHlCQUF5QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDN0RhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsMkJBQTJCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7OztBQ2pEYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLFlBQVksbUJBQU8sQ0FBQywrQkFBUztBQUM3QixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CLFlBQVksbUJBQU8sQ0FBQywrQkFBUztBQUM3QixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esc0RBQXNELHFCQUFxQjtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIseUJBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDJCQUEyQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixrQkFBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixtQkFBbUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDM1ZhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLGlEQUFpRCxFQUFFO0FBQ3ZGLGlDQUFpQywrQkFBK0IsRUFBRTtBQUNsRTtBQUNBO0FBQ0EsbUJBQW1CLDJCQUEyQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msd0NBQXdDLEVBQUU7QUFDOUUsOEJBQThCLG1CQUFtQixFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELHNCQUFzQixFQUFFO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGNBQWM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksZUFBZTtBQUMzQjs7Ozs7Ozs7Ozs7OztBQzNMYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQU8sQ0FBQyxpQ0FBVTtBQUMvQixhQUFhLG1CQUFPLENBQUMsaUNBQVU7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFdBQVc7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCx5QkFBeUI7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBTyxDQUFDLDJGQUF1QztBQUMvQyxtQkFBTyxDQUFDLDZGQUF3QztBQUNoRCxtQkFBTyxDQUFDLDZGQUF3QztBQUNoRCxtQkFBTyxDQUFDLHFHQUE0QztBQUNwRCxtQkFBTyxDQUFDLDJDQUFlO0FBQ3ZCLG1CQUFPLENBQUMsbURBQW1CO0FBQzNCLG1CQUFPLENBQUMsaUVBQTBCO0FBQ2xDLG1CQUFPLENBQUMsMkRBQXVCO0FBQy9CLG1CQUFPLENBQUMsaUVBQTBCO0FBQ2xDLG1CQUFPLENBQUMsdURBQXFCO0FBQzdCLG1CQUFPLENBQUMsbUVBQTJCO0FBQ25DLG1CQUFPLENBQUMsaUVBQTBCO0FBQ2xDLG1CQUFPLENBQUMsdUVBQTZCO0FBQ3JDLG1CQUFPLENBQUMscURBQW9CO0FBQzVCLG1CQUFPLENBQUMsbURBQW1COzs7Ozs7Ozs7Ozs7O0FDN1FkO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wscUNBQXFDLGtDQUFrQyxFQUFFO0FBQ3pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsbUJBQW1CO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHVCQUF1QjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsa0NBQWtDO0FBQ2hFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNqS0Q7QUFDYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBMEM7QUFDOUMsVUFBVSxRQUFzQjtBQUNoQyxVQUFVLFNBQWtDOzs7Ozs7Ozs7Ozs7QUNQNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im9obS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm9obVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJvaG1cIl0gPSBmYWN0b3J5KCk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4uanNcIik7XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5mdW5jdGlvbiBleHRlbmQob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0JykgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn1cbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShbXCJncmFtbWFyXCIse1wic291cmNlXCI6XCJCdWlsdEluUnVsZXMge1xcblxcbiAgYWxudW0gIChhbiBhbHBoYS1udW1lcmljIGNoYXJhY3RlcilcXG4gICAgPSBsZXR0ZXJcXG4gICAgfCBkaWdpdFxcblxcbiAgbGV0dGVyICAoYSBsZXR0ZXIpXFxuICAgID0gbG93ZXJcXG4gICAgfCB1cHBlclxcbiAgICB8IHVuaWNvZGVMdG1vXFxuXFxuICBkaWdpdCAgKGEgZGlnaXQpXFxuICAgID0gXFxcIjBcXFwiLi5cXFwiOVxcXCJcXG5cXG4gIGhleERpZ2l0ICAoYSBoZXhhZGVjaW1hbCBkaWdpdClcXG4gICAgPSBkaWdpdFxcbiAgICB8IFxcXCJhXFxcIi4uXFxcImZcXFwiXFxuICAgIHwgXFxcIkFcXFwiLi5cXFwiRlxcXCJcXG5cXG4gIExpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gTm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICB8IEVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG5cXG4gIE5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBlbGVtIChzZXAgZWxlbSkqXFxuXFxuICBFbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gLyogbm90aGluZyAqL1xcblxcbiAgbGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBub25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgIHwgZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcblxcbiAgbm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IGVsZW0gKHNlcCBlbGVtKSpcXG5cXG4gIGVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSAvKiBub3RoaW5nICovXFxuXFxufVwifSxcIkJ1aWx0SW5SdWxlc1wiLG51bGwsbnVsbCx7XCJhbG51bVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4LDc4XX0sXCJhbiBhbHBoYS1udW1lcmljIGNoYXJhY3RlclwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYwLDc4XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjAsNjZdfSxcImxldHRlclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3Myw3OF19LFwiZGlnaXRcIixbXV1dXSxcImxldHRlclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgyLDE0Ml19LFwiYSBsZXR0ZXJcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDcsMTQyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA3LDExMl19LFwibG93ZXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE5LDEyNF19LFwidXBwZXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE0Ml19LFwidW5pY29kZUx0bW9cIixbXV1dXSxcImRpZ2l0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2LDE3N119LFwiYSBkaWdpdFwiLFtdLFtcInJhbmdlXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY5LDE3N119LFwiMFwiLFwiOVwiXV0sXCJoZXhEaWdpdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4MSwyNTRdfSxcImEgaGV4YWRlY2ltYWwgZGlnaXRcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTksMjU0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5LDIyNF19LFwiZGlnaXRcIixbXV0sW1wicmFuZ2VcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzEsMjM5XX0sXCJhXCIsXCJmXCJdLFtcInJhbmdlXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ2LDI1NF19LFwiQVwiLFwiRlwiXV1dLFwiTGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU4LDMzNl19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI4MiwzMzZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyODIsMzA3XX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI5NywzMDFdfSwwXSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMwMywzMDZdfSwxXV1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzMxNCwzMzZdfSxcIkVtcHR5TGlzdE9mXCIsW1tcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzI2LDMzMF19LDBdLFtcInBhcmFtXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzMyLDMzNV19LDFdXV1dXSxcIk5vbmVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzQwLDM4OF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3MiwzODhdfSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3MiwzNzZdfSwwXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDM4OF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3OCwzODZdfSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3OCwzODFdfSwxXSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4MiwzODZdfSwwXV1dXV0sXCJFbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzM5Miw0MzRdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MzgsNDM4XX1dXSxcImxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQzOCw1MTZdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NjIsNTE2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDYyLDQ4N119LFwibm9uZW1wdHlMaXN0T2ZcIixbW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NzcsNDgxXX0sMF0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0ODMsNDg2XX0sMV1dXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0OTQsNTE2XX0sXCJlbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUwNiw1MTBdfSwwXSxbXCJwYXJhbVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUxMiw1MTVdfSwxXV1dXV0sXCJub25lbXB0eUxpc3RPZlwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUyMCw1NjhdfSxudWxsLFtcImVsZW1cIixcInNlcFwiXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTIsNTY4XX0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTIsNTU2XX0sMF0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1Nyw1NjhdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTgsNTY2XX0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTgsNTYxXX0sMV0sW1wicGFyYW1cIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjIsNTY2XX0sMF1dXV1dLFwiZW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NzIsNjE0XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjE2LDYxNl19XV19XSk7XG4iLCJ2YXIgb2htID0gcmVxdWlyZSgnLi4nKTtcbm1vZHVsZS5leHBvcnRzID0gb2htLm1ha2VSZWNpcGUoW1wiZ3JhbW1hclwiLHtcInNvdXJjZVwiOlwiT2htIHtcXG5cXG4gIEdyYW1tYXJzXFxuICAgID0gR3JhbW1hcipcXG5cXG4gIEdyYW1tYXJcXG4gICAgPSBpZGVudCBTdXBlckdyYW1tYXI/IFxcXCJ7XFxcIiBSdWxlKiBcXFwifVxcXCJcXG5cXG4gIFN1cGVyR3JhbW1hclxcbiAgICA9IFxcXCI8OlxcXCIgaWRlbnRcXG5cXG4gIFJ1bGVcXG4gICAgPSBpZGVudCBGb3JtYWxzPyBydWxlRGVzY3I/IFxcXCI9XFxcIiAgUnVsZUJvZHkgIC0tIGRlZmluZVxcbiAgICB8IGlkZW50IEZvcm1hbHM/ICAgICAgICAgICAgXFxcIjo9XFxcIiBPdmVycmlkZVJ1bGVCb2R5ICAtLSBvdmVycmlkZVxcbiAgICB8IGlkZW50IEZvcm1hbHM/ICAgICAgICAgICAgXFxcIis9XFxcIiBSdWxlQm9keSAgLS0gZXh0ZW5kXFxuXFxuICBSdWxlQm9keVxcbiAgICA9IFxcXCJ8XFxcIj8gTm9uZW1wdHlMaXN0T2Y8VG9wTGV2ZWxUZXJtLCBcXFwifFxcXCI+XFxuXFxuICBUb3BMZXZlbFRlcm1cXG4gICAgPSBTZXEgY2FzZU5hbWUgIC0tIGlubGluZVxcbiAgICB8IFNlcVxcblxcbiAgT3ZlcnJpZGVSdWxlQm9keVxcbiAgICA9IFxcXCJ8XFxcIj8gTm9uZW1wdHlMaXN0T2Y8T3ZlcnJpZGVUb3BMZXZlbFRlcm0sIFxcXCJ8XFxcIj5cXG5cXG4gIE92ZXJyaWRlVG9wTGV2ZWxUZXJtXFxuICAgID0gXFxcIi4uLlxcXCIgIC0tIHN1cGVyU3BsaWNlXFxuICAgIHwgVG9wTGV2ZWxUZXJtXFxuXFxuICBGb3JtYWxzXFxuICAgID0gXFxcIjxcXFwiIExpc3RPZjxpZGVudCwgXFxcIixcXFwiPiBcXFwiPlxcXCJcXG5cXG4gIFBhcmFtc1xcbiAgICA9IFxcXCI8XFxcIiBMaXN0T2Y8U2VxLCBcXFwiLFxcXCI+IFxcXCI+XFxcIlxcblxcbiAgQWx0XFxuICAgID0gTm9uZW1wdHlMaXN0T2Y8U2VxLCBcXFwifFxcXCI+XFxuXFxuICBTZXFcXG4gICAgPSBJdGVyKlxcblxcbiAgSXRlclxcbiAgICA9IFByZWQgXFxcIipcXFwiICAtLSBzdGFyXFxuICAgIHwgUHJlZCBcXFwiK1xcXCIgIC0tIHBsdXNcXG4gICAgfCBQcmVkIFxcXCI/XFxcIiAgLS0gb3B0XFxuICAgIHwgUHJlZFxcblxcbiAgUHJlZFxcbiAgICA9IFxcXCJ+XFxcIiBMZXggIC0tIG5vdFxcbiAgICB8IFxcXCImXFxcIiBMZXggIC0tIGxvb2thaGVhZFxcbiAgICB8IExleFxcblxcbiAgTGV4XFxuICAgID0gXFxcIiNcXFwiIEJhc2UgIC0tIGxleFxcbiAgICB8IEJhc2VcXG5cXG4gIEJhc2VcXG4gICAgPSBpZGVudCBQYXJhbXM/IH4ocnVsZURlc2NyPyBcXFwiPVxcXCIgfCBcXFwiOj1cXFwiIHwgXFxcIis9XFxcIikgIC0tIGFwcGxpY2F0aW9uXFxuICAgIHwgb25lQ2hhclRlcm1pbmFsIFxcXCIuLlxcXCIgb25lQ2hhclRlcm1pbmFsICAgICAgICAgICAtLSByYW5nZVxcbiAgICB8IHRlcm1pbmFsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gdGVybWluYWxcXG4gICAgfCBcXFwiKFxcXCIgQWx0IFxcXCIpXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHBhcmVuXFxuXFxuICBydWxlRGVzY3IgIChhIHJ1bGUgZGVzY3JpcHRpb24pXFxuICAgID0gXFxcIihcXFwiIHJ1bGVEZXNjclRleHQgXFxcIilcXFwiXFxuXFxuICBydWxlRGVzY3JUZXh0XFxuICAgID0gKH5cXFwiKVxcXCIgYW55KSpcXG5cXG4gIGNhc2VOYW1lXFxuICAgID0gXFxcIi0tXFxcIiAoflxcXCJcXFxcblxcXCIgc3BhY2UpKiBuYW1lICh+XFxcIlxcXFxuXFxcIiBzcGFjZSkqIChcXFwiXFxcXG5cXFwiIHwgJlxcXCJ9XFxcIilcXG5cXG4gIG5hbWUgIChhIG5hbWUpXFxuICAgID0gbmFtZUZpcnN0IG5hbWVSZXN0KlxcblxcbiAgbmFtZUZpcnN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgbGV0dGVyXFxuXFxuICBuYW1lUmVzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGFsbnVtXFxuXFxuICBpZGVudCAgKGFuIGlkZW50aWZpZXIpXFxuICAgID0gbmFtZVxcblxcbiAgdGVybWluYWxcXG4gICAgPSBcXFwiXFxcXFxcXCJcXFwiIHRlcm1pbmFsQ2hhciogXFxcIlxcXFxcXFwiXFxcIlxcblxcbiAgb25lQ2hhclRlcm1pbmFsXFxuICAgID0gXFxcIlxcXFxcXFwiXFxcIiB0ZXJtaW5hbENoYXIgXFxcIlxcXFxcXFwiXFxcIlxcblxcbiAgdGVybWluYWxDaGFyXFxuICAgID0gZXNjYXBlQ2hhclxcbiAgICB8IH5cXFwiXFxcXFxcXFxcXFwiIH5cXFwiXFxcXFxcXCJcXFwiIH5cXFwiXFxcXG5cXFwiIGFueVxcblxcbiAgZXNjYXBlQ2hhciAgKGFuIGVzY2FwZSBzZXF1ZW5jZSlcXG4gICAgPSBcXFwiXFxcXFxcXFxcXFxcXFxcXFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gYmFja3NsYXNoXFxuICAgIHwgXFxcIlxcXFxcXFxcXFxcXFxcXCJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGRvdWJsZVF1b3RlXFxuICAgIHwgXFxcIlxcXFxcXFxcXFxcXCdcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHNpbmdsZVF1b3RlXFxuICAgIHwgXFxcIlxcXFxcXFxcYlxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGJhY2tzcGFjZVxcbiAgICB8IFxcXCJcXFxcXFxcXG5cXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBsaW5lRmVlZFxcbiAgICB8IFxcXCJcXFxcXFxcXHJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBjYXJyaWFnZVJldHVyblxcbiAgICB8IFxcXCJcXFxcXFxcXHRcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSB0YWJcXG4gICAgfCBcXFwiXFxcXFxcXFx1XFxcIiBoZXhEaWdpdCBoZXhEaWdpdCBoZXhEaWdpdCBoZXhEaWdpdCAgLS0gdW5pY29kZUVzY2FwZVxcbiAgICB8IFxcXCJcXFxcXFxcXHhcXFwiIGhleERpZ2l0IGhleERpZ2l0ICAgICAgICAgICAgICAgICAgICAtLSBoZXhFc2NhcGVcXG5cXG4gIHNwYWNlXFxuICAgKz0gY29tbWVudFxcblxcbiAgY29tbWVudFxcbiAgICA9IFxcXCIvL1xcXCIgKH5cXFwiXFxcXG5cXFwiIGFueSkqICYoXFxcIlxcXFxuXFxcIiB8IGVuZCkgIC0tIHNpbmdsZUxpbmVcXG4gICAgfCBcXFwiLypcXFwiICh+XFxcIiovXFxcIiBhbnkpKiBcXFwiKi9cXFwiICAtLSBtdWx0aUxpbmVcXG5cXG4gIHRva2VucyA9IHRva2VuKlxcblxcbiAgdG9rZW4gPSBjYXNlTmFtZSB8IGNvbW1lbnQgfCBpZGVudCB8IG9wZXJhdG9yIHwgcHVuY3R1YXRpb24gfCB0ZXJtaW5hbCB8IGFueVxcblxcbiAgb3BlcmF0b3IgPSBcXFwiPDpcXFwiIHwgXFxcIj1cXFwiIHwgXFxcIjo9XFxcIiB8IFxcXCIrPVxcXCIgfCBcXFwiKlxcXCIgfCBcXFwiK1xcXCIgfCBcXFwiP1xcXCIgfCBcXFwiflxcXCIgfCBcXFwiJlxcXCJcXG5cXG4gIHB1bmN0dWF0aW9uID0gXFxcIjxcXFwiIHwgXFxcIj5cXFwiIHwgXFxcIixcXFwiIHwgXFxcIi0tXFxcIlxcbn1cIn0sXCJPaG1cIixudWxsLFwiR3JhbW1hcnNcIix7XCJHcmFtbWFyc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzksMzJdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNCwzMl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0LDMxXX0sXCJHcmFtbWFyXCIsW11dXV0sXCJHcmFtbWFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzYsODNdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUwLDgzXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTAsNTVdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2LDY5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTYsNjhdfSxcIlN1cGVyR3JhbW1hclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MCw3M119LFwie1wiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQsNzldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NCw3OF19LFwiUnVsZVwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MCw4M119LFwifVwiXV1dLFwiU3VwZXJHcmFtbWFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODcsMTE2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDYsMTE2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDYsMTEwXX0sXCI8OlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTEsMTE2XX0sXCJpZGVudFwiLFtdXV1dLFwiUnVsZV9kZWZpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTgxXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTcwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDEzNl19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3LDE0NV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNywxNDRdfSxcIkZvcm1hbHNcIixbXV1dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NiwxNTZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDYsMTU1XX0sXCJydWxlRGVzY3JcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU3LDE2MF19LFwiPVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjIsMTcwXX0sXCJSdWxlQm9keVwiLFtdXV1dLFwiUnVsZV9vdmVycmlkZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwyNDhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwyMzVdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMTkzXX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTQsMjAyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk0LDIwMV19LFwiRm9ybWFsc1wiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTQsMjE4XX0sXCI6PVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTksMjM1XX0sXCJPdmVycmlkZVJ1bGVCb2R5XCIsW11dXV0sXCJSdWxlX2V4dGVuZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NSwzMDVdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NSwyOTRdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTUsMjYwXX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNjEsMjY5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjYxLDI2OF19LFwiRm9ybWFsc1wiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyODEsMjg1XX0sXCIrPVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyODYsMjk0XX0sXCJSdWxlQm9keVwiLFtdXV1dLFwiUnVsZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMCwzMDVdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMSwzMDVdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTcwXX0sXCJSdWxlX2RlZmluZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMjM1XX0sXCJSdWxlX292ZXJyaWRlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NSwyOTRdfSxcIlJ1bGVfZXh0ZW5kXCIsW11dXV0sXCJSdWxlQm9keVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMwOSwzNjJdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzMyNCwzNjJdfSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMjQsMzI4XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMjQsMzI3XX0sXCJ8XCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMjksMzYyXX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNDQsMzU2XX0sXCJUb3BMZXZlbFRlcm1cIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNTgsMzYxXX0sXCJ8XCJdXV1dXSxcIlRvcExldmVsVGVybV9pbmxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODUsNDA4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODUsMzk3XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzg1LDM4OF19LFwiU2VxXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM4OSwzOTddfSxcImNhc2VOYW1lXCIsW11dXV0sXCJUb3BMZXZlbFRlcm1cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNjYsNDE4XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODUsNDE4XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzg1LDM5N119LFwiVG9wTGV2ZWxUZXJtX2lubGluZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MTUsNDE4XX0sXCJTZXFcIixbXV1dXSxcIk92ZXJyaWRlUnVsZUJvZHlcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MjIsNDkxXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NDUsNDkxXX0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDQ1LDQ0OV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDQ1LDQ0OF19LFwifFwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDUwLDQ5MV19LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDY1LDQ4NV19LFwiT3ZlcnJpZGVUb3BMZXZlbFRlcm1cIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0ODcsNDkwXX0sXCJ8XCJdXV1dXSxcIk92ZXJyaWRlVG9wTGV2ZWxUZXJtX3N1cGVyU3BsaWNlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTIyLDU0M119LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjIsNTI3XX0sXCIuLi5cIl1dLFwiT3ZlcnJpZGVUb3BMZXZlbFRlcm1cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0OTUsNTYyXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjIsNTYyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTIyLDUyN119LFwiT3ZlcnJpZGVUb3BMZXZlbFRlcm1fc3VwZXJTcGxpY2VcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTUwLDU2Ml19LFwiVG9wTGV2ZWxUZXJtXCIsW11dXV0sXCJGb3JtYWxzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTY2LDYwNl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTgwLDYwNl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTgwLDU4M119LFwiPFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1ODQsNjAyXX0sXCJMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTkxLDU5Nl19LFwiaWRlbnRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTgsNjAxXX0sXCIsXCJdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MDMsNjA2XX0sXCI+XCJdXV0sXCJQYXJhbXNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTAsNjQ3XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MjMsNjQ3XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MjMsNjI2XX0sXCI8XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYyNyw2NDNdfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MzQsNjM3XX0sXCJTZXFcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MzksNjQyXX0sXCIsXCJdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NDQsNjQ3XX0sXCI+XCJdXV0sXCJBbHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NTEsNjg1XX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NjEsNjg1XX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2NzYsNjc5XX0sXCJTZXFcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2ODEsNjg0XX0sXCJ8XCJdXV1dLFwiU2VxXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjg5LDcwNF19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzY5OSw3MDRdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2OTksNzAzXX0sXCJJdGVyXCIsW11dXV0sXCJJdGVyX3N0YXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MTksNzM2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MTksNzI3XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzE5LDcyM119LFwiUHJlZFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyNCw3MjddfSxcIipcIl1dXSxcIkl0ZXJfcGx1c1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0Myw3NjBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0Myw3NTFdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NDMsNzQ3XX0sXCJQcmVkXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQ4LDc1MV19LFwiK1wiXV1dLFwiSXRlcl9vcHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjcsNzgzXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjcsNzc1XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY3LDc3MV19LFwiUHJlZFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc3Miw3NzVdfSxcIj9cIl1dXSxcIkl0ZXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MDgsNzk0XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MTksNzk0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzE5LDcyN119LFwiSXRlcl9zdGFyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc0Myw3NTFdfSxcIkl0ZXJfcGx1c1wiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjcsNzc1XX0sXCJJdGVyX29wdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3OTAsNzk0XX0sXCJQcmVkXCIsW11dXV0sXCJQcmVkX25vdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwOSw4MjRdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwOSw4MTZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwOSw4MTJdfSxcIn5cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODEzLDgxNl19LFwiTGV4XCIsW11dXV0sXCJQcmVkX2xvb2thaGVhZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzMSw4NTJdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzMSw4MzhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzMSw4MzRdfSxcIiZcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODM1LDgzOF19LFwiTGV4XCIsW11dXV0sXCJQcmVkXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzk4LDg2Ml19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbODA5LDg2Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgwOSw4MTZdfSxcIlByZWRfbm90XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzMSw4MzhdfSxcIlByZWRfbG9va2FoZWFkXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg1OSw4NjJdfSxcIkxleFwiLFtdXV1dLFwiTGV4X2xleFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3Niw4OTJdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3Niw4ODRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3Niw4NzldfSxcIiNcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODgwLDg4NF19LFwiQmFzZVwiLFtdXV1dLFwiTGV4XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODY2LDkwM119LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbODc2LDkwM119LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg3Niw4ODRdfSxcIkxleF9sZXhcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODk5LDkwM119LFwiQmFzZVwiLFtdXV1dLFwiQmFzZV9hcHBsaWNhdGlvblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzkxOCw5NzldfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzkxOCw5NjNdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MTgsOTIzXX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MjQsOTMxXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTI0LDkzMF19LFwiUGFyYW1zXCIsW11dXSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MzIsOTYzXX0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTM0LDk2Ml19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzkzNCw5NDhdfSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MzQsOTQ0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTM0LDk0M119LFwicnVsZURlc2NyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk0NSw5NDhdfSxcIj1cIl1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTUxLDk1NV19LFwiOj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NTgsOTYyXX0sXCIrPVwiXV1dXV0sXCJCYXNlX3JhbmdlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTg2LDEwNDFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk4NiwxMDIyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTg2LDEwMDFdfSxcIm9uZUNoYXJUZXJtaW5hbFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwMDIsMTAwNl19LFwiLi5cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTAwNywxMDIyXX0sXCJvbmVDaGFyVGVybWluYWxcIixbXV1dXSxcIkJhc2VfdGVybWluYWxcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDQ4LDExMDZdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNDgsMTA1Nl19LFwidGVybWluYWxcIixbXV1dLFwiQmFzZV9wYXJlblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTMsMTE2OF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExMywxMTI0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTEzLDExMTZdfSxcIihcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTExNywxMTIwXX0sXCJBbHRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTIxLDExMjRdfSxcIilcIl1dXSxcIkJhc2VcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MDcsMTE2OF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTE4LDExNjhdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MTgsOTYzXX0sXCJCYXNlX2FwcGxpY2F0aW9uXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzk4NiwxMDIyXX0sXCJCYXNlX3JhbmdlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNDgsMTA1Nl19LFwiQmFzZV90ZXJtaW5hbFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTEzLDExMjRdfSxcIkJhc2VfcGFyZW5cIixbXV1dXSxcInJ1bGVEZXNjclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNzIsMTIzMV19LFwiYSBydWxlIGRlc2NyaXB0aW9uXCIsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIxMCwxMjMxXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjEwLDEyMTNdfSxcIihcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIxNCwxMjI3XX0sXCJydWxlRGVzY3JUZXh0XCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyOCwxMjMxXX0sXCIpXCJdXV0sXCJydWxlRGVzY3JUZXh0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIzNSwxMjY2XX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI1NSwxMjY2XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI1NiwxMjY0XX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI1NiwxMjYwXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjU3LDEyNjBdfSxcIilcIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyNjEsMTI2NF19LFwiYW55XCIsW11dXV1dLFwiY2FzZU5hbWVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjcwLDEzMzhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyODUsMTMzOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI4NSwxMjg5XX0sXCItLVwiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI5MCwxMzA0XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI5MSwxMzAyXX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI5MSwxMjk2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjkyLDEyOTZdfSxcIlxcblwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI5NywxMzAyXX0sXCJzcGFjZVwiLFtdXV1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMDUsMTMwOV19LFwibmFtZVwiLFtdXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxMCwxMzI0XX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxMSwxMzIyXX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxMSwxMzE2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEyLDEzMTZdfSxcIlxcblwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxNywxMzIyXX0sXCJzcGFjZVwiLFtdXV1dLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMjYsMTMzN119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMyNiwxMzMwXX0sXCJcXG5cIl0sW1wibG9va2FoZWFkXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMzMywxMzM3XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzM0LDEzMzddfSxcIn1cIl1dXV1dLFwibmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNDIsMTM4Ml19LFwiYSBuYW1lXCIsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM2MywxMzgyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM2MywxMzcyXX0sXCJuYW1lRmlyc3RcIixbXV0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNzMsMTM4Ml19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNzMsMTM4MV19LFwibmFtZVJlc3RcIixbXV1dXV0sXCJuYW1lRmlyc3RcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzg2LDE0MThdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MDIsMTQxOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQwMiwxNDA1XX0sXCJfXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MTIsMTQxOF19LFwibGV0dGVyXCIsW11dXV0sXCJuYW1lUmVzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MjIsMTQ1Ml19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQzNywxNDUyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDM3LDE0NDBdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ0NywxNDUyXX0sXCJhbG51bVwiLFtdXV1dLFwiaWRlbnRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDU2LDE0ODldfSxcImFuIGlkZW50aWZpZXJcIixbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDg1LDE0ODldfSxcIm5hbWVcIixbXV1dLFwidGVybWluYWxcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDkzLDE1MzFdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MDgsMTUzMV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUwOCwxNTEyXX0sXCJcXFwiXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTEzLDE1MjZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTEzLDE1MjVdfSxcInRlcm1pbmFsQ2hhclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTI3LDE1MzFdfSxcIlxcXCJcIl1dXSxcIm9uZUNoYXJUZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MzUsMTU3OV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU1NywxNTc5XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTU3LDE1NjFdfSxcIlxcXCJcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU2MiwxNTc0XX0sXCJ0ZXJtaW5hbENoYXJcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTc1LDE1NzldfSxcIlxcXCJcIl1dXSxcInRlcm1pbmFsQ2hhclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1ODMsMTY0MF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYwMiwxNjQwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYwMiwxNjEyXX0sXCJlc2NhcGVDaGFyXCIsW11dLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MTksMTY0MF19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MTksMTYyNF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYyMCwxNjI0XX0sXCJcXFxcXCJdXSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjI1LDE2MzBdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2MjYsMTYzMF19LFwiXFxcIlwiXV0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYzMSwxNjM2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjMyLDE2MzZdfSxcIlxcblwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTYzNywxNjQwXX0sXCJhbnlcIixbXV1dXV0sXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2ODMsMTczOF19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgzLDE2ODldfSxcIlxcXFxcXFxcXCJdXSxcImVzY2FwZUNoYXJfZG91YmxlUXVvdGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzQ1LDE4MDJdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc0NSwxNzUxXX0sXCJcXFxcXFxcIlwiXV0sXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTgwOSwxODY2XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4MDksMTgxNV19LFwiXFxcXCdcIl1dLFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODczLDE5MjhdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg3MywxODc4XX0sXCJcXFxcYlwiXV0sXCJlc2NhcGVDaGFyX2xpbmVGZWVkXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkzNSwxOTg5XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MzUsMTk0MF19LFwiXFxcXG5cIl1dLFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5OTYsMjA1Nl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTk2LDIwMDFdfSxcIlxcXFxyXCJdXSxcImVzY2FwZUNoYXJfdGFiXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA2MywyMTEyXX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNjMsMjA2OF19LFwiXFxcXHRcIl1dLFwiZXNjYXBlQ2hhcl91bmljb2RlRXNjYXBlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjExOSwyMTc4XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTE5LDIxNjBdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMTksMjEyNF19LFwiXFxcXHVcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyNSwyMTMzXX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTM0LDIxNDJdfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNDMsMjE1MV19LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE1MiwyMTYwXX0sXCJoZXhEaWdpdFwiLFtdXV1dLFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTg1LDIyNDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxODUsMjIwOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE4NSwyMTkwXX0sXCJcXFxceFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTkxLDIxOTldfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyMDAsMjIwOF19LFwiaGV4RGlnaXRcIixbXV1dXSxcImVzY2FwZUNoYXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjQ0LDIyNDBdfSxcImFuIGVzY2FwZSBzZXF1ZW5jZVwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2ODMsMjI0MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2ODMsMTY4OV19LFwiZXNjYXBlQ2hhcl9iYWNrc2xhc2hcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc0NSwxNzUxXX0sXCJlc2NhcGVDaGFyX2RvdWJsZVF1b3RlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4MDksMTgxNV19LFwiZXNjYXBlQ2hhcl9zaW5nbGVRdW90ZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODczLDE4NzhdfSxcImVzY2FwZUNoYXJfYmFja3NwYWNlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MzUsMTk0MF19LFwiZXNjYXBlQ2hhcl9saW5lRmVlZFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTk2LDIwMDFdfSxcImVzY2FwZUNoYXJfY2FycmlhZ2VSZXR1cm5cIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA2MywyMDY4XX0sXCJlc2NhcGVDaGFyX3RhYlwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTE5LDIxNjBdfSxcImVzY2FwZUNoYXJfdW5pY29kZUVzY2FwZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTg1LDIyMDhdfSxcImVzY2FwZUNoYXJfaGV4RXNjYXBlXCIsW11dXV0sXCJzcGFjZVwiOltcImV4dGVuZFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNDQsMjI2M119LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI1NiwyMjYzXX0sXCJjb21tZW50XCIsW11dXSxcImNvbW1lbnRfc2luZ2xlTGluZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODEsMjMyN119LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4MSwyMzEyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgxLDIyODVdfSxcIi8vXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjg2LDIyOThdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjg3LDIyOTZdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjg3LDIyOTJdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyODgsMjI5Ml19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjkzLDIyOTZdfSxcImFueVwiLFtdXV1dLFtcImxvb2thaGVhZFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyOTksMjMxMl19LFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMDEsMjMxMV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMwMSwyMzA1XX0sXCJcXG5cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMwOCwyMzExXX0sXCJlbmRcIixbXV1dXV1dLFwiY29tbWVudF9tdWx0aUxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzM0LDIzNzBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMzQsMjM1Nl19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMzNCwyMzM4XX0sXCIvKlwiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMzOSwyMzUxXX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0MCwyMzQ5XX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0MCwyMzQ1XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzQxLDIzNDVdfSxcIiovXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzQ2LDIzNDldfSxcImFueVwiLFtdXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM1MiwyMzU2XX0sXCIqL1wiXV1dLFwiY29tbWVudFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNjcsMjM3MF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4MSwyMzcwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI4MSwyMzEyXX0sXCJjb21tZW50X3NpbmdsZUxpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMzNCwyMzU2XX0sXCJjb21tZW50X211bHRpTGluZVwiLFtdXV1dLFwidG9rZW5zXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM3NCwyMzg5XX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM4MywyMzg5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM4MywyMzg4XX0sXCJ0b2tlblwiLFtdXV1dLFwidG9rZW5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzkzLDI0NjldfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MDEsMjQ2OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MDEsMjQwOV19LFwiY2FzZU5hbWVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQxMiwyNDE5XX0sXCJjb21tZW50XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MjIsMjQyN119LFwiaWRlbnRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQzMCwyNDM4XX0sXCJvcGVyYXRvclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDQxLDI0NTJdfSxcInB1bmN0dWF0aW9uXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0NTUsMjQ2M119LFwidGVybWluYWxcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ2NiwyNDY5XX0sXCJhbnlcIixbXV1dXSxcIm9wZXJhdG9yXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ3MywyNTM4XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDg0LDI1MzhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0ODQsMjQ4OF19LFwiPDpcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDkxLDI0OTRdfSxcIj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDk3LDI1MDFdfSxcIjo9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUwNCwyNTA4XX0sXCIrPVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MTEsMjUxNF19LFwiKlwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MTcsMjUyMF19LFwiK1wiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MjMsMjUyNl19LFwiP1wiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MjksMjUzMl19LFwiflwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MzUsMjUzOF19LFwiJlwiXV1dLFwicHVuY3R1YXRpb25cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNTQyLDI1NzhdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1NTYsMjU3OF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU1NiwyNTU5XX0sXCI8XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU2MiwyNTY1XX0sXCI+XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU2OCwyNTcxXX0sXCIsXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU3NCwyNTc4XX0sXCItLVwiXV1dfV0pO1xuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIk9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzIHtcXG5cXG4gIEF0dHJpYnV0ZVNpZ25hdHVyZSA9XFxuICAgIG5hbWVcXG5cXG4gIE9wZXJhdGlvblNpZ25hdHVyZSA9XFxuICAgIG5hbWUgRm9ybWFscz9cXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiKFxcXCIgTGlzdE9mPG5hbWUsIFxcXCIsXFxcIj4gXFxcIilcXFwiXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbn1cIn0sXCJPcGVyYXRpb25zQW5kQXR0cmlidXRlc1wiLG51bGwsXCJBdHRyaWJ1dGVTaWduYXR1cmVcIix7XCJBdHRyaWJ1dGVTaWduYXR1cmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyOSw1OF19LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTQsNThdfSxcIm5hbWVcIixbXV1dLFwiT3BlcmF0aW9uU2lnbmF0dXJlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjIsMTAwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NywxMDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4Nyw5MV19LFwibmFtZVwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MiwxMDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5Miw5OV19LFwiRm9ybWFsc1wiLFtdXV1dXSxcIkZvcm1hbHNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDQsMTQzXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgsMTQzXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgsMTIxXX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMiwxMzldfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjksMTMzXX0sXCJuYW1lXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM1LDEzOF19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQwLDE0M119LFwiKVwiXV1dLFwibmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NywxODddfSxcImEgbmFtZVwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OCwxODddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgsMTc3XX0sXCJuYW1lRmlyc3RcIixbXV0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OCwxODddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzgsMTg2XX0sXCJuYW1lUmVzdFwiLFtdXV1dXSxcIm5hbWVGaXJzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MSwyMjNdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNywyMjNdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNywyMTBdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3LDIyM119LFwibGV0dGVyXCIsW11dXV0sXCJuYW1lUmVzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNywyNTddfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MiwyNTddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MiwyNDVdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUyLDI1N119LFwiYWxudW1cIixbXV1dXX1dKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4uL3NyYy9jb21tb24nKS5hc3NlcnQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnNcbmZ1bmN0aW9uIGdldFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gICAgcmV0dXJuIGZuKHRoaW5nW25hbWVdKTtcbn1cbmZ1bmN0aW9uIG1hcFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gICAgcmV0dXJuIHRoaW5nW25hbWVdLm1hcChmbik7XG59XG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHdhbGsgYSBzaW5nbGUgcHJvcGVydHkgb2YgYSBub2RlLlxuLy8gYGRlc2NyaXB0b3JgIGlzIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIHByb3BlcnR5IG5hbWUsIG9wdGlvbmFsbHkgZW5kaW5nXG4vLyB3aXRoICdbXScgKGUuZy4sICdjaGlsZHJlbltdJykuXG5mdW5jdGlvbiBnZXRQcm9wV2Fsa0ZuKGRlc2NyaXB0b3IpIHtcbiAgICB2YXIgcGFydHMgPSBkZXNjcmlwdG9yLnNwbGl0KC8gP1xcW1xcXS8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIG1hcFByb3AuYmluZChudWxsLCBwYXJ0c1swXSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRQcm9wLmJpbmQobnVsbCwgZGVzY3JpcHRvcik7XG59XG5mdW5jdGlvbiBnZXRQcm9wcyh3YWxrRm5zLCB0aGluZywgZm4pIHtcbiAgICByZXR1cm4gd2Fsa0Zucy5tYXAoZnVuY3Rpb24gKHdhbGtGbikgeyByZXR1cm4gd2Fsa0ZuKHRoaW5nLCBmbik7IH0pO1xufVxuZnVuY3Rpb24gZ2V0V2Fsa0ZuKHNoYXBlKSB7XG4gICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGdldFByb3BzLmJpbmQobnVsbCwgW2dldFByb3BXYWxrRm4oc2hhcGUpXSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoc2hhcGUpKSB7XG4gICAgICAgIHJldHVybiBnZXRQcm9wcy5iaW5kKG51bGwsIHNoYXBlLm1hcChnZXRQcm9wV2Fsa0ZuKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBhc3NlcnQodHlwZW9mIHNoYXBlID09PSAnZnVuY3Rpb24nLCAnRXhwZWN0ZWQgYSBzdHJpbmcsIEFycmF5LCBvciBmdW5jdGlvbicpO1xuICAgICAgICBhc3NlcnQoc2hhcGUubGVuZ3RoID09PSAyLCAnRXhwZWN0ZWQgYSBmdW5jdGlvbiBvZiBhcml0eSAyLCBnb3QgJyArIHNoYXBlLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBzaGFwZTtcbiAgICB9XG59XG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRJZGVudGlmaWVyKHN0cikge1xuICAgIHJldHVybiAvXlthLXpBLVpfXVswLTlhLXpBLVpfXSokLy50ZXN0KHN0cik7XG59XG5mdW5jdGlvbiB0cmltKHMpIHtcbiAgICByZXR1cm4gcy50cmltKCk7XG59XG5mdW5jdGlvbiBwYXJzZVNpZ25hdHVyZShzaWcpIHtcbiAgICB2YXIgcGFydHMgPSBzaWcuc3BsaXQoL1soKV0vKS5tYXAodHJpbSk7XG4gICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMyAmJiBwYXJ0c1syXSA9PT0gJycpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBwYXJ0c1swXTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IFtdO1xuICAgICAgICBpZiAocGFydHNbMV0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcGFyYW1zID0gcGFydHNbMV0uc3BsaXQoJywnKS5tYXAodHJpbSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUmVzdHJpY3RlZElkZW50aWZpZXIobmFtZSkgJiYgcGFyYW1zLmV2ZXJ5KGlzUmVzdHJpY3RlZElkZW50aWZpZXIpKSB7XG4gICAgICAgICAgICByZXR1cm4geyBuYW1lOiBuYW1lLCBmb3JtYWxzOiBwYXJhbXMgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb3BlcmF0aW9uIHNpZ25hdHVyZTogJyArIHNpZyk7XG59XG4vKlxuICBBIFZpc2l0b3JGYW1pbHkgY29udGFpbnMgYSBzZXQgb2YgcmVjdXJzaXZlIG9wZXJhdGlvbnMgdGhhdCBhcmUgZGVmaW5lZCBvdmVyIHNvbWUga2luZCBvZlxuICB0cmVlIHN0cnVjdHVyZS4gVGhlIGBjb25maWdgIHBhcmFtZXRlciBzcGVjaWZpZXMgaG93IHRvIHdhbGsgdGhlIHRyZWU6XG4gIC0gJ2dldFRhZycgaXMgZnVuY3Rpb24gd2hpY2gsIGdpdmVuIGEgbm9kZSBpbiB0aGUgdHJlZSwgcmV0dXJucyB0aGUgbm9kZSdzICd0YWcnICh0eXBlKVxuICAtICdzaGFwZXMnIGFuIG9iamVjdCB0aGF0IG1hcHMgZnJvbSBhIHRhZyB0byBhIHZhbHVlIHRoYXQgZGVzY3JpYmVzIGhvdyB0byByZWN1cnNpdmVseVxuICAgIGV2YWx1YXRlIHRoZSBvcGVyYXRpb24gZm9yIG5vZGVzIG9mIHRoYXQgdHlwZS4gVGhlIHZhbHVlIGNhbiBiZTpcbiAgICAqIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIHByb3BlcnR5IG5hbWUgdGhhdCBob2xkcyB0aGF0IG5vZGUncyBvbmx5IGNoaWxkXG4gICAgKiBhbiBBcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyAob3IgYW4gZW1wdHkgYXJyYXkgaW5kaWNhdGluZyBhIGxlYWYgdHlwZSksIG9yXG4gICAgKiBhIGZ1bmN0aW9uIHRha2luZyB0d28gYXJndW1lbnRzIChub2RlLCBmbiksIGFuZCByZXR1cm5pbmcgYW4gQXJyYXkgd2hpY2ggaXMgdGhlIHJlc3VsdFxuICAgICAgb2YgYXBwbHkgYGZuYCB0byBlYWNoIG9mIHRoZSBub2RlJ3MgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIFZpc2l0b3JGYW1pbHkoY29uZmlnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB0aGlzLl9zaGFwZXMgPSBjb25maWcuc2hhcGVzO1xuICAgIHRoaXMuX2dldFRhZyA9IGNvbmZpZy5nZXRUYWc7XG4gICAgdGhpcy5BZGFwdGVyID0gZnVuY3Rpb24gKHRoaW5nLCBmYW1pbHkpIHtcbiAgICAgICAgdGhpcy5fYWRhcHRlZSA9IHRoaW5nO1xuICAgICAgICB0aGlzLl9mYW1pbHkgPSBmYW1pbHk7XG4gICAgfTtcbiAgICB0aGlzLkFkYXB0ZXIucHJvdG90eXBlLnZhbHVlT2YgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaGVlZXkhJyk7XG4gICAgfTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSB7fTtcbiAgICB0aGlzLl9hcml0aWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9nZXRDaGlsZHJlbiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgT2JqZWN0LmtleXModGhpcy5fc2hhcGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIHZhciBzaGFwZSA9IF90aGlzLl9zaGFwZXNba107XG4gICAgICAgIF90aGlzLl9nZXRDaGlsZHJlbltrXSA9IGdldFdhbGtGbihzaGFwZSk7XG4gICAgICAgIC8vIEEgZnVuY3Rpb24gbWVhbnMgdGhlIGFyaXR5IGlzbid0IGZpeGVkLCBzbyBkb24ndCBwdXQgYW4gZW50cnkgaW4gdGhlIGFyaXR5IG1hcC5cbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgX3RoaXMuX2FyaXRpZXNba10gPSBBcnJheS5pc0FycmF5KHNoYXBlKSA/IHNoYXBlLmxlbmd0aCA6IDE7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLl93cmFwID0gZnVuY3Rpb24gKHRoaW5nKSB7IHJldHVybiBuZXcgX3RoaXMuQWRhcHRlcih0aGluZywgX3RoaXMpOyB9O1xufVxuVmlzaXRvckZhbWlseS5wcm90b3R5cGUud3JhcCA9IGZ1bmN0aW9uICh0aGluZykge1xuICAgIHJldHVybiB0aGlzLl93cmFwKHRoaW5nKTtcbn07XG5WaXNpdG9yRmFtaWx5LnByb3RvdHlwZS5fY2hlY2tBY3Rpb25EaWN0ID0gZnVuY3Rpb24gKGRpY3QpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKGRpY3QpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgICAgYXNzZXJ0KGsgaW4gX3RoaXMuX2dldENoaWxkcmVuLCBcIlVucmVjb2duaXplZCBhY3Rpb24gbmFtZSAnXCIgKyBrICsgXCInXCIpO1xuICAgICAgICB2YXIgYWN0aW9uID0gZGljdFtrXTtcbiAgICAgICAgYXNzZXJ0KHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicsIFwiS2V5ICdcIiArIGsgKyBcIic6IGV4cGVjdGVkIGZ1bmN0aW9uLCBnb3QgXCIgKyBhY3Rpb24pO1xuICAgICAgICBpZiAoayBpbiBfdGhpcy5fYXJpdGllcykge1xuICAgICAgICAgICAgdmFyIGV4cGVjdGVkID0gX3RoaXMuX2FyaXRpZXNba107XG4gICAgICAgICAgICB2YXIgYWN0dWFsID0gZGljdFtrXS5sZW5ndGg7XG4gICAgICAgICAgICBhc3NlcnQoYWN0dWFsID09PSBleHBlY3RlZCwgXCJBY3Rpb24gJ1wiICsgayArIFwiJyBoYXMgdGhlIHdyb25nIGFyaXR5OiBleHBlY3RlZCBcIiArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuVmlzaXRvckZhbWlseS5wcm90b3R5cGUuYWRkT3BlcmF0aW9uID0gZnVuY3Rpb24gKHNpZ25hdHVyZSwgYWN0aW9ucykge1xuICAgIHZhciBzaWcgPSBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUpO1xuICAgIHZhciBuYW1lID0gc2lnLm5hbWU7XG4gICAgdGhpcy5fY2hlY2tBY3Rpb25EaWN0KGFjdGlvbnMpO1xuICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXSA9IHtcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgZm9ybWFsczogc2lnLmZvcm1hbHMsXG4gICAgICAgIGFjdGlvbnM6IGFjdGlvbnNcbiAgICB9O1xuICAgIHZhciBmYW1pbHkgPSB0aGlzO1xuICAgIHRoaXMuQWRhcHRlci5wcm90b3R5cGVbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0YWcgPSBmYW1pbHkuX2dldFRhZyh0aGlzLl9hZGFwdGVlKTtcbiAgICAgICAgYXNzZXJ0KHRhZyBpbiBmYW1pbHkuX2dldENoaWxkcmVuLCBcImdldFRhZyByZXR1cm5lZCB1bnJlY29nbml6ZWQgdGFnICdcIiArIHRhZyArIFwiJ1wiKTtcbiAgICAgICAgYXNzZXJ0KHRhZyBpbiBhY3Rpb25zLCBcIk5vIGFjdGlvbiBmb3IgJ1wiICsgdGFnICsgXCInIGluIG9wZXJhdGlvbiAnXCIgKyBuYW1lICsgXCInXCIpO1xuICAgICAgICAvLyBDcmVhdGUgYW4gXCJhcmd1bWVudHMgb2JqZWN0XCIgZnJvbSB0aGUgYXJndW1lbnRzIHRoYXQgd2VyZSBwYXNzZWQgdG8gdGhpc1xuICAgICAgICAvLyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUuXG4gICAgICAgIHZhciBhcmdzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3Nbc2lnLmZvcm1hbHNbaV1dID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvbGRBcmdzID0gdGhpcy5hcmdzO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB2YXIgYW5zID0gYWN0aW9uc1t0YWddLmFwcGx5KHRoaXMsIGZhbWlseS5fZ2V0Q2hpbGRyZW5bdGFnXSh0aGlzLl9hZGFwdGVlLCBmYW1pbHkuX3dyYXApKTtcbiAgICAgICAgdGhpcy5hcmdzID0gb2xkQXJncztcbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBWaXNpdG9yRmFtaWx5O1xuIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgVmlzaXRvckZhbWlseTogcmVxdWlyZSgnLi9WaXNpdG9yRmFtaWx5JyksXG4gICAgc2VtYW50aWNzRm9yVG9BU1Q6IHJlcXVpcmUoJy4vc2VtYW50aWNzLXRvQVNUJykuc2VtYW50aWNzLFxuICAgIHRvQVNUOiByZXF1aXJlKCcuL3NlbWFudGljcy10b0FTVCcpLmhlbHBlclxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4uL3NyYy9wZXhwcnMnKTtcbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4uL3NyYy9NYXRjaFJlc3VsdCcpO1xudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuLi9zcmMvR3JhbW1hcicpO1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBkZWZhdWx0T3BlcmF0aW9uID0ge1xuICAgIF90ZXJtaW5hbDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgfSxcbiAgICBfbm9udGVybWluYWw6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICB2YXIgY3Rvck5hbWUgPSB0aGlzLl9ub2RlLmN0b3JOYW1lO1xuICAgICAgICB2YXIgbWFwcGluZyA9IHRoaXMuYXJncy5tYXBwaW5nO1xuICAgICAgICAvLyB3aXRob3V0IGN1c3RvbWl6YXRpb25cbiAgICAgICAgaWYgKCFtYXBwaW5nLmhhc093blByb3BlcnR5KGN0b3JOYW1lKSkge1xuICAgICAgICAgICAgLy8gaW50ZXJtZWRpYXRlIG5vZGVcbiAgICAgICAgICAgIGlmICh0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFsdCB8fCB0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbGV4aWNhbCBydWxlXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xleGljYWwoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNpbmd1bGFyIG5vZGUgKGUuZy4gb25seSBzdXJyb3VuZGVkIGJ5IGxpdGVyYWxzIG9yIGxvb2thaGVhZHMpXG4gICAgICAgICAgICB2YXIgcmVhbENoaWxkcmVuID0gY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uIChjaGlsZCkgeyByZXR1cm4gIWNoaWxkLmlzVGVybWluYWwoKTsgfSk7XG4gICAgICAgICAgICBpZiAocmVhbENoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsQ2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXN0OiB0ZXJtcyB3aXRoIG11bHRpcGxlIGNoaWxkcmVuXG4gICAgICAgIH1cbiAgICAgICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nW2N0b3JOYW1lXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlblttYXBwaW5nW2N0b3JOYW1lXV0udG9BU1QobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmFtZWQvbWFwcGVkIGNoaWxkcmVuIG9yIHVubmFtZWQgY2hpbGRyZW4gKCcwJywgJzEnLCAnMicsIC4uLilcbiAgICAgICAgdmFyIHByb3BNYXAgPSBtYXBwaW5nW2N0b3JOYW1lXSB8fCBjaGlsZHJlbjtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiBjdG9yTmFtZVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHByb3BNYXApIHtcbiAgICAgICAgICAgIHZhciBtYXBwZWRQcm9wID0gbWFwcGluZ1tjdG9yTmFtZV0gJiYgbWFwcGluZ1tjdG9yTmFtZV1bcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gY2hpbGRyZW5bbWFwcGVkUHJvcF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgICAgICAgICB0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICAgICAgICAgbWFwcGVkUHJvcCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIHByaW1pdGl2ZSB2YWx1ZVxuICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBtYXBwZWRQcm9wO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdvYmplY3QnICYmIG1hcHBlZFByb3AgaW5zdGFuY2VvZiBOdW1iZXIpIHtcbiAgICAgICAgICAgICAgICAvLyBwcmltaXRpdmUgbnVtYmVyIChtdXN0IGJlIHVuYm94ZWQpXG4gICAgICAgICAgICAgICAgbm9kZVtwcm9wXSA9IE51bWJlcihtYXBwZWRQcm9wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtYXBwZWRQcm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgLy8gY29tcHV0ZWQgdmFsdWVcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gbWFwcGVkUHJvcC5jYWxsKHRoaXMsIGNoaWxkcmVuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKG1hcHBlZFByb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbltwcm9wXSAmJiAhY2hpbGRyZW5bcHJvcF0uaXNUZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBjaGlsZHJlbltwcm9wXS50b0FTVChtYXBwaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRlbGV0ZSBwcmVkZWZpbmVkICd0eXBlJyBwcm9wZXJ0aWVzLCBsaWtlICd0eXBlJywgaWYgZXhwbGljaXRlbHkgcmVtb3ZlZFxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgbm9kZVtwcm9wXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSxcbiAgICBfaXRlcjogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICAgIGlmICh0aGlzLl9ub2RlLmlzT3B0aW9uYWwoKSkge1xuICAgICAgICAgICAgaWYgKHRoaXMubnVtQ2hpbGRyZW4gPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZHJlblswXS50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sXG4gICAgTm9uZW1wdHlMaXN0T2Y6IGZ1bmN0aW9uIChmaXJzdCwgc2VwLCByZXN0KSB7XG4gICAgICAgIHJldHVybiBbZmlyc3QudG9BU1QodGhpcy5hcmdzLm1hcHBpbmcpXS5jb25jYXQocmVzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZykpO1xuICAgIH0sXG4gICAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbn07XG4vLyBSZXR1cm5zIGEgcGxhaW4gSmF2YVNjcmlwdCBvYmplY3QgdGhhdCBpbmNsdWRlcyBhbiBhYnN0cmFjdCBzeW50YXggdHJlZSAoQVNUKVxuLy8gZm9yIHRoZSBnaXZlbiBtYXRjaCByZXN1bHQgYHJlc2AgY29udGFpbmcgYSBjb25jcmV0ZSBzeW50YXggdHJlZSAoQ1NUKSBhbmQgZ3JhbW1hci5cbi8vIFRoZSBvcHRpb25hbCBgbWFwcGluZ2AgcGFyYW1ldGVyIGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBob3cgdGhlIG5vZGVzIG9mIHRoZSBDU1Rcbi8vIGFyZSBtYXBwZWQgdG8gdGhlIEFTVCAoc2VlIC9kb2MvZXh0cmFzLm1kI3RvYXN0bWF0Y2hyZXN1bHQtbWFwcGluZykuXG5mdW5jdGlvbiB0b0FTVChyZXMsIG1hcHBpbmcpIHtcbiAgICBpZiAoIShyZXMgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkgfHwgcmVzLmZhaWxlZCgpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndG9BU1QoKSBleHBlY3RzIGEgc3VjY2VzZnVsbCBNYXRjaFJlc3VsdCBhcyBmaXJzdCBwYXJhbWV0ZXInKTtcbiAgICB9XG4gICAgbWFwcGluZyA9IGV4dGVuZCh7fSwgbWFwcGluZyk7XG4gICAgdmFyIG9wZXJhdGlvbiA9IGV4dGVuZCh7fSwgZGVmYXVsdE9wZXJhdGlvbik7XG4gICAgZm9yICh2YXIgdGVybU5hbWUgaW4gbWFwcGluZykge1xuICAgICAgICBpZiAodHlwZW9mIG1hcHBpbmdbdGVybU5hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBvcGVyYXRpb25bdGVybU5hbWVdID0gbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgICAgICAgICBkZWxldGUgbWFwcGluZ1t0ZXJtTmFtZV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgdmFyIGcgPSByZXMuX2NzdC5ncmFtbWFyO1xuICAgIHZhciBzID0gZy5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3RvQVNUKG1hcHBpbmcpJywgb3BlcmF0aW9uKTtcbiAgICByZXR1cm4gcyhyZXMpLnRvQVNUKG1hcHBpbmcpO1xufVxuLy8gUmV0dXJucyBhIHNlbWFudGljcyBjb250YWluZyB0aGUgdG9BU1QobWFwcGluZykgb3BlcmF0aW9uIGZvciB0aGUgZ2l2ZW4gZ3JhbW1hciBnLlxuZnVuY3Rpb24gc2VtYW50aWNzRm9yVG9BU1QoZykge1xuICAgIGlmICghKGcgaW5zdGFuY2VvZiBHcmFtbWFyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NlbWFudGljc1RvQVNUKCkgZXhwZWN0cyBhIEdyYW1tYXIgYXMgcGFyYW1ldGVyJyk7XG4gICAgfVxuICAgIHJldHVybiBnLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBkZWZhdWx0T3BlcmF0aW9uKTtcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGhlbHBlcjogdG9BU1QsXG4gICAgc2VtYW50aWNzOiBzZW1hbnRpY3NGb3JUb0FTVFxufTtcbiIsIi8qIVxuICogRGV0ZXJtaW5lIGlmIGFuIG9iamVjdCBpcyBhIEJ1ZmZlclxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiBvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJlxuICAgIHR5cGVvZiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiYgb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyKG9iailcbn1cbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEdyYW1tYXJEZWNsID0gcmVxdWlyZSgnLi9HcmFtbWFyRGVjbCcpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIEJ1aWxkZXIoKSB7IH1cbkJ1aWxkZXIucHJvdG90eXBlID0ge1xuICAgIGN1cnJlbnREZWNsOiBudWxsLFxuICAgIGN1cnJlbnRSdWxlTmFtZTogbnVsbCxcbiAgICBuZXdHcmFtbWFyOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZXR1cm4gbmV3IEdyYW1tYXJEZWNsKG5hbWUpO1xuICAgIH0sXG4gICAgZ3JhbW1hcjogZnVuY3Rpb24gKG1ldGFJbmZvLCBuYW1lLCBzdXBlckdyYW1tYXIsIGRlZmF1bHRTdGFydFJ1bGUsIHJ1bGVzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBnRGVjbCA9IG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgICAgICAgaWYgKHN1cGVyR3JhbW1hcikge1xuICAgICAgICAgICAgZ0RlY2wud2l0aFN1cGVyR3JhbW1hcih0aGlzLmZyb21SZWNpcGUoc3VwZXJHcmFtbWFyKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgICAgICAgIGdEZWNsLndpdGhEZWZhdWx0U3RhcnRSdWxlKGRlZmF1bHRTdGFydFJ1bGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtZXRhSW5mbyAmJiBtZXRhSW5mby5zb3VyY2UpIHtcbiAgICAgICAgICAgIGdEZWNsLndpdGhTb3VyY2UobWV0YUluZm8uc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnREZWNsID0gZ0RlY2w7XG4gICAgICAgIE9iamVjdC5rZXlzKHJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICAgICAgX3RoaXMuY3VycmVudFJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICAgICAgICB2YXIgcnVsZVJlY2lwZSA9IHJ1bGVzW3J1bGVOYW1lXTtcbiAgICAgICAgICAgIHZhciBhY3Rpb24gPSBydWxlUmVjaXBlWzBdOyAvLyBkZWZpbmUvZXh0ZW5kL292ZXJyaWRlXG4gICAgICAgICAgICB2YXIgbWV0YUluZm8gPSBydWxlUmVjaXBlWzFdO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gcnVsZVJlY2lwZVsyXTtcbiAgICAgICAgICAgIHZhciBmb3JtYWxzID0gcnVsZVJlY2lwZVszXTtcbiAgICAgICAgICAgIHZhciBib2R5ID0gX3RoaXMuZnJvbVJlY2lwZShydWxlUmVjaXBlWzRdKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2U7XG4gICAgICAgICAgICBpZiAoZ0RlY2wuc291cmNlICYmIG1ldGFJbmZvICYmIG1ldGFJbmZvLnNvdXJjZUludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gZ0RlY2wuc291cmNlLnN1YkludGVydmFsKG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzBdLCBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbFsxXSAtIG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdEZWNsW2FjdGlvbl0ocnVsZU5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdXJyZW50UnVsZU5hbWUgPSB0aGlzLmN1cnJlbnREZWNsID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIGdEZWNsLmJ1aWxkKCk7XG4gICAgfSxcbiAgICB0ZXJtaW5hbDogZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuVGVybWluYWwoeCk7XG4gICAgfSxcbiAgICByYW5nZTogZnVuY3Rpb24gKGZyb20sIHRvKSB7XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlJhbmdlKGZyb20sIHRvKTtcbiAgICB9LFxuICAgIHBhcmFtOiBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuUGFyYW0oaW5kZXgpO1xuICAgIH0sXG4gICAgYWx0OiBmdW5jdGlvbiAoIC8qIHRlcm0xLCB0ZXJtMiwgLi4uICovKSB7XG4gICAgICAgIHZhciB0ZXJtcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgdmFyIGFyZyA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgICAgICAgaWYgKCEoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgICAgIGFyZyA9IHRoaXMuZnJvbVJlY2lwZShhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFyZyBpbnN0YW5jZW9mIHBleHBycy5BbHQpIHtcbiAgICAgICAgICAgICAgICB0ZXJtcyA9IHRlcm1zLmNvbmNhdChhcmcudGVybXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVybXMucHVzaChhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0ZXJtcy5sZW5ndGggPT09IDEgPyB0ZXJtc1swXSA6IG5ldyBwZXhwcnMuQWx0KHRlcm1zKTtcbiAgICB9LFxuICAgIHNlcTogZnVuY3Rpb24gKCAvKiBmYWN0b3IxLCBmYWN0b3IyLCAuLi4gKi8pIHtcbiAgICAgICAgdmFyIGZhY3RvcnMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgICAgICAgIGlmICghKGFyZyBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgICAgICBhcmcgPSB0aGlzLmZyb21SZWNpcGUoYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuU2VxKSB7XG4gICAgICAgICAgICAgICAgZmFjdG9ycyA9IGZhY3RvcnMuY29uY2F0KGFyZy5mYWN0b3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZhY3RvcnMucHVzaChhcmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWN0b3JzLmxlbmd0aCA9PT0gMSA/IGZhY3RvcnNbMF0gOiBuZXcgcGV4cHJzLlNlcShmYWN0b3JzKTtcbiAgICB9LFxuICAgIHN0YXI6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlN0YXIoZXhwcik7XG4gICAgfSxcbiAgICBwbHVzOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5QbHVzKGV4cHIpO1xuICAgIH0sXG4gICAgb3B0OiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5PcHQoZXhwcik7XG4gICAgfSxcbiAgICBub3Q6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLk5vdChleHByKTtcbiAgICB9LFxuICAgIGxhOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgdG8gc3RpbGwgYmUgYWJsZSB0byByZWFkIG9sZCByZWNpcGVzXG4gICAgICAgIHJldHVybiB0aGlzLmxvb2thaGVhZChleHByKTtcbiAgICB9LFxuICAgIGxvb2thaGVhZDogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuTG9va2FoZWFkKGV4cHIpO1xuICAgIH0sXG4gICAgbGV4OiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5MZXgoZXhwcik7XG4gICAgfSxcbiAgICBhcHA6IGZ1bmN0aW9uIChydWxlTmFtZSwgb3B0UGFyYW1zKSB7XG4gICAgICAgIGlmIChvcHRQYXJhbXMgJiYgb3B0UGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG9wdFBhcmFtcyA9IG9wdFBhcmFtcy5tYXAoZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFtIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByID8gcGFyYW0gOiB0aGlzLmZyb21SZWNpcGUocGFyYW0pO1xuICAgICAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkocnVsZU5hbWUsIG9wdFBhcmFtcyk7XG4gICAgfSxcbiAgICAvLyBOb3RlIHRoYXQgdW5saWtlIG90aGVyIG1ldGhvZHMgaW4gdGhpcyBjbGFzcywgdGhpcyBtZXRob2QgY2Fubm90IGJlIHVzZWQgYXMgYVxuICAgIC8vIGNvbnZlbmllbmNlIGNvbnN0cnVjdG9yLiBJdCBvbmx5IHdvcmtzIHdpdGggcmVjaXBlcywgYmVjYXVzZSBpdCByZWxpZXMgb25cbiAgICAvLyBgdGhpcy5jdXJyZW50RGVjbGAgYW5kIGB0aGlzLmN1cnJlbnRSdWxlTmFtZWAgYmVpbmcgc2V0LlxuICAgIHNwbGljZTogZnVuY3Rpb24gKGJlZm9yZVRlcm1zLCBhZnRlclRlcm1zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlNwbGljZSh0aGlzLmN1cnJlbnREZWNsLnN1cGVyR3JhbW1hciwgdGhpcy5jdXJyZW50UnVsZU5hbWUsIGJlZm9yZVRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gX3RoaXMuZnJvbVJlY2lwZSh0ZXJtKTsgfSksIGFmdGVyVGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiBfdGhpcy5mcm9tUmVjaXBlKHRlcm0pOyB9KSk7XG4gICAgfSxcbiAgICBmcm9tUmVjaXBlOiBmdW5jdGlvbiAocmVjaXBlKSB7XG4gICAgICAgIC8vIHRoZSBtZXRhLWluZm8gb2YgJ2dyYW1tYXInIGlzIHByb2Nlc3NlZCBpbiBCdWlsZGVyLmdyYW1tYXJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXNbcmVjaXBlWzBdXS5hcHBseSh0aGlzLCByZWNpcGVbMF0gPT09ICdncmFtbWFyJyA/IHJlY2lwZS5zbGljZSgxKSA6IHJlY2lwZS5zbGljZSgyKSk7XG4gICAgICAgIHZhciBtZXRhSW5mbyA9IHJlY2lwZVsxXTtcbiAgICAgICAgaWYgKG1ldGFJbmZvKSB7XG4gICAgICAgICAgICBpZiAobWV0YUluZm8uc291cmNlSW50ZXJ2YWwgJiYgdGhpcy5jdXJyZW50RGVjbCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC53aXRoU291cmNlKHRoaXMuY3VycmVudERlY2wuc291cmNlSW50ZXJ2YWwuYXBwbHkodGhpcy5jdXJyZW50RGVjbCwgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG52YXIgVGVybWluYWxOb2RlID0gcmVxdWlyZSgnLi9ub2RlcycpLlRlcm1pbmFsTm9kZTtcbnZhciBhc3NlcnQgPSByZXF1aXJlKCcuL2NvbW1vbicpLmFzc2VydDtcbnZhciBfYSA9IHJlcXVpcmUoJy4vcGV4cHJzJyksIFBFeHByID0gX2EuUEV4cHIsIFRlcm1pbmFsID0gX2EuVGVybWluYWw7XG52YXIgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsKHBhcmFtKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm9iaiA9IHBhcmFtO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZS5fZ2V0U3RyaW5nID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHZhciB0ZXJtaW5hbCA9IHN0YXRlLmN1cnJlbnRBcHBsaWNhdGlvbigpLmFyZ3NbdGhpcy5vYmouaW5kZXhdO1xuICAgICAgICBhc3NlcnQodGVybWluYWwgaW5zdGFuY2VvZiBUZXJtaW5hbCwgJ2V4cGVjdGVkIGEgVGVybWluYWwgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdGVybWluYWwub2JqO1xuICAgIH07XG4gICAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIFBFeHByIEFQSVxuICAgIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgICAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gdGhpcy5fZ2V0U3RyaW5nKHN0YXRlKTtcbiAgICAgICAgaWYgKCFpbnB1dFN0cmVhbS5tYXRjaFN0cmluZyhtYXRjaFN0ciwgdHJ1ZSkpIHtcbiAgICAgICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUucHVzaEJpbmRpbmcobmV3IFRlcm1pbmFsTm9kZShzdGF0ZS5ncmFtbWFyLCBtYXRjaFN0ciksIG9yaWdQb3MpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgICAgICAvLyBTdGFydCB3aXRoIGEgZXhhbXBsZSBnZW5lcmF0ZWQgZnJvbSB0aGUgVGVybWluYWwuLi5cbiAgICAgICAgdmFyIHN0ciA9IHRoaXMub2JqLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKS52YWx1ZTtcbiAgICAgICAgLy8gLi4uYW5kIHJhbmRvbWx5IHN3aXRjaCBjaGFyYWN0ZXJzIHRvIHVwcGVyY2FzZS9sb3dlcmNhc2UuXG4gICAgICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFsdWUgKz0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IHN0cltpXS50b0xvY2FsZUxvd2VyQ2FzZSgpIDogc3RyW2ldLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlIH07XG4gICAgfTtcbiAgICBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgICAgICByZXR1cm4gbmV3IENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsKHRoaXMub2JqLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscykpO1xuICAgIH07XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLnRvRGlzcGxheVN0cmluZygpICsgJyAoY2FzZS1pbnNlbnNpdGl2ZSknO1xuICAgIH07XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCB0aGlzLm9iai50b0ZhaWx1cmUoZ3JhbW1hcikgKyAnIChjYXNlLWluc2Vuc2l0aXZlKScsICdkZXNjcmlwdGlvbicpO1xuICAgIH07XG4gICAgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pO1xuICAgIH07XG4gICAgcmV0dXJuIENhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsO1xufShQRXhwcikpO1xubW9kdWxlLmV4cG9ydHMgPSBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgYEZhaWx1cmVgcyByZXByZXNlbnQgZXhwcmVzc2lvbnMgdGhhdCB3ZXJlbid0IG1hdGNoZWQgd2hpbGUgcGFyc2luZy4gVGhleSBhcmUgdXNlZCB0byBnZW5lcmF0ZVxuICBlcnJvciBtZXNzYWdlcyBhdXRvbWF0aWNhbGx5LiBUaGUgaW50ZXJmYWNlIG9mIGBGYWlsdXJlYHMgaW5jbHVkZXMgdGhlIGNvbGxvd2luZyBtZXRob2RzOlxuXG4gIC0gZ2V0VGV4dCgpIDogU3RyaW5nXG4gIC0gZ2V0VHlwZSgpIDogU3RyaW5nICAob25lIG9mIHtcImRlc2NyaXB0aW9uXCIsIFwic3RyaW5nXCIsIFwiY29kZVwifSlcbiAgLSBpc0Rlc2NyaXB0aW9uKCkgOiBib29sXG4gIC0gaXNTdHJpbmdUZXJtaW5hbCgpIDogYm9vbFxuICAtIGlzQ29kZSgpIDogYm9vbFxuICAtIGlzRmx1ZmZ5KCkgOiBib29sXG4gIC0gbWFrZUZsdWZmeSgpIDogdm9pZFxuICAtIHN1YnN1bWVzKEZhaWx1cmUpIDogYm9vbFxuKi9cbmZ1bmN0aW9uIGlzVmFsaWRUeXBlKHR5cGUpIHtcbiAgICByZXR1cm4gdHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJyB8fCB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlID09PSAnY29kZSc7XG59XG5mdW5jdGlvbiBGYWlsdXJlKHBleHByLCB0ZXh0LCB0eXBlKSB7XG4gICAgaWYgKCFpc1ZhbGlkVHlwZSh0eXBlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgRmFpbHVyZSB0eXBlOiAnICsgdHlwZSk7XG4gICAgfVxuICAgIHRoaXMucGV4cHIgPSBwZXhwcjtcbiAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn1cbkZhaWx1cmUucHJvdG90eXBlLmdldFBFeHByID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnBleHByO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmdldFRleHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dDtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUeXBlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGU7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuaXNEZXNjcmlwdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSAnZGVzY3JpcHRpb24nO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmlzU3RyaW5nVGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZyc7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuaXNDb2RlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdjb2RlJztcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5pc0ZsdWZmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5mbHVmZnk7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUubWFrZUZsdWZmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZsdWZmeSA9IHRydWU7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuY2xlYXJGbHVmZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mbHVmZnkgPSBmYWxzZTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5zdWJzdW1lcyA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgcmV0dXJuICh0aGlzLmdldFRleHQoKSA9PT0gdGhhdC5nZXRUZXh0KCkgJiZcbiAgICAgICAgdGhpcy50eXBlID09PSB0aGF0LnR5cGUgJiZcbiAgICAgICAgKCF0aGlzLmlzRmx1ZmZ5KCkgfHwgKHRoaXMuaXNGbHVmZnkoKSAmJiB0aGF0LmlzRmx1ZmZ5KCkpKSk7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZycgPyBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFRleHQoKSkgOiB0aGlzLmdldFRleHQoKTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmFpbHVyZSA9IG5ldyBGYWlsdXJlKHRoaXMucGV4cHIsIHRoaXMudGV4dCwgdGhpcy50eXBlKTtcbiAgICBpZiAodGhpcy5pc0ZsdWZmeSgpKSB7XG4gICAgICAgIGZhaWx1cmUubWFrZUZsdWZmeSgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFpbHVyZTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS50b0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpICsgJyMnICsgdGhpcy50eXBlO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBGYWlsdXJlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwgPSByZXF1aXJlKCcuL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsJyk7XG52YXIgTWF0Y2hlciA9IHJlcXVpcmUoJy4vTWF0Y2hlcicpO1xudmFyIFNlbWFudGljcyA9IHJlcXVpcmUoJy4vU2VtYW50aWNzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldFNvcnRlZFJ1bGVWYWx1ZXMoZ3JhbW1hcikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhncmFtbWFyLnJ1bGVzKVxuICAgICAgICAuc29ydCgpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIGdyYW1tYXIucnVsZXNbbmFtZV07IH0pO1xufVxuZnVuY3Rpb24gR3JhbW1hcihuYW1lLCBzdXBlckdyYW1tYXIsIHJ1bGVzLCBvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICB0aGlzLnJ1bGVzID0gcnVsZXM7XG4gICAgaWYgKG9wdERlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgICAgaWYgKCEob3B0RGVmYXVsdFN0YXJ0UnVsZSBpbiBydWxlcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3RhcnQgcnVsZTogJ1wiICtcbiAgICAgICAgICAgICAgICBvcHREZWZhdWx0U3RhcnRSdWxlICtcbiAgICAgICAgICAgICAgICBcIicgaXMgbm90IGEgcnVsZSBpbiBncmFtbWFyICdcIiArXG4gICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IG9wdERlZmF1bHRTdGFydFJ1bGU7XG4gICAgfVxufVxudmFyIG9obUdyYW1tYXI7XG52YXIgYnVpbGRHcmFtbWFyO1xuLy8gVGhpcyBtZXRob2QgaXMgY2FsbGVkIGZyb20gbWFpbi5qcyBvbmNlIE9obSBoYXMgbG9hZGVkLlxuR3JhbW1hci5pbml0QXBwbGljYXRpb25QYXJzZXIgPSBmdW5jdGlvbiAoZ3JhbW1hciwgYnVpbGRlckZuKSB7XG4gICAgb2htR3JhbW1hciA9IGdyYW1tYXI7XG4gICAgYnVpbGRHcmFtbWFyID0gYnVpbGRlckZuO1xufTtcbkdyYW1tYXIucHJvdG90eXBlID0ge1xuICAgIG1hdGNoZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRjaGVyKHRoaXMpO1xuICAgIH0sXG4gICAgLy8gUmV0dXJuIHRydWUgaWYgdGhlIGdyYW1tYXIgaXMgYSBidWlsdC1pbiBncmFtbWFyLCBvdGhlcndpc2UgZmFsc2UuXG4gICAgLy8gTk9URTogVGhpcyBtaWdodCBnaXZlIGFuIHVuZXhwZWN0ZWQgcmVzdWx0IGlmIGNhbGxlZCBiZWZvcmUgQnVpbHRJblJ1bGVzIGlzIGRlZmluZWQhXG4gICAgaXNCdWlsdEluOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzID09PSBHcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzIHx8IHRoaXMgPT09IEdyYW1tYXIuQnVpbHRJblJ1bGVzO1xuICAgIH0sXG4gICAgZXF1YWxzOiBmdW5jdGlvbiAoZykge1xuICAgICAgICBpZiAodGhpcyA9PT0gZykge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gdGhlIGNoZWFwZXN0IGNvbXBhcmlzb25zIGZpcnN0LlxuICAgICAgICBpZiAoZyA9PSBudWxsIHx8XG4gICAgICAgICAgICB0aGlzLm5hbWUgIT09IGcubmFtZSB8fFxuICAgICAgICAgICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlICE9PSBnLmRlZmF1bHRTdGFydFJ1bGUgfHxcbiAgICAgICAgICAgICEodGhpcy5zdXBlckdyYW1tYXIgPT09IGcuc3VwZXJHcmFtbWFyIHx8IHRoaXMuc3VwZXJHcmFtbWFyLmVxdWFscyhnLnN1cGVyR3JhbW1hcikpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG15UnVsZXMgPSBnZXRTb3J0ZWRSdWxlVmFsdWVzKHRoaXMpO1xuICAgICAgICB2YXIgb3RoZXJSdWxlcyA9IGdldFNvcnRlZFJ1bGVWYWx1ZXMoZyk7XG4gICAgICAgIHJldHVybiAobXlSdWxlcy5sZW5ndGggPT09IG90aGVyUnVsZXMubGVuZ3RoICYmXG4gICAgICAgICAgICBteVJ1bGVzLmV2ZXJ5KGZ1bmN0aW9uIChydWxlLCBpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChydWxlLmRlc2NyaXB0aW9uID09PSBvdGhlclJ1bGVzW2ldLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgICAgIHJ1bGUuZm9ybWFscy5qb2luKCcsJykgPT09IG90aGVyUnVsZXNbaV0uZm9ybWFscy5qb2luKCcsJykgJiZcbiAgICAgICAgICAgICAgICAgICAgcnVsZS5ib2R5LnRvU3RyaW5nKCkgPT09IG90aGVyUnVsZXNbaV0uYm9keS50b1N0cmluZygpKTtcbiAgICAgICAgICAgIH0pKTtcbiAgICB9LFxuICAgIG1hdGNoOiBmdW5jdGlvbiAoaW5wdXQsIG9wdFN0YXJ0QXBwbGljYXRpb24pIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1hdGNoZXIoKTtcbiAgICAgICAgbS5yZXBsYWNlSW5wdXRSYW5nZSgwLCAwLCBpbnB1dCk7XG4gICAgICAgIHJldHVybiBtLm1hdGNoKG9wdFN0YXJ0QXBwbGljYXRpb24pO1xuICAgIH0sXG4gICAgdHJhY2U6IGZ1bmN0aW9uIChpbnB1dCwgb3B0U3RhcnRBcHBsaWNhdGlvbikge1xuICAgICAgICB2YXIgbSA9IHRoaXMubWF0Y2hlcigpO1xuICAgICAgICBtLnJlcGxhY2VJbnB1dFJhbmdlKDAsIDAsIGlucHV0KTtcbiAgICAgICAgcmV0dXJuIG0udHJhY2Uob3B0U3RhcnRBcHBsaWNhdGlvbik7XG4gICAgfSxcbiAgICBjcmVhdGVTZW1hbnRpY3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3ModGhpcyk7XG4gICAgfSxcbiAgICBleHRlbmRTZW1hbnRpY3M6IGZ1bmN0aW9uIChzdXBlclNlbWFudGljcykge1xuICAgICAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzLCBzdXBlclNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCkpO1xuICAgIH0sXG4gICAgLy8gQ2hlY2sgdGhhdCBldmVyeSBrZXkgaW4gYGFjdGlvbkRpY3RgIGNvcnJlc3BvbmRzIHRvIGEgc2VtYW50aWMgYWN0aW9uLCBhbmQgdGhhdCBpdCBtYXBzIHRvXG4gICAgLy8gYSBmdW5jdGlvbiBvZiB0aGUgY29ycmVjdCBhcml0eS4gSWYgbm90LCB0aHJvdyBhbiBleGNlcHRpb24uXG4gICAgX2NoZWNrVG9wRG93bkFjdGlvbkRpY3Q6IGZ1bmN0aW9uICh3aGF0LCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGlzU3BlY2lhbEFjdGlvbihhKSB7XG4gICAgICAgICAgICByZXR1cm4gYSA9PT0gJ19pdGVyJyB8fCBhID09PSAnX3Rlcm1pbmFsJyB8fCBhID09PSAnX25vbnRlcm1pbmFsJyB8fCBhID09PSAnX2RlZmF1bHQnO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwcm9ibGVtcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBrIGluIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgICAgIHZhciB2ID0gYWN0aW9uRGljdFtrXTtcbiAgICAgICAgICAgIGlmICghaXNTcGVjaWFsQWN0aW9uKGspICYmICEoayBpbiB0aGlzLnJ1bGVzKSkge1xuICAgICAgICAgICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIGlzIG5vdCBhIHZhbGlkIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHYgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBwcm9ibGVtcy5wdXNoKFwiJ1wiICsgayArIFwiJyBtdXN0IGJlIGEgZnVuY3Rpb24gaW4gYW4gYWN0aW9uIGRpY3Rpb25hcnkgZm9yICdcIiArIHRoaXMubmFtZSArIFwiJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBhY3R1YWwgPSB2Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgZXhwZWN0ZWQgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkoayk7XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvYmxlbXMucHVzaChcIlNlbWFudGljIGFjdGlvbiAnXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgayArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIicgaGFzIHRoZSB3cm9uZyBhcml0eTogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2V4cGVjdGVkICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJywgZ290ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2JsZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwcmV0dHlQcm9ibGVtcyA9IHByb2JsZW1zLm1hcChmdW5jdGlvbiAocHJvYmxlbSkgeyByZXR1cm4gJy0gJyArIHByb2JsZW07IH0pO1xuICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKFwiRm91bmQgZXJyb3JzIGluIHRoZSBhY3Rpb24gZGljdGlvbmFyeSBvZiB0aGUgJ1wiICtcbiAgICAgICAgICAgICAgICBuYW1lICtcbiAgICAgICAgICAgICAgICBcIicgXCIgK1xuICAgICAgICAgICAgICAgIHdoYXQgK1xuICAgICAgICAgICAgICAgICc6XFxuJyArXG4gICAgICAgICAgICAgICAgcHJldHR5UHJvYmxlbXMuam9pbignXFxuJykpO1xuICAgICAgICAgICAgZXJyb3IucHJvYmxlbXMgPSBwcm9ibGVtcztcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBSZXR1cm4gdGhlIGV4cGVjdGVkIGFyaXR5IGZvciBhIHNlbWFudGljIGFjdGlvbiBuYW1lZCBgYWN0aW9uTmFtZWAsIHdoaWNoXG4gICAgLy8gaXMgZWl0aGVyIGEgcnVsZSBuYW1lIG9yIGEgc3BlY2lhbCBhY3Rpb24gbmFtZSBsaWtlICdfbm9udGVybWluYWwnLlxuICAgIF90b3BEb3duQWN0aW9uQXJpdHk6IGZ1bmN0aW9uIChhY3Rpb25OYW1lKSB7XG4gICAgICAgIGlmIChhY3Rpb25OYW1lID09PSAnX2l0ZXInIHx8IGFjdGlvbk5hbWUgPT09ICdfbm9udGVybWluYWwnIHx8IGFjdGlvbk5hbWUgPT09ICdfZGVmYXVsdCcpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbk5hbWUgPT09ICdfdGVybWluYWwnKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5ydWxlc1thY3Rpb25OYW1lXS5ib2R5LmdldEFyaXR5KCk7XG4gICAgfSxcbiAgICBfaW5oZXJpdHNGcm9tOiBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgICAgICB2YXIgZyA9IHRoaXMuc3VwZXJHcmFtbWFyO1xuICAgICAgICB3aGlsZSAoZykge1xuICAgICAgICAgICAgaWYgKGcuZXF1YWxzKGdyYW1tYXIsIHRydWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnID0gZy5zdXBlckdyYW1tYXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0sXG4gICAgdG9SZWNpcGU6IGZ1bmN0aW9uIChvcHRWYXJOYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBtZXRhSW5mbyA9IHt9O1xuICAgICAgICAvLyBJbmNsdWRlIHRoZSBncmFtbWFyIHNvdXJjZSBpZiBpdCBpcyBhdmFpbGFibGUuXG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgICAgICAgbWV0YUluZm8uc291cmNlID0gdGhpcy5zb3VyY2UuY29udGVudHM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN1cGVyR3JhbW1hciA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hciAmJiAhdGhpcy5zdXBlckdyYW1tYXIuaXNCdWlsdEluKCkpIHtcbiAgICAgICAgICAgIHN1cGVyR3JhbW1hciA9IEpTT04ucGFyc2UodGhpcy5zdXBlckdyYW1tYXIudG9SZWNpcGUoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0YXJ0UnVsZSA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLmRlZmF1bHRTdGFydFJ1bGUpIHtcbiAgICAgICAgICAgIHN0YXJ0UnVsZSA9IHRoaXMuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcnVsZXMgPSB7fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5ydWxlcykuZm9yRWFjaChmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBydWxlSW5mbyA9IF90aGlzLnJ1bGVzW3J1bGVOYW1lXTtcbiAgICAgICAgICAgIHZhciBib2R5ID0gcnVsZUluZm8uYm9keTtcbiAgICAgICAgICAgIHZhciBpc0RlZmluaXRpb24gPSAhX3RoaXMuc3VwZXJHcmFtbWFyIHx8ICFfdGhpcy5zdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgdmFyIG9wZXJhdGlvbjtcbiAgICAgICAgICAgIGlmIChpc0RlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAnZGVmaW5lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9IGJvZHkgaW5zdGFuY2VvZiBwZXhwcnMuRXh0ZW5kID8gJ2V4dGVuZCcgOiAnb3ZlcnJpZGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1ldGFJbmZvID0ge307XG4gICAgICAgICAgICBpZiAocnVsZUluZm8uc291cmNlICYmIF90aGlzLnNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHZhciBhZGp1c3RlZCA9IHJ1bGVJbmZvLnNvdXJjZS5yZWxhdGl2ZVRvKF90aGlzLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwgPSBbYWRqdXN0ZWQuc3RhcnRJZHgsIGFkanVzdGVkLmVuZElkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRpb24gPSBpc0RlZmluaXRpb24gPyBydWxlSW5mby5kZXNjcmlwdGlvbiA6IG51bGw7XG4gICAgICAgICAgICB2YXIgYm9keVJlY2lwZSA9IGJvZHkub3V0cHV0UmVjaXBlKHJ1bGVJbmZvLmZvcm1hbHMsIF90aGlzLnNvdXJjZSk7XG4gICAgICAgICAgICBydWxlc1tydWxlTmFtZV0gPSBbXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGFJbmZvLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIHJ1bGVJbmZvLmZvcm1hbHMsXG4gICAgICAgICAgICAgICAgYm9keVJlY2lwZVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbJ2dyYW1tYXInLCBtZXRhSW5mbywgdGhpcy5uYW1lLCBzdXBlckdyYW1tYXIsIHN0YXJ0UnVsZSwgcnVsZXNdKTtcbiAgICB9LFxuICAgIC8vIFRPRE86IENvbWUgdXAgd2l0aCBiZXR0ZXIgbmFtZXMgZm9yIHRoZXNlIG1ldGhvZHMuXG4gICAgLy8gVE9ETzogV3JpdGUgdGhlIGFuYWxvZyBvZiB0aGVzZSBtZXRob2RzIGZvciBpbmhlcml0ZWQgYXR0cmlidXRlcy5cbiAgICB0b09wZXJhdGlvbkFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICAgIH0sXG4gICAgdG9BdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGUoKTtcbiAgICB9LFxuICAgIF90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IGFkZCB0aGUgc3VwZXItZ3JhbW1hcidzIHRlbXBsYXRlcyBhdCB0aGUgcmlnaHQgcGxhY2UsIGUuZy4sIGEgY2FzZSBmb3IgQWRkRXhwcl9wbHVzXG4gICAgICAgIC8vIHNob3VsZCBhcHBlYXIgbmV4dCB0byBvdGhlciBjYXNlcyBvZiBBZGRFeHByLlxuICAgICAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgICAgICBzYi5hcHBlbmQoJ3snKTtcbiAgICAgICAgdmFyIGZpcnN0ID0gdHJ1ZTtcbiAgICAgICAgZm9yICh2YXIgcnVsZU5hbWUgaW4gdGhpcy5ydWxlcykge1xuICAgICAgICAgICAgdmFyIGJvZHkgPSB0aGlzLnJ1bGVzW3J1bGVOYW1lXS5ib2R5O1xuICAgICAgICAgICAgaWYgKGZpcnN0KSB7XG4gICAgICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNiLmFwcGVuZCgnLCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2IuYXBwZW5kKCdcXG4nKTtcbiAgICAgICAgICAgIHNiLmFwcGVuZCgnICAnKTtcbiAgICAgICAgICAgIHRoaXMuYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZShydWxlTmFtZSwgYm9keSwgc2IpO1xuICAgICAgICB9XG4gICAgICAgIHNiLmFwcGVuZCgnXFxufScpO1xuICAgICAgICByZXR1cm4gc2IuY29udGVudHMoKTtcbiAgICB9LFxuICAgIGFkZFNlbWFudGljQWN0aW9uVGVtcGxhdGU6IGZ1bmN0aW9uIChydWxlTmFtZSwgYm9keSwgc2IpIHtcbiAgICAgICAgc2IuYXBwZW5kKHJ1bGVOYW1lKTtcbiAgICAgICAgc2IuYXBwZW5kKCc6IGZ1bmN0aW9uKCcpO1xuICAgICAgICB2YXIgYXJpdHkgPSB0aGlzLl90b3BEb3duQWN0aW9uQXJpdHkocnVsZU5hbWUpO1xuICAgICAgICBzYi5hcHBlbmQoY29tbW9uLnJlcGVhdCgnXycsIGFyaXR5KS5qb2luKCcsICcpKTtcbiAgICAgICAgc2IuYXBwZW5kKCcpIHtcXG4nKTtcbiAgICAgICAgc2IuYXBwZW5kKCcgIH0nKTtcbiAgICB9LFxuICAgIC8vIFBhcnNlIGEgc3RyaW5nIHdoaWNoIGV4cHJlc3NlcyBhIHJ1bGUgYXBwbGljYXRpb24gaW4gdGhpcyBncmFtbWFyLCBhbmQgcmV0dXJuIHRoZVxuICAgIC8vIHJlc3VsdGluZyBBcHBseSBub2RlLlxuICAgIHBhcnNlQXBwbGljYXRpb246IGZ1bmN0aW9uIChzdHIpIHtcbiAgICAgICAgdmFyIGFwcDtcbiAgICAgICAgaWYgKHN0ci5pbmRleE9mKCc8JykgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBzaW1wbGUgYXBwbGljYXRpb25cbiAgICAgICAgICAgIGFwcCA9IG5ldyBwZXhwcnMuQXBwbHkoc3RyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIHBhcmFtZXRlcml6ZWQgYXBwbGljYXRpb25cbiAgICAgICAgICAgIHZhciBjc3QgPSBvaG1HcmFtbWFyLm1hdGNoKHN0ciwgJ0Jhc2VfYXBwbGljYXRpb24nKTtcbiAgICAgICAgICAgIGFwcCA9IGJ1aWxkR3JhbW1hcihjc3QsIHt9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbnN1cmUgdGhhdCB0aGUgYXBwbGljYXRpb24gaXMgdmFsaWQuXG4gICAgICAgIGlmICghKGFwcC5ydWxlTmFtZSBpbiB0aGlzLnJ1bGVzKSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRSdWxlKGFwcC5ydWxlTmFtZSwgdGhpcy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZm9ybWFscyA9IHRoaXMucnVsZXNbYXBwLnJ1bGVOYW1lXS5mb3JtYWxzO1xuICAgICAgICBpZiAoZm9ybWFscy5sZW5ndGggIT09IGFwcC5hcmdzLmxlbmd0aCkge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMucnVsZXNbYXBwLnJ1bGVOYW1lXS5zb3VyY2U7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMud3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMoYXBwLnJ1bGVOYW1lLCBmb3JtYWxzLmxlbmd0aCwgYXBwLmFyZ3MubGVuZ3RoLCBzb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhcHA7XG4gICAgfVxufTtcbi8vIFRoZSBmb2xsb3dpbmcgZ3JhbW1hciBjb250YWlucyBhIGZldyBydWxlcyB0aGF0IGNvdWxkbid0IGJlIHdyaXR0ZW4gIGluIFwidXNlcmxhbmRcIi5cbi8vIEF0IHRoZSBib3R0b20gb2Ygc3JjL21haW4uanMsIHdlIGNyZWF0ZSBhIHN1Yi1ncmFtbWFyIG9mIHRoaXMgZ3JhbW1hciB0aGF0J3MgY2FsbGVkXG4vLyBgQnVpbHRJblJ1bGVzYC4gVGhhdCBncmFtbWFyIGNvbnRhaW5zIHNldmVyYWwgY29udmVuaWVuY2UgcnVsZXMsIGUuZy4sIGBsZXR0ZXJgIGFuZFxuLy8gYGRpZ2l0YCwgYW5kIGlzIGltcGxpY2l0bHkgdGhlIHN1cGVyLWdyYW1tYXIgb2YgYW55IGdyYW1tYXIgd2hvc2Ugc3VwZXItZ3JhbW1hclxuLy8gaXNuJ3Qgc3BlY2lmaWVkLlxuR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA9IG5ldyBHcmFtbWFyKCdQcm90b0J1aWx0SW5SdWxlcycsIC8vIG5hbWVcbnVuZGVmaW5lZCwgLy8gc3VwZXJncmFtbWFyXG57XG4gICAgYW55OiB7XG4gICAgICAgIGJvZHk6IHBleHBycy5hbnksXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2FueSBjaGFyYWN0ZXInLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIGVuZDoge1xuICAgICAgICBib2R5OiBwZXhwcnMuZW5kLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdlbmQgb2YgaW5wdXQnLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIGNhc2VJbnNlbnNpdGl2ZToge1xuICAgICAgICBib2R5OiBuZXcgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwobmV3IHBleHBycy5QYXJhbSgwKSksXG4gICAgICAgIGZvcm1hbHM6IFsnc3RyJ10sXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgbG93ZXI6IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5Vbmljb2RlQ2hhcignTGwnKSxcbiAgICAgICAgZm9ybWFsczogW10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYSBsb3dlcmNhc2UgbGV0dGVyJyxcbiAgICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICB1cHBlcjoge1xuICAgICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdScpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhbiB1cHBlcmNhc2UgbGV0dGVyJyxcbiAgICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICAvLyBVbmlvbiBvZiBMdCAodGl0bGVjYXNlKSwgTG0gKG1vZGlmaWVyKSwgYW5kIExvIChvdGhlciksIGkuZS4gYW55IGxldHRlciBub3QgaW4gTGwgb3IgTHUuXG4gICAgdW5pY29kZUx0bW86IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5Vbmljb2RlQ2hhcignTHRtbycpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhIFVuaWNvZGUgY2hhcmFjdGVyIGluIEx0LCBMbSwgb3IgTG8nLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIC8vIFRoZXNlIHJ1bGVzIGFyZSBub3QgdHJ1bHkgcHJpbWl0aXZlICh0aGV5IGNvdWxkIGJlIHdyaXR0ZW4gaW4gdXNlcmxhbmQpIGJ1dCBhcmUgZGVmaW5lZFxuICAgIC8vIGhlcmUgZm9yIGJvb3RzdHJhcHBpbmcgcHVycG9zZXMuXG4gICAgc3BhY2VzOiB7XG4gICAgICAgIGJvZHk6IG5ldyBwZXhwcnMuU3RhcihuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZScpKSxcbiAgICAgICAgZm9ybWFsczogW11cbiAgICB9LFxuICAgIHNwYWNlOiB7XG4gICAgICAgIGJvZHk6IG5ldyBwZXhwcnMuUmFuZ2UoJ1xceDAwJywgJyAnKSxcbiAgICAgICAgZm9ybWFsczogW10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYSBzcGFjZSdcbiAgICB9XG59KTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgR3JhbW1hciA9IHJlcXVpcmUoJy4vR3JhbW1hcicpO1xudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgU3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBDb25zdHJ1Y3RvcnNcbmZ1bmN0aW9uIEdyYW1tYXJEZWNsKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xufVxuLy8gSGVscGVyc1xuR3JhbW1hckRlY2wucHJvdG90eXBlLnNvdXJjZUludGVydmFsID0gZnVuY3Rpb24gKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc3ViSW50ZXJ2YWwoc3RhcnRJZHgsIGVuZElkeCAtIHN0YXJ0SWR4KTtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZW5zdXJlU3VwZXJHcmFtbWFyID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICAgICAgdGhpcy53aXRoU3VwZXJHcmFtbWFyKFxuICAgICAgICAvLyBUT0RPOiBUaGUgY29uZGl0aW9uYWwgZXhwcmVzc2lvbiBiZWxvdyBpcyBhbiB1Z2x5IGhhY2suIEl0J3Mga2luZCBvZiBvayBiZWNhdXNlXG4gICAgICAgIC8vIEkgZG91YnQgYW55b25lIHdpbGwgZXZlciB0cnkgdG8gZGVjbGFyZSBhIGdyYW1tYXIgY2FsbGVkIGBCdWlsdEluUnVsZXNgLiBTdGlsbCxcbiAgICAgICAgLy8gd2Ugc2hvdWxkIHRyeSB0byBmaW5kIGEgYmV0dGVyIHdheSB0byBkbyB0aGlzLlxuICAgICAgICB0aGlzLm5hbWUgPT09ICdCdWlsdEluUnVsZXMnID8gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA6IEdyYW1tYXIuQnVpbHRJblJ1bGVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc3VwZXJHcmFtbWFyO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5lbnN1cmVTdXBlckdyYW1tYXJSdWxlRm9yT3ZlcnJpZGluZyA9IGZ1bmN0aW9uIChuYW1lLCBzb3VyY2UpIHtcbiAgICB2YXIgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICAgIGlmICghcnVsZUluZm8pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgc291cmNlKTtcbiAgICB9XG4gICAgcmV0dXJuIHJ1bGVJbmZvO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGJvZHksIHNvdXJjZSkge1xuICAgIHZhciBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyA9IGNvbW1vbi5nZXREdXBsaWNhdGVzKGZvcm1hbHMpO1xuICAgIGlmIChkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhuYW1lLCBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcywgc291cmNlKTtcbiAgICB9XG4gICAgdmFyIHJ1bGVJbmZvID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlc1tuYW1lXTtcbiAgICB2YXIgZXhwZWN0ZWRGb3JtYWxzID0gcnVsZUluZm8uZm9ybWFscztcbiAgICB2YXIgZXhwZWN0ZWROdW1Gb3JtYWxzID0gZXhwZWN0ZWRGb3JtYWxzID8gZXhwZWN0ZWRGb3JtYWxzLmxlbmd0aCA6IDA7XG4gICAgaWYgKGZvcm1hbHMubGVuZ3RoICE9PSBleHBlY3RlZE51bUZvcm1hbHMpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLndyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKG5hbWUsIGV4cGVjdGVkTnVtRm9ybWFscywgZm9ybWFscy5sZW5ndGgsIHNvdXJjZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbGwobmFtZSwgZm9ybWFscywgYm9keSwgcnVsZUluZm8uZGVzY3JpcHRpb24sIHNvdXJjZSk7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLmluc3RhbGwgPSBmdW5jdGlvbiAobmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSkge1xuICAgIHRoaXMucnVsZXNbbmFtZV0gPSB7XG4gICAgICAgIGJvZHk6IGJvZHkuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpLFxuICAgICAgICBmb3JtYWxzOiBmb3JtYWxzLFxuICAgICAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sXG4gICAgICAgIHNvdXJjZTogc291cmNlXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbn07XG4vLyBTdHVmZiB0aGF0IHlvdSBzaG91bGQgb25seSBkbyBvbmNlXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aFN1cGVyR3JhbW1hciA9IGZ1bmN0aW9uIChzdXBlckdyYW1tYXIpIHtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGUgc3VwZXIgZ3JhbW1hciBvZiBhIEdyYW1tYXJEZWNsIGNhbm5vdCBiZSBzZXQgbW9yZSB0aGFuIG9uY2UnKTtcbiAgICB9XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gICAgdGhpcy5ydWxlcyA9IE9iamVjdC5jcmVhdGUoc3VwZXJHcmFtbWFyLnJ1bGVzKTtcbiAgICAvLyBHcmFtbWFycyB3aXRoIGFuIGV4cGxpY2l0IHN1cGVyZ3JhbW1hciBpbmhlcml0IGEgZGVmYXVsdCBzdGFydCBydWxlLlxuICAgIGlmICghc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSA9IHN1cGVyR3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aERlZmF1bHRTdGFydFJ1bGUgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBydWxlTmFtZTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUud2l0aFNvdXJjZSA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IG5ldyBJbnB1dFN0cmVhbShzb3VyY2UpLmludGVydmFsKDAsIHNvdXJjZS5sZW5ndGgpO1xuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIENyZWF0ZXMgYSBHcmFtbWFyIGluc3RhbmNlLCBhbmQgaWYgaXQgcGFzc2VzIHRoZSBzYW5pdHkgY2hlY2tzLCByZXR1cm5zIGl0LlxuR3JhbW1hckRlY2wucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBncmFtbWFyID0gbmV3IEdyYW1tYXIodGhpcy5uYW1lLCB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLCB0aGlzLnJ1bGVzLCB0aGlzLmRlZmF1bHRTdGFydFJ1bGUpO1xuICAgIC8vIFRPRE86IGNoYW5nZSB0aGUgcGV4cHIucHJvdG90eXBlLmFzc2VydC4uLiBtZXRob2RzIHRvIG1ha2UgdGhlbSBhZGRcbiAgICAvLyBleGNlcHRpb25zIHRvIGFuIGFycmF5IHRoYXQncyBwcm92aWRlZCBhcyBhbiBhcmcuIFRoZW4gd2UnbGwgYmUgYWJsZSB0b1xuICAgIC8vIHNob3cgbW9yZSB0aGFuIG9uZSBlcnJvciBvZiB0aGUgc2FtZSB0eXBlIGF0IGEgdGltZS5cbiAgICAvLyBUT0RPOiBpbmNsdWRlIHRoZSBvZmZlbmRpbmcgcGV4cHIgaW4gdGhlIGVycm9ycywgdGhhdCB3YXkgd2UgY2FuIHNob3dcbiAgICAvLyB0aGUgcGFydCBvZiB0aGUgc291cmNlIHRoYXQgY2F1c2VkIGl0LlxuICAgIHZhciBncmFtbWFyRXJyb3JzID0gW107XG4gICAgdmFyIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gZmFsc2U7XG4gICAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuZm9yRWFjaChmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAgICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVzW3J1bGVOYW1lXS5ib2R5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYm9keS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYm9keS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGdyYW1tYXJFcnJvcnMucHVzaChlKTtcbiAgICAgICAgICAgIGdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghZ3JhbW1hckhhc0ludmFsaWRBcHBsaWNhdGlvbnMpIHtcbiAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBjYW4gb25seSBiZSBkb25lIGlmIHRoZSBncmFtbWFyIGhhcyBubyBpbnZhbGlkIGFwcGxpY2F0aW9ucy5cbiAgICAgICAgT2JqZWN0LmtleXMoZ3JhbW1hci5ydWxlcykuZm9yRWFjaChmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlc1tydWxlTmFtZV0uYm9keTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgYm9keS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hciwgW10pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoZ3JhbW1hckVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVycm9ycy50aHJvd0Vycm9ycyhncmFtbWFyRXJyb3JzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICAgIGdyYW1tYXIuc291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgfVxuICAgIHJldHVybiBncmFtbWFyO1xufTtcbi8vIFJ1bGUgZGVjbGFyYXRpb25zXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuZGVmaW5lID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpIHtcbiAgICB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpO1xuICAgIGlmICh0aGlzLnN1cGVyR3JhbW1hci5ydWxlc1tuYW1lXSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgc291cmNlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5ydWxlc1tuYW1lXSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKG5hbWUsIHRoaXMubmFtZSwgdGhpcy5uYW1lLCBzb3VyY2UpO1xuICAgIH1cbiAgICB2YXIgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhmb3JtYWxzKTtcbiAgICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMobmFtZSwgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMsIHNvdXJjZSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmluc3RhbGwobmFtZSwgZm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLm92ZXJyaWRlID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NJZ25vcmVkLCBzb3VyY2UpIHtcbiAgICB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hclJ1bGVGb3JPdmVycmlkaW5nKG5hbWUsIHNvdXJjZSk7XG4gICAgdGhpcy5pbnN0YWxsT3ZlcnJpZGRlbk9yRXh0ZW5kZWRSdWxlKG5hbWUsIGZvcm1hbHMsIGJvZHksIHNvdXJjZSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLmV4dGVuZCA9IGZ1bmN0aW9uIChuYW1lLCBmb3JtYWxzLCBmcmFnbWVudCwgZGVzY0lnbm9yZWQsIHNvdXJjZSkge1xuICAgIHZhciBydWxlSW5mbyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZXNbbmFtZV07XG4gICAgaWYgKCFydWxlSW5mbykge1xuICAgICAgICB0aHJvdyBlcnJvcnMuY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGUobmFtZSwgdGhpcy5zdXBlckdyYW1tYXIubmFtZSwgc291cmNlKTtcbiAgICB9XG4gICAgdmFyIGJvZHkgPSBuZXcgcGV4cHJzLkV4dGVuZCh0aGlzLnN1cGVyR3JhbW1hciwgbmFtZSwgZnJhZ21lbnQpO1xuICAgIGJvZHkuc291cmNlID0gZnJhZ21lbnQuc291cmNlO1xuICAgIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpO1xuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBHcmFtbWFyRGVjbDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBJbnB1dFN0cmVhbShzb3VyY2UpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLnBvcyA9IDA7XG4gICAgdGhpcy5leGFtaW5lZExlbmd0aCA9IDA7XG59XG5JbnB1dFN0cmVhbS5wcm90b3R5cGUgPSB7XG4gICAgYXRFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFucyA9IHRoaXMucG9zID09PSB0aGlzLnNvdXJjZS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLmV4YW1pbmVkTGVuZ3RoLCB0aGlzLnBvcyArIDEpO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYW5zID0gdGhpcy5zb3VyY2VbdGhpcy5wb3MrK107XG4gICAgICAgIHRoaXMuZXhhbWluZWRMZW5ndGggPSBNYXRoLm1heCh0aGlzLmV4YW1pbmVkTGVuZ3RoLCB0aGlzLnBvcyk7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBtYXRjaFN0cmluZzogZnVuY3Rpb24gKHMsIG9wdElnbm9yZUNhc2UpIHtcbiAgICAgICAgdmFyIGlkeDtcbiAgICAgICAgaWYgKG9wdElnbm9yZUNhc2UpIHtcbiAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgIENhc2UtaW5zZW5zaXRpdmUgY29tcGFyaXNvbiBpcyBhIHRyaWNreSBidXNpbmVzcy4gU29tZSBub3RhYmxlIGdvdGNoYXMgaW5jbHVkZSB0aGVcbiAgICAgICAgICAgICAgXCJUdXJraXNoIElcIiBwcm9ibGVtIChodHRwOi8vd3d3LmkxOG5ndXkuY29tL3VuaWNvZGUvdHVya2lzaC1pMThuLmh0bWwpIGFuZCB0aGUgZmFjdFxuICAgICAgICAgICAgICB0aGF0IHRoZSBHZXJtYW4gRXNzemV0ICjDnykgdHVybnMgaW50byBcIlNTXCIgaW4gdXBwZXIgY2FzZS5cbiAgICAgIFxuICAgICAgICAgICAgICBUaGlzIGlzIGludGVuZGVkIHRvIGJlIGEgbG9jYWxlLWludmFyaWFudCBjb21wYXJpc29uLCB3aGljaCBtZWFucyBpdCBtYXkgbm90IG9iZXlcbiAgICAgICAgICAgICAgbG9jYWxlLXNwZWNpZmljIGV4cGVjdGF0aW9ucyAoZS5nLiBcImlcIiA9PiBcIsSwXCIpLlxuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBhY3R1YWwgPSB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgZXhwZWN0ZWQgPSBzW2lkeF07XG4gICAgICAgICAgICAgICAgaWYgKGFjdHVhbCA9PSBudWxsIHx8IGFjdHVhbC50b1VwcGVyQ2FzZSgpICE9PSBleHBlY3RlZC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBEZWZhdWx0IGlzIGNhc2Utc2Vuc2l0aXZlIGNvbXBhcmlzb24uXG4gICAgICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5uZXh0KCkgIT09IHNbaWR4XSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHNvdXJjZVNsaWNlOiBmdW5jdGlvbiAoc3RhcnRJZHgsIGVuZElkeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc2xpY2Uoc3RhcnRJZHgsIGVuZElkeCk7XG4gICAgfSxcbiAgICBpbnRlcnZhbDogZnVuY3Rpb24gKHN0YXJ0SWR4LCBvcHRFbmRJZHgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZSwgc3RhcnRJZHgsIG9wdEVuZElkeCA/IG9wdEVuZElkeCA6IHRoaXMucG9zKTtcbiAgICB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0U3RyZWFtO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9jb21tb24nKS5hc3NlcnQ7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIEludGVydmFsKHNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHRoaXMuc291cmNlU3RyaW5nID0gc291cmNlU3RyaW5nO1xuICAgIHRoaXMuc3RhcnRJZHggPSBzdGFydElkeDtcbiAgICB0aGlzLmVuZElkeCA9IGVuZElkeDtcbn1cbkludGVydmFsLmNvdmVyYWdlID0gZnVuY3Rpb24gKCAvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gICAgdmFyIHNvdXJjZVN0cmluZyA9IGFyZ3VtZW50c1swXS5zb3VyY2VTdHJpbmc7XG4gICAgdmFyIHN0YXJ0SWR4ID0gYXJndW1lbnRzWzBdLnN0YXJ0SWR4O1xuICAgIHZhciBlbmRJZHggPSBhcmd1bWVudHNbMF0uZW5kSWR4O1xuICAgIGZvciAodmFyIGlkeCA9IDE7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHZhciBpbnRlcnZhbCA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgICBpZiAoaW50ZXJ2YWwuc291cmNlU3RyaW5nICE9PSBzb3VyY2VTdHJpbmcpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5pbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0SWR4ID0gTWF0aC5taW4oc3RhcnRJZHgsIGFyZ3VtZW50c1tpZHhdLnN0YXJ0SWR4KTtcbiAgICAgICAgICAgIGVuZElkeCA9IE1hdGgubWF4KGVuZElkeCwgYXJndW1lbnRzW2lkeF0uZW5kSWR4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEludGVydmFsKHNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCk7XG59O1xuSW50ZXJ2YWwucHJvdG90eXBlID0ge1xuICAgIGNvdmVyYWdlV2l0aDogZnVuY3Rpb24gKCAvKiBpbnRlcnZhbDEsIGludGVydmFsMiwgLi4uICovKSB7XG4gICAgICAgIHZhciBpbnRlcnZhbHMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBpbnRlcnZhbHMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIEludGVydmFsLmNvdmVyYWdlLmFwcGx5KHVuZGVmaW5lZCwgaW50ZXJ2YWxzKTtcbiAgICB9LFxuICAgIGNvbGxhcHNlZExlZnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5zdGFydElkeCwgdGhpcy5zdGFydElkeCk7XG4gICAgfSxcbiAgICBjb2xsYXBzZWRSaWdodDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLmVuZElkeCwgdGhpcy5lbmRJZHgpO1xuICAgIH0sXG4gICAgZ2V0TGluZUFuZENvbHVtbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdXRpbC5nZXRMaW5lQW5kQ29sdW1uKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4KTtcbiAgICB9LFxuICAgIGdldExpbmVBbmRDb2x1bW5NZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByYW5nZSA9IFt0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeF07XG4gICAgICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCByYW5nZSk7XG4gICAgfSxcbiAgICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIDAsIDEsIG9yIDIgaW50ZXJ2YWxzIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIHRoZVxuICAgIC8vIGludGVydmFsIGRpZmZlcmVuY2Ugb3BlcmF0aW9uLlxuICAgIG1pbnVzOiBmdW5jdGlvbiAodGhhdCkge1xuICAgICAgICBpZiAodGhpcy5zb3VyY2VTdHJpbmcgIT09IHRoYXQuc291cmNlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGFydElkeCA9PT0gdGhhdC5zdGFydElkeCAmJiB0aGlzLmVuZElkeCA9PT0gdGhhdC5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGlzYCBhbmQgYHRoYXRgIGFyZSB0aGUgc2FtZSBpbnRlcnZhbCFcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5zdGFydElkeCAmJiB0aGF0LmVuZElkeCA8IHRoaXMuZW5kSWR4KSB7XG4gICAgICAgICAgICAvLyBgdGhhdGAgc3BsaXRzIGB0aGlzYCBpbnRvIHR3byBpbnRlcnZhbHNcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGF0LnN0YXJ0SWR4KSxcbiAgICAgICAgICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoYXQuZW5kSWR4LCB0aGlzLmVuZElkeClcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGFydElkeCA8IHRoYXQuZW5kSWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBjb250YWlucyBhIHByZWZpeCBvZiBgdGhpc2BcbiAgICAgICAgICAgIHJldHVybiBbbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGF0LmVuZElkeCwgdGhpcy5lbmRJZHgpXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5zdGFydElkeCAmJiB0aGF0LnN0YXJ0SWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBjb250YWlucyBhIHN1ZmZpeCBvZiBgdGhpc2BcbiAgICAgICAgICAgIHJldHVybiBbbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGF0LnN0YXJ0SWR4KV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBgdGhhdGAgYW5kIGB0aGlzYCBkbyBub3Qgb3ZlcmxhcFxuICAgICAgICAgICAgcmV0dXJuIFt0aGlzXTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB0aGF0IGhhcyB0aGUgc2FtZSBleHRlbnQgYXMgdGhpcyBvbmUsIGJ1dCB3aGljaCBpcyByZWxhdGl2ZVxuICAgIC8vIHRvIGB0aGF0YCwgYW4gSW50ZXJ2YWwgdGhhdCBmdWxseSBjb3ZlcnMgdGhpcyBvbmUuXG4gICAgcmVsYXRpdmVUbzogZnVuY3Rpb24gKHRoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc291cmNlU3RyaW5nICE9PSB0aGF0LnNvdXJjZVN0cmluZykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCh0aGlzLnN0YXJ0SWR4ID49IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPD0gdGhhdC5lbmRJZHgsICdvdGhlciBpbnRlcnZhbCBkb2VzIG5vdCBjb3ZlciB0aGlzIG9uZScpO1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4IC0gdGhhdC5zdGFydElkeCwgdGhpcy5lbmRJZHggLSB0aGF0LnN0YXJ0SWR4KTtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgYSBuZXcgSW50ZXJ2YWwgd2hpY2ggY29udGFpbnMgdGhlIHNhbWUgY29udGVudHMgYXMgdGhpcyBvbmUsXG4gICAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgICAvLyB0aGUgaW5wdXQgc3RyZWFtIGlzIGEgc3RyaW5nLilcbiAgICB0cmltbWVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgICAgIHZhciBzdGFydElkeCA9IHRoaXMuc3RhcnRJZHggKyBjb250ZW50cy5tYXRjaCgvXlxccyovKVswXS5sZW5ndGg7XG4gICAgICAgIHZhciBlbmRJZHggPSB0aGlzLmVuZElkeCAtIGNvbnRlbnRzLm1hdGNoKC9cXHMqJC8pWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCk7XG4gICAgfSxcbiAgICBzdWJJbnRlcnZhbDogZnVuY3Rpb24gKG9mZnNldCwgbGVuKSB7XG4gICAgICAgIHZhciBuZXdTdGFydElkeCA9IHRoaXMuc3RhcnRJZHggKyBvZmZzZXQ7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIG5ld1N0YXJ0SWR4LCBuZXdTdGFydElkeCArIGxlbik7XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEludGVydmFsLnByb3RvdHlwZSwge1xuICAgIGNvbnRlbnRzOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50cyA9IHRoaXMuc291cmNlU3RyaW5nLnNsaWNlKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgbGVuZ3RoOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZW5kSWR4IC0gdGhpcy5zdGFydElkeDtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH1cbn0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE1hdGNoUmVzdWx0KG1hdGNoZXIsIGlucHV0LCBzdGFydEV4cHIsIGNzdCwgY3N0T2Zmc2V0LCByaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIG9wdFJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuICAgIHRoaXMuaW5wdXQgPSBpbnB1dDtcbiAgICB0aGlzLnN0YXJ0RXhwciA9IHN0YXJ0RXhwcjtcbiAgICB0aGlzLl9jc3QgPSBjc3Q7XG4gICAgdGhpcy5fY3N0T2Zmc2V0ID0gY3N0T2Zmc2V0O1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcyA9IG9wdFJlY29yZGVkRmFpbHVyZXM7XG4gICAgaWYgKHRoaXMuZmFpbGVkKCkpIHtcbiAgICAgICAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBkZXRhaWwgPSAnRXhwZWN0ZWQgJyArIHRoaXMuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgICAgICAgICByZXR1cm4gKHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UodGhpcy5pbnB1dCwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSkgKyBkZXRhaWwpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnc2hvcnRNZXNzYWdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRldGFpbCA9ICdleHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICAgICAgICAgIHZhciBlcnJvckluZm8gPSB1dGlsLmdldExpbmVBbmRDb2x1bW4odGhpcy5pbnB1dCwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSk7XG4gICAgICAgICAgICByZXR1cm4gJ0xpbmUgJyArIGVycm9ySW5mby5saW5lTnVtICsgJywgY29sICcgKyBlcnJvckluZm8uY29sTnVtICsgJzogJyArIGRldGFpbDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnN1Y2NlZWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jc3Q7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmZhaWxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gIXRoaXMuc3VjY2VlZGVkKCk7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xufTtcbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5nZXRSaWdodG1vc3RGYWlsdXJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzKSB7XG4gICAgICAgIHRoaXMubWF0Y2hlci5zZXRJbnB1dCh0aGlzLmlucHV0KTtcbiAgICAgICAgdmFyIG1hdGNoUmVzdWx0V2l0aEZhaWx1cmVzID0gdGhpcy5tYXRjaGVyLl9tYXRjaCh0aGlzLnN0YXJ0RXhwciwgZmFsc2UsIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkpO1xuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcyA9IG1hdGNoUmVzdWx0V2l0aEZhaWx1cmVzLmdldFJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcztcbn07XG5NYXRjaFJlc3VsdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3VjY2VlZGVkKClcbiAgICAgICAgPyAnW21hdGNoIHN1Y2NlZWRlZF0nXG4gICAgICAgIDogJ1ttYXRjaCBmYWlsZWQgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkgKyAnXSc7XG59O1xuLy8gUmV0dXJuIGEgc3RyaW5nIHN1bW1hcml6aW5nIHRoZSBleHBlY3RlZCBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIHdoZW5cbi8vIHRoZSBtYXRjaCBmYWlsdXJlIG9jY3VycmVkLlxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEV4cGVjdGVkVGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdWNjZWVkZWQoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgZXhwZWN0ZWQgdGV4dCBvZiBhIHN1Y2Nlc3NmdWwgTWF0Y2hSZXN1bHQnKTtcbiAgICB9XG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICB2YXIgZmFpbHVyZXMgPSB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gICAgLy8gRmlsdGVyIG91dCB0aGUgZmx1ZmZ5IGZhaWx1cmVzIHRvIG1ha2UgdGhlIGRlZmF1bHQgZXJyb3IgbWVzc2FnZXMgbW9yZSB1c2VmdWxcbiAgICBmYWlsdXJlcyA9IGZhaWx1cmVzLmZpbHRlcihmdW5jdGlvbiAoZmFpbHVyZSkgeyByZXR1cm4gIWZhaWx1cmUuaXNGbHVmZnkoKTsgfSk7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgZmFpbHVyZXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBpZiAoaWR4ID4gMCkge1xuICAgICAgICAgICAgaWYgKGlkeCA9PT0gZmFpbHVyZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgIHNiLmFwcGVuZChmYWlsdXJlcy5sZW5ndGggPiAyID8gJywgb3IgJyA6ICcgb3IgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzYi5hcHBlbmQoJywgJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2IuYXBwZW5kKGZhaWx1cmVzW2lkeF0udG9TdHJpbmcoKSk7XG4gICAgfVxuICAgIHJldHVybiBzYi5jb250ZW50cygpO1xufTtcbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5nZXRJbnRlcnZhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcG9zID0gdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKTtcbiAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuaW5wdXQsIHBvcywgcG9zKTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hSZXN1bHQ7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBJbnB1dFN0cmVhbSA9IHJlcXVpcmUoJy4vSW5wdXRTdHJlYW0nKTtcbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4vTWF0Y2hSZXN1bHQnKTtcbnZhciBQb3NJbmZvID0gcmVxdWlyZSgnLi9Qb3NJbmZvJyk7XG52YXIgVHJhY2UgPSByZXF1aXJlKCcuL1RyYWNlJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGFwcGx5U3BhY2VzID0gbmV3IHBleHBycy5BcHBseSgnc3BhY2VzJyk7XG5mdW5jdGlvbiBNYXRjaFN0YXRlKG1hdGNoZXIsIHN0YXJ0RXhwciwgb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gICAgdGhpcy5tYXRjaGVyID0gbWF0Y2hlcjtcbiAgICB0aGlzLnN0YXJ0RXhwciA9IHN0YXJ0RXhwcjtcbiAgICB0aGlzLmdyYW1tYXIgPSBtYXRjaGVyLmdyYW1tYXI7XG4gICAgdGhpcy5pbnB1dCA9IG1hdGNoZXIuaW5wdXQ7XG4gICAgdGhpcy5pbnB1dFN0cmVhbSA9IG5ldyBJbnB1dFN0cmVhbShtYXRjaGVyLmlucHV0KTtcbiAgICB0aGlzLm1lbW9UYWJsZSA9IG1hdGNoZXIubWVtb1RhYmxlO1xuICAgIHRoaXMuX2JpbmRpbmdzID0gW107XG4gICAgdGhpcy5fYmluZGluZ09mZnNldHMgPSBbXTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblN0YWNrID0gW107XG4gICAgdGhpcy5fcG9zU3RhY2sgPSBbMF07XG4gICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrID0gW2ZhbHNlXTtcbiAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IC0xO1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrID0gW107XG4gICAgdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrID0gW107XG4gICAgaWYgKG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzID0gb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzO1xuICAgICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIH1cbn1cbk1hdGNoU3RhdGUucHJvdG90eXBlID0ge1xuICAgIHBvc1RvT2Zmc2V0OiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHJldHVybiBwb3MgLSB0aGlzLl9wb3NTdGFja1t0aGlzLl9wb3NTdGFjay5sZW5ndGggLSAxXTtcbiAgICB9LFxuICAgIGVudGVyQXBwbGljYXRpb246IGZ1bmN0aW9uIChwb3NJbmZvLCBhcHApIHtcbiAgICAgICAgdGhpcy5fcG9zU3RhY2sucHVzaCh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gICAgICAgIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sucHVzaChhcHApO1xuICAgICAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucHVzaChmYWxzZSk7XG4gICAgICAgIHBvc0luZm8uZW50ZXIoYXBwKTtcbiAgICAgICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucHVzaCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbik7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gICAgfSxcbiAgICBleGl0QXBwbGljYXRpb246IGZ1bmN0aW9uIChwb3NJbmZvLCBvcHROb2RlKSB7XG4gICAgICAgIHZhciBvcmlnUG9zID0gdGhpcy5fcG9zU3RhY2sucG9wKCk7XG4gICAgICAgIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sucG9wKCk7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgICAgICAgcG9zSW5mby5leGl0KCk7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnBvcCgpKTtcbiAgICAgICAgaWYgKG9wdE5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaEJpbmRpbmcob3B0Tm9kZSwgb3JpZ1Bvcyk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVudGVyTGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wdXNoKHRydWUpO1xuICAgIH0sXG4gICAgZXhpdExleGlmaWVkQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sucG9wKCk7XG4gICAgfSxcbiAgICBjdXJyZW50QXBwbGljYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2tbdGhpcy5fYXBwbGljYXRpb25TdGFjay5sZW5ndGggLSAxXTtcbiAgICB9LFxuICAgIGluU3ludGFjdGljQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuaW5wdXRTdHJlYW0uc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdXJyZW50QXBwbGljYXRpb24gPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgICBpZiAoY3VycmVudEFwcGxpY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gY3VycmVudEFwcGxpY2F0aW9uLmlzU3ludGFjdGljKCkgJiYgIXRoaXMuaW5MZXhpZmllZENvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoZSB0b3AtbGV2ZWwgY29udGV4dCBpcyBzeW50YWN0aWMgaWYgdGhlIHN0YXJ0IGFwcGxpY2F0aW9uIGlzLlxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRFeHByLmZhY3RvcnNbMF0uaXNTeW50YWN0aWMoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgaW5MZXhpZmllZENvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFja1t0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2subGVuZ3RoIC0gMV07XG4gICAgfSxcbiAgICBza2lwU3BhY2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucHVzaEZhaWx1cmVzSW5mbygpO1xuICAgICAgICB0aGlzLmV2YWwoYXBwbHlTcGFjZXMpO1xuICAgICAgICB0aGlzLnBvcEJpbmRpbmcoKTtcbiAgICAgICAgdGhpcy5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRTdHJlYW0ucG9zO1xuICAgIH0sXG4gICAgc2tpcFNwYWNlc0lmSW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluU3ludGFjdGljQ29udGV4dCgpID8gdGhpcy5za2lwU3BhY2VzKCkgOiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgICB9LFxuICAgIG1heWJlU2tpcFNwYWNlc0JlZm9yZTogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkgJiYgZXhwci5pc1N5bnRhY3RpYygpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5za2lwU3BhY2VzKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXhwci5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlKCkgJiYgZXhwciAhPT0gYXBwbHlTcGFjZXMpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNraXBTcGFjZXNJZkluU3ludGFjdGljQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBwdXNoQmluZGluZzogZnVuY3Rpb24gKG5vZGUsIG9yaWdQb3MpIHtcbiAgICAgICAgdGhpcy5fYmluZGluZ3MucHVzaChub2RlKTtcbiAgICAgICAgdGhpcy5fYmluZGluZ09mZnNldHMucHVzaCh0aGlzLnBvc1RvT2Zmc2V0KG9yaWdQb3MpKTtcbiAgICB9LFxuICAgIHBvcEJpbmRpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fYmluZGluZ3MucG9wKCk7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdPZmZzZXRzLnBvcCgpO1xuICAgIH0sXG4gICAgbnVtQmluZGluZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JpbmRpbmdzLmxlbmd0aDtcbiAgICB9LFxuICAgIHRydW5jYXRlQmluZGluZ3M6IGZ1bmN0aW9uIChuZXdMZW5ndGgpIHtcbiAgICAgICAgLy8gWWVzLCB0aGlzIGlzIHRoaXMgcmVhbGx5IGZhc3RlciB0aGFuIHNldHRpbmcgdGhlIGBsZW5ndGhgIHByb3BlcnR5ICh0ZXN0ZWQgd2l0aFxuICAgICAgICAvLyBiaW4vZXM1YmVuY2ggb24gTm9kZSB2Ni4xLjApLlxuICAgICAgICB3aGlsZSAodGhpcy5fYmluZGluZ3MubGVuZ3RoID4gbmV3TGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcEJpbmRpbmcoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q3VycmVudFBvc0luZm86IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UG9zSW5mbyh0aGlzLmlucHV0U3RyZWFtLnBvcyk7XG4gICAgfSxcbiAgICBnZXRQb3NJbmZvOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBwb3NJbmZvID0gdGhpcy5tZW1vVGFibGVbcG9zXTtcbiAgICAgICAgaWYgKCFwb3NJbmZvKSB7XG4gICAgICAgICAgICBwb3NJbmZvID0gdGhpcy5tZW1vVGFibGVbcG9zXSA9IG5ldyBQb3NJbmZvKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvc0luZm87XG4gICAgfSxcbiAgICBwcm9jZXNzRmFpbHVyZTogZnVuY3Rpb24gKHBvcywgZXhwcikge1xuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IE1hdGgubWF4KHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLCBwb3MpO1xuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmIHBvcyA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIHZhciBhcHAgPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgICAgICAgaWYgKGFwcCkge1xuICAgICAgICAgICAgICAgIC8vIFN1YnN0aXR1dGUgcGFyYW1ldGVycyB3aXRoIHRoZSBhY3R1YWwgcGV4cHJzIHRoYXQgd2VyZSBwYXNzZWQgdG9cbiAgICAgICAgICAgICAgICAvLyB0aGUgY3VycmVudCBydWxlLlxuICAgICAgICAgICAgICAgIGV4cHIgPSBleHByLnN1YnN0aXR1dGVQYXJhbXMoYXBwLmFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBicmFuY2ggaXMgb25seSByZWFjaGVkIGZvciB0aGUgXCJlbmQtY2hlY2tcIiB0aGF0IGlzXG4gICAgICAgICAgICAgICAgLy8gcGVyZm9ybWVkIGFmdGVyIHRoZSB0b3AtbGV2ZWwgYXBwbGljYXRpb24uIEluIHRoYXQgY2FzZSxcbiAgICAgICAgICAgICAgICAvLyBleHByID09PSBwZXhwcnMuZW5kIHNvIHRoZXJlIGlzIG5vIG5lZWQgdG8gc3Vic3RpdHV0ZVxuICAgICAgICAgICAgICAgIC8vIHBhcmFtZXRlcnMuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlY29yZEZhaWx1cmUoZXhwci50b0ZhaWx1cmUodGhpcy5ncmFtbWFyKSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZWNvcmRGYWlsdXJlOiBmdW5jdGlvbiAoZmFpbHVyZSwgc2hvdWxkQ2xvbmVJZk5ldykge1xuICAgICAgICB2YXIga2V5ID0gZmFpbHVyZS50b0tleSgpO1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XSA9IHNob3VsZENsb25lSWZOZXcgPyBmYWlsdXJlLmNsb25lKCkgOiBmYWlsdXJlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldLmlzRmx1ZmZ5KCkgJiYgIWZhaWx1cmUuaXNGbHVmZnkoKSkge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0uY2xlYXJGbHVmZnkoKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVjb3JkRmFpbHVyZXM6IGZ1bmN0aW9uIChmYWlsdXJlcywgc2hvdWxkQ2xvbmVJZk5ldykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyhmYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBfdGhpcy5yZWNvcmRGYWlsdXJlKGZhaWx1cmVzW2tleV0sIHNob3VsZENsb25lSWZOZXcpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGNsb25lUmVjb3JkZWRGYWlsdXJlczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYW5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5yZWNvcmRlZEZhaWx1cmVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIGFuc1trZXldID0gX3RoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldLmNsb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgICB9LFxuICAgIF9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA+PSAwXG4gICAgICAgICAgICA/IHRoaXMucG9zVG9PZmZzZXQodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pXG4gICAgICAgICAgICA6IC0xO1xuICAgIH0sXG4gICAgLy8gUmV0dXJucyB0aGUgbWVtb2l6ZWQgdHJhY2UgZW50cnkgZm9yIGBleHByYCBhdCBgcG9zYCwgaWYgb25lIGV4aXN0cywgYG51bGxgIG90aGVyd2lzZS5cbiAgICBnZXRNZW1vaXplZFRyYWNlRW50cnk6IGZ1bmN0aW9uIChwb3MsIGV4cHIpIHtcbiAgICAgICAgdmFyIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgICAgICBpZiAocG9zSW5mbyAmJiBleHByLnJ1bGVOYW1lKSB7XG4gICAgICAgICAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1tleHByLnRvTWVtb0tleSgpXTtcbiAgICAgICAgICAgIGlmIChtZW1vUmVjICYmIG1lbW9SZWMudHJhY2VFbnRyeSkge1xuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IG1lbW9SZWMudHJhY2VFbnRyeS5jbG9uZVdpdGhFeHByKGV4cHIpO1xuICAgICAgICAgICAgICAgIGVudHJ5LmlzTWVtb2l6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgYSBuZXcgdHJhY2UgZW50cnksIHdpdGggdGhlIGN1cnJlbnRseSBhY3RpdmUgdHJhY2UgYXJyYXkgYXMgaXRzIGNoaWxkcmVuLlxuICAgIGdldFRyYWNlRW50cnk6IGZ1bmN0aW9uIChwb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MpIHtcbiAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkpIHtcbiAgICAgICAgICAgIHZhciBhcHAgPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGFjdHVhbHMgPSBhcHAgPyBhcHAuYXJncyA6IFtdO1xuICAgICAgICAgICAgZXhwciA9IGV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMuZ2V0TWVtb2l6ZWRUcmFjZUVudHJ5KHBvcywgZXhwcikgfHxcbiAgICAgICAgICAgIG5ldyBUcmFjZSh0aGlzLmlucHV0LCBwb3MsIHRoaXMuaW5wdXRTdHJlYW0ucG9zLCBleHByLCBzdWNjZWVkZWQsIGJpbmRpbmdzLCB0aGlzLnRyYWNlKSk7XG4gICAgfSxcbiAgICBpc1RyYWNpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy50cmFjZTtcbiAgICB9LFxuICAgIGhhc05lY2Vzc2FyeUluZm86IGZ1bmN0aW9uIChtZW1vUmVjKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYWNlICYmICFtZW1vUmVjLnRyYWNlRW50cnkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmXG4gICAgICAgICAgICB0aGlzLmlucHV0U3RyZWFtLnBvcyArIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIHJldHVybiAhIW1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgdXNlTWVtb2l6ZWRSZXN1bHQ6IGZ1bmN0aW9uIChvcmlnUG9zLCBtZW1vUmVjKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYWNlKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWNlLnB1c2gobWVtb1JlYy50cmFjZUVudHJ5KTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHRoaXMuaW5wdXRTdHJlYW0ucG9zICsgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0O1xuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IE1hdGgubWF4KHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLCBtZW1vUmVjUmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJlxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgPT09IG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gJiZcbiAgICAgICAgICAgIG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnJlY29yZEZhaWx1cmVzKG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5pbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCArIG9yaWdQb3MpO1xuICAgICAgICBpZiAobWVtb1JlYy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgKz0gbWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgICAgICAgICAgIHRoaXMucHVzaEJpbmRpbmcobWVtb1JlYy52YWx1ZSwgb3JpZ1Bvcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBFdmFsdWF0ZSBgZXhwcmAgYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZGVkLCBgZmFsc2VgIG90aGVyd2lzZS4gT24gc3VjY2VzcywgYGJpbmRpbmdzYFxuICAgIC8vIHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGVsZW1lbnRzIHRoYW4gYmVmb3JlLCBhbmQgdGhlIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heVxuICAgIC8vIGhhdmUgaW5jcmVhc2VkLiBPbiBmYWlsdXJlLCBgYmluZGluZ3NgIGFuZCBwb3NpdGlvbiB3aWxsIGJlIHVuY2hhbmdlZC5cbiAgICBldmFsOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgaW5wdXRTdHJlYW0gPSB0aGlzLmlucHV0U3RyZWFtO1xuICAgICAgICB2YXIgb3JpZ051bUJpbmRpbmdzID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgICAgICB2YXIgb3JpZ1JlY29yZGVkRmFpbHVyZXM7XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIG9yaWdSZWNvcmRlZEZhaWx1cmVzID0gdGhpcy5yZWNvcmRlZEZhaWx1cmVzO1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICAgICAgdmFyIG1lbW9Qb3MgPSB0aGlzLm1heWJlU2tpcFNwYWNlc0JlZm9yZShleHByKTtcbiAgICAgICAgdmFyIG9yaWdUcmFjZTtcbiAgICAgICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgICAgICAgIG9yaWdUcmFjZSA9IHRoaXMudHJhY2U7XG4gICAgICAgICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gdGhlIGFjdHVhbCBldmFsdWF0aW9uLlxuICAgICAgICB2YXIgYW5zID0gZXhwci5ldmFsKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy50cmFjZSkge1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzID0gdGhpcy5fYmluZGluZ3Muc2xpY2Uob3JpZ051bUJpbmRpbmdzKTtcbiAgICAgICAgICAgIHZhciB0cmFjZUVudHJ5ID0gdGhpcy5nZXRUcmFjZUVudHJ5KG1lbW9Qb3MsIGV4cHIsIGFucywgYmluZGluZ3MpO1xuICAgICAgICAgICAgdHJhY2VFbnRyeS5pc0ltcGxpY2l0U3BhY2VzID0gZXhwciA9PT0gYXBwbHlTcGFjZXM7XG4gICAgICAgICAgICB0cmFjZUVudHJ5LmlzUm9vdE5vZGUgPSBleHByID09PSB0aGlzLnN0YXJ0RXhwcjtcbiAgICAgICAgICAgIG9yaWdUcmFjZS5wdXNoKHRyYWNlRW50cnkpO1xuICAgICAgICAgICAgdGhpcy50cmFjZSA9IG9yaWdUcmFjZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmIGlucHV0U3RyZWFtLnBvcyA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0ubWFrZUZsdWZmeSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVzZXQgdGhlIHBvc2l0aW9uIGFuZCB0aGUgYmluZGluZ3MuXG4gICAgICAgICAgICBpbnB1dFN0cmVhbS5wb3MgPSBvcmlnUG9zO1xuICAgICAgICAgICAgdGhpcy50cnVuY2F0ZUJpbmRpbmdzKG9yaWdOdW1CaW5kaW5ncyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcykge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRGYWlsdXJlcyhvcmlnUmVjb3JkZWRGYWlsdXJlcywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfSxcbiAgICBnZXRNYXRjaFJlc3VsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmV2YWwodGhpcy5zdGFydEV4cHIpO1xuICAgICAgICB2YXIgcmlnaHRtb3N0RmFpbHVyZXM7XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVzID0gT2JqZWN0LmtleXModGhpcy5yZWNvcmRlZEZhaWx1cmVzKS5tYXAoZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gX3RoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldOyB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IE1hdGNoUmVzdWx0KHRoaXMubWF0Y2hlciwgdGhpcy5pbnB1dCwgdGhpcy5zdGFydEV4cHIsIHRoaXMuX2JpbmRpbmdzWzBdLCB0aGlzLl9iaW5kaW5nT2Zmc2V0c1swXSwgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIHJpZ2h0bW9zdEZhaWx1cmVzKTtcbiAgICB9LFxuICAgIGdldFRyYWNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudHJhY2UgPSBbXTtcbiAgICAgICAgdmFyIG1hdGNoUmVzdWx0ID0gdGhpcy5nZXRNYXRjaFJlc3VsdCgpO1xuICAgICAgICAvLyBUaGUgdHJhY2Ugbm9kZSBmb3IgdGhlIHN0YXJ0IHJ1bGUgaXMgYWx3YXlzIHRoZSBsYXN0IGVudHJ5LiBJZiBpdCBpcyBhIHN5bnRhY3RpYyBydWxlLFxuICAgICAgICAvLyB0aGUgZmlyc3QgZW50cnkgaXMgZm9yIGFuIGFwcGxpY2F0aW9uIG9mICdzcGFjZXMnLlxuICAgICAgICAvLyBUT0RPKHBkdWJyb3kpOiBDbGVhbiB0aGlzIHVwIGJ5IGludHJvZHVjaW5nIGEgc3BlY2lhbCBgTWF0Y2g8c3RhcnRBcHBsPmAgcnVsZSwgd2hpY2ggd2lsbFxuICAgICAgICAvLyBlbnN1cmUgdGhhdCB0aGVyZSBpcyBhbHdheXMgYSBzaW5nbGUgcm9vdCB0cmFjZSBub2RlLlxuICAgICAgICB2YXIgcm9vdFRyYWNlID0gdGhpcy50cmFjZVt0aGlzLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgICAgICByb290VHJhY2UucmVzdWx0ID0gbWF0Y2hSZXN1bHQ7XG4gICAgICAgIHJldHVybiByb290VHJhY2U7XG4gICAgfSxcbiAgICBwdXNoRmFpbHVyZXNJbmZvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnB1c2godGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pO1xuICAgICAgICB0aGlzLl9yZWNvcmRlZEZhaWx1cmVzU3RhY2sucHVzaCh0aGlzLnJlY29yZGVkRmFpbHVyZXMpO1xuICAgIH0sXG4gICAgcG9wRmFpbHVyZXNJbmZvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucG9wKCk7XG4gICAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlcyA9IHRoaXMuX3JlY29yZGVkRmFpbHVyZXNTdGFjay5wb3AoKTtcbiAgICB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoU3RhdGU7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBNYXRjaFN0YXRlID0gcmVxdWlyZSgnLi9NYXRjaFN0YXRlJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gTWF0Y2hlcihncmFtbWFyKSB7XG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICB0aGlzLm1lbW9UYWJsZSA9IFtdO1xuICAgIHRoaXMuaW5wdXQgPSAnJztcbn1cbk1hdGNoZXIucHJvdG90eXBlLmdldElucHV0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlucHV0O1xufTtcbk1hdGNoZXIucHJvdG90eXBlLnNldElucHV0ID0gZnVuY3Rpb24gKHN0cikge1xuICAgIGlmICh0aGlzLmlucHV0ICE9PSBzdHIpIHtcbiAgICAgICAgdGhpcy5yZXBsYWNlSW5wdXRSYW5nZSgwLCB0aGlzLmlucHV0Lmxlbmd0aCwgc3RyKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuTWF0Y2hlci5wcm90b3R5cGUucmVwbGFjZUlucHV0UmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnRJZHgsIGVuZElkeCwgc3RyKSB7XG4gICAgdmFyIGN1cnJlbnRJbnB1dCA9IHRoaXMuaW5wdXQ7XG4gICAgaWYgKHN0YXJ0SWR4IDwgMCB8fFxuICAgICAgICBzdGFydElkeCA+IGN1cnJlbnRJbnB1dC5sZW5ndGggfHxcbiAgICAgICAgZW5kSWR4IDwgMCB8fFxuICAgICAgICBlbmRJZHggPiBjdXJyZW50SW5wdXQubGVuZ3RoIHx8XG4gICAgICAgIHN0YXJ0SWR4ID4gZW5kSWR4KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBpbmRpY2VzOiAnICsgc3RhcnRJZHggKyAnIGFuZCAnICsgZW5kSWR4KTtcbiAgICB9XG4gICAgLy8gdXBkYXRlIGlucHV0XG4gICAgdGhpcy5pbnB1dCA9IGN1cnJlbnRJbnB1dC5zbGljZSgwLCBzdGFydElkeCkgKyBzdHIgKyBjdXJyZW50SW5wdXQuc2xpY2UoZW5kSWR4KTtcbiAgICAvLyB1cGRhdGUgbWVtbyB0YWJsZSAoc2ltaWxhciB0byB0aGUgYWJvdmUpXG4gICAgdmFyIHJlc3RPZk1lbW9UYWJsZSA9IHRoaXMubWVtb1RhYmxlLnNsaWNlKGVuZElkeCk7XG4gICAgdGhpcy5tZW1vVGFibGUubGVuZ3RoID0gc3RhcnRJZHg7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgc3RyLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdGhpcy5tZW1vVGFibGUucHVzaCh1bmRlZmluZWQpO1xuICAgIH1cbiAgICByZXN0T2ZNZW1vVGFibGUuZm9yRWFjaChmdW5jdGlvbiAocG9zSW5mbykge1xuICAgICAgICB0aGlzLm1lbW9UYWJsZS5wdXNoKHBvc0luZm8pO1xuICAgIH0sIHRoaXMpO1xuICAgIC8vIEludmFsaWRhdGUgbWVtb1JlY3NcbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgPCBzdGFydElkeDsgcG9zKyspIHtcbiAgICAgICAgdmFyIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgICAgICBpZiAocG9zSW5mbykge1xuICAgICAgICAgICAgcG9zSW5mby5jbGVhck9ic29sZXRlRW50cmllcyhwb3MsIHN0YXJ0SWR4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbn07XG5NYXRjaGVyLnByb3RvdHlwZS5tYXRjaCA9IGZ1bmN0aW9uIChvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hdGNoKHRoaXMuX2dldFN0YXJ0RXhwcihvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSwgZmFsc2UpO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2godGhpcy5fZ2V0U3RhcnRFeHByKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpLCB0cnVlKTtcbn07XG5NYXRjaGVyLnByb3RvdHlwZS5fbWF0Y2ggPSBmdW5jdGlvbiAoc3RhcnRFeHByLCB0cmFjaW5nLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICB2YXIgc3RhdGUgPSBuZXcgTWF0Y2hTdGF0ZSh0aGlzLCBzdGFydEV4cHIsIG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyk7XG4gICAgcmV0dXJuIHRyYWNpbmcgPyBzdGF0ZS5nZXRUcmFjZSgpIDogc3RhdGUuZ2V0TWF0Y2hSZXN1bHQoKTtcbn07XG4vKlxuICBSZXR1cm5zIHRoZSBzdGFydGluZyBleHByZXNzaW9uIGZvciB0aGlzIE1hdGNoZXIncyBhc3NvY2lhdGVkIGdyYW1tYXIuIElmIGBvcHRTdGFydEFwcGxpY2F0aW9uU3RyYFxuICBpcyBzcGVjaWZpZWQsIGl0IGlzIGEgc3RyaW5nIGV4cHJlc3NpbmcgYSBydWxlIGFwcGxpY2F0aW9uIGluIHRoZSBncmFtbWFyLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGVcbiAgZ3JhbW1hcidzIGRlZmF1bHQgc3RhcnQgcnVsZSB3aWxsIGJlIHVzZWQuXG4qL1xuTWF0Y2hlci5wcm90b3R5cGUuX2dldFN0YXJ0RXhwciA9IGZ1bmN0aW9uIChvcHRTdGFydEFwcGxpY2F0aW9uU3RyKSB7XG4gICAgdmFyIGFwcGxpY2F0aW9uU3RyID0gb3B0U3RhcnRBcHBsaWNhdGlvblN0ciB8fCB0aGlzLmdyYW1tYXIuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgICBpZiAoIWFwcGxpY2F0aW9uU3RyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBzdGFydCBydWxlIGFyZ3VtZW50IC0tIHRoZSBncmFtbWFyIGhhcyBubyBkZWZhdWx0IHN0YXJ0IHJ1bGUuJyk7XG4gICAgfVxuICAgIHZhciBzdGFydEFwcCA9IHRoaXMuZ3JhbW1hci5wYXJzZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uU3RyKTtcbiAgICByZXR1cm4gbmV3IHBleHBycy5TZXEoW3N0YXJ0QXBwLCBwZXhwcnMuZW5kXSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGNoZXI7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBOYW1lc3BhY2UoKSB7IH1cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuTmFtZXNwYWNlLmFzTmFtZXNwYWNlID0gZnVuY3Rpb24gKG9iak9yTmFtZXNwYWNlKSB7XG4gICAgaWYgKG9iak9yTmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSB7XG4gICAgICAgIHJldHVybiBvYmpPck5hbWVzcGFjZTtcbiAgICB9XG4gICAgcmV0dXJuIE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2Uob2JqT3JOYW1lc3BhY2UpO1xufTtcbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXMgc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXNcbi8vIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSA9IGZ1bmN0aW9uIChvcHRQcm9wcykge1xuICAgIHJldHVybiBOYW1lc3BhY2UuZXh0ZW5kKE5hbWVzcGFjZS5wcm90b3R5cGUsIG9wdFByb3BzKTtcbn07XG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlIHdoaWNoIGV4dGVuZHMgYW5vdGhlciBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXNcbi8vIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmV4dGVuZCA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG9wdFByb3BzKSB7XG4gICAgaWYgKG5hbWVzcGFjZSAhPT0gTmFtZXNwYWNlLnByb3RvdHlwZSAmJiAhKG5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgTmFtZXNwYWNlIG9iamVjdDogJyArIG5hbWVzcGFjZSk7XG4gICAgfVxuICAgIHZhciBucyA9IE9iamVjdC5jcmVhdGUobmFtZXNwYWNlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogTmFtZXNwYWNlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGV4dGVuZChucywgb3B0UHJvcHMpO1xufTtcbi8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGEgcmVndWxhciBtZXRob2Q/XG5OYW1lc3BhY2UudG9TdHJpbmcgPSBmdW5jdGlvbiAobnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5zKTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTmFtZXNwYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBQb3NJbmZvKCkge1xuICAgIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSBbXTsgLy8gYWN0aXZlIGFwcGxpY2F0aW9ucyBhdCB0aGlzIHBvc2l0aW9uXG4gICAgdGhpcy5tZW1vID0ge307XG4gICAgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IDA7XG4gICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gLTE7XG4gICAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHVuZGVmaW5lZDtcbn1cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICAgIGlzQWN0aXZlOiBmdW5jdGlvbiAoYXBwbGljYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2suaW5kZXhPZihhcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgPj0gMDtcbiAgICB9LFxuICAgIGVudGVyOiBmdW5jdGlvbiAoYXBwbGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wdXNoKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKTtcbiAgICB9LFxuICAgIGV4aXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wb3AoKTtcbiAgICB9LFxuICAgIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24gKGhlYWRBcHBsaWNhdGlvbiwgbWVtb1JlYykge1xuICAgICAgICBtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbiA9IHRydWU7XG4gICAgICAgIG1lbW9SZWMuaGVhZEFwcGxpY2F0aW9uID0gaGVhZEFwcGxpY2F0aW9uO1xuICAgICAgICBtZW1vUmVjLm5leHRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICAgICAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG1lbW9SZWM7XG4gICAgICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2s7XG4gICAgICAgIHZhciBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgKyAxO1xuICAgICAgICB2YXIgaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2suc2xpY2UoaW5kZXhPZkZpcnN0SW52b2x2ZWRSdWxlKTtcbiAgICAgICAgbWVtb1JlYy5pc0ludm9sdmVkID0gZnVuY3Rpb24gKGFwcGxpY2F0aW9uTWVtb0tleSkge1xuICAgICAgICAgICAgcmV0dXJuIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cy5pbmRleE9mKGFwcGxpY2F0aW9uTWVtb0tleSkgPj0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgbWVtb1JlYy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpZHggPSBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGU7IGlkeCA8IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5ID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2tbaWR4XTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNJbnZvbHZlZChhcHBsaWNhdGlvbk1lbW9LZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cy5wdXNoKGFwcGxpY2F0aW9uTWVtb0tleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbi5uZXh0TGVmdFJlY3Vyc2lvbjtcbiAgICB9LFxuICAgIC8vIE5vdGU6IHRoaXMgbWV0aG9kIGRvZXNuJ3QgZ2V0IGNhbGxlZCBmb3IgdGhlIFwiaGVhZFwiIG9mIGEgbGVmdCByZWN1cnNpb24gLS0gZm9yIExSIGhlYWRzLFxuICAgIC8vIHRoZSBtZW1vaXplZCByZXN1bHQgKHdoaWNoIHN0YXJ0cyBvdXQgYmVpbmcgYSBmYWlsdXJlKSBpcyBhbHdheXMgdXNlZC5cbiAgICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24gKG1lbW9SZWMpIHtcbiAgICAgICAgaWYgKCFtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjaztcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXBwbGljYXRpb25NZW1vS2V5U3RhY2subGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrW2lkeF07XG4gICAgICAgICAgICBpZiAobWVtb1JlYy5pc0ludm9sdmVkKGFwcGxpY2F0aW9uTWVtb0tleSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBtZW1vaXplOiBmdW5jdGlvbiAobWVtb0tleSwgbWVtb1JlYykge1xuICAgICAgICB0aGlzLm1lbW9bbWVtb0tleV0gPSBtZW1vUmVjO1xuICAgICAgICB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5tYXhFeGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCk7XG4gICAgICAgIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IE1hdGgubWF4KHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCwgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0KTtcbiAgICAgICAgcmV0dXJuIG1lbW9SZWM7XG4gICAgfSxcbiAgICBjbGVhck9ic29sZXRlRW50cmllczogZnVuY3Rpb24gKHBvcywgaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHBvcyArIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPD0gaW52YWxpZGF0ZWRJZHgpIHtcbiAgICAgICAgICAgIC8vIE9wdGltaXphdGlvbjogbm9uZSBvZiB0aGUgcnVsZSBhcHBsaWNhdGlvbnMgdGhhdCB3ZXJlIG1lbW9pemVkIGhlcmUgZXhhbWluZWQgdGhlXG4gICAgICAgICAgICAvLyBpbnRlcnZhbCBvZiB0aGUgaW5wdXQgdGhhdCBjaGFuZ2VkLCBzbyBub3RoaW5nIGhhcyB0byBiZSBpbnZhbGlkYXRlZC5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWVtbyA9IHRoaXMubWVtbztcbiAgICAgICAgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IDA7XG4gICAgICAgIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IC0xO1xuICAgICAgICBPYmplY3Qua2V5cyhtZW1vKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB2YXIgbWVtb1JlYyA9IG1lbW9ba107XG4gICAgICAgICAgICBpZiAocG9zICsgbWVtb1JlYy5leGFtaW5lZExlbmd0aCA+IGludmFsaWRhdGVkSWR4KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1lbW9ba107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KF90aGlzLm1heEV4YW1pbmVkTGVuZ3RoLCBtZW1vUmVjLmV4YW1pbmVkTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gTWF0aC5tYXgoX3RoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCwgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBQb3NJbmZvO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIEl0ZXJhdGlvbk5vZGUgPSByZXF1aXJlKCcuL25vZGVzJykuSXRlcmF0aW9uTm9kZTtcbnZhciBNYXRjaFJlc3VsdCA9IHJlcXVpcmUoJy4vTWF0Y2hSZXN1bHQnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgZ2xvYmFsQWN0aW9uU3RhY2sgPSBbXTtcbnZhciBwcm90b3R5cGVHcmFtbWFyO1xudmFyIHByb3RvdHlwZUdyYW1tYXJTZW1hbnRpY3M7XG4vLyBKU09OIGlzIG5vdCBhIHZhbGlkIHN1YnNldCBvZiBKYXZhU2NyaXB0IGJlY2F1c2UgdGhlcmUgYXJlIHR3byBwb3NzaWJsZSBsaW5lIHRlcm1pbmF0b3JzLFxuLy8gVSsyMDI4IChsaW5lIHNlcGFyYXRvcikgYW5kIFUrMjAyOSAocGFyYWdyYXBoIHNlcGFyYXRvcikgdGhhdCBhcmUgYWxsb3dlZCBpbiBKU09OIHN0cmluZ3Ncbi8vIGJ1dCBub3QgaW4gSmF2YVNjcmlwdCBzdHJpbmdzLlxuLy8ganNvblRvSlMoKSBwcm9wZXJseSBlbmNvZGVzIHRob3NlIHR3byBjaGFyYWN0ZXJzIGluIEpTT04gc28gdGhhdCBpdCBjYW4gc2VhbWxlc3NseSBiZVxuLy8gaW5zZXJ0ZWQgaW50byBKYXZhU2NyaXB0IGNvZGUgKHBsdXMgdGhlIGVuY29kZWQgdmVyc2lvbiBpcyBzdGlsbCB2YWxpZCBKU09OKVxuZnVuY3Rpb24ganNvblRvSlMoc3RyKSB7XG4gICAgdmFyIG91dHB1dCA9IHN0ci5yZXBsYWNlKC9bXFx1MjAyOFxcdTIwMjldL2csIGZ1bmN0aW9uIChjaGFyLCBwb3MsIHN0cikge1xuICAgICAgICB2YXIgaGV4ID0gY2hhci5jb2RlUG9pbnRBdCgwKS50b1N0cmluZygxNik7XG4gICAgICAgIHJldHVybiAnXFxcXHUnICsgJzAwMDAnLnNsaWNlKGhleC5sZW5ndGgpICsgaGV4O1xuICAgIH0pO1xuICAgIHJldHVybiBvdXRwdXQ7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBXcmFwcGVycyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gV3JhcHBlcnMgZGVjb3JhdGUgQ1NUIG5vZGVzIHdpdGggYWxsIG9mIHRoZSBmdW5jdGlvbmFsaXR5IChpLmUuLCBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzKVxuLy8gcHJvdmlkZWQgYnkgYSBTZW1hbnRpY3MgKHNlZSBiZWxvdykuIGBXcmFwcGVyYCBpcyB0aGUgYWJzdHJhY3Qgc3VwZXJjbGFzcyBvZiBhbGwgd3JhcHBlcnMuIEFcbi8vIGBXcmFwcGVyYCBtdXN0IGhhdmUgYF9ub2RlYCBhbmQgYF9zZW1hbnRpY3NgIGluc3RhbmNlIHZhcmlhYmxlcywgd2hpY2ggcmVmZXIgdG8gdGhlIENTVCBub2RlIGFuZFxuLy8gU2VtYW50aWNzIChyZXNwLikgZm9yIHdoaWNoIGl0IHdhcyBjcmVhdGVkLCBhbmQgYSBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlIHdoaWNoIGlzXG4vLyB1c2VkIHRvIGNhY2hlIHRoZSB3cmFwcGVyIGluc3RhbmNlcyB0aGF0IGFyZSBjcmVhdGVkIGZvciBpdHMgY2hpbGQgbm9kZXMuIFNldHRpbmcgdGhlc2UgaW5zdGFuY2Vcbi8vIHZhcmlhYmxlcyBpcyB0aGUgcmVzcG9uc2liaWxpdHkgb2YgdGhlIGNvbnN0cnVjdG9yIG9mIGVhY2ggU2VtYW50aWNzLXNwZWNpZmljIHN1YmNsYXNzIG9mXG4vLyBgV3JhcHBlcmAuXG52YXIgV3JhcHBlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBXcmFwcGVyKG5vZGUsIHNvdXJjZUludGVydmFsLCBiYXNlSW50ZXJ2YWwpIHtcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlSW50ZXJ2YWw7XG4gICAgICAgIC8vIFRoZSBpbnRlcnZhbCB0aGF0IHRoZSBjaGlsZE9mZnNldHMgb2YgYG5vZGVgIGFyZSByZWxhdGl2ZSB0by4gSXQgc2hvdWxkIGJlIHRoZSBzb3VyY2VcbiAgICAgICAgLy8gb2YgdGhlIGNsb3Nlc3QgTm9udGVybWluYWwgbm9kZS5cbiAgICAgICAgdGhpcy5fYmFzZUludGVydmFsID0gYmFzZUludGVydmFsO1xuICAgICAgICBpZiAobm9kZS5pc05vbnRlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgIGNvbW1vbi5hc3NlcnQoc291cmNlSW50ZXJ2YWwgPT09IGJhc2VJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hpbGRXcmFwcGVycyA9IFtdO1xuICAgIH1cbiAgICBXcmFwcGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICdbc2VtYW50aWNzIHdyYXBwZXIgZm9yICcgKyB0aGlzLl9ub2RlLmdyYW1tYXIubmFtZSArICddJztcbiAgICB9O1xuICAgIC8vIFRoaXMgaXMgdXNlZCBieSBvaG0gZWRpdG9yIHRvIGRpc3BsYXkgYSBub2RlIHdyYXBwZXIgYXBwcm9wcmlhdGVseS5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG4gICAgfTtcbiAgICBXcmFwcGVyLnByb3RvdHlwZS5fZm9yZ2V0TWVtb2l6ZWRSZXN1bHRGb3IgPSBmdW5jdGlvbiAoYXR0cmlidXRlTmFtZSkge1xuICAgICAgICAvLyBSZW1vdmUgdGhlIG1lbW9pemVkIGF0dHJpYnV0ZSBmcm9tIHRoZSBjc3ROb2RlIGFuZCBhbGwgaXRzIGNoaWxkcmVuLlxuICAgICAgICBkZWxldGUgdGhpcy5fbm9kZVt0aGlzLl9zZW1hbnRpY3MuYXR0cmlidXRlS2V5c1thdHRyaWJ1dGVOYW1lXV07XG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIGNoaWxkLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvcihhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvLyBSZXR1cm5zIHRoZSB3cmFwcGVyIG9mIHRoZSBzcGVjaWZpZWQgY2hpbGQgbm9kZS4gQ2hpbGQgd3JhcHBlcnMgYXJlIGNyZWF0ZWQgbGF6aWx5IGFuZFxuICAgIC8vIGNhY2hlZCBpbiB0aGUgcGFyZW50IHdyYXBwZXIncyBgX2NoaWxkV3JhcHBlcnNgIGluc3RhbmNlIHZhcmlhYmxlLlxuICAgIFdyYXBwZXIucHJvdG90eXBlLmNoaWxkID0gZnVuY3Rpb24gKGlkeCkge1xuICAgICAgICBpZiAoISgwIDw9IGlkeCAmJiBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCkpKSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBDb25zaWRlciB0aHJvd2luZyBhbiBleGNlcHRpb24gaGVyZS5cbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaWxkV3JhcHBlciA9IHRoaXMuX2NoaWxkV3JhcHBlcnNbaWR4XTtcbiAgICAgICAgaWYgKCFjaGlsZFdyYXBwZXIpIHtcbiAgICAgICAgICAgIHZhciBjaGlsZE5vZGUgPSB0aGlzLl9ub2RlLmNoaWxkQXQoaWR4KTtcbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSB0aGlzLl9ub2RlLmNoaWxkT2Zmc2V0c1tpZHhdO1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuX2Jhc2VJbnRlcnZhbC5zdWJJbnRlcnZhbChvZmZzZXQsIGNoaWxkTm9kZS5tYXRjaExlbmd0aCk7XG4gICAgICAgICAgICB2YXIgYmFzZSA9IGNoaWxkTm9kZS5pc05vbnRlcm1pbmFsKCkgPyBzb3VyY2UgOiB0aGlzLl9iYXNlSW50ZXJ2YWw7XG4gICAgICAgICAgICBjaGlsZFdyYXBwZXIgPSB0aGlzLl9jaGlsZFdyYXBwZXJzW2lkeF0gPSB0aGlzLl9zZW1hbnRpY3Mud3JhcChjaGlsZE5vZGUsIHNvdXJjZSwgYmFzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkV3JhcHBlcjtcbiAgICB9O1xuICAgIC8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgd3JhcHBlcnMgb2YgYWxsIG9mIHRoZSBjaGlsZHJlbiBvZiB0aGUgbm9kZSBhc3NvY2lhdGVkXG4gICAgLy8gd2l0aCB0aGlzIHdyYXBwZXIuXG4gICAgV3JhcHBlci5wcm90b3R5cGUuX2NoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBGb3JjZSB0aGUgY3JlYXRpb24gb2YgYWxsIGNoaWxkIHdyYXBwZXJzXG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgaWR4KyspIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGQoaWR4KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRXcmFwcGVycztcbiAgICB9O1xuICAgIC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGNvcnJlc3BvbmRzIHRvIGFuIGl0ZXJhdGlvblxuICAgIC8vIGV4cHJlc3Npb24sIGkuZS4sIGEgS2xlZW5lLSosIEtsZWVuZS0rLCBvciBhbiBvcHRpb25hbC4gUmV0dXJucyBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuaXNJdGVyYXRpb24oKTtcbiAgICB9O1xuICAgIC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgdGVybWluYWwgbm9kZSwgYGZhbHNlYFxuICAgIC8vIG90aGVyd2lzZS5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5pc1Rlcm1pbmFsKCk7XG4gICAgfTtcbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbiAgICAvLyBvdGhlcndpc2UuXG4gICAgV3JhcHBlci5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuaXNOb250ZXJtaW5hbCgpO1xuICAgIH07XG4gICAgLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlXG4gICAgLy8gY29ycmVzcG9uZGluZyB0byBhIHN5bnRhY3RpYyBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNOb250ZXJtaW5hbCgpICYmIHRoaXMuX25vZGUuaXNTeW50YWN0aWMoKTtcbiAgICB9O1xuICAgIC8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZVxuICAgIC8vIGNvcnJlc3BvbmRpbmcgdG8gYSBsZXhpY2FsIHJ1bGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgIFdyYXBwZXIucHJvdG90eXBlLmlzTGV4aWNhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNOb250ZXJtaW5hbCgpICYmIHRoaXMuX25vZGUuaXNMZXhpY2FsKCk7XG4gICAgfTtcbiAgICAvLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhbiBpdGVyYXRvciBub2RlXG4gICAgLy8gaGF2aW5nIGVpdGhlciBvbmUgb3Igbm8gY2hpbGQgKD8gb3BlcmF0b3IpLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICAvLyBPdGhlcndpc2UsIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgV3JhcHBlci5wcm90b3R5cGUuaXNPcHRpb25hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGUuaXNPcHRpb25hbCgpO1xuICAgIH07XG4gICAgLy8gQ3JlYXRlIGEgbmV3IF9pdGVyIHdyYXBwZXIgaW4gdGhlIHNhbWUgc2VtYW50aWNzIGFzIHRoaXMgd3JhcHBlci5cbiAgICBXcmFwcGVyLnByb3RvdHlwZS5pdGVyYXRpb24gPSBmdW5jdGlvbiAob3B0Q2hpbGRXcmFwcGVycykge1xuICAgICAgICB2YXIgY2hpbGRXcmFwcGVycyA9IG9wdENoaWxkV3JhcHBlcnMgfHwgW107XG4gICAgICAgIHZhciBjaGlsZE5vZGVzID0gY2hpbGRXcmFwcGVycy5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuX25vZGU7IH0pO1xuICAgICAgICB2YXIgaXRlciA9IG5ldyBJdGVyYXRpb25Ob2RlKHRoaXMuX25vZGUuZ3JhbW1hciwgY2hpbGROb2RlcywgW10sIC0xLCBmYWxzZSk7XG4gICAgICAgIHZhciB3cmFwcGVyID0gdGhpcy5fc2VtYW50aWNzLndyYXAoaXRlciwgbnVsbCwgbnVsbCk7XG4gICAgICAgIHdyYXBwZXIuX2NoaWxkV3JhcHBlcnMgPSBjaGlsZFdyYXBwZXJzO1xuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcmFwcGVyLnByb3RvdHlwZSwgXCJjaGlsZHJlblwiLCB7XG4gICAgICAgIC8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgY2hpbGRyZW4gb2YgdGhpcyBDU1Qgbm9kZS5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4oKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShXcmFwcGVyLnByb3RvdHlwZSwgXCJjdG9yTmFtZVwiLCB7XG4gICAgICAgIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgZ3JhbW1hciBydWxlIHRoYXQgY3JlYXRlZCB0aGlzIENTVCBub2RlLlxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ub2RlLmN0b3JOYW1lO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyYXBwZXIucHJvdG90eXBlLCBcImludGVydmFsXCIsIHtcbiAgICAgICAgLy8gVE9ETzogUmVtb3ZlIHRoaXMgZXZlbnR1YWxseSAoZGVwcmVjYXRlZCBpbiB2MC4xMikuXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGludGVydmFsYCBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIC0tIHVzZSBgc291cmNlYCBpbnN0ZWFkJyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JhcHBlci5wcm90b3R5cGUsIFwibnVtQ2hpbGRyZW5cIiwge1xuICAgICAgICAvLyBSZXR1cm5zIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gb2YgdGhpcyBDU1Qgbm9kZS5cbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5udW1DaGlsZHJlbigpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFdyYXBwZXIucHJvdG90eXBlLCBcInByaW1pdGl2ZVZhbHVlXCIsIHtcbiAgICAgICAgLy8gUmV0dXJucyB0aGUgcHJpbWl0aXZlIHZhbHVlIG9mIHRoaXMgQ1NUIG5vZGUsIGlmIGl0J3MgYSB0ZXJtaW5hbCBub2RlLiBPdGhlcndpc2UsXG4gICAgICAgIC8vIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgICAgIC8vIERFUFJFQ0FURUQ6IFVzZSBgc291cmNlU3RyaW5nYCBpbnN0ZWFkLlxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVGVybWluYWwoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ub2RlLnByaW1pdGl2ZVZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcInRyaWVkIHRvIGFjY2VzcyB0aGUgJ3ByaW1pdGl2ZVZhbHVlJyBhdHRyaWJ1dGUgb2YgYSBub24tdGVybWluYWwgQ1NUIG5vZGVcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoV3JhcHBlci5wcm90b3R5cGUsIFwic291cmNlU3RyaW5nXCIsIHtcbiAgICAgICAgLy8gUmV0dXJucyB0aGUgY29udGVudHMgb2YgdGhlIGlucHV0IHN0cmVhbSBjb25zdW1lZCBieSB0aGlzIENTVCBub2RlLlxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5jb250ZW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiBXcmFwcGVyO1xufSgpKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFNlbWFudGljcyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gQSBTZW1hbnRpY3MgaXMgYSBjb250YWluZXIgZm9yIGEgZmFtaWx5IG9mIE9wZXJhdGlvbnMgYW5kIEF0dHJpYnV0ZXMgZm9yIGEgZ2l2ZW4gZ3JhbW1hci5cbi8vIFNlbWFudGljcyBlbmFibGUgbW9kdWxhcml0eSAoZGlmZmVyZW50IGNsaWVudHMgb2YgYSBncmFtbWFyIGNhbiBjcmVhdGUgdGhlaXIgc2V0IG9mIG9wZXJhdGlvbnNcbi8vIGFuZCBhdHRyaWJ1dGVzIGluIGlzb2xhdGlvbikgYW5kIGV4dGVuc2liaWxpdHkgZXZlbiB3aGVuIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgYXJlIG11dHVhbGx5LVxuLy8gcmVjdXJzaXZlLiBUaGlzIGNvbnN0cnVjdG9yIHNob3VsZCBub3QgYmUgY2FsbGVkIGRpcmVjdGx5IGV4Y2VwdCBmcm9tXG4vLyBgU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljc2AuIFRoZSBub3JtYWwgd2F5cyB0byBjcmVhdGUgYSBTZW1hbnRpY3MsIGdpdmVuIGEgZ3JhbW1hciAnZycsIGFyZVxuLy8gYGcuY3JlYXRlU2VtYW50aWNzKClgIGFuZCBgZy5leHRlbmRTZW1hbnRpY3MocGFyZW50U2VtYW50aWNzKWAuXG5mdW5jdGlvbiBTZW1hbnRpY3MoZ3JhbW1hciwgc3VwZXJTZW1hbnRpY3MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICB0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cyA9IGZhbHNlO1xuICAgIC8vIENvbnN0cnVjdG9yIGZvciB3cmFwcGVyIGluc3RhbmNlcywgd2hpY2ggYXJlIHBhc3NlZCBhcyB0aGUgYXJndW1lbnRzIHRvIHRoZSBzZW1hbnRpYyBhY3Rpb25zXG4gICAgLy8gb2YgYW4gb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZS4gT3BlcmF0aW9ucyBhbmQgYXR0cmlidXRlcyByZXF1aXJlIGRvdWJsZSBkaXNwYXRjaDogdGhlIHNlbWFudGljXG4gICAgLy8gYWN0aW9uIGlzIGNob3NlbiBiYXNlZCBvbiBib3RoIHRoZSBub2RlJ3MgdHlwZSBhbmQgdGhlIHNlbWFudGljcy4gV3JhcHBlcnMgZW5zdXJlIHRoYXRcbiAgICAvLyB0aGUgYGV4ZWN1dGVgIG1ldGhvZCBpcyBjYWxsZWQgd2l0aCB0aGUgY29ycmVjdCAobW9zdCBzcGVjaWZpYykgc2VtYW50aWNzIG9iamVjdCBhcyBhblxuICAgIC8vIGFyZ3VtZW50LlxuICAgIHRoaXMuV3JhcHBlciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKFdyYXBwZXIsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIFdyYXBwZXIobm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCkge1xuICAgICAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgbm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCkgfHwgdGhpcztcbiAgICAgICAgICAgIHNlbGYuY2hlY2tBY3Rpb25EaWN0c0lmSGF2ZW50QWxyZWFkeSgpO1xuICAgICAgICAgICAgX3RoaXMuX3NlbWFudGljcyA9IHNlbGY7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFdyYXBwZXI7XG4gICAgfSgoc3VwZXJTZW1hbnRpY3MgPyBzdXBlclNlbWFudGljcy5XcmFwcGVyIDogV3JhcHBlcikpKTtcbiAgICB0aGlzLnN1cGVyID0gc3VwZXJTZW1hbnRpY3M7XG4gICAgaWYgKHN1cGVyU2VtYW50aWNzKSB7XG4gICAgICAgIGlmICghKGdyYW1tYXIuZXF1YWxzKHRoaXMuc3VwZXIuZ3JhbW1hcikgfHwgZ3JhbW1hci5faW5oZXJpdHNGcm9tKHRoaXMuc3VwZXIuZ3JhbW1hcikpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZXh0ZW5kIGEgc2VtYW50aWNzIGZvciBncmFtbWFyICdcIiArXG4gICAgICAgICAgICAgICAgdGhpcy5zdXBlci5ncmFtbWFyLm5hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyBmb3IgdXNlIHdpdGggZ3JhbW1hciAnXCIgK1xuICAgICAgICAgICAgICAgIGdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInIChub3QgYSBzdWItZ3JhbW1hcilcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLm9wZXJhdGlvbnMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIuYXR0cmlidXRlcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIC8vIEFzc2lnbiB1bmlxdWUgc3ltYm9scyBmb3IgZWFjaCBvZiB0aGUgYXR0cmlidXRlcyBpbmhlcml0ZWQgZnJvbSB0aGUgc3VwZXItc2VtYW50aWNzIHNvIHRoYXRcbiAgICAgICAgLy8gdGhleSBhcmUgbWVtb2l6ZWQgaW5kZXBlbmRlbnRseS5cbiAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmF0dHJpYnV0ZUtleXMsIGF0dHJpYnV0ZU5hbWUsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXRpbC51bmlxdWVJZChhdHRyaWJ1dGVOYW1lKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMub3BlcmF0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxufVxuU2VtYW50aWNzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ1tzZW1hbnRpY3MgZm9yICcgKyB0aGlzLmdyYW1tYXIubmFtZSArICddJztcbn07XG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cykge1xuICAgICAgICB0aGlzLmNoZWNrQWN0aW9uRGljdHMoKTtcbiAgICAgICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSB0cnVlO1xuICAgIH1cbn07XG4vLyBDaGVja3MgdGhhdCB0aGUgYWN0aW9uIGRpY3Rpb25hcmllcyBmb3IgYWxsIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgaW4gdGhpcyBzZW1hbnRpY3MsXG4vLyBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdCB3ZXJlIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3MsIGFncmVlIHdpdGggdGhlIGdyYW1tYXIuXG4vLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIG9uZSBvciBtb3JlIG9mIHRoZW0gZG9lc24ndC5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmFtZTtcbiAgICBmb3IgKG5hbWUgaW4gdGhpcy5vcGVyYXRpb25zKSB7XG4gICAgICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgICB9XG4gICAgZm9yIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG4gICAgfVxufTtcblNlbWFudGljcy5wcm90b3R5cGUudG9SZWNpcGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzT25seSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgZnVuY3Rpb24gaGFzU3VwZXJTZW1hbnRpY3Mocykge1xuICAgICAgICByZXR1cm4gcy5zdXBlciAhPT0gU2VtYW50aWNzLkJ1aWx0SW5TZW1hbnRpY3MuX2dldFNlbWFudGljcygpO1xuICAgIH1cbiAgICB2YXIgc3RyID0gJyhmdW5jdGlvbihnKSB7XFxuJztcbiAgICBpZiAoaGFzU3VwZXJTZW1hbnRpY3ModGhpcykpIHtcbiAgICAgICAgc3RyICs9ICcgIHZhciBzZW1hbnRpY3MgPSAnICsgdGhpcy5zdXBlci50b1JlY2lwZSh0cnVlKSArICcoZyc7XG4gICAgICAgIHZhciBzdXBlclNlbWFudGljc0dyYW1tYXIgPSB0aGlzLnN1cGVyLmdyYW1tYXI7XG4gICAgICAgIHZhciByZWxhdGVkR3JhbW1hciA9IHRoaXMuZ3JhbW1hcjtcbiAgICAgICAgd2hpbGUgKHJlbGF0ZWRHcmFtbWFyICE9PSBzdXBlclNlbWFudGljc0dyYW1tYXIpIHtcbiAgICAgICAgICAgIHN0ciArPSAnLnN1cGVyR3JhbW1hcic7XG4gICAgICAgICAgICByZWxhdGVkR3JhbW1hciA9IHJlbGF0ZWRHcmFtbWFyLnN1cGVyR3JhbW1hcjtcbiAgICAgICAgfVxuICAgICAgICBzdHIgKz0gJyk7XFxuJztcbiAgICAgICAgc3RyICs9ICcgIHJldHVybiBnLmV4dGVuZFNlbWFudGljcyhzZW1hbnRpY3MpJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0ciArPSAnICByZXR1cm4gZy5jcmVhdGVTZW1hbnRpY3MoKSc7XG4gICAgfVxuICAgIFsnT3BlcmF0aW9uJywgJ0F0dHJpYnV0ZSddLmZvckVhY2goZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgdmFyIHNlbWFudGljT3BlcmF0aW9ucyA9IF90aGlzW3R5cGUudG9Mb3dlckNhc2UoKSArICdzJ107XG4gICAgICAgIE9iamVjdC5rZXlzKHNlbWFudGljT3BlcmF0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdmFyIF9hID0gc2VtYW50aWNPcGVyYXRpb25zW25hbWVdLCBhY3Rpb25EaWN0ID0gX2EuYWN0aW9uRGljdCwgZm9ybWFscyA9IF9hLmZvcm1hbHMsIGJ1aWx0SW5EZWZhdWx0ID0gX2EuYnVpbHRJbkRlZmF1bHQ7XG4gICAgICAgICAgICB2YXIgc2lnbmF0dXJlID0gbmFtZTtcbiAgICAgICAgICAgIGlmIChmb3JtYWxzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBzaWduYXR1cmUgKz0gJygnICsgZm9ybWFscy5qb2luKCcsICcpICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1ldGhvZDtcbiAgICAgICAgICAgIGlmIChoYXNTdXBlclNlbWFudGljcyhfdGhpcykgJiYgX3RoaXMuc3VwZXJbdHlwZS50b0xvd2VyQ2FzZSgpICsgJ3MnXVtuYW1lXSkge1xuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICdleHRlbmQnICsgdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG1ldGhvZCA9ICdhZGQnICsgdHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0ciArPSAnXFxuICAgIC4nICsgbWV0aG9kICsgJygnICsgSlNPTi5zdHJpbmdpZnkoc2lnbmF0dXJlKSArICcsIHsnO1xuICAgICAgICAgICAgdmFyIHNyY0FycmF5ID0gW107XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhhY3Rpb25EaWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChhY3Rpb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbkRpY3RbYWN0aW9uTmFtZV0gIT09IGJ1aWx0SW5EZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBhY3Rpb25EaWN0W2FjdGlvbk5hbWVdLnRvU3RyaW5nKCkudHJpbSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IG1ldGhvZCBzaG9ydGhhbmQgdG8gcGxhaW4gb2xkIGZ1bmN0aW9uIHN5bnRheC5cbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2hhcmMvb2htL2lzc3Vlcy8yNjNcbiAgICAgICAgICAgICAgICAgICAgc291cmNlID0gc291cmNlLnJlcGxhY2UoL14uKlxcKC8sICdmdW5jdGlvbignKTtcbiAgICAgICAgICAgICAgICAgICAgc3JjQXJyYXkucHVzaCgnXFxuICAgICAgJyArIEpTT04uc3RyaW5naWZ5KGFjdGlvbk5hbWUpICsgJzogJyArIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzdHIgKz0gc3JjQXJyYXkuam9pbignLCcpICsgJ1xcbiAgICB9KSc7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHN0ciArPSAnO1xcbiAgfSknO1xuICAgIGlmICghc2VtYW50aWNzT25seSkge1xuICAgICAgICBzdHIgPVxuICAgICAgICAgICAgJyhmdW5jdGlvbigpIHtcXG4nICtcbiAgICAgICAgICAgICAgICAnICB2YXIgZ3JhbW1hciA9IHRoaXMuZnJvbVJlY2lwZSgnICtcbiAgICAgICAgICAgICAgICBqc29uVG9KUyh0aGlzLmdyYW1tYXIudG9SZWNpcGUoKSkgK1xuICAgICAgICAgICAgICAgICcpO1xcbicgK1xuICAgICAgICAgICAgICAgICcgIHZhciBzZW1hbnRpY3MgPSAnICtcbiAgICAgICAgICAgICAgICBzdHIgK1xuICAgICAgICAgICAgICAgICcoZ3JhbW1hcik7XFxuJyArXG4gICAgICAgICAgICAgICAgJyAgcmV0dXJuIHNlbWFudGljcztcXG4nICtcbiAgICAgICAgICAgICAgICAnfSk7XFxuJztcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG5mdW5jdGlvbiBwYXJzZVNpZ25hdHVyZShzaWduYXR1cmUsIHR5cGUpIHtcbiAgICBpZiAoIXByb3RvdHlwZUdyYW1tYXIpIHtcbiAgICAgICAgLy8gVGhlIE9wZXJhdGlvbnMgYW5kIEF0dHJpYnV0ZXMgZ3JhbW1hciB3b24ndCBiZSBhdmFpbGFibGUgd2hpbGUgT2htIGlzIGxvYWRpbmcsXG4gICAgICAgIC8vIGJ1dCB3ZSBjYW4gZ2V0IGF3YXkgdGhlIGZvbGxvd2luZyBzaW1wbGlmaWNhdGlvbiBiL2Mgbm9uZSBvZiB0aGUgb3BlcmF0aW9uc1xuICAgICAgICAvLyB0aGF0IGFyZSB1c2VkIHdoaWxlIGxvYWRpbmcgdGFrZSBhcmd1bWVudHMuXG4gICAgICAgIGNvbW1vbi5hc3NlcnQoc2lnbmF0dXJlLmluZGV4T2YoJygnKSA9PT0gLTEpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogc2lnbmF0dXJlLFxuICAgICAgICAgICAgZm9ybWFsczogW11cbiAgICAgICAgfTtcbiAgICB9XG4gICAgdmFyIHIgPSBwcm90b3R5cGVHcmFtbWFyLm1hdGNoKHNpZ25hdHVyZSwgdHlwZSA9PT0gJ29wZXJhdGlvbicgPyAnT3BlcmF0aW9uU2lnbmF0dXJlJyA6ICdBdHRyaWJ1dGVTaWduYXR1cmUnKTtcbiAgICBpZiAoci5mYWlsZWQoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3Ioci5tZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb3RvdHlwZUdyYW1tYXJTZW1hbnRpY3MocikucGFyc2UoKTtcbn1cbmZ1bmN0aW9uIG5ld0RlZmF1bHRBY3Rpb24odHlwZSwgbmFtZSwgZG9JdCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHRoaXNUaGluZyA9IHRoaXMuX3NlbWFudGljcy5vcGVyYXRpb25zW25hbWVdIHx8IHRoaXMuX3NlbWFudGljcy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICB2YXIgYXJncyA9IHRoaXNUaGluZy5mb3JtYWxzLm1hcChmdW5jdGlvbiAoZm9ybWFsKSB7IHJldHVybiBfdGhpcy5hcmdzW2Zvcm1hbF07IH0pO1xuICAgICAgICBpZiAoIXRoaXMuaXNJdGVyYXRpb24oKSAmJiBjaGlsZHJlbi5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgQ1NUIG5vZGUgY29ycmVzcG9uZHMgdG8gYSBub24tdGVybWluYWwgaW4gdGhlIGdyYW1tYXIgKGUuZy4sIEFkZEV4cHIpLiBUaGUgZmFjdCB0aGF0XG4gICAgICAgICAgICAvLyB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoaXMgYWN0aW9uIGRpY3Rpb25hcnkgZG9lc24ndCBoYXZlIGFuIGFjdGlvbiBmb3IgdGhpcyBwYXJ0aWN1bGFyXG4gICAgICAgICAgICAvLyBub24tdGVybWluYWwgb3IgYSBnZW5lcmljIGBfbm9udGVybWluYWxgIGFjdGlvbi5cbiAgICAgICAgICAgIC8vIEFzIGEgY29udmVuaWVuY2UsIGlmIHRoaXMgbm9kZSBvbmx5IGhhcyBvbmUgY2hpbGQsIHdlIGp1c3QgcmV0dXJuIHRoZSByZXN1bHQgb2YgYXBwbHlpbmdcbiAgICAgICAgICAgIC8vIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIHRvIHRoZSBjaGlsZCBub2RlLlxuICAgICAgICAgICAgcmV0dXJuIGRvSXQuYXBwbHkoY2hpbGRyZW5bMF0sIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSB0aHJvdyBhbiBleGNlcHRpb24gdG8gbGV0IHRoZSBwcm9ncmFtbWVyIGtub3cgdGhhdCB3ZSBkb24ndCBrbm93IHdoYXRcbiAgICAgICAgICAgIC8vIHRvIGRvIHdpdGggdGhpcyBub2RlLlxuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLm1pc3NpbmdTZW1hbnRpY0FjdGlvbih0aGlzLmN0b3JOYW1lLCBuYW1lLCB0eXBlLCBnbG9iYWxBY3Rpb25TdGFjayk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuU2VtYW50aWNzLnByb3RvdHlwZS5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uICh0eXBlLCBzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICB2YXIgdHlwZVBsdXJhbCA9IHR5cGUgKyAncyc7XG4gICAgdmFyIHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzID0gcGFyc2VTaWduYXR1cmUoc2lnbmF0dXJlLCB0eXBlKTtcbiAgICB2YXIgbmFtZSA9IHBhcnNlZE5hbWVBbmRGb3JtYWxBcmdzLm5hbWU7XG4gICAgdmFyIGZvcm1hbHMgPSBwYXJzZWROYW1lQW5kRm9ybWFsQXJncy5mb3JtYWxzO1xuICAgIC8vIFRPRE86IGNoZWNrIHRoYXQgdGhlcmUgYXJlIG5vIGR1cGxpY2F0ZSBmb3JtYWwgYXJndW1lbnRzXG4gICAgdGhpcy5hc3NlcnROZXdOYW1lKG5hbWUsIHR5cGUpO1xuICAgIC8vIENyZWF0ZSB0aGUgYWN0aW9uIGRpY3Rpb25hcnkgZm9yIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIHRoYXQgY29udGFpbnMgYSBgX2RlZmF1bHRgIGFjdGlvblxuICAgIC8vIHdoaWNoIGRlZmluZXMgdGhlIGRlZmF1bHQgYmVoYXZpb3Igb2YgaXRlcmF0aW9uLCB0ZXJtaW5hbCwgYW5kIG5vbi10ZXJtaW5hbCBub2Rlcy4uLlxuICAgIHZhciBidWlsdEluRGVmYXVsdCA9IG5ld0RlZmF1bHRBY3Rpb24odHlwZSwgbmFtZSwgZG9JdCk7XG4gICAgdmFyIHJlYWxBY3Rpb25EaWN0ID0geyBfZGVmYXVsdDogYnVpbHRJbkRlZmF1bHQgfTtcbiAgICAvLyAuLi4gYW5kIGFkZCBpbiB0aGUgYWN0aW9ucyBzdXBwbGllZCBieSB0aGUgcHJvZ3JhbW1lciwgd2hpY2ggbWF5IG92ZXJyaWRlIHNvbWUgb3IgYWxsIG9mIHRoZVxuICAgIC8vIGRlZmF1bHQgb25lcy5cbiAgICBPYmplY3Qua2V5cyhhY3Rpb25EaWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJlYWxBY3Rpb25EaWN0W25hbWVdID0gYWN0aW9uRGljdFtuYW1lXTtcbiAgICB9KTtcbiAgICB2YXIgZW50cnkgPSB0eXBlID09PSAnb3BlcmF0aW9uJ1xuICAgICAgICA/IG5ldyBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KVxuICAgICAgICA6IG5ldyBBdHRyaWJ1dGUobmFtZSwgcmVhbEFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KTtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gICAgLy8gY2F0Y2ggZXJyb3JzIGVhcmx5LlxuICAgIGVudHJ5LmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xuICAgIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0gPSBlbnRyeTtcbiAgICBmdW5jdGlvbiBkb0l0KCkge1xuICAgICAgICAvLyBEaXNwYXRjaCB0byBtb3N0IHNwZWNpZmljIHZlcnNpb24gb2YgdGhpcyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgLS0gaXQgbWF5IGhhdmUgYmVlblxuICAgICAgICAvLyBvdmVycmlkZGVuIGJ5IGEgc3ViLXNlbWFudGljcy5cbiAgICAgICAgdmFyIHRoaXNUaGluZyA9IHRoaXMuX3NlbWFudGljc1t0eXBlUGx1cmFsXVtuYW1lXTtcbiAgICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgY2FsbGVyIHBhc3NlZCB0aGUgY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzLlxuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gdGhpc1RoaW5nLmZvcm1hbHMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbnVtYmVyIG9mIGFyZ3VtZW50cyBwYXNzZWQgdG8gJyArXG4gICAgICAgICAgICAgICAgbmFtZSArXG4gICAgICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgICAgICB0eXBlICtcbiAgICAgICAgICAgICAgICAnIChleHBlY3RlZCAnICtcbiAgICAgICAgICAgICAgICB0aGlzVGhpbmcuZm9ybWFscy5sZW5ndGggK1xuICAgICAgICAgICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgICAgICAgICBhcmd1bWVudHMubGVuZ3RoICtcbiAgICAgICAgICAgICAgICAnKScpO1xuICAgICAgICB9XG4gICAgICAgIC8vIENyZWF0ZSBhbiBcImFyZ3VtZW50cyBvYmplY3RcIiBmcm9tIHRoZSBhcmd1bWVudHMgdGhhdCB3ZXJlIHBhc3NlZCB0byB0aGlzXG4gICAgICAgIC8vIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZS5cbiAgICAgICAgdmFyIGFyZ3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgdmFyIGZvcm1hbCA9IHRoaXNUaGluZy5mb3JtYWxzW2lkeF07XG4gICAgICAgICAgICBhcmdzW2Zvcm1hbF0gPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb2xkQXJncyA9IHRoaXMuYXJncztcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdmFyIGFucyA9IHRoaXNUaGluZy5leGVjdXRlKHRoaXMuX3NlbWFudGljcywgdGhpcyk7XG4gICAgICAgIHRoaXMuYXJncyA9IG9sZEFyZ3M7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnb3BlcmF0aW9uJykge1xuICAgICAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdID0gZG9JdDtcbiAgICAgICAgdGhpcy5XcmFwcGVyLnByb3RvdHlwZVtuYW1lXS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAnWycgKyBuYW1lICsgJyBvcGVyYXRpb25dJztcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLldyYXBwZXIucHJvdG90eXBlLCBuYW1lLCB7XG4gICAgICAgICAgICBnZXQ6IGRvSXQsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUgLy8gU28gdGhlIHByb3BlcnR5IGNhbiBiZSBkZWxldGVkLlxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuYXR0cmlidXRlS2V5cywgbmFtZSwge1xuICAgICAgICAgICAgdmFsdWU6IHV0aWwudW5pcXVlSWQobmFtZSlcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblNlbWFudGljcy5wcm90b3R5cGUuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgYWN0aW9uRGljdCkge1xuICAgIHZhciB0eXBlUGx1cmFsID0gdHlwZSArICdzJztcbiAgICAvLyBNYWtlIHN1cmUgdGhhdCBgbmFtZWAgcmVhbGx5IGlzIGp1c3QgYSBuYW1lLCBpLmUuLCB0aGF0IGl0IGRvZXNuJ3QgYWxzbyBjb250YWluIGZvcm1hbHMuXG4gICAgcGFyc2VTaWduYXR1cmUobmFtZSwgJ2F0dHJpYnV0ZScpO1xuICAgIGlmICghKHRoaXMuc3VwZXIgJiYgbmFtZSBpbiB0aGlzLnN1cGVyW3R5cGVQbHVyYWxdKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBleHRlbmQgJyArXG4gICAgICAgICAgICB0eXBlICtcbiAgICAgICAgICAgIFwiICdcIiArXG4gICAgICAgICAgICBuYW1lICtcbiAgICAgICAgICAgIFwiJzogZGlkIG5vdCBpbmhlcml0IGFuIFwiICtcbiAgICAgICAgICAgIHR5cGUgK1xuICAgICAgICAgICAgJyB3aXRoIHRoYXQgbmFtZScpO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbdHlwZVBsdXJhbF0sIG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIicgYWdhaW5cIik7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBhIG5ldyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgd2hvc2UgYWN0aW9uRGljdCBkZWxlZ2F0ZXMgdG8gdGhlIHN1cGVyIG9wZXJhdGlvbiAvXG4gICAgLy8gYXR0cmlidXRlJ3MgYWN0aW9uRGljdCwgYW5kIHdoaWNoIGhhcyBhbGwgdGhlIGtleXMgZnJvbSBgaW5oZXJpdGVkQWN0aW9uRGljdGAuXG4gICAgdmFyIGluaGVyaXRlZEZvcm1hbHMgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmZvcm1hbHM7XG4gICAgdmFyIGluaGVyaXRlZEFjdGlvbkRpY3QgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmFjdGlvbkRpY3Q7XG4gICAgdmFyIG5ld0FjdGlvbkRpY3QgPSBPYmplY3QuY3JlYXRlKGluaGVyaXRlZEFjdGlvbkRpY3QpO1xuICAgIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgbmV3QWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gICAgfSk7XG4gICAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9XG4gICAgICAgIHR5cGUgPT09ICdvcGVyYXRpb24nXG4gICAgICAgICAgICA/IG5ldyBPcGVyYXRpb24obmFtZSwgaW5oZXJpdGVkRm9ybWFscywgbmV3QWN0aW9uRGljdClcbiAgICAgICAgICAgIDogbmV3IEF0dHJpYnV0ZShuYW1lLCBuZXdBY3Rpb25EaWN0KTtcbiAgICAvLyBUaGUgZm9sbG93aW5nIGNoZWNrIGlzIG5vdCBzdHJpY3RseSBuZWNlc3NhcnkgKGl0IHdpbGwgaGFwcGVuIGxhdGVyIGFueXdheSkgYnV0IGl0J3MgYmV0dGVyIHRvXG4gICAgLy8gY2F0Y2ggZXJyb3JzIGVhcmx5LlxuICAgIHRoaXNbdHlwZVBsdXJhbF1bbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG59O1xuU2VtYW50aWNzLnByb3RvdHlwZS5hc3NlcnROZXdOYW1lID0gZnVuY3Rpb24gKG5hbWUsIHR5cGUpIHtcbiAgICBpZiAoV3JhcHBlci5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYWRkICcgKyB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJzogdGhhdCdzIGEgcmVzZXJ2ZWQgbmFtZVwiKTtcbiAgICB9XG4gICAgaWYgKG5hbWUgaW4gdGhpcy5vcGVyYXRpb25zKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IGFuIG9wZXJhdGlvbiB3aXRoIHRoYXQgbmFtZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICB9XG4gICAgaWYgKG5hbWUgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IGFuIGF0dHJpYnV0ZSB3aXRoIHRoYXQgbmFtZSBhbHJlYWR5IGV4aXN0c1wiKTtcbiAgICB9XG59O1xuLy8gUmV0dXJucyBhIHdyYXBwZXIgZm9yIHRoZSBnaXZlbiBDU1QgYG5vZGVgIGluIHRoaXMgc2VtYW50aWNzLlxuLy8gSWYgYG5vZGVgIGlzIGFscmVhZHkgYSB3cmFwcGVyLCByZXR1cm5zIGBub2RlYCBpdHNlbGYuICAvLyBUT0RPOiB3aHkgaXMgdGhpcyBuZWVkZWQ/XG5TZW1hbnRpY3MucHJvdG90eXBlLndyYXAgPSBmdW5jdGlvbiAobm9kZSwgc291cmNlLCBvcHRCYXNlSW50ZXJ2YWwpIHtcbiAgICB2YXIgYmFzZUludGVydmFsID0gb3B0QmFzZUludGVydmFsIHx8IHNvdXJjZTtcbiAgICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIHRoaXMuV3JhcHBlciA/IG5vZGUgOiBuZXcgdGhpcy5XcmFwcGVyKG5vZGUsIHNvdXJjZSwgYmFzZUludGVydmFsKTtcbn07XG4vLyBDcmVhdGVzIGEgbmV3IFNlbWFudGljcyBpbnN0YW5jZSBmb3IgYGdyYW1tYXJgLCBpbmhlcml0aW5nIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgZnJvbVxuLy8gYG9wdFN1cGVyU2VtYW50aWNzYCwgaWYgaXQgaXMgc3BlY2lmaWVkLiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgcHJveHkgZm9yIHRoZSBuZXdcbi8vIFNlbWFudGljcyBpbnN0YW5jZS4gV2hlbiB0aGF0IGZ1bmN0aW9uIGlzIGludm9rZWQgd2l0aCBhIENTVCBub2RlIGFzIGFuIGFyZ3VtZW50LCBpdCByZXR1cm5zXG4vLyBhIHdyYXBwZXIgZm9yIHRoYXQgbm9kZSB3aGljaCBnaXZlcyBhY2Nlc3MgdG8gdGhlIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcHJvdmlkZWQgYnkgdGhpc1xuLy8gc2VtYW50aWNzLlxuU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyA9IGZ1bmN0aW9uIChncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcykge1xuICAgIHZhciBzID0gbmV3IFNlbWFudGljcyhncmFtbWFyLCBvcHRTdXBlclNlbWFudGljcyAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gb3B0U3VwZXJTZW1hbnRpY3NcbiAgICAgICAgOiBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcy5fZ2V0U2VtYW50aWNzKCkpO1xuICAgIC8vIFRvIGVuYWJsZSBjbGllbnRzIHRvIGludm9rZSBhIHNlbWFudGljcyBsaWtlIGEgZnVuY3Rpb24sIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIHByb3h5XG4gICAgLy8gZm9yIGBzYCwgd2hpY2ggaXMgdGhlIHJlYWwgYFNlbWFudGljc2AgaW5zdGFuY2UuXG4gICAgdmFyIHByb3h5ID0gZnVuY3Rpb24gQVNlbWFudGljcyhtYXRjaFJlc3VsdCkge1xuICAgICAgICBpZiAoIShtYXRjaFJlc3VsdCBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU2VtYW50aWNzIGV4cGVjdGVkIGEgTWF0Y2hSZXN1bHQsIGJ1dCBnb3QgJyArXG4gICAgICAgICAgICAgICAgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhtYXRjaFJlc3VsdCkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaFJlc3VsdC5mYWlsZWQoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignY2Fubm90IGFwcGx5IFNlbWFudGljcyB0byAnICsgbWF0Y2hSZXN1bHQudG9TdHJpbmcoKSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNzdCA9IG1hdGNoUmVzdWx0Ll9jc3Q7XG4gICAgICAgIGlmIChjc3QuZ3JhbW1hciAhPT0gZ3JhbW1hcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHVzZSBhIE1hdGNoUmVzdWx0IGZyb20gZ3JhbW1hciAnXCIgK1xuICAgICAgICAgICAgICAgIGNzdC5ncmFtbWFyLm5hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyB3aXRoIGEgc2VtYW50aWNzIGZvciAnXCIgK1xuICAgICAgICAgICAgICAgIGdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpbnB1dFN0cmVhbSA9IG5ldyBJbnB1dFN0cmVhbShtYXRjaFJlc3VsdC5pbnB1dCk7XG4gICAgICAgIHJldHVybiBzLndyYXAoY3N0LCBpbnB1dFN0cmVhbS5pbnRlcnZhbChtYXRjaFJlc3VsdC5fY3N0T2Zmc2V0LCBtYXRjaFJlc3VsdC5pbnB1dC5sZW5ndGgpKTtcbiAgICB9O1xuICAgIC8vIEZvcndhcmQgcHVibGljIG1ldGhvZHMgZnJvbSB0aGUgcHJveHkgdG8gdGhlIHNlbWFudGljcyBpbnN0YW5jZS5cbiAgICBwcm94eS5hZGRPcGVyYXRpb24gPSBmdW5jdGlvbiAoc2lnbmF0dXJlLCBhY3Rpb25EaWN0KSB7XG4gICAgICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ29wZXJhdGlvbicsIHNpZ25hdHVyZSwgYWN0aW9uRGljdCk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9O1xuICAgIHByb3h5LmV4dGVuZE9wZXJhdGlvbiA9IGZ1bmN0aW9uIChuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgICAgIHMuZXh0ZW5kT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ29wZXJhdGlvbicsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfTtcbiAgICBwcm94eS5hZGRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYWN0aW9uRGljdCkge1xuICAgICAgICBzLmFkZE9wZXJhdGlvbk9yQXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuZXh0ZW5kQXR0cmlidXRlID0gZnVuY3Rpb24gKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSgnYXR0cmlidXRlJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9O1xuICAgIHByb3h5Ll9nZXRBY3Rpb25EaWN0ID0gZnVuY3Rpb24gKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSkge1xuICAgICAgICB2YXIgYWN0aW9uID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV0gfHwgcy5hdHRyaWJ1dGVzW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgIGlmICghYWN0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiJyArXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lICtcbiAgICAgICAgICAgICAgICAnXCIgaXMgbm90IGEgdmFsaWQgb3BlcmF0aW9uIG9yIGF0dHJpYnV0ZSAnICtcbiAgICAgICAgICAgICAgICAnbmFtZSBpbiB0aGlzIHNlbWFudGljcyBmb3IgXCInICtcbiAgICAgICAgICAgICAgICBncmFtbWFyLm5hbWUgK1xuICAgICAgICAgICAgICAgICdcIicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY3Rpb24uYWN0aW9uRGljdDtcbiAgICB9O1xuICAgIHByb3h5Ll9yZW1vdmUgPSBmdW5jdGlvbiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIHZhciBzZW1hbnRpYztcbiAgICAgICAgaWYgKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSBpbiBzLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgIHNlbWFudGljID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgICAgICBkZWxldGUgcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lIGluIHMuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgc2VtYW50aWMgPSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgICAgIGRlbGV0ZSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcy5XcmFwcGVyLnByb3RvdHlwZVtvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICByZXR1cm4gc2VtYW50aWM7XG4gICAgfTtcbiAgICBwcm94eS5nZXRPcGVyYXRpb25OYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHMub3BlcmF0aW9ucyk7XG4gICAgfTtcbiAgICBwcm94eS5nZXRBdHRyaWJ1dGVOYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHMuYXR0cmlidXRlcyk7XG4gICAgfTtcbiAgICBwcm94eS5nZXRHcmFtbWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcy5ncmFtbWFyO1xuICAgIH07XG4gICAgcHJveHkudG9SZWNpcGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzT25seSkge1xuICAgICAgICByZXR1cm4gcy50b1JlY2lwZShzZW1hbnRpY3NPbmx5KTtcbiAgICB9O1xuICAgIC8vIE1ha2UgdGhlIHByb3h5J3MgdG9TdHJpbmcoKSB3b3JrLlxuICAgIHByb3h5LnRvU3RyaW5nID0gcy50b1N0cmluZy5iaW5kKHMpO1xuICAgIC8vIFJldHVybnMgdGhlIHNlbWFudGljcyBmb3IgdGhlIHByb3h5LlxuICAgIHByb3h5Ll9nZXRTZW1hbnRpY3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH07XG4gICAgcmV0dXJuIHByb3h5O1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tIE9wZXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gQW4gT3BlcmF0aW9uIHJlcHJlc2VudHMgYSBmdW5jdGlvbiB0byBiZSBhcHBsaWVkIHRvIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgLS0gaXQncyB2ZXJ5XG4vLyBzaW1pbGFyIHRvIGEgVmlzaXRvciAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WaXNpdG9yX3BhdHRlcm4pLiBBbiBvcGVyYXRpb24gaXMgZXhlY3V0ZWQgYnlcbi8vIHJlY3Vyc2l2ZWx5IHdhbGtpbmcgdGhlIENTVCwgYW5kIGF0IGVhY2ggbm9kZSwgaW52b2tpbmcgdGhlIG1hdGNoaW5nIHNlbWFudGljIGFjdGlvbiBmcm9tXG4vLyBgYWN0aW9uRGljdGAuIFNlZSBgT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlYCBmb3IgZGV0YWlscyBvZiBob3cgYSBDU1Qgbm9kZSdzIG1hdGNoaW5nIHNlbWFudGljXG4vLyBhY3Rpb24gaXMgZm91bmQuXG52YXIgT3BlcmF0aW9uID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIE9wZXJhdGlvbihuYW1lLCBmb3JtYWxzLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmZvcm1hbHMgPSBmb3JtYWxzO1xuICAgICAgICB0aGlzLmFjdGlvbkRpY3QgPSBhY3Rpb25EaWN0O1xuICAgICAgICB0aGlzLmJ1aWx0SW5EZWZhdWx0ID0gYnVpbHRJbkRlZmF1bHQ7XG4gICAgfVxuICAgIE9wZXJhdGlvbi5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0ID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAgICAgZ3JhbW1hci5fY2hlY2tUb3BEb3duQWN0aW9uRGljdCh0aGlzLnR5cGVOYW1lLCB0aGlzLm5hbWUsIHRoaXMuYWN0aW9uRGljdCk7XG4gICAgfTtcbiAgICAvLyBFeGVjdXRlIHRoaXMgb3BlcmF0aW9uIG9uIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggYG5vZGVXcmFwcGVyYCBpbiB0aGUgY29udGV4dCBvZiB0aGVcbiAgICAvLyBnaXZlbiBTZW1hbnRpY3MgaW5zdGFuY2UuXG4gICAgT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIExvb2sgZm9yIGEgc2VtYW50aWMgYWN0aW9uIHdob3NlIG5hbWUgbWF0Y2hlcyB0aGUgbm9kZSdzIGNvbnN0cnVjdG9yIG5hbWUsIHdoaWNoIGlzIGVpdGhlclxuICAgICAgICAgICAgLy8gdGhlIG5hbWUgb2YgYSBydWxlIGluIHRoZSBncmFtbWFyLCBvciAnX3Rlcm1pbmFsJyAoZm9yIGEgdGVybWluYWwgbm9kZSksIG9yICdfaXRlcicgKGZvciBhblxuICAgICAgICAgICAgLy8gaXRlcmF0aW9uIG5vZGUpLiBJbiB0aGUgbGF0dGVyIGNhc2UsIHRoZSBhY3Rpb24gZnVuY3Rpb24gcmVjZWl2ZXMgYSBzaW5nbGUgYXJndW1lbnQsIHdoaWNoXG4gICAgICAgICAgICAvLyBpcyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIENTVCBub2RlLlxuICAgICAgICAgICAgdmFyIGN0b3JOYW1lID0gbm9kZVdyYXBwZXIuX25vZGUuY3Rvck5hbWU7XG4gICAgICAgICAgICB2YXIgYWN0aW9uRm4gPSB0aGlzLmFjdGlvbkRpY3RbY3Rvck5hbWVdO1xuICAgICAgICAgICAgdmFyIGFucyA9IHZvaWQgMDtcbiAgICAgICAgICAgIGlmIChhY3Rpb25Gbikge1xuICAgICAgICAgICAgICAgIGdsb2JhbEFjdGlvblN0YWNrLnB1c2goW3RoaXMsIGN0b3JOYW1lXSk7XG4gICAgICAgICAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25Gbiwgbm9kZVdyYXBwZXIuaXNJdGVyYXRpb24oKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFucztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFRoZSBhY3Rpb24gZGljdGlvbmFyeSBkb2VzIG5vdCBjb250YWluIGEgc2VtYW50aWMgYWN0aW9uIGZvciB0aGlzIHNwZWNpZmljIHR5cGUgb2Ygbm9kZS5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgaXMgYSBub250ZXJtaW5hbCBub2RlIGFuZCB0aGUgcHJvZ3JhbW1lciBoYXMgcHJvdmlkZWQgYSBgX25vbnRlcm1pbmFsYCBzZW1hbnRpY1xuICAgICAgICAgICAgLy8gYWN0aW9uLCB3ZSBpbnZva2UgaXQ6XG4gICAgICAgICAgICBpZiAobm9kZVdyYXBwZXIuaXNOb250ZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICAgICAgYWN0aW9uRm4gPSB0aGlzLmFjdGlvbkRpY3QuX25vbnRlcm1pbmFsO1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb25Gbikge1xuICAgICAgICAgICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wdXNoKFt0aGlzLCAnX25vbnRlcm1pbmFsJywgY3Rvck5hbWVdKTtcbiAgICAgICAgICAgICAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25GbiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbnM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBpbnZva2UgdGhlICdfZGVmYXVsdCcgc2VtYW50aWMgYWN0aW9uLlxuICAgICAgICAgICAgZ2xvYmFsQWN0aW9uU3RhY2sucHVzaChbdGhpcywgJ2RlZmF1bHQgYWN0aW9uJywgY3Rvck5hbWVdKTtcbiAgICAgICAgICAgIGFucyA9IHRoaXMuZG9BY3Rpb24oc2VtYW50aWNzLCBub2RlV3JhcHBlciwgdGhpcy5hY3Rpb25EaWN0Ll9kZWZhdWx0LCB0cnVlKTtcbiAgICAgICAgICAgIHJldHVybiBhbnM7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wb3AoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLy8gSW52b2tlIGBhY3Rpb25GbmAgb24gdGhlIENTVCBub2RlIHRoYXQgY29ycmVzcG9uZHMgdG8gYG5vZGVXcmFwcGVyYCwgaW4gdGhlIGNvbnRleHQgb2ZcbiAgICAvLyBgc2VtYW50aWNzYC4gSWYgYG9wdFBhc3NDaGlsZHJlbkFzQXJyYXlgIGlzIHRydXRoeSwgYGFjdGlvbkZuYCB3aWxsIGJlIGNhbGxlZCB3aXRoIGEgc2luZ2xlXG4gICAgLy8gYXJndW1lbnQsIHdoaWNoIGlzIGFuIGFycmF5IG9mIHdyYXBwZXJzLiBPdGhlcndpc2UsIHRoZSBudW1iZXIgb2YgYXJndW1lbnRzIHRvIGBhY3Rpb25GbmAgd2lsbFxuICAgIC8vIGJlIGVxdWFsIHRvIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gaW4gdGhlIENTVCBub2RlLlxuICAgIE9wZXJhdGlvbi5wcm90b3R5cGUuZG9BY3Rpb24gPSBmdW5jdGlvbiAoc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkpIHtcbiAgICAgICAgcmV0dXJuIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXlcbiAgICAgICAgICAgID8gYWN0aW9uRm4uY2FsbChub2RlV3JhcHBlciwgbm9kZVdyYXBwZXIuX2NoaWxkcmVuKCkpXG4gICAgICAgICAgICA6IGFjdGlvbkZuLmFwcGx5KG5vZGVXcmFwcGVyLCBub2RlV3JhcHBlci5fY2hpbGRyZW4oKSk7XG4gICAgfTtcbiAgICByZXR1cm4gT3BlcmF0aW9uO1xufSgpKTtcbk9wZXJhdGlvbi5wcm90b3R5cGUudHlwZU5hbWUgPSAnb3BlcmF0aW9uJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tIEF0dHJpYnV0ZSAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gQXR0cmlidXRlcyBhcmUgT3BlcmF0aW9ucyB3aG9zZSByZXN1bHRzIGFyZSBtZW1vaXplZC4gVGhpcyBtZWFucyB0aGF0LCBmb3IgYW55IGdpdmVuIHNlbWFudGljcyxcbi8vIHRoZSBzZW1hbnRpYyBhY3Rpb24gZm9yIGEgQ1NUIG5vZGUgd2lsbCBiZSBpbnZva2VkIG5vIG1vcmUgdGhhbiBvbmNlLlxudmFyIEF0dHJpYnV0ZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQXR0cmlidXRlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEF0dHJpYnV0ZShuYW1lLCBhY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyLmNhbGwodGhpcywgbmFtZSwgW10sIGFjdGlvbkRpY3QsIGJ1aWx0SW5EZWZhdWx0KSB8fCB0aGlzO1xuICAgIH1cbiAgICBBdHRyaWJ1dGUucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAgICAgICB2YXIgbm9kZSA9IG5vZGVXcmFwcGVyLl9ub2RlO1xuICAgICAgICB2YXIga2V5ID0gc2VtYW50aWNzLmF0dHJpYnV0ZUtleXNbdGhpcy5uYW1lXTtcbiAgICAgICAgaWYgKCFub2RlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgYSBzdXBlci1zZW5kIC0tIGlzbid0IEpTIGJlYXV0aWZ1bD8gOi9cbiAgICAgICAgICAgIG5vZGVba2V5XSA9IE9wZXJhdGlvbi5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMsIHNlbWFudGljcywgbm9kZVdyYXBwZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlW2tleV07XG4gICAgfTtcbiAgICByZXR1cm4gQXR0cmlidXRlO1xufShPcGVyYXRpb24pKTtcbkF0dHJpYnV0ZS5wcm90b3R5cGUudHlwZU5hbWUgPSAnYXR0cmlidXRlJztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tIERlZmVycmVkIGluaXRpYWxpemF0aW9uIC0tLS0tLS0tLS0tLS0tLS0tXG51dGlsLmF3YWl0QnVpbHRJblJ1bGVzKGZ1bmN0aW9uIChidWlsdEluUnVsZXMpIHtcbiAgICB2YXIgb3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vcGVyYXRpb25zLWFuZC1hdHRyaWJ1dGVzJyk7XG4gICAgaW5pdEJ1aWx0SW5TZW1hbnRpY3MoYnVpbHRJblJ1bGVzKTtcbiAgICBpbml0UHJvdG90eXBlUGFyc2VyKG9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzR3JhbW1hcik7IC8vIHJlcXVpcmVzIEJ1aWx0SW5TZW1hbnRpY3Ncbn0pO1xuZnVuY3Rpb24gaW5pdEJ1aWx0SW5TZW1hbnRpY3MoYnVpbHRJblJ1bGVzKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7XG4gICAgICAgIGVtcHR5OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVyYXRpb24oKTtcbiAgICAgICAgfSxcbiAgICAgICAgbm9uRW1wdHk6IGZ1bmN0aW9uIChmaXJzdCwgXywgcmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXRlcmF0aW9uKFtmaXJzdF0uY29uY2F0KHJlc3QuY2hpbGRyZW4pKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU2VtYW50aWNzLkJ1aWx0SW5TZW1hbnRpY3MgPSBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzKGJ1aWx0SW5SdWxlcywgbnVsbCkuYWRkT3BlcmF0aW9uKCdhc0l0ZXJhdGlvbicsIHtcbiAgICAgICAgZW1wdHlMaXN0T2Y6IGFjdGlvbnMuZW1wdHksXG4gICAgICAgIG5vbmVtcHR5TGlzdE9mOiBhY3Rpb25zLm5vbkVtcHR5LFxuICAgICAgICBFbXB0eUxpc3RPZjogYWN0aW9ucy5lbXB0eSxcbiAgICAgICAgTm9uZW1wdHlMaXN0T2Y6IGFjdGlvbnMubm9uRW1wdHlcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGluaXRQcm90b3R5cGVQYXJzZXIoZ3JhbW1hcikge1xuICAgIHByb3RvdHlwZUdyYW1tYXJTZW1hbnRpY3MgPSBncmFtbWFyLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigncGFyc2UnLCB7XG4gICAgICAgIEF0dHJpYnV0ZVNpZ25hdHVyZTogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbmFtZTogbmFtZS5wYXJzZSgpLFxuICAgICAgICAgICAgICAgIGZvcm1hbHM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBPcGVyYXRpb25TaWduYXR1cmU6IGZ1bmN0aW9uIChuYW1lLCBvcHRGb3JtYWxzKSB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBmb3JtYWxzOiAoKF9hID0gb3B0Rm9ybWFscy5jaGlsZCgwKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnBhcnNlKCkpIHx8IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBGb3JtYWxzOiBmdW5jdGlvbiAob3BhcmVuLCBmcywgY3BhcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuYXNJdGVyYXRpb24oKS5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMucGFyc2UoKTsgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWU6IGZ1bmN0aW9uIChmaXJzdCwgcmVzdCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcHJvdG90eXBlR3JhbW1hciA9IGdyYW1tYXI7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gU2VtYW50aWNzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgSW50ZXJ2YWwgPSByZXF1aXJlKCcuL0ludGVydmFsJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVW5pY29kZSBjaGFyYWN0ZXJzIHRoYXQgYXJlIHVzZWQgaW4gdGhlIGB0b1N0cmluZ2Agb3V0cHV0LlxudmFyIEJBTExPVF9YID0gJ1xcdTI3MTcnO1xudmFyIENIRUNLX01BUksgPSAnXFx1MjcxMyc7XG52YXIgRE9UX09QRVJBVE9SID0gJ1xcdTIyQzUnO1xudmFyIFJJR0hUV0FSRFNfRE9VQkxFX0FSUk9XID0gJ1xcdTIxRDInO1xudmFyIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OID0gJ1xcdTI0MDknO1xudmFyIFNZTUJPTF9GT1JfTElORV9GRUVEID0gJ1xcdTI0MEEnO1xudmFyIFNZTUJPTF9GT1JfQ0FSUklBR0VfUkVUVVJOID0gJ1xcdTI0MEQnO1xudmFyIEZsYWdzID0ge1xuICAgIHN1Y2NlZWRlZDogMSA8PCAwLFxuICAgIGlzUm9vdE5vZGU6IDEgPDwgMSxcbiAgICBpc0ltcGxpY2l0U3BhY2VzOiAxIDw8IDIsXG4gICAgaXNNZW1vaXplZDogMSA8PCAzLFxuICAgIGlzSGVhZE9mTGVmdFJlY3Vyc2lvbjogMSA8PCA0LFxuICAgIHRlcm1pbmF0ZXNMUjogMSA8PCA1XG59O1xuZnVuY3Rpb24gc3BhY2VzKG4pIHtcbiAgICByZXR1cm4gY29tbW9uLnJlcGVhdCgnICcsIG4pLmpvaW4oJycpO1xufVxuLy8gUmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIGEgcG9ydGlvbiBvZiBgaW5wdXRgIGF0IG9mZnNldCBgcG9zYC5cbi8vIFRoZSByZXN1bHQgd2lsbCBjb250YWluIGV4YWN0bHkgYGxlbmAgY2hhcmFjdGVycy5cbmZ1bmN0aW9uIGdldElucHV0RXhjZXJwdChpbnB1dCwgcG9zLCBsZW4pIHtcbiAgICB2YXIgZXhjZXJwdCA9IGFzRXNjYXBlZFN0cmluZyhpbnB1dC5zbGljZShwb3MsIHBvcyArIGxlbikpO1xuICAgIC8vIFBhZCB0aGUgb3V0cHV0IGlmIG5lY2Vzc2FyeS5cbiAgICBpZiAoZXhjZXJwdC5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIGV4Y2VycHQgKyBjb21tb24ucmVwZWF0KCcgJywgbGVuIC0gZXhjZXJwdC5sZW5ndGgpLmpvaW4oJycpO1xuICAgIH1cbiAgICByZXR1cm4gZXhjZXJwdDtcbn1cbmZ1bmN0aW9uIGFzRXNjYXBlZFN0cmluZyhvYmopIHtcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gUmVwbGFjZSBub24tcHJpbnRhYmxlIGNoYXJhY3RlcnMgd2l0aCB2aXNpYmxlIHN5bWJvbHMuXG4gICAgICAgIHJldHVybiBvYmpcbiAgICAgICAgICAgIC5yZXBsYWNlKC8gL2csIERPVF9PUEVSQVRPUilcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQvZywgU1lNQk9MX0ZPUl9IT1JJWk9OVEFMX1RBQlVMQVRJT04pXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxuL2csIFNZTUJPTF9GT1JfTElORV9GRUVEKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTik7XG4gICAgfVxuICAgIHJldHVybiBTdHJpbmcob2JqKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFRyYWNlIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBUcmFjZShpbnB1dCwgcG9zMSwgcG9zMiwgZXhwciwgc3VjY2VlZGVkLCBiaW5kaW5ncywgb3B0Q2hpbGRyZW4pIHtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG4gICAgdGhpcy5wb3MgPSB0aGlzLnBvczEgPSBwb3MxO1xuICAgIHRoaXMucG9zMiA9IHBvczI7XG4gICAgdGhpcy5zb3VyY2UgPSBuZXcgSW50ZXJ2YWwoaW5wdXQsIHBvczEsIHBvczIpO1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG4gICAgdGhpcy5iaW5kaW5ncyA9IGJpbmRpbmdzO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBvcHRDaGlsZHJlbiB8fCBbXTtcbiAgICB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeSA9IG51bGw7XG4gICAgdGhpcy5fZmxhZ3MgPSBzdWNjZWVkZWQgPyBGbGFncy5zdWNjZWVkZWQgOiAwO1xufVxuLy8gQSB2YWx1ZSB0aGF0IGNhbiBiZSByZXR1cm5lZCBmcm9tIHZpc2l0b3IgZnVuY3Rpb25zIHRvIGluZGljYXRlIHRoYXQgYVxuLy8gbm9kZSBzaG91bGQgbm90IGJlIHJlY3Vyc2VkIGludG8uXG5UcmFjZS5wcm90b3R5cGUuU0tJUCA9IHt9O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYWNlLnByb3RvdHlwZSwgJ2Rpc3BsYXlTdHJpbmcnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cHIudG9EaXNwbGF5U3RyaW5nKCk7XG4gICAgfVxufSk7XG4vLyBGb3IgY29udmVuaWVuY2UsIGNyZWF0ZSBhIGdldHRlciBhbmQgc2V0dGVyIGZvciB0aGUgYm9vbGVhbiBmbGFncyBpbiBgRmxhZ3NgLlxuT2JqZWN0LmtleXMoRmxhZ3MpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgbWFzayA9IEZsYWdzW25hbWVdO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFjZS5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuX2ZsYWdzICYgbWFzaykgIT09IDA7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgaWYgKHZhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzIHw9IG1hc2s7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGFncyAmPSB+bWFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5UcmFjZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xvbmVXaXRoRXhwcih0aGlzLmV4cHIpO1xufTtcblRyYWNlLnByb3RvdHlwZS5jbG9uZVdpdGhFeHByID0gZnVuY3Rpb24gKGV4cHIpIHtcbiAgICB2YXIgYW5zID0gbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHRoaXMucG9zLCB0aGlzLnBvczIsIGV4cHIsIHRoaXMuc3VjY2VlZGVkLCB0aGlzLmJpbmRpbmdzLCB0aGlzLmNoaWxkcmVuKTtcbiAgICBhbnMuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gdGhpcy5pc0hlYWRPZkxlZnRSZWN1cnNpb247XG4gICAgYW5zLmlzSW1wbGljaXRTcGFjZXMgPSB0aGlzLmlzSW1wbGljaXRTcGFjZXM7XG4gICAgYW5zLmlzTWVtb2l6ZWQgPSB0aGlzLmlzTWVtb2l6ZWQ7XG4gICAgYW5zLmlzUm9vdE5vZGUgPSB0aGlzLmlzUm9vdE5vZGU7XG4gICAgYW5zLnRlcm1pbmF0ZXNMUiA9IHRoaXMudGVybWluYXRlc0xSO1xuICAgIGFucy50ZXJtaW5hdGluZ0xSRW50cnkgPSB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeTtcbiAgICByZXR1cm4gYW5zO1xufTtcbi8vIFJlY29yZCB0aGUgdHJhY2UgaW5mb3JtYXRpb24gZm9yIHRoZSB0ZXJtaW5hdGluZyBjb25kaXRpb24gb2YgdGhlIExSIGxvb3AuXG5UcmFjZS5wcm90b3R5cGUucmVjb3JkTFJUZXJtaW5hdGlvbiA9IGZ1bmN0aW9uIChydWxlQm9keVRyYWNlLCB2YWx1ZSkge1xuICAgIHRoaXMudGVybWluYXRpbmdMUkVudHJ5ID0gbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHRoaXMucG9zLCB0aGlzLnBvczIsIHRoaXMuZXhwciwgZmFsc2UsIFt2YWx1ZV0sIFtydWxlQm9keVRyYWNlXSk7XG4gICAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkudGVybWluYXRlc0xSID0gdHJ1ZTtcbn07XG4vLyBSZWN1cnNpdmVseSB0cmF2ZXJzZSB0aGlzIHRyYWNlIG5vZGUgYW5kIGFsbCBpdHMgZGVzY2VuZGVudHMsIGNhbGxpbmcgYSB2aXNpdG9yIGZ1bmN0aW9uXG4vLyBmb3IgZWFjaCBub2RlIHRoYXQgaXMgdmlzaXRlZC4gSWYgYHZpc3Rvck9iak9yRm5gIGlzIGFuIG9iamVjdCwgdGhlbiBpdHMgJ2VudGVyJyBwcm9wZXJ0eVxuLy8gaXMgYSBmdW5jdGlvbiB0byBjYWxsIGJlZm9yZSB2aXNpdGluZyB0aGUgY2hpbGRyZW4gb2YgYSBub2RlLCBhbmQgaXRzICdleGl0JyBwcm9wZXJ0eSBpc1xuLy8gYSBmdW5jdGlvbiB0byBjYWxsIGFmdGVyd2FyZHMuIElmIGB2aXNpdG9yT2JqT3JGbmAgaXMgYSBmdW5jdGlvbiwgaXQgcmVwcmVzZW50cyB0aGUgJ2VudGVyJ1xuLy8gZnVuY3Rpb24uXG4vL1xuLy8gVGhlIGZ1bmN0aW9ucyBhcmUgY2FsbGVkIHdpdGggdGhyZWUgYXJndW1lbnRzOiB0aGUgVHJhY2Ugbm9kZSwgaXRzIHBhcmVudCBUcmFjZSwgYW5kIGEgbnVtYmVyXG4vLyByZXByZXNlbnRpbmcgdGhlIGRlcHRoIG9mIHRoZSBub2RlIGluIHRoZSB0cmVlLiAoVGhlIHJvb3Qgbm9kZSBoYXMgZGVwdGggMC4pIGBvcHRUaGlzQXJnYCwgaWZcbi8vIHNwZWNpZmllZCwgaXMgdGhlIHZhbHVlIHRvIHVzZSBmb3IgYHRoaXNgIHdoZW4gZXhlY3V0aW5nIHRoZSB2aXNpdG9yIGZ1bmN0aW9ucy5cblRyYWNlLnByb3RvdHlwZS53YWxrID0gZnVuY3Rpb24gKHZpc2l0b3JPYmpPckZuLCBvcHRUaGlzQXJnKSB7XG4gICAgdmFyIHZpc2l0b3IgPSB2aXNpdG9yT2JqT3JGbjtcbiAgICBpZiAodHlwZW9mIHZpc2l0b3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdmlzaXRvciA9IHsgZW50ZXI6IHZpc2l0b3IgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gX3dhbGsobm9kZSwgcGFyZW50LCBkZXB0aCkge1xuICAgICAgICB2YXIgcmVjdXJzZSA9IHRydWU7XG4gICAgICAgIGlmICh2aXNpdG9yLmVudGVyKSB7XG4gICAgICAgICAgICBpZiAodmlzaXRvci5lbnRlci5jYWxsKG9wdFRoaXNBcmcsIG5vZGUsIHBhcmVudCwgZGVwdGgpID09PSBUcmFjZS5wcm90b3R5cGUuU0tJUCkge1xuICAgICAgICAgICAgICAgIHJlY3Vyc2UgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAocmVjdXJzZSkge1xuICAgICAgICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIF93YWxrKGNoaWxkLCBub2RlLCBkZXB0aCArIDEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAodmlzaXRvci5leGl0KSB7XG4gICAgICAgICAgICAgICAgdmlzaXRvci5leGl0LmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNSb290Tm9kZSkge1xuICAgICAgICAvLyBEb24ndCB2aXNpdCB0aGUgcm9vdCBub2RlIGl0c2VsZiwgb25seSBpdHMgY2hpbGRyZW4uXG4gICAgICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgX3dhbGsoYywgbnVsbCwgMCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgX3dhbGsodGhpcywgbnVsbCwgMCk7XG4gICAgfVxufTtcbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHJhY2UuXG4vLyBTYW1wbGU6XG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzIOKckyBleHAg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICDinJMgYWRkRXhwIChMUikg4oeSICBcIjEyXCJcbi8vICAgICAxMuKLhSvii4Uy4ouFKuKLhTMgICAgICAg4pyXIGFkZEV4cF9wbHVzXG5UcmFjZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHRoaXMud2FsayhmdW5jdGlvbiAobm9kZSwgcGFyZW50LCBkZXB0aCkge1xuICAgICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgICAgIHJldHVybiBfdGhpcy5TS0lQO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjdG9yTmFtZSA9IG5vZGUuZXhwci5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICAvLyBEb24ndCBwcmludCBhbnl0aGluZyBmb3IgQWx0IG5vZGVzLlxuICAgICAgICBpZiAoY3Rvck5hbWUgPT09ICdBbHQnKSB7XG4gICAgICAgICAgICByZXR1cm47IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgY29uc2lzdGVudC1yZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoZ2V0SW5wdXRFeGNlcnB0KG5vZGUuaW5wdXQsIG5vZGUucG9zLCAxMCkgKyBzcGFjZXMoZGVwdGggKiAyICsgMSkpO1xuICAgICAgICBzYi5hcHBlbmQoKG5vZGUuc3VjY2VlZGVkID8gQ0hFQ0tfTUFSSyA6IEJBTExPVF9YKSArICcgJyArIG5vZGUuZGlzcGxheVN0cmluZyk7XG4gICAgICAgIGlmIChub2RlLmlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgc2IuYXBwZW5kKCcgKExSKScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub2RlLnN1Y2NlZWRlZCkge1xuICAgICAgICAgICAgdmFyIGNvbnRlbnRzID0gYXNFc2NhcGVkU3RyaW5nKG5vZGUuc291cmNlLmNvbnRlbnRzKTtcbiAgICAgICAgICAgIHNiLmFwcGVuZCgnICcgKyBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyArICcgICcpO1xuICAgICAgICAgICAgc2IuYXBwZW5kKHR5cGVvZiBjb250ZW50cyA9PT0gJ3N0cmluZycgPyAnXCInICsgY29udGVudHMgKyAnXCInIDogY29udGVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHNiLmFwcGVuZCgnXFxuJyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9O1xuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKykge1xuICAgIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gPSBcIlxcXFwnXCI7XG5lc2NhcGVTdHJpbmdGb3JbJ1wiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXCInO1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCc7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInO1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInO1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0JztcbmVzY2FwZVN0cmluZ0ZvclsnXFx1MDAwYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24gKG9wdE1ldGhvZE5hbWUpIHtcbiAgICB2YXIgbWV0aG9kTmFtZSA9IG9wdE1ldGhvZE5hbWUgfHwgJyc7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGlzIG1ldGhvZCAnICtcbiAgICAgICAgICAgIG1ldGhvZE5hbWUgK1xuICAgICAgICAgICAgJyBpcyBhYnN0cmFjdCEgJyArXG4gICAgICAgICAgICAnKGl0IGhhcyBubyBpbXBsZW1lbnRhdGlvbiBpbiBjbGFzcyAnICtcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IubmFtZSArXG4gICAgICAgICAgICAnKScpO1xuICAgIH07XG59O1xuZXhwb3J0cy5hc3NlcnQgPSBmdW5jdGlvbiAoY29uZCwgbWVzc2FnZSkge1xuICAgIGlmICghY29uZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxufTtcbi8vIERlZmluZSBhIGxhemlseS1jb21wdXRlZCwgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgbmFtZWQgYHByb3BOYW1lYFxuLy8gb24gdGhlIG9iamVjdCBgb2JqYC4gYGdldHRlckZuYCB3aWxsIGJlIGNhbGxlZCB0byBjb21wdXRlIHRoZSB2YWx1ZSB0aGVcbi8vIGZpcnN0IHRpbWUgdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkLlxuZXhwb3J0cy5kZWZpbmVMYXp5UHJvcGVydHkgPSBmdW5jdGlvbiAob2JqLCBwcm9wTmFtZSwgZ2V0dGVyRm4pIHtcbiAgICB2YXIgbWVtbztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wTmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghbWVtbykge1xuICAgICAgICAgICAgICAgIG1lbW8gPSBnZXR0ZXJGbi5jYWxsKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1lbW87XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5leHBvcnRzLmNsb25lID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmopIHtcbiAgICAgICAgcmV0dXJuIGV4dGVuZCh7fSwgb2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn07XG5leHBvcnRzLmV4dGVuZCA9IGV4dGVuZDtcbmV4cG9ydHMucmVwZWF0Rm4gPSBmdW5jdGlvbiAoZm4sIG4pIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgd2hpbGUgKG4tLSA+IDApIHtcbiAgICAgICAgYXJyLnB1c2goZm4oKSk7XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG59O1xuZXhwb3J0cy5yZXBlYXRTdHIgPSBmdW5jdGlvbiAoc3RyLCBuKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheShuICsgMSkuam9pbihzdHIpO1xufTtcbmV4cG9ydHMucmVwZWF0ID0gZnVuY3Rpb24gKHgsIG4pIHtcbiAgICByZXR1cm4gZXhwb3J0cy5yZXBlYXRGbihmdW5jdGlvbiAoKSB7IHJldHVybiB4OyB9LCBuKTtcbn07XG5leHBvcnRzLmdldER1cGxpY2F0ZXMgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICB2YXIgZHVwbGljYXRlcyA9IFtdO1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFycmF5Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdmFyIHggPSBhcnJheVtpZHhdO1xuICAgICAgICBpZiAoYXJyYXkubGFzdEluZGV4T2YoeCkgIT09IGlkeCAmJiBkdXBsaWNhdGVzLmluZGV4T2YoeCkgPCAwKSB7XG4gICAgICAgICAgICBkdXBsaWNhdGVzLnB1c2goeCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGR1cGxpY2F0ZXM7XG59O1xuZXhwb3J0cy5jb3B5V2l0aG91dER1cGxpY2F0ZXMgPSBmdW5jdGlvbiAoYXJyYXkpIHtcbiAgICB2YXIgbm9EdXBsaWNhdGVzID0gW107XG4gICAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgaWYgKG5vRHVwbGljYXRlcy5pbmRleE9mKGVudHJ5KSA8IDApIHtcbiAgICAgICAgICAgIG5vRHVwbGljYXRlcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBub0R1cGxpY2F0ZXM7XG59O1xuZXhwb3J0cy5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHZhciBmaXJzdENoYXIgPSBydWxlTmFtZVswXTtcbiAgICByZXR1cm4gZmlyc3RDaGFyID09PSBmaXJzdENoYXIudG9VcHBlckNhc2UoKTtcbn07XG5leHBvcnRzLmlzTGV4aWNhbCA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHJldHVybiAhZXhwb3J0cy5pc1N5bnRhY3RpYyhydWxlTmFtZSk7XG59O1xuZXhwb3J0cy5wYWRMZWZ0ID0gZnVuY3Rpb24gKHN0ciwgbGVuLCBvcHRDaGFyKSB7XG4gICAgdmFyIGNoID0gb3B0Q2hhciB8fCAnICc7XG4gICAgaWYgKHN0ci5sZW5ndGggPCBsZW4pIHtcbiAgICAgICAgcmV0dXJuIGV4cG9ydHMucmVwZWF0U3RyKGNoLCBsZW4gLSBzdHIubGVuZ3RoKSArIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbn07XG4vLyBTdHJpbmdCdWZmZXJcbmV4cG9ydHMuU3RyaW5nQnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc3RyaW5ncyA9IFtdO1xufTtcbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgdGhpcy5zdHJpbmdzLnB1c2goc3RyKTtcbn07XG5leHBvcnRzLlN0cmluZ0J1ZmZlci5wcm90b3R5cGUuY29udGVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RyaW5ncy5qb2luKCcnKTtcbn07XG4vLyBDaGFyYWN0ZXIgZXNjYXBpbmcgYW5kIHVuZXNjYXBpbmdcbmV4cG9ydHMuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uIChjLCBvcHREZWxpbSkge1xuICAgIHZhciBjaGFyQ29kZSA9IGMuY2hhckNvZGVBdCgwKTtcbiAgICBpZiAoKGMgPT09ICdcIicgfHwgYyA9PT0gXCInXCIpICYmIG9wdERlbGltICYmIGMgIT09IG9wdERlbGltKSB7XG4gICAgICAgIHJldHVybiBjO1xuICAgIH1cbiAgICBlbHNlIGlmIChjaGFyQ29kZSA8IDEyOCkge1xuICAgICAgICByZXR1cm4gZXNjYXBlU3RyaW5nRm9yW2NoYXJDb2RlXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoMTI4IDw9IGNoYXJDb2RlICYmIGNoYXJDb2RlIDwgMjU2KSB7XG4gICAgICAgIHJldHVybiAnXFxcXHgnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgMiwgJzAnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAnXFxcXHUnICsgZXhwb3J0cy5wYWRMZWZ0KGNoYXJDb2RlLnRvU3RyaW5nKDE2KSwgNCwgJzAnKTtcbiAgICB9XG59O1xuZXhwb3J0cy51bmVzY2FwZUNoYXIgPSBmdW5jdGlvbiAocykge1xuICAgIGlmIChzLmNoYXJBdCgwKSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIHN3aXRjaCAocy5jaGFyQXQoMSkpIHtcbiAgICAgICAgICAgIGNhc2UgJ2InOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxiJztcbiAgICAgICAgICAgIGNhc2UgJ2YnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxmJztcbiAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxuJztcbiAgICAgICAgICAgIGNhc2UgJ3InOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFxyJztcbiAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFx0JztcbiAgICAgICAgICAgIGNhc2UgJ3YnOlxuICAgICAgICAgICAgICAgIHJldHVybiAnXFx2JztcbiAgICAgICAgICAgIGNhc2UgJ3gnOlxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpO1xuICAgICAgICAgICAgY2FzZSAndSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQocy5zdWJzdHJpbmcoMiwgNiksIDE2KSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBzLmNoYXJBdCgxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxufTtcbi8vIEhlbHBlciBmb3IgcHJvZHVjaW5nIGEgZGVzY3JpcHRpb24gb2YgYW4gdW5rbm93biBvYmplY3QgaW4gYSBzYWZlIHdheS5cbi8vIEVzcGVjaWFsbHkgdXNlZnVsIGZvciBlcnJvciBtZXNzYWdlcyB3aGVyZSBhbiB1bmV4cGVjdGVkIHR5cGUgb2Ygb2JqZWN0IHdhcyBlbmNvdW50ZXJlZC5cbmV4cG9ydHMudW5leHBlY3RlZE9ialRvU3RyaW5nID0gZnVuY3Rpb24gKG9iaikge1xuICAgIGlmIChvYmogPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIHZhciBiYXNlVG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbiAgICB0cnkge1xuICAgICAgICB2YXIgdHlwZU5hbWUgPSB2b2lkIDA7XG4gICAgICAgIGlmIChvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgICAgICAgIHR5cGVOYW1lID0gb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYmFzZVRvU3RyaW5nLmluZGV4T2YoJ1tvYmplY3QgJykgPT09IDApIHtcbiAgICAgICAgICAgIHR5cGVOYW1lID0gYmFzZVRvU3RyaW5nLnNsaWNlKDgsIC0xKTsgLy8gRXh0cmFjdCBlLmcuIFwiQXJyYXlcIiBmcm9tIFwiW29iamVjdCBBcnJheV1cIi5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHR5cGVOYW1lID0gdHlwZW9mIG9iajtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHlwZU5hbWUgKyAnOiAnICsgSlNPTi5zdHJpbmdpZnkoU3RyaW5nKG9iaikpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gYmFzZVRvU3RyaW5nO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIE5hbWVzcGFjZSA9IHJlcXVpcmUoJy4vTmFtZXNwYWNlJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdEludGVydmFsKSB7XG4gICAgdmFyIGU7XG4gICAgaWYgKG9wdEludGVydmFsKSB7XG4gICAgICAgIGUgPSBuZXcgRXJyb3Iob3B0SW50ZXJ2YWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UoKSArIG1lc3NhZ2UpO1xuICAgICAgICBlLnNob3J0TWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIGUuaW50ZXJ2YWwgPSBvcHRJbnRlcnZhbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGUgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gZXJyb3JzIGFib3V0IGludGVydmFscyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihcIkludGVydmFsIHNvdXJjZXMgZG9uJ3QgbWF0Y2hcIik7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgZ3JhbW1hcnMgLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdyYW1tYXIgc3ludGF4IGVycm9yXG5mdW5jdGlvbiBncmFtbWFyU3ludGF4RXJyb3IobWF0Y2hGYWlsdXJlKSB7XG4gICAgdmFyIGUgPSBuZXcgRXJyb3IoKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ21lc3NhZ2UnLCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoRmFpbHVyZS5tZXNzYWdlO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsICdzaG9ydE1lc3NhZ2UnLCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdFeHBlY3RlZCAnICsgbWF0Y2hGYWlsdXJlLmdldEV4cGVjdGVkVGV4dCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgZS5pbnRlcnZhbCA9IG1hdGNoRmFpbHVyZS5nZXRJbnRlcnZhbCgpO1xuICAgIHJldHVybiBlO1xufVxuLy8gVW5kZWNsYXJlZCBncmFtbWFyXG5mdW5jdGlvbiB1bmRlY2xhcmVkR3JhbW1hcihncmFtbWFyTmFtZSwgbmFtZXNwYWNlLCBpbnRlcnZhbCkge1xuICAgIHZhciBtZXNzYWdlID0gbmFtZXNwYWNlXG4gICAgICAgID8gJ0dyYW1tYXIgJyArXG4gICAgICAgICAgICBncmFtbWFyTmFtZSArXG4gICAgICAgICAgICAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArXG4gICAgICAgICAgICBOYW1lc3BhY2UudG9TdHJpbmcobmFtZXNwYWNlKVxuICAgICAgICA6ICdVbmRlY2xhcmVkIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lO1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihtZXNzYWdlLCBpbnRlcnZhbCk7XG59XG4vLyBEdXBsaWNhdGUgZ3JhbW1hciBkZWNsYXJhdGlvblxuZnVuY3Rpb24gZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uKGdyYW1tYXIsIG5hbWVzcGFjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignR3JhbW1hciAnICsgZ3JhbW1hci5uYW1lICsgJyBpcyBhbHJlYWR5IGRlY2xhcmVkIGluIHRoaXMgbmFtZXNwYWNlJyk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBydWxlcyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gVW5kZWNsYXJlZCBydWxlXG5mdW5jdGlvbiB1bmRlY2xhcmVkUnVsZShydWxlTmFtZSwgZ3JhbW1hck5hbWUsIG9wdEludGVydmFsKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdSdWxlICcgKyBydWxlTmFtZSArICcgaXMgbm90IGRlY2xhcmVkIGluIGdyYW1tYXIgJyArIGdyYW1tYXJOYW1lLCBvcHRJbnRlcnZhbCk7XG59XG4vLyBDYW5ub3Qgb3ZlcnJpZGUgdW5kZWNsYXJlZCBydWxlXG5mdW5jdGlvbiBjYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdDYW5ub3Qgb3ZlcnJpZGUgcnVsZSAnICsgcnVsZU5hbWUgKyAnIGJlY2F1c2UgaXQgaXMgbm90IGRlY2xhcmVkIGluICcgKyBncmFtbWFyTmFtZSwgb3B0U291cmNlKTtcbn1cbi8vIENhbm5vdCBleHRlbmQgdW5kZWNsYXJlZCBydWxlXG5mdW5jdGlvbiBjYW5ub3RFeHRlbmRVbmRlY2xhcmVkUnVsZShydWxlTmFtZSwgZ3JhbW1hck5hbWUsIG9wdFNvdXJjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQ2Fubm90IGV4dGVuZCBydWxlICcgKyBydWxlTmFtZSArICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpO1xufVxuLy8gRHVwbGljYXRlIHJ1bGUgZGVjbGFyYXRpb25cbmZ1bmN0aW9uIGR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihydWxlTmFtZSwgZ3JhbW1hck5hbWUsIGRlY2xHcmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBcIkR1cGxpY2F0ZSBkZWNsYXJhdGlvbiBmb3IgcnVsZSAnXCIgKyBydWxlTmFtZSArIFwiJyBpbiBncmFtbWFyICdcIiArIGdyYW1tYXJOYW1lICsgXCInXCI7XG4gICAgaWYgKGdyYW1tYXJOYW1lICE9PSBkZWNsR3JhbW1hck5hbWUpIHtcbiAgICAgICAgbWVzc2FnZSArPSBcIiAob3JpZ2luYWxseSBkZWNsYXJlZCBpbiAnXCIgKyBkZWNsR3JhbW1hck5hbWUgKyBcIicpXCI7XG4gICAgfVxuICAgIHJldHVybiBjcmVhdGVFcnJvcihtZXNzYWdlLCBvcHRTb3VyY2UpO1xufVxuLy8gV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnNcbmZ1bmN0aW9uIHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBzb3VyY2UpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1dyb25nIG51bWJlciBvZiBwYXJhbWV0ZXJzIGZvciBydWxlICcgK1xuICAgICAgICBydWxlTmFtZSArXG4gICAgICAgICcgKGV4cGVjdGVkICcgK1xuICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgYWN0dWFsICtcbiAgICAgICAgJyknLCBzb3VyY2UpO1xufVxuLy8gV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50c1xuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyhydWxlTmFtZSwgZXhwZWN0ZWQsIGFjdHVhbCwgZXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignV3JvbmcgbnVtYmVyIG9mIGFyZ3VtZW50cyBmb3IgcnVsZSAnICtcbiAgICAgICAgcnVsZU5hbWUgK1xuICAgICAgICAnIChleHBlY3RlZCAnICtcbiAgICAgICAgZXhwZWN0ZWQgK1xuICAgICAgICAnLCBnb3QgJyArXG4gICAgICAgIGFjdHVhbCArXG4gICAgICAgICcpJywgZXhwci5zb3VyY2UpO1xufVxuLy8gRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lc1xuZnVuY3Rpb24gZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMocnVsZU5hbWUsIGR1cGxpY2F0ZXMsIHNvdXJjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lcyBpbiBydWxlICcgKyBydWxlTmFtZSArICc6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJyksIHNvdXJjZSk7XG59XG4vLyBJbnZhbGlkIHBhcmFtZXRlciBleHByZXNzaW9uXG5mdW5jdGlvbiBpbnZhbGlkUGFyYW1ldGVyKHJ1bGVOYW1lLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdJbnZhbGlkIHBhcmFtZXRlciB0byBydWxlICcgK1xuICAgICAgICBydWxlTmFtZSArXG4gICAgICAgICc6ICcgK1xuICAgICAgICBleHByICtcbiAgICAgICAgJyBoYXMgYXJpdHkgJyArXG4gICAgICAgIGV4cHIuZ2V0QXJpdHkoKSArXG4gICAgICAgICcsIGJ1dCBwYXJhbWV0ZXIgZXhwcmVzc2lvbnMgbXVzdCBoYXZlIGFyaXR5IDEnLCBleHByLnNvdXJjZSk7XG59XG4vLyBBcHBsaWNhdGlvbiBvZiBzeW50YWN0aWMgcnVsZSBmcm9tIGxleGljYWwgcnVsZVxuZnVuY3Rpb24gYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQocnVsZU5hbWUsIGFwcGx5RXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQ2Fubm90IGFwcGx5IHN5bnRhY3RpYyBydWxlICcgKyBydWxlTmFtZSArICcgZnJvbSBoZXJlIChpbnNpZGUgYSBsZXhpY2FsIGNvbnRleHQpJywgYXBwbHlFeHByLnNvdXJjZSk7XG59XG4vLyBJbmNvcnJlY3QgYXJndW1lbnQgdHlwZVxuZnVuY3Rpb24gaW5jb3JyZWN0QXJndW1lbnRUeXBlKGV4cGVjdGVkVHlwZSwgZXhwcikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignSW5jb3JyZWN0IGFyZ3VtZW50IHR5cGU6IGV4cGVjdGVkICcgKyBleHBlY3RlZFR5cGUsIGV4cHIuc291cmNlKTtcbn1cbi8vIE11bHRpcGxlIGluc3RhbmNlcyBvZiB0aGUgc3VwZXItc3BsaWNlIG9wZXJhdG9yIChgLi4uYCkgaW4gdGhlIHJ1bGUgYm9keS5cbmZ1bmN0aW9uIG11bHRpcGxlU3VwZXJTcGxpY2VzKGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoXCInLi4uJyBjYW4gYXBwZWFyIGF0IG1vc3Qgb25jZSBpbiBhIHJ1bGUgYm9keVwiLCBleHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBLbGVlbmUgb3BlcmF0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKGtsZWVuZUV4cHIsIGFwcGxpY2F0aW9uU3RhY2spIHtcbiAgICB2YXIgYWN0dWFscyA9IGFwcGxpY2F0aW9uU3RhY2subGVuZ3RoID4gMCA/IGFwcGxpY2F0aW9uU3RhY2tbYXBwbGljYXRpb25TdGFjay5sZW5ndGggLSAxXS5hcmdzIDogW107XG4gICAgdmFyIGV4cHIgPSBrbGVlbmVFeHByLmV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICB2YXIgbWVzc2FnZSA9ICdOdWxsYWJsZSBleHByZXNzaW9uICcgK1xuICAgICAgICBleHByICtcbiAgICAgICAgXCIgaXMgbm90IGFsbG93ZWQgaW5zaWRlICdcIiArXG4gICAgICAgIGtsZWVuZUV4cHIub3BlcmF0b3IgK1xuICAgICAgICBcIicgKHBvc3NpYmxlIGluZmluaXRlIGxvb3ApXCI7XG4gICAgaWYgKGFwcGxpY2F0aW9uU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgc3RhY2tUcmFjZSA9IGFwcGxpY2F0aW9uU3RhY2tcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGFwcCkgeyByZXR1cm4gbmV3IHBleHBycy5BcHBseShhcHAucnVsZU5hbWUsIGFwcC5hcmdzKTsgfSlcbiAgICAgICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICAgICAgbWVzc2FnZSArPSAnXFxuQXBwbGljYXRpb24gc3RhY2sgKG1vc3QgcmVjZW50IGFwcGxpY2F0aW9uIGxhc3QpOlxcbicgKyBzdGFja1RyYWNlO1xuICAgIH1cbiAgICByZXR1cm4gY3JlYXRlRXJyb3IobWVzc2FnZSwga2xlZW5lRXhwci5leHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBhcml0eSAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1J1bGUgJyArXG4gICAgICAgIHJ1bGVOYW1lICtcbiAgICAgICAgJyBpbnZvbHZlcyBhbiBhbHRlcm5hdGlvbiB3aGljaCBoYXMgaW5jb25zaXN0ZW50IGFyaXR5ICcgK1xuICAgICAgICAnKGV4cGVjdGVkICcgK1xuICAgICAgICBleHBlY3RlZCArXG4gICAgICAgICcsIGdvdCAnICtcbiAgICAgICAgYWN0dWFsICtcbiAgICAgICAgJyknLCBleHByLnNvdXJjZSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBwcm9wZXJ0aWVzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBkdXBsaWNhdGVQcm9wZXJ0eU5hbWVzKGR1cGxpY2F0ZXMpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ09iamVjdCBwYXR0ZXJuIGhhcyBkdXBsaWNhdGUgcHJvcGVydHkgbmFtZXM6ICcgKyBkdXBsaWNhdGVzLmpvaW4oJywgJykpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gY29uc3RydWN0b3JzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpbnZhbGlkQ29uc3RydWN0b3JDYWxsKGdyYW1tYXIsIGN0b3JOYW1lLCBjaGlsZHJlbikge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignQXR0ZW1wdCB0byBpbnZva2UgY29uc3RydWN0b3IgJyArIGN0b3JOYW1lICsgJyB3aXRoIGludmFsaWQgb3IgdW5leHBlY3RlZCBhcmd1bWVudHMnKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnZlbmllbmNlIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBtdWx0aXBsZUVycm9ycyhlcnJvcnMpIHtcbiAgICB2YXIgbWVzc2FnZXMgPSBlcnJvcnMubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLm1lc3NhZ2U7IH0pO1xuICAgIHJldHVybiBjcmVhdGVFcnJvcihbJ0Vycm9yczonXS5jb25jYXQobWVzc2FnZXMpLmpvaW4oJ1xcbi0gJyksIGVycm9yc1swXS5pbnRlcnZhbCk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBzZW1hbnRpYyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gbWlzc2luZ1NlbWFudGljQWN0aW9uKGN0b3JOYW1lLCBuYW1lLCB0eXBlLCBzdGFjaykge1xuICAgIHZhciBzdGFja1RyYWNlID0gc3RhY2tcbiAgICAgICAgLnNsaWNlKDAsIC0xKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpbmZvKSB7XG4gICAgICAgIHZhciBhbnMgPSAnICAnICsgaW5mb1swXS5uYW1lICsgJyA+ICcgKyBpbmZvWzFdO1xuICAgICAgICByZXR1cm4gaW5mby5sZW5ndGggPT09IDMgPyBhbnMgKyBcIiBmb3IgJ1wiICsgaW5mb1syXSArIFwiJ1wiIDogYW5zO1xuICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbiAgICBzdGFja1RyYWNlICs9ICdcXG4gICcgKyBuYW1lICsgJyA+ICcgKyBjdG9yTmFtZTtcbiAgICB2YXIgd2hlcmUgPSB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJ1wiO1xuICAgIHZhciBtZXNzYWdlID0gXCJNaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICtcbiAgICAgICAgY3Rvck5hbWUgK1xuICAgICAgICBcIicgaW4gXCIgK1xuICAgICAgICB3aGVyZSArXG4gICAgICAgICdcXG4nICtcbiAgICAgICAgJ0FjdGlvbiBzdGFjayAobW9zdCByZWNlbnQgY2FsbCBsYXN0KTpcXG4nICtcbiAgICAgICAgc3RhY2tUcmFjZTtcbiAgICB2YXIgZSA9IGNyZWF0ZUVycm9yKG1lc3NhZ2UpO1xuICAgIGUubmFtZSA9ICdtaXNzaW5nU2VtYW50aWNBY3Rpb24nO1xuICAgIHJldHVybiBlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dDogYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQsXG4gICAgY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlLFxuICAgIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUsXG4gICAgZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uOiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24sXG4gICAgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXM6IGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLFxuICAgIGR1cGxpY2F0ZVByb3BlcnR5TmFtZXM6IGR1cGxpY2F0ZVByb3BlcnR5TmFtZXMsXG4gICAgZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uOiBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24sXG4gICAgaW5jb25zaXN0ZW50QXJpdHk6IGluY29uc2lzdGVudEFyaXR5LFxuICAgIGluY29ycmVjdEFyZ3VtZW50VHlwZTogaW5jb3JyZWN0QXJndW1lbnRUeXBlLFxuICAgIGludGVydmFsU291cmNlc0RvbnRNYXRjaDogaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoLFxuICAgIGludmFsaWRDb25zdHJ1Y3RvckNhbGw6IGludmFsaWRDb25zdHJ1Y3RvckNhbGwsXG4gICAgaW52YWxpZFBhcmFtZXRlcjogaW52YWxpZFBhcmFtZXRlcixcbiAgICBncmFtbWFyU3ludGF4RXJyb3I6IGdyYW1tYXJTeW50YXhFcnJvcixcbiAgICBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kOiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kLFxuICAgIG1pc3NpbmdTZW1hbnRpY0FjdGlvbjogbWlzc2luZ1NlbWFudGljQWN0aW9uLFxuICAgIG11bHRpcGxlU3VwZXJTcGxpY2VzOiBtdWx0aXBsZVN1cGVyU3BsaWNlcyxcbiAgICB1bmRlY2xhcmVkR3JhbW1hcjogdW5kZWNsYXJlZEdyYW1tYXIsXG4gICAgdW5kZWNsYXJlZFJ1bGU6IHVuZGVjbGFyZWRSdWxlLFxuICAgIHdyb25nTnVtYmVyT2ZBcmd1bWVudHM6IHdyb25nTnVtYmVyT2ZBcmd1bWVudHMsXG4gICAgd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnM6IHdyb25nTnVtYmVyT2ZQYXJhbWV0ZXJzLFxuICAgIHRocm93RXJyb3JzOiBmdW5jdGlvbiAoZXJyb3JzKSB7XG4gICAgICAgIGlmIChlcnJvcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnNbMF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICB0aHJvdyBtdWx0aXBsZUVycm9ycyhlcnJvcnMpO1xuICAgICAgICB9XG4gICAgfVxufTtcbiIsIi8qIGdsb2JhbCBkb2N1bWVudCwgWE1MSHR0cFJlcXVlc3QgKi9cbid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEJ1aWxkZXIgPSByZXF1aXJlKCcuL0J1aWxkZXInKTtcbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgdmVyc2lvbiA9IHJlcXVpcmUoJy4vdmVyc2lvbicpO1xudmFyIGlzQnVmZmVyID0gcmVxdWlyZSgnaXMtYnVmZmVyJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFRoZSBtZXRhZ3JhbW1hciwgaS5lLiB0aGUgZ3JhbW1hciBmb3IgT2htIGdyYW1tYXJzLiBJbml0aWFsaXplZCBhdCB0aGVcbi8vIGJvdHRvbSBvZiB0aGlzIGZpbGUgYmVjYXVzZSBsb2FkaW5nIHRoZSBncmFtbWFyIHJlcXVpcmVzIE9obSBpdHNlbGYuXG52YXIgb2htR3JhbW1hcjtcbi8vIEFuIG9iamVjdCB3aGljaCBtYWtlcyBpdCBwb3NzaWJsZSB0byBzdHViIG91dCB0aGUgZG9jdW1lbnQgQVBJIGZvciB0ZXN0aW5nLlxudmFyIGRvY3VtZW50SW50ZXJmYWNlID0ge1xuICAgIHF1ZXJ5U2VsZWN0b3I6IGZ1bmN0aW9uIChzZWwpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICB9LFxuICAgIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uIChzZWwpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKTtcbiAgICB9XG59O1xudmFyIHN1cGVyU3BsaWNlUGxhY2Vob2xkZXIgPSBPYmplY3QuY3JlYXRlKHBleHBycy5QRXhwci5wcm90b3R5cGUpO1xuLy8gQ2hlY2sgaWYgYG9iamAgaXMgYSBET00gZWxlbWVudC5cbmZ1bmN0aW9uIGlzRWxlbWVudChvYmopIHtcbiAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PT0gMSk7XG59XG5mdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdm9pZFxufVxudmFyIE1BWF9BUlJBWV9JTkRFWCA9IE1hdGgucG93KDIsIDUzKSAtIDE7XG5mdW5jdGlvbiBpc0FycmF5TGlrZShvYmopIHtcbiAgICBpZiAob2JqID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgbGVuZ3RoID0gb2JqLmxlbmd0aDtcbiAgICByZXR1cm4gdHlwZW9mIGxlbmd0aCA9PT0gJ251bWJlcicgJiYgbGVuZ3RoID49IDAgJiYgbGVuZ3RoIDw9IE1BWF9BUlJBWV9JTkRFWDtcbn1cbi8vIFRPRE86IGp1c3QgdXNlIHRoZSBqUXVlcnkgdGhpbmdcbmZ1bmN0aW9uIGxvYWQodXJsKSB7XG4gICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHJlcS5vcGVuKCdHRVQnLCB1cmwsIGZhbHNlKTtcbiAgICB0cnkge1xuICAgICAgICByZXEuc2VuZCgpO1xuICAgICAgICBpZiAocmVxLnN0YXR1cyA9PT0gMCB8fCByZXEuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXEucmVzcG9uc2VUZXh0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7IH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuYWJsZSB0byBsb2FkIHVybCAnICsgdXJsKTtcbn1cbi8vIFJldHVybnMgYSBHcmFtbWFyIGluc3RhbmNlIChpLmUuLCBhbiBvYmplY3Qgd2l0aCBhIGBtYXRjaGAgbWV0aG9kKSBmb3Jcbi8vIGB0cmVlYCwgd2hpY2ggaXMgdGhlIGNvbmNyZXRlIHN5bnRheCB0cmVlIG9mIGEgdXNlci13cml0dGVuIGdyYW1tYXIuXG4vLyBUaGUgZ3JhbW1hciB3aWxsIGJlIGFzc2lnbmVkIGludG8gYG5hbWVzcGFjZWAgdW5kZXIgdGhlIG5hbWUgb2YgdGhlIGdyYW1tYXJcbi8vIGFzIHNwZWNpZmllZCBpbiB0aGUgc291cmNlLlxuZnVuY3Rpb24gYnVpbGRHcmFtbWFyKG1hdGNoLCBuYW1lc3BhY2UsIG9wdE9obUdyYW1tYXJGb3JUZXN0aW5nKSB7XG4gICAgdmFyIGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuICAgIHZhciBkZWNsO1xuICAgIHZhciBjdXJyZW50UnVsZU5hbWU7XG4gICAgdmFyIGN1cnJlbnRSdWxlRm9ybWFscztcbiAgICB2YXIgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICAgIHZhciBtZXRhR3JhbW1hciA9IG9wdE9obUdyYW1tYXJGb3JUZXN0aW5nIHx8IG9obUdyYW1tYXI7XG4gICAgLy8gQSB2aXNpdG9yIHRoYXQgcHJvZHVjZXMgYSBHcmFtbWFyIGluc3RhbmNlIGZyb20gdGhlIENTVC5cbiAgICB2YXIgaGVscGVycyA9IG1ldGFHcmFtbWFyLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndmlzaXQnLCB7XG4gICAgICAgIEdyYW1tYXJzOiBmdW5jdGlvbiAoZ3JhbW1hckl0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBncmFtbWFySXRlci5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIEdyYW1tYXI6IGZ1bmN0aW9uIChpZCwgcywgX29wZW4sIHJ1bGVzLCBfY2xvc2UpIHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBncmFtbWFyTmFtZSA9IGlkLnZpc2l0KCk7XG4gICAgICAgICAgICBkZWNsID0gYnVpbGRlci5uZXdHcmFtbWFyKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgICAgICAgKF9hID0gcy5jaGlsZCgwKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnZpc2l0KCk7XG4gICAgICAgICAgICBydWxlcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSk7XG4gICAgICAgICAgICB2YXIgZyA9IGRlY2wuYnVpbGQoKTtcbiAgICAgICAgICAgIGcuc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgaWYgKGdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9ycy5kdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZywgbmFtZXNwYWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5hbWVzcGFjZVtncmFtbWFyTmFtZV0gPSBnO1xuICAgICAgICAgICAgcmV0dXJuIGc7XG4gICAgICAgIH0sXG4gICAgICAgIFN1cGVyR3JhbW1hcjogZnVuY3Rpb24gKF8sIG4pIHtcbiAgICAgICAgICAgIHZhciBzdXBlckdyYW1tYXJOYW1lID0gbi52aXNpdCgpO1xuICAgICAgICAgICAgaWYgKHN1cGVyR3JhbW1hck5hbWUgPT09ICdudWxsJykge1xuICAgICAgICAgICAgICAgIGRlY2wud2l0aFN1cGVyR3JhbW1hcihudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghbmFtZXNwYWNlIHx8ICEoc3VwZXJHcmFtbWFyTmFtZSBpbiBuYW1lc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9ycy51bmRlY2xhcmVkR3JhbW1hcihzdXBlckdyYW1tYXJOYW1lLCBuYW1lc3BhY2UsIG4uc291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG5hbWVzcGFjZVtzdXBlckdyYW1tYXJOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVfZGVmaW5lOiBmdW5jdGlvbiAobiwgZnMsIGQsIF8sIGIpIHtcbiAgICAgICAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgICAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLmNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy52aXNpdCgpOyB9KVswXSB8fCBbXTtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZSB5ZXQsIHNldCBpdCBub3cuIFRoaXMgbXVzdCBiZSBkb25lIGJlZm9yZSB2aXNpdGluZ1xuICAgICAgICAgICAgLy8gdGhlIGJvZHksIGJlY2F1c2UgaXQgbWlnaHQgY29udGFpbiBhbiBpbmxpbmUgcnVsZSBkZWZpbml0aW9uLlxuICAgICAgICAgICAgaWYgKCFkZWNsLmRlZmF1bHRTdGFydFJ1bGUgJiYgZGVjbC5lbnN1cmVTdXBlckdyYW1tYXIoKSAhPT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcykge1xuICAgICAgICAgICAgICAgIGRlY2wud2l0aERlZmF1bHRTdGFydFJ1bGUoY3VycmVudFJ1bGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZC5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSlbMF07XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgcmV0dXJuIGRlY2wuZGVmaW5lKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUnVsZV9vdmVycmlkZTogZnVuY3Rpb24gKG4sIGZzLCBfLCBiKSB7XG4gICAgICAgICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSlbMF0gfHwgW107XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgZGVjbC5lbnN1cmVTdXBlckdyYW1tYXJSdWxlRm9yT3ZlcnJpZGluZyhjdXJyZW50UnVsZU5hbWUsIHNvdXJjZSk7XG4gICAgICAgICAgICBvdmVycmlkaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgICAgICAgb3ZlcnJpZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuIGRlY2wub3ZlcnJpZGUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVfZXh0ZW5kOiBmdW5jdGlvbiAobiwgZnMsIF8sIGIpIHtcbiAgICAgICAgICAgIGN1cnJlbnRSdWxlTmFtZSA9IG4udmlzaXQoKTtcbiAgICAgICAgICAgIGN1cnJlbnRSdWxlRm9ybWFscyA9IGZzLmNoaWxkcmVuLm1hcChmdW5jdGlvbiAoYykgeyByZXR1cm4gYy52aXNpdCgpOyB9KVswXSB8fCBbXTtcbiAgICAgICAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIHJldHVybiBkZWNsLmV4dGVuZChjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUnVsZUJvZHk6IGZ1bmN0aW9uIChfLCB0ZXJtcykge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSB0ZXJtcy52aXNpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBPdmVycmlkZVJ1bGVCb2R5OiBmdW5jdGlvbiAoXywgdGVybXMpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gdGVybXMudmlzaXQoKTtcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzdXBlci1zcGxpY2Ugb3BlcmF0b3IgKGAuLi5gKSBhcHBlYXJzIGluIHRoZSB0ZXJtcy5cbiAgICAgICAgICAgIHZhciBleHBhbnNpb25Qb3MgPSBhcmdzLmluZGV4T2Yoc3VwZXJTcGxpY2VQbGFjZWhvbGRlcik7XG4gICAgICAgICAgICBpZiAoZXhwYW5zaW9uUG9zID49IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgYmVmb3JlVGVybXMgPSBhcmdzLnNsaWNlKDAsIGV4cGFuc2lvblBvcyk7XG4gICAgICAgICAgICAgICAgdmFyIGFmdGVyVGVybXMgPSBhcmdzLnNsaWNlKGV4cGFuc2lvblBvcyArIDEpO1xuICAgICAgICAgICAgICAgIC8vIEVuc3VyZSBpdCBhcHBlYXJzIG5vIG1vcmUgdGhhbiBvbmNlLlxuICAgICAgICAgICAgICAgIGFmdGVyVGVybXMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodCA9PT0gc3VwZXJTcGxpY2VQbGFjZWhvbGRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycm9ycy5tdWx0aXBsZVN1cGVyU3BsaWNlcyh0KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHBleHBycy5TcGxpY2UoZGVjbC5zdXBlckdyYW1tYXIsIGN1cnJlbnRSdWxlTmFtZSwgYmVmb3JlVGVybXMsIGFmdGVyVGVybXMpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBGb3JtYWxzOiBmdW5jdGlvbiAob3BvaW50eSwgZnMsIGNwb2ludHkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcy52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBQYXJhbXM6IGZ1bmN0aW9uIChvcG9pbnR5LCBwcywgY3BvaW50eSkge1xuICAgICAgICAgICAgcmV0dXJuIHBzLnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIEFsdDogZnVuY3Rpb24gKHNlcXMpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gc2Vxcy52aXNpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBUb3BMZXZlbFRlcm1faW5saW5lOiBmdW5jdGlvbiAoYiwgbikge1xuICAgICAgICAgICAgdmFyIGlubGluZVJ1bGVOYW1lID0gY3VycmVudFJ1bGVOYW1lICsgJ18nICsgbi52aXNpdCgpO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgdmFyIGlzTmV3UnVsZURlY2xhcmF0aW9uID0gIShkZWNsLnN1cGVyR3JhbW1hciAmJiBkZWNsLnN1cGVyR3JhbW1hci5ydWxlc1tpbmxpbmVSdWxlTmFtZV0pO1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRpbmcgJiYgIWlzTmV3UnVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVjbC5vdmVycmlkZShpbmxpbmVSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVjbC5kZWZpbmUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBjdXJyZW50UnVsZUZvcm1hbHMubWFwKGZ1bmN0aW9uIChmb3JtYWwpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGZvcm1hbCk7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKGlubGluZVJ1bGVOYW1lLCBwYXJhbXMpLndpdGhTb3VyY2UoYm9keS5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBPdmVycmlkZVRvcExldmVsVGVybV9zdXBlclNwbGljZTogZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlclNwbGljZVBsYWNlaG9sZGVyO1xuICAgICAgICB9LFxuICAgICAgICBTZXE6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5zZXFcbiAgICAgICAgICAgICAgICAuYXBwbHkoYnVpbGRlciwgZXhwci5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSkpXG4gICAgICAgICAgICAgICAgLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBJdGVyX3N0YXI6IGZ1bmN0aW9uICh4LCBfKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5zdGFyKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIEl0ZXJfcGx1czogZnVuY3Rpb24gKHgsIF8pIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLnBsdXMoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgSXRlcl9vcHQ6IGZ1bmN0aW9uICh4LCBfKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5vcHQoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUHJlZF9ub3Q6IGZ1bmN0aW9uIChfLCB4KSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5ub3QoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgUHJlZF9sb29rYWhlYWQ6IGZ1bmN0aW9uIChfLCB4KSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5sb29rYWhlYWQoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgTGV4X2xleDogZnVuY3Rpb24gKF8sIHgpIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLmxleCh4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX2FwcGxpY2F0aW9uOiBmdW5jdGlvbiAocnVsZSwgcHMpIHtcbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBwcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSlbMF0gfHwgW107XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5hcHAocnVsZS52aXNpdCgpLCBwYXJhbXMpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX3JhbmdlOiBmdW5jdGlvbiAoZnJvbSwgXywgdG8pIHtcbiAgICAgICAgICAgIHJldHVybiBidWlsZGVyLnJhbmdlKGZyb20udmlzaXQoKSwgdG8udmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIEJhc2VfdGVybWluYWw6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci50ZXJtaW5hbChleHByLnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX3BhcmVuOiBmdW5jdGlvbiAob3BlbiwgeCwgY2xvc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB4LnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHJ1bGVEZXNjcjogZnVuY3Rpb24gKG9wZW4sIHQsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4gdC52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBydWxlRGVzY3JUZXh0OiBmdW5jdGlvbiAoXykge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlU3RyaW5nLnRyaW0oKTtcbiAgICAgICAgfSxcbiAgICAgICAgY2FzZU5hbWU6IGZ1bmN0aW9uIChfLCBzcGFjZTEsIG4sIHNwYWNlMiwgZW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gbi52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lOiBmdW5jdGlvbiAoZmlyc3QsIHJlc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZUZpcnN0OiBmdW5jdGlvbiAoZXhwcikgeyB9LFxuICAgICAgICBuYW1lUmVzdDogZnVuY3Rpb24gKGV4cHIpIHsgfSxcbiAgICAgICAgdGVybWluYWw6IGZ1bmN0aW9uIChvcGVuLCBjcywgY2xvc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBjcy5jaGlsZHJlbi5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMudmlzaXQoKTsgfSkuam9pbignJyk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uZUNoYXJUZXJtaW5hbDogZnVuY3Rpb24gKG9wZW4sIGMsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4gYy52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICB0ZXJtaW5hbENoYXI6IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgICAgICByZXR1cm4gY29tbW9uLnVuZXNjYXBlQ2hhcih0aGlzLnNvdXJjZVN0cmluZyk7XG4gICAgICAgIH0sXG4gICAgICAgIGVzY2FwZUNoYXI6IGZ1bmN0aW9uIChfKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIE5vbmVtcHR5TGlzdE9mOiBmdW5jdGlvbiAoeCwgXywgeHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbeC52aXNpdCgpXS5jb25jYXQoeHMuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjKSB7IHJldHVybiBjLnZpc2l0KCk7IH0pKTtcbiAgICAgICAgfSxcbiAgICAgICAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSxcbiAgICAgICAgX3Rlcm1pbmFsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaGVscGVycyhtYXRjaCkudmlzaXQoKTtcbn1cbmZ1bmN0aW9uIGNvbXBpbGVBbmRMb2FkKHNvdXJjZSwgbmFtZXNwYWNlKSB7XG4gICAgdmFyIG0gPSBvaG1HcmFtbWFyLm1hdGNoKHNvdXJjZSwgJ0dyYW1tYXJzJyk7XG4gICAgaWYgKG0uZmFpbGVkKCkpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmdyYW1tYXJTeW50YXhFcnJvcihtKTtcbiAgICB9XG4gICAgcmV0dXJuIGJ1aWxkR3JhbW1hcihtLCBuYW1lc3BhY2UpO1xufVxuLy8gUmV0dXJuIHRoZSBjb250ZW50cyBvZiBhIHNjcmlwdCBlbGVtZW50LCBmZXRjaGluZyBpdCB2aWEgWEhSIGlmIG5lY2Vzc2FyeS5cbmZ1bmN0aW9uIGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhlbCkge1xuICAgIGlmICghaXNFbGVtZW50KGVsKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBhIERPTSBOb2RlLCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoZWwpKTtcbiAgICB9XG4gICAgaWYgKGVsLnR5cGUgIT09ICd0ZXh0L29obS1qcycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBhIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZ290ICcgKyBlbCk7XG4gICAgfVxuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpID8gbG9hZChlbC5nZXRBdHRyaWJ1dGUoJ3NyYycpKSA6IGVsLmlubmVySFRNTDtcbn1cbmZ1bmN0aW9uIGdyYW1tYXIoc291cmNlLCBvcHROYW1lc3BhY2UpIHtcbiAgICB2YXIgbnMgPSBncmFtbWFycyhzb3VyY2UsIG9wdE5hbWVzcGFjZSk7XG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlIHNvdXJjZSBjb250YWluZWQgbm8gbW9yZSB0aGFuIG9uZSBncmFtbWFyIGRlZmluaXRpb24uXG4gICAgdmFyIGdyYW1tYXJOYW1lcyA9IE9iamVjdC5rZXlzKG5zKTtcbiAgICBpZiAoZ3JhbW1hck5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgZ3JhbW1hciBkZWZpbml0aW9uJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGdyYW1tYXJOYW1lcy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHZhciBzZWNvbmRHcmFtbWFyID0gbnNbZ3JhbW1hck5hbWVzWzFdXTtcbiAgICAgICAgdmFyIGludGVydmFsID0gc2Vjb25kR3JhbW1hci5zb3VyY2U7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcih1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKGludGVydmFsLnNvdXJjZVN0cmluZywgaW50ZXJ2YWwuc3RhcnRJZHgpICtcbiAgICAgICAgICAgICdGb3VuZCBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbiAtLSB1c2Ugb2htLmdyYW1tYXJzKCkgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG5zW2dyYW1tYXJOYW1lc1swXV07IC8vIFJldHVybiB0aGUgb25lIGFuZCBvbmx5IGdyYW1tYXIuXG59XG5mdW5jdGlvbiBncmFtbWFycyhzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICAgIHZhciBucyA9IE5hbWVzcGFjZS5leHRlbmQoTmFtZXNwYWNlLmFzTmFtZXNwYWNlKG9wdE5hbWVzcGFjZSkpO1xuICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBGb3IgY29udmVuaWVuY2UsIGRldGVjdCBOb2RlLmpzIEJ1ZmZlciBvYmplY3RzIGFuZCBhdXRvbWF0aWNhbGx5IGNhbGwgdG9TdHJpbmcoKS5cbiAgICAgICAgaWYgKGlzQnVmZmVyKHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgc3RyaW5nIGFzIGZpcnN0IGFyZ3VtZW50LCBnb3QgJyArIGNvbW1vbi51bmV4cGVjdGVkT2JqVG9TdHJpbmcoc291cmNlKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcGlsZUFuZExvYWQoc291cmNlLCBucyk7XG4gICAgcmV0dXJuIG5zO1xufVxuZnVuY3Rpb24gZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50KG9wdE5vZGUpIHtcbiAgICB2YXIgbm9kZSA9IG9wdE5vZGU7XG4gICAgaWYgKGlzVW5kZWZpbmVkKG5vZGUpKSB7XG4gICAgICAgIHZhciBub2RlTGlzdCA9IGRvY3VtZW50SW50ZXJmYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9vaG0tanNcIl0nKTtcbiAgICAgICAgaWYgKG5vZGVMaXN0Lmxlbmd0aCAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RlZCBleGFjdGx5IG9uZSBzY3JpcHQgdGFnIHdpdGggdHlwZT1cInRleHQvb2htLWpzXCIsIGZvdW5kICcgKyBub2RlTGlzdC5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUgPSBub2RlTGlzdFswXTtcbiAgICB9XG4gICAgcmV0dXJuIGdyYW1tYXIoZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKG5vZGUpKTtcbn1cbmZ1bmN0aW9uIGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzKG9wdE5vZGVPck5vZGVMaXN0KSB7XG4gICAgLy8gU2ltcGxlIGNhc2U6IHRoZSBhcmd1bWVudCBpcyBhIERPTSBub2RlLlxuICAgIGlmIChpc0VsZW1lbnQob3B0Tm9kZU9yTm9kZUxpc3QpKSB7XG4gICAgICAgIHJldHVybiBncmFtbWFycyhvcHROb2RlT3JOb2RlTGlzdCk7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgaXQgbXVzdCBiZSBlaXRoZXIgdW5kZWZpbmVkIG9yIGEgTm9kZUxpc3QuXG4gICAgdmFyIG5vZGVMaXN0ID0gb3B0Tm9kZU9yTm9kZUxpc3Q7XG4gICAgaWYgKGlzVW5kZWZpbmVkKG5vZGVMaXN0KSkge1xuICAgICAgICAvLyBGaW5kIGFsbCBzY3JpcHQgZWxlbWVudHMgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIi5cbiAgICAgICAgbm9kZUxpc3QgPSBkb2N1bWVudEludGVyZmFjZS5xdWVyeVNlbGVjdG9yQWxsKCdzY3JpcHRbdHlwZT1cInRleHQvb2htLWpzXCJdJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBub2RlTGlzdCA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgKCFpc0VsZW1lbnQobm9kZUxpc3QpICYmICFpc0FycmF5TGlrZShub2RlTGlzdCkpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgTm9kZSwgTm9kZUxpc3QsIG9yIEFycmF5LCBidXQgZ290ICcgKyBub2RlTGlzdCk7XG4gICAgfVxuICAgIHZhciBucyA9IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGVMaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgIC8vIENvcHkgdGhlIG5ldyBncmFtbWFycyBpbnRvIGBuc2AgdG8ga2VlcCB0aGUgbmFtZXNwYWNlIGZsYXQuXG4gICAgICAgIGNvbW1vbi5leHRlbmQobnMsIGdyYW1tYXJzKGdldFNjcmlwdEVsZW1lbnRDb250ZW50cyhub2RlTGlzdFtpXSksIG5zKSk7XG4gICAgfVxuICAgIHJldHVybiBucztcbn1cbmZ1bmN0aW9uIG1ha2VSZWNpcGUocmVjaXBlKSB7XG4gICAgaWYgKHR5cGVvZiByZWNpcGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIHJlY2lwZS5jYWxsKG5ldyBCdWlsZGVyKCkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZWNpcGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBzdHJpbmdpZmllZCBKU09OIHJlY2lwZVxuICAgICAgICAgICAgcmVjaXBlID0gSlNPTi5wYXJzZShyZWNpcGUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgQnVpbGRlcigpLmZyb21SZWNpcGUocmVjaXBlKTtcbiAgICB9XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFN0dWZmIHRoYXQgdXNlcnMgc2hvdWxkIGtub3cgYWJvdXRcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGNyZWF0ZU5hbWVzcGFjZTogTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSxcbiAgICBncmFtbWFyOiBncmFtbWFyLFxuICAgIGdyYW1tYXJzOiBncmFtbWFycyxcbiAgICBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQ6IGdyYW1tYXJGcm9tU2NyaXB0RWxlbWVudCxcbiAgICBncmFtbWFyc0Zyb21TY3JpcHRFbGVtZW50czogZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMsXG4gICAgbWFrZVJlY2lwZTogbWFrZVJlY2lwZSxcbiAgICBvaG1HcmFtbWFyOiBudWxsLFxuICAgIHBleHByczogcGV4cHJzLFxuICAgIHV0aWw6IHV0aWwsXG4gICAgZXh0cmFzOiByZXF1aXJlKCcuLi9leHRyYXMnKSxcbiAgICB2ZXJzaW9uOiB2ZXJzaW9uXG59O1xuLy8gU3R1ZmYgZm9yIHRlc3RpbmcsIGV0Yy5cbm1vZHVsZS5leHBvcnRzLl9idWlsZEdyYW1tYXIgPSBidWlsZEdyYW1tYXI7XG5tb2R1bGUuZXhwb3J0cy5fc2V0RG9jdW1lbnRJbnRlcmZhY2VGb3JUZXN0aW5nID0gZnVuY3Rpb24gKGRvYykge1xuICAgIGRvY3VtZW50SW50ZXJmYWNlID0gZG9jO1xufTtcbi8vIExhdGUgaW5pdGlhbGl6YXRpb24gZm9yIHN0dWZmIHRoYXQgaXMgYm9vdHN0cmFwcGVkLlxuR3JhbW1hci5CdWlsdEluUnVsZXMgPSByZXF1aXJlKCcuLi9kaXN0L2J1aWx0LWluLXJ1bGVzJyk7XG51dGlsLmFubm91bmNlQnVpbHRJblJ1bGVzKEdyYW1tYXIuQnVpbHRJblJ1bGVzKTtcbm1vZHVsZS5leHBvcnRzLm9obUdyYW1tYXIgPSBvaG1HcmFtbWFyID0gcmVxdWlyZSgnLi4vZGlzdC9vaG0tZ3JhbW1hcicpO1xuR3JhbW1hci5pbml0QXBwbGljYXRpb25QYXJzZXIob2htR3JhbW1hciwgYnVpbGRHcmFtbWFyKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbi8vIEVuc3VyZXMgdGhhdCB0aGUgZGVwcmVjYXRpb24gd2FybmluZyBmb3IgYHByaW1pdGl2ZVZhbHVlYCBvbmx5IGFwcGVhcnMgb25jZS5cbnZhciBkaWRXYXJuRm9yUHJpbWl0aXZlVmFsdWUgPSBmYWxzZTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIE5vZGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTm9kZShncmFtbWFyLCBjdG9yTmFtZSwgbWF0Y2hMZW5ndGgpIHtcbiAgICAgICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICAgICAgdGhpcy5jdG9yTmFtZSA9IGN0b3JOYW1lO1xuICAgICAgICB0aGlzLm1hdGNoTGVuZ3RoID0gbWF0Y2hMZW5ndGg7XG4gICAgfVxuICAgIE5vZGUucHJvdG90eXBlLm51bUNoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbiA/IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIDogMDtcbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLmNoaWxkQXQgPSBmdW5jdGlvbiAoaWR4KSB7XG4gICAgICAgIGlmICh0aGlzLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpZHhdO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5pbmRleE9mQ2hpbGQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuLmluZGV4T2YoYXJnKTtcbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLmhhc0NoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5udW1DaGlsZHJlbigpID4gMDtcbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLmhhc05vQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5oYXNDaGlsZHJlbigpO1xuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUub25seUNoaWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5udW1DaGlsZHJlbigpICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgb25seSBjaGlsZCBvZiBhIG5vZGUgb2YgdHlwZSAnICtcbiAgICAgICAgICAgICAgICB0aGlzLmN0b3JOYW1lICtcbiAgICAgICAgICAgICAgICAnIChpdCBoYXMgJyArXG4gICAgICAgICAgICAgICAgdGhpcy5udW1DaGlsZHJlbigpICtcbiAgICAgICAgICAgICAgICAnIGNoaWxkcmVuKScpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3RDaGlsZCgpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5maXJzdENoaWxkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNOb0NoaWxkcmVuKCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBmaXJzdCBjaGlsZCBvZiBhICcgKyB0aGlzLmN0b3JOYW1lICsgJyBub2RlLCB3aGljaCBoYXMgbm8gY2hpbGRyZW4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkQXQoMCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLmxhc3RDaGlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgbGFzdCBjaGlsZCBvZiBhICcgKyB0aGlzLmN0b3JOYW1lICsgJyBub2RlLCB3aGljaCBoYXMgbm8gY2hpbGRyZW4nKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkQXQodGhpcy5udW1DaGlsZHJlbigpIC0gMSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5vZGUucHJvdG90eXBlLmNoaWxkQmVmb3JlID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgICAgICAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmNoaWxkQmVmb3JlKCkgY2FsbGVkIHcvIGFuIGFyZ3VtZW50IHRoYXQgaXMgbm90IGEgY2hpbGQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaGlsZElkeCA9PT0gMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IGNoaWxkIGJlZm9yZSBmaXJzdCBjaGlsZCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCAtIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5jaGlsZEFmdGVyID0gZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHZhciBjaGlsZElkeCA9IHRoaXMuaW5kZXhPZkNoaWxkKGNoaWxkKTtcbiAgICAgICAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb2RlLmNoaWxkQWZ0ZXIoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkSWR4ID09PSB0aGlzLm51bUNoaWxkcmVuKCkgLSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgY2hpbGQgYWZ0ZXIgbGFzdCBjaGlsZCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRBdChjaGlsZElkeCArIDEpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5pc05vbnRlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBOb2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUuaXNPcHRpb25hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgTm9kZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfYSA9IHt9LCBfYVt0aGlzLmN0b3JOYW1lXSA9IHRoaXMuY2hpbGRyZW4sIF9hO1xuICAgIH07XG4gICAgcmV0dXJuIE5vZGU7XG59KCkpO1xuLy8gVGVybWluYWxzXG52YXIgVGVybWluYWxOb2RlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUZXJtaW5hbE5vZGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVGVybWluYWxOb2RlKGdyYW1tYXIsIHZhbHVlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBtYXRjaExlbmd0aCA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcbiAgICAgICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBncmFtbWFyLCAnX3Rlcm1pbmFsJywgbWF0Y2hMZW5ndGgpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIFRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNUZXJtaW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcbiAgICBUZXJtaW5hbE5vZGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gX2EgPSB7fSwgX2FbdGhpcy5jdG9yTmFtZV0gPSB0aGlzLl92YWx1ZSwgX2E7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGVybWluYWxOb2RlLnByb3RvdHlwZSwgXCJwcmltaXRpdmVWYWx1ZVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFkaWRXYXJuRm9yUHJpbWl0aXZlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignV2FybmluZzogcHJpbWl0aXZlVmFsdWUgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGEgZnV0dXJlIHZlcnNpb24gb2YgT2htLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBzb3VyY2VTdHJpbmcgaW5zdGVhZC4nKTtcbiAgICAgICAgICAgICAgICBkaWRXYXJuRm9yUHJpbWl0aXZlVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgcmV0dXJuIFRlcm1pbmFsTm9kZTtcbn0oTm9kZSkpO1xuLy8gTm9udGVybWluYWxzXG52YXIgTm9udGVybWluYWxOb2RlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb250ZXJtaW5hbE5vZGUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTm9udGVybWluYWxOb2RlKGdyYW1tYXIsIHJ1bGVOYW1lLCBjaGlsZHJlbiwgY2hpbGRPZmZzZXRzLCBtYXRjaExlbmd0aCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBncmFtbWFyLCBydWxlTmFtZSwgbWF0Y2hMZW5ndGgpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIF90aGlzLmNoaWxkT2Zmc2V0cyA9IGNoaWxkT2Zmc2V0cztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBOb250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzTm9udGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc0xleGljYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uaXNMZXhpY2FsKHRoaXMuY3Rvck5hbWUpO1xuICAgIH07XG4gICAgTm9udGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1N5bnRhY3RpYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGNvbW1vbi5pc1N5bnRhY3RpYyh0aGlzLmN0b3JOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiBOb250ZXJtaW5hbE5vZGU7XG59KE5vZGUpKTtcbi8vIEl0ZXJhdGlvbnNcbnZhciBJdGVyYXRpb25Ob2RlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhJdGVyYXRpb25Ob2RlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEl0ZXJhdGlvbk5vZGUoZ3JhbW1hciwgY2hpbGRyZW4sIGNoaWxkT2Zmc2V0cywgbWF0Y2hMZW5ndGgsIGlzT3B0aW9uYWwpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZ3JhbW1hciwgJ19pdGVyJywgbWF0Y2hMZW5ndGgpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICAgIF90aGlzLmNoaWxkT2Zmc2V0cyA9IGNoaWxkT2Zmc2V0cztcbiAgICAgICAgX3RoaXMub3B0aW9uYWwgPSBpc09wdGlvbmFsO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEl0ZXJhdGlvbk5vZGUucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIEl0ZXJhdGlvbk5vZGUucHJvdG90eXBlLmlzT3B0aW9uYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbmFsO1xuICAgIH07XG4gICAgcmV0dXJuIEl0ZXJhdGlvbk5vZGU7XG59KE5vZGUpKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTm9kZTogTm9kZSxcbiAgICBUZXJtaW5hbE5vZGU6IFRlcm1pbmFsTm9kZSxcbiAgICBOb250ZXJtaW5hbE5vZGU6IE5vbnRlcm1pbmFsTm9kZSxcbiAgICBJdGVyYXRpb25Ob2RlOiBJdGVyYXRpb25Ob2RlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBSZXR1cm4gdHJ1ZSBpZiB3ZSBzaG91bGQgc2tpcCBzcGFjZXMgcHJlY2VkaW5nIHRoaXMgZXhwcmVzc2lvbiBpbiBhIHN5bnRhY3RpYyBjb250ZXh0LlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGNvbW1vbi5hYnN0cmFjdCgnYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZScpO1xuLypcbiAgR2VuZXJhbGx5LCB0aGVzZSBhcmUgYWxsIGZpcnN0LW9yZGVyIGV4cHJlc3Npb25zIGFuZCAod2l0aCB0aGUgZXhjZXB0aW9uIG9mIEFwcGx5KVxuICBkaXJlY3RseSByZWFkIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiovXG5wZXhwcnMuYW55LmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgIHBleHBycy5lbmQuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgIHBleHBycy5BcHBseS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuLypcbiAgSGlnaGVyLW9yZGVyIGV4cHJlc3Npb25zIHRoYXQgZG9uJ3QgZGlyZWN0bHkgY29uc3VtZSBpbnB1dC5cbiovXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICBwZXhwcnMuSXRlci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgIHBleHBycy5MZXgucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuU2VxLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xudmFyIEJ1aWx0SW5SdWxlcztcbnV0aWwuYXdhaXRCdWlsdEluUnVsZXMoZnVuY3Rpb24gKGcpIHtcbiAgICBCdWlsdEluUnVsZXMgPSBnO1xufSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBsZXhpZnlDb3VudDtcbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICBsZXhpZnlDb3VudCA9IDA7XG4gICAgdGhpcy5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xufTtcbnBleHBycy5QRXhwci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gY29tbW9uLmFic3RyYWN0KCdfYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQnKTtcbnBleHBycy5hbnkuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICBwZXhwcnMuZW5kLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vLW9wXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkxleC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gICAgbGV4aWZ5Q291bnQrKztcbiAgICB0aGlzLmV4cHIuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICBsZXhpZnlDb3VudC0tO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLnRlcm1zW2lkeF0uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICB9XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgdGhpcy5mYWN0b3JzW2lkeF0uX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICB9XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9XG4gICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgICAgIGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwci5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICB2YXIgcnVsZUluZm8gPSBncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdO1xuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBydWxlIGV4aXN0cy4uLlxuICAgIGlmICghcnVsZUluZm8pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRSdWxlKHRoaXMucnVsZU5hbWUsIGdyYW1tYXIubmFtZSwgdGhpcy5zb3VyY2UpO1xuICAgIH1cbiAgICAvLyAuLi5hbmQgdGhhdCB0aGlzIGFwcGxpY2F0aW9uIGlzIGFsbG93ZWRcbiAgICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpICYmXG4gICAgICAgICghY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSB8fCBsZXhpZnlDb3VudCA+IDApKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5hcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCh0aGlzLnJ1bGVOYW1lLCB0aGlzKTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBoYXMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50c1xuICAgIHZhciBhY3R1YWwgPSB0aGlzLmFyZ3MubGVuZ3RoO1xuICAgIHZhciBleHBlY3RlZCA9IHJ1bGVJbmZvLmZvcm1hbHMubGVuZ3RoO1xuICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mQXJndW1lbnRzKHRoaXMucnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHRoYXQgYWxsIG9mIHRoZSBhcmd1bWVudCBleHByZXNzaW9ucyBvbmx5IGhhdmUgdmFsaWQgYXBwbGljYXRpb25zIGFuZCBoYXZlIGFyaXR5IDEuXG4gICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICBhcmcuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkKHJ1bGVOYW1lLCBncmFtbWFyKTtcbiAgICAgICAgaWYgKGFyZy5nZXRBcml0eSgpICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW52YWxpZFBhcmFtZXRlcihfdGhpcy5ydWxlTmFtZSwgYXJnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIEV4dHJhIGNoZWNrcyBmb3IgXCJzcGVjaWFsXCIgYXBwbGljYXRpb25zXG4gICAgLy8gSWYgaXQncyBhbiBhcHBsaWNhdGlvbiBvZiAnY2FzZUluc2Vuc2l0aXZlJywgZW5zdXJlIHRoYXQgdGhlIGFyZ3VtZW50IGlzIGEgVGVybWluYWwuXG4gICAgaWYgKEJ1aWx0SW5SdWxlcyAmJiBydWxlSW5mbyA9PT0gQnVpbHRJblJ1bGVzLnJ1bGVzLmNhc2VJbnNlbnNpdGl2ZSkge1xuICAgICAgICBpZiAoISh0aGlzLmFyZ3NbMF0gaW5zdGFuY2VvZiBwZXhwcnMuVGVybWluYWwpKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW5jb3JyZWN0QXJndW1lbnRUeXBlKCdhIFRlcm1pbmFsIChlLmcuIFwiYWJjXCIpJywgdGhpcy5hcmdzWzBdKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGNvbW1vbi5hYnN0cmFjdCgnYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHknKTtcbnBleHBycy5hbnkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgIHBleHBycy5lbmQuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8tb3BcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgYXJpdHkgPSB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgICAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KCk7XG4gICAgICAgIHZhciBvdGhlckFyaXR5ID0gdGVybS5nZXRBcml0eSgpO1xuICAgICAgICBpZiAoYXJpdHkgIT09IG90aGVyQXJpdHkpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5pbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgYXJpdHksIG90aGVyQXJpdHksIHRlcm0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbnBleHBycy5FeHRlbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgLy8gRXh0ZW5kIGlzIGEgc3BlY2lhbCBjYXNlIG9mIEFsdCB0aGF0J3MgZ3VhcmFudGVlZCB0byBoYXZlIGV4YWN0bHkgdHdvXG4gICAgLy8gY2FzZXM6IFtleHRlbnNpb25zLCBvcmlnQm9keV0uXG4gICAgdmFyIGFjdHVhbEFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICAgIHZhciBleHBlY3RlZEFyaXR5ID0gdGhpcy50ZXJtc1sxXS5nZXRBcml0eSgpO1xuICAgIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkQXJpdHksIGFjdHVhbEFyaXR5LCB0aGlzLnRlcm1zWzBdKTtcbiAgICB9XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgfVxufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBuby1vcCAobm90IHJlcXVpcmVkIGIvYyB0aGUgbmVzdGVkIGV4cHIgZG9lc24ndCBzaG93IHVwIGluIHRoZSBDU1QpXG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBUaGUgYXJpdGllcyBvZiB0aGUgcGFyYW1ldGVyIGV4cHJlc3Npb25zIGlzIHJlcXVpcmVkIHRvIGJlIDEgYnlcbiAgICAvLyBgYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoKWAuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gY29tbW9uLmFic3RyYWN0KCdhc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnBleHBycy5hbnkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICBwZXhwcnMuZW5kLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm8tb3BcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgIH1cbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICB9XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgLy8gTm90ZTogdGhpcyBpcyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgZm9yIGBTdGFyYCBhbmQgYFBsdXNgIGV4cHJlc3Npb25zLlxuICAgIC8vIEl0IGlzIG92ZXJyaWRkZW4gZm9yIGBPcHRgIGJlbG93LlxuICAgIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hcik7XG4gICAgaWYgKHRoaXMuZXhwci5pc051bGxhYmxlKGdyYW1tYXIpKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5rbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKHRoaXMsIFtdKTtcbiAgICB9XG59O1xucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHIuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZykge1xuICAgICAgICBhcmcuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBub2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIFRlcm1pbmFsTm9kZSA9IG5vZGVzLlRlcm1pbmFsTm9kZTtcbnZhciBOb250ZXJtaW5hbE5vZGUgPSBub2Rlcy5Ob250ZXJtaW5hbE5vZGU7XG52YXIgSXRlcmF0aW9uTm9kZSA9IG5vZGVzLkl0ZXJhdGlvbk5vZGU7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIEV2YWx1YXRlIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm4gYHRydWVgIGlmIGl0IHN1Y2NlZWRzLCBgZmFsc2VgIG90aGVyd2lzZS4gVGhpcyBtZXRob2Qgc2hvdWxkXG4gIG9ubHkgYmUgY2FsbGVkIGRpcmVjdGx5IGJ5IGBTdGF0ZS5wcm90b3R5cGUuZXZhbChleHByKWAsIHdoaWNoIGFsc28gdXBkYXRlcyB0aGUgZGF0YSBzdHJ1Y3R1cmVzXG4gIHRoYXQgYXJlIHVzZWQgZm9yIHRyYWNpbmcuIChNYWtpbmcgdGhvc2UgdXBkYXRlcyBpbiBhIG1ldGhvZCBvZiBgU3RhdGVgIGVuYWJsZXMgdGhlIHRyYWNlLXNwZWNpZmljXG4gIGRhdGEgc3RydWN0dXJlcyB0byBiZSBcInNlY3JldHNcIiBvZiB0aGF0IGNsYXNzLCB3aGljaCBpcyBnb29kIGZvciBtb2R1bGFyaXR5LilcblxuICBUaGUgY29udHJhY3Qgb2YgdGhpcyBtZXRob2QgaXMgYXMgZm9sbG93czpcbiAgKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgYHRydWVgLFxuICAgIC0gdGhlIHN0YXRlIG9iamVjdCB3aWxsIGhhdmUgYGV4cHIuZ2V0QXJpdHkoKWAgbW9yZSBiaW5kaW5ncyB0aGFuIGl0IGRpZCBiZWZvcmUgdGhlIGNhbGwuXG4gICogV2hlbiB0aGUgcmV0dXJuIHZhbHVlIGlzIGBmYWxzZWAsXG4gICAgLSB0aGUgc3RhdGUgb2JqZWN0IG1heSBoYXZlIG1vcmUgYmluZGluZ3MgdGhhbiBpdCBkaWQgYmVmb3JlIHRoZSBjYWxsLCBhbmRcbiAgICAtIGl0cyBpbnB1dCBzdHJlYW0ncyBwb3NpdGlvbiBtYXkgYmUgYW55d2hlcmUuXG5cbiAgTm90ZSB0aGF0IGBTdGF0ZS5wcm90b3R5cGUuZXZhbChleHByKWAsIHVubGlrZSB0aGlzIG1ldGhvZCwgZ3VhcmFudGVlcyB0aGF0IG5laXRoZXIgdGhlIHN0YXRlXG4gIG9iamVjdCdzIGJpbmRpbmdzIG5vciBpdHMgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gd2lsbCBjaGFuZ2UgaWYgdGhlIGV4cHJlc3Npb24gZmFpbHMgdG8gbWF0Y2guXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gY29tbW9uLmFic3RyYWN0KCdldmFsJyk7IC8vIGZ1bmN0aW9uKHN0YXRlKSB7IC4uLiB9XG5wZXhwcnMuYW55LmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gICAgaWYgKGNoKSB7XG4gICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuZW5kLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoaW5wdXRTdHJlYW0uYXRFbmQoKSkge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHVuZGVmaW5lZCksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmICghaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopKSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHRoaXMub2JqKSwgb3JpZ1Bvcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gICAgaWYgKGNoICYmIHRoaXMuZnJvbSA8PSBjaCAmJiBjaCA8PSB0aGlzLnRvKSB7XG4gICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGUuZXZhbChzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKS5hcmdzW3RoaXMuaW5kZXhdKTtcbn07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgc3RhdGUuZW50ZXJMZXhpZmllZENvbnRleHQoKTtcbiAgICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpO1xuICAgIHN0YXRlLmV4aXRMZXhpZmllZENvbnRleHQoKTtcbiAgICByZXR1cm4gYW5zO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgaWYgKHN0YXRlLmV2YWwodGhpcy50ZXJtc1tpZHhdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgICAgIGlmICghc3RhdGUuZXZhbChmYWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gICAgdmFyIGNvbHMgPSBbXTtcbiAgICB2YXIgY29sT2Zmc2V0cyA9IFtdO1xuICAgIHdoaWxlIChjb2xzLmxlbmd0aCA8IGFyaXR5KSB7XG4gICAgICAgIGNvbHMucHVzaChbXSk7XG4gICAgICAgIGNvbE9mZnNldHMucHVzaChbXSk7XG4gICAgfVxuICAgIHZhciBudW1NYXRjaGVzID0gMDtcbiAgICB2YXIgcHJldlBvcyA9IG9yaWdQb3M7XG4gICAgdmFyIGlkeDtcbiAgICB3aGlsZSAobnVtTWF0Y2hlcyA8IHRoaXMubWF4TnVtTWF0Y2hlcyAmJiBzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLnBvcyA9PT0gcHJldlBvcykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQodGhpcywgc3RhdGUuX2FwcGxpY2F0aW9uU3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgICAgIG51bU1hdGNoZXMrKztcbiAgICAgICAgdmFyIHJvdyA9IHN0YXRlLl9iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIHZhciByb3dPZmZzZXRzID0gc3RhdGUuX2JpbmRpbmdPZmZzZXRzLnNwbGljZShzdGF0ZS5fYmluZGluZ09mZnNldHMubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICAgICAgZm9yIChpZHggPSAwOyBpZHggPCByb3cubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgY29sc1tpZHhdLnB1c2gocm93W2lkeF0pO1xuICAgICAgICAgICAgY29sT2Zmc2V0c1tpZHhdLnB1c2gocm93T2Zmc2V0c1tpZHhdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobnVtTWF0Y2hlcyA8IHRoaXMubWluTnVtTWF0Y2hlcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBvZmZzZXQgPSBzdGF0ZS5wb3NUb09mZnNldChvcmlnUG9zKTtcbiAgICB2YXIgbWF0Y2hMZW5ndGggPSAwO1xuICAgIGlmIChudW1NYXRjaGVzID4gMCkge1xuICAgICAgICB2YXIgbGFzdENvbCA9IGNvbHNbYXJpdHkgLSAxXTtcbiAgICAgICAgdmFyIGxhc3RDb2xPZmZzZXRzID0gY29sT2Zmc2V0c1thcml0eSAtIDFdO1xuICAgICAgICB2YXIgZW5kT2Zmc2V0ID0gbGFzdENvbE9mZnNldHNbbGFzdENvbE9mZnNldHMubGVuZ3RoIC0gMV0gKyBsYXN0Q29sW2xhc3RDb2wubGVuZ3RoIC0gMV0ubWF0Y2hMZW5ndGg7XG4gICAgICAgIG9mZnNldCA9IGNvbE9mZnNldHNbMF1bMF07XG4gICAgICAgIG1hdGNoTGVuZ3RoID0gZW5kT2Zmc2V0IC0gb2Zmc2V0O1xuICAgIH1cbiAgICB2YXIgaXNPcHRpb25hbCA9IHRoaXMgaW5zdGFuY2VvZiBwZXhwcnMuT3B0O1xuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgY29scy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHN0YXRlLl9iaW5kaW5ncy5wdXNoKG5ldyBJdGVyYXRpb25Ob2RlKHN0YXRlLmdyYW1tYXIsIGNvbHNbaWR4XSwgY29sT2Zmc2V0c1tpZHhdLCBtYXRjaExlbmd0aCwgaXNPcHRpb25hbCkpO1xuICAgICAgICBzdGF0ZS5fYmluZGluZ09mZnNldHMucHVzaChvZmZzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgLypcbiAgICAgIFRPRE86XG4gICAgICAtIFJpZ2h0IG5vdyB3ZSdyZSBqdXN0IHRocm93aW5nIGF3YXkgYWxsIG9mIHRoZSBmYWlsdXJlcyB0aGF0IGhhcHBlbiBpbnNpZGUgYSBgbm90YCwgYW5kXG4gICAgICAgIHJlY29yZGluZyBgdGhpc2AgYXMgYSBmYWlsZWQgZXhwcmVzc2lvbi5cbiAgICAgIC0gRG91YmxlIG5lZ2F0aW9uIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvIGxvb2thaGVhZCwgYnV0IHRoYXQncyBub3QgdGhlIGNhc2UgcmlnaHQgbm93IHdydFxuICAgICAgICBmYWlsdXJlcy4gRS5nLiwgfn4nZm9vJyBwcm9kdWNlcyBhIGZhaWx1cmUgZm9yIH5+J2ZvbycsIGJ1dCBtYXliZSBpdCBzaG91bGQgcHJvZHVjZVxuICAgICAgICBhIGZhaWx1cmUgZm9yICdmb28nIGluc3RlYWQuXG4gICAgKi9cbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBzdGF0ZS5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgdmFyIGFucyA9IHN0YXRlLmV2YWwodGhpcy5leHByKTtcbiAgICBzdGF0ZS5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICBpZiAoYW5zKSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmIChzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBjYWxsZXIgPSBzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICB2YXIgYWN0dWFscyA9IGNhbGxlciA/IGNhbGxlci5hcmdzIDogW107XG4gICAgdmFyIGFwcCA9IHRoaXMuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgaWYgKHBvc0luZm8uaXNBY3RpdmUoYXBwKSkge1xuICAgICAgICAvLyBUaGlzIHJ1bGUgaXMgYWxyZWFkeSBhY3RpdmUgYXQgdGhpcyBwb3NpdGlvbiwgaS5lLiwgaXQgaXMgbGVmdC1yZWN1cnNpdmUuXG4gICAgICAgIHJldHVybiBhcHAuaGFuZGxlQ3ljbGUoc3RhdGUpO1xuICAgIH1cbiAgICB2YXIgbWVtb0tleSA9IGFwcC50b01lbW9LZXkoKTtcbiAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcbiAgICBpZiAobWVtb1JlYyAmJiBwb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpKSB7XG4gICAgICAgIGlmIChzdGF0ZS5oYXNOZWNlc3NhcnlJbmZvKG1lbW9SZWMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudXNlTWVtb2l6ZWRSZXN1bHQoc3RhdGUuaW5wdXRTdHJlYW0ucG9zLCBtZW1vUmVjKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcG9zSW5mby5tZW1vW21lbW9LZXldO1xuICAgIH1cbiAgICByZXR1cm4gYXBwLnJlYWxseUV2YWwoc3RhdGUpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuaGFuZGxlQ3ljbGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gcG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICB2YXIgbWVtb0tleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uICYmIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSA9PT0gbWVtb0tleSkge1xuICAgICAgICAvLyBXZSBhbHJlYWR5IGtub3cgYWJvdXQgdGhpcyBsZWZ0IHJlY3Vyc2lvbiwgYnV0IGl0J3MgcG9zc2libGUgdGhlcmUgYXJlIFwiaW52b2x2ZWRcbiAgICAgICAgLy8gYXBwbGljYXRpb25zXCIgdGhhdCB3ZSBkb24ndCBhbHJlYWR5IGtub3cgYWJvdXQsIHNvLi4uXG4gICAgICAgIG1lbW9SZWMudXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFtZW1vUmVjKSB7XG4gICAgICAgIC8vIE5ldyBsZWZ0IHJlY3Vyc2lvbiBkZXRlY3RlZCEgTWVtb2l6ZSBhIGZhaWx1cmUgdG8gdHJ5IHRvIGdldCBhIHNlZWQgcGFyc2UuXG4gICAgICAgIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9pemUobWVtb0tleSwge1xuICAgICAgICAgICAgbWF0Y2hMZW5ndGg6IDAsXG4gICAgICAgICAgICBleGFtaW5lZExlbmd0aDogMCxcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQ6IC0xXG4gICAgICAgIH0pO1xuICAgICAgICBwb3NJbmZvLnN0YXJ0TGVmdFJlY3Vyc2lvbih0aGlzLCBtZW1vUmVjKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRlLnVzZU1lbW9pemVkUmVzdWx0KHN0YXRlLmlucHV0U3RyZWFtLnBvcywgbWVtb1JlYyk7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5yZWFsbHlFdmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgdmFyIG9yaWdQb3NJbmZvID0gc3RhdGUuZ2V0Q3VycmVudFBvc0luZm8oKTtcbiAgICB2YXIgcnVsZUluZm8gPSBzdGF0ZS5ncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdO1xuICAgIHZhciBib2R5ID0gcnVsZUluZm8uYm9keTtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBydWxlSW5mby5kZXNjcmlwdGlvbjtcbiAgICBzdGF0ZS5lbnRlckFwcGxpY2F0aW9uKG9yaWdQb3NJbmZvLCB0aGlzKTtcbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3RhdGUucHVzaEZhaWx1cmVzSW5mbygpO1xuICAgIH1cbiAgICAvLyBSZXNldCB0aGUgaW5wdXQgc3RyZWFtJ3MgZXhhbWluZWRMZW5ndGggcHJvcGVydHkgc28gdGhhdCB3ZSBjYW4gdHJhY2tcbiAgICAvLyB0aGUgZXhhbWluZWQgbGVuZ3RoIG9mIHRoaXMgcGFydGljdWxhciBhcHBsaWNhdGlvbi5cbiAgICB2YXIgb3JpZ0lucHV0U3RyZWFtRXhhbWluZWRMZW5ndGggPSBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aDtcbiAgICBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9IDA7XG4gICAgdmFyIHZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gICAgdmFyIGN1cnJlbnRMUiA9IG9yaWdQb3NJbmZvLmN1cnJlbnRMZWZ0UmVjdXJzaW9uO1xuICAgIHZhciBtZW1vS2V5ID0gdGhpcy50b01lbW9LZXkoKTtcbiAgICB2YXIgaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gY3VycmVudExSICYmIGN1cnJlbnRMUi5oZWFkQXBwbGljYXRpb24udG9NZW1vS2V5KCkgPT09IG1lbW9LZXk7XG4gICAgdmFyIG1lbW9SZWM7XG4gICAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICB2YWx1ZSA9IHRoaXMuZ3Jvd1NlZWRSZXN1bHQoYm9keSwgc3RhdGUsIG9yaWdQb3MsIGN1cnJlbnRMUiwgdmFsdWUpO1xuICAgICAgICBvcmlnUG9zSW5mby5lbmRMZWZ0UmVjdXJzaW9uKCk7XG4gICAgICAgIG1lbW9SZWMgPSBjdXJyZW50TFI7XG4gICAgICAgIG1lbW9SZWMuZXhhbWluZWRMZW5ndGggPSBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCAtIG9yaWdQb3M7XG4gICAgICAgIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9IHN0YXRlLl9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0KCk7XG4gICAgICAgIG9yaWdQb3NJbmZvLm1lbW9pemUobWVtb0tleSwgbWVtb1JlYyk7IC8vIHVwZGF0ZXMgb3JpZ1Bvc0luZm8ncyBtYXhFeGFtaW5lZExlbmd0aFxuICAgIH1cbiAgICBlbHNlIGlmICghY3VycmVudExSIHx8ICFjdXJyZW50TFIuaXNJbnZvbHZlZChtZW1vS2V5KSkge1xuICAgICAgICAvLyBUaGlzIGFwcGxpY2F0aW9uIGlzIG5vdCBpbnZvbHZlZCBpbiBsZWZ0IHJlY3Vyc2lvbiwgc28gaXQncyBvayB0byBtZW1vaXplIGl0LlxuICAgICAgICBtZW1vUmVjID0gb3JpZ1Bvc0luZm8ubWVtb2l6ZShtZW1vS2V5LCB7XG4gICAgICAgICAgICBtYXRjaExlbmd0aDogaW5wdXRTdHJlYW0ucG9zIC0gb3JpZ1BvcyxcbiAgICAgICAgICAgIGV4YW1pbmVkTGVuZ3RoOiBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCAtIG9yaWdQb3MsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICBmYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb246IHN0YXRlLmNsb25lUmVjb3JkZWRGYWlsdXJlcygpLFxuICAgICAgICAgICAgcmlnaHRtb3N0RmFpbHVyZU9mZnNldDogc3RhdGUuX2dldFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQoKVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgdmFyIHN1Y2NlZWRlZCA9ICEhdmFsdWU7XG4gICAgaWYgKGRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHN0YXRlLnBvcEZhaWx1cmVzSW5mbygpO1xuICAgICAgICBpZiAoIXN1Y2NlZWRlZCkge1xuICAgICAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1lbW9SZWMpIHtcbiAgICAgICAgICAgIG1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uID0gc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVjb3JkIHRyYWNlIGluZm9ybWF0aW9uIGluIHRoZSBtZW1vIHRhYmxlLCBzbyB0aGF0IGl0IGlzIGF2YWlsYWJsZSBpZiB0aGUgbWVtb2l6ZWQgcmVzdWx0XG4gICAgLy8gaXMgdXNlZCBsYXRlci5cbiAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkgJiYgbWVtb1JlYykge1xuICAgICAgICB2YXIgZW50cnkgPSBzdGF0ZS5nZXRUcmFjZUVudHJ5KG9yaWdQb3MsIHRoaXMsIHN1Y2NlZWRlZCwgc3VjY2VlZGVkID8gW3ZhbHVlXSA6IFtdKTtcbiAgICAgICAgaWYgKGlzSGVhZE9mTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgY29tbW9uLmFzc2VydChlbnRyeS50ZXJtaW5hdGluZ0xSRW50cnkgIT0gbnVsbCB8fCAhc3VjY2VlZGVkKTtcbiAgICAgICAgICAgIGVudHJ5LmlzSGVhZE9mTGVmdFJlY3Vyc2lvbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbWVtb1JlYy50cmFjZUVudHJ5ID0gZW50cnk7XG4gICAgfVxuICAgIC8vIEZpeCB0aGUgaW5wdXQgc3RyZWFtJ3MgZXhhbWluZWRMZW5ndGggLS0gaXQgc2hvdWxkIGJlIHRoZSBtYXhpbXVtIGV4YW1pbmVkIGxlbmd0aFxuICAgIC8vIGFjcm9zcyBhbGwgYXBwbGljYXRpb25zLCBub3QganVzdCB0aGlzIG9uZS5cbiAgICBpbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCA9IE1hdGgubWF4KGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoLCBvcmlnSW5wdXRTdHJlYW1FeGFtaW5lZExlbmd0aCk7XG4gICAgc3RhdGUuZXhpdEFwcGxpY2F0aW9uKG9yaWdQb3NJbmZvLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHN1Y2NlZWRlZDtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmV2YWxPbmNlID0gZnVuY3Rpb24gKGV4cHIsIHN0YXRlKSB7XG4gICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgdmFyIG9yaWdQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgaWYgKHN0YXRlLmV2YWwoZXhwcikpIHtcbiAgICAgICAgdmFyIGFyaXR5ID0gZXhwci5nZXRBcml0eSgpO1xuICAgICAgICB2YXIgYmluZGluZ3MgPSBzdGF0ZS5fYmluZGluZ3Muc3BsaWNlKHN0YXRlLl9iaW5kaW5ncy5sZW5ndGggLSBhcml0eSwgYXJpdHkpO1xuICAgICAgICB2YXIgb2Zmc2V0cyA9IHN0YXRlLl9iaW5kaW5nT2Zmc2V0cy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdPZmZzZXRzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIHJldHVybiBuZXcgTm9udGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHRoaXMucnVsZU5hbWUsIGJpbmRpbmdzLCBvZmZzZXRzLCBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5ncm93U2VlZFJlc3VsdCA9IGZ1bmN0aW9uIChib2R5LCBzdGF0ZSwgb3JpZ1BvcywgbHJNZW1vUmVjLCBuZXdWYWx1ZSkge1xuICAgIGlmICghbmV3VmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBsck1lbW9SZWMubWF0Y2hMZW5ndGggPSBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zO1xuICAgICAgICBsck1lbW9SZWMudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgbHJNZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbiA9IHN0YXRlLmNsb25lUmVjb3JkZWRGYWlsdXJlcygpO1xuICAgICAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgICAgICAgIC8vIEJlZm9yZSBldmFsdWF0aW5nIHRoZSBib2R5IGFnYWluLCBhZGQgYSB0cmFjZSBub2RlIGZvciB0aGlzIGFwcGxpY2F0aW9uIHRvIHRoZSBtZW1vIGVudHJ5LlxuICAgICAgICAgICAgLy8gSXRzIG9ubHkgY2hpbGQgaXMgYSBjb3B5IG9mIHRoZSB0cmFjZSBub2RlIGZyb20gYG5ld1ZhbHVlYCwgd2hpY2ggd2lsbCBhbHdheXMgYmUgdGhlIGxhc3RcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgaW4gYHN0YXRlLnRyYWNlYC5cbiAgICAgICAgICAgIHZhciBzZWVkVHJhY2UgPSBzdGF0ZS50cmFjZVtzdGF0ZS50cmFjZS5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGxyTWVtb1JlYy50cmFjZUVudHJ5ID0gbmV3IFRyYWNlKHN0YXRlLmlucHV0LCBvcmlnUG9zLCBpbnB1dFN0cmVhbS5wb3MsIHRoaXMsIHRydWUsIFtuZXdWYWx1ZV0sIFtzZWVkVHJhY2UuY2xvbmUoKV0pO1xuICAgICAgICB9XG4gICAgICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5ldmFsT25jZShib2R5LCBzdGF0ZSk7XG4gICAgICAgIGlmIChpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zIDw9IGxyTWVtb1JlYy5tYXRjaExlbmd0aCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICAgICAgICBzdGF0ZS50cmFjZS5zcGxpY2UoLTIsIDEpOyAvLyBEcm9wIHRoZSB0cmFjZSBmb3IgdGhlIG9sZCBzZWVkLlxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgICAgICAvLyBUaGUgbGFzdCBlbnRyeSBpcyBmb3IgYW4gdW51c2VkIHJlc3VsdCAtLSBwb3AgaXQgYW5kIHNhdmUgaXQgaW4gdGhlIFwicmVhbFwiIGVudHJ5LlxuICAgICAgICBsck1lbW9SZWMudHJhY2VFbnRyeS5yZWNvcmRMUlRlcm1pbmF0aW9uKHN0YXRlLnRyYWNlLnBvcCgpLCBuZXdWYWx1ZSk7XG4gICAgfVxuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3MgKyBsck1lbW9SZWMubWF0Y2hMZW5ndGg7XG4gICAgcmV0dXJuIGxyTWVtb1JlYy52YWx1ZTtcbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gICAgaWYgKGNoICYmIHRoaXMucGF0dGVybi50ZXN0KGNoKSkge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIGNoKSwgb3JpZ1Bvcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBmbGF0dGVuKGxpc3RPZkxpc3RzKSB7XG4gICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5jb25jYXQuYXBwbHkoW10sIGxpc3RPZkxpc3RzKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBjb21tb24uYWJzdHJhY3QoJ2dlbmVyYXRlRXhhbXBsZScpO1xuZnVuY3Rpb24gY2F0ZWdvcml6ZUV4YW1wbGVzKGV4YW1wbGVzKSB7XG4gICAgLy8gQSBsaXN0IG9mIHJ1bGVzIHRoYXQgdGhlIHN5c3RlbSBuZWVkcyBleGFtcGxlcyBvZiwgaW4gb3JkZXIgdG8gZ2VuZXJhdGUgYW4gZXhhbXBsZVxuICAgIC8vICAgZm9yIHRoZSBjdXJyZW50IHJ1bGVcbiAgICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlc1xuICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChleGFtcGxlKSB7IHJldHVybiBleGFtcGxlLmhhc093blByb3BlcnR5KCdleGFtcGxlc05lZWRlZCcpOyB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChleGFtcGxlKSB7IHJldHVybiBleGFtcGxlLmV4YW1wbGVzTmVlZGVkOyB9KTtcbiAgICBleGFtcGxlc05lZWRlZCA9IGZsYXR0ZW4oZXhhbXBsZXNOZWVkZWQpO1xuICAgIHZhciB1bmlxdWVFeGFtcGxlc05lZWRlZCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhhbXBsZXNOZWVkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGN1cnJlbnRFeGFtcGxlTmVlZGVkID0gZXhhbXBsZXNOZWVkZWRbaV07XG4gICAgICAgIHVuaXF1ZUV4YW1wbGVzTmVlZGVkW2N1cnJlbnRFeGFtcGxlTmVlZGVkXSA9IHRydWU7XG4gICAgfVxuICAgIGV4YW1wbGVzTmVlZGVkID0gT2JqZWN0LmtleXModW5pcXVlRXhhbXBsZXNOZWVkZWQpO1xuICAgIC8vIEEgbGlzdCBvZiBzdWNjZXNzZnVsbHkgZ2VuZXJhdGVkIGV4YW1wbGVzXG4gICAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGV4YW1wbGVzXG4gICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGV4YW1wbGUpIHsgcmV0dXJuIGV4YW1wbGUuaGFzT3duUHJvcGVydHkoJ3ZhbHVlJyk7IH0pXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuIGl0ZW0udmFsdWU7IH0pO1xuICAgIC8vIFRoaXMgZmxhZyByZXR1cm5zIHRydWUgaWYgdGhlIHN5c3RlbSBjYW5ub3QgZ2VuZXJhdGUgdGhlIHJ1bGUgaXQgaXMgY3VycmVudGx5XG4gICAgLy8gICBhdHRlbXB0aW5nIHRvIGdlbmVyYXRlLCByZWdhcmRsZXNzIG9mIHdoZXRoZXIgb3Igbm90IGl0IGhhcyB0aGUgZXhhbXBsZXMgaXQgbmVlZHMuXG4gICAgLy8gICBDdXJyZW50bHksIHRoaXMgaXMgb25seSB1c2VkIGluIG92ZXJyaWRpbmcgZ2VuZXJhdG9ycyB0byBwcmV2ZW50IHRoZSBzeXN0ZW0gZnJvbVxuICAgIC8vICAgZ2VuZXJhdGluZyBleGFtcGxlcyBmb3IgY2VydGFpbiBydWxlcyAoZS5nLiAnaWRlbnQnKS5cbiAgICB2YXIgbmVlZEhlbHAgPSBleGFtcGxlcy5zb21lKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLm5lZWRIZWxwOyB9KTtcbiAgICByZXR1cm4ge1xuICAgICAgICBleGFtcGxlc05lZWRlZDogZXhhbXBsZXNOZWVkZWQsXG4gICAgICAgIHN1Y2Nlc3NmdWxFeGFtcGxlczogc3VjY2Vzc2Z1bEV4YW1wbGVzLFxuICAgICAgICBuZWVkSGVscDogbmVlZEhlbHBcbiAgICB9O1xufVxucGV4cHJzLmFueS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHJldHVybiB7IHZhbHVlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSkpIH07XG59O1xuLy8gQXNzdW1lcyB0aGF0IHRlcm1pbmFsJ3Mgb2JqZWN0IGlzIGFsd2F5cyBhIHN0cmluZ1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB0aGlzLm9iaiB9O1xufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgICB2YXIgcmFuZ2VTaXplID0gdGhpcy50by5jaGFyQ29kZUF0KDApIC0gdGhpcy5mcm9tLmNoYXJDb2RlQXQoMCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5mcm9tLmNoYXJDb2RlQXQoMCkgKyBNYXRoLmZsb29yKHJhbmdlU2l6ZSAqIE1hdGgucmFuZG9tKCkpKVxuICAgIH07XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIC8vIGl0ZW1zIC0+IHRlcm1FeGFtcGxlc1xuICAgIHZhciB0ZXJtRXhhbXBsZXMgPSB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkge1xuICAgICAgICByZXR1cm4gdGVybS5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscyk7XG4gICAgfSk7XG4gICAgdmFyIGNhdGVnb3JpemVkRXhhbXBsZXMgPSBjYXRlZ29yaXplRXhhbXBsZXModGVybUV4YW1wbGVzKTtcbiAgICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBjYXRlZ29yaXplZEV4YW1wbGVzLmV4YW1wbGVzTmVlZGVkO1xuICAgIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBjYXRlZ29yaXplZEV4YW1wbGVzLnN1Y2Nlc3NmdWxFeGFtcGxlcztcbiAgICB2YXIgbmVlZEhlbHAgPSBjYXRlZ29yaXplZEV4YW1wbGVzLm5lZWRIZWxwO1xuICAgIHZhciBhbnMgPSB7fTtcbiAgICAvLyBBbHQgY2FuIGNvbnRhaW4gYm90aCBhbiBleGFtcGxlIGFuZCBhIHJlcXVlc3QgZm9yIGV4YW1wbGVzXG4gICAgaWYgKHN1Y2Nlc3NmdWxFeGFtcGxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBpID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc3VjY2Vzc2Z1bEV4YW1wbGVzLmxlbmd0aCk7XG4gICAgICAgIGFucy52YWx1ZSA9IHN1Y2Nlc3NmdWxFeGFtcGxlc1tpXTtcbiAgICB9XG4gICAgaWYgKGV4YW1wbGVzTmVlZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXNOZWVkZWQ7XG4gICAgfVxuICAgIGFucy5uZWVkSGVscCA9IG5lZWRIZWxwO1xuICAgIHJldHVybiBhbnM7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICB2YXIgZmFjdG9yRXhhbXBsZXMgPSB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uIChmYWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGZhY3Rvci5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscyk7XG4gICAgfSk7XG4gICAgdmFyIGNhdGVnb3JpemVkRXhhbXBsZXMgPSBjYXRlZ29yaXplRXhhbXBsZXMoZmFjdG9yRXhhbXBsZXMpO1xuICAgIHZhciBleGFtcGxlc05lZWRlZCA9IGNhdGVnb3JpemVkRXhhbXBsZXMuZXhhbXBsZXNOZWVkZWQ7XG4gICAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGNhdGVnb3JpemVkRXhhbXBsZXMuc3VjY2Vzc2Z1bEV4YW1wbGVzO1xuICAgIHZhciBuZWVkSGVscCA9IGNhdGVnb3JpemVkRXhhbXBsZXMubmVlZEhlbHA7XG4gICAgdmFyIGFucyA9IHt9O1xuICAgIC8vIEluIGEgU2VxLCBhbGwgcGllY2VzIG11c3Qgc3VjY2VlZCBpbiBvcmRlciB0byBoYXZlIGEgc3VjY2Vzc2Z1bCBleGFtcGxlLlxuICAgIGlmIChleGFtcGxlc05lZWRlZC5sZW5ndGggPiAwIHx8IG5lZWRIZWxwKSB7XG4gICAgICAgIGFucy5leGFtcGxlc05lZWRlZCA9IGV4YW1wbGVzTmVlZGVkO1xuICAgICAgICBhbnMubmVlZEhlbHAgPSBuZWVkSGVscDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFucy52YWx1ZSA9IHN1Y2Nlc3NmdWxFeGFtcGxlcy5qb2luKGluU3ludGFjdGljQ29udGV4dCA/ICcgJyA6ICcnKTtcbiAgICB9XG4gICAgcmV0dXJuIGFucztcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICB2YXIgcmFuZ2VUaW1lcyA9IE1hdGgubWluKHRoaXMubWF4TnVtTWF0Y2hlcyAtIHRoaXMubWluTnVtTWF0Y2hlcywgMyk7XG4gICAgdmFyIG51bVRpbWVzID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKHJhbmdlVGltZXMgKyAxKSArIHRoaXMubWluTnVtTWF0Y2hlcyk7XG4gICAgdmFyIGl0ZW1zID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW1UaW1lczsgaSsrKSB7XG4gICAgICAgIGl0ZW1zLnB1c2godGhpcy5leHByLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSk7XG4gICAgfVxuICAgIHZhciBjYXRlZ29yaXplZEV4YW1wbGVzID0gY2F0ZWdvcml6ZUV4YW1wbGVzKGl0ZW1zKTtcbiAgICB2YXIgZXhhbXBsZXNOZWVkZWQgPSBjYXRlZ29yaXplZEV4YW1wbGVzLmV4YW1wbGVzTmVlZGVkO1xuICAgIHZhciBzdWNjZXNzZnVsRXhhbXBsZXMgPSBjYXRlZ29yaXplZEV4YW1wbGVzLnN1Y2Nlc3NmdWxFeGFtcGxlcztcbiAgICB2YXIgYW5zID0ge307XG4gICAgLy8gSXQncyBhbHdheXMgZWl0aGVyIG9uZSBvciB0aGUgb3RoZXIuXG4gICAgLy8gVE9ETzogaW5zdGVhZCBvZiAnICcsIGNhbGwgJ3NwYWNlcy5nZW5lcmF0ZUV4YW1wbGUoKSdcbiAgICBhbnMudmFsdWUgPSBzdWNjZXNzZnVsRXhhbXBsZXMuam9pbihpblN5bnRhY3RpY0NvbnRleHQgPyAnICcgOiAnJyk7XG4gICAgaWYgKGV4YW1wbGVzTmVlZGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXNOZWVkZWQ7XG4gICAgfVxuICAgIHJldHVybiBhbnM7XG59O1xuLy8gUmlnaHQgbm93LCAnTm90JyBhbmQgJ0xvb2thaGVhZCcgZ2VuZXJhdGUgbm90aGluZyBhbmQgYXNzdW1lIHRoYXQgd2hhdGV2ZXIgZm9sbG93cyB3aWxsXG4vLyAgIHdvcmsgYWNjb3JkaW5nIHRvIHRoZSBlbmNvZGVkIGNvbnN0cmFpbnRzLlxucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogJycgfTtcbn07XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICAgIHJldHVybiB7IHZhbHVlOiAnJyB9O1xufTtcbnBleHBycy5MZXgucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci5nZW5lcmF0ZUV4YW1wbGUoZ3JhbW1hciwgZXhhbXBsZXMsIGZhbHNlLCBhY3R1YWxzKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgdmFyIGFucyA9IHt9O1xuICAgIHZhciBydWxlTmFtZSA9IHRoaXMuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKS50b1N0cmluZygpO1xuICAgIGlmICghZXhhbXBsZXMuaGFzT3duUHJvcGVydHkocnVsZU5hbWUpKSB7XG4gICAgICAgIGFucy5leGFtcGxlc05lZWRlZCA9IFtydWxlTmFtZV07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgcmVsZXZhbnRFeGFtcGxlcyA9IGV4YW1wbGVzW3J1bGVOYW1lXTtcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByZWxldmFudEV4YW1wbGVzLmxlbmd0aCk7XG4gICAgICAgIGFucy52YWx1ZSA9IHJlbGV2YW50RXhhbXBsZXNbaV07XG4gICAgfVxuICAgIHJldHVybiBhbnM7XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHZhciBjaGFyO1xuICAgIHN3aXRjaCAodGhpcy5jYXRlZ29yeSkge1xuICAgICAgICBjYXNlICdMdSc6XG4gICAgICAgICAgICBjaGFyID0gJ8OBJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMbCc6XG4gICAgICAgICAgICBjaGFyID0gJ8WPJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMdCc6XG4gICAgICAgICAgICBjaGFyID0gJ8eFJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMbSc6XG4gICAgICAgICAgICBjaGFyID0gJ8uuJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMbyc6XG4gICAgICAgICAgICBjaGFyID0gJ8a7JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdObCc6XG4gICAgICAgICAgICBjaGFyID0gJ+KGgic7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTmQnOlxuICAgICAgICAgICAgY2hhciA9ICfCvSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTW4nOlxuICAgICAgICAgICAgY2hhciA9ICdcXHUwNDg3JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdNYyc6XG4gICAgICAgICAgICBjaGFyID0gJ+Ckvyc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnUGMnOlxuICAgICAgICAgICAgY2hhciA9ICfigYAnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ1pzJzpcbiAgICAgICAgICAgIGNoYXIgPSAnXFx1MjAwMSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnTCc6XG4gICAgICAgICAgICBjaGFyID0gJ8OBJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMdG1vJzpcbiAgICAgICAgICAgIGNoYXIgPSAnx4UnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB7IHZhbHVlOiBjaGFyIH07IC8vIPCfkqlcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBjb21tb24uYWJzdHJhY3QoJ2dldEFyaXR5Jyk7XG5wZXhwcnMuYW55LmdldEFyaXR5ID1cbiAgICBwZXhwcnMuZW5kLmdldEFyaXR5ID1cbiAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdldEFyaXR5ID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmdldEFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkFwcGx5LnByb3RvdHlwZS5nZXRBcml0eSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmdldEFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBUaGlzIGlzIG9rIGIvYyBhbGwgdGVybXMgbXVzdCBoYXZlIHRoZSBzYW1lIGFyaXR5IC0tIHRoaXMgcHJvcGVydHkgaXNcbiAgICAvLyBjaGVja2VkIGJ5IHRoZSBHcmFtbWFyIGNvbnN0cnVjdG9yLlxuICAgIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCA/IDAgOiB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFyaXR5ID0gMDtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBhcml0eSArPSB0aGlzLmZhY3RvcnNbaWR4XS5nZXRBcml0eSgpO1xuICAgIH1cbiAgICByZXR1cm4gYXJpdHk7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gMDtcbn07XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5nZXRBcml0eSA9IHBleHBycy5MZXgucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIuZ2V0QXJpdHkoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIENhbGxlZCBhdCBncmFtbWFyIGNyZWF0aW9uIHRpbWUgdG8gcmV3cml0ZSBhIHJ1bGUgYm9keSwgcmVwbGFjaW5nIGVhY2ggcmVmZXJlbmNlIHRvIGEgZm9ybWFsXG4gIHBhcmFtZXRlciB3aXRoIGEgYFBhcmFtYCBub2RlLiBSZXR1cm5zIGEgUEV4cHIgLS0gZWl0aGVyIGEgbmV3IG9uZSwgb3IgdGhlIG9yaWdpbmFsIG9uZSBpZlxuICBpdCB3YXMgbW9kaWZpZWQgaW4gcGxhY2UuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBjb21tb24uYWJzdHJhY3QoJ2ludHJvZHVjZVBhcmFtcycpO1xucGV4cHJzLmFueS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgIHBleHBycy5lbmQuaW50cm9kdWNlUGFyYW1zID1cbiAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGZvcm1hbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgIHRoaXMudGVybXMuZm9yRWFjaChmdW5jdGlvbiAodGVybSwgaWR4LCB0ZXJtcykge1xuICAgICAgICB0ZXJtc1tpZHhdID0gdGVybS5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID0gZnVuY3Rpb24gKGZvcm1hbHMpIHtcbiAgICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoZmFjdG9yLCBpZHgsIGZhY3RvcnMpIHtcbiAgICAgICAgZmFjdG9yc1tpZHhdID0gZmFjdG9yLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuaW50cm9kdWNlUGFyYW1zID1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHIgPSB0aGlzLmV4cHIuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgIHZhciBpbmRleCA9IGZvcm1hbHMuaW5kZXhPZih0aGlzLnJ1bGVOYW1lKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIHN1cHBvcnRlZD8gU2VlIGlzc3VlICM2NC5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyaXplZCBydWxlcyBjYW5ub3QgYmUgcGFzc2VkIGFzIGFyZ3VtZW50cyB0byBhbm90aGVyIHJ1bGUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuUGFyYW0oaW5kZXgpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZywgaWR4LCBhcmdzKSB7XG4gICAgICAgICAgICBhcmdzW2lkeF0gPSBhcmcuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBwYXJzaW5nIGV4cHJlc3Npb24gbWF5IGFjY2VwdCB3aXRob3V0IGNvbnN1bWluZyBhbnkgaW5wdXQuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmlzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHJldHVybiB0aGlzLl9pc051bGxhYmxlKGdyYW1tYXIsIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcbnBleHBycy5QRXhwci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBjb21tb24uYWJzdHJhY3QoJ19pc051bGxhYmxlJyk7XG5wZXhwcnMuYW55Ll9pc051bGxhYmxlID1cbiAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICBwZXhwcnMuUGx1cy5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLmVuZC5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgLy8gVGhpcyBpcyBhbiBvdmVyLXNpbXBsaWZpY2F0aW9uOiBpdCdzIG9ubHkgY29ycmVjdCBpZiB0aGUgaW5wdXQgaXMgYSBzdHJpbmcuIElmIGl0J3MgYW4gYXJyYXlcbiAgICAgICAgLy8gb3IgYW4gb2JqZWN0LCB0aGVuIHRoZSBlbXB0eSBzdHJpbmcgcGFyc2luZyBleHByZXNzaW9uIGlzIG5vdCBudWxsYWJsZS5cbiAgICAgICAgcmV0dXJuIHRoaXMub2JqID09PSAnJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnRlcm1zLnNvbWUoZnVuY3Rpb24gKHRlcm0pIHsgcmV0dXJuIHRlcm0uX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy5mYWN0b3JzLmV2ZXJ5KGZ1bmN0aW9uIChmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci5faXNOdWxsYWJsZShncmFtbWFyLCBtZW1vKTsgfSk7XG59O1xucGV4cHJzLlN0YXIucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICBwZXhwcnMuT3B0LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkxleC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLmV4cHIuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgdmFyIGtleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtbywga2V5KSkge1xuICAgICAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV0uYm9keTtcbiAgICAgICAgdmFyIGlubGluZWQgPSBib2R5LnN1YnN0aXR1dGVQYXJhbXModGhpcy5hcmdzKTtcbiAgICAgICAgbWVtb1trZXldID0gZmFsc2U7IC8vIFByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uIGZvciByZWN1cnNpdmUgcnVsZXMuXG4gICAgICAgIG1lbW9ba2V5XSA9IGlubGluZWQuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vW2tleV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBnZXRNZXRhSW5mbyhleHByLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgICBpZiAoZXhwci5zb3VyY2UgJiYgZ3JhbW1hckludGVydmFsKSB7XG4gICAgICAgIHZhciBhZGp1c3RlZCA9IGV4cHIuc291cmNlLnJlbGF0aXZlVG8oZ3JhbW1hckludGVydmFsKTtcbiAgICAgICAgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwgPSBbYWRqdXN0ZWQuc3RhcnRJZHgsIGFkanVzdGVkLmVuZElkeF07XG4gICAgfVxuICAgIHJldHVybiBtZXRhSW5mbztcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3QoJ291dHB1dFJlY2lwZScpO1xucGV4cHJzLmFueS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnYW55JywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnZW5kJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsndGVybWluYWwnLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLm9ial07XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsncmFuZ2UnLCBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLCB0aGlzLmZyb20sIHRoaXMudG9dO1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ3BhcmFtJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSwgdGhpcy5pbmRleF07XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ2FsdCcsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCldLmNvbmNhdCh0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gdGVybS5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTsgfSkpO1xufTtcbnBleHBycy5FeHRlbmQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICB2YXIgZXh0ZW5zaW9uID0gdGhpcy50ZXJtc1swXTsgLy8gW2V4dGVuc2lvbiwgb3JpZ2luYWxdXG4gICAgcmV0dXJuIGV4dGVuc2lvbi5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTtcbn07XG5wZXhwcnMuU3BsaWNlLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgdmFyIGJlZm9yZVRlcm1zID0gdGhpcy50ZXJtcy5zbGljZSgwLCB0aGlzLmV4cGFuc2lvblBvcyk7XG4gICAgdmFyIGFmdGVyVGVybXMgPSB0aGlzLnRlcm1zLnNsaWNlKHRoaXMuZXhwYW5zaW9uUG9zICsgMSk7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgJ3NwbGljZScsXG4gICAgICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgICAgIGJlZm9yZVRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gdGVybS5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTsgfSksXG4gICAgICAgIGFmdGVyVGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiB0ZXJtLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpOyB9KVxuICAgIF07XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ3NlcScsIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCldLmNvbmNhdCh0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uIChmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTsgfSkpO1xufTtcbnBleHBycy5TdGFyLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxuICAgIHBleHBycy5QbHVzLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxuICAgICAgICBwZXhwcnMuT3B0LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxuICAgICAgICAgICAgcGV4cHJzLk5vdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPVxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IubmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV4cHIub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbXG4gICAgICAgICdhcHAnLFxuICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgICAgICB0aGlzLnJ1bGVOYW1lLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKTsgfSlcbiAgICBdO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbJ3VuaWNvZGVDaGFyJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSwgdGhpcy5jYXRlZ29yeV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBSZXR1cm5zIGEgUEV4cHIgdGhhdCByZXN1bHRzIGZyb20gcmVjdXJzaXZlbHkgcmVwbGFjaW5nIGV2ZXJ5IGZvcm1hbCBwYXJhbWV0ZXIgKGkuZS4sIGluc3RhbmNlXG4gIG9mIGBQYXJhbWApIGluc2lkZSB0aGlzIFBFeHByIHdpdGggaXRzIGFjdHVhbCB2YWx1ZSBmcm9tIGBhY3R1YWxzYCAoYW4gQXJyYXkpLlxuXG4gIFRoZSByZWNlaXZlciBtdXN0IG5vdCBiZSBtb2RpZmllZDsgYSBuZXcgUEV4cHIgbXVzdCBiZSByZXR1cm5lZCBpZiBhbnkgcmVwbGFjZW1lbnQgaXMgbmVjZXNzYXJ5LlxuKi9cbi8vIGZ1bmN0aW9uKGFjdHVhbHMpIHsgLi4uIH1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnc3Vic3RpdHV0ZVBhcmFtcycpO1xucGV4cHJzLmFueS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICBwZXhwcnMuZW5kLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFsdCh0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gdGVybS5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KSk7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuU2VxKHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGFjdHVhbHMpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbiAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gZnVuY3Rpb24gKGFjdHVhbHMpIHtcbiAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBBdm9pZCBtYWtpbmcgYSBjb3B5IG9mIHRoaXMgYXBwbGljYXRpb24sIGFzIGFuIG9wdGltaXphdGlvblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBhcmdzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7IHJldHVybiBhcmcuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTsgfSk7XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHRoaXMucnVsZU5hbWUsIGFyZ3MpO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgY29weVdpdGhvdXREdXBsaWNhdGVzID0gY29tbW9uLmNvcHlXaXRob3V0RHVwbGljYXRlcztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKHN0cikge1xuICAgIHJldHVybiAvXlthLXpBLVpfJF1bMC05YS16QS1aXyRdKiQvLnRlc3Qoc3RyKTtcbn1cbmZ1bmN0aW9uIHJlc29sdmVEdXBsaWNhdGVkTmFtZXMoYXJndW1lbnROYW1lTGlzdCkge1xuICAgIC8vIGBjb3VudGAgaXMgdXNlZCB0byByZWNvcmQgdGhlIG51bWJlciBvZiB0aW1lcyBlYWNoIGFyZ3VtZW50IG5hbWUgb2NjdXJzIGluIHRoZSBsaXN0LFxuICAgIC8vIHRoaXMgaXMgdXNlZnVsIGZvciBjaGVja2luZyBkdXBsaWNhdGVkIGFyZ3VtZW50IG5hbWUuIEl0IG1hcHMgYXJndW1lbnQgbmFtZXMgdG8gaW50cy5cbiAgICB2YXIgY291bnQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIGFyZ3VtZW50TmFtZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoYXJnTmFtZSkge1xuICAgICAgICBjb3VudFthcmdOYW1lXSA9IChjb3VudFthcmdOYW1lXSB8fCAwKSArIDE7XG4gICAgfSk7XG4gICAgLy8gQXBwZW5kIHN1YnNjcmlwdHMgKCdfMScsICdfMicsIC4uLikgdG8gZHVwbGljYXRlIGFyZ3VtZW50IG5hbWVzLlxuICAgIE9iamVjdC5rZXlzKGNvdW50KS5mb3JFYWNoKGZ1bmN0aW9uIChkdXBBcmdOYW1lKSB7XG4gICAgICAgIGlmIChjb3VudFtkdXBBcmdOYW1lXSA8PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gVGhpcyBuYW1lIHNob3dzIHVwIG1vcmUgdGhhbiBvbmNlLCBzbyBhZGQgc3Vic2NyaXB0cy5cbiAgICAgICAgdmFyIHN1YnNjcmlwdCA9IDE7XG4gICAgICAgIGFyZ3VtZW50TmFtZUxpc3QuZm9yRWFjaChmdW5jdGlvbiAoYXJnTmFtZSwgaWR4KSB7XG4gICAgICAgICAgICBpZiAoYXJnTmFtZSA9PT0gZHVwQXJnTmFtZSkge1xuICAgICAgICAgICAgICAgIGFyZ3VtZW50TmFtZUxpc3RbaWR4XSA9IGFyZ05hbWUgKyAnXycgKyBzdWJzY3JpcHQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIFJldHVybnMgYSBsaXN0IG9mIHN0cmluZ3MgdGhhdCB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgYXJndW1lbnQgbmFtZXMgZm9yIGl0cyByZWNlaXZlclxuICAoYSBwZXhwcikgaW4gYSBzZW1hbnRpYyBhY3Rpb24uIFRoaXMgaXMgdXNlZCBleGNsdXNpdmVseSBieSB0aGUgU2VtYW50aWNzIEVkaXRvci5cblxuICBgZmlyc3RBcmdJbmRleGAgaXMgdGhlIDEtYmFzZWQgaW5kZXggb2YgdGhlIGZpcnN0IGFyZ3VtZW50IG5hbWUgdGhhdCB3aWxsIGJlIGdlbmVyYXRlZCBmb3IgdGhpc1xuICBwZXhwci4gSXQgZW5hYmxlcyB1cyB0byBuYW1lIGFyZ3VtZW50cyBwb3NpdGlvbmFsbHksIGUuZy4sIGlmIHRoZSBzZWNvbmQgYXJndW1lbnQgaXMgYVxuICBub24tYWxwaGFudW1lcmljIHRlcm1pbmFsIGxpa2UgXCIrXCIsIGl0IHdpbGwgYmUgbmFtZWQgJyQyJy5cblxuICBgbm9EdXBDaGVja2AgaXMgdHJ1ZSBpZiB0aGUgY2FsbGVyIG9mIGB0b0FyZ3VtZW50TmFtZUxpc3RgIGlzIG5vdCBhIHRvcCBsZXZlbCBjYWxsZXIuIEl0IGVuYWJsZXNcbiAgdXMgdG8gYXZvaWQgbmVzdGVkIGR1cGxpY2F0aW9uIHN1YnNjcmlwdHMgYXBwZW5kaW5nLCBlLmcuLCAnXzFfMScsICdfMV8yJywgYnkgb25seSBjaGVja2luZ1xuICBkdXBsaWNhdGVzIGF0IHRoZSB0b3AgbGV2ZWwuXG5cbiAgSGVyZSBpcyBhIG1vcmUgZWxhYm9yYXRlIGV4YW1wbGUgdGhhdCBpbGx1c3RyYXRlcyBob3cgdGhpcyBtZXRob2Qgd29ya3M6XG4gIGAoYSBcIitcIiBiKS50b0FyZ3VtZW50TmFtZUxpc3QoMSlgIGV2YWx1YXRlcyB0byBgWydhJywgJyQyJywgJ2InXWAgd2l0aCB0aGUgZm9sbG93aW5nIHJlY3Vyc2l2ZVxuICBjYWxsczpcblxuICAgIChhKS50b0FyZ3VtZW50TmFtZUxpc3QoMSkgLT4gWydhJ10sXG4gICAgKFwiK1wiKS50b0FyZ3VtZW50TmFtZUxpc3QoMikgLT4gWyckMiddLFxuICAgIChiKS50b0FyZ3VtZW50TmFtZUxpc3QoMykgLT4gWydiJ11cblxuICBOb3RlczpcbiAgKiBUaGlzIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIG9uIHdlbGwtZm9ybWVkIGV4cHJlc3Npb25zLCBlLmcuLCB0aGUgcmVjZWl2ZXIgbXVzdFxuICAgIG5vdCBoYXZlIGFueSBBbHQgc3ViLWV4cHJlc3Npb25zIHdpdGggaW5jb25zaXN0ZW50IGFyaXRpZXMuXG4gICogZS5nZXRBcml0eSgpID09PSBlLnRvQXJndW1lbnROYW1lTGlzdCgxKS5sZW5ndGhcbiovXG4vLyBmdW5jdGlvbihmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7IC4uLiB9XG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGNvbW1vbi5hYnN0cmFjdCgndG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5wZXhwcnMuYW55LnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFsnYW55J107XG59O1xucGV4cHJzLmVuZC50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiBbJ2VuZCddO1xufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub2JqID09PSAnc3RyaW5nJyAmJiAvXltfYS16QS1aMC05XSskLy50ZXN0KHRoaXMub2JqKSkge1xuICAgICAgICAvLyBJZiB0aGlzIHRlcm1pbmFsIGlzIGEgdmFsaWQgc3VmZml4IGZvciBhIEpTIGlkZW50aWZpZXIsIGp1c3QgcHJlcGVuZCBpdCB3aXRoICdfJ1xuICAgICAgICByZXR1cm4gWydfJyArIHRoaXMub2JqXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSwgbmFtZSBpdCBwb3NpdGlvbmFsbHkuXG4gICAgICAgIHJldHVybiBbJyQnICsgZmlyc3RBcmdJbmRleF07XG4gICAgfVxufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICB2YXIgYXJnTmFtZSA9IHRoaXMuZnJvbSArICdfdG9fJyArIHRoaXMudG87XG4gICAgLy8gSWYgdGhlIGBhcmdOYW1lYCBpcyBub3QgdmFsaWQgdGhlbiB0cnkgdG8gcHJlcGVuZCBhIGBfYC5cbiAgICBpZiAoIWlzUmVzdHJpY3RlZEpTSWRlbnRpZmllcihhcmdOYW1lKSkge1xuICAgICAgICBhcmdOYW1lID0gJ18nICsgYXJnTmFtZTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIGBhcmdOYW1lYCBzdGlsbCBub3QgdmFsaWQgYWZ0ZXIgcHJlcGVuZGluZyBhIGBfYCwgdGhlbiBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICBpZiAoIWlzUmVzdHJpY3RlZEpTSWRlbnRpZmllcihhcmdOYW1lKSkge1xuICAgICAgICBhcmdOYW1lID0gJyQnICsgZmlyc3RBcmdJbmRleDtcbiAgICB9XG4gICAgcmV0dXJuIFthcmdOYW1lXTtcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIC8vIGB0ZXJtQXJnTmFtZUxpc3RzYCBpcyBhbiBhcnJheSBvZiBhcnJheXMgd2hlcmUgZWFjaCByb3cgaXMgdGhlXG4gICAgLy8gYXJndW1lbnQgbmFtZSBsaXN0IHRoYXQgY29ycmVzcG9uZHMgdG8gYSB0ZXJtIGluIHRoaXMgYWx0ZXJuYXRpb24uXG4gICAgdmFyIHRlcm1BcmdOYW1lTGlzdHMgPSB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkge1xuICAgICAgICByZXR1cm4gdGVybS50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgdHJ1ZSk7XG4gICAgfSk7XG4gICAgdmFyIGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgICB2YXIgbnVtQXJncyA9IHRlcm1BcmdOYW1lTGlzdHNbMF0ubGVuZ3RoO1xuICAgIGZvciAodmFyIGNvbElkeCA9IDA7IGNvbElkeCA8IG51bUFyZ3M7IGNvbElkeCsrKSB7XG4gICAgICAgIHZhciBjb2wgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgcm93SWR4ID0gMDsgcm93SWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IHJvd0lkeCsrKSB7XG4gICAgICAgICAgICBjb2wucHVzaCh0ZXJtQXJnTmFtZUxpc3RzW3Jvd0lkeF1bY29sSWR4XSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHVuaXF1ZU5hbWVzID0gY29weVdpdGhvdXREdXBsaWNhdGVzKGNvbCk7XG4gICAgICAgIGFyZ3VtZW50TmFtZUxpc3QucHVzaCh1bmlxdWVOYW1lcy5qb2luKCdfb3JfJykpO1xuICAgIH1cbiAgICBpZiAoIW5vRHVwQ2hlY2spIHtcbiAgICAgICAgcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3VtZW50TmFtZUxpc3Q7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICAvLyBHZW5lcmF0ZSB0aGUgYXJndW1lbnQgbmFtZSBsaXN0LCB3aXRob3V0IHdvcnJ5aW5nIGFib3V0IGR1cGxpY2F0ZXMuXG4gICAgdmFyIGFyZ3VtZW50TmFtZUxpc3QgPSBbXTtcbiAgICB0aGlzLmZhY3RvcnMuZm9yRWFjaChmdW5jdGlvbiAoZmFjdG9yKSB7XG4gICAgICAgIHZhciBmYWN0b3JBcmd1bWVudE5hbWVMaXN0ID0gZmFjdG9yLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCB0cnVlKTtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdCA9IGFyZ3VtZW50TmFtZUxpc3QuY29uY2F0KGZhY3RvckFyZ3VtZW50TmFtZUxpc3QpO1xuICAgICAgICAvLyBTaGlmdCB0aGUgZmlyc3RBcmdJbmRleCB0byB0YWtlIHRoaXMgZmFjdG9yJ3MgYXJndW1lbnQgbmFtZXMgaW50byBhY2NvdW50LlxuICAgICAgICBmaXJzdEFyZ0luZGV4ICs9IGZhY3RvckFyZ3VtZW50TmFtZUxpc3QubGVuZ3RoO1xuICAgIH0pO1xuICAgIGlmICghbm9EdXBDaGVjaykge1xuICAgICAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IHRoaXMuZXhwclxuICAgICAgICAudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGV4cHJBcmd1bWVudFN0cmluZykge1xuICAgICAgICByZXR1cm4gZXhwckFyZ3VtZW50U3RyaW5nW2V4cHJBcmd1bWVudFN0cmluZy5sZW5ndGggLSAxXSA9PT0gJ3MnXG4gICAgICAgICAgICA/IGV4cHJBcmd1bWVudFN0cmluZyArICdlcydcbiAgICAgICAgICAgIDogZXhwckFyZ3VtZW50U3RyaW5nICsgJ3MnO1xuICAgIH0pO1xuICAgIGlmICghbm9EdXBDaGVjaykge1xuICAgICAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5wZXhwcnMuT3B0LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiB0aGlzLmV4cHIudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spLm1hcChmdW5jdGlvbiAoYXJnTmFtZSkge1xuICAgICAgICByZXR1cm4gJ29wdCcgKyBhcmdOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBhcmdOYW1lLnNsaWNlKDEpO1xuICAgIH0pO1xufTtcbnBleHBycy5Ob3QucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFtdO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IHBleHBycy5MZXgucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9XG4gICAgZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwci50b0FyZ3VtZW50TmFtZUxpc3QoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjayk7XG4gICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gW3RoaXMucnVsZU5hbWVdO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gWyckJyArIGZpcnN0QXJnSW5kZXhdO1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gWydwYXJhbScgKyB0aGlzLmluZGV4XTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFJldHVybnMgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBQRXhwciwgZm9yIHVzZSBhcyBhIFVJIGxhYmVsLCBldGMuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGNvbW1vbi5hYnN0cmFjdCgndG9EaXNwbGF5U3RyaW5nJyk7XG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBwZXhwcnMuU2VxLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc291cmNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNvdXJjZS50cmltbWVkKCkuY29udGVudHM7XG4gICAgfVxuICAgIHJldHVybiAnWycgKyB0aGlzLmNvbnN0cnVjdG9yLm5hbWUgKyAnXSc7XG59O1xucGV4cHJzLmFueS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgIHBleHBycy5lbmQudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgcGV4cHJzLkl0ZXIucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICBwZXhwcnMuTm90LnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5MZXgucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHBzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7IHJldHVybiBhcmcudG9EaXNwbGF5U3RyaW5nKCk7IH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlTmFtZSArICc8JyArIHBzLmpvaW4oJywnKSArICc+JztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lO1xuICAgIH1cbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ1VuaWNvZGUgWycgKyB0aGlzLmNhdGVnb3J5ICsgJ10gY2hhcmFjdGVyJztcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBGYWlsdXJlID0gcmVxdWlyZSgnLi9GYWlsdXJlJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvRmFpbHVyZSA9IGNvbW1vbi5hYnN0cmFjdCgndG9GYWlsdXJlJyk7XG5wZXhwcnMuYW55LnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdhbnkgb2JqZWN0JywgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLmVuZC50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCAnZW5kIG9mIGlucHV0JywgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCB0aGlzLm9iaiwgJ3N0cmluZycpO1xufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAvLyBUT0RPOiBjb21lIHVwIHdpdGggc29tZXRoaW5nIGJldHRlclxuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pLCAnY29kZScpO1xufTtcbnBleHBycy5Ob3QucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gdGhpcy5leHByID09PSBwZXhwcnMuYW55ID8gJ25vdGhpbmcnIDogJ25vdCAnICsgdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKTtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIHRoaXMuZXhwci50b0ZhaWx1cmUoZ3JhbW1hcik7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV0uZGVzY3JpcHRpb247XG4gICAgaWYgKCFkZXNjcmlwdGlvbikge1xuICAgICAgICB2YXIgYXJ0aWNsZSA9IC9eW2FlaW91QUVJT1VdLy50ZXN0KHRoaXMucnVsZU5hbWUpID8gJ2FuJyA6ICdhJztcbiAgICAgICAgZGVzY3JpcHRpb24gPSBhcnRpY2xlICsgJyAnICsgdGhpcy5ydWxlTmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdhIFVuaWNvZGUgWycgKyB0aGlzLmNhdGVnb3J5ICsgJ10gY2hhcmFjdGVyJywgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICB2YXIgZnMgPSB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodCkgeyByZXR1cm4gdC50b0ZhaWx1cmUoZ3JhbW1hcik7IH0pO1xuICAgIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIGZzLmpvaW4oJyBvciAnKSArICcpJztcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdmFyIGZzID0gdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbiAoZikgeyByZXR1cm4gZi50b0ZhaWx1cmUoZ3JhbW1hcik7IH0pO1xuICAgIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIGZzLmpvaW4oJyAnKSArICcpJztcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHZhciBkZXNjcmlwdGlvbiA9ICcoJyArIHRoaXMuZXhwci50b0ZhaWx1cmUoZ3JhbW1hcikgKyB0aGlzLm9wZXJhdG9yICsgJyknO1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBlMS50b1N0cmluZygpID09PSBlMi50b1N0cmluZygpID09PiBlMSBhbmQgZTIgYXJlIHNlbWFudGljYWxseSBlcXVpdmFsZW50LlxuICBOb3RlIHRoYXQgdGhpcyBpcyBub3QgYW4gaWZmICg8PT0+KTogZS5nLixcbiAgKH5cImJcIiBcImFcIikudG9TdHJpbmcoKSAhPT0gKFwiYVwiKS50b1N0cmluZygpLCBldmVuIHRob3VnaFxuICB+XCJiXCIgXCJhXCIgYW5kIFwiYVwiIGFyZSBpbnRlcmNoYW5nZWFibGUgaW4gYW55IGdyYW1tYXIsXG4gIGJvdGggaW4gdGVybXMgb2YgdGhlIGxhbmd1YWdlcyB0aGV5IGFjY2VwdCBhbmQgdGhlaXIgYXJpdGllcy5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLnRvU3RyaW5nID0gY29tbW9uLmFic3RyYWN0KCd0b1N0cmluZycpO1xucGV4cHJzLmFueS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ2FueSc7XG59O1xucGV4cHJzLmVuZC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ2VuZCc7XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5vYmopO1xufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byk7XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyQnICsgdGhpcy5pbmRleDtcbn07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJyMoJyArIHRoaXMuZXhwci50b1N0cmluZygpICsgJyknO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRlcm1zLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IHRoaXMudGVybXNbMF0udG9TdHJpbmcoKVxuICAgICAgICA6ICcoJyArIHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiB0ZXJtLnRvU3RyaW5nKCk7IH0pLmpvaW4oJyB8ICcpICsgJyknO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmZhY3RvcnMubGVuZ3RoID09PSAxXG4gICAgICAgID8gdGhpcy5mYWN0b3JzWzBdLnRvU3RyaW5nKClcbiAgICAgICAgOiAnKCcgKyB0aGlzLmZhY3RvcnMubWFwKGZ1bmN0aW9uIChmYWN0b3IpIHsgcmV0dXJuIGZhY3Rvci50b1N0cmluZygpOyB9KS5qb2luKCcgJykgKyAnKSc7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmV4cHIgKyB0aGlzLm9wZXJhdG9yO1xufTtcbnBleHBycy5Ob3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnficgKyB0aGlzLmV4cHI7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcmJyArIHRoaXMuZXhwcjtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgcHMgPSB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy50b1N0cmluZygpOyB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZU5hbWUgKyAnPCcgKyBwcy5qb2luKCcsJykgKyAnPic7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ydWxlTmFtZTtcbiAgICB9XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ1xcXFxweycgKyB0aGlzLmNhdGVnb3J5ICsgJ30nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19zcHJlYWRBcnJheXMgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXlzKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxuICAgICAgICBmb3IgKHZhciBhID0gYXJndW1lbnRzW2ldLCBqID0gMCwgamwgPSBhLmxlbmd0aDsgaiA8IGpsOyBqKyssIGsrKylcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xuICAgIHJldHVybiByO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIFVuaWNvZGVDYXRlZ29yaWVzID0gcmVxdWlyZSgnLi4vdGhpcmRfcGFydHkvVW5pY29kZUNhdGVnb3JpZXMnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHZW5lcmFsIHN0dWZmXG52YXIgUEV4cHIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUEV4cHIoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yID09PSBQRXhwcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUEV4cHIgY2Fubm90IGJlIGluc3RhbnRpYXRlZCAtLSBpdCdzIGFic3RyYWN0XCIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFNldCB0aGUgYHNvdXJjZWAgcHJvcGVydHkgdG8gdGhlIGludGVydmFsIGNvbnRhaW5pbmcgdGhlIHNvdXJjZSBmb3IgdGhpcyBleHByZXNzaW9uLlxuICAgIFBFeHByLnByb3RvdHlwZS53aXRoU291cmNlID0gZnVuY3Rpb24gKGludGVydmFsKSB7XG4gICAgICAgIGlmIChpbnRlcnZhbCkge1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBpbnRlcnZhbC50cmltbWVkKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICByZXR1cm4gUEV4cHI7XG59KCkpO1xuLy8gQW55XG52YXIgYW55ID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuLy8gRW5kXG52YXIgZW5kID0gT2JqZWN0LmNyZWF0ZShQRXhwci5wcm90b3R5cGUpO1xuLy8gVGVybWluYWxzXG52YXIgVGVybWluYWwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRlcm1pbmFsLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRlcm1pbmFsKG9iaikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vYmogPSBvYmo7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIFRlcm1pbmFsO1xufShQRXhwcikpO1xuLy8gUmFuZ2VzXG52YXIgUmFuZ2UgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFJhbmdlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFJhbmdlKGZyb20sIHRvKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmZyb20gPSBmcm9tO1xuICAgICAgICBfdGhpcy50byA9IHRvO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBSYW5nZTtcbn0oUEV4cHIpKTtcbi8vIFBhcmFtZXRlcnNcbnZhciBQYXJhbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUGFyYW0sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUGFyYW0oaW5kZXgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUGFyYW07XG59KFBFeHByKSk7XG4vLyBBbHRlcm5hdGlvblxudmFyIEFsdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQWx0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEFsdCh0ZXJtcykge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy50ZXJtcyA9IHRlcm1zO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBBbHQ7XG59KFBFeHByKSk7XG4vLyBFeHRlbmQgaXMgYW4gaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIHJ1bGUgZXh0ZW5zaW9uXG52YXIgRXh0ZW5kID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFeHRlbmQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRXh0ZW5kKHN1cGVyR3JhbW1hciwgbmFtZSwgYm9keSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgb3JpZ0JvZHkgPSBzdXBlckdyYW1tYXIucnVsZXNbbmFtZV0uYm9keTtcbiAgICAgICAgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBbYm9keSwgb3JpZ0JvZHldKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gICAgICAgIF90aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICBfdGhpcy5ib2R5ID0gYm9keTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gRXh0ZW5kO1xufShBbHQpKTtcbi8vIFNwbGljZSBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBvdmVycmlkaW5nIHdpdGggdGhlIGAuLi5gIG9wZXJhdG9yLlxudmFyIFNwbGljZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU3BsaWNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNwbGljZShzdXBlckdyYW1tYXIsIHJ1bGVOYW1lLCBiZWZvcmVUZXJtcywgYWZ0ZXJUZXJtcykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgb3JpZ0JvZHkgPSBzdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgX19zcHJlYWRBcnJheXMoYmVmb3JlVGVybXMsIFtvcmlnQm9keV0sIGFmdGVyVGVybXMpKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gICAgICAgIF90aGlzLnJ1bGVOYW1lID0gcnVsZU5hbWU7XG4gICAgICAgIF90aGlzLmV4cGFuc2lvblBvcyA9IGJlZm9yZVRlcm1zLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gU3BsaWNlO1xufShBbHQpKTtcbi8vIFNlcXVlbmNlc1xudmFyIFNlcSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoU2VxLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmZhY3RvcnMgPSBmYWN0b3JzO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBTZXE7XG59KFBFeHByKSk7XG4vLyBJdGVyYXRvcnMgYW5kIG9wdGlvbmFsc1xudmFyIEl0ZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEl0ZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gSXRlcihleHByKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmV4cHIgPSBleHByO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBJdGVyO1xufShQRXhwcikpO1xudmFyIFN0YXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFN0YXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU3RhcigpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gU3Rhcjtcbn0oSXRlcikpO1xudmFyIFBsdXMgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFBsdXMsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUGx1cygpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gUGx1cztcbn0oSXRlcikpO1xudmFyIE9wdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoT3B0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE9wdCgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gT3B0O1xufShJdGVyKSk7XG5TdGFyLnByb3RvdHlwZS5vcGVyYXRvciA9ICcqJztcblBsdXMucHJvdG90eXBlLm9wZXJhdG9yID0gJysnO1xuT3B0LnByb3RvdHlwZS5vcGVyYXRvciA9ICc/JztcblN0YXIucHJvdG90eXBlLm1pbk51bU1hdGNoZXMgPSAwO1xuUGx1cy5wcm90b3R5cGUubWluTnVtTWF0Y2hlcyA9IDE7XG5PcHQucHJvdG90eXBlLm1pbk51bU1hdGNoZXMgPSAwO1xuU3Rhci5wcm90b3R5cGUubWF4TnVtTWF0Y2hlcyA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcblBsdXMucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5PcHQucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSAxO1xuLy8gUHJlZGljYXRlc1xudmFyIE5vdCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTm90LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE5vdChleHByKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmV4cHIgPSBleHByO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBOb3Q7XG59KFBFeHByKSk7XG52YXIgTG9va2FoZWFkID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhMb29rYWhlYWQsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTG9va2FoZWFkKGV4cHIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZXhwciA9IGV4cHI7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIExvb2thaGVhZDtcbn0oUEV4cHIpKTtcbi8vIFwiTGV4aWZpY2F0aW9uXCJcbnZhciBMZXggPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKExleCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBMZXgoZXhwcikge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5leHByID0gZXhwcjtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gTGV4O1xufShQRXhwcikpO1xuLy8gUnVsZSBhcHBsaWNhdGlvblxudmFyIEFwcGx5ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhBcHBseSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBcHBseShydWxlTmFtZSwgYXJncykge1xuICAgICAgICBpZiAoYXJncyA9PT0gdm9pZCAwKSB7IGFyZ3MgPSBbXTsgfVxuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICAgICAgICBfdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBBcHBseS5wcm90b3R5cGUuaXNTeW50YWN0aWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSk7XG4gICAgfTtcbiAgICAvLyBUaGlzIG1ldGhvZCBqdXN0IGNhY2hlcyB0aGUgcmVzdWx0IG9mIGB0aGlzLnRvU3RyaW5nKClgIGluIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkuXG4gICAgQXBwbHkucHJvdG90eXBlLnRvTWVtb0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9tZW1vS2V5KSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ19tZW1vS2V5JywgeyB2YWx1ZTogdGhpcy50b1N0cmluZygpIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9tZW1vS2V5O1xuICAgIH07XG4gICAgcmV0dXJuIEFwcGx5O1xufShQRXhwcikpO1xuLy8gVW5pY29kZSBjaGFyYWN0ZXJcbnZhciBVbmljb2RlQ2hhciA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoVW5pY29kZUNoYXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVW5pY29kZUNoYXIoY2F0ZWdvcnkpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuY2F0ZWdvcnkgPSBjYXRlZ29yeTtcbiAgICAgICAgX3RoaXMucGF0dGVybiA9IFVuaWNvZGVDYXRlZ29yaWVzW2NhdGVnb3J5XTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICByZXR1cm4gVW5pY29kZUNoYXI7XG59KFBFeHByKSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydHMuUEV4cHIgPSBQRXhwcjtcbmV4cG9ydHMuYW55ID0gYW55O1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlRlcm1pbmFsID0gVGVybWluYWw7XG5leHBvcnRzLlJhbmdlID0gUmFuZ2U7XG5leHBvcnRzLlBhcmFtID0gUGFyYW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kID0gRXh0ZW5kO1xuZXhwb3J0cy5TcGxpY2UgPSBTcGxpY2U7XG5leHBvcnRzLlNlcSA9IFNlcTtcbmV4cG9ydHMuSXRlciA9IEl0ZXI7XG5leHBvcnRzLlN0YXIgPSBTdGFyO1xuZXhwb3J0cy5QbHVzID0gUGx1cztcbmV4cG9ydHMuT3B0ID0gT3B0O1xuZXhwb3J0cy5Ob3QgPSBOb3Q7XG5leHBvcnRzLkxvb2thaGVhZCA9IExvb2thaGVhZDtcbmV4cG9ydHMuTGV4ID0gTGV4O1xuZXhwb3J0cy5BcHBseSA9IEFwcGx5O1xuZXhwb3J0cy5Vbmljb2RlQ2hhciA9IFVuaWNvZGVDaGFyO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4dGVuc2lvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5yZXF1aXJlKCcuL3BleHBycy1hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHknKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtZXZhbCcpO1xucmVxdWlyZSgnLi9wZXhwcnMtZ2V0QXJpdHknKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWdlbmVyYXRlRXhhbXBsZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtb3V0cHV0UmVjaXBlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1pbnRyb2R1Y2VQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWlzTnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXN1YnN0aXR1dGVQYXJhbXMnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRGlzcGxheVN0cmluZycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0Jyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0ZhaWx1cmUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvU3RyaW5nJyk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHaXZlbiBhbiBhcnJheSBvZiBudW1iZXJzIGBhcnJgLCByZXR1cm4gYW4gYXJyYXkgb2YgdGhlIG51bWJlcnMgYXMgc3RyaW5ncyxcbi8vIHJpZ2h0LWp1c3RpZmllZCBhbmQgcGFkZGVkIHRvIHRoZSBzYW1lIGxlbmd0aC5cbmZ1bmN0aW9uIHBhZE51bWJlcnNUb0VxdWFsTGVuZ3RoKGFycikge1xuICAgIHZhciBtYXhMZW4gPSAwO1xuICAgIHZhciBzdHJpbmdzID0gYXJyLm1hcChmdW5jdGlvbiAobikge1xuICAgICAgICB2YXIgc3RyID0gbi50b1N0cmluZygpO1xuICAgICAgICBtYXhMZW4gPSBNYXRoLm1heChtYXhMZW4sIHN0ci5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gc3RyO1xuICAgIH0pO1xuICAgIHJldHVybiBzdHJpbmdzLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gY29tbW9uLnBhZExlZnQocywgbWF4TGVuKTsgfSk7XG59XG4vLyBQcm9kdWNlIGEgbmV3IHN0cmluZyB0aGF0IHdvdWxkIGJlIHRoZSByZXN1bHQgb2YgY29weWluZyB0aGUgY29udGVudHNcbi8vIG9mIHRoZSBzdHJpbmcgYHNyY2Agb250byBgZGVzdGAgYXQgb2Zmc2V0IGBvZmZlc3RgLlxuZnVuY3Rpb24gc3RyY3B5KGRlc3QsIHNyYywgb2Zmc2V0KSB7XG4gICAgdmFyIG9yaWdEZXN0TGVuID0gZGVzdC5sZW5ndGg7XG4gICAgdmFyIHN0YXJ0ID0gZGVzdC5zbGljZSgwLCBvZmZzZXQpO1xuICAgIHZhciBlbmQgPSBkZXN0LnNsaWNlKG9mZnNldCArIHNyYy5sZW5ndGgpO1xuICAgIHJldHVybiAoc3RhcnQgKyBzcmMgKyBlbmQpLnN1YnN0cigwLCBvcmlnRGVzdExlbik7XG59XG4vLyBDYXN0cyB0aGUgdW5kZXJseWluZyBsaW5lQW5kQ29sIG9iamVjdCB0byBhIGZvcm1hdHRlZCBtZXNzYWdlIHN0cmluZyxcbi8vIGhpZ2hsaWdodGluZyBgcmFuZ2VzYC5cbmZ1bmN0aW9uIGxpbmVBbmRDb2x1bW5Ub01lc3NhZ2UoKSB7XG4gICAgdmFyIHJhbmdlcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHJhbmdlc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICB2YXIgbGluZUFuZENvbCA9IHRoaXM7XG4gICAgdmFyIG9mZnNldCA9IGxpbmVBbmRDb2wub2Zmc2V0O1xuICAgIHZhciByZXBlYXRTdHIgPSBjb21tb24ucmVwZWF0U3RyO1xuICAgIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gICAgc2IuYXBwZW5kKCdMaW5lICcgKyBsaW5lQW5kQ29sLmxpbmVOdW0gKyAnLCBjb2wgJyArIGxpbmVBbmRDb2wuY29sTnVtICsgJzpcXG4nKTtcbiAgICAvLyBBbiBhcnJheSBvZiB0aGUgcHJldmlvdXMsIGN1cnJlbnQsIGFuZCBuZXh0IGxpbmUgbnVtYmVycyBhcyBzdHJpbmdzIG9mIGVxdWFsIGxlbmd0aC5cbiAgICB2YXIgbGluZU51bWJlcnMgPSBwYWROdW1iZXJzVG9FcXVhbExlbmd0aChbXG4gICAgICAgIGxpbmVBbmRDb2wucHJldkxpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gLSAxLFxuICAgICAgICBsaW5lQW5kQ29sLmxpbmVOdW0sXG4gICAgICAgIGxpbmVBbmRDb2wubmV4dExpbmUgPT0gbnVsbCA/IDAgOiBsaW5lQW5kQ29sLmxpbmVOdW0gKyAxXG4gICAgXSk7XG4gICAgLy8gSGVscGVyIGZvciBhcHBlbmRpbmcgZm9ybWF0dGluZyBpbnB1dCBsaW5lcyB0byB0aGUgYnVmZmVyLlxuICAgIHZhciBhcHBlbmRMaW5lID0gZnVuY3Rpb24gKG51bSwgY29udGVudCwgcHJlZml4KSB7XG4gICAgICAgIHNiLmFwcGVuZChwcmVmaXggKyBsaW5lTnVtYmVyc1tudW1dICsgJyB8ICcgKyBjb250ZW50ICsgJ1xcbicpO1xuICAgIH07XG4gICAgLy8gSW5jbHVkZSB0aGUgcHJldmlvdXMgbGluZSBmb3IgY29udGV4dCBpZiBwb3NzaWJsZS5cbiAgICBpZiAobGluZUFuZENvbC5wcmV2TGluZSAhPSBudWxsKSB7XG4gICAgICAgIGFwcGVuZExpbmUoMCwgbGluZUFuZENvbC5wcmV2TGluZSwgJyAgJyk7XG4gICAgfVxuICAgIC8vIExpbmUgdGhhdCB0aGUgZXJyb3Igb2NjdXJyZWQgb24uXG4gICAgYXBwZW5kTGluZSgxLCBsaW5lQW5kQ29sLmxpbmUsICc+ICcpO1xuICAgIC8vIEJ1aWxkIHVwIHRoZSBsaW5lIHRoYXQgcG9pbnRzIHRvIHRoZSBvZmZzZXQgYW5kIHBvc3NpYmxlIGluZGljYXRlcyBvbmUgb3IgbW9yZSByYW5nZXMuXG4gICAgLy8gU3RhcnQgd2l0aCBhIGJsYW5rIGxpbmUsIGFuZCBpbmRpY2F0ZSBlYWNoIHJhbmdlIGJ5IG92ZXJsYXlpbmcgYSBzdHJpbmcgb2YgYH5gIGNoYXJzLlxuICAgIHZhciBsaW5lTGVuID0gbGluZUFuZENvbC5saW5lLmxlbmd0aDtcbiAgICB2YXIgaW5kaWNhdGlvbkxpbmUgPSByZXBlYXRTdHIoJyAnLCBsaW5lTGVuICsgMSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYW5nZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIHN0YXJ0SWR4ID0gcmFuZ2VzW2ldWzBdO1xuICAgICAgICB2YXIgZW5kSWR4ID0gcmFuZ2VzW2ldWzFdO1xuICAgICAgICBjb21tb24uYXNzZXJ0KHN0YXJ0SWR4ID49IDAgJiYgc3RhcnRJZHggPD0gZW5kSWR4LCAncmFuZ2Ugc3RhcnQgbXVzdCBiZSA+PSAwIGFuZCA8PSBlbmQnKTtcbiAgICAgICAgdmFyIGxpbmVTdGFydE9mZnNldCA9IG9mZnNldCAtIGxpbmVBbmRDb2wuY29sTnVtICsgMTtcbiAgICAgICAgc3RhcnRJZHggPSBNYXRoLm1heCgwLCBzdGFydElkeCAtIGxpbmVTdGFydE9mZnNldCk7XG4gICAgICAgIGVuZElkeCA9IE1hdGgubWluKGVuZElkeCAtIGxpbmVTdGFydE9mZnNldCwgbGluZUxlbik7XG4gICAgICAgIGluZGljYXRpb25MaW5lID0gc3RyY3B5KGluZGljYXRpb25MaW5lLCByZXBlYXRTdHIoJ34nLCBlbmRJZHggLSBzdGFydElkeCksIHN0YXJ0SWR4KTtcbiAgICB9XG4gICAgdmFyIGd1dHRlcldpZHRoID0gMiArIGxpbmVOdW1iZXJzWzFdLmxlbmd0aCArIDM7XG4gICAgc2IuYXBwZW5kKHJlcGVhdFN0cignICcsIGd1dHRlcldpZHRoKSk7XG4gICAgaW5kaWNhdGlvbkxpbmUgPSBzdHJjcHkoaW5kaWNhdGlvbkxpbmUsICdeJywgbGluZUFuZENvbC5jb2xOdW0gLSAxKTtcbiAgICBzYi5hcHBlbmQoaW5kaWNhdGlvbkxpbmUucmVwbGFjZSgvICskLywgJycpICsgJ1xcbicpO1xuICAgIC8vIEluY2x1ZGUgdGhlIG5leHQgbGluZSBmb3IgY29udGV4dCBpZiBwb3NzaWJsZS5cbiAgICBpZiAobGluZUFuZENvbC5uZXh0TGluZSAhPSBudWxsKSB7XG4gICAgICAgIGFwcGVuZExpbmUoMiwgbGluZUFuZENvbC5uZXh0TGluZSwgJyAgJyk7XG4gICAgfVxuICAgIHJldHVybiBzYi5jb250ZW50cygpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgYnVpbHRJblJ1bGVzQ2FsbGJhY2tzID0gW107XG4vLyBTaW5jZSBHcmFtbWFyLkJ1aWx0SW5SdWxlcyBpcyBib290c3RyYXBwZWQsIG1vc3Qgb2YgT2htIGNhbid0IGRpcmVjdGx5IGRlcGVuZCBpdC5cbi8vIFRoaXMgZnVuY3Rpb24gYWxsb3dzIG1vZHVsZXMgdGhhdCBkbyBkZXBlbmQgb24gdGhlIGJ1aWx0LWluIHJ1bGVzIHRvIHJlZ2lzdGVyIGEgY2FsbGJhY2tcbi8vIHRoYXQgd2lsbCBiZSBjYWxsZWQgbGF0ZXIgaW4gdGhlIGluaXRpYWxpemF0aW9uIHByb2Nlc3MuXG5leHBvcnRzLmF3YWl0QnVpbHRJblJ1bGVzID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgYnVpbHRJblJ1bGVzQ2FsbGJhY2tzLnB1c2goY2IpO1xufTtcbmV4cG9ydHMuYW5ub3VuY2VCdWlsdEluUnVsZXMgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGJ1aWx0SW5SdWxlc0NhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChjYikge1xuICAgICAgICBjYihncmFtbWFyKTtcbiAgICB9KTtcbiAgICBidWlsdEluUnVsZXNDYWxsYmFja3MgPSBudWxsO1xufTtcbi8vIFJldHVybiBhbiBvYmplY3Qgd2l0aCB0aGUgbGluZSBhbmQgY29sdW1uIGluZm9ybWF0aW9uIGZvciB0aGUgZ2l2ZW5cbi8vIG9mZnNldCBpbiBgc3RyYC5cbmV4cG9ydHMuZ2V0TGluZUFuZENvbHVtbiA9IGZ1bmN0aW9uIChzdHIsIG9mZnNldCkge1xuICAgIHZhciBsaW5lTnVtID0gMTtcbiAgICB2YXIgY29sTnVtID0gMTtcbiAgICB2YXIgY3Vyck9mZnNldCA9IDA7XG4gICAgdmFyIGxpbmVTdGFydE9mZnNldCA9IDA7XG4gICAgdmFyIG5leHRMaW5lID0gbnVsbDtcbiAgICB2YXIgcHJldkxpbmUgPSBudWxsO1xuICAgIHZhciBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gLTE7XG4gICAgd2hpbGUgKGN1cnJPZmZzZXQgPCBvZmZzZXQpIHtcbiAgICAgICAgdmFyIGMgPSBzdHIuY2hhckF0KGN1cnJPZmZzZXQrKyk7XG4gICAgICAgIGlmIChjID09PSAnXFxuJykge1xuICAgICAgICAgICAgbGluZU51bSsrO1xuICAgICAgICAgICAgY29sTnVtID0gMTtcbiAgICAgICAgICAgIHByZXZMaW5lU3RhcnRPZmZzZXQgPSBsaW5lU3RhcnRPZmZzZXQ7XG4gICAgICAgICAgICBsaW5lU3RhcnRPZmZzZXQgPSBjdXJyT2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgIT09ICdcXHInKSB7XG4gICAgICAgICAgICBjb2xOdW0rKztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBGaW5kIHRoZSBlbmQgb2YgdGhlIHRhcmdldCBsaW5lLlxuICAgIHZhciBsaW5lRW5kT2Zmc2V0ID0gc3RyLmluZGV4T2YoJ1xcbicsIGxpbmVTdGFydE9mZnNldCk7XG4gICAgaWYgKGxpbmVFbmRPZmZzZXQgPT09IC0xKSB7XG4gICAgICAgIGxpbmVFbmRPZmZzZXQgPSBzdHIubGVuZ3RoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gR2V0IHRoZSBuZXh0IGxpbmUuXG4gICAgICAgIHZhciBuZXh0TGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lRW5kT2Zmc2V0ICsgMSk7XG4gICAgICAgIG5leHRMaW5lID1cbiAgICAgICAgICAgIG5leHRMaW5lRW5kT2Zmc2V0ID09PSAtMVxuICAgICAgICAgICAgICAgID8gc3RyLnNsaWNlKGxpbmVFbmRPZmZzZXQpXG4gICAgICAgICAgICAgICAgOiBzdHIuc2xpY2UobGluZUVuZE9mZnNldCwgbmV4dExpbmVFbmRPZmZzZXQpO1xuICAgICAgICAvLyBTdHJpcCBsZWFkaW5nIGFuZCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgICAgICAgbmV4dExpbmUgPSBuZXh0TGluZS5yZXBsYWNlKC9eXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHIkLywgJycpO1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIHByZXZpb3VzIGxpbmUuXG4gICAgaWYgKHByZXZMaW5lU3RhcnRPZmZzZXQgPj0gMCkge1xuICAgICAgICAvLyBTdHJpcCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgICAgICAgcHJldkxpbmUgPSBzdHIuc2xpY2UocHJldkxpbmVTdGFydE9mZnNldCwgbGluZVN0YXJ0T2Zmc2V0KS5yZXBsYWNlKC9cXHI/XFxuJC8sICcnKTtcbiAgICB9XG4gICAgLy8gR2V0IHRoZSB0YXJnZXQgbGluZSwgc3RyaXBwaW5nIGEgdHJhaWxpbmcgY2FycmlhZ2UgcmV0dXJuIGlmIG5lY2Vzc2FyeS5cbiAgICB2YXIgbGluZSA9IHN0ci5zbGljZShsaW5lU3RhcnRPZmZzZXQsIGxpbmVFbmRPZmZzZXQpLnJlcGxhY2UoL1xcciQvLCAnJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICAgIGxpbmVOdW06IGxpbmVOdW0sXG4gICAgICAgIGNvbE51bTogY29sTnVtLFxuICAgICAgICBsaW5lOiBsaW5lLFxuICAgICAgICBwcmV2TGluZTogcHJldkxpbmUsXG4gICAgICAgIG5leHRMaW5lOiBuZXh0TGluZSxcbiAgICAgICAgdG9TdHJpbmc6IGxpbmVBbmRDb2x1bW5Ub01lc3NhZ2VcbiAgICB9O1xufTtcbi8vIFJldHVybiBhIG5pY2VseS1mb3JtYXR0ZWQgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGxpbmUgYW5kIGNvbHVtbiBmb3IgdGhlXG4vLyBnaXZlbiBvZmZzZXQgaW4gYHN0cmAgaGlnaGxpZ2h0aW5nIGByYW5nZXNgLlxuZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSA9IGZ1bmN0aW9uIChzdHIsIG9mZnNldCkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgcmFuZ2VzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAyOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgcmFuZ2VzW19pIC0gMl0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICByZXR1cm4gKF9hID0gZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uKHN0ciwgb2Zmc2V0KSkudG9TdHJpbmcuYXBwbHkoX2EsIHJhbmdlcyk7XG59O1xuZXhwb3J0cy51bmlxdWVJZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlkQ291bnRlciA9IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcmVmaXgpIHsgcmV0dXJuICcnICsgcHJlZml4ICsgaWRDb3VudGVyKys7IH07XG59KSgpO1xuIiwiLyogZ2xvYmFsIF9fR0xPQkFMX09ITV9WRVJTSU9OX18gKi9cbid1c2Ugc3RyaWN0Jztcbi8vIFdoZW4gcnVubmluZyB1bmRlciBOb2RlLCByZWFkIHRoZSB2ZXJzaW9uIGZyb20gcGFja2FnZS5qc29uLiBGb3IgdGhlIGJyb3dzZXIsXG4vLyB1c2UgYSBzcGVjaWFsIGdsb2JhbCB2YXJpYWJsZSBkZWZpbmVkIGluIHRoZSBidWlsZCBwcm9jZXNzIChzZWUgd2VicGFjay5jb25maWcuanMpLlxubW9kdWxlLmV4cG9ydHMgPVxuICAgIHR5cGVvZiBfX0dMT0JBTF9PSE1fVkVSU0lPTl9fID09PSAnc3RyaW5nJ1xuICAgICAgICA/IF9fR0xPQkFMX09ITV9WRVJTSU9OX19cbiAgICAgICAgOiByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuIiwiLy8gQmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvdW5pY29kZS05LjAuMC5cbi8vIFRoZXNlIGFyZSBqdXN0IGNhdGVnb3JpZXMgdGhhdCBhcmUgdXNlZCBpbiBFUzUvRVMyMDE1LlxuLy8gVGhlIGZ1bGwgbGlzdCBvZiBVbmljb2RlIGNhdGVnb3JpZXMgaXMgaGVyZTogaHR0cDovL3d3dy5maWxlZm9ybWF0LmluZm8vaW5mby91bmljb2RlL2NhdGVnb3J5L2luZGV4Lmh0bS5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBMZXR0ZXJzXG4gIEx1OiAvW0EtWlxceEMwLVxceEQ2XFx4RDgtXFx4REVcXHUwMTAwXFx1MDEwMlxcdTAxMDRcXHUwMTA2XFx1MDEwOFxcdTAxMEFcXHUwMTBDXFx1MDEwRVxcdTAxMTBcXHUwMTEyXFx1MDExNFxcdTAxMTZcXHUwMTE4XFx1MDExQVxcdTAxMUNcXHUwMTFFXFx1MDEyMFxcdTAxMjJcXHUwMTI0XFx1MDEyNlxcdTAxMjhcXHUwMTJBXFx1MDEyQ1xcdTAxMkVcXHUwMTMwXFx1MDEzMlxcdTAxMzRcXHUwMTM2XFx1MDEzOVxcdTAxM0JcXHUwMTNEXFx1MDEzRlxcdTAxNDFcXHUwMTQzXFx1MDE0NVxcdTAxNDdcXHUwMTRBXFx1MDE0Q1xcdTAxNEVcXHUwMTUwXFx1MDE1MlxcdTAxNTRcXHUwMTU2XFx1MDE1OFxcdTAxNUFcXHUwMTVDXFx1MDE1RVxcdTAxNjBcXHUwMTYyXFx1MDE2NFxcdTAxNjZcXHUwMTY4XFx1MDE2QVxcdTAxNkNcXHUwMTZFXFx1MDE3MFxcdTAxNzJcXHUwMTc0XFx1MDE3NlxcdTAxNzhcXHUwMTc5XFx1MDE3QlxcdTAxN0RcXHUwMTgxXFx1MDE4MlxcdTAxODRcXHUwMTg2XFx1MDE4N1xcdTAxODktXFx1MDE4QlxcdTAxOEUtXFx1MDE5MVxcdTAxOTNcXHUwMTk0XFx1MDE5Ni1cXHUwMTk4XFx1MDE5Q1xcdTAxOURcXHUwMTlGXFx1MDFBMFxcdTAxQTJcXHUwMUE0XFx1MDFBNlxcdTAxQTdcXHUwMUE5XFx1MDFBQ1xcdTAxQUVcXHUwMUFGXFx1MDFCMS1cXHUwMUIzXFx1MDFCNVxcdTAxQjdcXHUwMUI4XFx1MDFCQ1xcdTAxQzRcXHUwMUM3XFx1MDFDQVxcdTAxQ0RcXHUwMUNGXFx1MDFEMVxcdTAxRDNcXHUwMUQ1XFx1MDFEN1xcdTAxRDlcXHUwMURCXFx1MDFERVxcdTAxRTBcXHUwMUUyXFx1MDFFNFxcdTAxRTZcXHUwMUU4XFx1MDFFQVxcdTAxRUNcXHUwMUVFXFx1MDFGMVxcdTAxRjRcXHUwMUY2LVxcdTAxRjhcXHUwMUZBXFx1MDFGQ1xcdTAxRkVcXHUwMjAwXFx1MDIwMlxcdTAyMDRcXHUwMjA2XFx1MDIwOFxcdTAyMEFcXHUwMjBDXFx1MDIwRVxcdTAyMTBcXHUwMjEyXFx1MDIxNFxcdTAyMTZcXHUwMjE4XFx1MDIxQVxcdTAyMUNcXHUwMjFFXFx1MDIyMFxcdTAyMjJcXHUwMjI0XFx1MDIyNlxcdTAyMjhcXHUwMjJBXFx1MDIyQ1xcdTAyMkVcXHUwMjMwXFx1MDIzMlxcdTAyM0FcXHUwMjNCXFx1MDIzRFxcdTAyM0VcXHUwMjQxXFx1MDI0My1cXHUwMjQ2XFx1MDI0OFxcdTAyNEFcXHUwMjRDXFx1MDI0RVxcdTAzNzBcXHUwMzcyXFx1MDM3NlxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEVcXHUwMzhGXFx1MDM5MS1cXHUwM0ExXFx1MDNBMy1cXHUwM0FCXFx1MDNDRlxcdTAzRDItXFx1MDNENFxcdTAzRDhcXHUwM0RBXFx1MDNEQ1xcdTAzREVcXHUwM0UwXFx1MDNFMlxcdTAzRTRcXHUwM0U2XFx1MDNFOFxcdTAzRUFcXHUwM0VDXFx1MDNFRVxcdTAzRjRcXHUwM0Y3XFx1MDNGOVxcdTAzRkFcXHUwM0ZELVxcdTA0MkZcXHUwNDYwXFx1MDQ2MlxcdTA0NjRcXHUwNDY2XFx1MDQ2OFxcdTA0NkFcXHUwNDZDXFx1MDQ2RVxcdTA0NzBcXHUwNDcyXFx1MDQ3NFxcdTA0NzZcXHUwNDc4XFx1MDQ3QVxcdTA0N0NcXHUwNDdFXFx1MDQ4MFxcdTA0OEFcXHUwNDhDXFx1MDQ4RVxcdTA0OTBcXHUwNDkyXFx1MDQ5NFxcdTA0OTZcXHUwNDk4XFx1MDQ5QVxcdTA0OUNcXHUwNDlFXFx1MDRBMFxcdTA0QTJcXHUwNEE0XFx1MDRBNlxcdTA0QThcXHUwNEFBXFx1MDRBQ1xcdTA0QUVcXHUwNEIwXFx1MDRCMlxcdTA0QjRcXHUwNEI2XFx1MDRCOFxcdTA0QkFcXHUwNEJDXFx1MDRCRVxcdTA0QzBcXHUwNEMxXFx1MDRDM1xcdTA0QzVcXHUwNEM3XFx1MDRDOVxcdTA0Q0JcXHUwNENEXFx1MDREMFxcdTA0RDJcXHUwNEQ0XFx1MDRENlxcdTA0RDhcXHUwNERBXFx1MDREQ1xcdTA0REVcXHUwNEUwXFx1MDRFMlxcdTA0RTRcXHUwNEU2XFx1MDRFOFxcdTA0RUFcXHUwNEVDXFx1MDRFRVxcdTA0RjBcXHUwNEYyXFx1MDRGNFxcdTA0RjZcXHUwNEY4XFx1MDRGQVxcdTA0RkNcXHUwNEZFXFx1MDUwMFxcdTA1MDJcXHUwNTA0XFx1MDUwNlxcdTA1MDhcXHUwNTBBXFx1MDUwQ1xcdTA1MEVcXHUwNTEwXFx1MDUxMlxcdTA1MTRcXHUwNTE2XFx1MDUxOFxcdTA1MUFcXHUwNTFDXFx1MDUxRVxcdTA1MjBcXHUwNTIyXFx1MDUyNFxcdTA1MjZcXHUwNTI4XFx1MDUyQVxcdTA1MkNcXHUwNTJFXFx1MDUzMS1cXHUwNTU2XFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxM0EwLVxcdTEzRjVcXHUxRTAwXFx1MUUwMlxcdTFFMDRcXHUxRTA2XFx1MUUwOFxcdTFFMEFcXHUxRTBDXFx1MUUwRVxcdTFFMTBcXHUxRTEyXFx1MUUxNFxcdTFFMTZcXHUxRTE4XFx1MUUxQVxcdTFFMUNcXHUxRTFFXFx1MUUyMFxcdTFFMjJcXHUxRTI0XFx1MUUyNlxcdTFFMjhcXHUxRTJBXFx1MUUyQ1xcdTFFMkVcXHUxRTMwXFx1MUUzMlxcdTFFMzRcXHUxRTM2XFx1MUUzOFxcdTFFM0FcXHUxRTNDXFx1MUUzRVxcdTFFNDBcXHUxRTQyXFx1MUU0NFxcdTFFNDZcXHUxRTQ4XFx1MUU0QVxcdTFFNENcXHUxRTRFXFx1MUU1MFxcdTFFNTJcXHUxRTU0XFx1MUU1NlxcdTFFNThcXHUxRTVBXFx1MUU1Q1xcdTFFNUVcXHUxRTYwXFx1MUU2MlxcdTFFNjRcXHUxRTY2XFx1MUU2OFxcdTFFNkFcXHUxRTZDXFx1MUU2RVxcdTFFNzBcXHUxRTcyXFx1MUU3NFxcdTFFNzZcXHUxRTc4XFx1MUU3QVxcdTFFN0NcXHUxRTdFXFx1MUU4MFxcdTFFODJcXHUxRTg0XFx1MUU4NlxcdTFFODhcXHUxRThBXFx1MUU4Q1xcdTFFOEVcXHUxRTkwXFx1MUU5MlxcdTFFOTRcXHUxRTlFXFx1MUVBMFxcdTFFQTJcXHUxRUE0XFx1MUVBNlxcdTFFQThcXHUxRUFBXFx1MUVBQ1xcdTFFQUVcXHUxRUIwXFx1MUVCMlxcdTFFQjRcXHUxRUI2XFx1MUVCOFxcdTFFQkFcXHUxRUJDXFx1MUVCRVxcdTFFQzBcXHUxRUMyXFx1MUVDNFxcdTFFQzZcXHUxRUM4XFx1MUVDQVxcdTFFQ0NcXHUxRUNFXFx1MUVEMFxcdTFFRDJcXHUxRUQ0XFx1MUVENlxcdTFFRDhcXHUxRURBXFx1MUVEQ1xcdTFFREVcXHUxRUUwXFx1MUVFMlxcdTFFRTRcXHUxRUU2XFx1MUVFOFxcdTFFRUFcXHUxRUVDXFx1MUVFRVxcdTFFRjBcXHUxRUYyXFx1MUVGNFxcdTFFRjZcXHUxRUY4XFx1MUVGQVxcdTFFRkNcXHUxRUZFXFx1MUYwOC1cXHUxRjBGXFx1MUYxOC1cXHUxRjFEXFx1MUYyOC1cXHUxRjJGXFx1MUYzOC1cXHUxRjNGXFx1MUY0OC1cXHUxRjREXFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1RlxcdTFGNjgtXFx1MUY2RlxcdTFGQjgtXFx1MUZCQlxcdTFGQzgtXFx1MUZDQlxcdTFGRDgtXFx1MUZEQlxcdTFGRTgtXFx1MUZFQ1xcdTFGRjgtXFx1MUZGQlxcdTIxMDJcXHUyMTA3XFx1MjEwQi1cXHUyMTBEXFx1MjExMC1cXHUyMTEyXFx1MjExNVxcdTIxMTktXFx1MjExRFxcdTIxMjRcXHUyMTI2XFx1MjEyOFxcdTIxMkEtXFx1MjEyRFxcdTIxMzAtXFx1MjEzM1xcdTIxM0VcXHUyMTNGXFx1MjE0NVxcdTIxODNcXHUyQzAwLVxcdTJDMkVcXHUyQzYwXFx1MkM2Mi1cXHUyQzY0XFx1MkM2N1xcdTJDNjlcXHUyQzZCXFx1MkM2RC1cXHUyQzcwXFx1MkM3MlxcdTJDNzVcXHUyQzdFLVxcdTJDODBcXHUyQzgyXFx1MkM4NFxcdTJDODZcXHUyQzg4XFx1MkM4QVxcdTJDOENcXHUyQzhFXFx1MkM5MFxcdTJDOTJcXHUyQzk0XFx1MkM5NlxcdTJDOThcXHUyQzlBXFx1MkM5Q1xcdTJDOUVcXHUyQ0EwXFx1MkNBMlxcdTJDQTRcXHUyQ0E2XFx1MkNBOFxcdTJDQUFcXHUyQ0FDXFx1MkNBRVxcdTJDQjBcXHUyQ0IyXFx1MkNCNFxcdTJDQjZcXHUyQ0I4XFx1MkNCQVxcdTJDQkNcXHUyQ0JFXFx1MkNDMFxcdTJDQzJcXHUyQ0M0XFx1MkNDNlxcdTJDQzhcXHUyQ0NBXFx1MkNDQ1xcdTJDQ0VcXHUyQ0QwXFx1MkNEMlxcdTJDRDRcXHUyQ0Q2XFx1MkNEOFxcdTJDREFcXHUyQ0RDXFx1MkNERVxcdTJDRTBcXHUyQ0UyXFx1MkNFQlxcdTJDRURcXHUyQ0YyXFx1QTY0MFxcdUE2NDJcXHVBNjQ0XFx1QTY0NlxcdUE2NDhcXHVBNjRBXFx1QTY0Q1xcdUE2NEVcXHVBNjUwXFx1QTY1MlxcdUE2NTRcXHVBNjU2XFx1QTY1OFxcdUE2NUFcXHVBNjVDXFx1QTY1RVxcdUE2NjBcXHVBNjYyXFx1QTY2NFxcdUE2NjZcXHVBNjY4XFx1QTY2QVxcdUE2NkNcXHVBNjgwXFx1QTY4MlxcdUE2ODRcXHVBNjg2XFx1QTY4OFxcdUE2OEFcXHVBNjhDXFx1QTY4RVxcdUE2OTBcXHVBNjkyXFx1QTY5NFxcdUE2OTZcXHVBNjk4XFx1QTY5QVxcdUE3MjJcXHVBNzI0XFx1QTcyNlxcdUE3MjhcXHVBNzJBXFx1QTcyQ1xcdUE3MkVcXHVBNzMyXFx1QTczNFxcdUE3MzZcXHVBNzM4XFx1QTczQVxcdUE3M0NcXHVBNzNFXFx1QTc0MFxcdUE3NDJcXHVBNzQ0XFx1QTc0NlxcdUE3NDhcXHVBNzRBXFx1QTc0Q1xcdUE3NEVcXHVBNzUwXFx1QTc1MlxcdUE3NTRcXHVBNzU2XFx1QTc1OFxcdUE3NUFcXHVBNzVDXFx1QTc1RVxcdUE3NjBcXHVBNzYyXFx1QTc2NFxcdUE3NjZcXHVBNzY4XFx1QTc2QVxcdUE3NkNcXHVBNzZFXFx1QTc3OVxcdUE3N0JcXHVBNzdEXFx1QTc3RVxcdUE3ODBcXHVBNzgyXFx1QTc4NFxcdUE3ODZcXHVBNzhCXFx1QTc4RFxcdUE3OTBcXHVBNzkyXFx1QTc5NlxcdUE3OThcXHVBNzlBXFx1QTc5Q1xcdUE3OUVcXHVBN0EwXFx1QTdBMlxcdUE3QTRcXHVBN0E2XFx1QTdBOFxcdUE3QUEtXFx1QTdBRVxcdUE3QjAtXFx1QTdCNFxcdUE3QjZcXHVGRjIxLVxcdUZGM0FdfFxcdUQ4MDFbXFx1REMwMC1cXHVEQzI3XFx1RENCMC1cXHVEQ0QzXXxcXHVEODAzW1xcdURDODAtXFx1RENCMl18XFx1RDgwNltcXHVEQ0EwLVxcdURDQkZdfFxcdUQ4MzVbXFx1REMwMC1cXHVEQzE5XFx1REMzNC1cXHVEQzREXFx1REM2OC1cXHVEQzgxXFx1REM5Q1xcdURDOUVcXHVEQzlGXFx1RENBMlxcdURDQTVcXHVEQ0E2XFx1RENBOS1cXHVEQ0FDXFx1RENBRS1cXHVEQ0I1XFx1RENEMC1cXHVEQ0U5XFx1REQwNFxcdUREMDVcXHVERDA3LVxcdUREMEFcXHVERDBELVxcdUREMTRcXHVERDE2LVxcdUREMUNcXHVERDM4XFx1REQzOVxcdUREM0ItXFx1REQzRVxcdURENDAtXFx1REQ0NFxcdURENDZcXHVERDRBLVxcdURENTBcXHVERDZDLVxcdUREODVcXHVEREEwLVxcdUREQjlcXHVEREQ0LVxcdURERURcXHVERTA4LVxcdURFMjFcXHVERTNDLVxcdURFNTVcXHVERTcwLVxcdURFODlcXHVERUE4LVxcdURFQzBcXHVERUUyLVxcdURFRkFcXHVERjFDLVxcdURGMzRcXHVERjU2LVxcdURGNkVcXHVERjkwLVxcdURGQThcXHVERkNBXXxcXHVEODNBW1xcdUREMDAtXFx1REQyMV0vLFxuICBMbDogL1thLXpcXHhCNVxceERGLVxceEY2XFx4RjgtXFx4RkZcXHUwMTAxXFx1MDEwM1xcdTAxMDVcXHUwMTA3XFx1MDEwOVxcdTAxMEJcXHUwMTBEXFx1MDEwRlxcdTAxMTFcXHUwMTEzXFx1MDExNVxcdTAxMTdcXHUwMTE5XFx1MDExQlxcdTAxMURcXHUwMTFGXFx1MDEyMVxcdTAxMjNcXHUwMTI1XFx1MDEyN1xcdTAxMjlcXHUwMTJCXFx1MDEyRFxcdTAxMkZcXHUwMTMxXFx1MDEzM1xcdTAxMzVcXHUwMTM3XFx1MDEzOFxcdTAxM0FcXHUwMTNDXFx1MDEzRVxcdTAxNDBcXHUwMTQyXFx1MDE0NFxcdTAxNDZcXHUwMTQ4XFx1MDE0OVxcdTAxNEJcXHUwMTREXFx1MDE0RlxcdTAxNTFcXHUwMTUzXFx1MDE1NVxcdTAxNTdcXHUwMTU5XFx1MDE1QlxcdTAxNURcXHUwMTVGXFx1MDE2MVxcdTAxNjNcXHUwMTY1XFx1MDE2N1xcdTAxNjlcXHUwMTZCXFx1MDE2RFxcdTAxNkZcXHUwMTcxXFx1MDE3M1xcdTAxNzVcXHUwMTc3XFx1MDE3QVxcdTAxN0NcXHUwMTdFLVxcdTAxODBcXHUwMTgzXFx1MDE4NVxcdTAxODhcXHUwMThDXFx1MDE4RFxcdTAxOTJcXHUwMTk1XFx1MDE5OS1cXHUwMTlCXFx1MDE5RVxcdTAxQTFcXHUwMUEzXFx1MDFBNVxcdTAxQThcXHUwMUFBXFx1MDFBQlxcdTAxQURcXHUwMUIwXFx1MDFCNFxcdTAxQjZcXHUwMUI5XFx1MDFCQVxcdTAxQkQtXFx1MDFCRlxcdTAxQzZcXHUwMUM5XFx1MDFDQ1xcdTAxQ0VcXHUwMUQwXFx1MDFEMlxcdTAxRDRcXHUwMUQ2XFx1MDFEOFxcdTAxREFcXHUwMURDXFx1MDFERFxcdTAxREZcXHUwMUUxXFx1MDFFM1xcdTAxRTVcXHUwMUU3XFx1MDFFOVxcdTAxRUJcXHUwMUVEXFx1MDFFRlxcdTAxRjBcXHUwMUYzXFx1MDFGNVxcdTAxRjlcXHUwMUZCXFx1MDFGRFxcdTAxRkZcXHUwMjAxXFx1MDIwM1xcdTAyMDVcXHUwMjA3XFx1MDIwOVxcdTAyMEJcXHUwMjBEXFx1MDIwRlxcdTAyMTFcXHUwMjEzXFx1MDIxNVxcdTAyMTdcXHUwMjE5XFx1MDIxQlxcdTAyMURcXHUwMjFGXFx1MDIyMVxcdTAyMjNcXHUwMjI1XFx1MDIyN1xcdTAyMjlcXHUwMjJCXFx1MDIyRFxcdTAyMkZcXHUwMjMxXFx1MDIzMy1cXHUwMjM5XFx1MDIzQ1xcdTAyM0ZcXHUwMjQwXFx1MDI0MlxcdTAyNDdcXHUwMjQ5XFx1MDI0QlxcdTAyNERcXHUwMjRGLVxcdTAyOTNcXHUwMjk1LVxcdTAyQUZcXHUwMzcxXFx1MDM3M1xcdTAzNzdcXHUwMzdCLVxcdTAzN0RcXHUwMzkwXFx1MDNBQy1cXHUwM0NFXFx1MDNEMFxcdTAzRDFcXHUwM0Q1LVxcdTAzRDdcXHUwM0Q5XFx1MDNEQlxcdTAzRERcXHUwM0RGXFx1MDNFMVxcdTAzRTNcXHUwM0U1XFx1MDNFN1xcdTAzRTlcXHUwM0VCXFx1MDNFRFxcdTAzRUYtXFx1MDNGM1xcdTAzRjVcXHUwM0Y4XFx1MDNGQlxcdTAzRkNcXHUwNDMwLVxcdTA0NUZcXHUwNDYxXFx1MDQ2M1xcdTA0NjVcXHUwNDY3XFx1MDQ2OVxcdTA0NkJcXHUwNDZEXFx1MDQ2RlxcdTA0NzFcXHUwNDczXFx1MDQ3NVxcdTA0NzdcXHUwNDc5XFx1MDQ3QlxcdTA0N0RcXHUwNDdGXFx1MDQ4MVxcdTA0OEJcXHUwNDhEXFx1MDQ4RlxcdTA0OTFcXHUwNDkzXFx1MDQ5NVxcdTA0OTdcXHUwNDk5XFx1MDQ5QlxcdTA0OURcXHUwNDlGXFx1MDRBMVxcdTA0QTNcXHUwNEE1XFx1MDRBN1xcdTA0QTlcXHUwNEFCXFx1MDRBRFxcdTA0QUZcXHUwNEIxXFx1MDRCM1xcdTA0QjVcXHUwNEI3XFx1MDRCOVxcdTA0QkJcXHUwNEJEXFx1MDRCRlxcdTA0QzJcXHUwNEM0XFx1MDRDNlxcdTA0QzhcXHUwNENBXFx1MDRDQ1xcdTA0Q0VcXHUwNENGXFx1MDREMVxcdTA0RDNcXHUwNEQ1XFx1MDREN1xcdTA0RDlcXHUwNERCXFx1MDRERFxcdTA0REZcXHUwNEUxXFx1MDRFM1xcdTA0RTVcXHUwNEU3XFx1MDRFOVxcdTA0RUJcXHUwNEVEXFx1MDRFRlxcdTA0RjFcXHUwNEYzXFx1MDRGNVxcdTA0RjdcXHUwNEY5XFx1MDRGQlxcdTA0RkRcXHUwNEZGXFx1MDUwMVxcdTA1MDNcXHUwNTA1XFx1MDUwN1xcdTA1MDlcXHUwNTBCXFx1MDUwRFxcdTA1MEZcXHUwNTExXFx1MDUxM1xcdTA1MTVcXHUwNTE3XFx1MDUxOVxcdTA1MUJcXHUwNTFEXFx1MDUxRlxcdTA1MjFcXHUwNTIzXFx1MDUyNVxcdTA1MjdcXHUwNTI5XFx1MDUyQlxcdTA1MkRcXHUwNTJGXFx1MDU2MS1cXHUwNTg3XFx1MTNGOC1cXHUxM0ZEXFx1MUM4MC1cXHUxQzg4XFx1MUQwMC1cXHUxRDJCXFx1MUQ2Qi1cXHUxRDc3XFx1MUQ3OS1cXHUxRDlBXFx1MUUwMVxcdTFFMDNcXHUxRTA1XFx1MUUwN1xcdTFFMDlcXHUxRTBCXFx1MUUwRFxcdTFFMEZcXHUxRTExXFx1MUUxM1xcdTFFMTVcXHUxRTE3XFx1MUUxOVxcdTFFMUJcXHUxRTFEXFx1MUUxRlxcdTFFMjFcXHUxRTIzXFx1MUUyNVxcdTFFMjdcXHUxRTI5XFx1MUUyQlxcdTFFMkRcXHUxRTJGXFx1MUUzMVxcdTFFMzNcXHUxRTM1XFx1MUUzN1xcdTFFMzlcXHUxRTNCXFx1MUUzRFxcdTFFM0ZcXHUxRTQxXFx1MUU0M1xcdTFFNDVcXHUxRTQ3XFx1MUU0OVxcdTFFNEJcXHUxRTREXFx1MUU0RlxcdTFFNTFcXHUxRTUzXFx1MUU1NVxcdTFFNTdcXHUxRTU5XFx1MUU1QlxcdTFFNURcXHUxRTVGXFx1MUU2MVxcdTFFNjNcXHUxRTY1XFx1MUU2N1xcdTFFNjlcXHUxRTZCXFx1MUU2RFxcdTFFNkZcXHUxRTcxXFx1MUU3M1xcdTFFNzVcXHUxRTc3XFx1MUU3OVxcdTFFN0JcXHUxRTdEXFx1MUU3RlxcdTFFODFcXHUxRTgzXFx1MUU4NVxcdTFFODdcXHUxRTg5XFx1MUU4QlxcdTFFOERcXHUxRThGXFx1MUU5MVxcdTFFOTNcXHUxRTk1LVxcdTFFOURcXHUxRTlGXFx1MUVBMVxcdTFFQTNcXHUxRUE1XFx1MUVBN1xcdTFFQTlcXHUxRUFCXFx1MUVBRFxcdTFFQUZcXHUxRUIxXFx1MUVCM1xcdTFFQjVcXHUxRUI3XFx1MUVCOVxcdTFFQkJcXHUxRUJEXFx1MUVCRlxcdTFFQzFcXHUxRUMzXFx1MUVDNVxcdTFFQzdcXHUxRUM5XFx1MUVDQlxcdTFFQ0RcXHUxRUNGXFx1MUVEMVxcdTFFRDNcXHUxRUQ1XFx1MUVEN1xcdTFFRDlcXHUxRURCXFx1MUVERFxcdTFFREZcXHUxRUUxXFx1MUVFM1xcdTFFRTVcXHUxRUU3XFx1MUVFOVxcdTFFRUJcXHUxRUVEXFx1MUVFRlxcdTFFRjFcXHUxRUYzXFx1MUVGNVxcdTFFRjdcXHUxRUY5XFx1MUVGQlxcdTFFRkRcXHUxRUZGLVxcdTFGMDdcXHUxRjEwLVxcdTFGMTVcXHUxRjIwLVxcdTFGMjdcXHUxRjMwLVxcdTFGMzdcXHUxRjQwLVxcdTFGNDVcXHUxRjUwLVxcdTFGNTdcXHUxRjYwLVxcdTFGNjdcXHUxRjcwLVxcdTFGN0RcXHUxRjgwLVxcdTFGODdcXHUxRjkwLVxcdTFGOTdcXHUxRkEwLVxcdTFGQTdcXHUxRkIwLVxcdTFGQjRcXHUxRkI2XFx1MUZCN1xcdTFGQkVcXHUxRkMyLVxcdTFGQzRcXHUxRkM2XFx1MUZDN1xcdTFGRDAtXFx1MUZEM1xcdTFGRDZcXHUxRkQ3XFx1MUZFMC1cXHUxRkU3XFx1MUZGMi1cXHUxRkY0XFx1MUZGNlxcdTFGRjdcXHUyMTBBXFx1MjEwRVxcdTIxMEZcXHUyMTEzXFx1MjEyRlxcdTIxMzRcXHUyMTM5XFx1MjEzQ1xcdTIxM0RcXHUyMTQ2LVxcdTIxNDlcXHUyMTRFXFx1MjE4NFxcdTJDMzAtXFx1MkM1RVxcdTJDNjFcXHUyQzY1XFx1MkM2NlxcdTJDNjhcXHUyQzZBXFx1MkM2Q1xcdTJDNzFcXHUyQzczXFx1MkM3NFxcdTJDNzYtXFx1MkM3QlxcdTJDODFcXHUyQzgzXFx1MkM4NVxcdTJDODdcXHUyQzg5XFx1MkM4QlxcdTJDOERcXHUyQzhGXFx1MkM5MVxcdTJDOTNcXHUyQzk1XFx1MkM5N1xcdTJDOTlcXHUyQzlCXFx1MkM5RFxcdTJDOUZcXHUyQ0ExXFx1MkNBM1xcdTJDQTVcXHUyQ0E3XFx1MkNBOVxcdTJDQUJcXHUyQ0FEXFx1MkNBRlxcdTJDQjFcXHUyQ0IzXFx1MkNCNVxcdTJDQjdcXHUyQ0I5XFx1MkNCQlxcdTJDQkRcXHUyQ0JGXFx1MkNDMVxcdTJDQzNcXHUyQ0M1XFx1MkNDN1xcdTJDQzlcXHUyQ0NCXFx1MkNDRFxcdTJDQ0ZcXHUyQ0QxXFx1MkNEM1xcdTJDRDVcXHUyQ0Q3XFx1MkNEOVxcdTJDREJcXHUyQ0REXFx1MkNERlxcdTJDRTFcXHUyQ0UzXFx1MkNFNFxcdTJDRUNcXHUyQ0VFXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1QTY0MVxcdUE2NDNcXHVBNjQ1XFx1QTY0N1xcdUE2NDlcXHVBNjRCXFx1QTY0RFxcdUE2NEZcXHVBNjUxXFx1QTY1M1xcdUE2NTVcXHVBNjU3XFx1QTY1OVxcdUE2NUJcXHVBNjVEXFx1QTY1RlxcdUE2NjFcXHVBNjYzXFx1QTY2NVxcdUE2NjdcXHVBNjY5XFx1QTY2QlxcdUE2NkRcXHVBNjgxXFx1QTY4M1xcdUE2ODVcXHVBNjg3XFx1QTY4OVxcdUE2OEJcXHVBNjhEXFx1QTY4RlxcdUE2OTFcXHVBNjkzXFx1QTY5NVxcdUE2OTdcXHVBNjk5XFx1QTY5QlxcdUE3MjNcXHVBNzI1XFx1QTcyN1xcdUE3MjlcXHVBNzJCXFx1QTcyRFxcdUE3MkYtXFx1QTczMVxcdUE3MzNcXHVBNzM1XFx1QTczN1xcdUE3MzlcXHVBNzNCXFx1QTczRFxcdUE3M0ZcXHVBNzQxXFx1QTc0M1xcdUE3NDVcXHVBNzQ3XFx1QTc0OVxcdUE3NEJcXHVBNzREXFx1QTc0RlxcdUE3NTFcXHVBNzUzXFx1QTc1NVxcdUE3NTdcXHVBNzU5XFx1QTc1QlxcdUE3NURcXHVBNzVGXFx1QTc2MVxcdUE3NjNcXHVBNzY1XFx1QTc2N1xcdUE3NjlcXHVBNzZCXFx1QTc2RFxcdUE3NkZcXHVBNzcxLVxcdUE3NzhcXHVBNzdBXFx1QTc3Q1xcdUE3N0ZcXHVBNzgxXFx1QTc4M1xcdUE3ODVcXHVBNzg3XFx1QTc4Q1xcdUE3OEVcXHVBNzkxXFx1QTc5My1cXHVBNzk1XFx1QTc5N1xcdUE3OTlcXHVBNzlCXFx1QTc5RFxcdUE3OUZcXHVBN0ExXFx1QTdBM1xcdUE3QTVcXHVBN0E3XFx1QTdBOVxcdUE3QjVcXHVBN0I3XFx1QTdGQVxcdUFCMzAtXFx1QUI1QVxcdUFCNjAtXFx1QUI2NVxcdUFCNzAtXFx1QUJCRlxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZGNDEtXFx1RkY1QV18XFx1RDgwMVtcXHVEQzI4LVxcdURDNEZcXHVEQ0Q4LVxcdURDRkJdfFxcdUQ4MDNbXFx1RENDMC1cXHVEQ0YyXXxcXHVEODA2W1xcdURDQzAtXFx1RENERl18XFx1RDgzNVtcXHVEQzFBLVxcdURDMzNcXHVEQzRFLVxcdURDNTRcXHVEQzU2LVxcdURDNjdcXHVEQzgyLVxcdURDOUJcXHVEQ0I2LVxcdURDQjlcXHVEQ0JCXFx1RENCRC1cXHVEQ0MzXFx1RENDNS1cXHVEQ0NGXFx1RENFQS1cXHVERDAzXFx1REQxRS1cXHVERDM3XFx1REQ1Mi1cXHVERDZCXFx1REQ4Ni1cXHVERDlGXFx1RERCQS1cXHVEREQzXFx1RERFRS1cXHVERTA3XFx1REUyMi1cXHVERTNCXFx1REU1Ni1cXHVERTZGXFx1REU4QS1cXHVERUE1XFx1REVDMi1cXHVERURBXFx1REVEQy1cXHVERUUxXFx1REVGQy1cXHVERjE0XFx1REYxNi1cXHVERjFCXFx1REYzNi1cXHVERjRFXFx1REY1MC1cXHVERjU1XFx1REY3MC1cXHVERjg4XFx1REY4QS1cXHVERjhGXFx1REZBQS1cXHVERkMyXFx1REZDNC1cXHVERkM5XFx1REZDQl18XFx1RDgzQVtcXHVERDIyLVxcdURENDNdLyxcbiAgTHQ6IC9bXFx1MDFDNVxcdTAxQzhcXHUwMUNCXFx1MDFGMlxcdTFGODgtXFx1MUY4RlxcdTFGOTgtXFx1MUY5RlxcdTFGQTgtXFx1MUZBRlxcdTFGQkNcXHUxRkNDXFx1MUZGQ10vLFxuICBMbTogL1tcXHUwMkIwLVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzRcXHUwMzdBXFx1MDU1OVxcdTA2NDBcXHUwNkU1XFx1MDZFNlxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA5NzFcXHUwRTQ2XFx1MEVDNlxcdTEwRkNcXHUxN0Q3XFx1MTg0M1xcdTFBQTdcXHUxQzc4LVxcdTFDN0RcXHUxRDJDLVxcdTFENkFcXHUxRDc4XFx1MUQ5Qi1cXHUxREJGXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyQzdDXFx1MkM3RFxcdTJENkZcXHUyRTJGXFx1MzAwNVxcdTMwMzEtXFx1MzAzNVxcdTMwM0JcXHUzMDlEXFx1MzA5RVxcdTMwRkMtXFx1MzBGRVxcdUEwMTVcXHVBNEY4LVxcdUE0RkRcXHVBNjBDXFx1QTY3RlxcdUE2OUNcXHVBNjlEXFx1QTcxNy1cXHVBNzFGXFx1QTc3MFxcdUE3ODhcXHVBN0Y4XFx1QTdGOVxcdUE5Q0ZcXHVBOUU2XFx1QUE3MFxcdUFBRERcXHVBQUYzXFx1QUFGNFxcdUFCNUMtXFx1QUI1RlxcdUZGNzBcXHVGRjlFXFx1RkY5Rl18XFx1RDgxQVtcXHVERjQwLVxcdURGNDNdfFxcdUQ4MUJbXFx1REY5My1cXHVERjlGXFx1REZFMF0vLFxuICBMbzogL1tcXHhBQVxceEJBXFx1MDFCQlxcdTAxQzAtXFx1MDFDM1xcdTAyOTRcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2M0ZcXHUwNjQxLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA4MDAtXFx1MDgxNVxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA4QjYtXFx1MDhCRFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3Mi1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4MFxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1NC1cXHUwRDU2XFx1MEQ1Ri1cXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ1XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEQwLVxcdTEwRkFcXHUxMEZELVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RjEtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RENcXHUxODIwLVxcdTE4NDJcXHUxODQ0LVxcdTE4NzdcXHUxODgwLVxcdTE4ODRcXHUxODg3LVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDNzdcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTIxMzUtXFx1MjEzOFxcdTJEMzAtXFx1MkQ2N1xcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTMwMDZcXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUEwMTRcXHVBMDE2LVxcdUE0OENcXHVBNEQwLVxcdUE0RjdcXHVBNTAwLVxcdUE2MEJcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NkVcXHVBNkEwLVxcdUE2RTVcXHVBNzhGXFx1QTdGN1xcdUE3RkItXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlFMC1cXHVBOUU0XFx1QTlFNy1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTZGXFx1QUE3MS1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQlxcdUFBRENcXHVBQUUwLVxcdUFBRUFcXHVBQUYyXFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUJDMC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkY2Ni1cXHVGRjZGXFx1RkY3MS1cXHVGRjlEXFx1RkZBMC1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXXxcXHVEODAwW1xcdURDMDAtXFx1REMwQlxcdURDMEQtXFx1REMyNlxcdURDMjgtXFx1REMzQVxcdURDM0NcXHVEQzNEXFx1REMzRi1cXHVEQzREXFx1REM1MC1cXHVEQzVEXFx1REM4MC1cXHVEQ0ZBXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REYwMC1cXHVERjFGXFx1REYzMC1cXHVERjQwXFx1REY0Mi1cXHVERjQ5XFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXXxcXHVEODAxW1xcdURDNTAtXFx1REM5RFxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM2MC1cXHVEQzc2XFx1REM4MC1cXHVEQzlFXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVERDAwLVxcdUREMTVcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdUREMDMtXFx1REQyNlxcdURENTAtXFx1REQ3MlxcdURENzZcXHVERDgzLVxcdUREQjJcXHVEREMxLVxcdUREQzRcXHVERERBXFx1REREQ1xcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REMwMC1cXHVEQzM0XFx1REM0Ny1cXHVEQzRBXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFODAtXFx1REVBQVxcdURGMDAtXFx1REYxOV18XFx1RDgwNltcXHVEQ0ZGXFx1REVDMC1cXHVERUY4XXxcXHVEODA3W1xcdURDMDAtXFx1REMwOFxcdURDMEEtXFx1REMyRVxcdURDNDBcXHVEQzcyLVxcdURDOEZdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODFDLVxcdUQ4MjBcXHVEODQwLVxcdUQ4NjhcXHVEODZBLVxcdUQ4NkNcXHVEODZGLVxcdUQ4NzJdW1xcdURDMDAtXFx1REZGRl18XFx1RDgwRFtcXHVEQzAwLVxcdURDMkVdfFxcdUQ4MTFbXFx1REMwMC1cXHVERTQ2XXxcXHVEODFBW1xcdURDMDAtXFx1REUzOFxcdURFNDAtXFx1REU1RVxcdURFRDAtXFx1REVFRFxcdURGMDAtXFx1REYyRlxcdURGNjMtXFx1REY3N1xcdURGN0QtXFx1REY4Rl18XFx1RDgxQltcXHVERjAwLVxcdURGNDRcXHVERjUwXXxcXHVEODIxW1xcdURDMDAtXFx1REZFQ118XFx1RDgyMltcXHVEQzAwLVxcdURFRjJdfFxcdUQ4MkNbXFx1REMwMFxcdURDMDFdfFxcdUQ4MkZbXFx1REMwMC1cXHVEQzZBXFx1REM3MC1cXHVEQzdDXFx1REM4MC1cXHVEQzg4XFx1REM5MC1cXHVEQzk5XXxcXHVEODNBW1xcdURDMDAtXFx1RENDNF18XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXXxcXHVEODY5W1xcdURDMDAtXFx1REVENlxcdURGMDAtXFx1REZGRl18XFx1RDg2RFtcXHVEQzAwLVxcdURGMzRcXHVERjQwLVxcdURGRkZdfFxcdUQ4NkVbXFx1REMwMC1cXHVEQzFEXFx1REMyMC1cXHVERkZGXXxcXHVEODczW1xcdURDMDAtXFx1REVBMV18XFx1RDg3RVtcXHVEQzAwLVxcdURFMURdLyxcblxuICAvLyBOdW1iZXJzXG4gIE5sOiAvW1xcdTE2RUUtXFx1MTZGMFxcdTIxNjAtXFx1MjE4MlxcdTIxODUtXFx1MjE4OFxcdTMwMDdcXHUzMDIxLVxcdTMwMjlcXHUzMDM4LVxcdTMwM0FcXHVBNkU2LVxcdUE2RUZdfFxcdUQ4MDBbXFx1REQ0MC1cXHVERDc0XFx1REY0MVxcdURGNEFcXHVERkQxLVxcdURGRDVdfFxcdUQ4MDlbXFx1REMwMC1cXHVEQzZFXS8sXG4gIE5kOiAvWzAtOVxcdTA2NjAtXFx1MDY2OVxcdTA2RjAtXFx1MDZGOVxcdTA3QzAtXFx1MDdDOVxcdTA5NjYtXFx1MDk2RlxcdTA5RTYtXFx1MDlFRlxcdTBBNjYtXFx1MEE2RlxcdTBBRTYtXFx1MEFFRlxcdTBCNjYtXFx1MEI2RlxcdTBCRTYtXFx1MEJFRlxcdTBDNjYtXFx1MEM2RlxcdTBDRTYtXFx1MENFRlxcdTBENjYtXFx1MEQ2RlxcdTBERTYtXFx1MERFRlxcdTBFNTAtXFx1MEU1OVxcdTBFRDAtXFx1MEVEOVxcdTBGMjAtXFx1MEYyOVxcdTEwNDAtXFx1MTA0OVxcdTEwOTAtXFx1MTA5OVxcdTE3RTAtXFx1MTdFOVxcdTE4MTAtXFx1MTgxOVxcdTE5NDYtXFx1MTk0RlxcdTE5RDAtXFx1MTlEOVxcdTFBODAtXFx1MUE4OVxcdTFBOTAtXFx1MUE5OVxcdTFCNTAtXFx1MUI1OVxcdTFCQjAtXFx1MUJCOVxcdTFDNDAtXFx1MUM0OVxcdTFDNTAtXFx1MUM1OVxcdUE2MjAtXFx1QTYyOVxcdUE4RDAtXFx1QThEOVxcdUE5MDAtXFx1QTkwOVxcdUE5RDAtXFx1QTlEOVxcdUE5RjAtXFx1QTlGOVxcdUFBNTAtXFx1QUE1OVxcdUFCRjAtXFx1QUJGOVxcdUZGMTAtXFx1RkYxOV18XFx1RDgwMVtcXHVEQ0EwLVxcdURDQTldfFxcdUQ4MDRbXFx1REM2Ni1cXHVEQzZGXFx1RENGMC1cXHVEQ0Y5XFx1REQzNi1cXHVERDNGXFx1REREMC1cXHVEREQ5XFx1REVGMC1cXHVERUY5XXxbXFx1RDgwNVxcdUQ4MDddW1xcdURDNTAtXFx1REM1OVxcdURDRDAtXFx1RENEOVxcdURFNTAtXFx1REU1OVxcdURFQzAtXFx1REVDOVxcdURGMzAtXFx1REYzOV18XFx1RDgwNltcXHVEQ0UwLVxcdURDRTldfFxcdUQ4MUFbXFx1REU2MC1cXHVERTY5XFx1REY1MC1cXHVERjU5XXxcXHVEODM1W1xcdURGQ0UtXFx1REZGRl18XFx1RDgzQVtcXHVERDUwLVxcdURENTldLyxcblxuICAvLyBNYXJrc1xuICBNbjogL1tcXHUwMzAwLVxcdTAzNkZcXHUwNDgzLVxcdTA0ODdcXHUwNTkxLVxcdTA1QkRcXHUwNUJGXFx1MDVDMVxcdTA1QzJcXHUwNUM0XFx1MDVDNVxcdTA1QzdcXHUwNjEwLVxcdTA2MUFcXHUwNjRCLVxcdTA2NUZcXHUwNjcwXFx1MDZENi1cXHUwNkRDXFx1MDZERi1cXHUwNkU0XFx1MDZFN1xcdTA2RThcXHUwNkVBLVxcdTA2RURcXHUwNzExXFx1MDczMC1cXHUwNzRBXFx1MDdBNi1cXHUwN0IwXFx1MDdFQi1cXHUwN0YzXFx1MDgxNi1cXHUwODE5XFx1MDgxQi1cXHUwODIzXFx1MDgyNS1cXHUwODI3XFx1MDgyOS1cXHUwODJEXFx1MDg1OS1cXHUwODVCXFx1MDhENC1cXHUwOEUxXFx1MDhFMy1cXHUwOTAyXFx1MDkzQVxcdTA5M0NcXHUwOTQxLVxcdTA5NDhcXHUwOTREXFx1MDk1MS1cXHUwOTU3XFx1MDk2MlxcdTA5NjNcXHUwOTgxXFx1MDlCQ1xcdTA5QzEtXFx1MDlDNFxcdTA5Q0RcXHUwOUUyXFx1MDlFM1xcdTBBMDFcXHUwQTAyXFx1MEEzQ1xcdTBBNDFcXHUwQTQyXFx1MEE0N1xcdTBBNDhcXHUwQTRCLVxcdTBBNERcXHUwQTUxXFx1MEE3MFxcdTBBNzFcXHUwQTc1XFx1MEE4MVxcdTBBODJcXHUwQUJDXFx1MEFDMS1cXHUwQUM1XFx1MEFDN1xcdTBBQzhcXHUwQUNEXFx1MEFFMlxcdTBBRTNcXHUwQjAxXFx1MEIzQ1xcdTBCM0ZcXHUwQjQxLVxcdTBCNDRcXHUwQjREXFx1MEI1NlxcdTBCNjJcXHUwQjYzXFx1MEI4MlxcdTBCQzBcXHUwQkNEXFx1MEMwMFxcdTBDM0UtXFx1MEM0MFxcdTBDNDYtXFx1MEM0OFxcdTBDNEEtXFx1MEM0RFxcdTBDNTVcXHUwQzU2XFx1MEM2MlxcdTBDNjNcXHUwQzgxXFx1MENCQ1xcdTBDQkZcXHUwQ0M2XFx1MENDQ1xcdTBDQ0RcXHUwQ0UyXFx1MENFM1xcdTBEMDFcXHUwRDQxLVxcdTBENDRcXHUwRDREXFx1MEQ2MlxcdTBENjNcXHUwRENBXFx1MEREMi1cXHUwREQ0XFx1MERENlxcdTBFMzFcXHUwRTM0LVxcdTBFM0FcXHUwRTQ3LVxcdTBFNEVcXHUwRUIxXFx1MEVCNC1cXHUwRUI5XFx1MEVCQlxcdTBFQkNcXHUwRUM4LVxcdTBFQ0RcXHUwRjE4XFx1MEYxOVxcdTBGMzVcXHUwRjM3XFx1MEYzOVxcdTBGNzEtXFx1MEY3RVxcdTBGODAtXFx1MEY4NFxcdTBGODZcXHUwRjg3XFx1MEY4RC1cXHUwRjk3XFx1MEY5OS1cXHUwRkJDXFx1MEZDNlxcdTEwMkQtXFx1MTAzMFxcdTEwMzItXFx1MTAzN1xcdTEwMzlcXHUxMDNBXFx1MTAzRFxcdTEwM0VcXHUxMDU4XFx1MTA1OVxcdTEwNUUtXFx1MTA2MFxcdTEwNzEtXFx1MTA3NFxcdTEwODJcXHUxMDg1XFx1MTA4NlxcdTEwOERcXHUxMDlEXFx1MTM1RC1cXHUxMzVGXFx1MTcxMi1cXHUxNzE0XFx1MTczMi1cXHUxNzM0XFx1MTc1MlxcdTE3NTNcXHUxNzcyXFx1MTc3M1xcdTE3QjRcXHUxN0I1XFx1MTdCNy1cXHUxN0JEXFx1MTdDNlxcdTE3QzktXFx1MTdEM1xcdTE3RERcXHUxODBCLVxcdTE4MERcXHUxODg1XFx1MTg4NlxcdTE4QTlcXHUxOTIwLVxcdTE5MjJcXHUxOTI3XFx1MTkyOFxcdTE5MzJcXHUxOTM5LVxcdTE5M0JcXHUxQTE3XFx1MUExOFxcdTFBMUJcXHUxQTU2XFx1MUE1OC1cXHUxQTVFXFx1MUE2MFxcdTFBNjJcXHUxQTY1LVxcdTFBNkNcXHUxQTczLVxcdTFBN0NcXHUxQTdGXFx1MUFCMC1cXHUxQUJEXFx1MUIwMC1cXHUxQjAzXFx1MUIzNFxcdTFCMzYtXFx1MUIzQVxcdTFCM0NcXHUxQjQyXFx1MUI2Qi1cXHUxQjczXFx1MUI4MFxcdTFCODFcXHUxQkEyLVxcdTFCQTVcXHUxQkE4XFx1MUJBOVxcdTFCQUItXFx1MUJBRFxcdTFCRTZcXHUxQkU4XFx1MUJFOVxcdTFCRURcXHUxQkVGLVxcdTFCRjFcXHUxQzJDLVxcdTFDMzNcXHUxQzM2XFx1MUMzN1xcdTFDRDAtXFx1MUNEMlxcdTFDRDQtXFx1MUNFMFxcdTFDRTItXFx1MUNFOFxcdTFDRURcXHUxQ0Y0XFx1MUNGOFxcdTFDRjlcXHUxREMwLVxcdTFERjVcXHUxREZCLVxcdTFERkZcXHUyMEQwLVxcdTIwRENcXHUyMEUxXFx1MjBFNS1cXHUyMEYwXFx1MkNFRi1cXHUyQ0YxXFx1MkQ3RlxcdTJERTAtXFx1MkRGRlxcdTMwMkEtXFx1MzAyRFxcdTMwOTlcXHUzMDlBXFx1QTY2RlxcdUE2NzQtXFx1QTY3RFxcdUE2OUVcXHVBNjlGXFx1QTZGMFxcdUE2RjFcXHVBODAyXFx1QTgwNlxcdUE4MEJcXHVBODI1XFx1QTgyNlxcdUE4QzRcXHVBOEM1XFx1QThFMC1cXHVBOEYxXFx1QTkyNi1cXHVBOTJEXFx1QTk0Ny1cXHVBOTUxXFx1QTk4MC1cXHVBOTgyXFx1QTlCM1xcdUE5QjYtXFx1QTlCOVxcdUE5QkNcXHVBOUU1XFx1QUEyOS1cXHVBQTJFXFx1QUEzMVxcdUFBMzJcXHVBQTM1XFx1QUEzNlxcdUFBNDNcXHVBQTRDXFx1QUE3Q1xcdUFBQjBcXHVBQUIyLVxcdUFBQjRcXHVBQUI3XFx1QUFCOFxcdUFBQkVcXHVBQUJGXFx1QUFDMVxcdUFBRUNcXHVBQUVEXFx1QUFGNlxcdUFCRTVcXHVBQkU4XFx1QUJFRFxcdUZCMUVcXHVGRTAwLVxcdUZFMEZcXHVGRTIwLVxcdUZFMkZdfFxcdUQ4MDBbXFx1RERGRFxcdURFRTBcXHVERjc2LVxcdURGN0FdfFxcdUQ4MDJbXFx1REUwMS1cXHVERTAzXFx1REUwNVxcdURFMDZcXHVERTBDLVxcdURFMEZcXHVERTM4LVxcdURFM0FcXHVERTNGXFx1REVFNVxcdURFRTZdfFxcdUQ4MDRbXFx1REMwMVxcdURDMzgtXFx1REM0NlxcdURDN0YtXFx1REM4MVxcdURDQjMtXFx1RENCNlxcdURDQjlcXHVEQ0JBXFx1REQwMC1cXHVERDAyXFx1REQyNy1cXHVERDJCXFx1REQyRC1cXHVERDM0XFx1REQ3M1xcdUREODBcXHVERDgxXFx1RERCNi1cXHVEREJFXFx1RERDQS1cXHVERENDXFx1REUyRi1cXHVERTMxXFx1REUzNFxcdURFMzZcXHVERTM3XFx1REUzRVxcdURFREZcXHVERUUzLVxcdURFRUFcXHVERjAwXFx1REYwMVxcdURGM0NcXHVERjQwXFx1REY2Ni1cXHVERjZDXFx1REY3MC1cXHVERjc0XXxcXHVEODA1W1xcdURDMzgtXFx1REMzRlxcdURDNDItXFx1REM0NFxcdURDNDZcXHVEQ0IzLVxcdURDQjhcXHVEQ0JBXFx1RENCRlxcdURDQzBcXHVEQ0MyXFx1RENDM1xcdUREQjItXFx1RERCNVxcdUREQkNcXHVEREJEXFx1RERCRlxcdUREQzBcXHVERERDXFx1RERERFxcdURFMzMtXFx1REUzQVxcdURFM0RcXHVERTNGXFx1REU0MFxcdURFQUJcXHVERUFEXFx1REVCMC1cXHVERUI1XFx1REVCN1xcdURGMUQtXFx1REYxRlxcdURGMjItXFx1REYyNVxcdURGMjctXFx1REYyQl18XFx1RDgwN1tcXHVEQzMwLVxcdURDMzZcXHVEQzM4LVxcdURDM0RcXHVEQzNGXFx1REM5Mi1cXHVEQ0E3XFx1RENBQS1cXHVEQ0IwXFx1RENCMlxcdURDQjNcXHVEQ0I1XFx1RENCNl18XFx1RDgxQVtcXHVERUYwLVxcdURFRjRcXHVERjMwLVxcdURGMzZdfFxcdUQ4MUJbXFx1REY4Ri1cXHVERjkyXXxcXHVEODJGW1xcdURDOURcXHVEQzlFXXxcXHVEODM0W1xcdURENjctXFx1REQ2OVxcdUREN0ItXFx1REQ4MlxcdUREODUtXFx1REQ4QlxcdUREQUEtXFx1RERBRFxcdURFNDItXFx1REU0NF18XFx1RDgzNltcXHVERTAwLVxcdURFMzZcXHVERTNCLVxcdURFNkNcXHVERTc1XFx1REU4NFxcdURFOUItXFx1REU5RlxcdURFQTEtXFx1REVBRl18XFx1RDgzOFtcXHVEQzAwLVxcdURDMDZcXHVEQzA4LVxcdURDMThcXHVEQzFCLVxcdURDMjFcXHVEQzIzXFx1REMyNFxcdURDMjYtXFx1REMyQV18XFx1RDgzQVtcXHVEQ0QwLVxcdURDRDZcXHVERDQ0LVxcdURENEFdfFxcdURCNDBbXFx1REQwMC1cXHVEREVGXS8sXG4gIE1jOiAvW1xcdTA5MDMtXFx1MDkwM118W1xcdTA5M0UtXFx1MDk0MF18W1xcdTA5NDktXFx1MDk0Q118W1xcdTA5ODItXFx1MDk4M118W1xcdTA5QkUtXFx1MDlDMF18W1xcdTA5QzctXFx1MDlDOF18W1xcdTA5Q0ItXFx1MDlDQ118W1xcdTA5RDctXFx1MDlEN118W1xcdTBBM0UtXFx1MEE0MF18W1xcdTBBODMtXFx1MEE4M118W1xcdTBBQkUtXFx1MEFDMF18W1xcdTBBQzktXFx1MEFDOV18W1xcdTBBQ0ItXFx1MEFDQ118W1xcdTBCMDItXFx1MEIwM118W1xcdTBCM0UtXFx1MEIzRV18W1xcdTBCNDAtXFx1MEI0MF18W1xcdTBCNDctXFx1MEI0OF18W1xcdTBCNEItXFx1MEI0Q118W1xcdTBCNTctXFx1MEI1N118W1xcdTBCODMtXFx1MEI4M118W1xcdTBCQkUtXFx1MEJCRl18W1xcdTBCQzEtXFx1MEJDMl18W1xcdTBCQzYtXFx1MEJDOF18W1xcdTBCQ0EtXFx1MEJDQ118W1xcdTBCRDctXFx1MEJEN118W1xcdTBDMDEtXFx1MEMwM118W1xcdTBDNDEtXFx1MEM0NF18W1xcdTBDODItXFx1MEM4M118W1xcdTBDQkUtXFx1MENCRV18W1xcdTBDQzAtXFx1MENDNF18W1xcdTBDQzctXFx1MENDOF18W1xcdTBDQ0EtXFx1MENDQl18W1xcdTBDRDUtXFx1MENENl18W1xcdTBEMDItXFx1MEQwM118W1xcdTBEM0UtXFx1MEQ0MF18W1xcdTBENDYtXFx1MEQ0OF18W1xcdTBENEEtXFx1MEQ0Q118W1xcdTBENTctXFx1MEQ1N118W1xcdTBGM0UtXFx1MEYzRl18W1xcdTBGN0YtXFx1MEY3Rl0vLFxuXG4gIC8vIFB1bmN0dWF0aW9uLCBDb25uZWN0b3JcbiAgUGM6IC9bX1xcdTIwM0ZcXHUyMDQwXFx1MjA1NFxcdUZFMzNcXHVGRTM0XFx1RkU0RC1cXHVGRTRGXFx1RkYzRl0vLFxuXG4gIC8vIFNlcGFyYXRvciwgU3BhY2VcbiAgWnM6IC9bIFxceEEwXFx1MTY4MFxcdTIwMDAtXFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMF0vLFxuXG4gIC8vIFRoZXNlIHR3byBhcmUgbm90IHJlYWwgVW5pY29kZSBjYXRlZ29yaWVzLCBidXQgb3VyIHVzZWZ1bCBmb3IgT2htLlxuICAvLyBMIGlzIGEgY29tYmluYXRpb24gb2YgYWxsIHRoZSBsZXR0ZXIgY2F0ZWdvcmllcy5cbiAgLy8gTHRtbyBpcyBhIGNvbWJpbmF0aW9uIG9mIEx0LCBMbSwgYW5kIExvLlxuICBMOiAvW0EtWmEtelxceEFBXFx4QjVcXHhCQVxceEMwLVxceEQ2XFx4RDgtXFx4RjZcXHhGOC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzcwLVxcdTAzNzRcXHUwMzc2XFx1MDM3N1xcdTAzN0EtXFx1MDM3RFxcdTAzN0ZcXHUwMzg2XFx1MDM4OC1cXHUwMzhBXFx1MDM4Q1xcdTAzOEUtXFx1MDNBMVxcdTAzQTMtXFx1MDNGNVxcdTAzRjctXFx1MDQ4MVxcdTA0OEEtXFx1MDUyRlxcdTA1MzEtXFx1MDU1NlxcdTA1NTlcXHUwNTYxLVxcdTA1ODdcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkU1XFx1MDZFNlxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDhCNi1cXHUwOEJEXFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcxLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzgwXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDU0LVxcdTBENTZcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEEwLVxcdTEwQzVcXHUxMEM3XFx1MTBDRFxcdTEwRDAtXFx1MTBGQVxcdTEwRkMtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTNBMC1cXHUxM0Y1XFx1MTNGOC1cXHUxM0ZEXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEN1xcdTE3RENcXHUxODIwLVxcdTE4NzdcXHUxODgwLVxcdTE4ODRcXHUxODg3LVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUFBN1xcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzdEXFx1MUM4MC1cXHUxQzg4XFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE4M1xcdTIxODRcXHUyQzAwLVxcdTJDMkVcXHUyQzMwLVxcdTJDNUVcXHUyQzYwLVxcdTJDRTRcXHUyQ0VCLVxcdTJDRUVcXHUyQ0YyXFx1MkNGM1xcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTJFMkZcXHUzMDA1XFx1MzAwNlxcdTMwMzEtXFx1MzAzNVxcdTMwM0JcXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RC1cXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGQy1cXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBNDhDXFx1QTREMC1cXHVBNEZEXFx1QTUwMC1cXHVBNjBDXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OURcXHVBNkEwLVxcdUE2RTVcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3QUVcXHVBN0IwLVxcdUE3QjdcXHVBN0Y3LVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5Q0ZcXHVBOUUwLVxcdUE5RTRcXHVBOUU2LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUFcXHVBQUYyLVxcdUFBRjRcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQjMwLVxcdUFCNUFcXHVBQjVDLVxcdUFCNjVcXHVBQjcwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjIxLVxcdUZGM0FcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERTgwLVxcdURFOUNcXHVERUEwLVxcdURFRDBcXHVERjAwLVxcdURGMUZcXHVERjMwLVxcdURGNDBcXHVERjQyLVxcdURGNDlcXHVERjUwLVxcdURGNzVcXHVERjgwLVxcdURGOURcXHVERkEwLVxcdURGQzNcXHVERkM4LVxcdURGQ0ZdfFxcdUQ4MDFbXFx1REMwMC1cXHVEQzlEXFx1RENCMC1cXHVEQ0QzXFx1RENEOC1cXHVEQ0ZCXFx1REQwMC1cXHVERDI3XFx1REQzMC1cXHVERDYzXFx1REUwMC1cXHVERjM2XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjY3XXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzYwLVxcdURDNzZcXHVEQzgwLVxcdURDOUVcXHVEQ0UwLVxcdURDRjJcXHVEQ0Y0XFx1RENGNVxcdUREMDAtXFx1REQxNVxcdUREMjAtXFx1REQzOVxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNjAtXFx1REU3Q1xcdURFODAtXFx1REU5Q1xcdURFQzAtXFx1REVDN1xcdURFQzktXFx1REVFNFxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY3MlxcdURGODAtXFx1REY5MV18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhcXHVEQzgwLVxcdURDQjJcXHVEQ0MwLVxcdURDRjJdfFxcdUQ4MDRbXFx1REMwMy1cXHVEQzM3XFx1REM4My1cXHVEQ0FGXFx1RENEMC1cXHVEQ0U4XFx1REQwMy1cXHVERDI2XFx1REQ1MC1cXHVERDcyXFx1REQ3NlxcdUREODMtXFx1RERCMlxcdUREQzEtXFx1RERDNFxcdUREREFcXHVERERDXFx1REUwMC1cXHVERTExXFx1REUxMy1cXHVERTJCXFx1REU4MC1cXHVERTg2XFx1REU4OFxcdURFOEEtXFx1REU4RFxcdURFOEYtXFx1REU5RFxcdURFOUYtXFx1REVBOFxcdURFQjAtXFx1REVERVxcdURGMDUtXFx1REYwQ1xcdURGMEZcXHVERjEwXFx1REYxMy1cXHVERjI4XFx1REYyQS1cXHVERjMwXFx1REYzMlxcdURGMzNcXHVERjM1LVxcdURGMzlcXHVERjNEXFx1REY1MFxcdURGNUQtXFx1REY2MV18XFx1RDgwNVtcXHVEQzAwLVxcdURDMzRcXHVEQzQ3LVxcdURDNEFcXHVEQzgwLVxcdURDQUZcXHVEQ0M0XFx1RENDNVxcdURDQzdcXHVERDgwLVxcdUREQUVcXHVEREQ4LVxcdUREREJcXHVERTAwLVxcdURFMkZcXHVERTQ0XFx1REU4MC1cXHVERUFBXFx1REYwMC1cXHVERjE5XXxcXHVEODA2W1xcdURDQTAtXFx1RENERlxcdURDRkZcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDdbXFx1REMwMC1cXHVEQzA4XFx1REMwQS1cXHVEQzJFXFx1REM0MFxcdURDNzItXFx1REM4Rl18XFx1RDgwOFtcXHVEQzAwLVxcdURGOTldfFxcdUQ4MDlbXFx1REM4MC1cXHVERDQzXXxbXFx1RDgwQ1xcdUQ4MUMtXFx1RDgyMFxcdUQ4NDAtXFx1RDg2OFxcdUQ4NkEtXFx1RDg2Q1xcdUQ4NkYtXFx1RDg3Ml1bXFx1REMwMC1cXHVERkZGXXxcXHVEODBEW1xcdURDMDAtXFx1REMyRV18XFx1RDgxMVtcXHVEQzAwLVxcdURFNDZdfFxcdUQ4MUFbXFx1REMwMC1cXHVERTM4XFx1REU0MC1cXHVERTVFXFx1REVEMC1cXHVERUVEXFx1REYwMC1cXHVERjJGXFx1REY0MC1cXHVERjQzXFx1REY2My1cXHVERjc3XFx1REY3RC1cXHVERjhGXXxcXHVEODFCW1xcdURGMDAtXFx1REY0NFxcdURGNTBcXHVERjkzLVxcdURGOUZcXHVERkUwXXxcXHVEODIxW1xcdURDMDAtXFx1REZFQ118XFx1RDgyMltcXHVEQzAwLVxcdURFRjJdfFxcdUQ4MkNbXFx1REMwMFxcdURDMDFdfFxcdUQ4MkZbXFx1REMwMC1cXHVEQzZBXFx1REM3MC1cXHVEQzdDXFx1REM4MC1cXHVEQzg4XFx1REM5MC1cXHVEQzk5XXxcXHVEODM1W1xcdURDMDAtXFx1REM1NFxcdURDNTYtXFx1REM5Q1xcdURDOUVcXHVEQzlGXFx1RENBMlxcdURDQTVcXHVEQ0E2XFx1RENBOS1cXHVEQ0FDXFx1RENBRS1cXHVEQ0I5XFx1RENCQlxcdURDQkQtXFx1RENDM1xcdURDQzUtXFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMUUtXFx1REQzOVxcdUREM0ItXFx1REQzRVxcdURENDAtXFx1REQ0NFxcdURENDZcXHVERDRBLVxcdURENTBcXHVERDUyLVxcdURFQTVcXHVERUE4LVxcdURFQzBcXHVERUMyLVxcdURFREFcXHVERURDLVxcdURFRkFcXHVERUZDLVxcdURGMTRcXHVERjE2LVxcdURGMzRcXHVERjM2LVxcdURGNEVcXHVERjUwLVxcdURGNkVcXHVERjcwLVxcdURGODhcXHVERjhBLVxcdURGQThcXHVERkFBLVxcdURGQzJcXHVERkM0LVxcdURGQ0JdfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XFx1REQwMC1cXHVERDQzXXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4NjlbXFx1REMwMC1cXHVERUQ2XFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF0vLFxuICBMdG1vOiAvW1xcdTAxQzVcXHUwMUM4XFx1MDFDQlxcdTAxRjJcXHUxRjg4LVxcdTFGOEZcXHUxRjk4LVxcdTFGOUZcXHUxRkE4LVxcdTFGQUZcXHUxRkJDXFx1MUZDQ1xcdTFGRkNdfFtcXHUwMkIwLVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzRcXHUwMzdBXFx1MDU1OVxcdTA2NDBcXHUwNkU1XFx1MDZFNlxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA5NzFcXHUwRTQ2XFx1MEVDNlxcdTEwRkNcXHUxN0Q3XFx1MTg0M1xcdTFBQTdcXHUxQzc4LVxcdTFDN0RcXHUxRDJDLVxcdTFENkFcXHUxRDc4XFx1MUQ5Qi1cXHUxREJGXFx1MjA3MVxcdTIwN0ZcXHUyMDkwLVxcdTIwOUNcXHUyQzdDXFx1MkM3RFxcdTJENkZcXHUyRTJGXFx1MzAwNVxcdTMwMzEtXFx1MzAzNVxcdTMwM0JcXHUzMDlEXFx1MzA5RVxcdTMwRkMtXFx1MzBGRVxcdUEwMTVcXHVBNEY4LVxcdUE0RkRcXHVBNjBDXFx1QTY3RlxcdUE2OUNcXHVBNjlEXFx1QTcxNy1cXHVBNzFGXFx1QTc3MFxcdUE3ODhcXHVBN0Y4XFx1QTdGOVxcdUE5Q0ZcXHVBOUU2XFx1QUE3MFxcdUFBRERcXHVBQUYzXFx1QUFGNFxcdUFCNUMtXFx1QUI1RlxcdUZGNzBcXHVGRjlFXFx1RkY5Rl18XFx1RDgxQVtcXHVERjQwLVxcdURGNDNdfFxcdUQ4MUJbXFx1REY5My1cXHVERjlGXFx1REZFMF18W1xceEFBXFx4QkFcXHUwMUJCXFx1MDFDMC1cXHUwMUMzXFx1MDI5NFxcdTA1RDAtXFx1MDVFQVxcdTA1RjAtXFx1MDVGMlxcdTA2MjAtXFx1MDYzRlxcdTA2NDEtXFx1MDY0QVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RUVcXHUwNkVGXFx1MDZGQS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDQS1cXHUwN0VBXFx1MDgwMC1cXHUwODE1XFx1MDg0MC1cXHUwODU4XFx1MDhBMC1cXHUwOEI0XFx1MDhCNi1cXHUwOEJEXFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTcyLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlGMFxcdTA5RjFcXHUwQTA1LVxcdTBBMEFcXHUwQTBGXFx1MEExMFxcdTBBMTMtXFx1MEEyOFxcdTBBMkEtXFx1MEEzMFxcdTBBMzJcXHUwQTMzXFx1MEEzNVxcdTBBMzZcXHUwQTM4XFx1MEEzOVxcdTBBNTktXFx1MEE1Q1xcdTBBNUVcXHUwQTcyLVxcdTBBNzRcXHUwQTg1LVxcdTBBOERcXHUwQThGLVxcdTBBOTFcXHUwQTkzLVxcdTBBQThcXHUwQUFBLVxcdTBBQjBcXHUwQUIyXFx1MEFCM1xcdTBBQjUtXFx1MEFCOVxcdTBBQkRcXHUwQUQwXFx1MEFFMFxcdTBBRTFcXHUwQUY5XFx1MEIwNS1cXHUwQjBDXFx1MEIwRlxcdTBCMTBcXHUwQjEzLVxcdTBCMjhcXHUwQjJBLVxcdTBCMzBcXHUwQjMyXFx1MEIzM1xcdTBCMzUtXFx1MEIzOVxcdTBCM0RcXHUwQjVDXFx1MEI1RFxcdTBCNUYtXFx1MEI2MVxcdTBCNzFcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzgwXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRjFcXHUwQ0YyXFx1MEQwNS1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDU0LVxcdTBENTZcXHUwRDVGLVxcdTBENjFcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDVcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg3XFx1MEU4OFxcdTBFOEFcXHUwRThEXFx1MEU5NC1cXHUwRTk3XFx1MEU5OS1cXHUwRTlGXFx1MEVBMS1cXHUwRUEzXFx1MEVBNVxcdTBFQTdcXHUwRUFBXFx1MEVBQlxcdTBFQUQtXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGXFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwRDAtXFx1MTBGQVxcdTEwRkQtXFx1MTI0OFxcdTEyNEEtXFx1MTI0RFxcdTEyNTAtXFx1MTI1NlxcdTEyNThcXHUxMjVBLVxcdTEyNURcXHUxMjYwLVxcdTEyODhcXHUxMjhBLVxcdTEyOERcXHUxMjkwLVxcdTEyQjBcXHUxMkIyLVxcdTEyQjVcXHUxMkI4LVxcdTEyQkVcXHUxMkMwXFx1MTJDMi1cXHUxMkM1XFx1MTJDOC1cXHUxMkQ2XFx1MTJEOC1cXHUxMzEwXFx1MTMxMi1cXHUxMzE1XFx1MTMxOC1cXHUxMzVBXFx1MTM4MC1cXHUxMzhGXFx1MTQwMS1cXHUxNjZDXFx1MTY2Ri1cXHUxNjdGXFx1MTY4MS1cXHUxNjlBXFx1MTZBMC1cXHUxNkVBXFx1MTZGMS1cXHUxNkY4XFx1MTcwMC1cXHUxNzBDXFx1MTcwRS1cXHUxNzExXFx1MTcyMC1cXHUxNzMxXFx1MTc0MC1cXHUxNzUxXFx1MTc2MC1cXHUxNzZDXFx1MTc2RS1cXHUxNzcwXFx1MTc4MC1cXHUxN0IzXFx1MTdEQ1xcdTE4MjAtXFx1MTg0MlxcdTE4NDQtXFx1MTg3N1xcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTUwLVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3N1xcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MjEzNS1cXHUyMTM4XFx1MkQzMC1cXHUyRDY3XFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MzAwNlxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlGXFx1MzBBMS1cXHUzMEZBXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTAxNFxcdUEwMTYtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGN1xcdUE1MDAtXFx1QTYwQlxcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY2RVxcdUE2QTAtXFx1QTZFNVxcdUE3OEZcXHVBN0Y3XFx1QTdGQi1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUUwLVxcdUE5RTRcXHVBOUU3LVxcdUE5RUZcXHVBOUZBLVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTYwLVxcdUFBNkZcXHVBQTcxLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCXFx1QUFEQ1xcdUFBRTAtXFx1QUFFQVxcdUFBRjJcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQkMwLVxcdUFCRTJcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjY2LVxcdUZGNkZcXHVGRjcxLVxcdUZGOURcXHVGRkEwLVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERTgwLVxcdURFOUNcXHVERUEwLVxcdURFRDBcXHVERjAwLVxcdURGMUZcXHVERjMwLVxcdURGNDBcXHVERjQyLVxcdURGNDlcXHVERjUwLVxcdURGNzVcXHVERjgwLVxcdURGOURcXHVERkEwLVxcdURGQzNcXHVERkM4LVxcdURGQ0ZdfFxcdUQ4MDFbXFx1REM1MC1cXHVEQzlEXFx1REQwMC1cXHVERDI3XFx1REQzMC1cXHVERDYzXFx1REUwMC1cXHVERjM2XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjY3XXxcXHVEODAyW1xcdURDMDAtXFx1REMwNVxcdURDMDhcXHVEQzBBLVxcdURDMzVcXHVEQzM3XFx1REMzOFxcdURDM0NcXHVEQzNGLVxcdURDNTVcXHVEQzYwLVxcdURDNzZcXHVEQzgwLVxcdURDOUVcXHVEQ0UwLVxcdURDRjJcXHVEQ0Y0XFx1RENGNVxcdUREMDAtXFx1REQxNVxcdUREMjAtXFx1REQzOVxcdUREODAtXFx1RERCN1xcdUREQkVcXHVEREJGXFx1REUwMFxcdURFMTAtXFx1REUxM1xcdURFMTUtXFx1REUxN1xcdURFMTktXFx1REUzM1xcdURFNjAtXFx1REU3Q1xcdURFODAtXFx1REU5Q1xcdURFQzAtXFx1REVDN1xcdURFQzktXFx1REVFNFxcdURGMDAtXFx1REYzNVxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY3MlxcdURGODAtXFx1REY5MV18XFx1RDgwM1tcXHVEQzAwLVxcdURDNDhdfFxcdUQ4MDRbXFx1REMwMy1cXHVEQzM3XFx1REM4My1cXHVEQ0FGXFx1RENEMC1cXHVEQ0U4XFx1REQwMy1cXHVERDI2XFx1REQ1MC1cXHVERDcyXFx1REQ3NlxcdUREODMtXFx1RERCMlxcdUREQzEtXFx1RERDNFxcdUREREFcXHVERERDXFx1REUwMC1cXHVERTExXFx1REUxMy1cXHVERTJCXFx1REU4MC1cXHVERTg2XFx1REU4OFxcdURFOEEtXFx1REU4RFxcdURFOEYtXFx1REU5RFxcdURFOUYtXFx1REVBOFxcdURFQjAtXFx1REVERVxcdURGMDUtXFx1REYwQ1xcdURGMEZcXHVERjEwXFx1REYxMy1cXHVERjI4XFx1REYyQS1cXHVERjMwXFx1REYzMlxcdURGMzNcXHVERjM1LVxcdURGMzlcXHVERjNEXFx1REY1MFxcdURGNUQtXFx1REY2MV18XFx1RDgwNVtcXHVEQzAwLVxcdURDMzRcXHVEQzQ3LVxcdURDNEFcXHVEQzgwLVxcdURDQUZcXHVEQ0M0XFx1RENDNVxcdURDQzdcXHVERDgwLVxcdUREQUVcXHVEREQ4LVxcdUREREJcXHVERTAwLVxcdURFMkZcXHVERTQ0XFx1REU4MC1cXHVERUFBXFx1REYwMC1cXHVERjE5XXxcXHVEODA2W1xcdURDRkZcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDdbXFx1REMwMC1cXHVEQzA4XFx1REMwQS1cXHVEQzJFXFx1REM0MFxcdURDNzItXFx1REM4Rl18XFx1RDgwOFtcXHVEQzAwLVxcdURGOTldfFxcdUQ4MDlbXFx1REM4MC1cXHVERDQzXXxbXFx1RDgwQ1xcdUQ4MUMtXFx1RDgyMFxcdUQ4NDAtXFx1RDg2OFxcdUQ4NkEtXFx1RDg2Q1xcdUQ4NkYtXFx1RDg3Ml1bXFx1REMwMC1cXHVERkZGXXxcXHVEODBEW1xcdURDMDAtXFx1REMyRV18XFx1RDgxMVtcXHVEQzAwLVxcdURFNDZdfFxcdUQ4MUFbXFx1REMwMC1cXHVERTM4XFx1REU0MC1cXHVERTVFXFx1REVEMC1cXHVERUVEXFx1REYwMC1cXHVERjJGXFx1REY2My1cXHVERjc3XFx1REY3RC1cXHVERjhGXXxcXHVEODFCW1xcdURGMDAtXFx1REY0NFxcdURGNTBdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkVDXXxcXHVEODIyW1xcdURDMDAtXFx1REVGMl18XFx1RDgyQ1tcXHVEQzAwXFx1REMwMV18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XXxcXHVEODNCW1xcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4NjlbXFx1REMwMC1cXHVERUQ2XFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF0vXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==