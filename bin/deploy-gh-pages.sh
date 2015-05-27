#!/bin/bash

set -x

(git checkout gh-pages || (git fetch origin && git checkout -b gh-pages origin/gh-pages)) &&
(
  (
    git checkout master -- doc dist &&
    git config user.name "Travis CI" &&
    git config user.email "travis@w3ctag.org" &&
    git commit -am "Update from master@$(git rev-parse --short master)" &&
    git push origin gh-pages
  ); git checkout -
)
