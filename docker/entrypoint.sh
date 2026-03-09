#!/bin/bash

function usage() {
  echo "Usage: docker run --rm -v \`pwd\`:/local ohm:lastest <cmd>"
  echo ""
  echo "  where cmd is compile, generateBundles or shell"
  echo ""
  echo "  compile usage: [(--debug|-d)] [(--grammarName|-g) <name>] [(--output|-o) <file>] <ohm-grammar-file>"
  echo ""
  echo "  generateBundles - currently not working"
  echo ""
  echo "  shell: drop into a bash shell in the container, useful for debug the docker build"
  echo ""
}

if [ "$1" = "help" ] || [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
  usage
  exit 0
fi

case "$1" in
  compile)
    shift
    mkdir -p /local
    cd /local
    node \
      --disable-warning=ExperimentalWarning \
      /ohm/packages/compiler/dist/src/cli.js "$@"
    ;;
  generateBundles)
    set -x
    shift
    mkdir -p /local
    cd /local
    node /ohm/packages/cli/src/cli.js generateBundles "$@"
    ;;
  shell)
    /bin/bash
    ;;
  *)
    echo "Unknown command: $1"
    usage
    exit 1
    ;;
esac
