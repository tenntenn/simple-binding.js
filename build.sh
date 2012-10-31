#!/bin/sh

echo "concat javascript files..."

cat `grep -v '^#' jsfiles.txt | sed '/^$/d' | awk -v ORS=' ' '1;END{printf"\n"}'` > simple-binding.js

echo "create minified code..."
java -jar compiler.jar --js_output_file simple-binding.min.js --js simple-binding.js

echo "run testcode..."
cat simple-binding.min.js test/simple-binding-test.js | node
