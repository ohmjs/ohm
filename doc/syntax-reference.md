# Syntax Reference

This document describes the syntax of the _Ohm language_, which is a variant of parsing expression grammars (PEGs). If you have experience with PEGs, the Ohm syntax will mostly look familiar, but there are a few important differences to note:

- When naming rules, **case matters**: whitespace is implicitly skipped inside a rule application if the rule name begins with an uppercase letter. For further information, see [Syntactic vs. Lexical Rules](#syntactic-lexical).
- Grammars are purely about recognition: they do not contain semantic actions (those are defined separately) or bindings. The separation of semantic actions is one of the defining features of Ohm -- we believe that it improves modularity and makes both grammars and semantics easier to understand.
- Alternation expressions support _case names_, which are used in [inline rule declarations](#inline-rules). This makes semantic actions for alternation expressions simpler and less error-prone.
- Ohm does not (yet) support semantic predicates.

Ohm is closely related to [OMeta](http://tinlizzie.org/ometa/), another PEG-based language for parsing and pattern matching. Like OMeta, Ohm supports a few features not supported by many PEG parsing frameworks:

- [Rule applications](#rule-application) can accept parameters. This makes it possible to write higher-order rules, such as the built-in `ListOf` rule.
- Grammars can be extended in an object-oriented way -- see [Defining, Extending, and Overriding Rules](#defining-extending-and-overriding-rules).
- [Object](#objects) and [array](#arrays) patterns allow grammars to match structured data.

## Terminology

<script type="text/markscript">
  var ohm = require('ohm-js');
  function checkGrammar(source) {
  	assert(ohm.grammar(source));
  	return '';
  }
  markscript.transformNextBlock(checkGrammar);
</script>

```
Arithmetic {
  Expr = "1 + 1"
}
```

This is a grammar named "Arithmetic", which has a single rule named "Expr". The right hand side of _Expr_ is known as a "rule body". A rule body may be any valid _parsing expression_.

## Parsing Expressions

Here is a full list of the different kinds of parsing expressions supported by Ohm:

### Terminals

These are the fundamental building blocks of Ohm grammars.

#### String literal

`"hello there"`

Matches exactly the characters contained inside the quotation marks.

Special characters (`"`, `\`, and `'`) can be escaped with a backslash -- e.g., `"\""` will match a literal quote character in the input stream. Other valid escape sequences are: `\b` (backspace), `\f` (form feed), `\n` (line feed), `\r` (carriage return), and `\t` (tab).

#### Number literal

`-42`

Matches a positive or negative integer value.

#### Keywords

`true`: Matches the boolean value `true`.

`false`: Matches the boolean value `false`.

`null`: Matches a null value (or the equivalent in the host language).

### Rule Application

<code><i>ruleName</i></code>

Matches the body of the rule named _ruleName_. For example, the built-in rule `letter` will parse a string of length 1 that is a letter.

<code><i>ruleName</i>&lt;<i>expr</i>&gt;</code>

Matches the body of the _parameterized rule_ named _ruleName_, substituting the parsing expression _expr_ as its first parameter. For parameterized rules with more than one parameter, the parameters are comma-separated, e.g. `ListOf<field, ";">`.

### Repetition operators

<code><i>expr</i> *</code>

Matches the expression _expr_ repeated 0 or more times. E.g., `"a"*` will match `''`, `'a'`, `'aa'`, ...

Inside a _syntactic rule_ -- any rule whose name begins with an upper-case letter -- spaces before a match are automatically skipped. E.g., `"a"*` will match `" a a"` as well as `"aa"`. See the documentation on [syntactic and lexical rules](#syntactic-lexical) for more information.

<code><i>expr</i> +</code>

Matches the expression _expr_ repeated 1 or more times. E.g., `letter+` will match `'x'`, `'xA'`, ...

As with the `*` operator, spaces are skipped when used in a [syntactic rule](#syntactic-lexical).

<code><i>expr</i> ?</code>

Tries to match the expression _expr_, succeeding whether it matches or not. No input is consumed if it does not match.

### Sequence

<code><i>expr1</i> <i>expr2</i></code>

Matches the expression `expr1` followed by `expr2`. E.g., `"grade" letter` will match `'gradeA'`, `'gradeB'`, ...

As with the `*` and `+` operators, spaces are skipped when used in a [syntactic rule](#syntactic-lexical). E.g., `"grade" letter` will match `' grade A'` as well as `'gradeA'`.

### Alternation

<code><i>expr1</i> | <i>expr2</i></code>

Matches the expression `expr1`, and if that does not succeed, matches the expression `expr2`. E.g., `letter | number` will match `'a'`, `'9'`, ...

### Lookahead

<code>& <i>expr</i></code>

Succeeds if the expression `expr` can be matched, but does not consume anything from the input stream. Usually used as part of a sequence, e.g. `letter &number` will match `'a9'`, but only consume 'a'. `&"a" letter+` will match any string of letters that begins with 'a'.

### Negative Lookahead

<code>~ <i>expr</i></code>

Succeeds if the expression `expr` cannot be matched, and does not consume anything from the input stream. Usually used as part of a sequence, e.g., `~"\n" any` will consume any single character that is not a new line character.

### Arrays

<code>[ <i>expr</i> ]</code>

Matches an Array object whose contents match _expr_. E.g., `["hey"]` will match an Array having the string `'hey'` as its only element.

If _expr_ is a Sequence, it will match successive elements in the Array, beginning at index 0. E.g., `["a" "b" "c"]` will match the array `['a', 'b', 'c']`.

<script type="text/markscript">
  assert(ohm.grammar('G { start = ["a" "b" "c"] }').match(['a', 'b', 'c']).succeeded());
  assert(ohm.grammar('G { start = ["a" "b" "c"] }').match(['a', 'b', 'c', 'd']).failed());
  assert(ohm.grammar('G { start = ["a" "bc"] }').match(['a', 'b', 'c', 'd']).failed());
</script>

### Objects

<code>{ <i>key</i>: <i>expr</i> } </code>

Matches an object with an [own property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty) named _key_ whose value matches the parsing expression _expr_, and no other properties. E.g., `{"name": any}` matches the object `{name: 'Manuel'}`, but not the object `{name: 'Philip', age: 31}`.

<code>{ <i>key</i>: <i>expr</i>, ... }</code>

Like above, but will still match if the object has other properties. E.g., `{stars: 4, ...}` will match the object `{stars: 2, name: 'Noma'}`.

<script type="text/markscript">
  assert(ohm.grammar('G { start = {"name": any} }').match({name: 'Manuel'}).succeeded());
  assert(ohm.grammar('G { start = {"name": any} }').match({name: 'Philip', age: 31}).failed());
  assert(ohm.grammar('G { start = {stars: 2, ...} }').match({stars: 2, name: 'Noma'}).succeeded());
</script>

Any number of comma-separated key/expression pairs can be specified. Other valid patterns are `{}`, which matches an object with no properties, and `{...}`, which matches any object. **NOTE:** In Ohm/JS, object patterns will also match Array objects.

## Built-in Rules

(See [src/built-in-rules.ohm](../src/built-in-rules.ohm).)

`any`: Matches a single item from the input stream. For a string, it will match any one character.

`letter`: Matches a single character which is a letter (either uppercase or lowercase).

`lower`: Matches a single lowercase letter.

`upper`: Matches a single uppercase letter.

`digit`: Matches a single character which is a digit from 0 to 9.

`hexDigit`: Matches a single character which is a either digit or a letter from A-F.

`alnum`: Matches a single letter or digit; equivalent to `letter | digit`.

`space`: Matches a single whitespace character (e.g., space, tab, newline, etc.)

`end`: Matches the end of the input stream. Equivalent to `~any`.

<code>ListOf&lt;<i>elem</i>, <i>sep</i>&gt;</code>: Matches the expression _elem_ zero or more times, separated by something that matches the expression _sep_. E.g., `ListOf<letter, ",">` will match `''`, `'a'`, and `'a, b, c'`.

## Grammar Syntax

### Grammar Inheritance

<code><i>grammarName</i> &lt;: <i>supergrammarName</i> { ... }</code>

Declares a grammar named `grammarName` which inherits from `supergrammarName`.

### Defining, Extending, and Overriding Rules

<code><i>ruleName</i> = <i>expr</i></code>

Defines a new rule named `ruleName` in the grammar, with the parsing expression `expr` as the rule body. Throws an error if a rule with that name already exists in the grammar or one of its supergrammars.

<code><i>ruleName</i> := <i>expr</i></code>

Defines a rule named `ruleName`, overriding a rule of the same name in a supergrammar. Throws an error if no rule with that name exists in a supergrammar.

<code><i>ruleName</i> += <i>expr</i></code>

Extends a supergrammar rule named `ruleName`, throwing an error if no rule with that name exists in a supergrammar. The rule body will effectively be <code><i>expr</i> | <i>oldBody</i></code>, where `oldBody` is the rule body as defined in the supergrammar.

#### Rule Descriptions

Rule declarations may optionally have a description, which is a parenthesized "comment" following the name of the rule in its declaration. Rule descriptions are used to produce better error messages for end users of a language when input is not recognized. For example:

<code>
ident  (an identifier)
  = ~keyword name
</code>

<h3 id="syntactic-lexical">Syntactic vs. Lexical Rules</h3>

A _syntactic rule_ is a rule whose name begins with an uppercase letter, and _lexical rule_ is one whose name begins with a lowercase letter. The difference between lexical and syntactic rules is that syntactic rules implicitly skip whitespace characters.

For the purposes of a syntactic rule, a "whitespace character" is anything that matches its enclosing grammar's "space" rule. The default implementation of "space" matches ' ', '\t', '\n', '\r', and any other character that is considered whitespace in the [ES5 spec](http://ecma-international.org/ecma-262/5.1/#sec-7.2).

### Inline Rule Declarations

<code><i>expr</i> -- <i>caseName</i></code>

When a parsing expression is followed by the characters `--` and a name, it signals an _inline rule declaration_. This is most commonly used in alternation expressions to ensure that each branch has the same arity. For example, the following declaration:

<pre><code>AddExp = AddExp "+" MulExp  -- plus
       | MulExp
</code></pre>

is equivalent to:

<pre><code>AddExp = AddExp_plus
       | MulExp
AddExp_plus = AddExp "+" MulExp
</code></pre>

### Parameterized Rules

TODO
