#!/bin/bash

NODE_MAJOR_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')

# Some projects require type stripping (Node >= 22); skip them altogether.
# TODO: Remove this in May 2026 when Node 20 goes EOL.
if [ "$NODE_MAJOR_VERSION" -lt 22 ]; then
  FILTER="--filter=!@ohm-js/wasm --filter=!labrat"
else
  FILTER=""
fi

pnpm $FILTER -r build && pnpm lint && pnpm $FILTER -r test
