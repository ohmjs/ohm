#!/bin/bash

# Deploys portions of this repository (e.g., doc/) to ohmlang.github.io.
# To run this, you need a checkout of https://github.com/ohmlang/ohmlang.github.io.

# Accepts an optional argument, which is the path to the ohmlang.github.io repository root.
# If not specified, it looks for a directory named ohmlang.github.io in the same directory
# as this repository.

set -e

ROOT=$(npm prefix)
PAGES_DIR=${1:-"$ROOT/../ohmlang.github.io"}
OHM_REV=$(git rev-parse --short master)

if [ ! -d $PAGES_DIR ]; then
  echo "No such directory: $PAGES_DIR" && exit 1
fi

cd $PAGES_DIR
if ! git rev-parse --quiet --verify master > /dev/null; then
  echo "Not a git repository: $PAGES_DIR" && exit 1
fi

git pull --ff-only --no-stat
cp -r "$ROOT/doc" "$ROOT/dist" "$ROOT/visualizer" .
mv visualizer editor  # Temporary until main repo is changed.
git add doc dist editor visualizer
git commit -m "Update from master@${OHM_REV}"
git push origin master
