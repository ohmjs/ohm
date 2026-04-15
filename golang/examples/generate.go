package main

// The docker image tag needs to take into account the version of the goohm runtime library.
//go:generate docker run --rm -v "$PWD:/local" ohmjs/ohm:18.0.0-beta.13 compile my-grammar.ohm
