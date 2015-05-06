#!/bin/bash

# This little script can be used in NPM scripts like pretest, prebuild, etc.
# to automatically run `npm install` when package.json has changed.

EXEC_NAME=$(basename $0)

if [ package.json -nt .install-timestamp ]; then
  echo "$EXEC_NAME: running 'npm install' because package.json has changed."
  npm install; touch .install-timestamp
fi
