# Contributing to Ohm

Interested in contributing to Ohm? Great! Here are some tips to help you get
started.

## Getting Started

### Prerequisites

To develop Ohm, you'll need a recent version of [Node.js](https://nodejs.org).

### Basic Setup

First, clone the repository:

    git clone https://github.com/cdglabs/ohm.git

Then, install the dev dependencies:

    cd ohm
    npm install

_Note: the `postinstall` script (which is automatically run by `npm install`)
will install a git pre-commit hook. See [here](#pre-commit-checks) for more
information._

### Useful Scripts

* Use `npm test` to run the unit tests.
* `npm run test-watch` re-runs the unit tests every time a file changes.
* `npm run build` builds [dist/ohm.js](./dist/ohm.js) and [dist/ohm.min.js](./dist/ohm.min.js),
  which are stand-alone bundles that can be included in a webpage.
* When editing Ohm's own grammar (in `src/ohm-grammar.ohm`), run
  `npm run bootstrap` to re-build Ohm and test your changes.

## Doing Development

See our recommended [Git workflow](https://github.com/cdglabs/ohm/wiki/Git-Workflow).

### Pre-commit Checks

When you run `npm install` in an Ohm checkout, it will automatically install
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
