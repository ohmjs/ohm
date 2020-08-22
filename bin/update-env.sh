#!/bin/bash

# This little script can be used in NPM scripts like pretest, prebuild, etc.
# to automatically run `yarn install` when package.json has changed.

EXEC_NAME=$(basename $0)

if [ package.json -nt .install-timestamp ]; then
  echo "$EXEC_NAME: running 'yarn install' because package.json has changed."
  # Use --ignore-scripts so that "prepublish" is skipped. We still want
  # "postinstall" so run it manually.
  yarn install --ignore-scripts && yarn run postinstall; touch .install-timestamp
fi
