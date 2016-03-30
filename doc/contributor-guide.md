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

Here's the typical flow for developing a new Ohm feature:

- Create a new feature branch off master, giving it a descriptive name.
  E.g., `git checkout -b incremental-parsing master`.
- Commit to your feature branch.
- Use `git rebase` to keep your branch up to date with development that is
  taking place on the master branch. (You can also use `git merge`, if you
  prefer, but that will result in merge commits which you'll need to remove
  before review.)
- When your feature is ready for review, push your branch and submit a pull
  request. Before pushing, make sure that your commit history is clean -- it
  should contain one commit for each _logical_ unit of work:

    * A single commit is preferable. For larger features, more than one
      commit is ok.
    * Do NOT include merge commits, or commits with mistakes that are fixed
      by a later commit.
    * If necessary, you can use `git rebase -i` and/or `git merge --squash`
      to clean up your history. See [Git - Rewriting History](https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History)
      for more information.

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
