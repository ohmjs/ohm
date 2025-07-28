#!/bin/bash

NODE_MAJOR_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')

# Some projects require Node >= 24; skip them altogether.
if [ "$NODE_MAJOR_VERSION" -lt 24 ]; then
  FILTER="--filter=!@ohm-js/wasm --filter=!labrat"
else
  FILTER=""
fi

pnpm $FILTER -r build && pnpm lint && pnpm $FILTER -r test
