#!/bin/sh
BIOME=./node_modules/.bin/biome
ESLINT=./node_modules/.bin/eslint

$BIOME format --write . && $ESLINT --cache --fix .
