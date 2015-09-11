#!/bin/bash

# This script sets up a few things helpful for developers who are contributing
# to this package. It is intended to be run automatically in the postinstall
# hook, but can also be run manually.

EXEC_NAME=$(basename $0)
ROOT=$(npm prefix)

GIT_DIR=$(git rev-parse --git-dir 2> /dev/null)

if [ "$GIT_DIR" == "" ]; then
  echo "$EXEC_NAME: Unable to find .git directory."
  exit 1
fi

# Install a merge driver called "ours" that is just an alias to `true`.
# This is referenced by .gitattributes, to prevent conflicts with files
# that are generated during the build process.
git config --get merge.ours.driver > /dev/null || git config --add merge.ours.driver true

# Try to install a project-specific pre-commit hook.
cp -n "$ROOT/bin/pre-commit" "$GIT_DIR/hooks/pre-commit"
if [ $? -ne 0 ]; then
  echo "$EXEC_NAME: pre-commit script already exists; not overwriting."
fi

echo "$EXEC_NAME: Developer setup complete."
