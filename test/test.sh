#!/bin/sh

pushd `dirname $0` > /dev/null

cat ../simple-binding.js simple-binding-test.js | node

popd > /dev/null
