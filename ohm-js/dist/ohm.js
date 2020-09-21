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

/***/ "../node_modules/inherits/inherits_browser.js":
/*!****************************************************!*\
  !*** ../node_modules/inherits/inherits_browser.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

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
module.exports = ohm.makeRecipe(["grammar",{"source":"BuiltInRules {\n\n  alnum  (an alpha-numeric character)\n    = letter\n    | digit\n\n  letter  (a letter)\n    = lower\n    | upper\n    | unicodeLtmo\n\n  digit  (a digit)\n    = \"0\"..\"9\"\n\n  hexDigit  (a hexadecimal digit)\n    = digit\n    | \"a\"..\"f\"\n    | \"A\"..\"F\"\n\n  ListOf<elem, sep>\n    = NonemptyListOf<elem, sep>\n    | EmptyListOf<elem, sep>\n\n  NonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  EmptyListOf<elem, sep>\n    = /* nothing */\n\n  listOf<elem, sep>\n    = nonemptyListOf<elem, sep>\n    | emptyListOf<elem, sep>\n\n  nonemptyListOf<elem, sep>\n    = elem (sep elem)*\n\n  emptyListOf<elem, sep>\n    = /* nothing */\n\n}"},"BuiltInRules",null,null,{"alnum":["define",{"sourceInterval":[18,78]},"an alpha-numeric character",[],["alt",{"sourceInterval":[60,78]},["app",{"sourceInterval":[60,66]},"letter",[]],["app",{"sourceInterval":[73,78]},"digit",[]]]],"letter":["define",{"sourceInterval":[82,142]},"a letter",[],["alt",{"sourceInterval":[107,142]},["app",{"sourceInterval":[107,112]},"lower",[]],["app",{"sourceInterval":[119,124]},"upper",[]],["app",{"sourceInterval":[131,142]},"unicodeLtmo",[]]]],"digit":["define",{"sourceInterval":[146,177]},"a digit",[],["range",{"sourceInterval":[169,177]},"0","9"]],"hexDigit":["define",{"sourceInterval":[181,254]},"a hexadecimal digit",[],["alt",{"sourceInterval":[219,254]},["app",{"sourceInterval":[219,224]},"digit",[]],["range",{"sourceInterval":[231,239]},"a","f"],["range",{"sourceInterval":[246,254]},"A","F"]]],"ListOf":["define",{"sourceInterval":[258,336]},null,["elem","sep"],["alt",{"sourceInterval":[282,336]},["app",{"sourceInterval":[282,307]},"NonemptyListOf",[["param",{},0],["param",{},1]]],["app",{"sourceInterval":[314,336]},"EmptyListOf",[["param",{},0],["param",{},1]]]]],"NonemptyListOf":["define",{"sourceInterval":[340,388]},null,["elem","sep"],["seq",{"sourceInterval":[372,388]},["param",{},0],["star",{"sourceInterval":[377,388]},["seq",{"sourceInterval":[378,386]},["param",{},1],["param",{},0]]]]],"EmptyListOf":["define",{"sourceInterval":[392,434]},null,["elem","sep"],["seq",{"sourceInterval":[438,438]}]],"listOf":["define",{"sourceInterval":[438,516]},null,["elem","sep"],["alt",{"sourceInterval":[462,516]},["app",{"sourceInterval":[462,487]},"nonemptyListOf",[["param",{},0],["param",{},1]]],["app",{"sourceInterval":[494,516]},"emptyListOf",[["param",{},0],["param",{},1]]]]],"nonemptyListOf":["define",{"sourceInterval":[520,568]},null,["elem","sep"],["seq",{"sourceInterval":[552,568]},["param",{},0],["star",{"sourceInterval":[557,568]},["seq",{"sourceInterval":[558,566]},["param",{},1],["param",{},0]]]]],"emptyListOf":["define",{"sourceInterval":[572,614]},null,["elem","sep"],["seq",{"sourceInterval":[616,616]}]]}]);


/***/ }),

/***/ "./dist/ohm-grammar.js":
/*!*****************************!*\
  !*** ./dist/ohm-grammar.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ohm = __webpack_require__(/*! .. */ "./src/main.js");
module.exports = ohm.makeRecipe(["grammar",{"source":"Ohm {\n\n  Grammars\n    = Grammar*\n\n  Grammar\n    = ident SuperGrammar? \"{\" Rule* \"}\"\n\n  SuperGrammar\n    = \"<:\" ident\n\n  Rule\n    = ident Formals? ruleDescr? \"=\"  RuleBody  -- define\n    | ident Formals?            \":=\" RuleBody  -- override\n    | ident Formals?            \"+=\" RuleBody  -- extend\n\n  RuleBody\n    = \"|\"? NonemptyListOf<TopLevelTerm, \"|\">\n\n  TopLevelTerm\n    = Seq caseName  -- inline\n    | Seq\n\n  Formals\n    = \"<\" ListOf<ident, \",\"> \">\"\n\n  Params\n    = \"<\" ListOf<Seq, \",\"> \">\"\n\n  Alt\n    = NonemptyListOf<Seq, \"|\">\n\n  Seq\n    = Iter*\n\n  Iter\n    = Pred \"*\"  -- star\n    | Pred \"+\"  -- plus\n    | Pred \"?\"  -- opt\n    | Pred\n\n  Pred\n    = \"~\" Lex  -- not\n    | \"&\" Lex  -- lookahead\n    | Lex\n\n  Lex\n    = \"#\" Base  -- lex\n    | Base\n\n  Base\n    = ident Params? ~(ruleDescr? \"=\" | \":=\" | \"+=\")  -- application\n    | oneCharTerminal \"..\" oneCharTerminal           -- range\n    | terminal                                       -- terminal\n    | \"(\" Alt \")\"                                    -- paren\n\n  ruleDescr  (a rule description)\n    = \"(\" ruleDescrText \")\"\n\n  ruleDescrText\n    = (~\")\" any)*\n\n  caseName\n    = \"--\" (~\"\\n\" space)* name (~\"\\n\" space)* (\"\\n\" | &\"}\")\n\n  name  (a name)\n    = nameFirst nameRest*\n\n  nameFirst\n    = \"_\"\n    | letter\n\n  nameRest\n    = \"_\"\n    | alnum\n\n  ident  (an identifier)\n    = name\n\n  terminal\n    = \"\\\"\" terminalChar* \"\\\"\"\n\n  oneCharTerminal\n    = \"\\\"\" terminalChar \"\\\"\"\n\n  terminalChar\n    = escapeChar\n    | ~\"\\\\\" ~\"\\\"\" ~\"\\n\" any\n\n  escapeChar  (an escape sequence)\n    = \"\\\\\\\\\"                                     -- backslash\n    | \"\\\\\\\"\"                                     -- doubleQuote\n    | \"\\\\\\'\"                                     -- singleQuote\n    | \"\\\\b\"                                      -- backspace\n    | \"\\\\n\"                                      -- lineFeed\n    | \"\\\\r\"                                      -- carriageReturn\n    | \"\\\\t\"                                      -- tab\n    | \"\\\\u\" hexDigit hexDigit hexDigit hexDigit  -- unicodeEscape\n    | \"\\\\x\" hexDigit hexDigit                    -- hexEscape\n\n  space\n   += comment\n\n  comment\n    = \"//\" (~\"\\n\" any)* \"\\n\"  -- singleLine\n    | \"/*\" (~\"*/\" any)* \"*/\"  -- multiLine\n\n  tokens = token*\n\n  token = caseName | comment | ident | operator | punctuation | terminal | any\n\n  operator = \"<:\" | \"=\" | \":=\" | \"+=\" | \"*\" | \"+\" | \"?\" | \"~\" | \"&\"\n\n  punctuation = \"<\" | \">\" | \",\" | \"--\"\n}"},"Ohm",null,"Grammars",{"Grammars":["define",{"sourceInterval":[9,32]},null,[],["star",{"sourceInterval":[24,32]},["app",{"sourceInterval":[24,31]},"Grammar",[]]]],"Grammar":["define",{"sourceInterval":[36,83]},null,[],["seq",{"sourceInterval":[50,83]},["app",{"sourceInterval":[50,55]},"ident",[]],["opt",{"sourceInterval":[56,69]},["app",{"sourceInterval":[56,68]},"SuperGrammar",[]]],["terminal",{"sourceInterval":[70,73]},"{"],["star",{"sourceInterval":[74,79]},["app",{"sourceInterval":[74,78]},"Rule",[]]],["terminal",{"sourceInterval":[80,83]},"}"]]],"SuperGrammar":["define",{"sourceInterval":[87,116]},null,[],["seq",{"sourceInterval":[106,116]},["terminal",{"sourceInterval":[106,110]},"<:"],["app",{"sourceInterval":[111,116]},"ident",[]]]],"Rule_define":["define",{"sourceInterval":[131,181]},null,[],["seq",{"sourceInterval":[131,170]},["app",{"sourceInterval":[131,136]},"ident",[]],["opt",{"sourceInterval":[137,145]},["app",{"sourceInterval":[137,144]},"Formals",[]]],["opt",{"sourceInterval":[146,156]},["app",{"sourceInterval":[146,155]},"ruleDescr",[]]],["terminal",{"sourceInterval":[157,160]},"="],["app",{"sourceInterval":[162,170]},"RuleBody",[]]]],"Rule_override":["define",{"sourceInterval":[188,240]},null,[],["seq",{"sourceInterval":[188,227]},["app",{"sourceInterval":[188,193]},"ident",[]],["opt",{"sourceInterval":[194,202]},["app",{"sourceInterval":[194,201]},"Formals",[]]],["terminal",{"sourceInterval":[214,218]},":="],["app",{"sourceInterval":[219,227]},"RuleBody",[]]]],"Rule_extend":["define",{"sourceInterval":[247,297]},null,[],["seq",{"sourceInterval":[247,286]},["app",{"sourceInterval":[247,252]},"ident",[]],["opt",{"sourceInterval":[253,261]},["app",{"sourceInterval":[253,260]},"Formals",[]]],["terminal",{"sourceInterval":[273,277]},"+="],["app",{"sourceInterval":[278,286]},"RuleBody",[]]]],"Rule":["define",{"sourceInterval":[120,297]},null,[],["alt",{"sourceInterval":[131,297]},["app",{"sourceInterval":[131,170]},"Rule_define",[]],["app",{"sourceInterval":[188,227]},"Rule_override",[]],["app",{"sourceInterval":[247,286]},"Rule_extend",[]]]],"RuleBody":["define",{"sourceInterval":[301,354]},null,[],["seq",{"sourceInterval":[316,354]},["opt",{"sourceInterval":[316,320]},["terminal",{"sourceInterval":[316,319]},"|"]],["app",{"sourceInterval":[321,354]},"NonemptyListOf",[["app",{"sourceInterval":[336,348]},"TopLevelTerm",[]],["terminal",{"sourceInterval":[350,353]},"|"]]]]],"TopLevelTerm_inline":["define",{"sourceInterval":[377,400]},null,[],["seq",{"sourceInterval":[377,389]},["app",{"sourceInterval":[377,380]},"Seq",[]],["app",{"sourceInterval":[381,389]},"caseName",[]]]],"TopLevelTerm":["define",{"sourceInterval":[358,410]},null,[],["alt",{"sourceInterval":[377,410]},["app",{"sourceInterval":[377,389]},"TopLevelTerm_inline",[]],["app",{"sourceInterval":[407,410]},"Seq",[]]]],"Formals":["define",{"sourceInterval":[414,454]},null,[],["seq",{"sourceInterval":[428,454]},["terminal",{"sourceInterval":[428,431]},"<"],["app",{"sourceInterval":[432,450]},"ListOf",[["app",{"sourceInterval":[439,444]},"ident",[]],["terminal",{"sourceInterval":[446,449]},","]]],["terminal",{"sourceInterval":[451,454]},">"]]],"Params":["define",{"sourceInterval":[458,495]},null,[],["seq",{"sourceInterval":[471,495]},["terminal",{"sourceInterval":[471,474]},"<"],["app",{"sourceInterval":[475,491]},"ListOf",[["app",{"sourceInterval":[482,485]},"Seq",[]],["terminal",{"sourceInterval":[487,490]},","]]],["terminal",{"sourceInterval":[492,495]},">"]]],"Alt":["define",{"sourceInterval":[499,533]},null,[],["app",{"sourceInterval":[509,533]},"NonemptyListOf",[["app",{"sourceInterval":[524,527]},"Seq",[]],["terminal",{"sourceInterval":[529,532]},"|"]]]],"Seq":["define",{"sourceInterval":[537,552]},null,[],["star",{"sourceInterval":[547,552]},["app",{"sourceInterval":[547,551]},"Iter",[]]]],"Iter_star":["define",{"sourceInterval":[567,584]},null,[],["seq",{"sourceInterval":[567,575]},["app",{"sourceInterval":[567,571]},"Pred",[]],["terminal",{"sourceInterval":[572,575]},"*"]]],"Iter_plus":["define",{"sourceInterval":[591,608]},null,[],["seq",{"sourceInterval":[591,599]},["app",{"sourceInterval":[591,595]},"Pred",[]],["terminal",{"sourceInterval":[596,599]},"+"]]],"Iter_opt":["define",{"sourceInterval":[615,631]},null,[],["seq",{"sourceInterval":[615,623]},["app",{"sourceInterval":[615,619]},"Pred",[]],["terminal",{"sourceInterval":[620,623]},"?"]]],"Iter":["define",{"sourceInterval":[556,642]},null,[],["alt",{"sourceInterval":[567,642]},["app",{"sourceInterval":[567,575]},"Iter_star",[]],["app",{"sourceInterval":[591,599]},"Iter_plus",[]],["app",{"sourceInterval":[615,623]},"Iter_opt",[]],["app",{"sourceInterval":[638,642]},"Pred",[]]]],"Pred_not":["define",{"sourceInterval":[657,672]},null,[],["seq",{"sourceInterval":[657,664]},["terminal",{"sourceInterval":[657,660]},"~"],["app",{"sourceInterval":[661,664]},"Lex",[]]]],"Pred_lookahead":["define",{"sourceInterval":[679,700]},null,[],["seq",{"sourceInterval":[679,686]},["terminal",{"sourceInterval":[679,682]},"&"],["app",{"sourceInterval":[683,686]},"Lex",[]]]],"Pred":["define",{"sourceInterval":[646,710]},null,[],["alt",{"sourceInterval":[657,710]},["app",{"sourceInterval":[657,664]},"Pred_not",[]],["app",{"sourceInterval":[679,686]},"Pred_lookahead",[]],["app",{"sourceInterval":[707,710]},"Lex",[]]]],"Lex_lex":["define",{"sourceInterval":[724,740]},null,[],["seq",{"sourceInterval":[724,732]},["terminal",{"sourceInterval":[724,727]},"#"],["app",{"sourceInterval":[728,732]},"Base",[]]]],"Lex":["define",{"sourceInterval":[714,751]},null,[],["alt",{"sourceInterval":[724,751]},["app",{"sourceInterval":[724,732]},"Lex_lex",[]],["app",{"sourceInterval":[747,751]},"Base",[]]]],"Base_application":["define",{"sourceInterval":[766,827]},null,[],["seq",{"sourceInterval":[766,811]},["app",{"sourceInterval":[766,771]},"ident",[]],["opt",{"sourceInterval":[772,779]},["app",{"sourceInterval":[772,778]},"Params",[]]],["not",{"sourceInterval":[780,811]},["alt",{"sourceInterval":[782,810]},["seq",{"sourceInterval":[782,796]},["opt",{"sourceInterval":[782,792]},["app",{"sourceInterval":[782,791]},"ruleDescr",[]]],["terminal",{"sourceInterval":[793,796]},"="]],["terminal",{"sourceInterval":[799,803]},":="],["terminal",{"sourceInterval":[806,810]},"+="]]]]],"Base_range":["define",{"sourceInterval":[834,889]},null,[],["seq",{"sourceInterval":[834,870]},["app",{"sourceInterval":[834,849]},"oneCharTerminal",[]],["terminal",{"sourceInterval":[850,854]},".."],["app",{"sourceInterval":[855,870]},"oneCharTerminal",[]]]],"Base_terminal":["define",{"sourceInterval":[896,954]},null,[],["app",{"sourceInterval":[896,904]},"terminal",[]]],"Base_paren":["define",{"sourceInterval":[961,1016]},null,[],["seq",{"sourceInterval":[961,972]},["terminal",{"sourceInterval":[961,964]},"("],["app",{"sourceInterval":[965,968]},"Alt",[]],["terminal",{"sourceInterval":[969,972]},")"]]],"Base":["define",{"sourceInterval":[755,1016]},null,[],["alt",{"sourceInterval":[766,1016]},["app",{"sourceInterval":[766,811]},"Base_application",[]],["app",{"sourceInterval":[834,870]},"Base_range",[]],["app",{"sourceInterval":[896,904]},"Base_terminal",[]],["app",{"sourceInterval":[961,972]},"Base_paren",[]]]],"ruleDescr":["define",{"sourceInterval":[1020,1079]},"a rule description",[],["seq",{"sourceInterval":[1058,1079]},["terminal",{"sourceInterval":[1058,1061]},"("],["app",{"sourceInterval":[1062,1075]},"ruleDescrText",[]],["terminal",{"sourceInterval":[1076,1079]},")"]]],"ruleDescrText":["define",{"sourceInterval":[1083,1114]},null,[],["star",{"sourceInterval":[1103,1114]},["seq",{"sourceInterval":[1104,1112]},["not",{"sourceInterval":[1104,1108]},["terminal",{"sourceInterval":[1105,1108]},")"]],["app",{"sourceInterval":[1109,1112]},"any",[]]]]],"caseName":["define",{"sourceInterval":[1118,1186]},null,[],["seq",{"sourceInterval":[1133,1186]},["terminal",{"sourceInterval":[1133,1137]},"--"],["star",{"sourceInterval":[1138,1152]},["seq",{"sourceInterval":[1139,1150]},["not",{"sourceInterval":[1139,1144]},["terminal",{"sourceInterval":[1140,1144]},"\n"]],["app",{"sourceInterval":[1145,1150]},"space",[]]]],["app",{"sourceInterval":[1153,1157]},"name",[]],["star",{"sourceInterval":[1158,1172]},["seq",{"sourceInterval":[1159,1170]},["not",{"sourceInterval":[1159,1164]},["terminal",{"sourceInterval":[1160,1164]},"\n"]],["app",{"sourceInterval":[1165,1170]},"space",[]]]],["alt",{"sourceInterval":[1174,1185]},["terminal",{"sourceInterval":[1174,1178]},"\n"],["lookahead",{"sourceInterval":[1181,1185]},["terminal",{"sourceInterval":[1182,1185]},"}"]]]]],"name":["define",{"sourceInterval":[1190,1230]},"a name",[],["seq",{"sourceInterval":[1211,1230]},["app",{"sourceInterval":[1211,1220]},"nameFirst",[]],["star",{"sourceInterval":[1221,1230]},["app",{"sourceInterval":[1221,1229]},"nameRest",[]]]]],"nameFirst":["define",{"sourceInterval":[1234,1266]},null,[],["alt",{"sourceInterval":[1250,1266]},["terminal",{"sourceInterval":[1250,1253]},"_"],["app",{"sourceInterval":[1260,1266]},"letter",[]]]],"nameRest":["define",{"sourceInterval":[1270,1300]},null,[],["alt",{"sourceInterval":[1285,1300]},["terminal",{"sourceInterval":[1285,1288]},"_"],["app",{"sourceInterval":[1295,1300]},"alnum",[]]]],"ident":["define",{"sourceInterval":[1304,1337]},"an identifier",[],["app",{"sourceInterval":[1333,1337]},"name",[]]],"terminal":["define",{"sourceInterval":[1341,1379]},null,[],["seq",{"sourceInterval":[1356,1379]},["terminal",{"sourceInterval":[1356,1360]},"\""],["star",{"sourceInterval":[1361,1374]},["app",{"sourceInterval":[1361,1373]},"terminalChar",[]]],["terminal",{"sourceInterval":[1375,1379]},"\""]]],"oneCharTerminal":["define",{"sourceInterval":[1383,1427]},null,[],["seq",{"sourceInterval":[1405,1427]},["terminal",{"sourceInterval":[1405,1409]},"\""],["app",{"sourceInterval":[1410,1422]},"terminalChar",[]],["terminal",{"sourceInterval":[1423,1427]},"\""]]],"terminalChar":["define",{"sourceInterval":[1431,1488]},null,[],["alt",{"sourceInterval":[1450,1488]},["app",{"sourceInterval":[1450,1460]},"escapeChar",[]],["seq",{"sourceInterval":[1467,1488]},["not",{"sourceInterval":[1467,1472]},["terminal",{"sourceInterval":[1468,1472]},"\\"]],["not",{"sourceInterval":[1473,1478]},["terminal",{"sourceInterval":[1474,1478]},"\""]],["not",{"sourceInterval":[1479,1484]},["terminal",{"sourceInterval":[1480,1484]},"\n"]],["app",{"sourceInterval":[1485,1488]},"any",[]]]]],"escapeChar_backslash":["define",{"sourceInterval":[1531,1586]},null,[],["terminal",{"sourceInterval":[1531,1537]},"\\\\"]],"escapeChar_doubleQuote":["define",{"sourceInterval":[1593,1650]},null,[],["terminal",{"sourceInterval":[1593,1599]},"\\\""]],"escapeChar_singleQuote":["define",{"sourceInterval":[1657,1714]},null,[],["terminal",{"sourceInterval":[1657,1663]},"\\'"]],"escapeChar_backspace":["define",{"sourceInterval":[1721,1776]},null,[],["terminal",{"sourceInterval":[1721,1726]},"\\b"]],"escapeChar_lineFeed":["define",{"sourceInterval":[1783,1837]},null,[],["terminal",{"sourceInterval":[1783,1788]},"\\n"]],"escapeChar_carriageReturn":["define",{"sourceInterval":[1844,1904]},null,[],["terminal",{"sourceInterval":[1844,1849]},"\\r"]],"escapeChar_tab":["define",{"sourceInterval":[1911,1960]},null,[],["terminal",{"sourceInterval":[1911,1916]},"\\t"]],"escapeChar_unicodeEscape":["define",{"sourceInterval":[1967,2026]},null,[],["seq",{"sourceInterval":[1967,2008]},["terminal",{"sourceInterval":[1967,1972]},"\\u"],["app",{"sourceInterval":[1973,1981]},"hexDigit",[]],["app",{"sourceInterval":[1982,1990]},"hexDigit",[]],["app",{"sourceInterval":[1991,1999]},"hexDigit",[]],["app",{"sourceInterval":[2000,2008]},"hexDigit",[]]]],"escapeChar_hexEscape":["define",{"sourceInterval":[2033,2088]},null,[],["seq",{"sourceInterval":[2033,2056]},["terminal",{"sourceInterval":[2033,2038]},"\\x"],["app",{"sourceInterval":[2039,2047]},"hexDigit",[]],["app",{"sourceInterval":[2048,2056]},"hexDigit",[]]]],"escapeChar":["define",{"sourceInterval":[1492,2088]},"an escape sequence",[],["alt",{"sourceInterval":[1531,2088]},["app",{"sourceInterval":[1531,1537]},"escapeChar_backslash",[]],["app",{"sourceInterval":[1593,1599]},"escapeChar_doubleQuote",[]],["app",{"sourceInterval":[1657,1663]},"escapeChar_singleQuote",[]],["app",{"sourceInterval":[1721,1726]},"escapeChar_backspace",[]],["app",{"sourceInterval":[1783,1788]},"escapeChar_lineFeed",[]],["app",{"sourceInterval":[1844,1849]},"escapeChar_carriageReturn",[]],["app",{"sourceInterval":[1911,1916]},"escapeChar_tab",[]],["app",{"sourceInterval":[1967,2008]},"escapeChar_unicodeEscape",[]],["app",{"sourceInterval":[2033,2056]},"escapeChar_hexEscape",[]]]],"space":["extend",{"sourceInterval":[2092,2111]},null,[],["app",{"sourceInterval":[2104,2111]},"comment",[]]],"comment_singleLine":["define",{"sourceInterval":[2129,2166]},null,[],["seq",{"sourceInterval":[2129,2151]},["terminal",{"sourceInterval":[2129,2133]},"//"],["star",{"sourceInterval":[2134,2146]},["seq",{"sourceInterval":[2135,2144]},["not",{"sourceInterval":[2135,2140]},["terminal",{"sourceInterval":[2136,2140]},"\n"]],["app",{"sourceInterval":[2141,2144]},"any",[]]]],["terminal",{"sourceInterval":[2147,2151]},"\n"]]],"comment_multiLine":["define",{"sourceInterval":[2173,2209]},null,[],["seq",{"sourceInterval":[2173,2195]},["terminal",{"sourceInterval":[2173,2177]},"/*"],["star",{"sourceInterval":[2178,2190]},["seq",{"sourceInterval":[2179,2188]},["not",{"sourceInterval":[2179,2184]},["terminal",{"sourceInterval":[2180,2184]},"*/"]],["app",{"sourceInterval":[2185,2188]},"any",[]]]],["terminal",{"sourceInterval":[2191,2195]},"*/"]]],"comment":["define",{"sourceInterval":[2115,2209]},null,[],["alt",{"sourceInterval":[2129,2209]},["app",{"sourceInterval":[2129,2151]},"comment_singleLine",[]],["app",{"sourceInterval":[2173,2195]},"comment_multiLine",[]]]],"tokens":["define",{"sourceInterval":[2213,2228]},null,[],["star",{"sourceInterval":[2222,2228]},["app",{"sourceInterval":[2222,2227]},"token",[]]]],"token":["define",{"sourceInterval":[2232,2308]},null,[],["alt",{"sourceInterval":[2240,2308]},["app",{"sourceInterval":[2240,2248]},"caseName",[]],["app",{"sourceInterval":[2251,2258]},"comment",[]],["app",{"sourceInterval":[2261,2266]},"ident",[]],["app",{"sourceInterval":[2269,2277]},"operator",[]],["app",{"sourceInterval":[2280,2291]},"punctuation",[]],["app",{"sourceInterval":[2294,2302]},"terminal",[]],["app",{"sourceInterval":[2305,2308]},"any",[]]]],"operator":["define",{"sourceInterval":[2312,2377]},null,[],["alt",{"sourceInterval":[2323,2377]},["terminal",{"sourceInterval":[2323,2327]},"<:"],["terminal",{"sourceInterval":[2330,2333]},"="],["terminal",{"sourceInterval":[2336,2340]},":="],["terminal",{"sourceInterval":[2343,2347]},"+="],["terminal",{"sourceInterval":[2350,2353]},"*"],["terminal",{"sourceInterval":[2356,2359]},"+"],["terminal",{"sourceInterval":[2362,2365]},"?"],["terminal",{"sourceInterval":[2368,2371]},"~"],["terminal",{"sourceInterval":[2374,2377]},"&"]]],"punctuation":["define",{"sourceInterval":[2381,2417]},null,[],["alt",{"sourceInterval":[2395,2417]},["terminal",{"sourceInterval":[2395,2398]},"<"],["terminal",{"sourceInterval":[2401,2404]},">"],["terminal",{"sourceInterval":[2407,2410]},","],["terminal",{"sourceInterval":[2413,2417]},"--"]]]}]);


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
    return walkFns.map(function (walkFn) {
        return walkFn(thing, fn);
    });
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
    var self = this;
    Object.keys(this._shapes).forEach(function (k) {
        var shape = self._shapes[k];
        self._getChildren[k] = getWalkFn(shape);
        // A function means the arity isn't fixed, so don't put an entry in the arity map.
        if (typeof shape !== 'function') {
            self._arities[k] = Array.isArray(shape) ? shape.length : 1;
        }
    });
    this._wrap = function (thing) { return new self.Adapter(thing, self); };
}
VisitorFamily.prototype.wrap = function (thing) {
    return this._wrap(thing);
};
VisitorFamily.prototype._checkActionDict = function (dict) {
    var self = this;
    Object.keys(dict).forEach(function (k) {
        assert(k in self._getChildren, "Unrecognized action name '" + k + "'");
        var action = dict[k];
        assert(typeof action === 'function', "Key '" + k + "': expected function, got " + action);
        if (k in self._arities) {
            var expected = self._arities[k];
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
        return this.primitiveValue;
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
            var realChildren = children.filter(function (child) {
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
            }
            else if ((typeof mappedProp === 'string') || (typeof mappedProp === 'boolean') ||
                (mappedProp === null)) {
                // primitive value
                node[prop] = mappedProp;
            }
            else if ((typeof mappedProp === 'object') && (mappedProp instanceof Number)) {
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
    newGrammar: function (name) {
        return new GrammarDecl(name);
    },
    grammar: function (metaInfo, name, superGrammar, defaultStartRule, rules) {
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
        Object.keys(rules).forEach(function (ruleName) {
            var ruleRecipe = rules[ruleName];
            var action = ruleRecipe[0]; // define/extend/override
            var metaInfo = ruleRecipe[1];
            var description = ruleRecipe[2];
            var formals = ruleRecipe[3];
            var body = self.fromRecipe(ruleRecipe[4]);
            var source;
            if (gDecl.source && metaInfo && metaInfo.sourceInterval) {
                source = gDecl.source.subInterval(metaInfo.sourceInterval[0], metaInfo.sourceInterval[1] - metaInfo.sourceInterval[0]);
            }
            gDecl[action](ruleName, formals, body, description, source);
        });
        this.currentDecl = null;
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
    alt: function ( /* term1, term1, ... */) {
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
                return param instanceof pexprs.PExpr ? param :
                    this.fromRecipe(param);
            }, this);
        }
        return new pexprs.Apply(ruleName, optParams);
    },
    fromRecipe: function (recipe) {
        // the meta-info of 'grammar' is proccessed in Builder.grammar
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

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var Failure = __webpack_require__(/*! ./Failure */ "./src/Failure.js");
var TerminalNode = __webpack_require__(/*! ./nodes */ "./src/nodes.js").TerminalNode;
var assert = __webpack_require__(/*! ./common */ "./src/common.js").assert;
var inherits = __webpack_require__(/*! inherits */ "../node_modules/inherits/inherits_browser.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
function CaseInsensitiveTerminal(param) {
    this.obj = param;
}
inherits(CaseInsensitiveTerminal, pexprs.PExpr);
CaseInsensitiveTerminal.prototype = {
    _getString: function (state) {
        var terminal = state.currentApplication().args[this.obj.index];
        assert(terminal instanceof pexprs.Terminal, 'expected a Terminal expression');
        return terminal.obj;
    },
    // Implementation of the PExpr API
    allowsSkippingPrecedingSpace: function () {
        return true;
    },
    eval: function (state) {
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
    },
    generateExample: function (grammar, examples, inSyntacticContext, actuals) {
        // Start with a example generated from the Terminal...
        var str = this.obj.generateExample(grammar, examples, inSyntacticContext, actuals).value;
        // ...and randomly switch characters to uppercase/lowercase.
        var value = '';
        for (var i = 0; i < str.length; ++i) {
            value += Math.random() < 0.5 ? str[i].toLocaleLowerCase() : str[i].toLocaleUpperCase();
        }
        return { value: value };
    },
    getArity: function () {
        return 1;
    },
    substituteParams: function (actuals) {
        return new CaseInsensitiveTerminal(this.obj.substituteParams(actuals));
    },
    toDisplayString: function () {
        return this.obj.toDisplayString() + ' (case-insensitive)';
    },
    toFailure: function (grammar) {
        return new Failure(this, this.obj.toFailure(grammar) + ' (case-insensitive)', 'description');
    },
    _isNullable: function (grammar, memo) {
        return this.obj._isNullable(grammar, memo);
    }
};
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
    return this.getText() === that.getText() &&
        this.type === that.type &&
        (!this.isFluffy() || this.isFluffy() && that.isFluffy());
};
Failure.prototype.toString = function () {
    return this.type === 'string' ?
        JSON.stringify(this.getText()) :
        this.getText();
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
    return Object.keys(grammar.rules).sort().map(function (name) { return grammar.rules[name]; });
}
function Grammar(name, superGrammar, rules, optDefaultStartRule) {
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
        return myRules.length === otherRules.length && myRules.every(function (rule, i) {
            return rule.description === otherRules[i].description &&
                rule.formals.join(',') === otherRules[i].formals.join(',') &&
                rule.body.toString() === otherRules[i].body.toString();
        });
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
    semantics: function () {
        // TODO: Remove this eventually! Deprecated in v0.12.
        throw new Error('semantics() is deprecated -- use createSemantics() instead.');
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
                    problems.push("Semantic action '" + k + "' has the wrong arity: " +
                        'expected ' + expected + ', got ' + actual);
                }
            }
        }
        if (problems.length > 0) {
            var prettyProblems = problems.map(function (problem) { return '- ' + problem; });
            var error = new Error("Found errors in the action dictionary of the '" + name + "' " + what + ':\n' +
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
        Object.keys(this.rules).forEach(function (ruleName) {
            var ruleInfo = self.rules[ruleName];
            var body = ruleInfo.body;
            var isDefinition = !self.superGrammar || !self.superGrammar.rules[ruleName];
            var operation;
            if (isDefinition) {
                operation = 'define';
            }
            else {
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
                operation,
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
        this.name === 'BuiltInRules' ?
            Grammar.ProtoBuiltInRules :
            Grammar.BuiltInRules);
    }
    return this.superGrammar;
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
    var ruleInfo = this.ensureSuperGrammar().rules[name];
    if (!ruleInfo) {
        throw errors.cannotOverrideUndeclaredRule(name, this.superGrammar.name, source);
    }
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
            return [
                new Interval(this.sourceString, that.endIdx, this.endIdx)
            ];
        }
        else if (this.startIdx < that.startIdx && that.startIdx < this.endIdx) {
            // `that` contains a suffix of `this`
            return [
                new Interval(this.sourceString, this.startIdx, that.startIdx)
            ];
        }
        else {
            // `that` and `this` do not overlap
            return [
                this
            ];
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
        get: function () { return this.endIdx - this.startIdx; },
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
            return util.getLineAndColumnMessage(this.input, this.getRightmostFailurePosition()) + detail;
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
    return this.succeeded() ?
        '[match succeeded]' :
        '[match failed at position ' + this.getRightmostFailurePosition() + ']';
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
    failures = failures.filter(function (failure) {
        return !failure.isFluffy();
    });
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
        return this.inSyntacticContext() ?
            this.skipSpaces() :
            this.inputStream.pos;
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
        var self = this;
        Object.keys(failures).forEach(function (key) {
            self.recordFailure(failures[key], shouldCloneIfNew);
        });
    },
    cloneRecordedFailures: function () {
        if (!this.recordedFailures) {
            return undefined;
        }
        var ans = Object.create(null);
        var self = this;
        Object.keys(this.recordedFailures).forEach(function (key) {
            ans[key] = self.recordedFailures[key].clone();
        });
        return ans;
    },
    getRightmostFailurePosition: function () {
        return this.rightmostFailurePosition;
    },
    _getRightmostFailureOffset: function () {
        return this.rightmostFailurePosition >= 0 ?
            this.posToOffset(this.rightmostFailurePosition) :
            -1;
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
        return this.getMemoizedTraceEntry(pos, expr) ||
            new Trace(this.input, pos, this.inputStream.pos, expr, succeeded, bindings, this.trace);
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
    eval: function (expr) {
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
                var self_1 = this;
                Object.keys(this.recordedFailures).forEach(function (key) {
                    self_1.recordedFailures[key].makeFluffy();
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
        this.eval(this.startExpr);
        var rightmostFailures;
        if (this.recordedFailures) {
            var self_2 = this;
            rightmostFailures = Object.keys(this.recordedFailures).map(function (key) {
                return self_2.recordedFailures[key];
            });
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
    restOfMemoTable.forEach(function (posInfo) { this.memoTable.push(posInfo); }, this);
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
function Namespace() {
}
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
        this.maxRightmostFailureOffset =
            Math.max(this.maxRightmostFailureOffset, memoRec.rightmostFailureOffset);
        return memoRec;
    },
    clearObsoleteEntries: function (pos, invalidatedIdx) {
        if (pos + this.maxExaminedLength <= invalidatedIdx) {
            // Optimization: none of the rule applications that were memoized here examined the
            // interval of the input that changed, so nothing has to be invalidated.
            return;
        }
        var memo = this.memo;
        this.maxExaminedLength = 0;
        this.maxRightmostFailureOffset = -1;
        var self = this;
        Object.keys(memo).forEach(function (k) {
            var memoRec = memo[k];
            if (pos + memoRec.examinedLength > invalidatedIdx) {
                delete memo[k];
            }
            else {
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
var inherits = __webpack_require__(/*! inherits */ "../node_modules/inherits/inherits_browser.js");
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
function Wrapper() { }
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
// Returns the wrapper of the specified child node. Child wrappers are created lazily and cached in
// the parent wrapper's `_childWrappers` instance variable.
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
// Returns an array containing the wrappers of all of the children of the node associated with this
// wrapper.
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
Object.defineProperties(Wrapper.prototype, {
    // Returns an array containing the children of this CST node.
    children: { get: function () { return this._children(); } },
    // Returns the name of grammar rule that created this CST node.
    ctorName: { get: function () { return this._node.ctorName; } },
    // TODO: Remove this eventually (deprecated in v0.12).
    interval: { get: function () {
            throw new Error('The `interval` property is deprecated -- use `source` instead');
        } },
    // Returns the number of children of this CST node.
    numChildren: { get: function () { return this._node.numChildren(); } },
    // Returns the primitive value of this CST node, if it's a terminal node. Otherwise,
    // throws an exception.
    primitiveValue: {
        get: function () {
            if (this.isTerminal()) {
                return this._node.primitiveValue;
            }
            throw new TypeError("tried to access the 'primitiveValue' attribute of a non-terminal CST node");
        }
    },
    // Returns the contents of the input stream consumed by this CST node.
    sourceString: { get: function () { return this.source.contents; } }
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
    this.Wrapper = function (node, sourceInterval, baseInterval) {
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
            throw new Error("Cannot extend a semantics for grammar '" + this.super.grammar.name +
                "' for use with grammar '" + grammar.name + "' (not a sub-grammar)");
        }
        inherits(this.Wrapper, this.super.Wrapper);
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
        inherits(this.Wrapper, Wrapper);
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
        var semanticOperations = this[type.toLowerCase() + 's'];
        Object.keys(semanticOperations).forEach(function (name) {
            var signature = name;
            if (semanticOperations[name].formals.length > 0) {
                signature += '(' + semanticOperations[name].formals.join(', ') + ')';
            }
            var method;
            if (hasSuperSemantics(this) && this.super[type.toLowerCase() + 's'][name]) {
                method = 'extend' + type;
            }
            else {
                method = 'add' + type;
            }
            str += '\n    .' + method + '(' + JSON.stringify(signature) + ', {';
            var actions = semanticOperations[name].actionDict;
            var srcArray = [];
            Object.keys(actions).forEach(function (actionName) {
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
        var self = this;
        var thisThing = this._semantics.operations[name] || this._semantics.attributes[name];
        var args = thisThing.formals.map(function (formal) {
            return self.args[formal];
        });
        if (this.isIteration()) {
            // This CST node corresponds to an iteration expression in the grammar (*, +, or ?). The
            // default behavior is to map this operation or attribute over all of its child nodes.
            return children.map(function (child) { return doIt.apply(child, args); });
        }
        // This CST node corresponds to a non-terminal in the grammar (e.g., AddExpr). The fact that
        // we got here means that this action dictionary doesn't have an action for this particular
        // non-terminal or a generic `_nonterminal` action.
        if (children.length === 1) {
            // As a convenience, if this node only has one child, we just return the result of
            // applying this operation / attribute to the child node.
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
            throw new Error('Invalid number of arguments passed to ' + name + ' ' + type + ' (expected ' +
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
    Object.keys(actionDict).forEach(function (name) {
        newActionDict[name] = actionDict[name];
    });
    this[typePlural][name] = type === 'operation' ?
        new Operation(name, inheritedFormals, newActionDict) :
        new Attribute(name, newActionDict);
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
    var s = new Semantics(grammar, optSuperSemantics !== undefined ?
        optSuperSemantics :
        Semantics.BuiltInSemantics._getSemantics());
    // To enable clients to invoke a semantics like a function, return a function that acts as a proxy
    // for `s`, which is the real `Semantics` instance.
    var proxy = function ASemantics(matchResult) {
        if (!(matchResult instanceof MatchResult)) {
            throw new TypeError('Semantics expected a MatchResult, but got ' + common.unexpectedObjToString(matchResult));
        }
        if (matchResult.failed()) {
            throw new TypeError('cannot apply Semantics to ' + matchResult.toString());
        }
        var cst = matchResult._cst;
        if (cst.grammar !== grammar) {
            throw new Error("Cannot use a MatchResult from grammar '" + cst.grammar.name +
                "' with a semantics for '" + grammar.name + "'");
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
            throw new Error('"' + operationOrAttributeName + '" is not a valid operation or attribute ' +
                'name in this semantics for "' + grammar.name + '"');
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
function Operation(name, formals, actionDict, builtInDefault) {
    this.name = name;
    this.formals = formals;
    this.actionDict = actionDict;
    this.builtInDefault = builtInDefault;
}
Operation.prototype.typeName = 'operation';
Operation.prototype.checkActionDict = function (grammar) {
    grammar._checkTopDownActionDict(this.typeName, this.name, this.actionDict);
};
// Execute this operation on the CST node associated with `nodeWrapper` in the context of the given
// Semantics instance.
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
Attribute.prototype.execute = function (semantics, nodeWrapper) {
    var node = nodeWrapper._node;
    var key = semantics.attributeKeys[this.name];
    if (!node.hasOwnProperty(key)) {
        // The following is a super-send -- isn't JS beautiful? :/
        node[key] = Operation.prototype.execute.call(this, semantics, nodeWrapper);
    }
    return node[key];
};
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
    Semantics.BuiltInSemantics = Semantics
        .createSemantics(builtInRules, null)
        .addOperation('asIteration', {
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
                formals: optFormals.parse()[0] || []
            };
        },
        Formals: function (oparen, fs, cparen) {
            return fs.asIteration().parse();
        },
        name: function (first, rest) {
            return this.sourceString;
        }
    });
    prototypeGrammar = grammar;
}
;
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
    get: function () { return this.expr.toDisplayString(); }
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
        this.children.forEach(function (c) { _walk(c, null, 0); });
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
    var sb = new common.StringBuffer();
    this.walk(function (node, parent, depth) {
        if (!node) {
            return this.SKIP;
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
    }.bind(this));
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
        throw new Error('this method ' + methodName + ' is abstract! ' +
            '(it has no implementation in class ' + this.constructor.name + ')');
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
    var message = "Duplicate declaration for rule '" + ruleName +
        "' in grammar '" + grammarName + "'";
    if (grammarName !== declGrammarName) {
        message += " (originally declared in '" + declGrammarName + "')";
    }
    return createError(message, optSource);
}
// Wrong number of parameters
function wrongNumberOfParameters(ruleName, expected, actual, source) {
    return createError('Wrong number of parameters for rule ' + ruleName +
        ' (expected ' + expected + ', got ' + actual + ')', source);
}
// Wrong number of arguments
function wrongNumberOfArguments(ruleName, expected, actual, expr) {
    return createError('Wrong number of arguments for rule ' + ruleName +
        ' (expected ' + expected + ', got ' + actual + ')', expr.source);
}
// Duplicate parameter names
function duplicateParameterNames(ruleName, duplicates, source) {
    return createError('Duplicate parameter names in rule ' + ruleName + ': ' + duplicates.join(', '), source);
}
// Invalid parameter expression
function invalidParameter(ruleName, expr) {
    return createError('Invalid parameter to rule ' + ruleName + ': ' + expr + ' has arity ' + expr.getArity() +
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
// ----------------- Kleene operators -----------------
function kleeneExprHasNullableOperand(kleeneExpr, applicationStack) {
    var actuals = applicationStack.length > 0 ?
        applicationStack[applicationStack.length - 1].args :
        [];
    var expr = kleeneExpr.expr.substituteParams(actuals);
    var message = 'Nullable expression ' + expr + " is not allowed inside '" +
        kleeneExpr.operator + "' (possible infinite loop)";
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
    return createError('Rule ' + ruleName + ' involves an alternation which has inconsistent arity ' +
        '(expected ' + expected + ', got ' + actual + ')', expr.source);
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
    var stackTrace = stack.slice(0, -1).map(function (info) {
        var ans = '  ' + info[0].name + ' > ' + info[1];
        return info.length === 3
            ? ans + " for '" + info[2] + "'"
            : ans;
    }).join('\n');
    stackTrace += '\n  ' + name + ' > ' + ctorName;
    var where = type + " '" + name + "'";
    var message = "Missing semantic action for '" + ctorName + "' in " + where + '\n' +
        'Action stack (most recent call last):\n' + stackTrace;
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
    querySelector: function (sel) { return document.querySelector(sel); },
    querySelectorAll: function (sel) { return document.querySelectorAll(sel); }
};
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
        Grammar: function (n, s, open, rs, close) {
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
        Rule_override: function (n, fs, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.visit()[0] || [];
            overriding = true;
            var body = b.visit();
            var source = this.source.trimmed();
            var ans = decl.override(currentRuleName, currentRuleFormals, body, null, source);
            overriding = false;
            return ans;
        },
        Rule_extend: function (n, fs, _, b) {
            currentRuleName = n.visit();
            currentRuleFormals = fs.visit()[0] || [];
            var body = b.visit();
            var source = this.source.trimmed();
            var ans = decl.extend(currentRuleName, currentRuleFormals, body, null, source);
            return ans;
        },
        RuleBody: function (_, terms) {
            var args = terms.visit();
            return builder.alt.apply(builder, args).withSource(this.source);
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
        Seq: function (expr) {
            return builder.seq.apply(builder, expr.visit()).withSource(this.source);
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
            return builder.app(rule.visit(), ps.visit()[0] || []).withSource(this.source);
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
            return cs.visit().join('');
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
            return [x.visit()].concat(xs.visit());
        },
        EmptyListOf: function () {
            return [];
        },
        _terminal: function () {
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
    else if (typeof nodeList === 'string' || (!isElement(nodeList) && !isArrayLike(nodeList))) {
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
    ohmGrammar: null,
    pexprs: pexprs,
    util: util,
    extras: __webpack_require__(/*! ../extras */ "./extras/index.js"),
    version: version
};
// Stuff for testing, etc.
module.exports._buildGrammar = buildGrammar;
module.exports._setDocumentInterfaceForTesting = function (doc) { documentInterface = doc; };
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

var inherits = __webpack_require__(/*! inherits */ "../node_modules/inherits/inherits_browser.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
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
    return this.numChildren() > 1;
};
Node.prototype.hasNoChildren = function () {
    return !this.hasChildren();
};
Node.prototype.onlyChild = function () {
    if (this.numChildren() !== 1) {
        throw new Error('cannot get only child of a node of type ' + this.ctorName +
            ' (it has ' + this.numChildren() + ' children)');
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
TerminalNode.prototype.isTerminal = function () {
    return true;
};
TerminalNode.prototype.toJSON = function () {
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
NonterminalNode.prototype.isNonterminal = function () {
    return true;
};
NonterminalNode.prototype.isLexical = function () {
    return common.isLexical(this.ctorName);
};
NonterminalNode.prototype.isSyntactic = function () {
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
IterationNode.prototype.isIteration = function () {
    return true;
};
IterationNode.prototype.isOptional = function () {
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
                    pexprs.UnicodeChar.prototype.allowsSkippingPrecedingSpace = function () {
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
                        pexprs.Seq.prototype.allowsSkippingPrecedingSpace = function () {
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
util.awaitBuiltInRules(function (g) { BuiltInRules = g; });
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
                    pexprs.UnicodeChar.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
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
        pexprs.Lookahead.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
            this.expr._assertAllApplicationsAreValid(ruleName, grammar);
        };
pexprs.Apply.prototype._assertAllApplicationsAreValid = function (ruleName, grammar) {
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
    this.args.forEach(function (arg) {
        arg._assertAllApplicationsAreValid(ruleName, grammar);
        if (arg.getArity() !== 1) {
            throw errors.invalidParameter(self.ruleName, arg);
        }
    });
    // Extra checks for "special" applications
    // If it's an application of 'caseInsensitive', ensure that the argument is a Terminal.
    if (BuiltInRules && ruleInfo === BuiltInRules.rules.caseInsensitive) {
        if (!(this.args[0] instanceof pexprs.Terminal)) {
            throw errors.incorrectArgumentType('a Terminal (e.g. \"abc\")', this.args[0]);
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
                        pexprs.UnicodeChar.prototype.assertChoicesHaveUniformArity = function (ruleName) {
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
                    pexprs.UnicodeChar.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
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
            pexprs.Lex.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
                this.expr.assertIteratedExprsAreNotNullable(grammar);
            };
pexprs.Apply.prototype.assertIteratedExprsAreNotNullable = function (grammar) {
    this.args.forEach(function (arg) {
        arg.assertIteratedExprsAreNotNullable(grammar);
    });
};


/***/ }),

/***/ "./src/pexprs-check.js":
/*!*****************************!*\
  !*** ./src/pexprs-check.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var nodes = __webpack_require__(/*! ./nodes */ "./src/nodes.js");
var pexprs = __webpack_require__(/*! ./pexprs */ "./src/pexprs.js");
// --------------------------------------------------------------------
// Operations
// --------------------------------------------------------------------
pexprs.PExpr.prototype.check = common.abstract('check');
pexprs.any.check = function (grammar, vals) {
    return vals.length >= 1;
};
pexprs.end.check = function (grammar, vals) {
    return vals[0] instanceof nodes.Node &&
        vals[0].isTerminal() &&
        vals[0].primitiveValue === undefined;
};
pexprs.Terminal.prototype.check = function (grammar, vals) {
    return vals[0] instanceof nodes.Node &&
        vals[0].isTerminal() &&
        vals[0].primitiveValue === this.obj;
};
pexprs.Range.prototype.check = function (grammar, vals) {
    return vals[0] instanceof nodes.Node &&
        vals[0].isTerminal() &&
        typeof vals[0].primitiveValue === typeof this.from;
};
pexprs.Param.prototype.check = function (grammar, vals) {
    return vals.length >= 1;
};
pexprs.Alt.prototype.check = function (grammar, vals) {
    for (var i = 0; i < this.terms.length; i++) {
        var term = this.terms[i];
        if (term.check(grammar, vals)) {
            return true;
        }
    }
    return false;
};
pexprs.Seq.prototype.check = function (grammar, vals) {
    var pos = 0;
    for (var i = 0; i < this.factors.length; i++) {
        var factor = this.factors[i];
        if (factor.check(grammar, vals.slice(pos))) {
            pos += factor.getArity();
        }
        else {
            return false;
        }
    }
    return true;
};
pexprs.Iter.prototype.check = function (grammar, vals) {
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
pexprs.Not.prototype.check = function (grammar, vals) {
    return true;
};
pexprs.Lookahead.prototype.check =
    pexprs.Lex.prototype.check = function (grammar, vals) {
        return this.expr.check(grammar, vals);
    };
pexprs.Apply.prototype.check = function (grammar, vals) {
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
pexprs.UnicodeChar.prototype.check = function (grammar, vals) {
    return vals[0] instanceof nodes.Node &&
        vals[0].isTerminal() &&
        typeof vals[0].primitiveValue === 'string';
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
        memoRec = posInfo.memoize(memoKey, { matchLength: 0, examinedLength: 0, value: false, rightmostFailureOffset: -1 });
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
    var examplesNeeded = examples.filter(function (example) {
        return example.hasOwnProperty('examplesNeeded');
    })
        .map(function (example) { return example.examplesNeeded; });
    examplesNeeded = flatten(examplesNeeded);
    var uniqueExamplesNeeded = {};
    for (var i = 0; i < examplesNeeded.length; i++) {
        var currentExampleNeeded = examplesNeeded[i];
        uniqueExamplesNeeded[currentExampleNeeded] = true;
    }
    examplesNeeded = Object.keys(uniqueExamplesNeeded);
    // A list of successfully generated examples
    var successfulExamples = examples.filter(function (example) {
        return example.hasOwnProperty('value');
    })
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
    return { value: String.fromCharCode(this.from.charCodeAt(0) + Math.floor(rangeSize * Math.random())) };
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
                        pexprs.UnicodeChar.prototype.getArity = function () {
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
pexprs.Lookahead.prototype.getArity =
    pexprs.Lex.prototype.getArity = function () {
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
                    pexprs.UnicodeChar.prototype.introduceParams = function (formals) {
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
            pexprs.Lex.prototype.introduceParams = function (formals) {
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
                pexprs.UnicodeChar.prototype._isNullable = function (grammar, memo) {
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
    return this.terms.length === 0 ||
        this.terms.some(function (term) { return term._isNullable(grammar, memo); });
};
pexprs.Seq.prototype._isNullable = function (grammar, memo) {
    return this.factors.every(function (factor) { return factor._isNullable(grammar, memo); });
};
pexprs.Star.prototype._isNullable =
    pexprs.Opt.prototype._isNullable =
        pexprs.Not.prototype._isNullable =
            pexprs.Lookahead.prototype._isNullable = function (grammar, memo) {
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
    return [
        'terminal',
        getMetaInfo(this, grammarInterval),
        this.obj
    ];
};
pexprs.Range.prototype.outputRecipe = function (formals, grammarInterval) {
    return [
        'range',
        getMetaInfo(this, grammarInterval),
        this.from,
        this.to
    ];
};
pexprs.Param.prototype.outputRecipe = function (formals, grammarInterval) {
    return [
        'param',
        getMetaInfo(this, grammarInterval),
        this.index
    ];
};
pexprs.Alt.prototype.outputRecipe = function (formals, grammarInterval) {
    return [
        'alt',
        getMetaInfo(this, grammarInterval)
    ].concat(this.terms.map(function (term) {
        return term.outputRecipe(formals, grammarInterval);
    }));
};
pexprs.Extend.prototype.outputRecipe = function (formals, grammarInterval) {
    var extension = this.terms[0]; // [extension, orginal]
    return extension.outputRecipe(formals, grammarInterval);
};
pexprs.Seq.prototype.outputRecipe = function (formals, grammarInterval) {
    return [
        'seq',
        getMetaInfo(this, grammarInterval)
    ].concat(this.factors.map(function (factor) {
        return factor.outputRecipe(formals, grammarInterval);
    }));
};
pexprs.Star.prototype.outputRecipe =
    pexprs.Plus.prototype.outputRecipe =
        pexprs.Opt.prototype.outputRecipe =
            pexprs.Not.prototype.outputRecipe =
                pexprs.Lookahead.prototype.outputRecipe =
                    pexprs.Lex.prototype.outputRecipe = function (formals, grammarInterval) {
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
        this.args.map(function (arg) {
            return arg.outputRecipe(formals, grammarInterval);
        })
    ];
};
pexprs.UnicodeChar.prototype.outputRecipe = function (formals, grammarInterval) {
    return [
        'unicodeChar',
        getMetaInfo(this, grammarInterval),
        this.category
    ];
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
                pexprs.UnicodeChar.prototype.substituteParams = function (actuals) {
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
            pexprs.Lex.prototype.substituteParams = function (actuals) {
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
    var argumentNameList = this.expr.toArgumentNameList(firstArgIndex, noDupCheck)
        .map(function (exprArgumentString) {
        return exprArgumentString[exprArgumentString.length - 1] === 's' ?
            exprArgumentString + 'es' :
            exprArgumentString + 's';
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
pexprs.Lookahead.prototype.toArgumentNameList =
    pexprs.Lex.prototype.toArgumentNameList = function (firstArgIndex, noDupCheck) {
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
pexprs.Alt.prototype.toDisplayString =
    pexprs.Seq.prototype.toDisplayString = function () {
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
                                pexprs.Param.prototype.toDisplayString = function () {
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
    var description = this.expr === pexprs.any ?
        'nothing' :
        'not ' + this.expr.toFailure(grammar);
    return new Failure(this, description, 'description');
};
pexprs.Lookahead.prototype.toFailure = function (grammar) {
    return this.expr.toFailure(grammar);
};
pexprs.Apply.prototype.toFailure = function (grammar) {
    var description = grammar.rules[this.ruleName].description;
    if (!description) {
        var article = (/^[aeiouAEIOU]/.test(this.ruleName) ? 'an' : 'a');
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
    return this.terms.length === 1 ?
        this.terms[0].toString() :
        '(' + this.terms.map(function (term) { return term.toString(); }).join(' | ') + ')';
};
pexprs.Seq.prototype.toString = function () {
    return this.factors.length === 1 ?
        this.factors[0].toString() :
        '(' + this.factors.map(function (factor) { return factor.toString(); }).join(' ') + ')';
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

// --------------------------------------------------------------------
// Imports
// --------------------------------------------------------------------
var UnicodeCategories = __webpack_require__(/*! ../third_party/UnicodeCategories */ "./third_party/UnicodeCategories.js");
var common = __webpack_require__(/*! ./common */ "./src/common.js");
var inherits = __webpack_require__(/*! inherits */ "../node_modules/inherits/inherits_browser.js");
// --------------------------------------------------------------------
// Private stuff
// --------------------------------------------------------------------
// General stuff
function PExpr() {
    throw new Error("PExpr cannot be instantiated -- it's abstract");
}
// Set the `source` property to the interval containing the source for this expression.
PExpr.prototype.withSource = function (interval) {
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
// Rule application
function Apply(ruleName, optArgs) {
    this.ruleName = ruleName;
    this.args = optArgs || [];
}
inherits(Apply, PExpr);
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
exports.Apply = Apply;
exports.UnicodeChar = UnicodeChar;
// --------------------------------------------------------------------
// Extensions
// --------------------------------------------------------------------
__webpack_require__(/*! ./pexprs-allowsSkippingPrecedingSpace */ "./src/pexprs-allowsSkippingPrecedingSpace.js");
__webpack_require__(/*! ./pexprs-assertAllApplicationsAreValid */ "./src/pexprs-assertAllApplicationsAreValid.js");
__webpack_require__(/*! ./pexprs-assertChoicesHaveUniformArity */ "./src/pexprs-assertChoicesHaveUniformArity.js");
__webpack_require__(/*! ./pexprs-assertIteratedExprsAreNotNullable */ "./src/pexprs-assertIteratedExprsAreNotNullable.js");
__webpack_require__(/*! ./pexprs-check */ "./src/pexprs-check.js");
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
        nextLine = nextLineEndOffset === -1 ? str.slice(lineEndOffset)
            : str.slice(lineEndOffset, nextLineEndOffset);
        // Strip leading and trailing EOL char(s).
        nextLine = nextLine.replace(/^\r?\n/, '').replace(/\r$/, '');
    }
    // Get the previous line.
    if (prevLineStartOffset >= 0) {
        prevLine = str.slice(prevLineStartOffset, lineStartOffset)
            .replace(/\r?\n$/, ''); // Strip trailing EOL char(s).
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
exports.getLineAndColumnMessage = function (str, offset /* ...ranges */) {
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
exports.uniqueId = (function () {
    var idCounter = 0;
    return function (prefix) {
        return '' + prefix + idCounter++;
    };
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
module.exports =  true
    ? "15.0.1"
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vaG0vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL29obS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vaG0vLi4vbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4uL25vZGVfbW9kdWxlcy91dGlsLWV4dGVuZC9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vb2htLy4vZGlzdC9idWlsdC1pbi1ydWxlcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9kaXN0L29obS1ncmFtbWFyLmpzIiwid2VicGFjazovL29obS8uL2Rpc3Qvb3BlcmF0aW9ucy1hbmQtYXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9leHRyYXMvVmlzaXRvckZhbWlseS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9leHRyYXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vb2htLy4vZXh0cmFzL3NlbWFudGljcy10b0FTVC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL29obS8uL3NyYy9CdWlsZGVyLmpzIiwid2VicGFjazovL29obS8uL3NyYy9DYXNlSW5zZW5zaXRpdmVUZXJtaW5hbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvRmFpbHVyZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvR3JhbW1hci5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvR3JhbW1hckRlY2wuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL0lucHV0U3RyZWFtLmpzIiwid2VicGFjazovL29obS8uL3NyYy9JbnRlcnZhbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvTWF0Y2hSZXN1bHQuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL01hdGNoU3RhdGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL01hdGNoZXIuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL05hbWVzcGFjZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvUG9zSW5mby5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvU2VtYW50aWNzLmpzIiwid2VicGFjazovL29obS8uL3NyYy9UcmFjZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvY29tbW9uLmpzIiwid2VicGFjazovL29obS8uL3NyYy9lcnJvcnMuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL25vZGVzLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWFzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1jaGVjay5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWV2YWwuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZW5lcmF0ZUV4YW1wbGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1nZXRBcml0eS5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWludHJvZHVjZVBhcmFtcy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvcGV4cHJzLWlzTnVsbGFibGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1vdXRwdXRSZWNpcGUuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy1zdWJzdGl0dXRlUGFyYW1zLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9Bcmd1bWVudE5hbWVMaXN0LmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9GYWlsdXJlLmpzIiwid2VicGFjazovL29obS8uL3NyYy9wZXhwcnMtdG9TdHJpbmcuanMiLCJ3ZWJwYWNrOi8vb2htLy4vc3JjL3BleHBycy5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdXRpbC5qcyIsIndlYnBhY2s6Ly9vaG0vLi9zcmMvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9vaG0vLi90aGlyZF9wYXJ0eS9Vbmljb2RlQ2F0ZWdvcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztRQ1ZBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0UsdUJBQXVCLEVBQUU7QUFDM0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QixzQkFBc0I7QUFDdEIsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0Esa0RBQWtELGdDQUFnQyxFQUFFO0FBQ3BGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsd0JBQXdCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLG1CQUFPLENBQUMsOEVBQW1DO0FBQ3BGO0FBQ0Esd0RBQXdEO0FBQ3hELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQzluQmE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFPLENBQUMscUNBQVk7QUFDbkMsYUFBYSxtQkFBTyxDQUFDLGlDQUFVO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0Isb0NBQW9DO0FBQzFELENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUUsNEJBQTRCLEVBQUU7QUFDakc7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxT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QUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7Ozs7QUNqSkQ7QUFDYTtBQUNiO0FBQ0E7QUFDQSxpQkFBaUIsS0FBMEM7QUFDM0QsTUFBTSxRQUFzQjtBQUM1QixNQUFNLFNBQWtDOzs7Ozs7Ozs7Ozs7QUNOeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im9obS5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIm9obVwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJvaG1cIl0gPSBmYWN0b3J5KCk7XG59KSh3aW5kb3csIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL21haW4uanNcIik7XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBpZiAoc3VwZXJDdG9yKSB7XG4gICAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGlmIChzdXBlckN0b3IpIHtcbiAgICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gICAgfVxuICB9XG59XG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxubW9kdWxlLmV4cG9ydHMgPSBleHRlbmQ7XG5mdW5jdGlvbiBleHRlbmQob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCB0eXBlb2YgYWRkICE9PSAnb2JqZWN0JykgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn1cbiIsInZhciBvaG0gPSByZXF1aXJlKCcuLicpO1xubW9kdWxlLmV4cG9ydHMgPSBvaG0ubWFrZVJlY2lwZShbXCJncmFtbWFyXCIse1wic291cmNlXCI6XCJCdWlsdEluUnVsZXMge1xcblxcbiAgYWxudW0gIChhbiBhbHBoYS1udW1lcmljIGNoYXJhY3RlcilcXG4gICAgPSBsZXR0ZXJcXG4gICAgfCBkaWdpdFxcblxcbiAgbGV0dGVyICAoYSBsZXR0ZXIpXFxuICAgID0gbG93ZXJcXG4gICAgfCB1cHBlclxcbiAgICB8IHVuaWNvZGVMdG1vXFxuXFxuICBkaWdpdCAgKGEgZGlnaXQpXFxuICAgID0gXFxcIjBcXFwiLi5cXFwiOVxcXCJcXG5cXG4gIGhleERpZ2l0ICAoYSBoZXhhZGVjaW1hbCBkaWdpdClcXG4gICAgPSBkaWdpdFxcbiAgICB8IFxcXCJhXFxcIi4uXFxcImZcXFwiXFxuICAgIHwgXFxcIkFcXFwiLi5cXFwiRlxcXCJcXG5cXG4gIExpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gTm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICB8IEVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG5cXG4gIE5vbmVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBlbGVtIChzZXAgZWxlbSkqXFxuXFxuICBFbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgID0gLyogbm90aGluZyAqL1xcblxcbiAgbGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSBub25lbXB0eUxpc3RPZjxlbGVtLCBzZXA+XFxuICAgIHwgZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcblxcbiAgbm9uZW1wdHlMaXN0T2Y8ZWxlbSwgc2VwPlxcbiAgICA9IGVsZW0gKHNlcCBlbGVtKSpcXG5cXG4gIGVtcHR5TGlzdE9mPGVsZW0sIHNlcD5cXG4gICAgPSAvKiBub3RoaW5nICovXFxuXFxufVwifSxcIkJ1aWx0SW5SdWxlc1wiLG51bGwsbnVsbCx7XCJhbG51bVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4LDc4XX0sXCJhbiBhbHBoYS1udW1lcmljIGNoYXJhY3RlclwiLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYwLDc4XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjAsNjZdfSxcImxldHRlclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3Myw3OF19LFwiZGlnaXRcIixbXV1dXSxcImxldHRlclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzgyLDE0Ml19LFwiYSBsZXR0ZXJcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDcsMTQyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTA3LDExMl19LFwibG93ZXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE5LDEyNF19LFwidXBwZXJcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE0Ml19LFwidW5pY29kZUx0bW9cIixbXV1dXSxcImRpZ2l0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2LDE3N119LFwiYSBkaWdpdFwiLFtdLFtcInJhbmdlXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY5LDE3N119LFwiMFwiLFwiOVwiXV0sXCJoZXhEaWdpdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4MSwyNTRdfSxcImEgaGV4YWRlY2ltYWwgZGlnaXRcIixbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTksMjU0XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5LDIyNF19LFwiZGlnaXRcIixbXV0sW1wicmFuZ2VcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzEsMjM5XX0sXCJhXCIsXCJmXCJdLFtcInJhbmdlXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ2LDI1NF19LFwiQVwiLFwiRlwiXV1dLFwiTGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjU4LDMzNl19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI4MiwzMzZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyODIsMzA3XX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHt9LDBdLFtcInBhcmFtXCIse30sMV1dXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMTQsMzM2XX0sXCJFbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHt9LDBdLFtcInBhcmFtXCIse30sMV1dXV1dLFwiTm9uZW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNDAsMzg4XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzcyLDM4OF19LFtcInBhcmFtXCIse30sMF0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3NywzODhdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszNzgsMzg2XX0sW1wicGFyYW1cIix7fSwxXSxbXCJwYXJhbVwiLHt9LDBdXV1dXSxcIkVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzkyLDQzNF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzQzOCw0MzhdfV1dLFwibGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDM4LDUxNl19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ2Miw1MTZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NjIsNDg3XX0sXCJub25lbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHt9LDBdLFtcInBhcmFtXCIse30sMV1dXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0OTQsNTE2XX0sXCJlbXB0eUxpc3RPZlwiLFtbXCJwYXJhbVwiLHt9LDBdLFtcInBhcmFtXCIse30sMV1dXV1dLFwibm9uZW1wdHlMaXN0T2ZcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjAsNTY4XX0sbnVsbCxbXCJlbGVtXCIsXCJzZXBcIl0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTUyLDU2OF19LFtcInBhcmFtXCIse30sMF0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzU1Nyw1NjhdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTgsNTY2XX0sW1wicGFyYW1cIix7fSwxXSxbXCJwYXJhbVwiLHt9LDBdXV1dXSxcImVtcHR5TGlzdE9mXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTcyLDYxNF19LG51bGwsW1wiZWxlbVwiLFwic2VwXCJdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzYxNiw2MTZdfV1dfV0pO1xuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIk9obSB7XFxuXFxuICBHcmFtbWFyc1xcbiAgICA9IEdyYW1tYXIqXFxuXFxuICBHcmFtbWFyXFxuICAgID0gaWRlbnQgU3VwZXJHcmFtbWFyPyBcXFwie1xcXCIgUnVsZSogXFxcIn1cXFwiXFxuXFxuICBTdXBlckdyYW1tYXJcXG4gICAgPSBcXFwiPDpcXFwiIGlkZW50XFxuXFxuICBSdWxlXFxuICAgID0gaWRlbnQgRm9ybWFscz8gcnVsZURlc2NyPyBcXFwiPVxcXCIgIFJ1bGVCb2R5ICAtLSBkZWZpbmVcXG4gICAgfCBpZGVudCBGb3JtYWxzPyAgICAgICAgICAgIFxcXCI6PVxcXCIgUnVsZUJvZHkgIC0tIG92ZXJyaWRlXFxuICAgIHwgaWRlbnQgRm9ybWFscz8gICAgICAgICAgICBcXFwiKz1cXFwiIFJ1bGVCb2R5ICAtLSBleHRlbmRcXG5cXG4gIFJ1bGVCb2R5XFxuICAgID0gXFxcInxcXFwiPyBOb25lbXB0eUxpc3RPZjxUb3BMZXZlbFRlcm0sIFxcXCJ8XFxcIj5cXG5cXG4gIFRvcExldmVsVGVybVxcbiAgICA9IFNlcSBjYXNlTmFtZSAgLS0gaW5saW5lXFxuICAgIHwgU2VxXFxuXFxuICBGb3JtYWxzXFxuICAgID0gXFxcIjxcXFwiIExpc3RPZjxpZGVudCwgXFxcIixcXFwiPiBcXFwiPlxcXCJcXG5cXG4gIFBhcmFtc1xcbiAgICA9IFxcXCI8XFxcIiBMaXN0T2Y8U2VxLCBcXFwiLFxcXCI+IFxcXCI+XFxcIlxcblxcbiAgQWx0XFxuICAgID0gTm9uZW1wdHlMaXN0T2Y8U2VxLCBcXFwifFxcXCI+XFxuXFxuICBTZXFcXG4gICAgPSBJdGVyKlxcblxcbiAgSXRlclxcbiAgICA9IFByZWQgXFxcIipcXFwiICAtLSBzdGFyXFxuICAgIHwgUHJlZCBcXFwiK1xcXCIgIC0tIHBsdXNcXG4gICAgfCBQcmVkIFxcXCI/XFxcIiAgLS0gb3B0XFxuICAgIHwgUHJlZFxcblxcbiAgUHJlZFxcbiAgICA9IFxcXCJ+XFxcIiBMZXggIC0tIG5vdFxcbiAgICB8IFxcXCImXFxcIiBMZXggIC0tIGxvb2thaGVhZFxcbiAgICB8IExleFxcblxcbiAgTGV4XFxuICAgID0gXFxcIiNcXFwiIEJhc2UgIC0tIGxleFxcbiAgICB8IEJhc2VcXG5cXG4gIEJhc2VcXG4gICAgPSBpZGVudCBQYXJhbXM/IH4ocnVsZURlc2NyPyBcXFwiPVxcXCIgfCBcXFwiOj1cXFwiIHwgXFxcIis9XFxcIikgIC0tIGFwcGxpY2F0aW9uXFxuICAgIHwgb25lQ2hhclRlcm1pbmFsIFxcXCIuLlxcXCIgb25lQ2hhclRlcm1pbmFsICAgICAgICAgICAtLSByYW5nZVxcbiAgICB8IHRlcm1pbmFsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gdGVybWluYWxcXG4gICAgfCBcXFwiKFxcXCIgQWx0IFxcXCIpXFxcIiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHBhcmVuXFxuXFxuICBydWxlRGVzY3IgIChhIHJ1bGUgZGVzY3JpcHRpb24pXFxuICAgID0gXFxcIihcXFwiIHJ1bGVEZXNjclRleHQgXFxcIilcXFwiXFxuXFxuICBydWxlRGVzY3JUZXh0XFxuICAgID0gKH5cXFwiKVxcXCIgYW55KSpcXG5cXG4gIGNhc2VOYW1lXFxuICAgID0gXFxcIi0tXFxcIiAoflxcXCJcXFxcblxcXCIgc3BhY2UpKiBuYW1lICh+XFxcIlxcXFxuXFxcIiBzcGFjZSkqIChcXFwiXFxcXG5cXFwiIHwgJlxcXCJ9XFxcIilcXG5cXG4gIG5hbWUgIChhIG5hbWUpXFxuICAgID0gbmFtZUZpcnN0IG5hbWVSZXN0KlxcblxcbiAgbmFtZUZpcnN0XFxuICAgID0gXFxcIl9cXFwiXFxuICAgIHwgbGV0dGVyXFxuXFxuICBuYW1lUmVzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGFsbnVtXFxuXFxuICBpZGVudCAgKGFuIGlkZW50aWZpZXIpXFxuICAgID0gbmFtZVxcblxcbiAgdGVybWluYWxcXG4gICAgPSBcXFwiXFxcXFxcXCJcXFwiIHRlcm1pbmFsQ2hhciogXFxcIlxcXFxcXFwiXFxcIlxcblxcbiAgb25lQ2hhclRlcm1pbmFsXFxuICAgID0gXFxcIlxcXFxcXFwiXFxcIiB0ZXJtaW5hbENoYXIgXFxcIlxcXFxcXFwiXFxcIlxcblxcbiAgdGVybWluYWxDaGFyXFxuICAgID0gZXNjYXBlQ2hhclxcbiAgICB8IH5cXFwiXFxcXFxcXFxcXFwiIH5cXFwiXFxcXFxcXCJcXFwiIH5cXFwiXFxcXG5cXFwiIGFueVxcblxcbiAgZXNjYXBlQ2hhciAgKGFuIGVzY2FwZSBzZXF1ZW5jZSlcXG4gICAgPSBcXFwiXFxcXFxcXFxcXFxcXFxcXFxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLS0gYmFja3NsYXNoXFxuICAgIHwgXFxcIlxcXFxcXFxcXFxcXFxcXCJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGRvdWJsZVF1b3RlXFxuICAgIHwgXFxcIlxcXFxcXFxcXFxcXCdcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHNpbmdsZVF1b3RlXFxuICAgIHwgXFxcIlxcXFxcXFxcYlxcXCIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIGJhY2tzcGFjZVxcbiAgICB8IFxcXCJcXFxcXFxcXG5cXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBsaW5lRmVlZFxcbiAgICB8IFxcXCJcXFxcXFxcXHJcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBjYXJyaWFnZVJldHVyblxcbiAgICB8IFxcXCJcXFxcXFxcXHRcXFwiICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSB0YWJcXG4gICAgfCBcXFwiXFxcXFxcXFx1XFxcIiBoZXhEaWdpdCBoZXhEaWdpdCBoZXhEaWdpdCBoZXhEaWdpdCAgLS0gdW5pY29kZUVzY2FwZVxcbiAgICB8IFxcXCJcXFxcXFxcXHhcXFwiIGhleERpZ2l0IGhleERpZ2l0ICAgICAgICAgICAgICAgICAgICAtLSBoZXhFc2NhcGVcXG5cXG4gIHNwYWNlXFxuICAgKz0gY29tbWVudFxcblxcbiAgY29tbWVudFxcbiAgICA9IFxcXCIvL1xcXCIgKH5cXFwiXFxcXG5cXFwiIGFueSkqIFxcXCJcXFxcblxcXCIgIC0tIHNpbmdsZUxpbmVcXG4gICAgfCBcXFwiLypcXFwiICh+XFxcIiovXFxcIiBhbnkpKiBcXFwiKi9cXFwiICAtLSBtdWx0aUxpbmVcXG5cXG4gIHRva2VucyA9IHRva2VuKlxcblxcbiAgdG9rZW4gPSBjYXNlTmFtZSB8IGNvbW1lbnQgfCBpZGVudCB8IG9wZXJhdG9yIHwgcHVuY3R1YXRpb24gfCB0ZXJtaW5hbCB8IGFueVxcblxcbiAgb3BlcmF0b3IgPSBcXFwiPDpcXFwiIHwgXFxcIj1cXFwiIHwgXFxcIjo9XFxcIiB8IFxcXCIrPVxcXCIgfCBcXFwiKlxcXCIgfCBcXFwiK1xcXCIgfCBcXFwiP1xcXCIgfCBcXFwiflxcXCIgfCBcXFwiJlxcXCJcXG5cXG4gIHB1bmN0dWF0aW9uID0gXFxcIjxcXFwiIHwgXFxcIj5cXFwiIHwgXFxcIixcXFwiIHwgXFxcIi0tXFxcIlxcbn1cIn0sXCJPaG1cIixudWxsLFwiR3JhbW1hcnNcIix7XCJHcmFtbWFyc1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzksMzJdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNCwzMl19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0LDMxXX0sXCJHcmFtbWFyXCIsW11dXV0sXCJHcmFtbWFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzYsODNdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzUwLDgzXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTAsNTVdfSxcImlkZW50XCIsW11dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU2LDY5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTYsNjhdfSxcIlN1cGVyR3JhbW1hclwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3MCw3M119LFwie1wiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQsNzldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NCw3OF19LFwiUnVsZVwiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MCw4M119LFwifVwiXV1dLFwiU3VwZXJHcmFtbWFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODcsMTE2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDYsMTE2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDYsMTEwXX0sXCI8OlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTEsMTE2XX0sXCJpZGVudFwiLFtdXV1dLFwiUnVsZV9kZWZpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTgxXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMTcwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDEzNl19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM3LDE0NV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNywxNDRdfSxcIkZvcm1hbHNcIixbXV1dLFtcIm9wdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NiwxNTZdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDYsMTU1XX0sXCJydWxlRGVzY3JcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTU3LDE2MF19LFwiPVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjIsMTcwXX0sXCJSdWxlQm9keVwiLFtdXV1dLFwiUnVsZV9vdmVycmlkZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwyNDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4OCwyMjddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxODgsMTkzXX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTQsMjAyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk0LDIwMV19LFwiRm9ybWFsc1wiLFtdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTQsMjE4XX0sXCI6PVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTksMjI3XX0sXCJSdWxlQm9keVwiLFtdXV1dLFwiUnVsZV9leHRlbmRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDcsMjk3XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDcsMjg2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQ3LDI1Ml19LFwiaWRlbnRcIixbXV0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUzLDI2MV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI1MywyNjBdfSxcIkZvcm1hbHNcIixbXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjczLDI3N119LFwiKz1cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjc4LDI4Nl19LFwiUnVsZUJvZHlcIixbXV1dXSxcIlJ1bGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjAsMjk3XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzEsMjk3XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTMxLDE3MF19LFwiUnVsZV9kZWZpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg4LDIyN119LFwiUnVsZV9vdmVycmlkZVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyNDcsMjg2XX0sXCJSdWxlX2V4dGVuZFwiLFtdXV1dLFwiUnVsZUJvZHlcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMDEsMzU0XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszMTYsMzU0XX0sW1wib3B0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzE2LDMyMF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzE2LDMxOV19LFwifFwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzIxLDM1NF19LFwiTm9uZW1wdHlMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzM2LDM0OF19LFwiVG9wTGV2ZWxUZXJtXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzUwLDM1M119LFwifFwiXV1dXV0sXCJUb3BMZXZlbFRlcm1faW5saW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDQwMF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDM4OV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3NywzODBdfSxcIlNlcVwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlszODEsMzg5XX0sXCJjYXNlTmFtZVwiLFtdXV1dLFwiVG9wTGV2ZWxUZXJtXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzU4LDQxMF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMzc3LDQxMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzM3NywzODldfSxcIlRvcExldmVsVGVybV9pbmxpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDA3LDQxMF19LFwiU2VxXCIsW11dXV0sXCJGb3JtYWxzXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDE0LDQ1NF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDI4LDQ1NF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDI4LDQzMV19LFwiPFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0MzIsNDUwXX0sXCJMaXN0T2ZcIixbW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNDM5LDQ0NF19LFwiaWRlbnRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NDYsNDQ5XX0sXCIsXCJdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NTEsNDU0XX0sXCI+XCJdXV0sXCJQYXJhbXNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NTgsNDk1XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NzEsNDk1XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0NzEsNDc0XX0sXCI8XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzQ3NSw0OTFdfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0ODIsNDg1XX0sXCJTZXFcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0ODcsNDkwXX0sXCIsXCJdXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0OTIsNDk1XX0sXCI+XCJdXV0sXCJBbHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls0OTksNTMzXX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MDksNTMzXX0sXCJOb25lbXB0eUxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjQsNTI3XX0sXCJTZXFcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1MjksNTMyXX0sXCJ8XCJdXV1dLFwiU2VxXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTM3LDU1Ml19LG51bGwsW10sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzU0Nyw1NTJdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NDcsNTUxXX0sXCJJdGVyXCIsW11dXV0sXCJJdGVyX3N0YXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjcsNTg0XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjcsNTc1XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTY3LDU3MV19LFwiUHJlZFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU3Miw1NzVdfSxcIipcIl1dXSxcIkl0ZXJfcGx1c1wiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5MSw2MDhdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5MSw1OTldfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1OTEsNTk1XX0sXCJQcmVkXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTk2LDU5OV19LFwiK1wiXV1dLFwiSXRlcl9vcHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTUsNjMxXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTUsNjIzXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjE1LDYxOV19LFwiUHJlZFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzYyMCw2MjNdfSxcIj9cIl1dXSxcIkl0ZXJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NTYsNjQyXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls1NjcsNjQyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTY3LDU3NV19LFwiSXRlcl9zdGFyXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzU5MSw1OTldfSxcIkl0ZXJfcGx1c1wiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MTUsNjIzXX0sXCJJdGVyX29wdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls2MzgsNjQyXX0sXCJQcmVkXCIsW11dXV0sXCJQcmVkX25vdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY1Nyw2NzJdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY1Nyw2NjRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY1Nyw2NjBdfSxcIn5cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjYxLDY2NF19LFwiTGV4XCIsW11dXV0sXCJQcmVkX2xvb2thaGVhZFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY3OSw3MDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzY3OSw2ODZdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY3OSw2ODJdfSxcIiZcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjgzLDY4Nl19LFwiTGV4XCIsW11dXV0sXCJQcmVkXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjQ2LDcxMF19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjU3LDcxMF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY1Nyw2NjRdfSxcIlByZWRfbm90XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzY3OSw2ODZdfSxcIlByZWRfbG9va2FoZWFkXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcwNyw3MTBdfSxcIkxleFwiLFtdXV1dLFwiTGV4X2xleFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyNCw3NDBdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyNCw3MzJdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyNCw3MjddfSxcIiNcIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI4LDczMl19LFwiQmFzZVwiLFtdXV1dLFwiTGV4XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzE0LDc1MV19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzI0LDc1MV19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzcyNCw3MzJdfSxcIkxleF9sZXhcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzQ3LDc1MV19LFwiQmFzZVwiLFtdXV1dLFwiQmFzZV9hcHBsaWNhdGlvblwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Niw4MjddfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2Niw4MTFdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NjYsNzcxXX0sXCJpZGVudFwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3NzIsNzc5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzcyLDc3OF19LFwiUGFyYW1zXCIsW11dXSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3ODAsODExXX0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzgyLDgxMF19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc4Miw3OTZdfSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls3ODIsNzkyXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzgyLDc5MV19LFwicnVsZURlc2NyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc5Myw3OTZdfSxcIj1cIl1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzk5LDgwM119LFwiOj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MDYsODEwXX0sXCIrPVwiXV1dXV0sXCJCYXNlX3JhbmdlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODM0LDg4OV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbODM0LDg3MF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzgzNCw4NDldfSxcIm9uZUNoYXJUZXJtaW5hbFwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg1MCw4NTRdfSxcIi4uXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg1NSw4NzBdfSxcIm9uZUNoYXJUZXJtaW5hbFwiLFtdXV1dLFwiQmFzZV90ZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5Niw5NTRdfSxudWxsLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5Niw5MDRdfSxcInRlcm1pbmFsXCIsW11dXSxcIkJhc2VfcGFyZW5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjEsMTAxNl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTYxLDk3Ml19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTYxLDk2NF19LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjUsOTY4XX0sXCJBbHRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5NjksOTcyXX0sXCIpXCJdXV0sXCJCYXNlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzU1LDEwMTZdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzc2NiwxMDE2XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNzY2LDgxMV19LFwiQmFzZV9hcHBsaWNhdGlvblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4MzQsODcwXX0sXCJCYXNlX3JhbmdlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6Wzg5Niw5MDRdfSxcIkJhc2VfdGVybWluYWxcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbOTYxLDk3Ml19LFwiQmFzZV9wYXJlblwiLFtdXV1dLFwicnVsZURlc2NyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTAyMCwxMDc5XX0sXCJhIHJ1bGUgZGVzY3JpcHRpb25cIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDU4LDEwNzldfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEwNTgsMTA2MV19LFwiKFwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDYyLDEwNzVdfSxcInJ1bGVEZXNjclRleHRcIixbXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDc2LDEwNzldfSxcIilcIl1dXSxcInJ1bGVEZXNjclRleHRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDgzLDExMTRdfSxudWxsLFtdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTAzLDExMTRdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTA0LDExMTJdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTA0LDExMDhdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMDUsMTEwOF19LFwiKVwiXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTEwOSwxMTEyXX0sXCJhbnlcIixbXV1dXV0sXCJjYXNlTmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzExMTgsMTE4Nl19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTEzMywxMTg2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTMzLDExMzddfSxcIi0tXCJdLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTM4LDExNTJdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTM5LDExNTBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTM5LDExNDRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNDAsMTE0NF19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTQ1LDExNTBdfSxcInNwYWNlXCIsW11dXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE1MywxMTU3XX0sXCJuYW1lXCIsW11dLFtcInN0YXJcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTU4LDExNzJdfSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTU5LDExNzBdfSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTU5LDExNjRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExNjAsMTE2NF19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTY1LDExNzBdfSxcInNwYWNlXCIsW11dXV0sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE3NCwxMTg1XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTc0LDExNzhdfSxcIlxcblwiXSxbXCJsb29rYWhlYWRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgxLDExODVdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzExODIsMTE4NV19LFwifVwiXV1dXV0sXCJuYW1lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTE5MCwxMjMwXX0sXCJhIG5hbWVcIixbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjExLDEyMzBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjExLDEyMjBdfSxcIm5hbWVGaXJzdFwiLFtdXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyMSwxMjMwXX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTIyMSwxMjI5XX0sXCJuYW1lUmVzdFwiLFtdXV1dXSxcIm5hbWVGaXJzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMzQsMTI2Nl19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI1MCwxMjY2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjUwLDEyNTNdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI2MCwxMjY2XX0sXCJsZXR0ZXJcIixbXV1dXSxcIm5hbWVSZXN0XCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTI3MCwxMzAwXX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjg1LDEzMDBdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyODUsMTI4OF19LFwiX1wiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjk1LDEzMDBdfSxcImFsbnVtXCIsW11dXV0sXCJpZGVudFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMDQsMTMzN119LFwiYW4gaWRlbnRpZmllclwiLFtdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzMzMsMTMzN119LFwibmFtZVwiLFtdXV0sXCJ0ZXJtaW5hbFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNDEsMTM3OV19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM1NiwxMzc5XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMzU2LDEzNjBdfSxcIlxcXCJcIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNjEsMTM3NF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNjEsMTM3M119LFwidGVybWluYWxDaGFyXCIsW11dXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEzNzUsMTM3OV19LFwiXFxcIlwiXV1dLFwib25lQ2hhclRlcm1pbmFsXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM4MywxNDI3XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDA1LDE0MjddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MDUsMTQwOV19LFwiXFxcIlwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDEwLDE0MjJdfSxcInRlcm1pbmFsQ2hhclwiLFtdXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0MjMsMTQyN119LFwiXFxcIlwiXV1dLFwidGVybWluYWxDaGFyXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQzMSwxNDg4XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDUwLDE0ODhdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDUwLDE0NjBdfSxcImVzY2FwZUNoYXJcIixbXV0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2NywxNDg4XX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ2NywxNDcyXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDY4LDE0NzJdfSxcIlxcXFxcIl1dLFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NzMsMTQ3OF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQ3NCwxNDc4XX0sXCJcXFwiXCJdXSxbXCJub3RcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDc5LDE0ODRdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0ODAsMTQ4NF19LFwiXFxuXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNDg1LDE0ODhdfSxcImFueVwiLFtdXV1dXSxcImVzY2FwZUNoYXJfYmFja3NsYXNoXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUzMSwxNTg2XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1MzEsMTUzN119LFwiXFxcXFxcXFxcIl1dLFwiZXNjYXBlQ2hhcl9kb3VibGVRdW90ZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE1OTMsMTY1MF19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTkzLDE1OTldfSxcIlxcXFxcXFwiXCJdXSxcImVzY2FwZUNoYXJfc2luZ2xlUXVvdGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjU3LDE3MTRdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY1NywxNjYzXX0sXCJcXFxcJ1wiXV0sXCJlc2NhcGVDaGFyX2JhY2tzcGFjZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3MjEsMTc3Nl19LG51bGwsW10sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzIxLDE3MjZdfSxcIlxcXFxiXCJdXSxcImVzY2FwZUNoYXJfbGluZUZlZWRcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzgzLDE4MzddfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc4MywxNzg4XX0sXCJcXFxcblwiXV0sXCJlc2NhcGVDaGFyX2NhcnJpYWdlUmV0dXJuXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTg0NCwxOTA0XX0sbnVsbCxbXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NDQsMTg0OV19LFwiXFxcXHJcIl1dLFwiZXNjYXBlQ2hhcl90YWJcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTExLDE5NjBdfSxudWxsLFtdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTkxMSwxOTE2XX0sXCJcXFxcdFwiXV0sXCJlc2NhcGVDaGFyX3VuaWNvZGVFc2NhcGVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTY3LDIwMjZdfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NjcsMjAwOF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk2NywxOTcyXX0sXCJcXFxcdVwiXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTczLDE5ODFdfSxcImhleERpZ2l0XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5ODIsMTk5MF19LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTk5MSwxOTk5XX0sXCJoZXhEaWdpdFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDAwLDIwMDhdfSxcImhleERpZ2l0XCIsW11dXV0sXCJlc2NhcGVDaGFyX2hleEVzY2FwZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwMzMsMjA4OF19LG51bGwsW10sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjAzMywyMDU2XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMDMzLDIwMzhdfSxcIlxcXFx4XCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwMzksMjA0N119LFwiaGV4RGlnaXRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA0OCwyMDU2XX0sXCJoZXhEaWdpdFwiLFtdXV1dLFwiZXNjYXBlQ2hhclwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0OTIsMjA4OF19LFwiYW4gZXNjYXBlIHNlcXVlbmNlXCIsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUzMSwyMDg4XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTUzMSwxNTM3XX0sXCJlc2NhcGVDaGFyX2JhY2tzbGFzaFwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNTkzLDE1OTldfSxcImVzY2FwZUNoYXJfZG91YmxlUXVvdGVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTY1NywxNjYzXX0sXCJlc2NhcGVDaGFyX3NpbmdsZVF1b3RlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3MjEsMTcyNl19LFwiZXNjYXBlQ2hhcl9iYWNrc3BhY2VcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTc4MywxNzg4XX0sXCJlc2NhcGVDaGFyX2xpbmVGZWVkXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE4NDQsMTg0OV19LFwiZXNjYXBlQ2hhcl9jYXJyaWFnZVJldHVyblwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxOTExLDE5MTZdfSxcImVzY2FwZUNoYXJfdGFiXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5NjcsMjAwOF19LFwiZXNjYXBlQ2hhcl91bmljb2RlRXNjYXBlXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwMzMsMjA1Nl19LFwiZXNjYXBlQ2hhcl9oZXhFc2NhcGVcIixbXV1dXSxcInNwYWNlXCI6W1wiZXh0ZW5kXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjA5MiwyMTExXX0sbnVsbCxbXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTA0LDIxMTFdfSxcImNvbW1lbnRcIixbXV1dLFwiY29tbWVudF9zaW5nbGVMaW5lXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyOSwyMTY2XX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTI5LDIxNTFdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMjksMjEzM119LFwiLy9cIl0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMzQsMjE0Nl19LFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMzUsMjE0NF19LFtcIm5vdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMzUsMjE0MF19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEzNiwyMTQwXX0sXCJcXG5cIl1dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNDEsMjE0NF19LFwiYW55XCIsW11dXV0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTQ3LDIxNTFdfSxcIlxcblwiXV1dLFwiY29tbWVudF9tdWx0aUxpbmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTczLDIyMDldfSxudWxsLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxNzMsMjE5NV19LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3MywyMTc3XX0sXCIvKlwiXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3OCwyMTkwXX0sW1wic2VxXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3OSwyMTg4XX0sW1wibm90XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3OSwyMTg0XX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTgwLDIxODRdfSxcIiovXCJdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMTg1LDIxODhdfSxcImFueVwiLFtdXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE5MSwyMTk1XX0sXCIqL1wiXV1dLFwiY29tbWVudFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIxMTUsMjIwOV19LG51bGwsW10sW1wiYWx0XCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyOSwyMjA5XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjEyOSwyMTUxXX0sXCJjb21tZW50X3NpbmdsZUxpbmVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3MywyMTk1XX0sXCJjb21tZW50X211bHRpTGluZVwiLFtdXV1dLFwidG9rZW5zXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIxMywyMjI4XX0sbnVsbCxbXSxbXCJzdGFyXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIyMiwyMjI4XX0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjIyMiwyMjI3XX0sXCJ0b2tlblwiLFtdXV1dLFwidG9rZW5cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjMyLDIzMDhdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNDAsMjMwOF19LFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNDAsMjI0OF19LFwiY2FzZU5hbWVcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI1MSwyMjU4XX0sXCJjb21tZW50XCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNjEsMjI2Nl19LFwiaWRlbnRcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjI2OSwyMjc3XX0sXCJvcGVyYXRvclwiLFtdXSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMjgwLDIyOTFdfSxcInB1bmN0dWF0aW9uXCIsW11dLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyOTQsMjMwMl19LFwidGVybWluYWxcIixbXV0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMwNSwyMzA4XX0sXCJhbnlcIixbXV1dXSxcIm9wZXJhdG9yXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjMxMiwyMzc3XX0sbnVsbCxbXSxbXCJhbHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzIzLDIzNzddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzMjMsMjMyN119LFwiPDpcIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzMwLDIzMzNdfSxcIj1cIl0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzM2LDIzNDBdfSxcIjo9XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM0MywyMzQ3XX0sXCIrPVwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNTAsMjM1M119LFwiKlwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNTYsMjM1OV19LFwiK1wiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNjIsMjM2NV19LFwiP1wiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNjgsMjM3MV19LFwiflwiXSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzNzQsMjM3N119LFwiJlwiXV1dLFwicHVuY3R1YXRpb25cIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyMzgxLDI0MTddfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIzOTUsMjQxN119LFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjM5NSwyMzk4XX0sXCI8XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQwMSwyNDA0XX0sXCI+XCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQwNywyNDEwXX0sXCIsXCJdLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjQxMywyNDE3XX0sXCItLVwiXV1dfV0pO1xuIiwidmFyIG9obSA9IHJlcXVpcmUoJy4uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IG9obS5tYWtlUmVjaXBlKFtcImdyYW1tYXJcIix7XCJzb3VyY2VcIjpcIk9wZXJhdGlvbnNBbmRBdHRyaWJ1dGVzIHtcXG5cXG4gIEF0dHJpYnV0ZVNpZ25hdHVyZSA9XFxuICAgIG5hbWVcXG5cXG4gIE9wZXJhdGlvblNpZ25hdHVyZSA9XFxuICAgIG5hbWUgRm9ybWFscz9cXG5cXG4gIEZvcm1hbHNcXG4gICAgPSBcXFwiKFxcXCIgTGlzdE9mPG5hbWUsIFxcXCIsXFxcIj4gXFxcIilcXFwiXFxuXFxuICBuYW1lICAoYSBuYW1lKVxcbiAgICA9IG5hbWVGaXJzdCBuYW1lUmVzdCpcXG5cXG4gIG5hbWVGaXJzdFxcbiAgICA9IFxcXCJfXFxcIlxcbiAgICB8IGxldHRlclxcblxcbiAgbmFtZVJlc3RcXG4gICAgPSBcXFwiX1xcXCJcXG4gICAgfCBhbG51bVxcblxcbn1cIn0sXCJPcGVyYXRpb25zQW5kQXR0cmlidXRlc1wiLG51bGwsXCJBdHRyaWJ1dGVTaWduYXR1cmVcIix7XCJBdHRyaWJ1dGVTaWduYXR1cmVcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsyOSw1OF19LG51bGwsW10sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNTQsNThdfSxcIm5hbWVcIixbXV1dLFwiT3BlcmF0aW9uU2lnbmF0dXJlXCI6W1wiZGVmaW5lXCIse1wic291cmNlSW50ZXJ2YWxcIjpbNjIsMTAwXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4NywxMDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls4Nyw5MV19LFwibmFtZVwiLFtdXSxbXCJvcHRcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5MiwxMDBdfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOls5Miw5OV19LFwiRm9ybWFsc1wiLFtdXV1dXSxcIkZvcm1hbHNcIjpbXCJkZWZpbmVcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMDQsMTQzXX0sbnVsbCxbXSxbXCJzZXFcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgsMTQzXX0sW1widGVybWluYWxcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMTgsMTIxXX0sXCIoXCJdLFtcImFwcFwiLHtcInNvdXJjZUludGVydmFsXCI6WzEyMiwxMzldfSxcIkxpc3RPZlwiLFtbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxMjksMTMzXX0sXCJuYW1lXCIsW11dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTM1LDEzOF19LFwiLFwiXV1dLFtcInRlcm1pbmFsXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMTQwLDE0M119LFwiKVwiXV1dLFwibmFtZVwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE0NywxODddfSxcImEgbmFtZVwiLFtdLFtcInNlcVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE2OCwxODddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNjgsMTc3XX0sXCJuYW1lRmlyc3RcIixbXV0sW1wic3RhclwiLHtcInNvdXJjZUludGVydmFsXCI6WzE3OCwxODddfSxbXCJhcHBcIix7XCJzb3VyY2VJbnRlcnZhbFwiOlsxNzgsMTg2XX0sXCJuYW1lUmVzdFwiLFtdXV1dXSxcIm5hbWVGaXJzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzE5MSwyMjNdfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNywyMjNdfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzIwNywyMTBdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjE3LDIyM119LFwibGV0dGVyXCIsW11dXV0sXCJuYW1lUmVzdFwiOltcImRlZmluZVwiLHtcInNvdXJjZUludGVydmFsXCI6WzIyNywyNTddfSxudWxsLFtdLFtcImFsdFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MiwyNTddfSxbXCJ0ZXJtaW5hbFwiLHtcInNvdXJjZUludGVydmFsXCI6WzI0MiwyNDVdfSxcIl9cIl0sW1wiYXBwXCIse1wic291cmNlSW50ZXJ2YWxcIjpbMjUyLDI1N119LFwiYWxudW1cIixbXV1dXX1dKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4uL3NyYy9jb21tb24nKS5hc3NlcnQ7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEhlbHBlcnNcbmZ1bmN0aW9uIGdldFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gICAgcmV0dXJuIGZuKHRoaW5nW25hbWVdKTtcbn1cbmZ1bmN0aW9uIG1hcFByb3AobmFtZSwgdGhpbmcsIGZuKSB7XG4gICAgcmV0dXJuIHRoaW5nW25hbWVdLm1hcChmbik7XG59XG4vLyBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCB3aWxsIHdhbGsgYSBzaW5nbGUgcHJvcGVydHkgb2YgYSBub2RlLlxuLy8gYGRlc2NyaXB0b3JgIGlzIGEgc3RyaW5nIGluZGljYXRpbmcgdGhlIHByb3BlcnR5IG5hbWUsIG9wdGlvbmFsbHkgZW5kaW5nXG4vLyB3aXRoICdbXScgKGUuZy4sICdjaGlsZHJlbltdJykuXG5mdW5jdGlvbiBnZXRQcm9wV2Fsa0ZuKGRlc2NyaXB0b3IpIHtcbiAgICB2YXIgcGFydHMgPSBkZXNjcmlwdG9yLnNwbGl0KC8gP1xcW1xcXS8pO1xuICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgcmV0dXJuIG1hcFByb3AuYmluZChudWxsLCBwYXJ0c1swXSk7XG4gICAgfVxuICAgIHJldHVybiBnZXRQcm9wLmJpbmQobnVsbCwgZGVzY3JpcHRvcik7XG59XG5mdW5jdGlvbiBnZXRQcm9wcyh3YWxrRm5zLCB0aGluZywgZm4pIHtcbiAgICByZXR1cm4gd2Fsa0Zucy5tYXAoZnVuY3Rpb24gKHdhbGtGbikge1xuICAgICAgICByZXR1cm4gd2Fsa0ZuKHRoaW5nLCBmbik7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBnZXRXYWxrRm4oc2hhcGUpIHtcbiAgICBpZiAodHlwZW9mIHNoYXBlID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gZ2V0UHJvcHMuYmluZChudWxsLCBbZ2V0UHJvcFdhbGtGbihzaGFwZSldKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShzaGFwZSkpIHtcbiAgICAgICAgcmV0dXJuIGdldFByb3BzLmJpbmQobnVsbCwgc2hhcGUubWFwKGdldFByb3BXYWxrRm4pKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGFzc2VydCh0eXBlb2Ygc2hhcGUgPT09ICdmdW5jdGlvbicsICdFeHBlY3RlZCBhIHN0cmluZywgQXJyYXksIG9yIGZ1bmN0aW9uJyk7XG4gICAgICAgIGFzc2VydChzaGFwZS5sZW5ndGggPT09IDIsICdFeHBlY3RlZCBhIGZ1bmN0aW9uIG9mIGFyaXR5IDIsIGdvdCAnICsgc2hhcGUubGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGlzUmVzdHJpY3RlZElkZW50aWZpZXIoc3RyKSB7XG4gICAgcmV0dXJuIC9eW2EtekEtWl9dWzAtOWEtekEtWl9dKiQvLnRlc3Qoc3RyKTtcbn1cbmZ1bmN0aW9uIHRyaW0ocykge1xuICAgIHJldHVybiBzLnRyaW0oKTtcbn1cbmZ1bmN0aW9uIHBhcnNlU2lnbmF0dXJlKHNpZykge1xuICAgIHZhciBwYXJ0cyA9IHNpZy5zcGxpdCgvWygpXS8pLm1hcCh0cmltKTtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAzICYmIHBhcnRzWzJdID09PSAnJykge1xuICAgICAgICB2YXIgbmFtZSA9IHBhcnRzWzBdO1xuICAgICAgICB2YXIgcGFyYW1zID0gW107XG4gICAgICAgIGlmIChwYXJ0c1sxXS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJ0c1sxXS5zcGxpdCgnLCcpLm1hcCh0cmltKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNSZXN0cmljdGVkSWRlbnRpZmllcihuYW1lKSAmJiBwYXJhbXMuZXZlcnkoaXNSZXN0cmljdGVkSWRlbnRpZmllcikpIHtcbiAgICAgICAgICAgIHJldHVybiB7IG5hbWU6IG5hbWUsIGZvcm1hbHM6IHBhcmFtcyB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBvcGVyYXRpb24gc2lnbmF0dXJlOiAnICsgc2lnKTtcbn1cbi8qXG4gIEEgVmlzaXRvckZhbWlseSBjb250YWlucyBhIHNldCBvZiByZWN1cnNpdmUgb3BlcmF0aW9ucyB0aGF0IGFyZSBkZWZpbmVkIG92ZXIgc29tZSBraW5kIG9mXG4gIHRyZWUgc3RydWN0dXJlLiBUaGUgYGNvbmZpZ2AgcGFyYW1ldGVyIHNwZWNpZmllcyBob3cgdG8gd2FsayB0aGUgdHJlZTpcbiAgLSAnZ2V0VGFnJyBpcyBmdW5jdGlvbiB3aGljaCwgZ2l2ZW4gYSBub2RlIGluIHRoZSB0cmVlLCByZXR1cm5zIHRoZSBub2RlJ3MgJ3RhZycgKHR5cGUpXG4gIC0gJ3NoYXBlcycgYW4gb2JqZWN0IHRoYXQgbWFwcyBmcm9tIGEgdGFnIHRvIGEgdmFsdWUgdGhhdCBkZXNjcmliZXMgaG93IHRvIHJlY3Vyc2l2ZWx5XG4gICAgZXZhbHVhdGUgdGhlIG9wZXJhdGlvbiBmb3Igbm9kZXMgb2YgdGhhdCB0eXBlLiBUaGUgdmFsdWUgY2FuIGJlOlxuICAgICogYSBzdHJpbmcgaW5kaWNhdGluZyB0aGUgcHJvcGVydHkgbmFtZSB0aGF0IGhvbGRzIHRoYXQgbm9kZSdzIG9ubHkgY2hpbGRcbiAgICAqIGFuIEFycmF5IG9mIHByb3BlcnR5IG5hbWVzIChvciBhbiBlbXB0eSBhcnJheSBpbmRpY2F0aW5nIGEgbGVhZiB0eXBlKSwgb3JcbiAgICAqIGEgZnVuY3Rpb24gdGFraW5nIHR3byBhcmd1bWVudHMgKG5vZGUsIGZuKSwgYW5kIHJldHVybmluZyBhbiBBcnJheSB3aGljaCBpcyB0aGUgcmVzdWx0XG4gICAgICBvZiBhcHBseSBgZm5gIHRvIGVhY2ggb2YgdGhlIG5vZGUncyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gVmlzaXRvckZhbWlseShjb25maWcpIHtcbiAgICB0aGlzLl9zaGFwZXMgPSBjb25maWcuc2hhcGVzO1xuICAgIHRoaXMuX2dldFRhZyA9IGNvbmZpZy5nZXRUYWc7XG4gICAgdGhpcy5BZGFwdGVyID0gZnVuY3Rpb24gKHRoaW5nLCBmYW1pbHkpIHtcbiAgICAgICAgdGhpcy5fYWRhcHRlZSA9IHRoaW5nO1xuICAgICAgICB0aGlzLl9mYW1pbHkgPSBmYW1pbHk7XG4gICAgfTtcbiAgICB0aGlzLkFkYXB0ZXIucHJvdG90eXBlLnZhbHVlT2YgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignaGVlZXkhJyk7XG4gICAgfTtcbiAgICB0aGlzLm9wZXJhdGlvbnMgPSB7fTtcbiAgICB0aGlzLl9hcml0aWVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9nZXRDaGlsZHJlbiA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuX3NoYXBlcykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICB2YXIgc2hhcGUgPSBzZWxmLl9zaGFwZXNba107XG4gICAgICAgIHNlbGYuX2dldENoaWxkcmVuW2tdID0gZ2V0V2Fsa0ZuKHNoYXBlKTtcbiAgICAgICAgLy8gQSBmdW5jdGlvbiBtZWFucyB0aGUgYXJpdHkgaXNuJ3QgZml4ZWQsIHNvIGRvbid0IHB1dCBhbiBlbnRyeSBpbiB0aGUgYXJpdHkgbWFwLlxuICAgICAgICBpZiAodHlwZW9mIHNoYXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBzZWxmLl9hcml0aWVzW2tdID0gQXJyYXkuaXNBcnJheShzaGFwZSkgPyBzaGFwZS5sZW5ndGggOiAxO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5fd3JhcCA9IGZ1bmN0aW9uICh0aGluZykgeyByZXR1cm4gbmV3IHNlbGYuQWRhcHRlcih0aGluZywgc2VsZik7IH07XG59XG5WaXNpdG9yRmFtaWx5LnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24gKHRoaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuX3dyYXAodGhpbmcpO1xufTtcblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLl9jaGVja0FjdGlvbkRpY3QgPSBmdW5jdGlvbiAoZGljdCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBPYmplY3Qua2V5cyhkaWN0KS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgIGFzc2VydChrIGluIHNlbGYuX2dldENoaWxkcmVuLCBcIlVucmVjb2duaXplZCBhY3Rpb24gbmFtZSAnXCIgKyBrICsgXCInXCIpO1xuICAgICAgICB2YXIgYWN0aW9uID0gZGljdFtrXTtcbiAgICAgICAgYXNzZXJ0KHR5cGVvZiBhY3Rpb24gPT09ICdmdW5jdGlvbicsIFwiS2V5ICdcIiArIGsgKyBcIic6IGV4cGVjdGVkIGZ1bmN0aW9uLCBnb3QgXCIgKyBhY3Rpb24pO1xuICAgICAgICBpZiAoayBpbiBzZWxmLl9hcml0aWVzKSB7XG4gICAgICAgICAgICB2YXIgZXhwZWN0ZWQgPSBzZWxmLl9hcml0aWVzW2tdO1xuICAgICAgICAgICAgdmFyIGFjdHVhbCA9IGRpY3Rba10ubGVuZ3RoO1xuICAgICAgICAgICAgYXNzZXJ0KGFjdHVhbCA9PT0gZXhwZWN0ZWQsIFwiQWN0aW9uICdcIiArIGsgKyBcIicgaGFzIHRoZSB3cm9uZyBhcml0eTogZXhwZWN0ZWQgXCIgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsKTtcbiAgICAgICAgfVxuICAgIH0pO1xufTtcblZpc2l0b3JGYW1pbHkucHJvdG90eXBlLmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uIChzaWduYXR1cmUsIGFjdGlvbnMpIHtcbiAgICB2YXIgc2lnID0gcGFyc2VTaWduYXR1cmUoc2lnbmF0dXJlKTtcbiAgICB2YXIgbmFtZSA9IHNpZy5uYW1lO1xuICAgIHRoaXMuX2NoZWNrQWN0aW9uRGljdChhY3Rpb25zKTtcbiAgICB0aGlzLm9wZXJhdGlvbnNbbmFtZV0gPSB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGZvcm1hbHM6IHNpZy5mb3JtYWxzLFxuICAgICAgICBhY3Rpb25zOiBhY3Rpb25zXG4gICAgfTtcbiAgICB2YXIgZmFtaWx5ID0gdGhpcztcbiAgICB0aGlzLkFkYXB0ZXIucHJvdG90eXBlW25hbWVdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGFnID0gZmFtaWx5Ll9nZXRUYWcodGhpcy5fYWRhcHRlZSk7XG4gICAgICAgIGFzc2VydCh0YWcgaW4gZmFtaWx5Ll9nZXRDaGlsZHJlbiwgXCJnZXRUYWcgcmV0dXJuZWQgdW5yZWNvZ25pemVkIHRhZyAnXCIgKyB0YWcgKyBcIidcIik7XG4gICAgICAgIGFzc2VydCh0YWcgaW4gYWN0aW9ucywgXCJObyBhY3Rpb24gZm9yICdcIiArIHRhZyArIFwiJyBpbiBvcGVyYXRpb24gJ1wiICsgbmFtZSArIFwiJ1wiKTtcbiAgICAgICAgLy8gQ3JlYXRlIGFuIFwiYXJndW1lbnRzIG9iamVjdFwiIGZyb20gdGhlIGFyZ3VtZW50cyB0aGF0IHdlcmUgcGFzc2VkIHRvIHRoaXNcbiAgICAgICAgLy8gb3BlcmF0aW9uIC8gYXR0cmlidXRlLlxuICAgICAgICB2YXIgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW3NpZy5mb3JtYWxzW2ldXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb2xkQXJncyA9IHRoaXMuYXJncztcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcbiAgICAgICAgdmFyIGFucyA9IGFjdGlvbnNbdGFnXS5hcHBseSh0aGlzLCBmYW1pbHkuX2dldENoaWxkcmVuW3RhZ10odGhpcy5fYWRhcHRlZSwgZmFtaWx5Ll93cmFwKSk7XG4gICAgICAgIHRoaXMuYXJncyA9IG9sZEFyZ3M7XG4gICAgICAgIHJldHVybiBhbnM7XG4gICAgfTtcbiAgICByZXR1cm4gdGhpcztcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gVmlzaXRvckZhbWlseTtcbiIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFZpc2l0b3JGYW1pbHk6IHJlcXVpcmUoJy4vVmlzaXRvckZhbWlseScpLFxuICAgIHNlbWFudGljc0ZvclRvQVNUOiByZXF1aXJlKCcuL3NlbWFudGljcy10b0FTVCcpLnNlbWFudGljcyxcbiAgICB0b0FTVDogcmVxdWlyZSgnLi9zZW1hbnRpY3MtdG9BU1QnKS5oZWxwZXJcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuLi9zcmMvcGV4cHJzJyk7XG52YXIgTWF0Y2hSZXN1bHQgPSByZXF1aXJlKCcuLi9zcmMvTWF0Y2hSZXN1bHQnKTtcbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi4vc3JjL0dyYW1tYXInKTtcbnZhciBleHRlbmQgPSByZXF1aXJlKCd1dGlsLWV4dGVuZCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgZGVmYXVsdE9wZXJhdGlvbiA9IHtcbiAgICBfdGVybWluYWw6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gICAgfSxcbiAgICBfbm9udGVybWluYWw6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICB2YXIgY3Rvck5hbWUgPSB0aGlzLl9ub2RlLmN0b3JOYW1lO1xuICAgICAgICB2YXIgbWFwcGluZyA9IHRoaXMuYXJncy5tYXBwaW5nO1xuICAgICAgICAvLyB3aXRob3V0IGN1c3RvbWl6YXRpb25cbiAgICAgICAgaWYgKCFtYXBwaW5nLmhhc093blByb3BlcnR5KGN0b3JOYW1lKSkge1xuICAgICAgICAgICAgLy8gaW50ZXJtZWRpYXRlIG5vZGVcbiAgICAgICAgICAgIGlmICh0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFsdCB8fCB0aGlzLl9ub2RlIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbGV4aWNhbCBydWxlXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xleGljYWwoKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHNpbmd1bGFyIG5vZGUgKGUuZy4gb25seSBzdXJyb3VuZGVkIGJ5IGxpdGVyYWxzIG9yIGxvb2thaGVhZHMpXG4gICAgICAgICAgICB2YXIgcmVhbENoaWxkcmVuID0gY2hpbGRyZW4uZmlsdGVyKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAhY2hpbGQuaXNUZXJtaW5hbCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAocmVhbENoaWxkcmVuLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWFsQ2hpbGRyZW5bMF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyByZXN0OiB0ZXJtcyB3aXRoIG11bHRpcGxlIGNoaWxkcmVuXG4gICAgICAgIH1cbiAgICAgICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICAgICAgaWYgKHR5cGVvZiBtYXBwaW5nW2N0b3JOYW1lXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZHJlblttYXBwaW5nW2N0b3JOYW1lXV0udG9BU1QobWFwcGluZyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbmFtZWQvbWFwcGVkIGNoaWxkcmVuIG9yIHVubmFtZWQgY2hpbGRyZW4gKCcwJywgJzEnLCAnMicsIC4uLilcbiAgICAgICAgdmFyIHByb3BNYXAgPSBtYXBwaW5nW2N0b3JOYW1lXSB8fCBjaGlsZHJlbjtcbiAgICAgICAgdmFyIG5vZGUgPSB7XG4gICAgICAgICAgICB0eXBlOiBjdG9yTmFtZVxuICAgICAgICB9O1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHByb3BNYXApIHtcbiAgICAgICAgICAgIHZhciBtYXBwZWRQcm9wID0gbWFwcGluZ1tjdG9yTmFtZV0gJiYgbWFwcGluZ1tjdG9yTmFtZV1bcHJvcF07XG4gICAgICAgICAgICBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgLy8gZGlyZWN0IGZvcndhcmRcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gY2hpbGRyZW5bbWFwcGVkUHJvcF0udG9BU1QobWFwcGluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICgodHlwZW9mIG1hcHBlZFByb3AgPT09ICdzdHJpbmcnKSB8fCAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdib29sZWFuJykgfHxcbiAgICAgICAgICAgICAgICAobWFwcGVkUHJvcCA9PT0gbnVsbCkpIHtcbiAgICAgICAgICAgICAgICAvLyBwcmltaXRpdmUgdmFsdWVcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gbWFwcGVkUHJvcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCh0eXBlb2YgbWFwcGVkUHJvcCA9PT0gJ29iamVjdCcpICYmIChtYXBwZWRQcm9wIGluc3RhbmNlb2YgTnVtYmVyKSkge1xuICAgICAgICAgICAgICAgIC8vIHByaW1pdGl2ZSBudW1iZXIgKG11c3QgYmUgdW5ib3hlZClcbiAgICAgICAgICAgICAgICBub2RlW3Byb3BdID0gTnVtYmVyKG1hcHBlZFByb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1hcHBlZFByb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjb21wdXRlZCB2YWx1ZVxuICAgICAgICAgICAgICAgIG5vZGVbcHJvcF0gPSBtYXBwZWRQcm9wLmNhbGwodGhpcywgY2hpbGRyZW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobWFwcGVkUHJvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuW3Byb3BdICYmICFjaGlsZHJlbltwcm9wXS5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZVtwcm9wXSA9IGNoaWxkcmVuW3Byb3BdLnRvQVNUKG1hcHBpbmcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVsZXRlIHByZWRlZmluZWQgJ3R5cGUnIHByb3BlcnRpZXMsIGxpa2UgJ3R5cGUnLCBpZiBleHBsaWNpdGVseSByZW1vdmVkXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBub2RlW3Byb3BdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9LFxuICAgIF9pdGVyOiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKHRoaXMuX25vZGUuaXNPcHRpb25hbCgpKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5udW1DaGlsZHJlbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuWzBdLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkLnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfSxcbiAgICBOb25lbXB0eUxpc3RPZjogZnVuY3Rpb24gKGZpcnN0LCBzZXAsIHJlc3QpIHtcbiAgICAgICAgcmV0dXJuIFtmaXJzdC50b0FTVCh0aGlzLmFyZ3MubWFwcGluZyldLmNvbmNhdChyZXN0LnRvQVNUKHRoaXMuYXJncy5tYXBwaW5nKSk7XG4gICAgfSxcbiAgICBFbXB0eUxpc3RPZjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxufTtcbi8vIFJldHVybnMgYSBwbGFpbiBKYXZhU2NyaXB0IG9iamVjdCB0aGF0IGluY2x1ZGVzIGFuIGFic3RyYWN0IHN5bnRheCB0cmVlIChBU1QpXG4vLyBmb3IgdGhlIGdpdmVuIG1hdGNoIHJlc3VsdCBgcmVzYCBjb250YWluZyBhIGNvbmNyZXRlIHN5bnRheCB0cmVlIChDU1QpIGFuZCBncmFtbWFyLlxuLy8gVGhlIG9wdGlvbmFsIGBtYXBwaW5nYCBwYXJhbWV0ZXIgY2FuIGJlIHVzZWQgdG8gY3VzdG9taXplIGhvdyB0aGUgbm9kZXMgb2YgdGhlIENTVFxuLy8gYXJlIG1hcHBlZCB0byB0aGUgQVNUIChzZWUgL2RvYy9leHRyYXMubWQjdG9hc3RtYXRjaHJlc3VsdC1tYXBwaW5nKS5cbmZ1bmN0aW9uIHRvQVNUKHJlcywgbWFwcGluZykge1xuICAgIGlmICghKHJlcyBpbnN0YW5jZW9mIE1hdGNoUmVzdWx0KSB8fCByZXMuZmFpbGVkKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0b0FTVCgpIGV4cGVjdHMgYSBzdWNjZXNmdWxsIE1hdGNoUmVzdWx0IGFzIGZpcnN0IHBhcmFtZXRlcicpO1xuICAgIH1cbiAgICBtYXBwaW5nID0gZXh0ZW5kKHt9LCBtYXBwaW5nKTtcbiAgICB2YXIgb3BlcmF0aW9uID0gZXh0ZW5kKHt9LCBkZWZhdWx0T3BlcmF0aW9uKTtcbiAgICBmb3IgKHZhciB0ZXJtTmFtZSBpbiBtYXBwaW5nKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbWFwcGluZ1t0ZXJtTmFtZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIG9wZXJhdGlvblt0ZXJtTmFtZV0gPSBtYXBwaW5nW3Rlcm1OYW1lXTtcbiAgICAgICAgICAgIGRlbGV0ZSBtYXBwaW5nW3Rlcm1OYW1lXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB2YXIgZyA9IHJlcy5fY3N0LmdyYW1tYXI7XG4gICAgdmFyIHMgPSBnLmNyZWF0ZVNlbWFudGljcygpLmFkZE9wZXJhdGlvbigndG9BU1QobWFwcGluZyknLCBvcGVyYXRpb24pO1xuICAgIHJldHVybiBzKHJlcykudG9BU1QobWFwcGluZyk7XG59XG4vLyBSZXR1cm5zIGEgc2VtYW50aWNzIGNvbnRhaW5nIHRoZSB0b0FTVChtYXBwaW5nKSBvcGVyYXRpb24gZm9yIHRoZSBnaXZlbiBncmFtbWFyIGcuXG5mdW5jdGlvbiBzZW1hbnRpY3NGb3JUb0FTVChnKSB7XG4gICAgaWYgKCEoZyBpbnN0YW5jZW9mIEdyYW1tYXIpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2VtYW50aWNzVG9BU1QoKSBleHBlY3RzIGEgR3JhbW1hciBhcyBwYXJhbWV0ZXInKTtcbiAgICB9XG4gICAgcmV0dXJuIGcuY3JlYXRlU2VtYW50aWNzKCkuYWRkT3BlcmF0aW9uKCd0b0FTVChtYXBwaW5nKScsIGRlZmF1bHRPcGVyYXRpb24pO1xufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgaGVscGVyOiB0b0FTVCxcbiAgICBzZW1hbnRpY3M6IHNlbWFudGljc0ZvclRvQVNUXG59O1xuIiwiLyohXG4gKiBEZXRlcm1pbmUgaWYgYW4gb2JqZWN0IGlzIGEgQnVmZmVyXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyIChvYmopIHtcbiAgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmXG4gICAgdHlwZW9mIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJyAmJiBvYmouY29uc3RydWN0b3IuaXNCdWZmZXIob2JqKVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgR3JhbW1hckRlY2wgPSByZXF1aXJlKCcuL0dyYW1tYXJEZWNsJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gQnVpbGRlcigpIHsgfVxuQnVpbGRlci5wcm90b3R5cGUgPSB7XG4gICAgY3VycmVudERlY2w6IG51bGwsXG4gICAgbmV3R3JhbW1hcjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBHcmFtbWFyRGVjbChuYW1lKTtcbiAgICB9LFxuICAgIGdyYW1tYXI6IGZ1bmN0aW9uIChtZXRhSW5mbywgbmFtZSwgc3VwZXJHcmFtbWFyLCBkZWZhdWx0U3RhcnRSdWxlLCBydWxlcykge1xuICAgICAgICB2YXIgZ0RlY2wgPSBuZXcgR3JhbW1hckRlY2wobmFtZSk7XG4gICAgICAgIGlmIChzdXBlckdyYW1tYXIpIHtcbiAgICAgICAgICAgIGdEZWNsLndpdGhTdXBlckdyYW1tYXIodGhpcy5mcm9tUmVjaXBlKHN1cGVyR3JhbW1hcikpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICAgICAgICBnRGVjbC53aXRoRGVmYXVsdFN0YXJ0UnVsZShkZWZhdWx0U3RhcnRSdWxlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWV0YUluZm8gJiYgbWV0YUluZm8uc291cmNlKSB7XG4gICAgICAgICAgICBnRGVjbC53aXRoU291cmNlKG1ldGFJbmZvLnNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB0aGlzLmN1cnJlbnREZWNsID0gZ0RlY2w7XG4gICAgICAgIE9iamVjdC5rZXlzKHJ1bGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICAgICAgdmFyIHJ1bGVSZWNpcGUgPSBydWxlc1tydWxlTmFtZV07XG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gcnVsZVJlY2lwZVswXTsgLy8gZGVmaW5lL2V4dGVuZC9vdmVycmlkZVxuICAgICAgICAgICAgdmFyIG1ldGFJbmZvID0gcnVsZVJlY2lwZVsxXTtcbiAgICAgICAgICAgIHZhciBkZXNjcmlwdGlvbiA9IHJ1bGVSZWNpcGVbMl07XG4gICAgICAgICAgICB2YXIgZm9ybWFscyA9IHJ1bGVSZWNpcGVbM107XG4gICAgICAgICAgICB2YXIgYm9keSA9IHNlbGYuZnJvbVJlY2lwZShydWxlUmVjaXBlWzRdKTtcbiAgICAgICAgICAgIHZhciBzb3VyY2U7XG4gICAgICAgICAgICBpZiAoZ0RlY2wuc291cmNlICYmIG1ldGFJbmZvICYmIG1ldGFJbmZvLnNvdXJjZUludGVydmFsKSB7XG4gICAgICAgICAgICAgICAgc291cmNlID0gZ0RlY2wuc291cmNlLnN1YkludGVydmFsKG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzBdLCBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbFsxXSAtIG1ldGFJbmZvLnNvdXJjZUludGVydmFsWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdEZWNsW2FjdGlvbl0ocnVsZU5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdXJyZW50RGVjbCA9IG51bGw7XG4gICAgICAgIHJldHVybiBnRGVjbC5idWlsZCgpO1xuICAgIH0sXG4gICAgdGVybWluYWw6IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlRlcm1pbmFsKHgpO1xuICAgIH0sXG4gICAgcmFuZ2U6IGZ1bmN0aW9uIChmcm9tLCB0bykge1xuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5SYW5nZShmcm9tLCB0byk7XG4gICAgfSxcbiAgICBwYXJhbTogZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLlBhcmFtKGluZGV4KTtcbiAgICB9LFxuICAgIGFsdDogZnVuY3Rpb24gKCAvKiB0ZXJtMSwgdGVybTEsIC4uLiAqLykge1xuICAgICAgICB2YXIgdGVybXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJndW1lbnRzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgICAgICAgIGlmICghKGFyZyBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgICAgICBhcmcgPSB0aGlzLmZyb21SZWNpcGUoYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhcmcgaW5zdGFuY2VvZiBwZXhwcnMuQWx0KSB7XG4gICAgICAgICAgICAgICAgdGVybXMgPSB0ZXJtcy5jb25jYXQoYXJnLnRlcm1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRlcm1zLnB1c2goYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGVybXMubGVuZ3RoID09PSAxID8gdGVybXNbMF0gOiBuZXcgcGV4cHJzLkFsdCh0ZXJtcyk7XG4gICAgfSxcbiAgICBzZXE6IGZ1bmN0aW9uICggLyogZmFjdG9yMSwgZmFjdG9yMiwgLi4uICovKSB7XG4gICAgICAgIHZhciBmYWN0b3JzID0gW107XG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICB2YXIgYXJnID0gYXJndW1lbnRzW2lkeF07XG4gICAgICAgICAgICBpZiAoIShhcmcgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICAgICAgYXJnID0gdGhpcy5mcm9tUmVjaXBlKGFyZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYXJnIGluc3RhbmNlb2YgcGV4cHJzLlNlcSkge1xuICAgICAgICAgICAgICAgIGZhY3RvcnMgPSBmYWN0b3JzLmNvbmNhdChhcmcuZmFjdG9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmYWN0b3JzLnB1c2goYXJnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFjdG9ycy5sZW5ndGggPT09IDEgPyBmYWN0b3JzWzBdIDogbmV3IHBleHBycy5TZXEoZmFjdG9ycyk7XG4gICAgfSxcbiAgICBzdGFyOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5TdGFyKGV4cHIpO1xuICAgIH0sXG4gICAgcGx1czogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuUGx1cyhleHByKTtcbiAgICB9LFxuICAgIG9wdDogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuT3B0KGV4cHIpO1xuICAgIH0sXG4gICAgbm90OiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICBpZiAoIShleHByIGluc3RhbmNlb2YgcGV4cHJzLlBFeHByKSkge1xuICAgICAgICAgICAgZXhwciA9IHRoaXMuZnJvbVJlY2lwZShleHByKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IHBleHBycy5Ob3QoZXhwcik7XG4gICAgfSxcbiAgICBsYTogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgLy8gVE9ETzogdGVtcG9yYXJ5IHRvIHN0aWxsIGJlIGFibGUgdG8gcmVhZCBvbGQgcmVjaXBlc1xuICAgICAgICByZXR1cm4gdGhpcy5sb29rYWhlYWQoZXhwcik7XG4gICAgfSxcbiAgICBsb29rYWhlYWQ6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmICghKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuUEV4cHIpKSB7XG4gICAgICAgICAgICBleHByID0gdGhpcy5mcm9tUmVjaXBlKGV4cHIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLkxvb2thaGVhZChleHByKTtcbiAgICB9LFxuICAgIGxleDogZnVuY3Rpb24gKGV4cHIpIHtcbiAgICAgICAgaWYgKCEoZXhwciBpbnN0YW5jZW9mIHBleHBycy5QRXhwcikpIHtcbiAgICAgICAgICAgIGV4cHIgPSB0aGlzLmZyb21SZWNpcGUoZXhwcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuTGV4KGV4cHIpO1xuICAgIH0sXG4gICAgYXBwOiBmdW5jdGlvbiAocnVsZU5hbWUsIG9wdFBhcmFtcykge1xuICAgICAgICBpZiAob3B0UGFyYW1zICYmIG9wdFBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBvcHRQYXJhbXMgPSBvcHRQYXJhbXMubWFwKGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbSBpbnN0YW5jZW9mIHBleHBycy5QRXhwciA/IHBhcmFtIDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mcm9tUmVjaXBlKHBhcmFtKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgcGV4cHJzLkFwcGx5KHJ1bGVOYW1lLCBvcHRQYXJhbXMpO1xuICAgIH0sXG4gICAgZnJvbVJlY2lwZTogZnVuY3Rpb24gKHJlY2lwZSkge1xuICAgICAgICAvLyB0aGUgbWV0YS1pbmZvIG9mICdncmFtbWFyJyBpcyBwcm9jY2Vzc2VkIGluIEJ1aWxkZXIuZ3JhbW1hclxuICAgICAgICB2YXIgcmVzdWx0ID0gdGhpc1tyZWNpcGVbMF1dLmFwcGx5KHRoaXMsIHJlY2lwZVswXSA9PT0gJ2dyYW1tYXInID8gcmVjaXBlLnNsaWNlKDEpIDogcmVjaXBlLnNsaWNlKDIpKTtcbiAgICAgICAgdmFyIG1ldGFJbmZvID0gcmVjaXBlWzFdO1xuICAgICAgICBpZiAobWV0YUluZm8pIHtcbiAgICAgICAgICAgIGlmIChtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCAmJiB0aGlzLmN1cnJlbnREZWNsKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LndpdGhTb3VyY2UodGhpcy5jdXJyZW50RGVjbC5zb3VyY2VJbnRlcnZhbC5hcHBseSh0aGlzLmN1cnJlbnREZWNsLCBtZXRhSW5mby5zb3VyY2VJbnRlcnZhbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgRmFpbHVyZSA9IHJlcXVpcmUoJy4vRmFpbHVyZScpO1xudmFyIFRlcm1pbmFsTm9kZSA9IHJlcXVpcmUoJy4vbm9kZXMnKS5UZXJtaW5hbE5vZGU7XG52YXIgYXNzZXJ0ID0gcmVxdWlyZSgnLi9jb21tb24nKS5hc3NlcnQ7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG5mdW5jdGlvbiBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbChwYXJhbSkge1xuICAgIHRoaXMub2JqID0gcGFyYW07XG59XG5pbmhlcml0cyhDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbCwgcGV4cHJzLlBFeHByKTtcbkNhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsLnByb3RvdHlwZSA9IHtcbiAgICBfZ2V0U3RyaW5nOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIHRlcm1pbmFsID0gc3RhdGUuY3VycmVudEFwcGxpY2F0aW9uKCkuYXJnc1t0aGlzLm9iai5pbmRleF07XG4gICAgICAgIGFzc2VydCh0ZXJtaW5hbCBpbnN0YW5jZW9mIHBleHBycy5UZXJtaW5hbCwgJ2V4cGVjdGVkIGEgVGVybWluYWwgZXhwcmVzc2lvbicpO1xuICAgICAgICByZXR1cm4gdGVybWluYWwub2JqO1xuICAgIH0sXG4gICAgLy8gSW1wbGVtZW50YXRpb24gb2YgdGhlIFBFeHByIEFQSVxuICAgIGFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBldmFsOiBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgdmFyIGlucHV0U3RyZWFtID0gc3RhdGUuaW5wdXRTdHJlYW07XG4gICAgICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSB0aGlzLl9nZXRTdHJpbmcoc3RhdGUpO1xuICAgICAgICBpZiAoIWlucHV0U3RyZWFtLm1hdGNoU3RyaW5nKG1hdGNoU3RyLCB0cnVlKSkge1xuICAgICAgICAgICAgc3RhdGUucHJvY2Vzc0ZhaWx1cmUob3JpZ1BvcywgdGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIG1hdGNoU3RyKSwgb3JpZ1Bvcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2VuZXJhdGVFeGFtcGxlOiBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgICAgICAvLyBTdGFydCB3aXRoIGEgZXhhbXBsZSBnZW5lcmF0ZWQgZnJvbSB0aGUgVGVybWluYWwuLi5cbiAgICAgICAgdmFyIHN0ciA9IHRoaXMub2JqLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKS52YWx1ZTtcbiAgICAgICAgLy8gLi4uYW5kIHJhbmRvbWx5IHN3aXRjaCBjaGFyYWN0ZXJzIHRvIHVwcGVyY2FzZS9sb3dlcmNhc2UuXG4gICAgICAgIHZhciB2YWx1ZSA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgdmFsdWUgKz0gTWF0aC5yYW5kb20oKSA8IDAuNSA/IHN0cltpXS50b0xvY2FsZUxvd2VyQ2FzZSgpIDogc3RyW2ldLnRvTG9jYWxlVXBwZXJDYXNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlIH07XG4gICAgfSxcbiAgICBnZXRBcml0eTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9LFxuICAgIHN1YnN0aXR1dGVQYXJhbXM6IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwodGhpcy5vYmouc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKSk7XG4gICAgfSxcbiAgICB0b0Rpc3BsYXlTdHJpbmc6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub2JqLnRvRGlzcGxheVN0cmluZygpICsgJyAoY2FzZS1pbnNlbnNpdGl2ZSknO1xuICAgIH0sXG4gICAgdG9GYWlsdXJlOiBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgICAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgdGhpcy5vYmoudG9GYWlsdXJlKGdyYW1tYXIpICsgJyAoY2FzZS1pbnNlbnNpdGl2ZSknLCAnZGVzY3JpcHRpb24nKTtcbiAgICB9LFxuICAgIF9pc051bGxhYmxlOiBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgICAgICByZXR1cm4gdGhpcy5vYmouX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gICAgfVxufTtcbm1vZHVsZS5leHBvcnRzID0gQ2FzZUluc2Vuc2l0aXZlVGVybWluYWw7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIGBGYWlsdXJlYHMgcmVwcmVzZW50IGV4cHJlc3Npb25zIHRoYXQgd2VyZW4ndCBtYXRjaGVkIHdoaWxlIHBhcnNpbmcuIFRoZXkgYXJlIHVzZWQgdG8gZ2VuZXJhdGVcbiAgZXJyb3IgbWVzc2FnZXMgYXV0b21hdGljYWxseS4gVGhlIGludGVyZmFjZSBvZiBgRmFpbHVyZWBzIGluY2x1ZGVzIHRoZSBjb2xsb3dpbmcgbWV0aG9kczpcblxuICAtIGdldFRleHQoKSA6IFN0cmluZ1xuICAtIGdldFR5cGUoKSA6IFN0cmluZyAgKG9uZSBvZiB7XCJkZXNjcmlwdGlvblwiLCBcInN0cmluZ1wiLCBcImNvZGVcIn0pXG4gIC0gaXNEZXNjcmlwdGlvbigpIDogYm9vbFxuICAtIGlzU3RyaW5nVGVybWluYWwoKSA6IGJvb2xcbiAgLSBpc0NvZGUoKSA6IGJvb2xcbiAgLSBpc0ZsdWZmeSgpIDogYm9vbFxuICAtIG1ha2VGbHVmZnkoKSA6IHZvaWRcbiAgLSBzdWJzdW1lcyhGYWlsdXJlKSA6IGJvb2xcbiovXG5mdW5jdGlvbiBpc1ZhbGlkVHlwZSh0eXBlKSB7XG4gICAgcmV0dXJuIHR5cGUgPT09ICdkZXNjcmlwdGlvbicgfHwgdHlwZSA9PT0gJ3N0cmluZycgfHwgdHlwZSA9PT0gJ2NvZGUnO1xufVxuZnVuY3Rpb24gRmFpbHVyZShwZXhwciwgdGV4dCwgdHlwZSkge1xuICAgIGlmICghaXNWYWxpZFR5cGUodHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIEZhaWx1cmUgdHlwZTogJyArIHR5cGUpO1xuICAgIH1cbiAgICB0aGlzLnBleHByID0gcGV4cHI7XG4gICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMuZmx1ZmZ5ID0gZmFsc2U7XG59XG5GYWlsdXJlLnByb3RvdHlwZS5nZXRQRXhwciA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wZXhwcjtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5nZXRUZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRleHQ7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuZ2V0VHlwZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmlzRGVzY3JpcHRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ2Rlc2NyaXB0aW9uJztcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5pc1N0cmluZ1Rlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnR5cGUgPT09ICdzdHJpbmcnO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmlzQ29kZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlID09PSAnY29kZSc7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuaXNGbHVmZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmx1ZmZ5O1xufTtcbkZhaWx1cmUucHJvdG90eXBlLm1ha2VGbHVmZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mbHVmZnkgPSB0cnVlO1xufTtcbkZhaWx1cmUucHJvdG90eXBlLmNsZWFyRmx1ZmZ5ID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZmx1ZmZ5ID0gZmFsc2U7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUuc3Vic3VtZXMgPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIHJldHVybiB0aGlzLmdldFRleHQoKSA9PT0gdGhhdC5nZXRUZXh0KCkgJiZcbiAgICAgICAgdGhpcy50eXBlID09PSB0aGF0LnR5cGUgJiZcbiAgICAgICAgKCF0aGlzLmlzRmx1ZmZ5KCkgfHwgdGhpcy5pc0ZsdWZmeSgpICYmIHRoYXQuaXNGbHVmZnkoKSk7XG59O1xuRmFpbHVyZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudHlwZSA9PT0gJ3N0cmluZycgP1xuICAgICAgICBKU09OLnN0cmluZ2lmeSh0aGlzLmdldFRleHQoKSkgOlxuICAgICAgICB0aGlzLmdldFRleHQoKTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmFpbHVyZSA9IG5ldyBGYWlsdXJlKHRoaXMucGV4cHIsIHRoaXMudGV4dCwgdGhpcy50eXBlKTtcbiAgICBpZiAodGhpcy5pc0ZsdWZmeSgpKSB7XG4gICAgICAgIGZhaWx1cmUubWFrZUZsdWZmeSgpO1xuICAgIH1cbiAgICByZXR1cm4gZmFpbHVyZTtcbn07XG5GYWlsdXJlLnByb3RvdHlwZS50b0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpICsgJyMnICsgdGhpcy50eXBlO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBGYWlsdXJlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgQ2FzZUluc2Vuc2l0aXZlVGVybWluYWwgPSByZXF1aXJlKCcuL0Nhc2VJbnNlbnNpdGl2ZVRlcm1pbmFsJyk7XG52YXIgTWF0Y2hlciA9IHJlcXVpcmUoJy4vTWF0Y2hlcicpO1xudmFyIFNlbWFudGljcyA9IHJlcXVpcmUoJy4vU2VtYW50aWNzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGdldFNvcnRlZFJ1bGVWYWx1ZXMoZ3JhbW1hcikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhncmFtbWFyLnJ1bGVzKS5zb3J0KCkubWFwKGZ1bmN0aW9uIChuYW1lKSB7IHJldHVybiBncmFtbWFyLnJ1bGVzW25hbWVdOyB9KTtcbn1cbmZ1bmN0aW9uIEdyYW1tYXIobmFtZSwgc3VwZXJHcmFtbWFyLCBydWxlcywgb3B0RGVmYXVsdFN0YXJ0UnVsZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zdXBlckdyYW1tYXIgPSBzdXBlckdyYW1tYXI7XG4gICAgdGhpcy5ydWxlcyA9IHJ1bGVzO1xuICAgIGlmIChvcHREZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICAgIGlmICghKG9wdERlZmF1bHRTdGFydFJ1bGUgaW4gcnVsZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHN0YXJ0IHJ1bGU6ICdcIiArIG9wdERlZmF1bHRTdGFydFJ1bGUgK1xuICAgICAgICAgICAgICAgIFwiJyBpcyBub3QgYSBydWxlIGluIGdyYW1tYXIgJ1wiICsgbmFtZSArIFwiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBvcHREZWZhdWx0U3RhcnRSdWxlO1xuICAgIH1cbn1cbnZhciBvaG1HcmFtbWFyO1xudmFyIGJ1aWxkR3JhbW1hcjtcbi8vIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBmcm9tIG1haW4uanMgb25jZSBPaG0gaGFzIGxvYWRlZC5cbkdyYW1tYXIuaW5pdEFwcGxpY2F0aW9uUGFyc2VyID0gZnVuY3Rpb24gKGdyYW1tYXIsIGJ1aWxkZXJGbikge1xuICAgIG9obUdyYW1tYXIgPSBncmFtbWFyO1xuICAgIGJ1aWxkR3JhbW1hciA9IGJ1aWxkZXJGbjtcbn07XG5HcmFtbWFyLnByb3RvdHlwZSA9IHtcbiAgICBtYXRjaGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgTWF0Y2hlcih0aGlzKTtcbiAgICB9LFxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZSBncmFtbWFyIGlzIGEgYnVpbHQtaW4gZ3JhbW1hciwgb3RoZXJ3aXNlIGZhbHNlLlxuICAgIC8vIE5PVEU6IFRoaXMgbWlnaHQgZ2l2ZSBhbiB1bmV4cGVjdGVkIHJlc3VsdCBpZiBjYWxsZWQgYmVmb3JlIEJ1aWx0SW5SdWxlcyBpcyBkZWZpbmVkIVxuICAgIGlzQnVpbHRJbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcyA9PT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyB8fCB0aGlzID09PSBHcmFtbWFyLkJ1aWx0SW5SdWxlcztcbiAgICB9LFxuICAgIGVxdWFsczogZnVuY3Rpb24gKGcpIHtcbiAgICAgICAgaWYgKHRoaXMgPT09IGcpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIERvIHRoZSBjaGVhcGVzdCBjb21wYXJpc29ucyBmaXJzdC5cbiAgICAgICAgaWYgKGcgPT0gbnVsbCB8fFxuICAgICAgICAgICAgdGhpcy5uYW1lICE9PSBnLm5hbWUgfHxcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdFN0YXJ0UnVsZSAhPT0gZy5kZWZhdWx0U3RhcnRSdWxlIHx8XG4gICAgICAgICAgICAhKHRoaXMuc3VwZXJHcmFtbWFyID09PSBnLnN1cGVyR3JhbW1hciB8fCB0aGlzLnN1cGVyR3JhbW1hci5lcXVhbHMoZy5zdXBlckdyYW1tYXIpKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBteVJ1bGVzID0gZ2V0U29ydGVkUnVsZVZhbHVlcyh0aGlzKTtcbiAgICAgICAgdmFyIG90aGVyUnVsZXMgPSBnZXRTb3J0ZWRSdWxlVmFsdWVzKGcpO1xuICAgICAgICByZXR1cm4gbXlSdWxlcy5sZW5ndGggPT09IG90aGVyUnVsZXMubGVuZ3RoICYmIG15UnVsZXMuZXZlcnkoZnVuY3Rpb24gKHJ1bGUsIGkpIHtcbiAgICAgICAgICAgIHJldHVybiBydWxlLmRlc2NyaXB0aW9uID09PSBvdGhlclJ1bGVzW2ldLmRlc2NyaXB0aW9uICYmXG4gICAgICAgICAgICAgICAgcnVsZS5mb3JtYWxzLmpvaW4oJywnKSA9PT0gb3RoZXJSdWxlc1tpXS5mb3JtYWxzLmpvaW4oJywnKSAmJlxuICAgICAgICAgICAgICAgIHJ1bGUuYm9keS50b1N0cmluZygpID09PSBvdGhlclJ1bGVzW2ldLmJvZHkudG9TdHJpbmcoKTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBtYXRjaDogZnVuY3Rpb24gKGlucHV0LCBvcHRTdGFydEFwcGxpY2F0aW9uKSB7XG4gICAgICAgIHZhciBtID0gdGhpcy5tYXRjaGVyKCk7XG4gICAgICAgIG0ucmVwbGFjZUlucHV0UmFuZ2UoMCwgMCwgaW5wdXQpO1xuICAgICAgICByZXR1cm4gbS5tYXRjaChvcHRTdGFydEFwcGxpY2F0aW9uKTtcbiAgICB9LFxuICAgIHRyYWNlOiBmdW5jdGlvbiAoaW5wdXQsIG9wdFN0YXJ0QXBwbGljYXRpb24pIHtcbiAgICAgICAgdmFyIG0gPSB0aGlzLm1hdGNoZXIoKTtcbiAgICAgICAgbS5yZXBsYWNlSW5wdXRSYW5nZSgwLCAwLCBpbnB1dCk7XG4gICAgICAgIHJldHVybiBtLnRyYWNlKG9wdFN0YXJ0QXBwbGljYXRpb24pO1xuICAgIH0sXG4gICAgc2VtYW50aWNzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkhIERlcHJlY2F0ZWQgaW4gdjAuMTIuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2VtYW50aWNzKCkgaXMgZGVwcmVjYXRlZCAtLSB1c2UgY3JlYXRlU2VtYW50aWNzKCkgaW5zdGVhZC4nKTtcbiAgICB9LFxuICAgIGNyZWF0ZVNlbWFudGljczogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gU2VtYW50aWNzLmNyZWF0ZVNlbWFudGljcyh0aGlzKTtcbiAgICB9LFxuICAgIGV4dGVuZFNlbWFudGljczogZnVuY3Rpb24gKHN1cGVyU2VtYW50aWNzKSB7XG4gICAgICAgIHJldHVybiBTZW1hbnRpY3MuY3JlYXRlU2VtYW50aWNzKHRoaXMsIHN1cGVyU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKSk7XG4gICAgfSxcbiAgICAvLyBDaGVjayB0aGF0IGV2ZXJ5IGtleSBpbiBgYWN0aW9uRGljdGAgY29ycmVzcG9uZHMgdG8gYSBzZW1hbnRpYyBhY3Rpb24sIGFuZCB0aGF0IGl0IG1hcHMgdG9cbiAgICAvLyBhIGZ1bmN0aW9uIG9mIHRoZSBjb3JyZWN0IGFyaXR5LiBJZiBub3QsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAgICBfY2hlY2tUb3BEb3duQWN0aW9uRGljdDogZnVuY3Rpb24gKHdoYXQsIG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gaXNTcGVjaWFsQWN0aW9uKGEpIHtcbiAgICAgICAgICAgIHJldHVybiBhID09PSAnX2l0ZXInIHx8IGEgPT09ICdfdGVybWluYWwnIHx8IGEgPT09ICdfbm9udGVybWluYWwnIHx8IGEgPT09ICdfZGVmYXVsdCc7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHByb2JsZW1zID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gYWN0aW9uRGljdCkge1xuICAgICAgICAgICAgdmFyIHYgPSBhY3Rpb25EaWN0W2tdO1xuICAgICAgICAgICAgaWYgKCFpc1NwZWNpYWxBY3Rpb24oaykgJiYgIShrIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgICAgICAgICAgcHJvYmxlbXMucHVzaChcIidcIiArIGsgKyBcIicgaXMgbm90IGEgdmFsaWQgc2VtYW50aWMgYWN0aW9uIGZvciAnXCIgKyB0aGlzLm5hbWUgKyBcIidcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgdiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByb2JsZW1zLnB1c2goXCInXCIgKyBrICsgXCInIG11c3QgYmUgYSBmdW5jdGlvbiBpbiBhbiBhY3Rpb24gZGljdGlvbmFyeSBmb3IgJ1wiICsgdGhpcy5uYW1lICsgXCInXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGFjdHVhbCA9IHYubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBleHBlY3RlZCA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShrKTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICBwcm9ibGVtcy5wdXNoKFwiU2VtYW50aWMgYWN0aW9uICdcIiArIGsgKyBcIicgaGFzIHRoZSB3cm9uZyBhcml0eTogXCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2V4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByb2JsZW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBwcmV0dHlQcm9ibGVtcyA9IHByb2JsZW1zLm1hcChmdW5jdGlvbiAocHJvYmxlbSkgeyByZXR1cm4gJy0gJyArIHByb2JsZW07IH0pO1xuICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IEVycm9yKFwiRm91bmQgZXJyb3JzIGluIHRoZSBhY3Rpb24gZGljdGlvbmFyeSBvZiB0aGUgJ1wiICsgbmFtZSArIFwiJyBcIiArIHdoYXQgKyAnOlxcbicgK1xuICAgICAgICAgICAgICAgIHByZXR0eVByb2JsZW1zLmpvaW4oJ1xcbicpKTtcbiAgICAgICAgICAgIGVycm9yLnByb2JsZW1zID0gcHJvYmxlbXM7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gUmV0dXJuIHRoZSBleHBlY3RlZCBhcml0eSBmb3IgYSBzZW1hbnRpYyBhY3Rpb24gbmFtZWQgYGFjdGlvbk5hbWVgLCB3aGljaFxuICAgIC8vIGlzIGVpdGhlciBhIHJ1bGUgbmFtZSBvciBhIHNwZWNpYWwgYWN0aW9uIG5hbWUgbGlrZSAnX25vbnRlcm1pbmFsJy5cbiAgICBfdG9wRG93bkFjdGlvbkFyaXR5OiBmdW5jdGlvbiAoYWN0aW9uTmFtZSkge1xuICAgICAgICBpZiAoYWN0aW9uTmFtZSA9PT0gJ19pdGVyJyB8fCBhY3Rpb25OYW1lID09PSAnX25vbnRlcm1pbmFsJyB8fCBhY3Rpb25OYW1lID09PSAnX2RlZmF1bHQnKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhY3Rpb25OYW1lID09PSAnX3Rlcm1pbmFsJykge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZXNbYWN0aW9uTmFtZV0uYm9keS5nZXRBcml0eSgpO1xuICAgIH0sXG4gICAgX2luaGVyaXRzRnJvbTogZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAgICAgdmFyIGcgPSB0aGlzLnN1cGVyR3JhbW1hcjtcbiAgICAgICAgd2hpbGUgKGcpIHtcbiAgICAgICAgICAgIGlmIChnLmVxdWFscyhncmFtbWFyLCB0cnVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZyA9IGcuc3VwZXJHcmFtbWFyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIHRvUmVjaXBlOiBmdW5jdGlvbiAob3B0VmFyTmFtZSkge1xuICAgICAgICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgICAgICAgLy8gSW5jbHVkZSB0aGUgZ3JhbW1hciBzb3VyY2UgaWYgaXQgaXMgYXZhaWxhYmxlLlxuICAgICAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgICAgICAgIG1ldGFJbmZvLnNvdXJjZSA9IHRoaXMuc291cmNlLmNvbnRlbnRzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdXBlckdyYW1tYXIgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIgJiYgIXRoaXMuc3VwZXJHcmFtbWFyLmlzQnVpbHRJbigpKSB7XG4gICAgICAgICAgICBzdXBlckdyYW1tYXIgPSBKU09OLnBhcnNlKHRoaXMuc3VwZXJHcmFtbWFyLnRvUmVjaXBlKCkpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzdGFydFJ1bGUgPSBudWxsO1xuICAgICAgICBpZiAodGhpcy5kZWZhdWx0U3RhcnRSdWxlKSB7XG4gICAgICAgICAgICBzdGFydFJ1bGUgPSB0aGlzLmRlZmF1bHRTdGFydFJ1bGU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHJ1bGVzID0ge307XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5ydWxlcykuZm9yRWFjaChmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAgICAgICAgIHZhciBydWxlSW5mbyA9IHNlbGYucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICAgICAgICAgICAgdmFyIGlzRGVmaW5pdGlvbiA9ICFzZWxmLnN1cGVyR3JhbW1hciB8fCAhc2VsZi5zdXBlckdyYW1tYXIucnVsZXNbcnVsZU5hbWVdO1xuICAgICAgICAgICAgdmFyIG9wZXJhdGlvbjtcbiAgICAgICAgICAgIGlmIChpc0RlZmluaXRpb24pIHtcbiAgICAgICAgICAgICAgICBvcGVyYXRpb24gPSAnZGVmaW5lJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG9wZXJhdGlvbiA9IGJvZHkgaW5zdGFuY2VvZiBwZXhwcnMuRXh0ZW5kID8gJ2V4dGVuZCcgOiAnb3ZlcnJpZGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1ldGFJbmZvID0ge307XG4gICAgICAgICAgICBpZiAocnVsZUluZm8uc291cmNlICYmIHNlbGYuc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkID0gcnVsZUluZm8uc291cmNlLnJlbGF0aXZlVG8oc2VsZi5zb3VyY2UpO1xuICAgICAgICAgICAgICAgIG1ldGFJbmZvLnNvdXJjZUludGVydmFsID0gW2FkanVzdGVkLnN0YXJ0SWR4LCBhZGp1c3RlZC5lbmRJZHhdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gaXNEZWZpbml0aW9uID8gcnVsZUluZm8uZGVzY3JpcHRpb24gOiBudWxsO1xuICAgICAgICAgICAgdmFyIGJvZHlSZWNpcGUgPSBib2R5Lm91dHB1dFJlY2lwZShydWxlSW5mby5mb3JtYWxzLCBzZWxmLnNvdXJjZSk7XG4gICAgICAgICAgICBydWxlc1tydWxlTmFtZV0gPSBbXG4gICAgICAgICAgICAgICAgb3BlcmF0aW9uLFxuICAgICAgICAgICAgICAgIG1ldGFJbmZvLFxuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgICAgIHJ1bGVJbmZvLmZvcm1hbHMsXG4gICAgICAgICAgICAgICAgYm9keVJlY2lwZVxuICAgICAgICAgICAgXTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShbXG4gICAgICAgICAgICAnZ3JhbW1hcicsXG4gICAgICAgICAgICBtZXRhSW5mbyxcbiAgICAgICAgICAgIHRoaXMubmFtZSxcbiAgICAgICAgICAgIHN1cGVyR3JhbW1hcixcbiAgICAgICAgICAgIHN0YXJ0UnVsZSxcbiAgICAgICAgICAgIHJ1bGVzXG4gICAgICAgIF0pO1xuICAgIH0sXG4gICAgLy8gVE9ETzogQ29tZSB1cCB3aXRoIGJldHRlciBuYW1lcyBmb3IgdGhlc2UgbWV0aG9kcy5cbiAgICAvLyBUT0RPOiBXcml0ZSB0aGUgYW5hbG9nIG9mIHRoZXNlIG1ldGhvZHMgZm9yIGluaGVyaXRlZCBhdHRyaWJ1dGVzLlxuICAgIHRvT3BlcmF0aW9uQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b09wZXJhdGlvbk9yQXR0cmlidXRlQWN0aW9uRGljdGlvbmFyeVRlbXBsYXRlKCk7XG4gICAgfSxcbiAgICB0b0F0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdG9PcGVyYXRpb25PckF0dHJpYnV0ZUFjdGlvbkRpY3Rpb25hcnlUZW1wbGF0ZSgpO1xuICAgIH0sXG4gICAgX3RvT3BlcmF0aW9uT3JBdHRyaWJ1dGVBY3Rpb25EaWN0aW9uYXJ5VGVtcGxhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogYWRkIHRoZSBzdXBlci1ncmFtbWFyJ3MgdGVtcGxhdGVzIGF0IHRoZSByaWdodCBwbGFjZSwgZS5nLiwgYSBjYXNlIGZvciBBZGRFeHByX3BsdXNcbiAgICAgICAgLy8gc2hvdWxkIGFwcGVhciBuZXh0IHRvIG90aGVyIGNhc2VzIG9mIEFkZEV4cHIuXG4gICAgICAgIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gICAgICAgIHNiLmFwcGVuZCgneycpO1xuICAgICAgICB2YXIgZmlyc3QgPSB0cnVlO1xuICAgICAgICBmb3IgKHZhciBydWxlTmFtZSBpbiB0aGlzLnJ1bGVzKSB7XG4gICAgICAgICAgICB2YXIgYm9keSA9IHRoaXMucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgICAgICBpZiAoZmlyc3QpIHtcbiAgICAgICAgICAgICAgICBmaXJzdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2IuYXBwZW5kKCcsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgICAgICAgICAgc2IuYXBwZW5kKCcgICcpO1xuICAgICAgICAgICAgdGhpcy5hZGRTZW1hbnRpY0FjdGlvblRlbXBsYXRlKHJ1bGVOYW1lLCBib2R5LCBzYik7XG4gICAgICAgIH1cbiAgICAgICAgc2IuYXBwZW5kKCdcXG59Jyk7XG4gICAgICAgIHJldHVybiBzYi5jb250ZW50cygpO1xuICAgIH0sXG4gICAgYWRkU2VtYW50aWNBY3Rpb25UZW1wbGF0ZTogZnVuY3Rpb24gKHJ1bGVOYW1lLCBib2R5LCBzYikge1xuICAgICAgICBzYi5hcHBlbmQocnVsZU5hbWUpO1xuICAgICAgICBzYi5hcHBlbmQoJzogZnVuY3Rpb24oJyk7XG4gICAgICAgIHZhciBhcml0eSA9IHRoaXMuX3RvcERvd25BY3Rpb25Bcml0eShydWxlTmFtZSk7XG4gICAgICAgIHNiLmFwcGVuZChjb21tb24ucmVwZWF0KCdfJywgYXJpdHkpLmpvaW4oJywgJykpO1xuICAgICAgICBzYi5hcHBlbmQoJykge1xcbicpO1xuICAgICAgICBzYi5hcHBlbmQoJyAgfScpO1xuICAgIH0sXG4gICAgLy8gUGFyc2UgYSBzdHJpbmcgd2hpY2ggZXhwcmVzc2VzIGEgcnVsZSBhcHBsaWNhdGlvbiBpbiB0aGlzIGdyYW1tYXIsIGFuZCByZXR1cm4gdGhlXG4gICAgLy8gcmVzdWx0aW5nIEFwcGx5IG5vZGUuXG4gICAgcGFyc2VBcHBsaWNhdGlvbjogZnVuY3Rpb24gKHN0cikge1xuICAgICAgICB2YXIgYXBwO1xuICAgICAgICBpZiAoc3RyLmluZGV4T2YoJzwnKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIC8vIHNpbXBsZSBhcHBsaWNhdGlvblxuICAgICAgICAgICAgYXBwID0gbmV3IHBleHBycy5BcHBseShzdHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gcGFyYW1ldGVyaXplZCBhcHBsaWNhdGlvblxuICAgICAgICAgICAgdmFyIGNzdCA9IG9obUdyYW1tYXIubWF0Y2goc3RyLCAnQmFzZV9hcHBsaWNhdGlvbicpO1xuICAgICAgICAgICAgYXBwID0gYnVpbGRHcmFtbWFyKGNzdCwge30pO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IHRoZSBhcHBsaWNhdGlvbiBpcyB2YWxpZC5cbiAgICAgICAgaWYgKCEoYXBwLnJ1bGVOYW1lIGluIHRoaXMucnVsZXMpKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMudW5kZWNsYXJlZFJ1bGUoYXBwLnJ1bGVOYW1lLCB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBmb3JtYWxzID0gdGhpcy5ydWxlc1thcHAucnVsZU5hbWVdLmZvcm1hbHM7XG4gICAgICAgIGlmIChmb3JtYWxzLmxlbmd0aCAhPT0gYXBwLmFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5ydWxlc1thcHAucnVsZU5hbWVdLnNvdXJjZTtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mUGFyYW1ldGVycyhhcHAucnVsZU5hbWUsIGZvcm1hbHMubGVuZ3RoLCBhcHAuYXJncy5sZW5ndGgsIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFwcDtcbiAgICB9XG59O1xuLy8gVGhlIGZvbGxvd2luZyBncmFtbWFyIGNvbnRhaW5zIGEgZmV3IHJ1bGVzIHRoYXQgY291bGRuJ3QgYmUgd3JpdHRlbiAgaW4gXCJ1c2VybGFuZFwiLlxuLy8gQXQgdGhlIGJvdHRvbSBvZiBzcmMvbWFpbi5qcywgd2UgY3JlYXRlIGEgc3ViLWdyYW1tYXIgb2YgdGhpcyBncmFtbWFyIHRoYXQncyBjYWxsZWRcbi8vIGBCdWlsdEluUnVsZXNgLiBUaGF0IGdyYW1tYXIgY29udGFpbnMgc2V2ZXJhbCBjb252ZW5pZW5jZSBydWxlcywgZS5nLiwgYGxldHRlcmAgYW5kXG4vLyBgZGlnaXRgLCBhbmQgaXMgaW1wbGljaXRseSB0aGUgc3VwZXItZ3JhbW1hciBvZiBhbnkgZ3JhbW1hciB3aG9zZSBzdXBlci1ncmFtbWFyXG4vLyBpc24ndCBzcGVjaWZpZWQuXG5HcmFtbWFyLlByb3RvQnVpbHRJblJ1bGVzID0gbmV3IEdyYW1tYXIoJ1Byb3RvQnVpbHRJblJ1bGVzJywgLy8gbmFtZVxudW5kZWZpbmVkLCAvLyBzdXBlcmdyYW1tYXJcbntcbiAgICBhbnk6IHtcbiAgICAgICAgYm9keTogcGV4cHJzLmFueSxcbiAgICAgICAgZm9ybWFsczogW10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnYW55IGNoYXJhY3RlcicsXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgZW5kOiB7XG4gICAgICAgIGJvZHk6IHBleHBycy5lbmQsXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2VuZCBvZiBpbnB1dCcsXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgY2FzZUluc2Vuc2l0aXZlOiB7XG4gICAgICAgIGJvZHk6IG5ldyBDYXNlSW5zZW5zaXRpdmVUZXJtaW5hbChuZXcgcGV4cHJzLlBhcmFtKDApKSxcbiAgICAgICAgZm9ybWFsczogWydzdHInXSxcbiAgICAgICAgcHJpbWl0aXZlOiB0cnVlXG4gICAgfSxcbiAgICBsb3dlcjoge1xuICAgICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMbCcpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhIGxvd2VyY2FzZSBsZXR0ZXInLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIHVwcGVyOiB7XG4gICAgICAgIGJvZHk6IG5ldyBwZXhwcnMuVW5pY29kZUNoYXIoJ0x1JyksXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2FuIHVwcGVyY2FzZSBsZXR0ZXInLFxuICAgICAgICBwcmltaXRpdmU6IHRydWVcbiAgICB9LFxuICAgIC8vIFVuaW9uIG9mIEx0ICh0aXRsZWNhc2UpLCBMbSAobW9kaWZpZXIpLCBhbmQgTG8gKG90aGVyKSwgaS5lLiBhbnkgbGV0dGVyIG5vdCBpbiBMbCBvciBMdS5cbiAgICB1bmljb2RlTHRtbzoge1xuICAgICAgICBib2R5OiBuZXcgcGV4cHJzLlVuaWNvZGVDaGFyKCdMdG1vJyksXG4gICAgICAgIGZvcm1hbHM6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ2EgVW5pY29kZSBjaGFyYWN0ZXIgaW4gTHQsIExtLCBvciBMbycsXG4gICAgICAgIHByaW1pdGl2ZTogdHJ1ZVxuICAgIH0sXG4gICAgLy8gVGhlc2UgcnVsZXMgYXJlIG5vdCB0cnVseSBwcmltaXRpdmUgKHRoZXkgY291bGQgYmUgd3JpdHRlbiBpbiB1c2VybGFuZCkgYnV0IGFyZSBkZWZpbmVkXG4gICAgLy8gaGVyZSBmb3IgYm9vdHN0cmFwcGluZyBwdXJwb3Nlcy5cbiAgICBzcGFjZXM6IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5TdGFyKG5ldyBwZXhwcnMuQXBwbHkoJ3NwYWNlJykpLFxuICAgICAgICBmb3JtYWxzOiBbXVxuICAgIH0sXG4gICAgc3BhY2U6IHtcbiAgICAgICAgYm9keTogbmV3IHBleHBycy5SYW5nZSgnXFx4MDAnLCAnICcpLFxuICAgICAgICBmb3JtYWxzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246ICdhIHNwYWNlJ1xuICAgIH1cbn0pO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IEdyYW1tYXI7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBHcmFtbWFyID0gcmVxdWlyZSgnLi9HcmFtbWFyJyk7XG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBTdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIENvbnN0cnVjdG9yc1xuZnVuY3Rpb24gR3JhbW1hckRlY2wobmFtZSkge1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG59XG4vLyBIZWxwZXJzXG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuc291cmNlSW50ZXJ2YWwgPSBmdW5jdGlvbiAoc3RhcnRJZHgsIGVuZElkeCkge1xuICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJJbnRlcnZhbChzdGFydElkeCwgZW5kSWR4IC0gc3RhcnRJZHgpO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5lbnN1cmVTdXBlckdyYW1tYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLnN1cGVyR3JhbW1hcikge1xuICAgICAgICB0aGlzLndpdGhTdXBlckdyYW1tYXIoXG4gICAgICAgIC8vIFRPRE86IFRoZSBjb25kaXRpb25hbCBleHByZXNzaW9uIGJlbG93IGlzIGFuIHVnbHkgaGFjay4gSXQncyBraW5kIG9mIG9rIGJlY2F1c2VcbiAgICAgICAgLy8gSSBkb3VidCBhbnlvbmUgd2lsbCBldmVyIHRyeSB0byBkZWNsYXJlIGEgZ3JhbW1hciBjYWxsZWQgYEJ1aWx0SW5SdWxlc2AuIFN0aWxsLFxuICAgICAgICAvLyB3ZSBzaG91bGQgdHJ5IHRvIGZpbmQgYSBiZXR0ZXIgd2F5IHRvIGRvIHRoaXMuXG4gICAgICAgIHRoaXMubmFtZSA9PT0gJ0J1aWx0SW5SdWxlcycgP1xuICAgICAgICAgICAgR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcyA6XG4gICAgICAgICAgICBHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLnN1cGVyR3JhbW1hcjtcbn07XG5HcmFtbWFyRGVjbC5wcm90b3R5cGUuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZSA9IGZ1bmN0aW9uIChuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpIHtcbiAgICB2YXIgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMgPSBjb21tb24uZ2V0RHVwbGljYXRlcyhmb3JtYWxzKTtcbiAgICBpZiAoZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMobmFtZSwgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXMsIHNvdXJjZSk7XG4gICAgfVxuICAgIHZhciBydWxlSW5mbyA9IHRoaXMuZW5zdXJlU3VwZXJHcmFtbWFyKCkucnVsZXNbbmFtZV07XG4gICAgdmFyIGV4cGVjdGVkRm9ybWFscyA9IHJ1bGVJbmZvLmZvcm1hbHM7XG4gICAgdmFyIGV4cGVjdGVkTnVtRm9ybWFscyA9IGV4cGVjdGVkRm9ybWFscyA/IGV4cGVjdGVkRm9ybWFscy5sZW5ndGggOiAwO1xuICAgIGlmIChmb3JtYWxzLmxlbmd0aCAhPT0gZXhwZWN0ZWROdW1Gb3JtYWxzKSB7XG4gICAgICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mUGFyYW1ldGVycyhuYW1lLCBleHBlY3RlZE51bUZvcm1hbHMsIGZvcm1hbHMubGVuZ3RoLCBzb3VyY2UpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YWxsKG5hbWUsIGZvcm1hbHMsIGJvZHksIHJ1bGVJbmZvLmRlc2NyaXB0aW9uLCBzb3VyY2UpO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5pbnN0YWxsID0gZnVuY3Rpb24gKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpIHtcbiAgICB0aGlzLnJ1bGVzW25hbWVdID0ge1xuICAgICAgICBib2R5OiBib2R5LmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKSxcbiAgICAgICAgZm9ybWFsczogZm9ybWFscyxcbiAgICAgICAgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuICAgICAgICBzb3VyY2U6IHNvdXJjZVxuICAgIH07XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuLy8gU3R1ZmYgdGhhdCB5b3Ugc2hvdWxkIG9ubHkgZG8gb25jZVxuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhTdXBlckdyYW1tYXIgPSBmdW5jdGlvbiAoc3VwZXJHcmFtbWFyKSB7XG4gICAgaWYgKHRoaXMuc3VwZXJHcmFtbWFyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndGhlIHN1cGVyIGdyYW1tYXIgb2YgYSBHcmFtbWFyRGVjbCBjYW5ub3QgYmUgc2V0IG1vcmUgdGhhbiBvbmNlJyk7XG4gICAgfVxuICAgIHRoaXMuc3VwZXJHcmFtbWFyID0gc3VwZXJHcmFtbWFyO1xuICAgIHRoaXMucnVsZXMgPSBPYmplY3QuY3JlYXRlKHN1cGVyR3JhbW1hci5ydWxlcyk7XG4gICAgLy8gR3JhbW1hcnMgd2l0aCBhbiBleHBsaWNpdCBzdXBlcmdyYW1tYXIgaW5oZXJpdCBhIGRlZmF1bHQgc3RhcnQgcnVsZS5cbiAgICBpZiAoIXN1cGVyR3JhbW1hci5pc0J1aWx0SW4oKSkge1xuICAgICAgICB0aGlzLmRlZmF1bHRTdGFydFJ1bGUgPSBzdXBlckdyYW1tYXIuZGVmYXVsdFN0YXJ0UnVsZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhEZWZhdWx0U3RhcnRSdWxlID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgdGhpcy5kZWZhdWx0U3RhcnRSdWxlID0gcnVsZU5hbWU7XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuR3JhbW1hckRlY2wucHJvdG90eXBlLndpdGhTb3VyY2UgPSBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgdGhpcy5zb3VyY2UgPSBuZXcgSW5wdXRTdHJlYW0oc291cmNlKS5pbnRlcnZhbCgwLCBzb3VyY2UubGVuZ3RoKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG4vLyBDcmVhdGVzIGEgR3JhbW1hciBpbnN0YW5jZSwgYW5kIGlmIGl0IHBhc3NlcyB0aGUgc2FuaXR5IGNoZWNrcywgcmV0dXJucyBpdC5cbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5idWlsZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZ3JhbW1hciA9IG5ldyBHcmFtbWFyKHRoaXMubmFtZSwgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKSwgdGhpcy5ydWxlcywgdGhpcy5kZWZhdWx0U3RhcnRSdWxlKTtcbiAgICAvLyBUT0RPOiBjaGFuZ2UgdGhlIHBleHByLnByb3RvdHlwZS5hc3NlcnQuLi4gbWV0aG9kcyB0byBtYWtlIHRoZW0gYWRkXG4gICAgLy8gZXhjZXB0aW9ucyB0byBhbiBhcnJheSB0aGF0J3MgcHJvdmlkZWQgYXMgYW4gYXJnLiBUaGVuIHdlJ2xsIGJlIGFibGUgdG9cbiAgICAvLyBzaG93IG1vcmUgdGhhbiBvbmUgZXJyb3Igb2YgdGhlIHNhbWUgdHlwZSBhdCBhIHRpbWUuXG4gICAgLy8gVE9ETzogaW5jbHVkZSB0aGUgb2ZmZW5kaW5nIHBleHByIGluIHRoZSBlcnJvcnMsIHRoYXQgd2F5IHdlIGNhbiBzaG93XG4gICAgLy8gdGhlIHBhcnQgb2YgdGhlIHNvdXJjZSB0aGF0IGNhdXNlZCBpdC5cbiAgICB2YXIgZ3JhbW1hckVycm9ycyA9IFtdO1xuICAgIHZhciBncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucyA9IGZhbHNlO1xuICAgIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZXMpLmZvckVhY2goZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgICAgIHZhciBib2R5ID0gZ3JhbW1hci5ydWxlc1tydWxlTmFtZV0uYm9keTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGJvZHkuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGJvZHkuYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBncmFtbWFyRXJyb3JzLnB1c2goZSk7XG4gICAgICAgICAgICBncmFtbWFySGFzSW52YWxpZEFwcGxpY2F0aW9ucyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWdyYW1tYXJIYXNJbnZhbGlkQXBwbGljYXRpb25zKSB7XG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgY2hlY2sgY2FuIG9ubHkgYmUgZG9uZSBpZiB0aGUgZ3JhbW1hciBoYXMgbm8gaW52YWxpZCBhcHBsaWNhdGlvbnMuXG4gICAgICAgIE9iamVjdC5rZXlzKGdyYW1tYXIucnVsZXMpLmZvckVhY2goZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgICAgICAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbcnVsZU5hbWVdLmJvZHk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGJvZHkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIsIFtdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgZ3JhbW1hckVycm9ycy5wdXNoKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKGdyYW1tYXJFcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBlcnJvcnMudGhyb3dFcnJvcnMoZ3JhbW1hckVycm9ycyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgICBncmFtbWFyLnNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgIH1cbiAgICByZXR1cm4gZ3JhbW1hcjtcbn07XG4vLyBSdWxlIGRlY2xhcmF0aW9uc1xuR3JhbW1hckRlY2wucHJvdG90eXBlLmRlZmluZSA9IGZ1bmN0aW9uIChuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjcmlwdGlvbiwgc291cmNlKSB7XG4gICAgdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKTtcbiAgICBpZiAodGhpcy5zdXBlckdyYW1tYXIucnVsZXNbbmFtZV0pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIHNvdXJjZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMucnVsZXNbbmFtZV0pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVJ1bGVEZWNsYXJhdGlvbihuYW1lLCB0aGlzLm5hbWUsIHRoaXMubmFtZSwgc291cmNlKTtcbiAgICB9XG4gICAgdmFyIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzID0gY29tbW9uLmdldER1cGxpY2F0ZXMoZm9ybWFscyk7XG4gICAgaWYgKGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzKG5hbWUsIGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLCBzb3VyY2UpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pbnN0YWxsKG5hbWUsIGZvcm1hbHMsIGJvZHksIGRlc2NyaXB0aW9uLCBzb3VyY2UpO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5vdmVycmlkZSA9IGZ1bmN0aW9uIChuYW1lLCBmb3JtYWxzLCBib2R5LCBkZXNjSWdub3JlZCwgc291cmNlKSB7XG4gICAgdmFyIHJ1bGVJbmZvID0gdGhpcy5lbnN1cmVTdXBlckdyYW1tYXIoKS5ydWxlc1tuYW1lXTtcbiAgICBpZiAoIXJ1bGVJbmZvKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5jYW5ub3RPdmVycmlkZVVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIHNvdXJjZSk7XG4gICAgfVxuICAgIHRoaXMuaW5zdGFsbE92ZXJyaWRkZW5PckV4dGVuZGVkUnVsZShuYW1lLCBmb3JtYWxzLCBib2R5LCBzb3VyY2UpO1xuICAgIHJldHVybiB0aGlzO1xufTtcbkdyYW1tYXJEZWNsLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbiAobmFtZSwgZm9ybWFscywgZnJhZ21lbnQsIGRlc2NJZ25vcmVkLCBzb3VyY2UpIHtcbiAgICB2YXIgcnVsZUluZm8gPSB0aGlzLmVuc3VyZVN1cGVyR3JhbW1hcigpLnJ1bGVzW25hbWVdO1xuICAgIGlmICghcnVsZUluZm8pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLmNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKG5hbWUsIHRoaXMuc3VwZXJHcmFtbWFyLm5hbWUsIHNvdXJjZSk7XG4gICAgfVxuICAgIHZhciBib2R5ID0gbmV3IHBleHBycy5FeHRlbmQodGhpcy5zdXBlckdyYW1tYXIsIG5hbWUsIGZyYWdtZW50KTtcbiAgICBib2R5LnNvdXJjZSA9IGZyYWdtZW50LnNvdXJjZTtcbiAgICB0aGlzLmluc3RhbGxPdmVycmlkZGVuT3JFeHRlbmRlZFJ1bGUobmFtZSwgZm9ybWFscywgYm9keSwgc291cmNlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gR3JhbW1hckRlY2w7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gSW5wdXRTdHJlYW0oc291cmNlKSB7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy5wb3MgPSAwO1xuICAgIHRoaXMuZXhhbWluZWRMZW5ndGggPSAwO1xufVxuSW5wdXRTdHJlYW0ucHJvdG90eXBlID0ge1xuICAgIGF0RW5kOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhbnMgPSB0aGlzLnBvcyA9PT0gdGhpcy5zb3VyY2UubGVuZ3RoO1xuICAgICAgICB0aGlzLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5leGFtaW5lZExlbmd0aCwgdGhpcy5wb3MgKyAxKTtcbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9LFxuICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFucyA9IHRoaXMuc291cmNlW3RoaXMucG9zKytdO1xuICAgICAgICB0aGlzLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5leGFtaW5lZExlbmd0aCwgdGhpcy5wb3MpO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgbWF0Y2hTdHJpbmc6IGZ1bmN0aW9uIChzLCBvcHRJZ25vcmVDYXNlKSB7XG4gICAgICAgIHZhciBpZHg7XG4gICAgICAgIGlmIChvcHRJZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgICBDYXNlLWluc2Vuc2l0aXZlIGNvbXBhcmlzb24gaXMgYSB0cmlja3kgYnVzaW5lc3MuIFNvbWUgbm90YWJsZSBnb3RjaGFzIGluY2x1ZGUgdGhlXG4gICAgICAgICAgICAgIFwiVHVya2lzaCBJXCIgcHJvYmxlbSAoaHR0cDovL3d3dy5pMThuZ3V5LmNvbS91bmljb2RlL3R1cmtpc2gtaTE4bi5odG1sKSBhbmQgdGhlIGZhY3RcbiAgICAgICAgICAgICAgdGhhdCB0aGUgR2VybWFuIEVzc3pldCAow58pIHR1cm5zIGludG8gXCJTU1wiIGluIHVwcGVyIGNhc2UuXG4gICAgICBcbiAgICAgICAgICAgICAgVGhpcyBpcyBpbnRlbmRlZCB0byBiZSBhIGxvY2FsZS1pbnZhcmlhbnQgY29tcGFyaXNvbiwgd2hpY2ggbWVhbnMgaXQgbWF5IG5vdCBvYmV5XG4gICAgICAgICAgICAgIGxvY2FsZS1zcGVjaWZpYyBleHBlY3RhdGlvbnMgKGUuZy4gXCJpXCIgPT4gXCLEsFwiKS5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZm9yIChpZHggPSAwOyBpZHggPCBzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYWN0dWFsID0gdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGV4cGVjdGVkID0gc1tpZHhdO1xuICAgICAgICAgICAgICAgIGlmIChhY3R1YWwgPT0gbnVsbCB8fCBhY3R1YWwudG9VcHBlckNhc2UoKSAhPT0gZXhwZWN0ZWQudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRGVmYXVsdCBpcyBjYXNlLXNlbnNpdGl2ZSBjb21wYXJpc29uLlxuICAgICAgICBmb3IgKGlkeCA9IDA7IGlkeCA8IHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMubmV4dCgpICE9PSBzW2lkeF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBzb3VyY2VTbGljZTogZnVuY3Rpb24gKHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnNsaWNlKHN0YXJ0SWR4LCBlbmRJZHgpO1xuICAgIH0sXG4gICAgaW50ZXJ2YWw6IGZ1bmN0aW9uIChzdGFydElkeCwgb3B0RW5kSWR4KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2UsIHN0YXJ0SWR4LCBvcHRFbmRJZHggPyBvcHRFbmRJZHggOiB0aGlzLnBvcyk7XG4gICAgfVxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFN0cmVhbTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGFzc2VydCA9IHJlcXVpcmUoJy4vY29tbW9uJykuYXNzZXJ0O1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBJbnRlcnZhbChzb3VyY2VTdHJpbmcsIHN0YXJ0SWR4LCBlbmRJZHgpIHtcbiAgICB0aGlzLnNvdXJjZVN0cmluZyA9IHNvdXJjZVN0cmluZztcbiAgICB0aGlzLnN0YXJ0SWR4ID0gc3RhcnRJZHg7XG4gICAgdGhpcy5lbmRJZHggPSBlbmRJZHg7XG59XG5JbnRlcnZhbC5jb3ZlcmFnZSA9IGZ1bmN0aW9uICggLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICAgIHZhciBzb3VyY2VTdHJpbmcgPSBhcmd1bWVudHNbMF0uc291cmNlU3RyaW5nO1xuICAgIHZhciBzdGFydElkeCA9IGFyZ3VtZW50c1swXS5zdGFydElkeDtcbiAgICB2YXIgZW5kSWR4ID0gYXJndW1lbnRzWzBdLmVuZElkeDtcbiAgICBmb3IgKHZhciBpZHggPSAxOyBpZHggPCBhcmd1bWVudHMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSBhcmd1bWVudHNbaWR4XTtcbiAgICAgICAgaWYgKGludGVydmFsLnNvdXJjZVN0cmluZyAhPT0gc291cmNlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdGFydElkeCA9IE1hdGgubWluKHN0YXJ0SWR4LCBhcmd1bWVudHNbaWR4XS5zdGFydElkeCk7XG4gICAgICAgICAgICBlbmRJZHggPSBNYXRoLm1heChlbmRJZHgsIGFyZ3VtZW50c1tpZHhdLmVuZElkeCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbnRlcnZhbChzb3VyY2VTdHJpbmcsIHN0YXJ0SWR4LCBlbmRJZHgpO1xufTtcbkludGVydmFsLnByb3RvdHlwZSA9IHtcbiAgICBjb3ZlcmFnZVdpdGg6IGZ1bmN0aW9uICggLyogaW50ZXJ2YWwxLCBpbnRlcnZhbDIsIC4uLiAqLykge1xuICAgICAgICB2YXIgaW50ZXJ2YWxzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgaW50ZXJ2YWxzLnB1c2godGhpcyk7XG4gICAgICAgIHJldHVybiBJbnRlcnZhbC5jb3ZlcmFnZS5hcHBseSh1bmRlZmluZWQsIGludGVydmFscyk7XG4gICAgfSxcbiAgICBjb2xsYXBzZWRMZWZ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHRoaXMuc3RhcnRJZHgpO1xuICAgIH0sXG4gICAgY29sbGFwc2VkUmlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgdGhpcy5lbmRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgICB9LFxuICAgIGdldExpbmVBbmRDb2x1bW5NZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciByYW5nZSA9IFt0aGlzLnN0YXJ0SWR4LCB0aGlzLmVuZElkeF07XG4gICAgICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCByYW5nZSk7XG4gICAgfSxcbiAgICAvLyBSZXR1cm5zIGFuIGFycmF5IG9mIDAsIDEsIG9yIDIgaW50ZXJ2YWxzIHRoYXQgcmVwcmVzZW50cyB0aGUgcmVzdWx0IG9mIHRoZVxuICAgIC8vIGludGVydmFsIGRpZmZlcmVuY2Ugb3BlcmF0aW9uLlxuICAgIG1pbnVzOiBmdW5jdGlvbiAodGhhdCkge1xuICAgICAgICBpZiAodGhpcy5zb3VyY2VTdHJpbmcgIT09IHRoYXQuc291cmNlU3RyaW5nKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGFydElkeCA9PT0gdGhhdC5zdGFydElkeCAmJiB0aGlzLmVuZElkeCA9PT0gdGhhdC5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGlzYCBhbmQgYHRoYXRgIGFyZSB0aGUgc2FtZSBpbnRlcnZhbCFcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnN0YXJ0SWR4IDwgdGhhdC5zdGFydElkeCAmJiB0aGF0LmVuZElkeCA8IHRoaXMuZW5kSWR4KSB7XG4gICAgICAgICAgICAvLyBgdGhhdGAgc3BsaXRzIGB0aGlzYCBpbnRvIHR3byBpbnRlcnZhbHNcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4LCB0aGF0LnN0YXJ0SWR4KSxcbiAgICAgICAgICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoYXQuZW5kSWR4LCB0aGlzLmVuZElkeClcbiAgICAgICAgICAgIF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdGFydElkeCA8IHRoYXQuZW5kSWR4ICYmIHRoYXQuZW5kSWR4IDwgdGhpcy5lbmRJZHgpIHtcbiAgICAgICAgICAgIC8vIGB0aGF0YCBjb250YWlucyBhIHByZWZpeCBvZiBgdGhpc2BcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGF0LmVuZElkeCwgdGhpcy5lbmRJZHgpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc3RhcnRJZHggPCB0aGF0LnN0YXJ0SWR4ICYmIHRoYXQuc3RhcnRJZHggPCB0aGlzLmVuZElkeCkge1xuICAgICAgICAgICAgLy8gYHRoYXRgIGNvbnRhaW5zIGEgc3VmZml4IG9mIGB0aGlzYFxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIHRoaXMuc3RhcnRJZHgsIHRoYXQuc3RhcnRJZHgpXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYHRoYXRgIGFuZCBgdGhpc2AgZG8gbm90IG92ZXJsYXBcbiAgICAgICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICAgICAgdGhpc1xuICAgICAgICAgICAgXTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLy8gUmV0dXJucyBhIG5ldyBJbnRlcnZhbCB0aGF0IGhhcyB0aGUgc2FtZSBleHRlbnQgYXMgdGhpcyBvbmUsIGJ1dCB3aGljaCBpcyByZWxhdGl2ZVxuICAgIC8vIHRvIGB0aGF0YCwgYW4gSW50ZXJ2YWwgdGhhdCBmdWxseSBjb3ZlcnMgdGhpcyBvbmUuXG4gICAgcmVsYXRpdmVUbzogZnVuY3Rpb24gKHRoYXQpIHtcbiAgICAgICAgaWYgKHRoaXMuc291cmNlU3RyaW5nICE9PSB0aGF0LnNvdXJjZVN0cmluZykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmludGVydmFsU291cmNlc0RvbnRNYXRjaCgpO1xuICAgICAgICB9XG4gICAgICAgIGFzc2VydCh0aGlzLnN0YXJ0SWR4ID49IHRoYXQuc3RhcnRJZHggJiYgdGhpcy5lbmRJZHggPD0gdGhhdC5lbmRJZHgsICdvdGhlciBpbnRlcnZhbCBkb2VzIG5vdCBjb3ZlciB0aGlzIG9uZScpO1xuICAgICAgICByZXR1cm4gbmV3IEludGVydmFsKHRoaXMuc291cmNlU3RyaW5nLCB0aGlzLnN0YXJ0SWR4IC0gdGhhdC5zdGFydElkeCwgdGhpcy5lbmRJZHggLSB0aGF0LnN0YXJ0SWR4KTtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgYSBuZXcgSW50ZXJ2YWwgd2hpY2ggY29udGFpbnMgdGhlIHNhbWUgY29udGVudHMgYXMgdGhpcyBvbmUsXG4gICAgLy8gYnV0IHdpdGggd2hpdGVzcGFjZSB0cmltbWVkIGZyb20gYm90aCBlbmRzLiAoVGhpcyBvbmx5IG1ha2VzIHNlbnNlIHdoZW5cbiAgICAvLyB0aGUgaW5wdXQgc3RyZWFtIGlzIGEgc3RyaW5nLilcbiAgICB0cmltbWVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250ZW50cyA9IHRoaXMuY29udGVudHM7XG4gICAgICAgIHZhciBzdGFydElkeCA9IHRoaXMuc3RhcnRJZHggKyBjb250ZW50cy5tYXRjaCgvXlxccyovKVswXS5sZW5ndGg7XG4gICAgICAgIHZhciBlbmRJZHggPSB0aGlzLmVuZElkeCAtIGNvbnRlbnRzLm1hdGNoKC9cXHMqJC8pWzBdLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRlcnZhbCh0aGlzLnNvdXJjZVN0cmluZywgc3RhcnRJZHgsIGVuZElkeCk7XG4gICAgfSxcbiAgICBzdWJJbnRlcnZhbDogZnVuY3Rpb24gKG9mZnNldCwgbGVuKSB7XG4gICAgICAgIHZhciBuZXdTdGFydElkeCA9IHRoaXMuc3RhcnRJZHggKyBvZmZzZXQ7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5zb3VyY2VTdHJpbmcsIG5ld1N0YXJ0SWR4LCBuZXdTdGFydElkeCArIGxlbik7XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKEludGVydmFsLnByb3RvdHlwZSwge1xuICAgIGNvbnRlbnRzOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50cyA9IHRoaXMuc291cmNlU3RyaW5nLnNsaWNlKHRoaXMuc3RhcnRJZHgsIHRoaXMuZW5kSWR4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb250ZW50cztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgbGVuZ3RoOiB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5lbmRJZHggLSB0aGlzLnN0YXJ0SWR4OyB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfVxufSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWw7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciBJbnRlcnZhbCA9IHJlcXVpcmUoJy4vSW50ZXJ2YWwnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gTWF0Y2hSZXN1bHQobWF0Y2hlciwgaW5wdXQsIHN0YXJ0RXhwciwgY3N0LCBjc3RPZmZzZXQsIHJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgb3B0UmVjb3JkZWRGYWlsdXJlcykge1xuICAgIHRoaXMubWF0Y2hlciA9IG1hdGNoZXI7XG4gICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMuc3RhcnRFeHByID0gc3RhcnRFeHByO1xuICAgIHRoaXMuX2NzdCA9IGNzdDtcbiAgICB0aGlzLl9jc3RPZmZzZXQgPSBjc3RPZmZzZXQ7XG4gICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xuICAgIHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzID0gb3B0UmVjb3JkZWRGYWlsdXJlcztcbiAgICBpZiAodGhpcy5mYWlsZWQoKSkge1xuICAgICAgICBjb21tb24uZGVmaW5lTGF6eVByb3BlcnR5KHRoaXMsICdtZXNzYWdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRldGFpbCA9ICdFeHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICAgICAgICAgIHJldHVybiB1dGlsLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlKHRoaXMuaW5wdXQsIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkpICsgZGV0YWlsO1xuICAgICAgICB9KTtcbiAgICAgICAgY29tbW9uLmRlZmluZUxhenlQcm9wZXJ0eSh0aGlzLCAnc2hvcnRNZXNzYWdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGRldGFpbCA9ICdleHBlY3RlZCAnICsgdGhpcy5nZXRFeHBlY3RlZFRleHQoKTtcbiAgICAgICAgICAgIHZhciBlcnJvckluZm8gPSB1dGlsLmdldExpbmVBbmRDb2x1bW4odGhpcy5pbnB1dCwgdGhpcy5nZXRSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24oKSk7XG4gICAgICAgICAgICByZXR1cm4gJ0xpbmUgJyArIGVycm9ySW5mby5saW5lTnVtICsgJywgY29sICcgKyBlcnJvckluZm8uY29sTnVtICsgJzogJyArIGRldGFpbDtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLnN1Y2NlZWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gISF0aGlzLl9jc3Q7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmZhaWxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gIXRoaXMuc3VjY2VlZGVkKCk7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uO1xufTtcbk1hdGNoUmVzdWx0LnByb3RvdHlwZS5nZXRSaWdodG1vc3RGYWlsdXJlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVzKSB7XG4gICAgICAgIHRoaXMubWF0Y2hlci5zZXRJbnB1dCh0aGlzLmlucHV0KTtcbiAgICAgICAgdmFyIG1hdGNoUmVzdWx0V2l0aEZhaWx1cmVzID0gdGhpcy5tYXRjaGVyLl9tYXRjaCh0aGlzLnN0YXJ0RXhwciwgZmFsc2UsIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkpO1xuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcyA9IG1hdGNoUmVzdWx0V2l0aEZhaWx1cmVzLmdldFJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9yaWdodG1vc3RGYWlsdXJlcztcbn07XG5NYXRjaFJlc3VsdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3VjY2VlZGVkKCkgP1xuICAgICAgICAnW21hdGNoIHN1Y2NlZWRlZF0nIDpcbiAgICAgICAgJ1ttYXRjaCBmYWlsZWQgYXQgcG9zaXRpb24gJyArIHRoaXMuZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKCkgKyAnXSc7XG59O1xuLy8gUmV0dXJuIGEgc3RyaW5nIHN1bW1hcml6aW5nIHRoZSBleHBlY3RlZCBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIHdoZW5cbi8vIHRoZSBtYXRjaCBmYWlsdXJlIG9jY3VycmVkLlxuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEV4cGVjdGVkVGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdWNjZWVkZWQoKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgZXhwZWN0ZWQgdGV4dCBvZiBhIHN1Y2Nlc3NmdWwgTWF0Y2hSZXN1bHQnKTtcbiAgICB9XG4gICAgdmFyIHNiID0gbmV3IGNvbW1vbi5TdHJpbmdCdWZmZXIoKTtcbiAgICB2YXIgZmFpbHVyZXMgPSB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVzKCk7XG4gICAgLy8gRmlsdGVyIG91dCB0aGUgZmx1ZmZ5IGZhaWx1cmVzIHRvIG1ha2UgdGhlIGRlZmF1bHQgZXJyb3IgbWVzc2FnZXMgbW9yZSB1c2VmdWxcbiAgICBmYWlsdXJlcyA9IGZhaWx1cmVzLmZpbHRlcihmdW5jdGlvbiAoZmFpbHVyZSkge1xuICAgICAgICByZXR1cm4gIWZhaWx1cmUuaXNGbHVmZnkoKTtcbiAgICB9KTtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBmYWlsdXJlcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGlmIChpZHggPiAwKSB7XG4gICAgICAgICAgICBpZiAoaWR4ID09PSBmYWlsdXJlcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgc2IuYXBwZW5kKGZhaWx1cmVzLmxlbmd0aCA+IDIgPyAnLCBvciAnIDogJyBvciAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNiLmFwcGVuZCgnLCAnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoZmFpbHVyZXNbaWR4XS50b1N0cmluZygpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuTWF0Y2hSZXN1bHQucHJvdG90eXBlLmdldEludGVydmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwb3MgPSB0aGlzLmdldFJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbigpO1xuICAgIHJldHVybiBuZXcgSW50ZXJ2YWwodGhpcy5pbnB1dCwgcG9zLCBwb3MpO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFJlc3VsdDtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIElucHV0U3RyZWFtID0gcmVxdWlyZSgnLi9JbnB1dFN0cmVhbScpO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIFBvc0luZm8gPSByZXF1aXJlKCcuL1Bvc0luZm8nKTtcbnZhciBUcmFjZSA9IHJlcXVpcmUoJy4vVHJhY2UnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgYXBwbHlTcGFjZXMgPSBuZXcgcGV4cHJzLkFwcGx5KCdzcGFjZXMnKTtcbmZ1bmN0aW9uIE1hdGNoU3RhdGUobWF0Y2hlciwgc3RhcnRFeHByLCBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICB0aGlzLm1hdGNoZXIgPSBtYXRjaGVyO1xuICAgIHRoaXMuc3RhcnRFeHByID0gc3RhcnRFeHByO1xuICAgIHRoaXMuZ3JhbW1hciA9IG1hdGNoZXIuZ3JhbW1hcjtcbiAgICB0aGlzLmlucHV0ID0gbWF0Y2hlci5pbnB1dDtcbiAgICB0aGlzLmlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoZXIuaW5wdXQpO1xuICAgIHRoaXMubWVtb1RhYmxlID0gbWF0Y2hlci5tZW1vVGFibGU7XG4gICAgdGhpcy5fYmluZGluZ3MgPSBbXTtcbiAgICB0aGlzLl9iaW5kaW5nT2Zmc2V0cyA9IFtdO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9uU3RhY2sgPSBbXTtcbiAgICB0aGlzLl9wb3NTdGFjayA9IFswXTtcbiAgICB0aGlzLmluTGV4aWZpZWRDb250ZXh0U3RhY2sgPSBbZmFsc2VdO1xuICAgIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uID0gLTE7XG4gICAgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sgPSBbXTtcbiAgICB0aGlzLl9yZWNvcmRlZEZhaWx1cmVzU3RhY2sgPSBbXTtcbiAgICBpZiAob3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMgPSBvcHRQb3NpdGlvblRvUmVjb3JkRmFpbHVyZXM7XG4gICAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxufVxuTWF0Y2hTdGF0ZS5wcm90b3R5cGUgPSB7XG4gICAgcG9zVG9PZmZzZXQ6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgcmV0dXJuIHBvcyAtIHRoaXMuX3Bvc1N0YWNrW3RoaXMuX3Bvc1N0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH0sXG4gICAgZW50ZXJBcHBsaWNhdGlvbjogZnVuY3Rpb24gKHBvc0luZm8sIGFwcCkge1xuICAgICAgICB0aGlzLl9wb3NTdGFjay5wdXNoKHRoaXMuaW5wdXRTdHJlYW0ucG9zKTtcbiAgICAgICAgdGhpcy5fYXBwbGljYXRpb25TdGFjay5wdXNoKGFwcCk7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wdXNoKGZhbHNlKTtcbiAgICAgICAgcG9zSW5mby5lbnRlcihhcHApO1xuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wdXNoKHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSAtMTtcbiAgICB9LFxuICAgIGV4aXRBcHBsaWNhdGlvbjogZnVuY3Rpb24gKHBvc0luZm8sIG9wdE5vZGUpIHtcbiAgICAgICAgdmFyIG9yaWdQb3MgPSB0aGlzLl9wb3NTdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5fYXBwbGljYXRpb25TdGFjay5wb3AoKTtcbiAgICAgICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnBvcCgpO1xuICAgICAgICBwb3NJbmZvLmV4aXQoKTtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSBNYXRoLm1heCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgdGhpcy5fcmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uU3RhY2sucG9wKCkpO1xuICAgICAgICBpZiAob3B0Tm9kZSkge1xuICAgICAgICAgICAgdGhpcy5wdXNoQmluZGluZyhvcHROb2RlLCBvcmlnUG9zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW50ZXJMZXhpZmllZENvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrLnB1c2godHJ1ZSk7XG4gICAgfSxcbiAgICBleGl0TGV4aWZpZWRDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5wb3AoKTtcbiAgICB9LFxuICAgIGN1cnJlbnRBcHBsaWNhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXBwbGljYXRpb25TdGFja1t0aGlzLl9hcHBsaWNhdGlvblN0YWNrLmxlbmd0aCAtIDFdO1xuICAgIH0sXG4gICAgaW5TeW50YWN0aWNDb250ZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5pbnB1dFN0cmVhbS5zb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGN1cnJlbnRBcHBsaWNhdGlvbiA9IHRoaXMuY3VycmVudEFwcGxpY2F0aW9uKCk7XG4gICAgICAgIGlmIChjdXJyZW50QXBwbGljYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50QXBwbGljYXRpb24uaXNTeW50YWN0aWMoKSAmJiAhdGhpcy5pbkxleGlmaWVkQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gVGhlIHRvcC1sZXZlbCBjb250ZXh0IGlzIHN5bnRhY3RpYyBpZiB0aGUgc3RhcnQgYXBwbGljYXRpb24gaXMuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydEV4cHIuZmFjdG9yc1swXS5pc1N5bnRhY3RpYygpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBpbkxleGlmaWVkQ29udGV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbkxleGlmaWVkQ29udGV4dFN0YWNrW3RoaXMuaW5MZXhpZmllZENvbnRleHRTdGFjay5sZW5ndGggLSAxXTtcbiAgICB9LFxuICAgIHNraXBTcGFjZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgICAgIHRoaXMuZXZhbChhcHBseVNwYWNlcyk7XG4gICAgICAgIHRoaXMucG9wQmluZGluZygpO1xuICAgICAgICB0aGlzLnBvcEZhaWx1cmVzSW5mbygpO1xuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gICAgfSxcbiAgICBza2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5TeW50YWN0aWNDb250ZXh0KCkgP1xuICAgICAgICAgICAgdGhpcy5za2lwU3BhY2VzKCkgOlxuICAgICAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3M7XG4gICAgfSxcbiAgICBtYXliZVNraXBTcGFjZXNCZWZvcmU6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgIGlmIChleHByIGluc3RhbmNlb2YgcGV4cHJzLkFwcGx5ICYmIGV4cHIuaXNTeW50YWN0aWMoKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2tpcFNwYWNlcygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV4cHIuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSgpICYmIGV4cHIgIT09IGFwcGx5U3BhY2VzKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5za2lwU3BhY2VzSWZJblN5bnRhY3RpY0NvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlucHV0U3RyZWFtLnBvcztcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcHVzaEJpbmRpbmc6IGZ1bmN0aW9uIChub2RlLCBvcmlnUG9zKSB7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdzLnB1c2gobm9kZSk7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdPZmZzZXRzLnB1c2godGhpcy5wb3NUb09mZnNldChvcmlnUG9zKSk7XG4gICAgfSxcbiAgICBwb3BCaW5kaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX2JpbmRpbmdzLnBvcCgpO1xuICAgICAgICB0aGlzLl9iaW5kaW5nT2Zmc2V0cy5wb3AoKTtcbiAgICB9LFxuICAgIG51bUJpbmRpbmdzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5ncy5sZW5ndGg7XG4gICAgfSxcbiAgICB0cnVuY2F0ZUJpbmRpbmdzOiBmdW5jdGlvbiAobmV3TGVuZ3RoKSB7XG4gICAgICAgIC8vIFllcywgdGhpcyBpcyB0aGlzIHJlYWxseSBmYXN0ZXIgdGhhbiBzZXR0aW5nIHRoZSBgbGVuZ3RoYCBwcm9wZXJ0eSAodGVzdGVkIHdpdGhcbiAgICAgICAgLy8gYmluL2VzNWJlbmNoIG9uIE5vZGUgdjYuMS4wKS5cbiAgICAgICAgd2hpbGUgKHRoaXMuX2JpbmRpbmdzLmxlbmd0aCA+IG5ld0xlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5wb3BCaW5kaW5nKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldEN1cnJlbnRQb3NJbmZvOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFBvc0luZm8odGhpcy5pbnB1dFN0cmVhbS5wb3MpO1xuICAgIH0sXG4gICAgZ2V0UG9zSW5mbzogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgICAgIGlmICghcG9zSW5mbykge1xuICAgICAgICAgICAgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc10gPSBuZXcgUG9zSW5mbygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwb3NJbmZvO1xuICAgIH0sXG4gICAgcHJvY2Vzc0ZhaWx1cmU6IGZ1bmN0aW9uIChwb3MsIGV4cHIpIHtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSBNYXRoLm1heCh0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiwgcG9zKTtcbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJiBwb3MgPT09IHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICB2YXIgYXBwID0gdGhpcy5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICAgICAgICAgIGlmIChhcHApIHtcbiAgICAgICAgICAgICAgICAvLyBTdWJzdGl0dXRlIHBhcmFtZXRlcnMgd2l0aCB0aGUgYWN0dWFsIHBleHBycyB0aGF0IHdlcmUgcGFzc2VkIHRvXG4gICAgICAgICAgICAgICAgLy8gdGhlIGN1cnJlbnQgcnVsZS5cbiAgICAgICAgICAgICAgICBleHByID0gZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFwcC5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRoaXMgYnJhbmNoIGlzIG9ubHkgcmVhY2hlZCBmb3IgdGhlIFwiZW5kLWNoZWNrXCIgdGhhdCBpc1xuICAgICAgICAgICAgICAgIC8vIHBlcmZvcm1lZCBhZnRlciB0aGUgdG9wLWxldmVsIGFwcGxpY2F0aW9uLiBJbiB0aGF0IGNhc2UsXG4gICAgICAgICAgICAgICAgLy8gZXhwciA9PT0gcGV4cHJzLmVuZCBzbyB0aGVyZSBpcyBubyBuZWVkIHRvIHN1YnN0aXR1dGVcbiAgICAgICAgICAgICAgICAvLyBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZWNvcmRGYWlsdXJlKGV4cHIudG9GYWlsdXJlKHRoaXMuZ3JhbW1hciksIGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVjb3JkRmFpbHVyZTogZnVuY3Rpb24gKGZhaWx1cmUsIHNob3VsZENsb25lSWZOZXcpIHtcbiAgICAgICAgdmFyIGtleSA9IGZhaWx1cmUudG9LZXkoKTtcbiAgICAgICAgaWYgKCF0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzW2tleV0gPSBzaG91bGRDbG9uZUlmTmV3ID8gZmFpbHVyZS5jbG9uZSgpIDogZmFpbHVyZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXNba2V5XS5pc0ZsdWZmeSgpICYmICFmYWlsdXJlLmlzRmx1ZmZ5KCkpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkZWRGYWlsdXJlc1trZXldLmNsZWFyRmx1ZmZ5KCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlY29yZEZhaWx1cmVzOiBmdW5jdGlvbiAoZmFpbHVyZXMsIHNob3VsZENsb25lSWZOZXcpIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyhmYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBzZWxmLnJlY29yZEZhaWx1cmUoZmFpbHVyZXNba2V5XSwgc2hvdWxkQ2xvbmVJZk5ldyk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgY2xvbmVSZWNvcmRlZEZhaWx1cmVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHZhciBhbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMucmVjb3JkZWRGYWlsdXJlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICBhbnNba2V5XSA9IHNlbGYucmVjb3JkZWRGYWlsdXJlc1trZXldLmNsb25lKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgZ2V0UmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbjtcbiAgICB9LFxuICAgIF9nZXRSaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA+PSAwID9cbiAgICAgICAgICAgIHRoaXMucG9zVG9PZmZzZXQodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pIDpcbiAgICAgICAgICAgIC0xO1xuICAgIH0sXG4gICAgLy8gUmV0dXJucyB0aGUgbWVtb2l6ZWQgdHJhY2UgZW50cnkgZm9yIGBleHByYCBhdCBgcG9zYCwgaWYgb25lIGV4aXN0cywgYG51bGxgIG90aGVyd2lzZS5cbiAgICBnZXRNZW1vaXplZFRyYWNlRW50cnk6IGZ1bmN0aW9uIChwb3MsIGV4cHIpIHtcbiAgICAgICAgdmFyIHBvc0luZm8gPSB0aGlzLm1lbW9UYWJsZVtwb3NdO1xuICAgICAgICBpZiAocG9zSW5mbyAmJiBleHByLnJ1bGVOYW1lKSB7XG4gICAgICAgICAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1tleHByLnRvTWVtb0tleSgpXTtcbiAgICAgICAgICAgIGlmIChtZW1vUmVjICYmIG1lbW9SZWMudHJhY2VFbnRyeSkge1xuICAgICAgICAgICAgICAgIHZhciBlbnRyeSA9IG1lbW9SZWMudHJhY2VFbnRyeS5jbG9uZVdpdGhFeHByKGV4cHIpO1xuICAgICAgICAgICAgICAgIGVudHJ5LmlzTWVtb2l6ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbnRyeTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICAgIC8vIFJldHVybnMgYSBuZXcgdHJhY2UgZW50cnksIHdpdGggdGhlIGN1cnJlbnRseSBhY3RpdmUgdHJhY2UgYXJyYXkgYXMgaXRzIGNoaWxkcmVuLlxuICAgIGdldFRyYWNlRW50cnk6IGZ1bmN0aW9uIChwb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MpIHtcbiAgICAgICAgaWYgKGV4cHIgaW5zdGFuY2VvZiBwZXhwcnMuQXBwbHkpIHtcbiAgICAgICAgICAgIHZhciBhcHAgPSB0aGlzLmN1cnJlbnRBcHBsaWNhdGlvbigpO1xuICAgICAgICAgICAgdmFyIGFjdHVhbHMgPSBhcHAgPyBhcHAuYXJncyA6IFtdO1xuICAgICAgICAgICAgZXhwciA9IGV4cHIuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5nZXRNZW1vaXplZFRyYWNlRW50cnkocG9zLCBleHByKSB8fFxuICAgICAgICAgICAgbmV3IFRyYWNlKHRoaXMuaW5wdXQsIHBvcywgdGhpcy5pbnB1dFN0cmVhbS5wb3MsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MsIHRoaXMudHJhY2UpO1xuICAgIH0sXG4gICAgaXNUcmFjaW5nOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMudHJhY2U7XG4gICAgfSxcbiAgICBoYXNOZWNlc3NhcnlJbmZvOiBmdW5jdGlvbiAobWVtb1JlYykge1xuICAgICAgICBpZiAodGhpcy50cmFjZSAmJiAhbWVtb1JlYy50cmFjZUVudHJ5KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjb3JkZWRGYWlsdXJlcyAmJlxuICAgICAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgKyBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPT09IHRoaXMucG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICByZXR1cm4gISFtZW1vUmVjLmZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIHVzZU1lbW9pemVkUmVzdWx0OiBmdW5jdGlvbiAob3JpZ1BvcywgbWVtb1JlYykge1xuICAgICAgICBpZiAodGhpcy50cmFjZSkge1xuICAgICAgICAgICAgdGhpcy50cmFjZS5wdXNoKG1lbW9SZWMudHJhY2VFbnRyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPSB0aGlzLmlucHV0U3RyZWFtLnBvcyArIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldDtcbiAgICAgICAgdGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24gPVxuICAgICAgICAgICAgTWF0aC5tYXgodGhpcy5yaWdodG1vc3RGYWlsdXJlUG9zaXRpb24sIG1lbW9SZWNSaWdodG1vc3RGYWlsdXJlUG9zaXRpb24pO1xuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmXG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcyA9PT0gbWVtb1JlY1JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiAmJlxuICAgICAgICAgICAgbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkRmFpbHVyZXMobWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24sIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGggPVxuICAgICAgICAgICAgTWF0aC5tYXgodGhpcy5pbnB1dFN0cmVhbS5leGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCArIG9yaWdQb3MpO1xuICAgICAgICBpZiAobWVtb1JlYy52YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dFN0cmVhbS5wb3MgKz0gbWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgICAgICAgICAgIHRoaXMucHVzaEJpbmRpbmcobWVtb1JlYy52YWx1ZSwgb3JpZ1Bvcyk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcbiAgICAvLyBFdmFsdWF0ZSBgZXhwcmAgYW5kIHJldHVybiBgdHJ1ZWAgaWYgaXQgc3VjY2VlZGVkLCBgZmFsc2VgIG90aGVyd2lzZS4gT24gc3VjY2VzcywgYGJpbmRpbmdzYFxuICAgIC8vIHdpbGwgaGF2ZSBgZXhwci5nZXRBcml0eSgpYCBtb3JlIGVsZW1lbnRzIHRoYW4gYmVmb3JlLCBhbmQgdGhlIGlucHV0IHN0cmVhbSdzIHBvc2l0aW9uIG1heVxuICAgIC8vIGhhdmUgaW5jcmVhc2VkLiBPbiBmYWlsdXJlLCBgYmluZGluZ3NgIGFuZCBwb3NpdGlvbiB3aWxsIGJlIHVuY2hhbmdlZC5cbiAgICBldmFsOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICB2YXIgaW5wdXRTdHJlYW0gPSB0aGlzLmlucHV0U3RyZWFtO1xuICAgICAgICB2YXIgb3JpZ051bUJpbmRpbmdzID0gdGhpcy5fYmluZGluZ3MubGVuZ3RoO1xuICAgICAgICB2YXIgb3JpZ1JlY29yZGVkRmFpbHVyZXM7XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIG9yaWdSZWNvcmRlZEZhaWx1cmVzID0gdGhpcy5yZWNvcmRlZEZhaWx1cmVzO1xuICAgICAgICAgICAgdGhpcy5yZWNvcmRlZEZhaWx1cmVzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICAgICAgdmFyIG1lbW9Qb3MgPSB0aGlzLm1heWJlU2tpcFNwYWNlc0JlZm9yZShleHByKTtcbiAgICAgICAgdmFyIG9yaWdUcmFjZTtcbiAgICAgICAgaWYgKHRoaXMudHJhY2UpIHtcbiAgICAgICAgICAgIG9yaWdUcmFjZSA9IHRoaXMudHJhY2U7XG4gICAgICAgICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgICAgIH1cbiAgICAgICAgLy8gRG8gdGhlIGFjdHVhbCBldmFsdWF0aW9uLlxuICAgICAgICB2YXIgYW5zID0gZXhwci5ldmFsKHRoaXMpO1xuICAgICAgICBpZiAodGhpcy50cmFjZSkge1xuICAgICAgICAgICAgdmFyIGJpbmRpbmdzID0gdGhpcy5fYmluZGluZ3Muc2xpY2Uob3JpZ051bUJpbmRpbmdzKTtcbiAgICAgICAgICAgIHZhciB0cmFjZUVudHJ5ID0gdGhpcy5nZXRUcmFjZUVudHJ5KG1lbW9Qb3MsIGV4cHIsIGFucywgYmluZGluZ3MpO1xuICAgICAgICAgICAgdHJhY2VFbnRyeS5pc0ltcGxpY2l0U3BhY2VzID0gZXhwciA9PT0gYXBwbHlTcGFjZXM7XG4gICAgICAgICAgICB0cmFjZUVudHJ5LmlzUm9vdE5vZGUgPSBleHByID09PSB0aGlzLnN0YXJ0RXhwcjtcbiAgICAgICAgICAgIG9yaWdUcmFjZS5wdXNoKHRyYWNlRW50cnkpO1xuICAgICAgICAgICAgdGhpcy50cmFjZSA9IG9yaWdUcmFjZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoYW5zKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzICYmIGlucHV0U3RyZWFtLnBvcyA9PT0gdGhpcy5wb3NpdGlvblRvUmVjb3JkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZl8xID0gdGhpcztcbiAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLnJlY29yZGVkRmFpbHVyZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmXzEucmVjb3JkZWRGYWlsdXJlc1trZXldLm1ha2VGbHVmZnkoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlc2V0IHRoZSBwb3NpdGlvbiBhbmQgdGhlIGJpbmRpbmdzLlxuICAgICAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgICAgICAgIHRoaXMudHJ1bmNhdGVCaW5kaW5ncyhvcmlnTnVtQmluZGluZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlY29yZGVkRmFpbHVyZXMpIHtcbiAgICAgICAgICAgIHRoaXMucmVjb3JkRmFpbHVyZXMob3JpZ1JlY29yZGVkRmFpbHVyZXMsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH0sXG4gICAgZ2V0TWF0Y2hSZXN1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5ldmFsKHRoaXMuc3RhcnRFeHByKTtcbiAgICAgICAgdmFyIHJpZ2h0bW9zdEZhaWx1cmVzO1xuICAgICAgICBpZiAodGhpcy5yZWNvcmRlZEZhaWx1cmVzKSB7XG4gICAgICAgICAgICB2YXIgc2VsZl8yID0gdGhpcztcbiAgICAgICAgICAgIHJpZ2h0bW9zdEZhaWx1cmVzID0gT2JqZWN0LmtleXModGhpcy5yZWNvcmRlZEZhaWx1cmVzKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxmXzIucmVjb3JkZWRGYWlsdXJlc1trZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBNYXRjaFJlc3VsdCh0aGlzLm1hdGNoZXIsIHRoaXMuaW5wdXQsIHRoaXMuc3RhcnRFeHByLCB0aGlzLl9iaW5kaW5nc1swXSwgdGhpcy5fYmluZGluZ09mZnNldHNbMF0sIHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uLCByaWdodG1vc3RGYWlsdXJlcyk7XG4gICAgfSxcbiAgICBnZXRUcmFjZTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRyYWNlID0gW107XG4gICAgICAgIHZhciBtYXRjaFJlc3VsdCA9IHRoaXMuZ2V0TWF0Y2hSZXN1bHQoKTtcbiAgICAgICAgLy8gVGhlIHRyYWNlIG5vZGUgZm9yIHRoZSBzdGFydCBydWxlIGlzIGFsd2F5cyB0aGUgbGFzdCBlbnRyeS4gSWYgaXQgaXMgYSBzeW50YWN0aWMgcnVsZSxcbiAgICAgICAgLy8gdGhlIGZpcnN0IGVudHJ5IGlzIGZvciBhbiBhcHBsaWNhdGlvbiBvZiAnc3BhY2VzJy5cbiAgICAgICAgLy8gVE9ETyhwZHVicm95KTogQ2xlYW4gdGhpcyB1cCBieSBpbnRyb2R1Y2luZyBhIHNwZWNpYWwgYE1hdGNoPHN0YXJ0QXBwbD5gIHJ1bGUsIHdoaWNoIHdpbGxcbiAgICAgICAgLy8gZW5zdXJlIHRoYXQgdGhlcmUgaXMgYWx3YXlzIGEgc2luZ2xlIHJvb3QgdHJhY2Ugbm9kZS5cbiAgICAgICAgdmFyIHJvb3RUcmFjZSA9IHRoaXMudHJhY2VbdGhpcy50cmFjZS5sZW5ndGggLSAxXTtcbiAgICAgICAgcm9vdFRyYWNlLnJlc3VsdCA9IG1hdGNoUmVzdWx0O1xuICAgICAgICByZXR1cm4gcm9vdFRyYWNlO1xuICAgIH0sXG4gICAgcHVzaEZhaWx1cmVzSW5mbzogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9yaWdodG1vc3RGYWlsdXJlUG9zaXRpb25TdGFjay5wdXNoKHRoaXMucmlnaHRtb3N0RmFpbHVyZVBvc2l0aW9uKTtcbiAgICAgICAgdGhpcy5fcmVjb3JkZWRGYWlsdXJlc1N0YWNrLnB1c2godGhpcy5yZWNvcmRlZEZhaWx1cmVzKTtcbiAgICB9LFxuICAgIHBvcEZhaWx1cmVzSW5mbzogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnJpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvbiA9IHRoaXMuX3JpZ2h0bW9zdEZhaWx1cmVQb3NpdGlvblN0YWNrLnBvcCgpO1xuICAgICAgICB0aGlzLnJlY29yZGVkRmFpbHVyZXMgPSB0aGlzLl9yZWNvcmRlZEZhaWx1cmVzU3RhY2sucG9wKCk7XG4gICAgfVxufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSBNYXRjaFN0YXRlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgTWF0Y2hTdGF0ZSA9IHJlcXVpcmUoJy4vTWF0Y2hTdGF0ZScpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE1hdGNoZXIoZ3JhbW1hcikge1xuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgdGhpcy5tZW1vVGFibGUgPSBbXTtcbiAgICB0aGlzLmlucHV0ID0gJyc7XG59XG5NYXRjaGVyLnByb3RvdHlwZS5nZXRJbnB1dCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnB1dDtcbn07XG5NYXRjaGVyLnByb3RvdHlwZS5zZXRJbnB1dCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICBpZiAodGhpcy5pbnB1dCAhPT0gc3RyKSB7XG4gICAgICAgIHRoaXMucmVwbGFjZUlucHV0UmFuZ2UoMCwgdGhpcy5pbnB1dC5sZW5ndGgsIHN0cik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLnJlcGxhY2VJbnB1dFJhbmdlID0gZnVuY3Rpb24gKHN0YXJ0SWR4LCBlbmRJZHgsIHN0cikge1xuICAgIHZhciBjdXJyZW50SW5wdXQgPSB0aGlzLmlucHV0O1xuICAgIGlmIChzdGFydElkeCA8IDAgfHwgc3RhcnRJZHggPiBjdXJyZW50SW5wdXQubGVuZ3RoIHx8XG4gICAgICAgIGVuZElkeCA8IDAgfHwgZW5kSWR4ID4gY3VycmVudElucHV0Lmxlbmd0aCB8fFxuICAgICAgICBzdGFydElkeCA+IGVuZElkeCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kaWNlczogJyArIHN0YXJ0SWR4ICsgJyBhbmQgJyArIGVuZElkeCk7XG4gICAgfVxuICAgIC8vIHVwZGF0ZSBpbnB1dFxuICAgIHRoaXMuaW5wdXQgPSBjdXJyZW50SW5wdXQuc2xpY2UoMCwgc3RhcnRJZHgpICsgc3RyICsgY3VycmVudElucHV0LnNsaWNlKGVuZElkeCk7XG4gICAgLy8gdXBkYXRlIG1lbW8gdGFibGUgKHNpbWlsYXIgdG8gdGhlIGFib3ZlKVxuICAgIHZhciByZXN0T2ZNZW1vVGFibGUgPSB0aGlzLm1lbW9UYWJsZS5zbGljZShlbmRJZHgpO1xuICAgIHRoaXMubWVtb1RhYmxlLmxlbmd0aCA9IHN0YXJ0SWR4O1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHN0ci5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMubWVtb1RhYmxlLnB1c2godW5kZWZpbmVkKTtcbiAgICB9XG4gICAgcmVzdE9mTWVtb1RhYmxlLmZvckVhY2goZnVuY3Rpb24gKHBvc0luZm8pIHsgdGhpcy5tZW1vVGFibGUucHVzaChwb3NJbmZvKTsgfSwgdGhpcyk7XG4gICAgLy8gSW52YWxpZGF0ZSBtZW1vUmVjc1xuICAgIGZvciAodmFyIHBvcyA9IDA7IHBvcyA8IHN0YXJ0SWR4OyBwb3MrKykge1xuICAgICAgICB2YXIgcG9zSW5mbyA9IHRoaXMubWVtb1RhYmxlW3Bvc107XG4gICAgICAgIGlmIChwb3NJbmZvKSB7XG4gICAgICAgICAgICBwb3NJbmZvLmNsZWFyT2Jzb2xldGVFbnRyaWVzKHBvcywgc3RhcnRJZHgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLm1hdGNoID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICByZXR1cm4gdGhpcy5fbWF0Y2godGhpcy5fZ2V0U3RhcnRFeHByKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpLCBmYWxzZSk7XG59O1xuTWF0Y2hlci5wcm90b3R5cGUudHJhY2UgPSBmdW5jdGlvbiAob3B0U3RhcnRBcHBsaWNhdGlvblN0cikge1xuICAgIHJldHVybiB0aGlzLl9tYXRjaCh0aGlzLl9nZXRTdGFydEV4cHIob3B0U3RhcnRBcHBsaWNhdGlvblN0ciksIHRydWUpO1xufTtcbk1hdGNoZXIucHJvdG90eXBlLl9tYXRjaCA9IGZ1bmN0aW9uIChzdGFydEV4cHIsIHRyYWNpbmcsIG9wdFBvc2l0aW9uVG9SZWNvcmRGYWlsdXJlcykge1xuICAgIHZhciBzdGF0ZSA9IG5ldyBNYXRjaFN0YXRlKHRoaXMsIHN0YXJ0RXhwciwgb3B0UG9zaXRpb25Ub1JlY29yZEZhaWx1cmVzKTtcbiAgICByZXR1cm4gdHJhY2luZyA/IHN0YXRlLmdldFRyYWNlKCkgOiBzdGF0ZS5nZXRNYXRjaFJlc3VsdCgpO1xufTtcbi8qXG4gIFJldHVybnMgdGhlIHN0YXJ0aW5nIGV4cHJlc3Npb24gZm9yIHRoaXMgTWF0Y2hlcidzIGFzc29jaWF0ZWQgZ3JhbW1hci4gSWYgYG9wdFN0YXJ0QXBwbGljYXRpb25TdHJgXG4gIGlzIHNwZWNpZmllZCwgaXQgaXMgYSBzdHJpbmcgZXhwcmVzc2luZyBhIHJ1bGUgYXBwbGljYXRpb24gaW4gdGhlIGdyYW1tYXIuIElmIG5vdCBzcGVjaWZpZWQsIHRoZVxuICBncmFtbWFyJ3MgZGVmYXVsdCBzdGFydCBydWxlIHdpbGwgYmUgdXNlZC5cbiovXG5NYXRjaGVyLnByb3RvdHlwZS5fZ2V0U3RhcnRFeHByID0gZnVuY3Rpb24gKG9wdFN0YXJ0QXBwbGljYXRpb25TdHIpIHtcbiAgICB2YXIgYXBwbGljYXRpb25TdHIgPSBvcHRTdGFydEFwcGxpY2F0aW9uU3RyIHx8IHRoaXMuZ3JhbW1hci5kZWZhdWx0U3RhcnRSdWxlO1xuICAgIGlmICghYXBwbGljYXRpb25TdHIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHN0YXJ0IHJ1bGUgYXJndW1lbnQgLS0gdGhlIGdyYW1tYXIgaGFzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZS4nKTtcbiAgICB9XG4gICAgdmFyIHN0YXJ0QXBwID0gdGhpcy5ncmFtbWFyLnBhcnNlQXBwbGljYXRpb24oYXBwbGljYXRpb25TdHIpO1xuICAgIHJldHVybiBuZXcgcGV4cHJzLlNlcShbc3RhcnRBcHAsIHBleHBycy5lbmRdKTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTWF0Y2hlcjtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ3V0aWwtZXh0ZW5kJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE5hbWVzcGFjZSgpIHtcbn1cbk5hbWVzcGFjZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuTmFtZXNwYWNlLmFzTmFtZXNwYWNlID0gZnVuY3Rpb24gKG9iak9yTmFtZXNwYWNlKSB7XG4gICAgaWYgKG9iak9yTmFtZXNwYWNlIGluc3RhbmNlb2YgTmFtZXNwYWNlKSB7XG4gICAgICAgIHJldHVybiBvYmpPck5hbWVzcGFjZTtcbiAgICB9XG4gICAgcmV0dXJuIE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2Uob2JqT3JOYW1lc3BhY2UpO1xufTtcbi8vIENyZWF0ZSBhIG5ldyBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXMgc3BlY2lmaWVkLCBhbGwgb2YgaXRzIHByb3BlcnRpZXNcbi8vIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSA9IGZ1bmN0aW9uIChvcHRQcm9wcykge1xuICAgIHJldHVybiBOYW1lc3BhY2UuZXh0ZW5kKE5hbWVzcGFjZS5wcm90b3R5cGUsIG9wdFByb3BzKTtcbn07XG4vLyBDcmVhdGUgYSBuZXcgbmFtZXNwYWNlIHdoaWNoIGV4dGVuZHMgYW5vdGhlciBuYW1lc3BhY2UuIElmIGBvcHRQcm9wc2AgaXNcbi8vIHNwZWNpZmllZCwgYWxsIG9mIGl0cyBwcm9wZXJ0aWVzIHdpbGwgYmUgY29waWVkIHRvIHRoZSBuZXcgbmFtZXNwYWNlLlxuTmFtZXNwYWNlLmV4dGVuZCA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG9wdFByb3BzKSB7XG4gICAgaWYgKG5hbWVzcGFjZSAhPT0gTmFtZXNwYWNlLnByb3RvdHlwZSAmJiAhKG5hbWVzcGFjZSBpbnN0YW5jZW9mIE5hbWVzcGFjZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbm90IGEgTmFtZXNwYWNlIG9iamVjdDogJyArIG5hbWVzcGFjZSk7XG4gICAgfVxuICAgIHZhciBucyA9IE9iamVjdC5jcmVhdGUobmFtZXNwYWNlLCB7XG4gICAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgICAgICB2YWx1ZTogTmFtZXNwYWNlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGV4dGVuZChucywgb3B0UHJvcHMpO1xufTtcbi8vIFRPRE86IFNob3VsZCB0aGlzIGJlIGEgcmVndWxhciBtZXRob2Q/XG5OYW1lc3BhY2UudG9TdHJpbmcgPSBmdW5jdGlvbiAobnMpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG5zKTtcbn07XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbm1vZHVsZS5leHBvcnRzID0gTmFtZXNwYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBQb3NJbmZvKCkge1xuICAgIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2sgPSBbXTsgLy8gYWN0aXZlIGFwcGxpY2F0aW9ucyBhdCB0aGlzIHBvc2l0aW9uXG4gICAgdGhpcy5tZW1vID0ge307XG4gICAgdGhpcy5tYXhFeGFtaW5lZExlbmd0aCA9IDA7XG4gICAgdGhpcy5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gLTE7XG4gICAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IHVuZGVmaW5lZDtcbn1cblBvc0luZm8ucHJvdG90eXBlID0ge1xuICAgIGlzQWN0aXZlOiBmdW5jdGlvbiAoYXBwbGljYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2suaW5kZXhPZihhcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgPj0gMDtcbiAgICB9LFxuICAgIGVudGVyOiBmdW5jdGlvbiAoYXBwbGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wdXNoKGFwcGxpY2F0aW9uLnRvTWVtb0tleSgpKTtcbiAgICB9LFxuICAgIGV4aXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5wb3AoKTtcbiAgICB9LFxuICAgIHN0YXJ0TGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24gKGhlYWRBcHBsaWNhdGlvbiwgbWVtb1JlYykge1xuICAgICAgICBtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbiA9IHRydWU7XG4gICAgICAgIG1lbW9SZWMuaGVhZEFwcGxpY2F0aW9uID0gaGVhZEFwcGxpY2F0aW9uO1xuICAgICAgICBtZW1vUmVjLm5leHRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICAgICAgdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbiA9IG1lbW9SZWM7XG4gICAgICAgIHZhciBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjayA9IHRoaXMuYXBwbGljYXRpb25NZW1vS2V5U3RhY2s7XG4gICAgICAgIHZhciBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGUgPSBhcHBsaWNhdGlvbk1lbW9LZXlTdGFjay5pbmRleE9mKGhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSkgKyAxO1xuICAgICAgICB2YXIgaW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2suc2xpY2UoaW5kZXhPZkZpcnN0SW52b2x2ZWRSdWxlKTtcbiAgICAgICAgbWVtb1JlYy5pc0ludm9sdmVkID0gZnVuY3Rpb24gKGFwcGxpY2F0aW9uTWVtb0tleSkge1xuICAgICAgICAgICAgcmV0dXJuIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cy5pbmRleE9mKGFwcGxpY2F0aW9uTWVtb0tleSkgPj0gMDtcbiAgICAgICAgfTtcbiAgICAgICAgbWVtb1JlYy51cGRhdGVJbnZvbHZlZEFwcGxpY2F0aW9uTWVtb0tleXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpZHggPSBpbmRleE9mRmlyc3RJbnZvbHZlZFJ1bGU7IGlkeCA8IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYXBwbGljYXRpb25NZW1vS2V5ID0gYXBwbGljYXRpb25NZW1vS2V5U3RhY2tbaWR4XTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNJbnZvbHZlZChhcHBsaWNhdGlvbk1lbW9LZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGludm9sdmVkQXBwbGljYXRpb25NZW1vS2V5cy5wdXNoKGFwcGxpY2F0aW9uTWVtb0tleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0sXG4gICAgZW5kTGVmdFJlY3Vyc2lvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gdGhpcy5jdXJyZW50TGVmdFJlY3Vyc2lvbi5uZXh0TGVmdFJlY3Vyc2lvbjtcbiAgICB9LFxuICAgIC8vIE5vdGU6IHRoaXMgbWV0aG9kIGRvZXNuJ3QgZ2V0IGNhbGxlZCBmb3IgdGhlIFwiaGVhZFwiIG9mIGEgbGVmdCByZWN1cnNpb24gLS0gZm9yIExSIGhlYWRzLFxuICAgIC8vIHRoZSBtZW1vaXplZCByZXN1bHQgKHdoaWNoIHN0YXJ0cyBvdXQgYmVpbmcgYSBmYWlsdXJlKSBpcyBhbHdheXMgdXNlZC5cbiAgICBzaG91bGRVc2VNZW1vaXplZFJlc3VsdDogZnVuY3Rpb24gKG1lbW9SZWMpIHtcbiAgICAgICAgaWYgKCFtZW1vUmVjLmlzTGVmdFJlY3Vyc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrID0gdGhpcy5hcHBsaWNhdGlvbk1lbW9LZXlTdGFjaztcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXBwbGljYXRpb25NZW1vS2V5U3RhY2subGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgdmFyIGFwcGxpY2F0aW9uTWVtb0tleSA9IGFwcGxpY2F0aW9uTWVtb0tleVN0YWNrW2lkeF07XG4gICAgICAgICAgICBpZiAobWVtb1JlYy5pc0ludm9sdmVkKGFwcGxpY2F0aW9uTWVtb0tleSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBtZW1vaXplOiBmdW5jdGlvbiAobWVtb0tleSwgbWVtb1JlYykge1xuICAgICAgICB0aGlzLm1lbW9bbWVtb0tleV0gPSBtZW1vUmVjO1xuICAgICAgICB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgodGhpcy5tYXhFeGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCk7XG4gICAgICAgIHRoaXMubWF4UmlnaHRtb3N0RmFpbHVyZU9mZnNldCA9XG4gICAgICAgICAgICBNYXRoLm1heCh0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQsIG1lbW9SZWMucmlnaHRtb3N0RmFpbHVyZU9mZnNldCk7XG4gICAgICAgIHJldHVybiBtZW1vUmVjO1xuICAgIH0sXG4gICAgY2xlYXJPYnNvbGV0ZUVudHJpZXM6IGZ1bmN0aW9uIChwb3MsIGludmFsaWRhdGVkSWR4KSB7XG4gICAgICAgIGlmIChwb3MgKyB0aGlzLm1heEV4YW1pbmVkTGVuZ3RoIDw9IGludmFsaWRhdGVkSWR4KSB7XG4gICAgICAgICAgICAvLyBPcHRpbWl6YXRpb246IG5vbmUgb2YgdGhlIHJ1bGUgYXBwbGljYXRpb25zIHRoYXQgd2VyZSBtZW1vaXplZCBoZXJlIGV4YW1pbmVkIHRoZVxuICAgICAgICAgICAgLy8gaW50ZXJ2YWwgb2YgdGhlIGlucHV0IHRoYXQgY2hhbmdlZCwgc28gbm90aGluZyBoYXMgdG8gYmUgaW52YWxpZGF0ZWQuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG1lbW8gPSB0aGlzLm1lbW87XG4gICAgICAgIHRoaXMubWF4RXhhbWluZWRMZW5ndGggPSAwO1xuICAgICAgICB0aGlzLm1heFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQgPSAtMTtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBPYmplY3Qua2V5cyhtZW1vKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICAgICAgICB2YXIgbWVtb1JlYyA9IG1lbW9ba107XG4gICAgICAgICAgICBpZiAocG9zICsgbWVtb1JlYy5leGFtaW5lZExlbmd0aCA+IGludmFsaWRhdGVkSWR4KSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG1lbW9ba107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxmLm1heEV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgoc2VsZi5tYXhFeGFtaW5lZExlbmd0aCwgbWVtb1JlYy5leGFtaW5lZExlbmd0aCk7XG4gICAgICAgICAgICAgICAgc2VsZi5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID1cbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoc2VsZi5tYXhSaWdodG1vc3RGYWlsdXJlT2Zmc2V0LCBtZW1vUmVjLnJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFBvc0luZm87XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG52YXIgSW5wdXRTdHJlYW0gPSByZXF1aXJlKCcuL0lucHV0U3RyZWFtJyk7XG52YXIgSXRlcmF0aW9uTm9kZSA9IHJlcXVpcmUoJy4vbm9kZXMnKS5JdGVyYXRpb25Ob2RlO1xudmFyIE1hdGNoUmVzdWx0ID0gcmVxdWlyZSgnLi9NYXRjaFJlc3VsdCcpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBnbG9iYWxBY3Rpb25TdGFjayA9IFtdO1xudmFyIHByb3RvdHlwZUdyYW1tYXI7XG52YXIgcHJvdG90eXBlR3JhbW1hclNlbWFudGljcztcbi8vIEpTT04gaXMgbm90IGEgdmFsaWQgc3Vic2V0IG9mIEphdmFTY3JpcHQgYmVjYXVzZSB0aGVyZSBhcmUgdHdvIHBvc3NpYmxlIGxpbmUgdGVybWluYXRvcnMsXG4vLyBVKzIwMjggKGxpbmUgc2VwYXJhdG9yKSBhbmQgVSsyMDI5IChwYXJhZ3JhcGggc2VwYXJhdG9yKSB0aGF0IGFyZSBhbGxvd2VkIGluIEpTT04gc3RyaW5nc1xuLy8gYnV0IG5vdCBpbiBKYXZhU2NyaXB0IHN0cmluZ3MuXG4vLyBqc29uVG9KUygpIHByb3Blcmx5IGVuY29kZXMgdGhvc2UgdHdvIGNoYXJhY3RlcnMgaW4gSlNPTiBzbyB0aGF0IGl0IGNhbiBzZWFtbGVzc2x5IGJlXG4vLyBpbnNlcnRlZCBpbnRvIEphdmFTY3JpcHQgY29kZSAocGx1cyB0aGUgZW5jb2RlZCB2ZXJzaW9uIGlzIHN0aWxsIHZhbGlkIEpTT04pXG5mdW5jdGlvbiBqc29uVG9KUyhzdHIpIHtcbiAgICB2YXIgb3V0cHV0ID0gc3RyLnJlcGxhY2UoL1tcXHUyMDI4XFx1MjAyOV0vZywgZnVuY3Rpb24gKGNoYXIsIHBvcywgc3RyKSB7XG4gICAgICAgIHZhciBoZXggPSBjaGFyLmNvZGVQb2ludEF0KDApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgcmV0dXJuICdcXFxcdScgKyAnMDAwMCcuc2xpY2UoaGV4Lmxlbmd0aCkgKyBoZXg7XG4gICAgfSk7XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIFdyYXBwZXJzIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBXcmFwcGVycyBkZWNvcmF0ZSBDU1Qgbm9kZXMgd2l0aCBhbGwgb2YgdGhlIGZ1bmN0aW9uYWxpdHkgKGkuZS4sIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMpXG4vLyBwcm92aWRlZCBieSBhIFNlbWFudGljcyAoc2VlIGJlbG93KS4gYFdyYXBwZXJgIGlzIHRoZSBhYnN0cmFjdCBzdXBlcmNsYXNzIG9mIGFsbCB3cmFwcGVycy4gQVxuLy8gYFdyYXBwZXJgIG11c3QgaGF2ZSBgX25vZGVgIGFuZCBgX3NlbWFudGljc2AgaW5zdGFuY2UgdmFyaWFibGVzLCB3aGljaCByZWZlciB0byB0aGUgQ1NUIG5vZGUgYW5kXG4vLyBTZW1hbnRpY3MgKHJlc3AuKSBmb3Igd2hpY2ggaXQgd2FzIGNyZWF0ZWQsIGFuZCBhIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUgd2hpY2ggaXNcbi8vIHVzZWQgdG8gY2FjaGUgdGhlIHdyYXBwZXIgaW5zdGFuY2VzIHRoYXQgYXJlIGNyZWF0ZWQgZm9yIGl0cyBjaGlsZCBub2Rlcy4gU2V0dGluZyB0aGVzZSBpbnN0YW5jZVxuLy8gdmFyaWFibGVzIGlzIHRoZSByZXNwb25zaWJpbGl0eSBvZiB0aGUgY29uc3RydWN0b3Igb2YgZWFjaCBTZW1hbnRpY3Mtc3BlY2lmaWMgc3ViY2xhc3Mgb2Zcbi8vIGBXcmFwcGVyYC5cbmZ1bmN0aW9uIFdyYXBwZXIoKSB7IH1cbldyYXBwZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnW3NlbWFudGljcyB3cmFwcGVyIGZvciAnICsgdGhpcy5fbm9kZS5ncmFtbWFyLm5hbWUgKyAnXSc7XG59O1xuLy8gVGhpcyBpcyB1c2VkIGJ5IG9obSBlZGl0b3IgdG8gZGlzcGxheSBhIG5vZGUgd3JhcHBlciBhcHByb3ByaWF0ZWx5LlxuV3JhcHBlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG59O1xuV3JhcHBlci5wcm90b3R5cGUuX2ZvcmdldE1lbW9pemVkUmVzdWx0Rm9yID0gZnVuY3Rpb24gKGF0dHJpYnV0ZU5hbWUpIHtcbiAgICAvLyBSZW1vdmUgdGhlIG1lbW9pemVkIGF0dHJpYnV0ZSBmcm9tIHRoZSBjc3ROb2RlIGFuZCBhbGwgaXRzIGNoaWxkcmVuLlxuICAgIGRlbGV0ZSB0aGlzLl9ub2RlW3RoaXMuX3NlbWFudGljcy5hdHRyaWJ1dGVLZXlzW2F0dHJpYnV0ZU5hbWVdXTtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLl9mb3JnZXRNZW1vaXplZFJlc3VsdEZvcihhdHRyaWJ1dGVOYW1lKTtcbiAgICB9KTtcbn07XG4vLyBSZXR1cm5zIHRoZSB3cmFwcGVyIG9mIHRoZSBzcGVjaWZpZWQgY2hpbGQgbm9kZS4gQ2hpbGQgd3JhcHBlcnMgYXJlIGNyZWF0ZWQgbGF6aWx5IGFuZCBjYWNoZWQgaW5cbi8vIHRoZSBwYXJlbnQgd3JhcHBlcidzIGBfY2hpbGRXcmFwcGVyc2AgaW5zdGFuY2UgdmFyaWFibGUuXG5XcmFwcGVyLnByb3RvdHlwZS5jaGlsZCA9IGZ1bmN0aW9uIChpZHgpIHtcbiAgICBpZiAoISgwIDw9IGlkeCAmJiBpZHggPCB0aGlzLl9ub2RlLm51bUNoaWxkcmVuKCkpKSB7XG4gICAgICAgIC8vIFRPRE86IENvbnNpZGVyIHRocm93aW5nIGFuIGV4Y2VwdGlvbiBoZXJlLlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB2YXIgY2hpbGRXcmFwcGVyID0gdGhpcy5fY2hpbGRXcmFwcGVyc1tpZHhdO1xuICAgIGlmICghY2hpbGRXcmFwcGVyKSB7XG4gICAgICAgIHZhciBjaGlsZE5vZGUgPSB0aGlzLl9ub2RlLmNoaWxkQXQoaWR4KTtcbiAgICAgICAgdmFyIG9mZnNldCA9IHRoaXMuX25vZGUuY2hpbGRPZmZzZXRzW2lkeF07XG4gICAgICAgIHZhciBzb3VyY2UgPSB0aGlzLl9iYXNlSW50ZXJ2YWwuc3ViSW50ZXJ2YWwob2Zmc2V0LCBjaGlsZE5vZGUubWF0Y2hMZW5ndGgpO1xuICAgICAgICB2YXIgYmFzZSA9IGNoaWxkTm9kZS5pc05vbnRlcm1pbmFsKCkgPyBzb3VyY2UgOiB0aGlzLl9iYXNlSW50ZXJ2YWw7XG4gICAgICAgIGNoaWxkV3JhcHBlciA9IHRoaXMuX2NoaWxkV3JhcHBlcnNbaWR4XSA9IHRoaXMuX3NlbWFudGljcy53cmFwKGNoaWxkTm9kZSwgc291cmNlLCBiYXNlKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoaWxkV3JhcHBlcjtcbn07XG4vLyBSZXR1cm5zIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIHdyYXBwZXJzIG9mIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXNcbi8vIHdyYXBwZXIuXG5XcmFwcGVyLnByb3RvdHlwZS5fY2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gRm9yY2UgdGhlIGNyZWF0aW9uIG9mIGFsbCBjaGlsZCB3cmFwcGVyc1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgaWR4KyspIHtcbiAgICAgICAgdGhpcy5jaGlsZChpZHgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY2hpbGRXcmFwcGVycztcbn07XG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBjb3JyZXNwb25kcyB0byBhbiBpdGVyYXRpb25cbi8vIGV4cHJlc3Npb24sIGkuZS4sIGEgS2xlZW5lLSosIEtsZWVuZS0rLCBvciBhbiBvcHRpb25hbC4gUmV0dXJucyBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlLmlzSXRlcmF0aW9uKCk7XG59O1xuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSB0ZXJtaW5hbCBub2RlLCBgZmFsc2VgXG4vLyBvdGhlcndpc2UuXG5XcmFwcGVyLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9ub2RlLmlzVGVybWluYWwoKTtcbn07XG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhIG5vbnRlcm1pbmFsIG5vZGUsIGBmYWxzZWBcbi8vIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzTm9udGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX25vZGUuaXNOb250ZXJtaW5hbCgpO1xufTtcbi8vIFJldHVybnMgYHRydWVgIGlmIHRoZSBDU1Qgbm9kZSBhc3NvY2lhdGVkIHdpdGggdGhpcyB3cmFwcGVyIGlzIGEgbm9udGVybWluYWwgbm9kZVxuLy8gY29ycmVzcG9uZGluZyB0byBhIHN5bnRhY3RpYyBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmlzTm9udGVybWluYWwoKSAmJiB0aGlzLl9ub2RlLmlzU3ludGFjdGljKCk7XG59O1xuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIENTVCBub2RlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHdyYXBwZXIgaXMgYSBub250ZXJtaW5hbCBub2RlXG4vLyBjb3JyZXNwb25kaW5nIHRvIGEgbGV4aWNhbCBydWxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbldyYXBwZXIucHJvdG90eXBlLmlzTGV4aWNhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pc05vbnRlcm1pbmFsKCkgJiYgdGhpcy5fbm9kZS5pc0xleGljYWwoKTtcbn07XG4vLyBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgd3JhcHBlciBpcyBhbiBpdGVyYXRvciBub2RlXG4vLyBoYXZpbmcgZWl0aGVyIG9uZSBvciBubyBjaGlsZCAoPyBvcGVyYXRvciksIGBmYWxzZWAgb3RoZXJ3aXNlLlxuLy8gT3RoZXJ3aXNlLCB0aHJvd3MgYW4gZXhjZXB0aW9uLlxuV3JhcHBlci5wcm90b3R5cGUuaXNPcHRpb25hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbm9kZS5pc09wdGlvbmFsKCk7XG59O1xuLy8gQ3JlYXRlIGEgbmV3IF9pdGVyIHdyYXBwZXIgaW4gdGhlIHNhbWUgc2VtYW50aWNzIGFzIHRoaXMgd3JhcHBlci5cbldyYXBwZXIucHJvdG90eXBlLml0ZXJhdGlvbiA9IGZ1bmN0aW9uIChvcHRDaGlsZFdyYXBwZXJzKSB7XG4gICAgdmFyIGNoaWxkV3JhcHBlcnMgPSBvcHRDaGlsZFdyYXBwZXJzIHx8IFtdO1xuICAgIHZhciBjaGlsZE5vZGVzID0gY2hpbGRXcmFwcGVycy5tYXAoZnVuY3Rpb24gKGMpIHsgcmV0dXJuIGMuX25vZGU7IH0pO1xuICAgIHZhciBpdGVyID0gbmV3IEl0ZXJhdGlvbk5vZGUodGhpcy5fbm9kZS5ncmFtbWFyLCBjaGlsZE5vZGVzLCBbXSwgLTEsIGZhbHNlKTtcbiAgICB2YXIgd3JhcHBlciA9IHRoaXMuX3NlbWFudGljcy53cmFwKGl0ZXIsIG51bGwsIG51bGwpO1xuICAgIHdyYXBwZXIuX2NoaWxkV3JhcHBlcnMgPSBjaGlsZFdyYXBwZXJzO1xuICAgIHJldHVybiB3cmFwcGVyO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKFdyYXBwZXIucHJvdG90eXBlLCB7XG4gICAgLy8gUmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBjaGlsZHJlbiBvZiB0aGlzIENTVCBub2RlLlxuICAgIGNoaWxkcmVuOiB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fY2hpbGRyZW4oKTsgfSB9LFxuICAgIC8vIFJldHVybnMgdGhlIG5hbWUgb2YgZ3JhbW1hciBydWxlIHRoYXQgY3JlYXRlZCB0aGlzIENTVCBub2RlLlxuICAgIGN0b3JOYW1lOiB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fbm9kZS5jdG9yTmFtZTsgfSB9LFxuICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkgKGRlcHJlY2F0ZWQgaW4gdjAuMTIpLlxuICAgIGludGVydmFsOiB7IGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgYGludGVydmFsYCBwcm9wZXJ0eSBpcyBkZXByZWNhdGVkIC0tIHVzZSBgc291cmNlYCBpbnN0ZWFkJyk7XG4gICAgICAgIH0gfSxcbiAgICAvLyBSZXR1cm5zIHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gb2YgdGhpcyBDU1Qgbm9kZS5cbiAgICBudW1DaGlsZHJlbjogeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX25vZGUubnVtQ2hpbGRyZW4oKTsgfSB9LFxuICAgIC8vIFJldHVybnMgdGhlIHByaW1pdGl2ZSB2YWx1ZSBvZiB0aGlzIENTVCBub2RlLCBpZiBpdCdzIGEgdGVybWluYWwgbm9kZS4gT3RoZXJ3aXNlLFxuICAgIC8vIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgcHJpbWl0aXZlVmFsdWU6IHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc1Rlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbm9kZS5wcmltaXRpdmVWYWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ0cmllZCB0byBhY2Nlc3MgdGhlICdwcmltaXRpdmVWYWx1ZScgYXR0cmlidXRlIG9mIGEgbm9uLXRlcm1pbmFsIENTVCBub2RlXCIpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICAvLyBSZXR1cm5zIHRoZSBjb250ZW50cyBvZiB0aGUgaW5wdXQgc3RyZWFtIGNvbnN1bWVkIGJ5IHRoaXMgQ1NUIG5vZGUuXG4gICAgc291cmNlU3RyaW5nOiB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5zb3VyY2UuY29udGVudHM7IH0gfVxufSk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBTZW1hbnRpY3MgLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEEgU2VtYW50aWNzIGlzIGEgY29udGFpbmVyIGZvciBhIGZhbWlseSBvZiBPcGVyYXRpb25zIGFuZCBBdHRyaWJ1dGVzIGZvciBhIGdpdmVuIGdyYW1tYXIuXG4vLyBTZW1hbnRpY3MgZW5hYmxlIG1vZHVsYXJpdHkgKGRpZmZlcmVudCBjbGllbnRzIG9mIGEgZ3JhbW1hciBjYW4gY3JlYXRlIHRoZWlyIHNldCBvZiBvcGVyYXRpb25zXG4vLyBhbmQgYXR0cmlidXRlcyBpbiBpc29sYXRpb24pIGFuZCBleHRlbnNpYmlsaXR5IGV2ZW4gd2hlbiBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGFyZSBtdXR1YWxseS1cbi8vIHJlY3Vyc2l2ZS4gVGhpcyBjb25zdHJ1Y3RvciBzaG91bGQgbm90IGJlIGNhbGxlZCBkaXJlY3RseSBleGNlcHQgZnJvbVxuLy8gYFNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3NgLiBUaGUgbm9ybWFsIHdheXMgdG8gY3JlYXRlIGEgU2VtYW50aWNzLCBnaXZlbiBhIGdyYW1tYXIgJ2cnLCBhcmVcbi8vIGBnLmNyZWF0ZVNlbWFudGljcygpYCBhbmQgYGcuZXh0ZW5kU2VtYW50aWNzKHBhcmVudFNlbWFudGljcylgLlxuZnVuY3Rpb24gU2VtYW50aWNzKGdyYW1tYXIsIHN1cGVyU2VtYW50aWNzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuZ3JhbW1hciA9IGdyYW1tYXI7XG4gICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSBmYWxzZTtcbiAgICAvLyBDb25zdHJ1Y3RvciBmb3Igd3JhcHBlciBpbnN0YW5jZXMsIHdoaWNoIGFyZSBwYXNzZWQgYXMgdGhlIGFyZ3VtZW50cyB0byB0aGUgc2VtYW50aWMgYWN0aW9uc1xuICAgIC8vIG9mIGFuIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUuIE9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgcmVxdWlyZSBkb3VibGUgZGlzcGF0Y2g6IHRoZSBzZW1hbnRpY1xuICAgIC8vIGFjdGlvbiBpcyBjaG9zZW4gYmFzZWQgb24gYm90aCB0aGUgbm9kZSdzIHR5cGUgYW5kIHRoZSBzZW1hbnRpY3MuIFdyYXBwZXJzIGVuc3VyZSB0aGF0XG4gICAgLy8gdGhlIGBleGVjdXRlYCBtZXRob2QgaXMgY2FsbGVkIHdpdGggdGhlIGNvcnJlY3QgKG1vc3Qgc3BlY2lmaWMpIHNlbWFudGljcyBvYmplY3QgYXMgYW5cbiAgICAvLyBhcmd1bWVudC5cbiAgICB0aGlzLldyYXBwZXIgPSBmdW5jdGlvbiAobm9kZSwgc291cmNlSW50ZXJ2YWwsIGJhc2VJbnRlcnZhbCkge1xuICAgICAgICBzZWxmLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkoKTtcbiAgICAgICAgdGhpcy5fc2VtYW50aWNzID0gc2VsZjtcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGU7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlSW50ZXJ2YWw7XG4gICAgICAgIC8vIFRoZSBpbnRlcnZhbCB0aGF0IHRoZSBjaGlsZE9mZnNldHMgb2YgYG5vZGVgIGFyZSByZWxhdGl2ZSB0by4gSXQgc2hvdWxkIGJlIHRoZSBzb3VyY2VcbiAgICAgICAgLy8gb2YgdGhlIGNsb3Nlc3QgTm9udGVybWluYWwgbm9kZS5cbiAgICAgICAgdGhpcy5fYmFzZUludGVydmFsID0gYmFzZUludGVydmFsO1xuICAgICAgICBpZiAobm9kZS5pc05vbnRlcm1pbmFsKCkpIHtcbiAgICAgICAgICAgIGNvbW1vbi5hc3NlcnQoc291cmNlSW50ZXJ2YWwgPT09IGJhc2VJbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY2hpbGRXcmFwcGVycyA9IFtdO1xuICAgIH07XG4gICAgdGhpcy5zdXBlciA9IHN1cGVyU2VtYW50aWNzO1xuICAgIGlmIChzdXBlclNlbWFudGljcykge1xuICAgICAgICBpZiAoIShncmFtbWFyLmVxdWFscyh0aGlzLnN1cGVyLmdyYW1tYXIpIHx8IGdyYW1tYXIuX2luaGVyaXRzRnJvbSh0aGlzLnN1cGVyLmdyYW1tYXIpKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGV4dGVuZCBhIHNlbWFudGljcyBmb3IgZ3JhbW1hciAnXCIgKyB0aGlzLnN1cGVyLmdyYW1tYXIubmFtZSArXG4gICAgICAgICAgICAgICAgXCInIGZvciB1c2Ugd2l0aCBncmFtbWFyICdcIiArIGdyYW1tYXIubmFtZSArIFwiJyAobm90IGEgc3ViLWdyYW1tYXIpXCIpO1xuICAgICAgICB9XG4gICAgICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgdGhpcy5zdXBlci5XcmFwcGVyKTtcbiAgICAgICAgdGhpcy5vcGVyYXRpb25zID0gT2JqZWN0LmNyZWF0ZSh0aGlzLnN1cGVyLm9wZXJhdGlvbnMpO1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXMgPSBPYmplY3QuY3JlYXRlKHRoaXMuc3VwZXIuYXR0cmlidXRlcyk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIC8vIEFzc2lnbiB1bmlxdWUgc3ltYm9scyBmb3IgZWFjaCBvZiB0aGUgYXR0cmlidXRlcyBpbmhlcml0ZWQgZnJvbSB0aGUgc3VwZXItc2VtYW50aWNzIHNvIHRoYXRcbiAgICAgICAgLy8gdGhleSBhcmUgbWVtb2l6ZWQgaW5kZXBlbmRlbnRseS5cbiAgICAgICAgZm9yICh2YXIgYXR0cmlidXRlTmFtZSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLmF0dHJpYnV0ZUtleXMsIGF0dHJpYnV0ZU5hbWUsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogdXRpbC51bmlxdWVJZChhdHRyaWJ1dGVOYW1lKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGluaGVyaXRzKHRoaXMuV3JhcHBlciwgV3JhcHBlcik7XG4gICAgICAgIHRoaXMub3BlcmF0aW9ucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlS2V5cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgfVxufVxuU2VtYW50aWNzLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ1tzZW1hbnRpY3MgZm9yICcgKyB0aGlzLmdyYW1tYXIubmFtZSArICddJztcbn07XG5TZW1hbnRpY3MucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdHNJZkhhdmVudEFscmVhZHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmNoZWNrZWRBY3Rpb25EaWN0cykge1xuICAgICAgICB0aGlzLmNoZWNrQWN0aW9uRGljdHMoKTtcbiAgICAgICAgdGhpcy5jaGVja2VkQWN0aW9uRGljdHMgPSB0cnVlO1xuICAgIH1cbn07XG4vLyBDaGVja3MgdGhhdCB0aGUgYWN0aW9uIGRpY3Rpb25hcmllcyBmb3IgYWxsIG9wZXJhdGlvbnMgYW5kIGF0dHJpYnV0ZXMgaW4gdGhpcyBzZW1hbnRpY3MsXG4vLyBpbmNsdWRpbmcgdGhlIG9uZXMgdGhhdCB3ZXJlIGluaGVyaXRlZCBmcm9tIHRoZSBzdXBlci1zZW1hbnRpY3MsIGFncmVlIHdpdGggdGhlIGdyYW1tYXIuXG4vLyBUaHJvd3MgYW4gZXhjZXB0aW9uIGlmIG9uZSBvciBtb3JlIG9mIHRoZW0gZG9lc24ndC5cblNlbWFudGljcy5wcm90b3R5cGUuY2hlY2tBY3Rpb25EaWN0cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbmFtZTtcbiAgICBmb3IgKG5hbWUgaW4gdGhpcy5vcGVyYXRpb25zKSB7XG4gICAgICAgIHRoaXMub3BlcmF0aW9uc1tuYW1lXS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgICB9XG4gICAgZm9yIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgICB0aGlzLmF0dHJpYnV0ZXNbbmFtZV0uY2hlY2tBY3Rpb25EaWN0KHRoaXMuZ3JhbW1hcik7XG4gICAgfVxufTtcblNlbWFudGljcy5wcm90b3R5cGUudG9SZWNpcGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzT25seSkge1xuICAgIGZ1bmN0aW9uIGhhc1N1cGVyU2VtYW50aWNzKHMpIHtcbiAgICAgICAgcmV0dXJuIHMuc3VwZXIgIT09IFNlbWFudGljcy5CdWlsdEluU2VtYW50aWNzLl9nZXRTZW1hbnRpY3MoKTtcbiAgICB9XG4gICAgdmFyIHN0ciA9ICcoZnVuY3Rpb24oZykge1xcbic7XG4gICAgaWYgKGhhc1N1cGVyU2VtYW50aWNzKHRoaXMpKSB7XG4gICAgICAgIHN0ciArPSAnICB2YXIgc2VtYW50aWNzID0gJyArIHRoaXMuc3VwZXIudG9SZWNpcGUodHJ1ZSkgKyAnKGcnO1xuICAgICAgICB2YXIgc3VwZXJTZW1hbnRpY3NHcmFtbWFyID0gdGhpcy5zdXBlci5ncmFtbWFyO1xuICAgICAgICB2YXIgcmVsYXRlZEdyYW1tYXIgPSB0aGlzLmdyYW1tYXI7XG4gICAgICAgIHdoaWxlIChyZWxhdGVkR3JhbW1hciAhPT0gc3VwZXJTZW1hbnRpY3NHcmFtbWFyKSB7XG4gICAgICAgICAgICBzdHIgKz0gJy5zdXBlckdyYW1tYXInO1xuICAgICAgICAgICAgcmVsYXRlZEdyYW1tYXIgPSByZWxhdGVkR3JhbW1hci5zdXBlckdyYW1tYXI7XG4gICAgICAgIH1cbiAgICAgICAgc3RyICs9ICcpO1xcbic7XG4gICAgICAgIHN0ciArPSAnICByZXR1cm4gZy5leHRlbmRTZW1hbnRpY3Moc2VtYW50aWNzKSc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdHIgKz0gJyAgcmV0dXJuIGcuY3JlYXRlU2VtYW50aWNzKCknO1xuICAgIH1cbiAgICBbJ09wZXJhdGlvbicsICdBdHRyaWJ1dGUnXS5mb3JFYWNoKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIHZhciBzZW1hbnRpY09wZXJhdGlvbnMgPSB0aGlzW3R5cGUudG9Mb3dlckNhc2UoKSArICdzJ107XG4gICAgICAgIE9iamVjdC5rZXlzKHNlbWFudGljT3BlcmF0aW9ucykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgdmFyIHNpZ25hdHVyZSA9IG5hbWU7XG4gICAgICAgICAgICBpZiAoc2VtYW50aWNPcGVyYXRpb25zW25hbWVdLmZvcm1hbHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIHNpZ25hdHVyZSArPSAnKCcgKyBzZW1hbnRpY09wZXJhdGlvbnNbbmFtZV0uZm9ybWFscy5qb2luKCcsICcpICsgJyknO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIG1ldGhvZDtcbiAgICAgICAgICAgIGlmIChoYXNTdXBlclNlbWFudGljcyh0aGlzKSAmJiB0aGlzLnN1cGVyW3R5cGUudG9Mb3dlckNhc2UoKSArICdzJ11bbmFtZV0pIHtcbiAgICAgICAgICAgICAgICBtZXRob2QgPSAnZXh0ZW5kJyArIHR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBtZXRob2QgPSAnYWRkJyArIHR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdHIgKz0gJ1xcbiAgICAuJyArIG1ldGhvZCArICcoJyArIEpTT04uc3RyaW5naWZ5KHNpZ25hdHVyZSkgKyAnLCB7JztcbiAgICAgICAgICAgIHZhciBhY3Rpb25zID0gc2VtYW50aWNPcGVyYXRpb25zW25hbWVdLmFjdGlvbkRpY3Q7XG4gICAgICAgICAgICB2YXIgc3JjQXJyYXkgPSBbXTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLmZvckVhY2goZnVuY3Rpb24gKGFjdGlvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VtYW50aWNPcGVyYXRpb25zW25hbWVdLmJ1aWx0SW5EZWZhdWx0ICE9PSBhY3Rpb25zW2FjdGlvbk5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgIHNyY0FycmF5LnB1c2goJ1xcbiAgICAgICcgKyBKU09OLnN0cmluZ2lmeShhY3Rpb25OYW1lKSArICc6ICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uc1thY3Rpb25OYW1lXS50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHN0ciArPSBzcmNBcnJheS5qb2luKCcsJyk7XG4gICAgICAgICAgICBzdHIgKz0gJ1xcbiAgICB9KSc7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH0sIHRoaXMpO1xuICAgIHN0ciArPSAnO1xcbiAgfSknO1xuICAgIGlmICghc2VtYW50aWNzT25seSkge1xuICAgICAgICBzdHIgPVxuICAgICAgICAgICAgJyhmdW5jdGlvbigpIHtcXG4nICtcbiAgICAgICAgICAgICAgICAnICB2YXIgZ3JhbW1hciA9IHRoaXMuZnJvbVJlY2lwZSgnICsganNvblRvSlModGhpcy5ncmFtbWFyLnRvUmVjaXBlKCkpICsgJyk7XFxuJyArXG4gICAgICAgICAgICAgICAgJyAgdmFyIHNlbWFudGljcyA9ICcgKyBzdHIgKyAnKGdyYW1tYXIpO1xcbicgK1xuICAgICAgICAgICAgICAgICcgIHJldHVybiBzZW1hbnRpY3M7XFxuJyArXG4gICAgICAgICAgICAgICAgJ30pO1xcbic7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59O1xuZnVuY3Rpb24gcGFyc2VTaWduYXR1cmUoc2lnbmF0dXJlLCB0eXBlKSB7XG4gICAgaWYgKCFwcm90b3R5cGVHcmFtbWFyKSB7XG4gICAgICAgIC8vIFRoZSBPcGVyYXRpb25zIGFuZCBBdHRyaWJ1dGVzIGdyYW1tYXIgd29uJ3QgYmUgYXZhaWxhYmxlIHdoaWxlIE9obSBpcyBsb2FkaW5nLFxuICAgICAgICAvLyBidXQgd2UgY2FuIGdldCBhd2F5IHRoZSBmb2xsb3dpbmcgc2ltcGxpZmljYXRpb24gYi9jIG5vbmUgb2YgdGhlIG9wZXJhdGlvbnNcbiAgICAgICAgLy8gdGhhdCBhcmUgdXNlZCB3aGlsZSBsb2FkaW5nIHRha2UgYXJndW1lbnRzLlxuICAgICAgICBjb21tb24uYXNzZXJ0KHNpZ25hdHVyZS5pbmRleE9mKCcoJykgPT09IC0xKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IHNpZ25hdHVyZSxcbiAgICAgICAgICAgIGZvcm1hbHM6IFtdXG4gICAgICAgIH07XG4gICAgfVxuICAgIHZhciByID0gcHJvdG90eXBlR3JhbW1hci5tYXRjaChzaWduYXR1cmUsIHR5cGUgPT09ICdvcGVyYXRpb24nID8gJ09wZXJhdGlvblNpZ25hdHVyZScgOiAnQXR0cmlidXRlU2lnbmF0dXJlJyk7XG4gICAgaWYgKHIuZmFpbGVkKCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHIubWVzc2FnZSk7XG4gICAgfVxuICAgIHJldHVybiBwcm90b3R5cGVHcmFtbWFyU2VtYW50aWNzKHIpLnBhcnNlKCk7XG59XG5mdW5jdGlvbiBuZXdEZWZhdWx0QWN0aW9uKHR5cGUsIG5hbWUsIGRvSXQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgdmFyIHRoaXNUaGluZyA9IHRoaXMuX3NlbWFudGljcy5vcGVyYXRpb25zW25hbWVdIHx8IHRoaXMuX3NlbWFudGljcy5hdHRyaWJ1dGVzW25hbWVdO1xuICAgICAgICB2YXIgYXJncyA9IHRoaXNUaGluZy5mb3JtYWxzLm1hcChmdW5jdGlvbiAoZm9ybWFsKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi5hcmdzW2Zvcm1hbF07XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5pc0l0ZXJhdGlvbigpKSB7XG4gICAgICAgICAgICAvLyBUaGlzIENTVCBub2RlIGNvcnJlc3BvbmRzIHRvIGFuIGl0ZXJhdGlvbiBleHByZXNzaW9uIGluIHRoZSBncmFtbWFyICgqLCArLCBvciA/KS4gVGhlXG4gICAgICAgICAgICAvLyBkZWZhdWx0IGJlaGF2aW9yIGlzIHRvIG1hcCB0aGlzIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgb3ZlciBhbGwgb2YgaXRzIGNoaWxkIG5vZGVzLlxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuLm1hcChmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIGRvSXQuYXBwbHkoY2hpbGQsIGFyZ3MpOyB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIENTVCBub2RlIGNvcnJlc3BvbmRzIHRvIGEgbm9uLXRlcm1pbmFsIGluIHRoZSBncmFtbWFyIChlLmcuLCBBZGRFeHByKS4gVGhlIGZhY3QgdGhhdFxuICAgICAgICAvLyB3ZSBnb3QgaGVyZSBtZWFucyB0aGF0IHRoaXMgYWN0aW9uIGRpY3Rpb25hcnkgZG9lc24ndCBoYXZlIGFuIGFjdGlvbiBmb3IgdGhpcyBwYXJ0aWN1bGFyXG4gICAgICAgIC8vIG5vbi10ZXJtaW5hbCBvciBhIGdlbmVyaWMgYF9ub250ZXJtaW5hbGAgYWN0aW9uLlxuICAgICAgICBpZiAoY2hpbGRyZW4ubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAvLyBBcyBhIGNvbnZlbmllbmNlLCBpZiB0aGlzIG5vZGUgb25seSBoYXMgb25lIGNoaWxkLCB3ZSBqdXN0IHJldHVybiB0aGUgcmVzdWx0IG9mXG4gICAgICAgICAgICAvLyBhcHBseWluZyB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICAgIHJldHVybiBkb0l0LmFwcGx5KGNoaWxkcmVuWzBdLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgd2UgdGhyb3cgYW4gZXhjZXB0aW9uIHRvIGxldCB0aGUgcHJvZ3JhbW1lciBrbm93IHRoYXQgd2UgZG9uJ3Qga25vdyB3aGF0XG4gICAgICAgICAgICAvLyB0byBkbyB3aXRoIHRoaXMgbm9kZS5cbiAgICAgICAgICAgIHRocm93IGVycm9ycy5taXNzaW5nU2VtYW50aWNBY3Rpb24odGhpcy5jdG9yTmFtZSwgbmFtZSwgdHlwZSwgZ2xvYmFsQWN0aW9uU3RhY2spO1xuICAgICAgICB9XG4gICAgfTtcbn1cblNlbWFudGljcy5wcm90b3R5cGUuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUgPSBmdW5jdGlvbiAodHlwZSwgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHR5cGVQbHVyYWwgPSB0eXBlICsgJ3MnO1xuICAgIHZhciBwYXJzZWROYW1lQW5kRm9ybWFsQXJncyA9IHBhcnNlU2lnbmF0dXJlKHNpZ25hdHVyZSwgdHlwZSk7XG4gICAgdmFyIG5hbWUgPSBwYXJzZWROYW1lQW5kRm9ybWFsQXJncy5uYW1lO1xuICAgIHZhciBmb3JtYWxzID0gcGFyc2VkTmFtZUFuZEZvcm1hbEFyZ3MuZm9ybWFscztcbiAgICAvLyBUT0RPOiBjaGVjayB0aGF0IHRoZXJlIGFyZSBubyBkdXBsaWNhdGUgZm9ybWFsIGFyZ3VtZW50c1xuICAgIHRoaXMuYXNzZXJ0TmV3TmFtZShuYW1lLCB0eXBlKTtcbiAgICAvLyBDcmVhdGUgdGhlIGFjdGlvbiBkaWN0aW9uYXJ5IGZvciB0aGlzIG9wZXJhdGlvbiAvIGF0dHJpYnV0ZSB0aGF0IGNvbnRhaW5zIGEgYF9kZWZhdWx0YCBhY3Rpb25cbiAgICAvLyB3aGljaCBkZWZpbmVzIHRoZSBkZWZhdWx0IGJlaGF2aW9yIG9mIGl0ZXJhdGlvbiwgdGVybWluYWwsIGFuZCBub24tdGVybWluYWwgbm9kZXMuLi5cbiAgICB2YXIgYnVpbHRJbkRlZmF1bHQgPSBuZXdEZWZhdWx0QWN0aW9uKHR5cGUsIG5hbWUsIGRvSXQpO1xuICAgIHZhciByZWFsQWN0aW9uRGljdCA9IHsgX2RlZmF1bHQ6IGJ1aWx0SW5EZWZhdWx0IH07XG4gICAgLy8gLi4uIGFuZCBhZGQgaW4gdGhlIGFjdGlvbnMgc3VwcGxpZWQgYnkgdGhlIHByb2dyYW1tZXIsIHdoaWNoIG1heSBvdmVycmlkZSBzb21lIG9yIGFsbCBvZiB0aGVcbiAgICAvLyBkZWZhdWx0IG9uZXMuXG4gICAgT2JqZWN0LmtleXMoYWN0aW9uRGljdCkuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICByZWFsQWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gICAgfSk7XG4gICAgdmFyIGVudHJ5ID0gdHlwZSA9PT0gJ29wZXJhdGlvbicgP1xuICAgICAgICBuZXcgT3BlcmF0aW9uKG5hbWUsIGZvcm1hbHMsIHJlYWxBY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCkgOlxuICAgICAgICBuZXcgQXR0cmlidXRlKG5hbWUsIHJlYWxBY3Rpb25EaWN0LCBidWlsdEluRGVmYXVsdCk7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAgIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgICBlbnRyeS5jaGVja0FjdGlvbkRpY3QodGhpcy5ncmFtbWFyKTtcbiAgICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdID0gZW50cnk7XG4gICAgZnVuY3Rpb24gZG9JdCgpIHtcbiAgICAgICAgLy8gRGlzcGF0Y2ggdG8gbW9zdCBzcGVjaWZpYyB2ZXJzaW9uIG9mIHRoaXMgb3BlcmF0aW9uIC8gYXR0cmlidXRlIC0tIGl0IG1heSBoYXZlIGJlZW5cbiAgICAgICAgLy8gb3ZlcnJpZGRlbiBieSBhIHN1Yi1zZW1hbnRpY3MuXG4gICAgICAgIHZhciB0aGlzVGhpbmcgPSB0aGlzLl9zZW1hbnRpY3NbdHlwZVBsdXJhbF1bbmFtZV07XG4gICAgICAgIC8vIENoZWNrIHRoYXQgdGhlIGNhbGxlciBwYXNzZWQgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cy5cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IHRoaXNUaGluZy5mb3JtYWxzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMgcGFzc2VkIHRvICcgKyBuYW1lICsgJyAnICsgdHlwZSArICcgKGV4cGVjdGVkICcgK1xuICAgICAgICAgICAgICAgIHRoaXNUaGluZy5mb3JtYWxzLmxlbmd0aCArICcsIGdvdCAnICsgYXJndW1lbnRzLmxlbmd0aCArICcpJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ3JlYXRlIGFuIFwiYXJndW1lbnRzIG9iamVjdFwiIGZyb20gdGhlIGFyZ3VtZW50cyB0aGF0IHdlcmUgcGFzc2VkIHRvIHRoaXNcbiAgICAgICAgLy8gb3BlcmF0aW9uIC8gYXR0cmlidXRlLlxuICAgICAgICB2YXIgYXJncyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGFyZ3VtZW50cy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgICB2YXIgZm9ybWFsID0gdGhpc1RoaW5nLmZvcm1hbHNbaWR4XTtcbiAgICAgICAgICAgIGFyZ3NbZm9ybWFsXSA9IGFyZ3VtZW50c1tpZHhdO1xuICAgICAgICB9XG4gICAgICAgIHZhciBvbGRBcmdzID0gdGhpcy5hcmdzO1xuICAgICAgICB0aGlzLmFyZ3MgPSBhcmdzO1xuICAgICAgICB2YXIgYW5zID0gdGhpc1RoaW5nLmV4ZWN1dGUodGhpcy5fc2VtYW50aWNzLCB0aGlzKTtcbiAgICAgICAgdGhpcy5hcmdzID0gb2xkQXJncztcbiAgICAgICAgcmV0dXJuIGFucztcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdvcGVyYXRpb24nKSB7XG4gICAgICAgIHRoaXMuV3JhcHBlci5wcm90b3R5cGVbbmFtZV0gPSBkb0l0O1xuICAgICAgICB0aGlzLldyYXBwZXIucHJvdG90eXBlW25hbWVdLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICdbJyArIG5hbWUgKyAnIG9wZXJhdGlvbl0nO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuV3JhcHBlci5wcm90b3R5cGUsIG5hbWUsIHtcbiAgICAgICAgICAgIGdldDogZG9JdCxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSAvLyBTbyB0aGUgcHJvcGVydHkgY2FuIGJlIGRlbGV0ZWQuXG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5hdHRyaWJ1dGVLZXlzLCBuYW1lLCB7XG4gICAgICAgICAgICB2YWx1ZTogdXRpbC51bmlxdWVJZChuYW1lKVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuU2VtYW50aWNzLnByb3RvdHlwZS5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgdmFyIHR5cGVQbHVyYWwgPSB0eXBlICsgJ3MnO1xuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IGBuYW1lYCByZWFsbHkgaXMganVzdCBhIG5hbWUsIGkuZS4sIHRoYXQgaXQgZG9lc24ndCBhbHNvIGNvbnRhaW4gZm9ybWFscy5cbiAgICBwYXJzZVNpZ25hdHVyZShuYW1lLCAnYXR0cmlidXRlJyk7XG4gICAgaWYgKCEodGhpcy5zdXBlciAmJiBuYW1lIGluIHRoaXMuc3VwZXJbdHlwZVBsdXJhbF0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgK1xuICAgICAgICAgICAgXCInOiBkaWQgbm90IGluaGVyaXQgYW4gXCIgKyB0eXBlICsgJyB3aXRoIHRoYXQgbmFtZScpO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXNbdHlwZVBsdXJhbF0sIG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGV4dGVuZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIicgYWdhaW5cIik7XG4gICAgfVxuICAgIC8vIENyZWF0ZSBhIG5ldyBvcGVyYXRpb24gLyBhdHRyaWJ1dGUgd2hvc2UgYWN0aW9uRGljdCBkZWxlZ2F0ZXMgdG8gdGhlIHN1cGVyIG9wZXJhdGlvbiAvXG4gICAgLy8gYXR0cmlidXRlJ3MgYWN0aW9uRGljdCwgYW5kIHdoaWNoIGhhcyBhbGwgdGhlIGtleXMgZnJvbSBgaW5oZXJpdGVkQWN0aW9uRGljdGAuXG4gICAgdmFyIGluaGVyaXRlZEZvcm1hbHMgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmZvcm1hbHM7XG4gICAgdmFyIGluaGVyaXRlZEFjdGlvbkRpY3QgPSB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmFjdGlvbkRpY3Q7XG4gICAgdmFyIG5ld0FjdGlvbkRpY3QgPSBPYmplY3QuY3JlYXRlKGluaGVyaXRlZEFjdGlvbkRpY3QpO1xuICAgIE9iamVjdC5rZXlzKGFjdGlvbkRpY3QpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgbmV3QWN0aW9uRGljdFtuYW1lXSA9IGFjdGlvbkRpY3RbbmFtZV07XG4gICAgfSk7XG4gICAgdGhpc1t0eXBlUGx1cmFsXVtuYW1lXSA9IHR5cGUgPT09ICdvcGVyYXRpb24nID9cbiAgICAgICAgbmV3IE9wZXJhdGlvbihuYW1lLCBpbmhlcml0ZWRGb3JtYWxzLCBuZXdBY3Rpb25EaWN0KSA6XG4gICAgICAgIG5ldyBBdHRyaWJ1dGUobmFtZSwgbmV3QWN0aW9uRGljdCk7XG4gICAgLy8gVGhlIGZvbGxvd2luZyBjaGVjayBpcyBub3Qgc3RyaWN0bHkgbmVjZXNzYXJ5IChpdCB3aWxsIGhhcHBlbiBsYXRlciBhbnl3YXkpIGJ1dCBpdCdzIGJldHRlciB0b1xuICAgIC8vIGNhdGNoIGVycm9ycyBlYXJseS5cbiAgICB0aGlzW3R5cGVQbHVyYWxdW25hbWVdLmNoZWNrQWN0aW9uRGljdCh0aGlzLmdyYW1tYXIpO1xufTtcblNlbWFudGljcy5wcm90b3R5cGUuYXNzZXJ0TmV3TmFtZSA9IGZ1bmN0aW9uIChuYW1lLCB0eXBlKSB7XG4gICAgaWYgKFdyYXBwZXIucHJvdG90eXBlLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCAnICsgdHlwZSArIFwiICdcIiArIG5hbWUgKyBcIic6IHRoYXQncyBhIHJlc2VydmVkIG5hbWVcIik7XG4gICAgfVxuICAgIGlmIChuYW1lIGluIHRoaXMub3BlcmF0aW9ucykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBvcGVyYXRpb24gd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgfVxuICAgIGlmIChuYW1lIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhZGQgJyArIHR5cGUgKyBcIiAnXCIgKyBuYW1lICsgXCInOiBhbiBhdHRyaWJ1dGUgd2l0aCB0aGF0IG5hbWUgYWxyZWFkeSBleGlzdHNcIik7XG4gICAgfVxufTtcbi8vIFJldHVybnMgYSB3cmFwcGVyIGZvciB0aGUgZ2l2ZW4gQ1NUIGBub2RlYCBpbiB0aGlzIHNlbWFudGljcy5cbi8vIElmIGBub2RlYCBpcyBhbHJlYWR5IGEgd3JhcHBlciwgcmV0dXJucyBgbm9kZWAgaXRzZWxmLiAgLy8gVE9ETzogd2h5IGlzIHRoaXMgbmVlZGVkP1xuU2VtYW50aWNzLnByb3RvdHlwZS53cmFwID0gZnVuY3Rpb24gKG5vZGUsIHNvdXJjZSwgb3B0QmFzZUludGVydmFsKSB7XG4gICAgdmFyIGJhc2VJbnRlcnZhbCA9IG9wdEJhc2VJbnRlcnZhbCB8fCBzb3VyY2U7XG4gICAgcmV0dXJuIG5vZGUgaW5zdGFuY2VvZiB0aGlzLldyYXBwZXIgPyBub2RlIDogbmV3IHRoaXMuV3JhcHBlcihub2RlLCBzb3VyY2UsIGJhc2VJbnRlcnZhbCk7XG59O1xuLy8gQ3JlYXRlcyBhIG5ldyBTZW1hbnRpY3MgaW5zdGFuY2UgZm9yIGBncmFtbWFyYCwgaW5oZXJpdGluZyBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIGZyb21cbi8vIGBvcHRTdXBlclNlbWFudGljc2AsIGlmIGl0IGlzIHNwZWNpZmllZC4gUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIHByb3h5IGZvciB0aGUgbmV3XG4vLyBTZW1hbnRpY3MgaW5zdGFuY2UuIFdoZW4gdGhhdCBmdW5jdGlvbiBpcyBpbnZva2VkIHdpdGggYSBDU1Qgbm9kZSBhcyBhbiBhcmd1bWVudCwgaXQgcmV0dXJuc1xuLy8gYSB3cmFwcGVyIGZvciB0aGF0IG5vZGUgd2hpY2ggZ2l2ZXMgYWNjZXNzIHRvIHRoZSBvcGVyYXRpb25zIGFuZCBhdHRyaWJ1dGVzIHByb3ZpZGVkIGJ5IHRoaXNcbi8vIHNlbWFudGljcy5cblNlbWFudGljcy5jcmVhdGVTZW1hbnRpY3MgPSBmdW5jdGlvbiAoZ3JhbW1hciwgb3B0U3VwZXJTZW1hbnRpY3MpIHtcbiAgICB2YXIgcyA9IG5ldyBTZW1hbnRpY3MoZ3JhbW1hciwgb3B0U3VwZXJTZW1hbnRpY3MgIT09IHVuZGVmaW5lZCA/XG4gICAgICAgIG9wdFN1cGVyU2VtYW50aWNzIDpcbiAgICAgICAgU2VtYW50aWNzLkJ1aWx0SW5TZW1hbnRpY3MuX2dldFNlbWFudGljcygpKTtcbiAgICAvLyBUbyBlbmFibGUgY2xpZW50cyB0byBpbnZva2UgYSBzZW1hbnRpY3MgbGlrZSBhIGZ1bmN0aW9uLCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBwcm94eVxuICAgIC8vIGZvciBgc2AsIHdoaWNoIGlzIHRoZSByZWFsIGBTZW1hbnRpY3NgIGluc3RhbmNlLlxuICAgIHZhciBwcm94eSA9IGZ1bmN0aW9uIEFTZW1hbnRpY3MobWF0Y2hSZXN1bHQpIHtcbiAgICAgICAgaWYgKCEobWF0Y2hSZXN1bHQgaW5zdGFuY2VvZiBNYXRjaFJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NlbWFudGljcyBleHBlY3RlZCBhIE1hdGNoUmVzdWx0LCBidXQgZ290ICcgKyBjb21tb24udW5leHBlY3RlZE9ialRvU3RyaW5nKG1hdGNoUmVzdWx0KSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1hdGNoUmVzdWx0LmZhaWxlZCgpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdjYW5ub3QgYXBwbHkgU2VtYW50aWNzIHRvICcgKyBtYXRjaFJlc3VsdC50b1N0cmluZygpKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3N0ID0gbWF0Y2hSZXN1bHQuX2NzdDtcbiAgICAgICAgaWYgKGNzdC5ncmFtbWFyICE9PSBncmFtbWFyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdXNlIGEgTWF0Y2hSZXN1bHQgZnJvbSBncmFtbWFyICdcIiArIGNzdC5ncmFtbWFyLm5hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyB3aXRoIGEgc2VtYW50aWNzIGZvciAnXCIgKyBncmFtbWFyLm5hbWUgKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlucHV0U3RyZWFtID0gbmV3IElucHV0U3RyZWFtKG1hdGNoUmVzdWx0LmlucHV0KTtcbiAgICAgICAgcmV0dXJuIHMud3JhcChjc3QsIGlucHV0U3RyZWFtLmludGVydmFsKG1hdGNoUmVzdWx0Ll9jc3RPZmZzZXQsIG1hdGNoUmVzdWx0LmlucHV0Lmxlbmd0aCkpO1xuICAgIH07XG4gICAgLy8gRm9yd2FyZCBwdWJsaWMgbWV0aG9kcyBmcm9tIHRoZSBwcm94eSB0byB0aGUgc2VtYW50aWNzIGluc3RhbmNlLlxuICAgIHByb3h5LmFkZE9wZXJhdGlvbiA9IGZ1bmN0aW9uIChzaWduYXR1cmUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5hZGRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgc2lnbmF0dXJlLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuZXh0ZW5kT3BlcmF0aW9uID0gZnVuY3Rpb24gKG5hbWUsIGFjdGlvbkRpY3QpIHtcbiAgICAgICAgcy5leHRlbmRPcGVyYXRpb25PckF0dHJpYnV0ZSgnb3BlcmF0aW9uJywgbmFtZSwgYWN0aW9uRGljdCk7XG4gICAgICAgIHJldHVybiBwcm94eTtcbiAgICB9O1xuICAgIHByb3h5LmFkZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChuYW1lLCBhY3Rpb25EaWN0KSB7XG4gICAgICAgIHMuYWRkT3BlcmF0aW9uT3JBdHRyaWJ1dGUoJ2F0dHJpYnV0ZScsIG5hbWUsIGFjdGlvbkRpY3QpO1xuICAgICAgICByZXR1cm4gcHJveHk7XG4gICAgfTtcbiAgICBwcm94eS5leHRlbmRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAobmFtZSwgYWN0aW9uRGljdCkge1xuICAgICAgICBzLmV4dGVuZE9wZXJhdGlvbk9yQXR0cmlidXRlKCdhdHRyaWJ1dGUnLCBuYW1lLCBhY3Rpb25EaWN0KTtcbiAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH07XG4gICAgcHJveHkuX2dldEFjdGlvbkRpY3QgPSBmdW5jdGlvbiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIHZhciBhY3Rpb24gPSBzLm9wZXJhdGlvbnNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXSB8fCBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgaWYgKCFhY3Rpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignXCInICsgb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lICsgJ1wiIGlzIG5vdCBhIHZhbGlkIG9wZXJhdGlvbiBvciBhdHRyaWJ1dGUgJyArXG4gICAgICAgICAgICAgICAgJ25hbWUgaW4gdGhpcyBzZW1hbnRpY3MgZm9yIFwiJyArIGdyYW1tYXIubmFtZSArICdcIicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY3Rpb24uYWN0aW9uRGljdDtcbiAgICB9O1xuICAgIHByb3h5Ll9yZW1vdmUgPSBmdW5jdGlvbiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIHZhciBzZW1hbnRpYztcbiAgICAgICAgaWYgKG9wZXJhdGlvbk9yQXR0cmlidXRlTmFtZSBpbiBzLm9wZXJhdGlvbnMpIHtcbiAgICAgICAgICAgIHNlbWFudGljID0gcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgICAgICBkZWxldGUgcy5vcGVyYXRpb25zW29wZXJhdGlvbk9yQXR0cmlidXRlTmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAob3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lIGluIHMuYXR0cmlidXRlcykge1xuICAgICAgICAgICAgc2VtYW50aWMgPSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgICAgIGRlbGV0ZSBzLmF0dHJpYnV0ZXNbb3BlcmF0aW9uT3JBdHRyaWJ1dGVOYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcy5XcmFwcGVyLnByb3RvdHlwZVtvcGVyYXRpb25PckF0dHJpYnV0ZU5hbWVdO1xuICAgICAgICByZXR1cm4gc2VtYW50aWM7XG4gICAgfTtcbiAgICBwcm94eS5nZXRPcGVyYXRpb25OYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHMub3BlcmF0aW9ucyk7XG4gICAgfTtcbiAgICBwcm94eS5nZXRBdHRyaWJ1dGVOYW1lcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHMuYXR0cmlidXRlcyk7XG4gICAgfTtcbiAgICBwcm94eS5nZXRHcmFtbWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gcy5ncmFtbWFyO1xuICAgIH07XG4gICAgcHJveHkudG9SZWNpcGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzT25seSkge1xuICAgICAgICByZXR1cm4gcy50b1JlY2lwZShzZW1hbnRpY3NPbmx5KTtcbiAgICB9O1xuICAgIC8vIE1ha2UgdGhlIHByb3h5J3MgdG9TdHJpbmcoKSB3b3JrLlxuICAgIHByb3h5LnRvU3RyaW5nID0gcy50b1N0cmluZy5iaW5kKHMpO1xuICAgIC8vIFJldHVybnMgdGhlIHNlbWFudGljcyBmb3IgdGhlIHByb3h5LlxuICAgIHByb3h5Ll9nZXRTZW1hbnRpY3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzO1xuICAgIH07XG4gICAgcmV0dXJuIHByb3h5O1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tIE9wZXJhdGlvbiAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gQW4gT3BlcmF0aW9uIHJlcHJlc2VudHMgYSBmdW5jdGlvbiB0byBiZSBhcHBsaWVkIHRvIGEgY29uY3JldGUgc3ludGF4IHRyZWUgKENTVCkgLS0gaXQncyB2ZXJ5XG4vLyBzaW1pbGFyIHRvIGEgVmlzaXRvciAoaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9WaXNpdG9yX3BhdHRlcm4pLiBBbiBvcGVyYXRpb24gaXMgZXhlY3V0ZWQgYnlcbi8vIHJlY3Vyc2l2ZWx5IHdhbGtpbmcgdGhlIENTVCwgYW5kIGF0IGVhY2ggbm9kZSwgaW52b2tpbmcgdGhlIG1hdGNoaW5nIHNlbWFudGljIGFjdGlvbiBmcm9tXG4vLyBgYWN0aW9uRGljdGAuIFNlZSBgT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlYCBmb3IgZGV0YWlscyBvZiBob3cgYSBDU1Qgbm9kZSdzIG1hdGNoaW5nIHNlbWFudGljXG4vLyBhY3Rpb24gaXMgZm91bmQuXG5mdW5jdGlvbiBPcGVyYXRpb24obmFtZSwgZm9ybWFscywgYWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZm9ybWFscyA9IGZvcm1hbHM7XG4gICAgdGhpcy5hY3Rpb25EaWN0ID0gYWN0aW9uRGljdDtcbiAgICB0aGlzLmJ1aWx0SW5EZWZhdWx0ID0gYnVpbHRJbkRlZmF1bHQ7XG59XG5PcGVyYXRpb24ucHJvdG90eXBlLnR5cGVOYW1lID0gJ29wZXJhdGlvbic7XG5PcGVyYXRpb24ucHJvdG90eXBlLmNoZWNrQWN0aW9uRGljdCA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgZ3JhbW1hci5fY2hlY2tUb3BEb3duQWN0aW9uRGljdCh0aGlzLnR5cGVOYW1lLCB0aGlzLm5hbWUsIHRoaXMuYWN0aW9uRGljdCk7XG59O1xuLy8gRXhlY3V0ZSB0aGlzIG9wZXJhdGlvbiBvbiB0aGUgQ1NUIG5vZGUgYXNzb2NpYXRlZCB3aXRoIGBub2RlV3JhcHBlcmAgaW4gdGhlIGNvbnRleHQgb2YgdGhlIGdpdmVuXG4vLyBTZW1hbnRpY3MgaW5zdGFuY2UuXG5PcGVyYXRpb24ucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbiAoc2VtYW50aWNzLCBub2RlV3JhcHBlcikge1xuICAgIHRyeSB7XG4gICAgICAgIC8vIExvb2sgZm9yIGEgc2VtYW50aWMgYWN0aW9uIHdob3NlIG5hbWUgbWF0Y2hlcyB0aGUgbm9kZSdzIGNvbnN0cnVjdG9yIG5hbWUsIHdoaWNoIGlzIGVpdGhlclxuICAgICAgICAvLyB0aGUgbmFtZSBvZiBhIHJ1bGUgaW4gdGhlIGdyYW1tYXIsIG9yICdfdGVybWluYWwnIChmb3IgYSB0ZXJtaW5hbCBub2RlKSwgb3IgJ19pdGVyJyAoZm9yIGFuXG4gICAgICAgIC8vIGl0ZXJhdGlvbiBub2RlKS4gSW4gdGhlIGxhdHRlciBjYXNlLCB0aGUgYWN0aW9uIGZ1bmN0aW9uIHJlY2VpdmVzIGEgc2luZ2xlIGFyZ3VtZW50LCB3aGljaFxuICAgICAgICAvLyBpcyBhbiBhcnJheSBjb250YWluaW5nIGFsbCBvZiB0aGUgY2hpbGRyZW4gb2YgdGhlIENTVCBub2RlLlxuICAgICAgICB2YXIgY3Rvck5hbWUgPSBub2RlV3JhcHBlci5fbm9kZS5jdG9yTmFtZTtcbiAgICAgICAgdmFyIGFjdGlvbkZuID0gdGhpcy5hY3Rpb25EaWN0W2N0b3JOYW1lXTtcbiAgICAgICAgdmFyIGFucyA9IHZvaWQgMDtcbiAgICAgICAgaWYgKGFjdGlvbkZuKSB7XG4gICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wdXNoKFt0aGlzLCBjdG9yTmFtZV0pO1xuICAgICAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCBhY3Rpb25Gbiwgbm9kZVdyYXBwZXIuaXNJdGVyYXRpb24oKSk7XG4gICAgICAgICAgICByZXR1cm4gYW5zO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRoZSBhY3Rpb24gZGljdGlvbmFyeSBkb2VzIG5vdCBjb250YWluIGEgc2VtYW50aWMgYWN0aW9uIGZvciB0aGlzIHNwZWNpZmljIHR5cGUgb2Ygbm9kZS5cbiAgICAgICAgLy8gSWYgdGhpcyBpcyBhIG5vbnRlcm1pbmFsIG5vZGUgYW5kIHRoZSBwcm9ncmFtbWVyIGhhcyBwcm92aWRlZCBhIGBfbm9udGVybWluYWxgIHNlbWFudGljXG4gICAgICAgIC8vIGFjdGlvbiwgd2UgaW52b2tlIGl0OlxuICAgICAgICBpZiAobm9kZVdyYXBwZXIuaXNOb250ZXJtaW5hbCgpKSB7XG4gICAgICAgICAgICBhY3Rpb25GbiA9IHRoaXMuYWN0aW9uRGljdC5fbm9udGVybWluYWw7XG4gICAgICAgICAgICBpZiAoYWN0aW9uRm4pIHtcbiAgICAgICAgICAgICAgICBnbG9iYWxBY3Rpb25TdGFjay5wdXNoKFt0aGlzLCAnX25vbnRlcm1pbmFsJywgY3Rvck5hbWVdKTtcbiAgICAgICAgICAgICAgICBhbnMgPSB0aGlzLmRvQWN0aW9uKHNlbWFudGljcywgbm9kZVdyYXBwZXIsIGFjdGlvbkZuLCB0cnVlKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYW5zO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIE90aGVyd2lzZSwgd2UgaW52b2tlIHRoZSAnX2RlZmF1bHQnIHNlbWFudGljIGFjdGlvbi5cbiAgICAgICAgZ2xvYmFsQWN0aW9uU3RhY2sucHVzaChbdGhpcywgJ2RlZmF1bHQgYWN0aW9uJywgY3Rvck5hbWVdKTtcbiAgICAgICAgYW5zID0gdGhpcy5kb0FjdGlvbihzZW1hbnRpY3MsIG5vZGVXcmFwcGVyLCB0aGlzLmFjdGlvbkRpY3QuX2RlZmF1bHQsIHRydWUpO1xuICAgICAgICByZXR1cm4gYW5zO1xuICAgIH1cbiAgICBmaW5hbGx5IHtcbiAgICAgICAgZ2xvYmFsQWN0aW9uU3RhY2sucG9wKCk7XG4gICAgfVxufTtcbi8vIEludm9rZSBgYWN0aW9uRm5gIG9uIHRoZSBDU1Qgbm9kZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGBub2RlV3JhcHBlcmAsIGluIHRoZSBjb250ZXh0IG9mXG4vLyBgc2VtYW50aWNzYC4gSWYgYG9wdFBhc3NDaGlsZHJlbkFzQXJyYXlgIGlzIHRydXRoeSwgYGFjdGlvbkZuYCB3aWxsIGJlIGNhbGxlZCB3aXRoIGEgc2luZ2xlXG4vLyBhcmd1bWVudCwgd2hpY2ggaXMgYW4gYXJyYXkgb2Ygd3JhcHBlcnMuIE90aGVyd2lzZSwgdGhlIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYGFjdGlvbkZuYCB3aWxsXG4vLyBiZSBlcXVhbCB0byB0aGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoZSBDU1Qgbm9kZS5cbk9wZXJhdGlvbi5wcm90b3R5cGUuZG9BY3Rpb24gPSBmdW5jdGlvbiAoc2VtYW50aWNzLCBub2RlV3JhcHBlciwgYWN0aW9uRm4sIG9wdFBhc3NDaGlsZHJlbkFzQXJyYXkpIHtcbiAgICByZXR1cm4gb3B0UGFzc0NoaWxkcmVuQXNBcnJheSA/XG4gICAgICAgIGFjdGlvbkZuLmNhbGwobm9kZVdyYXBwZXIsIG5vZGVXcmFwcGVyLl9jaGlsZHJlbigpKSA6XG4gICAgICAgIGFjdGlvbkZuLmFwcGx5KG5vZGVXcmFwcGVyLCBub2RlV3JhcHBlci5fY2hpbGRyZW4oKSk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gQXR0cmlidXRlIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBBdHRyaWJ1dGVzIGFyZSBPcGVyYXRpb25zIHdob3NlIHJlc3VsdHMgYXJlIG1lbW9pemVkLiBUaGlzIG1lYW5zIHRoYXQsIGZvciBhbnkgZ2l2ZW4gc2VtYW50aWNzLFxuLy8gdGhlIHNlbWFudGljIGFjdGlvbiBmb3IgYSBDU1Qgbm9kZSB3aWxsIGJlIGludm9rZWQgbm8gbW9yZSB0aGFuIG9uY2UuXG5mdW5jdGlvbiBBdHRyaWJ1dGUobmFtZSwgYWN0aW9uRGljdCwgYnVpbHRJbkRlZmF1bHQpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuZm9ybWFscyA9IFtdO1xuICAgIHRoaXMuYWN0aW9uRGljdCA9IGFjdGlvbkRpY3Q7XG4gICAgdGhpcy5idWlsdEluRGVmYXVsdCA9IGJ1aWx0SW5EZWZhdWx0O1xufVxuaW5oZXJpdHMoQXR0cmlidXRlLCBPcGVyYXRpb24pO1xuQXR0cmlidXRlLnByb3RvdHlwZS50eXBlTmFtZSA9ICdhdHRyaWJ1dGUnO1xuQXR0cmlidXRlLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24gKHNlbWFudGljcywgbm9kZVdyYXBwZXIpIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVXcmFwcGVyLl9ub2RlO1xuICAgIHZhciBrZXkgPSBzZW1hbnRpY3MuYXR0cmlidXRlS2V5c1t0aGlzLm5hbWVdO1xuICAgIGlmICghbm9kZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgaXMgYSBzdXBlci1zZW5kIC0tIGlzbid0IEpTIGJlYXV0aWZ1bD8gOi9cbiAgICAgICAgbm9kZVtrZXldID0gT3BlcmF0aW9uLnByb3RvdHlwZS5leGVjdXRlLmNhbGwodGhpcywgc2VtYW50aWNzLCBub2RlV3JhcHBlcik7XG4gICAgfVxuICAgIHJldHVybiBub2RlW2tleV07XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0gRGVmZXJyZWQgaW5pdGlhbGl6YXRpb24gLS0tLS0tLS0tLS0tLS0tLS1cbnV0aWwuYXdhaXRCdWlsdEluUnVsZXMoZnVuY3Rpb24gKGJ1aWx0SW5SdWxlcykge1xuICAgIHZhciBvcGVyYXRpb25zQW5kQXR0cmlidXRlc0dyYW1tYXIgPSByZXF1aXJlKCcuLi9kaXN0L29wZXJhdGlvbnMtYW5kLWF0dHJpYnV0ZXMnKTtcbiAgICBpbml0QnVpbHRJblNlbWFudGljcyhidWlsdEluUnVsZXMpO1xuICAgIGluaXRQcm90b3R5cGVQYXJzZXIob3BlcmF0aW9uc0FuZEF0dHJpYnV0ZXNHcmFtbWFyKTsgLy8gcmVxdWlyZXMgQnVpbHRJblNlbWFudGljc1xufSk7XG5mdW5jdGlvbiBpbml0QnVpbHRJblNlbWFudGljcyhidWlsdEluUnVsZXMpIHtcbiAgICB2YXIgYWN0aW9ucyA9IHtcbiAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLml0ZXJhdGlvbigpO1xuICAgICAgICB9LFxuICAgICAgICBub25FbXB0eTogZnVuY3Rpb24gKGZpcnN0LCBfLCByZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVyYXRpb24oW2ZpcnN0XS5jb25jYXQocmVzdC5jaGlsZHJlbikpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTZW1hbnRpY3MuQnVpbHRJblNlbWFudGljcyA9IFNlbWFudGljc1xuICAgICAgICAuY3JlYXRlU2VtYW50aWNzKGJ1aWx0SW5SdWxlcywgbnVsbClcbiAgICAgICAgLmFkZE9wZXJhdGlvbignYXNJdGVyYXRpb24nLCB7XG4gICAgICAgIGVtcHR5TGlzdE9mOiBhY3Rpb25zLmVtcHR5LFxuICAgICAgICBub25lbXB0eUxpc3RPZjogYWN0aW9ucy5ub25FbXB0eSxcbiAgICAgICAgRW1wdHlMaXN0T2Y6IGFjdGlvbnMuZW1wdHksXG4gICAgICAgIE5vbmVtcHR5TGlzdE9mOiBhY3Rpb25zLm5vbkVtcHR5XG4gICAgfSk7XG59XG5mdW5jdGlvbiBpbml0UHJvdG90eXBlUGFyc2VyKGdyYW1tYXIpIHtcbiAgICBwcm90b3R5cGVHcmFtbWFyU2VtYW50aWNzID0gZ3JhbW1hci5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3BhcnNlJywge1xuICAgICAgICBBdHRyaWJ1dGVTaWduYXR1cmU6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUucGFyc2UoKSxcbiAgICAgICAgICAgICAgICBmb3JtYWxzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcbiAgICAgICAgT3BlcmF0aW9uU2lnbmF0dXJlOiBmdW5jdGlvbiAobmFtZSwgb3B0Rm9ybWFscykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLnBhcnNlKCksXG4gICAgICAgICAgICAgICAgZm9ybWFsczogb3B0Rm9ybWFscy5wYXJzZSgpWzBdIHx8IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgICBGb3JtYWxzOiBmdW5jdGlvbiAob3BhcmVuLCBmcywgY3BhcmVuKSB7XG4gICAgICAgICAgICByZXR1cm4gZnMuYXNJdGVyYXRpb24oKS5wYXJzZSgpO1xuICAgICAgICB9LFxuICAgICAgICBuYW1lOiBmdW5jdGlvbiAoZmlyc3QsIHJlc3QpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHByb3RvdHlwZUdyYW1tYXIgPSBncmFtbWFyO1xufVxuO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFNlbWFudGljcztcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEludGVydmFsID0gcmVxdWlyZSgnLi9JbnRlcnZhbCcpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFVuaWNvZGUgY2hhcmFjdGVycyB0aGF0IGFyZSB1c2VkIGluIHRoZSBgdG9TdHJpbmdgIG91dHB1dC5cbnZhciBCQUxMT1RfWCA9ICdcXHUyNzE3JztcbnZhciBDSEVDS19NQVJLID0gJ1xcdTI3MTMnO1xudmFyIERPVF9PUEVSQVRPUiA9ICdcXHUyMkM1JztcbnZhciBSSUdIVFdBUkRTX0RPVUJMRV9BUlJPVyA9ICdcXHUyMUQyJztcbnZhciBTWU1CT0xfRk9SX0hPUklaT05UQUxfVEFCVUxBVElPTiA9ICdcXHUyNDA5JztcbnZhciBTWU1CT0xfRk9SX0xJTkVfRkVFRCA9ICdcXHUyNDBBJztcbnZhciBTWU1CT0xfRk9SX0NBUlJJQUdFX1JFVFVSTiA9ICdcXHUyNDBEJztcbnZhciBGbGFncyA9IHtcbiAgICBzdWNjZWVkZWQ6IDEgPDwgMCxcbiAgICBpc1Jvb3ROb2RlOiAxIDw8IDEsXG4gICAgaXNJbXBsaWNpdFNwYWNlczogMSA8PCAyLFxuICAgIGlzTWVtb2l6ZWQ6IDEgPDwgMyxcbiAgICBpc0hlYWRPZkxlZnRSZWN1cnNpb246IDEgPDwgNCxcbiAgICB0ZXJtaW5hdGVzTFI6IDEgPDwgNVxufTtcbmZ1bmN0aW9uIHNwYWNlcyhuKSB7XG4gICAgcmV0dXJuIGNvbW1vbi5yZXBlYXQoJyAnLCBuKS5qb2luKCcnKTtcbn1cbi8vIFJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiBhIHBvcnRpb24gb2YgYGlucHV0YCBhdCBvZmZzZXQgYHBvc2AuXG4vLyBUaGUgcmVzdWx0IHdpbGwgY29udGFpbiBleGFjdGx5IGBsZW5gIGNoYXJhY3RlcnMuXG5mdW5jdGlvbiBnZXRJbnB1dEV4Y2VycHQoaW5wdXQsIHBvcywgbGVuKSB7XG4gICAgdmFyIGV4Y2VycHQgPSBhc0VzY2FwZWRTdHJpbmcoaW5wdXQuc2xpY2UocG9zLCBwb3MgKyBsZW4pKTtcbiAgICAvLyBQYWQgdGhlIG91dHB1dCBpZiBuZWNlc3NhcnkuXG4gICAgaWYgKGV4Y2VycHQubGVuZ3RoIDwgbGVuKSB7XG4gICAgICAgIHJldHVybiBleGNlcnB0ICsgY29tbW9uLnJlcGVhdCgnICcsIGxlbiAtIGV4Y2VycHQubGVuZ3RoKS5qb2luKCcnKTtcbiAgICB9XG4gICAgcmV0dXJuIGV4Y2VycHQ7XG59XG5mdW5jdGlvbiBhc0VzY2FwZWRTdHJpbmcob2JqKSB7XG4gICAgaWYgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIFJlcGxhY2Ugbm9uLXByaW50YWJsZSBjaGFyYWN0ZXJzIHdpdGggdmlzaWJsZSBzeW1ib2xzLlxuICAgICAgICByZXR1cm4gb2JqXG4gICAgICAgICAgICAucmVwbGFjZSgvIC9nLCBET1RfT1BFUkFUT1IpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFx0L2csIFNZTUJPTF9GT1JfSE9SSVpPTlRBTF9UQUJVTEFUSU9OKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCBTWU1CT0xfRk9SX0xJTkVfRkVFRClcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgU1lNQk9MX0ZPUl9DQVJSSUFHRV9SRVRVUk4pO1xuICAgIH1cbiAgICByZXR1cm4gU3RyaW5nKG9iaik7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBUcmFjZSAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gVHJhY2UoaW5wdXQsIHBvczEsIHBvczIsIGV4cHIsIHN1Y2NlZWRlZCwgYmluZGluZ3MsIG9wdENoaWxkcmVuKSB7XG4gICAgdGhpcy5pbnB1dCA9IGlucHV0O1xuICAgIHRoaXMucG9zID0gdGhpcy5wb3MxID0gcG9zMTtcbiAgICB0aGlzLnBvczIgPSBwb3MyO1xuICAgIHRoaXMuc291cmNlID0gbmV3IEludGVydmFsKGlucHV0LCBwb3MxLCBwb3MyKTtcbiAgICB0aGlzLmV4cHIgPSBleHByO1xuICAgIHRoaXMuYmluZGluZ3MgPSBiaW5kaW5ncztcbiAgICB0aGlzLmNoaWxkcmVuID0gb3B0Q2hpbGRyZW4gfHwgW107XG4gICAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkgPSBudWxsO1xuICAgIHRoaXMuX2ZsYWdzID0gc3VjY2VlZGVkID8gRmxhZ3Muc3VjY2VlZGVkIDogMDtcbn1cbi8vIEEgdmFsdWUgdGhhdCBjYW4gYmUgcmV0dXJuZWQgZnJvbSB2aXNpdG9yIGZ1bmN0aW9ucyB0byBpbmRpY2F0ZSB0aGF0IGFcbi8vIG5vZGUgc2hvdWxkIG5vdCBiZSByZWN1cnNlZCBpbnRvLlxuVHJhY2UucHJvdG90eXBlLlNLSVAgPSB7fTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShUcmFjZS5wcm90b3R5cGUsICdkaXNwbGF5U3RyaW5nJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5leHByLnRvRGlzcGxheVN0cmluZygpOyB9XG59KTtcbi8vIEZvciBjb252ZW5pZW5jZSwgY3JlYXRlIGEgZ2V0dGVyIGFuZCBzZXR0ZXIgZm9yIHRoZSBib29sZWFuIGZsYWdzIGluIGBGbGFnc2AuXG5PYmplY3Qua2V5cyhGbGFncykuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBtYXNrID0gRmxhZ3NbbmFtZV07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRyYWNlLnByb3RvdHlwZSwgbmFtZSwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5fZmxhZ3MgJiBtYXNrKSAhPT0gMDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsKSB7XG4gICAgICAgICAgICBpZiAodmFsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZmxhZ3MgfD0gbWFzaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX2ZsYWdzICY9IH5tYXNrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59KTtcblRyYWNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZVdpdGhFeHByKHRoaXMuZXhwcik7XG59O1xuVHJhY2UucHJvdG90eXBlLmNsb25lV2l0aEV4cHIgPSBmdW5jdGlvbiAoZXhwcikge1xuICAgIHZhciBhbnMgPSBuZXcgVHJhY2UodGhpcy5pbnB1dCwgdGhpcy5wb3MsIHRoaXMucG9zMiwgZXhwciwgdGhpcy5zdWNjZWVkZWQsIHRoaXMuYmluZGluZ3MsIHRoaXMuY2hpbGRyZW4pO1xuICAgIGFucy5pc0hlYWRPZkxlZnRSZWN1cnNpb24gPSB0aGlzLmlzSGVhZE9mTGVmdFJlY3Vyc2lvbjtcbiAgICBhbnMuaXNJbXBsaWNpdFNwYWNlcyA9IHRoaXMuaXNJbXBsaWNpdFNwYWNlcztcbiAgICBhbnMuaXNNZW1vaXplZCA9IHRoaXMuaXNNZW1vaXplZDtcbiAgICBhbnMuaXNSb290Tm9kZSA9IHRoaXMuaXNSb290Tm9kZTtcbiAgICBhbnMudGVybWluYXRlc0xSID0gdGhpcy50ZXJtaW5hdGVzTFI7XG4gICAgYW5zLnRlcm1pbmF0aW5nTFJFbnRyeSA9IHRoaXMudGVybWluYXRpbmdMUkVudHJ5O1xuICAgIHJldHVybiBhbnM7XG59O1xuLy8gUmVjb3JkIHRoZSB0cmFjZSBpbmZvcm1hdGlvbiBmb3IgdGhlIHRlcm1pbmF0aW5nIGNvbmRpdGlvbiBvZiB0aGUgTFIgbG9vcC5cblRyYWNlLnByb3RvdHlwZS5yZWNvcmRMUlRlcm1pbmF0aW9uID0gZnVuY3Rpb24gKHJ1bGVCb2R5VHJhY2UsIHZhbHVlKSB7XG4gICAgdGhpcy50ZXJtaW5hdGluZ0xSRW50cnkgPVxuICAgICAgICBuZXcgVHJhY2UodGhpcy5pbnB1dCwgdGhpcy5wb3MsIHRoaXMucG9zMiwgdGhpcy5leHByLCBmYWxzZSwgW3ZhbHVlXSwgW3J1bGVCb2R5VHJhY2VdKTtcbiAgICB0aGlzLnRlcm1pbmF0aW5nTFJFbnRyeS50ZXJtaW5hdGVzTFIgPSB0cnVlO1xufTtcbi8vIFJlY3Vyc2l2ZWx5IHRyYXZlcnNlIHRoaXMgdHJhY2Ugbm9kZSBhbmQgYWxsIGl0cyBkZXNjZW5kZW50cywgY2FsbGluZyBhIHZpc2l0b3IgZnVuY3Rpb25cbi8vIGZvciBlYWNoIG5vZGUgdGhhdCBpcyB2aXNpdGVkLiBJZiBgdmlzdG9yT2JqT3JGbmAgaXMgYW4gb2JqZWN0LCB0aGVuIGl0cyAnZW50ZXInIHByb3BlcnR5XG4vLyBpcyBhIGZ1bmN0aW9uIHRvIGNhbGwgYmVmb3JlIHZpc2l0aW5nIHRoZSBjaGlsZHJlbiBvZiBhIG5vZGUsIGFuZCBpdHMgJ2V4aXQnIHByb3BlcnR5IGlzXG4vLyBhIGZ1bmN0aW9uIHRvIGNhbGwgYWZ0ZXJ3YXJkcy4gSWYgYHZpc2l0b3JPYmpPckZuYCBpcyBhIGZ1bmN0aW9uLCBpdCByZXByZXNlbnRzIHRoZSAnZW50ZXInXG4vLyBmdW5jdGlvbi5cbi8vXG4vLyBUaGUgZnVuY3Rpb25zIGFyZSBjYWxsZWQgd2l0aCB0aHJlZSBhcmd1bWVudHM6IHRoZSBUcmFjZSBub2RlLCBpdHMgcGFyZW50IFRyYWNlLCBhbmQgYSBudW1iZXJcbi8vIHJlcHJlc2VudGluZyB0aGUgZGVwdGggb2YgdGhlIG5vZGUgaW4gdGhlIHRyZWUuIChUaGUgcm9vdCBub2RlIGhhcyBkZXB0aCAwLikgYG9wdFRoaXNBcmdgLCBpZlxuLy8gc3BlY2lmaWVkLCBpcyB0aGUgdmFsdWUgdG8gdXNlIGZvciBgdGhpc2Agd2hlbiBleGVjdXRpbmcgdGhlIHZpc2l0b3IgZnVuY3Rpb25zLlxuVHJhY2UucHJvdG90eXBlLndhbGsgPSBmdW5jdGlvbiAodmlzaXRvck9iak9yRm4sIG9wdFRoaXNBcmcpIHtcbiAgICB2YXIgdmlzaXRvciA9IHZpc2l0b3JPYmpPckZuO1xuICAgIGlmICh0eXBlb2YgdmlzaXRvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB2aXNpdG9yID0geyBlbnRlcjogdmlzaXRvciB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBfd2Fsayhub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgICAgIHZhciByZWN1cnNlID0gdHJ1ZTtcbiAgICAgICAgaWYgKHZpc2l0b3IuZW50ZXIpIHtcbiAgICAgICAgICAgIGlmICh2aXNpdG9yLmVudGVyLmNhbGwob3B0VGhpc0FyZywgbm9kZSwgcGFyZW50LCBkZXB0aCkgPT09IFRyYWNlLnByb3RvdHlwZS5TS0lQKSB7XG4gICAgICAgICAgICAgICAgcmVjdXJzZSA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChyZWN1cnNlKSB7XG4gICAgICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICAgICAgX3dhbGsoY2hpbGQsIG5vZGUsIGRlcHRoICsgMSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICh2aXNpdG9yLmV4aXQpIHtcbiAgICAgICAgICAgICAgICB2aXNpdG9yLmV4aXQuY2FsbChvcHRUaGlzQXJnLCBub2RlLCBwYXJlbnQsIGRlcHRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5pc1Jvb3ROb2RlKSB7XG4gICAgICAgIC8vIERvbid0IHZpc2l0IHRoZSByb290IG5vZGUgaXRzZWxmLCBvbmx5IGl0cyBjaGlsZHJlbi5cbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uIChjKSB7IF93YWxrKGMsIG51bGwsIDApOyB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIF93YWxrKHRoaXMsIG51bGwsIDApO1xuICAgIH1cbn07XG4vLyBSZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRyYWNlLlxuLy8gU2FtcGxlOlxuLy8gICAgIDEy4ouFK+KLhTLii4Uq4ouFMyDinJMgZXhwIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAg4pyTIGFkZEV4cCAoTFIpIOKHkiAgXCIxMlwiXG4vLyAgICAgMTLii4Ur4ouFMuKLhSrii4UzICAgICAgIOKclyBhZGRFeHBfcGx1c1xuVHJhY2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzYiA9IG5ldyBjb21tb24uU3RyaW5nQnVmZmVyKCk7XG4gICAgdGhpcy53YWxrKGZ1bmN0aW9uIChub2RlLCBwYXJlbnQsIGRlcHRoKSB7XG4gICAgICAgIGlmICghbm9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuU0tJUDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgY3Rvck5hbWUgPSBub2RlLmV4cHIuY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgLy8gRG9uJ3QgcHJpbnQgYW55dGhpbmcgZm9yIEFsdCBub2Rlcy5cbiAgICAgICAgaWYgKGN0b3JOYW1lID09PSAnQWx0Jykge1xuICAgICAgICAgICAgcmV0dXJuOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGNvbnNpc3RlbnQtcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgc2IuYXBwZW5kKGdldElucHV0RXhjZXJwdChub2RlLmlucHV0LCBub2RlLnBvcywgMTApICsgc3BhY2VzKGRlcHRoICogMiArIDEpKTtcbiAgICAgICAgc2IuYXBwZW5kKChub2RlLnN1Y2NlZWRlZCA/IENIRUNLX01BUksgOiBCQUxMT1RfWCkgKyAnICcgKyBub2RlLmRpc3BsYXlTdHJpbmcpO1xuICAgICAgICBpZiAobm9kZS5pc0hlYWRPZkxlZnRSZWN1cnNpb24pIHtcbiAgICAgICAgICAgIHNiLmFwcGVuZCgnIChMUiknKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5zdWNjZWVkZWQpIHtcbiAgICAgICAgICAgIHZhciBjb250ZW50cyA9IGFzRXNjYXBlZFN0cmluZyhub2RlLnNvdXJjZS5jb250ZW50cyk7XG4gICAgICAgICAgICBzYi5hcHBlbmQoJyAnICsgUklHSFRXQVJEU19ET1VCTEVfQVJST1cgKyAnICAnKTtcbiAgICAgICAgICAgIHNiLmFwcGVuZCh0eXBlb2YgY29udGVudHMgPT09ICdzdHJpbmcnID8gJ1wiJyArIGNvbnRlbnRzICsgJ1wiJyA6IGNvbnRlbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBzYi5hcHBlbmQoJ1xcbicpO1xuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgZXh0ZW5kID0gcmVxdWlyZSgndXRpbC1leHRlbmQnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIFN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xudmFyIGVzY2FwZVN0cmluZ0ZvciA9IHt9O1xuZm9yICh2YXIgYyA9IDA7IGMgPCAxMjg7IGMrKykge1xuICAgIGVzY2FwZVN0cmluZ0ZvcltjXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG59XG5lc2NhcGVTdHJpbmdGb3JbXCInXCIuY2hhckNvZGVBdCgwKV0gPSBcIlxcXFwnXCI7XG5lc2NhcGVTdHJpbmdGb3JbJ1wiJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXCInO1xuZXNjYXBlU3RyaW5nRm9yWydcXFxcJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcXFxcXCc7XG5lc2NhcGVTdHJpbmdGb3JbJ1xcYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXGInO1xuZXNjYXBlU3RyaW5nRm9yWydcXGYnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFxmJztcbmVzY2FwZVN0cmluZ0ZvclsnXFxuJy5jaGFyQ29kZUF0KDApXSA9ICdcXFxcbic7XG5lc2NhcGVTdHJpbmdGb3JbJ1xccicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHInO1xuZXNjYXBlU3RyaW5nRm9yWydcXHQnLmNoYXJDb2RlQXQoMCldID0gJ1xcXFx0JztcbmVzY2FwZVN0cmluZ0ZvclsnXFx1MDAwYicuY2hhckNvZGVBdCgwKV0gPSAnXFxcXHYnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5leHBvcnRzLmFic3RyYWN0ID0gZnVuY3Rpb24gKG9wdE1ldGhvZE5hbWUpIHtcbiAgICB2YXIgbWV0aG9kTmFtZSA9IG9wdE1ldGhvZE5hbWUgfHwgJyc7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd0aGlzIG1ldGhvZCAnICsgbWV0aG9kTmFtZSArICcgaXMgYWJzdHJhY3QhICcgK1xuICAgICAgICAgICAgJyhpdCBoYXMgbm8gaW1wbGVtZW50YXRpb24gaW4gY2xhc3MgJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICcpJyk7XG4gICAgfTtcbn07XG5leHBvcnRzLmFzc2VydCA9IGZ1bmN0aW9uIChjb25kLCBtZXNzYWdlKSB7XG4gICAgaWYgKCFjb25kKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG59O1xuLy8gRGVmaW5lIGEgbGF6aWx5LWNvbXB1dGVkLCBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lZCBgcHJvcE5hbWVgXG4vLyBvbiB0aGUgb2JqZWN0IGBvYmpgLiBgZ2V0dGVyRm5gIHdpbGwgYmUgY2FsbGVkIHRvIGNvbXB1dGUgdGhlIHZhbHVlIHRoZVxuLy8gZmlyc3QgdGltZSB0aGUgcHJvcGVydHkgaXMgYWNjZXNzZWQuXG5leHBvcnRzLmRlZmluZUxhenlQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmosIHByb3BOYW1lLCBnZXR0ZXJGbikge1xuICAgIHZhciBtZW1vO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3BOYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFtZW1vKSB7XG4gICAgICAgICAgICAgICAgbWVtbyA9IGdldHRlckZuLmNhbGwodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbWVtbztcbiAgICAgICAgfVxuICAgIH0pO1xufTtcbmV4cG9ydHMuY2xvbmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9iaikge1xuICAgICAgICByZXR1cm4gZXh0ZW5kKHt9LCBvYmopO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufTtcbmV4cG9ydHMuZXh0ZW5kID0gZXh0ZW5kO1xuZXhwb3J0cy5yZXBlYXRGbiA9IGZ1bmN0aW9uIChmbiwgbikge1xuICAgIHZhciBhcnIgPSBbXTtcbiAgICB3aGlsZSAobi0tID4gMCkge1xuICAgICAgICBhcnIucHVzaChmbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycjtcbn07XG5leHBvcnRzLnJlcGVhdFN0ciA9IGZ1bmN0aW9uIChzdHIsIG4pIHtcbiAgICByZXR1cm4gbmV3IEFycmF5KG4gKyAxKS5qb2luKHN0cik7XG59O1xuZXhwb3J0cy5yZXBlYXQgPSBmdW5jdGlvbiAoeCwgbikge1xuICAgIHJldHVybiBleHBvcnRzLnJlcGVhdEZuKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHg7IH0sIG4pO1xufTtcbmV4cG9ydHMuZ2V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgIHZhciBkdXBsaWNhdGVzID0gW107XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYXJyYXkubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgeCA9IGFycmF5W2lkeF07XG4gICAgICAgIGlmIChhcnJheS5sYXN0SW5kZXhPZih4KSAhPT0gaWR4ICYmIGR1cGxpY2F0ZXMuaW5kZXhPZih4KSA8IDApIHtcbiAgICAgICAgICAgIGR1cGxpY2F0ZXMucHVzaCh4KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZHVwbGljYXRlcztcbn07XG5leHBvcnRzLmNvcHlXaXRob3V0RHVwbGljYXRlcyA9IGZ1bmN0aW9uIChhcnJheSkge1xuICAgIHZhciBub0R1cGxpY2F0ZXMgPSBbXTtcbiAgICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgICBpZiAobm9EdXBsaWNhdGVzLmluZGV4T2YoZW50cnkpIDwgMCkge1xuICAgICAgICAgICAgbm9EdXBsaWNhdGVzLnB1c2goZW50cnkpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG5vRHVwbGljYXRlcztcbn07XG5leHBvcnRzLmlzU3ludGFjdGljID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgdmFyIGZpcnN0Q2hhciA9IHJ1bGVOYW1lWzBdO1xuICAgIHJldHVybiBmaXJzdENoYXIgPT09IGZpcnN0Q2hhci50b1VwcGVyQ2FzZSgpO1xufTtcbmV4cG9ydHMuaXNMZXhpY2FsID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgcmV0dXJuICFleHBvcnRzLmlzU3ludGFjdGljKHJ1bGVOYW1lKTtcbn07XG5leHBvcnRzLnBhZExlZnQgPSBmdW5jdGlvbiAoc3RyLCBsZW4sIG9wdENoYXIpIHtcbiAgICB2YXIgY2ggPSBvcHRDaGFyIHx8ICcgJztcbiAgICBpZiAoc3RyLmxlbmd0aCA8IGxlbikge1xuICAgICAgICByZXR1cm4gZXhwb3J0cy5yZXBlYXRTdHIoY2gsIGxlbiAtIHN0ci5sZW5ndGgpICsgc3RyO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xufTtcbi8vIFN0cmluZ0J1ZmZlclxuZXhwb3J0cy5TdHJpbmdCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zdHJpbmdzID0gW107XG59O1xuZXhwb3J0cy5TdHJpbmdCdWZmZXIucHJvdG90eXBlLmFwcGVuZCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgICB0aGlzLnN0cmluZ3MucHVzaChzdHIpO1xufTtcbmV4cG9ydHMuU3RyaW5nQnVmZmVyLnByb3RvdHlwZS5jb250ZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdHJpbmdzLmpvaW4oJycpO1xufTtcbi8vIENoYXJhY3RlciBlc2NhcGluZyBhbmQgdW5lc2NhcGluZ1xuZXhwb3J0cy5lc2NhcGVDaGFyID0gZnVuY3Rpb24gKGMsIG9wdERlbGltKSB7XG4gICAgdmFyIGNoYXJDb2RlID0gYy5jaGFyQ29kZUF0KDApO1xuICAgIGlmICgoYyA9PT0gJ1wiJyB8fCBjID09PSBcIidcIikgJiYgb3B0RGVsaW0gJiYgYyAhPT0gb3B0RGVsaW0pIHtcbiAgICAgICAgcmV0dXJuIGM7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoYXJDb2RlIDwgMTI4KSB7XG4gICAgICAgIHJldHVybiBlc2NhcGVTdHJpbmdGb3JbY2hhckNvZGVdO1xuICAgIH1cbiAgICBlbHNlIGlmICgxMjggPD0gY2hhckNvZGUgJiYgY2hhckNvZGUgPCAyNTYpIHtcbiAgICAgICAgcmV0dXJuICdcXFxceCcgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCAyLCAnMCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdcXFxcdScgKyBleHBvcnRzLnBhZExlZnQoY2hhckNvZGUudG9TdHJpbmcoMTYpLCA0LCAnMCcpO1xuICAgIH1cbn07XG5leHBvcnRzLnVuZXNjYXBlQ2hhciA9IGZ1bmN0aW9uIChzKSB7XG4gICAgaWYgKHMuY2hhckF0KDApID09PSAnXFxcXCcpIHtcbiAgICAgICAgc3dpdGNoIChzLmNoYXJBdCgxKSkge1xuICAgICAgICAgICAgY2FzZSAnYic6IHJldHVybiAnXFxiJztcbiAgICAgICAgICAgIGNhc2UgJ2YnOiByZXR1cm4gJ1xcZic7XG4gICAgICAgICAgICBjYXNlICduJzogcmV0dXJuICdcXG4nO1xuICAgICAgICAgICAgY2FzZSAncic6IHJldHVybiAnXFxyJztcbiAgICAgICAgICAgIGNhc2UgJ3QnOiByZXR1cm4gJ1xcdCc7XG4gICAgICAgICAgICBjYXNlICd2JzogcmV0dXJuICdcXHYnO1xuICAgICAgICAgICAgY2FzZSAneCc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDQpLCAxNikpO1xuICAgICAgICAgICAgY2FzZSAndSc6IHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHMuc3Vic3RyaW5nKDIsIDYpLCAxNikpO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHMuY2hhckF0KDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG59O1xuLy8gSGVscGVyIGZvciBwcm9kdWNpbmcgYSBkZXNjcmlwdGlvbiBvZiBhbiB1bmtub3duIG9iamVjdCBpbiBhIHNhZmUgd2F5LlxuLy8gRXNwZWNpYWxseSB1c2VmdWwgZm9yIGVycm9yIG1lc3NhZ2VzIHdoZXJlIGFuIHVuZXhwZWN0ZWQgdHlwZSBvZiBvYmplY3Qgd2FzIGVuY291bnRlcmVkLlxuZXhwb3J0cy51bmV4cGVjdGVkT2JqVG9TdHJpbmcgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICB9XG4gICAgdmFyIGJhc2VUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICAgIHRyeSB7XG4gICAgICAgIHZhciB0eXBlTmFtZSA9IHZvaWQgMDtcbiAgICAgICAgaWYgKG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IubmFtZSkge1xuICAgICAgICAgICAgdHlwZU5hbWUgPSBvYmouY29uc3RydWN0b3IubmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChiYXNlVG9TdHJpbmcuaW5kZXhPZignW29iamVjdCAnKSA9PT0gMCkge1xuICAgICAgICAgICAgdHlwZU5hbWUgPSBiYXNlVG9TdHJpbmcuc2xpY2UoOCwgLTEpOyAvLyBFeHRyYWN0IGUuZy4gXCJBcnJheVwiIGZyb20gXCJbb2JqZWN0IEFycmF5XVwiLlxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdHlwZU5hbWUgPSB0eXBlb2Ygb2JqO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0eXBlTmFtZSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShTdHJpbmcob2JqKSk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBiYXNlVG9TdHJpbmc7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG52YXIgTmFtZXNwYWNlID0gcmVxdWlyZSgnLi9OYW1lc3BhY2UnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gY3JlYXRlRXJyb3IobWVzc2FnZSwgb3B0SW50ZXJ2YWwpIHtcbiAgICB2YXIgZTtcbiAgICBpZiAob3B0SW50ZXJ2YWwpIHtcbiAgICAgICAgZSA9IG5ldyBFcnJvcihvcHRJbnRlcnZhbC5nZXRMaW5lQW5kQ29sdW1uTWVzc2FnZSgpICsgbWVzc2FnZSk7XG4gICAgICAgIGUuc2hvcnRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgZS5pbnRlcnZhbCA9IG9wdEludGVydmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZSA9IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICB9XG4gICAgcmV0dXJuIGU7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBlcnJvcnMgYWJvdXQgaW50ZXJ2YWxzIC0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpbnRlcnZhbFNvdXJjZXNEb250TWF0Y2goKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKFwiSW50ZXJ2YWwgc291cmNlcyBkb24ndCBtYXRjaFwiKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGVycm9ycyBhYm91dCBncmFtbWFycyAtLS0tLS0tLS0tLS0tLS0tLVxuLy8gR3JhbW1hciBzeW50YXggZXJyb3JcbmZ1bmN0aW9uIGdyYW1tYXJTeW50YXhFcnJvcihtYXRjaEZhaWx1cmUpIHtcbiAgICB2YXIgZSA9IG5ldyBFcnJvcigpO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCAnbWVzc2FnZScsIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2hGYWlsdXJlLm1lc3NhZ2U7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZSwgJ3Nob3J0TWVzc2FnZScsIHtcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJ0V4cGVjdGVkICcgKyBtYXRjaEZhaWx1cmUuZ2V0RXhwZWN0ZWRUZXh0KCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBlLmludGVydmFsID0gbWF0Y2hGYWlsdXJlLmdldEludGVydmFsKCk7XG4gICAgcmV0dXJuIGU7XG59XG4vLyBVbmRlY2xhcmVkIGdyYW1tYXJcbmZ1bmN0aW9uIHVuZGVjbGFyZWRHcmFtbWFyKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UsIGludGVydmFsKSB7XG4gICAgdmFyIG1lc3NhZ2UgPSBuYW1lc3BhY2UgP1xuICAgICAgICAnR3JhbW1hciAnICsgZ3JhbW1hck5hbWUgKyAnIGlzIG5vdCBkZWNsYXJlZCBpbiBuYW1lc3BhY2UgJyArIE5hbWVzcGFjZS50b1N0cmluZyhuYW1lc3BhY2UpIDpcbiAgICAgICAgJ1VuZGVjbGFyZWQgZ3JhbW1hciAnICsgZ3JhbW1hck5hbWU7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGludGVydmFsKTtcbn1cbi8vIER1cGxpY2F0ZSBncmFtbWFyIGRlY2xhcmF0aW9uXG5mdW5jdGlvbiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24oZ3JhbW1hciwgbmFtZXNwYWNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdHcmFtbWFyICcgKyBncmFtbWFyLm5hbWUgKyAnIGlzIGFscmVhZHkgZGVjbGFyZWQgaW4gdGhpcyBuYW1lc3BhY2UnKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIHJ1bGVzIC0tLS0tLS0tLS0tLS0tLS0tXG4vLyBVbmRlY2xhcmVkIHJ1bGVcbmZ1bmN0aW9uIHVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0SW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ1J1bGUgJyArIHJ1bGVOYW1lICsgJyBpcyBub3QgZGVjbGFyZWQgaW4gZ3JhbW1hciAnICsgZ3JhbW1hck5hbWUsIG9wdEludGVydmFsKTtcbn1cbi8vIENhbm5vdCBvdmVycmlkZSB1bmRlY2xhcmVkIHJ1bGVcbmZ1bmN0aW9uIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUocnVsZU5hbWUsIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ0Nhbm5vdCBvdmVycmlkZSBydWxlICcgKyBydWxlTmFtZSArICcgYmVjYXVzZSBpdCBpcyBub3QgZGVjbGFyZWQgaW4gJyArIGdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpO1xufVxuLy8gQ2Fubm90IGV4dGVuZCB1bmRlY2xhcmVkIHJ1bGVcbmZ1bmN0aW9uIGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgb3B0U291cmNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdDYW5ub3QgZXh0ZW5kIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBiZWNhdXNlIGl0IGlzIG5vdCBkZWNsYXJlZCBpbiAnICsgZ3JhbW1hck5hbWUsIG9wdFNvdXJjZSk7XG59XG4vLyBEdXBsaWNhdGUgcnVsZSBkZWNsYXJhdGlvblxuZnVuY3Rpb24gZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uKHJ1bGVOYW1lLCBncmFtbWFyTmFtZSwgZGVjbEdyYW1tYXJOYW1lLCBvcHRTb3VyY2UpIHtcbiAgICB2YXIgbWVzc2FnZSA9IFwiRHVwbGljYXRlIGRlY2xhcmF0aW9uIGZvciBydWxlICdcIiArIHJ1bGVOYW1lICtcbiAgICAgICAgXCInIGluIGdyYW1tYXIgJ1wiICsgZ3JhbW1hck5hbWUgKyBcIidcIjtcbiAgICBpZiAoZ3JhbW1hck5hbWUgIT09IGRlY2xHcmFtbWFyTmFtZSkge1xuICAgICAgICBtZXNzYWdlICs9IFwiIChvcmlnaW5hbGx5IGRlY2xhcmVkIGluICdcIiArIGRlY2xHcmFtbWFyTmFtZSArIFwiJylcIjtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIG9wdFNvdXJjZSk7XG59XG4vLyBXcm9uZyBudW1iZXIgb2YgcGFyYW1ldGVyc1xuZnVuY3Rpb24gd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMocnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHNvdXJjZSkge1xuICAgIHJldHVybiBjcmVhdGVFcnJvcignV3JvbmcgbnVtYmVyIG9mIHBhcmFtZXRlcnMgZm9yIHJ1bGUgJyArIHJ1bGVOYW1lICtcbiAgICAgICAgJyAoZXhwZWN0ZWQgJyArIGV4cGVjdGVkICsgJywgZ290ICcgKyBhY3R1YWwgKyAnKScsIHNvdXJjZSk7XG59XG4vLyBXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzXG5mdW5jdGlvbiB3cm9uZ051bWJlck9mQXJndW1lbnRzKHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdXcm9uZyBudW1iZXIgb2YgYXJndW1lbnRzIGZvciBydWxlICcgKyBydWxlTmFtZSArXG4gICAgICAgICcgKGV4cGVjdGVkICcgKyBleHBlY3RlZCArICcsIGdvdCAnICsgYWN0dWFsICsgJyknLCBleHByLnNvdXJjZSk7XG59XG4vLyBEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzXG5mdW5jdGlvbiBkdXBsaWNhdGVQYXJhbWV0ZXJOYW1lcyhydWxlTmFtZSwgZHVwbGljYXRlcywgc291cmNlKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWVzIGluIHJ1bGUgJyArIHJ1bGVOYW1lICsgJzogJyArIGR1cGxpY2F0ZXMuam9pbignLCAnKSwgc291cmNlKTtcbn1cbi8vIEludmFsaWQgcGFyYW1ldGVyIGV4cHJlc3Npb25cbmZ1bmN0aW9uIGludmFsaWRQYXJhbWV0ZXIocnVsZU5hbWUsIGV4cHIpIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ0ludmFsaWQgcGFyYW1ldGVyIHRvIHJ1bGUgJyArIHJ1bGVOYW1lICsgJzogJyArIGV4cHIgKyAnIGhhcyBhcml0eSAnICsgZXhwci5nZXRBcml0eSgpICtcbiAgICAgICAgJywgYnV0IHBhcmFtZXRlciBleHByZXNzaW9ucyBtdXN0IGhhdmUgYXJpdHkgMScsIGV4cHIuc291cmNlKTtcbn1cbi8vIEFwcGxpY2F0aW9uIG9mIHN5bnRhY3RpYyBydWxlIGZyb20gbGV4aWNhbCBydWxlXG5mdW5jdGlvbiBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dChydWxlTmFtZSwgYXBwbHlFeHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdDYW5ub3QgYXBwbHkgc3ludGFjdGljIHJ1bGUgJyArIHJ1bGVOYW1lICsgJyBmcm9tIGhlcmUgKGluc2lkZSBhIGxleGljYWwgY29udGV4dCknLCBhcHBseUV4cHIuc291cmNlKTtcbn1cbi8vIEluY29ycmVjdCBhcmd1bWVudCB0eXBlXG5mdW5jdGlvbiBpbmNvcnJlY3RBcmd1bWVudFR5cGUoZXhwZWN0ZWRUeXBlLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdJbmNvcnJlY3QgYXJndW1lbnQgdHlwZTogZXhwZWN0ZWQgJyArIGV4cGVjdGVkVHlwZSwgZXhwci5zb3VyY2UpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gS2xlZW5lIG9wZXJhdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24ga2xlZW5lRXhwckhhc051bGxhYmxlT3BlcmFuZChrbGVlbmVFeHByLCBhcHBsaWNhdGlvblN0YWNrKSB7XG4gICAgdmFyIGFjdHVhbHMgPSBhcHBsaWNhdGlvblN0YWNrLmxlbmd0aCA+IDAgP1xuICAgICAgICBhcHBsaWNhdGlvblN0YWNrW2FwcGxpY2F0aW9uU3RhY2subGVuZ3RoIC0gMV0uYXJncyA6XG4gICAgICAgIFtdO1xuICAgIHZhciBleHByID0ga2xlZW5lRXhwci5leHByLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7XG4gICAgdmFyIG1lc3NhZ2UgPSAnTnVsbGFibGUgZXhwcmVzc2lvbiAnICsgZXhwciArIFwiIGlzIG5vdCBhbGxvd2VkIGluc2lkZSAnXCIgK1xuICAgICAgICBrbGVlbmVFeHByLm9wZXJhdG9yICsgXCInIChwb3NzaWJsZSBpbmZpbml0ZSBsb29wKVwiO1xuICAgIGlmIChhcHBsaWNhdGlvblN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHN0YWNrVHJhY2UgPSBhcHBsaWNhdGlvblN0YWNrXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChhcHApIHsgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkoYXBwLnJ1bGVOYW1lLCBhcHAuYXJncyk7IH0pXG4gICAgICAgICAgICAuam9pbignXFxuJyk7XG4gICAgICAgIG1lc3NhZ2UgKz0gJ1xcbkFwcGxpY2F0aW9uIHN0YWNrIChtb3N0IHJlY2VudCBhcHBsaWNhdGlvbiBsYXN0KTpcXG4nICsgc3RhY2tUcmFjZTtcbiAgICB9XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKG1lc3NhZ2UsIGtsZWVuZUV4cHIuZXhwci5zb3VyY2UpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gYXJpdHkgLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGluY29uc2lzdGVudEFyaXR5KHJ1bGVOYW1lLCBleHBlY3RlZCwgYWN0dWFsLCBleHByKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdSdWxlICcgKyBydWxlTmFtZSArICcgaW52b2x2ZXMgYW4gYWx0ZXJuYXRpb24gd2hpY2ggaGFzIGluY29uc2lzdGVudCBhcml0eSAnICtcbiAgICAgICAgJyhleHBlY3RlZCAnICsgZXhwZWN0ZWQgKyAnLCBnb3QgJyArIGFjdHVhbCArICcpJywgZXhwci5zb3VyY2UpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gcHJvcGVydGllcyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gZHVwbGljYXRlUHJvcGVydHlOYW1lcyhkdXBsaWNhdGVzKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUVycm9yKCdPYmplY3QgcGF0dGVybiBoYXMgZHVwbGljYXRlIHByb3BlcnR5IG5hbWVzOiAnICsgZHVwbGljYXRlcy5qb2luKCcsICcpKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tIGNvbnN0cnVjdG9ycyAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gaW52YWxpZENvbnN0cnVjdG9yQ2FsbChncmFtbWFyLCBjdG9yTmFtZSwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoJ0F0dGVtcHQgdG8gaW52b2tlIGNvbnN0cnVjdG9yICcgKyBjdG9yTmFtZSArICcgd2l0aCBpbnZhbGlkIG9yIHVuZXhwZWN0ZWQgYXJndW1lbnRzJyk7XG59XG4vLyAtLS0tLS0tLS0tLS0tLS0tLSBjb252ZW5pZW5jZSAtLS0tLS0tLS0tLS0tLS0tLVxuZnVuY3Rpb24gbXVsdGlwbGVFcnJvcnMoZXJyb3JzKSB7XG4gICAgdmFyIG1lc3NhZ2VzID0gZXJyb3JzLm1hcChmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5tZXNzYWdlOyB9KTtcbiAgICByZXR1cm4gY3JlYXRlRXJyb3IoWydFcnJvcnM6J10uY29uY2F0KG1lc3NhZ2VzKS5qb2luKCdcXG4tICcpLCBlcnJvcnNbMF0uaW50ZXJ2YWwpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0gc2VtYW50aWMgLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIG1pc3NpbmdTZW1hbnRpY0FjdGlvbihjdG9yTmFtZSwgbmFtZSwgdHlwZSwgc3RhY2spIHtcbiAgICB2YXIgc3RhY2tUcmFjZSA9IHN0YWNrLnNsaWNlKDAsIC0xKS5tYXAoZnVuY3Rpb24gKGluZm8pIHtcbiAgICAgICAgdmFyIGFucyA9ICcgICcgKyBpbmZvWzBdLm5hbWUgKyAnID4gJyArIGluZm9bMV07XG4gICAgICAgIHJldHVybiBpbmZvLmxlbmd0aCA9PT0gM1xuICAgICAgICAgICAgPyBhbnMgKyBcIiBmb3IgJ1wiICsgaW5mb1syXSArIFwiJ1wiXG4gICAgICAgICAgICA6IGFucztcbiAgICB9KS5qb2luKCdcXG4nKTtcbiAgICBzdGFja1RyYWNlICs9ICdcXG4gICcgKyBuYW1lICsgJyA+ICcgKyBjdG9yTmFtZTtcbiAgICB2YXIgd2hlcmUgPSB0eXBlICsgXCIgJ1wiICsgbmFtZSArIFwiJ1wiO1xuICAgIHZhciBtZXNzYWdlID0gXCJNaXNzaW5nIHNlbWFudGljIGFjdGlvbiBmb3IgJ1wiICsgY3Rvck5hbWUgKyBcIicgaW4gXCIgKyB3aGVyZSArICdcXG4nICtcbiAgICAgICAgJ0FjdGlvbiBzdGFjayAobW9zdCByZWNlbnQgY2FsbCBsYXN0KTpcXG4nICsgc3RhY2tUcmFjZTtcbiAgICB2YXIgZSA9IGNyZWF0ZUVycm9yKG1lc3NhZ2UpO1xuICAgIGUubmFtZSA9ICdtaXNzaW5nU2VtYW50aWNBY3Rpb24nO1xuICAgIHJldHVybiBlO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBhcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dDogYXBwbGljYXRpb25PZlN5bnRhY3RpY1J1bGVGcm9tTGV4aWNhbENvbnRleHQsXG4gICAgY2Fubm90RXh0ZW5kVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdEV4dGVuZFVuZGVjbGFyZWRSdWxlLFxuICAgIGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGU6IGNhbm5vdE92ZXJyaWRlVW5kZWNsYXJlZFJ1bGUsXG4gICAgZHVwbGljYXRlR3JhbW1hckRlY2xhcmF0aW9uOiBkdXBsaWNhdGVHcmFtbWFyRGVjbGFyYXRpb24sXG4gICAgZHVwbGljYXRlUGFyYW1ldGVyTmFtZXM6IGR1cGxpY2F0ZVBhcmFtZXRlck5hbWVzLFxuICAgIGR1cGxpY2F0ZVByb3BlcnR5TmFtZXM6IGR1cGxpY2F0ZVByb3BlcnR5TmFtZXMsXG4gICAgZHVwbGljYXRlUnVsZURlY2xhcmF0aW9uOiBkdXBsaWNhdGVSdWxlRGVjbGFyYXRpb24sXG4gICAgaW5jb25zaXN0ZW50QXJpdHk6IGluY29uc2lzdGVudEFyaXR5LFxuICAgIGluY29ycmVjdEFyZ3VtZW50VHlwZTogaW5jb3JyZWN0QXJndW1lbnRUeXBlLFxuICAgIGludGVydmFsU291cmNlc0RvbnRNYXRjaDogaW50ZXJ2YWxTb3VyY2VzRG9udE1hdGNoLFxuICAgIGludmFsaWRDb25zdHJ1Y3RvckNhbGw6IGludmFsaWRDb25zdHJ1Y3RvckNhbGwsXG4gICAgaW52YWxpZFBhcmFtZXRlcjogaW52YWxpZFBhcmFtZXRlcixcbiAgICBncmFtbWFyU3ludGF4RXJyb3I6IGdyYW1tYXJTeW50YXhFcnJvcixcbiAgICBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kOiBrbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kLFxuICAgIG1pc3NpbmdTZW1hbnRpY0FjdGlvbjogbWlzc2luZ1NlbWFudGljQWN0aW9uLFxuICAgIHVuZGVjbGFyZWRHcmFtbWFyOiB1bmRlY2xhcmVkR3JhbW1hcixcbiAgICB1bmRlY2xhcmVkUnVsZTogdW5kZWNsYXJlZFJ1bGUsXG4gICAgd3JvbmdOdW1iZXJPZkFyZ3VtZW50czogd3JvbmdOdW1iZXJPZkFyZ3VtZW50cyxcbiAgICB3cm9uZ051bWJlck9mUGFyYW1ldGVyczogd3JvbmdOdW1iZXJPZlBhcmFtZXRlcnMsXG4gICAgdGhyb3dFcnJvcnM6IGZ1bmN0aW9uIChlcnJvcnMpIHtcbiAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yc1swXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIHRocm93IG11bHRpcGxlRXJyb3JzKGVycm9ycyk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiLyogZ2xvYmFsIGRvY3VtZW50LCBYTUxIdHRwUmVxdWVzdCAqL1xuJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgQnVpbGRlciA9IHJlcXVpcmUoJy4vQnVpbGRlcicpO1xudmFyIEdyYW1tYXIgPSByZXF1aXJlKCcuL0dyYW1tYXInKTtcbnZhciBOYW1lc3BhY2UgPSByZXF1aXJlKCcuL05hbWVzcGFjZScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbnZhciB2ZXJzaW9uID0gcmVxdWlyZSgnLi92ZXJzaW9uJyk7XG52YXIgaXNCdWZmZXIgPSByZXF1aXJlKCdpcy1idWZmZXInKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQcml2YXRlIHN0dWZmXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhlIG1ldGFncmFtbWFyLCBpLmUuIHRoZSBncmFtbWFyIGZvciBPaG0gZ3JhbW1hcnMuIEluaXRpYWxpemVkIGF0IHRoZVxuLy8gYm90dG9tIG9mIHRoaXMgZmlsZSBiZWNhdXNlIGxvYWRpbmcgdGhlIGdyYW1tYXIgcmVxdWlyZXMgT2htIGl0c2VsZi5cbnZhciBvaG1HcmFtbWFyO1xuLy8gQW4gb2JqZWN0IHdoaWNoIG1ha2VzIGl0IHBvc3NpYmxlIHRvIHN0dWIgb3V0IHRoZSBkb2N1bWVudCBBUEkgZm9yIHRlc3RpbmcuXG52YXIgZG9jdW1lbnRJbnRlcmZhY2UgPSB7XG4gICAgcXVlcnlTZWxlY3RvcjogZnVuY3Rpb24gKHNlbCkgeyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWwpOyB9LFxuICAgIHF1ZXJ5U2VsZWN0b3JBbGw6IGZ1bmN0aW9uIChzZWwpIHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKTsgfVxufTtcbi8vIENoZWNrIGlmIGBvYmpgIGlzIGEgRE9NIGVsZW1lbnQuXG5mdW5jdGlvbiBpc0VsZW1lbnQob2JqKSB7XG4gICAgcmV0dXJuICEhKG9iaiAmJiBvYmoubm9kZVR5cGUgPT09IDEpO1xufVxuZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdm9pZCAwOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXZvaWRcbn1cbnZhciBNQVhfQVJSQVlfSU5ERVggPSBNYXRoLnBvdygyLCA1MykgLSAxO1xuZnVuY3Rpb24gaXNBcnJheUxpa2Uob2JqKSB7XG4gICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGg7XG4gICAgcmV0dXJuIHR5cGVvZiBsZW5ndGggPT09ICdudW1iZXInICYmIGxlbmd0aCA+PSAwICYmIGxlbmd0aCA8PSBNQVhfQVJSQVlfSU5ERVg7XG59XG4vLyBUT0RPOiBqdXN0IHVzZSB0aGUgalF1ZXJ5IHRoaW5nXG5mdW5jdGlvbiBsb2FkKHVybCkge1xuICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXEub3BlbignR0VUJywgdXJsLCBmYWxzZSk7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVxLnNlbmQoKTtcbiAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT09IDAgfHwgcmVxLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVxLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjYXRjaCAoZSkgeyB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmFibGUgdG8gbG9hZCB1cmwgJyArIHVybCk7XG59XG4vLyBSZXR1cm5zIGEgR3JhbW1hciBpbnN0YW5jZSAoaS5lLiwgYW4gb2JqZWN0IHdpdGggYSBgbWF0Y2hgIG1ldGhvZCkgZm9yXG4vLyBgdHJlZWAsIHdoaWNoIGlzIHRoZSBjb25jcmV0ZSBzeW50YXggdHJlZSBvZiBhIHVzZXItd3JpdHRlbiBncmFtbWFyLlxuLy8gVGhlIGdyYW1tYXIgd2lsbCBiZSBhc3NpZ25lZCBpbnRvIGBuYW1lc3BhY2VgIHVuZGVyIHRoZSBuYW1lIG9mIHRoZSBncmFtbWFyXG4vLyBhcyBzcGVjaWZpZWQgaW4gdGhlIHNvdXJjZS5cbmZ1bmN0aW9uIGJ1aWxkR3JhbW1hcihtYXRjaCwgbmFtZXNwYWNlLCBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZykge1xuICAgIHZhciBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICB2YXIgZGVjbDtcbiAgICB2YXIgY3VycmVudFJ1bGVOYW1lO1xuICAgIHZhciBjdXJyZW50UnVsZUZvcm1hbHM7XG4gICAgdmFyIG92ZXJyaWRpbmcgPSBmYWxzZTtcbiAgICB2YXIgbWV0YUdyYW1tYXIgPSBvcHRPaG1HcmFtbWFyRm9yVGVzdGluZyB8fCBvaG1HcmFtbWFyO1xuICAgIC8vIEEgdmlzaXRvciB0aGF0IHByb2R1Y2VzIGEgR3JhbW1hciBpbnN0YW5jZSBmcm9tIHRoZSBDU1QuXG4gICAgdmFyIGhlbHBlcnMgPSBtZXRhR3JhbW1hci5jcmVhdGVTZW1hbnRpY3MoKS5hZGRPcGVyYXRpb24oJ3Zpc2l0Jywge1xuICAgICAgICBHcmFtbWFyOiBmdW5jdGlvbiAobiwgcywgb3BlbiwgcnMsIGNsb3NlKSB7XG4gICAgICAgICAgICB2YXIgZ3JhbW1hck5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBkZWNsID0gYnVpbGRlci5uZXdHcmFtbWFyKGdyYW1tYXJOYW1lLCBuYW1lc3BhY2UpO1xuICAgICAgICAgICAgcy52aXNpdCgpO1xuICAgICAgICAgICAgcnMudmlzaXQoKTtcbiAgICAgICAgICAgIHZhciBnID0gZGVjbC5idWlsZCgpO1xuICAgICAgICAgICAgZy5zb3VyY2UgPSB0aGlzLnNvdXJjZS50cmltbWVkKCk7XG4gICAgICAgICAgICBpZiAoZ3JhbW1hck5hbWUgaW4gbmFtZXNwYWNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmR1cGxpY2F0ZUdyYW1tYXJEZWNsYXJhdGlvbihnLCBuYW1lc3BhY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmFtZXNwYWNlW2dyYW1tYXJOYW1lXSA9IGc7XG4gICAgICAgICAgICByZXR1cm4gZztcbiAgICAgICAgfSxcbiAgICAgICAgU3VwZXJHcmFtbWFyOiBmdW5jdGlvbiAoXywgbikge1xuICAgICAgICAgICAgdmFyIHN1cGVyR3JhbW1hck5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBpZiAoc3VwZXJHcmFtbWFyTmFtZSA9PT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgZGVjbC53aXRoU3VwZXJHcmFtbWFyKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc3BhY2UgfHwgIShzdXBlckdyYW1tYXJOYW1lIGluIG5hbWVzcGFjZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRHcmFtbWFyKHN1cGVyR3JhbW1hck5hbWUsIG5hbWVzcGFjZSwgbi5zb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkZWNsLndpdGhTdXBlckdyYW1tYXIobmFtZXNwYWNlW3N1cGVyR3JhbW1hck5hbWVdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgUnVsZV9kZWZpbmU6IGZ1bmN0aW9uIChuLCBmcywgZCwgXywgYikge1xuICAgICAgICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGRlZmF1bHQgc3RhcnQgcnVsZSB5ZXQsIHNldCBpdCBub3cuIFRoaXMgbXVzdCBiZSBkb25lIGJlZm9yZSB2aXNpdGluZ1xuICAgICAgICAgICAgLy8gdGhlIGJvZHksIGJlY2F1c2UgaXQgbWlnaHQgY29udGFpbiBhbiBpbmxpbmUgcnVsZSBkZWZpbml0aW9uLlxuICAgICAgICAgICAgaWYgKCFkZWNsLmRlZmF1bHRTdGFydFJ1bGUgJiYgZGVjbC5lbnN1cmVTdXBlckdyYW1tYXIoKSAhPT0gR3JhbW1hci5Qcm90b0J1aWx0SW5SdWxlcykge1xuICAgICAgICAgICAgICAgIGRlY2wud2l0aERlZmF1bHRTdGFydFJ1bGUoY3VycmVudFJ1bGVOYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBib2R5ID0gYi52aXNpdCgpO1xuICAgICAgICAgICAgdmFyIGRlc2NyaXB0aW9uID0gZC52aXNpdCgpWzBdO1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IHRoaXMuc291cmNlLnRyaW1tZWQoKTtcbiAgICAgICAgICAgIHJldHVybiBkZWNsLmRlZmluZShjdXJyZW50UnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgZGVzY3JpcHRpb24sIHNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFJ1bGVfb3ZlcnJpZGU6IGZ1bmN0aW9uIChuLCBmcywgXywgYikge1xuICAgICAgICAgICAgY3VycmVudFJ1bGVOYW1lID0gbi52aXNpdCgpO1xuICAgICAgICAgICAgY3VycmVudFJ1bGVGb3JtYWxzID0gZnMudmlzaXQoKVswXSB8fCBbXTtcbiAgICAgICAgICAgIG92ZXJyaWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgdmFyIGFucyA9IGRlY2wub3ZlcnJpZGUoY3VycmVudFJ1bGVOYW1lLCBjdXJyZW50UnVsZUZvcm1hbHMsIGJvZHksIG51bGwsIHNvdXJjZSk7XG4gICAgICAgICAgICBvdmVycmlkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gYW5zO1xuICAgICAgICB9LFxuICAgICAgICBSdWxlX2V4dGVuZDogZnVuY3Rpb24gKG4sIGZzLCBfLCBiKSB7XG4gICAgICAgICAgICBjdXJyZW50UnVsZU5hbWUgPSBuLnZpc2l0KCk7XG4gICAgICAgICAgICBjdXJyZW50UnVsZUZvcm1hbHMgPSBmcy52aXNpdCgpWzBdIHx8IFtdO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgdmFyIGFucyA9IGRlY2wuZXh0ZW5kKGN1cnJlbnRSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgICAgICAgcmV0dXJuIGFucztcbiAgICAgICAgfSxcbiAgICAgICAgUnVsZUJvZHk6IGZ1bmN0aW9uIChfLCB0ZXJtcykge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSB0ZXJtcy52aXNpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBGb3JtYWxzOiBmdW5jdGlvbiAob3BvaW50eSwgZnMsIGNwb2ludHkpIHtcbiAgICAgICAgICAgIHJldHVybiBmcy52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBQYXJhbXM6IGZ1bmN0aW9uIChvcG9pbnR5LCBwcywgY3BvaW50eSkge1xuICAgICAgICAgICAgcmV0dXJuIHBzLnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIEFsdDogZnVuY3Rpb24gKHNlcXMpIHtcbiAgICAgICAgICAgIHZhciBhcmdzID0gc2Vxcy52aXNpdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYWx0LmFwcGx5KGJ1aWxkZXIsIGFyZ3MpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBUb3BMZXZlbFRlcm1faW5saW5lOiBmdW5jdGlvbiAoYiwgbikge1xuICAgICAgICAgICAgdmFyIGlubGluZVJ1bGVOYW1lID0gY3VycmVudFJ1bGVOYW1lICsgJ18nICsgbi52aXNpdCgpO1xuICAgICAgICAgICAgdmFyIGJvZHkgPSBiLnZpc2l0KCk7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gdGhpcy5zb3VyY2UudHJpbW1lZCgpO1xuICAgICAgICAgICAgdmFyIGlzTmV3UnVsZURlY2xhcmF0aW9uID0gIShkZWNsLnN1cGVyR3JhbW1hciAmJiBkZWNsLnN1cGVyR3JhbW1hci5ydWxlc1tpbmxpbmVSdWxlTmFtZV0pO1xuICAgICAgICAgICAgaWYgKG92ZXJyaWRpbmcgJiYgIWlzTmV3UnVsZURlY2xhcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgZGVjbC5vdmVycmlkZShpbmxpbmVSdWxlTmFtZSwgY3VycmVudFJ1bGVGb3JtYWxzLCBib2R5LCBudWxsLCBzb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVjbC5kZWZpbmUoaW5saW5lUnVsZU5hbWUsIGN1cnJlbnRSdWxlRm9ybWFscywgYm9keSwgbnVsbCwgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBwYXJhbXMgPSBjdXJyZW50UnVsZUZvcm1hbHMubWFwKGZ1bmN0aW9uIChmb3JtYWwpIHsgcmV0dXJuIGJ1aWxkZXIuYXBwKGZvcm1hbCk7IH0pO1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuYXBwKGlubGluZVJ1bGVOYW1lLCBwYXJhbXMpLndpdGhTb3VyY2UoYm9keS5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBTZXE6IGZ1bmN0aW9uIChleHByKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5zZXEuYXBwbHkoYnVpbGRlciwgZXhwci52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgSXRlcl9zdGFyOiBmdW5jdGlvbiAoeCwgXykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIuc3Rhcih4LnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBJdGVyX3BsdXM6IGZ1bmN0aW9uICh4LCBfKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5wbHVzKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIEl0ZXJfb3B0OiBmdW5jdGlvbiAoeCwgXykge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIub3B0KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFByZWRfbm90OiBmdW5jdGlvbiAoXywgeCkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIubm90KHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFByZWRfbG9va2FoZWFkOiBmdW5jdGlvbiAoXywgeCkge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIubG9va2FoZWFkKHgudmlzaXQoKSkud2l0aFNvdXJjZSh0aGlzLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIExleF9sZXg6IGZ1bmN0aW9uIChfLCB4KSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5sZXgoeC52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9hcHBsaWNhdGlvbjogZnVuY3Rpb24gKHJ1bGUsIHBzKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5hcHAocnVsZS52aXNpdCgpLCBwcy52aXNpdCgpWzBdIHx8IFtdKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9yYW5nZTogZnVuY3Rpb24gKGZyb20sIF8sIHRvKSB7XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5yYW5nZShmcm9tLnZpc2l0KCksIHRvLnZpc2l0KCkpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICBCYXNlX3Rlcm1pbmFsOiBmdW5jdGlvbiAoZXhwcikge1xuICAgICAgICAgICAgcmV0dXJuIGJ1aWxkZXIudGVybWluYWwoZXhwci52aXNpdCgpKS53aXRoU291cmNlKHRoaXMuc291cmNlKTtcbiAgICAgICAgfSxcbiAgICAgICAgQmFzZV9wYXJlbjogZnVuY3Rpb24gKG9wZW4sIHgsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4geC52aXNpdCgpO1xuICAgICAgICB9LFxuICAgICAgICBydWxlRGVzY3I6IGZ1bmN0aW9uIChvcGVuLCB0LCBjbG9zZSkge1xuICAgICAgICAgICAgcmV0dXJuIHQudmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgcnVsZURlc2NyVGV4dDogZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZy50cmltKCk7XG4gICAgICAgIH0sXG4gICAgICAgIGNhc2VOYW1lOiBmdW5jdGlvbiAoXywgc3BhY2UxLCBuLCBzcGFjZTIsIGVuZCkge1xuICAgICAgICAgICAgcmV0dXJuIG4udmlzaXQoKTtcbiAgICAgICAgfSxcbiAgICAgICAgbmFtZTogZnVuY3Rpb24gKGZpcnN0LCByZXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2VTdHJpbmc7XG4gICAgICAgIH0sXG4gICAgICAgIG5hbWVGaXJzdDogZnVuY3Rpb24gKGV4cHIpIHsgfSxcbiAgICAgICAgbmFtZVJlc3Q6IGZ1bmN0aW9uIChleHByKSB7IH0sXG4gICAgICAgIHRlcm1pbmFsOiBmdW5jdGlvbiAob3BlbiwgY3MsIGNsb3NlKSB7XG4gICAgICAgICAgICByZXR1cm4gY3MudmlzaXQoKS5qb2luKCcnKTtcbiAgICAgICAgfSxcbiAgICAgICAgb25lQ2hhclRlcm1pbmFsOiBmdW5jdGlvbiAob3BlbiwgYywgY2xvc2UpIHtcbiAgICAgICAgICAgIHJldHVybiBjLnZpc2l0KCk7XG4gICAgICAgIH0sXG4gICAgICAgIHRlcm1pbmFsQ2hhcjogZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgICAgIHJldHVybiBjb21tb24udW5lc2NhcGVDaGFyKHRoaXMuc291cmNlU3RyaW5nKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXNjYXBlQ2hhcjogZnVuY3Rpb24gKF8pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNvdXJjZVN0cmluZztcbiAgICAgICAgfSxcbiAgICAgICAgTm9uZW1wdHlMaXN0T2Y6IGZ1bmN0aW9uICh4LCBfLCB4cykge1xuICAgICAgICAgICAgcmV0dXJuIFt4LnZpc2l0KCldLmNvbmNhdCh4cy52aXNpdCgpKTtcbiAgICAgICAgfSxcbiAgICAgICAgRW1wdHlMaXN0T2Y6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfSxcbiAgICAgICAgX3Rlcm1pbmFsOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcmltaXRpdmVWYWx1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBoZWxwZXJzKG1hdGNoKS52aXNpdCgpO1xufVxuZnVuY3Rpb24gY29tcGlsZUFuZExvYWQoc291cmNlLCBuYW1lc3BhY2UpIHtcbiAgICB2YXIgbSA9IG9obUdyYW1tYXIubWF0Y2goc291cmNlLCAnR3JhbW1hcnMnKTtcbiAgICBpZiAobS5mYWlsZWQoKSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuZ3JhbW1hclN5bnRheEVycm9yKG0pO1xuICAgIH1cbiAgICByZXR1cm4gYnVpbGRHcmFtbWFyKG0sIG5hbWVzcGFjZSk7XG59XG4vLyBSZXR1cm4gdGhlIGNvbnRlbnRzIG9mIGEgc2NyaXB0IGVsZW1lbnQsIGZldGNoaW5nIGl0IHZpYSBYSFIgaWYgbmVjZXNzYXJ5LlxuZnVuY3Rpb24gZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKGVsKSB7XG4gICAgaWYgKCFpc0VsZW1lbnQoZWwpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGEgRE9NIE5vZGUsIGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhlbCkpO1xuICAgIH1cbiAgICBpZiAoZWwudHlwZSAhPT0gJ3RleHQvb2htLWpzJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGEgc2NyaXB0IHRhZyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLCBnb3QgJyArIGVsKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsLmdldEF0dHJpYnV0ZSgnc3JjJykgPyBsb2FkKGVsLmdldEF0dHJpYnV0ZSgnc3JjJykpIDogZWwuaW5uZXJIVE1MO1xufVxuZnVuY3Rpb24gZ3JhbW1hcihzb3VyY2UsIG9wdE5hbWVzcGFjZSkge1xuICAgIHZhciBucyA9IGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKTtcbiAgICAvLyBFbnN1cmUgdGhhdCB0aGUgc291cmNlIGNvbnRhaW5lZCBubyBtb3JlIHRoYW4gb25lIGdyYW1tYXIgZGVmaW5pdGlvbi5cbiAgICB2YXIgZ3JhbW1hck5hbWVzID0gT2JqZWN0LmtleXMobnMpO1xuICAgIGlmIChncmFtbWFyTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBncmFtbWFyIGRlZmluaXRpb24nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZ3JhbW1hck5hbWVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdmFyIHNlY29uZEdyYW1tYXIgPSBuc1tncmFtbWFyTmFtZXNbMV1dO1xuICAgICAgICB2YXIgaW50ZXJ2YWwgPSBzZWNvbmRHcmFtbWFyLnNvdXJjZTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHV0aWwuZ2V0TGluZUFuZENvbHVtbk1lc3NhZ2UoaW50ZXJ2YWwuc291cmNlU3RyaW5nLCBpbnRlcnZhbC5zdGFydElkeCkgK1xuICAgICAgICAgICAgJ0ZvdW5kIG1vcmUgdGhhbiBvbmUgZ3JhbW1hciBkZWZpbml0aW9uIC0tIHVzZSBvaG0uZ3JhbW1hcnMoKSBpbnN0ZWFkLicpO1xuICAgIH1cbiAgICByZXR1cm4gbnNbZ3JhbW1hck5hbWVzWzBdXTsgLy8gUmV0dXJuIHRoZSBvbmUgYW5kIG9ubHkgZ3JhbW1hci5cbn1cbmZ1bmN0aW9uIGdyYW1tYXJzKHNvdXJjZSwgb3B0TmFtZXNwYWNlKSB7XG4gICAgdmFyIG5zID0gTmFtZXNwYWNlLmV4dGVuZChOYW1lc3BhY2UuYXNOYW1lc3BhY2Uob3B0TmFtZXNwYWNlKSk7XG4gICAgaWYgKHR5cGVvZiBzb3VyY2UgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIEZvciBjb252ZW5pZW5jZSwgZGV0ZWN0IE5vZGUuanMgQnVmZmVyIG9iamVjdHMgYW5kIGF1dG9tYXRpY2FsbHkgY2FsbCB0b1N0cmluZygpLlxuICAgICAgICBpZiAoaXNCdWZmZXIoc291cmNlKSkge1xuICAgICAgICAgICAgc291cmNlID0gc291cmNlLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBzdHJpbmcgYXMgZmlyc3QgYXJndW1lbnQsIGdvdCAnICsgY29tbW9uLnVuZXhwZWN0ZWRPYmpUb1N0cmluZyhzb3VyY2UpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21waWxlQW5kTG9hZChzb3VyY2UsIG5zKTtcbiAgICByZXR1cm4gbnM7XG59XG5mdW5jdGlvbiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQob3B0Tm9kZSkge1xuICAgIHZhciBub2RlID0gb3B0Tm9kZTtcbiAgICBpZiAoaXNVbmRlZmluZWQobm9kZSkpIHtcbiAgICAgICAgdmFyIG5vZGVMaXN0ID0gZG9jdW1lbnRJbnRlcmZhY2UucXVlcnlTZWxlY3RvckFsbCgnc2NyaXB0W3R5cGU9XCJ0ZXh0L29obS1qc1wiXScpO1xuICAgICAgICBpZiAobm9kZUxpc3QubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIGV4YWN0bHkgb25lIHNjcmlwdCB0YWcgd2l0aCB0eXBlPVwidGV4dC9vaG0tanNcIiwgZm91bmQgJyArIG5vZGVMaXN0Lmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgbm9kZSA9IG5vZGVMaXN0WzBdO1xuICAgIH1cbiAgICByZXR1cm4gZ3JhbW1hcihnZXRTY3JpcHRFbGVtZW50Q29udGVudHMobm9kZSkpO1xufVxuZnVuY3Rpb24gZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHMob3B0Tm9kZU9yTm9kZUxpc3QpIHtcbiAgICAvLyBTaW1wbGUgY2FzZTogdGhlIGFyZ3VtZW50IGlzIGEgRE9NIG5vZGUuXG4gICAgaWYgKGlzRWxlbWVudChvcHROb2RlT3JOb2RlTGlzdCkpIHtcbiAgICAgICAgcmV0dXJuIGdyYW1tYXJzKG9wdE5vZGVPck5vZGVMaXN0KTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCBpdCBtdXN0IGJlIGVpdGhlciB1bmRlZmluZWQgb3IgYSBOb2RlTGlzdC5cbiAgICB2YXIgbm9kZUxpc3QgPSBvcHROb2RlT3JOb2RlTGlzdDtcbiAgICBpZiAoaXNVbmRlZmluZWQobm9kZUxpc3QpKSB7XG4gICAgICAgIC8vIEZpbmQgYWxsIHNjcmlwdCBlbGVtZW50cyB3aXRoIHR5cGU9XCJ0ZXh0L29obS1qc1wiLlxuICAgICAgICBub2RlTGlzdCA9IGRvY3VtZW50SW50ZXJmYWNlLnF1ZXJ5U2VsZWN0b3JBbGwoJ3NjcmlwdFt0eXBlPVwidGV4dC9vaG0tanNcIl0nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG5vZGVMaXN0ID09PSAnc3RyaW5nJyB8fCAoIWlzRWxlbWVudChub2RlTGlzdCkgJiYgIWlzQXJyYXlMaWtlKG5vZGVMaXN0KSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgYSBOb2RlLCBOb2RlTGlzdCwgb3IgQXJyYXksIGJ1dCBnb3QgJyArIG5vZGVMaXN0KTtcbiAgICB9XG4gICAgdmFyIG5zID0gTmFtZXNwYWNlLmNyZWF0ZU5hbWVzcGFjZSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZUxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgLy8gQ29weSB0aGUgbmV3IGdyYW1tYXJzIGludG8gYG5zYCB0byBrZWVwIHRoZSBuYW1lc3BhY2UgZmxhdC5cbiAgICAgICAgY29tbW9uLmV4dGVuZChucywgZ3JhbW1hcnMoZ2V0U2NyaXB0RWxlbWVudENvbnRlbnRzKG5vZGVMaXN0W2ldKSwgbnMpKTtcbiAgICB9XG4gICAgcmV0dXJuIG5zO1xufVxuZnVuY3Rpb24gbWFrZVJlY2lwZShyZWNpcGUpIHtcbiAgICBpZiAodHlwZW9mIHJlY2lwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gcmVjaXBlLmNhbGwobmV3IEJ1aWxkZXIoKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodHlwZW9mIHJlY2lwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIHN0cmluZ2lmaWVkIEpTT04gcmVjaXBlXG4gICAgICAgICAgICByZWNpcGUgPSBKU09OLnBhcnNlKHJlY2lwZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChuZXcgQnVpbGRlcigpKS5mcm9tUmVjaXBlKHJlY2lwZSk7XG4gICAgfVxufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEV4cG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTdHVmZiB0aGF0IHVzZXJzIHNob3VsZCBrbm93IGFib3V0XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjcmVhdGVOYW1lc3BhY2U6IE5hbWVzcGFjZS5jcmVhdGVOYW1lc3BhY2UsXG4gICAgZ3JhbW1hcjogZ3JhbW1hcixcbiAgICBncmFtbWFyczogZ3JhbW1hcnMsXG4gICAgZ3JhbW1hckZyb21TY3JpcHRFbGVtZW50OiBncmFtbWFyRnJvbVNjcmlwdEVsZW1lbnQsXG4gICAgZ3JhbW1hcnNGcm9tU2NyaXB0RWxlbWVudHM6IGdyYW1tYXJzRnJvbVNjcmlwdEVsZW1lbnRzLFxuICAgIG1ha2VSZWNpcGU6IG1ha2VSZWNpcGUsXG4gICAgb2htR3JhbW1hcjogbnVsbCxcbiAgICBwZXhwcnM6IHBleHBycyxcbiAgICB1dGlsOiB1dGlsLFxuICAgIGV4dHJhczogcmVxdWlyZSgnLi4vZXh0cmFzJyksXG4gICAgdmVyc2lvbjogdmVyc2lvblxufTtcbi8vIFN0dWZmIGZvciB0ZXN0aW5nLCBldGMuXG5tb2R1bGUuZXhwb3J0cy5fYnVpbGRHcmFtbWFyID0gYnVpbGRHcmFtbWFyO1xubW9kdWxlLmV4cG9ydHMuX3NldERvY3VtZW50SW50ZXJmYWNlRm9yVGVzdGluZyA9IGZ1bmN0aW9uIChkb2MpIHsgZG9jdW1lbnRJbnRlcmZhY2UgPSBkb2M7IH07XG4vLyBMYXRlIGluaXRpYWxpemF0aW9uIGZvciBzdHVmZiB0aGF0IGlzIGJvb3RzdHJhcHBlZC5cbkdyYW1tYXIuQnVpbHRJblJ1bGVzID0gcmVxdWlyZSgnLi4vZGlzdC9idWlsdC1pbi1ydWxlcycpO1xudXRpbC5hbm5vdW5jZUJ1aWx0SW5SdWxlcyhHcmFtbWFyLkJ1aWx0SW5SdWxlcyk7XG5tb2R1bGUuZXhwb3J0cy5vaG1HcmFtbWFyID0gb2htR3JhbW1hciA9IHJlcXVpcmUoJy4uL2Rpc3Qvb2htLWdyYW1tYXInKTtcbkdyYW1tYXIuaW5pdEFwcGxpY2F0aW9uUGFyc2VyKG9obUdyYW1tYXIsIGJ1aWxkR3JhbW1hcik7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIE5vZGUoZ3JhbW1hciwgY3Rvck5hbWUsIG1hdGNoTGVuZ3RoKSB7XG4gICAgdGhpcy5ncmFtbWFyID0gZ3JhbW1hcjtcbiAgICB0aGlzLmN0b3JOYW1lID0gY3Rvck5hbWU7XG4gICAgdGhpcy5tYXRjaExlbmd0aCA9IG1hdGNoTGVuZ3RoO1xufVxuTm9kZS5wcm90b3R5cGUubnVtQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4gPyB0aGlzLmNoaWxkcmVuLmxlbmd0aCA6IDA7XG59O1xuTm9kZS5wcm90b3R5cGUuY2hpbGRBdCA9IGZ1bmN0aW9uIChpZHgpIHtcbiAgICBpZiAodGhpcy5jaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZHJlbltpZHhdO1xuICAgIH1cbn07XG5Ob2RlLnByb3RvdHlwZS5pbmRleE9mQ2hpbGQgPSBmdW5jdGlvbiAoYXJnKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uaW5kZXhPZihhcmcpO1xufTtcbk5vZGUucHJvdG90eXBlLmhhc0NoaWxkcmVuID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm51bUNoaWxkcmVuKCkgPiAxO1xufTtcbk5vZGUucHJvdG90eXBlLmhhc05vQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICF0aGlzLmhhc0NoaWxkcmVuKCk7XG59O1xuTm9kZS5wcm90b3R5cGUub25seUNoaWxkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLm51bUNoaWxkcmVuKCkgIT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3QgZ2V0IG9ubHkgY2hpbGQgb2YgYSBub2RlIG9mIHR5cGUgJyArIHRoaXMuY3Rvck5hbWUgK1xuICAgICAgICAgICAgJyAoaXQgaGFzICcgKyB0aGlzLm51bUNoaWxkcmVuKCkgKyAnIGNoaWxkcmVuKScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlyc3RDaGlsZCgpO1xuICAgIH1cbn07XG5Ob2RlLnByb3RvdHlwZS5maXJzdENoaWxkID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmhhc05vQ2hpbGRyZW4oKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgZmlyc3QgY2hpbGQgb2YgYSAnICsgdGhpcy5jdG9yTmFtZSArICcgbm9kZSwgd2hpY2ggaGFzIG5vIGNoaWxkcmVuJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KDApO1xuICAgIH1cbn07XG5Ob2RlLnByb3RvdHlwZS5sYXN0Q2hpbGQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuaGFzTm9DaGlsZHJlbigpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBsYXN0IGNoaWxkIG9mIGEgJyArIHRoaXMuY3Rvck5hbWUgKyAnIG5vZGUsIHdoaWNoIGhhcyBubyBjaGlsZHJlbicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRBdCh0aGlzLm51bUNoaWxkcmVuKCkgLSAxKTtcbiAgICB9XG59O1xuTm9kZS5wcm90b3R5cGUuY2hpbGRCZWZvcmUgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gICAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRCZWZvcmUoKSBjYWxsZWQgdy8gYW4gYXJndW1lbnQgdGhhdCBpcyBub3QgYSBjaGlsZCcpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjaGlsZElkeCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBnZXQgY2hpbGQgYmVmb3JlIGZpcnN0IGNoaWxkJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4IC0gMSk7XG4gICAgfVxufTtcbk5vZGUucHJvdG90eXBlLmNoaWxkQWZ0ZXIgPSBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICB2YXIgY2hpbGRJZHggPSB0aGlzLmluZGV4T2ZDaGlsZChjaGlsZCk7XG4gICAgaWYgKGNoaWxkSWR4IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vZGUuY2hpbGRBZnRlcigpIGNhbGxlZCB3LyBhbiBhcmd1bWVudCB0aGF0IGlzIG5vdCBhIGNoaWxkJyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGNoaWxkSWR4ID09PSB0aGlzLm51bUNoaWxkcmVuKCkgLSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY2Fubm90IGdldCBjaGlsZCBhZnRlciBsYXN0IGNoaWxkJyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5jaGlsZEF0KGNoaWxkSWR4ICsgMSk7XG4gICAgfVxufTtcbk5vZGUucHJvdG90eXBlLmlzVGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbk5vZGUucHJvdG90eXBlLmlzTm9udGVybWluYWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbk5vZGUucHJvdG90eXBlLmlzSXRlcmF0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5Ob2RlLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5Ob2RlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHIgPSB7fTtcbiAgICByW3RoaXMuY3Rvck5hbWVdID0gdGhpcy5jaGlsZHJlbjtcbiAgICByZXR1cm4gcjtcbn07XG4vLyBUZXJtaW5hbHNcbmZ1bmN0aW9uIFRlcm1pbmFsTm9kZShncmFtbWFyLCB2YWx1ZSkge1xuICAgIHZhciBtYXRjaExlbmd0aCA9IHZhbHVlID8gdmFsdWUubGVuZ3RoIDogMDtcbiAgICBOb2RlLmNhbGwodGhpcywgZ3JhbW1hciwgJ190ZXJtaW5hbCcsIG1hdGNoTGVuZ3RoKTtcbiAgICB0aGlzLnByaW1pdGl2ZVZhbHVlID0gdmFsdWU7XG59XG5pbmhlcml0cyhUZXJtaW5hbE5vZGUsIE5vZGUpO1xuVGVybWluYWxOb2RlLnByb3RvdHlwZS5pc1Rlcm1pbmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0cnVlO1xufTtcblRlcm1pbmFsTm9kZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByID0ge307XG4gICAgclt0aGlzLmN0b3JOYW1lXSA9IHRoaXMucHJpbWl0aXZlVmFsdWU7XG4gICAgcmV0dXJuIHI7XG59O1xuLy8gTm9udGVybWluYWxzXG5mdW5jdGlvbiBOb250ZXJtaW5hbE5vZGUoZ3JhbW1hciwgcnVsZU5hbWUsIGNoaWxkcmVuLCBjaGlsZE9mZnNldHMsIG1hdGNoTGVuZ3RoKSB7XG4gICAgTm9kZS5jYWxsKHRoaXMsIGdyYW1tYXIsIHJ1bGVOYW1lLCBtYXRjaExlbmd0aCk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIHRoaXMuY2hpbGRPZmZzZXRzID0gY2hpbGRPZmZzZXRzO1xufVxuaW5oZXJpdHMoTm9udGVybWluYWxOb2RlLCBOb2RlKTtcbk5vbnRlcm1pbmFsTm9kZS5wcm90b3R5cGUuaXNOb250ZXJtaW5hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5Ob250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzTGV4aWNhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gY29tbW9uLmlzTGV4aWNhbCh0aGlzLmN0b3JOYW1lKTtcbn07XG5Ob250ZXJtaW5hbE5vZGUucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5jdG9yTmFtZSk7XG59O1xuLy8gSXRlcmF0aW9uc1xuZnVuY3Rpb24gSXRlcmF0aW9uTm9kZShncmFtbWFyLCBjaGlsZHJlbiwgY2hpbGRPZmZzZXRzLCBtYXRjaExlbmd0aCwgaXNPcHRpb25hbCkge1xuICAgIE5vZGUuY2FsbCh0aGlzLCBncmFtbWFyLCAnX2l0ZXInLCBtYXRjaExlbmd0aCk7XG4gICAgdGhpcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIHRoaXMuY2hpbGRPZmZzZXRzID0gY2hpbGRPZmZzZXRzO1xuICAgIHRoaXMub3B0aW9uYWwgPSBpc09wdGlvbmFsO1xufVxuaW5oZXJpdHMoSXRlcmF0aW9uTm9kZSwgTm9kZSk7XG5JdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc0l0ZXJhdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5JdGVyYXRpb25Ob2RlLnByb3RvdHlwZS5pc09wdGlvbmFsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbmFsO1xufTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgTm9kZTogTm9kZSxcbiAgICBUZXJtaW5hbE5vZGU6IFRlcm1pbmFsTm9kZSxcbiAgICBOb250ZXJtaW5hbE5vZGU6IE5vbnRlcm1pbmFsTm9kZSxcbiAgICBJdGVyYXRpb25Ob2RlOiBJdGVyYXRpb25Ob2RlXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKlxuICBSZXR1cm4gdHJ1ZSBpZiB3ZSBzaG91bGQgc2tpcCBzcGFjZXMgcHJlY2VkaW5nIHRoaXMgZXhwcmVzc2lvbiBpbiBhIHN5bnRhY3RpYyBjb250ZXh0LlxuKi9cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGNvbW1vbi5hYnN0cmFjdCgnYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZScpO1xuLypcbiAgR2VuZXJhbGx5LCB0aGVzZSBhcmUgYWxsIGZpcnN0LW9yZGVyIGV4cHJlc3Npb25zIGFuZCAod2l0aCB0aGUgZXhjZXB0aW9uIG9mIEFwcGx5KVxuICBkaXJlY3RseSByZWFkIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiovXG5wZXhwcnMuYW55LmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgIHBleHBycy5lbmQuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgIHBleHBycy5BcHBseS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9O1xuLypcbiAgSGlnaGVyLW9yZGVyIGV4cHJlc3Npb25zIHRoYXQgZG9uJ3QgZGlyZWN0bHkgY29uc3VtZSBpbnB1dC5cbiovXG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID1cbiAgICBwZXhwcnMuSXRlci5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgIHBleHBycy5MZXgucHJvdG90eXBlLmFsbG93c1NraXBwaW5nUHJlY2VkaW5nU3BhY2UgPVxuICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUuYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZSA9XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuU2VxLnByb3RvdHlwZS5hbGxvd3NTa2lwcGluZ1ByZWNlZGluZ1NwYWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIGVycm9ycyA9IHJlcXVpcmUoJy4vZXJyb3JzJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG52YXIgQnVpbHRJblJ1bGVzO1xudXRpbC5hd2FpdEJ1aWx0SW5SdWxlcyhmdW5jdGlvbiAoZykgeyBCdWlsdEluUnVsZXMgPSBnOyB9KTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGxleGlmeUNvdW50O1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCA9IGZ1bmN0aW9uIChydWxlTmFtZSwgZ3JhbW1hcikge1xuICAgIGxleGlmeUNvdW50ID0gMDtcbiAgICB0aGlzLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG59O1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBjb21tb24uYWJzdHJhY3QoJ19hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZCcpO1xucGV4cHJzLmFueS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgIHBleHBycy5lbmQuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICAgICAgcGV4cHJzLlJhbmdlLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vLW9wXG4gICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICBsZXhpZnlDb3VudCsrO1xuICAgIHRoaXMuZXhwci5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgIGxleGlmeUNvdW50LS07XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID0gZnVuY3Rpb24gKHJ1bGVOYW1lLCBncmFtbWFyKSB7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMudGVybXNbaWR4XS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgIH1cbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLmZhY3RvcnNbaWR4XS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgIH1cbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuX2Fzc2VydEFsbEFwcGxpY2F0aW9uc0FyZVZhbGlkID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPVxuICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICAgICAgICAgIHRoaXMuZXhwci5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQocnVsZU5hbWUsIGdyYW1tYXIpO1xuICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5fYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQgPSBmdW5jdGlvbiAocnVsZU5hbWUsIGdyYW1tYXIpIHtcbiAgICB2YXIgcnVsZUluZm8gPSBncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdO1xuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHRoZSBydWxlIGV4aXN0cy4uLlxuICAgIGlmICghcnVsZUluZm8pIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLnVuZGVjbGFyZWRSdWxlKHRoaXMucnVsZU5hbWUsIGdyYW1tYXIubmFtZSwgdGhpcy5zb3VyY2UpO1xuICAgIH1cbiAgICAvLyAuLi5hbmQgdGhhdCB0aGlzIGFwcGxpY2F0aW9uIGlzIGFsbG93ZWRcbiAgICBpZiAoY29tbW9uLmlzU3ludGFjdGljKHRoaXMucnVsZU5hbWUpICYmICghY29tbW9uLmlzU3ludGFjdGljKHJ1bGVOYW1lKSB8fCBsZXhpZnlDb3VudCA+IDApKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5hcHBsaWNhdGlvbk9mU3ludGFjdGljUnVsZUZyb21MZXhpY2FsQ29udGV4dCh0aGlzLnJ1bGVOYW1lLCB0aGlzKTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHRoYXQgdGhpcyBhcHBsaWNhdGlvbiBoYXMgdGhlIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50c1xuICAgIHZhciBhY3R1YWwgPSB0aGlzLmFyZ3MubGVuZ3RoO1xuICAgIHZhciBleHBlY3RlZCA9IHJ1bGVJbmZvLmZvcm1hbHMubGVuZ3RoO1xuICAgIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgICAgIHRocm93IGVycm9ycy53cm9uZ051bWJlck9mQXJndW1lbnRzKHRoaXMucnVsZU5hbWUsIGV4cGVjdGVkLCBhY3R1YWwsIHRoaXMuc291cmNlKTtcbiAgICB9XG4gICAgLy8gLi4uYW5kIHRoYXQgYWxsIG9mIHRoZSBhcmd1bWVudCBleHByZXNzaW9ucyBvbmx5IGhhdmUgdmFsaWQgYXBwbGljYXRpb25zIGFuZCBoYXZlIGFyaXR5IDEuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMuYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgYXJnLl9hc3NlcnRBbGxBcHBsaWNhdGlvbnNBcmVWYWxpZChydWxlTmFtZSwgZ3JhbW1hcik7XG4gICAgICAgIGlmIChhcmcuZ2V0QXJpdHkoKSAhPT0gMSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmludmFsaWRQYXJhbWV0ZXIoc2VsZi5ydWxlTmFtZSwgYXJnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIC8vIEV4dHJhIGNoZWNrcyBmb3IgXCJzcGVjaWFsXCIgYXBwbGljYXRpb25zXG4gICAgLy8gSWYgaXQncyBhbiBhcHBsaWNhdGlvbiBvZiAnY2FzZUluc2Vuc2l0aXZlJywgZW5zdXJlIHRoYXQgdGhlIGFyZ3VtZW50IGlzIGEgVGVybWluYWwuXG4gICAgaWYgKEJ1aWx0SW5SdWxlcyAmJiBydWxlSW5mbyA9PT0gQnVpbHRJblJ1bGVzLnJ1bGVzLmNhc2VJbnNlbnNpdGl2ZSkge1xuICAgICAgICBpZiAoISh0aGlzLmFyZ3NbMF0gaW5zdGFuY2VvZiBwZXhwcnMuVGVybWluYWwpKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcnMuaW5jb3JyZWN0QXJndW1lbnRUeXBlKCdhIFRlcm1pbmFsIChlLmcuIFxcXCJhYmNcXFwiKScsIHRoaXMuYXJnc1swXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBjb21tb24uYWJzdHJhY3QoJ2Fzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5Jyk7XG5wZXhwcnMuYW55LmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICBwZXhwcnMuZW5kLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgcGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICAgICAgcGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vLW9wXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICBpZiAodGhpcy50ZXJtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgYXJpdHkgPSB0aGlzLnRlcm1zWzBdLmdldEFyaXR5KCk7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy50ZXJtcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHZhciB0ZXJtID0gdGhpcy50ZXJtc1tpZHhdO1xuICAgICAgICB0ZXJtLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5KCk7XG4gICAgICAgIHZhciBvdGhlckFyaXR5ID0gdGVybS5nZXRBcml0eSgpO1xuICAgICAgICBpZiAoYXJpdHkgIT09IG90aGVyQXJpdHkpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9ycy5pbmNvbnNpc3RlbnRBcml0eShydWxlTmFtZSwgYXJpdHksIG90aGVyQXJpdHksIHRlcm0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbnBleHBycy5FeHRlbmQucHJvdG90eXBlLmFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5ID0gZnVuY3Rpb24gKHJ1bGVOYW1lKSB7XG4gICAgLy8gRXh0ZW5kIGlzIGEgc3BlY2lhbCBjYXNlIG9mIEFsdCB0aGF0J3MgZ3VhcmFudGVlZCB0byBoYXZlIGV4YWN0bHkgdHdvXG4gICAgLy8gY2FzZXM6IFtleHRlbnNpb25zLCBvcmlnQm9keV0uXG4gICAgdmFyIGFjdHVhbEFyaXR5ID0gdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xuICAgIHZhciBleHBlY3RlZEFyaXR5ID0gdGhpcy50ZXJtc1sxXS5nZXRBcml0eSgpO1xuICAgIGlmIChhY3R1YWxBcml0eSAhPT0gZXhwZWN0ZWRBcml0eSkge1xuICAgICAgICB0aHJvdyBlcnJvcnMuaW5jb25zaXN0ZW50QXJpdHkocnVsZU5hbWUsIGV4cGVjdGVkQXJpdHksIGFjdHVhbEFyaXR5LCB0aGlzLnRlcm1zWzBdKTtcbiAgICB9XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLmZhY3RvcnNbaWR4XS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG4gICAgfVxufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eSA9IGZ1bmN0aW9uIChydWxlTmFtZSkge1xuICAgIHRoaXMuZXhwci5hc3NlcnRDaG9pY2VzSGF2ZVVuaWZvcm1Bcml0eShydWxlTmFtZSk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBuby1vcCAobm90IHJlcXVpcmVkIGIvYyB0aGUgbmVzdGVkIGV4cHIgZG9lc24ndCBzaG93IHVwIGluIHRoZSBDU1QpXG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICB0aGlzLmV4cHIuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkocnVsZU5hbWUpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0Q2hvaWNlc0hhdmVVbmlmb3JtQXJpdHkgPSBmdW5jdGlvbiAocnVsZU5hbWUpIHtcbiAgICAvLyBUaGUgYXJpdGllcyBvZiB0aGUgcGFyYW1ldGVyIGV4cHJlc3Npb25zIGlzIHJlcXVpcmVkIHRvIGJlIDEgYnlcbiAgICAvLyBgYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQoKWAuXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBlcnJvcnMgPSByZXF1aXJlKCcuL2Vycm9ycycpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gY29tbW9uLmFic3RyYWN0KCdhc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnBleHBycy5hbnkuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICBwZXhwcnMuZW5kLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICAgICAgICAgICAgICBwZXhwcnMuUGFyYW0ucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9XG4gICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vLW9wXG4gICAgICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMudGVybXMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB0aGlzLnRlcm1zW2lkeF0uYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgIH1cbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHRoaXMuZmFjdG9yc1tpZHhdLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZShncmFtbWFyKTtcbiAgICB9XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmFzc2VydEl0ZXJhdGVkRXhwcnNBcmVOb3ROdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgLy8gTm90ZTogdGhpcyBpcyB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBtZXRob2QgZm9yIGBTdGFyYCBhbmQgYFBsdXNgIGV4cHJlc3Npb25zLlxuICAgIC8vIEl0IGlzIG92ZXJyaWRkZW4gZm9yIGBPcHRgIGJlbG93LlxuICAgIHRoaXMuZXhwci5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hcik7XG4gICAgaWYgKHRoaXMuZXhwci5pc051bGxhYmxlKGdyYW1tYXIpKSB7XG4gICAgICAgIHRocm93IGVycm9ycy5rbGVlbmVFeHBySGFzTnVsbGFibGVPcGVyYW5kKHRoaXMsIFtdKTtcbiAgICB9XG59O1xucGV4cHJzLk9wdC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID1cbiAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUgPVxuICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmV4cHIuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlKGdyYW1tYXIpO1xuICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuYXNzZXJ0SXRlcmF0ZWRFeHByc0FyZU5vdE51bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICB0aGlzLmFyZ3MuZm9yRWFjaChmdW5jdGlvbiAoYXJnKSB7XG4gICAgICAgIGFyZy5hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUoZ3JhbW1hcik7XG4gICAgfSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBub2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmNoZWNrID0gY29tbW9uLmFic3RyYWN0KCdjaGVjaycpO1xucGV4cHJzLmFueS5jaGVjayA9IGZ1bmN0aW9uIChncmFtbWFyLCB2YWxzKSB7XG4gICAgcmV0dXJuIHZhbHMubGVuZ3RoID49IDE7XG59O1xucGV4cHJzLmVuZC5jaGVjayA9IGZ1bmN0aW9uIChncmFtbWFyLCB2YWxzKSB7XG4gICAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09IHVuZGVmaW5lZDtcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGdyYW1tYXIsIHZhbHMpIHtcbiAgICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgdmFsc1swXS5wcmltaXRpdmVWYWx1ZSA9PT0gdGhpcy5vYmo7XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uIChncmFtbWFyLCB2YWxzKSB7XG4gICAgcmV0dXJuIHZhbHNbMF0gaW5zdGFuY2VvZiBub2Rlcy5Ob2RlICYmXG4gICAgICAgIHZhbHNbMF0uaXNUZXJtaW5hbCgpICYmXG4gICAgICAgIHR5cGVvZiB2YWxzWzBdLnByaW1pdGl2ZVZhbHVlID09PSB0eXBlb2YgdGhpcy5mcm9tO1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbiAoZ3JhbW1hciwgdmFscykge1xuICAgIHJldHVybiB2YWxzLmxlbmd0aCA+PSAxO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGdyYW1tYXIsIHZhbHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudGVybXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRlcm0gPSB0aGlzLnRlcm1zW2ldO1xuICAgICAgICBpZiAodGVybS5jaGVjayhncmFtbWFyLCB2YWxzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGdyYW1tYXIsIHZhbHMpIHtcbiAgICB2YXIgcG9zID0gMDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZmFjdG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2ldO1xuICAgICAgICBpZiAoZmFjdG9yLmNoZWNrKGdyYW1tYXIsIHZhbHMuc2xpY2UocG9zKSkpIHtcbiAgICAgICAgICAgIHBvcyArPSBmYWN0b3IuZ2V0QXJpdHkoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuY2hlY2sgPSBmdW5jdGlvbiAoZ3JhbW1hciwgdmFscykge1xuICAgIHZhciBhcml0eSA9IHRoaXMuZ2V0QXJpdHkoKTtcbiAgICB2YXIgY29sdW1ucyA9IHZhbHMuc2xpY2UoMCwgYXJpdHkpO1xuICAgIGlmIChjb2x1bW5zLmxlbmd0aCAhPT0gYXJpdHkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgcm93Q291bnQgPSBjb2x1bW5zWzBdLmxlbmd0aDtcbiAgICB2YXIgaTtcbiAgICBmb3IgKGkgPSAxOyBpIDwgYXJpdHk7IGkrKykge1xuICAgICAgICBpZiAoY29sdW1uc1tpXS5sZW5ndGggIT09IHJvd0NvdW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IHJvd0NvdW50OyBpKyspIHtcbiAgICAgICAgdmFyIHJvdyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFyaXR5OyBqKyspIHtcbiAgICAgICAgICAgIHJvdy5wdXNoKGNvbHVtbnNbal1baV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5leHByLmNoZWNrKGdyYW1tYXIsIHJvdykpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uIChncmFtbWFyLCB2YWxzKSB7XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuY2hlY2sgPVxuICAgIHBleHBycy5MZXgucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGdyYW1tYXIsIHZhbHMpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXhwci5jaGVjayhncmFtbWFyLCB2YWxzKTtcbiAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uIChncmFtbWFyLCB2YWxzKSB7XG4gICAgaWYgKCEodmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgdmFsc1swXS5ncmFtbWFyID09PSBncmFtbWFyICYmXG4gICAgICAgIHZhbHNbMF0uY3Rvck5hbWUgPT09IHRoaXMucnVsZU5hbWUpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gVE9ETzogdGhpbmsgYWJvdXQgKm5vdCogZG9pbmcgdGhlIGZvbGxvd2luZyBjaGVja3MsIGkuZS4sIHRydXN0aW5nIHRoYXQgdGhlIHJ1bGVcbiAgICAvLyB3YXMgY29ycmVjdGx5IGNvbnN0cnVjdGVkLlxuICAgIHZhciBydWxlTm9kZSA9IHZhbHNbMF07XG4gICAgdmFyIGJvZHkgPSBncmFtbWFyLnJ1bGVzW3RoaXMucnVsZU5hbWVdLmJvZHk7XG4gICAgcmV0dXJuIGJvZHkuY2hlY2soZ3JhbW1hciwgcnVsZU5vZGUuY2hpbGRyZW4pICYmIHJ1bGVOb2RlLm51bUNoaWxkcmVuKCkgPT09IGJvZHkuZ2V0QXJpdHkoKTtcbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGdyYW1tYXIsIHZhbHMpIHtcbiAgICByZXR1cm4gdmFsc1swXSBpbnN0YW5jZW9mIG5vZGVzLk5vZGUgJiZcbiAgICAgICAgdmFsc1swXS5pc1Rlcm1pbmFsKCkgJiZcbiAgICAgICAgdHlwZW9mIHZhbHNbMF0ucHJpbWl0aXZlVmFsdWUgPT09ICdzdHJpbmcnO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIFRyYWNlID0gcmVxdWlyZSgnLi9UcmFjZScpO1xudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgZXJyb3JzID0gcmVxdWlyZSgnLi9lcnJvcnMnKTtcbnZhciBub2RlcyA9IHJlcXVpcmUoJy4vbm9kZXMnKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xudmFyIFRlcm1pbmFsTm9kZSA9IG5vZGVzLlRlcm1pbmFsTm9kZTtcbnZhciBOb250ZXJtaW5hbE5vZGUgPSBub2Rlcy5Ob250ZXJtaW5hbE5vZGU7XG52YXIgSXRlcmF0aW9uTm9kZSA9IG5vZGVzLkl0ZXJhdGlvbk5vZGU7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIEV2YWx1YXRlIHRoZSBleHByZXNzaW9uIGFuZCByZXR1cm4gYHRydWVgIGlmIGl0IHN1Y2NlZWRzLCBgZmFsc2VgIG90aGVyd2lzZS4gVGhpcyBtZXRob2Qgc2hvdWxkXG4gIG9ubHkgYmUgY2FsbGVkIGRpcmVjdGx5IGJ5IGBTdGF0ZS5wcm90b3R5cGUuZXZhbChleHByKWAsIHdoaWNoIGFsc28gdXBkYXRlcyB0aGUgZGF0YSBzdHJ1Y3R1cmVzXG4gIHRoYXQgYXJlIHVzZWQgZm9yIHRyYWNpbmcuIChNYWtpbmcgdGhvc2UgdXBkYXRlcyBpbiBhIG1ldGhvZCBvZiBgU3RhdGVgIGVuYWJsZXMgdGhlIHRyYWNlLXNwZWNpZmljXG4gIGRhdGEgc3RydWN0dXJlcyB0byBiZSBcInNlY3JldHNcIiBvZiB0aGF0IGNsYXNzLCB3aGljaCBpcyBnb29kIGZvciBtb2R1bGFyaXR5LilcblxuICBUaGUgY29udHJhY3Qgb2YgdGhpcyBtZXRob2QgaXMgYXMgZm9sbG93czpcbiAgKiBXaGVuIHRoZSByZXR1cm4gdmFsdWUgaXMgYHRydWVgLFxuICAgIC0gdGhlIHN0YXRlIG9iamVjdCB3aWxsIGhhdmUgYGV4cHIuZ2V0QXJpdHkoKWAgbW9yZSBiaW5kaW5ncyB0aGFuIGl0IGRpZCBiZWZvcmUgdGhlIGNhbGwuXG4gICogV2hlbiB0aGUgcmV0dXJuIHZhbHVlIGlzIGBmYWxzZWAsXG4gICAgLSB0aGUgc3RhdGUgb2JqZWN0IG1heSBoYXZlIG1vcmUgYmluZGluZ3MgdGhhbiBpdCBkaWQgYmVmb3JlIHRoZSBjYWxsLCBhbmRcbiAgICAtIGl0cyBpbnB1dCBzdHJlYW0ncyBwb3NpdGlvbiBtYXkgYmUgYW55d2hlcmUuXG5cbiAgTm90ZSB0aGF0IGBTdGF0ZS5wcm90b3R5cGUuZXZhbChleHByKWAsIHVubGlrZSB0aGlzIG1ldGhvZCwgZ3VhcmFudGVlcyB0aGF0IG5laXRoZXIgdGhlIHN0YXRlXG4gIG9iamVjdCdzIGJpbmRpbmdzIG5vciBpdHMgaW5wdXQgc3RyZWFtJ3MgcG9zaXRpb24gd2lsbCBjaGFuZ2UgaWYgdGhlIGV4cHJlc3Npb24gZmFpbHMgdG8gbWF0Y2guXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS5ldmFsID0gY29tbW9uLmFic3RyYWN0KCdldmFsJyk7IC8vIGZ1bmN0aW9uKHN0YXRlKSB7IC4uLiB9XG5wZXhwcnMuYW55LmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gICAgaWYgKGNoKSB7XG4gICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuZW5kLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoaW5wdXRTdHJlYW0uYXRFbmQoKSkge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHVuZGVmaW5lZCksIG9yaWdQb3MpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmICghaW5wdXRTdHJlYW0ubWF0Y2hTdHJpbmcodGhpcy5vYmopKSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wdXNoQmluZGluZyhuZXcgVGVybWluYWxOb2RlKHN0YXRlLmdyYW1tYXIsIHRoaXMub2JqKSwgb3JpZ1Bvcyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgY2ggPSBpbnB1dFN0cmVhbS5uZXh0KCk7XG4gICAgaWYgKGNoICYmIHRoaXMuZnJvbSA8PSBjaCAmJiBjaCA8PSB0aGlzLnRvKSB7XG4gICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICByZXR1cm4gc3RhdGUuZXZhbChzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKS5hcmdzW3RoaXMuaW5kZXhdKTtcbn07XG5wZXhwcnMuTGV4LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgc3RhdGUuZW50ZXJMZXhpZmllZENvbnRleHQoKTtcbiAgICB2YXIgYW5zID0gc3RhdGUuZXZhbCh0aGlzLmV4cHIpO1xuICAgIHN0YXRlLmV4aXRMZXhpZmllZENvbnRleHQoKTtcbiAgICByZXR1cm4gYW5zO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgaWYgKHN0YXRlLmV2YWwodGhpcy50ZXJtc1tpZHhdKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCB0aGlzLmZhY3RvcnMubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICB2YXIgZmFjdG9yID0gdGhpcy5mYWN0b3JzW2lkeF07XG4gICAgICAgIGlmICghc3RhdGUuZXZhbChmYWN0b3IpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLkl0ZXIucHJvdG90eXBlLmV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgYXJpdHkgPSB0aGlzLmdldEFyaXR5KCk7XG4gICAgdmFyIGNvbHMgPSBbXTtcbiAgICB2YXIgY29sT2Zmc2V0cyA9IFtdO1xuICAgIHdoaWxlIChjb2xzLmxlbmd0aCA8IGFyaXR5KSB7XG4gICAgICAgIGNvbHMucHVzaChbXSk7XG4gICAgICAgIGNvbE9mZnNldHMucHVzaChbXSk7XG4gICAgfVxuICAgIHZhciBudW1NYXRjaGVzID0gMDtcbiAgICB2YXIgcHJldlBvcyA9IG9yaWdQb3M7XG4gICAgdmFyIGlkeDtcbiAgICB3aGlsZSAobnVtTWF0Y2hlcyA8IHRoaXMubWF4TnVtTWF0Y2hlcyAmJiBzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLnBvcyA9PT0gcHJldlBvcykge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3JzLmtsZWVuZUV4cHJIYXNOdWxsYWJsZU9wZXJhbmQodGhpcywgc3RhdGUuX2FwcGxpY2F0aW9uU3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHByZXZQb3MgPSBpbnB1dFN0cmVhbS5wb3M7XG4gICAgICAgIG51bU1hdGNoZXMrKztcbiAgICAgICAgdmFyIHJvdyA9IHN0YXRlLl9iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIHZhciByb3dPZmZzZXRzID0gc3RhdGUuX2JpbmRpbmdPZmZzZXRzLnNwbGljZShzdGF0ZS5fYmluZGluZ09mZnNldHMubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICAgICAgZm9yIChpZHggPSAwOyBpZHggPCByb3cubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgICAgY29sc1tpZHhdLnB1c2gocm93W2lkeF0pO1xuICAgICAgICAgICAgY29sT2Zmc2V0c1tpZHhdLnB1c2gocm93T2Zmc2V0c1tpZHhdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobnVtTWF0Y2hlcyA8IHRoaXMubWluTnVtTWF0Y2hlcykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBvZmZzZXQgPSBzdGF0ZS5wb3NUb09mZnNldChvcmlnUG9zKTtcbiAgICB2YXIgbWF0Y2hMZW5ndGggPSAwO1xuICAgIGlmIChudW1NYXRjaGVzID4gMCkge1xuICAgICAgICB2YXIgbGFzdENvbCA9IGNvbHNbYXJpdHkgLSAxXTtcbiAgICAgICAgdmFyIGxhc3RDb2xPZmZzZXRzID0gY29sT2Zmc2V0c1thcml0eSAtIDFdO1xuICAgICAgICB2YXIgZW5kT2Zmc2V0ID0gbGFzdENvbE9mZnNldHNbbGFzdENvbE9mZnNldHMubGVuZ3RoIC0gMV0gKyBsYXN0Q29sW2xhc3RDb2wubGVuZ3RoIC0gMV0ubWF0Y2hMZW5ndGg7XG4gICAgICAgIG9mZnNldCA9IGNvbE9mZnNldHNbMF1bMF07XG4gICAgICAgIG1hdGNoTGVuZ3RoID0gZW5kT2Zmc2V0IC0gb2Zmc2V0O1xuICAgIH1cbiAgICB2YXIgaXNPcHRpb25hbCA9IHRoaXMgaW5zdGFuY2VvZiBwZXhwcnMuT3B0O1xuICAgIGZvciAoaWR4ID0gMDsgaWR4IDwgY29scy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIHN0YXRlLl9iaW5kaW5ncy5wdXNoKG5ldyBJdGVyYXRpb25Ob2RlKHN0YXRlLmdyYW1tYXIsIGNvbHNbaWR4XSwgY29sT2Zmc2V0c1tpZHhdLCBtYXRjaExlbmd0aCwgaXNPcHRpb25hbCkpO1xuICAgICAgICBzdGF0ZS5fYmluZGluZ09mZnNldHMucHVzaChvZmZzZXQpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS5ldmFsID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgLypcbiAgICAgIFRPRE86XG4gICAgICAtIFJpZ2h0IG5vdyB3ZSdyZSBqdXN0IHRocm93aW5nIGF3YXkgYWxsIG9mIHRoZSBmYWlsdXJlcyB0aGF0IGhhcHBlbiBpbnNpZGUgYSBgbm90YCwgYW5kXG4gICAgICAgIHJlY29yZGluZyBgdGhpc2AgYXMgYSBmYWlsZWQgZXhwcmVzc2lvbi5cbiAgICAgIC0gRG91YmxlIG5lZ2F0aW9uIHNob3VsZCBiZSBlcXVpdmFsZW50IHRvIGxvb2thaGVhZCwgYnV0IHRoYXQncyBub3QgdGhlIGNhc2UgcmlnaHQgbm93IHdydFxuICAgICAgICBmYWlsdXJlcy4gRS5nLiwgfn4nZm9vJyBwcm9kdWNlcyBhIGZhaWx1cmUgZm9yIH5+J2ZvbycsIGJ1dCBtYXliZSBpdCBzaG91bGQgcHJvZHVjZVxuICAgICAgICBhIGZhaWx1cmUgZm9yICdmb28nIGluc3RlYWQuXG4gICAgKi9cbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBzdGF0ZS5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgdmFyIGFucyA9IHN0YXRlLmV2YWwodGhpcy5leHByKTtcbiAgICBzdGF0ZS5wb3BGYWlsdXJlc0luZm8oKTtcbiAgICBpZiAoYW5zKSB7XG4gICAgICAgIHN0YXRlLnByb2Nlc3NGYWlsdXJlKG9yaWdQb3MsIHRoaXMpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlucHV0U3RyZWFtLnBvcyA9IG9yaWdQb3M7XG4gICAgcmV0dXJuIHRydWU7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIGlmIChzdGF0ZS5ldmFsKHRoaXMuZXhwcikpIHtcbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBjYWxsZXIgPSBzdGF0ZS5jdXJyZW50QXBwbGljYXRpb24oKTtcbiAgICB2YXIgYWN0dWFscyA9IGNhbGxlciA/IGNhbGxlci5hcmdzIDogW107XG4gICAgdmFyIGFwcCA9IHRoaXMuc3Vic3RpdHV0ZVBhcmFtcyhhY3R1YWxzKTtcbiAgICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgaWYgKHBvc0luZm8uaXNBY3RpdmUoYXBwKSkge1xuICAgICAgICAvLyBUaGlzIHJ1bGUgaXMgYWxyZWFkeSBhY3RpdmUgYXQgdGhpcyBwb3NpdGlvbiwgaS5lLiwgaXQgaXMgbGVmdC1yZWN1cnNpdmUuXG4gICAgICAgIHJldHVybiBhcHAuaGFuZGxlQ3ljbGUoc3RhdGUpO1xuICAgIH1cbiAgICB2YXIgbWVtb0tleSA9IGFwcC50b01lbW9LZXkoKTtcbiAgICB2YXIgbWVtb1JlYyA9IHBvc0luZm8ubWVtb1ttZW1vS2V5XTtcbiAgICBpZiAobWVtb1JlYyAmJiBwb3NJbmZvLnNob3VsZFVzZU1lbW9pemVkUmVzdWx0KG1lbW9SZWMpKSB7XG4gICAgICAgIGlmIChzdGF0ZS5oYXNOZWNlc3NhcnlJbmZvKG1lbW9SZWMpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUudXNlTWVtb2l6ZWRSZXN1bHQoc3RhdGUuaW5wdXRTdHJlYW0ucG9zLCBtZW1vUmVjKTtcbiAgICAgICAgfVxuICAgICAgICBkZWxldGUgcG9zSW5mby5tZW1vW21lbW9LZXldO1xuICAgIH1cbiAgICByZXR1cm4gYXBwLnJlYWxseUV2YWwoc3RhdGUpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuaGFuZGxlQ3ljbGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgcG9zSW5mbyA9IHN0YXRlLmdldEN1cnJlbnRQb3NJbmZvKCk7XG4gICAgdmFyIGN1cnJlbnRMZWZ0UmVjdXJzaW9uID0gcG9zSW5mby5jdXJyZW50TGVmdFJlY3Vyc2lvbjtcbiAgICB2YXIgbWVtb0tleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgdmFyIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9bbWVtb0tleV07XG4gICAgaWYgKGN1cnJlbnRMZWZ0UmVjdXJzaW9uICYmIGN1cnJlbnRMZWZ0UmVjdXJzaW9uLmhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSA9PT0gbWVtb0tleSkge1xuICAgICAgICAvLyBXZSBhbHJlYWR5IGtub3cgYWJvdXQgdGhpcyBsZWZ0IHJlY3Vyc2lvbiwgYnV0IGl0J3MgcG9zc2libGUgdGhlcmUgYXJlIFwiaW52b2x2ZWRcbiAgICAgICAgLy8gYXBwbGljYXRpb25zXCIgdGhhdCB3ZSBkb24ndCBhbHJlYWR5IGtub3cgYWJvdXQsIHNvLi4uXG4gICAgICAgIG1lbW9SZWMudXBkYXRlSW52b2x2ZWRBcHBsaWNhdGlvbk1lbW9LZXlzKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKCFtZW1vUmVjKSB7XG4gICAgICAgIC8vIE5ldyBsZWZ0IHJlY3Vyc2lvbiBkZXRlY3RlZCEgTWVtb2l6ZSBhIGZhaWx1cmUgdG8gdHJ5IHRvIGdldCBhIHNlZWQgcGFyc2UuXG4gICAgICAgIG1lbW9SZWMgPSBwb3NJbmZvLm1lbW9pemUobWVtb0tleSwgeyBtYXRjaExlbmd0aDogMCwgZXhhbWluZWRMZW5ndGg6IDAsIHZhbHVlOiBmYWxzZSwgcmlnaHRtb3N0RmFpbHVyZU9mZnNldDogLTEgfSk7XG4gICAgICAgIHBvc0luZm8uc3RhcnRMZWZ0UmVjdXJzaW9uKHRoaXMsIG1lbW9SZWMpO1xuICAgIH1cbiAgICByZXR1cm4gc3RhdGUudXNlTWVtb2l6ZWRSZXN1bHQoc3RhdGUuaW5wdXRTdHJlYW0ucG9zLCBtZW1vUmVjKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnJlYWxseUV2YWwgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICB2YXIgb3JpZ1Bvc0luZm8gPSBzdGF0ZS5nZXRDdXJyZW50UG9zSW5mbygpO1xuICAgIHZhciBydWxlSW5mbyA9IHN0YXRlLmdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV07XG4gICAgdmFyIGJvZHkgPSBydWxlSW5mby5ib2R5O1xuICAgIHZhciBkZXNjcmlwdGlvbiA9IHJ1bGVJbmZvLmRlc2NyaXB0aW9uO1xuICAgIHN0YXRlLmVudGVyQXBwbGljYXRpb24ob3JpZ1Bvc0luZm8sIHRoaXMpO1xuICAgIGlmIChkZXNjcmlwdGlvbikge1xuICAgICAgICBzdGF0ZS5wdXNoRmFpbHVyZXNJbmZvKCk7XG4gICAgfVxuICAgIC8vIFJlc2V0IHRoZSBpbnB1dCBzdHJlYW0ncyBleGFtaW5lZExlbmd0aCBwcm9wZXJ0eSBzbyB0aGF0IHdlIGNhbiB0cmFja1xuICAgIC8vIHRoZSBleGFtaW5lZCBsZW5ndGggb2YgdGhpcyBwYXJ0aWN1bGFyIGFwcGxpY2F0aW9uLlxuICAgIHZhciBvcmlnSW5wdXRTdHJlYW1FeGFtaW5lZExlbmd0aCA9IGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoO1xuICAgIGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoID0gMDtcbiAgICB2YXIgdmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHN0YXRlKTtcbiAgICB2YXIgY3VycmVudExSID0gb3JpZ1Bvc0luZm8uY3VycmVudExlZnRSZWN1cnNpb247XG4gICAgdmFyIG1lbW9LZXkgPSB0aGlzLnRvTWVtb0tleSgpO1xuICAgIHZhciBpc0hlYWRPZkxlZnRSZWN1cnNpb24gPSBjdXJyZW50TFIgJiYgY3VycmVudExSLmhlYWRBcHBsaWNhdGlvbi50b01lbW9LZXkoKSA9PT0gbWVtb0tleTtcbiAgICB2YXIgbWVtb1JlYztcbiAgICBpZiAoaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICAgIHZhbHVlID0gdGhpcy5ncm93U2VlZFJlc3VsdChib2R5LCBzdGF0ZSwgb3JpZ1BvcywgY3VycmVudExSLCB2YWx1ZSk7XG4gICAgICAgIG9yaWdQb3NJbmZvLmVuZExlZnRSZWN1cnNpb24oKTtcbiAgICAgICAgbWVtb1JlYyA9IGN1cnJlbnRMUjtcbiAgICAgICAgbWVtb1JlYy5leGFtaW5lZExlbmd0aCA9IGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoIC0gb3JpZ1BvcztcbiAgICAgICAgbWVtb1JlYy5yaWdodG1vc3RGYWlsdXJlT2Zmc2V0ID0gc3RhdGUuX2dldFJpZ2h0bW9zdEZhaWx1cmVPZmZzZXQoKTtcbiAgICAgICAgb3JpZ1Bvc0luZm8ubWVtb2l6ZShtZW1vS2V5LCBtZW1vUmVjKTsgLy8gdXBkYXRlcyBvcmlnUG9zSW5mbydzIG1heEV4YW1pbmVkTGVuZ3RoXG4gICAgfVxuICAgIGVsc2UgaWYgKCFjdXJyZW50TFIgfHwgIWN1cnJlbnRMUi5pc0ludm9sdmVkKG1lbW9LZXkpKSB7XG4gICAgICAgIC8vIFRoaXMgYXBwbGljYXRpb24gaXMgbm90IGludm9sdmVkIGluIGxlZnQgcmVjdXJzaW9uLCBzbyBpdCdzIG9rIHRvIG1lbW9pemUgaXQuXG4gICAgICAgIG1lbW9SZWMgPSBvcmlnUG9zSW5mby5tZW1vaXplKG1lbW9LZXksIHtcbiAgICAgICAgICAgIG1hdGNoTGVuZ3RoOiBpbnB1dFN0cmVhbS5wb3MgLSBvcmlnUG9zLFxuICAgICAgICAgICAgZXhhbWluZWRMZW5ndGg6IGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoIC0gb3JpZ1BvcyxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGZhaWx1cmVzQXRSaWdodG1vc3RQb3NpdGlvbjogc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCksXG4gICAgICAgICAgICByaWdodG1vc3RGYWlsdXJlT2Zmc2V0OiBzdGF0ZS5fZ2V0UmlnaHRtb3N0RmFpbHVyZU9mZnNldCgpXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgc3VjY2VlZGVkID0gISF2YWx1ZTtcbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgICAgc3RhdGUucG9wRmFpbHVyZXNJbmZvKCk7XG4gICAgICAgIGlmICghc3VjY2VlZGVkKSB7XG4gICAgICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVtb1JlYykge1xuICAgICAgICAgICAgbWVtb1JlYy5mYWlsdXJlc0F0UmlnaHRtb3N0UG9zaXRpb24gPSBzdGF0ZS5jbG9uZVJlY29yZGVkRmFpbHVyZXMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBSZWNvcmQgdHJhY2UgaW5mb3JtYXRpb24gaW4gdGhlIG1lbW8gdGFibGUsIHNvIHRoYXQgaXQgaXMgYXZhaWxhYmxlIGlmIHRoZSBtZW1vaXplZCByZXN1bHRcbiAgICAvLyBpcyB1c2VkIGxhdGVyLlxuICAgIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSAmJiBtZW1vUmVjKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHN0YXRlLmdldFRyYWNlRW50cnkob3JpZ1BvcywgdGhpcywgc3VjY2VlZGVkLCBzdWNjZWVkZWQgPyBbdmFsdWVdIDogW10pO1xuICAgICAgICBpZiAoaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uKSB7XG4gICAgICAgICAgICBjb21tb24uYXNzZXJ0KGVudHJ5LnRlcm1pbmF0aW5nTFJFbnRyeSAhPSBudWxsIHx8ICFzdWNjZWVkZWQpO1xuICAgICAgICAgICAgZW50cnkuaXNIZWFkT2ZMZWZ0UmVjdXJzaW9uID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBtZW1vUmVjLnRyYWNlRW50cnkgPSBlbnRyeTtcbiAgICB9XG4gICAgLy8gRml4IHRoZSBpbnB1dCBzdHJlYW0ncyBleGFtaW5lZExlbmd0aCAtLSBpdCBzaG91bGQgYmUgdGhlIG1heGltdW0gZXhhbWluZWQgbGVuZ3RoXG4gICAgLy8gYWNyb3NzIGFsbCBhcHBsaWNhdGlvbnMsIG5vdCBqdXN0IHRoaXMgb25lLlxuICAgIGlucHV0U3RyZWFtLmV4YW1pbmVkTGVuZ3RoID0gTWF0aC5tYXgoaW5wdXRTdHJlYW0uZXhhbWluZWRMZW5ndGgsIG9yaWdJbnB1dFN0cmVhbUV4YW1pbmVkTGVuZ3RoKTtcbiAgICBzdGF0ZS5leGl0QXBwbGljYXRpb24ob3JpZ1Bvc0luZm8sIHZhbHVlKTtcbiAgICByZXR1cm4gc3VjY2VlZGVkO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZXZhbE9uY2UgPSBmdW5jdGlvbiAoZXhwciwgc3RhdGUpIHtcbiAgICB2YXIgaW5wdXRTdHJlYW0gPSBzdGF0ZS5pbnB1dFN0cmVhbTtcbiAgICB2YXIgb3JpZ1BvcyA9IGlucHV0U3RyZWFtLnBvcztcbiAgICBpZiAoc3RhdGUuZXZhbChleHByKSkge1xuICAgICAgICB2YXIgYXJpdHkgPSBleHByLmdldEFyaXR5KCk7XG4gICAgICAgIHZhciBiaW5kaW5ncyA9IHN0YXRlLl9iaW5kaW5ncy5zcGxpY2Uoc3RhdGUuX2JpbmRpbmdzLmxlbmd0aCAtIGFyaXR5LCBhcml0eSk7XG4gICAgICAgIHZhciBvZmZzZXRzID0gc3RhdGUuX2JpbmRpbmdPZmZzZXRzLnNwbGljZShzdGF0ZS5fYmluZGluZ09mZnNldHMubGVuZ3RoIC0gYXJpdHksIGFyaXR5KTtcbiAgICAgICAgcmV0dXJuIG5ldyBOb250ZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgdGhpcy5ydWxlTmFtZSwgYmluZGluZ3MsIG9mZnNldHMsIGlucHV0U3RyZWFtLnBvcyAtIG9yaWdQb3MpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLmdyb3dTZWVkUmVzdWx0ID0gZnVuY3Rpb24gKGJvZHksIHN0YXRlLCBvcmlnUG9zLCBsck1lbW9SZWMsIG5ld1ZhbHVlKSB7XG4gICAgaWYgKCFuZXdWYWx1ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGxyTWVtb1JlYy5tYXRjaExlbmd0aCA9IGlucHV0U3RyZWFtLnBvcyAtIG9yaWdQb3M7XG4gICAgICAgIGxyTWVtb1JlYy52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICBsck1lbW9SZWMuZmFpbHVyZXNBdFJpZ2h0bW9zdFBvc2l0aW9uID0gc3RhdGUuY2xvbmVSZWNvcmRlZEZhaWx1cmVzKCk7XG4gICAgICAgIGlmIChzdGF0ZS5pc1RyYWNpbmcoKSkge1xuICAgICAgICAgICAgLy8gQmVmb3JlIGV2YWx1YXRpbmcgdGhlIGJvZHkgYWdhaW4sIGFkZCBhIHRyYWNlIG5vZGUgZm9yIHRoaXMgYXBwbGljYXRpb24gdG8gdGhlIG1lbW8gZW50cnkuXG4gICAgICAgICAgICAvLyBJdHMgb25seSBjaGlsZCBpcyBhIGNvcHkgb2YgdGhlIHRyYWNlIG5vZGUgZnJvbSBgbmV3VmFsdWVgLCB3aGljaCB3aWxsIGFsd2F5cyBiZSB0aGUgbGFzdFxuICAgICAgICAgICAgLy8gZWxlbWVudCBpbiBgc3RhdGUudHJhY2VgLlxuICAgICAgICAgICAgdmFyIHNlZWRUcmFjZSA9IHN0YXRlLnRyYWNlW3N0YXRlLnRyYWNlLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgbHJNZW1vUmVjLnRyYWNlRW50cnkgPSBuZXcgVHJhY2Uoc3RhdGUuaW5wdXQsIG9yaWdQb3MsIGlucHV0U3RyZWFtLnBvcywgdGhpcywgdHJ1ZSwgW25ld1ZhbHVlXSwgW3NlZWRUcmFjZS5jbG9uZSgpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcztcbiAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmV2YWxPbmNlKGJvZHksIHN0YXRlKTtcbiAgICAgICAgaWYgKGlucHV0U3RyZWFtLnBvcyAtIG9yaWdQb3MgPD0gbHJNZW1vUmVjLm1hdGNoTGVuZ3RoKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdGUuaXNUcmFjaW5nKCkpIHtcbiAgICAgICAgICAgIHN0YXRlLnRyYWNlLnNwbGljZSgtMiwgMSk7IC8vIERyb3AgdGhlIHRyYWNlIGZvciB0aGUgb2xkIHNlZWQuXG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHN0YXRlLmlzVHJhY2luZygpKSB7XG4gICAgICAgIC8vIFRoZSBsYXN0IGVudHJ5IGlzIGZvciBhbiB1bnVzZWQgcmVzdWx0IC0tIHBvcCBpdCBhbmQgc2F2ZSBpdCBpbiB0aGUgXCJyZWFsXCIgZW50cnkuXG4gICAgICAgIGxyTWVtb1JlYy50cmFjZUVudHJ5LnJlY29yZExSVGVybWluYXRpb24oc3RhdGUudHJhY2UucG9wKCksIG5ld1ZhbHVlKTtcbiAgICB9XG4gICAgaW5wdXRTdHJlYW0ucG9zID0gb3JpZ1BvcyArIGxyTWVtb1JlYy5tYXRjaExlbmd0aDtcbiAgICByZXR1cm4gbHJNZW1vUmVjLnZhbHVlO1xufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZXZhbCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgIHZhciBpbnB1dFN0cmVhbSA9IHN0YXRlLmlucHV0U3RyZWFtO1xuICAgIHZhciBvcmlnUG9zID0gaW5wdXRTdHJlYW0ucG9zO1xuICAgIHZhciBjaCA9IGlucHV0U3RyZWFtLm5leHQoKTtcbiAgICBpZiAoY2ggJiYgdGhpcy5wYXR0ZXJuLnRlc3QoY2gpKSB7XG4gICAgICAgIHN0YXRlLnB1c2hCaW5kaW5nKG5ldyBUZXJtaW5hbE5vZGUoc3RhdGUuZ3JhbW1hciwgY2gpLCBvcmlnUG9zKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBzdGF0ZS5wcm9jZXNzRmFpbHVyZShvcmlnUG9zLCB0aGlzKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSGVscGVyc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmZ1bmN0aW9uIGZsYXR0ZW4obGlzdE9mTGlzdHMpIHtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLmNvbmNhdC5hcHBseShbXSwgbGlzdE9mTGlzdHMpO1xufVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGNvbW1vbi5hYnN0cmFjdCgnZ2VuZXJhdGVFeGFtcGxlJyk7XG5mdW5jdGlvbiBjYXRlZ29yaXplRXhhbXBsZXMoZXhhbXBsZXMpIHtcbiAgICAvLyBBIGxpc3Qgb2YgcnVsZXMgdGhhdCB0aGUgc3lzdGVtIG5lZWRzIGV4YW1wbGVzIG9mLCBpbiBvcmRlciB0byBnZW5lcmF0ZSBhbiBleGFtcGxlXG4gICAgLy8gICBmb3IgdGhlIGN1cnJlbnQgcnVsZVxuICAgIHZhciBleGFtcGxlc05lZWRlZCA9IGV4YW1wbGVzLmZpbHRlcihmdW5jdGlvbiAoZXhhbXBsZSkge1xuICAgICAgICByZXR1cm4gZXhhbXBsZS5oYXNPd25Qcm9wZXJ0eSgnZXhhbXBsZXNOZWVkZWQnKTtcbiAgICB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChleGFtcGxlKSB7IHJldHVybiBleGFtcGxlLmV4YW1wbGVzTmVlZGVkOyB9KTtcbiAgICBleGFtcGxlc05lZWRlZCA9IGZsYXR0ZW4oZXhhbXBsZXNOZWVkZWQpO1xuICAgIHZhciB1bmlxdWVFeGFtcGxlc05lZWRlZCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhhbXBsZXNOZWVkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGN1cnJlbnRFeGFtcGxlTmVlZGVkID0gZXhhbXBsZXNOZWVkZWRbaV07XG4gICAgICAgIHVuaXF1ZUV4YW1wbGVzTmVlZGVkW2N1cnJlbnRFeGFtcGxlTmVlZGVkXSA9IHRydWU7XG4gICAgfVxuICAgIGV4YW1wbGVzTmVlZGVkID0gT2JqZWN0LmtleXModW5pcXVlRXhhbXBsZXNOZWVkZWQpO1xuICAgIC8vIEEgbGlzdCBvZiBzdWNjZXNzZnVsbHkgZ2VuZXJhdGVkIGV4YW1wbGVzXG4gICAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGV4YW1wbGVzLmZpbHRlcihmdW5jdGlvbiAoZXhhbXBsZSkge1xuICAgICAgICByZXR1cm4gZXhhbXBsZS5oYXNPd25Qcm9wZXJ0eSgndmFsdWUnKTtcbiAgICB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiBpdGVtLnZhbHVlOyB9KTtcbiAgICAvLyBUaGlzIGZsYWcgcmV0dXJucyB0cnVlIGlmIHRoZSBzeXN0ZW0gY2Fubm90IGdlbmVyYXRlIHRoZSBydWxlIGl0IGlzIGN1cnJlbnRseVxuICAgIC8vICAgYXR0ZW1wdGluZyB0byBnZW5lcmF0ZSwgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIG9yIG5vdCBpdCBoYXMgdGhlIGV4YW1wbGVzIGl0IG5lZWRzLlxuICAgIC8vICAgQ3VycmVudGx5LCB0aGlzIGlzIG9ubHkgdXNlZCBpbiBvdmVycmlkaW5nIGdlbmVyYXRvcnMgdG8gcHJldmVudCB0aGUgc3lzdGVtIGZyb21cbiAgICAvLyAgIGdlbmVyYXRpbmcgZXhhbXBsZXMgZm9yIGNlcnRhaW4gcnVsZXMgKGUuZy4gJ2lkZW50JykuXG4gICAgdmFyIG5lZWRIZWxwID0gZXhhbXBsZXMuc29tZShmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gaXRlbS5uZWVkSGVscDsgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZXhhbXBsZXNOZWVkZWQ6IGV4YW1wbGVzTmVlZGVkLFxuICAgICAgICBzdWNjZXNzZnVsRXhhbXBsZXM6IHN1Y2Nlc3NmdWxFeGFtcGxlcyxcbiAgICAgICAgbmVlZEhlbHA6IG5lZWRIZWxwXG4gICAgfTtcbn1cbnBleHBycy5hbnkuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogU3RyaW5nLmZyb21DaGFyQ29kZShNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyNTUpKSB9O1xufTtcbi8vIEFzc3VtZXMgdGhhdCB0ZXJtaW5hbCdzIG9iamVjdCBpcyBhbHdheXMgYSBzdHJpbmdcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdGhpcy5vYmogfTtcbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0KSB7XG4gICAgdmFyIHJhbmdlU2l6ZSA9IHRoaXMudG8uY2hhckNvZGVBdCgwKSAtIHRoaXMuZnJvbS5jaGFyQ29kZUF0KDApO1xuICAgIHJldHVybiB7IHZhbHVlOiBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZnJvbS5jaGFyQ29kZUF0KDApICsgTWF0aC5mbG9vcihyYW5nZVNpemUgKiBNYXRoLnJhbmRvbSgpKSkgfTtcbn07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgcmV0dXJuIGFjdHVhbHNbdGhpcy5pbmRleF0uZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgLy8gaXRlbXMgLT4gdGVybUV4YW1wbGVzXG4gICAgdmFyIHRlcm1FeGFtcGxlcyA9IHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7XG4gICAgICAgIHJldHVybiB0ZXJtLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKTtcbiAgICB9KTtcbiAgICB2YXIgY2F0ZWdvcml6ZWRFeGFtcGxlcyA9IGNhdGVnb3JpemVFeGFtcGxlcyh0ZXJtRXhhbXBsZXMpO1xuICAgIHZhciBleGFtcGxlc05lZWRlZCA9IGNhdGVnb3JpemVkRXhhbXBsZXMuZXhhbXBsZXNOZWVkZWQ7XG4gICAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGNhdGVnb3JpemVkRXhhbXBsZXMuc3VjY2Vzc2Z1bEV4YW1wbGVzO1xuICAgIHZhciBuZWVkSGVscCA9IGNhdGVnb3JpemVkRXhhbXBsZXMubmVlZEhlbHA7XG4gICAgdmFyIGFucyA9IHt9O1xuICAgIC8vIEFsdCBjYW4gY29udGFpbiBib3RoIGFuIGV4YW1wbGUgYW5kIGEgcmVxdWVzdCBmb3IgZXhhbXBsZXNcbiAgICBpZiAoc3VjY2Vzc2Z1bEV4YW1wbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIGkgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzdWNjZXNzZnVsRXhhbXBsZXMubGVuZ3RoKTtcbiAgICAgICAgYW5zLnZhbHVlID0gc3VjY2Vzc2Z1bEV4YW1wbGVzW2ldO1xuICAgIH1cbiAgICBpZiAoZXhhbXBsZXNOZWVkZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlc05lZWRlZDtcbiAgICB9XG4gICAgYW5zLm5lZWRIZWxwID0gbmVlZEhlbHA7XG4gICAgcmV0dXJuIGFucztcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHZhciBmYWN0b3JFeGFtcGxlcyA9IHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGZhY3Rvcikge1xuICAgICAgICByZXR1cm4gZmFjdG9yLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKTtcbiAgICB9KTtcbiAgICB2YXIgY2F0ZWdvcml6ZWRFeGFtcGxlcyA9IGNhdGVnb3JpemVFeGFtcGxlcyhmYWN0b3JFeGFtcGxlcyk7XG4gICAgdmFyIGV4YW1wbGVzTmVlZGVkID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5leGFtcGxlc05lZWRlZDtcbiAgICB2YXIgc3VjY2Vzc2Z1bEV4YW1wbGVzID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5zdWNjZXNzZnVsRXhhbXBsZXM7XG4gICAgdmFyIG5lZWRIZWxwID0gY2F0ZWdvcml6ZWRFeGFtcGxlcy5uZWVkSGVscDtcbiAgICB2YXIgYW5zID0ge307XG4gICAgLy8gSW4gYSBTZXEsIGFsbCBwaWVjZXMgbXVzdCBzdWNjZWVkIGluIG9yZGVyIHRvIGhhdmUgYSBzdWNjZXNzZnVsIGV4YW1wbGUuXG4gICAgaWYgKGV4YW1wbGVzTmVlZGVkLmxlbmd0aCA+IDAgfHwgbmVlZEhlbHApIHtcbiAgICAgICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gZXhhbXBsZXNOZWVkZWQ7XG4gICAgICAgIGFucy5uZWVkSGVscCA9IG5lZWRIZWxwO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgYW5zLnZhbHVlID0gc3VjY2Vzc2Z1bEV4YW1wbGVzLmpvaW4oaW5TeW50YWN0aWNDb250ZXh0ID8gJyAnIDogJycpO1xuICAgIH1cbiAgICByZXR1cm4gYW5zO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCwgYWN0dWFscykge1xuICAgIHZhciByYW5nZVRpbWVzID0gTWF0aC5taW4odGhpcy5tYXhOdW1NYXRjaGVzIC0gdGhpcy5taW5OdW1NYXRjaGVzLCAzKTtcbiAgICB2YXIgbnVtVGltZXMgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAocmFuZ2VUaW1lcyArIDEpICsgdGhpcy5taW5OdW1NYXRjaGVzKTtcbiAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bVRpbWVzOyBpKyspIHtcbiAgICAgICAgaXRlbXMucHVzaCh0aGlzLmV4cHIuZ2VuZXJhdGVFeGFtcGxlKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpKTtcbiAgICB9XG4gICAgdmFyIGNhdGVnb3JpemVkRXhhbXBsZXMgPSBjYXRlZ29yaXplRXhhbXBsZXMoaXRlbXMpO1xuICAgIHZhciBleGFtcGxlc05lZWRlZCA9IGNhdGVnb3JpemVkRXhhbXBsZXMuZXhhbXBsZXNOZWVkZWQ7XG4gICAgdmFyIHN1Y2Nlc3NmdWxFeGFtcGxlcyA9IGNhdGVnb3JpemVkRXhhbXBsZXMuc3VjY2Vzc2Z1bEV4YW1wbGVzO1xuICAgIHZhciBhbnMgPSB7fTtcbiAgICAvLyBJdCdzIGFsd2F5cyBlaXRoZXIgb25lIG9yIHRoZSBvdGhlci5cbiAgICAvLyBUT0RPOiBpbnN0ZWFkIG9mICcgJywgY2FsbCAnc3BhY2VzLmdlbmVyYXRlRXhhbXBsZSgpJ1xuICAgIGFucy52YWx1ZSA9IHN1Y2Nlc3NmdWxFeGFtcGxlcy5qb2luKGluU3ludGFjdGljQ29udGV4dCA/ICcgJyA6ICcnKTtcbiAgICBpZiAoZXhhbXBsZXNOZWVkZWQubGVuZ3RoID4gMCkge1xuICAgICAgICBhbnMuZXhhbXBsZXNOZWVkZWQgPSBleGFtcGxlc05lZWRlZDtcbiAgICB9XG4gICAgcmV0dXJuIGFucztcbn07XG4vLyBSaWdodCBub3csICdOb3QnIGFuZCAnTG9va2FoZWFkJyBnZW5lcmF0ZSBub3RoaW5nIGFuZCBhc3N1bWUgdGhhdCB3aGF0ZXZlciBmb2xsb3dzIHdpbGxcbi8vICAgd29yayBhY2NvcmRpbmcgdG8gdGhlIGVuY29kZWQgY29uc3RyYWludHMuXG5wZXhwcnMuTm90LnByb3RvdHlwZS5nZW5lcmF0ZUV4YW1wbGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgZXhhbXBsZXMsIGluU3ludGFjdGljQ29udGV4dCkge1xuICAgIHJldHVybiB7IHZhbHVlOiAnJyB9O1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0KSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6ICcnIH07XG59O1xucGV4cHJzLkxleC5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdlbmVyYXRlRXhhbXBsZShncmFtbWFyLCBleGFtcGxlcywgZmFsc2UsIGFjdHVhbHMpO1xufTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUuZ2VuZXJhdGVFeGFtcGxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIGV4YW1wbGVzLCBpblN5bnRhY3RpY0NvbnRleHQsIGFjdHVhbHMpIHtcbiAgICB2YXIgYW5zID0ge307XG4gICAgdmFyIHJ1bGVOYW1lID0gdGhpcy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpLnRvU3RyaW5nKCk7XG4gICAgaWYgKCFleGFtcGxlcy5oYXNPd25Qcm9wZXJ0eShydWxlTmFtZSkpIHtcbiAgICAgICAgYW5zLmV4YW1wbGVzTmVlZGVkID0gW3J1bGVOYW1lXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciByZWxldmFudEV4YW1wbGVzID0gZXhhbXBsZXNbcnVsZU5hbWVdO1xuICAgICAgICB2YXIgaSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHJlbGV2YW50RXhhbXBsZXMubGVuZ3RoKTtcbiAgICAgICAgYW5zLnZhbHVlID0gcmVsZXZhbnRFeGFtcGxlc1tpXTtcbiAgICB9XG4gICAgcmV0dXJuIGFucztcbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmdlbmVyYXRlRXhhbXBsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBleGFtcGxlcywgaW5TeW50YWN0aWNDb250ZXh0LCBhY3R1YWxzKSB7XG4gICAgdmFyIGNoYXI7XG4gICAgc3dpdGNoICh0aGlzLmNhdGVnb3J5KSB7XG4gICAgICAgIGNhc2UgJ0x1JzpcbiAgICAgICAgICAgIGNoYXIgPSAnw4EnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0xsJzpcbiAgICAgICAgICAgIGNoYXIgPSAnxY8nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0x0JzpcbiAgICAgICAgICAgIGNoYXIgPSAnx4UnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0xtJzpcbiAgICAgICAgICAgIGNoYXIgPSAny64nO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0xvJzpcbiAgICAgICAgICAgIGNoYXIgPSAnxrsnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ05sJzpcbiAgICAgICAgICAgIGNoYXIgPSAn4oaCJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdOZCc6XG4gICAgICAgICAgICBjaGFyID0gJ8K9JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdNbic6XG4gICAgICAgICAgICBjaGFyID0gJ1xcdTA0ODcnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ01jJzpcbiAgICAgICAgICAgIGNoYXIgPSAn4KS/JztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdQYyc6XG4gICAgICAgICAgICBjaGFyID0gJ+KBgCc7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnWnMnOlxuICAgICAgICAgICAgY2hhciA9ICdcXHUyMDAxJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdMJzpcbiAgICAgICAgICAgIGNoYXIgPSAnw4EnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ0x0bW8nOlxuICAgICAgICAgICAgY2hhciA9ICfHhSc7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHsgdmFsdWU6IGNoYXIgfTsgLy8g8J+SqVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5nZXRBcml0eSA9IGNvbW1vbi5hYnN0cmFjdCgnZ2V0QXJpdHknKTtcbnBleHBycy5hbnkuZ2V0QXJpdHkgPVxuICAgIHBleHBycy5lbmQuZ2V0QXJpdHkgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmdldEFyaXR5ID1cbiAgICAgICAgICAgIHBleHBycy5SYW5nZS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuQXBwbHkucHJvdG90eXBlLmdldEFyaXR5ID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xucGV4cHJzLkFsdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gVGhpcyBpcyBvayBiL2MgYWxsIHRlcm1zIG11c3QgaGF2ZSB0aGUgc2FtZSBhcml0eSAtLSB0aGlzIHByb3BlcnR5IGlzXG4gICAgLy8gY2hlY2tlZCBieSB0aGUgR3JhbW1hciBjb25zdHJ1Y3Rvci5cbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgPyAwIDogdGhpcy50ZXJtc1swXS5nZXRBcml0eSgpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcml0eSA9IDA7XG4gICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgdGhpcy5mYWN0b3JzLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgYXJpdHkgKz0gdGhpcy5mYWN0b3JzW2lkeF0uZ2V0QXJpdHkoKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyaXR5O1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5nZXRBcml0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUuZ2V0QXJpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIDA7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUuZ2V0QXJpdHkgPVxuICAgIHBleHBycy5MZXgucHJvdG90eXBlLmdldEFyaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5leHByLmdldEFyaXR5KCk7XG4gICAgfTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgQ2FsbGVkIGF0IGdyYW1tYXIgY3JlYXRpb24gdGltZSB0byByZXdyaXRlIGEgcnVsZSBib2R5LCByZXBsYWNpbmcgZWFjaCByZWZlcmVuY2UgdG8gYSBmb3JtYWxcbiAgcGFyYW1ldGVyIHdpdGggYSBgUGFyYW1gIG5vZGUuIFJldHVybnMgYSBQRXhwciAtLSBlaXRoZXIgYSBuZXcgb25lLCBvciB0aGUgb3JpZ2luYWwgb25lIGlmXG4gIGl0IHdhcyBtb2RpZmllZCBpbiBwbGFjZS5cbiovXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGNvbW1vbi5hYnN0cmFjdCgnaW50cm9kdWNlUGFyYW1zJyk7XG5wZXhwcnMuYW55LmludHJvZHVjZVBhcmFtcyA9XG4gICAgcGV4cHJzLmVuZC5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICBwZXhwcnMuVGVybWluYWwucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgICAgICAgICAgICAgICAgICBwZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BbHQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9IGZ1bmN0aW9uIChmb3JtYWxzKSB7XG4gICAgdGhpcy50ZXJtcy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXJtLCBpZHgsIHRlcm1zKSB7XG4gICAgICAgIHRlcm1zW2lkeF0gPSB0ZXJtLmludHJvZHVjZVBhcmFtcyhmb3JtYWxzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgIHRoaXMuZmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmYWN0b3IsIGlkeCwgZmFjdG9ycykge1xuICAgICAgICBmYWN0b3JzW2lkeF0gPSBmYWN0b3IuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICAgIH0pO1xuICAgIHJldHVybiB0aGlzO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPVxuICAgIHBleHBycy5Ob3QucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLmludHJvZHVjZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuTGV4LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXhwciA9IHRoaXMuZXhwci5pbnRyb2R1Y2VQYXJhbXMoZm9ybWFscyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5pbnRyb2R1Y2VQYXJhbXMgPSBmdW5jdGlvbiAoZm9ybWFscykge1xuICAgIHZhciBpbmRleCA9IGZvcm1hbHMuaW5kZXhPZih0aGlzLnJ1bGVOYW1lKTtcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIFRPRE86IFNob3VsZCB0aGlzIGJlIHN1cHBvcnRlZD8gU2VlIGlzc3VlICM2NC5cbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyaXplZCBydWxlcyBjYW5ub3QgYmUgcGFzc2VkIGFzIGFyZ3VtZW50cyB0byBhbm90aGVyIHJ1bGUuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuUGFyYW0oaW5kZXgpLndpdGhTb3VyY2UodGhpcy5zb3VyY2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5hcmdzLmZvckVhY2goZnVuY3Rpb24gKGFyZywgaWR4LCBhcmdzKSB7XG4gICAgICAgICAgICBhcmdzW2lkeF0gPSBhcmcuaW50cm9kdWNlUGFyYW1zKGZvcm1hbHMpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmV0dXJucyBgdHJ1ZWAgaWYgdGhpcyBwYXJzaW5nIGV4cHJlc3Npb24gbWF5IGFjY2VwdCB3aXRob3V0IGNvbnN1bWluZyBhbnkgaW5wdXQuXG5wZXhwcnMuUEV4cHIucHJvdG90eXBlLmlzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHJldHVybiB0aGlzLl9pc051bGxhYmxlKGdyYW1tYXIsIE9iamVjdC5jcmVhdGUobnVsbCkpO1xufTtcbnBleHBycy5QRXhwci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBjb21tb24uYWJzdHJhY3QoJ19pc051bGxhYmxlJyk7XG5wZXhwcnMuYW55Ll9pc051bGxhYmxlID1cbiAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLl9pc051bGxhYmxlID1cbiAgICAgICAgcGV4cHJzLlBhcmFtLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICBwZXhwcnMuUGx1cy5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfTtcbnBleHBycy5lbmQuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIHJldHVybiB0cnVlO1xufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vYmogPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIC8vIFRoaXMgaXMgYW4gb3Zlci1zaW1wbGlmaWNhdGlvbjogaXQncyBvbmx5IGNvcnJlY3QgaWYgdGhlIGlucHV0IGlzIGEgc3RyaW5nLiBJZiBpdCdzIGFuIGFycmF5XG4gICAgICAgIC8vIG9yIGFuIG9iamVjdCwgdGhlbiB0aGUgZW1wdHkgc3RyaW5nIHBhcnNpbmcgZXhwcmVzc2lvbiBpcyBub3QgbnVsbGFibGUuXG4gICAgICAgIHJldHVybiB0aGlzLm9iaiA9PT0gJyc7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcbnBleHBycy5BbHQucHJvdG90eXBlLl9pc051bGxhYmxlID0gZnVuY3Rpb24gKGdyYW1tYXIsIG1lbW8pIHtcbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDAgfHxcbiAgICAgICAgdGhpcy50ZXJtcy5zb21lKGZ1bmN0aW9uICh0ZXJtKSB7IHJldHVybiB0ZXJtLl9pc051bGxhYmxlKGdyYW1tYXIsIG1lbW8pOyB9KTtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgcmV0dXJuIHRoaXMuZmFjdG9ycy5ldmVyeShmdW5jdGlvbiAoZmFjdG9yKSB7IHJldHVybiBmYWN0b3IuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7IH0pO1xufTtcbnBleHBycy5TdGFyLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgcGV4cHJzLk9wdC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPVxuICAgICAgICBwZXhwcnMuTm90LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9XG4gICAgICAgICAgICBwZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9O1xucGV4cHJzLkxleC5wcm90b3R5cGUuX2lzTnVsbGFibGUgPSBmdW5jdGlvbiAoZ3JhbW1hciwgbWVtbykge1xuICAgIHJldHVybiB0aGlzLmV4cHIuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS5faXNOdWxsYWJsZSA9IGZ1bmN0aW9uIChncmFtbWFyLCBtZW1vKSB7XG4gICAgdmFyIGtleSA9IHRoaXMudG9NZW1vS2V5KCk7XG4gICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobWVtbywga2V5KSkge1xuICAgICAgICB2YXIgYm9keSA9IGdyYW1tYXIucnVsZXNbdGhpcy5ydWxlTmFtZV0uYm9keTtcbiAgICAgICAgdmFyIGlubGluZWQgPSBib2R5LnN1YnN0aXR1dGVQYXJhbXModGhpcy5hcmdzKTtcbiAgICAgICAgbWVtb1trZXldID0gZmFsc2U7IC8vIFByZXZlbnQgaW5maW5pdGUgcmVjdXJzaW9uIGZvciByZWN1cnNpdmUgcnVsZXMuXG4gICAgICAgIG1lbW9ba2V5XSA9IGlubGluZWQuX2lzTnVsbGFibGUoZ3JhbW1hciwgbWVtbyk7XG4gICAgfVxuICAgIHJldHVybiBtZW1vW2tleV07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBnZXRNZXRhSW5mbyhleHByLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICB2YXIgbWV0YUluZm8gPSB7fTtcbiAgICBpZiAoZXhwci5zb3VyY2UgJiYgZ3JhbW1hckludGVydmFsKSB7XG4gICAgICAgIHZhciBhZGp1c3RlZCA9IGV4cHIuc291cmNlLnJlbGF0aXZlVG8oZ3JhbW1hckludGVydmFsKTtcbiAgICAgICAgbWV0YUluZm8uc291cmNlSW50ZXJ2YWwgPSBbYWRqdXN0ZWQuc3RhcnRJZHgsIGFkanVzdGVkLmVuZElkeF07XG4gICAgfVxuICAgIHJldHVybiBtZXRhSW5mbztcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBjb21tb24uYWJzdHJhY3QoJ291dHB1dFJlY2lwZScpO1xucGV4cHJzLmFueS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnYW55JywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xucGV4cHJzLmVuZC5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFsnZW5kJywgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKV07XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgJ3Rlcm1pbmFsJyxcbiAgICAgICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICAgICAgdGhpcy5vYmpcbiAgICBdO1xufTtcbnBleHBycy5SYW5nZS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbXG4gICAgICAgICdyYW5nZScsXG4gICAgICAgIGdldE1ldGFJbmZvKHRoaXMsIGdyYW1tYXJJbnRlcnZhbCksXG4gICAgICAgIHRoaXMuZnJvbSxcbiAgICAgICAgdGhpcy50b1xuICAgIF07XG59O1xucGV4cHJzLlBhcmFtLnByb3RvdHlwZS5vdXRwdXRSZWNpcGUgPSBmdW5jdGlvbiAoZm9ybWFscywgZ3JhbW1hckludGVydmFsKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgICAgJ3BhcmFtJyxcbiAgICAgICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKSxcbiAgICAgICAgdGhpcy5pbmRleFxuICAgIF07XG59O1xucGV4cHJzLkFsdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbXG4gICAgICAgICdhbHQnLFxuICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpXG4gICAgXS5jb25jYXQodGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24gKHRlcm0pIHtcbiAgICAgICAgcmV0dXJuIHRlcm0ub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gICAgfSkpO1xufTtcbnBleHBycy5FeHRlbmQucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICB2YXIgZXh0ZW5zaW9uID0gdGhpcy50ZXJtc1swXTsgLy8gW2V4dGVuc2lvbiwgb3JnaW5hbF1cbiAgICByZXR1cm4gZXh0ZW5zaW9uLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xufTtcbnBleHBycy5TZXEucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAnc2VxJyxcbiAgICAgICAgZ2V0TWV0YUluZm8odGhpcywgZ3JhbW1hckludGVydmFsKVxuICAgIF0uY29uY2F0KHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGZhY3Rvcikge1xuICAgICAgICByZXR1cm4gZmFjdG9yLm91dHB1dFJlY2lwZShmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpO1xuICAgIH0pKTtcbn07XG5wZXhwcnMuU3Rhci5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICBwZXhwcnMuUGx1cy5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgcGV4cHJzLk9wdC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yLm5hbWUudG9Mb3dlckNhc2UoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXhwci5vdXRwdXRSZWNpcGUoZm9ybWFscywgZ3JhbW1hckludGVydmFsKVxuICAgICAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUub3V0cHV0UmVjaXBlID0gZnVuY3Rpb24gKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCkge1xuICAgIHJldHVybiBbXG4gICAgICAgICdhcHAnLFxuICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgICAgICB0aGlzLnJ1bGVOYW1lLFxuICAgICAgICB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHtcbiAgICAgICAgICAgIHJldHVybiBhcmcub3V0cHV0UmVjaXBlKGZvcm1hbHMsIGdyYW1tYXJJbnRlcnZhbCk7XG4gICAgICAgIH0pXG4gICAgXTtcbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLm91dHB1dFJlY2lwZSA9IGZ1bmN0aW9uIChmb3JtYWxzLCBncmFtbWFySW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gW1xuICAgICAgICAndW5pY29kZUNoYXInLFxuICAgICAgICBnZXRNZXRhSW5mbyh0aGlzLCBncmFtbWFySW50ZXJ2YWwpLFxuICAgICAgICB0aGlzLmNhdGVnb3J5XG4gICAgXTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8qXG4gIFJldHVybnMgYSBQRXhwciB0aGF0IHJlc3VsdHMgZnJvbSByZWN1cnNpdmVseSByZXBsYWNpbmcgZXZlcnkgZm9ybWFsIHBhcmFtZXRlciAoaS5lLiwgaW5zdGFuY2VcbiAgb2YgYFBhcmFtYCkgaW5zaWRlIHRoaXMgUEV4cHIgd2l0aCBpdHMgYWN0dWFsIHZhbHVlIGZyb20gYGFjdHVhbHNgIChhbiBBcnJheSkuXG5cbiAgVGhlIHJlY2VpdmVyIG11c3Qgbm90IGJlIG1vZGlmaWVkOyBhIG5ldyBQRXhwciBtdXN0IGJlIHJldHVybmVkIGlmIGFueSByZXBsYWNlbWVudCBpcyBuZWNlc3NhcnkuXG4qL1xuLy8gZnVuY3Rpb24oYWN0dWFscykgeyAuLi4gfVxucGV4cHJzLlBFeHByLnByb3RvdHlwZS5zdWJzdGl0dXRlUGFyYW1zID0gY29tbW9uLmFic3RyYWN0KCdzdWJzdGl0dXRlUGFyYW1zJyk7XG5wZXhwcnMuYW55LnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgIHBleHBycy5lbmQuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgICAgIHBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAgICAgICAgIH07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBhY3R1YWxzW3RoaXMuaW5kZXhdO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIHJldHVybiBuZXcgcGV4cHJzLkFsdCh0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gdGVybS5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KSk7XG59O1xucGV4cHJzLlNlcS5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgcmV0dXJuIG5ldyBwZXhwcnMuU2VxKHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGZhY3RvcikgeyByZXR1cm4gZmFjdG9yLnN1YnN0aXR1dGVQYXJhbXMoYWN0dWFscyk7IH0pKTtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgcGV4cHJzLk5vdC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9XG4gICAgICAgIHBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPVxuICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUuc3Vic3RpdHV0ZVBhcmFtcyA9IGZ1bmN0aW9uIChhY3R1YWxzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuZXhwci5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpKTtcbiAgICAgICAgICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnN1YnN0aXR1dGVQYXJhbXMgPSBmdW5jdGlvbiAoYWN0dWFscykge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEF2b2lkIG1ha2luZyBhIGNvcHkgb2YgdGhpcyBhcHBsaWNhdGlvbiwgYXMgYW4gb3B0aW1pemF0aW9uXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy5zdWJzdGl0dXRlUGFyYW1zKGFjdHVhbHMpOyB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBwZXhwcnMuQXBwbHkodGhpcy5ydWxlTmFtZSwgYXJncyk7XG4gICAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbnZhciBjb3B5V2l0aG91dER1cGxpY2F0ZXMgPSBjb21tb24uY29weVdpdGhvdXREdXBsaWNhdGVzO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFByaXZhdGUgc3R1ZmZcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mdW5jdGlvbiBpc1Jlc3RyaWN0ZWRKU0lkZW50aWZpZXIoc3RyKSB7XG4gICAgcmV0dXJuIC9eW2EtekEtWl8kXVswLTlhLXpBLVpfJF0qJC8udGVzdChzdHIpO1xufVxuZnVuY3Rpb24gcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KSB7XG4gICAgLy8gYGNvdW50YCBpcyB1c2VkIHRvIHJlY29yZCB0aGUgbnVtYmVyIG9mIHRpbWVzIGVhY2ggYXJndW1lbnQgbmFtZSBvY2N1cnMgaW4gdGhlIGxpc3QsXG4gICAgLy8gdGhpcyBpcyB1c2VmdWwgZm9yIGNoZWNraW5nIGR1cGxpY2F0ZWQgYXJndW1lbnQgbmFtZS4gSXQgbWFwcyBhcmd1bWVudCBuYW1lcyB0byBpbnRzLlxuICAgIHZhciBjb3VudCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChhcmdOYW1lKSB7XG4gICAgICAgIGNvdW50W2FyZ05hbWVdID0gKGNvdW50W2FyZ05hbWVdIHx8IDApICsgMTtcbiAgICB9KTtcbiAgICAvLyBBcHBlbmQgc3Vic2NyaXB0cyAoJ18xJywgJ18yJywgLi4uKSB0byBkdXBsaWNhdGUgYXJndW1lbnQgbmFtZXMuXG4gICAgT2JqZWN0LmtleXMoY291bnQpLmZvckVhY2goZnVuY3Rpb24gKGR1cEFyZ05hbWUpIHtcbiAgICAgICAgaWYgKGNvdW50W2R1cEFyZ05hbWVdIDw9IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBUaGlzIG5hbWUgc2hvd3MgdXAgbW9yZSB0aGFuIG9uY2UsIHNvIGFkZCBzdWJzY3JpcHRzLlxuICAgICAgICB2YXIgc3Vic2NyaXB0ID0gMTtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChhcmdOYW1lLCBpZHgpIHtcbiAgICAgICAgICAgIGlmIChhcmdOYW1lID09PSBkdXBBcmdOYW1lKSB7XG4gICAgICAgICAgICAgICAgYXJndW1lbnROYW1lTGlzdFtpZHhdID0gYXJnTmFtZSArICdfJyArIHN1YnNjcmlwdCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgUmV0dXJucyBhIGxpc3Qgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgYmUgdXNlZCBhcyB0aGUgZGVmYXVsdCBhcmd1bWVudCBuYW1lcyBmb3IgaXRzIHJlY2VpdmVyXG4gIChhIHBleHByKSBpbiBhIHNlbWFudGljIGFjdGlvbi4gVGhpcyBpcyB1c2VkIGV4Y2x1c2l2ZWx5IGJ5IHRoZSBTZW1hbnRpY3MgRWRpdG9yLlxuXG4gIGBmaXJzdEFyZ0luZGV4YCBpcyB0aGUgMS1iYXNlZCBpbmRleCBvZiB0aGUgZmlyc3QgYXJndW1lbnQgbmFtZSB0aGF0IHdpbGwgYmUgZ2VuZXJhdGVkIGZvciB0aGlzXG4gIHBleHByLiBJdCBlbmFibGVzIHVzIHRvIG5hbWUgYXJndW1lbnRzIHBvc2l0aW9uYWxseSwgZS5nLiwgaWYgdGhlIHNlY29uZCBhcmd1bWVudCBpcyBhXG4gIG5vbi1hbHBoYW51bWVyaWMgdGVybWluYWwgbGlrZSBcIitcIiwgaXQgd2lsbCBiZSBuYW1lZCAnJDInLlxuXG4gIGBub0R1cENoZWNrYCBpcyB0cnVlIGlmIHRoZSBjYWxsZXIgb2YgYHRvQXJndW1lbnROYW1lTGlzdGAgaXMgbm90IGEgdG9wIGxldmVsIGNhbGxlci4gSXQgZW5hYmxlc1xuICB1cyB0byBhdm9pZCBuZXN0ZWQgZHVwbGljYXRpb24gc3Vic2NyaXB0cyBhcHBlbmRpbmcsIGUuZy4sICdfMV8xJywgJ18xXzInLCBieSBvbmx5IGNoZWNraW5nXG4gIGR1cGxpY2F0ZXMgYXQgdGhlIHRvcCBsZXZlbC5cblxuICBIZXJlIGlzIGEgbW9yZSBlbGFib3JhdGUgZXhhbXBsZSB0aGF0IGlsbHVzdHJhdGVzIGhvdyB0aGlzIG1ldGhvZCB3b3JrczpcbiAgYChhIFwiK1wiIGIpLnRvQXJndW1lbnROYW1lTGlzdCgxKWAgZXZhbHVhdGVzIHRvIGBbJ2EnLCAnJDInLCAnYiddYCB3aXRoIHRoZSBmb2xsb3dpbmcgcmVjdXJzaXZlXG4gIGNhbGxzOlxuXG4gICAgKGEpLnRvQXJndW1lbnROYW1lTGlzdCgxKSAtPiBbJ2EnXSxcbiAgICAoXCIrXCIpLnRvQXJndW1lbnROYW1lTGlzdCgyKSAtPiBbJyQyJ10sXG4gICAgKGIpLnRvQXJndW1lbnROYW1lTGlzdCgzKSAtPiBbJ2InXVxuXG4gIE5vdGVzOlxuICAqIFRoaXMgbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgb24gd2VsbC1mb3JtZWQgZXhwcmVzc2lvbnMsIGUuZy4sIHRoZSByZWNlaXZlciBtdXN0XG4gICAgbm90IGhhdmUgYW55IEFsdCBzdWItZXhwcmVzc2lvbnMgd2l0aCBpbmNvbnNpc3RlbnQgYXJpdGllcy5cbiAgKiBlLmdldEFyaXR5KCkgPT09IGUudG9Bcmd1bWVudE5hbWVMaXN0KDEpLmxlbmd0aFxuKi9cbi8vIGZ1bmN0aW9uKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHsgLi4uIH1cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gY29tbW9uLmFic3RyYWN0KCd0b0FyZ3VtZW50TmFtZUxpc3QnKTtcbnBleHBycy5hbnkudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gWydhbnknXTtcbn07XG5wZXhwcnMuZW5kLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFsnZW5kJ107XG59O1xucGV4cHJzLlRlcm1pbmFsLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIGlmICh0eXBlb2YgdGhpcy5vYmogPT09ICdzdHJpbmcnICYmIC9eW19hLXpBLVowLTldKyQvLnRlc3QodGhpcy5vYmopKSB7XG4gICAgICAgIC8vIElmIHRoaXMgdGVybWluYWwgaXMgYSB2YWxpZCBzdWZmaXggZm9yIGEgSlMgaWRlbnRpZmllciwganVzdCBwcmVwZW5kIGl0IHdpdGggJ18nXG4gICAgICAgIHJldHVybiBbJ18nICsgdGhpcy5vYmpdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBuYW1lIGl0IHBvc2l0aW9uYWxseS5cbiAgICAgICAgcmV0dXJuIFsnJCcgKyBmaXJzdEFyZ0luZGV4XTtcbiAgICB9XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHZhciBhcmdOYW1lID0gdGhpcy5mcm9tICsgJ190b18nICsgdGhpcy50bztcbiAgICAvLyBJZiB0aGUgYGFyZ05hbWVgIGlzIG5vdCB2YWxpZCB0aGVuIHRyeSB0byBwcmVwZW5kIGEgYF9gLlxuICAgIGlmICghaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKGFyZ05hbWUpKSB7XG4gICAgICAgIGFyZ05hbWUgPSAnXycgKyBhcmdOYW1lO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgYGFyZ05hbWVgIHN0aWxsIG5vdCB2YWxpZCBhZnRlciBwcmVwZW5kaW5nIGEgYF9gLCB0aGVuIG5hbWUgaXQgcG9zaXRpb25hbGx5LlxuICAgIGlmICghaXNSZXN0cmljdGVkSlNJZGVudGlmaWVyKGFyZ05hbWUpKSB7XG4gICAgICAgIGFyZ05hbWUgPSAnJCcgKyBmaXJzdEFyZ0luZGV4O1xuICAgIH1cbiAgICByZXR1cm4gW2FyZ05hbWVdO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgLy8gYHRlcm1BcmdOYW1lTGlzdHNgIGlzIGFuIGFycmF5IG9mIGFycmF5cyB3aGVyZSBlYWNoIHJvdyBpcyB0aGVcbiAgICAvLyBhcmd1bWVudCBuYW1lIGxpc3QgdGhhdCBjb3JyZXNwb25kcyB0byBhIHRlcm0gaW4gdGhpcyBhbHRlcm5hdGlvbi5cbiAgICB2YXIgdGVybUFyZ05hbWVMaXN0cyA9IHRoaXMudGVybXMubWFwKGZ1bmN0aW9uICh0ZXJtKSB7XG4gICAgICAgIHJldHVybiB0ZXJtLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCB0cnVlKTtcbiAgICB9KTtcbiAgICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICAgIHZhciBudW1BcmdzID0gdGVybUFyZ05hbWVMaXN0c1swXS5sZW5ndGg7XG4gICAgZm9yICh2YXIgY29sSWR4ID0gMDsgY29sSWR4IDwgbnVtQXJnczsgY29sSWR4KyspIHtcbiAgICAgICAgdmFyIGNvbCA9IFtdO1xuICAgICAgICBmb3IgKHZhciByb3dJZHggPSAwOyByb3dJZHggPCB0aGlzLnRlcm1zLmxlbmd0aDsgcm93SWR4KyspIHtcbiAgICAgICAgICAgIGNvbC5wdXNoKHRlcm1BcmdOYW1lTGlzdHNbcm93SWR4XVtjb2xJZHhdKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdW5pcXVlTmFtZXMgPSBjb3B5V2l0aG91dER1cGxpY2F0ZXMoY29sKTtcbiAgICAgICAgYXJndW1lbnROYW1lTGlzdC5wdXNoKHVuaXF1ZU5hbWVzLmpvaW4oJ19vcl8nKSk7XG4gICAgfVxuICAgIGlmICghbm9EdXBDaGVjaykge1xuICAgICAgICByZXNvbHZlRHVwbGljYXRlZE5hbWVzKGFyZ3VtZW50TmFtZUxpc3QpO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnROYW1lTGlzdDtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIC8vIEdlbmVyYXRlIHRoZSBhcmd1bWVudCBuYW1lIGxpc3QsIHdpdGhvdXQgd29ycnlpbmcgYWJvdXQgZHVwbGljYXRlcy5cbiAgICB2YXIgYXJndW1lbnROYW1lTGlzdCA9IFtdO1xuICAgIHRoaXMuZmFjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChmYWN0b3IpIHtcbiAgICAgICAgdmFyIGZhY3RvckFyZ3VtZW50TmFtZUxpc3QgPSBmYWN0b3IudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIHRydWUpO1xuICAgICAgICBhcmd1bWVudE5hbWVMaXN0ID0gYXJndW1lbnROYW1lTGlzdC5jb25jYXQoZmFjdG9yQXJndW1lbnROYW1lTGlzdCk7XG4gICAgICAgIC8vIFNoaWZ0IHRoZSBmaXJzdEFyZ0luZGV4IHRvIHRha2UgdGhpcyBmYWN0b3IncyBhcmd1bWVudCBuYW1lcyBpbnRvIGFjY291bnQuXG4gICAgICAgIGZpcnN0QXJnSW5kZXggKz0gZmFjdG9yQXJndW1lbnROYW1lTGlzdC5sZW5ndGg7XG4gICAgfSk7XG4gICAgaWYgKCFub0R1cENoZWNrKSB7XG4gICAgICAgIHJlc29sdmVEdXBsaWNhdGVkTmFtZXMoYXJndW1lbnROYW1lTGlzdCk7XG4gICAgfVxuICAgIHJldHVybiBhcmd1bWVudE5hbWVMaXN0O1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHZhciBhcmd1bWVudE5hbWVMaXN0ID0gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChleHByQXJndW1lbnRTdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGV4cHJBcmd1bWVudFN0cmluZ1tleHByQXJndW1lbnRTdHJpbmcubGVuZ3RoIC0gMV0gPT09ICdzJyA/XG4gICAgICAgICAgICBleHByQXJndW1lbnRTdHJpbmcgKyAnZXMnIDpcbiAgICAgICAgICAgIGV4cHJBcmd1bWVudFN0cmluZyArICdzJztcbiAgICB9KTtcbiAgICBpZiAoIW5vRHVwQ2hlY2spIHtcbiAgICAgICAgcmVzb2x2ZUR1cGxpY2F0ZWROYW1lcyhhcmd1bWVudE5hbWVMaXN0KTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3VtZW50TmFtZUxpc3Q7XG59O1xucGV4cHJzLk9wdC5wcm90b3R5cGUudG9Bcmd1bWVudE5hbWVMaXN0ID0gZnVuY3Rpb24gKGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spIHtcbiAgICByZXR1cm4gdGhpcy5leHByLnRvQXJndW1lbnROYW1lTGlzdChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKS5tYXAoZnVuY3Rpb24gKGFyZ05hbWUpIHtcbiAgICAgICAgcmV0dXJuICdvcHQnICsgYXJnTmFtZVswXS50b1VwcGVyQ2FzZSgpICsgYXJnTmFtZS5zbGljZSgxKTtcbiAgICB9KTtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPSBmdW5jdGlvbiAoZmlyc3RBcmdJbmRleCwgbm9EdXBDaGVjaykge1xuICAgIHJldHVybiBbXTtcbn07XG5wZXhwcnMuTG9va2FoZWFkLnByb3RvdHlwZS50b0FyZ3VtZW50TmFtZUxpc3QgPVxuICAgIHBleHBycy5MZXgucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV4cHIudG9Bcmd1bWVudE5hbWVMaXN0KGZpcnN0QXJnSW5kZXgsIG5vRHVwQ2hlY2spO1xuICAgIH07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFt0aGlzLnJ1bGVOYW1lXTtcbn07XG5wZXhwcnMuVW5pY29kZUNoYXIucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFsnJCcgKyBmaXJzdEFyZ0luZGV4XTtcbn07XG5wZXhwcnMuUGFyYW0ucHJvdG90eXBlLnRvQXJndW1lbnROYW1lTGlzdCA9IGZ1bmN0aW9uIChmaXJzdEFyZ0luZGV4LCBub0R1cENoZWNrKSB7XG4gICAgcmV0dXJuIFsncGFyYW0nICsgdGhpcy5pbmRleF07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEltcG9ydHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBwZXhwcnMgPSByZXF1aXJlKCcuL3BleHBycycpO1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIE9wZXJhdGlvbnNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXR1cm5zIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgUEV4cHIsIGZvciB1c2UgYXMgYSBVSSBsYWJlbCwgZXRjLlxucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBjb21tb24uYWJzdHJhY3QoJ3RvRGlzcGxheVN0cmluZycpO1xucGV4cHJzLkFsdC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICBwZXhwcnMuU2VxLnByb3RvdHlwZS50b0Rpc3BsYXlTdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc291cmNlLnRyaW1tZWQoKS5jb250ZW50cztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ1snICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJ10nO1xuICAgIH07XG5wZXhwcnMuYW55LnRvRGlzcGxheVN0cmluZyA9XG4gICAgcGV4cHJzLmVuZC50b0Rpc3BsYXlTdHJpbmcgPVxuICAgICAgICBwZXhwcnMuSXRlci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgIHBleHBycy5Ob3QucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgcGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgcGV4cHJzLkxleC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvRGlzcGxheVN0cmluZyA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBleHBycy5QYXJhbS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbnBleHBycy5BcHBseS5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICB2YXIgcHMgPSB0aGlzLmFyZ3MubWFwKGZ1bmN0aW9uIChhcmcpIHsgcmV0dXJuIGFyZy50b0Rpc3BsYXlTdHJpbmcoKTsgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lICsgJzwnICsgcHMuam9pbignLCcpICsgJz4nO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZU5hbWU7XG4gICAgfVxufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9EaXNwbGF5U3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnVW5pY29kZSBbJyArIHRoaXMuY2F0ZWdvcnkgKyAnXSBjaGFyYWN0ZXInO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIEZhaWx1cmUgPSByZXF1aXJlKCcuL0ZhaWx1cmUnKTtcbnZhciBjb21tb24gPSByZXF1aXJlKCcuL2NvbW1vbicpO1xudmFyIHBleHBycyA9IHJlcXVpcmUoJy4vcGV4cHJzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gT3BlcmF0aW9uc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnBleHBycy5QRXhwci5wcm90b3R5cGUudG9GYWlsdXJlID0gY29tbW9uLmFic3RyYWN0KCd0b0ZhaWx1cmUnKTtcbnBleHBycy5hbnkudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgJ2FueSBvYmplY3QnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuZW5kLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsICdlbmQgb2YgaW5wdXQnLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuVGVybWluYWwucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIHRoaXMub2JqLCAnc3RyaW5nJyk7XG59O1xucGV4cHJzLlJhbmdlLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIC8vIFRPRE86IGNvbWUgdXAgd2l0aCBzb21ldGhpbmcgYmV0dGVyXG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIEpTT04uc3RyaW5naWZ5KHRoaXMuZnJvbSkgKyAnLi4nICsgSlNPTi5zdHJpbmdpZnkodGhpcy50byksICdjb2RlJyk7XG59O1xucGV4cHJzLk5vdC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSB0aGlzLmV4cHIgPT09IHBleHBycy5hbnkgP1xuICAgICAgICAnbm90aGluZycgOlxuICAgICAgICAnbm90ICcgKyB0aGlzLmV4cHIudG9GYWlsdXJlKGdyYW1tYXIpO1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLkxvb2thaGVhZC5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICByZXR1cm4gdGhpcy5leHByLnRvRmFpbHVyZShncmFtbWFyKTtcbn07XG5wZXhwcnMuQXBwbHkucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdmFyIGRlc2NyaXB0aW9uID0gZ3JhbW1hci5ydWxlc1t0aGlzLnJ1bGVOYW1lXS5kZXNjcmlwdGlvbjtcbiAgICBpZiAoIWRlc2NyaXB0aW9uKSB7XG4gICAgICAgIHZhciBhcnRpY2xlID0gKC9eW2FlaW91QUVJT1VdLy50ZXN0KHRoaXMucnVsZU5hbWUpID8gJ2FuJyA6ICdhJyk7XG4gICAgICAgIGRlc2NyaXB0aW9uID0gYXJ0aWNsZSArICcgJyArIHRoaXMucnVsZU5hbWU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCBkZXNjcmlwdGlvbiwgJ2Rlc2NyaXB0aW9uJyk7XG59O1xucGV4cHJzLlVuaWNvZGVDaGFyLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHJldHVybiBuZXcgRmFpbHVyZSh0aGlzLCAnYSBVbmljb2RlIFsnICsgdGhpcy5jYXRlZ29yeSArICddIGNoYXJhY3RlcicsICdkZXNjcmlwdGlvbicpO1xufTtcbnBleHBycy5BbHQucHJvdG90eXBlLnRvRmFpbHVyZSA9IGZ1bmN0aW9uIChncmFtbWFyKSB7XG4gICAgdmFyIGZzID0gdGhpcy50ZXJtcy5tYXAoZnVuY3Rpb24gKHQpIHsgcmV0dXJuIHQudG9GYWlsdXJlKGdyYW1tYXIpOyB9KTtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSAnKCcgKyBmcy5qb2luKCcgb3IgJykgKyAnKSc7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b0ZhaWx1cmUgPSBmdW5jdGlvbiAoZ3JhbW1hcikge1xuICAgIHZhciBmcyA9IHRoaXMuZmFjdG9ycy5tYXAoZnVuY3Rpb24gKGYpIHsgcmV0dXJuIGYudG9GYWlsdXJlKGdyYW1tYXIpOyB9KTtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSAnKCcgKyBmcy5qb2luKCcgJykgKyAnKSc7XG4gICAgcmV0dXJuIG5ldyBGYWlsdXJlKHRoaXMsIGRlc2NyaXB0aW9uLCAnZGVzY3JpcHRpb24nKTtcbn07XG5wZXhwcnMuSXRlci5wcm90b3R5cGUudG9GYWlsdXJlID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSAnKCcgKyB0aGlzLmV4cHIudG9GYWlsdXJlKGdyYW1tYXIpICsgdGhpcy5vcGVyYXRvciArICcpJztcbiAgICByZXR1cm4gbmV3IEZhaWx1cmUodGhpcywgZGVzY3JpcHRpb24sICdkZXNjcmlwdGlvbicpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG52YXIgcGV4cHJzID0gcmVxdWlyZSgnLi9wZXhwcnMnKTtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBPcGVyYXRpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLypcbiAgZTEudG9TdHJpbmcoKSA9PT0gZTIudG9TdHJpbmcoKSA9PT4gZTEgYW5kIGUyIGFyZSBzZW1hbnRpY2FsbHkgZXF1aXZhbGVudC5cbiAgTm90ZSB0aGF0IHRoaXMgaXMgbm90IGFuIGlmZiAoPD09Pik6IGUuZy4sXG4gICh+XCJiXCIgXCJhXCIpLnRvU3RyaW5nKCkgIT09IChcImFcIikudG9TdHJpbmcoKSwgZXZlbiB0aG91Z2hcbiAgflwiYlwiIFwiYVwiIGFuZCBcImFcIiBhcmUgaW50ZXJjaGFuZ2VhYmxlIGluIGFueSBncmFtbWFyLFxuICBib3RoIGluIHRlcm1zIG9mIHRoZSBsYW5ndWFnZXMgdGhleSBhY2NlcHQgYW5kIHRoZWlyIGFyaXRpZXMuXG4qL1xucGV4cHJzLlBFeHByLnByb3RvdHlwZS50b1N0cmluZyA9IGNvbW1vbi5hYnN0cmFjdCgndG9TdHJpbmcnKTtcbnBleHBycy5hbnkudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdhbnknO1xufTtcbnBleHBycy5lbmQudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdlbmQnO1xufTtcbnBleHBycy5UZXJtaW5hbC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMub2JqKTtcbn07XG5wZXhwcnMuUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmZyb20pICsgJy4uJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudG8pO1xufTtcbnBleHBycy5QYXJhbS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICckJyArIHRoaXMuaW5kZXg7XG59O1xucGV4cHJzLkxleC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICcjKCcgKyB0aGlzLmV4cHIudG9TdHJpbmcoKSArICcpJztcbn07XG5wZXhwcnMuQWx0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXJtcy5sZW5ndGggPT09IDEgP1xuICAgICAgICB0aGlzLnRlcm1zWzBdLnRvU3RyaW5nKCkgOlxuICAgICAgICAnKCcgKyB0aGlzLnRlcm1zLm1hcChmdW5jdGlvbiAodGVybSkgeyByZXR1cm4gdGVybS50b1N0cmluZygpOyB9KS5qb2luKCcgfCAnKSArICcpJztcbn07XG5wZXhwcnMuU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5mYWN0b3JzLmxlbmd0aCA9PT0gMSA/XG4gICAgICAgIHRoaXMuZmFjdG9yc1swXS50b1N0cmluZygpIDpcbiAgICAgICAgJygnICsgdGhpcy5mYWN0b3JzLm1hcChmdW5jdGlvbiAoZmFjdG9yKSB7IHJldHVybiBmYWN0b3IudG9TdHJpbmcoKTsgfSkuam9pbignICcpICsgJyknO1xufTtcbnBleHBycy5JdGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5leHByICsgdGhpcy5vcGVyYXRvcjtcbn07XG5wZXhwcnMuTm90LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJ34nICsgdGhpcy5leHByO1xufTtcbnBleHBycy5Mb29rYWhlYWQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAnJicgKyB0aGlzLmV4cHI7XG59O1xucGV4cHJzLkFwcGx5LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdmFyIHBzID0gdGhpcy5hcmdzLm1hcChmdW5jdGlvbiAoYXJnKSB7IHJldHVybiBhcmcudG9TdHJpbmcoKTsgfSk7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bGVOYW1lICsgJzwnICsgcHMuam9pbignLCcpICsgJz4nO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZU5hbWU7XG4gICAgfVxufTtcbnBleHBycy5Vbmljb2RlQ2hhci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICdcXFxccHsnICsgdGhpcy5jYXRlZ29yeSArICd9Jztcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gSW1wb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbnZhciBVbmljb2RlQ2F0ZWdvcmllcyA9IHJlcXVpcmUoJy4uL3RoaXJkX3BhcnR5L1VuaWNvZGVDYXRlZ29yaWVzJyk7XG52YXIgY29tbW9uID0gcmVxdWlyZSgnLi9jb21tb24nKTtcbnZhciBpbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdlbmVyYWwgc3R1ZmZcbmZ1bmN0aW9uIFBFeHByKCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlBFeHByIGNhbm5vdCBiZSBpbnN0YW50aWF0ZWQgLS0gaXQncyBhYnN0cmFjdFwiKTtcbn1cbi8vIFNldCB0aGUgYHNvdXJjZWAgcHJvcGVydHkgdG8gdGhlIGludGVydmFsIGNvbnRhaW5pbmcgdGhlIHNvdXJjZSBmb3IgdGhpcyBleHByZXNzaW9uLlxuUEV4cHIucHJvdG90eXBlLndpdGhTb3VyY2UgPSBmdW5jdGlvbiAoaW50ZXJ2YWwpIHtcbiAgICBpZiAoaW50ZXJ2YWwpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBpbnRlcnZhbC50cmltbWVkKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xufTtcbi8vIEFueVxudmFyIGFueSA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcbi8vIEVuZFxudmFyIGVuZCA9IE9iamVjdC5jcmVhdGUoUEV4cHIucHJvdG90eXBlKTtcbi8vIFRlcm1pbmFsc1xuZnVuY3Rpb24gVGVybWluYWwob2JqKSB7XG4gICAgdGhpcy5vYmogPSBvYmo7XG59XG5pbmhlcml0cyhUZXJtaW5hbCwgUEV4cHIpO1xuLy8gUmFuZ2VzXG5mdW5jdGlvbiBSYW5nZShmcm9tLCB0bykge1xuICAgIHRoaXMuZnJvbSA9IGZyb207XG4gICAgdGhpcy50byA9IHRvO1xufVxuaW5oZXJpdHMoUmFuZ2UsIFBFeHByKTtcbi8vIFBhcmFtZXRlcnNcbmZ1bmN0aW9uIFBhcmFtKGluZGV4KSB7XG4gICAgdGhpcy5pbmRleCA9IGluZGV4O1xufVxuaW5oZXJpdHMoUGFyYW0sIFBFeHByKTtcbi8vIEFsdGVybmF0aW9uXG5mdW5jdGlvbiBBbHQodGVybXMpIHtcbiAgICB0aGlzLnRlcm1zID0gdGVybXM7XG59XG5pbmhlcml0cyhBbHQsIFBFeHByKTtcbi8vIEV4dGVuZCBpcyBhbiBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgcnVsZSBleHRlbnNpb25cbmZ1bmN0aW9uIEV4dGVuZChzdXBlckdyYW1tYXIsIG5hbWUsIGJvZHkpIHtcbiAgICB0aGlzLnN1cGVyR3JhbW1hciA9IHN1cGVyR3JhbW1hcjtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuYm9keSA9IGJvZHk7XG4gICAgdmFyIG9yaWdCb2R5ID0gc3VwZXJHcmFtbWFyLnJ1bGVzW25hbWVdLmJvZHk7XG4gICAgdGhpcy50ZXJtcyA9IFtib2R5LCBvcmlnQm9keV07XG59XG5pbmhlcml0cyhFeHRlbmQsIEFsdCk7XG4vLyBTZXF1ZW5jZXNcbmZ1bmN0aW9uIFNlcShmYWN0b3JzKSB7XG4gICAgdGhpcy5mYWN0b3JzID0gZmFjdG9ycztcbn1cbmluaGVyaXRzKFNlcSwgUEV4cHIpO1xuLy8gSXRlcmF0b3JzIGFuZCBvcHRpb25hbHNcbmZ1bmN0aW9uIEl0ZXIoZXhwcikge1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhJdGVyLCBQRXhwcik7XG5mdW5jdGlvbiBTdGFyKGV4cHIpIHtcbiAgICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoU3RhciwgSXRlcik7XG5mdW5jdGlvbiBQbHVzKGV4cHIpIHtcbiAgICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoUGx1cywgSXRlcik7XG5mdW5jdGlvbiBPcHQoZXhwcikge1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhPcHQsIEl0ZXIpO1xuU3Rhci5wcm90b3R5cGUub3BlcmF0b3IgPSAnKic7XG5QbHVzLnByb3RvdHlwZS5vcGVyYXRvciA9ICcrJztcbk9wdC5wcm90b3R5cGUub3BlcmF0b3IgPSAnPyc7XG5TdGFyLnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMDtcblBsdXMucHJvdG90eXBlLm1pbk51bU1hdGNoZXMgPSAxO1xuT3B0LnByb3RvdHlwZS5taW5OdW1NYXRjaGVzID0gMDtcblN0YXIucHJvdG90eXBlLm1heE51bU1hdGNoZXMgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG5QbHVzLnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuT3B0LnByb3RvdHlwZS5tYXhOdW1NYXRjaGVzID0gMTtcbi8vIFByZWRpY2F0ZXNcbmZ1bmN0aW9uIE5vdChleHByKSB7XG4gICAgdGhpcy5leHByID0gZXhwcjtcbn1cbmluaGVyaXRzKE5vdCwgUEV4cHIpO1xuZnVuY3Rpb24gTG9va2FoZWFkKGV4cHIpIHtcbiAgICB0aGlzLmV4cHIgPSBleHByO1xufVxuaW5oZXJpdHMoTG9va2FoZWFkLCBQRXhwcik7XG4vLyBcIkxleGlmaWNhdGlvblwiXG5mdW5jdGlvbiBMZXgoZXhwcikge1xuICAgIHRoaXMuZXhwciA9IGV4cHI7XG59XG5pbmhlcml0cyhMZXgsIFBFeHByKTtcbi8vIFJ1bGUgYXBwbGljYXRpb25cbmZ1bmN0aW9uIEFwcGx5KHJ1bGVOYW1lLCBvcHRBcmdzKSB7XG4gICAgdGhpcy5ydWxlTmFtZSA9IHJ1bGVOYW1lO1xuICAgIHRoaXMuYXJncyA9IG9wdEFyZ3MgfHwgW107XG59XG5pbmhlcml0cyhBcHBseSwgUEV4cHIpO1xuQXBwbHkucHJvdG90eXBlLmlzU3ludGFjdGljID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBjb21tb24uaXNTeW50YWN0aWModGhpcy5ydWxlTmFtZSk7XG59O1xuLy8gVGhpcyBtZXRob2QganVzdCBjYWNoZXMgdGhlIHJlc3VsdCBvZiBgdGhpcy50b1N0cmluZygpYCBpbiBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5LlxuQXBwbHkucHJvdG90eXBlLnRvTWVtb0tleSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX21lbW9LZXkpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfbWVtb0tleScsIHsgdmFsdWU6IHRoaXMudG9TdHJpbmcoKSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX21lbW9LZXk7XG59O1xuLy8gVW5pY29kZSBjaGFyYWN0ZXJcbmZ1bmN0aW9uIFVuaWNvZGVDaGFyKGNhdGVnb3J5KSB7XG4gICAgdGhpcy5jYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgIHRoaXMucGF0dGVybiA9IFVuaWNvZGVDYXRlZ29yaWVzW2NhdGVnb3J5XTtcbn1cbmluaGVyaXRzKFVuaWNvZGVDaGFyLCBQRXhwcik7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gRXhwb3J0c1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmV4cG9ydHMuUEV4cHIgPSBQRXhwcjtcbmV4cG9ydHMuYW55ID0gYW55O1xuZXhwb3J0cy5lbmQgPSBlbmQ7XG5leHBvcnRzLlRlcm1pbmFsID0gVGVybWluYWw7XG5leHBvcnRzLlJhbmdlID0gUmFuZ2U7XG5leHBvcnRzLlBhcmFtID0gUGFyYW07XG5leHBvcnRzLkFsdCA9IEFsdDtcbmV4cG9ydHMuRXh0ZW5kID0gRXh0ZW5kO1xuZXhwb3J0cy5TZXEgPSBTZXE7XG5leHBvcnRzLkl0ZXIgPSBJdGVyO1xuZXhwb3J0cy5TdGFyID0gU3RhcjtcbmV4cG9ydHMuUGx1cyA9IFBsdXM7XG5leHBvcnRzLk9wdCA9IE9wdDtcbmV4cG9ydHMuTm90ID0gTm90O1xuZXhwb3J0cy5Mb29rYWhlYWQgPSBMb29rYWhlYWQ7XG5leHBvcnRzLkxleCA9IExleDtcbmV4cG9ydHMuQXBwbHkgPSBBcHBseTtcbmV4cG9ydHMuVW5pY29kZUNoYXIgPSBVbmljb2RlQ2hhcjtcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHRlbnNpb25zXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxucmVxdWlyZSgnLi9wZXhwcnMtYWxsb3dzU2tpcHBpbmdQcmVjZWRpbmdTcGFjZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtYXNzZXJ0QWxsQXBwbGljYXRpb25zQXJlVmFsaWQnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWFzc2VydENob2ljZXNIYXZlVW5pZm9ybUFyaXR5Jyk7XG5yZXF1aXJlKCcuL3BleHBycy1hc3NlcnRJdGVyYXRlZEV4cHJzQXJlTm90TnVsbGFibGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWNoZWNrJyk7XG5yZXF1aXJlKCcuL3BleHBycy1ldmFsJyk7XG5yZXF1aXJlKCcuL3BleHBycy1nZXRBcml0eScpO1xucmVxdWlyZSgnLi9wZXhwcnMtZ2VuZXJhdGVFeGFtcGxlJyk7XG5yZXF1aXJlKCcuL3BleHBycy1vdXRwdXRSZWNpcGUnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLWludHJvZHVjZVBhcmFtcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtaXNOdWxsYWJsZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtc3Vic3RpdHV0ZVBhcmFtcycpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9EaXNwbGF5U3RyaW5nJyk7XG5yZXF1aXJlKCcuL3BleHBycy10b0FyZ3VtZW50TmFtZUxpc3QnKTtcbnJlcXVpcmUoJy4vcGV4cHJzLXRvRmFpbHVyZScpO1xucmVxdWlyZSgnLi9wZXhwcnMtdG9TdHJpbmcnKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbXBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGNvbW1vbiA9IHJlcXVpcmUoJy4vY29tbW9uJyk7XG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUHJpdmF0ZSBzdHVmZlxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEdpdmVuIGFuIGFycmF5IG9mIG51bWJlcnMgYGFycmAsIHJldHVybiBhbiBhcnJheSBvZiB0aGUgbnVtYmVycyBhcyBzdHJpbmdzLFxuLy8gcmlnaHQtanVzdGlmaWVkIGFuZCBwYWRkZWQgdG8gdGhlIHNhbWUgbGVuZ3RoLlxuZnVuY3Rpb24gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoYXJyKSB7XG4gICAgdmFyIG1heExlbiA9IDA7XG4gICAgdmFyIHN0cmluZ3MgPSBhcnIubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHZhciBzdHIgPSBuLnRvU3RyaW5nKCk7XG4gICAgICAgIG1heExlbiA9IE1hdGgubWF4KG1heExlbiwgc3RyLmxlbmd0aCk7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0cmluZ3MubWFwKGZ1bmN0aW9uIChzKSB7IHJldHVybiBjb21tb24ucGFkTGVmdChzLCBtYXhMZW4pOyB9KTtcbn1cbi8vIFByb2R1Y2UgYSBuZXcgc3RyaW5nIHRoYXQgd291bGQgYmUgdGhlIHJlc3VsdCBvZiBjb3B5aW5nIHRoZSBjb250ZW50c1xuLy8gb2YgdGhlIHN0cmluZyBgc3JjYCBvbnRvIGBkZXN0YCBhdCBvZmZzZXQgYG9mZmVzdGAuXG5mdW5jdGlvbiBzdHJjcHkoZGVzdCwgc3JjLCBvZmZzZXQpIHtcbiAgICB2YXIgb3JpZ0Rlc3RMZW4gPSBkZXN0Lmxlbmd0aDtcbiAgICB2YXIgc3RhcnQgPSBkZXN0LnNsaWNlKDAsIG9mZnNldCk7XG4gICAgdmFyIGVuZCA9IGRlc3Quc2xpY2Uob2Zmc2V0ICsgc3JjLmxlbmd0aCk7XG4gICAgcmV0dXJuIChzdGFydCArIHNyYyArIGVuZCkuc3Vic3RyKDAsIG9yaWdEZXN0TGVuKTtcbn1cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBFeHBvcnRzXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxudmFyIGJ1aWx0SW5SdWxlc0NhbGxiYWNrcyA9IFtdO1xuLy8gU2luY2UgR3JhbW1hci5CdWlsdEluUnVsZXMgaXMgYm9vdHN0cmFwcGVkLCBtb3N0IG9mIE9obSBjYW4ndCBkaXJlY3RseSBkZXBlbmQgaXQuXG4vLyBUaGlzIGZ1bmN0aW9uIGFsbG93cyBtb2R1bGVzIHRoYXQgZG8gZGVwZW5kIG9uIHRoZSBidWlsdC1pbiBydWxlcyB0byByZWdpc3RlciBhIGNhbGxiYWNrXG4vLyB0aGF0IHdpbGwgYmUgY2FsbGVkIGxhdGVyIGluIHRoZSBpbml0aWFsaXphdGlvbiBwcm9jZXNzLlxuZXhwb3J0cy5hd2FpdEJ1aWx0SW5SdWxlcyA9IGZ1bmN0aW9uIChjYikge1xuICAgIGJ1aWx0SW5SdWxlc0NhbGxiYWNrcy5wdXNoKGNiKTtcbn07XG5leHBvcnRzLmFubm91bmNlQnVpbHRJblJ1bGVzID0gZnVuY3Rpb24gKGdyYW1tYXIpIHtcbiAgICBidWlsdEluUnVsZXNDYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAoY2IpIHtcbiAgICAgICAgY2IoZ3JhbW1hcik7XG4gICAgfSk7XG4gICAgYnVpbHRJblJ1bGVzQ2FsbGJhY2tzID0gbnVsbDtcbn07XG4vLyBSZXR1cm4gYW4gb2JqZWN0IHdpdGggdGhlIGxpbmUgYW5kIGNvbHVtbiBpbmZvcm1hdGlvbiBmb3IgdGhlIGdpdmVuXG4vLyBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW4gPSBmdW5jdGlvbiAoc3RyLCBvZmZzZXQpIHtcbiAgICB2YXIgbGluZU51bSA9IDE7XG4gICAgdmFyIGNvbE51bSA9IDE7XG4gICAgdmFyIGN1cnJPZmZzZXQgPSAwO1xuICAgIHZhciBsaW5lU3RhcnRPZmZzZXQgPSAwO1xuICAgIHZhciBuZXh0TGluZSA9IG51bGw7XG4gICAgdmFyIHByZXZMaW5lID0gbnVsbDtcbiAgICB2YXIgcHJldkxpbmVTdGFydE9mZnNldCA9IC0xO1xuICAgIHdoaWxlIChjdXJyT2Zmc2V0IDwgb2Zmc2V0KSB7XG4gICAgICAgIHZhciBjID0gc3RyLmNoYXJBdChjdXJyT2Zmc2V0KyspO1xuICAgICAgICBpZiAoYyA9PT0gJ1xcbicpIHtcbiAgICAgICAgICAgIGxpbmVOdW0rKztcbiAgICAgICAgICAgIGNvbE51bSA9IDE7XG4gICAgICAgICAgICBwcmV2TGluZVN0YXJ0T2Zmc2V0ID0gbGluZVN0YXJ0T2Zmc2V0O1xuICAgICAgICAgICAgbGluZVN0YXJ0T2Zmc2V0ID0gY3Vyck9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjICE9PSAnXFxyJykge1xuICAgICAgICAgICAgY29sTnVtKys7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gRmluZCB0aGUgZW5kIG9mIHRoZSB0YXJnZXQgbGluZS5cbiAgICB2YXIgbGluZUVuZE9mZnNldCA9IHN0ci5pbmRleE9mKCdcXG4nLCBsaW5lU3RhcnRPZmZzZXQpO1xuICAgIGlmIChsaW5lRW5kT2Zmc2V0ID09PSAtMSkge1xuICAgICAgICBsaW5lRW5kT2Zmc2V0ID0gc3RyLmxlbmd0aDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIEdldCB0aGUgbmV4dCBsaW5lLlxuICAgICAgICB2YXIgbmV4dExpbmVFbmRPZmZzZXQgPSBzdHIuaW5kZXhPZignXFxuJywgbGluZUVuZE9mZnNldCArIDEpO1xuICAgICAgICBuZXh0TGluZSA9IG5leHRMaW5lRW5kT2Zmc2V0ID09PSAtMSA/IHN0ci5zbGljZShsaW5lRW5kT2Zmc2V0KVxuICAgICAgICAgICAgOiBzdHIuc2xpY2UobGluZUVuZE9mZnNldCwgbmV4dExpbmVFbmRPZmZzZXQpO1xuICAgICAgICAvLyBTdHJpcCBsZWFkaW5nIGFuZCB0cmFpbGluZyBFT0wgY2hhcihzKS5cbiAgICAgICAgbmV4dExpbmUgPSBuZXh0TGluZS5yZXBsYWNlKC9eXFxyP1xcbi8sICcnKS5yZXBsYWNlKC9cXHIkLywgJycpO1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIHByZXZpb3VzIGxpbmUuXG4gICAgaWYgKHByZXZMaW5lU3RhcnRPZmZzZXQgPj0gMCkge1xuICAgICAgICBwcmV2TGluZSA9IHN0ci5zbGljZShwcmV2TGluZVN0YXJ0T2Zmc2V0LCBsaW5lU3RhcnRPZmZzZXQpXG4gICAgICAgICAgICAucmVwbGFjZSgvXFxyP1xcbiQvLCAnJyk7IC8vIFN0cmlwIHRyYWlsaW5nIEVPTCBjaGFyKHMpLlxuICAgIH1cbiAgICAvLyBHZXQgdGhlIHRhcmdldCBsaW5lLCBzdHJpcHBpbmcgYSB0cmFpbGluZyBjYXJyaWFnZSByZXR1cm4gaWYgbmVjZXNzYXJ5LlxuICAgIHZhciBsaW5lID0gc3RyLnNsaWNlKGxpbmVTdGFydE9mZnNldCwgbGluZUVuZE9mZnNldCkucmVwbGFjZSgvXFxyJC8sICcnKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBsaW5lTnVtOiBsaW5lTnVtLFxuICAgICAgICBjb2xOdW06IGNvbE51bSxcbiAgICAgICAgbGluZTogbGluZSxcbiAgICAgICAgcHJldkxpbmU6IHByZXZMaW5lLFxuICAgICAgICBuZXh0TGluZTogbmV4dExpbmVcbiAgICB9O1xufTtcbi8vIFJldHVybiBhIG5pY2VseS1mb3JtYXR0ZWQgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIGxpbmUgYW5kIGNvbHVtbiBmb3IgdGhlXG4vLyBnaXZlbiBvZmZzZXQgaW4gYHN0cmAuXG5leHBvcnRzLmdldExpbmVBbmRDb2x1bW5NZXNzYWdlID0gZnVuY3Rpb24gKHN0ciwgb2Zmc2V0IC8qIC4uLnJhbmdlcyAqLykge1xuICAgIHZhciByZXBlYXRTdHIgPSBjb21tb24ucmVwZWF0U3RyO1xuICAgIHZhciBsaW5lQW5kQ29sID0gZXhwb3J0cy5nZXRMaW5lQW5kQ29sdW1uKHN0ciwgb2Zmc2V0KTtcbiAgICB2YXIgc2IgPSBuZXcgY29tbW9uLlN0cmluZ0J1ZmZlcigpO1xuICAgIHNiLmFwcGVuZCgnTGluZSAnICsgbGluZUFuZENvbC5saW5lTnVtICsgJywgY29sICcgKyBsaW5lQW5kQ29sLmNvbE51bSArICc6XFxuJyk7XG4gICAgLy8gQW4gYXJyYXkgb2YgdGhlIHByZXZpb3VzLCBjdXJyZW50LCBhbmQgbmV4dCBsaW5lIG51bWJlcnMgYXMgc3RyaW5ncyBvZiBlcXVhbCBsZW5ndGguXG4gICAgdmFyIGxpbmVOdW1iZXJzID0gcGFkTnVtYmVyc1RvRXF1YWxMZW5ndGgoW1xuICAgICAgICBsaW5lQW5kQ29sLnByZXZMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtIC0gMSxcbiAgICAgICAgbGluZUFuZENvbC5saW5lTnVtLFxuICAgICAgICBsaW5lQW5kQ29sLm5leHRMaW5lID09IG51bGwgPyAwIDogbGluZUFuZENvbC5saW5lTnVtICsgMVxuICAgIF0pO1xuICAgIC8vIEhlbHBlciBmb3IgYXBwZW5kaW5nIGZvcm1hdHRpbmcgaW5wdXQgbGluZXMgdG8gdGhlIGJ1ZmZlci5cbiAgICBmdW5jdGlvbiBhcHBlbmRMaW5lKG51bSwgY29udGVudCwgcHJlZml4KSB7XG4gICAgICAgIHNiLmFwcGVuZChwcmVmaXggKyBsaW5lTnVtYmVyc1tudW1dICsgJyB8ICcgKyBjb250ZW50ICsgJ1xcbicpO1xuICAgIH1cbiAgICAvLyBJbmNsdWRlIHRoZSBwcmV2aW91cyBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICAgIGlmIChsaW5lQW5kQ29sLnByZXZMaW5lICE9IG51bGwpIHtcbiAgICAgICAgYXBwZW5kTGluZSgwLCBsaW5lQW5kQ29sLnByZXZMaW5lLCAnICAnKTtcbiAgICB9XG4gICAgLy8gTGluZSB0aGF0IHRoZSBlcnJvciBvY2N1cnJlZCBvbi5cbiAgICBhcHBlbmRMaW5lKDEsIGxpbmVBbmRDb2wubGluZSwgJz4gJyk7XG4gICAgLy8gQnVpbGQgdXAgdGhlIGxpbmUgdGhhdCBwb2ludHMgdG8gdGhlIG9mZnNldCBhbmQgcG9zc2libGUgaW5kaWNhdGVzIG9uZSBvciBtb3JlIHJhbmdlcy5cbiAgICAvLyBTdGFydCB3aXRoIGEgYmxhbmsgbGluZSwgYW5kIGluZGljYXRlIGVhY2ggcmFuZ2UgYnkgb3ZlcmxheWluZyBhIHN0cmluZyBvZiBgfmAgY2hhcnMuXG4gICAgdmFyIGxpbmVMZW4gPSBsaW5lQW5kQ29sLmxpbmUubGVuZ3RoO1xuICAgIHZhciBpbmRpY2F0aW9uTGluZSA9IHJlcGVhdFN0cignICcsIGxpbmVMZW4gKyAxKTtcbiAgICB2YXIgcmFuZ2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmdlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgc3RhcnRJZHggPSByYW5nZXNbaV1bMF07XG4gICAgICAgIHZhciBlbmRJZHggPSByYW5nZXNbaV1bMV07XG4gICAgICAgIGNvbW1vbi5hc3NlcnQoc3RhcnRJZHggPj0gMCAmJiBzdGFydElkeCA8PSBlbmRJZHgsICdyYW5nZSBzdGFydCBtdXN0IGJlID49IDAgYW5kIDw9IGVuZCcpO1xuICAgICAgICB2YXIgbGluZVN0YXJ0T2Zmc2V0ID0gb2Zmc2V0IC0gbGluZUFuZENvbC5jb2xOdW0gKyAxO1xuICAgICAgICBzdGFydElkeCA9IE1hdGgubWF4KDAsIHN0YXJ0SWR4IC0gbGluZVN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgZW5kSWR4ID0gTWF0aC5taW4oZW5kSWR4IC0gbGluZVN0YXJ0T2Zmc2V0LCBsaW5lTGVuKTtcbiAgICAgICAgaW5kaWNhdGlvbkxpbmUgPSBzdHJjcHkoaW5kaWNhdGlvbkxpbmUsIHJlcGVhdFN0cignficsIGVuZElkeCAtIHN0YXJ0SWR4KSwgc3RhcnRJZHgpO1xuICAgIH1cbiAgICB2YXIgZ3V0dGVyV2lkdGggPSAyICsgbGluZU51bWJlcnNbMV0ubGVuZ3RoICsgMztcbiAgICBzYi5hcHBlbmQocmVwZWF0U3RyKCcgJywgZ3V0dGVyV2lkdGgpKTtcbiAgICBpbmRpY2F0aW9uTGluZSA9IHN0cmNweShpbmRpY2F0aW9uTGluZSwgJ14nLCBsaW5lQW5kQ29sLmNvbE51bSAtIDEpO1xuICAgIHNiLmFwcGVuZChpbmRpY2F0aW9uTGluZS5yZXBsYWNlKC8gKyQvLCAnJykgKyAnXFxuJyk7XG4gICAgLy8gSW5jbHVkZSB0aGUgbmV4dCBsaW5lIGZvciBjb250ZXh0IGlmIHBvc3NpYmxlLlxuICAgIGlmIChsaW5lQW5kQ29sLm5leHRMaW5lICE9IG51bGwpIHtcbiAgICAgICAgYXBwZW5kTGluZSgyLCBsaW5lQW5kQ29sLm5leHRMaW5lLCAnICAnKTtcbiAgICB9XG4gICAgcmV0dXJuIHNiLmNvbnRlbnRzKCk7XG59O1xuZXhwb3J0cy51bmlxdWVJZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlkQ291bnRlciA9IDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcmVmaXgpIHtcbiAgICAgICAgcmV0dXJuICcnICsgcHJlZml4ICsgaWRDb3VudGVyKys7XG4gICAgfTtcbn0pKCk7XG4iLCIvKiBnbG9iYWwgX19HTE9CQUxfT0hNX1ZFUlNJT05fXyAqL1xuJ3VzZSBzdHJpY3QnO1xuLy8gV2hlbiBydW5uaW5nIHVuZGVyIE5vZGUsIHJlYWQgdGhlIHZlcnNpb24gZnJvbSBwYWNrYWdlLmpzb24uIEZvciB0aGUgYnJvd3Nlcixcbi8vIHVzZSBhIHNwZWNpYWwgZ2xvYmFsIHZhcmlhYmxlIGRlZmluZWQgaW4gdGhlIGJ1aWxkIHByb2Nlc3MgKHNlZSB3ZWJwYWNrLmNvbmZpZy5qcykuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBfX0dMT0JBTF9PSE1fVkVSU0lPTl9fID09PSAnc3RyaW5nJ1xuICAgID8gX19HTE9CQUxfT0hNX1ZFUlNJT05fX1xuICAgIDogcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjtcbiIsIi8vIEJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL3VuaWNvZGUtOS4wLjAuXG4vLyBUaGVzZSBhcmUganVzdCBjYXRlZ29yaWVzIHRoYXQgYXJlIHVzZWQgaW4gRVM1L0VTMjAxNS5cbi8vIFRoZSBmdWxsIGxpc3Qgb2YgVW5pY29kZSBjYXRlZ29yaWVzIGlzIGhlcmU6IGh0dHA6Ly93d3cuZmlsZWZvcm1hdC5pbmZvL2luZm8vdW5pY29kZS9jYXRlZ29yeS9pbmRleC5odG0uXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gTGV0dGVyc1xuICBMdTogL1tBLVpcXHhDMC1cXHhENlxceEQ4LVxceERFXFx1MDEwMFxcdTAxMDJcXHUwMTA0XFx1MDEwNlxcdTAxMDhcXHUwMTBBXFx1MDEwQ1xcdTAxMEVcXHUwMTEwXFx1MDExMlxcdTAxMTRcXHUwMTE2XFx1MDExOFxcdTAxMUFcXHUwMTFDXFx1MDExRVxcdTAxMjBcXHUwMTIyXFx1MDEyNFxcdTAxMjZcXHUwMTI4XFx1MDEyQVxcdTAxMkNcXHUwMTJFXFx1MDEzMFxcdTAxMzJcXHUwMTM0XFx1MDEzNlxcdTAxMzlcXHUwMTNCXFx1MDEzRFxcdTAxM0ZcXHUwMTQxXFx1MDE0M1xcdTAxNDVcXHUwMTQ3XFx1MDE0QVxcdTAxNENcXHUwMTRFXFx1MDE1MFxcdTAxNTJcXHUwMTU0XFx1MDE1NlxcdTAxNThcXHUwMTVBXFx1MDE1Q1xcdTAxNUVcXHUwMTYwXFx1MDE2MlxcdTAxNjRcXHUwMTY2XFx1MDE2OFxcdTAxNkFcXHUwMTZDXFx1MDE2RVxcdTAxNzBcXHUwMTcyXFx1MDE3NFxcdTAxNzZcXHUwMTc4XFx1MDE3OVxcdTAxN0JcXHUwMTdEXFx1MDE4MVxcdTAxODJcXHUwMTg0XFx1MDE4NlxcdTAxODdcXHUwMTg5LVxcdTAxOEJcXHUwMThFLVxcdTAxOTFcXHUwMTkzXFx1MDE5NFxcdTAxOTYtXFx1MDE5OFxcdTAxOUNcXHUwMTlEXFx1MDE5RlxcdTAxQTBcXHUwMUEyXFx1MDFBNFxcdTAxQTZcXHUwMUE3XFx1MDFBOVxcdTAxQUNcXHUwMUFFXFx1MDFBRlxcdTAxQjEtXFx1MDFCM1xcdTAxQjVcXHUwMUI3XFx1MDFCOFxcdTAxQkNcXHUwMUM0XFx1MDFDN1xcdTAxQ0FcXHUwMUNEXFx1MDFDRlxcdTAxRDFcXHUwMUQzXFx1MDFENVxcdTAxRDdcXHUwMUQ5XFx1MDFEQlxcdTAxREVcXHUwMUUwXFx1MDFFMlxcdTAxRTRcXHUwMUU2XFx1MDFFOFxcdTAxRUFcXHUwMUVDXFx1MDFFRVxcdTAxRjFcXHUwMUY0XFx1MDFGNi1cXHUwMUY4XFx1MDFGQVxcdTAxRkNcXHUwMUZFXFx1MDIwMFxcdTAyMDJcXHUwMjA0XFx1MDIwNlxcdTAyMDhcXHUwMjBBXFx1MDIwQ1xcdTAyMEVcXHUwMjEwXFx1MDIxMlxcdTAyMTRcXHUwMjE2XFx1MDIxOFxcdTAyMUFcXHUwMjFDXFx1MDIxRVxcdTAyMjBcXHUwMjIyXFx1MDIyNFxcdTAyMjZcXHUwMjI4XFx1MDIyQVxcdTAyMkNcXHUwMjJFXFx1MDIzMFxcdTAyMzJcXHUwMjNBXFx1MDIzQlxcdTAyM0RcXHUwMjNFXFx1MDI0MVxcdTAyNDMtXFx1MDI0NlxcdTAyNDhcXHUwMjRBXFx1MDI0Q1xcdTAyNEVcXHUwMzcwXFx1MDM3MlxcdTAzNzZcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFXFx1MDM4RlxcdTAzOTEtXFx1MDNBMVxcdTAzQTMtXFx1MDNBQlxcdTAzQ0ZcXHUwM0QyLVxcdTAzRDRcXHUwM0Q4XFx1MDNEQVxcdTAzRENcXHUwM0RFXFx1MDNFMFxcdTAzRTJcXHUwM0U0XFx1MDNFNlxcdTAzRThcXHUwM0VBXFx1MDNFQ1xcdTAzRUVcXHUwM0Y0XFx1MDNGN1xcdTAzRjlcXHUwM0ZBXFx1MDNGRC1cXHUwNDJGXFx1MDQ2MFxcdTA0NjJcXHUwNDY0XFx1MDQ2NlxcdTA0NjhcXHUwNDZBXFx1MDQ2Q1xcdTA0NkVcXHUwNDcwXFx1MDQ3MlxcdTA0NzRcXHUwNDc2XFx1MDQ3OFxcdTA0N0FcXHUwNDdDXFx1MDQ3RVxcdTA0ODBcXHUwNDhBXFx1MDQ4Q1xcdTA0OEVcXHUwNDkwXFx1MDQ5MlxcdTA0OTRcXHUwNDk2XFx1MDQ5OFxcdTA0OUFcXHUwNDlDXFx1MDQ5RVxcdTA0QTBcXHUwNEEyXFx1MDRBNFxcdTA0QTZcXHUwNEE4XFx1MDRBQVxcdTA0QUNcXHUwNEFFXFx1MDRCMFxcdTA0QjJcXHUwNEI0XFx1MDRCNlxcdTA0QjhcXHUwNEJBXFx1MDRCQ1xcdTA0QkVcXHUwNEMwXFx1MDRDMVxcdTA0QzNcXHUwNEM1XFx1MDRDN1xcdTA0QzlcXHUwNENCXFx1MDRDRFxcdTA0RDBcXHUwNEQyXFx1MDRENFxcdTA0RDZcXHUwNEQ4XFx1MDREQVxcdTA0RENcXHUwNERFXFx1MDRFMFxcdTA0RTJcXHUwNEU0XFx1MDRFNlxcdTA0RThcXHUwNEVBXFx1MDRFQ1xcdTA0RUVcXHUwNEYwXFx1MDRGMlxcdTA0RjRcXHUwNEY2XFx1MDRGOFxcdTA0RkFcXHUwNEZDXFx1MDRGRVxcdTA1MDBcXHUwNTAyXFx1MDUwNFxcdTA1MDZcXHUwNTA4XFx1MDUwQVxcdTA1MENcXHUwNTBFXFx1MDUxMFxcdTA1MTJcXHUwNTE0XFx1MDUxNlxcdTA1MThcXHUwNTFBXFx1MDUxQ1xcdTA1MUVcXHUwNTIwXFx1MDUyMlxcdTA1MjRcXHUwNTI2XFx1MDUyOFxcdTA1MkFcXHUwNTJDXFx1MDUyRVxcdTA1MzEtXFx1MDU1NlxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTNBMC1cXHUxM0Y1XFx1MUUwMFxcdTFFMDJcXHUxRTA0XFx1MUUwNlxcdTFFMDhcXHUxRTBBXFx1MUUwQ1xcdTFFMEVcXHUxRTEwXFx1MUUxMlxcdTFFMTRcXHUxRTE2XFx1MUUxOFxcdTFFMUFcXHUxRTFDXFx1MUUxRVxcdTFFMjBcXHUxRTIyXFx1MUUyNFxcdTFFMjZcXHUxRTI4XFx1MUUyQVxcdTFFMkNcXHUxRTJFXFx1MUUzMFxcdTFFMzJcXHUxRTM0XFx1MUUzNlxcdTFFMzhcXHUxRTNBXFx1MUUzQ1xcdTFFM0VcXHUxRTQwXFx1MUU0MlxcdTFFNDRcXHUxRTQ2XFx1MUU0OFxcdTFFNEFcXHUxRTRDXFx1MUU0RVxcdTFFNTBcXHUxRTUyXFx1MUU1NFxcdTFFNTZcXHUxRTU4XFx1MUU1QVxcdTFFNUNcXHUxRTVFXFx1MUU2MFxcdTFFNjJcXHUxRTY0XFx1MUU2NlxcdTFFNjhcXHUxRTZBXFx1MUU2Q1xcdTFFNkVcXHUxRTcwXFx1MUU3MlxcdTFFNzRcXHUxRTc2XFx1MUU3OFxcdTFFN0FcXHUxRTdDXFx1MUU3RVxcdTFFODBcXHUxRTgyXFx1MUU4NFxcdTFFODZcXHUxRTg4XFx1MUU4QVxcdTFFOENcXHUxRThFXFx1MUU5MFxcdTFFOTJcXHUxRTk0XFx1MUU5RVxcdTFFQTBcXHUxRUEyXFx1MUVBNFxcdTFFQTZcXHUxRUE4XFx1MUVBQVxcdTFFQUNcXHUxRUFFXFx1MUVCMFxcdTFFQjJcXHUxRUI0XFx1MUVCNlxcdTFFQjhcXHUxRUJBXFx1MUVCQ1xcdTFFQkVcXHUxRUMwXFx1MUVDMlxcdTFFQzRcXHUxRUM2XFx1MUVDOFxcdTFFQ0FcXHUxRUNDXFx1MUVDRVxcdTFFRDBcXHUxRUQyXFx1MUVENFxcdTFFRDZcXHUxRUQ4XFx1MUVEQVxcdTFFRENcXHUxRURFXFx1MUVFMFxcdTFFRTJcXHUxRUU0XFx1MUVFNlxcdTFFRThcXHUxRUVBXFx1MUVFQ1xcdTFFRUVcXHUxRUYwXFx1MUVGMlxcdTFFRjRcXHUxRUY2XFx1MUVGOFxcdTFFRkFcXHUxRUZDXFx1MUVGRVxcdTFGMDgtXFx1MUYwRlxcdTFGMTgtXFx1MUYxRFxcdTFGMjgtXFx1MUYyRlxcdTFGMzgtXFx1MUYzRlxcdTFGNDgtXFx1MUY0RFxcdTFGNTlcXHUxRjVCXFx1MUY1RFxcdTFGNUZcXHUxRjY4LVxcdTFGNkZcXHUxRkI4LVxcdTFGQkJcXHUxRkM4LVxcdTFGQ0JcXHUxRkQ4LVxcdTFGREJcXHUxRkU4LVxcdTFGRUNcXHUxRkY4LVxcdTFGRkJcXHUyMTAyXFx1MjEwN1xcdTIxMEItXFx1MjEwRFxcdTIxMTAtXFx1MjExMlxcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTMwLVxcdTIxMzNcXHUyMTNFXFx1MjEzRlxcdTIxNDVcXHUyMTgzXFx1MkMwMC1cXHUyQzJFXFx1MkM2MFxcdTJDNjItXFx1MkM2NFxcdTJDNjdcXHUyQzY5XFx1MkM2QlxcdTJDNkQtXFx1MkM3MFxcdTJDNzJcXHUyQzc1XFx1MkM3RS1cXHUyQzgwXFx1MkM4MlxcdTJDODRcXHUyQzg2XFx1MkM4OFxcdTJDOEFcXHUyQzhDXFx1MkM4RVxcdTJDOTBcXHUyQzkyXFx1MkM5NFxcdTJDOTZcXHUyQzk4XFx1MkM5QVxcdTJDOUNcXHUyQzlFXFx1MkNBMFxcdTJDQTJcXHUyQ0E0XFx1MkNBNlxcdTJDQThcXHUyQ0FBXFx1MkNBQ1xcdTJDQUVcXHUyQ0IwXFx1MkNCMlxcdTJDQjRcXHUyQ0I2XFx1MkNCOFxcdTJDQkFcXHUyQ0JDXFx1MkNCRVxcdTJDQzBcXHUyQ0MyXFx1MkNDNFxcdTJDQzZcXHUyQ0M4XFx1MkNDQVxcdTJDQ0NcXHUyQ0NFXFx1MkNEMFxcdTJDRDJcXHUyQ0Q0XFx1MkNENlxcdTJDRDhcXHUyQ0RBXFx1MkNEQ1xcdTJDREVcXHUyQ0UwXFx1MkNFMlxcdTJDRUJcXHUyQ0VEXFx1MkNGMlxcdUE2NDBcXHVBNjQyXFx1QTY0NFxcdUE2NDZcXHVBNjQ4XFx1QTY0QVxcdUE2NENcXHVBNjRFXFx1QTY1MFxcdUE2NTJcXHVBNjU0XFx1QTY1NlxcdUE2NThcXHVBNjVBXFx1QTY1Q1xcdUE2NUVcXHVBNjYwXFx1QTY2MlxcdUE2NjRcXHVBNjY2XFx1QTY2OFxcdUE2NkFcXHVBNjZDXFx1QTY4MFxcdUE2ODJcXHVBNjg0XFx1QTY4NlxcdUE2ODhcXHVBNjhBXFx1QTY4Q1xcdUE2OEVcXHVBNjkwXFx1QTY5MlxcdUE2OTRcXHVBNjk2XFx1QTY5OFxcdUE2OUFcXHVBNzIyXFx1QTcyNFxcdUE3MjZcXHVBNzI4XFx1QTcyQVxcdUE3MkNcXHVBNzJFXFx1QTczMlxcdUE3MzRcXHVBNzM2XFx1QTczOFxcdUE3M0FcXHVBNzNDXFx1QTczRVxcdUE3NDBcXHVBNzQyXFx1QTc0NFxcdUE3NDZcXHVBNzQ4XFx1QTc0QVxcdUE3NENcXHVBNzRFXFx1QTc1MFxcdUE3NTJcXHVBNzU0XFx1QTc1NlxcdUE3NThcXHVBNzVBXFx1QTc1Q1xcdUE3NUVcXHVBNzYwXFx1QTc2MlxcdUE3NjRcXHVBNzY2XFx1QTc2OFxcdUE3NkFcXHVBNzZDXFx1QTc2RVxcdUE3NzlcXHVBNzdCXFx1QTc3RFxcdUE3N0VcXHVBNzgwXFx1QTc4MlxcdUE3ODRcXHVBNzg2XFx1QTc4QlxcdUE3OERcXHVBNzkwXFx1QTc5MlxcdUE3OTZcXHVBNzk4XFx1QTc5QVxcdUE3OUNcXHVBNzlFXFx1QTdBMFxcdUE3QTJcXHVBN0E0XFx1QTdBNlxcdUE3QThcXHVBN0FBLVxcdUE3QUVcXHVBN0IwLVxcdUE3QjRcXHVBN0I2XFx1RkYyMS1cXHVGRjNBXXxcXHVEODAxW1xcdURDMDAtXFx1REMyN1xcdURDQjAtXFx1RENEM118XFx1RDgwM1tcXHVEQzgwLVxcdURDQjJdfFxcdUQ4MDZbXFx1RENBMC1cXHVEQ0JGXXxcXHVEODM1W1xcdURDMDAtXFx1REMxOVxcdURDMzQtXFx1REM0RFxcdURDNjgtXFx1REM4MVxcdURDOUNcXHVEQzlFXFx1REM5RlxcdURDQTJcXHVEQ0E1XFx1RENBNlxcdURDQTktXFx1RENBQ1xcdURDQUUtXFx1RENCNVxcdURDRDAtXFx1RENFOVxcdUREMDRcXHVERDA1XFx1REQwNy1cXHVERDBBXFx1REQwRC1cXHVERDE0XFx1REQxNi1cXHVERDFDXFx1REQzOFxcdUREMzlcXHVERDNCLVxcdUREM0VcXHVERDQwLVxcdURENDRcXHVERDQ2XFx1REQ0QS1cXHVERDUwXFx1REQ2Qy1cXHVERDg1XFx1RERBMC1cXHVEREI5XFx1RERENC1cXHVEREVEXFx1REUwOC1cXHVERTIxXFx1REUzQy1cXHVERTU1XFx1REU3MC1cXHVERTg5XFx1REVBOC1cXHVERUMwXFx1REVFMi1cXHVERUZBXFx1REYxQy1cXHVERjM0XFx1REY1Ni1cXHVERjZFXFx1REY5MC1cXHVERkE4XFx1REZDQV18XFx1RDgzQVtcXHVERDAwLVxcdUREMjFdLyxcbiAgTGw6IC9bYS16XFx4QjVcXHhERi1cXHhGNlxceEY4LVxceEZGXFx1MDEwMVxcdTAxMDNcXHUwMTA1XFx1MDEwN1xcdTAxMDlcXHUwMTBCXFx1MDEwRFxcdTAxMEZcXHUwMTExXFx1MDExM1xcdTAxMTVcXHUwMTE3XFx1MDExOVxcdTAxMUJcXHUwMTFEXFx1MDExRlxcdTAxMjFcXHUwMTIzXFx1MDEyNVxcdTAxMjdcXHUwMTI5XFx1MDEyQlxcdTAxMkRcXHUwMTJGXFx1MDEzMVxcdTAxMzNcXHUwMTM1XFx1MDEzN1xcdTAxMzhcXHUwMTNBXFx1MDEzQ1xcdTAxM0VcXHUwMTQwXFx1MDE0MlxcdTAxNDRcXHUwMTQ2XFx1MDE0OFxcdTAxNDlcXHUwMTRCXFx1MDE0RFxcdTAxNEZcXHUwMTUxXFx1MDE1M1xcdTAxNTVcXHUwMTU3XFx1MDE1OVxcdTAxNUJcXHUwMTVEXFx1MDE1RlxcdTAxNjFcXHUwMTYzXFx1MDE2NVxcdTAxNjdcXHUwMTY5XFx1MDE2QlxcdTAxNkRcXHUwMTZGXFx1MDE3MVxcdTAxNzNcXHUwMTc1XFx1MDE3N1xcdTAxN0FcXHUwMTdDXFx1MDE3RS1cXHUwMTgwXFx1MDE4M1xcdTAxODVcXHUwMTg4XFx1MDE4Q1xcdTAxOERcXHUwMTkyXFx1MDE5NVxcdTAxOTktXFx1MDE5QlxcdTAxOUVcXHUwMUExXFx1MDFBM1xcdTAxQTVcXHUwMUE4XFx1MDFBQVxcdTAxQUJcXHUwMUFEXFx1MDFCMFxcdTAxQjRcXHUwMUI2XFx1MDFCOVxcdTAxQkFcXHUwMUJELVxcdTAxQkZcXHUwMUM2XFx1MDFDOVxcdTAxQ0NcXHUwMUNFXFx1MDFEMFxcdTAxRDJcXHUwMUQ0XFx1MDFENlxcdTAxRDhcXHUwMURBXFx1MDFEQ1xcdTAxRERcXHUwMURGXFx1MDFFMVxcdTAxRTNcXHUwMUU1XFx1MDFFN1xcdTAxRTlcXHUwMUVCXFx1MDFFRFxcdTAxRUZcXHUwMUYwXFx1MDFGM1xcdTAxRjVcXHUwMUY5XFx1MDFGQlxcdTAxRkRcXHUwMUZGXFx1MDIwMVxcdTAyMDNcXHUwMjA1XFx1MDIwN1xcdTAyMDlcXHUwMjBCXFx1MDIwRFxcdTAyMEZcXHUwMjExXFx1MDIxM1xcdTAyMTVcXHUwMjE3XFx1MDIxOVxcdTAyMUJcXHUwMjFEXFx1MDIxRlxcdTAyMjFcXHUwMjIzXFx1MDIyNVxcdTAyMjdcXHUwMjI5XFx1MDIyQlxcdTAyMkRcXHUwMjJGXFx1MDIzMVxcdTAyMzMtXFx1MDIzOVxcdTAyM0NcXHUwMjNGXFx1MDI0MFxcdTAyNDJcXHUwMjQ3XFx1MDI0OVxcdTAyNEJcXHUwMjREXFx1MDI0Ri1cXHUwMjkzXFx1MDI5NS1cXHUwMkFGXFx1MDM3MVxcdTAzNzNcXHUwMzc3XFx1MDM3Qi1cXHUwMzdEXFx1MDM5MFxcdTAzQUMtXFx1MDNDRVxcdTAzRDBcXHUwM0QxXFx1MDNENS1cXHUwM0Q3XFx1MDNEOVxcdTAzREJcXHUwM0REXFx1MDNERlxcdTAzRTFcXHUwM0UzXFx1MDNFNVxcdTAzRTdcXHUwM0U5XFx1MDNFQlxcdTAzRURcXHUwM0VGLVxcdTAzRjNcXHUwM0Y1XFx1MDNGOFxcdTAzRkJcXHUwM0ZDXFx1MDQzMC1cXHUwNDVGXFx1MDQ2MVxcdTA0NjNcXHUwNDY1XFx1MDQ2N1xcdTA0NjlcXHUwNDZCXFx1MDQ2RFxcdTA0NkZcXHUwNDcxXFx1MDQ3M1xcdTA0NzVcXHUwNDc3XFx1MDQ3OVxcdTA0N0JcXHUwNDdEXFx1MDQ3RlxcdTA0ODFcXHUwNDhCXFx1MDQ4RFxcdTA0OEZcXHUwNDkxXFx1MDQ5M1xcdTA0OTVcXHUwNDk3XFx1MDQ5OVxcdTA0OUJcXHUwNDlEXFx1MDQ5RlxcdTA0QTFcXHUwNEEzXFx1MDRBNVxcdTA0QTdcXHUwNEE5XFx1MDRBQlxcdTA0QURcXHUwNEFGXFx1MDRCMVxcdTA0QjNcXHUwNEI1XFx1MDRCN1xcdTA0QjlcXHUwNEJCXFx1MDRCRFxcdTA0QkZcXHUwNEMyXFx1MDRDNFxcdTA0QzZcXHUwNEM4XFx1MDRDQVxcdTA0Q0NcXHUwNENFXFx1MDRDRlxcdTA0RDFcXHUwNEQzXFx1MDRENVxcdTA0RDdcXHUwNEQ5XFx1MDREQlxcdTA0RERcXHUwNERGXFx1MDRFMVxcdTA0RTNcXHUwNEU1XFx1MDRFN1xcdTA0RTlcXHUwNEVCXFx1MDRFRFxcdTA0RUZcXHUwNEYxXFx1MDRGM1xcdTA0RjVcXHUwNEY3XFx1MDRGOVxcdTA0RkJcXHUwNEZEXFx1MDRGRlxcdTA1MDFcXHUwNTAzXFx1MDUwNVxcdTA1MDdcXHUwNTA5XFx1MDUwQlxcdTA1MERcXHUwNTBGXFx1MDUxMVxcdTA1MTNcXHUwNTE1XFx1MDUxN1xcdTA1MTlcXHUwNTFCXFx1MDUxRFxcdTA1MUZcXHUwNTIxXFx1MDUyM1xcdTA1MjVcXHUwNTI3XFx1MDUyOVxcdTA1MkJcXHUwNTJEXFx1MDUyRlxcdTA1NjEtXFx1MDU4N1xcdTEzRjgtXFx1MTNGRFxcdTFDODAtXFx1MUM4OFxcdTFEMDAtXFx1MUQyQlxcdTFENkItXFx1MUQ3N1xcdTFENzktXFx1MUQ5QVxcdTFFMDFcXHUxRTAzXFx1MUUwNVxcdTFFMDdcXHUxRTA5XFx1MUUwQlxcdTFFMERcXHUxRTBGXFx1MUUxMVxcdTFFMTNcXHUxRTE1XFx1MUUxN1xcdTFFMTlcXHUxRTFCXFx1MUUxRFxcdTFFMUZcXHUxRTIxXFx1MUUyM1xcdTFFMjVcXHUxRTI3XFx1MUUyOVxcdTFFMkJcXHUxRTJEXFx1MUUyRlxcdTFFMzFcXHUxRTMzXFx1MUUzNVxcdTFFMzdcXHUxRTM5XFx1MUUzQlxcdTFFM0RcXHUxRTNGXFx1MUU0MVxcdTFFNDNcXHUxRTQ1XFx1MUU0N1xcdTFFNDlcXHUxRTRCXFx1MUU0RFxcdTFFNEZcXHUxRTUxXFx1MUU1M1xcdTFFNTVcXHUxRTU3XFx1MUU1OVxcdTFFNUJcXHUxRTVEXFx1MUU1RlxcdTFFNjFcXHUxRTYzXFx1MUU2NVxcdTFFNjdcXHUxRTY5XFx1MUU2QlxcdTFFNkRcXHUxRTZGXFx1MUU3MVxcdTFFNzNcXHUxRTc1XFx1MUU3N1xcdTFFNzlcXHUxRTdCXFx1MUU3RFxcdTFFN0ZcXHUxRTgxXFx1MUU4M1xcdTFFODVcXHUxRTg3XFx1MUU4OVxcdTFFOEJcXHUxRThEXFx1MUU4RlxcdTFFOTFcXHUxRTkzXFx1MUU5NS1cXHUxRTlEXFx1MUU5RlxcdTFFQTFcXHUxRUEzXFx1MUVBNVxcdTFFQTdcXHUxRUE5XFx1MUVBQlxcdTFFQURcXHUxRUFGXFx1MUVCMVxcdTFFQjNcXHUxRUI1XFx1MUVCN1xcdTFFQjlcXHUxRUJCXFx1MUVCRFxcdTFFQkZcXHUxRUMxXFx1MUVDM1xcdTFFQzVcXHUxRUM3XFx1MUVDOVxcdTFFQ0JcXHUxRUNEXFx1MUVDRlxcdTFFRDFcXHUxRUQzXFx1MUVENVxcdTFFRDdcXHUxRUQ5XFx1MUVEQlxcdTFFRERcXHUxRURGXFx1MUVFMVxcdTFFRTNcXHUxRUU1XFx1MUVFN1xcdTFFRTlcXHUxRUVCXFx1MUVFRFxcdTFFRUZcXHUxRUYxXFx1MUVGM1xcdTFFRjVcXHUxRUY3XFx1MUVGOVxcdTFFRkJcXHUxRUZEXFx1MUVGRi1cXHUxRjA3XFx1MUYxMC1cXHUxRjE1XFx1MUYyMC1cXHUxRjI3XFx1MUYzMC1cXHUxRjM3XFx1MUY0MC1cXHUxRjQ1XFx1MUY1MC1cXHUxRjU3XFx1MUY2MC1cXHUxRjY3XFx1MUY3MC1cXHUxRjdEXFx1MUY4MC1cXHUxRjg3XFx1MUY5MC1cXHUxRjk3XFx1MUZBMC1cXHUxRkE3XFx1MUZCMC1cXHUxRkI0XFx1MUZCNlxcdTFGQjdcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNlxcdTFGQzdcXHUxRkQwLVxcdTFGRDNcXHUxRkQ2XFx1MUZEN1xcdTFGRTAtXFx1MUZFN1xcdTFGRjItXFx1MUZGNFxcdTFGRjZcXHUxRkY3XFx1MjEwQVxcdTIxMEVcXHUyMTBGXFx1MjExM1xcdTIxMkZcXHUyMTM0XFx1MjEzOVxcdTIxM0NcXHUyMTNEXFx1MjE0Ni1cXHUyMTQ5XFx1MjE0RVxcdTIxODRcXHUyQzMwLVxcdTJDNUVcXHUyQzYxXFx1MkM2NVxcdTJDNjZcXHUyQzY4XFx1MkM2QVxcdTJDNkNcXHUyQzcxXFx1MkM3M1xcdTJDNzRcXHUyQzc2LVxcdTJDN0JcXHUyQzgxXFx1MkM4M1xcdTJDODVcXHUyQzg3XFx1MkM4OVxcdTJDOEJcXHUyQzhEXFx1MkM4RlxcdTJDOTFcXHUyQzkzXFx1MkM5NVxcdTJDOTdcXHUyQzk5XFx1MkM5QlxcdTJDOURcXHUyQzlGXFx1MkNBMVxcdTJDQTNcXHUyQ0E1XFx1MkNBN1xcdTJDQTlcXHUyQ0FCXFx1MkNBRFxcdTJDQUZcXHUyQ0IxXFx1MkNCM1xcdTJDQjVcXHUyQ0I3XFx1MkNCOVxcdTJDQkJcXHUyQ0JEXFx1MkNCRlxcdTJDQzFcXHUyQ0MzXFx1MkNDNVxcdTJDQzdcXHUyQ0M5XFx1MkNDQlxcdTJDQ0RcXHUyQ0NGXFx1MkNEMVxcdTJDRDNcXHUyQ0Q1XFx1MkNEN1xcdTJDRDlcXHUyQ0RCXFx1MkNERFxcdTJDREZcXHUyQ0UxXFx1MkNFM1xcdTJDRTRcXHUyQ0VDXFx1MkNFRVxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdUE2NDFcXHVBNjQzXFx1QTY0NVxcdUE2NDdcXHVBNjQ5XFx1QTY0QlxcdUE2NERcXHVBNjRGXFx1QTY1MVxcdUE2NTNcXHVBNjU1XFx1QTY1N1xcdUE2NTlcXHVBNjVCXFx1QTY1RFxcdUE2NUZcXHVBNjYxXFx1QTY2M1xcdUE2NjVcXHVBNjY3XFx1QTY2OVxcdUE2NkJcXHVBNjZEXFx1QTY4MVxcdUE2ODNcXHVBNjg1XFx1QTY4N1xcdUE2ODlcXHVBNjhCXFx1QTY4RFxcdUE2OEZcXHVBNjkxXFx1QTY5M1xcdUE2OTVcXHVBNjk3XFx1QTY5OVxcdUE2OUJcXHVBNzIzXFx1QTcyNVxcdUE3MjdcXHVBNzI5XFx1QTcyQlxcdUE3MkRcXHVBNzJGLVxcdUE3MzFcXHVBNzMzXFx1QTczNVxcdUE3MzdcXHVBNzM5XFx1QTczQlxcdUE3M0RcXHVBNzNGXFx1QTc0MVxcdUE3NDNcXHVBNzQ1XFx1QTc0N1xcdUE3NDlcXHVBNzRCXFx1QTc0RFxcdUE3NEZcXHVBNzUxXFx1QTc1M1xcdUE3NTVcXHVBNzU3XFx1QTc1OVxcdUE3NUJcXHVBNzVEXFx1QTc1RlxcdUE3NjFcXHVBNzYzXFx1QTc2NVxcdUE3NjdcXHVBNzY5XFx1QTc2QlxcdUE3NkRcXHVBNzZGXFx1QTc3MS1cXHVBNzc4XFx1QTc3QVxcdUE3N0NcXHVBNzdGXFx1QTc4MVxcdUE3ODNcXHVBNzg1XFx1QTc4N1xcdUE3OENcXHVBNzhFXFx1QTc5MVxcdUE3OTMtXFx1QTc5NVxcdUE3OTdcXHVBNzk5XFx1QTc5QlxcdUE3OURcXHVBNzlGXFx1QTdBMVxcdUE3QTNcXHVBN0E1XFx1QTdBN1xcdUE3QTlcXHVBN0I1XFx1QTdCN1xcdUE3RkFcXHVBQjMwLVxcdUFCNUFcXHVBQjYwLVxcdUFCNjVcXHVBQjcwLVxcdUFCQkZcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGRjQxLVxcdUZGNUFdfFxcdUQ4MDFbXFx1REMyOC1cXHVEQzRGXFx1RENEOC1cXHVEQ0ZCXXxcXHVEODAzW1xcdURDQzAtXFx1RENGMl18XFx1RDgwNltcXHVEQ0MwLVxcdURDREZdfFxcdUQ4MzVbXFx1REMxQS1cXHVEQzMzXFx1REM0RS1cXHVEQzU0XFx1REM1Ni1cXHVEQzY3XFx1REM4Mi1cXHVEQzlCXFx1RENCNi1cXHVEQ0I5XFx1RENCQlxcdURDQkQtXFx1RENDM1xcdURDQzUtXFx1RENDRlxcdURDRUEtXFx1REQwM1xcdUREMUUtXFx1REQzN1xcdURENTItXFx1REQ2QlxcdUREODYtXFx1REQ5RlxcdUREQkEtXFx1REREM1xcdURERUUtXFx1REUwN1xcdURFMjItXFx1REUzQlxcdURFNTYtXFx1REU2RlxcdURFOEEtXFx1REVBNVxcdURFQzItXFx1REVEQVxcdURFREMtXFx1REVFMVxcdURFRkMtXFx1REYxNFxcdURGMTYtXFx1REYxQlxcdURGMzYtXFx1REY0RVxcdURGNTAtXFx1REY1NVxcdURGNzAtXFx1REY4OFxcdURGOEEtXFx1REY4RlxcdURGQUEtXFx1REZDMlxcdURGQzQtXFx1REZDOVxcdURGQ0JdfFxcdUQ4M0FbXFx1REQyMi1cXHVERDQzXS8sXG4gIEx0OiAvW1xcdTAxQzVcXHUwMUM4XFx1MDFDQlxcdTAxRjJcXHUxRjg4LVxcdTFGOEZcXHUxRjk4LVxcdTFGOUZcXHUxRkE4LVxcdTFGQUZcXHUxRkJDXFx1MUZDQ1xcdTFGRkNdLyxcbiAgTG06IC9bXFx1MDJCMC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzc0XFx1MDM3QVxcdTA1NTlcXHUwNjQwXFx1MDZFNVxcdTA2RTZcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwOTcxXFx1MEU0NlxcdTBFQzZcXHUxMEZDXFx1MTdEN1xcdTE4NDNcXHUxQUE3XFx1MUM3OC1cXHUxQzdEXFx1MUQyQy1cXHUxRDZBXFx1MUQ3OFxcdTFEOUItXFx1MURCRlxcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MkM3Q1xcdTJDN0RcXHUyRDZGXFx1MkUyRlxcdTMwMDVcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzA5RFxcdTMwOUVcXHUzMEZDLVxcdTMwRkVcXHVBMDE1XFx1QTRGOC1cXHVBNEZEXFx1QTYwQ1xcdUE2N0ZcXHVBNjlDXFx1QTY5RFxcdUE3MTctXFx1QTcxRlxcdUE3NzBcXHVBNzg4XFx1QTdGOFxcdUE3RjlcXHVBOUNGXFx1QTlFNlxcdUFBNzBcXHVBQUREXFx1QUFGM1xcdUFBRjRcXHVBQjVDLVxcdUFCNUZcXHVGRjcwXFx1RkY5RVxcdUZGOUZdfFxcdUQ4MUFbXFx1REY0MC1cXHVERjQzXXxcXHVEODFCW1xcdURGOTMtXFx1REY5RlxcdURGRTBdLyxcbiAgTG86IC9bXFx4QUFcXHhCQVxcdTAxQkJcXHUwMUMwLVxcdTAxQzNcXHUwMjk0XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjNGXFx1MDY0MS1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFRVxcdTA2RUZcXHUwNkZBLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0NBLVxcdTA3RUFcXHUwODAwLVxcdTA4MTVcXHUwODQwLVxcdTA4NThcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QkRcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NzItXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUYwXFx1MDlGMVxcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI3MVxcdTBCODNcXHUwQjg1LVxcdTBCOEFcXHUwQjhFLVxcdTBCOTBcXHUwQjkyLVxcdTBCOTVcXHUwQjk5XFx1MEI5QVxcdTBCOUNcXHUwQjlFXFx1MEI5RlxcdTBCQTNcXHUwQkE0XFx1MEJBOC1cXHUwQkFBXFx1MEJBRS1cXHUwQkI5XFx1MEJEMFxcdTBDMDUtXFx1MEMwQ1xcdTBDMEUtXFx1MEMxMFxcdTBDMTItXFx1MEMyOFxcdTBDMkEtXFx1MEMzOVxcdTBDM0RcXHUwQzU4LVxcdTBDNUFcXHUwQzYwXFx1MEM2MVxcdTBDODBcXHUwQzg1LVxcdTBDOENcXHUwQzhFLVxcdTBDOTBcXHUwQzkyLVxcdTBDQThcXHUwQ0FBLVxcdTBDQjNcXHUwQ0I1LVxcdTBDQjlcXHUwQ0JEXFx1MENERVxcdTBDRTBcXHUwQ0UxXFx1MENGMVxcdTBDRjJcXHUwRDA1LVxcdTBEMENcXHUwRDBFLVxcdTBEMTBcXHUwRDEyLVxcdTBEM0FcXHUwRDNEXFx1MEQ0RVxcdTBENTQtXFx1MEQ1NlxcdTBENUYtXFx1MEQ2MVxcdTBEN0EtXFx1MEQ3RlxcdTBEODUtXFx1MEQ5NlxcdTBEOUEtXFx1MERCMVxcdTBEQjMtXFx1MERCQlxcdTBEQkRcXHUwREMwLVxcdTBEQzZcXHUwRTAxLVxcdTBFMzBcXHUwRTMyXFx1MEUzM1xcdTBFNDAtXFx1MEU0NVxcdTBFODFcXHUwRTgyXFx1MEU4NFxcdTBFODdcXHUwRTg4XFx1MEU4QVxcdTBFOERcXHUwRTk0LVxcdTBFOTdcXHUwRTk5LVxcdTBFOUZcXHUwRUExLVxcdTBFQTNcXHUwRUE1XFx1MEVBN1xcdTBFQUFcXHUwRUFCXFx1MEVBRC1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBEMC1cXHUxMEZBXFx1MTBGRC1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzgwLVxcdTEzOEZcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkYxLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0RDXFx1MTgyMC1cXHUxODQyXFx1MTg0NC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFCMDUtXFx1MUIzM1xcdTFCNDUtXFx1MUI0QlxcdTFCODMtXFx1MUJBMFxcdTFCQUVcXHUxQkFGXFx1MUJCQS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0RC1cXHUxQzRGXFx1MUM1QS1cXHUxQzc3XFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YxXFx1MUNGNVxcdTFDRjZcXHUyMTM1LVxcdTIxMzhcXHUyRDMwLVxcdTJENjdcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUzMDA2XFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZGXFx1MzEwNS1cXHUzMTJEXFx1MzEzMS1cXHUzMThFXFx1MzFBMC1cXHUzMUJBXFx1MzFGMC1cXHUzMUZGXFx1MzQwMC1cXHU0REI1XFx1NEUwMC1cXHU5RkQ1XFx1QTAwMC1cXHVBMDE0XFx1QTAxNi1cXHVBNDhDXFx1QTREMC1cXHVBNEY3XFx1QTUwMC1cXHVBNjBCXFx1QTYxMC1cXHVBNjFGXFx1QTYyQVxcdUE2MkJcXHVBNjZFXFx1QTZBMC1cXHVBNkU1XFx1QTc4RlxcdUE3RjdcXHVBN0ZCLVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE5MEEtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5RTAtXFx1QTlFNFxcdUE5RTctXFx1QTlFRlxcdUE5RkEtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNjAtXFx1QUE2RlxcdUFBNzEtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREJcXHVBQURDXFx1QUFFMC1cXHVBQUVBXFx1QUFGMlxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCQzAtXFx1QUJFMlxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGNjYtXFx1RkY2RlxcdUZGNzEtXFx1RkY5RFxcdUZGQTAtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURGMDAtXFx1REYxRlxcdURGMzAtXFx1REY0MFxcdURGNDItXFx1REY0OVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRl18XFx1RDgwMVtcXHVEQzUwLVxcdURDOURcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNjAtXFx1REM3NlxcdURDODAtXFx1REM5RVxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1REQwMC1cXHVERDE1XFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCRVxcdUREQkZcXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTMzXFx1REU2MC1cXHVERTdDXFx1REU4MC1cXHVERTlDXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY2MC1cXHVERjcyXFx1REY4MC1cXHVERjkxXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OF18XFx1RDgwNFtcXHVEQzAzLVxcdURDMzdcXHVEQzgzLVxcdURDQUZcXHVEQ0QwLVxcdURDRThcXHVERDAzLVxcdUREMjZcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREQVxcdURERENcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTgwLVxcdURFQUFcXHVERjAwLVxcdURGMTldfFxcdUQ4MDZbXFx1RENGRlxcdURFQzAtXFx1REVGOF18XFx1RDgwN1tcXHVEQzAwLVxcdURDMDhcXHVEQzBBLVxcdURDMkVcXHVEQzQwXFx1REM3Mi1cXHVEQzhGXXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REYwMC1cXHVERjQ0XFx1REY1MF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRdfFxcdUQ4M0JbXFx1REUwMC1cXHVERTAzXFx1REUwNS1cXHVERTFGXFx1REUyMVxcdURFMjJcXHVERTI0XFx1REUyN1xcdURFMjktXFx1REUzMlxcdURFMzQtXFx1REUzN1xcdURFMzlcXHVERTNCXFx1REU0MlxcdURFNDdcXHVERTQ5XFx1REU0QlxcdURFNEQtXFx1REU0RlxcdURFNTFcXHVERTUyXFx1REU1NFxcdURFNTdcXHVERTU5XFx1REU1QlxcdURFNURcXHVERTVGXFx1REU2MVxcdURFNjJcXHVERTY0XFx1REU2Ny1cXHVERTZBXFx1REU2Qy1cXHVERTcyXFx1REU3NC1cXHVERTc3XFx1REU3OS1cXHVERTdDXFx1REU3RVxcdURFODAtXFx1REU4OVxcdURFOEItXFx1REU5QlxcdURFQTEtXFx1REVBM1xcdURFQTUtXFx1REVBOVxcdURFQUItXFx1REVCQl18XFx1RDg2OVtcXHVEQzAwLVxcdURFRDZcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFdfFxcdUQ4N0VbXFx1REMwMC1cXHVERTFEXS8sXG5cbiAgLy8gTnVtYmVyc1xuICBObDogL1tcXHUxNkVFLVxcdTE2RjBcXHUyMTYwLVxcdTIxODJcXHUyMTg1LVxcdTIxODhcXHUzMDA3XFx1MzAyMS1cXHUzMDI5XFx1MzAzOC1cXHUzMDNBXFx1QTZFNi1cXHVBNkVGXXxcXHVEODAwW1xcdURENDAtXFx1REQ3NFxcdURGNDFcXHVERjRBXFx1REZEMS1cXHVERkQ1XXxcXHVEODA5W1xcdURDMDAtXFx1REM2RV0vLFxuICBOZDogL1swLTlcXHUwNjYwLVxcdTA2NjlcXHUwNkYwLVxcdTA2RjlcXHUwN0MwLVxcdTA3QzlcXHUwOTY2LVxcdTA5NkZcXHUwOUU2LVxcdTA5RUZcXHUwQTY2LVxcdTBBNkZcXHUwQUU2LVxcdTBBRUZcXHUwQjY2LVxcdTBCNkZcXHUwQkU2LVxcdTBCRUZcXHUwQzY2LVxcdTBDNkZcXHUwQ0U2LVxcdTBDRUZcXHUwRDY2LVxcdTBENkZcXHUwREU2LVxcdTBERUZcXHUwRTUwLVxcdTBFNTlcXHUwRUQwLVxcdTBFRDlcXHUwRjIwLVxcdTBGMjlcXHUxMDQwLVxcdTEwNDlcXHUxMDkwLVxcdTEwOTlcXHUxN0UwLVxcdTE3RTlcXHUxODEwLVxcdTE4MTlcXHUxOTQ2LVxcdTE5NEZcXHUxOUQwLVxcdTE5RDlcXHUxQTgwLVxcdTFBODlcXHUxQTkwLVxcdTFBOTlcXHUxQjUwLVxcdTFCNTlcXHUxQkIwLVxcdTFCQjlcXHUxQzQwLVxcdTFDNDlcXHUxQzUwLVxcdTFDNTlcXHVBNjIwLVxcdUE2MjlcXHVBOEQwLVxcdUE4RDlcXHVBOTAwLVxcdUE5MDlcXHVBOUQwLVxcdUE5RDlcXHVBOUYwLVxcdUE5RjlcXHVBQTUwLVxcdUFBNTlcXHVBQkYwLVxcdUFCRjlcXHVGRjEwLVxcdUZGMTldfFxcdUQ4MDFbXFx1RENBMC1cXHVEQ0E5XXxcXHVEODA0W1xcdURDNjYtXFx1REM2RlxcdURDRjAtXFx1RENGOVxcdUREMzYtXFx1REQzRlxcdURERDAtXFx1REREOVxcdURFRjAtXFx1REVGOV18W1xcdUQ4MDVcXHVEODA3XVtcXHVEQzUwLVxcdURDNTlcXHVEQ0QwLVxcdURDRDlcXHVERTUwLVxcdURFNTlcXHVERUMwLVxcdURFQzlcXHVERjMwLVxcdURGMzldfFxcdUQ4MDZbXFx1RENFMC1cXHVEQ0U5XXxcXHVEODFBW1xcdURFNjAtXFx1REU2OVxcdURGNTAtXFx1REY1OV18XFx1RDgzNVtcXHVERkNFLVxcdURGRkZdfFxcdUQ4M0FbXFx1REQ1MC1cXHVERDU5XS8sXG5cbiAgLy8gTWFya3NcbiAgTW46IC9bXFx1MDMwMC1cXHUwMzZGXFx1MDQ4My1cXHUwNDg3XFx1MDU5MS1cXHUwNUJEXFx1MDVCRlxcdTA1QzFcXHUwNUMyXFx1MDVDNFxcdTA1QzVcXHUwNUM3XFx1MDYxMC1cXHUwNjFBXFx1MDY0Qi1cXHUwNjVGXFx1MDY3MFxcdTA2RDYtXFx1MDZEQ1xcdTA2REYtXFx1MDZFNFxcdTA2RTdcXHUwNkU4XFx1MDZFQS1cXHUwNkVEXFx1MDcxMVxcdTA3MzAtXFx1MDc0QVxcdTA3QTYtXFx1MDdCMFxcdTA3RUItXFx1MDdGM1xcdTA4MTYtXFx1MDgxOVxcdTA4MUItXFx1MDgyM1xcdTA4MjUtXFx1MDgyN1xcdTA4MjktXFx1MDgyRFxcdTA4NTktXFx1MDg1QlxcdTA4RDQtXFx1MDhFMVxcdTA4RTMtXFx1MDkwMlxcdTA5M0FcXHUwOTNDXFx1MDk0MS1cXHUwOTQ4XFx1MDk0RFxcdTA5NTEtXFx1MDk1N1xcdTA5NjJcXHUwOTYzXFx1MDk4MVxcdTA5QkNcXHUwOUMxLVxcdTA5QzRcXHUwOUNEXFx1MDlFMlxcdTA5RTNcXHUwQTAxXFx1MEEwMlxcdTBBM0NcXHUwQTQxXFx1MEE0MlxcdTBBNDdcXHUwQTQ4XFx1MEE0Qi1cXHUwQTREXFx1MEE1MVxcdTBBNzBcXHUwQTcxXFx1MEE3NVxcdTBBODFcXHUwQTgyXFx1MEFCQ1xcdTBBQzEtXFx1MEFDNVxcdTBBQzdcXHUwQUM4XFx1MEFDRFxcdTBBRTJcXHUwQUUzXFx1MEIwMVxcdTBCM0NcXHUwQjNGXFx1MEI0MS1cXHUwQjQ0XFx1MEI0RFxcdTBCNTZcXHUwQjYyXFx1MEI2M1xcdTBCODJcXHUwQkMwXFx1MEJDRFxcdTBDMDBcXHUwQzNFLVxcdTBDNDBcXHUwQzQ2LVxcdTBDNDhcXHUwQzRBLVxcdTBDNERcXHUwQzU1XFx1MEM1NlxcdTBDNjJcXHUwQzYzXFx1MEM4MVxcdTBDQkNcXHUwQ0JGXFx1MENDNlxcdTBDQ0NcXHUwQ0NEXFx1MENFMlxcdTBDRTNcXHUwRDAxXFx1MEQ0MS1cXHUwRDQ0XFx1MEQ0RFxcdTBENjJcXHUwRDYzXFx1MERDQVxcdTBERDItXFx1MERENFxcdTBERDZcXHUwRTMxXFx1MEUzNC1cXHUwRTNBXFx1MEU0Ny1cXHUwRTRFXFx1MEVCMVxcdTBFQjQtXFx1MEVCOVxcdTBFQkJcXHUwRUJDXFx1MEVDOC1cXHUwRUNEXFx1MEYxOFxcdTBGMTlcXHUwRjM1XFx1MEYzN1xcdTBGMzlcXHUwRjcxLVxcdTBGN0VcXHUwRjgwLVxcdTBGODRcXHUwRjg2XFx1MEY4N1xcdTBGOEQtXFx1MEY5N1xcdTBGOTktXFx1MEZCQ1xcdTBGQzZcXHUxMDJELVxcdTEwMzBcXHUxMDMyLVxcdTEwMzdcXHUxMDM5XFx1MTAzQVxcdTEwM0RcXHUxMDNFXFx1MTA1OFxcdTEwNTlcXHUxMDVFLVxcdTEwNjBcXHUxMDcxLVxcdTEwNzRcXHUxMDgyXFx1MTA4NVxcdTEwODZcXHUxMDhEXFx1MTA5RFxcdTEzNUQtXFx1MTM1RlxcdTE3MTItXFx1MTcxNFxcdTE3MzItXFx1MTczNFxcdTE3NTJcXHUxNzUzXFx1MTc3MlxcdTE3NzNcXHUxN0I0XFx1MTdCNVxcdTE3QjctXFx1MTdCRFxcdTE3QzZcXHUxN0M5LVxcdTE3RDNcXHUxN0REXFx1MTgwQi1cXHUxODBEXFx1MTg4NVxcdTE4ODZcXHUxOEE5XFx1MTkyMC1cXHUxOTIyXFx1MTkyN1xcdTE5MjhcXHUxOTMyXFx1MTkzOS1cXHUxOTNCXFx1MUExN1xcdTFBMThcXHUxQTFCXFx1MUE1NlxcdTFBNTgtXFx1MUE1RVxcdTFBNjBcXHUxQTYyXFx1MUE2NS1cXHUxQTZDXFx1MUE3My1cXHUxQTdDXFx1MUE3RlxcdTFBQjAtXFx1MUFCRFxcdTFCMDAtXFx1MUIwM1xcdTFCMzRcXHUxQjM2LVxcdTFCM0FcXHUxQjNDXFx1MUI0MlxcdTFCNkItXFx1MUI3M1xcdTFCODBcXHUxQjgxXFx1MUJBMi1cXHUxQkE1XFx1MUJBOFxcdTFCQTlcXHUxQkFCLVxcdTFCQURcXHUxQkU2XFx1MUJFOFxcdTFCRTlcXHUxQkVEXFx1MUJFRi1cXHUxQkYxXFx1MUMyQy1cXHUxQzMzXFx1MUMzNlxcdTFDMzdcXHUxQ0QwLVxcdTFDRDJcXHUxQ0Q0LVxcdTFDRTBcXHUxQ0UyLVxcdTFDRThcXHUxQ0VEXFx1MUNGNFxcdTFDRjhcXHUxQ0Y5XFx1MURDMC1cXHUxREY1XFx1MURGQi1cXHUxREZGXFx1MjBEMC1cXHUyMERDXFx1MjBFMVxcdTIwRTUtXFx1MjBGMFxcdTJDRUYtXFx1MkNGMVxcdTJEN0ZcXHUyREUwLVxcdTJERkZcXHUzMDJBLVxcdTMwMkRcXHUzMDk5XFx1MzA5QVxcdUE2NkZcXHVBNjc0LVxcdUE2N0RcXHVBNjlFXFx1QTY5RlxcdUE2RjBcXHVBNkYxXFx1QTgwMlxcdUE4MDZcXHVBODBCXFx1QTgyNVxcdUE4MjZcXHVBOEM0XFx1QThDNVxcdUE4RTAtXFx1QThGMVxcdUE5MjYtXFx1QTkyRFxcdUE5NDctXFx1QTk1MVxcdUE5ODAtXFx1QTk4MlxcdUE5QjNcXHVBOUI2LVxcdUE5QjlcXHVBOUJDXFx1QTlFNVxcdUFBMjktXFx1QUEyRVxcdUFBMzFcXHVBQTMyXFx1QUEzNVxcdUFBMzZcXHVBQTQzXFx1QUE0Q1xcdUFBN0NcXHVBQUIwXFx1QUFCMi1cXHVBQUI0XFx1QUFCN1xcdUFBQjhcXHVBQUJFXFx1QUFCRlxcdUFBQzFcXHVBQUVDXFx1QUFFRFxcdUFBRjZcXHVBQkU1XFx1QUJFOFxcdUFCRURcXHVGQjFFXFx1RkUwMC1cXHVGRTBGXFx1RkUyMC1cXHVGRTJGXXxcXHVEODAwW1xcdURERkRcXHVERUUwXFx1REY3Ni1cXHVERjdBXXxcXHVEODAyW1xcdURFMDEtXFx1REUwM1xcdURFMDVcXHVERTA2XFx1REUwQy1cXHVERTBGXFx1REUzOC1cXHVERTNBXFx1REUzRlxcdURFRTVcXHVERUU2XXxcXHVEODA0W1xcdURDMDFcXHVEQzM4LVxcdURDNDZcXHVEQzdGLVxcdURDODFcXHVEQ0IzLVxcdURDQjZcXHVEQ0I5XFx1RENCQVxcdUREMDAtXFx1REQwMlxcdUREMjctXFx1REQyQlxcdUREMkQtXFx1REQzNFxcdURENzNcXHVERDgwXFx1REQ4MVxcdUREQjYtXFx1RERCRVxcdUREQ0EtXFx1RERDQ1xcdURFMkYtXFx1REUzMVxcdURFMzRcXHVERTM2XFx1REUzN1xcdURFM0VcXHVERURGXFx1REVFMy1cXHVERUVBXFx1REYwMFxcdURGMDFcXHVERjNDXFx1REY0MFxcdURGNjYtXFx1REY2Q1xcdURGNzAtXFx1REY3NF18XFx1RDgwNVtcXHVEQzM4LVxcdURDM0ZcXHVEQzQyLVxcdURDNDRcXHVEQzQ2XFx1RENCMy1cXHVEQ0I4XFx1RENCQVxcdURDQkZcXHVEQ0MwXFx1RENDMlxcdURDQzNcXHVEREIyLVxcdUREQjVcXHVEREJDXFx1RERCRFxcdUREQkZcXHVEREMwXFx1REREQ1xcdURERERcXHVERTMzLVxcdURFM0FcXHVERTNEXFx1REUzRlxcdURFNDBcXHVERUFCXFx1REVBRFxcdURFQjAtXFx1REVCNVxcdURFQjdcXHVERjFELVxcdURGMUZcXHVERjIyLVxcdURGMjVcXHVERjI3LVxcdURGMkJdfFxcdUQ4MDdbXFx1REMzMC1cXHVEQzM2XFx1REMzOC1cXHVEQzNEXFx1REMzRlxcdURDOTItXFx1RENBN1xcdURDQUEtXFx1RENCMFxcdURDQjJcXHVEQ0IzXFx1RENCNVxcdURDQjZdfFxcdUQ4MUFbXFx1REVGMC1cXHVERUY0XFx1REYzMC1cXHVERjM2XXxcXHVEODFCW1xcdURGOEYtXFx1REY5Ml18XFx1RDgyRltcXHVEQzlEXFx1REM5RV18XFx1RDgzNFtcXHVERDY3LVxcdURENjlcXHVERDdCLVxcdUREODJcXHVERDg1LVxcdUREOEJcXHVEREFBLVxcdUREQURcXHVERTQyLVxcdURFNDRdfFxcdUQ4MzZbXFx1REUwMC1cXHVERTM2XFx1REUzQi1cXHVERTZDXFx1REU3NVxcdURFODRcXHVERTlCLVxcdURFOUZcXHVERUExLVxcdURFQUZdfFxcdUQ4MzhbXFx1REMwMC1cXHVEQzA2XFx1REMwOC1cXHVEQzE4XFx1REMxQi1cXHVEQzIxXFx1REMyM1xcdURDMjRcXHVEQzI2LVxcdURDMkFdfFxcdUQ4M0FbXFx1RENEMC1cXHVEQ0Q2XFx1REQ0NC1cXHVERDRBXXxcXHVEQjQwW1xcdUREMDAtXFx1RERFRl0vLFxuICBNYzogL1tcXHUwOTAzLVxcdTA5MDNdfFtcXHUwOTNFLVxcdTA5NDBdfFtcXHUwOTQ5LVxcdTA5NENdfFtcXHUwOTgyLVxcdTA5ODNdfFtcXHUwOUJFLVxcdTA5QzBdfFtcXHUwOUM3LVxcdTA5QzhdfFtcXHUwOUNCLVxcdTA5Q0NdfFtcXHUwOUQ3LVxcdTA5RDddfFtcXHUwQTNFLVxcdTBBNDBdfFtcXHUwQTgzLVxcdTBBODNdfFtcXHUwQUJFLVxcdTBBQzBdfFtcXHUwQUM5LVxcdTBBQzldfFtcXHUwQUNCLVxcdTBBQ0NdfFtcXHUwQjAyLVxcdTBCMDNdfFtcXHUwQjNFLVxcdTBCM0VdfFtcXHUwQjQwLVxcdTBCNDBdfFtcXHUwQjQ3LVxcdTBCNDhdfFtcXHUwQjRCLVxcdTBCNENdfFtcXHUwQjU3LVxcdTBCNTddfFtcXHUwQjgzLVxcdTBCODNdfFtcXHUwQkJFLVxcdTBCQkZdfFtcXHUwQkMxLVxcdTBCQzJdfFtcXHUwQkM2LVxcdTBCQzhdfFtcXHUwQkNBLVxcdTBCQ0NdfFtcXHUwQkQ3LVxcdTBCRDddfFtcXHUwQzAxLVxcdTBDMDNdfFtcXHUwQzQxLVxcdTBDNDRdfFtcXHUwQzgyLVxcdTBDODNdfFtcXHUwQ0JFLVxcdTBDQkVdfFtcXHUwQ0MwLVxcdTBDQzRdfFtcXHUwQ0M3LVxcdTBDQzhdfFtcXHUwQ0NBLVxcdTBDQ0JdfFtcXHUwQ0Q1LVxcdTBDRDZdfFtcXHUwRDAyLVxcdTBEMDNdfFtcXHUwRDNFLVxcdTBENDBdfFtcXHUwRDQ2LVxcdTBENDhdfFtcXHUwRDRBLVxcdTBENENdfFtcXHUwRDU3LVxcdTBENTddfFtcXHUwRjNFLVxcdTBGM0ZdfFtcXHUwRjdGLVxcdTBGN0ZdLyxcblxuICAvLyBQdW5jdHVhdGlvbiwgQ29ubmVjdG9yXG4gIFBjOiAvW19cXHUyMDNGXFx1MjA0MFxcdTIwNTRcXHVGRTMzXFx1RkUzNFxcdUZFNEQtXFx1RkU0RlxcdUZGM0ZdLyxcblxuICAvLyBTZXBhcmF0b3IsIFNwYWNlXG4gIFpzOiAvWyBcXHhBMFxcdTE2ODBcXHUyMDAwLVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBdLyxcblxuICAvLyBUaGVzZSB0d28gYXJlIG5vdCByZWFsIFVuaWNvZGUgY2F0ZWdvcmllcywgYnV0IG91ciB1c2VmdWwgZm9yIE9obS5cbiAgLy8gTCBpcyBhIGNvbWJpbmF0aW9uIG9mIGFsbCB0aGUgbGV0dGVyIGNhdGVnb3JpZXMuXG4gIC8vIEx0bW8gaXMgYSBjb21iaW5hdGlvbiBvZiBMdCwgTG0sIGFuZCBMby5cbiAgTDogL1tBLVphLXpcXHhBQVxceEI1XFx4QkFcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MS1cXHUwNTg3XFx1MDVEMC1cXHUwNUVBXFx1MDVGMC1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA3RjRcXHUwN0Y1XFx1MDdGQVxcdTA4MDAtXFx1MDgxNVxcdTA4MUFcXHUwODI0XFx1MDgyOFxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA4QjYtXFx1MDhCRFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3MS1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4MFxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1NC1cXHUwRDU2XFx1MEQ1Ri1cXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ2XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRUM2XFx1MEVEQy1cXHUwRURGXFx1MEYwMFxcdTBGNDAtXFx1MEY0N1xcdTBGNDktXFx1MEY2Q1xcdTBGODgtXFx1MEY4Q1xcdTEwMDAtXFx1MTAyQVxcdTEwM0ZcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNVxcdTEzRjgtXFx1MTNGRFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RjEtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RDdcXHUxN0RDXFx1MTgyMC1cXHUxODc3XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NTAtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFBQTdcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjgzLVxcdTFCQTBcXHUxQkFFXFx1MUJBRlxcdTFCQkEtXFx1MUJFNVxcdTFDMDAtXFx1MUMyM1xcdTFDNEQtXFx1MUM0RlxcdTFDNUEtXFx1MUM3RFxcdTFDODAtXFx1MUM4OFxcdTFDRTktXFx1MUNFQ1xcdTFDRUUtXFx1MUNGMVxcdTFDRjVcXHUxQ0Y2XFx1MUQwMC1cXHUxREJGXFx1MUUwMC1cXHUxRjE1XFx1MUYxOC1cXHUxRjFEXFx1MUYyMC1cXHUxRjQ1XFx1MUY0OC1cXHUxRjREXFx1MUY1MC1cXHUxRjU3XFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1Ri1cXHUxRjdEXFx1MUY4MC1cXHUxRkI0XFx1MUZCNi1cXHUxRkJDXFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzYtXFx1MUZDQ1xcdTFGRDAtXFx1MUZEM1xcdTFGRDYtXFx1MUZEQlxcdTFGRTAtXFx1MUZFQ1xcdTFGRjItXFx1MUZGNFxcdTFGRjYtXFx1MUZGQ1xcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MjEwMlxcdTIxMDdcXHUyMTBBLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEyRi1cXHUyMTM5XFx1MjEzQy1cXHUyMTNGXFx1MjE0NS1cXHUyMTQ5XFx1MjE0RVxcdTIxODNcXHUyMTg0XFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyRDAwLVxcdTJEMjVcXHUyRDI3XFx1MkQyRFxcdTJEMzAtXFx1MkQ2N1xcdTJENkZcXHUyRDgwLVxcdTJEOTZcXHUyREEwLVxcdTJEQTZcXHUyREE4LVxcdTJEQUVcXHUyREIwLVxcdTJEQjZcXHUyREI4LVxcdTJEQkVcXHUyREMwLVxcdTJEQzZcXHUyREM4LVxcdTJEQ0VcXHUyREQwLVxcdTJERDZcXHUyREQ4LVxcdTJEREVcXHUyRTJGXFx1MzAwNVxcdTMwMDZcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUQtXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRFxcdTMxMzEtXFx1MzE4RVxcdTMxQTAtXFx1MzFCQVxcdTMxRjAtXFx1MzFGRlxcdTM0MDAtXFx1NERCNVxcdTRFMDAtXFx1OUZENVxcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYxRlxcdUE2MkFcXHVBNjJCXFx1QTY0MC1cXHVBNjZFXFx1QTY3Ri1cXHVBNjlEXFx1QTZBMC1cXHVBNkU1XFx1QTcxNy1cXHVBNzFGXFx1QTcyMi1cXHVBNzg4XFx1QTc4Qi1cXHVBN0FFXFx1QTdCMC1cXHVBN0I3XFx1QTdGNy1cXHVBODAxXFx1QTgwMy1cXHVBODA1XFx1QTgwNy1cXHVBODBBXFx1QTgwQy1cXHVBODIyXFx1QTg0MC1cXHVBODczXFx1QTg4Mi1cXHVBOEIzXFx1QThGMi1cXHVBOEY3XFx1QThGQlxcdUE4RkRcXHVBOTBBLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUNGXFx1QTlFMC1cXHVBOUU0XFx1QTlFNi1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQi1cXHVBQUREXFx1QUFFMC1cXHVBQUVBXFx1QUFGMi1cXHVBQUY0XFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUIzMC1cXHVBQjVBXFx1QUI1Qy1cXHVBQjY1XFx1QUI3MC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIwMC1cXHVGQjA2XFx1RkIxMy1cXHVGQjE3XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkYyMS1cXHVGRjNBXFx1RkY0MS1cXHVGRjVBXFx1RkY2Ni1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXXxcXHVEODAwW1xcdURDMDAtXFx1REMwQlxcdURDMEQtXFx1REMyNlxcdURDMjgtXFx1REMzQVxcdURDM0NcXHVEQzNEXFx1REMzRi1cXHVEQzREXFx1REM1MC1cXHVEQzVEXFx1REM4MC1cXHVEQ0ZBXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REYwMC1cXHVERjFGXFx1REYzMC1cXHVERjQwXFx1REY0Mi1cXHVERjQ5XFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXXxcXHVEODAxW1xcdURDMDAtXFx1REM5RFxcdURDQjAtXFx1RENEM1xcdURDRDgtXFx1RENGQlxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM2MC1cXHVEQzc2XFx1REM4MC1cXHVEQzlFXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVERDAwLVxcdUREMTVcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XFx1REM4MC1cXHVEQ0IyXFx1RENDMC1cXHVEQ0YyXXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdUREMDMtXFx1REQyNlxcdURENTAtXFx1REQ3MlxcdURENzZcXHVERDgzLVxcdUREQjJcXHVEREMxLVxcdUREQzRcXHVERERBXFx1REREQ1xcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REMwMC1cXHVEQzM0XFx1REM0Ny1cXHVEQzRBXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFODAtXFx1REVBQVxcdURGMDAtXFx1REYxOV18XFx1RDgwNltcXHVEQ0EwLVxcdURDREZcXHVEQ0ZGXFx1REVDMC1cXHVERUY4XXxcXHVEODA3W1xcdURDMDAtXFx1REMwOFxcdURDMEEtXFx1REMyRVxcdURDNDBcXHVEQzcyLVxcdURDOEZdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODFDLVxcdUQ4MjBcXHVEODQwLVxcdUQ4NjhcXHVEODZBLVxcdUQ4NkNcXHVEODZGLVxcdUQ4NzJdW1xcdURDMDAtXFx1REZGRl18XFx1RDgwRFtcXHVEQzAwLVxcdURDMkVdfFxcdUQ4MTFbXFx1REMwMC1cXHVERTQ2XXxcXHVEODFBW1xcdURDMDAtXFx1REUzOFxcdURFNDAtXFx1REU1RVxcdURFRDAtXFx1REVFRFxcdURGMDAtXFx1REYyRlxcdURGNDAtXFx1REY0M1xcdURGNjMtXFx1REY3N1xcdURGN0QtXFx1REY4Rl18XFx1RDgxQltcXHVERjAwLVxcdURGNDRcXHVERjUwXFx1REY5My1cXHVERjlGXFx1REZFMF18XFx1RDgyMVtcXHVEQzAwLVxcdURGRUNdfFxcdUQ4MjJbXFx1REMwMC1cXHVERUYyXXxcXHVEODJDW1xcdURDMDBcXHVEQzAxXXxcXHVEODJGW1xcdURDMDAtXFx1REM2QVxcdURDNzAtXFx1REM3Q1xcdURDODAtXFx1REM4OFxcdURDOTAtXFx1REM5OV18XFx1RDgzNVtcXHVEQzAwLVxcdURDNTRcXHVEQzU2LVxcdURDOUNcXHVEQzlFXFx1REM5RlxcdURDQTJcXHVEQ0E1XFx1RENBNlxcdURDQTktXFx1RENBQ1xcdURDQUUtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdUREMDVcXHVERDA3LVxcdUREMEFcXHVERDBELVxcdUREMTRcXHVERDE2LVxcdUREMUNcXHVERDFFLVxcdUREMzlcXHVERDNCLVxcdUREM0VcXHVERDQwLVxcdURENDRcXHVERDQ2XFx1REQ0QS1cXHVERDUwXFx1REQ1Mi1cXHVERUE1XFx1REVBOC1cXHVERUMwXFx1REVDMi1cXHVERURBXFx1REVEQy1cXHVERUZBXFx1REVGQy1cXHVERjE0XFx1REYxNi1cXHVERjM0XFx1REYzNi1cXHVERjRFXFx1REY1MC1cXHVERjZFXFx1REY3MC1cXHVERjg4XFx1REY4QS1cXHVERkE4XFx1REZBQS1cXHVERkMyXFx1REZDNC1cXHVERkNCXXxcXHVEODNBW1xcdURDMDAtXFx1RENDNFxcdUREMDAtXFx1REQ0M118XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXXxcXHVEODY5W1xcdURDMDAtXFx1REVENlxcdURGMDAtXFx1REZGRl18XFx1RDg2RFtcXHVEQzAwLVxcdURGMzRcXHVERjQwLVxcdURGRkZdfFxcdUQ4NkVbXFx1REMwMC1cXHVEQzFEXFx1REMyMC1cXHVERkZGXXxcXHVEODczW1xcdURDMDAtXFx1REVBMV18XFx1RDg3RVtcXHVEQzAwLVxcdURFMURdLyxcbiAgTHRtbzogL1tcXHUwMUM1XFx1MDFDOFxcdTAxQ0JcXHUwMUYyXFx1MUY4OC1cXHUxRjhGXFx1MUY5OC1cXHUxRjlGXFx1MUZBOC1cXHUxRkFGXFx1MUZCQ1xcdTFGQ0NcXHUxRkZDXXxbXFx1MDJCMC1cXHUwMkMxXFx1MDJDNi1cXHUwMkQxXFx1MDJFMC1cXHUwMkU0XFx1MDJFQ1xcdTAyRUVcXHUwMzc0XFx1MDM3QVxcdTA1NTlcXHUwNjQwXFx1MDZFNVxcdTA2RTZcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwOTcxXFx1MEU0NlxcdTBFQzZcXHUxMEZDXFx1MTdEN1xcdTE4NDNcXHUxQUE3XFx1MUM3OC1cXHUxQzdEXFx1MUQyQy1cXHUxRDZBXFx1MUQ3OFxcdTFEOUItXFx1MURCRlxcdTIwNzFcXHUyMDdGXFx1MjA5MC1cXHUyMDlDXFx1MkM3Q1xcdTJDN0RcXHUyRDZGXFx1MkUyRlxcdTMwMDVcXHUzMDMxLVxcdTMwMzVcXHUzMDNCXFx1MzA5RFxcdTMwOUVcXHUzMEZDLVxcdTMwRkVcXHVBMDE1XFx1QTRGOC1cXHVBNEZEXFx1QTYwQ1xcdUE2N0ZcXHVBNjlDXFx1QTY5RFxcdUE3MTctXFx1QTcxRlxcdUE3NzBcXHVBNzg4XFx1QTdGOFxcdUE3RjlcXHVBOUNGXFx1QTlFNlxcdUFBNzBcXHVBQUREXFx1QUFGM1xcdUFBRjRcXHVBQjVDLVxcdUFCNUZcXHVGRjcwXFx1RkY5RVxcdUZGOUZdfFxcdUQ4MUFbXFx1REY0MC1cXHVERjQzXXxcXHVEODFCW1xcdURGOTMtXFx1REY5RlxcdURGRTBdfFtcXHhBQVxceEJBXFx1MDFCQlxcdTAxQzAtXFx1MDFDM1xcdTAyOTRcXHUwNUQwLVxcdTA1RUFcXHUwNUYwLVxcdTA1RjJcXHUwNjIwLVxcdTA2M0ZcXHUwNjQxLVxcdTA2NEFcXHUwNjZFXFx1MDY2RlxcdTA2NzEtXFx1MDZEM1xcdTA2RDVcXHUwNkVFXFx1MDZFRlxcdTA2RkEtXFx1MDZGQ1xcdTA2RkZcXHUwNzEwXFx1MDcxMi1cXHUwNzJGXFx1MDc0RC1cXHUwN0E1XFx1MDdCMVxcdTA3Q0EtXFx1MDdFQVxcdTA4MDAtXFx1MDgxNVxcdTA4NDAtXFx1MDg1OFxcdTA4QTAtXFx1MDhCNFxcdTA4QjYtXFx1MDhCRFxcdTA5MDQtXFx1MDkzOVxcdTA5M0RcXHUwOTUwXFx1MDk1OC1cXHUwOTYxXFx1MDk3Mi1cXHUwOTgwXFx1MDk4NS1cXHUwOThDXFx1MDk4RlxcdTA5OTBcXHUwOTkzLVxcdTA5QThcXHUwOUFBLVxcdTA5QjBcXHUwOUIyXFx1MDlCNi1cXHUwOUI5XFx1MDlCRFxcdTA5Q0VcXHUwOURDXFx1MDlERFxcdTA5REYtXFx1MDlFMVxcdTA5RjBcXHUwOUYxXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjcxXFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM4MFxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0YxXFx1MENGMlxcdTBEMDUtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1NC1cXHUwRDU2XFx1MEQ1Ri1cXHUwRDYxXFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ1XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4N1xcdTBFODhcXHUwRThBXFx1MEU4RFxcdTBFOTQtXFx1MEU5N1xcdTBFOTktXFx1MEU5RlxcdTBFQTEtXFx1MEVBM1xcdTBFQTVcXHUwRUE3XFx1MEVBQVxcdTBFQUJcXHUwRUFELVxcdTBFQjBcXHUwRUIyXFx1MEVCM1xcdTBFQkRcXHUwRUMwLVxcdTBFQzRcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRlxcdTEwNTAtXFx1MTA1NVxcdTEwNUEtXFx1MTA1RFxcdTEwNjFcXHUxMDY1XFx1MTA2NlxcdTEwNkUtXFx1MTA3MFxcdTEwNzUtXFx1MTA4MVxcdTEwOEVcXHUxMEQwLVxcdTEwRkFcXHUxMEZELVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzODAtXFx1MTM4RlxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RjEtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RENcXHUxODIwLVxcdTE4NDJcXHUxODQ0LVxcdTE4NzdcXHUxODgwLVxcdTE4ODRcXHUxODg3LVxcdTE4QThcXHUxOEFBXFx1MThCMC1cXHUxOEY1XFx1MTkwMC1cXHUxOTFFXFx1MTk1MC1cXHUxOTZEXFx1MTk3MC1cXHUxOTc0XFx1MTk4MC1cXHUxOUFCXFx1MTlCMC1cXHUxOUM5XFx1MUEwMC1cXHUxQTE2XFx1MUEyMC1cXHUxQTU0XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI4My1cXHUxQkEwXFx1MUJBRVxcdTFCQUZcXHUxQkJBLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzRELVxcdTFDNEZcXHUxQzVBLVxcdTFDNzdcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjFcXHUxQ0Y1XFx1MUNGNlxcdTIxMzUtXFx1MjEzOFxcdTJEMzAtXFx1MkQ2N1xcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTMwMDZcXHUzMDNDXFx1MzA0MS1cXHUzMDk2XFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkZcXHUzMTA1LVxcdTMxMkRcXHUzMTMxLVxcdTMxOEVcXHUzMUEwLVxcdTMxQkFcXHUzMUYwLVxcdTMxRkZcXHUzNDAwLVxcdTREQjVcXHU0RTAwLVxcdTlGRDVcXHVBMDAwLVxcdUEwMTRcXHVBMDE2LVxcdUE0OENcXHVBNEQwLVxcdUE0RjdcXHVBNTAwLVxcdUE2MEJcXHVBNjEwLVxcdUE2MUZcXHVBNjJBXFx1QTYyQlxcdUE2NkVcXHVBNkEwLVxcdUE2RTVcXHVBNzhGXFx1QTdGN1xcdUE3RkItXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QTkwQS1cXHVBOTI1XFx1QTkzMC1cXHVBOTQ2XFx1QTk2MC1cXHVBOTdDXFx1QTk4NC1cXHVBOUIyXFx1QTlFMC1cXHVBOUU0XFx1QTlFNy1cXHVBOUVGXFx1QTlGQS1cXHVBOUZFXFx1QUEwMC1cXHVBQTI4XFx1QUE0MC1cXHVBQTQyXFx1QUE0NC1cXHVBQTRCXFx1QUE2MC1cXHVBQTZGXFx1QUE3MS1cXHVBQTc2XFx1QUE3QVxcdUFBN0UtXFx1QUFBRlxcdUFBQjFcXHVBQUI1XFx1QUFCNlxcdUFBQjktXFx1QUFCRFxcdUFBQzBcXHVBQUMyXFx1QUFEQlxcdUFBRENcXHVBQUUwLVxcdUFBRUFcXHVBQUYyXFx1QUIwMS1cXHVBQjA2XFx1QUIwOS1cXHVBQjBFXFx1QUIxMS1cXHVBQjE2XFx1QUIyMC1cXHVBQjI2XFx1QUIyOC1cXHVBQjJFXFx1QUJDMC1cXHVBQkUyXFx1QUMwMC1cXHVEN0EzXFx1RDdCMC1cXHVEN0M2XFx1RDdDQi1cXHVEN0ZCXFx1RjkwMC1cXHVGQTZEXFx1RkE3MC1cXHVGQUQ5XFx1RkIxRFxcdUZCMUYtXFx1RkIyOFxcdUZCMkEtXFx1RkIzNlxcdUZCMzgtXFx1RkIzQ1xcdUZCM0VcXHVGQjQwXFx1RkI0MVxcdUZCNDNcXHVGQjQ0XFx1RkI0Ni1cXHVGQkIxXFx1RkJEMy1cXHVGRDNEXFx1RkQ1MC1cXHVGRDhGXFx1RkQ5Mi1cXHVGREM3XFx1RkRGMC1cXHVGREZCXFx1RkU3MC1cXHVGRTc0XFx1RkU3Ni1cXHVGRUZDXFx1RkY2Ni1cXHVGRjZGXFx1RkY3MS1cXHVGRjlEXFx1RkZBMC1cXHVGRkJFXFx1RkZDMi1cXHVGRkM3XFx1RkZDQS1cXHVGRkNGXFx1RkZEMi1cXHVGRkQ3XFx1RkZEQS1cXHVGRkRDXXxcXHVEODAwW1xcdURDMDAtXFx1REMwQlxcdURDMEQtXFx1REMyNlxcdURDMjgtXFx1REMzQVxcdURDM0NcXHVEQzNEXFx1REMzRi1cXHVEQzREXFx1REM1MC1cXHVEQzVEXFx1REM4MC1cXHVEQ0ZBXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REYwMC1cXHVERjFGXFx1REYzMC1cXHVERjQwXFx1REY0Mi1cXHVERjQ5XFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXXxcXHVEODAxW1xcdURDNTAtXFx1REM5RFxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM2MC1cXHVEQzc2XFx1REM4MC1cXHVEQzlFXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVERDAwLVxcdUREMTVcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJFXFx1RERCRlxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzNcXHVERTYwLVxcdURFN0NcXHVERTgwLVxcdURFOUNcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNzJcXHVERjgwLVxcdURGOTFdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdUREMDMtXFx1REQyNlxcdURENTAtXFx1REQ3MlxcdURENzZcXHVERDgzLVxcdUREQjJcXHVEREMxLVxcdUREQzRcXHVERERBXFx1REREQ1xcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REMwMC1cXHVEQzM0XFx1REM0Ny1cXHVEQzRBXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFODAtXFx1REVBQVxcdURGMDAtXFx1REYxOV18XFx1RDgwNltcXHVEQ0ZGXFx1REVDMC1cXHVERUY4XXxcXHVEODA3W1xcdURDMDAtXFx1REMwOFxcdURDMEEtXFx1REMyRVxcdURDNDBcXHVEQzcyLVxcdURDOEZdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODFDLVxcdUQ4MjBcXHVEODQwLVxcdUQ4NjhcXHVEODZBLVxcdUQ4NkNcXHVEODZGLVxcdUQ4NzJdW1xcdURDMDAtXFx1REZGRl18XFx1RDgwRFtcXHVEQzAwLVxcdURDMkVdfFxcdUQ4MTFbXFx1REMwMC1cXHVERTQ2XXxcXHVEODFBW1xcdURDMDAtXFx1REUzOFxcdURFNDAtXFx1REU1RVxcdURFRDAtXFx1REVFRFxcdURGMDAtXFx1REYyRlxcdURGNjMtXFx1REY3N1xcdURGN0QtXFx1REY4Rl18XFx1RDgxQltcXHVERjAwLVxcdURGNDRcXHVERjUwXXxcXHVEODIxW1xcdURDMDAtXFx1REZFQ118XFx1RDgyMltcXHVEQzAwLVxcdURFRjJdfFxcdUQ4MkNbXFx1REMwMFxcdURDMDFdfFxcdUQ4MkZbXFx1REMwMC1cXHVEQzZBXFx1REM3MC1cXHVEQzdDXFx1REM4MC1cXHVEQzg4XFx1REM5MC1cXHVEQzk5XXxcXHVEODNBW1xcdURDMDAtXFx1RENDNF18XFx1RDgzQltcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXXxcXHVEODY5W1xcdURDMDAtXFx1REVENlxcdURGMDAtXFx1REZGRl18XFx1RDg2RFtcXHVEQzAwLVxcdURGMzRcXHVERjQwLVxcdURGRkZdfFxcdUQ4NkVbXFx1REMwMC1cXHVEQzFEXFx1REMyMC1cXHVERkZGXXxcXHVEODczW1xcdURDMDAtXFx1REVBMV18XFx1RDg3RVtcXHVEQzAwLVxcdURFMURdL1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=