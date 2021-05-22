# Patterns and Pitfalls

## Grammars

###  Dealing with Greedy Matching

In Ohm, like other PEG-based tools, the [repetition operators](https://github.com/harc/ohm/blob/0af8165c2ff0e4ddef28c71f56ef38c7310d2db9/doc/syntax-reference.md#repetition-operators---) `*` and `+` are _greedy_, meaning they always consume as much input as possible. This is different than the way that `*` works in regular expressions. For example, the regular expression `/^a*a/` will successfully match `'aaa'`, whereas in Ohm, the equivalent parsing expression `"a"* "a"` can never match any input.

You can use [negative lookahead](https://github.com/harc/ohm/blob/0af8165c2ff0e4ddef28c71f56ef38c7310d2db9/doc/syntax-reference.md#negative-lookahead-) (`~`) to prevent a repetition from matching too many characters. E.g., the following rule will match all but the last 'a' in a string:

```
allButLastA = (~("a" end) "a")*
```

The expression `"a" end` means "match an 'a' at the end of the input", and `~("a" end) "a"` means "match an 'a' only if it is not the last 'a' at the end of the input".

For a more realistic example, see the next section on delimited strings.

### Delimited Strings

A common use for negative lookahead is implementing delimited strings and comments. For example, to support JavaScript-style multiline strings delimited by `` ` ``:

```
stringDelimiter = "`"
string = stringDelimiter (~stringDelimiter any)* stringDelimiter
```

The expression `~stringDelimiter any` means "match any character not matched by _stringDelimiter_".

### Supporting Comments

In most languages, comments are treated as a form of whitespace. Ohm has implicit space skipping ([see Syntactic vs. Lexical rules](https://github.com/harc/ohm/blob/0af8165c2ff0e4ddef28c71f56ef38c7310d2db9/doc/syntax-reference.md#syntactic-vs-lexical-rules)), which is controlled by the _space_ rule. To add comments to your language, you first need to define a _comment_ rule. Here's an example of C-style (`/*`/`*/`-delimited) comments:

```
comment = "/*" (~"*/" any)* "*/"
```

Then, you need to extend the _space_ rule in your grammar so that Ohm will treat the comments as whitespace:

```
space += comment
```

### Matching Exactly _n_ Times

Unlike regular expressions, Ohm does not support [quantifier](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers) syntax to indicate the number of times an expression should be matched. However, this can be implemented using a normal sequence:

```
zipCode = digit digit digit digit
```
