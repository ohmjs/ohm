#!/bin/bash
options=${NPM_PACKAGE_BROWSERIFY_OPTIONS:-$npm_package_browserify_options}

browserify $options
