#!/bin/sh

if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  echo "Usage: docker run --rm -v ${PWD}:/local ohm:dev cmd"
  echo "  cmd = compile, generateBundles"
  exit 0
fi

mkdir -p /local
cd /local

case "$1" in
  compile)
    shift
    node \
      --disable-warning=ExperimentalWarning \
      /workspace/packages/compiler/src/cli.ts "$@"
    ;;
  generateBundles)
    set -x
    shift
    node /workspace/packages/cli/src/cli.js generateBundles "$@"
    ;;
  *)
    echo "Unknown command: $1"
    echo "Usage: docker run --rm -v \${PWD}:/local ohm:dev cmd"
    echo "  cmd = compile, generateBundles"
    exit 1
    ;;
esac
