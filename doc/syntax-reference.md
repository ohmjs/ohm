# Syntax Reference

## Grammars and Rules

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

## Parsing Expressions

A rule body must be a valid _parsing expression_. We've shown two of the simplest kinds of parsing expressions above: a string literal, and a rule application. Here is a full list of the different kinds of parsing expressions supported by Ohm:

### String Literal

`"hello there"`

Matches exactly the characters contained inside the quotation marks.

### Rule Application

_ruleName_

Matches the body of the rule named _ruleName_.

### Anything

`_`

Matches a single character from the input stream.

### Repetition operators

<code><i>expr</i> *</code>

Matches the expression `expr` repeated 0 or more times.

<code><i>expr</i> +</code>

Matches the expression `expr` repeated 1 or more times.

<code><i>expr</i> ?</code>

Matches the optional expression `expr`, succeeding whether it matches or not.

### Sequence

<code><i>expr1</i> <i>expr2</i></code>

Matches the expression `expr1` followed by `expr2`.

### Alternation

<code><i>expr1</i> | <i>expr2</i></code>

Matches the expression `expr1`, and if that does not succeed, matches the expression `expr2`.

### Lookahead

<code>& <i>expr</i></code>

Succeeds if the expression `expr` can be matched, but does not consume anything from the input stream.

### Negative Lookahead

<code>~ <i>expr</i></code>

Succeeds if the expression `expr` cannot be matched, and does not consume anything from the input stream.

## Built-in Rules

(See [src/built-in-rules.ohm](../src/built-in-rules.ohm).)

`letter`: Matches a single character which is a letter (either uppercase or lowercase).

`lower`: Matches a single lowercase letter.

`upper`: Matches a single uppercase letter.

`digit`: Matches a single character which is a digit from 0 to 9.

`hexDigit`: Matches a single character which is a either digit or a letter from A-F.

`alnum`: Matches a single letter or digit; equivalent to `letter | digit`.

`space`: Matches a single whitespace character (e.g., space, tab, newline, etc.)

`end`: Matches the end of the input stream.
