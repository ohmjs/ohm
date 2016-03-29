# Contributing to Ohm

Interested in contributing to Ohm? Great! Here are some tips to help you get
started.

## Prerequisites

To develop Ohm, you'll need a recent version of [Node.js](https://nodejs.org).

## Setup

First, clone the repository:

    git clone https://github.com/cdglabs/ohm.git

Then, install the dev dependencies:

    cd ohm
    npm install

_Note: the `postinstall` script (which is automatically run by `npm install`)
will install a git pre-commit hook. See [here](#pre-commit-checks) for more
information._

## Useful Scripts

* Use `npm test` to run the unit tests.
* `npm run test-watch` re-runs the unit tests every time a file changes.
* `npm run build` builds [dist/ohm.js](./dist/ohm.js) and [dist/ohm.min.js](./dist/ohm.min.js),
  which are stand-alone bundles that can be included in a webpage.
* When editing Ohm's own grammar (in `src/ohm-grammar.ohm`), run
  `npm run bootstrap` to re-build Ohm and test your changes.

## Pull Requests

In general, we are happy to receive pull requests. If you've found a bug in
Ohm, please [file an issue describing the problem](https://github.com/cdglabs/ohm/issues)
before submitting a PR. If the fix is non-trivial, it's usually best to wait
for a response before putting a lot of work into a fix.

For new features, it's also best to discuss the idea with us (via an issue or
an email to the mailing list) before submitting a pull request.

### Formatting PRs

To make the review process easier and maximize the chances that your pull
request is accepted, here are some guidelines:

- Use [informative commit messages](http://chris.beams.io/posts/git-commit/)
  that follow the standard [git commit template](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
- Include only the changes that are relevant to your bug/feature. Before
  submitting, take a look over the diff to ensure that you haven't included
  any unrelated changes.
- Ideally, use **one commit per pull request**. You can use `git rebase` to
  [squash work-in-progress commits](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html).
  The commit(s) should reflect a "logical" history, not necessarily the exact
  sequence of changes that you made in your local branch.
- Try to keep your pull requests small -- anything more than a few hundred lines
  is too big. If necessary, break your changes up into several small PRs.
- Make sure the tests pass and there are no linter errors (the pre-commit hook
  will do this automatically).

### Code Review

When you submit a pull request, one of the Ohm developers will review it and
(most likely) leave comments on it. Don't worry -- this is not about judging
you, it's about improving the code and helping you get your pull request
integrated into the project.

Many people have written about the benefits of peer code reviews; a good
starting point is [The Unexpected Outcomes of Code Review](http://blog.codeclimate.com/blog/2013/10/09/unexpected-outcomes-of-code-reviews/)
by Michael Bernstein. A code review is a dialog. It shouldn't be seen as an
inspection or approval process.

After someone reviews your pull request, it's up to you to follow up on each
of the comments. Often, this means uploading a new commit that incorporates
the suggestions made by the reviewer. In other cases, you might leave a
comment answering their question or explaining why you disagree with a
suggestion.

When the reviewer thinks your PR is ready to be merged, they will respond
with an "LGTM" (which stands for "looks good to me"). If you have commit
rights, this means that you should now merge your PR into master. If you don't
have commit rights, the reviewer will usually merge the PR for you.

## Pre-commit Checks

When you run `npm install` in an Ohm checkout, it will automatically install
a pre-commit hook into `.git/hooks/pre-commit`. Every time you commit to the
repository, the pre-commit script checks that all tests pass, and that the
code passes a lint check. The linter ([ESLint](http://eslint.org/)) checks for
common JavaScript errors, and also enforces a consistent style on the code.
