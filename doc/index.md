# Ohm

[Ohm](https://gitlab.com/cdg/ohm) is a library and domain-specific language for parsing and pattern matching. You can use it to parse custom file formats, transform complex data structures, and quickly build parsers, interpreters, and compilers for programming languages. The _Ohm language_ is based on [parsing expression grammars](http://en.wikipedia.org/wiki/Parsing_expression_grammar) (PEGs), which are a formal way of describing syntax, similar to regular expressions and context-free grammars. The _Ohm library_ provides a JavaScript interface (known as Ohm/JS) for creating parsers and interpreters from the grammars you write.

Like its older sibling [OMeta](http://tinlizzie.org/ometa/), Ohm supports object-oriented grammar extension and allows pattern matching of arbitrary data structures (not just strings). One thing that distinguishes Ohm from other parsing tools is that it completely separates grammars from semantic actions. In Ohm, a grammar defines a language, and semantic actions specify what to do with valid inputs in that language. Semantic actions are written in the _host language_ -- e.g., for Ohm/JS, the host language is JavaScript. Ohm grammars, on the other hand, work without modification in any host language. This separation improves modularity, and makes both grammars and semantic actions easier to read and understand.

## About PEGs

Like a [context-free grammar](http://en.wikipedia.org/wiki/Context-free_grammar) (CFG), a PEG is a formal way to describe the syntax of a language. We use the term "language" loosely: formal grammars describe patterns, and anything that matches the pattern is said to be part of the _language_ described by that grammar. A PEG might describe a programming language, a file format, or something as simple as the set of valid North American phone numbers.

PEGs and CFGs share many concepts with regular expressions, but are generally more powerful and easier to understand. Compared to context-free grammars, the main advantage of PEGs is that they are never ambiguous, and as a result, a PEG maps directly to a top-down parser for the language it describes. For more on the history and theory of PEGs, see Bryan Ford's page on [Packrat Parsing and Parsing Expression Grammars](http://bford.info/packrat/).

## Ohm Language Syntax

To understand the visualizer, it helps to know the syntax Ohm uses for specifying grammars.

### Grammars and Rules

```
Arithmetic {
  Expr = "1 + 1"
}
```

This is a grammar named "Arithmetic", which has a single rule named "Expr". It says that a valid Arithmetic expression must consist of the string "1 + 1". The right hand side of _Expr_ is known as a "rule body". The rule body may also refer to other rules, as in this example:

```
Arithmetic {
  Expr = AddExpr
  AddExpr = "1 + 1"
}
```

This means that the rule "Expr" matches an AddExpr, which matches the string "1 + 1". This grammar will succeed in matching the exact same set of inputs as the previous grammar, but produce a different parse tree. Note that Ohm grammars do not specify which rule to begin parsing on (that's specified by the programmer when they use the grammar) but by convention, the first rule in the grammar is the starting rule.

### Parsing Expressions

A rule body must be a valid _parsing expression_. We've shown two of the simplest kinds of parsing expressions above: a string literal, and a rule application. Here is a full list of the different kinds of parsing expressions supported by Ohm:

#### String Literal

"hello there"

Matches exactly the characters contained inside the quotation marks.

#### Rule Application

_ruleName_

Matches the body of the rule named _ruleName_.

#### Anything

`_`

Matches a single character from the input stream.

#### Repetition operators

<code><i>expr</i> *</code>

Matches the expression `expr` repeated 0 or more times.

<code><i>expr</i> +</code>

Matches the expression `expr` repeated 1 or more times.

<code><i>expr</i> ?</code>

Matches the optional expression `expr`, succeeding whether it matches or not.

#### Sequence

<code><i>expr1</i> <i>expr2</i></code>

Matches the expression `expr1` followed by `expr2`.

#### Alternation

<code><i>expr1</i> | <i>expr2</i></code>

Matches the expression `expr1`, and if that does not succeed, matches the expression `expr2`.

#### Lookahead

<code>& <i>expr</i></code>

Succeeds if the expression `expr` can be matched, but does not consume anything from the input stream.

#### Negative Lookahead

<code>~ <i>expr</i></code>

Succeeds if the expression `expr` cannot be matched, and does not consume anything from the input stream.

### Built-in Rules

`letter`: Matches a single character which is a letter (either uppercase or lowercase).

`lower`: Matches a single lowercase letter.

`upper`: Matches a single uppercase letter.

`digit`: Matches a single character which is a digit from 0 to 9.

`hexDigit`: Matches a single character which is a either digit or a letter from A-F.

`alnum`: Matches a single letter or digit; equivalent to `letter | digit`.

`space`: Matches a single whitespace character (e.g., space, tab, newline, etc.)

`end`: Matches the end of the input stream.
