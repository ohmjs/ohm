import {MatchResult, Grammar, Semantics} from 'ohm-js';

export = extras;

declare namespace extras {
  function toAST(matchResult: MatchResult, mapping?: {}): {};
  function semanticsForToAST(g: Grammar): Semantics;
}
