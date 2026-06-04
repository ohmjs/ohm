package ruleast

import (
	"github.com/ohmjs/goohm"
)

// Grammars
/* Grammar* */
// struct for rule Grammars
type Grammars struct {
	Grammar goohm.ListNode
}

// Grammar
/* ident SuperGrammar? "{" Rule* "}" */
// struct for rule Grammar
type Grammar struct {
	Ident        goohm.RuleNode
	SuperGrammar goohm.OptNode
	Term1        goohm.TerminalNode
	Rules        goohm.ListNode
	Term2        goohm.TerminalNode
}

// SuperGrammar
/* "<:" ident */
// struct for rule SuperGrammar
type SuperGrammar struct {
	Term1 goohm.TerminalNode
	Ident goohm.RuleNode
}

// Rule
/* cases: define, override, extend. */
// struct for rule Rule
type Rule struct {
	Arg1 goohm.Node
}

// RuleDefine
/* ident Formals? ruleDescr? "="  RuleBody */
// struct for rule RuleDefine
type RuleDefine struct {
	Ident     goohm.RuleNode
	Formals   goohm.OptNode
	RuleDescr goohm.OptNode
	Term1     goohm.TerminalNode
	RuleBody  goohm.RuleNode
}

// RuleOverride
/* ident Formals?            ":=" OverrideRuleBody */
// struct for rule RuleOverride
type RuleOverride struct {
	Ident    goohm.RuleNode
	Formals  goohm.OptNode
	Term1    goohm.TerminalNode
	RuleBody goohm.RuleNode
}

// RuleExtend
/* ident Formals?            "+=" RuleBody */
// struct for rule RuleExtend
type RuleExtend struct {
	Ident    goohm.RuleNode
	Formals  goohm.OptNode
	Term1    goohm.TerminalNode
	RuleBody goohm.RuleNode
}

// RuleBody
/*  */
// struct for rule RuleBody
type RuleBody struct {
	Arg1 goohm.OptNode
	Arg2 goohm.BHorNode
}

// TopLevelTerm
/* case: inline. Seq */
// struct for rule TopLevelTerm
type TopLevelTerm struct {
	Arg1 goohm.RuleNode
}

// TopLevelTermInline
/* Seq caseName */
// struct for rule TopLevelTermInline
type TopLevelTermInline struct {
	Seq      goohm.RuleNode
	CaseName goohm.RuleNode
}

// OverrideRuleBody
/*  */
// struct for rule OverrideRuleBody
type OverrideRuleBody struct {
	Arg1 goohm.OptNode
	Arg2 goohm.BHorNode
}

// OverrideTopLevelTerm
/*  */
// struct for rule OverrideTopLevelTerm
type OverrideTopLevelTerm struct {
	Arg1 goohm.RuleNode
}

// OverrideTopLevelTermSuperSplice
/*  */
// struct for rule OverrideTopLevelTermSuperSplice
type OverrideTopLevelTermSuperSplice struct {
	Term1 goohm.TerminalNode
}

// Formals
/*  */
// struct for rule Formals
type Formals struct {
	Arg1 goohm.TerminalNode
	Arg2 goohm.BHorNode
	Arg3 goohm.TerminalNode
}

// Params
/*  */
// struct for rule Params
type Params struct {
	Arg1 goohm.TerminalNode
	Arg2 goohm.BHorNode
	Arg3 goohm.TerminalNode
}

// Alt
/*  */
// struct for rule Alt
type Alt struct {
	Arg1 goohm.BHorNode
}

// Seq
/*  */
// struct for rule Seq
type Seq struct {
	Arg1 goohm.ListNode
}

// Iter
/*  */
// struct for rule Iter
type Iter struct {
	Arg1 goohm.RuleNode
}

// IterStar
/*  */
// struct for rule IterStar
type IterStar struct {
	Arg1  goohm.RuleNode
	Term1 goohm.TerminalNode
}

// IterPlus
/*  */
// struct for rule IterPlus
type IterPlus struct {
	Arg1  goohm.RuleNode
	Term1 goohm.TerminalNode
}

// IterOpt
/*  */
// struct for rule IterOpt
type IterOpt struct {
	Arg1  goohm.RuleNode
	Term1 goohm.TerminalNode
}

// Pred
/*  */
// struct for rule Pred
type Pred struct {
	Arg1 goohm.RuleNode
}

// PredNot
/*  */
// struct for rule PredNot
type PredNot struct {
	Term1 goohm.TerminalNode
	Arg1  goohm.RuleNode
}

// PredLookahead
/*  */
// struct for rule PredLookahead
type PredLookahead struct {
	Term1 goohm.TerminalNode
	Arg1  goohm.RuleNode
}

// Lex
/*  */
// struct for rule Lex
type Lex struct {
	Base goohm.RuleNode
}

// LexLex
/*  */
// struct for rule LexLex
type LexLex struct {
	Term1 goohm.TerminalNode
	Base  goohm.RuleNode
}

// Base
/*  */
// struct for rule Base
type Base struct {
	Arg1 goohm.RuleNode
}

// BaseApplication
/*  */
// struct for rule BaseApplication
type BaseApplication struct {
	Ident  goohm.RuleNode
	Params goohm.OptNode
}

// BaseRange
/*  */
// struct for rule BaseRange
type BaseRange struct {
	OneCharTerminal1 goohm.RuleNode
	Term1            goohm.TerminalNode
	OneCharTerminal2 goohm.RuleNode
}

// BaseTerminal
/*  */
// struct for rule BaseTerminal
type BaseTerminal struct {
	Terminal goohm.RuleNode
}

// BaseParen
/*  */
// struct for rule BaseParen
type BaseParen struct {
	Term1 goohm.TerminalNode
	Alt   goohm.RuleNode
	Term2 goohm.TerminalNode
}

// ruleDescr - a rule description
/*  */
// struct for rule LexRuleDescr
type LexRuleDescr struct {
	Arg1 goohm.TerminalNode
	Arg2 goohm.RuleNode
	Arg3 goohm.TerminalNode
}

// ruleDescrText
/*  */
// struct for rule LexRuleDescrText
type LexRuleDescrText struct {
	Arg1 goohm.ListNode
}

// caseName
/*  */
// struct for rule LexCaseName
type LexCaseName struct {
	Arg1 goohm.TerminalNode
	Arg2 goohm.ListNode
	Arg3 goohm.RuleNode
	Arg4 goohm.ListNode
	Arg5 goohm.TerminalNode
}

// name - a name
/*  */
// struct for rule LexName
type LexName struct {
	Arg1 goohm.RuleNode
	Arg2 goohm.ListNode
}

// nameFirst
/* "_"
   | letter */
// struct for rule LexNameFirst
type LexNameFirst struct {
	Arg1 goohm.Node
}

// nameRest
/*  */
// struct for rule LexNameRest
type LexNameRest struct {
	Arg1 goohm.Node
}

// ident - an identifier
/*  */
// struct for rule LexIdent
type LexIdent struct {
	Arg1 goohm.RuleNode
}

// terminal
/*  */
// struct for rule LexTerminal
type LexTerminal struct {
	Arg1 goohm.TerminalNode
	Arg2 goohm.ListNode
	Arg3 goohm.TerminalNode
}

// oneCharTerminal
/*  */
// struct for rule LexOneCharTerminal
type LexOneCharTerminal struct {
	Arg1 goohm.TerminalNode
	Arg2 goohm.RuleNode
	Arg3 goohm.TerminalNode
}

// terminalChar
/*  */
// struct for rule LexTerminalChar
type LexTerminalChar struct {
	Arg1 goohm.Node
}

// escapeChar - an escape sequence
/*  */
// struct for rule LexEscapeChar
type LexEscapeChar struct {
	Arg1 goohm.RuleNode
}

// escapeCharBackslash
/*  */
// struct for rule LexEscapeCharBackslash
type LexEscapeCharBackslash struct {
	Term1 goohm.TerminalNode
}

// escapeCharDoubleQuote
/*  */
// struct for rule LexEscapeCharDoubleQuote
type LexEscapeCharDoubleQuote struct {
	Term1 goohm.TerminalNode
}

// escapeCharSingleQuote
/*  */
// struct for rule LexEscapeCharSingleQuote
type LexEscapeCharSingleQuote struct {
	Term1 goohm.TerminalNode
}

// escapeCharBackspace
/*  */
// struct for rule LexEscapeCharBackspace
type LexEscapeCharBackspace struct {
	Term1 goohm.TerminalNode
}

// escapeCharLineFeed
/*  */
// struct for rule LexEscapeCharLineFeed
type LexEscapeCharLineFeed struct {
	Term1 goohm.TerminalNode
}

// escapeCharCarriageReturn
/*  */
// struct for rule LexEscapeCharCarriageReturn
type LexEscapeCharCarriageReturn struct {
	Term1 goohm.TerminalNode
}

// escapeCharTab
/*  */
// struct for rule LexEscapeCharTab
type LexEscapeCharTab struct {
	Term1 goohm.TerminalNode
}

// escapeCharUnicodeCodePoint
/*  */
// struct for rule LexEscapeCharUnicodeCodePoint
type LexEscapeCharUnicodeCodePoint struct {
	Term1     goohm.TerminalNode
	HexDigit1 goohm.RuleNode
	HexDigit2 goohm.OptNode
	HexDigit3 goohm.OptNode
	HexDigit4 goohm.OptNode
	HexDigit5 goohm.OptNode
	HexDigit6 goohm.OptNode
	Term2     goohm.TerminalNode
}

// escapeCharUnicodeEscape
/*  */
// struct for rule LexEscapeCharUnicodeEscape
type LexEscapeCharUnicodeEscape struct {
	Term1     goohm.TerminalNode
	HexDigit1 goohm.RuleNode
	HexDigit2 goohm.RuleNode
	HexDigit3 goohm.RuleNode
	HexDigit4 goohm.RuleNode
}

// escapeCharHexEscape
/*  */
// struct for rule LexEscapeCharHexEscape
type LexEscapeCharHexEscape struct {
	Term1     goohm.TerminalNode
	HexDigit1 goohm.RuleNode
	HexDigit2 goohm.RuleNode
}

// space
/*  */
// struct for rule LexSpace
type LexSpace struct {
	Arg1 goohm.RuleNode
}

// comment
/*  */
// struct for rule LexComment
type LexComment struct {
	Arg1 goohm.RuleNode
}

// commentSingleLine
/*  */
// struct for rule LexCommentSingleLine
type LexCommentSingleLine struct {
	Term1 goohm.TerminalNode
	Arg1  goohm.ListNode
	Arg2  goohm.RuleNode
}

// commentMultiLine
/*  */
// struct for rule LexCommentMultiLine
type LexCommentMultiLine struct {
	Term1 goohm.TerminalNode
	Arg1  goohm.ListNode
	Term2 goohm.TerminalNode
}

// tokens
/*  */
// struct for rule LexTokens
type LexTokens struct {
	Arg1 goohm.ListNode
}

// token
/*  */
// struct for rule LexToken
type LexToken struct {
	Arg1 goohm.RuleNode
}

// operator
/* "<:" | "=" | ":=" | "+=" | "*" | "+" | "?" | "~" | "&" */
// struct for rule LexOperator
type LexOperator struct {
	Arg1 goohm.Node
}

// punctuation
/* "<" | ">" | "," | "--" */
// struct for rule LexPunctuation
type LexPunctuation struct {
	Arg1 goohm.Node
}
