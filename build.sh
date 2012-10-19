#!/bin/sh

echo "create minified code..."
java -jar compiler.jar\
     --js_output_file simple-binding.min.js\
     --js `awk -v ORS=' ' '1;END{printf"\n"}' jsfiles.txt`

echo "run testcode..."
cat simple-binding.min.js test/simple-binding-test.js | node
