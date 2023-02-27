# Parsing indentation sensitive languages

As of v17, Ohm has experimental support for indentation-sensitive languages. This will make it possible to write Ohm grammars for languages like Python and YAML. **NOTE:** as this is API is experimental, it is outside the scope of semver — which means that we may make breaking changes to the API without a change to Ohm's major version number.

## Background

The Ohm language is based on parsing expression grammars (PEGs), and pure PEGs can't express indentation sensitivity. The usual trick is to pre-process the input and insert explicit `indent` and `dedent` tokens, then parse the modified output. While this works, it has a few downsides:

- Error messages can be confusing, as they refer to the modified input rather than the original input
- You can't use the "real" syntax in the Ohm Editor — your examples inputs need to be pre-processed
- The preprocessing step is trickier than you might think!

For these reasons, we decided to add built-in support for indentation-sensitive languages.

## Making indentation-sensitive grammars

To define an indentation-sensitive language, create a grammar that inherits from `ExperimentalIndentationSensitive`. For example, here is a grammar for language support nested lists of bullet points:

```
import * as ohm from 'ohm-js';

const outline = ohm.grammar(
  String.raw`
    Outline <: IndentationSensitive {
      Items = Item+
      Item = "-" label indent Items dedent  -- withChildren
          | "-" label  -- leaf

      label = (~newline any)* eol

      eol = newline | end
      newline = "\r\n" | "\r" | "\n"
      spaces := (~newline space)*
    }
`,
  {IndentationSensitive: ohm.ExperimentalIndentationSensitive}
);
```

## Implementation details

The `indent` and `dedent` rules are primitive rules defined by `ExperimentalIndentationSensitive`. You can think of them as special characters that automatically inserted at the appropriate points — except that they take up no width in the input stream. They are inserted immediately after the associated indentation characters at the beginning of the line. For example, here is some Python code, with comments indicating where the indents and dedents are inserted:

```python
if col == 3:
  if row == 4: #   # <~~ indent at position 2 on this line
    print("bingo") # <~~ indent at position 4
  print("done")    # <~~ dedent at position 2
```

There is also final dedent at the end of the input.

## Examples

See examples/indentation-sensitive for an example you can experiment with.

## Notes and open questions

- The current implementation _only_ works with spaces (not tabs). Among the indentation-sensitive languages (Python, YAML, Elm, etc.) there are small difference in what characters they allow and how they treat them. We probably want to make this customizable in some way.
