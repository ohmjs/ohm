#!/bin/bash

pnpm -r build && pnpm -r --if-present api-report && pnpm lint && pnpm -r test
