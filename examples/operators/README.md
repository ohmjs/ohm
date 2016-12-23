# Operator Precedence and Associativity Examples

There are at least four different ways to define the syntax of expressions containing a nontrivial operator precedence hierarchy.

**A left recursive grammar**

```
Exp     = Exp addop Term        --binary
        | Term
Term    = Term mulop Factor     --binary
        | Factor
Factor  = Primary expop Factor  --binary
```

**The traditional PEG Style**

```
Exp     = Term (addop Term)*
Term    = Factor (mulop Factor)*
Factor  = Primary (expop Primary)*
```

**Using Ohm’s parameterized rules**

```
Exp     = NonemptyListOf<Term, addop>
Term    = NonemptyListOf<Factor, mulop>
Factor  = NonemptyListOf<Primary, expop>
```

**Leaving precedence resolution to the semantics**

```
Exp     = Primary (binop Primary)*
```

This example shows how to write the same grammar all four ways, with an associated semantics that produces an AST.

The idea is to give grammar designers a look into the various alternatives to pick a style that’s right for them. Even though the first of the four will generally be preferred.

There is no user interface for this demo; simply run `npm test` at the top-level to see the grammars and semantics in action.
