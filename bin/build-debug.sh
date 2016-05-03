#!/bin/bash
if [ $npm_package_browserify_options ]; then
  options=$npm_package_browserify_options
else
  options=$NPM_PACKAGE_BROWSERIFY_OPTIONS
fi

browserify $options
