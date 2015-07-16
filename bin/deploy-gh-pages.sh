#!/bin/bash

# Check if we are running on the CI server (e.g., Travis).
if [ -n "$CI" ]; then
  # Commit anything generated during the build.
  git commit -am --no-verify "Add missing files from master@$(git rev-parse --short master)"

  # Create the gh-pages branch.
  git remote set-branches --add origin gh-pages &&
  git fetch origin &&
  git branch gh-pages origin/gh-pages
fi

git rev-parse --quiet --verify gh-pages > /dev/null || (echo "No gh-pages branch found."; exit 1)

git checkout gh-pages &&
(
  (
    git checkout master -- doc dist visualizer &&
    git commit -am "Update from master@$(git rev-parse --short master)" &&
    git push origin gh-pages
  ); git checkout -q -
)
