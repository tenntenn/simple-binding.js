#!/bin/sh

pushd `dirname $0` > /dev/null

pushd ../ > /dev/null

cat `grep -v '^#' jsfiles.txt | sed '/^$/d' | awk -v ORS=' ' '1;END{printf"\n"}'` test/simple-binding-test.js > test/target.js

popd > /dev/null

node target.js

popd > /dev/null
