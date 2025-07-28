# Contributing to Ohm

Interested in contributing to Ohm? Great! Here are some tips to help you get
started.

## Getting Started

### Prerequisites

To develop Ohm, you'll need a recent version of [Node.js](https://nodejs.org).
We support all [_Active LTS_ and _Maintenance LTS_ releases][nodejs-releases].

[nodejs-releases]: https://nodejs.dev/en/about/releases/

You also need to install [pnpm](https://pnpm.io/).

### Basic Setup

First, clone the repository:

    git clone https://github.com/cdglabs/ohm.git

Then, install the dev dependencies:

    cd ohm
    pnpm install

_Note: the `postinstall` script (which is automatically run by `pnpm install`)
will install a git pre-commit hook. See [here](#pre-commit-checks) for more
information._

### Useful Scripts

The following scripts are useful when developing the main `ohm-js` package:

- Use `pnpm test` to run the unit tests.
- `pnpm run test-watch` re-runs the unit tests every time a file changes.
- `pnpm build` builds `dist/ohm.js` and `dist/ohm.min.js`,
  which are stand-alone bundles that can be included in a webpage.
- When editing Ohm's own grammar (in `src/ohm-grammar.ohm`), run
  `pnpm run bootstrap` to re-build Ohm and test your changes.

## Doing Development

See our recommended [Git workflow](https://github.com/ohmjs/ohm/wiki/Git-Workflow).

### Pre-commit Checks

When you run `pnpm install` in an Ohm checkout, it will automatically install
a pre-commit hook into `.git/hooks/pre-commit`. Every time you commit to the
repository, the pre-commit script checks that all tests pass, and that the
code passes a lint check. We use [ESLint](http://eslint.org/), which helps
prevent many common programming errors, and ensures that the code follows a
consistent style.

Usually, you should deal with a lint error by fixing the code so that ESLint
no longer complains about it. However, there are a few cases where it makes
sense to disable the error:

- If you added new `console.log` statement, and **you are sure that it is
  actual useful**, you can disable the warning like this:

  ```
  console.log('a useful message');  // eslint-disable-line no-console
  ```

- If you need to introduce a global variable (are you sure?), see the ESLint
  documentation on [specifying globals](http://eslint.org/docs/user-guide/configuring#specifying-globals).

If you need to temporarily commit something that doesn't pass the checks, you
can use `git commit --no-verify` -- but use this sparingly!

## Writing documentation

- The documentation under doc/ is intended to work on both GitHub and
  [ohmjs.org](https://ohmjs.org). Since the prefix for GitHub docs is
  `doc/`, and the prefix on ohmjs.org is `docs/`, a link that includes
  one of those prefixes won't work in both places!
- When linking to other documentation pages, use relative links. Examples:
  - `[Syntactic vs. Lexical Rules](#syntactic-lexical)`
  - `[negative lookahead](./syntax-reference.md#negative-lookahead-)`
- When linking to source code, use an absolute link to GitHub. Example:
  - `The [operators example](https://github.com/ohmjs/ohm/tree/main/examples/operators)`
- In the [changelog][], use absolute links to GitHub when linking to docs,
  as that file is intended to be read in a text editor or on GitHub.
- Images go under `doc/images/` and should be linked with an absolute URL to
  ohmjs.org. Example:
  - `https://ohm.js.org/img/docs/matching.png` for `docs/images/matching.png`.

[changelog]: https://github.com/ohmjs/ohm/blob/main/packages/ohm-js/CHANGELOG.md

## Publishing

To version and publish the ohm-js package:

1. Update package.json manually to bump the version number.
2. Make sure the CHANGELOG.md is up to date.
3. Run `pnpm publish`
4. Run `git push && git push --tags`
5. Create a release on GitHub, pasting in the changelog contents.
