'use strict';

window.grammar = ohm.grammarsFromScriptElements().Arithmetic;//.Logical_Semicolon;
window.semantics = grammar.semantics();
