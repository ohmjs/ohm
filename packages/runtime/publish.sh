#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(dirname "$0")"
RUNTIME_DIR="$SCRIPT_DIR"
COMPILER_DIR="$SCRIPT_DIR/../compiler"

# Build both packages
pnpm -C "$RUNTIME_DIR" build
pnpm -C "$COMPILER_DIR" build

# Bump pre-release version (18.0.0-alpha.0 -> alpha.1 -> alpha.2 ...)
npm -C "$RUNTIME_DIR" version prerelease --no-git-tag-version
VERSION=$(node -p "require('$RUNTIME_DIR/package.json').version")

# Set compiler to the same version
npm -C "$COMPILER_DIR" version "$VERSION" --no-git-tag-version

# Swap runtime name for publishing, and ensure it's restored on exit/error/interrupt
npm -C "$RUNTIME_DIR" pkg set name=ohm-js
trap 'npm -C "$RUNTIME_DIR" pkg set name=@ohm-js/runtime' EXIT

# Publish both with alpha tag (pass through any extra args, e.g. --dry-run)
pnpm -C "$RUNTIME_DIR" publish --tag alpha --no-git-checks "$@"
pnpm -C "$COMPILER_DIR" publish --tag alpha --no-git-checks "$@"
