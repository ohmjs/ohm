# Using Ohm with TypeScript

Out of the box, Ohm mostly "just works" with TypeScript. The the built-in type definitions cover the core API, though some less frequently used parts are not (yet) there. If you notice something that's missing, please feel free to [open an issue](https://github.com/harc/ohm/issues/new) or submit a PR.

You can see some projects that are using Ohm with TypeScript [on Sourcegraph](https://sourcegraph.com/search?q=context:global+ohm-js+lang:TypeScript+-repo:%5Egithub%5C.com/harc/ohm%24+select:repo+&patternType=literal).

## Grammar-specific type definitions

As of Ohm v16, it's also possible to generate type definitions that are specific to your grammar. The main advantages of this are:

- the TypeScript compiler can check that your semantic actions have the correct number of arguments and a consistent return type.
- IDEs such as [VS Code](https://code.visualstudio.com/) can autocomplete action names, show tooltips with argument types (`IterationNode`, `NonterminalNode`, or `TerminalNode`), etc.

To enable grammar-specific type definitions:

1. Install the `@ohm-js/cli` package (e.g., `npm install -D @ohm-js/cli` to add it as a dev dependency).
2. Put your grammar in a separate .ohm file, if it isn't already.
3. Use the Ohm CLI to generate a bundle (.ohm-bundle.js) for your grammar, along with the associated type definitions (.d.ts). For example, if your grammar is in `src/my-grammar.ohm`:

   ```
   npx ohm generateBundles --withTypes src
   ```

   ...will create `src/my-grammar.ohm-bundle.js` and `src/my-grammar.ohm-bundle.d.ts`. You can directly import the bundle like this:

   ```
   import grammar from './my-grammar.ohm-bundle'
   ```

   For more information, see the [Ohm TypeScript example](https://github.com/harc/ohm/blob/main/examples/typescript/src/arithmetic.ts).
