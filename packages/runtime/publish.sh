#!/bin/bash
set -euo pipefail

cd "$(dirname "$0")"
COMPILER_DIR=../compiler

# Build both packages
pnpm build
pnpm -C "$COMPILER_DIR" build

# Bump pre-release version (18.0.0-alpha.0 -> alpha.1 -> alpha.2 ...)
npm version prerelease --no-git-tag-version
VERSION=$(node -p "require('./package.json').version")

# Set compiler to the same version
npm --prefix "$COMPILER_DIR" version "$VERSION" --no-git-tag-version

# Swap runtime name for publishing, and ensure it's restored on exit/error/interrupt
npm pkg set name=ohm-js
trap 'npm pkg set name=@ohm-js/runtime' EXIT

# Publish both with alpha tag (pass through any extra args, e.g. --dry-run)
pnpm publish --tag alpha --no-git-checks "$@"
(cd "$COMPILER_DIR" && pnpm publish --tag alpha --no-git-checks "$@")
