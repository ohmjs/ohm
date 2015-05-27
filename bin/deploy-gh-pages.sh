#!/bin/bash

set -x

# Create the gh-pages branch if we are running on a CI server (e.g., Travis).
if [ -n "$CI" ]; then
  git remote set-branches --add origin gh-pages &&
  git fetch origin &&
  git branch gh-pages origin/gh-pages &&
  git config user.name "bin/deploy-gh-pages.sh" &&
  git config user.email "ci@invalid"
fi

git rev-parse --quiet --verify gh-pages > /dev/null || (echo "No gh-pages branch found."; exit 1)

git checkout gh-pages &&
(
  (
    git checkout master -- doc dist &&
    git commit -am "Update from master@$(git rev-parse --short master)" &&
    git push origin gh-pages
  ); git checkout -
)
