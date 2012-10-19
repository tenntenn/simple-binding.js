#!/bin/sh

pushd `dirname $0` > /dev/null

pushd ../ > /dev/null

cat `awk -v ORS=' ' '1;END{printf"\n"}' jsfiles.txt` test/simple-binding-test.js > test/target.js

popd > /dev/null

node target.js

popd > /dev/null
