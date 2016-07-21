'use strict';

window.grammar = ohm.grammarsFromScriptElements().O;//Arithmetic;//.Logical_Semicolon;
window.semantics = grammar.semantics();
