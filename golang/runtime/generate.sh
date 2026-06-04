#!/bin/sh

REPO_ROOT=$(git rev-parse --show-toplevel)

if [ "$OHM_DOCKER_IMAGE_VERSION" != "" ]; then
  VERSION="$OHM_DOCKER_IMAGE_VERSION"
else
  VERSION=$(cat "${REPO_ROOT}/packages/runtime/package.json" | jq -r '.version')
fi
echo "Using Ohm Docker image version: ${VERSION}"
docker run --rm -v "${REPO_ROOT}:/local" ohmjs/ohm:${VERSION} compile -o golang/runtime/es5.wasm examples/ecmascript/src/es5.ohm