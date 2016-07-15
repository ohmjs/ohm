#!/bin/bash

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
git add doc dist visualizer
git commit -m "Update from master@${OHM_REV}"
git push origin master
