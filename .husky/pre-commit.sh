#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm test && npm run lint
