import type {Grammar, LineAndColumnInfo, MatchResult, Node, Semantics} from '../index.d.ts';

export function toAST(matchResult: MatchResult, mapping?: {}): {};
export function semanticsForToAST(g: Grammar): Semantics;

/**
 * Returns contextual information (line and column number, etc.) about a
 * specific character in a string.
 */
export function getLineAndColumn(str: string, offset: number): LineAndColumnInfo;

/**
 * Returns a nicely-formatted message (appropriate for syntax errors, etc.)
 * pointing to a specific character within a string. Optionally, one or more
 * ranges within the string can also be highlighted.
 */
export function getLineAndColumnMessage(
  str: string,
  offset: number,
  ...ranges: number[][]
): string;

interface Example {
  grammar: string;
  rule: string;
  example: string;
  shouldMatch: boolean;
}

/**
 * Given a string containing one or more grammar definitions, returns an array
 * of examples extracted from the comments.
 * Positive examples look like `//+ "one", "two"` and negative examples like
 * `//- "shouldn't match"`. The examples text is a JSON string.
 */
export function extractExamples(grammarsDef: string): [Example];

/*
  Given an array of nodes, return a new array where (a) all iter nodes are replaced by
  their children, and (b) nodes appear in the correct source order.
 */
export function recoverSourceOrder(nodes: Node[]): Node[];
