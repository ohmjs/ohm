# Ohm Errors

## Instantiating Grammars

These errors can occur when [instatiating a grammar](https://github.com/cdglabs/ohm/blob/master/doc/api-reference.md#instantiating-grammars)
from a grammar definition.

### Grammar Syntax Error

Example:

    Uncaught ohm.error.GrammarSyntaxError: Failed to parse grammar:
    Line 5, col 11:
      4 | G {
    > 5 |   start = *x
                    ^
      6 | }
    Expected "~", "&", "#", an identifier, "\"", a number, "(", "[", "``", "{", "--", "|", or "}"

Indicates that the grammar definition is not well-formed according to the syntax
of the Ohm language. See the [syntax reference](./syntax-reference.md) for more
details.

### Undeclared Grammar

Example:

    Uncaught ohm.error.UndeclaredGrammar: Grammar Foo is not declared in namespace [object Object]

Indicates that the grammar definition refers to another grammar by name, but
that name does not refer to a grammar that Ohm knows about. This can happen
when you instantiate a grammar that inherits from another grammar. Possible
fixes:

- If you're defining multiple grammars, ensure that the supergrammar appears
  first in the grammar definition.
- If the supergrammar was defined elsewhere, you need to pass a namespace
  argument to the instantiation function (`ohm.grammar()`, etc.), and the
  namespace must reference the supergrammar with the appropriate property
  name. E.g.:

    ```js
    var ns = {};
    ns.G1 = ohm.grammar('G1 {}');
    var g2 = ohm.grammar('G2 <: G1 {}', ns);
    ```

### Duplicate Grammar Declaration

Example:

    Uncaught ohm.error.DuplicateGrammarDeclaration: Grammar G is already declared in namespace [object Object]

Occurs when a grammar definition defines a grammar with the same name
as an existing grammar in the same namespace. Possible fixes:

- Make sure you're not accidentally instantiating the same grammar twice
- Instantiate the second grammar in a different namespace, or without
  using a namespace.

### Undeclared Rule

Example:

    Uncaught ohm.error.UndeclaredRule: Rule lettr is not declared in grammar G

Occurs when the body of a rule refers to a another rule that is not defined in
the grammar or in any of its supergrammars.

### Cannot Override Undeclared Rule

Example:

    Uncaught ohm.error.CannotOverrideUndeclaredRule: Cannot override rule foo because it is not declared in BuiltInRules

Occurs when a rule is being _overridden_ (using `:=`), but no rule with that name
exists in the supergrammar. Learn more about defining, extending, and overriding
rules in the [syntax reference](syntax-reference.md#defining-extending-and-overriding-rules).

### Cannot Extend Undeclared Rule

Example:

    Uncaught ohm.error.CannotExtendUndeclaredRule: Cannot extend rule start foo it is not declared in BuiltInRules

Occurs when a rule is being _extended_ (using `+=`), but no rule with that name
exists in the supergrammar. Learn more about defining, extending, and overriding
rules in the [syntax reference](syntax-reference.md#defining-extending-and-overriding-rules).

### Duplicate Rule Declaration

Example:

    Uncaught ohm.error.DuplicateRuleDeclaration: Duplicate declaration for rule 'letter' in grammar 'G' (originally declared in grammar 'BuiltInRules')

Occurs when a rule is being _defined_ (using `=`), but a rule with that name
already exists in the grammar or supergrammar. If it exists in the supergrammar,
you can only override (`:=`) or extend (`+=`) the rule. Learn more about
defining, extending, and overriding rules in the [syntax reference](syntax-reference.md#defining-extending-and-overriding-rules).
