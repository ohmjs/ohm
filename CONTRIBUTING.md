# Contributing to Ohm

Interested in contributing to Ohm? This document explains our guidelines for
submitting pull requests to the [Ohm GitHub repository](https://github.com/cdglabs/ohm).
For information on how to get started with Ohm development, please see the
[contributor guide](doc/contributor-guide.md).

## Before submitting

If you think you've found a bug in Ohm, please [file an issue describing the problem](https://github.com/cdglabs/ohm/issues)
before submitting a PR. If the fix is non-trivial, it's usually best to wait
for a response before putting a lot of work into a fix.

For new features, it's also best to discuss the idea with us (via an issue or
an email to the [mailing list](https://groups.google.com/a/ycr.org/forum/#!forum/ohm)) before submitting a pull request.

Also, please ensure the tests pass (using `npm test`) and that there are no
lint errors -- though the [pre-commit hook](doc/contributor-guide.md#pre-commit-checks)
should do this automatically.

## Formatting

To make the review process easier and maximize the chances that your pull
request is accepted, here are some guidelines:

- Use [informative commit messages](http://chris.beams.io/posts/git-commit/)
  that follow the standard [git commit template](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).
- Include only the changes that are relevant to your bug/feature. Before
  submitting, take a look over the diff to ensure that you haven't included
  any unrelated changes.
- Ideally, use **one commit per pull request**.
- **Do not include merge commits** or commits containing mistakes that are
  fixed in a later commit. See [our Git workflow tips](https://github.com/cdglabs/ohm/wiki/Git-Workflow)
  for more information.
- Try to keep your pull requests small -- anything more than a few hundred lines
  is too big. If necessary, break your changes up into several small PRs.

## Review Process

When you submit a pull request, one of the Ohm developers will review it and
(most likely) leave comments on it. Don't worry -- this is not about judging
you, it's about improving the code and helping you get your pull request
integrated into the project. A code review is a dialog; it shouldn't be seen
as an inspection or approval process.

Here are the steps involved in a typical review:

- You submit your pull request, including a descriptive message describing
  its purpose.
- An Ohm team member leaves comments on your code, with questions and
  suggestions.
- You follow up on each comment by answering the question, incorporating the
  suggestion, or explaining why you disagree.
- When the reviewer thinks your PR is ready to be merged, they will respond
  with a comment saying "LGTM", meaning "looks good to me". At this point, if
  you have permission, you should now merge your PR into master. If not, the
  reviewer will merge it for you.
