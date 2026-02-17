#!/bin/bash
# Bump the version of the three wasm-related packages to the same version.
# Usage: bin/bump-version.sh 18.0.0-beta.5

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 18.0.0-beta.5"
  exit 1
fi

VERSION="$1"

PACKAGES=(
  packages/runtime/package.json
  packages/compiler/package.json
  packages/to-ast-compat/package.json
)

for pkg in "${PACKAGES[@]}"; do
  old=$(node -p "require('./$pkg').version")
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('$pkg', 'utf8'));
    pkg.version = '$VERSION';
    fs.writeFileSync('$pkg', JSON.stringify(pkg, null, 2) + '\n');
  "
  name=$(node -p "require('./$pkg').name")
  echo "$name: $old -> $VERSION"
done
